// Terrain texture painter (thesis §②, P1) — turns the frozen bake in
// data/territory.v1.json into equirect canvases at startup. Sea stays
// transparent so the plate cross-fades over the mode-lerped surface sphere;
// everything drawn here is baked geometry — no noise, no field evaluation.
//
// Fill comes from the owner raster (topology-free — polar caps just work);
// lines come from the baked contours. Two resolutions are painted: the
// mid/far plate and a near plate at double scale whose constant-pixel stroke
// widths halve the angular line weight — the etched line survives reading
// distance instead of collapsing into a rope (VAD P1 finding B).

import { COLORS, PERIOD_WASH } from "../theme.ts";
import { eachRun, unwrapFlatX } from "../lib/territory-geometry.ts";
import type { PeriodId, Territory } from "../types.ts";

const COAST = "#8e733f"; // engraved coast brass, same ink as the P0 plate

/**
 * Add a wrapped flat polyline to a path, drawn three times (shifted by
 * ±width) so strokes stay continuous across the horizontal seam. Polar rings
 * (stored endpoints equal modulo one wrap) come out as full rings this way.
 */
function addFlatLine(
  path: Path2D,
  line: number[],
  gridWidth: number,
  sx: number,
  sy: number,
  texWidth: number
): void {
  const un = unwrapFlatX(line, gridWidth);
  for (const shift of [-texWidth, 0, texWidth]) {
    path.moveTo(un[0]! * sx + shift, un[1]! * sy);
    for (let k = 2; k < un.length; k += 2) {
      path.lineTo(un[k]! * sx + shift, un[k + 1]! * sy);
    }
  }
}

function pathOf(
  lines: number[][],
  gridWidth: number,
  sx: number,
  sy: number,
  texWidth: number
): Path2D {
  const path = new Path2D();
  for (const line of lines) addFlatLine(path, line, gridWidth, sx, sy, texWidth);
  return path;
}

/**
 * Paint one affinity plate: raster land fill, a blurred per-territory period
 * wash masked to the land, sub-τ waterlines in the sea, dashed territory
 * borders, and the coast stroke on top.
 *
 * `cell` = texture pixels per bake-grid cell. Stroke widths are constant in
 * pixels, so a larger cell yields angularly finer engraving; dash rhythm and
 * wash blur scale with `cell` to keep their angular size stable across the
 * mid/near plate swap.
 */
export function paintTerrainTexture(
  territory: Territory,
  periodOf: (authorId: string) => PeriodId | undefined,
  cell = 2,
  withCities = false,
  /** curated reading-order index per work (0 = entry); sizes the town rings */
  rankOf?: (workId: string) => number | undefined
): HTMLCanvasElement {
  const g = territory.geometry;
  const texW = g.gridWidth * cell;
  const texH = (g.gridHeight - 1) * cell;
  const canvas = document.createElement("canvas");
  canvas.width = texW;
  canvas.height = texH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // land fill + land mask from the owner raster
  const mask = document.createElement("canvas");
  mask.width = texW;
  mask.height = texH;
  const mctx = mask.getContext("2d");
  ctx.fillStyle = COLORS.surfaceRaised;
  if (mctx) mctx.fillStyle = "#ffffff";
  g.ownerRle.forEach((row, j) => {
    eachRun(row, (x0, count, value) => {
      if (value === 0) return;
      ctx.fillRect(x0 * cell, j * cell, count * cell, cell);
      mctx?.fillRect(x0 * cell, j * cell, count * cell, cell);
    });
  });

  const coastPath = pathOf(g.coast, g.gridWidth, cell, cell, texW);

  // shore under-stroke in land ink: bridges the half-cell offset between the
  // raster fill and the analytic coast line, whatever the cell size
  ctx.strokeStyle = COLORS.surfaceRaised;
  ctx.lineWidth = Math.max(5, cell * 1.6);
  ctx.stroke(coastPath);

  // period wash: owner runs rasterized small, blurred up, then masked to the
  // land raster — watercolor held inside the ink. Falls back to plain
  // bilinear upscale where ctx.filter is unavailable.
  const washSrc = document.createElement("canvas");
  washSrc.width = g.gridWidth;
  washSrc.height = g.ownerRle.length;
  const wsctx = washSrc.getContext("2d");
  const washFull = document.createElement("canvas");
  washFull.width = texW;
  washFull.height = texH;
  const wctx = washFull.getContext("2d");
  if (wsctx && wctx && mctx) {
    g.ownerRle.forEach((row, j) => {
      eachRun(row, (x0, count, value) => {
        if (value === 0) return;
        const id = g.authors[value - 1];
        const period = (id ? periodOf(id) : undefined) ?? "mid-century";
        wsctx.fillStyle = PERIOD_WASH[period];
        wsctx.fillRect(x0, j, count, 1);
      });
    });
    wctx.imageSmoothingEnabled = true;
    if (typeof wctx.filter === "string") wctx.filter = `blur(${2.5 * cell}px)`;
    for (const shift of [-texW, 0, texW]) {
      wctx.drawImage(washSrc, shift, 0, texW, texH);
    }
    wctx.filter = "none";
    wctx.globalCompositeOperation = "destination-in";
    wctx.drawImage(mask, 0, 0);
    ctx.globalAlpha = 0.15;
    ctx.drawImage(washFull, 0, 0);
    ctx.globalAlpha = 1;
  }

  // waterlines (outer 0.5τ faint, inner 0.72τ) — sea-only by construction:
  // land satisfies F ≥ τ, so sub-τ contours cannot enter it
  const wl = g.waterlines;
  const wsx = texW / wl.gridWidth;
  const wsy = texH / (wl.gridHeight - 1);
  ctx.strokeStyle = COLORS.lineAccent;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1.4;
  ctx.stroke(pathOf(wl.outer, wl.gridWidth, wsx, wsy, texW));
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1.6;
  ctx.stroke(pathOf(wl.inner, wl.gridWidth, wsx, wsy, texW));

  // territory borders: dashed, quieter than the coast; dash rhythm keeps its
  // angular size across plate scales
  ctx.setLineDash([3.5 * cell, 3 * cell]);
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 1.7;
  ctx.stroke(pathOf(g.boundaries, g.gridWidth, cell, cell, texW));
  ctx.setLineDash([]);

  // coast stroke last — the strongest line on the plate
  ctx.strokeStyle = COAST;
  ctx.globalAlpha = 0.95;
  ctx.lineWidth = 3;
  ctx.stroke(coastPath);
  ctx.globalAlpha = 1;

  // P3, near plate only (§②-6 reading distance): works as towns, the reading
  // entry at the harbor, the reading order as a dotted route
  if (withCities) {
    for (const c of Object.values(g.cities)) {
      // road first, beneath its towns
      if (c.road.length >= 4) {
        const road = new Path2D();
        const un = unwrapFlatX(c.road, g.gridWidth);
        for (const shift of [-texW, 0, texW]) {
          road.moveTo(un[0]! * cell + shift, un[1]! * cell);
          for (let k = 2; k < un.length; k += 2) {
            road.lineTo(un[k]! * cell + shift, un[k + 1]! * cell);
          }
        }
        ctx.strokeStyle = COLORS.lineAccent;
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 1.3;
        ctx.setLineDash([1.2, 6.5]);
        ctx.stroke(road);
        ctx.setLineDash([]);
      }
      for (const town of c.towns) {
        const isPort = c.portWork === town.id;
        for (const shift of [-texW, 0, texW]) {
          const x = town.x * cell + shift;
          const y = town.y * cell;
          if (x < -20 || x > texW + 20) continue;
          if (isPort) {
            // the harbor: a filled diamond — the reading enters here
            ctx.fillStyle = COLORS.brass;
            ctx.globalAlpha = 0.95;
            ctx.beginPath();
            ctx.moveTo(x, y - 5.5);
            ctx.lineTo(x + 5.5, y);
            ctx.lineTo(x, y + 5.5);
            ctx.lineTo(x - 5.5, y);
            ctx.closePath();
            ctx.fill();
          } else {
            // an inland town: an open ring sized by curated reading rank —
            // earlier in the order = larger; works outside the curated order
            // stay smallest and quieter (P0-4: the map speaks data; the VAD
            // P3 floor keeps a lone island ring above coast noise)
            const rank = rankOf?.(town.id);
            const radius = rank === undefined ? 2.7 : Math.max(2.9, 5.4 - rank * 0.85);
            ctx.strokeStyle = COLORS.brass;
            ctx.globalAlpha = rank === undefined ? 0.62 : 0.92;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  return canvas;
}
