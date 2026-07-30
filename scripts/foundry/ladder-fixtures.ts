/**
 * Golden fixtures for the ratified promotion ladders (decision (114)).
 *
 * Purpose: THRESHOLD FIDELITY, not name completeness. Every ladder in
 * `lib/ladders.ts` gets at least one fixture that must PASS and one that must
 * be BLOCKED at its ratified threshold, run offline in CI. A mistranscribed
 * threshold (a ≥2 copied as ≥1, a relation dropped from EDGE_AUTO_LADDER, a
 * safety net silently deleted) fails a fixture immediately — the transcription
 * failure class that prose co-change obligations cannot catch, because an
 * omission is invisible until executed (the decision-(88) incident: a ladder
 * ratified in session #48 was absent from code for four waves and no document
 * audit could have seen it). Adopted from the session #61 adversarial review
 * as the honest replacement of a name-completeness `report:policy`.
 *
 * Fixtures are synthetic FoundryDecision objects validated through the real
 * zod schema before checkLadders runs, so decision-schema drift surfaces here
 * too. Codified through decision (114); thresholds mirror docs/data-foundry.md
 * §8 — if a fixture and §8 diverge, that is a §15.4 stop-point.
 */
import { foundryDecisionSchema, type FoundryDecision } from "../../src/schema/foundry-decision.ts";
import { nodeSchema, type Node } from "../../src/schema/node.ts";
import { edgeSchema, type Edge } from "../../src/schema/edge.ts";
import { checkLadders, type LadderFinding } from "./lib/ladders.ts";

const DATE = "2026-07-30";
const QC = { model_name: "ladder-fixture", model_version: "ladder-fixture", proposed_at: DATE };

function mkNode(id: string, over: Record<string, unknown> = {}): Node {
  return nodeSchema.parse({
    id,
    type: id.split(":")[0],
    domain: "formal_sciences",
    level: 2,
    status: "reviewed",
    external_ids: {},
    created_at: DATE,
    updated_at: DATE,
    ...over,
  });
}

function mkEdge(
  id: string,
  source: string,
  target: string,
  relation: string,
  over: Record<string, unknown> = {},
): Edge {
  return edgeSchema.parse({
    id,
    source,
    target,
    relation,
    confidence: 0.8,
    status: "reviewed",
    evidence: ["source:fixture"],
    evidence_kind: "externally_sourced",
    ...over,
  });
}

function mkDecision(partial: Record<string, unknown>): FoundryDecision {
  return foundryDecisionSchema.parse({
    version: 1,
    batch_id: "ladder-fixtures",
    decided_at: DATE,
    qc_by: QC,
    ...partial,
  });
}

function src(independent: boolean, n: number) {
  return Array.from({ length: n }, (_, i) => ({
    url: `https://example.org/fixture-${i}`,
    retrieved_at: DATE,
    independent,
  }));
}

/** Context endpoints shared by edge fixtures (already-reviewed graph state). */
const CONTEXT: Node[] = [
  mkNode("person:fixture-founder", { type: "person" }),
  mkNode("subfield:fixture-field"),
  mkNode("field:fixture-parent", { type: "field", level: 1 }),
  mkNode("work:fixture-work", { type: "work" }),
  mkNode("subfield:fixture-proposed", { status: "proposed" }),
  // An already-reviewed LIVING person, so edge fixtures can exercise the
  // decision-(70) endpoint cross-check in both of its arms.
  mkNode("person:fixture-living-ctx", { type: "person", is_living_person: true }),
];

type Fixture = {
  name: string;
  /**
   * "pass"     — zero violations.
   * "block"    — ≥1 violation containing `fragment`.
   * "advisory" — zero violations AND ≥1 advisory containing `fragment`.
   *              Advisories change gate behaviour when they silently become
   *              violations (or vanish), so they need coverage too.
   */
  expect: "pass" | "block" | "advisory";
  fragment?: string;
  decision: FoundryDecision;
  /** Post-apply nodes for subjects not present in `adds` (promotion targets). */
  extraPost?: Node[];
  /** Post-apply edges for edge subjects promoted rather than added. */
  extraPostEdges?: Edge[];
};

const fixtures: Fixture[] = [
  // ---- node-promotion-v1 ----------------------------------------------------
  {
    name: "node-promotion-v1 clean promotion",
    expect: "pass",
    decision: mkDecision({
      adds: { nodes: [mkNode("concept:fixture-a", { type: "concept", external_ids: { wikidata: "Q1" } })] },
      identity: [{ node_id: "concept:fixture-a", provider: "wikidata", external_id: "Q1", verified: true, method: "wbgetentities", retrieved_at: DATE }],
      sanctions: [{ subject_id: "concept:fixture-a", ladder: "node-promotion-v1" }],
    }),
  },
  {
    name: "node-promotion-v1 blocks unverified identity",
    expect: "block",
    fragment: "requires a verified wikidata identity record",
    decision: mkDecision({
      adds: { nodes: [mkNode("concept:fixture-a", { type: "concept", external_ids: { wikidata: "Q1" } })] },
      identity: [{ node_id: "concept:fixture-a", provider: "wikidata", external_id: "Q1", verified: false, method: "wbgetentities", retrieved_at: DATE }],
      sanctions: [{ subject_id: "concept:fixture-a", ladder: "node-promotion-v1" }],
    }),
  },
  // ---- node-promotion-v1.4 --------------------------------------------------
  {
    name: "node-promotion-v1.4 clean promotion (ratified anchor, 2 authorities)",
    expect: "pass",
    decision: mkDecision({
      adds: { nodes: [mkNode("subfield:fixture-b", { external_ids: { philpapers: "cat-1" } })] },
      identity: [{ node_id: "subfield:fixture-b", provider: "philpapers", external_id: "cat-1", verified: true, method: "manual", retrieved_at: DATE }],
      verdicts: [{ subject_id: "subfield:fixture-b", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "subfield:fixture-b", ladder: "node-promotion-v1.4" }],
    }),
  },
  {
    name: "node-promotion-v1.4 blocks at 1 independent authority (threshold ≥2)",
    expect: "block",
    fragment: "≥2 independent authorities",
    decision: mkDecision({
      adds: { nodes: [mkNode("subfield:fixture-b", { external_ids: { philpapers: "cat-1" } })] },
      identity: [{ node_id: "subfield:fixture-b", provider: "philpapers", external_id: "cat-1", verified: true, method: "manual", retrieved_at: DATE }],
      verdicts: [{ subject_id: "subfield:fixture-b", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "subfield:fixture-b", ladder: "node-promotion-v1.4" }],
    }),
  },
  {
    name: "node-promotion-v1.4 blocks an unverified anchor record",
    expect: "block",
    fragment: "requires a verified identity anchor from the ratified taxonomy-authority registry",
    decision: mkDecision({
      adds: { nodes: [mkNode("subfield:fixture-b", { external_ids: { philpapers: "cat-1" } })] },
      identity: [{ node_id: "subfield:fixture-b", provider: "philpapers", external_id: "cat-1", verified: false, method: "manual", retrieved_at: DATE }],
      verdicts: [{ subject_id: "subfield:fixture-b", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "subfield:fixture-b", ladder: "node-promotion-v1.4" }],
    }),
  },
  {
    name: "node-promotion-v1.4 blocks an unratified anchor provider",
    expect: "block",
    fragment: "not in the ratified taxonomy-authority registry",
    decision: mkDecision({
      adds: { nodes: [mkNode("subfield:fixture-b", { external_ids: { lcc: "B123" } })] },
      identity: [{ node_id: "subfield:fixture-b", provider: "lcc", external_id: "B123", verified: true, method: "manual", retrieved_at: DATE }],
      verdicts: [{ subject_id: "subfield:fixture-b", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "subfield:fixture-b", ladder: "node-promotion-v1.4" }],
    }),
  },
  // ---- living-person-v2 -----------------------------------------------------
  {
    name: "living-person-v2 clean promotion (P570 absence observed)",
    expect: "pass",
    decision: mkDecision({
      adds: { nodes: [mkNode("person:fixture-alive", { type: "person", is_living_person: true, external_ids: { wikidata: "Q2" } })] },
      identity: [{ node_id: "person:fixture-alive", provider: "wikidata", external_id: "Q2", verified: true, method: "wbgetentities", retrieved_at: DATE, p570_absent_confirmed_at: DATE }],
      verdicts: [{ subject_id: "person:fixture-alive", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "person:fixture-alive", ladder: "living-person-v2" }],
    }),
  },
  {
    name: "living-person-v2 blocks without p570_absent_confirmed_at",
    expect: "block",
    fragment: "requires p570_absent_confirmed_at",
    decision: mkDecision({
      adds: { nodes: [mkNode("person:fixture-alive", { type: "person", is_living_person: true, external_ids: { wikidata: "Q2" } })] },
      identity: [{ node_id: "person:fixture-alive", provider: "wikidata", external_id: "Q2", verified: true, method: "wbgetentities", retrieved_at: DATE }],
      verdicts: [{ subject_id: "person:fixture-alive", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "person:fixture-alive", ladder: "living-person-v2" }],
    }),
  },
  {
    name: "living-person-v2 blocks at 1 independent source (threshold ≥2)",
    expect: "block",
    fragment: "≥2 independent live claim-stating sources",
    decision: mkDecision({
      adds: { nodes: [mkNode("person:fixture-alive", { type: "person", is_living_person: true, external_ids: { wikidata: "Q2" } })] },
      identity: [{ node_id: "person:fixture-alive", provider: "wikidata", external_id: "Q2", verified: true, method: "wbgetentities", retrieved_at: DATE, p570_absent_confirmed_at: DATE }],
      verdicts: [{ subject_id: "person:fixture-alive", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "person:fixture-alive", ladder: "living-person-v2" }],
    }),
  },
  {
    name: "living person cannot ride node-promotion-v1",
    expect: "block",
    fragment: "living-person nodes promote via living-person-v2",
    decision: mkDecision({
      adds: { nodes: [mkNode("person:fixture-alive", { type: "person", is_living_person: true, external_ids: { wikidata: "Q2" } })] },
      identity: [{ node_id: "person:fixture-alive", provider: "wikidata", external_id: "Q2", verified: true, method: "wbgetentities", retrieved_at: DATE }],
      sanctions: [{ subject_id: "person:fixture-alive", ladder: "node-promotion-v1" }],
    }),
  },
  // ---- edge-promotion-v1-structural ----------------------------------------
  {
    name: "structural tier clean part_of promotion",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-partof", "subfield:fixture-field", "field:fixture-parent", "part_of")] },
      verdicts: [{ subject_id: "edge:fixture-partof", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-partof", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  // member_of and adjacent_to are the other two ratified classification
  // placements; without their own pass fixtures, dropping either from
  // CLASSIFICATION_RELATIONS is a silent (88)-shaped regression.
  {
    name: "structural tier clean member_of promotion",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-memberof", "subfield:fixture-field", "field:fixture-parent", "member_of")] },
      verdicts: [{ subject_id: "edge:fixture-memberof", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-memberof", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  {
    name: "structural tier clean adjacent_to promotion",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-adjacent", "subfield:fixture-field", "field:fixture-parent", "adjacent_to")] },
      verdicts: [{ subject_id: "edge:fixture-adjacent", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-adjacent", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  {
    name: "structural tier blocks applies_to (session-#55 CPO exclusion)",
    expect: "block",
    fragment: "not a classification placement",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-applies", "subfield:fixture-field", "field:fixture-parent", "applies_to")] },
      verdicts: [{ subject_id: "edge:fixture-applies", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-applies", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  {
    name: "structural tier blocks at 0 independent sources (threshold ≥1)",
    expect: "block",
    fragment: "≥1 independent source",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-partof", "subfield:fixture-field", "field:fixture-parent", "part_of")] },
      verdicts: [{ subject_id: "edge:fixture-partof", verdict: "supported", sources: src(false, 2) }],
      sanctions: [{ subject_id: "edge:fixture-partof", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  // ---- edge-promotion-v1-clause6 -------------------------------------------
  {
    name: "clause 6 clean contested placement (3 sources, minority recorded)",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-disputed", "subfield:fixture-field", "field:fixture-parent", "part_of", { disputed: true, note: "Minority position: fixture." })] },
      verdicts: [{ subject_id: "edge:fixture-disputed", verdict: "supported", sources: src(true, 3) }],
      sanctions: [{ subject_id: "edge:fixture-disputed", ladder: "edge-promotion-v1-clause6" }],
    }),
  },
  {
    name: "clause 6 blocks at 2 independent sources (threshold ≥3)",
    expect: "block",
    fragment: "≥3 independent sources",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-disputed", "subfield:fixture-field", "field:fixture-parent", "part_of", { disputed: true, note: "Minority position: fixture." })] },
      verdicts: [{ subject_id: "edge:fixture-disputed", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-disputed", ladder: "edge-promotion-v1-clause6" }],
    }),
  },
  // ---- formalizes-auto-54 ---------------------------------------------------
  {
    name: "formalizes-auto-54 clean promotion",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-formalizes", "subfield:fixture-field", "field:fixture-parent", "formalizes")] },
      verdicts: [{ subject_id: "edge:fixture-formalizes", verdict: "supported", direction_confirmed: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-formalizes", ladder: "formalizes-auto-54" }],
    }),
  },
  {
    name: "formalizes-auto-54 blocks at 1 claim-stating source (threshold ≥2)",
    expect: "block",
    fragment: "≥2 independent claim-stating live sources",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-formalizes", "subfield:fixture-field", "field:fixture-parent", "formalizes")] },
      verdicts: [{ subject_id: "edge:fixture-formalizes", verdict: "supported", direction_confirmed: true, sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-formalizes", ladder: "formalizes-auto-54" }],
    }),
  },
  // ---- founded-or-formalized-auto-60 ---------------------------------------
  {
    name: "founded-or-formalized-auto-60 clean promotion",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-founded", "person:fixture-founder", "subfield:fixture-field", "founded_or_formalized")] },
      verdicts: [{ subject_id: "edge:fixture-founded", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-founded", ladder: "founded-or-formalized-auto-60" }],
    }),
  },
  {
    name: "founded-or-formalized-auto-60 blocks without identity_referent_verified",
    expect: "block",
    fragment: "requires identity_referent_verified:true",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-founded", "person:fixture-founder", "subfield:fixture-field", "founded_or_formalized")] },
      verdicts: [{ subject_id: "edge:fixture-founded", verdict: "supported", direction_confirmed: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-founded", ladder: "founded-or-formalized-auto-60" }],
    }),
  },
  // ---- a-relation-auto-68 ---------------------------------------------------
  {
    name: "a-relation-auto-68 clean influenced promotion",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-influenced", "person:fixture-founder", "subfield:fixture-field", "influenced")] },
      verdicts: [{ subject_id: "edge:fixture-influenced", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-influenced", ladder: "a-relation-auto-68" }],
    }),
  },
  // critiques rides the same (68) ladder as influenced; it needs its own pass
  // fixture or dropping it from EDGE_AUTO_LADDER goes unnoticed.
  {
    name: "a-relation-auto-68 clean critiques promotion",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-critiques", "person:fixture-founder", "subfield:fixture-field", "critiques")] },
      verdicts: [{ subject_id: "edge:fixture-critiques", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-critiques", ladder: "a-relation-auto-68" }],
    }),
  },
  {
    name: "a-relation-auto-68 blocks without direction_confirmed",
    expect: "block",
    fragment: "requires direction_confirmed:true",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-influenced", "person:fixture-founder", "subfield:fixture-field", "influenced")] },
      verdicts: [{ subject_id: "edge:fixture-influenced", verdict: "supported", identity_referent_verified: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-influenced", ladder: "a-relation-auto-68" }],
    }),
  },
  // ---- canonical-work-auto-88 ----------------------------------------------
  // The PASS fixture is the standing regression test for the (88) gap: if
  // canonical_work ever drops out of EDGE_AUTO_LADDER again, expected!==ladder
  // fires and this fixture fails.
  {
    name: "canonical-work-auto-88 clean promotion ((88) transcription regression)",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-canonical", "work:fixture-work", "subfield:fixture-field", "canonical_work")] },
      verdicts: [{ subject_id: "edge:fixture-canonical", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-canonical", ladder: "canonical-work-auto-88" }],
    }),
  },
  {
    name: "canonical_work cannot ride founded-or-formalized-auto-60",
    expect: "block",
    fragment: "not sanctioned by founded-or-formalized-auto-60",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-canonical", "work:fixture-work", "subfield:fixture-field", "canonical_work")] },
      verdicts: [{ subject_id: "edge:fixture-canonical", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-canonical", ladder: "founded-or-formalized-auto-60" }],
    }),
  },
  // ---- editorial-v2 ---------------------------------------------------------
  {
    name: "editorial-v2 clean reviewed summary",
    expect: "pass",
    decision: mkDecision({
      translation_updates: [{ node_id: "subfield:fixture-field", locale: "en", summary: "Fixture summary.", reviewed: true }],
      sanctions: [{ subject_id: "subfield:fixture-field", ladder: "editorial-v2" }],
    }),
  },
  {
    name: "editorial-v2 blocks a reviewed summary without sanction",
    expect: "block",
    fragment: "without an editorial-v2 sanction",
    decision: mkDecision({
      translation_updates: [{ node_id: "subfield:fixture-field", locale: "en", summary: "Fixture summary.", reviewed: true }],
    }),
  },
  // ---- manual-cpo -----------------------------------------------------------
  {
    name: "manual-cpo clean promotion with decision-log pointer",
    expect: "pass",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-manual", "subfield:fixture-field", "field:fixture-parent", "applies_to")] },
      sanctions: [{ subject_id: "edge:fixture-manual", ladder: "manual-cpo", note: "vault decision log (fixture)" }],
    }),
  },
  {
    name: "manual-cpo blocks without a decision-log pointer",
    expect: "block",
    fragment: "requires a vault decision-log pointer",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-manual", "subfield:fixture-field", "field:fixture-parent", "applies_to")] },
      sanctions: [{ subject_id: "edge:fixture-manual", ladder: "manual-cpo" }],
    }),
  },
  // ---- cross-cutting safety nets -------------------------------------------
  {
    name: "safety net: negative verdict can never end reviewed",
    expect: "block",
    fragment: "disputed/NEI/reject stop at proposed",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-influenced", "person:fixture-founder", "subfield:fixture-field", "influenced")] },
      verdicts: [{ subject_id: "edge:fixture-influenced", verdict: "disputed", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 3) }],
      sanctions: [{ subject_id: "edge:fixture-influenced", ladder: "a-relation-auto-68" }],
    }),
  },
  {
    name: "safety net: a reviewed outcome demands a sanction",
    expect: "block",
    fragment: "ends reviewed but has no ladder sanction",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-influenced", "person:fixture-founder", "subfield:fixture-field", "influenced")] },
      verdicts: [{ subject_id: "edge:fixture-influenced", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) }],
    }),
  },
  // The `promotions` path (proposed→reviewed on an existing item) is how most
  // real batches earn reviewed status, and it reaches the ladders through a
  // different branch of reviewedOutcomes than `adds`. Both branches need
  // fixtures: without the BLOCK case below, disabling the promotions branch
  // entirely would let every promotion escape ladder scrutiny silently.
  {
    name: "promotion path: proposed→reviewed clean (node-promotion-v1)",
    expect: "pass",
    decision: mkDecision({
      promotions: [{ kind: "node", id: "concept:fixture-promoted", from: "proposed", to: "reviewed", set_external_ids: { wikidata: "Q7" } }],
      identity: [{ node_id: "concept:fixture-promoted", provider: "wikidata", external_id: "Q7", verified: true, method: "wbgetentities", retrieved_at: DATE }],
      sanctions: [{ subject_id: "concept:fixture-promoted", ladder: "node-promotion-v1" }],
    }),
    extraPost: [mkNode("concept:fixture-promoted", { type: "concept", external_ids: { wikidata: "Q7" } })],
  },
  {
    name: "promotion path: proposed→reviewed without a sanction is blocked",
    expect: "block",
    fragment: "ends reviewed but has no ladder sanction",
    decision: mkDecision({
      promotions: [{ kind: "node", id: "concept:fixture-promoted", from: "proposed", to: "reviewed" }],
    }),
    extraPost: [mkNode("concept:fixture-promoted", { type: "concept", external_ids: { wikidata: "Q7" } })],
  },
  {
    name: "safety net: metadata flip cannot carry set_evidence",
    expect: "block",
    fragment: "metadata flip",
    decision: mkDecision({
      promotions: [{ kind: "edge", id: "edge:fixture-partof", from: "reviewed", to: "reviewed", set_evidence: ["source:fixture"] }],
    }),
    extraPost: [],
  },
  {
    name: "safety net: auto ladders demand reviewed endpoints",
    expect: "block",
    fragment: "needs reviewed endpoints",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-capped", "person:fixture-founder", "subfield:fixture-proposed", "influenced")] },
      verdicts: [{ subject_id: "edge:fixture-capped", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-capped", ladder: "a-relation-auto-68" }],
    }),
  },
  {
    name: "safety net: editorial-evidenced edges stop at proposed",
    expect: "block",
    fragment: "editorial-evidenced edges stop at proposed",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-partof", "subfield:fixture-field", "field:fixture-parent", "part_of", { evidence_kind: "editorial" })] },
      verdicts: [{ subject_id: "edge:fixture-partof", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-partof", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  {
    name: "safety net: set_external_ids demands an in-batch verified identity",
    expect: "block",
    fragment: "set_external_ids requires a verified identity record",
    decision: mkDecision({
      promotions: [{ kind: "node", id: "concept:fixture-a", from: "proposed", to: "reviewed", set_external_ids: { wikidata: "Q9" } }],
      sanctions: [{ subject_id: "concept:fixture-a", ladder: "manual-cpo", note: "vault decision log (fixture)" }],
    }),
    extraPost: [mkNode("concept:fixture-a", { type: "concept", external_ids: { wikidata: "Q9" } })],
  },

  // ---- gaps found by the mutation-sweep adequacy audit (2026-07-30) --------
  // Each of the following covers a rule that had NO fixture and NO mutation:
  // the suite could have shipped with the rule deleted and stayed green.

  // decision (70) applied to an EDGE ENDPOINT — the intersection of the two
  // most policy-sensitive rules, previously with zero coverage in either arm.
  {
    name: "(70) edge endpoint: living endpoint promoted in-batch must use living-person-v2",
    expect: "block",
    fragment: "must use living-person-v2",
    decision: mkDecision({
      adds: {
        nodes: [mkNode("person:fixture-living-new", { type: "person", is_living_person: true, external_ids: { wikidata: "Q3" } })],
        edges: [mkEdge("edge:fixture-living", "person:fixture-living-new", "subfield:fixture-field", "influenced")],
      },
      identity: [{ node_id: "person:fixture-living-new", provider: "wikidata", external_id: "Q3", verified: true, method: "wbgetentities", retrieved_at: DATE }],
      verdicts: [
        { subject_id: "edge:fixture-living", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) },
        { subject_id: "person:fixture-living-new", verdict: "supported", sources: src(true, 2) },
      ],
      sanctions: [
        { subject_id: "edge:fixture-living", ladder: "a-relation-auto-68" },
        { subject_id: "person:fixture-living-new", ladder: "node-promotion-v1" },
      ],
    }),
  },
  {
    name: "(70) edge endpoint: already-reviewed living endpoint raises the floor advisory",
    expect: "advisory",
    fragment: "(70) floor applies",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-living-ctx", "person:fixture-living-ctx", "subfield:fixture-field", "influenced")] },
      verdicts: [{ subject_id: "edge:fixture-living-ctx", verdict: "supported", direction_confirmed: true, identity_referent_verified: true, sources: src(true, 2) }],
      sanctions: [{ subject_id: "edge:fixture-living-ctx", ladder: "a-relation-auto-68" }],
    }),
  },
  // The EDGE side of the promotions branch (the node side is covered above).
  {
    name: "promotion path: edge proposed→reviewed clean (structural tier)",
    expect: "pass",
    decision: mkDecision({
      promotions: [{ kind: "edge", id: "edge:fixture-promoted", from: "proposed", to: "reviewed" }],
      verdicts: [{ subject_id: "edge:fixture-promoted", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-promoted", ladder: "edge-promotion-v1-structural" }],
    }),
    extraPostEdges: [mkEdge("edge:fixture-promoted", "subfield:fixture-field", "field:fixture-parent", "part_of")],
  },
  {
    name: "promotion path: edge proposed→reviewed without a sanction is blocked",
    expect: "block",
    fragment: "ends reviewed but has no ladder sanction",
    decision: mkDecision({
      promotions: [{ kind: "edge", id: "edge:fixture-promoted", from: "proposed", to: "reviewed" }],
    }),
    extraPostEdges: [mkEdge("edge:fixture-promoted", "subfield:fixture-field", "field:fixture-parent", "part_of")],
  },
  // Dangling sanction: a sanction whose subject never ends reviewed.
  {
    name: "dangling sanction raises an advisory",
    expect: "advisory",
    fragment: "has no reviewed outcome in this decision",
    decision: mkDecision({
      sanctions: [{ subject_id: "concept:fixture-orphan", ladder: "node-promotion-v1" }],
    }),
  },
  // Verified identity present but written onto a DIFFERENT value (copy-paste QID).
  {
    name: "node-promotion-v1 blocks a verified QID absent from external_ids",
    expect: "block",
    fragment: "is not in the node's external_ids",
    decision: mkDecision({
      adds: { nodes: [mkNode("concept:fixture-a", { type: "concept", external_ids: { wikidata: "Q2" } })] },
      identity: [{ node_id: "concept:fixture-a", provider: "wikidata", external_id: "Q1", verified: true, method: "wbgetentities", retrieved_at: DATE }],
      sanctions: [{ subject_id: "concept:fixture-a", ladder: "node-promotion-v1" }],
    }),
  },
  {
    name: "node-promotion-v1.4 blocks a verified anchor absent from external_ids",
    expect: "block",
    fragment: "is not in the node's external_ids",
    decision: mkDecision({
      adds: { nodes: [mkNode("subfield:fixture-b", { external_ids: { philpapers: "cat-2" } })] },
      identity: [{ node_id: "subfield:fixture-b", provider: "philpapers", external_id: "cat-1", verified: true, method: "manual", retrieved_at: DATE }],
      verdicts: [{ subject_id: "subfield:fixture-b", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "subfield:fixture-b", ladder: "node-promotion-v1.4" }],
    }),
  },
  // clause 6 carries its OWN copy of the classification-placement whitelist;
  // the structural copy being covered says nothing about this one.
  {
    name: "clause 6 blocks a non-classification relation (its own whitelist copy)",
    expect: "block",
    fragment: "not a classification placement",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-c6-bad", "subfield:fixture-field", "field:fixture-parent", "formalizes", { disputed: true, note: "Minority position: fixture." })] },
      verdicts: [{ subject_id: "edge:fixture-c6-bad", verdict: "supported", sources: src(true, 3) }],
      sanctions: [{ subject_id: "edge:fixture-c6-bad", ladder: "edge-promotion-v1-clause6" }],
    }),
  },
  // The living-person ladder guards, in both directions, on the v1.4 sibling.
  {
    name: "living person cannot ride node-promotion-v1.4",
    expect: "block",
    fragment: "living-person nodes promote via living-person-v2, not node-promotion-v1.4",
    decision: mkDecision({
      adds: { nodes: [mkNode("person:fixture-alive", { type: "person", is_living_person: true, external_ids: { philpapers: "cat-1" } })] },
      identity: [{ node_id: "person:fixture-alive", provider: "philpapers", external_id: "cat-1", verified: true, method: "manual", retrieved_at: DATE }],
      verdicts: [{ subject_id: "person:fixture-alive", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "person:fixture-alive", ladder: "node-promotion-v1.4" }],
    }),
  },
  {
    name: "living-person-v2 blocks a sanction on a non-living node",
    expect: "block",
    fragment: "sanction on a node that is not is_living_person",
    decision: mkDecision({
      adds: { nodes: [mkNode("person:fixture-dead", { type: "person", external_ids: { wikidata: "Q4" } })] },
      identity: [{ node_id: "person:fixture-dead", provider: "wikidata", external_id: "Q4", verified: true, method: "wbgetentities", retrieved_at: DATE, p570_absent_confirmed_at: DATE }],
      verdicts: [{ subject_id: "person:fixture-dead", verdict: "supported", sources: src(true, 2) }],
      sanctions: [{ subject_id: "person:fixture-dead", ladder: "living-person-v2" }],
    }),
  },
  // Defensive guards against a sanction pointing at an id that does not exist.
  {
    name: "sanctioned node missing from post-apply state is blocked",
    expect: "block",
    fragment: "sanctioned node not found in post-apply state",
    decision: mkDecision({
      promotions: [{ kind: "node", id: "concept:fixture-ghost", from: "proposed", to: "reviewed" }],
      sanctions: [{ subject_id: "concept:fixture-ghost", ladder: "node-promotion-v1" }],
    }),
  },
  {
    name: "sanctioned edge missing from post-apply state is blocked",
    expect: "block",
    fragment: "sanctioned edge not found in post-apply state",
    decision: mkDecision({
      promotions: [{ kind: "edge", id: "edge:fixture-ghost", from: "proposed", to: "reviewed" }],
      sanctions: [{ subject_id: "edge:fixture-ghost", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  // Structural-tier and clause-6 preconditions other than the source floor.
  // evidence_kind is optional in the schema (legacy seed edges predate it), so
  // an absent value is a reachable case, not a dead branch.
  {
    name: "structural tier blocks an edge with no evidence_kind",
    expect: "block",
    fragment: "structural tier requires evidence_kind externally_sourced",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-partof", "subfield:fixture-field", "field:fixture-parent", "part_of", { evidence_kind: undefined })] },
      verdicts: [{ subject_id: "edge:fixture-partof", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-partof", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  {
    name: "structural tier blocks a disputed placement (clause 6's lane)",
    expect: "block",
    fragment: "disputed placements promote via edge-promotion-v1-clause6",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-partof", "subfield:fixture-field", "field:fixture-parent", "part_of", { disputed: true, note: "Minority position: fixture." })] },
      verdicts: [{ subject_id: "edge:fixture-partof", verdict: "supported", sources: src(true, 1) }],
      sanctions: [{ subject_id: "edge:fixture-partof", ladder: "edge-promotion-v1-structural" }],
    }),
  },
  {
    name: "clause 6 blocks an undisputed edge",
    expect: "block",
    fragment: "clause-6 sanction on an edge without disputed:true",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-partof", "subfield:fixture-field", "field:fixture-parent", "part_of", { note: "Minority position: fixture." })] },
      verdicts: [{ subject_id: "edge:fixture-partof", verdict: "supported", sources: src(true, 3) }],
      sanctions: [{ subject_id: "edge:fixture-partof", ladder: "edge-promotion-v1-clause6" }],
    }),
  },
  {
    name: "clause 6 blocks a disputed edge with no minority position in note",
    expect: "block",
    fragment: "clause 6 requires the minority position recorded in note",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-disputed", "subfield:fixture-field", "field:fixture-parent", "part_of", { disputed: true })] },
      verdicts: [{ subject_id: "edge:fixture-disputed", verdict: "supported", sources: src(true, 3) }],
      sanctions: [{ subject_id: "edge:fixture-disputed", ladder: "edge-promotion-v1-clause6" }],
    }),
  },
  // The auto-ladder's first line of defence, before any sub-check runs.
  {
    name: "auto ladder blocks an edge with no recorded verdict at all",
    expect: "block",
    fragment: "requires a recorded Lane B verdict",
    decision: mkDecision({
      adds: { edges: [mkEdge("edge:fixture-influenced", "person:fixture-founder", "subfield:fixture-field", "influenced")] },
      sanctions: [{ subject_id: "edge:fixture-influenced", ladder: "a-relation-auto-68" }],
    }),
  },
];

// --- Runner -------------------------------------------------------------------

let failures = 0;
for (const f of fixtures) {
  const postNodesById = new Map<string, Node>();
  for (const n of CONTEXT) postNodesById.set(n.id, n);
  for (const n of f.extraPost ?? []) postNodesById.set(n.id, n);
  for (const n of f.decision.adds.nodes) postNodesById.set(n.id, n);
  const postEdgesById = new Map<string, Edge>();
  for (const e of f.extraPostEdges ?? []) postEdgesById.set(e.id, e);
  for (const e of f.decision.adds.edges) postEdgesById.set(e.id, e);

  const findings: LadderFinding[] = checkLadders({ decision: f.decision, postNodesById, postEdgesById });
  const violations = findings.filter((x) => x.level === "violation");
  const advisories = findings.filter((x) => x.level === "advisory");

  let ok: boolean;
  let detail = "";
  if (f.expect === "pass") {
    ok = violations.length === 0;
    if (!ok) detail = violations.map((v) => `${v.subject_id}: ${v.message}`).join(" | ");
  } else if (f.expect === "advisory") {
    const hasAdvisory = advisories.some((a) => a.message.includes(f.fragment!));
    ok = violations.length === 0 && hasAdvisory;
    if (!ok)
      detail = violations.length
        ? `expected no violations, got: ${violations.map((v) => v.message).join(" | ")}`
        : `expected an advisory containing "${f.fragment}"; got: ${advisories.map((a) => a.message).join(" | ") || "none"}`;
  } else {
    ok = violations.some((v) => v.message.includes(f.fragment!));
    if (!ok)
      detail =
        violations.length === 0
          ? `expected a violation containing "${f.fragment}", got none`
          : `no violation contains "${f.fragment}"; got: ${violations.map((v) => v.message).join(" | ")}`;
  }

  if (ok) {
    console.log(`  ✓ ${f.name}`);
  } else {
    failures += 1;
    console.error(`  ✗ ${f.name}\n      ${detail}`);
  }
}

const passes = fixtures.length - failures;
if (failures > 0) {
  console.error(`\n✗ ladder fixtures: ${failures}/${fixtures.length} FAILED — a ratified threshold or safety net has drifted (§15.4 stop-point).`);
  process.exit(1);
}
console.log(`\n✓ ladder fixtures: ${passes}/${fixtures.length} passed (every ladder: pass + block at threshold).`);
