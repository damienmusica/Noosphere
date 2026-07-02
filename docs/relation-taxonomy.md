# Relation Taxonomy

Edge `relation` values are intentionally **small and strict**. Keeping the set tight makes the graph
legible and the data reviewable. Do not add relation types casually.

## Allowed relation types (MVP)

| Relation | Meaning (A → B) |
| --- | --- |
| `part_of` | A is a subdomain, subfield, or component of B. |
| `prerequisite_for` | A is a useful learning prerequisite for B. |
| `influenced` | A influenced B historically, intellectually, or methodologically. |
| `founded_or_formalized` | A person, work, or institution (named group) helped found or formalize field/concept B. |
| `formalizes` | A provides a formal mathematical/logical framing for B. |
| `models` | A models or represents B. |
| `measures` | A provides measurement/observation methods for B. |
| `enables` | A makes B technically or practically possible. |
| `applies_to` | A is applied to B. |
| `critiques` | A critiques, opposes, or challenges B. |
| `canonical_work` | Work A is canonical for a field, person, or concept B. |
| `adjacent_to` | A is adjacent/strongly related to B, not yet more specific. |
| `member_of` | Person/entity A is a member of group/institution B. |

## Constraints

- `prerequisite_for` edges must not form a cycle (validated; circular prerequisite chains are rejected).
- Prefer the most specific relation that is accurate. Use `adjacent_to` only as a deliberate placeholder.

## Adequacy and watch-items (measurement-first — no schema change yet)

The 13 relation types above are **ratified as adequate** for the propositional-edge depth pilot
(formal-sciences `formalizes` / `founded_or_formalized` — see the vault Lane B pipeline design).
Enum expansion is **forbidden until a measured need** is recorded (charter over-scaffolding guard).

`member_of` was added under exactly that gate (vault decision log, session #45): the ratified
movement/school axis rule (§12; vault decision (73)) types a *group of named people* — the Vienna
Circle being the first — as an `institution` node, whose membership edges have no adequate existing
relation. CPO-ratified this session; added here + in the Zod enum + validated in one change.

The following are **things to measure, not to build.** Each is encoded first as a `note` convention so
pressure can be counted; a schema change is proposed only after recurrence crosses a threshold, and
only through a separate gate (this doc + Zod enum + validator, in one change).

- **`critiques` — premise-attack vs inference-attack.** Argdown distinguishes attacking a premise
  (`-`) from undercutting an inference step (`_`). For now, record the distinction in `note`; split
  only if the same structural phrasing recurs across many edges.
- **framework / school / scale relativity qualifier.** The case-types that `disputed` + `note` cannot
  cleanly express (e.g. ">2 mutually exclusive positions", "true within framework X, false within Y",
  "school S asserts, school T denies", scale/era-dependent truth). Measure via the `note` convention
  **"within-framework: X"**. A qualifier *field* is re-gated by the CPO only on measured threshold —
  and it would be a **framework/school/scale** field, **not** a confidence number (`confidence` 0–1
  already exists). Precedent: Argdown deliberately keeps its quantitative "degree of justification"
  out of core — measurement-first deferral is well-founded, not timid. (Note: the `disputed: true`
  flag *itself* is **no longer an unfired mechanism** — it fired on the propositional layer for the
  first time at `nietzsche → freud` under clause-6 v2, vault decision (67); see
  [`docs/data-foundry.md`](data-foundry.md) §8. Its prior 0/N non-firing is now understood as roster
  bias, not a coverage gap, and this qualifier watch-item covers only the cases `disputed` + `note`
  genuinely cannot express.)
- **`prerequisite_for` under-utilization** (currently a sparse relation) is a **depth-dimension
  candidate to develop** (more pedagogical/dependency edges), not a schema change. Evidence standard
  differs from structural edges: a curriculum/textbook source stating the dependency, per
  [`docs/data-foundry.md`](data-foundry.md) §8.

## Changing the taxonomy

Adding, renaming, or removing a relation type requires, **in the same change**:

1. Update this document.
2. Update the `RelationType` enum in `src/schema/edge.ts`.
3. Update / confirm checks in `scripts/validate-data.ts`.

This keeps the docs, schema, and validator from drifting apart.
