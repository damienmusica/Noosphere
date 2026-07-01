# a-relations-wave3-v1 batch report (generator output + orchestrator QC record)

Batch: Phase-2 cross-cutting intellectual edges. Proposer: Claude Sonnet (`claude-sonnet-5`),
`proposed_at` 2026-07-02. Round 4, session #49. Stage 3 axis ② (CPO-directed): densify the sparse
relational layer (`influenced` 19 / `critiques` 5 / `applies_to` 4 = 28 across 568 nodes). Separated-context
generation (ADR 0007) → orchestrator live claim-stating QC. The (68) (a)-relation ladder auto-promotes
`supported` edges (both endpoints already `reviewed`).

## Endpoint validation

All 30 distinct endpoints across the 18 items exist, are `status: reviewed`, and every person endpoint is
`is_living_person: false` (living-person guard not triggered). No missing nodes.

## Orchestrator QC — 9 supported / 3 proposed / 2 drop / 2 reject; claim hallucination 0

**Supported → auto-`reviewed` (9)** — each with ≥2 independent live claim-stating sources, direction /
temporal order correct, adversarial pass. Record-not-resolve target-granularity notes where a field-level
target stands in for an absent narrower subfield node.

| tag | edge | note |
|---|---|---|
| A1 | statistical-physics → information-theory (influenced) | shared entropy formalism; von-Neumann-naming anecdote not load-bearing |
| A2 | evolutionary-biology → economics (influenced) | via evolutionary economics (Veblen) |
| A4 | Frege → linguistics (influenced) | via formal semantics (sense/reference → Montague) |
| A5 | phenomenology → psychology (influenced) | Husserl → Gestalt/humanistic/embodied |
| A9 | cybernetics → artificial-intelligence (influenced) | SEP 'cybernetics' 404 → 2nd Wikipedia article (History of AI) |
| A10 | systems-science → sociology (influenced) | Parsons / Luhmann social systems theory |
| A12 | Shannon → computational-linguistics (influenced) | n-gram statistical language models (1948) |
| A13 | Durkheim → anthropology (influenced) | → Radcliffe-Brown structural-functionalism |
| A14 | Freud → literary-studies (influenced) | psychoanalytic literary criticism |

**Held `proposed` (3)** — real relationship + correct direction, but not clearing the supported bar:

- **A8 Weber critiques Marx** — live checks (SEP Weber + Wikipedia Max Weber) confirmed co-founding
  association and a "critical impulse" framing but did not verbatim-surface the explicit
  critique-of-economic-determinism statement; proposed-first pending a confirming claim-stating source.
- **A11 Wiener → cognitive-psychology** — near-duplicate of the existing information-theory →
  cognitive-psychology edge; the distinct cybernetic-feedback contribution is real but under-promoted to
  avoid redundancy.
- **A15 evolutionary-biology → epidemiology (applies_to)** — evolutionary epidemiology / Darwinian medicine
  is genuine but niche; the epidemiology-specific link was not surfaced in the fetched intro; proposed-first.

**Dropped — already exist as `founded_or_formalized` (reviewed) (2):**

- **A7 Marx → sociology** and **A16 Peirce → semiotics** — both are already modeled as co-founders
  (`founded_or_formalized`, reviewed). An `influenced` edge would duplicate and weaken the existing founder
  edge. The generator self-flagged both as relation-choice ambiguities; QC confirmed the founder edge
  already exists. Not written.

**Rejection probes — 2/2 fired:**

- **A17 Newton → economics** — the "physics envy" source describes economics aspiring to physics' rigor,
  not Newton influencing economics; the Mint role is administrative. No documented causal chain. **Rejected.**
- **A18 Wundt → artificial-intelligence** — the History of AI article does not mention Wundt or
  introspection; AI's documented lineage runs through cybernetics/logic/computing. **Rejected.**

## Written to `/data`

- 9 edges `reviewed` (auto-promoted via the (68) ladder) + 3 edges `proposed`.
- 2 drops + 2 rejects not written (retained in `proposals.json`).
- edges 682→706 (influenced 19→29 · critiques 5→6 · applies_to 4→5). See `promotion-report.md`.
