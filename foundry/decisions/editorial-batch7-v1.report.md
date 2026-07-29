# editorial-batch7-v1 — promotion decision report

**Decided 2026-07-29** · QC by Claude Opus (`claude-opus-5`) · generated from `foundry/decisions/editorial-batch7-v1.json` by `npm run foundry:report`.

> ✓ ladder-check: every reviewed outcome is sanctioned.

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `subfield:thermodynamics` | **supported** | — | — | 6 (1) | generator self-flags: The opening sentence restates the same facts as the article's lead (heat/work/energy/entropy/matter/radiation) in different structure and wording; QC should confirm this counts as adequate paraphrase distance rather than a reworded lead. \| Citation 4 ('In 1865 he named the concept of entropy') refers back to Clausius by pronoun in the source paragraph — confirm the antecedent is unambiguous when checked against the live page in isolation. \| The branch list (chemical, equilibrium, non-equilibrium, classical, statistical) is drawn from five separate section headers in the source rather than a single citable sentence, so no citation names all five together — each branch name individually appears in the article's structure. |
| `subfield:type-theory` | **supported** | — | — | 6 (1) | generator self-flags: The opening sentence is structurally close to the source's own definition sentence despite lexical substitution (sort/classify, into/by) — worth a close-read comparison. \| Compressed Principia Mathematica's three publication years (1910, 1912, 1913) into the range '1910–1913'; this is a standard shorthand but technically not identical to the source's three-year enumeration. \| Did not cite plato.stanford.edu/entries/type-theory/ even though it was in the source set — its content (paradoxes, ramified hierarchy, proof theory) was more technical than needed for a 2–5 sentence summary and the Wikipedia article covered the same ground more concisely. \| The phrases naming Martin-Löf's and Coquand's specific systems ('Per Martin-Löf's intuitionistic type theory', 'Thierry Coquand's calculus of constructions') overlap the citation quotes almost word-for-word — these are proper theory names rather than paraphrasable prose, so exact naming seemed preferable to a looser rewrite, but flagging the overlap for QC to judge. |
| `person:franz-brentano` | **supported** | — | — | 7 (3) | generator self-flags: Per the editorial note: described Husserl as founder of phenomenology and a student who carried Brentano's concept forward, not as co-originator of intentionality — confirm this reads unambiguously. \| 'the idea that mental acts are directed at objects' is my own compressed gloss of intentionality, not itself a source quote — QC should check it against Brentano's own formulation (quoted at length in sep-brentano.html and sep-intentionality.html) for fidelity. \| 'held a professorship at the University of Vienna' retains 'at the University of Vienna' from the source almost verbatim since it is an institution name with an unavoidable preposition — flagging in case this reads as too close. \| Citation 4 uses a curly apostrophe (’) in "Brentano’s" because that is the literal character in the SEP source (HTML entity &rsquo;), not a straight apostrophe — confirmed against raw HTML; do not silently normalize it when checking. |
| `person:allen-newell` | **supported** | — | — | 5 (1) | generator self-flags: Per the editorial note: used the sourced 'laid the foundations of the field [of artificial intelligence]' claim rather than any claim that Newell founded 'symbolic AI' — no source in this batch makes that stronger claim. \| 'machine intelligence' is used as a synonym for 'artificial intelligence' and 'the science of human cognition' paraphrases 'the psychology of human cognition' to avoid quoting the Turing Award citation verbatim in the summary prose — QC should confirm no meaning drift. \| Did not mention the 1956 Dartmouth conference or the Soar architecture / Unified Theories of Cognition (1990) to keep the summary within the 2–5 sentence range — an omission, not a source disagreement. |
| `person:herbert-simon` | **supported** | — | — | 5 (2) | generator self-flags: The 'foundations of the field' claim is sourced to the Symbolic_artificial_intelligence article (which names Newell and Simon jointly), not to the Herbert_A._Simon article itself — cross-page sourcing for one claim, consistent with the editorial note that this is the correctly-scoped version of the founding claim. \| The closing clause ('research growing out of that same interest in organizational decision-making') paraphrases the Nobel citation's actual wording ('pioneering research into the decision-making process within economic organizations', found elsewhere in the same article) rather than quoting it directly — QC should verify this doesn't understate 'pioneering'. \| Reordered the three-field list (operations research, management science, cognitive science) relative to the source's order (cognitive science, operations research, management science) specifically to avoid a verbatim-sequence match — no change in meaning. \| 'the Logic Theory Machine (1956) and the General Problem Solver (1957)' and 'computer science, economics, and cognitive psychology' overlap their citations almost verbatim — these are a program-name pair and a field-name list respectively, both proper nouns rather than paraphrasable prose, so flagging rather than forcing an artificial reword. |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `subfield:thermodynamics` | node reviewed→reviewed | reviewed | editorial-v2 |
| `subfield:type-theory` | node reviewed→reviewed | reviewed | editorial-v2 |
| `person:franz-brentano` | node reviewed→reviewed | reviewed | editorial-v2 |
| `person:allen-newell` | node reviewed→reviewed | reviewed | editorial-v2 |
| `person:herbert-simon` | node reviewed→reviewed | reviewed | editorial-v2 |
| `subfield:thermodynamics`@en | summary update | reviewed | editorial-v2 |
| `subfield:type-theory`@en | summary update | reviewed | editorial-v2 |
| `person:franz-brentano`@en | summary update | reviewed | editorial-v2 |
| `person:allen-newell`@en | summary update | reviewed | editorial-v2 |
| `person:herbert-simon`@en | summary update | reviewed | editorial-v2 |

## Tally

- Adds: 0 nodes, 0 edges, 0 sources, 0 translations, 0 external links.
- Reviewed outcomes: 0 adds + 0 promotions (all ladder-sanctioned above).
- metadata flips: 5 (set_indexable/set_note).
- Editorial summary updates: 5.

## §8 permanence anchors

- https://en.wikipedia.org/wiki/Thermodynamics → https://en.wikipedia.org/w/index.php?title=Thermodynamics&oldid=1362668588
- https://en.wikipedia.org/wiki/Type_theory → https://en.wikipedia.org/w/index.php?title=Type_theory&oldid=1365858283
- https://en.wikipedia.org/wiki/Franz_Brentano → https://en.wikipedia.org/w/index.php?title=Franz_Brentano&oldid=1352550060
- https://plato.stanford.edu/entries/intentionality/ → https://plato.stanford.edu/archives/sum2026/entries/intentionality/
- https://plato.stanford.edu/entries/brentano/ → https://plato.stanford.edu/archives/sum2026/entries/brentano/
- https://en.wikipedia.org/wiki/Allen_Newell → https://en.wikipedia.org/w/index.php?title=Allen_Newell&oldid=1343727464
- https://en.wikipedia.org/wiki/Herbert_A._Simon → https://en.wikipedia.org/w/index.php?title=Herbert_A._Simon&oldid=1361323308
- https://en.wikipedia.org/wiki/Symbolic_artificial_intelligence → https://en.wikipedia.org/w/index.php?title=Symbolic_artificial_intelligence&oldid=1360607279

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
