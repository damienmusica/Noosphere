/**
 * Evidence-permanence anchoring for a promotion decision file.
 *
 * Replaces the per-URL hand work (look up a wiki revision ID, request a
 * Wayback snapshot, paste both into the record). For every verdict source in
 * the decision file that still lacks anchors:
 *
 *   - Wikipedia/Wikidata URLs get a revision permalink (…&oldid=NNN) via the
 *     wiki's own API (keyless, read-only). Per §8 (2026-07-02 revision) the
 *     oldid permalink IS the permanence anchor for wiki sources: a source that
 *     has (or obtains this run) a permalink is excluded from the snapshot
 *     pipeline entirely — no SPN attempts, no [SPN-FAILED] ghosts — and
 *     --write drops any leftover pending entries for wiki URLs that carry a
 *     permalink.
 *   - plato.stanford.edu URLs get a SEP fixed-edition permalink
 *     (/archives/<edition>/entries/<slug>/), recorded in the same
 *     revision_permalink field. SEP designates those editions for citation and
 *     never modifies them once archived, so they are the same anchor kind as a
 *     wiki oldid — and they are SEP's only path: the site is excluded from the
 *     Wayback Machine outright, so no snapshot can ever materialize for it.
 *   - Every other URL gets a Wayback snapshot: reuse a recent one when the
 *     availability API has it (default ≤7 days old), otherwise request an
 *     anonymous Save-Page-Now capture and poll until it materializes.
 *     Anonymous SPN is rate-limited — the script spaces requests and backs
 *     off on 429; a batch of 10–20 URLs takes minutes, which is fine.
 *
 * SPN resilience (v1.1 hardening, 2026-07-02 — SPN outages measured on two
 * consecutive sessions, #54 full outage + #55 multi-minute hang):
 *   - every network call carries an explicit timeout (SPN saves used to hang
 *     a run indefinitely on a dead endpoint),
 *   - a circuit breaker OPENS after 3 consecutive SPN failures: the rest of
 *     the run stops attempting saves and degrades to the stale-snapshot
 *     fallback + honest pending entries immediately,
 *   - `--no-spn` skips saves outright (same honest degradation) for days SPN
 *     is known-dead.
 *   Degradation is HONEST either way: a stale snapshot predating QC is
 *   recorded together with an [SPN-FAILED] pending entry — for wiki URLs the
 *   revision permalink remains the exact as-of-QC anchor (§8).
 *
 * Failures are recorded HONESTLY in `anchors_pending` (the [SPN-FAILED]
 * discipline, docs/data-foundry.md §8) — re-run the script until the queue
 * clears; apply-batch surfaces pending anchors on every run. [SPN-FAILED]
 * entries queue their URLs for retry: the next run re-attempts a snapshot even
 * when a stale fallback was already recorded, and a fresh snapshot (within the
 * max age) REPLACES the recorded stale one; a still-stale result only renews
 * the pending entry, never silently drops it.
 *
 * With `--write`, snapshot_url / revision_permalink are written back into the
 * decision file's verdict sources and anchors_pending is updated.
 *
 * Boundaries: maintainer-local job (network: wikipedia.org, web.archive.org).
 * Not in CI/build. No secrets, no scraping (API + archive requests only).
 *
 * Usage:
 *   npm run foundry:anchor -- foundry/decisions/<batch>.json [--write]
 *       [--max-snapshot-age-days=7] [--no-spn] [--strict]
 */
import { readFileSync, writeFileSync } from "node:fs";

import { die, loadDecision } from "./lib/decision-io.ts";

const USER_AGENT =
  process.env.NOOSPHERE_WIKIDATA_USER_AGENT ||
  "NoosphereFoundry/0.1 (https://github.com/damienmusica/Noosphere; personal knowledge atlas data foundry)";
const SAVE_SPACING_MS = 12_000;
const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 10_000;
/** Explicit timeouts — an SPN save against a dead endpoint must fail, not hang the run. */
const SAVE_TIMEOUT_MS = 30_000;
const LOOKUP_TIMEOUT_MS = 15_000;
/** Consecutive SPN failures before the circuit opens for the rest of the run. */
const SPN_BREAKER_THRESHOLD = 3;

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
      { headers: { "user-agent": USER_AGENT }, signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS) },
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
      { headers: { "user-agent": USER_AGENT }, signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS) },
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
      signal: AbortSignal.timeout(SAVE_TIMEOUT_MS),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

/** wikipedia.org/wikidata.org — hosts where the oldid permalink is the permanence anchor (§8). */
function isWikiHost(url: string): boolean {
  try {
    return /(^|\.)(wikipedia|wikidata)\.org$/.test(new URL(url).hostname);
  } catch {
    return false;
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
  let title = decodeURIComponent(match[1]);
  // Special:EntityData/<QID>.<ext> is Wikidata's data endpoint, not a wiki page:
  // the API reports it as a special page with no revisions. The permanence anchor
  // is the underlying entity page's revision.
  const entityData = /^Special:EntityData\/([QPL]\d+)(?:\.\w+)?$/.exec(title);
  if (entityData?.[1]) title = entityData[1];
  const api =
    `https://${parsed.hostname}/w/api.php?action=query&prop=revisions&rvprop=ids` +
    `&titles=${encodeURIComponent(title)}&redirects=1&format=json`;
  let body: {
    query?: { pages?: Record<string, { title?: string; revisions?: { revid?: number }[] }> };
  };
  try {
    const res = await fetch(api, {
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    body = (await res.json()) as typeof body;
  } catch {
    // network error/timeout must degrade to a pending entry, not crash the run
    return null;
  }
  const pages = Object.values(body.query?.pages ?? {});
  const revid = pages[0]?.revisions?.[0]?.revid;
  const resolvedTitle = pages[0]?.title;
  if (!revid || !resolvedTitle) return null;
  return `https://${parsed.hostname}/w/index.php?title=${encodeURIComponent(resolvedTitle.replace(/ /g, "_"))}&oldid=${revid}`;
}

/** plato.stanford.edu — SEP anchors on its own fixed editions (§8). */
function isSepHost(url: string): boolean {
  try {
    return new URL(url).hostname === "plato.stanford.edu";
  } catch {
    return false;
  }
}

/**
 * SEP fixed editions in force on a retrieval date, most recent first.
 *
 * SEP publishes four fixed editions a year (spring/summer/fall/winter); the
 * edition covering a date is the most recent one published on or before it.
 * Earlier editions follow as fallbacks — an entry published after an older
 * edition was frozen simply does not exist there, and the probe skips it.
 */
function sepEditionCandidates(retrievedAt: string): string[] {
  const date = new Date(retrievedAt);
  if (Number.isNaN(date.getTime())) return [];
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const quarters: [string, number][] = [
    ["spr", 3],
    ["sum", 6],
    ["fall", 9],
    ["win", 12],
  ];
  const editions: string[] = [];
  for (let y = year; y >= year - 2; y--) {
    for (let i = quarters.length - 1; i >= 0; i--) {
      const quarter = quarters[i]!;
      if (y < year || quarter[1] <= month) editions.push(`${quarter[0]}${y}`);
    }
  }
  return editions;
}

/**
 * SEP fixed-edition permalink for /entries/<slug>/ URLs.
 *
 * SEP publishes periodically fixed editions under /archives/<edition>/ which it
 * designates for citation and "neither updates nor modifies in any way once the
 * archive is made". That is the same anchor kind as a wiki oldid permalink —
 * publisher-run, immutable, keyless, unaffected by later revision — and it is
 * SEP's ONLY anchor path: plato.stanford.edu is excluded from the Wayback
 * Machine outright ("This URL has been excluded from the Wayback Machine",
 * measured 2026-07-29 across the 2024-2026 range), so SPN can never
 * materialize a snapshot for it.
 */
async function sepEditionPermalink(url: string, retrievedAt: string): Promise<string | null> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname !== "plato.stanford.edu") return null;
  const slug = /^\/entries\/([^/]+)\/?$/.exec(parsed.pathname)?.[1];
  if (!slug) return null;
  for (const edition of sepEditionCandidates(retrievedAt)) {
    const candidate = `https://plato.stanford.edu/archives/${edition}/entries/${slug}/`;
    try {
      const res = await fetch(candidate, {
        headers: { "user-agent": USER_AGENT },
        signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
      });
      if (res.ok) return candidate;
    } catch {
      // network error/timeout — try the next edition
    }
    await sleep(500);
  }
  return null;
}

// --- Main ------------------------------------------------------------------------

const args = process.argv.slice(2);
const writeBack = args.includes("--write");
const strict = args.includes("--strict");
const noSpn = args.includes("--no-spn");
const maxAgeArg = args.find((a) => a.startsWith("--max-snapshot-age-days="));
const maxSnapshotAgeDays = maxAgeArg ? Number(maxAgeArg.split("=")[1]) : 7;
const decisionPath = args.find((a) => !a.startsWith("--"));
if (!decisionPath) {
  die("usage: npm run foundry:anchor -- foundry/decisions/<batch>.json [--write] [--no-spn] [--strict]");
}

async function main(): Promise<void> {
  const decision = loadDecision(decisionPath!);

  // [SPN-FAILED] pending entries are exactly the stale-fallback/no-snapshot
  // cases queued for retry — their URLs need a snapshot attempt even when a
  // stale snapshot_url is already recorded.
  // [ORIGIN-GONE] entries are terminal (decision (116)): the origin URL is
  // permanently unreachable, so a retry can never succeed and the recorded
  // snapshot is already the permanent anchor. Queueing them would re-attempt a
  // dead URL on every run and re-brand the entry [SPN-FAILED], hiding a settled
  // state behind a retryable-looking one.
  const retryUrls = new Set(
    decision.anchors_pending
      .filter((p) => p.reason.includes("[SPN-FAILED]") && !p.reason.includes("[ORIGIN-GONE]"))
      .map((p) => p.url),
  );
  const terminalUrls = new Set(
    decision.anchors_pending.filter((p) => p.reason.includes("[ORIGIN-GONE]")).map((p) => p.url),
  );

  // Collect distinct URLs that still need anchoring.
  type Work = {
    url: string;
    isWiki: boolean;
    isSep: boolean;
    retrievedAt: string;
    hasPermalink: boolean;
    needsSnapshot: boolean;
    needsRevision: boolean;
  };
  const workByUrl = new Map<string, Work>();
  for (const v of decision.verdicts) {
    for (const s of v.sources) {
      const isWiki = isWikiHost(s.url);
      const isSep = isSepHost(s.url);
      // Hosts whose publisher runs its own immutable-edition permalinks (§8).
      const hasEditionAnchor = isWiki || isSep;
      const existing =
        workByUrl.get(s.url) ??
        {
          url: s.url,
          isWiki,
          isSep,
          retrievedAt: s.retrieved_at,
          hasPermalink: false,
          needsSnapshot: false,
          needsRevision: false,
        };
      if (s.revision_permalink) existing.hasPermalink = true;
      if (hasEditionAnchor && !s.revision_permalink) existing.needsRevision = true;
      // A source carrying its publisher's immutable permalink is fully anchored
      // (§8) — no snapshot work. Everyone else needs a snapshot when it's
      // missing or when a prior run left an [SPN-FAILED] retry entry.
      // A terminal [ORIGIN-GONE] URL is settled: its recorded snapshot IS the
      // permanent anchor and the origin cannot be fetched again. Never queue it.
      if (
        !terminalUrls.has(s.url) &&
        !(hasEditionAnchor && s.revision_permalink) &&
        (!s.snapshot_url || retryUrls.has(s.url))
      ) {
        existing.needsSnapshot = true;
      }
      if (existing.needsSnapshot || existing.needsRevision) workByUrl.set(s.url, existing);
    }
  }
  if (workByUrl.size === 0 && !writeBack) {
    console.log("nothing to anchor — every verdict source already carries its anchors.");
    return;
  }
  if (workByUrl.size === 0) {
    // --write still runs: pending entries for permalink-anchored wiki URLs
    // (ghosts) are dropped below even when no fetch work remains.
    console.log("nothing to anchor — every verdict source already carries its anchors.");
  } else {
    console.log(`anchoring ${workByUrl.size} URL(s)...`);
  }

  // `fresh` = obtained/reused within max age this run; only fresh snapshots
  // may REPLACE a previously recorded (stale-fallback) snapshot_url.
  const snapshots = new Map<string, { url: string; fresh: boolean }>();
  const revisions = new Map<string, string>();
  const pending: { url: string; reason: string }[] = [];
  let firstSave = true;
  let spnConsecutiveFailures = 0;
  let spnCircuitOpen = false;

  /** Honest degradation used when SPN is skipped (flag) or the circuit is open. */
  const degradeWithoutSave = (
    url: string,
    existing: { snapshot_url: string; timestamp: string } | null,
    why: string,
  ): void => {
    if (existing) {
      snapshots.set(url, { url: existing.snapshot_url, fresh: false });
      pending.push({
        url,
        reason: `[SPN-FAILED] fresh save skipped (${why}); using ${Math.round(ageDays(existing.timestamp))}d-old snapshot (predates QC)`,
      });
      console.log(`  ⚠ snapshot  ${url} → ${existing.snapshot_url} (stale fallback, ${why})`);
    } else {
      pending.push({ url, reason: `[SPN-FAILED] fresh save skipped (${why}) and no prior snapshot exists` });
      console.log(`  ✗ snapshot  ${url} (${why}, no prior snapshot)`);
    }
  };

  for (const work of workByUrl.values()) {
    if (work.needsRevision) {
      const permalink = work.isSep
        ? await sepEditionPermalink(work.url, work.retrievedAt)
        : await wikiRevisionPermalink(work.url);
      if (permalink) {
        revisions.set(work.url, permalink);
        console.log(`  ✓ ${work.isSep ? "edition " : "revision"}  ${work.url} → ${permalink}`);
      } else {
        pending.push({
          url: work.url,
          reason: work.isSep
            ? "could not resolve a SEP fixed edition containing this entry"
            : "could not resolve wiki revision id",
        });
        console.log(`  ✗ ${work.isSep ? "edition " : "revision"}  ${work.url}`);
      }
      await sleep(500);
    }
    if (!work.needsSnapshot) continue;
    // §8: a URL whose publisher permalink exists (or resolved just above) needs
    // no snapshot — the snapshot pipeline runs for those hosts only as a backup
    // when permalink resolution failed. For SEP there is no backup: it is
    // excluded from the Wayback Machine, so an unresolved entry stays pending.
    if ((work.isWiki || work.isSep) && (work.hasPermalink || revisions.has(work.url))) {
      const kind = work.isSep ? "SEP fixed edition" : "wiki oldid permalink";
      console.log(`  ✓ anchored  ${work.url} (${kind} — snapshot not required, §8)`);
      continue;
    }
    if (work.isSep) {
      console.log(`  ✗ anchored  ${work.url} (SEP is excluded from the Wayback Machine — no snapshot path)`);
      continue;
    }

    const existing = await waybackAvailable(work.url);
    if (existing && ageDays(existing.timestamp) <= maxSnapshotAgeDays) {
      snapshots.set(work.url, { url: existing.snapshot_url, fresh: true });
      console.log(`  ✓ snapshot  ${work.url} → ${existing.snapshot_url} (existing, ${Math.round(ageDays(existing.timestamp))}d old)`);
      continue;
    }

    if (noSpn || spnCircuitOpen) {
      degradeWithoutSave(
        work.url,
        existing,
        noSpn ? "--no-spn" : `SPN circuit open after ${SPN_BREAKER_THRESHOLD} consecutive failures`,
      );
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
      snapshots.set(work.url, { url: found, fresh: true });
      spnConsecutiveFailures = 0;
      console.log(`  ✓ snapshot  ${work.url} → ${found}`);
    } else {
      spnConsecutiveFailures++;
      if (spnConsecutiveFailures >= SPN_BREAKER_THRESHOLD && !spnCircuitOpen) {
        spnCircuitOpen = true;
        console.log(
          `  ⚠ SPN circuit OPEN — ${SPN_BREAKER_THRESHOLD} consecutive saves failed to materialize; ` +
            `remaining URLs degrade to stale-snapshot fallback + pending (re-run when SPN recovers)`,
        );
      }
      if (existing) {
        // Honest fallback: an older snapshot beats none, and the pending queue records the gap.
        snapshots.set(work.url, { url: existing.snapshot_url, fresh: false });
        pending.push({ url: work.url, reason: `[SPN-FAILED] fresh save did not materialize; using ${Math.round(ageDays(existing.timestamp))}d-old snapshot` });
        console.log(`  ⚠ snapshot  ${work.url} → ${existing.snapshot_url} (stale fallback, save pending)`);
      } else {
        pending.push({ url: work.url, reason: "[SPN-FAILED] save did not materialize and no prior snapshot exists" });
        console.log(`  ✗ snapshot  ${work.url}`);
      }
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
        // Fill an empty snapshot_url; an already-recorded one may only be
        // REPLACED when the URL was queued for retry ([SPN-FAILED]) and this
        // run's snapshot is fresh — a stale fallback never overwrites.
        if (snap && (!s.snapshot_url || (retryUrls.has(s.url) && snap.fresh))) s.snapshot_url = snap.url;
        if (rev && !s.revision_permalink) s.revision_permalink = rev;
      }
    }
    // URLs whose source carries its publisher's immutable permalink — a wiki
    // oldid or a SEP fixed edition — are fully anchored (§8); any pending entry
    // for them is a ghost and is dropped.
    const editionAnchored = new Set<string>();
    for (const v of raw.verdicts ?? []) {
      for (const s of v.sources ?? []) {
        if (s.revision_permalink && (isWikiHost(s.url) || isSepHost(s.url))) editionAnchored.add(s.url);
      }
    }
    const touched = new Set([...workByUrl.keys()]);
    raw.anchors_pending = [
      // Terminal entries survive every write-back: they are a settled state, not
      // an in-flight attempt, and nothing this run does can resolve them.
      ...(raw.anchors_pending ?? []).filter((p) => p.reason.includes("[ORIGIN-GONE]")),
      ...(raw.anchors_pending ?? []).filter((p) => !p.reason.includes("[ORIGIN-GONE]") && !touched.has(p.url)),
      ...pending,
    ].filter((p) => !editionAnchored.has(p.url));
    writeFileSync(decisionPath!, JSON.stringify(raw, null, 2) + "\n");
    console.log(`✓ wrote anchors into ${decisionPath} (${snapshots.size} snapshots, ${revisions.size} revision permalinks, ${pending.length} pending)`);
  } else if (pending.length > 0) {
    console.log(`\n${pending.length} URL(s) unresolved (re-run with --write to record them as pending):`);
    for (const p of pending) console.log(`  - ${p.url}: ${p.reason}`);
  }

  if (strict && pending.length > 0) process.exit(1);
}

await main();
