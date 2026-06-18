# formal-formalizes-wave2-v1 — Wayback SPN evidence-permanence log (data-foundry §8)

> Standing rule (data-foundry §8): external pages QC relies on are archived at verification time via
> Wayback Save Page Now; a snapshot URL counts only if it matches `web.archive.org/web/<timestamp>/…`;
> save failures are recorded honestly as **[SPN-FAILED]**, never substituted with an unverified URL.
>
> **Session condition:** web.archive.org was **bot-blocked + rate-limited** throughout this session
> (direct snapshot fetch 403; availability API 429; SPN `save` returned HTTP 520 / connection-refused
> intermittently as the rate-limit escalated). Snapshot Location URLs were harvested from the SPN `save`
> 302 response where the server returned one. The verdicts rest on **live claim-stating fetches (HTTP
> 200 at QC time)**; Wayback is the permanence layer, attempted best-effort here and logged honestly.
> This matches wave 1's EoM-502 substitution discipline (decision (51)).

## Captured snapshots (6, `web/<timestamp>/` verified)

- SEP *Game Theory* — `https://web.archive.org/web/20260618205621/https://plato.stanford.edu/entries/game-theory/`
- SEP *Evolutionary Game Theory* — `https://web.archive.org/web/20260618211926/https://plato.stanford.edu/entries/game-evolutionary/`
- Wikipedia *Information theory* — `https://web.archive.org/web/20260618211945/https://en.wikipedia.org/wiki/Information_theory`
- Wikipedia *Channel capacity* — `https://web.archive.org/web/20260618212010/https://en.wikipedia.org/wiki/Channel_capacity`
- Wikipedia *Information-theoretic security* — `https://web.archive.org/web/20260618212029/https://en.wikipedia.org/wiki/Information-theoretic_security`
- nLab *Navier–Stokes equation* — `https://web.archive.org/web/20260618212123/https://ncatlab.org/nlab/show/Navier-Stokes+equation`

## [SPN-FAILED] (33 — bot-block/rate-limit; HTTP 520 or connection-refused)

These pages were **live-fetched at HTTP 200 at QC time** (anchors quoted verbatim in `qc-report.md`)
but could not be Wayback-saved this session. To be retried in a future pitstop when web.archive.org is
reachable (joins the standing SPN retry queue):

- Wikipedia: Game_theory, Evolutionary_game_theory, Number_theory, RSA_cryptosystem, Statistical_mechanics,
  Navier–Stokes_equations, Control_theory, Robotics, Theoretical_computer_science, Semantics_(computer_science),
  Curry–Howard_correspondence, Category_theory, Mathematical_formulation_of_quantum_mechanics, Qubit,
  Econometrics, Economics, Lotka–Volterra_equations, Population_dynamics, Mathematical_finance,
  Financial_economics, Machine_learning, Statistical_learning_theory, Operations_research,
  Mathematical_optimization, Bayesian_inference, Mathematical_economics, Rational_choice_model
- SEP: Church-Turing, Bayes' Theorem, Philosophy of Economics
- nLab: statistical mechanics (302, no snapshot Location), quantum information, entropy

**Tally: 6 captured / 33 [SPN-FAILED] / 39 attempted.** No unverified URL was substituted for any failure.
