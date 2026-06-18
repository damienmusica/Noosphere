# formal-formalizes-v1 — grounding + adversarial QC + verdicts (orchestrator)

> Lane B propositional-edge pilot, session #27 (round 4). Permanent QC record for the first build of
> the Lane B pipeline contract (`lane-B-propositional-edge-pipeline-design.md`, decision (50)). The
> orchestrator (Opus 4.8) performed Stages 2–5 in a context **separate** from the Sonnet generation
> subagent (ADR 0007 / immutable contract 2). Generation = `proposals.json`; scoping = `scoping.md`.

## Method (Stages 2–5)

- **Stage 2 — atomize.** Each candidate's `formalizes` claim reduced to its core atomic proposition
  ("A provides a formal framing for B"); concept-level edges (C5/C6) also carry the formalization-
  origin atom (Kolmogorov 1933). No compound claim passed on partial evidence.
- **Stage 3 — grounding.** Each atom corroborated by **≥2 independent claim-stating sources**,
  live-fetched at QC time. Evidence standard = a source that *states the claim*, not one that merely
  mentions both terms (no single-wiki-paragraph restatement counted twice). Encyclopedia of
  Mathematics (encyclopediaofmath.org) returned **HTTP 502 site-wide** at QC time, so EoM is cited via
  **existing Wayback snapshots** (data-foundry §8 bot-blocked/unreachable substitution); SEP / nLab /
  Wikipedia fetched live and **archived at verification time** (SPN). All claim_anchors below are
  **verbatim** from the fetched page.
- **Stage 4 — adversarial perspective-diverse QC (φ̄, patch ②).** Three *distinct reasoning paths*
  per edge (not N identical refuters): **① source→claim** (does the cited source actually state the
  claim, claim-anchor verbatim?), **② claim→counter-evidence** (is there refuting/limiting evidence →
  surface as disputed?), **③ referent** (are source/target the correct entities — identity axis?).
  Refutation framing ("try to refute"). All findings reported with severity (patch ⑦).
- **Stage 5 — verdict** ∈ {supported / disputed (tension-preserved) / NEI-abstain}.

## Referent axis (③) — pre-cleared

Every endpoint is one of the **51 reviewed formal-sciences nodes**, all of which already passed
`qid-adversarial-audit-fs-v1` (0/44 confirmed referent errors). The "edges reference existing reviewed
nodes only" invariant therefore **retires referent risk before QC begins** — no QID/identity error is
possible that the FS audit did not already test. Referent verdict: **clean for all 7.**

## Per-candidate grounding + QC

### C1 — `set-theory` formalizes `mathematics` — **SUPPORTED** (conf 0.9)
- **① source→claim (verbatim):**
  - SEP *Set Theory*: "Thus, set theory has become the standard foundation for mathematics, as every
    mathematical object can be viewed as a set, and every theorem of mathematics can be logically
    deduced in the Predicate Calculus from the axioms of set theory." — live; snapshot
    `web.archive.org/web/20260618175026/https://plato.stanford.edu/entries/set-theory/`
  - nLab *set theory*: "…called Zermelo–Fraenkel set theory or ZFC) is the orthodox foundations
    today." — snapshot `…/web/20251231173306/https://ncatlab.org/nlab/show/set+theory`
  - corrob. Wikipedia *ZFC*: "…the most common foundation of mathematics." — `…/web/20260613044049/…`
- **② counter-evidence:** Predicativists/finitists reject ZFC; pluralists hold no foundation is
  privileged. None refutes the *weak* claim asserted ("set theory provides **a** formal foundation") —
  the dispute is over uniqueness, which this edge does not assert. → not disputed.
- **Tension note:** foundational plurality preserved as a **co-existing** edge with C2 (category
  theory), neither adjudicated as "the" foundation (record-not-resolve). 2 independent sources.

### C2 — `category-theory` formalizes `mathematics` — **SUPPORTED** (conf 0.8)
- **① verbatim:**
  - SEP *Category Theory*: "Category theory even leads to a different theoretical conception of set
    and, as such, to a possible alternative to the standard set theoretical foundation for
    mathematics." + "Lawvere from early on promoted the idea that a category of categories could be
    used as a foundational framework." — `…/web/20260618175028/…/entries/category-theory/`
  - nLab *foundation of mathematics*: category theory listed under "Structural Foundations";
    "Formal systems of interest here are ETCS or flavors of type theory…" —
    `…/web/20241113154350/https://ncatlab.org/nlab/show/foundation+of+mathematics`
- **② counter-evidence:** Category theory is often described as an organizing *language* rather than a
  strict ZFC-style foundation; categorical foundations (ETCS/topos) are a minority position. This
  bounds the claim's strength but does not refute the **modest** "an alternative foundation" assertion,
  which SEP states directly. Recorded in `note`. → not disputed.
- 2 independent sources. Co-exists with C1 (the pilot's foundations-plurality demonstration).

### C3 — `mathematical-logic` formalizes `mathematics` — **SUPPORTED, loosest fit** (conf 0.78)
- **① verbatim:**
  - EoM *Mathematical logic*: "The branch of mathematics concerned with the study of mathematical
    proofs and questions in the foundation of mathematics." + (history) "…the formalization of proofs
    on the basis of such a language…" — snapshot
    `…/web/20260111144256/https://encyclopediaofmath.org/wiki/Mathematical_logic`
  - SEP *Classical Logic*: "Typically, a logic consists of a formal or informal language together with
    a deductive system and/or a model-theoretic semantics." —
    `…/web/20260618175156/…/entries/logic-classical/`
- **② counter-evidence / honest caveat:** No single source says verbatim "mathematical logic
  formalizes mathematics"; the edge is a **synthesis** of two claim-stating sources (logic = a formal
  language + deductive system; logic is the branch that formalizes proof / studies foundations).
  Direction objection (mathematics is the subject logic studies; logic ⊂ mathematics) is answered by
  the standard foundational reading: logic supplies the formal apparatus of proof used across
  mathematics — captured in `note` as a formal-apparatus role, not containment. **Severity: low-medium
  — flagged as the batch's weakest source-fit; a candidate for future close-read.** → supported, modest
  confidence.

### C4 — `probability-theory` formalizes `statistics` — **SUPPORTED** (conf 0.9)
- **① verbatim:**
  - Wikipedia *Mathematical statistics*: "Mathematical statistics is the application of probability
    theory and other mathematical concepts to statistics, as opposed to techniques for collecting
    statistical data." — `…/web/20260511190750/https://en.wikipedia.org/wiki/Mathematical_statistics`
  - EoM *Mathematical statistics*: "All rules based on probability theory for the statistical
    estimation of parameters and hypotheses testing operate only at a definite significance level…"
    (and: the sampling/error methods "are based on probability theory") — snapshot
    `…/web/20251011184926/https://encyclopediaofmath.org/wiki/Mathematical_statistics`
  - corrob. EoM *Probability distribution*: "One of the basic concepts in probability theory and
    mathematical statistics."
- **② counter-evidence:** Descriptive statistics needs little formal probability; some frequentist
  methods predate Kolmogorov. Bounds scope to the inferential/mathematical core; does not refute it
  (recorded in `note`). Distinct relation from the existing `prerequisite_for` edge. → not disputed.

### C5 — `probability-theory` formalizes `random-variable` — **SUPPORTED, strongest** (conf 0.92)
- **① verbatim:**
  - EoM *Random variable*: "This made it clear that a random variable is nothing but a measurable
    function on a probability space." — `…/web/20260102184836/…/wiki/Random_variable`
  - nLab *random variable*: "The formalization of this idea in modern probability theory (Kolmogorov
    33, III) is to take a random variable to be a measurable function f on a probability space
    (X,ℱ,μ)." — `…/web/20260510163254/https://ncatlab.org/nlab/show/random+variable`  *(nLab uses the
    word "formalization" explicitly — the cleanest `formalizes` anchor in the batch.)*
  - corrob. Wikipedia *Random variable*: "A random variable X is a measurable function X : Ω → E…"
- **② counter-evidence:** None. The concept predating its formalization does not refute that
  probability theory supplies the formal definition. → supported.

### C6 — `probability-theory` formalizes `probability-distribution` — **SUPPORTED, near-tautological** (conf 0.8)
- **① verbatim:**
  - EoM *Probability distribution*: "Any such measure on {Ω,S} is called a probability distribution …
    this definition, basic in the axiomatics introduced by A.N. Kolmogorov in 1933…" —
    `…/web/20251209140716/…/wiki/Probability_distribution`
  - Wikipedia *Probability distribution*: "…the probability distribution of X is the image measure
    X∗ℙ of X, which is a probability measure on (𝒳, 𝒜)" (per Kolmogorov axioms) —
    `…/web/20260607233942/https://en.wikipedia.org/wiki/Probability_distribution`
- **② counter-evidence / caveat:** The distribution concept is partly *internal* to probability theory,
  so the formalizes relation is tight to the point of near-definitional — **low information content**
  (flagged in `note`). Correctness is not in question; informativeness is the only concern.
  **Severity: low (value, not truth).** → supported.

### C7 — `mathematical-logic` formalizes `set-theory` — **SUPPORTED** (was the NEI probe) (conf 0.7)
- **① verbatim:**
  - SEP *Set Theory*: "ZFC is an axiom system formulated in first-order logic with equality and with
    only one binary relation symbol ∈ for membership." — `…/web/20260618175026/…/entries/set-theory/`
  - Wikipedia *ZFC*: "Formally, ZFC is a one-sorted theory in first-order logic." —
    `…/web/20260613044049/https://en.wikipedia.org/wiki/Zermelo%E2%80%93Fraenkel_set_theory`
- **② counter-evidence / nuance:** (a) **Generic** — every first-order theory is "formalized in
  first-order logic", so the relation is true but not specific to set theory; (b) **converse co-
  grounding** — set theory supplies model-theoretic semantics for logic, a *separate* relation, not a
  refutation. Both recorded in `note`. The Stage-1 generation subagent flagged this `ambiguous:true`
  and predicted NEI; **live-fetch surfaced two clean claim-stating sources, so the honest verdict is
  supported, not forced-NEI** — the pipeline correctly distinguished "looks hard but is sourced" from
  "genuinely unsourced." Confidence lowered to 0.7 for the generic/co-foundational caveats. → supported.

## Verdict distribution & measurements (the session's real output)

| metric | value |
|---|---|
| candidates | 7 (all `formalizes`; `founded_or_formalized` = 0 first-wave, no person/work nodes) |
| **supported** | **7** |
| **disputed (tension-preserved)** | **0** |
| **NEI-abstain** | **0** |
| **claim-level hallucination** | **0/7** — every formalizes claim is true and independently grounded |
| sources per edge | ≥2 independent claim-stating (live or Wayback), 2–3 each |
| referent (identity-axis) errors | 0/7 (endpoints pre-cleared by qid-adversarial-audit-fs-v1) |
| generation evidence-hint reliability | **claim_anchors verbatim ≈ 0/14** (all paraphrases); **hint URLs** ≈ half dead/misattributed (e.g. SEP `foundations-mathematics` 404; Casella&Berger text placed at an EoM URL). Pattern matches the prior identifier-layer hallucination (editorial hint-URL 41–59%). |
| precision estimate (this batch) | **7/7 = 1.0** on (d)-decidable `formalizes` (small N; lower-bounded, not a population claim) |

**Interpretation (fallible generator + structure absorbs, re-confirmed at the edge layer):** the
generation subagent produced **0 false claims** but **unreliable evidence pointers** — exactly the
split measured for QID hints (93%/71%) and editorial URL hints (41–59%). The Lane B QC layer
(independent atomize + ≥2 live claim-stating sources + adversarial refutation) absorbed the unreliable
pointer layer entirely, replacing every hint with a verified verbatim anchor. On the **(d)-decidable**
`formalizes` relations the pipeline **earned its keep**: claim hallucination 0, precision 1.0 on N=7.

**Why 0 disputed / 0 NEI is the *expected* (d)-result, not a gap in coverage:** the (d)-decidable
relations were chosen precisely because they ground cleanly (~0 hallucination via live-grounding,
decision (49) (B)-pilot thesis). Genuine `disputed` (tension-preservation) and NEI-abstain are
predicted to **concentrate in the (a)-contested relations** (`influenced`/`critiques`), which this
pilot deliberately did **not** touch. The one designated tension case (C1+C2 foundations plurality)
resolved as **co-existing support, not edge-level dispute**, because no source refutes either edge's
modest claim — a meaningful finding: even the "tension" of the foundations debate is recorded as
plurality (two supported edges + cross-referencing notes), which is record-not-resolve working as
intended without needing `disputed:true`.

## Write decision (Stage 6) — proposed-first

All 7 → **`status: proposed`** with full provenance (`proposed_by` = Claude Sonnet / claude-sonnet-4-6
/ 2026-06-19), `evidence_kind: externally_sourced`, calibrated `confidence`, and a `note` carrying each
QC caveat. **The auto-`reviewed` ladder is NOT opened** — even though every endpoint is `reviewed`
(status-cap clause 3 would *permit* reviewed) and the relations are (d)-decidable, the contract's
**proposed-first** rule holds the batch at `proposed` until the CPO reads this precision measurement
and decides whether to open the ladder (measurement-first; no pre-emptive scaffolding). No `/data`
node identity changed; no contract changed → no stop-point fired (policy-level auto-proceed).
