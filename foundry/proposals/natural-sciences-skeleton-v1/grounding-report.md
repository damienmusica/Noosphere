# Grounding report — natural-sciences-skeleton-v1 (resolver v4, first new-continent run)

- **Resolver:** v4 (PR #59), run locally 2026-06-11 against the QC-regenerated 41-seed manifest.
  Raw result: 41/41 resolved, 0 unresolved, resolver-ambiguous 15, total candidates 123.
- **QC adjudication:** Claude Fable 5 (orchestrator). Identity verdicts are multi-signal from the
  resolver's live entity captures (exact label + English description + P31 + enwiki sitelink +
  aliases, with `wikidata_lastrevid` pinning each observed state below) — never QID-only lookups.
  The three non-routine cases (both fallback selections + the hint QID collision) were re-fetched
  directly by the orchestrator before acceptance.

## v4 live dashboard (new metrics, first real-continent measurement)

| Metric | Value |
|---|---|
| Resolver–QC agreement (selection accepted as-is) | **40/41 (97.6%)** — vs 83% (CS, v3) / 81% (FS, v3) |
| Manual overrides | **1** (statistical-physics — below) |
| **Fallback fire rate (new v4 metric)** | **2/41 (4.9%)** — both compound labels, both forced-ambiguous as designed |
| **Component-anchor flags (new v4 metric)** | 1 (statistical-physics fallback anchored at the absorbed component) |
| Fallback selections auto-accepted | 0 (design holds: fallback never yields a confident selected_qid) |
| Resolver-ambiguous → QC-resolved | 15/15 (13 accepts on label+sitelink per decision-log (9), 2 fallback adjudications) |
| QID-hint hallucination | **33/41 (80%)** — trend 93 → 71 → 72 → **80** |
| Upstream gaps | 0 (first batch with full QID coverage) |

Notable hint hallucinations confirming the training-knowledge ban: nuclear-physics hint Q11372 is
actually *physical chemistry* (and was independently the correct selection for that node); the
optics hint Q80083 is *humanities* (the same entity audited as domain:humanities' anchor earlier
today); the generator put Q1069 (geology) on **both** earth-sciences and geology — the resolver
split the collision correctly (earth-sciences → Q8008, geology → Q1069).

## Fallback adjudications (decision-log (9) manual path, orchestrator re-fetched live)

1. **atomic-molecular-and-optical-physics → Q1151533 ACCEPT.** The compound query returned zero
   provider hits; the v4 component fallback recovered the exact compound entity: label "Atomic,
   molecular, and optical physics", P31 Q11862829 (academic discipline), enwiki exact-name
   article, 25 sitelinks. First live win for the component-decomposition fallback.
2. **statistical-physics → Q677916 MANUAL (override of fallback selection Q11473).** The fallback
   anchored at the absorbed component *thermodynamics* (Q11473, enwiki "Thermodynamics", score 140
   on type signals) over the exact-identity candidate Q677916 ("statistical physics", branch of
   physics, enwiki "Statistical physics", 40 sitelinks, P31 outside the curated set so no type
   signal). Node identity wins over type-signal score: Q677916 selected (PDE-pattern manual
   choice). The forced-ambiguous design did its job — the component anchor was never
   auto-accepted.

## Per-QID verdicts (final verified set, 41/41)

| node | QID | observed label | enwiki | lastrevid | verdict | hint |
|---|---|---|---|---|---|---|
| field:chemistry | Q2329 | chemistry | Chemistry | 2496222378 | accept rank-1 | match |
| field:astronomy | Q333 | astronomy | Astronomy | 2503621927 | accept (QC override of mechanical flag) | WRONG (Q473) |
| field:earth-sciences | Q8008 | Earth science | Earth_science | 2501282347 | accept rank-1 | WRONG (Q1069) |
| field:environmental-science | Q188847 | environmental science | Environmental_science | 2496947275 | accept (QC override of mechanical flag) | match |
| subfield:condensed-matter-physics | Q214781 | condensed matter physics | Condensed_matter_physics | 2503959647 | accept rank-1 | WRONG (Q180902) |
| subfield:atomic-molecular-and-optical-physics | Q1151533 | Atomic, molecular, and optical physics | Atomic%2C_molecular%2C_and_optical_physics | 2480135854 | accept (QC override of mechanical flag) | WRONG (Q1880534) |
| subfield:optics | Q14620 | optics | Optics | 2502965778 | accept (QC override of mechanical flag) | WRONG (Q80083) |
| subfield:nuclear-physics | Q81197 | nuclear physics | Nuclear_physics | 2497831729 | accept (QC override of mechanical flag) | WRONG (Q11372) |
| subfield:particle-physics | Q18334 | particle physics | Particle_physics | 2493612551 | accept (QC override of mechanical flag) | WRONG (Q10285) |
| subfield:plasma-physics | Q5615097 | plasma physics | Plasma_physics | 2494769011 | accept (QC override of mechanical flag) | WRONG (Q11413) |
| subfield:fluid-dynamics | Q216320 | fluid dynamics | Fluid_dynamics | 2497034787 | accept (QC override of mechanical flag) | WRONG (Q1621273) |
| subfield:statistical-physics | Q677916 | statistical physics | Statistical_physics | 2501496534 | manual: component-anchor override | WRONG (Q1396488) |
| subfield:acoustics | Q82811 | acoustics | Acoustics | 2495126729 | accept rank-1 | WRONG (Q41138) |
| subfield:biophysics | Q7100 | biophysics | Biophysics | 2500098582 | accept rank-1 | WRONG (Q7202) |
| subfield:nonlinear-dynamics | Q1985198 | nonlinear dynamics | Nonlinear_dynamics | 2460895263 | accept rank-1 | WRONG (Q848814) |
| subfield:accelerator-physics | Q492496 | accelerator physics | Accelerator_physics | 2493543060 | accept (QC override of mechanical flag) | WRONG (Q1065572) |
| subfield:soft-matter-physics | Q11315305 | soft matter physics | Soft_matter_physics | 2252843388 | accept (QC override of mechanical flag) | WRONG (Q1138901) |
| subfield:analytical-chemistry | Q2346 | analytical chemistry | Analytical_chemistry | 2500722369 | accept rank-1 | WRONG (Q46197) |
| subfield:inorganic-chemistry | Q11165 | inorganic chemistry | Inorganic_chemistry | 2496267382 | accept rank-1 | match |
| subfield:organic-chemistry | Q11351 | organic chemistry | Organic_chemistry | 2496268822 | accept rank-1 | match |
| subfield:physical-chemistry | Q11372 | physical chemistry | Physical_chemistry | 2501326186 | accept rank-1 | WRONG (Q11456) |
| subfield:biochemistry | Q7094 | biochemistry | Biochemistry | 2500098572 | accept rank-1 | match |
| subfield:crystallography | Q160398 | crystallography | Crystallography | 2496793718 | accept rank-1 | WRONG (Q11455) |
| subfield:electrochemistry | Q7877 | electrochemistry | Electrochemistry | 2496245641 | accept (QC override of mechanical flag) | WRONG (Q171318) |
| subfield:astrophysics | Q37547 | astrophysics | Astrophysics | 2496462668 | accept rank-1 | WRONG (Q4387444) |
| subfield:cosmology | Q338 | cosmology | Cosmology | 2500098303 | accept rank-1 | WRONG (Q51324) |
| subfield:planetary-science | Q104499 | planetary science | Planetary_science | 2496651418 | accept rank-1 | WRONG (Q1126342) |
| subfield:geology | Q1069 | geology | Geology | 2503616481 | accept (QC override of mechanical flag) | match |
| subfield:geophysics | Q46255 | geophysics | Geophysics | 2501966832 | accept rank-1 | WRONG (Q177139) |
| subfield:geochemistry | Q161764 | geochemistry | Geochemistry | 2496800616 | accept rank-1 | WRONG (Q42831) |
| subfield:mineralogy | Q83353 | mineralogy | Mineralogy | 2503322527 | accept rank-1 | WRONG (Q35872) |
| subfield:petrology | Q163082 | petrology | Petrology | 2496805872 | accept (QC override of mechanical flag) | WRONG (Q46069) |
| subfield:paleontology | Q7205 | paleontology | Paleontology | 2496241174 | accept rank-1 | match |
| subfield:seismology | Q83371 | seismology | Seismology | 2496558672 | accept (QC override of mechanical flag) | WRONG (Q40614) |
| subfield:volcanology | Q102904 | volcanology | Volcanology | 2496649994 | accept rank-1 | WRONG (Q82604) |
| subfield:oceanography | Q43518 | oceanography | Oceanography | 2503405109 | accept rank-1 | match |
| subfield:atmospheric-science | Q757520 | atmospheric sciences | Atmospheric_science | 2502578401 | accept rank-1 | WRONG (Q144020) |
| subfield:hydrology | Q42250 | hydrology | Hydrology | 2502609040 | accept rank-1 | WRONG (Q8066) |
| subfield:geomorphology | Q52109 | geomorphology | Geomorphology | 2500425369 | accept rank-1 | WRONG (Q39732) |
| subfield:geodesy | Q131089 | geodesy | Geodesy | 2501308028 | accept rank-1 | WRONG (Q11378) |
| subfield:quantum-information-science | Q2122216 | quantum information science | Quantum_information_science | 2480136604 | accept rank-1 | WRONG (Q3884376) |

QC-override notes for the mechanical flags: astronomy (gap-30 flag vs astrobiology — distinct
referent, exact label + enwiki decisive), geology and petrology (gap flags vs narrower variants
"geology of the Moon" / "metamorphic petrology" — exact label + type signal decisive),
environmental-science (gap flag vs environmental-education — distinct referent; the node's B-type
*boundary* flag is a separate axis and stays), and the ten "no positive type signal" exact-label +
exact-enwiki cases (optics, nuclear/particle/plasma/fluid/accelerator/soft-matter physics,
electrochemistry, seismology) — all accepted on the decision-log (9) label+sitelink rule.

## Evidence permanence (§8)

Classification evidence relied on for QC verdicts is snapshotted (or was already snapshotted):
PhySH licensing (existing snapshot, manifest), plus an SPN pass over the batch's verdict-bearing
URLs (LCC Q/R outline PDFs, id.loc.gov QD551-578 and QD380-388 records, PhySH disciplines JSON,
FORD mirror) and the 41 verified `Special:EntityData` URLs — results recorded in
`promotion-report.md` ([SPN-FAILED] entries kept honest; querystring URLs are known-rejected).
Observed entity states are additionally pinned by `wikidata_lastrevid` above.
