# QC report — social-sciences-part-of-edges-v1

- **QC:** Claude Fable 5 (orchestrator session #13a), 2026-06-11. Generation: Claude Sonnet
  (claude-sonnet-4-6), separate context (ADR 0007; `proposal.json` is the QC-shaped 42-edge set —
  raw was 43 edges + 1 modification entry).
- **Inputs:** §12 part_of-edge precedents + §13 (pinned `d816cb6`), the captured baseline, the
  promoted 36-node ledger with statuses, and the five-junction trigger dossier
  (`edge-batch-context.txt`).

## Disposition

| Measure | Count |
|---|---|
| Generated | 43 edges + 1 modification |
| Kept after shaping | **42** (32 `reviewed` / 10 status-capped `proposed`) |
| QC structural rewrites | 3 (demography dual→domain-flatten; public-administration dual→domain-flatten; economic-geography §13 dual completed with the geography-side edge) |
| Trigger items executed | 5/5 (see ledger) |
| Edge-batch laundering caught | **1 scheme-misattribution + 4 misquote artifacts** (all substance-real, corrected) |
| Flags upheld (→ `proposed`) | 3 flag-capped (criminology ×2, decision-theory) + 7 endpoint-capped |

## Structural rulings (QC — §12 precedent candidates for #14)

1. **Demography flattened to domain-direct** (`edge:demography-part-of-social-sciences`,
   replaces the generated economics+sociology dual): LCC nests demography inside the
   economics-theory subclass (HB848-3697, captured) while UDC files it as its own division
   directly under 3 (314, peer of 316/33 — captured) — contradictory depth claims flatten to the
   common ancestor (CIS computer-vision/NLP + geodesy mirror, one rank up: when the contradiction
   is about field membership itself, the flatten target is the domain). The generated
   sociology-side edge had **no classification grounding** (UDC 314's peerhood is evidence
   *against* sociology nesting) — §13's same-evidence gate would have failed it. Economics-side
   LCC filing recorded as parked §13 evidence.
2. **Public administration flattened to domain-direct** (same rule): LCC nests JF1338-2112
   inside class J; UDC 35 is a peer division of 32 directly under 3 — flatten to domain;
   LCC class-J nesting parked as political-science-side §13 evidence; the independent
   policy-school institutional pattern ([UNFETCHED]) is consistent with domain-direct standing.
3. **Economic geography completed as a §13 co-equal dual**: economics side (LCC HF1021-1027
   'Commercial geography. Economic geography' inside HF Commerce + UDC 332 — captured) reviewed;
   geography side (FORD 5.7 'Social and economic geography' co-naming — captured) written and
   status-capped by its `proposed` endpoint (field:human-geography, unity-of-geography contest).
   The generator had parked the geography side; QC wrote it — capped edges are the designed
   mechanism for exactly this (NS 7-capped precedent).
4. **Criminology stays a flagged §13 dual** (sociology + law, both `proposed`): UDC 343.9
   explicitly nests under 34 Law (captured); LCC files HV6001-7220.5 in the class-H
   welfare/pathology wing — a head-on gate-scheme split (biophysics pattern). The sociology-side
   membership currently rests on the LCC family position + institutional home ([UNFETCHED]) —
   clause-6 resolves with live institutional evidence.
5. **Un-contradicted nestings deepened/kept** per the ASL/CIS rules: economics 33x cluster,
   education 37x cluster, law 34x cluster, anthropology GN nesting (UDC silence ≠ contradiction —
   CIS theory-cluster rule), social-stratification via UDC 316.34, IR/comparative-politics under
   32/class J (confidence 1.0). Gender-studies and social-work-and-welfare are domain-direct on
   UDC peer-division + LCC peer-subclass agreement (both schemes file them beside, not inside,
   sociology).

## Trigger ledger (과업 7 — all five executed)

1. **mathematics-education re-target — EXECUTED.** `edge:mathematics-education-part-of-social-sciences`
   now targets `field:education` (Previous target: domain:social-sciences recorded in the note;
   grounding unchanged — FORD 5.3, UDC 37, education-school doctoral home; quantum-computing
   precedent). The co-equal mathematics membership is untouched.
2. **game-theory economics-side §13 — WRITTEN, `reviewed`** (`edge:game-theory-part-of-economics`,
   conf 0.85): LCC HB135-147 Including-note names game theory (captured); FORD 5.2 division
   frame; community evidence [UNFETCHED] (GTS, Games and Economic Behavior, economics Nobel
   laureate game theorists). JEL not used, not cited (license — session #10 ruling). Co-equal
   with the mathematics + theoretical-computer-science memberships.
3. **decision-theory second membership — PARKING RELEASED → clause-6 queue** 
   (`edge:decision-theory-part-of-economics`, conf 0.65, **flag upheld → `proposed`**): the FS
   parking ("economics target node absent") is now open, but the captured economics-side
   evidence is thin (HB615-715 risk/uncertainty wing) — honest stop at `proposed`; clause-6
   gathers live evidence (Theory and Decision, graduate-core syllabi) next round.
4. **financial-mathematics minority-side §13 — WRITTEN, `reviewed`, disputed RETIRED (node + edge)**
   (`edge:financial-mathematics-part-of-financial-economics`, conf 0.7): the permanent minority
   note's LCC HG106 filing **live-verified at id.loc.gov** (authoritative label 'Mathematical
   models' under HG Finance, HTTP 200, 2026-06-11). NS mathematical-physics precedent: with the
   minority membership written, the single-parent contest dissolves — `disputed` removed from
   `subfield:financial-mathematics` and `edge:financial-mathematics-part-of-mathematics` (both
   carry permanent dissolution notes; dominant/minority asymmetry preserved by per-edge
   confidence 1.0-side vs 0.7).
5. **political-philosophy political-science-side §13 — WRITTEN, `reviewed`**
   (`edge:political-philosophy-part-of-political-science`, conf 0.9): LCC JC11-605 (captured) +
   UDC 321 (captured) + Wikidata Q179805 desc "sub-discipline of philosophy and political
   science" (orchestrator-verified, lastrevid 2502393413) — the political-theory duplicate-drop's
   parked evidence lands as the canonical node's second membership (aesthetics-junction pattern:
   philosophy node untouched, membership added).

Recorded only (no edges): statistics social-sciences-side §13 evidence (LCC HA29-32 + UDC 311.3
— parked, future batch); economic-history humanities-side candidate (history continent absent);
media/mass-comm humanities-side candidates (continent absent); urban-and-regional-planning ↔ 13d
coordination (#14); computational-social-science re-evaluation stays §12-routed (session #8
non-coverage unchanged).

## Edge-batch laundering audit (157 scheme-claim units)

- **1 scheme-misattribution:** the human-geography domain edge attributed LCC GF's caption to
  "UDC GF" — bogus clause removed, caught mechanically (substance was the adjacent, correct LCC
  claim duplicated under the wrong scheme).
- **4 misquote artifacts corrected:** econometrics + game-theory (HB135-147 caption merged with
  its Including note via em-dash — rewritten to quote-faithful form), gender-studies (UDC 305
  Including bracket silently truncated), criminology-law (UDC 343.9 Including bracket
  cherry-picked and re-ordered). All component claims verbatim-real.
- Cumulative session #13a laundering: node batch 1 true + 2 artifacts; edge batch 1
  misattribution + 4 artifacts — all caught by the mechanical audit before promotion.

## Status-capped ledger (10 `proposed` edges)

Flag-capped (3): criminology→sociology, criminology→law, decision-theory→economics.
Endpoint-capped (7): media-and-communication-studies→domain, human-geography→domain,
jurisprudence→law, physical-anthropology→anthropology, mass-communication→field,
urban-and-regional-planning→domain, economic-geography→human-geography.
All ten are clause-6/endpoint-resolution queue items — normal policy output (FS/NS precedent).
