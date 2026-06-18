# formal-formalizes-v1 — batch report

**First-ever build of the Lane B propositional-edge pipeline** (round 4, session #27, 2026-06-19).
Scope = formal-sciences `formalizes` between existing reviewed nodes — the (d)-decidable relations
(decision (49) (B)-pilot, contract decision (50)). This is the tree→graph transition's first measured
run: typed propositional edges, proposed-first.

## What ran (6-stage pipeline)

- **Stage 0 — scoping (orchestrator).** 51 FS reviewed nodes inventoried; 7 decidable `formalizes`
  triples seeded (both endpoints existing). `founded_or_formalized` = **0 first-wave candidates** (no
  person/work nodes in FS) — honest gap, deferred to a 2nd wave behind a node gate. → `scoping.md`.
- **Stage 1 — generation (Sonnet subagent, separate context).** 7 reasoned-proposal envelopes
  (rationale + uncertainty + ambiguous + evidence hints). → `proposals.json`.
- **Stages 2–3 — atomize + grounding (orchestrator).** Each claim atomized and corroborated by ≥2
  independent **claim-stating** sources, live-fetched; EoM via Wayback (site 502); all live pages
  archived (SPN). → `qc-report.md`.
- **Stage 4 — adversarial perspective-diverse QC.** 3 reasoning paths (source→claim / counter-evidence
  / referent), refutation-framed, report-all.
- **Stage 5 — verdict.** supported / disputed / NEI.
- **Stage 6 — write.** proposed-first + provenance.

## Results

| | |
|---|---|
| edges written to `/data` | **7** (`formalizes`, all `status: proposed`) |
| verdicts | **7 supported / 0 disputed / 0 NEI** |
| claim-level hallucination | **0/7** |
| precision (N=7, (d)-decidable) | **1.0** (small-N, lower bound) |
| referent errors | 0/7 (endpoints pre-cleared by qid-adversarial-audit-fs-v1) |
| sources registered | 4 (`source:sep`, `source:encyclopedia-of-mathematics` CC BY-SA 3.0, `source:nlab`, `source:wikipedia` CC BY-SA 4.0) |
| `/data` delta | edges 469 → 476; sources 15 → 19; nodes unchanged (427) |

7 edges: set-theory→mathematics, category-theory→mathematics, mathematical-logic→mathematics,
probability-theory→statistics, probability-theory→random-variable,
probability-theory→probability-distribution, mathematical-logic→set-theory.

## Did the pipeline "earn its keep" on (d)-relations?

**Yes.** Claim hallucination 0, precision 1.0 (N=7). The generation layer produced 0 false claims but
unreliable evidence pointers (claim_anchors ≈0% verbatim; ~half the hint URLs dead/misattributed) —
the same fallible-pointer pattern measured for QIDs (93%/71%) and editorial URLs (41–59%). The Lane B
QC layer (independent live-grounding + adversarial refutation) absorbed it entirely. `disputed`/NEI
both 0 is the **expected** (d)-result (those concentrate in the (a)-contested relations, untouched
here); the foundations-plurality case (set theory ∥ category theory) resolved as co-existing support,
not dispute — record-not-resolve working without `disputed:true`.

## Recommendations to the CPO (close-report inputs)

1. **Open the auto-`reviewed` ladder for (d)-decidable `formalizes`?** This batch held proposed-first
   by contract; the measured precision (1.0, N=7, 0 hallucination) is the input. N is small — a
   recommendation, not a demand. Option: open the ladder for `formalizes` between reviewed endpoints
   on resolver/live-grounding pass, mirroring the structural-tier auto-promotion, OR run one more
   `formalizes` wave (cross-continent: math formalizes the empirical sciences) to grow N first.
2. **`founded_or_formalized` needs a node gate.** 0 first-wave candidates because FS has no person/work
   nodes. A 2nd wave requires creating founder-person / canonical-work nodes through the normal node
   gate first (the relation cannot mint non-existent endpoints).
3. **(a)-relation transition (`influenced`/`critiques`).** The NEI/disputed branches are unexercised
   here by design; the real test of tension-preservation + calibrated abstention is the (a)-relations.
   This pilot clears the (d)→(a) gate on the (d) side.

No stop-point fired (proposed-first, no reviewed-identity change, no contract change). typecheck ✓
validate:data ✓.
