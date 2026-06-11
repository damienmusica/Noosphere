# QC report — engineering-technology-skeleton-v1

- **QC:** Claude Fable 5 (orchestrator session #13c, parallel round v1 branch 13c), 2026-06-11.
  Generation: Claude Sonnet (claude-sonnet-4-6), separate context (ADR 0007 upheld;
  `nodes.proposed.json` preserves the raw 32-node generated set; `proposal.json` is the QC-shaped
  31-node set).
- **Inputs:** batch manifest (PR #76), §12 incl. precedent log at the round pin (commit `d816cb6`)
  as mandatory input, the round boundary assignment table (`parallel-round-v1.md` §2), and the
  orchestrator's **live-captured 3-scheme baseline** (LCC class T outline PDF; UDC getrecord
  records 6/60/62/65/66/669/67/68/69; OECD FORD section 2 — all captured 2026-06-11 before
  generation). The generator had no fetch tool: it cited the captured file as live and self-marked
  everything else [UNFETCHED]/training-knowledge. QC re-grounded live: id.loc.gov classification
  authority records (range-record method, session #12), LCC class V/U/R outline PDFs, UDC granular
  getrecord probes, and department-page community checks.

## Disposition

| Measure | Count |
|---|---|
| Generated | 32 (10 fields + 22 subfields; all 32 manifest seeds kept by the generator) |
| Kept | **31** (10 fields + 21 subfields) |
| Dropped | 1 (energy-engineering — absorbed, v2 re-split candidate) |
| Gap-filled by QC | 0 (coverage duty satisfied by the generated set) |
| A-flags retired by QC ruling | 5 (+1 resolved by drop) |
| Flags reclassified | 1 (photonics B→A, then retired) |
| B-flags upheld | 2 (clause-6/v1.1 queue) |
| Hint-laundering caught | **2** (of 80 machine-checked attribution claims; trend ~10 → 1 → 2) |

## Drop (1) — live-verified grounds

1. **subfield:energy-engineering → absorbed into field:mechanical-engineering** (§12 rule 2):
   classification evidence consists of sub-ranges refining the kept TJ node (TJ163.13-163.25
   'Power resources', TJ807-830 'Renewable energy sources'); UDC 620.9 is an economics-of-energy
   caption; no gate scheme gives the area a major division. Polymer-chemistry precedent applies
   directly (single-scheme subdivisions + strong community still fail criterion (a) when they
   refine a kept node). **v2 re-split candidate**, paired with the NS deliberate-non-coverage
   record for "energy science" (cross-continent candidate pair).

## Hint-laundering ledger (machine comparison, 80 claims)

1. **field:biomedical-engineering** — the draft attached the **R895-920 medical-physics caption**
   ('Medical physics. Medical radiology. Nuclear medicine' — text that lives in the §12 precedent
   log, not in the captured baseline) to **LCC R856** and attributed it to the captured baseline.
   Corrected by live verification (lcco_r.pdf, 2026-06-11): **R856-857 = 'Biomedical engineering.
   Electronics. Instrumentation'**. The corrected caption is *stronger* evidence for the node, but
   the attribution was fabricated — counted as laundering.
2. **subfield:mining-engineering** — fabricated ranges **TN1-597 / TN1-948** cited as captured;
   the captured outline reads **TN1-997**. Corrected to the capture-real subclass caption plus its
   named mining divisions.

Four further flagged quotations were verified capture-faithful (line-wrap artifacts:
geotechnical-engineering, robotics; punctuation splice: telecommunications-engineering —
normalized in the QC-shaped hint; civil-engineering family-listing trimmed of TD as a
double-anchor, not a laundering case).

## A-flag rulings (retirements — §12 precedent candidates below)

1. **field:industrial-engineering — RETIRED, kept.** id.loc.gov authority record **T55.4-T60.8
   carries the authoritative label 'Industrial engineering'** (live, 2026-06-11). The division
   refines no kept node — the polymer absorption precedent does not apply when there is no kept
   parent serving the same community; UDC 658.5 is an out-of-gate named division supporting
   existence (other-home-filing reading); criterion (b) overwhelming (IISE, named ISE
   departments). Fires the operations-research re-target review (task 7).
2. **subfield:naval-architecture-and-marine-engineering — RETIRED, combined shape upheld.**
   LCC **VM1-989 'Naval architecture. Shipbuilding. Marine engineering'** live-verified
   (lcco_v.pdf; the generator had honestly marked it [UNFETCHED]); UDC 629.5 caption umbrellas the
   same combined referent. Rule 3 does not fire (institutional home in-continent). The generator's
   double-anchoring of TC1501-1800 was resolved: that range belongs to the hydraulic-engineering
   absorption (TC subclass caption bundles 'Hydraulic engineering. Ocean engineering'); ocean
   engineering is a v2 re-split candidate.
3. **subfield:computer-engineering — RETIRED, kept.** id.loc.gov **TK7885-TK7895 authoritative
   label 'Computer engineering. Computer hardware'** live-verified (hierarchy: Technology >
   Electrical engineering > Electronics > Applications of electronics). CS-side §13 dual
   membership deferred to the edge batch (ACM CCS hardware-tree evidence collection — trigger
   recorded). Q428691 goes to the resolver *for this referent* (its prior rejection was as an
   anchor for subfield:computer-systems — a different node).
4. **subfield:nuclear-engineering — RETIRED, kept.** UDC 621.039 verified **absent** at UDC
   Summary granularity (live getrecord returned empty); criterion (a) passes via LCC TK9001-9401
   named major range + UDC 621 division-caption co-naming of 'Nuclear technology'.
5. **subfield:geomatics — RETIRED, kept (case-by-case resolved).** TA501-TA625 authoritative
   label 'Surveying' live-verified; **UNB 'Geodesy & Geomatics Engineering' department
   live-verified** (2026-06-11) — community criterion confirmed by an engineering-faculty
   department that couples geodesy with geomatics in its own name. **Geodesy §13 engineering-side
   candidate now holds two independent institutional evidences** (TU Delft, parked session #12 +
   UNB GGE, this session) — recorded for the #14 write-in; no geodesy edge written in this batch.
6. **subfield:photonics — RECLASSIFIED B→A, then RETIRED (distinct node accepted).** No
   classification source files photonics outside this continent — not a real-world placement
   contest but a same-referent design question (A-type by §12 flag semantics). Distinct-referent
   ruling (QIS precedent): TA1501-1820 'Applied optics. Photonics' (authoritative label
   live-verified) vs physics optics (QC350-467 + UDC 535, NS ruling); a bridging society (Optica)
   is not a community merger (optics-vs-AMO scheme-compression mirror). The optics↔engineering §13
   cross-listing stays a **parked** candidate (edge batch / #14).

## B-flags upheld (2 → proposed cap, clause-6/v1.1 queue)

- **field:biomedical-engineering** — medicine-class co-home contest (live-verified LCC R856-857
  'Biomedical engineering. Electronics. Instrumentation'; UDC 615.47 unverified at summary level)
  vs engineering institutional home (BMES; engineering-school departments). Rule 3 does not fire
  on one prong; the medicine-and-health §13 dual membership is the expected resolution path.
- **subfield:food-engineering** — engineering-school vs agricultural-college institutional
  contest; classification criterion not in dispute (TP368-456 + UDC 664 captured).

## Live verification ledger (QC re-grounding, 2026-06-11)

| Check | Result |
|---|---|
| id.loc.gov range records (TK7885-TK7895, T55.4-T60.8, T57.6-T57.97, TJ212-TJ225, TA501-TA625, TA1501-TA1820, TC1501-TC1800, TP248.13-TP248.65, TN600-TN799, TA401-TA492) | all 200 with authoritative labels as cited above (range-record method, session #12) |
| LCC class V outline (lcco_v.pdf) | VM1-989 'Naval architecture. Shipbuilding. Marine engineering' |
| LCC class R outline (lcco_r.pdf) | R856-857 'Biomedical engineering. Electronics. Instrumentation' (laundering correction) |
| LCC class U outline (lcco_u.pdf) | UG1-620 'Military engineering' — out-of-gate-class home; supports the military-engineering deliberate non-coverage |
| UDC getrecord 621.039 | empty at summary granularity (nuclear ruling input) |
| UDC 665.6 / 665.6/.7 | present in the captured class-66 record (petroleum citations verified) |
| id.loc.gov label endpoint | does not match classification captions (404 for known caption 'Bridge engineering') — recorded so future sessions do not misread such 404s as absence |
| UNB Geodesy & Geomatics Engineering; NC State Textile Engineering, Chemistry and Science | both live (community criterion checks) |
| TN860-TN879 (petroleum drilling-side LCC probe) | 404 — honest granularity gap recorded on the node |

## §12 precedent candidates (NOT appended to §12 — #14 integrates per round protocol ①)

1. *Industrial-engineering pattern:* a named in-gate class division that **refines no kept node**
   passes criterion (a) even without a standalone subclass; the polymer absorption precedent is
   confined to candidates refining a kept parent that serves the same community. (An out-of-gate
   named division — UDC 658.5 — supports existence as an other-home filing.)
2. *Caption co-naming:* a gate-scheme **division-caption co-naming** (UDC 621 naming 'Nuclear
   technology') plus a named major range in the other gate scheme satisfies criterion (a); a UDC
   Summary granularity gap (621.039 empty) does not erase caption-level presence.
3. *Out-of-gate-class dedicated subclass:* an LCC subclass outside the continent's gate classes
   (VM in class V) that umbrellas a combined referent supports the **combined node shape**; rule 3
   still does not fire when the institutional home is in-continent.
4. *Flag-type correction at QC:* a generator B-flag with **no out-of-continent filing** behind it
   is a design question — QC may reclassify B→A and rule it (photonics; QIS distinct-referent
   precedent applied).
5. *Double-anchor hygiene:* when a generator anchors one captured range on two nodes
   (TC1501-1800 on both hydraulic and naval-architecture), QC assigns it to exactly one node and
   records the reassignment on both.

## Re-target & parking records (task-7 inputs and #14 handoffs)

- **operations-research re-target review** — fires now that field:industrial-engineering exists;
  evidence verified live this session: T57.6-T57.97 authoritative label 'Operations research.
  Systems analysis' sits *inside* the T55.4-T60.8 'Industrial engineering' division. Edge-batch
  task.
- **control-theory re-target review** — TJ212-TJ225 'Control engineering systems. Automatic
  machinery (General)' live-verified (sits in TJ/mechanical); UDC 681.5 'Automatic control
  technology. Smart technology' captured. Edge-batch task; no control node generated (boundary
  table honored).
- **information-theory ECE-side §13** (session #8 parking) — collection task now that
  field:electrical-engineering + subfield:telecommunications-engineering exist; evidence gate
  applies (task 7).
- **Parked §13 candidates recorded, not written:** photonics↔optics; computer-engineering↔CS
  (CCS hardware tree); acoustics engineering-side (TA365-367 + UDC 681.8); plasma engineering-side
  (TA2001-2040); robotics↔AI; biomedical-engineering↔medicine (clause-6 path); geodesy↔engineering
  via geomatics (TU Delft + UNB GGE — **#14 write-in package**).
- **13d handoff:** LCC TH845-895 'Architectural engineering. Structural engineering of buildings'
  + UDC 69 recorded as engineering-side evidence for the architecture §13 dual membership (13d
  owns the node and the write-in).
- **Deliberate non-coverage:** military engineering (UG1-620 live-verified out-of-gate-class home;
  UDC 623 in-class but institutional home military academies — dual-criterion fail recorded);
  TR/TT/TX out-of-continent; instrumentation engineering (TA165/UDC 681.2) v2 candidate;
  UDC 68x trade crafts below skeleton granularity; ocean engineering + electronics + TE/TF/TG
  highway/railroad/bridge + energy engineering — absorbed, v2 re-split candidates.

## SPN ledger (§8 — existing-snapshot-first; round protocol ③)

Existing snapshots verified for 15/16 QC-cited URLs (timestamps in session report): lcco_t/v/r/u
PDFs, id.loc.gov range records ×9, UNB GGE, NC State TECS; FORD page holds the known snapshot
web/20260611023459. **Save queue (1): `https://id.loc.gov/authorities/classification/TN600-TN799`**
(no snapshot found) — queued per the deferred-payment rule; a single save attempt may run under
the network lock alongside the resolver pass. UDC getrecord URLs are query-string SPN-incompatible
(notation + caption quoted in source hints instead; known limitation).
