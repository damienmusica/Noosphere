# B-track settlement — openalex-humanities-prevalidation-v1

**Session #24** (humanities-remainder round 3, session B). Standing policy (decision (27),
no per-item gate) + concurrent prevalidate ((34)⑥(b)/(38)). **Date:** 2026-06-18. Live network
(maintainer-local). Scope: the **44 new humanities reviewed nodes** (6 fields + 38 subfields)
× OpenAlex Concepts API — all carried `external_ids.wikidata`, none had `external_metrics`.

## Prevalidation (`npm run foundry:openalex-prevalidate -- --nodes <44> --concurrency 6`)

First-pass verdicts: **rank1_clean 33 / manual_candidate 4 / object_concept 7 / absent 0**
(strict rank-1 **75%**, 33/44).

**Escalation triggers (decision (27)) — none fired:**
- **(i) rank-1 precision <70%?** No — 75% (33/44). Below the 76–81% band but above the <70%
  guide; and the shortfall is entirely the *expected* humanities anomaly the session order
  predicted (general concepts masking discipline concepts in history/literature/religion), not a
  precision regression. Counting the 4 manual accepts (all clean QID round-trips), discipline-concept
  recovery is **37/44 = 84%**.
- **(ii) novel anomaly?** No — every off-rank case is a **known class** already handled by standing
  rules: broad/narrow duplicate-link (bare-QID/`search` returns a narrow object twin — medicine/cogsci
  precedent) and object/era/homonym masking. No new variance type.
- **(iii) upstream change?** No — OpenAlex Concepts API responding normally, tagging intact.
- **(iv) schema/policy change?** No — same `external_ids.openalex` + `external_metrics.openalex` write.

→ **No-gate write in the same session** (standing policy (27)).

## Rulings (orchestrator)

### Written — 37 (live re-query at write, drift 0)

- **33 rank1_clean** — `search` rank-1 concept whose wikidata round-trips to the node QID.
- **4 manual** — orchestrator picked the discipline concept over the first-pass row:
  - `paleography` → C60940604 "Palaeography" (direct QID round-trip Q179957; `search` empty).
  - `sociolinguistics` → C28519872 "Sociolinguistics" (direct Q160845; `search` rank-1 was the
    narrower "Social network (sociolinguistics)").
  - `psycholinguistics` → C89267518 "Psycholinguistics" (direct Q179488; `search` rank-1 was the
    object "TRACE (psycholinguistics)", a model).
  - `rhetoric` → C1370556 "Rhetoric" (Q81009, the L2 discipline concept) over the direct
    "Political rhetoric" C2994509466 — **both carry Q81009** (OpenAlex double-tag), search-side
    discipline selection per standing rule.
- **Live re-query at write time: QID round-trip 37/37 · display-name match 37/37 · drift 0.**
  `as_of` = 2026-06-18; recorded `external_ids.openalex` + `external_metrics.openalex`
  {works_count, cited_by_count, as_of, entity}.

### Honest gaps — 7 (no QID-matched discipline concept; recorded, not forced)

The session order's predicted humanities anomaly — general concept / era / object homonym masks the
discipline, and no OpenAlex concept carries the node's deliberately-chosen QID:

| node | QID | what OpenAlex offered | why gapped |
|---|---|---|---|
| `field:history` | Q1066186 | "History" C95457728 is **Q309** (the-past, L0) | QID mismatch — node deliberately uses Q1066186 *study-of-history* over Q309 (session #23 §12); writing Q309's concept = drift |
| `subfield:medieval-history` | Q27992545 | "Medieval history" C2994348062 is **Q12554** (the era) | era-vs-discipline; QID mismatch |
| `subfield:social-history` | Q908604 | "Social history (medicine)" Q7551154 | object homonym (patient social history) |
| `subfield:morphology` | Q38311 | "Morphology (biology)" Q183252 | homonym (biology); no QID-matched linguistics-morphology concept |
| `subfield:semantics` | Q39645 | "Semantics (computer science)" Q1437428 | homonym (CS); no QID-matched linguistic-semantics field |
| `field:literary-studies` | Q208217 | "Genre analysis" Q5533546 | no discipline concept carries Q208217 (enwiki/OpenAlex conflate literary studies into criticism/genre) |
| `subfield:practical-theology` | Q1383443 | "Missiology" Q910375 | adjacent discipline, not practical theology; QID mismatch |

These mirror the medicine-B "no-concept" gaps (forensic-medicine/health-policy) — honest, reversible,
re-auditable; not forced to preserve drift 0. Domain node (`domain:humanities`) out of scope
(domain-level metrics are not the convention).

## Result

**37 written / 7 honest gaps / 0 triggers fired / drift 0.** Triangulation
**251 → 288 / 427 = 67.4%** (was 65.7%). Humanities continent B-track debt = 0 (every new
reviewed node either carries verified metrics or a documented honest gap).
