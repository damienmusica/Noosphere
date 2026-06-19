# founder-wave3-v1 — Stage 0 scoping (orchestrator)

> Session #33, round 4 Lane B. **Person wave 3 — non-formal-science founders + first
> living-person policy validation.** CPO-ratified scope (this session): full set = 11 deceased
> non-FS founders + 2 living founders. The `founded_or_formalized` auto-`reviewed` ladder is now
> **open** (decisions (60)/(61)) — so this is NOT a ladder-earning measurement; it is (A) corpus
> growth that auto-promotes supported deceased-founder edges and (B) the first exercise of the
> **living-founder guard** codified in decision (61).

## Design (2-part, mirror of wave-2 pipeline)

- **Bucket A — deceased non-FS founders (11):** genuine founders of existing `reviewed`
  field/subfield nodes, each deceased. Supported edges auto-promote `proposed → reviewed` under
  the open ladder. Cross-domain (life / natural / social / cognitive / humanities).
- **Bucket B — living founders (2): ★ the living-person policy test.** Genuine living founders of
  existing `reviewed` nodes. Per the guard: a living-person node does NOT auto-`reviewed` (node
  policy v1 — CPO review required, charter stricter evidence + conservative wording); and since the
  founder endpoint is then not `reviewed`, the edge cannot auto-promote either (double-enforced).
  These candidates are expected to **HALT at the CPO stop-point** — that halt IS the validation.

No dedicated rejection probes (the ladder is already earned; rejection muscle proven 5× in wave-2).

## Bucket A — deceased non-FS founders (11)

| candidate | person id | → target (reviewed) | domain | notes |
|---|---|---|---|---|
| A1 | person:charles-darwin | subfield:evolutionary-biology | life_sciences | clean |
| A2 | person:gregor-mendel | subfield:genetics | life_sciences | clean (father of genetics) |
| A3 | person:louis-pasteur | subfield:microbiology | life_sciences | plural (co-founder w/ Koch — record-not-resolve note) |
| A4 | person:antoine-lavoisier | field:chemistry | natural_sciences | ⚠ referent-watch: "modern chemistry" / chemical revolution vs chemistry-broad — QC frame as *helped found modern chemistry* |
| A5 | person:auguste-comte | field:sociology | social_sciences | plural/layered cluster (coined "sociology") |
| A6 | person:emile-durkheim | field:sociology | social_sciences | plural/layered cluster (first sociology dept / methodology) |
| A7 | person:max-weber | field:sociology | social_sciences | plural/layered cluster (interpretive sociology) |
| A8 | person:adam-smith | field:economics | social_sciences | clean (father of economics) |
| A9 | person:franz-boas | subfield:cultural-anthropology | social_sciences | clean (father of American/cultural anthropology) |
| A10 | person:wilhelm-wundt | subfield:experimental-psychology | cognitive_sciences | clean (father of experimental psychology) |
| A11 | person:ferdinand-de-saussure | subfield:semiotics | humanities | ⚠ referent-watch: semiotics/semiology founding is cleaner than "linguistics" (which predates him); target = semiotics |

**Plural/layered clusters (record-not-resolve, not disputed):** sociology (Comte + Durkheim + Weber,
a 3-way mirror of the game-theory cluster); microbiology (Pasteur + Koch — Koch not in scope, noted).

## Bucket B — living founders (2) ★ stop-point test

| candidate | person id | → target (reviewed) | domain | expected |
|---|---|---|---|---|
| B1 | person:martin-seligman | subfield:positive-psychology | cognitive_sciences | living (b.1942) → node not auto-`reviewed`; edge cannot auto-promote; HALT at CPO |
| B2 | person:vint-cerf | subfield:computer-networks | computer_and_information_sciences | living (b.1943; co-founder w/ Bob Kahn, also living) → same HALT |

## Pipeline (mirror wave-2)

1. **Stage 1 — Sonnet generation (separate context, ADR 0007):** 13 person nodes + 13
   `founded_or_formalized` edges as `generated`-tier proposals (QID hints + `is_living_person` best
   guess + ≥2 candidate claim-stating sources per edge + rationale/uncertainty/ambiguous). The
   generator's QID hints and claim_anchors are untrusted — they are the hallucination measurement.
2. **Stage 2 — orchestrator full QID resolver-verification (live, multi-signal):** P31=Q5 human +
   birth P569 / death P570 + label/sitelink. **Confirms deceased (P570 present) vs living (P570
   absent).** Deceased+verified → node `reviewed` (node policy v1 person-extension). **Living+verified
   → node HELD (stop-point), not auto-`reviewed`.**
3. **Stage 3 — edge grounding + adversarial QC (live):** ≥2 distinct independent claim-stating live
   sources per edge (SEP / MacTutor / Wikipedia / Britannica where live), direction person→field,
   referent, plural-vs-misattribution. Verdict {supported / disputed / NEI}.
4. **Stage 4 — measurement + write-in:** deceased supported edges auto-promote `reviewed` under the
   open ladder; living candidates HALT at the CPO stop-point (handling — foundry-hold vs /data
   proposed — decided at the gate, not pre-committed). Full provenance retained.

## Measurement outputs

Deceased precision (supported/total) + claim-level hallucination rate + plural-founding preservation
(sociology 3-cluster, microbiology) + **living-guard firing 2/2** + generator QID-hallucination rate
(prior ~66–93%). Schema unchanged; 12-type taxonomy unchanged.
