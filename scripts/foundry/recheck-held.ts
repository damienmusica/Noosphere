/**
 * Re-evaluate held/blocked items — the silent-recall fix, run at session start
 * (vault workflow session ritual).
 *
 * Three sweeps, all offline (no network, no LLM):
 *
 * 1. Ledger sweep (foundry/held.json): for every held entry, report the
 *    item's CURRENT /data state next to its recorded blocking condition —
 *    a promotion blocker that has since cleared shows up instead of rotting.
 *    `recheck: machine` entries whose referenced edge now has all-reviewed
 *    endpoints are flagged UNBLOCKED.
 *
 * 2. Derived sweep (/data): every `proposed` node/edge, grouped by what
 *    still blocks it — endpoint-not-reviewed (with the endpoint named),
 *    disputed (clause-6 v2 hold: needs a new supported verdict, not a status
 *    nudge), or no-detectable-blocker (= verdict-blocked or never re-run:
 *    exactly the recheck candidates).
 *
 * 3. Pending-anchor sweep (foundry/decisions/*.json): every `anchors_pending`
 *    entry across all committed decision files — the SPN-outage backlog that
 *    otherwise only surfaces during apply-batch. Re-run
 *    `foundry:anchor -- <decision> --write` when SPN recovers.
 *
 * Output is a worklist for the orchestrator; nothing is written. Promotion
 * still goes through a decision file + apply-batch.
 *
 * Usage: npm run foundry:recheck-held
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { DECISIONS_DIR, loadCurrentData, loadHeld } from "./lib/decision-io.ts";

const data = loadCurrentData();
const held = loadHeld();

const nodesById = new Map(data.nodes.map((n) => [String(n.id), n]));
const edgesById = new Map(data.edges.map((e) => [String(e.id), e]));

// --- 1. Ledger sweep -------------------------------------------------------------
if (held.length > 0) {
  console.log(`Held ledger (${held.length} entr(ies)):\n`);
  for (const h of held) {
    const item = h.id ? nodesById.get(h.id) ?? edgesById.get(h.id) : undefined;
    let state = h.id ? (item ? `status=${item.status}` : "NOT IN /data") : "(no id — foundry-only)";
    let verdict = "";
    if (h.id && item && edgesById.has(h.id)) {
      const source = nodesById.get(String(item.source));
      const target = nodesById.get(String(item.target));
      const blocked = [source, target].filter((n) => n && n.status !== "reviewed");
      if (blocked.length === 0 && h.recheck === "machine") verdict = "  ← UNBLOCKED? endpoints all reviewed";
      else if (blocked.length > 0) state += `; blocking endpoints: ${blocked.map((n) => n!.id).join(", ")}`;
    }
    console.log(`  [${h.recheck}] ${h.id ?? h.label} (${h.batch_id}, ${h.recorded_at})`);
    console.log(`      blocked on: ${h.blocking_condition}`);
    console.log(`      now: ${state}${verdict}\n`);
  }
} else {
  console.log("Held ledger: empty.\n");
}

// --- 2. Derived sweep ------------------------------------------------------------
const proposedNodes = data.nodes.filter((n) => n.status === "proposed");
const proposedEdges = data.edges.filter((e) => e.status === "proposed");

console.log(`Derived sweep: ${proposedNodes.length} proposed node(s), ${proposedEdges.length} proposed edge(s).\n`);

if (proposedNodes.length > 0) {
  console.log("Proposed nodes (need identity grounding or a CPO path):");
  for (const n of proposedNodes) console.log(`  - ${n.id}`);
  console.log("");
}

const ledgeredIds = new Set(held.map((h) => h.id).filter(Boolean));
const endpointBlocked: string[] = [];
const disputedHeld: string[] = [];
const policyBlocked: string[] = [];
const ledgered: string[] = [];
const recheckCandidates: string[] = [];
for (const e of proposedEdges) {
  const source = nodesById.get(String(e.source));
  const target = nodesById.get(String(e.target));
  const blockers = [source, target].filter((n) => !n || n.status !== "reviewed");
  if (blockers.length > 0) {
    endpointBlocked.push(`${e.id} (waiting on ${blockers.map((n) => (n ? `${n.id}:${n.status}` : "missing")).join(", ")})`);
  } else if (e.disputed) {
    disputedHeld.push(`${e.id} (clause-6 v2 hold — needs a new supported verdict)`);
  } else if (ledgeredIds.has(String(e.id))) {
    ledgered.push(`${e.id} (see held-ledger entry above)`);
  } else if (e.evidence_kind !== "externally_sourced") {
    // Editorial-evidenced (or evidence-kind-less legacy) edges stop at proposed
    // by edge promotion policy v1 — re-verifying them cannot promote them.
    policyBlocked.push(`${e.id} (${e.relation}, evidence_kind=${e.evidence_kind ?? "none"})`);
  } else {
    recheckCandidates.push(`${e.id} (${e.relation})`);
  }
}
if (endpointBlocked.length > 0) {
  console.log("Endpoint-blocked edges (clear when the endpoint promotes):");
  for (const s of endpointBlocked) console.log(`  - ${s}`);
  console.log("");
}
if (disputedHeld.length > 0) {
  console.log("Disputed holds (do NOT nudge — re-run the Lane B pipeline):");
  for (const s of disputedHeld) console.log(`  - ${s}`);
  console.log("");
}
if (policyBlocked.length > 0) {
  console.log("Policy-blocked edges (editorial/legacy evidence — stop at proposed until an editorial ladder opens):");
  for (const s of policyBlocked) console.log(`  - ${s}`);
  console.log("");
}
if (ledgered.length > 0) {
  console.log("Ledgered holds (blocking condition recorded in foundry/held.json — not naive candidates):");
  for (const s of ledgered) console.log(`  - ${s}`);
  console.log("");
}
if (recheckCandidates.length > 0) {
  console.log("★ RECHECK CANDIDATES — no structural blocker detected; endpoints all");
  console.log("  reviewed. These were verdict-blocked (NEI) or never re-run:");
  for (const s of recheckCandidates) console.log(`  - ${s}`);
  console.log("");
}
if (
  endpointBlocked.length + disputedHeld.length + policyBlocked.length +
    ledgered.length + recheckCandidates.length === 0 &&
  proposedNodes.length === 0
) {
  console.log("Nothing held anywhere. ✓\n");
}

// --- 3. Pending-anchor sweep -------------------------------------------------------
// Evidence-permanence anchors that failed at anchor time ([SPN-FAILED]) sit in
// each decision file's `anchors_pending`; without this sweep they only surface
// during apply-batch. Lenient read on purpose: one malformed decision file must
// not kill the session-start worklist.
const pendingAnchors: string[] = [];
for (const entry of readdirSync(DECISIONS_DIR).sort()) {
  if (!entry.endsWith(".json")) continue;
  let decision: unknown;
  try {
    decision = JSON.parse(readFileSync(join(DECISIONS_DIR, entry), "utf8"));
  } catch (err) {
    pendingAnchors.push(`${entry}: could not read/parse decision file — ${(err as Error).message}`);
    continue;
  }
  if (!decision || typeof decision !== "object") continue;
  const d = decision as { batch_id?: unknown; anchors_pending?: unknown };
  const batchId = typeof d.batch_id === "string" ? d.batch_id : entry.replace(/\.json$/, "");
  if (!Array.isArray(d.anchors_pending)) continue;
  for (const a of d.anchors_pending as { url?: unknown; reason?: unknown }[]) {
    pendingAnchors.push(`${batchId}: ${String(a?.url ?? "(no url)")} — ${String(a?.reason ?? "(no reason)")}`);
  }
}
console.log("Pending permanence anchors (re-run foundry:anchor -- <decision> --write when SPN recovers):");
if (pendingAnchors.length > 0) {
  for (const s of pendingAnchors) console.log(`  - ${s}`);
  console.log(`  ${pendingAnchors.length} pending anchor(s) total.`);
} else {
  console.log("  none");
}
