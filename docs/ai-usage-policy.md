# AI Usage Policy

AI (including Claude Code) can help draft code, docs, summaries, and data proposals. AI is **not**
the final authority for factual relationships.

## Rules

- AI-generated data starts as `generated` or `proposed` — never `reviewed`.
- Do not let AI invent sources. Every `evidence` reference must point to a real, recorded source.
- Do not use AI to paraphrase copyrighted text too closely.
- Do not create unsupported claims about living people. Nodes with `is_living_person: true` require
  stricter evidence and conservative wording.
- Require evidence metadata for all edges.
- Manual review by the owner is required before any page is published as `indexable`.

## Status lifecycle for AI contributions

```text
generated / proposed  --(human review)-->  reviewed  --(may become)-->  indexable
```

Nothing skips review. `draft` and `deprecated` are also non-indexable. The validator enforces that
only `reviewed` nodes and paths can be `indexable`; it cannot judge truth, so human review remains
mandatory for factual claims.
