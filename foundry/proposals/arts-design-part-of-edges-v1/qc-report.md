# QC report — arts-design-part-of-edges-v1

- **QC:** Claude Fable 5 (orchestrator session #13d, parallel round v1, merge order 4), 2026-06-11.
  Generation: Claude Sonnet (claude-sonnet-4-6), separate context (ADR 0007 upheld).
- **Inputs:** the 25 promoted arts-and-design nodes (`data/nodes.json`), the skeleton proposal's
  per-node parent observations (`arts-design-skeleton-v1/proposal.json` notes), §12 (part_of depth
  precedent) and §13 (cross-listing), and the live-captured baseline
  (`dist/foundry/captures/arts-design-skeleton-v1/`: lcco_m/n/t/p/g/s/h.txt, udc-7-captions.txt,
  udc_69.html, ford.html).

## Disposition

| Measure | Count |
|---|---|
| Generated | 27 |
| Kept | **26** (24 → reviewed-bound, 2 → proposed-capped) |
| Dropped by QC | 1 (drawing→design §13 — label-only grounding) |
| §13 dual memberships written | **1** (architecture: arts + engineering) |
| §13 candidates recorded, not written | 3 (drawing↔design, ceramic-arts↔decorative-arts, decorative-arts↔visual-arts) |
| Capped to `proposed` (endpoint-matched) | 2 (photography→visual-arts, urban-planning→architecture) |
| Hint-laundering caught | **0** (full-capture-set cross-check; the 12 first-pass parser flags were all real captions in ford.html/udc_69.html/QC-live LCC files) |
| Node-ID errors / self-loops / cap violations | 0 / 0 / 0 (mechanical) |

## The architecture §13 dual membership (task 7) — written

`field:architecture` carries **two co-equal `part_of` parents, no primary marker** (§13):

1. **→ domain:arts-and-design** (confidence 0.92): LCC subclass NA "Architecture" + UDC 72
   "Architecture" — both gate schemes name the discipline directly in their arts classes (both
   captured). FORD-side silence recorded (FORD 6.4's caption does not name architecture).
2. **→ domain:engineering-and-technology** (confidence 0.82): **LCC TH845-895 "Architectural
   engineering. Structural engineering of buildings"** (subclass TH, LCC class T technology —
   live-captured in lcco_t.txt) + UDC 69 "Building (construction) trade…" (live-captured) + FORD
   2.1 "Civil engineering" (captured). Targets the **domain directly** with a re-target note: no
   field-level engineering parent for architecture exists in /data yet (13c's promotion is a
   separate merge; quantum-computing/IR precedent — flat rule governs node levels, not edge depth).

**Why this clears the §13 anti-spam guard:** the second membership has discipline-naming parity
with the first. LCC files architecture under **two different top-level classes** that each name
it — NA "Architecture" (class N, fine arts) and TH845-895 "Architectural engineering" (class T,
technology). That is a genuine dual classification home, not editorial feel. **Cross-session
corroboration:** 13c's engineering QC report independently recorded TH845-895 + UDC 69 as the
engineering-side handoff evidence for this exact membership (the node and write-in being 13d's by
the boundary assignment table). The confidence asymmetry (0.92 vs 0.82) carries the relative
strength per §13 (asymmetry is per-edge data).

ISCED-F 073 "Architecture and construction" under broad field 07 Engineering is a known further
corroborant; it was **network-blocked in this cloud session** (UNESCO/Wikidata egress) and is
recorded as an optional future strengthener, not load-bearing — the LCC TH845-895 entry already
carries the gate.

## Drop (1) — §13 consistency

**drawing→design (§13 second membership): DROPPED, recorded as a §13 candidate.** The design-side
edge rested only on the shared LCC NC subclass label "Drawing. Design. Illustration" and the UDC
74 label "Drawing. Design. Applied arts and crafts" — i.e. the **same shelving location re-read
two ways**, not an independent discipline-naming class entry. A coordinate-subject bundling label
("Drawing. Design. Illustration" lists three peers in one subclass) is not a claim that drawing ⊂
design. §13's same-evidence-discipline guard is exactly what separates this (dropped) from
architecture (kept: TH845-895 is a *separate* class naming the discipline). `subfield:drawing`
keeps its sole parent `field:visual-arts` (LCC NC under class N + UDC 741/744).

## §13 candidates recorded, not written (3)

drawing↔design (above); ceramic-arts↔decorative-arts (UDC 738 under UDC 73 "Plastic arts" grounds
the visual-arts edge written; LCC NK3700-4695 grounds a decorative-arts reading — single edge per
scheme-primary, second awaits independent grounding); decorative-arts↔visual-arts (NK is under LCC
class N while UDC 745/749 is under UDC 74 design class — the design edge is written, the
visual-arts reading is a candidate). Each waits for a session that can ground a second scheme.

## Capped edges (2 — status `proposed`, endpoint-matched)

- **photography→visual-arts** (confidence 0.72): arts-side membership only; capped to match
  `subfield:photography` (proposed, B-flag). The technology-side §13 membership is the clause-6/
  v1.1 resolution hypothesis (UDC 77 arts vs LCC TR technology head-on split).
- **urban-planning→architecture** (confidence 0.72): capped to match `subfield:urban-planning`
  (proposed, multi-home B-flag). Promote both when the nodes resolve.

## Promotion mapping (evidence source IDs)

Reviewed/proposed edges fill `evidence` from the registered source registry: LCC citations →
`source:lcc-outline`, UDC → `source:udc-summary`, FORD → `source:oecd-ford`. No new source needs
registering (all three already in `data/sources.json`).

## §12 precedent candidates (for #14 — not appended by this session)

- **Discipline-naming parity is the §13 gate discriminator:** architecture's engineering membership
  is written because LCC files it under a *second top-level class that names the discipline*
  (TH845-895 "Architectural engineering"), whereas drawing's design membership is dropped because
  its second reading is only a shared-subclass coordinate-label — distinguishing genuine dual
  classification homes from shelving bundling.
- **Cross-session §13 evidence handoff works:** 13c recorded the engineering-side dossier for a
  node 13d owns; 13d live-re-verified and wrote the edge. The boundary-assignment-table single-owner
  rule plus a handoff note in the other branch's report is a clean pattern for round-internal §13.

## Next step

Promotion: 24 reviewed + 2 proposed edges into `data/edges.json` (`promotion-report.md` appendix in
this directory or the skeleton promotion report). Skeleton + edges complete the arts-design
continent's structural layer; editorial summaries deferred to the post-pay invoice (round ⑤).

## Promotion ledger (appended post-promotion, session #13d)

26 edges written to `data/edges.json` (236 → 262): **24 reviewed** (verified-node endpoints,
externally-sourced part_of, node policy/edge policy v1) + **2 proposed** (capped to their proposed
endpoints: photography→visual-arts, urban-planning→architecture). The architecture §13 pair both
landed reviewed (both endpoints reviewed; `domain:engineering-and-technology` is reviewed). Edge
`evidence` filled from the registered registry (`source:lcc-outline`, `source:udc-summary`,
`source:oecd-ford` — no new source registration needed). `/data` after: 276 nodes / 262 edges.
