import { z } from "zod";
import { idSchema, isoDateSchema, localeSchema } from "./id.ts";
import { nodeSchema } from "./node.ts";
import { edgeSchema, proposerSchema } from "./edge.ts";
import { sourceSchema } from "./source.ts";
import { nodeTranslationSchema } from "./node-translation.ts";
import { externalLinkSchema } from "./external-link.ts";
import { proposalBatchRefSchema } from "./foundry-proposal.ts";

/**
 * A Data Foundry **promotion decision file** (ops-efficiency package,
 * CPO-ratified 2026-07-02): the machine-readable record of one batch's QC
 * outcome. This file — not the orchestrator's conversation context, not a
 * hand-written report — is where a promotion decision *exists*:
 *
 *   - `scripts/foundry/apply-batch.ts` consumes it to write /data
 *     (never hand-rolled per-session write scripts again),
 *   - `scripts/foundry/ladder-check.ts` verifies every reviewed outcome
 *     against the ratified promotion ladders before anything is written,
 *   - `scripts/foundry/report.ts` renders the batch report skeleton from it,
 *   - the held/rejection ledgers under `foundry/` are appended from it,
 *   - and bulk re-audit replays it: every verdict carries the URLs it read,
 *     when it read them, and the permanence anchors it recorded.
 *
 * Decision files are committed under `foundry/decisions/<batch-id>.json`.
 * They are the audit trail; deleting one deletes the ability to re-audit.
 */

// --- QC verdicts --------------------------------------------------------------

/** One source a QC verdict actually read, with permanence anchoring. */
export const verdictSourceSchema = z
  .object({
    url: z.string().url(),
    /** When QC read this URL (YYYY-MM-DD). */
    retrieved_at: isoDateSchema,
    /** Wayback snapshot recorded for this URL (may be filled by foundry:anchor). */
    snapshot_url: z.string().url().optional(),
    /** MediaWiki revision permalink (…oldid=NNN) when the source is a wiki page. */
    revision_permalink: z.string().url().optional(),
    /** Verbatim claim anchor: the sentence(s) this verdict leans on. */
    quote: z.string().optional(),
    /** Counts toward the ≥2 independent-sources floor. */
    independent: z.boolean(),
  })
  .strict();
export type VerdictSource = z.infer<typeof verdictSourceSchema>;

export const verdictKindSchema = z.enum([
  "supported",
  "disputed",
  "not_enough_evidence",
  "reject",
]);
export type VerdictKind = z.infer<typeof verdictKindSchema>;

/** The machine-readable outcome of QC on one subject (node or edge). */
export const verdictRecordSchema = z
  .object({
    /** The node/edge ID this verdict is about. */
    subject_id: idSchema,
    verdict: verdictKindSchema,
    /** For directed relation ladders: QC confirmed the claim direction. */
    direction_confirmed: z.boolean().optional(),
    /** For person/work ladders: QC confirmed the identity referent (right person, right work). */
    identity_referent_verified: z.boolean().optional(),
    /** Every source QC actually read for this verdict. */
    sources: z.array(verdictSourceSchema).default([]),
    notes: z.string().optional(),
  })
  .strict();
export type VerdictRecord = z.infer<typeof verdictRecordSchema>;

// --- Identity verification records ---------------------------------------------

export const identityMethodSchema = z.enum([
  /** scripts/foundry/resolve-wikidata.ts label→candidate resolution. */
  "resolver",
  /** scripts/foundry/verify-identity.ts batched QID re-confirmation. */
  "wbgetentities",
  /** Maintainer-interactive verification (recorded, still auditable). */
  "manual",
]);

/** One verified (or failed) identity grounding for a node. */
export const identityRecordSchema = z
  .object({
    node_id: idSchema,
    /** Provider key as it appears in external_ids (wikidata, openalex, philpapers, ...). */
    provider: z.string().min(1),
    external_id: z.string().min(1),
    verified: z.boolean(),
    method: identityMethodSchema,
    retrieved_at: isoDateSchema,
    /**
     * Living-person aliveness observation (decision (70): observed, never
     * predicted): the date Wikidata P570 (date of death) was live-confirmed
     * ABSENT. Required to promote an is_living_person node.
     */
    p570_absent_confirmed_at: isoDateSchema.optional(),
    notes: z.string().optional(),
  })
  .strict();
export type IdentityRecord = z.infer<typeof identityRecordSchema>;

// --- Promotion sanctions --------------------------------------------------------

/**
 * The ratified ladders (vault decision log is the authority; this enum is the
 * executable transcription — see scripts/foundry/lib/ladders.ts for the
 * per-ladder preconditions).
 */
export const ladderSchema = z.enum([
  /** Node promotion policy v1: resolver-verified external grounding. */
  "node-promotion-v1",
  /** v1.4: QID-less-but-recognized alternative identity anchor (decision (93)). */
  "node-promotion-v1.4",
  /** Living-person stricter floor, auto-promotes when clean (decision (70)). */
  "living-person-v2",
  /** Edge promotion policy v1, structural tier (part_of etc.). */
  "edge-promotion-v1-structural",
  /** Edge promotion policy v1 clause 6: contested placement research path. */
  "edge-promotion-v1-clause6",
  /** Propositional formalizes auto-reviewed ladder (decision (54)). */
  "formalizes-auto-54",
  /** founded_or_formalized auto-reviewed ladder (decisions (60)/(61)). */
  "founded-or-formalized-auto-60",
  /** influenced/critiques (a)-relation auto-reviewed ladder (decision (68)). */
  "a-relation-auto-68",
  /** Editorial policy v2 (summaries; decision (26)/(34)). */
  "editorial-v2",
  /** Explicit CPO ratification outside a standing ladder — cite it in `note`. */
  "manual-cpo",
]);
export type Ladder = z.infer<typeof ladderSchema>;

/** Sanction: which ladder authorizes one subject's reviewed outcome. */
export const sanctionSchema = z
  .object({
    subject_id: idSchema,
    ladder: ladderSchema,
    /** For manual-cpo: the vault decision-log pointer. */
    note: z.string().optional(),
  })
  .strict();
export type Sanction = z.infer<typeof sanctionSchema>;

// --- Mutations -------------------------------------------------------------------

/** A status flip on an existing /data item. */
export const promotionOpSchema = z
  .object({
    kind: z.enum(["node", "edge"]),
    id: idSchema,
    from: z.enum(["draft", "generated", "proposed", "reviewed", "deprecated"]),
    to: z.enum(["proposed", "reviewed", "deprecated"]),
    /** Merged into the node's external_ids (nodes only; post-identity-verification). */
    set_external_ids: z.record(z.string(), z.string()).optional(),
    /** Flip node indexability (nodes only; validate-data enforces the earned rule). */
    set_indexable: z.boolean().optional(),
    /**
     * Replace the item's `note` — promoted edges carry the grounding narrative
     * + permanence anchors inline (established (68)-wave pattern), replacing
     * the pre-promotion hold note.
     */
    set_note: z.string().optional(),
    /**
     * Replace the edge's `evidence` (edges only) — promotion often upgrades
     * the evidence set to the sources QC actually grounded on. IDs must exist
     * in the post-apply source registry.
     */
    set_evidence: z.array(idSchema).min(1).optional(),
    note: z.string().optional(),
  })
  .strict();
export type PromotionOp = z.infer<typeof promotionOpSchema>;

/** Set/replace a translation's summary and reviewed flag (editorial batches). */
export const translationUpdateSchema = z
  .object({
    node_id: idSchema,
    locale: localeSchema,
    summary: z.string().min(1),
    reviewed: z.boolean(),
  })
  .strict();
export type TranslationUpdate = z.infer<typeof translationUpdateSchema>;

// --- Ledger entries ---------------------------------------------------------------

/** A rejected candidate — future waves must not silently re-propose it. */
export const rejectionEntrySchema = z
  .object({
    /** Candidate label (there may be no stable ID for a rejected item). */
    label: z.string().min(1),
    /** Referent description, to distinguish homonyms. */
    referent: z.string().optional(),
    kind: z.enum(["node", "edge"]),
    reason: z.string().min(1),
    batch_id: proposalBatchRefSchema,
    recorded_at: isoDateSchema,
  })
  .strict();
export type RejectionEntry = z.infer<typeof rejectionEntrySchema>;

/** A held item: promotion blocked now, re-evaluable later. */
export const heldEntrySchema = z
  .object({
    /** The /data or proposal item ID when one exists. */
    id: idSchema.optional(),
    label: z.string().optional(),
    blocking_condition: z.string().min(1),
    /**
     * How this hold can ever clear:
     *   machine — recheck-held can re-evaluate it from /data state alone;
     *   manual  — needs a human/LLM look, and there is work to do now;
     *   trigger — nothing to work on: it clears only if an UPSTREAM event
     *             happens (an entity gains standing, a taxonomy authority
     *             admits a unit, a design lands). Rendered separately at
     *             session start so watch items do not inflate the worklist.
     */
    recheck: z.enum(["machine", "manual", "trigger"]),
    batch_id: proposalBatchRefSchema,
    recorded_at: isoDateSchema,
    note: z.string().optional(),
  })
  .strict();
export type HeldEntry = z.infer<typeof heldEntrySchema>;

/**
 * A held entry this batch terminally closes.
 *
 * `apply-batch` drops a held entry automatically when its id is promoted to
 * `reviewed` — the blocking condition provably no longer exists. But a hold can
 * also end in a *non-reviewed* terminal disposition: the id is deprecated, or a
 * modeling ruling re-scopes the work onto a different id. Those had no exit from
 * the worklist, so closed items kept surfacing at session start as if they were
 * open (measured 2026-07-30: 3 of 25 entries, closed by decisions (106)/(108)).
 * Closure is stated explicitly here rather than inferred from status, because
 * `deprecated` is genuinely ambiguous — a deprecation that records a
 * regeneration trigger is still live work.
 */
export const heldResolutionSchema = z
  .object({
    id: idSchema,
    /** Why the hold is terminally closed — cite the ruling that closed it. */
    reason: z.string().min(1),
  })
  .strict();
export type HeldResolution = z.infer<typeof heldResolutionSchema>;

// --- The decision file --------------------------------------------------------------

export const foundryDecisionSchema = z
  .object({
    version: z.literal(1),
    batch_id: proposalBatchRefSchema,
    decided_at: isoDateSchema,
    /** Who ran QC and decided (orchestrator provenance — mirrors proposer provenance). */
    qc_by: proposerSchema,
    /** New items to append to /data (IDs must not exist yet). */
    adds: z
      .object({
        sources: z.array(sourceSchema).default([]),
        nodes: z.array(nodeSchema).default([]),
        translations: z.array(nodeTranslationSchema).default([]),
        edges: z.array(edgeSchema).default([]),
        external_links: z.array(externalLinkSchema).default([]),
      })
      .strict()
      .default({}),
    /** Status flips on existing /data items. */
    promotions: z.array(promotionOpSchema).default([]),
    /** Editorial summary updates (upsert by node_id+locale). */
    translation_updates: z.array(translationUpdateSchema).default([]),
    /** QC verdicts, keyed by subject_id — the re-auditable evidence trail. */
    verdicts: z.array(verdictRecordSchema).default([]),
    /** Identity verification records, keyed by node_id. */
    identity: z.array(identityRecordSchema).default([]),
    /** Ladder sanctions for every subject that ends `reviewed` in this batch. */
    sanctions: z.array(sanctionSchema).default([]),
    /** Rejected candidates → appended to foundry/rejections.json. */
    rejections: z.array(rejectionEntrySchema).default([]),
    /** Held items → appended to foundry/held.json. */
    held: z.array(heldEntrySchema).default([]),
    /** Held ids this batch terminally closes → dropped from foundry/held.json. */
    held_resolutions: z.array(heldResolutionSchema).default([]),
    /**
     * Labels from foundry/rejections.json this batch deliberately overrides
     * (re-admitting a previously rejected candidate requires saying so).
     */
    override_rejections: z.array(z.string().min(1)).default([]),
    /** URLs whose permanence anchor is still pending (foundry:anchor retries). */
    anchors_pending: z
      .array(z.object({ url: z.string().url(), reason: z.string().min(1) }).strict())
      .default([]),
    notes: z.array(z.string().min(1)).default([]),
  })
  .strict();
export type FoundryDecision = z.infer<typeof foundryDecisionSchema>;
