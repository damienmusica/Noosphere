# Data Foundry — Current Phase Working Brief

This is the **current-phase working brief** for Noosphere. It governs scope and intent for the data
methodology / Data Foundry phase. It defers to [`docs/project-charter.md`](project-charter.md) for
durable identity, posture, and boundaries, and to the specific source-of-truth documents (data
model, relation taxonomy, policies) for the topics they own. See
[`docs/source-of-truth.md`](source-of-truth.md) for the hierarchy.

This brief describes the **methodology and boundaries**. It does not, by itself, build Data Foundry
tooling — that happens in later, explicit PRs (see the implementation sequence below).

## 1. The data bottleneck

Noosphere's main constraint is **high-quality graph data, not UI**. A polished interface over a thin
or unreliable graph has little value. The atlas becomes useful as its node/edge coverage grows while
staying evidence-backed, license-clean, and reviewable.

## 2. Goal

Build a **cloud-LLM-API-free, local/offline-first data proposal and curation workflow** that can
construct graph data at scale while honoring every charter boundary. The workflow turns open inputs
into schema-valid, evidence-pointed *candidate* data, then routes it through validation and a
risk-tiered curation gate before any of it becomes reviewed or indexable.

## 3. Allowed inputs

- **Repo-managed JSON** under `/data` (the existing source of truth).
- **Open, free public knowledge APIs** that are documented, safe, and license-compatible
  (e.g. Wikidata, OpenAlex, ORCID, VIAF).
- **Public datasets / dumps** with a compatible license.
- **Interactive LLM assistance** used by maintainers *outside* programmatic API calls — reasoning,
  design, review, prompt writing, and code/data drafting done through interactive tools.

## 4. Forbidden inputs

- **Cloud LLM APIs called from scripts** (OpenAI, Anthropic, or any other).
- **Paid or proprietary APIs required** for build/validate/export/report/runtime.
- **Secrets or tokens** of any kind in the repo or environment.
- **Scraping or crawling article bodies.**
- **NamuWiki as evidence or source** — it remains external-link-only, never cached, never cited.

## 5. Batch lifecycle

Large-scale data construction happens in **batches**, each moving through a fixed pipeline:

1. **Batch manifest** — declares scope, target domains/relations, risk tier, inputs, and the source
   resolvers it will use.
2. **Source resolution** — resolves entities/claims against allowed open sources, recording provider
   IDs in `external_ids` and citable entries in the source registry.
3. **Proposal generation** — emits schema-shaped candidate nodes/edges with evidence pointers. Output
   is `generated`/`proposed`, never `reviewed`.
4. **Validation** — runs the existing Zod schema + policy validation against the candidate batch.
5. **Report** — produces a deterministic report (coverage, risk flags, license posture, anomalies)
   for the curation decision.
6. **Risk-tiered curation gate** — the batch is accepted, revised, or rejected against the criteria
   for its risk tier.
7. **Static reviewed/indexable release** — accepted data is promoted to `reviewed`, and eligible
   items may become `indexable`, shipped as a static release.

## 6. Status semantics

- **`generated`** — raw tool/model output. Not trusted. Not citable as established. Never indexable.
- **`proposed`** — schema-valid candidate data with evidence/source pointers. A real candidate for
  review, but not yet accepted. Never indexable.
- **`reviewed`** — passed the curation gate for its risk tier **and** was accepted through a
  batch/release decision. Eligible to be indexable.
- **`indexable`** — allowed into public/static atlas surfaces. Only `reviewed` items qualify.

## 7. Review semantics

"Reviewed" is a **curation-gate outcome**, not a guarantee that the owner read every row.

- The owner **does not need to line-by-line verify every low-risk row.**
- The owner **approves the process, the batch scope, the reports, the exceptions, and the high-risk
  claims.**
- Higher risk tiers demand more direct, item-level scrutiny; lower tiers may be accepted on
  process + report evidence for the batch as a whole.

## 8. Risk tiers

From lowest to highest scrutiny:

- **Low-risk structural taxonomy** — `part_of` hierarchies, domain/field/subfield structure.
- **Medium-risk summaries / concept relations** — concept-to-concept relations and short summaries.
- **Pedagogical relations / learning paths** — `prerequisite_for` chains and curated paths.
- **Historical people / works / influence claims** — `influenced`, `founded_or_formalized`,
  `canonical_work`, and similar historical claims.
- **High-risk living-person / current / controversial claims** — claims about living people, current
  events, or contested topics. These require the strictest evidence and the most conservative
  wording, and always need explicit owner review.

## 9. Current implementation sequence

The phase proceeds in deliberate, explicit PRs:

1. **SSOT rebaseline** — establish charter, this brief, and the rebaselined hierarchy *(this PR)*.
2. **Foundry scaffold** — directory/manifest conventions and a deterministic, offline pipeline shell.
3. **First open-source resolver** — likely **Wikidata** (CC0, well-documented, stable IDs).
4. **Proposal report improvements** — richer, deterministic curation reports.
5. **Batch data expansion** — run real batches through the gate to grow coverage.
6. **Search index** — build a static search index over reviewed data.
7. **Static UI** — the read-only atlas surface over reviewed/indexable data.

This brief covers step 1 only. Steps 2+ are implemented later, each in its own reviewable PR.

## 10. Initial scaffold — current commands

Step 2 (the **Foundry scaffold**) is now in place as an **offline, deterministic** shell. It
establishes directory/manifest conventions and a proposal-skeleton workflow that future resolver PRs
can build on. It calls **no** public knowledge APIs and **no** cloud LLM APIs yet, and requires no
secrets, tokens, or network access.

Conventions:

- **`/foundry`** holds committed Foundry inputs: batch manifests under `foundry/batches/*.json` and
  templates. These are **construction inputs / candidates**, not canonical graph data.
- **`/data`** remains the **canonical source of truth** for currently accepted graph data. The
  scaffold never reads from or writes to `/data`.
- **`dist/foundry/...`** holds **generated** proposal skeletons. It is gitignored and must **not** be
  committed — regenerate it locally as needed.

Commands:

```bash
# Validate every batch manifest under foundry/batches against the Foundry schema.
npm run foundry:validate-batches

# Build an offline proposal skeleton for a batch into dist/foundry/proposals/...
npm run foundry:proposal-skeleton -- foundry/batches/machine-learning-foundations-v1.json
```

`foundry:validate-batches` parses each `foundry/batches/*.json` with the Zod schema in
`src/schema/foundry-batch.ts`, checks for duplicate batch IDs, and prints a concise, deterministic
report. It exits non-zero on any validation error.

`foundry:proposal-skeleton` validates the given manifest and writes a candidate proposal skeleton
(a normalized manifest copy, empty `nodes`/`translations`/`edges`/`external-links`/`sources`/
`learning-paths` arrays, a small `report.json`, and a `README.md`) under the manifest's
`output.proposal_dir` inside `dist/foundry/...`. It never marks anything `reviewed` or `indexable`
and never touches `/data`.

## 11. Wikidata source-pack resolver (first network resolver)

The first **network-dependent** resolver is now in place. It is a narrow
**source-resolution** job — step 2 of the batch lifecycle (§5) — and nothing else:
it produces *candidate* source-resolution material, not canonical graph data and
not a proposal.

```bash
npm run foundry:resolve-wikidata -- foundry/batches/machine-learning-foundations-v1.json
```

What it does:

- Reads and validates the given batch manifest with `foundryBatchSchema`, and
  **refuses to run** unless the manifest lists `wikidata` in
  `allowed_public_sources`.
- Resolves each `seed_entities[].label` against Wikidata using **open / free /
  public, keyless** endpoints only:
  - the MediaWiki Action API `wbsearchentities` for English label search, and
  - `Special:EntityData/<QID>.json` for compact entity metadata.
- **Deterministically re-ranks** each seed's candidates by *type fit* before
  keeping the top few (see "Disambiguation" below). It intentionally does **not**
  treat rank 1 as a final decision — choosing the canonical QID is a later,
  human-reviewed step — but it records a best guess (`selected_qid`) and flags
  low-confidence seeds (`ambiguous: true`).
- Writes a compact source pack to
  `dist/foundry/source-packs/<batch-slug>/wikidata.json`, validated against
  `foundrySourcePackSchema` in `src/schema/foundry-source-pack.ts`.

### Disambiguation (source-pack format v2)

Wikidata label search (`wbsearchentities`) ranks by string match, so its first
hit is often the wrong *kind* of entity — e.g. for "Calculus" it returns an
arachnid genus before the branch of mathematics, and for "Mathematics" the
"Mathematics Genealogy Project" database before the discipline. To correct this
**without** a cloud LLM or SPARQL, the resolver scores candidates deterministically:

- It reads each candidate's Wikidata `instance of` (P31) classes — already present
  in the entity data it fetches, so **no extra requests** are needed for them.
- A small, **curated and label-verified** set of P31 classes marks an entity as
  the kind Noosphere models (academic discipline, branch of mathematics, method,
  algorithm, concept, …), aligned to the seed's `expected_type`.
- Each P31 class belongs to a **kind family** mirroring the node types: *abstract*
  (discipline/method/concept — treated as one family of neighbouring kinds),
  *person*, *work*, and *institution*. A candidate is judged **relative to the
  seed's expected type**: the same family is right, a *different* recognized family
  is the wrong kind and is penalized, and classes Noosphere never models (taxon,
  database, website, disambiguation page, …) are always wrong. So a human (Q5) is
  the right kind for a `person` seed but the wrong kind for a `field` seed, and a
  book is the wrong kind for a `person` seed.
- Scoring favours an aligned type and an exact label match, penalises an excluded
  type, and uses an English-Wikipedia sitelink and the provider's original order
  only as tie-breakers. **P31 is a signal, never a gate:** valid concepts that
  carry no P31 (e.g. "random variable") still resolve, on the label/sitelink
  signals alone. Deprecated-rank P31 statements are ignored.
- The candidate pool is widened (`request_policy.search_limit`) beyond the
  retained `candidate_limit` so a correct entity the provider ranked low can still
  be recovered, then re-ranked and trimmed.

Each candidate records its `instance_of` QIDs and a `disambiguation` breakdown
(`score`, `aligned_with_expected_type`, `excluded`, `exact_label_match`, and
human-readable `signals`). A seed is flagged `ambiguous` for manual selection
when the top two candidates score within a small gap, **or** when the winner
itself has a weak signal (an excluded kind, or no positive type signal at all).
This is best-guess *candidate* material only — it still does not mark anything
`reviewed` or `indexable`, and `/data` stays untouched.

Boundaries it preserves:

- It is **network-dependent and intentionally not run in CI.** CI stays offline:
  it continues to run `typecheck`, `validate:data`, `export:graph`, `report:graph`,
  and `foundry:validate-batches`, none of which require network access. Build,
  validation, export, and reporting must never depend on this resolver.
- **Run and verify it locally.** Because it needs real outbound network access,
  **restricted or sandboxed environments may silently block it** — for example a
  hosted agent/CI sandbox whose egress allowlist excludes `www.wikidata.org` will
  return HTTP 403 from the proxy, so the resolver cannot be exercised there. Treat
  a green offline core in such an environment as **not** evidence that resolution
  works; run `foundry:resolve-wikidata` on a machine with open outbound access and
  confirm the source pack before relying on it.
- It uses **open / free / public Wikidata access only** — no secrets, API keys,
  tokens, OAuth, or env-required auth. (A non-secret `NOOSPHERE_WIKIDATA_USER_AGENT`
  env var may override the User-Agent, but the resolver works without it.) It does
  **not** use SPARQL.
- Requests are **read-only and serial**, with a polite delay and a descriptive
  User-Agent. It does **not** crawl links, fetch article/Wikipedia bodies, or use
  NamuWiki, and it stores only compact selected metadata — never full raw entity
  JSON or any article text.
- It **never reads or writes `/data`.** `/data` remains the canonical accepted
  graph data; nothing here is marked `reviewed` or `indexable`.
- Generated source packs live under `dist/foundry/...`, which is **gitignored** and
  must **not** be committed — regenerate locally as needed.

Future PRs may consume these source packs to generate `proposed` graph patches
(recording QIDs in `external_ids`, citable entries in the source registry, etc.),
but this PR stops at source-resolution candidate output.

Future resolver PRs may add further **open / free / public** knowledge API calls
(e.g. OpenAlex, ORCID) for source-resolution and proposal-fetch jobs, following
the same boundaries.
