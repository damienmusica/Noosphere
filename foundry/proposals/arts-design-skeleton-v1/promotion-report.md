# Promotion report — arts-design-skeleton-v1

- **Promoted by:** Claude Fable 5 (claude-fable-5), orchestrator session #13d (parallel round v1,
  merge order 4), 2026-06-11.
- **Policy:** standing node promotion policy v1 + v1.2 + v1.3 (vault decision log (7)(12)(14)) —
  policy-level gate, no per-item CPO sign-off (parallel-round-v1.md ⑤ / workflow.md unchanged).
- **Inputs:** QC-shaped proposal (25 nodes, `proposal.json` + `qc-report.md`) and resolver-v4
  grounding (25/25 verified QIDs, `grounding-report.md`).

## Policy application

| Bucket | Rule | Count | Outcome |
|---|---|---|---|
| Verified QID + QC ambiguous=false | v1 structural tier | **23** (5 fields + 18 subfields) | `reviewed` + `indexable` |
| Verified QID + B-type boundary flag | v1: ambiguous stops the ladder | **2** (photography, urban-planning) | `proposed` (clause-6/v1.1 queue) |
| No verified QID | stays in foundry | 0 | — (second consecutive zero-gap batch) |

`reviewed` set (23): field:music, field:visual-arts, field:design, field:performing-arts,
field:architecture, subfield:musicology, subfield:music-theory, subfield:ethnomusicology,
subfield:music-education, subfield:art-history, subfield:painting, subfield:sculpture,
subfield:drawing, subfield:printmaking, subfield:graphic-design, subfield:industrial-design,
subfield:interior-design, subfield:decorative-arts, subfield:ceramic-arts,
subfield:theatre-studies, subfield:dance, subfield:film-studies, subfield:landscape-architecture.

`proposed` set (2): subfield:photography (UDC 77 vs LCC TR head-on split — §13 arts+technology
resolution hypothesis), subfield:urban-planning (UDC 711/NA9000-9428 vs HT165.5-169.9 multi-home
contest). Both enter the **clause-6/v1.1 queue** for a future session (FS/NS B-flag precedent).

`/data` after promotion: **276 nodes (reviewed 211 / proposed 16)**; 25 new `en` translation rows
(labels from the proposal; one absorption-ruling alias "Applied Arts" on decorative-arts; summaries
empty — editorial deferred per round ⑤). No edges in this batch (skeleton-first); the part_of
skeleton is the next batch (task 6), where the architecture §13 engineering-side membership
(task 7) is also written with the live-captured dossier.

Note on the running /data total: this batch landed after the 13a (social sciences) and 13b (life
sciences) /data promotions merged ahead of it (merge order 1, 2). The reviewed/proposed split
above is this batch's contribution; the aggregate count reflects all three.

## Golden set

25 entries appended (`batch:arts-design-skeleton-v1`, golden set → 282 on the merge-order-4 base):
23 rank-1/QC-accepted + 2 manual-path (drawing — `must_not_select: [Q192521, Q93184]`;
decorative-arts — `must_not_select: [Q207241]`), with twin guards recorded on art-history (Q50641),
painting (Q3305213), sculpture (Q860861) and interior-design (Q1329946). Post-promotion regression
check: **23 pass / 0 warn / 0 fail / 2 info** (the two manual paths surface as IMPROVED — expected
v4 fallback behaviour). Committed in the grounding PR (replacement PR #85 after the original PR #83
was closed unmerged by a branch-deletion mistake — see session report incident log).

## Evidence permanence (§8) — SPN policy

Per round protocol ③ (SPN post-pay) the batch's verdict-bearing URLs are **recorded to the
session spn-queue and deferred to #14's consolidated pass** — four sessions hitting the SPN save
endpoint from one IP on one day all hit the throttle (session #12 measured this). The
existing-snapshot-first rule still applies opportunistically. The 25 verified
`Special:EntityData` JSON states are independently re-auditable via the `wikidata_lastrevid`
pins in `grounding-report.md`; the LCC/UDC/FORD captures live under
`dist/foundry/captures/arts-design-skeleton-v1/`. SPN queue is itemized in `session-13d-report.md`.

## Next step

part_of skeleton batch (`arts-design-part-of-edges-v1`, task 6) with the architecture §13
engineering-side dual membership (task 7, dossier live-captured: LCC TH + UDC 69 + FORD 2.1).
The 2 proposed B-flag nodes wait for a future clause-6 session.
