#!/usr/bin/env node
// R11 — 독립 재현성 하네스.
//
// 한 명령으로 전 게이트를 돌리고, 산출물마다 SHA-256 과 환경을 기록한다.
// 목적은 "우리가 초록이라고 말했다"가 아니라 **다른 사람이 같은 숫자를 다시
// 얻을 수 있다**는 것이다. 결정적이지 않은 산출물은 결정적이지 않다고 적는다.
//
//   node art-r11/reproduce.mjs            # 전체
//   node art-r11/reproduce.mjs --quick    # 브라우저 단계 제외
import { createHash } from "node:crypto";
import { execSync, spawnSync } from "node:child_process";
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const quick = process.argv.includes("--quick");

const sh = (cmd) => {
  const t0 = Date.now();
  const r = spawnSync(cmd, { cwd: LP, shell: true, encoding: "utf8" });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim();
  return {
    cmd,
    ok: r.status === 0,
    ms: Date.now() - t0,
    // `tail` 은 사람이 읽는 실패 요약이고, `out` 은 계수용 전문이다. 행성 앱
    // QA 는 요약 한 줄을 찍지 않고 씬마다 한 줄씩 찍으므로(qa/capture.mjs)
    // 마지막 4줄로는 셀 수 없다. `out` 은 리포트에 쓰지 않는다(steps 는
    // ok·ms 만 남긴다).
    out,
    tail: out.split("\n").slice(-4).join("\n")
  };
};

const sha = (f) => createHash("sha256").update(readFileSync(f)).digest("hex").slice(0, 16);

const hashTree = (dir) => {
  if (!existsSync(dir)) return {};
  const out = {};
  for (const f of readdirSync(dir).sort()) {
    const p = path.join(dir, f);
    if (statSync(p).isFile()) out[f] = { sha256_16: sha(p), bytes: statSync(p).size };
  }
  return out;
};

const steps = [
  { key: "typecheck", cmd: "npm run typecheck" },
  { key: "unit", cmd: "npm test" },
  { key: "validate-data", cmd: "npm run validate:data" },
  { key: "mutation-fast", cmd: "python3 ../scripts/universe-mutation-sweep.py" },
  { key: "build", cmd: "npm run build" },
  ...(quick
    ? []
    : [
        { key: "journey-contract", cmd: "node art-r11/verify-journey.mjs" },
        { key: "frames", cmd: "node art-r11/capture-universe.mjs --out art-r11/frames" },
        { key: "video", cmd: "node art-r11/record-journey.mjs" },
        // 출하된 행성 앱(index.html)의 QA. 테제 §⑪ 의 "20/20 씬 · 콘솔 0" 은
        // 지금까지 이 번들 안의 어떤 산출물로도 뒷받침되지 않았다(artifacts/
        // 는 gitignore 라 source.zip 에 들어가지 않는다). R11 범위가 index.html
        // 이 import 하는 공유 모듈(src/globe/labels.ts·art-assets.ts·styles.css)
        // 을 건드렸으므로, 그 숫자는 주장이 아니라 이 하네스가 재는 값이어야 한다.
        { key: "planet-qa", cmd: "npm run qa:all" }
      ])
];

const results = {};
for (const s of steps) {
  process.stdout.write(`▶ ${s.key} … `);
  const r = sh(s.cmd);
  results[s.key] = r;
  console.log(r.ok ? `ok (${(r.ms / 1000).toFixed(1)}s)` : `FAILED\n${r.tail}`);
}

const num = (key, re) => {
  const m = (results[key]?.tail ?? "").match(re);
  return m ? Number(m[1]) : null;
};

// qa/capture.mjs 는 합계 한 줄을 찍지 않는다. 씬마다 `▶ scene <name> — …` 을
// 열고 `  → <status> · N beats · …` 로 닫으므로, 전문에서 그 두 종류의 줄을
// 센다. status 가 `passed` 와 `passed-with-gaps` 인 씬이 종료 코드 0 을 만드는
// 씬(worstExit 은 failed·env-failure 에서만 올라간다)이라 둘 다 통과로 센다.
const countLines = (key, re) => {
  const o = results[key]?.out;
  return o === undefined ? null : (o.match(re) ?? []).length;
};

const commit = (() => {
  // BUILD_COMMIT 이 있으면 **그것이 우선**이다 — source.zip 을 다른 git 체크아웃
  // 안에 풀면 rev-parse 가 엉뚱한 레포의 HEAD 를 돌려준다. 레포 안에서는 이 가상
  // 파일이 존재하지 않으므로(git archive 가 합성) 평소 경로는 rev-parse 다.
  try {
    const c = readFileSync(path.join(LP, "BUILD_COMMIT"), "utf8").trim();
    if (c) return c;
  } catch {}
  try {
    return execSync("git rev-parse --short HEAD", { cwd: LP, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
})();

const report = {
  commit,
  generatedAt: new Date().toISOString(),
  environment: {
    node: process.version,
    platform: `${os.platform()}/${os.arch()}`,
    cpus: os.cpus().length,
    playwright: (() => {
      try {
        return JSON.parse(readFileSync(path.join(LP, "package.json"), "utf8")).devDependencies
          .playwright;
      } catch {
        return null;
      }
    })()
  },
  counts: {
    unitTests: num("unit", /Tests\s+(\d+) passed/),
    journeyContracts: quick ? null : num("journey-contract", /(\d+) passed · \d+ failed/),
    // 이 하네스는 **고속 레인만** 돌린다. 전체 스윕(브라우저 레인 포함)은
    // `npm run universe:mutation-sweep` 로 별도 실행한다 — 15분 넘게 걸려
    // 한 명령 게이트에 넣지 않는다. 키 이름에 레인을 박는 이유: 이전 판의
    // `mutationsKilled: 29` 가 정본 문서의 전체 스윕 수치(55)와 나란히 인쇄돼
    // 모순으로 읽혔다.
    mutationsFastLaneKilled: num("mutation-fast", /killed (\d+)/),
    mutationsFastLaneSurvived: num("mutation-fast", /survived (\d+)/),
    planetScenesPassed: quick ? null : countLines("planet-qa", /^\s*→ passed(?:-with-gaps)? ·/gm),
    planetScenesTotal: quick ? null : countLines("planet-qa", /^▶ scene /gm)
  },
  steps: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, { ok: v.ok, ms: v.ms }])),
  artifacts: {
    // 결정적: 소스에서 순수 계산되는 것
    deterministic: {
      "data/depth-readiness.json": sha(path.join(LP, "data/depth-readiness.json")),
      "public/art/manifest.json": sha(path.join(LP, "public/art/manifest.json"))
    },
    // 비결정적: GPU 래스터화·인코딩·타이밍이 섞인다. 해시는 이번 실행의 기록일
    // 뿐 재현 기준이 아니다 — 재현 기준은 위의 counts 다.
    nonDeterministic: quick
      ? {}
      : { frames: hashTree(path.join(LP, "art-r11/frames")), video: hashTree(path.join(LP, "art-r11/video")) }
  },
  notes: [
    "frames/video 는 GPU 래스터화와 인코딩에 따라 바이트가 달라진다 — 해시는 기록이지 재현 기준이 아니다.",
    "재현 기준은 counts(유닛·여정 계약·변이 스윕)와 각 단계의 ok 여부다.",
    "브라우저 단계는 headless:false 로 실제 GPU 를 쓴다. CI 환경에서는 수치가 달라질 수 있다."
  ]
};

const out = path.join(LP, "art-r11/reproduce-report.json");
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

const failed = Object.entries(results).filter(([, r]) => !r.ok);
console.log(`\ncommit ${commit} · node ${process.version} · ${report.environment.platform}`);
console.log(
  `유닛 ${report.counts.unitTests} · 여정 ${report.counts.journeyContracts ?? "-"} · 변이(고속 레인) killed ${report.counts.mutationsFastLaneKilled}/survived ${report.counts.mutationsFastLaneSurvived} · 행성 앱 QA ${report.counts.planetScenesPassed ?? "-"}/${report.counts.planetScenesTotal ?? "-"} 씬`
);
console.log(`report → ${path.relative(LP, out)}`);
if (failed.length) {
  console.log(`\nFAILED: ${failed.map(([k]) => k).join(", ")}`);
  process.exit(1);
}
