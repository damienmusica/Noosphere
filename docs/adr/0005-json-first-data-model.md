# ADR 0005 — JSON-first data model (no database in MVP)

- **Status:** Accepted
- **Date:** 2026-06-02

## Context

A database adds migrations, auth, hosting, backups, write permissions, and admin workflows — and an
ongoing operational burden. The MVP's data set is small (hundreds to low thousands of nodes/edges)
and changes infrequently through curation.

## Decision

Use **JSON data files** under `/data` as the source of truth, validated by Zod schemas
(`/src/schema`) via `scripts/validate-data.ts`. No database in the MVP.

## Consequences

- Data is easy to review in pull requests, diff, back up, and keep read-only.
- Validation runs locally and in CI with no infrastructure.
- The schema lives in TypeScript, so the app and the validator share one definition.
- For very large data sets, JSON in Git becomes unwieldy — migration to PostgreSQL is a deliberate
  future step (see `admin-roadmap.md`), taken only when user submissions, review queues, or volume
  require it.
- Referential integrity (edges → nodes, evidence → sources) is enforced by the validator rather than
  by foreign keys; this is an explicit, tested responsibility of `validate-data.ts`.
