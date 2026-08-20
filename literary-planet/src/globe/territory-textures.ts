// Territory grammar v2.0 lookup textures (docs/territory-grammar-v2.md).
// The painted plate stays exactly as baked; these small side-channels let a
// shader modulate it per nation (lifecycle) and per union (treaty overlay)
// without touching a single coastline.

import * as THREE from "three";
import { eachRun, unwrapFlatX } from "../lib/territory-geometry.ts";
import { makeCanvas, type PlateCanvas } from "./terrain-texture.ts";
import { UNION_COLORS } from "../theme.ts";
import type { Movement, TerritoryGeometry } from "../types.ts";

/**
 * Per-texel owner index at bake-grid resolution, nearest-filtered — exact,
 * with no antialiased blending that could invent intermediate authors.
 * R = author index (position in geometry.authors), 255 = open sea.
 * Rows are written flipped so v-orientation matches the flipY canvas plates.
 */
export function buildOwnerTexture(g: TerritoryGeometry): THREE.DataTexture {
  const w = g.gridWidth;
  const h = g.ownerRle.length;
  const data = new Uint8Array(w * h * 4);
  g.ownerRle.forEach((row, j) => {
    const outRow = h - 1 - j; // DataTexture row 0 = v0 (south); rle row 0 = north
    eachRun(row, (x0, count, value) => {
      const idx = value === 0 ? 255 : value - 1;
      for (let x = x0; x < x0 + count; x++) {
        const o = (outRow * w + x) * 4;
        data[o] = idx;
        data[o + 3] = 255;
      }
    });
  });
  const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.wrapS = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/** flat polyline array → Path2D with seam wrapping (same idiom as the painter) */
function pathOf(lines: number[][], gridWidth: number, s: number, texW: number): Path2D {
  const path = new Path2D();
  for (const line of lines) {
    const un = unwrapFlatX(line, gridWidth);
    for (const shift of [-texW, 0, texW]) {
      path.moveTo(un[0]! * s + shift, un[1]! * s);
      for (let k = 2; k < un.length; k += 2) {
        path.lineTo(un[k]! * s + shift, un[k + 1]! * s);
      }
    }
  }
  return path;
}

/**
 * Union treaty strokes (D1: movements own no land — they annotate their
 * members'). For each movement, its members' territory edges get a thin
 * stroke inset from the border, like union membership marks on a political
 * map. The canvas encodes the MOVEMENT INDEX in R (color and treaty-period
 * alpha come from the 32×1 info texture at draw time), so one baked canvas
 * serves every year the fader can visit.
 *
 * Inset slots cycle by movement index so an author holding two memberships
 * shows two distinct rings.
 */
export function paintUnionCanvas(
  g: TerritoryGeometry,
  movements: ReadonlyArray<Movement>,
  membersOf: (movementId: string) => number[] // owner indices (authors[] order)
): PlateCanvas {
  const cell = 2;
  const texW = g.gridWidth * cell;
  const texH = (g.gridHeight - 1) * cell;
  const canvas = makeCanvas(texW, texH);
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
  if (!ctx) return canvas;

  const edges = new Path2D();
  const coastPath = pathOf(g.coast, g.gridWidth, cell, texW);
  const boundaryPath = pathOf(g.boundaries, g.gridWidth, cell, texW);
  edges.addPath(coastPath);
  edges.addPath(boundaryPath);

  const INSET_SLOTS = [3, 7, 11];
  const STROKE_W = 2.2;

  const band = makeCanvas(texW, texH);
  const bctx = band.getContext("2d") as CanvasRenderingContext2D | null;
  const mask = makeCanvas(texW, texH);
  const mctx = mask.getContext("2d") as CanvasRenderingContext2D | null;
  if (!bctx || !mctx) return canvas;

  movements.forEach((mv, mi) => {
    const members = membersOf(mv.id);
    if (members.length < 2) return; // a union needs at least two nations
    const inset = INSET_SLOTS[mi % INSET_SLOTS.length]!;

    // member mask from the owner raster
    mctx.clearRect(0, 0, texW, texH);
    mctx.fillStyle = "#fff";
    const memberSet = new Set(members);
    g.ownerRle.forEach((row, j) => {
      eachRun(row, (x0, count, value) => {
        if (value === 0 || !memberSet.has(value - 1)) return;
        mctx.fillRect(x0 * cell, j * cell, count * cell, cell);
      });
    });

    // band along all territory edges at [inset, inset+w] inside…
    bctx.clearRect(0, 0, texW, texH);
    bctx.globalCompositeOperation = "source-over";
    bctx.lineJoin = "round";
    bctx.lineCap = "round";
    bctx.strokeStyle = `rgb(${mi},0,0)`; // movement index in R
    bctx.lineWidth = 2 * (inset + STROKE_W);
    bctx.stroke(edges);
    bctx.globalCompositeOperation = "destination-out";
    bctx.lineWidth = 2 * inset;
    bctx.stroke(edges);
    // …kept only where the edge belongs to a member territory
    bctx.globalCompositeOperation = "destination-in";
    bctx.drawImage(mask as CanvasImageSource, 0, 0);

    ctx.drawImage(band as CanvasImageSource, 0, 0);
  });

  return canvas;
}

export const UNION_INFO_WIDTH = 32;

/** linear-space rgb for union mi — treaty alpha is filled in per year */
export function unionColorLinear(mi: number): [number, number, number] {
  const c = new THREE.Color(UNION_COLORS[mi % UNION_COLORS.length]!).convertSRGBToLinear();
  return [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)];
}
