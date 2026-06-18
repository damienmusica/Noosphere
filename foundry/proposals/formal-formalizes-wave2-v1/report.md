# formal-formalizes-wave2-v1 — batch report

**Lane B propositional-edge wave 2 · round 4 (2-lane stagger, Lane B) · session #28 · 2026-06-19**
Decisions (52) (CPO order + pre-committed open criteria) / (53) (this session). Precedent: wave 1
`formal-formalizes-v1` (decision (51)).

## What this wave was for

Wave 1 scored 7/7 supported · 0 hallucination · precision 1.0, but **N=7** (Rule-of-Three bounds
failure ≈40%) and **0 disputed / 0 NEI** (rejection capability never exercised). CPO decision (52):
keep the auto-`reviewed` ladder **locked** (proposed-first) and run one larger wave with the parameter
raised, **including cross-continent `formalizes`**, with two **pre-committed open criteria**:
**(i)** N≥25 with claim-level hallucination ≤1; **(ii)** disputed/NEI fires ≥1 correctly.

## Method (6-stage contract, wave-1 mirror)

Stage 0 orchestrator scoping (27 triples, all endpoints machine-verified existing `reviewed`, 3
buckets) → Stage 1 Sonnet generation subagent (separate context, ADR 0007) → Stages 2–5 orchestrator,
independent: atomize + ≥2 independent claim-stating live sources (SEP/Wikipedia/nLab, HTTP 200) +
adversarial perspective-diverse QC (source→claim / claim→counter-evidence / referent+direction) →
verdict → Stage 6 proposed-first write + provenance. Session effort High (reflexive xhigh avoided).

## Results

| | count |
|---|---|
| candidates (N) | 27 |
| supported (written proposed) | 21 |
| disputed (clause-6) | 0 |
| NEI-abstain (not written) | 6 |
| claim-level hallucination | **0/27** |
| precision (supported) | **21/21 = 1.0** (N≥25) |
| cross-continent precision | 17/17 = 1.0 (hallucination 0/19) |
| within-FS precision | 3/3 = 1.0 |
| rejection capability | **fired 6×** (all NEI, all correct) |
| referent errors | 0/27 (endpoints pre-cleared) |
| new sources | 0 (existing SEP/Wikipedia/nLab) |
| edges added to /data | 21 proposed |

- **Supported (21):** A1–A9, A11–A18 (17 cross-continent) + B1–B3 (3 within-FS) + C1 (mathematics→
  economics, supported with mathematization-tension note).
- **NEI-abstain (6, not written):** A10 (control→electrical-engineering) and A19 (differential-
  equations→mechanical-engineering) — field-level over-breadth (a formal tool used *across* a field ≠
  formalizing the field); C3 (linear-algebra→ML) and C5 (calculus→economics) — tool-vs-framing;
  C4 (set-theory→CS) — generic-foundation; C2 (game-theory→sociology) — contested-minority claim, no
  dominant-view support (tension preserved in QC record, not asserted as a field-level edge).

## Open-criteria judgment (decision (52))

- **(i) Precision — MET** (N=27 ≥25; hallucination 0 ≤1).
- **(ii) Rejection capability — MET** (NEI fired 6× correctly).
- → **CTO recommends OPENING the auto-`reviewed` ladder** for (d)-decidable `formalizes` with both
  endpoints reviewed + ≥2 independent live claim-stating sources, QC-ambiguous (disputed/NEI)
  continuing to stop at proposed/foundry. Opening is the **CPO gate** (this session writes everything
  proposed-first). Partial-open option (subfield-or-finer targets first, hold field-level) also
  supported by the A10/A19 granularity finding.

## Key findings

1. **The (d)-decidable thesis extends across continents** — cross-continent precision = within-FS =
   wave-1 = 1.0, hallucination 0.
2. **Rejection capability demonstrated** (wave-1's gap closed) — 6 correct refusals across 4 modes.
3. **Cross-continent risk is granularity, not continent** — field-level cross-continent `formalizes`
   is riskier (A10/A19 NEI); the pipeline caught these by abstaining (safe even at the riskier
   granularity). Not a plan-change finding (the (d) assumption held; hallucination stayed 0).
4. **Source-discrimination, not target pattern-matching** — same-target triples got different verdicts
   by source (economics: A1 supported / C1 supported+tension / C5 NEI; ML: A18 supported / C3 NEI).
5. **No clause-6 `disputed:true` arose** — genuine edge-level dispute is predicted for the (a)-contested
   relations (`influenced`/`critiques`), reinforcing the (d)→(a) sequencing.

## Provenance & hygiene

21 edges `status: proposed`, `evidence_kind: externally_sourced`, `proposed_by` = Claude Sonnet /
claude-sonnet-4-6 / 2026-06-19, confidence 0.78–0.92, per-edge QC `note`. `founded_or_formalized`
still excluded (no person/work nodes). No node identity changed; no contract changed; 12-type taxonomy
unchanged. Files: `scoping.md`, `proposals.json`, `qc-report.md`, `report.md`, `spn-results.md`.
typecheck + validate:data green. SPN: 6 snapshots / 33 [SPN-FAILED] (web.archive.org bot-blocked,
§8-honest; live anchors fetched at 200 at QC time).
