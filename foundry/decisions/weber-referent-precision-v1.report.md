# weber-referent-precision-v1 — promotion decision report

**Decided 2026-07-03** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/weber-referent-precision-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (7 errors) — this decision does not apply cleanly:
> - adds.nodes: node concept:tripartite-classification-of-authority already exists
> - adds.translations: translation concept:tripartite-classification-of-authority@en already exists (use translation_updates)
> - adds.edges: edge edge:max-weber-founded-tripartite-classification-of-authority already exists
> - adds.edges: edge edge:tripartite-classification-of-authority-part-of-sociology already exists
> - promotions: node concept:bureaucracy has status "deprecated", expected "proposed"
> - promotions: edge edge:max-weber-founded-bureaucracy has status "deprecated", expected "proposed"
> - promotions: edge edge:bureaucracy-part-of-sociology has status "deprecated", expected "proposed"

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `concept:tripartite-classification-of-authority` | **supported** | — | ✓ | 2 (2) | Identity: Q3565078 label 'tripartite classification of authority', en description 'M. Weber's classification of authority into charismatic, traditional, and legal types', 8 sitelinks incl. enwiki, P61 (discoverer or inventor) = Q9387 Max Weber. Node slug matches the entity's standard name exactly (C3 discipline: the generator's slug gloss 'legitimate-authority' was corrected at QC identity resolution — a generic-label slug over a Weber-specific entity would recreate the very slug↔referent mismatch this batch resolves; the generator's own uncertainty note flagged the label as a gloss). Multi-signal passes where candidate 1 failed. |
| `edge:max-weber-founded-tripartite-classification-of-authority` | **supported** | ✓ | ✓ | 3 (3) | Adversarial perspective-diverse QC (founder ladder (60)/(61)): [attribution] both enwiki and SEP attribute the typology solely to Weber; no counter-claimant found in either source — the 'predates-the-founder' trap that killed the bureaucracy claim does NOT apply (a typology is a theoretical construct created by its author, unlike the institution it classifies). [direction] person→concept correct; the construct appears in Weber's Economy and Society. [identity] target entity is Weber-specific by description AND by P61=Q9387; source person Q9387 verified. [living-person] Weber d. 1920 — deceased path. ≥2 independent claim-stating live sources (enwiki + SEP), Wikidata structured claim as third corroboration. |
| `edge:tripartite-classification-of-authority-part-of-sociology` | **supported** | ✓ | — | 2 (1) | Classification placement (structural tier): enwiki explicitly locates the typology in sociology discourse; the construct is classical sociological theory by authorship and curriculum. Concept-in-field placement mirrors logical-positivism → analytic-philosophy. No competing disciplinary home asserted by the read sources (SEP treats Weber under philosophy biographically but locates the domination typology in his sociology — 'his other sociologies of, for instance, law, city, music, domination, and economy'). |
| `concept:bureaucracy` | **reject** | — | — | 1 (1) | C3 referent-precision confirmed against live sources: Q72468 models the generic administrative institution; enwiki's own formulation ('first to STUDY bureaucracy formally') distinguishes studying/theorizing the pre-existing institution from creating it — exactly the misattribution the hold flagged. The precise referent for a 1:1 replacement (Weber's bureaucracy ideal-type, proposal candidate 1 'concept:weberian-bureaucracy') is identity-blocked: wbsearchentities 2026-07-03 finds no recognized entity ('Weberian bureaucracy' zero hits; Q113625093 'theory of bureaucracy' is a 0-sitelink, description-less orphan stub failing multi-signal — naval-architecture Q101910631 precedent). Disposition: node + both edges deprecated; the founder claim re-scoped one level up to the recognized typology entity (candidate 2); candidate 1 ledgered as a future re-creation trigger; candidate 3 (rationalization) not adopted — generator's own ranking marks it loosest-fit, and one precise re-scope suffices. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `concept:tripartite-classification-of-authority` | wikidata:Q3565078 | ✓ | wbgetentities | 2026-07-03 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `concept:tripartite-classification-of-authority` | node add | reviewed | node-promotion-v1 |
| `edge:max-weber-founded-tripartite-classification-of-authority` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:tripartite-classification-of-authority-part-of-sociology` | edge add (part_of) | reviewed | edge-promotion-v1-structural |
| `concept:bureaucracy` | node proposed→deprecated | deprecated | — |
| `edge:max-weber-founded-bureaucracy` | edge proposed→deprecated | deprecated | — |
| `edge:bureaucracy-part-of-sociology` | edge proposed→deprecated | deprecated | — |

## Tally

- Adds: 1 nodes, 2 edges, 0 sources, 1 translations, 0 external links.
- Reviewed outcomes: 3 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (3):
  - `concept:bureaucracy`: C3 hold RESOLVED by re-scope 2026-07-03 (decision (108), batch weber-referent-precision-v1): node + 2 edges DEPRECATED (generic-institution referent Q72468 cannot carry Weber's founder claim); the claim now lives on edge:max-weber-founded-tripartite-classification-of-authority (successor concept node Q3565078, reviewed). REMAINING TRIGGER: the narrow 1:1 referent (Weber's bureaucracy ideal-type, proposal weber-referent-precision-v1 candidate 1 'concept:weberian-bureaucracy') is identity-blocked — no recognized entity (Q113625093 'theory of bureaucracy' = 0-sitelink orphan stub 2026-07-03). Re-create the narrow concept + retarget/augment the founder record iff that entity (or an equivalent) gains multi-signal standing (sitelinks + description + P31). (recheck: manual)
  - `edge:max-weber-founded-bureaucracy`: CLOSED 2026-07-03 (decision (108)): deprecated and re-scoped to edge:max-weber-founded-tripartite-classification-of-authority (reviewed, founder ladder (60)/(61)). No further work on this id — audit record in foundry/decisions/weber-referent-precision-v1.json. (recheck: manual)
  - `edge:bureaucracy-part-of-sociology`: CLOSED 2026-07-03 (decision (108)): deprecated with its endpoint; the sociological placement now lives on edge:tripartite-classification-of-authority-part-of-sociology (reviewed, structural tier). No further work on this id — audit record in foundry/decisions/weber-referent-precision-v1.json. (recheck: manual)

## §8 permanence anchors

- https://www.wikidata.org/wiki/Q3565078 → https://www.wikidata.org/w/index.php?title=Q3565078&oldid=2293886262
- https://en.wikipedia.org/wiki/Tripartite_classification_of_authority → https://en.wikipedia.org/w/index.php?title=Tripartite_classification_of_authority&oldid=1336607101
- https://en.wikipedia.org/wiki/Rational-legal_authority → https://en.wikipedia.org/w/index.php?title=Rational-legal_authority&oldid=1348826867
- https://en.wikipedia.org/wiki/Bureaucracy → https://en.wikipedia.org/w/index.php?title=Bureaucracy&oldid=1362037974
- https://plato.stanford.edu/entries/weber/ — [SPN-FAILED] save did not materialize and no prior snapshot exists

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
