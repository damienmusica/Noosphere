/**
 * Evidence-permanence anchoring for a promotion decision file.
 *
 * Replaces the per-URL hand work (look up a wiki revision ID, request a
 * Wayback snapshot, paste both into the record). For every verdict source in
 * the decision file that still lacks anchors:
 *
 *   - Wikipedia URLs get a revision permalink (…&oldid=NNN) via the wiki's
 *     own API (keyless, read-only).
 *   - Every URL gets a Wayback snapshot: reuse a recent one when the
 *     availability API has it (default ≤7 days old), otherwise request an
 *     anonymous Save-Page-Now capture and poll until it materializes.
 *     Anonymous SPN is rate-limited — the script spaces requests and backs
 *     off on 429; a batch of 10–20 URLs takes minutes, which is fine.
 *
 * Failures are recorded HONESTLY in `anchors_pending` (the [SPN-FAILED]
 * discipline, docs/data-foundry.md §8) — re-run the script until the queue
 * clears; apply-batch surfaces pending anchors on every run.
 *
 * With `--write`, snapshot_url / revision_permalink are written back into the
 * decision file's verdict sources and anchors_pending is updated.
 *
 * Boundaries: maintainer-local job (network: wikipedia.org, web.archive.org).
 * Not in CI/build. No secrets, no scraping (API + archive requests only).
 *
 * Usage:
 *   npm run foundry:anchor -- foundry/decisions/<batch>.json [--write]
 *       [--max-snapshot-age-days=7] [--strict]
 */
import { readFileSync, writeFileSync } from "node:fs";

import { die, loadDecision } from "./lib/decision-io.ts";

const USER_AGENT =
  process.env.NOOSPHERE_WIKIDATA_USER_AGENT ||
  "NoosphereFoundry/0.1 (https://github.com/damienmusica/Noosphere; personal knowledge atlas data foundry)";
const SAVE_SPACING_MS = 12_000;
const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 10_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const today = new Date().toISOString().slice(0, 10);

function ageDays(waybackTimestamp: string): number {
  // Wayback timestamps: YYYYMMDDhhmmss
  const iso = `${waybackTimestamp.slice(0, 4)}-${waybackTimestamp.slice(4, 6)}-${waybackTimestamp.slice(6, 8)}`;
  return (Date.parse(today) - Date.parse(iso)) / 86_400_000;
}

async function waybackAvailable(url: string): Promise<{ snapshot_url: string; timestamp: string } | null> {
  // Primary: the availability API. Known-flaky per URL (measured 2026-07-02:
  // empty for SEP pages that certainly have snapshots), so the CDX API is
  // tried as a best-effort fallback — and the pending queue absorbs days when
  // both misbehave.
  try {
    const res = await fetch(
      `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`,
      { headers: { "user-agent": USER_AGENT } },
    );
    if (res.ok) {
      const body = (await res.json()) as {
        archived_snapshots?: { closest?: { available?: boolean; url?: string; timestamp?: string } };
      };
      const closest = body.archived_snapshots?.closest;
      if (closest?.available && closest.url && closest.timestamp) {
        return { snapshot_url: closest.url.replace(/^http:/, "https:"), timestamp: closest.timestamp };
      }
    }
  } catch {
    // fall through to CDX
  }
  try {
    const bare = url.replace(/^https?:\/\//, "");
    const res = await fetch(
      `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(bare)}&limit=-1&fl=timestamp,statuscode&filter=statuscode:200`,
      { headers: { "user-agent": USER_AGENT } },
    );
    if (res.ok) {
      const text = (await res.text()).trim();
      const [timestamp] = text.split("\n").pop()?.split(" ") ?? [];
      if (timestamp && /^\d{14}$/.test(timestamp)) {
        return { snapshot_url: `https://web.archive.org/web/${timestamp}/${url}`, timestamp };
      }
    }
  } catch {
    // no snapshot findable right now
  }
  return null;
}

async function requestSave(url: string): Promise<{ ok: boolean; status: number }> {
  try {
    const res = await fetch(`https://web.archive.org/save/${url}`, {
      headers: { "user-agent": USER_AGENT },
      redirect: "follow",
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** MediaWiki revision permalink for /wiki/<title> URLs (Wikipedia + Wikidata). */
async function wikiRevisionPermalink(url: string): Promise<string | null> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)(wikipedia|wikidata)\.org$/.test(parsed.hostname)) return null;
  const match = /^\/wiki\/(.+)$/.exec(parsed.pathname);
  if (!match?.[1]) return null;
  const title = decodeURIComponent(match[1]);
  const api =
    `https://${parsed.hostname}/w/api.php?action=query&prop=revisions&rvprop=ids` +
    `&titles=${encodeURIComponent(title)}&redirects=1&format=json`;
  const res = await fetch(api, { headers: { "user-agent": USER_AGENT } });
  if (!res.ok) return null;
  const body = (await res.json()) as {
    query?: { pages?: Record<string, { title?: string; revisions?: { revid?: number }[] }> };
  };
  const pages = Object.values(body.query?.pages ?? {});
  const revid = pages[0]?.revisions?.[0]?.revid;
  const resolvedTitle = pages[0]?.title;
  if (!revid || !resolvedTitle) return null;
  return `https://${parsed.hostname}/w/index.php?title=${encodeURIComponent(resolvedTitle.replace(/ /g, "_"))}&oldid=${revid}`;
}

// --- Main ------------------------------------------------------------------------

const args = process.argv.slice(2);
const writeBack = args.includes("--write");
const strict = args.includes("--strict");
const maxAgeArg = args.find((a) => a.startsWith("--max-snapshot-age-days="));
const maxSnapshotAgeDays = maxAgeArg ? Number(maxAgeArg.split("=")[1]) : 7;
const decisionPath = args.find((a) => !a.startsWith("--"));
if (!decisionPath) {
  die("usage: npm run foundry:anchor -- foundry/decisions/<batch>.json [--write] [--strict]");
}

async function main(): Promise<void> {
  const decision = loadDecision(decisionPath!);

  // Collect distinct URLs that still need anchoring.
  type Work = { url: string; needsSnapshot: boolean; needsRevision: boolean };
  const workByUrl = new Map<string, Work>();
  for (const v of decision.verdicts) {
    for (const s of v.sources) {
      const existing = workByUrl.get(s.url) ?? { url: s.url, needsSnapshot: false, needsRevision: false };
      if (!s.snapshot_url) existing.needsSnapshot = true;
      if (!s.revision_permalink && /(^|\.)(wikipedia|wikidata)\.org$/.test(new URL(s.url).hostname)) {
        existing.needsRevision = true;
      }
      if (existing.needsSnapshot || existing.needsRevision) workByUrl.set(s.url, existing);
    }
  }
  if (workByUrl.size === 0) {
    console.log("nothing to anchor — every verdict source already carries its anchors.");
    return;
  }
  console.log(`anchoring ${workByUrl.size} URL(s)...`);

  const snapshots = new Map<string, string>();
  const revisions = new Map<string, string>();
  const pending: { url: string; reason: string }[] = [];
  let firstSave = true;

  for (const work of workByUrl.values()) {
    if (work.needsRevision) {
      const permalink = await wikiRevisionPermalink(work.url);
      if (permalink) {
        revisions.set(work.url, permalink);
        console.log(`  ✓ revision  ${work.url} → ${permalink}`);
      } else {
        pending.push({ url: work.url, reason: "could not resolve wiki revision id" });
        console.log(`  ✗ revision  ${work.url}`);
      }
      await sleep(500);
    }
    if (!work.needsSnapshot) continue;

    const existing = await waybackAvailable(work.url);
    if (existing && ageDays(existing.timestamp) <= maxSnapshotAgeDays) {
      snapshots.set(work.url, existing.snapshot_url);
      console.log(`  ✓ snapshot  ${work.url} → ${existing.snapshot_url} (existing, ${Math.round(ageDays(existing.timestamp))}d old)`);
      continue;
    }

    if (!firstSave) await sleep(SAVE_SPACING_MS);
    firstSave = false;
    console.log(`  … saving   ${work.url}`);
    const save = await requestSave(work.url);
    if (save.status === 429) {
      console.log(`    429 from SPN — backing off ${SAVE_SPACING_MS * 2}ms`);
      await sleep(SAVE_SPACING_MS * 2);
    }
    let found: string | null = null;
    for (let i = 0; i < POLL_ATTEMPTS && !found; i++) {
      await sleep(POLL_INTERVAL_MS);
      const check = await waybackAvailable(work.url);
      if (check && ageDays(check.timestamp) <= maxSnapshotAgeDays) found = check.snapshot_url;
    }
    if (found) {
      snapshots.set(work.url, found);
      console.log(`  ✓ snapshot  ${work.url} → ${found}`);
    } else if (existing) {
      // Honest fallback: an older snapshot beats none, and the pending queue records the gap.
      snapshots.set(work.url, existing.snapshot_url);
      pending.push({ url: work.url, reason: `[SPN-FAILED] fresh save did not materialize; using ${Math.round(ageDays(existing.timestamp))}d-old snapshot` });
      console.log(`  ⚠ snapshot  ${work.url} → ${existing.snapshot_url} (stale fallback, save pending)`);
    } else {
      pending.push({ url: work.url, reason: "[SPN-FAILED] save did not materialize and no prior snapshot exists" });
      console.log(`  ✗ snapshot  ${work.url}`);
    }
  }

  if (writeBack) {
    const raw = JSON.parse(readFileSync(decisionPath!, "utf8")) as {
      verdicts?: { sources?: { url: string; snapshot_url?: string; revision_permalink?: string }[] }[];
      anchors_pending?: { url: string; reason: string }[];
    };
    for (const v of raw.verdicts ?? []) {
      for (const s of v.sources ?? []) {
        const snap = snapshots.get(s.url);
        const rev = revisions.get(s.url);
        if (snap && !s.snapshot_url) s.snapshot_url = snap;
        if (rev && !s.revision_permalink) s.revision_permalink = rev;
      }
    }
    const touched = new Set([...workByUrl.keys()]);
    raw.anchors_pending = [
      ...(raw.anchors_pending ?? []).filter((p) => !touched.has(p.url)),
      ...pending,
    ];
    writeFileSync(decisionPath!, JSON.stringify(raw, null, 2) + "\n");
    console.log(`✓ wrote anchors into ${decisionPath} (${snapshots.size} snapshots, ${revisions.size} revision permalinks, ${pending.length} pending)`);
  } else if (pending.length > 0) {
    console.log(`\n${pending.length} URL(s) unresolved (re-run with --write to record them as pending):`);
    for (const p of pending) console.log(`  - ${p.url}: ${p.reason}`);
  }

  if (strict && pending.length > 0) process.exit(1);
}

await main();
