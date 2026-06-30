# QC report — `structural-nodes-v1`

**Orchestrator (separate context, ADR 0007).** Session #40, 2026-06-30. Network local (Wikidata 200).
**Pipeline:** Sonnet generation → orchestrator live multi-signal QID resolver QC → ≥2 independent
live claim-stating sources + adversarial QC → founder ladder (decision (61)) / (a)-ladder (decision (68)).

## 1. QID resolver verification (multi-signal)

Generator QID hints were **2/2 hallucinated** (consistent with the ~75–85% prior-wave rate). Both
caught and corrected by live Wikidata lookup:

| Node | Generator hint | What the hint actually is | Corrected QID | Multi-signal check |
|---|---|---|---|---|
| `person:roman-jakobson` | Q190412 | "Central Administrative Okrug" (Moscow administrative okrug) | **Q156201** | P31=Q5 (human) ✓; P569 1896 ✓; **P570 1982-07-18** (deceased) ✓; occupation linguist ✓; enwiki "Roman Jakobson" ✓ |
| `subfield:structural-anthropology` | Q860487 | "Tirtamulya" (district in Karawang Regency, Indonesia) | **Q5111399** | P31=Q106720965 "branch of anthropology / subdiscipline of anthropology"; P1269 facet-of Q23404 anthropology; enwiki "Structural anthropology" ✓ |

## 2. Node dispositions

### `person:roman-jakobson` → **reviewed**
Node policy v1 (decision (58)): QID resolver-verified + `is_living_person` live-confirmed-false
(P570 = 1982-07-18) → auto-`reviewed`. Domain `humanities` (linguistics; matches `field:linguistics`
and the `person:william-labov` precedent). `academic_status` omitted per person contract v1.
`indexable: false` (no summary — same earned rule as every node).

### `subfield:structural-anthropology` → **proposed** (held, not auto-blessed)
The generator self-flagged `ambiguous: true` on a genuine modeling question, and live verification
confirmed the ambiguity is real:
- **Toward subfield (peer of cultural-/physical-anthropology):** Wikidata types it as a "branch of
  anthropology" (P31 = Q106720965, *subdiscipline of anthropology*); it has standalone encyclopedia
  standing (Wikipedia/Britannica/SEP-adjacent); and the corpus already admits named schools/traditions
  as subfields (phenomenology, existentialism, pragmatism, critical-theory).
- **Toward absorption into cultural-anthropology (§12 rule 2, german-idealism precedent):** Wikipedia's
  lead defines it as "a **school** of sociocultural anthropology based on Claude Lévi-Strauss' 1949
  idea" — i.e. a Lévi-Strauss-centric, largely period-bound approach that many describe as having
  dissolved into broader structuralism/post-structuralism. No "departments of structural anthropology";
  fails the strict dual-criterion (own classification division + department standing).
- **Disposition:** This is exactly the parked **movement-axis** question (roadmap: "movement 축 일괄
  설계"). The orchestrator does **not** unilaterally resolve a parked design question. The node is
  admitted as a `proposed` subfield (real, QID-verified) and **routed to the CPO movement-axis ruling**
  (session #40 draft `reference/person-wave5-scope-and-movement-axis-gate.md` Part B). Promote to
  `reviewed` (subfield) or absorb into cultural-anthropology per that ruling.

## 3. Edge dispositions

| Edge | Relation | Verdict | Status | Basis |
|---|---|---|---|---|
| `roman-jakobson → subfield:phonology` | founded_or_formalized | supported | **reviewed** | Founder ladder (61): both endpoints reviewed (Jakobson now reviewed, phonology reviewed) + ≥2 independent live claim-stating sources + correct direction + identity verified. Trubetzkoy = equal co-founder → record-not-resolve note (NOT disputed). |
| `roman-jakobson → person:claude-levi-strauss` | influenced | supported | **reviewed** | (a)-ladder (68): both endpoints reviewed + ≥2 independent directional sources (New School 1942) + identity verified. Not disputed (existence + direction agreed). |
| `claude-levi-strauss → subfield:structural-anthropology` | founded_or_formalized | supported (claim) | **proposed** | Founding attribution sound, but target node is `proposed` → founder-ladder clause ① (both endpoints reviewed) fails → correctly held at proposed. Rides the structural-anthropology CPO ruling. |
| `roman-jakobson → subfield:semiotics` | influenced | NEI-leaning | **proposed** | Diffuse, partly bidirectional (Jakobson drew *from* Peirce's semiotics as much as he shaped the field); single-source, lower confidence (0.78); does not clearly meet the supported bar. Re-examine with stronger directional grounding. |

## 4. Source grounding (≥2 independent live claim-stating)

- **jakobson→phonology:** (1) Wikipedia *Roman Jakobson*: "With Nikolai Trubetzkoy, he developed
  revolutionary new techniques for the analysis of linguistic sound systems, in effect founding the
  modern discipline of phonology." (2) Independent linguistics literature: distinctive-feature theory
  / structural phonology attributed to Trubetzkoy and Jakobson, 1939 (Prague Circle; *Grundzüge der
  Phonologie*; Jakobson–Fant–Halle distinctive features) — PMC / BLS proceedings; SEP *Wilhelm von
  Humboldt* refers to "Trubetzkoy's and Jakobson's conception of phonology."
- **jakobson→levi-strauss:** (1) Wikipedia *Roman Jakobson*: "Through his decisive influence on
  Claude Lévi-Strauss … Jakobson became a pivotal figure in the adaptation of structural analysis to
  disciplines beyond linguistics, including … anthropology." (2) Independent structuralism literature
  (Cambridge excerpt / ResearchGate / Taylor & Francis): the New School / École Libre meeting in 1942;
  "Jakobson introduced him to the methods of structural linguistics, which he would go on to apply in
  his pioneering work on kinship structures." Completes the Saussure→Jakobson→Lévi-Strauss mediation
  chain already noted on `edge:ferdinand-de-saussure-influenced-claude-levi-strauss`.

Britannica (the natural second encyclopedia for both) was HTTP 403 (bot-blocked); Wayback was
unreachable from this environment — recorded as a tooling limitation, not a grounding gap, since
≥2 independent live sources were obtained by other means for each promoted edge.

## 5. Counts
Nodes 472→474 · edges 559→563 · translations 472→474 · sources 21 (unchanged). typecheck ✓ validate ✓.
Promoted to `reviewed`: 1 node + 2 edges. Held at `proposed`: 1 node + 2 edges (routed to CPO ruling).
