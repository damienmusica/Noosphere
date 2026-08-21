#!/usr/bin/env node
// R11-d 검토 번들 — 사람이 열어 보고, 직접 돌려 볼 수 있는 한 덩어리.
//
// 담기는 것: 거리 사다리 프레임 · 여정 영상 · 재현 리포트(환경·수치·해시) ·
// 정본 문서 · 실행 가능한 정적 번들(dist) · 전체 소스 아카이브 · 재현 명령.
//
//   node art-r11/bundle.mjs [--out <dir>]
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const oi = args.indexOf("--out");
const OUT = path.resolve(LP, oi >= 0 && args[oi + 1] ? args[oi + 1] : "art-r11/bundle");

const sh = (cmd, cwd = LP) => execFileSync("sh", ["-c", cmd], { cwd, encoding: "utf8" }).trim();
const commit = sh("git rev-parse --short HEAD");
const dirty = sh("git status --porcelain -- . ../scripts ../docs");

// **작업 트리가 더러우면 번들을 만들지 않는다.** source.zip 은 `git archive HEAD`
// 로 나오고 dist·frames·리포트는 작업 트리에서 나오므로, 미커밋 상태로 묶으면
// 한 봉투 안에 **서로 다른 두 트리**가 들어간다. 검토자가 README 대로
// `unzip source.zip && npm run universe:reproduce` 를 하면 고치기 전 앱을 다시
// 빌드하게 되고, 나온 프레임이 같은 봉투의 frames/ 와 다르니 재현이 실패했다고
// 결론짓는다. 재현성이 이 번들의 존재 이유이므로 경고가 아니라 정지다.
if (dirty && !args.includes("--allow-dirty")) {
  console.error(
    `작업 트리에 미커밋 변경이 있다 — 번들을 만들지 않는다.\n` +
      `source.zip 은 HEAD(${commit}) 에서 나오고 dist/frames 는 작업 트리에서 나오므로\n` +
      `한 봉투에 서로 다른 두 트리가 들어간다. 먼저 커밋한 뒤 다시 실행하라.\n\n${dirty}`
  );
  process.exit(1);
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

// ——— 프레임과 영상 ———
for (const [src, dst] of [
  ["art-r11/frames", "frames"],
  ["art-r11/video", "video"]
]) {
  if (existsSync(path.join(LP, src))) await cp(path.join(LP, src), path.join(OUT, dst), { recursive: true });
}

// ——— 문서 ———
await mkdir(path.join(OUT, "docs"), { recursive: true });
for (const d of [
  "docs/universe-thesis.md",
  "docs/r11-observation-protocol.md",
  "docs/portrait-ladder-r9-amendment.md",
  "docs/art-direction-r10.md"
]) {
  if (existsSync(path.join(LP, d)))
    await cp(path.join(LP, d), path.join(OUT, "docs", path.basename(d)));
}
if (existsSync(path.join(LP, "../docs/charter-amendments-r11-draft.md")))
  await cp(
    path.join(LP, "../docs/charter-amendments-r11-draft.md"),
    path.join(OUT, "docs/charter-amendments-r11-draft.md")
  );

// ——— 재현 리포트 ———
if (existsSync(path.join(LP, "art-r11/reproduce-report.json")))
  await cp(path.join(LP, "art-r11/reproduce-report.json"), path.join(OUT, "reproduce-report.json"));

// ——— 실행 가능한 정적 번들 + 소스 아카이브 ———
// 아카이브에서 **R10 아트 파이프라인의 입력물**은 뺀다: staging(원본 스캔)과
// directions(방향 목업)은 합쳐 60MB 가 넘고, 이미 끝난 파이프라인의 입력이라
// 이 빌드를 세우거나 재현하는 데 쓰이지 않는다(권리 확인이 끝난 파생물은
// public/art 에 있고 그대로 들어간다). 빼는 것 자체를 감추지 않으려고 경로와
// 이유를 README 에 적고, BUILD_COMMIT 으로 전체 트리를 되찾을 수 있게 둔다.
const EXCLUDED = [
  ["literary-planet/art-r10/staging", "권리 확인을 거친 **원본 스캔**. 여기서 잘라 낸 파생물이 `literary-planet/public/art/` 에 그대로 들어 있고, 원장(제목·소장처·파일 페이지·라이선스)은 `public/art/manifest.json` 에 있다"],
  ["literary-planet/art-r10/directions", "R10 아트 방향 **목업**. 방향 결정이 끝난 뒤의 기록이다"],
  ["literary-planet/art-r10/ab-review", "R10 블라인드 A/B 의 **비교 프레임**. 그 라운드의 판정 근거이지 이 빌드의 입력이 아니다"]
];
await cp(path.join(LP, "dist"), path.join(OUT, "dist"), { recursive: true });
sh(
  `git -C .. archive --format=zip --add-virtual-file="literary-planet/BUILD_COMMIT:${commit}" ` +
    `-o "${path.join(OUT, "source.zip")}" HEAD literary-planet scripts docs ` +
    EXCLUDED.map(([e]) => `':(exclude)${e}'`).join(" ")
);

const COUNT_KO = {
  unitTests: "유닛 테스트",
  journeyContracts: "여정 계약",
  mutationsFastLaneKilled: "변이 KILLED (고속 레인만)",
  mutationsFastLaneSurvived: "변이 생존 (고속 레인만)",
  planetScenesPassed: "출하 행성 앱 QA 씬 통과",
  planetScenesTotal: "출하 행성 앱 QA 씬"
};

// 상상 초상의 수는 **세어서** 쓴다. 이전 판은 "101건" 을 리터럴로 박아 뒀는데
// 번들 안의 어떤 산출물도 그 숫자를 뒷받침하지 않았다(public/portraits·
// dist/portraits·data/portraits.json 모두 100). 검토자가 감사하는 것이
// 정확히 이런 종류의 숫자다.
const portraitCount = (await readdir(path.join(LP, "public/portraits"))).filter((f) =>
  f.endsWith(".jpg")
).length;
const portraitFaceCount = JSON.parse(
  await readFile(path.join(LP, "data/portraits.json"), "utf8")
).entries.filter((e) => e.mode === "face").length;

const report = existsSync(path.join(OUT, "reproduce-report.json"))
  ? JSON.parse(await readFile(path.join(OUT, "reproduce-report.json"), "utf8"))
  : null;

// 리포트가 이 번들의 트리를 실제로 설명하는가. 커밋 해시가 같기를 요구할 수는
// 없다 — 리포트를 커밋하는 순간 HEAD 가 그 리포트가 가리키는 커밋을 지나가기
// 때문이다. 물어야 할 것은 **게이트가 돈 뒤에 검사 대상이 바뀌었는가**이므로,
// 리포트 커밋과 HEAD 사이에서 소스·데이터·계약·스윕이 달라졌는지를 본다.
const GATED = [
  "literary-planet/src",
  "literary-planet/data",
  "literary-planet/tests",
  "literary-planet/public",
  "literary-planet/art-r11/verify-journey.mjs",
  "literary-planet/package.json",
  "scripts"
];
let reportStale = null;
if (report && report.commit && report.commit !== "unknown") {
  try {
    sh(`git -C .. merge-base --is-ancestor ${report.commit} HEAD`);
    const changed = sh(`git -C .. diff --name-only ${report.commit} HEAD -- ${GATED.join(" ")}`);
    reportStale = changed ? changed.split("\n") : [];
  } catch {
    reportStale = ["(리포트 커밋이 HEAD 의 조상이 아니다)"];
  }
}

await writeFile(
  path.join(OUT, "README.md"),
  `# 《문학의 성계》 R11-d — 검토 번들

커밋 \`${commit}\`${dirty ? " (⚠ 미커밋 변경이 섞인 번들 — --allow-dirty)" : ""} · ${sh("git log -1 --format=%ad --date=short")}

이 번들은 **실험 빌드**다. 통합 후보가 아니다 — 통합 조건은
\`docs/universe-thesis.md\` §⑩ 에 있고, 남은 게이트는 사람 관찰이다.

## 열어 볼 순서

1. \`frames/franz-kafka-1sky.png\` → \`-2mid.png\` → \`-3near.png\` — 거리 사다리.
   같은 천체가 별 → 구 → 지각으로 해상되는 것이 이 구조의 전부다.
2. \`frames/7orbit-unprepared.png\` — 자산이 준비되지 않은 작가(프루스트).
   착륙은 닫혀 있고, 대신 궤도 아카이브가 열린다. **없는 것을 없다고 말하는
   화면**이 이것이다.
3. \`frames/0sky-*.png\` — 관측층 세 종. 층은 성좌가 아니라 **색인**이다.
4. \`video/\` — 여정 전체.
5. \`docs/universe-thesis.md\` — 정본. §⑦ 이 이번 라운드의 시각 사양.

## 직접 돌려 보기

\`\`\`
npx serve dist        # 그리고 /universe.html 을 연다
\`\`\`

딥링크: \`universe.html?lens=movement&a=franz-kafka&land=1\`

## 소스에서 재현

\`\`\`
unzip source.zip && cd literary-planet && npm ci
npm run universe:reproduce        # 전 게이트 + 환경·수치·해시 리포트
npm run universe:mutation-sweep   # 계약이 실제로 무엇을 막는지 측정
\`\`\`

\`source.zip\` 은 커밋 \`${commit}\` 의 트리이고 \`literary-planet/BUILD_COMMIT\` 에
그 해시가 들어 있다. **뺀 경로가 있다**(합쳐 60MB 남짓, 위 두 명령에는 쓰이지
않는다):

${EXCLUDED.map(([e, why]) => `- \`${e}/\` — ${why}.`).join("\n")}

\`literary-planet/public/portraits/\` 의 상상 초상 ${portraitCount}건(그중 사람
얼굴 ${portraitFaceCount}건)은 레포에도, 이 번들의 \`dist/portraits/\` 에도 그대로
들어 있다. 어느 엔트리가 그것을 쓰는지가 갈린다:

- **성계 앱(\`universe.html\`)은 쓰지 않는다.** 여정 계약이 착륙·궤도 어느
  경로에서도 \`/portraits/\` 요청이 일어나지 않음을 매 실행 확인한다.
- **출하된 행성 앱(\`index.html\`, R10)은 아직 쓴다.** 같은 \`dist/\` 안의 두 번째
  엔트리이고, 기록 사진이 없는 작가에게 상상 초상을 「상상 초상」 캡션과 함께
  렌더한다. 그 엔트리에서 초상을 은퇴시키는 일은 R11 개정 초안의 한 항목(P4,
  \`docs/portrait-ladder-r9-amendment.md\` §3)이고 **출하 앱에는 아직 적용되지
  않았다** — 비준 전까지 그렇다.

즉 CPO 판정("상상된 인간 얼굴은 최종 자산으로 쓰지 않는다")은 성계 엔트리에서는
지켜지고 출하 엔트리에서는 아직 지켜지지 않는다.

${
  report
    ? `## 이 번들이 통과한 게이트\n\n게이트는 커밋 \`${report.commit}\` 에서 돌았고, 이 번들은 \`${commit}\` 이다.${
        reportStale === null
          ? " (대조 불가)"
          : reportStale.length === 0
            ? " 그 사이에 소스·데이터·계약·스윕은 **한 줄도 바뀌지 않았다** — 아래 수치는 이 트리를 설명한다."
            : ` ⚠ 그 사이에 다음이 바뀌었다 — 아래 수치는 이 트리를 설명하지 않는다:\n\n${reportStale
                .map((f) => `  - \`${f}\``)
                .join("\n")}`
      }\n\n${Object.entries(report.counts ?? {})
        .filter(([, v]) => v !== null)
        .map(([k, v]) => `- ${COUNT_KO[k] ?? k} — **${v}**`)
        .join("\n")}\n\n변이 스윕의 **전체(브라우저 레인 포함) 수치는 위 리포트에 없다** — 15분이
넘어 한 명령 게이트 밖이다. \`npm run universe:mutation-sweep\` 으로 직접
재고, 정본 수치는 \`docs/universe-thesis.md\` §⑪ 에 있다.\n\n${Object.entries(report.steps ?? {})
        .map(([k, v]) => `- \`${k}\` — ${v.ok ? "통과" : "**실패**"}`)
        .join("\n")}\n\n전체 리포트(환경·해시 포함)는 \`reproduce-report.json\`.\n`
    : ""
}
## 무엇을 봐 주면 되는가

- 카프카의 **연도 서가**: 경도가 발표 연도, 앞단이 입문 경로, 슬립의 민 숫자가
  입문 순서(동그라미 글리프 ①②③ 은 관측층 색인 전용이다), 표지 정면/책등
  정면이 실물 초판 소장 여부다. 이 넷이 **설명 없이** 읽히는가.
- 프루스트의 궤도: 착륙이 닫혀 있다는 사실이 **결핍이 아니라 정직**으로
  읽히는가, 아니면 미완성으로 읽히는가.
- 중경의 관측 렌즈: 이웃이 끌려온 것이 왜곡으로 **보이는가**(궤적과 유령).
`,
  "utf8"
);

console.log(`bundle → ${OUT}`);
