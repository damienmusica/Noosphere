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

**Session-#12 consolidated pass: 146 snapshot-compatible URLs processed — 22 fresh SPN archives + 120 existing snapshots verified = 142/146 (97.3%); 4 save-timeouts → retry queue; 16 querystring URLs recorded SPN-incompatible (§8). Strategy: existing-snapshot-first (fast, throttle-immune), saves only for the residue with a 25s timeout — the save endpoint opened with immediate 520s/hangs and recovered mid-pass.**

| URL | status | snapshot / note |
|---|---|---|
| https://id.loc.gov/authorities/classification/GE1.json | archived (SPN) | https://web.archive.org/web/20260611075310/https://id.loc.gov/authorities/classification/GE1.json |
| https://id.loc.gov/authorities/classification/G.json | existing snapshot verified | https://web.archive.org/web/20230605174120/https://id.loc.gov/authorities/classification/G.json |
| https://udcsummary.info/php/getrecord.php?id=5&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://udcsummary.info/php/getrecord.php?id=502&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp | (reused session-#11 snapshot) | see natural-sciences-skeleton-v1 ledger |
| https://www.britannica.com/science/environmental-science | existing snapshot verified | https://web.archive.org/web/20251217002308/https://www.britannica.com/science/environmental-science |
| https://www.nature.com/subjects/environmental-sciences | existing snapshot verified | https://web.archive.org/web/20260317033121/https://www.nature.com/subjects/environmental-sciences |
| https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cip=03.0104 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://nces.ed.gov/ipeds/cipcode/cipdetail.aspx?y=56&cip=03 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://ourenvironment.berkeley.edu/about | existing snapshot verified | https://web.archive.org/web/20260311183021/https://ourenvironment.berkeley.edu/about |
| https://evsc.as.virginia.edu/ | existing snapshot verified | https://web.archive.org/web/20260422044811/https://evsc.as.virginia.edu/ |
| https://www.wikidata.org/wiki/Special:EntityData/Q188847.json | existing snapshot verified | https://web.archive.org/web/20260611054205/https://www.wikidata.org/wiki/Special:EntityData/Q188847.json |
| https://id.loc.gov/authorities/classification/QH505.json | archived (SPN) | https://web.archive.org/web/20260611075333/https://id.loc.gov/authorities/classification/QH505.json |
| https://udcsummary.info/php/getrecord.php?id=577&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://physh.org/disciplines | (reused session-#11 snapshot) | see natural-sciences-skeleton-v1 ledger |
| https://physh.org/about | existing snapshot verified | https://web.archive.org/web/20260611023705/https://physh.org/about |
| https://physics.mit.edu/research/ | existing snapshot verified | https://web.archive.org/web/20260405093800/https://physics.mit.edu/research/ |
| https://www.biophysics.org/what-is-biophysics | existing snapshot verified | https://web.archive.org/web/20260510120006/https://www.biophysics.org/what-is-biophysics |
| https://www.biophysics.org/about-bps/mission-vision | existing snapshot verified | https://web.archive.org/web/20250913135640/https://www.biophysics.org/about-bps/mission-vision |
| https://www.britannica.com/science/biophysics | existing snapshot verified | https://web.archive.org/web/20260220123816/https://www.britannica.com/science/biophysics |
| https://qb3.berkeley.edu/biophysics/ | existing snapshot verified | https://web.archive.org/web/20260519125701/https://qb3.berkeley.edu/biophysics/ |
| https://link.springer.com/journal/249/aims-and-scope | existing snapshot verified | https://web.archive.org/web/20260315043031/https://link.springer.com/journal/249/aims-and-scope |
| https://www.wikidata.org/wiki/Q7100 | existing snapshot verified | https://web.archive.org/web/20260226193838/https://www.wikidata.org/wiki/Q7100 |
| https://id.loc.gov/authorities/classification/QD415-QD436.json | existing snapshot verified | https://web.archive.org/web/20250426205819/https://id.loc.gov/authorities/classification/QD415-QD436.json |
| https://udcsummary.info/php/getrecord.php?id=57&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://udcsummary.info/php/getrecord.php?id=54&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.britannica.com/science/biochemistry | existing snapshot verified | https://web.archive.org/web/20260519075413/https://www.britannica.com/science/biochemistry |
| https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q7094&props=claims&format=json | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.asbmb.org/about | existing snapshot verified | https://web.archive.org/web/20260506045100/https://www.asbmb.org/about |
| https://www.biochem.wisc.edu/ | existing snapshot verified | https://web.archive.org/web/20260413024400/https://biochem.wisc.edu/ |
| https://www.biochem.wisc.edu/about | existing snapshot verified | https://web.archive.org/web/20260310104606/https://biochem.wisc.edu/about/ |
| https://biology.mit.edu/research/biochemistry/ | **[SPN-FAILED]** (save-timeout) | retry queue |
| https://biochemistry.stanford.edu/ | existing snapshot verified | https://web.archive.org/web/20260604024610/http://biochemistry.stanford.edu/ |
| https://link.springer.com/journal/10541/aims-and-scope | existing snapshot verified | https://web.archive.org/web/20260114080418/https://link.springer.com/journal/10541/aims-and-scope |
| https://id.loc.gov/authorities/classification/GC1-GC1581.json | existing snapshot verified | https://web.archive.org/web/20250522235052/https://id.loc.gov/authorities/classification/GC1-GC1581.json |
| https://udcsummary.info/php/getrecord.php?id=551.46&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://udcsummary.info/php/getrecord.php?id=55&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release | existing snapshot verified | https://web.archive.org/web/20260602082333/https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/latest-release |
| https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/2020/anzsrc2020_for.xlsx | existing snapshot verified | https://web.archive.org/web/20250413200908/https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/2020/anzsrc2020_for.xlsx |
| https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/2020/anzsrc2020for_ford_correspondence.xlsx | existing snapshot verified | https://web.archive.org/web/20250123154849/https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-research-classification-anzsrc/2020/anzsrc2020for_ford_correspondence.xlsx |
| https://www.britannica.com/science/oceanography | existing snapshot verified | https://web.archive.org/web/20260426144746/https://www.britannica.com/science/oceanography |
| https://scripps.ucsd.edu/about | existing snapshot verified | https://web.archive.org/web/20260602230635/https://scripps.ucsd.edu/about |
| https://eapsweb.mit.edu/about | existing snapshot verified | https://web.archive.org/web/20240606161522/http://eapsweb.mit.edu/about |
| https://id.loc.gov/authorities/classification/GB651.json | archived (SPN) | https://web.archive.org/web/20260611075436/https://id.loc.gov/authorities/classification/GB651.json |
| https://id.loc.gov/authorities/classification/GB651-GB2998.json | existing snapshot verified | https://web.archive.org/web/20260124134810/https://id.loc.gov/authorities/classification/GB651-GB2998.json |
| https://id.loc.gov/authorities/classification/GB3-GB5030.json | archived (SPN) | https://web.archive.org/web/20260611075459/https://id.loc.gov/authorities/classification/GB3-GB5030.json |
| https://id.loc.gov/authorities/classification/GC1.json | archived (SPN) | https://web.archive.org/web/20260611075521/https://id.loc.gov/authorities/classification/GC1.json |
| https://id.loc.gov/authorities/classification/GB400.json | archived (SPN) | https://web.archive.org/web/20260611075544/https://id.loc.gov/authorities/classification/GB400.json |
| https://udcsummary.info/php/getrecord.php?id=556&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.britannica.com/science/hydrology | existing snapshot verified | https://web.archive.org/web/20260303110058/https://www.britannica.com/science/hydrology |
| https://www.hydrology-and-earth-system-sciences.net/about/aims_and_scope.html | existing snapshot verified | https://web.archive.org/web/20260521100408/https://www.hydrology-and-earth-system-sciences.net/about/aims_and_scope.html |
| https://www.iugg.org/associations/ | existing snapshot verified | https://web.archive.org/web/20240912154013/http://www.iugg.org/associations/ |
| https://www.egu.eu/divisions/ | **[SPN-FAILED]** (save-timeout) | retry queue |
| https://www.jsg.utexas.edu/research/ | existing snapshot verified | https://web.archive.org/web/20260519224021/https://www.jsg.utexas.edu/research |
| https://has.arizona.edu/about | existing snapshot verified | https://web.archive.org/web/20240801112434/https://has.arizona.edu/about/ |
| https://has.arizona.edu/about/vision-and-mission | **[SPN-FAILED]** (save-timeout) | retry queue |
| https://api.openalex.org/topics?search=hydrology&per_page=3 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://id.loc.gov/authorities/classification/GB400-GB649.json | archived (SPN) | https://web.archive.org/web/20260611075731/https://id.loc.gov/authorities/classification/GB400-GB649.json |
| https://udcsummary.info/php/getrecord.php?id=551.4&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://vocabs.ardc.edu.au/repository/api/lda/anzsrc-2020-for/concept?labelcontains=Geomorphology&_format=json | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.britannica.com/science/geomorphology | existing snapshot verified | https://web.archive.org/web/20260520005920/https://www.britannica.com/science/geomorphology |
| https://www.geomorph.org/ | existing snapshot verified | https://web.archive.org/web/20260521051653/https://www.geomorph.org/ |
| https://www.geomorph.org/about/ | existing snapshot verified | https://web.archive.org/web/20210609032937/http://www.geomorph.org/About |
| https://www.egu.eu/gm/ | existing snapshot verified | https://web.archive.org/web/20260316210322/https://www.egu.eu/gm/ |
| https://id.loc.gov/authorities/classification/GC201.json | archived (SPN) | https://web.archive.org/web/20260611075752/https://id.loc.gov/authorities/classification/GC201.json |
| https://id.loc.gov/authorities/classification/QB275-QB343.json | archived (SPN) | https://web.archive.org/web/20260611075247/https://id.loc.gov/authorities/classification/QB275-QB343.json |
| https://id.loc.gov/authorities/classification/QB275.json | archived (SPN) | https://web.archive.org/web/20260611075815/https://id.loc.gov/authorities/classification/QB275.json |
| https://udcsummary.info/php/getrecord.php?id=528&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://udcsummary.info/php/getrecord.php?id=52&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://geodesy.science/geodesy-earth-iag/ | existing snapshot verified | https://web.archive.org/web/20260228024952/https://geodesy.science/geodesy-earth-iag/ |
| https://geodesy.science/about-geodesy/ | existing snapshot verified | https://web.archive.org/web/20260609200317/https://geodesy.science/about-geodesy/ |
| https://link.springer.com/journal/190/aims-and-scope | existing snapshot verified | https://web.archive.org/web/20260610101028/https://link.springer.com/journal/190/aims-and-scope |
| https://www.tudelft.nl/en/ceg | existing snapshot verified | https://web.archive.org/web/20260603160034/https://www.tudelft.nl/en/ceg/ |
| https://www.tudelft.nl/citg/over-faculteit/afdelingen/geoscience-remote-sensing | existing snapshot verified | https://web.archive.org/web/20240817161830/https://www.tudelft.nl/citg/over-faculteit/afdelingen/geoscience-remote-sensing |
| https://www.iugg.org/iag/ | existing snapshot verified | https://web.archive.org/web/20051125121805/http://www.iugg.org/iag |
| https://www.iugg.org/ | existing snapshot verified | https://web.archive.org/web/20260509224440/https://iugg.org/ |
| https://link.springer.com/journal/40328/aims-and-scope | existing snapshot verified | https://web.archive.org/web/20250928011138/https://link.springer.com/journal/40328/aims-and-scope |

