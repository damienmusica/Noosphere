# ADR 0006 — Data Foundry and the LLM boundary

- **Status:** Accepted
- **Date:** 2026-06-02

## Context

The foundation phase is complete: the data model, schemas, validation, policies, and seed data are
in place. The binding constraint now is **data** — high-quality, evidence-backed graph data — not
UI. Manual, line-by-line curation of every node and edge does not scale to the target graph size.

Two pressures had to be reconciled:

- The project owner uses LLMs (ChatGPT, Claude Code) heavily and productively as interactive
  assistants for reasoning, design, review, prompting, and implementation.
- Making Noosphere's own tooling **depend** on cloud LLM APIs would compromise the project's
  independence and introduce secrets/keys, recurring cost, vendor coupling, and non-deterministic
  build/validation behavior — all of which conflict with the static, read-only, no-secrets charter.

## Decision

- **Noosphere will use LLMs interactively, as human-operated assistants.** Interactive LLM use for
  reasoning, design, review, prompt writing, data proposals, and code implementation is allowed and
  expected.
- **Noosphere repo tooling, runtime, build, and CI will not require cloud LLM APIs.** No script in
  the repository may call OpenAI, Anthropic, or any other cloud LLM API, and no LLM API keys,
  secrets, or tokens may be stored or required.
- **The Data Foundry may use open, free, public knowledge APIs and datasets** (e.g. Wikidata,
  OpenAlex, ORCID) when they are safe, documented, useful, and license-compatible. NamuWiki remains
  external-link-only and is never a source or evidence; article bodies are never scraped or cached.

## Consequences

- **Build, export, validate, and report remain deterministic and LLM-free** — runnable offline with
  no external model dependency.
- **Data proposal generation must be file/API/source based**, drawing on repo JSON and allowed open
  sources rather than on cloud LLM API calls embedded in scripts.
- **Interactive LLM workflows remain allowed**, so maintainers keep their full assistant toolset.
- **Future tooling produces `proposed`/non-indexable data first**; data only becomes `reviewed`/
  `indexable` after passing the risk-tiered curation gate and a batch/release decision.

See [`docs/project-charter.md`](../project-charter.md) and [`docs/data-foundry.md`](../data-foundry.md).
