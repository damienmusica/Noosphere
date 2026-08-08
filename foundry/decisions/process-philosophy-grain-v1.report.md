# process-philosophy-grain-v1 — promotion decision report

**Decided 2026-08-08** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/process-philosophy-grain-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (8 errors) — this decision does not apply cleanly:
> - adds.nodes: node concept:process-philosophy already exists
> - adds.nodes: node person:charles-hartshorne already exists
> - adds.translations: translation concept:process-philosophy@en already exists (use translation_updates)
> - adds.translations: translation person:charles-hartshorne@en already exists (use translation_updates)
> - adds.edges: edge edge:process-and-reality-canonical-work-process-philosophy already exists
> - adds.edges: edge edge:alfred-north-whitehead-influenced-process-philosophy already exists
> - adds.edges: edge edge:charles-hartshorne-influenced-process-philosophy already exists
> - adds.edges: edge edge:process-philosophy-part-of-metaphysics already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `edge:process-and-reality-canonical-work-process-philosophy` | **supported** | ✓ | ✓ | 2 (2) | Verified by the concept-demand verifier (refutation-first, live): zero counter-evidence at the work grain. Verifier self-reported model ID: claude-fable-5. |
| `edge:alfred-north-whitehead-influenced-process-philosophy` | **supported** | ✓ | ✓ | 3 (2) | The founder-grade claim was swept across SEP/enwiki/IEP/Britannica/PhilPapers by an independent verifier: 0 clean founder-grade registered sources — see this batch's rejection entry. Verifier self-reported model ID: claude-fable-5. |
| `edge:charles-hartshorne-influenced-process-philosophy` | **supported** | ✓ | ✓ | 3 (2) | Founding refuted by silence (no founding verbs anywhere); disciple framing refuted by SEP's own pushback — both recorded on the edge note. Identity Q1064777, P570 2000-10-09 (the orchestrator's order carried the circulating wrong year 2003; the verifier corrected it). Verifier self-reported model ID: claude-fable-5. |
| `edge:process-philosophy-part-of-metaphysics` | **supported** | ✓ | ✓ | 2 (2) | The registry placement is the taxonomy-authority anchor (decision (102)); the quote field records the placement path, not prose — the snapshot is the anchor. enwiki corroborates the broader genus. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `concept:process-philosophy` | wikidata:Q2114360 | ✓ | wbgetentities | 2026-08-08 |  |
| `person:charles-hartshorne` | wikidata:Q1064777 | ✓ | wbgetentities | 2026-08-08 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `concept:process-philosophy` | node add | reviewed | node-promotion-v1 |
| `person:charles-hartshorne` | node add | reviewed | node-promotion-v1 |
| `edge:process-and-reality-canonical-work-process-philosophy` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:alfred-north-whitehead-influenced-process-philosophy` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:charles-hartshorne-influenced-process-philosophy` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:process-philosophy-part-of-metaphysics` | edge add (part_of) | reviewed | edge-promotion-v1-structural |

## Tally

- Adds: 2 nodes, 4 edges, 0 sources, 2 translations, 0 external links.
- Reviewed outcomes: 6 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held entries closed** (2, dropped from foundry/held.json):
  - `subfield:process-philosophy`: RESOLVED — the unblock executed in full, in the concept form it prescribed: concept:process-philosophy (reviewed, Q2114360) + edge:process-philosophy-part-of-metaphysics (the unblock's verbatim part_of prescription) + documented edge demand (edge:process-and-reality-canonical-work-process-philosophy — two claim-stating enwiki articles; work-wave7-v1 admitted the work). The unblock's 'the Whitehead claim below must clear first' clause is resolved in the direction it did not anticipate but whose guard it satisfies: the founder claim CLOSED (permanent rejection on a measured sweep, this batch) rather than cleared, and the demand arrived independently via the work's canonical grain — the node is not a target-of-convenience for an unverified founder edge; the founder edge does not exist and cannot be written.
  - `person:alfred-north-whitehead`: RESOLVED — both unblock paths measured and dispositioned. Path 2 (≥2 founder-grade registered sources for process philosophy as such): measured at ZERO clean sources by a full registered-provider sweep → converted to a permanent rejection (this batch). Path 1 (a node at the Whitehead-Hartshorne grain with Hartshorne considered alongside under record-not-resolve): executed — concept:process-philosophy admitted with edge:alfred-north-whitehead-influenced-process-philosophy (0.8, the SEP-supported grain) standing alongside edge:charles-hartshorne-influenced-process-philosophy (0.75) and the work-canonical edge from Process and Reality. The summary clause was already resolved by editorial-batch13-v1.
- **Rejected** (1, recorded in foundry/rejections.json):
  - Whitehead founded/formalized process philosophy (permanent, measured): PERMANENTLY REJECTED on a full measured sweep (independent verifier, refutation-first, live 2026-08-08, all registered providers): count of clean claim-stating registered sources at founder grade for process philosophy AS SUCH = 0, at most 1 counting enwiki's lead sentence ('He created the philosophical school known as process philosophy') — which rests on a footnote page-citation already ruled furniture in editorial-batch13-v1 and is contradicted by the same article's own body ('Whitehead referred to his metaphysical system as the "philosophy of organism," but it would become known more widely as "process philosophy."'). Against: SEP Whitehead (sum2026) denies any school in his lifetime twice; SEP Process Philosophy names Heraclitus 'commonly recognized as the founder of the process approach' and states the field 'is not tied to any school, method, position, or even paradigmatic notion of process'; SEP's strongest single-person language is 'instrumental in pioneering' (pioneering ≠ founding); Britannica's Whitehead article uses 'process philosophy' only in its Top Questions furniture; PhilPapers' category page has no editorial prose; IEP associates the TERM with the Whitehead-Hartshorne pair. The supported grain is influenced (edge:alfred-north-whitehead-influenced-process-philosophy, this batch, 0.8). Re-openable only by new founder-grade claim-stating sources from ≥2 registered providers — the standing bar, now with a measured baseline of zero.

## §8 permanence anchors

- https://en.wikipedia.org/wiki/Alfred_North_Whitehead → https://en.wikipedia.org/w/index.php?title=Alfred_North_Whitehead&oldid=1361815510
- https://en.wikipedia.org/wiki/Process_philosophy → https://en.wikipedia.org/w/index.php?title=Process_philosophy&oldid=1365901441
- https://plato.stanford.edu/entries/whitehead/ → https://plato.stanford.edu/archives/sum2026/entries/whitehead/
- https://en.wikipedia.org/wiki/Charles_Hartshorne → https://en.wikipedia.org/w/index.php?title=Charles_Hartshorne&oldid=1359826539
- https://iep.utm.edu/processp/ → https://web.archive.org/web/20260805122838/https://iep.utm.edu/processp/
- https://plato.stanford.edu/entries/process-philosophy/ → https://plato.stanford.edu/archives/sum2026/entries/process-philosophy/
- https://philpapers.org/browse/process-philosophy → http://web.archive.org/web/20260218155005/https://philpapers.org/browse/process-philosophy

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
