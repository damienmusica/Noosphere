# QC report — natural-sciences-part-of-edges-v1

- **QC:** Claude Fable 5 (orchestrator session #11), 2026-06-11. Generation: Claude Sonnet
  (claude-sonnet-4-6), separate context (ADR 0007). `proposal.json` is the generated set; the QC
  verdicts and promotion are recorded here and in `promotion-report.md` (no reshaping was needed —
  the generated structure was accepted whole, a first for an edge batch).

## Disposition

| Measure | Count |
|---|---|
| Generated edges | 44 (41 primary memberships + 3 §13 co-equal second memberships) |
| Accepted | **44/44** (structure unchanged) |
| Coverage | 41/41 skeleton nodes have exactly one primary membership ✓ |
| Hint-laundering | **0** (one checker hit — atmospheric-science "UDC 551.5/551.58" — was a notation-join false positive: both records exist separately in the capture) |
| Clause-3 status caps | 7 (edges whose source node is a B-flag `proposed` node) |
| §13 second memberships | 3, all dual filings recorded at skeleton QC ✓ |

## Structural verdicts

- **Primary-parent distribution:** physics ← 14 (incl. quantum-information-science on PhySH
  grounding), chemistry ← 7, astronomy ← 4 (incl. geodesy — UDC 528/LCC QB275-343 put its
  in-continent home in the astronomy wing; the node's B-contest caps the edge, it does not
  override the classification evidence), earth-sciences ← 12, domain ← 4 fields. No nesting
  proposed (no un-contradicted gate-scheme nesting existed — the CIS depth rule had nothing to
  fire on; flat-to-field throughout).
- **§13 seconds accepted (all reviewed):** geophysics → physics (LCC QC801-809 vs UDC 550.3 —
  the classic physics/earth dual filing), atmospheric-science → physics (LCC QC851-999 vs UDC
  551.5/551.58), mineralogy → chemistry (UDC 549 under class 54 vs LCC QE351-399.2). Each edge
  carries its own captured grounding; co-equal, no primary marker (§13).
- **Crystallography single membership confirmed:** both gate schemes file it in the chemistry
  class (UDC 548 under 54; LCC QD901-999) — no physics-side filing exists in any capture; the
  generator's request for confirmation is answered: no §13 second edge.
- **Confidence handling accepted:** 1.0 only for scheme-unanimous placements; 0.75–0.9 where a
  scheme disagrees, is out-of-continent, or PhySH is the sole gate anchor.

## Orchestrator items executed in the same cycle (recorded re-target triggers)

1. **quantum-computing membership re-target** (recorded trigger, math-ed precedent):
   `edge:quantum-computing-part-of-natural-sciences` → renamed
   `edge:quantum-computing-part-of-physics`, target `field:physics`. Grounding unchanged (MSC
   81P68 under 81 Quantum theory; arXiv quant-ph; IQIM/JQI physics anchors) — the evidence always
   pointed at physics; only the missing continent context had forced the domain anchor.
2. **mathematical-physics §13 physics membership** (clause-6 minority side, §13 route):
   `edge:mathematical-physics-part-of-physics` (reviewed; conf 0.8) — LCC QC19.2-QC20.85
   "Mathematical physics" re-verified live at id.loc.gov this session; arXiv math-ph sits in the
   Physics group with math.MP as its mathematics alias (live) — the scheme itself dual-files the
   referent. **Disputed retired on the node and the mathematics edge** (session-#7
   interpretation: an other-parent filing is a supporting vote, not a premise denial; the
   minority record stays in the note as permanent evidence). Remaining disputed: nodes 5
   (operations-research, mathematical-biology, financial-mathematics, bayesian-statistics,
   time-series-analysis), edges 4.
3. **source:physh registered** (CC0, licensing snapshot recorded) — first use as edge evidence
   (physics-wing PhySH-grounded edges).
