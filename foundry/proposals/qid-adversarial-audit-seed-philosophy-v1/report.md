# Adversarial QID audit — qid-adversarial-audit-seed-philosophy-v1

- **Adjudication:** Claude Fable 5 (orchestrator session #11), 2026-06-11.
- **Refutation agents:** 74 × Claude Sonnet (claude-sonnet-4-6), one per QID, separate contexts
  (multi-agent fan-out via a deterministic workflow harness; the explicitly pre-authorized workflow
  use of this session). Per ADR 0007 discipline the agents only *collected* refutation evidence;
  every verdict below is the orchestrator's.
- **Scope:** the two remaining unaudited QID populations — (a) **seed-era category, 13 QIDs**
  (every `/data` QID-bearing node absent from all batch golden sets: the 10 domain nodes +
  field:computer-science + field:physics + concept:vector-space; the category named by the
  bayesian-inference erratum, `ml-foundations-v1/promotion-report.md`), and (b) **philosophy
  batch, 61 verified QIDs** (third skeleton-batch audit, after CS 24 and FS 44).
- **Method:** identical to the CS/FS audits — per-item adversarial order ("find live evidence that
  this QID denotes a different entity"), live `Special:EntityData` fetch (labels, descriptions,
  English aliases, P31, sitelink counts, enwiki title), at most one cross-search,
  training-knowledge claims banned, refutation requires a *different referent* (granularity /
  topic-anchor variants excluded).

## Headline result

| Measure | Result |
|---|---|
| Audited | 74/74 (fetch failures 0) |
| Agent-level refutations | 3 (all high confidence) |
| **Adjudicated confirmed residual referent errors** | **2** — both seed-era; **philosophy 0/61** |
| Corrections applied (this PR) | 2 (decision-log (9) multi-signal path, below) |

**Cumulative residual-error sample across audits: 2 confirmed / 142 audited (1.4%)** —
CS 0/24 + FS 0/44 + philosophy 0/61 + seed-era 2/13. Split by provenance, the signal is stark:
**resolver-/QC-verified pipeline output 0/129; human-curated seed-era QIDs 2/13 (15.4%)** —
three errors counting bayesian-inference (caught by the golden set, same seed-era category).
Every confirmed residual error to date lived in the unmeasured seed-era category; the
batch-pipeline corpus remains clean. "Unmeasured ≠ sound" is now thrice-confirmed.

## Confirmed errors and corrections (decision-log (9) multi-signal verification, live 2026-06-11)

### 1. domain:life-sciences — Q864 = "Pokémon" → corrected to Q864928

Q864 observed live: label "Pokémon", description "Japanese media franchise", P31 Q196600
(media franchise), 126 sitelinks, enwiki "Pokémon". An unambiguous wrong referent (the
bayesian-alkane pattern: seed-era human-curated value, never resolver-verified, invisible to the
skeleton-batch audit scopes). **Correction → Q864928**: exact label "life sciences", description
"branch of science about life", aliases incl. "bioscience"/"life science"/"biological science
disciplines", P31 incl. Q11862829 (academic discipline) + Q2465832, 45 sitelinks, enwiki "List of
life sciences". Orchestrator re-verified directly (not agent-trusted). Evidence permanence:
<https://web.archive.org/web/20260611051349/https://www.wikidata.org/wiki/Special:EntityData/Q864928.json>

### 2. domain:arts-and-design — Q735 = "art" (general concept) → corrected to Q2018526

Q735 observed live: label "art", description "general concept that creates expressive work for
its beauty or emotional power **(use Q838948 for the resulting work, use Q2018526 for the group
of creative disciplines)**". The node is a top-level academic *domain* (a grouping of
disciplines); the upstream entity's own description assigns that meaning to a different entity —
unlike the differential-equations watch item, where both anchors were defensible readings of one
subject, here upstream itself splits the senses and tells us ours is the wrong one. Adjudicated a
wrong-kind referent, not an anchor variant. **Correction → Q2018526**: label "arts", description
"group of creative disciplines…", aliases incl. "the arts"/"fine arts", P31 incl. Q11862829
(academic discipline), 62 sitelinks, enwiki "The arts". Orchestrator re-verified directly. The
compound "…and Design" remains broader than the entity (recorded honestly; same compound-domain
pattern as engineering-and-technology below). Evidence permanence:
<https://web.archive.org/web/20260611051412/https://www.wikidata.org/wiki/Special:EntityData/Q2018526.json>

## Agent refutation rejected at adjudication (1)

**subfield:modern-philosophy Q860746** (node label "Early Modern Philosophy"; QID labeled
"modern philosophy", scoped 17th–20th centuries; agent proposed Q16966481 "early modern
philosophy"). Rejected as a *new* error: this is the **already-recorded era-scope contest** that
has kept the node parked at `proposed` since session #2 (resolution-report: "period scope
conflicts across sources — revisit at era-axis design"); the QID was chosen by the PR #24
manual sitelink path with that contest open. The proposed alternative is a thin anchor
(7 sitelinks, no P31, no enwiki-confirming profile beyond the title) that would fail our own
anchor-quality bar (differential-equations pattern). Disposition: node stays `proposed`/parked;
**Q16966481 recorded as a re-anchor candidate for the era-axis design review**, not applied.

## Medium-confidence survives adjudicated as survive (2)

- **domain:engineering-and-technology Q11023** — anchor is the "engineering" discipline entity;
  no Wikidata entity for the compound OECD-style domain label exists (agent's cross-search:
  only a magazine and an empty stub). Compound-domain topic-anchor variant, not a wrong referent.
  Recorded as the naming pattern shared by arts-and-design (above) and medicine-and-health.
- **subfield:critical-theory Q301751** — primary label "critical sociology" with alias "critical
  theory" and enwiki "Critical theory": exactly the PR #24 adjudication (sitelink+alias over
  English label), reconfirmed live. Survive.

## Anti-rubber-stamp review

The 69 high-confidence survives were scanned at the observed-evidence level (label / enwiki /
sitelinks per item), and the structurally riskiest anchors re-read in full: the four thin-anchor
philosophy nodes (comparative-philosophy 3 sitelinks no enwiki, latin-american-philosophy 6 no
enwiki, philosophy-of-psychiatry 5, esotericism-and-theosophy 4 — all exact-label matches on the
intended referent; thinness is a known v1.2-path property, not a referent doubt), the Q21198
double-anchor (domain:computer-and-information-sciences and field:computer-science share the
"computer science" entity — known recorded anchor-policy nuance from the session-#9 OpenAlex
identity-conflict finding, not a referent error), and philosophy-of-action → "action theory"
(recorded anchor judgment, enwiki "Action theory (philosophy)"). Agents did genuine adversarial
work (e.g. the life-sciences agent located and profiled the correct competitor entity unprompted).

## What this measures — and what it does not

Residual wrong-referent rate of (a) the seed-era QID population — **2/13 confirmed errors,
corrected**, category now closed (all 13 appended to the golden set as seed-era entries, the
2 corrections included) — and (b) the philosophy batch — **0/61 confirmed** (upper bound 1.6%).
Not measured: anchor-policy consistency across continents (Q21198 double-anchor and the
compound-domain pattern are now recorded data points for the anchor-policy pit-stop),
upstream-gap nodes (no QID to audit), the era-scope question on modern-philosophy (a modeling
question, not a referent one).

## Watch items (cumulative ledger after this audit)

1. computer-networks Q1301371 (CS audit) — Q10336440 maturation watch.
2. differential-equations Q28575007 (FS audit) — thin anchor, Q11214 re-anchor candidate.
3. **modern-philosophy Q860746 (this audit) — era-scope contest; Q16966481 re-anchor candidate
   at era-axis design review.**
4. **Q21198 double-anchor (domain CIS + field CS) — anchor-policy pit-stop input (recorded
   session #9, reconfirmed here).**

## Per-item verdict summary

All 74 collected (0 dropped, 0 fetch failures): 69 survive/high + 2 survive/medium (adjudicated
survive, above) + 3 refute/high (adjudicated: 2 confirmed + corrected, 1 rejected as the recorded
modern-philosophy contest). Full structured verdicts (observed label, description, enwiki, P31,
sitelink count, aliases, refutation case text per item) are preserved in the session record;
load-bearing observations for every non-routine item are quoted above.
