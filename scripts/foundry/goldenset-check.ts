/**
 * Offline golden-set regression check for the Wikidata resolver.
 *
 * Usage:
 *   npm run foundry:goldenset                  # checks every source pack found
 *   npm run foundry:goldenset -- <pack.json>…  # checks specific pack files
 *
 * Compares locally generated source packs (dist/foundry/source-packs/<batch>/
 * wikidata.json — produced by the network-dependent resolver, maintainer-local)
 * against the committed golden expectations in
 * `scripts/foundry/wikidata-goldenset.json`. The comparison itself performs
 * **zero network requests** — CI stays network-free; this tool is for the
 * maintainer running a resolver pit-stop locally.
 *
 * Severities (see `expectation_semantics` in the golden file):
 *   FAIL — a verified rank-1 QID vanished from the candidate list, or a
 *          must-not-select QID (rejected orphan stub) got selected.
 *   WARN — a verified rank-1 QID is still a candidate but lost rank 1.
 *   INFO — manual-path parity/improvements, new candidates for known gaps.
 * Exit code 1 when any FAIL is present, else 0.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const GOLDEN_PATH = join(__dirname, "wikidata-goldenset.json");
const PACKS_ROOT = join(REPO_ROOT, "dist", "foundry", "source-packs");

interface GoldenEntry {
  batch: string;
  seed_label: string;
  node_id?: string;
  renamed_from?: string;
  verdict: "verified" | "upstream_gap";
  expected_qid?: string;
  rank1_expected?: boolean;
  manual_path?: boolean;
  must_not_select?: string[];
  notes?: string;
}

interface PackResult {
  seed: { label: string; expected_node_id?: string };
  status: string;
  selected_qid?: string;
  ambiguous: boolean;
  candidates: { qid: string; rank: number }[];
  notes: string[];
}

interface Pack {
  batch_id: string;
  generator?: { name?: string; version?: number };
  results: PackResult[];
}

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function findPackFiles(args: string[]): string[] {
  if (args.length > 0) {
    return args.map((a) => (isAbsolute(a) ? a : resolve(REPO_ROOT, a)));
  }
  if (!existsSync(PACKS_ROOT)) return [];
  const files: string[] = [];
  for (const dir of readdirSync(PACKS_ROOT)) {
    const candidate = join(PACKS_ROOT, dir, "wikidata.json");
    if (existsSync(candidate)) files.push(candidate);
  }
  return files;
}

function main(): void {
  const golden = loadJson<{ entries: GoldenEntry[] }>(GOLDEN_PATH);
  const packFiles = findPackFiles(process.argv.slice(2));
  if (packFiles.length === 0) {
    console.log(
      "No source packs found under dist/foundry/source-packs/ (and none passed as arguments).\n" +
        "Run the resolver locally first: npm run foundry:resolve-wikidata -- foundry/batches/<manifest>.json",
    );
    process.exit(0);
  }

  // Index pack results by expected_node_id, then by seed label, per batch.
  const byBatch = new Map<string, Map<string, PackResult>>();
  for (const file of packFiles) {
    const pack = loadJson<Pack>(file);
    const index = byBatch.get(pack.batch_id) ?? new Map<string, PackResult>();
    for (const r of pack.results) {
      if (r.seed.expected_node_id) index.set(r.seed.expected_node_id, r);
      index.set(`label:${r.seed.label.toLowerCase()}`, r);
    }
    byBatch.set(pack.batch_id, index);
    console.log(`pack: ${file} (batch ${pack.batch_id}, generator v${pack.generator?.version ?? "?"})`);
  }

  let fail = 0;
  let warn = 0;
  let info = 0;
  let pass = 0;
  let skipped = 0;
  const lines: string[] = [];

  for (const e of golden.entries) {
    const index = byBatch.get(e.batch);
    if (!index) {
      skipped++;
      continue; // batch not re-run this pit-stop — fine, goldenset covers all batches
    }
    const result =
      (e.renamed_from && index.get(e.renamed_from)) ||
      (e.node_id && index.get(e.node_id)) ||
      index.get(`label:${e.seed_label.toLowerCase()}`);
    if (!result) {
      fail++;
      lines.push(`FAIL [${e.batch}] ${e.seed_label}: seed missing from source pack entirely`);
      continue;
    }
    const candidateQids = result.candidates.map((c) => c.qid);

    if (e.verdict === "upstream_gap") {
      const selected = result.selected_qid;
      if (selected && e.must_not_select?.includes(selected)) {
        fail++;
        lines.push(
          `FAIL [${e.batch}] ${e.seed_label}: selected ${selected}, a QC-rejected entity (${e.notes ?? ""})`,
        );
      } else if (selected) {
        info++;
        lines.push(
          `INFO [${e.batch}] ${e.seed_label}: known-gap seed now selects ${selected}` +
            `${result.ambiguous ? " (flagged ambiguous)" : ""} — upstream may have matured; manual review`,
        );
      } else {
        pass++;
      }
      continue;
    }

    // verified
    const expected = e.expected_qid!;
    const present = candidateQids.includes(expected);
    const selected = result.selected_qid === expected;
    if (e.manual_path) {
      if (selected) {
        info++;
        lines.push(
          `INFO [${e.batch}] ${e.seed_label}: IMPROVED — manual-path QID ${expected} now selected` +
            `${result.ambiguous ? " (ambiguous flag retained)" : ""}`,
        );
      } else if (present) {
        info++;
        lines.push(
          `INFO [${e.batch}] ${e.seed_label}: IMPROVED — manual-path QID ${expected} now surfaced as a candidate`,
        );
      } else {
        info++;
        lines.push(
          `INFO [${e.batch}] ${e.seed_label}: manual-path QID ${expected} not surfaced (v3 parity — manual selection stays required)`,
        );
      }
      continue;
    }
    if (!present) {
      fail++;
      lines.push(
        `FAIL [${e.batch}] ${e.seed_label}: verified QID ${expected} missing from candidates (regression — was resolver-verified)`,
      );
    } else if (!selected) {
      warn++;
      lines.push(
        `WARN [${e.batch}] ${e.seed_label}: verified QID ${expected} is a candidate but not selected (selected ${result.selected_qid ?? "none"})`,
      );
    } else {
      pass++;
    }
  }

  console.log("");
  for (const l of lines) console.log("  " + l);
  console.log("");
  console.log(
    `Golden-set check: ${pass} pass / ${warn} warn / ${fail} fail / ${info} info` +
      `${skipped ? ` (${skipped} entries skipped — batch not re-run)` : ""}`,
  );
  if (fail > 0) {
    console.error("✗ regressions detected");
    process.exit(1);
  }
  console.log("✓ no regressions");
}

main();
