/**
 * Promotion-ladder arithmetic for a decision file — read-only.
 *
 * Builds the post-apply state in memory and checks every reviewed outcome
 * against the ratified ladders (scripts/foundry/lib/ladders.ts). No network,
 * no writes. apply-batch runs the same checks before writing; run this
 * standalone to sanity-check a decision while drafting it.
 *
 * Usage:
 *   npm run foundry:ladder-check -- foundry/decisions/<batch-id>.json
 *
 * Exit codes: 0 = no violations (advisories allowed), 1 = violations or
 * structural preflight errors.
 */
import { checkLadders } from "./lib/ladders.ts";
import { buildPostState, checkAgainstRejections } from "./lib/apply.ts";
import { die, loadCurrentData, loadDecision, loadRejections } from "./lib/decision-io.ts";

const path = process.argv[2];
if (!path) die("usage: npm run foundry:ladder-check -- foundry/decisions/<batch-id>.json");

const decision = loadDecision(path);
const post = buildPostState(decision, loadCurrentData());

if (post.errors.length > 0) {
  console.error(`✗ structural preflight failed with ${post.errors.length} error(s):\n`);
  for (const e of post.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const rejectionHits = checkAgainstRejections(decision, loadRejections());
const findings = checkLadders({
  decision,
  postNodesById: post.nodesById,
  postEdgesById: post.edgesById,
});
const violations = findings.filter((f) => f.level === "violation");
const advisories = findings.filter((f) => f.level === "advisory");

console.log(`Ladder check — ${decision.batch_id} (decided ${decision.decided_at})`);
console.log(
  `  adds: ${decision.adds.nodes.length} nodes, ${decision.adds.edges.length} edges, ` +
    `${decision.adds.sources.length} sources | promotions: ${decision.promotions.length} | ` +
    `editorial updates: ${decision.translation_updates.length}`,
);
console.log(
  `  verdicts: ${decision.verdicts.length} | sanctions: ${decision.sanctions.length} | ` +
    `rejections: ${decision.rejections.length} | held: ${decision.held.length}\n`,
);

if (rejectionHits.length > 0) {
  console.error(`✗ rejection-ledger conflicts (${rejectionHits.length}):`);
  for (const p of rejectionHits) console.error(`  - ${p}`);
  console.error("");
}
if (violations.length > 0) {
  console.error(`✗ ladder violations (${violations.length}):`);
  for (const v of violations) console.error(`  - [${v.subject_id}]${v.ladder ? ` (${v.ladder})` : ""} ${v.message}`);
  console.error("");
}
if (advisories.length > 0) {
  console.log(`⚠ advisories (${advisories.length}):`);
  for (const a of advisories) console.log(`  - [${a.subject_id}]${a.ladder ? ` (${a.ladder})` : ""} ${a.message}`);
  console.log("");
}

if (violations.length > 0 || rejectionHits.length > 0) process.exit(1);
console.log(`✓ every reviewed outcome is ladder-sanctioned.`);
