# QC report — humanities-remainder skeleton v1 (session #23, orchestrator Opus)

> Generation = Sonnet separate-context subagent (proposal-generator, ADR 0007). QC = orchestrator
> (Opus), multi-signal P31 the authority (cogsci precedent). 45 candidates generated → **45 kept**
> (0 dropped, 0 absorbed). Eleventh continent — last academic continent (decision (43)①).

## Headline

- **45 nodes** (6 fields + 39 subfields): history 12 · linguistics 18 · literary-studies 7 ·
  religious-studies 6 · classics+archaeology 2. **0 dropped, 0 absorbed.**
- **Promotion: 44 reviewed+indexable / 1 proposed** (modern-history, QID-less honest gap).
- **QID-hint hallucination 16/45** (generator training-knowledge channel) — **all caught & corrected**
  by the resolver/orchestrator. This is the *unverified hint* channel the contract expects QC to fix
  (cf. arts-design 16/24); **NOT laundering**. **Hint-laundering (fabricated gate ranges/captions):
  0/45** (all source_hints anchor on captured-baseline manifest captions, or honestly say "QC-to-confirm").
- **0 QID collisions** (within-batch, /data, goldenset). **0 ID collisions.**
- §12 rulings: archaeology = **field** (institutional independence — SAA/AIA; neuroscience precedent);
  classics = **field**; both humanities-home.

## QID-hint hallucinations caught (16) — generator hint → corrected QID

| Node | Generator hint (WRONG) | Corrected (multi-signal P31) |
|---|---|---|
| field:history | Q309 "history" (general concept, P31 empty — *the past*) | **Q1066186** "study of history" (P31 academic discipline + academic major) — Q309 rejected as the general-concept homonym the order explicitly warns about |
| subfield:paleography | Q207892 = **public law** | **Q179957** "palaeography" (P31 academic discipline) |
| subfield:epigraphy | Q83588 = **chemical engineering** | **Q181260** "epigraphy" (P31 archaeological sub-discipline) |
| subfield:computational-linguistics | Q184898 = **line sensor** | **Q182557** (P31 academic discipline + branch of linguistics) |
| subfield:discourse-analysis | Q193536 = **Cilincing (Jakarta district)** | **Q1129466** (P31 academic discipline) |
| subfield:dialectology | Q169822 = **bee pollen** | **Q146893** (P31 academic discipline + field of study) |
| subfield:psycholinguistics | Q131651 = **Elektra (Greek myth)** | **Q179488** (P31 branch of linguistics) |
| subfield:neurolinguistics | Q182870 = **Mario Puzo (author)** | **Q215948** (P31 interdisciplinary science) |
| subfield:cognitive-linguistics | Q247965 = **Mark Milligan (footballer)** | **Q508969** (P31 branch of linguistics + branch of psychology) |
| subfield:poetics | Q162940 = **diacritic** | **Q835023** (P31 academic discipline) |
| subfield:comparative-religion | Q1200529 = **Libo County, China** | **Q1075827** (P31 academic discipline) |
| subfield:systematic-theology | Q1080874 = **Jeromes Dream (screamo band)** | **Q875490** (P31 branch of theology) |
| subfield:practical-theology | Q1347763 = (empty stub) | **Q1383443** (P31 branch of theology + academic discipline) |
| subfield:military-history | Q968159 = **art movement** | **Q192781** (P31 academic discipline + branch of history) |
| subfield:cultural-history | Q60539479 = **positive emotion** | **Q858517** (P31 branch of history) |
| subfield:social-history | Q1387659 = **school of thought** | **Q908604** (P31 field of study + branch of history) |
| subfield:intellectual-history | Q1366112 = **drama television series** | **Q1195695** (P31 academic discipline + aspect of history) |
| subfield:world-history | Q1318295 = **narrative** | **Q6457238** (P31 academic discipline) |

> (18 corrections listed; field:history is a *principled rejection* of a real-but-wrong-sense entity per
> the P31 rule, the other 17 are object/homonym hallucinations. Generator self-flagged 3 of these —
> medieval-history, modern-history, discourse-analysis — and left QIDs empty/flagged for QC, which is
> the contract working as designed.)

## Period-history era-trap rulings (the order's explicit homonym warning)

- **ancient-history Q41493** — P31 = time interval + **field of study (Q1047113)** + historical period.
  Mixed era/discipline; gate-anchored (LCC D51-90, a primary division of History-General). **Reviewed**
  (field-of-study P31 present + gate). Era-mix noted.
- **medieval-history Q27992545** — P31 = field of study (Q2267705) + **academic discipline (Q11862829)**.
  Clean discipline entity (generator wrongly suspected a period-only entity). **Reviewed.**
- **modern-history** — only era entity exists (Q3281534 "modern period"); no discipline QID. **QID-less
  honest gap → proposed** (LCC D204-475 gate-anchored period sub-discipline). Cf. cogsci honest gaps.

## §12 gate rulings (append to docs/data-foundry.md §12)

1. **archaeology = field (not subfield), humanities-home.** Three gate/contrast schemes converge on
   humanities: LCC CC (class C, auxiliary sciences of history), FORD 6.1 ("History and archaeology"),
   Wikidata Q80083 P527 has-part archaeology. **Field-rank by institutional independence** (SAA ~7k,
   AIA, dedicated departments/degrees) — the neuroscience precedent (field-rank despite shelving under a
   parent class). The American 4-field-anthropology subfield tradition (SS) is the minority cross-membership
   → **§13 candidate recorded, not the home, no forced edge** (field→domain §13 has no precedent; honest
   interface closure = home assigned + cross-membership recorded).
2. **classics = field, humanities-home.** LCC PA (Classical philology, class P), Wikidata Q80083 P527
   has-part classics, Q841090 P31 academic discipline, SCS (Society for Classical Studies) institutional
   independence. No subfields modeled (standalone field; classical-philology/-archaeology = v2).
3. **paleography + epigraphy = history subfields (class C gate).** Both are LCC class C "Auxiliary Sciences
   of History" (CD, CN). Primary home = history. epigraphy's Wikidata P31 "archaeological sub-discipline"
   → §13-to-archaeology candidate recorded (gate-primary wins for the part_of home).
4. **theology divisions flattened (2-level model).** systematic-theology (BT) + practical-theology (BV)
   are traditionally divisions of theology, but the model is field→subfield (2-level) → both part_of
   field:religious-studies (flat), with the theology-nesting noted (medicine-subspecialty-flatten precedent).
5. **field:history anchored on the discipline QID, not the concept.** Q1066186 "study of history" (P31
   academic discipline) over Q309 "history"=the-past (P31 empty) — the order's explicit "general concept
   beats the discipline QID" homonym rule. Wikidata's own Q80083 P527 conflates to Q309 (noted).

## §13 / handoff resolutions (interface closure — last continent)

- **Linguistics cognitive wing (sequential payoff, decision (45)):** §13 edges created —
  psycholinguistics → field:psychology (WD Q179488 P279 psychology); cognitive-linguistics →
  subfield:cognitive-psychology (WD Q508969 P279 cognitive psychology + P31 branch of psychology);
  neurolinguistics → field:neuroscience (conf 0.85 — WD P279 names neurology Q83042/medicine as the
  clinical sibling; neuroscience is the disciplinary parent per the handoff; neurology recorded as co-candidate).
- **economic-history → field:history §13 (debt §4 resolved):** the history continent now exists; WD Q47398
  P361 history (Q309) + P31 branch of history → co-equal cross-listing (SS economics home + humanities history).
- **philosophy-of-history (Q190721, phil) → record-only (adjacent):** philosophy's metahistory, not a
  division of the history discipline — no part_of edge (conservative; boundary table "§13/record").
- **media-and-communication-studies / mass-communication (SS proposed) → SS-only confirmed (debt §2①
  resolved):** the field is empirical social science; its humanistic root (rhetoric) is a distinct node,
  not a structural membership. **No forced humanities §13.** Honest per-item ruling.
- **philosophy-of-cognitive-science / philosophy-of-race (humanities, proposed, QID-less) → no change:**
  upstream PhilPapers-slug grounding immature (decision (45) reaffirmed) — no forced promotion, gap maintained.
- **archaeology ↔ anthropology (SS):** cross-membership recorded (American 4-field tradition); no edge
  (field-level adjacency).
- **semiotics → philosophy roots:** recorded; primary home linguistics (gate), no edge.

## Hint-laundering sweep (full, 45/45)

**0 fabricated gate ranges/captions.** Every source_hint anchors on a caption present in
captured-sources.md ("captured baseline 2026-06-18") or honestly defers ("precise sub-range QC-to-confirm"
for linguistics subfields shelved by language-family in LCC P). Spot-confirmed against the manifest: D1-2027,
C1-51, D1-24.5, D51-90, D101-203, D204-475, D25-27, CB3-482, CD1-6471, CN1-1355, UDC 81`22/`23/`25/`27/`28/
`32/`33/`34/`36/`37/`42, 82.09/82.091, 808/808.5, 801.6, BL/BS/BT/BV, UDC 2/2-2/2-46, 902, 930/930.2/930.85 —
all present in the captured manifest. **Laundering 0/45.**

## Granularity / over-modeling audit

Generator deliberately excluded (confirmed correct): national/regional histories (LCC DA-DX, E-F),
individual-language literatures (PQ-PT), individual faiths as disciplines (BM/BP/BQ/BR — objects, not
disciplines), auxiliary history sciences beyond paleography/epigraphy (numismatics/genealogy/heraldry/
chronology), political/diplomatic history (D31-34, overlaps political science SS). All existing nodes
(economic-history, philosophy-of-history, hermeneutics, philosophy-of-religion, critical-theory, aesthetics,
art-history, history-of-mathematics/-computing, NLP) correctly NOT re-created. **No over-modeling drops
needed** — all 45 are gate-supported + QID-confirmed (except modern-history honest gap).

## Size / split judgment

45 nodes (vs the order's 50-80 estimate; conservative granularity landed lower). Comparable to
natural-sciences (41) and medicine (50) single-session skeletons. The expensive QC (multi-signal P31 for
all 45 + 16 corrections) is complete and tractable → **single session A, no A1/A2 split.** Edges + audit
scale with node count and are in-session. Size noted for the record.
