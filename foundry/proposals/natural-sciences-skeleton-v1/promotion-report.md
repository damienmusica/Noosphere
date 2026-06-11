# Promotion report — natural-sciences-skeleton-v1

- **Promoted by:** Claude Fable 5 (claude-fable-5), orchestrator session #11, 2026-06-11.
- **Policy:** standing node promotion policy v1 + v1.2 + v1.3 (vault decision log (7)(12)(14)) —
  policy-level gate, no per-item CPO sign-off (decision (29) continent selection).
- **Inputs:** QC-shaped proposal (41 nodes, `proposal.json` + `qc-report.md`) and resolver-v4
  grounding (41/41 verified QIDs, `grounding-report.md`).

## Policy application

| Bucket | Rule | Count | Outcome |
|---|---|---|---|
| Verified QID + QC ambiguous=false | v1 structural tier | **34** (3 fields + 31 subfields) | `reviewed` + `indexable` |
| Verified QID + B-type boundary flag | v1: ambiguous stops the ladder | **7** (environmental-science, biophysics, biochemistry, oceanography, hydrology, geomorphology, geodesy) | `proposed` (clause-6/v1.1 queue) |
| No verified QID | stays in foundry | 0 | — (first batch with zero upstream gaps) |

`/data` after promotion: **196 nodes (reviewed 181 / proposed 15)**; 41 new `en` translation rows
(labels from the proposal; absorption-ruling aliases on statistical-physics and
atmospheric-science; AMO Physics alias). No edges in this batch (skeleton-first); the part_of
skeleton is the next batch, where the recorded re-target triggers (quantum-computing →
field:physics; mathematical-physics minority-side §13 candidate) are handled.

## Golden set

41 entries appended (`batch:natural-sciences-skeleton-v1`, golden set 158 → 199): 39 rank-1
verified + 2 manual-path (AMO — fallback-recovered compound entity; statistical-physics — manual
Q677916 with `must_not_select: Q11473` guarding the component anchor). Post-promotion regression
check: **39 pass / 0 warn / 0 fail / 2 info** (the two manual paths surface as IMPROVED — exactly
the expected v4 fallback behaviour).

## Evidence permanence (§8) — SPN pass

The batch's verdict-bearing URLs (41 verified `Special:EntityData` JSONs + LCC Q/R outline PDFs +
id.loc.gov QD551-578 / QD380-388 + PhySH disciplines + FORD mirror = 47 URLs) were submitted to
Wayback SPN serially (16s+ spacing). Results appended below; failures recorded honestly as
[SPN-FAILED] per §8 (observed entity states are independently pinned by `wikidata_lastrevid` in
the grounding report).
