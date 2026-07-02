# philosophy-identity-anchor-v1 — report

**First application of node-policy v1.4 (alternative identity anchor for QID-less-but-recognized
fields), decision (93), CPO-ratified in-session 2026-07-02.** Re-adjudication of the two nodes the
session #50 backlog re-adjudication (decision (92)) surfaced to the CPO:
`subfield:philosophy-of-race` and `subfield:philosophy-of-cognitive-science`.

No generation occurred (governance + re-adjudication of existing `/data` nodes; separated-context
generation not required — the nodes were generated in the 2026-06-10 philosophy skeleton batch and
have carried `external_ids.philpapers` since). All verification below was live, orchestrator-direct,
2026-07-02.

## Policy basis

Node-policy v1 requires a resolver-verified Wikidata QID as the identity anchor. Per the decision
(89) discipline (challenge → research the rule's *actual* safety value → revise only what research
supports), the QID requirement was decomposed into its four safety functions and each was shown to be
covered equal-or-better by the alternative anchor set (see docs/data-foundry.md §8, "Node identity
anchor — alternative anchor for QID-less-but-recognized fields"). The clause is conservative by
construction: it requires a category ID in a **CPO-ratified expert disciplinary taxonomy** (currently
PhilPapers only) plus ≥2 additional independent authorities — the eight remaining skeleton-era
QID-less honest gaps satisfy neither and stay parked.

## Clause-4 Wikidata re-check (promotion-time, 2026-07-02)

`wbsearchentities` live re-run at promotion time, per v1.4 clause 4:

- **philosophy of race** — no discipline entity; only a scientific-article item (Q30374596,
  "Philosophy of race meets population genetics"). Gap confirmed.
- **philosophy of cognitive science** — zero hits; no discipline entity. Gap confirmed.

(2026-06 findings re-confirmed: upstream carries only journal/article items for both.)

## Alternative-anchor verification (all live, with §8 permanence anchors)

### `subfield:philosophy-of-race` — 4 independent authorities

| Anchor | Verification | Permanence anchor |
|---|---|---|
| PhilPapers category `philosophy-of-race` (`external_ids.philpapers`) | category page live (bot-blocked domain → §8 existing-snapshot path) | [snapshot 2025-10-05](https://web.archive.org/web/20251005161535/https://philpapers.org/browse/philosophy-of-race) |
| SEP entry "Race" | HTTP 200 live | [SPN fresh 2026-07-02](https://web.archive.org/web/20260701233558/https://plato.stanford.edu/entries/race/) |
| *Critical Philosophy of Race* (dedicated peer-reviewed journal, Penn State University Press) | Crossref journals registry | ISSN 2165-8684 / 2165-8692 (structured identifier) |
| *The Oxford Handbook of Philosophy and Race* (OUP, 2017, ed. book) | Crossref works registry | DOI 10.1093/oxfordhb/9780190236953.001.0001 (structured identifier) |

### `subfield:philosophy-of-cognitive-science` — 3 independent authorities (honest count)

| Anchor | Verification | Permanence anchor |
|---|---|---|
| PhilPapers category `philosophy-of-cognitive-science` (`external_ids.philpapers`) | category page live (bot-blocked domain → §8 existing-snapshot path) | [snapshot 2026-02-01](https://web.archive.org/web/20260201175903/https://philpapers.org/browse/philosophy-of-cognitive-science) |
| SEP entry "Cognitive Science" (SEP is a philosophy encyclopedia; this entry is the philosophical treatment of the field) | HTTP 200 live | [SPN fresh 2026-07-02](https://web.archive.org/web/20260701233626/https://plato.stanford.edu/entries/cognitive-science/) |
| *The Oxford Handbook of Philosophy of Cognitive Science* (OUP, 2012) | Crossref works registry | DOI 10.1093/oxfordhb/9780195309799.001.0001 (structured identifier) |

**Honesty note:** no exact-title dedicated journal exists for philosophy-of-cognitive-science
(adjacent journals — *Philosophical Psychology*, *Mind & Language* — were not counted). The v1.4 bar
(taxonomy ID + ≥2 additional authorities) is met at 3; recorded as a three-authority anchor, not
padded to four.

**Referent check (v1.4 clause 3):** both referents are the *academic subfield* (study-of), not a
journal, era, or doctrine — the journal-vs-discipline trap that rejected e.g.
`computational-cognitive-science` (journal Q96319640) does not fire here; the PhilPapers category is
a research-area classification by construction and the SEP/handbook treatments confirm a
field-of-study referent.

## Promoted (2 nodes + 2 edges → `reviewed`)

- `subfield:philosophy-of-race` — `proposed → reviewed` (v1.4 alternative anchor, 4 authorities).
- `subfield:philosophy-of-cognitive-science` — `proposed → reviewed` (v1.4 alternative anchor, 3
  authorities).
- `edge:philosophy-of-race-part-of-philosophy` — `proposed → reviewed`. The 2026-06 hold was the
  endpoint status cap, not a grounding gap; grounding = UDC/LCC (original) + PhilPapers
  category-tree residency (added, `source:philpapers`).
- `edge:philosophy-of-cognitive-science-part-of-philosophy` — `proposed → reviewed`. Same cap
  release; grounding = UDC class-1 anchoring + node-level v1.1 resolution record (PR #25) +
  PhilPapers category-tree residency (added).

Both nodes keep `indexable: false` — the structural promotion is `status: reviewed`; indexability is
earned separately by a reviewed editorial summary (decision (92) posture: indexable ⊥ explorability).
Both nodes are fully graph-explorable now.

## Registry change

`source:philpapers` registered in `data/sources.json` with license metadata (reference-only index
citation, no text cached) — required by the sources invariant before any edge cites it.

## Ledger

Nodes 574 total — `reviewed` 559→**561**, `proposed` 13→**11**. Edges 706 total — 2 `proposed →
reviewed`. Sources 23→**24** (+philpapers). Schema, taxonomy, translations unchanged. The skeleton-era
QID-less parked set drops from 10 to 8 (all honest upstream gaps, no ratified taxonomy standing);
the rule-silent modeling trio (social-philosophy · modern-philosophy · esotericism-and-theosophy)
is untouched by this batch.
