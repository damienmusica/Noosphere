# Grounding report — computer-and-information-sciences-skeleton-v1

- **Resolver:** scripts/foundry/resolve-wikidata.ts v3, run locally 2026-06-11 (cloud sessions are
  Wikidata-blocked; see docs/data-foundry.md §11). Source pack:
  `dist/foundry/source-packs/computer-and-information-sciences-skeleton-v1/wikidata.json` (gitignored).
- **Manual selections:** decision-log (9) path — live `wbgetentities`/`wbsearchentities` only,
  sitelinks + aliases + P31 multi-signal; no training-knowledge QIDs. (Three QIDs recalled from
  training during QC — Q1437427, Q230502, Q179289 — resolved live to an apple cultivar, a
  damselfly suborder, and causality. The policy is not theoretical.)
- **Input:** 27 seeds. Resolver: 24 resolved / 3 unresolved / 8 ambiguous-flagged.
- **Verdicts:** 24 verified QIDs (20 resolver rank-1 accepted + 4 manual), 3 QID-less
  (v1.2 alternative grounding, all live). Rank-1 acceptance: **20/24 (83%)**.
- **Generator hint accuracy:** 7/25 hinted survivors matched the verified QID (**28% — 72%
  wrong/hallucinated**; formal sciences measured 27% correct. Trend 93→71→72% hallucination:
  stable, and exactly why hints are never evidence.)

## Verdict table

| Node | QID | Path | Notes |
|---|---|---|---|
| algorithms-and-data-structures | **Q13636890** "algorithmics" | manual | Resolver rank-1 Q24869627 rejected (orphan "Topic" entity, no enwiki). Q13636890: desc "study of algorithms and data structures" — exact referent; aliases "algorithms", "study of algorithms"; 8 sitelinks; P31 branch of science. |
| computational-complexity-theory | Q205084 | rank-1 (140) | hint Q226887 wrong |
| programming-languages | **Q2670534** "programming language theory" | manual | Rank-1 Q23893200 "machine language" rejected (junk entity, 0 sitelinks, alias trap). Q2670534: enwiki "Programming language theory", 24 sitelinks, alias "PLT", P31 research field. The research-area referent of the department label. |
| software-engineering | Q80993 | rank-1 (140) | hint match |
| computer-systems | **QID-less** | rank-1 rejected | Q105981125 "computer systems" has P31 academic-discipline but **0 sitelinks, 0 aliases** — single-signal orphan stub, fails the (9) multi-signal bar. v1.2 grounding: ACM CCS top level + UDC 004.2/004.45 + MSC 68Mxx (all live) → **proposed**. |
| computer-networks | Q1301371 | rank-1 (40) confirmed | Alias "computer networks", 127 sitelinks, enwiki "Computer network". Topic-entity anchor (CS names areas by their objects; the enwiki article is the area's main article). |
| distributed-and-parallel-computing | **QID-less** | unresolved | No combined entity upstream (Q180634 distributed / Q232661 parallel are separate object/paradigm concepts). v1.2 grounding: UDC 004.75 (live) + CCS branches → **proposed**. |
| databases-and-information-systems | **QID-less** | rank-1 rejected | Rank-1 Q60521047 is a scientific article. No combined DB+IS discipline entity upstream (Q8513 = the artifact; Q1149776 data management = business-process referent). v1.2 grounding: UDC 004.65 + LCC QA76.9.D3 + CCS Data management systems (all live) → **proposed**. |
| artificial-intelligence | Q11660 | rank-1 (140) | hint match |
| computer-vision | Q844240 | rank-1 (140) | hint Q192613 wrong |
| natural-language-processing | Q30642 | rank-1 (140) | hint match |
| human-computer-interaction | Q207434 | rank-1 (140) | hint Q485340 wrong |
| computer-graphics | Q150971 | rank-1 (140) | "computer graphics" discipline entity; hint Q182832 wrong |
| cryptography | Q8789 | rank-1 (140) | hint match |
| computer-security | Q3510521 | rank-1 (140) | hint match |
| theoretical-computer-science | Q2878974 | rank-1 (140) | hint Q466 wrong, as QC predicted |
| formal-languages-and-automata-theory | **Q214526** "automata theory" | manual | Unresolved by compound query (resolver-v4 candidate pattern). Q214526: 43 sitelinks, P31 academic discipline, enwiki "Automata theory" whose scope covers formal language theory; the CCS/MSC division (68Q45 "Formal languages and automata") treats the pair as one area — scope note recorded. |
| scientific-computing | Q117801 "computational science" | rank-1 (140) | **alias-verified live**: "scientific computing" is a registered alias; 27 sitelinks. B-flag → proposed regardless. |
| information-retrieval | Q816826 | rank-1 (140) | hint Q252243 wrong |
| quantum-computing | Q17995793 | rank-1 (140) | discipline entity (hint Q206904 = the machine, wrong kind) |
| library-and-information-science | Q13420675 | rank-1 (140) | hint match |
| knowledge-organization | Q1929761 | rank-1 (140) | hint Q1520547 wrong |
| digital-libraries | Q212805 | rank-1 (40) confirmed | Alias "digital libraries", 62 sitelinks; topic-entity anchor (same norm as computer-networks). hint match. |
| bibliometrics(-and-scientometrics) | **Q603441** "bibliometrics" + **rename ruling** | manual | Unresolved (rank-1 was an article, score −200). No combined entity upstream. **QC ruling: node enters /data as `subfield:bibliometrics`** (label "Bibliometrics", aliases "Scientometrics", "Bibliometrics and Scientometrics") — §12 label rule (research-area label) + identity-first: Q603441 (34 sitelinks, P31 academic discipline, LCC Z669.8 home match) identifies the bibliometrics referent exactly; scientometrics (Q472342) and informetrics (Q355654) recorded as sibling/umbrella entities within the node's scope. The combined ID never existed in /data — no migration. |
| social-computing | Q615684 | rank-1 (140) | hint Q7549787 wrong |
| visualization | Q451553 | rank-1 (40) accepted | Exact label, 30 sitelinks, enwiki "Visualization (graphics)" — the graphics-context topic entity (same topic-anchor norm). Field-scoped siblings recorded: Q10609775 information visualization, Q133505171 data and information visualization. Gap-fill seed had no hint by design. |
| history-of-computing | Q2735691 | rank-1 (40) confirmed | Exact label, 15 sitelinks, P31 aspect-of-history (right kind for a history-of-X node); enwiki "History of computing". Gap-fill seed had no hint by design. |

## Promotion outcome (standing policy v1 + v1.2 + v1.3)

| Tier | Count | Nodes |
|---|---|---|
| **reviewed + indexable** (verified QID, no flag) | **22** | algorithms-and-data-structures, computational-complexity-theory, programming-languages, software-engineering, computer-networks, artificial-intelligence, computer-vision, natural-language-processing, human-computer-interaction, computer-graphics, cryptography, computer-security, theoretical-computer-science, formal-languages-and-automata-theory, information-retrieval, library-and-information-science (field), knowledge-organization, digital-libraries, bibliometrics, social-computing, visualization, history-of-computing |
| **proposed** (verified QID, B-flag retained) | 2 | scientific-computing (Q117801), quantum-computing (Q17995793) |
| **proposed** (QID-less, v1.2 alternative grounding — live classification divisions) | 3 | computer-systems, distributed-and-parallel-computing, databases-and-information-systems |
| foundry stay | 0 | — |

## Executed alongside promotion (pre-registered QC ruling)

- **field:machine-learning → subfield:machine-learning** (level 1→2) with canonical ID migration
  across nodes/edges/translations/external-links/learning-paths (10 references, 5 files);
  `academic_status: established` added (pre-§12 legacy node lacked the tag); reviewed/indexable
  status unchanged; edge `machine-learning-part-of-computer-science` semantics unchanged
  (source ID updated). §12 precedent log already carries the ruling (PR #49).

## Resolver-v4 candidate-queue additions (measured failures)

- Compound/conjunction seed labels return papers/books or nothing ("Formal Languages and Automata
  Theory", "Bibliometrics and Scientometrics", "Distributed and Parallel Computing", "Databases and
  Information Systems", "Algorithms and Data Structures") — same family as the formal-sciences
  plural-query failure: needs a component-split + alias-union fallback.
- Orphan-stub acceptance: rank-1 with P31-discipline but zero sitelinks/aliases (Q105981125) should
  be auto-flagged harder than "ambiguous" — a no-sitelink discipline entity is unverifiable.
