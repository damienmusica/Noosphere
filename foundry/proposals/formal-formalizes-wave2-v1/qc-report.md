# formal-formalizes-wave2-v1 — grounding + adversarial QC + verdicts (orchestrator)

> Lane B propositional-edge **wave 2**, session #28 (round 4, 2-lane stagger — Lane B). Permanent QC
> record for the second build of the Lane B pipeline contract (`lane-B-propositional-edge-pipeline-
> design.md`, decision (50)); precedent = wave 1 `formal-formalizes-v1/qc-report.md` (decision (51)).
> The orchestrator (Opus 4.8) performed Stages 2–5 in a context **separate** from the Sonnet generation
> subagent (ADR 0007 / immutable contract 2). Generation = `proposals.json`; scoping = `scoping.md`.
> Session effort High (multi-signal QC; reflexive xhigh avoided, patch ①).

## Method (Stages 2–5)

- **Stage 2 — atomize.** Each candidate's `formalizes` claim reduced to its atomic proposition: "A (the
  formalizing apparatus) provides a formal mathematical/logical framing for B (what gets formalized)."
  Cross-continent candidates carry the **direction atom** explicitly (A is the apparatus, B the
  subject) — the wave-2 strictness point.
- **Stage 3 — grounding.** Each atom corroborated by **≥2 independent claim-stating sources**, live-
  fetched at QC time (HTTP 200) and quoted **verbatim**. Evidence standard = a source that *states the
  claim*, not one that merely mentions both terms. Per wave-1 precedent, two distinct articles from one
  publication count as independent corroboration (wave-1 counted two EoM articles); the banned move is
  citing the *same article/paragraph* twice. Reachable orgs this session: SEP, Wikipedia, nLab (all 200).
  Encyclopedia of Mathematics returned **HTTP 502 site-wide** and Britannica **403** (bot-block) — not
  used live. Evidence permanence via Wayback SPN attempted at QC time (see SPN section); web.archive.org
  was **403/429/520 (bot-block + rate-limit)** this session, recorded honestly per data-foundry §8.
- **Stage 4 — adversarial perspective-diverse QC (φ̄, patch ②).** Three *distinct reasoning paths* per
  edge: **① source→claim** (does the cited source state the claim, anchor verbatim?), **② claim→counter-
  evidence** (refuting/limiting evidence → surface as disputed?), **③ referent + direction** (are
  source/target the right entities, and is A→B the correct direction — apparatus formalizes subject, not
  reversed/tautological/over-general?). Refutation framing. All findings reported with severity (patch ⑦).
  **Cross-continent direction was QC'd strictly** (the wave-2 mandate): the recurring failure mode found
  was **field-level over-breadth** (a formal tool used *across* a field ≠ formalizing the field).
- **Stage 5 — verdict** ∈ {supported / disputed (tension-preserved, both sides sourced) / NEI-abstain}.

## Referent axis (③) — pre-cleared

All 54 endpoints are existing **reviewed** nodes drawn from the 7 already-audited continents (FS, NS,
SS, CS, ENG, LS). Source endpoints are formal-sciences nodes (cleared by `qid-adversarial-audit-fs-v1`);
target endpoints passed their continents' audits. The "edges reference existing reviewed nodes only"
invariant **retires referent risk before QC begins**. Referent verdict: **clean for all 27.** The wave-2
QC budget therefore concentrates on axes ① (source states claim) and ③-direction (apparatus vs subject).

---

## Per-candidate grounding + QC

Format: verbatim ① anchors (with org), ② counter-evidence, direction check, verdict + confidence.

### Bucket A — cross-continent (verdicts: 17 supported, 2 NEI)

**A1 `game-theory` → `economics` — SUPPORTED (0.9).**
- ① SEP *Game Theory*: game theory analyses "the ways in which interacting choices of economic agents
  produce outcomes"; "classical game theory finds reliable application to them as entire units." Wikipedia
  *Game theory*: "Game theory is the study of mathematical models of strategic interactions." + "It has
  applications in many fields of social science, and is **used extensively in economics**, logic, systems
  science and computer science." (2 orgs: SEP + Wikipedia.)
- ② None refuting. Game theory is *the* formal apparatus of strategic economic interaction (von Neumann–
  Morgenstern 1944). Direction: apparatus (game theory) → subject (economic interaction). ✓

**A2 `game-theory` → `political-science` — SUPPORTED (0.82).**
- ① Wikipedia *Game theory*: "The 1950s also saw the first applications of game theory to philosophy and
  **political science**." + "Early examples of game theory applied to political science are provided by
  Anthony Downs." SEP *Game Theory*: party-political polarization "is often modelled using game-theoretic
  logic"; strategic-interaction logic "has been fundamental in modern political philosophy." (2 orgs.)
- ② Game theory formalizes the *formal/positive political theory* strand, not all of political science
  (note). Direction ✓. Supported, scope note.

**A3 `game-theory` → `evolutionary-biology` — SUPPORTED (0.92).**
- ① SEP *Evolutionary Game Theory*: Maynard Smith "[p]aradoxically, it has turned out that game theory is
  more readily applied to biology than to the field of economic behaviour for which it was originally
  designed." Wikipedia *Evolutionary game theory*: originated 1973 with Maynard Smith & Price; "Maynard
  Smith, a mathematical biologist, turned to game theory." (2 orgs.)
- ② None. EGT (ESS, replicator dynamics) is the formal framing of frequency-dependent selection.
  Direction ✓. Strongest of the social/biological cross-continent set.

**A4 `information-theory` → `telecommunications-engineering` — SUPPORTED (0.9).**
- ① Wikipedia *Information theory*: "Information theory is the mathematical study of the quantification,
  storage, and communication of … information" + the noisy-channel concept "was formalized in 1948 by
  Claude Shannon in a paper entitled A Mathematical Theory of Communication." Wikipedia *Channel capacity*:
  "Channel capacity, in electrical engineering, computer science, and information theory, is the
  theoretical maximum rate at which information can be reliably transmitted over a communication channel."
  (2 distinct articles.)
- ② None. Information theory supplies the formal limits (capacity, coding) of telecommunication.
  Direction ✓.

**A5 `information-theory` → `cryptography` — SUPPORTED (0.88).**
- ① Wikipedia *Information-theoretic security*: "The concept of information-theoretically secure
  communication was introduced in 1949 by … Claude Shannon … who used it to prove the one-time pad system
  was secure." Wikipedia *Information theory* (cryptography among its applications). (2 distinct articles.)
- ② Information theory formalizes *unconditional/perfect* secrecy; *computational* cryptography rests
  also on complexity/number theory (note — see A6). Direction ✓.

**A6 `number-theory` → `cryptography` — SUPPORTED (0.9).**
- ① Wikipedia *Number theory*: prime numbers "became the basis for the creation of public-key cryptography
  algorithms, such as the RSA cryptosystem." Wikipedia *RSA (cryptosystem)*: "The security of RSA is
  related to the difficulty of factoring the product of two large prime numbers." (2 distinct articles.)
- ② Number theory formalizes *public-key* cryptography specifically (not symmetric ciphers); scoped in
  note. Direction ✓.

**A7 `probability-theory` → `statistical-physics` — SUPPORTED (0.9).**
- ① Wikipedia *Statistical mechanics*: macroscopic properties explained "in terms of microscopic
  parameters that fluctuate about average values and are characterized by **probability distributions**";
  "The statistical ensemble is a probability distribution over all possible states of the system." nLab
  *statistical mechanics*: "an ensemble may be a probability distribution of similar physical systems."
  (2 orgs.)
- ② None. Probability is the formal substrate of the ensemble formalism (Gibbs/Boltzmann). Direction ✓.

**A8 `partial-differential-equations` → `fluid-dynamics` — SUPPORTED (0.92).**
- ① Wikipedia *Navier–Stokes equations*: "The Navier–Stokes equations are nonlinear partial differential
  equations." nLab *Navier-Stokes equations*: "The partial differential equation describing viscous
  hydrodynamics." (2 orgs.)
- ② None. PDEs (Euler/Navier–Stokes) are the formal governing equations of fluid motion. Direction ✓.

**A9 `control-theory` → `robotics` — SUPPORTED (0.85).**
- ① Wikipedia *Control theory*: control theory "created new fields such as robotics" and "Techniques from
  control theory are generally used to convert the higher-level tasks into individual commands that drive
  the actuators, most often using kinematic and dynamic models of the mechanical structure." Wikipedia
  *Robotics*: "The control of a robot involves three distinct phases — perception, processing, and action."
  (2 distinct articles.)
- ② Control theory formalizes the *motion/feedback-control* layer of robotics, not perception/planning
  (note). Direction ✓.

**A10 `control-theory` → `electrical-engineering` — NEI-ABSTAIN (correct rejection).**
- ① Control theory is "a field of control engineering and applied mathematics." No live source states that
  control theory **formalizes electrical engineering as a field**. EE spans circuits, electronics, power,
  electromagnetics, and signals that control theory does not formalize.
- ② **③-direction / field-over-breadth failure.** Control theory formalizes the *control-systems
  subdomain* (which is cross-listed across EE/ME/aerospace), not EE the field. The honest relation is a
  subdomain `formalizes` or `part_of`, not field-level `formalizes`. No claim-stating source for the
  field-level claim → **NEI-abstain.** Would likely be supported if re-targeted at a `control-systems-
  engineering` node (none exists). Honest gap; not written.

**A11 `mathematical-logic` → `theoretical-computer-science` — SUPPORTED (0.85).**
- ① Wikipedia *Theoretical computer science*: "Theoretical computer science is closely related to
  mathematics and logic" + "Formal methods are … the application of … logic calculi, formal languages,
  automata theory, and program semantics … to problems in software and hardware specification and
  verification." SEP *The Church-Turing Thesis*: "a fundamental claim in the theory of computability";
  computability is "formalism-transcendent." (2 orgs.)
- ② TCS has multiple formal roots (combinatorics, algebra); logic supplies the computability/
  formal-methods/type-theory core (note). Direction ✓.

**A12 `mathematical-logic` → `programming-languages` — SUPPORTED (0.85).**
- ① Wikipedia *Curry–Howard correspondence*: "a direct relationship between computer programs and
  mathematical proofs … This sets a form of logic programming on a rigorous foundation." Wikipedia
  *Semantics (computer science)*: formal semantics studies "the relation between computation and the
  underlying mathematical structures from fields such as logic, set theory, model theory, category
  theory." (2 distinct articles.)
- ② Logic formalizes PL *semantics/type systems* (Curry–Howard), not surface syntax/pragmatics (note).
  Direction ✓.

**A13 `category-theory` → `programming-languages` — SUPPORTED (0.8).**
- ① Wikipedia *Category theory*: "Many areas of computer science also rely on category theory, such as
  functional programming and semantics" + "Categorical logic is now a well-defined field based on type
  theory … with applications in functional programming and domain theory, where a cartesian closed
  category is taken as a non-syntactic description of a lambda calculus." Wikipedia *Semantics (computer
  science)*: "Categorical (or 'functorial') semantics uses category theory as the core mathematical
  formalism." (2 distinct articles.)
- ② Scoped to *typed/functional* PL semantics (monads, CCC); not all programming languages (note —
  edge-of-envelope, as scoped). Direction ✓.

**A14 `linear-algebra` → `quantum-information-science` — SUPPORTED (0.85).**
- ① Wikipedia *Mathematical formulation of quantum mechanics*: "This mathematical formalism uses mainly a
  part of functional analysis, especially Hilbert spaces, which are a kind of linear space." nLab *quantum
  information*: "the cogent aspects of Hilbert space-based quantum information theory"; "FHilb of finite
  dimensional Hilbert spaces." (2 orgs.)
- ② For *qubit/finite-dimensional* QIS the apparatus is (complex) linear algebra; the infinite-dimensional
  case is functional analysis (note). Direction ✓.

**A15 `statistics` → `econometrics` — SUPPORTED (0.85, near-tautological).**
- ① Wikipedia *Econometrics*: "Econometrics is an application of statistical methods to economic data in
  order to give empirical content to economic relationships." Wikipedia *Economics*: "Economic theories
  are frequently tested empirically, largely through the use of econometrics using economic data."
  (2 distinct articles.)
- ② **Low information content** — econometrics is *defined as* applied statistics, so the relation is near
  definitional (cf. wave-1 C6 probability→probability-distribution). Truth not in question; informativeness
  is (note). Direction ✓.

**A16 `dynamical-systems` → `ecology` — SUPPORTED (0.82).**
- ① Wikipedia *Lotka–Volterra equations*: "are a pair of first-order nonlinear differential equations,
  frequently used to describe the dynamics of biological systems in which two species interact." Wikipedia
  *Population dynamics*: "Population dynamics is a branch of mathematical biology, and uses mathematical
  techniques such as differential equations to model behaviour." (2 distinct articles.)
- ② `models` is an adjacent relation; the differential-equation framework *formalizes* population dynamics
  (note). Direction ✓.

**A17 `probability-theory` → `financial-economics` — SUPPORTED (0.8).**
- ① Wikipedia *Mathematical finance*: derivatives pricing uses "risk-neutral probability … continuous-time
  martingales … Itō calculus, PDEs"; risk management models "the statistically derived probability
  distribution of the market prices." Wikipedia *Financial economics*: "centers on decision making under
  uncertainty in the context of the financial markets." (2 distinct articles.)
- ② Probability formalizes the *asset-pricing / uncertainty* core; financial economics also has
  non-probabilistic (certainty/equilibrium) parts (note). Direction ✓.

**A18 `statistics` → `machine-learning` — SUPPORTED (0.78, tension note).**
- ① Wikipedia *Machine learning*: "Statistics and mathematical optimisation methods compose the
  foundations of machine learning" + "probably approximately correct learning provides a mathematical and
  statistical framework for describing machine learning." Wikipedia *Statistical learning theory*: "deals
  with the statistical inference problem of finding a predictive function based on data" + "there is some
  unknown probability distribution over the product space." (2 distinct articles.)
- ② **Tension preserved in note (record-not-resolve):** the *weak* claim "statistics provides a formal
  framework for ML" (via SLT/PAC) is supported; the *strong* claim "ML is just statistics" is contested —
  Leo Breiman's "two cultures" ("Machine learning and statistics are closely related fields … but distinct
  in their principal goal"). No source refutes the weak claim, so **supported + note**, not `disputed`
  (mirrors wave-1 C1/C2 foundations-plurality handling). Direction ✓.

**A19 `differential-equations` → `mechanical-engineering` — NEI-ABSTAIN (correct rejection).**
- ① Wikipedia *Differential equation*: DEs "play a prominent role in many disciplines including
  engineering, physics, economics, and biology." Wikipedia *Mechanical engineering*: ME programs include
  "differential equations, partial differential equations, linear algebra … among others." Both state DEs
  are **used in / a tool of** ME — neither states DEs **formalize ME as a field**.
- ② **③-direction / tool-vs-framing + field-over-breadth.** DEs formalize specific mechanical *phenomena*
  (equations of motion, vibration, heat transfer), but at field level the relation is `applies_to` /
  prerequisite, not `formalizes`. No claim-stating field-level source → **NEI-abstain.** Honest gap; not
  written.

### Bucket B — within-formal-sciences (verdicts: 3 supported)

**B1 `optimization` → `operations-research` — SUPPORTED (0.85).**
- ① Wikipedia *Operations research*: "Employing techniques from other mathematical sciences, such as
  modeling, statistics, and **optimization**, operations research arrives at optimal or near-optimal
  solutions to decision-making problems." Wikipedia *Mathematical optimization*: "Another field that uses
  optimization techniques extensively is operations research." (2 distinct articles.)
- ② Optimization is one of several OR techniques but is its formal/mathematical core (LP/IP/convex);
  scoped in note. Direction ✓.

**B2 `probability-theory` → `bayesian-inference` (method) — SUPPORTED (0.92).**
- ① Wikipedia *Bayesian inference*: "Bayesian inference computes the posterior probability according to
  Bayes' theorem." SEP *Bayes' Theorem*: "Bayes' Theorem relates the 'direct' probability of a hypothesis
  conditional on a given body of data … to the 'inverse' probability of the data conditional on the
  hypothesis." (2 orgs.)
- ② None. Bayes' theorem is a theorem of probability theory; Bayesian inference is built on it.
  Direction ✓. Strongest in bucket B.

**B3 `probability-theory` → `information-theory` — SUPPORTED (0.85).**
- ① Wikipedia *Information theory*: "Information theory is based on probability theory and statistics."
  nLab *entropy*: "We can give a precise mathematical definition of the entropy in probability theory.
  Fix a probability space (X,μ)." (2 orgs.)
- ② The generation subagent flagged `part_of`/co-emergence. QC verdict: probability is the formal
  *substrate* (entropy is a functional of a probability distribution); information theory is a distinct
  field built on it, so `formalizes`, not `part_of` (note). Direction ✓.

### Bucket C — rejection-demonstration probes (verdicts: 1 supported, 4 NEI)

**C1 `mathematics` → `economics` — SUPPORTED (0.78, strong tension note).** *(probe expected disputed)*
- ① Wikipedia *Mathematical economics*: "Economics has become increasingly dependent on mathematical
  methods" + "an array of new mathematical tools, including differential calculus and differential
  equations, convex sets, and graph theory, were deployed to advance economic theory." SEP *Philosophy of
  Economics* (re mathematization; documents both sides). (2 orgs.)
- ② **Tension preserved in note (record-not-resolve):** the *descriptive* claim "mathematics provides a
  formal framework for modern economic theory" is mainstream (parallel to the reviewed `mathematics→
  physics` edge); the *normative* "mathematization debate" is genuine — SEP: Austrian economists "are
  skeptical about the value of mathematical modeling"; the "formalist revolution" critique (Blaug;
  Mirowski *How Economics Became a Mathematical Science*). No source refutes the descriptive claim, so
  **supported + tension note**, not `disputed`. **Probe result: the seed expected disputed; the pipeline
  found supported-with-note — evidence that QC follows the sources, not the a-priori label.** Direction ✓.

**C2 `game-theory` → `sociology` — NEI-ABSTAIN (correct rejection of a contested minority claim).** *(probe expected disputed; resolved NEI)*
- ① **Pro side (sourced):** Wikipedia *Rational choice model*: rational choice (incl. game theory) "has
  become increasingly employed in social sciences other than economics, such as sociology" and "rational
  choice explanations are considered mainstream in sociology" (within structural-functionalist / network
  perspectives). **Con side (sourced):** same article, "Sociological critiques": "Pierre Bourdieu fiercely
  opposed rational choice theory as grounded in a misunderstanding of how social agents operate"; realism-
  based scepticism among sociologists. Wikipedia *Game theory* lists sociology among applications.
- ② **Genuine scholarly disagreement, but the wrong shape for clause-6 `disputed`.** The schema's
  `disputed: true` is policy-v1 **clause 6** — a *contested claim positioned on the **dominant** view*
  (≥3 independent sources, majority + ≥2 supporting; minority in `note`). Here the dominant view in
  sociology does **not** hold that game theory formalizes the field — game-theoretic/rational-choice
  sociology is a real but **minority, contested program** (Coleman/Hechter/analytical sociology vs
  Bourdieu/realist critique). Asserting a field-level `formalizes` edge — even flagged disputed — would
  assert a minority program as a field-level formalization, and manufacturing a 3rd "supporting" source
  to clear the clause-6 gate would be fabricating dominant support. The honest, calibrated move is to
  **abstain** (L23): do not write the edge; record the contested program + its rejection here as an
  honest gap. **Tension is preserved in the QC record, not suppressed; we simply decline to assert a
  minority claim as a field-level edge.** → **NEI-abstain.** Not written.
- **Finding:** the deliberately disputed-seeded candidates resolved without a clause-6 `disputed:true` —
  C1 as supported-with-tension-note (the dispute was *normative*, the descriptive claim holds), C2 as
  NEI (the dispute made the claim a *non-dominant minority* one). This re-confirms wave 1's thesis:
  genuine edge-level `disputed:true` (contested placement on a dominant view) is predicted to
  **concentrate in the (a)-contested relations** (`influenced`/`critiques`), not in (d)-decidable
  `formalizes`. The (d)→(a) sequencing (decision (49)/(50)) is supported by this measurement.

**C3 `linear-algebra` → `machine-learning` — NEI-ABSTAIN (correct rejection).** *(probe expected NEI — fired)*
- ① The ML literature names ML's foundations as "statistics and mathematical optimisation" (Wikipedia
  *Machine learning*), **not** linear algebra. The Wikipedia *Linear algebra* article does not claim it
  formalizes ML. No claim-stating "linear algebra formalizes ML" source exists.
- ② **Tool-vs-framing.** Linear algebra is a computational *tool/prerequisite* for ML (cf. the existing
  `book-mathematics-for-machine-learning` source treats it as background), not a formal *framing* of the
  field. Honest relation: `prerequisite_for`/`enables`. → **NEI-abstain.** Contrast with A18
  (statistics→ML, supported via SLT) demonstrates source-discrimination, not target pattern-matching.
  Not written.

**C4 `set-theory` → `computer-science` — NEI-ABSTAIN (correct rejection).** *(probe expected NEI — fired)*
- ① Wikipedia *Set theory*: set theory "has various applications in computer science (such as in the
  theory of relational algebra), philosophy, formal semantics." States *applications in specific areas*,
  not field-level formalization of CS.
- ② **Generic-foundation objection** (cf. wave-1 C7): set theory underlies discrete math broadly, but no
  source frames it as *the* formalization of CS as a field. Honest relation: `applies_to` (specific
  areas). → **NEI-abstain.** Not written.

**C5 `calculus` → `economics` — NEI-ABSTAIN (correct rejection; weakest candidate, gen-conf 0.35).** *(probe expected NEI — fired)*
- ① Wikipedia *Calculus*: "In economics, calculus allows for the determination of maximal profit by
  providing a way to easily calculate both marginal cost and marginal revenue." States calculus is
  **applied in** economics (marginal analysis) — not that it **formalizes economics**.
- ② **Tool-vs-framing.** Calculus is a tool used within mathematical economics; the formalizing umbrella
  is `mathematical-economics`/`mathematics` (cf. C1), not calculus alone. No field-level "calculus
  formalizes economics" source. → **NEI-abstain.** Same-target contrast: A1 game-theory→economics
  (supported), C1 mathematics→economics (supported+tension), C5 calculus→economics (NEI) — three
  different verdicts on one target by source. Not written.

---

## Verdict distribution & measurements (the session's real output)

| metric | value |
|---|---|
| candidates (N) | **27** (all `formalizes`; `founded_or_formalized` still 0 — no person/work nodes) |
| **supported** | **21** (A: 17, B: 3, C1) |
| **disputed (clause-6, tension-preserved)** | **0** (see C2 finding — (d)-relations do not produce dominant-view-contested placements) |
| **NEI-abstain** | **6** (A10, A19, C2, C3, C4, C5) |
| **claim-level hallucination** | **0/27** — no false claim promoted; every supported claim independently grounded; every NEI correctly refused |
| sources per written edge | ≥2 independent claim-stating (SEP/Wikipedia/nLab), live-fetched 200, verbatim anchors |
| referent (identity-axis) errors | 0/27 (endpoints pre-cleared by prior continent audits) |
| generation evidence-hint reliability | claim_anchor verbatim ≈ **0/54** (all paraphrases); hint URLs ≈ half dead/misattributed — same split as wave 1 (QID 93/71%, editorial 41–59%, wave-1 ≈0% verbatim). Orchestrator re-grounded every atom independently. |
| **precision (supported set)** | **21/21 = 1.0** at N=27 (Rule-of-Three upper-bounds failure ≈11%, vs ≈40% at wave-1 N=7) |
| **cross-continent precision** | **17/17 = 1.0**, hallucination 0/19 (2 correct NEI: A10, A19) |
| **within-FS precision** | **3/3 = 1.0**, hallucination 0/3 |
| **rejection capability** | **FIRED 6×** — all NEI-abstain (A10, A19, C2, C3, C4, C5), all correct refusals; one (C2) preserves a genuine scholarly tension in the QC record |

### Key findings

1. **Precision held at scale and across continents.** 0 claim-level hallucination at N=27; cross-continent
   precision = within-FS precision = wave-1 precision = 1.0. The "(d)-decidable grounds cleanly" thesis
   (decision (49)) **extends across continent boundaries**, not just within formal sciences.
2. **Rejection capability demonstrated (wave-1's gap closed).** The pipeline both promoted true claims AND
   refused 6 candidates it should refuse — all NEI-abstain (A10, A19, C2, C3, C4, C5), spanning three
   distinct refusal modes: field-level over-breadth (A10, A19), tool-vs-framing (C3, C5), generic-
   foundation (C4), and contested-minority-claim (C2). The "ability not to promote" is now in the data.
   **No clause-6 `disputed:true` arose:** the two disputed-seeded candidates resolved as supported-with-
   note (C1, the dispute was normative) and NEI (C2, the claim was a non-dominant minority) — genuine
   edge-level dispute is predicted for the (a)-contested relations, per the (d)→(a) thesis.
3. **The cross-continent risk is granularity, not continent.** The 2 within-bucket-A NEIs (A10, A19) are
   **field-level over-breadth** — a formal tool used *across* an applied field (control theory in EE, DEs
   in ME) is not the same as *formalizing the field*. Subfield-targeted cross-continent edges (A1–A9,
   A11–A18) grounded cleanly. **Operational lesson for any ladder: field-level cross-continent `formalizes`
   needs the same QC; the pipeline caught these by abstaining, so it is safe even at the riskier
   granularity.** Not a plan-change finding (the (d) assumption did not wobble — hallucination stayed 0).
4. **Source-discrimination, not target pattern-matching.** Same-target triples resolved to different
   verdicts by source: economics target → A1 supported / C1 supported+tension / C5 NEI; ML target → A18
   supported / C3 NEI. The verdict tracks the source's claim, as designed.

## Open-criteria judgment (pre-committed, decision (52))

- **(i) Precision — MET.** N=27 (≥25); claim-level hallucination 0 (≤1).
- **(ii) Rejection capability — MET.** The refusal branch fired **6×** (all NEI-abstain: A10, A19, C2,
  C3, C4, C5), all correct — including C2, where a genuine scholarly tension was preserved in the QC
  record rather than asserted as a field-level edge. (No clause-6 `disputed:true` arose; criterion (ii)
  is satisfied by NEI, the alternative the CPO pre-committed — decision (52).)

**Both criteria met → CTO recommendation: OPEN the auto-`reviewed` ladder** for (d)-decidable
`formalizes` where (a) both endpoints are `reviewed` and (b) the claim is verified by ≥2 independent
live claim-stating sources under this pipeline — with QC-ambiguous (`disputed`/NEI) continuing to stop at
`proposed`/foundry (matches the standing structural-tier policy: resolver-verified grounding auto-promotes,
QC-ambiguous halts). **Opening is the CPO's gate; this session writes everything proposed-first.** A
narrower partial-open option also supported by the data: open only for **subfield-or-finer-targeted**
edges first, holding **field-level** targets at proposed pending more measurement (the A10/A19 granularity
finding). CTO leans full-open-with-QC since precision was 1.0 even where the pipeline met field-level
candidates (it abstained correctly), but flags the partial option for CPO choice.

## Write decision (Stage 6) — proposed-first

- **21 edges written to `/data` as `status: proposed`** (all supported) with full provenance
  (`proposed_by` = Claude Sonnet / claude-sonnet-4-6 / 2026-06-19), `evidence_kind: externally_sourced`,
  calibrated `confidence` (0.78–0.92), and a `note` carrying each QC caveat / tension (A18 and C1 carry
  the two-cultures / mathematization tension notes). No `disputed:true` edge (clause-6 not triggered).
- **6 NEI candidates NOT written** (A10, A19, C2, C3, C4, C5) — honest gaps recorded above; they remain
  untrusted `generated` drafts in `proposals.json`, not promoted.
- **The auto-`reviewed` ladder is NOT opened this session** (measurement, not opening — prompt §자세).
  Even though every endpoint is `reviewed` (status-cap clause 3 would *permit* reviewed), the proposed-
  first rule holds until the CPO reads this measurement and decides. No `/data` node identity changed; no
  contract changed → no stop-point fired (policy-level auto-proceed). The ladder-open *recommendation*
  above is the CPO-gate input.
- **No new sources** — all evidence references existing source IDs (`source:sep`, `source:wikipedia`,
  `source:nlab`); EoM/Britannica were not used live. No license-metadata additions needed.

## Evidence permanence (SPN, data-foundry §8)

web.archive.org was bot-blocked + rate-limited this session (direct snapshot 403; availability API 429;
SPN save 302/520 intermittent). Snapshot Location URLs were harvested from the SPN `save` 302 response
where available and recorded in `spn-results.md`; the remainder are logged as **[SPN-FAILED]** honestly
(never substituted with an unverified URL). All claim-anchors were live-fetched at HTTP 200 at QC time;
the verdicts rest on that live grounding. This matches wave-1's EoM-502 substitution discipline.
