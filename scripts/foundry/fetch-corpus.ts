/**
 * fetch-corpus — polite source-corpus collector for orchestrator sessions
 * (v1.1 hardening, 2026-07-02).
 *
 * Sessions that ground generation in live pages (editorial lead extracts,
 * verdict sources) used to hand-roll ad-hoc fetch loops — outside the
 * politeness pattern the QC tools already had, which is exactly how the #55
 * source collection hit Wikidata 429 throttling. This tool promotes corpus
 * collection onto the SAME shared engine as fetch-verify
 * (lib/polite-fetch.ts): same-host serial + gap, cross-host bounded pool,
 * timeouts, serial backoff retries, never-dead classification.
 *
 * Usage:
 *   npm run foundry:fetch-corpus -- <input> --out <dir> [--concurrency N]
 *
 * Input formats (auto-detected):
 *   - JSON array: [{ "id": "person:isaac-newton", "url": "https://…" }, …]
 *     (id optional — used as the output filename slug)
 *   - plain text: one URL per line (lines starting with # ignored)
 *
 * Output (under --out, REQUIRED — the session scratchpad, /tmp, or dist/.
 * Any other path inside the repo tree is REFUSED: fetched page bodies must
 * never be cached into the repo — charter "external content is linked, not
 * stored"):
 *   - one body file per live URL: <slug>.html / <slug>.txt by content shape
 *   - manifest.json — deterministic (sorted by url): id, url, status,
 *     http_status, attempts, error, file, bytes, retrieved_at
 *
 * Boundaries:
 *   - Maintainer-local network tool; nothing in build/validate:data/CI uses it.
 *   - Fetches ONLY the URLs it is given — no crawling, no link following
 *     (repo "no scraping" constraint).
 *   - Binary URLs (PDF etc.) are recorded in the manifest but bodies are NOT
 *     saved (manual capture path, same as fetch-verify).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";

import { MAX_CONCURRENCY, fetchUrlsPolitely } from "./lib/polite-fetch.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

const UA =
  "Noosphere-Foundry-Fetch-Corpus/1.0 (research atlas source grounding; contact: maintainer; fetches only listed URLs)";

interface InputRow {
  id: string | null;
  url: string;
}

function parseArgs(argv: string[]): { input: string | undefined; opts: Record<string, string | boolean> } {
  let input: string | undefined;
  const opts: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        opts[a.slice(2)] = next;
        i++;
      } else opts[a.slice(2)] = true;
    } else input = a;
  }
  return { input, opts };
}

function loadRows(file: string): InputRow[] {
  const raw = readFileSync(file, "utf8");
  if (file.endsWith(".json")) {
    const parsed = JSON.parse(raw) as { id?: unknown; url?: unknown }[];
    if (!Array.isArray(parsed)) throw new Error(`${file}: expected a JSON array of {id?, url}`);
    return parsed
      .filter((r) => typeof r.url === "string" && r.url)
      .map((r) => ({ id: typeof r.id === "string" ? r.id : null, url: r.url as string }));
  }
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((url) => ({ id: null, url }));
}

/** True when `child` is `parent` or a path beneath it (path segments, not string prefixes). */
function isInside(parent: string, child: string): boolean {
  const rel = relative(parent, child);
  return rel === "" || (rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel));
}

/** Deterministic filename slug: id when given, else host+path, sanitized. */
function slugFor(row: InputRow): string {
  const base = row.id ?? row.url.replace(/^https?:\/\//, "");
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "url"
  );
}

async function main(): Promise<void> {
  const { input, opts } = parseArgs(process.argv.slice(2));
  const outDir = typeof opts.out === "string" ? opts.out : undefined;
  if (!input || !outDir) {
    console.error(
      "usage: fetch-corpus.ts <input.json|urls.txt> --out <dir> [--concurrency N]\n" +
        "  input = JSON array [{id?, url}] or one URL per line\n" +
        "  --out is required — point it at the session scratchpad or dist/",
    );
    process.exit(2);
  }
  const concurrency = Math.min(
    MAX_CONCURRENCY,
    Math.max(1, Number.parseInt(String(opts.concurrency ?? MAX_CONCURRENCY), 10) || MAX_CONCURRENCY),
  );

  // Fetched page bodies must never be cached into the repo tree (charter:
  // external content is linked, not stored); dist/ is the only sanctioned
  // in-repo output area. Checked before any network happens.
  const outAbs = isAbsolute(outDir) ? outDir : resolve(process.cwd(), outDir);
  if (isInside(REPO_ROOT, outAbs) && !isInside(join(REPO_ROOT, "dist"), outAbs)) {
    console.error(
      `fetch-corpus: refusing --out ${outAbs} — inside the repo tree; page bodies must not be cached into the repo.\n` +
        `Use the session scratchpad, /tmp, or a directory under ${join(REPO_ROOT, "dist")}${sep}`,
    );
    process.exit(2);
  }

  const rows = loadRows(input);
  const byUrl = new Map<string, InputRow>();
  for (const r of rows) if (!byUrl.has(r.url)) byUrl.set(r.url, r);
  const uniqueUrls = [...byUrl.keys()].sort();
  process.stderr.write(
    `fetch-corpus: ${rows.length} row(s), ${uniqueUrls.length} unique URL(s), concurrency ${concurrency}\n`,
  );

  const outcomes = await fetchUrlsPolitely(uniqueUrls, {
    ua: UA,
    concurrency,
    log: (line) => process.stderr.write(line + "\n"),
  });

  mkdirSync(outAbs, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);

  // Slug collisions (two URLs, same slug) get a numeric suffix. The FINAL
  // chosen slug is what gets registered, so a suffixed slug can never collide
  // with a natural "<slug>-N" from another URL — deterministic because
  // uniqueUrls is sorted.
  const usedSlugs = new Set<string>();
  const manifest = uniqueUrls.map((url) => {
    const row = byUrl.get(url)!;
    const o = outcomes.get(url)!;
    let file: string | null = null;
    let bytes: number | null = null;
    if (o.final === "live" && o.body !== null) {
      const base = slugFor(row);
      let slug = base;
      for (let n = 2; usedSlugs.has(slug); n++) slug = `${base}-${n}`;
      usedSlugs.add(slug);
      const ext = /<[a-z!/][^>]*>/i.test(o.body.slice(0, 2048)) ? "html" : "txt";
      file = `${slug}.${ext}`;
      writeFileSync(join(outAbs, file), o.body);
      bytes = Buffer.byteLength(o.body);
    }
    return {
      id: row.id,
      url,
      status: o.final,
      http_status: o.http_status,
      attempts: o.attempts,
      error: o.error,
      file,
      bytes,
      retrieved_at: today,
    };
  });

  writeFileSync(
    join(outAbs, "manifest.json"),
    JSON.stringify(
      {
        generated_by: "scripts/foundry/fetch-corpus.ts",
        note:
          "Polite corpus collection (lib/polite-fetch.ts): live bodies saved beside this manifest; " +
          "binary = body not saved (manual capture path); unverified = unreachable now, NOT dead.",
        input,
        concurrency,
        entries: manifest,
      },
      null,
      2,
    ) + "\n",
  );

  const tally = {
    live: manifest.filter((m) => m.status === "live").length,
    binary: manifest.filter((m) => m.status === "binary").length,
    unverified: manifest.filter((m) => m.status === "unverified").length,
  };
  process.stderr.write(
    `\nLIVE ${tally.live}/${uniqueUrls.length} · BINARY ${tally.binary} · UNVERIFIED ${tally.unverified}\n` +
      `Wrote ${manifest.filter((m) => m.file).length} body file(s) + manifest.json under ${outAbs}\n`,
  );
}

main().catch((e) => {
  process.stderr.write(String(e instanceof Error ? e.stack : e) + "\n");
  process.exit(1);
});
