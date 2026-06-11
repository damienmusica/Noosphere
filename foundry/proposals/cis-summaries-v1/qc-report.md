# QC report — cis-summaries-v1 (editorial layer, 4th batch) + Sonnet/Opus A/B

- **QC by:** Claude Fable 5 (claude-fable-5), orchestrator session #9, 2026-06-11.
- **Scope:** 23 summaries — the 22 CIS-continent nodes reviewed in session #8 (the full
  reviewed-without-summary gap), plus a refresh of the stale one-line `subfield:machine-learning`
  summary (**out of the A/B sample**). All parent nodes are `reviewed` (editorial v1 precondition);
  every English translation is marked `reviewed`. Editorial policy v1: full fact cross-check, one
  unverifiable claim = rejection or QC edit to verified text. The citations in this report are QC
  live-verified pages (fetched 2026-06-11) and constitute the permanent citation record.
- **A/B design (pre-registered in `ab-split.json`, written before generation and QC):** the 22
  nodes were split 11/11 by salted hash; batch-a → Opus (claude-opus-4-8), batch-b → Sonnet
  (claude-sonnet-4-6); **order text identical, model the only variable**. Proposal files carried
  `BLINDED:batch-a/b` during QC; all verdicts were recorded before the split table was consulted
  (single-orchestrator caveat: the operator launched the agents and cannot be fully blind —
  procedural discipline, not true blinding). ML refresh ran as a third Sonnet order, out of sample.
- **Generation contract (both orders, verbatim-identical):** live-fetch mandate + [UNFETCHED]
  self-marking + **new anti-laundering clause** ("only claims that actually exist in the cited
  document may be cited to it") + bot-block bypass tactics.

## A/B dashboard (the session's headline measurement)

| Metric (per model, 11 items each) | **Opus (batch-a)** | **Sonnet (batch-b)** |
|---|---|---|
| Approved as generated | **11/11** | 1/11 (software-engineering) |
| QC-edited | 0 | 10 |
| Rejected | 0 | 0 |
| QC edit rate (items) | **0%** | **91%** |
| Dropped/edited claims (total / per item) | **0 / 0.0** | **19 / 1.7** |
| Cited-URL hallucinations (dead or wrong-entry) | **0/17** | **0/21** |
| **Hint-laundering** (claim attributed to a fetched doc that does not contain it) | **0** | **2** (bibliometrics: "co-published with Akadémiai Kiadó"; "categorized under Information Storage and Retrieval / Library Science" — neither on the cited Wayback snapshot, both attributed to it in the rationale) |
| In-page misattribution (claim exists on page but about a different entity) | 0 | 2 (ASIS&T "describes the discipline" — the page describes *members' shared interest*; SIGGRAPH "affiliated interests… multimedia, scientific visualization, human-computer interfaces" — that list is the page's description of **Eurographics**, a different association) |
| Honest disclosure of unsourced claims (uncertainty notes / ambiguous flags) | 1 disclosure / 0 flags | **7 disclosures / 3 flags** |
| [UNFETCHED] markers used | 0 (unfetchable sources excluded entirely, e.g. IEEE Annals) | 0 (kept unsourced claims in text, disclosed in uncertainty — partial contract compliance: the contract requires marking or dropping) |

**Reading.** With identical orders, Opus produced zero claims its citations could not support — it
*omitted* what it could not fetch (e.g. refusing to name IEEE Annals after a 418). Sonnet's text
was stylistically equivalent but kept unverifiable claims in the prose while (honestly) flagging
most of them in `uncertainty`, plus 2 true laundering instances and 2 in-page misattributions that
only full QC caught. Sonnet's self-flagging was excellent (all 3 `ambiguous` flags were genuine
problems, including catching its own SIGIR 1971-vs-1978 conflict); its claim discipline was not.
Both models hit 0% URL hallucination — the live-fetch mandate holds for a 6th consecutive batch.
This table is the input to session gate (b) (editorial-track generator promotion).

## URL verification record

All **38 unique cited URLs** (17 batch-a + 21 batch-b) plus the ML batch's 4 were fetched live by
QC on 2026-06-11: **38/38 + 4/4 live, 0% hallucination**. Benign redirects verified same-entry:
Britannica `/science/`↔`/technology/`↔`/topic/` (AI, P-vs-NP, digital-library), sigir.org
`/about/`→`/general-information/about/`, cscw.acm.org→`/2026/`, and two round-timestamp Wayback
URLs resolving to nearest snapshots (Scientometrics aims → 20240530155617, JCDL → 20240611033549).

## Batch-a (Opus) — 11/11 approved as generated; verified citation record

Claim-critical terms of every summary were located in the cited pages' cached text:

| node | verified against (all live) |
|---|---|
| algorithms-and-data-structures | EoM "Algorithm" (definition quotes verbatim; al-Khwarizmi "9th century" verbatim; Turing/Post/Markov/Kolmogorov; Church) |
| artificial-intelligence | Britannica AI (definition verbatim; abilities list; rote vs generalization; 1940s; flexibility passage) |
| computational-complexity-theory | EoM "Complexity theory" ("finer classification…", "fewer resources", P/NP machine definitions, "hardest problems in NP" — TeX-marked); Britannica P-versus-NP (2000, Millennium) |
| computer-security | Britannica Computer security (definition + threats + 3 methods + modem/PC chronology, all verbatim runs) |
| computer-vision | Britannica Computer vision (definition verbatim; deep-learning passage; applications) |
| formal-languages-and-automata-theory | EoM "Automaton, finite" (definition; "starting point of the modern theory of automata"; regular-events correspondence) |
| history-of-computing | Britannica Computer science (1936 Turing machine; von Neumann stored-program; "independent discipline in the early 1960s…two decades earlier"); CHM About ("artifacts and stories of the ongoing computing revolution", Mountain View) |
| human-computer-interaction | Britannica human-machine-interaction (HCI definition verbatim); SIGCHI About ("largest association of professionals…"); CHI 2026 page ("premier international conference…" as source quote) |
| knowledge-organization | ISKO Encyclopedia "Knowledge organization" (definition, KOP and KOS lists — verbatim modulo the encyclopedia's "→" navigation arrows); ISKO About (1989; journal lineage International Classification 1974) |
| natural-language-processing | Britannica NLP (definition verbatim; "deep-learning models" hyphenated; sarcasm/idiom; "voice-operated GPS systems" → summary's "voice-operated navigation"; "auto-completing search queries"; bias) |
| programming-languages | CMU CSD PL area ("comprehensive science of programming…" verbatim); Oxford PL theme (1965 Programming Research Group; topic list) — identity correctly led with PLT per the Q2670534 pin |

False-miss notes (initially flagged by string search, then verified — recorded for reproducibility):
EoM TeX markup (`$\mathcal{NP}$`) hides "hardest problems in NP"; ISKO inserts "→" arrows inside
the quoted definition runs; Britannica NLP hyphenates "deep-learning".

## Batch-b (Sonnet) — 1 approved, 10 QC-edited; what changed and why

| node | change | verified against |
|---|---|---|
| software-engineering | **approved as generated** | Britannica Software engineering (definition verbatim; Margaret Hamilton "created the term software engineer…command and lunar modules…late 1960s and early '70s" verbatim); TOSEM Wayback (scope quote; Publication Years 1992–) |
| library-and-information-science | ASIS&T quote re-attributed: the page says *members* "share a common interest in improving the ways society stores…", not that the association "describes the discipline" so; member-field list trimmed to page terms; JASIST sentence aligned to page ("fully refereed scholarly and technical periodical…since 1950", "wide range") | asist.org/about; asist.org/publications/jasist; ischools.org/about ("social and behavioural sciences, as well as computing, and linguistics"; topics list) |
| bibliometrics | Dropped 2 laundered claims (Akadémiai Kiadó co-publication; subject categories) — **not on the cited snapshot**; dropped the self-flagged unsourced methods sentence; ISSI sentence aligned to page wording | Scientometrics aims Wayback ("original research on all quantitative aspects…", "welcomes both theoretical and empirical studies"); issi-society.org/about |
| computer-graphics | Dropped "the premier professional organization in the field" (evaluative, not on page — page only calls its two conferences "two of the premier conferences", now quoted as such); **fixed Eurographics misattribution** (multimedia/sci-vis/HCI list describes Eurographics on that page); dropped unsourced IEEE TVCG sentence (self-flagged) | siggraph.org/about (community + mission quotes verbatim) |
| computer-networks | Dropped unsourced ARPANET/packet-switching/Kleinrock-Roberts sentence (self-flagged; the names appear only in a "Key People" sidebar—alongside Geoffrey Hinton—not in article text); "computer science and electrical engineering" → "computer science" (EE claim not on cited pages) | Britannica Computer network (definition verbatim; OSI/SNA); SIGCOMM About Wayback (scope quote verbatim) |
| cryptography | **Fixed RSA mis-paraphrase**: "difficulty of factoring large primes" (mathematically wrong) → EoM's actual claim, "almost impossible…to recover two large prime numbers from their product" by "presently known factorization algorithms"; quote fidelity "(and art)" restored in the cryptanalysis quote; dropped unverified "expanded dramatically" and "annual" qualifiers | Britannica Cryptology (definitions verbatim); EoM Cryptography (RSA passage verbatim); iacr.org/about (3 journals + 3 conferences + purpose) |
| digital-libraries | Dropped self-flagged unsourced research-topics sentence; Britannica paraphrase tightened to page wording ("do not have to go to a building for some kinds of information") | Britannica digital library; JCDL Wayback ("major international forum…"; ACM + IEEE-CS merger; Vannevar Bush Best Paper Award — all verbatim) |
| information-retrieval | Resolved the generator's (correctly self-flagged) 1971-vs-1978 conflict using the history page's own listing: "conference series dates to the 1971 International ACM SIGIR Conference on Information Storage and Retrieval" (the "1st Annual…" label belongs to 1978 — not asserted); "established in 1963" → "has since 1963 promoted…" (page wording); "primary publication" → neutral "publishes the SIGIR Forum" | Britannica Information retrieval; sigir.org about + history pages |
| social-computing | Dropped unsourced "dates to 1986" + "sponsored by ACM SIGCHI" (neither on the cited page nor on the SIGCHI pages in this batch's capture) and the unsourced research-themes list (all self-flagged); replaced with the page's live fact: 29th edition, CSCW 2026, Salt Lake City, October 2026 | cscw.acm.org/2026 (quotes verbatim; "THE 29TH ACM CONFERENCE…" banner) |
| theoretical-computer-science | Final STOC/FOCS sentence rewritten to what the cited snapshot actually supports: SIGACT "Conference sponsorships: PODC, SPAA, STOC, ITCS; In-cooperation conferences: PODS, SODA, FOCS…" — the full conference names and "IEEE" descriptor were not on the page | SIGACT Wayback (topic-list quote verbatim incl. "computational economics"; "fosters and promotes…" verbatim) |
| visualization | Dropped unsourced IEEE-TVCG-primacy sentence (self-flagged; TVCG appears on the cited page only inside example-paper citations) | ieeevis.org 2024 area model (definition + three-branch expansion + area list verbatim) |

## ML refresh (out of sample, Sonnet) — QC-edited

Branch list trimmed to the chapters actually on Mitchell's book page (decision trees, neural
networks, Bayesian, instance-based, genetic algorithms, reinforcement learning) — the generated
"supervised learning (classification and regression via…support vector machines), unsupervised
learning" framing was attributed to the cited sources but appears on none of them (**1 laundering
instance, out-of-sample**); "ICML defines its scope as" → neutral "presents research on" (page says
"globally renowned for presenting and publishing…"); evaluative "principal open-access publication
venue" → JMLR's own quoted self-description. Verified against cs.cmu.edu/~tom/mlbook.html,
Britannica machine-learning (lead), icml.cc/Conferences/2025 ("Forty-Second"), jmlr.org
(established 2000 + forum quote). The generator's uncertainty honestly disclosed the Britannica
JS-gate and deliberately omitted the unfetchable Samuel-1959 coinage.

## Cumulative editorial dashboard

- Citation-URL hallucination: 41% → 59% → 0% → 0% → 0% → **0% (6th consecutive zero
  since the live-fetch mandate)**.
- Hint-laundering (new metric this session, target 0): **2 in-sample (both Sonnet) + 1
  out-of-sample (Sonnet)** — the anti-laundering clause reduced but did not eliminate it in
  Sonnet output; Opus measured 0.
- /data effect: summaries 123 → **146**; reviewed nodes with summaries: **145/145** (gap closed);
  `subfield:machine-learning` stale one-liner replaced.
