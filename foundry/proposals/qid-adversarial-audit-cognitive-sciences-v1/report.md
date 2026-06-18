# Adversarial QID audit — cognitive-sciences skeleton (inline, session #21)

> Decision (34)② — inline adversarial QID audit as the standard final step of a skeleton session
> (no "audit queue" debt accrued). QC-side fan-out of 4 refutation agents (separate context, live
> EntityData) vs the **22 new verified QIDs**; verdict = orchestrator. The 3 QID-less proposed nodes
> have no QID to audit.

## Result: 22/22 CONFIRMED · 0 refuted · 0 suspect

4 refutation agents, each instructed to assume its slice's QIDs were WRONG and prove it (homonym /
concept-process / object / journal / person / organization / taxon / narrower-broader). None could
refute. Every QID is the discipline itself: P31 = **branch of psychology (Q60680430)** or **academic
discipline (Q11862829)**; the four no-P31 neuroscience subfields (cognitive/computational/systems/
affective) confirmed by exact label + scientific-field description + sitelink count (resolver's
standing "valid concepts may carry no P31" note).

### Planted-trap confirmation (the audit independently re-caught QC's two hardest calls)
- **psychometrics Q506132**: agent independently confirmed the discipline, and that the test-object
  **Q873512** ("psychological test", P31 instrument-class) is a *separate* entity — the object-vs-discipline
  homonym QC overrode. Trap avoided.
- **behavioral-neuroscience Q846566**: agent confirmed the alias overlap (*biological psychology /
  biopsychology / psychobiology*) is the **expected absorption** of the biological-psychology node, not
  an error; and that computational-neuroscience is the field, not conflated with computational cognitive science.
- **social-psychology Q161272**: agent confirmed P31 = branch of psychology, NOT sociology (the trap),
  despite the description mentioning sociology.

## Significance
The inline audit ran on QIDs the resolver + multi-signal QC had already passed and found **0 residual
errors** — but it remains a distinct failure-mode net (medicine #18 precedent: the audit caught
infectious-diseases, a disease-object that resolver + grounding both passed). The clean result here
reflects that cognitive science's homonym traps are concept-vs-discipline (cognition/perception/decision-
making as processes) which QC's wrong-referent overrides (psychometrics, + the 3 honest gaps) had already
neutralized before the audit ran.

## Tally
- **0 residual errors corrected** (none found). Golden-set +22 verified (+1 manual-path psychometrics,
  +3 upstream_gap), regression 0 (21 pass / 0 fail / 4 info).
- **Cumulative confirmed residual errors: 2** (both seed-era — life-sciences Q864, arts Q735; unchanged).
  **Pipeline-generated audited: 0 residual / 311** (289 medicine-era + 22 cognitive-science). No audit-queue debt.
