# Generation notes — cofounder-closure-v1

Batch: 5 co-founder / symmetric-founder gaps explicitly flagged in wave-7
(`foundry/proposals/person-wave7-v1/`, promoted to `/data` per its report.md)
and in the canonical `edge:kenneth-arrow-founded-social-choice-theory` /
`edge:amartya-sen-founded-social-choice-theory` notes. Each of the 5 is a
canonical co-founder of an already-`reviewed` subfield whose *other*
co-founder is already a corpus node; only the person node itself is missing.
Proposer: Claude Sonnet, `claude-sonnet-5`, 2026-07-01. All 5 persons are
DECEASED (`is_living_person: false`) — this batch has no living-person path.
All QIDs below are **generator best-guesses, unverified** — every node
carries `_qid_unverified: true` and must be live resolver-confirmed by the
orchestrator (P31=Q5 + P569 + P570 + enwiki sitelink) before any promotion.
Prior waves measured ~100% generator-guessed-QID hallucination rate; treat
every QID here as wrong until proven otherwise.

**Source registry check:** verified all cited source IDs exist in
`data/sources.json` before use (`source:wikipedia`, `source:sep`,
`source:nobelprize`). No invented source IDs. NamuWiki not used or considered.

---

## 1. George A. Miller -> subfield:cognitive-psychology

- QID guess (unverified): `Q733135`
- Anchor: `edge:ulric-neisser-founded-cognitive-psychology` (reviewed, in
  `/data`) explicitly names "George A. Miller (with Galanter & Pribram, 1960;
  co-founded the Harvard Center for Cognitive Studies)" as a co-founder gap.
- Sources expected to survive live-verification: `source:wikipedia` — two
  independent articles under the one registered ID: 'George Armitage Miller'
  biography (founder of cognitive psychology, co-founded the Harvard Center
  for Cognitive Studies with Jerome Bruner, 1960) + 'Cognitive psychology' or
  'Cognitive revolution' article (1956 "Magical Number Seven" and 1960 "Plans
  and the Structure of Behavior" as foundational works).
- Record-not-resolve: co-founder with Ulric Neisser (already reviewed).
  Neisser named/consolidated the field (1967 textbook); Miller supplied
  earlier foundational work (1956, 1960) and co-founded the first dedicated
  cognitive-studies research center. Not flagged ambiguous on the node —
  the co-founding structure itself is not in genuine identity/referent doubt,
  it is recorded via the edge note per the order's instruction (plural
  founding alone is not grounds for node-level `ambiguous`).
- Uncertainty for orchestrator: confirm QID; Miller also has a
  computational-linguistics/WordNet legacy under the same identity — not a
  homonym risk, just noting the fuller biography for confirmation ease.

## 2. Paul Ehrlich -> subfield:immunology

- QID guess (unverified): `Q77938`
- Anchor: `edge:elie-metchnikoff-founded-immunology` (reviewed, in `/data`)
  explicitly names "Paul Ehrlich (humoral theory, co-Nobel)" as the
  co-founder.
- Sources expected to survive live-verification: `source:nobelprize` (1908
  Physiology or Medicine prize page: joint award to Ehrlich + Mechnikov "in
  recognition of their work on immunity"), `source:wikipedia` (Ehrlich
  credited for the humoral/side-chain theory of antibody formation,
  complementing Metchnikoff's cellular theory).
- Record-not-resolve: co-founder with Elie Metchnikoff (already reviewed;
  shared 1908 Nobel for the humoral-vs-cellular dual contribution to
  immunity theory). This edge records Ehrlich's humoral half only.
- Uncertainty for orchestrator / **node flagged `ambiguous: true`**: identity
  disambiguation risk — Paul R. Ehrlich, a living Stanford biologist/
  environmental scientist (author of "The Population Bomb"), is a different,
  unrelated, still-living person with a similar name. The resolver must
  confirm P570 (death, 1915) is present and the occupation/era match the
  19th-century German-Jewish immunologist/Nobel laureate, not the modern
  ecologist.

## 3. Jan Tinbergen -> subfield:econometrics

- QID guess (unverified): `Q123280`
- Anchor: `edge:ragnar-frisch-founded-econometrics` (reviewed, in `/data`)
  explicitly names "Jan Tinbergen is the co-equal co-founder (co-Nobel)" as
  the counterpart.
- Sources expected to survive live-verification: `source:nobelprize` (1969
  Economic Sciences prize page: first prize jointly to Frisch + Tinbergen
  "for having developed and applied dynamic models for the analysis of
  economic processes"), `source:wikipedia` ('Econometrics' article: "Jan
  Tinbergen is one of the two founding fathers of econometrics. The other,
  Ragnar Frisch, also coined the term...").
- Record-not-resolve: co-founder with Ragnar Frisch (already reviewed;
  shared the first Economics Nobel specifically for this contribution).
- Uncertainty for orchestrator / **node flagged `ambiguous: true`**: identity
  disambiguation risk — Jan Tinbergen's younger brother, Nikolaas Tinbergen,
  is a separate, well-known Nobel laureate (Physiology or Medicine, 1973,
  ethology/animal behavior). The resolver must confirm P106 occupation
  (economist) and P569/P570 (1903-1994) match the economist brother, not
  Nikolaas (1907-1988).

## 4. G. E. Moore (George Edward Moore) -> subfield:analytic-philosophy

- QID guess (unverified): `Q311854`
- Anchor: `edge:bertrand-russell-founded-analytic-philosophy` (reviewed, in
  `/data`) explicitly names "G. E. Moore" (co-led the revolt against
  idealism) alongside Frege and Wittgenstein (both already corpus nodes) as
  co-founders across distinct strands.
- Sources expected to survive live-verification: `source:sep` ('Analysis' or
  a Moore-specific SEP entry tracing the analytic method through Frege,
  Russell, and Moore's rebellion against British idealism), `source:wikipedia`
  ('Bertrand Russell' article — already live-verified per the canonical
  Russell edge's own note quoting "a founder of analytic philosophy, along
  with his predecessor Gottlob Frege, his friend and colleague G. E. Moore,
  and his student and protege Ludwig Wittgenstein" — or the 'G. E. Moore'
  article directly).
- Record-not-resolve: co-founder with Bertrand Russell (already reviewed),
  Gottlob Frege (already a corpus node, `person:gottlob-frege`), and Ludwig
  Wittgenstein (already a corpus node, `person:ludwig-wittgenstein`) — four
  co-founders across distinct strands of the movement, per the existing
  Russell edge note. This edge closes the Moore-specific gap; it does not
  claim Moore is the sole founder.
- ID naming decision: used `person:george-edward-moore` (full name spelled
  out) rather than `person:g-e-moore`, per the order's explicit instruction,
  to avoid deriving an ID from an abbreviated display label and to keep IDs
  language/notation-independent. Checked against `data/nodes.json` for
  existing `person:george-*` IDs (`person:george-boole`, `person:george-lakoff`
  present) — no collision.
- Uncertainty for orchestrator: identity referent itself is low-risk (no
  other notable "George Edward Moore" found); not flagged ambiguous on the
  node. The ID-spelling choice is a minor judgment call worth a second look.

## 5. Duncan Black -> subfield:social-choice-theory

- QID guess (unverified): `Q5311021`
- Anchor: BOTH `edge:kenneth-arrow-founded-social-choice-theory` and
  `edge:amartya-sen-founded-social-choice-theory` (both reviewed, in
  `/data`) explicitly name Duncan Black as "not yet a corpus node" / "a
  remaining record-not-resolve gap", citing SEP 'Social Choice Theory':
  "social choice theory took off in the 20th century with the works of
  Kenneth Arrow, Amartya Sen, and Duncan Black."
- Sources expected to survive live-verification: `source:sep` ('Social Choice
  Theory' entry, already live-verified per both existing edges' notes),
  `source:wikipedia` ('Duncan Black (economist)' article: "father of social
  choice theory", median voter theorem, "The Theory of Committees and
  Elections", 1958).
- Record-not-resolve: co-founder alongside Kenneth Arrow (already reviewed,
  1951 modern axiomatic founding) and Amartya Sen (already reviewed, 1970
  reformulation). Black's median voter theorem work arguably predates
  Arrow's 1951 book in first publication (~1948); this edge does not resolve
  priority, only records Black as a third co-equal founding figure per SEP's
  own framing.
- Uncertainty for orchestrator / **node flagged `ambiguous: true`**: "Duncan
  Black" is a common name (e.g. a well-known American journalist/blogger
  writes under a similar handle; multiple other public Duncan Blacks exist).
  The primary risk in this row is identity disambiguation to the correct
  Welsh-born economist (b. 1908, d. 1991, career spanning Wales/Glasgow/
  Belfast), not the founding claim itself, which is well-attested and
  explicitly corroborated by two already-reviewed corpus edges.

---

## Batch-level summary for the orchestrator

- 5 nodes proposed, 0 reconciled to existing IDs — checked
  `data/nodes.json` directly for all 5 candidate IDs
  (`person:george-miller`, `person:paul-ehrlich`, `person:jan-tinbergen`,
  `person:george-edward-moore`, `person:duncan-black`); none exist. Checked
  for near-collisions on `person:george-*` (george-boole, george-lakoff
  present, no collision) and confirmed no `person:g-e-moore` exists either.
- 5 edges proposed, one per node, all targeting already-`reviewed` subfield
  anchors: `subfield:cognitive-psychology`, `subfield:immunology`,
  `subfield:econometrics`, `subfield:analytic-philosophy`,
  `subfield:social-choice-theory` — all 5 confirmed present and `reviewed`
  in `data/nodes.json` with the domains specified in the order
  (cognitive_sciences, life_sciences, social_sciences, humanities,
  social_sciences respectively) before generation.
- Every edge cites the specific existing canonical edge (already `reviewed`
  in `/data`) whose note explicitly names the missing co-founder as a gap —
  this batch is a direct, targeted closure of those 5 named gaps, not a
  speculative new search.
- Ambiguous flag fired on 3/5 nodes (Ehrlich, Tinbergen, Duncan Black) —
  strictly for identity/referent disambiguation risk from same/similar-named
  other people (living Paul R. Ehrlich; Nikolaas Tinbergen; common-name
  Duncan Blacks), never for the founding claim itself. Not flagged on Miller
  or Moore — their referents are low-risk and their plural-founding
  structure is recorded via the edge note per the order's explicit
  instruction that plural-founding alone is not grounds for node ambiguity.
- `disputed: true` was never used — all 5 are record-not-resolve notes, not
  contested-identity or contested-founding claims.
- All 5 edges cite only registered source IDs (`source:wikipedia`,
  `source:sep`, `source:nobelprize`) confirmed present in
  `data/sources.json`. `source:britannica` and `source:acm` were not used
  (per the order, these are not registered).
- All 5 persons are deceased — this batch has no living-person / decision
  (70) path; the deceased founder ladder (decision (61)) is the expected
  promotion path for all 5 edges pending live QC.
- No network calls made; all claims are from generator knowledge and must be
  live-verified by QC per the mandatory claim-anchor + cited-URL-survival
  process. Every QID is expected to be wrong until resolver-confirmed,
  consistent with the ~100% prior-wave QID-hallucination rate.
