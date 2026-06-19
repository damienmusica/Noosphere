# a-relations-wave2-v1 — Stage 0 candidate scoping (orchestrator)

> Lane B propositional-edge **(a)-relation wave 2**, session #34 (round 4, 2-lane stagger — Lane B).
> Fourth Lane B build, **second `influenced`/`critiques` wave**. Order =
> `session-34-lane-B-a-relations-wave2-prompt.md` (decision (63), CTO-drafted / CPO-launched).
> Precedent = `a-relations-philosophy-v1` (#29, decision (56)): 6 supported / 0 disputed / 6 NEI /
> 1 reject, precision 1.0, hallucination 0/13, **clause-6 `disputed:true` never fired**.
> Untrusted scoping material; `/data` is the only ground truth.

## What wave-2 newly tests vs #29 (the deltas)

1. **★ Person-mediated (a) — the wave's primary new measurement.** #29 was ceiling-bound to
   school/tradition/subfield level (no person nodes). The corpus now holds **32 person nodes**
   (FS founders 20 + non-FS 11 + Seligman; sessions #30/#31/#33), all `reviewed`. This unlocks
   **person→person** and **person→field/concept** (a)-edges (Comte→Durkheim, Cantor→Hilbert,
   Frege→Boole, Darwin→evolutionary-psychology) — exactly the class #29 predicted the founder node
   gate would open ((56) person-node ceiling).
2. **Cross-domain expansion.** #29 was within-philosophy (variable control). Wave-2 crosses domains
   (evolutionary-biology→psychology, genetics→evolutionary-biology, information-theory→cognitive-
   psychology). Direction / anachronism checked more strictly. Mirrors wave-2 `formalizes`
   cross-continent (#28).
3. **N expansion → cumulative precision.** #29 N=13. Wave-2 N=16 → **cumulative N=29** (strengthens
   the open-criteria judgment sample).
4. **★★ clause-6 `disputed:true` full stress-test.** #29's key finding = disputed never fired. Wave-2
   **actively hunts the *best* clause-6 candidates** (where the *existence/direction/degree* of
   influence genuinely splits scholars with majority+minority both live-sourceable). If it fires →
   operate it (dominant view + ≥3 sources + minority note). **If it does not fire even under active
   hunting → strong confirmation of the #29 finding** → decisive input to the CPO disputed-mechanism
   re-gate ((56)#2). **No manufactured disputes / no fabricated 3-source controversy** (= hallucination-
   class failure).

## Hard invariants (held)

- **Both endpoints are existing `reviewed` nodes** (machine-verified below; CLAUDE.md data invariant).
- **(a)-ladder NOT opened.** (54) opened (d)-`formalizes`; (60)/(61) opened (d)-`founded_or_formalized`.
  `influenced`/`critiques` keep their own gate — **this session is *measurement*, proposed-first.** Even
  obvious-supported edges are written `status: proposed` (the (a)-ladder opening is a *future* CPO gate).
- **★ Living-person guard — Seligman deliberately excluded.** `person:martin-seligman`
  (`is_living_person: true`) is the only living node; any (a)-edge touching him is a CPO stop-point
  (charter stricter evidence). **No candidate below touches Seligman** — kept clean to avoid a
  mid-wave gate; living-founder (a)-edges deferred to person-wave-4 (living-person sub-policy
  codification). The other 31 persons are deceased — normal processing.
- Schema unchanged (12-type taxonomy); no new fields, no auto-ladder, no scope creep (all
  measurement-then-CPO-regate).

## Endpoint verification

All 16 candidates machine-checked against `/data/nodes.json`: both endpoints **exist + `reviewed`**,
no self-edge, no duplicate of the existing 6 (a)-edges
(phenomenology→existentialism, ancient→medieval, pragmatism→philosophy-of-education `influenced`;
analytic→continental, experimental→analytic, feminist→epistemology `critiques`). `/data` currently
holds **influenced 3 + critiques 3** — all from #29, school-level. These 16 are all new triples.

## Bucket A — person-mediated, supported-expected (7) — **the wave's main thrust**

| # | source | target | relation | claim under test | a priori |
|---|---|---|---|---|---|
| A1 | `person:auguste-comte` | `person:emile-durkheim` | influenced | Comtean positivism / the science of society shaped Durkheim's sociological program. | supported (strong; SEP/IEP) |
| A2 | `person:georg-cantor` | `person:david-hilbert` | influenced | Cantor's set theory shaped Hilbert (he championed it — "Cantor's paradise"). | supported (strong) |
| A3 | `person:richard-dedekind` | `person:georg-cantor` | influenced | Dedekind's rigor / correspondence shaped Cantor's set theory. | supported (medium — may read as mutual) |
| A4 | `person:gottlob-frege` | `person:george-boole` | critiques | Frege's *Begriffsschrift* critiqued the limits of Boole's algebraic logic (generality/quantification). | supported (critique = documented fact) |
| A5 | `person:ronald-fisher` | `person:karl-pearson` | critiques | Fisher critiqued Pearson's statistics (chi-square d.f., method of moments vs ML). | supported (the feud is documented) |
| A6 | `person:henri-poincare` | `subfield:set-theory` | critiques | Poincaré critiqued Cantorian set theory / logicism (predicativism, the actual infinite). | supported (documented critique) |
| A7 | `person:charles-darwin` | `subfield:evolutionary-psychology` | influenced | Darwin's evolutionary theory is the foundation of evolutionary psychology (cross-domain). | supported (strong) |

## Bucket B — cross-domain concept/discipline level, supported-expected (3)

| # | source | target | relation | claim under test | a priori |
|---|---|---|---|---|---|
| B1 | `subfield:evolutionary-biology` | `field:psychology` | influenced | Evolutionary biology shaped psychology (functionalism, comparative & evolutionary psychology). | supported (cross-domain) |
| B2 | `subfield:information-theory` | `subfield:cognitive-psychology` | influenced | Shannon's information theory shaped cognitive psychology (information-processing paradigm, Miller). | supported (medium-strong) |
| B3 | `subfield:genetics` | `subfield:evolutionary-biology` | influenced | Mendelian/population genetics reshaped evolutionary biology (the modern synthesis). | supported (medium — may read as mutual/constitutive) |

## Bucket C — disputed-stress (clause-6 best candidates) (2)

| # | source | target | relation | claim under test | probe target | why |
|---|---|---|---|---|---|---|
| C1 | `person:charles-darwin` | `person:gregor-mendel` | influenced | Darwin influenced Mendel (Mendel owned & annotated the *Origin*). | **disputed / NEI** | Genuine historical debate: Mendel's pea experiments (1856–63) largely predate/are independent of his Darwin reading; degree of influence is contested with sourced positions on both sides → best honest clause-6 probe. |
| C2 | `person:isaac-newton` | `person:gottfried-wilhelm-leibniz` | influenced | Newton influenced Leibniz's calculus (the priority dispute). | **disputed / NEI / reject** | The calculus priority dispute: the historical accusation (Leibniz saw Newton's work via Collins) vs the now-dominant view of independent invention. Tests a famous-but-largely-rejected influence claim. |

## Bucket D — NEI probes (2)

| # | source | target | relation | claim under test | probe target | why |
|---|---|---|---|---|---|---|
| D1 | `person:max-weber` | `person:emile-durkheim` | influenced | Weber influenced Durkheim. | **NEI** | Contemporaries founding sociology in different national traditions (German vs French); little/no documented direct influence (they barely engaged each other) → parallel ≠ influence (mirrors #29 C2). |
| D2 | `subfield:probability-theory` | `field:statistics` | influenced | Probability theory influenced statistics. | **NEI** | The relation is *constitutive/formal* (probability underpins statistical inference), not a historical-*influence* claim → wrong relation, abstain (mirrors #29 A4 constitutive → NEI). |

## Bucket E — rejection-demonstration probes (2)

| # | source | target | relation | claim under test | probe target | why |
|---|---|---|---|---|---|---|
| E1 | `person:gregor-mendel` | `person:charles-darwin` | influenced | Mendel influenced Darwin. | **reject** | Darwin (d. 1882) never knew of Mendel's 1866 paper (ignored until its 1900 rediscovery) — no causal path. Reverse of C1; the pipeline must reject. |
| E2 | `person:emile-durkheim` | `person:auguste-comte` | influenced | Durkheim influenced Comte. | **reject (anachronism)** | Comte (d. 1857) died when Durkheim (b. 1858) was an infant — a later figure cannot influence an earlier one. Reverse of A1. |

**Designed contrasts (direction/anachronism discipline on one node pair):**
- A1 `Comte→Durkheim` (supported) vs **E2** `Durkheim→Comte` (reject — anachronism).
- C1 `Darwin→Mendel` (disputed/NEI) vs **E1** `Mendel→Darwin` (reject — no causal path).
- A5 `Fisher→Pearson` (`critiques`, supported) sits on the same pair as the famous priority feud —
  tests that we record the *documented critique* without adjudicating who was right.

## Stage 1 order (generation subagent)

Hand these 16 triples to a **separate-context Sonnet generation subagent** (`proposal-generator`
type — ADR 0007 / immutable contract 2). It produces the reasoned-proposal envelope per candidate
(`source`, `target`, `relation ∈ {influenced, critiques}`, `confidence`,
`evidence:[{citation, claim_anchor, url}]`, `disputed?`, `note?`, `rationale`, `uncertainty`,
`ambiguous?`) into `foundry/proposals/a-relations-wave2-v1/proposals.json` — **never `/data`**. It
must not invent node IDs outside the 16 verified endpoints, must self-flag contested/anachronistic/
thin candidates honestly (especially Buckets C/D/E), and is told its **evidence hints are untrusted**
(the orchestrator independently live-fetches and verbatim-checks every atom in its own context —
that's where error-decorrelation lives; #33 measured QID hallucination 85%, #29 claim-anchor
verbatim ≈0% / half the URLs dead).
