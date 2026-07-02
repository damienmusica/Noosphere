# a-relations-wave6-v1 — orchestrator QC report (held-edge re-adjudication)

**Session #53, 2026-07-02.** This is not a new generation batch — it is the orchestrator
(Opus) re-adjudicating the **17 `influenced`/`critiques` edges currently held at `proposed`**
in `data/edges.json` (accumulated from a-relations waves 3–5 + earlier), per the roadmap's
"a-relations-wave6 (보류 재검)" track. Each was live re-grounded; the disposition is either
promote (clause-6 v2 supported → (68) ladder), keep-held (genuine modeling / thin-sourcing
gap, honest breadcrumb note retained), or the standing disputed hold.

## Disposition

| Edge | Prior hold reason | Verdict |
|---|---|---|
| **max-weber → critiques → karl-marx** | critique-of-materialism statement not verbatim-surfaced (wave3) | **PROMOTE → reviewed** — surfaced verbatim in ≥2 independent live sources this session (see below). clause-6 v2 #1 supported; (68) ladder; both endpoints reviewed + deceased. |
| friedrich-nietzsche → influenced → sigmund-freud | clause-6 v2 `disputed:true` balanced (decision (67)) | **STAYS proposed** — disputed edges never auto-promote (by design; human-visible). Unchanged. |
| roman-jakobson → influenced → semiotics | diffuse, partly bidirectional | keep-held — Jakobson drew *from* Peircean semiotics as much as he shaped it; direction-ambiguous, single clear source. |
| norbert-wiener → influenced → cognitive-psychology | near-duplicate of information-theory→cognitive-psychology | keep-held — redundancy is a modeling judgment, not a sourcing gap; no clean separation from the channel-capacity claim. |
| john-von-neumann → influenced → computer-systems | target `subfield:computer-systems` is itself `proposed` (QID-less) | keep-held — status-cap clause 3 blocks promotion regardless of sourcing; also a live attribution dispute (Eckert–Mauchly). |
| bertrand-russell → influenced → computer-science | diffuse/mediated, field-target too broad | keep-held — even re-targeted to the now-reviewed `programming-languages`, the type-theory→PL link is decades-mediated (via Church/Curry–Howard); the direct lambda-calculus→PL path is already represented (church→programming-languages, wave5). Not forced. |
| antoine-lavoisier → influenced → physics | field-target too broad, diffuse | keep-held — no finer reviewed subfield (thermodynamics) to re-target to. |
| cybernetics → influenced → systems-engineering | thin, one-directional | keep-held — one of many contributing disciplines; not reciprocally stated. |
| vladimir-vernadsky → influenced → environmental-science | diffuse, field-grain broad | keep-held — already founded→geochemistry; broad target. |
| andreas-vesalius → influenced → art-history | indirect/weak, not a standard claim | keep-held — the *Fabrica*'s illustration influenced art, but "influenced art-history the discipline" is not a standard claim. |
| alfred-russel-wallace → influenced → philosophy-of-biology | niche, insufficient clean sourcing | keep-held — SEP `wallace` 404; thin. |
| karl-pearson → influenced → sociology | diffuse, field-grain broad | keep-held — quantitative-methods adoption is diffuse. |
| george-lakoff → critiques → philosophy-of-mind | LIVING; broad-target modeling | keep-held — embodied-mind critique real, but "critiques the field" is broad-target; held on modeling precision (no living-person escalation signal). |
| georges-cuvier → influenced → archaeology | indirect (via geology), broad | keep-held. |
| gottfried-wilhelm-leibniz → influenced → computability-theory | long-range mediated | keep-held — calculus-ratiocinator is a precursor framing, not the influence bar. |
| ronald-fisher → influenced → epidemiology | thin, epidemiology-specific link not surfaced | keep-held — Bradford Hill more direct. |
| kurt-lewin → influenced → education | thin (2nd generator source was about Dewey) | keep-held. |

## Promoted edge — grounding (weber → critiques → marx)
Two independent, live, claim-stating sources surfaced verbatim this session:
- **Wikipedia, Max Weber** — "compared to Marx's support for the material world's primacy
  over the world of ideas, Weber valued ideas as motivating individuals' actions"; and
  "While Weber drew upon Marx's interpretation of class conflict in his definition of class,
  he did not see it as defining all social relations."
- **SEP, Max Weber** — the Protestant Ethic thesis characterized as "a **non-Marxist**
  genealogy of modern capitalism."

Direction correct (Weber 1864–1920, engaging Marx d. 1883); both endpoints reviewed + deceased.
clause-6 v2 #1 (dominant view affirms, no substantial dissent) → **supported** → (68) (a)-ladder
auto-`reviewed`. Record-not-resolve: Weber also *drew on* Marx (generative critique, not
wholesale rejection) — carried in the edge note; the mutual Marx→Weber influence is not minted
as a separate edge this pass.

**§8 permanence anchors:**
- Wikipedia Max Weber — https://en.wikipedia.org/w/index.php?title=Max_Weber&oldid=1361488712
- SEP Weber Wayback SPN — https://web.archive.org/web/20260702062208/https://plato.stanford.edu/entries/weber/

## Tally
- **1 promoted** (weber→critiques→marx: `proposed → reviewed`).
- **1 standing disputed** (nietzsche→freud: stays proposed by design).
- **15 kept-held** with honest breadcrumb notes (modeling / thin-sourcing gaps; several await
  a finer reviewed target node or are structurally blocked by a `proposed` endpoint).
- No drops this pass — held `proposed` edges remain foundry-visible with their reasons.
