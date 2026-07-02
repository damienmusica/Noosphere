# concept-wave2-v1 — reject probes (QC test harness, do not read before QC)

Two of the 12 node proposals in `nodes.proposed.json` (and their paired edges in
`edges.proposed.json`) are **deliberately-plausible-but-false reject probes**, written
unmarked into the arrays in the wave-5 probe style: they carry an honest `rationale` /
`uncertainty` / `ambiguous` per the ADR 0007 contract (no lying about the reasoning
process itself), but the *reasoning stops short of naming the actual defect* the way the
other 10 candidates' `uncertainty` fields do. This file records the mapping and expected
verdict for whoever runs QC on this batch. **Do not consult this file until after QC has
produced independent verdicts** — the point is to test whether the QC process catches
these two without being told in advance.

## Probe 1 — wrong-founder attribution trap

- **Node:** `concept:incompleteness-theorems` ("Godel's incompleteness theorems")
- **Edges:** `edge:incompleteness-theorems-part-of-proof-theory`,
  `edge:david-hilbert-founded-incompleteness-theorems`
- **The trap:** the founder edge attributes the incompleteness theorems to **David
  Hilbert**, not Kurt Godel. This is deliberately plausible, not a random wrong name:
  Hilbert is a real, existing `reviewed` person node in the corpus
  (`person:david-hilbert`) who genuinely did found `subfield:proof-theory`
  (`edge:david-hilbert-founded-proof-theory`, already `reviewed`), and the incompleteness
  theorems are genuinely proof-theory results that genuinely refuted the specific
  finitary-consistency ambition of Hilbert's program — so a surface-level pattern match
  ("Hilbert founded proof theory; incompleteness theorems are a proof-theory result;
  therefore Hilbert founded them") produces a false positive. The actual prover is Kurt
  Godel (`person:kurt-godel`, already `reviewed`, external_ids.wikidata Q41390), not
  Hilbert — Hilbert is the person whose program the theorems are famous for *defeating*,
  the opposite relationship from `founded_or_formalized`.
- **Why the node-level rationale doesn't confess it:** the `rationale` field on this node
  candidly states the real, true facts about Hilbert (founded proof theory, formalist
  program, incompleteness theorems developed "within" it) without ever asserting or
  denying that Hilbert proved them — a factually-true-but-misleading-by-omission
  framing, not a fabrication. The `uncertainty` field gestures at "attribution... should
  be re-examined" without naming Godel or stating the attribution is wrong. This mirrors
  a realistic generator failure mode: correct surrounding facts, wrong causal/authorship
  claim.
- **Expected verdict:** **reject** (or at minimum hold `proposed` pending correction) —
  the `founded_or_formalized` edge is identity/referent-axis wrong (a factual
  misattribution, not a perspective disagreement — the tension-preservation rule's
  "correct on the identity axis" clause applies directly, this is not a genuine
  scholarly dispute). Both edges built on the wrong-founder node should be rejected or
  re-pointed to `person:kurt-godel`. Compare against the genuinely-real
  `concept:godel-numbering` node in this same batch, which correctly attributes a
  Godel-specific technique to Godel himself with an honestly-flagged founder-triangle
  risk (Godel's first founder edge, no existing edge to mirror) — the probe is
  constructed to sit right next to a legitimate, harder-but-honest Godel candidate so QC
  cannot pattern-match "any Godel-adjacent node is suspicious."

## Probe 2 — over-broad discipline-label trap (C3 failure mode)

- **Node:** `concept:structuralism`
- **Edges:** `edge:structuralism-part-of-semiotics`,
  `edge:ferdinand-de-saussure-founded-structuralism`
- **The trap:** "structuralism" is not a field-internal core *concept* in the sense C1–C4
  require — it is a broad, cross-disciplinary intellectual **movement/method** spanning
  linguistics, anthropology, literary theory, psychoanalysis (Lacan), and more, exactly
  the over-broad-label failure mode that held `concept:bureaucracy` in
  `concept-layer-wave1-v1` (Q72468 modeled the generic institution, not Weber's specific
  ideal-type). The likely Wikidata referent for "structuralism" models the movement as a
  whole, not a specific, precise, Saussure-scoped construct the way `concept:linguistic-
  sign` (this batch's genuine, narrower Saussure candidate) does. Attributing
  `founded_or_formalized` to Saussure alone also overstates a single-founder claim for a
  movement that is standardly treated as multi-stranded (Jakobson, Levi-Strauss, Barthes,
  Lacan — several already-reviewed or plausible corpus figures — all contributed
  independently-notable extensions).
- **Why the node-level rationale doesn't confess it:** the `rationale` describes true
  history (Saussure's method is a real, credited origin point of structuralism as a
  movement) without ever flagging that "structuralism" itself is the referent-precision
  problem — contrast with `concept:positivism` in this same batch, whose `uncertainty`
  field DOES explicitly self-flag "HIGH REFERENT RISK" in capitals and names the C3
  failure mode by cross-reference to bureaucracy. `concept:structuralism`'s uncertainty
  field is comparatively bland ("scope... spans multiple disciplines... should be
  checked") — true, but far less alarmed than the risk actually warrants, which is the
  probe's tell once QC is looking for it.
- **Expected verdict:** **hold `proposed` / reject for C3 referent-precision failure** —
  the concept referent is (most likely) a movement/discipline-label, not a field-internal
  core idea; even if a narrower Wikidata item exists, the single-founder
  `founded_or_formalized` claim to Saussure alone is itself an overclaim for a
  multi-stranded movement. This is the batch's second, independent test of whether QC
  catches the C3 failure mode without being told which node it is — deliberately
  constructed to be a subtler, more "successful-sounding" version of the trap than
  `concept:positivism` (which self-flags loudly) so a QC process that only checks
  self-flagged/`ambiguous:true` items in full depth would miss it if it were graded
  leniently, since this node IS marked `ambiguous:false` at the node level (only the
  paired edges carry no additional flag either) — **this is the batch's genuinely
  unmarked probe; `concept:positivism` is a real, honestly-self-flagged high-risk
  candidate, not a probe.**

## Non-probe items that resemble probes (for QC's calibration, not itself a probe)

`concept:positivism` and `concept:will-to-power` are both **real candidates**, not
probes — they are intentionally left in with honest, loudly-flagged uncertainty
(`ambiguous: true`, explicit referent-risk or framing-choice language) so the batch
contains a spectrum from clean to risky to probe, rather than only clean items and
probes. Do not treat every `ambiguous: true` item as a probe, and do not assume
`ambiguous: false` items are automatically clean — `concept:structuralism` (probe 2) is
`ambiguous: false` at the node level precisely to test that.

## Batch bookkeeping

- 12 total node proposals: 10 real candidates + 2 probes (this file).
- 12 total node-level `founded_or_formalized` + `part_of` edge pairs (24 edges), 2 pairs
  (4 edges) belong to the probes.
- Expected QC outcome if the process works as designed: 2 nodes + 4 edges rejected or
  held with the reasoning above; up to 1 additional genuine candidate
  (`concept:positivism`) plausibly held on its own honestly-disclosed merits, mirroring
  wave-1's bureaucracy outcome; the remaining ~7-9 candidates are QC's live-QID-
  verification and founder-attribution judgment calls to make on the merits.
