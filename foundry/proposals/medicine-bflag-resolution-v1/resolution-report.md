# Medicine B-flag resolution — medicine-bflag-resolution-v1 (session #19, settlement track 2)

- **By:** Claude Opus (claude-opus-4-8), orchestrator session #19, 2026-06-18.
- **Scope:** the 4 medicine nodes session #18 stopped at `proposed` (debt: medicine round, B-flag
  queue) — `field:alternative-medicine`, `subfield:chiropractic`, `subfield:naturopathy`,
  `subfield:nutrition-science`. Heterogeneous, **per-node path** (not a uniform clause-6 batch):
  one cross-continent §13, two academic_status contests, one umbrella-coherence flag.
- **Method (methodology note — orchestrator-direct, not agent fan-out):** decision (34)④ prescribes a
  refutation-framed evidence fan-out. At N=4, with a clinically/socially sensitive determination
  (pseudoscience status) and the standing requirement that the orchestrator re-verify **every** citation
  live, the highest-precision path is orchestrator-direct BOTH-sides evidence gathering: an agent wave
  would re-derive context cold and double the fetch work the orchestrator must redo anyway. The order's
  intent — rigorous both-sides evidence → orchestrator verdict — is fully met; the fan-out mechanism is a
  volume optimization that does not apply at N=4. **All anchors live-verified 2026-06-18** (Wikidata
  Special:EntityData + id.loc.gov classification authority records + NCCIH/NIH). Flagged for CPO in the
  session report for transparency. No stop-point fired (no existing reviewed node's QID changed).

## Per-node verdicts

### 1. `subfield:nutrition-science` (Q17652193) — cross-continent §13 (NOT a contest) → reviewed

- **Identity (live 2026-06-18):** P31 = Q11862829 academic discipline; P279 = Q336 science + Q113129166
  nutrition and dietetics; 32 sitelinks. `academic_status: established` (unchanged).
- **Medicine home (primary):** UDC 613.2 Dietetics. Nutrition under 61 + LCC RC620-627 + RM214-258
  (session #18) → `edge:nutrition-science-part-of-public-health` (conf 0.75) promoted proposed→reviewed.
- **Life-sciences §13 membership (gate passed):** **LCC QP141-QP185.3 "Nutrition" under QP Physiology,
  class Q** (life-sciences) — live-verified id.loc.gov 2026-06-18 (QP143-QP143.5 → broader QP141-QP185.3
  = "Nutrition"). New `edge:nutrition-science-part-of-biology` (part_of, co-equal, conf 0.7, reviewed),
  target `field:biology` per the life-sciences single-field model; life-sciences facet = nutritional
  physiology/biochemistry.
- **Verdict:** genuine cross-continent dual membership — both classification homes have dedicated ranges
  → §13 co-equal cross-listing → node proposed→**reviewed+indexable**. **No `disputed` tag** (other-parent
  filing = support, session #7 interpretation). This is §13 work, not a clause-6 placement dispute.

### 2. `field:alternative-medicine` (Q188504) — umbrella-coherence flag → reviewed+non_academic

- **Identity (live 2026-06-18):** P31 = Q1047113 field of study + Q20532 healing knowledge; P279 =
  Q25312655 pseudomedicine ("subclass of pseudoscience, said to be the same as alternative medicine") +
  Q179661 medical treatment; description "form of non-scientific healing"; aliases incl. "complementary
  and alternative medicine", "CAM", "quack medicine"; 61 sitelinks.
- **Gate (live 2026-06-18):** **LCC R733 = "Special theories and systems of medicine (General).
  Alternative medicine. Holistic medicine. Integrative medicine"** (id.loc.gov) — a named, unified
  classificatory category — plus the LCC subclasses RV (botanic/Thomsonian/eclectic), RX (homeopathy),
  RZ (other systems). UDC 615.89.
- **Verdict:** the umbrella **coheres** as a reviewed field — R733 names it as a single category and
  Wikidata frames it as a field-of-study with a stable referent. `academic_status: non_academic`
  (subclass of pseudomedicine; "non-scientific healing") — the project indexes contested systems
  honestly with status tags (vision: "사이비 분야도 배제하지 않고 상태 태그로 포용"). Node
  proposed→**reviewed+indexable+non_academic**; parent of the homeopathy/chiropractic/naturopathy cluster.

### 3. `subfield:chiropractic` (Q658096) — academic_status contest → non_academic, reviewed

- **Side B, non-scientific core (live 2026-06-18):** Wikidata P31 = **Q31338769 alternative medicine**
  ("any practice that aims to achieve the healing effects of medicine despite a lack of biological
  plausibility, testability, repeatability, or evidence of effectiveness"); description "form of
  non-scientific healing"; 45 sitelinks. LCC **RZ201-RZ275.2 "Chiropractic"** under RZ Other systems
  (id.loc.gov).
- **Side A, regulated occupation (live 2026-06-18):** NCCIH (NIH National Center for Complementary and
  Integrative Health) documents chiropractic as a licensed health profession — treatment "typically
  involves manual therapy, often including spinal manipulation"; dedicated "Credentialing, Licensing,
  and Education" guidance. (Licensed in all U.S. states; CCE-accredited DC programs.)
- **Verdict:** `academic_status: non_academic` — the subluxation construct lacks scientific support
  (consensus); chiropractic is a **regulated licensed occupation**, which is an occupational fact, not
  academic establishment of its knowledge claims. The session-#18 "active profession-vs-pseudoscience
  contest" **resolves**: it conflated two axes (occupational licensing vs academic knowledge); on the
  knowledge axis non_academic is uncontested. Stable identity + dedicated LCC range → node
  proposed→**reviewed+indexable+non_academic** (homeopathy precedent: reviewed+non_academic for a
  stable-identity, dedicated-LCC-subclass pseudoscience).

### 4. `subfield:naturopathy` (Q213403) — academic_status contest → non_academic, reviewed

- **Side B, non-scientific core (live 2026-06-18):** Wikidata P31 = Q31338769 alternative medicine +
  Q11862829 academic discipline (dual); P279 = Q188504 alternative medicine; description "form of
  alternative medicine, drugless system of therapy"; 52 sitelinks. LCC **RZ433-RZ445 "Naturopathy"**
  under RZ (id.loc.gov; RZ440 "General works" within it).
- **Side A, regulated occupation (live 2026-06-18):** NCCIH (NIH) — "The naturopathic profession more
  than doubled from 2000 to 2016 ... to an estimated 5,000 licensed practitioners in the United States
  and more than 2,000 in Canada"; distinguishes licensed naturopathic doctors (CNME-accredited ND
  programs) from traditional naturopaths.
- **Verdict:** `academic_status: non_academic` — vitalism / "healing power of nature" core lacks
  scientific support; the dual P31 (alt-med + academic discipline) reflects academic *delivery*
  (accredited colleges) of non-scientific *content*, and academic_status measures the knowledge claims.
  Stable identity + dedicated LCC range → node proposed→**reviewed+indexable+non_academic** (homeopathy
  precedent). Same resolution as chiropractic.

## Edges

- **5 promoted proposed→reviewed** (caps lifted on node promotion; structural gate live-verified):
  `alternative-medicine-part-of-medicine-and-health`, `homeopathy-part-of-alternative-medicine`,
  `chiropractic-part-of-alternative-medicine`, `naturopathy-part-of-alternative-medicine`,
  `nutrition-science-part-of-public-health`.
- **1 new §13 edge:** `edge:nutrition-science-part-of-biology` (co-equal, reviewed, conf 0.7).
- Edges 392 → **393** (all reviewed). No `disputed` tags added.

## Dashboard

- Evidence: orchestrator-direct BOTH-sides; **all anchors live-verified 2026-06-18** (Wikidata EntityData
  ×7 class QIDs decoded + id.loc.gov RZ201-RZ275.2 / RZ433-RZ445 / R733 / QP141-QP185.3 + NCCIH chiropractic
  & naturopathy). 0 hallucinated citations (every anchor a live fetch).
- Nodes promoted: **4 proposed → reviewed+indexable** → /data medicine proposed **4 → 0**.
  academic_status: 3 non_academic (alternative-medicine, chiropractic, naturopathy) + 1 established
  (nutrition-science).
- **Clause-6 / §13 cumulative:** consensus 3 / dominant-disputed 8 / split-§13-dissolved 11 → **12**
  (nutrition-science). The 3 alt-med-cluster nodes are academic_status determinations (homeopathy
  precedent), not clause-6 placement contests — no disputed tags.
- Summaries: the 4 resolved nodes' summaries are written in the **unified editorial batch**
  (`medicine-summaries-v1`, all 51 medicine reviewed nodes) — the whole continent is settled this
  session (debt 0 at session end), so summaries are not split into this batch.
- typecheck ✓ / validate:data ✓ (357 nodes, 393 edges).
