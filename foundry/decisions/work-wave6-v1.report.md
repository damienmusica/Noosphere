# work-wave6-v1 — promotion decision report

**Decided 2026-07-29** · QC by Claude Opus (`claude-opus-5`) · generated from `foundry/decisions/work-wave6-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (16 errors) — this decision does not apply cleanly:
> - adds.nodes: node work:on-the-electrodynamics-of-moving-bodies already exists
> - adds.nodes: node work:psychology-from-an-empirical-standpoint already exists
> - adds.nodes: node work:principia-mathematica already exists
> - adds.nodes: node work:administrative-behavior already exists
> - adds.translations: translation work:on-the-electrodynamics-of-moving-bodies@en already exists (use translation_updates)
> - adds.translations: translation work:psychology-from-an-empirical-standpoint@en already exists (use translation_updates)
> - adds.translations: translation work:principia-mathematica@en already exists (use translation_updates)
> - adds.translations: translation work:administrative-behavior@en already exists (use translation_updates)
> - adds.edges: edge edge:on-the-electrodynamics-of-moving-bodies-canonical-work-theory-of-relativity already exists
> - adds.edges: edge edge:on-the-electrodynamics-of-moving-bodies-canonical-work-albert-einstein already exists
> - adds.edges: edge edge:psychology-from-an-empirical-standpoint-canonical-work-intentionality already exists
> - adds.edges: edge edge:psychology-from-an-empirical-standpoint-canonical-work-franz-brentano already exists
> - adds.edges: edge edge:principia-mathematica-canonical-work-mathematical-logic already exists
> - adds.edges: edge edge:principia-mathematica-canonical-work-bertrand-russell already exists
> - adds.edges: edge edge:administrative-behavior-canonical-work-bounded-rationality already exists
> - adds.edges: edge edge:administrative-behavior-canonical-work-herbert-simon already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `work:on-the-electrodynamics-of-moving-bodies` | **supported** | — | ✓ | 2 (2) | W2–W4 all pass on live signals: Q3020388, P31 = Q13442814 scholarly article, P50 = Q937 Einstein, P577 = 1905, P1433 = Q275655 Annalen der Physik, 9 sitelinks, 26 properties. Sole search hit — no homonym risk. The cleanest work identity in the batch. |
| `work:psychology-from-an-empirical-standpoint` | **supported** | — | ✓ | 2 (2) | Q7256401, P31 = Q7725634 literary work, P50 = Q57196 Brentano, 4 sitelinks, 11 properties. P577 is ABSENT — criterion 3's alternative applies (an uncontested publication year confirmed live from a sitelinked source), and 1874 is stated in the article lead and in the Brentano article both. This is the exact shape decision (89) revised the criteria for (the Arrow case). Criterion 4(a) satisfied by the sitelinks. |
| `work:principia-mathematica` | **supported** | — | ✓ | 2 (2) | ★ Two wrinkles, both recorded rather than smoothed. (1) P31 = Q277759 'book series', which is not one of criterion 1's enumerated work types. Judged to satisfy the criterion's stated guard — 'the referent is a work, not a person or concept' — and the typing reflects the three-volume publication, whose volumes exist as separate items (Q62092387/Q62092410/Q62092422). Per decision (89)'s discipline the anchor's purpose (canonical identity) is what matters, not an arbitrary enumeration; 35 sitelinks and P50 = both authors make identity fully decidable. (2) P577 = 1917 conflicts with the prose publication years 1910/1912/1913 — an edition date. Criterion 3's alternative applies. Both wrinkles are the kind that would have been invisible without live resolution. |
| `work:administrative-behavior` | **supported** | — | ✓ | 2 (2) | Q4683452, P31 = Q7725634 literary work, P50 = Q181529 Simon, P577 = 1947, 4 sitelinks, 15 properties, plus OCLC and LC Class in the article infobox. Disambiguated from three journal-article homonyms and a nursing-journal item returned by the same search. The quote truncates at 'Herbert A.' because the sentence-splitter treats the initial as a stop; fetch-verify confirms the string verbatim. |
| `edge:on-the-electrodynamics-of-moving-bodies-canonical-work-theory-of-relativity` | **supported** | ✓ | ✓ | 2 (2) | Direction fixed by the taxonomy — the work is always the source. Both endpoints reviewed; the author leg's P50 matches the person node's verified QID, which is the identity check the canonical_work ladder turns on. Adversarial check: no rival authorship or field attribution surfaced for any of the four works. |
| `edge:on-the-electrodynamics-of-moving-bodies-canonical-work-albert-einstein` | **supported** | ✓ | ✓ | 2 (2) | Direction fixed by the taxonomy — the work is always the source. Both endpoints reviewed; the author leg's P50 matches the person node's verified QID, which is the identity check the canonical_work ladder turns on. Adversarial check: no rival authorship or field attribution surfaced for any of the four works. |
| `edge:psychology-from-an-empirical-standpoint-canonical-work-intentionality` | **supported** | ✓ | ✓ | 2 (2) | Direction fixed by the taxonomy — the work is always the source. Both endpoints reviewed; the author leg's P50 matches the person node's verified QID, which is the identity check the canonical_work ladder turns on. Adversarial check: no rival authorship or field attribution surfaced for any of the four works. |
| `edge:psychology-from-an-empirical-standpoint-canonical-work-franz-brentano` | **supported** | ✓ | ✓ | 2 (2) | Direction fixed by the taxonomy — the work is always the source. Both endpoints reviewed; the author leg's P50 matches the person node's verified QID, which is the identity check the canonical_work ladder turns on. Adversarial check: no rival authorship or field attribution surfaced for any of the four works. |
| `edge:principia-mathematica-canonical-work-mathematical-logic` | **supported** | ✓ | ✓ | 2 (2) | Direction fixed by the taxonomy — the work is always the source. Both endpoints reviewed; the author leg's P50 matches the person node's verified QID, which is the identity check the canonical_work ladder turns on. Adversarial check: no rival authorship or field attribution surfaced for any of the four works. |
| `edge:principia-mathematica-canonical-work-bertrand-russell` | **supported** | ✓ | ✓ | 2 (2) | Direction fixed by the taxonomy — the work is always the source. Both endpoints reviewed; the author leg's P50 matches the person node's verified QID, which is the identity check the canonical_work ladder turns on. Adversarial check: no rival authorship or field attribution surfaced for any of the four works. |
| `edge:administrative-behavior-canonical-work-bounded-rationality` | **supported** | ✓ | ✓ | 2 (2) | Direction fixed by the taxonomy — the work is always the source. Both endpoints reviewed; the author leg's P50 matches the person node's verified QID, which is the identity check the canonical_work ladder turns on. Adversarial check: no rival authorship or field attribution surfaced for any of the four works. |
| `edge:administrative-behavior-canonical-work-herbert-simon` | **supported** | ✓ | ✓ | 2 (2) | Direction fixed by the taxonomy — the work is always the source. Both endpoints reviewed; the author leg's P50 matches the person node's verified QID, which is the identity check the canonical_work ladder turns on. Adversarial check: no rival authorship or field attribution surfaced for any of the four works. |
| `work:cellular-pathology` | **not_enough_evidence** | — | ✗ | 1 (1) | ★ Declined on a description-versus-resolution mismatch — the v2 blind-referent checksum firing on a work wave. The generator described "Rudolf Virchow's 1858 treatise, German original 'Die Cellularpathologie...' (Berlin: August Hirschwald, 1858)". No Wikidata item exists for that German original: searching the German title returns nothing, and the best English-title candidate is Q42187748 'Cellular pathology as based upon physiological...' — explicitly typed P31 = Q3331189 'version, edition or translation' (plus Q17537576 creative work), dated 1863, i.e. the English translation, with **0 sitelinks**. Criterion 1 wants a work, not an edition; criterion 4(a) fails on sitelinks; and the referent the generator meant is not the referent that resolved. W2 fail. Held out honestly rather than anchored on a translation. |
| `work:lectures-on-gas-theory` | **not_enough_evidence** | — | ✗ | 0 (0) | Declined, W2 fail: no Wikidata item exists for Boltzmann's Vorlesungen über Gastheorie. Searched under the English title and under the German original (both with and without the umlaut) — zero hits in every form. The generator flagged the two-part 1896/1898 publication as a structural risk; the actual blocker is simpler and harder, which is that the work has no upstream item at all. Mirrors the Vernadsky Biosphere and Snow honesty-gap drops. |
| `work:clausius-entropy-memoir-1865` | **not_enough_evidence** | — | ✗ | 0 (0) | Declined, W2 fail: no Wikidata item for Clausius's 1865 memoir. The generator had itself ranked this the batch's weakest identity case, could not name the German title from memory, and deliberately wrote a descriptive rendering rather than assert false precision — the right call, and it also declined the order's suggested 'Theory of Heat' framing on the ground that the name belongs to a later compilation with weaker single-item decidability. Searching the actual paper title (Über verschiedene für die Anwendung bequeme Formen der Hauptgleichungen der mechanischen Wärmetheorie) returns nothing. concept:entropy therefore keeps its founder edge but gains no canonical work. |
| `work:human-problem-solving` | **not_enough_evidence** | — | ✗ | 2 (2) | ★ Declined on a duplicate-plus-thin identity, caught only by live checks. Two competing Wikidata items exist for the same 1972 book: Q30078096 (P31 literary work, P50 = both Newell and Simon, P577 = 1972, 1 sitelink, but only **5 properties**) and Q131851273 (P31 written work, P50 = Newell only, 0 sitelinks, 11 properties). Upstream duplicate modeling of one referent is precisely the failure mode the /data provider-ID-uniqueness invariant exists to keep out. Worse, the enwiki title 'Human Problem Solving' is a **redirect to Herbert A. Simon** — there is no dedicated article, so the claim-stating source base for a canonical_work verdict is absent. Not admitted; re-checkable once upstream merges the items or an article exists. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `work:on-the-electrodynamics-of-moving-bodies` | wikidata:Q3020388 | ✓ | wbgetentities | 2026-07-29 |  |
| `work:psychology-from-an-empirical-standpoint` | wikidata:Q7256401 | ✓ | wbgetentities | 2026-07-29 |  |
| `work:principia-mathematica` | wikidata:Q163335 | ✓ | wbgetentities | 2026-07-29 |  |
| `work:administrative-behavior` | wikidata:Q4683452 | ✓ | wbgetentities | 2026-07-29 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `work:on-the-electrodynamics-of-moving-bodies` | node add | reviewed | node-promotion-v1 |
| `work:psychology-from-an-empirical-standpoint` | node add | reviewed | node-promotion-v1 |
| `work:principia-mathematica` | node add | reviewed | node-promotion-v1 |
| `work:administrative-behavior` | node add | reviewed | node-promotion-v1 |
| `edge:on-the-electrodynamics-of-moving-bodies-canonical-work-theory-of-relativity` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:on-the-electrodynamics-of-moving-bodies-canonical-work-albert-einstein` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:psychology-from-an-empirical-standpoint-canonical-work-intentionality` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:psychology-from-an-empirical-standpoint-canonical-work-franz-brentano` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:principia-mathematica-canonical-work-mathematical-logic` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:principia-mathematica-canonical-work-bertrand-russell` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:administrative-behavior-canonical-work-bounded-rationality` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:administrative-behavior-canonical-work-herbert-simon` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |

## Tally

- Adds: 4 nodes, 8 edges, 0 sources, 4 translations, 0 external links.
- Reviewed outcomes: 12 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Rejected** (6, recorded in foundry/rejections.json):
  - Cellular Pathology (Virchow, 1858): W2 fail. No upstream item for the German original; the only candidate is the 1863 English translation, typed 'version, edition or translation' with 0 sitelinks. Description-versus-resolution mismatch. Do not re-propose against the translation.
  - Lectures on Gas Theory (Boltzmann, 1896–98): W2 fail. No Wikidata item exists under the English or German title in any spelling. Honest gap.
  - Clausius's 1865 entropy memoir: W2 fail. No Wikidata item. The generator ranked this its own weakest identity case and declined to invent a title.
  - Human Problem Solving (Newell & Simon, 1972): Duplicate upstream modeling (two competing items for one referent, neither substantively populated) plus no dedicated enwiki article — the title redirects to Herbert A. Simon. Re-checkable when upstream merges or an article exists.
  - De Contagione et Contagiosis Morbis (Fracastoro, 1546): Declined by the GENERATOR on W1, citing this session's own ruling: edge:girolamo-fracastoro-influenced-germ-theory-of-disease was deliberately corrected from founded_or_formalized to influenced hours earlier, with the note that the concept is 'still without a founder edge, which is the honest state'. A canonical_work claim presupposes the founding status the corpus had just declined to assert. Recorded because the generator reached this by reading the corpus, not by being told.
  - Economy and Society (Weber): Declined by the GENERATOR, citing the note already on edge:protestant-ethic-canonical-work-sociology, which had itself named and rejected Economy and Society as 'a posthumous, editorially-contested compilation (weaker single-item decidability)'. It also observed that admitting it would make Weber the corpus's first author with two canonical works aimed at one field. Recorded for the same reason as above.

## §8 permanence anchors

- https://www.wikidata.org/wiki/Q3020388 → https://www.wikidata.org/w/index.php?title=Q3020388&oldid=2511844764
- https://en.wikipedia.org/wiki/Annus_Mirabilis_papers → https://en.wikipedia.org/w/index.php?title=Annus_mirabilis_papers&oldid=1362588239
- https://www.wikidata.org/wiki/Q7256401 → https://www.wikidata.org/w/index.php?title=Q7256401&oldid=2413132347
- https://en.wikipedia.org/wiki/Psychology_from_an_Empirical_Standpoint → https://en.wikipedia.org/w/index.php?title=Psychology_from_an_Empirical_Standpoint&oldid=1355358013
- https://www.wikidata.org/wiki/Q163335 → https://www.wikidata.org/w/index.php?title=Q163335&oldid=2521669172
- https://en.wikipedia.org/wiki/Principia_Mathematica → https://en.wikipedia.org/w/index.php?title=Principia_Mathematica&oldid=1356011315
- https://www.wikidata.org/wiki/Q4683452 → https://www.wikidata.org/w/index.php?title=Q4683452&oldid=2387078693
- https://en.wikipedia.org/wiki/Administrative_Behavior → https://en.wikipedia.org/w/index.php?title=Administrative_Behavior&oldid=1344919009
- https://www.wikidata.org/wiki/Q42187748 → https://www.wikidata.org/w/index.php?title=Q42187748&oldid=2398649873
- https://www.wikidata.org/wiki/Q30078096 → https://www.wikidata.org/w/index.php?title=Q30078096&oldid=2482905044
- https://www.wikidata.org/wiki/Q131851273 → https://www.wikidata.org/w/index.php?title=Q131851273&oldid=2377019991

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
