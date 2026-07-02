# Data Foundry — Current Phase Working Brief

This is the **current-phase working brief** for Noosphere. It governs scope and intent for the data
methodology / Data Foundry phase. It defers to [`docs/project-charter.md`](project-charter.md) for
durable identity, posture, and boundaries, and to the specific source-of-truth documents (data
model, relation taxonomy, policies) for the topics they own. See
[`docs/source-of-truth.md`](source-of-truth.md) for the hierarchy.

This brief describes the **methodology and boundaries**. It does not, by itself, build Data Foundry
tooling — that happens in later, explicit PRs (see the implementation sequence below).

## 1. The data bottleneck

Noosphere's main constraint is **high-quality graph data, not UI**. A polished interface over a thin
or unreliable graph has little value. The atlas becomes useful as its node/edge coverage grows while
staying evidence-backed, license-clean, and reviewable.

## 2. Goal

Build a **cloud-LLM-API-free, local/offline-first data proposal and curation workflow** that can
construct graph data at scale while honoring every charter boundary. The workflow turns open inputs
into schema-valid, evidence-pointed *candidate* data, then routes it through validation and a
risk-tiered curation gate before any of it becomes reviewed or indexable.

The graph it builds is a **globe, not a tree** — nodes may carry co-equal multiple parents (§13), and
the foundry **organizes and connects; it does not adjudicate.** It records the *state* of discourse,
including the unresolved and contested, rather than resolving it (charter §1). Curation corrects
identity/referent-axis errors and preserves perspective/context-axis disagreement — see §8's tension
preservation rule.

## 3. Allowed inputs

- **Repo-managed JSON** under `/data` (the existing source of truth).
- **Open, free public knowledge APIs** that are documented, safe, and license-compatible
  (e.g. Wikidata, OpenAlex, ORCID, VIAF).
- **Public datasets / dumps** with a compatible license.
- **Interactive LLM assistance** used by maintainers *outside* programmatic API calls — reasoning,
  design, review, prompt writing, and code/data drafting done through interactive tools.

## 4. Forbidden inputs

- **Cloud LLM APIs called from scripts** (OpenAI, Anthropic, or any other).
- **Paid or proprietary APIs required** for build/validate/export/report/runtime.
- **Secrets or tokens** of any kind in the repo or environment.
- **Scraping or crawling article bodies.**
- **NamuWiki as evidence or source** — it remains external-link-only, never cached, never cited.

## 5. Batch lifecycle

Large-scale data construction happens in **batches**, each moving through a fixed pipeline:

1. **Batch manifest** — declares scope, target domains/relations, risk tier, inputs, and the source
   resolvers it will use.
2. **Source resolution** — resolves entities/claims against allowed open sources, recording provider
   IDs in `external_ids` and citable entries in the source registry.
3. **Proposal generation** — emits schema-shaped candidate nodes/edges with evidence pointers. Output
   is `generated`/`proposed`, never `reviewed`.
4. **Validation** — runs the existing Zod schema + policy validation against the candidate batch.
5. **Report** — produces a deterministic report (coverage, risk flags, license posture, anomalies)
   for the curation decision.
6. **Risk-tiered curation gate** — the batch is accepted, revised, or rejected against the criteria
   for its risk tier.
7. **Static reviewed/indexable release** — accepted data is promoted to `reviewed`, and eligible
   items may become `indexable`, shipped as a static release.

## 6. Status semantics

- **`generated`** — raw tool/model output. Not trusted. Not citable as established. Never indexable.
- **`proposed`** — schema-valid candidate data with evidence/source pointers. A real candidate for
  review, but not yet accepted. Never indexable.
- **`reviewed`** — passed the curation gate for its risk tier **and** was accepted through a
  batch/release decision. Eligible to be indexable.
- **`indexable`** — allowed into public/static atlas surfaces. Only `reviewed` items qualify.

## 7. Review semantics

"Reviewed" is a **curation-gate outcome**, not a guarantee that the owner read every row.

- The owner **does not need to line-by-line verify every low-risk row.**
- The owner **approves the process, the batch scope, the reports, the exceptions, and the high-risk
  claims.**
- Higher risk tiers demand more direct, item-level scrutiny; lower tiers may be accepted on
  process + report evidence for the batch as a whole.

### 7.1 Decision autonomy — CTO-autonomous defaults vs. the narrow stop-set (decision (91))

> **Standing policy, CPO-ratified session #49 (2026-07-02).** The gate axis is **"does this change
> policy / identity / schema, or trip a narrow risk signal" — NOT "is this a decision."** Routine,
> rule-covered, and mirror-of-ratified judgments are **CTO-autonomous**; stopping on them is
> over-gating that costs efficiency for no safety (the twin of defeatism, decision (89); the same move
> as decision (70), where the risk axis was reset to claim × authority × contention, not aliveness).
> Every autonomous decision is logged with full provenance → bulk re-auditable and **reversible**, so
> autonomy carries no accountability cost.

**CTO decides autonomously (proceed, record in the decision log — do not stop):**

1. **Wave scoping** — which nodes/edges/works/people, batch size, and **sequencing among
   already-sanctioned tracks** (e.g. work-wave ∥ cross-cutting-edge ∥ concept build are all sanctioned
   phase-2 work; ordering them is not a strategy call). (decision (83).)
2. **Applying any already-ratified ladder/policy to new items** — node-policy v1; the
   person / founder / `formalizes` / `(a)` / `work` / `canonical_work` auto-`reviewed` ladders; the
   living-person floor (decision (70)) when clean.
3. **Modeling rulings that are 1:1 mirrors or direct corollaries of an already-ratified pattern** —
   e.g. co-canonical works = the works-layer mirror of a field's multiple founders (decision (90));
   §12/§13 single-node placements; concept-vs-subfield referent-precision calls.
4. **Opening a new auto-`reviewed` ladder that is a 1:1 mirror of an already-proven decidable
   (d)-family ladder**, once the batch measurement meets the standing bar (precision ≈ 1.0,
   generator-hallucination catch, reject-probe fires): CTO opens **with a notify** (logged; CPO may
   veto) — not a blocking gate. Same decidable-QID-grounded family only. **Notify channel (2026-07-02):**
   a decision-log entry **plus** an explicit "⚠ ladder opened — CPO may veto" marker in both the
   session-end summary and the roadmap current-stage line, so a real veto window exists before the next
   wave builds on the opened ladder.
5. **Mechanical QC outcomes** — honesty-gap drops, reject-probe rejections, proposed-holds,
   record-not-resolve notes, duplicate / relation-choice drops.
6. **Literature-boundary cases the rule already decides** (decision (86)) — knowledge-work → IN;
   art-work → Booksphere-reserved.
7. **Housekeeping** — doc corrections, proposals-index rows, provenance, promotion reports.

**Genuine stop-points (surface to the CPO — the narrow set):**

1. **A brand-new policy / criteria / ladder for a NEW risk family** — one that is *interpretive*, not
   decidable-QID-grounded, and not a mirror of an existing ladder.
2. **Schema / taxonomy change** — a new relation type or node type (the CLAUDE.md hard rule:
   taxonomy + Zod + validation in one change). The CTO drafts it fully; the stop is only the ratify.
3. **Strategy pivot / phase transition** — declaring a phase complete, spinning up a sister product
   (Booksphere), or changing the atlas's scope or identity.
4. **Living-person NARROW escalation signals only** (decision (70)) — clause-6 v2 disputed/NEI/reject ·
   thin/non-authoritative sourcing · any private-life/reputational/negative content · subject dispute.
5. **A novel boundary the governing rule is genuinely silent on** — not merely "a boundary case," but
   one the existing rule does not resolve.
6. **Live evidence that refutes a ratified premise** — then report, re-model accurately, do not force
   (decisions (82)/(89)).
7. **Reversing or contradicting a ratified policy.**

Anything not in the stop-set proceeds. When unsure whether an item is a mirror-of-ratified (autonomous)
or a new-risk-family (stop), the tie-breaker is the decision (89) discipline: check the rule's *actual*
safety value by reasoning/research — do not stop on procedural caution alone.

## 8. Risk tiers

From lowest to highest scrutiny:

- **Low-risk structural taxonomy** — `part_of` hierarchies, domain/field/subfield structure.
- **Medium-risk summaries / concept relations** — concept-to-concept relations and short summaries.
- **Pedagogical relations / learning paths** — `prerequisite_for` chains and curated paths.
- **Historical people / works / influence claims** — `influenced`, `founded_or_formalized`,
  `canonical_work`, and similar historical claims.
- **High-risk living-person / current / controversial claims** — claims about living people, current
  events, or contested topics. These require the strictest evidence and the most conservative
  wording. Living-person claims are governed by the **living-person handling standing policy**
  (below), which tiers them by *claim type × source authority × contention* rather than by aliveness,
  and escalates to owner review only on a narrow set of risk signals — not per item.

### Evidence kinds

Evidence is of two kinds. **Externally-sourced** evidence backs structural and
factual edges (e.g. `part_of` backed by Wikidata). **Editorial/curatorial**
evidence backs pedagogical judgments (`prerequisite_for`, learning paths) and
is recorded against `manual` sources. Pedagogical edges should cite a real
curriculum or textbook source where one exists, and fall back to manual
curation only when none does. The `source_type` field must honestly reflect
which kind an edge relies on.

### Evidence permanence (Wayback snapshots / wiki revision permalinks — standing rule, 2026-06-11; amended 2026-07-02)

External pages that QC relies on for a verdict get a **permanence anchor
recorded at verification time** in the batch's permanent report, alongside the
citation. The same duty applies to research collection and editorial citation
records. Two anchor kinds are accepted:

- **MediaWiki-hosted sources (Wikipedia and sister projects) — revision
  permalink (preferred, amendment 2026-07-02):** record the permalink of the
  revision relied on, `https://<lang>.wikipedia.org/w/index.php?title=<title>&oldid=<revid>`
  (the revid is returned by the same API calls QC already makes, or by
  `action=query&prop=revisions`). A revision permalink is native, immutable,
  keyless, and unaffected by later edits or SPN outages — for wiki sources it
  is an equal-or-better anchor than a Wayback snapshot, and snapshotting a
  wiki page via SPN is redundant.
- **All other domains — Wayback Save Page Now snapshot:** request
  `https://web.archive.org/save/<URL>` (keyless public endpoint, serial
  requests at a polite interval) and record the snapshot URL. Rules:
  - A snapshot URL counts only if it matches `web.archive.org/web/<timestamp>/…`
    — a redirect to a save prompt is **not** a snapshot (measured failure mode).
  - Save failures are recorded honestly as `[SPN-FAILED]` — never silently
    dropped, never substituted with an unverified URL.
  - For bot-blocked domains, verifying an **existing** snapshot
    (`https://web.archive.org/web/<year>/<URL>` redirect to a real snapshot) is
    an acceptable substitute; record that snapshot URL instead.

A batch whose verdicts genuinely rely on no external page (offline
housekeeping, status flips) records the explicit marker `[NO-EXTERNAL-EVIDENCE]`
in its report instead — never silence.

Rationale: live pages drift and die; the corpus's bulk re-auditability
(vault decision log 2026-06-10 (3)) is only as durable as its evidence URLs.
**Compliance history (2026-07-02 CPO audit):** the rule was honored through the
`formalizes` era, then silently lapsed from the founder waves onward (0 anchors
across the person/work/a-relation batches of sessions #44–#49). Remediation:
`foundry/proposals/evidence-permanence-backfill-v1` records revision-as-of-QC-date
permalinks for all affected reviewed ladder edges, and `validate-data.ts` now
machine-enforces an anchor (or the explicit marker) in every new batch's records
(decision (29) hygiene-device pattern; pre-existing batches are grandfathered —
their coverage lives in the backfill report).

### Tension preservation (identity-axis vs perspective-axis — standing QC rule)

Noosphere **records the state of discourse; it does not resolve it** (charter §1). This is the
standing QC discipline across every risk tier, and it extends to the **propositional-relation layer**
(`influenced`, `critiques`, `founded_or_formalized`, and similar claim-bearing edges), not only to
structural placement. (Codified here, ahead of the first propositional-edge batch — policy before
work. Supersedes the earlier plan to bundle this with that batch's PR.)

- **Correct only on the identity/referent axis.** Fix errors of *what a thing is* — a QID pointing at
  the wrong entity, a date or attribution that is factually wrong, a relation whose referent is
  mistaken. These are data-quality errors, and QC corrects or rejects them.
- **Preserve disagreement on the perspective/context axis.** Where sources genuinely disagree about
  *interpretation* — whether A influenced or critiqued B, which school is right, how a claim holds
  within one framework but not another — record the disagreement rather than picking a winner: keep
  co-existing edges, set `disputed: true`, and preserve the minority position in `note`. Never delete
  a sourced position or collapse it into one voice.
- **The only judgment is data-quality, never about the world.** "Is this a genuine scholarly
  disagreement or an AI hallucination / sourcing error?" is in scope. "Who is right?" is not.
- **A source floor under contested claims too.** Disagreement is preserved only when each side is
  sourced; this is the guard against injecting fabricated controversy (no unsourced "some say"). Edge
  asymmetry is carried per-edge by `confidence`, `disputed`, and `note` — interpretation and display
  stay downstream.

This is a cost-zero discipline: it needs no new field or schema. Whether a *new structured mechanism*
(e.g. framework/school/scale qualifier fields) is ever warranted is measurement-first — see the
relation taxonomy's watch-items; build only on measured need.

### Contested propositional relations — clause-6 v2 (standing decision procedure)

The tension-preservation rule states *what* to record; this is the decision procedure that
operationalizes it for the **propositional-relation layer** (`influenced`, `critiques`,
`founded_or_formalized`, and similar claim-bearing edges). It is **clause-6 v2** — the v1 dominant-view
rule (vault decision (15): position the edge on the dominant view, ≥3 sources, minority in `note`)
generalized so it can also express the *balanced split* v1 structurally could not. Schema is **unchanged**:
it uses `disputed` (bool), `note`, and `confidence` (0–1), all already present — a **policy /
operationalization** revision only, no Zod / validator / taxonomy change. Ratified by vault decision (64),
codified here by decision (68) after it fired correctly without over-firing (decision (67)).

**Run the tree only after** atomize + **≥2 independent claim-stating** grounding sources are live-fetched
and verbatim-checked + adversarial perspective-diverse counter-evidence QC. The verdict for one
propositional-relation candidate:

1. **Dominant view affirms, no substantial dissent → `supported`** (reviewed-eligible per the (a)/(d) ladder).
2. **Dominant view affirms, but a *live, sourced* scholarly minority dissents on EXISTENCE / DIRECTION →
   `disputed: true` (asymmetric)** — write positioned on the dominant view, `disputed: true`, the minority
   position and its sources in `note`. *This branch is exactly clause-6 v1 — v1's dominant-view requirement
   is absorbed here unchanged.*
3. **No dominant view — genuine split, EXISTENCE / DIRECTION contested, each camp ≥2 independent
   claim-stating sources → `disputed: true` (balanced)** — write the edge as a *contested claim*, not as
   established: `disputed: true`, `confidence ≈ 0.5`, **not positioned as a winner**, `note` records both
   camps as live. *This is the new sub-case v1 could not express — without a dominant view v1 forced these
   into NEI, recording a live controversy as ignorance.*
4. **Dominant view denies; the affirming side is discredited / fringe, not a live scholarly position →
   `reject`** (no edge).
5. **Insufficient claim-stating sources to characterize the relation at all → NEI** (no edge, honest gap).
6. **Mutual / bidirectional (both directions documented) → two co-existing directed edges** —
   bidirectionality ≠ contestation, so neither edge is `disputed`.

**Two load-bearing distinctions.**

- **Existence / direction contested (→ disputed, #2/#3) vs degree / character debated (→ supported + note).**
  If everyone agrees the relation exists and only its *extent or character* is debated → `supported` + a
  tension `note` (all agree Comte influenced Durkheim; *how much* is debated). If the *existence or
  direction itself* is genuinely split → `disputed`.
- **disputed vs NEI.** `disputed: true` = *we found the debate* — substantial sourced positions on ≥2
  sides, unresolved; the edge is written because the contestation is itself a documented feature of the
  discourse ("scholars actively debate whether A influenced B" is a true statement about scholarship —
  that, not the influence, is what the edge records). `NEI` = *we could not find enough* — insufficient
  claim-stating sources to characterize the relation at all; about our evidence, not the world's debate;
  no edge. Operational test: "Is there a body of scholarship that explicitly engages this as a contested
  question, with sourced positions on multiple sides?" Yes → disputed; "Can we not find sources stating
  the relation at all?" → NEI.

**Floors and guards.**

- **Source floor on every camp** (no fabricated controversy): a balanced split needs each side ≥2
  independent claim-stating sources; an asymmetric one needs dominant ≥2 + minority ≥1. Every camp must be
  a **live scholarly position**, not a discredited / fringe one (that → reject, #4).
- **No manufactured disputes** (= hallucination-class failure): a disputed edge needs the debate *found in
  the literature*, not constructed by the pipeline. QC judges **data-quality only** ("is this a real
  scholarly debate or a sourcing artifact?"), never "who is right."
- **disputed edges never auto-promote.** Regardless of any ladder, a `disputed: true` edge stays
  `proposed` / human-visible — these are exactly the claims that warrant eyes. The (a)/(d) auto-`reviewed`
  ladders explicitly exclude `disputed` / NEI / reject (enforced by the promotion machine-check).
- **Confidence semantics for a balanced split:** `confidence ≈ 0.5` + `disputed: true` reads as *contested
  claim*, with the `note` — never as "moderately likely true."

**Firing precedent (decision (67), 2026-06-29).** Branch #3 (balanced split) **fired for the first time** on
`nietzsche → freud` — existence / direction contested, no dominant view, each camp ≥2 live claim-stating
sources (Camp A: Chapman et al., *Br. J. Psychiatry* 1995; parallels too specific for coincidence. Camp B:
Freud's denial of reading Nietzsche, "scarce direct textual dependence", the "Disaffinities" common-source
literature) → `disputed: true`, conf 0.5, unpositioned, `proposed` (not promoted). In the same batch the
**over-fire guard held**: `schopenhauer → freud` and `saussure → levi-strauss` were existence-agreed /
degree-debated and correctly routed to **supported + note** (the existence-vs-degree line), and adversarial
QC reversed a generation note-error. This is the first propositional-layer `disputed: true` in the corpus
(cumulative 0/32 → 1/33) — the flag is **confirmed operational**, no longer an untested mechanism.

### Propositional-edge auto-`reviewed` ladders ((a)- and (d)-relations)

clause-6 v2 above is the **safety net** that makes these ladders safe: a contested claim is diverted to
`disputed` / NEI / reject and never reaches `supported`, so auto-promoting a `supported` edge cannot
launder a live controversy into `reviewed`. With that net validated (decision (67)), the propositional-edge
auto-`reviewed` ladders are standing policy.

A propositional edge **auto-promotes `proposed → reviewed`** when **all** hold:

1. **Both endpoints are `reviewed`** (status-cap clause 3, enforced in `validate-data.ts`).
2. **Verdict = supported** under the Lane B pipeline: ≥2 independent claim-stating sources live-fetched
   and verbatim-checked, adversarial perspective-diverse QC passed, direction and identity referent correct.
3. **Not `disputed` / NEI / reject** — these never auto-promote (clause-6 v2); they stop at `proposed` /
   stay in foundry, human-visible by design.
4. **★ Living-person endpoints follow the living-person handling standing policy** (below), not this
   clause's deceased default. Under that policy a living-person edge/node is held to a *stricter* floor
   (authoritative identity anchor + ≥2 independent live sources + conservative attributed wording) and
   auto-promotes to `reviewed` only when no escalation signal fires; a `disputed` / NEI / reject verdict,
   thin or non-authoritative sourcing, or any private-life / reputational content escalates to owner
   review instead. This **supersedes** the earlier blanket living-person stop (the N=1 Seligman ad-hoc
   path, vault decision (62)): the axis is contention × source-authority × claim-type, not aliveness.

A recorded record-not-resolve **tension / scope `note`** on a *supported* edge does **not** disqualify it —
only `disputed: true` (or a node-level `ambiguous`) stops the ladder (the founder-ladder precedent promoted
note-bearing edges such as Newton∥Leibniz, Boole∥Frege). Provenance (`proposed_by`, `evidence`,
`confidence`, `note`) is retained on every promoted edge for bulk re-auditability and reversibility.

- **(a)-relations** (`influenced`, `critiques`) — opened by **decision (68)**, 2026-06-29 (this
  codification), after the #29 + #34 + #36 (a)-wave measurements (precision 1.0 on every supported verdict,
  claim-level hallucination 0) **and** clause-6 v2's first correct fire (decision (67)) validating the
  disputed safety net. Promoted the standing backlog of 20 supported `influenced`/`critiques` edges;
  `nietzsche → freud` (`disputed`) correctly held at `proposed`.
- **(d)-relations** — `formalizes` (decision (54)) and `founded_or_formalized` (decisions (60)/(61)) were
  opened earlier; this rule is their 1:1 mirror.

### `work`-node and `canonical_work`-edge auto-`reviewed` ladders — keep-criteria W1–W5 (decision (88))

The phase-2 work layer (`work` nodes + `canonical_work` edges, first built in `work-wave1`, decision (87))
promotes on the same **decidable, resolver-grounded** principle as the person / founder ladders. Because a
`canonical_work` claim ("this text is *a* canonical work for this field/person") is a hard bibliographic
fact — QID, author, and publication year are checkable against structured sources, not a contestable
interpretive judgment — it belongs to the **(d)-family** and inherits the clause-6 v2 safety net above.

> **Co-canonical works permitted — session #49 ruling (decision (90)).** A field/subfield may hold **more
> than one** `canonical_work` edge (multiple founding/watershed texts), exactly as it may hold multiple
> `founded_or_formalized` founders (record-not-resolve). Forcing a single "the" canonical text per field
> would be an arbitrary tie-break and historically false. First cases: `subfield:mathematical-logic` holds
> both Boole's *Laws of Thought* (algebraic logic) and Frege's *Begriffsschrift* (quantificational logic);
> `field:sociology` holds Comte's *Cours*, Durkheim's *Rules*, and Weber's *Protestant Ethic*. The bound
> against dilution is **W1** (watershed/founding texts only — a small set mirroring the field's founders,
> not "every important book"), the same discipline as the founder layer. Schema unchanged.

**`work`-node ladder (mirror of node-promotion policy v1 / the person-node policy).** A `work` node
auto-promotes to `reviewed` when its Wikidata QID is **resolver-verified live** and both endpoints it
anchors are already `reviewed`:

1. **P31 is a written/scholarly-work type** — e.g. *written work* (Q47461344), *literary work* (Q7725634),
   *scientific work* (Q11826511), *academic work* (Q10383930), *treatise* (Q384515), *book* (Q571), or a
   *scholarly / journal article* (Q13442814 / Q18918145). The guard is that the referent is a **work**, not
   a person or concept (the Vernadsky *Biosphere* honesty-gap drop, decision (87), failed exactly here — the
   only candidate QID was a concept, not a decidable book item).
2. **P50 (author) matches the linked `person` endpoint's QID.**
3. **A decidable publication year** — P577 present, **or** an uncontested publication year confirmed live
   from a sitelinked/authoritative source (the year is a *decidability* anchor, not necessarily a Wikidata
   field).
4. **A canonical-identity anchor — at least one of:** (a) a sitelink on **any** Wikipedia; **or** (b) P50
   author-match + a decidable year (criterion 3) + work-type P31 + exact-title match **on a
   substantively-populated item** — not a bare import stub, i.e. carrying an author plus a publication
   anchor (journal/`P1433`, DOI, or a library/authority identifier) and materially more than the minimum.
5. **The author `person` and the `field`/`subfield` it anchors are both already `reviewed`.**

> **Criteria 3–4 revised — decision (89), same phase as (88).** The original (88) wording required P577
> *present* **and** an **enwiki** sitelink. work-wave2 (session #48) surfaced 3 identity-decidable canonical
> works the enwiki-only rule wrongly excluded: **Turing "On Computable Numbers" (1936, Q20895949)** — 0
> sitelinks *only because* enwiki documents the paper under the differently-titled article "Turing's proof",
> though the item carries 23 properties incl. P50=Turing, P577=1936, and P1433=Proc. LMS; **Arrow "Social
> Choice and Individual Values" (Q4227976)** — sitelinked in 6 languages incl. enwiki, missing only P577
> (year 1951 uncontested); **Wundt "Grundzüge der physiologischen Psychologie" (1874, Q2883810)** —
> sitelinked on es/it Wikipedia, missing enwiki + P577. Analysis showed the enwiki-sitelink adds no unique
> safety: the *wrong-referent* failure mode is already caught by P31=work-type + P50=author (the Vernadsky
> *Biosphere* drop failed there), the *duplicate/version* mode by P577 + exact-title (Turing's 1936 paper was
> correctly distinguished from its 1938 correction and Church's review), and the only residual — a
> non-canonical bibliographic-stub duplicate — is caught by the substantively-populated check plus the
> orchestrator's manual verification. "enwiki-only" was also anglocentric and defeated by Wikipedia's
> article-titling. The revision preserves the anchor's *purpose* (canonical identity) without the arbitrary
> enwiki requirement.

**`canonical_work`-edge ladder (1:1 mirror of the (60)/(61) `founded_or_formalized` ladder).** A
`canonical_work` edge auto-promotes `proposed → reviewed` when **both endpoints are `reviewed`** and the
Lane B pipeline returns **supported** (≥2 independent claim-stating sources live-fetched and verbatim-checked
+ adversarial perspective-diverse QC + **direction correct** + identity referent verified). `disputed` / NEI
/ reject stop at `proposed` / stay in foundry (clause-6 v2). **Direction is fixed by the taxonomy** —
"Work A is canonical for a field, person, or concept B" ⇒ the `work` is **always the `source`**; a
`person → canonical_work → work` edge is definitionally wrong and `work → part_of → field` is a category
error (a work is not a subfield). Per work, the canonical triangle is **two edges** —
`work → canonical_work → field` **and** `work → canonical_work → person` (both are taxonomy-permitted targets;
not double-counting). **★ Living-author guard:** a work is a neutral artifact (usually low-risk), but when
its author `is_living_person: true`, run the living-person handling standing policy (below) signal check on
the author endpoint; the edge/node still auto-promotes only on a clause-6 v2 *supported* verdict with no
escalation signal.

**keep-criteria W1–W5 (what admits a `work` candidate at all — edge-demand-based, not "every famous book").**
These earn a work its place in the corpus; a candidate failing any of them stays out or in foundry:

- **W1 — edge-demand founded.** Only foundational / watershed texts that connect to an **existing
  `reviewed`** person *and* field. Not "all famous works": the corpus admits a work because it completes a
  person↔work↔field triangle already anchored on both ends (the [literature-boundary rule](../CLAUDE.md),
  decision (86), is the companion filter — a work enters at the idea boundary because it earns a knowledge
  connection, not as literature-as-art).
- **W2 — QID + publication year, decidable.** The work has a Wikidata QID and a P577 date, both
  live-verifiable (no interpretive judgment needed to admit it).
- **W3 — author and field both `reviewed`.** Both endpoints exist and are already promoted.
- **W4 — work-node QID-resolver-verified → auto-`reviewed`** per the work-node ladder above (mirror of node
  policy v1).
- **W5 — `canonical_work` direction = work → {field, person}**, with live multi-signal QC (the edge ladder
  above).

**Earned by measurement, not asserted.** Opened after the `work-wave1` pilot (decision (87)) returned
**precision 1.0 (18/18 supported)**, **generator-QID-hallucination catch 100% (9/9 caught and corrected)**,
**rejection-probe 2/2** (Origin→Wallace mis-attribution, Principia→evolutionary-biology anachronism, both
rejected), **direction 18/18**, and **hallucination 0** — the same bar that earned the founder ladder
(decision (59), precision 1.0 at N=20). This is the 1:1 mirror of the (54) `formalizes`, (60)/(61)
`founded_or_formalized`, and (68) (a)-relation ladders. The generator hallucinates work QIDs at the same
rate as person QIDs (9/9 in the pilot), so the **separated-generation + independent live-verification
contract is the load-bearing safety mechanism regardless of ladder state** — the ladder cannot launder a
generator hallucination into `/data` because promotion re-verifies every QID live.

### `concept`-node keep-criteria — pre-ratified (decision (91), session #49)

`concept` nodes (field-internal core ideas — e.g. `vector-space`, `logical-positivism`,
`generative-grammar`) admit under the **same edge-demand discipline** as works (W1) and founders, and
**promote via node-policy v1** (Wikidata-QID resolver-verified → auto-`reviewed`) — **no new ladder**; the
build is **CTO-autonomous** (decision (91) §7.1). Criteria: **(C1)** edge-demand founded — the concept
earns its place by connecting to an existing `reviewed` field/subfield/person via `formalizes` /
`part_of` / `prerequisite_for` / `(a)`, not "every idea"; **(C2)** QID resolver-verified (referent-precise
— a concept, not a subfield or a person; the Cerf/#33 and generative-grammar precedent guards over-broad
targets); **(C3)** referent precision — pick the concept referent, not an over-broad discipline label;
**(C4)** `indexable` only when `reviewed` per node policy. Multiplicity (many concepts per field) is
expected and fine — the same posture as co-canonical works and multiple founders.

### Node identity anchor — alternative anchor for QID-less-but-recognized fields (node-policy v1.4, decision (93))

Node-policy v1's identity requirement is a **resolver-verified Wikidata QID**. The session #50 backlog
re-adjudication (decision (92)) surfaced two subfields — `philosophy-of-race` and
`philosophy-of-cognitive-science` — with **no Wikidata discipline entity at all** (live-reconfirmed
2026-07-02: only journal/article items) yet strong multi-authority recognition. Per the decision (89)
discipline, the QID requirement's *actual* safety value was decomposed and live-researched (2026-07-02);
every function is preserved by an alternative anchor set:

| QID safety function | Alternative-anchor coverage |
|---|---|
| Referent decidability (*which* thing) | Category ID in an expert-curated disciplinary taxonomy (stable slug) |
| Journal-vs-discipline / era-vs-discipline trap (P31/P279) | The taxonomy classifies *research areas* by construction; encyclopedia entry + handbook confirm a field-of-study referent |
| Multi-signal bar (orphan-stub guard) | ≥3 independent authorities is a stronger bar than one QID + sitelinks |
| Machine re-auditability (resolver) | Stable URLs + §8 permanence anchors (Wayback; existing-snapshot path for bot-blocked domains) |

A `field`/`subfield` node with **no Wikidata discipline entity** satisfies the identity-anchor
requirement when **all** of the following hold:

1. **A category/entry ID in a CPO-ratified expert disciplinary taxonomy**, recorded in `external_ids`
   (e.g. `philpapers: philosophy-of-race`). **Ratified taxonomy authorities: PhilPapers (philosophy) —
   currently the whole list.** Adding a taxonomy authority is a CPO gate (mirror of the source-registry
   discipline). This keeps the clause conservative: it admits exactly the recognized cases, not the
   honest-gap pool — the eight skeleton-era QID-less gaps (computer-systems, sensation-and-perception,
   modern-history, …) have no ratified taxonomy standing and remain parked.
2. **≥2 additional independent authoritative sources** treating it as a named field — an SEP/IEP entry,
   a dedicated peer-reviewed journal, a major university-press handbook/companion — live-verified with
   §8 permanence anchors at promotion time.
3. **No conflicting referent** — the journal-vs-discipline and era-vs-discipline rejections still apply
   in full.
4. **Wikidata re-checked at promotion time** — if a discipline QID has appeared upstream, the standard
   node-policy v1 path applies instead (and the QID is recorded alongside the taxonomy ID).

Promotion under this clause runs as a normal re-adjudication batch with full provenance (bulk
re-auditable, reversible). First cases (2026-07-02, all anchors live-verified):
`subfield:philosophy-of-race` (PhilPapers category; SEP "Race"; *Critical Philosophy of Race*, ISSN
2165-8684, Penn State UP; *The Oxford Handbook of Philosophy and Race*, OUP 2017, DOI
10.1093/oxfordhb/9780190236953.001.0001) and `subfield:philosophy-of-cognitive-science` (PhilPapers
category; SEP "Cognitive Science"; *The Oxford Handbook of Philosophy of Cognitive Science*, OUP 2012,
DOI 10.1093/oxfordhb/9780195309799.001.0001 — no exact-title dedicated journal; honestly recorded as a
three-authority anchor). This clause is the node-layer 1:1 mirror of the work-node criteria 3–4 revision
(decision (89)): the anchor's *purpose* (identity decidability) is preserved; the arbitrary
single-provider requirement is removed. QID-less `reviewed` precedent: the practical-knowledge /
meta-knowledge domains (decision (36)).

### Living-person handling — standing policy (vault decision (70), 2026-06-30)

The risk axis for a living person is **claim type × source authority × contention — not aliveness.** This
mirrors how large knowledge bases carry data on millions of living people *without* per-item human
sign-off: Wikipedia BLP removes only *contentious* and *poorly-sourced* material (keyed to contention +
source quality, not to the person being alive); Wikidata admits anything describable by serious public
references and presumes privacy by *publicness*, not aliveness; OpenAlex/ORCID/Scholia carry living
researchers at scale on authoritative structured sourcing + disclosed provenance, with human curation as
post-hoc correction only. Noosphere's scope is strictly *narrower* than any of these (only positive,
public, canonical scholarly-attribution claims — never private/negative/reputational), so the prior art
supports this a-fortiori. (Full design + citations: vault `reference/living-person-handling-v2-design.md`.
This **supersedes** the never-ratified blanket "every living person → owner sign-off" draft.)

Living-person handling is **stricter than the deceased-auto path but is not a blanket owner gate.**

1. **Admission floor (stricter than deceased).** A node/edge touching a living person enters only when it
   is **(a)** a positive public professional/scholarly attribution (`founded_or_formalized`, `influenced`,
   `critiques`, …) — the relation taxonomy itself is the guard, since no private/negative relation exists
   in the corpus; **(b)** anchored by an **authoritative structured identity** — a resolver-verified
   Wikidata QID is required (P31=Q5 + P569 birth + **P570 live-confirmed absent** + label/sitelink
   cross-check), with ORCID / official institutional page accepted as additional or alternative anchors
   (ORCID is *not* mandatory — many older living scholars lack one); **(c)** grounded by the same **≥2
   independent claim-stating live sources** as the deceased floor; **(d)** written in **conservative,
   attributed wording** ("X is widely credited with founding Y", never bare superlatives; `note` carries
   facts + sources only). A summary is *allowed* — written carefully (contribution-focused, non-biographical,
   neutral), not suppressed.
2. **Resting state = `reviewed`, auto, when clean.** A living-person edge/node meeting the floor with a
   clause-6 v2 verdict of *supported* auto-promotes to `reviewed` — generalizing the Seligman precedent
   (decision (62)), not a per-item owner sign-off. The conservative posture lives in *wording* and
   *indexability*, not in withholding `reviewed`.
3. **Indexability = the same earned rule as everyone.** `indexable` is an SEO-only flag (emit
   `noindex`; see [`seo-policy.md`](seo-policy.md)) and is **orthogonal to in-graph explorability** — a
   living-person node is fully navigable regardless. Living people are **not** force-`noindex`d; they earn
   indexability the same way any node does (`reviewed` + original value). Aliveness does not make a node a
   second-class exploration target.
4. **Self-disclosure = provenance tag, not a weighting judgment.** A claim sourced from the subject's own
   ORCID/bio is *recorded with disclosed provenance* (the ORCID trust-marker model), never adjudicated as
   stronger/weaker — that is left downstream. Self-disclosure alone cannot satisfy the ≥2-independent floor
   (it is one non-independent source), so the existing floor handles it with no new judgment.
5. **Escalation to owner review fires only on a narrow signal set:** a clause-6 v2 verdict of
   `disputed` / NEI / reject (a contested founding/priority is already diverted, human-visible); thin or
   non-authoritative sourcing (no resolver-verified identity anchor, or < 2 independent live sources); any
   claim touching private life, reputation, or negative/contentious content (a taxonomy-and-content
   tripwire); or a subject/institution dispute lodged through a correction route (a downstream operational
   path, deferred — not a data-policy blocker).
6. **The owner governs policy, thresholds, and an escalation queue/dashboard — not per-item sign-off**
   (restoring decision (7) / contract 3). Living-person promotions stay bulk re-auditable via retained
   provenance. **Escalation landing spot (2026-07-02):** when a signal from item 5 fires, it is recorded
   in vault `reference/living-person-escalation-log.md` (one entry per escalation: node/edge, signal,
   disposition) — designated in advance so the first real escalation has a durable home, not an ad-hoc one.

**Robust to the fluid living/deceased boundary (observe-only, self-correcting).** Living status is *observed*
at QC time (Wikidata P570 present/absent live-confirmed), never *predicted* from age. Drift only runs
living → deceased (stricter → looser), so a person who has died since is merely handled *more* carefully
until the next periodic re-grounding re-checks P570 and moves them to the deceased path. No lifespan
estimation, no status-tracking burden. **Re-grounding cadence (ratified 2026-07-02):** a P570 sweep of all
`is_living_person: true` nodes runs at the start of any session that touches the person layer, or when
more than 30 days have passed since the last sweep, whichever comes first — a handful of keyless
`wbgetentities` calls at today's N. Outcomes (including living→deceased flips) are logged in the vault
decision log; the machine-derived count in `npm run report:graph` is the canonical living-person figure
(hand-incremented counters drift — measured in the 2026-07-02 audit).

**Schema unchanged** — `is_living_person` already exists (`src/schema/node.ts`); `validate-data.ts` already
enforces that living-person nodes carry ≥1 external identifier and status ∉ {draft, generated} and that
living-touching edges are ≥ `proposed`. This is a **policy** codification only. **Legal note:** the
operational rules above are grounded in the cited prior art; this document deliberately makes **no
unverified legal-doctrine assertion** (the specific defamation/privacy/GDPR doctrines were not
source-verified in the session-#38 research). The GDPR position for EU-resident living scholars should be
confirmed against primary sources if it ever becomes a concrete concern.

## 9. Current implementation sequence

**Depth before breadth.** Take one domain (machine-learning foundations) fully
to `reviewed`/`indexable` end-to-end before expanding. The aspirational target
scale is reached by repeating a proven loop, not by parallel breadth.

The phase proceeds in deliberate, explicit PRs:

1. **SSOT rebaseline** — establish charter, this brief, and the rebaselined hierarchy *(this PR)*.
2. **Foundry scaffold** — directory/manifest conventions and a deterministic, offline pipeline shell.
3. **First open-source resolver** — likely **Wikidata** (CC0, well-documented, stable IDs).
4. **Proposal report improvements** — richer, deterministic curation reports.
5. **Batch data expansion** — run real batches through the gate to grow coverage.
6. **Search index** — build a static search index over reviewed data.
7. **Static UI** — the read-only atlas surface over reviewed/indexable data.

This brief covers step 1 only. Steps 2+ are implemented later, each in its own reviewable PR.

## 10. Initial scaffold — current commands

Step 2 (the **Foundry scaffold**) is now in place as an **offline, deterministic** shell. It
establishes directory/manifest conventions and a proposal-skeleton workflow that future resolver PRs
can build on. It calls **no** public knowledge APIs and **no** cloud LLM APIs yet, and requires no
secrets, tokens, or network access.

Conventions:

- **`/foundry`** holds committed Foundry inputs: batch manifests under `foundry/batches/*.json` and
  templates. These are **construction inputs / candidates**, not canonical graph data.
- **`foundry/proposals/`** holds **committed proposal batches and their permanent records** (QC,
  grounding, resolution, audit and promotion reports) — the durable paper trail behind every
  promotion, indexed in `foundry/proposals/README.md`. Everything there stays untrusted
  `generated`-tier material; only the curation gate moves content into `/data`.
- **`/data`** remains the **canonical source of truth** for currently accepted graph data. The
  scaffold never reads from or writes to `/data`.
- **`dist/foundry/...`** holds **generated** proposal skeletons and resolver source packs. It is
  gitignored and must **not** be committed — regenerate it locally as needed. (Generated artifacts
  are *born* under `dist/foundry/`; what gets **committed** for the permanent record lives under
  `foundry/proposals/`.)

Commands:

```bash
# Validate every batch manifest under foundry/batches against the Foundry schema.
npm run foundry:validate-batches

# Build an offline proposal skeleton for a batch into dist/foundry/proposals/...
npm run foundry:proposal-skeleton -- foundry/batches/machine-learning-foundations-v1.json
```

`foundry:validate-batches` parses each `foundry/batches/*.json` with the Zod schema in
`src/schema/foundry-batch.ts`, checks for duplicate batch IDs, and prints a concise, deterministic
report. It exits non-zero on any validation error.

`foundry:proposal-skeleton` validates the given manifest and writes a candidate proposal skeleton
(a normalized manifest copy, empty `nodes`/`translations`/`edges`/`external-links`/`sources`/
`learning-paths` arrays, a small `report.json`, and a `README.md`) under the manifest's
`output.proposal_dir` inside `dist/foundry/...`. It never marks anything `reviewed` or `indexable`
and never touches `/data`.

## 11. Wikidata source-pack resolver (first network resolver)

The first **network-dependent** resolver is now in place. It is a narrow
**source-resolution** job — step 2 of the batch lifecycle (§5) — and nothing else:
it produces *candidate* source-resolution material, not canonical graph data and
not a proposal.

```bash
npm run foundry:resolve-wikidata -- foundry/batches/machine-learning-foundations-v1.json
```

What it does:

- Reads and validates the given batch manifest with `foundryBatchSchema`, and
  **refuses to run** unless the manifest lists `wikidata` in
  `allowed_public_sources`.
- Resolves each `seed_entities[].label` against Wikidata using **open / free /
  public, keyless** endpoints only:
  - the MediaWiki Action API `wbsearchentities` for English label search, and
  - `Special:EntityData/<QID>.json` for compact entity metadata.
- **Deterministically re-ranks** each seed's candidates by *type fit* before
  keeping the top few (see "Disambiguation" below). It intentionally does **not**
  treat rank 1 as a final decision — choosing the canonical QID is a later,
  human-reviewed step — but it records a best guess (`selected_qid`) and flags
  low-confidence seeds (`ambiguous: true`).
- Writes a compact source pack to
  `dist/foundry/source-packs/<batch-slug>/wikidata.json`, validated against
  `foundrySourcePackSchema` in `src/schema/foundry-source-pack.ts`.

### Disambiguation (source-pack format v2)

Wikidata label search (`wbsearchentities`) ranks by string match, so its first
hit is often the wrong *kind* of entity — e.g. for "Calculus" it returns an
arachnid genus before the branch of mathematics, and for "Mathematics" the
"Mathematics Genealogy Project" database before the discipline. To correct this
**without** a cloud LLM or SPARQL, the resolver scores candidates deterministically:

- It reads each candidate's Wikidata `instance of` (P31) classes — already present
  in the entity data it fetches, so **no extra requests** are needed for them.
- A small, **curated and label-verified** set of P31 classes marks an entity as
  the kind Noosphere models (academic discipline, branch of mathematics, method,
  algorithm, concept, …), aligned to the seed's `expected_type`.
- Each P31 class belongs to a **kind family** mirroring the node types: *abstract*
  (discipline/method/concept — treated as one family of neighbouring kinds),
  *person*, *work*, and *institution*. A candidate is judged **relative to the
  seed's expected type**: the same family is right, a *different* recognized family
  is the wrong kind and is penalized, and classes Noosphere never models (taxon,
  database, website, disambiguation page, …) are always wrong. So a human (Q5) is
  the right kind for a `person` seed but the wrong kind for a `field` seed, and a
  book is the wrong kind for a `person` seed.
- Scoring favours an aligned type and an exact label match, penalises an excluded
  type, and uses an English-Wikipedia sitelink and the provider's original order
  only as tie-breakers. **P31 is a signal, never a gate:** valid concepts that
  carry no P31 (e.g. "random variable") still resolve, on the label/sitelink
  signals alone. Deprecated-rank P31 statements are ignored.
- The candidate pool is widened (`request_policy.search_limit`) beyond the
  retained `candidate_limit` so a correct entity the provider ranked low can still
  be recovered, then re-ranked and trimmed.

Each candidate records its `instance_of` QIDs and a `disambiguation` breakdown
(`score`, `aligned_with_expected_type`, `positive_type_signal`, `excluded`,
`exact_label_match`, and human-readable `signals`). A seed is flagged `ambiguous`
for manual selection when the top two candidates score within a small gap, **or**
when the winner itself has a weak signal — judged by `positive_type_signal` and
`excluded`, **not** the total score, so a sole exact-label hit with no real type
signal is still flagged rather than emitted as a confident `selected_qid`.
This is best-guess *candidate* material only — it still does not mark anything
`reviewed` or `indexable`, and `/data` stays untouched.

#### Known limitation: exclusion is an allow-list, by design

The kind families are **curated allow-lists**, so exclusion only fires for P31
classes Noosphere explicitly knows. A P31 class that is *not* in any family set
(e.g. `painting`, `sculpture`, `building` for a `person` seed) is treated as
**neutral, not wrong-kind** — it is neither boosted nor penalized. This is a
deliberate recall-over-precision tradeoff: tightening it to "any non-aligned P31
is wrong" would wrongly penalize correct entities whose real P31 is simply not in
the curated sets (e.g. "probability distribution", which has a P31 outside the
abstract set and would otherwise be excluded).

This does **not** cause a silent wrong `selected_qid`, because of two backstops:

- The correct entity, when present, carries an *aligned* P31 (+100) that
  outscores any neutral wrong-kind candidate (≤ 40 from label/sitelink alone).
- A winner with no `positive_type_signal` is flagged `ambiguous` regardless of
  score, so an uncurated wrong-kind that wins only because the correct entity was
  not fetched is surfaced for manual review, never accepted as confident.

The cost is therefore reduced *recall of exclusion* (some wrong kinds score
neutral instead of negative), not reduced *correctness*. Families can be extended
incrementally as new batches surface new kinds; each added QID must be
label-verified first (see `QID_LABELS` in the resolver).

Boundaries it preserves:

- It is **network-dependent and intentionally not run in CI.** CI stays offline:
  it continues to run `typecheck`, `validate:data`, `export:graph`, `report:graph`,
  and `foundry:validate-batches`, none of which require network access. Build,
  validation, export, and reporting must never depend on this resolver.
- **Run and verify it locally.** Because it needs real outbound network access,
  **restricted or sandboxed environments may silently block it** — for example a
  hosted agent/CI sandbox whose egress allowlist excludes `www.wikidata.org` will
  return HTTP 403 from the proxy, so the resolver cannot be exercised there. Treat
  a green offline core in such an environment as **not** evidence that resolution
  works; run `foundry:resolve-wikidata` on a machine with open outbound access and
  confirm the source pack before relying on it.
- It uses **open / free / public Wikidata access only** — no secrets, API keys,
  tokens, OAuth, or env-required auth. (A non-secret `NOOSPHERE_WIKIDATA_USER_AGENT`
  env var may override the User-Agent, but the resolver works without it.) It does
  **not** use SPARQL.
- Requests are **read-only and serial**, with a polite delay and a descriptive
  User-Agent. It does **not** crawl links, fetch article/Wikipedia bodies, or use
  NamuWiki, and it stores only compact selected metadata — never full raw entity
  JSON or any article text.
- It **never reads or writes `/data`.** `/data` remains the canonical accepted
  graph data; nothing here is marked `reviewed` or `indexable`.
- Generated source packs live under `dist/foundry/...`, which is **gitignored** and
  must **not** be committed — regenerate locally as needed.

Future PRs may consume these source packs to generate `proposed` graph patches
(recording QIDs in `external_ids`, citable entries in the source registry, etc.),
but this PR stops at source-resolution candidate output.

Future resolver PRs may add further **open / free / public** knowledge API calls
(e.g. OpenAlex, ORCID) for source-resolution and proposal-fetch jobs, following
the same boundaries.

## 12. Skeleton modeling standard (granularity & structure)

> Promotion policy v1.3 (CPO-ratified 2026-06-10, vault decision log (14)). This section is a
> **mandatory input to every skeleton generation order**. It converts recurring design questions —
> previously raised per-node via `ambiguous` flags — into standing rules. It accretes precedents:
> each new QC ruling on a case this standard does not cover is appended here as one line, so the
> next continent's generator inherits it.

### Keep criteria (the dual criterion)

A skeleton node (field/subfield) is kept only if **both** hold:

- **(a) Classification presence:** it is a major division in the classification sources for its
  continent (UDC / LCC; discipline-specific schemes such as MSC serve as a cross-check, not a gate).
- **(b) Community presence:** it exists as a named department/research-area-level unit — journals,
  societies, department groups, degree tracks.

MSC-top-level-only areas with no department-level standing fail (b); department-named areas with no
classification division of their own fail (a). Both failures are recorded as deliberate
non-coverage, never silently dropped.

### Structural rules

1. **Flat two-level skeleton.** Fields (level 1) and subfields (level 2) only. A parent and its
   sub-area may coexist as peer subfields when both pass the dual criterion (precedent:
   metaphysics/ontology in philosophy; mathematical-logic and its four pillars in formal sciences).
2. **Absorption rule.** A candidate that names a refinement of a kept node serving the same
   community is dropped and recorded as a v2 re-split candidate (precedent: german-idealism
   deferral in philosophy; group-theory/graph-theory absorption in formal sciences).
3. **Cross-continent assignment rule.** A node is deferred to another continent only when **both**
   its primary LCC home **and** its dominant institutional home lie outside the current continent
   (precedent: cryptography→CS, econometrics→social sciences, biostatistics→medicine). Boundary
   areas filed under the current continent by its classification sources stay, with the boundary
   recorded in `uncertainty` and the flag kept true (real-world contest → stops at `proposed`).
4. **Label rule.** When a pedagogical course label and a research-area label name the same referent,
   keep the research-area node (precedent: abstract-algebra merged into algebra).
5. **Movement / school-of-thought rule** (decision (73), 2026-06-30). Schools of thought, intellectual
   movements, doctrines, and named groups are not all the same kind of node, and *"is it a movement?"
   is not the admission test* — Wikidata types existentialism and pragmatism (both kept subfields) as
   "philosophical movement," the same class as logical positivism. Decide by what the entity **is**:
   - **Standing, taught, multi-generational area of study** (classification "branch of X" standing +
     ongoing scholarship, not a closed historical position) → **`subfield`**, via the dual criterion
     (precedent: phenomenology / existentialism / pragmatism / critical-theory grandfathered;
     structural-anthropology promoted — Wikidata "branch of anthropology" Q106720965).
   - **Bounded doctrine / position / -ism / theory** → **`concept`** node (precedent: logical
     positivism; structuralism; german-idealism).
   - **Group / circle / society of named people** → **`institution`** node (precedent: the Vienna
     Circle — the corpus's first `institution` node, mirroring the `concept:internet` ruling).

   concept/institution movement nodes are **edge-demand-driven** (admitted when a documented relation
   needs the endpoint — a founder figure, a contested influence — never bulk-generated) and link into
   the skeleton by edges (`part_of`, `founded_or_formalized`, `influenced`/`critiques`), never
   inflating the subfield skeleton or double-counting a research area. **No schema change**
   (`concept`/`institution` already in `nodeTypeSchema`); a dedicated `movement` type is rejected as
   unnecessary and imprecise (movements are at least two kinds — doctrines and groups). This rule
   **supersedes** the bare "movement-level granularity deferred" precedent (2026-06-10 philosophy)
   for new cases, and unparks german-idealism/structuralism under the same edge-demand discipline.

### Flag semantics under this standard

- Generators apply this standard directly; a design question this standard answers needs **no**
  `ambiguous: true` flag. Flags remain mandatory for: novel design cases this standard does not
  cover, unverifiable factual inputs, and real-world contests (identity, boundary, vitality).
- **A-type flags** (modeling/granularity questions addressed to QC): QC may retire the flag by a
  documented ruling — per-node retirement note + qc-report entry — and the ruling is appended to
  this standard as precedent. **Every retirement is reported per batch on the dashboard**; the
  retirement count trending down across continents is the measure of this standard's quality.
- **B-type flags** (real-world contests): never retired by ruling alone — resolution requires the
  v1.1 external-evidence path (≥2 independent sources, URL-cited, permanent resolution record).

### Precedent log (append one line per new QC ruling)

- 2026-06-10 philosophy: tradition/methodology axes kept as subfields; movement-level granularity
  deferred (german-idealism dropped); logic and decision-theory stay humanities (cross-listing
  parked); ontology is a peer of metaphysics.
- 2026-06-10 formal sciences: mathematical-logic demoted field→subfield (MSC top-level sections are
  divisions within mathematics, not peers of it); ASL pillars (set/model/proof/computability theory)
  kept as peer subfields; differential-equations and PDE both kept (separate MSC top levels +
  department naming); statistics method-level nodes (MSC 62 G/H/J/K/N) collapsed into
  applied-statistics; real-analysis dropped while complex-analysis kept (living research identity);
  representation-theory not added (fails criterion (a)) — first-in-line v2 candidate with
  graph-theory.
- 2026-06-10 part_of edges (first structural edge batch): the §12 flat rule governs node levels,
  not edge depth — part_of chains may run deeper than two hops. The ASL pillar subfields take
  `subfield:mathematical-logic` as their part_of parent (MSC 03C/D/E/F are subsections of 03;
  library shelving that scatters their books is not a hierarchy claim); statistics-cluster
  subfields (bayesian/mathematical/computational statistics, time-series) take `field:statistics`
  (MSC 62 subsections + standalone communities); cybernetics takes `field:systems-science`
  (UDC 007 + LCC Q300-390); history-of-mathematics stays under mathematics (MSC 01 + LCC QA21-27
  unanimous — a boundary concern does not survive source agreement).
- 2026-06-11 computer & information sciences (source interpretations): a discipline-specific
  scheme may be a gate-level classification source when the continent's manifest ratifies it in
  the coverage baseline (ACM CCS 2012 here — LCC compresses the whole continent into ~1.5 class
  numbers; MSC 68 and FORD 1.2 stay cross-checks); LCC cutter-level subdivisions inside such a
  compressed range (QA75.5-76.95) count as major divisions for criterion (a).
- 2026-06-11 computer & information sciences (rulings): machine-learning demoted field→subfield
  with canonical ID migration (mathematical-logic precedent — UDC files ML under 004.8, CCS as a
  sibling of AI, LCC at Q325.5 under Cybernetics; no field-level institutional standing); AI
  enters as a peer subfield; theory-of-computation umbrella coexists with algorithms/complexity/
  formal-languages peers (peer-coexistence rule); cryptography/computer-security split upheld
  (CCS separates the branches; IACR vs S&P communities); computer-systems kept as the systems
  umbrella (OS/architecture/performance absorbed, v2 re-split candidates); the LIS wing stays
  in-continent with field-level standing (LCC Z665-718.8 + UDC 02 own divisions; iSchools are
  faculties of their own — two-prong test, no policy escalation); social-computing stays (CCS
  branch + CSCW community; computational social science is social-sciences non-coverage);
  bioinformatics deferred to life sciences (LCC QH324.2 + institutional home — biostatistics
  precedent); archival-science fails criterion (a) in-continent (novel ruling: a department-named
  area whose classification homes — LCC CD, UDC 930.25 — lie in another continent's classes waits
  for that continent's skeleton; §13 can cross-list it later); data-science recorded as deliberate
  non-coverage (named departments, no classification division — representation-theory pattern).
- 2026-06-11 CIS part_of edges (depth rule): un-contradicted gate-scheme nesting may deepen a
  part_of chain (theory cluster under theoretical-computer-science: CCS nests, UDC is silent, MSC
  68Q corroborates — ASL-pillar mirror); nesting contradicted by another gate scheme flattens to
  the field (computer-vision/NLP: CCS nests them under AI, UDC files 004.93 as a sibling of 004.8).
  First §13 co-equal dual membership written at skeleton time: information-retrieval → computer
  science (CCS/MSC) and → library-and-information-science (LCC Z699-699.5), no primary marker.
- 2026-06-11 natural sciences (rulings): medical-physics deferred to medicine-and-health (LCC
  R895-920 medicine home + medical institutional home — both rule-3 prongs out-of-continent;
  bioinformatics/biostatistics precedent; a ratified discipline scheme's *absence* of the area —
  PhySH — counts against in-continent classification presence); optics kept as a peer of AMO
  physics (two gate schemes' separate majors — LCC QC350-467, UDC 535 — override a discipline
  scheme's bundling: scheme compression is not a community merger); quantum-information-science
  accepted as a distinct node from quantum-computing (absorption rule does not fire across
  distinct referents — QIS umbrella vs computing implementation; nesting is edge-batch business);
  polymer-chemistry and computational-chemistry absorbed (graph-theory pattern: single-scheme
  subdivision or cutter + strong society still fails criterion (a); v2 re-split candidates);
  electrochemistry kept (dual-scheme subdivisions UDC 544.6 + LCC QD551-578 + independent ECS
  community — ASL-pillar pattern); a discipline-scheme substitution argument is valid only inside
  the wing whose manifest ratified the scheme (PhySH covers physics subfields, not chemistry);
  climatology absorbed into atmospheric-science and thermodynamics into statistical-physics
  (scheme-bundled label rule); celestial mechanics, radiation physics, electromagnetism,
  radiation chemistry, photochemistry, stratigraphy, GR-as-standalone, network science, energy
  science, physics education research recorded as deliberate non-coverage (v2/cross-continent
  candidates per qc-report).
- 2026-06-11 CIS QID anchors (session #11 ruling): a *component* entity may anchor a combined-name
  node only when the component term umbrellas the combined community (automata-theory precedent:
  formal-languages-and-automata-theory → Q214526); component anchors that cover only one wing are
  rejected and the node stays an honest gap (distributed-and-parallel-computing ← Q180634,
  databases-and-information-systems ← Q64812807 — both rejected, golden-set must_not_select
  guards added). Node *shape* (combined vs split) is not reopened by anchor availability alone.

- 2026-06-11 natural sciences (clause-6 boundary resolutions, ns-bflag-resolution-v1): LCC's
  class-G shelving of physical-geography cognates (GE environmental sciences, GC oceanography, GB
  hydrology/geomorphology) does not defeat natural-sciences/earth-sciences membership when UDC +
  FORD(+ANZSRC) + community evidence file them there — the class-G position is an other-home
  filing (no premise denial), recorded as parked geography-side §13 evidence rather than
  `disputed`, and interpreted once, identically, for the whole cluster; environmental-science's
  field-level standing is confirmed by FORD 1.5 co-equality and UDC 502/504 depth; biophysics and
  biochemistry resolve as §13 dual memberships (gate schemes split LCC-vs-UDC head-on; Wikidata
  dual P31 corroborates) with domain:life-sciences direct targets and re-target notes pending the
  life-sciences skeleton; geodesy resolves as §13 dual astronomy + earth-sciences, with ANZSRC's
  geodesy-under-geophysics nesting flattened to the field (contradiction-nesting rule: gate
  schemes file under astronomy; IUGG treats geodesy and geophysics as peers); TU Delft's
  civil-engineering housing is a parked engineering-continent §13 trigger.
- 2026-06-11 social sciences (round 13a node rulings): a continent's LCC footprint is
  multi-class — a discipline's own top-level LCC class (law's K, political science's J,
  education's L) is not an out-of-continent filing; rule 3's LCC prong asks whether the home
  lies in *another continent's* class (law); when both gate schemes file a node in-continent but
  under different wings, the split contests the **edge**, not the node — the flag moves to the
  part_of batch (criminology: LCC HV sociology-side vs UDC 343.9 law-side); FORD co-naming an
  area inside another field's division plus LCC divisions-inside-subclasses plus no UDC
  in-continent division = the mathematical-logic demotion profile at field rank, even against
  faculty-level institutional autonomy (business); a live enwiki redirect from a candidate's
  label to a canonical node's article, combined with the candidate's own QID hint resolving to
  that canonical entity, is decisive duplicate-referent evidence — the candidate drops and its
  classification evidence parks as §13 membership evidence for the canonical node
  (political-theory → political-philosophy); a shallow UDC division directly under the domain
  digit plus LCC filing inside another field's subclass plus research-center-rank community =
  subfield, not field (demography).
- 2026-06-11 SS part_of edges (13a edge rulings): when contradictory depth claims concern
  *field membership itself* (LCC nests inside a field's subclass while UDC files a peer division
  directly under the domain digit), the flatten target is the **domain** — the
  contradiction-nesting rule applied one rank up (demography, public-administration; each
  scheme's field-side filing parks as §13 evidence); a §13 co-equal dual whose second endpoint
  is `proposed` is written as a **status-capped edge**, not parked (economic-geography; NS
  7-capped precedent — capped edges are the designed mechanism for exactly this);
  un-contradicted gate-scheme nestings deepen per the CIS depth rule (economics 33x, education
  37x, law 34x clusters), and peer-division agreement between both schemes files a node
  domain-direct (gender-studies, social-work-and-welfare).
- 2026-06-11 life sciences (13b rulings): a continent whose classification family splits into
  several LCC subclasses (QH–QR) but is one FORD field (1.6) is modeled as a **single field with
  peer subfields** (biology — LCC subclass separation is shelving granularity, not field-level
  co-equality); a node whose classification home sits inside a sibling subfield's range stays a
  **peer** when it holds a dedicated range *and* a distinct community identity (mycology — QK600
  inside botany; optics/AMO pattern), while a candidate whose *only* anchor is a cutter inside a
  kept node's range serving the same community **absorbs** (genomics — QH447 inside genetics;
  id.loc.gov cutter-location check); a gate-scheme medicine split (LCC QP/QM in-continent vs UDC
  611/612 under 61 Medicine) keeps the node in-continent at `proposed` with the medicine-side
  §13 parked (physiology, anatomy — biophysics/biochemistry pattern); a technique-defined field
  with no classification division absorbs (structural-biology); emerging fields with departments
  but no classification division are deliberate non-coverage (systems-/synthetic-biology —
  data-science pattern); a candidate whose classification anchor IS an existing canonical node's
  anchor records as a §13 cross-list candidate, never a second node (conservation-biology ←
  UDC 502/504 = environmental-science's anchor).
- 2026-06-11 engineering & technology (13c node rulings): a named in-gate class division that
  refines no kept node passes criterion (a) even without a standalone subclass (industrial
  engineering — the polymer absorption precedent is confined to candidates refining a
  same-community kept parent); a gate-scheme **division-caption co-naming** plus a named major
  range in the other gate scheme satisfies criterion (a) — a UDC Summary granularity gap does
  not erase caption-level presence (nuclear); an LCC subclass outside the continent's gate
  classes that umbrellas a combined referent supports the **combined node shape**, and rule 3
  does not fire while the institutional home is in-continent
  (naval-architecture-and-marine-engineering ← VM); a generator B-flag with no
  out-of-continent filing behind it is a *design* question — QC may reclassify B→A and rule it
  (photonics; QIS distinct-referent precedent applied); when a generator anchors one captured
  range on two nodes, QC assigns it to exactly one node and records the reassignment on both
  (double-anchor hygiene — TC1501-1800).
- 2026-06-11 ENG part_of edges (13c edge rulings): a cross-check scheme's sibling division does
  not defeat a gate-scheme nesting (nanotechnology — FORD 2.10 ∥ 2.5 vs UDC 620.3 inside 620);
  a caption co-naming used for criterion (a) places the area in that caption's wing for nesting
  analysis too — wing-consistency (nuclear: UDC 621 mechanical wing contradicts LCC TK nesting →
  flatten); a single shelving entry inside a subclass's general portion does not nest the area
  under that subclass's discipline (systems-engineering ← TA168 — ASL shelving principle applied
  in the flatten direction).
- 2026-06-11 arts & design (13d node rulings): the other-home-filing interpretation generalizes
  beyond class G — LCC class-P (PN theatre/film), class-S (SB landscape architecture), and GV
  (dance) shelvings do not defeat arts membership when UDC 7 + FORD 6.4 + community file the
  discipline in-continent (interpreted once, identically, for the cluster; out-of-continent
  evidence parks record-only); a single-scheme named range plus a strong community fails
  criterion (a) when the second scheme's nearest caption names a **different referent**
  (fashion-design — NK4700-4890 Costume vs UDC 746 needlework; v2 re-split candidate); an
  umbrella and its qualifying children may coexist inside one LCC subclass (decorative-arts NK
  alongside interior-design and ceramic-arts — contrast computer-systems, whose children failed
  and absorbed); a generator QID collision between two distinct nodes retires as **hint-input
  error**, not identity ambiguity — withdraw the hint, keep the node unflagged, let the resolver
  fill identity (graphic-design; independently mirrored by 13b's mycology collision); UDC 7.01
  "Theory and philosophy of art" records as arts-side deliberate non-coverage — the philosophy
  continent's subfield:aesthetics keeps sole custody of the referent (no second node without
  demonstrated distinct community + classification standing); when both gate schemes file an
  area only as a subdivision, a strong practitioner community cannot alone carry a skeleton node
  (composition — MT40-67, UDC 78.02; v2 candidate).
- 2026-06-11 arts-design part_of edges (13d edge rulings): **discipline-naming parity** is the
  §13 gate discriminator — a second membership is written when the second scheme files the
  discipline under a class/range that *names the discipline* (architecture ← LCC TH845-895
  "Architectural engineering"), and dropped when the second reading is only a shared-subclass
  coordinate-label (drawing→design — shelving bundling, recorded as candidate); round-internal
  §13 evidence handoff works — the owning branch live-re-verifies the other branch's recorded
  dossier before writing the edge (13c dossier → 13d architecture write-in; single-owner
  assignment table + handoff note in the other branch's report).
- 2026-06-12 round-1 integration (#14 rulings): the four branches' precedent candidates were
  cross-checked for mutual contradictions — **none found**; two discriminators recorded to
  prevent misreading: (i) flag placement under gate-scheme splits — an in-continent *wing* split
  contests the **edge** (criminology), a cross-continent *gate* split contests the **node**
  (physiology/anatomy); (ii) peer-vs-absorb inside a parent's range — dedicated range + distinct
  community = peer (mycology), cutter-only anchor + same community = absorb (genomics).
  Architecture's engineering-side membership **stays domain-direct** (re-target review executed
  with field:civil-engineering now existing: LCC TH845-895 and UDC 69 file architectural
  engineering *beside* civil engineering's TA/624 — the gate schemes separate them, and FORD
  2.1's bundling is a cross-check scheme, which does not create a nesting per the 13c edge rule;
  a built-environment field-level parent is a v2 question, not forced by current evidence).
- 2026-06-12 medicine & health (round 2, session #18 rulings): the gate pair is LCC class R +
  UDC class 61, cross-checks OECD FORD 3 + MeSH H02/H02.403 (PhySH is absent for medicine — a
  ratified discipline scheme's *absence* is continent-specific, and MeSH replaces it as the
  discipline cross-check). **ABMS-board structure governs field-vs-subfield level**: an
  independent ABMS *primary* specialty is a **field** even where the gate scheme *shelves* it
  inside another subclass — psychiatry/neurology (UDC 616.89/616.8 own divisions but LCC RC
  shelving), anesthesiology (LCC RD78 under surgery), emergency-medicine (LCC RC86 under internal
  medicine), physical-and-rehabilitation-medicine (LCC RM695), family-medicine (LCC R729.5) are
  fields by the shelving-is-not-a-hierarchy precedent, because they serve communities distinct
  from their LCC parent (the absorption rule fires only for refinements of the *same* community);
  ABIM/surgical *subspecialties* (cardiology, gastroenterology, …, orthopedic-surgery, urology)
  are subfields. **Three distinct referents may share one LCC range**: R895-920 carries radiology
  (clinical imaging specialty), medical-physics (applied-physics discipline, transferred from
  natural sciences per decision (30) — a natural-sciences drop's *receiving* continent creates it
  native, no §13 needed), and nuclear-medicine (radiology subspecialty) as distinct nodes
  (QIS-vs-quantum-computing distinct-referent precedent). nutrition-science demoted field→subfield
  (UDC 613.2 is a subdivision of 613, LCC anchors are sub-ranges — the business demotion profile;
  kept cross-continent `ambiguous`, life-sciences §13 candidate). A discipline whose LCC home sits
  in a *public-aspects* subclass nests there per the gate even against institutional affinity
  (forensic-medicine → public-health via RA1001-1171, pathology affinity noted; toxicology →
  pharmacology via UDC 615.9 under 615, RA1190 affinity noted). The medicine-entry §13 cross-lists
  resolve at continent entry (decision (33)): physiology/anatomy keep life-sciences home + medicine
  membership (UDC 611/612 under 61), biomedical-engineering keeps engineering home + medicine
  membership (LCC R856-857) — all co-equal, no `disputed` (other-home filing = support).
- 2026-06-12 medicine QID audit (session #18): a new homonym class for the adversarial audit —
  the **disease-object-vs-clinical-specialty** collision. An organ/condition discipline's label
  (e.g. "infectious diseases") collides with the disease object; the resolver and multi-signal
  grounding both passed the disease object (Q18123741, P31 *class of disease*) where the specialty
  (Q788926, P31 *medical specialty*) was meant. The refutation audit caught it by requiring P31 to
  be a specialty/discipline class, never a `class of disease`. Medicine QID audits must check P31
  explicitly (label match is insufficient — the order's "임상 동음이의 함정").
- 2026-06-18 cognitive sciences (round 3, session #21 rulings): an **interdisciplinary continent**
  with no single gate scheme anchors its discipline hierarchy on one gate (LCC subclass BF) +
  the domain's own Wikidata P279/P527 structure (Q147638 hexagon), with UDC/MeSH/FORD as contrasts —
  FORD's filing of the whole area under a *different* continent (psychology+cognitive science = FORD
  5.1, a social science) does not move our independent-continent modeling. A discipline the boundary
  table assigns to the continent but that has **no own sub-range in the gate scheme** takes field
  rank by institutional independence (neuroscience — no BF range; Society for Neuroscience + dedicated
  departments/degrees; the psychiatry/neurology-over-RC precedent generalized). **Absorption fires on
  a Wikidata single-referent collision:** when two seed labels resolve to the *same* QID whose aliases
  span both (behavioral-neuroscience = biological-psychology = biopsychology, Q846566), they are one
  node — keep the research-area name, the teaching label becomes an alias (label rule). A course-label
  area with a journal but **no distinct department/society/degree** absorbs into the discipline whose
  community it shares (abnormal-psychology → clinical-psychology; the *Journal of Abnormal Psychology*
  renaming to *Psychopathology and Clinical Science* is the merger signal). The cognitive-science
  homonym class is **concept/process-vs-discipline** (perception/decision-making/cognition as the
  thing studied, not the field studying it) and **object-vs-discipline** (psychological-test Q873512
  vs psychometrics Q506132) — when no clean discipline entity exists (only a concept, a journal, or a
  narrower sub-approach), the node stays an **honest QID-less gap** at `proposed` (sensation-and-
  perception, computational-cognitive-science, judgment-and-decision-making) rather than anchoring on
  the wrong referent. §13 dual-home subfields (a node filed in two continents' gate schemes — e.g.
  educational-psychology in LCC BF *and* LB, Wikidata P279 subclass-of psychology *and* educational
  sciences) keep `reviewed` with the second membership written as a co-equal §13 edge, not capped at
  `proposed` (the dual home is an edge concern, not a node contest — physiology/anatomy precedent).
- 2026-06-18 cognitive-sciences part_of edges (session #21): an **integrative subfield** that belongs
  to no single field but to the interdisciplinary whole attaches `part_of` the **domain** directly
  (computational-cognitive-science → domain:cognitive-sciences), the §12 part_of-depth freedom applied
  to a shallow attachment rather than a deep one; a within-continent §13 co-equal (behavioral-neuroscience
  → both neuroscience and psychology) is as valid as a cross-continent one (cross-listing v1 is
  membership-count-agnostic, not continent-bounded).
- 2026-06-18 humanities-remainder skeleton (session #23, eleventh / **last academic continent**): a
  continent with **no single gate scheme** is grounded on a **multi-class gate union** — LCC C/D/E-F
  (history) + P/PA-PT (linguistics/literature/classics) + BL-BX (religion, with BC-BD/BF/BJ excluded as
  philosophy/cognitive-science/ethics done), cross-checked against UDC 81/82/2/9 + FORD 6 + Wikidata
  Q80083's has-part hexagon. The **concept-vs-discipline homonym** rule sharpens into a **general-concept-
  vs-discipline** rule: where Wikidata conflates the broad concept and the field on one popular item with
  **empty P31** (history Q309 "the past", sl=316), the skeleton anchors instead on the smaller **explicit
  discipline entity** (Q1066186 "study of history", P31 academic discipline) — the discipline sense wins
  over the popular concept sense. The **era-vs-discipline** trap is its period analog: ancient/medieval/
  modern history are LCC-D primary divisions but Wikidata models them as **time periods**; a period node is
  `reviewed` only if a discipline/field-of-study P31 entity exists (medieval-history Q27992545), else it is
  an **honest QID-less gap** at `proposed` (modern-history — only the era "modern period" Q3281534 exists).
  **Field-rank by institutional independence** extends beyond neuroscience: **archaeology = field** (SAA/AIA,
  dedicated departments) and **classics = field** (SCS) even though LCC shelves archaeology under class C
  (auxiliary sciences of history); the gate's shelving depth does not cap discipline rank. **Gate-primary
  wins the part_of home** when schemes disagree: paleography/epigraphy are LCC class-C auxiliary-of-history
  → history-home, even though epigraphy's Wikidata P31 is "archaeological sub-discipline" (archaeology §13
  candidate recorded). **Slicing axes are not sub-disciplines**: the geographic axis (national/regional
  histories, LCC DA-DX/E-F) and individual-language literatures (PQ-PT) and individual faiths (BM/BP/BQ/BR,
  religion *objects* not the *study*) are all v2/excluded — model the discipline, not the slice or the object.
  Theology's traditional divisions (systematic BT, practical BV) **flatten** to subfields of religious-studies
  under the 2-level model (medicine-subspecialty-flatten precedent). The **last-continent rule**: all residual
  cross-continent interfaces close here — the linguistics cognitive wing (psycho/neuro/cognitive-linguistics)
  cross-lists to the existing cogsci nodes (§13, the strict-sequential payoff), economic-history cross-lists
  to the now-existing history field (debt §4), and media/mass-communication is confirmed **SS-only** (no forced
  humanities §13) — an interface is *closed* by either a §13 edge or an explicit no-edge ruling, not left open.
- 2026-06-30 `concept:internet` (person wave 4, session #39): a **`founded_or_formalized` target need not be a
  §12 skeleton field/subfield** — the relation taxonomy admits a `concept` target, and a major non-discipline
  referent may be admitted as a `concept` node when it is the *precise* referent of a founding (the Internet,
  Q75 "global system of connected computer networks", as Cerf+Kahn's referent — **not** the academic field
  `computer-networks`, which predates them and made the wave-3 Cerf attempt an over-broad-referent NEI). The
  `concept` type already exists in the schema (precedent: vector-space / random-variable / probability-
  distribution), so this is a **modeling ruling, not a schema change**. General rule: when a founder's true
  referent is a system/artifact/concept rather than a discipline, point the edge at a `concept` node for that
  referent rather than forcing a discipline target (referent precision over skeleton convenience).
- 2026-06-30 movement/school axis (decision (73), session #40): §12 structural rule 5 ratified — the
  three pending cases split three ways by what each *is*: structural-anthropology→`subfield`
  (promoted proposed→reviewed; Wikidata "branch of anthropology"; founder edge
  `claude-levi-strauss→structural-anthropology` unblocked and laddered to reviewed), logical
  positivism→`concept` and Vienna Circle→`institution` (ratified types, built with their Vienna
  Circle figure wave so the edges are real, not orphan stubs). Diagnosis that drove the rule:
  Wikidata types existentialism/pragmatism (already kept subfields) identically to the deferred ones
  ("philosophical movement") → movement-vs-discipline was never the real line; standing-research-area
  vs bounded-school is. Full design: vault `reference/movement-axis-design.md`.

## 13. Cross-listing standard (multiple `part_of` memberships)

> Cross-listing policy v1 (CPO-ratified 2026-06-11, vault decision log (21)). Governs disciplines
> that genuinely belong to more than one parent — the cases the single-parent model could not
> resolve (clause-6 "genuine splits").

- **Co-equal multiple parents.** A node may carry multiple `part_of` parent edges, all co-equal —
  there is **no primary-parent marker**. The "choose the single parent" question does not exist in
  this model; a node previously stuck at `proposed` on such a contest is promoted once **each**
  membership edge passes its own evidence gate.
- **Single node ID, render-time instances.** A cross-listed discipline remains **one node with one
  language-independent ID**. Multiple appearances (e.g. inside each parent continent's rendered
  region) are *render instances* of that one node, and any disambiguating display-label suffix is
  computed at render time — **never stored in data**. Graph topology and identity never fork.
- **Same evidence discipline for every membership.** A second (or nth) `part_of` edge requires the
  same externally-sourced classification grounding and QC as the first (edge promotion policy v1,
  clause 1). Memberships cannot be created on editorial feel — this is the structural guard against
  membership spam.
- **Asymmetry is per-edge data.** Differences in how strongly each parent claims the node are
  conveyed by each edge's `confidence`, `disputed` (with the minority position in `note`), and
  `note` — interpretation and display stay downstream.
- **Coverage dashboards count unique nodes.** A cross-listed node counts once in coverage metrics,
  regardless of how many membership edges or render instances it has.
- Edge targets follow the §12 precedent that the flat rule governs node levels, not edge depth: a
  membership edge may target a domain directly while the proper field-level parent does not yet
  exist, with a re-target note recorded on the edge.
- **Co-equal membership vs application/influence — the grounding must actually survive (precedent,
  session #45).** A field being *used across* several disciplines is not the same as it being a
  co-equal `part_of` member of each. `social-choice-theory` was surfaced for a §13 cross-listing to
  political science after Arrow's founder node landed; on live verification the classification
  grounding did **not** support co-equal membership — Wikipedia frames it as "a branch of welfare
  economics" that "contrasts with political science" (normative vs descriptive), and SEP says its
  "influence extends across economics, political science, philosophy, mathematics…". Ruling:
  `economics` stays the **sole** `part_of` home; the cross-disciplinary reach is recorded as
  `applies_to political-science` + `applies_to philosophy` (accurate to the sources), **not** a
  co-equal `part_of`. The §13 evidence bar (externally-sourced classification grounding for
  membership) is a real gate — when it fails, use `applies_to`/`influenced`, not a forced membership.

## 14. Domain axes: practical-knowledge and meta-knowledge (layer/axis, not continents)

> Lane A ruling (CPO-ratified session #45, 2026-07-01). Closes the long-parked question of the two
> empty placeholder domains. Grounded in the completed Lane A research brief
> (`reference/lane-A-practical-meta-scoping-brief.md`: 6 universities + 5 classification systems
> surveyed, 18 verified sources) and the decision (46) layer/axis intuition.

- **Ruling: both are cross-cutting axes/lenses, not continents.** `domain:practical-knowledge` and
  `domain:meta-knowledge` are **deprecated** as continent nodes (`status: deprecated`,
  `indexable: false`). The atlas has **11 academic continents**; practical/theoretical and
  meta/object are *lenses* applied to existing continents (a depth/altitude dimension per decision
  (46)), not top-level domains that house distinct knowledge.
- **Why.** All five classification systems (DDC, UDC, LCC, OECD FORD, UNESCO ISCED-F) organize
  applied and meta knowledge by subject domain, not by a practical-vs-theoretical or a
  knowledge-about-knowledge axis; every "applied" or "meta" area maps 1:1 to an existing continent
  (engineering→engineering, epistemology→philosophy, LIS→information science). No top university
  builds a "practical knowledge" school housing subjects absent elsewhere; the professional-school
  split at Harvard/Stanford is a training-modality distinction, not a knowledge-domain one. A flat
  continent would double-count (an engineering application would need cross-listing to both
  engineering and practical-knowledge).
- **Meta-knowledge infrastructure-strand caveat (recorded, not built).** The *epistemic* strand
  (epistemology, philosophy of science, metascience) is unambiguously distributed within philosophy
  and STS — clearly axis. The *infrastructure* strand (library & information science; 133 iSchools;
  Todai's Interdisciplinary Information Studies) has genuine institutional weight. If a future need
  arises specifically for LIS/information-science coverage, it is admitted **as information science
  within the existing computer-and-information-sciences continent** (or a scoped subfield), **not**
  by reviving `domain:meta-knowledge`. Revisit only on a concrete, scoped coverage gap.
- **`domainKeySchema` enum.** The `practical_knowledge` / `meta_knowledge` enum values are retained
  but unused (reserved) — removing them is a separate schema change with no current benefit; the
  deprecation of the domain nodes is what enforces "not a continent."

## 15. Deterministic foundry toolchain — decision files and the one write path (2026-07-02)

Ratified as the **ops-efficiency package** (CPO, 2026-07-02; vault decision log). The package
answers one diagnosis: eight of the ten measured operational inefficiencies shared a root cause —
*a batch's promotion decision existed only in orchestrator conversation context plus hand-written
prose*, so writing, anchoring, reporting, caching, and held-item recall were all re-derived by hand
every session. The fix is to materialize the decision as data and hang deterministic tools off it.
Everything below is offline/maintainer-local, LLM-free, and CI-safe (network jobs are resolver-class
and never run in CI — §11 boundaries).

### 15.1 Canonical /data format

Every `/data` file has exactly one byte representation: top-level items sorted by a stable per-file
key, 2-space indent, trailing newline (`scripts/lib/canonical-data.ts`). `npm run validate:data`
fails on deviation; `npm run format:data` rewrites (after proving the rewrite is a semantic no-op).
Consequences: write tooling can regenerate files without spurious diffs on untouched items, and
sorted insertion keeps parallel batches from colliding at the file tail. The old "preserve original
indentation, avoid reformatting unrelated items" hand-editing discipline is **obsolete**.

Two invariants added with it: node **provider-ID uniqueness** (no two nodes may share a Wikidata
QID / OpenAlex ID — the machine backstop against duplicate modeling of one referent) and the
existing slug-ID uniqueness.

### 15.2 Promotion decision files (the keystone)

A batch's QC outcome is a committed, machine-readable **decision file** at
`foundry/decisions/<batch-id>.json` (`src/schema/foundry-decision.ts`): adds (nodes / edges /
sources / translations / links), status promotions, editorial summary updates, **verdict records**
(every source QC read: url, retrieved_at, snapshot, revision permalink, verbatim quote,
independence flag), **identity records** (provider, id, method, retrieved_at, and for living
persons the P570-absent observation date), **ladder sanctions** for every reviewed outcome,
rejection/held ledger entries, and pending anchors. Decision files are the audit trail: bulk
re-audit replays them; deleting one deletes the ability to re-audit.

### 15.3 Standard batch flow (commands)

```bash
# 0. (optional) polite source-corpus collection for generation grounding —
#    same politeness engine as fetch-verify (lib/polite-fetch.ts); never hand-roll fetch loops
npm run foundry:fetch-corpus -- <urls.json|urls.txt> --out <scratch-dir>
# 1. (regime-dependent, §15.7) generation subagent → v2 proposals, no provider IDs
# 2. label→candidate resolution (existing resolver, §11)
npm run foundry:resolve-wikidata -- foundry/batches/<manifest>.json
# 3. orchestrator drafts foundry/decisions/<batch>.json (verdicts + sources read);
#    schema-valid skeleton + editorial/metadata-flip seeding:
npm run foundry:draft-decision -- <batch-id> --qc-by "<model_name>=<model_version>" \
    [--summaries <merged.json>] [--flip-indexable <id,…>]
# 4. batched identity re-confirmation (50 QIDs/HTTP call) + committed cache
npm run foundry:verify-identity -- foundry/decisions/<batch>.json --write
# 5. permanence anchors: wiki revision permalinks + Wayback snapshots
#    (timeouts + SPN circuit breaker: 3 consecutive save failures → stale-snapshot
#    fallback + honest [SPN-FAILED] pending; --no-spn for known-dead SPN days)
npm run foundry:anchor -- foundry/decisions/<batch>.json --write [--no-spn]
# 6. promotion arithmetic (read-only; apply-batch re-runs it before writing)
npm run foundry:ladder-check -- foundry/decisions/<batch>.json
# 7. THE one write path: preflight → ladders → canonical write → full validate
npm run foundry:apply-batch -- foundry/decisions/<batch>.json
# 8. report skeleton (facts generated; commentary section stays LLM/human)
npm run foundry:report -- foundry/decisions/<batch>.json --write
# session start ritual additions:
npm run foundry:recheck-held   # held/blocked worklist (silent-recall fix)
npm run report:graph           # includes the editorial-gap dashboard
```

Hand-rolled per-session write scripts against `/data` are **retired**; `foundry:apply-batch` is the
only sanctioned write path for batch outcomes.

### 15.4 Ladder arithmetic is code

`scripts/foundry/lib/ladders.ts` is the executable transcription of the ratified promotion ladders
(node v1 / v1.4, living-person v2 (70), edge structural / clause-6, formalizes (54),
founded_or_formalized (60)/(61), a-relations (68), editorial v2, manual-cpo). The vault decision
log remains the authority: the LLM judgments (supported/disputed, direction, identity referent)
stay interactive and arrive as recorded verdict fields; the *arithmetic* over them (endpoints
reviewed? ≥2 independent sources? living guard? which clause?) is pure code, identical every
session. **A divergence between this code and ratified policy text is a stop-point** — fix the
transcription in the same change as the vault ruling, never silently.

Metadata-flip refinement (CPO-ratified 2026-07-02, the first divergence this stop-point caught in
production): a `reviewed→reviewed` promotion op is a **metadata flip** (`set_indexable` /
`set_note`), not a promotion — it does not (re)earn reviewed status and demands no node ladder.
Safety clause: a metadata-flip op carrying `set_external_ids` / `set_evidence` is a blocking
violation (identity/evidence changes must ride a real status transition, where a ladder sanction
is demanded). The indexable earned rule (reviewed status + reviewed default-locale translation)
stays machine-enforced by `validate-data` independently of the ladder gate.

### 15.5 Identity cache — cache identity, never truth

`foundry/cache/wikidata-entities.json` (committed) caches QID→entity snapshots (label, P31, P570
presence, retrieved_at) with a TTL (`--max-age-days`, default 90). **Claim-support verdicts are
never cached anywhere** — temporal validity is their point. Living persons are never served from
cache for P570: aliveness is observed live at promotion time (decision (70)), never assumed.

### 15.6 Proposal contract v2 — no provider IDs from generators

Measured across every generation wave, generator-guessed QIDs were ~100% hallucinated (9/9, 12/12,
20/20, 21/21, 7/7). v2 (`foundryProposalV2Schema`) removes the guessing step at the schema level:
`external_ids` is gone from proposals; every proposed node instead carries a **blind `referent`
description** (discriminating, written from the generator's own knowledge, no lookups) that the
resolver matches independently — a description/resolution mismatch is an error signal the old
contract could not produce. No QID/OpenAlex shapes may appear anywhere in a v2 artifact (string
scan, enforced by `validate:data` on all post-cutover batches). Deliberately NOT adopted: giving
the generator resolver access — it would anchor the referent description to whatever resolved,
destroying the blind-description checksum, and resolvers are maintainer-local anyway.

### 15.7 Generation regime split (ADR 0007 amendment, ratified 2026-07-02)

**Separated generation is required exactly when the promotion gate includes an LLM judgment**
(a supported/disputed-class verdict). When the gate is fully mechanical — resolver-verified
identity + liveness + schema — the gate itself is uncorrelated with every context, so the
error-decorrelation argument does not bind and the orchestrator may draft the item list directly.
In practice:

- **Separated generation stays** for: (a)-relations, `formalizes` / `founded_or_formalized`
  claims, contested placements, any novel evidence-backed edge wave.
- **Orchestrator-drafted lists are permitted** for: enumeration of an externally defined canon
  (the external authority is the real generator), mechanical closure waves (mirrors, backfills,
  cross-listing expansions — items are *derived*, not proposed), and identity-dominated node waves
  whose entire promotion path is resolver-verified.
- Selection/coverage bias is bounded by the gap dashboards and by the gates not caring who
  proposed an item. The generation/QC **context-separation contract itself is unchanged** — what
  changed is when a separate generation context adds decorrelation value at all.

### 15.8 Ledgers: held and rejected candidates

`foundry/held.json` (blocked items with their blocking condition and machine/manual recheck flag)
and `foundry/rejections.json` (rejected candidates with reasons) are appended by `apply-batch` from
each decision file. `foundry:recheck-held` renders both against current `/data` state at session
start — a cleared blocker surfaces instead of rotting, and `apply-batch` refuses to silently
re-admit a rejected label (`override_rejections` makes re-admission explicit). Generation orders
should paste the relevant rejection-ledger entries into the subagent's context.

### 15.9 Editorial-gap dashboard

`npm run report:graph` reports the summary gap (reviewed nodes without an `en` summary — 112 of
589, 19%, at adoption) with a degree-ordered priority list, so editorial batches close the gap
readers actually hit first. The gap is inventory, acceptable while tracked and bounded; a WIP cap
remains an open CPO knob if the trend line grows.
