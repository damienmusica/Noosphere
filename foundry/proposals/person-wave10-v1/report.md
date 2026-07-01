# Batch report — `person-wave10-v1`

Generation: Claude Sonnet 5 (`claude-sonnet-5`), 2026-07-01, separated generation context (ADR 0007).
QC / promotion: orchestrator (Claude Opus) session #46, live multi-signal QID verification — a
separate context from generation (ADR 0007 separation). This file is the orchestrator's record
(the generator's Write of `report.md` was blocked by subagent tool policy; content authored here).

## What / why

Person wave 10 — **Phase-1 founder-layer final closeout**, three groups per the session order:

- **Group A — cell biology** (2 nodes / 2 edges): the last clean founderless single subfield
  (`subfield:cell-biology`) — Schwann + Schleiden, co-founders of cell theory.
- **Group B — symmetric co-founder edges** (5 nodes / 5 edges, Powell dropped at QC): each target
  already had exactly one reviewed founder in `/data`; this adds the documented co-founder.
- **Group C — Vienna Circle membership** (5 nodes / 5 `member_of` edges): extends the existing
  Schlick/Carnap/Neurath roster with five more inner-circle members.

All 13 generated people are deceased. All 7 target field/subfield/institution nodes already exist
in `/data` as `reviewed` at the exact IDs specified — no target node was created or renamed.

| Target | State in `/data` | Existing founder / members |
|---|---|---|
| `subfield:cell-biology` | reviewed, no founder | — |
| `subfield:ecology` | reviewed | `person:ernst-haeckel` |
| `subfield:geochemistry` | reviewed | `person:victor-moritz-goldschmidt` |
| `subfield:geology` | reviewed | `person:james-hutton` |
| `subfield:geomorphology` | reviewed | `person:william-morris-davis` |
| `field:psychiatry` | reviewed | `person:emil-kraepelin` |
| `institution:vienna-circle` | reviewed | Schlick / Carnap / Neurath |

## Counts

- **13 nodes generated → 12 promoted to `/data`** (all `person`, deceased, `indexable:false`,
  `academic_status` omitted per the decision (58) person-node contract).
- **13 edges generated → 12 promoted** (7 `founded_or_formalized` + 5 `member_of`).
- **1 QC reject** (see below): `person:john-wesley-powell` + `edge:...-founded-geomorphology`.
- **0 reconciled to existing** — none of the people already existed as nodes.

## QID QC — 13/13 generator guesses hallucinated (corrected live)

Consistent with prior waves, **every generator-guessed QID was wrong** (0/13 correct). All corrected
via `enwiki pageprops → wbgetentities` (P31=Q5 + P569 + P570 + enwiki sitelink):

| Person | Generator guess | Verified (live) | b–d |
|---|---|---|---|
| Theodor Schwann | Q57247 | **Q76745** | 1810–1882 |
| Matthias Jakob Schleiden | Q57249 | **Q76747** | 1804–1881 |
| Eugenius Warming | Q705645 | **Q355888** | 1840/41–1924 |
| Vladimir Vernadsky | Q168751 | **Q316371** | 1863–1945 |
| Charles Lyell | Q131691 | **Q5333** | 1797–1875 |
| Grove Karl Gilbert | Q444147 | **Q463448** | 1843–1918 |
| John Wesley Powell | Q483134 | **Q348325** | 1834–1902 (rejected) |
| Philippe Pinel | Q313650 | **Q311594** | 1745–1826 |
| Hans Hahn | Q57474 | **Q84552** | 1879–1934 |
| Herbert Feigl | Q76370 | **Q93678** | 1902–1988 |
| Kurt Gödel | Q9021 | **Q41390** | 1906–1978 |
| Friedrich Waismann | Q71799 | **Q93826** | 1896–1959 |
| Philipp Frank | Q57281 | **Q79177** | 1884–1966 |

All 13 confirmed human (P31=Q5), deceased (P570 present), with enwiki sitelinks → no living-person
guard fires. Full live-verification vindicated again (the generator's value is separated-context
candidate drafting + honest self-flagging, not QID accuracy).

## Verdicts

**12 supported / 0 disputed / 0 NEI / 1 reject; claim-level hallucination 0.** Grounding: ≥2
independent live claim-stating Wikipedia articles per edge (biography + field/institution article),
encoded `source:wikipedia` per the #34 precedent (no specialist source required when two independent
Wikipedia articles both state the claim).

### The one reject — Powell → geomorphology (referent precision)

The generator proposed `john-wesley-powell → founded_or_formalized geomorphology`. Live check:
Powell's own Wikipedia article claim-states **no** geomorphology-founding role (Grand Canyon
exploration, USGS directorship, anthropology). The only supporting statement is in the
'Geomorphology' article — that the *term* came into general use after Powell and W. J. McGee — which
is term-popularization, not discipline-founding, and is a single source. This fails the ≥2
independent claim-stating founder standard, so **no `/data` edge was written**. Gilbert (the strong
co-founder — "one of the giants of the subdiscipline of geomorphology") carries the geomorphology
co-founder edge; Powell is recorded in Gilbert's edge `note` as term-populariser rather than dropped
silently. The generated proposal for Powell remains in this batch's `nodes.proposed.json` /
`edges.proposed.json` as the untrusted generation record.

## Coverage decisions

- **Stage-1 sweep result:** of ~331 reviewed field/subfield nodes without a founder edge,
  `subfield:cell-biology` was the one clean referent-precise single/co-founder target remaining.
  The others (mathematics, physics, statistics, botany, zoology, physiology, biology, and the broad
  math/physics subfields) are correctly founderless — broad parents, ancient/dispersed origins, or
  applied subfields with no canonical founder. No weak attributions were forced.
- **No Virchow / Hooke nodes** for cell theory — named only in the record-not-resolve notes.
- **Domains corrected** from the generation order's uniform 'humanities' for Group C, to each
  person's primary discipline: Hahn → formal_sciences (mathematician), Gödel → formal_sciences
  (logician), Frank → natural_sciences (physicist); Feigl / Waismann → humanities (philosophers).
- **Gödel `member_of` kept** (generator flagged `ambiguous:true`): the 'Vienna Circle' Inner-Circle
  roster explicitly lists him, so the membership is documented; his peripheral/attending status and
  Platonist divergence from logical empiricism are carried in the edge `note` (record-not-resolve),
  not laundered into confidence.

## Promotion

All 12 promoted items auto-`reviewed` on write: 12 deceased person nodes satisfy node promotion
policy v1 (QID resolver-verified + `is_living_person` live-confirmed-false); with both endpoints
reviewed, the 7 `founded_or_formalized` edges promote via the deceased founder ladder (decision (61))
and the 5 `member_of` edges are reviewed (both-endpoints-reviewed factual membership, decision (81)).
Nodes 539→551 · edges 636→648 · translations →551 · sources 23 unchanged. Schema unchanged.

## Files

`nodes.proposed.json` (13 generated) · `edges.proposed.json` (13 generated) · `report.md` (this file).
The 12 promoted items live in `data/nodes.json` / `data/edges.json` / `data/node-translations.json`.
