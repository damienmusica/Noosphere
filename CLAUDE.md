# CLAUDE.md — Persistent instructions for Claude Code

Read `NOOSPHERE_CLAUDE_CODE_BRIEF.md` before making architectural decisions. If a
task conflicts with the brief or with these rules, **stop and ask** before changing code.

Noosphere is an English-first, multilingual-ready, **read-only** knowledge atlas.
The current priority is a maintainable, secure data foundation — not a feature-heavy app.

## Hard constraints (do not violate, do not "simplify away")

- No login, no accounts, no auth.
- No admin UI.
- No database — JSON data files in `/data` only.
- No user-generated content, comments, or public editing.
- No scraping or crawling of third-party sites.
- No secrets, API keys, or tokens in the repo or environment.
- No ads, no payments.
- No 3D globe yet.
- **NamuWiki: external links only.** `content_cached` must be `false`; never store article text, structure, or treat it as primary evidence.
- Do not use company-internal data, code, or credentials. Public/open data and original curation only.

## Data invariants (enforced by `scripts/validate-data.ts`)

- Every node has a stable, language-independent ID matching `^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$`.
  Never use display labels (or Korean labels) as IDs. Provider IDs (Wikidata QID, OpenAlex) go in `external_ids`.
- Every edge has `id`, `source`, `target`, `relation`, `confidence` (0–1), `status`, and non-empty `evidence`.
- Edges must reference existing node IDs; `source` ≠ `target` unless explicitly allowed.
- `relation` must be one of the types in `docs/relation-taxonomy.md`. To add a type, update the
  taxonomy doc, the Zod schema, and validation **in the same change**.
- Every source has license metadata (`license`, `commercial_use`, `attribution_required`, `share_alike_required`).
- Every edge's `evidence` entries must reference existing source IDs.
- Translations live in `node-translations.json`, keyed by `node_id` + `locale`. Default locale is `en`.
  Graph topology must never depend on displayed label text.
- Only `reviewed` nodes may be `indexable`. `generated`/`proposed`/`draft`/`deprecated` nodes must not be indexable.
- Living-person claims require stricter evidence and conservative wording.

## Workflow

1. Explore existing files and summarize understanding.
2. Propose a short plan; ask for approval if the task is broad or architectural.
3. Make small, reviewable changes.
4. Run `npm run typecheck` and `npm run validate:data`.
5. Summarize changed files, commands run, and results. Call out TODOs and assumptions.

Do **not**: rewrite the whole project at once; add major dependencies without justification;
introduce a database, auth, admin, scraping, payments, or ads; add secrets; or remove policies
to make implementation easier.

## Stack and dependencies

- TypeScript + Zod for validation; JSON data files first. Keep dependencies minimal.
- Preferred future stack (not required yet): Next.js, React, Graphology, Sigma.js, FlexSearch.
- Do not initialize the app UI unless framework initialization genuinely requires it.

## Commands

```bash
npm run typecheck      # tsc --noEmit
npm run validate:data  # tsx scripts/validate-data.ts
```
