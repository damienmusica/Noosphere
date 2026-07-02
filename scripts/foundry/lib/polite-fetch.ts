/**
 * Shared polite live-fetch engine (v1.1 hardening, 2026-07-02).
 *
 * Extracted verbatim from fetch-verify.ts so the two maintainer-local network
 * tools that fetch cited/source URLs — citation QC (fetch-verify) and source
 * corpus collection (fetch-corpus) — share ONE politeness implementation
 * instead of each session hand-rolling ad-hoc fetch loops (the #55 source
 * collection hit Wikidata 429s precisely because it lived outside this
 * pattern).
 *
 * The pattern (unchanged from fetch-verify):
 *   - Pass 1: same-host URLs stay SERIAL with a politeness gap; distinct
 *     hosts run in parallel under a bounded pool. Descriptive User-Agent,
 *     20s timeout, redirects followed.
 *   - Pass 2 (safety floor, non-negotiable): non-200 / timeout / network
 *     errors are NEVER classified "dead". They go to a SERIAL backoff retry
 *     queue (≤2 extra attempts: 1s, 4s — anonymous-throttle instant 520/429
 *     pattern, SPN §8). Still failing → "unverified", not dead.
 *
 * Boundaries: maintainer-local; nothing in build/validate:data/CI uses it.
 * Fetches only the specific URLs it is given — no crawling, no link
 * following (repo "no scraping" constraint).
 */
import { mapWithConcurrency, sleep } from "./bounded-pool.ts";

export const TIMEOUT_MS = 20_000;
export const SAME_HOST_GAP_MS = 250;
export const RETRY_BACKOFF_MS = [1_000, 4_000];
export const MAX_CONCURRENCY = 8;

export interface FetchOutcome {
  url: string;
  final: "live" | "binary" | "unverified";
  http_status: number | null;
  attempts: number;
  error: string | null;
  /** Raw text, kept in memory for content checks only — never persisted by this lib. */
  body: string | null;
}

export function looksBinary(contentType: string | null, body: string): boolean {
  if (contentType && /\b(pdf|octet-stream|image|zip)\b/i.test(contentType)) return true;
  return body.slice(0, 4096).includes("\u0000");
}

export async function attemptFetch(
  url: string,
  ua: string,
): Promise<Omit<FetchOutcome, "url" | "attempts">> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": ua, Accept: "text/html,application/json,text/plain,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      // Drain body politely; status alone decides.
      await res.text().catch(() => "");
      return { final: "unverified", http_status: res.status, error: `http ${res.status}`, body: null };
    }
    const body = await res.text();
    if (looksBinary(res.headers.get("content-type"), body))
      return { final: "binary", http_status: res.status, error: null, body: null };
    return { final: "live", http_status: res.status, error: null, body };
  } catch (e) {
    const msg = e instanceof Error ? (e.name === "TimeoutError" ? "timeout" : e.message) : String(e);
    return { final: "unverified", http_status: null, error: msg, body: null };
  }
}

/**
 * Fetch a set of unique URLs politely (pass 1 host-grouped concurrent, pass 2
 * serial backoff). Returns one outcome per input URL; invalid URLs come back
 * "unverified" with error "invalid URL". `log` receives the same progress
 * lines fetch-verify has always printed (caller adds the newline sink).
 */
export async function fetchUrlsPolitely(
  uniqueUrls: string[],
  opts: { ua: string; concurrency?: number; log?: (line: string) => void },
): Promise<Map<string, FetchOutcome>> {
  const log = opts.log ?? ((): void => {});
  const concurrency = Math.min(
    MAX_CONCURRENCY,
    Math.max(1, opts.concurrency ?? MAX_CONCURRENCY),
  );

  const outcomes = new Map<string, FetchOutcome>();
  const hostGroups = new Map<string, string[]>();
  for (const url of uniqueUrls) {
    try {
      const host = new URL(url).hostname;
      const group = hostGroups.get(host);
      if (group) group.push(url);
      else hostGroups.set(host, [url]);
    } catch {
      outcomes.set(url, { url, final: "unverified", http_status: null, attempts: 0, error: "invalid URL", body: null });
    }
  }

  // Pass 1 — concurrent across hosts, serial within a host.
  const groups = [...hostGroups.entries()].sort(([a], [b]) => a.localeCompare(b));
  await mapWithConcurrency(groups, concurrency, async ([, urls]) => {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]!;
      const r = await attemptFetch(url, opts.ua);
      outcomes.set(url, { url, attempts: 1, ...r });
      log(`  ${r.final.padEnd(10)} ${r.http_status ?? "---"} ${url}`);
      if (i < urls.length - 1) await sleep(SAME_HOST_GAP_MS);
    }
  });

  // Pass 2 — SERIAL backoff retries for everything unverified (safety floor:
  // never call a page dead off one anonymous-throttle 520/429/timeout).
  const retryQueue = uniqueUrls.filter((u) => outcomes.get(u)?.final === "unverified" && outcomes.get(u)!.attempts > 0);
  if (retryQueue.length > 0)
    log(`retry pass: ${retryQueue.length} URL(s), serial backoff ≤${RETRY_BACKOFF_MS.length}`);
  for (const url of retryQueue) {
    const prev = outcomes.get(url)!;
    for (const backoff of RETRY_BACKOFF_MS) {
      await sleep(backoff);
      const r = await attemptFetch(url, opts.ua);
      prev.attempts++;
      prev.http_status = r.http_status ?? prev.http_status;
      if (r.final !== "unverified") {
        Object.assign(prev, r);
        log(`  recovered  ${r.http_status ?? "---"} ${url}`);
        break;
      }
      prev.error = r.error;
    }
    if (prev.final === "unverified")
      log(`  unverified ${prev.http_status ?? "---"} ${url} (${prev.error})`);
  }

  return outcomes;
}
