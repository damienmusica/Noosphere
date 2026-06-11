# QC Report — Life Sciences Skeleton v1 (session #13b, parallel round v1 branch 13b)

- **Generation:** Sonnet (`claude-sonnet-4-6`), separate context (ADR 0007). 25 nodes proposed (1 field + 24 subfields), 0 edges (skeleton-first).
- **QC:** orchestrator (Fable 5), full fact-check, 2026-06-11. Live classification verification via id.loc.gov authority records (HTTP 200 logged per node), against the pre-captured LCC QH–QR / UDC 57-59 / FORD 1.6 baseline.
- **Outcome:** 19 kept (17 reviewed-track + 2 proposed-track) / 6 dropped (3 absorbed, 3 non-coverage). Net continent: `field:biology` + 18 subfields.

## Structural decision — single-field continent

`domain:life-sciences → field:biology → subfields`. Biology is the continent's **single field** (level 1); botany/zoology/microbiology/genetics/etc. are **peer subfields** (level 2). Grounds: FORD 1.6 is one field; the humanities→philosophy single-field precedent; the algebra-under-mathematics pattern (a branch with its own LCC subclass is still a subfield of its parent). LCC's separate subclasses QK/QL/QM/QP/QR are **shelving granularity, not co-equality** claims (mirrors the CIS/ASL precedent that library shelving scatter is not a hierarchy claim). The generator pre-registered this and QC confirms it.

## Kept nodes (19)

### Reviewed-track (17) — clean dual-criterion pass, eligible for `reviewed` on resolver-verified QID
field:biology (QH301-705.5 / UDC 57 / FORD 1.6); subfield:botany (QK / UDC 58); subfield:zoology (QL / UDC 59); subfield:microbiology (QR / UDC 579); subfield:genetics (QH426-470 / UDC 575); subfield:cell-biology (QH573-671 Cytology / UDC 576); subfield:ecology (QH540-549.5 / UDC 574); subfield:evolutionary-biology (QH359-425 / UDC 575); subfield:immunology (QR180-189.5); subfield:virology (QR355-502 / UDC 578).

Plus 7 where QC **retired an A-type flag** by live id.loc.gov verification of a generator `[UNFETCHED]`:
- **subfield:molecular-biology** — `[UNFETCHED]` LCC home resolved live: **QH506 = "Molecular biology"** (+ UDC 577 names it). Distinct from biochemistry/biophysics (§13).
- **subfield:developmental-biology** — §12 **label rule**: the modern unified discipline subsumes LCC QH471-489 Reproduction + QL951-991 Embryology + QM601-695 Human embryology (QH491 has no id.loc.gov record → anchored on the reproduction/embryology ranges). Overwhelming community (SDB, *Development*).
- **subfield:parasitology** — `[UNFETCHED]` resolved live: **QL757 = "Parasitology"** (dedicated range in QL Zoology). Medical-parasitology adjacency recorded (not blocking — in-continent LCC home is decisive).
- **subfield:mycology** — `[UNFETCHED]` resolved live: **QK600 = "Fungi"** (dedicated range). Kept as a **peer** despite a classification home inside botany (see §12 precedent candidate 2).
- **subfield:systematics** — `[UNFETCHED]` resolved live: **QH83 = "Classification. Nomenclature"** (dedicated systematics/taxonomy range). SSB / *Systematic Biology* + cladistics. Evolutionary-biology adjacency (phylogenetics) recorded.
- **subfield:marine-biology** — LCC home is **QH90.5-95.7 Aquatic biology** (QH95 "General works" confirms range live) + UDC 574 Hydrobiology. Distinct established community (Woods Hole MBL, Scripps, MBA). Distinct from oceanography (NS) — adjacency recorded.
- **subfield:bioinformatics** — CS-transfer accepted (session-#8 §12 ruling). LCC **QH324.2** confirmed live (the biology data-processing/bioinformatics cutter in the §12 precedent log). **CS-side §13 candidate RECORDED** (ACM CCS "Applied computing > Life and medical sciences > Computational biology" → field:computer-science), edge not written (skeleton-first).

### Proposed-track (2) — B-type medicine-boundary contest, stop at `proposed`
- **subfield:physiology** — LCC QP (own subclass, **in-continent**) vs UDC 612 under **61 Medicine** — a head-on gate-scheme split (the biophysics/biochemistry LCC-vs-UDC pattern). Kept in-continent on LCC QP + APS community; stops at proposed; **medicine-side §13 membership PARKED** for the medicine continent. General physiology in-continent; clinical/human wing = medicine-transfer candidate.
- **subfield:anatomy** — LCC QM (own subclass) + comparative anatomy QL801-950.9, **in-continent** vs UDC 611 under 61 Medicine (same split). Stops at proposed; clinical/human anatomy = parked medicine §13/transfer candidate.

## Dropped nodes (6)

| Node | Disposition | Grounds |
|---|---|---|
| subfield:genomics | **Absorb → genetics** (v2 re-split) | id.loc.gov **QH447 "Genes. Alleles. Genome" is a cutter INSIDE genetics QH426-470** — a refinement, not a peer division. No independent gate-scheme division. |
| subfield:biogeography | **Absorb → ecology** (v2 re-split + geography §13 candidate) | UDC 574 names Biogeography as an *included concept* within "General ecology and biodiversity", not a separate division. |
| subfield:structural-biology | **Absorb → biophysics(§13)/molecular-biology** (v2 + §13 candidate) | No dedicated classification division; technique-defined; overlaps the canonical biophysics node. |
| subfield:systems-biology | **Non-coverage** (v2/emerging) | No LCC/UDC classification division (UDC 573 does not name it). Emerging. data-science / representation-theory precedent. mathematical-biology adjacency. |
| subfield:synthetic-biology | **Non-coverage** (v2/emerging) | No classification division. Industrial-process wing is FORD 2.8/2.9 (engineering 13c). |
| subfield:conservation-biology | **Non-coverage / §13 candidate w/ environmental-science** | UDC 502/504 IS the canonical field:environmental-science's anchor; LCC QH75 has no id.loc.gov record (404). Avoid duplicating environmental-science. ecology adjacency. |

All six are honest deliberate non-coverage / absorption, recorded as v2 re-split or §13 candidates — policy-correct output, not silent drops.

## §12 precedent candidates (for #14 to append to docs/data-foundry.md §12 — NOT appended by 13x)

1. **Life-sciences single-field structure.** A continent whose classification family splits into several LCC subclasses (QH/QK/QL/QM/QP/QR) but is one FORD field (1.6) is modeled as a single field with peer subfields — the branch-with-its-own-subclass is still a subfield (algebra-under-mathematics; CIS shelving-scatter precedent). FORD field-level granularity + the conceptual "branch of biology" reading govern; LCC subclass separation does not force field-level co-equality.
2. **Peer despite parent-shelving (mycology).** A node whose classification home sits *inside* a sibling subfield's range (QK600 "Fungi" within QK Botany) is kept as a **peer**, not absorbed, when it has a dedicated cutter-level range *and* a distinct kingdom-/community-level identity (MSA/BMS; fungi are a separate kingdom) — the optics-vs-AMO peer-coexistence pattern applied to organismal biology.
3. **Cutter-location absorption test (genomics).** When a candidate's only classification anchor is a cutter that sits *inside* a kept node's range (QH447 "Genes. Alleles. Genome" inside genetics QH426-470), that is evidence of refinement → absorb, not peer. Sharpens the §12 absorption rule with an id.loc.gov cutter-location check.
4. **Gate-scheme medicine split (physiology/anatomy).** LCC files general physiology/anatomy in science (QP/QM, in-continent) while UDC files 611/612 under 61 Medicine — a head-on split (biophysics/biochemistry pattern). Kept in-continent on the LCC home + community; stopped at `proposed` as a B-type contest; the medicine-side §13 membership is parked for the medicine continent (geodesy/TU-Delft parking pattern). The clinical/human wing is the transfer candidate; the general/comparative science stays.
5. **Methods-defined field absorption (structural-biology).** A field defined by technique rather than subject matter, with no dedicated classification division and heavy overlap with a canonical node (biophysics), absorbs rather than entering — v2/§13 candidate.
6. **Emerging-without-classification non-coverage (systems-/synthetic-biology).** Emerging fields with departments/journals but no LCC/UDC classification division are deliberate non-coverage (data-science precedent), recorded as v2/emerging candidates.
7. **Avoid duplicating an existing cross-continent field (conservation-biology).** A candidate whose classification anchor IS an existing canonical node's anchor (UDC 502/504 = environmental-science) is recorded as a §13 cross-list candidate, not a duplicate node.

## Triggers / parking recorded (for the report and later sessions)

- **Retarget (task 7, this session):** field:biology now exists → re-target `edge:biochemistry-part-of-life-sciences` and `edge:biophysics-part-of-life-sciences` from domain:life-sciences to field:biology (ID + evidence preserved; quantum-computing/math-ed precedent).
- **bioinformatics CS-side §13 candidate (parked):** ACM CCS Computational biology → field:computer-science membership edge — recorded, written when its evidence gate passes (edge batch).
- **physiology/anatomy medicine §13 candidates (parked):** for the medicine-and-health continent (clause-6/§13 resolution).
- **biogeography geography-side §13 candidate (parked):** no geography node exists.
- **v2 re-split queue:** genomics, biogeography, structural-biology, systems-biology, synthetic-biology, conservation-biology.

## QID anomalies handed to the resolver (Task 4)

- subfield:mycology hint **Q7193** collides with subfield:microbiology's hint — resolver must verify/replace.
- subfield:biogeography hint **Q40614** collides with NS seismology — node dropped anyway.
- All 19 kept QIDs are unverified training-knowledge hints; the resolver verifies/replaces every one (multi-signal, rule (9)). Resolver dashboard appended below.

## Resolver v4 dashboard (Task 4)

- **Run:** `foundry:resolve-wikidata` (resolver v4, generator pack v4), under network lock `/tmp/noosphere-net-lock/` (acquired/released cleanly; lock-owner recorded). 19 seeds.
- **Result:** **19/19 resolved, 0 unresolved/upstream-gap (first life-sciences continent — a clean continent, like NS).** 7 flagged `ambiguous`.
- **rank-1 correctness: 19/19 (100%).** Every selected_qid was the resolver's rank-1 AND the correct discipline entity (multi-signal confirmed). The 7 `ambiguous` flags were **not** identity contests — they are a known resolver recall limitation: the disciplines' Wikidata P31 is `Q28598684` ("branch of biology"), which is **not in the resolver's curated positive-type allow-list**, so they scored 40 (label/sitelink only) and tripped the weak-signal flag. Each was confirmed via independent signals (exact label + enwiki sitelink + `P279` parent + discipline description + aliases). This is the documented "P31 is a signal, never a gate" path working as designed.
- **Generator QID-hint accuracy: 5/19 (26.3%) — 73.7% hallucination**, squarely in the established band (93→71→72→80→74%). Correct hints: biology Q420, microbiology Q7193, ecology Q7150, anatomy Q514, systematics Q3516404. The other 14 were wrong and the resolver corrected them.
- **Collision auto-corrected:** generator gave mycology the microbiology QID (Q7193); the resolver selected **Q7175 "mycology"** correctly. Golden-set `must_not_select: [Q7193]` guard added for mycology. Cross-domain homonym guard added for systematics (`must_not_select: [Q105769]` — systems-theory "systematics").
- **Triangulation corroborations (P279):** parasitology Q180502 P279=zoology (matches LCC QL757); virology Q7215 P279=microbiology Q7193; bioinformatics Q128570 desc = "biology + computer science + statistics" (corroborates the CS-side §13 candidate).

### Final verified QID map (19)
| node | QID | tier |
|---|---|---|
| field:biology | Q420 | reviewed |
| subfield:botany | Q441 | reviewed |
| subfield:zoology | Q431 | reviewed |
| subfield:microbiology | Q7193 | reviewed |
| subfield:genetics | Q7162 | reviewed |
| subfield:molecular-biology | Q7202 | reviewed |
| subfield:cell-biology | Q7141 | reviewed |
| subfield:ecology | Q7150 | reviewed |
| subfield:evolutionary-biology | Q840400 | reviewed |
| subfield:developmental-biology | Q213713 | reviewed |
| subfield:immunology | Q101929 | reviewed |
| subfield:virology | Q7215 | reviewed |
| subfield:parasitology | Q180502 | reviewed |
| subfield:mycology | Q7175 | reviewed |
| subfield:systematics | Q3516404 | reviewed |
| subfield:marine-biology | Q7173 | reviewed |
| subfield:bioinformatics | Q128570 | reviewed |
| subfield:physiology | Q521 | **proposed** (B medicine boundary) |
| subfield:anatomy | Q514 | **proposed** (B medicine boundary) |

- **Golden-set:** +19 entries (199 → **218**), all `verdict: verified, rank1_expected: true`; regression check **19 pass / 0 warn / 0 fail, no regressions**. `must_not_select` guards: mycology [Q7193], systematics [Q105769].
- **Resolver v5 pitstop feedback (queued, not acted on — no preemptive tooling):** add `Q28598684` ("branch of biology") to the resolver's positive-type allow-list (`QID_LABELS`/abstract family) — it caused **6 false-ambiguous flags** this batch (molecular-/developmental-biology, virology, parasitology, bioinformatics, + systematics). Label-verified before adding. This is a measured failure → next pitstop, per the cadence rule.

