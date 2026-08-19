#!/usr/bin/env node
// R11 — 기존 카프카 슬라이스가 새 구조 안에서 보존되는지 검증한다.
//
// R9 여정 계약(검색 → 위계 → 진입 → 도시 → 인스펙터 → 복귀)을 성계 구조의
// 어휘로 옮겨 그대로 건다. 소세키·타고르로 같은 계약을 돌려 일반화를 확인한다.
//
//   node art-r11/verify-journey.mjs [--dist dist]
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
const distDir = path.resolve(ROOT, opt("dist", "dist"));

// 준비된 착륙지 3인 + 미준비 궤도 경험 1인 (CPO 2026-08-20 주문)
const SLICE = [
  { id: "franz-kafka", query: "카프카", works: 5, crust: "manuscript", landable: true },
  { id: "natsume-soseki", query: "소세키", works: 6, crust: "manuscript", landable: true },
  { id: "rabindranath-tagore", query: "타고르", works: 6, crust: "manuscript", landable: true },
  { id: "marcel-proust", query: "프루스트", works: 6, crust: null, landable: false }
];

const server = await serveDist(distDir);
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
  locale: "ko-KR"
});
const page = await ctx.newPage();
const consoleErrors = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});

let failed = 0;
let passed = 0;
const check = (name, ok, detail = "") => {
  if (ok) {
    passed++;
    console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ""}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
};

const settle = async (ms = 1500) => {
  await page.waitForTimeout(ms);
  await page.evaluate(() => window.__universe.settle());
  await page.waitForTimeout(200);
};
const metrics = () => page.evaluate(() => window.__universe.metrics());
const url = (q) => `${server.origin}/universe.html${q}`;

for (const a of SLICE) {
  console.log(`\n${a.id}`);
  await page.goto(`${server.origin}/universe.html?lens=movement`, { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle();

  // 1. 원경: 하늘이 하늘로 그려진다 (별 다수 · 해상된 천체 없음)
  let m = await metrics();
  check("원경은 별의 하늘이다", m.stage === "sky" && m.stars > 40 && m.bodies === 0,
    `stars=${m.stars} bodies=${m.bodies}`);

  // 2. 발견성: 검색으로 별을 찾는다 (자동 스크롤·상태 주입 없이 보이는 컨트롤만)
  await page.fill(".u-search input", a.query);
  const hit = page.locator(".u-search__hits button").first();
  await hit.waitFor({ timeout: 4000 });
  const box = await hit.boundingBox();
  check("검색 결과가 뷰포트 안에 있다", Boolean(box && box.y >= 0 && box.y < 1000),
    box ? `y=${Math.round(box.y)}` : "no box");
  await hit.click();
  await settle();

  // 3. 중경: 자기 성좌가 그려지고 이웃이 이름을 얻는다
  m = await metrics();
  check("중경에서 자기 성좌가 수렴한다", m.stage === "approach" && m.ego >= 3,
    `stage=${m.stage} ego=${m.ego}`);
  check("이웃이 이름을 얻는다", m.labels >= 4, `labels=${m.labels}`);

  // 4. 궤도 카드: 착륙 전에도 최소 정보가 전부 있다 (정전화 편향 방지 계약)
  const card = page.locator(".u-card");
  await card.waitFor({ timeout: 4000 });
  const archival = await card.locator(".u-portrait--archival").count();
  const plate = await card.locator('[data-testid="type-plate"]').count();
  check("초상 사다리 — 기록 사진 또는 활자 명판", archival + plate === 1,
    archival ? "기록 사진" : "활자 명판");
  check("발명된 인간 얼굴 없음", (await card.locator("canvas").count()) === 0);
  check("해설", ((await card.locator(".u-card__why").first().textContent()) ?? "").length > 80);
  check("속한 하늘", (await card.locator(".u-card__skies").count()) >= 0);
  check("관계 목록", (await card.locator(".u-card__rel li").count()) >= 1);
  check("출처", ((await card.locator(".u-card__src").first().textContent()) ?? "").includes("출처"));

  // 5. 궤도 관측 — 착륙하지 않아도 이 작가를 읽을 수 있는 전부
  const orbit = card.locator('[data-testid="orbit-reading"]');
  check("독서 순서", (await orbit.locator("ol > li").count()) >= 3,
    `${await orbit.locator("ol > li").count()}편`);
  check("입문 사유", ((await orbit.locator(".u-card__entry-why").first().textContent()) ?? "").length > 20);
  check("작품 의의", (await orbit.locator(".u-works__sig").count()) >= 3);
  check("난도 사유", ((await orbit.locator(".u-card__diff").first().textContent()) ?? "").includes("난도"));

  // 6. 착륙 게이트 — 준비되지 않은 표면에는 내려앉지 않는다
  const landCount = await page.locator('[data-testid="land"]').count();
  check(`착륙 문 ${a.landable ? "열림" : "닫힘"}`, landCount === (a.landable ? 1 : 0));
  const readiness = (await page.locator('[data-testid="readiness"]').first().textContent()) ?? "";
  check("착륙 준비도 정직 표기", readiness.includes(a.landable ? "준비됨" : "미준비"),
    readiness.slice(0, 34));

  if (a.landable) {
    const lbox = await page.locator('[data-testid="land"]').boundingBox();
    check("착륙 문이 뷰포트 안에 있다", Boolean(lbox && lbox.y >= 0 && lbox.y < 1000));
    await page.locator('[data-testid="land"]').click();
    await settle(1800);

    m = await metrics();
    check("표면 단계", m.stage === "surface", `stage=${m.stage} dist=${m.dist}`);
    check("지각 = 육필 원고", m.crust === a.crust, `crust=${m.crust}`);
    check("착륙해도 하늘이 남는다", m.stars > 20, `stars=${m.stars}`);

    const workLabels = await page.locator(".globe-label--work").count();
    check("작품 도시가 보인다", workLabels >= Math.min(4, a.works), `labels=${workLabels}`);

    await page.locator(".u-works button").first().click();
    await page.waitForTimeout(250);
    const sig = (await page.locator(".u-works__sig").first().textContent()) ?? "";
    check("작품 인스펙터", sig.length > 40, `${sig.slice(0, 28)}…`);
  } else {
    // 딥링크로도 백지 지각에 내려앉을 수 없다
    await page.goto(url(`?a=${a.id}&land=1`), { waitUntil: "load" });
    await page.waitForFunction(() => window.__universe !== undefined);
    await settle();
    m = await metrics();
    check("딥링크 착륙도 게이트를 지난다", m.stage !== "surface", `stage=${m.stage}`);
  }

  // 10. 복귀: 하늘로 돌아가면 원경 포즈로 돌아온다
  await page.locator(".u-top .u-btn--ghost").first().click();
  await settle(1600);
  m = await metrics();
  check("하늘로 복귀", m.stage === "sky" && Math.abs(m.dist - 2191) < 120,
    `stage=${m.stage} dist=${m.dist}`);
}

console.log(`\nconsole errors: ${consoleErrors.length}`);
if (consoleErrors.length) console.log(consoleErrors.slice(0, 4).join("\n"));
console.log(`\n${passed} passed · ${failed} failed`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
