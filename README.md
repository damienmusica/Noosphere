# Noosphere

An interactive atlas of human knowledge, mapping fields, concepts, people, works, and evidence-backed relationships.

> **Status:** Public, planning-stage. This is **not** production-ready. The repository foundation (docs, schemas, seed data, validation) is complete; the current milestone is the **Data Foundry and scalable curation methodology** — see [`docs/data-foundry.md`](docs/data-foundry.md).

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
/data            Canonical accepted graph data (nodes, translations, edges, sources, links, paths).
                 Ten curated continents so far: humanities (philosophy, history, linguistics,
                 literary studies, religious studies, classics, archaeology), formal sciences,
                 computer & information sciences, natural sciences, social sciences, life sciences,
                 engineering & technology, arts & design, medicine & health, cognitive sciences —
                 every node/edge promoted through the curation gate below. (practical-knowledge and
                 meta-knowledge domains are intentionally empty pending a scoping re-gate.)
/foundry         Data Foundry working area:
                   batches/    committed batch manifests (resolver/generation inputs)
                   proposals/  committed proposal batches + permanent QC / grounding / resolution /
                               audit reports — see foundry/proposals/README.md for the batch index
/docs            Product brief, policies, current-phase working brief, and ADRs
/src/schema      Zod schemas + shared types for all data files
/scripts         validate-data.ts (data integrity + policy checks), scripts/foundry/* (resolver,
                 golden-set regression check, claim-anchor citation checker, fetch-verify live
                 citation checker, OpenAlex pre-validation table, offline scaffold)
CLAUDE.md        Persistent instructions for Claude Code sessions
NOOSPHERE_CLAUDE_CODE_BRIEF.md   Superseded foundation-phase brief (retained for history)
```

## How the data is made (and verified)

Every batch follows one loop, with the full paper trail committed: a **batch manifest**
(`foundry/batches/`) feeds a generation step that must emit **reasoned proposals** (rationale +
uncertainty + self-flags, [ADR 0007](docs/adr/0007-evidence-kinds-and-reasoned-proposals.md));
a separate QC context then re-grounds every claim against **live external sources** (Wikidata,
LCC/UDC/MSC/ACM CCS outlines, encyclopedias — never training-knowledge identifiers), and
identity-verified entries are promoted into `/data` under CPO-ratified standing policies.
Each batch leaves a permanent report under `foundry/proposals/` — the whole corpus is
bulk re-auditable from those records (a first adversarial re-audit measured 0/24 confirmed
residual identity errors). Details: [`docs/data-foundry.md`](docs/data-foundry.md).

## Getting started

```bash
npm install
npm run typecheck     # tsc --noEmit
npm run validate:data # validates /data against schemas + policy rules
npm run export:graph  # builds dist/noosphere-graph.json (static, read-only)
npm run report:graph  # prints an observational graph coverage summary

# Data Foundry tooling (maintainer-local; nothing here runs in CI)
npm run foundry:validate-batches   # validates batch manifests
npm run foundry:resolve-wikidata -- foundry/batches/<manifest>.json  # network resolver (local only)
npm run foundry:goldenset          # offline regression check of resolver output vs verified verdicts
npm run foundry:claim-anchor -- <captured-page> "<quote>"            # citation QC helper (offline)
npm run foundry:fetch-verify -- <summaries.json> [--concurrency N]   # live-fetch + verbatim citation table (network, local only)
npm run foundry:openalex-prevalidate -- --domains <a,b> [--types t]  # OpenAlex B-track pre-validation table (network, local only)
```

`export:graph` converts the `/data` JSON into a single read-only graph payload at
`dist/noosphere-graph.json` for a future static UI. It is a **build artifact, not a database** —
`dist/` is gitignored and the file is regenerated, never committed. The export has an explicit
schema contract (`src/schema/exported-graph.ts`): the payload is validated before writing, so the
generated JSON stays a stable, read-only shape for future static UI consumption. See
[`docs/data-model.md`](docs/data-model.md#static-graph-export).

`report:graph` prints a concise, deterministic summary of the current graph (totals, type/status
breakdowns, and simple connectivity signals) to stdout. It is an **observational coverage report, not
a validation gate** — `validate:data` remains the source of truth for pass/fail — and it does not
require a committed `dist/noosphere-graph.json`. See
[`docs/data-model.md`](docs/data-model.md#graph-summary-report).

Data changes happen through Git commits and pull requests — there is no write path in the application.

The **Data Foundry** scaffold (offline batch manifests and proposal skeletons) is documented in
[`docs/data-foundry.md`](docs/data-foundry.md#10-initial-scaffold--current-commands). It calls no
public knowledge APIs and no cloud LLM APIs; generated skeletons live under `dist/foundry/...` and are
not committed, while `/data` remains the canonical accepted graph data.

A first **network-dependent** Foundry resolver — `foundry:resolve-wikidata` — resolves a batch's seed
entities against Wikidata using open, keyless endpoints and writes a candidate source pack under
`dist/foundry/source-packs/...`. It is a source-resolution step only (no `/data` changes, nothing
`reviewed`/`indexable`, no secrets), and is **intentionally not run in CI**. See
[`docs/data-foundry.md`](docs/data-foundry.md#11-wikidata-source-pack-resolver-first-network-resolver).

## Documentation

- [`docs/project-charter.md`](docs/project-charter.md) — durable identity, posture, boundaries, and the LLM boundary.
- [`docs/data-foundry.md`](docs/data-foundry.md) — the current-phase working brief (data methodology).
- [`docs/source-of-truth.md`](docs/source-of-truth.md) — which documents are authoritative, and how that changes across phases.
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
