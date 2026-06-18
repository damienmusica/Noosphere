# formal-formalizes-v1 — Stage 0 candidate scoping (orchestrator)

> Lane B propositional-edge pilot, session #27. First-ever build of the Lane B pipeline contract
> (`lane-B-propositional-edge-pipeline-design.md`, CPO-ratified session #26, decision (50)). Scope =
> **formal-sciences `formalizes` / `founded_or_formalized`**, the (d)-decidable relations. This file
> is the Stage 0 output: the seed candidate triples that drive the Stage 1 generation order. It is
> untrusted scoping material — `/data` is the only ground truth.

## Hard invariant applied at scoping

**Edges reference existing reviewed node IDs only** (CLAUDE.md data invariant). The candidate
universe is the **51 reviewed formal-sciences nodes** (inventory taken from `/data/nodes.json`,
`domain: "formal_sciences"`, all 51 `reviewed`). No candidate introduces a non-existent node.

## `founded_or_formalized` — first-wave finding (honest gap, no candidates)

`founded_or_formalized` is *"A **person or work** helped found or formalize field/concept B."* The
formal-sciences continent has **no person nodes and no `canonical_work` nodes** — the only non
field/subfield/concept nodes are `method:bayesian-inference` and `method:gradient-descent` (methods,
not persons or works). Per the contract (§1, decision (50): *"정초자-인물 엣지는 인물 노드가 없으므로
1차 제외"*), the pilot's first wave **excludes** founder edges; they wait for a node gate to create
the person/work nodes, then a 2nd wave. **First-wave `founded_or_formalized` candidate count = 0.**
This is a measured finding, not a failure — it feeds the close-report's "2nd wave needs a node gate"
recommendation.

The pilot first wave is therefore **`formalizes`-only**.

## `formalizes` seed candidates (A provides a formal mathematical/logical framing for B)

All endpoints are existing FS reviewed nodes. None of these edges already exists (`/data` currently
holds exactly one `formalizes` edge: `edge:mathematics-formalizes-physics`, cross-continent, out of
this pilot's scope). Candidates are chosen for **decidability + claim-stating-source availability**
(math-history texts, SEP, EoM, nLab) and to exercise the full verdict space
(supported / disputed-tension / NEI).

| # | source | target | claim (A formalizes B) | a priori expectation |
|---|--------|--------|------------------------|----------------------|
| C1 | `subfield:set-theory` | `field:mathematics` | Set theory provides a formal foundational framework for mathematics. | supported; foundational-plurality `note` (record co-existing foundations, do not adjudicate "the" one) |
| C2 | `subfield:category-theory` | `field:mathematics` | Category theory provides an alternative formal foundational framework for mathematics. | supported; co-existing foundation alongside C1 (globe-not-tree demo) |
| C3 | `subfield:mathematical-logic` | `field:mathematics` | Mathematical logic provides the formal framework for mathematical reasoning and proof (the formalization of mathematics). | supported |
| C4 | `subfield:probability-theory` | `field:statistics` | Probability theory provides the formal/mathematical foundation for statistics. | supported (distinct relation from the existing `prerequisite_for` edge) |
| C5 | `subfield:probability-theory` | `concept:random-variable` | Probability theory provides the formal (measure-theoretic) definition of a random variable. | supported; concept-level formalization probe |
| C6 | `subfield:probability-theory` | `concept:probability-distribution` | Probability theory formalizes the notion of a probability distribution. | supported; concept-level formalization probe |
| C7 | `subfield:mathematical-logic` | `subfield:set-theory` | First-order (mathematical) logic provides the formal framework in which axiomatic set theory (ZFC) is formalized. | **boundary/NEI probe** — may be supported, may lack a clean claim-stating source (→ NEI-abstain), or may be better expressed as the reverse |

**Why this set (pilot discipline — small, not volume).** Seven candidates is a deliberately tight
first run; the goal is to *measure pipeline trust*, not coverage (contract §1, prompt §자세). The set
is chosen so the pipeline meets every verdict branch:
- **supported** (expected majority): C3, C4, C5, C6.
- **disputed / tension-preservation** (the foundations question): C1 + C2 together. We assert only the
  weak, supported claim ("X provides *a* formal foundation"); the contested interpretation ("which is
  *the* foundation") is exactly what record-not-resolve refuses to adjudicate — both edges co-exist,
  with the plurality preserved in `note` (and `disputed:true` only if a source refutes even the weak
  claim).
- **NEI-abstain** (calibrated abstention = first-class verdict, L23): C7 is the deliberate probe for
  "decidable-looking but no claim-stating source / wrong framing."

## Stage 1 order (generation subagent)

Hand these 7 triples to a **separate-context Sonnet generation subagent** (ADR 0007 / immutable
contract 2). It produces the full reasoned-proposal envelope per candidate (rationale + uncertainty +
ambiguous + confidence + evidence hints `{citation, claim_anchor, url}`) into
`foundry/proposals/formal-formalizes-v1/proposals.json` — **never `/data`**. The subagent may flag a
candidate it believes is mis-framed or unsupportable (→ `ambiguous:true` + `uncertainty`); it must not
invent node IDs outside the 51-node universe. Evidence *hints* are untrusted until the orchestrator
live-fetches (Stage 2–3) and adversarially QCs (Stage 4) in its own context — that independence is
where the error-decorrelation lives, not in the seed list.
