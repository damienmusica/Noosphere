# Promotion Report — Life Sciences Skeleton v1 (session #13b)

What entered `/data` and under which standing policy. Promotion is the policy gate (node policy v1–v1.3, edge policy v1, cross-listing v1) — not per-item sign-off.

## Nodes (+19): /data 196 → 215

**Reviewed + indexable (17)** — node policy v1: resolver-verified Wikidata QID + QC `ambiguous=false`:
field:biology (Q420), subfield:botany (Q441), subfield:zoology (Q431), subfield:microbiology (Q7193), subfield:genetics (Q7162), subfield:molecular-biology (Q7202), subfield:cell-biology (Q7141), subfield:ecology (Q7150), subfield:evolutionary-biology (Q840400), subfield:developmental-biology (Q213713), subfield:immunology (Q101929), subfield:virology (Q7215), subfield:parasitology (Q180502), subfield:mycology (Q7175), subfield:systematics (Q3516404), subfield:marine-biology (Q7173), subfield:bioinformatics (Q128570).

**Proposed (2)** — node policy v1.3 cross-continent rule 3 (boundary area filed in-continent stays, real-world contest → stops at `proposed`):
subfield:physiology (Q521), subfield:anatomy (Q514). Both carry a verified QID but stop at `proposed` on the LCC-vs-UDC **medicine boundary** (LCC QP/QM in-continent; UDC 611/612 under 61 Medicine). Not indexable. Medicine-side §13 membership parked for the medicine-and-health continent.

All 19 QIDs resolver-verified + multi-signal re-checked (qc-report dashboard). academic_status = established (all 19). domain = `life_sciences`. created/updated 2026-06-11.

## Translations (+19): 196 → 215
One `en` translation per node (label + empty aliases; `reviewed` flag mirrors node status). **No summaries** — editorial is carried over (parallel-round ⑤ default + decision (26) Opus generation in a later editorial session). Reviewed-without-summary gap this session: 17 (added to the editorial invoice).

## Edges (+19 part_of, 2 retargeted): /data 217 → 236

**part_of skeleton (19)** — edge policy v1 clause 1 (structural edge, classification-sourced, QC no-flag → reviewed; status capped at min of endpoints):
- `field:biology → domain:life-sciences` (reviewed; LCC QH301-705.5 + UDC 57 + FORD 1.6).
- 16 subfields → field:biology (reviewed).
- physiology, anatomy → field:biology (**proposed**, capped — node is proposed).
- **Flat structure** (orchestrator ruling): no subfield-under-subfield nesting; the gate schemes disagree on virology/microbiology and fungi/botany nesting, so the contradiction-nesting rule flattens all to field:biology. evidence_kind = externally_sourced; proposed_by recorded (Sonnet generation, Fable QC).

**Re-target (2)** — cross-listing v1 / §13, the continent's recorded debt (task 7):
- `edge:biochemistry-part-of-life-sciences` and `edge:biophysics-part-of-life-sciences`: target moved **domain:life-sciences → field:biology** (edge ID + evidence preserved; quantum-computing/math-education precedent). Both stay reviewed (both endpoints reviewed). biochemistry now dual: field:chemistry + field:biology; biophysics now dual: field:physics + field:biology. field:biology ends with **20 part_of children** (18 native + 2 cross-listed).

## Coverage (unique-node basis)
Life-sciences continent: **19 nodes** (17 reviewed + 2 proposed), **19 part_of edges** + 2 §13 cross-list edges into the continent. Continent topology complete except the 2 medicine-boundary proposed nodes (B-queue) and the parked §13 candidates (CS-bioinformatics, medicine-physiology/anatomy, geography-biogeography).

## Dashboards (this batch)
- Generator QID-hint hallucination: **73.7% (14/19 wrong)** — in band (93→71→72→80→74).
- Resolver rank-1 correctness: **19/19 (100%)**; upstream gaps **0** (clean continent).
- Hint-laundering caught at node QC: **0** (generator's [UNFETCHED] honesty held; 15 markers, all legitimate).
- Edge coverage: 19/19; edge laundering: 0 (grounding citations matched verified classification homes).
- Golden-set: 199 → 218 (+19), regression 0.
- §12 A-type flags retired by ruling: 7 (molecular-/developmental-biology, parasitology, mycology, systematics, marine-biology + the single-field structural decision). B-type retained: 2 (physiology, anatomy — medicine boundary).
- Citation/SPN: classification sources captured live; SPN existing-snapshot-first per §8 — see session-13b-report SPN ledger.
