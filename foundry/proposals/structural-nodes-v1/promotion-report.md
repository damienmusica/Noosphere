# Promotion report — `structural-nodes-v1`

Session #40, 2026-06-30. What entered `/data` and under which policy.

## Written `reviewed`
- **`person:roman-jakobson`** (Q156201) — node policy v1 (decision (58)): QID resolver-verified,
  `is_living_person` live-confirmed-false (P570 1982-07-18). `indexable: false`.
- **`edge:roman-jakobson-founded-phonology`** (`founded_or_formalized`) — founder ladder (decision
  (61)): both endpoints reviewed + supported (≥2 independent live sources) + correct direction +
  identity verified. Trubetzkoy co-founder = record-not-resolve note.
- **`edge:roman-jakobson-influenced-claude-levi-strauss`** (`influenced`) — (a)-ladder (decision
  (68)): both endpoints reviewed + supported (directional, ≥2 independent live sources). Not disputed.

## Written `proposed` (held — routed to CPO / re-examination)
- **`subfield:structural-anthropology`** (Q5111399) — genuine subfield-vs-absorb modeling contest;
  routed to the CPO **movement-axis ruling** (`reference/person-wave5-scope-and-movement-axis-gate.md`
  Part B). Not auto-blessed `reviewed`.
- **`edge:claude-levi-strauss-founded-structural-anthropology`** (`founded_or_formalized`) — founding
  attribution sound; held because its target node is `proposed` (founder-ladder clause ① held).
  Promotes automatically when/if the CPO ruling makes `structural-anthropology` reviewed.
- **`edge:roman-jakobson-influenced-semiotics`** (`influenced`) — diffuse / direction-ambiguous;
  below the supported bar. Re-examine with stronger directional grounding.

## Invariants
Schema unchanged. 0 new sources. In-place append, 0 reformat. Living-person endpoints: 0 (Jakobson
deceased; Lévi-Strauss deceased). No `disputed:true` introduced. typecheck ✓ validate ✓.

## Follow-up — session #40 decision (73) (same day)
The CPO ratified the §12 movement-axis rule (option (a)). Under structural rule 5,
**`subfield:structural-anthropology` was promoted `proposed → reviewed`** (Wikidata "branch of
anthropology" → standing area, not a bounded school), and the held founder edge
**`edge:claude-levi-strauss-founded-structural-anthropology` promoted `proposed → reviewed`** via the
founder ladder (both endpoints now reviewed + supported). The other two pending cases
(logical-positivism → `concept`, Vienna Circle → `institution`) are ratified-typed but built with
their Vienna Circle figure wave (edge-demand), not as orphan stubs. See vault
`reference/movement-axis-design.md` and `docs/data-foundry.md` §12 rule 5.
