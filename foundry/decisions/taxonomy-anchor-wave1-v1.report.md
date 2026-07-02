# taxonomy-anchor-wave1-v1 — promotion decision report

**Decided 2026-07-02** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/taxonomy-anchor-wave1-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (5 errors) — this decision does not apply cleanly:
> - promotions: node subfield:computer-systems has status "reviewed", expected "proposed"
> - promotions: node subfield:databases-and-information-systems has status "reviewed", expected "proposed"
> - promotions: node subfield:distributed-and-parallel-computing has status "reviewed", expected "proposed"
> - promotions: node subfield:naval-architecture-and-marine-engineering has status "reviewed", expected "proposed"
> - promotions: node subfield:sensation-and-perception has status "reviewed", expected "proposed"

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `subfield:computer-systems` | **supported** | — | — | 3 (3) | v1.4: clause-1 = acm_ccs 'Computer systems organization'; clause-2 = ACM TOCS (dedicated journal, scope verbatim) + USENIX (professional association of the computing-systems community); clause-3 = the rejected wrong referents (Q105981125 orphan stub, Q428691 computer engineering) recorded in qid-gap-recheck-v1; clause-4 = Wikidata re-checked same day (qid-gap-recheck-v1: no discipline entity). |
| `subfield:databases-and-information-systems` | **supported** | — | — | 3 (3) | v1.4: clause-1 = acm_ccs 'Information systems' (umbrella incl. Data management systems); clause-2 = ACM SIGMOD (field society, mission verbatim) + VLDB Endowment (VLDB Journal since 1992, purpose verbatim); clause-3 = journal/article referents rejected (goldenset); clause-4 = Wikidata re-checked same day (qid-gap-recheck-v1). |
| `subfield:distributed-and-parallel-computing` | **supported** | — | — | 3 (3) | v1.4: clause-1 = acm_ccs ID-set (Parallel + Distributed computing methodologies); clause-2 = IPDPS (premier IEEE symposium of the combined community, 40th edition) + JPDC (dedicated journal whose exact title names the combined field); clause-3 = component-anchor rejection of Q180634 alone stands superseded by the ratified ID-set ruling (the SET covers what the single component could not); clause-4 = Wikidata re-checked same day (qid-gap-recheck-v1). |
| `subfield:naval-architecture-and-marine-engineering` | **supported** | — | — | 3 (3) | v1.4: clause-1 = nces_cip 14.2201 (exact combined label); clause-2 = SNAME (the field's society, mission verbatim) + RINA (Royal Institution of Naval Architects); clause-3 = combined-stub Q101910631 and component Q1136352 rejections stand (qid-gap-recheck-v1); clause-4 = Wikidata re-checked same day. |
| `subfield:sensation-and-perception` | **supported** | — | — | 3 (3) | v1.4: clause-1 = apa_psycinfo 2320; clause-2 = Attention, Perception, & Psychophysics (Psychonomic Society dedicated journal, aims verbatim) + LCC BF231-BF299 authority record (id.loc.gov live) with UDC 159.93 already gate-grade from the cognitive-sciences skeleton baseline; clause-3 = Q160402 'perception' (process concept) and Q500096 'psychophysics' (narrower) rejections stand; clause-4 = Wikidata re-checked same day. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `subfield:computer-systems` | acm_ccs:Computer systems organization | ✓ | manual | 2026-07-02 | ACM CCS 2012 top-level category 'Computer systems organization' verified verbatim on the Wayback capture of dl.acm.org/ccs (dl.acm.org is hard bot-blocked; T4 via the established Wayback existing-snapshot path). Category name = the stable CCS slug. |
| `subfield:databases-and-information-systems` | acm_ccs:Information systems | ✓ | manual | 2026-07-02 | ACM CCS 2012 top-level category 'Information systems' verified verbatim on the Wayback capture; it contains 'Data management systems' (also verified verbatim), so the single category umbrellas BOTH components of the compound node — passing the session-#11 umbrella test that Wikidata's Q64812807 failed. |
| `subfield:distributed-and-parallel-computing` | acm_ccs:Parallel computing methodologies; Distributed computing methodologies | ✓ | manual | 2026-07-02 | Compound-label ID-SET anchor per taxonomy-authority criteria v1 ruling: no single CCS category umbrellas the pair, so the node anchors on the minimal set — CCS 2012 'Parallel computing methodologies' + 'Distributed computing methodologies' (both verified verbatim on the Wayback capture), jointly covering the combined IEEE-TPDS-style community. Semicolon-joined per the ratified shape. |
| `subfield:naval-architecture-and-marine-engineering` | nces_cip:14.2201 | ✓ | manual | 2026-07-02 | NCES CIP 2020 code 14.2201 'Naval Architecture and Marine Engineering' — exact combined-label match, definition verbatim on the live nces.ed.gov detail page ('No Substantive Changes' since CIP 2010). T2 note: CIP anchors the teaching-community field referent. NOTE: an earlier memory-sourced candidate code 14.2401 was WRONG (that is Ocean Engineering) — corrected by live verification, which is why criteria demand live checks. |
| `subfield:sensation-and-perception` | apa_psycinfo:2320 | ✓ | manual | 2026-07-02 | APA PsycInfo Classification code 2320 'Sensory Perception' under 2300 'Human Experimental Psychology' — verified verbatim on the official live apa.org classification page ('Every record in APA PsycInfo receives a classification code, which is used to categorize the document according to the primary subject matter.'). |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `subfield:computer-systems` | node proposed→reviewed | reviewed | node-promotion-v1.4 |
| `subfield:databases-and-information-systems` | node proposed→reviewed | reviewed | node-promotion-v1.4 |
| `subfield:distributed-and-parallel-computing` | node proposed→reviewed | reviewed | node-promotion-v1.4 |
| `subfield:naval-architecture-and-marine-engineering` | node proposed→reviewed | reviewed | node-promotion-v1.4 |
| `subfield:sensation-and-perception` | node proposed→reviewed | reviewed | node-promotion-v1.4 |

## Tally

- Adds: 0 nodes, 0 edges, 0 sources, 0 translations, 0 external links.
- Reviewed outcomes: 0 adds + 5 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (2):
  - `subfield:judgment-and-decision-making`: v1.4 clause-1 candidate ELIMINATED by live verification (2026-07-02): the APA PsycInfo Classification contains NO judgment/decision category (2300 Human Experimental Psychology subcodes checked in full; 2340 Cognitive Processes is the nearest umbrella but does not name the field). SJDM society + its journal remain clause-2 material without a clause-1 taxonomy anchor. Parked honestly until a qualifying taxonomy authority for the area appears (taxonomy-authority criteria v1) or a Wikidata discipline entity is created upstream (machine recheck via foundry/batches/qid-gap-recheck-v1.json). (recheck: machine)
  - `subfield:computational-cognitive-science`: No qualifying clause-1 taxonomy authority exists (taxonomy-authority criteria v1 sweep, 2026-07-02): Cambridge Handbook of Computational Cognitive Sciences (CUP 2023) + journal Computational Brain & Behavior are clause-2 material only. Parked honestly until a qualifying taxonomy authority appears or a Wikidata discipline entity is created upstream (machine recheck via foundry/batches/qid-gap-recheck-v1.json). (recheck: machine)

## §8 permanence anchors

- https://dl.acm.org/ccs → https://web.archive.org/web/20260509235215/https://dl.acm.org/ccs
- https://dl.acm.org/journal/tocs → https://web.archive.org/web/20251118145429/https://dl.acm.org/journal/tocs
- https://www.usenix.org/about/ → https://web.archive.org/web/20260630190936/https://www.usenix.org/about/
- https://sigmod.org → https://web.archive.org/web/20260609234806/https://sigmod.org/
- https://vldb.org → https://web.archive.org/web/20260610203152/https://www.vldb.org/
- https://www.ipdps.org → https://web.archive.org/web/20260702132625/https://www.ipdps.org
- https://www.sciencedirect.com/journal/journal-of-parallel-and-distributed-computing → https://web.archive.org/web/20260201164653/https://www.sciencedirect.com/journal/journal-of-parallel-and-distributed-computing
- https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cipid=90538 → https://web.archive.org/web/20260406071303/https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cipid=90538
- https://www.sname.org → https://web.archive.org/web/20260527201158/https://sname.org/
- https://rina.org.uk → https://web.archive.org/web/20260627071552/https://www.rina.org.uk/
- https://www.apa.org/pubs/databases/training/class-codes → https://web.archive.org/web/20260702133104/https://www.apa.org/pubs/databases/training/class-codes
- https://link.springer.com/journal/13414 → https://web.archive.org/web/20260519004942/https://link.springer.com/journal/13414
- https://id.loc.gov/authorities/classification/BF231-BF299.json → https://web.archive.org/web/20260123070036/https://id.loc.gov/authorities/classification/BF231-BF299.json
- https://sigmod.org — [SPN-FAILED] fresh save did not materialize; using 23d-old snapshot
- https://vldb.org — [SPN-FAILED] fresh save did not materialize; using 22d-old snapshot
- https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cipid=90538 — [SPN-FAILED] fresh save did not materialize; using 87d-old snapshot
- https://www.sname.org — [SPN-FAILED] fresh save did not materialize; using 36d-old snapshot
- https://id.loc.gov/authorities/classification/BF231-BF299.json — [SPN-FAILED] fresh save did not materialize; using 160d-old snapshot

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
