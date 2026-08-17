#!/usr/bin/env node
// R10 art-pass slice capture — far/mid/near for the three slice authors,
// identical choreography for BASELINE (frozen build) and CANDIDATE builds so
// the blind A/B compares like with like.
//
//   node art-r10/capture-slice.mjs --out art-r10/baseline [--dist dist]
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { serveDist } from "../qa/lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const outDir = path.resolve(ROOT, opt("out", "art-r10/baseline"));
const distDir = path.resolve(ROOT, opt("dist", "dist"));
const AUTHORS = ["franz-kafka", "natsume-soseki", "rabindranath-tagore"];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
const server = await serveDist(distDir);
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
  locale: "ko-KR"
});
const page = await ctx.newPage();

const idle = async () => {
  await page.waitForFunction(() => {
    const m = window.__lpQA?.metrics();
    const r = m?.renderer;
    return r && !r.cameraAnimating && !r.modeTransition && !r.safeAreaSettling;
  }, undefined, { timeout: 12000 });
  await page.waitForTimeout(450);
};

for (const id of AUTHORS) {
  // far: clean overview before any selection
  await page.goto(`${server.origin}/?qa=1#/`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__lpQA !== undefined);
  await idle();
  await page.screenshot({ path: path.join(outDir, `${id}-0far.png`) });

  // mid: select via search (the canonical path), story settled
  await page.fill(".searchbox input", id.split("-").pop());
  try {
    await page.locator(".search-results li").first().waitFor({ timeout: 3000 });
    await page.press(".searchbox input", "Enter");
  } catch {
    // non-Latin query fallback: deep link
    await page.goto(`${server.origin}/?qa=1#/?a=${id}`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__lpQA !== undefined);
  }
  await page.waitForFunction(
    (a) => window.__lpQA?.state().selectedAuthorId === a,
    id,
    { timeout: 6000 }
  );
  await idle();
  await page.waitForTimeout(1600); // narrative alive
  await page.screenshot({ path: path.join(outDir, `${id}-1mid.png`) });

  // near: through the disclosed door
  const door = page.locator(".mini-card__enter, .detail-actions--top .btn-door").first();
  await door.click();
  await idle();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(outDir, `${id}-2near.png`) });
}

await browser.close();
await server.close();
console.log(`slice captures → ${outDir}`);
