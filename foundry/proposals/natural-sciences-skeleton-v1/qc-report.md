# QC report — natural-sciences-skeleton-v1

- **QC:** Claude Fable 5 (orchestrator session #11), 2026-06-11. Generation: Claude Sonnet
  (claude-sonnet-4-6), separate context (ADR 0007 upheld; `nodes.proposed.json` preserves the raw
  44-node generated set; `proposal.json` is the QC-shaped 41-node set).
- **Inputs:** batch manifest (PR #63), §12 incl. precedent log (mandatory input), and the
  orchestrator's **live-captured 4-scheme baseline** (LCC Q outline PDF, UDC class 5 records via
  getrecord, OECD FORD section 1, PhySH disciplines JSON — all captured 2026-06-11 before
  generation; access paths in the manifest notes). The generator had no fetch tool: it cited the
  captured file as live and self-marked everything else [UNFETCHED]/training-knowledge.

## Disposition

| Measure | Count |
|---|---|
| Generated | 44 (generator self-report said 43 — off by one) |
| Kept | **41** (4 fields + 37 subfields) |
| Dropped | 3 (1 cross-continent deferral + 2 absorptions) |
| Gap-filled by QC | 0 (coverage duty satisfied by the generated set) |
| A-flags retired by QC ruling | 2 (optics, quantum-information-science) |
| A-flag left to the resolver | 1 (geology — QID collision concern only) |
| B-flags upheld | 7 (clause-6/v1.1 queue) |
| Hint-laundering caught | **1** (vs ~10 in session #8 — captured-baseline-only mandate works) |

## Drops (3) — live-verified grounds

1. **medical-physics → deferred to medicine-and-health continent** (§12 rule 3, both prongs
   out-of-continent, live-verified): LCC R outline (lcco_r.pdf, fetched 2026-06-11) files
   **R895-920 "Medical physics. Medical radiology. Nuclear medicine"** under class R Medicine;
   PhySH's captured 17 disciplines do **not** include it (the generator verified this itself);
   dominant institutional home is medical schools/hospitals (AAPM pattern). Bioinformatics/
   biostatistics precedent — waits for the medicine continent's skeleton. **New §12 precedent.**
2. **polymer-chemistry → absorbed into organic-chemistry** (graph-theory precedent): LCC
   QD380-QD388 "Polymers. Macromolecules" (id.loc.gov live) is a *subdivision* of organic
   chemistry, and UDC offers no major in-continent division; a single-scheme subdivision plus a
   strong society (ACS POLY, Macromolecules) is exactly the profile absorbed in formal sciences
   (graph theory: UDC 519.1 + giant community, still absorbed). **v2 re-split candidate, first in
   line with graph-theory.**
3. **computational-chemistry → absorbed into physical-chemistry**: no major division in either
   gate scheme; QD455.3 has no id.loc.gov authority record (404, live); and the generator's
   "PhySH-level classification can substitute" reasoning is **invalid outside the physics wing**
   (PhySH is ratified for physics-subfield granularity only — it does not cover chemistry).
   Strong community (WATOC, JCTC) recorded; **v2 re-split candidate.**

## A-flag rulings (retirements — appended to §12 precedent log)

- **optics: peer of AMO** (metaphysics/ontology pattern). LCC QC350-467 and UDC 535 are
  independent major divisions (both in the live capture); Optica community independent of DAMOP.
  PhySH's bundling into "Atomic, Molecular & Optical" is discipline-level compression, not a
  community merger — a discipline scheme's compression does not override two gate schemes'
  separate majors.
- **quantum-information-science: distinct node accepted.** PhySH "Quantum Information, Science &
  Technology" (gate-level here) names a broader referent than `subfield:quantum-computing`
  (communication, sensing, foundations beyond computing); absorption rule does not fire across
  distinct referents. The existing quantum-computing node and its natural-sciences membership are
  untouched; whether it re-targets to field:physics or nests under QIS is the edge batch's
  question (flat rule governs node levels, not edge depth).

## B-flags upheld (7 — promotion stops at `proposed`, clause-6 queue)

environmental-science (LCC GE class-G vs UDC 502/504 + FORD 1.5), biophysics (UDC 577/LCC QH505
biology homes vs PhySH discipline + split faculties), biochemistry (UDC 577 vs LCC QD415-436),
oceanography / hydrology / geomorphology (LCC class-G homes — GC/GB — vs UDC 551.46/556/551.4 +
FORD 1.5 + geoscience institutional homes), geodesy (geomatics/civil-engineering institutional
home vs LCC QB275-343 + UDC 528 both in-continent). All seven are genuine real-world boundary
contests; the formal-sciences pattern (14 contested → clause-6 batch resolution) applies — a
future session resolves them with the v1.1 external-evidence path, with §13 cross-listing
available where the evidence supports dual membership.

## Hint-laundering audit (mechanical, against the captured baseline)

Every `(captured baseline)` attribution in all 44 nodes was mechanically checked against the
captured file. **Exactly one violation:** electrochemistry cited "LCC QD552-585 (captured
baseline)" — not in the capture. QC live-verified the real range at id.loc.gov:
**QD551-QD578 "Electrochemistry. Electrolysis"** — the claim's substance was real with wrong
bounds; the hint is corrected in proposal.json with the laundering instance recorded. Session #8
measured ~10 laundered claims without the captured-baseline-only mandate; session #9 measured 2;
this batch: 1. The keep ruling for electrochemistry stands on the corrected dual-scheme evidence
(UDC 544.6 captured + LCC QD551-578 live) + independent ECS community (ASL-pillar pattern).

## Coverage duty

The generator's per-scheme coverage tables (LCC QB/QC/QD/QE, UDC 52-56 + 502/504, FORD
1.3/1.4/1.5) are accepted after spot-verification against the capture; QC added the complete
**PhySH 17/17 disposition** (proposal.json notes): 13 disciplines → kept nodes, 4 → recorded
non-coverage (Energy Science & Technology → engineering continent; Interdisciplinary Physics →
meta-facet; Networks → no in-continent classification home; Physics Education Research →
education cluster, mathematics-education pattern). Deliberate non-coverage v2 candidates
recorded by the generator and accepted: celestial mechanics, radiation physics, electromagnetism
(as standalone), radiation chemistry, photochemistry, stratigraphy + QC's general-relativity
note under the Gravitation discipline.

## Next step

Manifest seeds regenerated mechanically from the QC-passed proposal.json (41 seeds — CS/FS
precedent); resolver v4 runs locally next (first new-continent live run); per-QID verdicts will
land in `grounding-report.md`, promotion in `promotion-report.md`.
