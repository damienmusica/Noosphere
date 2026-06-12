# QC report — arts-summaries-v1 + life-summaries-v1 (editorial 9th batch; QC v2 at settled 30%)

> One report covers both repayment-3 batches (Arts 23 + Life 17 = 40), run together in session #16
> after the ENG batch (eng-summaries-v1) calibrated QC v2 at 50% with 0 sample factual errors.

- **QC by:** Claude Fable 5 (claude-fable-5), orchestrator session #16, 2026-06-12.
- **Generation:** Claude Opus (claude-opus-4-8) per decision (26), in **6 separate contexts**
  (Arts: batch-a-music 5 / batch-b-visual 8 / batch-c-design 4 / batch-d-perform-arch 6;
  Life: batch-a-organism 9 / batch-b-molecular 8). ADR 0007 generation/QC separation upheld.
- **Scope:** the 23 arts-and-design (round 13d) + 17 life-sciences (round 13b single-field model)
  reviewed-without-summary nodes — debt-ledger-round1.md §1, repayment 3 of 3 (closes §1: 40→0).
- **Policy:** editorial QC v2 (decision (34)) — mechanical checks 100%; reading at the **settled 30%**
  sample (ENG already calibrated the 50%→30% step with 0 sample errors) + self-flag/[UNFETCHED]
  backstop full.

## Pre-registered reading samples (recorded BEFORE QC reading — ab-split precedent)

Method: `md5(node_id)` hex ascending, top `ceil(N × 0.30)`.
- **Arts (7/23):** music, performing-arts, art-history, ceramic-arts, ethnomusicology, graphic-design, theatre-studies.
- **Life (6/17):** bioinformatics, cell-biology, microbiology, parasitology, virology, zoology.
- **Sample factual errors: 0/13 → trigger NOT fired.**

## Dashboard (both batches)

| Metric | Value |
|---|---|
| Summaries generated / kept | 40 / 40 (0 rejections) |
| Cited-URL hallucinations (dead or wrong-entry) | **0/83 unique URLs — all HTTP 200 live — 11th consecutive 0%** |
| Verbatim quote checks (every quoted span, full) | **87/87 verified** (auto-pass 85 + 2 false-miss confirmed live; 3 defects fixed first) |
| Hint-laundering / misattribution | **3 caught + fixed** (see below) — all by the mechanical pass, none in the reading sample |
| Reading-sample factual errors | **0/13** → trigger NOT fired |
| [UNFETCHED] self-disclosures | ~12 (AIGA/IDSA/ESM/ASM/ESA blocks, unresolvable LCC ranges) — all backstopped by fetched Wikipedia REST + LCC captions |
| Opus QC substantive edits | **3 nodes** (interior-design, drawing, immunology — see below); plus minor trims (music-education membership figure, nuclear-style) |
| Word count in [90,160] | 39/40 (microbiology 84w — soft band; factually complete after an ASM-claim trim, kept as-is rather than padding with an uncited scope sentence) |

## The 3 mechanical-pass defects (all fixed; none factual content errors)

1. **subfield:interior-design** — the generator's Wikipedia quote spliced two *non-contiguous*
   sentences ("…using the space. Interior design is a multifaceted profession…"), skipping the
   intervening "With a keen eye for detail…" sentence — so the quoted string does not appear
   verbatim on the page (a laundering pattern). **Fixed:** split into two separate verbatim
   citations, each present on the page. Summary text (paraphrase "It is a multifaceted profession")
   unchanged and accurate.
2. **subfield:drawing** — the LCC NC1 quote was a reformatted notation ("NC1-NC1940 (Drawing.
   Design. Illustration)") not present verbatim. **Fixed** to the exact NC1 caption "Fine
   Arts--Drawing. Design. Illustration--Periodicals and societies".
3. **subfield:immunology** — the generator attributed to aai.org/About the phrase "one of the
   world's largest organizations of immunologists…" — which appears **neither** on aai.org **nor**
   in the Wikipedia AAI article (which calls AAI the world's *oldest* continuously operating
   immunology society). This was a misattribution **and** a factual inaccuracy (oldest ≠ largest).
   **Fixed:** citation re-pointed to the Wikipedia AAI REST summary with its verbatim characterization
   ("the world's oldest continuously operating professional society specifically dedicated to the
   field of immunology"); summary text corrected from "largest" to "oldest". This is the one defect
   that touched factual content — caught by the mechanical pass (it was outside the reading sample),
   confirming the v2 floor: mechanical full-coverage catches factual-integrity issues the sampled
   read would miss.

Both remaining auto-misses were false-misses confirmed verbatim live: **printmaking** (the REST
extract inserts a space before the semicolon, "machine ; however") and **developmental-biology**
(sdbonline.org HTML, found on manual unescape). Net: **87/87 quotes verbatim-confirmed.**

## Referent / consistency pins (verified held)

- **drawing** = fine-art drawing (Q2921001), not technical/engineering drawing.
- **decorative-arts** "Applied Arts" alias confirmed verbatim in the LCC NK caption.
- **ceramic-arts** granularity nuance (practice/medium level, session #15 audit) recorded.
- **architecture** homed in arts-and-design (LCC NA), engineering §13 dual membership noted (PR #93
  domain-direct ruling) — not re-homed.
- **bioinformatics** homed in life sciences (CS-side §13 parked), framed neutrally.
- **mycology** kept as a peer subfield with a dedicated community. **biology** single-field model
  (domain:life-sciences → field:biology → subfields) reflected.
- AMS grounded on its Wikipedia REST summary after musicology.org resolved to the IMS (referent
  mismatch, not quoted) — honest substitution, no laundering.

## QC v2 cumulative note (sessions #16, batches ENG+Arts+Life)

Across the three repayment batches (68 nodes), the mechanical pass caught **4 defects** (1 ENG
mining laundering, interior-design splice, drawing notation, immunology misattribution) — every one
by the verbatim/URL checks, **none** surfaced by the reading samples; reading-sample factual errors
stayed **0** throughout. This is the v2 thesis in practice: the mechanical floor (100% verbatim +
URL-live) is what guarantees factual integrity, so the read can scale to 30% without risk. Reading
load vs. a full read: ~30% on Arts/Life after the 50% ENG calibration.
