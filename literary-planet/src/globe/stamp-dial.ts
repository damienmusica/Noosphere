// R10 selection instrument — the 감상인(鑑賞印) frame + the life dial.
// The circular targeting reticle is retired: selection now (a) stamps a
// vermilion appreciation frame around the author's real mark, the way a
// connoisseur marks what they have seen — vermilion is the selection
// channel's only user — and (b) engraves a paper instrument ring whose
// ticks are YEARS, whose brass arc is the author's active span, and whose
// needle is the timeline's current year. The ornament of the old ring
// becomes data: every stroke here encodes time or selection state.

import * as THREE from "three";
import { COLORS } from "../theme.ts";
import type { Author } from "../types.ts";

/** dial time window — the corpus's working century, fixed so two authors'
 * dials are comparable at a glance */
export const DIAL_MIN = 1850;
export const DIAL_MAX = 2030;
/** dial angles: DIAL_MIN at 150° sweeping clockwise 240° to DIAL_MAX */
const A0 = (150 * Math.PI) / 180;
const SWEEP = (240 * Math.PI) / 180;

export function dialAngle(year: number): number {
  const t = Math.min(1, Math.max(0, (year - DIAL_MIN) / (DIAL_MAX - DIAL_MIN)));
  return A0 + t * SWEEP;
}

/**
 * The rough-edged vermilion appreciation frame, sized to the mark it wraps
 * (aspect = w/h). Drawn as ink on paper: uneven pressure, chipped corners.
 */
export function buildStampFrameTexture(aspect: number): THREE.CanvasTexture {
  const H = 256;
  const W = Math.round(H * Math.max(1, Math.min(4, aspect)));
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const m = 14;
  g.strokeStyle = COLORS.vermilion;
  g.lineWidth = 10;
  g.lineJoin = "round";
  // two passes with jitter = hand-pressed ink, not a vector rectangle
  for (const [jx, jy, alpha] of [
    [0, 0, 0.9],
    [2.5, -1.5, 0.35]
  ] as const) {
    g.globalAlpha = alpha;
    g.beginPath();
    const seg = 14;
    const pts: Array<[number, number]> = [];
    for (let i = 0; i <= seg; i++) pts.push([m + ((W - 2 * m) * i) / seg, m]);
    for (let i = 0; i <= seg; i++) pts.push([W - m, m + ((H - 2 * m) * i) / seg]);
    for (let i = seg; i >= 0; i--) pts.push([m + ((W - 2 * m) * i) / seg, H - m]);
    for (let i = seg; i >= 0; i--) pts.push([m, m + ((H - 2 * m) * i) / seg]);
    pts.forEach(([x, y], i) => {
      const wob = Math.sin(i * 2.7 + jx) * 2.2 + Math.cos(i * 1.3 + jy) * 1.6;
      const nx = x + (y === m || y === H - m ? 0 : wob) + jx;
      const ny = y + (x === m || x === W - m ? 0 : wob) + jy;
      if (i === 0) g.moveTo(nx + wob, ny);
      else g.lineTo(nx, ny + (i % 3 === 0 ? wob * 0.4 : 0));
    });
    g.closePath();
    g.stroke();
  }
  // chipped corners — lift a little ink off
  g.globalCompositeOperation = "destination-out";
  g.globalAlpha = 0.75;
  for (const [x, y] of [
    [m, m],
    [W - m, H - m],
    [W - m, m + 20]
  ] as const) {
    g.beginPath();
    g.arc(x + 4, y + 3, 7, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/**
 * The life dial: a paper instrument ring — year ticks (minor decade, major
 * half-century), the author's ACTIVE SPAN as a solid brass arc, birth/death
 * years lettered at the arc ends. The needle is a separate mesh the
 * renderer rotates to the timeline year (dialAngle).
 */
export function buildDialTexture(author: Author): THREE.CanvasTexture {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const cx = S / 2;
  const r = S * 0.44;

  // paper annulus so the instrument reads over cloth AND paper grounds
  g.strokeStyle = COLORS.paperEdge;
  g.globalAlpha = 0.92;
  g.lineWidth = S * 0.075;
  g.beginPath();
  g.arc(cx, cx, r, A0 - 0.06, A0 + SWEEP + 0.06);
  g.stroke();
  g.strokeStyle = COLORS.paperShadow;
  g.globalAlpha = 0.35;
  g.lineWidth = 2;
  g.beginPath();
  g.arc(cx, cx, r + S * 0.038, A0 - 0.06, A0 + SWEEP + 0.06);
  g.stroke();
  g.beginPath();
  g.arc(cx, cx, r - S * 0.038, A0 - 0.06, A0 + SWEEP + 0.06);
  g.stroke();

  // year ticks — engraved ink on the paper ring
  g.strokeStyle = COLORS.paperInk;
  for (let year = DIAL_MIN; year <= DIAL_MAX; year += 10) {
    const major = year % 50 === 0;
    const a = dialAngle(year);
    const r0 = r - (major ? S * 0.028 : S * 0.016);
    const r1 = r + (major ? S * 0.028 : S * 0.016);
    g.globalAlpha = major ? 0.85 : 0.5;
    g.lineWidth = major ? 3 : 1.6;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * r0, cx + Math.sin(a) * r0);
    g.lineTo(cx + Math.cos(a) * r1, cx + Math.sin(a) * r1);
    g.stroke();
  }

  // the ACTIVE SPAN — a solid brass arc riding the ring
  const [y0, y1] = author.activeRange;
  g.strokeStyle = COLORS.brass;
  g.globalAlpha = 0.95;
  g.lineWidth = S * 0.022;
  g.lineCap = "round";
  g.beginPath();
  g.arc(cx, cx, r, dialAngle(y0), dialAngle(y1));
  g.stroke();

  // life span beneath it — thin, quieter (born → died, when known)
  const born = author.birthYear ?? y0;
  const died = author.deathYear ?? DIAL_MAX;
  g.strokeStyle = COLORS.paperInk;
  g.globalAlpha = 0.45;
  g.lineWidth = 2.4;
  g.beginPath();
  g.arc(cx, cx, r - S * 0.024, dialAngle(born), dialAngle(died));
  g.stroke();

  // arc-end year numerals — the dial is legible without the legend
  g.fillStyle = COLORS.paperInk;
  g.globalAlpha = 0.9;
  g.font = `${S * 0.042}px Georgia, serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  for (const y of [y0, y1]) {
    const a = dialAngle(y);
    const rr = r + S * 0.062;
    g.fillText(String(y), cx + Math.cos(a) * rr, cx + Math.sin(a) * rr);
  }

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
