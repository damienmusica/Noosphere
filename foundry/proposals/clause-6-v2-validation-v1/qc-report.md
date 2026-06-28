# Clause-6 v2 Validation — Orchestrator QC report

**Session:** #35 (2026-06-29). **QC context:** orchestrator (Opus), separate from the Sonnet
generation context (ADR 0007). **Input:** the untrusted generation draft (`proposals.json`).
**Method:** independent live re-grounding of every cited source + adversarial perspective-diverse
QC (source→claim / claim→counter-evidence / existence-vs-degree line / referent + direction).
The generation draft's verdicts are **not** trusted — each is re-derived below.

**The v2 fire bar (disputed-balanced) — ALL of:** (1) the contest is about the **EXISTENCE/
DIRECTION** of influence, not its degree/character, not a parallel/comparative resemblance, not
book-ownership; (2) **each camp ≥2 independent claim-stating live sources**; (3) both camps are
**live** scholarly positions (not fringe/straw-man).

---

## C3 `subfield:pragmatism → subfield:analytic-philosophy` — generation said FIRE; **QC: DOES NOT FIRE**

The headline over-fire candidate. Adversarially refuted on three independent grounds:

1. **Camp-A SEP anchor is a generation hallucination.** Draft quote — *"Quine and Sellars used a
   revised pragmatism to criticize logical positivism"* — is **NOT on** the live SEP Pragmatism
   page (independently re-fetched). SEP says only that Lewis/Quine "developed pragmatist themes"
   with "analytic allegiance," and presents pragmatism's influence on analytic philosophy as
   **"largely established, not contested."** (Same failure class as #34's fabricated "Shannon"
   anchor — caught by independent re-grounding.)
2. **Camp-B flagship is classification, not influence-denial.** IEP's *"the pragmatists are usually
   understood as constituting a separate tradition or school"* is **verbatim-real**, but adversarial
   reading shows it **classifies** the schools as distinct — it does **not** deny that pragmatism
   influenced analytic philosophy, and the entry nowhere claims independent development.
3. **The denial camp is a straw man — decisive.** The generation's *own* Camp-A source (NDPR review
   of Baghramian & Marchetti, *Pragmatism and the European Traditions*) — re-fetched — has the
   reviewer stating the editors "never actually cite any philosopher or historian who explicitly
   holds this isolationist position," calling it a **"straw man,"** and the cross-influence thesis
   **"wholly or largely uncontested."**

**Verdict: the EXISTENCE of pragmatism→analytic cross-influence is largely *agreed*, not contested.**
No live, sourced scholarly camp *denies* the influence. v2 clauses 1 & 3 both fail → **disputed-
balanced does NOT fire.** The relation is better characterized as **supported + note** (influence
agreed; degree/period nuance — analytic philosophy's *founding* era (Frege/Russell/Moore) was
independent/hostile, later analytic philosophy (Quine onward) absorbed pragmatist themes; neo-
pragmatism reintegrated). **Not written this session** — a supported (a)-adjudication is out of the
§3.1 no-node disputed-validation scope; recommended for a follow-up (a)-wave.

## C2 `subfield:buddhist-philosophy → subfield:phenomenology` — generation said NEI; **QC: NEI holds**

Camp A = **0 historical-influence claim-stating sources**. The Husserl 1926 "Socrates-Buddha"
manuscript is comparative reflection, not a causal-influence claim; the rest is parallel/comparative
literature. The documented historical direction runs the **other way** (phenomenology → the Kyoto
School: Heidegger influenced Nishitani). With **zero** affirm-camp sources the fire is structurally
impossible — the over-fire guard holds trivially (cannot manufacture a 50/50 split from an empty
camp). **NEI maintained.** (Prior NEI reason — parallel ≠ influence — confirmed.)

## C1 `person:charles-darwin → person:gregor-mendel` — generation said NEI (flag supported+note); **QC: DOES NOT FIRE disputed; re-adjudicates toward supported+note**

Camp-A PMC sources independently verified REAL and claim-stating (unlike C3's SEP anchor):
- **PMC6972880** ("Mendel and Darwin: untangling a persistent enigma"): abstract — *"Darwin's
  writings directly influenced Mendel's classic 1866 paper, and his letters to Nägeli."* ✓
- **PMC5068835** ("Darwin's Influence on Mendel: Evidence from a New Translation"): Darwinian
  terminology concentrates in Mendel's final sections; *Origin* "could have had no influence while
  he was conducting his experiments" but coincided with the paper-writing period. ✓

So the influence on the **1866 paper's interpretive framing/language** is affirmed by ≥2 independent
live sources; the **experimental program** is agreed independent (pre-1863) by *all* camps,
including the Camp-A papers. That makes this a **DEGREE/CHARACTER debate** (which *aspect* was
influenced), **not an EXISTENCE dispute** → v2 clause 1 fails → **disputed does NOT fire (over-fire
guard holds).** The prior NEI ("book ownership ≠ influence claim") is now **outdated** — there are
live claim-stating sources. Re-adjudicates toward **supported + note** ("Darwin influenced Mendel's
interpretive framing of the 1866 paper, not his experimental program"). **Not written this session**
(same scope reasoning as C3); recommended for a follow-up (a)-wave.

---

## Result

| Case | Generation draft | Orchestrator QC | Why |
|---|---|---|---|
| C3 pragmatism→analytic | FIRE (disputed-balanced) | **does NOT fire** | existence largely *agreed*; denial camp = straw man; SEP anchor hallucinated |
| C2 buddhist→phenomenology | NEI | **NEI** | affirm camp empty (parallel ≠ influence; direction reversed) |
| C1 darwin→mendel | NEI / flag supported | **does NOT fire; → supported+note** | degree/character (framing yes, experiments no), not existence |

**`disputed:true` fired 0/3 → cumulative 0/32** (0/29 prior + 0/3 here).

**Over-fire guards HELD — and more.** v2 did not over-fire; and the adversarial QC actively **caught
and overturned the generation's attempted over-fire on C3** (hallucinated anchor + classification
misread as denial). The existence-vs-degree line and the per-camp source floor worked exactly as the
design intends — they are what blocked C3, C2, and C1 from firing. **No manufactured disputes.**

**But the positive fire is UNDEMONSTRATED.** None of the three no-node NEI cases is a genuine
balanced existence-split: C2 has no affirm camp, C1 is degree-only, and C3 — the designed first-fire
candidate — turns out to be largely-*agreed* cross-influence, not a contest. The genuine balanced-
split cases (Nietzsche→Freud, Wittgenstein→Vienna-Circle) require **new contested-influence nodes**
(design §3.2), deferred by the CPO at ratification ⑤. **v2 cannot fire on existing nodes because no
existing NEI case is a real existence-contest.**

**Codification consequence (per ratified discipline ③):** repo codification of v2 into
`docs/data-foundry.md` §8 happens *only after v2 fires correctly without over-firing*. It has not
fired. **→ v2 is ratified-but-unproven; §8 is NOT codified this session.** The node-gate question
(deferred to deeper research) is now the linchpin for ever testing v2's positive fire.

SPN §8: no /data write this session → no new evidence-permanence obligation. The cited sources
(SEP, IEP, NDPR, PMC) were live (HTTP 200) at QC time.
