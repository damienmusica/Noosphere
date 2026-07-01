# work-wave3-v1 promotion report

Round 4, session #49, 2026-07-02. What entered `/data` and under which policy.

## Promoted to `/data` as `reviewed` (6 work nodes + 12 `canonical_work` edges)

Auto-`reviewed` via the work-node ladder + `canonical_work`-edge ladder (decision (88), §8), all endpoints
already `reviewed`, all authors deceased (living-author guard not triggered), Lane B **supported**.

| work node | QID | canonical_work → field | canonical_work → person |
|---|---|---|---|
| work:grundlagen-einer-allgemeinen-mannigfaltigkeitslehre | Q29167832 | subfield:set-theory | person:georg-cantor |
| work:the-mind-of-primitive-man | Q7751530 | subfield:cultural-anthropology | person:franz-boas |
| work:cours-de-philosophie-positive | Q3490518 | field:sociology ★co-canonical | person:auguste-comte |
| work:the-rules-of-sociological-method | Q588341 | field:sociology ★co-canonical | person:emile-durkheim |
| work:the-protestant-ethic-and-the-spirit-of-capitalism | Q392937 | field:sociology ★co-canonical | person:max-weber |
| work:an-investigation-of-the-laws-of-thought | Q7746455 | subfield:mathematical-logic ★co-canonical (w/ Frege) | person:george-boole |

★ Co-canonical edges land under decision (90) (session #49 CPO ruling): a field may hold multiple
`canonical_work` edges (works-layer mirror of multiple founders). sociology now holds 3; mathematical-logic
holds 2 (Boole + Frege *Begriffsschrift*).

## Not written

- **Koch → microbiology** — honesty-gap drop (no decidable QID; distributed founding credit). Pasteur not
  generated (same gap). Records retained in `nodes.proposed.json`/`edges.proposed.json`.
- **2 reject probes** — Laws-of-Thought→Frege (misattribution), Cours→cultural-anthropology (wrong
  subfield). Retained in the foundry record, no `/data` edge.

## Provenance / audit

- Generator QIDs 7/7 hallucinated; all corrected via live enwiki pageprops + wbsearchentities + P31/P50/P577.
- `proposed_by` = Claude Sonnet / claude-sonnet-5 (generation) — QC/promotion by orchestrator.
- Node translations written (en, `reviewed: false` — editorial QC on a separate track).
- Counts: nodes 568→574 · edges 682→(with a-relations-wave3) · work 17→23 · canonical_work 34→46.
- `npm run typecheck` ✓ · `npm run validate:data` ✓.
