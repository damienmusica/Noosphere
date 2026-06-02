# ADR 0002 — Read-only MVP

- **Status:** Accepted
- **Date:** 2026-06-02

## Context

User accounts, editing, and comments introduce auth, moderation, spam, abuse handling, and a write
path with its own security and operational burden. The MVP's value is the curated graph itself, not
collaboration features.

## Decision

The MVP is **read-only**. No login, accounts, public edits, comments, or admin UI. All data changes
happen through Git commits and pull requests, gated by validation and owner review.

## Consequences

- Near-zero write-side attack surface; the app can be served statically.
- Contributions are reviewable diffs, naturally versioned and revertible.
- No moderation, spam, or abuse tooling is needed yet.
- Faster iteration on the data model without migrations.
- Community editing, if ever wanted, is a deliberate future phase (see `admin-roadmap.md`), not an
  accident of early architecture.
