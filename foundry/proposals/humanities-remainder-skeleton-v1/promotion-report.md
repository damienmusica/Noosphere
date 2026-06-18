# Promotion report — humanities-remainder skeleton v1 (session #23)

Standing promotion policy v1 (decision (7)): structural tier auto-promotes on resolver-verified external
grounding; QC-ambiguous stops at `proposed`; no verified grounding stays in foundry.

## Promoted to /data

- **44 reviewed + indexable** (QID multi-signal P31-verified + gate-anchored): 6 fields
  (history, linguistics, literary-studies, religious-studies, classics, archaeology) + 38 subfields.
- **1 proposed** (not indexable): `subfield:modern-history` — QID-less honest gap (Wikidata models
  "modern history" only as the era "modern period" Q3281534; no discipline entity). Gate-anchored
  (LCC D204-475). Stays proposed until an upstream discipline entity matures.

## /data deltas

- Nodes **382 → 427** (+45): reviewed 367 → 411, proposed 15 → 16, indexable 367 → 411.
- Edges **420 → 469** (+49): 45 part_of skeleton (44 reviewed + 1 proposed-capped modern-history) +
  4 §13 cross-listing (psycholinguistics→psychology, cognitive-linguistics→cognitive-psychology,
  neurolinguistics→neuroscience [conf 0.85], economic-history→history).
- Sources 15 (no new — evidence on existing lcc-outline/udc-summary/wikidata/oecd-ford).
- Translations **382 → 427** (+45 en rows; summaries deferred to editorial session #24-B; 44 reviewed=true
  labels + 1 reviewed=false [modern-history]; alias sets: History of Ideas, Global History, Palaeography,
  Diachronic Linguistics, Semiology, Morphology (Linguistics), History of Religions, Dogmatic Theology,
  Pastoral Theology, Classical Studies, Study of Religion, Literary Science).
- Goldenset 388 → **433** (+45 entries: 44 verified QIDs + 1 upstream_gap [modern-history]; regression 0 — all net-new).

## `domain:humanities` now

Children **64 → 109**: field:philosophy (62 subfields) + **6 new fields** (history 11 subfields,
linguistics 17, literary-studies 6, religious-studies 5, classics 0, archaeology 0) + the 1 proposed
modern-history. Humanities continent skeleton complete (philosophy + history + linguistics + literary
studies + religious studies + classics + archaeology).

## Carried (settlement session #24-B)

- editorial v2: 44 new reviewed nodes need summaries (Opus separate-context, QC v2).
- B-flag: 1 proposed (modern-history) — upstream-maturity watch, no forced promotion.
- B-track: 44 new reviewed nodes × OpenAlex prevalidate.
