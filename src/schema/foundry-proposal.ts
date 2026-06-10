import { z } from "zod";
import { idSchema, isoDateSchema, prefixedIdSchema } from "./id.ts";
import { domainKeySchema, nodeTypeSchema } from "./node.ts";
import { relationTypeSchema } from "./edge.ts";
import { batchIdSchema } from "./foundry-batch.ts";

/**
 * Schema for a committed Data Foundry **proposal artifact**.
 *
 * A proposal artifact is the output of an LLM-assisted generation session for a
 * batch: candidate nodes/edges at status `generated` (lowest trust), written to
 * `foundry/proposals/<batch-id>/` for QC and the human curation gate. It is NOT
 * canonical graph data — `/data` remains the source of truth, and nothing here
 * is `reviewed` or `indexable`.
 *
 * Two contracts are enforced structurally:
 *
 * 1. **Reasoned proposals (ADR 0007):** every item carries `rationale`,
 *    `uncertainty`, and an explicit `ambiguous` self-flag. Proposals without
 *    exposed reasoning may not enter the curation gate.
 * 2. **Proposer provenance (governance decision, 2026-06-10):** every artifact
 *    records who proposed it — model name, exact model version string, and
 *    proposal date. This is what makes the corpus bulk re-auditable by future
 *    models: today's output is a versioned draft, not permanent debt.
 */

/** Who (which model) proposed this artifact. All fields are required. */
export const proposerSchema = z
  .object({
    /** Human-readable model name, e.g. "Claude Sonnet". */
    model_name: z.string().min(1),
    /** Exact model version/ID string, e.g. "claude-sonnet-4-6". Never a guess. */
    model_version: z.string().min(1),
    /** Date the proposal was generated (YYYY-MM-DD), supplied by the orchestrator. */
    proposed_at: isoDateSchema,
  })
  .strict();
export type Proposer = z.infer<typeof proposerSchema>;

/** Per-item reasoned-proposal fields (ADR 0007). `ambiguous` must be explicit. */
export const reasonedProposalFields = {
  /** One line: why this item is proposed. */
  rationale: z.string().min(1),
  /** One line: where this could be wrong. */
  uncertainty: z.string().min(1),
  /** Self-flag for low confidence / plausible duplication. No default — be explicit. */
  ambiguous: z.boolean(),
} as const;

/**
 * Academic status of a proposed field/subfield (data-strategy track A).
 * Honest tagging instead of exclusion: astrology is a node, tagged `non_academic`.
 * Lives here until the canonical node schema adopts it via its own reviewed change.
 */
export const academicStatusSchema = z.enum([
  "established",
  "emerging",
  "historical",
  "non_academic",
]);
export type AcademicStatus = z.infer<typeof academicStatusSchema>;

/** Evidence kind per ADR 0007 §A. */
export const evidenceKindSchema = z.enum(["externally_sourced", "editorial"]);
export type EvidenceKind = z.infer<typeof evidenceKindSchema>;

/** A candidate node, shaped for later promotion into the canonical node schema. */
export const proposedNodeSchema = z
  .object({
    id: idSchema,
    type: nodeTypeSchema,
    /** Required for every node except `domain` nodes themselves. */
    domain: domainKeySchema.optional(),
    /** Depth hint: 0 = domain, 1 = field, 2 = subfield, ... */
    level: z.number().int().min(0),
    /** Proposals are always lowest-trust drafts. */
    status: z.literal("generated"),
    /** English display label for review (canonical labels live in node-translations). */
    label_en: z.string().min(1),
    /** Coverage-skeleton tag; required for discipline nodes (domain/field/subfield). */
    academic_status: academicStatusSchema.optional(),
    /** Provider identifiers (Wikidata QID, OpenAlex, ...). Never used as primary IDs. */
    external_ids: z.record(z.string(), z.string()).default({}),
    /** Unverified pointer (textbook, classification entry) for QC — not a citation. */
    source_hint: z.string().optional(),
    note: z.string().optional(),
    ...reasonedProposalFields,
  })
  .strict()
  .refine((node) => node.type === "domain" || node.domain !== undefined, {
    message: "Non-domain nodes must declare a `domain`",
    path: ["domain"],
  })
  .refine(
    (node) =>
      !["domain", "field", "subfield"].includes(node.type) ||
      node.academic_status !== undefined,
    {
      message: "Discipline nodes (domain/field/subfield) must declare `academic_status`",
      path: ["academic_status"],
    },
  );
export type ProposedNode = z.infer<typeof proposedNodeSchema>;

/** A candidate edge, shaped for later promotion into the canonical edge schema. */
export const proposedEdgeSchema = z
  .object({
    id: prefixedIdSchema("edge"),
    source: idSchema,
    target: idSchema,
    relation: relationTypeSchema,
    confidence: z.number().min(0).max(1),
    status: z.literal("generated"),
    /** Which kind of evidence would back this edge (ADR 0007 §A). */
    evidence_kind: evidenceKindSchema,
    /** Source IDs that would back this edge after review; may be empty pre-review. */
    evidence: z.array(idSchema).default([]),
    /** Unverified pointer (textbook, curriculum) for QC — not a citation. */
    source_hint: z.string().optional(),
    note: z.string().optional(),
    ...reasonedProposalFields,
  })
  .strict()
  .refine((edge) => edge.source !== edge.target, {
    message: "Edge source and target must differ (no self-loops)",
    path: ["target"],
  });
export type ProposedEdge = z.infer<typeof proposedEdgeSchema>;

/**
 * The proposal envelope: one `proposal.json` per batch directory.
 * `proposed_by` is required — an artifact without provenance is invalid.
 */
export const foundryProposalSchema = z
  .object({
    version: z.literal(1),
    batch_id: batchIdSchema,
    proposed_by: proposerSchema,
    nodes: z.array(proposedNodeSchema).default([]),
    edges: z.array(proposedEdgeSchema).default([]),
    notes: z.array(z.string().min(1)).default([]),
  })
  .strict();
export type FoundryProposal = z.infer<typeof foundryProposalSchema>;
