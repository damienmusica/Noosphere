# Cognitive-sciences part_of edges v1 — batch report

Session #21, 2026-06-18. Structural `part_of` skeleton for the cognitive-sciences continent +
the first §13 cross-listings. Generation = Sonnet separate-context subagent (25 part_of edges);
QC + the 2 §13 edges = orchestrator (Opus).

## Promoted: 27 edges (24 reviewed / 3 status-capped proposed)

**25 primary part_of (Sonnet-generated → QC):**
- 2 fields → domain:cognitive-sciences (psychology, neuroscience)
- 17 psychology subfields → field:psychology
- 5 neuroscience subfields → field:neuroscience
- 1 computational-cognitive-science → domain:cognitive-sciences (integrative, attaches to the domain)
- **3 status-capped at proposed** (clause 3, edge status ≤ min endpoint — QID-less proposed source nodes):
  sensation-and-perception, judgment-and-decision-making, computational-cognitive-science.

**2 §13 co-equal cross-listings (orchestrator-authored, Opus, decision (21) cross-listing v1):**
- `edge:behavioral-neuroscience-part-of-psychology` (confidence 0.9): within-continent dual filing —
  Q846566 P31 "branch of psychology" + APA Division 6. Co-equal with the neuroscience home; the node
  absorbed biological-psychology, so its psychology membership is structurally explicit. No disputed tag.
- `edge:educational-psychology-part-of-education` (confidence 0.85): cross-continent dual filing to
  social-sciences — Wikidata Q59157 is P279 subclass-of psychology **and** educational sciences (Q861641)
  and P361 part-of educational sciences (live-verified). Psychology home primary; education co-home. No disputed tag.

## QC — edge-laundering sweep (full)
0 laundered claims of 25. Evidence cites only the captured source set (`source:lcc-outline` BF ranges,
`source:udc-summary` 159.9x, `source:mesh` F01, `source:wikidata` P31) — no fabricated LCC cutters in
edge notes (the generator's *skeleton*-batch source_hints had carried uncaptured cutters RC/LB/HF/RA;
those were stripped at node QC and do not appear in edge evidence). Hierarchy 25/25 reconciled to
canonical node IDs; relation/confidence/evidence_kind uniform.

## §13 candidates RECORDED (not written — target absent, grounding thin, or adjacency not membership)
- computational-cognitive-science ↔ CS, computational-neuroscience ↔ CS: §13 to field:computer-science —
  source nodes QID-less / no captured CS classification grounding; deferred to the editorial/edge stage.
- clinical-psychology ↔ psychiatry, neuropsychology ↔ neurology, health-psychology ↔ medicine:
  **adjacency, not membership** — belong to the editorial `adjacent_to` stage (decision (43)④ defers
  proposition/editorial-edge codification), recorded as candidates.
- forensic-psychology ↔ law (field:law / subfield:jurisprudence exist): application-adjacency; candidate.
- industrial-and-organizational-psychology ↔ management: target node absent (no field:management) — parked.
- philosophy-of-cognitive-science ↔ domain:cognitive-sciences: resolution-trigger §13 candidate
  (philosophy-side node is proposed/QID-less; recorded, not written — see skeleton promotion-report.md).

## Tension preservation (decision (42)(43))
No proposition-edge (critiques/influenced) arose — the part_of skeleton is membership-only. Codification
of the tension-preservation rule into docs/data-foundry.md therefore **defers to the editorial-relation
PR** per decision (43)④ (policy ahead of work; not retrofitted into a part_of-only batch). 0 disputed tags.
