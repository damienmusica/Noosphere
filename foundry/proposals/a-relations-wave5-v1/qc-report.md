# a-relations-wave5-v1 — orchestrator QC report

**Session #52, 2026-07-02.** Separated-context generation (Claude Sonnet 5, ADR 0007) → orchestrator
live QC. 18 candidates (C1–C16 real + C17–C18 unmarked reject probes). Lane B pipeline (docs §8):
≥2 independent live claim-stating sources + direction + identity referent + adversarial; `disputed`/
NEI/reject stop (clause-6 v2). Endpoints machine-checked `reviewed` + deduped. Permanence anchors (§8):
Wikipedia oldid permalinks + SEP Wayback SPN snapshots taken this session.

## Verdicts

| ID | Edge | Verdict | Basis |
|---|---|---|---|
| C1 | charles-lyell → evolutionary-biology (influenced) | **supported** | Lyell's deep-time/uniformitarianism enabled Darwin; textbook. WP Charles Lyell @1355730169 + WP On the Origin @1361718398. |
| C2 | vernadsky → environmental-science (influenced) | hold | biosphere→env-sci diffuse; broad field target; already founded→geochemistry. |
| C3 | vesalius → art-history (influenced) | hold | Fabrica illustration → art, but "influenced art-history" (discipline) indirect/weak. |
| C4 | kraepelin → philosophy-of-psychiatry (influenced) | **supported** | Kraepelin nosology central to classification debates. SEP Psychiatry (SPN) [Kraepelin×4] + WP Emil Kraepelin @1359782916. |
| C5 | wallace → philosophy-of-biology (influenced) | hold | niche; SEP `wallace` slug 404; insufficient clean sourcing. |
| C6 | emmy-noether → physics (influenced) | **supported** | Noether's theorem (symmetry↔conservation) foundational to physics. WP Noether's theorem @1355852918. |
| C7 | alonzo-church → programming-languages (influenced) | **supported** | Lambda calculus → functional PLs. SEP Lambda Calculus (SPN) [programming×6] + WP Lambda calculus @1361655104. |
| C8 | karl-pearson → sociology (influenced) | hold | quantitative-methods adoption diffuse; broad target. |
| C9 | george-lakoff → philosophy-of-mind (critiques) | hold | ★ LIVING (Lakoff, P570 absent). Embodied-mind critique real, but broad-target modeling (chomsky discipline); held on modeling precision, no living escalation signal. |
| C10 | isaac-newton → philosophy-of-science (influenced) | **supported** | Newton's method (Rules of Reasoning) shaped philosophy of science. SEP Newton (SPN) [method×7] + SEP Newton's Principia (SPN). |
| C11 | georges-cuvier → archaeology (influenced) | hold | stratigraphy reached archaeology via geology; indirect, broad. |
| C12 | leibniz → computability-theory (influenced) | hold | calculus-ratiocinator precursor is long-range/mediated. |
| C13 | ronald-fisher → epidemiology (influenced) | hold | Fisher's stats underpin epi method but epidemiology-specific link not surfaced live (Bradford Hill more direct); thin. |
| C14 | kurt-lewin → education (influenced) | hold | action-research adoption real but 2nd generator source was about Dewey, not Lewin — thin/indirect. |
| C15 | franz-boas → philosophy-of-race (influenced) | **supported** | Boas's anti-essentialism a standard reference in philosophy of race. SEP Race (SPN) [Boas×4] + WP Franz Boas @1359301314. |
| C16 | phenomenology → philosophy-of-technology (influenced) | **supported** | Heidegger's phenomenology founds philosophy of technology (postphenomenology). SEP Technology (SPN) [Heidegger×9] + WP Philosophy of technology @1359005281. |
| C17 | georges-cuvier → philosophy-of-race (influenced) | **reject (probe ✓)** | inverted lineage — philosophy of race *studies/critiques* 19thc racial science; Cuvier is not a founder of the philosophical subfield. |
| C18 | robert-koch → law (influenced) | **reject (probe ✓)** | germ theory later drawn on by public-health law = third-party mediated; not Koch influencing law. |

## Tally
- **Supported → auto-`reviewed`** (7): C1, C4, C6, C7, C10, C15, C16.
- **Held `proposed`** (9): C2, C3, C5, C8, C9, C11, C12, C13, C14.
- **Reject probes fired** (2/2): C17, C18.
- Claim-level hallucination: 0. Generator slug guesses (SEP darwin/wallace/psychiat-IEP 404) corrected at QC by substituting verified live anchors; underlying claims held.

## Held-recheck of wave4 (separate)
The 5 wave4 held edges were re-adjudicated: **`chomsky → philosophy-of-mind` promoted** (re-modeled `critiques`→`influenced`; living-person floor met — Q9049, P570 absent, SEP Behaviorism [SPN] + WP Verbal Behavior @1349511694, conservative, no escalation). The other 4 stay held (von-neumann→computer-systems endpoint still `proposed`; russell→computer-science, lavoisier→physics diffuse; cybernetics→systems-engineering thin).
