# Grounding report — batch:philosophy-skeleton-v1 (QID verification)

**Resolver:** scripts/foundry/resolve-wikidata.ts v2, run locally 2026-06-10 (63 seeds, 60 resolved, 3 unresolved, 46 flagged ambiguous by score-gap).
**Adjudication:** Claude Fable 5 (claude-fable-5), QC context, 2026-06-10. Rank-1 candidate accepted unless overridden below; overrides and strips each carry a reason.

## Headline numbers (governance dashboard, decision log 2026-06-10 (3))

- Proposal carried **55 training-knowledge QID hints**; resolver verification confirmed **4** (7%) and corrected **47** (85%).
- **Generator QID hallucination rate ≈ 93%** — several hints were real QIDs attached to the wrong entity (e.g. the hint used for continental-philosophy is actually political philosophy). Training-knowledge QIDs are NOT usable evidence; resolver verification is mandatory, exactly as the pipeline assumed ("fallible generator + structure absorbs").
- Labels/structure tell the opposite story: 60/63 seed labels resolved to the right kind of entity — the skeleton itself grounds well; only the identifier layer hallucinated.
- Final state: **57/63 nodes carry resolver-verified QIDs** (6 newly filled, 4 confirmed, 47 corrected); **6 carry none** pending manual follow-up.

## Resolver quality notes (feed back into resolver tuning)

- Journal/article homonyms outrank disciplines when the discipline item lacks strong P31 signals: 5 QC overrides (ontology, logic, ancient-philosophy, business-ethics, metaphilosophy).
- Parenthetical qualifiers in seed labels break wbsearchentities: "Decision Theory (philosophical)", "Western Esotericism (philosophy of)" both unresolved — future manifests should use plain labels and put qualifiers in notes.
- Score -200 garbage matches (philosophy-of-race → a 2015 paper) are correctly self-flagged by the scoring; treat negative scores as auto-reject.

## Per-node adjudication

| node | hint (training) | final QID | verdict |
|---|---|---|---|
| `field:philosophy` | Q5891 | Q5891 | resolver rank-1 accepted |
| `subfield:metaphysics` | Q35997 | Q35277 | resolver rank-1 accepted |
| `subfield:ontology` | Q44325 | Q44325 | QC override of resolver rank-1 |
| `subfield:epistemology` | Q9471 | Q9471 | resolver rank-1 accepted |
| `subfield:ethics` | Q2728 | Q9465 | resolver rank-1 accepted |
| `subfield:logic` | Q8078 | Q8078 | QC override of resolver rank-1 |
| `subfield:aesthetics` | Q35476 | Q35986 | resolver rank-1 accepted |
| `subfield:axiology` | Q193599 | Q186531 | resolver rank-1 accepted |
| `subfield:philosophy-of-mind` | Q864 | Q23407 | resolver rank-1 accepted |
| `subfield:philosophy-of-language` | Q8162 | Q484761 | resolver rank-1 accepted |
| `subfield:philosophy-of-science` | Q181220 | Q59115 | resolver rank-1 accepted |
| `subfield:philosophy-of-mathematics` | Q188444 | Q180536 | resolver rank-1 accepted |
| `subfield:philosophy-of-religion` | Q3247485 | Q209295 | resolver rank-1 accepted |
| `subfield:philosophy-of-law` | Q179527 | Q126842 | resolver rank-1 accepted |
| `subfield:political-philosophy` | Q179467 | Q179805 | resolver rank-1 accepted |
| `subfield:social-philosophy` | Q3488179 | Q180592 | resolver rank-1 accepted |
| `subfield:philosophy-of-action` | Q1057811 | Q175661 | resolver rank-1 accepted |
| `subfield:philosophy-of-perception` | — | Q3300457 | resolver rank-1 accepted; Q3300457 label matches exactly but its Wikidata description looks vandalized — manual re-check before reviewed |
| `subfield:philosophy-of-technology` | Q1253961 | Q279438 | resolver rank-1 accepted |
| `subfield:philosophy-of-biology` | Q2439959 | Q1028964 | resolver rank-1 accepted |
| `subfield:philosophy-of-physics` | Q1038510 | Q1165883 | resolver rank-1 accepted |
| `subfield:philosophy-of-social-science` | Q7184 | Q3874380 | resolver rank-1 accepted |
| `subfield:bioethics` | Q213793 | Q194294 | resolver rank-1 accepted |
| `subfield:environmental-ethics` | Q1366317 | Q875686 | resolver rank-1 accepted |
| `subfield:business-ethics` | Q584313 | Q873451 | QC override of resolver rank-1 |
| `subfield:metaethics` | Q611227 | Q56003 | resolver rank-1 accepted |
| `subfield:normative-ethics` | Q36259 | Q1321845 | resolver rank-1 accepted |
| `subfield:analytic-philosophy` | Q28425 | Q183216 | resolver rank-1 accepted |
| `subfield:continental-philosophy` | Q179805 | Q59104 | resolver rank-1 accepted |
| `subfield:phenomenology` | Q184485 | Q179235 | resolver rank-1 accepted |
| `subfield:existentialism` | Q26934 | Q38066 | resolver rank-1 accepted |
| `subfield:pragmatism` | Q170790 | Q126692 | resolver rank-1 accepted |
| `subfield:ancient-philosophy` | Q41630 | Q204100 | QC override of resolver rank-1 |
| `subfield:medieval-philosophy` | Q42716 | Q192292 | resolver rank-1 accepted |
| `subfield:renaissance-philosophy` | Q2990215 | Q917440 | resolver rank-1 accepted |
| `subfield:modern-philosophy` | Q3245885 | — | no verified QID (manual follow-up) |
| `subfield:chinese-philosophy` | Q728937 | Q184663 | resolver rank-1 accepted |
| `subfield:indian-philosophy` | Q1264453 | Q376022 | resolver rank-1 accepted |
| `subfield:buddhist-philosophy` | Q1340261 | Q1001079 | resolver rank-1 accepted |
| `subfield:islamic-philosophy` | Q721838 | Q193104 | resolver rank-1 accepted |
| `subfield:jewish-philosophy` | — | Q837795 | resolver rank-1 accepted |
| `subfield:african-philosophy` | Q1414946 | Q386260 | resolver rank-1 accepted |
| `subfield:japanese-philosophy` | — | Q1194146 | resolver rank-1 accepted |
| `subfield:korean-philosophy` | — | Q1039392 | resolver rank-1 accepted |
| `subfield:latin-american-philosophy` | Q3232175 | Q3745514 | resolver rank-1 accepted |
| `subfield:comparative-philosophy` | — | Q1284814 | resolver rank-1 accepted |
| `subfield:philosophy-of-history` | Q751966 | Q190721 | resolver rank-1 accepted |
| `subfield:philosophy-of-economics` | Q1762174 | Q1257388 | resolver rank-1 accepted |
| `subfield:feminist-philosophy` | Q1033174 | Q1404532 | resolver rank-1 accepted |
| `subfield:philosophy-of-race` | — | — | no verified QID (manual follow-up) |
| `subfield:philosophy-of-education` | Q459743 | Q564371 | resolver rank-1 accepted |
| `subfield:critical-theory` | Q192202 | — | no verified QID (manual follow-up) |
| `subfield:hermeneutics` | Q193418 | Q102686 | resolver rank-1 accepted |
| `subfield:metaphilosophy` | Q1783118 | Q596284 | QC override of resolver rank-1 |
| `subfield:decision-theory` | Q1363477 | — | no verified QID (manual follow-up) |
| `subfield:natural-philosophy` | Q1191521 | Q269323 | resolver rank-1 accepted |
| `subfield:scholasticism` | Q152428 | Q41679 | resolver rank-1 accepted |
| `subfield:esotericism-and-theosophy` | Q213583 | — | no verified QID (manual follow-up) |
| `subfield:philosophy-of-cognitive-science` | — | — | no verified QID (manual follow-up) |
| `subfield:philosophy-of-psychiatry` | Q7183540 | Q27333716 | resolver rank-1 accepted |
| `subfield:philosophy-of-information` | Q3395561 | Q2629585 | resolver rank-1 accepted |
| `subfield:ethics-of-ai` | — | Q12727779 | resolver rank-1 accepted |
| `subfield:experimental-philosophy` | Q1386526 | Q1384451 | resolver rank-1 accepted |

## Follow-ups before promotion

1. Manual QID lookup for the 6 stripped/unresolved nodes (critical-theory, modern-philosophy, philosophy-of-race, decision-theory, esotericism-and-theosophy, philosophy-of-cognitive-science).
2. Re-check philosophy-of-perception Q3300457 (vandalized-looking description upstream).
3. Re-run resolver with plain labels for the 2 qualifier-broken seeds.
