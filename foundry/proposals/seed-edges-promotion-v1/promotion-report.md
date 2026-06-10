# seed-edges-promotion-v1 — promotion report (seed structural edges + gradient-descent grounding)

**Scope:** the six hand-curated seed `part_of` edges still at `proposed`, plus the QID-less seed node
`method:gradient-descent` and its structural edge. These artifacts predate the foundry (seed graph,
2026-06-02) and belong to no proposal batch; this report is their permanent promotion record under
edge promotion policy v1 (vault decision log 2026-06-10 (15)). Seed artifacts are human-curated and
carry no `proposed_by` block under the clause-4 retroactive exemption (precedent:
`foundry/proposals/ml-foundations-v1/promotion-report.md`).

**Verification & verdicts:** Claude Fable 5 (claude-fable-5), orchestrator session #5. All source
checks below were performed **live on 2026-06-11 from a local session** (no training-knowledge
identifiers or URLs used as evidence — decision log (9)). Generation/QC separation: nothing here was
generated this session; this is QC/promotion of pre-existing seed data.

**Policy basis:** structural tier (clause 1) — externally-sourced classification grounding,
live-verified, no flags, both endpoints `reviewed` → `reviewed` automatic. Editorial seed edges
(5 `prerequisite_for` + 1 `applies_to`) are **untouched** by design: clause 2 caps the editorial
tier at `proposed` pending measured precision (the measurement queue).

## Live verification paths used

| Source | Access path (live 2026-06-11) | Result |
| --- | --- | --- |
| MSC 2020 (official CSV) | <https://msc2020.org/MSC_2020.csv> | HTTP 200, 6,603 rows parsed |
| LCC Class Q outline (PDF) | <https://www.loc.gov/aba/cataloging/classification/lcco/lcco_q.pdf> | HTTP 200, full read |
| LCC classification authorities (linked data; sub-outline granularity) | `https://id.loc.gov/authorities/classification/<number>.json` | HTTP 200 for QA303, QA402.5, QA273.6 |
| UDC Summary (AJAX tree, class 5 subtree) | <https://udcsummary.info/php/index.php?id=25403&lang=en> | HTTP 200, class-51 captions parsed |
| Wikidata (Special:EntityData) | `https://www.wikidata.org/wiki/Special:EntityData/<QID>.json` | HTTP 200 for all QIDs below |

The id.loc.gov authority records are the Library of Congress Classification itself served as linked
data; they are cited here as **supplementary verification** at granularity the outline PDF does not
reach. Edge `evidence` arrays cite only registered sources (`source:lcc-outline` for LCC claims that
the outline corroborates at range granularity, per the skeleton-part-of-edges-v1 precedent).

## Edge verdicts (6 promoted `proposed → reviewed`)

### edge:probability-theory-part-of-mathematics — PROMOTED
- UDC Summary (live): **519.2 "Probability. Mathematical statistics"** under 51 Mathematics.
- LCC outline (live): **QA273-280 "Probabilities. Mathematical statistics"** inside QA1-939 Mathematics.
- MSC 2020 (live): **60-XX "Probability theory and stochastic processes"** — a section of the
  mathematics classification.
- Verdict: three independent classification systems file probability theory inside mathematics.
  Evidence → `udc-summary, lcc-outline, msc2020`, `evidence_kind: externally_sourced`.

### edge:calculus-part-of-mathematics — PROMOTED
- MSC 2020 (live): **26A06 "One-variable calculus"**, 26B12 "Calculus of vector functions" — named
  calculus entries within MSC section 26 (Real functions).
- LCC (live): outline range QA299.6-433 "Analysis" inside Mathematics; id.loc.gov authority QA303
  shows the named hierarchy **"Science--Mathematics--Analysis--Calculus"**.
- Wikidata (live): Q149972 calculus, **P31 = Q1936384 "branch of mathematics"**; 121 sitelinks.
- UDC Summary (live): 517 "Analysis" under 51 (coarse corroboration; calculus below summary granularity).
- Verdict: promoted. Evidence → `msc2020, lcc-outline, wikidata`.

### edge:optimization-part-of-mathematics — PROMOTED
- UDC Summary (live): **519.85 "Mathematical programming"** (under 519.8 Operational research, under
  51 Mathematics).
- LCC (live): id.loc.gov QA402.5 shows **"Mathematics--...--Mathematical optimization. Programming"**
  (outline corroboration: QA Mathematics).
- MSC 2020 (live): **90-XX "Operations research, mathematical programming" / 90Cxx "Mathematical
  programming"**; 49-XX caption "Calculus of variations and optimal control; **optimization**".
- Verdict: promoted. The seed note's caveat ("also studied in operations research and computer
  science") stays true and recorded; the part_of-mathematics claim itself is classification-unanimous.
  Evidence → `udc-summary, lcc-outline, msc2020`.

### edge:probability-distribution-part-of-probability-theory — PROMOTED (concept-level)
- MSC 2020 (live): **60Exx "Distribution theory" / 60E05 "Probability distributions: general
  theory"** — named subsections of 60 (Probability theory).
- LCC (live): id.loc.gov QA273.6 shows **"Science--Mathematics--Probabilities--Distributions.
  Characteristic functions"** (outline corroboration: QA273-280 Probabilities).
- Wikidata (live): Q200726 probability distribution, **P2579 (studied by) = Q5862903 probability
  theory** (+ Q12483 statistics); 60 sitelinks.
- Verdict: promoted — the concept is named inside probability-theory's own divisions in two
  classification systems plus a direct Wikidata claim. Evidence → `msc2020, lcc-outline, wikidata`.

### edge:random-variable-part-of-probability-theory — PROMOTED (concept-level)
- Wikidata (live): Q176623 random variable, **P361 (part of) = Q5862903 probability theory** — the
  exact edge claim, stated directly by the source; 68 sitelinks. (Q5862903 is the resolver-verified
  QID of `subfield:probability-theory` in /data.)
- MSC 2020 (live): corroboration — 60G50 "Sums of independent random variables; random walks",
  60B12 "Limit theorems for vector-valued random variables" are subsections of 60 (Probability
  theory). No MSC/LCC/UDC division is *named* for the concept itself (recorded honestly: the
  classification outlines do not reach concept granularity here).
- Verdict: promoted on the direct Wikidata part-of claim (§8: "part_of backed by Wikidata" is the
  canonical externally-sourced case) + MSC corroboration. Evidence → `wikidata, msc2020`.

### edge:gradient-descent-part-of-optimization — PROMOTED
- Wikidata (live): Q1199743 gradient descent, **P31 = Q2835765 "optimization algorithm"** (also
  P31 Q2321565 "iterative numerical method").
- MSC 2020 (live): corroboration — 90C52 "Methods of reduced gradient type" under 90Cxx Mathematical
  programming; 65Kxx "Numerical methods for mathematical programming, optimization and variational
  techniques". (No MSC entry named "gradient descent"/"steepest descent" in the optimization
  sections — recorded honestly; the named entries cover the gradient-method family.)
- Endpoint status: `method:gradient-descent` promoted to `reviewed` in this same change (below) —
  the status cap (clause 3) is satisfied.
- Verdict: promoted. Evidence → `wikidata, msc2020`.

## Node verdict: method:gradient-descent — QID grounded, PROMOTED `proposed → reviewed`

Manual sitelink+alias identity verification (decision log (9) rule, PR #24 precedent), live 2026-06-11:

- `wbsearchentities("gradient descent")` rank 1: **Q1199743** — label "gradient descent",
  description "optimization algorithm".
- Special:EntityData/Q1199743 (live): **28 sitelinks**, enwiki **"Gradient descent"**; en aliases
  **"steepest descent", "method of steepest descent", "hill-climbing algorithm"**; P31 =
  optimization algorithm (Q2835765) + iterative numerical method (Q2321565); P279 = mathematical
  concept (Q24034552).
- Distractors excluded: Q96761856 "Gradient Descent" (small company) — wrong kind.
- Verdict: identity confirmed → `external_ids.wikidata = Q1199743`; standing policy v1
  (resolver-verified-grade QID + no ambiguity flag) → `reviewed`, `indexable: true`.

### Editorial QC of the pre-existing seed summary (editorial v1)

Summary shipped on promotion: "An iterative optimization method that updates parameters in the
direction that most reduces a function's value." Claim-by-claim live corroboration: *iterative* →
P31 Q2321565 "iterative numerical method"; *optimization method* → P31 Q2835765 "optimization
algorithm"; *direction that most reduces* → en aliases "steepest descent" / "method of steepest
descent" (the steepest-descent direction is the defining semantics of the name). 3/3 claims
corroborated, 0 uncorroborated → summary accepted unchanged; `en` translation marked `reviewed`.

## Untouched by design

- The 6 editorial seed edges (probability-theory→statistics, calculus→optimization,
  optimization→machine-learning, probability-distribution→bayesian-inference,
  random-variable→bayesian-inference prerequisites; gradient-descent applies_to machine-learning)
  stay `proposed` in the editorial measurement queue (clause 2 ladder).
- `edge:calculus-prerequisite-gradient-descent` (ml-foundations batch): note amended to record that
  its endpoint cap no longer applies; it remains `proposed` under the editorial ladder.

## Dashboard notes

- Concept-granularity finding (feeds the evidence-path playbook): LCC outline and UDC Summary do not
  reach concept-level entries; **id.loc.gov LCC authorities and Wikidata P361/P2579/P31 claims are
  the working live paths** for concept/method-level structural grounding. MSC reaches concept
  granularity in some sections (60E05) but not others (no "random variable" / "gradient descent"
  named entries).
- Hint hallucination: n/a (no generated hints in scope — seed data carried no identifier hints).
- /data after this change: nodes 128 (reviewed 109 / proposed 19), edges 132 (reviewed 102 /
  proposed 30).
