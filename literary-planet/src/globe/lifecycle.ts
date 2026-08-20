// Territory grammar v2.x (docs/territory-grammar-v2.md): the year fader
// morphs the planet through baked tectonic keyframes (v2.5) and crossfades
// the sovereignty states modeled here (v2.0). Parking the fader at 전체 시기
// bypasses both layers — the default planet is the frozen v1 plate,
// bit-identical. Pure functions here; the renderer only uploads their output
// as small lookup textures.

import type { Author } from "../types.ts";
import type { YearMode } from "../lib/filter.ts";
import { TIMELINE_MAX } from "../lib/filter.ts";

export interface Lifecycle {
  /** territory alpha multiplier: 0.15 unformed ghost … 1 present */
  presence: number;
  /** 0 living plate … toward 1 = aged classic patina (heritage) */
  patina: number;
}

/** unformed land: coast ghost, no claim yet */
export const GHOST = 0.15;
/** the founding ramp runs activeRange[0] ± 5y */
const FORM_RAMP = 5;
/** heritage patina reaches full depth 15y after the active range ends */
const PATINA_RAMP = 15;
const PATINA_MAX = 0.85;

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/**
 * Sovereignty state of one nation at one year.
 * - cumulative (기본): land is never lost — heritage keeps full presence and
 *   takes on patina ("죽은 작가의 영토는 유산이 된다").
 * - active (당시 활동): the world as of that year — nations outside their
 *   active range recede to the ghost level, matching the star filter.
 */
export function lifecycleOf(author: Author, year: number, yearMode: YearMode): Lifecycle {
  const [start, end] = author.activeRange;
  if (yearMode === "active") {
    const rise = smoothstep(start - 3, start, year);
    const fall = 1 - smoothstep(end, end + 3, year);
    return { presence: GHOST + (1 - GHOST) * Math.min(rise, fall), patina: 0 };
  }
  return {
    presence: GHOST + (1 - GHOST) * smoothstep(start - FORM_RAMP, start + FORM_RAMP, year),
    patina: PATINA_MAX * smoothstep(end, end + PATINA_RAMP, year)
  };
}

/**
 * The fader is the storyteller: at 전체 시기 in cumulative mode the shader
 * bypasses entirely, so the default planet is bit-identical to the
 * CPO-approved v1 plate.
 */
export function lifecycleEngaged(year: number, yearMode: YearMode): boolean {
  return !(year >= TIMELINE_MAX && yearMode === "cumulative");
}

// 256 texels = the author-capacity ceiling of the lifecycle channel. The
// owner index texture (R8, 255 = sea) caps nations at 254; this lookup must
// never be the lower bound (CPO 2026-08-17: the planet must have room for
// the expansion slates — the previous 128 would have broken first).
export const LIFE_TEX_WIDTH = 256;

/**
 * Authors arranged in owner-texture slot order. The terrain shader reads
 * lifeTex at `oid`, an index into territory.geometry.authors — which is NOT
 * dataset order (8th review: 99/100 ids differ; dataset-ordered rows put
 * almost every nation's presence/patina on someone else's land).
 */
export function ownerOrderedAuthors(
  geomAuthorIds: readonly string[],
  authors: readonly Author[]
): Author[] {
  const byId = new Map(authors.map((a) => [a.id, a]));
  // validate-data guarantees every geometry owner exists in the dataset;
  // slots must never shift, so no filtering
  return geomAuthorIds.map((id) => byId.get(id)!);
}

/** RGBA rows for the 256×1 per-author lookup: R = presence, G = patina */
export function buildLifeTexData(
  authors: ReadonlyArray<Author>,
  year: number,
  yearMode: YearMode
): Uint8Array {
  const data = new Uint8Array(LIFE_TEX_WIDTH * 4);
  for (let i = 0; i < authors.length && i < LIFE_TEX_WIDTH; i++) {
    const { presence, patina } = lifecycleOf(authors[i]!, year, yearMode);
    data[i * 4] = Math.round(presence * 255);
    data[i * 4 + 1] = Math.round(patina * 255);
    data[i * 4 + 2] = 0;
    data[i * 4 + 3] = 255;
  }
  return data;
}

// --- unions (D1: movements are landless treaties over member nations) -------

export interface TreatyInterval {
  start: number;
  end: number;
}

/**
 * IMPORTANT (5th review P0-2): these years are COMPUTED from the corpus —
 * the overlap of member nations' activeRanges — not curated historical
 * movement periods. The UI must present them as computed (≈) until a
 * sourced period model exists.
 */
export interface Treaty {
  /** every span with ≥2 members concurrently active, ascending, disjoint */
  intervals: TreatyInterval[];
  /** outer envelope (first start … last end) — the cartouche's display span */
  start: number;
  end: number;
}

/**
 * A union's treaty runs while at least two member nations are active
 * simultaneously. Movements with fewer than two members, or whose members
 * never overlap in time, have no treaty (they stay a data grouping only).
 * Discontinuous overlaps stay separate intervals — a lull in the corpus is
 * not treaty time (the merged-span shortcut was a 5th-review finding: no
 * current movement has a gap, but the next corpus edition may).
 */
export function treatyOf(members: ReadonlyArray<Author>): Treaty | null {
  if (members.length < 2) return null;
  const events: Array<[number, number]> = [];
  for (const m of members) {
    events.push([m.activeRange[0], 1], [m.activeRange[1] + 1, -1]);
  }
  events.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  let depth = 0;
  let open: number | null = null;
  const intervals: TreatyInterval[] = [];
  for (const [y, d] of events) {
    depth += d;
    if (depth >= 2 && open === null) open = y;
    if (depth < 2 && open !== null) {
      intervals.push({ start: open, end: y - 1 });
      open = null;
    }
  }
  if (open !== null) {
    intervals.push({ start: open, end: Math.max(...members.map((m) => m.activeRange[1])) });
  }
  if (intervals.length === 0) return null;
  return {
    intervals,
    start: intervals[0]!.start,
    end: intervals[intervals.length - 1]!.end
  };
}

/**
 * Overlay strength of a treaty at a year. With the fader parked at 전체
 * 시기 (lifecycle bypassed) every treaty shows at full strength — the atlas
 * annotates all unions; scrub the fader and treaties rise and dissolve.
 * Multi-interval treaties dip between their spans (the ink dissolves during
 * a corpus lull and re-forms with the next concurrent generation).
 */
export function treatyPresence(t: Treaty, year: number, yearMode: YearMode): number {
  if (!lifecycleEngaged(year, yearMode)) return 1;
  let strength = 0;
  for (const iv of t.intervals) {
    const rise = smoothstep(iv.start - 3, iv.start + 3, year);
    const fall = 1 - smoothstep(iv.end, iv.end + 10, year);
    strength = Math.max(strength, Math.min(rise, fall));
  }
  return strength;
}
