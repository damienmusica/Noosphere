# QC report — medicine-and-health part_of edges v1 + medicine-entry §13

> Orchestrator (Fable 5), session #18, 2026-06-12. 53 edges: 50 skeleton part_of +
> 3 §13 medicine-entry resolutions (task 2). Gate evidence LCC class R + UDC class 61
> (captured-sources.md, baseline 2026-06-12). Edge promotion policy v1 (decision (15)).

## Skeleton part_of (50)

- **22 fields → domain:medicine-and-health.** Confidence 1.0 for fields with their own LCC R subclass + UDC 61x division (public-health RA/614, pathology RB, internal-medicine RC/616, surgery RD/617, ophthalmology RE/617.7, otolaryngology RF, ob/gyn RG/618, pediatrics RJ, dentistry RK/616.31, dermatology RL/616.5, pharmacology RM/615, pharmacy RS/615.1, nursing RT); 0.95 for psychiatry/neurology (UDC 616.89/616.8 own division + LCC RC shelving); 0.9 for radiology/medical-physics (R895-920 range) and alternative-medicine (RV/RX/RZ); 0.85 for the named-sub-range ABMS-primary specialties (anesthesiology RD78, emergency-medicine RC86-88.9, PM&R RM695-893, family-medicine R729.5).
- **28 subfields → field parent** per the gate nesting (internal-medicine ×10, surgery ×5, public-health ×8, pharmacology ×1 [toxicology, UDC 615.9], radiology ×1 [nuclear-medicine, shared R895-920], alternative-medicine ×3). forensic-medicine → public-health (LCC RA1001-1171 sits in subclass RA; pathology affinity noted). toxicology → pharmacology (UDC 615.9 nests under 615; RA1190 environmental/forensic affinity is a §13 candidate).
- **Status:** 48 reviewed; **5 status-capped proposed** (clause 3, edge ≤ min(endpoints)): alternative-medicine→domain, nutrition-science→public-health, and the 3 alternative-medicine children (homeopathy/chiropractic/naturopathy→alternative-medicine). homeopathy is reviewed but its edge caps to proposed on the proposed parent.
- **Edge hint-laundering sweep:** 0 — every edge note anchors on captured LCC/UDC ranges or live-verified ones (RA441 global-health, RZ440 naturopathy, R729.5 family-medicine).

## §13 medicine-entry resolutions (task 2 — debt §2① medicine-linked 4)

Cross-listing v1 §13 (decision (21)). Co-equal memberships, **no `disputed` tag** (other-home filing = support, not premise-denial — session #7 interpretation):

- **physiology** (Q521): life-sciences home retained (edge:physiology-part-of-biology, LCC QP) + medicine §13 (UDC 612 Physiology under 61 Medical sciences, captured) → both gate-grounded → **node proposed→reviewed+indexable**, home edge uncapped to reviewed.
- **anatomy** (Q514): life-sciences home retained (LCC QM/QL) + medicine §13 (UDC 611 Anatomy under 61) → **node reviewed+indexable**, home edge reviewed.
- **biomedical-engineering** (Q327092): engineering home retained (LCC TA164 + FORD 2.6) + medicine §13 (LCC R856-857 Biomedical engineering under R) → **node reviewed+indexable**, home edge reviewed.
- **medical-physics**: needed no §13 — created as a native medicine field in the skeleton batch (the NS→medicine transfer, decision (30)). This completes the 4 medicine-entry items.

The §13 edges target domain:medicine-and-health directly (no field-level basic-medicine parent exists; §13 permits domain-direct with the membership recorded in the note).

## Result

/data: nodes 307→357 (reviewed 292→341, proposed 15→16, indexable 292→341), edges 339→392 (reviewed 320→360, proposed 19→32). typecheck ✓ validate:data ✓.
