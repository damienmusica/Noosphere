# Promotion report — `logical-positivism-v1`

Session #41, 2026-07-01. First build under §12 rule 5 (movement/school rule, decision (73)).

## Written `reviewed` (5 nodes + 5 edges)
- `concept:logical-positivism` (Q193627) — rule-5 `concept` (bounded doctrine/movement).
- `person:moritz-schlick` (Q57193, d.1936), `person:rudolf-carnap` (Q76519, d.1970),
  `person:otto-neurath` (Q78570, d.1945), `person:ludwig-wittgenstein` (Q9391, d.1951) — node policy v1.
- `edge:logical-positivism-part-of-analytic-philosophy` (part_of).
- `edge:moritz-schlick-founded-logical-positivism`, `edge:rudolf-carnap-founded-logical-positivism`,
  `edge:otto-neurath-founded-logical-positivism` (founder ladder; record-not-resolve co-founding).
- `edge:ludwig-wittgenstein-influenced-logical-positivism` ((a)-ladder; clause-6 supported+note;
  not disputed).

## Written `proposed` (held)
- `edge:ludwig-wittgenstein-founded-philosophy-of-language` — multiple founders (Frege/Russell);
  re-examine with multi-founder framing.

## Not built (flagged)
- `institution:vienna-circle` — relation taxonomy lacks a membership relation; the group is
  represented by its members + the doctrine. Needs a `member_of` decision (non-blocking).

## Invariants
Schema unchanged. 0 new sources. In-place append, 0 reformat. Living-person endpoints: 0 (all four
philosophers deceased). One `influenced` edge carries a clause-6 record-not-resolve note; no
`disputed:true` introduced. typecheck ✓ validate ✓.
