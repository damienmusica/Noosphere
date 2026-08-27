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
**Kill-safe too** (2026-08-25, 값을 치른 뒤): 메모리 사본은 프로세스가 죽으면
같이 죽는다. 그날 3초짜리 정찰 실행이 파이프 뒤에서 살아남아 **35분 동안 트리와
dist 를 갈아엎었고**, 그동안 찍은 프레임과 돌린 계약이 전부 변이된 빌드를
측정했다. 이제 변이 전에 원본을 `.mutation-sweep-backup/` 에 떨어뜨리고, 다음
실행은 그 디렉토리가 남아 있으면 **돌기를 거부한다** — `--repair` 로 되돌린 뒤에
다시 부른다.
"""
import argparse
import atexit
import pathlib
import shutil
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
# 죽어도 남는 원본 사본. 정상 종료 때 지운다 — 남아 있다는 것 자체가
# "지난 실행이 복원을 마치지 못했다"는 신호다.
BACKUP = pathlib.Path(REPO) / ".mutation-sweep-backup"

G = "src/universe/grammar.ts"
L = "src/universe/lenses.ts"
P = "src/universe/personal.ts"
R = "src/universe/readiness.ts"
S = "src/universe/scene.ts"
C = "src/universe/components/OrbitCard.tsx"
U = "src/universe/UniverseApp.tsx"
CSS = "src/universe/universe.css"
LAB = "src/globe/labels.ts"
ASM = "src/data/assemble.ts"

# (lane, name, file, needle, replacement)
#
# 2026-08-24 회랑 재기준선에서 **제거된 변이 5** (스윕이 드러낸 죽은 자리):
#   · 표지 유무 방향 2건 — buildVolume 의 옛 방향 잔재가 프레임마다 덮어써지는
#     죽은 코드였고, 코드째 삭제했다("소장=방향" 채널은 CPO 룰링으로 폐기).
#   · 최소 간격(VOL_AIR) — 회랑에서 책:칸 비는 CORRIDOR_CELL_AIR 가 구조적으로
#     보증한다(유닛 리터럴 검증). VOL_AIR 는 책 폭 상한식에만 남는다.
#   · 사입각 — 접근 비행의 연출 상수가 됐다. 지각 성공을 자동 문턱으로 확정하지
#     않는다는 원칙에 따라 계약을 달지 않는다.
#   · 권별 법선 — orientCities 가 회랑에서 도달 불가능한 죽은 코드가 되어 코드째
#     삭제했다.
MUTATIONS = [
    # --- 표현 사다리: 거리의 함수라는 계약 --------------------------------
    ("fast", "star→disc 임계를 3px 로 되돌린다 (하늘이 검게 죽던 회귀)", G,
     "export const STAR_TO_DISC_PX = 7;", "export const STAR_TO_DISC_PX = 3;"),
    ("fast", "surface 임계를 화면의 90% 로 (지각을 영영 안 칠함)", G,
     "if (apparentPx < viewportH * 0.22) return \"resolved\";",
     "if (apparentPx < viewportH * 0.9) return \"resolved\";"),

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
     "          this.paintCrust(body);", "          if (ap > 600) this.paintCrust(body);"),
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
    ("browser", "책등판과 앞마구리 재질이 뒤바뀐다", S,
     "    const spine = new THREE.Mesh(new THREE.BoxGeometry(t, bh, bd), [\n      spineMat,\n      boardMat,",
     "    const spine = new THREE.Mesh(new THREE.BoxGeometry(t, bh, bd), [\n      boardMat,\n      spineMat,"),
    ("browser", "입문 경로 밖의 권에도 순서 숫자를 단다", S,
     "        const wtext = c.orderIndex >= 0 ? `${c.orderIndex + 1} ${work.titleKo}` : work.titleKo;",
     "        const wtext = `${Math.abs(c.orderIndex) + 1} ${work.titleKo}`;"),
    ("browser", "착륙 패널의 마크를 폭으로만 묶는다 (세로 자산이 카드를 뚫음)",
     "src/universe/universe.css",
     "  max-height: 116px;", "  max-height: 9999px;"),
    ("browser", "마크에 반전 필터를 되돌린다 (붉은 낙관이 청록으로)",
     "src/universe/universe.css",
     "  object-fit: contain;\n}", "  object-fit: contain;\n  filter: invert(1);\n}"),
    ("browser", "입문 순서를 라벨에서 지운다 (순서 숫자 없음)", S,
     "        const wtext = c.orderIndex >= 0 ? `${c.orderIndex + 1} ${work.titleKo}` : work.titleKo;",
     "        const wtext = work.titleKo;"),
    ("browser", "서가가 다시 원 숫자 ①②③ 를 단다 (색인 글리프와 이중 의미 회귀)", S,
     "        const wtext = c.orderIndex >= 0 ? `${c.orderIndex + 1} ${work.titleKo}` : work.titleKo;",
     "        const wtext = c.orderIndex >= 0 ? `${indexGlyph(c.orderIndex + 1)} ${work.titleKo}` : work.titleKo;"),
    # ——— R11-e: 파일럿·모의 심사가 잡은 것들 ———
    ("browser", "'하늘로'가 출발 구도가 아니라 현재 접근각으로 돌아간다 (4/4 가 출발 별을 잃던 회귀)", S,
     "    if (approachOverride) approach = approachOverride;", "    // approach override removed"),
    ("browser", "검색창 Enter 가 다시 아무 일도 하지 않는다", "src/universe/UniverseApp.tsx",
     "              if (e.key === \"Enter\" && hits[0]) {", "              if (false && hits[0]) {"),
    ("browser", "초점 원반에 걸치는 별 이름을 다시 원반 위에 찍는다", S,
     "          if (Math.hypot(nx - disc.cx, ny - disc.cy) < disc.r) {",
     "          if (false) {"),
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
    ("browser", "자산 사전 로드 없이 착륙한다", "src/universe/UniverseApp.tsx",
     "    if (assets?.authorId !== pendingLand) return; // 자산을 기다린다", "    // waits removed"),
    ("browser", "프로비넌스를 표면에서 감춘다", "src/universe/UniverseApp.tsx",
     "          {assets && assets.provenance.length ? (", "          {false ? ("),
    ("browser", "하늘 라벨에 종이 판이 돌아온다", "src/universe/scene.ts",
     "          state,\n          ground: \"sky\",", "          state,\n          ground: \"crust\","),
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
    # --- 서가 회랑 (R12-c): 행성 위 · 전부 책등 · 지목 한 가닥 · 이륙 --------
    ("fast", "회랑 전체 호의 상한이 사라진다 (책이 행성을 감는다)", G,
     "export const CORRIDOR_ARC_MAX = 2.4;", "export const CORRIDOR_ARC_MAX = 240;"),
    ("fast", "회랑 꼬리 여유가 사라진다 (마지막 앵커가 모서리에 닿음)", G,
     "export const CORRIDOR_TAIL_YEARS = 4;", "export const CORRIDOR_TAIL_YEARS = 0;"),
    ("fast", "연도 → 호 사상이 퇴화한다 (전부 같은 자리)", G,
     "  return (year - span.yStart) * cellArc;", "  return 0 * cellArc;"),
    ("fast", "책 앵커가 연도로 해상되지 않는다", G,
     "  if (anchor.workId !== undefined) return workYear(anchor.workId) ?? anchor.year;",
     "  if (anchor.workId !== undefined) return anchor.year;"),
    ("browser", "쉬는 책이 책등 대신 표지를 내민다 (책등 통일 회귀)", S,
     "      c.book.rotation.y = Math.PI * (1 - e);", "      c.book.rotation.y = 0 * (1 - e);"),
    ("browser", "접힘이 일어서지 않는다 (회랑이 지각에 누운 채)", S,
     "    for (const g of this.corridorStand) g.rotation.x = lie * (1 - this.foldK);",
     "    for (const g of this.corridorStand) g.rotation.x = lie;"),
    ("browser", "표면 하늘 관측창이 뒤집힌다 (별이 전부 지평선 아래)", S,
     "    const elev2 = 0.03 + Math.abs(elev) * 0.18;", "    const elev2 = -(0.03 + Math.abs(elev) * 0.18);"),
    ("browser", "사망선이 서지 않는다", S,
     "        death.userData.deathLine = true;", "        death.userData.deathLine = false;"),
    ("browser", "입구 명판이 서지 않는다", S,
     "      plate.userData.plate = true;", "      plate.userData.plate = false;"),
    ("browser", "지목 없이도 실이 전부 걸린다 (선 다이어트 회귀)", U,
     "      if (hoverId === otherId)", "      if (true)"),
    ("browser", "연보 명패가 서지 않는다 (회랑이 도로 빈다)", S,
     "    for (const ev of events.sort((x, y) => x.year - y.year)) {",
     "    for (const ev of events.slice(0, 0)) {"),
    ("browser", "착륙 실의 앵커가 전부 명판으로 간다 (책·연도 무시)", S,
     "        const anchorP = this.anchorPoint(l.anchor);", "        const anchorP = this.anchorPoint(undefined);"),
    ("browser", "별을 눌러도 이륙하지 않는다 (착륙이 눌러앉음)", U,
     "          setLandedId((landedPrev) => (id && landedPrev && id !== landedPrev ? null : id ? landedPrev : null));",
     "          setLandedId((landedPrev) => landedPrev);"),
    ("browser", "이륙 후에도 회랑이 남는다 (걷히지 않음)", S,
     "      this.corridorDeparting = false;\n      this.foldK = 0;\n      this.clearCities();",
     "      this.corridorDeparting = false;\n      this.foldK = 0;"),
    # --- 작품 세계 (R12): 책을 눌러 얻는 것이 한 문장을 넘는가 ----------------
    ("browser", "여는 문장의 번역이 자체 번역 표시를 잃는다", "src/universe/components/WorkSheet.tsx",
     "여는 문장 · 자체 번역", "여는 문장"),
    ("browser", "판본 행이 시트에서 빠진다", "src/universe/components/WorkSheet.tsx",
     "            {w.editions.map((e, i) => (", "            {w.editions.slice(0, 0).map((e, i) => ("),
    ("browser", "유고 행이 모든 작품에 선다", "src/universe/components/WorkSheet.tsx",
     "          {w.posthumous ? (", "          {w.posthumous || true ? ("),
    ("browser", "원문 대신 번역이 원문 자리에 선다", "src/universe/components/WorkSheet.tsx",
     "              {w.opening.original}", "              {w.opening.ko}"),
    ("browser", "앵커 칩이 카드에서 빠진다", C,
     "                    {anchorChips(rel, p.workTitle).map((chip) => (", "                    {anchorChips(rel, () => undefined).filter(() => false).map((chip) => ("),
    ("fast", "앵커가 제3자의 책을 가리켜도 통과한다", "src/data/assemble.ts",
     "        else if (w.authorId !== r.sourceId && w.authorId !== r.targetId)", "        else if (false)"),
    ("browser", "미준비 작가의 카드에서 서명 기록이 빠진다 (4단으로 회귀)", C,
     "        ) : mark ? (", "        ) : false ? ("),
    ("fast", "판본 연도가 발표 연도보다 앞서도 통과한다", "src/data/assemble.ts",
     "        if (e.year < w.year)", "        if (false)"),
    ("fast", "유고 주장이 사망 전 초판에도 통과한다", "src/data/assemble.ts",
     "        if (a.deathYear === undefined || (first && first.year <= a.deathYear))", "        if (false)"),
    # --- 손안의 성계 (verify-mobile, R12-d) --------------------------------
    # 넓은 화면 계약이 316/316 인 채로 전화기에서는 아무것도 못 하던 상태가
    # 하루 넘게 서 있었다. 아래 변이들은 그때 실제로 일어났던 일을 하나씩
    # 되돌린다 — 계약이 그것을 잡는지가 이 레인의 전부다.
    ("mobile", "좁은 배치를 끈다 (전화기에서도 데스크톱 레일)", U,
     'const NARROW_Q = "(max-width: 900px), (max-height: 520px)";',
     'const NARROW_Q = "(max-width: 0px)";'),
    # 2026-08-24 1차 스윕에서 이 변이는 **생존이 아니라 무효**였다: 띠를 먼저
    # 먹인 뒤 좁은 화면 분기가 곧바로 덮어써서 아무것도 바뀌지 않았다. 변이는
    # 분기 **안의 값**을 바꿔야 실제로 그때의 버그가 된다.
    ("mobile", "데스크톱 안전 띠를 좁은 화면에도 먹인다 (좌 250 + 우 392 > 화면 390)", U,
     "    sceneRef.current?.setSafeInsets(0, 0, 58, sheet);",
     "    sceneRef.current?.setSafeInsets(250, 392, 0, 0);"),
    ("mobile", "세로 화면 자세 보정을 끈다 (회랑이 프레임 밖으로)", S,
     "const port = Math.min(1, Math.max(0, (1.15 - this.camera.aspect) / 0.5));",
     "const port = 0;"),
    ("mobile", "쉬는 시트가 하늘을 덮는다", U,
     "const SHEET_PEEK_VH = 0.42;", "const SHEET_PEEK_VH = 0.92;"),
    ("mobile", "이름표가 화면 밖으로 흘러넘친다 (클램프 제거)", LAB,
     "const cx = w + 8 >= width ? width / 2 : Math.min(Math.max(item.x, half + 4), width - half - 4);",
     "const cx = item.x;"),
    ("mobile", "손끝 크기를 24px 로 되돌린다", CSS,
     ".is-narrow .u-btn {\n  min-height: 44px;", ".is-narrow .u-btn {\n  min-height: 24px;"),
    ("mobile", "손가락의 첫 탭이 곧바로 이륙한다 (왜를 읽을 기회 없음)", S,
     "    if (!this.coarse) return false;", "    return false;"),
    ("mobile", "검색창이 포커스에 늘어난다 (줄이 재배치되어 탭이 빗나감)", CSS,
     ".is-narrow .u-search {\n  flex: 0 0 92px;", ".is-narrow .u-search:focus-within {\n  flex: 1 1 auto;\n}\n\n.is-narrow .u-search {\n  flex: 0 1 92px;"),
    ("mobile", "작품 이름표가 시트 뒤에 반쯤 걸린다", S,
     "        if (this.labelHidden(wx, wy, wtext, 13, LABEL_CHROME_SLIP, w, h)) continue;",
     "        void wx;"),
    ("mobile", "서랍의 가림막이 상단 줄을 덮는다 ('닫기'가 죽은 버튼이 된다)", CSS,
     "  /* 서랍의 가림막(z 7)과 서랍(z 8) 위에 남는다 — 그러지 않으면 서랍이 열린\n     동안 '닫기'가 가림막에 먹혀 죽은 버튼이 된다(실측). */\n  z-index: 9;\n",
     "  "),
    ("mobile", "층을 골라도 서랍이 닫히지 않는다 (하늘이 안 보임)", U,
     "                setLensId(lensId === l.id ? null : l.id);\n                setDrawer(false);",
     "                setLensId(lensId === l.id ? null : l.id);"),
    # --- R12-e 수리 (외부 검토 2026-08-24 삼각 측정) -----------------------
    # 일곱 건 전부 "비준된 조항을 구현이 절반만 따른" 자리였다. 그래서 변이는
    # 각각 **절반으로 되돌리는** 형태다 — 상자를 점으로, 측정을 상수로,
    # 두 채널을 한 칸으로.
    # 아래 넷은 **손안 레인**이다. 계약이 도는 화면에 변이를 두어야 한다 —
    # 1600×1000 에서는 좌 250 띠가 이미 넉넉해 상자와 점의 차이가 어떤 이름표도
    # 물지 않았고, 카드 스크롤 계약도 손안 하네스에만 있다(스윕 실측: 넷 다
    # 브라우저 레인에서 생존).
    ("mobile", "이름표 컬링을 다시 앵커 점 검사로 되돌린다", S,
     "    const half = estimateWidth(text, fs, chrome) / 2 + 6;", "    const half = 0;"),
    ("mobile", "이름표가 크롬 사각형을 무시한다 (띠만 본다)", S,
     "    for (const r of this.chromeRects) {", "    for (const r of []) {"),
    ("mobile", "크롬 사각형을 장면에 넘기지 않는다 (상수 띠 시절로)", U,
     "      scene.setChromeRects(out);", "      scene.setChromeRects([]);"),
    ("mobile", "궤도 카드의 key 를 뗀다 (도착 카드가 이전 스크롤을 물려받는다)", U,
     "          key={focus.id}\n          author={focus}", "          author={focus}"),
    ("browser", "같은 해 두 권의 간격을 다시 두께 상수로 (폭 축에 bd)", S,
     "      const step = bw * VOL_AIR;", "      const step = bd * 2.2;"),
    ("browser", "카드 관계 행의 지목 배선을 뗀다", C,
     "                    onMouseEnter={() => p.onPeek(other.id)}\n                    onFocus={() => p.onPeek(other.id)}\n",
     ""),
    ("browser", "범례의 누름과 얹음을 다시 한 칸에 담는다", U,
     "                      setGroupPin((pin) => (pin === g.id ? null : g.id));",
     "                      setGroupFocus((c) => (c === g.id ? null : g.id));"),
    ("mobile", "손끝의 지목이 다시 착륙 상태에서만 걸린다 (궤도에서는 즉시 이동)", S,
     "    const anchor = this.state.landedId ?? this.state.focusId;",
     "    const anchor = this.state.landedId;"),
    # 합성 mouseenter 를 얹음으로 받으면 첫 탭이 지목을 켜고 그 자리에서 클릭이
    # "이미 지목됨"으로 읽어 곧바로 이동한다 — 두 탭 문법이 한 탭으로 붕괴.
    ("mobile", "합성 mouseenter 를 얹음으로 받는다 (두 탭 문법이 한 탭으로 붕괴)", U,
     "            if (pointerKind.current !== \"mouse\") return;\n", ""),
    ("mobile", "뷰포트 변화를 듣지 않는다 (주소창이 접혀도 띠가 얼어붙는다)", U,
     "    const bump = () => setVpTick((n) => n + 1);", "    const bump = () => {};"),
    ("mobile", "범례 행이 서랍을 닫지 않는다 (하늘이 안 보인다)", U,
     "                      setGroupPin((pin) => (pin === g.id ? null : g.id));\n                      setDrawer(false);",
     "                      setGroupPin((pin) => (pin === g.id ? null : g.id));"),
    # --- 앵커 웨이브 (R12-e 후속) -----------------------------------------
    # --- 카메라 주권 (R12-f) ------------------------------------------
    # 표현 사다리는 늘 거리의 함수였다. 이 라운드가 더한 것은 그 사다리를 오를
    # 이동 수단이고, 아래 변이는 그 이동 수단의 부품을 하나씩 뺀다.
    ("flight", "주권 — 주시점을 시선 앞에 두지 않는다 (다시 고른 것 주위만 돈다)", S,
     "      this.controls.target.copy(this.camera.position).addScaledVector(fwd, FREE_PIVOT);\n",
     ""),
    ("flight", "주권 — 추력이 카메라를 밀지 않는다", S,
     "        this.camera.position.addScaledVector(fwd, this.thrust * sec);\n", ""),
    ("flight", "주권 — 관성을 없앤다 (한 프레임 뒤 속도 0)", S,
     "        this.thrust *= Math.pow(THRUST_DAMP, sec);", "        this.thrust = 0;"),
    ("flight", "주권 — 자유 비행에서도 회전 부호를 그대로 (하늘이 손가락 반대로 간다)", S,
     "      this.controls.rotateSpeed = -ROTATE_SPEED;", "      this.controls.rotateSpeed = ROTATE_SPEED;"),
    ("flight", "주권 — 다시 누르는 순간 고른다 (드래그의 출발점이 선택이 된다)", S,
     "    if (!d || d.id !== e.pointerId || d.moved > DRAG_SLOP) return;",
     "    if (!d || d.id !== e.pointerId) return;"),
    ("flight", "주권 — 근접 감속을 없앤다 (별을 스쳐 지나간다)", S,
     "    return Math.max(0.1, Math.min(1, this.nearD / SHELL_R));", "    return 1;"),
    ("flight", "주권 — 성계 방향 표식을 끈다 (빈 화면에 아무 단서도 없다)", S,
     "      this.homeMark.visible = true;", "      this.homeMark.visible = false;"),
    ("flight", "주권 — 표식을 늘 띄운다 (별이 보여도 사라지지 않는다)", S,
     "      this.homeMark.visible = false;\n      this.homeLabel.visible = false;",
     "      this.homeMark.visible = true;\n      this.homeLabel.visible = false;"),
    ("flight", "주권 — 다가간 별에 이름을 주지 않는다", S,
     "        const named = otherwise || near;", "        const named = otherwise;"),
    ("flight", "주권 — 다가간 별의 이름을 층이 접는다 (틱만 남는다)", S,
     "            !near &&\n            !s.lensMarks.has(id) &&", "            !s.lensMarks.has(id) &&"),
    ("flight", "주권 — 단계를 다시 주시점 거리로 잰다 (자유 비행에서 상수)", S,
     'resolved > 0 || focusDist < 1250 ? "approach" : "sky"',
     'resolved > 0 || dist < 1250 ? "approach" : "sky"'),
    # 자리를 잡는 곳은 한 곳이다. 이전 판은 추력 분기와 update 뒤 두 곳에서
    # 잡았고, 그래서 **어느 한쪽을 지워도 계약이 초록으로 남았다**(생존 2건).
    ("flight", "주권 — 성계의 안팎 한계를 없앤다 (밖으로 나가고 항성을 관통한다)", S,
     "      const r = this.camera.position.length();\n      if (r > CAM_SKY_MAX || r < FREE_R_MIN) {\n        this.camera.position.setLength(Math.max(FREE_R_MIN, Math.min(CAM_SKY_MAX, r)));\n        this.thrust = 0;\n      }",
     ""),
    ("flight", "주권 — 한계에서 속도를 끊지 않는다 (벽에 붙은 채 계속 민다)", S,
     "        this.camera.position.setLength(Math.max(FREE_R_MIN, Math.min(CAM_SKY_MAX, r)));\n        this.thrust = 0;",
     "        this.camera.position.setLength(Math.max(FREE_R_MIN, Math.min(CAM_SKY_MAX, r)));"),
    ("flight", "주권 — 회랑 자세가 서 있는 해를 읽지 않는다 (입구에 못박힌다)", S,
     "      const p = this.corridorPose(this.walkYear, this.lookYaw, this.lookPitch);\n      if (p) {",
     "      const p = this.corridorPose(f.span.yStart + 0.8, this.lookYaw, this.lookPitch);\n      if (p) {"),
    ("flight", "주권 — 걷기 속도가 자리를 옮기지 않는다", S,
     "        this.walkYear += this.walkVel * sec;", ""),
    ("flight", "주권 — 고개 각도를 자세에 넣지 않는다 (드래그가 아무것도 안 한다)", S,
     "    const yaw = ((5 - 20 * port) * Math.PI) / 180 + yaw0;",
     "    const yaw = ((5 - 20 * port) * Math.PI) / 180;"),
    ("flight", "주권 — 회랑 끝의 한계를 없앤다 (서가 너머로 걸어 나간다)", S,
     "      this.walkYear = Math.max(lo, Math.min(hi, this.walkYear));", ""),
    ("flight", "주권 — 새 회랑에서도 걸어 둔 자리를 유지한다", S,
     "    this.walkYear = span.yStart + 0.8;\n    this.walkVel = 0;", "    this.walkVel = 0;"),
    ("flight", "주권 — 다가감을 알리지 않는다 (지각이 백지로 남는다)", S,
     "      this.cb.onNear(near);", ""),
    ("flight", "주권 — 자산 방아쇠가 다시 선택뿐 (다가가도 자산이 안 온다)", U,
     "    const target = focusId ?? nearId;", "    const target = focusId;"),
    ("flight", "주권 — 추력이 궤도를 끊지 않는다 (고른 것 주위에 묶인다)", S,
     "    if (this.state.focusId) this.orbitBroken = true;", ""),
    ("flight", "주권 — 떠나도 궤도가 닫히지 않는다 (남의 카드를 계속 읽는다)", S,
     "    if (this.orbitBroken && this.state.focusId && focusDist > LENS_DIST * 1.6)\n      this.cb.onLeaveOrbit();",
     ""),
    ("flight", "주권 — 새로 고를 때 궤도가 다시 이어지지 않는다", S,
     "    // 새로 고르거나 착륙하면 궤도는 다시 이어진다\n    this.orbitBroken = false;\n    this.thrust = 0;",
     ""),
    ("flight", "주권 — 안쪽으로 들어와도 돌아올 길을 알리지 않는다", S,
     "      this.cb.onDeep(deep);", ""),
    ("flight", "주권 — 원경으로가 자리를 되돌리지 않는다", S,
     "    this.skyPose.set(0, 420, CAM_SKY_DEFAULT);", ""),
    ("flight", "주권 — 감소된 동작에서도 관성을 준다 (한 프레임만 밀고 만다)", S,
     "        if (this.state.reducedMotion) {\n          this.camera.position.addScaledVector(fwd, this.thrust / -Math.log(THRUST_DAMP));\n          this.thrust = 0;\n        } else {\n          this.camera.position.addScaledVector(fwd, this.thrust * sec);",
     "        if (false) {\n          this.thrust = 0;\n        } else {\n          this.camera.position.addScaledVector(fwd, this.thrust * sec);"),
    # 손이 없는 관측자 — 자유 비행이 기본 동사가 된 뒤 포인터 전용이면
    # 키보드 사용자에게 성계는 목록으로 남는다(R12-e 일곱 번째 수리와 같은 결함).
    ("flight", "주권 — 감소된 동작에서도 회랑에 관성을 준다", S,
     "        if (this.state.reducedMotion) {\n          this.walkYear += this.walkVel / -Math.log(WALK_DAMP);\n          this.walkVel = 0;\n        } else {\n          this.walkYear += this.walkVel * sec;",
     "        if (false) {\n          this.walkVel = 0;\n        } else {\n          this.walkYear += this.walkVel * sec;"),
    # 앵커는 요약이 이미 지목한 것만 승격한다 (물량 트랙 ②) — 이 규율은
    # 189건을 한 번에 올린 웨이브 전까지 산문으로만 있었다.
    ("fast", "앵커 — 요약이 지목하지 않은 책도 앵커로 받는다", ASM,
     "        else if (!r.summary.includes(w.titleKo) && !r.summary.includes(w.titleOriginal))\n"
     "          errors.push(\n"
     "            `${r.id}: anchor work ${an.workId} is not named in the summary ('${w.titleKo}')`\n"
     "          );",
     ""),
    ("fast", "앵커 — 요약이 지목하지 않은 연도도 앵커로 받는다", ASM,
     "      if (an.year !== undefined && !r.summary.includes(String(an.year)))\n"
     "        errors.push(`${r.id}: anchor year ${an.year} is not named in the summary`);",
     ""),
    # 별에도 크기가 있다 (R12-g) — 크기는 광휘와 실제 원반의 큰 쪽이다.
    ("flight", "크기 — 원반 항을 없앤다 (별이 다시 거리를 갖지 않는다)", G,
     "  return Math.min(STAR_MAX_PX, Math.max(glarePx, apparentRadiusPx_ * 2));",
     "  return Math.min(STAR_MAX_PX, glarePx);"),
    ("flight", "크기 — 광휘 바닥을 없앤다 (먼 하늘이 균일한 먼지가 된다)", G,
     "  return Math.min(STAR_MAX_PX, Math.max(glarePx, apparentRadiusPx_ * 2));",
     "  return Math.min(STAR_MAX_PX, apparentRadiusPx_ * 2);"),
    ("fast", "크기 — 상한을 없앤다 (넘겨받을 구가 없는 별이 화면을 덮는다)", G,
     "  return Math.min(STAR_MAX_PX, Math.max(glarePx, apparentRadiusPx_ * 2));",
     "  return Math.max(glarePx, apparentRadiusPx_ * 2);"),
    ("fast", "크기 — 반경이 광도를 따라가지 않는다 (같은 거리에서 다 같은 크기)", G,
     "  return 0.85 + mag * 1.75;", "  return 0.85 + 1.75 * 0.5;"),
    ("flight", "주권 — 캔버스가 키보드로 닿지 않는다", S,
     "    this.renderer.domElement.tabIndex = 0;", ""),
    ("flight", "주권 — 키보드를 듣지 않는다 (화살표도 +/- 도 죽는다)", S,
     '    this.renderer.domElement.addEventListener("keydown", this.onKeyDown);', ""),
    ("flight", "주권 — 하늘에서 고개가 돌지 않는다 (키보드 전용 경로)", S,
     "    if (!this.freeMode()) return;\n    this.camera.rotateOnWorldAxis(this.camera.up, yaw);\n    this.camera.rotateX(pitch);",
     "    if (!this.freeMode()) return;"),
    ("mobile", "주권 — 핀치를 듣지 않는다 (손끝에는 추력이 없다)", S,
     "        this.pinch();\n        return;", "        return;"),
    ("mobile", "주권 — 운동 신호를 보내지 않는다", S,
     "      this.cb.onMotion(moving);", ""),
    ("mobile", "주권 — 유령 포인터를 지우지 않는다 (다음 제스처가 죽는다)", S,
     "    if (e.isPrimary) this.pointers.clear();\n", ""),
    ("mobile", "주권 — 물러난 시트 상태를 없앤다 (이동 중에도 화면의 절반)", U,
     '          ? moving\n            ? "away"\n            : sheetFull', "          ? sheetFull"),
    ("mobile", "주권 — 시트가 물러나도 안전 띠는 그대로 (없는 크롬을 피해 민다)", U,
     "      open && !moving", "      open"),
    # 누운 화면은 `data-sheet` 를 쓰지 않는다 — 세로에만 계약을 달았더니 852 중
    # 380(45%)이 나는 내내 덮여 있었다. 같은 형태로 세 번째 물린 자리다.
    ("mobile", "주권 — 누운 화면의 시트가 물러나지 않는다 (화면의 45%가 계속 덮인다)", CSS,
     ".is-narrow.is-short.is-moving .u-card {\n  transform: translateX(100%);\n}",
     ".is-narrow.is-short.is-moving .u-card {\n  transform: none;\n}"),
    ("mobile", "주권 — 누운 화면의 안전 띠가 시트를 따라가지 않는다", U,
     "        open && !moving ? Math.round(Math.min(window.innerWidth * 0.52, 380)) : 0,",
     "        open ? Math.round(Math.min(window.innerWidth * 0.52, 380)) : 0,"),

    ("browser", "앵커가 구간을 앞으로도 늘린다 (첫 작품 이전이 빈 칸으로)", G,
     "  const own = [...workYears, ...(deathYear !== undefined ? [deathYear] : [])];\n  const lo = own.length ? Math.min(...own) : Math.min(...anchorYears);",
     "  const own = [...workYears, ...anchorYears, ...(deathYear !== undefined ? [deathYear] : [])];\n  const lo = Math.min(...own);"),
]


def run(cmd, cwd=LP):
    return subprocess.run(cmd, cwd=cwd, shell=True, capture_output=True, text=True)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--browser", action="store_true", help="also run the journey contracts (slow)")
    ap.add_argument(
        "--only",
        action="append",
        help="이름에 이 문자열이 든 변이만 돈다 (반복 가능). 새 기제를 붙인 직후 "
        "그 기제만 재는 데 쓴다 — 브라우저 레인 전체는 한 시간이 넘고, 그동안 "
        "트리가 잠긴다.",
    )
    ap.add_argument(
        "--lane",
        action="append",
        choices=["fast", "browser", "flight", "mobile"],
        help="run ONLY these lanes (repeatable). 새 레인을 붙인 직후 그 레인만 "
        "재는 데 쓴다 — 전체 스윕은 두 시간이 넘고, 그동안 트리가 잠긴다.",
    )
    ap.add_argument(
        "--repair",
        action="store_true",
        help="지난 실행이 남긴 .mutation-sweep-backup/ 에서 원본을 되돌리고 끝낸다.",
    )
    args = ap.parse_args()

    if args.repair:
        if not BACKUP.exists():
            sys.exit("되돌릴 사본이 없다 — 트리는 이미 원본이다.")
        n = 0
        for f in sorted(BACKUP.iterdir()):
            rel = f.name.replace("__", "/")
            target = pathlib.Path(LP) / rel
            text = f.read_text(encoding="utf-8")
            if target.read_text(encoding="utf-8") != text:
                target.write_text(text, encoding="utf-8")
                n += 1
                print(f"  되돌림 {rel}")
        shutil.rmtree(BACKUP)
        print(f"{n}개 파일을 되돌렸다. dist 는 `npm run build` 로 다시 짓는다.")
        return

    if BACKUP.exists():
        sys.exit(
            "지난 실행이 복원을 마치지 못했다 (.mutation-sweep-backup/ 이 남아 있다).\n"
            "  python3 scripts/universe-mutation-sweep.py --repair\n"
            "로 되돌린 뒤 다시 부른다 — 그러지 않으면 변이된 트리 위에 변이를 얹는다."
        )

    # `--browser` 는 브라우저가 필요한 레인 **전부**다: 넓은 화면(verify-journey)·
    # 비행(verify-flight)·손안(verify-mobile). 셋 다 같은 dist 를 쓰므로 빌드도 함께 탄다.
    #
    # `flight` 가 따로 있는 이유는 **속도**다. 조준 루프(드래그 → 투영 재측정 →
    # 다시 드래그)를 여정 파일에 넣었더니 한 판이 8분이 됐고, 변이 22건이 네
    # 시간으로 불어 트리를 그동안 잠갔다(2026-08-25 실측). 느린 계약은 자기
    # 레인을 갖는다 — 지금 비행 레인 한 판은 60초다.
    lanes = set(args.lane) if args.lane else {"fast"} | (
        {"browser", "flight", "mobile"} if args.browser else set()
    )
    cases = [m for m in MUTATIONS if m[0] in lanes]
    if args.only:
        cases = [m for m in cases if any(k in m[1] for k in args.only)]
        if not cases:
            sys.exit("--only 가 아무 변이와도 맞지 않는다")

    originals = {}
    for _, _, rel, _, _ in cases:
        path = f"{LP}/{rel}"
        if path not in originals:
            originals[path] = open(path, encoding="utf-8").read()

    # 죽어도 남는 사본을 먼저 떨어뜨린다 — 메모리 사본은 프로세스와 함께 죽는다
    BACKUP.mkdir(exist_ok=True)
    for path, text in originals.items():
        (BACKUP / pathlib.Path(path).relative_to(LP).as_posix().replace("/", "__")).write_text(
            text, encoding="utf-8"
        )

    def restore():
        for path, text in originals.items():
            try:
                if open(path, encoding="utf-8").read() != text:
                    open(path, "w", encoding="utf-8").write(text)
            except OSError:
                pass

    atexit.register(restore)

    needs_dist = bool(lanes & {"browser", "flight", "mobile"})
    if needs_dist:
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
                        harness = {
                            "mobile": "node art-r11/verify-mobile.mjs",
                            "flight": "node art-r11/verify-flight.mjs",
                        }.get(lane, "node art-r11/verify-journey.mjs")
                        res = run(harness)
                        caught = res.returncode != 0
            finally:
                open(path, "w", encoding="utf-8").write(text)
            (killed if caught else survived).append(name)
            print(f"  {'✓ KILLED  ' if caught else '✗ SURVIVED'} [{lane}] {name}")
    finally:
        restore()
        if needs_dist:
            # 마지막 변이가 만든 dist 가 남으면 이후 검증이 유령 실패를 낸다
            # (실측: 스윕 직후 여정 계약이 88/3 로 나왔고 원인은 오염된 dist).
            print("restoring the baseline dist…")
            run("npm run build")

    shutil.rmtree(BACKUP, ignore_errors=True)

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
