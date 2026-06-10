# QC report — batch:philosophy-skeleton-v1

**QC by:** Claude Fable 5 (`claude-fable-5`), orchestrator context, 2026-06-10
**Generation by:** Claude Sonnet (`claude-sonnet-4-6`), separate subagent context (v1: 58 nodes; v1.1 revision applied by generation context under QC order)
**CPO gate:** 2026-06-10 — recommendations ratified as proposed ("권고대로").

Generation↔QC context separation held throughout: all node content was authored in
Sonnet subagent contexts; this QC context reviewed, classified, and ordered revisions
but wrote no node content.

## Verdict

**63 nodes (1 field + 62 subfields), 0 edges — passes QC for the `generated` tier.**
Schema-validated against `foundryProposalSchema` (independent re-run, not the
generator's self-check). All items carry the ADR 0007 contract; provenance envelope
complete. Skeleton-first respected (zero edges).

## What QC did

1. **Schema + integrity:** `foundryProposalSchema.safeParse` pass; no duplicate IDs;
   no collisions with existing `/data` node IDs (no philosophy nodes existed).
2. **Reasoning review (self-flag focus):** sampled all 8 generator-declared
   least-sure items plus the 32 `ambiguous: true` entries. Uncertainty is honestly
   exposed (e.g. the generator itself caught its wrong Japan QID).
3. **Coverage gap sweep** (independent, vs LCC B–BJ / UDC 1 / PhilPapers from
   orchestrator knowledge): found 9 gap candidates → 8 added in v1.1
   (axiology, jewish-philosophy, philosophy-of-race, metaphilosophy, hermeneutics,
   renaissance-philosophy, comparative-philosophy, ethics-of-ai), 1 rejected by the
   generator with stated reason (philosophy-of-culture — no independent
   classification grounding).
4. **academic_status verification:** distribution sane (55 established / 5 emerging /
   2 historical / 1 non_academic). Honest-tagging design works as intended
   (esotericism-and-theosophy carried as `non_academic`, not excluded).

## CPO-ratified decisions (2026-06-10)

- **Drops (3):** `philosophy-of-mind-consciousness` (duplicates philosophy-of-mind;
  concept-level), `contemporary-philosophy` (residual category, zero coverage
  information), `german-idealism` (movement-level granularity outlier; revisit in a
  future movements pass).
- **Policy A — tradition/method axis:** retained as subfields (analytic, continental,
  phenomenology, existentialism, pragmatism, critical-theory, + hermeneutics in
  v1.1). Flat skeleton makes axis-mixing harmless for now; axis design revisited
  when edges arrive.
- **Policy B — logic domain placement:** stays `humanities` for this batch (LCC BC);
  cross-domain listing policy deferred (parked).
- **Policy C — decision-theory:** retained under humanities, `ambiguous` kept; same
  cross-listing deferral as B.
- **Policy D — ontology:** retained as peer of metaphysics (UDC 111 independent class).
- **QID correction (1):** japanese-philosophy Q15057 removed (identifies Japan the
  country).

## What must happen before promotion (`generated` → curation gate → `reviewed`)

1. **Wikidata QID verification** — every QID in this batch is an unverified
   training-knowledge hint. Run the local Wikidata resolver (network required; not
   available in cloud sessions) over all 63 nodes; fill missing QIDs
   (jewish-philosophy, comparative-philosophy, philosophy-of-race, ethics-of-ai,
   korean-philosophy, japanese-philosophy, philosophy-of-perception,
   philosophy-of-cognitive-science) and confirm or strip the rest.
2. **UDC/LCC cross-check** against the resolver output for any remaining coverage
   gaps (grounding-rate dashboard per governance decision 2026-06-10 (3)).
3. **Canonical schema work** — `/data` node schema has no `academic_status` field
   yet; promotion requires adding it there via its own reviewed change (currently it
   lives only in the proposal schema).
4. CPO curation gate per item (policy escalations only; the rest ride the
   grounding-verified track).
