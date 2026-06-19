# a-relations-wave2-v1 — orchestrator QC report (Stages 2–5)

> Lane B (a)-relation **wave 2**, session #34 · 2026-06-19 · decision (63). Generation = separate-context
> Sonnet subagent (`proposals.json`, untrusted hints). QC = orchestrator (Opus), independent live
> grounding + adversarial perspective-diverse verification. Evidence standard: **≥2 independent
> claim-stating live sources** (the source must *state* the influence/critique, not co-mention two
> entities). Verdict ∈ {supported / disputed(clause-6) / NEI-abstain / reject}. proposed-first — the
> (a)-auto-`reviewed` ladder is NOT open.

## Untrusted-generation confirmation (why independent QC)

The generation layer's evidence hints were untrusted by design, and independent re-fetch confirmed it:
- **Fabricated anchor:** B2's claimed Wikipedia anchor cited "Claude Shannon" as appearing in the
  *Cognitive psychology* article — **"Shannon" does not appear there** (0 occurrences). The real
  claim-stating sentence is the Broadbent/information-theory one. Caught; corrected.
- **Wrong source existence:** A1's claimed "SEP, 'Émile Durkheim'" — **SEP has no Durkheim entry**
  ("Not Yet Available"). Re-grounded on IEP + Wikipedia.
- **Apocryphal quote:** A6's "set theory is a disease" Poincaré quote — its authenticity is itself
  questioned (Gray 1991, *Math. Intelligencer*, cited in SEP). **Deliberately not used**; re-grounded
  on the predicativist-critique anchors (identity-axis QC catch).
- **Anchor verbatim rate ≈ 0%** across the batch (paraphrases, not the live wording) — consistent with
  #29/#33. Every written edge's note carries the orchestrator's *own* verbatim-verified anchors.

## Per-candidate verdicts

### Bucket A — person-mediated (7)

- **A1 Comte→Durkheim `influenced` — SUPPORTED.** IEP *Émile Durkheim*: Comte & Spencer's "work had a
  formative influence on Durkheim"; "Durkheim appropriated elements of Comte's positivism". Wikipedia
  *Émile Durkheim*: "A fundamental influence on Durkheim's thought was the sociological positivism of
  Auguste Comte"; "Refining the positivism originally set forth by Auguste Comte". 2 publishers (IEP +
  Wikipedia). Tension note: Durkheim's method "sought to be free of the metaphysical positivism of
  Comte" — record-not-resolve. conf 0.9.
- **A2 Cantor→Hilbert `influenced` — SUPPORTED.** Wikipedia *David Hilbert*: "He adopted and defended
  Georg Cantor's set theory and transfinite numbers." Wikipedia *Georg Cantor*: "David Hilbert defended
  it from its critics by declaring, 'No one shall expel us from the paradise that Cantor has created'";
  the CH "was presented by David Hilbert as the first of his twenty-three open problems." SEP *Set
  Theory*: "Hilbert, who listed the CH as the first problem in his celebrated list." 3 articles / 2
  publishers. conf 0.95.
- **A3 Dedekind→Cantor `influenced` — NEI.** SEP *Dedekind's Contributions…* frames the relationship as
  "correspondence with Georg Cantor" and a shared "tradition… through Riemann, Dedekind himself, Weber,
  and Cantor", with parallel constructions of the reals (Dedekind cuts vs Cantor's Cauchy sequences,
  both 1872). Wikipedia *Georg Cantor* shows mutual exchange (a proof "originated with Dedekind, who
  also substantially simplified Cantor's original proof"; "Cantor failed to acknowledge Dedekind's
  contributions"). **No source states a dominant *directional* "Dedekind influenced Cantor"** — the
  documented relation is mutual correspondence. Honest abstain (mirrors #29 B1b direction-not-sourced).
  Not written.
- **A4 Frege→Boole `critiques` — NEI.** SEP *Frege* mentions Boole once: Frege "distinguished his 1879
  system from Boole's logic" (a contrast). Wikipedia *George Boole* complicates a pure critique — Boole's
  principle of wholistic reference "was later, and probably independently, adopted by Gottlob Frege."
  The `critiques` relation is **not cleanly claim-stated by ≥2 independent sources**; the live picture is
  a mixed distinguish/adopt/supersede, not a documented critique at our standard. Honest abstain. (Notable:
  a "famous" critique can land NEI when the live wording doesn't meet the ≥2-source critique bar.) Not written.
- **A5 Fisher→Pearson `critiques` — SUPPORTED.** MacTutor *Karl Pearson*: "Pearson had a long, bitter,
  and very public dispute with Fisher"; "Fisher … responded with a paper which criticised examples in
  the Cooperative Study." MacTutor *Ronald Fisher*: "the two had a long running dispute"; "he did not
  accept Pearson's criticism." 2 independent MacTutor articles. Tension note: mutual bitter dispute,
  Pearson initiated the 1917 criticism; this edge records the Fisher→Pearson direction (chi-square d.f.
  correction, MLE over method of moments); reverse is a separate un-asserted edge. conf 0.85.
- **A6 Poincaré→set-theory `critiques` — SUPPORTED.** SEP *Henri Poincaré*: his theses "are directed
  broadly against the founders of modern logic and set theory such as Cantor, Peano, Frege, Russell,
  Zermelo, and Hilbert." Wikipedia *Henri Poincaré*: "He strongly opposed Cantorian set theory,
  objecting to its use of impredicative definitions"; "in *La logique de l'infini*, Poincaré extended
  this criticism to Ernst Zermelo's axiomatization." 2 publishers (SEP + Wikipedia). The apocryphal
  "disease" quote excluded. conf 0.9.
- **A7 Darwin→evolutionary-psychology `influenced` — SUPPORTED (cross-domain, person→subfield).**
  Wikipedia *Evolutionary psychology*: "Evolutionary psychology has its historical roots in Charles
  Darwin's theory of natural selection"; Darwin "predicted that psychology would develop an evolutionary
  basis." Wikipedia *Charles Darwin*: *The Expression of the Emotions…* "was an early work of
  psychology" discussing "the evolution of human psychology." SEP *Evolutionary Psychology*: the field's
  mechanisms are "adaptations—products of natural selection." 3 articles / 2 publishers. conf 0.9.

### Bucket B — cross-domain concept/discipline level (3)

- **B1 evolutionary-biology→psychology `influenced` — SUPPORTED.** Wikipedia *Psychology*: functionalism
  (James/Dewey/Carr) "underlined the Darwinian idea of a behavior's usefulness." Wikipedia *History of
  psychology*: "The origins of comparative psychology can be traced to the work of Charles Darwin, whose
  theory of evolution suggested continuity between human and animal minds." 2 articles. Scope note: the
  influence is channeled through functionalism + comparative/evolutionary psychology, not a uniform
  field-wide influence (the narrow form is A7). conf 0.78.
- **B2 information-theory→cognitive-psychology `influenced` — SUPPORTED.** Wikipedia *Cognitive
  psychology*: "Donald Broadbent, integrating concepts from human performance research and the recently
  developed information theory, forged the way in this area." Wikipedia *Cognitive revolution*: early
  cognitive scientists "presented their work … at a meeting of the 'Special Interest Group in
  Information Theory' at the Massachusetts Institute of Technology." 2 articles. conf 0.85.
- **B3 genetics→evolutionary-biology `influenced` — SUPPORTED.** Wikipedia *Modern synthesis (20th
  century)*: "The synthesis combined the ideas of natural selection, Mendelian genetics, and population
  genetics"; this "ended the eclipse of Darwinism and supplanted a variety of non-Darwinian theories."
  Wikipedia *Gregor Mendel*: "The combination, in the 1930s and 1940s, of Mendelian genetics with
  Darwin's theory of natural selection resulted in the modern synthesis of evolutionary biology." Note:
  a two-way fusion; genetics recorded as the directional active ingredient. Datable historical event →
  `influenced` not `formalizes` (cf. the D2 constitutive probe). conf 0.8.

### Bucket C — disputed-stress (clause-6 best candidates) (2)

- **C1 Darwin→Mendel `influenced` — NEI.** Wikipedia *Gregor Mendel*: the only support is book ownership
  (Mendel's annotated *Origin*), which is weak evidence of intellectual influence; the dominant view is
  that Mendel's pea experiments (1856–63) were substantially independent. No dominant-affirming source →
  no clause-6 footing (which needs a dominant view *that the influence exists*). Calibrated abstain. Not written.
- **C2 Newton→Leibniz `influenced` — REJECT.** Wikipedia *Leibniz–Newton calculus controversy*: "The
  modern consensus is that the two men independently developed their ideas"; "the consensus is that
  Leibniz and Newton independently invented and described calculus." The "influence" is the discredited
  historical plagiarism accusation; the **dominant view denies the influence** → reject, not
  `disputed:true` (a discredited minority is not a live sourced minority). Not written.

### Bucket D — NEI probes (2)

- **D1 Weber→Durkheim `influenced` — NEI.** Wikipedia *Max Weber*: founding father of sociology
  "alongside … Émile Durkheim"; "His methodology was different from those of Émile Durkheim." Parallel
  founders in different national traditions; no source states Weber influenced Durkheim → parallel ≠
  influence. Correct abstain. Not written.
- **D2 probability-theory→statistics `influenced` — NEI (relation mismatch).** Wikipedia *Statistics*:
  "Inferences made using mathematical statistics employ the framework of probability theory." This is a
  **constitutive/formal** dependency (`formalizes`), not a historical `influenced` claim. Correct abstain
  (mirrors #29 A4 constitutive→NEI). Not written.

### Bucket E — rejection probes (2)

- **E1 Mendel→Darwin `influenced` — REJECT.** Wikipedia *Gregor Mendel*: "Charles Darwin was not aware
  of Mendel's paper" (rediscovered 1900, 18 years after Darwin's 1882 death). No causal path. Not written.
- **E2 Durkheim→Comte `influenced` — REJECT (anachronism).** Comte (d.1857) died the year before
  Durkheim (b.1858) — a later figure cannot influence an earlier one. Reverse of A1. Not written.

## Adversarial perspective-diverse QC (Stage 4) — what the lenses caught

- **direction/anachronism lens:** rejected E1, E2 (reversed/anachronistic), C2 (dominant view = no
  influence). Confirmed correct direction on A1 (Comte precedes Durkheim) vs E2, and Darwin precedence
  on A7/B1/B3.
- **referent/identity lens:** caught the apocryphal Poincaré "disease" quote (A6); confirmed all
  endpoints are the intended entities (no homonym confusion — e.g., the "T. Fisher Unwin" publisher
  string in the Pearson article is *not* the statistician).
- **caricature/parallel lens:** separated genuine influence from parallel development (D1 Weber‖Durkheim,
  A3 Dedekind↔Cantor mutual) and from constitutive dependency (D2). No straw-man critiques admitted.

## Measurement

| metric | value |
|---|---|
| candidates (N) | 16 (cumulative (a)-N = 13 + 16 = **29**) |
| supported (written proposed) | **8** |
| disputed (clause-6 `disputed:true`) | **0** |
| NEI-abstain (not written) | 5 (A3, A4, C1, D1, D2) |
| reject (not written) | 3 (C2, E1, E2) |
| claim-level hallucination | **0/16** |
| precision (supported) | **8/8 = 1.0** |
| rejection / abstention fired | **8×** (all correct) |
| person-mediated supported | 5 (A1, A2, A5, A6, A7) |
| concept/discipline supported | 3 (B1, B2, B3) |
| cross-domain supported | A7, B1, B2 (+ B3 within life-sci) |
| new sources | **0** (all four publishers already registered) |

## ★★ clause-6 disputed read-out (the wave's headline; CPO input per (56)#2)

**Even under active hunting for the *best* clause-6 candidates, `disputed:true` did not fire (0/16,
cumulative 0/29).** The two disputed-stress probes both resolved *away* from the flag:
- C1 (Darwin→Mendel): no dominant view *affirming* the influence → **NEI**.
- C2 (Newton→Leibniz): the dominant view *denies* the influence (independent invention) → **reject**.

This is the structural reason clause-6 keeps not firing: a `disputed:true` edge requires a **dominant
scholarly view that the influence/critique exists** *plus* a **live sourced minority** contesting it.
Real intellectual-history controversies do not present that shape — they are instead:
(a) **documented facts with a meta-debate** → *supported + tension note* (A1 partial-influence, A5 mutual
feud, B1/B3 fusion notes); (b) **the dominant view denies the claim** → *reject/NEI* (C2, C1, D1); or
(c) **genuinely unsettled with no dominant view** → *NEI* (A3, A4). The tension Noosphere preserves is
carried by **supported-edge notes + calibrated NEI/reject**, exactly as #29 found — now confirmed at
N=29 with person-mediated and cross-domain candidates and an explicit best-effort search.

## Provenance & permanence

8 edges `status: proposed`, `evidence_kind: externally_sourced`, `proposed_by` = Claude Sonnet /
claude-sonnet-4-6 / 2026-06-19 (generation); orchestrator (Opus) independent grounding recorded in each
note. No `disputed:true` edge. No node identity changed; 12-type taxonomy unchanged; schema unchanged.
SPN §8: Wayback Save-Page-Now bot-blocked (HTTP 000) → **[SPN-FAILED]** retry queue; **existing
snapshots verified** as the §8 substitute for the supported-edge URLs where available (IEP Durkheim
20241224, Wikipedia Hilbert 20241230, Wikipedia Evolutionary-psychology 20241227, MacTutor Pearson
20241215, Wikipedia Cognitive-revolution 20241229; SEP Poincaré had no existing snapshot →
[SPN-FAILED]). Verdicts rest on live HTTP-200 claim-stating fetches at QC time. typecheck + validate:data
green (459 nodes, 543 edges, 21 sources).
