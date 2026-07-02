# concept-wave2-v1 — orchestrator QC report

**Session #53, 2026-07-02.** Separated-context Sonnet 5 generation (ADR 0007) → orchestrator
(Opus) live QID re-resolution + referent-precision (C1–C4) + founder-attribution QC + probe
scoring. **Generator QIDs 12/12 hallucinated (100%)** — re-confirming the load-bearing
separated-generation + live-verification contract (every hinted QID resolved to an unrelated
entity: Q189206=vesicle, Q83104=Italian comune, Q1783735=Synods of Troyes, Q7238219=South
African settlement, Q1201380=German politician, etc.).

## Verdicts

| # | Candidate | Verdict | Live QID | Basis |
|---|---|---|---|---|
| 1 | concept:cardinality | **HOLD** | Q4049983 / Q163875 | Referent ambiguity: "cardinality" (Q4049983, no P31) vs "cardinal number" (Q163875) vs transfinite-number — the id/label don't cleanly bind one QID (C3). set-theory already carries Cantor's founder + canonical_work (Grundlagen). Deferred pending a deliberate referent choice — the disciplined C3 hold (bureaucracy/positivism class). |
| 2 | concept:godel-numbering | **PROMOTE** | Q1451046 | Concept item ("assignment of a unique natural number to each formal-language expression"). Gödel (d.1978) introduced it in the 1931 paper. |
| 3 | concept:law-of-universal-gravitation | **PROMOTE** | Q134465 | P31=Q214070 physical law. Newton (d.1727), Principia 1687. |
| 4 | concept:will-to-power | **PROMOTE** | Q583998 | P31=Q131841 idea; P50=Q9358 Nietzsche on the item itself. Founder edge = founded_or_formalized (his own concept), distinct from the existing influenced→continental-philosophy edge. |
| 5 | concept:linguistic-sign | **HOLD** | Q25583047 | The only label-matching item (Q25583047) has **no P31 and no description** — too sparse to verify the referent is Saussure's signifier/signified dyad vs a stub. semiotics already carries Saussure's founder edge. Hold on referent-verifiability. |
| 6 | concept:pragmatic-maxim | **PROMOTE** | Q1780130 | Wikidata description "maxim of logic formulated by Charles Sanders Peirce" — referent unambiguous even without upstream P31. Peirce (d.1914). Completes a new Peirce→pragmatism founder triangle. |
| 7 | concept:sense-and-reference | **DROP** | Q330955 | The only clean item (Q330955) is Frege's *paper* ("mathematical paper by Gottlob Frege"), not a distinct concept referent → modeled once, as `work:on-sense-and-reference` in work-wave5. Avoids double-modeling the same underlying thing. |
| 8 | concept:boolean-algebra | **HOLD** | Q173183 / Q4973304 | Q173183's P31=Q1936384 "branch of mathematics" (disciplinary, C3 fail — the bureaucracy mode); Q4973304 is the structure. mathematical-logic already carries Boole's founder + canonical_work (Laws of Thought). Hold on branch-vs-structure referent. |
| 9 | concept:positivism | **HOLD** | Q131015 | Self-flagged HIGH referent risk, confirmed: Q131015 is the broad epistemological doctrine spanning philosophy-of-science + logical-positivism (a distinct existing concept node), not Comte's specific sociological programme. Over-broad (bureaucracy class). |
| 10 | concept:distinctive-feature | **PROMOTE** | Q1152224 | Wikidata description "the most basic unit of phonological structure" — referent clear. Jakobson (d.1982). Record-not-resolve: co-developed with Halle & Fant (not yet nodes); Jakobson is the standardly-credited originating figure. |
| P1 | concept:incompleteness-theorems | **REJECT (probe ✓)** | — | Founder edge attributes the incompleteness theorems to **David Hilbert**; the prover is **Kurt Gödel** — Hilbert is the figure whose programme they *refuted* (opposite of `founded_or_formalized`). Identity-axis misattribution. Sat deliberately beside the legitimate godel-numbering candidate; QC did not pattern-match "any Gödel-adjacent node is the trap." |
| P2 | concept:structuralism | **REJECT (probe ✓)** | — | "Structuralism" is a cross-disciplinary movement/method, not a field-internal concept (C3 over-broad-label, the bureaucracy mode); the single-founder `founded_or_formalized→Saussure` also overclaims a multi-stranded movement. Marked `ambiguous:false` to test unflagged detection — caught. |

## Tally
- **Promote → auto-`reviewed`** (5): godel-numbering, law-of-universal-gravitation,
  will-to-power, pragmatic-maxim, distinctive-feature — 5 concept nodes + 10 edges
  (5 `part_of` + 5 `founded_or_formalized`). All founders deceased → no living-person guard.
- **Held** (4): cardinality, linguistic-sign, boolean-algebra, positivism (referent
  ambiguity / sparse QID / over-broad-label — all C3-discipline holds, not added to /data).
- **Dropped** (1): sense-and-reference (= the paper; handled as a work).
- **Reject probes fired** (2/2): incompleteness-theorems, structuralism.
- Claim-level hallucination: 0. Generator QID hallucination: 12/12 caught.

## §8 permanence anchors (promoted concepts) — live-verified 2026-07-02
- `concept:godel-numbering` — https://en.wikipedia.org/w/index.php?title=G%C3%B6del_numbering&oldid=1343580865
- `concept:law-of-universal-gravitation` — https://en.wikipedia.org/w/index.php?title=Newton's_law_of_universal_gravitation&oldid=1361608324
- `concept:will-to-power` — https://en.wikipedia.org/w/index.php?title=Will_to_power&oldid=1325900804
- `concept:pragmatic-maxim` — https://en.wikipedia.org/w/index.php?title=Pragmatic_maxim&oldid=1354168397
- `concept:distinctive-feature` — https://en.wikipedia.org/w/index.php?title=Distinctive_feature&oldid=1337515400
