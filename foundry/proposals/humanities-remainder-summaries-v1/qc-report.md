# QC report — humanities-remainder-summaries-v1

**Batch:** editorial settlement, session #24 (humanities-remainder round 3, session B —
**the last academic continent's editorial track**).
**Generation:** Claude Opus ×5 separate-context subagents (decision (26)/(40), ADR 0007 —
generation by subagents / QC by the orchestrator). **QC:** orchestrator (Opus).
**Policy:** editorial QC v2 (decision (34)①) — machine checks in full + close-read.
**Date:** 2026-06-18. All citations live-fetched this session.

## Scope

The 44 humanities nodes that were `reviewed` after `humanities-remainder-skeleton-v1`
(session #23, PR #106) but carried empty summaries: 6 fields (history, linguistics,
literary-studies, religious-studies, classics, archaeology) + 38 subfields. `modern-history`
(the 1 proposed node) is **not** in scope — it is the B-contest item (task 2). The
pre-existing `domain:humanities` and `field:philosophy` already carried summaries, so the
reviewed-summary invariant for the continent is restored to **full** by this batch.

Subagent split (separate contexts): history 11 · linguistics-A 9 · linguistics-B 9 ·
literary-studies+classics+archaeology 9 · religious-studies 6 = 44.

## Machine QC (full — non-negotiable)

`npm run foundry:fetch-verify -- foundry/proposals/humanities-remainder-summaries-v1/summaries.json`

- **claim-anchor verbatim: 101/101 pass · 0 miss · 0 unverified** (44 unique URLs, all live 200).
- **Citation-URL hallucination: 0. Laundering: 0.**
- **First pass was clean (100/100, 0 miss)** — no re-anchoring required. The +1 (→101) is the
  one citation the orchestrator added during close-read trims (medieval-history "medievalist").
- Anchor source: English Wikipedia REST summary API (`/api/rest_v1/page/summary/<Title>`) for
  all 44 nodes. Titles were bound to each node's **Wikidata QID sitelink** (homonym-proof) and
  the QID's English description was confirmed to be the academic discipline before quoting.

## Close-read (orchestrator) — full 44/44

Widened from the QC v2 50% new-continent recalibration recommendation to **full**, per the
medicine-B (#19) and cognitive-science-B (#22) precedents and the elevated humanities risk
(homonym density, living-person density, religious-neutrality). 

- **Factual errors: 0 → escalation trigger ((34): ≥1 factual error in sample/flags) NOT fired.**
- **5 editorial trims/citation-extensions applied (all "minor trim" class, 0 factual content changed):**
  1. **ancient-history** — extended citation 2 to cover "ending with the expansion of Islam in
     late antiquity" (verbatim in the live extract; was under-quoted). The opening disciplinary
     gloss ("branch of historical study concerned with the period") is the curator's neutral
     era-vs-discipline framing for a subfield whose source frames the *period*, not the study —
     accepted per session #23 §12 era-vs-discipline precedent; all period facts verbatim-cited.
  2. **social-history** — the thin two-sentence extract does not contain "ordinary people rather
     than elites"; trimmed that uncited gloss (no-padding rule) and replaced the duplicated
     citation with the source's second sentence ("Historians who write social history are called
     social historians"). Summary now fully verbatim-anchored.
  3. **theology** — removed the meta-phrase "as defined by the source," (trim-forbidden #1). All
     content is verbatim-supported; neutrality preserved (see below).
  4. **historiography** — extended citation 2 + aligned summary wording to the source ("theoretical
     approaches to the interpretation of documentary sources").
  5. **medieval-history** — added a third citation for "medievalist" (verbatim in the Medieval
     studies extract).
- After trims: **fetch-verify re-run 101/101 pass · 0 miss · 0 unverified.**
- No meta-sentences (theology fixed), no uncited ranges (ancient/social fixed), no interpretive
  lead-ins, no excessive-clause chains (trim-forbidden 4, (34)①).

## Title-binding judgment calls (QID has no/odd enwiki sitelink — orchestrator-reviewed)

These do **not** change any /data node QID (the audited skeleton QIDs stand). They concern only
which live Wikipedia article was used as the citation anchor:

- **field:history (Q1066186)** — Q1066186 ("study of history") has no enwiki sitelink; the enwiki
  "History" article maps to Q309 ("study of the past"). The "History" extract explicitly frames
  History as "the systematic study of the past" and "an academic discipline" and itself separates
  the discipline from the past, so it anchors the *discipline* the node represents. /data QID stays
  Q1066186 (session #23 audit: Q1066186 over Q309).
- **medieval-history (Q27992545)** — no enwiki sitelink; era boundary anchored on "Middle Ages"
  (Q12554, the era), discipline framing on "Medieval studies" (Q119190, distinct entity). /data QID
  stays Q27992545.
- **field:literary-studies (Q208217)** — Q208217's enwiki sitelink "Literary science" redirects
  oddly to Comparative literature; the enwiki concept for literary studies lives in the "Literary
  criticism" article, whose extract states "literary criticism or literary studies is the study,
  evaluation, and interpretation of literature." Anchored there. Consequence: field:literary-studies
  and subfield:literary-criticism share this source article (enwiki conflates the concepts) — the
  two summaries are nonetheless distinctly framed (field = literary studies/criticism as the study;
  subfield = a genre of arts criticism). /data QID stays Q208217.

## Humanities-specific (decision (42)① — tension preservation; invariants)

- **0 living persons named.** Only long-dead figures appear, and only where verbatim-cited
  (Aristotle implied via narratology's "Russian formalists" quote; no living scholars' claims).
- **Religious neutrality (highest-risk group, 6 nodes) — held.** Every religious-studies/theology
  node is framed as the **academic study** of its object: religious-studies "from a historical or
  scientific perspective… rather than from within any faith tradition"; biblical-studies "historical
  and analytical methods rather than devotional ones"; comparative-religion "the branch of religious
  studies that systematically compares"; theology/systematic/practical-theology as academic
  disciplines (no creed asserted as true, no apologetics). Tradition-specific scope (systematic
  theology "of Christian theology") attributed neutrally exactly as the source states. Object-vs-
  discipline distinction preserved throughout.
- **Tension preserved with neutral attribution** where the disciplines contain competing schools:
  literary-theory ("umbrella term for… scholarly approaches"), literary-criticism (general activity,
  no school privileged), historiography ("remains a debated question"), cognitive-linguistics (the
  innateness debate quoted as "challenges generative grammar's hypothesis", neither school endorsed),
  history's own social-science-vs-humanities classification (both sides quoted), archaeology ("both a
  social science and a branch of the humanities"). No paradigm asserted as settled; no minority view erased.
- **Discipline-vs-object/era** kept throughout: ancient/medieval history = the *study* of those
  periods (era-vs-discipline gloss); biblical-studies = the academic study of the Bible, not theology;
  poetics = the general field, not Aristotle's treatise (homonym confirmed via QID).
- **(42)② measurement ledger:** **0 cases** requiring expression beyond `disputed:true`+note.
  All tensions above are handled by neutral in-text attribution in prose (these summaries add no
  graph edges). No schema-extension pressure recorded this batch. (Proposition-edge codification
  remains deferred — this batch is summaries only, no critiques/influenced edges generated.)

## Result

**Humanities reviewed summary 44/44 applied to /data — continent editorial debt 0.** Source:
Wikipedia REST summary API (en) for all 44 anchors (Britannica/SEP attempted as supplements on a
few thin extracts but bot-walled/403 with no clean server-side verbatim string → per the no-padding
rule the Wikipedia anchor was used; NamuWiki not touched, external-link-only constraint honored).
11th and final academic-continent editorial batch under the live-fetch mandate; **citation
hallucination remains 0%** (the unbroken streak holds).

## SPN §8 (evidence permanence — best-effort, non-blocking)

44 unique citation URLs. **Existing-snapshot-first: 34/44 already on Wayback** (`web.archive.org/web/<ts>/…`).
The 10 missing were submitted to anonymous Save Page Now (best-effort, non-blocking) — 9 returned the
measured **520 anonymous-throttle** and 1 (Biblical_studies) a 200 not yet confirmed in the availability
API (SPN is async). Per §8 these are recorded honestly as **[SPN-FAILED]** in `spn-record.json` (retry
queue), never silently dropped. Durability is not at risk: the endpoints are Wikimedia-stable REST URLs
and every verbatim claim-anchor is recorded in `summaries.json`. Snapshot map + failed list: `spn-record.json`.
