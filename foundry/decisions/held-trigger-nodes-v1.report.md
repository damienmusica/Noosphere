# held-trigger-nodes-v1 — promotion decision report

**Decided 2026-07-29** · QC by Claude Opus (`claude-opus-5`) · generated from `foundry/decisions/held-trigger-nodes-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (21 errors) — this decision does not apply cleanly:
> - adds.nodes: node subfield:thermodynamics already exists
> - adds.nodes: node subfield:type-theory already exists
> - adds.nodes: node person:franz-brentano already exists
> - adds.nodes: node person:allen-newell already exists
> - adds.nodes: node person:herbert-simon already exists
> - adds.translations: translation subfield:thermodynamics@en already exists (use translation_updates)
> - adds.translations: translation subfield:type-theory@en already exists (use translation_updates)
> - adds.translations: translation person:franz-brentano@en already exists (use translation_updates)
> - adds.translations: translation person:allen-newell@en already exists (use translation_updates)
> - adds.translations: translation person:herbert-simon@en already exists (use translation_updates)
> - adds.edges: edge edge:thermodynamics-part-of-physics already exists
> - adds.edges: edge edge:type-theory-part-of-mathematical-logic already exists
> - adds.edges: edge edge:type-theory-part-of-theoretical-computer-science already exists
> - adds.edges: edge edge:franz-brentano-founded-intentionality already exists
> - adds.edges: edge edge:franz-brentano-influenced-edmund-husserl already exists
> - adds.edges: edge edge:allen-newell-founded-artificial-intelligence already exists
> - adds.edges: edge edge:herbert-simon-founded-artificial-intelligence already exists
> - adds.edges: edge edge:bertrand-russell-founded-type-theory already exists
> - promotions: edge edge:edmund-husserl-founded-intentionality has status "deprecated", expected "proposed"
> - promotions: edge edge:marvin-minsky-founded-symbolic-ai has status "deprecated", expected "proposed"
> - promotions: edge edge:bertrand-russell-influenced-computer-science has status "deprecated", expected "proposed"

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `subfield:thermodynamics` | **supported** | — | ✓ | 2 (2) | Identity resolved live (wbsearchentities → wbgetentities, 2026-07-29): Q11473 'thermodynamics', 156 sitelinks, 85 properties, P31 = Q4162444 branch of physics + Q11862829 academic discipline, P279 = Q14632398 physical science, P361 = Q413 physics. Referent-precise: the discipline, not the history-of (Q2376736) or the quantum/statistical specializations (Q12212546 / Q25442324), all of which were returned in the same search and rejected. §12 dual criterion: (a) a major division of physics in every classification scheme; (b) departments, journals and degree tracks throughout. Admitted as coverage in its own right — its originally hoped-for edge demand did not survive QC (see the Lavoisier note). |
| `subfield:type-theory` | **supported** | — | ✓ | 3 (3) | Identity resolved live 2026-07-29: Q1056428 'type theory', en description 'study of type systems in mathematical logic and computer science', 26 sitelinks, P31 = Q1936384 branch of mathematics, P279 = Q649732 formal system, P1269 (facet of) = mathematics, logic, theoretical computer science, mathematical logic. Referent-precise: the discipline, not 'history of type theory' (Q5871008) or the unrelated book/dissertation items returned by the same search. This answers the generation subagent's own highest-priority QC flag — it could not tell whether the node meant the mathematical-logic discipline or narrow programming-language type systems, and flagged that the answer flips the correct relation for the Russell edge. The live sources settle it: the node is the discipline spanning both homes, which is why it is cross-listed rather than filed under one. |
| `person:franz-brentano` | **supported** | — | ✓ | 2 (2) | Identity resolved live 2026-07-29: Q57196, P31 = Q5, P569 = 1838-01-16, P570 = 1917-03-17 (deceased — the deceased ladder applies, no living-person gate), 50 sitelinks, 171 properties. Disambiguated against three homonyms returned by the same search — Q94831774 (German painter), Q1446569 (Franz Dominicus Brentano), Q53157132 (Franz Anton Brentano). |
| `person:allen-newell` | **supported** | — | ✓ | 2 (2) | Identity resolved live 2026-07-29: Q439245, P31 = Q5, P569 = 1927-03-19, P570 = 1992-07-19 (deceased), 35 sitelinks, 72 properties. Only one person candidate returned by the search. |
| `person:herbert-simon` | **supported** | — | ✓ | 2 (2) | Identity resolved live 2026-07-29: Q181529 'Herbert Simon', P31 = Q5, P569 = 1916-06-15, P570 = 2001-02-09 (deceased), 70 sitelinks, 156 properties. Disambiguated against four scientific-article items with 'Herbert A. Simon' in the title, returned by the same search. |
| `edge:franz-brentano-founded-intentionality` | **supported** | ✓ | ✓ | 4 (4) | Four independent claim-stating sources, two publishers. Direction is unambiguous in all four (Brentano → the concept). Adversarial check: the competing attribution is to medieval scholasticism, which every source names explicitly and which the scope note records — that is a scope qualification, not a rival founder, so it is a supported-plus-note case rather than a disputed one (the existence-vs-degree line, §8 clause-6 v2). Second adversarial check: the previously-recorded rival was Husserl, and the same sources place him downstream of Brentano — see the Husserl deprecation in this batch. |
| `edge:franz-brentano-influenced-edmund-husserl` | **supported** | ✓ | ✓ | 2 (2) | Two independent claim-stating sources, two publishers, plus a third corroboration in enwiki Edmund Husserl ('Franz Brentano is often credited as being his most important influence, e.g., with regard to intentionality'). No dissent found on existence or direction; the teacher-student relation is a matter of record. Not disputed. |
| `edge:allen-newell-founded-artificial-intelligence` | **supported** | ✓ | ✓ | 2 (2) | Two independent claim-stating articles (decision (62) operational interpretation: distinct articles count as independent sources, and the lower source diversity — both Wikipedia — is recorded honestly rather than hidden). Adversarial counter-evidence WAS found and is recorded on the edge: enwiki Dartmouth workshop lists the field's 'founding fathers' as Shannon, McCarthy, Rochester and Minsky, omitting Newell. Judged existence-agreed / share-debated rather than existence-contested — the two source families describe different founding acts — so the §8 rule routes it to supported + tension note, not disputed. Target grain corrected from the generator's concept:symbolic-ai: no source asserts a symbolic-AI founding for anyone, which was the generation subagent's own third QC flag ('all four trace back to a single piece of internal provenance'). That flag was correct and is why the whole symbolic-AI founder cluster was re-grounded. |
| `edge:herbert-simon-founded-artificial-intelligence` | **supported** | ✓ | ✓ | 2 (2) | Two independent claim-stating articles; same adversarial counter-evidence and same existence-vs-share ruling as the Newell edge. Wording check: the person article says 'pioneer', the field article says 'laid the foundations of the field' — the founding claim rests on the latter, and the note keeps both framings rather than upgrading 'pioneer' silently. |
| `edge:bertrand-russell-founded-type-theory` | **supported** | ✓ | ✓ | 2 (2) | Two independent claim-stating sources, two publishers, both asserting origination. Adversarial checks: (1) Whitehead's co-authorship of Principia — both sources attribute the type theory itself to Russell, and Principia is named as where it appeared, so the attribution survives; the gap is recorded on the edge rather than papered over. (2) Later type theories (Church's simple theory, Martin-Löf's intuitionistic type theory, both named in the same enwiki article) are successors within the discipline, not rival founders. (3) The precursor question — Frege's stratification — is not framed by either source as the founding of type theory. |
| `edge:thermodynamics-part-of-physics` | **supported** | — | ✓ | 2 (2) | Structural tier. Wikidata carries both P31 = branch of physics and P361 = physics; the enwiki lead states it in one sentence. Uncontested. |
| `edge:type-theory-part-of-mathematical-logic` | **supported** | — | ✓ | 2 (2) | Structural tier, §13 co-equal membership. Both memberships are asserted by the same lead sentence, so neither parent is a minority claim; this is the cleanest possible §13 case and the direct mirror of subfield:computability-theory's two parents. |
| `edge:type-theory-part-of-theoretical-computer-science` | **supported** | — | ✓ | 2 (2) | Structural tier, §13 co-equal membership (second parent). §13's session-#45 guard was checked explicitly: this is not an 'applied across' case being forced into membership — the classification source names theoretical computer science as a home in the definitional sentence, which is exactly the grounding social-choice-theory failed to produce. |
| `edge:antoine-lavoisier-influenced-physics` | **not_enough_evidence** | — | ✓ | 3 (3) | ★ The recorded trigger was refuted by live evidence, which is the batch's most important negative result. The recheck-wave1-v1 hold read 'a thermodynamics-grained target would be accurate but no such node exists yet. Trigger: thermodynamics-class node created.' On live check that premise does not hold: enwiki Thermodynamics does not mention Lavoisier at all (0 occurrences), and enwiki History of thermodynamics routes his heat work to *thermochemistry*, not thermodynamics. Retargeting to the thermochemistry grain was then tested and also failed the bar: the only foundation sentence available ('These experiments mark the foundation of thermochemistry') carries an inline [citation needed] tag and refers to Black's experiments, while the Lavoisier sentence is a joint contribution claim, not a founding claim, and is a single source. Verdict NEI (§8 clause-6 v2 branch 5) — about our evidence, not about the world. The edge stays proposed and held with a corrected blocking condition; subfield:thermodynamics is still admitted in this batch, on the §12 dual criterion in its own right, not on this edge demand. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `subfield:thermodynamics` | wikidata:Q11473 | ✓ | wbgetentities | 2026-07-29 |  |
| `subfield:type-theory` | wikidata:Q1056428 | ✓ | wbgetentities | 2026-07-29 |  |
| `person:franz-brentano` | wikidata:Q57196 | ✓ | wbgetentities | 2026-07-29 |  |
| `person:allen-newell` | wikidata:Q439245 | ✓ | wbgetentities | 2026-07-29 |  |
| `person:herbert-simon` | wikidata:Q181529 | ✓ | wbgetentities | 2026-07-29 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `subfield:thermodynamics` | node add | reviewed | node-promotion-v1 |
| `subfield:type-theory` | node add | reviewed | node-promotion-v1 |
| `person:franz-brentano` | node add | reviewed | node-promotion-v1 |
| `person:allen-newell` | node add | reviewed | node-promotion-v1 |
| `person:herbert-simon` | node add | reviewed | node-promotion-v1 |
| `edge:thermodynamics-part-of-physics` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:type-theory-part-of-mathematical-logic` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:type-theory-part-of-theoretical-computer-science` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:franz-brentano-founded-intentionality` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:franz-brentano-influenced-edmund-husserl` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:allen-newell-founded-artificial-intelligence` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:herbert-simon-founded-artificial-intelligence` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:bertrand-russell-founded-type-theory` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:edmund-husserl-founded-intentionality` | edge proposed→deprecated | deprecated | — |
| `edge:marvin-minsky-founded-symbolic-ai` | edge proposed→deprecated | deprecated | — |
| `edge:bertrand-russell-influenced-computer-science` | edge proposed→deprecated | deprecated | — |

## Tally

- Adds: 5 nodes, 8 edges, 0 sources, 5 translations, 0 external links.
- Reviewed outcomes: 13 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (1):
  - `edge:antoine-lavoisier-influenced-physics`: Held since recheck-wave1-v1 (2026-07-02) as too broad at field:physics, with the recorded trigger 'thermodynamics-class node created'. That trigger is now RETIRED as refuted: subfield:thermodynamics was created in held-trigger-nodes-v1 (2026-07-29) and the retarget still fails. Live evidence — enwiki Thermodynamics does not mention Lavoisier at all; enwiki History of thermodynamics assigns his calorimetry work to thermochemistry ('a subject which became known as thermochemistry'); enwiki Thermochemistry's only foundation sentence carries an inline [citation needed] and is about Black's experiments. Verdict NEI at every grain tested (physics, thermodynamics, thermochemistry). New unblock condition: ≥2 independent claim-stating sources asserting a *founding or influence* relation between Lavoisier and a specific heat-science discipline — not a contribution/apparatus claim, and not a [citation needed] sentence. A subfield:thermochemistry node would be the natural target if such sources are found; it is deliberately NOT created on this batch's speculative demand. (recheck: manual)
- **Held entries closed** (3, dropped from foundry/held.json):
  - `edge:edmund-husserl-founded-intentionality`: Closed by deprecation in this batch. The hold's trigger (a Brentano node) fired, and the resolution is that the founder claim belongs to Brentano alone — Husserl's relation is recorded as edge:franz-brentano-influenced-edmund-husserl. No further work on this id.
  - `edge:marvin-minsky-founded-symbolic-ai`: Closed by deprecation in this batch. The hold's trigger (co-founder person nodes) fired, and the resolution is that the founder claim exists only at the artificial-intelligence grain, where Minsky already holds a reviewed edge. No further work on this id.
  - `edge:bertrand-russell-influenced-computer-science`: Closed by deprecation in this batch. The hold's trigger (a type-theory-class node) fired, and the claim was re-grounded as edge:bertrand-russell-founded-type-theory. No further work on this id.
- **Rejected** (4, recorded in foundry/rejections.json):
  - Marvin Minsky influenced/founded type theory: Rejection probe, planted by the orchestrator and declined by the generation subagent before QC saw it: 'Minsky's documented work has no known connection to formal type theory, and I know of no claim-stating source linking them.' Confirmed at QC — no source in the batch corpus links them. Probe fired correctly.
  - Herbert Simon influenced/founded thermodynamics: Rejection probe, planted by the orchestrator and declined by the generation subagent before QC saw it: the entropy-adjacent language in The Sciences of the Artificial is 'metaphorical borrowing, not a sourceable scholarly contribution.' Confirmed at QC. Probe fired correctly.
  - John McCarthy founded symbolic AI: Duplicate at a wrong grain. The generation subagent proposed it while flagging the overlap itself; QC rejects it. The sourced claim is the AI-founding one (enwiki John McCarthy: 'He was one of the founders of the discipline of artificial intelligence'), already carried by the reviewed edge:john-mccarthy-founded-artificial-intelligence. No source states a symbolic-AI founding. Session-#49 drop rule (founded_or_formalized already exists) plus the grain correction applied to the whole symbolic-AI cluster in this batch.
  - Allen Newell / Herbert Simon founded symbolic AI: Rejected at the proposed grain and re-grounded, not dropped: no source asserts a symbolic-AI founding for either man; enwiki Symbolic artificial intelligence describes their work inside the paradigm. The claim the sources do state is the AI-founding one, written in this batch as edge:allen-newell-founded-artificial-intelligence and edge:herbert-simon-founded-artificial-intelligence. Recorded so a later wave does not silently re-propose the symbolic-AI form.

## §8 permanence anchors

- https://www.wikidata.org/wiki/Q11473 → https://www.wikidata.org/w/index.php?title=Q11473&oldid=2523293812
- https://en.wikipedia.org/wiki/Thermodynamics → https://en.wikipedia.org/w/index.php?title=Thermodynamics&oldid=1362668588
- https://www.wikidata.org/wiki/Q1056428 → https://www.wikidata.org/w/index.php?title=Q1056428&oldid=2518326441
- https://en.wikipedia.org/wiki/Type_theory → https://en.wikipedia.org/w/index.php?title=Type_theory&oldid=1365858283
- https://plato.stanford.edu/entries/type-theory/ → https://plato.stanford.edu/archives/sum2026/entries/type-theory/
- https://www.wikidata.org/wiki/Q57196 → https://www.wikidata.org/w/index.php?title=Q57196&oldid=2516859871
- https://en.wikipedia.org/wiki/Franz_Brentano → https://en.wikipedia.org/w/index.php?title=Franz_Brentano&oldid=1352550060
- https://www.wikidata.org/wiki/Q439245 → https://www.wikidata.org/w/index.php?title=Q439245&oldid=2517465372
- https://en.wikipedia.org/wiki/Allen_Newell → https://en.wikipedia.org/w/index.php?title=Allen_Newell&oldid=1343727464
- https://www.wikidata.org/wiki/Q181529 → https://www.wikidata.org/w/index.php?title=Q181529&oldid=2515847517
- https://en.wikipedia.org/wiki/Herbert_A._Simon → https://en.wikipedia.org/w/index.php?title=Herbert_A._Simon&oldid=1361323308
- https://en.wikipedia.org/wiki/Intentionality → https://en.wikipedia.org/w/index.php?title=Intentionality&oldid=1355666928
- https://plato.stanford.edu/entries/brentano/ → https://plato.stanford.edu/archives/sum2026/entries/brentano/
- https://plato.stanford.edu/entries/intentionality/ → https://plato.stanford.edu/archives/sum2026/entries/intentionality/
- https://en.wikipedia.org/wiki/Edmund_Husserl → https://en.wikipedia.org/w/index.php?title=Edmund_Husserl&oldid=1365533587
- https://en.wikipedia.org/wiki/Symbolic_artificial_intelligence → https://en.wikipedia.org/w/index.php?title=Symbolic_artificial_intelligence&oldid=1360607279
- https://en.wikipedia.org/wiki/Logic_Theorist → https://en.wikipedia.org/w/index.php?title=Logic_Theorist&oldid=1366443812
- https://en.wikipedia.org/wiki/History_of_thermodynamics → https://en.wikipedia.org/w/index.php?title=History_of_thermodynamics&oldid=1348030733
- https://en.wikipedia.org/wiki/Thermochemistry → https://en.wikipedia.org/w/index.php?title=Thermochemistry&oldid=1353863068

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
