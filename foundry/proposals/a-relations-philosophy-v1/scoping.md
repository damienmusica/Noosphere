# a-relations-philosophy-v1 — Stage 0 candidate scoping (orchestrator)

> Lane B propositional-edge **(a)-relation pilot**, session #29 (round 4, 2-lane stagger — Lane B). Third
> Lane B build, **first `influenced`/`critiques` edges** (`/data` currently holds 0 of either). Order =
> `session-29-lane-B-a-relations-pilot-prompt.md` (decision (55)). Precedents: wave-1/2 `formalizes`
> ((51)/(53)/(54)) — same 6-stage contract, the relation class moves from (d)-decidable to (a)-contested.
> This is the test the whole Lane B design pointed at: **does the pipeline preserve genuine scholarly
> tension (clause-6 `disputed`) and abstain (NEI) honestly, while still rejecting hallucination?**
> Untrusted scoping material; `/data` is the only ground truth.

## Why (a)-relations now, why philosophy, why small

- **(d)→(a) sequencing earned.** Wave-1/2 measured precision 1.0 / hallucination 0 on (d)-`formalizes`
  and twice predicted that genuine `disputed:true` would **concentrate in the (a)-contested relations**.
  This pilot tests that prediction with the proven pipeline.
- **Philosophy = (a)-native, best-sourced.** `influenced`/`critiques` are the native relations of
  intellectual history; philosophy is our deepest continent (52 reviewed nodes — schools, traditions,
  subfields) with rich SEP/IEP claim-stating coverage of influence and critique.
- **Person-node constraint (honest).** The most famous (a)-relations are person-mediated (Kant→Hegel,
  Popper⊣logical-positivism). The corpus has **no person/work nodes yet**, so this pilot is restricted to
  **school/tradition/subfield level** (e.g. phenomenology→existentialism). Person-mediated (a)-relations
  await the `founded_or_formalized` node gate. **Hard invariant: both endpoints are existing reviewed
  nodes.** All 13 below machine-verified (endpoints reviewed, no duplicate, no self-edge; 0 existing
  influenced/critiques edges → clean first build).
- **Small first (a)-pilot.** 13 candidates (vs wave-2's 27). The goal is to measure the **stopping/
  tension behaviour**, not volume. Within-philosophy only (variable control); cross-domain (a)
  (philosophy↔science influence) is deferred to a 2nd wave (mirrors wave-2's cross-continent expansion).

## The (a)-deltas vs (d) (what this pilot newly tests)

1. **Evidence standard = a source that *states the interpretive claim*** (the influence/critique), not a
   page co-mentioning two schools. SEP / IEP / Cambridge–Routledge Companions / standard intellectual
   history. ≥2 independent claim-stating (different publishers preferred; per wave-1 precedent, distinct
   articles from one publisher count independently — only same-article restatement is banned).
2. **clause-6 `disputed:true` operated for real.** Where scholars genuinely disagree on whether/how A
   influenced or critiqued B: position the edge on the **dominant** scholarly view + **≥3 independent
   sources** (majority + ≥2 supporting) + minority in `note` (validate-data enforces only the note; the
   ≥3/dominant-view floor is policy and is honored). Mutual critique (e.g. analytic↔continental) may be
   recorded as **two co-existing directed edges**. No fabricated controversy — both sides sourced.
3. **NEI/disputed are expected and correct outputs, not failures (L23).** (a) is predicted to carry more
   disputed/NEI than supported. A forced `supported` is the real failure; hallucination (a fabricated
   influence/critique) is the only true error.
4. **Direction / anachronism strictly QC'd.** `influenced` A→B = A precedes and shapes B; reverse or
   anachronistic claims (a later school "influencing" an earlier one) must be rejected.

## Bucket A — supported-expected influence (6)

| # | source | target | relation | claim | a priori |
|---|---|---|---|---|---|
| A1 | `phenomenology` | `existentialism` | influenced | Husserlian phenomenology shaped existentialism (Heidegger, Sartre, Merleau-Ponty). | supported (strong, SEP) |
| A2 | `ancient-philosophy` | `medieval-philosophy` | influenced | Greek philosophy (Plato, Aristotle) shaped medieval scholasticism. | supported (strong) |
| A3 | `medieval-philosophy` | `renaissance-philosophy` | influenced | Medieval scholastic/Aristotelian thought shaped Renaissance philosophy. | supported (medium) |
| A4 | `analytic-philosophy` | `philosophy-of-language` | influenced | Analytic philosophy's linguistic turn shaped philosophy of language. | supported (medium) |
| A5 | `pragmatism` | `philosophy-of-education` | influenced | Pragmatism (Dewey) shaped philosophy of education. | supported (medium — Dewey, school-level sourceable) |
| A6 | `phenomenology` | `philosophy-of-mind` | influenced | Phenomenology shaped philosophy of mind / consciousness studies. | supported (medium — may be partial/contested) |

## Bucket B — disputed-expected (clause-6 test) (4)

| # | source | target | relation | claim | a priori |
|---|---|---|---|---|---|
| B1a | `analytic-philosophy` | `continental-philosophy` | critiques | Analytic philosophy critiques continental philosophy (obscurity, method). | **disputed** — the analytic/continental divide is genuine, mutual, and itself contested (some hold it overstated/artificial). ≥3 sources; minority note. |
| B1b | `continental-philosophy` | `analytic-philosophy` | critiques | Continental philosophy critiques analytic philosophy (scientism, narrowness). | **disputed** — the reverse direction of the mutual critique; co-existing edge with B1a. |
| B2 | `experimental-philosophy` | `analytic-philosophy` | critiques | Experimental philosophy critiques the armchair/intuition method of traditional (analytic) philosophy. | **disputed** — x-phi vs defenders of intuition; genuinely contested. |
| B3 | `feminist-philosophy` | `epistemology` | critiques | Feminist epistemology critiques traditional epistemology (objectivity, the disembodied knower). | **disputed / supported** — sourced both as critique and as extension; measure honestly. |

## Bucket C — rejection-demonstration probes (3)

| # | source | target | relation | claim under test | probe target | why |
|---|---|---|---|---|---|---|
| C1 | `medieval-philosophy` | `ancient-philosophy` | influenced | Medieval philosophy influenced ancient philosophy. | **reject (anachronism)** | Reverse of A2 — a later era cannot influence an earlier one. Direction/anachronism probe; the pipeline must reject. |
| C2 | `buddhist-philosophy` | `phenomenology` | influenced | Buddhist philosophy influenced phenomenology. | **NEI** | A real comparative-philosophy *parallel* literature exists, but a claim-stating source for direct historical *influence* on phenomenology (Husserl) is thin/contested → abstain or disputed, not forced supported. |
| C3 | `pragmatism` | `analytic-philosophy` | influenced | Pragmatism influenced analytic philosophy. | **disputed / NEI** | Real but debated (neo-pragmatism, Quine/Rorty); whether pragmatism *influenced* analytic philosophy at the school level is genuinely contested → measure, don't force. |

**Designed contrasts:** A2 `ancient→medieval` (supported) vs C1 `medieval→ancient` (reject — anachronism)
tests direction discipline on one node pair. B1a/B1b test mutual-critique co-existence. C3 `pragmatism→
analytic` (contested) vs A5 `pragmatism→philosophy-of-education` (supported) tests source-discrimination
on one source node.

## Stage 1 order (generation subagent)

Hand these 13 triples to a **separate-context Sonnet generation subagent** (`proposal-generator` type —
ADR 0007 / immutable contract 2). It produces the reasoned-proposal envelope per candidate (`source`,
`target`, `relation ∈ {influenced, critiques}`, `confidence`, `evidence:[{citation, claim_anchor, url}]`,
`disputed?`, `note?`, `rationale`, `uncertainty`, `ambiguous?`) into
`foundry/proposals/a-relations-philosophy-v1/proposals.json` — **never `/data`**. It must not invent node
IDs outside the 13 verified endpoints, must self-flag contested/anachronistic/thin candidates honestly
(especially Bucket C and the disputed Bucket B), and is told its **evidence hints are untrusted** (the
orchestrator independently live-fetches and verbatim-checks every atom in its own context — that's where
error-decorrelation lives).
