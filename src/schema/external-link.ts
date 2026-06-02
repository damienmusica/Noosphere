import { z } from "zod";
import { idSchema, localeSchema } from "./id.ts";

export const linkProviderSchema = z.enum([
  "wikipedia",
  "namuwiki",
  "wikidata",
  "openalex",
  "sep",
  "britannica",
  "official",
  "other",
]);
export type LinkProvider = z.infer<typeof linkProviderSchema>;

export const linkTypeSchema = z.enum([
  "further_reading",
  "reference",
  "official",
  "identifier",
]);
export type LinkType = z.infer<typeof linkTypeSchema>;

/**
 * A pointer to an external page. External links are pointers, not content.
 * `content_cached` must be false for namuwiki (enforced in validate-data.ts).
 * URL scheme is restricted to http(s) (enforced in validate-data.ts).
 */
export const externalLinkSchema = z
  .object({
    node_id: idSchema,
    locale: localeSchema,
    provider: linkProviderSchema,
    url: z.string().url(),
    link_type: linkTypeSchema,
    content_cached: z.boolean().default(false),
  })
  .strict();

export type ExternalLink = z.infer<typeof externalLinkSchema>;
