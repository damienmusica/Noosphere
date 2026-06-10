import { z } from "zod";
import { idSchema } from "./id.ts";
import { nodeTypeSchema } from "./node.ts";
import { batchIdSchema } from "./foundry-batch.ts";

/**
 * Schema for a generated Data Foundry **source pack**.
 *
 * A source pack is the *candidate output* of a source-resolution job: it records
 * what an open, free, public knowledge provider (here, Wikidata) returned for the
 * seed entities declared in a batch manifest. It is **not** canonical graph data
 * and it is **not** a proposal — `/data` remains the source of truth for accepted
 * graph data, while source packs live (generated, gitignored) under
 * `dist/foundry/source-packs/...` and feed later proposal/review steps.
 *
 * The pack deliberately stores only *compact* selected metadata per candidate —
 * never the full raw provider entity JSON, and never any article body. It keeps
 * multiple ranked candidates rather than choosing a single canonical match; final
 * truth decisions are a later, human-reviewed step. See docs/data-foundry.md.
 */

/** Wikidata item QID, e.g. `Q42`. Properties (`P...`) are intentionally excluded. */
export const QID_REGEX = /^Q[1-9][0-9]*$/;
export const qidSchema = z
  .string()
  .regex(QID_REGEX, "QID must match ^Q[1-9][0-9]*$");

/** Resolution outcome for a single seed entity. */
export const resolutionStatusSchema = z.enum(["resolved", "unresolved", "error"]);
export type ResolutionStatus = z.infer<typeof resolutionStatusSchema>;

/**
 * Deterministic disambiguation breakdown for a single candidate.
 *
 * The resolver re-ranks a seed's candidates using the candidate's Wikidata
 * `instance of` (P31) classes, the seed's `expected_type`, and an exact-label
 * signal — so that, e.g., the *academic discipline* "mathematics" outranks the
 * "Mathematics Genealogy Project" database, and the *branch of mathematics*
 * "calculus" outranks an arachnid genus also labelled "Calculus". `signals`
 * records the human-readable reasons behind `score` for later review.
 */
export const disambiguationSchema = z
  .object({
    /** Integer score; higher is a better type match. May be negative. */
    score: z.number().int(),
    /** P31 indicates the seed's `expected_type` family (field/concept/method). */
    aligned_with_expected_type: z.boolean(),
    /** P31 gives any positive type signal (aligned, or a related abstract kind). */
    positive_type_signal: z.boolean(),
    /** P31 indicates a non-concept entity (book, taxon, database, person, ...). */
    excluded: z.boolean(),
    /** Candidate label or an alias equals the seed label (case-insensitive). */
    exact_label_match: z.boolean(),
    /** Human-readable reasons that produced `score`. */
    signals: z.array(z.string()).default([]),
  })
  .strict();
export type Disambiguation = z.infer<typeof disambiguationSchema>;

/**
 * A single compact candidate match for a seed entity. Stores only selected,
 * citation-relevant metadata — never the full raw Wikidata entity JSON.
 */
export const sourcePackCandidateSchema = z
  .object({
    qid: qidSchema,
    /** 1-based rank within this seed's candidate list (1 = best provider match). */
    rank: z.number().int().min(1),
    /** Provider-reported relevance/match score, if available. */
    match_score: z.number().optional(),
    label: z.string(),
    description: z.string().default(""),
    aliases: z.array(z.string()).default([]),
    /** Wikidata `instance of` (P31) item QIDs used to judge entity kind. */
    instance_of: z.array(qidSchema).default([]),
    /** How this candidate scored during deterministic re-ranking. */
    disambiguation: disambiguationSchema,
    /** Stable concept URI: http://www.wikidata.org/entity/Q... */
    concept_uri: z
      .string()
      .regex(
        /^http:\/\/www\.wikidata\.org\/entity\/Q[1-9][0-9]*$/,
        "concept_uri must be http://www.wikidata.org/entity/Q...",
      ),
    /** Human-facing entity page: https://www.wikidata.org/wiki/Q... */
    entity_url: z
      .string()
      .regex(
        /^https:\/\/www\.wikidata\.org\/wiki\/Q[1-9][0-9]*$/,
        "entity_url must be https://www.wikidata.org/wiki/Q...",
      ),
    /** Machine-readable entity data: https://www.wikidata.org/wiki/Special:EntityData/Q....json */
    entity_data_url: z
      .string()
      .regex(
        /^https:\/\/www\.wikidata\.org\/wiki\/Special:EntityData\/Q[1-9][0-9]*\.json$/,
        "entity_data_url must be https://www.wikidata.org/wiki/Special:EntityData/Q....json",
      ),
    /** Optional sitelinks (URLs only) — e.g. { enwiki: "https://en.wikipedia.org/wiki/..." }. */
    sitelinks: z.record(z.string(), z.string()).default({}),
    /** Wikidata revision metadata, useful for provenance. */
    wikidata_lastrevid: z.number().int().optional(),
    wikidata_modified: z.string().optional(),
  })
  .strict()
  // Each URL must embed the *same* QID as `qid`. The per-field regexes above only
  // check that the URLs are well-formed Wikidata URLs — without this cross-field
  // check a pack could validate with `qid: "Q42"` while its URLs point to `Q1`,
  // silently corrupting provenance for later proposal/review steps that trust
  // this schema boundary (e.g. packs produced outside this exact resolver path).
  .superRefine((candidate, ctx) => {
    const checks: { field: "concept_uri" | "entity_url" | "entity_data_url"; want: string }[] = [
      { field: "concept_uri", want: `http://www.wikidata.org/entity/${candidate.qid}` },
      { field: "entity_url", want: `https://www.wikidata.org/wiki/${candidate.qid}` },
      {
        field: "entity_data_url",
        want: `https://www.wikidata.org/wiki/Special:EntityData/${candidate.qid}.json`,
      },
    ];
    for (const { field, want } of checks) {
      if (candidate[field] !== want) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} must reference the candidate's qid (${candidate.qid})`,
        });
      }
    }
  });
export type SourcePackCandidate = z.infer<typeof sourcePackCandidateSchema>;

/** The seed entity (copied from the manifest) this result resolves. */
export const sourcePackSeedSchema = z
  .object({
    label: z.string().min(1),
    expected_node_id: idSchema.optional(),
    expected_type: nodeTypeSchema.optional(),
  })
  .strict();
export type SourcePackSeed = z.infer<typeof sourcePackSeedSchema>;

/** Resolution result for one seed entity, with its ranked candidates. */
export const sourcePackResultSchema = z
  .object({
    seed: sourcePackSeedSchema,
    /** The query string actually sent to the provider. */
    query: z.string(),
    status: resolutionStatusSchema,
    candidates: z.array(sourcePackCandidateSchema).default([]),
    /** Best candidate (rank 1) after re-ranking; set only when `resolved`. */
    selected_qid: qidSchema.optional(),
    /** True when the top-two candidates scored close enough to need review. */
    ambiguous: z.boolean().default(false),
    notes: z.array(z.string()).default([]),
  })
  .strict()
  // `selected_qid` is the best-guess match other proposal/review tooling may
  // trust, so it must stay consistent with the rest of the result even for packs
  // produced outside this exact resolver path: it is set only for a `resolved`
  // result, and must name the rank-1 candidate.
  .superRefine((result, ctx) => {
    const top = result.candidates[0];
    // A `resolved` result must carry at least one ranked candidate — otherwise a
    // pack could claim resolution (and even a `selected_qid`) with nothing for it
    // to name.
    if (result.status === "resolved" && !top) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["candidates"],
        message: 'a "resolved" result must have at least one candidate',
      });
    }
    if (result.selected_qid !== undefined) {
      if (result.status !== "resolved") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selected_qid"],
          message: `selected_qid may only be set when status is "resolved" (got "${result.status}")`,
        });
      }
      if (top && result.selected_qid !== top.qid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["selected_qid"],
          message: `selected_qid must name the rank-1 candidate (${top.qid})`,
        });
      }
    } else if (result.status === "resolved" && top) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["selected_qid"],
        message: "selected_qid is required for a resolved result with candidates",
      });
    }
  });
export type SourcePackResult = z.infer<typeof sourcePackResultSchema>;

/** Non-secret request policy describing how the resolver reached the provider. */
export const requestPolicySchema = z
  .object({
    network_required: z.literal(true),
    /** Must be false: only open, free, keyless endpoints are permitted. */
    requires_secret: z.literal(false),
    user_agent: z.string().min(1),
    serial_requests: z.literal(true),
    delay_ms: z.number().int().min(0),
    /** How many search hits are considered (and entity-fetched) per seed. */
    search_limit: z.number().int().min(1),
    /** How many ranked candidates are retained per seed after re-ranking. */
    candidate_limit: z.number().int().min(1),
  })
  .strict();
export type RequestPolicy = z.infer<typeof requestPolicySchema>;

/** License/identity metadata for the resolved provider (here, Wikidata = CC0). */
export const sourceMetadataSchema = z
  .object({
    source_id: idSchema,
    name: z.string().min(1),
    license: z.string().min(1),
    commercial_use: z.boolean(),
    attribution_required: z.boolean(),
    share_alike_required: z.boolean(),
    url: z.string().min(1),
  })
  .strict();
export type SourceMetadata = z.infer<typeof sourceMetadataSchema>;

export const sourcePackSummarySchema = z
  .object({
    seed_entities: z.number().int().min(0),
    resolved: z.number().int().min(0),
    unresolved: z.number().int().min(0),
    candidate_count: z.number().int().min(0),
  })
  .strict();
export type SourcePackSummary = z.infer<typeof sourcePackSummarySchema>;

export const foundrySourcePackSchema = z
  .object({
    // v2 added per-candidate `instance_of` + `disambiguation`, per-result
    // `selected_qid`/`ambiguous`, and `request_policy.search_limit`.
    // v3 (same shape, scoring-knowledge change): journal/periodical/episode/
    // family-name homonym exclusion, negative-score auto-reject (wrong-kind
    // best candidate -> unresolved), parenthetical query sanitization.
    version: z.literal(3),
    provider: z.literal("wikidata"),
    batch_id: batchIdSchema,
    batch_title: z.string().min(1),
    generated_at: z.string().min(1),
    generator: z
      .object({
        name: z.string().min(1),
        version: z.literal(3),
      })
      .strict(),
    request_policy: requestPolicySchema,
    source_metadata: sourceMetadataSchema,
    results: z.array(sourcePackResultSchema),
    summary: sourcePackSummarySchema,
    notes: z.array(z.string()).default([]),
  })
  .strict();
export type FoundrySourcePack = z.infer<typeof foundrySourcePackSchema>;
