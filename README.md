# Noosphere

An interactive atlas of human knowledge, mapping fields, concepts, people, works, and evidence-backed relationships.

> **Status:** Private, planning-stage. This is **not** production-ready. The current milestone is the repository foundation only (docs, schemas, seed data, validation) — not the full application.

Noosphere is an **English-first, multilingual-ready, read-only** knowledge atlas. It maps fields, concepts, people, works, methods, and evidence-backed relationships into a navigable knowledge graph. It is a *navigation layer over human knowledge* — a map of relationships, learning paths, and external references — **not a wiki clone**.

## Core idea

- Fields are continents, subfields are regions.
- Concepts, people, works, and methods are nodes.
- Relationships (prerequisite, influence, part-of, …) are the roads between them.
- Every relationship carries a relation type, confidence, status, and evidence.

## Hard constraints (MVP)

This repository deliberately does **not** include, and will not add without an explicit decision:

- No login / accounts.
- No admin UI.
- No database (JSON data files only).
- No user-generated content, comments, or public editing.
- No scraping or crawling of third-party sites.
- No secrets, API keys, or private tokens.
- No ads or payments.
- No 3D globe yet.
- **NamuWiki is external links only** — never cached content, never primary evidence.

Data invariants enforced by validation:

- Every node has a **stable, language-independent ID** (`^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$`).
- Every edge has a **relation type, confidence, status, and evidence**.
- Every source has **license metadata**.
- Display labels live in a separate translations layer; graph topology never depends on label text.

## Repository layout

```text
/data            JSON seed data (nodes, translations, edges, sources, external links, paths)
/docs            Product brief, policies, and Architecture Decision Records (ADRs)
/src/schema      Zod schemas + shared types for all data files
/scripts         validate-data.ts (data integrity + policy checks)
CLAUDE.md        Persistent instructions for Claude Code sessions
NOOSPHERE_CLAUDE_CODE_BRIEF.md   Canonical project brief
```

## Getting started

```bash
npm install
npm run typecheck     # tsc --noEmit
npm run validate:data # validates /data against schemas + policy rules
npm run export:graph  # builds dist/noosphere-graph.json (static, read-only)
```

`export:graph` converts the `/data` JSON into a single read-only graph payload at
`dist/noosphere-graph.json` for a future static UI. It is a **build artifact, not a database** —
`dist/` is gitignored and the file is regenerated, never committed. See
[`docs/data-model.md`](docs/data-model.md#static-graph-export).

Data changes happen through Git commits and pull requests — there is no write path in the application.

## Documentation

- [`docs/product-brief.md`](docs/product-brief.md) — what Noosphere is and the MVP scope.
- [`docs/data-model.md`](docs/data-model.md) — nodes, translations, edges, sources, links, paths.
- [`docs/relation-taxonomy.md`](docs/relation-taxonomy.md) — the allowed edge relation types.
- [`docs/license-policy.md`](docs/license-policy.md) — source/license rules and third-party wikis.
- [`docs/security-policy.md`](docs/security-policy.md) — read-only security posture.
- [`docs/admin-roadmap.md`](docs/admin-roadmap.md) — why there is no admin yet, and the phased plan.
- [`docs/seo-policy.md`](docs/seo-policy.md) — indexability and anti-content-farm rules.
- [`docs/ai-usage-policy.md`](docs/ai-usage-policy.md) — how AI may and may not contribute.
- [`docs/adr/`](docs/adr) — Architecture Decision Records.

## License

No open-source license is granted at this stage. All rights reserved (`UNLICENSED`) while the project is private and the licensing strategy is undecided.
