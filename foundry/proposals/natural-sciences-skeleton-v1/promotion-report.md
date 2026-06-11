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

### SPN results — final ledger (3 passes + existing-snapshot fallback, 2026-06-11)

**47/48 archived (97.9%)**: 37 fresh SPN saves across three throttle-separated passes + 8 §8 existing-snapshot substitutes (each verified as a real `web/<timestamp>/` redirect; a save-prompt redirect was correctly rejected for the one remaining failure). 1 × [SPN-FAILED] → next-session retry queue. Wikidata observed states are independently pinned by `wikidata_lastrevid` in the grounding report. The QC19.2-QC20.85 record URL (edge batch) is included in this ledger.

| URL | status | snapshot / note |
|---|---|---|
| https://www.wikidata.org/wiki/Special:EntityData/Q2329.json | archived (SPN) | https://web.archive.org/web/20260611054056/https://www.wikidata.org/wiki/Special:EntityData/Q2329.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q333.json | archived (SPN) | https://web.archive.org/web/20260611054118/https://www.wikidata.org/wiki/Special:EntityData/Q333.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q8008.json | archived (SPN) | https://web.archive.org/web/20260611061157/https://www.wikidata.org/wiki/Special:EntityData/Q8008.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q188847.json | archived (SPN) | https://web.archive.org/web/20260611054205/https://www.wikidata.org/wiki/Special:EntityData/Q188847.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q214781.json | existing snapshot verified | https://web.archive.org/web/20251206040653/https://www.wikidata.org/wiki/Special:EntityData/Q214781.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q1151533.json | existing snapshot verified | https://web.archive.org/web/20241202010411/https://www.wikidata.org/wiki/Special:EntityData/Q1151533.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q14620.json | existing snapshot verified | https://web.archive.org/web/20260427154000/https://www.wikidata.org/wiki/Special:EntityData/Q14620.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q81197.json | archived (SPN) | https://web.archive.org/web/20260611054337/https://www.wikidata.org/wiki/Special:EntityData/Q81197.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q18334.json | archived (SPN) | https://web.archive.org/web/20260611054400/https://www.wikidata.org/wiki/Special:EntityData/Q18334.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q5615097.json | archived (SPN) | https://web.archive.org/web/20260611054422/https://www.wikidata.org/wiki/Special:EntityData/Q5615097.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q216320.json | archived (SPN) | https://web.archive.org/web/20260611054445/https://www.wikidata.org/wiki/Special:EntityData/Q216320.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q677916.json | archived (SPN) | https://web.archive.org/web/20260611054507/https://www.wikidata.org/wiki/Special:EntityData/Q677916.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q82811.json | existing snapshot verified | https://web.archive.org/web/20251205205236/https://www.wikidata.org/wiki/Special:EntityData/Q82811.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q7100.json | archived (SPN) | https://web.archive.org/web/20260611054553/https://www.wikidata.org/wiki/Special:EntityData/Q7100.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q1985198.json | archived (SPN) | https://web.archive.org/web/20260611055630/https://www.wikidata.org/wiki/Special:EntityData/Q1985198.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q492496.json | archived (SPN) | https://web.archive.org/web/20260611054639/https://www.wikidata.org/wiki/Special:EntityData/Q492496.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q11315305.json | **[SPN-FAILED]** | repeated save_http=520 + no existing snapshot (save-prompt redirect) — next-session retry queue |
| https://www.wikidata.org/wiki/Special:EntityData/Q2346.json | archived (SPN) | https://web.archive.org/web/20260611054725/https://www.wikidata.org/wiki/Special:EntityData/Q2346.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q11165.json | archived (SPN) | https://web.archive.org/web/20260611055744/https://www.wikidata.org/wiki/Special:EntityData/Q11165.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q11351.json | archived (SPN) | https://web.archive.org/web/20260611061428/https://www.wikidata.org/wiki/Special:EntityData/Q11351.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q11372.json | archived (SPN) | https://web.archive.org/web/20260611055834/https://www.wikidata.org/wiki/Special:EntityData/Q11372.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q7094.json | archived (SPN) | https://web.archive.org/web/20260611055859/https://www.wikidata.org/wiki/Special:EntityData/Q7094.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q160398.json | archived (SPN) | https://web.archive.org/web/20260611055923/https://www.wikidata.org/wiki/Special:EntityData/Q160398.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q7877.json | archived (SPN) | https://web.archive.org/web/20260611055948/https://www.wikidata.org/wiki/Special:EntityData/Q7877.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q37547.json | archived (SPN) | https://web.archive.org/web/20260611060013/https://www.wikidata.org/wiki/Special:EntityData/Q37547.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q338.json | archived (SPN) | https://web.archive.org/web/20260611060037/https://www.wikidata.org/wiki/Special:EntityData/Q338.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q104499.json | archived (SPN) | https://web.archive.org/web/20260611060102/https://www.wikidata.org/wiki/Special:EntityData/Q104499.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q1069.json | existing snapshot verified | https://web.archive.org/web/20260608020655/https://www.wikidata.org/wiki/Special:EntityData/Q1069.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q46255.json | archived (SPN) | https://web.archive.org/web/20260611060155/https://www.wikidata.org/wiki/Special:EntityData/Q46255.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q161764.json | archived (SPN) | https://web.archive.org/web/20260611060219/https://www.wikidata.org/wiki/Special:EntityData/Q161764.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q83353.json | archived (SPN) | https://web.archive.org/web/20260611060244/https://www.wikidata.org/wiki/Special:EntityData/Q83353.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q163082.json | archived (SPN) | https://web.archive.org/web/20260611060308/https://www.wikidata.org/wiki/Special:EntityData/Q163082.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q7205.json | archived (SPN) | https://web.archive.org/web/20260611060333/https://www.wikidata.org/wiki/Special:EntityData/Q7205.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q83371.json | archived (SPN) | https://web.archive.org/web/20260611060358/https://www.wikidata.org/wiki/Special:EntityData/Q83371.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q102904.json | archived (SPN) | https://web.archive.org/web/20260611060422/https://www.wikidata.org/wiki/Special:EntityData/Q102904.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q43518.json | archived (SPN) | https://web.archive.org/web/20260611060446/https://www.wikidata.org/wiki/Special:EntityData/Q43518.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q757520.json | existing snapshot verified | https://web.archive.org/web/20260113030952/https://www.wikidata.org/wiki/Special:EntityData/Q757520.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q42250.json | archived (SPN) | https://web.archive.org/web/20260611060536/https://www.wikidata.org/wiki/Special:EntityData/Q42250.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q52109.json | archived (SPN) | https://web.archive.org/web/20260611060601/https://www.wikidata.org/wiki/Special:EntityData/Q52109.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q131089.json | archived (SPN) | https://web.archive.org/web/20260611060626/https://www.wikidata.org/wiki/Special:EntityData/Q131089.json |
| https://www.wikidata.org/wiki/Special:EntityData/Q2122216.json | archived (SPN) | https://web.archive.org/web/20260611060650/https://www.wikidata.org/wiki/Special:EntityData/Q2122216.json |
| https://www.loc.gov/aba/cataloging/classification/lcco/lcco_q.pdf | existing snapshot verified | https://web.archive.org/web/20260611023031/https://www.loc.gov/aba/cataloging/classification/lcco/lcco_q.pdf |
| https://www.loc.gov/aba/cataloging/classification/lcco/lcco_r.pdf | archived (SPN) | https://web.archive.org/web/20260611060735/https://www.loc.gov/aba/cataloging/classification/lcco/lcco_r.pdf |
| https://id.loc.gov/authorities/classification/QD553.json | archived (SPN) | https://web.archive.org/web/20260611060800/https://id.loc.gov/authorities/classification/QD553.json |
| https://id.loc.gov/authorities/classification/QD380.json | archived (SPN) | https://web.archive.org/web/20260611060825/https://id.loc.gov/authorities/classification/QD380.json |
| https://physh.org/disciplines | existing snapshot verified | https://web.archive.org/web/20251019000706/https://physh.org/disciplines |
| https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp | **[SPN-FAILED]** | repeated save_http=520 + no existing snapshot (save-prompt redirect) — next-session retry queue |
| https://id.loc.gov/authorities/classification/QC20.json | **[SPN-FAILED]** | repeated save_http=520 + no existing snapshot (save-prompt redirect) — next-session retry queue |
