# QC report — cognitive-sciences skeleton v1

> Orchestrator (Opus) QC, session #21, 2026-06-18. Generation = Sonnet separate-context
> subagent (ADR 0007). 27 generated → **25 kept** (2 fields + 23 subfields). Domain
> `cognitive_sciences`, parent `domain:cognitive-sciences` (Q147638, reviewed, was 0 children).

## Hint-laundering sweep (standing rule — sessions #8–#19 pattern)

The captured gate this session is **LCC subclass BF only** (+ UDC 159.9 / MeSH F / FORD 5.1 /
Q147638). The generator cited several **uncaptured LCC cutters as "captured baseline 2026-06-18"** —
classification claims absent from `captured-sources.md`:

- `RC466-489` (clinical-psychology), `LB1050-1091` + `UDC 37.015.3` (educational-psychology),
  `HF5548.8` (industrial-and-organizational-psychology), `RA1148` (forensic-psychology),
  `RC386` (neuropsychology), `BF698.95` (evolutionary-psychology), `UDC 159.922` (developmental/
  comparative — captured granularity stopped at 159.92).

**Disposition:** these are not *fabricated* (RC/LB/HF/RA are real LCC classes, and the generator
*honestly* flagged the out-of-BF homes in `uncertainty`), but asserting them as "captured baseline"
when they were not captured is the laundering pattern. They are **not promoted to /data** (skeleton
nodes carry no `source_hint`; the part_of edge evidence is grounded only on captured BF/UDC/MeSH +
live Wikidata P31). The out-of-gate homes (LB/HF/RA) are exactly the **§13 cross-membership evidence**
for the edge batch — to be verified live there, not asserted here. **0 laundered claims reach /data.**

## §12 structural rulings (appended to docs/data-foundry.md precedent log)

1. **neuroscience = field by institutional independence** (no own LCC BF range — grounded via Q207011
   `academic discipline` + Society for Neuroscience + dedicated departments/PhD programs). Mirrors the
   medicine §12 ruling that ABMS/institutional independence grants field rank over LCC shelving
   (psychiatry/neurology over RC). A-type flag retired by ruling.
2. **biological-psychology ABSORBED → behavioral-neuroscience.** Wikidata models them as **one referent**
   (Q846566 "behavioral neuroscience", aliases *biological psychology / biopsychology / psychobiology*).
   §12 label rule (keep the research-area name over the teaching label): keep behavioral-neuroscience;
   "Biological Psychology"/"Biopsychology"/"Psychobiology" recorded as its translation aliases. Placed
   under field:neuroscience; APA-Division-6 psychology cross-membership is a §13 candidate (edge batch).
   v2 re-split candidate if the communities diverge.
3. **abnormal-psychology ABSORBED → clinical-psychology.** Fails criterion (b): no distinct department/
   society/degree — it is the undergraduate course label for the study of psychopathology, whose
   research/professional community **is** clinical psychology. The *Journal of Abnormal Psychology*
   renamed to *Journal of Psychopathology and Clinical Science* (2022), signalling the merger.
   "Abnormal Psychology" recorded as a clinical-psychology alias; v2 re-split candidate.
4. **§13 dual-home subfields kept reviewed, not capped at proposed.** clinical-psychology↔psychiatry,
   educational-psychology↔education(SS), industrial-and-organizational-psychology↔SS/management,
   health-psychology↔medicine, neuropsychology↔neurology(medicine), forensic-psychology↔law,
   computational-neuroscience↔CS — all have verified discipline QIDs and an unambiguous primary
   cognitive-sciences/psychology home (LCC BF community + APA divisions). The dual home is carried by
   **§13 edges (separate batch), not by stopping the node at proposed** (medicine physiology/anatomy
   precedent: §13 membership + reviewed, disputed-untagged). A-type "which home" flags retired by ruling.
5. **systems-neuroscience and affective-neuroscience kept.** systems-neuroscience = a non-overlapping
   level-of-analysis tier (circuits/dynamics; molecular→cellular→systems→cognitive) with named programs
   (MIT McGovern, Columbia Zuckerman, CSHL) — not a refinement of any kept node, so the absorption rule
   does not fire; established. affective-neuroscience = emerging (BF511-593 emotion gate + SCAN journal +
   Society for Affective Science 2013; Panksepp-named) — kept under the inclusion ethos with the
   `emerging` tag; v2 re-evaluation candidate.

## Boundary handoff (boundary table enforced — record-only, no nodes created)
- **linguistics / psycholinguistics / cognitive-linguistics:** humanities-residual owns (round 3 hum-A).
  BF309-499 shelves psycholinguistics as a topic; the discipline is NOT built here. **Record only.**
- **AI / machine-learning / HCI:** CS (Q11660 / Q2539 / Q207434 reviewed). No node. computational-
  cognitive-science carries the cogsci-side modeling content + §13-to-CS candidacy.
- **psychiatry / neurology / clinical-neuroscience:** medicine (Q7867 / Q83042). No node; §13/adjacent edges only.
- **anthropology / cognitive-anthropology:** SS (Q23404). Record only.
- **parapsychology, occult sciences, graphology, phrenology, palmistry (BF839.8-2055):** pseudoscience/
  non-academic objects — excluded entirely (not cogsci-owned; not status-tagged here).

## Resolution trigger — philosophy-of-cognitive-science (decision (43)④)
`subfield:philosophy-of-cognitive-science` (proposed, QID-less, humanities, PhilPapers slug) is the
upstream-gap resolution trigger on cognitive-science entry. Assessed separately (see promotion-report.md):
no forced promotion — grounding remains immature; honest gap retained. A §13 candidacy
(philosophy-of-cognitive-science ↔ cognitive-sciences) is recorded for the edge batch.

## Tension preservation (decision (42)(43))
Skeleton nodes are non-disputed disciplines (no `disputed` tags). No proposition-edge (critiques/
influenced) arose in the part_of skeleton, so the docs/data-foundry.md tension-preservation
codification **defers to the editorial-relation stage** per decision (43)④ (policy ahead of work; it
does not belong in a part_of-only PR). (42)② measurement ledger: **0 paradox/perspective-qualified
cases** inexpressible via disputed+note this session (the competing paradigms — behaviorism↔cognitivism,
symbolism↔connectionism, nature↔nurture, modularity↔embodiment — live at the proposition-edge layer,
which the skeleton does not populate).
