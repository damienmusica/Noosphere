# phase2-summaries-v1 — generation notes

**Session, 2026-07-02, editorial v2 (decision (26)); generation model = Opus (`claude-opus-4-8`).**
This batch is the **generation** artifact only, produced in a context separate from QC (ADR 0007).
Everything in `summaries.proposed.json` is an untrusted `generated` draft. QC has **not** run and
must run in a separate session.

## Scope

32 node summaries for the phase-2 seed corpus, matching the recorded graph edges in `data/edges.json`:

- **Persons (12):** sigmund-freud, emile-durkheim, friedrich-nietzsche, claude-levi-strauss,
  gottlob-frege, alan-turing, charles-darwin, max-weber, karl-marx, edmund-husserl, noam-chomsky
  (★living), donald-knuth (★living).
- **Works (9):** on-the-origin-of-species, philosophiae-naturalis-principia-mathematica,
  the-wealth-of-nations, cours-de-linguistique-generale, a-mathematical-theory-of-communication,
  the-interpretation-of-dreams, tractatus-logico-philosophicus, capital-volume-i, on-computable-numbers.
- **Concepts (11):** natural-selection, the-unconscious, turing-machine, nash-equilibrium,
  mendelian-inheritance, social-fact, invisible-hand, intentionality, lambda-calculus, symbolic-ai,
  false-consciousness.

## Evidence-permanence anchor (§8)

`[NO-EXTERNAL-EVIDENCE]` **at generation time.** No QC verdict has been reached, so no external page
has yet been *relied upon* for a verdict. The `source_hints[]` URLs in `summaries.proposed.json` are
unverified best-guess reference pointers for QC to live-verify — not QC-relied-upon evidence. Per the
generation/QC separation (ADR 0007), the per-node §8 permanence anchors (Wayback snapshots / MediaWiki
`oldid` revision permalinks, live-verified) are QC's deliverable and will be recorded here (or in a
`qc-report.md`) **at verification time**, mirroring the `structural-summaries-v1` precedent. This marker
is the honest offline-batch placeholder, not a claim that the summaries rest on no sources.

## Corpus-consistency and self-flag notes for QC

Per-item `rationale` fields carry the detailed self-flags (uncertain slugs, dating ambiguities,
attribution nuances). Cross-cutting notes:

- **Living persons (Chomsky, Knuth):** strictly contribution-focused, non-biographical, conservative
  attributed wording; present tense with no birth/death dating (decision (70) §1(d)). Chomsky:
  linguistics/cognitive-science contributions only, with at most a single neutral clause noting he is
  also known as a public intellectual — no political positions, no controversy.
- **Relation-type fidelity:** where the corpus records `influenced` rather than `founded_or_formalized`
  (marx → false-consciousness) or a `proposed`-status founder edge (husserl → intentionality;
  minsky → symbolic-ai; weber → bureaucracy; weber → marx `critiques`), the summaries avoid overclaiming
  a sole-founder / decided relation and use neutral association wording, preserving interpretive tension.
- **false-consciousness:** the term is standardly attributed to Engels, not Marx; the summary states
  this honestly rather than crediting Marx with coining it (identity-axis accuracy).
- **intentionality:** the modern term is standardly credited to Brentano and made central by Husserl;
  the summary credits both rather than treating Husserl as sole originator.
- **capital-volume-i:** the corpus files its `canonical_work` edge under `field:sociology` (not
  economics); the summary reflects this ("across economics and the social sciences, including sociology").

## Known slug uncertainties flagged for QC to live-verify (non-exhaustive; see per-item rationale)

IEP `levi-strauss`, IEP `intentio`, SEP `structuralism-linguistics`, SEP `lambda-calculus`,
SEP `logic-ai`, SEP `darwinism` (as a Darwin anchor), SEP `smith-moral-political`, Britannica
`Das-Kapital` / `Mendelism` / `social-fact` / `invisible-hand` / `the-unconscious` topic slugs,
Britannica `Donald-Knuth` biography slug, the Wikipedia anchor for "On Computable Numbers"
(may live under `Turing's_proof`). Britannica pages commonly 403 to bots (real URL, not dead).
