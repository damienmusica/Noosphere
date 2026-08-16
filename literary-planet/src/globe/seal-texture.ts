// D9 v2 (thesis P2): the ex libris becomes a 방인 — a square stamp.
// Anchors carry 백문 (intaglio: fully inked face, glyph in negative); majors
// and context carry 주문 (relief: border and glyph in ink, majors heavier).
// Edge erosion and a slight stamping rotation are seeded per author id —
// carved once, stamped forever. The glyph itself is data (lib/seal.ts) and is
// never generated. Drawn white and tinted through material.color like v1, so
// selection/dim states need no repaints.

import { mulberry32 } from "../lib/rng.ts";
import type { Tier } from "../types.ts";

// serif stacks per script family — system fonts only, no font payload; the OS
// picks the right face for Cyrillic/CJK/Indic/Arabic
export const SEAL_FONT =
  '"Iowan Old Style", "Palatino", Georgia, "Songti SC", "Hiragino Mincho ProN", "AppleMyungjo", "Nanum Myeongjo", serif';

export const SEAL_SIZE = 256;
const INSET = 30;
const CORNER = 18;

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h | 0;
}

export interface SealCarve {
  /** stamping rotation in radians, within ±2.2° */
  rotation: number;
  /** erosion nicks punched along the face border band */
  nicks: Array<{ x: number; y: number; r: number }>;
}

/** deterministic carving accidents for one seal — pure, testable */
export function sealCarve(seedKey: string, size = SEAL_SIZE, inset = INSET): SealCarve {
  const rand = mulberry32(hashSeed(seedKey));
  const rotation = ((rand() - 0.5) * 4.4 * Math.PI) / 180;
  const lo = inset;
  const hi = size - inset;
  const count = 10 + Math.floor(rand() * 7);
  const nicks: SealCarve["nicks"] = [];
  for (let i = 0; i < count; i++) {
    const t = rand() * 4;
    const side = Math.floor(t) % 4;
    const u = t - Math.floor(t);
    const x = side === 0 ? lo + u * (hi - lo) : side === 1 ? hi : side === 2 ? hi - u * (hi - lo) : lo;
    const y = side === 0 ? lo : side === 1 ? lo + u * (hi - lo) : side === 2 ? hi : hi - u * (hi - lo);
    nicks.push({
      x: x + (rand() - 0.5) * 4,
      y: y + (rand() - 0.5) * 4,
      r: 1.2 + rand() * 3.4
    });
  }
  return { rotation, nicks };
}

function facePath(ctx: CanvasRenderingContext2D, size: number): void {
  const x = INSET;
  const y = INSET;
  const w = size - 2 * INSET;
  const r = CORNER;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + w - r);
  ctx.arcTo(x + w, y + w, x + w - r, y + w, r);
  ctx.lineTo(x + r, y + w);
  ctx.arcTo(x, y + w, x, y + w - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/** paint one 방인 into a fresh canvas (white on transparent, tint via material) */
export function paintSealTexture(glyph: string, tier: Tier, seedKey: string): HTMLCanvasElement {
  const S = SEAL_SIZE;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const carve = sealCarve(seedKey);
  ctx.translate(S / 2, S / 2);
  ctx.rotate(carve.rotation);
  ctx.translate(-S / 2, -S / 2);

  if (tier === "anchor") {
    // 백문: the face is the ink
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    facePath(ctx, S);
    ctx.fill();
  } else {
    // 주문: the line is the ink
    ctx.strokeStyle = tier === "major" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.78)";
    ctx.lineWidth = tier === "major" ? 9 : 6.5;
    facePath(ctx, S);
    ctx.stroke();
  }

  // carving accidents: punched out of whatever ink is there
  ctx.globalCompositeOperation = "destination-out";
  for (const n of carve.nicks) {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";

  // the mark — data, never generated
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const weight = tier === "context" ? 500 : 600;
  let size = tier === "anchor" ? 150 : 140;
  const maxW = S - 2 * INSET - (tier === "anchor" ? 44 : 58);
  ctx.font = `${weight} ${size}px ${SEAL_FONT}`;
  while (ctx.measureText(glyph).width > maxW && size > 56) {
    size -= 6;
    ctx.font = `${weight} ${size}px ${SEAL_FONT}`;
  }
  if (tier === "anchor") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "#000";
    ctx.fillText(glyph, S / 2, S / 2 + 8);
    ctx.globalCompositeOperation = "source-over";
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.94)";
    ctx.fillText(glyph, S / 2, S / 2 + 8);
  }
  return canvas;
}
