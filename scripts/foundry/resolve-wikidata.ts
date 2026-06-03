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
 * It keeps up to a few ranked candidates per seed and writes a compact source
 * pack to `dist/foundry/source-packs/<batch-slug>/wikidata.json`.
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
  type FoundrySourcePack,
  type SourcePackCandidate,
  type SourcePackResult,
} from "../../src/schema/foundry-source-pack.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

// --- Constants (all non-secret) ---------------------------------------------
const GENERATOR_NAME = "scripts/foundry/resolve-wikidata.ts";
const GENERATOR_VERSION = 1 as const;
const CANDIDATE_LIMIT = 3;
const DELAY_MS = 500;
const MAX_429_RETRIES = 3;
const DEFAULT_USER_AGENT =
  "NoosphereFoundry/0.1 (https://github.com/damienmusica/Noosphere; personal knowledge atlas data foundry)";
const USER_AGENT = process.env.NOOSPHERE_WIKIDATA_USER_AGENT || DEFAULT_USER_AGENT;
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";

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
  enwiki?: string;
  lastrevid?: number;
  modified?: string;
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
  lastrevid?: number;
  modified?: string;
}

/** Combine a search hit and its compact entity data into a source-pack candidate. */
function toCandidate(
  hit: WbSearchHit,
  rank: number,
  entity: CompactEntity,
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
    notes,
  };

  let hits: WbSearchHit[];
  try {
    hits = await searchWikidata(seed.label, CANDIDATE_LIMIT);
  } catch (err) {
    result.status = "error";
    notes.push(`search failed: ${(err as Error).message}`);
    return result;
  }

  if (hits.length === 0) {
    notes.push("no Wikidata candidates found for this label");
    return result;
  }

  const candidates: SourcePackCandidate[] = [];
  let rank = 0;
  for (const hit of hits) {
    rank++;
    await sleep(DELAY_MS);
    try {
      const entity = await fetchEntityData(hit.id);
      candidates.push(toCandidate(hit, rank, entity));
    } catch (err) {
      notes.push(`could not fetch entity data for ${hit.id}: ${(err as Error).message}`);
    }
  }

  result.candidates = candidates;
  if (candidates.length === 0) {
    result.status = "error";
  } else {
    result.status = "resolved";
    if (candidates.length > 1) {
      notes.push(
        `${candidates.length} candidates returned; ambiguous — retained ranked for later review`,
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
    version: 1,
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
    const tag =
      result.status === "resolved"
        ? `${result.candidates.length} candidate(s)`
        : result.status;
    console.log(`  • ${seed.label} → ${tag}`);
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
  console.log(`    total candidates: ${pack.summary.candidate_count}`);
  console.log(`    output:           ${relOut}`);
  console.log("    note: generated candidate data (not canonical); dist/foundry is gitignored.");
}

main().catch((err) => {
  die(`unexpected error: ${(err as Error).message}`);
});
