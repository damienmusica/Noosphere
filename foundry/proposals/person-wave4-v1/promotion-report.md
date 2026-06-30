# person-wave4-v1 — promotion report (what entered /data, under which policy)

**Session #39, decision (70), 2026-06-30.** All writes are in-place appends to `data/nodes.json`,
`data/node-translations.json`, `data/edges.json`; zero reformat of existing entries.

## Nodes written `reviewed` (8)

| node | type | QID | living | path / policy |
|---|---|---|---|---|
| person:karl-marx | person | Q9061 | no | node policy v1 (QID resolver-verified + P570 present → deceased) |
| person:robert-koch | person | Q37193 | no | node policy v1 (deceased) |
| person:charles-sanders-peirce | person | Q187520 | no | node policy v1 (deceased) |
| person:alfred-russel-wallace | person | Q160627 | no | node policy v1 (deceased) |
| person:william-labov | person | Q357923 | no | node policy v1 (deceased — P570 2024-12-17 live-confirmed; observe-only correction) |
| person:george-lakoff | person | Q313772 | **yes** | **living-person v2** (floor met + supported, no escalation → auto-`reviewed`) |
| person:vint-cerf | person | Q92743 | **yes** | **living-person v2** (same) |
| concept:internet | concept | Q75 | no | concept node admitted (QC modeling ruling; concept type pre-exists in schema) |

All 8 `indexable:false` (no original summary written — the same earned indexability rule as every node,
*not* a living-person suppression). Each carries a `reviewed` en translation (label + aliases, empty
summary), matching the Seligman/Darwin person pattern.

## Edges written `reviewed` (7) — all `founded_or_formalized`

| edge | conf | endpoints reviewed | verdict | promotion policy |
|---|---|---|---|---|
| edge:karl-marx-founded-sociology | 0.90 | ✓✓ | supported | founder ladder (decisions (60)/(61)) |
| edge:robert-koch-founded-microbiology | 0.95 | ✓✓ | supported | founder ladder |
| edge:charles-sanders-peirce-founded-semiotics | 0.92 | ✓✓ | supported | founder ladder |
| edge:alfred-russel-wallace-founded-evolutionary-biology | 0.85 | ✓✓ | supported | founder ladder |
| edge:william-labov-founded-sociolinguistics | 0.95 | ✓✓ | supported | founder ladder (deceased after observe-only correction) |
| edge:george-lakoff-founded-cognitive-linguistics | 0.88 | ✓✓ | supported | **living-person v2 policy-auto** |
| edge:vint-cerf-founded-internet | 0.90 | ✓✓ | supported | **living-person v2 policy-auto** |

Every edge: `evidence: ["source:wikipedia"]` (≥2 independent Wikipedia articles per the wave-3/Seligman
pattern, with additional independent publishers recorded in `qc-report.md`), `evidence_kind:
"externally_sourced"`, full `proposed_by` provenance, and a conservative attributed `note` carrying the
verbatim claim quotes + QID-correction provenance + record-not-resolve context. Status cap (clause 3)
satisfied — every endpoint is `reviewed`.

## Policy application summary
- **Founder ladder (deceased):** 5 edges auto-promoted (both endpoints reviewed + supported).
- **Living-person v2 policy-auto:** 2 nodes + 2 edges auto-promoted to `reviewed` **without per-item CPO
  sign-off** — the first execution of decision (70). Floor met, 0 escalation signals.
- **Escalations to owner review: 0.** None of the narrow signals fired.
- **Stop-points hit: 0** beyond the Stage 0 scope ratification (CPO ratified base scope + Cerf/internet).
  The Labov observe-only correction was reported, not escalated (deceased path is strictly safer).
- **Schema/taxonomy/sources unchanged.** typecheck + validate green (472 nodes / 472 translations /
  559 edges / 21 sources).

## Re-auditability
Full provenance retained on every node/edge (QID anchor, `proposed_by`, `evidence`, `confidence`,
`note`), so the living-person promotions (Lakoff, Cerf) are bulk re-auditable and reversible — the v2
guarantee that replaces per-item sign-off.
