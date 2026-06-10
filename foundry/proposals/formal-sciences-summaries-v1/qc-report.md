# QC report — formal-sciences-summaries-v1 (editorial layer, 3rd batch)

- **QC by:** Claude Fable 5 (claude-fable-5), orchestrator session #5, 2026-06-11. Generation:
  Claude Sonnet (claude-sonnet-4-6), 3 subagents in separate contexts (ADR 0007 separation upheld).
- **Scope:** 35 summaries — the 25 formal-sciences nodes reviewed since session #3 without summaries,
  plus the 10 nodes newly promoted in this session's boundary-resolution batch (PR #41). All 35
  parent nodes are `reviewed` (editorial v1 precondition). Editorial policy v1 (decision log (10b)):
  full fact cross-check, one unverifiable claim = rejection or QC edit to verified text; citations
  below are QC live-verified pages and constitute the permanent citation record.
- **Verdict totals: 29 approved as generated, 6 QC-edited, 0 rejected.**

## Dashboard — hint URL hallucination: 0% (69/69 live)

**Process change this batch (response to measured failure):** editorial #1 measured 41% and #2
measured 59% dead hint URLs when generators cited from memory. This batch's generation orders
**mandated live-fetching every hint URL before citing it** — the discipline that produced 0% in this
session's boundary-research pass. Result: **69/69 unique hint URLs live (0% hallucination)**, all
additionally content-checked by the orchestrator against cached page text. The trend point is
therefore 41% → 59% → **0%**, with the caveat that the protocol changed: the third point measures
the fixed process, not the old one. Six benign redirects (britannica `/science/`→`/topic/`,
`isss.org`→`/home/`, `www.imstat`→apex) — final URLs verified same-entry.

The orchestrator's own QC-replacement text was held to the same bar: the rewritten
computational-statistics summary initially paraphrased the Monte-Carlo definition as "simulation
*of* random variables"; the cited EoM page says "simulation **by** random variables" — the shipped
text was aligned to the verified phrasing before commit.

## QC edits (6) — what changed and why

| node | change | verified against |
|---|---|---|
| number-theory | "foundational applications in **cryptography** and digital computing" — cryptography does not appear on the cited Britannica page. Replaced with the page's own arc: "purest branch … advent of digital computers and digital communications revealed that it could provide unexpected answers to real-world problems." | Britannica Number theory (verbatim run located in page text) |
| combinatorics | "graph coloring, planarity, and **network flow**" — network flow not on the cited pages. Replaced with verified Britannica items: "planar graphs, the four-colour map problem, and Eulerian cycles." | Britannica Combinatorics (section heads verified) |
| model-theory | "**Gödel** Completeness Theorem" — neither cited page attributes the Completeness Theorem to Gödel by name (SEP states it unattributed; EoM names a "Gödel compactness theorem"). Attribution dropped: "the Completeness Theorem and the Compactness Theorem". | SEP Model Theory; EoM Model theory (Theorem 1) |
| partial-differential-equations | "heat equation" → "heat-conduction equation" (the cited EoM page's name for it is "thermal-conductance equation"; heat-conduction is the closest standard form of the verified referent). | EoM Partial differential equation |
| time-series-analysis | "moving-average and **autoregressive** models" + "stationary and **non-stationary** processes" — autoregressive/non-stationary not on the three cited pages. Trimmed to verified terms: "the analysis of stationary processes, spectral decomposition, moving-average models, and forecasting." | EoM Stochastic process; Britannica Time series (Engle volatility / Granger common-trends sentences verified verbatim) |
| computational-statistics | **QC rewrite (largest edit).** The generated text's core method claims (Monte Carlo, resampling, simulation) were not present on its two cited pages — the generator itself flagged that no dedicated article had loaded. Rewritten by QC from three live-verified sources; citations replaced. | *Statistics and Computing* aims (Springer, "interface between the statistical and computing sciences", "data modelling, prediction and analysis", "machine learning … data analytics"); ASA Section on Statistical Computing; EoM Monte-Carlo method ("a numerical method based on simulation by random variables") |

False-miss notes (initially flagged, then verified — recorded so the checks are reproducible):
"served as a model for the restructuring" (EoM Group, verbatim), "purest branch" (Britannica,
verbatim), algebraic $K$-theory (EoM, TeX-marked), Frénet frame + fundamental forms + general
relativity (EoM Differential geometry — the generator's own uncertainty had wrongly doubted the
relativity mention), "subsystems of second order arithmetic" (SEP Proof Theory), ISSS "climate
change and AI … economics" + "Founded in 1954" (isss.org/home), MacTutor transmission narrative
("brought this Islamic mathematics and its knowledge of Greek mathematics back into Europe").

## Approved as generated (29) — verified citation record

Every claim-critical term (genus phrases, named theorems/figures/dates, named sub-areas) was located
in the cached text of the cited pages, fetched live 2026-06-11. Citations per node:

| node | QC-verified citations |
|---|---|
| algebra | EoM Algebra; EoM Group (restructuring quote verbatim); EoM Abstract algebra |
| geometry | EoM Geometry (genus verbatim); Britannica Geometry (six branches) |
| topology | Britannica Topology (deformation, knot theory, differential topology); EoM Topology, general |
| algebraic-geometry | EoM Algebraic geometry (genus verbatim incl. schemes); Britannica Algebraic geometry (genus, arithmetic) |
| algebraic-topology | EoM Algebraic topology (homotopy/cohomology/fibre bundles/characteristic classes/$K$-theory); EoM Homology group (Poincaré 1895) |
| differential-geometry | EoM Differential geometry (Frénet frame, fundamental forms, Riemannian/complex manifolds, general relativity); Britannica Differential geometry |
| category-theory | SEP Category Theory; EoM Category (axioms) |
| set-theory | EoM Set theory; SEP Set Theory (ZFC, Cohen, forcing, CH, large cardinals); Britannica Set theory (Cantor) |
| proof-theory | EoM Proof theory; SEP Proof Theory (Hilbert, Gentzen, cut elimination, ε₀, subsystems of Z₂); Britannica Proof theory |
| mathematical-analysis | EoM Mathematical analysis (genus verbatim); Britannica Analysis |
| complex-analysis | EoM Analytic function (Cauchy, Laurent, Riemann mapping, conformal); Britannica Complex analysis |
| functional-analysis | EoM Functional analysis (single source — substantive; Banach/Hilbert/spectral/Banach algebras all verified) |
| harmonic-analysis | EoM Harmonic analysis; EoM Fourier series; EoM Fourier transform |
| differential-equations | Britannica Differential equation (ODE/PDE split); EoM Ordinary differential equation (existence/uniqueness, stability) |
| dynamical-systems | EoM Dynamical system (phase space, three sub-areas, limit cycles, invariant manifolds); Britannica Dynamical systems theory (chaos) |
| numerical-analysis | EoM Numerical analysis; Britannica Numerical analysis (genus verbatim) |
| mathematical-logic | EoM Mathematical logic (genus + pillar list incl. theory of algorithms, model theory, set theory, intuitionism) |
| computability-theory | SEP Computability and Complexity (halting problem, Church–Turing, complexity); SEP Recursive Functions ("branch of contemporary mathematical logic" — dual-residence framing matches the node's disputed tag) |
| history-of-mathematics | MacTutor History overview (Babylonian 2000 BC, notation, transmission); MacTutor Beginnings of set theory |
| applied-mathematics | EoM Mathematics (needs of technology/natural science; mathematical physics, mechanics, information theory, operations research, optimal control); Britannica Analysis |
| mathematical-statistics | EoM Mathematical statistics (genus verbatim, estimation/testing/sequential/decision/design); Britannica Statistics |
| applied-statistics | Britannica Statistics (regression/correlation/design); IMS Annals of Applied Statistics page ("enormous range" verbatim) |
| bayesian-statistics | ISBA What is Bayesian Analysis (prior/posterior/paradigm); Britannica Bayesian analysis (method of statistical inference, subjectivity) — paradigm framing matches the node's disputed tag |
| systems-science | ISSS home (Founded 1954; climate change and AI …, economics; transdisciplinary); Britannica Systems theory |
| mathematical-physics | EoM Mathematical physics ("special position, both in mathematics and physics" verbatim; junction framing); Britannica Mathematical physics — interface framing matches the disputed tag |
| mathematical-biology | SMB home (founded 1973; "interface between the mathematical and biological sciences" verbatim); Britannica Mathematical biology (differential equations/numerical analysis; population dynamics, enzyme kinetics, genetics; computational-biology distinction) |
| game-theory | Britannica Game theory ("branch of applied mathematics" verbatim; von Neumann & Morgenstern 1944; Nash 1950s) |
| information-theory | Britannica Information theory (Shannon 1948, Bell Labs, channel capacity, noise); EoM Information theory ("branch of applied mathematics and cybernetics" verbatim) |
| financial-mathematics | EoM Black-Scholes formula (Bachelier 1900; 1973; geometric Brownian motion; self-financing); Bachelier Finance Society home ("mathematical finance") |

## Process notes

- Bulk URL existence check ran before content QC (institutionalized since v1); claim-term content
  checks ran against orchestrator-cached page text, with regex-variant re-probes before declaring
  any miss (TeX markup and British spellings caused 7 initial false misses — see above).
- The 8 disputed-tagged nodes' summaries use interface/dual framing consistent with the
  clause-6 resolution records (no flat single-home assertions) — checked summary-by-summary.
- All 35 parent nodes `reviewed`, en translations already `reviewed`; summaries applied to
  `data/node-translations.json` only. Generation artifact `summaries.proposed.json` preserved
  unmodified as the re-auditable original.
- /data after this change: all 119 reviewed nodes carry QC-verified English summaries
  (translations with summaries: 84 → 119).
