import { z } from "zod";
import { idSchema, isoDateSchema } from "./id.ts";

/**
 * Ratified node classes. `tool` was removed by decision (121): it entered here
 * in the bootstrap commit, no decision ever adjudicated it, it had zero
 * instances in 60 days, and it was measurably harmful — a session handover
 * document cited it as evidence of a policy gate that does not exist, and a
 * probe showed `tool:eniac` passing ladder-check green. Adding a class back is
 * a CPO ruling with keep-criteria, not an enum edit (see docs/data-foundry.md
 * §12 structural rule 5 and the decision (73) test).
 */
export const nodeTypeSchema = z.enum([
  "domain",
  "field",
  "subfield",
  "concept",
  "person",
  "work",
  "method",
  "institution",
]);
export type NodeType = z.infer<typeof nodeTypeSchema>;

export const nodeStatusSchema = z.enum([
  "draft",
  "generated",
  "proposed",
  "reviewed",
  "deprecated",
]);
export type NodeStatus = z.infer<typeof nodeStatusSchema>;

/**
 * Academic status of a discipline node (data-strategy track A).
 * Honest tagging instead of exclusion: historical and non-academic areas are
 * nodes too, labeled truthfully. Optional in the canonical schema for now;
 * discipline nodes (domain/field/subfield) promoted from Foundry batches
 * must carry it (enforced structurally in the proposal schema).
 */
export const academicStatusSchema = z.enum([
  "established",
  "emerging",
  "historical",
  "non_academic",
]);
export type AcademicStatus = z.infer<typeof academicStatusSchema>;

/**
 * One provider's raw external-metrics block (data-strategy track B; OpenAlex
 * field design CPO-ratified 2026-06-11, vault decision log (18)/(20)).
 *
 * Contract:
 * - Metric keys keep the provider API's **native response field names**
 *   (e.g. `works_count`, `cited_by_count`) — renaming a key injects
 *   interpretation and is forbidden. Values are raw numbers as returned.
 * - No computed labels or scores, ever (enforced in validate-data.ts) —
 *   interpretation/display is downstream.
 * - `as_of` (lookup date) and `entity` (the provider's canonical entity URL)
 *   are mandatory companions so every number is re-queryable and re-auditable.
 * - The provider's entity ID itself lives in `external_ids`, verified under
 *   the same identity discipline as QIDs (two-stage matching, clause 4).
 */
export const externalMetricsProviderSchema = z
  .object({
    /** Date the metrics were fetched (YYYY-MM-DD). */
    as_of: isoDateSchema,
    /** The provider's canonical URL for the matched entity. */
    entity: z.string().url(),
  })
  .catchall(z.number());
export type ExternalMetricsProvider = z.infer<typeof externalMetricsProviderSchema>;

export const domainKeySchema = z.enum([
  "formal_sciences",
  "natural_sciences",
  "life_sciences",
  "cognitive_sciences",
  "computer_and_information_sciences",
  "engineering_and_technology",
  "medicine_and_health",
  "social_sciences",
  "humanities",
  "arts_and_design",
  "practical_knowledge",
  "meta_knowledge",
]);
export type DomainKey = z.infer<typeof domainKeySchema>;

export const nodeSchema = z
  .object({
    id: idSchema,
    type: nodeTypeSchema,
    /** Top-level domain key. Required for every node except `domain` nodes themselves. */
    domain: domainKeySchema.optional(),
    /** Depth hint: 0 = domain, 1 = field, 2 = subfield, ... */
    level: z.number().int().min(0),
    status: nodeStatusSchema,
    /** Coverage-skeleton tag; expected on discipline nodes (domain/field/subfield). */
    academic_status: academicStatusSchema.optional(),
    /**
     * Real-world contested placement/identity deliberately positioned on the
     * dominant view (edge promotion policy v1 clause 6, vault decision log
     * 2026-06-10 (15)). May only be set via the v1.1 research path; the
     * resolution record (incl. the minority position) lives in the foundry
     * resolution report.
     */
    disputed: z.boolean().optional(),
    /** Only `reviewed` nodes may be indexable (enforced in validate-data.ts). */
    indexable: z.boolean().default(false),
    /** Living people require stricter evidence and conservative wording. */
    is_living_person: z.boolean().default(false),
    /** Provider identifiers (Wikidata QID, OpenAlex, ORCID, ...). Never used as primary IDs. */
    external_ids: z.record(z.string(), z.string()).default({}),
    /**
     * Raw external scholarly metrics, namespaced by provider
     * (e.g. `{ "openalex": { works_count, cited_by_count, as_of, entity } }`).
     * Additive and optional; raw facts only, never computed labels/scores.
     */
    external_metrics: z
      .record(z.string(), externalMetricsProviderSchema)
      .optional(),
    created_at: isoDateSchema,
    updated_at: isoDateSchema,
  })
  .strict()
  .refine((node) => node.type === "domain" || node.domain !== undefined, {
    message: "Non-domain nodes must declare a `domain`",
    path: ["domain"],
  });

export type Node = z.infer<typeof nodeSchema>;
