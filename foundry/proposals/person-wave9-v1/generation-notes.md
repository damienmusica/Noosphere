# Generation notes — person-wave9-v1

Batch: 7 canonical "father of X" founders of already-`reviewed` disciplines with
no founder edge yet (order-specified roster; two of the seven — William Morris
Davis and Georgius Agricola — were explicitly flagged in the person-wave8-v1
report as deferred candidates, now picked up here). Proposer: Claude Sonnet,
`claude-sonnet-5`, 2026-07-01. All 7 persons are **deceased**. All QIDs below
are **generator best-guesses, unverified** — every node carries
`_qid_unverified: true` and must be live resolver-confirmed by the orchestrator
(P31=Q5 + P569 + P570 + label/sitelink) before promotion. Prior waves measured
~100% generator-guessed-QID hallucination rate (10/10 in wave 8); treat every
QID here as wrong until proven otherwise.

**Target-node verification:** all 7 target nodes (`subfield:anatomy`,
`subfield:systematics`, `subfield:geology`, `subfield:developmental-biology`,
`subfield:geomorphology`, `subfield:oceanography`, `subfield:mineralogy`) were
confirmed present and `status: "reviewed"` / `indexable: true` in
`data/nodes.json` before generation. None of the 7 persons in this order exist
already in `data/nodes.json` (checked directly, including a case-insensitive
scan for "vesalius", "linnaeus", "hutton", "von-baer"/"von Baer",
"morris-davis", "fontaine-maury", "agricola") — no reconciliation to existing
IDs was needed; all 7 are new proposals.

**Source-registry check:** confirmed `source:wikipedia` exists in
`data/sources.json`. For every row in this batch, the two independent
claim-stating articles named in each edge `note` are both Wikipedia articles
(field article + biography article), encoded under the single
`evidence: ["source:wikipedia"]` entry per the session #34 precedent (one
registered source ID can back two distinct claim-anchors named in the note).
No specialist source (SEP/MacTutor/IEP/NobelPrize/Oxford Bibliographies)
plausibly applies to any of these 7 rows — none of these founders are
philosophers, mathematicians, or Nobel laureates; flagging honestly rather
than forcing a weak specialist-source citation.

---

## 1. Andreas Vesalius -> subfield:anatomy

- QID guess (unverified): `Q57235`
- Sources: `source:wikipedia` (biography article: "considered the founder of
  modern human anatomy", 'De Humani Corporis Fabrica', 1543; field article:
  credits Vesalius's dissection-based work as founding modern anatomy)
- Record-not-resolve: none needed — Galen's antiquity-era anatomy (animal
  dissection-based, due to Roman-era prohibitions on human dissection) is a
  superseded predecessor tradition explicitly corrected by Vesalius, not a
  rival founder of the modern discipline. Not flagged ambiguous.
- Uncertainty for orchestrator: identity unambiguous (Vesalius is a
  well-known, well-disambiguated Renaissance anatomist); confirm QID only.

## 2. Carl Linnaeus -> subfield:systematics

- QID guess (unverified): `Q1043`
- Sources: `source:wikipedia` (biography article: "father of modern
  taxonomy", binomial nomenclature formalized in 'Systema Naturae', 1735;
  field article: credits Linnaeus's classification system as the
  methodological foundation)
- Record-not-resolve: systematics broadened substantially beyond Linnaean
  rank-based taxonomy in the 20th century, most consequentially via Willi
  Hennig's cladistics/phylogenetic systematics (grouping by shared derived
  characters and evolutionary descent), now the dominant methodological
  paradigm. This edge records Linnaeus's foundational contribution (naming
  and hierarchical classification), not a claim that modern systematics is
  unchanged from his framework. Node flagged `ambiguous: true`.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 3. James Hutton -> subfield:geology

- QID guess (unverified): `Q193621`
- Sources: `source:wikipedia` (biography article: "often referred to as the
  father of modern geology", theory of uniformitarianism in 'Theory of the
  Earth', 1788; field article: credits Hutton's uniformitarian theory as
  foundational)
- Record-not-resolve: Charles Lyell popularized and systematized
  uniformitarianism decades later in 'Principles of Geology' (1830-1833);
  it is Lyell's more accessible synthesis that is often credited with making
  the idea a working scientific consensus (including its influence on
  Darwin). This edge records Hutton's original theoretical founding, not a
  claim that Lyell's contribution was merely derivative. Node flagged
  `ambiguous: true`.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 4. Karl Ernst von Baer -> subfield:developmental-biology

- QID guess (unverified): `Q57262`
- Sources: `source:wikipedia` (biography article: "known as the founding
  father of embryology", discovered the mammalian ovum 1826, formulated von
  Baer's laws; field article: credits von Baer's foundational contribution
  to embryonic-development study)
- Record-not-resolve: the modern node label "developmental biology" denotes
  a field that has broadened beyond von Baer's descriptive-comparative
  embryology to include 20th-century-onward molecular/genetic mechanisms;
  this edge records von Baer's founding of the field's historical core
  (embryology), not the later molecular expansion. Not flagged ambiguous on
  the founding claim itself (embryology specifically has a clean
  single-founder attribution to von Baer) — the scope-mapping note is
  informational for QC, not a co-founder dispute.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 5. William Morris Davis -> subfield:geomorphology

- QID guess (unverified): `Q315967` (matches the QID named in the
  person-wave8-v1 report's deferral note, retained here as the generator's
  best guess — still unverified and must be independently live-confirmed,
  not assumed correct from the prior report)
- Sources: `source:wikipedia` (biography article: developed the
  "geographical cycle"/"cycle of erosion" model, credited as a founder of
  geomorphology, though the article's broader framing emphasizes "father of
  American geography"; field article: credits Davis's cycle-of-erosion model
  as a founding theoretical framework)
- **Deliberate framing per the order**: this edge is grounded on the
  'Geomorphology' field article's specific crediting of Davis, not on his
  broader geography epithet, to keep the founding claim precisely scoped to
  the target subfield.
- Record-not-resolve: **co-founder** with G. K. Gilbert and John Wesley
  Powell for American geomorphology — Gilbert in particular is credited by
  some historians of science with a more process-based, quantitative
  approach (via his Henry Mountains and Lake Bonneville studies) regarded by
  some as methodologically prior to or more durable than Davis's descriptive
  cyclical model. Node flagged `ambiguous: true`.
- Uncertainty for orchestrator: identity unambiguous (Davis is a
  well-documented, well-disambiguated American geographer/geomorphologist);
  confirm QID only, but prioritize the field-article grounding check since
  the founding claim here is narrower than Davis's most commonly cited
  epithet.

## 6. Matthew Fontaine Maury -> subfield:oceanography

- QID guess (unverified): `Q317117`
- Sources: `source:wikipedia` (biography article: "father of modern
  oceanography", "Pathfinder of the Seas", author of 'The Physical Geography
  of the Sea', 1855, described as the first oceanography textbook; field
  article: credits Maury's systematic charting and 1855 synthesis as
  foundational)
- Record-not-resolve: none needed — earlier isolated oceanic observations by
  explorers and naval surveyors (e.g. Cook's voyages, Franklin's Gulf Stream
  chart) are forerunner data points, not a rival systematic founding
  synthesis. Not flagged ambiguous.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 7. Georgius Agricola -> subfield:mineralogy

- QID guess (unverified): `Q57285`
- Sources: `source:wikipedia` (biography article: "known as the father of
  mineralogy", author of 'De natura fossilium', 1546, and also of 'De re
  metallica', 1556; field article: credits Agricola's systematic
  classification of minerals as foundational)
- Record-not-resolve: **dual-epithet** — Agricola is equally or more often
  cited as the "father of metallurgy" for 'De re metallica' (1556); this
  edge records his mineralogy-founding contribution specifically ('De natura
  fossilium'), not a claim that mineralogy is his sole or primary legacy. A
  separate metallurgy-adjacent `founded_or_formalized` edge may be warranted
  in a future wave if a suitable target node exists (not checked in this
  batch — out of scope for a nodes+edges-only order targeting the 7 named
  fields). Node flagged `ambiguous: true`.
- Uncertainty for orchestrator: **name-collision risk** — "Georgius Agricola"
  (born Georg Bauer, 1494-1555, Saxon scholar) is a Latinized humanist-era
  name of a type shared with other era-contemporary "Agricola" figures (e.g.
  Rudolph Agricola, the Renaissance humanist logician, d. 1485; Johann
  Agricola, the Lutheran theologian, 1494-1566 — a near-exact birth-year
  coincidence with the mineralogist). Orchestrator must confirm the resolved
  QID matches the mineralogist/physician of Chemnitz specifically, not
  another Latinized "Agricola".

---

## Batch-level summary for the orchestrator

- 7 nodes proposed, 0 reconciled to existing IDs (none of the 7 persons exist
  in `data/nodes.json` — checked directly).
- 7 edges proposed, one per person, each targeting the order-specified
  `reviewed` field/subfield node (all 7 targets confirmed present and
  `reviewed` before generation).
- All 7 edges cite exactly 1 registered source ID (`source:wikipedia`),
  covering 2 independent claim-stating articles per row (field article +
  biography article, both named explicitly in each edge's `note`) — no
  specialist source plausibly applies to any of these 7 rows; flagged
  honestly rather than forcing a weak specialist citation.
- Ambiguous flag fired on 4/7 nodes (Linnaeus, Hutton, Davis, Agricola) — all
  four for **record-not-resolve plural-founding reasons** (Linnaeus/Hennig
  scope-broadening, Hutton/Lyell popularizer, Davis/Gilbert+Powell
  co-founders, Agricola's mineralogy/metallurgy dual epithet), plus a genuine
  **name-collision identity risk** specifically for Agricola (Latinized-name
  homonyms). Not flagged ambiguous: Vesalius, von Baer, Maury — clean
  single-founder consensus with no comparable identity risk.
- `disputed: true` was never used — all of these are record-not-resolve
  notes, not live contested-identity disputes.
- All 7 QIDs are generator best-guesses with no elevated/lowered confidence
  relative to each other (unlike wave 8's Graunt outlier) — treat all 7 as
  equally likely to be wrong per the ~100% hallucination-rate precedent.
  Agricola's QID guess carries the added name-collision risk noted above.
- No network calls made; all claims are from generator knowledge and must be
  live-verified by QC per the mandatory claim-anchor + cited-URL-survival
  process.
- Coverage deliberately left out: no co-founder edges for Willi Hennig,
  Charles Lyell, G. K. Gilbert, John Wesley Powell, or a metallurgy-target
  edge for Agricola — all are noted as future-wave candidates for symmetry
  if the CPO wants that, not generated here since they were outside this
  order's 7-row roster and (for the metallurgy case) no confirmed target node
  was checked.
