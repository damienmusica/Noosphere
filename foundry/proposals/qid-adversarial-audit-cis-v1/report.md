# Adversarial QID audit — qid-adversarial-audit-cis-v1

- **Adjudication:** Claude Fable 5 (orchestrator session #9), 2026-06-11.
- **Refutation agents:** 24 × Claude Sonnet (claude-sonnet-4-6), one per QID, each in a separate
  context (multi-agent fan-out). Per ADR 0007 discipline, the agents only *collected* refutation
  evidence; every verdict below is the orchestrator's.
- **Scope:** all 24 verified QIDs of the CIS skeleton batch (22 reviewed + 2 B-flag proposed:
  scientific-computing Q117801, quantum-computing Q17995793). This is the **first execution of the
  decision-log (3) bulk re-audit principle**, and the first measurement that is *independent of the
  resolver↔QC pipeline that produced the verdicts* — the agents were ordered to **break** each
  mapping, not confirm it.
- **Method:** per-item adversarial order — "find live evidence that this QID denotes a different
  entity than this node's field." Live `Special:EntityData` fetch; labels, descriptions, English
  aliases, P31, sitelinks (enwiki title) observed and recorded; one cross-search permitted.
  Refutation success requires a *different referent*, not a granularity/topic-anchor quibble.
  Training-knowledge claims were banned as evidence.

## Dashboard label correction (ordered this session)

What previous reports called "rank-1 일치율 / rank-1 acceptance" (e.g. 20/24, 83% for this batch) is
properly **"리졸버-QC 일치율" (resolver–QC agreement)**: it measures how often the QC orchestrator
accepted the resolver's first-ranked candidate — both sides of that agreement live in the same
session and share failure modes. **The residual error rate of accepted QIDs was previously
unmeasured. This audit is its first estimate.**

## Headline result

| Measure | Result |
|---|---|
| Audited | 24/24 (no non-responses) |
| Agent-level refutations | 1/24 |
| **Adjudicated referent errors (residual error estimate)** | **0/24 confirmed** |
| Contested anchor recorded as watch item | 1/24 (computer-networks) — upper bound 4.2% |
| Post-adjudication survival | 24/24 |

## The one refutation, and why it was overturned at adjudication

**subfield:computer-networks → Q1301371** ("computer network"). The agent's case (high confidence,
genuinely well-evidenced): Q1301371 is the *technology object* (enwiki "Computer network", no P31,
P2579 *studied by* → Q10336440), while **Q10336440 "computer networking"** carries P31 = academic
discipline + branch of computer science, P279 = computer science — i.e. a dedicated discipline
entity exists upstream.

Orchestrator adjudication — **refutation rejected, mapping survives**, on three grounds, each
live-verified this session:

1. **The alternative fails the decision-log (9) multi-signal bar.** Q10336440 observed live:
   **0 English aliases, 1 sitelink (bnwiki only), no enwiki article**. This is the same
   near-orphan-stub profile that caused QC to *reject* Q105981125 for computer-systems in this very
   batch (grounding-report precedent: a no-enwiki, no-alias discipline entity is unverifiable).
2. **The topic-entity anchor norm was a recorded ruling, not an oversight.** The grounding report
   accepted Q1301371 explicitly under "CS names areas by their objects; the enwiki article is the
   area's main article" (same norm as digital-libraries, visualization). Q1301371: 127 sitelinks,
   enwiki "Computer network", alias "computer networks".
3. **Second-provider triangulation sides with the object anchor.** OpenAlex links its computer-
   networks concepts (C31258907 "Computer network", and the duplicate-linked C2985904603) to
   **Q1301371**, not Q10336440 (see `foundry/proposals/openalex-cis-prevalidation-v1/`).

**Permanent watch item:** if Q10336440 matures upstream (gains enwiki sitelink / aliases /
sitelinks), it becomes the preferred re-anchor for this node. The contest is real and recorded;
the residual-error upper bound above counts it.

## Scope concern recorded (survived, medium confidence)

**subfield:digital-libraries → Q212805**: P31 is Q25397890 ("type of library" — a metaclass, not a
discipline class). The agent searched for a separate "digital libraries as LIS subfield" entity and
found none; the mapping survives under the same topic-anchor norm, with the P31-kind concern
recorded. OpenAlex corroborates the anchor (C513874922 "Digital library" → Q212805).

## Cross-check against OpenAlex triangulation (same session)

Of the 24 audited QIDs, 22 were also in the OpenAlex pre-validation scope (the 22 reviewed nodes).
**21/22 have an OpenAlex concept independently linked to exactly the audited QID** — including all
four session-#8 manual selections (Q13636890 "Algorithmics", Q2670534 "Programming language
theory", Q214526 "Automata theory", Q603441 "Bibliometrics"), which is independent corroboration
of the decision-log (9) manual path. The exception is Q13420675 (LIS) — absent from OpenAlex
Concepts (404), while the audit's live Wikidata observation (enwiki "Library and information
science", survived/high) stands on its own. The 2 B-flag QIDs (Q117801, Q17995793) were outside
the pre-validation scope but survived the audit high (enwiki "Computational science" — alias
"scientific computing" verified at resolution; enwiki "Quantum computing").

## Per-item verdict table

| Node | QID | Verdict | enwiki observed live |
|---|---|---|---|
| algorithms-and-data-structures | Q13636890 | survived / high | Algorithmics |
| computational-complexity-theory | Q205084 | survived / high | Computational complexity theory |
| programming-languages | Q2670534 | survived / high | Programming language theory |
| software-engineering | Q80993 | survived / high | Software engineering |
| computer-networks | Q1301371 | **agent-refuted → adjudicated survived (watch item)** | Computer network |
| artificial-intelligence | Q11660 | survived / high | Artificial intelligence |
| computer-vision | Q844240 | survived / high | Computer vision |
| natural-language-processing | Q30642 | survived / high | Natural language processing |
| human-computer-interaction | Q207434 | survived / high | Human–computer interaction |
| computer-graphics | Q150971 | survived / high | Computer graphics (computer science) |
| cryptography | Q8789 | survived / high | Cryptography |
| computer-security | Q3510521 | survived / high | Computer security |
| theoretical-computer-science | Q2878974 | survived / high | Theoretical computer science |
| formal-languages-and-automata-theory | Q214526 | survived / high | Automata theory |
| information-retrieval | Q816826 | survived / high | Information retrieval |
| library-and-information-science | Q13420675 | survived / high | Library and information science |
| knowledge-organization | Q1929761 | survived / high | Knowledge organization |
| digital-libraries | Q212805 | survived / **medium** (P31 metaclass concern) | Digital library |
| bibliometrics | Q603441 | survived / high | Bibliometrics |
| social-computing | Q615684 | survived / high | Social computing |
| visualization | Q451553 | survived / high | Visualization (graphics) |
| history-of-computing | Q2735691 | survived / high | History of computing |
| scientific-computing (proposed) | Q117801 | survived / high | Computational science |
| quantum-computing (proposed) | Q17995793 | survived / high | Quantum computing |

## What this measures — and what it does not

This estimates the **residual wrong-referent rate of the CS batch's accepted QIDs: 0/24 confirmed
(≤4.2% counting the contested anchor)**. It does not measure: coverage gaps (QID-less nodes were
not in scope), granularity fitness of topic-entity anchors as a class (two recorded concerns are
the start of that dataset), or other continents (philosophy/formal-sciences batches remain
audit candidates for future pit-stops).
