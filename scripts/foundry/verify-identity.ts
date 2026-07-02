/**
 * Batched Wikidata identity re-confirmation for a promotion decision file.
 *
 * Replaces the per-item, hand-driven QC re-resolution loop: every QID a
 * decision file introduces (adds.nodes external_ids, promotions
 * set_external_ids) is confirmed against live Wikidata in batches of 50 per
 * HTTP call (`wbgetentities`) — a whole batch is 1–2 requests, not N.
 *
 * Per node it confirms:
 *   - the entity exists and is not a redirect (redirects reported),
 *   - the node's en label matches the entity's label/aliases/enwiki sitelink
 *     (normalized; a mismatch means "wrong entity", the classic QC catch),
 *   - person nodes: P570 (date of death) presence vs `is_living_person` —
 *     aliveness is OBSERVED, never assumed (decision (70)); for living
 *     persons the P570 check always goes live (never served from cache).
 *
 * With `--write`, verified results are recorded into the decision file's
 * `identity` records (method: wbgetentities), including
 * `p570_absent_confirmed_at` for living persons — exactly what
 * ladder-check/apply-batch require.
 *
 * Identity cache (`foundry/cache/wikidata-entities.json`, committed):
 * caches IDENTITY, never truth — entity label/P31/P570 snapshots with
 * retrieved_at, served within --max-age-days (default 90). Claim-support
 * verdicts are never cached anywhere: temporal validity is their point.
 *
 * Boundaries: maintainer-local resolver job (network to wikidata.org only;
 * blocked in cloud sessions — see docs/data-foundry.md §11). Not in CI, not
 * in build. No secrets, no SPARQL, no scraping, no LLM.
 *
 * Usage:
 *   npm run foundry:verify-identity -- foundry/decisions/<batch>.json [--write] [--max-age-days=90]
 *   npm run foundry:verify-identity -- --qids Q42,Q7251   # ad-hoc lookup
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { normalize } from "./lib/normalize-text.ts";
import { REPO_ROOT, die, loadCurrentData, loadDecision } from "./lib/decision-io.ts";
import type { IdentityRecord } from "../../src/schema/foundry-decision.ts";

const CACHE_FILE = join(REPO_ROOT, "foundry", "cache", "wikidata-entities.json");
const WIKIDATA_API = "https://www.wikidata.org/w/api.php";
const USER_AGENT =
  process.env.NOOSPHERE_WIKIDATA_USER_AGENT ||
  "NoosphereFoundry/0.1 (https://github.com/damienmusica/Noosphere; personal knowledge atlas data foundry)";
const BATCH_SIZE = 50;
const DELAY_MS = 500;
const MAX_429_RETRIES = 3;

type CachedEntity = {
  qid: string;
  label_en: string | null;
  aliases_en: string[];
  enwiki_title: string | null;
  p31: string[];
  p570_present: boolean;
  redirect_to: string | null;
  missing: boolean;
  retrieved_at: string;
};

type Cache = Record<string, CachedEntity>;

const today = new Date().toISOString().slice(0, 10);

function loadCache(): Cache {
  if (!existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_FILE, "utf8")) as Cache;
  } catch (err) {
    die(`could not parse ${CACHE_FILE}: ${(err as Error).message}`);
  }
}

function saveCache(cache: Cache): void {
  mkdirSync(dirname(CACHE_FILE), { recursive: true });
  const sorted = Object.fromEntries(
    Object.entries(cache).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  );
  writeFileSync(CACHE_FILE, JSON.stringify(sorted, null, 2) + "\n");
}

function ageDays(isoDate: string): number {
  return (Date.parse(today) - Date.parse(isoDate)) / 86_400_000;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchEntities(qids: string[]): Promise<Record<string, unknown>> {
  // languages=en|mul: newer Wikidata items carry only a `mul` (multilingual
  // default) label with no explicit `en` — e.g. Q42 as of 2026.
  const url =
    `${WIKIDATA_API}?action=wbgetentities&ids=${qids.join("|")}` +
    `&props=labels|aliases|claims|sitelinks|info&languages=en|mul&sitefilter=enwiki&format=json&origin=*`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": USER_AGENT } });
    if (res.status === 429 && attempt < MAX_429_RETRIES) {
      const wait = 2000 * 2 ** attempt;
      console.log(`  429 from Wikidata — backing off ${wait}ms`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) die(`wbgetentities failed: HTTP ${res.status}`);
    const body = (await res.json()) as { entities?: Record<string, unknown>; error?: { info?: string } };
    if (body.error) die(`wbgetentities error: ${body.error.info}`);
    return body.entities ?? {};
  }
}

function toCached(qid: string, entity: Record<string, unknown> | undefined): CachedEntity {
  if (!entity || (entity as { missing?: string }).missing !== undefined) {
    return {
      qid, label_en: null, aliases_en: [], enwiki_title: null, p31: [],
      p570_present: false, redirect_to: null, missing: true, retrieved_at: today,
    };
  }
  const e = entity as {
    id?: string;
    labels?: { en?: { value?: string }; mul?: { value?: string } };
    aliases?: { en?: { value?: string }[]; mul?: { value?: string }[] };
    sitelinks?: { enwiki?: { title?: string } };
    claims?: Record<string, { mainsnak?: { datavalue?: { value?: { id?: string } } } }[]>;
  };
  const resolvedId = e.id ?? qid;
  return {
    qid,
    label_en: e.labels?.en?.value ?? e.labels?.mul?.value ?? null,
    aliases_en: [...(e.aliases?.en ?? []), ...(e.aliases?.mul ?? [])]
      .map((a) => a.value ?? "")
      .filter(Boolean),
    enwiki_title: e.sitelinks?.enwiki?.title ?? null,
    p31: (e.claims?.P31 ?? [])
      .map((c) => c.mainsnak?.datavalue?.value?.id ?? "")
      .filter(Boolean),
    p570_present: (e.claims?.P570 ?? []).length > 0,
    redirect_to: resolvedId !== qid ? resolvedId : null,
    missing: false,
    retrieved_at: today,
  };
}

/** Fetch (or cache-serve) entities. `forceLive` QIDs always hit the network. */
async function resolveEntities(
  qids: string[],
  cache: Cache,
  maxAgeDays: number,
  forceLive: Set<string>,
): Promise<Map<string, CachedEntity>> {
  const out = new Map<string, CachedEntity>();
  const toFetch: string[] = [];
  for (const qid of [...new Set(qids)]) {
    const hit = cache[qid];
    if (hit && !forceLive.has(qid) && ageDays(hit.retrieved_at) <= maxAgeDays) {
      out.set(qid, hit);
    } else {
      toFetch.push(qid);
    }
  }
  for (let i = 0; i < toFetch.length; i += BATCH_SIZE) {
    if (i > 0) await sleep(DELAY_MS);
    const chunk = toFetch.slice(i, i + BATCH_SIZE);
    console.log(`  fetching ${chunk.length} entit(ies) live (${i + chunk.length}/${toFetch.length})...`);
    const entities = await fetchEntities(chunk);
    for (const qid of chunk) {
      // The API keys the response by the requested id; a redirect resolves in
      // place and the entity's own `id` differs (detected in toCached).
      const cached = toCached(qid, entities[qid] as Record<string, unknown> | undefined);
      cache[qid] = cached;
      out.set(qid, cached);
    }
  }
  return out;
}

// --- Gather the (node, qid) pairs to verify -------------------------------------

const args = process.argv.slice(2);
const writeBack = args.includes("--write");
const maxAgeArg = args.find((a) => a.startsWith("--max-age-days="));
const maxAgeDays = maxAgeArg ? Number(maxAgeArg.split("=")[1]) : 90;
const qidsArg = args.find((a) => a.startsWith("--qids"));
const decisionPath = args.find((a) => !a.startsWith("--"));

async function main(): Promise<void> {
  const cache = loadCache();

  // Ad-hoc mode: just resolve and print.
  if (qidsArg) {
    const qids = (qidsArg.includes("=") ? qidsArg.split("=")[1]! : args[args.indexOf(qidsArg) + 1]!)
      .split(",")
      .map((q) => q.trim())
      .filter(Boolean);
    const entities = await resolveEntities(qids, cache, maxAgeDays, new Set());
    for (const [qid, e] of entities) {
      console.log(
        `${qid}: ${e.missing ? "MISSING" : e.label_en ?? "(no en label)"}` +
          `${e.redirect_to ? ` → REDIRECT ${e.redirect_to}` : ""}` +
          `${e.p570_present ? " [P570 present]" : ""} (retrieved ${e.retrieved_at})`,
      );
    }
    saveCache(cache);
    return;
  }

  if (!decisionPath) {
    die("usage: npm run foundry:verify-identity -- foundry/decisions/<batch>.json [--write] | --qids Q42,Q7251");
  }
  const decision = loadDecision(decisionPath);
  const current = loadCurrentData();
  const labelByNode = new Map<string, string>();
  for (const t of current.translations) {
    if (t.locale === "en") labelByNode.set(String(t.node_id), String(t.label));
  }
  for (const t of decision.adds.translations) {
    if (t.locale === "en") labelByNode.set(t.node_id, t.label);
  }
  const nodeMeta = new Map<string, { living: boolean; type: string }>();
  for (const n of current.nodes) {
    nodeMeta.set(String(n.id), { living: Boolean(n.is_living_person), type: String(n.type) });
  }
  for (const n of decision.adds.nodes) {
    nodeMeta.set(n.id, { living: n.is_living_person, type: n.type });
  }

  const subjects: { node_id: string; qid: string }[] = [];
  for (const n of decision.adds.nodes) {
    const qid = n.external_ids["wikidata"];
    if (qid) subjects.push({ node_id: n.id, qid });
  }
  for (const p of decision.promotions) {
    const qid = p.set_external_ids?.["wikidata"];
    if (qid) subjects.push({ node_id: p.id, qid });
  }
  if (subjects.length === 0) {
    console.log("no wikidata IDs to verify in this decision.");
    return;
  }

  // Living persons: P570 is observed live, never cache-served.
  const forceLive = new Set(
    subjects.filter((s) => nodeMeta.get(s.node_id)?.living).map((s) => s.qid),
  );
  console.log(`verifying ${subjects.length} identit(ies), ${forceLive.size} forced live (living persons)...`);
  const entities = await resolveEntities(subjects.map((s) => s.qid), cache, maxAgeDays, forceLive);
  saveCache(cache);

  const records: IdentityRecord[] = [];
  let failures = 0;
  for (const { node_id, qid } of subjects) {
    const e = entities.get(qid)!;
    const meta = nodeMeta.get(node_id);
    const label = labelByNode.get(node_id);
    const problems: string[] = [];
    if (e.missing) problems.push("entity missing on Wikidata");
    if (e.redirect_to) problems.push(`QID redirects to ${e.redirect_to} — record the canonical id`);
    if (!e.missing && label) {
      const want = normalize(label).toLowerCase();
      const haystack = [e.label_en ?? "", ...e.aliases_en, e.enwiki_title ?? ""]
        .map((s) => normalize(s).toLowerCase());
      if (!haystack.some((h) => h && (h === want || h.includes(want) || want.includes(h)))) {
        problems.push(
          `label mismatch: node says "${label}", entity says "${e.label_en ?? "(none)"}" — likely wrong entity`,
        );
      }
    }
    if (meta?.living && e.p570_present) {
      problems.push(`is_living_person:true but P570 (date of death) is PRESENT — status must be re-observed`);
    }
    if (meta?.type === "person" && meta.living === false && !e.p570_present && !e.missing) {
      console.log(`  ⚠ ${node_id}: person marked deceased but no P570 on ${qid} (verify manually)`);
    }

    const verified = problems.length === 0;
    if (!verified) {
      failures++;
      console.log(`✗ ${node_id} (${qid}): ${problems.join("; ")}`);
    } else {
      console.log(`✓ ${node_id} (${qid}): ${e.label_en ?? e.enwiki_title}${meta?.living ? " [P570 absent confirmed]" : ""}`);
    }
    records.push({
      node_id,
      provider: "wikidata",
      external_id: qid,
      verified,
      method: "wbgetentities",
      retrieved_at: e.retrieved_at,
      ...(meta?.living && !e.p570_present ? { p570_absent_confirmed_at: e.retrieved_at } : {}),
      ...(problems.length > 0 ? { notes: problems.join("; ") } : {}),
    });
  }

  if (writeBack) {
    const rawDecision = JSON.parse(readFileSync(decisionPath, "utf8")) as Record<string, unknown>;
    const existing = (rawDecision.identity as IdentityRecord[] | undefined) ?? [];
    const replaced = new Set(records.map((r) => `${r.node_id}@${r.provider}`));
    rawDecision.identity = [
      ...existing.filter((r) => !replaced.has(`${r.node_id}@${r.provider}`)),
      ...records,
    ];
    writeFileSync(decisionPath, JSON.stringify(rawDecision, null, 2) + "\n");
    console.log(`✓ wrote ${records.length} identity record(s) into ${decisionPath}`);
  }

  if (failures > 0) {
    console.error(`\n✗ ${failures}/${subjects.length} identit(ies) failed verification.`);
    process.exit(1);
  }
  console.log(`\n✓ all ${subjects.length} identit(ies) verified.`);
}

await main();
