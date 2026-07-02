# a-relations-wave4-v1 — orchestrator QC report

**Session #51, 2026-07-02.** Separated-context generation (Claude Sonnet 5, `proposal-generator`,
ADR 0007) → orchestrator live QC (this report). 18 candidates (B1–B16 real + B17–B18 unmarked
rejection probes). Lane B pipeline per docs/data-foundry.md §8: ≥2 independent claim-stating sources
live-fetched + verbatim/term-checked, direction + identity referent verified, adversarial read;
`disputed`/NEI/reject stop at `proposed`/foundry (clause-6 v2). Endpoints machine-checked against
`data/nodes.json` (`status:reviewed`) and deduped against all `influenced`/`critiques`/`applies_to`/
`founded_or_formalized`/`canonical_work` edges.

Permanence anchors (§8): Wikipedia sources → native oldid revision permalinks (verified live
2026-07-02); SEP/IEP/MacTutor → Wayback SPN snapshots taken this session. All recorded on each
promoted edge's `evidence`/`note` and listed in `promotion-report.md`.

## Verdicts

| ID | Edge | Verdict | Basis |
|---|---|---|---|
| B1 | turing → philosophy-of-mind (influenced) | **supported** | SEP Turing-test + SEP Functionalism both live, "philosophy of mind"/"Turing" present; direction correct (1936–50 predates functionalism). |
| B2 | godel → philosophy-of-mathematics (influenced) | **supported** | SEP Gödel + WP Gödel's-incompleteness-theorems (@1361575140) "philosophy of mathematics" present; canonical, 0 dispute. |
| B3 | von-neumann → computer-systems (influenced) | **hold (proposed)** | Endpoint `subfield:computer-systems` is `proposed` (QID-less honest gap) → status-cap clause 3 blocks auto-promotion. Also architecture attribution carries a historiographical dispute (Moore School team). |
| B4 | chomsky → philosophy-of-mind (critiques) | **hold (proposed)** | Mis-modeled: Chomsky critiqued *behaviorism* (Skinner's Verbal Behavior), not the field philosophy-of-mind; accurate model is `influenced → philosophy-of-mind` or `critiques → behaviorism` (no such node). Living-person endpoint adds the (70) floor. Not an escalation signal (no reputational/private content); held on modeling precision, not risk. |
| B5 | russell → computer-science (influenced) | **hold (proposed)** | Real but diffuse/mediated (type theory → PL via Church/Curry-Howard, decades removed); field-grain target too broad; single clear claim-stating source (SEP Principia). |
| B6 | husserl → philosophy-of-cognitive-science (influenced) | **supported** | SEP Phenomenology ("cognitive science" ×5) + SEP Embodied-Cognition (Husserl ×3, Merleau ×5) — 2 independent SEP sources for the embodied/enactive lineage; distinct target from the reviewed phenomenology→psychology edge. Record-not-resolve note: mediated via Merleau-Ponty/enactivism. |
| B7 | existentialism → literary-studies (influenced) | **supported** | SEP Existentialism ("literature" ×3) + WP Existentialism (@1357728536) literature section; movement→field, direction correct. Note: Sartre/Camus author-blur recorded. |
| B8 | levi-strauss → literary-theory (influenced) | **supported** | WP Structuralism (@1356196844: Lévi-Strauss inspired Barthes/Genette) + WP Literary-theory (@1354713855: lists him as structuralist source) — 2 independent claim-stating articles (SEP has no general structuralism entry; multi-WP precedent = wave3 cybernetics→AI). Record-not-resolve note: mediated via Barthes/Genette. |
| B9 | lavoisier → physics (influenced) | **hold (proposed)** | Conservation-of-mass is shared, but "Lavoisier influenced field:physics" is diffuse; physics conservation laws have independent origins; target too broad. |
| B10 | poincare → dynamical-systems (influenced) | **supported** | SEP Chaos (Poincaré ×6) + WP Poincaré (@1361412875: "dynamical systems"+"three-body"); direction correct. Relation-choice note: could be `founded_or_formalized`; `influenced` chosen conservatively (subfield institutionally postdates Poincaré, Birkhoff/Smale). |
| B11 | piaget → philosophy-of-mind (influenced) | **supported** | SEP Innateness-and-cognition (Piaget ×30) + WP Jean-Piaget (@1361412864: Royaumont debate with Chomsky); nativism/constructivism debate is core philosophy-of-mind/cog-sci. (Generator's cited WP "Piaget–Chomsky debates" page does not exist → substituted WP Jean Piaget, which carries the claim.) |
| B12 | tversky → economics (critiques) | **supported** | SEP Bounded-rationality (prospect ×51, Tversky ×44, expected-utility ×47) + WP Prospect-theory (@1355782602); prospect theory explicitly framed against expected-utility economics; Tversky deceased. Note: joint Kahneman–Tversky work, attributed to Tversky to spread roster (Kahneman already 2 edges). |
| B13 | psychoanalysis → film-studies (influenced) | **supported** | WP Film-theory (@1355786936: psychoanalysis ×7, Lacan/Metz/Mulvey) + WP Psychoanalytic-film-theory (@1292189056); 1970s film theory, direction correct. Record-not-resolve note: mediated via Lacan (not a node); source is the `subfield:psychoanalysis` tradition. |
| B14 | gauss → geodesy (influenced) | **supported** | WP Gauss (@1361542707: geodetic+least-squares+Hanover) + MacTutor Gauss (geodesy ×10, Hanover ×3, least-squares ×7); direction correct. Relation-choice note: could be `founded_or_formalized`; `influenced` chosen conservatively. |
| B15 | nietzsche → critical-theory (influenced) | **supported** | SEP Critical-theory (Nietzsche ×10) + WP Dialectic-of-Enlightenment (@1344562773: Adorno/Horkheimer draw on Nietzsche's genealogy); direction correct (d.1900 → 1930s–40s). Distinct from Nietzsche's existing edges. (Generator's WP "Frankfurt School" cite did not carry the term in-extract → substituted WP Dialectic of Enlightenment, which does.) |
| B16 | cybernetics → systems-engineering (influenced) | **hold (proposed)** | Single clear claim-stating source (WP Systems-engineering lists cybernetics among many contributing fields incl. operations research); WP Cybernetics does not reciprocally state the link; thin at the "influenced" bar. |
| B17 | darwin → law (influenced) | **reject (probe fired ✓)** | Social Darwinism is a contested *misapplication* of Darwin by third parties, explicitly disclaimed by sources as inconsistent with his biology; Darwin made no contribution to legal theory. No documented causal chain. |
| B18 | cantor → psychoanalysis (influenced) | **reject (probe fired ✓)** | No documented causal chain; WP Georg-Cantor extract carries neither "psychoanalysis" nor "Freud"; Freud's psychoanalysis has an independent clinical origin (Charcot/Breuer). Thematic-proximity construct only. |

## Tally

- **Supported → auto-`reviewed`** (11): B1, B2, B6, B7, B8, B10, B11, B12, B13, B14, B15.
- **Held at `proposed`** (5): B3 (endpoint-cap), B4 (mis-modeled + living floor), B5 (diffuse),
  B9 (diffuse/broad), B16 (thin).
- **Reject probes fired** (2/2): B17, B18.
- **Claim-level hallucination: 0.** Two generator citation slips (non-existent WP "Piaget–Chomsky
  debates" page; WP "Frankfurt School" not carrying the term in-extract) were caught and each
  substituted with a verified claim-stating source before promotion — the underlying claims held.
- Precision on supported verdicts: 11/11 live-verified; no disputed edge promoted (clause-6 v2 net
  not triggered — none were contested).

## Living-person note (decision (70))

B4 (`person:noam-chomsky`, `is_living_person:true`) was the only living-person endpoint. Held at
`proposed` on modeling precision, not on a living-person escalation signal — no private-life,
reputational, or contested-claim signal fired; the underlying intellectual-history claim is
well-sourced. Recorded for transparency, not surfaced to the CPO (no narrow signal per §7.1 item 4).
