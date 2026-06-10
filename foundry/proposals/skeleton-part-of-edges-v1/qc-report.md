# skeleton-part-of-edges-v1 — QC report (first structural edge batch)

**QC by:** Claude Fable 5 (claude-fable-5), orchestrator session #4, 2026-06-10 (generation context:
separate Sonnet subagent — ADR 0007 separation upheld). **Policy:** edge promotion policy v1 (vault
decision log (15)) + skeleton modeling standard §12 (policy v1.3).

## Verdict

**102/102 edges pass QC** — 0 dropped, 0 reassigned parents. Coverage reconciliation exact:
108 in-scope discipline nodes = 102 proposed + 6 with pre-existing part_of edges. Structural
cross-checks (IDs, duplicates vs /data, endpoint existence, one-parent-per-child, evidence_kind,
direction): 0 errors.

Policy outcome: **83 → `reviewed`** (live-verified grounding + no flag after retirements + both
endpoints reviewed) / **19 → `proposed`** (all 19 have a `proposed` endpoint node — status cap,
clause 3; 10 of them also carry kept B-type flags).

## Flag dispositions (generator self-flagged 22)

### A-type — retired by QC ruling (12) 【v1.3 dashboard: 12 retirements this batch】

| Edge(s) | Ruling |
| --- | --- |
| logic → philosophy | §12 precedent already settles humanities residency (philosophy batch ruling: "logic and decision-theory stay humanities"). BC subclass of LCC class B + UDC 16 live-verified. Distinct from subfield:mathematical-logic (separate QIDs, separate communities — ASL vs philosophy departments; settled at node QC). |
| decision-theory → philosophy | Same §12 precedent, verbatim. Chalmers taxonomy lists Decision Theory as a philosophy category (live). |
| set-theory / model-theory / proof-theory → mathematical-logic | MSC 2020 (official CSV, live): 03Cxx Model theory, 03Exx Set theory, 03Fxx Proof theory are subsections of 03 Mathematical logic and foundations. Parent = subfield:mathematical-logic; part_of edge topology may run deeper than the flat two node levels (the §12 flat rule governs node levels, not edge depth). LCC shelves set theory's books at QA248 (outside QA9 logic) — shelving ≠ disciplinary hierarchy; MSC + ASL community decide. |
| computability-theory → mathematical-logic | Same ruling (MSC 03Dxx). Node itself remains a B-contest (CS competing home) → edge capped at proposed by endpoint status regardless. |
| history-of-mathematics → mathematics | Classification unanimous: MSC 01 (History and biography, within MSC), LCC QA21-27 (inside QA Mathematics), UDC 51+(09) auxiliary. Boundary-with-history concern does not survive source agreement. |
| mathematical-statistics → statistics | Granularity concern ("statistics done rigorously") was already adjudicated at node QC (kept while MSC 62 G/H/J/K/N method nodes were collapsed). Parent: MSC 62 + LCC QA273-280 (Probabilities. Mathematical statistics) + Annals-community. |
| bayesian-statistics / time-series-analysis / computational-statistics → statistics | Statistics-cluster ruling: parent = field:statistics per MSC 62 subsections (62Fxx, 62Mxx, 62-08) + LCC QA273-280 + standalone communities (ISBA etc.). The nodes' own boundary contests (vs mathematics / CS) remain node-level B-flags → edges cap at proposed via endpoint status. |
| cybernetics → systems-science | UDC 007 (live: "Activity and organizing. Communication and control theory generally (cybernetics)") + LCC Q300-390 Cybernetics (live outline) + ISSS community. Historical-antecedent concern is the node's own vitality question (academic_status), not a parent-assignment defect. |

### B-type — kept, edges stop at `proposed` (10)

esotericism-and-theosophy (framing parked since session #2 — edge modeling does NOT force it: the
endpoint cap already stops the edge at proposed, so the parked question stays parked),
mathematical-physics, applied-mathematics, operations-research, game-theory, information-theory,
financial-mathematics, mathematics-education, control-theory, mathematical-biology — each mirrors
its endpoint node's real-world boundary contest (the formal-sciences 14, v1.1 research queue).
Per v1.3, B-type flags are never retired by ruling alone.

## Grounding — live classification-source verification (clause 1 precondition)

All verification performed live on 2026-06-10 from a local session. Gate sources per §12: UDC + LCC;
MSC and PhilPapers serve as cross-checks.

| Source | Access | What was verified |
| --- | --- | --- |
| LCC Class B outline — <https://www.loc.gov/aba/cataloging/classification/lcco/lcco_b.pdf> (HTTP 200) | full PDF read | Subclasses B (Philosophy General; B108-708 Ancient / B720-765 Medieval / B770-785 Renaissance / B790-5802 Modern / B808-849 schools / B850-5739 by region), BC Logic, BD (BD95-131 Metaphysics, BD143-237 Epistemology, BD240-260 Methodology incl. hermeneutics, BD300-450 Ontology), BH Aesthetics, BJ Ethics, BL51 Philosophy of religion, BF309-499 Cognition, BF1404-2055 Occult sciences, BP500-585 Theosophy, BQ Buddhism — every philosophy-edge LCC hint confirmed at outline granularity. |
| LCC Class Q outline — <https://www.loc.gov/aba/cataloging/classification/lcco/lcco_q.pdf> (HTTP 200) | full PDF read | QA1-939 Mathematics with QA150-272.5 Algebra, QA273-280 Probabilities/Mathematical statistics, QA299.6-433 Analysis, QA440-699 Geometry/Topology; Q300-390 Cybernetics; Q350-390 Information theory. |
| UDC Summary — <https://udcsummary.info/> (live AJAX tree; license CC BY-SA 3.0 verified on page) | class 1, 5, 0 subtrees | Class 1 divisions live: 101 (nature/role of philosophy), 11 Metaphysics, 111 General metaphysics/Ontology, 133 occult, 14 systems, 159.9 Psychology, **16 Logic/Epistemology**, 165 Epistemology, 17 Moral philosophy/Ethics. Class 51: 510.2/510.3 (Set theory)/510.6 (Mathematical logic), 511, 512, 514, 514.7, 515.1, 517, 517.9, 519.1, 519.2, 519.6, 519.7, 519.8, 519.83. Class 0: 007 cybernetics/control. |
| MSC 2020 — <https://msc2020.org/MSC_2020.csv> (official CSV; CC BY-NC-SA 4.0) | machine check | All cited sections exist: 01, 03 + 03C/03D/03E/03F (the four pillars as subsections of Mathematical logic and foundations — decisive for the pillar rulings), 05, 11, 14, 18, 26-57 analysis/geometry/topology run, 62 + 62F/62M, 65, 90-94, 97. |
| PhilPapers taxonomy via Chalmers mirror — <https://consc.net/taxonomy.html> (HTTP 200) | cross-check | Philosophy-of-X and core-area categories confirmed for ~30 of the queried categories (incl. Philosophy of Mind/Language/Science/Mathematics/Religion/Law/Action/Perception/Race/Cognitive Science/Biology/Social Science, Decision Theory, Metaethics as "Meta-Ethics", Aesthetics, Value Theory). The 2009-era draft lacks some history/tradition categories — those edges are grounded by LCC B period/region ranges + UDC instead, plus the node-level v1.1 resolution records (PR #25 resolution-report.md, URL-cited). |

Additional standing evidence: the philosophy-of-X residency claims were externally resolved at node
level in session #2 (30 ambiguity resolutions, ≥2 independent live-verified sources each, permanent
record in `foundry/proposals/philosophy-skeleton-v1/resolution-report.md`).

### Hint-error log (dashboard)

- **"UDC 18 (Aesthetics)" — confirmed hallucination.** UDC class 18 does not exist (live tree:
  class 1 has no 18; philosophical aesthetics is 111.85 in full UDC). The aesthetics edge is
  grounded by LCC BH + Chalmers instead. 1 nonexistent class across ~300 hint pointers.
- UDC 510.223 / 510.626 / 510.5 (set/model/computability): below summary granularity and likely
  wrong-precision (summary: set theory = **510.3**, mathematical logic = 510.6). Not counted as
  verified; the pillar grounding rests on MSC 03C/D/E/F + UDC 510.2/.3/.6.
- Various fine LCC cutters (QA164-167, QA169, QA248, B105.x, …) and fine UDC points (517.53, .95,
  .98, 512.58, …) are below outline/summary granularity: recorded as unverifiable-at-gate-granularity,
  each corroborated by a verified coarser range + MSC section.

**Dashboard comparison:** classification-hint hallucination ≈ 1 confirmed / ~300 pointers (<1%),
vs QID hints 93% (philosophy) / 71% (formal sciences) and editorial URL hints 41% / 59%. Pattern
holds: precise opaque identifiers hallucinate; coarse standard-scheme pointers are robust.

## Cross-listing observations (parked policy, first materialization)

The single-primary-parent constraint held without schema strain: every contested case was
expressible as primary parent + flagged alternative in `uncertainty`. Cross-listing candidates
recorded for the parked decision (CPO leaning: multiple part_of, to be solved with the cross-listing
policy): logic (philosophy ↔ mathematics), decision-theory (philosophy ↔ economics/OR),
computability-theory (mathematics ↔ CS), game-theory (mathematics ↔ economics), information-theory
(mathematics ↔ CS/EE), control-theory (mathematics ↔ engineering ↔ systems-science),
mathematical-biology (mathematics ↔ life sciences), financial-mathematics (mathematics ↔ finance),
mathematics-education (mathematics ↔ education). **No schema change needed in this batch — no CPO
escalation required.**
