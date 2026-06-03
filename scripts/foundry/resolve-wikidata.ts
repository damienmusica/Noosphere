/**
 * Wikidata source-pack resolver for a Data Foundry batch manifest.
 *
 * Usage:
 *   npm run foundry:resolve-wikidata -- foundry/batches/<manifest>.json
 *
 * Reads and validates a batch manifest, then — only if the manifest allows the
 * `wikidata` provider — resolves each seed entity's label against Wikidata using
 * public, keyless endpoints (the MediaWiki Action API `wbsearchentities` for
 * label search, and `Special:EntityData/<QID>.json` for compact entity metadata).
 * It deterministically re-ranks each seed's candidates by type fit — using their
 * Wikidata `instance of` (P31) classes against the seed's `expected_type` — so the
 * right *kind* of entity wins (e.g. the branch of mathematics "calculus" over an
 * arachnid genus of the same name), keeps the top few ranked candidates, records a
 * best-guess `selected_qid` and an `ambiguous` flag, and writes a compact source
 * pack to `dist/foundry/source-packs/<batch-slug>/wikidata.json`. Choosing the
 * final canonical QID remains a later, human-reviewed step.
 *
 * Boundaries this script honors:
 *   - It is a *source-resolution* job: Data Foundry resolvers are explicitly
 *     allowed to reach open/free/public knowledge APIs. This resolver therefore
 *     performs network requests — but nothing in build/validate:data/export:graph/
 *     report:graph/runtime/CI requires it, and it is intentionally NOT in CI.
 *   - It NEVER reads or writes `/data`; `/data` stays canonical accepted graph data.
 *   - Output is *candidate* source-resolution material, not canonical graph data,
 *     not a proposal, and nothing is marked `reviewed` or `indexable`.
 *   - No secrets, API keys, tokens, OAuth, or env-required auth. No SPARQL.
 *   - Read-only, serial requests with a polite delay and a descriptive
 *     User-Agent. It does not crawl links or fetch article/Wikipedia bodies.
 *   - No cloud LLM APIs, no LLM SDKs, no NamuWiki.
 *
 * Generated output under `dist/foundry/...` is gitignored and must not be committed.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative, isAbsolute } from "node:path";

import { foundryBatchSchema, type FoundryBatch } from "../../src/schema/foundry-batch.ts";
import {
  foundrySourcePackSchema,
  QID_REGEX,
  type Disambiguation,
  type FoundrySourcePack,
  type SourcePackCandidate,
  type SourcePackResult,
} from "../../src/schema/foundry-source-pack.ts";
import type { NodeType } from "../../src/schema/node.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

// --- Constants (all non-secret) ---------------------------------------------
const GENERATOR_NAME = "scripts/foundry/resolve-wikidata.ts";
const GENERATOR_VERSION = 2 as const;
/**
 * Search breadth vs retained breadth. We consider (and entity-fetch) up to
 * SEARCH_LIMIT hits per seed so the correct entity can be recovered even when
 * the provider ranks a wrong-kind hit (a book, a taxon) first, then keep only
 * the top CANDIDATE_LIMIT after deterministic re-ranking.
 */
const SEARCH_LIMIT = 7;
const CANDIDATE_LIMIT = 3;
const DELAY_MS = 500;
const MAX_429_RETRIES = 3;
const DEFAULT_USER_AGENT =
  "NoosphereFoundry/0.1 (https://github.com/damienmusica/Noosphere; personal knowledge atlas data foundry)";
const USER_AGENT = process.env.NOOSPHERE_WIKIDATA_USER_AGENT || DEFAULT_USER_AGENT;
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";

// --- Disambiguation knowledge ------------------------------------------------
// Curated Wikidata `instance of` (P31) classes. Every QID below was verified
// against live Wikidata labels before being hardcoded — do not add unverified
// QIDs. The labels are kept for human-readable signals only.
//
// Positive classes say "this candidate is the kind of abstract entity Noosphere
// models", grouped by the node type they support. Excluded classes say "this is
// the wrong kind of thing" (a book, a taxon, a database, a person, ...). P31 is
// used as a *signal*, never a gate: many valid concepts (e.g. "random variable",
// "Bayesian inference") carry no P31 at all and must still resolve.
const QID_LABELS: Record<string, string> = {
  // discipline-like (field / subfield / domain)
  Q11862829: "academic discipline",
  Q4671286: "academic major",
  Q1936384: "branch of mathematics",
  Q20026918: "mathematical theory",
  Q1047113: "field of study",
  Q2267705: "field of study (education)",
  Q123370638: "branch of computer science",
  Q2465832: "branch of science",
  Q336: "science",
  // method-like (method)
  Q2835765: "optimization algorithm",
  Q2321565: "iterative numerical method",
  Q1799072: "method",
  Q8366: "algorithm",
  // concept-like (concept)
  Q151885: "concept",
  // excluded — clearly not an abstract field/concept/method
  Q3331189: "version, edition or translation",
  Q16521: "taxon",
  Q7094076: "online database",
  Q33002955: "knowledge graph",
  Q114955954: "crowdsourced project",
  Q4167410: "Wikimedia disambiguation page",
  Q5: "human",
  Q13442814: "scholarly article",
  Q571: "book",
  Q7725634: "literary work",
  Q47461344: "written work",
  Q35127: "website",
  Q8513: "database",
  Q11424: "film",
  Q482994: "album",
  Q5398426: "television series",
  Q4830453: "business",
  Q43229: "organization",
  Q1656682: "event",
  Q7889: "video game",
};

const DISCIPLINE_LIKE = new Set([
  "Q11862829", "Q4671286", "Q1936384", "Q20026918",
  "Q1047113", "Q2267705", "Q123370638", "Q2465832", "Q336",
]);
const METHOD_LIKE = new Set(["Q2835765", "Q2321565", "Q1799072", "Q8366"]);
const CONCEPT_LIKE = new Set(["Q151885"]);
const ALL_POSITIVE = new Set<string>([
  ...DISCIPLINE_LIKE, ...METHOD_LIKE, ...CONCEPT_LIKE,
]);
const EXCLUDE = new Set([
  "Q3331189", "Q16521", "Q7094076", "Q33002955", "Q114955954",
  "Q4167410", "Q5", "Q13442814", "Q571", "Q7725634", "Q47461344",
  "Q35127", "Q8513", "Q11424", "Q482994", "Q5398426", "Q4830453",
  "Q43229", "Q1656682", "Q7889",
]);

/** Deterministic scoring weights. Type fit dominates; the rest break ties. */
const SCORE = {
  alignedType: 100,
  otherPositive: 40,
  excluded: -200,
  exactLabel: 30,
  hasEnwiki: 10,
} as const;
/** If the top-two candidates score within this gap, flag the seed ambiguous. */
const AMBIGUITY_GAP = 50;

/** The positive P31 set that matches a seed's expected node type, if any. */
function positiveSetFor(expectedType: NodeType | undefined): Set<string> | null {
  switch (expectedType) {
    case "domain":
    case "field":
    case "subfield":
      return DISCIPLINE_LIKE;
    case "method":
      return METHOD_LIKE;
    case "concept":
      return CONCEPT_LIKE;
    default:
      return null;
  }
}

/** Render QIDs as "label (Qxx)" where a curated label exists, else the bare QID. */
function describeQids(qids: string[]): string {
  return qids
    .map((q) => (QID_LABELS[q] ? `${QID_LABELS[q]} (${q})` : q))
    .join(", ");
}

function die(msg: string): never {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

/** Write `value` as pretty JSON with a trailing newline (matches repo style). */
function writeJson(path: string, value: unknown): void {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Derive a safe slug from a batch id, e.g. `batch:foo-bar` -> `foo-bar`. */
function batchSlug(batchId: string): string {
  return batchId.replace(/^batch:/, "");
}

// --- Manifest -----------------------------------------------------------------
function readManifest(manifestArg: string): FoundryBatch {
  const manifestPath = isAbsolute(manifestArg)
    ? manifestArg
    : resolve(REPO_ROOT, manifestArg);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (err) {
    die(`could not read/parse manifest "${manifestArg}": ${(err as Error).message}`);
  }
  const parsed = foundryBatchSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    die(`manifest "${manifestArg}" failed schema validation:\n${details}`);
  }
  return parsed.data;
}

function assertWikidataAllowed(manifest: FoundryBatch): void {
  const allowed = manifest.allowed_public_sources.some((s) => s.provider === "wikidata");
  if (!allowed) {
    die(
      `manifest "${manifest.id}" does not list "wikidata" in allowed_public_sources; ` +
        "refusing to resolve against Wikidata.",
    );
  }
}

// --- Network helpers ----------------------------------------------------------
const REQUEST_HEADERS: Record<string, string> = {
  "User-Agent": USER_AGENT,
  Accept: "application/json",
  "Accept-Encoding": "gzip,deflate",
};

/**
 * Fetch JSON with polite handling of HTTP 429 (respecting `Retry-After`) and a
 * bounded retry budget. Throws on exhausted retries or non-OK responses.
 */
async function fetchJson(url: string): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: REQUEST_HEADERS });
    if (res.status === 429) {
      if (attempt >= MAX_429_RETRIES) {
        throw new Error(`HTTP 429 (rate limited) after ${attempt} retries: ${url}`);
      }
      const retryAfter = Number(res.headers.get("retry-after"));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : DELAY_MS * (attempt + 2);
      console.warn(`  · HTTP 429; backing off ${waitMs}ms before retry…`);
      await sleep(waitMs);
      continue;
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${url}`);
    }
    return res.json();
  }
}

interface WbSearchHit {
  id: string;
  label?: string;
  description?: string;
  match?: { type?: string; text?: string };
}

/** Label search via the MediaWiki Action API `wbsearchentities` (items only). */
async function searchWikidata(label: string, limit: number): Promise<WbSearchHit[]> {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    search: label,
    language: "en",
    uselang: "en",
    type: "item",
    format: "json",
    limit: String(limit),
  });
  const data = (await fetchJson(`${WIKIDATA_API}?${params.toString()}`)) as {
    error?: { code?: string; info?: string };
    search?: WbSearchHit[];
  };
  if (data.error) {
    throw new Error(
      `wbsearchentities error${data.error.code ? ` [${data.error.code}]` : ""}: ${
        data.error.info ?? "unknown"
      }`,
    );
  }
  return (data.search ?? []).filter((hit) => /^Q[1-9][0-9]*$/.test(hit.id));
}

interface CompactEntity {
  label: string;
  description: string;
  aliases: string[];
  /** Wikidata `instance of` (P31) item QIDs, used for disambiguation. */
  instanceOf: string[];
  enwiki?: string;
  lastrevid?: number;
  modified?: string;
}

/** Extract `instance of` (P31) item QIDs from a raw entity's claims. */
function extractInstanceOf(entity: RawEntity): string[] {
  const out: string[] = [];
  for (const claim of entity.claims?.P31 ?? []) {
    const id = claim.mainsnak?.datavalue?.value?.id;
    // Skip `novalue`/`somevalue` snaks (no datavalue) and properties.
    if (typeof id === "string" && QID_REGEX.test(id) && !out.includes(id)) {
      out.push(id);
    }
  }
  return out;
}

/** Compact entity metadata via Special:EntityData JSON (no raw entity retained). */
async function fetchEntityData(qid: string): Promise<CompactEntity> {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const data = (await fetchJson(url)) as {
    entities?: Record<string, RawEntity>;
  };
  const entity = data.entities?.[qid];
  if (!entity) {
    throw new Error(`Special:EntityData returned no entity for ${qid}`);
  }
  const enwikiTitle = entity.sitelinks?.enwiki?.title;
  return {
    label: entity.labels?.en?.value ?? "",
    description: entity.descriptions?.en?.value ?? "",
    aliases: (entity.aliases?.en ?? []).map((a) => a.value).filter(Boolean),
    instanceOf: extractInstanceOf(entity),
    enwiki: enwikiTitle
      ? `https://en.wikipedia.org/wiki/${encodeURIComponent(enwikiTitle.replace(/ /g, "_"))}`
      : undefined,
    lastrevid: typeof entity.lastrevid === "number" ? entity.lastrevid : undefined,
    modified: typeof entity.modified === "string" ? entity.modified : undefined,
  };
}

interface RawEntity {
  labels?: Record<string, { value?: string }>;
  descriptions?: Record<string, { value?: string }>;
  aliases?: Record<string, { value: string }[]>;
  sitelinks?: Record<string, { title?: string }>;
  claims?: Record<
    string,
    { mainsnak?: { datavalue?: { value?: { id?: string } } } }[]
  >;
  lastrevid?: number;
  modified?: string;
}

const normalizeLabel = (s: string): string => s.trim().toLowerCase();

/**
 * Deterministically score how well a candidate fits its seed. Type fit (via
 * P31) dominates; an exact label match and an English Wikipedia sitelink break
 * ties. P31 is never a gate — a candidate with no P31 simply gets no type
 * bonus/penalty and can still win on the label/sitelink signals.
 */
function scoreCandidate(
  hit: WbSearchHit,
  entity: CompactEntity,
  seed: FoundryBatch["seed_entities"][number],
): Disambiguation {
  const signals: string[] = [];
  const p31 = entity.instanceOf;
  const alignedSet = positiveSetFor(seed.expected_type);

  const alignedHits = alignedSet ? p31.filter((q) => alignedSet.has(q)) : [];
  const positiveHits = p31.filter((q) => ALL_POSITIVE.has(q));
  const excludedHits = p31.filter((q) => EXCLUDE.has(q));

  const aligned = alignedHits.length > 0;
  const excluded = excludedHits.length > 0;
  const labels = [entity.label, hit.label ?? "", ...entity.aliases].map(normalizeLabel);
  const exactLabel = labels.includes(normalizeLabel(seed.label));

  let score = 0;
  if (aligned) {
    score += SCORE.alignedType;
    signals.push(
      `instance-of matches expected type "${seed.expected_type}": ${describeQids(alignedHits)}`,
    );
  } else if (positiveHits.length > 0) {
    score += SCORE.otherPositive;
    signals.push(`instance-of is a field/concept/method: ${describeQids(positiveHits)}`);
  }
  if (excluded) {
    score += SCORE.excluded;
    signals.push(`instance-of is a non-concept entity: ${describeQids(excludedHits)}`);
  }
  if (exactLabel) {
    score += SCORE.exactLabel;
    signals.push("exact label match");
  }
  if (entity.enwiki) {
    score += SCORE.hasEnwiki;
    signals.push("has English Wikipedia sitelink");
  }
  if (p31.length === 0) {
    signals.push("no instance-of (P31) on entity; scored on label/sitelink only");
  }

  return {
    score,
    aligned_with_expected_type: aligned,
    excluded,
    exact_label_match: exactLabel,
    signals,
  };
}

/** Combine a search hit and its compact entity data into a source-pack candidate. */
function toCandidate(
  hit: WbSearchHit,
  rank: number,
  entity: CompactEntity,
  disambiguation: Disambiguation,
): SourcePackCandidate {
  const qid = hit.id;
  const sitelinks: Record<string, string> = {};
  if (entity.enwiki) sitelinks.enwiki = entity.enwiki;
  return {
    qid,
    rank,
    label: entity.label || hit.label || "",
    description: entity.description || hit.description || "",
    aliases: entity.aliases,
    instance_of: entity.instanceOf,
    disambiguation,
    concept_uri: `http://www.wikidata.org/entity/${qid}`,
    entity_url: `https://www.wikidata.org/wiki/${qid}`,
    entity_data_url: `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`,
    sitelinks,
    wikidata_lastrevid: entity.lastrevid,
    wikidata_modified: entity.modified,
  };
}

// --- Resolution ---------------------------------------------------------------
async function resolveSeed(
  seed: FoundryBatch["seed_entities"][number],
): Promise<SourcePackResult> {
  const notes: string[] = [];
  const result: SourcePackResult = {
    seed: {
      label: seed.label,
      ...(seed.expected_node_id ? { expected_node_id: seed.expected_node_id } : {}),
      ...(seed.expected_type ? { expected_type: seed.expected_type } : {}),
    },
    query: seed.label,
    status: "unresolved",
    candidates: [],
    ambiguous: false,
    notes,
  };

  let hits: WbSearchHit[];
  try {
    hits = await searchWikidata(seed.label, SEARCH_LIMIT);
  } catch (err) {
    result.status = "error";
    notes.push(`search failed: ${(err as Error).message}`);
    return result;
  }

  if (hits.length === 0) {
    notes.push("no Wikidata candidates found for this label");
    return result;
  }

  // Entity-fetch every hit (to read P31), keeping the provider's order so it can
  // serve as a stable tiebreaker after deterministic re-ranking.
  interface Scored {
    hit: WbSearchHit;
    entity: CompactEntity;
    disambiguation: Disambiguation;
    providerRank: number;
  }
  const scored: Scored[] = [];
  let providerRank = 0;
  for (const hit of hits) {
    providerRank++;
    await sleep(DELAY_MS);
    try {
      const entity = await fetchEntityData(hit.id);
      scored.push({
        hit,
        entity,
        disambiguation: scoreCandidate(hit, entity, seed),
        providerRank,
      });
    } catch (err) {
      notes.push(`could not fetch entity data for ${hit.id}: ${(err as Error).message}`);
    }
  }

  if (scored.length === 0) {
    result.status = "error";
    return result;
  }

  // Re-rank by score; ties fall back to provider order, then QID for determinism.
  scored.sort(
    (a, b) =>
      b.disambiguation.score - a.disambiguation.score ||
      a.providerRank - b.providerRank ||
      a.hit.id.localeCompare(b.hit.id),
  );

  const kept = scored.slice(0, CANDIDATE_LIMIT);
  result.candidates = kept.map((s, i) =>
    toCandidate(s.hit, i + 1, s.entity, s.disambiguation),
  );
  result.status = "resolved";

  // `scored` is non-empty (guarded above), so `kept`/`candidates` have ≥1 item.
  const best = kept[0]!;
  const bestCandidate = result.candidates[0]!;
  result.selected_qid = bestCandidate.qid;

  if (best.providerRank !== 1) {
    notes.push(
      `re-ranked: provider's first hit was not the best type match; ` +
        `selected ${bestCandidate.qid} (provider rank ${best.providerRank})`,
    );
  }
  const runnerUp = result.candidates[1];
  if (runnerUp) {
    const gap = bestCandidate.disambiguation.score - runnerUp.disambiguation.score;
    if (gap < AMBIGUITY_GAP) {
      result.ambiguous = true;
      notes.push(
        `low-confidence: top-two disambiguation score gap is ${gap} ` +
          `(< ${AMBIGUITY_GAP}); manual review recommended`,
      );
    }
  }
  return result;
}

function buildSourcePack(
  manifest: FoundryBatch,
  results: SourcePackResult[],
): FoundrySourcePack {
  const resolved = results.filter((r) => r.status === "resolved").length;
  const unresolved = results.length - resolved;
  const candidateCount = results.reduce((sum, r) => sum + r.candidates.length, 0);

  const pack: FoundrySourcePack = {
    version: 2,
    provider: "wikidata",
    batch_id: manifest.id,
    batch_title: manifest.title,
    generated_at: new Date().toISOString(),
    generator: { name: GENERATOR_NAME, version: GENERATOR_VERSION },
    request_policy: {
      network_required: true,
      requires_secret: false,
      user_agent: USER_AGENT,
      serial_requests: true,
      delay_ms: DELAY_MS,
      search_limit: SEARCH_LIMIT,
      candidate_limit: CANDIDATE_LIMIT,
    },
    source_metadata: {
      source_id: "source:wikidata",
      name: "Wikidata",
      license: "CC0",
      commercial_use: true,
      attribution_required: false,
      share_alike_required: false,
      url: "https://www.wikidata.org/",
    },
    results,
    summary: {
      seed_entities: results.length,
      resolved,
      unresolved,
      candidate_count: candidateCount,
    },
    notes: [
      "This source pack is generated candidate data.",
      "It is not canonical graph data.",
      "Do not commit generated dist/foundry outputs.",
      "Candidates are deterministically re-ranked by instance-of (P31) type fit; " +
        "rank 1 / selected_qid is a best-guess match, not a verified decision.",
      "Seeds flagged `ambiguous` need manual selection before any proposal step.",
    ],
  };

  const parsed = foundrySourcePackSchema.safeParse(pack);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    die(`internal error: generated source pack failed schema validation:\n${details}`);
  }
  return parsed.data;
}

function writeSourcePack(pack: FoundrySourcePack): string {
  const outDir = resolve(
    REPO_ROOT,
    "dist",
    "foundry",
    "source-packs",
    batchSlug(pack.batch_id),
  );
  // Guard against escaping the dist/foundry sandbox.
  const distFoundry = resolve(REPO_ROOT, "dist", "foundry");
  const rel = relative(distFoundry, outDir);
  if (rel.startsWith("..") || isAbsolute(rel)) {
    die(`output dir for "${pack.batch_id}" must resolve under dist/foundry/`);
  }
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "wikidata.json");
  writeJson(outPath, pack);
  return outPath;
}

// --- Main ---------------------------------------------------------------------
async function main(): Promise<void> {
  const manifestArg = process.argv[2];
  if (!manifestArg) {
    die(
      "missing manifest path. Usage: npm run foundry:resolve-wikidata -- foundry/batches/<manifest>.json",
    );
  }

  const manifest = readManifest(manifestArg);
  assertWikidataAllowed(manifest);

  console.log(`Resolving ${manifest.seed_entities.length} seed(s) for ${manifest.id} against Wikidata…`);
  console.log(`  user-agent: ${USER_AGENT}`);
  console.log("");

  const results: SourcePackResult[] = [];
  let first = true;
  for (const seed of manifest.seed_entities) {
    if (!first) await sleep(DELAY_MS);
    first = false;
    const result = await resolveSeed(seed);
    results.push(result);
    const top = result.candidates[0];
    if (result.status === "resolved" && top) {
      const flag = result.ambiguous ? " ⚠ ambiguous" : "";
      console.log(
        `  • ${seed.label} → ${top.qid} "${top.label}" ` +
          `(score ${top.disambiguation.score}, ${result.candidates.length} candidate(s))${flag}`,
      );
    } else {
      console.log(`  • ${seed.label} → ${result.status}`);
    }
  }

  const pack = buildSourcePack(manifest, results);
  const outPath = writeSourcePack(pack);
  const relOut = relative(REPO_ROOT, outPath);

  console.log("");
  console.log("✓ Wikidata source pack written.");
  console.log(`    batch:            ${pack.batch_id} — ${pack.batch_title}`);
  console.log(`    seed entities:    ${pack.summary.seed_entities}`);
  console.log(`    resolved:         ${pack.summary.resolved}`);
  console.log(`    unresolved:       ${pack.summary.unresolved}`);
  console.log(`    ambiguous:        ${pack.results.filter((r) => r.ambiguous).length}`);
  console.log(`    total candidates: ${pack.summary.candidate_count}`);
  console.log(`    output:           ${relOut}`);
  console.log("    note: generated candidate data (not canonical); dist/foundry is gitignored.");
}

main().catch((err) => {
  die(`unexpected error: ${(err as Error).message}`);
});
