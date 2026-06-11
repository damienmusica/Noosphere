# Grounding report — engineering-technology-skeleton-v1

- **Resolver:** v4 (PR #59), run locally 2026-06-11 under the round network lock (`/tmp/noosphere-net-lock/`,
  protocol ③) against the QC-regenerated 31-seed manifest. Source pack:
  `dist/foundry/source-packs/engineering-technology-skeleton-v1/wikidata.json` (gitignored draft).
- **Verdicts:** orchestrator (Claude Fable 5, session #13c), multi-signal discipline — no QID-only
  lookups, no bare label matching; sitelink+alias rule (decision (9)); umbrella test for component
  anchors (§12, session #11).

## Summary

| Measure | Value |
|---|---|
| Seeds | 31 (QC-passed set) |
| Resolved / unresolved | 31 / 0 |
| Resolver-flagged ambiguous | 9 (manual review per v4 contract — auto-accept 0) |
| Compound-label fallback firings | 2 (construction-engineering, naval-architecture-and-marine-engineering) — both forced-ambiguous |
| **Final: verified QIDs** | **30** (22 rank-1 auto + 8 manual confirmations) |
| **Final: honest upstream gap** | **1** (naval-architecture-and-marine-engineering) |
| Resolver–QC agreement | **30/31 (96.8%)** (the one disagreement is the NAME fallback selection, rejected by the umbrella test) |
| Generator QID-hint hallucination | **26/31 (84%)** (hint = final QID in only 5 cases; trend 93→71→72→80→84) |
| Golden set | 199 → **230** (+31); regression on prior batches: 0 (199 skipped — packs not re-run, CI unaffected) |
| Watch items | +1 (textile-engineering Q20825773 — 0-sitelink thin anchor) |

## Manual confirmations (8 — resolver rank-1 confirmed by orchestrator)

1. **field:electrical-engineering → Q43035** — runner-up Q12346906 is a 0-enwiki thin double;
   accepted on exact label + enwiki + P31 academic-major/discipline + alias "EE".
2. **field:mechanical-engineering → Q101333** — no positive type signal (P31 outside whitelist);
   accepted on exact label + enwiki + 3 aliases; runner-ups are an iTunes genre and a
   press-archive category.
3. **field:industrial-engineering → Q4489420** — runner-ups Q6314146 (IE *and management*) and
   Q6027873 (IE *and OR*) are combined entities, different referents; accepted on exact label +
   enwiki + P31 + alias "IE".
4. **subfield:construction-engineering → Q2674423** — compound fallback (zero provider hits for
   "Construction Engineering and Management"); component anchor **ACCEPTED under the umbrella
   test** (automata-theory pattern): the entity's own description covers "designing, planning,
   construction and management of infrastructure" — the component term names the combined
   community. Guard added: Q2920921 (management) must never be selected for this seed.
5. **subfield:computer-engineering → Q428691** — accepted *for this referent* (exact label +
   enwiki + P31 trio + aliases "CE", "computer systems engineering"). Cross-reference: Q428691 is
   `must_not_select` on **subfield:computer-systems** (session #11) — per-seed guards do not
   transfer; the rejection there was as a wrong-referent anchor, and this batch's selection is the
   same entity finally anchoring its *own* node.
6. **subfield:nuclear-engineering → Q83504** — P31 "applied science" outside whitelist (score 40);
   accepted on exact label + enwiki; runner-ups are journals (one orphan stub at −120, correctly
   penalized).
7. **subfield:nanotechnology → Q11468** — accepted on exact label + enwiki + aliases ("nanotech",
   "nanotechnology engineering"); generator hint Q11902 hallucinated.
8. **subfield:photonics → Q467054** — accepted on exact label + enwiki + alias "optics and
   photonics"; upstream description reads "branch of physics" — the engineering/physics duality is
   noted on the node, and the entity is distinct from optics Q14620 (the NS node's anchor),
   corroborating the QC distinct-referent ruling at provider level.

## Honest upstream gap (1)

- **subfield:naval-architecture-and-marine-engineering** — no combined entity exists upstream. The
  v4 compound fallback surfaced one-wing component anchors: Q1136352 (naval architecture) and
  Q118291 (marine engineering; aliases include "ocean engineering"). Each covers one wing only —
  **umbrella test FAIL** (distributed-and-parallel-computing / databases-and-information-systems
  precedent). Both guarded `must_not_select`. Node enters /data at `proposed` with the gap
  recorded (promotion policy v1.2, CS QID-less precedent).
- Golden-set note: the post-verdict guard **fires against this run's own pre-verdict pack**
  (1 expected FAIL in the local check — the guard doing its job; the rejection *is* the verdict).
  CI is unaffected (packs are gitignored; 199 prior entries skipped/0 regressions). Future v4
  re-runs will re-surface the guard until upstream matures.

## Rank-1 auto-accepts (22)

All 22 non-ambiguous selections carry exact label + positive P31 type signal + enwiki sitelink
(scores 130–140), and none collide with any existing /data QID (collision scan run 2026-06-11):
civil Q77590, chemical Q83588, materials Q228736, environmental Q146326, aerospace Q3798668,
biotechnology Q7108, biomedical Q327092, structural Q633538, geotechnical Q1349130, transportation
Q775325, hydraulic Q1130265, telecommunications Q1061219, robotics Q170978, manufacturing
Q11049265, metallurgy Q11467, mining Q1370637, petroleum Q1273174, systems Q682496, geomatics
Q619798, automotive Q124192, food Q6631525 — and **textile Q20825773 with a WATCH item**:
0-sitelink thin anchor rescued by its English alias ("textile technology"; P31 includes academic
major + field of study + Q11023 engineering) — differential-equations Q28575007 precedent; monitor
upstream maturation.

## SPN ledger (§8, round protocol ③ — existing-snapshot-first)

- Existing snapshots verified 15/16 for QC-cited URLs (lcco_t 20260307022037, lcco_v
  20260211025540, lcco_r 20260512134630, lcco_u 20260307020131; id.loc.gov TK7885-TK7895
  20241203051639, T55.4-T60.8 20250730011204, T57.6-T57.97 20250929071915, TJ212-TJ225
  20241118221028, TA501-TA625 20250805070946, TA1501-TA1820 20230203051008, TC1501-TC1800
  20250707002607, TP248.13-TP248.65 20230121113123, TA401-TA492 20260111080157; UNB GGE
  20260218132728; NC State TECS 20260311001135). FORD page: known snapshot web/20260611023459.
- **[SPN-FAILED] save queue for #14 (1):** `https://id.loc.gov/authorities/classification/TN600-TN799`
  — save attempt timed out at 25 s (HTTP 000, known throttle pattern), single retry also timed
  out; existing-snapshot probe empty. Queued per the deferred-payment rule.
- UDC getrecord URLs are query-string SPN-incompatible — notation + caption quoted in source
  hints (known limitation).
