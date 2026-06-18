# formal-founders-v1 — batch report (session #30)

**The corpus's first `person` nodes.** Round 4, Lane B node+edge build, after the session-#30 design
gate (CPO-ratified contract: vault `founder-node-gate-design.md`, decisions (57)/(58)). `/data` had
0 person/work nodes before this batch.

## What entered /data

- **8 person nodes** (`reviewed`, `indexable:false`, `is_living_person:false`, `level:2`,
  `domain:formal_sciences`, QID-verified, no `academic_status`): Georg Cantor (Q76420), Andrey
  Kolmogorov (Q153224), Claude Shannon (Q92760), George Boole (Q134661), Gottlob Frege (Q60028),
  Alan Turing (Q7251), John von Neumann (Q17455), John Nash (Q128736).
- **8 `founded_or_formalized` edges** (`proposed`, `externally_sourced`, person→existing reviewed
  field/subfield): Cantor→set-theory, Kolmogorov→probability-theory, Shannon→information-theory,
  Boole→mathematical-logic, Frege→mathematical-logic, Turing→computability-theory,
  von Neumann→game-theory, Nash→game-theory.
- **1 new source** `source:mactutor` (MacTutor History of Mathematics Archive, Univ. of St Andrews;
  © St Andrews, cited-only, no text cached).
- **Golden-set 433 → 441** (+8 person QID entries, verdict=verified, rank1_expected — re-auditable).

Counts: nodes 427 → **435**, edges 503 → **511**, sources 20 → **21**, translations 427 → **435**.
`typecheck` ✓ · `validate:data` ✓.

## Measurement (the point of the pilot)

| Metric | Result |
|---|---|
| Generated-QID hallucination (node) | **7/8 = 87.5%** — all caught & corrected (≈ ~93% prior) |
| Node QID precision after QC | **8/8 = 1.0** (all verified human, deceased, correct entity) |
| Edge claim-level hallucination | **0/8** |
| Edge precision | **8/8 supported = 1.0** |
| `disputed:true` edges | 0 (founder attributions are documented facts) |
| Plural/layered founding preserved | 3 (Boole∥Frege; vN+Nash; Cantor+Dedekind-note) |
| Wayback snapshots | **16/16, 0 [SPN-FAILED]** |

## `founded_or_formalized` ladder — NOT opened (measurement-first, own gate)

`founded_or_formalized` is a **new relation class**. CPO decision (54) opened the auto-`reviewed`
ladder for `formalizes` **only**; it does **not** auto-apply here. These 8 edges are **proposed-first**,
awaiting a dedicated CPO ladder gate.

**Pre-committed open-criteria (contract §A7):**
- (i) hallucination ≤ 1 — **MET** (0/8 claim-hallucination; edge precision 1.0).
- (ii) discriminate plural-founding vs mis-attribution — **PARTIALLY MET.** Plural/layered founding
  correctly preserved (3 cases). **Mis-attribution rejection was NOT exercised** — the 8 candidates
  were hand-scoped to clean foundings, so no false attribution was present to reject at the edge
  level. The strong referent-axis result this batch gives is the node-level QID-hallucination catch
  (7/8). **CTO recommendation: a 2nd founder wave with deliberate rejection probes** (mis-attributed
  founders, wrong-field foundings) before opening the ladder — mirror the wave-2 design that
  exercised rejection 6×. N=8 single-wave is also below the wave-2 N≥25 precedent.
- (iii) direction/referent accuracy — **MET** (8/8 person→field; all referents verified).

## Wayback snapshots (§8)

- Cantor: SEP `web/20260618232736/…/set-theory/` · Wikipedia `web/20260105094344/…/Georg_Cantor`
- Kolmogorov: SEP `web/20260618232806/…/probability-interpret/` · MacTutor `web/20260121190107/…/Kolmogorov/`
- Shannon: SEP `web/20260618232828/…/information/` · MacTutor `web/20251226195129/…/Shannon/`
- Boole: SEP `web/20260618232850/…/boole/` · MacTutor `web/20251226220429/…/Boole/`
- Frege: SEP `web/20260618232912/…/frege/` · MacTutor `web/20251119144950/…/Frege/`
- Turing: SEP `web/20260618232934/…/church-turing/` · MacTutor `web/20251229192112/…/Turing/`
- von Neumann: SEP `web/20260618232955/…/game-theory/` · MacTutor `web/20251231103027/…/Von_Neumann/`
- Nash: SEP game-theory (shared) · MacTutor `web/20251107035048/…/Nash/`

## Next (CPO inputs)

1. **`founded_or_formalized` ladder gate** — after a 2nd founder wave with rejection probes (open-criterion (ii)).
2. **Person nodes wave 2** — non-formal-science founders + the deferred co-founder/precursor nodes
   surfaced here (Oskar Morgenstern → game-theory; Dedekind → set-theory; Alonzo Church → computability);
   **living-person policy** validation (this pilot was deceased-only by design).
3. **2nd (a)-wave** — person-mediated `influenced`/`critiques` now unblocked (founder nodes exist).
