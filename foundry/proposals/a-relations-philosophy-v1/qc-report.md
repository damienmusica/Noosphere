# a-relations-philosophy-v1 — grounding + adversarial QC + verdicts (orchestrator)

> Lane B propositional-edge **(a)-relation pilot**, session #29 (round 4, 2-lane stagger — Lane B). First
> `influenced`/`critiques` build (`/data` had 0 of either). Permanent QC record. Order = decision (55).
> The orchestrator (Opus 4.8) ran Stages 2–5 in a context **separate** from the Sonnet generation
> subagent (ADR 0007 / immutable contract 2). Generation = `proposals.json`; scoping = `scoping.md`.
> Session effort High. **This is the test the whole Lane B design pointed at: does the pipeline preserve
> genuine scholarly tension and abstain honestly on interpretive (a)-claims, while rejecting
> hallucination/anachronism?**

## Method (Stages 2–5)

- **Stage 2 — atomize.** Each `influenced`/`critiques` claim reduced to: "A (the earlier/critic) shaped /
  challenges B," carrying the **direction + chronology atom** explicitly (the (a)-strictness point).
- **Stage 3 — grounding.** ≥2 **independent claim-stating** sources (a source that *states the
  influence/critique*, not one co-mentioning two schools), live-fetched (HTTP 200), verbatim. Reachable:
  SEP (200), IEP (partial — several slugs 404, the fuzzy-redirect trap). Per wave-1 precedent, distinct
  articles from one publisher count independently.
- **Stage 4 — adversarial perspective-diverse QC.** ① source→claim (verbatim?) ② claim→counter-evidence
  (contested? → disputed/NEI) ③ **direction + anachronism** (does the timeline allow A→B?). Refutation
  framing; all findings + severity.
- **Stage 5 — verdict** ∈ {supported / disputed (clause-6: dominant view + ≥3 sources + minority note) /
  NEI-abstain / reject (false/anachronistic)}.

## Referent axis — pre-cleared

All 26 endpoints are existing reviewed philosophy nodes (humanities continent, audited). Referent risk
retired before QC. The (a)-QC budget concentrated on ①, ②, and ③-direction/anachronism.

---

## Per-candidate grounding + QC

### Bucket A — supported-expected influence (3 supported, 3 NEI)

**A1 `phenomenology` → `existentialism` (influenced) — SUPPORTED (0.9).**
- ① SEP *Existentialism*: "Following the core maxim of phenomenology introduced by his teacher Husserl,
  Heidegger's philosophy…"; Heidegger's being-in-the-world ideas "become central to twentieth-century
  existentialism." IEP *Existentialism*: "Sartre was in his late 20s when he first encountered
  phenomenology, specifically the philosophical ideas of Edmund Husserl." (2 orgs.)
- ② None. Direction ✓ (Husserl 1900s → Sartre/Heidegger/Merleau-Ponty 1920s–40s).

**A2 `ancient-philosophy` → `medieval-philosophy` (influenced) — SUPPORTED (0.92).**
- ① SEP *Medieval Philosophy*: "The central texts for commentary… were Aristotle's"; the Aristotle
  translations "transformed the university syllabuses in the thirteenth century." SEP *Influence of
  Arabic and Islamic Philosophy on the Latin West*: "the statutes of the Parisian arts faculty declared
  all known works of Aristotle mandatory reading — a very influential move." (2 SEP articles.)
- ② None. Direction ✓. Strongest in the batch.

**A3 `medieval-philosophy` → `renaissance-philosophy` (influenced) — NEI-ABSTAIN.**
- ① IEP *Renaissance Philosophy* emphasizes **rupture**: "the preference for ancient authors and
  commentators over medieval ones"; "Renaissance Platonism… marked a sharper break with medieval
  philosophy"; humanists "challenged the intellectual foundations of medieval Scholastic learning."
- ② **Rupture-dominant.** There is continuity (Renaissance Aristotelianism built on medieval commentary)
  but the dominant Renaissance self-understanding was a *break from* scholasticism. The cleaner relations
  are `critiques` (humanism → scholasticism) or ancient→renaissance (revival); "medieval *influenced*
  renaissance" is partial and contested. → **NEI-abstain.** Not written.

**A4 `analytic-philosophy` → `philosophy-of-language` (influenced) — NEI-ABSTAIN.**
- ① The linguistic turn (Rorty 1967) made language central to analytic philosophy — but philosophy of
  language is **constitutive of / a core area within** analytic philosophy, not something it influenced
  externally. No claim-stating "analytic philosophy influenced philosophy of language" source.
- ② **Wrong relation type** (closer to `part_of`/constitutive than `influenced`). → **NEI-abstain.**
  Not written. (The generation subagent flagged this constitutive-vs-influence ambiguity — confirmed.)

**A5 `pragmatism` → `philosophy-of-education` (influenced) — SUPPORTED (0.88).**
- ① SEP *Philosophy of Education*: "John Dewey's conception of democratic education has had enduring
  influence." SEP *Pragmatism*: classical pragmatism turned "towards politics, education… under the
  immense influence of John Dewey"; "The giant figure in philosophy of education is of course Dewey, who
  pioneered it as a separate sphere of study." (2 SEP articles.)
- ② Largely Dewey-mediated (recorded in note); Dewey's pragmatism is foundational to the field at the
  school level. Direction ✓.

**A6 `phenomenology` → `philosophy-of-mind` (influenced) — NEI-ABSTAIN.**
- ① SEP *Phenomenology*: the traditions of phenomenology and analytic philosophy of mind "have **not
  been closely joined**, despite overlapping areas of interest"; only since the late 1980s/90s has
  phil-of-mind converged on consciousness as "ultimately a phenomenological issue."
- ② The dominant 20th-c picture is **separate development**, not influence; the convergence is recent and
  partial. "Phenomenology influenced philosophy of mind" overstates → the honest relation is
  overlap/recent-convergence (`adjacent_to`), not historical `influenced`. → **NEI-abstain.** Not written.

### Bucket B — "disputed-expected" → all resolved SUPPORTED + tension note (the key finding)

**B1a `analytic-philosophy` → `continental-philosophy` (critiques) — SUPPORTED + tension note (0.72).**
- ① IEP *Analytic Philosophy*: analytic philosophy "found itself opposed both to classical Phenomenology…
  and also 'Continental' or 'Postmodern' philosophy (Heidegger, Foucault and Derrida)." SEP *Heidegger*:
  "Friedman (2000) argues that this disputation [Carnap–Heidegger] was the hypocenter of the subsequent
  analytical/continental divide in twentieth century philosophy." (2 orgs — the critique is documented,
  paradigmatically Carnap's critique of Heidegger.)
- ② **The critique demonstrably exists → supported, not `disputed:true`.** The genuine controversy is
  *meta*: whether the analytic/continental divide is substantive or **overstated/a caricature** — recorded
  in `note` (record-not-resolve). clause-6 `disputed:true` would require positioning on a dominant view
  with ≥3 sources *and a sourced minority*; the "divide is overstated" minority was not live-sourceable
  this session, so the honest verdict is **supported + tension note**, not a half-sourced disputed flag.

**B1b `continental-philosophy` → `analytic-philosophy` (critiques) — NEI-ABSTAIN.**
- ② **Per-direction discipline.** The mutual-divide sources most directly document the *analytic→
  continental* direction (Carnap→Heidegger; IEP "opposed to Continental"). A claim-stating *continental→
  analytic* critique (e.g. continental critique of analytic scientism/narrowness) was **not independently
  sourced this session** → abstain rather than infer from "the divide is mutual." → **NEI-abstain**, honest
  gap (candidate for a follow-up with continental-side sources). *Even for a "mutual" relation, only the
  sourced direction is asserted.*

**B2 `experimental-philosophy` → `analytic-philosophy` (critiques) — SUPPORTED + tension note (0.75).**
- ① SEP *Experimental Philosophy*: x-phi "challenged aspects of non-empirical philosophical methodology,
  prominently including the use of intuitions as evidence"; advocates of traditional conceptual analysis
  "assume that the method of cases can reliably be applied from the armchair." SEP *Intuition*: the x-phi
  "sources project… [is] often presented as a possible means of justifying skepticism regarding some
  class of philosophical intuitions." (2 SEP articles.)
- ② The critique exists (supported); its **success is debated** — restrictionist challenge vs "Intuition
  Apologetics," "a careful critique of those reasons" (Ludwig). x-phi is internally divided (extending vs
  undermining the armchair). Recorded in note. Not `disputed:true` (the existence of the critique is not
  contested). Direction ✓.

**B3 `feminist-philosophy` → `epistemology` (critiques) — SUPPORTED + tension note (0.85).**
- ① SEP *Feminist Epistemology*: "Do mainstream philosophical conceptions of objectivity, knowledge, and
  reason reflect an androcentric perspective?"; §"Feminist Critiques… of Objectivity." IEP *Feminist
  Epistemology*: feminist epistemology "takes issue with the ways in which traditional epistemological
  paradigms derive from cases of simple and uncontroversial empirical beliefs." (2 orgs.)
- ② The critique exists and is documented (supported). Internal complexity (postmodernist critiques of
  feminist standpoint; the critique-vs-extension question) recorded in note. Direction ✓.

### Bucket C — rejection probes (1 reject, 2 NEI)

**C1 `medieval-philosophy` → `ancient-philosophy` (influenced) — REJECT (anachronism).**
- ② **Chronologically impossible** — a later era cannot influence an earlier one. Reverse of A2. The
  generation subagent self-flagged it (confidence 0.03, ambiguous). The pipeline **rejects** outright; no
  source could support it. The cleanest possible rejection — a false claim caught. Not written.

**C2 `buddhist-philosophy` → `phenomenology` (influenced) — NEI-ABSTAIN.**
- ① SEP *Phenomenology*: "When Hindu and Buddhist philosophers reflected on states of consciousness…
  they were **practicing phenomenology**" — a **parallel / retrospective characterization**, not a claim
  of historical *influence* on Husserl/Western phenomenology.
- ② Comparative-philosophy parallels ≠ historical influence. No claim-stating source for directed
  influence. → **NEI-abstain.** Not written.

**C3 `pragmatism` → `analytic-philosophy` (influenced) — NEI-ABSTAIN.**
- ① SEP *Pragmatism*: "pragmatism's influence was challenged, as analytic philosophy blossomed and became
  the dominant methodological orientation"; yet "Lewis and Quine developed a number of pragmatist themes"
  and Brandom aims at "reintegrating analytic and pragmatist philosophy."
- ② **Genuinely contested existence with no clear dominant view** — pragmatism was partly *displaced* by
  analytic philosophy, partly *reabsorbed* (Lewis/Quine, neo-pragmatism Rorty/Brandom). With no dominant
  scholarly position to position a clause-6 edge on, the honest move is **abstain** (not a forced
  supported, not a manufactured disputed). → **NEI-abstain.** Not written.

---

## Verdict distribution & measurements (the session's real output)

| metric | value |
|---|---|
| candidates (N) | **13** (influenced 8, critiques 5; first-ever (a)-relations) |
| **supported** | **6** — A1, A2, A5 (influenced) · B1a, B2, B3 (critiques), each with tension note where relevant |
| **disputed (clause-6)** | **0** (see finding below) |
| **NEI-abstain** | **6** — A3, A4, A6, B1b, C2, C3 |
| **reject (false/anachronism)** | **1** — C1 |
| **claim-level hallucination** | **0/13** — no false influence/critique promoted; C1 anachronism rejected; NEI correctly abstained |
| precision (supported set) | **6/6 = 1.0** |
| referent errors | 0/13 (endpoints pre-cleared) |
| generation hint reliability | claim_anchor verbatim ≈ 0 (paraphrases); the subagent's *self-flags* were well-calibrated (C1 conf 0.03 anachronism; C2 0.22; C3 0.42) — the honest-uncertainty signal tracked the QC outcome better than in the (d)-waves |
| **rejection / abstention** | **fired 7×** — 6 NEI + 1 reject, all correct |

### Key findings

1. **The pipeline discriminates cleanly on interpretive (a)-claims** — 0 hallucination, precision 1.0 on
   the supported set, and **7 correct refusals** spanning rupture-dominant influence (A3), wrong-relation
   (A4 constitutive), separate-traditions (A6), per-direction under-sourcing (B1b), parallel-not-influence
   (C2), contested-no-dominant-view (C3), and **anachronism (C1)**. The "ability not to promote" is
   strongly in the data — *more* so than the (d)-waves (here 7/13 were refused).
2. **★ clause-6 `disputed:true` did NOT fire — even in the (a)-pilot, and even for the disputed-seeded
   Bucket B.** All four Bucket-B "critiques" resolved as **supported + tension note**: the critique
   relations (analytic⊣continental, x-phi⊣armchair, feminist⊣mainstream-epistemology) are **documented
   facts** (supported); the genuine controversy is *meta* (is the divide overstated? does the critique
   succeed?) and is preserved in `note` — **record-not-resolve via the note, not via the disputed flag.**
   The contested-*existence* candidates (C2, C3) lacked a dominant view to position on → **NEI**, not
   clause-6 disputed. **Conclusion:** clause-6 `disputed:true` (contested claim positioned on a dominant
   view, ≥3 sources + sourced minority) is a **narrow mechanism** that did not trigger in 13 (a)-candidates;
   the tension the project exists to preserve is carried by **supported-edge notes + calibrated NEI**, not
   by the disputed flag. This is a measurement finding, not a failure — and it materially informs whether
   the disputed:true field is the right primary mechanism for propositional tension.
3. **Person-node ceiling is real.** Several (a)-relations are naturally person-mediated (A4 via Frege/
   Russell/Wittgenstein; A5 via Dewey — sourced at school level only through Dewey; person-level critiques
   for B1b). The pilot confirms a node gate for persons/works would unlock a large class of (a)-edges.

## Open-criteria judgment (pre-committed, decision (55))

- **(i) Hallucination filtering — MET.** Supported-set claim-level hallucination 0 (≤1).
- **(ii) Discrimination — MET; clause-6 disputed sub-criterion NOT triggered.** The pipeline distinguished
  genuine relation (→supported, tension in note) from insufficient/contested sourcing (→NEI, 6×) from
  false/anachronistic (→reject, C1). But **clause-6 `disputed:true` fired 0×** — the pre-committed "≥1
  correct clause-6 firing" is unmet, because no candidate genuinely warranted it (finding #2), not because
  the pipeline failed.

**CTO recommendation — HOLD the (a)-ladder (do NOT open auto-promotion for `influenced`/`critiques`).**
Reasons: (a) (i) met but (ii)'s clause-6 sub-criterion untriggered — the disputed mechanism is unmeasured
in practice; (b) N=13 is small and the refusal rate is high (7/13), so (a)-relations are materially more
interpretive than (d) — the pre-committed "(a) is more conservative" stance applies; (c) the supported
(a)-edges carry tension notes that warrant human/CPO eyes, not auto-`reviewed`. **Recommended next:** a
2nd (a)-wave (cross-domain + larger N) to grow precision measurement and to test whether clause-6
`disputed:true` *ever* fires for propositional edges — and a CPO read on finding #2 (is note-based
tension-preservation on supported edges the intended primary mechanism, with `disputed:true` reserved for
a narrower case?).

## Write decision (Stage 6) — proposed-first

- **6 edges written to `/data` as `status: proposed`** (A1, A2, A5 influenced; B1a, B2, B3 critiques),
  full provenance, `evidence_kind: externally_sourced`, confidence 0.72–0.92, per-edge tension `note`.
  **No `disputed:true` edge.** The (a)-auto-`reviewed` ladder is **NOT** opened (decision (54) opened only
  (d)-`formalizes`); these stay `proposed` pending the CPO read.
- **7 candidates NOT written** — 6 NEI (A3, A4, A6, B1b, C2, C3) + 1 reject (C1) — honest gaps in
  `proposals.json` (untrusted `generated`), not promoted.
- **New source:** `source:iep` (Internet Encyclopedia of Philosophy) registered with license metadata.
  SEP already registered. No node identity changed; no contract changed; 12-type taxonomy unchanged.
