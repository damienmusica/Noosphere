# ML-foundations-v1 — candidate proposal QC brief

**Status of this artifact:** `generated` (lowest trust). Construction material for human QC only —
NOT canonical data. `/data` is the read-only source of truth; nothing here is `reviewed` or
`indexable`. No `/data`, schema, script, or manifest files were modified.

Batch: `batch:machine-learning-foundations-v1` (11 seed entities).

## Totals

- **Proposed nodes: 0** — all 11 seeds already exist as canonical nodes in `data/nodes.json`
  (see reconciliation below), so no new nodes are proposed. `nodes.proposed.json` is an empty array.
- **Proposed edges: 12** — all new pairs/relations not already present in `data/edges.json`.
- **Flagged ambiguous: 7** of 12.
- **Edges with confidence < 0.6: 1** (a further cluster sits exactly at 0.6 — see below).

## STEP 1 — seed reconciliation (all 11 already canonical)

Every seed's `expected_node_id` resolved to an existing node, so all are **reused**, none re-proposed:

| Seed | Node ID | Existing status in /data |
| --- | --- | --- |
| Mathematics | `field:mathematics` | reviewed |
| Linear algebra | `subfield:linear-algebra` | reviewed |
| Calculus | `subfield:calculus` | proposed |
| Probability theory | `subfield:probability-theory` | proposed |
| Statistics | `field:statistics` | reviewed |
| Optimization | `subfield:optimization` | proposed |
| Machine learning | `field:machine-learning` | reviewed |
| Random variable | `concept:random-variable` | proposed |
| Probability distribution | `concept:probability-distribution` | proposed |
| Bayesian inference | `method:bayesian-inference` | reviewed |
| Gradient descent | `method:gradient-descent` | proposed |

## STEP 3 — proposed edges (12)

All edges are pedagogical/editorial judgment (`evidence_kind: "editorial"`,
`evidence: ["source:manual-curation-v1"]`). Each carries a `source_hint` naming a real curriculum or
textbook that *would* support it — these are QC pointers, **not** verified citations and must be
checked before any promotion. To avoid contaminating the canonical set, no edge here duplicates a
`(source, target, relation)` already in `data/edges.json`.

| Edge (source → target) | Relation | Conf | Ambiguous |
| --- | --- | --- | --- |
| calculus → machine-learning | prerequisite_for | 0.80 | no |
| linear-algebra → optimization | prerequisite_for | 0.70 | **yes** |
| probability-theory → machine-learning | prerequisite_for | 0.80 | no |
| probability-theory → bayesian-inference | prerequisite_for | 0.90 | no |
| random-variable → probability-distribution | prerequisite_for | 0.75 | **yes** |
| calculus → gradient-descent | prerequisite_for | 0.85 | no |
| probability-distribution → statistics | prerequisite_for | 0.75 | no |
| mathematics → machine-learning | prerequisite_for | 0.65 | **yes** |
| linear-algebra → gradient-descent | prerequisite_for | 0.60 | **yes** |
| probability-distribution → random-variable | models | 0.60 | **yes** |
| statistics → mathematics | adjacent_to | 0.60 | **yes** |
| linear-algebra → calculus | adjacent_to | 0.50 | **yes** |

### Edges with confidence < 0.6

- **linear-algebra → calculus (adjacent_to, 0.50)** — weak placeholder link; no strong directional
  dependency. QC may legitimately prefer no edge at all.

### Cluster at exactly 0.60 (low-confidence, all flagged ambiguous) — worth a close read

- **linear-algebra → gradient-descent (prerequisite_for)** — helpful but not strictly required;
  could be `adjacent_to`.
- **probability-distribution → random-variable (models)** — tightly definitional pair; could be
  `prerequisite_for`/`adjacent_to` and the direction is arguable.
- **statistics → mathematics (adjacent_to)** — deliberately NOT `part_of` (see below).

## Seed pairs deliberately left UNlinked (absence is a judgment)

- **statistics — mathematics as `part_of`:** intentionally avoided. `/data` already places
  `field:statistics` under `formal_sciences`, not under mathematics. Asserting `part_of` would take a
  contested taxonomic stance, so only a low-confidence `adjacent_to` is proposed instead.
- **linear-algebra — probability-theory / statistics:** no direct foundational dependency at this
  granularity; they connect only transitively through machine learning. Left unlinked.
- **calculus — probability-theory / statistics:** calculus underlies continuous distributions, but
  the dependency is weak and indirect at the field/subfield level. Left unlinked to avoid low-value
  edges.
- **gradient-descent — bayesian-inference:** two distinct methods with no direct
  prerequisite/influence relation at this level. Left unlinked.
- **bayesian-inference — optimization / gradient-descent:** modern Bayesian computation does use
  optimization (e.g. variational inference), but that is method-specific and contemporary, which the
  batch's conservative scope excludes. Deliberately omitted.

## Notes for the curation gate

- Treat every `source_hint` as an unverified pointer; confirm the cited chapter/source before
  promotion.
- `prerequisite_for` direction was kept acyclic (foundational → advanced); reviewers should still
  re-check against the canonical graph before any merge, since the canonical validator only checks
  `/data`.
- Several edges (e.g. `mathematics → machine-learning`, `probability-theory → machine-learning`) are
  honest but high-altitude and may be redundant with finer-grained prerequisites already in `/data`;
  the `uncertainty` field on each flags this.
