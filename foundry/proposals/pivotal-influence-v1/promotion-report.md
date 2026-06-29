# (a)-relations — promotion record (`influenced`/`critiques` auto-`reviewed` ladder opened)

> **CPO gate, 2026-06-29, decision (68): (a)-ladder OPENED and executed in session #37.**
> This is the 1:1 mirror of decision (54) (the (d)-`formalizes` ladder) and decisions (60)/(61) (the
> `founded_or_formalized` ladder). It records the physical promotion of the standing (a)-edge backlog —
> 20 supported `influenced`/`critiques` edges across three (a)-waves — plus the codification of the
> standing policy. Filed here because session #36 (this batch) earned the open: clause-6 v2's **first
> correct disputed fire** (decision (67)) validated the safety net that makes auto-promoting `supported`
> edges safe. Kept for bulk re-auditability and reversibility.

## Why now — the coupling that gated this open

Opening an auto-`reviewed` ladder for `supported` propositional edges is safe **only if** contested
claims are reliably diverted away from `supported`. clause-6 v2 is that safety net: a genuinely contested
existence/direction claim routes to `disputed`/NEI/reject, never to `supported`. The net was the open
gate — and it fired correctly for the first time at `nietzsche → freud` (decision (67), balanced split,
held at `proposed`) while the over-fire guard held (`schopenhauer → freud`, `saussure → levi-strauss`
routed to supported+note). With the net validated, the principled sequence (validate the disputed
machinery → then open the (a)-ladder on the (d)-standard, design §4) is complete.

## Standing policy now in force (`influenced` / `critiques`)

An (a)-edge **auto-promotes `proposed → reviewed`** when **all** hold:

1. **Both endpoints are `reviewed`** — status-cap clause 3, already enforced in `validate-data.ts`.
2. **Verdict = supported** under the Lane B pipeline: ≥2 **independent claim-stating** sources
   live-fetched and verbatim-checked, adversarial perspective-diverse QC passed, the direction correct,
   and the identity referent verified (endpoint node IDs).
3. **Not `disputed` / NEI / reject:** these do **not** auto-promote — `disputed: true` stops at `proposed`
   (human-visible by design, clause-6 v2), NEI/reject are never written to `/data`.
4. **★ Living-person guard:** if either endpoint is a living person (`is_living_person: true`), the edge
   does **not** auto-promote — it stays at the **CPO stop-point** (charter stricter-evidence rule).
   Double-enforced: a living-person node is not auto-`reviewed` by node policy v1, so its endpoint is not
   `reviewed` and clause ① already blocks the edge. None of the 20 promoted edges touches a living person
   (Seligman was deliberately excluded from wave 2 for exactly this reason — decision (63)).

A recorded record-not-resolve **tension / scope `note`** on a *supported* edge does **not** make it
disqualified — only `disputed: true` (or a node-level `ambiguous`) stops the ladder. This is the same rule
the founder ladder settled (note-bearing edges like Newton∥Leibniz, Boole∥Frege were promoted). All 20
promoted edges carry such notes; the CPO chose **full open** (decision (68)) over the narrow alternative,
which — since every eligible edge carries a note — would have promoted nothing. Provenance
(`proposed_by`, `evidence`, `confidence`, `note`) is retained on every promoted edge.

The (d)-`formalizes` ladder (decision (54)) and `founded_or_formalized` ladder (decisions (60)/(61)) were
opened earlier; this is their mirror.

## Promoted this gate — 20 edges (`proposed → reviewed`)

**wave 1 (`a-relations-philosophy-v1`, decision (56)) — 6** (within-philosophy, school/subfield level):
phenomenology→existentialism, ancient-philosophy→medieval-philosophy,
pragmatism→philosophy-of-education (`influenced`); analytic-philosophy→continental-philosophy,
experimental-philosophy→analytic-philosophy, feminist-philosophy→epistemology (`critiques`).

**wave 2 (`a-relations-wave2-v1`, decision (63)) — 8** (person-mediated + cross-domain):
Comte→Durkheim, Cantor→Hilbert, Darwin→evolutionary-psychology, evolutionary-biology→psychology,
information-theory→cognitive-psychology, genetics→evolutionary-biology (`influenced`);
Fisher→Pearson, Poincaré→set-theory (`critiques`).

**wave 3 (`pivotal-influence-v1`, decision (67)) — 6** (pivotal-influence persons):
Nietzsche→existentialism, Nietzsche→continental-philosophy, Schopenhauer→Nietzsche,
Schopenhauer→aesthetics, Saussure→Lévi-Strauss, Schopenhauer→Freud (`influenced`).

**Result:** 20 of the 21 `influenced`/`critiques` edges in `/data` are now `reviewed`. Only the **status**
field changed (proposed→reviewed), verified by diff (**20 insertions / 20 deletions, no reformat**). No
node identity changed; confidences untouched. typecheck + validate:data green (464 nodes, 552 edges,
21 sources).

## NOT promoted (correctly held)

- **`edge:friedrich-nietzsche-influenced-sigmund-freud` (`disputed: true`)** — the corpus's first
  propositional-layer balanced split (clause-6 v2, decision (67)). Stays `proposed` / human-visible by
  design — `disputed` edges never auto-promote (clause-6 v2 + clause 3 of this policy). This is the
  record-not-resolve invariant made literal: the edge records that *scholars actively contest whether
  Nietzsche influenced Freud*, not that the influence is established.
- All NEI/reject verdicts from the three waves (e.g. Dedekind↔Cantor NEI, Newton→Leibniz reject,
  Darwin→Mendel NEI) were **never written to `/data`** — they remain untrusted measurements in each
  batch's `proposals.json`/`qc-report.md`.
