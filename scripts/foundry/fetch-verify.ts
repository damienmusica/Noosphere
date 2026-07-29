/**
 * fetch-verify — concurrent live-fetch + verbatim claim-anchor table generator
 * (vault decision (8) pitstop, session #17: promotes session #16's hand-rolled
 * serial bash fetch loops into a reproducible tool; coverage unchanged, only
 * wall-clock).
 *
 * Usage:
 *   npm run foundry:fetch-verify -- <input.json> [<input2.json> ...]
 *        [--concurrency N] [--out <path>]
 *
 * Input formats (auto-detected per file):
 *   - editorial summaries batch: { summaries: [{ node_id, citations: [{ url, quote, … }] }] }
 *   - flat claim list: [{ node_id?, url, quote }]
 *   - promotion decision file: foundry/decisions/<batch>.json — every
 *     verdicts[].sources[] entry carrying a `quote`. Verification targets the
 *     §8 permanence anchor when one is recorded (`revision_permalink`, i.e. the
 *     wiki oldid or SEP fixed edition), falling back to the live `url`: the
 *     anchor is what the audit trail actually claims, so it is what must hold
 *     the quote. Sources with no quote (identity-only Wikidata reads) are
 *     skipped, not counted as misses. Added 2026-07-29 — sessions had been
 *     hand-converting decision files into flat arrays every time, which is the
 *     re-derived-by-hand pattern §15 exists to remove.
 *
 * What it does:
 *   1. Collects all (node_id, url, quote) claims; dedupes URLs.
 *   2. Fetches each unique URL once — bounded concurrency (default/max 8).
 *      Same-host URLs stay SERIAL with a politeness gap; distinct hosts run in
 *      parallel. Descriptive User-Agent, 20s timeout, redirects followed.
 *   3. Safety floor (false-miss prevention, non-negotiable): non-200 / timeout /
 *      network errors are NEVER classified "dead". They go to a SERIAL backoff
 *      retry queue (≤2 extra attempts: 1s, 4s — anonymous-throttle instant
 *      520/429 pattern, SPN §8). Still failing → "unverified", not dead.
 *   4. Per claim: normalize(page).includes(normalize(quote)) — the SAME
 *      normalization as claim-anchor-check.ts (lib/normalize-text.ts), so
 *      offline and live checks agree.
 *   5. Writes a pass/miss table under dist/foundry/ (gitignored) + stderr
 *      summary (PASS n/m · MISS list · UNVERIFIED list).
 *
 * Claim statuses:
 *   pass        — quote found verbatim on the live capture (after normalization)
 *   miss        — page live, quote absent → laundering candidate; orchestrator must rule
 *   unverified  — page unreachable now, or binary (PDF) needing manual capture — NOT dead
 *
 * IMPORTANT BOUNDARY (same as claim-anchor-check): PASS means the *string* is
 * on the page — not that the claim is true, in context, or fairly used; a MISS
 * may still be a paraphrase a human accepts. The tool only *reports*; the
 * final verbatim verdict on every citation is the orchestrator's. Laundering
 * detection stays 100%: a citation marked live whose quote is absent from the
 * live capture must surface as MISS.
 *
 * Boundaries:
 *   - Maintainer-local network tool; nothing in build/validate:data/CI uses it.
 *   - Fetches only the specific cited URLs it is given — no crawling, no link
 *     following (repo "no scraping" constraint; existing resolver/SPN pattern).
 *   - Reads input files; writes only under dist/ (gitignored). Never /data.
 *   - Deterministic: url_table sorted by URL, claim rows in input order —
 *     same input → same output (modulo live page content).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { normalize, nearestWindow } from "./lib/normalize-text.ts";
import { MAX_CONCURRENCY, fetchUrlsPolitely } from "./lib/polite-fetch.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const OUT_DEFAULT = join(REPO_ROOT, "dist", "foundry", "fetch-verify", "report.json");

const UA =
  "Noosphere-Foundry-Fetch-Verify/1.0 (research atlas citation QC; contact: maintainer; fetches only cited URLs)";

interface Claim {
  node_id: string | null;
  url: string;
  quote: string;
  source_file: string;
}

function parseArgs(argv: string[]): { files: string[]; opts: Record<string, string | boolean> } {
  const files: string[] = [];
  const opts: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        opts[a.slice(2)] = next;
        i++;
      } else opts[a.slice(2)] = true;
    } else files.push(a);
  }
  return { files, opts };
}

function loadClaims(file: string): { claims: Claim[]; skipped: number } {
  const parsed = JSON.parse(readFileSync(file, "utf8")) as unknown;
  const claims: Claim[] = [];
  let skipped = 0;
  const push = (node_id: unknown, url: unknown, quote: unknown): void => {
    if (typeof url === "string" && url && typeof quote === "string" && quote.trim()) {
      claims.push({
        node_id: typeof node_id === "string" ? node_id : null,
        url,
        quote,
        source_file: basename(file),
      });
    } else skipped++;
  };
  if (Array.isArray(parsed)) {
    for (const row of parsed as { node_id?: string; url?: string; quote?: string }[])
      push(row.node_id, row.url, row.quote);
  } else if (parsed && typeof parsed === "object" && Array.isArray((parsed as { summaries?: unknown[] }).summaries)) {
    for (const s of (parsed as { summaries: { node_id?: string; citations?: { url?: string; quote?: string }[] }[] }).summaries)
      for (const c of s.citations ?? []) push(s.node_id, c.url, c.quote);
  } else if (parsed && typeof parsed === "object" && Array.isArray((parsed as { verdicts?: unknown[] }).verdicts)) {
    // Promotion decision file. Verify against the recorded permanence anchor
    // where one exists — that URL is what the audit trail points a future
    // re-auditor at. A quote-less source is an identity read, not a claim.
    type DecisionSource = { url?: string; quote?: string; revision_permalink?: string };
    const verdicts = (parsed as { verdicts: { subject_id?: string; sources?: DecisionSource[] }[] }).verdicts;
    for (const v of verdicts) {
      for (const s of v.sources ?? []) {
        if (typeof s.quote !== "string" || !s.quote.trim()) continue;
        push(v.subject_id, s.revision_permalink ?? s.url, s.quote);
      }
    }
  } else {
    throw new Error(
      `${file}: unrecognized input shape (expected summaries batch, flat claim array, or decision file)`,
    );
  }
  return { claims, skipped };
}

async function main(): Promise<void> {
  const { files, opts } = parseArgs(process.argv.slice(2));
  if (files.length === 0) {
    console.error(
      "usage: fetch-verify.ts <input.json> [<input2.json> ...] [--concurrency N] [--out <path>]\n" +
        "  input = editorial summaries batch ({summaries:[{node_id,citations:[{url,quote}]}]})\n" +
        "          or flat [{node_id?,url,quote}] array",
    );
    process.exit(2);
  }
  const concurrency = Math.min(
    MAX_CONCURRENCY,
    Math.max(1, Number.parseInt(String(opts.concurrency ?? MAX_CONCURRENCY), 10) || MAX_CONCURRENCY),
  );

  const claims: Claim[] = [];
  let skippedNoQuote = 0;
  for (const f of files) {
    const { claims: cs, skipped } = loadClaims(f);
    claims.push(...cs);
    skippedNoQuote += skipped;
  }

  // Dedupe URLs; host grouping + politeness live in lib/polite-fetch.ts (shared
  // with fetch-corpus — v1.1 hardening, behavior unchanged).
  const uniqueUrls = [...new Set(claims.map((c) => c.url))].sort();
  const hostCount = new Set(
    uniqueUrls.map((u) => {
      try {
        return new URL(u).hostname;
      } catch {
        return u;
      }
    }),
  ).size;
  process.stderr.write(
    `fetch-verify: ${claims.length} claim(s), ${uniqueUrls.length} unique URL(s) across ` +
      `${hostCount} host(s), concurrency ${concurrency}\n`,
  );

  const outcomes = await fetchUrlsPolitely(uniqueUrls, {
    ua: UA,
    concurrency,
    log: (line) => process.stderr.write(line + "\n"),
  });

  // Claim checks — input order preserved (determinism).
  const normalizedCache = new Map<string, string>();
  const claimRows = claims.map((c) => {
    const o = outcomes.get(c.url)!;
    if (o.final === "unverified") {
      return { ...row(c), status: "unverified" as const, detail: `URL unreachable (${o.error ?? `http ${o.http_status}`}) — not dead; manual/Wayback follow-up` };
    }
    if (o.final === "binary") {
      return { ...row(c), status: "unverified" as const, detail: "binary content (PDF etc.) — needs manual capture + claim-anchor-check" };
    }
    let hay = normalizedCache.get(c.url);
    if (hay === undefined) {
      hay = normalize(o.body ?? "");
      normalizedCache.set(c.url, hay);
    }
    const needle = normalize(c.quote);
    const idx = hay.indexOf(needle);
    if (idx >= 0) {
      const ctx = hay.slice(Math.max(0, idx - 80), idx + needle.length + 80);
      return { ...row(c), status: "pass" as const, detail: `…${ctx}…` };
    }
    return { ...row(c), status: "miss" as const, detail: nearestWindow(o.body ?? "", needle) };
  });
  function row(c: Claim): { node_id: string | null; url: string; quote: string; source_file: string } {
    return { node_id: c.node_id, url: c.url, quote: c.quote, source_file: c.source_file };
  }

  const tally = {
    pass: claimRows.filter((r) => r.status === "pass").length,
    miss: claimRows.filter((r) => r.status === "miss").length,
    unverified: claimRows.filter((r) => r.status === "unverified").length,
  };
  const urlTally = {
    live: [...outcomes.values()].filter((o) => o.final === "live").length,
    binary: [...outcomes.values()].filter((o) => o.final === "binary").length,
    unverified: [...outcomes.values()].filter((o) => o.final === "unverified").length,
  };

  const outPath =
    typeof opts.out === "string"
      ? isAbsolute(opts.out)
        ? opts.out
        : resolve(REPO_ROOT, opts.out)
      : OUT_DEFAULT;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        generated_by: "scripts/foundry/fetch-verify.ts",
        note:
          "Mechanical half only. pass = verbatim string present on live capture after normalization (not truth/context/fair use); " +
          "miss = page live but quote absent (laundering candidate — orchestrator rules); " +
          "unverified = unreachable or binary, NOT dead. Final verdicts are the orchestrator's.",
        inputs: files.map((f) => basename(f)),
        concurrency,
        claims: { total: claims.length, ...tally, skipped_no_url_or_quote: skippedNoQuote },
        urls: { total: uniqueUrls.length, ...urlTally },
        url_table: [...outcomes.values()]
          .sort((a, b) => a.url.localeCompare(b.url))
          .map(({ body: _body, ...rest }) => rest),
        claim_rows: claimRows,
      },
      null,
      2,
    ) + "\n",
  );

  process.stderr.write(
    `\nPASS ${tally.pass}/${claims.length} · MISS ${tally.miss} · UNVERIFIED ${tally.unverified}` +
      ` (URLs: live ${urlTally.live} / binary ${urlTally.binary} / unverified ${urlTally.unverified})\n`,
  );
  for (const r of claimRows.filter((r) => r.status !== "pass"))
    process.stderr.write(`  ${r.status.toUpperCase().padEnd(10)} ${r.node_id ?? "-"} ${r.url}\n`);
  process.stderr.write(`Wrote ${outPath}\n`);
  // Misses are NOT an error exit: a paraphrase can be a legitimate citation.
}

main().catch((e) => {
  process.stderr.write(String(e instanceof Error ? e.stack : e) + "\n");
  process.exit(1);
});
