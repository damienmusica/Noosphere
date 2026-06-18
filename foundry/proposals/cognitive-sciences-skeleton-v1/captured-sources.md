# Captured classification sources — cognitive-sciences skeleton v1

> Orchestrator pre-capture (session #21, 2026-06-18), decision (30) NS precedent +
> (34)⑥(a) skeleton order template. Cognitive science is an *interdisciplinary*
> domain with no single gate scheme, so four series were live-captured **before**
> generation and injected into the manifest as grounding. The generator must anchor
> every node's `source_hint` on captions present in this file —
> "captured baseline 2026-06-18". Live-captured, never label-matched.
> Reachability verified at session start: Wikidata 200 / OpenAlex 200 /
> id.loc.gov 303 (redirect, normal) / id.nlm.nih.gov MeSH SPARQL 200 / arrs.si 200.

## Gate scheme — LCC subclass BF (Psychology)

Source: `https://www.loc.gov/aba/cataloging/classification/lcco/lcco_b.pdf`
(LC Classification Outline, class B = Philosophy. Psychology. Religion; captured 2026-06-18).
Subclass BF and its major ranges:

### Subclass BF — Psychology — BF1-990
- BF1-990 Psychology (the discipline as a whole)
- BF38-64 Philosophy. Relation to other topics (psychology's general/philosophy/methodology)
- BF173-175.5 Psychoanalysis
- BF176-176.5 Psychological tests and testing (→ psychometrics)
- **BF180-198.7 Experimental psychology**
- **BF203 Gestalt psychology**
- BF207-209 Psychotropic drugs and other substances
- **BF231-299 Sensation. Aesthesiology** (sensation and perception)
- **BF309-499 Consciousness. Cognition** — *Including learning, attention, comprehension,
  memory, imagination, genius, intelligence, thought and thinking, psycholinguistics, mental fatigue*
- **BF501-505 Motivation**
- **BF511-593 Affection. Feeling. Emotion**
- **BF608-635 Will. Volition. Choice. Control**
- **BF636-637 Applied psychology**
- BF638-648 New Thought. Menticulture, etc. (non-academic)
- **BF660-685 Comparative psychology. Animal and human psychology**
- BF692-692.5 Psychology of sex
- **BF697-697.5 Differential psychology. Individuality. Self**
- **BF698-698.9 Personality**
- BF699-711 Genetic psychology
- **BF712-724.85 Developmental psychology** — *Including infant, child, adolescence, adulthood*
- BF725-727 Class psychology
- BF795-839 Temperament. Character
- BF839.8-885 Physiognomy. Phrenology (historical/non-academic)
- BF889-905 Graphology
- BF908-940 The hand. Palmistry (non-academic)

### Out-of-gate BF ranges (NOT cognitive-science discipline nodes — pseudoscience/occult)
- BF1001-1389 Parapsychology (psychic research, hallucinations/dreaming, hypnotism, telepathy, spiritualism)
- BF1404-2055 Occult sciences (ghosts, demonology, witchcraft, magic, astrology, divination, fortune-telling)

> Note: the cognitive-science gate is **BF1-990 Psychology proper**. Parapsychology/occult
> (BF1001+) are pseudoscience objects, not academic disciplines of cognitive science —
> exclude from the skeleton (cf. the medicine RV/RX/RZ alternative-systems handling; if any
> were ever modeled they would be `non_academic`, but they are not cognitive-science-owned).

## Contrast scheme — UDC 159.9 (Psychology)

Source: `https://udcsummary.info/php/index.php?tag=159.9&lang=en` (UDC Summary, captured 2026-06-18):
- **159.9 Psychology**
- 159.91 Psychophysiology (physiological psychology). Mental physiology
- 159.92 Mental development and capacity. Comparative psychology
- 159.93 Sensation. Sensory perception
- 159.94 Executive functions (159.942 Emotions/Affections/Feelings; 159.943 Conation and movement;
  159.944 Work and fatigue/Efficiency; 159.946 Special motor functions; 159.947 Volition. Will)
- 159.95 Higher mental processes
- 159.96 Special mental states and processes
- 159.97 Abnormal psychology
- 159.98 Applied psychology (psychotechnology) in general

## Contrast scheme — MeSH tree F (NLM, Psychiatry and Psychology)

Source: `https://id.nlm.nih.gov/mesh/sparql` (MeSH RDF, captured 2026-06-18). PhySH is absent
for cognitive science (NS-only discipline scheme); MeSH F is the discipline cross-check.
Four top categories + second level:

- **F01 Behavior and Behavior Mechanisms** — Adaptation (Psychological), Attitude, Behavior,
  Child Rearing, Defense Mechanisms, Emotions, Human Characteristics, Human Development,
  Mental Competency, Motivation, Neurobehavioral Manifestations, Personality, **Psychology, Social**,
  Psychosocial Functioning, Temperance
- **F02 Psychological Phenomena** — Mental Competency, Mental Health, **Mental Processes**,
  Parapsychology, Personal Autonomy, **Psycholinguistics**, Psychological Theory,
  **Psychology, Applied**, Psychomotor Performance, **Psychophysiology**, Religion and Psychology,
  Resilience, Social Theory
- **F03 Mental Disorders** — Anxiety/Mood/Personality/Psychotic/Neurodevelopmental/etc. disorders
  (*medicine home — F03 is the disease-object axis, not cognitive-science disciplines; §13 candidates only*)
- **F04 Behavioral Disciplines and Activities** — Behavior Control, **Behavioral Sciences**,
  Mental Health Services, Personality Assessment, Psychiatric Somatic Therapies, Psychoanalytic
  Interpretation, Psychological Techniques, Psychological Tests, **Psychotherapy**, Schizophrenic Psychology

## Contrast scheme — OECD FORD (Frascati)

Source: `https://www.arrs.si/en/gradivo/sifranti/sif-frascati.asp` (ARRS Frascati FORD, captured 2026-06-18):
- **5. Social Sciences → 5.1 Psychology and cognitive sciences** (live-captured label)
- 1.6 Biological sciences (neuroscience grounding — molecular/cellular)
- 3.1 Basic medicine (neuroscience grounding — clinical)

> **CAUTION (manifest note):** Psychology+cognitive science is FORD 5.1 — a **social science (5.x)**
> in Frascati. But LCC BF is an independent subclass and our model treats cognitive sciences as an
> **independent continent (Q147638)**. Skeleton hierarchy follows BF / Q147638, FORD is contrast only.
> Detailed Frascati sub-areas were not enumerated on the live page beyond the 5.1 label — recorded
> honestly, not filled from training knowledge (decision-log (9)).

## Wikidata Q147638 (cognitive science) — domain anchor structure

Source: `https://www.wikidata.org/wiki/Special:EntityData/Q147638.json` (captured 2026-06-18,
lastrevid 2504874185, modified 2026-06-12). Label "cognitive science", desc "interdisciplinary
scientific study of the mind and its processes".
- **P279 (subclass of):** psychology (Q9418) · philosophy of mind (Q23407) · linguistics (Q8162) ·
  anthropology (Q23404) · neuroscience (Q207011) — the classic interdisciplinary parentage hexagon.
- **P527 (has part):** artificial intelligence (Q11660) · epistemology (Q9471) · cognitive psychology
  (Q23373) · neurophysiology (Q660910) · cognitive linguistics (Q508969) · nonverbal communication (Q207125).

> The hexagon confirms the six-discipline structure: of these, **psychology + neuroscience are
> cognitive-science-owned** (this skeleton builds them); AI (CS), linguistics/cognitive-linguistics
> (humanities-residual), philosophy of mind/epistemology (philosophy), anthropology (SS) are owned by
> other continents — §13 / record-only per the boundary table below.

## Boundary pre-assignments + handoff (cognitive-science special discipline — mandatory generator input)

Strict-sequential round 3 (decision (43)①): later continents resolve interfaces against *existing*
cogsci nodes. Cognitive science **owns** only what the table marks "create node"; the rest is §13 or
record-only. On discovery, follow this table — do not negotiate.

| Item | Handling | Basis |
|---|---|---|
| **Psychology (all branches)** | **cogsci-owned — create nodes** | round-1 assignment "psychology = cognitive-sciences continent" (decision (29)). LCC BF gate. clinical/cognitive/developmental/social/biological/personality/comparative/experimental etc. |
| **Neuroscience** | **cogsci-owned — create node + §13** | round-1 assignment "neuroscience = cogsci". cognitive/behavioral-neuroscience = cogsci home; molecular/cellular = life-sciences QH/QP home (§13); clinical = medicine neurology home (§13). *Generation is cogsci; dual membership is §13.* |
| **psychiatry / neurology / clinical-neuroscience** | **do NOT create — medicine exists** | session #18 medicine skeleton already created `field:psychiatry` (Q7867), `field:neurology` (Q83042). cogsci does clinical-psychology↔psychiatry **§13/adjacent edges only**, no node re-creation. |
| **AI / machine-learning / computational** | **do NOT create — CS exists** | `subfield:artificial-intelligence` (Q11660), `subfield:machine-learning` (Q2539), `subfield:human-computer-interaction` (Q207434) exist in CS. computational-cognitive-science / cognitive-modeling = cogsci-owned + **§13 to CS**. |
| **philosophy-of-mind / philosophy-of-cognitive-science / philosophy-of-perception / philosophy-of-psychiatry** | **do NOT create — philosophy exists** | `subfield:philosophy-of-mind` (Q23407), `philosophy-of-perception` (Q3300457), `philosophy-of-psychiatry` (Q27333716) reviewed. `subfield:philosophy-of-cognitive-science` is **proposed·QID-less upstream gap** (PhilPapers slug). cogsci entry = **resolution trigger**: review §13 candidate on the philosophy-side node + promote if grounding mature (separate judgment, no forced promotion). |
| **linguistics / psycholinguistics / neurolinguistics / cognitive-linguistics** | **do NOT create — humanities-residual owns (later)** | round-1 assignment "linguistics = humanities-residual". cogsci does **not** build a linguistics wing — humanities-residual (hum-A, next round) builds linguistics core + a cognitive wing and §13s to existing cogsci fields *then*. On discovery: **record only**. |
| **cognitive-science core (cognition·perception·attention·memory·reasoning·decision-making)** | **cogsci-owned — create nodes (as disciplines, not level-3 concepts)** | Q147638 home. These map to disciplines: cognition/attention/memory/reasoning → cognitive-psychology; perception → sensation-and-perception; judgment/decision-making → §12 overlap test vs `subfield:decision-theory` (Q177571, humanities — different referent: psychological JDM vs formal decision theory). |
| **HCI / cognitive-ergonomics** | **§12 case-by-case** | HCI exists in CS (`subfield:human-computer-interaction` Q207434) — do NOT recreate. cognitive-ergonomics: gate-scheme home judgment; if cognitive-side, §13. |
| **anthropology / cognitive-anthropology** | **do NOT create — SS owns** | `field:anthropology` (Q23404), `subfield:cultural-anthropology`, `subfield:physical-anthropology` (proposed) in SS. cognitive-anthropology = record only / §13 candidate. |

### Existing /data nodes to reconcile against (NEVER re-propose — reconcile to these IDs)
- `domain:cognitive-sciences` (Q147638, reviewed) — the parent; this skeleton fills its children.
- CS: `subfield:artificial-intelligence` (Q11660), `subfield:machine-learning` (Q2539),
  `subfield:human-computer-interaction` (Q207434) — all reviewed.
- Humanities: `subfield:philosophy-of-mind` (Q23407), `subfield:philosophy-of-perception` (Q3300457),
  `subfield:philosophy-of-psychiatry` (Q27333716), `subfield:decision-theory` (Q177571) reviewed;
  `subfield:philosophy-of-cognitive-science` (QID-less, **proposed** — resolution trigger).
- Medicine: `field:psychiatry` (Q7867), `field:neurology` (Q83042), `subfield:neurosurgery` (Q188449).
- SS: `field:anthropology` (Q23404), `subfield:cultural-anthropology` (Q28598),
  `subfield:physical-anthropology` (Q27172, proposed).
- Life sciences: `subfield:developmental-biology` (Q213713) — distinct from developmental psychology.

### living-person strict (special discipline)
The skeleton is *discipline* nodes (field/subfield) only — person nodes are out of round scope.
Cognitive science / psychology are dense with living researchers; NO clinician/researcher person nodes.

### Tension preservation (decision (42)① — immediate effect, round-3 binding)
Cognitive science is rich in **competing paradigms** (behaviorism↔cognitivism, symbolism↔connectionism,
nature↔nurture, modularity↔embodied cognition). The A skeleton is part_of-primary, but if a proposition-edge
(critiques / influenced) arises naturally: preserve opposing/minority views (`disputed:true` + note +
co-existing edges), correct only identity/referent-axis errors, never delete or unify. The *first
proposition-edge PR* carries the docs/data-foundry.md tension-preservation codification (policy ahead of work).
If no proposition-edge arises, codification defers to the editorial-relation stage. (42)② measurement ledger:
log paradox / perspective-qualified cases not expressible via disputed+note (new fields 0 — measure only).
