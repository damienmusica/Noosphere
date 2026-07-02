# concept-layer-wave1-v1 — promotion report

**Session #52, 2026-07-02.** First concept-layer volume wave. Verdicts + anchors: `report.md`,
`qc-report.md`. CTO-autonomous build (decision (91) §7.1; concept keep-criteria C1–C4 pre-ratified).

## Promoted → `reviewed` (11 concept nodes)

Each: Wikidata QID resolver-verified **live** at QC (generator QIDs were 12/12 hallucinated →
re-resolved), referent = a concept (not a discipline/person), edge-demand satisfied via a `part_of`
edge to an existing `reviewed` field/subfield.

| Concept | QID | part_of | founder edge |
|---|---|---|---|
| natural-selection | Q43478 | evolutionary-biology | darwin `founded_or_formalized` ✓ |
| the-unconscious | Q192105 | psychoanalysis | freud ✓ |
| turing-machine | Q163310 | computability-theory | turing ✓ |
| nash-equilibrium | Q23389 | game-theory | nash ✓ |
| mendelian-inheritance | Q185055 | genetics | mendel ✓ |
| social-fact | Q972877 | sociology | durkheim ✓ |
| invisible-hand | Q376644 | economics | smith ✓ |
| intentionality | Q654390 | phenomenology | husserl — **founder edge held** (Brentano is the originator; single-founder attribution imprecise) |
| lambda-calculus | Q242028 | computability-theory | church ✓ |
| symbolic-ai | Q5514059 | artificial-intelligence | minsky — **founder edge held** (GOFAI co-founded by Newell/Simon/McCarthy/Minsky) |
| false-consciousness | Q2581738 | sociology | marx — recorded as **`influenced`** (the term is Engels/Lukács, not Marx's own writings — identity-axis caution, not `founded_or_formalized`) |

Edges promoted `reviewed`: 11 `part_of` + 8 `founded_or_formalized` + 1 `influenced` = 20.

## Held `proposed` (1 node + 3 edges)
- **`concept:bureaucracy` (Q72468)** — held: Q72468 models the *generic administrative system*, not
  Weber's sociological rational-legal ideal-type (referent-precision, C3). Its `part_of` and
  `max-weber-founded` edges held with it. Awaits a Weber-ideal-type referent.
- **Founder edges held (2)**: `husserl→intentionality`, `minsky→symbolic-ai` (attribution nuance above)
  — the concept nodes still promote via their `part_of` edge-demand.

## Ledger
Nodes 581→593 (+11 `reviewed` concept, +1 `proposed`). Edges +20 `reviewed` + 3 `proposed`.
Schema/taxonomy/sources unchanged.
