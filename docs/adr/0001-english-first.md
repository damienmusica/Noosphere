# ADR 0001 — English-first, multilingual-ready

- **Status:** Accepted
- **Date:** 2026-06-02

## Context

Noosphere targets a global audience and a later Korean locale. We must choose a default display
language and a data shape that supports localization without rework.

## Decision

English (`en`) is the **default display language** (`defaultLocale = "en"`). The data model is
multilingual-ready from day one:

- Graph topology (`nodes.json`, `edges.json`) carries **no display text**.
- Display strings live in `node-translations.json`, keyed by `node_id` + `locale`.
- Canonical IDs are language-independent ASCII and never derived from labels.
- Every node must have an `en` translation. Other locales (e.g. `ko`) are optional and added later.

## Consequences

- Adding a locale means adding translation rows — no schema migration, no ID churn.
- Graph behavior never depends on which language is displayed.
- Korean labels and NamuWiki external links can be added later without touching topology.
- Slightly more indirection now (labels are a join, not a field) — an acceptable trade for
  localization safety.
