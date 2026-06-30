# person-wave4-v1 — Stage 0 scoping (orchestrator)

> Session #39, round 4 Lane B. **Person wave 4 = living-person handling v2 *first execution*.**
> CPO-ratified scope (this session): 4 deceased surfaced co-founders (founder-ladder auto) + 2 living
> founders (v2 policy-auto — the measurement) + 1 living Cerf→internet attempt (CPO opt-in).
>
> **★ The point of this batch:** demonstrate that v2 (vault decision (70)) is **not** a blanket CPO
> gate. A clean, uncontested *living* founder auto-promotes to `reviewed` (attributed wording, QID
> anchor) under policy — generalizing the Seligman N=1 precedent (decision (62)) to N>1 by rule, not
> by per-item sign-off. The owner escalates only on a narrow risk-signal set. Deceased surfaced
> co-founders ride the already-open `founded_or_formalized` ladder (decisions (60)/(61)).

## Design (mirror of wave-3 / #36 pipeline)

- **Bucket A — deceased surfaced co-founders (4):** genuine co-founders of existing `reviewed` field/
  subfield nodes, each deceased, each *alongside* a founder already in `/data` (record-not-resolve
  plural founding, decision (62) residual debt). Supported edges auto-promote `proposed → reviewed`
  under the open ladder.
- **Bucket B — living founders (2): ★ the v2 measurement.** Genuine living founders of existing
  `reviewed` nodes. Under v2: node + edge held to a *stricter* floor (resolver-verified QID anchor
  with P570 live-confirmed absent + ≥2 independent live claim-stating sources + conservative
  attributed wording) and **auto-promote to `reviewed` when clean** (no escalation signal). This is
  the inverse of wave-3's expectation: wave-3 *halted* living founders at a CPO stop-point; v2
  *flows* them through by policy. N(living) 1 → 3.
- **Bucket C — Cerf→internet (1, CPO opt-in): ★ closes the #33 honest gap.** #33 found
  Cerf→`computer-networks` NEI (referent over-broad: the academic field predates Cerf). The precise
  referent is **the Internet** (the global system Cerf + Bob Kahn co-designed via TCP/IP), QID Q75.
  `founded_or_formalized` taxonomy admits a `concept` target ("field/concept B"); `concept` node type
  already exists (no schema change). New `concept:internet` node + Cerf→internet living founder edge
  (v2 path, co-founding with Kahn = record-not-resolve note). **If the `internet`-node modeling does
  not hold cleanly at QC, keep the honest gap and defer** (do not force).

## Bucket A — deceased surfaced co-founders (4)

| candidate | person id | → target (reviewed) | existing founder in /data | domain | notes |
|---|---|---|---|---|---|
| A1 | person:karl-marx | field:sociology | Comte, Durkheim, Weber | social_sciences | co-founder cluster (record-not-resolve; conflict-theory founding strand) |
| A2 | person:robert-koch | subfield:microbiology | Pasteur | life_sciences | co-founder (Koch's postulates; Pasteur already in /data — record-not-resolve) |
| A3 | person:charles-sanders-peirce | subfield:semiotics | Saussure | humanities | co-founder (Peircean semiotics ∥ Saussurean semiology; two independent traditions) |
| A4 | person:alfred-russel-wallace | subfield:evolutionary-biology | Darwin | life_sciences | co-founder (independent co-discovery of natural selection, 1858 Darwin–Wallace) |

## Bucket B — living founders (2) ★ v2 policy-auto measurement

| candidate | person id | → target (reviewed) | domain | expected (v2) |
|---|---|---|---|---|
| B1 | person:william-labov | subfield:sociolinguistics | social_sciences | living (b.1927); father of variationist sociolinguistics → node+edge auto-`reviewed` if supported & clean |
| B2 | person:george-lakoff | subfield:cognitive-linguistics | humanities/cognitive | living (b.1941); co-founder of cognitive linguistics (w/ Langacker) → auto-`reviewed` if supported; co-founding = record-not-resolve note |

## Bucket C — Cerf→internet (1) ★ #33 gap, CPO opt-in

| candidate | person id | → target | domain | notes |
|---|---|---|---|---|
| C1 | person:vint-cerf → concept:internet (NEW) | living (b.1943) | computer_and_information_sciences | precise referent = the Internet (Q75), not computer-networks field; co-founder w/ Bob Kahn (also living, not a node) — record-not-resolve note; `concept` node modeling settled at QC, defer if it doesn't hold |

## Pipeline (mirror wave-3)

1. **Stage 1 — Sonnet generation (separate context, ADR 0007):** 7 person/concept candidate nodes +
   7 `founded_or_formalized` edges as `generated`-tier proposals (QID hints + `is_living_person` best
   guess + ≥2 candidate claim-stating sources per edge + rationale/uncertainty/ambiguous). The
   generator's QID hints and claim_anchors are **untrusted** — they are the hallucination measurement.
   No self-QC (generation/QC context separation).
2. **Stage 2 — orchestrator full QID resolver-verification (live, multi-signal):** P31=Q5 + birth
   P569 + death **P570** + label/sitelink. **Confirms deceased (P570 present) vs living (P570
   absent).** Deceased+verified → node `reviewed`. **Living+verified → node held to v2 floor, auto-
   `reviewed` when the edge is supported & clean** (the v2 change vs wave-3's halt).
3. **Stage 3 — edge grounding + adversarial perspective-diverse QC + clause-6 v2 (live):** ≥2 distinct
   independent claim-stating live sources per edge, direction person→field/concept, referent,
   plural-vs-misattribution. Verdict {supported / disputed / NEI / reject / bidirectional}. Wayback
   snapshots for evidence permanence (§8).
4. **Stage 4 — v2 application write-in:** deceased supported edges auto-promote `reviewed`; living
   supported+clean nodes+edges auto-`reviewed` under v2 (no per-item sign-off); escalate only on the
   narrow signal set. Full provenance retained; in-place status edits, zero reformat.

## Measurement outputs

Living N (1 → ?); living + deceased edge precision (supported/total); claim-level hallucination rate;
generator QID-hallucination rate (prior ~85–93%); plural-founding preservation (sociology, microbiology,
semiotics, evolutionary-biology co-founder strands); **v2 operation evaluation** (policy-auto vs
signal-escalation ratio — did living founders flow through by policy as designed?); escalation firing
(should be 0 unless a narrow signal trips); Cerf/internet disposition. Schema unchanged; 12-type
taxonomy unchanged.
