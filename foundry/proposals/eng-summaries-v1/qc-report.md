# QC report — eng-summaries-v1 (editorial layer, 8th batch; first scaled QC v2 run)

- **QC by:** Claude Fable 5 (claude-fable-5), orchestrator session #16, 2026-06-12.
- **Generation:** Claude Opus (claude-opus-4-8) per the ratified editorial-track model decision
  (vault decision log 2026-06-11 (26)), in **five separate contexts** (batch-a-civil 7 / batch-b-electrical 5
  / batch-c-mechanical 5 / batch-d-chemical 6 / batch-e-resources 5 — raw generated sets preserved as
  `summaries.batch-*.json`, ADR 0007 generation/QC separation upheld).
- **Scope:** the 28 reviewed-without-summary engineering-and-technology nodes carried out of the
  parallel round (13c) — debt-ledger-round1.md §1, repayment 2 of 3. All parent nodes are `reviewed`
  (editorial v1 precondition); every English translation row is marked `reviewed`.
- **Policy:** **editorial QC v2 (decision (34)) — first scaled run.** Mechanical checks 100% (full);
  orchestrator reading is a pre-registered 50% sample (first-batch calibration) + self-flag/[UNFETCHED]
  backstop full. Generation contract added the trim-forbidden 4 ((34)① meta-sentence / uncited scope /
  interpretive lead-in / excessive subordination) as explicit order clauses.

## Pre-registered reading sample (recorded BEFORE QC reading — ab-split precedent, session #9)

Method: `md5(node_id)` hex ascending, top `ceil(28 × 0.5) = 14`. Sample (14):
biotechnology, electrical-engineering, industrial-engineering, materials-science-and-engineering,
computer-engineering, geomatics, geotechnical-engineering, manufacturing-engineering, metallurgy,
nanotechnology, photonics, robotics, structural-engineering, transportation-engineering.
**Calibration: first batch at 50% → 0 factual errors in sample → Arts (#3) and LS (#4) settle to 30%.**

## Dashboard

| Metric | Value |
|---|---|
| Summaries generated / kept | 28 / 28 (0 rejections) |
| Cited-URL hallucinations (dead or wrong-entry) | **0/67 unique URLs — all HTTP 200 live — 10th consecutive 0%** |
| Verbatim quote checks (every quoted span, full) | **72/72 verified** (auto-pass 64 + 7 false-miss manually confirmed live + 1 fixed; see below) |
| Hint-laundering | **1 caught + de-laundered** (mining-engineering: SME's seven *divisions* navigation re-cast as a prose sentence — Opus too can launder, though the underlying fact held; fixed to the verbatim division list) |
| Orchestrator transcription error | **1 caught + fixed** (mining-engineering opening-definition quote was a paraphrase variant; replaced with exact REST extract) |
| node_id correction | **1** (aerospace-engineering: generation order mislabeled it `subfield:`; it is a `field:` — corrected, summary written) |
| Reading-sample factual errors | **0/14** → trigger NOT fired; 30% settles for Arts/LS |
| [UNFETCHED] self-disclosures | ~20 (all genuine — Cloudflare/403 Britannica, JS-shell society pages, LCC top-level range 403/404); every one backstopped by a fetched definition (Wikipedia REST + LCC range record + society page) |
| Opus QC substantive edits | **4 nodes** (nuclear: trimmed unsourced "~10%/439 reactors" figure to fetched-quote-backed text; chemical: trimmed uncited application list, kept unit-operations/process-design; electrical: backstopped the closing LCC-TK sentence with the live TK1-TK9971 record; mining: 2 fixes above) — all trims/backstops, **0 factual rewrites** |
| Word count in [90,160] | 28/28 |

## Mechanical-check method and the 8 first-pass auto-misses

Every cited URL was bulk-fetched live by the orchestrator (browser UA, `-L` redirect-following;
HTML-entity unescape + whitespace normalization before substring match). All **67 unique URLs
returned HTTP 200**. Of 72 quotes, 64 passed the first automated pass; the 8 misses were each
resolved:

1. **structural / geotechnical / hydraulic** (3) — Wikipedia *article HTML* split the quoted lead by
   reference markers `[1]`; re-verified verbatim against the clean Wikipedia REST `summary` extract
   for each. FOUND. (False-miss, normalization artifact.)
2. **nuclear / manufacturing** (2) — REST `extract` carries a literal newline between the two quoted
   sentences; verbatim present. FOUND. (False-miss.)
3. **textile-institute** (1) — first fetch timed out (empty body); re-fetch HTTP 200, quote present
   verbatim. FOUND. (Transient.)
4. **mining opening quote** (1) — orchestrator transcription variant; replaced with the exact REST
   extract and re-verified. FIXED.
5. **mining SME-divisions quote** (1) — genuine laundering: the generator turned SME's *Our Divisions*
   navigation ("Coal & Energy / Environmental / Health & Safety / Industrial Minerals & Aggregates /
   Mineral & Metallurgical Processing / Mining & Exploration / Underground Construction") into a prose
   sentence ("coal and energy, environmental matters, health and safety, …") that does not appear
   verbatim on the page. The underlying fact (those are SME's divisions) is true, but the quoted form
   was fabricated. **De-laundered:** the summary now names the divisions exactly as the page lists
   them, and the citation quotes the verbatim division navigation. Re-verified live. FIXED.

Net: **72/72 quotes verbatim-confirmed against live captures** after the 2 fixes.

## Referent / consistency pins (all verified held)

- **geomatics** = the spatial-data engineering discipline (umbrella over surveying, geodesy,
  photogrammetry, GIS, GNSS, hydrography); the engineering-side home of geodesy (atlas
  `edge:geodesy-part-of-civil-engineering` "via geomatics"). Not collapsed into pure geodesy/GIS.
- **computer-engineering** written as the ENGINEERING discipline (EE/computing interface), explicitly
  NOT a branch of computer science — distinct from CS and from the separate `computer-systems` gap node.
- **biotechnology** framed neutrally as an engineering/technology discipline applying biological
  systems to products (atlas home = engineering); not asserted as a branch of biology or medicine.
- **materials-science-and-engineering** covers both the science and engineering dimensions
  (processing–structure–properties–performance), kept distinct from the separate **metallurgy** node;
  metallurgy described on its own terms (extractive + physical), not nested under materials science.
- **robotics** framed as the engineering discipline (mechanical + electrical + computing), LCC home TJ
  (mechanical engineering), not subordinated to CS.
- **environmental-engineering** distinguished from environmental science (engineering solutions vs.
  studying processes). **industrial-engineering** kept discipline-level (the atlas re-targets
  operations-research toward it; IISE corroborated live).
- **nuclear-engineering** noted as LCC class TK (TK9001-TK9401 under TK1-TK9971, with electrical/
  electronics) — verified live.

## QC v2 sample-efficiency note (first scaled run)

Mechanical checks ran full (72/72 quotes, 67/67 URLs) — non-negotiable per the safety floor. Reading
ran at the calibration 50% (14/28) + self-flag/[UNFETCHED] full backstop; 0 sample factual errors.
The 2 real defects (1 laundering + 1 transcription) were both caught by the **mechanical** pass, not
the reading sample — confirming the v2 design (mechanical full-coverage is the factual-integrity
floor; reading scales). Reading load vs. a full-read pass: ~50% this batch, settling to ~30% for
Arts/LS, with the mechanical floor unchanged.
