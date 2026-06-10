import { z } from "zod";
import { idSchema, isoDateSchema } from "./id.ts";

export const nodeTypeSchema = z.enum([
  "domain",
  "field",
  "subfield",
  "concept",
  "person",
  "work",
  "method",
  "tool",
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
    /** Only `reviewed` nodes may be indexable (enforced in validate-data.ts). */
    indexable: z.boolean().default(false),
    /** Living people require stricter evidence and conservative wording. */
    is_living_person: z.boolean().default(false),
    /** Provider identifiers (Wikidata QID, OpenAlex, ORCID, ...). Never used as primary IDs. */
    external_ids: z.record(z.string(), z.string()).default({}),
    created_at: isoDateSchema,
    updated_at: isoDateSchema,
  })
  .strict()
  .refine((node) => node.type === "domain" || node.domain !== undefined, {
    message: "Non-domain nodes must declare a `domain`",
    path: ["domain"],
  });

export type Node = z.infer<typeof nodeSchema>;
