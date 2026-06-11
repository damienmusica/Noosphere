# Resolution report — ns-bflag-resolution-v1 (clause 6 / v1.1, the seven NS boundary contests)

- **Adjudication:** Claude Fable 5 (claude-fable-5), orchestrator session #12, 2026-06-11.
- **Collection:** Claude Sonnet (claude-sonnet-4-6) × 7 independent contexts (ADR 0007), one per
  contested node, via a sanctioned workflow fan-out. Each brief: ≥3 independent authoritative
  source classes, live-fetch duty, [UNFETCHED] honesty, anti-laundering clause, per-source stance
  semantics (supports / opposes / interface / context — interface is neither a vote for nor
  against, per the session-#5 operational interpretation).
- **Citation pre-verification (orchestrator, before adjudication):** all 52 fetched findings
  bulk-re-fetched live — **52/52 substance survived, 0 fabrications** (2 minor quote-wording
  corrections: the QD415-436 hierarchical label reads "…Organic chemistry--**Biochemistry**", not
  "Biological chemistry"; the IUGG association listing is a menu item, not prose. 2 substitute
  verifications: the abs.gov.au ANZSRC landing page does not carry division contents — replaced by
  the ARDC vocabulary API records; link.springer.com serves a challenge shell live — quotes
  verified against real Wayback snapshots, J. Geodesy `web/20250528164026`). Streak: clause-6
  research citation hallucination 0% maintained (84/84 → … → 52/52).
- **Inputs preserved:** the seven raw research briefs are retained verbatim in
  `research-briefs/` (one JSON per node) as the collection-side artifacts.

## Verdicts

| Node | Verdict | Disposition |
|---|---|---|
| field:environmental-science | **dominant** (UDC 502/504 + FORD 1.5 vs LCC GE) | node `reviewed`+indexable; edge → reviewed, conf 0.85; **no disputed**; field level confirmed; geography-side evidence parked |
| subfield:biophysics | **genuine split → §13** | physics edge retained+reviewed (0.75); **new** co-equal edge → domain:life-sciences (0.75, re-target note); node reviewed+indexable |
| subfield:biochemistry | **genuine split → §13** | chemistry edge retained+reviewed (0.75); **new** co-equal edge → domain:life-sciences (0.75, re-target note); node reviewed+indexable |
| subfield:oceanography | **dominant** (class-G cluster, consistent ruling) | node reviewed+indexable; edge reviewed 0.85; no disputed; geography-side parked |
| subfield:hydrology | **dominant** (class-G cluster, consistent ruling) | same |
| subfield:geomorphology | **dominant** (class-G cluster, consistent ruling) | same |
| subfield:geodesy | **genuine split → §13** | astronomy edge retained+reviewed (0.8); **new** co-equal edge → field:earth-sciences (0.75); node reviewed+indexable; engineering-side evidence parked (13c trigger) |

**Clause-6 cumulative: consensus 3 / dominant 12 / genuine-split-→§13 retirements 8** (no
unresolved splits; no new `disputed` — every minority position here is an other-home filing, not
a premise denial — session-#7 operational interpretation applied).

## Per-item adjudication

### 1. field:environmental-science — dominant, field level confirmed

Gate-level filings: **UDC 502/504** is a direct child of class 5 MATHEMATICS. NATURAL SCIENCES
(getrecord live, at the same depth as 51 Mathematics / 59 Zoology); **FORD 1.5** "Earth and
related Environmental sciences" sits co-equal with 1.3 Physical sciences and 1.6 Biological
sciences under 1. Natural Sciences (arrs.si live) — two gate-grade supports, and both
independently settle the registered **field-level question** in favour of field-level standing.
Opposing filing: **LCC GE1-350** under class G ("Geography. Anthropology. Recreation--
Environmental sciences", id.loc.gov live). Interfaces (not votes): Britannica "interdisciplinary
academic field that draws on…", Nature Portfolio "multidisciplinary study…", Berkeley ESPM
(multidisciplinary program in a College of Natural Resources). Context: NCES CIP files
Environmental Science (03.0104) under family 03 Natural Resources and Conservation — an applied
instructional-program framing, recorded but not gate-grade for discipline filing.
**Two-reading robustness:** interfaces-compatible 5:1; interfaces-excluded 2:1 with ≥2 supports —
dominant under both readings. **No disputed:** LCC files the discipline elsewhere; no source
denies natural-sciences membership. The LCC class-G position is recorded as **parked
geography-side membership evidence** (no geography node exists; physical geography's own
continental home is itself unresolved — writing a social-sciences-side edge would prejudge it).
The environmental-science ≠ environmental-studies distinction (Britannica, live) is recorded for
editorial use.

### 2. subfield:biophysics — genuine split → §13 dual membership

Life-sciences-side filings: **LCC QH505** hierarchical label "Science--Biology (General)--Life--
Biophysics" (id.loc.gov live; physics side gets only a see-also); **UDC 577** "Material bases of
life. Biochemistry. Molecular biology. Biophysics" under 57 Biological sciences (getrecord live).
Physics-side filings: **PhySH** (ratified gate-grade for the physics wing) carries the territory
as the discipline "Physics of Living Systems"; **MIT Physics** lists Biophysics as a named
research area (live). Interfaces: Biophysical Society mission "at the interface of the physical
and life sciences" (live); Britannica "perforce, interdisciplinary"; Berkeley's PhD program
housed in QB3, independent of any single department. **Orchestrator backstop:** Wikidata Q7100
(lastrevid 2500098582, live) carries **P31 = branch of biology (Q28598684) AND branch of physics
(Q4162444)**, P279 = biology (Q420) AND physics (Q413) — the scientific-computing Q117801
dual-filing pattern exactly. Both sides hold gate-grade ground → **genuine split**; §13 dual
membership written. Life-sciences edge targets **domain:life-sciences directly** (no field:biology
yet) with a re-target note (mathematics-education / quantum-computing precedent). No disputed.

### 3. subfield:biochemistry — genuine split → §13 dual membership

Chemistry-side filing: **LCC QD415-436** "Science--Chemistry--Organic chemistry--Biochemistry"
(id.loc.gov live — the lone but unambiguous gate-scheme chemistry filing). Life-sciences-side:
**UDC 577** under 57 (live); Britannica breadcrumb files the article under Science > Biology >
Branches of Biology (live, JSON-LD); **Wikidata Q7094** P31 = interdisciplinary science
(Q1665984) + **branch of chemistry (Q11790203) + branch of biology (Q28598684)** (wbgetentities
live); ASBMB self-describes its community as "molecular life scientists" (live); departments at
UW-Madison (College of Agricultural and Life Sciences) and MIT (Department of Biology) house the
field on the life-science side (live). Gate schemes split head-on (LCC chemistry vs UDC biology) +
upstream dual filing → **genuine split**; §13 dual membership, life-sciences edge with re-target
note. No disputed.

### 4–6. The class-G cluster — oceanography, hydrology, geomorphology (one consistent ruling)

The generator's consistency request is honoured: the three are adjudicated as one cluster, and
the evidence is structurally identical across them. Supporting: **UDC 551.46 / 556 / 551.4** all
under 55 Earth Sciences (getrecord live); **FORD 1.5** (live) with the national FORD
implementation **ANZSRC 2020** filing 3708 Oceanography / 3707 Hydrology / 370901 Geomorphology
under division **37 EARTH SCIENCES** (ARDC vocabulary API live); **Britannica** breadcrumbs file
all three under Earth Sciences (live); institutional homes are geoscience units (Scripps; MIT
EAPS; IUGG/IAHS; UT Austin Jackson School; U Arizona Hydrology & Atmospheric Sciences in the
College of Science; EGU's Geomorphology division sits among earth-science peer divisions — all
live). Opposing: **LCC** files all three in class G (GC1-1581 "Geography. Anthropology.
Recreation--Oceanography"; GB ranges for hydrology/geomorphology) — the same single-scheme
position in all three cases. Interfaces: HESS journal framing; IAG-adjacent IAG/IGU dual
collaborations for geomorphology. **Two-reading robustness:** ≥4:1 and 2-gate:1-gate in every
item, both readings. **Ruling (cluster-consistent):** dominant earth-sciences membership; nodes
reviewed; **no disputed** (LCC's class-G shelving is an other-home filing toward a geography node
that does not exist — parked as future geography-side §13 evidence, the same parking for all
three plus environmental-science). LCC class-G is thereby interpreted once, identically, for the
whole cluster — recorded as a §12 precedent line.

### 7. subfield:geodesy — genuine split → §13 dual membership

Astronomy-side filings (both gate schemes): **LCC QB275-343** "Science--Astronomy--Geodesy"
(id.loc.gov live); **UDC 528** inside 52 "Astronomy. Astrophysics. Space research. Geodesy"
(getrecord live). Earth-sciences-side filings: **ANZSRC 2020 FoR 370603 Geodesy** under division
37 EARTH SCIENCES (ARDC API live — FORD-family classification filing); the discipline's own
international association **IAG** is a constituent of **IUGG** and defines geodesy as measuring
the Earth's size, shape, gravity field and rotation as a function of space and time (live);
Springer's **Journal of Geodesy** is categorized under Geophysics / Earth Sciences
(Wayback-verified snapshot 20250528164026). Both sides carry classification + community ground →
**genuine split**; §13 dual membership. **Nesting note:** ANZSRC nests geodesy under 3706
Geophysics, but the nesting is contradicted by both gate schemes (astronomy filing) and by IUGG's
geodesy–geophysics peer structure → the membership edge targets **field:earth-sciences** directly
(CIS contradiction-nesting rule). **Engineering side:** TU Delft houses geodesy in its Faculty of
Civil Engineering and Geosciences (live) — real but secondary; recorded as a **parked
engineering-continent §13 trigger** for the upcoming engineering session. No disputed.

## Cross-cutting records

- **Edge effects:** 7 capped edges promoted to `reviewed`; 3 new §13 co-equal membership edges
  written (`biophysics-part-of-life-sciences`, `biochemistry-part-of-life-sciences`,
  `geodesy-part-of-earth-sciences`), all with externally-sourced live-verified evidence
  (edge promotion policy v1 clause 1; §13 same-discipline-of-evidence guard).
- **Source registered:** `source:anzsrc` (ANZSRC 2020 FoR, ABS via ARDC vocabulary service,
  CC BY 4.0 — license verified live at abs.gov.au).
- **Golden set:** unchanged (no QID changes; all seven anchors were resolver-verified in
  session #11 and are already golden-set entries).
- **Parked items added:** geography-side membership evidence for environmental-science +
  class-G trio (await a future geography node, whose own continental home is unresolved);
  TU Delft engineering-side evidence for geodesy (13c trigger).
- **Querystring URLs** (UDC getrecord, ARDC API, wbgetentities, NCES CIP) are known
  SPN-incompatible; their observed content is quoted verbatim above and in the briefs
  (Wikidata states pinned by lastrevid). SPN results for the snapshot-compatible URLs are in the
  session's consolidated ledger (appended to this batch after the serial pass).

### SPN ledger (session #12 serial pass — appended)

(see consolidated table appended at end of session)
