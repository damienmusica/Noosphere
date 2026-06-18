# Inline adversarial QID audit — humanities-remainder v1 (session #23)

Decision (34)② — inline audit is the standard final step of a skeleton session. **4 refutation agents**
(separate QC-side contexts, live Wikidata EntityData) vs the **44 new humanities QIDs** (modern-history has
no QID — the 1 honest gap, nothing to audit). Each agent was prompted to REFUTE (default to refuted/suspect
if unconvinced) and to check P31/P279 + the humanities homonym/era/object traps. Verdicts by the orchestrator.

## Result: 44/44 referent-correct · 0 refuted · 0 confirmed residual errors

| slice | confirmed | suspect | refuted |
|---|---|---|---|
| history (11) | 10 | 1 (ancient-history) | 0 |
| linguistics core (11) | 10 | 1 (semiotics) | 0 |
| linguistics-applied + literary (14) | 11 | 3 (discourse-analysis, literary-criticism, comparative-literature) | 0 |
| religion + classics/archaeology (8) | 8 | 0 | 0 |
| **total (44)** | **39** | **5** | **0** |

**No QID is a journal, person, place, artwork, organization, or wrong homonym.** Every one of the 16
generator hallucinations the QC corrected was independently confirmed by the audit as now pointing to the
right referent. **0 corrections needed.**

## Independent re-confirmations (the audit caught what it was meant to)

- **field:history Q1066186 over Q309** — audit confirmed the call: Q309 ("history" = the past) has **empty
  P31** and 316 sitelinks (a naive popularity match would grab the wrong sense); Q1066186 ("study of history")
  is P31 academic discipline + academic major, P279 humanities. The deliberate discipline-sense pick avoided
  exactly the era/concept trap.
- **Linguistic homonym survivals** — morphology Q38311, syntax Q37437, semantics Q39645 all carry P31
  "branch of linguistics" (Q135892289) and enwiki linguistics-sense sitelinks → NOT biology-morphology /
  programming-syntax / CS-semantics.
- **poetics Q835023 ≠ Aristotle's book** (Q264714) — confirmed the discipline (P279 literary theory).
- **comparative-religion Q1075827 ≠ a place/episode** — confirmed the discipline (enwiki/ru/ja all the field).
- **theology Q34178** carries a stray upstream P31 "literary genre" (Wikidata data-quality noise) — academic-
  discipline + humanities dominate via P31 + P279; no action (recorded).

## The 5 suspects — all referent-correct, P31-purity caveats (already documented in QC/goldenset)

| node | QID | caveat | disposition |
|---|---|---|---|
| ancient-history | Q41493 | P31 era-mixed (time-interval + historical-period + field-of-study); subclasses Q309 | **keep reviewed** — referent correct, has field-of-study P31, gate-anchored (LCC D51-90); Wikidata conflates period/study (known modeling gap). Caveat in goldenset. |
| semiotics | Q60195 | interdisciplinary discipline, not "branch of linguistics"; description notes non-linguistic signs | **keep reviewed** — correct entity; placement under linguistics is a curation choice (gate-primary, philosophy roots recorded). Taxonomy note, not a QID error. |
| discourse-analysis | Q1129466 | P31 leans analysis/method/concept (carries academic-discipline too) | **keep reviewed** — referent correct, gate-supported (UDC 81`42). |
| literary-criticism | Q58854 | P31 = literary genre / branch of literature / human activity (not "academic discipline") | **keep reviewed** — correct referent, gate-supported (UDC 82.09 pairs criticism+studies); the discipline-side is covered by literary-theory/literary-studies (separate nodes). The practice/subfield distinction is real and documented. |
| comparative-literature | Q834903 | P31 = academic major + branch of literature (no "academic discipline" class) | **keep reviewed** — description asserts discipline; academic-major is discipline-adjacent; comp-lit departments universal. |

> All five are "Wikidata P31 is weaker than ideal," not "wrong referent." If the curation invariant accepts
> academic-major / branch-of-X / field-of-study / interdisciplinary-science as discipline-equivalent (it does —
> precedent across all continents), only literary-criticism's genre/activity typing is genuinely borderline,
> and it is the correct referent with gate support. **No promotions reversed, no QIDs changed.**

## Cumulative

Confirmed residual errors after audit: **0 this batch**. Cumulative confirmed residual **2 (both seed-era;
Q864 Pokémon→Q864928, Q735→Q2018526)**; **pipeline-generated 0/355** (311 prior + 44 humanities). Goldenset
**+44 verified** (regression 0 — append-only, no existing entry changed); 1 upstream_gap (modern-history).
**No "audit queue" debt accrued** (inline-terminated).
