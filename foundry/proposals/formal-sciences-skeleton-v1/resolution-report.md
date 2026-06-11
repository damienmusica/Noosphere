# Boundary-contest resolution report — batch:formal-sciences-skeleton-v1

**Policy:** promotion policy v1.1 ambiguity-resolution clause **+ edge promotion policy v1 clause 6**
(contested-dominant-position clause, CPO-ratified 2026-06-10, vault decision log (15)) — **first
application of clause 6.** Three-way semantics: source consensus → flag flip, plain `reviewed` /
dominant position (≥3 independent sources, majority + ≥2 supporting) → `reviewed` + `disputed: true`
+ minority position permanently recorded / genuine split → stays `proposed`.

**Scope:** the 14 formal-sciences B-type boundary/identity contests (the entire remaining proposed
cohort of this batch). The session order's standing caution applies: only the real-world
boundary/identity contest is resolved here — cybernetics' vitality question (historical vs
established) is **out of scope** and stays parked.

**Collection:** 5 Sonnet research subagents (claude-sonnet-4-6, WebSearch/WebFetch), separated
contexts, 2026-06-10/11. Subagents received the recorded per-node `uncertainty` texts and neutral
stance codes; no conclusion-inducing phrasing (order audit trail in session log).
**Verdicts:** Claude Fable 5 (claude-fable-5), orchestrator/QC context, 2026-06-11. ADR 0007
generation↔QC separation maintained: subagents collected and gave non-binding reads; the
orchestrator verified and judged.

**URL pre-verification (mandatory since editorial #1/#2 measured 41%/59% hint hallucination):**
every agent-cited URL was batch-verified live by the orchestrator on 2026-06-11 before any content
was used. **84 cited URLs → 83 HTTP 2xx live, 1 transient 5xx (jrank.net mirror; claim re-verified
directly at Springer instead), 0 dead/fabricated — 0% citation hallucination.** Load-bearing quotes
were additionally content-checked against fetched page text (16/16 verified; 2 initial misses were
HTML-tag grep artifacts, both verified on tag-stripped text). Four agent-cited quotes that could not
be live-verified (ITSoc field-of-interest; INFORMS current about-page; JTSA "branch of Mathematical
Statistics" aims quote; JCGS/CSDA scope quotes) were **dropped from the tallies** — agents had
honestly self-flagged each as `[UNFETCHED]`; the protocol worked as designed. Replacements: INFORMS
via Wayback 2010 snapshot; SIAM SIAG-FME via Wayback 2024 snapshot (group + journal existence);
Statistics-and-Computing aims verified directly at Springer.

**Classification-source stances** were collected by the orchestrator directly (not by agents), live:
MSC 2020 official CSV (msc2020.org), LCC outline PDFs (loc.gov) **plus LCC linked-data authority
records (id.loc.gov) for sub-outline granularity**, UDC Summary AJAX tree (udcsummary.info), OECD
Fields of Research and Development (FORD/Frascati) via the ARRS mirror (arrs.si). All fetched
2026-06-11.

---

## Clause-6 operationalization (first-application precedent)

The clause text fixes the arithmetic (≥3 independent sources; dominant = majority + ≥2) but not how
**explicitly-dual/interface stances** count, nor how a **node verdict propagates to an edge whose own
claim is not what was contested**. Rulings adopted (QC-level interpretation inside ratified policy;
surfaced on the session dashboard for CPO review):

1. **Stance buckets.** Per item, each independent organization is read as: *supports* the current
   placement/identity (files, houses, or names it there); *opposes* (files it under a competitor);
   or *interface/dual* (explicitly affirms both memberships, e.g. "interface between the
   mathematical and biological sciences").
2. **Interface ≠ opposition, but interface ≠ support either.** A verdict of *dominant* requires the
   supporting position to win **robustly under both readings** — counting interface stances as
   compatible-with-placement AND excluding them entirely. Where the two readings disagree (e.g.
   control theory), the case is a **genuine split**, not dominance. Sources that *deny the premise of
   a disciplinary home* ("not a science itself but the application of science" — Britannica on OR)
   are interface-grade denials, never support.
3. **Consensus bar.** Plain consensus (no `disputed` tag) additionally requires **no competitor
   filing by any gate-grade source** and at most incidental interface language (§12 precedent
   language: the concern "does not survive source agreement").
4. **Edge propagation follows the edge's own claim.** Where the node contest *is* the parent
   question (boundary contests), the resolved edge inherits `disputed: true` + minority note. Where
   the node contest is an **identity** question (peer-subfield vs paradigm/topic) and **no source
   contests the parent**, the edge promotes **plain** — tagging the edge disputed would assert a
   contest that does not exist. The node still carries `disputed: true` under a dominant-identity
   verdict.
5. **§12 transfer test** (both primary classification home AND dominant institutional home outside →
   transfer): applied wherever a competitor bloc was substantial. **No transfers resulted** — in
   every examined case (operations research, control theory, mathematics education, game theory) at
   least the classification prong stays inside formal sciences. A case where the *institutional*
   prong alone is outside parks at `proposed` if dominance fails (control theory), or resolves
   dominant-with-minority if it holds (e.g. financial mathematics).

**Outcome: 2 consensus → plain reviewed / 8 dominant → reviewed + disputed / 3 genuine splits +
1 out-of-scope flag → remain proposed.** 10 nodes promoted; 10 connected edges promoted (6 disputed,
4 plain); 4 edges stay endpoint-capped. No retargeting, no transfers.

---

## Consensus — resolved, plain `reviewed` (2)

### subfield:applied-mathematics — RESOLVED (consensus)
Contested: distinct division/research identity of mathematics vs administrative umbrella.
- Brown University, Division of Applied Mathematics (standalone; "one of the oldest and strongest of
  its type"): <https://appliedmath.brown.edu/about>
- University of Washington, Department of Applied Mathematics (standalone dept):
  <https://amath.washington.edu/>
- MIT Mathematics — Applied Mathematics division (own committee, six named sub-areas):
  <https://math.mit.edu/research/applied/>
- Cambridge: DAMTP is a separate department from DPMMS (pure/statistics):
  <https://www.dpmms.cam.ac.uk/>
- *Princeton Companion to Applied Mathematics* (dedicated major reference work):
  <https://press.princeton.edu/books/hardcover/9780691150390/the-princeton-companion-to-applied-mathematics>
- IMA (UK): "mathematics and applied mathematics research" as named co-equal category:
  <https://www.ima.org.uk/about-us/>
- SIAM: ~14,000-member society of applied mathematicians; hosts the discipline's activity-group and
  journal infrastructure (Wayback snapshot of siam.org, 2024-12-08:
  <https://web.archive.org/web/20241208053641/https://www.siam.org/get-involved/connect-with-a-community/activity-groups/financial-mathematics-and-engineering/>).
- **Verdict:** every source treats applied mathematics as a recognized, self-standing research
  identity within the mathematical sciences; none supports umbrella-only status. Flag flipped →
  `reviewed`. Curiosity recorded, not a contest: LCC *also* keeps an "Applied mathematics.
  Quantitative methods" range under Technology (T57, id.loc.gov live) for industrial-engineering
  shelving — it does not contest area-hood within mathematics.
- Edge `applied-mathematics-part-of-mathematics`: B-note replaced; **plain reviewed** (grounding
  UDC 519-cluster + LCC QA + MSC applied sections, live-verified in skeleton-part-of-edges-v1).

### subfield:computational-statistics — RESOLVED (consensus)
Contested: primary home statistics vs computer science/machine learning.
- ASA Section on Statistical Computing (a section of the statistics professional body):
  <https://community.amstat.org/jointscsg-section/home>
- UC Berkeley Statistics — "Statistical Computing" named research area inside the statistics dept:
  <https://statistics.berkeley.edu/research/statistical-computing>
- MSC 2020 (live): 62-08 "Computational methods for problems pertaining to statistics" — a
  subsection of 62 Statistics.
- LCC (live, id.loc.gov): QA276.4 under Mathematics--Mathematical statistics.
- Interface framing recorded (not opposition): IASC bridges statisticians and computing professionals
  (IFIP-affiliated) <https://iasc-isi.org/>; *Statistics and Computing* "publishes papers covering
  the range of the interface between the statistical and computing sciences" (verified live at
  Springer: <https://link.springer.com/journal/11222/aims-and-scope>).
- **Verdict:** the feared competitor position (CS/ML as primary home) received **zero** support in
  any fetched source; statistics-side filings are unanimous. Flag flipped → `reviewed` (consensus —
  interface language is about content, no competitor filing exists).
- Edge `computational-statistics-part-of-statistics`: **plain reviewed**.

---

## Dominant position — `reviewed` + `disputed: true`, minority recorded (8)

### subfield:mathematical-physics — DOMINANT [mathematics]
- **Supporting:** Britannica — "Branch of mathematical analysis…" (emphasis on tools for physics):
  <https://www.britannica.com/science/mathematical-physics>; institutional pattern — groups housed in
  mathematics units at ETH (<https://math.ethz.ch/research/mathematical-physics.html>), Columbia
  ("recognized sub-field of mathematics", <https://www.math.columbia.edu/department/mathematical-physics/>),
  Oxford Mathematical Institute (<https://www.maths.ox.ac.uk/groups/mathematical-physics>), UW
  (<https://www.math.washington.edu/research-fields>); MSC 2020 carries 81/82/83 (quantum,
  statistical mechanics, relativity) inside the mathematics classification (weak-support: section
  titles name physics subjects).
- **Minority (permanent record):** **LCC files mathematical physics under Physics** — QC20
  "Science--Physics--Mathematical physics" (id.loc.gov, live 2026-06-11); UDC Summary names no
  mathematical-physics class at all (no stance). Interface framing is standard (ETH: "at the
  interface between mathematics and physics").
- **Verdict:** dominant [MATH] robust under both stance readings → `reviewed`, `disputed: true`.
- Edge `mathematical-physics-part-of-mathematics`: reviewed + `disputed: true`, minority in note.

### subfield:mathematical-biology — DOMINANT [mathematics]
- **Supporting:** institutional pattern — Oxford Wolfson Centre for Mathematical Biology inside the
  Mathematical Institute (<https://www.maths.ox.ac.uk/groups/mathematical-biology>), Brown Applied
  Mathematics research area (<https://appliedmath.brown.edu/research>), UW Applied Mathematics
  strength (<https://amath.washington.edu/>); MSC 92 in the mathematics classification (weak-support:
  title "Biology and other natural sciences"); Britannica frames it as applications of mathematical
  methods (<https://www.britannica.com/science/mathematical-biology>).
- **Interface (affirms both memberships):** SMB — "interface between the mathematical and biological
  sciences" (<https://www.smb.org/>); ESMTB — "mathematical tools in biology and medicine"
  (<https://esmtb.org/>).
- **Minority (permanent record):** **LCC shelves it under Biology** — QH323.5 "Science--Biology
  (General)--Biometry. Biomathematics. Mathematical models" (id.loc.gov, live).
- **Verdict:** dominant [MATH] robust both ways (without interface votes: institutions + MSC vs LCC)
  → `reviewed`, `disputed: true`.
- Edge `mathematical-biology-part-of-mathematics`: reviewed + `disputed: true`, minority in note.

### subfield:game-theory — DOMINANT [mathematics]
- **Supporting (direct):** Britannica — "branch of applied mathematics"
  (<https://www.britannica.com/science/game-theory>); LCC QA269 "Science--Mathematics--Algebra--Game
  theory" (id.loc.gov, live); UDC 519.83 "Game theory" under 51 Mathematics (UDC Summary, live);
  MSC 91A "Game theory" (within 91, whose title names the shared estate: "Game theory, economics,
  finance, and other social and behavioral sciences").
- **Multi-domain (affirms shared ownership):** Game Theory Society — "central tool for economics and
  the social sciences, … challenging research questions in mathematics, … applied across computer
  science, …" (<https://www.gametheorysociety.org/about/>); SEP game-theory entry
  (<https://plato.stanford.edu/entries/game-theory/>); Elsevier *Handbook of Game Theory with
  Economic Applications* (<https://shop.elsevier.com/books/handbook-of-game-theory-with-economic-applications/aumann/978-0-444-89428-1>);
  AEA JEL classification: C7 "Game Theory and Bargaining Theory" under **C: Mathematical and
  Quantitative Methods** — economics files game theory as mathematical method
  (<https://www.aeaweb.org/econlit/jelCodes.php?view=jel>).
- **Minority (permanent record):** economics-primary framing of the applications ecosystem (the
  Handbook's economic anchoring; JEL's claim of the area as economics' own quantitative toolbox);
  algorithmic game theory claimed as a theoretical-CS area (Princeton CS theory group,
  <https://theory.cs.princeton.edu>).
- **Verdict:** the session order's flagged scenario (dominance flipping to economics) did **not**
  materialize: all three gate classification systems + Britannica file it in mathematics. Dominant
  [MATH] → `reviewed`, `disputed: true`. §12 transfer test: not triggered.
- Edge `game-theory-part-of-mathematics`: reviewed + `disputed: true`, minority in note.

### subfield:information-theory — DOMINANT [mathematics]
- **Supporting:** Encyclopedia of Mathematics — "the branch of applied mathematics and cybernetics"
  (<https://encyclopediaofmath.org/wiki/Information_theory>); Britannica — "a mathematical
  representation of the conditions and parameters affecting the transmission and processing of
  information" (<https://www.britannica.com/science/information-theory>; engineering centrality
  acknowledged in the same entry); UDC 519.7 "Mathematical cybernetics" cluster under 51 (Summary
  live; the 519.72 hint itself is below summary granularity); MSC 94 "Information and communication
  theory, circuits" in the mathematics classification.
- **Minority (permanent record):** operational home in ECE departments under communications/signals
  umbrellas (UCSD <https://ece.ucsd.edu/faculty-research/ece-research-areas>, UCSB
  <https://www.ece.ucsb.edu/research>); ACM SIGACT lists information theory within theoretical CS
  scope (<https://www.sigact.org/>). **LCC files Information theory at Q350-390 under Q Science
  (General)** — neither mathematics nor engineering (outline PDF, live).
- **Verdict:** dominant [MATH] (robust both ways: EoM + UDC + MSC vs EECS bloc) → `reviewed`,
  `disputed: true`. (IEEE ITSoc self-description could not be live-verified — page is a JS shell —
  and was dropped, per protocol.)
- Edge `information-theory-part-of-mathematics`: reviewed + `disputed: true`, minority in note.

### subfield:computability-theory — DOMINANT [mathematical logic]
- **Supporting:** SEP — "computability theory, a branch of contemporary mathematical logic"
  (<https://plato.stanford.edu/entries/recursive-functions/>); Encyclopedia of Mathematics
  foundations framing (<https://encyclopediaofmath.org/wiki/Computable_function>); institutional
  pattern — logic groups in mathematics departments at Berkeley
  (<https://math.berkeley.edu/research/areas/>), Cornell (<https://math.cornell.edu/research/logic>),
  Notre Dame (<https://math.nd.edu/research/logic/>), UW-Madison (<https://math.wisc.edu/research/>);
  MSC 03Dxx "Computability and recursion theory" under 03 Mathematical logic and foundations (live);
  **LCC QA9.59 "…--Mathematical logic--…--Computable functions. Computability theory"** (id.loc.gov,
  live); UDC 510.2/.3/.6 logic cluster (Summary live).
- **Minority (permanent record):** Britannica — "much of the specialized work belongs as much to
  computer science as to logic" (<https://www.britannica.com/topic/recursion-theory>); computability
  as core theoretical-CS curriculum (UW-Madison CS theory pages).
- **Verdict:** dominant [MATHLOGIC] (near-consensus; Britannica's dual sentence + CS curricular claim
  keep it from the consensus bar) → `reviewed`, `disputed: true`.
- Edge `computability-theory-part-of-mathematical-logic`: reviewed + `disputed: true` — the dominant
  home is precisely the current parent (mathematical logic), minority in note.

### subfield:bayesian-statistics — DOMINANT [distinct subfield] (identity contest)
- **Supporting:** ISBA — dedicated international society since 1992 (<https://bayesian.org/>);
  dedicated journal *Bayesian Analysis* (<https://projecteuclid.org/journals/bayesian-analysis/scope-and-details>);
  Duke Statistical Science — "the premier center worldwide for research and education in Bayesian
  methods" (<https://stat.duke.edu/research/theory-methods-computation>); **LCC QA279.5
  "…--Mathematical statistics--Decision theory--Bayesian statistics"** (id.loc.gov, live); MSC 62F15
  "Bayesian inference" (live).
- **Minority (permanent record):** method/paradigm framing — Britannica: "a method of statistical
  inference" (<https://www.britannica.com/science/Bayesian-analysis>); ISBA's own descriptive text
  speaks of "the Bayesian paradigm" / "the two statistical paradigms"
  (<https://bayesian.org/what-is-bayesian-analysis/>).
- **Verdict:** dominant [SUBFIELD] — the named-community and classification record is decisive, the
  paradigm framing is real and recorded → `reviewed`, `disputed: true`.
- Edge `bayesian-statistics-part-of-statistics`: **plain reviewed** (identity contest; no source
  contests the statistics parent — operationalization ruling 4).

### subfield:time-series-analysis — DOMINANT [distinct area] (identity contest)
- **Supporting:** NBER-NSF Time Series Conference — "the premier annual conference in time series"
  since the 1970s (<https://sites.google.com/site/nbernsfts/home>; IMS listing
  <https://imstat.org/meetings-calendar/2025-nber-nsf-time-series-conference/>); CMU Statistics —
  named research area (<https://www.cmu.edu/dietrich/statistics-datascience/research/index.html>);
  dedicated journal *Journal of Time Series Analysis* (existence verified via Wayback snapshot
  <https://web.archive.org/web/20250118122901/https://onlinelibrary.wiley.com/journal/14679892>; its
  oft-quoted "branch of Mathematical Statistics" aims line could not be live-verified and was
  dropped); peer-reviewed overview calling it "an entire research discipline"
  (<https://pmc.ncbi.nlm.nih.gov/articles/PMC10742437/>); **LCC QA280 "…--Mathematical
  statistics--Time series analysis"** (id.loc.gov, live); MSC 62M10 (live).
- **Minority (permanent record):** topic/technique framing — Britannica
  (<https://www.britannica.com/topic/time-series>) and the International Encyclopedia of the Social
  Sciences via encyclopedia.com (<https://www.encyclopedia.com/social-sciences/encyclopedias-almanacs-transcripts-and-maps/time-series-analysis>).
- **Verdict:** dominant [AREA] → `reviewed`, `disputed: true`.
- Edge `time-series-analysis-part-of-statistics`: **plain reviewed** (identity contest; parent
  uncontested).

### subfield:financial-mathematics — DOMINANT [mathematics]
- **Supporting:** SIAM hosts the Activity Group on Financial Mathematics and Engineering and the
  *SIAM Journal on Financial Mathematics* (Wayback snapshot of the SIAG page, live-verified
  2026-06-11: <https://web.archive.org/web/20241208053641/https://www.siam.org/get-involved/connect-with-a-community/activity-groups/financial-mathematics-and-engineering/>);
  institutional mathematics-department pattern — NYU Courant Mathematics in Finance
  (<https://math-finance.cims.nyu.edu/>), Florida State Mathematics
  (<https://mathematics.fsu.edu/graduate/degree-programs/financial-mathematics>), U Chicago
  Mathematics (<https://mathematics.uchicago.edu/graduate/financial-mathematics/>), UW Applied
  Mathematics (<https://amath.washington.edu/fields/financial-mathematics>); EBSCO Research Starters
  — "a field of mathematics" (<https://www.ebsco.com/research-starters/business-and-management/mathematical-finance>;
  note: EBSCO itself files the article under Business & Management); MSC 91G "Actuarial science and
  mathematical finance" (live).
- **Interface:** Bachelier Finance Society — "the broad field of mathematical finance," bridging
  academia and industry (<https://www.bachelierfinance.org/mission-and-vision>); *Finance and
  Stochastics* — "intersection of finance and stochastic processes … finance, mathematics,
  statistics, and economics" (scope via jrank mirror <https://jrank.net/journals/financ-stoch>).
- **Minority (permanent record):** **LCC files the area under Finance** — HG106 "Social
  Sciences--Finance--Theory…--Mathematical models" (id.loc.gov, live; the node's original LCC home
  HG was the closest-call flag in QC); business-school program strand — BU Questrom
  (<https://www.bu.edu/questrom/graduate-programs/specialty-masters-programs/ms-in-mathematical-finance-and-financial-technology/>),
  CMU MSCF cross-school (<https://www.cmu.edu/mscf/>). UDC hint 336 (finance) not verifiable at
  Summary granularity — recorded as unverified.
- **Verdict:** dominant [MATH] robust both ways → `reviewed`, `disputed: true`.
- Edge `financial-mathematics-part-of-mathematics`: reviewed + `disputed: true`, minority in note.

---

## Genuine splits — remain `proposed` (3)

### subfield:operations-research — SPLIT (stays proposed)
- Mathematics-side filings: MSC 90 "Operations research, mathematical programming"; UDC 519.8
  "Operational research (OR): mathematical theories and methods" under 51 (both live).
- Engineering-side: NSF funds OR under the **Engineering** directorate ("Operations Engineering",
  <https://www.nsf.gov/funding/opportunities/oe-operations-engineering>); institutional homes are
  engineering schools — Cornell ORIE (<https://www.duffield.cornell.edu/orie/about>), Berkeley IEOR
  (<https://www.ieor.berkeley.edu/about/what-is-ieor/>); **LCC files OR under Technology** — T57
  "Technology--Technology (General)--Industrial engineering--Applied mathematics. Quantitative
  methods" (id.loc.gov, live).
- Own-discipline/multi framings (deny a single home): Britannica — "the application of scientific
  methods … **is not a science itself** but rather the application of science … by teams of
  scientists and engineers from a variety of disciplines"
  (<https://www.britannica.com/topic/operations-research>); EURO
  (<https://www.euro-online.org/web/pages/301/or-and-euro>); INFORMS positions OR as its own
  discipline ("The Science of Better", Wayback 2010 snapshot
  <https://web.archive.org/web/20100206233421/http://www.informs.org/About-INFORMS/About-Operations-Research>).
- **Verdict:** three-way split (MATH 2 / ENG 3 / own-discipline 3); no position reaches
  majority+robustness. §12 transfer test fails (classification prong split — MSC+UDC inside, LCC
  outside). **Stays `proposed`**; standing cross-listing candidate (already in the
  skeleton-part-of-edges-v1 queue).
- Edge `operations-research-part-of-mathematics`: stays proposed (endpoint cap + recorded split).

### subfield:control-theory — SPLIT (stays proposed)
- Mathematics-side: MSC 93 "Systems theory; control"; **LCC QA402.3
  "Science--Mathematics--Analysis--…--Control theory (General and linear)"** (id.loc.gov, live);
  UDC 517.977-cluster under Analysis (Summary umbrella live).
- Engineering-side: Britannica files control under technology/Mechanical Engineering
  (<https://www.britannica.com/technology/control-system>); **LCC *also* files control engineering at
  TJ213 "Technology--Mechanical engineering…--Control engineering systems"** (id.loc.gov, live) —
  LCC itself maintains both homes; institutional pattern is engineering — MIT course 6.241J offered
  by EECS+Aero (<https://ocw.mit.edu/courses/6-241j-dynamic-systems-and-control-spring-2011/>),
  Imperial Control & Power group in EE
  (<https://www.imperial.ac.uk/electrical-engineering/research/control-and-power/>); no source
  retrieved places its primary institutional home in a mathematics department.
- Dual framings: IFAC — "the science **and technology** of control … in both theory and application"
  (<https://www.ifac-control.org/about/aims>); MIT LIDS interdepartmental structure
  (<https://lids.mit.edu>); IEEE CSS "theory and practice" (<https://ieeecss.org/about>).
- **Verdict:** the two stance readings disagree (interface-as-compatible → math-side bare majority;
  interface-excluded → engineering plurality with the encyclopedic + unanimous institutional
  evidence). Under operationalization ruling 2 this is a **genuine split** → stays `proposed`. §12
  transfer test also fails (classification prong has live math-side filings). Cross-listing
  candidate; an engineering continent would re-pose the question cleanly.
- Edge `control-theory-part-of-mathematics`: stays proposed.

### subfield:mathematics-education — SPLIT (stays proposed)
- Mathematics-side: ICMI is "an official commission of the **International Mathematical Union**"
  (<https://www.mathunion.org/icmi/organization/about-icmi>); MSC 97 "Mathematics education" is a
  top-level MSC section (live); mathematics-department research strand exists — Virginia Tech
  (interdisciplinary group with the School of Education, <https://math.vt.edu/research/math-ed-research.html>),
  UC San Diego mathematics dept (<https://math.ucsd.edu/research/mathematics-education>).
- Education/social-science-side: **OECD FORD/Frascati files Educational sciences at 5.3 under Social
  Sciences** (mathematics is 1.1 under Natural Sciences; no math-education subfield exists in FORD)
  — verified live via the ARRS mirror (<https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp>);
  *Educational Studies in Mathematics* — "theoretical, pedagogical, methodological, and didactical
  aspects … of the teaching and learning of mathematics" (verified live at Springer
  <https://link.springer.com/journal/10649>); dominant doctoral-program home is education schools —
  NYU Steinhardt PhD in Teaching and Learning, Mathematics Education concentration (verified live
  <https://steinhardt.nyu.edu/degree/phd-teaching-and-learning/mathematics-education>); Stanford
  GSE/Penn State CoE same pattern (agent-collected; direct fetches bot-blocked — recorded as weakly
  verified).
- Bridge: ERME treats mathematics-education research as its own cohesive domain, ICMI-affiliated
  (<https://erme.site/visions-of-erme/>).
- **Verdict:** the apex bodies split cleanly — the field's international commission lives inside the
  mathematicians' union while the dominant research-classification and doctoral-program home is
  education/social science. No majority either way under any reading. **Stays `proposed`.**
  Cross-listing candidate.
- Edge `mathematics-education-part-of-mathematics`: stays proposed.

---

## Out-of-scope flag — remains `proposed` (1)

### subfield:cybernetics — placement anchored; vitality contest out of scope
- Placement evidence (recorded for future use): nothing files cybernetics under a competitor
  discipline as primary — IEEE SMC integrates it "towards the formulation of a general theory of
  systems" (<https://www.ieeesmc.org/about-smcs/>); ISSS groups it with the systems-science community
  (<https://www.isss.org/world/>); UDC 007 and LCC Q300-390 (both live, sessions #4/#5) keep the
  systems/general-science cluster; Britannica defines it via control theory applied to complex
  systems (<https://www.britannica.com/science/cybernetics>); EoM calls it a cross-disciplinary
  science of "control, communication and processing of information"
  (<https://encyclopediaofmath.org/wiki/Cybernetics>); ASC frames it as
  "inter-/trans-/meta-disciplinary" (<https://asc-cybernetics.org/>). The systems-science anchoring
  of `edge:cybernetics-part-of-systems-science` stands unopposed.
- **However**, this node's recorded B-flag reason is the **vitality contest** (historical vs
  established `academic_status`) — explicitly out of scope for this batch by session order. A node
  with a live real-world contest keeps `ambiguous: true` → **stays `proposed`**; the flag's reason is
  hereby narrowed to the vitality question alone.
- Edge `cybernetics-part-of-systems-science`: stays proposed (endpoint cap; its own grounding has
  been complete since skeleton-part-of-edges-v1).

#### Vitality resolution append (2026-06-11, session #6) — RESOLVED (consensus, established)

The parked vitality contest (historical vs established `academic_status`) was resolved under the
v1.1/clause-6 research path. Collection: 1 Sonnet research subagent (claude-sonnet-4-6, separated
context), neutral framing, live-fetch mandate + `[UNFETCHED]` self-flagging. Verdict: Claude
Fable 5 (orchestrator), 2026-06-11, after batch URL pre-verification.

- **URL verification:** 17 sources cited; 12 fetched-claimed → 11 verified live by the
  orchestrator + 1 (Emerald/Kybernetes) bot-blocked to curl but confirmed via Wayback snapshot
  (2025-07-15) **and** Crossref publication data; 5 honestly self-flagged `[UNFETCHED]` (WOSC 504,
  UK Cybernetics Society 403, T&F journal 403, CTU page, MDPI 403) — excluded from the tally.
  **0 dead/fabricated URLs.** Load-bearing claims content-checked: ASC Conference 2026
  ("Conversational Confluences", Aug 3–7) verified via Wayback snapshot 2026-05-10 of
  asc-cybernetics.org; Kybernetes actively publishing (Crossref: 37 works dated 2026, latest
  2026-06-09); IEEE Transactions on Cybernetics (Crossref: 487 works dated 2026); Biological
  Cybernetics (Crossref e-ISSN 1432-0770: latest 2026-06-09); NTNU Cybernetics and Robotics
  degree programs live (<https://www.ntnu.edu/itk/studies>); ANU School of Cybernetics live
  (<https://cybernetics.anu.edu.au/>); EoM "specialized applied branches of cybernetics have
  arisen and continue to be developed" verified in page text
  (<https://encyclopediaofmath.org/wiki/Cybernetics>).
- **Stance tally (clause 6):** *established* — all four evidence axes: societies (ASC 2026
  conference + monthly study group; IEEE SMC retains cybernetics in name, charter, and annual
  conference <https://www.ieeesmc.org>; WOSC congress held 2024), dedicated journals (3 verified
  actively publishing in 2026), university programs (NTNU department; ANU school founded 2021),
  encyclopedic present-tense descriptions (EoM; Britannica
  <https://www.britannica.com/science/cybernetics>; EBSCO "has continued to develop"
  <https://www.ebsco.com/research-starters/engineering/cybernetics>). *historical* — **zero
  gate-grade sources file the field as historical.** The University of Reading 2015 closure
  (<https://www.getreading.co.uk/news/reading-berkshire-news/university-readings-school-systems-engineering-9701535>)
  is a single-institution restructuring event, not a status filing; the recorded dissolution
  history (1960s–70s fragmentation into control theory/systems science/CS) is acknowledged by
  Wikipedia, which itself describes renewed interest from the 1990s onward
  (<https://en.wikipedia.org/wiki/Cybernetics>).
- **Verdict: consensus** (operationalization ruling 3 — no competitor filing by any gate-grade
  source; the same pattern as computational-statistics, where the feared competing position drew
  zero support). `academic_status` confirmed **established**; flag flipped → node `reviewed` +
  indexable. Nuance permanently recorded, not tagged: the field's modern footprint is partly
  transformed (IEEE TC content is de facto computational/AI-flavored; ANU's program is a
  sociotechnical reinterpretation) — recorded here for future re-audit, but no source elevates
  this into a historical-status claim, so no `disputed` tag is warranted.
- Edge `cybernetics-part-of-systems-science` promoted to `reviewed` (endpoint cap lifted;
  grounding complete since skeleton-part-of-edges-v1; the edge's own claim was never contested —
  ruling 4).

---

## Dashboard

- **Clause-6 first-application distribution: 합의 2 / 우세+disputed 8 / 분열 3 / 스코프외-잔류 1.**
  (`disputed: true` enters /data for the first time: 8 nodes, 6 edges.)
- Connected-edge promotions: **10** (6 disputed + 4 plain); 4 stay endpoint-capped. **No retargeting,
  no §12 transfers** (transfer test never met both prongs).
- Research-citation hallucination: **0/84 dead or fabricated URLs (0%)** vs editorial hints 41%/59%
  and QID hints 93%/71%. Live-fetch discipline + self-flagged `[UNFETCHED]` markers worked; 4
  unverifiable quotes dropped, 3 replaced via Wayback/direct routes.
- /data after this change: nodes 128 (reviewed **119** / proposed 9), edges 132 (reviewed **112** /
  proposed 20). Remaining proposed nodes: OR, control-theory, mathematics-education, cybernetics
  (this batch) + 3 philosophy parked + 2 PhilPapers-grounded upstream gaps.
- New permanent evidence paths added to the playbook this session: **id.loc.gov LCC authority
  records** (sub-outline granularity, JSON) and **OECD FORD via ARRS mirror**.

---

## Cross-listing v1 application append (2026-06-11, session #7) — the 3 genuine splits RESOLVED

**Policy:** cross-listing policy v1, CPO-ratified 2026-06-11 (vault decision log (21)): co-equal
multiple `part_of` memberships, single node ID with render-time instances, second edges under the
same clause-1 evidence discipline, per-edge confidence/disputed/note for asymmetry. Policy text
appended to docs/data-foundry.md §13 in this same change. Under this model the "choose the single
parent" question the three splits were stuck on **no longer exists**; each membership edge passes
its own evidence gate instead.

**Performed by:** Claude Fable 5 (claude-fable-5), orchestrator context. Both-side evidence was
already collected and verified by the clause-6 research above (5 Sonnet subagents, separated
contexts) — reused per the ratification. **Every URL cited in the new/updated edge notes was
batch re-verified live 2026-06-11 before writing: 17/17 HTTP 200, 0 dead/fabricated (0%).**
New live grounding fetched directly by the orchestrator for caption accuracy: id.loc.gov authority
records T57-T57.97 ("Applied mathematics. Quantitative methods"), TJ212-TJ225 ("Control engineering
systems. Automatic machinery (General)" — whose own record cross-references QA402.3-QA402.37
"Control theory (General and linear)": LCC maintains both homes in one record), QA8.9-QA10.35
("Mathematical logic"); MSC_2020.csv 03-XX; UDC Summary 510.6 / 16 / 37; OECD FORD via ARRS
(5.3 Educational sciences under 5. Social Sciences; 1.1 Mathematics under 1. Natural Sciences).

### Membership edges written (4)

| edge | evidence gate | status |
|---|---|---|
| operations-research → engineering-and-technology (new) | LCC T57-T57.97 + NSF OE + Cornell ORIE/Berkeley IEOR | reviewed, **disputed** |
| operations-research → mathematics (promoted) | MSC 90 + UDC 519.8 (grounded since skeleton batch) | reviewed, **disputed** |
| control-theory → engineering-and-technology (new) | LCC TJ212-TJ225 + Britannica + MIT/Imperial pattern + IFAC | reviewed |
| control-theory → mathematics (promoted) | MSC 93 + LCC QA402.3 + UDC 517.977 cluster | reviewed |
| mathematics-education → social-sciences (new) | OECD FORD 5.3 + UDC 37 + doctoral-home pattern + ESM | reviewed |
| mathematics-education → mathematics (promoted) | ICMI/IMU + MSC 97 + dept research strands | reviewed |

(6 rows: 3 new memberships + 3 promoted first edges — the table lists all six for one-glance
re-audit. A 7th edge, logic → mathematics, is recorded below.)

**Disputed semantics under cross-listing (QC ruling, recorded as precedent):** once memberships
are co-equal, a source that files the node under parent B no longer *opposes* the parent-A edge —
it supports the other membership. `disputed` therefore marks only a **residual premise-denying
minority**: for operations research, the own-discipline position (Britannica: "not a science
itself but rather the application of science"; EURO; INFORMS) denies subordination to *any*
parent, so **both** OR membership edges and the OR **node** carry `disputed: true` with the
minority recorded. Control theory (IFAC dual framing affirms both memberships) and mathematics
education (no source denies either membership) carry no disputed tag; their asymmetries are
conveyed by confidence and notes.

### Node promotions (3)

`subfield:operations-research` (disputed: true), `subfield:control-theory`,
`subfield:mathematics-education` → `reviewed` + `indexable` (proposal.json `ambiguous` flipped
false with resolution notes). Clause-6 cumulative distribution moves to **consensus 3 / dominant 8
/ genuine splits 0** — the splits column empties via the model change, not via re-litigated
verdicts; the underlying stance records above remain the permanent evidence.

### logic → mathematics second membership (ratified scope item)

`edge:logic-part-of-mathematics` (subfield:logic, humanities → field:mathematics): all three gate
schemes carry logic inside mathematics via its symbolic/mathematical wing — MSC 03-XX
"Mathematical logic and foundations" (msc2020.org CSV, live), LCC QA8.9-QA10.35 "Mathematical
logic" (id.loc.gov, live), UDC 510.6 under 51 (live) — while the same schemes keep the broad home
in philosophy (UDC 16 under 1, live; LCC BC). Clause 1 satisfied → `reviewed` (both endpoints
reviewed). `subfield:mathematical-logic` remains a distinct formal-sciences node (§12
peer-coexistence precedent); the note on the edge spells out the distinction.

### Editorial (3 summaries, editorial v1)

Generation: 1 Sonnet subagent (claude-sonnet-4-6, separated context, live-fetch mandate +
`[UNFETCHED]` self-flagging). Source hints: 9 cited, 8 honestly fetched, 1 honest `[UNFETCHED]`
self-flag (ESM aims — the orchestrator then fetched it directly at
link.springer.com/journal/10649/aims-and-scope and used the verified text). **Hint URL
hallucination: 0% (8/8 fetched-claimed URLs live and content-bearing).**

QC (orchestrator, full fact cross-check against orchestrator-fetched page text): all three
summaries **QC-edited** before application — principal corrections: (a) OR/control "classified
under applied mathematics by the MSC" loosened-claim fixed to the schemes' actual filings (MSC 90 /
MSC 93 are their own sections of the mathematics classification); (b) control "treated as a branch
of systems engineering by IEEE and IFAC" dropped (IEEE uncited; IFAC's own aims text says
'science and technology of control' — used verbatim instead); (c) control "dual home in
mathematics departments" dropped (contradicts the resolution finding that institutional homes are
engineering-unanimous; replaced with the LCC dual-filing fact); (d) OR "simulation" dropped (not
on the cited EoM page) and applications list aligned to Britannica's own enumeration; (e) math-ed
research-topics list replaced with ESM aims-and-scope verbatim categories
(methodological/pedagogical-didactical/political/socio-cultural); ERME founding rephrased to the
page's own wording; "informal settings" and unverifiable closing synthesis dropped. ICMI 1908/1952
claims verified verbatim on the ICMI page. en translations marked reviewed; parent nodes reviewed
in this same change (editorial v1 precondition holds at commit time).

### Dashboard delta

- /data: nodes 128 (reviewed **123** / proposed 5), edges **136** (reviewed **120** / proposed 16),
  sources 11 (+ source:oecd-ford), summaries 123 (all reviewed nodes covered).
- Remaining proposed nodes (5): 3 philosophy parked + 2 PhilPapers upstream gaps. Remaining
  proposed edges (16): 11 editorial measurement queue + 5 philosophy endpoint-capped part_of.
- Cross-listing applications still parked (unchanged scope): decision-theory second membership
  (economics target node absent), minority-side second edges for the disputed-5 (target continents
  absent) — reopen when those continents land.

## Cross-listing CS-target second memberships (2026-06-11, session #8) — 3 written, parked remainders recorded

> Scope per the session order: only the CS-targeted minority positions of the dominant-8 records.
> Gate: §13 same-evidence discipline — clause-1 live classification filing in the CS continent's
> ratified sources (ACM CCS is gate-level for CIS per the §12 2026-06-11 append; MSC 68 cross-check).
> All previously-collected citation URLs were re-verified live in one pass (4/4 alive, 0%
> hallucination): Britannica recursion-theory, sigact.org, theory.cs.princeton.edu,
> gametheorysociety.org/about.

### subfield:computability-theory → subfield:theoretical-computer-science — WRITTEN (reviewed)
- **Clause-1 filing (live):** ACM CCS "Theory of computation > Models of computation >
  Computability" (Wayback snapshot 20191108 of ccs_flat.cfm); MSC 68Q04 "Classical models of
  computation (Turing machines, etc.)" (msc2020.org CSV).
- **Minority record reused:** Britannica — "much of the specialized work belongs as much to
  computer science as to logic" (re-verified live); core TCS curriculum.
- **Flag effect:** node + edge:computability-theory-part-of-mathematical-logic `disputed` retired —
  the minority became a written co-equal membership; under the session-7 standing interpretation an
  other-parent filing is support, not contest. The 2026-06-11 clause-6 stance record above persists
  unchanged.

### subfield:information-theory → field:computer-science — WRITTEN (reviewed)
- **Clause-1 filing (live):** ACM CCS "Mathematics of computing > Information theory"; MSC 68P30
  "(aspects in computer science)" + 68Q30 "Algorithmic information theory".
- **Minority record reused:** SIGACT TCS scope listing (re-verified live — information theory named).
- **Flag effect:** node + edge:information-theory-part-of-mathematics `disputed` retired. **Parked
  remainder:** the ECE/engineering institutional claim (UCSD/UCSB) is a future engineering-membership
  candidate — no engineering-scheme classification filing collected; clause-1 gate not attempted.

### subfield:game-theory → subfield:theoretical-computer-science — WRITTEN (reviewed)
- **Clause-1 filing (live):** ACM CCS "Theory of computation > Theory and algorithms for application
  domains > Algorithmic game theory and mechanism design"; MSC 91A68 "Algorithmic game theory and
  complexity". Membership manifests through the algorithmic-game-theory wing — mirror of the
  logic→mathematics wing precedent (PR #47).
- **Minority record reused:** Princeton CS theory group AGT listing (re-verified live); GTS
  "applied across … computer science" (re-verified live).
- **Flag effect:** node + edge:game-theory-part-of-mathematics `disputed` retired. **Parked
  remainder:** the economics-primary claim (JEL C7, Handbook of Game Theory anchoring) awaits the
  social-sciences continent — stance records above persist.

### Dashboard delta (session #8 cross-listing)
- Second-membership edges written: 3/3 targeted (all clause-1 gates passed live; 0 parked of the
  CS-targeted set).
- Disputed retired: nodes 9 → 6, edges 8 → 5 (remaining: operations-research node + both OR edges
  [premise-denying minority]; mathematical-physics, mathematical-biology, financial-mathematics,
  bayesian-statistics, time-series-analysis per their unchanged records).
- Out of scope (parking unchanged): decision-theory 2nd (economics absent), math-physics/math-bio/
  fin-math minority sides (target continents absent), philosophy parking 3, upstream-gap 2.
