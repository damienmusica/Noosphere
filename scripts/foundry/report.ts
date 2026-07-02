/**
 * Render a batch report skeleton from a promotion decision file.
 *
 * The factual sections of a batch report — verdict table, identity table,
 * ladder outcomes, tally, §8 permanence anchors — are all derivable from the
 * decision file, so they are generated, not hand-written. The judgment prose
 * (what QC actually weighed, pattern observations, probe design) stays human/
 * LLM-authored in the "Orchestrator commentary" section this skeleton leaves
 * open. Facts machine-rendered from the audit record are more trustworthy
 * than retyped ones; commentary stays where judgment lives.
 *
 * Usage:
 *   npm run foundry:report -- foundry/decisions/<batch>.json           # stdout
 *   npm run foundry:report -- foundry/decisions/<batch>.json --write   # foundry/decisions/<batch>.report.md
 *
 * Offline and deterministic: no network, no LLM. Includes the live
 * ladder-check result so a report can never silently describe an
 * unsanctioned promotion as promoted.
 */
import { writeFileSync } from "node:fs";

import { checkLadders } from "./lib/ladders.ts";
import { buildPostState } from "./lib/apply.ts";
import { die, loadCurrentData, loadDecision } from "./lib/decision-io.ts";
import type { FoundryDecision } from "../../src/schema/foundry-decision.ts";

const args = process.argv.slice(2);
const writeBack = args.includes("--write");
const decisionPath = args.find((a) => !a.startsWith("--"));
if (!decisionPath) die("usage: npm run foundry:report -- foundry/decisions/<batch>.json [--write]");

const decision: FoundryDecision = loadDecision(decisionPath);
const post = buildPostState(decision, loadCurrentData());
const findings = post.errors.length === 0
  ? checkLadders({ decision, postNodesById: post.nodesById, postEdgesById: post.edgesById })
  : [];
const violations = findings.filter((f) => f.level === "violation");

const lines: string[] = [];
const push = (s = "") => lines.push(s);

push(`# ${decision.batch_id} — promotion decision report`);
push();
push(
  `**Decided ${decision.decided_at}** · QC by ${decision.qc_by.model_name} ` +
    `(\`${decision.qc_by.model_version}\`) · generated from ` +
    `\`${decisionPath.replace(/^.*foundry\//, "foundry/")}\` by \`npm run foundry:report\`.`,
);
push();
if (post.errors.length > 0) {
  push(`> ⚠ **STRUCTURAL PREFLIGHT FAILED** (${post.errors.length} errors) — this decision does not apply cleanly:`);
  for (const e of post.errors) push(`> - ${e}`);
} else if (violations.length > 0) {
  push(`> ⚠ **LADDER VIOLATIONS** (${violations.length}) — apply-batch will refuse this decision:`);
  for (const v of violations) push(`> - [${v.subject_id}] ${v.message}`);
} else {
  push(`> ✓ ladder-check: every reviewed outcome is sanctioned.`);
}
push();

// --- Verdicts ---------------------------------------------------------------------
if (decision.verdicts.length > 0) {
  push(`## Verdicts`);
  push();
  push(`| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |`);
  push(`|---|---|---|---|---|---|`);
  for (const v of decision.verdicts) {
    const indep = v.sources.filter((s) => s.independent).length;
    push(
      `| \`${v.subject_id}\` | **${v.verdict}** | ` +
        `${v.direction_confirmed === undefined ? "—" : v.direction_confirmed ? "✓" : "✗"} | ` +
        `${v.identity_referent_verified === undefined ? "—" : v.identity_referent_verified ? "✓" : "✗"} | ` +
        `${v.sources.length} (${indep}) | ${(v.notes ?? "").replace(/\|/g, "\\|")} |`,
    );
  }
  push();
}

// --- Identity ----------------------------------------------------------------------
if (decision.identity.length > 0) {
  push(`## Identity verification`);
  push();
  push(`| Node | Anchor | Verified | Method | Retrieved | Notes |`);
  push(`|---|---|---|---|---|---|`);
  for (const r of decision.identity) {
    push(
      `| \`${r.node_id}\` | ${r.provider}:${r.external_id} | ${r.verified ? "✓" : "✗"} | ` +
        `${r.method} | ${r.retrieved_at}${r.p570_absent_confirmed_at ? ` (P570 absent ${r.p570_absent_confirmed_at})` : ""} | ` +
        `${(r.notes ?? "").replace(/\|/g, "\\|")} |`,
    );
  }
  push();
}

// --- Outcomes ---------------------------------------------------------------------
push(`## Outcomes`);
push();
const sanctionBySubject = new Map(decision.sanctions.map((s) => [s.subject_id, s]));
const outcomeRows: string[] = [];
for (const n of decision.adds.nodes) {
  outcomeRows.push(`| \`${n.id}\` | node add | ${n.status} | ${sanctionBySubject.get(n.id)?.ladder ?? "—"} |`);
}
for (const e of decision.adds.edges) {
  outcomeRows.push(`| \`${e.id}\` | edge add (${e.relation}) | ${e.status} | ${sanctionBySubject.get(e.id)?.ladder ?? "—"} |`);
}
for (const p of decision.promotions) {
  outcomeRows.push(`| \`${p.id}\` | ${p.kind} ${p.from}→${p.to} | ${p.to} | ${sanctionBySubject.get(p.id)?.ladder ?? "—"} |`);
}
for (const t of decision.translation_updates) {
  outcomeRows.push(`| \`${t.node_id}\`@${t.locale} | summary update | ${t.reviewed ? "reviewed" : "unreviewed"} | ${sanctionBySubject.get(t.node_id)?.ladder ?? "—"} |`);
}
if (outcomeRows.length > 0) {
  push(`| Subject | Change | Final status | Ladder |`);
  push(`|---|---|---|---|`);
  for (const row of outcomeRows) push(row);
  push();
}

// --- Tally -------------------------------------------------------------------------
push(`## Tally`);
push();
const reviewedAdds =
  decision.adds.nodes.filter((n) => n.status === "reviewed").length +
  decision.adds.edges.filter((e) => e.status === "reviewed").length;
const reviewedPromotions = decision.promotions.filter((p) => p.to === "reviewed").length;
push(
  `- Adds: ${decision.adds.nodes.length} nodes, ${decision.adds.edges.length} edges, ` +
    `${decision.adds.sources.length} sources, ${decision.adds.translations.length} translations, ` +
    `${decision.adds.external_links.length} external links.`,
);
push(`- Reviewed outcomes: ${reviewedAdds} adds + ${reviewedPromotions} promotions (all ladder-sanctioned above).`);
push(`- Editorial summary updates: ${decision.translation_updates.length}.`);
if (decision.held.length > 0) {
  push(`- **Held** (${decision.held.length}):`);
  for (const h of decision.held) {
    push(`  - ${h.id ? `\`${h.id}\`` : h.label}: ${h.blocking_condition} (recheck: ${h.recheck})`);
  }
}
if (decision.rejections.length > 0) {
  push(`- **Rejected** (${decision.rejections.length}, recorded in foundry/rejections.json):`);
  for (const r of decision.rejections) push(`  - ${r.label}: ${r.reason}`);
}
push();

// --- §8 permanence anchors -----------------------------------------------------------
const anchored: string[] = [];
for (const v of decision.verdicts) {
  for (const s of v.sources) {
    if (s.snapshot_url) anchored.push(`- ${s.url} → ${s.snapshot_url}`);
    if (s.revision_permalink) anchored.push(`- ${s.url} → ${s.revision_permalink}`);
  }
}
push(`## §8 permanence anchors`);
push();
if (anchored.length === 0 && decision.anchors_pending.length === 0) {
  push(`[NO-EXTERNAL-EVIDENCE]`);
} else {
  for (const a of [...new Set(anchored)]) push(a);
  for (const p of decision.anchors_pending) {
    push(`- ${p.url} — ${p.reason.includes("[SPN-FAILED]") ? p.reason : `[SPN-FAILED] ${p.reason}`}`);
  }
}
push();

// --- Commentary placeholder -----------------------------------------------------------
push(`## Orchestrator commentary`);
push();
push(`<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,`);
push(`     pattern observations, anything the next session should know. The tables`);
push(`     above are generated — edit the decision file, not the tables. -->`);
push();

const rendered = lines.join("\n");
if (writeBack) {
  const out = decisionPath.replace(/\.json$/, ".report.md");
  writeFileSync(out, rendered);
  console.log(`✓ wrote ${out}`);
} else {
  console.log(rendered);
}
