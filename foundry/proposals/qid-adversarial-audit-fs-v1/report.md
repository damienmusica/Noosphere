# Adversarial QID audit — qid-adversarial-audit-fs-v1

- **Adjudication:** Claude Fable 5 (orchestrator session #10), 2026-06-11.
- **Refutation agents:** 44 × Claude Sonnet (claude-sonnet-4-6), one per QID, separate contexts
  (multi-agent fan-out via a deterministic workflow harness; the explicitly pre-authorized workflow
  use of this session). Per ADR 0007 discipline the agents only *collected* refutation evidence;
  every verdict below is the orchestrator's.
- **Scope:** all 44 verified QIDs of the formal-sciences skeleton batch (the golden-set
  `batch:formal-sciences-skeleton-v1` verified entries). Second execution of the decision-log (3)
  bulk re-audit principle (first: `qid-adversarial-audit-cis-v1`, 24 QIDs). Philosophy (61) remains
  the session-#11 audit candidate.
- **Method:** identical to the CS audit — per-item adversarial order ("find live evidence that this
  QID denotes a different entity"), live `Special:EntityData` fetch (labels, descriptions, English
  aliases, P31, sitelink counts, enwiki title), at most one cross-search, training-knowledge claims
  banned, refutation requires a *different referent* (granularity/topic-anchor quibbles excluded).

## Headline result

| Measure | Result |
|---|---|
| Audited | 44/44 (fetch failures 0) |
| Agent-level refutations | **0/44** (all verdicts high confidence) |
| **Adjudicated residual referent errors** | **0/44 confirmed** |
| Orchestrator-added watch item | 1 (differential-equations — below) |

**Cumulative residual-error sample across audits: 0 confirmed / 68 audited** (24 CS + 44 FS).
Recorded watch items now 2: computer-networks (Q10336440 alternative, CS audit) +
differential-equations (below).

## Adjudication notes (anti-rubber-stamp review)

A 0/44 high-confidence sweep was itself scrutinized: the six structurally riskiest anchors
(differential-equations, time-series-analysis, bayesian-statistics, systems-science,
control-theory, applied-statistics) were re-read at the evidence level. The agents did genuine
adversarial work — live P31 observations, competitor entities identified by QID (e.g. the
"Calculus" arachnid genus Q18092768, the "Mathematical Logic" book Q54022052 observed live as
P31=book/0 sitelinks, the sociology "control theory" Q5165890 correctly distinguished), and the
sole plausible alternative per item explicitly run down. The mathematics continent is simply
well-anchored upstream: 42/44 anchors carry exact-name enwiki sitelinks and discipline-kind P31s —
a cleaner profile than CS, where object-anchors are the norm (1 agent refutation in 24 there).

## Watch item (orchestrator-added, not an agent refutation)

**subfield:differential-equations → Q28575007 ("theory of differential equations").** Live
profile: **0 sitelinks, no enwiki article, 1 English alias** ("differential equations"),
P31 = Q1936384 branch of mathematics. The referent is correct — the entity denotes the
mathematical area, so this is *not* a residual error — but the anchor is thin:

1. Under the resolver-v4 orphan-stub rule it would NOT auto-reject (the rule requires 0 sitelinks
   AND 0 aliases; the alias saves it) — recorded as a deliberate nuance check of the new rule.
2. Second-provider triangulation diverges: OpenAlex's "Differential equation" concept links
   **Q11214** (the equation object, 117 sitelinks, enwiki "Differential equation"), not Q28575007
   (recorded at the PR #46 manual-case verdict). The CS-continent topic-anchor norm
   (computer-networks precedent: anchor at the object entity whose enwiki article is the field's
   main article) would prefer Q11214 here.
3. **Re-anchor candidate:** if a future pit-stop normalizes anchor policy across continents, Q11214
   is the alternative; until then the recorded granularity-variant judgment (PR #46) stands.

## What this measures — and what it does not

Residual wrong-referent rate of the FS batch's accepted QIDs: **0/44 confirmed** (upper bound
counting the thin-anchor watch item: 2.3%). Not measured: coverage gaps (QID-less seeds were out
of scope), anchor-policy consistency across continents (the watch item is the start of that
dataset), the philosophy batch (61 QIDs, next audit candidate).

## Per-item verdict summary

All 44 survived / high. Full per-item structured verdicts (observed label, description, enwiki,
P31, sitelink count, aliases, refutation case text) are preserved in the session record; the
load-bearing observations for the six riskiest anchors are quoted above. Notable confirmations:
mathematical-logic Q1166618 (competitor "Mathematical Logic" book observed live as wrong kind),
optimization Q141495 (field-of-study typing confirmed; the OpenAlex duplicate-link quirk is a
provider-endpoint defect, not a Wikidata identity issue), control-theory Q6501221 (sociology
homonym Q5165890 explicitly distinguished), cybernetics Q123637 and systems-science Q2167061
(both discipline-typed with exact-name enwiki articles, consistent with the clause-6 vitality
resolution).
