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
  // order = data/authors 의 readingOrder 길이. 렌더에서 되읽지 않는다 —
  // 색인 글리프 계약이 자기가 검사할 값을 스스로 만들어 내지 않도록.
  { id: "franz-kafka", query: "카프카", works: 5, covers: 4, order: 3, crust: "manuscript", landable: true },
  { id: "natsume-soseki", query: "소세키", works: 6, covers: 5, order: 5, crust: "manuscript", landable: true },
  { id: "rabindranath-tagore", query: "타고르", works: 6, covers: 2, order: 5, crust: "manuscript", landable: true },
  { id: "marcel-proust", query: "프루스트", works: 6, order: 5, crust: null, landable: false }
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
// 발명된 얼굴은 DOM 이 아니라 **네트워크**에서 잡는다 — 미해상 기록도 캔버스를
// 쓰므로(별을 프로덕션 값으로 다시 그린다) "캔버스가 없다"는 더 이상 계약이
// 아니다. 계약은 "상상 초상 자산을 애초에 가져오지 않는다"이다.
const portraitRequests = [];
page.on("request", (r) => {
  if (r.url().includes("/portraits/")) portraitRequests.push(r.url());
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
  // 하늘 분기가 도는 자리에서 판 없는 각자를 계약한다 — 착륙 단계에서만 재면
  // 이 분기 자체가 검사되지 않는다(변이 스윕 실측).
  check("중경의 이름표는 전부 판 없는 각자다",
    m.skyLabels >= 4 && m.crustAuthorLabels === 0,
    `하늘 ${m.skyLabels} · 슬립 단 작가 ${m.crustAuthorLabels}`);

  // 준비되지 않은 작가는 **구로 분해되지 않는다** — 항성 + 궤도 아카이브.
  // (변이 스윕이 이 계약의 부재를 적발했다, 2026-08-20)
  if (a.landable) {
    check("준비된 작가는 천체로 분해된다", m.bodies >= 1 && m.orbitArchive === false,
      `bodies=${m.bodies} orbitArchive=${m.orbitArchive}`);
  } else {
    check("미준비 작가는 항성으로 남는다", m.bodies === 0 && m.orbitArchive === true,
      `bodies=${m.bodies} orbitArchive=${m.orbitArchive}`);
  }

  // 4. 궤도 카드: 착륙 전에도 최소 정보가 전부 있다 (정전화 편향 방지 계약)
  const card = page.locator(".u-card");
  await card.waitFor({ timeout: 4000 });
  const archival = await card.locator(".u-portrait--archival").count();
  const plate = await card.locator('[data-testid="unresolved-record"]').count();
  check("초상 사다리 — 기록 사진 또는 미해상 기록", archival + plate === 1,
    archival ? "기록 사진" : "미해상 기록");
  check("발명된 인간 얼굴 없음 — 상상 초상 자산을 가져오지 않는다",
    portraitRequests.length === 0, `요청 ${portraitRequests.length}건`);
  check("해설", ((await card.locator(".u-card__why").first().textContent()) ?? "").length > 80);
  check("속한 하늘", (await card.locator(".u-card__skies").count()) >= 0);
  check("관계 목록", (await card.locator(".u-card__rel li").count()) >= 1);
  check("출처", ((await card.locator(".u-card__src").first().textContent()) ?? "").includes("출처"));

  // 5. 궤도 관측 — 착륙하지 않아도 이 작가를 읽을 수 있는 전부
  // 입문 순서는 **정확히** readingOrder 다. 이전 판은 나머지 작품을 이어 붙여
  // "독서 순서 5"로 번호를 매겼다 — 착륙 서가는 같은 작품을 입문 경로 밖이라며
  // 뒷단에 내리므로, 두 표면이 서로 모순인 채로 계약이 초록이었다.
  const orbit = card.locator('[data-testid="orbit-reading"]');
  const orbitHead = (await orbit.locator("h3").first().textContent()) ?? "";
  check("카드가 입문 순서라고 부른다 (독서 순서 아님)", orbitHead.includes("입문 순서"),
    orbitHead);
  check("입문 순서가 정확히 편집된 경로다", (await orbit.locator("ol > li").count()) === a.order,
    `${await orbit.locator("ol > li").count()}/${a.order}편`);
  const restCount = await card.locator('[data-testid="orbit-rest"] ul > li').count();
  check("입문 경로 밖 작품은 번호 없이 따로 선다", restCount === a.works - a.order,
    `${restCount}/${a.works - a.order}편`);
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

    // 자산은 착륙 이전에 디코드되어 있어야 하고, 그 근거는 표면에서 읽혀야 한다
    const mm = await metrics();
    check("실물 자산 사전 로드", mm.assetsPreloaded === true);
    check("착륙이 자산보다 먼저 오지 않았다", mm.landedWithoutAssets === false);

    // ——— 작품 도시: 실제 데이터가 배치와 형태를 정한다 ———
    const covers = a.covers ?? 0;
    check("경도가 발표 연도 순이다 (연도가 다르면 경도도 다르다)", mm.cities.byYear === true);
    check("연도 축이 실제로 펼쳐져 있다", mm.cities.lonSpreadDeg > 8, `${mm.cities.lonSpreadDeg}°`);
    check("도시 수가 작품 수와 같다", mm.cities.total === a.works, `${mm.cities.total}/${a.works}`);
    check("실물 초판만 표지를 정면으로 세운다", mm.cities.faceOut === covers,
      `정면 ${mm.cities.faceOut} · 책등 ${mm.cities.spineOut} (실물 ${covers})`);
    check("실물이 없는 작품은 책등이 정면이다", mm.cities.spineOut === a.works - covers);
    // 회전값이 아니라 **월드 법선**으로 다시 묻는다: 여섯 면 중 관측자에게
    // 가장 정면인 면이 실제로 책등인가. 회전값만 보면 재질 배열이 뒤집혀
    // 앞마구리(종이 단면)를 책등이라 불러도 계약이 초록이다.
    check("책등 정면인 권은 실제로 책등 면을 관측자에게 낸다",
      mm.cities.spineFacing === mm.cities.spineOut,
      `책등면 ${mm.cities.spineFacing} / 책등 정면 ${mm.cities.spineOut}`);
    check("표지 정면인 권은 실제로 표지 면을 관측자에게 낸다",
      mm.cities.coverFacing === mm.cities.faceOut,
      `표지면 ${mm.cities.coverFacing} / 표지 정면 ${mm.cities.faceOut}`);
    // 기하만으로는 모자란다 — 재질 배열이 뒤바뀌면 앞마구리 천이 책등 자리에
    // 와도 "책등이 정면"이 성립한다(변이 스윕에서 유일하게 살아남은 변이).
    check("관측자를 향한 그 면에 책등 재질이 붙어 있다",
      mm.cities.spineDressed === mm.cities.spineOut,
      `${mm.cities.spineDressed}/${mm.cities.spineOut}`);
    check("관측자를 향한 그 면에 실물 표지가 붙어 있다",
      mm.cities.coverDressed === mm.cities.faceOut,
      `${mm.cities.coverDressed}/${mm.cities.faceOut}`);
    // 겹침은 3차원 거리가 아니라 **투영된 화면 사각형**으로 잰다. 최소 각간격을
    // 지켜도 빌보드가 권마다 다르게 돌아 화면에서는 겹칠 수 있다(실측).
    check("같은 단의 두 권이 화면에서 겹치지 않는다", mm.cities.overlaps === 0,
      `겹친 쌍 ${mm.cities.overlaps} · 최소 간격 ${mm.cities.minGapPx}px`);
    check("같은 단의 최소 간격이 남아 있다", mm.cities.minGapPx > 4, `${mm.cities.minGapPx}px`);
    check("앞단이 뒷단을 알아볼 수 없게 먹지 않는다", mm.cities.crossHidden < 0.5,
      `최대 ${mm.cities.crossHidden}`);
    check("제본된 책이 서 있다 (투영 세로/가로 > 1)", mm.cities.uprightRatio > 1,
      `${mm.cities.uprightRatio}`);
    check("두 단이 선다 — 입문 경로와 그 외", mm.cities.rows === 2, `${mm.cities.rows}단`);
    check("입문 경로 단이 관측자 쪽에 선다", mm.cities.rowFrontY > mm.cities.rowBackY,
      `앞 ${mm.cities.rowFrontY}px · 뒤 ${mm.cities.rowBackY}px`);
    check("서가 난간이 있다", mm.cities.chrome >= 8, `${mm.cities.chrome}자리`);
    // 눈금은 난간과 **따로** 센다. 한 수치로 합치면 난간 두 줄(자리 10개)만으로
    // 정족수가 차서 연도 축이 통째로 사라져도 계약이 초록이다(감사 지적).
    check("연도 눈금이 축을 이룬다 — 2개 이상", mm.cities.ticks >= 2, `${mm.cities.ticks}개`);
    check("난간·눈금이 지각 안에 묻히지 않았다", mm.cities.chromeBuried === 0,
      `묻힘 ${mm.cities.chromeBuried}/${mm.cities.chrome}`);
    // 입문 순서는 위도가 아니라 라벨의 색인 글리프가 나른다.
    // **정확히 일치**를 요구한다: `>= 1` 은 하나만 남아도 통과하므로, 이 레포가
    // 이미 값을 치른 오탐의 형태 그대로다(스윕 헤더 참조).
    const glyph = await page.evaluate(() => {
      const out = { total: 0, glyphed: [], plain: [] };
      for (const el of document.querySelectorAll(".globe-label--work")) {
        const t = (el.textContent ?? "").trim();
        out.total++;
        (/^[\u2460-\u2473]/.test(t) ? out.glyphed : out.plain).push(el.dataset.labelId);
      }
      return out;
    });
    const ordered = new Set(mm.cities.ordered);
    check("입문 경로 권이 전부 색인 글리프를 단다", glyph.glyphed.length === a.order,
      `${glyph.glyphed.length}/${a.order}`);
    check("글리프를 단 라벨이 정확히 입문 경로 권이다",
      glyph.glyphed.every((id) => ordered.has(id)) && glyph.plain.every((id) => !ordered.has(id)),
      `글리프 ${glyph.glyphed.length} · 민 라벨 ${glyph.plain.length} · 입문 경로 ${ordered.size}`);
    // ——— 착륙 패널: 실물 마크가 카드를 뚫지 않는다 ———
    // 세로 자산(소세키의 낙관 158×420)을 폭으로만 묶으면 691px 로 자라 카드
    // 밖으로 넘쳤다. 수리는 CSS 한 줄이었고, 그 한 줄을 지키는 계약이 없었다.
    const mark = await page.evaluate(() => {
      const img = document.querySelector('[data-testid="mark"]');
      const card = document.querySelector(".u-card--landing");
      if (!img || !card) return null;
      const a = img.getBoundingClientRect();
      const b = card.getBoundingClientRect();
      return { h: Math.round(a.height), w: Math.round(a.width), cardW: Math.round(b.width),
        overflowX: Math.round(a.right - b.right), inverted: getComputedStyle(img).filter };
    });
    check("실물 마크가 착륙 패널 안에 있다",
      mark !== null && mark.h > 8 && mark.h <= 140 && mark.w <= mark.cardW && mark.overflowX <= 0,
      mark ? `${mark.w}×${mark.h}px · 카드 ${mark.cardW}px` : "마크 없음");
    check("마크를 반전시키지 않는다 — 붉은 인장은 붉게 남는다",
      mark !== null && !/invert/.test(mark.inverted), mark ? mark.inverted : "");

    // ——— 라벨의 바닥은 그 라벨이 딛고 선 것과 같다 ———
    // 지각 위의 작품 라벨만 슬립을 갖고, 나머지는 판 없는 각자여야 한다.
    check("작품 라벨은 지각 위 슬립이다", mm.crustLabels >= 3, `${mm.crustLabels}장`);
    const paneled = await page.evaluate(() =>
      [...document.querySelectorAll('.globe-label[data-ground="sky"]')].filter((el) => {
        const cs = getComputedStyle(el);
        return !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) || cs.borderTopWidth !== "0px";
      }).length
    );
    check("하늘 라벨에는 판이 하나도 없다", paneled === 0, `판 달린 라벨 ${paneled}장`);
    check("슬립은 작품 라벨만 갖는다", mm.crustAuthorLabels === 0,
      `작가 라벨 중 슬립 ${mm.crustAuthorLabels}장`);
    const prov = page.locator('[data-testid="provenance"]');
    check("자료 근거가 표면에 있다", (await prov.count()) === 1);
    await prov.locator("summary").click();
    await page.waitForTimeout(150);
    const rows = await prov.locator("li").count();
    check("근거 행이 실물 자산 수와 맞는다", rows >= 3, `${rows}행`);
    const meta = (await prov.locator(".u-prov__meta").first().textContent()) ?? "";
    check("각 행이 소장처와 라이선스를 싣는다", meta.length > 12, meta.slice(0, 42));
  } else {
    // 딥링크로도 백지 지각에 내려앉을 수 없다
    await page.goto(url(`?a=${a.id}&land=1`), { waitUntil: "load" });
    await page.waitForFunction(() => window.__universe !== undefined);
    await settle();
    m = await metrics();
    check("딥링크 착륙도 게이트를 지난다", m.stage !== "surface", `stage=${m.stage}`);
  }

  if (a.landable) {
    // 딥링크로 곧장 착륙해도 자산이 먼저다 — 사용자 경로에서는 접근 중에
    // 자산이 이미 도착하므로, 이 계약은 **즉시 착륙**에서만 검사된다.
    await page.goto(url(`?a=${a.id}&land=1`), { waitUntil: "load" });
    await page.waitForFunction(() => window.__universe !== undefined);
    await settle(1800);
    const dm = await metrics();
    check("딥링크 즉시 착륙도 자산을 기다린다", dm.landedWithoutAssets === false);
    check("딥링크 착륙에서도 지각이 육필이다", dm.crust === a.crust, `crust=${dm.crust}`);
    await page.goto(url(`?lens=movement&a=${a.id}`), { waitUntil: "load" });
    await page.waitForFunction(() => window.__universe !== undefined);
    await settle();
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
