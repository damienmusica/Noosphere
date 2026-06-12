# Promotion report — medicine-and-health skeleton v1

> Standing promotion policy v1–v1.3 (vault decision log (7)(10)(12)(14)): verified
> resolver QID + QC `ambiguous: false` → `reviewed` (indexable); verified QID +
> `ambiguous: true` → `proposed`; no QID → foundry. CPO governs policy/dashboards,
> not per-item sign-off. Session #18, 2026-06-12.

## Distribution — 50 nodes

- **reviewed (indexable): 46** — verified QID + ambiguous=false. 22 fields − 1 (alternative-medicine) = 21 reviewed fields + 25 reviewed subfields.
- **proposed: 4** — verified QID + ambiguous=true:
  - `field:alternative-medicine` (Q188504, non_academic) — umbrella-coherence flag.
  - `subfield:nutrition-science` (Q17652193) — cross-continent §13 (medicine UDC 613.2 vs life-sciences QP141); life-sciences membership candidate parked.
  - `subfield:chiropractic` (Q658096, non_academic) — academic_status contest (licensed health profession vs pseudoscientific core claims = B-type).
  - `subfield:naturopathy` (Q213403, non_academic) — same status contest (criterion (a) resolved by live RZ440; the residual flag is the status framing, B-type).
- **foundry (no QID): 0** — all 50 grounded.

## academic_status tags

- `non_academic` (4): alternative-medicine, homeopathy, chiropractic, naturopathy — the project indexes contested/pseudoscientific systems honestly with status tags (vision: "사이비 분야도 배제하지 않고 상태 태그로 포용"). homeopathy is `reviewed`+`non_academic`+indexable (uncontested-pseudoscience, stable identity, LCC RX subclass); chiropractic/naturopathy stop at `proposed` (active profession-vs-pseudoscience status contest).
- `established` (46): all other nodes.

## Edges / §13

part_of skeleton edges + the 3 medicine-entry §13 resolutions (physiology, anatomy, biomedical-engineering) are the separate `medicine-and-health-part-of-edges-v1` batch. medical-physics needed no §13 — it is created here as a native medicine field (the natural-sciences→medicine transfer, decision (30)).

## Adversarial QID audit

The 48 newly-introduced QIDs (50 nodes − 0 reusing existing /data QIDs; family-medicine + medical-physics included) are audited inline this session (decision (34)②) — see `qid-adversarial-audit-medicine-v1/`. Golden-set appended after the audit confirms 0 regressions.
