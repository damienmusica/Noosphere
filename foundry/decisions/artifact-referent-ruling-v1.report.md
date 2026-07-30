# artifact-referent-ruling-v1 — promotion decision report

**Decided 2026-07-31** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/artifact-referent-ruling-v1.json` by `npm run foundry:report`.

> ✓ ladder-check: every reviewed outcome is sanctioned.

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `edge:john-von-neumann-influenced-computer-systems` | edge reviewed→reviewed | reviewed | — |

## Tally

- Adds: 0 nodes, 0 edges, 0 sources, 0 translations, 0 external links.
- Reviewed outcomes: 0 adds + 0 promotions (all ladder-sanctioned above).
- metadata flips: 1 (set_indexable/set_note).
- Editorial summary updates: 0.
- **Held** (3):
  - `person:john-mauchly`: John Mauchly and J. Presper Eckert: still held, with the unblock clause CORRECTED by decision (121). ★ The previous clause — 'create work:eniac / work:edvac ... and record the machine-level credit through canonical_work' — was unexecutable in BOTH halves, and neither failure is a scope refusal. (a) `work:eniac` fails three W-criteria simultaneously on live identity facts: Q169399 P31 = Q28542014 one-of-a-kind computer (criterion 1, the Vernadsky guard), no P50 at all (criterion 2), and no P577 — its only date is P1619, date of official opening (W2). Machines have no author and no publication, so there is no anchor left for decision (89)'s relaxation logic to preserve. (b) `canonical_work` is fixed by the taxonomy as work-sourced ('the work is always the source'), so re-typing the referent to a concept does not rescue it either. (c) The one document the two men did author, 'Automatic High Speed Computing: A Progress Report on the EDVAC' (1945-09-30), has no Wikidata item; and Q5452926 'First Draft of a Report on the EDVAC' is admissible as a work but its sole P50 is von Neumann, so it can carry canonical_work to him and to nobody else. CORRECTED UNBLOCK: decision (71)'s ratified rule governs — 'when a founder's true referent is a system/artifact/concept rather than a discipline, point the edge at a concept node for that referent' — so the shape is a `concept` referent plus `founded_or_formalized`, the 1:1 mirror of person:vint-cerf → concept:internet. Which referent (Q189088 von Neumann architecture, Q1134867 stored-program computer, or the machine itself) is a referent-precision call for a normal wave with Lane B verification, NOT for this ruling. ★ Sourcing measured 2026-07-31 and recorded so the next wave does not have to rediscover it: the MACHINE-grain claim is strong and abundant — enwiki ENIAC 'ENIAC was designed by John Mauchly and J. Presper Eckert', enwiki John Mauchly 'along with J. Presper Eckert, designed ENIAC ... as well as EDVAC', MacTutor Mauchly 'collaborated in the construction of', Britannica 'The ENIAC was designed and built by', plus Wikidata P287 designed-by naming both. The CONCEPT-grain claim is currently ONE source: enwiki Von Neumann architecture, 'Eckert and Mauchly had essentially finished designing a stored program computer before discussing the ideas with von Neumann' (cited there to Bergin 2000 p.34). enwiki Stored-program computer mentions neither man; MacTutor von Neumann mentions neither. So this ruling gives them an admissible SHAPE, not an admission — it moves the blockage from 'no expressible form' to 'one claim-stating source short', which is a testable condition rather than an impossible one. ★ A cheaper route was surfaced and is worth trying first: person:john-von-neumann already carries a reviewed 0.85 `influenced` edge to subfield:computer-systems grounded on the EDVAC report, and the same two articles say that report was 'based on the work of Eckert and Mauchly'. Wave 12 split the two men at that grain on identical evidence and called the split an artifact of search paths; the Trubetzkoy precedent of 2026-07-31 says the correct move for that shape is a re-search, not a new mechanism. (recheck: manual)
  - `person:j-presper-eckert`: Held on exactly the same terms as person:john-mauchly — see that entry for the corrected unblock clause and the measured sourcing. ★ This row exists because he did not have one: wave 12 held both men deliberately together but wrote a single ledger entry under Mauchly's ID, so `foundry:recheck-held` has never machine-checked Eckert's own /data state and would not have noticed if he were admitted alone. A ledger entry whose subject is only named in prose is not a ledger entry; that is the same defect decision (119) fixed for gap notes, in a second ledger. (recheck: manual)
  - `person:john-atanasoff`: Recorded rather than admitted. His claim is artifact-grained like Mauchly's and Eckert's — enwiki leads with 'credited with inventing the first electronic digital computer' — and the ideas the sources attribute to him are either pre-existing (binary arithmetic, Boolean logic) or artifact-adjacent (regenerative capacitor memory), so he has no in-scope concept referent of his own today. The 1973 Honeywell v. Sperry Rand ruling states a person-to-person derivation ('Eckert and Mauchly ... derived that subject matter from one Dr. John Vincent Atanasoff'), not a claim about any field or concept; a court ruling is also a different evidence kind from the claim-stating scholarly sources §8 requires, and the same article preserves counter-evidence in the same breath. UNBLOCK: he is downstream of the Mauchly/Eckert admission — an `influenced` edge between two person nodes needs both endpoints — and it would carry `disputed: true` when written. (recheck: manual)

## §8 permanence anchors

[NO-EXTERNAL-EVIDENCE]

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
