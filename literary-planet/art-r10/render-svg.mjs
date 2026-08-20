#!/usr/bin/env node
// Rasterize the two signature SVGs (Kafka, Tagore) at high resolution for
// the mark-sprite pipeline. Playwright renders them on a transparent page —
// no new dependencies.
import { mkdir } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const JOBS = [
  {
    svg: "art-r10/staging/franz-kafka/kafka-signature.svg",
    out: "art-r10/build/raw/franz-kafka-signature.png",
    width: 1600
  },
  {
    svg: "art-r10/staging/rabindranath-tagore/signature_traced.svg",
    out: "art-r10/build/raw/rabindranath-tagore-signature.png",
    width: 1600
  }
];

await mkdir(path.join(ROOT, "art-r10/build/raw"), { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
for (const job of JOBS) {
  const svg = readFileSync(path.join(ROOT, job.svg), "utf8");
  await page.setContent(
    `<!doctype html><body style="margin:0;background:transparent">` +
      `<div id="w" style="width:${job.width}px">${svg}</div></body>`
  );
  const el = page.locator("#w svg");
  await el.evaluate((s, w) => {
    s.setAttribute("width", String(w));
    s.removeAttribute("height");
  }, job.width);
  const buf = await el.screenshot({ omitBackground: true });
  const { writeFileSync } = await import("node:fs");
  writeFileSync(path.join(ROOT, job.out), buf);
  console.log(job.out);
}
await browser.close();
