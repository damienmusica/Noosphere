# Grounding report — cognitive-sciences skeleton v1 QID resolution

> Resolver v4 (`scripts/foundry/resolve-wikidata.ts`, local network) + orchestrator
> multi-signal verification, session #21, 2026-06-18. Resolver is the QID authority;
> training-knowledge hints in the proposal are NOT evidence. Cognitive-science homonym
> traps (concept-vs-discipline: cognition/perception/decision-making; object-vs-discipline:
> psychological-test; broad-vs-narrow: Bayesian cognitive science) → multi-signal P31, never label-match.

## Resolver run
- 27 seeds → **27 resolved / 0 unresolved**, 24 flagged ambiguous (mostly top-two score-gap < 50,
  since many psychology subfields carry P31 `branch of psychology` Q60680430 which scores as a
  related-abstract-kind rather than the exact DISCIPLINE_LIKE set — a scoring artifact, not a doubt).
- **Generator QID-hint hallucination ≈ 0/24 — the worst measured to date.** The generator's hints
  resolved to: shallot (Q193498), chimera/mythical (Q182790), West Slavs (Q840454), a Romanian painter
  (Q1033798), simony (Q205302), a Bulgarian village (Q1075257), a French commune (Q1143893), the
  "Army Men" video-game series (Q621635), a film director (Q628827), signal processing (Q208163),
  geodetic astronomy (Q751404), McCarthyism (Q207066), a beetle (Q2054482), a football stadium
  (Q1550984), a pianist (Q1000563), an Indonesian district (Q193536), insect/sponge taxa (Q2576700/
  Q2601612), a NZ church synod (Q7662536), a Red Dwarf episode (Q5160086), and several deleted/redirect
  QIDs. Confirms — yet again — that training-knowledge QIDs are unusable; the resolver is the gate.

## Multi-signal verification (live EntityData P31 + label + aliases + sitelink count)

All 22 final QIDs verified `instance of` **branch of psychology (Q60680430) / academic discipline
(Q11862829)** — none a journal, work, person, taxon, or homonym object. The four no-P31 picks
(cognitive/computational/systems/affective neuroscience) are confirmed by exact label + scientific-field
description + sitelink count, per the resolver's standing "valid concepts may carry no P31" note.

### 1 manual override (decision-log (9) live-verified path)
- **`subfield:psychometrics`**: resolver rank-1 **Q873512 "psychological test"** (P31 *type of test* —
  an instrument object, not a discipline) → **Q506132 "psychometrics"** (P31 Q60680430 branch of
  psychology, sl=46, "study of the theory and technique of psychological measurement"). Object-vs-discipline
  homonym, the medicine `infectious-diseases` failure-mode mirror.

### 3 honest QID-less gaps (no clean Wikidata discipline entity — promoted `proposed`)
- **`subfield:sensation-and-perception`**: search surfaces only **Q160402 "perception"** (the percept/
  process concept) and **Q500096 "psychophysics"** (a narrower methodology — does not umbrella the broad
  sensation+perception research area; the §11 CIS component-anchor rule bars it). No combined-name
  discipline entity. Honest gap (BF231-299 + UDC 159.93 captured carry criterion (a); Vision Research /
  Attention Perception & Psychophysics journals carry (b)).
- **`subfield:computational-cognitive-science`**: only **Q4874465 "Bayesian cognitive science"** (sl=1,
  a sub-approach, alias "computational cognitive science") and **Q96319640** (a journal, P31 scientific
  journal) exist — neither is the discipline. Honest gap (boundary table mandates the node; §13 to CS).
- **`subfield:judgment-and-decision-making`**: only **Q1331926 "decision making"** (P31 type of process —
  concept) and **Q15746672** (the JDM *journal*) exist. No discipline entity. Honest gap (SJDM society +
  journals carry (b); BF608-635 carries (a); distinct referent from `subfield:decision-theory` Q177571).

### Collision checks
- 22 final QIDs: **0 collisions** with the 357 pre-existing /data QIDs; **0 internal duplicates**.
- The biological-psychology / behavioral-neuroscience collision (both resolved to **Q846566**) was
  resolved by absorption at QC (see qc-report.md), not carried into /data.

## Final QID assignments (22 verified)
field:psychology Q9418 · field:neuroscience Q207011 · cognitive-psychology Q23373 ·
developmental-psychology Q175002 · social-psychology Q161272 · clinical-psychology Q199906 ·
experimental-psychology Q475042 · personality-psychology Q271716 · comparative-psychology Q1483503 ·
educational-psychology Q59157 · industrial-and-organizational-psychology Q2045692 ·
health-psychology Q1403186 · evolutionary-psychology Q219695 · psychometrics **Q506132** ·
neuropsychology Q3872 · positive-psychology Q718809 · forensic-psychology Q932219 ·
cognitive-neuroscience Q1138951 · behavioral-neuroscience Q846566 · computational-neuroscience Q8037925 ·
systems-neuroscience Q2617516 · affective-neuroscience Q3625500.

QID-less (3): sensation-and-perception · computational-cognitive-science · judgment-and-decision-making.
