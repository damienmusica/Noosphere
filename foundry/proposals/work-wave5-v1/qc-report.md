# work-wave5-v1 — orchestrator QC report

**Session #53, 2026-07-02.** Separated-context Sonnet 5 generation (ADR 0007) → orchestrator
(Opus) live QID re-resolution + W1–W5 keep-criteria + P31/P50/P577 structured verification +
direction + probe scoring. **Generator work QIDs 9/9 hallucinated (100%)** — all re-resolved
live (Q1188594=Wikimedia list article, Q1138524=Pauly–Wissowa encyclopedia, Q1798944=plant
species, Q1140309=2006 TV film "The Path to 9/11", Q1497216=Schlagintweit brothers, etc.).
The load-bearing separated-generation + live-verification contract held: the ladder cannot
launder a hallucinated QID into `/data` because promotion re-verifies P31/P50/P577 live.

## Verdicts

| # | Work | Verdict | Live QID | P31 / P50 / P577 |
|---|---|---|---|---|
| 1 | theory-of-games-and-economic-behavior | **PROMOTE** | Q5226156 | written work / Q17455(vN)+Q94028(Morgenstern) / 1944. 3 edges: →game-theory, →vN, →Morgenstern (co-authored, decision (90) at person axis). |
| 2 | computing-machinery-and-intelligence | **PROMOTE** | Q772056 | scholarly article / Q7251(Turing) / 1950. →artificial-intelligence, →Turing. Distinct from the 1936 computability paper. |
| 3 | on-formally-undecidable-propositions | **PROMOTE** | Q7090984 | scholarly article / Q41390(Gödel) / 1931. →mathematical-logic (co-canonical with Boole/Frege, decision (90)), →Gödel. |
| 4 | opticks | **PROMOTE** | Q74263 | written work / Q935(Newton) / 1704. →optics, →Newton. Distinct from the Principia (different subfield). |
| 5 | the-complexity-of-theorem-proving-procedures | **HOLD** | — | No Wikidata item found (1971 STOC conference paper) → **W2 fails** (QID required). Author Stephen Cook is also LIVING (living-author guard would apply). Held in foundry, honest gap. |
| 6 | the-concept-of-truth-in-formalized-languages | **HOLD** | — | No clean Wikidata item found for the paper (multi-language 1933/1935/1956 publication history) → **W2 fails**. Held in foundry, honest gap. |
| 7 | on-sense-and-reference | **PROMOTE** | Q330955 | scholarly article / Q60028(Frege) / 1892. →philosophy-of-language (co-canonical with the Tractatus, decision (90)), →Frege. NB: the paired `concept:sense-and-reference` candidate in concept-wave2 was dropped — Q330955 is the paper, so it is modeled once, here. |
| P1 | theory-of-games → **John Nash** (canonical_work) | **REJECT (probe ✓)** | — | Wrong author: Theory of Games is von Neumann & Morgenstern (P50=Q17455+Q94028); Nash is a real adjacent game-theory figure but not this book's author. Identity-axis misattribution. |
| P2 | gödel-1931 → **philosophy-of-mathematics** (canonical_work) | **REJECT (probe ✓)** | — | Wrong field + relation-type conflation: Gödel's `philosophy-of-mathematics` link is an `influenced` edge, not a canonical_work; the paper's canonical subfield is mathematical-logic. |

## Tally
- **Promote → auto-`reviewed`** (5 works, 11 `canonical_work` edges): theory-of-games (3
  edges), computing-machinery (2), on-formally-undecidable-propositions (2), opticks (2),
  on-sense-and-reference (2). All authors deceased → no living-author guard fired.
- **Held** (2): complexity-of-theorem-proving-procedures (no QID; Cook living),
  concept-of-truth-in-formalized-languages (no QID). Honest W2 gaps, not added to /data.
- **Reject probes fired** (2/2): theory-of-games→Nash (wrong author),
  gödel-1931→philosophy-of-mathematics (wrong field / relation-type).
- Claim-level hallucination: 0. Generator QID hallucination: 9/9 caught.

## §8 permanence anchors (promoted works) — live-verified 2026-07-02
- `work:theory-of-games-and-economic-behavior` — https://en.wikipedia.org/w/index.php?title=Theory_of_Games_and_Economic_Behavior&oldid=1352441311
- `work:computing-machinery-and-intelligence` — https://en.wikipedia.org/w/index.php?title=Computing_Machinery_and_Intelligence&oldid=1361401367
- `work:on-formally-undecidable-propositions` — https://en.wikipedia.org/w/index.php?title=G%C3%B6del's_incompleteness_theorems&oldid=1361575140
- `work:opticks` — https://en.wikipedia.org/w/index.php?title=Opticks&oldid=1358337717
- `work:on-sense-and-reference` — https://en.wikipedia.org/w/index.php?title=Sense_and_reference&oldid=1355689334
