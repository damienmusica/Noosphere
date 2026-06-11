# Promotion report — social-sciences-skeleton-v1

- **Promoted by:** Claude Fable 5 (claude-fable-5), orchestrator session #13a (parallel round v1,
  merge order 1), 2026-06-11.
- **Policy:** standing node promotion policy v1 + v1.2 + v1.3 (vault decision log (7)(12)(14)) —
  policy-level gate, no per-item CPO sign-off; §12/§13 pinned at `d816cb6` for the round.
- **Inputs:** QC-shaped proposal (39 nodes, `proposal.json` + `qc-report.md`) and resolver-v4
  grounding (36/39 verified QIDs, 3 upstream gaps, `grounding-report.md`).

## Policy application

| Bucket | Rule | Count | Outcome |
|---|---|---|---|
| Verified QID + QC ambiguous=false | v1 structural tier | **30** (6 fields + 24 subfields) | `reviewed` + `indexable` |
| Verified QID + B-type boundary flag | v1: ambiguous stops the ladder | **6** (media-and-communication-studies, mass-communication, human-geography, jurisprudence, physical-anthropology, urban-and-regional-planning) | `proposed` (clause-6/v1.1 queue) |
| No verified QID | stays in foundry | **3** (economic-theory, business-and-management, archaeological-anthropology — 2 referent-rank gaps + 1 near-orphan anchor; archaeological-anthropology is additionally B-flagged) | — |

`/data` after promotion: **232 nodes (reviewed 218 / proposed 14, indexable 218)**; 36 new `en`
translation rows (labels from the proposal; summaries deferred — editorial is the round's
carry-over default, billed to the cleanup ledger; renamed-referent/anchor-label aliases on
physical-anthropology 'Biological Anthropology', labor-economics 'Labour Economics',
social-work-and-welfare 'Social Work', media-and-communication-studies 'Communication
Studies'/'Media and Communication', urban-and-regional-planning 'Spatial Planning',
educational-policy 'Education Policy'). No edges in this batch (skeleton-first); the part_of
skeleton is the next batch, where the recorded triggers fire (mathematics-education re-target to
field:education; game-theory economics-side §13; decision-theory second membership;
financial-mathematics social-sciences-side minority membership; political-theory evidence parked
as political-philosophy's §13 political-science membership; statistics-family social-sciences-side
§13 evidence).

## Golden set

39 entries appended in the grounding PR (#81, golden set 199 → 238): 35 rank-1 verified + 1
manual-path (social-work Q205398, `must_not_select: Q828395`) + 3 upstream gaps with guards.
Post-adjudication regression: 35 pass / 2 by-design FAILs (gap guards firing against this pack's
own rejected rank-1s — documented-limitation pattern) / 2 INFO. Collision guards live:
jurisprudence↔Q126842 (canonical philosophy-of-law), civil-law↔Q5950118 (legal-system sense),
planning↔Q64808211 (thin twin).

## Evidence permanence (§8)

Per parallel-round-v1 ③ (same-IP stagger), the SPN save pass is deferred to #14; this batch's
verdict-bearing URL queue is recorded permanently in the session report
(`session-13a-report.md`) and every accepted entity state is independently pinned by
`wikidata_lastrevid` in `grounding-report.md` — the §8 permanent-record half-duty is satisfied,
the save half is queued (after-pay).
