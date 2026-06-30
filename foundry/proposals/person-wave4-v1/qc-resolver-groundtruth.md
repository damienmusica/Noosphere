# person-wave4-v1 — Stage 2 resolver ground-truth (orchestrator, live Wikidata)

Resolved by label search (wbsearchentities) → EntityData multi-signal verification (P31=Q5 + P569 +
P570 + label/sitelink cross-check). **Not memory — live-fetched 2026-06-30.** Top hit confirmed as
the referent by label + description + birth/death years + sitelink count.

| candidate | QID (live) | P31 | P569 birth | P570 death | live status | path |
|---|---|---|---|---|---|---|
| Karl Marx | Q9061 | Q5 | 1818-05-05 | 1883-03-14 | deceased | founder ladder (auto) |
| Robert Koch | Q37193 | Q5 | 1843-12-11 | 1910-05-27 | deceased | founder ladder (auto) |
| Charles Sanders Peirce | Q187520 | Q5 | 1839-09-10 | 1914-04-19 | deceased | founder ladder (auto) |
| Alfred Russel Wallace | Q160627 | Q5 | 1823-01-08 | 1913-11-07 | deceased | founder ladder (auto) |
| **William Labov** | **Q357923** | Q5 | 1927-12-04 | **2024-12-17** | **DECEASED** | **founder ladder (auto) — NOT living v2** |
| George Lakoff | Q313772 | Q5 | 1941-05-24 | ABSENT | **living** | **v2 policy-auto** |
| Vint Cerf | Q92743 | Q5 | 1943-06-23 | ABSENT | **living** | **v2 policy-auto** |
| Internet (concept) | Q75 | (global system of connected computer networks, IP/routing) | — | — | concept | referent confirmed (≠ Q461 Archive / Q217082 IETF / Q35127 website) |

## ★ Design-relevant finding: William Labov is deceased (died 2024-12-17)

The scoping assumed Labov living (b.1927). **Live P570 verification shows he died 2024-12-17.** This is
exactly the **observe-only / safe-direction-drift** case the v2 design (§3) anticipated:

- We did **not** predict status from age — we **observed** P570 live and routed accordingly.
- Drift ran **living → deceased** (stricter → looser): had we mis-assumed living, we'd merely have been
  *more* careful than needed (harm 0). Observing corrects it to the lighter deceased path.
- **Effect on the batch:** Labov rides the **deceased founder ladder** (auto-`reviewed` if supported),
  not the living v2 path. `is_living_person: false`.
- **Effect on the measurement:** living N = **Lakoff + Cerf = 2** (not 3); deceased = **5** (Marx, Koch,
  Peirce, Wallace, Labov). The v2 first-execution headline still holds (Lakoff, Cerf are clean live
  founders); the Labov case becomes a *bonus* validation of the observe-only self-correction.

This is a plan-change-grade observation (scoped-living candidate turned out deceased) — reported, not a
blocking escalation (no disputed/NEI/thin-sourcing/private-content signal; the deceased path is strictly
safer).

## QID hallucination measurement (vs generator hints)
To be filled after the Stage 1 generator returns — compare generator `external_ids.wikidata` hints
against this live ground-truth.
