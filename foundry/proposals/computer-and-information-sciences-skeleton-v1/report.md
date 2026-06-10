# Proposal Report — Computer and Information Sciences Skeleton v1

**Batch:** `batch:computer-and-information-sciences-skeleton-v1`
**Generator:** Claude Sonnet (claude-sonnet-4-6)
**Generated:** 2026-06-11
**Status:** generated — untrusted draft, awaiting separate QC pass

---

## Counts

| Category | Count |
|---|---|
| Proposed field nodes (level 1) | 1 |
| Proposed subfield nodes (level 2) | 27 |
| **Total proposed nodes** | **28** |
| Reconciled to existing /data nodes (not re-proposed) | 8 |
| Nodes with `ambiguous: true` | 11 |
| Nodes with `[UNFETCHED:]` markers in source_hint | 28 (all nodes — LCC QA/Z PDFs and ACM CCS all blocked; [UNFETCHED:] embedded in each source_hint) |
| Edges proposed | 0 |

---

## Fetch Access Log

| Source | URL | Outcome |
|---|---|---|
| LCC QA PDF | https://www.loc.gov/aba/cataloging/classification/lcco/lcco_q.pdf | HTTP 403 |
| LCC QA Wayback | https://web.archive.org/web/2024/https://www.loc.gov/aba/cataloging/classification/lcco/lcco_q.pdf | BLOCKED (web.archive.org not accessible in this environment) |
| LCC Z PDF | https://www.loc.gov/aba/cataloging/classification/lcco/lcco_z.pdf | HTTP 403 |
| LCC Z Wayback | https://web.archive.org/web/2024/https://www.loc.gov/aba/cataloging/classification/lcco/lcco_z.pdf | BLOCKED |
| ACM CCS 2012 | https://dl.acm.org/ccs | HTTP 403 |
| ACM CCS Wayback | https://web.archive.org/web/2024/https://dl.acm.org/ccs | BLOCKED |
| **arXiv cs.* taxonomy** | https://arxiv.org/category_taxonomy | **FETCHED 2026-06-11** — all 41 cs.* categories extracted; used as primary community-structure signal |
| MSC 2020 | https://msc2020.org/ | FETCHED 2026-06-11 (partial) — section 68 confirmed, subsections not returned |
| MSC via mathscinet | https://mathscinet.ams.org/mathscinet/msc/msc2020.html | FETCHED 2026-06-11 (partial) — section 68 listed, subsection detail unavailable |
| zbMATH classification | https://zbmath.org/classification/ | HTTP 403 |
| OECD FORD | https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp | FETCHED 2026-06-11 — FORD 1.2 = "Computer and information sciences" confirmed (top-level only) |
| UDC 004 | https://udcsummary.info/php/index.php?lang=en&id=004 | FETCHED 2026-06-11 (navigation only) — subdivisions not accessible |
| UDC 02 | https://udcsummary.info/php/index.php?lang=en&id=02 | FETCHED 2026-06-11 (navigation only) — subdivisions not accessible |
| Wikipedia: Outline of CS | https://en.wikipedia.org/wiki/Outline_of_computer_science | FETCHED 2026-06-11 |
| Wikipedia: Computer science | https://en.wikipedia.org/wiki/Computer_science | FETCHED 2026-06-11 |
| Wikipedia: Theoretical CS | https://en.wikipedia.org/wiki/Theoretical_computer_science | FETCHED 2026-06-11 |
| Wikipedia: HCI | https://en.wikipedia.org/wiki/Human%E2%80%93computer_interaction | FETCHED 2026-06-11 |
| Wikipedia: Bibliometrics | https://en.wikipedia.org/wiki/Bibliometrics | FETCHED 2026-06-11 |
| Wikipedia: Library and information science | https://en.wikipedia.org/wiki/Library_and_information_science | FETCHED 2026-06-11 |
| Wikipedia: Information science | https://en.wikipedia.org/wiki/Information_science | FETCHED 2026-06-11 |

**Primary gap:** LCC QA/Z PDFs and ACM CCS all blocked (403 + Wayback inaccessible). arXiv taxonomy served as substitute primary signal; ACM CCS structure reconstructed from arXiv cross-check and Wikipedia. All LCC, UDC, ACM CCS, and MSC subsection claims marked [UNFETCHED].

---

## Coverage Mapping Table

### arXiv cs.* Categories (FETCHED 2026-06-11 — primary signal)

| Code | Name | Disposition |
|---|---|---|
| cs.AI | Artificial Intelligence | → `subfield:artificial-intelligence` (proposed) |
| cs.AR | Hardware Architecture | EXCLUDED: primary home TK; institutional home engineering |
| cs.CC | Computational Complexity | → `subfield:computational-complexity-theory` (proposed) |
| cs.CE | Computational Engineering, Finance, Science | → `subfield:scientific-computing` (proposed) |
| cs.CG | Computational Geometry | EXCLUDED (level 3): absorbed into algorithms-and-data-structures |
| cs.CL | Computation and Language | → `subfield:natural-language-processing` (proposed) |
| cs.CR | Cryptography and Security | → `subfield:cryptography` + `subfield:computer-security` (both proposed) |
| cs.CV | Computer Vision and Pattern Recognition | → `subfield:computer-vision` (proposed) |
| cs.CY | Computers and Society | DEFERRED: social-sciences boundary; not a CS classification division |
| cs.DB | Databases | → `subfield:databases-and-information-systems` (proposed) |
| cs.DC | Distributed, Parallel, and Cluster Computing | → `subfield:distributed-and-parallel-computing` (proposed) |
| cs.DL | Digital Libraries | → `subfield:digital-libraries` (proposed) |
| cs.DM | Discrete Mathematics | RECONCILED: to `subfield:combinatorics` (formal-sciences canonical) |
| cs.DS | Data Structures and Algorithms | → `subfield:algorithms-and-data-structures` (proposed) |
| cs.ET | Emerging Technologies | → partially `subfield:quantum-computing` (proposed) |
| cs.FL | Formal Languages and Automata Theory | → `subfield:formal-languages-and-automata-theory` (proposed) |
| cs.GL | General Literature | EXCLUDED: not a research subfield |
| cs.GR | Graphics | → `subfield:computer-graphics` (proposed) |
| cs.GT | CS and Game Theory | RECONCILED: `subfield:game-theory` canonical in formal-sciences |
| cs.HC | Human-Computer Interaction | → `subfield:human-computer-interaction` (proposed) |
| cs.IR | Information Retrieval | → `subfield:information-retrieval` (proposed) |
| cs.IT | Information Theory | RECONCILED: `subfield:information-theory` canonical in formal-sciences |
| cs.LG | Machine Learning | RECONCILED: `field:machine-learning` junction node in /data |
| cs.LO | Logic in Computer Science | EXCLUDED: reconciled to formal-sciences (mathematical-logic, computability-theory); CS formal methods absorbed into programming-languages and theoretical-cs |
| cs.MA | Multiagent Systems | ABSORBED into `subfield:artificial-intelligence` |
| cs.MM | Multimedia | EXCLUDED (level 3) |
| cs.MS | Mathematical Software | ABSORBED into `subfield:scientific-computing` |
| cs.NA | Numerical Analysis | RECONCILED: `subfield:numerical-analysis` canonical in formal-sciences |
| cs.NE | Neural and Evolutionary Computing | ABSORBED into `field:machine-learning` (existing) |
| cs.NI | Networking and Internet Architecture | → `subfield:computer-networks` (proposed) |
| cs.OH | Other Computer Science | EXCLUDED: catchall |
| cs.OS | Operating Systems | ABSORBED into `subfield:computer-systems` |
| cs.PF | Performance | ABSORBED into `subfield:computer-systems` |
| cs.PL | Programming Languages | → `subfield:programming-languages` (proposed) |
| cs.RO | Robotics | DEFERRED to engineering-and-technology (primary LCC home TJ; institutional home engineering) |
| cs.SC | Symbolic Computation | ABSORBED into `subfield:scientific-computing` |
| cs.SD | Sound | EXCLUDED (level 3) |
| cs.SE | Software Engineering | → `subfield:software-engineering` (proposed) |
| cs.SI | Social and Information Networks | → `subfield:social-computing` (proposed) |
| cs.SY | Systems and Control | DEFERRED: `subfield:control-theory` canonical in formal-sciences + engineering cross-listing; cs.SY institutional home is engineering |

### ACM CCS 2012 Top-Level Branches ([UNFETCHED] — structure from training knowledge)

| Branch | Disposition |
|---|---|
| General and Reference | EXCLUDED |
| Hardware | EXCLUDED (engineering) |
| Computer Systems Organization | → `subfield:computer-systems` |
| Networks | → `subfield:computer-networks` |
| Software and its Engineering | → `subfield:software-engineering` + `subfield:programming-languages` |
| Theory of Computation | → `subfield:theoretical-computer-science` (umbrella) + sub-area peers |
| Mathematics of Computing | EXCLUDED: formal-sciences canonical nodes cover this |
| Information Systems | → `subfield:databases-and-information-systems` + `subfield:information-retrieval` |
| Security and Privacy | → `subfield:cryptography` + `subfield:computer-security` |
| Human-Centered Computing | → `subfield:human-computer-interaction` + `subfield:social-computing` |
| Computing Methodologies | → `subfield:artificial-intelligence` + `subfield:computer-vision` + `subfield:computer-graphics` + `subfield:natural-language-processing` |
| Applied Computing | → `subfield:scientific-computing` + `subfield:bioinformatics` |
| Social and Professional Topics | EXCLUDED: cross-continent (social-sciences/humanities) |

### LCC QA75.5–76.95 ([UNFETCHED] — training knowledge only)

| Range | Topic | Disposition |
|---|---|---|
| QA75.5 | Computer science (general) | → `field:computer-science` (existing) |
| QA76.5 | Digital computers (hardware) | EXCLUDED (engineering) |
| QA76.6 | Programming | → software-engineering + programming-languages |
| QA76.7–76.73 | Programming languages | → `subfield:programming-languages` |
| QA76.76.A25 | Algorithms | → `subfield:algorithms-and-data-structures` |
| QA76.76.A78 | AI software | → `subfield:artificial-intelligence` |
| QA76.76.D37 | Databases | → `subfield:databases-and-information-systems` |
| QA76.76.O63 | Operating systems | → absorbed into `subfield:computer-systems` |
| QA76.87 | Neural networks | → `field:machine-learning` (existing) |
| QA76.9.A25 | Computer algorithms | → `subfield:algorithms-and-data-structures` |
| QA76.9.C65 | Computer graphics | → `subfield:computer-graphics` |
| QA76.9.D3 | Databases | → `subfield:databases-and-information-systems` |
| QA76.9.H85 | HCI | → `subfield:human-computer-interaction` |
| QA76.9.A96 | Computer security | → `subfield:computer-security` |
| QA267 | Automata | → `subfield:formal-languages-and-automata-theory` |
| QA268 | Cryptography | → `subfield:cryptography` (transfer acceptance) |
| QA76.9.C58 | Computational complexity | → `subfield:computational-complexity-theory` |

### LCC Z665–718.8 ([UNFETCHED] — training knowledge only)

| Range | Topic | Disposition |
|---|---|---|
| Z665–Z665.5 | Library science (general) | → `field:library-and-information-science` |
| Z668–Z669 | Library administration | EXCLUDED (professional practice) |
| Z669 | Bibliometrics | → `subfield:bibliometrics-and-scientometrics` |
| Z672–Z675 | Cataloging | → `subfield:knowledge-organization` |
| Z695–Z699 | Subject cataloging, classification | → `subfield:knowledge-organization` |
| Z699.5 | Information retrieval | → `subfield:information-retrieval` |
| Z711–Z711.5 | Reference services | EXCLUDED (professional practice) |
| Z716 | Public libraries | EXCLUDED (professional practice) |
| Z718.8 | Information services | → absorbed into `field:library-and-information-science` |

### UDC 004 and 02 ([UNFETCHED] — training knowledge only)

| Code | Topic | Disposition |
|---|---|---|
| 004.2 | Computer architecture | EXCLUDED (engineering) |
| 004.3 | Hardware | EXCLUDED |
| 004.4 | Software | → software-engineering + programming-languages |
| 004.5 | HCI | → `subfield:human-computer-interaction` |
| 004.6 | Data | → `subfield:databases-and-information-systems` |
| 004.7 | Computer communication | → `subfield:computer-networks` |
| 004.8 | Artificial intelligence | → `subfield:artificial-intelligence` + `field:machine-learning` (existing) |
| 004.9 | Application-oriented techniques | → `subfield:scientific-computing` |
| 02 | Library science | → `field:library-and-information-science` + subfield nodes |

---

## Reconciled-to-Existing Nodes

| Existing Node ID | Reason |
|---|---|
| `domain:computer-and-information-sciences` | Out of generation scope (junction node) |
| `field:computer-science` | Out of generation scope (junction node) |
| `field:machine-learning` | Out of generation scope (junction node); standing QC level question |
| `subfield:computability-theory` | Canonical in formal-sciences; CS cross-listing is separate task |
| `subfield:information-theory` | Canonical in formal-sciences; CS cross-listing is separate task |
| `subfield:game-theory` | Canonical in formal-sciences; CS cross-listing is separate task |
| `subfield:ethics-of-ai` | Canonical in humanities; referent must not be duplicated |
| `subfield:philosophy-of-information` | Canonical in humanities; referent must not be duplicated |

---

## Deliberate Exclusions

| Area | Reason |
|---|---|
| Computer hardware / digital circuits | Primary LCC home TK; institutional home EE/CE engineering — §12 cross-continent rule |
| Robotics | Primary LCC home TJ; institutional home engineering — §12 cross-continent rule; deferred to engineering-and-technology |
| cs.SY Systems and Control | control-theory canonical in formal-sciences + engineering; engineering institutional home |
| Telecommunications hardware | LCC TK; engineering |
| Discrete mathematics (cs.DM) | Reconciled to `subfield:combinatorics` (formal-sciences canonical) |
| Numerical analysis (cs.NA) | Reconciled to `subfield:numerical-analysis` (formal-sciences); cs.NA community → scientific-computing |
| Media and communications | FORD 5.8; social-sciences continent; batch manifest exclusion |
| Computers and Society (cs.CY) | Social-sciences boundary |
| Social and professional topics | Cross-continent (social-sciences/humanities) |
| Logic in CS (cs.LO) | Reconciled to formal-sciences (mathematical-logic, computability-theory, proof-theory, model-theory) |
| Multiagent systems | Level-3 granularity; absorbed into artificial-intelligence |
| Neural and evolutionary computing | Absorbed into field:machine-learning (existing) |
| Multimedia | Level-3 granularity |
| Operating systems (standalone) | Absorbed into computer-systems |
| Symbolic computation | Absorbed into scientific-computing |
| Sound / audio computing | Level-3 granularity |
| Computational geometry | Level-3 granularity; absorbed into algorithms-and-data-structures |

---

## QC Priority Items (in order)

1. **field:machine-learning vs. subfield:artificial-intelligence structural inversion (pre-registered)** — ML is level-1 field; AI is proposed as level-2 subfield. This is structurally inverted. QC must resolve per batch manifest standing question.

2. **subfield:theoretical-computer-science umbrella vs. peer sub-nodes** — If QC keeps both umbrella and sub-areas, flat two-level rule is satisfied; if umbrella is dropped, the sub-areas stand alone. QC should rule.

3. **subfield:computer-graphics vs. subfield:visualization split** — Overlap is substantial; QC should consider merging visualization into computer-graphics or into human-computer-interaction.

4. **subfield:cryptography vs. subfield:computer-security split** — Both under arXiv cs.CR; different conference communities. QC should confirm split is warranted.

5. **field:library-and-information-science level assignment** — Proposed as level-1 field (peer of computer-science). QC should confirm or demote to level-2 subfield.

6. **subfield:bioinformatics cross-continent placement** — arXiv usage pattern suggests life-sciences may be stronger institutional home. Flagged ambiguous:true; QC may defer to life-sciences skeleton.

7. **subfield:archival-science LCC home** — Primary LCC home is CD (not Z); QC should verify via id.loc.gov whether CD or Z is the correct classification home, as this affects the cross-continent rule application.

8. **subfield:quantum-computing cross-continent placement** — arXiv quant-ph usage dominates over cs.*; many groups in physics. Flagged ambiguous:true.

9. **subfield:social-computing cross-continent placement** — Social-sciences continent may claim this; flagged ambiguous:true.

10. **LCC and ACM CCS completely [UNFETCHED]** — All LCC QA/Z and ACM CCS 2012 structure claims are training-knowledge-only. QC should run the local LCC/ACM reference tools to verify coverage mapping before promotion.

---

## Wikidata QID Hint Warning

All `external_ids.wikidata` values are unverified training-knowledge hints. Prior batch accuracy: 27% correct (11/38 in formal-sciences). The downstream resolver must verify each before promotion.
