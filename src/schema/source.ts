import { z } from "zod";
import { isoDateSchema, prefixedIdSchema } from "./id.ts";

export const sourceTypeSchema = z.enum([
  "open_data",
  "scholarly",
  "reference",
  "primary",
  "manual",
]);
export type SourceType = z.infer<typeof sourceTypeSchema>;

/**
 * A tracked source with complete license metadata. Every edge's `evidence`
 * must reference a source ID defined here. See docs/license-policy.md.
 */
export const sourceSchema = z
  .object({
    id: prefixedIdSchema("source"),
    name: z.string().min(1),
    source_type: sourceTypeSchema,
    license: z.string().min(1),
    commercial_use: z.boolean(),
    attribution_required: z.boolean(),
    share_alike_required: z.boolean(),
    /** Null is allowed only for manual curation. Otherwise must be a valid http(s) URL. */
    url: z.string().url().nullable(),
    last_checked_at: isoDateSchema,
  })
  .strict()
  .refine((source) => source.url !== null || source.source_type === "manual", {
    message: "Only manual sources may omit a URL (url: null)",
    path: ["url"],
  });

export type Source = z.infer<typeof sourceSchema>;
