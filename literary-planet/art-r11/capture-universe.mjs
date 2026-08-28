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

// ——— 카메라 주권 (R12-f): 손이 잡은 카메라 ———
// 여기서 찍는 것은 상태가 아니라 **여정**이다 — 버튼을 누르지 않고 하늘을
// 가로지른 자리, 그리고 회랑을 걸어 들어간 자리.
{
  const drag = async (dx, dy) => {
    await page.mouse.move(960, 560);
    await page.mouse.down();
    const n = Math.max(4, Math.min(24, Math.round(Math.hypot(dx, dy) / 14)));
    for (let i = 1; i <= n; i++) {
      await page.mouse.move(960 + (dx * i) / n, 560 + (dy * i) / n);
      await page.waitForTimeout(8);
    }
    await page.mouse.up();
    await page.waitForTimeout(200);
    await page.evaluate(() => window.__universe.settle());
  };
  const roll = async (n, step = -140) => {
    await page.mouse.move(960, 560);
    for (let i = 0; i < n; i++) {
      await page.mouse.wheel(0, step);
      await page.waitForTimeout(55);
    }
    await page.waitForTimeout(250);
    await page.evaluate(() => window.__universe.settle());
  };
  const steer = async (id) => {
    for (let i = 0; i < 20; i++) {
      const m = await page.evaluate(() => window.__universe.metrics());
      const raw = await page.evaluate((x) => window.__universe.project(x, true), id);
      if (raw[2] > 1) {
        await drag(360, 0);
        continue;
      }
      const sx = ((raw[0] + 1) / 2) * 1920;
      const sy = ((-raw[1] + 1) / 2) * 1080;
      const dx = m.aim[0] - sx;
      const dy = m.aim[1] - sy;
      if (Math.hypot(dx, dy) < 34) return;
      const cl = (v) => Math.max(-380, Math.min(380, v / 1.9)); // R13 TURN_GAIN
      await drag(cl(dx), cl(dy));
    }
  };

  // 조준하고 밀면 **누르지 않아도** 별이 천체로 분해된다 — 사다리는 늘 거리의
  // 함수였고, 이제 그 사다리를 오를 수단이 손에 있다.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await ready();
  await steer("franz-kafka");
  for (let i = 0; i < 34; i++) {
    const m = await page.evaluate(() => window.__universe.metrics());
    if (m.bodies >= 1 && m.nearest[0] === "franz-kafka" && m.nearest[1] < 340) break;
    await roll(2);
    await steer("franz-kafka");
  }
  report.push({ frame: "7flight-resolve", ...(await shot("7flight-resolve")) });

  // 미준비 작가는 항성으로 남는다(크기는 영향력에 매여 있다) — 다가감에
  // 응답하는 채널은 **이름**이다.
  await steer("jorge-luis-borges");
  for (let i = 0; i < 34; i++) {
    const m = await page.evaluate(() => window.__universe.metrics());
    if (m.nearest[0] === "jorge-luis-borges" && m.nearest[1] < 320) break;
    await roll(1);
    await steer("jorge-luis-borges");
  }
  report.push({ frame: "7flight-arrival", ...(await shot("7flight-arrival")) });

  // 등을 돌린 하늘 — 카메라를 대신 돌리지 않고 성계가 어느 쪽인지만 말한다
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await ready();
  for (let i = 0; i < 12; i++) {
    await drag(380, 0);
    const m = await page.evaluate(() => window.__universe.metrics());
    if (m.onScreenStars === 0) break;
  }
  report.push({ frame: "7flight-homemark", ...(await shot("7flight-homemark")) });

  // 회랑 — 입구에 선 프레임과 걸어 들어간 프레임
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await ready();
  await page.waitForTimeout(1400);
  await page.evaluate(() => window.__universe.settle());
  report.push({ frame: "8walk-entrance", ...(await shot("8walk-entrance")) });
  await roll(4);
  await page.waitForTimeout(400);
  await page.evaluate(() => window.__universe.settle());
  report.push({ frame: "8walk-inside", ...(await shot("8walk-inside")) });
}

await browser.close();
server.close();
console.log(`\nconsole errors: ${errors.length}`);
if (errors.length) console.log(errors.slice(0, 5).join("\n"));
console.log(`frames → ${path.relative(ROOT, outDir)}`);
