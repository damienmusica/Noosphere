import { z } from "zod";
import { idSchema, prefixedIdSchema } from "./id.ts";
import { academicStatusSchema, domainKeySchema, nodeTypeSchema } from "./node.ts";
import { evidenceKindSchema, proposerSchema, relationTypeSchema } from "./edge.ts";
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

// proposerSchema and evidenceKindSchema moved to edge.ts when the canonical
// edge schema adopted them (edge promotion policy v1); re-exported here so the
// foundry surface is unchanged.
export { evidenceKindSchema, proposerSchema } from "./edge.ts";
export type { EvidenceKind, Proposer } from "./edge.ts";

/** Per-item reasoned-proposal fields (ADR 0007). `ambiguous` must be explicit. */
export const reasonedProposalFields = {
  /** One line: why this item is proposed. */
  rationale: z.string().min(1),
  /** One line: where this could be wrong. */
  uncertainty: z.string().min(1),
  /** Self-flag for low confidence / plausible duplication. No default — be explicit. */
  ambiguous: z.boolean(),
} as const;

// academicStatusSchema now lives in node.ts (canonical schema adopted it);
// imported above and applied here with the stricter discipline-node requirement.

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

// ---------------------------------------------------------------------------
// Proposal contract v2 (ops-efficiency package, CPO-ratified 2026-07-02).
//
// Measured across every generation wave, generator-guessed Wikidata QIDs were
// ~100% hallucinated (9/9, 12/12, 20/20, 21/21, 7/7 wrong) — zero signal, plus
// a copy-contamination risk while plausible-looking QIDs sit in drafts. v2
// removes the guessing step at the schema level:
//
//   - `external_ids` is GONE from proposed nodes. Identity resolution is the
//     deterministic resolver's job (scripts/foundry/resolve-wikidata.ts),
//     never the generator's.
//   - Every proposed node instead carries `referent`: a discriminating
//     description of the intended real-world referent, written BLIND (from
//     the generator's own knowledge, no lookups). The resolver matches label
//     + referent against live candidates independently; a mismatch between
//     what the generator meant and what resolves is an error signal the old
//     contract could not produce.
//   - No provider identifiers may appear ANYWHERE in a v2 artifact — not in
//     source_hint, rationale, uncertainty, notes. Enforced by a string scan
//     over the whole envelope (QID shapes, wikidata/openalex URLs/IDs).
// ---------------------------------------------------------------------------

/** Provider-ID shapes that must not leak into v2 proposal text. */
export const PROVIDER_ID_LEAK_PATTERNS: readonly RegExp[] = [
  /\bQ\d+\b/, // Wikidata QID
  /\b[WAC]\d{6,}\b/, // OpenAlex work/author/concept IDs
  /wikidata\.org/i,
  /openalex\.org/i,
];

/** Scan every string value in an artifact for provider-ID leaks. */
export function findProviderIdLeaks(value: unknown, path = "$"): string[] {
  const leaks: string[] = [];
  if (typeof value === "string") {
    for (const pattern of PROVIDER_ID_LEAK_PATTERNS) {
      const match = pattern.exec(value);
      if (match) leaks.push(`${path}: "${match[0]}"`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => leaks.push(...findProviderIdLeaks(v, `${path}[${i}]`)));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      leaks.push(...findProviderIdLeaks(v, `${path}.${k}`));
    }
  }
  return leaks;
}

/** A v2 candidate node: label + blind referent description, no provider IDs. */
export const proposedNodeV2Schema = z
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
    /**
     * Blind discriminating description of the intended real-world referent:
     * which entity is meant, with enough context to disambiguate homonyms
     * (e.g. "calculus — the branch of mathematics on limits and derivatives,
     * not the dental deposit or the arachnid genus"). Written from the
     * generator's own knowledge, no lookups. The resolver matches this
     * independently; never restate a guessed identifier here.
     */
    referent: z.string().min(20, "referent must actually describe the entity"),
    /** Coverage-skeleton tag; required for discipline nodes (domain/field/subfield). */
    academic_status: academicStatusSchema.optional(),
    /** Unverified pointer (textbook, classification entry) for QC — not a citation, never a provider ID. */
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
export type ProposedNodeV2 = z.infer<typeof proposedNodeV2Schema>;

/** A v2 candidate edge — shape unchanged from v1; the leak scan covers its text. */
export const proposedEdgeV2Schema = proposedEdgeSchema;
export type ProposedEdgeV2 = z.infer<typeof proposedEdgeV2Schema>;

/**
 * v2 batch reference: either a formal manifest ID (`batch:foo-v1`) or the
 * proposal directory name (`foo-v1`) — recent lightweight batches key on the
 * directory and have no manifest, so both are honest references.
 */
export const proposalBatchRefSchema = z
  .string()
  .regex(
    /^(?:batch:)?[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "batch reference must be batch:<kebab> or the proposal directory name",
  );

/** The v2 proposal envelope. One artifact per file, no provider IDs anywhere. */
export const foundryProposalV2Schema = z
  .object({
    version: z.literal(2),
    batch_id: proposalBatchRefSchema,
    proposed_by: proposerSchema,
    nodes: z.array(proposedNodeV2Schema).default([]),
    edges: z.array(proposedEdgeV2Schema).default([]),
    notes: z.array(z.string().min(1)).default([]),
  })
  .strict()
  .superRefine((artifact, ctx) => {
    for (const leak of findProviderIdLeaks(artifact)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          `provider ID leaked into v2 proposal (${leak}) — generators must not ` +
          `guess or restate Wikidata/OpenAlex identifiers; describe the referent instead`,
      });
    }
  });
export type FoundryProposalV2 = z.infer<typeof foundryProposalV2Schema>;
