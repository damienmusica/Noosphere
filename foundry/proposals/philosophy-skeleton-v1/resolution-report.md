# Ambiguity resolution report — batch:philosophy-skeleton-v1

**Policy:** Promotion policy v1.1, ambiguity-resolution clause (CPO-ratified 2026-06-10, vault decision log (10)): a `proposed` node whose `ambiguous` flag is resolved by external research — ≥2 independent external sources converging on the contested point, every claim URL-cited, resolution recorded as permanent provenance — flips the flag and auto-promotes to `reviewed` under the standing v1 rules. Diverging sources → stays unresolved.

**Collection:** 5 Sonnet research subagents (claude-sonnet-4-6, WebSearch/WebFetch), separated contexts, 2026-06-10.
**Verdicts:** Claude Fable 5 (claude-fable-5), orchestrator/QC context, 2026-06-10. Generation↔QC separation maintained (ADR 0007): subagents collected and recommended; the orchestrator judged.

**URL verification:** every URL cited below was HTTP-verified live by the orchestrator on 2026-06-10 (SEP 31/31 → 200, IEP 12/12 → 200, journals/programs → 2xx/3xx). PhilPapers blocks non-browser clients (uniform HTTP 403), so PhilPapers category claims are cross-confirmed via (a) D. Chalmers' taxonomy — the documented basis of the PhilPapers category system — at <https://consc.net/taxonomy.html> (→ 200), and/or (b) Wayback Machine snapshots of the browse pages. PhilPapers URLs below carry the marker *[bot-blocked; cross-confirmed]*.

**Scope of resolution (node-only skeleton):** the skeleton has nodes and no edges. A flag is resolved when external sources ground (1) the item as a recognized, distinctly named area of philosophy warranting its own node at subfield granularity, and (2) its `academic_status` value. Hierarchical placement (peer-of vs sub-area-of) is **deferred to the edge phase**; what sources say about placement is recorded below as input to that phase, not as part of the verdict.

**Outcome: 30 resolved → promoted `reviewed` / 3 unresolved → remain `proposed`.**

---

## Resolved — granularity / peer-status cluster (8)

### subfield:ontology — RESOLVED
- Contested: peer subfield vs sub-area of metaphysics.
- SEP treats ontology as a distinctly named branch with its own literature: <https://plato.stanford.edu/entries/metaphysics/>, <https://plato.stanford.edu/entries/logic-ontology/>
- Chalmers/PhilPapers taxonomy carries an Ontology category (filed under Metaphysics): <https://consc.net/taxonomy.html>
- Placement input for edge phase: reference taxonomies file ontology under metaphysics; skeleton keeps it peer-level per ratified policy (decision log 2026-06-10 (5)). academic_status: keep `established`.

### subfield:philosophy-of-perception — RESOLVED
- Contested: distinct area vs sub-area of philosophy of mind.
- Multiple dedicated SEP entries: <https://plato.stanford.edu/entries/perception-problem/>, <https://plato.stanford.edu/entries/perception-episprob/>
- Chalmers/PhilPapers taxonomy has a named Philosophy of Perception category: <https://consc.net/taxonomy.html>
- Placement input: taxonomies file it under philosophy of mind; deferred. academic_status: keep `established`. (QID Q3300457 upstream-vandalism note was closed in PR #23 — QID accurate.)

### subfield:philosophy-of-social-science — RESOLVED
- Contested: distinct area vs scope-overlap with social philosophy / philosophy of economics.
- IEP standalone field entry: <https://iep.utm.edu/soc-sci/>
- PhilPapers dedicated category *[bot-blocked; cross-confirmed via Chalmers]*: <https://philpapers.org/browse/philosophy-of-social-science>, <https://consc.net/taxonomy.html>
- academic_status: keep `established`.

### subfield:philosophy-of-history — RESOLVED
- Contested: peer subfield vs specialization under philosophy of social science.
- Dedicated SEP entry: <https://plato.stanford.edu/entries/history/>; dedicated IEP entry: <https://iep.utm.edu/history/>
- Placement input: PhilPapers files it under philosophy of social science; SEP/IEP treat it standalone; deferred. academic_status: keep `established`.

### subfield:philosophy-of-economics — RESOLVED
- Contested: peer subfield vs sub-area of philosophy of social science.
- Dedicated SEP entry: <https://plato.stanford.edu/entries/economics/>
- Chalmers/PhilPapers taxonomy carries a Philosophy of Economics category: <https://consc.net/taxonomy.html>
- Placement input: PhilPapers files it under philosophy of social science; deferred. academic_status: keep `established`.

### subfield:metaphilosophy — RESOLVED
- Contested: distinct subfield vs a dimension of every subfield.
- Dedicated IEP entry: <https://iep.utm.edu/con-meta/>
- Chalmers/PhilPapers taxonomy carries a Metaphilosophy category: <https://consc.net/taxonomy.html>; dedicated journal *Metaphilosophy* (Wiley, since 1970; publisher page bot-blocked: <https://onlinelibrary.wiley.com/journal/14679973>)
- academic_status: keep `established`.

### subfield:hermeneutics — RESOLVED
- Contested: peer subfield vs sub-movement of continental philosophy.
- Dedicated SEP entry describing hermeneutics as a distinct philosophical field with uptake beyond the continental tradition: <https://plato.stanford.edu/entries/hermeneutics/>
- IEP coverage (Gadamer, universalized hermeneutics): <https://iep.utm.edu/gadamer/>
- Placement input: PhilPapers files it under continental philosophy; deferred. academic_status: keep `established`.

### subfield:scholasticism — RESOLVED
- Contested: distinct named tradition vs subset/synonym of medieval philosophy; `historical` status.
- Britannica dedicated entry (distinct method-defined tradition): <https://www.britannica.com/topic/Scholasticism>
- SEP medieval-philosophy entry covers the scholastic method within a broader field whose scope (Byzantine/Arabic/Jewish traditions) exceeds scholasticism — i.e., the two are not synonyms: <https://plato.stanford.edu/entries/medieval-philosophy/>
- The tradition's reach extends past the medieval period (PhilPapers "Early Modern Scholasticism" category *[bot-blocked; sighted in search results]*). academic_status: keep `historical` (revival currents exist but no live mainstream research program).

## Resolved — traditions/movements cluster (5)

### subfield:analytic-philosophy — RESOLVED
- Contested: tradition/methodology as a subfield-level unit.
- Dedicated IEP entry: <https://iep.utm.edu/analytic-philosophy/>
- Departmental field listing (example: University of Washington): <https://phil.washington.edu/fields/analytic-philosophy>; Chalmers/PhilPapers taxonomy carries named analytic-philosophy categories: <https://consc.net/taxonomy.html>
- academic_status: keep `established`. Tradition-axis-at-subfield-level policy already ratified (decision log (5)); external grounding confirms this item.

### subfield:continental-philosophy — RESOLVED
- Contested: contested label; tradition as a subfield-level unit.
- IEP maintains Continental Philosophy as a named tradition category: <https://iep.utm.edu/category/traditions/continental/>
- SPEP lists ~79 graduate programs in/supporting the area: <https://www.spep.org/resources/graduate-programs/>; Chalmers taxonomy carries the category: <https://consc.net/taxonomy.html>
- academic_status: keep `established`. The intra-tradition naming dispute does not undermine institutional usage.

### subfield:phenomenology — RESOLVED
- Contested: subfield vs sub-subfield (between continental tradition and philosophy of mind).
- SEP entry treats phenomenology as a core philosophical discipline: <https://plato.stanford.edu/entries/phenomenology/>
- Active dedicated journal (*Phenomenology and the Cognitive Sciences*, Springer): <https://link.springer.com/journal/11097>; Chalmers taxonomy category: <https://consc.net/taxonomy.html>
- Placement input: dual relation (continental tradition + philosophy of mind) is an edge-phase question. academic_status: keep `established`.

### subfield:existentialism — RESOLVED
- Contested: historical movement vs ongoing research subfield (`historical` vs `established`).
- SEP entry documents ongoing contemporary research directions and active scholarship: <https://plato.stanford.edu/entries/existentialism/>
- SPEP (covering existential philosophy) runs active annual conferences and program listings: <https://www.spep.org/resources/graduate-programs/>
- academic_status: keep `established` — live research activity is documented; the *movement* being historically complete does not make the *research area* historical.

### subfield:critical-theory — RESOLVED
- Contested: term diluted by broad appropriation; distinct philosophical unit?
- SEP entry titled "Critical Theory (Frankfurt School)" — the philosophical sense is a recognized, delimited unit: <https://plato.stanford.edu/entries/critical-theory/>
- Dedicated IEP entry: <https://iep.utm.edu/critical-theory-frankfurt-school/>; international consortium of academic programs: <https://directory.criticaltheoryconsortium.org/academic-programs/>
- academic_status: keep `established`. Editorial-phase note: summaries should scope the node to the Frankfurt School/Western-Marxist lineage to fend off the diluted uses.

## Resolved — regional / non-Western cluster (7)

### subfield:buddhist-philosophy — RESOLVED
- Contested: peer subfield vs sub-area of Indian philosophy / religious studies.
- SEP entries treating Buddhist philosophy as a philosophical tradition: <https://plato.stanford.edu/entries/buddha/>, <https://plato.stanford.edu/entries/mind-indian-buddhism/>; IEP: <https://iep.utm.edu/buddha/>
- Dedicated journal (*Journal of Buddhist Philosophy*, SUNY Press): <https://sunypress.edu/Journals/Journal-of-Buddhist-Philosophy>
- Placement input: spans Indian, Chinese, Tibetan, Japanese, Korean traditions → broader than a Indian-philosophy sub-area; deferred. academic_status: keep `established`.

### subfield:jewish-philosophy — RESOLVED
- Contested: LCC files under BM (religion); conflation-with-theology risk.
- Dedicated peer-reviewed journal (*Journal of Jewish Thought and Philosophy*, Brill, since 1991): <https://brill.com/view/journals/jjtp/jjtp-overview.xml?language=en>
- Routledge Philosophy Companions volume: <https://www.routledge.com/The-Routledge-Companion-to-Jewish-Philosophy/Rynhold-Goldschmidt/p/book/9781032693804>; APA-affiliated society (Association for the Philosophy of Judaism): <https://www.theapj.com/about-us/>
- The LCC BM filing is a cataloguing convention, not an academic judgment — matching the original generator note. academic_status: keep `established`.

### subfield:african-philosophy — RESOLVED
- Contested: internal scope debate (Wiredu/Hountondji) → unified subfield?
- SEP entry documents professional recognition (APA et al., since the 1980s): <https://plato.stanford.edu/entries/africana/>
- IEP entry states the existence debate concluded in affirmation: <https://iep.utm.edu/history-of-african-philosophy/>; dedicated journal (*Philosophia Africana*, PSU Press): <https://www.psupress.org/journals/jnls_PhilAf.html>
- An internal scope debate is research activity within a recognized area, not evidence against it. academic_status: keep `established`. (Naming note for editorial phase: SEP's unit is "Africana philosophy"; PhilPapers carries African Philosophy as a subcategory.)

### subfield:japanese-philosophy — RESOLVED
- Contested: recognized but less institutionalized in Western departments.
- Dedicated multi-edition SEP entry: <https://plato.stanford.edu/entries/japanese-philosophy/>
- Professional society coverage (SACP, founded 1967): <https://www.sacpweb.org/about/>; field journal coverage (*Philosophy East and West*, since 1951): <https://uhpress.hawaii.edu/title/pew/>
- Relative Western visibility does not bear on coverage inclusion (project north star). academic_status: keep `established`.

### subfield:korean-philosophy — RESOLVED
- Contested: lower standalone institutional visibility in Western departments.
- Dedicated, actively maintained SEP entry: <https://plato.stanford.edu/entries/korean-philosophy/>
- PhilPapers dedicated category *[bot-blocked; Wayback snapshot 2024-12-03 confirms]*: <https://philpapers.org/browse/korean-philosophy>
- academic_status: keep `established`.

### subfield:latin-american-philosophy — RESOLVED
- Contested: degree of institutional recognition in N. American/European departments.
- Dedicated SEP entry: <https://plato.stanford.edu/entries/latin-american-philosophy/>; dedicated IEP entry: <https://iep.utm.edu/latin-am/>
- academic_status: keep `established`. Translation-driven visibility gap documented by SEP is not absence of the field.

### subfield:comparative-philosophy — RESOLVED
- Contested: subfield vs methodology applied across subfields (goes to node existence).
- IEP entry explicitly defines it as "a subfield of philosophy": <https://iep.utm.edu/comparative-philosophy/>
- SEP coverage: <https://plato.stanford.edu/entries/comparphil-chiwes/>; dedicated journal since 1951 (*Philosophy East and West*): <https://uhpress.hawaii.edu/title/pew/>; dedicated society since 1967 (SACP): <https://www.sacpweb.org/about/>
- Dual subfield+methodology character recorded for the edge phase (cf. philosophy of science precedent). academic_status: keep `established`.

## Resolved — applied / emerging cluster (7)

### subfield:business-ethics — RESOLVED
- Contested: applied-ethics sub-area vs subfield-level unit.
- Dedicated SEP entry: <https://plato.stanford.edu/entries/ethics-business/>
- Dedicated journal (*Business Ethics Quarterly*, Cambridge): <https://www.cambridge.org/core/journals/business-ethics-quarterly>; dedicated society (Society for Business Ethics, founded 1980): <https://sbeonline.org/about-us/our-history/>; Chalmers taxonomy category: <https://consc.net/taxonomy.html>
- Placement input: filed under applied ethics in taxonomies; deferred. academic_status: keep `established`.

### subfield:feminist-philosophy — RESOLVED
- Contested: peer subfield vs cross-cutting methodology.
- SEP dedicated entry (and entry family): <https://plato.stanford.edu/entries/feminist-philosophy/>
- Dedicated journal since 1982 (*Hypatia*): <https://www.cambridge.org/core/journals/hypatia>, <https://hypatiaphilosophy.org/>
- Dual nature (standalone area + lens into other subfields) is an edge-phase modeling input, not a node-level disqualifier. academic_status: keep `established`.

### subfield:experimental-philosophy — RESOLVED (status kept by QC override, see below)
- Contested: "many philosophers reject it as a distinct subfield"; does `emerging` overstate acceptance?
- SEP dedicated entry documents the literature's scale (thousands of PhilPapers-indexed papers, publication in flagship venues): <https://plato.stanford.edu/entries/experimental-philosophy/>
- Chalmers/PhilPapers taxonomy carries an Experimental Philosophy category: <https://consc.net/taxonomy.html>
- The flagged worry (acceptance overstated) is refuted by documented scale and mainstream penetration. academic_status: **keep `emerging`** — the research subagent recommended `established`, but the orchestrator rejected the upgrade: no dedicated journal or society was confirmed, and the strongest "stabilization" claim came from a source rejected by QC (below). Revisit at the next bulk re-audit.

### subfield:philosophy-of-psychiatry — RESOLVED
- Contested: subsumable under bioethics / philosophy of mind; `emerging` status.
- Dedicated SEP entry: <https://plato.stanford.edu/entries/psychiatry/>
- Dedicated graduate programme (KCL MA Philosophy of Medicine and Psychiatry): <https://www.kcl.ac.uk/study/postgraduate-taught/courses/philosophy-of-medicine-and-psychiatry-ma>; Chalmers taxonomy carries Philosophy of Psychiatry and Psychopathology: <https://consc.net/taxonomy.html>
- academic_status: keep `emerging` (journals + specialist MAs, thin standalone-course footprint — exactly the emerging profile).

### subfield:philosophy-of-information — RESOLVED
- Contested: subsumable under philosophy of technology/science; small footprint.
- SEP entry identifies it as a separate branch of philosophy: <https://plato.stanford.edu/entries/information/>
- Dedicated journal venue (*Philosophy & Technology*, Springer): <https://link.springer.com/journal/13347>; Chalmers taxonomy category: <https://consc.net/taxonomy.html>
- academic_status: keep `emerging`.

### subfield:ethics-of-ai — RESOLVED
- Contested: peer subfield vs rapidly growing sub-area of philosophy of technology / computer ethics.
- Dedicated SEP entry — which itself states the field still lacks well-established scope, method, and canonical works, directly grounding `emerging`: <https://plato.stanford.edu/entries/ethics-ai/>
- Dedicated journal (*AI and Ethics*, Springer, since 2021): <https://link.springer.com/journal/43681>
- Placement input: overlap with philosophy of technology recorded for the edge phase. academic_status: keep `emerging`.

### subfield:natural-philosophy — RESOLVED
- Contested: distinct (historical) subfield vs mere historical label for pre-modern science; `historical` status.
- SEP treats natural philosophy as a historical category (predecessor of modern science): <https://plato.stanford.edu/entries/natphil-ren/>
- Britannica dedicated entry: <https://www.britannica.com/science/natural-philosophy>
- academic_status: keep `historical` — exactly the charter posture (dead fields included with status tags, not excluded). Fringe revival literature does not constitute a live institutional field.

## Resolved — domain placement cluster (3)

### subfield:logic — RESOLVED
- Contested: humanities/philosophy placement vs formal sciences.
- SEP: "logic is a branch of mathematics and a branch of philosophy": <https://plato.stanford.edu/entries/logic-classical/>
- Chalmers/PhilPapers taxonomy claims logic as a top-level cluster of the philosophy taxonomy: <https://consc.net/taxonomy.html>
- Philosophy's claim to logic is externally grounded; dual-home reality is the parked cross-listing question (decision log (5)), not a blocker. academic_status: keep `established`.

### subfield:decision-theory — RESOLVED
- Contested: lives equally in economics/statistics/philosophy.
- Dedicated SEP entry (normative/conceptual angle): <https://plato.stanford.edu/entries/decision-theory/>
- Chalmers/PhilPapers taxonomy files Decision Theory (with six+ subcategories) under Philosophy of Action: <https://consc.net/taxonomy.html>
- Philosophy placement grounded; cross-listing parked. academic_status: keep `established`.

### subfield:philosophy-of-religion — RESOLVED
- Contested: overlap with theology/religious studies; placement in secular departments.
- SEP entry: a distinct sub-field of philosophy since the mid-20th century: <https://plato.stanford.edu/entries/philosophy-religion/>
- IEP maintains it as a populated category under Metaphysics & Epistemology: <https://iep.utm.edu/category/m-and-e/religion/>
- academic_status: keep `established`. Departmental politics ≠ taxonomy.

---

## Unresolved — remain `proposed`, flags unchanged (3)

### subfield:social-philosophy — UNRESOLVED
- Sources converge *against* a standalone unit rather than for it: Chalmers/PhilPapers use "Social and Political Philosophy" as the named unit (standalone "Social Philosophy": zero occurrences in the Chalmers taxonomy; the combined unit appears): <https://consc.net/taxonomy.html>. SEP has no standalone overview (treats social topics via e.g. <https://plato.stanford.edu/entries/social-ontology/>); IEP has none either.
- v1.1 cannot flip this flag (no convergent support). Open question for skeleton v2: merge into a social-and-political unit vs keep both for coverage. Recorded as a structural escalation, not silently resolved.

### subfield:modern-philosophy — UNRESOLVED
- The label's scope genuinely conflicts across authorities: SEP usage reserves "Early Modern" for the 17th–18th c. core (<https://plato.stanford.edu/entries/rationalism-empiricism/>); PhilPapers avoids both labels in favor of century-based period categories ("17th/18th Century Philosophy") *[bot-blocked; sighted]*; broad usage stretches "modern" to the early 20th c.
- No convergent external definition of this node's scope exists → stays ambiguous. Revisit when the history-period axis is designed (philosophy level-3 / movement-axis work). QID Q860746 remains a valid identifier for the broad concept.

### subfield:esotericism-and-theosophy — UNRESOLVED
- The node's referent is unresolved, not its evidence: the *academic study* of Western esotericism is demonstrably established — University of Amsterdam HHP centre (<https://hermetica.uva.nl/about-hhp/about-hhp.html>), ESSWE graduate programs incl. a Sorbonne/EPHE chair since 1966 (<https://www.esswe.org/Educational-programs>) — but it is institutionally housed in religious studies, while `non_academic` correctly describes the doctrinal tradition itself.
- Whether this node represents the doctrine-tradition (then `non_academic` stands, but "philosophy" framing weakens) or the study-of field (then `established`, but domain placement shifts) is a modeling/policy decision → escalated, stays `proposed`.

---

## Upstream-gap alternative grounding (2 nodes, foundry-resident)

`subfield:philosophy-of-race` and `subfield:philosophy-of-cognitive-science` have **no Wikidata field item** (upstream gap, closed in PR #24). A research subagent searched for alternative stable identifiers; the orchestrator live-verified. Both remain in the foundry under standing promotion policy v1 (resolver-verified primary grounding required).

**Schema judgment:** no schema change needed — `external_ids` is an open string record in both the foundry and canonical node schemas, so the `philpapers` key is recorded without any extension.
**Negative results (recorded honestly):** OpenAlex has no concept/topic entity for either field (concepts/topics API searches → 0 results). IEP has no dedicated overview article for either.

### subfield:philosophy-of-race — grounding recorded, flag flipped, stays foundry
- PhilPapers category slug **`philosophy-of-race`**, parent "Philosophy of Gender, Race, and Sexuality" (Value Theory cluster). Direct fetch bot-blocked; existence and parentage verified via Wayback snapshot (2024-12-06): <https://web.archive.org/web/20241206133442/https://philpapers.org/browse/philosophy-of-race/>; also present in Chalmers' taxonomy: <https://consc.net/taxonomy.html>
- Recognition (verified): SEP entries <https://plato.stanford.edu/entries/race/> and <https://plato.stanford.edu/entries/critical-phil-race/>; dedicated journal *Critical Philosophy of Race* (PSU Press): <https://www.psupress.org/Journals/jnls_CPR.html>, <https://muse.jhu.edu/journal/595>; *The Oxford Handbook of Philosophy and Race* (OUP).
- Verdict: the distinctness contest is resolved — recognized, distinctly named subfield. No promotable grounding under v1.

### subfield:philosophy-of-cognitive-science — grounding recorded, flag flipped, stays foundry
- PhilPapers category slug **`philosophy-of-cognitive-science`**, filed in the "Science, Logic, and Mathematics" cluster — structurally separate from Philosophy of Mind (filed under "Metaphysics and Epistemology"), which directly answers the duplication concern. Wayback snapshot (2025-01-19): <https://web.archive.org/web/20250119212911/https://philpapers.org/browse/philosophy-of-cognitive-science>; Chalmers' taxonomy lists "Philosophy of Cognitive Science" (incl. ", General"/", Misc") in its philosophy-of-science region: <https://consc.net/taxonomy.html>
- Recognition (verified): *The Oxford Handbook of Philosophy of Cognitive Science* (OUP); SEP entry <https://plato.stanford.edu/entries/cognitive-science/> (dedicated section on the philosophy of cognitive science).
- Verdict: the duplication contest is resolved (distinct from philosophy-of-mind). No promotable grounding under v1.

**Policy escalation:** whether PhilPapers category grounding should become promotion-grade for QID-less nodes (a candidate "promotion policy v1.2" clause) is a CPO policy decision — flagged, not assumed.

**Resolution (2026-06-10, session #3):** promotion policy v1.2 ratified by the CPO (vault decision log (12)): a live-verified non-Wikidata scholarly identifier (verification path and snapshot URLs permanently recorded, as above) + QC ambiguous=false promotes to `proposed`; `reviewed` continues to require resolver-verified Wikidata-grade grounding until the alternative identifier system's precision is measured. Both nodes above were promoted to `/data` as `proposed` under v1.2 the same day.

## QC overrides and rejections (orchestrator)

1. **Source rejected:** `philopedia.org` (cited twice by subagents) — unestablished provenance; all verdicts relying on it were re-grounded on SEP/Chalmers instead.
2. **Recommendation rejected:** experimental-philosophy `emerging → established` upgrade (see item) — kept conservative pending dedicated-journal/society evidence.
3. **Wikipedia citations** were treated as supplementary only; no verdict above rests on Wikipedia.
4. PhilPapers/Wiley/OUP bot-blocks were never bridged by training knowledge — only by verified mirrors (Chalmers taxonomy, Wayback snapshots) or dropped.
