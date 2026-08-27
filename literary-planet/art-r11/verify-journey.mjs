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
  { id: "franz-kafka", query: "카프카", works: 6, covers: 4, order: 3, crust: "manuscript", landable: true },
  { id: "natsume-soseki", query: "소세키", works: 6, covers: 5, order: 5, crust: "manuscript", landable: true },
  { id: "rabindranath-tagore", query: "타고르", works: 6, covers: 2, order: 5, crust: "manuscript", landable: true },
  { id: "marcel-proust", query: "프루스트", works: 6, order: 5, crust: null, landable: false }
];

// 속한 하늘 기대값은 렌더가 아니라 /data 에서 센다: 사조 수 + 언어 수 + 망명 기록 여부
import { readdirSync, readFileSync } from "node:fs";
const dataAuthors = readdirSync(path.join(ROOT, "data/authors"))
  .flatMap((f) => {
    const j = JSON.parse(readFileSync(path.join(ROOT, "data/authors", f), "utf8"));
    return Array.isArray(j) ? j : (j.authors ?? []);
  });
// 렌즈와 같은 규칙으로 센다: 구성원 2인 미만인 버킷은 색인 그룹이 되지 않는다
// (lenses.ts `members.length < 2` — 벵골어는 타고르 한 사람이라 하늘이 아니다).
const bucket = new Map();
for (const d of dataAuthors) {
  const keys = [
    ...(d.movements ?? []).map((m) => `movement:${m}`),
    ...(d.languages ?? []).map((l) => `language:${l}`),
    ...((d.locations ?? []).some((l) => l.role === "exile") ? ["exile:exile"] : [])
  ];
  for (const k of keys) bucket.set(k, (bucket.get(k) ?? 0) + 1);
}
// 실-책 계약이 이 판에서 실제로 측정된 횟수 — 0 이면 그 계약은 없는 것과 같다
let threadBookMeasured = 0;
for (const a of SLICE) {
  const d = dataAuthors.find((x) => x.id === a.id);
  const keys = [
    ...(d?.movements ?? []).map((m) => `movement:${m}`),
    ...(d?.languages ?? []).map((l) => `language:${l}`),
    ...((d?.locations ?? []).some((l) => l.role === "exile") ? ["exile:exile"] : [])
  ];
  a.skies = keys.filter((k) => (bucket.get(k) ?? 0) >= 2).length;
}
// 관계 기대값도 /data 에서 센다 — 카드의 행 수·방향 글리프·요약문은 렌더가
// 아니라 관계 파일과 대조한다(관계 263건 전부에 summary·direction 이 있다).
const dataRelations = readdirSync(path.join(ROOT, "data/relations"))
  .flatMap((f) => {
    const j = JSON.parse(readFileSync(path.join(ROOT, "data/relations", f), "utf8"));
    return Array.isArray(j) ? j : (j.relations ?? []);
  });
const relById = new Map(dataRelations.map((r) => [r.id, r]));
// 작품 세계 기대값도 /data 에서 — 여는 문장·판본·유고는 렌더가 아니라 작품 파일과 대조한다
const dataWorks = readdirSync(path.join(ROOT, "data/works"))
  .flatMap((f) => {
    const j = JSON.parse(readFileSync(path.join(ROOT, "data/works", f), "utf8"));
    return Array.isArray(j) ? j : (j.works ?? []);
  });
const workById = new Map(dataWorks.map((w) => [w.id, w]));
const glyphOf = (r, self) => (r.direction === "bidirectional" ? "↔" : r.sourceId === self ? "→" : "←");
const EV_RANK = { documented: 3, scholarly_consensus: 2, editorial_inference: 1 };
for (const a of SLICE) {
  const mine = dataRelations.filter((r) => r.sourceId === a.id || r.targetId === a.id);
  a.relations = mine.length;
  a.directed = mine.filter((r) => r.direction === "directed").length;
}

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
  // 출발 구도를 기억한다 — 복귀 계약이 "처음 있던 화면"을 이것과 대조한다
  const cam0 = m.cam;
  const labelIds = () =>
    page.evaluate(() =>
      [...document.querySelectorAll(".globe-label--author")]
        .filter((el) => el.style.display !== "none")
        .map((el) => el.dataset.labelId)
    );
  const labels0 = new Set(await labelIds());

  if (a.id === "franz-kafka") {
    // 이름표는 **상자째** 크롬 밖에 있어야 한다. 앵커 한 점으로 자르면 상자는
    // 중앙 정렬로 그려지므로 절반이 패널에 물린 채 통과한다(외부 검토 실측:
    // 1440×900 에서 7/90, 윌리엄 포크너 ① 은 헤더에 통째로 매몰).
    const bitten = await page.evaluate(() => {
      const chrome = [];
      const sel = ".u-top, .u-time, .u-card, .u-grip, .u-lenses, .u-mine, .u-why, .u-search__hits";
      for (const el of document.querySelectorAll(sel)) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.05) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        chrome.push({ t: el.className.toString().split(" ")[0], x: r.left, y: r.top, w: r.width, h: r.height });
      }
      const out = [];
      for (const el of document.querySelectorAll(".globe-label")) {
        if (el.style.display === "none") continue;
        const r = el.getBoundingClientRect();
        for (const c of chrome) {
          const ox = Math.min(r.right, c.x + c.w) - Math.max(r.left, c.x);
          const oy = Math.min(r.bottom, c.y + c.h) - Math.max(r.top, c.y);
          if (ox > 1 && oy > 1) { out.push(`${(el.textContent ?? "").trim().slice(0, 12)}/${c.t}`); break; }
        }
      }
      return { chrome: chrome.length, labels: document.querySelectorAll(".globe-label").length, out };
    });
    check("이름표가 크롬에 물리지 않는다 (상자로 잰다)", bitten.out.length === 0,
      `크롬 ${bitten.chrome}판 · 물린 ${bitten.out.length}개${bitten.out.length ? " — " + bitten.out.join(", ") : ""}`);

    // 범례 행은 **누름**으로도 지목된다 — 손끝에는 얹는 동작이 없기 때문이다.
    // 두 채널을 한 칸에 두었더니 탭이 켜자마자 껐다(외부 검토 실측 7/7 무반응).
    const legendBtn = page.locator('[data-testid="lens-legend"] button').first();
    await legendBtn.click();
    await page.waitForTimeout(300);
    await page.evaluate(() => window.__universe.settle());
    const pin = await page.evaluate(() => ({
      pressed: document.querySelector('[data-testid="lens-legend"] button')?.getAttribute("aria-pressed"),
      listed: [...document.querySelectorAll(".globe-label--author.is-listed")].filter(
        (el) => el.style.display !== "none"
      ).length
    }));
    check("범례 행을 누르면 눌린 채로 남는다 (마우스를 떼도)",
      pin.pressed === "true" && pin.listed >= 1, `pressed ${pin.pressed} · 지목 ${pin.listed}`);
    await page.mouse.move(800, 450);
    await page.waitForTimeout(250);
    // 숨겨진 라벨은 지난 프레임의 클래스를 그대로 갖고 있다(labels.ts 는
    // 자리를 잃은 라벨을 display:none 으로 둘 뿐 클래스를 지우지 않는다).
    // 보이는 것만 센다.
    const stillOn = await page.evaluate(
      () =>
        [...document.querySelectorAll(".globe-label--author.is-listed")].filter(
          (el) => el.style.display !== "none"
        ).length
    );
    check("커서를 떼도 누른 지목은 남는다", stillOn >= 1, `${stillOn}`);
    await legendBtn.click();
    await page.waitForTimeout(200);
    // 커서를 뗀 뒤에 잰다 — 행 위에 얹혀 있는 동안은 호버가 정상적으로 켠다
    await page.mouse.move(800, 450);
    await page.waitForTimeout(300);
    await page.evaluate(() => window.__universe.settle());
    const off = await page.evaluate(() => ({
      pressed: document.querySelector('[data-testid="lens-legend"] button')?.getAttribute("aria-pressed"),
      listed: [...document.querySelectorAll(".globe-label--author.is-listed")].filter(
        (el) => el.style.display !== "none"
      ).length
    }));
    check("다시 누르면 풀린다 (커서를 뗀 자리에서 잰다)",
      off.pressed === "false" && off.listed === 0, `pressed ${off.pressed} · 지목 ${off.listed}`);
    await page.waitForTimeout(150);

    // 범례 지목은 관계 이웃과 다른 등록부다 — 같은 놋쇠 기준선을 주면 사조가
    // 같을 뿐인 별이 근거 있는 관계 이웃과 바이트 단위로 같아진다(모의 심사 실측).
    await page.locator('[data-testid="lens-legend"] button').first().hover();
    await page.waitForTimeout(300);
    const reg = await page.evaluate(() => ({
      neighbor: document.querySelectorAll(".globe-label--author.is-neighbor").length,
      listed: document.querySelectorAll(".globe-label--author.is-listed").length
    }));
    check("범례 지목은 이웃 등록부를 빌리지 않는다", reg.neighbor === 0 && reg.listed >= 1,
      `neighbor ${reg.neighbor} · listed ${reg.listed}`);
    await page.mouse.move(800, 450);
    await page.waitForTimeout(200);

    // 검색 Enter 는 첫 결과를 고른다 — 아무 일도 안 하는 Enter 는 "왜 안 되지"다
    await page.fill(".u-search input", a.query);
    await page.locator(".u-search__hits button").first().waitFor({ timeout: 4000 });
    await page.press(".u-search input", "Enter");
    await settle();
    const viaEnter = await page.locator(".u-card[data-author]").first().getAttribute("data-author");
    check("검색창에서 Enter 가 첫 결과를 고른다", viaEnter === a.id, `${viaEnter}`);
    check("Enter 뒤 검색 목록이 닫힌다", (await page.locator(".u-search__hits").count()) === 0);
    check("선택 뒤 포커스가 <body> 에 떨어지지 않는다",
      await page.evaluate(() => document.activeElement !== document.body));
    await page.locator('[data-testid="to-sky"]').click();
    await settle(1600);
    await page.fill(".u-search input", "");
  }

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
  // 선 다이어트 (R12-c, CPO): 관련성은 **이름**이 말한다 — 기본 상태에 실은 0,
  // 이웃 전원은 이름표. 실은 지목한 별 한 가닥에만 걸린다(아래 호버 계약).
  check("중경의 기본 상태에 실이 없다 (이름이 관련성을 말한다)",
    m.stage === "approach" && m.ego === 0 && m.arrows === 0,
    `stage=${m.stage} ego=${m.ego} arrows=${m.arrows}`);
  check("이웃이 이름을 얻는다", m.labels >= 4, `labels=${m.labels}`);
  // 확대된 천체 뒤의 별 이름이 그 천체 위에 찍히지 않는다 — DOM 의 라벨 앵커를
  // 초점 원반 안쪽에서 센다(가드 코드가 아니라 남은 라벨을 읽는다)
  check("가려진 별의 이름이 초점 원반 위에 찍히지 않는다", m.labelsOverFocus === 0,
    `원반 위 ${m.labelsOverFocus} · 접힌 이름 ${m.occludedLabels}`);
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
  // 사다리 2단 (R12 서명 파도): 기록 사진이 없는 작가는 권리 확인된 서명을 실물
  // 기록으로 싣고, 근거 행을 같은 표면에 단다. 사진이 있으면 서명 기록은 서지 않는다.
  const markRec = await card.locator('[data-testid="mark-record"]').count();
  if (a.landable) check("기록 사진이 있으면 서명 기록은 서지 않는다", markRec === 0, `${markRec}`);
  else {
    const mp = card.locator('[data-testid="mark-provenance"]');
    const mpText = ((await mp.first().textContent().catch(() => "")) ?? "");
    const hasLink = (await mp.locator("a").count()) >= 1;
    check("미준비 작가의 궤도 카드에 서명 기록이 선다", markRec === 1, `${markRec}`);
    check("서명 기록에 근거 행(라이선스·원본 링크)이 붙는다", /Public domain|CC0|CC BY/i.test(mpText) && hasLink, mpText.slice(0, 40));
  }
  check("초상 사다리 — 기록 사진·서명 기록·미해상 기록 중 정확히 하나", archival + markRec + plate === 1,
    archival ? "기록 사진" : markRec ? "서명 기록" : "미해상 기록");
  check("발명된 인간 얼굴 없음 — 상상 초상 자산을 가져오지 않는다",
    portraitRequests.length === 0, `요청 ${portraitRequests.length}건`);
  check("해설", ((await card.locator(".u-card__why").first().textContent()) ?? "").length > 80);
  // `>= 0` 은 실패할 수 없는 계약이었다(모의 심사 적발). /data 에서 기대값을 센다.
  const skyItems = await card.locator(".u-card__skies em").count();
  check("속한 하늘이 데이터의 소속 수와 같다", skyItems === a.skies, `${skyItems}/${a.skies}`);
  // 기록 사진의 근거는 **사진이 보이는 이 카드**가 싣는다
  const hasPhoto = (await card.locator(".u-portrait--archival").count()) === 1;
  if (hasPhoto) {
    const pp = card.locator('[data-testid="portrait-provenance"] .u-prov__meta');
    check("기록 사진에 근거 행이 붙어 있다", ((await pp.first().textContent()) ?? "").length > 12);
  } else {
    check("기록 사진이 없으면 근거 행도 없다", (await card.locator('[data-testid="portrait-provenance"]').count()) === 0);
  }
  // 관계 인과성 (R12): 선이 왜 그어졌는지가 카드에 있다 — 행 수는 /data 와
  // 같고, 각 행은 방향 글리프·요약문·근거 등급을 싣고, 강한 근거가 먼저 온다.
  const relRows = card.locator('[data-testid="orbit-relations"] li');
  const relCount = await relRows.count();
  check("관계 목록이 /data 의 관계 수와 같다", relCount === a.relations, `${relCount}/${a.relations}`);
  const rows = await relRows.evaluateAll((els) =>
    els.map((el) => ({
      id: el.dataset.relation,
      glyph: el.dataset.direction,
      ev: el.dataset.evidence,
      why: (el.querySelector(".u-rel__why")?.textContent ?? "").trim(),
      evText: (el.querySelector(".u-rel__ev")?.textContent ?? "").trim()
    }))
  );
  const glyphOk = rows.filter((r) => relById.get(r.id) && glyphOf(relById.get(r.id), a.id) === r.glyph).length;
  check("관계마다 방향 글리프가 /data 의 방향과 일치한다", glyphOk === relCount && relCount > 0, `${glyphOk}/${relCount}`);
  const whyOk = rows.filter((r) => relById.get(r.id) && r.why.startsWith(relById.get(r.id).summary.slice(0, 24))).length;
  check("관계마다 '왜'(summary) 가 실려 있다", whyOk === relCount, `${whyOk}/${relCount}`);
  const evOk = rows.filter((r) => /문헌 기록|학계 통설|편집 추론/.test(r.evText) && !/documented|scholarly|editorial/.test(r.evText)).length;
  check("근거 등급은 독자의 말로 적히고 코드 값이 새지 않는다", evOk === relCount, `${evOk}/${relCount}`);
  // 앵커 칩: 요약이 지목한 책·연도가 행에 적힌다 — 수는 /data 의 anchors 수와 같다
  const chipCount = await card.locator('[data-testid="anchor-chip"]').count();
  const expectChips = rows.reduce((n, r) => n + ((relById.get(r.id)?.anchors ?? []).length), 0);
  check("앵커 칩 수가 /data 의 앵커 수와 같다", chipCount === expectChips, `${chipCount}/${expectChips}`);
  const ranks = rows.map((r) => EV_RANK[r.ev] ?? 0);
  check("강한 근거가 먼저 온다", ranks.every((v, i) => i === 0 || v <= ranks[i - 1]), ranks.join(""));
  // 지목 한 가닥 (R12-c): 이웃 별에 마우스를 올리면 **그 별에만** 실이 걸리고,
  // 방향이면 화살촉이 서고, "왜" 문장이 무대에 적힌다. 떼면 전부 사라진다.
  {
    let rel = null;
    let pt = null;
    for (const r of rows) {
      const cand = relById.get(r.id);
      if (!cand) continue;
      const otherId = cand.sourceId === a.id ? cand.targetId : cand.sourceId;
      const q = await page.evaluate((id) => window.__universe.project(id), otherId);
      if (q && q[0] > 270 && q[0] < 1140 && q[1] > 90 && q[1] < 900) {
        rel = cand;
        pt = q;
        break;
      }
    }
    let whyText = "";
    let hm = null;
    if (pt) {
      await page.mouse.move(pt[0], pt[1]);
      await page.waitForTimeout(200);
      await page.evaluate(() => window.__universe.settle());
      whyText = ((await page.locator('[data-testid="why"]').textContent().catch(() => "")) ?? "").trim();
      hm = await metrics();
    }
    let head = "";
    if (rel) {
      const nameKo = (id) => dataAuthors.find((x) => x.id === id)?.names?.ko ?? id;
      const otherId = rel.sourceId === a.id ? rel.targetId : rel.sourceId;
      const g = glyphOf(rel, a.id);
      head = g === "↔" ? `${nameKo(a.id)} ↔ ${nameKo(otherId)}` : g === "→" ? `${nameKo(a.id)} → ${nameKo(otherId)}` : `${nameKo(otherId)} → ${nameKo(a.id)}`;
    }
    check("지목한 별에만 실이 걸린다 (한 가닥)", Boolean(hm) && hm.ego === 1, hm ? `ego ${hm.ego}` : "캔버스 안 이웃 없음");
    if (rel)
      check("그 실의 화살촉 — 방향이면 도착 끝에 하나, 아니면 없음",
        Boolean(hm) &&
          hm.arrowsExpected === (rel.direction === "directed" ? 1 : 0) &&
          hm.arrows === hm.arrowsExpected &&
          hm.arrowsAtTarget === hm.arrows,
        hm ? `화살촉 ${hm.arrows}/${hm.arrowsExpected} 도착 ${hm.arrowsAtTarget}` : "");
    check("이웃 별 호버에 그 관계의 '왜'가 무대에 적힌다 (출발 → 도착 · 요약)",
      Boolean(pt) && whyText.startsWith(head) && whyText.includes(rel.summary.slice(0, 24)),
      pt ? whyText.slice(0, 44) : "캔버스 안 이웃 없음");
    // 카드의 관계 행도 **지목 수단**이다. 지금까지 실을 부를 수 있는 곳은
    // 캔버스뿐이어서, 카드 행에 얹어도 하늘은 아무 반응이 없었고 키보드
    // 사용자에게는 지목 수단이 아예 없었다(외부 검토 2026-08-24, 실측
    // 13회 전부 ego 0). 행에 얹으면 그 별의 실이 선다.
    // **먼저 비운다.** 바로 앞 계약이 별 위에 마우스를 올려 두었으므로, 그대로
    // 재면 카드 행의 배선을 통째로 뽑아도 ego 1 이 남는다 — 변이 스윕이 이
    // 계약을 생존으로 잡아냈다(2026-08-25).
    await page.mouse.move(5, 500);
    await page.waitForTimeout(200);
    await page.evaluate(() => window.__universe.settle());
    const cleared = await metrics();
    check("행에 얹기 전 하늘은 비어 있다 (아래 계약의 전제)", cleared.ego === 0, `ego ${cleared.ego}`);
    const rowBtn = page.locator('[data-testid="orbit-relations"] li button').first();
    const rowOther = await page.evaluate(() => {
      const li = document.querySelector('[data-testid="orbit-relations"] li');
      return li?.dataset.relation ?? null;
    });
    await rowBtn.hover();
    await page.waitForTimeout(250);
    await page.evaluate(() => window.__universe.settle());
    const rm = await metrics();
    check("카드의 관계 행에 얹으면 하늘에 그 실이 선다",
      rm.ego === 1 && (await page.locator('[data-testid="why"]').count()) === 1,
      `ego ${rm.ego} · ${rowOther}`);
    await rowBtn.evaluate((el) => el.focus());
    await page.waitForTimeout(250);
    await page.evaluate(() => window.__universe.settle());
    const km = await metrics();
    check("키보드 포커스도 같은 지목이다 (마우스 없이 인과를 읽는다)", km.ego === 1, `ego ${km.ego}`);
    await rowBtn.evaluate((el) => el.blur());
    // 행에 얹으려면 카드를 스크롤해야 한다 — 뒤따르는 계약("착륙 문이 뷰포트
    // 안에 있다")의 전제는 **막 열린 카드**이므로 스크롤을 되돌린다.
    await page.evaluate(() => {
      const c = document.querySelector(".u-card");
      if (c) c.scrollTop = 0;
    });
    await page.waitForTimeout(200);

    await page.mouse.move(5, 500);
    await page.waitForTimeout(200);
    await page.evaluate(() => window.__universe.settle());
    const um = await metrics();
    check("호버를 떼면 실도 일지도 사라진다",
      um.ego === 0 && um.arrows === 0 && (await page.locator('[data-testid="why"]').count()) === 0,
      `ego ${um.ego}`);
    // 방향 없는 관계(친연·대비)를 지목하면 실은 걸리되 **화살촉은 없다** —
    // 화살촉의 존재 자체가 방향 주장이므로, 없는 방향에 붙으면 거짓말이다.
    const bidi = rows
      .map((r) => relById.get(r.id))
      .filter((cand) => cand && cand.direction === "bidirectional");
    let bp = null;
    let bRel = null;
    for (const cand of bidi) {
      const otherId = cand.sourceId === a.id ? cand.targetId : cand.sourceId;
      const q = await page.evaluate((id) => window.__universe.project(id), otherId);
      if (q && q[0] > 270 && q[0] < 1140 && q[1] > 90 && q[1] < 900) { bp = q; bRel = cand; break; }
    }
    if (bp) {
      await page.mouse.move(bp[0], bp[1]);
      await page.waitForTimeout(200);
      await page.evaluate(() => window.__universe.settle());
      const bm = await metrics();
      check("방향 없는 관계의 실에는 화살촉이 없다", bm.ego === 1 && bm.arrows === 0 && bm.arrowsExpected === 0,
        `ego ${bm.ego} 화살촉 ${bm.arrows} (${bRel.type})`);
      await page.mouse.move(5, 500);
      await page.waitForTimeout(150);
      await page.evaluate(() => window.__universe.settle());
    } else if (bidi.length) {
      check("친연 이웃이 화면 밖 — 무화살촉 계약 미측정", true, "관측 불가");
    }
  }
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
  check("준비도 문장에 코드 값이 새지 않는다", !/not-started|in-progress|\bready\b/.test(readiness));
  if (a.landable) check("준비됨 문장이 검수 항목을 이름으로 말한다", readiness.includes("문구 검수"));

  if (a.landable) {
    const lbox = await page.locator('[data-testid="land"]').boundingBox();
    check("착륙 문이 뷰포트 안에 있다", Boolean(lbox && lbox.y >= 0 && lbox.y < 1000));
    await page.locator('[data-testid="land"]').click();
    await settle(1800);

    m = await metrics();
    check("표면 단계", m.stage === "surface", `stage=${m.stage} dist=${m.dist}`);
    check("지각 = 육필 원고", m.crust === a.crust, `crust=${m.crust}`);
    check("착륙해도 하늘이 남는다", m.stars > 20, `stars=${m.stars}`);
    check("착륙한 천체의 관계선은 표면에서 퇴장한다", m.linesTouchingLanded === 0,
      `닿는 선 ${m.linesTouchingLanded}`);
    check("착륙 뒤 포커스가 착륙 패널에 있다",
      await page.evaluate(() => Boolean(document.activeElement?.closest?.(".u-card--landing"))));

    const workLabels = await page.locator(".globe-label--work").count();
    check("작품 도시가 보인다", workLabels >= Math.min(4, a.works), `labels=${workLabels}`);

    await page.locator(".u-works button").first().click();
    await page.waitForTimeout(250);
    const sig = (await page.locator(".u-works__sig").first().textContent()) ?? "";
    check("작품 인스펙터", sig.length > 40, `${sig.slice(0, 28)}…`);

    // 작품 세계 (R12): 열린 작품의 시트를 /data 의 world 와 대조한다. 자료가 있는
    // 작품은 여는 문장(원문 그대로)·자체 번역 표시·판본 수·유고 행이 맞아야 하고,
    // 자료가 없는 작품은 없다고 적혀야 한다 — 둘 다 계약이다.
    {
      const sheet = page.locator('[data-testid="work-world"]').first();
      const openedId = await sheet.getAttribute("data-work");
      const dw = workById.get(openedId);
      const has = (await sheet.getAttribute("data-has-world")) === "1";
      check("열린 작품의 시트가 그 작품의 것이다", Boolean(dw) && openedId === dw.id, `${openedId}`);
      if (dw?.world) {
        const orig = ((await sheet.locator(".u-work__orig").textContent().catch(() => "")) ?? "").trim();
        const ko = ((await sheet.locator(".u-work__ko").textContent().catch(() => "")) ?? "").trim();
        const tag = ((await sheet.locator(".u-work__tag").textContent().catch(() => "")) ?? "").trim();
        const eds = await sheet.locator('[data-testid="work-editions"] li').count();
        const post = await sheet.locator('[data-testid="work-posthumous"]').count();
        const srcN = ((await sheet.locator('[data-testid="work-sources"] summary').textContent().catch(() => "")) ?? "");
        check("여는 문장이 원문 그대로다", has && orig === dw.world.opening.original, `${orig.slice(0, 30)}…`);
        check("여는 문장의 한국어가 자체 번역으로 표시된다", ko === dw.world.opening.ko && tag.includes("자체 번역"), tag);
        check("판본 행 수가 /data 와 같다", eds === dw.world.editions.length, `${eds}/${dw.world.editions.length}`);
        check("유고 행은 유고일 때만 선다", post === (dw.world.posthumous ? 1 : 0), `유고 ${post}`);
        check("시트가 근거를 센다", /근거 \d+건/.test(srcN) && !/근거 0건/.test(srcN), srcN.trim());
      } else {
        const none = ((await sheet.locator(".u-work__none").textContent().catch(() => "")) ?? "");
        check("자료 없는 작품은 없다고 적는다", !has && none.includes("아직"), none.slice(0, 24));
      }
      // 유고 행의 '선다' 쪽도 계약한다 — 『소송』(1925, 브로트 편)을 열어 본다
      const post = dataWorks.find((w) => w.authorId === a.id && w.world?.posthumous);
      if (post) {
        await page.locator(".u-works button", { hasText: post.titleKo }).first().click();
        await page.waitForTimeout(250);
        const sh = page.locator('[data-testid="work-world"]').first();
        const id2 = await sh.getAttribute("data-work");
        const postRow = ((await sh.locator('[data-testid="work-posthumous"]').textContent().catch(() => "")) ?? "");
        const orig2 = ((await sh.locator(".u-work__orig").textContent().catch(() => "")) ?? "").trim();
        check("유고 작품의 시트에 편집자와 경위가 선다",
          id2 === post.id && postRow.includes(post.world.posthumous.editor) && postRow.length > 30 && orig2 === post.world.opening.original,
          `${id2} · ${postRow.slice(0, 26)}…`);
        // 시트를 닫는다 — 아래 회랑 계약은 쉬는 상태에서 잰다
        await page.locator(".u-works button", { hasText: post.titleKo }).first().click();
        await page.waitForTimeout(500);
        await page.evaluate(() => window.__universe.settle());
      }
    }

    // 자산은 착륙 이전에 디코드되어 있어야 하고, 그 근거는 표면에서 읽혀야 한다
    let mm = await metrics();
    check("실물 자산 사전 로드", mm.assetsPreloaded === true);
    check("착륙이 자산보다 먼저 오지 않았다", mm.landedWithoutAssets === false);

    // 회랑 계약은 쉬는 상태에서 잰다 — 위 블록이 시트를 열어 두었으면 닫는다
    {
      await page.evaluate(() => window.__universe.settle());
      const open = (await metrics()).pulled;
      if (open) {
        const wKo0 = dataWorks.find((w) => w.id === open)?.titleKo ?? "";
        if (wKo0) {
          await page.locator(".u-works button", { hasText: wKo0 }).first().click();
          await page.waitForTimeout(500);
        }
        await page.evaluate(() => window.__universe.settle());
      }
      mm = await metrics();
    }

    // ——— 서가 회랑 (R12-c): 행성 지각이 접혀 올라온 회랑 ———
    // 칸 수·사망선·명판·책등 통일·당김은 전부 /data 와 월드 기하에서 잰다.
    const covers = a.covers ?? 0;
    const dA = dataAuthors.find((x) => x.id === a.id);
    const wYears = dataWorks.filter((w) => w.authorId === a.id).map((w) => w.year);
    const aYears = dataRelations
      .filter((r) => r.sourceId === a.id || r.targetId === a.id)
      .flatMap((r) => (r.anchors ?? []).map((an) => (an.workId ? (workById.get(an.workId)?.year ?? an.year) : an.year)))
      .filter((y) => y !== undefined);
    // 구간의 **시작**은 그 작가 자신의 것(작품·사망)만으로 정해진다. 앵커는
    // 뒤로만 늘린다 — 첫 작품 이전의 앵커는 상대의 전사이지 그의 연보가 아니다
    // (실측: 마샤두 1881 을 그대로 받으면 소세키의 서가가 1879 부터 선다).
    const ownY = [...wYears, ...(dA?.deathYear !== undefined ? [dA.deathYear] : [])];
    const expBays = Math.max(...ownY, ...aYears) + 4 - (Math.min(...ownY) - 2);
    check("회랑 칸 수 = 데이터 구간(작품·앵커·사망 + 여유)", mm.bays === expBays, `${mm.bays}/${expBays}`);
    check("접힘이 끝까지 섰다", mm.foldK === 1, `fold ${mm.foldK}`);
    check("책 수 = 작품 수", mm.cities.total === a.works, `${mm.cities.total}/${a.works}`);
    // 전부 책등 (CPO 룰링): 서가는 균일하다 — 소장 여부는 당길 때 드러난다.
    // 카메라가 아니라 **회랑 접선**과 잰다(스치는 각도에서 argmax 는 거짓말한다).
    check("전부 책등 — 쉬는 권 전원의 책등 축이 입구를 향한다",
      mm.restingSpineToEntrance === mm.resting && mm.resting === a.works && mm.pulled === null,
      `정렬 ${mm.restingSpineToEntrance}/${mm.resting} 당김 ${mm.pulled} · ${JSON.stringify(mm.restingDots)}`);
    check("그 면에 붙은 것이 실제 책등 재질이다 (앞마구리 천 아님)",
      mm.restingSpineDressed === mm.resting, `${mm.restingSpineDressed}/${mm.resting}`);
    check("연도가 다르면 자리도 다르다", mm.cities.byYear === true);
    const hasRest = a.works > a.order;
    check("두 단 — 입문 단이 아래에 선다", mm.cities.rows === (hasRest ? 2 : 1) && mm.entryRowBelow,
      `${mm.cities.rows}단 · 아래 ${mm.entryRowBelow}`);
    const yS = Math.min(...ownY) - 2;
    const yE = Math.max(...ownY, ...aYears) + 4;
    let expTicks = 0;
    for (let y = Math.ceil(yS / 5) * 5; y <= yE; y += 5) expTicks++;
    check("바닥 연도 각인 수 = 구간의 5년 배수", mm.cities.ticks === expTicks, `${mm.cities.ticks}/${expTicks}`);
    check("사망선은 사망 연도가 있을 때만 선다", mm.deathLine === (dA?.deathYear !== undefined), `${mm.deathLine}`);
    check("입구 명판(서명 실물)이 선다", mm.plate === true);
    // 연보 명패: 관계 앵커의 사건 연도(an.year 우선) + 발표 연도 밖 판본 +
    // 같은 해 첫 인쇄(게재지) — 기대값은 /data 에서 같은 사상으로 접는다
    {
      let expEvents = 0;
      for (const r of dataRelations) {
        if (r.sourceId !== a.id && r.targetId !== a.id) continue;
        const seen = new Set();
        for (const an of r.anchors ?? []) {
          const y = an.year ?? (an.workId ? workById.get(an.workId)?.year : undefined);
          if (y === undefined || seen.has(y)) continue;
          // 구간 시작 이전의 앵커는 명패가 서지 않는다(위 주석과 같은 규칙)
          if (y < Math.min(...ownY) - 2) continue;
          seen.add(y);
          expEvents++;
        }
      }
      for (const w of dataWorks.filter((w) => w.authorId === a.id)) {
        for (const e of w.world?.editions ?? []) {
          if (e.year !== w.year) expEvents++;
          else if (e.kind === "first-printing" && e.venue) expEvents++;
        }
      }
      check("연보 명패 수 = 데이터의 사건 수 (앵커 연도·판본·첫 인쇄)",
        mm.eventSlips === expEvents, `${mm.eventSlips}/${expEvents}`);
    }
    // 같은 해 두 권은 서로를 관통하지 않는다. 화면 상자로 재면 안 된다 —
    // 회랑 카메라는 서가를 스치듯 보므로 떨어져 선 두 권도 화면에서는 겹친다
    // (실측: 타고르 1910 두 권의 화면 간격 −13.6px, 국소 간격은 +0.21책폭).
    check("같은 칸의 두 권은 관통하지 않는다 (국소 좌표, 책 폭 대비)",
      mm.cities.sameBayGapW > 0,
      `간격 ${mm.cities.sameBayGapW}${mm.cities.sameBayGapW === 999 ? " (같은 해 두 권 없음)" : "책폭"}`);
    check("착륙 하늘에 이름 뜬 별이 있다 — 회랑의 끝은 벽이 아니다",
      mm.skyLabels >= (a.relations >= 10 ? 4 : 2), `${mm.skyLabels} (관계 ${a.relations})`);
    // 입문 순서는 라벨의 일반 숫자 — 원 숫자는 색인 전용 (기존 계약 유지)
    const glyph = await page.evaluate(() => {
      const out = { total: 0, numbered: [], plain: [], circled: 0 };
      for (const el of document.querySelectorAll(".globe-label--work")) {
        const t = (el.textContent ?? "").trim();
        out.total++;
        if (/^[\u2460-\u2473]/.test(t)) out.circled++;
        (/^\d+ /.test(t) ? out.numbered : out.plain).push(el.dataset.labelId);
      }
      return out;
    });
    const ordered = new Set(mm.cities.ordered);
    // 원근의 회랑에서 먼 권의 쪽지는 충돌 컬링에 접힐 수 있다 — 문법은
    // "숫자는 순서 권에만"이지 "전 권 상시 노출"이 아니다. 가까운 쪽 최소 3장.
    check("입문 경로 권의 순서 숫자가 선다 (컬링 감안 최소 3)",
      glyph.numbered.length >= Math.min(a.order, 3) && glyph.numbered.length <= a.order,
      `${glyph.numbered.length}/${a.order}`);
    check("순서 숫자를 단 라벨이 정확히 입문 경로 권이다",
      glyph.numbered.every((id) => ordered.has(id)) && glyph.plain.every((id) => !ordered.has(id)),
      `숫자 ${glyph.numbered.length} · 민 라벨 ${glyph.plain.length}`);
    check("서가에 원 숫자(색인 글리프)가 서지 않는다", glyph.circled === 0, `${glyph.circled}`);
    check("착륙 중에는 색인 범례가 내려간다", (await page.locator('[data-testid="lens-legend"]').count()) === 0);

    // ——— 당김: 책을 누르면 서가에서 나와 표지를 통로로 돌린다 ———
    // 사각(책 사각형 바깥 12px)을 눌러도 열린다 — 프록시 계약 계승.
    // 스치는 시점에서는 사각(死角)이 이웃 칸을 관통한다 — 화면에서 가장 큰
    // (= 가장 가까운) 권의 중심을 누른다. 프록시는 실사용의 근접 오차를 위한 것.
    const cands = Object.entries(mm.cities.boxes)
      .filter(([, b]) => (b[0] + b[2]) / 2 > 280 && (b[0] + b[2]) / 2 < 1500 && (b[1] + b[3]) / 2 > 60 && (b[1] + b[3]) / 2 < 900)
      .sort((x, y) => (y[1][3] - y[1][1]) * (y[1][2] - y[1][0]) - (x[1][3] - x[1][1]) * (x[1][2] - x[1][0]));
    const firstId = cands[0]?.[0];
    const fb = firstId ? mm.cities.boxes[firstId] : null;
    if (fb) {
      const cy = (fb[1] + fb[3]) / 2;
      const cx = (fb[0] + fb[2]) / 2;
      await page.mouse.click(cx, cy);
      await page.waitForTimeout(900);
      await page.evaluate(() => window.__universe.settle());
      const pm = await metrics();
      const pbox = pm.cities.boxes[pm.pulled ?? firstId];
      const upright = pbox ? (pbox[3] - pbox[1]) / Math.max(1, pbox[2] - pbox[0]) : 0;
      // 스치는 시점에서는 가까운 칸의 프록시가 먼 권의 화면 사각형을 덮을 수
      // 있다 — 계약은 "책 자리를 누르면 어떤 권이 당겨지고 UI 가 그 권을
      // 말한다"이고, 카프카(정면성이 좋은 입구 칸)에서만 id 일치를 요구한다.
      const sheetOf = await page.locator('[data-testid="work-world"]').first().getAttribute("data-work").catch(() => null);
      check("책 자리를 누르면 권이 당겨지고 시트가 그 권이다",
        pm.pulled !== null && sheetOf === pm.pulled,
        `${pm.pulled} @ (${Math.round(cx)},${Math.round(cy)})`);
      if (a.id === "franz-kafka")
        check("입구 칸에서는 누른 권이 당겨진다", pm.pulled === firstId, `${pm.pulled}/${firstId}`);
      check("당겨진 권은 표지를 통로로 돌린다", pm.pulledCoverToWalkway === true);
      check("당겨진 권이 서 있다 (투영 세로/가로 > 1)", upright > 1, `${upright.toFixed(2)}`);
      const kindOk = await page.evaluate(() => {
        const mmx = window.__universe.metrics();
        return { coverDressed: mmx.cities.coverDressed };
      });
      // 실물 표지가 있는 권을 당겼으면 실물이 나온다 — 없는 권은 민장정 그대로
      const coverIds = new Set(Object.keys((await page.evaluate(() => fetch("art/manifest.json").then((r) => r.json()))).covers ?? {}));
      if (coverIds.has(pm.pulled ?? firstId))
        check("당김의 보상 — 실물 표지가 관측자를 향해 선다", kindOk.coverDressed >= 1, `dressed ${kindOk.coverDressed}`);
      else
        check("표지 없는 권은 민장정 그대로 나온다 (지어내지 않는다)", kindOk.coverDressed === 0, `dressed ${kindOk.coverDressed}`);
      // 닫기 — 실제로 당겨진 권의 목록 버튼 토글
      const wKo = dataWorks.find((w) => w.id === (pm.pulled ?? firstId))?.titleKo ?? "";
      await page.locator(".u-works button", { hasText: wKo }).first().click();
      await page.waitForTimeout(700);
      await page.evaluate(() => window.__universe.settle());
      const cm = await metrics();
      check("닫으면 책이 칸으로 돌아간다 (전부 책등 복원)",
        cm.pulled === null && cm.restingSpineToEntrance === cm.resting && cm.resting === a.works,
        `정렬 ${cm.restingSpineToEntrance}/${cm.resting} · ${JSON.stringify(cm.restingDots)}`);
    } else {
      check("입문 1권의 화면 사각형이 있다", false, "boxes 비어 있음");
    }

    // ——— 착륙 실: 앵커가 있는 이웃을 지목하면 실이 그 책·그 해에 닿는다 ———
    {
      // 앵커가 **이 회랑에 선 책**을 가리킬 때만 실이 책에 닿는다. 상대편의
      // 책을 가리키는 앵커(예: 카프카–카뮈의 『시지프 신화』)는 이 회랑에
      // 그 책이 없으므로 실이 입구 명판으로 간다 — 그것도 공표된 동작이다.
      const ownWorkIds = new Set(dataWorks.filter((w) => w.authorId === a.id).map((w) => w.id));
      const anchored = dataRelations
        .filter((r) => (r.sourceId === a.id || r.targetId === a.id))
        .map((r) => ({ r, otherId: r.sourceId === a.id ? r.targetId : r.sourceId, workId: (r.anchors ?? []).map((an) => an.workId).find((id) => id && ownWorkIds.has(id)) }))
        .filter((c) => c.workId !== undefined);
      let hit = null;
      for (const cand of anchored) {
        const q = await page.evaluate((id) => window.__universe.project(id), cand.otherId);
        if (q && q[0] > 270 && q[0] < 1500 && q[1] > 60 && q[1] < 620) { hit = { ...cand, q }; break; }
      }
      // 측정 가능성은 **보고하되 게이트로 삼지 않는다.** 후보가 0건인 것은
      // 편집의 공백이고(타고르의 앵커는 전부 상대편 책을 가리킨다), 후보가
      // 있어도 별이 화면 밖인 것은 카메라의 사정이다 — 둘 다 코드 결함이
      // 아니다. 대신 **한 판에서 적어도 한 번은 실제로 측정됐는지**를 루프
      // 뒤에서 단언한다. 그래야 "아무 데서도 재지 않았는데 초록"이 불가능하다.
      console.log(`  · 실-책 후보 ${anchored.length}건 · 화면 안 ${hit ? hit.r.id : "없음"}`);
      if (hit) {
        threadBookMeasured++;
        await page.mouse.move(hit.q[0], hit.q[1]);
        await page.waitForTimeout(250);
        await page.evaluate(() => window.__universe.settle());
        const tm = await metrics();
        const bx = tm.cities.boxes[hit.workId];
        // **픽셀 허용치로 재지 않는다.** 실은 책의 머리(책 높이 위쪽)에 닿게
        // 설계돼 있고, 책의 화면 상자는 카메라 거리에 따라 수십 배로 변한다 —
        // 가까운 책은 383px 높이로 서므로 '머리에서 상자 중심까지'만 223px 다.
        // 실측(2026-08-27): 같은 기제가 멀리 선 책 셋에서는 50·54·92px 였고,
        // 회랑이 62칸에서 88칸으로 길어지자 가까운 한 권만 문턱을 넘었다.
        // 고정 허용치가 기제 대신 일하고 있었던 것이다. 기제로 다시 쓴다 —
        // **그 책의 기둥 안, 발보다 위.**
        const w = bx ? bx[2] - bx[0] : 0;
        const h = bx ? bx[3] - bx[1] : 0;
        const onBook = Boolean(
          tm.threadEnd && bx &&
          tm.threadEnd[0] > bx[0] - w * 0.5 && tm.threadEnd[0] < bx[2] + w * 0.5 &&
          tm.threadEnd[1] > bx[1] - h && tm.threadEnd[1] < bx[3]
        );
        check("지목한 실이 요약이 지목한 책의 머리에 닿는다", tm.ego === 1 && onBook,
          `${hit.workId} · 실 ${tm.threadEnd && tm.threadEnd.map(Math.round)} · 책 ${bx && bx.map(Math.round)}`);
        await page.mouse.move(5, 500);
        await page.waitForTimeout(150);
      }
    }
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
    // 표면에 붙은 자산만: 육필 지각 + 서명·낙관 + 초판 표지 N — 기록 사진은
    // 궤도 카드의 자산이라 이 원장에 없다. `>= 3` 은 짧거나 틀린 원장을 못 잡았다.
    check("근거 행이 표면의 실물 자산 수와 정확히 맞는다", rows === a.covers + 2,
      `${rows}/${a.covers + 2}행`);
    const roles = await prov.locator("li strong").allTextContents();
    check("표면 원장에 표면에 없는 자산(기록 사진)이 없다", !roles.some((r) => r.includes("기록 사진")),
      roles.join(" · "));
    const metas = await prov.locator(".u-prov__meta").allTextContents();
    check("모든 행이 소장처와 라이선스를 싣는다", metas.length === rows && metas.every((t) => t.length > 12),
      (metas[0] ?? "").slice(0, 42));
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

  // 10. 복귀: 하늘로 돌아가면 **출발 구도**로 돌아온다 — 원경 거리만으로는
  // 부족하다. 착륙 접근각이 남은 채 돌아오면 4/4 가 출발 별을 잃었다(합성 파일럿).
  await page.locator('[data-testid="to-sky"]').click();
  await settle(1600);
  m = await metrics();
  // 자유 비행이 들어온 뒤로 `dist`(주시점까지)는 시선 앞 피벗의 상수다 —
  // 돌아온 **고도**는 원점으로부터의 거리로 잰다.
  check("하늘로 복귀", m.stage === "sky" && Math.abs(m.camR - 2191) < 120,
    `stage=${m.stage} camR=${m.camR}`);
  check("복귀하면 다시 자유 비행이다 (피벗이 시선 앞에 선다)", m.pivot === 150, `pivot=${m.pivot}`);
  const camDrift = Math.hypot(m.cam[0] - cam0[0], m.cam[1] - cam0[1], m.cam[2] - cam0[2]);
  check("복귀는 출발 구도다 (카메라 위치 일치)", camDrift < 40, `이동 ${Math.round(camDrift)}`);
  const labels1 = new Set(await labelIds());
  const inter = [...labels0].filter((x) => labels1.has(x)).length;
  const jacc = inter / Math.max(1, new Set([...labels0, ...labels1]).size);
  check("복귀 후 보이는 이름이 출발 때와 같다", jacc >= 0.8, `자카드 ${jacc.toFixed(2)}`);
  check("복귀 뒤 포커스가 검색으로 돌아온다",
    await page.evaluate(() => document.activeElement?.matches?.(".u-search input") === true));
}

// ——— 개인 성좌: 가장 중요한 발견이라던 것에 증거 경로가 하나도 없었다 ———
// (모의 심사 지적) 유닛 테스트는 순수 함수만, 프레임은 localStorage 주입만 검사했다.
// 여기서는 **독자가 실제로 만들 수 있는 경로**로 건다: 표시 → 저장 → 갈래 → 공유.
{
  console.log("\n개인 성좌");
  await page.goto(url(`?lens=movement&a=franz-kafka`), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle();
  await page.evaluate(() => {
    window.__copied = null;
    navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); };
  });
  const readBtn = page.locator('.u-card__acts button').filter({ hasText: "읽음" }).first();
  await readBtn.click();
  await page.waitForTimeout(300);
  check("읽음 표시가 켜진다", ((await readBtn.textContent()) ?? "").includes("✓"));
  const stored = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem("lp.universe.personal.v1") ?? "null"); } catch { return null; }
  });
  check("읽음이 이 브라우저에 저장된다 (계정 없이)", typeof stored?.read?.["franz-kafka"] === "number");
  const tracks = await page.evaluate(() =>
    [...document.querySelectorAll('[data-testid="tracks"] .u-track')].map((t) => ({
      name: t.querySelector(".u-track__name")?.textContent ?? "",
      items: [...t.querySelectorAll(".u-recs li")].map((li) => ({
        who: li.querySelector("button")?.textContent?.trim() ?? "",
        why: li.querySelector("em")?.textContent?.trim() ?? ""
      }))
    }))
  );
  check("다음 독서 갈래가 나타난다", tracks.length >= 2, `${tracks.length}갈래`);
  check("모든 추천이 근거 문장을 갖는다 (DOM 에서)",
    tracks.every((t) => t.items.length > 0 && t.items.every((i) => i.why.length > 3)));
  const sets = tracks.map((t) => t.items.map((i) => i.who).join("|"));
  check("갈래가 같은 세 이름을 반복하지 않는다", new Set(sets).size === sets.length, sets.join(" / "));
  await page.locator(".u-mine .u-btn--ghost").filter({ hasText: "성좌 링크 복사" }).click();
  await page.waitForTimeout(200);
  const shareUrl = await page.evaluate(() => window.__copied);
  check("공유 링크가 만들어진다", typeof shareUrl === "string" && shareUrl.includes("?sky="));
  if (typeof shareUrl === "string") {
    const ctx2 = await browser.newContext({ viewport: { width: 1600, height: 900 }, locale: "ko-KR" });
    const p2 = await ctx2.newPage();
    await p2.goto(shareUrl, { waitUntil: "load" });
    await p2.waitForFunction(() => window.__universe !== undefined);
    await p2.waitForTimeout(1200);
    check("공유 성좌는 읽기 전용으로 열린다", (await p2.locator(".u-mine__shared").count()) === 1);
    check("공유 성좌는 받는 쪽 브라우저에 저장되지 않는다",
      (await p2.evaluate(() => localStorage.getItem("lp.universe.personal.v1"))) === null);
    const mineTxt = (await p2.locator(".u-mine > p").first().textContent()) ?? "";
    check("공유된 읽음 수가 보인다", /읽음\s*1/.test(mineTxt), mineTxt.trim().slice(0, 30));
    await ctx2.close();
  }
  // 조작된 공유 링크: 모르는 ID 는 세지 않는다 (시스템 경계)
  const junk = Buffer.from("r=nobody-1,nobody-2,franz-kafka&w=", "utf8").toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  await page.goto(url(`?sky=${junk}`), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await page.waitForTimeout(800);
  const junkTxt = (await page.locator(".u-mine > p").first().textContent()) ?? "";
  check("조작된 공유 링크의 모르는 ID 는 세지 않는다", /읽음\s*1\b/.test(junkTxt), junkTxt.trim().slice(0, 30));
  // 모르는 층 이름은 무시된다 — 빈 #root 로 죽지 않는다
  await page.goto(url(`?lens=bogus&a=franz-kafka`), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined, undefined, { timeout: 8000 }).catch(() => null);
  check("모르는 ?lens= 값에도 앱이 뜬다", (await page.locator(".u-top h1").count()) === 1);
  // 정리 — 다음 실행과 프레임 캡처가 깨끗한 성좌에서 시작하도록
  await page.evaluate(() => localStorage.removeItem("lp.universe.personal.v1"));
}

// ---------------------------------------------------------------------------
// 이륙 (R12-c): 회랑에서 이름 뜬 별을 누르면 하늘 단계 없이 그 별로 날아오른다
// ---------------------------------------------------------------------------
{
  console.log(`\nliftoff`);
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(2600);
  await settle(1200);
  const neigh = ["jorge-luis-borges", "gabriel-garcia-marquez", "albert-camus", "wg-sebald", "milan-kundera"];
  let hit = null;
  for (const id of neigh) {
    const q = await page.evaluate((x) => window.__universe.project(x), id);
    if (q && q[0] > 270 && q[0] < 1500 && q[1] > 60 && q[1] < 620) { hit = { id, q }; break; }
  }
  check("이륙 대상 별이 회랑 하늘 안에 있다", Boolean(hit), hit ? hit.id : "없음");
  if (hit) {
    await page.mouse.click(hit.q[0], hit.q[1]);
    await settle(1800);
    const lm = await metrics();
    const u = new URL(page.url());
    check("별을 누르면 그 자리에서 날아오른다 — 하늘 단계 없이 다음 궤도로",
      lm.stage === "approach" && u.searchParams.get("a") === hit.id && !u.searchParams.get("land"),
      `stage=${lm.stage} a=${u.searchParams.get("a")}`);
    check("이륙이 끝나면 회랑이 걷힌다", lm.bays === 0 && lm.foldK === 0, `bays=${lm.bays} fold=${lm.foldK}`);
  }
}


check("실-책 계약이 이 판에서 최소 한 번 실제로 측정됐다", threadBookMeasured > 0,
  `${threadBookMeasured}개 회랑에서 측정`);

console.log(`\nconsole errors: ${consoleErrors.length}`);
if (consoleErrors.length) console.log(consoleErrors.slice(0, 4).join("\n"));
console.log(`\n${passed} passed · ${failed} failed`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);

