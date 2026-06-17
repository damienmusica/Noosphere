# QC report — medicine-summaries-v1 (editorial, session #19, settlement track 1)

> Editorial QC v2 (decision (34)) — first medicine editorial batch. Generation = **Opus ×6
> separate-context subagents** (decision (26)/(40), ADR 0007); QC = Opus orchestrator (this
> context). 53 summaries = 49 session-#18 skeleton reviewed medicine nodes + 3 §13 cross-listed
> (physiology, anatomy, biomedical-engineering) + the 4 nodes promoted in `medicine-bflag-resolution-v1`
> (alternative-medicine, chiropractic, naturopathy, nutrition-science). Session #19, 2026-06-18.

## Outcome

- **53 summaries written** → /data medicine reviewed summary coverage **51/51** (+ the 3 §13 nodes' home
  domains) → **editorial debt 0** (continent settlement).
- **Machine checks (full, decision (34)):** `npm run foundry:fetch-verify` (peer-tool, PR #100) —
  **claim-anchor verbatim PASS 90/90 · MISS 0 · UNVERIFIED 0** after correction; cited-URL live survival
  90/90. **Citation hallucination 0%** (continues the post-protocol streak). **Laundering 0.**
- **Close-read: ALL 53** (exceeds the v2 50% recalibration mandate for the first medicine batch —
  session #15 "전수 > 표본" precedent). Plus all 17 self-flags + 0 unfetched. **Factual errors 0 →
  escalation trigger NOT fired.** (This is the last medicine editorial batch, so no 30% settle follows.)

## Calibration note (50% → full)

Per the launch posture (CPO "신중", first run under Opus orchestrator, clinical-domain sensitivity), the
mandated 50% recalibration sample was widened to a **full 53/53 close-read**. 0 factual errors confirms
the v2 premise (Opus factual errors rare); had this been a continuing continent, 30% would settle next.

## Machine-miss adjudication (14 initial misses → 0 laundering, all benign)

The first fetch-verify pass returned MISS 14/86. Every one adjudicated against the live page — **0
fabrications**:

- **8 MeSH second-anchors (group D):** quotes were real MeSH scope notes but cited to the *descriptor*
  record `id.nlm.nih.gov/mesh/D*.json`, which carries no scopeNote (it lives on the *preferred-concept*
  `M*` record). **Re-pointed all 8 to the concept URL** (e.g. psychiatry D011570 → M0017987), where the
  scope note is verbatim. Operational finding recorded: MeSH `D*.json` ≠ scopeNote source; use `M*.json`.
- **6 Wikipedia quotes:** real extract text that missed normalization due to **embedded quote characters**
  (`"…"` inside the span) or a `\n` boundary, and one single-vs-double-quote transcription (global-health
  used `'…'` where the page has `"…"`). Re-anchored each to a clean verbatim substring (inner span, no
  embedded quotes). Matches the prior-session "auto-pass miss → verbatim confirmed, 0 fabrication" pattern.

## Close-read corrections (claim-coverage; no factual errors, only trims/anchors)

A systematic claim-coverage pass (every summary's content against its cited sources) caught uncited
clauses the agents had added as background — **trimmed to keep prose claims source-anchored** (the atlas
graph still encodes the relationships via verified `part_of` edges, so no atlas information is lost):

- **5 unanchored "subspecialty of internal medicine" clauses trimmed** (oncology, endocrinology,
  pulmonology, rheumatology, infectious-diseases) — true and graph-encoded (each `part_of`
  field:internal-medicine), but **not verbatim in the cited extract**; kept only where the source states
  it (cardiology "sub-specialty of internal medicine", nephrology — both verbatim-anchored).
- **4 interpretive-framing / uncited sentences trimmed:** epidemiology ("central to public health"),
  occupational-medicine ("sits at the intersection…"), health-policy-and-management ("rather than the
  direct delivery…"), forensic-medicine (2nd sentence — uncited detail + "sexual assault" paraphrased
  the source's "rape").
- **infectious-diseases:** dropped the unsourced tail ("identify the causes… select appropriate
  antimicrobial therapy") and the unsourced 3rd sentence (20th-century emergence, vaccines) — verified
  absent from the cited quotes AND the Wikipedia extract.
- **2 NCCIH backstops added** (verbatim): chiropractic "The purpose of the manipulations is to improve
  joint motion and function." + naturopathy "…to an estimated 5,000 licensed practitioners in the United
  States…" — true facts the agent paraphrased; now machine-anchored.
- **3 definition anchors added** (public-health, global-health) where the MISS-fix had narrowed the
  primary quote off the definition.

## Medicine-specific compliance (decision (34) / order task 1 ②)

- **Living persons: 0** — discipline nodes only.
- **Clinical conservatism:** classification/definition facts only; **no treatment-efficacy or prognosis
  assertions**. Sources: Wikipedia REST extracts (QID-sitelink-resolved referents), MeSH concept scope
  notes (NIH/NLM), NCCIH (NIH), Wikidata descriptions, id.loc.gov.
- **4 non_academic nodes (alternative-medicine, homeopathy, chiropractic, naturopathy):** scrupulously
  neutral and **fully attributed** — non-scientific/pseudoscience status stated per Wikipedia/Wikidata +
  NCCIH; regulated-occupation facts (licensed profession; ~5,000 US naturopaths) per NCCIH; **no
  endorsement, no editorial debunking**. Conservative connectors ("intended to improve joint motion",
  "by definition lack… evidence of effectiveness").

## Dashboard

- Generation: Opus ×6 (groups A–F, 8–9 nodes each), separate contexts. Self-flags 17 (all honest;
  resolved in close-read). Unfetched 0.
- Machine: 90/90 verbatim · 0 hallucination · 0 laundering. Close-read 53/53 · 0 factual errors.
- Modifications: all minor (trims + anchor re-points) — **0 factual rewrites** (Opus pattern: remove
  unverifiable rather than assert). Trigger not fired.
- typecheck ✓ / validate:data ✓ — medicine reviewed summary 51/51, editorial debt 0.
