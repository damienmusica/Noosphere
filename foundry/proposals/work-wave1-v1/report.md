# work-wave1-v1 — batch report (orchestrator QC + measurement synthesis)

**Session #47 (Phase-2 kickoff). Batch `work-wave1-v1`.** The corpus's **first `work` nodes and
first `canonical_work` edges.** Measure-first / **proposed-first**: the work-node and
`canonical_work` auto-`reviewed` ladders are **not yet open** — this pilot exists to *earn* them
by measurement, mirroring the founder-ladder pattern (design (58) → measure (59) → open (60)/(61)).

Separated-context **Sonnet 5** generation (ADR 0007; `proposal-generator`, `model: sonnet`) →
orchestrator (Opus) **independent live QID QC** (enwiki pageprops + `wbgetentities` P31/P50/P577 +
enwiki sitelink). Local session, Wikidata/enwiki live (HTTP 200).

## Modeling rulings (first use of `work` / `canonical_work` — precedent-setting)

1. **`canonical_work` direction (taxonomy-resolved, no CPO gate needed).** `docs/relation-taxonomy.md`:
   *"Work A is canonical for a field, person, or concept B."* → the **work node is always `source`**;
   field/person is `target`. The prompt's floated `person→canonical_work→work` is **ruled out** by the
   definition; `work→part_of→field` is a **category error** (a book is not a subfield). No schema change.
2. **Two-edge triangle per work** (decision (85) intent — the work anchors *both* its author and its
   field, completing person↔work↔field): `work → canonical_work → {field}` (canonical for the field) +
   `work → canonical_work → {person}` (the author's canonical/defining work). Both targets are
   explicitly admitted by the taxonomy definition. Not double-counting (distinct subjects/objects); not
   skeleton-bloat (edge-demand-driven, one field + one author per work).
3. **`work` covers papers as well as books.** Mendel's *Experiments on Plant Hybridization* is a journal
   paper, not a book; nothing in `node.ts`/taxonomy restricts `work` to books, and it is unquestionably a
   founding text of genetics → admitted. Routine modeling call (no policy/schema change).
4. **Field anchor = referent-precise, not triangle-symmetric.** *Cours de linguistique générale* is
   anchored to **`field:linguistics`** (the WP lead: "a book about linguistics"; it founded structural
   linguistics), **not** to `subfield:semiotics` (Saussure's founder anchor) — semiology is recorded in
   the edge note, not double-anchored. Referent precision > triangle tightness (Cerf #33 discipline).

## QID QC — generator hallucination 9/9 = 100% (all caught, all corrected)

Consistent with the standing pattern (#46 was 13/13). Every work identity was **independently**
live-resolved by the orchestrator; the generator's guesses were never trusted.

| work | field target | author | generator QID | **verified QID** | P31 | P50 | P577 |
|---|---|---|---|---|---|---|---|
| on-the-origin-of-species | subfield:evolutionary-biology | Darwin | Q1071850 | **Q20124** | written work | Q1035 ✓ | 1859-11-24 |
| philosophiae-naturalis-principia-mathematica | field:physics | Newton | Q11409 | **Q205921** | written work/treatise | Q935 ✓ | 1687 |
| principles-of-geology | subfield:geology | Lyell | Q1806354 | **Q1348323** | written work | Q5333 ✓ | 1830 |
| the-wealth-of-nations | field:economics | Smith | Q216191 | **Q233562** | literary work | Q9381 ✓ | 1776-03-09 |
| de-humani-corporis-fabrica | subfield:anatomy | Vesalius | Q1636895 | **Q1233009** | written work/treatise | Q170267 ✓ | 1543 |
| systema-naturae | subfield:systematics | Linnaeus | Q1140615 | **Q29270** | written work | Q1043 ✓ | 1735 |
| traite-elementaire-de-chimie | field:chemistry | Lavoisier | Q3495523 | **Q2163561** | scientific work | Q39607 ✓ | 1789 |
| cours-de-linguistique-generale | field:linguistics | Saussure | Q1141263 | **Q13231** | academic work | Q13230 ✓ | 1916 |
| experiments-on-plant-hybridization | subfield:genetics | Mendel | Q1970864 | **Q5421194** | scientific work (paper) | Q37970 ✓ | 1866 |

Every verified item: correct work-type P31 (written/literary/scientific/academic work, or treatise),
**P50 author matches the intended author QID**, P577 matches the pub year, enwiki sitelink present.

## Honest gap — `work:the-biosphere` (Vernadsky) **dropped**

Vernadsky's *The Biosphere* (Биосфера, 1926) has **no identity-decidable Wikidata book item**: search
surfaces only the *concept* (Q42762), reserves, films, and unrelated scientific articles; the one bare
"The Biosphere" book item (Q139866076) has **no author (P50), no publication date (P577), no sitelink** —
an unverifiable stub that could be any homonymous book. Forcing it would repeat the fractal-Q81392
referent mismatch (#43). **Declined as an honest gap** (mirrors Mandelbrot/fractal-geometry and JDM, #43)
— the pipeline's referent-precision discipline declining rather than forcing. Slate: 10 candidates → **9
clean works** written (within the 8–14 target). geochemistry's canonical text is deferred to a later wave.

## Reject probes — 2/2 correctly rejected (discrimination confirmed, #31 mirror)

- **R1 (misattribution):** `on-the-origin-of-species → canonical_work → person:alfred-russel-wallace`.
  **REJECTED.** Wallace co-discovered natural selection (1858 Darwin–Wallace paper) — a real link that
  makes this a genuine discrimination test — but did **not** author *Origin*: verified **P50 = [Q1035]
  only** (Darwin), Wallace absent. *Origin* is not Wallace's canonical work. Not written to `/data`.
- **R2 (anachronism):** `principia → canonical_work → subfield:evolutionary-biology`. **REJECTED.**
  Principia (1687, mechanics; P577 1687) predates evolutionary theory (1859) by 172 years and has no
  substantive connection. Not written to `/data`.

## Verdicts & grounding

**18 canonical_work edges written `proposed` (9 works × 2) / 2 reject-probes rejected / claim-level
hallucination 0.** Grounding = **≥2 independent live-verified Wikipedia articles per edge** (work article
+ field article for field edges; work article + author biography for person edges), the #34/#45 evidence
convention; the two named articles are recorded in each edge `note`. The generator's stray
`source:mactutor` citations for anatomy/systematics (MacTutor is a mathematics archive — Vesalius/Linnaeus
absent) were **caught and dropped** in favour of the uniform 2-Wikipedia standard.

## Counts

Nodes 551 → **560** (+9 `work` — corpus's first) · edges 648 → **666** (+18 `canonical_work` — first use) ·
translations → **560** · sources 23 unchanged · schema unchanged (`work` type + `canonical_work` relation
already existed). `work` node count 0 → **9**; `canonical_work` edge count 0 → **18**.

## Measurement synthesis → CPO ladder-opening recommendation

Pilot metrics against the keep-criteria draft (W1–W5):
- **Precision on supported edges: 18/18 = 1.0** (0 written edges failed QC).
- **Identity hallucination caught: 9/9 = 100%** (separated-generation + independent live QC held).
- **Rejection discrimination: 2/2 probes fired** (misattribution + anachronism both rejected).
- **Direction accuracy: 18/18** (all work→{field,person}, taxonomy-faithful).
- **Referent-precision discipline demonstrated:** 1 honest drop (Biosphere), 1 field re-anchor (Cours).

This matches the founder-ladder's earning measurement (precision 1.0, hallucination 0, rejection fired).
**CTO recommendation to CPO (decision input, not self-executed):** open the **work-node auto-`reviewed`
ladder** (QID-resolver-verified work identity + author/field both reviewed → node auto-`reviewed`, mirror
of node policy v1) and the **`canonical_work` auto-`reviewed` ladder** (both endpoints reviewed +
supported Lane-B verdict → `proposed → reviewed`, mirror of (60)/(61)), and **codify keep-criteria W1–W5**
in `docs/data-foundry.md`. Until that CPO gate, everything here stays `proposed`.

Files: `nodes.proposed.json` (10 generated, incl. the dropped Biosphere) · `edges.proposed.json`
(22 generated: 20 real + 2 probes) · `generation-notes.md` (generator's record) · `report.md` (this).
