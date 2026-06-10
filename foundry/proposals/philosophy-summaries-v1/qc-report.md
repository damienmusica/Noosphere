# Editorial QC report — batch:philosophy-summaries-v1

**Policy:** editorial-layer policy v1 (CPO-ratified 2026-06-10, vault decision log (10)b): generation = Sonnet subagent with mandatory per-item source hints; QC = orchestrator verifying every factual claim against external sources; only externally checkable facts may ship; a summary reaches `/data` only when its parent node is `reviewed`.
**Generation:** proposal-generator subagent (claude-sonnet-4-6), separated context, 2026-06-10, no network access (hints flagged as unverified by contract).
**QC:** Claude Fable 5 (claude-fable-5), orchestrator context, 2026-06-10. Method: (1) HTTP-verify every source-hint URL; (2) replace dead/wrong hints with live-verified reference pages; (3) check each summary's factual claims against the page content via targeted retrieval; (4) accept / edit (remove or re-anchor unverifiable clauses, correct errors) / reject per item.

## Headline numbers (governance dashboard)

- **Source-hint URL hallucination rate: 23/56 (41%).** The generator again hallucinated the *identifier* layer (URL slugs) while the *content* layer grounded well — same shape as the QID finding (~93%, grounding-report.md), milder in degree. Notable: SEP has no general entries for "philosophy", "ethics", "aesthetics", "political-philosophy" etc.; the generator assumed slugs exist for every field. IEP's fuzzy redirects (e.g. `/axiology/` → *Axiology of Theism*, `/normativ/` → *Normative Autonomy*) were treated as dead, not as matches.
- **Claim-level outcome over 28 items: 11 accepted as generated / 17 accepted after QC edits / 0 rejected.** Every clause of every applied summary is now backed by a live-verified reference page listed below.
- Generator self-flags were well-calibrated: all 4 `ambiguous: true` items genuinely needed edits (axiology, indian, islamic, renaissance).

## Notable QC catches (factual)

1. **indian-philosophy — factual error corrected:** generated text called Vedanta, Nyaya, and Mimamsa "later schools" separate from the astika group; Britannica explicitly lists all three among the six orthodox (astika) systems. Rewritten.
2. **renaissance-philosophy — date range corrected:** generated "14th–17th centuries" vs the verifying source's "approximately the mid-15th century to the early 17th century". Corrected to source.
3. **islamic-philosophy:** "8th–9th centuries" start not supported by the verifying page (9th century); unverifiable theme sentence removed; rewritten tightly against Britannica.
4. **pragmatism:** Dewey reframed from co-founder to classical-generation figure per SEP ("originated … around 1870" with Peirce and James; Dewey led the second classical generation).
5. **axiology:** generated text attributed value-theory's *broad* scope to "axiology"; SEP equates axiology with value theory in the *narrow* sense. Rewritten; unverifiable term-dating sentence (flagged by the generator) removed.
6. Trims of unverifiable clauses (no error implied, just not on the verifying page): bioethics (interdisciplinary enumeration), chinese (dates precision → 771–476 BCE per IEP), environmental-ethics ("ecological concern" motive), action (field-connections sentence), biology (fitness/adaptation/heredity sentence), language (reference/truth/vagueness enumeration), mathematics (applicability sentence), mind (mind-body-problem-as-THE-central-question phrasing softened to the source's "especially the relation of mind to body"), physics (laws-of-nature/inter-science clauses → probability/chance per source), science (demarcation → scientific change), medieval (themes re-anchored to SEP's list; "dominant method" softened to source-supported phrasing), aesthetics (psychology-of-perception clause).

## Verification table (final applied summaries)

All URLs HTTP-verified live and content-checked on 2026-06-10.

| node | disposition | verifying source(s) |
|---|---|---|
| `field:philosophy` | as generated¹ | <https://www.britannica.com/topic/philosophy> |
| `subfield:aesthetics` | QC-edited | <https://iep.utm.edu/aesthetics/> |
| `subfield:ancient-philosophy` | as generated | <https://iep.utm.edu/ancient-greek-philosophy/> |
| `subfield:axiology` | QC-edited | <https://plato.stanford.edu/entries/value-theory/> |
| `subfield:bioethics` | QC-edited | <https://www.britannica.com/topic/bioethics> |
| `subfield:chinese-philosophy` | QC-edited | <https://www.britannica.com/topic/Chinese-philosophy>, <https://iep.utm.edu/chinese-philosophy-overview-of-history/> |
| `subfield:environmental-ethics` | QC-edited | <https://plato.stanford.edu/entries/ethics-environmental/> |
| `subfield:epistemology` | as generated | <https://plato.stanford.edu/entries/epistemology/>, <https://www.britannica.com/topic/epistemology> |
| `subfield:ethics` | as generated | <https://www.britannica.com/topic/ethics-philosophy>, <https://www.britannica.com/topic/normative-ethics> |
| `subfield:indian-philosophy` | QC-edited (error fix) | <https://www.britannica.com/topic/Indian-philosophy> |
| `subfield:islamic-philosophy` | QC-edited | <https://www.britannica.com/topic/Islamic-philosophy> |
| `subfield:medieval-philosophy` | QC-edited | <https://plato.stanford.edu/entries/medieval-philosophy/>, <https://www.britannica.com/topic/Scholasticism> |
| `subfield:metaethics` | as generated | <https://plato.stanford.edu/entries/metaethics/>, <https://www.britannica.com/topic/normative-ethics> |
| `subfield:metaphysics` | as generated | <https://plato.stanford.edu/entries/metaphysics/> |
| `subfield:normative-ethics` | as generated | <https://www.britannica.com/topic/normative-ethics>, <https://plato.stanford.edu/entries/ethics-virtue/> |
| `subfield:philosophy-of-action` | QC-edited | <https://plato.stanford.edu/entries/action/> |
| `subfield:philosophy-of-biology` | QC-edited | <https://www.britannica.com/topic/philosophy-of-biology> |
| `subfield:philosophy-of-education` | as generated | <https://plato.stanford.edu/entries/education-philosophy/> |
| `subfield:philosophy-of-language` | QC-edited | <https://www.britannica.com/topic/philosophy-of-language> |
| `subfield:philosophy-of-law` | as generated | <https://iep.utm.edu/law-phil/> |
| `subfield:philosophy-of-mathematics` | QC-edited | <https://plato.stanford.edu/entries/philosophy-mathematics/> |
| `subfield:philosophy-of-mind` | QC-edited | <https://www.britannica.com/topic/philosophy-of-mind> |
| `subfield:philosophy-of-physics` | QC-edited | <https://www.britannica.com/topic/philosophy-of-physics> |
| `subfield:philosophy-of-science` | QC-edited | <https://www.britannica.com/topic/philosophy-of-science> |
| `subfield:philosophy-of-technology` | as generated | <https://plato.stanford.edu/entries/technology/> |
| `subfield:political-philosophy` | as generated | <https://www.britannica.com/topic/political-philosophy> |
| `subfield:pragmatism` | QC-edited | <https://plato.stanford.edu/entries/pragmatism/> |
| `subfield:renaissance-philosophy` | QC-edited | <https://www.britannica.com/topic/Renaissance-philosophy> |

¹ The opening definitional sentence abstracts over the page's definition plus its branch list; both constituents are on the page.

## Process notes

- The canonical schema stores summary text in `node-translations.json` with no per-summary citation field; this report is the permanent citation record (transparency-structure: Git + foundry provenance, decision log (3)).
- `summaries.proposed.json` retains the generator's original text and hints untouched — the original draft remains bulk re-auditable. The QC-final texts live in `/data` (this PR) and differ from the artifact exactly where this report says they do.
- All summaries are original prose; QC checked that no sentence reproduces source wording (license posture).
