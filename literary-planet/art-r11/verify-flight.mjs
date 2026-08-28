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
// 드래그 1px 이 하늘을 옮기는 화면 거리 — 조준은 이 이득의 비례 제어다.
// R13 고개의 법: 이득은 어디서나 TURN_GAIN(1.9) 하나다(이전 하늘 실측 3.3).
const GAIN = 1.9;
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

// ——— 관측선 (R13) ———
// 문 0(CPO 자기 관찰, 2026-08-28)이 판정한 기초 불통과의 처방. 같은 드래그에
// 법이 셋이던 것(하늘 3.6배 · 회랑 1.6배 · 궤도 부호 반대)은 고개의 법
// 하나(TURN_GAIN)가 됐고, 추력은 시선 정면이 아니라 **뜻한 곳**으로 간다.
// 판정 문장의 앞 절반 — *조준 없이, 보이는 아무 별이나 골라 한 동작으로
// 다가간다* — 를 여기서 기계로 잰다.
console.log(`\n관측선`);
{
  // 감도의 법 하나 — 양적으로. 드래그 200px 은 하늘을 200×1.9=380px 옮긴다.
  // 옛 OrbitControls 가 되살아나면 ≈720px, 배율이 조용히 죽으면 0 — 양쪽 다
  // 이 창(±25%)을 벗어난다.
  const g0 = await onStar();
  check("감도 계약을 잴 별이 있다", Boolean(g0), g0 ? g0.id : "없음");
  if (g0) {
    await drag(200, 0);
    const g1 = await page.evaluate((x) => window.__universe.project(x), g0.id);
    const moved = g1 ? g1[0] - g0.q[0] : NaN;
    check("고개의 법 하나 — 드래그 200px 은 하늘을 380px(±25%) 옮긴다",
      Number.isFinite(moved) && moved > 285 && moved < 475,
      `이동 ${Math.round(moved)}px (기대 380)`);
  }

  // 부호는 어디서나 하나. 궤도(별을 골라 카드가 열린 상태)에서도 같은 드래그는
  // 하늘을 같은 쪽으로 옮긴다 — "붙잡고 돌린다"(부호 반대)는 문 0 으로 은퇴했다.
  await page.evaluate(() => window.__universe.focus("franz-kafka"));
  await settle(1300);
  const inOrbit = await metrics();
  check("궤도에 서 있다 (카드 열림, 자유 비행 아님)",
    inOrbit.pivot === 0 && (await page.locator(".u-card").count()) === 1,
    `pivot=${inOrbit.pivot}`);
  let o0 = await onStar();
  // 오른쪽 가장자리의 별은 +380px 이동에서 화면 밖으로 나간다 — 방을 만든다.
  for (let i = 0; i < 3 && o0 && o0.q[0] > 1050; i++) {
    await drag(-260, 0);
    o0 = await onStar();
  }
  check("궤도에서 부호를 잴 별이 있다", Boolean(o0) && o0.q[0] <= 1050, o0 ? `${o0.id} x=${Math.round(o0.q[0])}` : "없음");
  if (o0) {
    await drag(200, 0);
    const o1 = await page.evaluate((x) => window.__universe.project(x), o0.id);
    check("궤도에서도 하늘은 손가락과 같은 쪽으로 온다 (부호 단일)",
      Boolean(o1) && o1[0] > o0.q[0] + 80,
      `x ${Math.round(o0.q[0])} → ${o1 ? Math.round(o1[0]) : "밖"}`);
  }

  // 조준 비행 — 판정 문장의 앞 절반. 화면 어디든 보이는 별에 커서를 두고
  // 휠만 굴리면(드래그 0회) 그 별 앞에 서고, 기수는 스스로 목표를 향해 정렬된다.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
  let t0 = await onStar();
  check("조준 비행을 잴 별이 있다", Boolean(t0), t0 ? t0.id : "없음");
  if (t0) {
    const distTo = async () => {
      const mm = await metrics();
      return mm.nearest[0] === t0.id ? mm.nearest[1] : Infinity;
    };
    // 정렬 계약의 전제 — 별이 조준점 근처에서 출발하면 "정렬됐다"가 아무것도
    // 재지 않는다(변이 스윕 실측: 정렬 제거가 생존했다). 중앙 근처면 하늘을
    // 밀어 별을 가장자리로 보내고 시작한다.
    {
      const mmA = await metrics();
      let off0 = Math.hypot(t0.q[0] - mmA.aim[0], t0.q[1] - mmA.aim[1]);
      for (let i = 0; i < 4 && off0 < 380; i++) {
        await drag(-300, 130);
        const fresh = await onStar();
        if (!fresh) break;
        t0 = fresh;
        const mmB = await metrics();
        off0 = Math.hypot(t0.q[0] - mmB.aim[0], t0.q[1] - mmB.aim[1]);
      }
      check("출발 시 별이 조준점에서 멀다 (정렬 계약의 전제)",
        off0 >= 380, `출발 이격 ${Math.round(off0)}px`);
    }
    // 접근의 사다리(R13-b) — 먼 하늘, 지목 전: 계기는 침묵한다.
    const rungCount = async () => page.locator(".u-approach li").count();
    check("먼 하늘에는 관측 스트립이 없다", (await rungCount()) === 0);
    await page.mouse.move(t0.q[0], t0.q[1]);
    await page.mouse.wheel(0, -420);
    await page.waitForTimeout(90);
    const locked = await metrics();
    check("휠이 커서 아래 별을 지목한다 (조준 항법)",
      locked.aimLock === t0.id, `aimLock=${locked.aimLock}`);
    check("지목하면 계기가 응답한다 (스트립의 이름 줄)", (await rungCount()) >= 1);
    // 지목은 비행 내내 산다 — 정렬이 별을 중앙으로 데려가 커서 밑이 비어도.
    // (변이 스윕 실측: 락 유지를 지워도 아무 계약이 안 죽었다 — 이 검사가 그 이빨)
    let lockHeld = true;
    const rungSamples = [];
    for (let i = 0; i < 26; i++) {
      // 작은 노치 + 활공 표본 — settle 로 관성을 다 소진하면 사다리의 중간
      // 단(330→150)을 한 번에 건너뛰어 "도착 전"이 표본에 없다(실측).
      await page.mouse.wheel(0, i < 6 ? -420 : -150);
      await page.waitForTimeout(130);
      const mmL = await metrics();
      const dNow = await distTo();
      if (mmL.aimLock !== t0.id && dNow > 260) lockHeld = false;
      if (Number.isFinite(dNow)) rungSamples.push({ d: dNow, n: await rungCount() });
      if (dNow < 210) break;
    }
    check("지목은 비행 내내 산다 (빈 하늘 커서가 락을 깨지 않는다)", lockHeld);
    // 사다리는 다가갈수록 깊어지고, 판정 문장의 뒷절반이 여기서 선다:
    // *도착 전에 그 작가에 대해 세 가지를 알게 된다.*
    const grew = rungSamples.every((s, i, arr) => i === 0 || s.n >= arr[i - 1].n);
    check("다가갈수록 줄이 늘어난다 (사다리 단조)",
      rungSamples.length > 0 && grew,
      rungSamples.map((s) => `${Math.round(s.d)}:${s.n}`).join(" "));
    const preArrive = rungSamples.filter((s) => s.d > 150 && s.d < 330).pop();
    check("도착 전에 그 작가에 대해 세 가지를 안다",
      Boolean(preArrive) && preArrive.n >= 3,
      preArrive ? `d=${Math.round(preArrive.d)} 줄 ${preArrive.n}` : "표본 없음");
    await settle(600);
    const d1 = await distTo();
    check("드래그 0회, 휠만으로 그 별 앞에 선다 (도착 = 정지)",
      d1 > 100 && d1 < 210, `거리 ${Math.round(d1)} (STANDOFF 140)`);
    const at = await page.evaluate((x) => window.__universe.project(x), t0.id);
    const mm2 = await metrics();
    const offAim = at ? Math.hypot(at[0] - mm2.aim[0], at[1] - mm2.aim[1]) : Infinity;
    check("기수가 스스로 목표로 정렬됐다 (도착 시 별이 조준점 근처)",
      offAim < 320, `조준점에서 ${Math.round(offAim)}px`);
    // 도착 시 사다리의 단이 하나하나 서 있다 — 단 하나가 조용히 죽어도
    // 총계(≥3)는 초록일 수 있으므로, 단별로 잰다(변이의 이빨).
    for (const rung of ["line", "why", "relation"]) {
      const n = await page.locator(`.u-approach li[data-rung="${rung}"]`).count();
      check(`도착의 사다리 — ${rung} 단이 서 있다`, n === 1, `${rung} ${n}`);
    }
    // 도착의 문간 — 준비된 착륙지라면 초대가, 여는 문장이 있는 작가라면 그
    // 문장이 선다. 없는 단은 없다고 두는 것이 문법이므로 초대 줄만 전원 계약.
    const inviteText = await page.locator('.u-approach li[data-rung="invite"]').textContent().catch(() => null);
    const READY = ["franz-kafka", "natsume-soseki", "rabindranath-tagore"];
    check("도착의 문간에 초대가 선다 (준비도에 정직하게)",
      Boolean(inviteText) &&
        (READY.includes(t0.id) ? inviteText.includes("착륙") : inviteText.includes("궤도")),
      `"${inviteText}"`);
    if (READY.includes(t0.id)) {
      const openingCount = await page.locator('.u-approach li[data-rung="opening"]').count();
      check("여는 문장이 도착 전 하늘에 선다 (world 보유 작가)",
        openingCount === 1, `opening 줄 ${openingCount}`);
    }
    // 별 앞에 선다 — 커서를 별의 **지금** 자리에 다시 두고 굴려도 관통하지
    // 않는다(정렬이 별을 중앙으로 옮겼으므로 옛 커서 자리는 빈 하늘이고, 빈
    // 하늘로의 추력은 자유이지 관통이 아니다 — 실측). 대조군: "여전히 그 별
    // 곁"(< 400)이 없으면 Infinity 도 초록이 되는 빈 계약이다(실측).
    const nowAt = await page.evaluate((x) => window.__universe.project(x), t0.id);
    if (nowAt) await page.mouse.move(nowAt[0], nowAt[1]);
    await page.mouse.wheel(0, -420);
    await page.mouse.wheel(0, -420);
    await settle(500);
    const d2 = await distTo();
    check("더 굴려도 별을 관통하지 않는다 (STANDOFF 가 선다)",
      d2 > 95 && d2 < 400, `거리 ${Math.round(d2)}`);
    // 감속은 목표의 거리다 — 코앞의 별이 아니라. 여기(별 앞, 최근접 ≈140)서
    // 먼 별을 조준해 굴리면 배율은 최근접(≈0.16)이 아니라 목표 거리를 읽는다.
    const farScan = async () => {
      for (const id of [
        "jorge-luis-borges", "leo-tolstoy", "marcel-proust", "albert-camus",
        "thomas-mann", "virginia-woolf", "james-joyce", "fyodor-dostoevsky",
        "gabriel-garcia-marquez", "natsume-soseki", "rabindranath-tagore", "franz-kafka",
      ]) {
        if (id === t0.id) continue;
        const q = await page.evaluate((x) => window.__universe.project(x), id);
        if (q && q[0] > 200 && q[0] < 1500 && q[1] > 80 && q[1] < 920) return { id, q };
      }
      return null;
    };
    let far = await farScan();
    // 별 코앞의 하늘은 좁다 — 후보가 없으면 제자리에서 한 바퀴 돌며 찾는다.
    for (let i = 0; i < 8 && !far; i++) {
      await drag(400, 0);
      far = await farScan();
    }
    if (far) {
      await page.mouse.move(far.q[0], far.q[1]);
      await page.mouse.wheel(0, -180);
      await page.waitForTimeout(90);
      const mm4 = await metrics();
      check("감속은 최근접 별이 아니라 지목한 목표의 거리를 읽는다",
        mm4.aimLock === far.id && mm4.throttle > 0.32,
        `aimLock=${mm4.aimLock} throttle=${mm4.throttle}`);
      await settle(900);
    } else {
      check("감속-목표 계약을 잴 먼 별이 있다", false, "화면 안 후보 없음");
    }
  }
  // 아래 두 계약(여는 문장·카드-스트립)은 앞 비행의 도착 자세와 무관하다 —
  // 깊은 하늘에서는 후보 스캔이 비므로(실측) 출발 자세에서 다시 시작한다.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
  {
      // 조준 비행의 별이 world 미보유 작가였다 — 여는 문장 계약은 카프카를
      // 직접 조준해 결정적으로 잰다(입문작 『변신』의 첫 문장이 하늘에 선다).
      let kq = await page.evaluate(() => window.__universe.project("franz-kafka"));
      for (let i = 0; i < 8 && !(kq && kq[0] > 200 && kq[0] < 1500 && kq[1] > 80 && kq[1] < 920); i++) {
        await drag(400, 0);
        kq = await page.evaluate(() => window.__universe.project("franz-kafka"));
      }
      check("여는 문장 계약을 잴 카프카가 보인다", Boolean(kq), kq ? `${Math.round(kq[0])},${Math.round(kq[1])}` : "없음");
      if (kq) {
        await page.mouse.move(kq[0], kq[1]);
        for (let i = 0; i < 26; i++) {
          await page.mouse.wheel(0, i < 6 ? -420 : -150);
          await page.waitForTimeout(120);
          const mmK = await metrics();
          if (mmK.nearest[0] === "franz-kafka" && mmK.nearest[1] < 200) break;
        }
        await settle(600);
        const openingCount = await page.locator('.u-approach li[data-rung="opening"]').count();
        const openingText = await page.locator('.u-approach li[data-rung="opening"]').textContent().catch(() => "");
        check("여는 문장이 도착 전 하늘에 선다 (카프카 『변신』)",
          openingCount === 1 && Boolean(openingText && openingText.includes("변신")),
          `"${(openingText ?? "").slice(0, 40)}…"`);
      }
    }

  // 카드가 열려 있는 동안 스트립은 물러난다 — 같은 내용의 상위 표면이 이미
  // 서 있다. 카드만 열면 카메라가 LENS 거리로 물러나 approach 가 비어 계약이
  // 공허해진다(변이 스윕 실측: 게이트를 지워도 초록) — **카드 열림 + 조준**
  // 상태를 만들고, approach 가 실제로 비-null 임을 대조군으로 함께 잰다.
  {
    await page.evaluate(() => window.__universe.focus("franz-kafka"));
    await settle(1300);
    const near2 = await onStar();
    check("카드-스트립 계약을 잴 별이 있다", Boolean(near2), near2 ? near2.id : "없음");
    if (near2) {
      await page.mouse.move(near2.q[0], near2.q[1]);
      await page.mouse.wheel(0, -180);
      await page.waitForTimeout(120);
      const mmC = await metrics();
      const cardOpen = (await page.locator(".u-card").count()) === 1;
      check("카드 곁에서 조준이 접근을 깨웠다 (대조군)",
        cardOpen && mmC.approach[0] !== null,
        `card=${cardOpen} approach=${mmC.approach[0]}`);
      check("카드가 열려 있는 동안 스트립은 물러난다",
        (await page.locator(".u-approach").count()) === 0);
      await settle(900);
    }
  }

  // 관측선 절은 카메라를 별 앞에 두고 끝난다 — 뒤의 절들은 원경의 하늘을
  // 전제하므로 출발 자세로 되돌린다.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
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
const camBeforePick = (await metrics()).camR;
await page.mouse.click(kq3 ? kq3[0] : 800, kq3 ? kq3[1] : 500);
await settle(1400);
m = await metrics();
// R13-c 관측선: **고르는 것은 몸을 옮기지 않는다.** 카드와 렌즈가 그 별을
// 향할 뿐, 카메라는 서 있던 자리다("클릭하면 훅 이동" — 문 0 2차의 처방).
check("고르는 것은 몸을 옮기지 않는다 (카드는 열리고 카메라는 그 자리)",
  Boolean(kq3) && m.pivot === 0 && Math.abs(m.camR - camBeforePick) < 25 &&
    (await page.locator(".u-card").count()) === 1,
  `pivot=${m.pivot} camR ${camBeforePick} → ${m.camR}`);

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

// ——— 손이 없는 관측자 ———
// 자유 비행이 탐험의 기본 동사가 된 뒤로, 그 동사가 포인터 전용이면 키보드
// 사용자에게는 성계가 목록으로 남는다(R12-e 일곱 번째 수리와 같은 결함).
await page.goto(url("?lens=movement"), { waitUntil: "load" });
await page.waitForFunction(() => window.__universe !== undefined);
await settle(1200);
const focused = await page.evaluate(() => {
  const c = document.querySelector("canvas.universe-canvas");
  c.focus();
  return document.activeElement === c && c.tabIndex === 0;
});
check("캔버스가 키보드로 닿는다", focused);
const kb0 = await metrics();
const kStar = await onStar();
check("키보드로 잴 별이 있다", Boolean(kStar), kStar ? kStar.id : "없음");
await page.keyboard.press("ArrowRight");
await page.keyboard.press("ArrowRight");
await settle(400);
const kAfter = kStar ? await page.evaluate((id) => window.__universe.project(id, true), kStar.id) : null;
check("화살표가 고개를 돌린다 — 오른쪽을 보면 하늘이 왼쪽으로 간다",
  Boolean(kStar && kAfter) && kAfter[0] < ((kStar.q[0] / 1600) * 2 - 1) - 0.15,
  kStar ? `ndc x ${(((kStar.q[0] / 1600) * 2 - 1)).toFixed(2)} → ${kAfter ? kAfter[0] : "?"}` : "");
for (let i = 0; i < 3; i++) await page.keyboard.press("+");
await settle(600);
const kPush = await metrics();
check("더하기 키가 앞으로 민다", kPush.camR < kb0.camR - 150, `${kb0.camR} → ${kPush.camR}`);
for (let i = 0; i < 4; i++) await page.keyboard.press("-");
await settle(600);
const kBack = await metrics();
check("빼기 키가 물러난다", kBack.camR > kPush.camR + 100, `${kPush.camR} → ${kBack.camR}`);

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
// 감소된 동작은 회랑에서도 같은 약속을 지킨다: 관성은 빼되 **거리는 그대로**
{
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(2600);
  await settle(900);
  const rw0 = await metrics();
  await page.mouse.move(820, 520);
  await page.mouse.wheel(0, -420);
  await page.waitForTimeout(140);
  const rw1 = await metrics();
  check("감소된 동작에서도 회랑은 관성 없이 같은 만큼 걷는다",
    rw1.walkYear > rw0.walkYear + 1 && rw1.moving === false,
    `${rw0.walkYear} → ${rw1.walkYear} · moving=${rw1.moving}`);
  await page.emulateMedia({ reducedMotion: null });
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(2600);
  await settle(900);
}

// 회랑에서도 손이 없는 관측자에게 같은 두 동사를 준다.
//
// **초점을 강제하지 않는다.** 이 절은 원래 키 입력 직전마다
// `canvas.universe-canvas.focus()` 를 코드로 불렀고, 그래서 착륙이 남기는 실제
// 초점 상태(접근성 배선이 초점을 착륙 카드로 옮긴다)를 우회했다 — 도달할 수
// 없는 상태를 재고 있었으므로, 카메라 키가 통째로 죽어 있는 동안에도 계약이
// 초록이었다(적대 심사 2026-08-28, blocking). 이제 착륙이 남긴 자리에서 그대로
// 누른다.
{
  const whoHasFocus = () =>
    page.evaluate(() => {
      const a = document.activeElement;
      return a ? `${a.tagName.toLowerCase()}${a.className ? "." + String(a.className).split(" ")[0] : ""}` : "없음";
    });
  const holder = await whoHasFocus();
  check("착륙은 초점을 캔버스에 두지 않는다 (이 계약이 재는 것이 그 상태다)",
    !holder.startsWith("canvas"), `초점 ${holder}`);
  const kw0 = await metrics();
  for (let i = 0; i < 3; i++) await page.keyboard.press("+");
  await settle(500);
  const kw1 = await metrics();
  check("회랑에서도 더하기 키가 걷는다",
    kw1.walkYear > kw0.walkYear + 1 && kw1.walked > kw0.walked + 1,
    `${kw0.walkYear} → ${kw1.walkYear} · 걸은 칸 ${kw0.walked} → ${kw1.walked}`);
  const look0 = kw1.look[0];
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await settle(400);
  const kw2 = await metrics();
  check("회랑에서도 화살표는 고개만 돌린다",
    Math.abs(kw2.look[0] - look0) > 4 && Math.abs(kw2.walked - kw1.walked) < 0.05,
    `고개 ${look0}° → ${kw2.look[0]}° · 걸은 칸 ${kw2.walked}`);
}

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

// ——— 손이 카드에 있어도 카메라는 산다 (2026-08-28, 적대 심사가 연 자리) ———
// 별을 고르거나 착륙하면 접근성 배선이 초점을 카드로 옮긴다(그 자체는 옳다).
// 그때 카메라 키가 죽으면 손이 없는 관측자는 Tab 아홉 번을 눌러야 캔버스로
// 돌아온다 — 실측된 blocking 결함이다. 카메라는 이 화면의 기본 동사이므로
// **글자를 받는 자리에서만** 양보한다.
console.log(`\n초점이 어디 있든 카메라는 산다`);
{
  const active = () =>
    page.evaluate(() => {
      const a = document.activeElement;
      return a ? `${a.tagName.toLowerCase()}${a.className ? "." + String(a.className).split(" ")[0] : ""}` : "없음";
    });

  // (1) 별을 고른 뒤 — 초점은 카드에 있다
  await page.goto(url("?lens=movement&a=franz-kafka"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(2200);
  const who = await active();
  check("별을 고르면 초점이 카드로 간다 (접근성 배선이 살아 있다)",
    who.includes("u-card") || who.startsWith("aside"), `초점 ${who}`);
  // 궤도 모드에서 화살표는 **설계상** 고개를 돌리지 않는다(고른 것 주위를 돈다 —
  // `turn()` 이 `freeMode()` 밖에서 손을 뗀다). 그러므로 여기서 재는 것은 화살표가
  // 아니라 **추력**이다: 카드에 초점이 있어도 +/- 가 카메라를 민다.
  const s0 = await metrics();
  for (let i = 0; i < 3; i++) await page.keyboard.press("+");
  await settle(600);
  const s1 = await metrics();
  check("카드에 초점이 있어도 더하기 키가 카메라를 민다",
    Math.abs(s1.camR - s0.camR) > 20, `camR ${Math.round(s0.camR)} → ${Math.round(s1.camR)}`);

  // (2) 착륙한 뒤 — 초점은 착륙 카드에 있다
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(2600);
  await settle(900);
  const who2 = await active();
  const w0 = await metrics();
  for (let i = 0; i < 3; i++) await page.keyboard.press("+");
  await settle(500);
  const w1 = await metrics();
  check("착륙 카드에 초점이 있어도 더하기 키가 걷는다",
    w1.walkYear > w0.walkYear + 1, `초점 ${who2} · ${w0.walkYear} → ${w1.walkYear}`);

  // (3) 글자를 받는 자리에서는 양보한다 — 검색창의 화살표를 뺏지 않는다.
  //
  // **대조군과 함께 잰다.** 첫 판은 `look`(회랑 전용)과 `walkYear`(하늘에선
  // null)를 봤는데 둘 다 하늘 회전을 관측하지 못한다 — 가드를 지워도 아무
  // 계약이 안 죽는 **빈 계약**이었다(스윕 생존, 2026-08-28). 하늘의 회전은
  // 별의 화면 위치가 말한다. 같은 키를 검색창 안에서 한 번, 밖에서 한 번 눌러
  // **한쪽은 움직이지 않고 다른 쪽은 움직인다**를 함께 단언한다.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1600);
  const probe = await onStar();
  check("양보 계약을 잴 별이 있다", Boolean(probe), probe ? probe.id : "없음");
  if (probe) {
    const ndc = () => page.evaluate((id) => window.__universe.project(id, true), probe.id);
    await page.locator(".u-search input").click();
    await page.locator(".u-search input").type("카");
    const inBefore = await ndc();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await settle(300);
    const inAfter = await ndc();
    check("검색창 안에서는 화살표를 카메라가 가져가지 않는다",
      Math.abs(inAfter[1] - inBefore[1]) < 1e-6 && Math.abs(inAfter[0] - inBefore[0]) < 1e-6,
      `ndc ${inBefore.map((v) => v.toFixed(3))} → ${inAfter.map((v) => v.toFixed(3))}`);
    // 대조군 — 같은 키가 검색창 밖에서는 하늘을 움직인다(계약이 비어 있지 않다는 증거)
    // body 는 tabindex 가 없어 focus() 가 듣지 않는다 — 검색창에서 실제로
    // **빠져나와야** 대조군이 성립한다(첫 판은 초점이 입력에 남아 양성 케이스를
    // 못 만들었고, 그래서 대조군이 실패했다).
    await page.keyboard.press("Escape");
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await settle(200);
    const stillTyping = await page.evaluate(() => {
      const a = document.activeElement;
      return Boolean(a && ["INPUT", "TEXTAREA", "SELECT"].includes(a.tagName));
    });
    check("대조군을 위해 검색창에서 빠져나왔다", !stillTyping, `타이핑 자리=${stillTyping}`);
    const outBefore = await ndc();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await settle(300);
    const outAfter = await ndc();
    check("같은 화살표가 검색창 밖에서는 하늘을 움직인다 (대조군)",
      Math.abs(outAfter[1] - outBefore[1]) > 0.05,
      `ndc y ${outBefore[1].toFixed(3)} → ${outAfter[1].toFixed(3)}`);
  }
}

// ——— Escape 는 한 겹씩 닫는다 (2026-08-28) ———
// 앱 전체에서 Escape 를 듣는 곳이 검색 콤보박스 하나뿐이라, 카드와 작품 시트에는
// 닫는 키보드 경로가 아예 없었다.
console.log(`\nEscape 는 한 겹씩 닫는다`);
{
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(2600);
  await page.locator(".u-works button").first().click();
  await page.waitForTimeout(500);
  const sheetOpen = await page.locator('[data-testid="work-world"]').count();
  check("작품 시트가 열렸다", sheetOpen === 1, `${sheetOpen}장`);
  await page.evaluate(() => document.body.focus());
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const afterEsc = await page.locator('[data-testid="work-world"]').count();
  const stillLanded = await page.evaluate(() => new URLSearchParams(location.search).get("land"));
  check("Escape 가 작품 시트를 닫는다", afterEsc === 0, `${afterEsc}장`);
  check("그런데 작가를 떠나지는 않는다 (한 겹만 닫힌다)", stillLanded === "1", `land=${stillLanded}`);
  // 착륙은 Escape 가 벗기는 겹이 아니다 — 회랑에서 나가는 문은 이륙과 '원경으로'다.
  // (이 계약이 없으면 `!landedId` 조건을 지워도 아무것도 안 죽는다 — 스윕 생존.)
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const stillLanded2 = await page.evaluate(() => new URLSearchParams(location.search).get("land"));
  const stillA = await page.evaluate(() => new URLSearchParams(location.search).get("a"));
  check("시트를 닫은 뒤 한 번 더 눌러도 회랑에서 쫓겨나지 않는다",
    stillLanded2 === "1" && stillA === "franz-kafka", `land=${stillLanded2} · a=${stillA}`);

  // 착륙하지 않은 카드는 Escape 로 닫힌다
  await page.goto(url("?lens=movement&a=franz-kafka"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(2000);
  await page.evaluate(() => document.body.focus());
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const a2 = await page.evaluate(() => new URLSearchParams(location.search).get("a"));
  check("Escape 가 궤도 카드를 닫는다", a2 === null, `a=${a2}`);
}

// ——— 별에도 크기가 있다 (R12-g) ———
// 표현 사다리는 처음부터 거리의 함수였지만, 그 사다리를 **오를 수 있는 별은
// 셋뿐**이었다: 구로 분해되는 것은 `isLandable` 이 연 작가뿐이고, 100인 중
// 준비된 작가는 셋이다. 나머지 97개는 아무리 다가가도 같은 점이었다 —
// 실측(2189 → 379, 발광 폭 2~3px 고정). 크기는 내용에 대한 주장이 아니라
// 그 자리에 얼마나 있는가이므로, 준비도와 무관하다.
console.log(`\n별에도 크기가 있다`);
{
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1600);

  // 먼 하늘: 광휘가 바닥이므로 거리가 크게 변해도 크기는 그대로다.
  const far0 = await metrics();
  await roll(2);
  await settle(800);
  const far1 = await metrics();
  check("먼 하늘에서 별은 광도만 말한다 (크기가 거리를 따라가지 않는다)",
    far0.nearPx > 0 && far1.nearPx === far0.nearPx && far1.camR < far0.camR - 200,
    `${far0.nearPx}px 유지 · camR ${Math.round(far0.camR)} → ${Math.round(far1.camR)}`);

  // 다가가면 자란다. 같은 별을 계속 보고 있는 동안에만 잰다 — 가장 가까운
  // 별이 바뀌면 그것은 다른 별의 크기이지 자란 증거가 아니다.
  let grewId = null;
  let firstD = 0;
  let firstPx = 0;
  let lastD = 0;
  let lastPx = 0;
  for (let i = 0; i < 14; i++) {
    await roll(1, -320);
    await settle(420);
    const mm = await metrics();
    const id = mm.nearest[0];
    if (!id) continue;
    if (id !== grewId) {
      grewId = id;
      firstD = mm.nearest[1];
      firstPx = mm.nearPx;
      lastD = firstD;
      lastPx = mm.nearPx;
      continue;
    }
    if (mm.nearest[1] < lastD) {
      lastD = mm.nearest[1];
      lastPx = mm.nearPx;
    }
    if (lastPx > firstPx && lastD < firstD * 0.6) break;
  }
  check("다가간 별은 커진다 — 준비되지 않은 작가도",
    grewId !== null && lastPx > firstPx && lastD < firstD,
    `${grewId} · ${firstD} 단위 ${firstPx}px → ${lastD} 단위 ${lastPx}px`);
  check("커진 별이 화면을 통째로 덮지는 않는다", lastPx <= 128, `${lastPx}px`);
}


console.log(`\nconsole errors: ${consoleErrors.length}`);
if (consoleErrors.length) console.log(consoleErrors.slice(0, 4).join("\n"));

// ——— 관찰자 0번의 수리 (문 0 대역, 2026-08-28) ———
// 드래그가 텍스트 선택을 끌고 다니지 않는다 — 세계는 선택 불가, 읽는 표면만 글.
console.log(`\n관찰자 0번의 수리`);
{
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1200);
  // 캔버스에서 시작해 좌측 레일을 가로지르는 드래그 — 관찰 재현 그대로.
  await page.mouse.move(700, 300);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) { await page.mouse.move(700 - i * 50, 300); await page.waitForTimeout(8); }
  await page.mouse.up();
  const sel = await page.evaluate(() => window.getSelection()?.toString() ?? "");
  // 합성 입력은 캔버스 기점 선택을 항상 재현하지 못한다(변이 스윕 실측: 규칙을
  // 지워도 이 드래그만으론 선택 0) — 텍스트 기점 드래그를 대조군으로 함께 끈다:
  // user-select 규칙이 죽으면 이쪽이 반드시 글자를 문다.
  // 버튼은 크롬 기본이 선택 불가다 — 대조군은 **산문 단락**(레일 하단 설명문)을 문다.
  const para = await page.locator(".u-rail p, .u-lenses ~ p, .u-rail").last().boundingBox();
  const px0 = para ? para.x + 8 : 30;
  const py0 = para ? para.y + para.height - 30 : 700;
  await page.mouse.move(px0, py0);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(px0 + i * 18, py0 + i * 2); await page.waitForTimeout(8); }
  await page.mouse.up();
  const sel2 = await page.evaluate(() => window.getSelection()?.toString() ?? "");
  check("고개 드래그는 텍스트 선택을 그리지 않는다 (레일을 가로질러도·레일 위에서도)",
    sel.length === 0 && sel2.length === 0,
    sel.length + sel2.length ? `선택 ${sel.length}+${sel2.length}자` : "");
  // 대조군 — 카드의 산문은 여전히 긁어 인용할 수 있다.
  await page.evaluate(() => window.__universe.focus("franz-kafka"));
  await settle(1100);
  const canSelect = await page.evaluate(() => {
    const el = document.querySelector(".u-card p, .u-card .u-why, .u-card");
    if (!el) return false;
    return getComputedStyle(el).userSelect !== "none";
  });
  check("읽는 표면(카드)은 여전히 글로 남는다 — 인용은 독자의 권리 (대조군)", canSelect);
  await page.keyboard.press("Escape");
  await settle(400);
}

// ——— 내부 심사의 수리 (R13 적대 심사 ①~⑥) ———
// 심사가 계약 사각지대에서 잡은 것들 — 각 수리는 그 재현 절차 그대로를 계약으로 얻는다.
console.log(`\n내부 심사의 수리`);
{
  // ① 유령 드래그 — 크롬 위에서 뗀 손이 하늘에 붙지 않는다(포인터 캡처).
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
  const g0 = await onStar();
  check("유령 드래그 계약을 잴 별이 있다", Boolean(g0), g0 ? g0.id : "없음");
  if (g0) {
    await page.mouse.move(500, 400);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) { await page.mouse.move(500 - i * 40, 400); await page.waitForTimeout(8); }
    await page.mouse.up(); // 좌측 레일(0~250px) 위에서 뗀다
    await settle(300);
    const afterUp = await page.evaluate((x) => window.__universe.project(x), g0.id);
    await page.mouse.move(800, 500);
    for (let i = 1; i <= 10; i++) { await page.mouse.move(800 + i * 40, 500 + i * 10); await page.waitForTimeout(8); }
    await settle(300);
    const afterBare = await page.evaluate((x) => window.__universe.project(x), g0.id);
    check("크롬 위에서 뗀 뒤, 맨 마우스는 하늘을 끌지 않는다",
      Boolean(afterUp) && Boolean(afterBare) && Math.hypot(afterBare[0] - afterUp[0], afterBare[1] - afterUp[1]) < 6,
      afterUp && afterBare ? `이동 ${Math.round(Math.hypot(afterBare[0] - afterUp[0], afterBare[1] - afterUp[1]))}px` : "별이 화면 밖");
  }

  // ③ 딥링크는 별을 마주 보고 시작한다.
  await page.goto(url("?lens=movement&a=leo-tolstoy"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1500);
  const tq = await page.evaluate(() => window.__universe.project("leo-tolstoy"));
  const mmD = await metrics();
  check("딥링크 입구에서 그 별이 프레임 중앙권에 선다 (빈 하늘 아님)",
    Boolean(tq) && Math.hypot(tq[0] - 800, tq[1] - 500) < 380 && mmD.onScreenStars > 0,
    tq ? `별 (${Math.round(tq[0])},${Math.round(tq[1])}) · 별 ${mmD.onScreenStars}개` : "별이 화면 밖");

  // ② 도착 후의 클릭은 세계를 갈아끼우지 않는다.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
  let kq2 = await page.evaluate(() => window.__universe.project("franz-kafka"));
  for (let i = 0; i < 8 && !(kq2 && kq2[0] > 250 && kq2[0] < 1450 && kq2[1] > 80 && kq2[1] < 920); i++) {
    await drag(400, 0);
    kq2 = await page.evaluate(() => window.__universe.project("franz-kafka"));
  }
  check("도착-클릭 계약을 잴 카프카가 보인다", Boolean(kq2));
  if (kq2) {
    await page.mouse.move(kq2[0], kq2[1]);
    for (let i = 0; i < 26; i++) {
      await page.mouse.wheel(0, i < 6 ? -420 : -150);
      await page.waitForTimeout(110);
      const mm = await metrics();
      if (mm.nearest[0] === "franz-kafka" && mm.nearest[1] < 210) break;
    }
    await settle(600);
    const at2 = await page.evaluate(() => window.__universe.project("franz-kafka"));
    if (at2) await page.mouse.click(at2[0], at2[1]);
    await settle(900);
    const mmC = await metrics();
    check("코앞에서 골라도 착륙이 아니다 (stage 는 approach 에 머문다)",
      mmC.stage === "approach" && (await page.locator(".u-card").count()) === 1,
      `stage=${mmC.stage}`);
    check("코앞에서 골라도 행성이 벽이 되지 않는다 (렌즈 배율 = 필요의 함수)",
      mmC.nearPx < 420 && mmC.lensMag > 0.9 && mmC.lensMag < 7,
      `nearPx=${mmC.nearPx} · 배율 ${mmC.lensMag}`);
    // 표면 임계를 실제로 넘겨 본다 — 조준을 풀고(작은 드래그) 커서를 별 곁
    // 빈 하늘에 두면 STANDOFF 없이 더 다가갈 수 있다. 거기서 몸체가 화면
    // 22% 를 넘어도, 착륙하지 않았다면 칩은 착륙이 아니어야 한다(심사② —
    // 두 규칙이 서로를 가려 변이가 생존했던 자리).
    await drag(30, 0);
    const at3 = await page.evaluate(() => window.__universe.project("franz-kafka"));
    if (at3) {
      await page.mouse.move(at3[0] + 70, at3[1]);
      for (let i = 0; i < 30; i++) {
        await page.mouse.wheel(0, -90);
        await page.waitForTimeout(80);
        const mm = await metrics();
        if (mm.nearest[0] === "franz-kafka" && mm.nearest[1] < 65) break;
      }
      await settle(400);
      const at4 = await page.evaluate(() => window.__universe.project("franz-kafka"));
      if (at4) await page.mouse.click(at4[0], at4[1]);
      await settle(700);
      const mmS = await metrics();
      check("몸체가 화면을 채워도 착륙 없이는 착륙 칩이 서지 않는다",
        mmS.nearest[1] < 90 && mmS.stage !== "surface",
        `d=${Math.round(mmS.nearest[1])} stage=${mmS.stage}`);
    }
    await page.keyboard.press("Escape");
    await settle(500);
  }

  // ⑥ 미준비 별의 코앞도 접근이다 — 계기끼리 모순되지 않는다.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
  let bq = await page.evaluate(() => window.__universe.project("jorge-luis-borges"));
  for (let i = 0; i < 8 && !(bq && bq[0] > 250 && bq[0] < 1450 && bq[1] > 80 && bq[1] < 920); i++) {
    await drag(400, 0);
    bq = await page.evaluate(() => window.__universe.project("jorge-luis-borges"));
  }
  if (bq) {
    await page.mouse.move(bq[0], bq[1]);
    for (let i = 0; i < 26; i++) {
      await page.mouse.wheel(0, i < 6 ? -420 : -150);
      await page.waitForTimeout(110);
      const mm = await metrics();
      if (mm.nearest[0] === "jorge-luis-borges" && mm.nearest[1] < 300) break;
    }
    await settle(500);
    const mmB = await metrics();
    check("미준비 별의 코앞에서 칩은 접근이다 (스트립과 모순되지 않는다)",
      mmB.stage === "approach", `stage=${mmB.stage} d=${Math.round(mmB.nearest[1])}`);
  } else {
    check("칩-접근 계약을 잴 보르헤스가 보인다", false, "없음");
  }

  // ④·⑤ 회랑 — 벽은 하늘이 아니고, 이름표는 드래그를 삼키지 않는다.
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1600);
  await drag(700, 0, 300, 520);
  await drag(700, 0, 300, 520);
  const mmW = await metrics();
  check("서가를 마주 보면 벽 뒤의 이름이 접힌다 (벽은 하늘이 아니다)",
    mmW.occludedNeighbors >= 1, `접힌 이름 ${mmW.occludedNeighbors}`);
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1600);
  const slip = await page.locator(".globe-label--work").first().boundingBox().catch(() => null);
  check("드래그-삼킴 계약을 잴 슬립이 있다", Boolean(slip));
  if (slip) {
    const y0 = (await metrics()).look[0];
    await drag(320, 0, slip.x + slip.width / 2, slip.y + slip.height / 2);
    const y1 = (await metrics()).look[0];
    check("이름표 위에서 시작한 드래그도 고개다 (라벨이 삼키지 않는다)",
      Math.abs(y1 - y0) >= 12, `yaw ${y0}° → ${y1}°`);
  }
}

// ——— 관측창 프레임 (R13-d) ———
// 배는 창의 가장자리로 존재한다 — 하늘에서 서고, 표면에서 걷는 몸에게 물러난다.
console.log(`\n관측창 프레임 (R13-d)`);
{
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1200);
  check("하늘에서 관측창 코너가 선다 (4점)",
    (await page.locator(".u-hull i").count()) === 4);
  check("관측창은 손을 막지 않는다 (pointer-events 없음)",
    (await page.evaluate(() => getComputedStyle(document.querySelector(".u-hull")).pointerEvents)) === "none");
  await page.goto(url("?lens=movement&a=franz-kafka&land=1"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1500);
  const mmH = await metrics();
  check("표면에서는 관측창이 물러난다 (걷는 몸에게 창이 없다)",
    mmH.stage === "surface" && (await page.locator(".u-hull").count()) === 0,
    `stage=${mmH.stage}`);
}

// ——— 몸의 회랑 · 몸이 남는 클릭 (R13-c) ———
// 문 0 2차의 처방들: 고르기·덮기는 몸을 옮기지 않고, 검색만이 데려가고,
// 착륙은 행성이 자라는 것이 **보이는** 여정이고, 회랑의 몸은 서가를 마주 본다.
console.log(`\n몸의 회랑 · 몸이 남는 클릭 (R13-c)`);
{
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
  // 카드를 덮어도 몸은 그 자리다
  const e0 = await onStar();
  check("덮기 계약을 잴 별이 있다", Boolean(e0), e0 ? e0.id : "없음");
  if (e0) {
    await page.mouse.click(e0.q[0], e0.q[1]);
    await settle(900);
    const rPicked = (await metrics()).camR;
    check("고른 뒤에도 카드가 열려 있다", (await page.locator(".u-card").count()) === 1);
    await page.keyboard.press("Escape");
    await settle(700);
    const rClosed = (await metrics()).camR;
    check("카드를 덮어도 몸은 그 자리다 (Escape = 덮기, 순간이동 아님)",
      (await page.locator(".u-card").count()) === 0 && Math.abs(rClosed - rPicked) < 20,
      `camR ${rPicked} → ${rClosed}`);
  }
  // 검색은 명시적 이동 요청 — 배가 데려간다
  await page.locator(".u-search input").fill("카프카");
  await page.waitForTimeout(250);
  const hitBtn = page.locator(".u-search__hits button").first();
  const hasHit = (await hitBtn.count()) === 1;
  check("검색이 카프카를 찾는다", hasHit);
  if (hasHit) {
    await hitBtn.click();
    await settle(2200);
    const mS = await metrics();
    check("검색은 데려간다 (관측 렌즈 거리로의 정직한 비행)",
      Math.abs(mS.dist - 1200) < 80 && (await page.locator(".u-card").count()) === 1,
      `dist=${mS.dist}`);
  }
  // 멀리서 골라도 첫 휠이 카드를 뺏지 않는다 — 떠남의 자는 고른 자리다.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
  const far0 = await onStar();
  check("먼 선택 계약을 잴 별이 있다", Boolean(far0), far0 ? far0.id : "없음");
  if (far0) {
    await page.mouse.click(far0.q[0], far0.q[1]);
    await settle(900);
    const dSel = (await metrics()).dist;
    await roll(1);
    await settle(400);
    check("멀리서 골라도 첫 휠에 카드를 잃지 않는다 (떠남의 자 = 고른 자리 × 1.35)",
      dSel > 1900 && (await page.locator(".u-card").count()) === 1,
      `고른 거리 ${dSel}`);
    await page.keyboard.press("Escape");
    await settle(400);
  }

  // 착륙은 행성이 자라는 여정이다 — 워프가 아니라.
  await page.goto(url("?lens=movement"), { waitUntil: "load" });
  await page.waitForFunction(() => window.__universe !== undefined);
  await settle(1400);
  await page.evaluate(() => window.__universe.land("franz-kafka"));
  // 워프의 정의는 거리의 붕괴다 — 220ms 표본 사이 거리비가 유계이면 접근은
  // 연속이고, 행성은 그 연속 위에서 자란다(크로스페이드 창 2×와 함께).
  const dists = [];
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(220);
    const mm = await metrics();
    if (mm.nearest[0] === "franz-kafka" && Number.isFinite(mm.nearest[1])) dists.push(mm.nearest[1]);
    if (mm.stage === "surface" && mm.foldK === 1) break;
  }
  await settle(1200);
  let maxRatio = 1;
  for (let i = 1; i < dists.length; i++) {
    if (dists[i] > 0 && dists[i - 1] > dists[i]) maxRatio = Math.max(maxRatio, dists[i - 1] / dists[i]);
  }
  const totalRatio = dists.length >= 2 ? dists[0] / Math.max(1, dists[dists.length - 1]) : 0;
  check("착륙은 연속 접근이다 (표본 6+ · 총 접근비 20+ — 순간이동 없음)",
    dists.length >= 6 && totalRatio > 20, `표본 ${dists.length} · 총비 ${Math.round(totalRatio)}`);
  // 한계 5.5: 로그 보간 × 3차 이징의 첨두(≈3×)가 정상 상한이고, 옛 고정
  // 1.4초 워프는 스텝비 ~17 로 확실히 이 밖이다.
  check("한 표본 사이 거리비 ≤ 5.5 (워프 아님)",
    dists.length >= 6 && maxRatio <= 5.5, `최대 스텝비 ${maxRatio.toFixed(2)}`);
  // 회랑의 몸 — 서가를 마주 볼 수 있고, 서가는 읽을 수 있는 거리에 있다.
  const mc = await metrics();
  check("회랑에 서 있다", mc.stage === "surface" && mc.walkYear !== null, `stage=${mc.stage}`);
  check("몸은 서가에서 책 2.45권 거리에 선다 (넓은 화면)",
    Math.abs(mc.standLat - 2.45) < 0.06, `standLat=${mc.standLat}`);
  // 왼쪽 밖은 이벤트가 잘리고 오른쪽(x>1200)은 착륙 카드 위다 — 왼쪽 캔버스에서
  // 시작해 오른쪽으로 끈다(계약은 |요|만 잰다: 몸이 90° 가까이 돌 수 있는가).
  await drag(700, 0, 300, 520);
  await drag(700, 0, 300, 520);
  const mLook = await metrics();
  check("고개가 서가를 정면으로 마주 본다 (요 ≥ 80°, 옛 클램프 62° 너머 · 새 한계 88°)",
    Math.abs(mLook.look[0]) >= 80 && Math.abs(mLook.look[0]) <= 88, `yaw=${mLook.look[0]}°`);
  check("한 칸의 명패는 셋을 넘지 않는다 — 카프카 1913(사건 4)이 둘+접힘으로 선다",
    mc.slipMaxPerYear <= 3 && mc.slipFolded >= 1,
    `최대 ${mc.slipMaxPerYear}/칸 · 접힘 ${mc.slipFolded}`);
}

console.log(`\n${passed} passed \u00b7 ${failed} failed`);
await browser.close();
server.close();
process.exit(failed || consoleErrors.length ? 1 : 0);
