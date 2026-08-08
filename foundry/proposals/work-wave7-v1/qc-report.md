# QC report — `work-wave7-v1`

Session #65, 2026-08-08. QC/adjudication = orchestrator (self-reported model ID `claude-fable-5`);
generation = separated-context `claude-sonnet-5` (see `report.md`). Identity QC = live wbsearch +
wbgetentities (P31/P50/P577/sitelinks); claim QC rides quotes already machine-verified in session-64
batches plus two fresh SEP/IEP corroborations fetch-verified here.

## Outcomes — 5 works + 5 `canonical_work` edges → reviewed

| edge | conf | identity |
|---|---|---|
| `edge:being-and-time-canonical-work-martin-heidegger` | 0.94 | Q404567 — P50 Q48301 ✓, P577 1927, 44 sitelinks |
| `edge:being-and-nothingness-canonical-work-jean-paul-sartre` | 0.93 | Q119709 — P50 Q9364 ✓, P577 1943, 41 sitelinks |
| `edge:micrographia-canonical-work-robert-hooke` | 0.93 | Q2469465 — P50 Q46830 ✓, P577 1665-01, 22 sitelinks |
| `edge:either-or-canonical-work-soren-kierkegaard` | 0.87→**0.9** | Q1152009 — P50 Q6512 ✓, P577 1843, enwiki "Either/Or (Kierkegaard book)" |
| `edge:process-and-reality-canonical-work-alfred-north-whitehead` | 0.9 | Q455957 — P50 Q183372 ✓, P577 **1929 original** |

- **Every generator edition-risk flag adjudicated at identity**: all five admitted items are the
  original works; P50 matches the corpus QID of the person endpoint in all five cases. Version items
  excluded: Q138507382 (Either/Or paperback), Q126697610 (Process and Reality paperback).
- **Two bibliographic twins excluded and recorded** (the work-wave6 human-problem-solving failure
  shape, cleanly discriminated this time): Q140253239 and Q130330690 — both P50-less, 0 sitelinks.
- **Either/Or repaired at QC**: the flagged single-source weakness closed with SEP Kierkegaard
  (sum2026) body prose ("the text that he considered properly to begin his authorship, Either/Or …
  published in 1843"); pseudonymity (Victor Eremita) recorded on the edge note, not resolved away.
- **Process and Reality boundary kept**: work→person only; the held `person:alfred-north-whitehead`
  founded_or_formalized NEI and its unblock are untouched.

## Machine checks

- identity 5/5 live (`wbgetentities`) · fetch-verify **PASS 11/12 · MISS 0** (1 = Britannica live
  403; the quote was extracted verbatim from the recorded Wayback snapshot by the orchestrator) ·
  ladder-check green (`node-promotion-v1` ×5, `canonical-work-auto-88` ×5).

## Evidence-permanence anchors

- SEP fixed editions (snapshot not required, §8): https://plato.stanford.edu/archives/sum2026/entries/heidegger/ · https://plato.stanford.edu/archives/sum2026/entries/sartre/ · https://plato.stanford.edu/archives/sum2026/entries/kierkegaard/
- https://en.wikipedia.org/w/index.php?title=Martin_Heidegger&oldid=1366448599
- https://en.wikipedia.org/w/index.php?title=Jean-Paul_Sartre&oldid=1367693189
- https://en.wikipedia.org/w/index.php?title=Robert_Hooke&oldid=1367205638
- https://en.wikipedia.org/w/index.php?title=S%C3%B8ren_Kierkegaard&oldid=1365518285
- https://en.wikipedia.org/w/index.php?title=Alfred_North_Whitehead&oldid=1361815510
- https://web.archive.org/web/20260802113204/https://iep.utm.edu/existent/
- https://web.archive.org/web/20260806154147/https://iep.utm.edu/whitehead/
- https://web.archive.org/web/20260714155139/https://www.britannica.com/biography/Robert-Hooke
