# phase2-summaries-v1 — works-remainder report

Session #53, editorial summary generator (Opus, `claude-opus-4-8`). Separated
generation context (ADR 0007): everything here is an untrusted `generated`
draft. QC is performed by a separate orchestrator; this report does **not** QC
its own output.

## What was generated

- **File:** `foundry/proposals/phase2-summaries-v1/works-remainder.proposed.json`
- **21 work-node summaries** (English, 2–4 sentences each, 2–3 `source_hints`
  each, per-item `rationale`). Standard bibliographic/canonical content:
  what the text is, author, approximate date, and why it is canonical/founding
  for its field. No overclaiming of singular "the first" except where standard
  (e.g. Frege's first modern predicate logic).
- Batch envelope matches the accepted batch shape (`version` 1, `batch_id`
  `phase2-summaries-v1`, `kind` `node-summary`, `proposed_by` Claude Opus /
  claude-opus-4-8 / 2026-07-02).
- Written to a **new file** to avoid clobbering the already-accepted 32-item
  `summaries.proposed.json`. Verified: **zero node_id overlap** between the two
  files; all 21 target IDs present; no missing/extra/duplicate IDs; JSON parses.
- QIDs read from `data/nodes.json` (recorded in each rationale) — none invented.

## Living-author works (write about the text, not the person)

Two works have living authors; per the coordinator's instruction and decision
(70) posture, each summary is about the **artifact**, not the author's
biography:

- `work:syntactic-structures` (author Noam Chomsky, living) — text-focused,
  attributed founding wording ("widely regarded as a founding work"); SEP
  deliberately omitted (see slug flags).
- `work:the-social-stratification-of-english-in-new-york-city` (author William
  Labov, treated as living per coordinator) — text-focused; **no aliveness or
  death claim made about Labov** (an earlier internal draft had incorrectly
  described him as deceased — corrected: this summary asserts nothing about his
  life status).

## Source-hint slugs flagged as GUESSES (for orchestrator to live-verify)

Wikipedia article URLs are the reliable anchors throughout. The following
non-Wikipedia or uncertain-title slugs are best-guesses and are flagged in the
per-item rationale:

- **SEP slugs (batch-1 history: SEP `chomsky` 404'd):**
  `frege`, `frege-logic` (begriffsschrift); `beccaria` (on-crimes);
  `arrows-theorem` (social-choice); `settheory-early` (grundlagen…);
  `boole` (laws-of-thought); `levi-strauss` (structural-anthropology).
  SEP `durkheim`, `comte`, `husserl`, `russell` are believed reliable.
  SEP was **deliberately omitted** for `work:syntactic-structures` because the
  batch-1 QC log recorded SEP `chomsky` as a 404.
- **Britannica slugs (guessed):** `De-humani-corporis-fabrica-libri-septem`
  (topic); `Carolus-Linnaeus` (biography — may redirect to `Carl-Linnaeus`);
  `Georg-Ferdinand-Ludwig-Philipp-Cantor` (long-form biography);
  `Max-Weber-German-sociologist` (disambiguated biography);
  `Syntactic-Structures` (topic).
- **Wikipedia article-title uncertainty (verify the article exists / exact
  title; several works may live under the author biography or the German
  title rather than a dedicated English page):**
  `Traité_élémentaire_de_chimie` (accented, URL-encoded — may be under English
  title); `Experiments_on_Plant_Hybridization`;
  `Cybernetics:_Or_Control_and_Communication_in_the_Animal_and_the_Machine`
  (long title, likely redirect); `Principles_of_Physiological_Psychology`;
  `Georg_Cantor` (grundlagen… likely has no standalone work article — anchored
  on the Cantor biography); `The_Mind_of_Primitive_Man`;
  `Course_of_Positive_Philosophy`; `Logical_Investigations_(Husserl)`
  (disambiguator guessed); `Structural_Anthropology_(book)` (disambiguator
  guessed); `The_Social_Stratification_of_English_in_New_York_City` (may have
  no standalone article — anchored also on the Labov biography).

## Not-confidently-summarized

None. All 21 works were summarized with standard reference content. The two
items carrying the most title/anchor uncertainty are
`work:grundlagen-einer-allgemeinen-mannigfaltigkeitslehre` and
`work:the-social-stratification-of-english-in-new-york-city`, both of which may
lack a dedicated Wikipedia article — each is additionally anchored on the
author biography page so QC has a live fallback.
