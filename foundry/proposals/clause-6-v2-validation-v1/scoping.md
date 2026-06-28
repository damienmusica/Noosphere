# Clause-6 v2 Validation — Scoping Document

**Batch ID:** `clause-6-v2-validation-v1`
**Generation session:** Sonnet sub-agent, 2026-06-29 (ADR 0007 — separate context from QC)
**Purpose:** Assemble claim-stating sources for 3 contested `influenced` edges filed NEI in prior waves, to test whether clause-6 v2's "disputed-balanced" mechanism fires correctly or is blocked by the over-fire guard.

---

## The 3 Cases

| Case | Source | Target | Relation | Prior NEI reason |
|------|--------|--------|----------|-----------------|
| C3 | `subfield:pragmatism` | `subfield:analytic-philosophy` | `influenced` | Contested, no dominant view — first-fire candidate |
| C2 | `subfield:buddhist-philosophy` | `subfield:phenomenology` | `influenced` | Parallel/comparative ≠ historical influence |
| C1 | `person:charles-darwin` | `person:gregor-mendel` | `influenced` | Book ownership ≠ scholarly influence claim; dominant view = independent |

---

## Clause-6 v2 Test Criteria (as briefed)

v2 fires `disputed-balanced` ONLY when ALL of:

1. The contest is about the **EXISTENCE or DIRECTION** of influence — NOT merely degree/character, NOT parallel/comparative resemblance, NOT book-ownership only.
2. **Each camp** (affirm-influence vs deny/independent-development) has **≥2 INDEPENDENT claim-stating sources** explicitly engaging the question.
3. Both camps are LIVE scholarly positions (not fringe/discredited).

Otherwise → NEI / SUPPORTED+note / REJECT.

---

## Method

1. Reviewed prior proposals from `a-relations-philosophy-v1` and `a-relations-wave2-v1` for context on each edge.
2. Used `WebSearch` + `WebFetch` on SEP (plato.stanford.edu), IEP (iep.utm.edu), Wikipedia, PMC, and other academic sources.
3. For each case, searched for both Camp A (affirm influence) and Camp B (deny/independent) sources.
4. Applied the existence-vs-degree test strictly: "scholars compare X and Y" (parallel) does NOT count; only "X historically influenced Y" counts.
5. All uncertain quotes flagged `[UNCERTAIN]`. The orchestrator will independently verify all URLs and quotes.

---

## Key Notes for QC

- **C3 (pragmatism → analytic):** This is the priority "first-fire" candidate. Both camps have live scholarly representation. The crux is whether the Rorty/Quine/neo-pragmatist reading constitutes an "influence" claim or a retrospective interpretation.
- **C2 (buddhist → phenomenology):** SEP Kyoto School entry confirms direction of influence is phenomenology → Kyoto School, NOT Buddhist philosophy → phenomenology. Camp B is effectively the dominant scholarly position. Camp A is thin.
- **C1 (Darwin → Mendel):** The scholarly landscape has shifted significantly since the prior NEI. Multiple PMC papers (2016, 2020, 2022) now argue Darwin DID influence Mendel's 1866 paper (though not his experiments). Camp B is correspondingly weakened, with the "independent" view reframed as "experiments were independent but paper was influenced." The prior NEI framing ("book ownership ≠ influence claim") may be outdated.
