// Territory grammar v2.0 (docs/territory-grammar-v2.md, D1–D5 ratified
// 2026-08-17): the year fader never moves a coastline — it crossfades
// sovereignty states. Pure functions here; the renderer only uploads their
// output as small lookup textures.

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

export const LIFE_TEX_WIDTH = 128;

/** RGBA rows for the 128×1 per-author lookup: R = presence, G = patina */
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

export interface Treaty {
  start: number;
  end: number;
}

/**
 * A union's treaty runs while at least two member nations are active
 * simultaneously. Movements with fewer than two members, or whose members
 * never overlap in time, have no treaty (they stay a data grouping only).
 */
export function treatyOf(members: ReadonlyArray<Author>): Treaty | null {
  if (members.length < 2) return null;
  const events: Array<[number, number]> = [];
  for (const m of members) {
    events.push([m.activeRange[0], 1], [m.activeRange[1] + 1, -1]);
  }
  events.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  let depth = 0;
  let start: number | null = null;
  let end: number | null = null;
  for (const [y, d] of events) {
    depth += d;
    if (depth >= 2 && start === null) start = y;
    if (depth < 2 && start !== null && end === null) end = y - 1;
    if (depth >= 2) end = null; // reopened
  }
  if (start === null) return null;
  return { start, end: end ?? Math.max(...members.map((m) => m.activeRange[1])) };
}

/**
 * Overlay strength of a treaty at a year. With the fader parked at 전체
 * 시기 (lifecycle bypassed) every treaty shows at full strength — the atlas
 * annotates all unions; scrub the fader and treaties rise and dissolve.
 */
export function treatyPresence(t: Treaty, year: number, yearMode: YearMode): number {
  if (!lifecycleEngaged(year, yearMode)) return 1;
  const rise = smoothstep(t.start - 3, t.start + 3, year);
  const fall = 1 - smoothstep(t.end, t.end + 10, year);
  return Math.min(rise, fall);
}
