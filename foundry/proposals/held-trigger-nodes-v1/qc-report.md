# QC report — `held-trigger-nodes-v1`

Session #60, Track B. Generation: separated-context **Claude Sonnet 5** (`proposal-generator`),
edges only. QC / identity / verdicts: orchestrator (**Claude Opus**), live sources.
Decision file: `foundry/decisions/held-trigger-nodes-v1.json` (the authoritative record).

## Outcome

- **6 edges proposed** by the generator; **2 rejection probes** planted in the order were declined
  by the generator before QC saw them, and both declines were confirmed live.
- **QC overturned the target of 4 of the 6 proposals.** 5 edges written `reviewed`, 3 pre-existing
  held edges deprecated, 1 hold kept with a corrected blocking condition.
- `fetch-verify` over the decision file: **PASS 25/25 · MISS 0 · UNVERIFIED 0**, every quote checked
  against the §8 anchor recorded for it (not against the live page).

## Contract-v2 leak — redaction record

`validate-data`'s provider-ID string scan flagged `edges.proposed.json $.notes[2]`, which asserted
compliance with the no-provider-identifier rule *by naming the forbidden provider domains verbatim*.
The scan is deliberately blunt and was right to fire. Orchestrator redacted the note in place,
preserving its meaning; no identifier was ever used in any item field. This is the second recorded
instance of the check firing in production (first: `weber-referent-precision-v1`, decision (108)).

The generator's `report.md` could not be written — the harness blocks subagent `.md` writes — so its
per-pair reasoning trace was returned in its final message and is preserved in the decision file's
verdict notes rather than lost.

## §8 permanence anchors

All 19 anchors are publisher-run immutable editions: 16 MediaWiki revision permalinks and 3 SEP
fixed editions (`archives/sum2026/`). No Wayback snapshot was required and none is pending.
SPN was correctly not attempted for SEP (§8, amendment 2026-07-29).

| Source read | Anchor |
|---|---|
| en.wikipedia.org/wiki/Franz_Brentano | `…&oldid=1352550060` |
| en.wikipedia.org/wiki/Intentionality | `…&oldid=1355666928` |
| en.wikipedia.org/wiki/Edmund_Husserl | `…&oldid=1365533587` |
| en.wikipedia.org/wiki/Symbolic_artificial_intelligence | `…&oldid=1360607279` |
| en.wikipedia.org/wiki/Logic_Theorist | `…&oldid=1366443812` |
| en.wikipedia.org/wiki/Allen_Newell | `…&oldid=1343727464` |
| en.wikipedia.org/wiki/Herbert_A._Simon | `…&oldid=1361323308` |
| en.wikipedia.org/wiki/Type_theory | `…&oldid=1365858283` |
| en.wikipedia.org/wiki/Thermodynamics | `…&oldid=1362668588` |
| en.wikipedia.org/wiki/History_of_thermodynamics | `…&oldid=1348030733` |
| en.wikipedia.org/wiki/Thermochemistry | `…&oldid=1353863068` |
| plato.stanford.edu/entries/brentano/ | `archives/sum2026/entries/brentano/` |
| plato.stanford.edu/entries/intentionality/ | `archives/sum2026/entries/intentionality/` |
| plato.stanford.edu/entries/type-theory/ | `archives/sum2026/entries/type-theory/` |
| wikidata.org Q11473 / Q1056428 / Q57196 / Q439245 / Q181529 | revision permalinks, identity reads |

## What QC changed, and why

**1. The symbolic-AI founder cluster collapsed at its grain.** The generator proposed Newell, Simon
and McCarthy as founders of `concept:symbolic-ai`, and flagged in its own report that all four
symbolic-AI founder claims (including the pre-existing held Minsky edge) "trace back to a single
piece of internal provenance … itself an unverified prior-generation claim, not a live source."
That flag was correct. No live source states a symbolic-AI founding for anyone. What the sources
state is at the **artificial-intelligence** grain, where McCarthy and Minsky already hold reviewed
founder edges. Outcome: Newell and Simon written there; McCarthy's proposal rejected as a duplicate;
Minsky's held symbolic-AI edge deprecated as a wrong-grain duplicate.

**2. The Husserl co-founder resolution was refuted.** The hold anticipated that adding Brentano
would turn a single-founder attribution into a co-founder pair. The sources say otherwise —
enwiki Husserl: "Another important element that Husserl took over from Brentano was intentionality."
Outcome: founder edge written on Brentano alone; Husserl's edge deprecated; his actual relation
recorded as `franz-brentano → influenced → edmund-husserl`.

**3. Russell's relation was upgraded, not just retargeted.** SEP states "The theory of types was
introduced by Russell" — origination, not influence. Outcome: `founded_or_formalized` to
`subfield:type-theory`, replacing the deprecated diffuse `influenced → field:computer-science`.
This also settled the generator's single highest-priority open question (which referent
`subfield:type-theory` names): the discipline spanning mathematical logic and theoretical CS,
which is why it is §13 cross-listed to both.

**4. ★ The Lavoisier hold's recorded trigger was itself wrong.** The hold said a thermodynamics-grained
target would be accurate. enwiki Thermodynamics does not mention Lavoisier at all; History of
thermodynamics routes his calorimetry to *thermochemistry*; and thermochemistry's only foundation
sentence carries an inline `[citation needed]` and is about Black. Verdict NEI at all three grains.
The hold stays, with the refuted trigger retired and a stricter unblock condition recorded.
`subfield:thermodynamics` is kept anyway — on the §12 dual criterion, as a genuine gap in the physics
skeleton, not on this edge demand.

## Rejection probes

| Probe | Generator | QC |
|---|---|---|
| Minsky ↔ type theory | declined — "no known connection to formal type theory" | confirmed: no source in corpus |
| Simon ↔ thermodynamics | declined — entropy language is "metaphorical borrowing" | confirmed: no source in corpus |

Both fired correctly, at generation time rather than at QC time.
