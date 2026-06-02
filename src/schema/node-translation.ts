import { z } from "zod";
import { idSchema, localeSchema } from "./id.ts";

/**
 * Localized display text for a node. Graph topology never depends on this layer.
 * Keyed by (node_id, locale). Every node must have an `en` translation.
 */
export const nodeTranslationSchema = z
  .object({
    node_id: idSchema,
    locale: localeSchema,
    label: z.string().min(1),
    summary: z.string().default(""),
    aliases: z.array(z.string()).default([]),
    reviewed: z.boolean().default(false),
  })
  .strict();

export type NodeTranslation = z.infer<typeof nodeTranslationSchema>;
