# a-relations-wave5-v1 — rejection probe key

Orchestrator: open this file only after QC verdicts are recorded for all 18 candidates in
`proposals.json`, per the order for batch `a-relations-wave5-v1`.

The 2 deliberately-plausible-but-false candidates, written unmarked into `proposals.json`
(each carries a `note` field starting `REJECTION PROBE (unmarked in this array; see probes.md)`
which is itself part of the honest self-flagging contract but does not name this file to a
naive reader scanning the array — the mapping lives here):

- **C17** — `person:georges-cuvier` → `subfield:philosophy-of-race` (`influenced`). Thematic-
  proximity / inverted-lineage probe: a real historical race-scientist (Cuvier) paired with the
  real philosophical subfield about race, without the documented lineage — SEP's philosophy-of-race
  entry traces the subfield's formative influences to *critics* of race science (Boas, Du Bois,
  Appiah), not to the classifiers themselves. Deliberately mirrors the legitimate C15
  (`franz-boas` → `subfield:philosophy-of-race`) as its inverted twin: same target, opposite and
  unsupported causal direction. Expected verdict: reject (or, at most, a heavily caveated
  `critiques`-as-object framing, not `influenced` as drafted).
- **C18** — `person:robert-koch` → `field:law` (`influenced`). Misattribution/anachronism probe:
  real figure (Koch) + real scientific discovery (germ theory) later drawn on by unrelated third
  parties (jurists, legislators) in public-health law, misattributed as Koch himself influencing
  the field of law. Koch made no legal-theoretical contribution; no source documents him engaging
  with jurisprudence. Structurally mirrors the wave4 B17 (`darwin` → `field:law` via Social
  Darwinism) pattern on a fresh anchor. Expected verdict: reject.

Both probes follow the wave3/wave4 pattern (a real biographical/historical anchor + a real-but-
irrelevant, misapplied, or inverted secondary fact, engineered to be superficially checkable
without being historically supported). If QC's live-source pass surfaces anything that genuinely
rescues either edge, treat that as new information overriding this probe's prior — the point of
the probe is testing the QC process, not pre-committing the verdict.
