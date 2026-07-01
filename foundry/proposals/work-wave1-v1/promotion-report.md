# Promotion report — `work-wave1-v1`

Session #48, 2026-07-01. What entered `/data` `reviewed` and under which policy.

## Gate context
`work-wave1` (session #47, decision (87)) was built **measure-first / proposed-first**: 9 `work` nodes +
18 `canonical_work` edges landed at `proposed`, the ladder deliberately *unopened*. This session is the
**CPO ladder-opening gate** (decision (87) Stage 3). CPO ratified opening (option A, decision (88)):
open the `work`-node and `canonical_work` auto-`reviewed` ladders, codify keep-criteria W1–W5 in
`docs/data-foundry.md` §8, and promote this earned batch.

## Live re-verification before promotion (9/9 clean)
Each work QID re-verified live at promotion time (local session — enwiki pageprops + Wikidata
`wbgetentities` P31/P50/P577 + enwiki sitelink). **All 9 passed; 0 corrections needed** (the QIDs were
already the independently-corrected values from #47, not the generator's 9/9 hallucinations):

| Work node | QID | P31 (work-type) | P50 author = endpoint | P577 year | enwiki |
|---|---|---|---|---|---|
| on-the-origin-of-species | Q20124 | written work | ✓ Q1035 | ✓ 1859 | ✓ |
| philosophiae-…-principia-mathematica | Q205921 | written work / treatise / academic work | ✓ Q935 | ✓ 1687 | ✓ |
| principles-of-geology | Q1348323 | written work | ✓ Q5333 | ✓ 1830 | ✓ |
| the-wealth-of-nations | Q233562 | literary work | ✓ Q9381 | ✓ 1776 | ✓ |
| de-humani-corporis-fabrica | Q1233009 | written work / treatise | ✓ Q170267 | ✓ 1543 | ✓ |
| systema-naturae | Q29270 | written work | ✓ Q1043 | ✓ 1735 | ✓ |
| traite-elementaire-de-chimie | Q2163561 | scientific work / literary work | ✓ Q39607 | ✓ 1789 | ✓ |
| cours-de-linguistique-generale | Q13231 | academic work | ✓ Q13230 | ✓ 1916 | ✓ |
| experiments-on-plant-hybridization | Q5421194 | scientific work / written work / journal article | ✓ Q37970 | ✓ 1866 | ✓ |

All 18 endpoints (9 fields/subfields + 9 authors) re-confirmed `reviewed`; all authors `is_living_person:
false` (no living-author guard fired).

## Written `reviewed`
- **9 `work` nodes** — work-node ladder / keep-criteria W4 (decision (88)): QID resolver-verified live
  (P31 work-type + P50 author-match + P577 year + enwiki sitelink) with both anchored endpoints already
  `reviewed`. Mirror of node-promotion policy v1. `indexable: false` (indexability earned separately —
  SEO-only, orthogonal to explorability).
- **18 `canonical_work` edges** — `canonical_work` ladder (decision (88), 1:1 mirror of the (60)/(61)
  `founded_or_formalized` ladder): both endpoints `reviewed` + Lane B **supported** (≥2 independent
  live claim-stating sources + adversarial perspective-diverse QC + direction correct [work always
  `source`] + identity referent verified). Per work = 2-edge canonical triangle (`work→field` +
  `work→person`). 0 `disputed` / NEI / reject in the batch.

## Held / not written this batch
- **`work:the-biosphere` (Vernadsky) — dropped in #47, not resurrected.** No identity-decidable Wikidata
  book item (stub Q139866076 = no author/date/sitelink; concept Q42762 = referent mismatch). Re-attempt
  only if an English-edition book QID appears (honesty-gap parity with fractal-geometry / JDM). Not a
  ladder failure — it never met keep-criterion W2.
- **Rejection probes (2) — never entered `/data`.** R1 Origin→Wallace (mis-attribution; live P50 = [Q1035]
  only) + R2 Principia→evolutionary-biology (anachronism, 1687 vs 1859). Recorded as discriminating-power
  evidence, not held items.

## Invariants
Schema / taxonomy unchanged (`work`, `canonical_work` already existed). 0 new sources (23 → 23).
In-place status flip only — **27 lines changed (9 nodes + 18 edges), 27 ins / 27 del, 0 reformat**.
No `disputed: true` introduced. Living endpoints: 0. typecheck ✓ validate ✓ (560 nodes, 666 edges).

## Measurement that earned the ladder (decision (87) → (88))
Precision **1.0 (18/18 supported)** · generator-QID-hallucination catch **100% (9/9)** · rejection-probe
**2/2** · direction **18/18** · hallucination **0** — same bar as the founder ladder (decision (59),
precision 1.0 at N=20). The separated-generation + independent live-verification contract remains the
load-bearing safety mechanism: the ladder re-verifies every QID live, so a generator hallucination cannot
reach `/data` regardless of ladder state.
