# concept-wave3-v1 — promotion decision report

**Decided 2026-07-29** · QC by Claude Opus (`claude-opus-5`) · generated from `foundry/decisions/concept-wave3-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (27 errors) — this decision does not apply cleanly:
> - adds.nodes: node concept:conservation-of-mass already exists
> - adds.nodes: node concept:cell-theory already exists
> - adds.nodes: node concept:germ-theory-of-disease already exists
> - adds.nodes: node concept:uniformitarianism already exists
> - adds.nodes: node concept:entropy already exists
> - adds.nodes: node concept:bounded-rationality already exists
> - adds.nodes: node concept:ideal-type already exists
> - adds.translations: translation concept:conservation-of-mass@en already exists (use translation_updates)
> - adds.translations: translation concept:cell-theory@en already exists (use translation_updates)
> - adds.translations: translation concept:germ-theory-of-disease@en already exists (use translation_updates)
> - adds.translations: translation concept:uniformitarianism@en already exists (use translation_updates)
> - adds.translations: translation concept:entropy@en already exists (use translation_updates)
> - adds.translations: translation concept:bounded-rationality@en already exists (use translation_updates)
> - adds.translations: translation concept:ideal-type@en already exists (use translation_updates)
> - adds.edges: edge edge:conservation-of-mass-part-of-chemistry already exists
> - adds.edges: edge edge:antoine-lavoisier-founded-conservation-of-mass already exists
> - adds.edges: edge edge:cell-theory-part-of-cell-biology already exists
> - adds.edges: edge edge:theodor-schwann-founded-cell-theory already exists
> - adds.edges: edge edge:matthias-jakob-schleiden-founded-cell-theory already exists
> - adds.edges: edge edge:germ-theory-of-disease-part-of-microbiology already exists
> - adds.edges: edge edge:uniformitarianism-part-of-geology already exists
> - adds.edges: edge edge:james-hutton-founded-uniformitarianism already exists
> - adds.edges: edge edge:entropy-part-of-thermodynamics already exists
> - adds.edges: edge edge:bounded-rationality-part-of-economics already exists
> - adds.edges: edge edge:herbert-simon-founded-bounded-rationality already exists
> - adds.edges: edge edge:ideal-type-part-of-sociology already exists
> - adds.edges: edge edge:max-weber-founded-ideal-type already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `concept:conservation-of-mass` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q483948, P31 = Q36382 scientific law, P279 = Q205805, 72 sitelinks, 23 properties, and P61 (discoverer or inventor) = Q39607 Lavoisier. Referent-precise: the law, disambiguated at search time from Q11382 conservation of energy and from two scientific-article homonyms. C3 passes — a scientific law is a bounded doctrine, not a discipline. |
| `concept:cell-theory` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q177935, P31 = Q3239681 scientific theory, 71 sitelinks, P61 = Q76747 Schleiden + Q76745 Schwann + Q76432 Virchow. Disambiguated from three scientific-article homonyms returned by the same search. |
| `concept:germ-theory-of-disease` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q1425837, P31 = Q3239681 scientific theory, 31 sitelinks; the only search hit, no homonym risk. The referent explicitly excludes germ-plasm theory and germ-layer theory, a real trap the generator named. Node admitted; both proposed founder edges failed — see the separate verdicts. |
| `concept:uniformitarianism` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q208650, P31 = Q211364 principle + Q5389993 philosophical theory, 48 sitelinks, 20 properties, no P61. Disambiguated from three scientific-article homonyms. |
| `concept:entropy` | **supported** | — | ✓ | 2 (2) | ★ Identity required a second, targeted search. The bare label 'entropy' returns a journal, four video games, a split EP, a yacht and a Buffy episode before any physics item — the noisiest label in the batch. Q45003 'entropy — physical property of the state of a system, measure of disorder' is the thermodynamic referent, distinguished from Q204570 information entropy (a genuinely different quantity that would be the wrong node here) and from Q5380792, a near-duplicate item. Recorded because a label-match-only resolver would have failed this one outright. |
| `concept:bounded-rationality` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q814385, P31 = Q29028649 economic concept, P279 = Q177571 + Q44455, 23 sitelinks. Disambiguated from a 2020 item and two journal articles. |
| `concept:ideal-type` | **supported** | — | ✓ | 2 (2) | Identity live 2026-07-29: Q1052882, P31 = Q151885 concept — the cleanest C3 typing in the batch — P279 = Q21146257 type, 20 sitelinks, 22 properties. Disambiguated from an Ideal typewriter item and two journal articles; the generator's flagged colloquial-'ideal type' homonym does not carry a competing entity. |
| `edge:antoine-lavoisier-founded-conservation-of-mass` | **supported** | ✓ | ✓ | 3 (3) | Prose claim plus a structural cross-confirmation (P61 = Lavoisier). Adversarial check found and recorded the priority literature in the source itself (Jean Rey 1630; a Lomonosov claim is also current) — that is a scope qualification on what Lavoisier founded, not a rival founder for the law as chemistry's quantitative principle, so it routes to supported + note under the existence-vs-degree line rather than to disputed. |
| `edge:theodor-schwann-founded-cell-theory` | **supported** | ✓ | ✓ | 2 (2) | One sentence names both founders; Wikidata P61 independently lists Schleiden, Schwann and Virchow. Adversarial check: Virchow's third clause is a real part of the modern doctrine and he is missing from the corpus — recorded as an honest gap on both edges rather than silently reducing the theory to two authors. |
| `edge:matthias-jakob-schleiden-founded-cell-theory` | **supported** | ✓ | ✓ | 2 (2) | Twin of the Schwann edge; same grounding and same Virchow gap. |
| `edge:james-hutton-founded-uniformitarianism` | **supported** | ✓ | ✓ | 2 (2) | ★ QC split a proposed co-founder pair. The generator proposed Hutton and Lyell together as originator and systematiser, and was confident enough to leave the pair unflagged — its only unflagged multi-founder claim. The source separates them explicitly: uniformitarianism starts "with the work of the geologist James Hutton", while "Hutton's work was later refined by scientist John Playfair and popularised by geologist Charles Lyell's Principles of Geology in 1830." Popularisation is not founding, so the Lyell edge is rejected and Hutton's stands alone. Source diversity is honestly low (one article, two separate passages). |
| `edge:herbert-simon-founded-bounded-rationality` | **supported** | ✓ | ✓ | 2 (2) | Explicit coinage claim plus a dedicated SEP entry built on Simon 1955a. Two publishers. No dissent on existence or direction. The quote is truncated at 'Herbert A.' because the sentence-splitter treats the initial as a stop — the full sentence names Simon, and fetch-verify confirms the string verbatim. |
| `edge:max-weber-founded-ideal-type` | **supported** | ✓ | ✓ | 2 (2) | Two independent publishers attribute the methodology to Weber. Adversarial check: no rival originator is named in either source, and the corpus's existing Weber edges are consistent with this one rather than duplicative of it. |
| `edge:conservation-of-mass-part-of-chemistry` | **supported** | — | ✓ | 2 (2) | Structural tier, uncontested. |
| `edge:cell-theory-part-of-cell-biology` | **supported** | — | ✓ | 2 (2) | Structural tier, uncontested. |
| `edge:germ-theory-of-disease-part-of-microbiology` | **supported** | — | ✓ | 2 (2) | Structural tier, uncontested. |
| `edge:uniformitarianism-part-of-geology` | **supported** | — | ✓ | 2 (2) | Structural tier, uncontested. |
| `edge:entropy-part-of-thermodynamics` | **supported** | — | ✓ | 2 (2) | Structural tier. The statistical-mechanics second home is real and recorded on the edge, but deliberately not written as a §13 co-equal membership onto subfield:statistical-physics — that is a near-name, not the same unit, and §12 clause 3 strict name-identity is the standing discipline against bridging on near-names. |
| `edge:bounded-rationality-part-of-economics` | **supported** | — | ✓ | 2 (2) | Structural tier. Target choice recorded on the edge: field:economics over subfield:behavioral-economics, because neither source files it in the narrower unit. |
| `edge:ideal-type-part-of-sociology` | **supported** | — | ✓ | 2 (2) | Structural tier, uncontested. |
| `edge:charles-lyell-founded-uniformitarianism` | **reject** | — | ✓ | 1 (1) | Proposed by the generator as a co-founder alongside Hutton, unflagged. The source distinguishes the two roles in one sentence: Lyell popularised, Playfair refined, Hutton originated. Popularisation does not meet the founded_or_formalized bar. Rejected, not held — the source is clear rather than thin. |
| `edge:louis-pasteur-founded-germ-theory-of-disease` | **not_enough_evidence** | — | ✓ | 3 (3) | The proposed founder claim does not survive the article's own history: the theory is stated to originate with Fracastoro in 1546, two centuries before Pasteur, whose contribution the article frames as beginning a 'transitional period'. Wikidata does carry P61 = Q529 Pasteur, but a structural claim that contradicts the prose history of the same referent is a signal to check, not a licence to promote. NEI at the founder bar — about our evidence, not about Pasteur. |
| `edge:robert-koch-founded-germ-theory-of-disease` | **not_enough_evidence** | — | ✓ | 1 (1) | Weaker than the Pasteur claim on both signals: the article says Koch extended the work, and Wikidata's P61 for Q1425837 does not list him at all. NEI at the founder bar. Koch's own founder standing in the corpus is a separate, already-settled question. |
| `concept:division-of-labour` | **reject** | — | ✓ | 2 (2) | ★ C3 referent-precision rejection, and a direct mirror of the concept:bureaucracy ruling (decision (108)). Q207449 is the generic phenomenon — 'separation of tasks in any system' — with no P31 at all and P279 = social behavior + human behavior, i.e. modelled as a behaviour rather than a doctrine, and carrying no P61. The article's own structure is decisive: 'Pre-modern theories' runs Plato, Xenophon, Augustine and medieval Muslim scholars before 'Modern theories' reaches Adam Smith as one of eleven named theorists. A phenomenon that predates its proposed founder by two millennia cannot carry his founder claim — exactly the trap that deprecated concept:bureaucracy. Smith's actual contribution is already carried by work:the-wealth-of-nations, which exists and is reviewed. |
| `concept:cardinality` | **not_enough_evidence** | — | ✗ | 2 (2) | The concept-wave2 C3 hold is confirmed live, not merely carried forward. Q4049983 has 57 sitelinks and 31 properties but its own English description encodes the ambiguity that caused the hold — cardinality measured 'either as a cardinal number or as the equivalen[ce class]' — and its P279 parents are cardinal function, class function and index number, i.e. it is modelled as a kind of function rather than as the concept of set size. The same-label alternative Q28727773 is a 0-sitelink, 4-property orphan stub. Neither is a decidable concept referent. Held again with the reason sharpened from the wave-2 wording. |
| `concept:boolean-algebra` | **not_enough_evidence** | — | ✗ | 2 (2) | ★ The proposal contract v2 blind-referent checksum firing exactly as designed. The generator described its intended referent as Boole's specific formal algebraic system, deliberately distinct from the disciplinary sense that caused the wave-2 hold. Live resolution returns neither: Q173183 is typed P31 = Q1936384 branch of mathematics — the disciplinary referent, hold confirmed — and Q4973304 is 'lattice that models the classical propositional logic', an algebraic structure, not Boole's system. Description-versus-resolution mismatch is the error signal the v2 contract exists to produce, and it is the reason this candidate stays out. Separate note for a future skeleton wave: whether subfield:boolean-algebra is admissible under the §12 dual criterion is a different question from this one, and is not decided here. |
| `concept:theory-of-relativity` | **reject** | — | ✗ | 0 (0) | Rejection probe, planted unmarked by the orchestrator in the generation slate with Henri Poincaré named as the person endpoint. It fired partially at generation time: the generator refused founded_or_formalized, wrote influenced at confidence 0.65, named Einstein as the mainstream-credited founder, verified that no Einstein node exists in the corpus, and put this candidate first on its own QC list. That is the correct refusal. QC completes it by declining admission this wave — a relativity node whose only person link is Poincaré would misrepresent the attribution, and the fix is a node, not an edge. |
| `concept:evolution` | **reject** | — | ✗ | 0 (0) | Rejection probe, planted unmarked. It fired at generation time: the generator proposed it but flagged that its edge pair duplicates the exact endpoints of the already-reviewed concept:natural-selection edges and asked QC to confirm the referents are distinct before promoting both. They are not distinct enough to admit — 'evolution' as a bare label collides with subfield:evolutionary-biology on one side and concept:natural-selection on the other, which is the same over-broad-label failure that held 'positivism' against concept:logical-positivism in wave 2. C3 reject. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `concept:conservation-of-mass` | wikidata:Q483948 | ✓ | wbgetentities | 2026-07-29 |  |
| `concept:cell-theory` | wikidata:Q177935 | ✓ | wbgetentities | 2026-07-29 |  |
| `concept:germ-theory-of-disease` | wikidata:Q1425837 | ✓ | wbgetentities | 2026-07-29 |  |
| `concept:uniformitarianism` | wikidata:Q208650 | ✓ | wbgetentities | 2026-07-29 |  |
| `concept:entropy` | wikidata:Q45003 | ✓ | wbgetentities | 2026-07-29 |  |
| `concept:bounded-rationality` | wikidata:Q814385 | ✓ | wbgetentities | 2026-07-29 |  |
| `concept:ideal-type` | wikidata:Q1052882 | ✓ | wbgetentities | 2026-07-29 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `concept:conservation-of-mass` | node add | reviewed | node-promotion-v1 |
| `concept:cell-theory` | node add | reviewed | node-promotion-v1 |
| `concept:germ-theory-of-disease` | node add | reviewed | node-promotion-v1 |
| `concept:uniformitarianism` | node add | reviewed | node-promotion-v1 |
| `concept:entropy` | node add | reviewed | node-promotion-v1 |
| `concept:bounded-rationality` | node add | reviewed | node-promotion-v1 |
| `concept:ideal-type` | node add | reviewed | node-promotion-v1 |
| `edge:conservation-of-mass-part-of-chemistry` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:antoine-lavoisier-founded-conservation-of-mass` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:cell-theory-part-of-cell-biology` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:theodor-schwann-founded-cell-theory` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:matthias-jakob-schleiden-founded-cell-theory` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:germ-theory-of-disease-part-of-microbiology` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:uniformitarianism-part-of-geology` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:james-hutton-founded-uniformitarianism` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:entropy-part-of-thermodynamics` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:bounded-rationality-part-of-economics` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:herbert-simon-founded-bounded-rationality` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:ideal-type-part-of-sociology` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:max-weber-founded-ideal-type` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |

## Tally

- Adds: 7 nodes, 13 edges, 0 sources, 7 translations, 0 external links.
- Reviewed outcomes: 20 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (3):
  - `concept:division-of-labour`: C3 referent-precision, ruled 2026-07-29 (concept-wave3-v1) as a direct mirror of the concept:bureaucracy disposition (decision (108)): the identity candidate is the generic phenomenon 'separation of tasks in any system', carrying no P31, no discoverer/inventor property, and P279 parents of social behavior and human behavior. Its own article places Plato, Xenophon, Augustine and medieval Muslim scholars before Adam Smith, who appears as one of eleven named modern theorists — a phenomenon predating its proposed founder by two millennia cannot carry his founder claim. Smith's contribution is already carried by work:the-wealth-of-nations (reviewed). Unblock: a referent-precise successor concept that is Smith's own construct rather than the general phenomenon, and that independently passes concept keep-criteria C1-C4. (recheck: manual)
  - `concept:cardinality`: C3 hold from concept-wave2-v1, re-confirmed live 2026-07-29 with a sharpened reason. Q4049983 (57 sitelinks, 31 properties) encodes the ambiguity in its own description — cardinality measured either as a cardinal number or as an equivalence class — and is modelled as a kind of function (P279 = cardinal function, class function, index number) rather than as the concept of set size. The same-label alternative Q28727773 is a 0-sitelink orphan stub. Unblock: an upstream entity that decides the referent, or a §12 ruling that fixes which of the three senses the corpus carries. (recheck: manual)
  - `concept:boolean-algebra`: C3 hold from concept-wave2-v1, re-confirmed live 2026-07-29. The generator's blind referent was Boole's specific formal algebraic system; resolution returns neither that nor anything close — Q173183 is P31 = branch of mathematics (the disciplinary referent that caused the original hold) and Q4973304 is a lattice structure. The description-versus-resolution mismatch is the v2 contract's error signal. Unblock: an upstream entity for Boole's system as a bounded doctrine. Separate and undecided: whether subfield:boolean-algebra is admissible under the §12 dual criterion, which is a skeleton question, not a concept question. (recheck: manual)
- **Rejected** (3, recorded in foundry/rejections.json):
  - Charles Lyell founded uniformitarianism: Source distinguishes the roles explicitly: Hutton originated, Playfair refined, Lyell popularised. Popularisation does not meet the founded_or_formalized bar. Do not re-propose without a source that states founding.
  - evolution (as a concept node): Rejection probe, fired. C3 over-broad label colliding with subfield:evolutionary-biology and concept:natural-selection, whose Darwin edge pair it duplicates endpoint-for-endpoint. Same failure mode as the wave-2 'positivism' hold.
  - theory of relativity (as a concept node, this wave): Rejection probe, fired at generation time — the generator refused the founder relation and named the Einstein gap itself. Declined this wave because the attribution would be misrepresented, not because the concept is unwanted. Re-admissible once person:albert-einstein exists; that is a node task, not an edge task.

## §8 permanence anchors

- https://www.wikidata.org/wiki/Q483948 → https://www.wikidata.org/w/index.php?title=Q483948&oldid=2515869802
- https://en.wikipedia.org/wiki/Conservation_of_mass → https://en.wikipedia.org/w/index.php?title=Conservation_of_mass&oldid=1365127168
- https://www.wikidata.org/wiki/Q177935 → https://www.wikidata.org/w/index.php?title=Q177935&oldid=2523318691
- https://en.wikipedia.org/wiki/Cell_theory → https://en.wikipedia.org/w/index.php?title=Cell_theory&oldid=1365081375
- https://www.wikidata.org/wiki/Q1425837 → https://www.wikidata.org/w/index.php?title=Q1425837&oldid=2400656197
- https://en.wikipedia.org/wiki/Germ_theory_of_disease → https://en.wikipedia.org/w/index.php?title=Germ_theory_of_disease&oldid=1363463071
- https://www.wikidata.org/wiki/Q208650 → https://www.wikidata.org/w/index.php?title=Q208650&oldid=2520026444
- https://en.wikipedia.org/wiki/Uniformitarianism → https://en.wikipedia.org/w/index.php?title=Uniformitarianism&oldid=1340745341
- https://www.wikidata.org/wiki/Q45003 → https://www.wikidata.org/w/index.php?title=Q45003&oldid=2517117836
- https://en.wikipedia.org/wiki/Entropy → https://en.wikipedia.org/w/index.php?title=Entropy&oldid=1361126134
- https://www.wikidata.org/wiki/Q814385 → https://www.wikidata.org/w/index.php?title=Q814385&oldid=2522544066
- https://en.wikipedia.org/wiki/Bounded_rationality → https://en.wikipedia.org/w/index.php?title=Bounded_rationality&oldid=1340186617
- https://www.wikidata.org/wiki/Q1052882 → https://www.wikidata.org/w/index.php?title=Q1052882&oldid=2520685351
- https://en.wikipedia.org/wiki/Ideal_type → https://en.wikipedia.org/w/index.php?title=Ideal_type&oldid=1348687628
- https://plato.stanford.edu/entries/bounded-rationality/ → https://plato.stanford.edu/archives/sum2026/entries/bounded-rationality/
- https://plato.stanford.edu/entries/weber/ → https://plato.stanford.edu/archives/sum2026/entries/weber/
- https://www.wikidata.org/wiki/Q207449 → https://www.wikidata.org/w/index.php?title=Q207449&oldid=2515852253
- https://en.wikipedia.org/wiki/Division_of_labour → https://en.wikipedia.org/w/index.php?title=Division_of_labour&oldid=1366211289
- https://www.wikidata.org/wiki/Q4049983 → https://www.wikidata.org/w/index.php?title=Q4049983&oldid=2518872674
- https://www.wikidata.org/wiki/Q28727773 → https://www.wikidata.org/w/index.php?title=Q28727773&oldid=2455271064
- https://www.wikidata.org/wiki/Q173183 → https://www.wikidata.org/w/index.php?title=Q173183&oldid=2520160537
- https://www.wikidata.org/wiki/Q4973304 → https://www.wikidata.org/w/index.php?title=Q4973304&oldid=2509122379

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
