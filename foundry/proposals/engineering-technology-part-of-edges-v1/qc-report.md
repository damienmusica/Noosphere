# QC report — engineering-technology-part-of-edges-v1

- **QC:** Claude Fable 5 (orchestrator session #13c), 2026-06-11. Generation: Claude Sonnet
  (claude-sonnet-4-6), separate context (ADR 0007; `edges.proposed.json` raw, `proposal.json`
  QC-shaped).
- **Inputs:** edge-batch manifest (9 pre-registered nesting questions), §12 part_of precedents at
  pin `d816cb6` (contradiction-nesting, depth rule, ASL-pillar, shelving-is-not-hierarchy), the
  31-node skeleton proposal with QC rulings, captured baseline.

## Disposition

| Measure | Count |
|---|---|
| Generated / kept | 31 / **31** (structure accepted without topology changes — NS precedent) |
| Nested under a field | 10 (structural, geotechnical, transportation, geomatics → civil; telecommunications, computer-engineering → electrical; robotics → mechanical; petroleum, food → chemical; nanotechnology → materials) |
| Deep nest (subfield→subfield) | 1 (textile → manufacturing — both gate schemes nest inside the manufacturing wing; ASL-pillar) |
| Flattened to the domain | 20 (10 fields by design + hydraulic, construction, NAME, nuclear, manufacturing, metallurgy, mining, systems, photonics, automotive by contradiction/no-nesting analysis) |
| Hint-laundering caught | **0** (5 machine-flagged quotations all verified: 2 honest QC-live-verification attributions — R856-857, VM1-989; 3 parser artifacts) |
| QC corrections | 1 factual parenthetical (LCC class V = **Naval** science, not Military — lcco_v.pdf title line, live) |
| Status-capped edges | 3 (biomedical-engineering, food-engineering, naval-architecture-and-marine-engineering — source nodes `proposed`) |
| Ambiguous upheld | 2 (the two B-cap edges — they resolve with their node contests) |

## Rulings on the generator's four QC-attention items

1. **systems-engineering flatten upheld** — TA168 is a single shelving entry in TA's
   general-engineering portion; shelving is not a hierarchy claim (ASL precedent, applied in the
   flatten direction); INCOSE is cross-disciplinary. Domain-direct.
2. **nanotechnology nest upheld** — UDC 620.3 sits inside 620 (the materials anchor),
   un-contradicted: **a FORD sibling division does not contradict a gate-scheme nesting** (FORD is
   the cross-check, not a gate). §12 precedent candidate.
3. **nuclear flatten upheld on the contradiction reading** — consistency with the node-batch
   criterion-(a) ruling: the UDC 621 caption co-naming of nuclear technology counts as UDC
   presence in the mechanical-general wing, so LCC's TK nesting (electrical wing) is contradicted
   → flatten. (One caption, used once for presence, must imply the same wing for nesting.)
4. **metallurgy materials-side §13 fails the evidence gate** — neither UDC 669 nor LCC TN600-799
   nests under the materials anchors; community housing alone cannot create a membership
   (§13 anti-spam guard). Recorded-not-written.

## §13 candidates — all recorded-not-written (evidence-gate status)

| Candidate | Gate status |
|---|---|
| computer-engineering → CIS | blocked: ACM CCS live 403 + Wayback-snapshot 403 (2026-06-11); no named CCS filing in available captures — collection re-attempt queued (#14 / next session) |
| photonics ↔ optics (NS) | parked (edge-batch/#14 per node-batch ruling) |
| metallurgy → materials / chemical | failed (no classification nesting — see ruling 4) |
| robotics → CIS/AI | parked (no engineering-gate evidence collected for the AI side) |
| biomedical-engineering → medicine-and-health | travels with the node's clause-6 contest |
| acoustics / plasma engineering-side (NS nodes) | parked (TA365-367, TA2001-2040 + UDC 681.8 recorded in skeleton batch) |
| geodesy → engineering via geomatics | **#14 write-in package** (TU Delft parked + UNB GGE live this session) |

## Pre-registered questions (9) — all resolved

(1) hydraulic → flatten (no gate scheme nests TC/626-627 under civil); (2) construction → flatten
(TH/69 direct divisions); (3) nuclear → flatten (wing contradiction — ruling 3); (4) automotive →
flatten (TL/629.3 transport-vehicle wing; community housing alone insufficient); (5) metallurgy →
flatten + §13 fail (ruling 4); (6) mining/manufacturing/systems/photonics/NAME → flatten
(no-nesting analyses in each edge note; NAME also QID-capped); (7) textile → deep nest accepted;
(8) petroleum/food → chemical nest (unanimous two-scheme wing containment); (9)
geomatics/robotics/telecom/computer-engineering → single-scheme un-contradicted nesting accepted
(CIS depth rule; computer-engineering's TK hierarchy live-verified at the authority record in the
node batch).

## Re-target reviews (session-order task 7 — executed in the promotion PR, orchestrator work)

- **operations-research → field:industrial-engineering: RE-TARGET EXECUTED.** The existing
  domain-direct edge carried the §12 re-target note ("No education/field-level engineering
  subtarget exists; targets the domain"); the subtarget now exists, and the containment is
  live-verified at the authority-record level (T57.6-T57.97 'Operations research. Systems
  analysis' sits inside T55.4-T60.8 'Industrial engineering'); the edge's own prior grounding
  already cited Cornell ORIE / Berkeley IEOR — *Industrial Engineering and Operations Research*
  departments. Disputed flag (permanent minority position) and confidence 0.7 preserved; edge ID
  renamed (quantum-computing precedent).
- **control-theory: REVIEW CONCLUDED — STAYS DOMAIN-DIRECT.** LCC nests TJ212-225 in TJ
  (mechanical wing); UDC 681.5 'Automatic control technology. Smart technology' files in the
  precision-instruments/manufacturing wing (class 68); the existing edge note itself records
  EE-side institutional homes (MIT EECS+Aero, Imperial EE). Three-way wing split →
  contradiction-nesting rule → the domain-direct target is already the correct flatten. No change;
  review recorded here.
- **information-theory ECE-side §13 (session #8 parking): EVIDENCE GATE NOT MET — recorded.**
  Live collection 2026-06-11: UDC 621.39 and 621.391 are **empty at UDC Summary granularity**
  (getrecord probes); the LCC class-T outline names no information-theory range inside TK; LCC's
  own information-theory home (Q350-386) is in class Q (science). No engineering gate-scheme
  filing → no edge; parking record updated with the live probe results.

## §12 precedent candidates (for #14 — not appended to §12)

6. *Cross-check schemes don't contradict:* a FORD sibling division does not defeat a gate-scheme
   nesting (nanotechnology: UDC 620.3-inside-620 nests despite FORD 2.10 ∥ 2.5).
7. *Caption-presence/wing-consistency:* when a division caption's co-naming is used for
   criterion (a) presence, the same caption places the area in that division's wing for
   nesting analysis (nuclear: UDC 621 caption → mechanical-general wing → contradicts LCC TK
   nesting → flatten).
8. *Shelving flatten direction:* a single shelving entry inside a subclass's general portion does
   not nest the area under that subclass's discipline (systems-engineering TA168 — ASL shelving
   principle applied in the flatten direction).

## SPN note

No new URLs beyond the node batch (same id.loc.gov records + capture citations); the edge batch
adds no SPN debt. Outstanding queue unchanged: TN600-TN799 (1).
