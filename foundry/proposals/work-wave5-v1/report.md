# work-wave5-v1 — report

**Session #53, 2026-07-02.** Phase-2 work layer wave 5 (keep-criteria W1–W5, co-canonical
decision (90), node-policy / canonical_work ladders). Separated-context Sonnet 5 proposal
generator (ADR 0007) — `generated`-tier only; QC and promotion in a separate orchestrator
context. Nothing written to `/data` by the generator.

_(Author's note: the generator's `report.md` write was blocked by the harness `.md` guard;
this file was committed verbatim by the orchestrator from the generator's returned content.)_

## 7 real candidates (all QIDs unverified best-guess, flagged for live re-resolution)

| Work | QID (unverified) | Author | Field | Year | Living? |
|---|---|---|---|---|---|
| Theory of Games and Economic Behavior | Q1188594 | von Neumann + Morgenstern (2 person edges) | subfield:game-theory | 1944 | No |
| Computing Machinery and Intelligence | Q1138524 | Turing | subfield:artificial-intelligence | 1950 | No |
| On Formally Undecidable Propositions... | Q1798944 | Gödel | subfield:mathematical-logic | 1931 | No |
| Opticks | Q1140309 | Newton | subfield:optics | 1704 | No |
| The Complexity of Theorem-Proving Procedures | Q30076200 | Cook | subfield:computational-complexity-theory | 1971 | **Yes — flagged** |
| The Concept of Truth in Formalized Languages | Q3986324 | Tarski | subfield:model-theory | 1933 | No |
| On Sense and Reference | Q1497216 | Frege | subfield:philosophy-of-language | 1892 | No |

## 2 reject probes (unmarked in edges.proposed.json; key in probes.md)
- Theory of Games misattributed to John Nash (real, adjacent, already-reviewed game-theory
  co-founder, not this book's author).
- Gödel's incompleteness paper's `canonical_work` retargeted to
  `subfield:philosophy-of-mathematics`, conflating with his genuine but differently-typed
  `influenced` edge there — tests relation-type discipline, not just wrong-field.

## Literature-boundary holds
None — all 7 are knowledge-works, nothing screened out under decision (86).

## Declined-to-propose (person gap, not a boundary hold)
Euclid, Kant, Aristotle, Kuhn — none exist as `person` nodes in `/data`, so W3 fails.
Also declined Hilbert's *Grundlagen der Geometrie* for proof-theory (wrong subfield fit).

## Structural notes for QC
- von Neumann/Morgenstern is the first co-authored work in this series — two
  `work → canonical_work → person` edges from one work node (decision (90) at the person axis).
- Gödel's field-level edge has a weaker anchor (no pre-existing `founded_or_formalized` to
  mathematical-logic, only `influenced` to philosophy-of-mathematics) — W1/W3-compliant but
  flagged for closer QC.

## Provenance
Every item: `model_name: "Claude Sonnet"`, `model_version: "claude-sonnet-5"`,
`proposed_at: "2026-07-02"`, status `generated`. The generator does not QC or promote.
