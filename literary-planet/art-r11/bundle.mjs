#!/usr/bin/env node
// R11-d 검토 번들 — 사람이 열어 보고, 직접 돌려 볼 수 있는 한 덩어리.
//
// 담기는 것: 거리 사다리 프레임 · 여정 영상 · 재현 리포트(환경·수치·해시) ·
// 정본 문서 · 실행 가능한 정적 번들(dist) · 전체 소스 아카이브 · 재현 명령.
//
//   node art-r11/bundle.mjs [--out <dir>]
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
await cp(path.join(LP, "dist"), path.join(OUT, "dist"), { recursive: true });
sh(
  `git -C .. archive --format=zip --add-virtual-file="literary-planet/BUILD_COMMIT:${commit}" -o "${path.join(OUT, "source.zip")}" HEAD literary-planet scripts docs`
);

const report = existsSync(path.join(OUT, "reproduce-report.json"))
  ? JSON.parse(await readFile(path.join(OUT, "reproduce-report.json"), "utf8"))
  : null;

await writeFile(
  path.join(OUT, "README.md"),
  `# 《문학의 성계》 R11-d — 검토 번들

커밋 \`${commit}\`${dirty ? " (⚠ 미커밋 변경이 섞인 번들 — --allow-dirty)" : ""} · ${new Date().toISOString().slice(0, 10)}

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

${
  report
    ? `## 이 번들이 통과한 게이트\n\n${Object.entries(report.steps ?? {})
        .map(([k, v]) => `- \`${k}\` — ${v.ok ? "통과" : "**실패**"}${v.tail ? ` · ${String(v.tail).split("\n").pop()}` : ""}`)
        .join("\n")}\n`
    : ""
}
## 무엇을 봐 주면 되는가

- 카프카의 **연도 서가**: 경도가 발표 연도, 앞단이 입문 경로, 색인 글리프가
  입문 순서, 표지 정면/책등 정면이 실물 초판 소장 여부다. 이 넷이 **설명 없이**
  읽히는가.
- 프루스트의 궤도: 착륙이 닫혀 있다는 사실이 **결핍이 아니라 정직**으로
  읽히는가, 아니면 미완성으로 읽히는가.
- 중경의 관측 렌즈: 이웃이 끌려온 것이 왜곡으로 **보이는가**(궤적과 유령).
`,
  "utf8"
);

console.log(`bundle → ${OUT}`);
