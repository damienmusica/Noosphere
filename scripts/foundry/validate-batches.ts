/**
 * Offline validator for Data Foundry batch manifests.
 *
 * Finds every `*.json` under `foundry/batches`, validates each against
 * `foundryBatchSchema`, checks for duplicate batch IDs, and prints a concise,
 * deterministic report. Exits non-zero on any validation error.
 *
 * This script is offline-first: it performs no network calls, reads/writes
 * nothing under `/data`, requires no environment variables, and requires no
 * secrets. Run with: npm run foundry:validate-batches
 */
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

import { foundryBatchSchema, type FoundryBatch } from "../../src/schema/foundry-batch.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const BATCHES_DIR = join(REPO_ROOT, "foundry", "batches");

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

/** List `*.json` files in the batches dir, sorted for deterministic output. */
function listBatchFiles(): string[] {
  let entries: string[];
  try {
    entries = readdirSync(BATCHES_DIR);
  } catch (err) {
    fail(`could not read foundry/batches: ${(err as Error).message}`);
    return [];
  }
  return entries.filter((f) => f.endsWith(".json")).sort();
}

const files = listBatchFiles();
const batches: { file: string; batch: FoundryBatch }[] = [];

for (const file of files) {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(join(BATCHES_DIR, file), "utf8"));
  } catch (err) {
    fail(`[${file}] could not read/parse JSON: ${(err as Error).message}`);
    continue;
  }
  const result = foundryBatchSchema.safeParse(raw);
  if (!result.success) {
    for (const issue of result.error.issues) {
      fail(`[${file}] ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
    continue;
  }
  batches.push({ file, batch: result.data });
}

// --- Duplicate batch IDs -----------------------------------------------------
{
  const seen = new Map<string, string>();
  for (const { file, batch } of batches) {
    const prev = seen.get(batch.id);
    if (prev) {
      fail(`duplicate batch id "${batch.id}" in ${file} (already defined in ${prev})`);
    } else {
      seen.set(batch.id, file);
    }
  }
}

// --- Duplicate output dirs ---------------------------------------------------
// Two different batches sharing an output.proposal_dir would have the proposal
// skeleton builder silently overwrite one batch's generated output with the
// other's. Key on the *resolved* path (matching how build-proposal-skeleton.ts
// resolves it) so aliases like `./` or doubled slashes still collide here.
{
  const seen = new Map<string, string>();
  for (const { file, batch } of batches) {
    const resolved = resolve(REPO_ROOT, batch.output.proposal_dir);
    const prev = seen.get(resolved);
    if (prev) {
      fail(
        `duplicate output.proposal_dir "${batch.output.proposal_dir}" in ${file} ` +
          `(resolves to the same directory already used by ${prev})`,
      );
    } else {
      seen.set(resolved, file);
    }
  }
}

// --- Report ------------------------------------------------------------------
if (errors.length > 0) {
  console.error(`\n✗ Foundry batch validation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}

console.log(`✓ Foundry batch validation passed: ${batches.length} manifest(s).\n`);
for (const { file, batch } of batches) {
  const allowed = batch.allowed_public_sources.map((s) => s.provider).sort();
  const forbidden = batch.forbidden_sources.map((s) => s.provider).sort();
  console.log(`• ${batch.id} — ${batch.title} [${batch.status}]`);
  console.log(`    file:             foundry/batches/${file}`);
  console.log(`    seed entities:    ${batch.seed_entities.length}`);
  console.log(`    target locales:   ${batch.target_locales.join(", ")}`);
  console.log(`    allowed sources:  ${allowed.length > 0 ? allowed.join(", ") : "(none)"}`);
  console.log(`    forbidden sources:${forbidden.length > 0 ? " " + forbidden.join(", ") : " (none)"}`);
  console.log(`    output dir:       ${batch.output.proposal_dir}`);
}
console.log("");
