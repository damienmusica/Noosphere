# work-wave7-v1 — promotion decision report

**Decided 2026-08-08** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/work-wave7-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (15 errors) — this decision does not apply cleanly:
> - adds.nodes: node work:being-and-time already exists
> - adds.nodes: node work:being-and-nothingness already exists
> - adds.nodes: node work:micrographia already exists
> - adds.nodes: node work:either-or already exists
> - adds.nodes: node work:process-and-reality already exists
> - adds.translations: translation work:being-and-time@en already exists (use translation_updates)
> - adds.translations: translation work:being-and-nothingness@en already exists (use translation_updates)
> - adds.translations: translation work:micrographia@en already exists (use translation_updates)
> - adds.translations: translation work:either-or@en already exists (use translation_updates)
> - adds.translations: translation work:process-and-reality@en already exists (use translation_updates)
> - adds.edges: edge edge:being-and-time-canonical-work-martin-heidegger already exists
> - adds.edges: edge edge:being-and-nothingness-canonical-work-jean-paul-sartre already exists
> - adds.edges: edge edge:micrographia-canonical-work-robert-hooke already exists
> - adds.edges: edge edge:either-or-canonical-work-soren-kierkegaard already exists
> - adds.edges: edge edge:process-and-reality-canonical-work-alfred-north-whitehead already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `edge:being-and-time-canonical-work-martin-heidegger` | **supported** | ✓ | ✓ | 2 (2) | Identity Q404567: P31 philosophy book, P50 Q48301 (= corpus QID for person:martin-heidegger), P577 1927, 44 sitelinks. QC = orchestrator (claude-fable-5), live wbsearch + wbgetentities. |
| `edge:being-and-nothingness-canonical-work-jean-paul-sartre` | **supported** | ✓ | ✓ | 3 (3) | Identity Q119709: P50 Q9364 (matching), P577 1943, 41 sitelinks; twin Q140253239 = P50-less 0-sitelink stub, excluded. |
| `edge:micrographia-canonical-work-robert-hooke` | **supported** | ✓ | ✓ | 2 (2) | Identity Q2469465: P50 Q46830 (matching), P577 1665-01, 22 sitelinks; clinical-sign homonym Q6839570 excluded. |
| `edge:either-or-canonical-work-soren-kierkegaard` | **supported** | ✓ | ✓ | 2 (2) | Identity Q1152009: P50 Q6512 (matching, despite the Victor Eremita editorial pseudonym), P577 1843, 22 sitelinks, enwiki title Either/Or (Kierkegaard book); album/novel/edition homonyms excluded. SEP corroboration found at QC — confidence raised 0.87 -> 0.9. |
| `edge:process-and-reality-canonical-work-alfred-north-whitehead` | **supported** | ✓ | ✓ | 3 (2) | Identity Q455957: P50 Q183372 (matching), P577 1929 (original, not the 1978 corrected edition — the generator-flagged misdating risk is resolved), 9 sitelinks; twin Q130330690 (P50-less, 0 sitelinks) and paperback item Q126697610 excluded. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `work:being-and-time` | wikidata:Q404567 | ✓ | wbgetentities | 2026-08-08 |  |
| `work:being-and-nothingness` | wikidata:Q119709 | ✓ | wbgetentities | 2026-08-08 |  |
| `work:micrographia` | wikidata:Q2469465 | ✓ | wbgetentities | 2026-08-08 |  |
| `work:either-or` | wikidata:Q1152009 | ✓ | wbgetentities | 2026-08-08 |  |
| `work:process-and-reality` | wikidata:Q455957 | ✓ | wbgetentities | 2026-08-08 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `work:being-and-time` | node add | reviewed | node-promotion-v1 |
| `work:being-and-nothingness` | node add | reviewed | node-promotion-v1 |
| `work:micrographia` | node add | reviewed | node-promotion-v1 |
| `work:either-or` | node add | reviewed | node-promotion-v1 |
| `work:process-and-reality` | node add | reviewed | node-promotion-v1 |
| `edge:being-and-time-canonical-work-martin-heidegger` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:being-and-nothingness-canonical-work-jean-paul-sartre` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:micrographia-canonical-work-robert-hooke` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:either-or-canonical-work-soren-kierkegaard` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |
| `edge:process-and-reality-canonical-work-alfred-north-whitehead` | edge add (canonical_work) | reviewed | canonical-work-auto-88 |

## Tally

- Adds: 5 nodes, 5 edges, 0 sources, 5 translations, 0 external links.
- Reviewed outcomes: 10 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.

## §8 permanence anchors

- https://plato.stanford.edu/entries/heidegger/ → https://plato.stanford.edu/archives/sum2026/entries/heidegger/
- https://en.wikipedia.org/wiki/Martin_Heidegger → https://en.wikipedia.org/w/index.php?title=Martin_Heidegger&oldid=1366448599
- https://en.wikipedia.org/wiki/Jean-Paul_Sartre → https://en.wikipedia.org/w/index.php?title=Jean-Paul_Sartre&oldid=1367693189
- https://plato.stanford.edu/entries/sartre/ → https://plato.stanford.edu/archives/sum2026/entries/sartre/
- https://iep.utm.edu/existent/ → https://web.archive.org/web/20260802113204/https://iep.utm.edu/existent/
- https://en.wikipedia.org/wiki/Robert_Hooke → https://en.wikipedia.org/w/index.php?title=Robert_Hooke&oldid=1367205638
- https://www.britannica.com/biography/Robert-Hooke → https://web.archive.org/web/20260714155139/https://www.britannica.com/biography/Robert-Hooke
- https://en.wikipedia.org/wiki/S%C3%B8ren_Kierkegaard → https://en.wikipedia.org/w/index.php?title=S%C3%B8ren_Kierkegaard&oldid=1365518285
- https://plato.stanford.edu/entries/kierkegaard/ → https://plato.stanford.edu/archives/sum2026/entries/kierkegaard/
- https://en.wikipedia.org/wiki/Alfred_North_Whitehead → https://en.wikipedia.org/w/index.php?title=Alfred_North_Whitehead&oldid=1361815510
- https://iep.utm.edu/whitehead/ → https://web.archive.org/web/20260806154147/https://iep.utm.edu/whitehead/

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
