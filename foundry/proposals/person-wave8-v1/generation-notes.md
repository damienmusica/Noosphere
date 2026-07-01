# Generation notes — person-wave8-v1

Batch: 10 canonical "father of X" founders of already-`reviewed` disciplines with
no founder edge yet (order-specified roster, not a generator-scoped slate).
Proposer: Claude Sonnet, `claude-sonnet-5`, 2026-07-01. All 10 persons are
**deceased**. All QIDs below are **generator best-guesses, unverified** — every
node carries `_qid_unverified: true` and must be live resolver-confirmed by the
orchestrator (P31=Q5 + P569 + P570 + label/sitelink) before promotion. Prior
waves measured ~100% generator-guessed-QID hallucination rate; treat every QID
here as wrong until proven otherwise. This note flags `person:john-graunt`'s
QID guess as lower-confidence than the rest (sparser modern coverage of a
17th-century figure), and `person:victor-moritz-goldschmidt`'s as carrying an
extra father/son disambiguation risk on top of the usual QID risk.

**Target-node verification:** all 10 target nodes (`subfield:ecology`,
`subfield:crystallography`, `subfield:seismology`, `subfield:demography`,
`subfield:epidemiology`, `field:pharmacology`, `field:psychiatry`,
`subfield:acoustics`, `subfield:toxicology`, `subfield:geochemistry`) were
confirmed present and `status: "reviewed"` in `data/nodes.json` before
generation. None of the 10 persons in this order exist already in
`data/nodes.json` (checked directly) — no reconciliation to existing IDs was
needed; all 10 are new proposals.

**Source-registry check:** confirmed `source:wikipedia`, `source:sep`,
`source:iep`, `source:mactutor`, `source:nobelprize`,
`source:oxford-bibliographies`, `source:encyclopedia-of-mathematics`,
`source:nlab` all exist in `data/sources.json`. For every row in this batch,
the two independent claim-stating articles named in each edge `note` are both
Wikipedia articles (field article + biography article), encoded under the
single `evidence: ["source:wikipedia"]` entry per the session #34 precedent
(one registered source ID can back two distinct claim-anchors named in the
note). No specialist source (SEP/MacTutor/IEP/NobelPrize) plausibly applies to
any of these 10 rows — none of these founders won a Nobel, none are core SEP
subjects, MacTutor covers mathematicians (none of these 10 are mathematicians
proper — Goldschmidt and Hauy are closest to exact science but are
geochemist/crystallographer, not mathematicians), and IEP covers philosophy.
Flagging honestly rather than forcing a weak specialist-source citation.

---

## 1. Ernst Haeckel -> subfield:ecology

- QID guess (unverified): `Q57235`
- Sources: `source:wikipedia` (biography article: coined "Oekologie" in
  "Generelle Morphologie der Organismen", 1866; field article: credits Haeckel
  with coining/defining the term)
- Record-not-resolve: **co-founder** with Eugenius Warming for plant ecology
  specifically — his 1895 "Oecology of Plants" was the first systematic
  ecology textbook/teaching synthesis. Node flagged `ambiguous: true`.
- Uncertainty for orchestrator: identity is not in doubt (Haeckel is a
  well-known, well-disambiguated German zoologist); confirm QID only.

## 2. Rene Just Hauy -> subfield:crystallography

- QID guess (unverified): `Q116565`
- Sources: `source:wikipedia` (biography article: "father of crystallography",
  law of rational indices; field article: credits early theoretical
  contribution)
- Record-not-resolve: Nicolas Steno's 1669 law of constancy of interfacial
  angles is a genuine empirical forerunner predating Hauy's systematic
  mathematical theory by over a century, but is not treated as a rival founder
  of the discipline as a structured science. Not flagged ambiguous.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 3. John Milne -> subfield:seismology

- QID guess (unverified): `Q713434`
- Sources: `source:wikipedia` (biography article: "father of modern
  seismology", horizontal-pendulum seismograph, founded the Seismological
  Society of Japan 1880; field/history-of-seismology article corroborating)
- Record-not-resolve: **the "British seismology in Japan" trio** — James
  Alfred Ewing and Thomas Gray co-developed the horizontal-pendulum
  seismograph alongside Milne during their shared tenure at the Imperial
  College of Engineering, Tokyo (late 1870s-1880s). This edge records Milne's
  specific (most institutionally prominent/durable) role, not sole invention.
  Node flagged `ambiguous: true`.
- Uncertainty for orchestrator: **"John Milne" is a common English name** —
  per the order's explicit flag, this is one of the identity-disambiguation
  risk rows. Confirm the resolved QID matches the mining-engineer/seismologist
  (1850-1913, Liverpool-born, career in Japan then the Isle of Wight), not
  another historical John Milne (there are several, including artists and
  politicians).

## 4. John Graunt -> subfield:demography

- QID guess (unverified): `Q721755`
- Sources: `source:wikipedia` (biography article: "founder of demography"/
  "first demographer", the 1662 Bills of Mortality study; field article:
  credits the 1662 work as demography's founding statistical study)
- Record-not-resolve: William Petty is sometimes named as a close
  collaborator/co-developer of the broader "political arithmetick" tradition
  Graunt's work sits within. Some historiography also treats Graunt as a
  shared root of vital statistics and epidemiology's data-analytic side
  (distinct from Snow's later causal-investigation founding of epidemiology
  proper — item 5 below), but demography specifically has a clean
  single-founder attribution to Graunt. Not flagged ambiguous on founding.
- Uncertainty for orchestrator: **this QID guess carries lower confidence
  than the rest of the batch** — Graunt is a sparser-documented 17th-century
  figure than the 19th/20th-century founders elsewhere in this batch; treat
  Q721755 as an especially likely miss and prioritize live lookup.

## 5. John Snow -> subfield:epidemiology

- QID guess (unverified): `Q131691`
- Sources: `source:wikipedia` (biography article: "father of modern
  epidemiology", the 1854 Broad Street cholera investigation; field article:
  credits Snow's methodological founding of field epidemiology)
- Record-not-resolve: none needed for the founding claim itself (clean
  single-founder consensus for the causal-investigative methodology); the
  batch's other social-statistics founder (Graunt, item 4) is a shared-root
  note, not a rival claim on epidemiology specifically.
- Uncertainty for orchestrator: **"John Snow" is an extremely common name** —
  per the order's explicit flag, including a well-known contemporary British
  journalist/newsreader and the unrelated "Game of Thrones" character. Confirm
  the resolved QID matches the 19th-century physician/anaesthetist
  (1813-1858, London).

## 6. Oswald Schmiedeberg -> field:pharmacology

- QID guess (unverified): `Q71186`
- Sources: `source:wikipedia` (biography article: "father of modern
  pharmacology", founded the Strasbourg pharmacology institute 1872,
  co-founded Archiv fur experimentelle Pathologie und Pharmakologie; field
  article: credits Schmiedeberg's institutional founding role)
- Record-not-resolve: pharmacology has older roots in materia medica and
  pharmacognosy (drug-lore/herbalism) predating Schmiedeberg by centuries;
  this edge records his specific founding of pharmacology as an experimental,
  institution-based scientific discipline. Not flagged ambiguous.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 7. Emil Kraepelin -> field:psychiatry

- QID guess (unverified): `Q60815`
- Sources: `source:wikipedia` (biography article: "considered the founder of
  modern scientific psychiatry, as well as of psychopharmacology and
  psychiatric genetics"; field article: credits Kraepelin's classification
  system as foundational to modern psychiatric nosology)
- Record-not-resolve: **co-founder-adjacent** with Philippe Pinel (moral
  treatment reform, ~1793, humane asylum reform predating biological/
  nosological psychiatry) and Wilhelm Griesinger (biological/somatic framing,
  ~1845, "mental diseases are diseases of the brain"). This edge records
  Kraepelin's specific founding of the modern diagnostic-nosological
  discipline, not a claim that psychiatric practice began with him. Node
  flagged `ambiguous: true`.
- Uncertainty for orchestrator: identity unambiguous (Kraepelin is
  well-disambiguated); confirm QID only.

## 8. Ernst Chladni -> subfield:acoustics

- QID guess (unverified): `Q76357`
- Sources: `source:wikipedia` (biography article: "sometimes labeled as the
  father of acoustics", Chladni figures, 1787 treatise; field article:
  credits Chladni's experimental/foundational contribution)
- Record-not-resolve: none needed — clean single-founder consensus for
  experimental/physical acoustics specifically (music-theoretical treatments
  of sound predate Chladni but are not treated as founding the scientific
  discipline). Not flagged ambiguous.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 9. Mathieu Orfila -> subfield:toxicology

- QID guess (unverified): `Q464889`
- Sources: `source:wikipedia` (biography article: "considered the father of
  toxicology", the 1813 "Traite des poisons"; field article: credits Orfila's
  founding contribution, sometimes specifically "forensic toxicology")
- Record-not-resolve: Paracelsus's 16th-century dose-response principle ("the
  dose makes the poison") is a genuine philosophical/conceptual forerunner but
  predates the systematic scientific-medical discipline Orfila established.
  Not flagged ambiguous.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 10. Victor Moritz Goldschmidt -> subfield:geochemistry

- QID guess (unverified): `Q71805`
- Sources: `source:wikipedia` (biography article: "considered the founder of
  modern geochemistry (and also of crystal chemistry)", Goldschmidt's
  rules/tolerance factor; field article: credits Goldschmidt's founding
  synthesis)
- Record-not-resolve: Vladimir Vernadsky's independent biogeochemistry/
  Earth-systems tradition (roughly contemporaneous, Russia/Ukraine, emphasis
  on the biosphere's role in elemental cycling) and F. W. Clarke's earlier
  elemental-abundance compilation work (US Geological Survey, sometimes called
  "the father of geochemistry" in American historiography) both run parallel
  to or predate Goldschmidt's synthesis. This edge records Goldschmidt's
  specific quantitative crystal-chemical founding contribution, not a claim of
  sole global priority. Node flagged `ambiguous: true`.
- Uncertainty for orchestrator: **CRITICAL identity-disambiguation risk, per
  the order's explicit flag** — Victor MORITZ Goldschmidt (1888-1947,
  Norwegian, the geochemist) must not be confused with his father Victor
  MORDECHAI Goldschmidt (1853-1933), also a crystallographer with his own
  Wikidata entry and publication record on crystal morphology/goniometry.
  This is a genuine father/son name collision, distinct from the general
  "common name" risk flagged for Milne/Snow above. Orchestrator must verify
  the resolved QID's P569/P570 dates (1888-1947) and occupation/field
  ("geochemist", not solely "crystallographer") match the son specifically
  before treating the identity as confirmed.

---

## Batch-level summary for the orchestrator

- 10 nodes proposed, 0 reconciled to existing IDs (none of the 10 persons
  exist in `data/nodes.json` — checked directly).
- 10 edges proposed, one per person, each targeting the order-specified
  `reviewed` field/subfield node (all 10 targets confirmed present and
  `reviewed` before generation).
- All 10 edges cite exactly 1 registered source ID (`source:wikipedia`),
  covering 2 independent claim-stating articles per row (field article +
  biography article, both named explicitly in each edge's `note`) — no
  specialist source (SEP/MacTutor/IEP/NobelPrize/Oxford Bibliographies)
  plausibly applies to any of these 10 rows; flagged honestly rather than
  forcing a weak specialist citation.
- Ambiguous flag fired on 5/10 nodes (Haeckel, Milne, Snow, Kraepelin,
  Goldschmidt) — for a MIX of two distinct reasons this batch, unlike prior
  waves where ambiguous was purely a record-not-resolve co-founder signal:
  - **Plural/co-founder record-not-resolve** (Haeckel/Warming,
    Kraepelin/Pinel+Griesinger, Goldschmidt/Vernadsky+Clarke).
  - **Genuine identity-disambiguation risk** (Milne — common name + trio
    co-founders; Snow — extremely common name; Goldschmidt — father/son name
    collision, the highest-risk identity case in this batch, compounding with
    its co-founder note).
  `disputed: true` was never used — all of these are record-not-resolve notes,
  not live contested-identity disputes.
- All 10 QIDs are generator best-guesses; John Graunt's guess is flagged as
  the single lowest-confidence QID in the batch (sparse 17th-century
  biographical digitization); Goldschmidt's carries an extra mandatory
  father/son disambiguation check beyond the standard identity floor.
- No network calls made; all claims are from generator knowledge and must be
  live-verified by QC per the mandatory claim-anchor + cited-URL-survival
  process.
- Coverage deliberately left out: no co-founder edges for Warming, Ewing,
  Gray, William Petty, Pinel, Griesinger, Vernadsky, or F. W. Clarke — all
  are noted as future-wave candidates for symmetry if the CPO wants that,
  not generated here since they were outside this order's 10-row roster.
