# Generation notes — person-wave7-v1

Batch: 14 canonical founders of existing `reviewed` subfields (CPO-ratified slate).
Proposer: Claude Sonnet, `claude-sonnet-5`, 2026-07-01. 13 deceased persons, 1 living
(Ivan Sutherland). All QIDs below are **generator best-guesses, unverified** — every
one carries `_qid_unverified: true` on the node and must be live resolver-confirmed
by the orchestrator (P31=Q5 + P569 + P570 + label/sitelink) before promotion. Prior
waves measured ~100% generator-guessed-QID hallucination rate; treat every QID here
as wrong until proven otherwise.

**Source-registry correction:** the order listed `source:britannica` as available.
It is **not present** in `data/sources.json` (checked directly). No edge in this
batch cites it; all evidence uses only registered source IDs (`source:sep`,
`source:wikipedia`, `source:nobelprize`, `source:oxford-bibliographies` [available
but unused this batch — SEP/Wikipedia/MacTutor/IEP/NobelPrize covered every row],
`source:iep`, `source:mactutor`). Flagging this for QC/CPO in case the source
registry needs a Britannica entry added in a future change, or in case the order's
list was based on stale information.

---

## 1. Jean Piaget -> subfield:developmental-psychology

- QID guess (unverified): `Q41773`
- Sources: `source:sep` (genetic epistemology / stage theory foundational to the
  discipline), `source:wikipedia` (Piaget "widely considered... most influential
  figure in developmental psychology", originator of the stage theory)
- Record-not-resolve: clean single-founder attribution; no genuine rival claim
  found in the literature surveyed.
- Uncertainty for orchestrator: identity is unambiguous (no notable homonym);
  confirm QID only.

## 2. Kurt Lewin -> subfield:social-psychology

- QID guess (unverified): `Q57282`
- Sources: `source:sep` (field theory / group dynamics as founding of experimental
  group-behavior study), `source:wikipedia` ("known as the founder of modern
  social psychology", action research + group dynamics originator)
- Record-not-resolve: prehistory includes earlier figures (Floyd Allport, William
  McDougall, Norman Triplett's 1898 study) but Lewin is the standard attribution
  for the *modern* discipline as constituted. Not flagged ambiguous on the node
  since this is a clean single dominant attribution, not a live split.
- Uncertainty for orchestrator: confirm QID; watch for confusion with other Lewins.

## 3. Ulric Neisser -> subfield:cognitive-psychology

- QID guess (unverified): `Q733605`
- Sources: `source:wikipedia` (1967 "Cognitive Psychology" is "academically
  considered... the formal beginning of the cognitivist approach"; "father of
  cognitive psychology"), `source:sep` (cognitive-science entries on the
  mid-century "cognitive revolution" Neisser's book named/consolidated)
- Record-not-resolve: **co-founder** with George A. Miller and the broader
  cognitive-revolution cohort (Chomsky, Newell & Simon). Neisser specifically
  named/consolidated the field as a discipline via his 1967 text rather than
  solely originating every underlying idea. Node flagged `ambiguous: true` for
  this plural-founding structure.
- Uncertainty for orchestrator: consider whether a parallel Miller edge belongs
  in a future wave (not proposed here — out of this batch's scope).

## 4. Charles Spearman -> subfield:psychometrics

- QID guess (unverified): `Q356287`
- Sources: `source:sep` (factor analysis + two-factor "g" theory foundational to
  psychometric measurement theory), `source:wikipedia` ("pioneer of factor
  analysis", two-factor theory of intelligence)
- Record-not-resolve: **co-founder** alongside Francis Galton (earlier
  mental-testing pioneer, 1880s, eugenics-associated — flagged so QC can weigh
  whether to record Galton as a forerunner note or a future separate edge) and
  L.L. Thurstone (multiple-factor analysis). Spearman is the standard attribution
  for the field's *statistical-methodological* founding specifically. Node
  flagged `ambiguous: true`.
- Uncertainty for orchestrator: Galton's eugenics association is a reputational
  consideration if a future Galton node/edge is proposed — not applicable to
  this Spearman edge directly, but worth flagging for corpus-wide awareness.

## 5. Edmund Husserl -> subfield:phenomenology

- QID guess (unverified): `Q152388`
- Sources: `source:sep` (phenomenology entry: "founded in the early years of the
  20th century by Edmund Husserl"), `source:wikipedia` ("principal founder of
  phenomenology")
- Record-not-resolve: none needed. Cleanest founding attribution in the batch;
  later figures (Heidegger, Merleau-Ponty, Sartre) developed/diverged from the
  method but are not co-founders.
- Uncertainty for orchestrator: identity unambiguous; confirm QID only.

## 6. Bertrand Russell -> subfield:analytic-philosophy

- QID guess (unverified): `Q34670`
- Sources: `source:sep` (analytic-philosophy entry: origins in Russell/Moore's
  revolt against British idealism, Russell's logical-analysis programme central
  to method), `source:wikipedia` ("generally recognized as one of the founders
  of analytic philosophy")
- Record-not-resolve: **co-principal founder** with Frege (`person:gottlob-frege`,
  already a corpus node — Frege's logical work predates and underpins Russell's),
  G.E. Moore (co-led the idealism revolt), and early Wittgenstein
  (`person:ludwig-wittgenstein`, already a corpus node — Tractatus shaped the
  movement's early trajectory). This edge records Russell's specific
  contribution only; it is not a sole-founder claim. Node flagged
  `ambiguous: true`.
- Uncertainty for orchestrator: both referenced corpus nodes (Frege, Wittgenstein)
  should be checked for whether they already carry their own
  `founded_or_formalized` edges to `subfield:analytic-philosophy` from a prior
  wave — if so, this batch is additive, not duplicative; if not, that is a
  coverage gap the CPO may want to close in a future wave (out of scope here).

## 7 & 8. Samuel Eilenberg + Saunders Mac Lane -> subfield:category-theory (joint)

- QID guesses (unverified): Eilenberg `Q332322`, Mac Lane `Q380245`
- Sources (both edges): `source:mactutor` (Eilenberg bio: "introduced category
  theory" jointly with Mac Lane in the 1945 paper; Mac Lane bio: co-founded
  category theory, later wrote "Categories for the Working Mathematician"),
  `source:wikipedia` (category-theory entry: "introduced by Samuel Eilenberg
  and Saunders Mac Lane in the middle of the 20th century")
- Record-not-resolve: **joint/co-equal founding** via a single co-authored 1945
  paper ("General Theory of Natural Equivalences") — not a contest between
  rival claims, but a genuine two-person joint act. Encoded as two parallel,
  co-equal edges rather than picking one name or building an artificial
  hierarchy between them. Both nodes flagged `ambiguous: true` to record the
  joint structure (not identity/founding doubt).
- Uncertainty for orchestrator: confirm both QIDs are for the mathematicians
  specifically (not other Eilenbergs/Mac Lanes); this pairing is the cleanest
  "joint founder" case in the batch — both sources independently confirm the
  same joint act, which should make QC's claim-anchor check straightforward.

## 9. Alfred Tarski -> subfield:model-theory

- QID guess (unverified): `Q123368`
- Sources: `source:sep` (model theory / Tarski's truth-definition entries:
  semantic conception of truth + logical-consequence work laid model theory's
  foundations), `source:mactutor` (Tarski bio: "one of the four greatest
  logicians of all time" alongside Aristotle/Frege/Godel, credited for
  semantics and model theory founding contributions)
- Record-not-resolve: later figures (Abraham Robinson, Leon Henkin) developed
  the field further, but Tarski is the standard single-founder attribution.
  Not flagged ambiguous.
- Uncertainty for orchestrator: identity unambiguous (Alfred Tarski the
  logician is well-disambiguated in Wikidata); confirm QID only.

## 10. Georges Cuvier -> subfield:paleontology

- QID guess (unverified): `Q80137`
- Sources: `source:wikipedia` ("widely considered to be the founder of
  paleontology as a scientific discipline", established comparative anatomy
  and extinction as scientific concepts), `source:sep` (history/philosophy of
  science entries touching species extinction: Cuvier's comparative-anatomy
  work foundational to establishing extinction as fact and to the discipline's
  method)
- Record-not-resolve: earlier fossil-collecting naturalists (Mary Anning's
  contemporaneous fieldwork, William Smith's stratigraphy) contributed
  foundational material/method but are not credited as founders of paleontology
  as a discipline the way Cuvier is (comparative-anatomy method + extinction
  established as science). Not flagged ambiguous — this is a forerunner/
  contributor distinction, not a rival-founder split.
- Uncertainty for orchestrator: verify the SEP citation actually contains a
  Cuvier claim-anchor (SEP coverage of Cuvier specifically may be thinner than
  Wikipedia's — flagging so QC checks this pairing carefully; if SEP's anchor is
  too thin, `source:oxford-bibliographies` is a fallback available in the
  registry).

## 11. Élie Metchnikoff -> subfield:immunology

- QID guess (unverified): `Q123371`
- Sources: `source:nobelprize` (1908 Physiology or Medicine prize page: joint
  award to Mechnikov + Ehrlich "in recognition of their work on immunity",
  Metchnikoff specifically for cellular/phagocyte theory), `source:wikipedia`
  ("credited with the discovery of phagocytes... and thus of the innate immune
  response")
- Record-not-resolve: **co-founder** with Paul Ehrlich (shared the 1908 Nobel
  specifically for the cellular-vs-humoral dual contribution to immunity
  theory — this edge records Metchnikoff's cellular half only). Edward Jenner
  (1796 smallpox vaccination) is an earlier forerunner of immunological
  *practice* but predates immunology as a discipline with a causal/cellular
  mechanism, so not treated as a co-founder. Node flagged `ambiguous: true`.
- Uncertainty for orchestrator: consider whether a parallel Ehrlich edge belongs
  in a future wave for symmetry (out of scope here; Ehrlich is not in this
  batch's roster).

## 12. Ragnar Frisch -> subfield:econometrics

- QID guess (unverified): `Q123279`
- Sources: `source:nobelprize` (1969 Economic Sciences prize page: first prize
  jointly to Frisch + Tinbergen "for having developed and applied dynamic
  models for the analysis of economic processes"), `source:wikipedia` ("coined
  the terms econometrics... in the sense in which it is used today", co-founded
  the Econometric Society in 1930)
- Record-not-resolve: **co-founder** with Jan Tinbergen (shared the first
  Economics Nobel specifically for this contribution). This edge records
  Frisch's terminological/institutional founding role (coined the term,
  co-founded the Econometric Society) rather than claiming sole origination of
  econometric practice. Node flagged `ambiguous: true`.
- Uncertainty for orchestrator: consider a parallel Tinbergen edge in a future
  wave for symmetry (out of scope here).

## 13. Cesare Beccaria -> subfield:criminology

- QID guess (unverified): `Q184226`
- Sources: `source:iep` (Beccaria entry: "On Crimes and Punishments" (1764) "is
  regarded as the founding document of the Classical School of criminology"),
  `source:wikipedia` ("father of modern criminal law and the father of criminal
  justice", founder of the classical school)
- Record-not-resolve: criminology's founding is **genuinely split** — Beccaria
  founded the *classical* school (rational-actor, deterrence-based, 18th
  century), while Cesare Lombroso later founded the *positivist* school
  (biological-determinist, late 19th century, now largely scientifically
  discredited). This edge records Beccaria's classical-school founding
  specifically and does not claim criminology has one undisputed founder. Node
  flagged `ambiguous: true`. This is a genuine record-not-resolve case per the
  order's own framing — not a candidate for `disputed: true` (both schools are
  real historical movements, not a live contested-identity question).
- Uncertainty for orchestrator: Lombroso is NOT in this batch and no Lombroso
  edge is proposed — a future wave could add
  `person:cesare-lombroso -> subfield:criminology` as a second, clearly-marked
  positivist-school founder edge if the CPO wants that symmetry; flagging as a
  coverage decision, not a defect in this batch.

## 14. Ivan Sutherland -> subfield:computer-graphics (LIVING)

- QID guess (unverified): `Q92662`
- Sources: `source:wikipedia` (Sketchpad 1963 "considered to be the ancestor of
  modern computer-aided design... major breakthrough in the development of
  computer graphics"; "regarded by many as the father of computer graphics"),
  `source:sep` (philosophy-of-computing/HCI-history-adjacent entries
  corroborating Sketchpad's role in establishing direct-manipulation graphical
  interaction) — **NOTE for orchestrator**: the SEP pairing here is the weakest
  claim-anchor in the batch (SEP has no dedicated Sutherland/Sketchpad entry;
  the claim is corroborative from computing-history-adjacent SEP material, not
  a direct biographical entry). If QC's live fetch cannot find a sufficiently
  direct SEP claim-anchor, recommend substituting `source:oxford-bibliographies`
  or treating Wikipedia as sufficient alone plus a second independent
  Wikipedia-adjacent claim (e.g. the ACM Turing Award citation text, if a
  source for that gets registered) — flagging honestly rather than laundering
  a weak SEP claim as strong.
- Record-not-resolve: no genuine rival single-founder claim found in the
  literature surveyed; Sutherland's Sketchpad priority is uncontested. Not
  flagged ambiguous.
- **Living-person handling v2 (decision (70)) applies**: this is a
  technical/institutional founding claim — not private-life, not
  reputational/negative, not contested — so it sits in the low-escalation-signal
  profile. The floor the orchestrator must still confirm live: resolver-verified
  identity (P31=Q5 + P569 birth + **P570 live-confirmed absent**) + ≥2
  independent live claim-stating sources (see the SEP-strength caveat above) +
  conservative *attributed* wording if this reaches a summary. No escalation
  signal expected from this content, but the P570-absent check is mandatory
  before any auto-promotion path is considered, per the standing policy.
  `is_living_person: true` is set on the node; `academic_status` correctly
  omitted per the person/work node contract v1 (decision (58)).

---

## Batch-level summary for the orchestrator

- 14 nodes proposed, 0 reconciled to existing IDs (none of the 14 persons exist
  in `data/nodes.json` — checked directly against the full person-node listing).
- 15 edges proposed (14 rows + 1 extra for the Eilenberg/Mac Lane joint pair).
- All 13 target anchor subfields confirmed present and `reviewed` in
  `data/nodes.json` prior to generation (`subfield:developmental-psychology`,
  `subfield:social-psychology`, `subfield:cognitive-psychology`,
  `subfield:psychometrics`, `subfield:phenomenology`,
  `subfield:analytic-philosophy`, `subfield:category-theory`,
  `subfield:model-theory`, `subfield:paleontology`, `subfield:immunology`,
  `subfield:econometrics`, `subfield:criminology`, `subfield:computer-graphics`).
- `person:gottlob-frege` and `person:ludwig-wittgenstein`, referenced in the
  Russell note, confirmed present in `data/nodes.json` — not re-proposed here.
- Ambiguous flag fired on 8/14 nodes (Neisser, Spearman, Russell, Eilenberg,
  Mac Lane, Metchnikoff, Frisch, Beccaria) strictly for plural/contested-founding
  record-not-resolve reasons, never for identity doubt. `disputed: true` was
  never used — per the order, these are notes, not disputes.
- All 15 edges cite exactly 2 registered source IDs each; `source:britannica`
  (listed as "available" in the order) does not exist in `data/sources.json`
  and was not used — flagged above for CPO/schema-registry attention.
- Weakest claim-anchor pairing flagged explicitly: Sutherland/computer-graphics
  SEP corroboration (see item 14) — recommend QC verify this first.
- Coverage deliberately left out: no Miller (cognitive-psychology co-founder),
  no Galton (psychometrics forerunner), no Ehrlich (immunology co-founder), no
  Tinbergen (econometrics co-founder), no Lombroso (criminology positivist-school
  founder) edges — all noted as future-wave candidates for symmetry, not
  generated here since they were outside the ordered 14-row roster.
- No network calls made; all claims are from generator knowledge and must be
  live-verified by QC per the mandatory claim-anchor + cited-URL-survival
  process.
