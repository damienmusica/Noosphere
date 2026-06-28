# Stage 0 scoping — `pivotal-influence-v1`

Orchestrator scope (session #36, decision (67)). Deceased-only (living-person stop-point avoided). All
anchor endpoints confirmed `reviewed` in /data at scope time.

## Figures (5 nodes) + anchors
| node | class | independent reviewed anchor(s) |
|---|---|---|
| `person:friedrich-nietzsche` | pivotal-influence (flagship) | → `subfield:existentialism`, → `subfield:continental-philosophy` |
| `person:arthur-schopenhauer` | pivotal-influence | → `subfield:aesthetics` (independent; + person→person → Nietzsche/Freud) |
| `person:claude-levi-strauss` | pivotal-influence | ← `person:ferdinand-de-saussure` (existing reviewed person) |
| `person:sigmund-freud` | **founder-blocked** → resolved | founder of `subfield:psychoanalysis` (NEW §12 node) |
| `subfield:psychoanalysis` | skeleton (Freud's founded field) | part_of `field:psychology` |

## Edges (9)
Structural/founder: psychoanalysis→psychology (part_of); freud→psychoanalysis (founded_or_formalized).
Influence anchors: nietzsche→existentialism; nietzsche→continental-philosophy; schopenhauer→nietzsche;
schopenhauer→aesthetics; saussure→levi-strauss (directness-contested).
**clause-6 v2 firing-test candidates:** nietzsche→freud; schopenhauer→freud.

## Deferred (honest gaps)
- Wittgenstein — founder-overlap (analytic-philosophy/philosophy-of-language formalizer) + his clause-6
  case (Vienna Circle misreading) is **target-node-blocked** (`vienna-circle`/`logical-positivism` absent).
- Jakobson — candidate node for the Saussure→Lévi-Strauss mediation chain.

## Endpoint status check (scope time)
existentialism, continental-philosophy, aesthetics, metaphysics, semiotics, analytic-philosophy,
philosophy-of-language, clinical-psychology, psychiatry, psychology, `person:ferdinand-de-saussure` —
all `reviewed`. psychoanalysis / structural-anthropology / vienna-circle / logical-positivism — absent.
