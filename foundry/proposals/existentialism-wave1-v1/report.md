# Report — `existentialism-wave1-v1`

> Generator context returned this report as final-message text (the harness Write guard blocks
> subagent report files); the orchestrator wrote it to disk verbatim. Provenance below is the
> generator's own self-report.

Session #64, 2026-08-08. Generation only (this context does not QC its own output). Proposer: **Claude Sonnet**, model ID **`claude-sonnet-5`**, `proposed_at` **2026-08-08**. No network access; all claims are knowledge-only and marked `[UNFETCHED]` in `source_hint` — every one needs a live check before promotion.

## Pre-generation state check (verified directly against `/data`)

- `subfield:existentialism` (`data/nodes.json:6461`): `reviewed`, `indexable`. Its only person-level edge is `edge:friedrich-nietzsche-influenced-existentialism` (`influenced`, 0.85), sourced to the exact SEP sentence the order quotes. Confirmed zero founding-layer edges before this batch.
- `person:soren-kierkegaard`, `person:jean-paul-sartre`, `person:martin-heidegger`, `person:gabriel-marcel` — none exist in `data/nodes.json` (grepped directly). No reconciliation needed; all four are new.
- `subfield:phenomenology` is `reviewed`/`founded_or_formalized` by `person:edmund-husserl` (0.95).
- `subfield:philosophy-of-technology` carries `edge:phenomenology-influenced-philosophy-of-technology`, whose `note` states verbatim: "Phenomenology (esp. Heidegger's 'The Question Concerning Technology') is a founding tradition of philosophy of technology (postphenomenology, Ihde). Source = the tradition (Heidegger has no node)." — the exact gap item 3 closes.
- `foundry/proposals/endpoint-closure-wave13-v1/philosophy.edges.proposed.json` (unreviewed prior artifact, read this session) recorded as a declined candidate: "existentialism's founder question (Kierkegaard / Sartre / Heidegger, none yet corpus nodes) and Heidegger's own node — not silently dropped." This batch is that flagged future wave.

## Output

- **4 nodes** (cap 4, used 4). 0 reconciled (none existed). 0 flagged `ambiguous` at node level — identity is unambiguous for all four; judgment lives on the edges.
- **6 edges** (cap 7, used 6). All `relation: influenced`, all `evidence_kind: externally_sourced`, all targeting existing `reviewed` nodes, all `evidence: []` (source_hint only, unverified). 3/6 flagged `ambiguous: true` (Kierkegaard, Sartre, Marcel); 3/6 `false` (both Heidegger→existentialism-family edges, Heidegger→phenomenology).

## Grain reasoning, row by row

**Kierkegaard → existentialism (`influenced`, 0.85, ambiguous).** Mirrors the reviewed Nietzsche edge exactly — both named in the same SEP "pioneers...laid the conceptual groundwork" sentence, a century before the movement existed. Precursor language, not founding language, by default. Flagged ambiguous because some sources go further ("father of existentialism") — I did not unilaterally upgrade an unverified recollection; QC's live check should settle it.

**Sartre → existentialism — DOWNGRADED from the order's implied framing.** The order's own trap: "coining a term is NOT founding... being labelled is not founding either — state precisely what founding-grade language sources use for Sartre, if any." What I recall with confidence is consistently popularizing/defining-for-the-public language, not origination language. **Not proposing `founded_or_formalized`.** Proposed `influenced` (0.72, ambiguous) instead, grounded in *Existentialism Is a Humanism* as the movement's defining public text — an imperfect fit since Sartre is also constitutively a member of the movement, not a purely external influence; the taxonomy has no better relation for this. Flagged as the batch's most judgment-dependent edge.

**Heidegger → existentialism (`influenced`, 0.85, not ambiguous).** His rejection of the label (*Letter on Humanism*, replying to Sartre) is recorded on the edge's `note` per the order's instruction, treated as a reason for `influenced` rather than for omitting the edge — *Being and Time* (1927) predates and is a direct source for *Being and Nothingness* (1943).

**Heidegger → philosophy-of-technology (`influenced`, 0.8, not ambiguous).** Directly closes the gap the reviewed note names by ID ("Heidegger has no node"). Kept alongside the existing phenomenology→technology edge (different grains: tradition vs. one person's specific canonical text).

**Heidegger → phenomenology (`influenced`, 0.82, not ambiguous).** Considered and declined two alternatives explicitly: `founded_or_formalized` (phenomenology is already founded by his own teacher Husserl — crediting the student inverts the predates-the-founder problem), and `member_of` (this corpus's ratified §12 rule types `member_of` targets as named-group *institution* nodes; `subfield:phenomenology` is a subfield, not an institution — doesn't structurally fit). `influenced` correctly captures his existential/hermeneutic redirection of the field.

**Marcel → existentialism — DOWNGRADED and REFUSED at the ordered relation/grain.** The order suggests `founded_or_formalized`, justified as "the philosopher who gave the movement its name." Declined: the order itself establishes, one clause earlier, that naming/labelling is not founding-grounds — applying that standard consistently, giving a term to someone else's philosophy is the same category of act, and I found no principled reason it becomes founding-grade only when performed by the namer. Nor could I recall founder-grade language crediting Marcel with founding the *whole* of `subfield:existentialism` — that language attaches to Kierkegaard; reference works otherwise list Marcel as one of several core 20th-century French existentialists. Proposed `influenced` instead at a deliberately low 0.6, grounded in Marcel's own early (1920s–30s) independent theistic strand (*Metaphysical Journal*, *Being and Having*). The naming episode is recorded on the edge's `note` as historical fact, explicitly *not* the edge's justification. **This is the batch's flagged refusal** — the node is proposed in full as ordered; the specific ordered edge/relation is not.

## Coverage deliberately left out

- **Work nodes** (*Being and Time*, *Being and Nothingness*, *Existentialism Is a Humanism*, *Metaphysical Journal*) — out of scope per the order, though several rationales lean on them as underlying textual basis. Natural candidate for a future `canonical_work` wave.
- **A narrower "Christian existentialism" node** for Marcel's strand — plausible but out of this wave's node cap and not requested; flagged as a future-wave candidate.
- **No `founded_or_formalized` edge anywhere in this batch.** Substantive finding, not oversight: at the person-to-existentialism grain, founding-grade language could not be honestly supported for any of the four figures — Kierkegaard/Nietzsche get precursor language, Sartre/Marcel get popularizing/naming language, Heidegger explicitly rejected the label. If a future wave finds genuine founder-grade language (Kierkegaard is the strongest candidate), these edges should be revisited for upgrade, not treated as final.

## What QC should look at first

1. **Kierkegaard's confidence/relation** — most likely candidate for *upgrade* to `founded_or_formalized` if live sources confirm strong "father of existentialism" language.
2. **The two REFUSAL rows (Sartre, Marcel)** — both explicitly deviate from the order's suggested relation. Confirm the reasoning holds, or correct it if a live check surfaces founding-grade language not recalled here.
3. **Marcel's edge (0.6)** — self-flagged weakest claim in the batch; likely candidate for downgrade to `adjacent_to` or drop.
4. **Provider-ID leak scan** — self-checked by hand (no `Q`-number shapes, no wikidata.org/openalex.org strings); `npm run validate:data` should confirm mechanically.
5. **All six `evidence` arrays are empty** — every claim rests on `source_hint` prose only, marked `[UNFETCHED]`. None of this batch's sources have been live-verified.
