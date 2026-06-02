# Security Policy

The MVP is **read-only and static where possible**. The smallest attack surface is the best one.

## Rules

- No auth in MVP.
- No database writes in MVP.
- No user-generated content in MVP.
- No comments in MVP.
- No admin UI in MVP.
- **No secrets, API keys, or static credentials** in the repo or the Claude cloud environment.
- Avoid raw HTML rendering.
- Sanitize any rendered Markdown if Markdown rendering is later introduced.
- External links must use safe attributes (`rel="noopener noreferrer"`, and `nofollow` where appropriate)
  and be limited to `http:`/`https:` schemes (enforced by data validation).
- Keep dependencies minimal; add dependency scanning later.
- Prefer explicit validation over implicit assumptions.

## Data-layer enforcement

`scripts/validate-data.ts` is part of the security posture, not just data hygiene. It rejects:

- Disallowed external-link URL schemes (anything other than `http:`/`https:`).
- NamuWiki links with `content_cached: true`.
- Unreviewed/generated nodes marked `indexable`.
- Edges without evidence, or evidence pointing at unknown sources.

## Secrets

There are no secrets in this project at the foundation stage and none should be added. If a future
feature genuinely needs a secret, it must be injected at runtime via the environment — never
committed, never echoed into logs, never embedded in client bundles.

## Future direction

Future security work should reference OWASP principles, but do not overbuild early. Add CI-based
dependency scanning and link checking when the project moves past the foundation stage.
