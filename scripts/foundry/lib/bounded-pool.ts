/**
 * Minimal bounded-concurrency primitives for Foundry network tools
 * (vault decision (8) pitstop, session #17 — measured serial-fetch bottleneck).
 *
 * Zero dependencies by design (p-limit-like behavior, hand-rolled). Used only
 * by maintainer-local network tools; nothing in build/validate/CI imports this
 * for network purposes.
 *
 * Determinism contract: mapWithConcurrency returns results in INPUT order
 * regardless of completion order — same input → same output shape.
 */

/** Map over items with at most `limit` tasks in flight. Results keep input order. */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const bounded = Math.max(1, Math.floor(limit));
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker(): Promise<void> {
    while (true) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i]!, i);
    }
  }
  const workers = Array.from({ length: Math.min(bounded, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/**
 * Global politeness gate: enforces a minimum interval between *request starts*
 * across all concurrent workers, so a pool of N workers cannot exceed
 * ~1000/intervalMs requests per second against a single API (OpenAlex keyless
 * guidance ~10 rps — callers pick an interval that stays under it).
 */
export class RateGate {
  private nextSlot = 0;
  constructor(private readonly intervalMs: number) {}

  /** Resolves when the caller may start its request. */
  async wait(): Promise<void> {
    const now = Date.now();
    const slot = Math.max(now, this.nextSlot);
    this.nextSlot = slot + this.intervalMs;
    const delay = slot - now;
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
  }
}

export const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));
