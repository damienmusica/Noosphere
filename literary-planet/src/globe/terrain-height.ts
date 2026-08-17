// Lens elevation (grammar §4¾, 7th review PR4) — the height ban's repeal
// made concrete. A CPU chamfer distance transform builds a relief patch for
// ONE nation: interior distance to its own border, normalized, so the
// territory center is a low hill easing to sea level at the coast
// (height = lensValue × smoothstep of border distance). The shader shades
// it (2.5D normal/hillshade); no geometry is displaced in this first slice.

import { eachRun } from "../lib/territory-geometry.ts";
import type { TerritoryGeometry } from "../types.ts";

export interface HeightPatch {
  /** R8 height, row 0 = SOUTH (matches the owner DataTexture orientation) */
  data: Uint8Array;
  w: number;
  h: number;
  /** uv window of the patch inside the full plate texture space */
  u0: number;
  v0: number;
  uSpan: number;
  vSpan: number;
}

/** decode the owner grid for one nation into a mask + bbox (rle rows = north-first) */
function nationMask(
  g: TerritoryGeometry,
  nationIdx: number
): { mask: Uint8Array; minX: number; minY: number; maxX: number; maxY: number } | null {
  const W = g.gridWidth;
  const H = g.ownerRle.length;
  const mask = new Uint8Array(W * H);
  let minX = W;
  let maxX = -1;
  let minY = H;
  let maxY = -1;
  g.ownerRle.forEach((row, j) => {
    eachRun(row, (x0, count, value) => {
      if (value - 1 !== nationIdx) return; // rle value 0 = sea, else authorIdx+1
      for (let x = x0; x < x0 + count; x++) mask[j * W + x] = 1;
      if (x0 < minX) minX = x0;
      if (x0 + count - 1 > maxX) maxX = x0 + count - 1;
      if (j < minY) minY = j;
      if (j > maxY) maxY = j;
    });
  });
  if (maxX < 0) return null;
  return { mask, minX, minY, maxX, maxY };
}

/**
 * Two-pass 3-4 chamfer over the nation's bbox (+1 pad). O(bbox); a large
 * nation is a few thousand cells — comfortably synchronous on selection.
 */
export function buildNationHeightPatch(
  g: TerritoryGeometry,
  nationIdx: number
): HeightPatch | null {
  const found = nationMask(g, nationIdx);
  if (!found) return null;
  const W = g.gridWidth;
  const H = g.ownerRle.length;
  const x0 = Math.max(0, found.minX - 1);
  const y0 = Math.max(0, found.minY - 1);
  const x1 = Math.min(W - 1, found.maxX + 1);
  const y1 = Math.min(H - 1, found.maxY + 1);
  const pw = x1 - x0 + 1;
  const ph = y1 - y0 + 1;
  const INF = 1e9;
  const dist = new Float32Array(pw * ph);
  for (let y = 0; y < ph; y++) {
    for (let x = 0; x < pw; x++) {
      dist[y * pw + x] = found.mask[(y0 + y) * W + (x0 + x)] ? INF : 0;
    }
  }
  // forward
  for (let y = 0; y < ph; y++) {
    for (let x = 0; x < pw; x++) {
      const i = y * pw + x;
      if (dist[i] === 0) continue;
      let d = dist[i]!;
      if (x > 0) d = Math.min(d, dist[i - 1]! + 3);
      if (y > 0) {
        d = Math.min(d, dist[i - pw]! + 3);
        if (x > 0) d = Math.min(d, dist[i - pw - 1]! + 4);
        if (x < pw - 1) d = Math.min(d, dist[i - pw + 1]! + 4);
      }
      dist[i] = d;
    }
  }
  // backward
  let maxD = 0;
  for (let y = ph - 1; y >= 0; y--) {
    for (let x = pw - 1; x >= 0; x--) {
      const i = y * pw + x;
      if (dist[i] === 0) continue;
      let d = dist[i]!;
      if (x < pw - 1) d = Math.min(d, dist[i + 1]! + 3);
      if (y < ph - 1) {
        d = Math.min(d, dist[i + pw]! + 3);
        if (x < pw - 1) d = Math.min(d, dist[i + pw + 1]! + 4);
        if (x > 0) d = Math.min(d, dist[i + pw - 1]! + 4);
      }
      dist[i] = d;
      if (d < INF && d > maxD) maxD = d;
    }
  }
  if (maxD <= 0) return null;
  // smoothstep of normalized border distance → the coast eases to sea level
  const data = new Uint8Array(pw * ph);
  for (let y = 0; y < ph; y++) {
    const outRow = ph - 1 - y; // texture row 0 = south; rle row 0 = north
    for (let x = 0; x < pw; x++) {
      const t = Math.min(1, dist[y * pw + x]! / maxD);
      const s = t * t * (3 - 2 * t);
      data[outRow * pw + x] = Math.round(s * 255);
    }
  }
  return {
    data,
    w: pw,
    h: ph,
    u0: x0 / W,
    // rle row y1 (south edge of bbox) maps to texture v = (H-1-y1)/H
    v0: (H - 1 - y1) / H,
    uSpan: pw / W,
    vSpan: ph / H
  };
}
