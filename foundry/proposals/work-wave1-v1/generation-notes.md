# work-wave1-v1 — generation notes

Batch: Phase-2 kickoff, first `work` nodes and first `canonical_work` edges in the corpus.
Proposer: Claude Sonnet (model_version `claude-sonnet-5`), proposed_at 2026-07-01.
Status: everything in this batch is `generated`-tier / `status: "proposed"` in the artifact
files. Nothing here is verified; all Wikidata QIDs are unresolved best-guess recollections
pending the orchestrator's independent live resolution.

This is a proposal artifact under `foundry/proposals/`. It is not canonical `/data` and must
not be treated as ground truth by any other agent or process.

## Scope reconciliation against `/data`

Checked `data/nodes.json` and `data/edges.json` before generating: none of the 10 works, and
none of the 22 candidate edges, already exist canonically. All 10 author nodes
(`person:charles-darwin`, `person:isaac-newton`, `person:charles-lyell`, `person:adam-smith`,
`person:andreas-vesalius`, `person:carl-linnaeus`, `person:antoine-lavoisier`,
`person:ferdinand-de-saussure`, `person:gregor-mendel`, `person:vladimir-vernadsky`) and all
target field/subfield nodes (`subfield:evolutionary-biology`, `field:physics`,
`subfield:geology`, `field:economics`, `subfield:anatomy`, `subfield:systematics`,
`field:chemistry`, `subfield:semiotics`, `subfield:genetics`, `subfield:geochemistry`) exist
as `reviewed` nodes, confirmed by direct grep of `data/nodes.json`. `person:alfred-russel-wallace`
(used only in probe R1) also exists as a `reviewed` node. All 8 registered source ids used
(`source:wikipedia`, `source:sep`, `source:mactutor`) — actually all 8 permitted ids were
checked present in `data/sources.json`; only `wikipedia`, `sep`, and `mactutor` were actually
cited (no work in this batch needed `iep`, `nobelprize`, `oxford-bibliographies`,
`encyclopedia-of-mathematics`, or `nlab` — none are a plausible fit for these 10 works, so I
did not force a citation to pad the ≥2 minimum with an irrelevant source).

## Per-work QID guesses, confidence, and disambiguation notes

1. **work:on-the-origin-of-species** — QID guess `Q1071850`. Confidence: high that a dedicated
   "On the Origin of Species" work item exists on Wikidata; moderate on the exact digit string.
   Disambiguation: if wrong, resolver should search Wikidata for the English label "On the
   Origin of Species" filtered to instance-of "written work" / "book", authored by Darwin
   (Q1035), 1859. Not ambiguous with any other work.

2. **work:philosophiae-naturalis-principia-mathematica** — QID guess `Q11409`. Confidence:
   moderate — Newton's Principia is a heavily-modeled entity on Wikidata and multiple editions
   (1687 first Latin edition, 1713, 1726, and English translations like Motte's) may have
   separate items. Disambiguation: resolver should confirm which QID is the umbrella
   "work" (P31 written work) versus a specific edition, and prefer the umbrella item as the
   work node's identity anchor.

3. **work:principles-of-geology** — QID guess `Q1806354`. Confidence: moderate. The work was
   published across three volumes (1830, 1832, 1833) with multiple subsequent editions
   through Lyell's lifetime (up to the 12th edition, 1875). Disambiguation: resolver should
   check whether Wikidata models "Principles of Geology" as one umbrella work or splits by
   volume/edition, and pick the umbrella item.

4. **work:the-wealth-of-nations** — QID guess `Q216191`. Confidence: high. Full title "An
   Inquiry into the Nature and Causes of the Wealth of Nations" vs. short title "The Wealth of
   Nations" — Wikidata's preferred label may use either; should not create identity ambiguity
   since there is only one such work by Smith.

5. **work:de-humani-corporis-fabrica** — QID guess `Q1636895`. Confidence: high on existence
   of a dedicated item, moderate on exact digits. Not ambiguous with other works.

6. **work:systema-naturae** — QID guess `Q1140615`. Confidence: moderate-low on precision.
   **Flagged ambiguous**: Systema Naturae went through 12 editions during Linnaeus's lifetime;
   the 1st edition (1735, used in the order's table) is a slim pamphlet, while the 10th edition
   (1758) is the one formally fixed by the ICZN as the starting point of zoological
   nomenclature and is more often what "Systema Naturae" refers to in systematics contexts.
   Resolver should determine whether Wikidata treats these as one work item (likely) or
   separate edition items, and note the edition distinction in the node's eventual summary.

7. **work:traite-elementaire-de-chimie** — QID guess `Q3495523`. Confidence: low-moderate —
   this is the QID guess I am least confident about in the batch. **Flagged ambiguous.**
   Resolver should verify independently; if wrong, search Wikidata for "Traité élémentaire de
   chimie" authored by Lavoisier (Q1398), 1789.

8. **work:cours-de-linguistique-generale** — QID guess `Q1141263`. Confidence: moderate.
   **Flagged ambiguous** for an authorship nuance, not an identity nuance: the book was
   compiled and published posthumously in 1916 (Saussure died 1913) by editors Charles Bally
   and Albert Sechehaye from students' lecture notes, not from a manuscript Saussure prepared
   for publication himself. This is standard and uncontroversial in how the work is
   attributed, but worth exposing to QC since it is a different authorship shape than the
   other 9 works in this batch.

9. **work:experiments-on-plant-hybridization** — QID guess `Q1970864`. Confidence: moderate.
   **Flagged ambiguous** because this is a journal paper ("Versuche über Pflanzen-Hybriden",
   1866, Verhandlungen des naturforschenden Vereines in Brünn), not a book like the other nine
   works — worth confirming the `work` node type and schema are intended to cover papers as
   well as books (nothing in the schema restricts `work` to books, so I proceeded, but flag it
   as a scope question for QC/CPO).

10. **work:the-biosphere** — QID guess `Q4386379`. Confidence: lowest in the batch.
    **Flagged ambiguous** on two independent grounds: (a) my QID recollection for Vernadsky's
    work is weaker than for the other, more canonical figures in this batch; (b) the work was
    originally published in Russian as "Биосфера" (Biosfera, 1926) and an English translation
    "The Biosphere" appeared much later (1998, Copernicus/Springer) — Wikidata may model the
    original Russian work and the English translation as separate items, and the resolver
    should pick the one representing the original 1926 work (matching the order's pub year).

## Per-edge grounding rationale (summary)

- **Field-level edges (work → field/subfield)**: confidence 0.9–0.95, evidenced by the work's
  own Wikipedia article plus either the field's Wikipedia article or a specialist source (SEP
  for Saussure/economics-adjacent history-of-ideas claims, MacTutor for physics/geology/
  anatomy/systematics figures with MacTutor biographical coverage). All ten are standard,
  low-controversy "founding text of X" claims well attested in general reference material.
- **Person-level edges (work → author)**: confidence 0.85–0.9, generally lower than the
  field-level edge for the same work because I could only confidently supply a single
  candidate source (Wikipedia) for several of the lesser-documented figures
  (Vesalius, Lavoisier, Lyell, Vernadsky) rather than the ≥2 independent sources genuinely
  wanted. **I flagged these `ambiguous: true` and called this out explicitly** so QC does not
  read a single-Wikipedia-citation edge as fully grounded; a second source should be found
  (or the field's specialist source reused, e.g. MacTutor for Lyell) before promotion.
- Two edges are true no-controversy pairs with two solid sources and no ambiguity flag:
  Darwin/Origin (both edges), Newton/Principia (both edges), Smith/Wealth of Nations (both
  edges), and Mendel/Experiments (both edges) — these four author-work pairs are about as
  settled as historical authorship claims get, so I did not launder false caution into them
  by flagging `ambiguous` where I have no genuine doubt.

## Reject probes — explicit reasoning

- **R1 — `work:on-the-origin-of-species` → `person:alfred-russel-wallace`
  (`canonical_work`)**: Intended flaw is **misattribution via co-discoverer confusion**.
  Wallace independently arrived at natural selection and co-presented the 1858
  Darwin–Wallace paper to the Linnean Society, which is a real and well-documented historical
  connection — that is precisely what makes this a good discrimination probe rather than an
  obviously nonsensical one. But Wallace did not write, and is not the canonical author of, On
  the Origin of Species; Darwin alone is. Wallace's own canonical work in this space would be a
  different text (e.g., his 1889 book Darwinism). I set `confidence: 0.4` (deliberately below
  the batch's normal floor) and `"probe": "reject-expected"` and expect the orchestrator to
  reject this edge outright.
- **R2 — `work:philosophiae-naturalis-principia-mathematica` →
  `subfield:evolutionary-biology` (`canonical_work`)**: Intended flaw is **anachronism /
  domain mismatch**. Principia (1687) concerns classical mechanics and mathematics and
  predates the theory of evolution (1859) by 172 years; the two have no substantive
  intellectual connection. I set `confidence: 0.2` and expect outright rejection.

## Coverage decisions — what was deliberately left out

- No edges beyond the two required per work (field/subfield target + person target) were
  proposed, per the order's exact scope (20 real edges = 10 works × 2). I did not add
  `part_of`, `influenced`, or other relation types for these works even where plausible
  (e.g., Origin of Species arguably also relates to `subfield:genetics` via later synthesis,
  or Cours de linguistique générale to `field:philosophy` via philosophy of language) — that
  is out of scope for this wave and would dilute the pilot's clean measurement.
- I did not attempt to independently verify any QID by network lookup (no network access
  permitted in this role); every QID in `nodes.proposed.json` is an unverified recollection
  and is labeled as such in both the node's `uncertainty` field and this document. The
  orchestrator's live-resolution pass is the actual verification step.
- I did not add a `disputed` flag to any item — none of these ten works have a genuine
  competing-authorship or competing-canonicity dispute at the level `disputed: true` is meant
  to capture (that flag is reserved for real-world contested placements, and none of the ten
  slate works qualify; the Wallace probe is a deliberately *wrong* claim, not a live dispute,
  so it is marked `probe`/`ambiguous`, not `disputed`).
- Genetics/evolutionary-synthesis cross-links (e.g., Mendel's work also being foundationally
  relevant to `subfield:evolutionary-biology` via the modern synthesis) were deliberately not
  added — each work gets exactly one field/subfield target per the order's table, and
  Mendel's slate target is `subfield:genetics` only.

## What QC should look at first

1. **Live-resolve all 10 QIDs** — this is the single highest-value QC action; several guesses
   (`traite-elementaire-de-chimie`, `the-biosphere`, `principles-of-geology`, `systema-naturae`)
   are explicitly lower-confidence and most likely to need correction or edition
   disambiguation.
2. **Single-source person-edges** (Vesalius, Lavoisier, Lyell, Vernadsky → their works): each
   currently cites only `source:wikipedia`; find a second independent source or confirm
   Wikipedia alone is judged sufficient for this risk tier before promotion.
3. **Systema Naturae / Cours de linguistique générale edition and authorship nuances** — decide
   whether the work node should anchor to the 1735 vs. 1758 edition (Linnaeus) and confirm the
   posthumous-compilation framing for Saussure's Cours is acceptable as stated.
4. **Confirm the two reject probes are actually rejected** — this batch's stated purpose
   includes testing QC discrimination; if either probe is NOT rejected, that is a finding about
   the QC pipeline, not about these two facts.
5. **`work:experiments-on-plant-hybridization` type-fit** — confirm a journal paper is an
   acceptable `work` node instance alongside the nine books in this batch, or flag for a future
   scope clarification.

## Labels and summaries (for node-translations, English/`en`)

1. **work:on-the-origin-of-species** — Label: "On the Origin of Species". Summary: "An 1859
   book by Charles Darwin that introduced the theory of evolution by means of natural
   selection."
2. **work:philosophiae-naturalis-principia-mathematica** — Label: "Philosophiæ Naturalis
   Principia Mathematica". Summary: "A 1687 work by Isaac Newton laying out the laws of motion
   and universal gravitation, foundational to classical mechanics."
3. **work:principles-of-geology** — Label: "Principles of Geology". Summary: "A three-volume
   work published by Charles Lyell between 1830 and 1833 that argued for uniformitarianism in
   explaining the Earth's geological features."
4. **work:the-wealth-of-nations** — Label: "The Wealth of Nations". Summary: "An 1776 work by
   Adam Smith examining the nature of economic production, trade, and the division of labor,
   foundational to classical economics."
5. **work:de-humani-corporis-fabrica** — Label: "De humani corporis fabrica". Summary: "A 1543
   illustrated work by Andreas Vesalius presenting human anatomy based on direct dissection,
   foundational to modern anatomical science."
6. **work:systema-naturae** — Label: "Systema Naturae". Summary: "A work by Carl Linnaeus,
   first published in 1735, that introduced the hierarchical classification system and
   binomial nomenclature used in biological systematics."
7. **work:traite-elementaire-de-chimie** — Label: "Traité élémentaire de chimie". Summary: "An
   1789 work by Antoine Lavoisier that systematized modern chemical nomenclature and the
   oxygen theory of combustion."
8. **work:cours-de-linguistique-generale** — Label: "Cours de linguistique générale". Summary:
   "A 1916 work compiled posthumously from Ferdinand de Saussure's lecture notes, foundational
   to structural linguistics and modern semiotics."
9. **work:experiments-on-plant-hybridization** — Label: "Experiments on Plant Hybridization".
   Summary: "An 1866 paper by Gregor Mendel describing the results of pea-plant breeding
   experiments that established the basic laws of inheritance."
10. **work:the-biosphere** — Label: "The Biosphere". Summary: "A 1926 work by Vladimir
    Vernadsky that developed the modern scientific concept of the biosphere and founded the
    discipline of biogeochemistry."
