# QC report — cognitive-sciences-summaries-v1

**Batch:** editorial settlement, session #22 (cognitive science round 3, session B).
**Generation:** Claude Opus ×4 separate-context subagents (decision (26)/(40), ADR 0007 —
generation by subagents / QC by the orchestrator). **QC:** orchestrator (Opus).
**Policy:** editorial QC v2 (decision (34)①) — machine checks in full + close-read sample.
**Date:** 2026-06-18. All citations live-fetched this session.

## Scope

The 22 cognitive-science nodes that were `reviewed` after `cognitive-sciences-skeleton-v1`
(session #21) but carried empty summaries — 2 fields (psychology, neuroscience) + 20
subfields. The pre-existing `domain:cognitive-sciences` already carried a summary, so the
reviewed-summary invariant is restored at **23/23** for the continent.

## Machine QC (full — non-negotiable)

`npm run foundry:fetch-verify -- foundry/proposals/cognitive-sciences-summaries-v1/summaries.json`

- **claim-anchor verbatim: 52/52 pass · 0 miss · 0 unverified** (25 unique URLs, all live 200).
- **Citation-URL hallucination: 0.** **Laundering: 0.**
- First pass surfaced **2 misses, both benign normalization artifacts (not laundering)** —
  ruled by the orchestrator after direct re-fetch, then re-anchored to tool-verifiable spans:
  1. **personality-psychology** — the APA quote ("Personality refers to individual differences
     in patterns of thinking, feeling, and behaving") is genuinely verbatim on the live APA
     page, but only inside a `<meta name="description" content="…">` attribute, which
     `normalize()` strips with all HTML tags (lib/normalize-text.ts line 31). Structurally
     unverifiable by the tool → dropped the APA supplement; the summary stands on two passing
     Wikipedia anchors.
  2. **comparative-psychology** — the quoted phrase ("similarities and differences in the
     psychology and behavior of different species") is verbatim on the live page, but the REST
     JSON encodes a newline as the 2-char escape `\n` immediately before "similarities"
     ("…study of the\nsimilarities…"); normalize's TeX-command rule (`\\[a-zA-Z]+`) consumes
     `\nsimilarities`, deleting the token. Same class as the medicine-B "Wikipedia embedded
     newline" artifact. Re-anchored to the clean definitional + broad-meaning spans.
- After re-anchor: **52/52 clean** (re-run confirmed). Both edits are mechanical citation
  hygiene; no factual content changed.

## Close-read (orchestrator)

**Full 22/22** — widened from the QC v2 50% new-continent recalibration recommendation, per
the immediately preceding medicine-B precedent (session #19: new continent + first round-3
batch + careful posture → full close-read).

- **Factual errors: 0 → escalation trigger ((34): ≥1 factual error in sample/flags) NOT fired.**
- Self-flags: 0. [UNFETCHED]: 0 (subagents reported none; confirmed against the batch).
- All enumerations are citation-backed (verbatim in the cited extracts, fetch-verify confirmed) —
  no uncited ranges. No meta-sentences, no interpretive lead-ins, no excessive-clause chains
  (trim-forbidden 4, (34)①).

## Cognitive-science specific (decision (42)① — tension preservation)

- **0 living persons named.**
- **0 clinical-efficacy / prognosis / treatment-outcome claims.** clinical-, health-, forensic-,
  and neuro-psychology/neuroscience summaries are definitional/classificatory only (what the
  discipline studies, not whether interventions work) — medicine-continent precedent.
- **Tension preserved with neutral attribution** where definitional: cognitive-psychology's
  1960s break from behaviorism (historical, neutral); evolutionary-psychology's
  adaptation-vs-non-adaptive-by-product framing (quoted, both sides); affective-neuroscience's
  "the basis of emotions and what emotions are remains an issue of debate." No paradigm asserted
  as settled; no minority view erased.
- **(42)② measurement ledger:** 0 cases requiring expression beyond `disputed:true`+note —
  summaries are prose with attributed quotes, not graph edges; the competing-paradigm tensions
  named above are handled by neutral in-text attribution. No schema-extension pressure recorded.

## Result

**Cognitive-science reviewed summary 23/23 — continent editorial debt 0.** Sources: Wikipedia
REST summary API (en) for all anchors (Britannica/APA via Wayback were attempted as supplements
but bot-walled/JS-rendered with no clean server-side verbatim string, so per the no-padding rule
the Wikipedia anchor was used). 9th continent batch under the live-fetch mandate; citation
hallucination remains 0%.
