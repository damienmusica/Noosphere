# QC report — medicine-and-health skeleton v1

> Orchestrator (Fable 5) full QC of the generator's 49-node proposal, session #18,
> 2026-06-12. Generation = Sonnet separate context (ADR 0007); QC = this context.
> Gate schemes LCC class R + UDC class 61 (captured-sources.md); cross-checks FORD 3 + MeSH.

## Outcome

- **Generated:** 49 nodes (22 fields / 27 subfields).
- **Kept:** 50 nodes — 22 fields / 28 subfields (one demotion, one addition; no drops).
- **Level change:** `field:nutrition-science` → `subfield:nutrition-science` (1).
- **Added at QC (coverage gap):** `field:family-medicine` (1).
- **Promotion:** 46 reviewed / 4 proposed (see promotion-report.md).
- **Hint-laundering machine sweep:** 49/49 source_hints checked against captured ranges. 0 confirmed launderings; 2 synthesized range-boundaries corrected (see below). The generator self-disclosed both unverified anchors honestly (naturopathy, global-health) — both then live-resolved in QC's favour.

## Machine sweep — source_hint range corrections (anchor only on captured/verified ranges)

- `subfield:health-policy-and-management`: generator synthesized "LCC RA393-418" (RA393 boundary not in captured outline). Corrected to the captured/verified anchors: RA410-410.9 "Medical economics" + RA418-418.5 "Medicine and society" + MeSH H02.269 Health Services Administration / H02.309 Hospital Administration + FORD 3.3.
- `subfield:naturopathy`: generator flagged "RZ440-499 per training knowledge — unverified". **Live-verified at QC** (id.loc.gov classification search 2026-06-12): **LCC RZ440 "Naturopathy" exists** → criterion (a) confirmed; hint corrected to the verified RZ440.
- `subfield:global-health`: generator flagged weak criterion (a) (anchors on tropical medicine + medical geography, no dedicated range). **Live-verified at QC**: **LCC RA441 "World health. International cooperation" exists** → the dedicated classification home for global/international health; criterion (a) confirmed, flag retired. Sets the question "is a dedicated gate range present for global health?" to **yes** (no MeSH-as-gate precedent needed).

## §12 boundary rulings (precedent-setting — appended to docs/data-foundry.md §12)

1. **Radiology / medical-physics / nuclear-medicine three-way from LCC R895-920.** Ruled **distinct referents, all kept**: radiology (Q77604, clinical imaging specialty, ABR board) is a field; medical-physics (Q1120908, applied-physics discipline, AAPM — transferred from natural sciences per decision (30)) is a field; nuclear-medicine (Q214963, imaging+therapy subspecialty, ABNM) is a subfield of radiology. Distinct-referent precedent (QIS vs quantum-computing; optics vs AMO peer). A-flag on radiology retired.
2. **ABMS primary specialty = field; subspecialty = subfield.** Ruled the field/subfield level by the ABMS board structure, which the gate schemes corroborate at division level. **Fields** (independent ABMS member board + named LCC range/subclass + distinct community, even where LCC *shelves* them inside another subclass): psychiatry (UDC 616.89 own division), neurology (UDC 616.8 own division), anesthesiology (LCC RD78.3-87.3 named range), emergency-medicine (LCC RC86-88.9), physical-and-rehabilitation-medicine (LCC RM695-893 + RD792-811), family-medicine (LCC R729.5, added at QC). The LCC RC/RD *shelving* of psychiatry/neurology/anesthesiology/EM is the "shelving-is-not-a-hierarchy-claim" precedent (mathematical-logic / ASL-pillar pattern); the absorption rule does **not** fire because these serve communities distinct from their LCC-parent (anesthesiology is not a kind of surgery). **Subfields** (ABIM/surgical *subspecialties* under a primary field): cardiology, gastroenterology, endocrinology, nephrology, pulmonology, hematology, rheumatology, infectious-diseases, geriatrics, oncology (medical-oncology home RC254-282); orthopedic-surgery, neurosurgery, plastic-surgery, cardiothoracic-surgery, urology. A-flags on the five primary specialties retired with this ruling.
3. **nutrition-science demoted field→subfield (business precedent).** UDC 613.2 "Dietetics. Nutrition" is a *subdivision* of 613 (Hygiene), not a top 61x division; LCC anchors (RC620-627, RM214-258) are sub-ranges; despite field-level departments (Cornell/Harvard nutrition), classification rank is subfield (business demotion precedent 13a). Kept `ambiguous: true` (cross-continent: medicine UDC 613.2 vs life-sciences QP141 nutritional physiology) → stops at `proposed`; life-sciences §13 candidate parked for the edge batch.
4. **family-medicine added at QC (coverage gap).** The largest missing ABMS primary specialty. LCC R729.5 "Family medicine" (live-verified, within captured R728-733 Practice of medicine) + MeSH H02.403.340 General Practice + AAFP/family-medicine departments. Q3505712 (medical specialty, aliases family practice/general medicine). Completes ABMS primary-specialty coverage (only medical-genetics now a deliberate gap — §13/v2 candidate, clinical genetics overlaps life-sciences genetics).

## Absorptions (deliberate non-coverage, v2 re-split candidates — recorded, not emitted)

- critical-care-medicine → emergency-medicine (LCC RC86-88.9 bundles both; SCCM community real).
- hepatology → gastroenterology (FORD 3.2 joint naming "Gastroenterology/hepatology").
- allergy-and-clinical-immunology → internal-medicine (RC581-607; distinct from basic immunology Q101929 which is life-sciences §13).
- sports-medicine → absorbed (RC1200-1245 specialization).
- osteopathic-medicine → deliberate non-coverage: the US DO-physician (full-practice) vs international-osteopathy (manual therapy) referent split is a genuine modeling question (B-type escalation candidate), deferred.
- medical-genetics → deliberate gap (clinical genetics overlaps life-sciences genetics; §13/v2 candidate).

## Living-person / scope

Discipline nodes only — 0 person nodes (special discipline ①). 0 disease/condition nodes (modeled the discipline, not its object). 5 existing /data nodes reconciled-against, never re-proposed (domain:medicine-and-health Q11190, physiology Q521, anatomy Q514, immunology Q101929, biomedical-engineering Q327092); their medicine §13 memberships are the separate edge/resolution task.
