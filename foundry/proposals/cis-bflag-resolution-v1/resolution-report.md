# Clause-6 resolution report — cis-bflag-resolution-v1

- **Adjudication:** Claude Fable 5 (orchestrator session #9), 2026-06-11.
- **Collection:** 2 × Claude Sonnet (claude-sonnet-4-6) research subagents, separate contexts
  (ADR 0007), one per contest; briefs in this directory contain evidence only, no conclusions.
- **Scope:** the 2 remaining CS-batch B-flags — `subfield:scientific-computing` and
  `subfield:quantum-computing` (both `proposed`, edges capped). Clause 6 of edge promotion policy
  v1 + v1.1 evidence path (independent sources, all citations live) + cross-listing v1 (§13) +
  the session-#5/#7 operational interpretations.
- **QC:** orchestrator live re-verified every load-bearing citation before adjudication (MSC
  official CSV; Wikidata EntityData for Q117801/Q17995793; arXiv category taxonomy; Britannica
  computational-science; SIAM SIAG/CSE + SISC Wayback; Springer JoSC aims; NYU Courant research
  page; IQIM about page). Sonnet-brief citation survival: **100% of re-checked claims** (one
  immaterial variance: npj's "multi- and interdisciplinary" tagline sits on the journal home
  rather than the cited aims page; the load-bearing audience quote is on the aims page).

## Verdicts — both contests: genuine split → dissolved by cross-listing v1 (§13)

### 1. scientific-computing — CS vs applied mathematics: **genuine split**

Stance distribution (gate-grade): CS-primary — Britannica (computational science sub-headed under
its computer-science article), UDC 004.94 + ACM CCS Applied-computing branch + MSC 68Vxx (live,
session #8 permanent record). Applied-math-primary — SIAM SIAG/CSE + SISC, the MSC 65 numerical
axis, dominant math-department homes (UC Davis, UMD AMSC, Rice CMOR, UChicago CCAM). Interface —
**Wikidata Q117801 P279 dual-files the field under applied mathematics (Q33521) AND computer
science (Q21198)** (live, this session); NYU Courant lists the area under both its CS and
Mathematics departments; Journal of Scientific Computing self-describes as an "international
interdisciplinary forum". Under both readings of the interface sources (operational
interpretation 1), neither side reaches a dominant majority → genuine split.

**Disposition (§13):** the "choose a single parent" question does not exist in the ratified
model. Both memberships pass their own evidence gates:
- CS membership (existing edge): UDC 004.94 + CCS + MSC 68Vxx — already live-verified at PR #51/52.
- Applied-math membership (new edge → `subfield:applied-mathematics`): Wikidata P279 structural
  claim (the random-variable P361 precedent path) + SIAM/department-home pattern, all live.

→ node `reviewed`+`indexable`; existing CS edge cap lifted → `reviewed`; new co-equal edge
`reviewed`. **No `disputed` tag**: self-standing framings exist (SIAM "promotes CSE as an academic
discipline"; JoSC "interdisciplinary forum") but no source *denies* either membership — under the
session-#7 interpretation these are support for the field's breadth, not premise-negation
(contrast: OR's "not a science itself"). Recorded in the edge notes.

### 2. quantum-computing — CS vs physics: **genuine split**

Stance distribution (gate-grade): CS-primary — LCC QA76.889 inside the continent range (live,
session #8) + ACM CCS quantum branches (session #8 Wayback record) + MSC 68Q12. Physics-primary —
**MSC 81P68 "Quantum computation" under top-level 81 Quantum theory** (live official CSV, this
session — with the scheme's own partition note "For algorithmic aspects, see 68Q12"), arXiv
quant-ph (the field's dedicated preprint category) under the **Physics** parent (live), Caltech
IQIM "a National Science Foundation Physics Frontiers Center" (live), UMD JQI physics-anchored.
Interface — every quantum journal collected self-describes multi/interdisciplinary (npj QI, QIP,
IOP QST); IEEE QCE is co-sponsored across CS/photonics/communications societies; institutional
homes split (QuICS CS-anchored vs IQIM/JQI physics-anchored vs IQC multi-faculty); **Wikidata
Q17995793 carries no part-of claim to either parent**. No dominant majority under either
interface reading → genuine split.

**Disposition (§13):** both memberships pass their own gates:
- CS membership (existing edge): LCC + CCS + MSC 68Q12 — live-verified at PR #51/52.
- Physics-side membership (new edge → `domain:natural-sciences`): MSC 81P68 (registered source,
  live) + arXiv taxonomy + NSF-Physics-Frontiers institutional anchor. **Re-target note recorded**:
  targets the domain directly because no physics field node exists yet (mathematics-education
  precedent); re-target when the natural-sciences continent lands.

→ node `reviewed`+`indexable`; existing CS edge cap lifted → `reviewed`; new co-equal edge
`reviewed`. No `disputed` tag (no premise-denying source).

## Bookkeeping

- **Clause-6 cumulative distribution: consensus 3 / dominant 8 / genuine-split-dissolved-by-§13 5**
  (OR, control-theory, mathematics-education, + these 2). Open splits: 0.
- B-flags retired with this permanent record; `ambiguous` rationale survives in the skeleton
  proposal for audit.
- CS continent now fully resolved: **27/27 in-continent skeleton nodes carry settled membership
  topology**; /data CS-batch proposed remainder = 3 QID-less upstream gaps only.
- New editorial queue: the 2 promoted nodes lack summaries (editorial 5th batch, session #10).
- QID-less re-check (session task 3, low-cost tracking): Q105981125 still a 0-sitelink/0-alias
  orphan stub; no combined entity for distributed-and-parallel-computing (0 search results) or
  databases-and-information-systems (rank-1 still a scholarly article). All 3 stay at v1.2.
- [UNFETCHED] honesty in collection: scientific-computing brief 2 (Stanford ICME 403, EoM
  auth-gated), quantum brief 4 (ACM CCS direct, APS, PRX Quantum, LCC re-fetch — all covered by
  session-#8 permanent records or alternates). Laundering in briefs: **0 detected** — every
  re-checked quote was on its cited page.
