# OpenAlex round-1 pre-validation + write-in — openalex-round1-prevalidation-v1

- **By:** Claude Fable 5 (claude-fable-5), orchestrator session #16, 2026-06-12.
- **Policy:** B-track standing policy (vault decision log 2026-06-11 (27)) — pre-validation
  report → **write proceeds in the same session because no escalation trigger fired** (assessment
  below). Generation of the comparison table is now **scripted** per decision (34)⑥(b)
  (`scripts/foundry/openalex-prevalidate.ts`, first permanent B-track tool — committed; the
  network query runs maintainer-local only, CI stays network-free, output lands in gitignored
  `dist/`). Manual-path rulings (dup-link resolution, skips) remain the orchestrator's.
- **Scope: 98 nodes** — the round-1 new reviewed field/subfield nodes that carried no
  external_metrics (SS 30 · ENG 28 · Arts 23 · LS 17; domain nodes excluded — discipline-group
  entities are not OpenAlex measurement targets). debt-ledger-round1.md §5.

## Dashboard

| Metric | Value |
|---|---|
| rank-1 (search rank-1 wikidata == node QID, prior-definition metric) | **79/98 (80.6%)** — in the 76–81% band |
| QID-linked concept exists (direct `/concepts/wikidata:QID` round-trip) | **93/98 (94.9%)** |
| Written (external_ids.openalex + external_metrics, live re-fetch, QID round-trip 91/91, drift 0) | **91/98** |
| — of which: rank-1 clean | 66 |
| — of which: **duplicate-link resolved** (direct twin rejected, search-side QID concept selected) | **13** |
| — of which: direct single (QID round-trip, label search outranked by homonyms) | 12 |
| Gaps (no write) | **7** (2 dup-link with no in-search discipline twin + 3 object-concept homonym traps + 2 absent) |
| Per-domain rank-1: LS 88% · SS 73% · Arts 83% · ENG 82% | (SS lowest, as the brief predicted — JEL/social concepts sparser) |

## Escalation-trigger assessment (policy (27))

- **(i) rank-1 precision:** 80.6% (prior-definition: search rank-1 wikidata == node QID) — **in
  the 76–81% band, above the <70% guide. Not fired.** (Note: the script's stricter `rank1_clean`
  verdict — which additionally requires the direct endpoint to return the *same* concept id — reads
  67.3%, but that low number is an artifact of the broad/narrow duplicate-link anomaly below, not a
  precision regression; the prior-definition metric is the correct band comparison.)
- **(ii) novel anomaly:** none. The dominant anomaly this round is **broad/narrow duplicate links**
  (a single QID linked to two concepts — a small/topical "twin" and the true broad discipline — with
  the `/concepts/wikidata:QID` endpoint returning the *small twin*). This is a **catalogued type**
  (session #6 Q141495, session #12 NS ×3, session #9 CS 17%); the standing rule applies — multi-signal
  + select the search-side concept that carries our QID and the exact discipline name. **Higher
  frequency this round** (13/98 resolved + 2 unresolved) is recorded as a measurement, not a new
  anomaly: the general/named disciplines (biology, economics, mechanical-engineering, …) are exactly
  the labels Wikidata over-links. Not fired.
- **(iii) upstream change:** Concepts API still serves; the empty `counts_by_year` change was
  already recorded session #12. Not fired.
- **(iv) schema/policy change needed:** none — external_metrics is additive, entity-ID-first
  validation already enforced. Not fired.

**All four triggers clear → write proceeded in-session (decision (27)).**

## Duplicate-link resolutions (13 — direct twin rejected, search-side QID concept written)

- field:biology -> C86803240 (Biology); direct twin was C2992077199 (Biological sciences)
- subfield:botany -> C59822182 (Botany); direct twin was C2994435560 (Plant science)
- subfield:cell-biology -> C95444343 (Cell biology); direct twin was C2994604686 (Cell function)
- field:economics -> C162324750 (Economics); direct twin was C2985697011 (Economic analysis)
- subfield:econometrics -> C149782125 (Econometrics); direct twin was C2984393311 (Econometric analysis)
- subfield:demography -> C149923435 (Demography); direct twin was C2986043164 (Demographic change)
- subfield:international-law -> C55447825 (International law); direct twin was C185436325 (Public international law)
- subfield:graphic-design -> C15724806 (Graphic design); direct twin was C2992598406 (Art and design)
- field:mechanical-engineering -> C78519656 (Mechanical engineering); direct twin was C2992113537 (Machine building)
- field:chemical-engineering -> C42360764 (Chemical engineering); direct twin was C2988997525 (Chemical technology)
- field:biotechnology -> C150903083 (Biotechnology); direct twin was C2991947430 (Industrial biotechnology)
- subfield:geotechnical-engineering -> C187320778 (Geotechnical engineering); direct twin was C93907247 (Geotechnics)
- subfield:manufacturing-engineering -> C117671659 (Manufacturing engineering); direct twin was C101826366 (Production engineering)

Each selected concept was live-refetched and confirmed to carry the node's QID as its `wikidata`
(entity-ID-first round-trip 91/91, drift 0). The raw `works_count`/`cited_by_count` are recorded
as-is (no interpretation): e.g. biology's true concept C86803240 carries works 67,943,901 vs the
rejected twin "Biological sciences" (21,021) — selecting the discipline concept, not a topical twin,
keeps the raw fact meaningful.

## Gaps (7 — honest, no write)

- subfield:labor-economics (Q28161) verdict=manual_candidate direct=Job market searchR1=Labor demand
- subfield:curriculum-and-instruction (Q157416) verdict=object_concept direct=404 searchR1=Curriculum studies
- subfield:civil-law (Q222249) verdict=manual_candidate direct=Civil litigation searchR1=Civil law (Civil law)
- field:design (Q82604) verdict=object_concept direct=404 searchR1=Routing (electronic design automation)
- subfield:drawing (Q2921001) verdict=object_concept direct=404 searchR1=Engineering drawing
- subfield:ceramic-arts (Q13464614) verdict=absent direct=404 searchR1=-
- subfield:textile-engineering (Q20825773) verdict=absent direct=404 searchR1=-

- **labor-economics / civil-law:** the QID-direct endpoint returns a topical twin ("Job market" /
  "Civil litigation") and no search candidate carries our QID at the discipline granularity —
  no defensible concept to write. Gap.
- **curriculum-and-instruction / design / drawing:** `/concepts/wikidata:QID` 404 and the label
  search rank-1 is a homonym trap (Curriculum studies / "Routing (electronic design automation)" /
  "Engineering drawing") — label-matching is banned (entity-ID-first). Gap.
- **ceramic-arts / textile-engineering:** absent from OpenAlex Concepts entirely (sparse arts/eng
  fields; mirrors the resolver-side upstream-gap pattern). Gap.

## Triangulation coverage

external_metrics **90 → 181 / 307 = 59.0%** (round-1 write-in +91). Up from 29.3% at session #14 —
the predicted "~60%+ leap" essentially met.

## Pit-stop note (decision (34)⑥(b) — first permanent B-track tool)

`scripts/foundry/openalex-prevalidate.ts` was promoted from ad-hoc local calls to a committed,
re-runnable tool. Measured repeat cost it removes: the per-node two-call (direct + search) multi-signal
table for ~30–100 nodes per continent, hand-assembled every B-track session since #6. The script
emits the signal-derived first-pass verdict; the dup-link/skip rulings stay manual. CI-network-free
invariant preserved (network is maintainer-local, output gitignored under `dist/`).

### Write map (91 nodes — permanent record; the dist comparison table is gitignored)

| node | QID | OpenAlex concept | name | works_count | path |
|---|---|---|---|---|---|
| `field:biology` | Q420 | C86803240 | Biology | 67943901 | dup-link resolved |
| `subfield:botany` | Q441 | C59822182 | Botany | 9944175 | dup-link resolved |
| `subfield:zoology` | Q431 | C90856448 | Zoology | 4900070 | rank1 |
| `subfield:microbiology` | Q7193 | C89423630 | Microbiology | 4038698 | rank1 |
| `subfield:genetics` | Q7162 | C54355233 | Genetics | 14536281 | rank1 |
| `subfield:molecular-biology` | Q7202 | C153911025 | Molecular biology | 4918439 | rank1 |
| `subfield:cell-biology` | Q7141 | C95444343 | Cell biology | 6337097 | dup-link resolved |
| `subfield:ecology` | Q7150 | C18903297 | Ecology | 14443185 | rank1 |
| `subfield:evolutionary-biology` | Q840400 | C78458016 | Evolutionary biology | 2971740 | rank1 |
| `subfield:developmental-biology` | Q213713 | C183074962 | Developmental biology | 25572 | rank1 |
| `subfield:immunology` | Q101929 | C203014093 | Immunology | 7265548 | rank1 |
| `subfield:virology` | Q7215 | C159047783 | Virology | 4324493 | rank1 |
| `subfield:parasitology` | Q180502 | C190612196 | Parasitology | 34215 | rank1 |
| `subfield:mycology` | Q7175 | C126116589 | Mycology | 10511 | direct round-trip |
| `subfield:systematics` | Q3516404 | C41806617 | Systematics | 91563 | direct round-trip |
| `subfield:marine-biology` | Q7173 | C117467278 | Marine biology | 5992 | rank1 |
| `subfield:bioinformatics` | Q128570 | C60644358 | Bioinformatics | 1563167 | rank1 |
| `field:economics` | Q8134 | C162324750 | Economics | 24614662 | dup-link resolved |
| `field:sociology` | Q21201 | C144024400 | Sociology | 33880381 | rank1 |
| `field:political-science` | Q36442 | C17744445 | Political science | 64268552 | rank1 |
| `field:education` | Q8434 | C106432739 | Education | 3338 | direct round-trip |
| `field:law` | Q7748 | C199539241 | Law | 25386359 | rank1 |
| `field:anthropology` | Q23404 | C19165224 | Anthropology | 2108047 | rank1 |
| `subfield:econometrics` | Q160039 | C149782125 | Econometrics | 2675895 | dup-link resolved |
| `subfield:economic-history` | Q47398 | C6303427 | Economic history | 1446972 | rank1 |
| `subfield:public-finance` | Q274490 | C178283979 | Public finance | 106729 | rank1 |
| `subfield:international-economics` | Q47417 | C18547055 | International economics | 558706 | rank1 |
| `subfield:financial-economics` | Q2294553 | C106159729 | Financial economics | 773484 | rank1 |
| `subfield:criminology` | Q161733 | C73484699 | Criminology | 1795965 | rank1 |
| `subfield:demography` | Q37732 | C149923435 | Demography | 4963189 | dup-link resolved |
| `subfield:social-work-and-welfare` | Q205398 | C16920402 | Social work | 179239 | direct round-trip |
| `subfield:gender-studies` | Q1662673 | C107993555 | Gender studies | 2842556 | rank1 |
| `subfield:social-stratification` | Q841628 | C48158472 | Social stratification | 21406 | rank1 |
| `subfield:international-relations` | Q166542 | C34355311 | International relations | 289002 | rank1 |
| `subfield:public-administration` | Q31728 | C3116431 | Public administration | 4638046 | rank1 |
| `subfield:comparative-politics` | Q32492 | C82834280 | Comparative politics | 13164 | rank1 |
| `subfield:educational-policy` | Q452348 | C67141207 | Education policy | 46679 | direct round-trip |
| `subfield:higher-education` | Q136822 | C120912362 | Higher education | 1307916 | rank1 |
| `subfield:special-education` | Q212105 | C28858896 | Special education | 111260 | rank1 |
| `subfield:constitutional-law` | Q11206 | C18650270 | Constitutional law | 74347 | rank1 |
| `subfield:international-law` | Q4394526 | C55447825 | International law | 220160 | dup-link resolved |
| `subfield:criminal-law` | Q146491 | C202565627 | Criminal law | 199581 | direct round-trip |
| `subfield:cultural-anthropology` | Q28598 | C102690226 | Cultural anthropology | 9301 | direct round-trip |
| `subfield:economic-geography` | Q187097 | C26271046 | Economic geography | 735071 | rank1 |
| `field:music` | Q638 | C535889608 | Music | 19176 | direct round-trip |
| `field:visual-arts` | Q36649 | C153349607 | Visual arts | 5124428 | rank1 |
| `field:performing-arts` | Q184485 | C163286209 | Performing arts | 74451 | rank1 |
| `field:architecture` | Q12271 | C123657996 | Architecture | 995924 | rank1 |
| `subfield:musicology` | Q164204 | C154233639 | Musicology | 31808 | rank1 |
| `subfield:music-theory` | Q193544 | C143857728 | Music theory | 10910 | rank1 |
| `subfield:ethnomusicology` | Q208365 | C131503682 | Ethnomusicology | 8881 | rank1 |
| `subfield:music-education` | Q27908 | C13553968 | Music education | 85756 | rank1 |
| `subfield:art-history` | Q50637 | C52119013 | Art history | 6981748 | rank1 |
| `subfield:painting` | Q11629 | C205783811 | Painting | 458712 | rank1 |
| `subfield:sculpture` | Q11634 | C67805463 | Sculpture | 140012 | rank1 |
| `subfield:printmaking` | Q271588 | C105162683 | Printmaking | 8138 | rank1 |
| `subfield:graphic-design` | Q185925 | C15724806 | Graphic design | 18455 | dup-link resolved |
| `subfield:industrial-design` | Q243606 | C134535237 | Industrial design | 12274 | rank1 |
| `subfield:interior-design` | Q179232 | C173560066 | Interior design | 12742 | rank1 |
| `subfield:decorative-arts` | Q631931 | C205484029 | Decorative arts | 12912 | rank1 |
| `subfield:theatre-studies` | Q960543 | C540679656 | Theatre studies | 5013 | rank1 |
| `subfield:dance` | Q11639 | C147446459 | Dance | 239811 | rank1 |
| `subfield:film-studies` | Q1660187 | C170494952 | Film studies | 11454 | rank1 |
| `subfield:landscape-architecture` | Q47844 | C205845201 | Landscape architecture | 20985 | rank1 |
| `field:civil-engineering` | Q77590 | C147176958 | Civil engineering | 1464757 | rank1 |
| `field:electrical-engineering` | Q43035 | C119599485 | Electrical engineering | 7310481 | rank1 |
| `field:mechanical-engineering` | Q101333 | C78519656 | Mechanical engineering | 8231863 | dup-link resolved |
| `field:chemical-engineering` | Q83588 | C42360764 | Chemical engineering | 4569159 | dup-link resolved |
| `field:materials-science-and-engineering` | Q228736 | C192562407 | Materials science | 62847596 | direct round-trip |
| `field:environmental-engineering` | Q146326 | C87717796 | Environmental engineering | 1673705 | rank1 |
| `field:aerospace-engineering` | Q3798668 | C146978453 | Aerospace engineering | 3025828 | rank1 |
| `field:industrial-engineering` | Q4489420 | C13736549 | Industrial engineering | 225688 | rank1 |
| `field:biotechnology` | Q7108 | C150903083 | Biotechnology | 2275665 | dup-link resolved |
| `subfield:structural-engineering` | Q633538 | C66938386 | Structural engineering | 3897777 | rank1 |
| `subfield:geotechnical-engineering` | Q1349130 | C187320778 | Geotechnical engineering | 3228678 | dup-link resolved |
| `subfield:transportation-engineering` | Q775325 | C22212356 | Transport engineering | 1294577 | direct round-trip |
| `subfield:hydraulic-engineering` | Q1130265 | C7879346 | Hydraulic engineering | 6114 | rank1 |
| `subfield:construction-engineering` | Q2674423 | C107053488 | Construction engineering | 465963 | direct round-trip |
| `subfield:telecommunications-engineering` | Q1061219 | C24459613 | Telecommunications engineering | 1291 | rank1 |
| `subfield:computer-engineering` | Q428691 | C113775141 | Computer engineering | 142574 | rank1 |
| `subfield:nuclear-engineering` | Q83504 | C116915560 | Nuclear engineering | 12869723 | rank1 |
| `subfield:robotics` | Q170978 | C34413123 | Robotics | 221616 | direct round-trip |
| `subfield:manufacturing-engineering` | Q11049265 | C117671659 | Manufacturing engineering | 869364 | dup-link resolved |
| `subfield:metallurgy` | Q11467 | C191897082 | Metallurgy | 7144735 | rank1 |
| `subfield:mining-engineering` | Q1370637 | C16674752 | Mining engineering | 651451 | rank1 |
| `subfield:petroleum-engineering` | Q1273174 | C78762247 | Petroleum engineering | 800693 | rank1 |
| `subfield:nanotechnology` | Q11468 | C171250308 | Nanotechnology | 6339721 | rank1 |
| `subfield:systems-engineering` | Q682496 | C201995342 | Systems engineering | 2056485 | rank1 |
| `subfield:geomatics` | Q619798 | C12780434 | Geomatics | 14134 | rank1 |
| `subfield:photonics` | Q467054 | C20788544 | Photonics | 233901 | rank1 |
| `subfield:automotive-engineering` | Q124192 | C171146098 | Automotive engineering | 1561243 | rank1 |
