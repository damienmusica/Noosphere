# endpoint-closure-wave13-v1 — promotion decision report

**Decided 2026-07-31** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/endpoint-closure-wave13-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (9 errors) — this decision does not apply cleanly:
> - adds.nodes: node subfield:morphophonology already exists
> - adds.nodes: node person:nikolai-trubetzkoy already exists
> - adds.nodes: node person:antonie-van-leeuwenhoek already exists
> - adds.translations: translation subfield:morphophonology@en already exists (use translation_updates)
> - adds.translations: translation person:nikolai-trubetzkoy@en already exists (use translation_updates)
> - adds.translations: translation person:antonie-van-leeuwenhoek@en already exists (use translation_updates)
> - adds.edges: edge edge:morphophonology-part-of-linguistics already exists
> - adds.edges: edge edge:nikolai-trubetzkoy-founded-phonology already exists
> - adds.edges: edge edge:antonie-van-leeuwenhoek-founded-microbiology already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `edge:morphophonology-part-of-linguistics` | **supported** | ✓ | ✓ | 2 (2) | Placement corrected at verification from the generator's cross-listing proposal to a single linguistics parent; the reasoning is on the edge note. |
| `edge:nikolai-trubetzkoy-founded-phonology` | **supported** | ✓ | ✓ | 2 (2) | Reverses the person-wave12-v1 NEI hold on its own first unblock branch. No coinage risk: the term phonology predates him and the coinage attributed to him is 'Sprachbund'. Expander framing exists in Oxford Bibliographies ('extension of Saussurean insights') and Britannica designates no founder at all — both recorded on the edge, neither decisive against four claim-stating sources. |
| `edge:antonie-van-leeuwenhoek-founded-microbiology` | **supported** | ✓ | ✓ | 2 (2) | The named refutation target — that sources credit only microscopy and first observation — was tested against the sources and failed; two peer-reviewed articles state the field-grain epithet flatly. Journal namesake Q15762938 excluded at identity time. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `subfield:morphophonology` | wikidata:Q661093 | ✓ | wbgetentities | 2026-07-30 |  |
| `person:nikolai-trubetzkoy` | wikidata:Q159491 | ✓ | wbgetentities | 2026-07-30 |  |
| `person:antonie-van-leeuwenhoek` | wikidata:Q43522 | ✓ | wbgetentities | 2026-07-30 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `subfield:morphophonology` | node add | reviewed | node-promotion-v1 |
| `person:nikolai-trubetzkoy` | node add | reviewed | node-promotion-v1 |
| `person:antonie-van-leeuwenhoek` | node add | reviewed | node-promotion-v1 |
| `edge:morphophonology-part-of-linguistics` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `edge:nikolai-trubetzkoy-founded-phonology` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:antonie-van-leeuwenhoek-founded-microbiology` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:roman-jakobson-founded-phonology` | edge reviewed→reviewed | reviewed | — |
| `edge:louis-pasteur-founded-microbiology` | edge reviewed→reviewed | reviewed | — |

## Tally

- Adds: 3 nodes, 3 edges, 0 sources, 3 translations, 0 external links.
- Reviewed outcomes: 6 adds + 0 promotions (all ladder-sanctioned above).
- metadata flips: 2 (set_indexable/set_note).
- Editorial summary updates: 0.
- **Held** (4):
  - `subfield:process-philosophy`: REJECTED as a `subfield` node, and the founder edge it existed for returned NEI. Two independent failures. ⑴ NODE TYPE AND PARENT: the ratified philosophy authority (PhilPapers, decision (102) registry) files it `Metaphysics > Global Metaphysical Theories > Process Philosophy`, siblings Idealism / Dualism / Logical Atomism — decision (73) structural rule 5's second branch verbatim (bounded doctrine/position/theory → `concept` node), not a field or tradition; PhilPapers' own 'Philosophical Traditions' tree does not contain it. Anchor (live philpapers.org is Cloudflare-403): http://web.archive.org/web/20260218155005/https://philpapers.org/browse/process-philosophy. ⑵ DUAL CRITERION limb (a) fails: no LCC philosophy division (lcco_b.pdf downloaded and extracted; id.loc.gov returns only Z7128.P88, a bibliography cutter), no UDC division (class 14 expands only to 140/141), and Wikidata Q2114360 carries no P279 at all. SEP's own entry negates the school reading: 'process philosophy is a complex and highly diversified field that is not tied to any school, method, position, or even paradigmatic notion of process.' Recorded against, not hidden: LCSH sh85107138 gives skos:broader = Philosophy, and the corpus's existing sibling schools (pragmatism, existentialism, phenomenology) are labelled 'grandfathered' by decision (73) — they show the shape exists, not that a new candidate clears the gate. UNBLOCK: propose it as `concept:process-philosophy` `part_of subfield:metaphysics`, and only when a documented edge demands the endpoint (rule 5 makes concept nodes edge-demand-driven) — which means the Whitehead claim below must clear first. (recheck: manual)
  - `person:alfred-north-whitehead`: person:alfred-north-whitehead → founded_or_formalized → process philosophy: NOT ENOUGH EVIDENCE, and the corpus's own summary of him is what the sources contradict. SEP's Whitehead entry states twice that no school formed around him — 'Whitehead did not, however, inspire any school of thought during his lifetime' and 'Whitehead's philosophical views posthumously inspired the movement of process philosophy'. SEP's process-philosophy entry names a different founder outright: 'it is the Greek theoretician Heraclitus of Ephesus … who is commonly recognized as the founder of the process approach', and places Whitehead downstream of Hegel. INVERTED COINAGE RISK: Whitehead called his own position 'philosophy of organism'; the label 'process philosophy' was applied to him by others — the mirror image of the Whewell rejection rather than a repeat of it. What the sources DO support is narrower and plural: REP, 'the movement inaugurated by Whitehead and extended by Hartshorne', and IEP's section heading 'The Whitehead-Hartshorne Tradition'. UNBLOCK: a node at the Whitehead-Hartshorne grain (with person:charles-hartshorne considered alongside under record-not-resolve), or ≥2 independent claim-stating sources putting him at founder grade for process philosophy as such. ★ SEPARATE AND LIVE: the reviewed, indexable en summary of this node asserts 'He created the philosophical school known as process philosophy' — a faithful quote of enwiki, contradicted by SEP. That is an editorial matter, not an edge matter, and is left for an editorial pass rather than rewritten inside a node/edge batch. (recheck: manual)
  - `person:baudouin-de-courtenay`: person:baudouin-de-courtenay → influenced → subfield:morphophonology: REJECTED at that target. Every reference work that treats morphophonology as its subject is silent about him — enwiki Morphophonology (oldid 1360947317, full wikitext swept for Baudouin/Courtenay) mentions him ZERO times and traces the origins to Jakobson and to Chomsky & Halle. ★ A DIFFERENT TARGET IS SUPPORTED and is the honest unblock: person:baudouin-de-courtenay → influenced → subfield:phonology, on Britannica ('linguist who regarded language sounds as structural entities, rather than mere physical phenomena, and thus anticipated the modern linguistic concern with language structure'; 'Views expressed in his major work, Versuch einer Theorie phonetischer Alternationen (1895) … have become a part of modern linguistic science') plus Honeybone in the Oxford Handbook of Historical Phonology, which names Kruszewski (1881) and Baudouin de Courtenay (1895) as 'the earliest signs (in the modern era) of work which focused on synchronic phonological' patterning. NOT admitted in this batch for two stated reasons rather than one: it is a claim surfaced by verification rather than proposed and independently checked, and only one of its two sources has a provider registered in data/sources.json. UNBLOCK: run that edge through a normal generation/verification pass, and either register the second provider or find a registered-source equivalent. (recheck: manual)
  - `edge:nikolai-trubetzkoy-founded-morphophonology`: DISPUTED — the evidence genuinely splits between founding and coinage, so clause-6 v2 stops it. Founding language exists: the Great Soviet Encyclopedia via a mirror ('N. S. Trubetskoi, the founder of morphophonemics, formulated the discipline's three main tasks') and Tiffou ('Il revient à N. Trubetzkoy (1957) d'avoir posé les bases de la morphophonologie'). Coinage language exists just as clearly: dewiki Morphonologie ('Der Begriff \u201aMorphonologie\u2018 wurde 1929 von … Trubetzkoy … vorgeschlagen'), its Trubetzkoy biography ('1929 schlug er den Begriff Morphonologie vor'), and Basbøll 2015, which credits him only with the term's use. The venues also differ in weight — the founding-grade citations come from an encyclopedia mirror and a PDF scan host, the coinage citations from the reference works themselves. Under the rule that killed the Whewell candidate, coining a term is not founding; under record-not-resolve, a real split is recorded rather than adjudicated. Held in foundry rather than written at `proposed`, because the founding-grade sources are not ones this corpus would cite. UNBLOCK: ≥2 independent claim-stating sources at founder grade from providers this corpus can cite, OR a ruling that the coinage reading is settled, in which case this becomes a permanent rejection. (recheck: manual)
- **Held entries closed** (1, dropped from foundry/held.json):
  - `person:nikolai-trubetzkoy`: person-wave12-v1 held him at NEI with the unblock clause 'either ≥2 independent claim-stating sources at the phonology grain, or a subfield:morphophonology node (with person:baudouin-de-courtenay considered alongside)'. Resolved on the FIRST branch: four claim-stating sources at the phonology grain were found live (Oxford Bibliographies, University of Vienna '650 plus', Honeybone in Key Thinkers in Linguistics and the Philosophy of Language, enwiki Roman Jakobson), two of them from registered providers. edge:nikolai-trubetzkoy-founded-phonology is admitted at reviewed. The second branch was also built (subfield:morphophonology exists as of this batch) but did NOT carry him — the morphophonology-grained founder claim came back disputed and is held separately. Recorded plainly: wave 12's verifier found one such source and this pass found four, which is a difference between two search paths, not a change in the world.

## §8 permanence anchors

- https://www.britannica.com/science/morphophonemics → https://web.archive.org/web/20251108171615/https://www.britannica.com/science/morphophonemics
- https://www.britannica.com/science/morphophonemics → http://web.archive.org/web/20251108171615/https://www.britannica.com/science/morphophonemics
- https://en.wikipedia.org/wiki/Morphophonology → https://en.wikipedia.org/w/index.php?title=Morphophonology&oldid=1360947317
- https://www.oxfordbibliographies.com/display/document/obo-9780199772810/obo-9780199772810-0179.xml → https://web.archive.org/web/20250821032504/https://www.oxfordbibliographies.com/display/document/obo-9780199772810/obo-9780199772810-0179.xml
- https://en.wikipedia.org/wiki/Roman_Jakobson → https://en.wikipedia.org/w/index.php?title=Roman_Jakobson&oldid=1365161259
- https://www.britannica.com/biography/Antonie-van-Leeuwenhoek → https://web.archive.org/web/20260708201029/https://www.britannica.com/biography/Antonie-van-Leeuwenhoek
- https://www.britannica.com/biography/Antonie-van-Leeuwenhoek → https://web.archive.org/web/20250101123931/https://www.britannica.com/biography/Antonie-van-Leeuwenhoek
- https://en.wikipedia.org/wiki/Microbiology → https://en.wikipedia.org/w/index.php?title=Microbiology&oldid=1358572173
- https://www.britannica.com/science/morphophonemics — [SPN-FAILED] fresh save did not materialize; using 264d-old snapshot
- https://www.oxfordbibliographies.com/display/document/obo-9780199772810/obo-9780199772810-0179.xml — [SPN-FAILED] fresh save did not materialize; using 343d-old snapshot
- https://www.britannica.com/biography/Antonie-van-Leeuwenhoek — [SPN-FAILED] fresh save did not materialize; using 22d-old snapshot

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
