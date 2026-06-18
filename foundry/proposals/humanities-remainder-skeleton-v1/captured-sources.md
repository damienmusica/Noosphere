# Captured classification sources — humanities-remainder skeleton v1

> Orchestrator pre-capture (session #23, 2026-06-18), decision (30) precedent +
> (34)⑥(a) skeleton order template + hum-A order task 1 manifest clause.
> Humanities has **no single gate scheme** (unlike cogsci's BF or medicine's R),
> so multiple LCC classes + UDC + FORD + Wikidata were live-captured **before**
> generation and injected into the manifest as grounding. The generator must
> anchor every node's `source_hint` on captions present in this file —
> "captured baseline 2026-06-18". Live-captured, never label-matched (decision (9)).
> Reachability verified at session start: Wikidata 200 / id.loc.gov 200 /
> OpenAlex 200 / Wikipedia REST 200.

## Gate scheme — LCC humanities classes (id.loc.gov / loc.gov outlines)

### Class C — Auxiliary Sciences of History
Source: `https://www.loc.gov/aba/cataloging/classification/lcco/lcco_c.pdf` (captured 2026-06-18).
- C (C1-51) — Auxiliary Sciences of History (General)
- **CB (CB3-482) — History of Civilization** (cultural history adjacent)
- **CC (CC1-960) — Archaeology** (§12 gate — also SS/anthropology adjacent)
- **CD (CD1-6471) — Diplomatics. Archives. Seals** (→ paleography, archival science)
- CE (CE1-97) — Technical Chronology. Calendar (historical chronology)
- **CJ (CJ1-6661) — Numismatics**
- **CN (CN1-1355) — Inscriptions. Epigraphy**
- CR (CR1-6305) — Heraldry
- **CS (CS1-3090) — Genealogy**
- **CT (CT21-9999) — Biography** (→ historiography/biography as genre/method)

### Class D — World History and History of Europe, Asia, Africa, etc.
Source: `https://www.loc.gov/aba/cataloging/classification/lcco/lcco_d.pdf` (captured 2026-06-18).
Subclass D = **History (General)** holds the *period + thematic discipline axis* (D1-2027):
- **D1-24.5 General** (history as discipline / historiography / philosophy of history)
- **D25-27 Military and naval history** (→ military-history; naval-history sub)
- **D31-34 Political and diplomatic history** (→ caution: political history overlaps political science SS)
- **D51-90 Ancient history**
- **D101-203 Medieval history** (medieval and modern, 476-)
- **D(204)-(475) Modern history** (1453-1648 and forward)
- D501-680 World War I · D731-838 World War II · D839-2027 20th-21st c. / regional
- DA-DX subclasses = **geographic/national history** (DA Great Britain, DC France, DD Germany,
  DE Greco-Roman world, DF Greece, DG Italy, DK Russia, DS Asia, DT Africa, DU Oceania…) —
  **regional shelving, NOT discipline subfields** (over-modeling caution; national history = v2).

### Class E-F — History of the Americas
Source: `https://www.loc.gov/catdir/cpso/lcco/lcco_ef.pdf` (captured 2026-06-18; note `catdir` path,
not `aba`). E 11-143 America / E 151-904 United States / F regional (Canada, Latin America).
**Purely geographic/national** — confirms history discipline subfields come from C + D-General +
Wikidata/FORD, not E-F. No discipline nodes from E-F (regional-history axis, v2 if ever).

### Class B (religion section BL-BX) — gate for religious studies / theology
Source: `https://www.loc.gov/aba/cataloging/classification/lcco/lcco_b.pdf` (captured 2026-06-18).
**BC-BD (logic/metaphysics/epistemology) and BF (psychology) are NOT humanities-remainder** —
BC-BD = philosophy (first continent, done); BF = cognitive sciences (tenth continent, done).
**BJ Ethics = philosophy (done, FORD 6.3 "ethics").** Religion subclasses:
- **BL — Religions. Mythology. Rationalism** (→ religious-studies / comparative-religion /
  history-of-religions / phenomenology-of-religion; *BL51 philosophy of religion = philosophy, done → §13*)
- **BM — Judaism** · **BP — Islam. Bahaism. Theosophy** · **BQ — Buddhism** (religion-tradition objects;
  caution: traditions ≠ academic disciplines — model the *study*, not each faith)
- **BR — Christianity (General)** · **BS — The Bible** (→ biblical-studies)
- **BT — Doctrinal Theology** (→ systematic/dogmatic theology) · **BV — Practical Theology**
  (→ practical/pastoral theology) · **BX — Christian Denominations** (denomination objects, not disciplines)

### Class P — Language and Literature
Source: `https://www.loc.gov/aba/cataloging/classification/lcco/lcco_p.pdf` (captured 2026-06-18).
- **P — Philology. Linguistics (General)** = the **linguistics gate**. Includes:
  *Science of language (Linguistics)*, *Comparative grammar*, *Semiotics. Signs and symbols*,
  *Language acquisition*, *Semantics*, *Etymology*, *Lexicography*, *Discourse analysis*,
  *Dialects. Provincialisms*, *Computational linguistics. Natural language processing*,
  *Translating and interpreting*. (Note: LCC P is organized by **language family**, so the
  subfield axis — phonetics/phonology/morphology/syntax — is thin here → cross-checked via UDC 81.)
- **PA — Classical philology** (Greek + Latin language & literature) = **classics gate**
- PB-PM = modern/oriental language families (PB Celtic/modern European, PC Romance, PD-PF Germanic,
  PE English, PG Slavic, PH Uralic, PJ Semitic/Oriental, PK Indo-Iranian, PL E.Asia/Africa,
  PM indigenous American/artificial) — **individual languages, over-modeling caution (v2)**
- **PN — Literature (General)** = **literary-studies gate** (literary history, criticism,
  *Comparative literature*, drama/poetry/fiction theory, journalism, rhetoric-adjacent)
- PQ-PT = national literatures (PQ Romance, PR English, PS American, PT Germanic) — **over-modeling (v2)**

## Contrast scheme — UDC

Source: `https://udcsummary.info/php/index.php?tag=<N>&lang=en` (UDC Summary dTree, captured 2026-06-18).

### UDC 80/81 — Philology / Linguistics (the subfield axis LCC P lacks)
- **80 Philology** (general questions of both linguistics and literature); **808 Rhetoric**
  (808.5 rhetoric of speech) ; 801.6 prosody
- **81 Linguistics and languages**
  - 81-11 Schools/trends (81-112 **diachronic/historical**, 81-114 synchronic, 81-116 structuralism)
  - 81`1 General linguistics · 81`22 **Semiotics** · 81`23 **Psycholinguistics** (§13 cogsci) ·
    81`25 **Translation theory** · 81`26 Language planning · 81`27 **Sociolinguistics** ·
    81`28 **Dialectology / areal linguistics** · 81`32 **Mathematical/computational linguistics** ·
    81`33 **Applied linguistics** · 81`34 **Phonetics. Phonology** · 81`36 **Grammar** (morphology/syntax) ·
    81`37 **Semantics** · 81`38 Stylistics · 81`42 **Text linguistics / Discourse analysis**
  - 811 Languages (individual — over-modeling, v2)

### UDC 82 — Literature
- 82-1/-9 literary **forms/genres** (poetry, drama, fiction, essay) — *form objects, not disciplines*
- **82.02 Literary schools, trends and movements**
- **82.09 Literary criticism. Literary studies** (the discipline)
- **82.091 Comparative literary studies. Comparative literature**
- 821 literatures of individual languages (over-modeling, v2)

### UDC 2 — Religion. Theology
- 2-1 Theory and philosophy of religion (*philosophy of religion = philosophy, done*)
- 2-2 Evidences / sacred books / scriptures (biblical-studies adjacent)
- 2-4 Religious practice (2-42 **moral theology** = ethics/phil done; 2-46 **pastoral/practical theology**)
- (UDC 2 is faceted on religion-*objects*; discipline axis better from LCC BL-BX + FORD 6.3)

### UDC 9 — Geography. Biography. History
- **902 Archaeology** · **903 Prehistory** · 904 Cultural remains of historical times · 908 Area studies
- 92 Biographical studies. Genealogy. Heraldry
- **93/94 History** · **930 Science of history. Historiography** (930.1 history as a science,
  930.2 **methodology / ancillary historical sciences**, 930.25 archivistics, **930.85 cultural history**) ·
  94 General history
- **CAUTION:** UDC 9 also holds **geography (91x)** — geography is SS/NS home (boundary table),
  NOT humanities-remainder. Record only on discovery.

## Contrast scheme — OECD FORD 6 (Humanities, Frascati)

Source: `https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp` (ARRS Frascati FORD, captured
2026-06-18 — the live page exposes the **6.1-6.5 numeric nodes**; detailed sub-area labels were not
enumerated beyond the section level on the live page, recorded honestly per decision (9)). Section labels
(well-established Frascati humanities division, used as contrast only):
- **6.1 History and archaeology**
- **6.2 Languages and literature** (linguistics + literary studies)
- **6.3 Philosophy, ethics and religion** (*philosophy + ethics = done → religion remainder this session*)
- **6.4 Arts** (*arts-and-design continent done → no generate*)
- **6.5 Other humanities**

> FORD places humanities-remainder squarely as a humanities domain (6.x). Skeleton hierarchy follows
> LCC + Wikidata Q80083; FORD is contrast only.

## Wikidata Q80083 (humanities) — domain anchor structure

Source: `https://www.wikidata.org/wiki/Special:EntityData/Q80083.json` (captured 2026-06-18,
lastrevid 2505431419). Label "humanities", desc "study of human culture and society".
- **P279 (subclass of):** social sciences and humanities (Q33122512) · academic discipline (Q11862829)
- **P527 (has part):** anthropology (Q23404, *SS-owned*) · **archaeology (Q23498, §12 gate)** ·
  **classics (Q841090, §12 gate)** · **history (Q309, owned)** · **linguistics (Q8162, owned)** ·
  political philosophy (Q179805, *philosophy done*) · **literary theory (Q459381 → literary-studies, owned)** ·
  philosophy (Q5891, *done*) · **religious studies (Q34187, owned)** · arts (Q2018526, *done*)

> The hexagon confirms humanities-remainder **owns** history, linguistics, literary studies, religious
> studies; **§12-gates** archaeology + classics; and **does not build** anthropology (SS), philosophy/
> political-philosophy (done), arts (done).

### Wikidata linguistics Q8162 P527 (subfield axis with QIDs)
Source: `Special:EntityData/Q8162.json` (captured 2026-06-18). P527 (has part), all P31 ⊃ Q66745531
"branch of linguistics": **phonology Q40998 · morphology Q38311 · syntax Q37437 · semantics Q39645 ·
pragmatics Q181839 · phonetics Q35395** (+ morphophonology Q661093, morphosyntax Q1428721 = sub-sub,
skip; grammar Q8091 = concept). history Q309 / religious-studies Q34187 / literary-theory Q459381 have
empty P527 — subfield axis for those from LCC/UDC/FORD above.

## Pre-resolved candidate QIDs (orchestrator live multi-signal, 2026-06-18 — resolver v4 re-confirms at QC)

Field anchors: **history Q309 · linguistics Q8162 · religious-studies Q34187 · literary-studies Q208217 ·
classics Q841090**. (literary-theory Q459381 = subfield, distinct from the field literary-studies Q208217.)
Subfield candidates with live QIDs:
- **Linguistics:** phonetics Q35395 · phonology Q40998 · morphology Q38311 · syntax Q37437 ·
  semantics Q39645 · pragmatics Q181839 · semiotics Q60195 · sociolinguistics Q160845 ·
  historical-linguistics Q190375 · applied-linguistics Q321249 · translation-studies Q501778
- **Literary studies:** literary-theory Q459381 · literary-criticism Q58854 ·
  comparative-literature Q834903 · narratology Q382451 · rhetoric Q81009
- **History:** historiography Q50675 · ancient-history Q41493 · archaeology Q23498
- **Religion/theology:** theology Q34178 · biblical-studies Q794605

> **★ HOMONYM / PERIOD-ENTITY TRAPS (resolver + QC must check P31 = academic discipline / field of study):**
> - **modern-history**: `Q3281534` = "modern period" (era ENTITY, not discipline — cf. early-modern-philosophy
>   Q16966481 era-entity audit precedent). Period-history nodes (ancient/medieval/modern) risk era-vs-discipline
>   confusion. **Honest QID-less gap if no discipline entity** — do not bind an era QID.
> - **medieval-history**: `Q27992545` = "history during the Middle Ages" — verify discipline vs period.
> - Journals win label matches: history→Q603149 (journal), linguistics→Q6554075 (journal),
>   religious-studies→Q7311311 (journal), comparative-literature→Q15767407 (journal),
>   biblical-studies→Q30149195 (concept), translation-studies→Q140038139 (journal). **search rank-1 ≠ discipline**
>   for several — multi-signal P31, never bare-QID.
> - "history"/"literature"/"religion"/"classics" general concepts & **language/ethnonym objects** (an
>   individual language is not a linguistic subfield; a faith is not a religious-studies discipline).

## Boundary pre-assignments + handoff (humanities-remainder special discipline — mandatory generator input)

Strict-sequential round 3 (decision (43)①); humanities-remainder is the **last academic continent**, so
**all remaining interfaces close here**. Generate nodes ONLY for what the table marks "create"; the rest is
§13 or record-only. On discovery, follow this table — do not negotiate.

| Item | Handling | Basis |
|---|---|---|
| **History** (history + auxiliary sciences + world/period history) | **owned — create nodes** | LCC C/D/E-F gate, UDC 93/94+930, FORD 6.1, Wikidata Q309. **economic-history (Q47398, SS reviewed — EXISTS)** + **philosophy-of-history (Q190721, phil reviewed — EXISTS)** = **§13/record, NEVER re-create.** Period nodes (ancient/medieval/modern) = era-vs-discipline P31 check. |
| **Linguistics** (linguistics core + subfields) | **owned — create nodes + §13 cognitive wing** | round-1 "linguistics = humanities-remainder". LCC P + UDC 81. **★ COGNITIVE INTERFACE (sequential payoff, decision (45)):** psycholinguistics → §13 to **existing** `subfield:cognitive-psychology`/`field:psychology` · neurolinguistics → §13 to **existing** `field:neuroscience`/`subfield:cognitive-neuroscience` · cognitive-linguistics → §13 to **existing** `subfield:cognitive-psychology`. **Cognitive wing nodes ARE created by humanities-remainder; dual membership is §13 against cogsci home.** |
| **Literary studies** (literary studies + theory + comparative lit) | **owned — create nodes** | LCC PA-PT/PN, UDC 82.09/82.091, FORD 6.2, Wikidata Q208217. **★ GRANULARITY:** prefer *research-field* nodes (comparative-literature, literary-theory, narratology, rhetoric, literary-criticism); **individual-language/ethnic literatures (English lit, Korean lit…) = v2 candidate (over-modeling avoidance).** Test critical-theory (phil done) vs §12 overlap; hermeneutics (Q102686, phil reviewed — EXISTS) → §13/record. |
| **Religious studies / theology** | **owned — create nodes** | LCC BL-BX, UDC 2, FORD 6.3, Wikidata Q34187. philosophy-of-religion (Q209295, phil reviewed — EXISTS) = §13/record. Theology subfields (systematic/biblical/practical) v2-granularity caution. **PSEUDO-ADJACENT CAUTION:** non-academic religious movements have `academic_status` contest (homeopathy/naturopathy precedent — regulated/lived practice ≠ academic knowledge); a *faith* is an object, the *study* of it is the discipline. esotericism-and-theosophy (Q7988481, proposed parked) = do NOT touch (modeling decision pending, B-flag ② parked). |
| **Classics / Archaeology** | **§12 case-by-case gate** | classics (Q841090): LCC PA-friendly humanities → likely owned. archaeology (Q23498): FORD 6.1 (humanities) BUT anthropology (SS) adjacent — **gate-scheme decides home**; if SS-home, §13. physical-anthropology (Q27172, SS proposed) is a separate life §13 micropass (debt §2①) — do NOT conflate. |
| **media-and-communication-studies (Q11680831) · mass-communication (Q853710)** | **SS proposed — §13 resolve (no create)** | debt §2① "SS, humanities-remainder §13 (round 3)". **This session is the resolution trigger:** keep SS home + add humanities §13 IF a communication/media discipline is a genuine humanities interface (rhetoric/media-studies humanistic side), OR confirm SS-only. **Per-item honest ruling, no forced §13.** |
| **philosophy-of-cognitive-science · philosophy-of-race (humanities, proposed, QID-less)** | **resolution trigger (no create, no forced promotion)** | decision (45): upstream PhilPapers-slug grounding immature/unchanged → **maintain gap, no forced promotion.** Record §13 candidates only (editorial stage). Re-judge if grounding matured. |
| **Philosophy (whole) + ethics** | **do NOT create — exists (first continent)** | `field:philosophy` + 62 subfields incl. full ethics cluster (ethics Q9465, metaethics, normative/applied/bio/business/environmental ethics, aesthetics, hermeneutics, pragmatism, philosophy-of-*) reviewed. FORD 6.3 ethics = done. Interfaces = §13/adjacent only. |
| **Arts (arts-and-design)** | **do NOT create — exists (continent)** | arts-and-design done (art-history Q50637 etc.). Music/art history vs practice = §12/§13 per-item, no re-create. |
| **Geography** | **do NOT create / park** | debt §4 "geography node absent". UDC 9 geography (human-geography Q12831143 SS, economic-geography, geomorphology NS — EXIST elsewhere) is SS/NS home, not humanities-remainder. Record only on discovery. |

### Existing /data nodes to reconcile against (NEVER re-propose — reconcile to these IDs)
- `domain:humanities` (Q80083, reviewed) — the parent; this skeleton fills its non-philosophy children.
- **Philosophy (do not recreate):** `field:philosophy` (Q5891) + `subfield:philosophy-of-history` (Q190721),
  `subfield:philosophy-of-religion` (Q209295), `subfield:hermeneutics` (Q102686), `subfield:aesthetics` (Q35986),
  `subfield:ethics` (Q9465) + ethics cluster, `subfield:pragmatism` (Q126692), `subfield:esotericism-and-theosophy`
  (Q7988481, **proposed — parked, do not touch**), `subfield:philosophy-of-cognitive-science` /
  `subfield:philosophy-of-race` (QID-less proposed — resolution triggers).
- **SS (do not recreate; §13 targets):** `field:anthropology` (Q23404), `subfield:cultural-anthropology` (Q28598),
  `subfield:physical-anthropology` (Q27172, proposed), `subfield:economic-history` (Q47398), `field:human-geography`
  (Q12831143), `subfield:economic-geography` (Q187097), `field:media-and-communication-studies` (Q11680831, proposed),
  `subfield:mass-communication` (Q853710, proposed).
- **Cognitive sciences (§13 targets for linguistics cognitive wing):** `field:psychology`, `field:neuroscience`,
  `subfield:cognitive-psychology`, `subfield:cognitive-neuroscience` (reviewed, session #21).
- **Arts (do not recreate):** `subfield:art-history` (Q50637).
- **Other domains' history-of-X (do not recreate):** `subfield:history-of-computing` (Q2735691, CIS),
  `subfield:history-of-mathematics` (Q185264, FS).

### living-person strict (special discipline)
Skeleton = *discipline* nodes (field/subfield) only — person nodes out of round scope. Humanities is dense with
named thinkers/authors/historians → never confuse a discipline name with a person name (multi-signal P31).
Summaries (session B) handle living researchers with strong-evidence + conservative wording.

### Tension preservation (decision (42)① — immediate effect, round-3 binding)
Humanities is rich in **interpretive contests / critical schools** (formalism↔historicism, analytic↔continental
adjacency, canon debates). The A skeleton is part_of-primary, but if a proposition-edge (critiques / influenced)
arises naturally: preserve opposing/minority views (`disputed:true` + note + co-existing edges), correct only
identity/referent-axis errors, never delete or unify. The *first proposition-edge PR* carries the
docs/data-foundry.md tension-preservation codification (policy ahead of work) — deferred through cogsci (no
proposition-edge arose); if none arises here, defer again. (42)② measurement ledger: log paradox / perspective-
qualified cases not expressible via disputed+note (new fields 0 — measure only). Humanities (canon/interpretive
plurality) is the most likely first-occurrence point.
