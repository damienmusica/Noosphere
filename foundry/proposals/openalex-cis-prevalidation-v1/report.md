# OpenAlex CIS pre-validation report — openalex-cis-prevalidation-v1

- **Measured by:** Claude Fable 5 (orchestrator session #9), 2026-06-11, local ad-hoc calls
  (polite-pool `mailto`, keyless public endpoints, serial with delay; **no committed scripts** —
  pit-stop principle). Raw capture kept local (`/tmp/oa-cis-preval.json`, not committed).
- **Scope:** 25 nodes — the 22 newly-reviewed CIS-continent nodes + 3 junction nodes
  (`domain:computer-and-information-sciences`, `field:computer-science`, `subfield:machine-learning`).
  All 25 carry resolver/QC-verified Wikidata QIDs.
- **Method (per ratified decision log (18)/(20) discipline):** (1) Concepts label search → rank-1
  candidate; (2) QID direct lookup `/concepts/wikidata:<QID>`; (3) multi-signal cross-check —
  ID round-trip, `display_name` vs node identity, concept-linked QID = node QID, concept `level`
  plausibility. **QID-only lookup is never accepted alone** (duplicate-link anomaly, see below).
- **This is a report only.** No `/data` change, no schema change. Writing `external_ids.openalex` +
  `external_metrics.openalex` follows the separate CPO implementation gate ((19)→(20) pattern).

## Second-provider identity triangulation (stated purpose)

The concept-QID ↔ node-QID comparison in this pass is itself a **second, independent identity
triangulation**: OpenAlex curators linked each Concept to Wikidata without reference to our
resolver or QC. Where the concept OpenAlex links to our verified QID also carries the node's
referent name, two independent pipelines agree on the entity. Notably, **all four session-#8
manual QID selections are corroborated**: OpenAlex has concepts named "Algorithmics"
(→ Q13636890), "Programming language theory" (→ Q2670534), "Automata theory" (→ Q214526), and
"Bibliometrics" (→ Q603441) — exactly the QIDs chosen by the decision-log-(9) manual path.
This cross-checks the adversarial QID audit run in the same session (see
`foundry/proposals/qid-adversarial-audit-cis-v1/`).

## Headline numbers

| Measure | Result |
|---|---|
| Search rank-1 = node identity (multi-signal pass) | **19/25 (76%)** |
| — of which clean (round-trip fully consistent) | 15 |
| — of which rank-1 correct but reverse QID-lookup hits a *different* concept sharing the QID (duplicate-link anomaly) | 4 |
| Rank-1 miss, but a QID-linked concept matching the node referent exists (manual per-item route) | 4 |
| Absent from Concepts (QID lookup 404, no matching concept surfaced) | 1 (`field:library-and-information-science`) |
| Identity collision (one concept, two graph nodes) | 1 (`domain:computer-and-information-sciences` — see below) |

Formal-sciences comparison: Concepts rank-1 was 34/42 (81%) there; 19/25 (76%) here is consistent,
with the same failure families (artifact-vs-discipline splits, compound labels, upstream gaps).

## Verdict table

Status legend: ✓ rank-1 accept candidate / M manual per-item route / ✗ no write candidate.

| Node | QID | Search rank-1 | QID lookup | Verdict |
|---|---|---|---|---|
| computational-complexity-theory | Q205084 | C179799912 "Computational complexity theory" (L2) | same | ✓ clean |
| software-engineering | Q80993 | C115903868 "Software engineering" (L1) | same | ✓ clean |
| computer-vision | Q844240 | C31972630 "Computer vision" (L1) | same | ✓ clean |
| natural-language-processing | Q30642 | C204321447 "Natural language processing" (L1) | same | ✓ clean |
| human-computer-interaction | Q207434 | C107457646 "Human–computer interaction" (L1) | same | ✓ clean |
| cryptography | Q8789 | C178489894 "Cryptography" (L2) | same | ✓ clean |
| computer-security | Q3510521 | C38652104 "Computer security" (L1) | same | ✓ clean |
| theoretical-computer-science | Q2878974 | C80444323 "Theoretical computer science" (L1) | same | ✓ clean |
| information-retrieval | Q816826 | C23123220 "Information retrieval" (L1) | same | ✓ clean |
| knowledge-organization | Q1929761 | C2779810430 "Knowledge organization" (L2) | same | ✓ clean |
| digital-libraries | Q212805 | C513874922 "Digital library" (L3) | same | ✓ clean |
| bibliometrics | Q603441 | C178315738 "Bibliometrics" (L2) | same | ✓ clean |
| social-computing | Q615684 | C74216064 "Social computing" (L3) | same | ✓ clean |
| history-of-computing | Q2735691 | C2778653333 "History of computing" (L2) | same | ✓ clean |
| field:computer-science | Q21198 | C41008148 "Computer science" (**L0**) | same | ✓ clean |
| computer-networks | Q1301371 | C31258907 "Computer network" (L1, works 3.56M) | **C2985904603 "Information networks"** (L2, works 3k) — duplicate link | ✓ rank-1; anomaly recorded |
| artificial-intelligence | Q11660 | C154945302 "Artificial intelligence" (L1, works 36.1M) | **C2986342778 "Cognitive systems"** (L3) — duplicate link | ✓ rank-1; anomaly recorded |
| visualization | Q451553 | C36464697 "Visualization" (L2, works 938k) | **C64073096 "Interactive visualization"** (L3) — duplicate link | ✓ rank-1; anomaly recorded |
| machine-learning | Q2539 | C119857082 "Machine learning" (L1, works 5.07M) | **C2982736386 "Statistical learning"** (L2) — duplicate link | ✓ rank-1; anomaly recorded |
| algorithms-and-data-structures | Q13636890 | C125583679 "Search algorithm" (wrong, Q755673); rank-2 C34628019 "Algorithmics" = our QID | C34628019 "Algorithmics" (L2, works 792) | M — QID-route candidate |
| programming-languages | Q2670534 | C199360897 "Programming language" (Q9143 — the artifact, not the discipline) | C18701968 "Programming language theory" (L4, works 2.9k) | M — QID-route candidate |
| computer-graphics | Q150971 | C121684516 "Computer graphics (images)" (Q7600677 — different referent); rank-3 = C77660652 | C77660652 "Computer graphics" (L2, works 82k) | M — QID-route candidate |
| formal-languages-and-automata-theory | Q214526 | **search returned 0 results** (compound label) | C116248031 "Automata theory" (L3, works 14.7k) | M — QID-route candidate |
| field:library-and-information-science | Q13420675 | rank-1 "Text categorization" (junk); no LIS concept in top-5 | **404** | ✗ absent — honest gap |
| domain:computer-and-information-sciences | Q21198 | rank-1 "Health informatics" (junk) | C41008148 "Computer science" (L0) | ✗ identity collision — see below |

## Structural findings

1. **Duplicate-QID concept linking is common in this continent: 4/24 QID lookups (17%)**
   (Q1301371, Q11660, Q451553, Q2539), vs. a single instance (Q141495) measured in the
   formal-sciences pass. In every case the *search* rank-1 concept is the major, correctly-named
   entity and the QID-lookup endpoint returns a minor concept sharing the QID link. This
   re-confirms the ratified rule ((20)): **QID-only lookup is forbidden; multi-signal
   cross-checking is mandatory.** For these 4 nodes the write candidate is the search-rank-1
   concept, with the duplicate noted per node at write time.
2. **The compound-label search failure family is cross-provider.** "Formal Languages and Automata
   Theory" returns zero OpenAlex search results — the same family as the Wikidata resolver-v4
   queue item (component-split + alias-union fallback). The QID route recovers it.
3. **Artifact-vs-discipline splits mirror Wikidata.** OpenAlex separates "Programming language"
   (artifact) from "Programming language theory" (discipline) and "Computer graphics (images)"
   from "Computer graphics" (discipline) — our node identities sit on the discipline side both
   times, and the QID link lands there correctly.
4. **One concept, two graph nodes (identity collision):** `domain:computer-and-information-sciences`
   and `field:computer-science` share QID Q21198 (a deliberate upstream-modeling artifact of the
   skeleton), and OpenAlex has exactly one concept for it (C41008148 "Computer science", level 0).
   Writing the same concept's metrics to both nodes would double-count one provider entity.
   **Recommendation: the concept backs `field:computer-science` only** (display_name exact match);
   the domain node stays an honest gap, like the LIS field.
5. **LIS is absent from Concepts** (Q13420675 → 404; no concept named for the field surfaced by
   search). Consistent with the absent-4 pattern in formal sciences — recorded as a gap, no
   label-string fallback (label matching stays forbidden).
6. **works_count semantics caveat re-confirmed:** search results surface tag-noise concepts with
   inflated counts (e.g. "SIGNAL (programming language)" works 2.73M, "Crystal (programming
   language)" works 1.16M, "Margin (machine learning)" works 1.79M). Raw facts only enter `/data`
   tied to the identity-verified concept ID; interpretation stays downstream.

## Recommendation (input to CPO gate (a))

- **Write candidates: up to 23 of 25.** 19 rank-1 accepts (4 of them with duplicate-link notes) +
  4 QID-route candidates to be judged per item at implementation time under the decision-log (9)
  multi-signal path (accept/skip per item, as in session #7: accepted 2, skipped 2).
- **No write:** `field:library-and-information-science` (absent upstream),
  `domain:computer-and-information-sciences` (identity collision — field:CS carries the concept).
- Implementation, if ratified, mirrors PR #46: live re-fetch at write time, `external_ids.openalex`
  first, `external_metrics.openalex` (`works_count`, `cited_by_count`, `as_of`, entity URL), full
  multi-signal re-check per node, anomalies noted per node.

---

## Implementation append (2026-06-11, session #10) — write executed under ratified gate (a) / decision log (27)

**Method (mirrors PR #46):** every count below was **re-queried live** on 2026-06-11
(api.openalex.org, polite-pool `mailto`, maintainer-local, serial 1.2s spacing, no committed
scripts). Lookups keyed **only by the verdict table's Concept IDs** (never QID — duplicate-link
anomaly; never label — dental-calculus trap). Multi-signal re-check passed **23/23**: response ID
round-trips the requested Concept ID, `display_name` matches the verdict table, the concept's own
`wikidata` value equals the node's resolver-verified QID, `level` matches. Counts showed no
material drift vs. the session-#9 prevalidation capture (same-magnitude values throughout, e.g.
computer-networks 3,561,409 vs "3.56M"; algorithmics exactly 792 both passes).

**Written to /data (23 nodes):** the 19 rank-1 nodes + 4 manual accepts (below), each receiving
`external_ids.openalex` (verified Concept ID) and
`external_metrics.openalex = { works_count, cited_by_count, as_of: "2026-06-11", entity }`.

### Manual-case verdicts (decision-log-(9) path, live evidence, permanent record)

All four manual candidates were **accepted** — a different distribution from the formal-sciences
pass (2 accept / 2 skip), driven by the signals, not a quota: both FS skips failed *identity*
(display_name or self-description denying the field); none of these four does.

1. **subfield:algorithms-and-data-structures → C34628019 "Algorithmics" — ACCEPT.** Live:
   display_name "Algorithmics" = the verified QID's referent name (Q13636890, session-#8 manual
   pick, enwiki "Algorithmics"), concept wikidata = node QID, level 2, works 792, cited_by 6,543.
   The small works_count was judged explicitly (per the session order): it is a raw fact about the
   rarely-used umbrella label's tagging volume, not an identity defect — the same semantics
   already accepted for rank-1 writes knowledge-organization (4,098) and social-computing (4,832).
   Consistency favors writing the raw fact tied to the verified identity; interpretation stays
   downstream under the standing works_count caveat. **Per-node note:** the count reflects the
   niche label "Algorithmics", not the field's literature volume (which OpenAlex tags under
   sibling object-level concepts).
2. **subfield:programming-languages → C18701968 "Programming language theory" — ACCEPT.** Live:
   display_name sits discipline-side of the artifact-vs-discipline split (rank-1 search hit was
   the Q9143 artifact), concept wikidata = node QID Q2670534, works 2,941, cited_by 20,513.
   **Per-node note:** concept level 4 — OpenAlex nests the discipline concept deep under the
   artifact tree; recorded, not an identity signal failure.
3. **subfield:computer-graphics → C77660652 "Computer graphics" — ACCEPT (clean).** Live:
   display_name exact, concept wikidata = node QID Q150971, level 2, works 82,443, cited_by
   1,088,300. The rank-1 search hit ("Computer graphics (images)", Q7600677) is a different
   referent; the QID route lands discipline-side, as in prevalidation.
4. **subfield:formal-languages-and-automata-theory → C116248031 "Automata theory" — ACCEPT.**
   Live: concept wikidata = node QID Q214526, display_name = the QID's referent name, level 3,
   works 14,705, cited_by 192,680. **Per-node note:** like the node's QID anchor itself
   (session-#8 manual selection), the concept anchors the automata-theory side of the compound
   field name; the compound label has no provider entity anywhere measured (cross-provider
   search-failure family, resolver-v4 queue).

### Duplicate-QID-link notes (4 nodes, permanent per-node record)

Written concept = the major search-rank-1 entity in every case; the minor concept sharing the QID
link is recorded here per node (QID-only lookup remains forbidden):

| node | written concept | minor concept sharing the QID |
|---|---|---|
| subfield:computer-networks | C31258907 "Computer network" | C2985904603 "Information networks" (L2, ~3k works) |
| subfield:artificial-intelligence | C154945302 "Artificial intelligence" | C2986342778 "Cognitive systems" (L3) |
| subfield:visualization | C36464697 "Visualization" | C64073096 "Interactive visualization" (L3) |
| subfield:machine-learning | C119857082 "Machine learning" | C2982736386 "Statistical learning" (L2) |

### Honest gaps (unchanged, per the ratified scope)

- `field:library-and-information-science` — absent upstream (QID lookup 404, no matching concept).
- `domain:computer-and-information-sciences` — identity collision (Q21198 shared with field:CS;
  the single concept C41008148 backs the field node only; writing both would double-count).

### Triangulation dashboard — first computation (new standing metric)

**Metric definition.** *Second-provider triangulation coverage* = share of QID-bearing `/data`
nodes whose verified QID has been **live-observed to be linked by at least one independently
curated second provider's entity** (currently: OpenAlex Concepts; observation = a lookup recorded
in a committed report). Three states per node: **confirmed** (provider entity links exactly the
node's QID), **measured-unconfirmed** (provider checked live; entity absent or links a different
QID), **unmeasured** (no second-provider pass has covered the node). Unmeasured ≠ absent; a 404
is a negative *result*, not an identity doubt.

| continent | QID-bearing | measured | confirmed | measured-unconfirmed | unmeasured | coverage (confirmed/QID-bearing) |
|---|---|---|---|---|---|---|
| computer & information sciences | 27 | 27 | **25** | 2 | 0 | **92.6%** |
| formal sciences | 51 | 42 | **36** | 6 | 9 | 70.6% (within measured: 85.7%) |
| philosophy (humanities) | 62 | 0 | 0 | 0 | 62 | 0% — never measured |
| other-continent junction/seed nodes | 8 | 0 | 0 | 0 | 8 | — |
| **total** | **148** | **69** | **61** | **8** | **79** | **41.2%** (within measured: **88.4%**) |

Detail notes:
- CS measured-unconfirmed 2 = LIS (404) and quantum-computing (Q17995793: `/concepts/wikidata:`
  lookup 404 **this session**, and no top-5 search hit links the QID — upstream absent).
- CS confirmed includes `domain:computer-and-information-sciences` via the shared Q21198 ↔
  C41008148 link (the *QID* is provider-confirmed; the metrics write goes to the field node only).
- **subfield:scientific-computing confirmed this session (measurement only):** search rank-1
  C459310 "Computational science" (L1, works 221,878) links exactly Q117801. It is a clean write
  candidate for a future micro-pass under standing policy (27) — **not written today** because the
  ratified gate-(a) scope is the 19+4 enumeration (the node was a B-flag when that scope was set).
- FS measured-unconfirmed 6 = differential-equations (concept carries variant QID Q11214 —
  metrics written under the recorded granularity-variant judgment, but it is not a confirmation of
  our Q28575007), time-series-analysis (concept links Q186588, the data object), and the 4
  upstream-absent (calculus, algebra, topology, applied-statistics). complex-analysis counts as
  *confirmed* (C107837686 links our Q193756) even though its metrics write was skipped — the
  triangulation metric tracks QID identity, not metric writes.
- FS unmeasured 9 = 4 discipline nodes promoted/resolved after the session-#6 snapshot
  (operations-research, control-theory, mathematics-education, cybernetics) + 5 concept/method
  nodes (vector-space, bayesian-inference, random-variable, probability-distribution,
  gradient-descent). Queue candidates for the next B-track pass.
- Philosophy has had **no OpenAlex pass at all** (B-track ran STEM-first by design; humanities
  carries the citation-DB under-representation caveat, decision 2026-06-09). The 0% is a
  measurement-coverage fact, not an identity-quality fact.

### Evidence permanence (new standing rule, first application)

Wayback Save Page Now was requested for all 26 evidence URLs of this write pass (23 written
concepts' API URLs + the 2 measurement search URLs + C459310). Results are appended below when
the serial archiving pass completes.

Final SPN results (26 evidence URLs; Wayback anonymous-SPN throttling hit mid-pass — the
throttled tail was recovered by a spaced retry once the limit lifted):

| evidence | result | snapshot |
|---|---|---|
| subfield:computational-complexity-theory | archived | https://web.archive.org/web/20260611022445/https://api.openalex.org/concepts/C179799912 |
| subfield:software-engineering | archived | https://web.archive.org/web/20260611022625/https://api.openalex.org/concepts/C115903868 |
| subfield:computer-vision | archived | https://web.archive.org/web/20260611022801/https://api.openalex.org/concepts/C31972630 |
| subfield:natural-language-processing | archived | https://web.archive.org/web/20260611022920/https://api.openalex.org/concepts/C204321447 |
| subfield:human-computer-interaction | archived | https://web.archive.org/web/20260611023109/https://api.openalex.org/concepts/C107457646 |
| subfield:cryptography | archived | https://web.archive.org/web/20260611023235/https://api.openalex.org/concepts/C178489894 |
| subfield:computer-security | archived | https://web.archive.org/web/20260611023415/https://api.openalex.org/concepts/C38652104 |
| subfield:theoretical-computer-science | archived | https://web.archive.org/web/20260611023536/https://api.openalex.org/concepts/C80444323 |
| subfield:information-retrieval | archived | https://web.archive.org/web/20260611023739/https://api.openalex.org/concepts/C23123220 |
| subfield:knowledge-organization | archived | https://web.archive.org/web/20260611023908/https://api.openalex.org/concepts/C2779810430 |
| subfield:digital-libraries | archived | https://web.archive.org/web/20260611024131/https://api.openalex.org/concepts/C513874922 |
| subfield:bibliometrics | archived | https://web.archive.org/web/20260611024435/https://api.openalex.org/concepts/C178315738 |
| subfield:social-computing | archived | https://web.archive.org/web/20260611024749/https://api.openalex.org/concepts/C74216064 |
| subfield:history-of-computing | archived | https://web.archive.org/web/20260611025811/https://api.openalex.org/concepts/C2778653333 |
| field:computer-science | archived | https://web.archive.org/web/20260611030113/https://api.openalex.org/concepts/C41008148 |
| subfield:computer-networks | archived | https://web.archive.org/web/20260611030448/https://api.openalex.org/concepts/C31258907 |
| subfield:artificial-intelligence | archived | https://web.archive.org/web/20260611030915/https://api.openalex.org/concepts/C154945302 |
| subfield:visualization | archived | https://web.archive.org/web/20260611031238/https://api.openalex.org/concepts/C36464697 |
| subfield:machine-learning | archived | https://web.archive.org/web/20260611031540/https://api.openalex.org/concepts/C119857082 |
| subfield:algorithms-and-data-structures | archived | https://web.archive.org/web/20260611031834/https://api.openalex.org/concepts/C34628019 |
| subfield:programming-languages | archived | https://web.archive.org/web/20260611032210/https://api.openalex.org/concepts/C18701968 |
| subfield:computer-graphics | archived | https://web.archive.org/web/20260611032449/https://api.openalex.org/concepts/C77660652 |
| subfield:formal-languages-and-automata-theory | archived | https://web.archive.org/web/20260611032730/https://api.openalex.org/concepts/C116248031 |
| sci-comp-search | **[SPN-FAILED]** | save_http=000 (throttle) — next-session retry queue |
| quantum-search | **[SPN-FAILED]** | save_http=000 (throttle) — next-session retry queue |
| sci-comp-concept | **[SPN-FAILED]** | save_http=000 (throttle) — next-session retry queue |

**Success rate: 23/26 (88.5%) — all 23 written nodes' concept evidence URLs archived (100%);** the 3 failures are
measurement-only URLs (the 2 search queries — SPN rejected the querystring URLs under throttle — and the C459310
measurement concept). The re-audit path does not depend on SPN: `as_of` + entity URL remain the primary
re-query keys; snapshots are reinforcement, per the standing rule.
