# B-flag resolution — cognitive-sciences-bflag-resolution-v1

**Track:** clause-6 / B-flag settlement (session #22, cognitive science round 3, session B).
**Method:** orchestrator-direct multi-signal verification (medicine-B precedent, decision (41):
for small-N + heterogeneous + grounding-maturity items, direct is more precise than fan-out;
methodology choice recorded). **Date:** all anchors live-verified 2026-06-18. **/data change: none.**

## Scope and framing

The 3 cognitive-science `proposed` nodes from `cognitive-sciences-skeleton-v1`. These are NOT
clause-6 placement contests (no disputed parent); they are **upstream grounding-maturity gaps** —
each lacks a discipline-level Wikidata entity, so the "BOTH-sides" standard reduces to an
identity-anchor existence check. Per decision (44) / (43)④: **no forced promotion when grounding
is immature → honest gap maintained.** The session re-verified whether any anchor had matured
since session #21 (same day); it had not.

## Per-node findings (live 2026-06-18)

### subfield:sensation-and-perception — **gap maintained**
- Wikidata `wbsearchentities "sensation and perception"` → only written works / scientific
  articles (Q111086256, Q60256912, …); **no discipline entity.**
- Near-miss anchors, both rejected on referent axis:
  - **Q362682 "perceptual psychology"** — a mature discipline entity (P31 Q60680430 *branch of
    psychology*, P279 ⊂ Q9418, 9 sitelinks, enwiki "Perceptual psychology"), but **label + scope
    mismatch**: it covers perception, not the standard "sensation and perception" pairing
    (sensation/transduction excluded). Re-anchoring our node onto it would conflate distinct
    referents.
  - **Q500096 "psychophysics"** — a discipline ("scientific study of perceptual systems"), but a
    narrower sub-method, not the pairing.
- Verdict: recognized course/area, no matching discipline QID → **QID-less proposed**.

### subfield:computational-cognitive-science — **gap maintained (journal-concept trap)**
- **Q96319640 "Computational cognitive science"** is an exact-label match but **P31 = Q5633421
  *scientific journal*** (alias "Comput Cogn Sci", 0 sitelinks) — the journal, not the discipline.
  Springer journal site live (computationalcognitivescience.springeropen.com 301). The prompt's
  "journal-concept trap" warning, confirmed.
- **Q4874465 "Bayesian cognitive science"** — the Bayesian sub-approach (P279 ⊂ Q147638, enwiki
  only, no P31), not the discipline. Alternates "cognitive modeling" / "computational cognition"
  → articles only.
- Verdict: no discipline entity (journal + sub-approach only) → **QID-less proposed**.

### subfield:judgment-and-decision-making — **gap maintained**
- **Q15746672 "Judgment and Decision Making"** = the journal. Society for Judgment and Decision
  Making live (sjdm.org 200). "behavioral decision theory" / "decision research" → articles /
  a nonprofit org (Q30253547), not a discipline. The discipline-level concept overlaps
  decision-theory (already a node elsewhere) and behavioral economics.
- Verdict: only journal + society, no distinct discipline QID → **QID-less proposed**.

## Result

**0 promotions, 3 honest QID-less gaps maintained** — consistent with decision (44) and the
(43)④ philosophy-of-cognitive-science pattern ("grounding immature → keep gap, no forced
promotion"). The gap state is already correctly represented in `/data` (status `proposed`,
empty `external_ids`); no write was required. These remain low-cost re-search candidates as
upstream entities mature (the differential-equations Q28575007 / naval-architecture
Q101910631 thin-anchor watch pattern).
