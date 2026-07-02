# concept-wave2-v1 — report

**Session #53, 2026-07-02.** Second concept-layer wave (decision (91) §8 C1-C4 keep-criteria,
node-policy v1, CTO-autonomous build track). Separated-context Sonnet 5 proposal generator
(ADR 0007) — this batch is `generated`-tier only; QC and promotion happen in a separate
orchestrator context. Nothing here is written to `/data` by the generator.

_(Author's note: the generator's `report.md` write was blocked by the harness `.md` guard;
this file was committed verbatim by the orchestrator from the generator's returned content.)_

## Scope and method
Read docs/data-foundry.md §8 (C1-C4), docs/relation-taxonomy.md, src/schema/node.ts /
edge.ts, mirrored concept-layer-wave1-v1's exact shape. Cross-checked every endpoint
against data/nodes.json + data/edges.json before writing any candidate — all confirmed
`reviewed`. Einstein, Kant, Descartes, Ricardo are NOT person nodes in the corpus —
ruled out general/special relativity, categorical imperative, cogito, comparative
advantage outright (the order's examples were illustrative of kind only).

## Counts
- 12 node proposals: 10 real + 2 unmarked reject probes (probes.md).
- 24 edges: 12 part_of + 12 founded_or_formalized (one pair per node).
- 0 reconciled to existing (no duplicate concept IDs vs. the 19 already in data/nodes.json).
- 8/12 nodes ambiguous:true (higher than wave-1 — humanities/philosophy skew, genuinely
  contested single-founder attribution for Peirce/pragmatism, Nietzsche/continental-phil).

## Real candidates (10)
| Concept | Best-guess QID (UNVERIFIED) | Founder | part_of target | ambiguous |
|---|---|---|---|---|
| concept:cardinality | Q189206 | person:georg-cantor | subfield:set-theory | true |
| concept:godel-numbering | Q1201322 | person:kurt-godel | subfield:mathematical-logic | true |
| concept:law-of-universal-gravitation | Q83104 | person:isaac-newton | field:physics | false |
| concept:will-to-power | Q1783735 | person:friedrich-nietzsche | subfield:continental-philosophy | true |
| concept:linguistic-sign | Q1930888 | person:ferdinand-de-saussure | subfield:semiotics | true |
| concept:pragmatic-maxim | Q7238219 | person:charles-sanders-peirce | subfield:pragmatism | true |
| concept:sense-and-reference | Q1290165 | person:gottlob-frege | subfield:philosophy-of-language | false |
| concept:boolean-algebra | Q131012 | person:george-boole | subfield:mathematical-logic | false |
| concept:positivism | Q179599 | person:auguste-comte | field:sociology | true (HIGH referent risk, self-flagged) |
| concept:distinctive-feature | Q1201380 | person:roman-jakobson | subfield:phonology | true |

All QIDs are unverified generator hints — expect most/all wrong per wave-1's ~100%
measured hallucination rate; not checked live in the generator session.

## Reject probes (2, unmarked)
- concept:incompleteness-theorems — wrong-founder trap (attributed to David Hilbert
  instead of Kurt Godel; both real reviewed persons, plausible misattribution).
- concept:structuralism — C3 over-broad-discipline-label trap (movement, not a concept;
  mirrors wave-1's bureaucracy failure mode but marked ambiguous:false to test whether
  QC catches an unflagged instance, not only the self-flagged one).
Full mapping/reasoning/expected verdicts: probes.md.

## Provenance
Every node/edge carries proposed_by: { model_name: "Claude Sonnet", model_version:
"claude-sonnet-5", proposed_at: "2026-07-02" }. Status = generated on everything.
This generator does not QC, score, or promote its own output.
