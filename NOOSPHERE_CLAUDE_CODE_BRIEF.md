# Noosphere Project Brief for Claude Code

Version: 0.1
Status: Planning and initial repository bootstrap
Primary working language: English
Planned secondary language: Korean
Project owner: Personal project

---

## 0. How to use this document

This document is the canonical starting brief for Claude Code sessions working on the Noosphere repository.

Claude Code should read this file before making architectural decisions. If a task conflicts with this document, stop and ask for clarification before changing code.

The first priority is to create a maintainable, secure, read-only MVP foundation. Do not rush into a feature-heavy app before the data model, policies, validation, and repo conventions are in place.

This is the **current MVP/foundation working brief** — canonical for this phase, but not a permanent forever-SSOT. At phase transitions it should be **superseded, not silently overwritten**: mark it completed/superseded or archive it through an explicit PR, and promote any long-lived principles into the product brief or a project-level charter. See `docs/source-of-truth.md` for the full document hierarchy and lifecycle policy.

---

## 1. Project summary

Noosphere is an English-first, multilingual-ready interactive atlas of human knowledge. It maps fields, concepts, people, works, methods, and evidence-backed relationships into a zoomable knowledge graph and, later, a 2.5D/3D knowledge globe.

The product is not a wiki clone. It is a navigation layer over human knowledge: a map of relationships, learning paths, influence trails, and external references.

Core concept:

- Fields are continents.
- Subfields are regions.
- Concepts, people, works, and methods are nodes.
- Relationships are roads, routes, or influence lines.
- Zoom level controls detail.
- Search and filters make dense information readable.

Long-term product direction:

- Interactive web atlas.
- Knowledge graph database.
- Evidence-backed relationship model.
- Curated learning paths.
- Person-to-person influence trails.
- Printable poster/SVG/PDF export.
- Optional 3D globe mode later.
- Korean locale later, with NamuWiki as external links only.

---

## 2. Non-negotiable principles

1. Do not build a wiki clone.
2. Do not copy third-party article text into our database unless its license explicitly permits it and attribution/share-alike requirements are handled.
3. NamuWiki must be treated as an external link destination only, not as a primary data source and not as cached content.
4. The MVP must be read-only. No login, no user accounts, no public edits, no comments, no admin UI.
5. Data changes in MVP happen through Git commits and pull requests.
6. Every node must have a stable ID.
7. Every edge must have a relation type.
8. Every edge must have confidence and evidence metadata.
9. Every external source must have license metadata.
10. Auto-generated or unreviewed pages must be noindex until reviewed.
11. Living-person claims require stricter evidence and more conservative wording.
12. English is the default display language. The data model must be multilingual-ready from day one.
13. The graph topology must not depend on displayed label text.
14. Security, licensing, and data validation matter more than early visual polish.
15. Do not introduce secrets, API keys, or private tokens into the repository.
16. Do not use company-internal data, documents, code, credentials, or knowledge. This is a personal project based on public/open data and original curation.

---

## 3. MVP scope

### 3.1 MVP target

Build a read-only, English-first, data-driven web MVP for exploring a curated human knowledge graph.

Initial target scale:

- 12 top-level domains.
- 80 to 150 mid-level fields.
- 300 to 1,000 total nodes.
- 500 to 3,000 edges.
- 5 to 10 curated learning paths.

### 3.2 MVP features

Include:

- Static or build-time graph data.
- Node detail panel.
- Search over labels and aliases.
- Relation filters.
- Source and license registry.
- External links per node.
- Basic curated learning paths.
- Data validation script.
- Basic tests or validation fixtures.
- Clean docs and architecture decision records.

Exclude from MVP:

- Login.
- User profiles.
- Comments.
- Public editing.
- Admin UI.
- Database-backed editing workflows.
- Payments.
- Ads.
- Full 3D globe.
- Crawlers that scrape third-party sites.
- Bulk AI-generated pages.

---

## 4. Recommended technical direction

### 4.1 First implementation approach

Start with a static/read-only web app and repo-managed data.

Preferred stack:

- Next.js.
- TypeScript.
- React.
- Zod for data validation.
- JSON data files first.
- Graphology for graph utilities if useful.
- Sigma.js or a simple first-party SVG/Canvas visualization later.
- FlexSearch or a simple local search index later.
- No database in MVP.

The first task should not over-engineer rendering. The first real deliverable is the repo foundation: docs, schemas, placeholder data, validation, and Claude Code instructions.

### 4.2 Why no database at first

A database adds migrations, auth, hosting, backups, write permissions, admin workflows, and more operational risk.

For the MVP, JSON plus validation is enough and safer:

- Easier to review in pull requests.
- Easier to diff.
- Easier to back up.
- Easier to keep read-only.
- Easier for Claude Code to reason about.

Move to PostgreSQL only after the product needs user submissions, internal review queues, or high-volume data.

---

## 5. Repository shape to create

Create this structure first:

```text
/
  README.md
  CLAUDE.md
  package.json
  tsconfig.json
  .gitignore
  /app
  /components
  /data
    nodes.json
    node-translations.json
    edges.json
    sources.json
    external-links.json
    learning-paths.json
  /docs
    product-brief.md
    data-model.md
    relation-taxonomy.md
    license-policy.md
    security-policy.md
    admin-roadmap.md
    seo-policy.md
    ai-usage-policy.md
    /adr
      0001-english-first.md
      0002-read-only-mvp.md
      0003-no-admin-in-mvp.md
      0004-third-party-wikis-as-external-links-only.md
      0005-json-first-data-model.md
  /scripts
    validate-data.ts
  /src
    /schema
      node.ts
      edge.ts
      source.ts
      external-link.ts
      learning-path.ts
    /lib
      graph.ts
      search.ts
      licenses.ts
```

If using the Next.js App Router, keep UI files under `/app` and shared code under `/src`.

---

## 6. Canonical ID conventions

Use stable, language-independent IDs.

Examples:

```text
field:mathematics
field:physics
subfield:linear-algebra
concept:vector-space
person:isaac-newton
work:principia-mathematica-newton
method:bayesian-inference
path:foundations-of-ai
```

Recommended ID regex:

```text
^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$
```

Do not use display labels as IDs. Do not use Korean labels as canonical IDs. Do not include spaces, punctuation, or unstable provider-specific names in canonical IDs.

Provider IDs such as Wikidata QIDs and OpenAlex IDs should be stored as external identifiers, not as primary IDs.

---

## 7. Core node schema concept

A node represents a field, subfield, concept, person, work, method, tool, institution, or path-relevant item.

Suggested fields:

```json
{
  "id": "field:mathematics",
  "type": "field",
  "domain": "formal_sciences",
  "level": 1,
  "status": "reviewed",
  "external_ids": {
    "wikidata": "Q395"
  },
  "created_at": "2026-06-02",
  "updated_at": "2026-06-02"
}
```

Node types for MVP:

- domain
- field
- subfield
- concept
- person
- work
- method
- tool
- institution

Node status values:

- draft
- generated
- proposed
- reviewed
- deprecated

Only reviewed nodes should become indexable if node pages are generated.

---

## 8. Translations and locale model

The MVP is English-first, but must be multilingual-ready.

Bad approach:

```json
{
  "id": "field:mathematics",
  "label": "Mathematics"
}
```

Better approach:

```json
{
  "node_id": "field:mathematics",
  "locale": "en",
  "label": "Mathematics",
  "summary": "The study of structure, quantity, space, and change.",
  "aliases": ["Math"],
  "reviewed": true
}
```

Later Korean entry:

```json
{
  "node_id": "field:mathematics",
  "locale": "ko",
  "label": "Mathematics in Korean later",
  "summary": "Korean summary later.",
  "aliases": [],
  "reviewed": false
}
```

Use English as `defaultLocale = "en"`. Korean support is planned, not required for MVP.

---

## 9. Core edge schema concept

Edges represent meaningful relationships between nodes.

Example:

```json
{
  "id": "edge:linear-algebra-prerequisite-machine-learning",
  "source": "subfield:linear-algebra",
  "target": "field:machine-learning",
  "relation": "prerequisite_for",
  "confidence": 0.95,
  "status": "reviewed",
  "evidence": ["source:manual-curation-v1"],
  "note": "Vectors, matrices, and linear transformations are foundational for machine learning models."
}
```

Every edge must include:

- id
- source
- target
- relation
- confidence
- status
- evidence

Edges must reference existing nodes.

---

## 10. Initial relation taxonomy

Keep relation types small and strict at first.

MVP relation types:

- part_of
- prerequisite_for
- influenced
- founded_or_formalized
- formalizes
- models
- measures
- enables
- applies_to
- critiques
- canonical_work
- adjacent_to

Definitions:

- part_of: A is a subdomain, subfield, or component of B.
- prerequisite_for: A is a useful learning prerequisite for B.
- influenced: A influenced B historically, intellectually, or methodologically.
- founded_or_formalized: A person or work helped found or formalize a field/concept.
- formalizes: A provides a formal mathematical/logical framing for B.
- models: A models or represents B.
- measures: A provides measurement/observation methods for B.
- enables: A makes B technically or practically possible.
- applies_to: A is applied to B.
- critiques: A critiques, opposes, or challenges B.
- canonical_work: A work is canonical for a field, person, or concept.
- adjacent_to: A is adjacent or strongly related to B, but the relationship is not more specific yet.

Avoid adding new relation types casually. If a new type is needed, update docs/relation-taxonomy.md and validation rules in the same PR.

---

## 11. Source and license policy

Sources must be tracked explicitly.

Preferred public/open sources:

- Wikidata for IDs and structured metadata.
- OpenAlex for scholarly works, authors, concepts, institutions, and citation graph data.
- ORCID for researcher identifiers.
- VIAF or library authority records for identity disambiguation.
- Wikipedia as external links and limited factual reference when license rules are respected.
- SEP, Britannica, official institution pages, and primary sources as external links or evidence references.

Third-party wiki handling:

- Wikipedia: link and cite carefully; do not bulk-copy article text into the product unless license and attribution requirements are handled.
- NamuWiki: external links only; do not cache article text, do not reproduce article structure, and do not treat it as primary evidence.

Data source fields should include:

```json
{
  "id": "source:wikidata",
  "name": "Wikidata",
  "source_type": "open_data",
  "license": "CC0",
  "commercial_use": true,
  "attribution_required": false,
  "share_alike_required": false,
  "url": "https://www.wikidata.org/",
  "last_checked_at": "2026-06-02"
}
```

For manual curation:

```json
{
  "id": "source:manual-curation-v1",
  "name": "Noosphere manual curation v1",
  "source_type": "manual",
  "license": "project-owned",
  "commercial_use": true,
  "attribution_required": false,
  "share_alike_required": false,
  "url": null,
  "last_checked_at": "2026-06-02"
}
```

---

## 12. External links policy

External links are pointers, not content.

Example:

```json
{
  "node_id": "person:isaac-newton",
  "locale": "en",
  "provider": "wikipedia",
  "url": "https://en.wikipedia.org/wiki/Isaac_Newton",
  "link_type": "further_reading",
  "content_cached": false
}
```

Korean example later:

```json
{
  "node_id": "person:isaac-newton",
  "locale": "ko",
  "provider": "namuwiki",
  "url": "https://namu.wiki/w/Isaac%20Newton",
  "link_type": "further_reading",
  "content_cached": false
}
```

Rules:

- content_cached must be false for NamuWiki.
- Do not store scraped article bodies.
- Do not store copyrighted images unless license metadata is complete.
- Do not store long quoted excerpts.
- External links should open with safe link attributes in the UI.

---

## 13. Data validation requirements

Create `scripts/validate-data.ts` and make it runnable via package scripts.

Minimum validation checks:

- Duplicate node IDs.
- Duplicate edge IDs.
- Invalid ID format.
- Invalid node type.
- Invalid edge relation type.
- Edge source missing.
- Edge target missing.
- Edge source and target are identical unless explicitly allowed.
- Missing evidence on edges.
- Confidence outside 0 to 1.
- Missing source IDs.
- Invalid source license metadata.
- External link URL invalid.
- External link uses disallowed scheme.
- NamuWiki link has content_cached true.
- Unreviewed or generated node marked indexable.
- Living-person node or edge lacks stricter evidence metadata.
- Circular prerequisite chains, if feasible to detect.

Package scripts should include:

```json
{
  "scripts": {
    "validate:data": "tsx scripts/validate-data.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

If dependencies are introduced, keep them minimal.

---

## 14. Security posture

The MVP should be read-only and static where possible.

Security rules:

- No auth in MVP.
- No database writes in MVP.
- No user-generated content in MVP.
- No comments in MVP.
- No admin UI in MVP.
- No secrets in repo.
- No static credentials in Claude cloud environment unless absolutely necessary.
- Avoid raw HTML rendering.
- Sanitize any rendered Markdown if Markdown rendering is introduced.
- External links must use safe attributes.
- Keep dependencies minimal.
- Add dependency scanning later.
- Prefer explicit validation over implicit assumptions.

Future security docs should reference OWASP principles, but do not overbuild early.

---

## 15. Admin roadmap

Admin is intentionally excluded from MVP.

Phase 1: No Admin

- Data lives in repo.
- Changes through PRs.
- Validation in CI.
- Manual review by owner.

Phase 2: Internal Admin

Only after the product has real usage:

- Authentication.
- 2FA.
- RBAC.
- Draft/proposed/reviewed/published/deprecated states.
- Audit log.
- Rollback.
- Link checker.
- License checker.
- No hard deletes.

Phase 3: Public Suggestions

Only after internal workflow is stable:

- User suggestion queue.
- Spam protection.
- Moderation.
- Abuse reporting.
- Rights/removal request flow.

---

## 16. SEO policy

Noosphere should not become a thin, auto-generated SEO content farm.

Rules:

- Auto-generated pages are noindex by default.
- Pages with only external links are noindex.
- Reviewed pages may be indexable if they have original value: relationship explanation, learning path context, curated sources, or original summary.
- Do not generate thousands of low-value pages.
- Every indexable node page should have a useful reason to exist.
- Prefer a small number of high-quality curated pages at first.

---

## 17. AI usage policy

AI can help draft code, docs, summaries, and data proposals.

AI must not be the final authority for factual relationships.

Rules:

- AI-generated data starts as generated or proposed, not reviewed.
- Do not let AI invent sources.
- Do not use AI to paraphrase copyrighted text too closely.
- Do not create unsupported claims about living people.
- Require evidence metadata for all edges.
- Use manual review before publishing pages as indexable.

---

## 18. Claude Code operating rules

Claude Code should work in small, reviewable steps.

General workflow:

1. Explore existing files.
2. Summarize understanding.
3. Propose a short plan.
4. Ask for approval if the task is broad or architectural.
5. Make small changes.
6. Run validation/typecheck/tests.
7. Summarize changed files and verification results.

Claude Code should not:

- Rewrite the whole project at once.
- Add major dependencies without justification.
- Introduce a database in MVP.
- Add auth or admin in MVP.
- Add scraping/crawling code in MVP.
- Add payment/ads in MVP.
- Add secrets or credentials.
- Remove policies to make implementation easier.
- Change relation taxonomy without updating docs and validation.

---

## 19. Recommended first milestone

Milestone: Repository foundation.

Deliverables:

- README.md with project summary and status.
- CLAUDE.md with concise persistent instructions.
- docs folder with policies and ADRs.
- data folder with small seed data.
- schema files with Zod validation.
- validate-data script.
- typecheck script.
- no app UI beyond placeholder if Next.js is initialized.

Acceptance criteria:

- `npm install` or `pnpm install` works.
- `npm run validate:data` passes.
- `npm run typecheck` passes if TypeScript project is initialized.
- Seed data contains at least 12 top-level domains or a clearly smaller bootstrap subset with TODOs.
- Edges reference valid nodes.
- Every source has license metadata.
- NamuWiki rule is represented in validation or documented as an immediate TODO.
- README explains that the repo is private/planning-stage and not production-ready.

---

## 20. Seed domain ideas

Initial top-level domains may include:

- formal_sciences
- natural_sciences
- life_sciences
- cognitive_sciences
- computer_and_information_sciences
- engineering_and_technology
- medicine_and_health
- social_sciences
- humanities
- arts_and_design
- practical_knowledge
- meta_knowledge

Initial fields:

- Mathematics
- Logic
- Statistics
- Physics
- Chemistry
- Biology
- Earth Science
- Astronomy
- Computer Science
- Artificial Intelligence
- Engineering
- Medicine
- Psychology
- Cognitive Science
- Economics
- Sociology
- Political Science
- Law
- Philosophy
- History
- Linguistics
- Literature
- Music
- Design

Initial people for later, not necessarily MVP seed:

- Aristotle
- Plato
- Euclid
- Isaac Newton
- Gottfried Wilhelm Leibniz
- Immanuel Kant
- Charles Darwin
- James Clerk Maxwell
- Alan Turing
- Claude Shannon
- John von Neumann
- Norbert Wiener
- Noam Chomsky

Do not over-focus on famous people before the field/concept schema is stable.

---

## 21. Product naming and description

Repository name: Noosphere

Recommended description:

An interactive atlas of human knowledge, mapping fields, concepts, people, works, and evidence-backed relationships.

Alternative shorter description:

A knowledge graph atlas for exploring human inquiry.

Alternative more poetic description:

A zoomable map of human inquiry, from fields and concepts to people, works, and influence trails.

---

## 22. Initial GitHub repository choices

Recommended settings for initial private repository:

- Visibility: Private.
- Add README: Yes, to create an initial default branch and make the repository immediately usable by cloud coding tools.
- Add .gitignore: Node, because the likely MVP stack is Next.js and TypeScript.
- Add license: None for now. Decide licensing later before making the repository public.

Rationale:

- Private keeps early work, messy scaffolding, and strategy private.
- README creates an initial commit and default branch.
- Node .gitignore prevents committing node_modules and common generated files.
- No license keeps all rights reserved by default while the commercial/open-source strategy is undecided.

---

## 23. Claude Code cloud environment recommendation

For the first cloud environment:

- Name: noosphere-mvp-trusted
- Network: Trusted
- Environment variables: none
- Setup script: empty for the first task

Reasoning:

- Trusted should allow common package registries needed for a Next.js/TypeScript project.
- No secrets are needed for a static/read-only MVP foundation.
- Setup scripts can be added later after package manager and build workflow are stable.

---

## 24. First Claude Code task summary

Ask Claude Code to bootstrap the repository foundation only.

Do not ask it to build the full app in the first task.

The first task should:

- Read this brief.
- Create/modify docs.
- Create CLAUDE.md.
- Add data schema and seed data.
- Add validation scripts.
- Add minimal package setup.
- Run checks.
- Report all changes.

---

## 25. Suggested future milestones

Milestone 1: Foundation

- Docs, schema, seed data, validation.

Milestone 2: Static graph viewer

- Basic graph view, node panel, search, relation filters.

Milestone 3: Learning paths

- Path data model, path detail page, path visualization.

Milestone 4: Data expansion

- 1,000 nodes, 3,000 edges, stronger source coverage.

Milestone 5: Print/export prototype

- Generate SVG or PDF from graph data.

Milestone 6: Korean locale

- Translation layer, Korean labels, Korean external links, NamuWiki links as external-only.

Milestone 7: 3D or globe mode

- Only after the 2D/2.5D graph and data model are valuable.

---

## 26. Definition of done for early PRs

A PR is not done until:

- It is small enough to review.
- It updates relevant docs.
- It runs validation.
- It avoids secrets.
- It avoids unnecessary dependencies.
- It does not add excluded MVP features.
- It includes a concise summary of what changed and why.
- It lists commands run and results.
- It calls out any unresolved assumptions or TODOs.

---

## 27. Final instruction to Claude Code

Prioritize maintainability over speed. The goal is not to create a flashy demo at any cost. The goal is to create a clean foundation that can survive future data growth, localization, public launch, monetization, and possible contributor workflows.

When in doubt, ask before changing architecture.
