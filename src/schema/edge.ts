import { z } from "zod";
import { idSchema, prefixedIdSchema } from "./id.ts";

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
    note: z.string().optional(),
  })
  .strict()
  .refine((edge) => edge.source !== edge.target, {
    message: "Edge source and target must differ (no self-loops)",
    path: ["target"],
  });

export type Edge = z.infer<typeof edgeSchema>;
