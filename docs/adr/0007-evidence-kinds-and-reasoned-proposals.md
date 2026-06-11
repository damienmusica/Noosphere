# ADR 0007 — Evidence kinds and reasoned proposals

- **Status:** Accepted
- **Date:** 2026-06-04

## Context

Two gaps surfaced during Data Foundry methodology review:

**Evidence kinds.** Every edge requires non-empty `evidence`, but "evidence" silently meant two
different things: external citations for structural/factual edges (e.g. a `part_of` hierarchy backed
by Wikidata) and curator judgment for pedagogical edges (e.g. a `prerequisite_for` chain expressing
a learning path). Treating them identically obscures what `source_type` means in practice and makes
the curation gate harder to calibrate. Both kinds are legitimate; the distinction must be recorded
honestly.

**Reasoned proposals.** The curation gate scales by risk tier (ADR 0006), but the per-item review
step has a throughput problem when LLM-assisted proposals are reviewed at result level only ("is
this edge right?"). A reviewer cannot efficiently assess a proposal without knowing why the item was
proposed, where it might be wrong, or whether it was flagged as ambiguous. Requiring exposed
reasoning at the proposal stage shifts review effort from re-deriving the rationale to judging the
stated rationale — a more tractable task.

## Decision

### A. Two honest evidence kinds

Evidence is of two kinds:

- **Externally-sourced** — backs structural and factual edges (e.g. `part_of` backed by a Wikidata
  source). The `source_type` field references a recorded external source.
- **Editorial/curatorial** — backs pedagogical judgments (`prerequisite_for`, learning paths). It is
  recorded against `manual` sources. Pedagogical edges should cite a real curriculum or textbook
  source where one exists; `manual` curation is a fallback, not a first resort.

The `source_type` field on every edge's evidence must honestly reflect which kind applies. Both are
valid inside the schema; the distinction is a data-quality and transparency obligation, not a
structural restriction.

### B. Reasoned-proposal requirement for AI-assisted proposals

AI-proposed nodes and edges must expose their reasoning before they may enter the curation gate.
Each proposed item must carry:

1. A one-line **rationale** for the relation.
2. A one-line **self-identified note** on where it could be wrong.
3. An `ambiguous` **self-flag** when confidence is low.

Proposals without exposed reasoning may not enter the curation gate. This applies to items generated
or proposed with LLM assistance. It does not change the canonical `/data` edge schema — reasoning
fields belong in proposal artifacts under `dist/foundry/`, not in accepted graph data.

## Consequences

- **For proposal artifacts** (`dist/foundry/...`): future proposal-generation steps must emit
  per-item `rationale`, `uncertainty`, and `ambiguous` fields in their output.
- **For the curation gate**: reviewers assess stated reasoning rather than re-deriving it, scaling
  throughput without lowering accuracy.
- **For edge authoring**: maintainers must choose the correct `source_type` for every evidence entry,
  distinguishing externally-sourced from editorial/curatorial.
- **For pedagogical edges**: `prerequisite_for` and learning-path edges should cite a real curriculum
  or textbook source where one exists; `manual` is the honest fallback, not the default.
- **Schema is unchanged.** Reasoning fields are proposal-artifact concerns; canonical `/data` edges
  keep their existing clean shape.

See [`docs/project-charter.md`](../project-charter.md), [`docs/data-foundry.md`](../data-foundry.md),
[`docs/ai-usage-policy.md`](../ai-usage-policy.md), and
[ADR 0006](0006-data-foundry-and-llm-boundary.md) (which this ADR relates to but does not supersede).

---

**Clarification (2026-06-11, decision unchanged):** "proposal artifacts under `dist/foundry/`"
describes where generated artifacts are *born* (gitignored). In practice since 2026-06-10, curated
proposal batches and their permanent QC/grounding/resolution reports are **committed under
`foundry/proposals/`** for the durable paper trail (indexed in `foundry/proposals/README.md`);
they remain untrusted `generated`-tier material either way. This note records current practice —
the reasoned-proposal contract itself is unchanged.
