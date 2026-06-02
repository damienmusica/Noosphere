import { z } from "zod";
import { idSchema, prefixedIdSchema } from "./id.ts";

export const pathStatusSchema = z.enum([
  "draft",
  "generated",
  "proposed",
  "reviewed",
  "deprecated",
]);
export type PathStatus = z.infer<typeof pathStatusSchema>;

/**
 * A curated ordered sequence of nodes. Only `reviewed` paths may be indexable
 * (enforced in validate-data.ts). `node_sequence` entries must reference existing nodes.
 */
export const learningPathSchema = z
  .object({
    id: prefixedIdSchema("path"),
    status: pathStatusSchema,
    indexable: z.boolean().default(false),
    /** Optional inline English title/description for MVP; localized overrides come later. */
    title: z.string().optional(),
    description: z.string().optional(),
    node_sequence: z
      .array(idSchema)
      .min(2, "A learning path needs at least two nodes"),
    evidence: z.array(idSchema).min(1, "A learning path must cite at least one source"),
  })
  .strict()
  .refine(
    (path) => new Set(path.node_sequence).size === path.node_sequence.length,
    { message: "node_sequence must not contain duplicates", path: ["node_sequence"] },
  );

export type LearningPath = z.infer<typeof learningPathSchema>;
