# QC report — batch `pivotal-influence-v1`

Session #36 build (decision (67)). Orchestrator (Opus) QC of the separated-context Sonnet generation
(ADR 0007). Pilot of the corpus's first **pivotal-influence** person class (vault decisions (65)/(66))
+ the headline **clause-6 v2 §3.2 disputed-balanced firing test**. Network: local (Wikidata HTTP 200).

## Stage 2 — node identity QC (live Wikidata resolver, independent of generation)

| node | gen QID | verdict | live check |
|---|---|---|---|
| `subfield:psychoanalysis` | Q41630 | ✓ correct | label "psychoanalysis", discipline (not Q5) |
| `person:sigmund-freud` | Q9215 | ✓ correct | P31=Q5, b.1856 **d.1939** |
| `person:friedrich-nietzsche` | Q9358 | ✓ correct | P31=Q5, b.1844 **d.1900** |
| `person:arthur-schopenhauer` | Q38193 | ✓ correct | P31=Q5, b.1788 **d.1860** |
| `person:claude-levi-strauss` | **Q56259 → Q128126** | ✗ **hallucinated, corrected** | gen Q56259 = "Migaama" (a language!); correct Q128126 (P31=Q5, b.1908 **d.2009**, 99 sitelinks) |

**QID hallucination 1/5 (20%)** — caught and corrected (the 4 most-famous figures resolved correctly;
the generator's recollection failed on Lévi-Strauss, pointing at a language). The orchestrator's own
first recollection (Q193668) was *also* wrong (= Benicio del Toro) — corrected by live search, not memory.
**All 5 verified; `is_living_person:false` confirmed for all 4 persons (P570 death-date present).** Nodes
promoted `reviewed` (node promotion policy v1 person-extension; `indexable:false`, editorial deferred).

## Stage 3 — edge QC (≥2 independent live claim-stating + adversarial perspective-diverse) + clause-6 v2

**Generation error caught (QC separation worked):** the draft claimed "Freud *acknowledged* Schopenhauer's
anticipation in 'On the History of the Psycho-Analytic Movement' (1914)." Independent verification found the
**opposite** — when Otto Rank raised Schopenhauer's priority on repression, Freud *refused* to acknowledge it
and insisted on his own originality. Note rewritten to the verified state.

### clause-6 v2 §3.2 adjudication (the headline measurement)

| edge | v2 verdict | reasoning |
|---|---|---|
| **`nietzsche → freud`** | **★ disputed:true (balanced)** | EXISTENCE/DIRECTION of direct influence genuinely contested, no dominant view, each camp ≥2 live claim-stating. **Camp A (affirm):** parallels too specific to be coincidental — Freud drew on Nietzsche's unconscious/repression/sublimation (Chapman & Chapman-Santana, *Br. J. Psychiatry* 1995; psychreg/Borjesson). **Camp B (deny):** Freud repeatedly denied reading Nietzsche; "scarce direct textual dependence", "no direct evidence Freud read Nietzsche systematically", common-source explanation (the "Nietzsche and Freud: Disaffinities" literature). conf 0.5, not positioned, proposed (disputed never auto-promotes). |
| `schopenhauer → freud` | supported + note (NOT disputed) | **over-fire guard.** Scholarship dominantly affirms Schopenhauer's anticipation/influence (SEP Schopenhauer's Aesthetics: figures "such as … Freud … were influenced by Schopenhauer's thought"; Cambridge Companion ch.12 "Schopenhauer, Will, and the Unconscious"). Dissent = Freud's own originality claim (autobiographical), preserved in note. Existence agreed, degree/directness debated → supported+note. |
| `saussure → levi-strauss` | supported + note (NOT disputed) | **existence-vs-degree line test.** Existence agreed ("Saussure … greatly influenced Lévi-Strauss"); directness debated (Jakobson mediation, NY early-1940s). Existence agreed → supported+note; Jakobson recorded as a candidate future node (record-not-resolve). |

**★ Result: `disputed:true` fired EXACTLY ONCE (Nietzsche→Freud) — the corpus's first positive firing
(prior cumulative 0/32).** The two near-candidates correctly routed to supported+note (no manufactured
disputes; the existence-vs-degree line + per-camp source floor held). This demonstrates **both** v2's
positive fire **and** its over-fire guard in one pilot — exactly the design §3.3 success criteria.

### Remaining edges (anchors / structural / founder)

- `nietzsche → existentialism` (supported): SEP Existentialism "pioneers like … Friedrich Nietzsche"; "Nietzsche was the most influential and prophetic". Pivotal-influence anchor (K1).
- `nietzsche → continental-philosophy` (supported): Wikipedia "one of the most decisive figures in Continental philosophy".
- `schopenhauer → nietzsche` (supported): SEP Nietzsche (early interest in Schopenhauer; *Schopenhauer as Educator*) + SEP Schopenhauer's Aesthetics.
- `schopenhauer → aesthetics` (supported): SEP "Schopenhauer's Aesthetics". Independent anchor (anti-clique, K1).
- `psychoanalysis part_of psychology` (reviewed, structural): Wikipedia + LCC BF173-175; §12 dual criterion met (IPA / Int'l J Psychoanalysis / training institutes).
- `freud founded_or_formalized psychoanalysis` (**proposed-first**, NOT laddered): only Wikipedia live-verified for the founder claim; Britannica 403 + IEP 404 bot-blocked → ≥2-independent-live floor not cleanly met. Honest grounding gap (SPN §8); promote on a later wave.

**Verdicts: 7 supported / 1 disputed / 0 NEI / 0 reject · claim-level hallucination 0/9 · 1 generation
note-error caught.** All (a)-edges written proposed-first ((a)-ladder not open, decision (64)).

## (가) node-gate keep-criteria calibration (decision (66) framing: compass, not gate)

- **Nietzsche** — clean pivotal-influence admit (independent reviewed anchors: existentialism, continental-philosophy). The flagship of the new class.
- **Schopenhauer** — admitted with an **independent** anchor (→ aesthetics, reviewed), so not a closed-clique case despite his strongest edges being to same-wave nodes (Nietzsche/Freud). K1 discriminator worked.
- **Lévi-Strauss** — admitted via an existing reviewed *person* anchor (Saussure→Lévi-Strauss).
- **Freud** — **founder-blocked case resolved as designed**: not a pivotal-influence figure but a founder whose field (psychoanalysis) was un-noded; resolved by adding the §12-qualifying field node, keeping the new class pure to the non-founders. Live demonstration of decision (65) §1.3.
