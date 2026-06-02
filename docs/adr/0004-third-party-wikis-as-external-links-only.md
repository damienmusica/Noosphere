# ADR 0004 — Third-party wikis as external links only

- **Status:** Accepted
- **Date:** 2026-06-02

## Context

Third-party wikis (especially NamuWiki, and to a lesser extent Wikipedia) are valuable destinations
for readers but carry licensing, attribution, and copyright constraints. Caching or reproducing their
content would make Noosphere a wiki clone and create legal and quality risk.

## Decision

Third-party wikis are treated as **external link destinations only**:

- **NamuWiki:** external links only. Never cache article text, never reproduce article structure,
  never treat it as primary evidence. `external-links.json` entries for `namuwiki` must have
  `content_cached: false` (enforced by `validate-data.ts`).
- **Wikipedia:** link and cite carefully; no bulk-copying of article text unless license and
  attribution/share-alike requirements are explicitly handled.
- External links are pointers, not content (`content_cached: false` by default), rendered with safe
  link attributes and restricted to `http:`/`https:` schemes.

## Consequences

- Noosphere stays a navigation layer, not a content reproduction of other wikis.
- Licensing risk from third-party text is avoided.
- Readers still reach rich external material via links.
- The validator encodes the NamuWiki rule so it cannot be violated silently.
