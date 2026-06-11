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
