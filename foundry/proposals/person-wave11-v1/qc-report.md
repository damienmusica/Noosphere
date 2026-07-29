# QC report — `person-wave11-v1`

Session #60, Track G. Person-layer expansion scoped by a single rule: **every candidate is someone
whose absence was recorded as an explicit honest gap in a decision file earlier in this same
session.** That makes the edge demand verifiable rather than asserted.

Generation: separated-context **Claude Sonnet 5** (`proposal-generator`), edges + one concept node.
Identity, verdicts and adversarial QC: orchestrator (**Claude Opus**) against live sources.
Decision file: `foundry/decisions/person-wave11-v1.json` (authoritative).

## Outcome

5 person nodes + 1 concept node + 8 edges `reviewed` · 1 node dropped · 1 edge held NEI ·
2 rejections ledgered · `fetch-verify` **25/25 PASS** against §8 anchors (22 revision permalinks,
0 pending).

| gap opened earlier this session | closed? |
|---|---|
| `concept:entropy` had no founder edge | ✅ Clausius (founder) + Boltzmann (`formalizes`) |
| `concept:cell-theory` had 2 of 3 founders | ✅ Virchow, with the Remak contest on the edge |
| `concept:theory-of-relativity` rejected for want of Einstein | ✅ re-admitted via `override_rejections` |
| `edge:bertrand-russell-founded-type-theory` co-authorship gap | ❌ **stays open** — see Whitehead |
| `concept:germ-theory-of-disease` had no founder edge | ❌ **stays open** — see Fracastoro |

## ★ Two QC corrections to the generator

**Fracastoro was proposed as germ theory's founder.** The sources split: `Germ theory of disease`
says "Basic forms of germ theory were proposed by Girolamo Fracastoro in 1546", but Fracastoro's own
article calls the same work a precursor — "his 'seeds of disease' theory is considered as a
predecessor to germ theory". One founding claim and one predecessor claim do not clear the founder
ladder's two-source bar; both support influence. **Relation downgraded to `influenced`**, which
leaves `concept:germ-theory-of-disease` with no founder edge at all — the accurate state of the
evidence, not an oversight. (Pasteur and Koch were ruled NEI in `concept-wave3-v1`; von Plenciz, named
alongside Fracastoro, is not a node.)

**Clausius → thermodynamics was proposed at 0.72, flagged ambiguous, and the flag was right.** The
person article does say "one of the central founding fathers of the science of thermodynamics", but
the field article — the second source the (62) operational interpretation relies on — states a
*contribution* ("restated Carnot's principle … and gave the theory of heat a more accurate and
sounder basis") and credits Lord Kelvin with the first concise definition in 1854. **Held NEI.**
Clausius's entropy founder edge is unaffected at 0.95.

## ★ Generator and QC independently dropped Whitehead

He was slated to close the *Principia* co-authorship gap on the Russell type-theory edge. He does not
close it: SEP says "The theory of types was introduced by Russell", and the *Principia Mathematica*
article says only that PM *adopted* it. His own sourced founder claim — "He created the philosophical
school known as process philosophy" — has no corpus endpoint. Admitting him would create an isolated
node, so the **node is dropped as an honesty gap** rather than justified by inventing an endpoint for
it. Mirrors the Snow and Vernadsky-*Biosphere* drops.

## ★ The ladder gate refused two edges, and the fix was research, not a downgrade

First `ladder-check` run rejected `poincare → theory-of-relativity` and
`boltzmann → statistical-physics`: one claim-stating source each. Both were resolved by finding a
genuine second source — `History of special relativity` for Poincaré, the Boltzmann person article
for Boltzmann — and the search is recorded in each verdict. The arithmetic caught what prose
confidence would have waved through.

## ★ A redirect check overturned the orchestrator's own written reasoning

Having refused a near-name bridge earlier this session (entropy was *not* cross-listed onto
`subfield:statistical-physics` on the strength of a statistical-mechanics mention), the Boltzmann
edge was justified on the ground that its founding sentence sat in an article titled
*Statistical physics*. **That was wrong.** `en.wikipedia.org/wiki/Statistical_physics` is a
**redirect** to *Statistical mechanics* — verified live, the API reports
`redirects: [{from: "Statistical physics", to: "Statistical mechanics"}]`.

Same class of failure as the IEP fuzzy redirect decision (110) found: a citation silently reaching a
different document than the one named. The citation was re-anchored on the canonical URL per §8 and
the reasoning rewritten. The **conclusion survived and was strengthened** — enwiki does not treat the
two as distinct topics, and Q677916 (this node's QID) sitelinks to that same merged article — while
Wikidata separately keeps Q188715. The divergence is recorded, not resolved.

Recorded because the near-miss, not the outcome, is the useful part.

## Priority disputes recorded, never adjudicated

- **Relativity**: enwiki maintains a dedicated *Relativity priority dispute* article. Read in full, it
  debates *credit and share*, not whether Einstein authored the 1905 and 1915 theories — existence and
  direction agreed, so §8 routes it to supported + note rather than `disputed`. Poincaré gets his own
  reviewed `influenced` edge rather than a footnote. Lorentz, named in both sources, is an honest gap.
- **Cell theory's third tenet**: both articles record that the idea was Remak's — "now widely
  recognized as being plagiarized from Robert Remak". What is agreed is that Virchow put the tenet
  *into cell theory*; what is contested is originating it. Supported on the former, confidence held to
  **0.75** for the latter, contest written on the edge face. **Robert Remak is the honest gap most
  worth closing next on this concept.**

## Relation choice: the batch's substantive judgment

`clausius → founded_or_formalized → entropy` but `boltzmann → formalizes → entropy`. Clausius
originated the concept in 1865; Boltzmann supplied its statistical foundation twelve years later, and
both sources date and describe that gap. Recording both as co-founders would erase the fact that one
gave the concept its macroscopic definition and the other its microscopic one.

## Notes

Boltzmann's Wikidata item carries **two competing death dates** a day apart (1906-09-05 and
1906-09-06). Recorded rather than silently picked; immaterial to the deceased ladder.
All five persons carry a live P570, so decision (70) does not engage.

## §8 permanence anchors

All 22 are publisher-run immutable editions — MediaWiki revision permalinks plus SEP fixed editions. No Wayback snapshot required, none pending. The Statistical physics row is the canonical target after redirect resolution.

| Source read | Anchor |
|---|---|
| en.wikipedia.org/wiki/Alfred_North_Whitehead | `…&oldid=1361815510` |
| en.wikipedia.org/wiki/Cell_theory | `…&oldid=1365081375` |
| en.wikipedia.org/wiki/Entropy | `…&oldid=1361126134` |
| en.wikipedia.org/wiki/Germ_theory_of_disease | `…&oldid=1363463071` |
| en.wikipedia.org/wiki/Girolamo_Fracastoro | `…&oldid=1360678484` |
| en.wikipedia.org/wiki/History_of_special_relativity | `…&oldid=1363950802` |
| en.wikipedia.org/wiki/Ludwig_Boltzmann | `…&oldid=1362784115` |
| en.wikipedia.org/wiki/Principia_Mathematica | `…&oldid=1356011315` |
| en.wikipedia.org/wiki/Relativity_priority_dispute | `…&oldid=1365856267` |
| en.wikipedia.org/wiki/Rudolf_Clausius | `…&oldid=1365811715` |
| en.wikipedia.org/wiki/Rudolf_Virchow | `…&oldid=1361411508` |
| en.wikipedia.org/wiki/Statistical_mechanics | `…&oldid=1365220532` |
| en.wikipedia.org/wiki/Theory_of_relativity | `…&oldid=1346554258` |
| en.wikipedia.org/wiki/Thermodynamics | `…&oldid=1362668588` |
| plato.stanford.edu/entries/type-theory/ | `https://plato.stanford.edu/archives/sum2026/entries/type-theory/` |
| www.wikidata.org/wiki/Q177935 | `…&oldid=2523318691` |
| www.wikidata.org/wiki/Q30693 | `…&oldid=2521158978` |
| www.wikidata.org/wiki/Q318593 | `…&oldid=2514748159` |
| www.wikidata.org/wiki/Q43514 | `…&oldid=2517110638` |
| www.wikidata.org/wiki/Q76432 | `…&oldid=2524074209` |
| www.wikidata.org/wiki/Q84296 | `…&oldid=2517096989` |
| www.wikidata.org/wiki/Q937 | `…&oldid=2524382135` |
