#!/usr/bin/env python3
"""Mutation sweep: do the star-system contracts actually have teeth?

MAINTAINER TOOL, NOT CI. Patches files under `literary-planet/src/universe/`
(and one component) in place, runs the contract suite, and records whether any
test caught the change. Run it manually from the repo root:

    python3 scripts/universe-mutation-sweep.py            # fast lane only
    python3 scripts/universe-mutation-sweep.py --browser  # + journey contracts

A SURVIVED mutation is an uncovered guarantee: the suite stays green while the
prototype silently loses that behaviour.

Why this file exists: two contract tests in this very suite were measured as
false positives (2026-08-20). The multi-membership test asserted
`v.length >= 1`, which passes when an author belongs to exactly one group; the
direction-preservation test asserted `lensCompress(500) === lensCompress(500)`,
which is determinism and says nothing about direction. Both were written by the
same author who wrote the code, and both were caught by a reader, not by the
suite. Coverage that is asserted rather than measured is how that happens, and
this file is the measurement.

**Restores from an in-memory copy, not from git** — same discipline as
scripts/gap-fixture-mutation-sweep.py, and for the same measured reason: a git
restore silently eats uncommitted edits to the target.

Interrupt-safe: restore runs in `finally` and is also registered with `atexit`.
"""
import argparse
import atexit
import pathlib
import subprocess
import sys

# Resolve the repo from this file's own location (`<repo>/scripts/`), not from
# `git rev-parse`. The review bundle ships the tree as `git archive` output,
# which carries no `.git`, so the git call died at import time — before argparse
# — and took both `npm run universe:mutation-sweep` and reproduce.mjs's
# `mutation-fast` step with it. Worse, unzipping inside *some other* checkout
# made rev-parse succeed and the sweep would have patched files under the wrong
# toplevel. `__file__` resolves identically in-repo and in the unzipped tree.
REPO = str(pathlib.Path(__file__).resolve().parent.parent)
LP = f"{REPO}/literary-planet"

G = "src/universe/grammar.ts"
L = "src/universe/lenses.ts"
P = "src/universe/personal.ts"
R = "src/universe/readiness.ts"
S = "src/universe/scene.ts"
C = "src/universe/components/OrbitCard.tsx"

# (lane, name, file, needle, replacement)
MUTATIONS = [
    # --- 표현 사다리: 거리의 함수라는 계약 --------------------------------
    ("fast", "star→disc 임계를 3px 로 되돌린다 (하늘이 검게 죽던 회귀)", G,
     "export const STAR_TO_DISC_PX = 7;", "export const STAR_TO_DISC_PX = 3;"),
    ("fast", "surface 임계를 화면의 90% 로 (지각을 영영 안 칠함)", G,
     "if (apparentPx < viewportH * 0.22) return \"resolved\";",
     "if (apparentPx < viewportH * 0.9) return \"resolved\";"),
    ("fast", "착륙 고도를 1.5r → 30r (천체가 점으로 남음)", G,
     "export const LANDING_ALT = 1.5;", "export const LANDING_ALT = 30;"),

    # --- 광도 = 영향력 -----------------------------------------------------
    ("fast", "tier 항 제거 (모든 작가가 같은 광도)", G,
     "return TIER_BASE[tier] * (1 + 0.3 * degreeHat);", "return 1 * (1 + 0.3 * degreeHat);"),
    ("fast", "관계 차수 항 제거", G,
     "return TIER_BASE[tier] * (1 + 0.3 * degreeHat);", "return TIER_BASE[tier];"),
    ("fast", "별 크기를 광도와 무관한 상수로", G,
     "return 6.5 + mag * 16;", "return 12;"),
    ("fast", "천체 반경을 광도와 무관한 상수로", G,
     "return 0.85 + mag * 1.75;", "return 1.7;"),

    # --- 시간: 탄생·활동·잔광 ---------------------------------------------
    ("fast", "사후 잔광 제거 (작가가 죽으면 별도 사라짐)", G,
     "return { presence: 0.42, afterglow: true };", "return { presence: 0, afterglow: false };"),
    ("fast", "탄생 이전에도 별이 존재", G,
     "if (year < born) return { presence: 0, afterglow: false };",
     "if (year < born) return { presence: 1, afterglow: false };"),

    # --- 실루엣 = 장르, 진폭 상한 -----------------------------------------
    ("fast", "실루엣 진폭 상한 6% → 60% (실루엣이 광도를 흉내냄)", G,
     "export const SILHOUETTE_AMP = 0.06;", "export const SILHOUETTE_AMP = 0.6;"),
    ("fast", "장르 구분 제거 (모든 천체가 같은 모양)", G,
     "return SILHOUETTE_GENRES.map((k) => (g.has(k) ? 1 / Math.sqrt(n) : 0)) as unknown as [",
     "return SILHOUETTE_GENRES.map(() => 0.5) as unknown as ["),

    # --- 관측 렌즈: 압축과 방향 보존 --------------------------------------
    ("fast", "압축 없음 (이웃이 그대로 멀리 있음)", G,
     "return LENS_MIN + (LENS_MAX - LENS_MIN) * Math.sqrt(t);", "return d;"),
    ("fast", "모든 이웃을 같은 반경에 (거리 정보 소멸)", G,
     "return LENS_MIN + (LENS_MAX - LENS_MIN) * Math.sqrt(t);", "return LENS_MIN;"),
    ("fast", "방향 보존 파괴 — 고정 축으로 밀어냄", G,
     "return [focus[0] + dx * r, focus[1] + dy * r, focus[2] + dz * r];",
     "return [focus[0] + lensCompress(d, dMin, dMax), focus[1], focus[2]];"),
    ("fast", "초점 자신이 움직임", G,
     "if (d === 0) return [focus[0], focus[1], focus[2]];",
     "if (d === 0) return [focus[0] + 50, focus[1], focus[2]];"),

    # --- 관측층: 색인이지 성좌가 아니다 -----------------------------------
    ("fast", "속성 렌즈가 다시 선을 그린다 (MST 부활)", L,
     "    // 선은 그리지 않는다. 소속은 색인 번호로만.",
     "    for (const [a, b] of chain(members, positions)) lines.push({ a, b, color, weight: 0.72 });"),
    ("fast", "범례에 없는 색인 번호를 부여 (⑨~⑬ 미아)", L,
     "    index += 1;", "    index += 2;"),
    ("fast", "다중 소속을 하나로 접음", L,
     "      if (cur) cur.push(index);", "      if (cur) { /* drop */ }"),
    ("fast", "관계 렌즈가 유형을 무시하고 전부 그림", L,
     "      if (r.type !== want) continue;", "      if (false) continue;"),
    ("fast", "망명 렌즈가 이력 없는 작가까지 포함", L,
     "      keys = a.locations.some((l) => l.role === \"exile\") ? [\"exile\"] : [];",
     "      keys = [\"exile\"];"),
    ("fast", "언어 이름 사전에서 한 항목 제거 (미해독 라벨)", L,
     "  ur: \"우르두어\",", ""),

    # --- 착륙 준비도: 추론이 아니라 기록 ----------------------------------
    ("fast", "준비도 무시 — 전원 착륙 허용", R,
     "  return readinessState(authorId) === \"ready\";", "  return true;"),
    ("fast", "기재되지 않은 작가의 기본값을 ready 로", R,
     "  return byId.get(authorId)?.state ?? READINESS.default;",
     "  return byId.get(authorId)?.state ?? \"ready\";"),

    # --- 개인 성좌와 추천 --------------------------------------------------
    ("fast", "추천 갈래를 하나로 합침 (단일 점수 회귀)", P,
     "  return tracks.filter((t) => t.items.length > 0);",
     "  return tracks.filter((t) => t.items.length > 0).slice(0, 1);"),
    ("fast", "낯선 지역 갈래가 이미 읽은 지역도 추천", P,
     "  const unfamiliar: Recommendation[] = takeFresh(\n    candidates\n      .filter((a) => gapRank(a) > 0)",
     "  const unfamiliar: Recommendation[] = takeFresh(\n    candidates\n      .filter(() => true)"),
    ("fast", "추천에서 근거 문장 제거 (블랙박스)", P,
     "    reasons: [`${viaNames(a.id)}와 이어져 있다`, ...wanted(a.id)]", "    reasons: []"),
    ("fast", "이미 읽은 작가를 다시 추천", P,
     "  const candidates = authors.filter((a) => !read.has(a.id));", "  const candidates = authors;"),
    ("fast", "공유 링크가 궤도(want)를 잃음", P,
     "  const w = Object.keys(p.want).join(\",\");", "  const w = \"\";"),
    ("fast", "읽은 순서가 뒤섞임", P,
     "    .sort((a, b) => a[1] - b[1])", "    .sort((a, b) => b[1] - a[1])"),

    # --- 브라우저 계약 (verify-journey) -----------------------------------
    ("browser", "착륙 버튼을 전원에게 노출 (백지 착륙 회귀)", C,
     "        {p.landable ? (\n          <button className=\"u-btn u-btn--land\" onClick={p.onLand} data-testid=\"land\">\n            착륙\n          </button>\n        ) : null}",
     "        <button className=\"u-btn u-btn--land\" onClick={p.onLand} data-testid=\"land\">\n          착륙\n        </button>"),
    # 준비도 게이트는 표현 사다리 **한 곳**에만 있다. 이중으로 두었더니 두
    # 게이트가 서로를 가려 어느 한쪽을 지워도 계약이 초록으로 남았다.
    ("browser", "표현 사다리에서 준비도 게이트 제거 (미준비 작가가 구로 분해)", S,
     "      const rep: typeof REP_STAR | \"resolved\" | \"surface\" = isLandable(id)\n        ? representationFor(ap, h)\n        : REP_STAR;",
     "      const rep: typeof REP_STAR | \"resolved\" | \"surface\" = representationFor(ap, h);"),
    ("browser", "지각을 영영 칠하지 않음", S,
     "          if (ap > 60) this.paintCrust(body);", "          if (false) this.paintCrust(body);"),
    ("browser", "발명된 얼굴 초상이 돌아옴 (상상 초상 자산을 다시 가져온다)", C,
     "      <canvas ref={ref} width={96} height={96} aria-hidden=\"true\" />",
     "      <img src={`${import.meta.env.BASE_URL}portraits/${author.id}.jpg`} alt=\"\" />"),
    ("browser", "카드가 입문 순서에 나머지 작품을 이어 붙인다 (큐레이션 위장 회귀)", C,
     "          {ordered.map((w, i) => (",
     "          {[...ordered, ...rest].map((w, i) => ("),
    ("browser", "입문 경로 밖 작품 절이 사라진다", C,
     "        {rest.length ? (", "        {false ? ("),
    ("browser", "카드 제목이 다시 \"독서 순서\"를 주장한다", C,
     "        <h3>입문 순서 {ordered.length}</h3>", "        <h3>독서 순서 {ordered.length}</h3>"),
    # ——— R11-d 시각 문법 계약 ———
    ("browser", "실물 초판이 없는 작품도 표지를 정면으로 세운다 (부재가 형태로 안 읽힘)", S,
     "    if (!coverFile) root.rotation.y = -Math.PI / 2;",
     "    if (false) root.rotation.y = -Math.PI / 2;"),
    ("browser", "책등을 돌리는 부호가 뒤집힌다 (앞마구리를 책등이라 부름)", S,
     "    if (!coverFile) root.rotation.y = -Math.PI / 2;",
     "    if (!coverFile) root.rotation.y = Math.PI / 2;"),
    ("browser", "책등판과 앞마구리 재질이 뒤바뀐다", S,
     "    const spine = new THREE.Mesh(new THREE.BoxGeometry(t, bh, bd), [\n      spineMat,\n      boardMat,",
     "    const spine = new THREE.Mesh(new THREE.BoxGeometry(t, bh, bd), [\n      boardMat,\n      spineMat,"),
    ("browser", "작품 배치가 연도를 무시한다 (황금각 시절로 회귀)", S,
     "      const theta = lons[i] as number;", "      const theta = 0;"),
    ("browser", "최소 간격을 없앤다 (인접 연도의 두 권이 관통)", G,
     "export const VOL_AIR = 1.32;", "export const VOL_AIR = 0.0;"),
    ("browser", "최소 간격 강제 자체를 걷어낸다 (비례만 남는다)", G,
     "  for (let i = 1; i < n; i++) pos[i] = Math.max(pos[i] as number, (pos[i - 1] as number) + minGap);",
     "  // min-gap pass removed"),
    ("browser", "두 단을 한 단으로 합친다 (입문 경로가 안 보임)", G,
     "export const SHELF_ROW_LAT = (17 * Math.PI) / 180;",
     "export const SHELF_ROW_LAT = 0;"),
    ("browser", "사입각을 10° 로 되돌린다 (책이 위에서 눌려 판으로 읽힘)", G,
     "export const LANDING_INCIDENCE_DEG = 64;", "export const LANDING_INCIDENCE_DEG = 10;"),
    ("browser", "권마다 제 자리의 법선으로 세운다 (부챗살로 벌어짐)", S,
     "      const up = (c.obj.userData.up ?? c.obj.userData.dir) as THREE.Vector3 | undefined;",
     "      const up = c.obj.userData.dir as THREE.Vector3 | undefined;"),
    ("browser", "서가 부속을 상수 반경에 놓는다 (실루엣이 부푼 쪽에서 묻힘)", S,
     "      rec.center.clone().addScaledVector(d, rec.radius * (silhouetteRadius(harm, d.x, d.y, d.z) + lift));",
     "      rec.center.clone().addScaledVector(d, rec.radius * (1 + lift));"),
    ("browser", "난간과 눈금을 그리지 않는다", S,
     "    for (const inOrder of [true, false]) {", "    for (const inOrder of []) {"),
    ("browser", "난간은 남기고 연도 눈금만 없앤다 (축이 사라지는데 부속 수는 그대로)", S,
     "      if (!inOrder) continue;", "      if (true) continue;"),
    ("browser", "눈금 단위가 퇴화해 눈금이 한 개도 안 놓인다", G,
     "  for (const s of [1, 2, 5, 10, 20, 50, 100]) if (span / s <= 6) return s;",
     "  for (const s of []) if (span / s <= 6) return s;"),
    ("browser", "입문 경로 밖의 권에도 순서 숫자를 단다", S,
     "          text: c.orderIndex >= 0 ? `${c.orderIndex + 1} ${work.titleKo}` : work.titleKo,",
     "          text: `${Math.abs(c.orderIndex) + 1} ${work.titleKo}`,"),
    ("browser", "착륙 패널의 마크를 폭으로만 묶는다 (세로 자산이 카드를 뚫음)",
     "src/universe/universe.css",
     "  max-height: 116px;", "  max-height: 9999px;"),
    ("browser", "마크에 반전 필터를 되돌린다 (붉은 낙관이 청록으로)",
     "src/universe/universe.css",
     "  object-fit: contain;\n}", "  object-fit: contain;\n  filter: invert(1);\n}"),
    ("browser", "입문 순서를 라벨에서 지운다 (순서 숫자 없음)", S,
     "          text: c.orderIndex >= 0 ? `${c.orderIndex + 1} ${work.titleKo}` : work.titleKo,",
     "          text: work.titleKo,"),
    ("browser", "서가가 다시 원 숫자 ①②③ 를 단다 (색인 글리프와 이중 의미 회귀)", S,
     "          text: c.orderIndex >= 0 ? `${c.orderIndex + 1} ${work.titleKo}` : work.titleKo,",
     "          text: c.orderIndex >= 0 ? `${indexGlyph(c.orderIndex + 1)} ${work.titleKo}` : work.titleKo,"),
    # ——— R11-e: 파일럿·모의 심사가 잡은 것들 ———
    ("browser", "'하늘로'가 출발 구도가 아니라 현재 접근각으로 돌아간다 (4/4 가 출발 별을 잃던 회귀)", S,
     "    if (approachOverride) approach = approachOverride;", "    // approach override removed"),
    ("browser", "검색창 Enter 가 다시 아무 일도 하지 않는다", "src/universe/UniverseApp.tsx",
     "              if (e.key === \"Enter\" && hits[0]) {", "              if (false && hits[0]) {"),
    ("browser", "책등 정면 권의 클릭 프록시를 뗀다 (책등 25px 만 맞던 회귀)", S,
     "      group.add(proxy);", "      // proxy removed"),
    ("browser", "초점 원반에 걸치는 별 이름을 다시 원반 위에 찍는다", S,
     "          if (Math.hypot(nx - disc.cx, ny - disc.cy) < disc.r) {",
     "          if (false) {"),
    ("browser", "착륙한 천체의 관계선이 표면에서 기둥으로 다시 선다", S,
     "      if (landed && (l.a === landed || l.b === landed)) continue;", "      // skip removed"),
    ("browser", "범례 지목이 다시 이웃 등록부(놋쇠 기준선)를 빌린다", S,
     "                : inGroupFocus\n                  ? \"listed\"", "                : inGroupFocus\n                  ? \"neighbor\""),
    ("browser", "읽음 표시가 저장되지 않는다", "src/universe/UniverseApp.tsx",
     "    if (personalReady && !shared) savePersonal(personal);", "    if (false) savePersonal(personal);"),
    ("browser", "공유 성좌를 연 브라우저에 빈 성좌가 기록된다 (로드 전 저장 회귀)", "src/universe/UniverseApp.tsx",
     "    if (personalReady && !shared) savePersonal(personal);", "    if (!shared) savePersonal(personal);"),
    ("browser", "착륙 표면 원장에 표면에 없는 기록 사진 행이 돌아온다", "src/universe/assets.ts",
     "  const archival = art.archival[authorId];\n  if (archival) jobs.push(load(archival.file).then((i) => (set.archival = i)).catch(() => null));",
     "  const a0 = take(\"기록 사진\", art.archival[authorId]);\n  if (a0) jobs.push(a0.then((i) => (set.archival = i)).catch(() => null));"),
    ("browser", "모르는 ?lens= 값을 그대로 캐스트한다 (빈 #root 회귀)", "src/universe/UniverseApp.tsx",
     "    else if (l && LENSES.some((d) => d.id === l)) setLensId(l as LensId);", "    else if (l) setLensId(l as LensId);"),
    ("browser", "조작된 공유 링크의 모르는 ID 를 그대로 센다", P,
     "    return onlyKnown(out, known);", "    return out;"),
    ("browser", "착륙 중에도 색인 범례가 남는다 (1 2 3 옆에 ①②③)", "src/universe/UniverseApp.tsx",
     "          {lens && lens.groups.length && !landedId ? (", "          {lens && lens.groups.length ? ("),
    ("browser", "준비도 문장이 다시 동어반복 '기준 4/4' 로 돌아간다", C,
     "            문구 검수 {p.readiness?.verifiedAt ?? \"완료\"}", "            기준 {p.readiness?.met.length ?? 0}/4 충족"),
    ("browser", "전환마다 포커스가 <body> 로 떨어진다", "src/universe/UniverseApp.tsx",
     "    sel?.focus({ preventScroll: true });", "    // focus management removed"),
    ("browser", "착륙해도 화면의 위쪽이 월드 상방이다 (서가가 뒤집힘)", S,
     "      toUp = this.arrivalDir(target.clone().normalize(), SHELF_AXIS_DEG);",
     "      toUp = new THREE.Vector3(0, 1, 0);"),
    ("browser", "자산 사전 로드 없이 착륙한다", "src/universe/UniverseApp.tsx",
     "    if (assets?.authorId !== pendingLand) return; // 자산을 기다린다", "    // waits removed"),
    ("browser", "프로비넌스를 표면에서 감춘다", "src/universe/UniverseApp.tsx",
     "          {assets && assets.provenance.length ? (", "          {false ? ("),
    ("browser", "하늘 라벨에 종이 판이 돌아온다", "src/universe/scene.ts",
     "          state,\n          ground: \"sky\",", "          state,\n          ground: \"crust\","),
    ("browser", "작품 도시가 사라짐", S,
     "    works.forEach((w, i) => {", "    works.slice(0, 0).forEach((w, i) => {"),
    # --- 관계 인과성 (R12): 선은 왜 그어졌는가 -----------------------------
    ("fast", "방향 글리프가 항상 → (상대가 출발점이어도)", "src/universe/relations.ts",
     "  return rel.sourceId === selfId ? \"→\" : \"←\";", "  return \"→\";"),
    ("fast", "친연·대비에도 화살표가 붙는다 (방향 없는 관계가 방향을 얻음)", "src/universe/relations.ts",
     "  if (rel.direction === \"bidirectional\") return \"↔\";", "  if (false) return \"↔\";"),
    ("fast", "근거 등급 정렬이 사라진다", "src/universe/relations.ts",
     "    const e = EVIDENCE_RANK[y.rel.evidenceLevel] - EVIDENCE_RANK[x.rel.evidenceLevel];",
     "    const e = 0;"),
    ("fast", "캡션이 도착 → 출발로 뒤집힌다", "src/universe/relations.ts",
     "glyph === \"→\" ? `${self} → ${other}` : `${other} → ${self}`",
     "glyph === \"→\" ? `${other} → ${self}` : `${self} → ${other}`"),
    ("browser", "카드의 관계 행에서 요약문이 빠진다", C,
     "                    {rel.summary}\n", "                    {\"\"}\n"),
    ("browser", "근거 등급이 코드 값으로 샌다", C,
     "                      {EVIDENCE_KO[rel.evidenceLevel] ?? rel.evidenceLevel}",
     "                      {rel.evidenceLevel}"),
    ("browser", "카드의 관계 행에 방향 글리프가 없다", C,
     "                  data-direction={glyph}", "                  data-direction=\"\""),
    ("browser", "화살촉이 출발 끝에 놓인다", S,
     "      tip.copy(pb).addScaledVector(d, -margin);", "      tip.copy(pa).addScaledVector(d, margin);"),
    ("browser", "방향 없는 선에도 화살촉이 붙는다", S,
     "      if (mesh === this.egoLines && l.directed) this.egoDirected.push(", "      if (mesh === this.egoLines) this.egoDirected.push("),
    ("browser", "화살촉이 전부 사라진다", S,
     "      if (len < margin + size * 1.5) continue;", "      if (len < margin + size * 1.5 || true) continue;"),
    ("browser", "이웃 호버에 관측 일지가 뜨지 않는다", "src/universe/UniverseApp.tsx",
     "        onHoverAuthor: (id) => setHoverId(id),", "        onHoverAuthor: () => undefined,"),
    # --- 작품 세계 (R12): 책을 눌러 얻는 것이 한 문장을 넘는가 ----------------
    ("browser", "여는 문장의 번역이 자체 번역 표시를 잃는다", "src/universe/components/WorkSheet.tsx",
     "여는 문장 · 자체 번역", "여는 문장"),
    ("browser", "판본 행이 시트에서 빠진다", "src/universe/components/WorkSheet.tsx",
     "            {w.editions.map((e, i) => (", "            {w.editions.slice(0, 0).map((e, i) => ("),
    ("browser", "유고 행이 모든 작품에 선다", "src/universe/components/WorkSheet.tsx",
     "          {w.posthumous ? (", "          {w.posthumous || true ? ("),
    ("browser", "원문 대신 번역이 원문 자리에 선다", "src/universe/components/WorkSheet.tsx",
     "              {w.opening.original}", "              {w.opening.ko}"),
    ("browser", "미준비 작가의 카드에서 서명 기록이 빠진다 (4단으로 회귀)", C,
     "        ) : mark ? (", "        ) : false ? ("),
    ("fast", "판본 연도가 발표 연도보다 앞서도 통과한다", "src/data/assemble.ts",
     "        if (e.year < w.year)", "        if (false)"),
    ("fast", "유고 주장이 사망 전 초판에도 통과한다", "src/data/assemble.ts",
     "        if (a.deathYear === undefined || (first && first.year <= a.deathYear))", "        if (false)"),
]


def run(cmd, cwd=LP):
    return subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--browser", action="store_true", help="also run the journey contracts (slow)")
    args = ap.parse_args()

    lanes = {"fast"} | ({"browser"} if args.browser else set())
    cases = [m for m in MUTATIONS if m[0] in lanes]

    originals = {}
    for _, _, rel, _, _ in cases:
        path = f"{LP}/{rel}"
        if path not in originals:
            originals[path] = open(path, encoding="utf-8").read()

    def restore():
        for path, text in originals.items():
            try:
                if open(path, encoding="utf-8").read() != text:
                    open(path, "w", encoding="utf-8").write(text)
            except OSError:
                pass

    atexit.register(restore)

    if args.browser:
        print("browser lane: building the baseline dist once…")
        b = run("npm run build")
        if b.returncode != 0:
            print(b.stdout[-1500:], b.stderr[-1500:])
            sys.exit("baseline build failed")

    survived, killed, broken = [], [], []
    try:
        for lane, name, rel, needle, repl in cases:
            path = f"{LP}/{rel}"
            text = originals[path]
            if needle not in text:
                broken.append((name, f"needle not found in {rel}"))
                print(f"  ??  {name}\n      needle not found in {rel} — mutation is stale")
                continue
            open(path, "w", encoding="utf-8").write(text.replace(needle, repl, 1))
            try:
                if lane == "fast":
                    res = run("npx vitest run tests/universe.test.ts --pool=forks")
                    caught = res.returncode != 0
                else:
                    build = run("npm run build")
                    if build.returncode != 0:
                        caught = True  # a type error is a caught mutation
                    else:
                        res = run("node art-r11/verify-journey.mjs")
                        caught = res.returncode != 0
            finally:
                open(path, "w", encoding="utf-8").write(text)
            (killed if caught else survived).append(name)
            print(f"  {'✓ KILLED  ' if caught else '✗ SURVIVED'} [{lane}] {name}")
    finally:
        restore()
        if args.browser:
            # 마지막 변이가 만든 dist 가 남으면 이후 검증이 유령 실패를 낸다
            # (실측: 스윕 직후 여정 계약이 88/3 로 나왔고 원인은 오염된 dist).
            print("restoring the baseline dist…")
            run("npm run build")

    print(f"\nkilled {len(killed)} · survived {len(survived)} · stale {len(broken)}")
    if survived:
        print("\nSURVIVED — 계약이 비어 있는 자리:")
        for s in survived:
            print(f"  · {s}")
    if broken:
        print("\nSTALE — 코드가 바뀌어 변이가 적용되지 않음 (변이를 갱신하라):")
        for n, why in broken:
            print(f"  · {n}: {why}")
    sys.exit(1 if (survived or broken) else 0)


if __name__ == "__main__":
    main()
