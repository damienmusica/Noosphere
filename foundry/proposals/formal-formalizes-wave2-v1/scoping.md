# formal-formalizes-wave2-v1 — Stage 0 candidate scoping (orchestrator)

> Lane B propositional-edge **wave 2**, session #28 (round 4, 2-lane stagger — Lane B lane). Second
> build of the Lane B pipeline contract (`lane-B-propositional-edge-pipeline-design.md`, decision (50)).
> Wave 1 (session #27, batch `formal-formalizes-v1`, decision (51)) scored 7/7 supported · 0 hallucination
> · precision 1.0, but **N=7 was too small** (Rule-of-Three: 0/7 only bounds failure at ~40%) and
> **rejection capability was never exercised** (0 disputed / 0 NEI). CPO decision (52): keep the
> auto-`reviewed` ladder **locked** (proposed-first) and run **one larger wave with the parameter
> raised, including cross-continent `formalizes`**. This file is the Stage 0 output — the seed
> candidate triples that drive the Stage 1 generation order. Untrusted scoping material; `/data` is the
> only ground truth.

## Open criteria this wave must measure (pre-committed, decision (52))

- **(i) Precision:** at N≥25, claim-level hallucination **≤1** (after live grounding + adversarial QC).
- **(ii) Rejection capability:** the disputed or NEI branch fires **≥1 time correctly** (something that
  *ought* to be refused / tension-preserved is actually handled that way — the "ability not to
  promote", measured, not just the ability to promote).

Both met → CTO recommends opening the ladder (CPO gate). Either short → ladder stays locked + reason
recorded. This wave is **measurement, not opening**.

## Hard invariants applied at scoping

- **Edges reference existing reviewed node IDs only** (CLAUDE.md data invariant). All 27 endpoints below
  were machine-verified against `/data/nodes.json`: every endpoint exists, is `reviewed`, no candidate
  duplicates an existing edge, no self-edge. **Every `source` is a `formal_sciences` node**; for the
  cross-continent set every `target` is an empirical/applied-continent node.
- **`founded_or_formalized` still excluded (honest gap, inherited from wave 1).** Formal-sciences has no
  person/`canonical_work` nodes; founder edges wait for a node gate, then a separate wave. First-wave
  finding re-confirmed — wave 2 is **`formalizes`-only**.
- **12-type taxonomy unchanged.** No new relation, no new field, no auto-ladder. Measurement-first.

## Difference from wave 1 (the three deliberate changes, prompt §"이번 웨이브의 차이점")

1. **Parameter raised — 27 candidates** (wave 1 = 7). At N≥25, a 0-hallucination result bounds the
   failure rate at ~10% (Rule-of-Three), a statistically meaningful precision floor.
2. **Cross-continent `formalizes` included (CPO decision (52)).** A large parameter is not honest from
   within formal-sciences alone; genuine `formalizes` is rich at continent boundaries. `source` = a
   formal-science node (math / statistics / logic / systems), `target` = an empirical/applied-continent
   node, both already `reviewed`. Precedent = `edge:mathematics-formalizes-physics` (reviewed).
   **Direction is QC'd strictly:** source = the formalizing apparatus, target = what gets formalized
   (guards against reverse / tautology / over-generalization).
3. **Rejection-demonstration seeds (~5).** Wave 1 had 0 disputed / 0 NEI, so the *stopping* behaviour
   of the pipeline was never observed. This wave deliberately includes candidates where interpretation
   genuinely splits (→ disputed) or a claim-stating source is plausibly absent (→ NEI). **No fabricated
   controversy:** even disputed verdicts require a source floor on both sides; the honest verdict —
   including refusal — is the first-class output, not a forced `supported`.

## Bucket A — cross-continent `formalizes` (19, the workhorse)

`source` = formal-science node, `target` = empirical/applied continent node. Both reviewed. A priori
expectations are scoping hypotheses only — the verdict is whatever Stages 2–5 independently find.

| # | source (formal_sciences) | target (continent) | claim (A provides a formal framing for B) | a priori |
|---|---|---|---|---|
| A1 | `subfield:game-theory` | `field:economics` (SS) | Game theory provides the formal framework for strategic economic interaction. | supported (strong) |
| A2 | `subfield:game-theory` | `field:political-science` (SS) | Game theory provides a formal framework for strategic political interaction (formal political theory). | supported |
| A3 | `subfield:game-theory` | `subfield:evolutionary-biology` (LS) | Evolutionary game theory formalizes frequency-dependent selection / evolutionary stability. | supported (Maynard Smith) |
| A4 | `subfield:information-theory` | `subfield:telecommunications-engineering` (ENG) | Information theory provides the formal (Shannon) framework for communication/coding. | supported (strong) |
| A5 | `subfield:information-theory` | `subfield:cryptography` (CS) | Information theory formalizes secrecy (Shannon perfect secrecy / entropy of keys). | supported |
| A6 | `subfield:number-theory` | `subfield:cryptography` (CS) | Number theory provides the formal basis of public-key cryptography. | supported (strong) |
| A7 | `subfield:probability-theory` | `subfield:statistical-physics` (NS) | Probability theory provides the formal foundation of statistical mechanics. | supported |
| A8 | `subfield:partial-differential-equations` | `subfield:fluid-dynamics` (NS) | PDEs (Euler / Navier–Stokes) formalize fluid dynamics. | supported (strong) |
| A9 | `subfield:control-theory` | `subfield:robotics` (ENG) | Control theory provides the formal framework for robot motion/feedback control. | supported |
| A10 | `subfield:control-theory` | `field:electrical-engineering` (ENG) | Control theory formalizes feedback/control-systems engineering. | supported |
| A11 | `subfield:mathematical-logic` | `subfield:theoretical-computer-science` (CS) | Mathematical logic formalizes computation / theoretical CS. | supported |
| A12 | `subfield:mathematical-logic` | `subfield:programming-languages` (CS) | Logic (type theory, Curry–Howard) formalizes programming-language semantics. | supported (medium) |
| A13 | `subfield:category-theory` | `subfield:programming-languages` (CS) | Category theory formalizes (functional) programming-language semantics. | supported (medium, edge-of-envelope) |
| A14 | `subfield:linear-algebra` | `subfield:quantum-information-science` (NS) | Linear algebra (Hilbert-space formalism) formalizes quantum information. | supported (medium) |
| A15 | `field:statistics` | `subfield:econometrics` (SS) | Statistics provides the formal/inferential methods of econometrics. | supported (possibly near-tautological — measure info content) |
| A16 | `subfield:dynamical-systems` | `subfield:ecology` (LS) | Dynamical systems formalize population dynamics in ecology (Lotka–Volterra). | supported (medium) |
| A17 | `subfield:probability-theory` | `subfield:financial-economics` (SS) | Probability theory (stochastic processes) formalizes asset pricing in financial economics. | supported (medium) |
| A18 | `field:statistics` | `subfield:machine-learning` (CS) | Statistics / statistical learning theory provides a formal framework for ML. | supported — **may surface disputed** (Breiman "two cultures") |
| A19 | `subfield:differential-equations` | `field:mechanical-engineering` (ENG) | Differential equations formalize the dynamics analysed in mechanical engineering. | supported (medium — may be broad → NEI risk) |

## Bucket B — residual within-formal-sciences `formalizes` (3, not used by wave 1)

| # | source | target | claim | a priori |
|---|---|---|---|---|
| B1 | `subfield:optimization` | `subfield:operations-research` | Optimization provides the formal/mathematical core of operations research. | supported |
| B2 | `subfield:probability-theory` | `method:bayesian-inference` | Probability theory (Bayes' theorem, Kolmogorov) formalizes Bayesian inference. | supported |
| B3 | `subfield:probability-theory` | `subfield:information-theory` | Probability theory formalizes information theory (entropy as a probabilistic functional). | supported |

## Bucket C — rejection-demonstration seeds (5, deliberately disputed/NEI)

Chosen to exercise the **stopping** behaviour. The expectation column is the *probe target*, not a
verdict; an honest `supported` is also a valid outcome (it would mean the probe was wrong, which is
itself information). No manufactured controversy — disputed requires both sides sourced.

| # | source | target | claim under test | probe target | why genuinely contestable / unsourceable |
|---|---|---|---|---|---|
| C1 | `field:mathematics` | `field:economics` (SS) | Mathematics formalizes economics (parallel to math→physics). | **disputed** | Real, well-documented "mathematization of economics" critique (Blaug's "formalist revolution", T. Lawson, heterodox economics) vs mainstream view that math *is* the language of modern economic theory. Both sides sourced → tension-preserved. |
| C2 | `subfield:game-theory` | `field:sociology` (SS) | Game theory formalizes (rational-choice) sociology. | **disputed** | Rational-choice / game-theoretic sociology is a real but contested program (embeddedness critique, Granovetter; structural critiques). |
| C3 | `subfield:linear-algebra` | `subfield:machine-learning` (CS) | Linear algebra formalizes machine learning. | **NEI** | Linear algebra is a *computational tool* used in ML, not a formal *framing* of the field; no claim-stating source says it "formalizes" ML. Contrast with A18 (statistics→ML), where a claim-stating source plausibly exists. |
| C4 | `subfield:set-theory` | `field:computer-science` (CS) | Set theory formalizes computer science. | **NEI / generic** | Set theory underlies CS broadly but no source frames it as *the* formalization of CS at field level; generic-foundation objection (cf. wave-1 C7 "every first-order theory is in first-order logic"). |
| C5 | `subfield:calculus` | `field:economics` (SS) | Calculus formalizes economics. | **NEI** | Calculus is a tool used in economics (marginal analysis) but "calculus formalizes economics" lacks a claim-stating source; the field-level framing claim is weaker than C1's. |

**Same-target contrast (designed in):** three economics-target edges with different sources and
expected verdicts — A1 `game-theory→economics` (supported), C1 `mathematics→economics` (disputed),
C5 `calculus→economics` (NEI) — and two ML-target edges — A18 `statistics→ML` (supported) vs C3
`linear-algebra→ML` (NEI). If the pipeline assigns different verdicts to these by source, it is
discriminating signal, not pattern-matching the target.

## Stage 1 order (generation subagent)

Hand these 27 triples to a **separate-context Sonnet generation subagent** (`proposal-generator` agent
type — ADR 0007 / immutable contract 2). It produces the full reasoned-proposal envelope per candidate
(`source`, `target`, `relation: formalizes`, `confidence`, `evidence:[{citation, claim_anchor, url}]`,
`disputed?`, `note?`, `rationale`, `uncertainty`, `ambiguous?`) into
`foundry/proposals/formal-formalizes-wave2-v1/proposals.json` — **never `/data`**. It must not invent
node IDs outside the 27 verified endpoints, must self-flag ambiguous/contestable candidates honestly,
and is told its **evidence hints are untrusted** (wave-1 measured: claim_anchor verbatim ≈ 0%, hint
URLs ≈ half dead) — the orchestrator re-grounds every atom independently (Stages 2–3) and adversarially
QCs (Stage 4) in its own context. That independence is where error-decorrelation lives, not in the seed
list.
