# a-relations-wave4-v1 — promotion report

**Session #51, 2026-07-02.** What entered `/data` and under which policy. See `qc-report.md` for
per-candidate verdicts and `probes.md` (opened post-verdict) for the reject-probe key.

## Promoted `proposed → reviewed` (11 edges) — (a)-relation auto-`reviewed` ladder (decision (68))

All 11 met the ladder conditions: both endpoints already `reviewed`, Lane B verdict *supported*
(≥2 independent claim-stating sources live-fetched + verbatim/term-checked, direction + identity
referent verified, adversarial read), not `disputed`/NEI/reject. No living-person endpoint among the
promoted set (the one living endpoint, B4/Chomsky, was held). Permanence anchors (§8) — Wikipedia
native oldid revision permalinks + SEP/MacTutor Wayback SPN snapshots taken this session — are recorded
on each edge's `note` and enumerated in `qc-report.md`.

| Edge | Relation | Anchors |
|---|---|---|
| `alan-turing → philosophy-of-mind` | influenced | SEP Turing-test (SPN) + SEP Functionalism (SPN) |
| `kurt-godel → philosophy-of-mathematics` | influenced | SEP Gödel (SPN) + WP Gödel's-incompleteness @1361575140 |
| `edmund-husserl → philosophy-of-cognitive-science` | influenced | SEP Phenomenology (SPN) + SEP Embodied-Cognition (SPN) |
| `existentialism → literary-studies` | influenced | SEP Existentialism (SPN) + WP Existentialism @1357728536 |
| `claude-levi-strauss → literary-theory` | influenced | WP Structuralism @1356196844 + WP Literary-theory @1354713855 |
| `henri-poincare → dynamical-systems` | influenced | SEP Chaos (SPN) + WP Poincaré @1361412875 |
| `jean-piaget → philosophy-of-mind` | influenced | SEP Innateness-cognition (SPN) + WP Jean-Piaget @1361412864 |
| `amos-tversky → economics` | critiques | SEP Bounded-rationality (SPN) + WP Prospect-theory @1355782602 |
| `psychoanalysis → film-studies` | influenced | WP Film-theory @1355786936 + WP Psychoanalytic-film-theory @1292189056 |
| `carl-friedrich-gauss → geodesy` | influenced | WP Gauss @1361542707 + MacTutor Gauss (SPN) |
| `friedrich-nietzsche → critical-theory` | influenced | SEP Critical-theory (SPN) + WP Dialectic-of-Enlightenment @1344562773 |

Relation mix promoted: `influenced` 10, `critiques` 1 (Tversky→economics).

## Held at `proposed` (5 edges) — provenanced, not promoted

- `john-von-neumann → computer-systems` (influenced) — **endpoint status cap:** target
  `subfield:computer-systems` is itself `proposed` (a QID-less honest gap); ladder clause 1 fails.
  Also a live attribution dispute (Moore School team). Will promote automatically if/when the endpoint
  reaches `reviewed`.
- `noam-chomsky → philosophy-of-mind` (influenced) — **modeling precision + living-person floor.**
  The generator proposed `critiques → philosophy-of-mind`; QC re-modeled to `influenced` (Chomsky
  critiqued *behaviorism*, a position, not the field) and held pending a cleaner target (a behaviorism
  node). Living endpoint (decision (70)) — no escalation signal fired (no private/reputational/contested
  content); held on modeling, not risk.
- `bertrand-russell → computer-science` (influenced) — diffuse/mediated (type theory → PL via
  Church/Curry-Howard), field-grain target too broad.
- `antoine-lavoisier → physics` (influenced) — diffuse; physics conservation laws have independent
  origins; target too broad.
- `cybernetics → systems-engineering` (influenced) — thin; WP frames cybernetics as one of many
  contributing fields, no reciprocal claim-stating source.

## Reject probes (2/2 fired ✓)

- B17 `darwin → law` — Social Darwinism is a contested third-party misapplication, not Darwin
  influencing law. Rejected, not written.
- B18 `cantor → psychoanalysis` — no documented causal chain; psychoanalysis has an independent
  clinical origin. Rejected, not written.

## Ledger

Edges **706 → 722** (+16 rows): 11 promoted directly as `reviewed` (`influenced` +10, `critiques`
+1) and 5 written as `proposed`. The prior philosophy-identity-anchor-v1 batch this session moved 2
`part_of` edges `proposed → reviewed` (status flips, not row additions), so the pre-batch total was
706. Relation counts: `influenced` 29→39, `critiques` 6→7. Nodes unchanged (no new nodes); schema,
taxonomy, sources unchanged. Claim-level hallucination 0; 2 generator citation slips caught and
substituted at QC (see `qc-report.md`).
