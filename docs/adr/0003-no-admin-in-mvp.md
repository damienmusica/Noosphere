# ADR 0003 — No admin UI in the MVP

- **Status:** Accepted
- **Date:** 2026-06-02

## Context

An admin UI implies authentication, RBAC, audit logs, and a privileged write path — a large amount
of security-sensitive surface for a project whose data currently fits in reviewable JSON files.

## Decision

No admin UI in the MVP. Curation is done by editing `/data` files and opening pull requests.
Validation (`validate:data`) and `typecheck` run as gates; the owner reviews and merges.

## Consequences

- No privileged endpoints to secure, no admin credentials to manage.
- The review workflow is the same as code review — familiar and auditable.
- Bulk edits are done with scripts that emit JSON, still gated by validation.
- An internal admin is a later phase (`admin-roadmap.md` Phase 2), introduced only when usage and
  data volume justify it.
