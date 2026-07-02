# recheck-wave1-v1 — promotion decision report

**Decided 2026-07-02** · QC by Claude Fable (`claude-fable-5`) · generated from `foundry/decisions/recheck-wave1-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (5 errors) — this decision does not apply cleanly:
> - adds.sources: source source:britannica already exists
> - promotions: edge edge:economic-geography-part-of-human-geography has status "reviewed", expected "proposed"
> - promotions: edge edge:decision-theory-part-of-economics has status "reviewed", expected "proposed"
> - promotions: edge edge:criminology-part-of-law has status "reviewed", expected "proposed"
> - promotions: edge edge:criminology-part-of-sociology has status "reviewed", expected "proposed"

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `edge:economic-geography-part-of-human-geography` | **supported** | ✓ | — | 3 (3) |  |
| `edge:decision-theory-part-of-economics` | **supported** | ✓ | — | 3 (3) |  |
| `edge:criminology-part-of-law` | **supported** | ✓ | — | 2 (2) | Definitional counterpoint recorded: Britannica opens 'criminology, scientific study of the nonlegal aspects of crime' — law membership is classificatory/institutional (record-not-resolve). |
| `edge:criminology-part-of-sociology` | **supported** | ✓ | — | 3 (3) | LCC places criminology in the social-sciences class (HV), adjacent to rather than inside HM Sociology — containment tension recorded (record-not-resolve); co-equal with the law membership. |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `edge:economic-geography-part-of-human-geography` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |
| `edge:decision-theory-part-of-economics` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |
| `edge:criminology-part-of-law` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |
| `edge:criminology-part-of-sociology` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |

## Tally

- Adds: 0 nodes, 0 edges, 1 sources, 0 translations, 0 external links.
- Reviewed outcomes: 0 adds + 4 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (16):
  - `edge:alfred-russel-wallace-influenced-philosophy-of-biology`: Insufficient clean sourcing: niche teleology/selection-limits claim; SEP 'wallace' entry does not exist (slug 404). Needs alternative authoritative sources. (recheck: manual)
  - `edge:andreas-vesalius-influenced-art-history`: Modeling ruling: Fabrica influenced art, but 'influenced art-history' (the scholarly discipline) is indirect/weak — not a standard claim. Needs a re-ruling or a finer-grained target, not re-verification. (recheck: manual)
  - `edge:antoine-lavoisier-influenced-physics`: Target too broad (field:physics); a thermodynamics-grained target would be accurate but no such node exists yet. Trigger: thermodynamics-class node created. (recheck: manual)
  - `edge:bertrand-russell-influenced-computer-science`: Diffuse/mediated (via Church, Curry–Howard, Martin-Löf) and field:computer-science too broad; a programming-languages/type-theory-grained target would be cleaner. Trigger: type-theory-class node created. (recheck: manual)
  - `edge:cybernetics-influenced-systems-engineering`: Thin at the 'influenced' bar: single clear claim-stating source (WP systems-engineering history lists cybernetics among many contributors; WP Cybernetics does not reciprocate). Needs a second independent claim-stating source. (recheck: manual)
  - `edge:georges-cuvier-influenced-archaeology`: Indirect (stratigraphy/comparative method reached archaeology via geology); diffuse, field-grain broad. Needs a re-ruling or finer target. (recheck: manual)
  - `edge:gottfried-wilhelm-leibniz-influenced-computability-theory`: Long-range mediated claim (calculus ratiocinator as precursor); better as a looser precursor framing. Modeling ruling needed, not re-verification. (recheck: manual)
  - `edge:karl-pearson-influenced-sociology`: Diffuse (statistics adopted in quantitative sociology); field-grain target broad. (recheck: manual)
  - `edge:kurt-lewin-influenced-education`: Thin/indirect sourcing: second generator source was about Dewey, not Lewin (self-flagged). Needs a second independent Lewin-specific claim-stating source. (recheck: manual)
  - `edge:norbert-wiener-influenced-cognitive-psychology`: Near-duplicate risk with the existing information-theory→cognitive-psychology edge (both 'cognitive revolution' antecedents); needs a dedup ruling on the distinct cybernetic-feedback contribution. (recheck: manual)
  - `edge:roman-jakobson-influenced-semiotics`: Influence genuine but diffuse and partly bidirectional (Jakobson drew FROM Peircean semiotics); semiotics had independent foundations (Peirce, Saussure). Needs a direction/scope ruling. (recheck: manual)
  - `edge:ronald-fisher-influenced-epidemiology`: Epidemiology-specific link not surfaced verbatim live (Bradford Hill more direct); thin. Mirrors the wave-3 evo-bio→epidemiology hold. (recheck: manual)
  - `edge:vladimir-vernadsky-influenced-environmental-science`: Real but diffuse; Vernadsky already carries founded_or_formalized→geochemistry; field-grain target broad. (recheck: manual)
  - `edge:edmund-husserl-founded-intentionality`: Single-founder attribution imprecise: intentionality reintroduced by Brentano (no node), developed by Husserl. Trigger: person:franz-brentano node created (co-founder pattern, mirrors cofounder-closure-v1). (recheck: manual)
  - `edge:marvin-minsky-founded-symbolic-ai`: Symbolic AI (GOFAI) co-founded by Newell/Simon/McCarthy/Minsky; single-founder attribution held pending co-founder modeling (record-not-resolve). Trigger: co-founder person nodes created (cofounder-closure pattern). (recheck: manual)
  - `edge:george-lakoff-critiques-philosophy-of-mind`: Broad-target modeling precision: 'critiques the field' mirrors the chomsky discipline ruling; held on modeling precision, NOT a living-person escalation signal (Lakoff, P570 absent). (recheck: manual)

## §8 permanence anchors

- https://en.wikipedia.org/wiki/Economic_geography → https://en.wikipedia.org/w/index.php?title=Economic_geography&oldid=1343737292
- https://www.wikidata.org/wiki/Q187097 → https://web.archive.org/web/20260524044031/https://www.wikidata.org/wiki/Q187097
- https://www.wikidata.org/wiki/Q187097 → https://www.wikidata.org/w/index.php?title=Q187097&oldid=2511270914
- https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp → https://web.archive.org/web/20260611023459/https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp
- https://en.wikipedia.org/wiki/Decision_theory → https://web.archive.org/web/20260620165415/https://en.wikipedia.org/wiki/Decision_theory
- https://en.wikipedia.org/wiki/Decision_theory → https://en.wikipedia.org/w/index.php?title=Decision_theory&oldid=1360283692
- https://www.wikidata.org/wiki/Q177571 → https://web.archive.org/web/20251112232212/https://www.wikidata.org/wiki/Q177571
- https://www.wikidata.org/wiki/Q177571 → https://www.wikidata.org/w/index.php?title=Q177571&oldid=2506103612
- https://www.loc.gov/aba/cataloging/classification/lcco/lcco_h.pdf → https://web.archive.org/web/20260702083053/https://www.loc.gov/aba/cataloging/classification/lcco/lcco_h.pdf
- https://udcsummary.info/ → https://web.archive.org/web/20260607095749/https://udcsummary.info/
- https://www.britannica.com/science/criminology → https://web.archive.org/web/20260602142910/https://www.britannica.com/science/criminology
- https://en.wikipedia.org/wiki/Criminology → https://web.archive.org/web/20260630193857/https://en.wikipedia.org/wiki/Criminology
- https://en.wikipedia.org/wiki/Criminology → https://en.wikipedia.org/w/index.php?title=Criminology&oldid=1361116720
- https://en.wikipedia.org/wiki/Economic_geography — [SPN-FAILED] save did not materialize and no prior snapshot exists
- https://www.wikidata.org/wiki/Q187097 — [SPN-FAILED] fresh save did not materialize; using 39d-old snapshot
- https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp — [SPN-FAILED] fresh save did not materialize; using 21d-old snapshot
- https://en.wikipedia.org/wiki/Decision_theory — [SPN-FAILED] fresh save did not materialize; using 12d-old snapshot
- https://www.wikidata.org/wiki/Q177571 — [SPN-FAILED] fresh save did not materialize; using 232d-old snapshot
- https://udcsummary.info/ — [SPN-FAILED] fresh save did not materialize; using 25d-old snapshot

## Orchestrator commentary

**First production run of the decision-file toolchain (§15).** Session #54, same-day
follow-through on the ops-efficiency package (PR #149): the `foundry:recheck-held` sweep
surfaced 32 "no structural blocker" proposed edges; note-level triage split them honestly —

- **16 = deliberate holds with still-valid reasons** (13 `influenced` diffuse/thin/broad-target
  holds re-adjudicated as recently as a-relations-wave6; 2 single-founder attributions awaiting
  co-founder nodes [Brentano; Newell/Simon/McCarthy]; Lakoff `critiques` broad-target modeling
  hold, living-person (70) floor noted). Re-verifying these cannot clear a modeling ruling, so
  they are now **ledgered in `foundry/held.json`** with named triggers — the recheck tool
  will stop presenting them as naive candidates.
- **11 = policy-blocked** (editorial/legacy `evidence_kind` — stop at proposed until an
  editorial edge ladder is earned; recheck-held now buckets these separately).
- **4 = genuinely verification-blocked** ([UNFETCHED] supplementary evidence) → live-grounded
  and promoted here under the structural tier. Criminology's dual membership is the
  cross-listing-v1 showcase: UDC nests it under criminal law while Britannica records the
  split departmental placement — both memberships promoted co-equally with the tension
  recorded, not resolved.
- **1 remains** a true candidate: `evolutionary-biology-applies-to-epidemiology` — whether
  `applies_to` belongs to the structural tier is not stated in ratified text. **One-line CPO
  ruling requested** (non-blocking flag, decision-file notes).

Wayback SPN weather today was poor (all fresh saves failed → honest `[SPN-FAILED]` pendings
with recent-snapshot fallbacks); Wikipedia/Wikidata sources carry immutable `oldid` revision
permalinks per decision (92), so no verdict-bearing source is unanchored. Toolchain observations:
`set_note`/`set_evidence` promotion ops were added to the apply tool during this wave (promoted
edges carry grounding narratives inline per the (68)-wave pattern); anchor gained
wikidata.org revision permalinks.
