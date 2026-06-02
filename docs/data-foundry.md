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
