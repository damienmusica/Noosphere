# work-wave3-v1 batch report (generator output + orchestrator QC record)

Batch: Phase-2 work layer, wave 3. Proposer: Claude Sonnet (`claude-sonnet-5`), `proposed_at` 2026-07-02.
Round 4, session #49. Separated-context generation (ADR 0007) → orchestrator live QID QC. All generated
items were `status: generated`; promotion decisions below are the orchestrator's, made in a separate
context.

## Generator counts (as produced)

- 7 `work` nodes, 12 real `canonical_work` edges (6 works × 2: field + person) + 2 rejection probes.
- Co-canonical flagged: mathematical-logic (2-way, Boole + existing Frege), sociology (3-way, Comte +
  Durkheim + Weber).
- Honesty-gap: Pasteur→microbiology dropped by generator; Koch→microbiology proposed borderline (conf
  0.55/0.60) with explicit "consider dropping" recommendation.

## Orchestrator QC — live QID verification (generator QIDs 7/7 hallucinated = 100%)

Every generator QID resolved to an unrelated entity (Miller's Ale House, Albert Benjamin Simpson, a lake,
footballers) — consistent with wave1/wave2 (9/9 each). Independently re-resolved via enwiki pageprops +
wbsearchentities, then verified P31 (work-type) / P50 (author-match) / P577 (year) / identity-anchor:

| work | generator QID | corrected QID | P31 | P50 match | year | anchor |
|---|---|---|---|---|---|---|
| Cantor *Grundlagen* | Q19181902 ✗ | **Q29167832** | Q13442814 scholarly-article | Q76420 ✓ | 1883 | (b) DOI + P1433, 0 sitelinks |
| Boas *Mind of Primitive Man* | Q6858987 ✗ | **Q7751530** | Q7725634 literary-work | Q76857 ✓ | 1911 | (a) 2 sitelinks |
| Comte *Cours* | Q2895878 ✗ | **Q3490518** | Q47461344 written-work | Q12718 ✓ | 1830–42 (uncontested) | (a) 10 sitelinks |
| Durkheim *Rules* | Q1806105 ✗ | **Q588341** | Q7725634 literary-work | Q15948 ✓ | 1895 | (a) 10 sitelinks |
| Weber *Protestant Ethic* | Q557184 ✗ | **Q392937** | Q47461344 written-work | Q9387 ✓ | 1905 | (a) 37 sitelinks |
| Boole *Laws of Thought* | Q2596947 ✗ | **Q7746455** | Q7725634 literary-work | Q134661 ✓ | 1854 | (a) 4 sitelinks |

All 6 pass the work-node ladder (§8): P31 work-type + P50 author-match + decidable year + identity anchor
+ both endpoints already `reviewed`.

## Honesty-gap drop — Koch → microbiology (DROPPED)

Koch's 1882 tuberculosis paper *Die Aetiologie der Tuberkulose* returned **0 hits** across Wikidata search
variants — no identity-decidable item exists (fails W2). Microbiology's founding credit is genuinely
distributed across Koch's and Pasteur's several papers (the Microbiology article names no single founding
text). Dropped alongside the generator's own Pasteur non-proposal, mirroring the Snow (#48) and Vernadsky
*Biosphere* (#47) honesty-gap drops. Forcing a weak single-work attribution would violate referent
precision. **Not written to `/data`.**

## Co-canonical first case — CPO ruling (decision (90))

work-wave3 surfaced the corpus's first co-canonical works:

- **mathematical-logic** — Boole *Laws of Thought* (algebraic logic) + Frege *Begriffsschrift*
  (quantificational logic, work-wave2). Two distinct, non-competing founding strands.
- **sociology** — Comte *Cours* + Durkheim *Rules* + Weber *Protestant Ethic*. Three founding statements.

CTO surfaced this as a modeling ruling. **CPO ruled: allow — mirror the founder layer.** A field already
holds multiple `founded_or_formalized` founders (sociology: Comte/Durkheim/Weber/Marx; semiotics:
Saussure/Peirce) under record-not-resolve; multiple `canonical_work` edges are the works-layer analog.
Forcing a single "the" canonical text would be an arbitrary tie-break and historically false. §8 wording
"the canonical work" → "a canonical work" + a co-canonical note; the dilution bound stays W1
(watershed/founding texts only). Schema unchanged.

## Rejection probes — 2/2 fired

1. `Laws of Thought → person:gottlob-frege` — misattribution (P50 = Boole Q134661 only, not Frege). A
   hard same-subfield probe (both are co-canonical for mathematical-logic in this batch). **Rejected.**
2. `Cours de philosophie positive → subfield:cultural-anthropology` — wrong subfield (Cours founds
   sociology, not cultural anthropology, Boas's field). **Rejected.**

Neither written to `/data`.

## Final disposition — 12 supported / 0 disputed / 1 honesty-gap drop / 2 reject; hallucination 0; precision 1.0

6 works + 12 `canonical_work` edges auto-`reviewed` → `/data` (all deceased authors → living-author guard
not triggered). Nodes 568→574 (work 17→23) · canonical_work 34→46. See `promotion-report.md`.
