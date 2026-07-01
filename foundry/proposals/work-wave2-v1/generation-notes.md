# work-wave2-v1 — generation notes

Batch: Phase-2 work layer, wave 2. Proposer: Claude Sonnet (model_version `claude-sonnet-5`),
proposed_at 2026-07-01. Everything in this batch is `generated`-tier / `status: "proposed"` in
the artifact files. Nothing here is verified; all Wikidata QIDs are unresolved best-guess
recollections pending the orchestrator's independent live resolution. This is a proposal
artifact under `foundry/proposals/`; it is not canonical `/data` and must not be treated as
ground truth by any other agent or process. I did not self-QC anything below.

## Scope reconciliation against `/data`

Checked `data/nodes.json` before generating. All 9 author person nodes
(`person:claude-shannon`, `person:norbert-wiener`, `person:gottlob-frege`, `person:alan-turing`,
`person:sigmund-freud`, `person:kenneth-arrow`, `person:cesare-beccaria`, `person:john-snow`,
`person:wilhelm-wundt`) plus the probe target `person:john-von-neumann` exist as `reviewed`,
non-living (`is_living_person: false`) nodes, with `domain` matching the order's assignments in
every case. All 9 target subfield nodes (`subfield:information-theory`, `subfield:cybernetics`,
`subfield:mathematical-logic`, `subfield:computability-theory`, `subfield:psychoanalysis`,
`subfield:social-choice-theory`, `subfield:criminology`, `subfield:epidemiology`,
`subfield:experimental-psychology`) exist and are `reviewed`. None of the 9 candidate work IDs
collide with existing `work:*` nodes in `/data` (wave-1's 9 works are already promoted there
under different IDs). All evidence source IDs used (`source:wikipedia`, `source:sep`,
`source:encyclopedia-of-mathematics`, `source:nobelprize`, `source:oxford-bibliographies`) exist
in `data/sources.json`. I did not use `source:mactutor` anywhere in this batch, consistent with
the order's explicit caution that it is a mathematics-only archive — not even for the
formal-sciences authors (Shannon, Wiener, Frege, Turing), since MacTutor's actual coverage of
Shannon/Wiener/Turing as historical mathematicians is uncertain to me and I preferred
`source:encyclopedia-of-mathematics` or `source:sep` where a logic/math-adjacent specialist
source was wanted, plus Wikipedia as the second leg.

## Per-work QID guesses, confidence, and disambiguation notes

1. **work:a-mathematical-theory-of-communication** — QID guess `Q1770447`. Confidence: low-moderate.
   **Flagged ambiguous.** I am not confident Wikidata models this specific paper as a distinct
   work item separate from its description within Shannon's person item; if it exists, the
   resolver should confirm P50 (author) = Shannon (Q92760) and P577 (pub date) = 1948.

2. **work:cybernetics** — QID guess `Q1230999`. Confidence: moderate. **Flagged ambiguous**
   because the title "Cybernetics" is short and generic, raising real risk of collision with a
   disambiguation page, the general concept item, or a different book/journal of the same name.

3. **work:begriffsschrift** — QID guess `Q383092`. Confidence: moderate-high on existence of a
   dedicated item (Begriffsschrift is a well-known, uniquely-named coined term with essentially
   no title collision risk), lower on the exact digit string. Not flagged ambiguous — the
   identity/attribution claim itself is solid; only the digits are a guess.

4. **work:on-computable-numbers** — QID guess `Q1798463`. Confidence: moderate. **Flagged
   ambiguous** for two reasons: (a) QID precision, and (b) this is a journal paper (Proceedings
   of the London Mathematical Society, series 2, vol. 42), not a book — same paper/book-type
   consideration as wave-1's Mendel precedent, which the batch report there resolved as
   acceptable (`work` covers papers). I did not treat this as a blocking issue, only a flag.

5. **work:the-interpretation-of-dreams** — QID guess `Q844976`. Confidence: moderate-high on
   existence, lower on digits. **Flagged ambiguous** on a dating nuance: first published November
   1899 but backdated "1900" by the publisher (Franz Deuticke) — the order's stated "1899/1900"
   already reflects this, but I flag it in case the resolver finds Wikidata using a single fixed
   P577 that could look inconsistent with either year cited in different secondary sources.

6. **work:social-choice-and-individual-values** — QID guess `Q7554466`. Confidence: moderate.
   **Flagged ambiguous**: the 1951 monograph grew out of Arrow's 1951 Columbia doctoral
   dissertation of a similar/identical title; Wikidata may model the dissertation and the
   Wiley-published monograph as one item or two, and I am not confident which QID (if either
   guess is close) represents the citable "work."

7. **work:on-crimes-and-punishments** — QID guess `Q1053526`. Confidence: moderate. **Flagged
   ambiguous** for an authorship-history nuance (not an identity risk): the 1764 first edition
   was published anonymously in Livorno due to the controversial nature of its arguments against
   torture and capital punishment; Beccaria's authorship was established within a couple of years
   and is uncontroversial today, but it is a genuine historical wrinkle distinct from the other
   entries in this batch.

8. **work:on-the-mode-of-communication-of-cholera** — QID guess `Q6075331`. Confidence:
   moderate. **Flagged ambiguous**: Snow published a shorter 1849 pamphlet under the same title
   and then a substantially expanded 1855 second edition incorporating the Broad Street pump
   analysis; the order's "1855" date points to the second edition, which is also the one
   standardly cited as the founding epidemiological text, but Wikidata may model these as
   separate items or a single umbrella item — the resolver should confirm which QID corresponds
   to the 1855 edition specifically.

9. **work:principles-of-physiological-psychology** — QID guess `Q1974779`. Confidence:
   moderate. **Flagged ambiguous**: the work went through six substantially revised editions
   across Wundt's lifetime (1874 through the early 1900s), each expanding considerably; I
   targeted the 1874 first edition per the order's date, but Wikidata may model the work as a
   single umbrella item, the first edition specifically, or a later canonical edition — genuinely
   uncertain which the resolver will find.

Overall: I am less confident across this entire batch's QIDs than I was in wave-1 for the most
famous entries (Darwin, Newton) — these nine works are all real and canonical, but several titles
(Cybernetics, Begriffsschrift, Grundzüge der physiologischen Psychologie) are less
"household-name" than Origin of Species or Principia in terms of my training exposure to their
specific Wikidata identifiers. I did not inflate confidence to compensate.

## Per-edge grounding rationale (summary)

- **Field-level edges (work → subfield)**: confidence 0.93–0.95. All nine are standard,
  low-controversy "founding text of X" claims well attested in general reference and specialist
  (SEP, Encyclopedia of Mathematics, Nobel Prize) material. None flagged ambiguous at the
  field-canonicity level — I have genuine high confidence in all nine field attributions
  themselves (only the QIDs are uncertain, which is recorded at the node level, not re-flagged
  redundantly at the edge level unless the edge claim itself carries additional risk).
- **Person-level edges (work → author)**: confidence 0.9–0.95, all single-author, uncontested
  attributions. Two are flagged `ambiguous: true` for genuine historical/scoping nuances rather
  than identity doubt: Frege (multiple major works; this edge scopes specifically to the
  logic-founding text, not Grundgesetze der Arithmetik) and Beccaria (original anonymous
  publication). The other seven person-edges are not flagged — I have no genuine doubt about
  sole authorship or defining-work status for Shannon, Wiener, Turing, Freud, Arrow, Snow, or
  Wundt, and did not launder false caution into them.
- Two independent sources were supplied for every real edge (18/18), per the order's
  preference. `source:nobelprize` was used for both Arrow edges since Arrow's Nobel citation
  directly corroborates this specific work's canonical status. `source:oxford-bibliographies`
  was used for the Snow edges as a specialist history-of-epidemiology-adjacent source, avoiding
  `source:mactutor` entirely as instructed.

## Reject probes — explicit reasoning

- **R1 — `work:a-mathematical-theory-of-communication` → `person:john-von-neumann`
  (`canonical_work`)**: Intended flaw is **misattribution to a historically-adjacent
  non-author**. Von Neumann and Shannon were contemporaries and correspondents at Bell Labs/IAS,
  and there is a well-known (though disputed-in-detail) anecdote that von Neumann suggested
  Shannon call his uncertainty measure "entropy" — a real connection that makes this a
  genuinely plausible-looking probe rather than an arbitrary wrong name. But von Neumann is not
  an author of the 1948 paper; Shannon alone is. I set `confidence: 0.3` (well below the batch's
  normal floor) and `"probe": "reject-expected"`.
- **R2 — `work:on-computable-numbers` → `subfield:information-theory` (`canonical_work`)**:
  Intended flaw is **anachronism/cross-attribution between adjacent formal-sciences subfields**.
  Turing's 1936 computability paper predates Shannon's 1948 information-theory paper by 12 years
  and addresses a different (though loosely adjacent) question — computability/decidability
  versus quantifying information and channel capacity. Turing's paper is not the founding text of
  information theory. I set `confidence: 0.2` and expect outright rejection. I deliberately chose
  an *adjacent*-subfield probe here (rather than a wildly unrelated field, as wave-1's R2 used
  physics vs. evolutionary biology) to test a harder discrimination case within the same domain.

## Coverage decisions — what was deliberately left out

- No edges beyond the required 2-per-work triangle were proposed (9 works × 2 = 18 real edges),
  per the order's exact scope. I did not add `part_of`, `influenced`, `founded_or_formalized`, or
  other relation types even where plausible (e.g., Wiener's Cybernetics arguably also
  relates to `subfield:computability-theory` or `field:computer_and_information_sciences` via
  feedback-control's later influence on computing) — out of scope for this wave.
- I did not attempt any network/QID verification — no network access permitted in this role;
  every QID is an unverified recollection, labeled as such in both the node's `uncertainty`
  field and this document. The orchestrator's live-resolution pass is the actual verification
  step, matching the wave-1 precedent where 9/9 of my QID guesses were wrong on the exact digit
  string despite correct real-world identity.
- I did not add a `disputed` flag to any item. None of these nine works have a genuine
  real-world contested-authorship or contested-canonicity dispute at the level `disputed: true`
  is meant to capture. The two probes are deliberately wrong claims, not live disputes, so they
  are marked `probe`/`ambiguous`, not `disputed`.
- I did not propose a work for a tenth candidate field/subfield beyond the order's list (e.g., no
  attempt to backfill `subfield:cognitive-science` broadly or add a second canonical text per
  field) — strictly the 9 named candidates.

## What QC should look at first

1. **Live-resolve all 9 QIDs** — the single highest-value QC action. Based on the wave-1
   precedent (9/9 generator QID guesses wrong on exact digits, though right on real-world
   identity), expect most or all of these guesses to need correction. Lowest-confidence guesses:
   `a-mathematical-theory-of-communication`, `cybernetics`, `social-choice-and-individual-values`,
   `on-the-mode-of-communication-of-cholera`, `principles-of-physiological-psychology`.
2. **Edition/version identity** for Beccaria (anonymous 1st ed.), Snow (1849 vs. 1855 editions),
   Arrow (dissertation vs. monograph), and Wundt (six editions) — confirm which QID the resolver
   finds actually represents the year/edition cited in the order's table.
3. **Frege person-edge scoping** — confirm that anchoring Frege's canonical-work edge to
   Begriffsschrift specifically (rather than Grundgesetze der Arithmetik or Die Grundlagen der
   Arithmetik) is the correct modeling choice for the mathematical-logic subfield target.
4. **Confirm both reject probes are actually rejected** — R1 (von Neumann misattribution) and R2
   (Turing/information-theory cross-attribution) are constructed to be non-obvious; if either is
   NOT rejected, that is a finding about the QC pipeline's discrimination power on
   historically-adjacent-figure and adjacent-subfield cases specifically, which are harder than
   wave-1's probes (wave-1 used a real co-discoverer and a cross-domain/cross-era mismatch;
   this wave's probes are narrower-margin tests).
5. **`work:on-computable-numbers` type-fit** — same paper-vs-book scope question as wave-1's
   Mendel entry; likely already settled by that precedent but worth a one-line confirmation.

## Labels and summaries (for node-translations, English/`en`) — offered for convenience, not authoritative

1. **work:a-mathematical-theory-of-communication** — Label: "A Mathematical Theory of
   Communication". Summary: "A 1948 paper by Claude Shannon that founded information theory,
   introducing entropy and channel capacity as measures of information."
2. **work:cybernetics** — Label: "Cybernetics: Or Control and Communication in the Animal and the
   Machine". Summary: "A 1948 book by Norbert Wiener that coined the term 'cybernetics' and
   founded the study of control and communication in animals and machines."
3. **work:begriffsschrift** — Label: "Begriffsschrift". Summary: "An 1879 work by Gottlob Frege
   introducing the first complete system of quantificational logic, foundational to modern
   mathematical logic."
4. **work:on-computable-numbers** — Label: "On Computable Numbers, with an Application to the
   Entscheidungsproblem". Summary: "A 1936 paper by Alan Turing introducing the Turing machine
   and proving the undecidability of the Entscheidungsproblem, founding computability theory."
5. **work:the-interpretation-of-dreams** — Label: "The Interpretation of Dreams". Summary: "An
   1899/1900 work by Sigmund Freud introducing the theory of the unconscious and dream
   interpretation, foundational to psychoanalysis."
6. **work:social-choice-and-individual-values** — Label: "Social Choice and Individual Values".
   Summary: "A 1951 monograph by Kenneth Arrow proving the impossibility theorem and founding
   modern social choice theory."
7. **work:on-crimes-and-punishments** — Label: "On Crimes and Punishments". Summary: "A 1764
   work by Cesare Beccaria arguing for proportionate, rational criminal punishment and against
   torture and capital punishment, founding classical criminology."
8. **work:on-the-mode-of-communication-of-cholera** — Label: "On the Mode of Communication of
   Cholera". Summary: "An 1855 work by John Snow establishing waterborne transmission of cholera
   through the Broad Street pump investigation, founding modern epidemiology."
9. **work:principles-of-physiological-psychology** — Label: "Principles of Physiological
   Psychology". Summary: "An 1874 work by Wilhelm Wundt arguing for psychology as an independent
   experimental science, foundational to experimental psychology."
