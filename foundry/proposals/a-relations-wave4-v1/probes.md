# a-relations-wave4-v1 — rejection probe key

Orchestrator: open this file only after QC verdicts are recorded for all 18 candidates in
`proposals.json`, per the order for batch `a-relations-wave4-v1`.

The 2 deliberately-plausible-but-false candidates, written unmarked into `proposals.json`
(each carries a `note` field starting `REJECTION PROBE (unmarked in this array; see probes.md)`
which is itself part of the honest self-flagging contract but does not name this file to a
naive reader scanning the array — the mapping lives here):

- **B17** — `person:charles-darwin` → `field:law` (`influenced`). Misattribution/anachronism
  probe: real figure (Darwin) + real but contested/mediated intermediate movement (Social
  Darwinism) used to construct an unsupported direct causal claim onto a field (law) Darwin
  never engaged with. Expected verdict: reject.
- **B18** — `person:georg-cantor` → `subfield:psychoanalysis` (`influenced`). Construct-without-
  documented-causal-chain probe: two real contemporaneous figures (Cantor, Freud) linked via
  thematic proximity (mental illness, the infinite/unconscious) rather than any documented
  historical influence; psychoanalysis's origin is independently and thoroughly documented
  (Charcot/Breuer/clinical psychiatry), not mathematics. Expected verdict: reject.

Both probes mirror the wave3 pattern (A17 Newton→economics, A18 Wundt→AI): a real biographical
anchor + a real-but-irrelevant or misapplied secondary fact, engineered to be superficially
checkable without being historically supported. If QC's live-source pass surfaces anything that
genuinely rescues either edge, treat that as new information overriding this probe's prior —
the point of the probe is testing the QC process, not pre-committing the verdict.
