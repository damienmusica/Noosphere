# ML-foundations-v1 — promotion report (edge promotion policy v1, first application)

**Date:** 2026-06-10 · **Policy:** edge promotion policy v1 (CPO-ratified 2026-06-10, vault
decision log (15)) · **QC disposition applied:** 2026-06-10 (PR #14: promotion queue 5 / dropped 7)
· **Promoted by:** Claude Fable 5 (claude-fable-5), orchestrator/QC session #4.

This is the permanent provenance + verification record for the five edges promoted from this
batch into `/data`. The reasoned-proposal record (rationale / uncertainty / ambiguous per edge)
remains in `edges.proposed.json`; the QC disposition rationale is in the vault decision log (5)
and `roadmap.md` (parked-items entry, now retired).

## Policy application (all five → `proposed`)

| Edge | Conf | Evidence kind | Endpoints | Result | Why |
| --- | --- | --- | --- | --- | --- |
| probability-theory → bayesian-inference (prerequisite_for) | 0.90 | editorial | reviewed/reviewed | proposed | editorial ladder (clause 2) |
| calculus → gradient-descent (prerequisite_for) | 0.85 | editorial | reviewed/**proposed** | proposed | clause 2 **+ status cap (clause 3, first application)** |
| random-variable → probability-distribution (prerequisite_for) | 0.75 | editorial | reviewed/reviewed | proposed | clause 2; direction kept per PR #14 conflict resolution |
| linear-algebra → optimization (prerequisite_for) | 0.70 | editorial | reviewed/reviewed | proposed | clause 2; generator ambiguity (co-requisite) recorded in note |
| statistics ↔ mathematics (adjacent_to) | 0.60 | editorial | reviewed/reviewed | proposed | clause 2; deliberately not part_of (B-type contest) |

Zero edges reached `reviewed` — expected: the whole queue is editorial-evidenced, and the
editorial → reviewed ladder stays closed until editorial-layer precision is measured.

## Source-hint live verification (clause 2 precondition) — 4/4 pass

All four cited textbooks were live-verified on 2026-06-10 before promotion (rule: training
knowledge is not evidence; bot-blocked sites verified via the session-#2 bypass paths):

- **Mathematics for Machine Learning** (Deisenroth, Faisal & Ong) — <https://mml-book.github.io/>
  HTTP 200; title + all three authors + both cited chapters ("Vector Calculus" Ch. 5,
  "Continuous Optimization" Ch. 7) present on page.
- **Convex Optimization** (Boyd & Vandenberghe) — <https://web.stanford.edu/~boyd/cvxbook/>
  HTTP 200; title + both authors + Cambridge University Press present.
- **Bayesian Data Analysis, 3rd ed.** (Gelman et al.) — canonical page
  <http://www.stat.columbia.edu/~gelman/book/> is bot-blocked (HTTP 403); verified via Wayback
  direct snapshot <https://web.archive.org/web/20250106021519/http://www.stat.columbia.edu/~gelman/book/>
  (302 redirect proves snapshot; content shows title + co-authors Carlin/Stern/Dunson/Vehtari/Rubin).
- **A First Course in Probability** (Sheldon M. Ross) — Open Library work
  <https://openlibrary.org/works/OL17047555W> (live search hit, 23 editions, author confirmed).

Hint-hallucination dashboard entry: **0/4 hallucinated** (every cited textbook is real and
matches its claim) — first editorial-edge data point, against 41%/59% URL hallucination in
editorial summary batches 1–2.

## Provenance exemption (documented)

This batch predates the proposer-provenance schema (PR #16) and the canonical
`proposed_by` field (PR #35). Generator: **Claude Sonnet** (vault decision log (5)); the exact
model version string was not recorded at generation time and is **not** reconstructed here
(never guess). The five promoted edges therefore carry no `proposed_by`; their audit record is
this directory plus git history. Every edge generated after policy v1 must carry `proposed_by`.

## Disposition of the remainder

The seven dropped edges stay dropped (high-altitude duplicates 3, reverse-conflict 1, drop
recommendations 3 — see vault roadmap entry and `report.md`). They remain preserved here as
`generated`, re-auditable.
