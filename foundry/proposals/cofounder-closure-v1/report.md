# Batch report — `cofounder-closure-v1`

Generation: Claude Sonnet 5 (`claude-sonnet-5`), 2026-07-01, separated generation context (ADR 0007).
QC / promotion: Opus orchestrator, separate session (ADR 0007 separation). Local Wikidata + live
source fetch available (HTTP 200).

## What / why

Wave-7 (`person-wave7-v1`, decision (79)) and the Arrow/Sen social-choice-theory edges left 5
explicit, named co-founder gaps: a canonical co-founder of an already-`reviewed` subfield missing
while their counterpart is already a corpus node. This batch closes exactly those 5 gaps — the
#44 Stage 1 mirror (low-cost, complete-value, no scope gate; all deceased → decision (61) ladder).

## The 5 items — QC outcome

| Person node | Corrected QID (live) | Born–Died | Target subfield | Counterpart already reviewed | Verdict |
|---|---|---|---|---|---|
| `person:george-miller` | **Q670658** | 1920–2012 | `subfield:cognitive-psychology` | `person:ulric-neisser` | supported |
| `person:paul-ehrlich` | **Q57089** | 1854–1915 | `subfield:immunology` | `person:elie-metchnikoff` | supported |
| `person:jan-tinbergen` | **Q183181** | 1903–1994 | `subfield:econometrics` | `person:ragnar-frisch` | supported |
| `person:george-edward-moore` | **Q295386** | 1873–1958 | `subfield:analytic-philosophy` | `person:bertrand-russell` (+ Frege, Wittgenstein) | supported |
| `person:duncan-black` | **Q1265355** | 1908–1991 | `subfield:social-choice-theory` | `person:kenneth-arrow` + `person:amartya-sen` | supported |

**Judgment: 5 supported / 0 disputed / 0 NEI / 0 reject · claim hallucination 0.** All 5 deceased →
`founded_or_formalized` deceased-founder ladder (decision (61)) → auto-`reviewed` (both endpoints
reviewed + Lane B supported). No living-founder guard applies.

## QID verification — generator hallucination 5/5 (~100%, precedent-consistent)

Every generator QID was a hallucination pointing at an unrelated entity; the orchestrator
independently live-resolved all 5 (enwiki pageprops → multi-signal `wbgetentities`
P31=Q5 + P569 + P570 + enwiki sitelink + P106):

| Person | Generator QID (hallucinated) | Actually points to | Corrected QID |
|---|---|---|---|
| Miller | Q733135 | "Namibia at the 2011 World Championships in Athletics" | Q670658 |
| Ehrlich | Q77938 | William Prager (applied mathematician) | Q57089 |
| Tinbergen | Q123280 | Francis Crick | Q183181 |
| Moore | Q311854 | Pierre Loti (French writer) | Q295386 |
| Duncan Black | Q5311021 | "Dublin quays" | Q1265355 |

The 3 generator-flagged `ambiguous:true` nodes (Ehrlich, Tinbergen, Duncan Black) were
identity-disambiguation risks, all cleared by live verification: Ehrlich Q57089 is the immunologist
(**not** the living biologist Paul R. Ehrlich); Tinbergen Q183181 is the economist Jan (**not** his
brother Nikolaas, the 1973 ethology laureate); Duncan Black Q1265355 is the economist (1908–1991),
disambiguated from the common name.

## Grounding — ≥2 independent live claim-stating sources each

- **Miller** — WP 'George Armitage Miller' ("one of the founders of cognitive psychology, and more
  broadly, of cognitive science") + WP 'Cognitive psychology'. `source:wikipedia`.
- **Ehrlich** — NobelPrize.org 1908 ("Mechnikov and Paul Ehrlich 'in recognition of their work on
  immunity'") + WP 'Paul Ehrlich' ("has been called 'father of immunology'"). `source:nobelprize`,
  `source:wikipedia`.
- **Tinbergen** — WP 'Econometrics' ("Jan Tinbergen is one of the two founding fathers of
  econometrics") + NobelPrize.org 1969 ("Frisch and Jan Tinbergen ... dynamic models ... economic
  processes"). `source:nobelprize`, `source:wikipedia`.
- **Moore** — SEP 'George Edward Moore' ("the trinity of philosophers at Trinity College Cambridge
  ... who made Cambridge one of centres of ... analytical philosophy") + WP 'Analytic philosophy'
  ("Central figures ... G. E. Moore"). `source:sep`, `source:wikipedia`. (SEP `moore` slug live
  HTTP 200 — verified before citing, per the #44 SEP-404 precedent.)
- **Duncan Black** — WP 'Duncan Black' ("a Scottish economist who laid the foundations of social
  choice theory and public choice") + SEP 'Social Choice Theory' (names Black with Arrow and Sen).
  `source:sep`, `source:wikipedia`.

All notes carry record-not-resolve plural-founding language (founding is co-equal, not exclusive)
and cross-reference the counterpart edge whose note flagged the gap. `disputed:true` never used.

## Promotion

Nodes 516 → 521 (+5 person); edges 608 → 613 (+5 `founded_or_formalized` reviewed);
node-translations → 521; sources 23 unchanged. In-place additive append (indentation preserved,
no reformat). `npm run typecheck` ✓ / `npm run validate:data` ✓.

## Left out (deliberate)

Francis Galton (psychometrics — eugenics debt) and Cesare Lombroso (criminology — born-criminal
theory discredited) were NOT generated. They carry a reputational/theory-credibility axis and are
surfaced to the CPO as an option (include as founder node with a record-not-resolve note, or
note-only) rather than auto-promoted. See the session decision-log entry.
