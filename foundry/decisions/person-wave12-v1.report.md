# person-wave12-v1 — promotion decision report

**Decided 2026-07-30** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/person-wave12-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (15 errors) — this decision does not apply cleanly:
> - adds.nodes: node person:robert-remak already exists
> - adds.nodes: node person:james-clerk-maxwell already exists
> - adds.nodes: node person:josiah-willard-gibbs already exists
> - adds.nodes: node person:hendrik-lorentz already exists
> - adds.nodes: node person:alfred-north-whitehead already exists
> - adds.translations: translation person:robert-remak@en already exists (use translation_updates)
> - adds.translations: translation person:james-clerk-maxwell@en already exists (use translation_updates)
> - adds.translations: translation person:josiah-willard-gibbs@en already exists (use translation_updates)
> - adds.translations: translation person:hendrik-lorentz@en already exists (use translation_updates)
> - adds.translations: translation person:alfred-north-whitehead@en already exists (use translation_updates)
> - adds.edges: edge edge:robert-remak-founded-cell-theory already exists
> - adds.edges: edge edge:james-clerk-maxwell-founded-statistical-physics already exists
> - adds.edges: edge edge:josiah-willard-gibbs-founded-statistical-physics already exists
> - adds.edges: edge edge:hendrik-lorentz-influenced-theory-of-relativity already exists
> - adds.edges: edge edge:principia-mathematica-canonical-work-alfred-north-whitehead already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `person:robert-remak` | **supported** | — | ✓ | 1 (1) | Identity quote is the live Wikidata label + English description as rendered on the anchored revision; the structured proof of identity is the `identity` record (provider/external_id/verified/method), not this string. |
| `person:james-clerk-maxwell` | **supported** | — | ✓ | 1 (1) | Identity quote is the live Wikidata label + English description as rendered on the anchored revision; the structured proof of identity is the `identity` record (provider/external_id/verified/method), not this string. |
| `person:josiah-willard-gibbs` | **supported** | — | ✓ | 1 (1) | Identity quote is the live Wikidata label + English description as rendered on the anchored revision; the structured proof of identity is the `identity` record (provider/external_id/verified/method), not this string. |
| `person:hendrik-lorentz` | **supported** | — | ✓ | 1 (1) | Identity quote is the live Wikidata label + English description as rendered on the anchored revision; the structured proof of identity is the `identity` record (provider/external_id/verified/method), not this string. |
| `person:alfred-north-whitehead` | **supported** | — | ✓ | 1 (1) | Identity quote is the live Wikidata label + English description as rendered on the anchored revision; the structured proof of identity is the `identity` record (provider/external_id/verified/method), not this string. |
| `edge:robert-remak-founded-cell-theory` | **supported** | ✓ | ✓ | 3 (3) | Referent disambiguated against his grandson Robert Remak (1888–1942), the group-theory mathematician. |
| `edge:james-clerk-maxwell-founded-statistical-physics` | **supported** | ✓ | ✓ | 2 (2) |  |
| `edge:josiah-willard-gibbs-founded-statistical-physics` | **supported** | ✓ | ✓ | 2 (2) | Referent disambiguated against his father Josiah Willard Gibbs Sr. (1790–1861), the linguist/theologian. |
| `edge:hendrik-lorentz-influenced-theory-of-relativity` | **supported** | ✓ | ✓ | 3 (3) | Referent disambiguated against Konrad Lorenz the ethologist and against a same-label non-person entity. |
| `edge:principia-mathematica-canonical-work-alfred-north-whitehead` | **supported** | ✓ | ✓ | 3 (3) |  |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `person:robert-remak` | wikidata:Q62088 | ✓ | wbgetentities | 2026-07-30 | Live-resolved this session by an independent verifier context (never from memory); P570 present, so decision (70) does not engage. |
| `person:james-clerk-maxwell` | wikidata:Q9095 | ✓ | wbgetentities | 2026-07-30 | Live-resolved this session by an independent verifier context (never from memory); P570 present, so decision (70) does not engage. |
| `person:josiah-willard-gibbs` | wikidata:Q153243 | ✓ | wbgetentities | 2026-07-30 | Live-resolved this session by an independent verifier context (never from memory); P570 present, so decision (70) does not engage. |
| `person:hendrik-lorentz` | wikidata:Q41688 | ✓ | wbgetentities | 2026-07-30 | Live-resolved this session by an independent verifier context (never from memory); P570 present, so decision (70) does not engage. |
| `person:alfred-north-whitehead` | wikidata:Q183372 | ✓ | wbgetentities | 2026-07-30 | Live-resolved this session by an independent verifier context (never from memory); P570 present, so decision (70) does not engage. |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `person:robert-remak` | node add | reviewed | node-promotion-v1 |
| `person:james-clerk-maxwell` | node add | reviewed | node-promotion-v1 |
| `person:josiah-willard-gibbs` | node add | reviewed | node-promotion-v1 |
| `person:hendrik-lorentz` | node add | reviewed | node-promotion-v1 |
| `person:alfred-north-whitehead` | node add | reviewed | node-promotion-v1 |
| `edge:robert-remak-founded-cell-theory` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:james-clerk-maxwell-founded-statistical-physics` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:josiah-willard-gibbs-founded-statistical-physics` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:hendrik-lorentz-influenced-theory-of-relativity` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:principia-mathematica-canonical-work-alfred-north-whitehead` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |

## Tally

- Adds: 5 nodes, 5 edges, 0 sources, 5 translations, 0 external links.
- Reviewed outcomes: 10 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (3):
  - `person:marcus-von-plenciz`: Marcus von Plenciz → concept:germ-theory-of-disease: no edge admitted. Independent live verification returned DISPUTED and found that even `influenced` fails the ≥2 independent claim-stating floor: the one source that states a relation (enwiki Germ theory of disease) says he 'expanded upon' Fracastoro, which is the expander role the Hutton/Lyell rule excludes from a founder edge, and no second source states any relation to the theory at all. ★ Correction of this batch's own order: the generation order asserted that 'a prior wave DECLINED him an edge on expander-not-originator grounds'. That is FALSE — grep of foundry/decisions/person-wave11-v1.json and its proposals returns zero rejection, held or verdict entries for him; he appears only inside the note text of edge:girolamo-fracastoro-influenced-germ-theory-of-disease as a recorded gap. The orchestrator fabricated a precedent and fed it to a generator and a verifier. The verdict survives because it rests on live sources, not on the false premise, but the premise is recorded here as an error. Unblock: ≥2 independent claim-stating sources asserting a founding or influence relation between von Plenciz and germ theory — a contribution/priority claim about contagium animatum is not enough. (recheck: manual)
  - `person:john-mauchly`: John Mauchly and J. Presper Eckert → subfield:computer-systems: BOTH held, deliberately together. Independent verification split them on identical evidence — Mauchly REJECT (0 independent claim-stating sources at subfield grain) and Eckert SUPPORTED/influenced (3) — which the batch critic flagged as an inconsistency rather than a finding about the two men, since the generator proposed them as parallel edges at identical confidence and the sources co-credit them throughout. Admitting one and not the other would put an asymmetric pair in /data on a difference no source states. The grain is the real problem: both men demonstrably co-designed ENIAC and EDVAC, and neither claim is about the SUBFIELD of computer systems, which is the diffuse field-grain influence this corpus has repeatedly held. Unblock: create work:eniac / work:edvac (or a stored-program-architecture concept node) and record the machine-level credit through canonical_work, where the evidence is strong — that is the right shape, and it is on the next-wave slate. Also recorded from Mauchly's own refutation trail: person:john-atanasoff is named by the 1973 Honeywell v. Sperry Rand ruling and is absent from the corpus. (recheck: manual)
  - `person:nikolai-trubetzkoy`: Nikolai Trubetzkoy → subfield:phonology: held at not_enough_evidence, reversing this batch's own expectation. The note on edge:roman-jakobson-founded-phonology anticipates 'a future Trubetzkoy→phonology founder edge', and the generator proposed exactly that at confidence 0.88 — but live verification found only ONE independent claim-stating source at the phonology grain (Jakobson's own biography), below the ≥2 floor, and found that every source using explicit founder-grade language for Trubetzkoy scopes it to MORPHOPHONOLOGY, not phonology, while naming Baudouin de Courtenay as a prior claimant there. This is the corpus's own grain discipline firing against a claim its own edge note invited. Unblock: either ≥2 independent claim-stating sources at the phonology grain, or a subfield:morphophonology node (with person:baudouin-de-courtenay considered alongside), where the founder-grade sourcing actually sits. (recheck: manual)
- **Rejected** (1, recorded in foundry/rejections.json):
  - William Whewell → concept:uniformitarianism: Rejected on the role-separation rule. Four independent claim-stating sources agree on exactly one thing — Whewell COINED THE NAME — and every one of them separates that from originating the doctrine (Hutton) and from developing and popularising it (Lyell). No relation in docs/relation-taxonomy.md expresses 'coined the term for': founded_or_formalized would assert origination the sources explicitly assign to Hutton, and influenced would assert an effect on the theory's content that no source states. The corpus already declined Lyell on this same concept for the weaker-role reason; naming is weaker still. The absence stays recorded where it already is — in the note on edge:james-hutton-founded-uniformitarianism, which says so honestly. A person node with no admissible edge would be an isolated node, so none is created. Re-admit only if a term-coinage relation is ever ratified, or if sources are found crediting Whewell with the doctrine's content.

## §8 permanence anchors

- https://www.wikidata.org/wiki/Q62088 → https://www.wikidata.org/w/index.php?title=Q62088&oldid=2523976253
- https://www.wikidata.org/wiki/Q9095 → https://www.wikidata.org/w/index.php?title=Q9095&oldid=2518558494
- https://www.wikidata.org/wiki/Q153243 → https://www.wikidata.org/w/index.php?title=Q153243&oldid=2521828847
- https://www.wikidata.org/wiki/Q41688 → https://www.wikidata.org/w/index.php?title=Q41688&oldid=2522912916
- https://www.wikidata.org/wiki/Q183372 → https://www.wikidata.org/w/index.php?title=Q183372&oldid=2522970411
- https://en.wikipedia.org/wiki/Robert_Remak → https://en.wikipedia.org/w/index.php?title=Robert_Remak&oldid=1341566404
- https://en.wikipedia.org/wiki/Cell_theory → https://en.wikipedia.org/w/index.php?title=Cell_theory&oldid=1365081375
- https://en.wikipedia.org/wiki/Rudolf_Virchow → https://en.wikipedia.org/w/index.php?title=Rudolf_Virchow&oldid=1361411508
- https://en.wikipedia.org/wiki/Statistical_mechanics → https://en.wikipedia.org/w/index.php?title=Statistical_mechanics&oldid=1365220532
- https://en.wikipedia.org/wiki/James_Clerk_Maxwell → https://en.wikipedia.org/w/index.php?title=James_Clerk_Maxwell&oldid=1365632977
- https://en.wikipedia.org/wiki/Josiah_Willard_Gibbs → https://en.wikipedia.org/w/index.php?title=Josiah_Willard_Gibbs&oldid=1366423689
- https://en.wikipedia.org/wiki/Theory_of_relativity → https://en.wikipedia.org/w/index.php?title=Theory_of_relativity&oldid=1346554258
- https://mathshistory.st-andrews.ac.uk/Biographies/Lorentz/ → https://web.archive.org/web/20260419144237/https://mathshistory.st-andrews.ac.uk/Biographies/Lorentz/
- https://www.nobelprize.org/prizes/physics/1902/lorentz/biographical/ → https://web.archive.org/web/20260716151655/https://www.nobelprize.org/prizes/physics/1902/lorentz/biographical/
- https://en.wikipedia.org/wiki/Principia_Mathematica → https://en.wikipedia.org/w/index.php?title=Principia_Mathematica&oldid=1356011315
- https://plato.stanford.edu/entries/principia-mathematica/ → https://plato.stanford.edu/archives/sum2026/entries/principia-mathematica/
- https://en.wikipedia.org/wiki/Alfred_North_Whitehead → https://en.wikipedia.org/w/index.php?title=Alfred_North_Whitehead&oldid=1361815510
- https://mathshistory.st-andrews.ac.uk/Biographies/Lorentz/ — [SPN-FAILED] fresh save did not materialize; using 102d-old snapshot
- https://www.nobelprize.org/prizes/physics/1902/lorentz/biographical/ — [SPN-FAILED] fresh save did not materialize; using 14d-old snapshot

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
