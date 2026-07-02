/**
 * Apply a promotion decision file to /data — the ONE write path.
 *
 * Replaces the per-session hand-rolled write scripts (ops-efficiency package,
 * CPO-ratified 2026-07-02). The flow:
 *
 *   1. Parse the decision file (src/schema/foundry-decision.ts).
 *   2. Build the post-apply state in memory; fail on any structural error
 *      (existing IDs, broken references, provider-ID collisions, ...).
 *   3. Enforce the ratified promotion ladders (lib/ladders.ts) — nothing
 *      unsanctioned ends `reviewed`.
 *   4. Cross-check the rejection ledger — re-admitting a rejected candidate
 *      must be explicit (`override_rejections`).
 *   5. Write /data in canonical form (id-sorted; no spurious diffs on
 *      untouched items), append held/rejection ledgers.
 *   6. Run the full validate:data suite over the written files.
 *
 * Usage:
 *   npm run foundry:apply-batch -- foundry/decisions/<batch-id>.json [--dry-run]
 *
 * Offline by design: no network, no secrets, no LLM. Decision files are the
 * committed audit record — treat them as append-only history once merged.
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";

import { writeDataFileCanonical } from "../lib/canonical-data.ts";
import { checkLadders } from "./lib/ladders.ts";
import { buildPostState, checkAgainstRejections } from "./lib/apply.ts";
import {
  HELD_LEDGER,
  REJECTIONS_LEDGER,
  REPO_ROOT,
  die,
  loadCurrentData,
  loadDecision,
  loadHeld,
  loadRejections,
  writeLedger,
} from "./lib/decision-io.ts";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const path = args.find((a) => !a.startsWith("--"));
if (!path) die("usage: npm run foundry:apply-batch -- foundry/decisions/<batch-id>.json [--dry-run]");

const decision = loadDecision(path);
const post = buildPostState(decision, loadCurrentData());

if (post.errors.length > 0) {
  console.error(`✗ structural preflight failed with ${post.errors.length} error(s):\n`);
  for (const e of post.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const rejectionHits = checkAgainstRejections(decision, loadRejections());
if (rejectionHits.length > 0) {
  console.error(`✗ rejection-ledger conflicts (${rejectionHits.length}):\n`);
  for (const p of rejectionHits) console.error(`  - ${p}`);
  process.exit(1);
}

const findings = checkLadders({
  decision,
  postNodesById: post.nodesById,
  postEdgesById: post.edgesById,
});
const violations = findings.filter((f) => f.level === "violation");
if (violations.length > 0) {
  console.error(`✗ ladder violations (${violations.length}) — nothing written:\n`);
  for (const v of violations) console.error(`  - [${v.subject_id}]${v.ladder ? ` (${v.ladder})` : ""} ${v.message}`);
  process.exit(1);
}
for (const a of findings.filter((f) => f.level === "advisory")) {
  console.log(`⚠ [${a.subject_id}]${a.ladder ? ` (${a.ladder})` : ""} ${a.message}`);
}

if (decision.anchors_pending.length > 0) {
  console.log(`⚠ ${decision.anchors_pending.length} permanence anchor(s) pending — re-run foundry:anchor until clear:`);
  for (const a of decision.anchors_pending) console.log(`  - ${a.url} (${a.reason})`);
}

if (dryRun) {
  console.log(`\n✓ dry run: decision is applicable (${decision.batch_id}). Nothing written.`);
  process.exit(0);
}

// --- Write ---------------------------------------------------------------------
writeDataFileCanonical("nodes.json", post.raw.nodes);
writeDataFileCanonical("edges.json", post.raw.edges);
writeDataFileCanonical("sources.json", post.raw.sources);
writeDataFileCanonical("node-translations.json", post.raw.translations);
writeDataFileCanonical("external-links.json", post.raw.externalLinks);

if (decision.rejections.length > 0) {
  writeLedger(REJECTIONS_LEDGER, [...loadRejections(), ...decision.rejections]);
  console.log(`✓ appended ${decision.rejections.length} entr(ies) to foundry/rejections.json`);
}
if (decision.held.length > 0) {
  writeLedger(HELD_LEDGER, [...loadHeld(), ...decision.held]);
  console.log(`✓ appended ${decision.held.length} entr(ies) to foundry/held.json`);
}

console.log(
  `✓ applied ${decision.batch_id}: +${decision.adds.nodes.length} nodes, ` +
    `+${decision.adds.edges.length} edges, +${decision.adds.sources.length} sources, ` +
    `${decision.promotions.length} promotions, ${decision.translation_updates.length} editorial updates.`,
);

// --- Full validation over the written files --------------------------------------
console.log("\nrunning validate:data over the written files...");
const result = spawnSync("npx", ["tsx", join(REPO_ROOT, "scripts", "validate-data.ts")], {
  stdio: "inherit",
  cwd: REPO_ROOT,
});
if (result.status !== 0) {
  console.error(
    "\n✗ validate:data failed AFTER writing. /data is under git — inspect the " +
      "diff, fix the decision file, and either re-apply on a clean tree or " +
      "git restore data/.",
  );
  process.exit(1);
}
console.log(`\n✓ ${decision.batch_id} applied and validated.`);
