# work-wave5-v1 — reject-probe key (QC-blind)

This batch includes **2 deliberately incorrect edges**, written **unmarked** in
`edges.proposed.json` (no `probe` field, no "PROBE" in the ID) so QC encounters them
exactly as it would encounter a genuine generation error. This file is the answer key —
QC/orchestrator should consult it only after running the pipeline, to score whether the
probes were caught.

## Probe 1 — misattribution to a genuinely adjacent same-subfield co-founder

- **Edge ID:** `edge:theory-of-games-canonical-john-nash-x1`
- **Claim:** `work:theory-of-games-and-economic-behavior --[canonical_work]--> person:john-nash`
- **Why it is wrong:** *Theory of Games and Economic Behavior* (1944) was authored solely
  by John von Neumann and Oskar Morgenstern (P50 resolves to those two only). John Nash
  did not co-author it — his foundational contribution (the Nash equilibrium) came in his
  own single-authored 1950/1951 papers, roughly six to seven years later. Nash is,
  however, a real, closely-connected figure: he is also a `reviewed` founder of
  `subfield:game-theory` in `/data` (`edge:john-nash-founded-game-theory`), which is
  exactly what makes this attribution *plausible-looking* rather than a random-name
  error. This is the same trap class as work-wave4's Tractatus→Russell probe
  (misattribution to a genuinely adjacent figure), applied here to a same-subfield
  co-founder relationship instead of a mentor/publisher one.
- **Expected verdict:** reject (P50 resolves to von Neumann + Morgenstern only; no edge
  to `/data`).
- **Confidence deliberately depressed** (0.4) as a secondary honesty signal, but the
  primary test is whether QC's live P50 check catches the misattribution regardless of
  the stated confidence.

## Probe 2 — canonical-subfield vs. adjacent already-recorded influence relation

- **Edge ID:** `edge:on-formally-undecidable-canonical-philosophy-of-mathematics-x2`
- **Claim:** `work:on-formally-undecidable-propositions --[canonical_work]--> subfield:philosophy-of-mathematics`
- **Why it is wrong:** Gödel's 1931 incompleteness paper is a mathematical-logic proof;
  its canonical disciplinary home is `subfield:mathematical-logic` (this batch's own
  correctly-targeted field-level edge, `edge:on-formally-undecidable-canonical-mathematical-logic`).
  `person:kurt-godel` does carry a genuine, already-`reviewed` **`influenced`** edge to
  `subfield:philosophy-of-mathematics` in `/data` (`edge:kurt-godel-influenced-philosophy-of-mathematics`)
  — the theorem's reception reshaped debates on formalism/Platonism. That real, correctly-typed
  edge is exactly what makes retargeting the **`canonical_work`** relation itself to the same
  subfield a plausible-looking trap: it launders a genuine but differently-typed relationship
  (influence on a field's debates) into a false claim (this is where the work canonically
  belongs). This is subtler than a purely random wrong-field pairing — it tests relation-type
  discipline, not just subfield discrimination (a variant of work-wave4's
  Syntactic-Structures→sociolinguistics wrong-subfield probe, one level more adversarial).
- **Expected verdict:** reject (wrong relation-type-to-subfield conflation; the work's own
  field-level edge in this batch correctly targets `subfield:mathematical-logic`, and the
  genuine `influenced` edge to `philosophy-of-mathematics` already exists in `/data` under
  its correct relation type).
- **Confidence deliberately depressed** (0.35) as a secondary honesty signal.

## Scoring note

Both probes should be caught by the same discrimination discipline that caught 2/2 in
work-wave3 and 2/2 in work-wave4. If either probe is NOT caught, that is a batch-level
signal — per the editorial-v2 QC discipline (one factual error in the sample escalates
the whole batch back to full close-read + CPO report), a missed probe here should trigger
the same escalation for this batch's `work`/`canonical_work` items specifically.
