# Scoping note — formal-founders-v1

## Keep-criteria rationale

All 8 proposed person nodes satisfy the inclusion criterion: each person is
credited in the mainstream math-history literature with founding or formally
axiomatizing one of the 8 target subfield nodes confirmed as `reviewed` in
`data/nodes.json` as of 2026-06-19. The target IDs — `subfield:set-theory`,
`subfield:probability-theory`, `subfield:information-theory`,
`subfield:mathematical-logic`, `subfield:computability-theory`,
`subfield:game-theory` — were verified to exist and to be `reviewed` at
generation time. No person nodes existed in `/data` before this batch (0
matches on `"type": "person"`).

All 8 persons are deceased (the latest death is Nash, 2015), so
`is_living_person: false` on all nodes. No living-person stricter evidence
standard applies.

## Plural-founding pairs

Two target subfields receive two co-existing `founded_or_formalized` edges:

**Boole (F4) and Frege (F5) → `subfield:mathematical-logic`**
These are recorded as co-existing edges, not disputed. Boole's algebraic/
propositional logic (1847/1854) and Frege's predicate logic (1879) are both
standard founding references for mathematical logic. However, the contributions
differ in character: Boole's is the algebraic/Boolean tradition; Frege's is
the predicate-calculus tradition that modern mathematical logic most directly
descends from. QC should decide whether the `ambiguous: true` on F4 (Boole)
warrants lowering the confidence further or splitting the note.

**Von Neumann (F7) and Nash (F8) → `subfield:game-theory`**
These are recorded as co-existing edges, not disputed. The historical accuracy
note is important: von Neumann's actual co-founder was Oskar Morgenstern (1944
'Theory of Games and Economic Behavior'), not Nash. Nash (1950) extended the
framework to non-cooperative games. The batch order's "co-founder" framing
pairs von Neumann and Nash, which is a common popular simplification but not
the precise historical picture. Both edges are defensible under
`founded_or_formalized` (which covers "formalized" and "foundationally
extended"), but QC should flag the Morgenstern omission. A future batch could
add a Morgenstern node with a co-founder edge.

## QID confidence ratings — QC priority order

All QIDs are training-knowledge hints, unverified against live Wikidata. QC
must live-verify all 8. Priority order for QC:

1. **John Nash — Q184462** (lowest confidence): Nash is less encyclopedically
   prominent in math-history sources than the others; QID recall is less
   reliable. Flag first.

2. **George Boole — Q167950** (low-medium confidence): Boole is well-known
   but his Wikidata QID is less familiar to training data than Cantor or
   Turing. Verify before trusting.

3. **Andrey Kolmogorov — Q192938** (medium confidence): the QID format feels
   plausible but the number is high enough that recall may be imprecise.

4. **Gottlob Frege — Q41135** (medium confidence): plausible; Frege is
   prominent in philosophy sources but QID should be confirmed.

5. **John von Neumann — Q46661** (medium-high confidence): von Neumann is
   very prominent; QID feels well-recalled.

6. **Georg Cantor — Q93176** (medium-high): prominent, QID plausible.

7. **Claude Shannon — Q9068** (high confidence): Shannon is a major figure
   and this QID range matches what I recall.

8. **Alan Turing — Q7251** (high confidence): Turing is among the
   most-referenced historical computer scientists; QID is well-recalled.

## Claim_anchor confidence — QC priority

All claim_anchors are from training knowledge of real sources (SEP, MacTutor,
Encyclopedia of Mathematics). None are fabricated sources. However, verbatim
accuracy is not guaranteed — these are best-recall paraphrases of the
argumentative content of the cited pages, not guaranteed verbatim quotes.
QC must fetch each URL and check the anchor text appears verbatim (or nearly
so) in the cited section.

Lowest verbatim confidence (check first):
- F4 (Boole): the SEP 'Boolean Algebra' entry may not use the exact phrasing
  "founded mathematical logic in his 1847 work" — QC should check whether
  SEP's entry on Boole or Boolean algebra frames his contribution as founding
  "mathematical logic" in those words.
- F2 (Kolmogorov): the exact sentence from EoM (encyclopediaofmath.org)
  'Probability theory' entry is recalled but not guaranteed verbatim.
- F8 (Nash): the MacTutor entry for Nash may be shorter or differently phrased
  than recalled; the entry may not exist at the URL given.

Highest confidence (still must be checked):
- F1 (Cantor): MacTutor's Cantor biography is well-known to contain a founding
  claim in those terms.
- F3 (Shannon): Shannon's founding role is described in those terms across
  many encyclopedia sources.
- F6 (Turing): the SEP 'Church-Turing Thesis' entry (Copeland) is a canonical
  reference for Turing's 1936 paper.

## Items QC should scrutinize

1. **F4 (Boole → mathematical-logic)** — `ambiguous: true`. The founding
   claim for Boole is weaker for 'mathematical logic' as a subfield label than
   for 'symbolic logic' or 'Boolean algebra'. QC should decide whether to
   accept, retarget to a different subfield, or lower to a non-`founded`
   relation.

2. **F7 (von Neumann → game-theory) and F8 (Nash → game-theory)** — both
   `ambiguous: true`. The co-founder pairing is historically imprecise (real
   co-founder is Morgenstern). QC should decide whether to (a) accept as-is
   with the note, (b) add a Morgenstern node proposal, or (c) adjust the Nash
   edge relation type.

3. **All claim_anchors** — QC's Lane B standard requires verbatim anchor
   check + live URL survival. Given that all anchors are training-knowledge
   recall rather than fetched text, the full anchor check pass is mandatory
   for this batch before any edge reaches `proposed` status.
