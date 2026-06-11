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

### SPN results (first pass, 2026-06-11 — throttle hit after 10 saves, session-#10 pattern; retry pass follows in-session)

| URL | status | snapshot / note |
|---|---|---|
| https://www.wikidata.org/wiki/Special:EntityData/Q2329.json | archived | https://web.archive.org/web/20260611054056/https://www.wikidata.org/wiki/Special:EntityData/Q2329.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q333.json | archived | https://web.archive.org/web/20260611054118/https://www.wikidata.org/wiki/Special:EntityData/Q333.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q8008.json | [SPN-FAILED] | save_http=520 (throttle) — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q188847.json | archived | https://web.archive.org/web/20260611054205/https://www.wikidata.org/wiki/Special:EntityData/Q188847.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q214781.json | [SPN-FAILED] | save_http=520 (throttle) — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q1151533.json | [SPN-FAILED] | save_http=520 (throttle) — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q14620.json | [SPN-FAILED] | save_http=520 (throttle) — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q81197.json | archived | https://web.archive.org/web/20260611054337/https://www.wikidata.org/wiki/Special:EntityData/Q81197.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q18334.json | archived | https://web.archive.org/web/20260611054400/https://www.wikidata.org/wiki/Special:EntityData/Q18334.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q5615097.json | archived | https://web.archive.org/web/20260611054422/https://www.wikidata.org/wiki/Special:EntityData/Q5615097.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q216320.json | archived | https://web.archive.org/web/20260611054445/https://www.wikidata.org/wiki/Special:EntityData/Q216320.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q677916.json | archived | https://web.archive.org/web/20260611054507/https://www.wikidata.org/wiki/Special:EntityData/Q677916.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q82811.json | [SPN-FAILED] | save_http=520 (throttle) — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q7100.json | archived | https://web.archive.org/web/20260611054553/https://www.wikidata.org/wiki/Special:EntityData/Q7100.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q1985198.json | [SPN-FAILED] | save_http=520 (throttle) — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q492496.json | archived | https://web.archive.org/web/20260611054639/https://www.wikidata.org/wiki/Special:EntityData/Q492496.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q11315305.json | [SPN-FAILED] | save_http=520 (throttle) — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q2346.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q11165.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q11351.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q11372.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q7094.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q160398.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q7877.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q37547.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q338.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q104499.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q1069.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q46255.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q161764.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q83353.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q163082.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q7205.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q83371.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q102904.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q43518.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q757520.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q42250.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q52109.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q131089.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q2122216.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.loc.gov/aba/cataloging/classification/lcco/lcco_q.pdf | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.loc.gov/aba/cataloging/classification/lcco/lcco_r.pdf | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://id.loc.gov/authorities/classification/QD553.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://id.loc.gov/authorities/classification/QD380.json | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://physh.org/disciplines | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
| https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp | [SPN-FAILED] | pass stopped under throttle before attempt — same-session retry queue |
