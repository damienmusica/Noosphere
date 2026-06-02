# Source-of-Truth Hierarchy & Lifecycle

This document defines **which Noosphere documents are authoritative**, how they relate to one
another, and how that authority should change over time as the project moves between phases. It
exists so that future UI/data expansion — and future phase transitions — happen without ambiguity
about which document is canonical.

It is a **meta-document**: it does not change product scope, MVP constraints, or any data rule. It
only clarifies how the existing documents are governed.

## 1. Current document hierarchy

The documents below are listed from public entry point to detailed, narrow sources of truth. When
two documents appear to conflict, prefer the **more specific** one for the topic it owns (e.g. the
relation taxonomy owns relation types), and treat the canonical working brief as authoritative for
overall scope and intent during the current phase.

| Document | Role | Authority |
| --- | --- | --- |
| `README.md` | Public/project entry point and quick orientation. | Orientation only — must stay concise; not the project brain. |
| `NOOSPHERE_CLAUDE_CODE_BRIEF.md` | **Current canonical working brief** for Claude Code sessions during the MVP/foundation phase. | Canonical for scope and intent **in this phase**. Phase-scoped, not a forever-SSOT. |
| `CLAUDE.md` | Persistent **operational** instructions for Claude Code agents. | Authoritative for agent behavior/workflow; points to the canonical docs rather than restating them. |
| `docs/product-brief.md` | Product definition, MVP scope, and product intent. | Authoritative for product intent (condensed from the working brief). |
| `docs/data-model.md` + `src/schema/*` | Data shape and validation expectations. | Source of truth for data shape; the Zod schemas are the executable form. |
| `docs/relation-taxonomy.md` | Allowed edge relation types. | Source of truth for relations (kept in lockstep with `src/schema/edge.ts`). |
| `docs/license-policy.md`, `docs/security-policy.md`, `docs/seo-policy.md`, `docs/ai-usage-policy.md` | Policy-level constraints. | Authoritative for their respective policy domains. |
| `docs/admin-roadmap.md` | Phased plan for admin/database (intentionally deferred). | Authoritative for *when* deferred capabilities may be reconsidered. |
| `docs/adr/*` | Historical architectural decisions. | Append-only decision history — do not rewrite; supersede with new ADRs. |

### How the layers fit together

- **Orientation** (`README.md`) sends readers to the right place; it never tries to be complete.
- **Phase brief** (`NOOSPHERE_CLAUDE_CODE_BRIEF.md`) is the canonical narrative for the current
  phase: scope, principles, milestones, and rationale.
- **Operational rules** (`CLAUDE.md`) tell agents how to work and where to look; they stay short and
  defer to the canonical docs.
- **Specific sources of truth** (data model + schemas, relation taxonomy, policies) own one topic
  each and are authoritative for it.
- **Decision history** (`docs/adr/*`) records *why* the architecture is the way it is, immutably.

## 2. SSOT lifecycle policy

These principles govern how authority moves between documents over the life of the project.

- **Do not delete the MVP/foundation brief when MVP is completed.** It is part of the project's
  decision history and explains why the foundation looks the way it does.
- **Phase transitions happen through an explicit PR.** When a phase ends, mark its brief as
  `completed`/`superseded` (or move it to an archive) only in a deliberate, reviewable pull request —
  never silently overwrite it.
- **Promote long-lived principles upward.** Principles meant to outlive a single phase (e.g.
  read-only posture, evidence-backed edges, English-first topology) belong in a project-level charter
  or `docs/product-brief.md`, not trapped inside a tool-specific or phase-specific brief.
- **Future phase briefs reference, not replace, the durable layer.** A new phase brief should point
  to the long-lived charter/product brief and the current ADRs rather than re-deriving them.
- **ADRs are append-only.** If a decision changes, add a **new ADR that supersedes** the old one
  (link both directions); do not edit the original decision's intent out of history.
- **`CLAUDE.md` stays operational.** It should remain a short set of working rules that points agents
  to the current canonical source-of-truth docs — it is not the place to accumulate product narrative.
- **`README.md` stays concise.** It should orient and link; it must not become the entire project
  brain.

## 3. Timing — when to revisit or create a new SSOT

Revisit this hierarchy, and create a new program-level or phase-level brief, **before** any of the
following — not after they are already underway:

- Before leaving MVP scope.
- Before introducing a major new architecture phase (e.g. a static graph viewer, then data
  expansion — see the milestones in `NOOSPHERE_CLAUDE_CODE_BRIEF.md`).
- Before adding any capability the MVP explicitly excludes — database, auth, admin UI — **if** those
  are ever explicitly reconsidered (per `docs/admin-roadmap.md`).
- Before public launch or broader collaboration (multiple contributors).
- Whenever the current brief becomes stale, or its phase-specific assumptions no longer hold.

Reconsidering an excluded capability does **not** mean adopting it. It means: first record the
decision (a new ADR), update the relevant policy/roadmap doc, and refresh the canonical brief — in
that order, in explicit PRs.

## 4. Current recommendation

For the current MVP/foundation phase:

- **Keep `NOOSPHERE_CLAUDE_CODE_BRIEF.md` as the current working brief. Do not replace it yet.**
- This lifecycle policy exists so future transition timing is explicit and low-risk.
- **Revisit the SSOT structure when the MVP is feature-complete, or before a major post-MVP
  architecture shift** — whichever comes first.

Until then, the hierarchy in section 1 stands, and the lifecycle rules in section 2 apply to any PR
that touches the project's governing documents.
