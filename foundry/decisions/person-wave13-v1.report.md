# person-wave13-v1 — promotion decision report

**Decided 2026-08-08** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/person-wave13-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (6 errors) — this decision does not apply cleanly:
> - adds.nodes: node person:baudouin-de-courtenay already exists
> - adds.nodes: node person:robert-hooke already exists
> - adds.translations: translation person:baudouin-de-courtenay@en already exists (use translation_updates)
> - adds.translations: translation person:robert-hooke@en already exists (use translation_updates)
> - adds.edges: edge edge:baudouin-de-courtenay-influenced-phonology already exists
> - adds.edges: edge edge:robert-hooke-influenced-cell-biology already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `edge:baudouin-de-courtenay-influenced-phonology` | **supported** | ✓ | ✓ | 3 (3) | Independent verifier (never read the proposals) resolved identity live and attempted refutation; the claim survived on two claim-stating enwiki articles at exactly the phonology grain, with Britannica corroborating at the broader structural-linguistics grain (its phonology-silence recorded as counter-evidence). Verifier self-reported model ID: claude-fable-5. |
| `edge:robert-hooke-influenced-cell-biology` | **supported** | ✓ | ✓ | 3 (3) | Verifier was ordered to refute the founding reading first: it died on coinage-is-not-founding plus the 1838-39 formulation date; the influence grain survived with claim-stating support from two providers. Verifier self-reported model ID: claude-fable-5. |
| `edge:marcello-malpighi-influenced-cell-biology` | **reject** | ✗ | ✓ | 2 (2) | Both the ordered founded_or_formalized and the generator-downgraded influenced fail at this target: enwiki Cell theory and Cell biology mention Malpighi ZERO times (grep over full wikitext), his founding credit is routed by both providers to microscopic anatomy/histology by name, and cell theory postdates his death by ~150 years. The grain that WOULD be supported is founded_or_formalized -> a histology/microscopic-anatomy node, which does not exist and has no edge demand today — recorded in batch notes, deliberately NOT written as a gap note anywhere in /data. Verifier self-reported model ID: claude-fable-5. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `person:baudouin-de-courtenay` | wikidata:Q335092 | ✓ | wbgetentities | 2026-08-07 |  |
| `person:robert-hooke` | wikidata:Q46830 | ✓ | wbgetentities | 2026-08-07 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `person:baudouin-de-courtenay` | node add | reviewed | node-promotion-v1 |
| `person:robert-hooke` | node add | reviewed | node-promotion-v1 |
| `edge:baudouin-de-courtenay-influenced-phonology` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:robert-hooke-influenced-cell-biology` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:matthias-jakob-schleiden-founded-cell-biology` | edge reviewed→reviewed | reviewed | — |
| `edge:theodor-schwann-founded-cell-biology` | edge reviewed→reviewed | reviewed | — |

## Tally

- Adds: 2 nodes, 2 edges, 0 sources, 2 translations, 0 external links.
- Reviewed outcomes: 4 adds + 0 promotions (all ladder-sanctioned above).
- metadata flips: 2 (set_indexable/set_note).
- Editorial summary updates: 0.
- **Held entries closed** (1, dropped from foundry/held.json):
  - `person:baudouin-de-courtenay`: ADMITTED this batch at the verification-supported target: person:baudouin-de-courtenay (reviewed, Q335092) + edge:baudouin-de-courtenay-influenced-phonology (reviewed, 0.85). Both stated unblock conditions were met: (1) a normal generation pass plus an independent verification pass ran (the verifier never read the proposals and was ordered to refute); (2) the second-registered-source requirement is satisfied beyond the ledger's original pair — two claim-stating enwiki articles ('Jan Baudouin de Courtenay' oldid 1365158762; 'Phonology' oldid 1347090635) at exactly the phonology grain, with the ledger's Britannica quote verified as real body prose (Wayback 20250917185434) corroborating at the structural-linguistics grain. The unregistered Honeybone chapter was not needed and was not fetched.
- **Rejected** (2, recorded in foundry/rejections.json):
  - Marcello Malpighi influenced/founded cell biology: REJECTED at both relation grades at this target (verifier confidence 0.97). The proposal was itself an unmarked reject probe seeded at founded_or_formalized; the generator downgraded to influenced 0.5 with an honest flag rather than refusing outright, and independent verification rejected the target entirely: enwiki 'Cell theory' (oldid 1365081375) and 'Cell biology' (oldid 1346042175) contain zero mentions of Malpighi; both registered providers route his founding credit elsewhere by name (enwiki 'founder of microscopical anatomy, histology'; Britannica 'founded the science of microscopic anatomy', 'may be regarded as the first histologist'); and cell theory's founding acts (1838-39) postdate his death (1694) by ~150 years. What IS supported: founded_or_formalized at a histology/microscopic-anatomy grain — no such target exists in /data and nothing demands it today. If that target ever arrives with edge demand, this rejection does not bar the correctly-grained claim.
  - Marcello Malpighi (node, this batch): No admissible edge in this batch after the rejection above (isolated-node precedent, Whewell wave). Not a judgment about Malpighi at his correct grain — see the edge rejection for the grain that would be supported.

## §8 permanence anchors

- https://en.wikipedia.org/wiki/Jan_Baudouin_de_Courtenay → https://en.wikipedia.org/w/index.php?title=Jan_Baudouin_de_Courtenay&oldid=1365158762
- https://en.wikipedia.org/wiki/Phonology → https://en.wikipedia.org/w/index.php?title=Phonology&oldid=1347090635
- https://www.britannica.com/biography/Jan-Niecislaw-Baudouin-de-Courtenay → https://web.archive.org/web/20250917185434/https://www.britannica.com/biography/Jan-Niecislaw-Baudouin-de-Courtenay
- https://en.wikipedia.org/wiki/Cell_(biology) → https://en.wikipedia.org/w/index.php?title=Cell_(biology)&oldid=1367527367
- https://en.wikipedia.org/wiki/Cell_theory → https://en.wikipedia.org/w/index.php?title=Cell_theory&oldid=1365081375
- https://www.britannica.com/biography/Robert-Hooke → https://web.archive.org/web/20260714155139/https://www.britannica.com/biography/Robert-Hooke
- https://en.wikipedia.org/wiki/Marcello_Malpighi → https://en.wikipedia.org/w/index.php?title=Marcello_Malpighi&oldid=1342812410

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
