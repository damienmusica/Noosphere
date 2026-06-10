# Grounding report — formal-sciences-skeleton-v1 (Wikidata resolver v3)

- **Resolver run:** 2026-06-10, local (resolver v3, PR #22 tuning), 44 seeds from the batch manifest.
- **Result:** 44/44 resolved, 0 unresolved, 12 resolver-ambiguous → all QC-adjudicated. 1 QC manual selection.
- **Adjudication rule:** identity by sitelinks + aliases, never English labels alone (vault decision log (9)). Five items additionally live-verified via Special:EntityData (random-variable, probability-distribution, applied-statistics, theory-of-differential-equations, partial-differential-equation).
- **Source pack:** `dist/foundry/source-packs/formal-sciences-skeleton-v1/wikidata.json` (gitignored, regenerable by re-running the resolver on the manifest).

## Generator hint accuracy (dashboard)

Of 39 QC-passed nodes, 38 carried training-knowledge QID hints: **11 correct, 27 wrong (71% hallucination), 1 missing**. Philosophy batch measured ~93%. Both runs confirm the standing rule: training-knowledge QIDs are never evidence — only resolver/live verification is.

## Verdict table

| node | verified QID | score | flag | verdict |
|---|---|---|---|---|
| `subfield:probability-theory` | Q5862903 | 140 |  | accepted (resolver rank-1) |
| `subfield:calculus` | Q149972 | 140 |  | accepted (resolver rank-1) |
| `subfield:optimization` | Q141495 | 140 |  | accepted (resolver rank-1) |
| `concept:random-variable` | Q176623 | 40 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `concept:probability-distribution` | Q200726 | 40 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:mathematical-logic` | Q1166618 | 140 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:algebra` | Q3968 | 140 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:number-theory` | Q12479 | 140 |  | accepted (resolver rank-1) |
| `subfield:geometry` | Q8087 | 140 |  | accepted (resolver rank-1) |
| `subfield:differential-geometry` | Q188444 | 140 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:algebraic-geometry` | Q180969 | 140 |  | accepted (resolver rank-1) |
| `subfield:topology` | Q42989 | 140 |  | accepted (resolver rank-1) |
| `subfield:algebraic-topology` | Q212803 | 40 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:mathematical-analysis` | Q7754 | 140 |  | accepted (resolver rank-1) |
| `subfield:complex-analysis` | Q193756 | 140 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:functional-analysis` | Q190549 | 140 |  | accepted (resolver rank-1) |
| `subfield:harmonic-analysis` | Q876215 | 140 |  | accepted (resolver rank-1) |
| `subfield:differential-equations` | Q28575007 | 130 |  | accepted (resolver rank-1) |
| `subfield:partial-differential-equations` | Q271977 | 0 | ⚠ | QC manual selection (resolver pick rejected: Q55877691 "Partial Differential Equations of Elliptic Type (Carlo Miranda)") |
| `subfield:dynamical-systems` | Q3174497 | 140 |  | accepted (resolver rank-1) |
| `subfield:combinatorics` | Q76592 | 140 |  | accepted (resolver rank-1) |
| `subfield:set-theory` | Q12482 | 140 |  | accepted (resolver rank-1) |
| `subfield:model-theory` | Q467606 | 140 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:proof-theory` | Q852732 | 140 |  | accepted (resolver rank-1) |
| `subfield:computability-theory` | Q818930 | 40 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:category-theory` | Q217413 | 140 |  | accepted (resolver rank-1) |
| `subfield:numerical-analysis` | Q11216 | 140 |  | accepted (resolver rank-1) |
| `subfield:mathematical-physics` | Q156495 | 140 |  | accepted (resolver rank-1) |
| `subfield:applied-mathematics` | Q33521 | 140 |  | accepted (resolver rank-1) |
| `subfield:operations-research` | Q194292 | 140 |  | accepted (resolver rank-1) |
| `subfield:game-theory` | Q44455 | 140 |  | accepted (resolver rank-1) |
| `subfield:information-theory` | Q131222 | 140 |  | accepted (resolver rank-1) |
| `subfield:financial-mathematics` | Q335632 | 140 |  | accepted (resolver rank-1) |
| `subfield:bayesian-statistics` | Q4874481 | 140 |  | accepted (resolver rank-1) |
| `subfield:time-series-analysis` | Q11850042 | 140 |  | accepted (resolver rank-1) |
| `subfield:computational-statistics` | Q5157340 | 140 |  | accepted (resolver rank-1) |
| `subfield:mathematical-statistics` | Q745328 | 140 |  | accepted (resolver rank-1) |
| `subfield:history-of-mathematics` | Q185264 | 40 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:mathematics-education` | Q853077 | 40 | ⚠ | accepted after QC adjudication (sitelinks+aliases) |
| `subfield:control-theory` | Q6501221 | 140 |  | accepted (resolver rank-1) |
| `subfield:mathematical-biology` | Q751611 | 140 |  | accepted (resolver rank-1) |
| `field:systems-science` | Q2167061 | 140 |  | accepted (resolver rank-1) |
| `subfield:cybernetics` | Q123637 | 140 |  | accepted (resolver rank-1) |
| `subfield:applied-statistics` | Q1967088 | 130 |  | accepted (resolver rank-1) |


## Notable adjudications

1. **partial-differential-equations → Q271977 (QC manual, live-verified):** the plural-form query "Partial Differential Equations" surfaced only books and articles (resolver pick Q55877691 = a Carlo Miranda monograph, score 0). Q271977 ("partial differential equation", 55 sitelinks, enwiki ✓, alias "PDE") is the canonical identity anchor; no discipline-kind item exists. Resolver feedback (pit-stop log, do not act yet): plural→singular query fallback would have caught this — same family as the v3 parenthetical-qualifier fix.
2. **differential-equations → Q28575007 (0 sitelinks):** right-kind item (P31 area-of-mathematics, alias "differential equations"), live-verified, but sitelink-less — recorded as the weakest accepted grounding in this batch alongside applied-statistics Q1967088 (5 sitelinks, no enwiki, P31 academic-discipline).
3. **random-variable / probability-distribution (score 40):** P31 came back empty in the source pack, but 68/60 sitelinks with exact enwiki matches settle identity — accepted.
4. **combinatorics → Q76592:** the generator's own hint suspicion (Q7184) confirmed — hint was wrong, resolver verified the real item.
5. **systems-science → Q2167061:** the QC gap-fill hint (Q475023) was itself wrong — symmetric evidence that QC training knowledge is no better than generator training knowledge; the resolver corrected both.

## Flag state after grounding

- 25 nodes `ambiguous: false` (16 from generation + 9 QC flag retirements — each retirement note records that the flag's stated question was answered by a QC ruling in qc-report.md).
- 14 nodes `ambiguous: true` — real-world boundary/identity contests (CS/engineering/natural-science boundaries, cybernetics vitality, Bayesian paradigm status). These stop at `proposed` under policy v1; v1.1 external research can resolve them later.

## Legacy /data grounding (5 nodes, ML-foundations)

| node | verified QID | identity evidence |
|---|---|---|
| subfield:probability-theory | Q5862903 | rank-1, score 140, enwiki ✓ |
| subfield:calculus | Q149972 | rank-1, score 140, enwiki ✓ |
| subfield:optimization | Q141495 | rank-1, score 140, enwiki ✓ |
| concept:random-variable | Q176623 | exact label, 68 sitelinks, enwiki ✓ (live-verified) |
| concept:probability-distribution | Q200726 | exact label, 60 sitelinks, enwiki ✓ (live-verified) |

These five /data nodes (status `proposed`, QID-less since the ML-foundations batch) now have resolver-verified grounding and no recorded ambiguity (their origin batch proposed edges only, no node flags) → promote to `reviewed` under policy v1 in the promotion pass.
