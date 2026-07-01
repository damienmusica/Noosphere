import { z } from "zod";
import { idSchema, isoDateSchema, prefixedIdSchema } from "./id.ts";

/**
 * Allowed relation types. See docs/relation-taxonomy.md.
 * Changing this set requires updating the taxonomy doc and validate-data.ts in the same change.
 */
export const relationTypeSchema = z.enum([
  "part_of",
  "prerequisite_for",
  "influenced",
  "founded_or_formalized",
  "formalizes",
  "models",
  "measures",
  "enables",
  "applies_to",
  "critiques",
  "canonical_work",
  "adjacent_to",
  "member_of",
]);
export type RelationType = z.infer<typeof relationTypeSchema>;

export const edgeStatusSchema = z.enum([
  "draft",
  "generated",
  "proposed",
  "reviewed",
  "deprecated",
]);
export type EdgeStatus = z.infer<typeof edgeStatusSchema>;

/**
 * Who (which model) proposed an artifact. Shared by canonical edges (edge
 * promotion policy v1, vault decision log 2026-06-10 (15)) and foundry
 * proposal envelopes. All fields are required — provenance is what keeps the
 * corpus bulk re-auditable.
 */
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

/**
 * Evidence kind per ADR 0007 §A. Externally-sourced evidence backs structural
 * claims (e.g. `part_of` grounded in a classification source); editorial
 * evidence backs pedagogical/curatorial judgment (`prerequisite_for`,
 * `adjacent_to`, ...).
 */
export const evidenceKindSchema = z.enum(["externally_sourced", "editorial"]);
export type EvidenceKind = z.infer<typeof evidenceKindSchema>;

export const edgeSchema = z
  .object({
    id: prefixedIdSchema("edge"),
    source: idSchema,
    target: idSchema,
    relation: relationTypeSchema,
    confidence: z.number().min(0).max(1),
    status: edgeStatusSchema,
    /** Non-empty list of source IDs backing this relationship. */
    evidence: z.array(idSchema).min(1, "Every edge must cite at least one source as evidence"),
    /**
     * Evidence kind (ADR 0007 §A). Expected on every foundry-promoted edge
     * under edge promotion policy v1; optional only because the hand-curated
     * seed edges predate it. An editorial-evidenced edge must not be
     * `reviewed` (enforced in validate-data.ts).
     */
    evidence_kind: evidenceKindSchema.optional(),
    /**
     * Proposer provenance for AI-proposed edges (edge promotion policy v1).
     * Absent on hand-curated seed edges and on the pre-provenance legacy
     * batch (ml-foundations-v1), whose audit record lives in
     * `foundry/proposals/`.
     */
    proposed_by: proposerSchema.optional(),
    /**
     * Real-world contested claim deliberately positioned on the dominant view
     * (policy v1 clause 6). May only be set via the v1.1 research path
     * (≥3 independent sources, majority + ≥2 supporting); the minority
     * position must be recorded in `note` (enforced in validate-data.ts).
     */
    disputed: z.boolean().optional(),
    note: z.string().optional(),
  })
  .strict()
  .refine((edge) => edge.source !== edge.target, {
    message: "Edge source and target must differ (no self-loops)",
    path: ["target"],
  });

export type Edge = z.infer<typeof edgeSchema>;
