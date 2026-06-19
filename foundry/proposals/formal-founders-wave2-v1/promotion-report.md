# formal-founders — promotion record (`founded_or_formalized` auto-`reviewed` ladder opened)

> **CPO gate, 2026-06-19, decision (60): ladder OPENED. Executed session #32, decision (61).**
> Following the wave-2 measurement (decision (59): genuine edge precision 12/12 = 1.0, claim-level
> hallucination 0/12, rejection capability fired 5× incl. four same-target genuine↔probe
> discriminations; cumulative founder-edge N = wave-1 8 + wave-2 12 = 20; all three pre-committed
> open criteria (i) hallucination ≤1 / (ii) plural-vs-misattribution discrimination / (iii)
> direction-and-referent now MET), the CPO opened the auto-`reviewed` ladder for `founded_or_formalized`
> as standing policy. This is the 1:1 mirror of decision (54) (the (d)-`formalizes` ladder open) and is
> recorded here for bulk re-auditability. This file records the physical promotion executed in session #32.

## Standing policy now in force (`founded_or_formalized`)

A `founded_or_formalized` edge **auto-promotes `proposed → reviewed`** when **all** hold:
1. **Both endpoints are `reviewed`** (the founder `person`/`work` node + the field/concept node) —
   status-cap clause 3, already enforced in `validate-data.ts`.
2. **Verdict = supported** under the Lane B pipeline: ≥2 **independent claim-stating** sources
   live-fetched and verbatim-checked, adversarial perspective-diverse QC passed, the person→field
   direction correct, and the identity referent verified (person QID + target node).
3. **Not QC-ambiguous:** `disputed`/NEI/reject verdicts do **not** auto-promote — they stop at
   `proposed` (or stay in foundry, unwritten). Mirrors the structural-tier standing policy
   (resolver-verified grounding auto-promotes; QC-ambiguous halts).
4. **★ Living-founder guard:** if the founder node is a living person (`is_living_person:true`), the
   edge does **not** auto-promote — it stays at the **CPO stop-point** (charter stricter-evidence rule).
   The ladder covers the *deceased-grounded* cases that wave-1 and wave-2 measured. Double-enforced: a
   living-person node is not auto-`reviewed` by node policy v1 in the first place (CPO review required),
   so its endpoint is not `reviewed` and clause ① already blocks the edge.

A recorded tension `note` on a *supported* edge (plural/layered founding, record-not-resolve — e.g.
Newton+Leibniz independent co-invention of calculus, Cantor+Dedekind, Boole∥Frege algebraic-vs-predicate
strands) does **not** make it ambiguous — it remains supported and promotable. Provenance
(`proposed_by`, `evidence`, `confidence`, `note`) is retained on every promoted edge, keeping the batch
bulk re-auditable and reversible.

The **(a)-relations (`influenced`/`critiques`) are NOT covered** by this decision (own gate, HOLD); the
(d)-`formalizes` ladder was opened separately by decision (54).

## Promoted this gate — 20 edges (`proposed → reviewed`)

**wave 1 (`formal-founders-v1`, decision (58)) — 8:** Cantor→set-theory, Kolmogorov→probability-theory,
Shannon→information-theory, Boole→mathematical-logic, Frege→mathematical-logic, Turing→computability-theory,
von Neumann→game-theory, Nash→game-theory.

**wave 2 (`formal-founders-wave2-v1`, decision (59)) — 12:** Morgenstern→game-theory, Dedekind→set-theory,
Church→computability-theory, Hilbert→proof-theory, Gauss→number-theory, Poincaré→algebraic-topology,
Noether→algebra, Wiener→cybernetics, Fisher→mathematical-statistics, Pearson→mathematical-statistics,
Newton→calculus, Leibniz→calculus.

**Result:** all 20 `founded_or_formalized` edges in `/data` are now `reviewed`. No node identity changed;
only the 20 `status` fields changed (proposed→reviewed), verified by diff (20 insertions / 20 deletions,
no reformat — founder-edge confidences are 0.85–0.98, none is `1.0`, but the reformat-avoidance rule is
identical to (54)). All 20 founder nodes confirmed `is_living_person:false` (living-founder guard not
triggered — none in scope). typecheck + validate:data green (447 nodes, 523 edges, 21 sources).

## NOT promoted (correctly held)

The wave-2 rejection probes (Euclid→set-theory anachronism, Shannon→game-theory field mis-attribution,
Gauss→probability-theory contribution≠founding, Aristotle→mathematical-logic over-broad/referent,
Pythagoras→number-theory legendary) were **never written to `/data`** — they were recorded as the
open-criterion (ii) measurement and remain untrusted in `proposals.json` (probe nodes too: an unwritten
edge would leave an orphan node, violating keep-criteria). The ladder does not reach them.

## Scope note

"Open" applied retroactively to wave 1's 8 edges (same relation, same criteria, measured earlier) —
leaving them at `proposed` would be incoherent with an opened ladder ((54) precedent). Future
(d)-`founded_or_formalized` batches (e.g. the deceased founders of a person wave 3) auto-promote
supported edges under this policy without a per-batch ladder gate; the CPO governs the policy and
dashboards, not per-edge sign-off (immutable contract 3). The next genuinely new tests are the
**person wave 3** (non-formal-science founders + the first *living-person* policy check — wave-1/2 and
this gate are all deceased-only) and the **(a)-contested relations** (`influenced`/`critiques`),
neither of which is opened by this decision.
