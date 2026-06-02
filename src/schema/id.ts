import { z } from "zod";

/**
 * Canonical ID format: language-independent, stable, lowercase.
 * Examples: `field:mathematics`, `subfield:linear-algebra`, `concept:vector-space`,
 * `source:wikidata`, `edge:linear-algebra-prerequisite-machine-learning`.
 */
export const ID_REGEX = /^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const idSchema = z
  .string()
  .regex(ID_REGEX, "ID must match ^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$");

/** Build a schema for an ID with a required prefix, e.g. prefixedIdSchema("source"). */
export function prefixedIdSchema(prefix: string) {
  return idSchema.refine((value) => value.startsWith(`${prefix}:`), {
    message: `ID must start with "${prefix}:"`,
  });
}

/** ISO date (YYYY-MM-DD). */
export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

/** Supported locales. English is the default; Korean is planned. */
export const localeSchema = z.enum(["en", "ko"]);
export type Locale = z.infer<typeof localeSchema>;
export const DEFAULT_LOCALE: Locale = "en";
