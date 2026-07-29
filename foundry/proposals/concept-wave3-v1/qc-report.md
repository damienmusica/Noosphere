# QC report — `concept-wave3-v1`

Session #60, Track D. Concept-layer wave 3, coverage expansion under keep-criteria C1–C4
(decision (91), CTO-autonomous). Slate of 12 scoped by the orchestrator including **2 unmarked
rejection probes**; generation by separated-context **Claude Sonnet 5** (`proposal-generator`);
identity, verdicts and adversarial QC by the orchestrator (**Claude Opus**) against live sources.
Decision file: `foundry/decisions/concept-wave3-v1.json` (authoritative).

## Outcome

| | count |
|---|---|
| concepts → `reviewed` | 7 |
| edges → `reviewed` | 13 |
| candidates held on C3 | 3 |
| rejection probes fired | 2/2 |
| proposed founder edges rejected or NEI | 3 |

The generator declined nothing and proposed all 12; **every removal is a QC outcome.**
`fetch-verify` 29/29 PASS against the §8 anchors (22 wiki revision permalinks, 0 pending).

## Admitted

| concept | identity | edges |
|---|---|---|
| conservation-of-mass | Q483948 (P31 scientific law, P61 = Lavoisier) | `part_of` chemistry · Lavoisier founder |
| cell-theory | Q177935 (P31 scientific theory) | `part_of` cell-biology · Schwann + Schleiden founders |
| germ-theory-of-disease | Q1425837 (P31 scientific theory) | `part_of` microbiology only |
| uniformitarianism | Q208650 (P31 principle + philosophical theory) | `part_of` geology · Hutton founder |
| entropy | Q45003 (physical property) | `part_of` thermodynamics only |
| bounded-rationality | Q814385 (P31 economic concept) | `part_of` economics · Simon founder |
| ideal-type | Q1052882 (**P31 concept**) | `part_of` sociology · Weber founder |

## ★ Both probes fired at generation time, not only at QC

- **theory-of-relativity**, planted with Henri Poincaré as the person endpoint. The generator refused
  `founded_or_formalized`, wrote `influenced` at 0.65 instead, named Einstein as the mainstream-credited
  founder, verified against `data/nodes.json` that no Einstein node exists, and put the candidate
  **first** on its own QC list. QC completed the refusal by declining admission this wave.
- **evolution**, planted as an over-broad label. The generator proposed it but flagged that its edge
  pair duplicates `concept:natural-selection`'s endpoints exactly and asked QC to confirm distinctness
  before promoting both. C3 reject — the same failure mode that held "positivism" in wave 2.

In both cases the generator's own `uncertainty` field carried the objection that decided the candidate.

## ★ QC's catch was the one claim the generator was confident about

Hutton and Lyell were proposed together as a co-founder pair for uniformitarianism and left
**unflagged** — the only unflagged multi-founder claim in the batch. The source separates the roles
in a single sentence: Hutton originated, Playfair refined, **Lyell popularised**. Popularisation does
not meet the `founded_or_formalized` bar; the Lyell edge is rejected and Hutton's stands alone.

Confidence and correctness were inversely related here. That is the argument against sampling QC by
the generator's flag list.

## ★ Two founder edges failed on the `concept:bureaucracy` shape

A phenomenon or theory that long predates the person cannot carry their founder claim (decision (108)).

- **Germ theory** originates with Fracastoro in 1546. Pasteur begins a "transitional period"; Koch
  "extended" the work. Both founder edges → **NEI**; the concept enters on its disciplinary membership
  alone.
- **Division of labour** fails harder and is **held outright**. Q207449 has no P31 at all, no
  discoverer property, and `P279` = social behavior + human behavior — modelled as a *behaviour*.
  Its article runs Plato → Xenophon → Augustine → medieval Muslim scholars before reaching Adam Smith
  as the eleventh named modern theorist. Smith's contribution is already carried by
  `work:the-wealth-of-nations` (reviewed).

## On trusting structural signals

Wikidata carries `P61` = Pasteur for germ theory while the same referent's prose history gives the
origin to Fracastoro. P61 is a strong corroboration when it **agrees** with the prose — it did for
Lavoisier, Schwann and Schleiden — and a flag to check when it does not. It was not treated as
sufficient on its own in either direction.

## The two wave-2 holds, re-examined rather than re-listed

- **cardinality** — held again, reason sharpened. Q4049983 (57 sitelinks, 31 properties) encodes the
  ambiguity in its own description, and its `P279` parents are *cardinal function*, *class function*,
  *index number* — it is modelled as a kind of function, not as the concept of set size. The
  same-label alternative Q28727773 is a 0-sitelink, 4-property orphan stub.
- **boolean-algebra** — held again, and the clearest production firing so far of the **contract-v2
  blind-referent checksum**. The generator described Boole's specific formal algebraic system,
  deliberately distinct from the disciplinary sense that caused the original hold. Resolution returns
  neither: Q173183 is `P31` = *branch of mathematics*, and Q4973304 is a lattice structure. The
  description-versus-resolution mismatch is exactly the error signal v2 exists to produce, and it is
  what kept the candidate out.

  *Separate and undecided:* whether `subfield:boolean-algebra` is admissible under the §12 dual
  criterion. That is a skeleton question, not a concept question, and is not ruled on here.

## Identity note worth keeping

`concept:entropy` needed a second, targeted search. The bare label returns a journal, four video
games, a split EP, a yacht and a *Buffy* episode before any physics item; Q45003 also had to be
distinguished from Q204570 (information entropy — a genuinely different quantity) and from Q5380792,
a near-duplicate. A label-match-only resolver would have failed this one outright.

## §8 permanence anchors

All 22 anchors are MediaWiki revision permalinks (publisher-run, immutable, keyless). No Wayback snapshot was required and none is pending.

| Source read | Anchor |
|---|---|
| en.wikipedia.org/wiki/Bounded_rationality | `…&oldid=1340186617` |
| en.wikipedia.org/wiki/Cell_theory | `…&oldid=1365081375` |
| en.wikipedia.org/wiki/Conservation_of_mass | `…&oldid=1365127168` |
| en.wikipedia.org/wiki/Division_of_labour | `…&oldid=1366211289` |
| en.wikipedia.org/wiki/Entropy | `…&oldid=1361126134` |
| en.wikipedia.org/wiki/Germ_theory_of_disease | `…&oldid=1363463071` |
| en.wikipedia.org/wiki/Ideal_type | `…&oldid=1348687628` |
| en.wikipedia.org/wiki/Uniformitarianism | `…&oldid=1340745341` |
| plato.stanford.edu/entries/bounded-rationality/ | `https://plato.stanford.edu/archives/sum2026/entries/bounded-rationality/` |
| plato.stanford.edu/entries/weber/ | `https://plato.stanford.edu/archives/sum2026/entries/weber/` |
| www.wikidata.org/wiki/Q1052882 | `…&oldid=2520685351` |
| www.wikidata.org/wiki/Q1425837 | `…&oldid=2400656197` |
| www.wikidata.org/wiki/Q173183 | `…&oldid=2520160537` |
| www.wikidata.org/wiki/Q177935 | `…&oldid=2523318691` |
| www.wikidata.org/wiki/Q207449 | `…&oldid=2515852253` |
| www.wikidata.org/wiki/Q208650 | `…&oldid=2520026444` |
| www.wikidata.org/wiki/Q28727773 | `…&oldid=2455271064` |
| www.wikidata.org/wiki/Q4049983 | `…&oldid=2518872674` |
| www.wikidata.org/wiki/Q45003 | `…&oldid=2517117836` |
| www.wikidata.org/wiki/Q483948 | `…&oldid=2515869802` |
| www.wikidata.org/wiki/Q4973304 | `…&oldid=2509122379` |
| www.wikidata.org/wiki/Q814385 | `…&oldid=2522544066` |
