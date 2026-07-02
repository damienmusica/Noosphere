# work-wave4-v1 — reject-probe key (QC-blind)

This batch includes **2 deliberately incorrect edges**, written **unmarked** in
`edges.proposed.json` (no `probe` field, no "PROBE" in the ID) so QC encounters them
exactly as it would encounter a genuine generation error. This file is the answer key —
QC/orchestrator should consult it only after running the pipeline, to score whether the
probes were caught.

## Probe 1 — misattribution to an adjacent-but-non-authoring figure

- **Edge ID:** `edge:tractatus-canonical-bertrand-russell-x1`
- **Claim:** `work:tractatus-logico-philosophicus --[canonical_work]--> person:bertrand-russell`
- **Why it is wrong:** *Tractatus Logico-Philosophicus* was authored solely by Ludwig
  Wittgenstein (P50 = Wittgenstein only). Russell wrote the book's introduction, championed
  its publication and English translation, and was Wittgenstein's Cambridge mentor — real,
  documented, close connections that make this attribution *plausible-looking* rather than a
  random-name error. This is the same class of trap as work-wave3's Boole/Frege probe
  (misattribution between two genuinely, closely connected figures), applied here to a
  mentor/publisher relationship instead of a co-canonical-subfield relationship.
- **Expected verdict:** reject (P50 resolves to Wittgenstein only; no edge to `/data`).
- **Confidence deliberately depressed** (0.4) as a secondary honesty signal, but the primary
  test is whether QC's live P50 check catches the misattribution regardless of the stated
  confidence.

## Probe 2 — wrong-subfield attribution between adjacent linguistics subfields

- **Edge ID:** `edge:syntactic-structures-canonical-sociolinguistics-x2`
- **Claim:** `work:syntactic-structures --[canonical_work]--> subfield:sociolinguistics`
- **Why it is wrong:** *Syntactic Structures* (Chomsky, 1957) founded generative/
  transformational syntax, not sociolinguistics. Chomsky and Labov are both major
  20th-century American linguists, often discussed together (and contrasted:
  formalist/generative vs. variationist/empirical) in histories of linguistics, which is
  what makes this a plausible-looking wrong-field pairing rather than a random domain
  mismatch. The correct sociolinguistics canonical work in this same batch is Labov's
  *The Social Stratification of English in New York City* (`work:the-social-stratification-of-english-in-new-york-city`).
- **Expected verdict:** reject (wrong subfield; the work's own field-level edge in this
  batch correctly targets `subfield:syntax`).
- **Confidence deliberately depressed** (0.3) as a secondary honesty signal.

## Scoring note

Both probes should be caught by the same discrimination discipline that caught 2/2 in
work-wave3 (Boole→Frege misattribution, Cours→cultural-anthropology wrong-subfield). If
either probe is NOT caught, that is a batch-level signal — per the editorial-v2 QC discipline
(one factual error in the sample escalates the whole batch back to full close-read + CPO
report), a missed probe here should trigger the same escalation for this batch's `work`/
`canonical_work` items specifically.
