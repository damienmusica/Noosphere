# person-wave4-v1 — QC report (orchestrator)

> Session #39, round 4 Lane B, decision (70), 2026-06-30. Living-person handling **v2 first
> execution**. Generation/QC context-separated (ADR 0007): separated-context Sonnet generated the
> candidates (untrusted QID hints + claim-anchors); this orchestrator did all live verification.

## Stage 2 — node QID resolver-verification (live, multi-signal)

Resolved each candidate by Wikidata label search (`wbsearchentities`) → `EntityData` multi-signal
check (P31=Q5 + P569 birth + **P570 death present/absent** + label/sitelink cross-check). Live-fetched
2026-06-30; **never from memory** (the generator's hints are the hallucination measurement).

| candidate | generator hint | hint resolves to | **verified QID** | P31 | birth | death (P570) | status |
|---|---|---|---|---|---|---|---|
| Karl Marx | Q9061 | Karl Marx | **Q9061** ✓ | Q5 | 1818-05-05 | 1883-03-14 | deceased |
| Robert Koch | Q37327 | *Samuel Beckett* | **Q37193** | Q5 | 1843-12-11 | 1910-05-27 | deceased |
| Charles Sanders Peirce | Q212646 | *Hoffmann-La Roche* | **Q187520** | Q5 | 1839-09-10 | 1914-04-19 | deceased |
| Alfred Russel Wallace | Q160402 | *"perception"* | **Q160627** | Q5 | 1823-01-08 | 1913-11-07 | deceased |
| William Labov | Q378087 | *Adršpach (Czech village)* | **Q357923** | Q5 | 1927-12-04 | **2024-12-17** | **deceased** |
| George Lakoff | Q315042 | *Alamada (PH municipality)* | **Q313772** | Q5 | 1941-05-24 | absent | **living** |
| Vint Cerf | Q92785 | *Hip Flask (comic character)* | **Q92743** | Q5 | 1943-06-23 | absent | **living** |
| Internet | Q75 | Internet | **Q75** ✓ | (Q75 = "global system of connected computer networks based on IP addressing and routing protocols") | — | — | concept |

**Generator QID hallucination = 6/8 = 75%** (consistent with the ~85–93% prior, decisions (51)/(53)/
(58)/(59)); only Marx Q9061 + Internet Q75 correct. **All 6 hallucinations caught and corrected** by
live multi-signal verification — every wrong hint pointed at an unrelated entity (a playwright, a pharma
company, an abstract noun, a village, a municipality, a comic character), so the label/P31 cross-check
caught them unambiguously. Identity referent confirmed for every candidate by label + description +
birth/death years + sitelink count.

### ★ Observe-only living/deceased self-correction (v2 §3) — fired on Labov
The scope assumed **Labov living** (b.1927). Live P570 verification returned **2024-12-17** — Labov
**died** since the policy was drafted. This is precisely the case v2 §3 anticipates:
- **Observed, not predicted** — no age-based inference; P570 read live at QC time.
- **Drift is safe-direction** — living → deceased = stricter → looser. Had we mis-assumed living we'd
  merely have been *more* careful than needed (harm 0). Observing routes him to the lighter deceased path.
- **Effect:** Labov recorded `is_living_person:false`, rides the **deceased founder ladder**; corroborated
  by the Wikipedia obituary line ("Labov died at his home in Philadelphia on December 17, 2024").
- **Measurement effect:** living N = Lakoff + Cerf = **2** (not 3); deceased = **5**.

## Stage 3 — edge grounding + adversarial perspective-diverse QC + clause-6 v2

≥2 independent claim-stating live sources per edge (Wikipedia person + field articles per the wave-3/
Seligman pattern; additional independent publishers where fetched). Direction person→field/concept,
referent, plural-vs-misattribution checked. Verdicts on the clause-6 v2 decision tree.

| edge | verdict | conf | key live claim-stating sources (verbatim-checked) |
|---|---|---|---|
| Marx → sociology | **supported** | 0.90 | WP *Sociology* ("Durkheim, Marx, and… Max Weber are typically cited as the three principal architects of sociology") + WP *Karl Marx* ("often cited as one of the principal architects of modern sociology") |
| Koch → microbiology | **supported** | 0.95 | WP *Robert Koch* ("one of the main founders of modern bacteriology"; "father of microbiology (with Louis Pasteur)") + WP *Microbiology* ("Pasteur and Koch… the founders of microbiology") |
| Peirce → semiotics | **supported** | 0.92 | WP *Semiotics* ("Peirce and… Saussure, the founders of the discipline") + WP *Charles Sanders Peirce* ("study of signs, of which he is a founder") |
| Wallace → evolutionary-biology | **supported** | 0.85 | WP *Alfred Russel Wallace* ("independently conceived the theory of evolution through natural selection") + WP *Evolutionary biology* ("independently discovered… by Charles Darwin and Alfred Russel Wallace") + UC Berkeley *Understanding Evolution* (independent publisher) |
| Labov → sociolinguistics | **supported** | 0.95 | WP *William Labov* ("widely regarded as the founder of… variationist sociolinguistics") + WP *Sociolinguistics* (same, "making sociolinguistics a scientific discipline") |
| Lakoff → cognitive-linguistics | **supported** | 0.88 | WP *Cognitive linguistics* (field emerged from "Chafe, Fillmore, Lakoff, Langacker, and Talmy") + Cognitive Linguistics society *Historical background* ("most influential linguists… formed the leading strands") + Oxford Bibliographies ("founding fathers… Langacker, Lakoff, and Talmy") |
| Cerf → internet | **supported** | 0.90 | WP *Vint Cerf* ("one of 'the fathers of the Internet'… with TCP/IP co-developer Robert Kahn") + 2004 ACM A.M. Turing Award citation (Cerf+Kahn, internetworking/TCP/IP) |

**Verdicts: 7 supported / 0 disputed / 0 NEI / 0 reject. Claim-level hallucination 0/8. Precision 7/7 = 1.0.**

### Adversarial findings (perspective-diverse QC)
- **Marx (generator flagged `ambiguous`) — flag reversed to supported.** The generator cautioned that
  Marx "predated the institutionalization of sociology and never identified as a sociologist." Independent
  grounding shows the founding is the **standard** view ("typically cited"/"often cited" as a principal
  architect; Isaiah Berlin: the "true father" of modern sociology). Per clause-6 v2 existence-vs-degree:
  existence agreed, only the *character* of his founding nuanced → **supported + record-not-resolve note**,
  not `disputed` (mirrors the wave-2 schopenhauer/saussure note-error reversals).
- **Wallace (generator flagged `ambiguous`, suggested `influenced`) — kept `founded_or_formalized`,
  supported.** Sources frame Wallace as the **co-discoverer of natural selection** (the founding theory),
  Darwin as primary founder (Origin, 1859). Co-discovery of a field's central theory is founding-level, so
  `founded_or_formalized` (not `influenced`) is correct; the asymmetry is captured in the note + a lower
  confidence. The **existing /data Darwin note already preserves the Wallace co-discovery** (record-not-
  resolve), so no contradiction — no Darwin-note edit needed.
- **Lakoff (referent-watch) — resolved supported.** The *George Lakoff* WP article does not itself say
  "founder of cognitive linguistics" (it credits conceptual-metaphor theory), and the field is a
  **multi-person emergence** ("rather than attributing founding to specific individuals"). But ≥2
  independent sources name Lakoff among the founding figures (society page + Oxford Bibliographies
  "founding fathers… Lakoff"), so the *existence* of his founding role is uncontested — a record-not-resolve
  multi-founder cluster (Langacker, Talmy, Fillmore), exactly parallel to sociology. Conservative attributed
  wording ("widely credited as one of the founders").
- **Peirce — lineage nuance recorded.** SEP notes Peirce's own term "semeiotic" descends from Scotus/
  Poinsot and differs in lineage from the Saussure/Morris line that "semiotics" often denotes. This is a
  character nuance, not a contested founding (WP *Semiotics* and *Peirce* both call him a founder) → recorded
  in the note.

## Cerf / `concept:internet` modeling ruling (QC)
The #33 NEI was a **referent** error: Cerf founded *the Internet* (the specific global system), not the
academic field *computer-networks* (which predates him). The precise referent is **Q75** ("global system
of connected computer networks based on IP addressing and routing protocols"), distinct from Q461 (Internet
Archive), Q217082 (IETF), Q35127 (website). `founded_or_formalized` taxonomy admits a **field/concept**
target, and the **`concept` node type already exists** in the schema (precedent: `concept:vector-space`,
`concept:random-variable`, `concept:probability-distribution`). Ruling: **`concept:internet` admitted** as
the correct referent — a QC modeling decision, **not a schema change**, so no stop-point. Co-founding with
Bob Kahn (also living, not a node) recorded record-not-resolve; the "fathers of the Internet" credit is for
the TCP/IP internetworking contribution (built on prior packet-switching: Baran, Davies, Pouzin).

## v2 operation evaluation (the session's headline)
- **Living founders flowed through by policy.** Lakoff and Cerf met the v2 admission floor (resolver-
  verified QID anchor + P570 live-confirmed absent + ≥2 independent live claim-stating sources + conservative
  attributed wording) and **auto-promoted to `reviewed` with no per-item CPO sign-off** — generalizing the
  Seligman N=1 precedent to N>1 by rule. **Living N: 1 → 3.**
- **Escalations fired: 0.** No clause-6 v2 disputed/NEI/reject; no thin/non-authoritative sourcing; no
  private-life/reputational/negative content; no subject dispute. The narrow signal set held empty — v2 is
  **not** a blanket gate, exactly as designed.
- **Indexability = same earned rule for everyone:** all 8 nodes `indexable:false` because no original
  summary was written (the Seligman pattern) — *not* because anyone is living. Conservative posture lives in
  *wording*, not in withholding `reviewed` or suppressing exploration.
- **Schema unchanged**; 12-type taxonomy unchanged; `is_living_person`/`validate-data` living enforcement
  satisfied (every living node carries ≥1 external_id and status ∉ {draft, generated}).
