/**
 * Build an offline proposal skeleton for a Data Foundry batch manifest.
 *
 * Usage:
 *   npm run foundry:proposal-skeleton -- foundry/batches/<manifest>.json
 *
 * Validates the manifest, derives the output directory from
 * `manifest.output.proposal_dir` (always under `dist/foundry/...`), and writes a
 * candidate proposal skeleton: a normalized manifest copy, empty data arrays for
 * each graph file shape, a small deterministic report, and a README explaining
 * that the output is generated candidate data, not source-of-truth graph data.
 *
 * This script is offline-first and read-only with respect to canonical data:
 * it performs no network calls, never reads or writes `/data`, requires no
 * environment variables or secrets, never calls cloud LLM or public knowledge
 * APIs, and never marks anything reviewed or indexable. It may overwrite its own
 * generated skeleton files under `dist/foundry/...`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve, relative, isAbsolute } from "node:path";

import { foundryBatchSchema } from "../../src/schema/foundry-batch.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

function die(msg: string): never {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

/** Write `value` as pretty JSON with a trailing newline (matches repo style). */
function writeJson(path: string, value: unknown): void {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

// --- Resolve and validate the manifest argument ------------------------------
const manifestArg = process.argv[2];
if (!manifestArg) {
  die(
    "missing manifest path. Usage: npm run foundry:proposal-skeleton -- foundry/batches/<manifest>.json",
  );
}

const manifestPath = isAbsolute(manifestArg) ? manifestArg : resolve(REPO_ROOT, manifestArg);

let raw: unknown;
try {
  raw = JSON.parse(readFileSync(manifestPath, "utf8"));
} catch (err) {
  die(`could not read/parse manifest "${manifestArg}": ${(err as Error).message}`);
}

const parsed = foundryBatchSchema.safeParse(raw);
if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  die(`manifest "${manifestArg}" failed schema validation:\n${details}`);
}
const manifest = parsed.data;

// --- Derive and guard the output directory -----------------------------------
// The schema constrains proposal_dir to live under dist/foundry/, but guard
// against path traversal so generated output can never escape that sandbox.
const outDir = resolve(REPO_ROOT, manifest.output.proposal_dir);
const distFoundry = resolve(REPO_ROOT, "dist", "foundry");
const rel = relative(distFoundry, outDir);
if (rel.startsWith("..") || isAbsolute(rel)) {
  die(`output dir "${manifest.output.proposal_dir}" must resolve under dist/foundry/`);
}

mkdirSync(outDir, { recursive: true });

// --- Write the skeleton ------------------------------------------------------
const generatedAt = new Date().toISOString();

// Empty data arrays — one per graph file shape. No graph data is generated here.
const emptyFiles: Record<string, unknown[]> = {
  "nodes.json": [],
  "node-translations.json": [],
  "edges.json": [],
  "external-links.json": [],
  "sources.json": [],
  "learning-paths.json": [],
};

writeJson(join(outDir, "manifest.json"), manifest);
for (const [file, value] of Object.entries(emptyFiles)) {
  writeJson(join(outDir, file), value);
}

const report = {
  batch_id: manifest.id,
  status: "skeleton",
  generated_at: generatedAt,
  counts: {
    nodes: 0,
    translations: 0,
    edges: 0,
    external_links: 0,
    sources: 0,
    learning_paths: 0,
  },
  notes: [
    "This is a candidate proposal skeleton.",
    "It is not canonical graph data.",
    "Do not commit generated dist/foundry outputs.",
  ],
};
writeJson(join(outDir, "report.json"), report);

const readme = `# Proposal skeleton — ${manifest.title}

Batch: \`${manifest.id}\`

This directory is **generated candidate output** produced by
\`npm run foundry:proposal-skeleton\`. It is **not** source-of-truth graph data.

- The canonical, accepted graph data lives in \`/data\`. This skeleton does not
  modify \`/data\` in any way.
- Everything here is a *candidate* / *proposal* shell. Nothing is \`reviewed\` or
  \`indexable\`.
- These files live under \`dist/foundry/...\`, which is generated output and is
  **gitignored** — do not commit it.
- This scaffold is offline: no public knowledge APIs and no cloud LLM APIs are
  called. Future resolver PRs may populate these files from open/free/public
  knowledge sources.

Files:

- \`manifest.json\` — normalized copy of the validated batch manifest.
- \`nodes.json\`, \`node-translations.json\`, \`edges.json\`,
  \`external-links.json\`, \`sources.json\`, \`learning-paths.json\` — empty
  candidate arrays, one per graph file shape.
- \`report.json\` — small deterministic skeleton report.
`;
writeFileSync(join(outDir, "README.md"), readme, "utf8");

// --- Summary -----------------------------------------------------------------
const relOut = relative(REPO_ROOT, outDir);
console.log(`✓ Wrote proposal skeleton for ${manifest.id} to ${relOut}/`);
console.log("  files: manifest.json, nodes.json, node-translations.json, edges.json,");
console.log("         external-links.json, sources.json, learning-paths.json, report.json, README.md");
console.log("  note:  generated candidate output (not canonical graph data); dist/foundry is gitignored.");
