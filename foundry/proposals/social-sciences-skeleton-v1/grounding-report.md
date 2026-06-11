# Grounding report — social-sciences-skeleton-v1 (resolver v4, parallel round v1 / 13a)

- **Resolver:** v4, run locally 2026-06-11 under the round's network lock
  (`/tmp/noosphere-net-lock/`, acquired → run → released; ③ stagger rule). Input: the
  QC-regenerated 39-seed manifest. Raw result: 39/39 resolved, 0 unresolved,
  resolver-ambiguous 21, total candidates 115, **fallback fire rate 0/39** (no compound/singular
  fallback needed — all primary queries hit).
- **QC adjudication:** Claude Fable 5 (orchestrator). Identity verdicts are multi-signal from the
  resolver's live entity captures (exact label + English description + P31 + enwiki sitelink +
  aliases, with `wikidata_lastrevid` pinning each observed state below) — never QID-only lookups,
  never label-only matches (sitelink+alias rule, decision-log (9)). Non-routine cases were
  re-fetched live by the orchestrator before the verdict: Q20431068 (full sitelink census),
  Q18564125 + business-administration/business-studies searches, Q185545 (HTTP 404 — deleted
  entity), Q205398 (manual-selection confirmation), and the QC-stage fetches of
  Q179805/Q126842/Q4932206 (duplicate-referent and identity-contest checks, qc-report).

## v4 dashboard

| Metric | Value |
|---|---|
| Resolver–QC agreement (selection accepted as-is) | **35/39 (89.7%)** — vs 97.6% (NS, v4) / 83% (CS, v3) |
| Manual overrides | **1** (social-work-and-welfare — rank-2 selected over rank-1) |
| Upstream gaps | **3** (economic-theory, business-and-management, archaeological-anthropology) |
| Fallback fire rate | 0/39 |
| Resolver-ambiguous → QC-resolved | 21/21 (label+sitelink accepts per decision-log (9); thin-twin guards recorded) |
| QID-hint hallucination | **28/38 (73.7%)** — trend 93 → 71 → 72 → 80 → **74** |
| Deleted-entity hint | 1 (economic-theory ← Q185545, HTTP 404 live-checked) |
| Hint collisions (QC-caught pre-resolver) | 1 (Q8134 on economics + financial-economics) |

Notable hint pathologies: the political-theory hint **Q179805 was the canonical
political-philosophy entity** — right entity, wrong node, and exactly the evidence that drove the
duplicate-referent drop at QC; the archaeological-anthropology hint Q23498 is the whole-discipline
archaeology entity (must-not-select guard added — a wing node must not anchor at the
whole-discipline referent); the economic-theory hint Q185545 does not exist (404).

## Manual override (decision-log (9) path, orchestrator re-fetched live)

1. **social-work-and-welfare → Q205398 MANUAL (override of rank-1 Q828395).** The resolver
   ranked 'social policy' (Q828395, score 110) above 'social work' (Q205398, score 40 — P31
   Q30109942 outside the curated set, non-exact label). Social policy is a *different referent*
   (government measures, not the discipline). Q205398: desc "academic discipline and profession",
   enwiki "Social work", 75 sitelinks (re-fetched live, lastrevid 2493921034) — node identity
   wins over type-signal score (statistical-physics pattern). `must_not_select: Q828395` guard
   added.

## Upstream gaps (3 — nodes stay in foundry; §12: node shape is not reopened by anchor availability)

1. **economic-theory — gap.** Rank-1 Q1401304 'economic theory' is "a model trying to explain
   economic reality" (no P31, no aliases) — the referent is *an* economic theory, not the
   research area; REJECTED with must-not-select guard. No discipline-rank entity found; hint
   Q185545 deleted upstream.
2. **business-and-management — gap.** Rank-1 Q2920921 'management' is a one-wing component
   anchor (distributed-and-parallel-computing pattern: the component term does not umbrella
   business/marketing/accounting) — REJECTED, guarded; Q4830453 'business' is the enterprise
   referent (wrong kind) — guarded; the right referent, Q18564125 'business management' (P31
   academic discipline, alias "business administration"), is a **0-sitelink thin entity**
   (live-checked) failing the label+sitelink rule — left unguarded so a matured upstream state
   surfaces as INFO at future pit-stops.
3. **archaeological-anthropology — gap.** Rank-1 Q20431068 is the correct referent but a
   near-orphan stub: **1 sitelink (rowiki only), 0 EN aliases, no enwiki** (live census
   2026-06-11) — fails the label+sitelink rule; left unguarded (may mature). The node is also
   B-flagged (clause-6 queue) — double-parked honestly.

## Umbrella/alias acceptances worth recording

- **media-and-communication-studies → Q11680831 'communication studies' ACCEPT.** The entity
  itself carries the combined-name aliases ("media and communication science", "communication
  and media science", "media and communication") — the umbrella test passes on the entity's own
  alias set (stronger than the automata-theory pattern). B-flagged node: anchor verified,
  promotion still stops at `proposed`.
- **urban-and-regional-planning → Q149013 'spatial planning' ACCEPT.** Carries the exact alias
  "urban and regional planning" + P31 academic discipline + enwiki; the exact-label rank-2
  Q64808211 is a 0-enwiki thin twin (session #12 duplicate-link-twin pattern) — guarded.
- **civil-law → Q222249 ACCEPT (sense check).** Desc "regulates non-criminal legal
  relationships" + enwiki Civil_law_(common_law) = the branch sense the node intends; the
  legal-system sense Q5950118 ("Romano-Germanic") guarded — the generator's pre-registered
  sense concern resolved exactly as written.
- **jurisprudence → Q4932206 ACCEPT as anchor** (exact label, enwiki Jurisprudence, 99
  sitelinks); **Q126842 guarded** — it is the canonical philosophy-of-law entity and selecting
  it here would manufacture the very duplicate the B-flag exists to adjudicate.
- **physical-anthropology → Q27172 'biological anthropology' ACCEPT** — the community's current
  name for the same referent ("physical anthropology" resolves via alias; label rule notes the
  LCC caption label is retained on the node).

## Per-QID verdicts (final verified set, 36/39)

| node | QID | observed label | enwiki | lastrevid | verdict |
|---|---|---|---|---|---|
| field:economics | Q8134 | economics | Economics | 2503571322 | accept rank-1 (amb: agri-econ rank-2) |
| field:sociology | Q21201 | sociology | Sociology | 2503244587 | accept rank-1 |
| field:political-science | Q36442 | political science | Political_science | 2504590591 | accept rank-1 (amb: thin twin Q1494494) |
| field:education | Q8434 | education | Education | 2497039127 | accept rank-1 (amb: thin 'education theory' Q5341232; no discipline-rank entity exists — subject-matter anchor per practice) |
| field:law | Q7748 | law | Law | 2502864519 | accept rank-1 |
| field:anthropology | Q23404 | anthropology | Anthropology | 2503615572 | accept rank-1 |
| field:media-and-communication-studies | Q11680831 | communication studies | Communication_studies | 2501911232 | accept (umbrella-alias test) |
| field:human-geography | Q12831143 | human geography | Human_geography | 2504306759 | accept rank-1 (alias 'anthropogeography' mirrors LCC GF caption) |
| subfield:econometrics | Q160039 | econometrics | Econometrics | 2502138510 | accept rank-1 |
| subfield:labor-economics | Q28161 | labour economics | Labour_economics | 2496987541 | accept rank-1 |
| subfield:economic-history | Q47398 | economic history | Economic_history | 2496506130 | accept rank-1 |
| subfield:public-finance | Q274490 | public finance | Public_finance | 2497078649 | accept rank-1 (amb: descless twin Q24887207) |
| subfield:international-economics | Q47417 | international economics | International_economics | 2496506191 | accept rank-1 |
| subfield:financial-economics | Q2294553 | financial economics | Financial_economics | 2494068907 | accept rank-1 (no hint — collision removed at QC) |
| subfield:criminology | Q161733 | criminology | Criminology | 2500541243 | accept rank-1 (amb: env-criminology alias) |
| subfield:demography | Q37732 | demography | Demography | 2500098919 | accept rank-1 (hint match) |
| subfield:social-work-and-welfare | Q205398 | social work | Social_work | 2493921034 | **manual** (rank-1 Q828395 rejected) |
| subfield:gender-studies | Q1662673 | gender studies | Gender_studies | 2493499921 | accept rank-1 |
| subfield:social-stratification | Q841628 | social stratification | Social_stratification | 2497767211 | accept rank-1 (phenomenon-entity anchor, P31-less acceptance practice) |
| subfield:international-relations | Q166542 | international relations | International_relations | 2500099443 | accept rank-1 (hint match) |
| subfield:public-administration | Q31728 | public administration | Public_administration | 2498814285 | accept rank-1 |
| subfield:comparative-politics | Q32492 | comparative politics | Comparative_politics | 2496404403 | accept rank-1 (label+sitelink, (9)) |
| subfield:curriculum-and-instruction | Q157416 | curriculum and instruction | Curriculum_&_Instruction | 2480130327 | accept rank-1 |
| subfield:educational-policy | Q452348 | education policy | Education_policy | 2497265166 | accept rank-1 (label variant = alias) |
| subfield:higher-education | Q136822 | higher education | Higher_education | 2502123930 | accept rank-1 (subject-matter anchor; rank-2 is a Wikimedia category) |
| subfield:special-education | Q212105 | special education | Special_education | 2497023711 | accept rank-1 (amb: no-sitelink discipline twin Q1595434) |
| subfield:jurisprudence | Q4932206 | jurisprudence | Jurisprudence | 2499322119 | accept rank-1 (Q126842 guarded; B-flag holds at proposed) |
| subfield:constitutional-law | Q11206 | constitutional law | Constitutional_law | 2504562585 | accept rank-1 ((9); descless twin Q3829739 at rank-2) |
| subfield:international-law | Q4394526 | international law | International_law | 2499262919 | accept rank-1 (alias 'Law of Nations' mirrors LCC KZ caption) |
| subfield:criminal-law | Q146491 | criminal law | Criminal_law | 2503369279 | accept rank-1 ((9)) |
| subfield:civil-law | Q222249 | civil law | Civil_law_(common_law) | 2497046707 | accept rank-1 (branch sense confirmed; Q5950118 guarded) |
| subfield:cultural-anthropology | Q28598 | cultural anthropology | Cultural_anthropology | 2494190615 | accept rank-1 |
| subfield:physical-anthropology | Q27172 | biological anthropology | Biological_anthropology | 2496377206 | accept rank-1 (community-renamed referent) |
| subfield:economic-geography | Q187097 | economic geography | Economic_geography | 2504308744 | accept rank-1 ((9)) |
| subfield:urban-and-regional-planning | Q149013 | spatial planning | Spatial_planning | 2493777335 | accept rank-1 (exact-alias umbrella; thin twin Q64808211 guarded) |
| subfield:mass-communication | Q853710 | mass communication | Mass_communication | 2495194723 | accept rank-1 |

## Golden set

39 entries appended (`batch:social-sciences-skeleton-v1`, golden set 199 → 238): 35 rank-1
verified + 1 manual-path (social-work Q205398, `must_not_select: Q828395`) + 3 upstream gaps
(guards: economic-theory `Q1401304`; business-and-management `Q2920921`,`Q4830453`;
archaeological-anthropology `Q23498`). Extra collision/sense guards on verified seeds:
jurisprudence `Q126842`, civil-law `Q5950118`, urban-and-regional-planning `Q64808211`.

Post-adjudication regression run against this pack: **35 pass / 0 warn / 2 fail / 2 info.**
The 2 FAILs are **by design on this pack**: the resolver's rank-1 selections for economic-theory
(Q1401304) and business-and-management (Q2920921) are exactly the QC-rejected entities the new
guards encode — the goldenset is doing its job (these selections must never be promoted, and the
nodes stay in foundry). Future pit-stop re-runs of this batch will show the same 2 FAILs until
upstream matures (a maturation would surface as INFO via the unguarded right-referent entities
Q18564125/Q20431068) — documented-limitation pattern (v3 ontology/logic precedent). The 2 INFOs
are the manual path (Q205398 IMPROVED — surfaced as candidate) and the known-gap maturation
signal on archaeological-anthropology.

## Evidence permanence (§8) — SPN queue (round protocol: after-pay)

Verdict-bearing URLs for this batch (36 `Special:EntityData/<QID>.json` + the 5 orchestrator
re-fetch entities + LCC PDF/UDC getrecord/FORD baseline URLs) are recorded as this session's SPN
queue in the session report. Per parallel-round-v1 ③, the save pass is **deferred to #14**
(existing-snapshot-first; same-IP stagger) except any quick existing-snapshot verification at
session close. Observed entity states are independently pinned by `wikidata_lastrevid` above —
the §8 half-duty (permanent queue record) is satisfied here.
