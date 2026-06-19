# formal-founders-wave2-v1 — QC report (orchestrator, session #31)

> Pipeline = Lane B mirror, node+edge two-stage. Generation = Sonnet subagent (separate context,
> ADR 0007). QC = orchestrator (this report), live network. **Wave-2 = `founded_or_formalized`
> ladder-earning measurement wave**: deliberately mixes genuine founders (expand N) + rejection
> probes (exercise open-criterion (ii), the cell wave-1 left empty). Contract = vault
> `founder-node-gate-design.md` (decisions (57)/(58)); wave-1 = `formal-founders-v1` (#30).

## Stage 2 — Node QC: QID full resolver-verification (multi-signal), all 15 persons

Every generated QID is an **untrusted hint** (memory: generated-QID hallucination ~88–93%). Each
was re-verified live against Wikidata: `wbsearchentities` to resolve the name, then `wbgetentities`
for **P31 (instance of) = Q5 (human)**, **P570 (date of death) present (= deceased)**, and label /
enwiki sitelink match.

### Genuine founders (W1–W12) — written to /data

| # | Person | Generated QID | Generated QID resolves to | Verdict | Corrected QID | P31 | b–d | living? |
|---|---|---|---|---|---|---|---|---|
| W1 | Oskar Morgenstern | Q77791 | "Bodo Hombach" | ✗ HALLUCINATED | **Q94028** | Q5 ✓ | 1902–1977 | false ✓ |
| W2 | Richard Dedekind | Q76489 | "fencing at the 1896 Olympics" | ✗ HALLUCINATED | **Q76556** | Q5 ✓ | 1831–1916 | false ✓ |
| W3 | Alonzo Church | Q110894 | "Paul Binder" | ✗ HALLUCINATED | **Q92741** | Q5 ✓ | 1903–1995 | false ✓ |
| W4 | David Hilbert | Q48641 | "polysynthetic language" | ✗ HALLUCINATED | **Q41585** | Q5 ✓ | 1862–1943 | false ✓ |
| W5 | Carl Friedrich Gauss | Q6722 | "Carl Friedrich Gauss" | ✓ CORRECT | Q6722 | Q5 ✓ | 1777–1855 | false ✓ |
| W6 | Henri Poincaré | Q169428 | "Meet Baluyev!" (film) | ✗ HALLUCINATED | **Q81082** | Q5 ✓ | 1854–1912 | false ✓ |
| W7 | Emmy Noether | Q17099 | "Kari Ylianttila" | ✗ HALLUCINATED | **Q7099** | Q5 ✓ | 1882–1935 | false ✓ |
| W8 | Norbert Wiener | Q128952 | "solar facula" | ✗ HALLUCINATED | **Q178577** | Q5 ✓ | 1894–1964 | false ✓ |
| W9 | Ronald Fisher | Q216723 | "Ronald Fisher" | ✓ CORRECT | Q216723 | Q5 ✓ | 1890–1962 | false ✓ |
| W10 | Karl Pearson | Q179910 | "Võ Nguyên Giáp" | ✗ HALLUCINATED | **Q310794** | Q5 ✓ | 1857–1936 | false ✓ |
| W11 | Isaac Newton | Q935 | "Isaac Newton" | ✓ CORRECT | Q935 | Q5 ✓ | 1642–1727 | false ✓ |
| W12 | Gottfried W. Leibniz | Q9047 | "Gottfried Wilhelm Leibniz" | ✓ CORRECT | Q9047 | Q5 ✓ | 1646–1716 | false ✓ |

- **Generated-QID hallucination (genuine): 8/12 = 66.7%** (correct: Gauss, Fisher, Newton, Leibniz —
  the most encyclopedically prominent). **All 8 caught and corrected** by live multi-signal
  verification before any node entered `/data`. Re-confirms the ~88–93% prior and the node gate's
  core safety device. All 12 resolve to the correct human at search rank 1 (golden-set
  `rank1_expected: true`).
- **is_living_person = false** confirmed for all 12 by a present P570 death date (pilot remains
  deceased-only by design). **No living-person node arose → the §A5 stop/escalate point did NOT
  fire.**
- **Promotion:** all 12 → `reviewed` under node promotion policy v1 (person-extension, CPO-ratified
  (58)): QID resolver-verified + is_living_person live-confirmed-false. `indexable:false`,
  `academic_status` omitted (contract §A3), `level:2`, `domain:formal_sciences`.

### Probe-only persons (P1/P4/P5) — QID-verified, NOT written to /data

The rejection probes test the **edge attribution**, not node existence. To prove the rejection is
attribution-based (not a node artifact), the probe persons' QIDs were live-verified — they are all
real deceased humans — but the nodes are **not written to /data** (a rejected edge would leave an
orphan person node violating keep-criteria §A2).

| Probe person | Generated QID | resolves to | Real QID (verified) | Real human, deceased? |
|---|---|---|---|---|
| Euclid | Q8016 | "Winston Churchill" | **Q8747** (mathematician) | Q5 ✓, fl. ~300 BC ✓ |
| Aristotle | Q868 | "Aristotle" ✓ | Q868 | Q5 ✓, 384–322 BC ✓ |
| Pythagoras | Q10261 | "Pythagoras" ✓ | Q10261 | Q5 ✓, ~570–495 BC ✓ |

(P2 Shannon uses the existing `/data` node `person:claude-shannon`; P3 Gauss uses the genuine W5
node `person:carl-friedrich-gauss` — both real, the *edge* is the probe.)

## Stage 3 — Founder edge QC: independent live grounding + adversarial rejection

Generation evidence-hint layer treated as **unreliable** (claim_anchors are training-recall
paraphrases — wave-1/2 precedent). Every genuine edge independently grounded: **≥2 distinct
independent claim-stating sources, live-fetched (HTTP 200), claim-anchor extracted verbatim from
the live page**. Adversarial perspective-diverse checks framed as "refute this founding
attribution": **direction** (person→field), **referent** (right person QID + right target node),
**plural-founding vs mis-attribution**, **over-broad / anachronism**.

### Genuine edges (W1–W12) — all SUPPORTED, written proposed-first

| Edge | Target (existing reviewed) | Sources (distinct, live 200) | Verdict | conf |
|---|---|---|---|---|
| W1 Morgenstern | subfield:game-theory | SEP + Wikipedia | supported | 0.95 |
| W2 Dedekind | subfield:set-theory | Wikipedia + SEP | supported | 0.88 |
| W3 Church | subfield:computability-theory | Wikipedia + SEP | supported | 0.93 |
| W4 Hilbert | subfield:proof-theory | MacTutor + SEP | supported | 0.88 |
| W5 Gauss | subfield:number-theory | Wikipedia + MacTutor | supported | 0.93 |
| W6 Poincaré | subfield:algebraic-topology | MacTutor + Wikipedia | supported | 0.96 |
| W7 Noether | subfield:algebra | MacTutor + Wikipedia | supported | 0.85 |
| W8 Wiener | subfield:cybernetics | MacTutor + Wikipedia | supported | 0.97 |
| W9 Fisher | subfield:mathematical-statistics | Wikipedia + MacTutor | supported | 0.92 |
| W10 Pearson | subfield:mathematical-statistics | MacTutor + Wikipedia | supported | 0.93 |
| W11 Newton | subfield:calculus | MacTutor + Wikipedia | supported | 0.95 |
| W12 Leibniz | subfield:calculus | MacTutor + Wikipedia | supported | 0.95 |

**Verbatim live claim-anchors (representative, per edge):**
- **W1 Morgenstern** — SEP Game Theory: *"Game theory … was given its first general mathematical
  formulation by John von Neumann and Oskar Morgenstern (1944)."* / Wikipedia Game theory: *"Von
  Neumann's work in game theory culminated in his 1944 book Theory of Games and Economic Behavior,
  co-authored with Oskar Morgenstern."*
- **W2 Dedekind** — Wikipedia Set theory: *"The modern study of set theory was initiated by the
  German mathematicians Richard Dedekind and Georg Cantor in the 1870s."* / SEP Dedekind §2.3:
  *"Dedekind is also among the first to consider, not just sets of numbers, but sets of other kinds
  of objects as well."*
- **W3 Church** — Wikipedia Computability theory: *"Computability theory originated in the 1930s,
  with the work of Kurt Gödel, Alonzo Church, … Alan Turing, Stephen Kleene, and Emil Post."* / SEP
  Church-Turing: *"the concept of a λ-definable function was due to Church and Kleene."*
- **W4 Hilbert** — MacTutor: the Grundlagen der Mathematik volumes *"were intended to lead to a
  'proof theory', a direct check for the consistency of mathematics."* / SEP Development of Proof
  Theory: *"Hilbert's book Grundlagen der Geometrie of 1899 set the stage for the central
  foundational problems of mathematics of the early decades of the 20th century."*
- **W5 Gauss** — Wikipedia Number theory: *"Carl Friedrich Gauss (1777–1855) wrote Disquisitiones
  Arithmeticae (1801), which had an immense influence in the area of number theory and set its
  agenda for much of the 19th century."* / MacTutor: *"He published the book Disquisitiones
  Arithmeticae … in the summer of 1801."*
- **W6 Poincaré** — MacTutor: *"He can be said to have been the originator of algebraic topology."*
  / Wikipedia Henri Poincaré: *"Poincaré is regarded as the creator of the field of algebraic
  topology."*
- **W7 Noether** — MacTutor: 'Idealtheorie in Ringbereichen' (1921) *"was of fundamental importance
  in the development of modern algebra."* / Wikipedia: *"a German mathematician who made many
  important contributions to abstract algebra."*
- **W8 Wiener** — MacTutor (Wiener's own words): *"… ultimately to found the discipline of
  cybernetics."* / Wikipedia Cybernetics: *"the word cybernetics was coined by a research group
  involving himself and Arturo Rosenblueth in the summer of 1947."*
- **W9 Fisher** — Wikipedia: *"a genius who almost single-handedly created the foundations for
  modern statistical science"*; *"as the founder of modern statistics, Fisher made countless
  contributions."* / MacTutor: documents his founding statistical work.
- **W10 Pearson** — MacTutor: *"Pearson is known as one of the founders of statistics."* /
  Wikipedia: *"He has been credited with establishing the discipline of mathematical statistics."*
- **W11 Newton** — MacTutor: *"He laid the foundation for differential and integral calculus … several
  years before its independent discovery by Leibniz."* / Wikipedia History of calculus:
  *"Infinitesimal calculus was developed in the late 17th century by Isaac Newton and Gottfried
  Wilhelm Leibniz independently of each other."*
- **W12 Leibniz** — MacTutor: *"… Leibniz developed the basic features of his version of the
  calculus."* / Wikipedia History of calculus (same independent-founding sentence as W11).

### ★ Rejection probes (P1–P5) — ALL 5 correctly REJECTED (open-criterion (ii) fired)

This is the cell wave-1 never exercised. Each probe was a deliberate false / mis-attributed /
over-broad / anachronistic founding. The pipeline rejected all five, grounded in the **existing
supported foundings of the same target nodes**:

| Probe | Attribution | Rejection class | Grounded against | Verdict |
|---|---|---|---|---|
| P1 | Euclid → set-theory | **anachronism** | set theory begins with Cantor & Dedekind, 1870s (Euclid fl. ~300 BC, ~2200 yr earlier) | **reject** |
| P2 | Shannon → game-theory | **field mis-attribution** | game theory founded by von Neumann / Morgenstern / Nash; Shannon founded information-theory (wave-1 supported) | **reject** |
| P3 | Gauss → probability-theory | **contribution ≠ founding + wrong field** | probability theory axiomatized/founded by Kolmogorov (wave-1 supported); Gauss gave the Gaussian distribution (a tool) and genuinely founds number-theory (W5) | **reject** |
| P4 | Aristotle → mathematical-logic | **over-broad / referent** | Aristotle founded ancient *term/syllogistic* logic; *mathematical/symbolic* logic was founded by Boole & Frege (wave-1 supported). Right person for "logic" broadly, wrong target node | **reject** |
| P5 | Pythagoras → number-theory | **legendary attribution** | Pythagorean triples are Babylonian (predate Pythagoras); Pythagoreans attributed *mystical* qualities to numbers; modern number theory founded by Gauss (W5). Historical Pythagoras barely documented | **reject** |

**Same-target genuine↔probe discrimination — the cleanest (ii) demonstration.** On four target
nodes the pipeline kept the genuine founder edge and rejected the probe on the *same* target,
isolating attribution-quality from node-existence:
- `number-theory`: Gauss (W5, supported) **∥** Pythagoras (P5, rejected).
- `game-theory`: von Neumann + Nash + Morgenstern (supported) **∥** Shannon (P2, rejected).
- `set-theory`: Cantor + Dedekind (supported) **∥** Euclid (P1, rejected).
- `mathematical-logic`: Boole + Frege (supported) **∥** Aristotle (P4, rejected).

**Adversarial findings (genuine edges):**
- **Direction:** all 12 person→field; no reversed edges.
- **Referent:** all 12 person QIDs corrected & verified (Stage 2); all 12 targets confirmed existing
  reviewed formal-science nodes (`subfield:game-theory`, `set-theory`, `computability-theory`,
  `proof-theory`, `number-theory`, `algebraic-topology`, `algebra`, `cybernetics`,
  `mathematical-statistics` ×2, `calculus` ×2 — all present and `reviewed` in /data).
- **Plural / layered founding preserved (record-not-resolve, NOT `disputed`) — 5 sets:**
  - `game-theory`: von Neumann + Nash (existing) + **Morgenstern** (W1) — Morgenstern is the true
    1944 co-author flagged in wave-1.
  - `set-theory`: Cantor (existing) + **Dedekind** (W2) — Wikipedia: "initiated by … Dedekind and
    Cantor".
  - `computability-theory`: Turing (existing) + **Church** (W3) — Church–Turing thesis.
  - `mathematical-statistics`: **Fisher** (W9) + **Pearson** (W10) — co-founders.
  - `calculus`: **Newton** (W11) + **Leibniz** (W12) — documented dual independent founding; the
    priority controversy is historical record, not adjudicated.
- **No `disputed:true` arose** — founder attributions are documented facts, not interpretive
  disputes (re-confirms the (d)→(a) thesis across wave-1/wave-2/(a)-pilot: genuine dispute
  concentrates in (a)-relations).
- **Terminological nuance (sourced, not doubted):** W7 Noether → `subfield:algebra` confidence
  moderated to 0.85 — she founded *modern/abstract* algebra and the target is the broader algebra
  node (parallel to wave-1 Boole → mathematical-logic 0.85). W2 Dedekind 0.88 (Cantor primary,
  Dedekind co-initiator). W4 Hilbert 0.88 (Gentzen later central to structural proof theory).

## Edge claim-level hallucination

**0/12.** Every genuine founding attribution is confirmed by ≥2 independent live claim-stating
sources; no edge asserted a founding the live sources do not support. Generated claim_anchors were
training-recall paraphrases (replaced wholesale by live verbatim anchors) but none asserted a
*false* founding for a genuine edge.

## Evidence permanence (§8) — Wayback snapshots

See `spn-results.md`. SPN attempted for all distinct cited URLs at QC time; the availability API
returned empty for all (known flake — wave-1 precedent), so the Save-Page-Now 302-Location harvest
was used. Live anchors were all verified at HTTP 200 at QC time regardless of snapshot outcome;
[SPN-FAILED] entries recorded honestly (wave-2 `formalizes` precedent).

## Outcome

- **Nodes: 12/12 reviewed** (QID-verified, deceased, indexable:false). Probe-only nodes (3): NOT
  written to /data.
- **Edges: 12/12 supported, written proposed-first.** **5/5 rejection probes correctly rejected
  (NOT written to /data).**
- Generated-QID hallucination 8/12 caught; edge claim-hallucination 0/12; genuine edge precision
  12/12 = 1.0.
- **`founded_or_formalized` ladder NOT opened this session** (own gate; opening is a CPO decision).
  See `report.md` for the open-criteria assessment and the CTO opening recommendation.
