# OpenAlex STEM pre-validation report — matching-precision measurement

**Batch:** openalex-stem-prevalidation-v1 (measurement report only — **no /data or schema changes**)
**Policy basis:** OpenAlex field design, 5 clauses CPO-ratified 2026-06-11 (vault decision log (18)):
`external_metrics` additive/optional · provider namespace + native API key names · `as_of` + entity
URL mandatory · two-stage matching (verified entity ID first, metrics read only by that ID) ·
interpretation downstream, validation structural-only, lookups maintainer-local.
**Performed by:** Claude Fable 5 (claude-fable-5), orchestrator context, 2026-06-11. This is a
source-interpretation/measurement task, not candidate-content generation — ADR 0007
generation↔QC separation does not apply (per session order); all verdict evidence is recorded
below for re-audit.
**Method:** local ad-hoc calls to the public OpenAlex API (api.openalex.org, no key, polite-pool
`mailto` parameter). No scripts committed (pit-stop principle — resolver-ization only if this
measurement shows the need). **as_of for every count in this report: 2026-06-11.**

## Sample

All **42** formal-sciences `reviewed` division nodes in /data (1 domain + 3 fields + 38 subfields).
Concept/method nodes excluded by design (division matching first). Every sampled node carries a
resolver-verified Wikidata QID — the QID is the matching key under ratified design clause (4).

## What was measured

For each node, candidates were collected from **both OpenAlex classification systems**:

- **Topics hierarchy (current):** domains (4) and fields (26) fetched in full; subfields fetched in
  full (252); topics queried via `/topics?search=<label>` (top 5, with description, keywords, and
  parent chain).
- **Legacy Concepts:** direct lookup `/concepts/wikidata:<QID>` (deterministic, keyed by our
  verified QID) plus `/concepts?search=<label>` (top 3) as a rank cross-check.

Identity verdicts use multi-signal discipline (decision log (9) — never label-match alone):
display_name + description + parent chain/level + (for load-bearing topic verdicts) top-cited
works sample. Verdict classes: **rank-1 exact** / **manual-selection needed (ambiguous)** /
**absent**.

## Headline precision by OpenAlex entity type

| OpenAlex type | sample evaluated | rank-1 exact | manual/ambiguous | absent |
|---|---|---|---|---|
| **Legacy Concept** (QID-keyed) | 42 | **34 (81%)** | 4 (10%) | 4 (10%) |
| Topics: domain level | 1 (our domain node) | 0 | 0 | 1 |
| Topics: field level | 3 (our field nodes) | 1 (mathematics) | 1 (statistics → composite subfield) | 1 (systems-science) |
| Topics: subfield level | 38 (our subfields) | **3 (8%)** | 6 (16%, composite buckets) | 29 (76%) |
| Topics: topic level | 42 | **2 (5%)** | 22 (52%) | 18 (43%) |

**Reading:** the legacy Concepts layer is the only OpenAlex surface that matches our
field/subfield granularity — and it is keyed by the QIDs we already verified. The current Topics
hierarchy fails structurally at our granularity (details below).

## Structural findings — Topics hierarchy

1. **Domain level:** OpenAlex has exactly 4 domains (Physical / Life / Health / Social Sciences,
   fetched live). No formal-sciences domain exists; mathematics sits under Physical Sciences.
2. **Field level:** of our 3 fields, only `field:mathematics` ↔ field 26 "Mathematics"
   (works_count 4,675,737, cited_by_count 44,813,331). "Statistics" and "Systems Science" do not
   exist at field level.
3. **Subfield level is pruned ASJC:** field 26 carries only **10 subfields** (2602, 2604, 2605,
   2607, 2608, 2610–2614). ASJC's Analysis (2603), Control and Optimization (2606), Logic (2609)
   are **not present** in OpenAlex. Whole branches of our skeleton (all of analysis, all of logic)
   have no subfield-level counterpart at all. Several existing subfields are composite buckets
   ("Algebra and Number Theory", "Geometry and Topology", "Statistics and Probability") that can
   only ever be partial matches for our single-discipline nodes.
4. **Topic level is paper clusters, not disciplines:** topics are machine-built publication
   clusters whose names carry research-frontier qualifiers ("Advanced Topics in Algebra",
   "Nonlinear Partial Differential Equations") or application slices (game theory splits into
   evolutionary/voting/network-applications clusters across 3 different fields). Parent-chain
   anomalies are common: "Advanced Differential Geometry Research" hangs under Astronomy and
   Astrophysics < Physics; "History and Theory of Mathematics" under Theoretical Computer
   Science. Homonym traps surface immediately ("Functional Analysis" top results are behavioral
   psychology and genomics; "Set Theory" pulls multi-criteria decision making; "Category Theory"
   pulls gender studies).
5. Only 2/42 topics survived the multi-signal + works-sample test as genuinely *being* the
   discipline's core research cluster: T11049 "Advanced Harmonic Analysis Research" (top works:
   Hp spaces, Calderón–Zygmund-line classics) and T10948 "Advanced Combinatorial Mathematics"
   (top works: *Analytic Combinatorics*, *Tilings and Patterns*).

## Structural findings — legacy Concepts

1. **QID-keyed lookup works and is precise:** 36/42 nodes resolve via `/concepts/wikidata:<QID>`;
   34 pass full identity QC. The two-stage matching design (clause 4) maps directly onto this
   endpoint.
2. **Duplicate-QID quirk (measured, 1 case):** Q141495 (optimization) is claimed by **two**
   concepts — C126255220 "Mathematical optimization" (level 1, works 2,407,827) and C2989189746
   "Function optimization" (level 3, works 1,386). The `wikidata:` endpoint returns the *wrong,
   tiny* one. ⇒ **QID lookup alone is not sufficient evidence**; display_name/description/level
   cross-check is mandatory (same discipline as sitelink+alias for QIDs).
3. **Mislabeled entity (1 case):** Q193756 (complex analysis) resolves to C107837686 whose
   description is complex analysis ("branch of mathematics studying functions of a complex
   variable") but whose display_name is "Complex-valued function" (level 3, works 1,427). No
   plain "Complex analysis" concept exists. Manual-selection territory.
4. **QID-granularity mismatches (2 cases):** our `differential-equations` (Q28575007, plural
   class) misses, but C78045399 "Differential equation" (Q11214, works 367,426) is the same
   subject under the singular QID; our `time-series-analysis` (Q11850042) misses, with
   C151406439 "Time series" (Q186588, works 305,984) as the nearest concept — an object-vs-field
   distinction our node deliberately makes, so this is manual-selection, not auto-acceptable.
5. **True absences (4):** no general-discipline concept exists for Calculus (the only
   high-volume "Calculus" concept is **dental calculus**, Q144037, works 1,048,810 — a homonym
   trap that label-matching would have walked into), Algebra, Topology (top label hits are
   circuit topology and point-set vocabulary terms), or Applied Statistics.
6. **Freshness verified empirically:** concepts are still being assigned at full volume to new
   works — works tagged C33923547 (Mathematics) by publication year: 2022: 1,224,993 · 2024:
   1,071,930 · 2025: 1,128,085 · 2026 (partial year): 1,351,922. The docs pages
   (docs.openalex.org) could not be content-verified locally (JS shell — recorded honestly), so
   the "legacy/deprecated" status of Concepts rests on the system's own labeling of Topics as
   current; the data itself shows no freeze as of 2026-06-11.
7. **works_count semantics caveat (interpretation downstream, but recorded):** concept tagging is
   multi-label at all hierarchy levels — level-0/1 concepts are inflated (Geometry 9.36M,
   Mathematical analysis 8.54M works) relative to specific level-2/3 concepts (Set theory 73k,
   Model theory 11.8k). For the same year, concept "Mathematics" tags ~10× more works than
   `primary_topic.field` Mathematics (2025: 1,128,085 vs 138,882). Cross-node comparison of raw
   counts therefore reflects tagging breadth as much as field size — consistent with the ratified
   risk acceptance (decision log (18)); counts are recorded raw with `as_of`, interpretation
   stays downstream.

## Per-node verdict table — legacy Concepts (QID-keyed)

Verdict R = rank-1 exact · M = manual-selection needed · A = absent. Counts as_of 2026-06-11.
Entity URL = `https://openalex.org/<concept id>`; API evidence URL =
`https://api.openalex.org/concepts/wikidata:<QID>`.

| node | QID | verdict | concept | works_count | cited_by_count | note |
|---|---|---|---|---|---|---|
| domain:formal-sciences | Q816264 | R | C119026595 "Formal science" (lvl 2) | 469 | 7,143 | identity exact; tiny corpus, level anomaly (lvl 2) — magnitude caveat |
| field:mathematics | Q395 | R | C33923547 "Mathematics" (lvl 0) | 44,645,324 | 435,581,178 | |
| field:statistics | Q12483 | R | C105795698 "Statistics" (lvl 1) | 12,083,352 | 148,370,102 | |
| field:systems-science | Q2167061 | R | C117847474 "Systems science" (lvl 2) | 4,276 | 40,266 | |
| subfield:linear-algebra | Q82571 | R | C139352143 "Linear algebra" (lvl 2) | 22,966 | 361,023 | label-search rank-1 is "Basis (linear algebra)" — QID lookup beats label search |
| subfield:probability-theory | Q5862903 | R | C122203268 "Probability theory" (lvl 2) | 36,628 | 280,052 | |
| subfield:calculus | Q149972 | **A** | — | — | — | only high-volume "Calculus" is dental calculus Q144037 (1,048,810 works) — homonym trap; fractional/multivariable/propositional exist, general calculus absent |
| subfield:optimization | Q141495 | **M** | C126255220 "Mathematical optimization" (lvl 1) | 2,407,827 | — | duplicate-QID quirk: `wikidata:Q141495` returns C2989189746 "Function optimization" (lvl 3, 1,386 works); correct entity requires manual selection |
| subfield:mathematical-logic | Q1166618 | R | C47884741 "Mathematical logic" (lvl 2) | 40,670 | 67,076 | |
| subfield:algebra | Q3968 | **A** | — | — | — | no general-algebra concept ("Algebra over a field" Q1000660 etc. only) |
| subfield:number-theory | Q12479 | R | C169654258 "Number theory" (lvl 2) | 35,510 | 171,451 | |
| subfield:geometry | Q8087 | R | C2524010 "Geometry" (lvl 1) | 9,362,423 | 123,509,943 | lvl-1 inflation caveat |
| subfield:differential-geometry | Q188444 | R | C192939610 "Differential geometry" (lvl 2) | 82,585 | 517,977 | |
| subfield:algebraic-geometry | Q180969 | R | C68363185 "Algebraic geometry" (lvl 2) | 33,496 | 311,280 | |
| subfield:topology | Q42989 | **A** | — | — | — | no general-topology concept; label search returns circuit topology (899,005 works) + point-set vocabulary terms |
| subfield:algebraic-topology | Q212803 | R | C145054310 "Algebraic topology" (lvl 3) | 6,475 | 64,215 | |
| subfield:mathematical-analysis | Q7754 | R | C134306372 "Mathematical analysis" (lvl 1) | 8,540,939 | 114,748,037 | lvl-1 inflation caveat |
| subfield:complex-analysis | Q193756 | **M** | (C107837686 "Complex-valued function", lvl 3) | 1,427 | 4,691 | description matches complex analysis, display_name does not; no plain "Complex analysis" concept exists — manual decision whether to accept the mislabeled entity |
| subfield:functional-analysis | Q190549 | R | C55112680 "Functional analysis" (lvl 3) | 43,625 | 394,071 | |
| subfield:harmonic-analysis | Q876215 | R | C131770355 "Harmonic analysis" (lvl 2) | 65,298 | 474,078 | |
| subfield:differential-equations | Q28575007 | **M** | (C78045399 "Differential equation", **Q11214**) | 367,426 | — | QID-granularity mismatch (plural-class vs singular); same subject under different QID — manual selection |
| subfield:partial-differential-equations | Q271977 | R | C93779851 "Partial differential equation" (lvl 2) | 253,344 | 3,373,012 | |
| subfield:dynamical-systems | Q3174497 | R | C79379906 "Dynamical systems theory" (lvl 2) | 135,155 | 1,563,245 | name variant, same QID — accepted (alias discipline) |
| subfield:combinatorics | Q76592 | R | C114614502 "Combinatorics" (lvl 1) | 4,296,208 | 44,204,098 | lvl-1 inflation caveat |
| subfield:set-theory | Q12482 | R | C153046414 "Set theory" (lvl 3) | 73,131 | 182,135 | |
| subfield:model-theory | Q467606 | R | C47030870 "Model theory" (lvl 2) | 11,810 | 29,687 | |
| subfield:proof-theory | Q852732 | R | C2318724 "Proof theory" (lvl 3) | 14,954 | 77,425 | |
| subfield:computability-theory | Q818930 | R | C111142201 "Computability theory" (lvl 2) | 2,123 | 29,167 | |
| subfield:category-theory | Q217413 | R | C54884031 "Category theory" (lvl 2) | 7,756 | 58,590 | |
| subfield:numerical-analysis | Q11216 | R | C48753275 "Numerical analysis" (lvl 2) | 266,498 | 2,063,928 | |
| subfield:mathematical-physics | Q156495 | R | C37914503 "Mathematical physics" (lvl 1) | 1,215,471 | 18,495,422 | |
| subfield:applied-mathematics | Q33521 | R | C28826006 "Applied mathematics" (lvl 1) | 2,644,805 | 31,329,167 | |
| subfield:game-theory | Q44455 | R | C177142836 "Game theory" (lvl 2) | 151,913 | 1,918,652 | |
| subfield:information-theory | Q131222 | R | C52622258 "Information theory" (lvl 2) | 53,497 | 521,352 | |
| subfield:financial-mathematics | Q335632 | R | C93373587 "Mathematical finance" (lvl 2) | 8,326 | 175,444 | name variant, same QID — accepted |
| subfield:bayesian-statistics | Q4874481 | R | C101112237 "Bayesian statistics" (lvl 4) | 37,564 | 301,243 | |
| subfield:time-series-analysis | Q11850042 | **M** | (C151406439 "Time series", **Q186588**) | 305,984 | — | nearest concept is the *object* (time series), not the field (analysis) — our node deliberately makes that distinction; manual decision |
| subfield:computational-statistics | Q5157340 | R | C176222170 "Computational statistics" (lvl 2) | 6,044 | 162,929 | |
| subfield:mathematical-statistics | Q745328 | R | C6260981 "Mathematical statistics" (lvl 2) | 17,342 | 252,550 | |
| subfield:history-of-mathematics | Q185264 | R | C72074766 "History of mathematics" (lvl 2) | 4,337 | 24,038 | |
| subfield:mathematical-biology | Q751611 | R | C20129857 "Mathematical and theoretical biology" (lvl 2) | 3,492 | 65,174 | name variant, same QID — accepted |
| subfield:applied-statistics | Q1967088 | **A** | — | — | — | concept search empty ("Statistician", "Economic statistics" only) |

## Per-node verdict table — Topics hierarchy (best candidate at each applicable level)

Levels: D = domain, F = field, S = subfield, T = topic. Entity URLs:
`https://openalex.org/domains/<n>`, `/fields/<n>`, `/subfields/<n>`, `/topics/T<n>`.

| node | best Topics-hierarchy match | verdict | note |
|---|---|---|---|
| domain:formal-sciences | — (D level has only Physical/Life/Health/Social Sciences) | A | structural absence |
| field:mathematics | F 26 "Mathematics" (works 4,675,737, cited 44,813,331) | **R** | the single clean field-level match in the sample |
| field:statistics | S 2613 "Statistics and Probability" (988,732) | M | no field-level entity; nearest is a composite subfield one level down |
| field:systems-science | — | A | nothing relevant at any level (topic search returns library science, electoral systems) |
| subfield:linear-algebra | T10792 "Matrix Theory and Algorithms" (123,769) | M | numerical-linear-algebra flavored cluster, not the subject |
| subfield:probability-theory | S 2613 composite / T13500 "Probability and Statistical Research" (132,165) | M | composite bucket either way |
| subfield:calculus | — | A | topic hits are fractional-calculus/stochastic-calculus slices |
| subfield:optimization | — (application clusters only) | A | discipline sliced across metaheuristics/scheduling/control application topics |
| subfield:mathematical-logic | T11727 "Advanced Algebra and Logic" (76,750) | A | fuzzy-logic/algebra cluster, not mathematical logic |
| subfield:algebra | S 2602 "Algebra and Number Theory" / T11673 "Advanced Topics in Algebra" (88,510) | M | composite bucket / frontier cluster |
| subfield:number-theory | S 2602 composite / T11166 "Analytic Number Theory Research" (60,918) | M | composite / subdiscipline slice |
| subfield:geometry | S 2608 "Geometry and Topology" (833,601) | M | composite bucket |
| subfield:differential-geometry | T13080 "Advanced Differential Geometry Research" (26,942) | M | name matches; parent chain is Astronomy and Astrophysics < Physics — lineage anomaly |
| subfield:algebraic-geometry | T10061 "Algebraic Geometry and Number Theory" (113,752) | M | composite cluster |
| subfield:topology | S 2608 composite / T10304 "Geometric and Algebraic Topology" (86,518) | M | composite either way |
| subfield:algebraic-topology | T10896 "Homotopy and Cohomology in Algebraic Topology" (84,352) | M | subarea slice; parent chain Mathematical Physics |
| subfield:mathematical-analysis | — | A | no analysis subfield exists (ASJC 2603 pruned); topic hits are transform-method slices |
| subfield:complex-analysis | T11822 "Analytic and geometric function theory" (39,805) | M | recognizable CA research cluster under a subarea name |
| subfield:functional-analysis | (T10884 "Holomorphic and Operator Theory", 61,803) | A | top topic hits are behavioral-psychology/genomics homonyms; no FA-proper cluster surfaced |
| subfield:harmonic-analysis | T11049 "Advanced Harmonic Analysis Research" (35,530) | **R** | name + lineage (Applied Mathematics < Mathematics) + works sample (Hp spaces, Hardy spaces, Calderón–Zygmund line) all match |
| subfield:differential-equations | T11416/T10541/T10194 (multiple) | M | discipline split across subtype clusters; no single entity |
| subfield:partial-differential-equations | T10194 "Nonlinear Partial Differential Equations" (61,810) | M | "nonlinear" slice of the subject |
| subfield:dynamical-systems | T10588 "Mathematical Dynamics and Fractals" (88,987) | M | chaos/fractals-flavored cluster |
| subfield:combinatorics | T10948 "Advanced Combinatorial Mathematics" (52,130) | **R** | lineage Discrete Mathematics and Combinatorics < Mathematics; works sample (*Analytic Combinatorics*, *Tilings and Patterns*) confirms |
| subfield:set-theory | T11151 "Advanced Topology and Set Theory" (61,244) | M | composite with model theory/topology |
| subfield:model-theory | T11151 (same composite) | M | appears only inside the composite cluster |
| subfield:proof-theory | — | A | nothing relevant surfaced |
| subfield:computability-theory | T12002 "Computability, Logic, AI Algorithms" (106,805) | M | composite with algorithmic information theory |
| subfield:category-theory | — | A | closest hits are composite algebra clusters; "category" homonym pulls gender studies |
| subfield:numerical-analysis | S 2612 "Numerical Analysis" (243,104) | **R** | exact subfield match |
| subfield:mathematical-physics | S 2610 "Mathematical Physics" (679,326) | **R** | exact subfield match; topic level splits into spectral/dispersive slices |
| subfield:applied-mathematics | S 2604 "Applied Mathematics" (884,429) | **R** | exact subfield match; topic search returns 0 |
| subfield:game-theory | T11252/T10991/T11031 (three clusters) | M | sliced by application domain across 3 different fields |
| subfield:information-theory | (T12002 composite) | A | no information-theory-proper cluster surfaced |
| subfield:financial-mathematics | T10067 "Stochastic processes and financial applications" (120,060) | M | found only via a *different* query (search recall failure for the node's own label) |
| subfield:bayesian-statistics | — | A | search returns measurement-uncertainty metrology cluster |
| subfield:time-series-analysis | T12205 "Time Series Analysis and Forecasting" (47,222) | M | name exact but lineage Signal Processing < Computer Science |
| subfield:computational-statistics | — | A | search returns 0 |
| subfield:mathematical-statistics | — | A | search returns 0 |
| subfield:history-of-mathematics | T12170 "History and Theory of Mathematics" (286,610) | M | composite with education/philosophy; lineage Theoretical Computer Science — anomaly |
| subfield:mathematical-biology | T11829 "Mathematical Biology Tumor Growth" (38,227) | M | tumor-growth slice of the subject |
| subfield:applied-statistics | — | A | nothing relevant |

(Subfield-level tallies in the headline table count each node at its own natural level; the
rank-1 subfield matches applied-mathematics / mathematical-physics / numerical-analysis are the
3/38. R verdicts in this table: mathematics (field), harmonic-analysis + combinatorics (topic),
applied-mathematics + mathematical-physics + numerical-analysis (subfield).)

## Recommendation

1. **Topics hierarchy: do not adopt for node identity mapping.** At our field/subfield
   granularity it is structurally lossy (76% absent at subfield level, 43% absent + 52%
   ambiguous at topic level; composite buckets; lineage anomalies; homonym traps). Its single
   reliable hit (field 26 Mathematics) is not worth a provider sub-namespace. Topics remain
   useful later as *works-level* filters (e.g., counting a discipline's output via
   `primary_topic`), which is a different, downstream use.
2. **Legacy Concepts: recommend adoption, with mandatory multi-signal QC.** 81% rank-1 via the
   QIDs we already verified; deterministic lookup endpoint; empirically still assigned to
   2025/2026 works at full volume. Mandatory discipline for the implementation gate:
   - `wikidata:` lookup alone is **not** sufficient evidence (duplicate-QID quirk measured —
     Q141495); display_name + description + level cross-check required per node, recorded.
   - The 4 manual-selection cases resolve per the decision-log-(9) manual-verification path
     (optimization → C126255220 is the obvious manual pick; complex-analysis /
     differential-equations / time-series-analysis need explicit accept-or-skip decisions).
   - The 4 absent cases simply carry no OpenAlex entity (honest gap, like the PhilPapers
     upstream gaps) — no metrics for them.
3. **Proposed shape for the implementation gate (next session, after CPO reads this):** add
   verified OpenAlex Concept IDs to `external_ids` for the 34 rank-1 nodes, then write
   `external_metrics.openalex = { works_count, cited_by_count, as_of, entity_url }` per ratified
   design clauses (1)–(3). The works_count-semantics caveat (level-dependent tagging breadth,
   §legacy-Concepts finding 7) should ride along as a documented caveat, not a computed label.
4. **No resolver build yet** (pit-stop principle): the measured failure modes (duplicate QID,
   mislabel, granularity mismatch) are all caught by the multi-signal QC above at n=42 scale.
   If the next continents push concept-matching volume up, the QC checklist here is the spec
   for a resolver v4 extension.

---

## Implementation append (2026-06-11, session #7) — ratified gate executed

**Policy basis:** implementation ratified by the CPO 2026-06-11 (vault decision log (20)), schema
landed as `external_metrics` (additive optional; PR #45). This append is the permanent per-node
record of the data pass.

**Method:** every count was **re-queried live** on 2026-06-11 (api.openalex.org, polite-pool
`mailto`, maintainer-local, no committed scripts) — numbers were *not* copied from the verdict
table above. Lookups were keyed **only by the verdict table's Concept IDs** (never by QID, per the
Q141495 duplicate-link finding; never by label, per the dental-calculus trap). Every response was
re-cross-checked before writing: response ID round-trips the requested Concept ID, `display_name`
matches the verdict table, the concept's own `wikidata` value matches the node's resolver-verified
QID, and `level` matches. **34/34 rank-1 nodes passed all signals**; same-day counts matched the
table exactly (no drift, as expected for a same-day re-query).

**Written to /data (36 nodes):** the 34 rank-1 nodes plus 2 accepted manual cases, each receiving
`external_ids.openalex` (verified Concept ID) and
`external_metrics.openalex = { works_count, cited_by_count, as_of: "2026-06-11", entity }`.

### Manual-case verdicts (decision-log-(9) path, live evidence, permanent record)

1. **subfield:optimization → C126255220 "Mathematical optimization" — ACCEPT.** Live re-fetch:
   display_name "Mathematical optimization", description "study of mathematical algorithms for
   optimization problems", level 1, works 2,407,827, cited_by 36,901,800, and the concept's own
   `wikidata` field is **Q141495 = the node's verified QID**. All signals align; the duplicate-QID
   quirk is a defect of the `wikidata:` *lookup endpoint* (which returns C2989189746), not of this
   entity. The verdict table already called it the obvious manual pick.
2. **subfield:complex-analysis → C107837686 "Complex-valued function" — SKIP (honest gap).** Live
   re-fetch confirms the split signals: description ("branch of mathematics studying functions of a
   complex variable") and wikidata (Q193756 = our QID) say *field*; display_name
   ("Complex-valued function"), level 3, and works 1,427 say *object-granularity entity*. Under the
   multi-signal identity discipline a split like this is a failed identity, not a judgment call to
   override: recording it would assert an identity the entity's own display name denies, and would
   attach an object-sliver count (1.4k works — vs 65k for harmonic analysis, a *subarea* of the same
   branch) to a major discipline. No plain "Complex analysis" concept exists. The node joins the
   honest-gap set. Reversible: if OpenAlex relabels the entity upstream, this record is the re-audit
   pointer.
3. **subfield:differential-equations → C78045399 "Differential equation" — ACCEPT.** Live re-fetch:
   display_name "Differential equation", level 2, works 367,426, cited_by 4,648,907. The naming
   pattern (singular object-name for the subject area) is **exactly the accepted rank-1 precedent
   C93779851 "Partial differential equation"** — same level, same tree position, same singular
   naming, and our PDE node likewise carries the equation-object QID. The subject's field has no
   name distinct from its objects ("differential equations" *is* the area name), so no deliberate
   model distinction is collapsed. The QID divergence (concept carries Q11214, singular equation;
   our node carries Q28575007, the plural class) is a Wikidata-side granularity variant, recorded
   here permanently; `external_ids.wikidata` is unchanged.
4. **subfield:time-series-analysis → C151406439 "Time series" — SKIP (honest gap).** Live re-fetch:
   the concept's own description is "**set of data indexed in time order**" — the *data object*,
   not the analysis field. Our node deliberately encodes the field-vs-object distinction (and
   Wikidata maintains both items separately: Q186588 the object vs Q11850042 the field, our node's
   QID). Unlike case 3, accepting here would collapse a distinction our model deliberately draws —
   a false identity regardless of how correlated the tagged literatures are.

### Final distribution

| outcome | count | nodes |
|---|---|---|
| written (rank-1) | 34 | per the verdict table |
| written (manual accept) | 2 | optimization, differential-equations |
| skipped (manual, identity failed) | 2 | complex-analysis, time-series-analysis |
| absent upstream (honest gap, unchanged) | 4 | calculus, algebra, topology, applied-statistics |

/data impact: 36 nodes gain `external_ids.openalex` + `external_metrics.openalex`; no status,
edge, or translation changes. The works_count semantics caveat (level-dependent tagging breadth,
§legacy-Concepts finding 7) remains a documented caveat — raw values recorded as returned;
interpretation stays downstream.
