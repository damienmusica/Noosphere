# Promotion report — `work-wave2-v1`

Session #48, 2026-07-01. First batch generated on the **now-open** work-node + `canonical_work`
auto-`reviewed` ladders (decision (88), opened earlier this session). Separated-context Sonnet 5
generation (ADR 0007) → Opus orchestrator live multi-signal QID QC (local session — enwiki
pageprops + Wikidata `wbgetentities` P31/P50/P577 + enwiki sitelink).

## Generator QID hallucination: 9/9 (100%, precedent-consistent)
Every generator-guessed QID was wrong on the exact digits (identity intent mostly sound). All
re-derived live. The separated-generation + independent live-verification contract is what keeps
these out of `/data`. Sample: Begriffsschrift guess Q383092 → live Q814390; Shannon guess
Q1770447 → live Q724029; Cybernetics guess Q1230999 → live Q16953441.

## Written `reviewed` → `/data` (5 works + 10 edges)
All four node-criteria met (P31 work-type + P50 author-match + P577 year + enwiki sitelink) with
both endpoints already `reviewed`; Lane B **supported** (≥2 independent live claim-stating
sources — the work's own enwiki article, whose lead states the founding role, + the field/person
article; adversarial probes rejected; direction work→{field,person}; identity referent verified).

| Work | QID | P31 | canonical for | founding claim (live lead) |
|---|---|---|---|---|
| A Mathematical Theory of Communication | Q724029 | scholarly article | information-theory + Shannon | Shannon's 1948 BSTJ article; foundational to information theory |
| Cybernetics | Q16953441 | written work | cybernetics + Wiener | "first public usage of the term… laid the theoretical foundation" |
| Begriffsschrift | Q814390 | written work | mathematical-logic + Frege | "a book on logic by Gottlob Frege, published in 1879" (first modern quantifier logic) |
| The Interpretation of Dreams | Q726382 | literary work | psychoanalysis + Freud | "an 1899 book by Sigmund Freud, the founder of psychoanalysis" |
| On Crimes and Punishments | Q2755269 | literary work | criminology + Beccaria | "a founding work in the field of penology" (classical criminology) |

Scope notes recorded (not disqualifying, per the ladder's tension/scope-note clause): Frege
person-edge scoped to Begriffsschrift specifically (not Grundgesetze); Beccaria published
anonymously 1764 (authorship undisputed on Wikidata); On Crimes framed as "penology" in its lead
(a criminology subfield). Freud P577 imprint 1900 / first published Nov 1899.

## Held in foundry (`proposed`, NOT promoted) — identity-decidable but one auto-criterion short
These are real, correctly-identified canonical works whose Wikidata items are missing exactly one
of the four codified auto-criteria. Held per ladder discipline (the criterion codified in §8 the
same day was not bent on first application). They remain in the proposal folder, promotable if the
gap closes or the policy question below is ruled.

| Work | QID | Missing criterion |
|---|---|---|
| On Computable Numbers (Turing, 1936, paper) | Q20895949 | enwiki sitelink (0 sitelinks; P31 scholarly article + P50 Q7251 + P577 1936 all present) |
| Social Choice and Individual Values (Arrow, 1951) | Q4227976 | P577 (absent on Wikidata; P31 written work + P50 Q192592 + enwiki sitelink present) |
| Grundzüge der physiologischen Psychologie (Wundt, 1874) | Q2883810 | P577 **and** enwiki sitelink (P31 written work + P50 Q75814 present; 2 non-enwiki sitelinks) |

### ★ Policy-refinement question surfaced for the CPO (recorded, NOT decided unilaterally)
The work-node ladder (decision (88)) requires an **enwiki sitelink** as an identity anchor. Wave 2
surfaced 3 canonical works whose identity is fully decidable via **P50 (author) + P577 (year) +
work-type P31 + exact-title match** yet lack a sitelink (or, for Arrow, lack only P577). Question:
**should P50+P577+work-type-P31+exact-title substitute for a missing enwiki sitelink (and should a
Wikidata-absent but uncontested publication year be satisfiable from the sitelinked source)?** This
would auto-promote Turing's computability paper, Arrow's Social Choice, and Wundt's Grundzüge.
Deferred to the CPO as a criterion-strictness ruling; not changed by the CTO.

## Honest-gap drop (not written anywhere in `/data`)
- **On the Mode of Communication of Cholera (John Snow, 1855)** — no Wikidata item carries
  P50 = John Snow (Q356407); candidate items lack author link and/or sitelink. Undecidable author
  anchor → dropped, mirroring Vernadsky *Biosphere* (#47) and fractal-geometry/JDM (#43). Revisit
  if a properly-authored book/pamphlet item appears.

## Rejection probes 2/2 (discriminating power confirmed)
- **R1 (misattribution):** Shannon paper → `person:john-von-neumann` — REJECTED. Live P50 of
  Q724029 = [Q92760] only; von Neumann is not an author.
- **R2 (cross-subfield):** Turing 1936 paper → `subfield:information-theory` — REJECTED. That is
  Shannon 1948; Turing's paper is canonical for computability theory. Not written.

## Invariants
Schema / taxonomy unchanged. 0 new sources (23 → 23). In-place **additive append only** (301
insertions, 0 deletions across nodes/edges/translations; 0 reformat). No `disputed: true`
introduced. Living endpoints: 0 (all 5 authors deceased). typecheck ✓ validate ✓.
Nodes 560→565 · edges 666→676 · translations →565 · work 9→14 · canonical_work 18→28.

## Measurement
Promoted (initial): **10 supported / 0 disputed / 0 NEI; claim hallucination 0.** Ladder discrimination:
held 3 (criterion-short), dropped 1 (undecidable), rejected 2 (probes) — the criteria bite. First
application of the open ladder surfaced 1 policy-refinement question (sitelink substitutability).

## ★ Follow-up — decision (89), same session (CPO-ratified criterion revision + 3 held items promoted)
The CPO challenged the hold: was there any *researched* safety reason to require an enwiki sitelink, or
was it reflexive rule-following? Live research on the 3 held items showed **no unique protective value**:
the *wrong-referent* mode is caught by P31=work-type + P50 (Vernadsky *Biosphere* failed there), the
*duplicate/version* mode by P577 + exact-title (Turing's 1936 paper was correctly separated from its 1938
correction + Church's review), and the only residual (a bibliographic-stub duplicate) is excluded here —
Turing Q20895949 carries **23 properties** incl. DOI + P1433 Proc. LMS; Arrow Q4227976 is **sitelinked in
6 languages** (incl. enwiki — it was held only for a missing P577, year 1951 uncontested); Wundt Q2883810
is **sitelinked on es/it Wikipedia** + P50-pinned. "enwiki-only" was also anglocentric. §8 criteria 3–4
were revised (decision (89)): year decidable via P577 **or** an uncontested sitelinked-source year; identity
anchor = **any**-Wikipedia sitelink **or** P50+year+work-type+exact-title on a substantively-populated item.

**Promoted `reviewed` → `/data` (3 works + 6 edges), all supported + endpoints reviewed + deceased:**
- **On Computable Numbers** (Turing, 1936, Q20895949) → computability-theory + Turing. Founding paper of
  computability (Turing machine). Note: Wikidata description mislabels it "master's thesis" — P1433=Proc. LMS
  confirms it is the published paper; identity unaffected.
- **Social Choice and Individual Values** (Arrow, 1951, Q4227976) → social-choice-theory + Arrow. Lead:
  "created modern social choice theory."
- **Principles of Physiological Psychology** (Wundt, 1874, Q2883810) → experimental-psychology + Wundt.
  enwiki 'Wilhelm Wundt': "the first textbook … pertaining to the field of experimental psychology."

Snow remains dropped (P50 undecidable — the (89) revision does not rescue it; correctly so).

**Final batch tally: 8 works + 16 canonical_work edges promoted `reviewed`; 1 drop (Snow); 2 reject probes.**
Additive-only (+126 ins / 0 del for the 3-item follow-up). typecheck ✓ validate ✓.
