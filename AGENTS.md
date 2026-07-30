# AGENTS.md — Noosphere

모든 코딩 에이전트가 읽는 정본이다. Claude Code는 `CLAUDE.md`를 통해 이 파일을 import 한다.
개인 전역 지침은 `~/dotfiles/AGENTS.md`.

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

### Staging and merging (both rules were paid for, 2026-07-30, decision (116))

- **Never `git add -A` while subagents are writing into the working tree.** Stage explicit paths.
  A background generation workflow was mid-write when an unrelated commit ran `git add -A`; it swept
  in one half-written proposal file, and an incomplete batch directory fails the batch-hygiene
  invariants (README index row, evidence-permanence anchor), so main went red.
- **"no checks reported" is not green — it is a registration race.** `gh pr checks --watch` returns
  it when the workflow has not registered yet, and merging on it puts an unverified commit on main.
  Poll until the checks actually conclude, then merge.
- A batch directory under `foundry/proposals/` is valid only when **complete**. Do not commit
  in-flight drafts; ship the batch with its README index row and anchors in one change.

## Data Foundry 승급 정책

이 레포의 승급 정책(ladder), 결정 자율성 경계, ops 패키지는 **`docs/data-foundry.md` §8 / §15**가
권위 있는 원본이고, Obsidian vault 의 decision log 가 최종 권위다.
**foundry 관련 작업을 하기 전에 반드시 읽는다.**

Claude Code 사용자는 `.claude/rules/data-foundry-policy.md` 가 `foundry/**` 파일을 열 때
자동으로 로드된다.

## Stack and dependencies

- TypeScript + Zod for validation; JSON data files first. Keep dependencies minimal.
- Preferred future stack (not required yet): Next.js, React, Graphology, Sigma.js, FlexSearch.
- Do not initialize the app UI unless framework initialization genuinely requires it.

## Commands

```bash
npm run typecheck      # tsc --noEmit
npm run validate:data  # tsx scripts/validate-data.ts (incl. canonical-format + v2-proposal checks)
npm run format:data    # rewrite /data into canonical form (semantic no-op, verified)

# Batch flow (docs/data-foundry.md §15.3):
npm run foundry:fetch-corpus    -- <urls.json|txt> --out <scratch-dir>     # local-only network; polite source collection (never hand-roll fetch loops)
npm run foundry:draft-decision  -- <batch-id> --qc-by "<name>=<version>"   # offline; schema-valid decision skeleton (+ --summaries / --flip-indexable seeding)
npm run foundry:verify-identity -- foundry/decisions/<batch>.json --write  # local-only network
npm run foundry:anchor          -- foundry/decisions/<batch>.json --write  # local-only network (SPN circuit breaker; --no-spn on outage days)
npm run foundry:ladder-check    -- foundry/decisions/<batch>.json          # offline
npm run foundry:ladder-fixtures                                            # offline; CI-gated golden fixtures (run after ANY ladder change)
npm run foundry:ladder-mutation-sweep                                      # offline; maintainer tool — audits the fixtures themselves (patches lib/ladders.ts, restores)
npm run foundry:apply-batch     -- foundry/decisions/<batch>.json          # offline; THE write path
npm run foundry:report          -- foundry/decisions/<batch>.json --write  # offline

# Session start ritual:
npm run foundry:recheck-held   # held/blocked worklist
npm run report:graph           # incl. editorial-gap dashboard
```
