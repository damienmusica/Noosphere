#!/usr/bin/env node
// R12-d — 손안의 성계. 같은 여정이 **전화기 화면에서도** 성립하는지 잰다.
//
// 넓은 화면의 계약(verify-journey.mjs)은 구조가 옳은지를 증명한다. 이 파일은
// 그 구조가 390pt 폭에서 **닿고 보이는지**를 증명한다. 실측이 없던 동안
// 무슨 일이 있었는지가 이 파일의 존재 이유다: 크롬이 화면의 60%를 덮었고,
// 별 하나가 레일 버튼 밑에 깔려 탭이 닿지 않았으며, 데스크톱 폭으로 고정된
// 안전 띠(좌 250 + 우 392 > 화면 390)가 이름표를 99개 중 1개만 남기고
// 지웠고, 회랑은 프레임 밖으로 밀려나 "단계=표면"이 초록인 채 화면은 빈
// 지면이었다. 상태 단언은 그 전부를 통과했다 — 그래서 여기서는 화면 좌표와
// **픽셀**로 잰다.
//
//   node art-r11/verify-mobile.mjs [--dist dist]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";
import { serveDist } from "../qa/lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};
const distDir = path.resolve(ROOT, opt("dist", "dist"));

const server = await serveDist(distDir);
const browser = await chromium.launch({ headless: false });
// deviceScaleFactor 1 — 스크린샷 픽셀과 CSS 좌표를 같은 자로 재기 위해서다
const ctx = await browser.newContext({
  ...devices["iPhone 13"],
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
const settle = async (ms = 1400) => {
  await page.waitForTimeout(ms);
  await page.evaluate(() => window.__universe.settle());
  await page.waitForTimeout(200);
};
const metrics = () => page.evaluate(() => window.__universe.metrics());

/** 보이는 크롬 조각들의 화면 사각형 */
const chromeRects = () =>
  page.evaluate(() => {
    const sel = ".u-top, .u-rail, .u-time, .u-card, .u-why, .u-grip, .u-scrim, .u-search__hits";
    const out = [];
    for (const el of document.querySelectorAll(sel)) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.02) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      out.push({ cls: el.className.toString().split(" ")[0], x: r.x, y: r.y, w: r.width, h: r.height });
    }
    return { vw: innerWidth, vh: innerHeight, rects: out };
  });

/** 크롬이 덮은 화면 비율 — 사각형 합집합을 8px 격자로 적분한다 */
function coverFraction({ vw, vh, rects }) {
  const S = 8;
  let covered = 0;
  let total = 0;
  for (let y = 0; y < vh; y += S) {
    for (let x = 0; x < vw; x += S) {
      total++;
      if (rects.some((r) => x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h)) covered++;
    }
  }
  return covered / total;
}

/**
 * 픽셀 증명. 스크린샷을 브라우저 안 2D 캔버스에 되그려 밝기를 센다 —
 * "상태가 표면이다"와 "화면에 서가가 있다"는 다른 주장이고, 한 릴리스
 * 내내 전자만 초록이었던 전례가 있다(렌즈가 엉뚱한 나라에 렌더).
 */
async function litFraction(clip) {
  const png = await page.screenshot({ clip });
  const b64 = png.toString("base64");
  return page.evaluate(
    ([data, w, h]) =>
      new Promise((res) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          const g = c.getContext("2d");
          g.drawImage(img, 0, 0);
          const px = g.getImageData(0, 0, w, h).data;
          let lit = 0;
          let warm = 0;
          let solidRows = 0;
          const n = w * h;
          for (let y = 0; y < h; y++) {
            let rowLit = 0;
            for (let x = 0; x < w; x++) {
              const i = (y * w + x) * 4;
              const r = px[i];
              const gg = px[i + 1];
              const bb = px[i + 2];
              const lum = 0.299 * r + 0.587 * gg + 0.114 * bb;
              if (lum > 34) {
                lit++;
                if (r > bb + 12) warm++;
              }
              // 면을 세는 문턱은 따로 둔다. 서가의 나뭇결은 어둡고(밝기 중앙값
              // 33) 하늘의 바탕은 13 이다 — 20 이 그 사이를 가른다.
              if (lum > 20) rowLit++;
            }
            // 서가는 **면**이고 별은 점이다. 한 줄의 절반 이상이 밝다는 것은
            // 그 줄에 면이 지나간다는 뜻이다 — 밝은 픽셀 총량만 세면 반짝이는
            // 하늘과 구별되지 않는다(실측: 빈 하늘 띠도 9.6% 가 밝았다).
            if (rowLit > w * 0.5) solidRows++;
          }
          res({ lit: lit / n, warm: warm / n, solidRows: solidRows / h });
        };
        img.src = "data:image/png;base64," + data;
      }),
    [b64, Math.round(clip.width), Math.round(clip.height)]
  );
}

/** 이름표 상자와 크롬 사각형이 실제로 겹치는가 — 앵커 점이 아니라 상자로 */
const labelsBittenByChrome = () =>
  page.evaluate(() => {
    const chrome = [];
    const sel = ".u-top, .u-time, .u-card, .u-grip, .u-lenses, .u-mine, .u-why, .u-search__hits";
    for (const el of document.querySelectorAll(sel)) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.05) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      chrome.push({ t: el.className.toString().split(" ")[0], x: r.left, y: r.top, w: r.width, h: r.height });
    }
    const bitten = [];
    for (const el of document.querySelectorAll(".globe-label")) {
      if (el.style.display === "none") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1) continue;
      for (const c of chrome) {
        const ox = Math.min(r.right, c.x + c.w) - Math.max(r.left, c.x);
        const oy = Math.min(r.bottom, c.y + c.h) - Math.max(r.top, c.y);
        if (ox > 1 && oy > 1) {
          bitten.push({ t: (el.textContent ?? "").trim().slice(0, 14), by: c.t, ox: Math.round(ox), oy: Math.round(oy) });
          break;
        }
      }
    }
    return { chrome: chrome.length, labels: document.querySelectorAll(".globe-label").length, bitten };
  });

console.log("\n하늘 — 좁은 화면의 첫 화면");
await page.goto(`${server.origin}/universe.html?lens=movement`, { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle();

const vp = page.viewportSize();
check("전화기 폭에서 좁은 배치가 켜진다",
  await page.evaluate(() => document.querySelector(".universe").classList.contains("is-narrow")),
  `${vp.width}×${vp.height}`);

const c0 = await chromeRects();
const cover0 = coverFraction(c0);
check("크롬은 하늘의 가장자리만 쓴다 (덮은 비율 ≤ 22%)", cover0 <= 0.22, `${(cover0 * 100).toFixed(1)}%`);
check("가운데 띠에는 크롬이 없다",
  !c0.rects.some((r) => r.y < c0.vh * 0.72 && r.y + r.h > c0.vh * 0.16),
  c0.rects.map((r) => `${r.cls}(${Math.round(r.y)}~${Math.round(r.y + r.h)})`).join(" "));

const labelBox = () =>
  page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll(".globe-label")) {
      if (el.style.display === "none") continue;
      const r = el.getBoundingClientRect();
      out.push({ t: el.textContent, x: r.x, right: r.right, y: r.y, bottom: r.bottom });
    }
    return { vw: innerWidth, vh: innerHeight, items: out };
  });
const lb0 = await labelBox();
// 이름표가 **몇 개나 남았는가**. 데스크톱 폭으로 고정된 안전 띠(좌 250 + 우
// 392)가 화면(390)보다 넓었을 때 99개 중 1개만 남았다 — 넘침 검사만으로는
// 그 상태가 통과한다(남은 하나는 넘치지 않는다).
check("하늘에 이름표가 여럿 선다 — 띠가 화면을 삼키지 않는다", lb0.items.length >= 5,
  `${lb0.items.length}개`);
const spill = lb0.items.filter((i) => i.x < -1 || i.right > lb0.vw + 1);
check("이름표가 화면 밖으로 흘러넘치지 않는다", spill.length === 0,
  `${lb0.items.length}개 중 ${spill.length}개 넘침${spill.length ? " — " + spill.map((s) => s.t).join(", ") : ""}`);

const bit0 = await labelsBittenByChrome();
check("이름표가 크롬에 물리지 않는다 (상자로 잰다)", bit0.bitten.length === 0,
  `크롬 ${bit0.chrome}판 · 물린 ${bit0.bitten.length}개${bit0.bitten.length ? " — " + bit0.bitten.map((b) => `${b.t}/${b.by}`).join(", ") : ""}`);

const tapSizes = () =>
  page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("button, [role=button]")) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      out.push({ t: (el.textContent ?? "").trim().slice(0, 14), h: Math.round(r.height), w: Math.round(r.width), lens: el.classList.contains("u-lens") || el.closest(".u-lens-groups") !== null });
    }
    return out;
  });
const t0 = await tapSizes();
const small = t0.filter((b) => b.h < 40);
check("손끝에 닿는 크기다 (조작 요소 높이 ≥ 40)", small.length === 0,
  `${t0.length}개 중 ${small.length}개 미달${small.length ? " — " + small.map((s) => `${s.t}:${s.h}`).join(" ") : ""}`);

// 별을 손끝으로 — 레일이 하늘을 덮던 자리의 정확한 재발 방지 계약
// 대조군: 같은 띠를 **하늘에서** 먼저 잰다. 회랑의 밝기가 빈 하늘과
// 구별되지 않으면 그 픽셀 계약은 아무것도 말하지 않는다.
const skyBand = { x: 0, y: 60, width: vp.width, height: Math.round(vp.height * 0.44) };
const skyLit = await litFraction(skyBand);
console.log(`  · 대조군(빈 하늘 띠) 밝은 ${(skyLit.lit * 100).toFixed(1)}% · 따뜻한 ${(skyLit.warm * 100).toFixed(1)}% · 면이 지나간 줄 ${(skyLit.solidRows * 100).toFixed(1)}%`);

const kafkaAt = await page.evaluate(() => window.__universe.project("franz-kafka"));
check("카프카의 별이 화면 안에 있다", Boolean(kafkaAt), kafkaAt ? kafkaAt.map(Math.round).join(",") : "화면 밖");
const overStar = await page.evaluate(
  ([x, y]) => {
    const el = document.elementFromPoint(x, y);
    return el ? `${el.tagName.toLowerCase()}.${el.className.toString().split(" ")[0]}` : "none";
  },
  kafkaAt
);
check("별 위에 크롬이 없다 — 손끝이 하늘에 닿는다", overStar.startsWith("canvas"), overStar);
await page.touchscreen.tap(kafkaAt[0], kafkaAt[1]);
await settle();
check("하늘에서는 한 번의 탭이 궤도 카드를 연다 (되돌리기 쉬운 행동)",
  (await page.locator(".u-card").count()) === 1);

console.log("\n시트 — 카드는 아래에서 올라온다");
const sheetGeom = () =>
  page.evaluate(() => {
    const card = document.querySelector(".u-card");
    const grip = document.querySelector(".u-grip");
    const r = card?.getBoundingClientRect();
    const g = grip?.getBoundingClientRect();
    return {
      vh: innerHeight,
      card: r ? { top: r.top, h: r.height } : null,
      grip: g ? { top: g.top, h: g.height } : null,
      mode: document.querySelector(".universe").dataset.sheet ?? null
    };
  });
const s0 = await sheetGeom();
check("쉬는 시트는 하늘을 절반 넘게 남긴다", s0.card && s0.card.top >= s0.vh * 0.45,
  `top=${Math.round(s0.card?.top ?? -1)} / ${s0.vh} · ${s0.mode}`);
check("시트의 어깨(손잡이)가 그 위에 선다", Boolean(s0.grip) && s0.grip.top < s0.card.top,
  s0.grip ? `grip ${Math.round(s0.grip.top)} < card ${Math.round(s0.card.top)}` : "손잡이 없음");
check("서랍과 시트는 동시에 열리지 않는다",
  await page.evaluate(() => !document.querySelector(".universe").dataset.drawer));

await page.locator('[data-testid="sheet-grip"]').tap();
await page.waitForTimeout(300);
const s1 = await sheetGeom();
check("펼치면 시트가 커진다", s1.card.h > s0.card.h + 40, `${Math.round(s0.card.h)} → ${Math.round(s1.card.h)}`);
check("펼친 시트도 손잡이를 화면에 남긴다", s1.grip.top >= 0, `grip ${Math.round(s1.grip.top)}`);
await page.locator('[data-testid="sheet-grip"]').tap();
await page.waitForTimeout(300);
const s2 = await sheetGeom();
check("접으면 쉬는 높이로 돌아온다", Math.abs(s2.card.h - s0.card.h) < 12,
  `${Math.round(s2.card.h)} vs ${Math.round(s0.card.h)}`);

const landBox = await page.locator('[data-testid="land"]').boundingBox();
check("착륙 문이 시트 안에서 손끝에 닿는다",
  Boolean(landBox) && landBox.height >= 40 && landBox.y + landBox.height <= vp.height,
  landBox ? `${Math.round(landBox.width)}×${Math.round(landBox.height)} @${Math.round(landBox.y)}` : "없음");

console.log("\n지목 — 손끝에는 얹는 동작이 없다 (궤도까지, CPO 룰링 2026-08-24)");
// 카드의 관계 행: 첫 탭은 지목, 두 번째 탭이 이동
const relRow = page.locator('[data-testid="orbit-relations"] li button').first();
await relRow.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
const scrolled = await page.evaluate(() => document.querySelector(".u-card").scrollTop);
check("관계 행까지 시트를 스크롤했다 (다음 계약의 전제)", scrolled > 100, `scrollTop ${Math.round(scrolled)}`);
const who = () => page.evaluate(() => document.querySelector(".u-card")?.dataset.author ?? null);
const before = await who();
await relRow.tap();
await page.waitForTimeout(500);
await page.evaluate(() => window.__universe.settle());
const am1 = await metrics();
check("카드 관계 행의 첫 탭은 지목이다 — 옮겨 가지 않는다",
  (await who()) === before && am1.ego === 1 && (await page.locator('[data-testid="why"]').count()) === 1,
  `작가 ${await who()} · 실 ${am1.ego}`);
await relRow.tap();
await page.waitForTimeout(700);
await page.evaluate(() => window.__universe.settle());
const after = await who();
check("같은 행을 다시 누르면 그 별로 옮겨 간다", after !== null && after !== before, `${before} → ${after}`);
const arrived = await page.evaluate(() => {
  const card = document.querySelector(".u-card");
  const head = card?.querySelector("h2");
  const land = card?.querySelector('[data-testid="land"], .u-card__acts');
  const cr = card?.getBoundingClientRect();
  const hr = head?.getBoundingClientRect();
  const lr = land?.getBoundingClientRect();
  return {
    scrollTop: card?.scrollTop ?? -1,
    headVisible: Boolean(hr && cr && hr.top >= cr.top - 1 && hr.bottom <= cr.bottom + 1),
    actsVisible: Boolean(lr && cr && lr.top >= cr.top - 1 && lr.top <= cr.bottom)
  };
});
check("도착한 카드는 맨 위에서 시작한다 — 이름과 문이 접힘선 위에 있다",
  arrived.scrollTop === 0 && arrived.headVisible && arrived.actsVisible,
  `scrollTop ${arrived.scrollTop} · 이름 ${arrived.headVisible} · 행동 ${arrived.actsVisible}`);

// 하늘의 이웃 별: 착륙하지 않은 궤도에서도 첫 탭은 지목이다
await page.evaluate(() => window.__universe.focus("franz-kafka"));
await settle(900);
const neighbour = await page.evaluate(() => {
  const ids = [...document.querySelectorAll('.globe-label[data-ground="sky"]')]
    .filter((el) => el.style.display !== "none" && el.classList.contains("is-neighbor"))
    .map((el) => el.dataset.labelId);
  for (const id of ids) {
    const p = window.__universe.project(id);
    if (p && p[0] > 30 && p[0] < innerWidth - 30 && p[1] > 90 && p[1] < innerHeight * 0.5) return { id, p };
  }
  return null;
});
if (neighbour) {
  await page.touchscreen.tap(neighbour.p[0], neighbour.p[1]);
  await page.waitForTimeout(450);
  await page.evaluate(() => window.__universe.settle());
  const om1 = await metrics();
  check("궤도에서도 이웃 별의 첫 탭은 지목이다",
    (await who()) === "franz-kafka" && om1.ego === 1,
    `작가 ${await who()} · 실 ${om1.ego} (${neighbour.id})`);
  await page.touchscreen.tap(neighbour.p[0], neighbour.p[1]);
  await settle(900);
  check("같은 별을 다시 누르면 그 궤도로 옮겨 간다", (await who()) === neighbour.id, `${await who()}`);
} else {
  check("이웃 별이 화면 안에 없다 — 궤도 지목 계약 미측정", false, "관측 불가");
}

console.log("\n서랍 — 관측층은 접혀 있다가 열린다");
await page.locator('[data-testid="to-sky"]').tap();
await page.waitForFunction(() => window.__universe.metrics().stage === "sky", null, { timeout: 8000 });
await settle(600);
check("하늘로 돌아오면 시트가 걷힌다", (await page.locator(".u-card").count()) === 0);
const railBefore = await page.evaluate(() => {
  const r = document.querySelector(".u-rail").getBoundingClientRect();
  return { top: r.top, visible: getComputedStyle(document.querySelector(".u-rail")).visibility };
});
check("서랍은 평소 하늘을 덮지 않는다", railBefore.visible === "hidden", railBefore.visible);
// 상단 줄은 흔들리지 않는다 — 흔들리는 줄에서는 탭이 옆 버튼을 맞힌다
const keyX = async () => (await page.locator(".u-drawer-key").boundingBox()).x;
// 기준선은 **초점이 없는 상태**에서 잰다. 카드를 닫으면 앱이 초점을 검색창에
// 돌려놓기 때문에, 그대로 재면 이미 늘어난 상태끼리 비교하게 된다(실측: 변이
// 스윕에서 이 계약이 생존했다 — 317 → 317).
await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined));
await page.waitForTimeout(200);
const kx0 = await keyX();
await page.locator(".u-search input").focus();
await page.waitForTimeout(250);
check("검색창에 초점이 실제로 들어갔다 (아래 계약의 전제)",
  await page.evaluate(() => document.activeElement?.tagName === "INPUT"));
const kx1 = await keyX();
await page.evaluate(() => document.activeElement?.blur());
await page.touchscreen.tap(vp.width / 2, vp.height * 0.5);
await page.waitForTimeout(250);
check("검색에 손이 닿아도 상단 줄이 재배치되지 않는다", Math.abs(kx1 - kx0) < 2,
  `${Math.round(kx0)} → ${Math.round(kx1)}`);
await page.locator('[data-testid="to-sky"]').count().then(async (n) => {
  if (n) await page.locator('[data-testid="to-sky"]').tap();
});
await page.waitForTimeout(300);

await page.locator(".u-drawer-key").tap();
await page.waitForTimeout(400);
check("손잡이를 누르면 관측층이 열린다",
  await page.evaluate(() => getComputedStyle(document.querySelector(".u-rail")).visibility === "visible"));
check("서랍이 열려 있어도 손잡이는 살아 있다 (가림막에 먹히지 않는다)",
  await page.evaluate(() => {
    const b = document.querySelector(".u-drawer-key").getBoundingClientRect();
    const el = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
    return el?.classList.contains("u-drawer-key") ?? false;
  }));
const lensBtn = page.locator(".u-lens").nth(1);
const lensBox = await lensBtn.boundingBox();
check("관측층 항목이 손끝 크기다", Boolean(lensBox) && lensBox.height >= 44,
  lensBox ? `${Math.round(lensBox.height)}px` : "없음");
await lensBtn.tap();
await page.waitForTimeout(450);
check("층을 고르면 서랍이 물러난다 — 하늘이 바뀌는 것을 봐야 한다",
  await page.evaluate(() => !document.querySelector(".universe").dataset.drawer));

// 범례 행 — 손끝에는 얹는 동작이 없으므로 누름이 유일한 지목 수단이다
await page.locator(".u-drawer-key").tap();
await page.waitForTimeout(400);
const legend = page.locator(".u-lens-groups button").first();
if (await legend.count()) {
  await legend.tap();
  await page.waitForTimeout(450);
  await page.evaluate(() => window.__universe.settle());
  const pinned = await page.evaluate(() => {
    const b = document.querySelector(".u-lens-groups button");
    return {
      pressed: b?.getAttribute("aria-pressed") === "true",
      on: b?.classList.contains("is-on") ?? false,
      drawer: document.querySelector(".universe").dataset.drawer ?? null,
      listed: document.querySelectorAll(".globe-label.is-listed").length
    };
  });
  check("범례 한 항목을 한 번 탭하면 눌린 채로 남는다",
    pinned.pressed && pinned.on, `pressed ${pinned.pressed} · is-on ${pinned.on}`);
  check("범례를 고르면 서랍이 물러나고 하늘에 그 그룹이 남는다",
    pinned.drawer === null && pinned.listed > 0, `서랍 ${pinned.drawer} · 지목된 이름 ${pinned.listed}`);
  await page.locator(".u-drawer-key").tap();
  await page.waitForTimeout(350);
  await legend.tap();
  await page.waitForTimeout(400);
  const off = await page.evaluate(() => document.querySelector(".u-lens-groups button")?.getAttribute("aria-pressed"));
  check("같은 항목을 다시 누르면 풀린다", off === "false", `${off}`);
} else {
  check("범례 행이 없다 — 핀 계약 미측정", false, "관측 불가");
}

// 뷰포트가 바뀌면 띠도 따라온다 — 주소창 접힘은 일상 동작이다
await page.evaluate(() => window.__universe.focus("franz-kafka"));
await settle(900);
// 띠는 **직접** 읽는다. 라벨이 우연히 그 자리에 없으면 부수 효과로는
// 아무것도 증명되지 않는다(스윕 실측: 리스너를 떼도 이 계약이 초록이었다).
const insetOf = async () => (await metrics()).insets;
const inset0 = await insetOf();
// 하네스의 실제 뷰포트에서 출발한다 — 기기 프로파일 높이를 상수로 적으면
// 줄이려던 것이 늘어난다(실측: 664 → 734 는 축소가 아니라 확대였다).
const hShrunk = vp.height - 140;
await page.setViewportSize({ width: vp.width, height: hShrunk });
await page.waitForTimeout(450);
await page.evaluate(() => window.__universe.settle());
const inset1 = await insetOf();
const bitShort = await labelsBittenByChrome();
check(`주소창이 접히면(${vp.height}→${hShrunk}) 띠가 따라 줄어든다`,
  inset1[3] < inset0[3] - 40, `아래 띠 ${inset0[3]} → ${inset1[3]}`);
check("그때 이름표가 시트에 물리지 않는다", bitShort.bitten.length === 0,
  `물린 ${bitShort.bitten.length}개${bitShort.bitten.length ? " — " + bitShort.bitten.map((b) => `${b.t}/${b.by}`).join(", ") : ""}`);
await page.setViewportSize({ width: vp.width, height: vp.height });
await page.waitForTimeout(450);
await page.evaluate(() => window.__universe.settle());
const inset2 = await insetOf();
const bitBack = await labelsBittenByChrome();
check(`돌아오면 띠도 돌아온다 (${hShrunk}→${vp.height})`, Math.abs(inset2[3] - inset0[3]) <= 2,
  `아래 띠 ${inset1[3]} → ${inset2[3]} (기준 ${inset0[3]})`);
check("크롬 사각형도 함께 다시 잰다", (await metrics()).chromeRects >= 2 && bitBack.bitten.length === 0,
  `사각형 ${(await metrics()).chromeRects}개 · 물린 ${bitBack.bitten.length}개 — ${JSON.stringify(bitBack.bitten)}`);
await page.evaluate(() => window.__universe.focus(null));
await settle(900);

console.log("\n회랑 — 세로 프레임의 서가");
await page.evaluate(() => window.__universe.focus("franz-kafka"));
await settle(900);
await page.locator('[data-testid="land"]').tap();
await settle(6500);
await settle(1200);
const m = await metrics();
check("착륙해 회랑이 섰다", m.stage === "surface" && m.foldK > 0.99 && m.bays > 0,
  `stage=${m.stage} fold=${m.foldK} bays=${m.bays}`);
// 실측 기준선: 세로 4칸 / 넓은 화면 23칸 (2026-08-24). 세로 프레임은
// 서가에 바싹 붙어 서므로 띠를 가로지르는 칸이 적고 대신 크게 보인다.
check("회랑이 세로 프레임 **안에** 있다 — 칸이 보이는 띠를 가로지른다",
  m.baysInFrame >= 3, `${m.baysInFrame}/${m.bays}칸`);

const g = await sheetGeom();
const band = { x: 0, y: 60, width: vp.width, height: Math.max(40, (g.grip?.top ?? vp.height) - 62) };
const lit = await litFraction(band);
// 실측 기준선(2026-08-24): 회랑 밝은 22.9% · 따뜻한 22.7% / 빈 하늘 띠는
// 그 몇십 분의 일이다. 문턱은 실측의 절반 아래로 두되, **대조군의 배수**를
// 함께 건다 — 절대값만 걸면 밝은 하늘 한 장으로도 통과한다.
check("그 띠에 실제로 서가가 그려져 있다 (픽셀)",
  lit.warm >= 0.1 && lit.solidRows >= 0.25 && lit.solidRows >= skyLit.solidRows + 0.2,
  `따뜻한 ${(lit.warm * 100).toFixed(1)}% · 면이 지나간 줄 ${(lit.solidRows * 100).toFixed(1)}% (하늘 ${(skyLit.solidRows * 100).toFixed(1)}%) · 띠 ${Math.round(band.height)}px`);

const lb1 = await labelBox();
const workLabels = await page.evaluate(() =>
  [...document.querySelectorAll(".globe-label--work")]
    .filter((el) => el.style.display !== "none")
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { t: el.textContent, bottom: r.bottom, x: r.x, right: r.right };
    })
);
check("작품 이름표가 시트 뒤에 반쯤 걸리지 않는다",
  workLabels.every((w) => w.bottom <= (g.grip?.top ?? vp.height) + 1),
  `${workLabels.length}개 · 어깨 ${Math.round(g.grip?.top ?? -1)}`);
const spill1 = lb1.items.filter((i) => i.x < -1 || i.right > lb1.vw + 1);
check("회랑에서도 이름표가 화면 안에 있다", spill1.length === 0,
  `${lb1.items.length}개 중 ${spill1.length}개 넘침`);

console.log("\n이륙 — 손가락에는 호버가 없다");
const named = await page.evaluate(() =>
  [...document.querySelectorAll('.globe-label[data-ground="sky"]')]
    .filter((el) => el.style.display !== "none" && el.dataset.interactive === "1")
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { id: el.dataset.labelId, x: r.x + r.width / 2, y: r.y + r.height / 2 };
    })
);
check("회랑 하늘에 이름 뜬 별이 있다", named.length >= 1, `${named.length}개`);
if (named.length) {
  const star = named[0];
  await page.touchscreen.tap(star.x, star.y);
  await page.waitForTimeout(500);
  await page.evaluate(() => window.__universe.settle());
  const m1 = await metrics();
  const why1 = await page.locator('[data-testid="why"]').count();
  check("첫 탭은 지목이다 — 떠나지 않고 왜 이어져 있는지를 먼저 보여준다",
    m1.stage === "surface" && m1.ego === 1 && why1 === 1,
    `stage=${m1.stage} 실=${m1.ego} 왜=${why1}`);
  await page.touchscreen.tap(star.x, star.y);
  await settle(2200);
  const m2 = await metrics();
  check("같은 별을 다시 누르면 그 자리에서 날아오른다",
    m2.stage !== "surface" && m2.bays === 0, `stage=${m2.stage} bays=${m2.bays}`);
}

console.log("\n누운 화면 — 시트는 옆에서 온다");
{
  const land = await ctx.newPage();
  land.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  await land.setViewportSize({ width: 852, height: 393 });
  await land.goto(`${server.origin}/universe.html`, { waitUntil: "load" });
  await land.waitForFunction(() => window.__universe !== undefined);
  await land.waitForTimeout(1400);
  await land.evaluate(() => window.__universe.settle());
  check("누운 화면은 옆 시트 배치를 쓴다",
    await land.evaluate(() => document.querySelector(".universe").classList.contains("is-short")));
  await land.evaluate(() => window.__universe.focus("franz-kafka"));
  await land.waitForTimeout(900);
  await land.evaluate(() => window.__universe.land("franz-kafka"));
  for (let i = 0; i < 11; i++) await land.waitForTimeout(650);
  await land.evaluate(() => window.__universe.settle());
  await land.waitForTimeout(300);

  const lm = await land.evaluate(() => window.__universe.metrics());
  check("누운 화면에도 회랑이 선다", lm.stage === "surface" && lm.baysInFrame >= 3,
    `stage=${lm.stage} · 띠 안 ${lm.baysInFrame}/${lm.bays}칸`);

  const bitten = await land.evaluate(() => {
    const chrome = [];
    const sel = ".u-top, .u-time, .u-card, .u-grip, .u-lenses, .u-mine, .u-why";
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
    return { chrome: chrome.length, out };
  });
  check("누운 화면에서 이름표가 크롬에 물리지 않는다", bitten.out.length === 0,
    `크롬 ${bitten.chrome}판 · 물린 ${bitten.out.length}개${bitten.out.length ? " — " + bitten.out.join(", ") : ""}`);

  // 오탭 — 작품 이름표가 연도판 위에 얹히면 탭이 작품이 아니라 연도를 옮긴다
  const workHit = await land.evaluate(() => {
    const el = [...document.querySelectorAll(".globe-label--work")].find((e) => e.style.display !== "none");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const at = document.elementFromPoint(cx, cy);
    return {
      t: (el.textContent ?? "").trim(),
      x: cx,
      y: cy,
      at: at ? `${at.tagName.toLowerCase()}.${at.className.toString().split(" ")[0]}` : "none",
      year: Number(document.querySelector("#u-year")?.value ?? -1)
    };
  });
  if (workHit) {
    check("작품 이름표 위에 연도판이 없다 — 탭이 작품에 닿는다",
      !workHit.at.startsWith("input"), `${workHit.t} @${Math.round(workHit.x)},${Math.round(workHit.y)} → ${workHit.at}`);
    await land.touchscreen.tap(workHit.x, workHit.y).catch(() => {});
    await land.waitForTimeout(500);
    const post = await land.evaluate(() => ({
      year: Number(document.querySelector("#u-year")?.value ?? -1),
      w: new URLSearchParams(location.search).get("w")
    }));
    check("작품을 탭해도 연도가 움직이지 않는다",
      post.year === workHit.year, `${workHit.year} → ${post.year}`);
    check("작품을 탭하면 그 작품이 열린다", Boolean(post.w), `w=${post.w}`);
  } else {
    check("누운 화면에 작품 이름표가 없다 — 오탭 계약 미측정", false, "관측 불가");
  }
  await land.close();
}

console.log(`\nconsole errors: ${consoleErrors.length}`);
for (const e of consoleErrors.slice(0, 5)) console.log(`   ${e}`);
if (consoleErrors.length) failed++;

console.log(`\n${passed} passed · ${failed} failed`);
await browser.close();
server.close();
process.exit(failed ? 1 : 0);
