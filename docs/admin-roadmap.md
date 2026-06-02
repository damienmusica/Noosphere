# Admin Roadmap

Admin is **intentionally excluded** from the MVP. Data lives in the repository and changes through
pull requests with validation in CI and manual review by the owner. This keeps the product read-only
and the operational risk near zero.

## Phase 1 — No admin (current)

- Data lives in repo (`/data`).
- Changes through PRs.
- Validation in CI (`validate:data`, `typecheck`).
- Manual review by owner.

## Phase 2 — Internal admin

Only after the product has real usage:

- Authentication + 2FA.
- Role-based access control (RBAC).
- Explicit content states: draft / proposed / reviewed / published / deprecated.
- Audit log and rollback.
- Link checker and license checker.
- **No hard deletes.**

## Phase 3 — Public suggestions

Only after the internal workflow is stable:

- User suggestion queue.
- Spam protection and moderation.
- Abuse reporting.
- Rights / removal request flow.

## Migration to a database

A database is introduced only when the product genuinely needs user submissions, internal review
queues, or high-volume data — not before. Until then, JSON + validation is sufficient and safer
(easy to review, diff, back up, and keep read-only).
