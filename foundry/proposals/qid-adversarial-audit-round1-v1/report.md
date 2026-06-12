# Adversarial QID audit — qid-adversarial-audit-round1-v1

- **Adjudication:** Claude Fable 5 (orchestrator session #15), 2026-06-12.
- **Refutation agents:** 110 × Claude Sonnet (claude-sonnet-4-6), one per QID, separate contexts
  (multi-agent fan-out via a deterministic workflow harness — the explicitly pre-authorized
  workflow use of this session). Per ADR 0007 the agents only *collected* refutation evidence;
  every verdict below is the orchestrator's.
- **Scope:** all **110 round-1 verified QIDs** in `/data` — the golden-set's four parallel-round
  batches (`social-sciences-skeleton-v1` 36, `arts-design-skeleton-v1` 25, `engineering-technology
  -skeleton-v1` 30, `life-sciences-skeleton-v1` 19), filtered to `verdict: verified` entries whose
  `expected_qid` matches the live `/data` anchor (110/110 cross-checked, mismatch 0). The four
  `upstream_gap` golden-set rows (business-and-management, economic-theory, archaeological-
  anthropology, naval-architecture) are QID-less in `/data` and out of scope. Fourth execution of
  the decision-log (3) bulk re-audit principle (prior: CS 24, FS 44, seed+philosophy 74).
- **Method:** per-item adversarial order ("find live evidence that this QID denotes a different
  entity"), live `Special:EntityData` fetch (labels, descriptions, English aliases, P31, sitelink
  count, enwiki title), at most one cross-search, training-knowledge claims banned, refutation
  requires a *different referent* (granularity / thin-anchor / topic-vs-discipline quibbles
  excluded and recorded instead). 13 items carried recorded must-not-select leads (golden-set
  guards); agents fetched those competitors adversarially too.

## Headline result

| Measure | Result |
|---|---|
| Audited | 110/110 (fetch failures 0) |
| Agent-level refutations | **0/110** |
| Non-high survivals | 2 (both `medium`, both non-refutations — granularity) |
| **Adjudicated residual referent errors** | **0/110 confirmed** |

**Cumulative residual-error sample across all audits: 2 confirmed / 252 audited**
(CS 24 + FS 44 + seed 13 + philosophy 61 + round-1 110). The 2 confirmed errors remain the two
**seed-era** human-curation QIDs (domain:life-sciences Q864 → Pokémon, domain:arts-and-design
Q735 → art-the-concept; both fixed session #11). **Pipeline-origin (resolver-verified) running
total: 0 / 239 confirmed** (129 prior + 110 round-1). The "errors only in the un-resolver-checked
seed era" pattern holds: round-1 added 110 pipeline QIDs and 0 errors.

## Non-high survivals (adjudicated non-errors)

Both are recorded `medium`-confidence survivals — granularity/discipline-vs-practice concerns, not
wrong referents. Neither is a refutation.

1. **subfield:urban-and-regional-planning → Q149013.** Live: label "spatial planning", desc
   "technique for physical organisation of space", **the target name "urban and regional planning"
   is carried as an alias**, P31 includes Q11862829 (academic discipline), enwiki "Spatial
   planning", 37 sitelinks. The exact-label competitor **Q64808211** ("urban and regional
   planning", discipline desc) is a 0-sitelink / no-enwiki stub — the recorded duplicate-link-twin
   must-not-select guard (session #12). **Verdict: unchanged.** Q149013 is the broad, well-anchored
   referent (spatial planning ≅ urban-and-regional planning via aliasing); the granularity concern
   is exactly what the golden-set guard already documents. *Note: this node is also a clause-6
   B-flagged proposed node (paired with arts-side urban-planning Q69883 for cross-listing at
   resolution — debt §2).*
2. **subfield:ceramic-arts → Q13464614.** Live: label "ceramic art", desc "art objects made from
   clay … by the process of pottery", enwiki "Ceramic art", 23 sitelinks, aliases incl. "ceramics".
   P31 = Q56055944 (type of arts), Q1792379 (art genre), Q47728 (hobby), Q2207288 (craft) — **no
   "academic discipline" P31**. The agent flagged the absence of a discipline-kind P31 as a
   medium-confidence concern. **Verdict: unchanged.** This is the art-practice/medium referent and
   the canonical "Ceramic art" entity; the arts continent legitimately anchors practice-based
   subfields (painting, sculpture, drawing) at the art-object/practice entity rather than a
   discipline entity — consistent with the recorded object-twin guards (painting Q11629 vs
   Q3305213; sculpture Q11634 vs Q860861). No competing discipline entity exists.

## Anti-rubber-stamp review

A 0/110 high-confidence sweep was scrutinized rather than rubber-stamped. The 13 lead-carrying
items (where a competing entity was recorded at acceptance) are the structurally riskiest: the
agents fetched both the anchor and its recorded competitor and confirmed the guard each time —
e.g. mycology Q7175 (not the microbiology collision Q7193), systematics Q3516404 (not systems
theory Q105769), civil-law Q222249 (not the legal-system sense Q5950118), social-work Q205398
(not social-policy Q828395), drawing Q2921001 (not technical-drawing Q192521 / the artwork-object
Q93184), decorative-arts Q631931 (not applied-arts Q207241), art-history Q50637 (not the
phenomenon Q50641), construction-engineering Q2674423 (the umbrella-test component anchor, not
management Q2920921). The two thin-anchor seeds in this batch (textile-engineering, drawing) were
additionally re-read directly by the orchestrator at the anchor pit-stop (below). The four
field-level engineering anchors that share P31 patterns with their domain (electrical/mechanical/
industrial/nuclear, all manual-path) carried exact-name enwiki sitelinks and discipline P31s.

## What this measures — and what it does not

Residual wrong-referent rate of round-1's 110 accepted QIDs: **0/110 confirmed** (upper bound
counting both medium survivals as worst-case: 1.8%). Not measured: coverage gaps (the 4 QID-less
upstream-gap seeds were out of scope), anchor-policy consistency across continents (the standing
watch items, tracked at the pit-stop below), the editorial layer (separate QC). Golden set
unchanged (no QID changes — 0 corrections this round; all 110 anchors stand).

---

# Anchor-policy pit-stop disposition (debt §6)

Five accumulated watch items re-read directly (live `EntityData`, 2026-06-12). Four are
no-change with a one-line record; one is the policy-grade dual-anchor — **a CPO gate stop-point**
because resolving it changes a *reviewed* node's identity (brief below, **not executed**).

| Watch item | Live profile (2026-06-12) | Disposition |
|---|---|---|
| **Q28575007** differential-equations | "theory of differential equations", **0 sitelinks**, 1 alias, no enwiki, P31 Q1936384 branch of mathematics | **No change.** Referent correct (the math area); thin but the recorded granularity-variant judgment (PR #46; OpenAlex prefers the equation-object Q11214) stands. (Session #12 noted alias 1→8; live shows 1 again — alias churn, immaterial.) |
| **Q10336440** computer-networking re-anchor candidate | "field of work within computer science…", **1 sitelink**, 0 aliases, no enwiki, P279 Q21198 | **No change.** Still thinner than the live anchor (computer-networks Q1301371); the "re-anchor when upstream matures" condition (session #9) is not met. |
| **Q16966481** modern-philosophy re-anchor candidate | "early modern philosophy" (a **period**), 7 sitelinks, enwiki "Early modern philosophy", P279 Q27654 | **No change.** Different referent (a historical period, not the discipline). modern-philosophy stays parked (proposed; time-axis v2 modeling question), anchored Q860746. Not an anchor fix. |
| **Q20825773** textile-engineering thin anchor | "textile engineering", **4 sitelinks** (was 0 in 13c), 1 alias "textile technology", no enwiki, P31 incl. Q4671286 academic discipline | **No change — positive drift.** Referent correct (the engineering discipline) and the anchor is maturing (0→4 sitelinks since session #13c). Watch closed unless it regresses. |
| **Q21198** computer-science dual-anchor | "computer science", 201 sitelinks, enwiki "Computer science", P31 academic discipline + branch of science | **POLICY-GRADE → CPO gate (brief below; not executed).** |

## Q21198 dual-anchor — CPO brief (stop-point; not executed)

**The fact.** `/data` has exactly one QID shared by two nodes:
`domain:computer-and-information-sciences` **and** `field:computer-science` both anchor to
**Q21198** (both `reviewed`). It is the sole QID duplication in `/data` (confirmed every prior
integration). The recorded-but-unexecuted recommendation since session #9 has been "field only".

**Investigation (this session).** Every other academic-content domain anchors to a *broad
discipline-group* entity distinct from its child fields: formal-sciences Q816264, natural-sciences
Q7991, life-sciences Q864928, social-sciences Q34749, humanities Q80083, arts-and-design Q2018526,
engineering-and-technology Q11023, medicine-and-health Q11190, cognitive-sciences Q147638. The two
boundary domains (practical-knowledge, meta-knowledge) are deliberately **QID-less**. Computer-and-
information-sciences is the **only** domain that borrows a child field's QID. A live search for an
umbrella entity ("computer and information sciences" / "information and computing sciences",
FORD 1.2 / ANZSRC 46) returned **no discipline-group entity** — only ISCIS conference proceedings.
The domain is a FORD/OECD classification grouping with no 1:1 Wikidata entity.

**Options.**
- **(A) Make domain:computer-and-information-sciences QID-less** (FORD 1.2 grounding), mirroring
  practical-knowledge / meta-knowledge; field:computer-science retains Q21198. Removes the sole
  duplication cleanly; the domain is genuinely a classification bucket. **CTO-recommended.**
- (B) Find/accept a broader entity — none fits (Q816264 "formal science" is already the formal-
  sciences domain anchor and is the wrong parent; no CIS-grouping entity exists).
- (C) Status quo — the duplication is benign (validate passes; the OpenAlex provider-endpoint
  defect from a shared QID does not apply here since the domain carries no external_metrics).

**Why this is a stop-point, not a CTO action:** option A removes a *reviewed* node's QID
(identity change) — the session order's single conditional gate. No change executed; the anchor
stands until CPO decides. Recommendation: **(A)**.

## Q21198 dual-anchor — execution record (session #16, 2026-06-12)

**CPO decision (36), 2026-06-12: option (A) ratified and executed this session.**

- `domain:computer-and-information-sciences` → `external_ids` emptied (`{}`), Q21198 removed;
  `updated_at` 2026-06-12. The domain mirrors the deliberately QID-less practical-knowledge /
  meta-knowledge precedent; its grounding remains the FORD 1.2 classification filing.
- `field:computer-science` is now the **sole** holder of Q21198. `/data`'s only QID duplication
  is eliminated (verified post-change: zero duplicate QIDs across nodes.json).
- Golden set: the seed entry for the domain re-dispositioned `verified` → `upstream_gap` with
  `must_not_select: ["Q21198"]` (the anchor must never be re-acquired by the domain seed);
  field:computer-science's `verified` Q21198 entry unchanged. Offline goldenset check: regression 0.
- Erratum semantics: the seed-era anchor was not a *referent* error (Q21198 is computer science;
  the session #9/#15 audits verified the referent) but an **anchor-policy** error — a domain-level
  classification bucket borrowing its child field's identity. Recorded as such; the audit
  cumulative residual-error tally (2/252, both seed-era) is unchanged by this disposition.

Session #9 identity-conflict finding → session #15 pit-stop brief → CPO decision (36) → executed
here. Watch item closed.
