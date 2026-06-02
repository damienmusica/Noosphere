# AI Usage Policy

AI (including ChatGPT and Claude Code) can help draft code, docs, summaries, and data proposals, and
can assist with reasoning, design, review, and prompt writing. AI is **not** the final authority for
factual relationships, and Noosphere's own tooling must never **depend** on cloud LLM APIs.

## Interactive use vs. repo tooling

- **AI/LLMs may assist interactively.** Maintainers may use LLMs as interactive, human-operated
  assistants for reasoning, design, review, prompt writing, data proposals, and implementation.
- **Cloud LLM APIs must not be required** by Noosphere scripts, CI, build, export, validation,
  runtime, or maintenance tooling. These must stay deterministic and runnable offline.
- **No LLM API keys, secrets, or tokens** may be stored in or required by the repo or its
  environment.

See [`docs/project-charter.md`](project-charter.md) (LLM boundary) and
[`docs/adr/0006-data-foundry-and-llm-boundary.md`](adr/0006-data-foundry-and-llm-boundary.md).

## Rules

- **AI-generated raw data starts as `generated` or `proposed` — never `reviewed`.**
- **Do not let AI invent sources.** Every `evidence` reference must point to a real, recorded source.
- Do not use AI to paraphrase copyrighted text too closely.
- Do not create unsupported claims about living people. Nodes with `is_living_person: true` require
  stricter evidence and conservative wording.
- Require evidence metadata for all edges.
- **NamuWiki remains external-link-only** — never a source, never evidence, never cached.

## What "reviewed" means

`reviewed` means the item or batch **passed the Noosphere curation gate for its relevant risk tier**
and was accepted through a batch/release decision — not that the owner manually verified every row
line by line.

- **Owner review may be batch/process/report based for low-risk data** (e.g. structural taxonomy):
  the owner approves the process, batch scope, reports, and exceptions rather than each row.
- **High-risk claims require stricter, more direct review.** Living-person, current-event, and
  controversial claims always need explicit owner review and the most conservative wording.

See [`docs/data-foundry.md`](data-foundry.md) for the risk tiers and batch lifecycle.

## Status lifecycle for AI contributions

```text
generated / proposed  --(curation gate, by risk tier)-->  reviewed  --(may become)-->  indexable
```

Nothing skips the gate. `draft` and `deprecated` are also non-indexable. The validator enforces that
only `reviewed` nodes and paths can be `indexable`; it cannot judge truth, so the curation gate —
scaled by risk tier — remains mandatory for factual claims.
