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
import subprocess
import sys

REPO = subprocess.run(
    ["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True, check=True
).stdout.strip()
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
    ("fast", "착륙 고도를 3.2r → 30r (천체가 점으로 남음)", G,
     "export const LANDING_ALT = 3.2;", "export const LANDING_ALT = 30;"),

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
     "  const unfamiliar: Recommendation[] = candidates\n    .filter((a) => gapRank(a) > 0)",
     "  const unfamiliar: Recommendation[] = candidates\n    .filter(() => true)"),
    ("fast", "추천에서 근거 문장 제거 (블랙박스)", P,
     "      reasons: [`${viaNames(a.id)}와 이어져 있다`, ...wanted(a.id)]", "      reasons: []"),
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
     "          if (ap > 120 && this.lensK < 0.05) this.paintCrust(body);", "          if (false) this.paintCrust(body);"),
    ("browser", "발명된 얼굴 초상이 돌아옴", C,
     "        {archival ? <ArchivalPortrait file={archival.file} /> : <TypePlate author={a} />}",
     "        {archival ? <ArchivalPortrait file={archival.file} /> : <canvas className=\"u-portrait\" />}"),
    ("browser", "작품 도시가 사라짐", S,
     "    works.forEach((w, i) => {", "    works.slice(0, 0).forEach((w, i) => {"),
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
