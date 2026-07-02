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
- **Decision autonomy (decision (91), `docs/data-foundry.md` §7.1): the gate
  axis is "does this change policy/identity/schema or trip a narrow risk
  signal," NOT "is this a decision."** CTO decides autonomously (proceed, log
  it) on: wave scoping + sequencing among sanctioned tracks; applying any
  ratified ladder/policy; modeling rulings that mirror an already-ratified
  pattern (e.g. co-canonical = founder-multiplicity mirror); mirror-ladder
  openings post-measurement (notify, CPO may veto); mechanical QC outcomes;
  rule-covered literature-boundary cases; housekeeping. **Stop only for the
  narrow set:** a new *risk-family* policy/ladder (not a mirror); a
  schema/taxonomy change; a strategy pivot / phase transition; living-person
  narrow escalation signals (70); a boundary the rule is genuinely silent on;
  live evidence refuting a ratified premise; reversing a ratified policy.
  Over-gating routine/mirror decisions is the twin of defeatism — the
  decision (89)/(70) discipline. Autonomous decisions are logged with
  provenance → reversible.
  Full provenance keeps every promotion bulk re-auditable and reversible.
- Ratified standing policies in force (the vault decision log is the
  authority; this list is a pointer, not a restatement): node promotion
  v1–v1.4 (v1.4 = QID-less-but-recognized alternative identity anchor via a
  CPO-ratified expert disciplinary taxonomy [currently PhilPapers only] + ≥2
  independent authorities, decision (93), docs/data-foundry.md §8); edge
  promotion v1 incl. clause 6 (contested placements) and its
  recorded operational interpretations; editorial **v2** for summaries —
  **generation model = Opus** (decision (26)); QC = machine checks in full
  (claim-anchor verbatim + cited-URL live survival + SPN §8) + orchestrator
  close-read on a 30% sample (50% on a policy's first run) with all
  self-flagged/ambiguous and all [UNFETCHED] items checked in full; one
  factual error in the sample/flags escalates the whole batch back to full
  close-read + CPO report (decision (34), 2026-06-12, supersedes the v1
  "full fact-check" QC clause); cross-listing v1 (co-equal multiple `part_of`,
  docs/data-foundry.md §13); B-track external-metrics standing policy
  (decision (27): pre-validation report → write proceeds without per-item
  sign-off unless an escalation trigger fires); evidence permanence via
  Wayback snapshots at QC time (docs/data-foundry.md §8, 2026-06-11);
  repo-hygiene devices (decision (29), 2026-06-11): session-close hygiene
  check (vault workflow.md) + machine-enforced proposals-index consistency
  and local .md link checks in `npm run validate:data`; **propositional
  `formalizes` auto-`reviewed` ladder (decision (54), 2026-06-19): a
  (d)-decidable `formalizes` edge auto-promotes `proposed → reviewed` when
  both endpoints are `reviewed` and the Lane B pipeline returns *supported*
  (≥2 independent claim-stating live sources + adversarial QC + correct
  direction); `disputed`/NEI verdicts stop at `proposed`/foundry. Earned by
  the wave-1+wave-2 measurement (precision 1.0 at N=27, hallucination 0,
  decisions (51)/(53)). The `influenced`/`critiques` (a)-relations now have
  their own ladder too (decision (68) — see the (a)-ladder item below).**; **person/work node contract v1
  (decision (58), 2026-06-19): the corpus admits `person`/`work` nodes only
  for those that founded/formalized an existing `reviewed` field/concept
  (keep-criteria — not "all famous people"); IDs `person:given-family` /
  `work:kebab` (names live in node-translations, QID in external_ids);
  `academic_status` omitted on persons (deceased/living carried by
  `is_living_person`); node promotion policy v1 extended to persons
  (QID resolver-verified + `is_living_person` live-confirmed-false →
  auto-`reviewed`); living-person nodes still require the charter's stricter
  evidence + CPO review (a stopping point). `founded_or_formalized` edges are
  a NEW relation class — initially proposed-first with their own gate (now
  opened — see the founder-ladder item below). Schema unchanged (already
  enforced by node.ts + validate-data). Full design = vault
  `founder-node-gate-design.md`.**; **`founded_or_formalized` auto-`reviewed`
  ladder (decision (60) opened, decision (61) executed session #32,
  2026-06-19): a founder edge auto-promotes `proposed → reviewed` when both
  endpoints are `reviewed` and the Lane B pipeline returns *supported* (≥2
  independent claim-stating live sources + adversarial perspective-diverse QC +
  correct person→field direction + identity referent verified);
  `disputed`/NEI/reject stop at `proposed`/foundry. **★ Living-founder guard:**
  `is_living_person:true` founders do NOT auto-promote — they stay at the CPO
  stop-point (charter stricter evidence; double-enforced — a living node is not
  auto-`reviewed` by node policy v1, so its endpoint fails clause ①). Earned by
  the wave-1+wave-2 measurement (precision 1.0 at N=20, hallucination 0,
  rejection fired 5×, decisions (58)/(59)); 1:1 mirror of the (54) `formalizes`
  ladder. The `influenced`/`critiques` (a)-relations now have their own ladder
  too — see below.**; **`influenced`/`critiques` (a)-relation auto-`reviewed`
  ladder (decision (68), executed session #37, 2026-06-29): an (a)-edge
  auto-promotes `proposed → reviewed` when both endpoints are `reviewed` and the
  Lane B pipeline returns *supported* (≥2 independent claim-stating live sources +
  adversarial perspective-diverse QC + correct direction + identity referent
  verified); **`disputed`/NEI/reject stop at `proposed`/foundry** (clause-6 v2
  safety net — `nietzsche→freud` disputed correctly held). A record-not-resolve
  tension/scope `note` does NOT disqualify a supported edge (only `disputed:true`
  / node `ambiguous` stops the ladder). **★ Living-person guard:**
  `is_living_person:true` endpoints do NOT auto-promote — CPO stop-point
  (charter stricter evidence; double-enforced via node policy v1). Earned by the
  #29+#34+#36 (a)-wave measurement (precision 1.0 on supported verdicts,
  hallucination 0) + clause-6 v2's first correct fire (decision (67)) validating
  the safety net; promoted the standing backlog of 20 supported edges. 1:1
  mirror of the (54) `formalizes` / (60)/(61) `founded_or_formalized` ladders.
  Full policy = `docs/data-foundry.md` §8.**; **living-person handling standing
  policy (decision (70), 2026-06-30): the risk axis for a living person is
  **claim type × source authority × contention — NOT aliveness**. This
  **supersedes the blanket "living endpoint → CPO stop-point / never
  auto-promote" framing** in the (54)/(60)/(61)/(68) ladder guards above. A
  living-person node/edge is held to a *stricter* floor than the deceased path
  (resolver-verified QID identity anchor [P570 live-confirmed absent] + ORCID/
  institutional optional + ≥2 independent live claim-stating sources +
  conservative *attributed* wording; summary allowed but careful) and
  **auto-promotes to `reviewed` when clean** (clause-6 v2 = supported) —
  generalizing the Seligman precedent (62), NOT a per-item CPO gate.
  **Indexability = same earned rule as any node** (`indexable` is SEO-only,
  orthogonal to explorability — living people are NOT force-`noindex`d).
  Self-disclosure = provenance **tag**, not a weighting judgment (can't alone
  meet the ≥2 floor). **Escalation fires only on a narrow signal set**:
  clause-6 v2 `disputed`/NEI/reject · thin/non-authoritative sourcing · any
  private-life/reputational/negative content · subject dispute (deferred ops).
  **CPO governs policy/thresholds/dashboard, not per-item sign-off** (restores
  (7)/contract 3). Robust to the fluid living/deceased boundary: status is
  *observed* (P570), never predicted; drift runs living→deceased
  (stricter→looser) and periodic re-grounding self-corrects. Schema unchanged
  (`is_living_person` exists; `validate-data` already enforces living
  external_id≥1 + status∉{draft,generated}). **No unverified legal-doctrine
  asserted** in docs (GDPR for EU residents = confirm with primary sources if it
  becomes a concern). Grounded by the #38 deep-research (Wikipedia BLP·Wikidata·
  OpenAlex·ORCID·Scholia, prior-art unanimous; Noosphere narrower → a-fortiori).
  Full design = vault `reference/living-person-handling-v2-design.md`; full
  policy = `docs/data-foundry.md` §8.**

## Stack and dependencies

- TypeScript + Zod for validation; JSON data files first. Keep dependencies minimal.
- Preferred future stack (not required yet): Next.js, React, Graphology, Sigma.js, FlexSearch.
- Do not initialize the app UI unless framework initialization genuinely requires it.

## Commands

```bash
npm run typecheck      # tsc --noEmit
npm run validate:data  # tsx scripts/validate-data.ts
```
