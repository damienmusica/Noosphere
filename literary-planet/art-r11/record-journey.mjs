#!/usr/bin/env node
// R11 — 원경 → 중경 → 착륙 → 복귀 전체 여정 영상.
// 사람 관찰 이전에, 정지 프레임으로는 판정할 수 없는 것(전환의 연속성, 렌즈
// 진입·이탈, 왜곡이 눈에 보이는가)을 남긴다.
//
//   node art-r11/record-journey.mjs [--out art-r11/video] [--dist dist]
import { mkdir, readdir, rename, rm } from "node:fs/promises";
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
const outDir = path.resolve(ROOT, opt("out", "art-r11/video"));
const distDir = path.resolve(ROOT, opt("dist", "dist"));

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
const server = await serveDist(distDir);
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  locale: "ko-KR",
  recordVideo: { dir: outDir, size: { width: 1600, height: 900 } }
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

const hold = (ms) => page.waitForTimeout(ms);
const log = (s) => console.log(`  · ${s}`);

// 실제 사용자 경로만 찍는다 — 상태 주입 없이 보이는 컨트롤만 쓴다(R9 규율)
await page.goto(`${server.origin}/universe.html?lens=movement`, { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await hold(2600);
log("원경 · 천구");

// 하늘을 둘러본다
await page.mouse.move(800, 450);
await page.mouse.down();
for (let i = 0; i < 34; i++) {
  await page.mouse.move(800 + i * 7, 450 + Math.sin(i / 6) * 22);
  await hold(16);
}
await page.mouse.up();
await hold(1400);
log("하늘 회전");

// 색인층: 한 항목을 지목한다
await page.locator(".u-lens-groups button").first().hover();
await hold(2000);
log("사조 색인 — 목록↔하늘 연동");
await page.mouse.move(800, 450);
await hold(700);

// 검색으로 별을 찾는다
await page.fill(".u-search input", "카프카");
await page.locator(".u-search__hits button").first().waitFor({ timeout: 4000 });
await hold(700);
await page.locator(".u-search__hits button").first().click();
await hold(3400);
log("중경 · 관측 렌즈 진입");

// 궤도 카드를 읽는다
await page.locator(".u-card").hover();
await page.mouse.wheel(0, 320);
await hold(1500);
await page.mouse.wheel(0, -320);
await hold(800);

// 착륙
await page.locator('[data-testid="land"]').click();
await hold(4200);
log("근경 · 착륙");

// 표면을 돌아본다
await page.mouse.move(700, 450);
await page.mouse.down();
for (let i = 0; i < 26; i++) {
  await page.mouse.move(700 + i * 6, 450);
  await hold(16);
}
await page.mouse.up();
await hold(1200);

// 작품 하나를 연다
await page.locator(".u-works button").first().click();
await hold(2400);
log("작품 인스펙터");

// 궤도로, 그리고 하늘로
await page.locator(".u-top .u-btn--ghost").nth(1).click();
await hold(3000);
log("궤도로 복귀");
await page.locator(".u-top .u-btn--ghost").first().click();
await hold(3400);
log("하늘로 복귀");

// 미준비 작가 — 항성 + 궤도 아카이브
await page.fill(".u-search input", "프루스트");
await page.locator(".u-search__hits button").first().waitFor({ timeout: 4000 });
await page.locator(".u-search__hits button").first().click();
await hold(3600);
log("미준비 작가 · 궤도 아카이브 (착륙 문 없음)");
await hold(1200);

await ctx.close();
await browser.close();
server.close();

// playwright 가 임의 이름으로 저장한 webm 을 정해진 이름으로 옮긴다
for (const f of await readdir(outDir))
  if (f.endsWith(".webm")) await rename(path.join(outDir, f), path.join(outDir, "r11-journey.webm"));

console.log(`\nconsole errors: ${errors.length}`);
console.log(`video → ${path.relative(ROOT, outDir)}/r11-journey.webm`);
process.exit(errors.length ? 1 : 0);
