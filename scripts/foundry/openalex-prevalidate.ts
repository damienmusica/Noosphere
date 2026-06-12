/**
 * OpenAlex B-track pre-validation table generator (vault decision (34)⑥(b)).
 *
 * Usage:
 *   npm run foundry:openalex-prevalidate -- [--domains a,b,c] [--types field,subfield]
 *                                            [--no-metrics-only] [--nodes id1,id2]
 *                                            [--out <path>] [--concurrency N]
 *
 * For each selected /data node that carries a verified `external_ids.wikidata`,
 * this tool queries OpenAlex's keyless public Concepts API two ways and emits a
 * MULTI-SIGNAL comparison row — the legwork the orchestrator used to do by hand:
 *   - direct:  GET /concepts/wikidata:<QID>          (QID round-trip)
 *   - search:  GET /concepts?search=<label>          (rank-1 candidate)
 * and records, per node: the direct concept (id, display_name, level, works_count,
 * cited_by_count, wikidata round-trip), the search rank-1 concept, whether the
 * search rank-1's wikidata equals the node QID, and a name match. It assigns a
 * FIRST-PASS `verdict` (rank1_clean / manual_candidate / absent / object_concept)
 * purely from the signals — the final accept/skip/manual ruling stays with the
 * orchestrator (decision-log (9) path). It NEVER writes /data and NEVER fills
 * external_metrics; it only produces a candidate comparison table.
 *
 * Boundaries (mirrors resolve-wikidata.ts):
 *   - Source-resolution job: reaching the open/free/keyless OpenAlex API is
 *     allowed. This script performs network requests, but nothing in
 *     build/validate:data/export:graph/runtime/CI requires it, and it is NOT in CI.
 *   - Reads /data as ground truth (node id + verified QID); never writes /data.
 *   - Output is candidate comparison material under dist/foundry/ (gitignored),
 *     not a proposal, nothing marked reviewed/indexable.
 *   - No secrets/keys/tokens/OAuth. Read-only, bounded-concurrency pool
 *     (default 6, max 8 — session #17 pitstop; was serial) behind a GLOBAL
 *     politeness gate (~9 req/s < OpenAlex's keyless ~10 rps guidance) +
 *     descriptive User-Agent. Per-node direct+search two-call structure and
 *     all verdict logic unchanged; output rows stay in input order
 *     (deterministic — completion order never affects the table).
 *     No SPARQL, no cloud LLM APIs, no NamuWiki, no article bodies.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, join, resolve } from "node:path";
import { mapWithConcurrency, RateGate } from "./lib/bounded-pool.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const NODES_PATH = join(REPO_ROOT, "data", "nodes.json");
const TRANSLATIONS_PATH = join(REPO_ROOT, "data", "node-translations.json");
const OUT_DEFAULT = join(REPO_ROOT, "dist", "foundry", "openalex-prevalidation", "table.json");

const API = "https://api.openalex.org";
const UA =
  "Noosphere-Foundry-OpenAlex-Prevalidate/1.1 (research atlas; contact: maintainer; keyless)";
const DEFAULT_CONCURRENCY = 6;
const MAX_CONCURRENCY = 8;
const RATE_GATE_MS = 110; // global spacing between request starts ≈ 9 rps

interface Node {
  id: string;
  type: string;
  domain: string;
  status: string;
  external_ids?: Record<string, string>;
  external_metrics?: unknown;
}
interface Concept {
  id?: string;
  wikidata?: string | null;
  display_name?: string;
  level?: number;
  works_count?: number;
  cited_by_count?: number;
}

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a && a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        out[key] = next;
        i++;
      } else out[key] = true;
    }
  }
  return out;
}

function qidFromWikidataUrl(w?: string | null): string | null {
  if (!w) return null;
  const m = w.match(/Q\d+/);
  return m ? m[0] : null;
}

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

function conceptFields(c: Concept | null): Concept | null {
  if (!c) return null;
  return {
    id: c.id,
    wikidata: c.wikidata ?? null,
    display_name: c.display_name,
    level: c.level,
    works_count: c.works_count,
    cited_by_count: c.cited_by_count,
  };
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const nodes = JSON.parse(readFileSync(NODES_PATH, "utf8")) as Node[];
  const translations = JSON.parse(readFileSync(TRANSLATIONS_PATH, "utf8")) as {
    node_id: string;
    locale: string;
    label: string;
  }[];
  const labelOf = new Map(
    translations.filter((t) => t.locale === "en").map((t) => [t.node_id, t.label]),
  );

  let selected: Node[];
  if (typeof args.nodes === "string") {
    const ids = new Set(args.nodes.split(","));
    selected = nodes.filter((n) => ids.has(n.id));
  } else {
    const domains = typeof args.domains === "string" ? new Set(args.domains.split(",")) : null;
    const types =
      typeof args.types === "string"
        ? new Set(args.types.split(","))
        : new Set(["field", "subfield"]);
    selected = nodes.filter((n) => {
      if (n.status !== "reviewed") return false;
      if (!n.external_ids?.wikidata) return false;
      if (!types.has(n.type)) return false;
      if (domains && !domains.has(n.domain)) return false;
      if (args["no-metrics-only"] && n.external_metrics) return false;
      return true;
    });
  }

  const concurrency = Math.min(
    MAX_CONCURRENCY,
    Math.max(
      1,
      Number.parseInt(String(args.concurrency ?? DEFAULT_CONCURRENCY), 10) || DEFAULT_CONCURRENCY,
    ),
  );
  process.stderr.write(
    `Selected ${selected.length} node(s) for OpenAlex pre-validation (concurrency ${concurrency}).\n`,
  );

  const tally = { rank1_clean: 0, manual_candidate: 0, absent: 0, object_concept: 0 };
  const gate = new RateGate(RATE_GATE_MS);

  // Bounded pool over nodes; per-node the direct+search two-call structure is
  // unchanged. Rows come back in input order (mapWithConcurrency contract).
  const rows = await mapWithConcurrency(selected, concurrency, async (n) => {
    const qid = n.external_ids!.wikidata;
    const label = labelOf.get(n.id) ?? n.id;

    await gate.wait();
    const directRaw = (await getJson(`${API}/concepts/wikidata:${qid}`)) as Concept | null;
    await gate.wait();
    const searchRaw = (await getJson(
      `${API}/concepts?search=${encodeURIComponent(label)}&per_page=5`,
    )) as { results?: Concept[] } | null;

    const direct = conceptFields(directRaw);
    const searchResults = (searchRaw?.results ?? []).map((c) => conceptFields(c)!);
    const rank1 = searchResults[0] ?? null;

    const directRoundTrip = direct ? qidFromWikidataUrl(direct.wikidata) === qid : false;
    const rank1QidMatch = rank1 ? qidFromWikidataUrl(rank1.wikidata) === qid : false;
    const nameMatch =
      rank1?.display_name && label
        ? rank1.display_name.toLowerCase() === label.toLowerCase()
        : false;
    const directIsRank1 = !!(direct && rank1 && direct.id === rank1.id);

    let verdict: keyof typeof tally;
    if (direct && directRoundTrip && rank1QidMatch && directIsRank1) verdict = "rank1_clean";
    else if (direct && directRoundTrip) verdict = "manual_candidate"; // QID-linked but search disagrees (dup-link/object)
    else if (!direct && searchResults.some((c) => qidFromWikidataUrl(c.wikidata) === qid))
      verdict = "manual_candidate";
    else if (!direct && searchResults.length > 0) verdict = "object_concept"; // search hits but none carry our QID
    else verdict = "absent";
    tally[verdict]++;

    // Progress lines print in completion order; the table itself is input-ordered.
    process.stderr.write(`  ${verdict.padEnd(16)} ${n.id} (${qid})\n`);
    return {
      node_id: n.id,
      type: n.type,
      domain: n.domain,
      qid,
      label,
      verdict,
      signals: {
        direct_round_trip: directRoundTrip,
        search_rank1_qid_match: rank1QidMatch,
        name_match: nameMatch,
        direct_is_search_rank1: directIsRank1,
      },
      direct,
      search_rank1: rank1,
      search_candidates: searchResults.map((c) => ({
        id: c.id,
        qid: qidFromWikidataUrl(c.wikidata),
        display_name: c.display_name,
        level: c.level,
        works_count: c.works_count,
      })),
    };
  });

  const outPath = typeof args.out === "string"
    ? isAbsolute(args.out) ? args.out : resolve(REPO_ROOT, args.out)
    : OUT_DEFAULT;
  mkdirSync(dirname(outPath), { recursive: true });
  const report = {
    generated_by: "scripts/foundry/openalex-prevalidate.ts",
    provider: "openalex",
    api: API,
    note: "Candidate multi-signal comparison only. First-pass verdicts are signal-derived; the final accept/skip/manual ruling is the orchestrator's (decision-log (9)). Never written to /data.",
    selected: selected.length,
    concurrency,
    tally,
    rank1_clean_pct:
      selected.length > 0 ? +((tally.rank1_clean / selected.length) * 100).toFixed(1) : 0,
    rows,
  };
  writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");
  process.stderr.write(
    `\nWrote ${outPath}\n  rank1_clean ${tally.rank1_clean} / manual ${tally.manual_candidate} / object ${tally.object_concept} / absent ${tally.absent}` +
      `  (rank1 ${report.rank1_clean_pct}%)\n`,
  );
}

main().catch((e) => {
  process.stderr.write(String(e?.stack ?? e) + "\n");
  process.exit(1);
});
