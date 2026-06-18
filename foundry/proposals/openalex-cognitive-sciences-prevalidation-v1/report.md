# OpenAlex B-track — openalex-cognitive-sciences-prevalidation-v1

**Track:** B-track external metrics (settlement session #22, cognitive science round 3, session B).
**Policy:** standing B-track policy (decision (27)) — pre-validation report → write proceeds
without per-item sign-off unless an escalation trigger fires. Concurrent prevalidate (decision
(38)/(34)⑥(b), `scripts/foundry/openalex-prevalidate.ts`, pool 6). **Date:** 2026-06-18.
Network local; nothing in build/validate/CI requires it.

## Scope

The 22 new cognitive-science `reviewed` field+subfield nodes from `cognitive-sciences-skeleton-v1`
(all carried no `external_metrics`). The pre-existing seed-era `domain:cognitive-sciences` is out
of scope — domain-level external_metrics is not the convention (11 of 12 domain nodes carry none;
`domain:formal-sciences` is a lone early-session exception), consistent with the medicine B-track
(session #19 did not metric `domain:medicine-and-health`). The 3 QID-less `proposed` nodes are
excluded (no verified Wikidata to resolve against).

## Pre-validation (concurrent, pool 6)

`npm run foundry:openalex-prevalidate -- --domains cognitive_sciences --types field,subfield --no-metrics-only --concurrency 6`

- **rank1_clean 18 / manual_candidate 4 / object_concept 0 / absent 0** — strict rank-1 **81.8%**
  (above the 76–81% historical band; well above the <70% guidance floor).

### Escalation triggers (decision (27)) — none fired

- (i) rank-1 precision <70%: **no** (81.8%).
- (ii) novel anomaly: **no.** All 4 `manual_candidate`s are the *known* broad/narrow
  duplicate-link class (sessions #6/#9/#12, medicine #19) — the bare-QID `direct` lookup returns
  a narrow/object twin that shares the node's Wikidata QID, while the `search` rank-1 is the
  correct broad discipline concept (also QID-round-tripping, name-matching):
  - psychology Q9418 — direct "Psychological Theory" (L2, 15.5k) vs search "Psychology" (L0, 38.6M)
  - clinical-psychology Q199906 — direct "Clinical psychiatry" (L2, 3.3k) vs search "Clinical psychology" (L1, 2.68M)
  - personality-psychology Q271716 — direct "Personality profile" (L4, 1.2k) vs search "Personality psychology" (L3, 31k)
  - psychometrics Q506132 — direct "Psychometric testing" (L4, 7.9k) vs search "Psychometrics" (L2, 431k)
  Resolution per standing rule: **select the search-side discipline concept; never the bare-QID
  lookup alone** for this class.
- (iii) upstream change: **no** (Concepts API responding; all direct round-trips intact).
- (iv) schema/policy change needed: **no.**

→ Unblocked: same-session no-gate write (decision (27)).

## Write (live re-query, multi-signal, drift check)

Each chosen concept (search rank-1 = discipline concept for all 22; for the 18 rank1_clean it
equals the direct lookup) was **live re-fetched at write time** by its OpenAlex concept ID and
re-verified:

- **22/22 Wikidata round-trip ✓ · display-name match ✓ · value-drift vs prevalidation table 0.**
- Written to `/data/nodes.json`: `external_ids.openalex` (concept id) + `external_metrics.openalex`
  { works_count, cited_by_count, as_of: 2026-06-18, entity } — raw facts only (no computed labels).
- **0 gaps** (no `object_concept`/`absent`); all 22 cognitive-science new reviewed nodes metriced.

## Triangulation

**external_metrics coverage 229/357 (64.1%) → 251/382 (65.7%).** Cognitive science: 22/22 new
reviewed metriced (23/23 of the continent's QID-bearing field/subfield reviewed nodes; the domain
node intentionally excluded as above). B-track continent debt 0.
