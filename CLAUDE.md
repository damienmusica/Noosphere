# CLAUDE.md — Persistent instructions for Claude Code

Before broad architectural or Data Foundry work, read:

- `docs/project-charter.md` — durable identity, posture, boundaries, and the LLM boundary.
- `docs/data-foundry.md` — the current-phase working brief.
- `docs/source-of-truth.md` — which documents are authoritative and how authority moves across phases.
- `docs/product-brief.md` — product definition and scope.
- `docs/ai-usage-policy.md` — how AI may and may not contribute.

If a task conflicts with these documents or with the rules below, **stop and ask** before changing
code. `NOOSPHERE_CLAUDE_CODE_BRIEF.md` is the **superseded** foundation-phase brief — retained for
history, not the current canonical working brief.

Noosphere is an English-first, multilingual-ready, **read-only** knowledge atlas.
The current priority is a maintainable, secure data foundation — not a feature-heavy app.

## Hard constraints (do not violate, do not "simplify away")

- No login, no accounts, no auth.
- No admin UI.
- No database — JSON data files in `/data` only.
- No user-generated content, comments, or public editing.
- No scraping or crawling of third-party sites.
- No secrets, API keys, or tokens in the repo or environment.
- **No cloud LLM API calls, LLM SDKs, LLM API keys, or LLM-dependent CI/build/runtime steps.**
  LLMs are used interactively by maintainers only; repo tooling/runtime/build/CI must not require them.
- No ads, no payments.
- No 3D globe yet.
- **NamuWiki: external links only.** `content_cached` must be `false`; never store article text, structure, or treat it as primary evidence.
- Do not use company-internal data, code, or credentials. Public/open data and original curation only.
- AI-proposed nodes/edges must follow the reasoned-proposal contract in
  `docs/ai-usage-policy.md` (rationale + uncertainty + ambiguous flag) before entering
  the curation gate.
- Foundry proposals live under `foundry/proposals/` and are untrusted `generated` drafts;
  agents read `/data` as ground truth and must never treat proposals as verified or copy
  them into `/data` outside the curation gate.

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

## Working mode (2026-06-10+)

- Single-tool operation via Claude Code. Strategy/decisions upstream lives in
  the Obsidian vault folder `Noosphere/` (index.md decision log, roadmap.md).
  Read those at session start; do not reconstruct state from memory.
- Generation and QC must run in separate sessions (ADR 0007 contract).
- Promotion (`generated → proposed → reviewed`) follows the human-ratified
  standing policy (vault decision log 2026-06-10: the structural tier
  auto-promotes on resolver-verified external grounding; QC-ambiguous items
  stop at `proposed`; no verified grounding → stays in foundry). The CPO
  governs the policy, escalations, and dashboards — not per-item sign-off.
  Full provenance keeps every promotion bulk re-auditable and reversible.
- Ratified standing policies in force (the vault decision log is the
  authority; this list is a pointer, not a restatement): node promotion
  v1–v1.3; edge promotion v1 incl. clause 6 (contested placements) and its
  recorded operational interpretations; editorial v1 for summaries —
  **generation model = Opus** (decision (26)), orchestrator QC full
  fact-check unchanged; cross-listing v1 (co-equal multiple `part_of`,
  docs/data-foundry.md §13); B-track external-metrics standing policy
  (decision (27): pre-validation report → write proceeds without per-item
  sign-off unless an escalation trigger fires); evidence permanence via
  Wayback snapshots at QC time (docs/data-foundry.md §8, 2026-06-11).

## Stack and dependencies

- TypeScript + Zod for validation; JSON data files first. Keep dependencies minimal.
- Preferred future stack (not required yet): Next.js, React, Graphology, Sigma.js, FlexSearch.
- Do not initialize the app UI unless framework initialization genuinely requires it.

## Commands

```bash
npm run typecheck      # tsc --noEmit
npm run validate:data  # tsx scripts/validate-data.ts
```
