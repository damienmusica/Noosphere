# formal-founders-wave2-v1 — batch report (session #31)

**Founder wave 2 + rejection probes** — the `founded_or_formalized` ladder-earning measurement
wave. Round 4, Lane B node+edge build, mirror of #28 `formalizes` wave-2. Wave-1 (#30,
`formal-founders-v1`) proved precision 1.0 at N=8 but **open-criterion (ii) "mis-attribution
rejection" did not fire** (its 8 candidates were hand-scoped to clean foundings). This wave mixes
12 genuine founders (expand N) + 5 deliberate rejection probes to exercise (ii).

## What entered /data

- **12 person nodes** (`reviewed`, `indexable:false`, `is_living_person:false`, `level:2`,
  `domain:formal_sciences`, QID-verified, no `academic_status`): Oskar Morgenstern (Q94028), Richard
  Dedekind (Q76556), Alonzo Church (Q92741), David Hilbert (Q41585), Carl Friedrich Gauss (Q6722),
  Henri Poincaré (Q81082), Emmy Noether (Q7099), Norbert Wiener (Q178577), Ronald Fisher (Q216723),
  Karl Pearson (Q310794), Isaac Newton (Q935), Gottfried Wilhelm Leibniz (Q9047).
- **12 `founded_or_formalized` edges** (`proposed`, `externally_sourced`, person→existing reviewed
  field/subfield): Morgenstern→game-theory, Dedekind→set-theory, Church→computability-theory,
  Hilbert→proof-theory, Gauss→number-theory, Poincaré→algebraic-topology, Noether→algebra,
  Wiener→cybernetics, Fisher→mathematical-statistics, Pearson→mathematical-statistics,
  Newton→calculus, Leibniz→calculus.
- **0 new sources** (all evidence on existing `source:sep` / `source:wikipedia` / `source:mactutor`).
- **Golden-set 441 → 453** (+12 person QID entries, verdict=verified, rank1_expected=true).

Counts: nodes 435 → **447**, edges 511 → **523**, sources 21 (unchanged), translations 435 → **447**.
`typecheck` ✓ · `validate:data` ✓.

**Bucket C (5 rejection probes): NOTHING written to /data** — recorded in `qc-report.md` as the
(ii) measurement.

## Measurement (the point of the wave)

| Metric | Result |
|---|---|
| Generated-QID hallucination (node, genuine) | **8/12 = 66.7%** — all caught & corrected |
| Node QID precision after QC | **12/12 = 1.0** (correct human, deceased, correct entity) |
| Edge claim-level hallucination | **0/12** |
| Genuine edge precision | **12/12 supported = 1.0** |
| **Rejection probes correctly rejected** | **5/5** (anachronism, field mis-attribution, contribution≠founding, over-broad/referent, legendary) |
| `disputed:true` edges | 0 (founder attributions are documented facts) |
| Plural/layered founding preserved | 5 sets (game-theory, set-theory, computability-theory, mathematical-statistics, calculus) |
| Living-person nodes | 0 (deceased-only; §A5 stop point did not fire) |
| **Cumulative founder-edge N** | wave-1 8 + wave-2 12 = **20** |

## ★ `founded_or_formalized` ladder — open-criteria assessment (contract §A7)

The contract pre-committed three open-criteria. After this wave:

- **(i) hallucination ≤ 1 — MET.** 0/12 edge claim-hallucination; genuine edge precision 12/12 = 1.0.
  Node QID hallucinations (8/12) all caught before /data.
- **(ii) discriminate plural-founding vs mis-attribution — MET (the wave-1 gap, now closed).**
  5 plural/layered founding sets correctly preserved as co-existing edges (not disputed) **AND**
  5 rejection probes correctly rejected — including four **same-target genuine↔probe** pairs
  (number-theory: Gauss kept / Pythagoras rejected; game-theory: vN+Nash+Morgenstern kept / Shannon
  rejected; set-theory: Cantor+Dedekind kept / Euclid rejected; mathematical-logic: Boole+Frege kept
  / Aristotle rejected). The pipeline keeps the genuine and rejects the probe on the *same* target.
- **(iii) direction/referent accuracy — MET.** 12/12 person→field; all referents (person QIDs +
  target nodes) verified.

**All three open-criteria are now met, cumulative N=20, precision 1.0, rejection fired 5×.** This
mirrors #28, where `formalizes` wave-2 (precision 1.0, N=27, rejection NEI 6×) earned the (d)-ladder
opening (decision (54)).

### ★ CTO recommendation (for the CPO ladder gate)

**OPEN the `founded_or_formalized` auto-`reviewed` ladder**, on the same shape as the (54)
`formalizes` ladder:

> A `founded_or_formalized` edge with **both endpoints `reviewed`** and a Lane B pipeline verdict of
> **supported** (≥2 independent claim-stating live sources + adversarial perspective-diverse QC +
> correct person→field direction + verified referent) auto-promotes `proposed → reviewed`.
> `disputed`/NEI/reject verdicts stop at `proposed`/foundry. Plural/layered founding (co-existing
> supported edges with a record-not-resolve note) is **not** treated as ambiguous — it promotes.
> Person-node prerequisite: the founder node is already `reviewed` under node promotion policy v1
> (person-extension), i.e. QID resolver-verified + is_living_person live-confirmed-false. **Living
> founders remain a CPO stopping point** (charter stricter-evidence) — the ladder covers the
> deceased-grounded case measured here.

If opened, the **20 existing `founded_or_formalized` edges** (wave-1 8 + wave-2 12), all supported,
would promote `proposed → reviewed` retroactively (same relation, same criteria — mirrors the (54)
retroactive promotion of wave-1 `formalizes`). **Opening is a CPO decision; this session writes
proposed-first and only recommends.**

## Wayback snapshots (§8)

See `spn-results.md` for the per-URL outcome. Live claim-anchors were all verified at HTTP 200 at QC
time; Wayback is the permanence layer (availability API empty — known flake; SPN 302-Location
harvest used; [SPN-FAILED] recorded honestly per wave-2 precedent).

## Next (CPO inputs)

1. **`founded_or_formalized` ladder gate** — open-criteria (i)(ii)(iii) all met; CTO recommends
   opening (+ retroactive promotion of the 20 supported edges). **CPO decision.**
2. **Person nodes wave 3** — non-formal-science founders + **living-person policy** validation
   (this and wave-1 were deceased-only by design). Surfaced future co-founder candidates from this
   wave's grounding: Gödel/Gentzen (proof-theory layering), Galton (with Pearson, statistics).
3. **2nd (a)-wave** — person-mediated `influenced`/`critiques` (founder nodes now plentiful: 20).
4. **Lane A** practical/meta scoping (not yet started); **CPO disputed mechanism** reconsideration
   ((56) #2).
