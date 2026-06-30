# QC report — `logical-positivism-v1`

**Orchestrator (separate context, ADR 0007).** Session #41, 2026-07-01. Network local (Wikidata 200).
First build under the §12 **movement/school rule** (rule 5, decision (73)): a bounded doctrine →
`concept` node; its founding figures → `person` nodes.

## 1. QID resolver verification — generated hints 5/5 hallucinated (100%)

| Node | Generator hint | What the hint actually is | Corrected QID | Signal |
|---|---|---|---|---|
| `concept:logical-positivism` | Q167980 | **transpiration** | **Q193627** | P31 Q2915955 "philosophical movement" ✓ (concept, no P570) |
| `person:moritz-schlick` | Q57095 | **Emanuel Lasker** (chess champion) | **Q57193** | P31=Q5, P570 1936-06-22 ✓ |
| `person:rudolf-carnap` | Q58050 | invalid / missing | **Q76519** | P31=Q5, P570 1970-09-14 ✓ |
| `person:otto-neurath` | Q78698 | **Elfi Eder** | **Q78570** | P31=Q5, P570 1945-12-22 ✓ |
| `person:ludwig-wittgenstein` | Q9358 | **Friedrich Nietzsche** | **Q9391** | P31=Q5, P570 1951-04-29 ✓ |

All four persons deceased → clean founder/(a)-ladder, no living-person handling needed. The `concept`
node rides the rule-5 concept ruling (QID-verified "philosophical movement").

## 2. Edge dispositions

| Edge | Relation | Verdict | Status |
|---|---|---|---|
| logical-positivism → analytic-philosophy | part_of | structural, both endpoints reviewed | **reviewed** |
| schlick → logical-positivism | founded_or_formalized | supported (founder ladder) | **reviewed** |
| carnap → logical-positivism | founded_or_formalized | supported (founder ladder) | **reviewed** |
| neurath → logical-positivism | founded_or_formalized | supported (founder ladder) | **reviewed** |
| wittgenstein → logical-positivism | influenced | **clause-6 supported + note** ((a)-ladder) | **reviewed** |
| wittgenstein → philosophy-of-language | founded_or_formalized | ambiguous (multiple founders) | **proposed** |

## 3. Clause-6 adjudication — wittgenstein → logical-positivism
Existence of influence is **uncontested** (Tractatus shaped the Circle via Waismann/Schlick); what
differs is **character** — Wittgenstein was not a member and diverged on the verifiability criterion,
and rejected the positivist reading of the Tractatus. Per clause-6 v2 (existence-agreed /
character-debated) this is **supported + record-not-resolve note, NOT `disputed:true`** — no camp
denies the influence existed. Over-fire guard holds.

## 4. Sources (≥2 independent live claim-stating)
- SEP **'Vienna Circle'** (source:sep): Schlick "(nominal) leadership"; Carnap "philosopher and
  logician" member; Neurath "the social scientist" member; the movement = "logical empiricism (or
  logical positivism or neopositivism)"; Wittgenstein influence via "Waismann's reports of
  Wittgenstein's meetings with him and Schlick" + "Wittgenstein's criterion required conclusive
  verifiability which Carnap's did not."
- **Wikipedia** (source:wikipedia): corroborates each founder + the Tractatus→Circle influence.

## 5. Held / deferred
- **`person:ludwig-wittgenstein → founded_or_formalized → philosophy-of-language`** → `proposed`:
  multiple strong founders (Frege most often credited; Russell, Austin) → no clean ≥2-source sole-
  founder attribution; re-examine with a multi-founder framing.
- **`institution:vienna-circle`** → NOT built: the 12-relation taxonomy has no membership relation
  (no `member_of` / found-a-group). The Circle is fully represented by its members (Schlick/Carnap/
  Neurath nodes) + the doctrine (`concept:logical-positivism`). Building it as a node would need a
  `member_of` relation decision (taxonomy + schema + validation change) — flagged to the CPO,
  non-blocking. Recorded here rather than forced with a hacky edge.

## 6. Counts
Nodes 474→479 · edges 563→569 · translations →479 · sources 21. typecheck ✓ validate ✓.
Promoted reviewed: 5 nodes + 5 edges. Held proposed: 1 edge. Generated QID hallucination 5/5; claim
hallucination 0 (SEP/Wikipedia ground every promoted edge).
