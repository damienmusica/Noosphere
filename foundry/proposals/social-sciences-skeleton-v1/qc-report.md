# QC report — social-sciences-skeleton-v1

- **QC:** Claude Fable 5 (orchestrator session #13a, parallel round v1, merge order 1), 2026-06-11.
  Generation: Claude Sonnet (claude-sonnet-4-6), separate context (ADR 0007 upheld;
  `nodes.proposed.json` preserves the raw 44-node generated set; `proposal.json` is the QC-shaped
  39-node set).
- **Inputs:** batch manifest (PR #74), §12 incl. precedent log **pinned at commit `d816cb6`**
  (parallel-round-v1 §12 snapshot pin), and the orchestrator's live-captured baseline (LCC outline
  PDFs H/J/L/K/G via browser-UA curl, UDC class 3 full subtree via getrecord — 205 records,
  id=3 response spot-verified complete against an individual id=316 fetch — and OECD FORD section
  5 via the arrs.si mirror, all captured 2026-06-11 before generation). The generator had no fetch
  tool: it cited the captured files only and self-marked everything else [UNFETCHED]/training-
  knowledge.

## Disposition

| Measure | Count |
|---|---|
| Generated | 44 (9 fields + 35 subfields) |
| Kept | **39** (8 fields + 31 subfields, incl. 1 field→subfield demotion) |
| Dropped | 5 (1 duplicate-referent + 4 absorptions) |
| Gap-filled by QC | 0 (coverage duty satisfied by the generated set) |
| A-flags retired by QC ruling | 4 (law, criminology, demography, business-and-management-via-demotion) |
| B-flags upheld | **7** (clause-6/v1.1 queue — same count as NS, coincidence) |
| Hint-laundering caught (mechanical audit) | **1** true + 2 misquote artifacts (corrected) |
| QID hint-collisions caught | 1 (Q8134 on economics + financial-economics — removed from the latter) |

## Mechanical hint-laundering audit (121 scheme-claim units checked against captures)

Every `(captured baseline 2026-06-11)` attribution across all 44 generated nodes was machine-
checked against the capture files (notation AND quoted caption must both match).

- **1 true laundering instance** — `subfield:economic-theory` cited **"LCC HB71-3840 'Economic
  theory. Demography'"**: the captured caption belongs to **HB1-3840**; HB71-3840 is a generator-
  synthesized range (NS electrochemistry wrong-bounds pattern). Substance real — every component
  sub-claim (HB71-74, HB201-206, HB221-236, HB801-843, HB846-846.8) is individually verbatim in
  the capture. Corrected in `proposal.json`; the keep ruling stands on the corrected evidence.
  Trend: session #8 ~10 → #11 1 → **#13a 1**.
- **2 misquote artifacts, corrected (not counted as laundering — all component claims verbatim):**
  `subfield:econometrics` merged the LCC caption and its Including note into one quoted string;
  `subfield:educational-policy` silently abbreviated the UDC 37.01 Including bracket (dropped
  "(educational situation, content)" etc.). Both rewritten to quote-faithful form.
- **4 false positives (honest disclosures the parser flagged):** media-and-communication-studies
  (UDC 316.77 explicitly described as NOT in the capture), physical-anthropology ×2 (UDC 572
  explicitly [UNFETCHED]), archaeological-anthropology (UDC 902/903 explicitly [UNFETCHED]).
  These are the citation discipline working as designed, not violations.
- **1 referent-mismatch caveat (not a quote violation):** `subfield:economic-history` cited UDC
  330.8 'History of economic theories, doctrines, dogmas' (verbatim, real) as support — but that
  notation names history of economic *thought*, a distinct referent. Caveat appended to the
  node's uncertainty; keep ruling re-based on LCC HC own-subclass rank + community.

## Drops (5)

1. **subfield:political-theory → DROPPED (duplicate referent of canonical
   `subfield:political-philosophy`).** Live-verified 2026-06-11: the generator's own QID hint
   **Q179805 is exactly the canonical political-philosophy entity** (label "political philosophy",
   desc "sub-discipline of philosophy **and political science**", enwiki "Political philosophy",
   90 sitelinks, lastrevid 2502393413), and the enwiki API confirms **"Political theory" is a
   redirect to "Political philosophy"**. One referent, one node (cross-listing v1: single node ID,
   multiple memberships). The social-sciences-side evidence — LCC JC11-605 'Political theory. The
   state. Theories of the state' (own subclass, captured) + UDC 321 (captured) + APSA section
   community — is **parked as §13 political-science-side membership evidence for
   `subfield:political-philosophy`**, to be written in the part_of edge batch (IR/skeleton-time
   §13 precedent). The philosophy node itself is untouched (aesthetics-junction discipline).
2. **subfield:urban-sociology → absorbed into field:sociology** (polymer-chemistry pattern):
   LCC HT101-395 'Urban groups. The city. Urban sociology' names it (single-scheme division), but
   the captured UDC class-3 subtree offers no urban-sociology division (316.35 does not name it),
   and the community evidence is an ASA section + journal, not department-level units — the same
   profile the generator itself used to reject political-sociology and environmental-sociology.
   Consistency restored; **v2 re-split candidate** (first in line with race-and-ethnicity).
3. **subfield:management → absorbed into subfield:business-and-management** (single-scheme
   division LCC HD28-70; UDC management home (005) lies outside class 3 and was honestly not
   claimed; Academy of Management community strong — polymer-chemistry pattern: single-scheme
   division + strong society still fails criterion (a)). v2 re-split candidate.
4. **subfield:marketing → absorbed into subfield:business-and-management** (LCC HF5410-5417.5 is
   cutter-rank; UDC 339.1 names marketing only inside an Including note — an Including mention is
   not a division). v2 re-split candidate.
5. **subfield:accounting → absorbed into subfield:business-and-management** (LCC HF5601-5689
   single-scheme; captured UDC class 3 has no accounting division — the generator's own
   uncertainty conceded criterion (a) is marginal). v2 re-split candidate.

## A-flag rulings (4 retirements — precedent candidates for #14, NOT appended to §12 here)

1. **field:law — flag retired, kept at field level (in-continent).** The §12 rule-3 two-prong
   test resolves on the captures: (i) the LCC prong asks whether the primary LCC home lies in
   *another continent's* class, not whether it lies outside class H — the social-sciences
   continent's LCC footprint is multi-class by construction (political science = class J,
   education = class L, anthropology = GN in class G), so law's own class K is exactly as
   "outside H" as J and L are, and no other continent's classes claim it; (ii) UDC 34 is a major
   division directly under class 3 (captured), the UDC 3 header caption explicitly includes
   "Law" (captured), and FORD 5.5 'Law' sits under section 5 Social Sciences (captured) — no
   gate scheme files law in another continent, and no real-world party contests social-sciences
   membership (law faculties' institutional autonomy is faculty-rank, not continent assignment).
   A-type design question answered by the standard → retired.
2. **subfield:criminology — flag retired.** LCC files criminology under the sociology-wing HV
   (HV6001-7220.5, captured); UDC files it under 343.9 inside 34 Law (captured) — **both gate
   schemes file it inside class 3 / the H-J-K-L footprint**; the disagreement is about which
   in-continent *parent* files it, which contests the edge, not the node (§12: the flat rule
   governs node levels; parent assignment is edge-batch business). Node-level dual criterion
   satisfied (large LCC range + UDC 343.9 division + ASC/Criminology journal).
3. **subfield:demography — flag retired, subfield level confirmed.** UDC 314 is a real division
   under 3 but with minimal subtree depth in the captured records (314 + 314.1 only, vs 316's
   ~10 records or 33x's ~40), and LCC files demography *inside* the HB economic-theory subclass
   (HB848-3697); institutional standing is research-center/track-level (PAA, Demography journal,
   population centers), not faculty-level — mathematical-logic demotion logic at subfield rank.
4. **field:business-and-management → demoted to subfield:business-and-management (flag retired
   via ruling).** Mathematical-logic precedent: LCC files business/management as divisions inside
   class-H economics-family subclasses (HD28-70, HF5001-6182, captured), captured UDC class 3 has
   no major business division, and FORD 5.2 co-names it with economics in one division
   ('Economics and Business', captured) — classification sources rank the area as a division
   within the economics wing, not a peer field, while business-school autonomy (AACSB) satisfies
   community standing at whatever rank. Kept as the subfield-level umbrella absorbing
   management/marketing/accounting (all v2 re-split candidates).

## B-flags upheld (7 — promotion stops at `proposed`, clause-6 queue)

- **field:media-and-communication-studies + subfield:mass-communication** — head-on gate-scheme
  split: FORD 5.8 'Media and communications' is an explicit social-sciences division (captured),
  but the area's LCC home (P87-96) lies in class P (humanities-residual continent's class,
  uncaptured) and the captured UDC class-3 subtree offers no division. Biophysics/biochemistry
  pattern (gate schemes split head-on → genuine contest); §13 dual membership with the
  humanities-residual continent is the plausible resolution once that continent lands.
- **field:human-geography** — the unity-of-geography contest is real and pre-existing: session
  #12 parked four physical-geography-side LCC class-G evidence items against a *future geography
  node*; creating the human-side field while that question is open is a genuine structural
  contest (FORD 5.7 + LCC GF captured support vs the unified-geography alternative). Parked
  items remain untouched (encounter recorded below).
- **subfield:jurisprudence** — genuine identity contest, live-verified 2026-06-11: Wikidata
  maintains **two distinct entities** (Q4932206 'jurisprudence', desc "theoretical study of law,
  by philosophers and social scientists", P31 academic discipline, 99 sitelinks, lastrevid
  2499322119 vs Q126842 'philosophy of law' = canonical subfield:philosophy-of-law, 57 sitelinks,
  lastrevid 2496667332), but **enwiki has merged the articles — "Philosophy of law" now redirects
  to "Jurisprudence"**. Whether jurisprudence is a distinct law-school referent (general legal
  science) or a re-modeling of the canonical philosophy-of-law referent is exactly a clause-6
  identity question; conservative stop at `proposed`. (Resolution options pre-registered: drop as
  duplicate / keep distinct / §13.) **Watch item:** the canonical philosophy-of-law node's enwiki
  sitelink now points at a redirect page (upstream merge) — recorded for the session report.
- **subfield:physical-anthropology** — gate-scheme split: LCC GN49-298 in-continent (class-G
  other-home-filing precedent applies) vs UDC's physical-anthropology home 572 in class 5
  (life-sciences side, honestly uncaptured/[UNFETCHED]); biological-anthropology community
  straddles. Biophysics/biochemistry mirror; §13 dual with life sciences is the plausible
  resolution once 13b lands.
- **subfield:archaeological-anthropology** — real-world boundary contest: LCC GN700-890
  'Prehistoric archaeology' is in-continent (captured), but archaeology's broader homes (LCC CC,
  UDC 902/903) lie in humanities classes (uncaptured/[UNFETCHED]) and the European tradition
  files archaeology as humanities; the node scopes the anthropology wing (US four-field model)
  without claiming all of archaeology. Unified-archaeology question parallels geography —
  clause-6/#14 queue.
- **subfield:urban-and-regional-planning** — multi-home contest: LCC HT165.5-169.9 + HT388-395
  in-continent (captured), UDC's planning home (711) in class 7 (13d's arts-design continent,
  uncaptured), institutional homes split between design colleges and policy schools. **Cross-
  round coordination item:** 13d may surface planning from UDC 71 — recorded for #14
  reconciliation (this node stops at `proposed`, so no premature canonical claim).

## QID-hint hygiene

- **Hint-collision caught:** the generator placed **Q8134** (economics) on both field:economics
  and subfield:financial-economics while its own hint text for the latter disclaimed having a
  confident QID — the contradictory hint was removed from financial-economics (NS earth-
  sciences/geology collision pattern; resolver finds the right entity).
- All remaining QIDs stay unverified training-knowledge hints for resolver v4.

## Boundary encounters with excluded continents (record-only, per assignment table)

- **Psychology (5.1):** educational psychology (LB1050.9-1091) and social psychology
  (HM1001-1281) encountered in captures — recorded only, no nodes, no subfield proposed.
- **Linguistics:** not encountered in the captured classes (UDC 81 not under 3). No action.
- **Statistics family (formal-sciences-owned):** LCC HA + UDC 311 encountered; social-sciences-
  side §13 membership evidence parked for the edge batch (LCC HA29-32 'Theory and method of
  social science statistics', UDC 311.3). Same for **game theory** (LCC HB135-147 Including note,
  captured — economics-side §13 trigger), **decision theory** (HB135-147 wing), and
  **financial-mathematics** (boundary with subfield:financial-economics articulated, no node
  action).
- **Physical-geography parking (4 items):** encountered as context in class-G interpretation;
  **not touched** — they remain parked against a future geography-node decision (#14+).
- **subfield:mathematics-education:** no node action; re-target trigger fires in the edge batch
  now that field:education is generated (manifest pre-registration).

## §12 precedent candidates (for #14 integration — NOT appended to §12 by this session)

1. *(law ruling)* A continent's LCC footprint is multi-class: a discipline's own top-level LCC
   class (law's K, political science's J, education's L) is not an out-of-continent filing —
   rule 3's LCC prong asks whether the home lies in another continent's class, not whether it
   lies outside the continent's nominal main class.
2. *(criminology ruling)* When both gate schemes file a node inside the continent but under
   different wings (LCC sociology-side HV vs UDC law-side 343.9), the split contests the edge,
   not the node — the flag moves to the part_of batch.
3. *(business demotion)* FORD co-naming an area inside another field's division ('Economics and
   Business') plus LCC divisions-inside-subclasses plus no UDC in-continent division = the
   mathematical-logic demotion profile at field rank, even against faculty-level institutional
   autonomy (business schools).
4. *(political-theory drop)* A live enwiki redirect from the candidate's label to a canonical
   node's article, combined with the candidate's own QID hint resolving to the canonical node's
   entity, is decisive duplicate-referent evidence at QC time — the candidate's classification
   evidence parks as §13 membership evidence for the canonical node instead.
5. *(demography ruling)* A UDC division under 3 with minimal captured subtree depth (314+314.1)
   plus LCC filing inside another field's subclass plus research-center-rank community =
   subfield, not field (mathematical-logic logic at one rank down).

## Cross-round coordination items (for #14)

- urban-and-regional-planning ↔ 13d (UDC 71x planning homes) — see B-flag entry.
- physical-anthropology ↔ 13b (UDC 572 life-sciences home) — §13 candidate once 13b lands.
- media-and-communication-studies / mass-communication ↔ humanities-residual continent
  (LCC P87-96) — §13 candidate once that continent lands.
- philosophy-of-law enwiki-sitelink-redirect watch item (upstream article merge).
