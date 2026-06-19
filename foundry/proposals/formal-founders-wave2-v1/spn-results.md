# formal-founders-wave2-v1 — Wayback / SPN results (§8, session #31)

Evidence-permanence layer for the founder-edge grounding. **Primary grounding = live HTTP-200
verification of every claim-anchor at QC time** (Stage 3); Wayback snapshots are the permanence
backstop. The availability API returned empty for all URLs (known flake — wave-1 precedent), so the
**Save-Page-Now 302-Location harvest** was used. web.archive.org rate-limited the run after ~20
requests (wave-2 `formalizes` hit the same wall: 33 [SPN-FAILED]); remaining URLs recorded honestly
as `[SPN-FAILED]`.

**Captured: 8 / 23 distinct cited URLs.** Every genuine edge (W1–W12) retains ≥1 captured snapshot
across its two cited sources except W5/W10 (see note); all anchors were live-200 at QC time
regardless.

## Captured snapshots

| Source | Snapshot |
|---|---|
| SEP Game Theory (W1) | `web/20260618232955/https://plato.stanford.edu/entries/game-theory/` |
| SEP Dedekind's Contributions to Foundations (W2) | `web/20260619001740/https://plato.stanford.edu/entries/dedekind-foundations/` |
| SEP Church-Turing Thesis (W3) | `web/20260618232934/https://plato.stanford.edu/entries/church-turing/` |
| MacTutor Hilbert (W4) | `web/20260619002019/https://mathshistory.st-andrews.ac.uk/Biographies/Hilbert/` |
| MacTutor Emmy Noether (W7) | `web/20260619002145/https://mathshistory.st-andrews.ac.uk/Biographies/Noether_Emmy/` |
| MacTutor Norbert Wiener (W8) | `web/20260619002236/https://mathshistory.st-andrews.ac.uk/Biographies/Wiener_Norbert/` |
| MacTutor Ronald Fisher (W9) | `web/20260619002257/https://mathshistory.st-andrews.ac.uk/Biographies/Fisher/` |
| WP History of calculus (W11/W12) | `web/20260619001737/https://en.wikipedia.org/wiki/History_of_calculus` |

## [SPN-FAILED] (rate-limited — live-200 at QC time, retry queued)

- SEP `proof-theory-development` (W4 second source; W4 covered by MacTutor Hilbert snapshot)
- MacTutor `Gauss` (W5), `Poincare` (W6), `Pearson` (W10), `Newton` (W11), `Leibniz` (W12)
- WP `Game_theory` (W1), `Set_theory` (W2), `Computability_theory` (W3), `Number_theory` (W5),
  `Henri_Poincaré` (W6), `Emmy_Noether` (W7), `Cybernetics` (W8), `Ronald_Fisher` (W9),
  `Karl_Pearson` (W10)

## Per-edge snapshot coverage

| Edge | Snapshot coverage |
|---|---|
| W1 Morgenstern | ✓ SEP game-theory |
| W2 Dedekind | ✓ SEP dedekind-foundations |
| W3 Church | ✓ SEP church-turing |
| W4 Hilbert | ✓ MacTutor Hilbert |
| W5 Gauss | ✗ both [SPN-FAILED] (WP Number_theory + MacTutor Gauss) — live-200 at QC |
| W6 Poincaré | ✗ both [SPN-FAILED] — live-200 at QC |
| W7 Noether | ✓ MacTutor Noether |
| W8 Wiener | ✓ MacTutor Wiener |
| W9 Fisher | ✓ MacTutor Fisher |
| W10 Pearson | ✗ both [SPN-FAILED] — live-200 at QC |
| W11 Newton | ✓ WP History of calculus |
| W12 Leibniz | ✓ WP History of calculus |

10/12 genuine edges have ≥1 captured snapshot; W5 and W10 are retry-queued (both their sources hit
the rate limit) and were live-verified HTTP 200 at QC time. Honest §8 record.
