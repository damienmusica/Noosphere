# qid-wave-edges-v1 — promotion decision report

**Decided 2026-07-03** · QC by Claude Opus 4.8 (`claude-opus-4-8`) · generated from `foundry/decisions/qid-wave-edges-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (5 errors) — this decision does not apply cleanly:
> - promotions: edge edge:computer-systems-part-of-computer-science has status "reviewed", expected "proposed"
> - promotions: edge edge:databases-and-information-systems-part-of-computer-science has status "reviewed", expected "proposed"
> - promotions: edge edge:distributed-and-parallel-computing-part-of-computer-science has status "reviewed", expected "proposed"
> - promotions: edge edge:naval-architecture-and-marine-engineering-part-of-engineering-and-technology has status "reviewed", expected "proposed"
> - promotions: edge edge:sensation-and-perception-part-of-psychology has status "reviewed", expected "proposed"

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `edge:computer-systems-part-of-computer-science` | **supported** | ✓ | — | 1 (1) | Structural placement grounded on the field's own ratified taxonomy: 'Computer systems organization' is a TOP-LEVEL branch of the ACM Computing Classification System — placement inside computing by construction (offline claim-anchor vs the Wayback capture; dl.acm.org hard bot-blocked, T4 Wayback path). Skeleton evidence (acm-ccs, udc-summary, msc2020) unchanged; the only blocker was the endpoint's proposed status, resolved by taxonomy-anchor-wave1-v1. |
| `edge:databases-and-information-systems-part-of-computer-science` | **supported** | ✓ | — | 1 (1) | 'Information systems' (containing 'Data management systems') is a top-level branch of the ACM Computing Classification System — placement inside computing by construction (offline claim-anchor vs Wayback capture). Skeleton evidence unchanged; blocker was endpoint status, resolved. |
| `edge:distributed-and-parallel-computing-part-of-computer-science` | **supported** | ✓ | — | 1 (1) | The node's ratified ID-set anchor ('Parallel computing methodologies; Distributed computing methodologies') consists of two branches of the ACM Computing Classification System — placement inside computing by construction (offline claim-anchor vs Wayback capture). Skeleton evidence unchanged; blocker was endpoint status, resolved. |
| `edge:naval-architecture-and-marine-engineering-part-of-engineering-and-technology` | **supported** | ✓ | — | 1 (1) | CIP 14.2201 sits in CIP series 14 (Engineering) and its live definition describes the program as applying principles to design/development and 'the analysis of related engineering problems' — engineering placement verbatim on the live nces.ed.gov page (fetch-verify PASS today). Skeleton evidence (lcc-outline, udc-summary incl. UDC 629.5 watercraft engineering) unchanged; blocker was endpoint status, resolved. |
| `edge:sensation-and-perception-part-of-psychology` | **supported** | ✓ | — | 1 (1) | APA PsycInfo Classification places code 2320 (Sensory Perception) under 2300 'Human Experimental Psychology' — placement inside psychology by the field's own classification (apa.org serves a JS shell to plain fetchers; verified offline vs the 2026-07-02 Wayback capture, T4 Wayback path). Skeleton evidence (LCC BF231-299, UDC 159.93) unchanged; blocker was endpoint status, resolved. |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `edge:computer-systems-part-of-computer-science` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |
| `edge:databases-and-information-systems-part-of-computer-science` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |
| `edge:distributed-and-parallel-computing-part-of-computer-science` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |
| `edge:naval-architecture-and-marine-engineering-part-of-engineering-and-technology` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |
| `edge:sensation-and-perception-part-of-psychology` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |

## Tally

- Adds: 0 nodes, 0 edges, 0 sources, 0 translations, 0 external links.
- Reviewed outcomes: 0 adds + 5 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.

## §8 permanence anchors

- https://dl.acm.org/ccs → https://web.archive.org/web/20260509235215/https://dl.acm.org/ccs
- https://www.apa.org/pubs/databases/training/class-codes → https://web.archive.org/web/20260702133104/https://www.apa.org/pubs/databases/training/class-codes

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
