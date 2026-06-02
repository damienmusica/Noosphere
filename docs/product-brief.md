# Product Brief

> Condensed from `NOOSPHERE_CLAUDE_CODE_BRIEF.md`. That file remains canonical; this is the
> orientation doc for contributors and Claude Code sessions.

## What Noosphere is

Noosphere is an **English-first, multilingual-ready interactive atlas of human knowledge**. It maps
fields, concepts, people, works, methods, and evidence-backed relationships into a zoomable knowledge
graph (and, much later, a 2.5D/3D knowledge globe).

It is **not** a wiki clone. It is a navigation layer over human knowledge — a map of relationships,
learning paths, influence trails, and external references.

### Mental model

- Fields are continents; subfields are regions.
- Concepts, people, works, and methods are nodes.
- Relationships are roads, routes, or influence lines.
- Zoom controls detail; search and filters make dense information readable.

## MVP scope

Build a **read-only, English-first, data-driven** foundation for exploring a curated knowledge graph.

Initial target scale (aspirational, not required for the first milestone):

- 12 top-level domains.
- 80–150 mid-level fields.
- 300–1,000 nodes, 500–3,000 edges.
- 5–10 curated learning paths.

### In scope

- Build-time / static graph data.
- Node detail, search over labels and aliases, relation filters.
- Source and license registry; external links per node.
- Curated learning paths.
- Data validation script and fixtures.
- Clean docs and ADRs.

### Out of scope (MVP)

Login, user profiles, comments, public editing, admin UI, database-backed editing, payments, ads,
full 3D globe, scraping crawlers, bulk AI-generated pages.

## Current milestone: repository foundation

Docs, schemas, seed data, validation, and Claude Code instructions. No application UI beyond a
placeholder, and only if framework initialization requires it. The first deliverable is a clean,
secure, maintainable foundation that can survive data growth, localization, public launch, and
possible contributor workflows.

## Guiding principle

Prioritize **maintainability, security, licensing, and data validation** over early visual polish.
When in doubt, ask before changing architecture.
