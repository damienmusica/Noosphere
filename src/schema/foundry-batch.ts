import { z } from "zod";
import { idSchema, localeSchema } from "./id.ts";
import { nodeTypeSchema } from "./node.ts";

/**
 * Schema for a committed Data Foundry batch manifest.
 *
 * A batch manifest is a *construction input* — it declares the scope, seed
 * entities, allowed/forbidden public sources, and risk policy for a planned
 * data-construction batch. It is NOT canonical graph data: `/data` remains the
 * source of truth for accepted graph data, while Foundry manifests live under
 * `/foundry` and describe candidate/planning work. See docs/data-foundry.md.
 *
 * This schema is deliberately small and offline-first. It declares which open,
 * free, public knowledge providers a future resolver *may* use, but this phase
 * performs no network calls and requires no secrets.
 */

/** Batch IDs are prefixed and language-independent, e.g. `batch:machine-learning-foundations-v1`. */
export const BATCH_ID_REGEX = /^batch:[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const batchIdSchema = z
  .string()
  .regex(BATCH_ID_REGEX, "Batch ID must match ^batch:[a-z0-9]+(?:-[a-z0-9]+)*$");

/** Lifecycle status for a batch manifest. */
export const batchStatusSchema = z.enum(["draft", "active", "completed", "deprecated"]);
export type BatchStatus = z.infer<typeof batchStatusSchema>;

/**
 * Open, free, public knowledge providers a batch may resolve against in a future
 * resolver PR. NamuWiki is intentionally absent: it is external-link-only and may
 * never be used as evidence or a source.
 */
export const allowedProviderSchema = z.enum([
  "wikidata",
  "openalex",
  "orcid",
  "crossref",
  "ror",
  "viaf",
  "loc",
  "wikipedia",
  "official",
  "other",
]);
export type AllowedProvider = z.infer<typeof allowedProviderSchema>;

/** What a resolved provider may be used for. Kept small and explicit. */
export const sourcePurposeSchema = z.enum([
  "identity",
  "metadata",
  "source_resolution",
  "external_link",
  "evidence_candidate",
]);
export type SourcePurpose = z.infer<typeof sourcePurposeSchema>;

/** Risk tiers, lowest to highest scrutiny. Mirrors docs/data-foundry.md §8. */
export const riskTierSchema = z.enum(["low", "medium", "pedagogical", "historical", "high"]);
export type RiskTier = z.infer<typeof riskTierSchema>;

/** A seed entity to be resolved into one or more candidate nodes by a later resolver. */
export const seedEntitySchema = z
  .object({
    label: z.string().min(1),
    /** Optional expected canonical node ID, using the existing Noosphere ID format. */
    expected_node_id: idSchema.optional(),
    /** Optional expected node type, using the existing node type enum. */
    expected_type: nodeTypeSchema.optional(),
    notes: z.string().optional(),
  })
  .strict();
export type SeedEntity = z.infer<typeof seedEntitySchema>;

/** A public source a future resolver is permitted to use for this batch. */
export const allowedPublicSourceSchema = z
  .object({
    provider: allowedProviderSchema,
    purpose: z.array(sourcePurposeSchema).min(1),
    /**
     * Must be false. MVP Foundry tooling does not allow secrets, API keys, or
     * tokens — only open, free, public, keyless endpoints are permitted.
     */
    requires_secret: z.literal(false),
    notes: z.string().optional(),
  })
  .strict();
export type AllowedPublicSource = z.infer<typeof allowedPublicSourceSchema>;

/** A source/provider that must never be used as evidence or a source for this batch. */
export const forbiddenSourceSchema = z
  .object({
    provider: z.string().min(1),
    reason: z.string().min(1),
  })
  .strict();
export type ForbiddenSource = z.infer<typeof forbiddenSourceSchema>;

export const riskPolicySchema = z
  .object({
    default_tier: riskTierSchema,
    allowed_tiers: z.array(riskTierSchema).min(1),
    requires_strict_review_for: z.array(z.string().min(1)).default([]),
  })
  .strict()
  .refine((policy) => policy.allowed_tiers.includes(policy.default_tier), {
    message: "risk_policy.default_tier must be one of risk_policy.allowed_tiers",
    path: ["default_tier"],
  });
export type RiskPolicy = z.infer<typeof riskPolicySchema>;

export const batchOutputSchema = z
  .object({
    /**
     * Where the proposal-skeleton builder writes generated candidate output.
     * Must live under `dist/foundry/` — generated, never committed. (Curated
     * proposal batches that DO get committed live under `foundry/proposals/`,
     * a separate, manually assembled permanent record — see ADR 0007's
     * 2026-06-11 clarification note.)
     */
    proposal_dir: z
      .string()
      .min(1)
      .regex(
        /^dist\/foundry\/[A-Za-z0-9._/-]+$/,
        "output.proposal_dir must be under dist/foundry/ (generated, not committed)",
      )
      // Reject `..` path segments so a manifest cannot escape the dist/foundry
      // sandbox. Without this, the regex (which permits `.`) would accept e.g.
      // `dist/foundry/../tmp`, passing validation/CI but failing the builder's
      // resolved-path traversal guard — letting an unusable manifest be committed.
      .refine((dir) => !dir.split("/").includes(".."), {
        message: "output.proposal_dir must not contain '..' path segments",
      }),
  })
  .strict();
export type BatchOutput = z.infer<typeof batchOutputSchema>;

export const foundryBatchSchema = z
  .object({
    id: batchIdSchema,
    title: z.string().min(1),
    description: z.string().default(""),
    status: batchStatusSchema,
    target_locales: z.array(localeSchema).min(1),
    scope: z
      .object({
        include: z.array(z.string().min(1)).default([]),
        exclude: z.array(z.string().min(1)).default([]),
      })
      .strict()
      .default({ include: [], exclude: [] }),
    seed_entities: z.array(seedEntitySchema).min(1),
    allowed_public_sources: z.array(allowedPublicSourceSchema).default([]),
    forbidden_sources: z.array(forbiddenSourceSchema).default([]),
    risk_policy: riskPolicySchema,
    output: batchOutputSchema,
    notes: z.array(z.string().min(1)).default([]),
  })
  .strict()
  .refine(
    (batch) =>
      !batch.allowed_public_sources.some(
        (s) => (s.provider as string).toLowerCase() === "namuwiki",
      ),
    {
      message:
        "NamuWiki must never be an allowed source (external-link-only, never evidence/source)",
      path: ["allowed_public_sources"],
    },
  );
export type FoundryBatch = z.infer<typeof foundryBatchSchema>;
