# QC report — `work-wave6-v1`

Session #60, Track E. Phase-2 work layer wave 6 under keep-criteria **W1–W5**. Slate of 10 scoped by the orchestrator; several candidates were only proposable because their person or concept endpoints were added earlier the same session. Generation: separated-context **Claude Sonnet 5**. Identity and verdicts: orchestrator (**Claude Opus**), live. Decision file: `foundry/decisions/work-wave6-v1.json` (authoritative).

## Outcome

**4 works + 8 canonical_work edges reviewed · 6 of 10 candidates declined · fetch-verify 12/12 PASS.**

The high decline rate is the wave-s result, not a shortfall: **W2 — a decidable upstream item — is a hard criterion, and four candidates simply do not have one.**

## ★★ The ladder gate surfaced a code-versus-policy divergence

§15.4 declares divergence between ratified policy and `lib/ladders.ts` a **stop-point**. Decision (88) opened the `canonical_work`-edge auto-`reviewed` ladder in session #48 as the 1:1 mirror of (60)/(61) — but `EDGE_AUTO_LADDER` had **no entry for the relation**, so no ladder could sanction such an edge at all.

Work waves 1–5 all predate the §15 decision-file toolchain (session #54), so **work-wave6 is the first canonical_work batch ever to run through `ladder-check`** — which is why the gap stayed invisible for four waves.

Fixed by transcription in the same change, per the rule: ladder id `canonical-work-auto-88` added to `ladderSchema` and to `EDGE_AUTO_LADDER`, and admitted to the propositional branch that already enforces supported-verdict, ≥2 independent sources, `direction_confirmed` and `identity_referent_verified`. **No policy added, nothing relaxed** — the eight edges were then held to exactly the (88) bar. Flagged for CPO visibility, mirroring decision (103).

## ★ Two declines the generator reached by reading the corpus, unprompted

- **Fracastoro, *De Contagione* (1546)** — refused on W1, citing this session-s own ruling: `edge:girolamo-fracastoro-influenced-germ-theory-of-disease` had been corrected from `founded_or_formalized` to `influenced` hours earlier, with the note that the concept is "still without a founder edge, which is the honest state". A canonical-work claim presupposes the founding the corpus had just declined to assert.
- **Weber, *Economy and Society*** — refused by quoting the note already on `edge:protestant-ethic-canonical-work-sociology`, which had itself named and rejected that book as "a posthumous, editorially-contested compilation (weaker single-item decidability)". It also observed that admitting it would make Weber the corpus-s first author with two canonical works aimed at one field.

Neither refusal was prompted. Both are correct.

## ★ Four declines QC reached on live identity — none catchable from prose

| candidate | why |
|---|---|
| Cellular Pathology (1858) | No item for the German original. Best candidate Q42187748 is the **1863 English translation**, explicitly `P31 = version, edition or translation`, **0 sitelinks**. The generator described the 1858 original — **blind-referent checksum firing.** |
| Lectures on Gas Theory | **No Wikidata item at all**, under English or German title, with or without the umlaut. |
| Clausius 1865 entropy memoir | **No item.** The generator had itself ranked this its weakest identity case and declined to invent a title — the right call. |
| Human Problem Solving (1972) | **Two competing items** for one referent (Q30078096: both authors, 1 sitelink, only 5 properties; Q131851273: one author, 0 sitelinks) — upstream duplicate modelling, exactly what /data-s provider-ID-uniqueness invariant excludes. And the enwiki title **redirects to Herbert A. Simon**: no dedicated article to ground a verdict. |

## Principia Mathematica — admitted with wrinkles recorded, not smoothed

Becomes mathematical-logic-s **fourth** co-canonical work (joining Boole, Frege, Gödel) — decision (90) permits multiplicity, W1 bounds it, and PM is a watershed text by any account.

Two identity wrinkles: `P31 = Q277759 book series`, not one of criterion 1-s enumerated work types (the three volumes exist as separate items); and `P577 = 1917` against a prose publication of 1910/1912/1913. Both judged under decision (89)-s discipline — preserve the anchor-s *purpose* (canonical identity: 35 sitelinks, P50 = both authors, exact title) rather than enforce an enumeration for its own sake. Criterion 3-s alternative covers the year.

The **Whitehead co-authorship gap** sits on the Russell edge face and holds its confidence to 0.85. Wikidata-s P50 lists both authors; `person:alfred-north-whitehead` was deliberately dropped as an honesty gap in `person-wave11-v1` the same day.

## Source-side note

The enwiki article on Brentano-s book calls him **Austrian**; the Brentano person node-s sources call him **German**. Immaterial to identity, recorded so a later reader does not mistake it for a corpus error.

## §8 permanence anchors

All 11 are MediaWiki revision permalinks. No Wayback snapshot required, none pending. Items for declined candidates are anchored too — the negative results are part of the audit trail.

| Source read | Anchor |
|---|---|
| en.wikipedia.org/wiki/Administrative_Behavior | `…&oldid=1344919009` |
| en.wikipedia.org/wiki/Annus_Mirabilis_papers | `…&oldid=1362588239` |
| en.wikipedia.org/wiki/Principia_Mathematica | `…&oldid=1356011315` |
| en.wikipedia.org/wiki/Psychology_from_an_Empirical_Standpoint | `…&oldid=1355358013` |
| www.wikidata.org/wiki/Q131851273 | `…&oldid=2377019991` |
| www.wikidata.org/wiki/Q163335 | `…&oldid=2521669172` |
| www.wikidata.org/wiki/Q30078096 | `…&oldid=2482905044` |
| www.wikidata.org/wiki/Q3020388 | `…&oldid=2511844764` |
| www.wikidata.org/wiki/Q42187748 | `…&oldid=2398649873` |
| www.wikidata.org/wiki/Q4683452 | `…&oldid=2387078693` |
| www.wikidata.org/wiki/Q7256401 | `…&oldid=2413132347` |
