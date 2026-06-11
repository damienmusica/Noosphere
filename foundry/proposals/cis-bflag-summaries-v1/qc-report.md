# Editorial batch 5 QC report — cis-bflag-summaries-v1

- **Targets:** the 2 nodes promoted by the clause-6 B-flag resolution (PR #56):
  `subfield:scientific-computing`, `subfield:quantum-computing` — the last 2 reviewed nodes
  without summaries (restores "every reviewed node has a summary").
- **Generation:** Claude Opus (claude-opus-4-8), separate context (ADR 0007) — **first operational
  run under decision (26)** (editorial generation model upgraded Sonnet → Opus after the session-#9
  A/B). Order included the live-fetch duty, [UNFETCHED] self-marking, the anti-laundering clause,
  and the new Wayback-permanence duty (first editorial batch under the SPN standing rule).
- **QC:** Claude Fable 5 (orchestrator, session #10), 2026-06-11. Full fact-check: every cited URL
  re-fetched live by QC (7/7 HTTP 200), every supporting quote re-checked against the captured page
  — first operational use of `scripts/foundry/claim-anchor-check.ts` for the mechanical half
  (9/10 found post-normalization; the 1 miss is the corrected overreach below). Summaries verified
  consistent with the §13 dual-membership resolution records (interface framing both nodes).

## Dashboard

| Measure | Result |
|---|---|
| Citation-URL hallucination | **0% (7/7 live, both models' streak now 7 consecutive batches at 0%)** |
| Laundering (claims cited to pages that lack them) | **0 confident instances** — 1 self-flagged overreach (below), corrected |
| Opus as-drafted rate (first operational measure) | **0/2 as-drafted; 2/2 minor QC edits** (vs 11/11 as-drafted in the A/B — small sample, edits were word-level) |
| [UNFETCHED] honesty | Honest: MSC/Courant explicitly listed as not-attempted rather than cited |
| SPN permanence | All cited URLs carry verified snapshots (mix of fresh saves and existing snapshots for rate-limited/bot-blocked pages — recorded per citation below) |

## QC edits (permanent record)

1. **scientific-computing — word substitution for full anchoring.** Draft framing listed
   "algorithms, numerical methods, and high-performance computing"; Britannica's fetched
   definition lists "mathematical modeling" (not "numerical methods"). Edited to
   "algorithms, mathematical models, and high-performance computing techniques used to simulate…"
   so every list item is on the cited page. ("Numerical methods" is separately supportable via the
   MSC 65 axis in the resolution record, but the sentence anchors to Britannica.)
2. **quantum-computing — unsupported clause trimmed + QC backstop added.** Draft said quant-ph
   "covers quantum computation"; the live arXiv taxonomy page does not say this (quant-ph's
   description renders "Description coming soon" — **Opus self-flagged exactly this for QC
   scrutiny**; claim-anchor confirmed NOT-FOUND). Clause removed. Replaced with a
   classification claim QC fetched and verified live this session: MSC 2020 official CSV places
   **81P68 "Quantum computation"** under top-level **81 Quantum theory** (with the partition note
   "For algorithmic aspects, see 68Q12" — consistent with the clause-6 resolution record).
   The arXiv sentence now claims only placement (quant-ph under the "Physics" group), which QC
   verified structurally on the live page.

The self-flagged overreach is counted as 0 laundering: the claim was explicitly surfaced to QC by
the generator rather than presented as verified — the "remove rather than launder" Opus behavior
pattern from the A/B, operating as designed, with QC as the backstop.

## Citation record (all verified live by QC, 2026-06-11; snapshots per the SPN standing rule)

### subfield:scientific-computing

| Claim anchor | URL | Snapshot |
|---|---|---|
| Britannica definition (methods list) | https://www.britannica.com/science/computational-science (canonicalizes to /technology/computational-science) | https://web.archive.org/web/20260611022751/https://www.britannica.com/technology/computational-science |
| JoSC "international interdisciplinary forum…" | https://link.springer.com/journal/10915/aims-and-scope | https://web.archive.org/web/20260611023041/https://link.springer.com/journal/10915/aims-and-scope |
| SIAM SIAG/CSE "fosters collaboration… applied mathematicians, computer scientists…" + "simulation… same level as theory and experiment" | siam.org (bot-blocked) — existing snapshot used per the SPN rule | https://web.archive.org/web/20240716022321/https://www.siam.org/membership/activity-groups/detail/computational-science-and-engineering |

### subfield:quantum-computing

| Claim anchor | URL | Snapshot |
|---|---|---|
| Britannica "device that employs properties described by quantum mechanics to enhance computations" | https://www.britannica.com/technology/quantum-computer | https://web.archive.org/web/20260507072053/https://www.britannica.com/technology/quantum-computer (existing — SPN rate-limited) |
| arXiv taxonomy: quant-ph under top-level "Physics" group | https://arxiv.org/category_taxonomy | https://web.archive.org/web/20260611023133/https://arxiv.org/category_taxonomy |
| MSC 81P68 "Quantum computation" under 81 Quantum theory (QC backstop fetch) | https://msc2020.org/MSC_2020.csv | https://web.archive.org/web/20260611023933/https://msc2020.org/MSC_2020.csv |
| IQIM "a National Science Foundation Physics Frontiers Center" + program areas | https://iqim.caltech.edu/about (canonicalizes to /about-iqim/) | https://web.archive.org/web/20260611023323/https://iqim.caltech.edu/about-iqim/ |
| npj QI "global exchange of ideas between physicists, computer scientists…" | https://www.nature.com/npjqi/aims | https://web.archive.org/web/20250126065258/https://www.nature.com/npjqi/aims (existing — SPN 429) |

## Policy compliance

- Parent nodes both `reviewed` + `indexable` (PR #56) — editorial v1 parent-status condition met.
- `en` translation records existed (empty summary placeholders) with `reviewed: true` — summaries
  filled in place; no status change.
- Interface framing in both summaries matches the §13 dual-membership dispositions
  (`cis-bflag-resolution-v1/resolution-report.md`): neither is described as "a branch of computer
  science" alone.
