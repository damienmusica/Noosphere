# Grounding report — medicine-and-health skeleton v1 QID resolution

> Resolver v4 (`scripts/foundry/resolve-wikidata.ts`, local network) + orchestrator
> multi-signal verification, session #18, 2026-06-12. Resolver is the QID authority;
> training-knowledge hints in the proposal are NOT evidence (the order's medical-homonym
> caution + duplicate-link anomaly Q141495/Q11216 class → multi-signal, never label-match).

## Resolver run

- 49 seeds → **49 resolved / 0 unresolved**, 14 flagged ambiguous (score-based rank competition).
- Generator QID-hint hallucination (per the calibration dashboard): the generator reused placeholder QIDs (Q189553 otolaryngology on 6 unrelated nodes; Q101929 immunology on pharmacology/endocrinology) — confirming hints are unusable, resolver/verification is the gate.

## Multi-signal verification (live EntityData P31 + label + aliases)

All 50 final QIDs are verified `instance of` a medical specialty (Q930752) / academic discipline (Q11862829) / field of study (Q4162444) — none is a journal, work, person, or homonym object. Highlights:

- **3 manual overrides** (decision-log (9) live-verified path — resolver rank-1 was a wrong referent):
  - `field:obstetrics-and-gynecology`: resolver Q1221899 "gynaecology" → **Q80015** "obstetrics and gynaecology" (P31 medical specialty; aliases OB-GYN/OB/GYN). Resolver picked the gynaecology-only sub-referent.
  - `field:physical-and-rehabilitation-medicine`: resolver Q2428433 "restoration ecology" (score artifact) → **Q2678675** "physical medicine and rehabilitation" (aliases PM&R, physiatry).
  - `field:pharmacology`: resolver Q1774688 "clinical pharmacology" → **Q128406** "pharmacology" (branch of biology concerning drugs). The general discipline, not the clinical sub-specialty.
- **forensic-medicine Q454812** kept over Q20565501: Q454812 "medical jurisprudence" (aliases legal medicine, forensic medicine) exactly matches the captured LCC RA1001-1171 caption "Forensic medicine. Medical jurisprudence. Legal medicine"; Q20565501 is a "group of medical specialties" grouping.
- **orthopedic-surgery Q216685** "orthopedics" kept (canonical discipline, alias orthopedic-surgery) over the thin near-duplicate Q15218776.
- **cardiothoracic-surgery Q2964004** "thoracic surgery" (alias cardiothoracic surgery) — gate discipline anchor; node label retained as cardiothoracic-surgery (common naming).
- **family-medicine Q3505712** (added at QC) verified: medical specialty, aliases family practice / general medicine.
- **alternative-medicine Q188504** Wikidata description "form of non-scientific healing" + **naturopathy Q213403** "form of alternative medicine" corroborate the academic_status=non_academic tags.

## Collision checks

- 50 final QIDs: **0 collisions** with the 307 existing /data QIDs; **0 internal duplicates**.

## Final QID assignments

22 fields: public-health Q189603 · pathology Q7208 · internal-medicine Q11180 · surgery Q40821 · ophthalmology Q161437 · otolaryngology Q189553 · obstetrics-and-gynecology **Q80015** · pediatrics Q123028 · dentistry Q12128 · dermatology Q171171 · psychiatry Q7867 · neurology Q83042 · pharmacology **Q128406** · pharmacy Q614304 · nursing Q121176 · radiology Q77604 · medical-physics Q1120908 · anesthesiology Q615057 · emergency-medicine Q2861470 · physical-and-rehabilitation-medicine **Q2678675** · family-medicine Q3505712 · alternative-medicine Q188504.

28 subfields: cardiology Q10379 · oncology Q162555 · gastroenterology Q120569 · endocrinology Q162606 · nephrology Q177635 · pulmonology Q203337 · hematology Q103824 · rheumatology Q327657 · infectious-diseases Q788926 · geriatrics Q10384 · orthopedic-surgery Q216685 · neurosurgery Q188449 · plastic-surgery Q182442 · cardiothoracic-surgery Q2964004 · urology Q105650 · epidemiology Q133805 · biostatistics Q214746 · environmental-health Q932068 · occupational-medicine Q628764 · health-policy-and-management Q18348859 · global-health Q2725393 · forensic-medicine Q454812 · toxicology Q7218 · nuclear-medicine Q214963 · nutrition-science Q17652193 · homeopathy Q81058 · chiropractic Q658096 · naturopathy Q213403.
