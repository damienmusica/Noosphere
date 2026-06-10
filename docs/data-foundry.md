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

### Evidence kinds

Evidence is of two kinds. **Externally-sourced** evidence backs structural and
factual edges (e.g. `part_of` backed by Wikidata). **Editorial/curatorial**
evidence backs pedagogical judgments (`prerequisite_for`, learning paths) and
is recorded against `manual` sources. Pedagogical edges should cite a real
curriculum or textbook source where one exists, and fall back to manual
curation only when none does. The `source_type` field must honestly reflect
which kind an edge relies on.

## 9. Current implementation sequence

**Depth before breadth.** Take one domain (machine-learning foundations) fully
to `reviewed`/`indexable` end-to-end before expanding. The aspirational target
scale is reached by repeating a proven loop, not by parallel breadth.

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
(`score`, `aligned_with_expected_type`, `positive_type_signal`, `excluded`,
`exact_label_match`, and human-readable `signals`). A seed is flagged `ambiguous`
for manual selection when the top two candidates score within a small gap, **or**
when the winner itself has a weak signal — judged by `positive_type_signal` and
`excluded`, **not** the total score, so a sole exact-label hit with no real type
signal is still flagged rather than emitted as a confident `selected_qid`.
This is best-guess *candidate* material only — it still does not mark anything
`reviewed` or `indexable`, and `/data` stays untouched.

#### Known limitation: exclusion is an allow-list, by design

The kind families are **curated allow-lists**, so exclusion only fires for P31
classes Noosphere explicitly knows. A P31 class that is *not* in any family set
(e.g. `painting`, `sculpture`, `building` for a `person` seed) is treated as
**neutral, not wrong-kind** — it is neither boosted nor penalized. This is a
deliberate recall-over-precision tradeoff: tightening it to "any non-aligned P31
is wrong" would wrongly penalize correct entities whose real P31 is simply not in
the curated sets (e.g. "probability distribution", which has a P31 outside the
abstract set and would otherwise be excluded).

This does **not** cause a silent wrong `selected_qid`, because of two backstops:

- The correct entity, when present, carries an *aligned* P31 (+100) that
  outscores any neutral wrong-kind candidate (≤ 40 from label/sitelink alone).
- A winner with no `positive_type_signal` is flagged `ambiguous` regardless of
  score, so an uncurated wrong-kind that wins only because the correct entity was
  not fetched is surfaced for manual review, never accepted as confident.

The cost is therefore reduced *recall of exclusion* (some wrong kinds score
neutral instead of negative), not reduced *correctness*. Families can be extended
incrementally as new batches surface new kinds; each added QID must be
label-verified first (see `QID_LABELS` in the resolver).

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

## 12. Skeleton modeling standard (granularity & structure)

> Promotion policy v1.3 (CPO-ratified 2026-06-10, vault decision log (14)). This section is a
> **mandatory input to every skeleton generation order**. It converts recurring design questions —
> previously raised per-node via `ambiguous` flags — into standing rules. It accretes precedents:
> each new QC ruling on a case this standard does not cover is appended here as one line, so the
> next continent's generator inherits it.

### Keep criteria (the dual criterion)

A skeleton node (field/subfield) is kept only if **both** hold:

- **(a) Classification presence:** it is a major division in the classification sources for its
  continent (UDC / LCC; discipline-specific schemes such as MSC serve as a cross-check, not a gate).
- **(b) Community presence:** it exists as a named department/research-area-level unit — journals,
  societies, department groups, degree tracks.

MSC-top-level-only areas with no department-level standing fail (b); department-named areas with no
classification division of their own fail (a). Both failures are recorded as deliberate
non-coverage, never silently dropped.

### Structural rules

1. **Flat two-level skeleton.** Fields (level 1) and subfields (level 2) only. A parent and its
   sub-area may coexist as peer subfields when both pass the dual criterion (precedent:
   metaphysics/ontology in philosophy; mathematical-logic and its four pillars in formal sciences).
2. **Absorption rule.** A candidate that names a refinement of a kept node serving the same
   community is dropped and recorded as a v2 re-split candidate (precedent: german-idealism
   deferral in philosophy; group-theory/graph-theory absorption in formal sciences).
3. **Cross-continent assignment rule.** A node is deferred to another continent only when **both**
   its primary LCC home **and** its dominant institutional home lie outside the current continent
   (precedent: cryptography→CS, econometrics→social sciences, biostatistics→medicine). Boundary
   areas filed under the current continent by its classification sources stay, with the boundary
   recorded in `uncertainty` and the flag kept true (real-world contest → stops at `proposed`).
4. **Label rule.** When a pedagogical course label and a research-area label name the same referent,
   keep the research-area node (precedent: abstract-algebra merged into algebra).

### Flag semantics under this standard

- Generators apply this standard directly; a design question this standard answers needs **no**
  `ambiguous: true` flag. Flags remain mandatory for: novel design cases this standard does not
  cover, unverifiable factual inputs, and real-world contests (identity, boundary, vitality).
- **A-type flags** (modeling/granularity questions addressed to QC): QC may retire the flag by a
  documented ruling — per-node retirement note + qc-report entry — and the ruling is appended to
  this standard as precedent. **Every retirement is reported per batch on the dashboard**; the
  retirement count trending down across continents is the measure of this standard's quality.
- **B-type flags** (real-world contests): never retired by ruling alone — resolution requires the
  v1.1 external-evidence path (≥2 independent sources, URL-cited, permanent resolution record).

### Precedent log (append one line per new QC ruling)

- 2026-06-10 philosophy: tradition/methodology axes kept as subfields; movement-level granularity
  deferred (german-idealism dropped); logic and decision-theory stay humanities (cross-listing
  parked); ontology is a peer of metaphysics.
- 2026-06-10 formal sciences: mathematical-logic demoted field→subfield (MSC top-level sections are
  divisions within mathematics, not peers of it); ASL pillars (set/model/proof/computability theory)
  kept as peer subfields; differential-equations and PDE both kept (separate MSC top levels +
  department naming); statistics method-level nodes (MSC 62 G/H/J/K/N) collapsed into
  applied-statistics; real-analysis dropped while complex-analysis kept (living research identity);
  representation-theory not added (fails criterion (a)) — first-in-line v2 candidate with
  graph-theory.
- 2026-06-10 part_of edges (first structural edge batch): the §12 flat rule governs node levels,
  not edge depth — part_of chains may run deeper than two hops. The ASL pillar subfields take
  `subfield:mathematical-logic` as their part_of parent (MSC 03C/D/E/F are subsections of 03;
  library shelving that scatters their books is not a hierarchy claim); statistics-cluster
  subfields (bayesian/mathematical/computational statistics, time-series) take `field:statistics`
  (MSC 62 subsections + standalone communities); cybernetics takes `field:systems-science`
  (UDC 007 + LCC Q300-390); history-of-mathematics stays under mathematics (MSC 01 + LCC QA21-27
  unanimous — a boundary concern does not survive source agreement).
- 2026-06-11 computer & information sciences (source interpretations): a discipline-specific
  scheme may be a gate-level classification source when the continent's manifest ratifies it in
  the coverage baseline (ACM CCS 2012 here — LCC compresses the whole continent into ~1.5 class
  numbers; MSC 68 and FORD 1.2 stay cross-checks); LCC cutter-level subdivisions inside such a
  compressed range (QA75.5-76.95) count as major divisions for criterion (a).
- 2026-06-11 computer & information sciences (rulings): machine-learning demoted field→subfield
  with canonical ID migration (mathematical-logic precedent — UDC files ML under 004.8, CCS as a
  sibling of AI, LCC at Q325.5 under Cybernetics; no field-level institutional standing); AI
  enters as a peer subfield; theory-of-computation umbrella coexists with algorithms/complexity/
  formal-languages peers (peer-coexistence rule); cryptography/computer-security split upheld
  (CCS separates the branches; IACR vs S&P communities); computer-systems kept as the systems
  umbrella (OS/architecture/performance absorbed, v2 re-split candidates); the LIS wing stays
  in-continent with field-level standing (LCC Z665-718.8 + UDC 02 own divisions; iSchools are
  faculties of their own — two-prong test, no policy escalation); social-computing stays (CCS
  branch + CSCW community; computational social science is social-sciences non-coverage);
  bioinformatics deferred to life sciences (LCC QH324.2 + institutional home — biostatistics
  precedent); archival-science fails criterion (a) in-continent (novel ruling: a department-named
  area whose classification homes — LCC CD, UDC 930.25 — lie in another continent's classes waits
  for that continent's skeleton; §13 can cross-list it later); data-science recorded as deliberate
  non-coverage (named departments, no classification division — representation-theory pattern).

## 13. Cross-listing standard (multiple `part_of` memberships)

> Cross-listing policy v1 (CPO-ratified 2026-06-11, vault decision log (21)). Governs disciplines
> that genuinely belong to more than one parent — the cases the single-parent model could not
> resolve (clause-6 "genuine splits").

- **Co-equal multiple parents.** A node may carry multiple `part_of` parent edges, all co-equal —
  there is **no primary-parent marker**. The "choose the single parent" question does not exist in
  this model; a node previously stuck at `proposed` on such a contest is promoted once **each**
  membership edge passes its own evidence gate.
- **Single node ID, render-time instances.** A cross-listed discipline remains **one node with one
  language-independent ID**. Multiple appearances (e.g. inside each parent continent's rendered
  region) are *render instances* of that one node, and any disambiguating display-label suffix is
  computed at render time — **never stored in data**. Graph topology and identity never fork.
- **Same evidence discipline for every membership.** A second (or nth) `part_of` edge requires the
  same externally-sourced classification grounding and QC as the first (edge promotion policy v1,
  clause 1). Memberships cannot be created on editorial feel — this is the structural guard against
  membership spam.
- **Asymmetry is per-edge data.** Differences in how strongly each parent claims the node are
  conveyed by each edge's `confidence`, `disputed` (with the minority position in `note`), and
  `note` — interpretation and display stay downstream.
- **Coverage dashboards count unique nodes.** A cross-listed node counts once in coverage metrics,
  regardless of how many membership edges or render instances it has.
- Edge targets follow the §12 precedent that the flat rule governs node levels, not edge depth: a
  membership edge may target a domain directly while the proper field-level parent does not yet
  exist, with a re-target note recorded on the edge.
