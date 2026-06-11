# OpenAlex NS pre-validation + write-in — openalex-ns-prevalidation-v1

- **By:** Claude Fable 5 (claude-fable-5), orchestrator session #12, 2026-06-11.
- **Policy:** B-track standing policy (vault decision log 2026-06-11 (27)) — pre-validation
  report → **write proceeds in the same session because no escalation trigger fired** (assessment
  below). Local ad-hoc calls only (no committed scripts; CI stays network-free).
- **Scope: 35 nodes** — the 34 session-#11 NS reviewed nodes + `field:physics` (start-ritual
  measurement confirmed it was absent from the FS-42 scope and carries no external_metrics).
  The seven clause-6-resolved nodes (reviewed later this same session) were `proposed` at
  measurement time and are recorded as **next-micropass candidates** (scientific-computing
  pattern — no scope expansion here).

## Dashboard

| Metric | Value |
|---|---|
| rank-1 (search rank-1 = QID-linked concept, multi-signal clean) | **27/35 (77.1%)** — incl. 2 with duplicate-link notes; band check vs FS 81% / CS 76%: **in band** |
| Manual accepts (decision-log (9) per-item path) | 3 (fluid-dynamics C90278072 · planetary-science C152551177 · statistical-physics C121864883) |
| Identity skip | 1 (atomic-molecular-and-optical-physics — below) |
| Absent (honest gaps) | 4 (analytical-chemistry · plasma-physics · nonlinear-dynamics · soft-matter-physics) |
| Duplicate QID-link anomalies observed | 3 (nuclear-physics, petrology, fluid-dynamics — the `wikidata:QID` endpoint returns the *other* twin; session-#7 optimization precedent: endpoint defect, search-side concept verified instead) |
| Compound-label search failures | 3 (AMO, statistical-physics, soft-matter — 0 search hits; cross-provider mirror of the resolver-v4 compound-query pattern) |
| Journal-concept trap | 1 (analytical-chemistry — search rank-1 is "Analytical Chemistry (journal)", Q485223, works 3.4M; label-matching ban applies) |
| Written (entity-ID-first, live re-fetch at write time) | **30/30 multi-signal clean** (ID round-trip + display_name + concept-QID = node-QID + level recorded; drift 0) |

## Escalation-trigger assessment (policy (27))

- **(i) rank-1 precision:** 77.1% — inside the 76–81% measured band, above the <70% guide. Not fired.
- **(ii) novel anomaly:** none — every anomaly observed is a catalogued type with a standing rule
  (duplicate links → multi-signal + search-side verification; compound-label search failure →
  manual path; journal/object concepts → entity-ID-first, label matching banned; component-wing
  concept → §12 umbrella-test mirror, below). Not fired.
- **(iii) upstream change:** one response-shape change observed — concept objects now return an
  **empty `counts_by_year` array** (all 30 fetched concepts; session #6 saw populated arrays).
  Cross-checked at the works endpoint: `concepts.id:C121332964` filtered to publications from
  2026-05-01 returns **282,322 works** — Concepts tagging demonstrably continues through June
  2026, and our stored fields (works_count · cited_by_count) are unaffected. Assessed as **not
  fired**; recorded for the next continent's measurement.
- **(iv) schema/policy change needed:** none. Not fired.

## Non-routine verdicts

- **AMO → SKIP.** OpenAlex maps Q1151533 to C103862110 "Optical physics" (self-description
  "study of matter-light interactions at small scales") — a *component-wing* concept under the
  combined atomic-molecular-and-optical node. The session-#11 umbrella-test precedent applies in
  mirror: a component-named referent that covers one wing cannot carry the combined node's
  metrics (works_count would misstate the discipline). Honest gap; no write.
- **fluid-dynamics → C90278072 accept (manual).** The QID-direct endpoint returns C3019068222
  "Unsteady flow" (wrong twin); search rank-2 C90278072 "Fluid dynamics" (lvl 2, works 143,898)
  carries the exact name and the Q216320 link. Search rank-1 is computational fluid dynamics
  (Q815820 — a different discipline, not ours). Multi-signal accept with duplicate-link note.
- **planetary-science → C152551177 accept (manual).** Search rank-1 is a junk topical concept
  ("Refractory (planetary science)"); the QID-linked concept carries the exact name and
  discipline description. Algorithmics-pattern accept.
- **statistical-physics → C121864883 accept (manual).** Search returns 0 hits (compound-label
  failure); the QID-linked concept is exact-name, "branch of physics". Accept.
- **nuclear-physics / petrology → rank-1 with duplicate-link notes.** Search rank-1 concepts
  (C185544564 "Nuclear physics" / C5900021 "Petrology") carry exact names + QID links; the
  direct endpoint returns "Nuclear science" / "Metamorphic petrology" twins. Written from the
  search-side concepts.
- **analytical-chemistry → ABSENT.** No concept linked to Q2346 (404); search rank-1 is the
  *journal* concept. Writing it would violate entity-ID-first. Honest gap.

## Triangulation dashboard (session-#10 metric)

NS measured: **30/35 (85.7%)**. Continents: FS 36/51 (70.6%) · CS 26/27 (96.3%) · NS 30/35
(85.7%) · philosophy 0/62 unmeasured. **Overall: 90/189 QID-bearing nodes = 47.6%; within
measured scope 90/113 = 79.6%.** Follow-up candidates: the 7 clause-6-resolved nodes (now
reviewed) + the 4 absents on upstream change.

## Evidence permanence (§8)

The 30 written concepts' canonical entity URLs (`https://openalex.org/C…`) were queued to the
session's serial SPN pass (results in the consolidated session ledger; failures recorded
honestly — measurement-only URLs follow the session-#10 retry-queue precedent). Observed states
are additionally reproducible from the `as_of` date + entity URLs (policy (18) re-query design).

## Per-node verdicts (35)

| node | QID | verdict | concept | works_count | cited_by_count |
|---|---|---|---|---|---|
| field:physics | Q413 | rank-1 | C121332964 "Physics" lvl0 | 89,474,217 | 646,622,374 |
| field:chemistry | Q2329 | rank-1 | C185592680 "Chemistry" lvl0 | 54,499,428 | 726,691,917 |
| field:astronomy | Q333 | rank-1 | C1276947 "Astronomy" lvl1 | 3,983,239 | 50,097,595 |
| field:earth-sciences | Q8008 | rank-1 | C1965285 "Earth science" lvl1 | 7,216,147 | 5,331,776 |
| subfield:condensed-matter-physics | Q214781 | rank-1 | C26873012 "Condensed matter physics" lvl1 | 2,933,721 | 52,828,882 |
| subfield:atomic-molecular-and-optical-physics | Q1151533 | SKIP (component-wing concept) | — | — | — |
| subfield:optics | Q14620 | rank-1 | C120665830 "Optics" lvl1 | 27,530,781 | 163,754,781 |
| subfield:nuclear-physics | Q81197 | rank-1 (duplicate-link note) | C185544564 "Nuclear physics" lvl1 | 5,481,497 | 33,840,868 |
| subfield:particle-physics | Q18334 | rank-1 | C109214941 "Particle physics" lvl1 | 1,177,489 | 12,851,317 |
| subfield:plasma-physics | Q5615097 | ABSENT | — | — | — |
| subfield:fluid-dynamics | Q216320 | manual accept (duplicate-link wrong twin from direct endpoint) | C90278072 "Fluid dynamics" lvl2 | 143,898 | 1,690,444 |
| subfield:statistical-physics | Q677916 | manual accept | C121864883 "Statistical physics" lvl1 | 1,982,612 | 29,881,410 |
| subfield:acoustics | Q82811 | rank-1 | C24890656 "Acoustics" lvl1 | 7,052,423 | 47,856,254 |
| subfield:nonlinear-dynamics | Q1985198 | ABSENT | — | — | — |
| subfield:accelerator-physics | Q492496 | rank-1 | C13476937 "Accelerator physics" lvl4 | 5,192 | 10,603 |
| subfield:soft-matter-physics | Q11315305 | ABSENT | — | — | — |
| subfield:analytical-chemistry | Q2346 | ABSENT (journal-concept trap) | — | — | — |
| subfield:inorganic-chemistry | Q11165 | rank-1 | C179104552 "Inorganic chemistry" lvl1 | 2,576,438 | 55,044,244 |
| subfield:organic-chemistry | Q11351 | rank-1 | C178790620 "Organic chemistry" lvl1 | 15,945,332 | 348,060,608 |
| subfield:physical-chemistry | Q11372 | rank-1 | C147789679 "Physical chemistry" lvl1 | 3,761,188 | 94,290,596 |
| subfield:crystallography | Q160398 | rank-1 | C8010536 "Crystallography" lvl1 | 4,366,303 | 55,033,686 |
| subfield:electrochemistry | Q7877 | rank-1 | C52859227 "Electrochemistry" lvl3 | 1,034,329 | 27,715,786 |
| subfield:astrophysics | Q37547 | rank-1 | C44870925 "Astrophysics" lvl1 | 2,146,640 | 31,959,371 |
| subfield:cosmology | Q338 | rank-1 | C26405456 "Cosmology" lvl2 | 297,094 | 3,914,618 |
| subfield:planetary-science | Q104499 | manual accept | C152551177 "Planetary science" lvl2 | 16,851 | 169,668 |
| subfield:geology | Q1069 | rank-1 | C127313418 "Geology" lvl0 | 30,541,045 | 168,542,531 |
| subfield:geophysics | Q46255 | rank-1 | C8058405 "Geophysics" lvl1 | 695,005 | 9,793,676 |
| subfield:geochemistry | Q161764 | rank-1 | C17409809 "Geochemistry" lvl1 | 1,486,399 | 18,272,259 |
| subfield:mineralogy | Q83353 | rank-1 | C199289684 "Mineralogy" lvl1 | 2,248,226 | 20,651,874 |
| subfield:petrology | Q163082 | rank-1 (duplicate-link note) | C5900021 "Petrology" lvl1 | 374,525 | 6,562,076 |
| subfield:paleontology | Q7205 | rank-1 | C151730666 "Paleontology" lvl1 | 7,897,145 | 130,083,814 |
| subfield:seismology | Q83371 | rank-1 | C165205528 "Seismology" lvl1 | 1,508,164 | 14,018,032 |
| subfield:volcanology | Q102904 | rank-1 | C109902934 "Volcanology" lvl3 | 9,516 | 78,121 |
| subfield:atmospheric-science | Q757520 | rank-1 | C91586092 "Atmospheric sciences" lvl1 | 1,312,201 | 20,273,083 |
| subfield:quantum-information-science | Q2122216 | rank-1 | C5320026 "Quantum information science" lvl4 | 44,701 | 538,795 |

## SPN ledger (30 written concepts' entity URLs — session-#12 consolidated pass)

**Session-#12 consolidated pass: 146 snapshot-compatible URLs processed — 22 fresh SPN archives + 120 existing snapshots verified = 142/146 (97.3%); 4 save-timeouts → retry queue; 16 querystring URLs recorded SPN-incompatible (§8). Strategy: existing-snapshot-first (fast, throttle-immune), saves only for the residue with a 25s timeout — the save endpoint opened with immediate 520s/hangs and recovered mid-pass.**

| URL | status | snapshot / note |
|---|---|---|
| https://openalex.org/C121332964 | existing snapshot verified | https://web.archive.org/web/20260524031538/https://openalex.org/C121332964 |
| https://openalex.org/C185592680 | existing snapshot verified | https://web.archive.org/web/20260524032353/https://openalex.org/C185592680 |
| https://openalex.org/C1276947 | existing snapshot verified | https://web.archive.org/web/20260524032359/https://openalex.org/C1276947 |
| https://openalex.org/C1965285 | existing snapshot verified | https://web.archive.org/web/20251104071658/https://openalex.org/C1965285 |
| https://openalex.org/C26873012 | existing snapshot verified | https://web.archive.org/web/20260524043602/https://openalex.org/C26873012 |
| https://openalex.org/C120665830 | existing snapshot verified | https://web.archive.org/web/20260524043610/https://openalex.org/C120665830 |
| https://openalex.org/C185544564 | existing snapshot verified | https://web.archive.org/web/20260406090717/https://openalex.org/C185544564 |
| https://openalex.org/C109214941 | existing snapshot verified | https://web.archive.org/web/20251019111428/https://openalex.org/C109214941 |
| https://openalex.org/C90278072 | existing snapshot verified | https://web.archive.org/web/20260130124603/https://openalex.org/C90278072 |
| https://openalex.org/C121864883 | existing snapshot verified | https://web.archive.org/web/20260524043600/https://openalex.org/C121864883 |
| https://openalex.org/C24890656 | existing snapshot verified | https://web.archive.org/web/20260524031538/https://openalex.org/C24890656 |
| https://openalex.org/C13476937 | existing snapshot verified | https://web.archive.org/web/20241218175313/https://openalex.org/C13476937 |
| https://openalex.org/C179104552 | existing snapshot verified | https://web.archive.org/web/20260524032353/https://openalex.org/C179104552 |
| https://openalex.org/C178790620 | existing snapshot verified | https://web.archive.org/web/20260524032353/https://openalex.org/C178790620 |
| https://openalex.org/C147789679 | existing snapshot verified | https://web.archive.org/web/20260524044006/https://openalex.org/C147789679 |
| https://openalex.org/C8010536 | existing snapshot verified | https://web.archive.org/web/20260331161649/https://openalex.org/C8010536 |
| https://openalex.org/C52859227 | existing snapshot verified | https://web.archive.org/web/20260524044006/https://openalex.org/C52859227 |
| https://openalex.org/C44870925 | existing snapshot verified | https://web.archive.org/web/20251127171442/https://openalex.org/C44870925 |
| https://openalex.org/C26405456 | existing snapshot verified | https://web.archive.org/web/20251017115918/https://openalex.org/C26405456 |
| https://openalex.org/C152551177 | existing snapshot verified | https://web.archive.org/web/20241221205759/https://openalex.org/C152551177 |
| https://openalex.org/C127313418 | existing snapshot verified | https://web.archive.org/web/20260524032357/https://openalex.org/C127313418 |
| https://openalex.org/C8058405 | existing snapshot verified | https://web.archive.org/web/20260130021535/https://openalex.org/C8058405 |
| https://openalex.org/C17409809 | existing snapshot verified | https://web.archive.org/web/20260221105101/https://openalex.org/C17409809 |
| https://openalex.org/C199289684 | existing snapshot verified | https://web.archive.org/web/20260204123152/https://openalex.org/C199289684 |
| https://openalex.org/C5900021 | existing snapshot verified | https://web.archive.org/web/20260406090717/https://openalex.org/C5900021 |
| https://openalex.org/C151730666 | existing snapshot verified | https://web.archive.org/web/20260524043600/https://openalex.org/C151730666 |
| https://openalex.org/C165205528 | existing snapshot verified | https://web.archive.org/web/20260524044137/https://openalex.org/C165205528 |
| https://openalex.org/C109902934 | existing snapshot verified | https://web.archive.org/web/20250606185214/https://openalex.org/C109902934 |
| https://openalex.org/C91586092 | existing snapshot verified | https://web.archive.org/web/20251024132702/https://openalex.org/C91586092 |
| https://openalex.org/C5320026 | existing snapshot verified | https://web.archive.org/web/20251018221901/https://openalex.org/C5320026 |
