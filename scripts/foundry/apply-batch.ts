/**
 * Apply a promotion decision file to /data — the ONE write path.
 *
 * Replaces the per-session hand-rolled write scripts (ops-efficiency package,
 * CPO-ratified 2026-07-02). The flow:
 *
 *   1. Parse the decision file (src/schema/foundry-decision.ts); fail on a
 *      self-contradictory decision (an id both held and promoted to reviewed,
 *      or both held and closed) and on a closure of an id that is not held.
 *   2. Build the post-apply state in memory; fail on any structural error
 *      (existing IDs, broken references, provider-ID collisions, ...).
 *   3. Enforce the ratified promotion ladders (lib/ladders.ts) — nothing
 *      unsanctioned ends `reviewed`.
 *   4. Cross-check the rejection ledger — re-admitting a rejected candidate
 *      must be explicit (`override_rejections`).
 *   5. Write /data in canonical form (id-sorted; no spurious diffs on
 *      untouched items).
 *   6. Run the full validate:data suite over the written files. On failure,
 *      only /data needs `git restore` — the ledgers have not been touched.
 *   7. Only after validation passes, append the held/rejection ledgers
 *      (idempotent: entries already ledgered verbatim are skipped) and drop
 *      held entries this batch resolved (promotion) or closed (terminal
 *      disposition that is not a promotion — `held_resolutions`).
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
  filterAlreadyLedgered,
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

// --- Self-contradiction preflight ---------------------------------------------------
// An id cannot be both held (promotion blocked) and promoted to reviewed in the
// same decision — that is an authoring error, refused before anything is written.
const heldIdsInDecision = new Set(decision.held.filter((h) => h.id).map((h) => h.id as string));
const contradictions = [
  ...new Set(
    decision.promotions.filter((p) => p.to === "reviewed" && heldIdsInDecision.has(p.id)).map((p) => p.id),
  ),
];
if (contradictions.length > 0) {
  for (const id of contradictions) {
    console.error(`✗ decision is self-contradictory: ${id} is both promoted to reviewed and held`);
  }
  process.exit(1);
}

// An id cannot be both re-held and terminally closed in the same decision, and
// closing an id that is not on the worklist is an authoring error too — a silent
// no-op would hide a typo'd id behind a green run.
const closureIds = new Set(decision.held_resolutions.map((r) => r.id));
const closureContradictions = [...closureIds].filter((id) => heldIdsInDecision.has(id));
if (closureContradictions.length > 0) {
  for (const id of closureContradictions) {
    console.error(`✗ decision is self-contradictory: ${id} is both held and closed`);
  }
  process.exit(1);
}
if (closureIds.size > 0) {
  const ledgeredNow = new Set(loadHeld().map((h) => h.id).filter(Boolean));
  const notHeld = [...closureIds].filter((id) => !ledgeredNow.has(id));
  if (notHeld.length > 0) {
    for (const id of notHeld) {
      console.error(`✗ held_resolutions closes ${id}, which is not in foundry/held.json`);
    }
    process.exit(1);
  }
}

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

// --- Write /data ------------------------------------------------------------------
writeDataFileCanonical("nodes.json", post.raw.nodes);
writeDataFileCanonical("edges.json", post.raw.edges);
writeDataFileCanonical("sources.json", post.raw.sources);
writeDataFileCanonical("node-translations.json", post.raw.translations);
writeDataFileCanonical("external-links.json", post.raw.externalLinks);

console.log(
  `✓ applied ${decision.batch_id}: +${decision.adds.nodes.length} nodes, ` +
    `+${decision.adds.edges.length} edges, +${decision.adds.sources.length} sources, ` +
    `${decision.promotions.length} promotions, ${decision.translation_updates.length} editorial updates.`,
);

// --- Full validation over the written /data files -----------------------------------
// The ledgers are written only after this passes, so a failed apply leaves the
// ledgers untouched and the recovery is exactly `git restore data/`.
console.log("\nrunning validate:data over the written files...");
const result = spawnSync("npx", ["tsx", join(REPO_ROOT, "scripts", "validate-data.ts")], {
  stdio: "inherit",
  cwd: REPO_ROOT,
});
if (result.status !== 0) {
  console.error(
    "\n✗ validate:data failed AFTER writing /data. The held/rejection ledgers were " +
      "NOT touched. /data is under git — inspect the diff, fix the decision file, " +
      "and either re-apply on a clean tree or git restore data/.",
  );
  process.exit(1);
}

// --- Ledgers (validated applies only; appends are idempotent) -----------------------
if (decision.rejections.length > 0) {
  const existingRejections = loadRejections();
  const { fresh, skipped } = filterAlreadyLedgered(existingRejections, decision.rejections);
  if (fresh.length > 0) writeLedger(REJECTIONS_LEDGER, [...existingRejections, ...fresh]);
  console.log(
    `✓ appended ${fresh.length} entr(ies) to foundry/rejections.json` +
      (skipped > 0 ? ` (${skipped} duplicate entr(ies) skipped — already ledgered)` : ""),
  );
}
// The held ledger is a WORKLIST (latest blocking condition per id), not the
// audit trail — that lives in the decision files. Three worklist semantics:
//   - a re-triage of an already-held id SUPERSEDES the prior entry,
//   - a promotion to reviewed RESOLVES the id's held entry (the blocking
//     condition no longer exists) — it is dropped, with a log line,
//   - an explicit `held_resolutions` entry CLOSES the id (terminal disposition
//     that is not a promotion: deprecated, or re-scoped onto another id).
// Label-only entries (no id) always plain-append. Duplicates are filtered
// BEFORE supersession so a re-applied verbatim entry keeps, not drops, the
// existing one.
const promotedToReviewed = new Set(
  decision.promotions.filter((p) => p.to === "reviewed" && p.from !== "reviewed").map((p) => p.id),
);
if (decision.held.length > 0 || promotedToReviewed.size > 0 || closureIds.size > 0) {
  const existingHeld = loadHeld();
  const { fresh: freshHeld, skipped: heldSkipped } = filterAlreadyLedgered(existingHeld, decision.held);
  const incomingIds = new Set(freshHeld.filter((h) => h.id).map((h) => h.id as string));
  const keptHeld = existingHeld.filter(
    (h) => !h.id || (!incomingIds.has(h.id) && !promotedToReviewed.has(h.id) && !closureIds.has(h.id)),
  );
  const resolved = existingHeld.filter((h) => h.id && promotedToReviewed.has(h.id));
  const closed = existingHeld.filter((h) => h.id && closureIds.has(h.id));
  const superseded = existingHeld.length - keptHeld.length - resolved.length - closed.length;
  if (freshHeld.length > 0 || resolved.length > 0 || closed.length > 0) {
    writeLedger(HELD_LEDGER, [...keptHeld, ...freshHeld]);
  }
  if (decision.held.length > 0) {
    console.log(
      `✓ appended ${freshHeld.length} entr(ies) to foundry/held.json` +
        (superseded > 0 ? ` (${superseded} prior entr(ies) for the same id(s) superseded)` : "") +
        (heldSkipped > 0 ? ` (${heldSkipped} duplicate entr(ies) skipped — already ledgered)` : ""),
    );
  }
  for (const r of resolved) {
    console.log(`✓ held entry resolved by promotion to reviewed: ${r.id}`);
  }
  for (const r of decision.held_resolutions) {
    console.log(`✓ held entry closed: ${r.id} — ${r.reason}`);
  }
}

console.log(`\n✓ ${decision.batch_id} applied and validated.`);
