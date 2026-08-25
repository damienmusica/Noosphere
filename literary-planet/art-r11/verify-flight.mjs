#!/usr/bin/env node
// R12-f — 카메라 주권. **손이 잡은 카메라**가 성립하는지 잰다.
//
// 이 계약들이 여정 파일에서 떨어져 나온 이유는 속도다: 조준 루프(드래그 →
// 투영 재측정 → 다시 드래그)가 한 판에 몇 분을 먹어 `verify-journey` 가 8분이
// 됐고, 변이 스윕(한 변이당 한 판)이 네 시간으로 불었다. 변이 스윕은 계약이
// 빠를 때만 성립하는 도구이므로, 느린 계약은 **자기 레인**을 갖는다.
//
//   node art-r11/verify-flight.mjs [--dist dist]
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
    console.log(`  \u2713 ${name}${detail ? ` \u2014 ${detail}` : ""}`);
  } else {
    failed++;
    console.log(`  \u2717 ${name}${detail ? ` \u2014 ${detail}` : ""}`);
  }
};
const settle = async (ms = 900) => {
  await page.waitForTimeout(ms);
  await page.evaluate(() => window.__universe.settle());
  await page.waitForTimeout(150);
};
const metrics = () => page.evaluate(() => window.__universe.metrics());
const url = (q) => `${server.origin}/universe.html${q}`;

// ——— 카메라 주권 (R12-f) ———
// 표현 사다리는 처음부터 **거리의 함수**였다(별 → 원반 → 지각 → 표면). 없던
// 것은 사다리가 아니라 그것을 오를 이동 수단이었다: 주시점이 `flyTo` 에서만
// 바뀌었으므로 "이미 고른 것 주위를 돌 수는 있어도 고르지 않은 것에는 다가갈
// 수 없다"가 성립했다. 이 절은 버튼을 **하나도** 누르지 않는다.
console.log(`\n카메라 주권`);
const drag = async (dx, dy, x0 = 820, y0 = 520) => {
  await page.mouse.move(x0, y0);
  await page.mouse.down();
  const n = Math.max(4, Math.min(24, Math.round(Math.hypot(dx, dy) / 14)));
  for (let i = 1; i <= n; i++) {
    await page.mouse.move(x0 + (dx * i) / n, y0 + (dy * i) / n);
    await page.waitForTimeout(8);
  }
  await page.mouse.up();
  await settle(150);
};
// 한 번에 크게 민다 — 근접 감속이 별 앞에서 알아서 줄여 주므로 큰 델타가
// 안전하고, 변이 스윕은 계약이 빠를 때만 성립하는 도구다.
const roll = async (n, step = -420) => {
  await page.mouse.move(820, 520);
  for (let i = 0; i < n; i++) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(40);
  }
};
// 드래그 1px 이 하늘을 옮기는 화면 거리(실측 3.3) — 조준은 이 이득의 비례 제어다
const GAIN = 3.3;
const steer = async (id, tol = 30) => {
  for (let i = 0; i < 12; i++) {
    const mm = await metrics();
    const raw = await page.evaluate((x) => window.__universe.project(x, true), id);
    if (raw[2] > 1) {
      await drag(360, 0); // 등 뒤에 있다 — 돌아본다
      continue;
    }
    const sx = ((raw[0] + 1) / 2) * 1600;
    const sy = ((-raw[1] + 1) / 2) * 1000;
    const dx = mm.aim[0] - sx;
    const dy = mm.aim[1] - sy;
    if (Math.hypot(dx, dy) < tol) return true;
    const cl = (v) => Math.max(-380, Math.min(380, v / GAIN));
    await drag(cl(dx), cl(dy));
  }
  return false;
};

await page.goto(url("?lens=movement"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(1400);
let m = await metrics();
check("원경은 자유 비행이다 — 피벗이 시선 앞에 선다",
  m.pivot === 150 && m.walkYear === null && m.stage === "sky",
  `pivot=${m.pivot} stage=${m.stage}`);

// 휠은 추력이고, 손을 뗀 뒤에도 미끄러진다. 관성이 없으면 그것은 비행이
// 아니라 순간이동의 연속이다.
const r0 = m.camR;
await roll(1);
await page.waitForTimeout(90);
const mid = await metrics();
await settle(700);
const done = await metrics();
check("휠 한 번이 앞으로 민다", mid.camR < r0 - 20, `${r0} → ${mid.camR}`);
check("손을 뗀 뒤에도 미끄러진다 (관성)",
  done.camR < mid.camR - 20 && done.moving === false, `${mid.camR} → ${done.camR}`);

// 드래그 = 고개 돌리기. 하늘은 **손가락과 같은 쪽으로** 온다(별지도의 규약).
const onStar = async () => {
  for (const id of ["franz-kafka", "jorge-luis-borges", "leo-tolstoy", "marcel-proust", "albert-camus", "thomas-mann"]) {
    const q = await page.evaluate((x) => window.__universe.project(x), id);
    if (q && q[0] > 320 && q[0] < 1480 && q[1] > 90 && q[1] < 880) return { id, q };
  }
  return null;
};
const before = await onStar();
check("하늘에 조준할 별이 있다", Boolean(before), before ? before.id : "없음");
if (before) {
  await drag(200, 0);
  const after = await page.evaluate((x) => window.__universe.project(x), before.id);
  check("드래그는 하늘을 손가락과 같은 쪽으로 옮긴다",
    Boolean(after) && after[0] > before.q[0] + 80, `x ${Math.round(before.q[0])} → ${after ? Math.round(after[0]) : "밖"}`);
  check("둘러보는 동안 아무것도 고르지 않는다", (await page.locator(".u-card").count()) === 0);
}

// 집던 자리에서 고르면, 별에서 시작한 모든 둘러보기가 선택이 된다.
// 고르는 것은 **떼는 순간**이고, 6px 을 넘겨 움직였으면 그것은 드래그다.
const s2 = await onStar();
check("드래그를 시작할 별이 있다", Boolean(s2), s2 ? s2.id : "없음");
if (s2) {
  // **뗄 자리에 별이 있어야** 이 계약이 무언가를 잰다. 드래그는 하늘을 돌리므로
  // 출발점으로 돌아와도 곧바로는 별이 거기 없다 — 감쇠가 가라앉기를 **손을 든
  // 채** 기다리면 알짜 회전이 0 으로 수렴해 별이 제자리로 돌아온다.
  await page.mouse.move(s2.q[0], s2.q[1]);
  await page.mouse.down();
  for (const [dx, dy] of [[90, 40], [140, 110], [40, 150], [-60, 90], [0, 0]]) {
    await page.mouse.move(s2.q[0] + dx, s2.q[1] + dy);
    await page.waitForTimeout(14);
  }
  await page.waitForTimeout(900); // 누른 채 감쇠가 가라앉는다
  const q = await page.evaluate((id) => window.__universe.project(id), s2.id);
  const gap = q ? Math.hypot(q[0] - s2.q[0], q[1] - s2.q[1]) : 999;
  await page.mouse.up();
  await settle(400);
  check("드래그는 **별 위에서 떼어도** 고르지 않는다",
    gap < 20 && (await page.locator(".u-card").count()) === 0,
    `뗀 자리와 별 사이 ${Math.round(gap)}px`);
}

// 같은 자리를 **그냥 누르면** 고른다 — 위 계약이 "선택을 껐다"로 통과하지 않게.
// 드래그가 하늘을 옮겨 놓았으므로 다시 조준해서 확실한 과녁을 만든다(첫 판은
// 여기서 별을 잃고 궤도 계약 전체가 빈 상태를 쟀다).
await steer("franz-kafka", 40);
const kq = await page.evaluate(() => window.__universe.project("franz-kafka"));
check("조준하면 그 별이 화면에 있다", Boolean(kq), kq ? `${Math.round(kq[0])},${Math.round(kq[1])}` : "밖");
if (kq) {
  await page.mouse.click(kq[0], kq[1]);
  await settle(900);
  check("같은 자리를 그냥 누르면 고른다",
    (await page.locator(".u-card").count()) >= 1);
}

// 궤도에 묶여 있지 않다 — 휠은 언제나 추력이다. 다만 **읽던 것은 뺏지 않는다**:
// 고른 것 주위를 도는 일과 그것을 읽는 일은 다르다.
await roll(1);
await settle(500);
m = await metrics();
check("궤도에서 휠을 밀면 카메라가 풀린다 (읽던 카드는 남는다)",
  m.pivot === 150 && (await page.locator(".u-card").count()) >= 1,
  `pivot=${m.pivot} · 카드 ${await page.locator(".u-card").count()}`);

// 끊긴 궤도는 **다시 고르면 이어진다** — 그러지 않으면 한 번 민 뒤로는
// 무엇을 골라도 카메라가 그 주위를 돌지 않는다. 끊은 **직후**에 잰다:
// 벽까지 물러난 뒤에는 조준이 흔들려 계약이 설정 실패로 죽는다(실측).
// 대상은 **다른 별**이어야 한다 — 같은 별을 두 번 누르면 그것은 착륙이다.
await steer("jorge-luis-borges", 34);
const kq3 = await page.evaluate(() => window.__universe.project("jorge-luis-borges"));
check("궤도를 다시 이을 별을 조준했다", Boolean(kq3), kq3 ? "예" : "화면 밖");
await page.mouse.click(kq3 ? kq3[0] : 800, kq3 ? kq3[1] : 500);
await settle(1400);
m = await metrics();
check("새로 고르면 궤도가 다시 이어진다",
  Boolean(kq3) && m.pivot === 0 && Math.abs(m.dist - 1200) < 80,
  `pivot=${m.pivot} dist=${m.dist}`);

// 그리고 충분히 멀어지면 읽던 것도 닫힌다 — "떠났다"의 자는 렌즈 거리의 1.6배
await roll(1);
await settle(300);
for (let i = 0; i < 14 && (await page.locator(".u-card").count()); i++) {
  await roll(1, 420);
  await settle(220);
}
check("그 별에서 충분히 멀어지면 궤도가 닫힌다",
  (await page.locator(".u-card").count()) === 0);

// ★ 이 라운드의 판정 — 버튼을 한 번도 누르지 않고 카프카에서 보르헤스까지
await page.goto(url("?lens=movement"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(1400);
const aimedK = await steer("franz-kafka");
for (let i = 0; i < 14 && !(await metrics()).bodies; i++) {
  await roll(1);
  await settle(220);
  await steer("franz-kafka", 44);
}
const atK = await metrics();
check("조준한 대로 카프카가 천체로 분해된다 (누르지 않았다)",
  aimedK && atK.stage === "approach" && atK.bodies >= 1,
  `stage=${atK.stage} bodies=${atK.bodies} 거리 ${atK.nearest[1]}`);
check("다가가는 동안 추력이 느려진다 (별 앞에 설 수 있다)",
  atK.throttle < 1, `배율 ${atK.throttle}`);
// 분해된 첫 순간이 그 천체의 첫인상이다. 자산 사전 로드의 방아쇠가 선택뿐이면
// 조준해서 다가간 천체가 무늬 없는 공으로 남는다 — 미준비 작가에게 착륙을
// 금지한 바로 그 화면이다.
check("고르지 않고 다가가도 지각이 칠해진다",
  atK.crustPainted >= 1, `칠해진 천체 ${atK.crustPainted}`);

const aimedB = await steer("jorge-luis-borges");
let closest = 9999;
for (let i = 0; i < 18; i++) {
  const mm = await metrics();
  if (mm.nearest[0] === "jorge-luis-borges") closest = Math.min(closest, mm.nearest[1]);
  if (mm.nearest[0] === "jorge-luis-borges" && mm.nearest[1] < 320) break;
  await roll(1);
  await settle(220);
  await steer("jorge-luis-borges", 44);
}
const atB = await metrics();
check("버튼을 한 번도 누르지 않고 카프카에서 보르헤스까지 간다",
  aimedB && atB.nearest[0] === "jorge-luis-borges" && atB.nearest[1] < 320,
  `가장 가까운 별 ${atB.nearest[0]} ${atB.nearest[1]}`);
check("여정 내내 아무것도 고르지 않았다", (await page.locator(".u-card").count()) === 0);
// 겉보기 크기는 영향력에 매여 있다 — 미준비 작가는 다가가도 점의 크기가
// 변하지 않는다. 형식을 지키면서 접근에 응답하는 채널은 **이름**이다.
const named = await page.evaluate(() =>
  [...document.querySelectorAll(".globe-label--author")]
    .filter((e) => e.style.display !== "none")
    .map((e) => [e.dataset.labelId, e.dataset.muted === "1"])
);
const bo = named.find((x) => x[0] === "jorge-luis-borges");
check("다가간 별은 이름을 갖는다 — 층이 켜져 있어도 접히지 않는다",
  Boolean(bo) && bo[1] === false, bo ? `muted=${bo[1]}` : "이름 없음");
// 등급이 높아 **어차피** 이름을 받는 별로는 이 기제를 증명하지 못한다 —
// 다른 이유가 하나도 없는데 가깝다는 것만으로 켜진 이름을 따로 센다.
check("가깝다는 것만으로 켜진 이름이 있다", atB.nearNamed >= 1, `${atB.nearNamed}개`);

// 등을 돌릴 자유를 주면 등을 돌린 화면이 생긴다 — 카메라를 대신 돌리지 않고
// 성계가 어느 쪽인지만 말한다.
// 껍질 **밖에서** 바깥을 볼 때만 프레임이 빈다 — 별들 사이에 서 있는 동안은
// 어느 쪽을 봐도 하늘이 있다. 출발 구도로 돌아가 등을 돌려 본다.
await page.goto(url("?lens=movement"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(1400);
let lost = null;
for (let i = 0; i < 12; i++) {
  await drag(380, 0);
  const mm = await metrics();
  if (mm.onScreenStars === 0) {
    lost = mm;
    break;
  }
}
check("하늘이 비면 성계 방향을 알려준다",
  Boolean(lost) && lost.homeMark === true, lost ? `표식=${lost.homeMark}` : "빈 화면에 이르지 못함");
if (lost) {
  for (let i = 0; i < 10; i++) {
    await drag(-380, 0);
    const mm = await metrics();
    if (mm.onScreenStars > 0) {
      check("별이 돌아오면 표식은 물러난다", mm.homeMark === false, `별 ${mm.onScreenStars}`);
      break;
    }
  }
}

// 자유는 성계를 벗어날 자유가 아니다 — 뒤로 아무리 밀어도 바깥 한계에서 선다
await page.goto(url("?lens=movement"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(1400);
await roll(12, 900);
await settle(700);
const out1 = (await metrics()).camR;
// 회전도 카메라를 옮긴다(피벗이 앞에 있으므로) — 한계는 **회전 뒤에도** 선다
await drag(320, 120);
await drag(-260, -90);
await roll(6, 900);
await settle(700);
const outM = await metrics();
check("뒤로 밀어도, 돌아봐도 성계 밖으로 나가지 않는다",
  out1 <= 3200 && outM.camR <= 3200 && outM.moving === false,
  `${out1} → ${outM.camR} · moving=${outM.moving}`);
// 벽에 대고 계속 밀면 속도가 쌓이고, 돌아서는 순간 시위처럼 튀어 나간다.
// 한계는 자리를 잡는 동시에 **속도를 끊어야** 한계다.
await roll(6, 900);
await page.waitForTimeout(130);
const pressed = await metrics();
check("한계에 대고 밀어도 속도가 쌓이지 않는다",
  pressed.moving === false && pressed.camR <= 3200,
  `moving=${pressed.moving} camR=${pressed.camR}`);

// 안쪽 한계 — 항성을 관통하지 않는다. 별을 조준하고 계속 밀면 그 직선은
// 원점을 지나므로, 잡아 주지 않으면 카메라가 태양 속으로 들어간다.
await page.goto(url("?lens=movement"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(1200);
// 조준은 **항성**에 한다 — 별을 조준하면 그 직선이 원점을 비껴가 한계에
// 닿지 않는다(첫 판 실측: 1591 → 2781 로 지나쳐 버렸다).
const aimSun = async (tol = 26) => {
  for (let i = 0; i < 12; i++) {
    const mm = await metrics();
    if (!mm.sunPx) return false;
    const dx = mm.aim[0] - mm.sunPx[0];
    const dy = mm.aim[1] - mm.sunPx[1];
    if (Math.hypot(dx, dy) < tol) return true;
    const cl = (v) => Math.max(-380, Math.min(380, v / GAIN));
    await drag(cl(dx), cl(dy));
  }
  return false;
};
const onSun = await aimSun();
let inner1 = (await metrics()).camR;
for (let i = 0; i < 14; i++) {
  await roll(2, -900);
  await settle(180);
  await aimSun(40);
  const c = (await metrics()).camR;
  if (Math.abs(c - inner1) < 3) break;
  inner1 = c;
}
await roll(4, -900);
await settle(400);
const inner2 = await metrics();
check("계속 밀어도 항성을 관통하지 않는다",
  onSun && inner1 >= 120 && inner2.camR >= 120 && Math.abs(inner2.camR - inner1) < 25,
  `조준=${onSun} · ${inner1} → ${inner2.camR}`);

// 자유는 **돌아올 길**과 함께 준다. 껍질 안으로 들어가 버리면 지도가 사라지고,
// 다시 만드는 유일한 방법이 새로고침이어서는 안 된다.
await page.goto(url("?lens=movement"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(1200);
await roll(4);
await settle(700);
m = await metrics();
check("성계 안으로 들어오면 돌아올 길이 뜬다",
  m.deep === true && (await page.locator('[data-testid="to-overview"]').count()) === 1,
  `camR=${m.camR} deep=${m.deep}`);
await page.locator('[data-testid="to-overview"]').click();
await settle(1500);
m = await metrics();
check("원경으로 돌아오면 성계 전체가 다시 보인다",
  Math.abs(m.camR - 2191) < 140 &&
    m.deep === false &&
    (await page.locator('[data-testid="to-overview"]').count()) === 0,
  `camR=${m.camR}`);

// 관성 있는 카메라는 전정기관에 부담을 준다. 감소된 동작에서는 관성을 빼되
// **거리는 뺏지 않는다** — 같은 제스처가 같은 만큼 가야 한다.
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(url("?lens=movement"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(1200);
const rm0 = (await metrics()).camR;
await page.mouse.move(820, 520);
await page.mouse.wheel(0, -140);
await page.waitForTimeout(140);
const rmMid = await metrics();
check("감소된 동작에서는 관성 없이 같은 거리를 간다",
  rm0 - rmMid.camR > 150 && rmMid.moving === false,
  `${rm0} → ${rmMid.camR} · moving=${rmMid.moving}`);
await page.emulateMedia({ reducedMotion: null });

// ——— 회랑: 서 있는 자세가 아니라 **걷는 자리** ———
await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(2600);
await settle(1000);
m = await metrics();
const y0 = m.walkYear;
check("착륙하면 회랑 입구에 선다", m.walking === true && y0 !== null && y0 < 1913,
  `서 있는 해 ${y0}`);
await roll(2, -300);
await settle(600);
m = await metrics();
// 상태(서 있는 해)와 **카메라**(실제로 걸어 나온 칸) 둘 다 잰다 — 자세가
// 그 상태를 읽지 않아도 walkYear 는 태연히 바뀐다.
check("회랑에서 휠은 걷기다 — 서 있는 해가 바뀌고 몸이 옮겨 간다",
  m.walkYear > y0 + 2 && m.walked > 2, `${y0} → ${m.walkYear} · 걸은 칸 ${m.walked}`);
check("걸어도 회랑 안이다 (칸이 프레임에 남는다)", m.baysInFrame > 0, `칸 ${m.baysInFrame}`);
const y1 = m.walkYear;
const w1 = m.walked;
const e1 = m.aheadPx;
await drag(-240, 0);
m = await metrics();
check("회랑에서 드래그는 고개 돌리기다 — 자리는 그대로, 시야만 돈다",
  Math.abs(m.walkYear - y1) < 0.02 &&
    Math.abs(m.walked - w1) < 0.05 &&
    Math.abs(m.look[0]) > 4 &&
    Boolean(e1 && m.aheadPx) &&
    Math.abs((m.aheadPx?.[0] ?? 0) - (e1?.[0] ?? 0)) > 60,
  `해 ${m.walkYear} · 고개 ${m.look[0]}° · 여섯 칸 앞 ${e1?.[0]} → ${m.aheadPx?.[0]}`);
// 끝까지 걷는다 — 한 번의 제스처로는 닿지 않는다(속도 상한이 있으므로)
let prevY = -1;
let curY = (await metrics()).walkYear;
for (let i = 0; i < 24 && curY !== prevY; i++) {
  prevY = curY;
  await roll(3, -900);
  await settle(320);
  curY = (await metrics()).walkYear;
}
const end1 = curY;
await roll(3, -900);
await settle(320);
const end2 = (await metrics()).walkYear;
// 끝은 데이터가 정한다 — 카프카의 회랑은 사후 수용 앵커(1969 카네티)까지
// 이어지므로 사망년이 끝이 아니다. 걸을 수 있는 폭이 **칸 수와 같은지**로 잰다.
check("걷기는 회랑 끝에서 멈춘다 (더 밀어도 같은 자리)",
  Math.abs(end2 - end1) < 0.05 && Math.abs(end1 - y0 - (m.bays - 1.1)) < 0.25,
  `끝 ${end1} → ${end2} · 걸은 폭 ${(end1 - y0).toFixed(1)} vs 칸 ${m.bays}`);
await page.evaluate(() => window.__universe.land("natsume-soseki"));
await settle(2600);
m = await metrics();
// 회랑에서 컨트롤이 깨어 있으면 드래그가 회전량을 쌓아 두었다가 **당김
// 리프레임에서 한꺼번에 터진다** — 고개를 돌린 뒤 책을 꺼내면 그 책이 화면
// 밖에 있다. 고개를 돌린 상태에서 당겨 보는 것이 이 계약의 전부다.
{
  const wl = await page.evaluate(() =>
    [...document.querySelectorAll(".globe-label--work")]
      .filter((e) => e.style.display !== "none")
      .map((e) => {
        const r = e.getBoundingClientRect();
        return [e.dataset.labelId, r.x + r.width / 2, r.y + r.height / 2];
      })
  );
  check("고개를 돌린 회랑에도 작품 이름표가 있다", wl.length >= 1, `${wl.length}개`);
  if (wl.length) {
    const [wid, wx, wy] = wl[0];
    await page.mouse.click(wx, wy);
    await settle(1200);
    const pm = await metrics();
    const px = await page.evaluate((id) => {
      const el = document.querySelector(`.globe-label--work[data-label-id="${id}"]`);
      if (!el || el.style.display === "none") return null;
      const r = el.getBoundingClientRect();
      return r.x + r.width / 2;
    }, wid);
    // 넓은 띠(380–1220)로는 쌓인 회전을 못 잡는다 — **조준점 기준**으로 잰다
    check("고개를 돌린 뒤 책을 꺼내도 그 책이 조준점으로 온다",
      pm.pulled === wid && px !== null && Math.abs(px - pm.aim[0]) < 150,
      `당김=${pm.pulled} · x=${px === null ? "밖" : Math.round(px)} · 조준 ${pm.aim[0]}`);
  }
}

check("새 회랑에 들어서면 다시 입구에 선다", m.walkYear !== null && m.walkYear < 1906,
  `서 있는 해 ${m.walkYear}`);

console.log(`\nconsole errors: ${consoleErrors.length}`);
if (consoleErrors.length) console.log(consoleErrors.slice(0, 4).join("\n"));
console.log(`\n${passed} passed \u00b7 ${failed} failed`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
