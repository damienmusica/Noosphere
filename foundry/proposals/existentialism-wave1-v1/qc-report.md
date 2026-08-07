# QC report — `existentialism-wave1-v1`

Session #64, 2026-08-08. QC/adjudication = orchestrator (self-reported model ID `claude-fable-5`);
verification = independent contexts that never opened this directory's proposals (each self-reported
`claude-fable-5`); generation = separated-context `claude-sonnet-5` (see `report.md`).

## Outcomes

| item | outcome |
|---|---|
| `person:soren-kierkegaard` + `edge:soren-kierkegaard-influenced-existentialism` | **reviewed**, 0.85 — Nietzsche parity (same SEP sentence, named first); founding refuted on referent-postdates-founder (~85y) |
| `person:jean-paul-sartre` + `edge:jean-paul-sartre-influenced-existentialism` | **reviewed**, 0.8 — `founded_or_formalized` **rejected** (zero founder-language anywhere; label coined by Marcel and applied TO him) |
| `person:martin-heidegger` + 3 edges (existentialism 0.85 · philosophy-of-technology 0.8 · phenomenology 0.8) | **reviewed** — label-disavowal recorded; the "Heidegger has no node" gap note refreshed same-file |
| `person:gabriel-marcel` + founder edge | **rejected** (unmarked reject probe — generator refused at generation time, verification confirmed 0.97); node declined without prejudice |

★ Substantive finding: **no `founded_or_formalized` edge exists in this batch** — at the
person-to-existentialism grain, founding-grade language could not be supported for any slate figure.
SEP Existentialism uses no founding language for anyone. The founding layer is honestly an influence layer.

## Machine checks

- identity: 3/3 live — Q6512, Q9364, Q48301.
- fetch-verify: **PASS 13/15 · MISS 0**; 2 UNVERIFIED = Britannica live 403, both quotes
  machine-checked verbatim by the orchestrator against the recorded Wayback snapshots below, in the
  article-body lead (metadata/openGraph copies disregarded).
- ladder-check: green (`node-promotion-v1` ×3, `a-relation-auto-68` ×5).
- ★ SEP live-vs-edition discrepancy caught by the machine check and recorded in the decision file:
  the live Philosophy of Technology entry's "notably Heidegger" sentence and disavowal sentence are
  **not in the sum2026 fixed edition** this batch anchors; quotes were re-taken sum2026-verbatim
  (the claim survives identically in both texts).

## Evidence-permanence anchors

- SEP fixed editions (snapshot not required, §8): https://plato.stanford.edu/archives/sum2026/entries/existentialism/ · https://plato.stanford.edu/archives/sum2026/entries/technology/ · https://plato.stanford.edu/archives/sum2026/entries/phenomenology/
- https://en.wikipedia.org/w/index.php?title=S%C3%B8ren_Kierkegaard&oldid=1365518285
- https://en.wikipedia.org/w/index.php?title=Jean-Paul_Sartre&oldid=1367693189
- https://en.wikipedia.org/w/index.php?title=Martin_Heidegger&oldid=1366448599
- https://en.wikipedia.org/w/index.php?title=Phenomenology_(philosophy)&oldid=1362572183
- https://en.wikipedia.org/w/index.php?title=Existentialism&oldid=1357728536
- https://web.archive.org/web/20260802113204/https://iep.utm.edu/existent/
- https://web.archive.org/web/20260802124050/https://www.britannica.com/biography/Soren-Kierkegaard
- https://web.archive.org/web/20260723084244/https://www.britannica.com/biography/Jean-Paul-Sartre

## Future candidates (recorded, not proposed)

`canonical_work` wave for *Being and Time* / *Being and Nothingness* (IEP work-level groundwork
language); Christian-existentialism-grain examination for Marcel.
