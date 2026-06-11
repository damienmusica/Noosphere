# QC report — arts-design-skeleton-v1

- **QC:** Claude Fable 5 (orchestrator session #13d, parallel round v1, merge order 4), 2026-06-11.
  Generation: Claude Sonnet (claude-sonnet-4-6), separate context (ADR 0007 upheld;
  `nodes.proposed.json` preserves the raw 26-node generated set; `proposal.json` is the QC-shaped
  25-node set).
- **Inputs:** batch manifest (PR #75), §12 incl. precedent log at pin `d816cb6` (mandatory input),
  and the orchestrator's **live-captured baseline** (LCC M + N outline PDFs, UDC 7 with children
  71–79 via getrecord, FORD 6.4 from arrs.si — all captured 2026-06-11 before generation; paths in
  the manifest notes). The generator had no fetch tool: it cited the captured files as live and
  self-marked everything else [UNFETCHED]/training-knowledge.
- **QC live re-grounding captures (same day, orchestrator):** lcco_t.pdf (TR photography /
  TH building construction / TS subclass), lcco_p.pdf (PN motion pictures / theater),
  lcco_g.pdf (GV dancing), lcco_s.pdf (SB landscape architecture), lcco_h.pdf (HT city planning),
  UDC getrecord id=69 (building trade).

## Disposition

| Measure | Count |
|---|---|
| Generated | 26 (5 fields + 21 subfields; self-report exact) |
| Kept | **25** (5 fields + 20 subfields) |
| Dropped by QC | 1 (fashion-design — absorption) |
| Generator-stage seed absorption upheld | 1 (music-composition → field:music, rule 2) |
| Gap-filled by QC | 0 (coverage duty satisfied by the generated set) |
| A-flags retired by QC ruling | 1 on-node (graphic-design) + 1 notes-level closure (UDC 7.01 art-theory) |
| B-flags upheld | 2 (photography, urban-planning — clause-6/v1.1 queue) |
| Hint-laundering caught | **0** (85 captured-baseline claims mechanically checked; 2 citation-form deviations corrected — trend ~10 → 2 → 1 → **0**) |
| /data ID collisions / internal dups / contract violations | 0 / 0 / 0 (mechanical) |

## Drop (1) — live-verified grounds

1. **fashion-design → absorbed into decorative-arts** (polymer-chemistry precedent): LCC
   NK4700-4890 "Costume" (captured) is a single-scheme named range inside NK, and the nearest UDC
   caption — 746 "Fancy work. Art needlework" (captured) — names needlework crafts, a **different
   referent**, so no second gate scheme grounds fashion design. A single-scheme range plus a strong
   community (CFDA; Parsons/FIT/Central Saint Martins; BFA tracks) is exactly the profile absorbed
   in natural sciences (polymer-chemistry: QD380-388 + ACS POLY, absorbed). **v2 re-split
   candidate, first in line for this continent.** Contrast kept siblings: interior-design
   (NK1700-2195 **+ UDC 747 "Interior decoration"** — matching captions in both schemes) and
   ceramic-arts (NK3700-4695 **+ UDC 738 "Ceramic arts. Pottery"**) are genuine dual-scheme cases
   (electrochemistry/ASL-pillar pattern) and stay.

## A-flag rulings (retirements — §12 precedent candidates below)

- **graphic-design (QID collision): RETIRED.** The generator assigned Q185925 to both
  graphic-design and printmaking and self-reported the error. Ruling: a QID collision between two
  distinct nodes is an **input-hint error, not an identity or design question** — node identity is
  unambiguous on distinct dual-scheme anchors (NC997-1003 + UDC 766 vs NE + UDC 76). The
  graphic-design hint is withdrawn (honest gap); resolver v4 establishes identity. Printmaking
  keeps its unverified hint.
- **UDC 7.01 art-theory vs `subfield:aesthetics` (notes-level, pre-registered question 2):
  CLOSED — no second node.** The generator proposed no separate art-theory node; QC confirms. The
  arts-side "theory and philosophy of art" axis (UDC 7.01) records as **deliberate non-coverage**;
  `subfield:aesthetics` (Q35986, philosophy) keeps sole custody of the referent until a distinct
  visual-art-theory community with its own classification standing is demonstrated. The philosophy
  node is untouched; the junction is recorded here only.

## B-flags upheld (2 — promotion stops at `proposed`, clause-6 queue)

1. **photography** — gate schemes split **head-on**, live-confirmed: UDC 77 is a full arts-class
   major (captured baseline) while LCC's only home is subclass TR "Photography" (TR1-1050) in
   class T, technology (lcco_t.pdf, QC live). This is the biochemistry/biophysics pattern, not a
   mere other-home filing. Resolution hypothesis for the clause-6/v1.1 path: §13 dual membership
   (arts + engineering-and-technology), pending external evidence collection.
2. **urban-planning** — genuine multi-home contest: UDC 711 + LCC NA9000-9428 (in-continent,
   captured) vs LCC HT165.5-169.9 "City planning" (class H social sciences — QC live capture
   corrected the generator's imprecise HT165-169 bounds) vs mixed institutional homes (planning
   schools sit in design colleges, policy schools, and engineering faculties). Stops at
   `proposed`; clause-6/v1.1 queue. The social-sciences side is **recorded, not negotiated**
   (13a boundary per assignment table).

## Other-home filings ruled by precedent (no flags — §12 flag semantics)

The class-G precedent (NS clause-6, 2026-06-11) is applied as **one interpretation for the whole
cluster**: an out-of-continent LCC shelving does not defeat arts membership when UDC 7 + FORD 6.4
+ community file the discipline in-continent. Live-confirmed instances this batch:
theatre-studies (PN2000-3307 "Dramatic representation. The theater"), film-studies (PN1993-1999
"Motion pictures"), dance (GV1580-1799.4 "Dancing"), landscape-architecture (SB469-(476.4)
"Landscape gardening. Landscape architecture" — agriculture-side evidence parked, record only).
This extension of the precedent beyond class G (to classes P, S, and GV-within-G) is a §12
precedent candidate below.

## Hint-laundering audit (mechanical, against the captured baseline)

All 85 `(captured baseline)` attributions across the 26 generated nodes were mechanically
cross-checked against the capture files. **Zero fabrications.** Two citation-form deviations on
musicology (the 78.03 caption quoted with altered punctuation; 781.7 and 781.8 joined into an
invented range form "781.7-781.8") — substance real in both, corrected in place in
`proposal.json` and counted as transcription deviations, not laundering. Every parser-flagged
candidate was hand-adjudicated; the remaining 4 were extraction artifacts (quotes spanning two
adjacent captions). The captured-baseline-only mandate continues to work: ~10 (session #8) → 2 →
1 (NS) → **0**.

QC also **trimmed one unsupported interpretive attribution**: the generator's "FORD 6.4 component
'arts' implicitly covers architecture" — FORD 6.4's captured caption names four components, none
of them architecture. The architecture keep stands on LCC NA + UDC 72 alone; FORD-side silence is
now recorded honestly in the node.

## Architecture §13 (pre-registered question 1) — status

Art-side first membership: LCC NA + UDC 72 (both captured baseline) — clean. Engineering-side
evidence is now **live-captured by the orchestrator**: LCC TH "Building construction" (TH1-9745),
UDC 69 "Building (construction) trade. Building materials. Building practice and procedure",
FORD 2.1 "Civil engineering" (same arrs.si capture as 6.4). The §13 engineering-side membership
edge is written at the **edge batch** with the full dossier (session task 7), with ISCED-F
corroboration to be fetched (its 073 "Architecture and construction" sits under the engineering
broad field). Anti-spam guard respected: no engineering-side edge exists yet.

## Coverage duty

The generator's per-scheme coverage tables (LCC M subclasses M/ML/MT; LCC N subclasses
N/NA/NB/NC/ND/NE/NK/NX; UDC 7.01–7.09 axis; UDC 71–79 children with the excluded 793.5–799/
796–799 wing separated; FORD 6.4's four components) are accepted after spot-verification against
the capture. Deliberate non-coverage records accepted: recreation/entertainment/games/sport wing
(assignment-table exclusion — community home sports science/health), media-communications (13a),
literature/linguistics (humanities-residual), music therapy (medicine adjacency), arts
administration, art criticism, digital/new-media art, numismatics, glyptics, metal arts, glass
arts, textiles, illustration, caricature (all v2-or-absorbed records in the proposal notes).

## §12 precedent candidates (for #14 integration — NOT appended to §12 by this session)

1. **Other-home-filing interpretation generalizes beyond class G:** LCC class-P (PN theatre/
   film), class-S (SB landscape architecture), and GV (dance) shelvings do not defeat arts
   membership when UDC 7 + FORD 6.4 + community file the discipline in-continent; interpreted
   once, identically, for the whole cluster; out-of-continent evidence parks as record-only.
2. **Referent-mismatch absorption (fashion-design):** a single-scheme named range plus a strong
   community fails criterion (a) when the second scheme's nearest caption names a different
   referent (NK4700-4890 Costume vs UDC 746 needlework) — polymer-chemistry pattern applied
   across a referent mismatch; v2 re-split candidate.
3. **Umbrella + qualifying children coexist inside one LCC subclass:** decorative-arts (NK
   umbrella) keeps alongside interior-design and ceramic-arts, which pass the dual criterion
   independently (peer-coexistence rule applied subclass-internally; contrast computer-systems,
   where the children failed and were absorbed).
4. **QID-collision flags retire as input errors:** a generator QID collision between two distinct
   nodes is hint-input error, not identity ambiguity — withdraw the hint, keep the node unflagged,
   let the resolver fill identity.
5. **Identity-distinct test outcome at the aesthetics junction:** UDC 7.01 "Theory and philosophy
   of art" records as arts-side deliberate non-coverage; the philosophy continent's
   `subfield:aesthetics` keeps sole custody of the referent (no second node without demonstrated
   distinct community + classification standing).
6. **Composition absorption (generator-stage, upheld):** when both gate schemes file an area only
   as a subdivision (MT40-67; UDC 78.02), a strong practitioner community (conservatory
   composition departments) cannot alone carry a skeleton node — v2 re-split candidate.

## Next step

Manifest seeds regenerated mechanically from the QC-passed `proposal.json` (25 seeds — CS/FS/NS
precedent); resolver v4 runs locally next under the network lock (round protocol ③); per-QID
verdicts land in `grounding-report.md`, promotion in `promotion-report.md` (merge order 4).
