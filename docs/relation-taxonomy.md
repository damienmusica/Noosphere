# Relation Taxonomy

Edge `relation` values are intentionally **small and strict**. Keeping the set tight makes the graph
legible and the data reviewable. Do not add relation types casually.

## Allowed relation types (MVP)

| Relation | Meaning (A → B) |
| --- | --- |
| `part_of` | A is a subdomain, subfield, or component of B. |
| `prerequisite_for` | A is a useful learning prerequisite for B. |
| `influenced` | A influenced B historically, intellectually, or methodologically. |
| `founded_or_formalized` | A person or work helped found or formalize field/concept B. |
| `formalizes` | A provides a formal mathematical/logical framing for B. |
| `models` | A models or represents B. |
| `measures` | A provides measurement/observation methods for B. |
| `enables` | A makes B technically or practically possible. |
| `applies_to` | A is applied to B. |
| `critiques` | A critiques, opposes, or challenges B. |
| `canonical_work` | Work A is canonical for a field, person, or concept B. |
| `adjacent_to` | A is adjacent/strongly related to B, not yet more specific. |

## Constraints

- `prerequisite_for` edges must not form a cycle (validated; circular prerequisite chains are rejected).
- Prefer the most specific relation that is accurate. Use `adjacent_to` only as a deliberate placeholder.

## Changing the taxonomy

Adding, renaming, or removing a relation type requires, **in the same change**:

1. Update this document.
2. Update the `RelationType` enum in `src/schema/edge.ts`.
3. Update / confirm checks in `scripts/validate-data.ts`.

This keeps the docs, schema, and validator from drifting apart.
