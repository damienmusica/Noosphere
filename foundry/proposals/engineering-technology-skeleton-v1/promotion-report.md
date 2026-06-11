# Promotion report — engineering-technology-skeleton-v1

- **Promotion:** 2026-06-11, orchestrator session #13c (parallel round v1, merge order 3 — after
  the 13a/13b promotions, per protocol ①). Policies applied: node promotion v1 (verified QID +
  no flag → `reviewed` + `indexable`), v1.2 (honest upstream gap → `proposed`), v1.3 (§12 as
  standing input; B-flags stop at `proposed`).
- **Inputs:** QC-shaped `proposal.json` (31 nodes), `grounding-report.md` per-QID verdicts
  (verified 30 / gap 1), `qc-report.md` flag ledger (B-flags upheld 2).

## What entered /data

| Status | Count | Nodes |
|---|---|---|
| `reviewed` + `indexable` | **28** | civil, electrical, mechanical, chemical, materials-science-and-engineering, environmental, aerospace, industrial-engineering (fields, 8) + biotechnology (field) + structural, geotechnical, transportation, hydraulic, construction, telecommunications, computer-engineering, nuclear, robotics, manufacturing, metallurgy, mining, petroleum, nanotechnology, systems-engineering, geomatics, photonics, automotive, textile (subfields, 19) |
| `proposed` (B-flag, clause-6/v1.1 queue) | 2 | field:biomedical-engineering (Q327092 — medicine-class co-home contest), subfield:food-engineering (Q6631525 — institutional-home contest) |
| `proposed` (honest QID gap, v1.2) | 1 | subfield:naval-architecture-and-marine-engineering (`external_ids: {}` — umbrella-test fail; goldenset guards Q1136352/Q118291) |

- /data totals after promotion: **282 nodes / 282 translations** (was 251/251 after the 13a+13b
  promotions). Translations: `en` labels, `reviewed` flag mirroring node status.
- Edges: **none** (skeleton-first — the part_of edge batch is separate, with its own manifest and
  QC).
- Summaries: **deferred by round default** (protocol ⑤ — editorial deferred-payment invoice: 28
  new `reviewed` nodes for the post-round editorial sessions).

## Provenance trail (bulk re-auditable)

- Generation: `nodes.proposed.json` (raw 32, Sonnet, separate context).
- QC: `qc-report.md` (kept 31; drop 1 absorbed; laundering 2 corrected; A-flags retired 5+1;
  B-flags upheld 2; §12 precedent candidates recorded for #14).
- Grounding: `grounding-report.md` (resolver v4 31/31; verified 30 = rank-1 22 + manual 8;
  gap 1; goldenset 282→313; resolver–QC agreement 30/31).
- Every promoted QID is goldenset-registered (batch entries appended PR #86); the whole batch is
  reversible by status flip + goldenset audit.

## Deferred / queued

- Editorial invoice: 28 summaries (deferred to post-round editorial sessions, protocol ⑤).
- Clause-6 contest queue: biomedical-engineering, food-engineering (next-session resolution batch
  alongside the other continents' B-queues).
- NAME QID gap: re-check on upstream maturation (goldenset guards in place).
- SPN save queue (1): id.loc.gov TN600-TN799 → #14 consolidated pass.
