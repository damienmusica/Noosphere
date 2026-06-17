# B-track — openalex-medicine-prevalidation-v1 (session #19, settlement track 3)

> Standing policy (27): pre-validation report → same-session write-in **unless** an escalation trigger
> fires. Scripted prevalidation `scripts/foundry/openalex-prevalidate.ts` (concurrent, decision (38),
> pool 6). Write-time live re-fetch + multi-signal re-collation by the orchestrator. Session #19,
> 2026-06-18, Claude Opus.

## Scope

50 medicine `field`+`subfield` reviewed nodes (22 fields + 28 subfields) — the 47 round-1 reviewed +
the 4 promoted in `medicine-bflag-resolution-v1` − 1 (alternative-medicine is a field already counted).
All carry a verified `external_ids.wikidata`. The L0 `domain:medicine-and-health` is out of
field/subfield scope; the 3 §13 nodes (physiology/anatomy/biomedical-engineering) belong to their
home-domain B-track, not medicine.

## Trigger evaluation (decision (27)) — NO TRIGGER FIRED

The script's strict composite **`rank1_clean` = 30/50 = 60%** looked low at first glance, but that metric
requires direct==search==QID==name all aligned. The **band-relevant precision** (the historical
"search-rank1-QID-match" definition, session #16's 76–81% band) is:

- **search_rank1_qid_match = 47/50 = 94.0%**
- **direct_round_trip (QID-linked direct) = 49/50 = 98.0%**

Both well above the band. The 40% non-clean gap is **the known broad/narrow duplicate-link anomaly the
order anticipated for medicine** ("의학 일반분야 — 기지 변칙"): for 17 nodes the direct endpoint
`/concepts/wikidata:QID` returns a *narrow related* concept while search rank-1 returns the *broad
discipline* concept, **both linking the same QID**.

- (i) rank-1 precision <70%? **No** — 94% search-rank1-QID-match.
- (ii) novel anomaly? **No** — all non-clean are known patterns (duplicate-link ×17, homonym/object ×3),
  handled by existing rules; 0 novel.
- (iii) upstream change? **No** — concepts tag current works (works_count in the millions for major
  fields).
- (iv) schema/policy reinterpretation? **No.**

→ Ungated same-session write per (27), executed with **full multi-signal verification of every node**
(the launch posture's "엄격 발화" applied: the low composite was investigated to the band metric, not
waved through).

## Resolution of the 20 non-clean cases

- **17 duplicate-link → search-side discipline concept** (order: "search-side QID concept 선택"). Direct
  returned a narrow/adjacent concept (e.g. public-health direct "Health protection" 18k vs search "Public
  health" 2.7M; surgery direct "Minor surgery" 1.8k vs search "Surgery" 10.6M; nursing direct "Nursing
  care" vs "Nursing" 4.6M). All 17 search-side concepts name-match the discipline and round-trip the QID.
- **1 name-variant write → otolaryngology** C3017913842 "Head and neck surgery" (Q189553 round-trip,
  works 31086). No dedicated "Otolaryngology" concept exists in OpenAlex; the discipline is the
  board-named "Otolaryngology–Head and Neck Surgery". Raw display_name recorded as the OpenAlex label.
- **2 gaps (skipped, honest):**
  - `subfield:forensic-medicine` — the only Q454812-linked concept is "Clinical judgement" (works 4943),
    a referent mismatch; no "forensic medicine" concept in OpenAlex search. Multi-signal identity failure
    (display_name ≠ referent) — skip, per the session-#7 complex-analysis/time-series skip precedent.
  - `subfield:health-policy-and-management` — no OpenAlex concept links Q18348859; search "Health policy"
    links a **different** QID (Q1519812). Entity-ID-first rule (decision (22)) → skip.

## Write (48 nodes)

- **Multi-signal QID round-trip 48/48, drift 0** (live re-fetch of every chosen concept; each concept's
  `wikidata` == node QID). Wrote `external_ids.openalex` + `external_metrics.openalex` (works_count,
  cited_by_count, as_of 2026-06-18, entity URL). raw provider facts only — no computed labels/scores.
- 3 display_name variants (all same referent, QID-confirmed): otolaryngology "Head and neck surgery",
  nutrition-science "Nutritional science", infectious-diseases "Infectious disease (medical specialty)".

## Dashboard

- Tally: rank1_clean 30 / duplicate-link-manual 17 / homonym 2 / object 1 / absent 0. Writes 48 / gaps 2.
- **Triangulation: external_metrics 181 → 229 / 357 = 64.1%** (+48; measured-medicine 48/50 = 96%).
- No triggers fired; standing-policy ungated write. validate:data ✓ (entity-ID-first structural checks) /
  typecheck ✓ / goldenset 0 regressions (QID unchanged; openalex IDs additive).
