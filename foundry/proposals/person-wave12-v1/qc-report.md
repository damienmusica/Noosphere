# QC report — `person-wave12-v1`

Session #62. **The slate of people that already-reviewed edge notes demanded but the corpus lacked** —
ten candidates, every one of them named inside a `reviewed` edge's own note as an honest gap. Edge
demand verifiable in `/data`, not asserted.

Generation: three separated-context **Claude Sonnet 5** agents (`proposal-generator`), no network,
provider IDs banned — a post-hoc grep of all six proposal files found zero QIDs, so proposal contract
v2 held. Identity resolution and adversarial refutation: ten **independent** verifier contexts
(claude-sonnet-5) that never read the proposals and worked from `/data` plus live sources.
Adjudication: orchestrator (**claude-fable-5**). Decision file:
`foundry/decisions/person-wave12-v1.json` (authoritative).

## Outcome — half the slate did not survive

**Promoted (5 nodes, 5 edges).** Remak → cell-theory (`founded_or_formalized`); Maxwell and Gibbs →
statistical-physics (`founded_or_formalized`); Lorentz → theory-of-relativity (`influenced`,
mirroring Poincaré); Principia Mathematica → Whitehead (`canonical_work`, completing the Russell leg).

**Reversed (5), each by a rule this corpus had already paid for.**

| Candidate | Outcome | The rule that fired |
|---|---|---|
| William Whewell | rejected | Role separation — four sources agree he **coined the name** and all four separate that from Hutton's origination and Lyell's popularisation. No taxonomy relation expresses "coined the term for". |
| Marcus von Plenciz | held | Same rule: the only relation-stating source says "expanded upon". Even `influenced` misses the ≥2 claim-stating floor. |
| Nikolai Trubetzkoy | held (NEI) | Grain. His own edge note *invited* a founder edge; live sourcing puts founder-grade language at **morphophonology**, not phonology, with a prior claimant (Baudouin de Courtenay). |
| John Mauchly | held | Grain, and consistency — see below. |
| J. Presper Eckert | held | Verification split the pair on identical evidence (Mauchly reject / Eckert supported). The split is an artifact of two search paths, not a fact about the two men; admitting one would put an asymmetric pair in `/data`. Both held; the right home is `work:eniac`/`work:edvac` via `canonical_work`. |

## Orchestrator error, recorded

The generation order asserted that a prior wave had **declined** von Plenciz an edge. It had not —
`grep` of `foundry/decisions/person-wave11-v1.json` and its proposals returns zero rejection, held or
verdict entries for him; he existed only inside another edge's note. A fabricated precedent was fed to
a generator and a verifier. The verdict survives because it rests on live sources rather than the
premise, but the error is recorded in the decision file's held entry and notes.

## Verification

`ladder-check` ✓ (every reviewed outcome sanctioned) · `fetch-verify` **18/18 PASS · MISS 0** against
the anchored revisions · identity resolved live for all five (never from memory), P570 present for
all five so decision (70) does not engage · homonyms explicitly ruled out (Remak's grandson the
mathematician; Gibbs's father the linguist; a same-label non-person entity for Lorentz).

Two `[SPN-FAILED]` pending anchors remain on the Lorentz corroborating sources (MacTutor, Nobel
biographical); both carry a stale-but-live snapshot, and the claim does not depend on them — enwiki
Theory of relativity states it independently and is oldid-anchored.

## Evidence permanence anchors

| Source | Anchor |
|---|---|
| en.wikipedia.org/wiki/Alfred_North_Whitehead | `https://en.wikipedia.org/w/index.php?title=Alfred_North_Whitehead&oldid=1361815510` |
| en.wikipedia.org/wiki/Cell_theory | `https://en.wikipedia.org/w/index.php?title=Cell_theory&oldid=1365081375` |
| en.wikipedia.org/wiki/James_Clerk_Maxwell | `https://en.wikipedia.org/w/index.php?title=James_Clerk_Maxwell&oldid=1365632977` |
| en.wikipedia.org/wiki/Josiah_Willard_Gibbs | `https://en.wikipedia.org/w/index.php?title=Josiah_Willard_Gibbs&oldid=1366423689` |
| en.wikipedia.org/wiki/Principia_Mathematica | `https://en.wikipedia.org/w/index.php?title=Principia_Mathematica&oldid=1356011315` |
| en.wikipedia.org/wiki/Robert_Remak | `https://en.wikipedia.org/w/index.php?title=Robert_Remak&oldid=1341566404` |
| en.wikipedia.org/wiki/Rudolf_Virchow | `https://en.wikipedia.org/w/index.php?title=Rudolf_Virchow&oldid=1361411508` |
| en.wikipedia.org/wiki/Statistical_mechanics | `https://en.wikipedia.org/w/index.php?title=Statistical_mechanics&oldid=1365220532` |
| en.wikipedia.org/wiki/Theory_of_relativity | `https://en.wikipedia.org/w/index.php?title=Theory_of_relativity&oldid=1346554258` |
| mathshistory.st-andrews.ac.uk/Biographies/Lorentz/ | `https://web.archive.org/web/20260419144237/https://mathshistory.st-andrews.ac.uk/Biographies/Lorentz/` |
| plato.stanford.edu/entries/principia-mathematica/ | `https://plato.stanford.edu/archives/sum2026/entries/principia-mathematica/` |
| www.nobelprize.org/prizes/physics/1902/lorentz/biographical/ | `https://web.archive.org/web/20260716151655/https://www.nobelprize.org/prizes/physics/1902/lorentz/biographical/` |
| www.wikidata.org/wiki/Q153243 | `https://www.wikidata.org/w/index.php?title=Q153243&oldid=2521828847` |
| www.wikidata.org/wiki/Q183372 | `https://www.wikidata.org/w/index.php?title=Q183372&oldid=2522970411` |
| www.wikidata.org/wiki/Q41688 | `https://www.wikidata.org/w/index.php?title=Q41688&oldid=2522912916` |
| www.wikidata.org/wiki/Q62088 | `https://www.wikidata.org/w/index.php?title=Q62088&oldid=2523976253` |
| www.wikidata.org/wiki/Q9095 | `https://www.wikidata.org/w/index.php?title=Q9095&oldid=2518558494` |
