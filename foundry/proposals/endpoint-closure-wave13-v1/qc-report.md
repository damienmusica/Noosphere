# QC report — `endpoint-closure-wave13-v1`

Session #63, 2026-07-31. Generation = three separated-context **Claude Sonnet 5** agents (no network,
provider IDs banned by contract v2) + a batch critic that read all six proposal files against `/data`.
Verification = **seven independent contexts**, one per claim, none of which opened
`foundry/proposals/`, each required to resolve identity live and then attempt to **refute** its own
claim. Adjudication = orchestrator.

**Model self-report.** Generators reported `claude-sonnet-5`. The verifier contexts reported
`claude-opus-5` — i.e. a tier below the session's nominal Fable 5, consistent with the harness's
recorded mid-session fallback behaviour. Per repo convention the session transcript JSONL is the
ledger of record for provenance; `qc_by` in the decision file records the orchestrator, not the
verifiers.

## Outcome: 3 admitted, 4 reversed

| Claim | Verdict | Why |
|---|---|---|
| `subfield:morphophonology` | **admitted** | Q661093 live; recognized named branch of linguistics |
| `person:nikolai-trubetzkoy` | **admitted** | Q159491 live; P570 1938 present |
| `person:antonie-van-leeuwenhoek` | **admitted** | Q43522 live; journal namesake excluded |
| `morphophonology → part_of → linguistics` | **admitted, placement corrected** | see below |
| `trubetzkoy → founded_or_formalized → phonology` | **admitted, reverses a hold** | see below |
| `leeuwenhoek → founded_or_formalized → microbiology` | **admitted** | see below |
| `subfield:process-philosophy` | **rejected** | wrong node type and fails the dual criterion |
| `whitehead → founded_or_formalized → process-philosophy` | **NEI** | the source that should support it contradicts it |
| `baudouin-de-courtenay → influenced → morphophonology` | **rejected** | target refuted, better target surfaced |
| `trubetzkoy → founded_or_formalized → morphophonology` | **disputed** | coinage-vs-founding split, stops at clause-6 v2 |

## The reversals are the batch's real output

**★ `subfield:process-philosophy` rejected — the order's headline slate item.** The ratified
philosophy authority files it as a *theory*, not a field: the PhilPapers breadcrumb reads verbatim
`Metaphysics > Global Metaphysical Theories > Process Philosophy`, with Logical Atomism among its
siblings — which is decision (73) structural rule 5's second branch verbatim (bounded doctrine →
`concept` node). Live philpapers.org is Cloudflare-403, so the §8 Wayback path was used:
`http://web.archive.org/web/20260218155005/https://philpapers.org/browse/process-philosophy` (200).
The dual criterion then fails on limb (a): the LCC philosophy schedule (`lcco_b.pdf` downloaded,
23 pages, extracted) has no process-philosophy division; `id.loc.gov` classification suggest returns
only `Z7128.P88`, a *bibliography* cutter; UDC class 14 expands only to 140/141; Wikidata Q2114360
carries **no P279 at all**. SEP's own entry negates the "school" half in one sentence —
"process philosophy is a complex and highly diversified field that is not tied to any school,
method, position, or even paradigmatic notion of process." The verifier also reported what cuts the
*other* way and was not hidden: LCSH `sh85107138` gives `skos:broader = Philosophy`, and the corpus's
existing sibling schools were seeded 2026-06-10 and are labelled "grandfathered" by decision (73) —
they establish that the shape exists, not that a new candidate clears the gate.

**★ `whitehead → process-philosophy` NEI — the corpus's own summary is the thing contradicted.**
SEP's Whitehead entry states twice that no school formed around him: "Whitehead did not, however,
inspire any school of thought during his lifetime" and "Whitehead's philosophical views posthumously
inspired the movement of process philosophy". SEP's process-philosophy entry names a different
founder outright — "it is the Greek theoretician Heraclitus of Ephesus … who is commonly recognized
as the founder of the process approach" — and places Whitehead downstream of Hegel. Inverted coinage
risk: Whitehead called his own position "philosophy of organism"; the label was applied to him by
others. REP supports only a narrower plural claim, "the movement inaugurated by Whitehead and
extended by Hartshorne". **This leaves a live finding in `/data`, not just a declined edge:** the
reviewed, indexable en summary of `person:alfred-north-whitehead` says "He created the philosophical
school known as process philosophy" — a faithful quote of enwiki, contradicted by SEP. Recorded for
an editorial pass, not silently rewritten here.

**★ `morphophonology` placement corrected against the generator.** The generator proposed a §13
co-equal cross-listing under *both* `subfield:phonology` and `subfield:morphology`. Verification
refused it: every source that states a genus makes **linguistics** the parent (Britannica
"morphophonemics, in linguistics, study of the relationship between morphology and phonology";
enwiki "the branch of linguistics that studies the interaction…"; Crystal's *Dictionary of
Linguistics and Phonetics* "A branch of linguistics"), while the language relating it to the two
neighbours is *interface* language, not membership language. Wikidata agrees structurally:
`P361 = Q8162` linguistics, no `P279`, and no `P361`/`P279` to Q40998 or Q38311. Cross-listing is
for genuine co-equal membership, not for a field that sits between two others by subject matter.

**★ `trubetzkoy → phonology` reverses the `person-wave12-v1` hold, on that hold's FIRST branch.**
The hold's own unblock clause read "either ≥2 independent claim-stating sources at the phonology
grain, or a `subfield:morphophonology` node". Wave 12's verifier found one such source; this pass
found four: Oxford Bibliographies ("regarded by many as the creator of the science of phonology"),
the University of Vienna "650 plus" history project ("considered the founder of phonology"),
Honeybone in *Key Thinkers in Linguistics and the Philosophy of Language* ("One of the founding
fathers of phonology"), and enwiki Roman Jakobson (joint founding with Jakobson). Two of the four
are used as evidence because their providers are registered in `data/sources.json`; the other two
are recorded on the edge note as read-but-unregistered. **This is a search-path difference, not a
change in the world** — the same phenomenon wave 12 recorded when its verifiers split on Mauchly and
Eckert from identical evidence. Counterweight recorded, not resolved: Britannica designates no
founder of phonology at all and lists him among five "Key People", and Oxford Bibliographies partly
attributes his results to "his extension of Saussurean insights".

**★ `leeuwenhoek → microbiology`: the corpus's own note understated him.** The refutation target
handed to the verifier was the existing note's wording, "co-credited for early microscopy" — and it
did not survive contact with the sources. Britannica: "effectively began the discipline of
microbiology". enwiki Microbiology: "He is considered a father of microbiology". Two peer-reviewed
articles state the epithet flatly (Lane 2015, *Phil. Trans. R. Soc. B*, doi:10.1098/rstb.2014.0344,
PMC4360124; Kutschera 2023, *Microorganisms*, doi:10.3390/microorganisms11081994, PMC10458164) and
are recorded as corroboration rather than evidence entries, since neither provider is registered.

**`baudouin-de-courtenay → morphophonology` rejected, with a better target surfaced.** Every
reference work that treats morphophonology as its subject is silent about him — enwiki
Morphophonology (oldid 1360947317, full wikitext swept) mentions him **zero** times and traces the
origins to Jakobson and to Chomsky & Halle. What the sources do support is
`baudouin-de-courtenay → influenced → phonology`. Held with that target named, not admitted here:
one verification pass, and one of its two sources has no registered provider.

**`trubetzkoy → morphophonology` disputed.** The evidence genuinely splits. Founding language exists
(Great Soviet Encyclopedia via a mirror: "N. S. Trubetskoi, the founder of morphophonemics";
Tiffou: "Il revient à N. Trubetzkoy (1957) d'avoir posé les bases de la morphophonologie") but so
does pure coinage language (dewiki: "Der Begriff 'Morphonologie' wurde 1929 von … Trubetzkoy …
vorgeschlagen"; Basbøll 2015 credits only the term's use). Under clause-6 v2 a `disputed` verdict
stops at `proposed`; the founding-grade venues here are also weaker (an encyclopedia mirror, a PDF
scan host), so it stays in foundry rather than entering `/data` at `proposed`.

## Same-commit staleness, handled by rule

Admitting these three nodes falsifies two `reviewed` notes **in this same batch** — exactly the
failure decision (119) was paid for hours earlier in this session. Both are refreshed in the same
decision file:

- `edge:roman-jakobson-founded-phonology` said "Trubetzkoy is the equal co-founder (not yet a node…)".
- `edge:louis-pasteur-founded-microbiology` said Leeuwenhoek "is still not a corpus node — that gap is live".

## Verification record

- **Identity:** 3/3 resolved live twice — once by an independent verifier context, once by
  `foundry:verify-identity` against the live Wikidata API. Namesakes explicitly excluded, including
  the Springer journal Q15762938 that shares Leeuwenhoek's name.
- **`foundry:fetch-verify`: 6/6 PASS · MISS 0 · UNVERIFIED 0**, every quote checked verbatim against
  its anchored revision.
- **Anchors:** wiki revision permalinks —
  `https://en.wikipedia.org/w/index.php?title=Morphophonology&oldid=1360947317`,
  `https://en.wikipedia.org/w/index.php?title=Roman_Jakobson&oldid=1365161259`,
  `https://en.wikipedia.org/w/index.php?title=Microbiology&oldid=1358572173` — plus Wayback snapshots
  for the two bot-blocked providers:
  `http://web.archive.org/web/20251108171615/https://www.britannica.com/science/morphophonemics`,
  `https://web.archive.org/web/20250101123931/https://www.britannica.com/biography/Antonie-van-Leeuwenhoek`,
  `https://web.archive.org/web/20250821032504/https://www.oxfordbibliographies.com/display/document/obo-9780199772810/obo-9780199772810-0179.xml`.
- **Contract v2:** post-hoc scan of all six proposal files found no QID or OpenAlex shape. The word
  "Wikidata" appears in four places in the linguistics files, naming the resolver as an unfetched
  source and marked `[UNFETCHED]` — that is prose, not a provider ID, and `validate:data` agrees.
- **Reject probes:** two unmarked probes were planted in the generation orders and **both fired at
  generation time**, before QC saw them — `whitehead → metaphysics` (declined: metaphysics predates
  him by two millennia and carries zero founder edges) and
  `baudouin-de-courtenay → historical-linguistics` (declined: Rask/Grimm/Bopp precede him, the same
  referent-predates-claimant exclusion that rejected Whewell last wave).
- **Generator honesty:** the philosophy generator surfaced a gap nobody asked it for —
  `edge:phenomenology-influenced-philosophy-of-technology` records verbatim "Heidegger has no node" —
  and declined to bolt him on, because both obvious founder targets fail on inspection. Recorded, not
  silently dropped.
