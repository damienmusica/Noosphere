# weber-referent-precision-v1 — orchestrator QC report (2026-07-03)

Resolves the recheck-wave2-v1 C3 referent-precision bundle (`concept:bureaucracy` +
`edge:max-weber-founded-bureaucracy` + `edge:bureaucracy-part-of-sociology`). CPO directed
processing 2026-07-03; disposition = CTO mirror ruling of §12 hold-resolution clause 1
(decision (106)) + the `concept:internet` referent-precision precedent (#39). Machine-readable
decision = `foundry/decisions/weber-referent-precision-v1.json` (the audit trail).

## Generation (separated context, §15.7)

Sonnet 5 proposal-generator agent, blind referents per contract v2 — 3 ranked candidate
re-scope targets (weberian-bureaucracy ideal-type / legitimate-authority typology /
rationalization), 6 edges, all self-flagged `ambiguous: true`. Generation used **no external
lookups**: [NO-EXTERNAL-EVIDENCE] at the generation step; all external evidence below is
QC-side. QC redaction: two provider-ID mentions the generator echoed from /data edge notes
into `proposal.json` were removed post-generation (contract v2 machine check caught them).

## QC adjudication

- **Candidate 1 (`concept:weberian-bureaucracy`, most faithful) — identity-blocked.**
  wbsearchentities 2026-07-03: "Weberian bureaucracy" zero hits; "theory of bureaucracy"
  resolves only to a 0-sitelink, description-less orphan stub (naval-architecture precedent —
  fails multi-signal). Ledgered as the re-creation trigger on the `concept:bureaucracy` held entry.
- **Candidate 2 (typology) — ADOPTED**, slug corrected at identity resolution to the entity's
  standard name `concept:tripartite-classification-of-authority` (the generator's
  `legitimate-authority` gloss would have recreated a generic-slug↔specific-referent C3;
  its own uncertainty note flagged the label as a gloss). Entity: 8 sitelinks incl. enwiki,
  en description "M. Weber's classification of authority into charismatic, traditional, and
  legal types", **P61 (discoverer or inventor) = Max Weber** — Wikidata's structured claim
  corroborates the founder edge. Identity re-confirmed live via wbgetentities (decision file
  `identity` record).
- **Candidate 3 (rationalization) — not adopted** (generator-ranked loosest fit; one precise
  re-scope suffices).

## Verdicts + evidence permanence (§8)

All quotes machine-verified verbatim against live pages (fetch-verify 6/6 PASS):

- Founder edge (ladder (60)/(61), supported, ≥2 independent claim-stating sources):
  - enwiki Tripartite classification of authority — permalink
    https://en.wikipedia.org/w/index.php?title=Tripartite_classification_of_authority&oldid=1336607101
  - SEP Max Weber (https://plato.stanford.edu/entries/weber/) — quote live-verified; Wayback
    snapshot unavailable ([SPN-FAILED] pending in the decision file, honest degradation —
    availability API and CDX both empty for this entry, SPN save failed twice)
  - Wikidata Q3565078 — permalink https://www.wikidata.org/w/index.php?title=Q3565078&oldid=2016189145
- part_of edge (structural tier, supported):
  - enwiki Rational-legal authority — permalink
    https://en.wikipedia.org/w/index.php?title=Rational-legal_authority&oldid=1348826867
- C3 reject verdict on `concept:bureaucracy`:
  - enwiki Bureaucracy ("was the first to **study** bureaucracy formally") — permalink
    https://en.wikipedia.org/w/index.php?title=Bureaucracy&oldid=1362037974

## Dispositions

`concept:bureaucracy` + both edges → **deprecated** (misattributing shape leaves /data);
`concept:tripartite-classification-of-authority` + founder edge + part_of edge → **reviewed**
(node-promotion-v1 / founded-or-formalized-auto-60 / edge-promotion-v1-structural);
held ledger: node entry superseded with the live re-creation trigger, both edge entries
superseded with CLOSED records.
