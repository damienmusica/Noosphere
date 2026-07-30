# person-wave11-v1 — promotion decision report

**Decided 2026-07-29** · QC by Claude Opus (`claude-opus-5`) · generated from `foundry/decisions/person-wave11-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (20 errors) — this decision does not apply cleanly:
> - adds.nodes: node person:albert-einstein already exists
> - adds.nodes: node person:rudolf-clausius already exists
> - adds.nodes: node person:ludwig-boltzmann already exists
> - adds.nodes: node person:rudolf-virchow already exists
> - adds.nodes: node person:girolamo-fracastoro already exists
> - adds.nodes: node concept:theory-of-relativity already exists
> - adds.translations: translation person:albert-einstein@en already exists (use translation_updates)
> - adds.translations: translation person:rudolf-clausius@en already exists (use translation_updates)
> - adds.translations: translation person:ludwig-boltzmann@en already exists (use translation_updates)
> - adds.translations: translation person:rudolf-virchow@en already exists (use translation_updates)
> - adds.translations: translation person:girolamo-fracastoro@en already exists (use translation_updates)
> - adds.translations: translation concept:theory-of-relativity@en already exists (use translation_updates)
> - adds.edges: edge edge:theory-of-relativity-part-of-physics already exists
> - adds.edges: edge edge:albert-einstein-founded-theory-of-relativity already exists
> - adds.edges: edge edge:henri-poincare-influenced-theory-of-relativity already exists
> - adds.edges: edge edge:rudolf-clausius-founded-entropy already exists
> - adds.edges: edge edge:ludwig-boltzmann-formalizes-entropy already exists
> - adds.edges: edge edge:ludwig-boltzmann-founded-statistical-physics already exists
> - adds.edges: edge edge:rudolf-virchow-founded-cell-theory already exists
> - adds.edges: edge edge:girolamo-fracastoro-influenced-germ-theory-of-disease already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `person:albert-einstein` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q937, P31 = Q5, P570 = 1955-04-18 (deceased), 320 sitelinks, 443 properties. Disambiguated from a medical school and a train service returned by the same search. |
| `person:rudolf-clausius` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q30693, P31 = Q5, P570 = 1888-08-24 (deceased), 79 sitelinks, 146 properties. Disambiguated from a photograph item and a Cologne street. |
| `person:ludwig-boltzmann` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q84296, P31 = Q5, P570 present (two competing dates, 1906-09-05 and 1906-09-06 — deceased either way, and the discrepancy is recorded rather than silently picked), 89 sitelinks, 188 properties. Disambiguated from a photograph item and the Ludwig Boltzmann Gesellschaft. |
| `person:rudolf-virchow` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q76432, P31 = Q5, P570 = 1902-09-05 (deceased), 78 sitelinks, 206 properties. This is the same QID that appears in Q177935's P61 (discoverer or inventor) list for cell theory, which is an independent cross-confirmation that the person node and the founder claim point at the same referent. Disambiguated from a prize and a medal named after him. |
| `person:girolamo-fracastoro` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q318593, P31 = Q5, P570 = 1553-08-06 (deceased), 45 sitelinks, 138 properties. Disambiguated from a Verona lyceum named after him and a 1930 scientific article. |
| `concept:theory-of-relativity` | **supported** | — | ✓ | 2 (2) | ★ Re-admitted from the rejection ledger, explicitly via override_rejections. concept-wave3-v1 rejected this node — it was one of that batch's two planted probes — and recorded the reason precisely: not that the concept was unwanted, but that its only available person link was Poincaré, which would have misrepresented the attribution. The ledger entry stated the re-admission condition as "re-admissible once person:albert-einstein exists; that is a node task, not an edge task." Einstein is added in this batch, so the condition is met and the re-admission is the ledger working as designed rather than a reversal of it. Identity live 2026-07-29: Q43514, 144 sitelinks, 76 properties, P31 = scientific theory + branch of physics; disambiguated from a Dream On episode and three scientific articles. |
| `edge:albert-einstein-founded-theory-of-relativity` | **supported** | ✓ | ✓ | 2 (2) | Adversarial counter-evidence was sought and found: enwiki maintains an entire Relativity priority dispute article. Read in full, it documents a debate over credit and priority in which Einstein's authorship of the 1905 and 1915 papers is not in question — the contested matter is how much he owed to Lorentz and Poincaré. Existence and direction agreed, share debated, so §8 routes it to supported plus a tension note rather than to disputed. The minority position is not buried: it is written as its own reviewed edge for Poincaré. |
| `edge:henri-poincare-influenced-theory-of-relativity` | **supported** | ✓ | ✓ | 2 (2) | Two independent claim-stating articles after the ladder gate refused a single-source promotion — the gate doing exactly its job. enwiki Relativity priority dispute records that Einstein referred "most notably to the work of Henri Poincaré and Hendrik Lorentz for special relativity"; enwiki History of special relativity independently describes Poincaré "having earlier proposed the relativity principle as a general law of nature" and using it in 1905 to correct Lorentz's transformation formulas. Influence rather than founding, direction uncontested (the work predates the 1905 paper). Lorentz is named in both and is not a corpus node — honest gap. |
| `edge:rudolf-clausius-founded-entropy` | **supported** | ✓ | ✓ | 2 (2) | Two independent articles state the same claim, and the person article's known-for list separately reads "Originator of the concept of entropy". No dissent found. This closes a gap opened deliberately in concept-wave3-v1, where the concept was admitted with a part_of edge only. |
| `edge:ludwig-boltzmann-formalizes-entropy` | **supported** | ✓ | ✓ | 2 (2) | Two independent articles, both dating the contribution to 1877 and both describing it as supplying a definition to an existing concept rather than originating one. That is what decided `formalizes` over `founded_or_formalized` — the twelve-year gap after Clausius is in both sources. |
| `edge:ludwig-boltzmann-founded-statistical-physics` | **supported** | ✓ | ✓ | 2 (2) | Two independent claim-stating articles after the ladder gate refused a single-source promotion: the field article says "The founding of the field of statistical mechanics is generally credited to three physicists" and names Boltzmann first, and the person article says "His greatest achievements were the development of statistical mechanics and the statistical explanation of the second law of thermodynamics." That is the (62) operational interpretation — person article plus field article — and the lower source diversity is recorded rather than hidden. Honest gaps: Maxwell and Gibbs, the other two credited founders, are not corpus nodes.

★ Naming check, and it overturned the orchestrator's first reasoning. This session refused a near-name bridge earlier (concept:entropy was not cross-listed onto subfield:statistical-physics on the strength of a statistical-mechanics mention), so the same question was put to this edge — and the first answer written down, that the founding sentence sits in an article titled Statistical physics, was WRONG. en.wikipedia.org/wiki/Statistical_physics is a REDIRECT to Statistical mechanics; the citation was silently pointing at a different page title than the one named. Verified live: the API reports redirects [{from: Statistical physics, to: Statistical mechanics}]. Per §8 the citation is therefore anchored on the canonical URL. The substantive conclusion survives and is in fact strengthened: English Wikipedia does not treat the two as distinct topics at all, and Wikidata Q677916 (statistical physics, this node's QID) carries an enwiki sitelink whose target is that same merged article — so the founding claim is about this node's referent, not bridged across from a differently-named unit. Wikidata does keep two items (Q677916 and Q188715 statistical mechanics); that divergence is recorded, not resolved. |
| `edge:rudolf-virchow-founded-cell-theory` | **supported** | ✓ | ✓ | 3 (3) | ★ Two independent articles agree Virchow introduced the third tenet into cell theory, and Wikidata's P61 for the concept lists him alongside Schwann and Schleiden. Both articles also record that the idea was Remak's — "now widely recognized as being plagiarized from Robert Remak" (Virchow article) and "had already been proposed by Robert Remak" (Cell theory article). The distinction that decided the verdict: what is agreed is his role in putting the tenet into the theory; what is contested is originating the idea. That is the existence-versus-share line, so supported with the contest recorded on the edge and confidence held down to 0.75. Remak is the honest gap most worth closing next. |
| `edge:girolamo-fracastoro-influenced-germ-theory-of-disease` | **supported** | ✓ | ✓ | 2 (2) | ★ QC downgraded the relation from the generator's founded_or_formalized. The sources disagree in strength: one calls it a proposal of basic forms of the theory, the other calls the same work a predecessor to it. The founder ladder requires two independent claim-stating sources for founding; there is one. Both support influence. Recording the weaker relation that both sources carry is the honest option, and it leaves concept:germ-theory-of-disease with no founder edge — which is the accurate state of the evidence, not an oversight. |
| `edge:theory-of-relativity-part-of-physics` | **supported** | — | ✓ | 2 (2) | Structural tier, uncontested. |
| `edge:rudolf-clausius-founded-thermodynamics` | **not_enough_evidence** | — | ✓ | 2 (2) | Proposed by the generator at 0.72 with an ambiguous flag, and the flag was right. The person article does state founding, but the field article — the second source the (62) operational interpretation relies on — states a contribution rather than a founding, and credits Lord Kelvin with the first concise definition of thermodynamics in 1854 and Carnot with the prior principle Clausius restated. One claim-stating founder source is not two. NEI, held. Clausius's entropy founder edge is unaffected and stands at 0.95. |
| `person:alfred-north-whitehead` | **reject** | — | ✓ | 3 (3) | ★ Honesty-gap node drop, reached independently by the generator and by QC. Whitehead was on this batch's slate to close the co-authorship gap recorded on edge:bertrand-russell-founded-type-theory. He does not close it: both type-theory sources attribute the theory itself to Russell, and the Principia article says only that PM adopted it. His own sourced founder claim is process philosophy — "He created the philosophical school known as process philosophy" — but no corpus node exists for that referent, and inventing one to justify a person node would invert the edge-demand discipline. Admitting him would create an isolated node; the drop mirrors the Snow and Vernadsky-Biosphere honesty gaps. Re-admissible when a process-philosophy endpoint exists or a source attributes the type theory to him jointly. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `person:albert-einstein` | wikidata:Q937 | ✓ | wbgetentities | 2026-07-29 |  |
| `person:rudolf-clausius` | wikidata:Q30693 | ✓ | wbgetentities | 2026-07-29 |  |
| `person:ludwig-boltzmann` | wikidata:Q84296 | ✓ | wbgetentities | 2026-07-29 |  |
| `person:rudolf-virchow` | wikidata:Q76432 | ✓ | wbgetentities | 2026-07-29 |  |
| `person:girolamo-fracastoro` | wikidata:Q318593 | ✓ | wbgetentities | 2026-07-29 |  |
| `concept:theory-of-relativity` | wikidata:Q43514 | ✓ | wbgetentities | 2026-07-29 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `person:albert-einstein` | node add | reviewed | node-promotion-v1 |
| `person:rudolf-clausius` | node add | reviewed | node-promotion-v1 |
| `person:ludwig-boltzmann` | node add | reviewed | node-promotion-v1 |
| `person:rudolf-virchow` | node add | reviewed | node-promotion-v1 |
| `person:girolamo-fracastoro` | node add | reviewed | node-promotion-v1 |
| `concept:theory-of-relativity` | node add | reviewed | node-promotion-v1 |
| `edge:theory-of-relativity-part-of-physics` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:albert-einstein-founded-theory-of-relativity` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:henri-poincare-influenced-theory-of-relativity` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:rudolf-clausius-founded-entropy` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:ludwig-boltzmann-formalizes-entropy` | edge add (formalizes) | reviewed | formalizes-auto-54 |
| `edge:ludwig-boltzmann-founded-statistical-physics` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:rudolf-virchow-founded-cell-theory` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:girolamo-fracastoro-influenced-germ-theory-of-disease` | edge add (influenced) | reviewed | a-relation-auto-68 |

## Tally

- Adds: 6 nodes, 8 edges, 0 sources, 6 translations, 0 external links.
- Reviewed outcomes: 14 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (1):
  - `edge:rudolf-clausius-founded-thermodynamics`: NEI ruled 2026-07-29 (person-wave11-v1): one claim-stating founder source, not two. enwiki Rudolf Clausius says he 'is considered one of the central founding fathers of the science of thermodynamics', but enwiki Thermodynamics — the field article the (62) operational interpretation relies on as the second source — states a contribution rather than a founding ('restated Carnot's principle ... and gave the theory of heat a more accurate and sounder basis') and credits Lord Kelvin with the first concise definition in 1854. Unblock: a second independent claim-stating source for a Clausius founding of thermodynamics. Note that this is a multi-founder field in the sources (Carnot, Kelvin, Clausius, Joule), so the eventual shape is likely several co-founder edges rather than one. (recheck: manual)
- **Rejected** (2, recorded in foundry/rejections.json):
  - Alfred North Whitehead (as a person node, this wave): Honesty-gap drop. He does not close the type-theory co-authorship gap he was slated for — both sources attribute the theory to Russell — and his own sourced founder claim (process philosophy) has no endpoint in the corpus, so admitting him would create an isolated node. Re-admissible when a process-philosophy endpoint exists or a source attributes the type theory to him jointly.
  - Alfred North Whitehead founded type theory: No source attributes the type theory to Whitehead. SEP: 'The theory of types was introduced by Russell'; enwiki Principia Mathematica says only that PM adopted it. Do not re-propose on co-authorship of Principia alone.

## §8 permanence anchors

- https://www.wikidata.org/wiki/Q937 → https://www.wikidata.org/w/index.php?title=Q937&oldid=2524382135
- https://en.wikipedia.org/wiki/Theory_of_relativity → https://en.wikipedia.org/w/index.php?title=Theory_of_relativity&oldid=1346554258
- https://www.wikidata.org/wiki/Q30693 → https://www.wikidata.org/w/index.php?title=Q30693&oldid=2521158978
- https://en.wikipedia.org/wiki/Rudolf_Clausius → https://en.wikipedia.org/w/index.php?title=Rudolf_Clausius&oldid=1365811715
- https://www.wikidata.org/wiki/Q84296 → https://www.wikidata.org/w/index.php?title=Q84296&oldid=2517096989
- https://en.wikipedia.org/wiki/Ludwig_Boltzmann → https://en.wikipedia.org/w/index.php?title=Ludwig_Boltzmann&oldid=1362784115
- https://www.wikidata.org/wiki/Q76432 → https://www.wikidata.org/w/index.php?title=Q76432&oldid=2524074209
- https://en.wikipedia.org/wiki/Rudolf_Virchow → https://en.wikipedia.org/w/index.php?title=Rudolf_Virchow&oldid=1361411508
- https://www.wikidata.org/wiki/Q318593 → https://www.wikidata.org/w/index.php?title=Q318593&oldid=2514748159
- https://en.wikipedia.org/wiki/Germ_theory_of_disease → https://en.wikipedia.org/w/index.php?title=Germ_theory_of_disease&oldid=1363463071
- https://www.wikidata.org/wiki/Q43514 → https://www.wikidata.org/w/index.php?title=Q43514&oldid=2517110638
- https://en.wikipedia.org/wiki/Relativity_priority_dispute → https://en.wikipedia.org/w/index.php?title=Relativity_priority_dispute&oldid=1365856267
- https://en.wikipedia.org/wiki/History_of_special_relativity → https://en.wikipedia.org/w/index.php?title=History_of_special_relativity&oldid=1363950802
- https://en.wikipedia.org/wiki/Entropy → https://en.wikipedia.org/w/index.php?title=Entropy&oldid=1361126134
- https://en.wikipedia.org/wiki/Statistical_mechanics → https://en.wikipedia.org/w/index.php?title=Statistical_mechanics&oldid=1365220532
- https://en.wikipedia.org/wiki/Cell_theory → https://en.wikipedia.org/w/index.php?title=Cell_theory&oldid=1365081375
- https://www.wikidata.org/wiki/Q177935 → https://www.wikidata.org/w/index.php?title=Q177935&oldid=2523318691
- https://en.wikipedia.org/wiki/Girolamo_Fracastoro → https://en.wikipedia.org/w/index.php?title=Girolamo_Fracastoro&oldid=1360678484
- https://en.wikipedia.org/wiki/Thermodynamics → https://en.wikipedia.org/w/index.php?title=Thermodynamics&oldid=1362668588
- https://en.wikipedia.org/wiki/Alfred_North_Whitehead → https://en.wikipedia.org/w/index.php?title=Alfred_North_Whitehead&oldid=1361815510
- https://en.wikipedia.org/wiki/Principia_Mathematica → https://en.wikipedia.org/w/index.php?title=Principia_Mathematica&oldid=1356011315
- https://plato.stanford.edu/entries/type-theory/ → https://plato.stanford.edu/archives/sum2026/entries/type-theory/

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
