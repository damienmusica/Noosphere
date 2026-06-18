# formal-founders-v1 — QC report (orchestrator, session #30)

> Pipeline = Lane B mirror, node+edge two-stage. Generation = Sonnet subagent (separate context,
> ADR 0007). QC = orchestrator (this report), live network. CPO-ratified contract = vault
> `founder-node-gate-design.md` (decision (57)/(58)). Build proceeded after CPO ratification.

## Stage 2 — Node QC: QID full resolver-verification (multi-signal)

Every generated QID is an **untrusted hint** (memory: generated-QID hallucination ~93%). Each was
re-verified live against Wikidata: `wbsearchentities` to resolve the name, then `wbgetentities`
for **P31 (instance of) = Q5 (human)**, **P570 (date of death) present (= deceased)**, and label /
enwiki sitelink match.

| # | Person | Generated QID | Generated QID resolves to | Verdict | Corrected QID | P31 | b–d | is_living_person |
|---|---|---|---|---|---|---|---|---|
| 1 | Georg Cantor | Q93176 | (missing entity) | ✗ HALLUCINATED | **Q76420** | Q5 ✓ | 1845–1918 | false ✓ |
| 2 | Andrey Kolmogorov | Q192938 | "Battle of the Granicus" | ✗ HALLUCINATED | **Q153224** | Q5 ✓ | 1903–1987 | false ✓ |
| 3 | Claude Shannon | Q9068 | "Voltaire" | ✗ HALLUCINATED | **Q92760** | Q5 ✓ | 1916–2001 | false ✓ |
| 4 | George Boole | Q167950 | "Tullebølle Parish" | ✗ HALLUCINATED | **Q134661** | Q5 ✓ | 1815–1864 | false ✓ |
| 5 | Gottlob Frege | Q41135 | "Ming tombs" | ✗ HALLUCINATED | **Q60028** | Q5 ✓ | 1848–1925 | false ✓ |
| 6 | Alan Turing | Q7251 | "Alan Turing" | ✓ CORRECT | Q7251 | Q5 ✓ | 1912–1954 | false ✓ |
| 7 | John von Neumann | Q46661 | "Vedelago" | ✗ HALLUCINATED | **Q17455** | Q5 ✓ | 1903–1957 | false ✓ |
| 8 | John Nash | Q184462 | "Croesus" | ✗ HALLUCINATED | **Q128736** | Q5 ✓ | 1928–2015 | false ✓ |

- **Generated-QID hallucination: 7/8 = 87.5%** (only Turing correct) — re-confirms the ~93% prior
  (decision-log (2)). **All 7 caught and corrected** by live multi-signal verification before any
  node entered `/data`. This is the node gate's core safety device working exactly as designed.
- **is_living_person = false** confirmed for all 8 by a present P570 death date (1st pilot is
  deliberately deceased-only; living-person policy untested by design).
- **Promotion:** all 8 nodes → `reviewed` under node promotion policy v1 (person-extension,
  CPO-ratified): QID resolver-verified + is_living_person live-confirmed-false. `indexable:false`
  (editorial summary deferred — public surface unchanged; contract §A3).
- `academic_status` **omitted** on all person nodes (discipline-only property; deceased/living is
  carried by `is_living_person` — contract §A3, CTO recommendation ratified).

## Stage 3 — Founder edge QC: independent live grounding + adversarial

Generation evidence-hint layer treated as **unreliable** (claim_anchors were training-recall
paraphrases — wave-1/2 precedent). Every edge independently grounded: **≥2 distinct independent
claim-stating sources, live-fetched** (HTTP 200), claim-anchor extracted verbatim from the live
page. Adversarial perspective-diverse checks: **direction** (person→field), **referent** (right
person QID + right target node), **plural-founding vs mis-attribution**.

| Edge | Target (existing reviewed) | Sources (distinct) | Verdict | conf |
|---|---|---|---|---|
| F1 Cantor | subfield:set-theory | SEP + Wikipedia | supported | 0.98 |
| F2 Kolmogorov | subfield:probability-theory | SEP + MacTutor | supported | 0.96 |
| F3 Shannon | subfield:information-theory | MacTutor + SEP | supported | 0.98 |
| F4 Boole | subfield:mathematical-logic | SEP + MacTutor | supported | 0.85 |
| F5 Frege | subfield:mathematical-logic | MacTutor + SEP | supported | 0.96 |
| F6 Turing | subfield:computability-theory | SEP + MacTutor | supported | 0.95 |
| F7 von Neumann | subfield:game-theory | SEP + MacTutor | supported | 0.96 |
| F8 Nash | subfield:game-theory | MacTutor + SEP | supported | 0.90 |

**Verbatim live claim-anchors (representative, per edge):**

- **F1 Cantor** — SEP Set Theory: *"Set theory, as a separate mathematical discipline, begins in the
  work of Georg Cantor."* / Wikipedia: *"Cantor's work between 1874 and 1884 is the origin of set
  theory."*
- **F2 Kolmogorov** — SEP Probability Interpretations: *"Its axiomatization had to wait still longer,
  in Kolmogorov's classic Foundations of the Theory of Probability (1933)."* / MacTutor: 1933
  monograph *"built up probability theory in a rigorous way from fundamental axioms in a way
  comparable with Euclid's treatment of geometry."*
- **F3 Shannon** — MacTutor: *"This paper founded the subject of information theory…"* / SEP
  Information: optimal-coding theory *"was already established long before Shannon developed its
  mathematical foundation (Shannon 1948…)."*
- **F4 Boole** — SEP Boole: *"George Boole (1815–1864) was an English mathematician and a founder of
  the algebraic tradition in logic."* / MacTutor: *"…Laws of Thought, on Which are founded the
  Mathematical Theories of Logic and Probabilities."*
- **F5 Frege** — MacTutor: *"Frege was one of the founders of modern symbolic logic…"* / SEP Frege:
  *"Frege essentially reconceived the discipline of logic by constructing a formal system which, in
  effect, constituted the first 'predicate calculus'."*
- **F6 Turing** — SEP Turing Machine: *"Turing's 'automatic machines', as he termed them in 1936,
  were specifically devised for the computation of real numbers."* / MacTutor: *"Turing introduced an
  abstract machine, now called a 'Turing machine'…"*
- **F7 von Neumann** — SEP Game Theory: *"Game theory … was given its first general mathematical
  formulation by John von Neumann and Oskar Morgenstern (1944)."* / MacTutor: theory of games is
  *"one of his most original creations."*
- **F8 Nash** — MacTutor: *"During this period Nash established the mathematical principles of game
  theory."* / SEP Game Theory: read the 1944 breakthrough *"with classic papers of John Nash (1950a,
  1950b, 1951)."*

**Adversarial findings:**
- **Direction:** all 8 person→field; no reversed edges.
- **Referent:** all person QIDs corrected & verified (Stage 2); all targets are confirmed existing
  reviewed formal-science nodes (cleared earlier by qid-adversarial-audit-fs-v1).
- **Plural / layered founding correctly preserved (record-not-resolve, not `disputed`):**
  - `mathematical-logic`: **Boole ∥ Frege** — documented co-founding strands (algebraic vs
    predicate logic). Both supported, co-existing edges. F4 confidence lowered (0.85) for the
    algebraic-logic-vs-mathematical-logic terminological nuance — sourced, not doubted.
  - `game-theory`: **von Neumann (with Morgenstern, 1944) + Nash (non-cooperative, 1950)** — layered
    founding. The generation flagged (correctly) that the true 1944 co-founder is **Oskar
    Morgenstern, not Nash**; recorded in the note as a future cross-domain founder-node candidate.
    Nash's is a genuine foundational formalization (Nash equilibrium) → supported, not a
    mis-attribution.
  - `set-theory`: Cantor primary; **Dedekind** co-credited (SEP early-set-theory quotes Zermelo
    "created by Cantor and Dedekind") → noted as a future founder-node candidate.
- **No `disputed:true` arose** — founder attributions are documented facts, not interpretive
  disputes. Consistent with the (d)→(a) thesis (genuine dispute concentrates in (a)-relations;
  re-confirmed across wave-1/wave-2/(a)-pilot).
- **Mis-attribution rejection NOT exercised** (honest limitation): the 8 candidates were
  hand-scoped to clean foundings, so no *false founding attribution* was present to reject at the
  edge level. The strong referent-axis measurement this batch provides is the **node-level
  QID-hallucination catch (7/8)**. A future broader/riskier wave is needed to exercise edge-level
  mis-attribution rejection (open-criterion (ii)).

## Evidence permanence (§8) — Wayback snapshots

**16/16 snapshots captured, 0 [SPN-FAILED].** MacTutor (7) + Wikipedia (1) via existing snapshots;
SEP (8 — 7 distinct entries, game-theory shared by F7/F8) via the Save-Page-Now **302 Location
harvest** (availability API returned empty for recent SEP saves; the save endpoint's 302 Location
yields a valid `web/<14-digit>/` snapshot). Snapshot URLs recorded in `report.md`.

## Outcome

- **Nodes: 8/8 reviewed** (QID-verified, deceased, indexable:false).
- **Edges: 8/8 supported, written proposed-first.** `founded_or_formalized` ladder NOT opened
  (new relation class, own gate — see report.md measurement & open-criteria).
- Generated-QID hallucination 7/8 caught; edge claim-hallucination 0/8; edge precision 8/8 = 1.0.
