# Batch report — `person-wave8-v1`

Generation: Claude Sonnet 5 (`claude-sonnet-5`), 2026-07-01, separated generation context (ADR 0007).
QC / promotion: Opus orchestrator, separate session (ADR 0007 separation). Local Wikidata + live
source fetch available (HTTP 200).

## What / why

Person wave 8 — 10 canonical "father of X" founders of already-`reviewed` disciplines that had **no
`founded_or_formalized` edge yet**. Scoped by the orchestrator from the 348 founder-gap anchors
under the established standing criteria (§12 dual-criterion + referent precision + canonical
single/principal-founder keep-criteria + live viability pre-check), deliberately weighted toward the
under-covered **medicine** and **natural-sciences** continents. All 10 deceased → decision (61)
deceased-founder ladder.

## The 10 items — QC outcome

| Person node | Corrected QID (live) | Born–Died | Target | Grounding (2 independent live) |
|---|---|---|---|---|
| `person:ernst-haeckel` | **Q48246** | 1834–1919 | `subfield:ecology` | WP 'Ernst Haeckel' ("coined … ecology", 1866) + 'Ecology' |
| `person:rene-just-hauy` | **Q316515** | 1743–1822 | `subfield:crystallography` | WP 'René Just Haüy' ("Father of Modern Crystallography") + 'Crystallography' |
| `person:john-milne` | **Q2739759** | 1850–1913 | `subfield:seismology` | WP 'John Milne' ("Father of Modern Seismology") + 'Seismology' |
| `person:john-graunt` | **Q454938** | 1620–1674 | `subfield:demography` | WP 'John Graunt' ("founder of demography") + 'Demography' |
| `person:john-snow` | **Q356407** | 1813–1858 | `subfield:epidemiology` | WP 'Epidemiology' ("father of (modern) Epidemiology") + 'John Snow' |
| `person:oswald-schmiedeberg` | **Q77409** | 1838–1921 | `field:pharmacology` | WP 'Oswald Schmiedeberg' ("first professor of pharmacology") + 'Pharmacology' |
| `person:emil-kraepelin` | **Q76828** | 1856–1926 | `field:psychiatry` | WP 'Emil Kraepelin' ("lay the foundation for modern scientific psychiatry") + 'Psychiatry' |
| `person:ernst-chladni` | **Q213579** | 1756–1827 | `subfield:acoustics` | WP 'Ernst Chladni' ("father of acoustics") + 'Acoustics' |
| `person:mathieu-orfila` | **Q704342** | 1787–1853 | `subfield:toxicology` | WP 'Mathieu Orfila' ("father of modern toxicology") + 'Toxicology' |
| `person:victor-moritz-goldschmidt` | **Q213668** | 1888–1947 | `subfield:geochemistry` | WP 'Victor Moritz Goldschmidt' ("founder of modern geochemistry, together with Vernadsky") + 'Geochemistry' |

**Judgment: 10 supported / 0 disputed / 0 NEI / 0 reject · claim hallucination 0.** All 10 deceased →
`founded_or_formalized` deceased-founder ladder (decision (61)) → auto-`reviewed` (endpoints reviewed
+ Lane B supported). No living-founder guard applies.

## QID verification — generator hallucination 10/10 (~100%, precedent-consistent)

Every generator QID pointed at an unrelated entity; the orchestrator independently live-resolved all
10 (enwiki pageprops → multi-signal `wbgetentities` P31=Q5 + P569 + P570 + enwiki sitelink + P106):

| Person | Generator QID (hallucinated) | Actually points to | Corrected QID |
|---|---|---|---|
| Haeckel | Q57235 | Clemens Brentano (poet) | Q48246 |
| Haüy | Q116565 | Jean-Louis Jeanmaire (Swiss officer) | Q316515 |
| Milne | Q713434 | Grăușorul (Romanian village) | Q2739759 |
| Graunt | Q721755 | Ñuble Province (Chile) | Q454938 |
| Snow | Q131691 | Duke of Wellington | Q356407 |
| Schmiedeberg | Q71186 | Erwin Baur (botanist) | Q77409 |
| Kraepelin | Q60815 | Brian Greene (physicist) | Q76828 |
| Chladni | Q76357 | Jürgen Habermas | Q213579 |
| Orfila | Q464889 | Herbert Rawlinson (actor) | Q704342 |
| Goldschmidt | Q71805 | Franz Ningel (pair skater) | Q213668 |

The 5 generator-flagged `ambiguous:true` disambiguation risks all cleared by live verification:
- **Goldschmidt** (highest risk) — Q213668 is Victor **Moritz** Goldschmidt (1888–1947, geochemist),
  correctly distinguished from his father Victor **Mordechai** Goldschmidt (1853–1933, crystallographer).
- **Milne** — Q2739759 is the seismologist (1850–1913, geologist/mining engineer), not a homonym.
- **Snow** — Q356407 is the physician/epidemiologist (1813–1858), not the journalist or the fictional character.
- **Haeckel**, **Kraepelin** — the `ambiguous` flag was plural-founding (Warming; Pinel/Griesinger),
  recorded as record-not-resolve notes, not an identity doubt.

## Grounding — ≥2 independent live claim-stating sources each

Every edge is grounded in 2 independent live-verified Wikipedia articles (field article +
biography), encoded under `source:wikipedia` (the #34 precedent), both titles named in the edge
`note`. No specialist source (SEP/MacTutor/Nobel) plausibly applies to these 10. Record-not-resolve
notes throughout (Haeckel/Warming, Milne/Ewing/Gray, Graunt/Petty, Kraepelin/Pinel/Griesinger,
Goldschmidt/Vernadsky/Clarke; forerunners: Steno for crystallography, Paracelsus for toxicology).

## Promotion

Nodes 522 → 532 (+10 person); edges 619 → 629 (+10 `founded_or_formalized` reviewed);
node-translations → 532; sources 23 unchanged. In-place additive append (indentation preserved).
`npm run typecheck` ✓ / `npm run validate:data` ✓.

## Scoping note (session #45)

The CPO declined a per-slate ratification ("use the standing criteria and keep judging"), delegating
routine wave scoping to the orchestrator under the established keep-criteria. William Morris Davis
(geomorphology, Q315967) and Georgius Agricola (mineralogy) were considered and left for a later
wave (Davis fully resolvable; Agricola's founding is more diffuse — father of mineralogy *and*
metallurgy).
