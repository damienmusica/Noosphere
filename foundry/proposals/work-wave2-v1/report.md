# work-wave2-v1 batch summary (generator output; not self-QC)

Batch: Phase-2 work layer, wave 2. Proposer: Claude Sonnet (`claude-sonnet-5`), proposed_at
2026-07-01. This is the generator's own summary, written per ADR 0007's proposal-artifact
contract, closing out the generation session. It is not a QC or promotion verdict; that happens
in a separate orchestrator context, mirroring `work-wave1-v1`. (The generator was blocked by a
harness guard from writing this file directly; the orchestrator persisted its content verbatim.)

## Counts

- Nodes proposed: 9 `work` nodes, all `status: proposed`, all `indexable: false`.
- Edges proposed: 20 total: 18 real `canonical_work` edges (9 works times 2, one to a subfield
  and one to a person) plus 2 rejection-probe edges marked `probe: reject-expected`.
- Reconciled to existing data: all 9 author person nodes, the probe target
  person:john-von-neumann, and all 9 target subfield nodes already exist as reviewed canonical
  nodes; no duplicate nodes proposed.
- Flagged `ambiguous: true` on 6 of 9 work nodes and on 2 of 18 real edges (Frege person-edge
  scoping, Beccaria person-edge anonymous-publication nuance), plus both probes by construction.

## Coverage decisions

- Emitted exactly the 9 works named in the order, no more, no fewer.
- Emitted exactly the 2-edge triangle per work (field + person); no additional relation types.
- No `disputed: true` flags added; the 2 probes are deliberately-wrong constructions, not live
  disputes, so they use `probe`/`ambiguous`, not `disputed`.
- Avoided `source:mactutor` entirely per the order's caution; used `source:sep`,
  `source:encyclopedia-of-mathematics`, `source:nobelprize`, and `source:oxford-bibliographies`
  as specialist legs alongside `source:wikipedia`, with 2 independent sources on every real edge.

## What QC should look at first

1. Live-resolve all 9 QIDs. Every one is an unverified best-guess recollection. Based on the
   wave-1 precedent (generator QID hallucination was 9/9 on exact digits), expect corrections.
2. Edition/version identity risk on 4 works: Beccaria (anonymous 1st edition, 1764), Snow (1849
   pamphlet vs. expanded 1855 edition), Arrow (1951 dissertation vs. published monograph),
   Wundt (six substantially revised editions, order specifies 1874 first edition).
3. Frege person-edge scoping: confirm anchoring to Begriffsschrift (not Grundgesetze der
   Arithmetik or Die Grundlagen der Arithmetik) is correct for the mathematical-logic target.
4. Both rejection probes (designed harder than wave-1's — adjacent figure/subfield, not
   cross-domain/era): R1 Shannon-paper → von Neumann; R2 Turing-paper → information-theory. If
   either is NOT rejected, that is a pipeline-discrimination finding.
5. `work:on-computable-numbers` type-fit: a journal paper, not a book (wave-1 resolved this for
   Mendel — acceptable).

## Files written

- `foundry/proposals/work-wave2-v1/nodes.proposed.json`: 9 work nodes.
- `foundry/proposals/work-wave2-v1/edges.proposed.json`: 20 edges (18 real + 2 probes).
- `foundry/proposals/work-wave2-v1/generation-notes.md`: full per-item reasoning.
- `foundry/proposals/work-wave2-v1/report.md`: this file.

Nothing in this batch is reviewed or indexable; all items require independent live QID
resolution and QC/curation-gate review before any promotion consideration.
