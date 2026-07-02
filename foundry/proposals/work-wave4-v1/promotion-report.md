# work-wave4-v1 — promotion report

**Session #52, 2026-07-02.** What entered `/data`. Verdicts: `qc-report.md`; probe key: `probes.md`;
anchors: `report.md`.

## Promoted → `reviewed` (7 works + 14 `canonical_work` edges)

Each work: QID resolver-verified live (generator QID was hallucinated), P31 = written/scholarly-work
type, P50 = matches the linked person, P577 or an uncontested decidable year (criterion 3, decision
(89)); author + field endpoints both already `reviewed`. Two edges per work (work→field, work→person).

| Work | QID | Year | → field/subfield | → person |
|---|---|---|---|---|
| Tractatus Logico-Philosophicus | Q655717 | 1921 | philosophy-of-language | ludwig-wittgenstein |
| Logical Investigations | Q3421975 | 1900 | phenomenology | edmund-husserl |
| Structural Anthropology | Q2844127 | 1958 | structural-anthropology | claude-levi-strauss |
| Syntactic Structures | Q1198080 | 1957 | syntax | noam-chomsky ★living |
| The Social Stratification of English in NYC | Q130572843 | 1966 | sociolinguistics | william-labov |
| Capital, Volume I | Q58784 | 1867 | sociology (co-canonical #4) | karl-marx |
| The Problems of Philosophy | Q3393210 | 1912 | analytic-philosophy (co-canonical #1) | bertrand-russell |

- **Co-canonical (decision (90))**: `field:sociology` now holds a 4th canonical work (Capital,
  alongside Comte/Durkheim/Weber); `subfield:analytic-philosophy` gets its 1st.
- **Living author**: Syntactic Structures' author (Chomsky) is living — a neutral bibliographic
  artifact with no escalation signal, so it auto-promotes (work-node living-author guard, decision (70)).
- **Literature boundary (decision (86))**: applied as a rule, not a stop-point. All 7 are
  knowledge-works (treatises founding a reviewed field). Literature-as-art is Booksphere-reserved and
  not proposed — Noosphere is a knowledge globe.

## Dropped (honesty gap, 1)
- Jakobson *Kindersprache, Aphasie und allgemeine Lautgesetze* (1941) — no clean Wikidata work item
  resolved live; dropped rather than force-fit (Koch/Snow/Vernadsky precedent).

## Reject probes fired (2/2)
- `Tractatus → canonical_work → bertrand-russell` — misattribution (P50 = Wittgenstein, not Russell).
- `Syntactic Structures → canonical_work → sociolinguistics` — wrong field (founds syntax).

## Ledger
Nodes 574→581 (+7 `work`). Edges +14 `canonical_work` (`reviewed`). Schema/sources unchanged.
