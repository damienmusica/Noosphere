/**
 * Rewrite every /data file into canonical form (scripts/lib/canonical-data.ts):
 * top-level items sorted by their stable key, 2-space indent, trailing newline.
 *
 * Before writing, each rewrite is proven to be a semantic no-op (same multiset
 * of items by deep value equality). A rewrite that would change data fails hard.
 *
 * Usage:
 *   npm run format:data            # rewrite files that deviate
 *   npm run format:data -- --check # report deviations, write nothing, exit 1 if any
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  DATA_DIR,
  DATA_FILES,
  assertSemanticallyEqual,
  canonicalStringify,
  readDataFile,
  writeDataFileCanonical,
} from "./lib/canonical-data.ts";

const checkOnly = process.argv.includes("--check");
let deviations = 0;

for (const file of DATA_FILES) {
  const raw = readFileSync(join(DATA_DIR, file), "utf8");
  const items = readDataFile(file);
  const canonical = canonicalStringify(file, items);
  if (raw === canonical) {
    console.log(`  ${file}: canonical`);
    continue;
  }
  deviations++;
  if (checkOnly) {
    console.log(`✗ ${file}: not canonical`);
    continue;
  }
  const rewritten = JSON.parse(canonical) as Record<string, unknown>[];
  assertSemanticallyEqual(file, items, rewritten);
  writeDataFileCanonical(file, items);
  console.log(`✓ ${file}: rewritten canonically (semantic no-op verified)`);
}

if (checkOnly && deviations > 0) {
  console.error(`\n${deviations} file(s) deviate — run: npm run format:data`);
  process.exit(1);
}
console.log(deviations === 0 ? "\nAll data files canonical." : `\n${deviations} file(s) rewritten.`);
