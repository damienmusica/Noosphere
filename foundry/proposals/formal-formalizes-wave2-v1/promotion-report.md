# formal-formalizes — promotion record (auto-`reviewed` ladder opened)

> **CPO gate, 2026-06-19, decision (54): ladder OPENED — full.** Following the wave-2 measurement
> (decision (53): precision 21/21 = 1.0 at N=27, claim-level hallucination 0/27, rejection capability
> fired 6×; both pre-committed open criteria met), the CPO opened the auto-`reviewed` ladder **fully**
> for (d)-decidable `formalizes`. This file records the promotion for bulk re-auditability.

## Standing policy now in force (propositional `formalizes`, (d)-decidable)

A `formalizes` edge **auto-promotes `proposed → reviewed`** when **all** hold:
1. **Both endpoints are `reviewed`** (status-cap clause 3 — already enforced in `validate-data.ts`).
2. **Verdict = supported** under the Lane B pipeline: ≥2 **independent claim-stating** sources
   live-fetched and verbatim-checked, adversarial perspective-diverse QC passed, direction correct.
3. **Not QC-ambiguous:** `disputed`/NEI verdicts do **not** auto-promote — they stop at `proposed`
   (or stay in foundry, unwritten). This mirrors the structural-tier standing policy (resolver-verified
   grounding auto-promotes; QC-ambiguous halts).

A recorded tension `note` on a *supported* edge (record-not-resolve, e.g. A18 two-cultures, C1
mathematization) does **not** make it ambiguous — it remains supported and promotable. Provenance
(`proposed_by`, `evidence`, `confidence`, `note`) is retained on every promoted edge, keeping the batch
bulk re-auditable and reversible.

## Promoted this gate — 28 edges (`proposed → reviewed`)

**wave 1 (`formal-formalizes-v1`, decision (51)) — 7:** set-theory→mathematics, category-theory→
mathematics, mathematical-logic→mathematics, probability-theory→statistics, probability-theory→
random-variable, probability-theory→probability-distribution, mathematical-logic→set-theory.

**wave 2 (`formal-formalizes-wave2-v1`, decision (53)) — 21:** game-theory→{economics, political-science,
evolutionary-biology}, information-theory→{telecommunications-engineering, cryptography}, number-theory→
cryptography, probability-theory→{statistical-physics, financial-economics, bayesian-inference,
information-theory}, partial-differential-equations→fluid-dynamics, control-theory→robotics,
mathematical-logic→{theoretical-computer-science, programming-languages}, category-theory→programming-
languages, linear-algebra→quantum-information-science, statistics→{econometrics, machine-learning},
dynamical-systems→ecology, optimization→operations-research, mathematics→economics.

**Result:** all 29 `formalizes` edges in `/data` are now `reviewed` (28 promoted + the pre-existing
`mathematics→physics`). No node identity changed; only the 28 `status` fields changed (proposed→reviewed),
verified by diff (28 insertions / 28 deletions, no reformat). typecheck + validate:data green.

## NOT promoted (correctly held)

The 6 NEI-abstain candidates (A10 control→electrical-engineering, A19 differential-equations→mechanical-
engineering, C2 game-theory→sociology, C3 linear-algebra→machine-learning, C4 set-theory→computer-science,
C5 calculus→economics) were never written to `/data` — they remain untrusted `generated` drafts in
`proposals.json`. The ladder does not reach them; the honest gaps stand (`qc-report.md`).

## Scope note

"Full open" applied retroactively to wave 1's 7 edges (same relation, same criteria, measured earlier) —
leaving them at `proposed` would be incoherent with an opened ladder. Future (d)-`formalizes` batches
auto-promote supported edges under this policy without a per-batch ladder gate; the CPO governs the
policy and dashboards, not per-edge sign-off (immutable contract 3). The next genuinely new test is the
**(a)-contested relations** (`influenced`/`critiques`), where NEI/tension-preservation and clause-6
`disputed:true` are predicted to do the heavy lifting — that ladder is **not** opened by this decision.
