# Batch report — `person-wave9-v1`

Generation: Claude Sonnet 5 (`claude-sonnet-5`), 2026-07-01, separated generation context (ADR 0007).
QC / promotion: Opus orchestrator, separate session (ADR 0007 separation).

## What / why

Person wave 9 — 7 canonical founders of already-`reviewed` disciplines with no founder edge, part of
the **Phase-1 founder-layer closeout** (weighted to under-covered natural + life sciences).
Orchestrator-scoped under standing keep-criteria; CPO delegated routine wave scoping this session.

## The 7 items — QC outcome

| Person node | Corrected QID (live) | Born–Died | Target | Grounding |
|---|---|---|---|---|
| `person:andreas-vesalius` | **Q170267** | 1514–1564 | `subfield:anatomy` | WP 'Andreas Vesalius' (Fabrica 1543) + 'Anatomy' ("rebirth of anatomy") |
| `person:carl-linnaeus` | **Q1043** | 1707–1778 | `subfield:systematics` | WP 'Carl Linnaeus' ("father of modern taxonomy") + 'Systematics' |
| `person:james-hutton` | **Q192927** | 1726–1797 | `subfield:geology` | WP 'James Hutton' ("Father of Modern Geology") + 'Geology' |
| `person:karl-ernst-von-baer` | **Q57190** | 1792–1876 | `subfield:developmental-biology` | WP 'Karl Ernst von Baer' ("founding father of embryology") + 'Developmental biology' |
| `person:william-morris-davis` | **Q315967** | 1850–1934 | `subfield:geomorphology` | WP 'Geomorphology' ("cycle of erosion … developed by William Morris Davis") + biography |
| `person:matthew-fontaine-maury` | **Q114385** | 1806–1873 | `subfield:oceanography` | WP 'Matthew Fontaine Maury' ("founder of modern oceanography"; "Pathfinder of the Seas") + 'Oceanography' |
| `person:georgius-agricola` | **Q76579** | 1494–1555 | `subfield:mineralogy` | WP 'Mineralogy' ("Agricola … began the scientific approach") + biography |

**Judgment: 7 supported / 0 disputed / 0 NEI / 0 reject · claim hallucination 0.** All 7 deceased →
deceased-founder ladder (decision (61)) → auto-`reviewed`.

## QID verification — generator hallucination 5/7

Notably **2/7 generator QID guesses were correct this run** (Linnaeus Q1043, Davis Q315967 — both
independently re-confirmed live), a first departure from the prior ~100% miss rate. The other 5 were
hallucinations pointing at unrelated entities, all corrected via enwiki pageprops + multi-signal
`wbgetentities`:

| Person | Generator QID | Actually points to | Corrected QID |
|---|---|---|---|
| Vesalius | Q57235 | Clemens Brentano (poet) | Q170267 |
| Hutton | Q193621 | Auzances (French commune) | Q192927 |
| von Baer | Q57262 | Juigné-sur-Sarthe (French commune) | Q57190 |
| Maury | Q317117 | a Syrian university professor | Q114385 |
| Agricola | Q57285 | Wilhelm Furtwängler (conductor) | Q76579 |

**Agricola** carried a genuine identity-collision risk (Latinized "Agricola" shared by Rudolph
Agricola the humanist and Johann Agricola the theologian, 1494–1566 — a near-exact birth-year
coincidence with Georg Bauer, 1494–1555); resolved to Q76579, the mineralogist of Chemnitz.

## Grounding + record-not-resolve

≥2 independent live-verified Wikipedia articles per edge (field + biography). Record-not-resolve
notes: Vesalius/Galen (superseded), Linnaeus/Hennig-cladistics, Hutton/Lyell, von Baer (embryology vs
modern molecular scope), Davis/Gilbert-Powell (+ "largely superseded today"), Agricola/metallurgy.
Davis's edge deliberately grounded on the 'Geomorphology' field article, not his broader "father of
American geography" epithet.

## Promotion

Nodes 532 → 539 (+7 person); edges 629 → 636 (+7 `founded_or_formalized` reviewed);
translations → 539; sources 23 unchanged. `npm run typecheck` ✓ / `npm run validate:data` ✓.
