# QC report — `person-wave5-v1`

**Orchestrator (separate context, ADR 0007).** Session #42, 2026-07-01. Network local (Wikidata 200).
The CPO-ratified volume slate of founders anchored to existing reviewed fields. Living founders ride
living-person handling v2 (decision (70)); deceased ride node policy v1 + the founder ladder.

## 1. QID resolver verification — generated hints 15/16 hallucinated (94%)

Only **Chomsky Q9049** was correct. All others corrected by live multi-signal lookup (P31=Q5 + P569/
P570 + label/sitelink for persons; P31 for concepts):

| Node | hint → what it was | corrected | status |
|---|---|---|---|
| noam-chomsky | Q9049 ✓ | Q9049 | living (b.1928, P570 absent) |
| donald-knuth | Q42887 = Pope Clement I | **Q17457** | living (b.1938) |
| david-deutsch | Q270768 = a French commune | **Q543682** | living |
| whitfield-diffie | Q298547 = Mukesh Ambani | **Q462089** | living (b.1944) |
| martin-hellman | Q314958 = a German railway line | **Q476466** | living (b.1945) |
| stephen-cook | Q334240 = a Canadian abbey | **Q62870** | living |
| michael-gazzaniga | Q1928898 = Michael Pietsch | **Q738789** | living |
| luciano-floridi | Q1392534 = "bicycle theft" | **Q214119** | living (b.1964) |
| leda-cosmides | Q453347 = a Scientologist | **Q451962** | living |
| **john-tooby** | Q532892 = invalid | **Q1701956** | **deceased — P570 2023-11-09** ★ |
| daniel-kahneman | Q62887 = an 1814–1870 botanist | **Q233950** | deceased (2024-03-27) |
| john-mccarthy | Q92688 = John Pasta (physicist) | **Q92739** | deceased (2011-10-24) |
| marvin-minsky | Q154485 = invalid | **Q204815** | deceased (2016-01-24) |
| concept:generative-grammar | Q179692 = axiom of choice | **Q36108** | concept (theory in linguistics) |
| concept:public-key-cryptography | Q282510 = a Spanish municipality | **Q201339** | concept |
| concept:analysis-of-algorithms | Q1155510 = 2001 Summer Universiade | **Q333464** | concept |

## 2. ★ Observe-only self-correction — John Tooby
Tooby was scoped as living (b.1952) but live-confirmed **deceased** (Wikidata P570 = 2023-11-09).
Per v2 §3 the status is *observed, never predicted*; the drift ran living→deceased (stricter→looser
= the safe direction the policy predicts). Routed to the deceased founder ladder. Second instance of
this self-correction (Labov, decision (71), was the first).

## 3. Referent precision (the Cerf/#33 lesson) — 3 concept nodes
Three founders founded a *paradigm within* a broad subfield, not the whole subfield. Modeled with
precise `concept` nodes (mirroring `concept:internet`), each `part_of` its reviewed parent:
- `concept:generative-grammar` (Q36108) part_of `subfield:syntax` — Chomsky's referent (syntax predates him).
- `concept:public-key-cryptography` (Q201339) part_of `subfield:cryptography` — Diffie+Hellman's referent.
- `concept:analysis-of-algorithms` (Q333464) part_of `subfield:algorithms-and-data-structures` — Knuth's referent.

## 4. Living-person v2 at scale — 9 living founders auto-`reviewed`
Chomsky, Knuth, Deutsch, Diffie, Hellman, Cook, Gazzaniga, Floridi, Cosmides. Each met the v2 floor
(resolver-verified QID with P570 live-confirmed absent + ≥2 independent live claim-stating sources +
conservative attributed wording) and returned *supported* with **no escalation signal** → auto-promoted.
- **Chomsky = the deliberate v2 claim-type probe.** He is publicly contentious in *politics*, but the
  *linguistics-founding* claim (generative grammar) is uncontested. v2 risk = claim-type × contention,
  NOT the person's general controversy → no escalation; promoted with attributed wording. This is the
  case v2 was designed to handle correctly, and it did.
- No private-life / reputational / negative content was introduced for any node (founding claims only).

## 5. Edge dispositions
15 founder/part_of edges → **reviewed**; 1 → **proposed**:
- **B1 Kahneman → judgment-and-decision-making** → `proposed`: founder-ladder clause ① fails because
  the anchor `subfield:judgment-and-decision-making` is itself `proposed` (not reviewed). The Kahneman
  node is `reviewed` (node policy v1); only the edge is held. Auto-promotes when the anchor is promoted.
- All others (concept part_of ×3; founder ×12 incl. Tooby deceased, McCarthy/Minsky deceased) →
  reviewed via the founder ladder / structural membership.

## 6. Sources (≥2 independent live claim-stating per edge)
Wikipedia (each person's article) + an authoritative second source per edge: ACM Turing Award
citations (Knuth 1974, Diffie+Hellman 2015, Cook 1982, McCarthy 1971, Minsky 1969), the Nobel Memorial
Prize 2002 (Kahneman), the 1956 Dartmouth workshop (McCarthy/Minsky), the 1978 coining of "cognitive
neuroscience" (Gazzaniga+Miller, confirmed live), SEP (Chomsky/generative grammar; Floridi/Information).
Evidence arrays cite registered source IDs (source:wikipedia, source:sep); the ≥2 justification + the
verbatim/citation anchors live in each edge's note (Cerf pattern).

## 7. Counts
Nodes 479→495 (+13 person +3 concept) · edges 569→585 (+15 reviewed +1 proposed) · translations →495 ·
sources 21. typecheck ✓ validate ✓. Generated QID hallucination 15/16; claim-level hallucination 0.
