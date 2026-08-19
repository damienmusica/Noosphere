#!/usr/bin/env node
// R11 성계 구조 — 콘셉트 프레임 캡처.
// 거리 사다리(원경 → 중경 → 착륙)와 관측층·개인 성좌를 같은 안무로 찍는다.
//
//   node art-r11/capture-universe.mjs --out art-r11/frames [--dist dist]
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
const outDir = path.resolve(ROOT, opt("out", "art-r11/frames"));
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
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

const ready = async () => {
  await page.waitForFunction(() => window.__universe !== undefined, undefined, { timeout: 15000 });
  // 비행이 끝난 프레임을 찍는다. settle() 은 reduced-motion 과 같은 경로.
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.__universe.settle());
  await page.waitForTimeout(250);
};

const shot = async (name) => {
  await page.screenshot({ path: path.join(outDir, `${name}.png`) });
  const m = await page.evaluate(() => window.__universe.metrics());
  console.log(`${name.padEnd(34)} stage=${m.stage} dist=${m.dist} bodies=${m.bodies} labels=${m.labels}`);
  return m;
};

const url = (q) => `${server.origin}/universe.html${q}`;
const report = [];

// ——— 원경: 관측층 3종 ———
for (const [lens, tag] of [
  ["movement", "movement"],
  ["language", "language"],
  ["exile", "exile"]
]) {
  await page.goto(url(`?lens=${lens}`), { waitUntil: "load" });
  await ready();
  report.push({ frame: `0sky-${tag}`, ...(await shot(`0sky-${tag}`)) });
}

// ——— 거리 사다리 × 3인 ———
for (const id of AUTHORS) {
  await page.goto(url(`?lens=movement`), { waitUntil: "load" });
  await ready();
  report.push({ frame: `${id}-1sky`, ...(await shot(`${id}-1sky`)) });

  await page.goto(url(`?lens=movement&a=${id}`), { waitUntil: "load" });
  await ready();
  report.push({ frame: `${id}-2mid`, ...(await shot(`${id}-2mid`)) });

  await page.goto(url(`?lens=movement&a=${id}&land=1`), { waitUntil: "load" });
  await ready();
  report.push({ frame: `${id}-3near`, ...(await shot(`${id}-3near`)) });
}

// ——— 미준비 궤도 경험 (착륙 없음) ———
await page.goto(url("?lens=movement&a=marcel-proust"), { waitUntil: "load" });
await ready();
report.push({ frame: "7orbit-unprepared", ...(await shot("7orbit-unprepared")) });

// ——— 관측층: 목록↔하늘 연동 (범례 지목) ———
await page.goto(url("?lens=language"), { waitUntil: "load" });
await ready();
await page.locator(".u-lens-groups button").first().hover();
await page.waitForTimeout(400);
await page.evaluate(() => window.__universe.settle());
report.push({ frame: "8lens-linked", ...(await shot("8lens-linked")) });

// ——— 전환: 원경 → 착륙 사이의 실제 프레임 ———
await page.goto(url("?lens=movement"), { waitUntil: "load" });
await ready();
await page.evaluate(() => {
  window.__universe.focus("franz-kafka");
  window.__universe.land("franz-kafka");
});
for (let i = 0; i < 6; i++) {
  await page.waitForTimeout(190);
  await page.screenshot({ path: path.join(outDir, `4transition-${i}.png`) });
}
report.push({ frame: "4transition", ...(await page.evaluate(() => window.__universe.metrics())) });

// ——— 개인 성좌 ———
await page.goto(url("?lens=personal"), { waitUntil: "load" });
await page.evaluate(() => {
  const t = Date.now();
  const read = {};
  ["franz-kafka", "natsume-soseki", "jorge-luis-borges", "virginia-woolf", "albert-camus"].forEach(
    (id, i) => {
      read[id] = t - (5 - i) * 86400000;
    }
  );
  localStorage.setItem(
    "lp.universe.personal.v1",
    JSON.stringify({ v: 1, read, want: { "rabindranath-tagore": t } })
  );
});
await page.goto(url("?lens=personal"), { waitUntil: "load" });
await ready();
report.push({ frame: "5personal", ...(await shot("5personal")) });

// ——— 시간 스크럽 (개인 성좌 상태를 비운 뒤) ———
await page.goto(url(""), { waitUntil: "load" });
await page.evaluate(() => localStorage.removeItem("lp.universe.personal.v1"));
for (const y of [1900, 1935, 1970]) {
  await page.goto(url(`?lens=movement&y=${y}`), { waitUntil: "load" });
  await ready();
  report.push({ frame: `6year-${y}`, ...(await shot(`6year-${y}`)) });
}

await browser.close();
server.close();
console.log(`\nconsole errors: ${errors.length}`);
if (errors.length) console.log(errors.slice(0, 5).join("\n"));
console.log(`frames → ${path.relative(ROOT, outDir)}`);
