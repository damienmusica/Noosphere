# Product Brief

> Defines what Noosphere is and its scope. For durable identity, posture, and boundaries see
> [`docs/project-charter.md`](project-charter.md); for the current phase's working brief see
> [`docs/data-foundry.md`](data-foundry.md). The foundation-phase brief
> (`NOOSPHERE_CLAUDE_CODE_BRIEF.md`) is **superseded** and retained for history only — it is no
> longer canonical. See [`docs/source-of-truth.md`](source-of-truth.md) for the hierarchy.

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

Reach this scale depth-first — one domain fully reviewed before breadth — not by
parallel breadth (see [`docs/data-foundry.md`](data-foundry.md)).

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

## Current milestone: Data Foundry and scalable curation methodology

The repository foundation (docs, schemas, seed data, validation, Claude Code instructions) is
**complete**. The current milestone is building a **Data Foundry and a scalable curation
methodology** — see [`docs/data-foundry.md`](data-foundry.md).

- **UI is not the current bottleneck.** High-quality, evidence-backed graph data is. Effort goes to
  data construction and curation, not visual polish.
- **The MVP still aims for a static/read-only atlas.** The runtime posture is unchanged.
- **Bulk AI-generated public pages remain out of scope.** Noosphere does not mass-publish thin or
  auto-generated pages.
- **Batch-generated `proposed` data is allowed as an internal construction workflow.** It may be
  produced at scale, but only becomes `reviewed`/`indexable` after passing source resolution,
  validation, and the risk-tiered curation gate. No cloud LLM API is required to run that workflow
  (see the charter's LLM boundary).

## Guiding principle

Prioritize **maintainability, security, licensing, and data validation** over early visual polish.
When in doubt, ask before changing architecture.
