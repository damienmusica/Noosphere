# phase2-summaries-v1 — orchestrator QC report

**Session #53, 2026-07-02, editorial v2 (decision (26)).** Opus generation in two
separated-context passes (ADR 0007): `summaries.proposed.json` = 32 items (12 persons +
9 works + 11 concepts); `works-remainder.proposed.json` = 21 works → completing the full
work layer. Orchestrator (Opus) QC = machine-check (cited-URL live survival, full) +
close-read + §8 permanence anchors taken this session. **53/53 summaries promoted →
translation `summary` + `reviewed: true`, node `indexable: true`** — the first indexable
phase-2 person/work/concept nodes.

## Close-read (full — both passes, 53/53)

**0 factual errors.** Dates, attributions, works, and field placements are all
standard-reference and match the recorded `data/edges.json` relations. Relation-type
fidelity preserved:

- `marx → false-consciousness` is `influenced` (not a founder edge) → summary uses
  "closely associated with" and attributes the *term* to Engels, not Marx.
- `husserl → intentionality`, `minsky → symbolic-ai`, `weber → bureaucracy` founder edges
  are `proposed` → neutral wording (intentionality credits Brentano's reintroduction;
  symbolic-ai credits no single founder — "early figures / Dartmouth workshop").
- `max-weber` summary keeps the neutral "often contrasted with Karl Marx" (the
  `weber → critiques → marx` edge was promoted separately this session in
  a-relations-wave6 — the summary was generated before that and is left conservative).

**2 living persons (Chomsky, Knuth):** present tense, **no birth/death dates**,
conservative attributed wording ("widely credited with…"), contribution-only, **no
political / biographical / reputational content** (decision (70) §1(d)). Chomsky's summary
carries at most one neutral "also widely known as a public intellectual" clause. The living
cohort was P570-reswept at session start (16/16 still living — no flips).

## Machine-check — cited-URL live survival (full)

Every node retains **≥1 live, valid anchor.** Wikipedia: all 200. SEP: all 200 except
`chomsky` (404) and `structuralism-linguistics` (404) — both those nodes carry a live WP
anchor instead. **Dead / invalid generator slugs — noted, NOT used as anchors:** SEP
`chomsky`, SEP `structuralism-linguistics`, IEP `levi-strauss` (404), IEP `nietzsche`
(fuzzy-redirects to `nietzsches-ethics`, a *different* entry → invalid), IEP `freud`
(connection error at check time; node anchored on WP instead). Britannica: all 403 =
bot-block (real URLs, not dead — never recorded as the live anchor). 3 works have no
dedicated WP article (Wundt *Principles of Physiological Psychology*, Lévi-Strauss
*Structural Anthropology*, Labov *Social Stratification of English in NYC*) → anchored on
the author biography page (a live page QC relies on for the authorship/content claim).

## Per-node §8 permanence anchor — live-verified 2026-07-02

MediaWiki sources → revision permalink (`oldid`); the 4 nodes without a WP hint
(Nietzsche, Frege, Husserl, Intentionality) → SEP Wayback SPN taken this session.

- `person:sigmund-freud` — https://en.wikipedia.org/w/index.php?title=Sigmund_Freud&oldid=1362025123
- `person:emile-durkheim` — https://en.wikipedia.org/w/index.php?title=%C3%89mile_Durkheim&oldid=1360952863
- `person:friedrich-nietzsche` — SEP SPN https://web.archive.org/web/20260702062628/https://plato.stanford.edu/entries/nietzsche/
- `person:claude-levi-strauss` — https://en.wikipedia.org/w/index.php?title=Claude_L%C3%A9vi-Strauss&oldid=1361412957
- `person:gottlob-frege` — SEP SPN https://web.archive.org/web/20260702062646/https://plato.stanford.edu/entries/frege/
- `person:alan-turing` — https://en.wikipedia.org/w/index.php?title=Alan_Turing&oldid=1362088307
- `person:charles-darwin` — https://en.wikipedia.org/w/index.php?title=Charles_Darwin&oldid=1360793412
- `person:max-weber` — https://en.wikipedia.org/w/index.php?title=Max_Weber&oldid=1361488712
- `person:karl-marx` — https://en.wikipedia.org/w/index.php?title=Karl_Marx&oldid=1361111805
- `person:edmund-husserl` — SEP SPN https://web.archive.org/web/20260702062711/https://plato.stanford.edu/entries/husserl/
- `person:noam-chomsky` (LIVING) — https://en.wikipedia.org/w/index.php?title=Noam_Chomsky&oldid=1361048686
- `person:donald-knuth` (LIVING) — https://en.wikipedia.org/w/index.php?title=Donald_Knuth&oldid=1360322990
- `work:on-the-origin-of-species` — https://en.wikipedia.org/w/index.php?title=On_the_Origin_of_Species&oldid=1361718398
- `work:philosophiae-naturalis-principia-mathematica` — https://en.wikipedia.org/w/index.php?title=Philosophi%C3%A6_Naturalis_Principia_Mathematica&oldid=1361196779
- `work:the-wealth-of-nations` — https://en.wikipedia.org/w/index.php?title=The_Wealth_of_Nations&oldid=1361622943
- `work:cours-de-linguistique-generale` — https://en.wikipedia.org/w/index.php?title=Course_in_General_Linguistics&oldid=1356605029
- `work:a-mathematical-theory-of-communication` — https://en.wikipedia.org/w/index.php?title=A_Mathematical_Theory_of_Communication&oldid=1359011097
- `work:the-interpretation-of-dreams` — https://en.wikipedia.org/w/index.php?title=The_Interpretation_of_Dreams&oldid=1341587144
- `work:tractatus-logico-philosophicus` — https://en.wikipedia.org/w/index.php?title=Tractatus_Logico-Philosophicus&oldid=1362050109
- `work:capital-volume-i` — https://en.wikipedia.org/w/index.php?title=Das_Kapital&oldid=1361725528
- `work:on-computable-numbers` — https://en.wikipedia.org/w/index.php?title=Turing%27s_proof&oldid=1360602642
- `work:principles-of-geology` — https://en.wikipedia.org/w/index.php?title=Principles_of_Geology&oldid=1360126876
- `work:de-humani-corporis-fabrica` — https://en.wikipedia.org/w/index.php?title=De_Humani_Corporis_Fabrica_Libri_Septem&oldid=1352479774
- `work:systema-naturae` — https://en.wikipedia.org/w/index.php?title=Systema_Naturae&oldid=1358076593
- `work:traite-elementaire-de-chimie` — https://en.wikipedia.org/w/index.php?title=Trait%C3%A9_%C3%89l%C3%A9mentaire_de_Chimie&oldid=1354179399
- `work:experiments-on-plant-hybridization` — https://en.wikipedia.org/w/index.php?title=Experiments_on_Plant_Hybridization&oldid=1356375892
- `work:cybernetics` — https://en.wikipedia.org/w/index.php?title=Cybernetics%3A_Or_Control_and_Communication_in_the_Animal_and_the_Machine&oldid=1335885128
- `work:begriffsschrift` — https://en.wikipedia.org/w/index.php?title=Begriffsschrift&oldid=1353573485
- `work:on-crimes-and-punishments` — https://en.wikipedia.org/w/index.php?title=On_Crimes_and_Punishments&oldid=1351517400
- `work:social-choice-and-individual-values` — https://en.wikipedia.org/w/index.php?title=Social_Choice_and_Individual_Values&oldid=1335439505
- `work:principles-of-physiological-psychology` — https://en.wikipedia.org/w/index.php?title=Wilhelm_Wundt&oldid=1361411640 [author-bio fallback; no dedicated article]
- `work:grundlagen-einer-allgemeinen-mannigfaltigkeitslehre` — https://en.wikipedia.org/w/index.php?title=Georg_Cantor&oldid=1361025127 [author-bio fallback]
- `work:the-mind-of-primitive-man` — https://en.wikipedia.org/w/index.php?title=The_Mind_of_Primitive_Man&oldid=1341129795
- `work:cours-de-philosophie-positive` — https://en.wikipedia.org/w/index.php?title=Course_of_Positive_Philosophy&oldid=1357993571
- `work:the-rules-of-sociological-method` — https://en.wikipedia.org/w/index.php?title=The_Rules_of_Sociological_Method&oldid=1300661555
- `work:the-protestant-ethic-and-the-spirit-of-capitalism` — https://en.wikipedia.org/w/index.php?title=The_Protestant_Ethic_and_the_Spirit_of_Capitalism&oldid=1353077594
- `work:an-investigation-of-the-laws-of-thought` — https://en.wikipedia.org/w/index.php?title=The_Laws_of_Thought&oldid=1315882804
- `work:logical-investigations` — https://en.wikipedia.org/w/index.php?title=Logical_Investigations_(Husserl)&oldid=1361822587
- `work:structural-anthropology` — https://en.wikipedia.org/w/index.php?title=Claude_L%C3%A9vi-Strauss&oldid=1361412957 [author-bio fallback; no dedicated book article]
- `work:syntactic-structures` (LIVING author) — https://en.wikipedia.org/w/index.php?title=Syntactic_Structures&oldid=1361577289
- `work:the-social-stratification-of-english-in-new-york-city` (LIVING author) — https://en.wikipedia.org/w/index.php?title=William_Labov&oldid=1356581526 [author-bio fallback]
- `work:the-problems-of-philosophy` — https://en.wikipedia.org/w/index.php?title=The_Problems_of_Philosophy&oldid=1332860932
- `concept:natural-selection` — https://en.wikipedia.org/w/index.php?title=Natural_selection&oldid=1353996056
- `concept:the-unconscious` — https://en.wikipedia.org/w/index.php?title=Unconscious_mind&oldid=1354908929
- `concept:turing-machine` — https://en.wikipedia.org/w/index.php?title=Turing_machine&oldid=1361925546
- `concept:nash-equilibrium` — https://en.wikipedia.org/w/index.php?title=Nash_equilibrium&oldid=1360354244
- `concept:mendelian-inheritance` — https://en.wikipedia.org/w/index.php?title=Mendelian_inheritance&oldid=1362067676
- `concept:social-fact` — https://en.wikipedia.org/w/index.php?title=Social_fact&oldid=1328548420
- `concept:invisible-hand` — https://en.wikipedia.org/w/index.php?title=Invisible_hand&oldid=1358921063
- `concept:intentionality` — SEP SPN https://web.archive.org/web/20260702062734/https://plato.stanford.edu/entries/intentionality/
- `concept:lambda-calculus` — https://en.wikipedia.org/w/index.php?title=Lambda_calculus&oldid=1361655104
- `concept:symbolic-ai` — https://en.wikipedia.org/w/index.php?title=Symbolic_artificial_intelligence&oldid=1360607279
- `concept:false-consciousness` — https://en.wikipedia.org/w/index.php?title=False_consciousness&oldid=1356297528

_53 anchors recorded (49 WP `oldid` incl. 3 author-bio fallbacks + 4 SEP Wayback SPN).
Supersedes the generation-time `[NO-EXTERNAL-EVIDENCE]` marker in `generation-notes.md`._

## Deferred (explicit, not silent)

The person layer's indexable gap is 114 nodes. This batch covered the **top 12 by graph
degree** (highest-connectivity founders) + the full **30-work** and **11-concept** layers.
The remaining **~102 person summaries** are deferred to a later editorial batch (#54+) —
persons carry the decision (34) close-read burden, so they are tranched rather than rushed.
Not a silent cap.
