# Scoping note — formal-founders-wave2-v1 (orchestrator, session #31)

> **Wave-2 = `founded_or_formalized` ladder "earning" measurement wave** (mirror of #28
> `formalizes` wave-2). Wave-1 (`formal-founders-v1`, #30) proved precision 1.0 at N=8 but
> **open-criterion (ii) "mis-attribution rejection muscle" did NOT fire** — the 8 candidates were
> hand-scoped to clean foundings. This wave deliberately mixes **genuine founders (expand N) +
> rejection probes (exercise (ii))** to measure whether the pipeline actually rejects fake /
> mis-attributed / over-broad / anachronistic foundings. Pipeline = Lane B mirror, node+edge
> two-stage; generation = Sonnet subagent (separate context, ADR 0007); QC = orchestrator (live).

## Stage 0 — candidate scope (orchestrator)

**The point of this wave is NOT supported-count — it is whether the rejection probes are actually
rejected** (the cell wave-1 never exercised). Cumulative founder-edge N after this wave =
wave-1 8 + wave-2 genuine 12 = **20** (≥ wave-2 N≥25-ish ladder-opening sample target, combined
with rejection firing).

### Genuine founders (buckets A + B) — 12 person nodes, 12 founder edges, all deceased

All targets verified `reviewed` in `data/nodes.json` as of 2026-06-19. All persons deceased
(`is_living_person: false`) — pilot remains deceased-only by design; any candidate found living →
**stop, flag, CPO-escalate** (contract §A5).

**Bucket A — surfaced co-founders/precursors flagged in #30 notes (plural founding, co-exist):**

| # | Person (proposed ID) | Founding target (reviewed) | Plural with (existing) | Death |
|---|---|---|---|---|
| W1 | `person:oskar-morgenstern` | `subfield:game-theory` | von Neumann + Nash | 1977 |
| W2 | `person:richard-dedekind` | `subfield:set-theory` | Cantor | 1916 |
| W3 | `person:alonzo-church` | `subfield:computability-theory` | Turing | 1995 |

**Bucket B — new formal-science founders (founding attribution rich in standard sources):**

| # | Person (proposed ID) | Founding target (reviewed) | Plural pair | Death |
|---|---|---|---|---|
| W4 | `person:david-hilbert` | `subfield:proof-theory` | (sole — Hilbert's program) | 1943 |
| W5 | `person:carl-friedrich-gauss` | `subfield:number-theory` | (Disquisitiones 1801) | 1855 |
| W6 | `person:henri-poincare` | `subfield:algebraic-topology` | (Analysis Situs 1895) | 1912 |
| W7 | `person:emmy-noether` | `subfield:algebra` | (modern/abstract algebra) | 1935 |
| W8 | `person:norbert-wiener` | `subfield:cybernetics` | (coined term, 1948) | 1964 |
| W9 | `person:ronald-fisher` | `subfield:mathematical-statistics` | ∥ Pearson | 1962 |
| W10 | `person:karl-pearson` | `subfield:mathematical-statistics` | ∥ Fisher | 1936 |
| W11 | `person:isaac-newton` | `subfield:calculus` | ∥ Leibniz | 1727 |
| W12 | `person:gottfried-wilhelm-leibniz` | `subfield:calculus` | ∥ Newton | 1716 |

**Plural-founding sets (co-exist, NOT `disputed` — record-not-resolve, wave-1 precedent):**
- `game-theory`: von Neumann + Nash (existing) + **Morgenstern** (new) = documented co/layered founding.
- `set-theory`: Cantor (existing) + **Dedekind** (new) — Zermelo: "created by Cantor and Dedekind".
- `computability-theory`: Turing (existing) + **Church** (new) — Church–Turing thesis.
- `mathematical-statistics`: **Fisher** + **Pearson** (both new) — co-founders of modern math. statistics.
- `calculus`: **Newton** + **Leibniz** (both new) — canonical documented dual independent founding.

### Rejection probes (bucket C) — 5 edges, expected verdict reject/NEI

These test open-criterion (ii): does the pipeline **catch and reject** a false founding attribution?
The probe target is the **edge attribution**, not node hallucination — probe people may be real and
deceased (their QIDs are still live-verified during QC so the rejection is provably
attribution-based, not a node artifact). **Probe edges and probe-only nodes are NOT written to
`/data`** (a rejected edge → orphan person node would violate keep-criteria §A2); they live in
foundry as the rejection measurement, mirroring how wave-2 `formalizes` NEI candidates stayed in
foundry.

| # | Probe edge | Rejection class | Expected | Node fate |
|---|---|---|---|---|
| P1 | Euclid → `subfield:set-theory` | anachronism (~2200 yr before set theory) | reject | not written |
| P2 | Claude Shannon → `subfield:game-theory` | field mis-attribution (Shannon founded info-theory) | reject | node exists (info-theory); edge not written |
| P3 | Carl Gauss → `subfield:probability-theory` | contributed (Gaussian dist.) but did NOT found (Kolmogorov axiomatized); wrong field | reject | node written for number-theory (genuine); this edge not written |
| P4 | Aristotle → `subfield:mathematical-logic` | over-broad / referent (founded ancient *term/syllogistic* logic; *mathematical/symbolic* logic = Boole/Frege) | reject | not written |
| P5 | Pythagoras → `subfield:number-theory` | legendary attribution (number mysticism ≠ founding the modern subfield; historical Pythagoras barely documented) | reject | not written |

**Same-target genuine↔probe discrimination pairs (the (ii) measurement):**
- `number-theory`: Gauss (genuine, W5) ∥ Pythagoras (probe, P5) — same target, opposite verdict.
- `game-theory`: vN+Nash+Morgenstern (genuine) ∥ Shannon (probe, P2).
- `set-theory`: Cantor+Dedekind (genuine) ∥ Euclid (probe, P1).
- `mathematical-logic`: Boole+Frege (genuine) ∥ Aristotle (probe, P4).

This is the cleanest possible test: the pipeline must keep the genuine edge and reject the probe on
the **same** target node, isolating attribution-quality from node-existence.

## Cleanliness pre-check (Stage 0 guard — no fake-dispute injection)

All 12 genuine foundings are documented facts in standard sources (SEP, MacTutor, Encyclopedia of
Mathematics, standard math histories), not interpretive disputes → expect 0 `disputed:true`
(consistent with the (d)→(a) thesis: genuine dispute concentrates in (a)-relations). Plural
founding ≠ dispute. Terminological nuances to watch (lower confidence, sourced, NOT doubted):
- **W7 Noether → `subfield:algebra`**: she founded *modern/abstract* algebra; `algebra` is the
  broader subfield node (parallel to wave-1 Boole → `mathematical-logic` 0.85 nuance).
- **W4 Hilbert → `subfield:proof-theory`**: Hilbert founded proof theory (Beweistheorie); Gentzen
  later central. Hilbert is the standard founder — clean.

## QID discipline

Generated QIDs are **untrusted hints** (memory: generated-QID hallucination ~88–93%; #30 caught
7/8). QC live-verifies **every** QID — genuine and probe — via Wikidata `wbsearchentities` +
`wbgetentities` (P31=Q5 human, P570 death present = deceased, label/enwiki sitelink match). No QID
is pre-pinned in /data before live verification.

## What enters /data (if QC passes)

- **12 person nodes** (`reviewed`, `indexable:false`, `is_living_person:false`, `level:2`,
  `domain:formal_sciences`, QID-verified, no `academic_status`).
- **12 `founded_or_formalized` edges** (`proposed`, person→existing reviewed field/subfield) —
  proposed-first; the `founded_or_formalized` ladder is NOT opened this session (own gate; opening
  is a CPO decision informed by this wave's measurement).
- **Bucket C (5 probes): NOTHING written to /data** — recorded in qc-report.md as the rejection
  measurement (open-criterion (ii)).
