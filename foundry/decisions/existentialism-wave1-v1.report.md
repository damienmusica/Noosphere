# existentialism-wave1-v1 — promotion decision report

**Decided 2026-08-08** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/existentialism-wave1-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (11 errors) — this decision does not apply cleanly:
> - adds.nodes: node person:soren-kierkegaard already exists
> - adds.nodes: node person:jean-paul-sartre already exists
> - adds.nodes: node person:martin-heidegger already exists
> - adds.translations: translation person:soren-kierkegaard@en already exists (use translation_updates)
> - adds.translations: translation person:jean-paul-sartre@en already exists (use translation_updates)
> - adds.translations: translation person:martin-heidegger@en already exists (use translation_updates)
> - adds.edges: edge edge:soren-kierkegaard-influenced-existentialism already exists
> - adds.edges: edge edge:jean-paul-sartre-influenced-existentialism already exists
> - adds.edges: edge edge:martin-heidegger-influenced-existentialism already exists
> - adds.edges: edge edge:martin-heidegger-influenced-philosophy-of-technology already exists
> - adds.edges: edge edge:martin-heidegger-influenced-phenomenology already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `edge:soren-kierkegaard-influenced-existentialism` | **supported** | ✓ | ✓ | 3 (3) | Refutation-first verifier: founded_or_formalized refuted on referent-postdates-founder (~85 years); precursor grain survives at Nietzsche parity. SEP deflates the paternity label twice in its own voice. Verifier self-reported model ID: claude-fable-5. |
| `edge:jean-paul-sartre-influenced-existentialism` | **supported** | ✓ | ✓ | 3 (3) | The ordered founded_or_formalized claim was REJECTED (see rejections); influenced admitted on the verifier-gathered centrality/exponent language. Verifier self-reported model ID: claude-fable-5. |
| `edge:martin-heidegger-influenced-existentialism` | **supported** | ✓ | ✓ | 3 (2) | Label-rejection complication confirmed and recorded (Letter on Humanism); it targets membership, not influence — no source denies the influence. Verifier self-reported model ID: claude-fable-5. |
| `edge:martin-heidegger-influenced-philosophy-of-technology` | **supported** | ✓ | ✓ | 3 (2) | Corpus-phrase target survived: the tradition-level note stands, and the anchored SEP edition names Heidegger person-specifically among the founding figures whose work 'remains an important source of inspiration'. Founding blocked by Kapp's 1877 coinage (anchored edition, verbatim: 'Ernst Kapp, who was the first to use the term philosophy of technology in his book Eine Philosophie der Technik (1877 [2018])'). ★ EDITION DISCREPANCY recorded: the live verifier quoted 'key thinkers from continental philosophy—notably Heidegger—have been a great influence…' and a Heidegger disavowal sentence from the LIVE SEP entry; the sum2026 fixed edition this decision anchors does not contain either sentence (the entry text differs between live and the archived edition). The quotes above are sum2026-verbatim, orchestrator-verified; the claim survives identically in both texts. Verifier self-reported model ID: claude-fable-5. |
| `edge:martin-heidegger-influenced-phenomenology` | **supported** | ✓ | ✓ | 3 (2) | SEP's co-founding-flavored launch sentence recorded against; corpus scopes founding to Husserl. member_of structurally declined. Verifier self-reported model ID: claude-fable-5. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `person:soren-kierkegaard` | wikidata:Q6512 | ✓ | wbgetentities | 2026-08-07 |  |
| `person:jean-paul-sartre` | wikidata:Q9364 | ✓ | wbgetentities | 2026-08-07 |  |
| `person:martin-heidegger` | wikidata:Q48301 | ✓ | wbgetentities | 2026-08-07 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `person:soren-kierkegaard` | node add | reviewed | node-promotion-v1 |
| `person:jean-paul-sartre` | node add | reviewed | node-promotion-v1 |
| `person:martin-heidegger` | node add | reviewed | node-promotion-v1 |
| `edge:soren-kierkegaard-influenced-existentialism` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:jean-paul-sartre-influenced-existentialism` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:martin-heidegger-influenced-existentialism` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:martin-heidegger-influenced-philosophy-of-technology` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:martin-heidegger-influenced-phenomenology` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:phenomenology-influenced-philosophy-of-technology` | edge reviewed→reviewed | reviewed | — |

## Tally

- Adds: 3 nodes, 5 edges, 0 sources, 3 translations, 0 external links.
- Reviewed outcomes: 8 adds + 0 promotions (all ladder-sanctioned above).
- metadata flips: 1 (set_indexable/set_note).
- Editorial summary updates: 0.
- **Rejected** (3, recorded in foundry/rejections.json):
  - Sartre founded/formalized existentialism: REJECTED at the founding grade (verifier-suggested claim confidence 0.2): zero instances of founder/founded/father-of language for Sartre across SEP, IEP, enwiki and Britannica; the entire SEP Existentialism entry contains no founding attribution for anyone (conspicuous silence); the founding-grade language sources actually use is 'leading exponent' (Britannica), 'central figure ... in the public consciousness, at least' (IEP, hedged), 'one of the key figures' (enwiki), 'most popular voices of this movement' (SEP). The label was coined by Marcel and applied TO Sartre (rejected 1945, adopted later) — being-labelled is not founding; adopt-and-popularise is not founding. Both of the order's grain traps confirmed. Admitted instead at influenced 0.8 (edge:jean-paul-sartre-influenced-existentialism). IEP's 'In 1943 Being and Nothingness, the groundwork of the Existentialist movement in France was published' is work-level and France-scoped — flagged as future canonical_work demand.
  - Gabriel Marcel founded/formalized existentialism (unmarked reject probe): Probe fired correctly at BOTH stages. Generation: the Sonnet generator refused the ordered relation outright, reasoning that the order's own naming-is-not-founding clause applies with no principled exception for the namer. Verification (0.97 reject): coinage confirmed (SEP: 'The word, first introduced by Marcel in 1943'; enwiki: 'coined by the French Catholic philosopher Gabriel Marcel in the mid-1940s', first applied to Sartre) but coinage is not founding (Whewell rule); Marcel 'dissociated himself from figures such as Jean-Paul Sartre, preferring the term philosophy of existence or neo-Socrateanism', later 'came to reject the label himself'; IEP: 'a noted opponent of atheistic existentialism'; SEP's dedicated Marcel entry never uses founding language for existentialism; and SEP directly undercuts the 'formalized' prong: the word 'is certainly not a reference to a coherent system or philosophical school'.
  - Gabriel Marcel (node, this batch): No admissible edge this batch (isolated-node precedent). The generator's fallback influenced 0.6 was not admitted: the verifier's evidence points to member/contributor grain ('leading Christian existentialist'; 'often regarded as the first French existentialist') complicated by his own dissociation and opposition to the movement's dominant strand, and even the narrower Christian-existentialism paternity is occupied ('Søren Kierkegaard, the father of Christian existentialism' — who died 34 years before Marcel was born). Declined without prejudice: re-proposable if a Christian-existentialism-grain examination or stronger influence sourcing arrives.

## §8 permanence anchors

- https://plato.stanford.edu/entries/existentialism/ → https://plato.stanford.edu/archives/sum2026/entries/existentialism/
- https://en.wikipedia.org/wiki/S%C3%B8ren_Kierkegaard → https://en.wikipedia.org/w/index.php?title=S%C3%B8ren_Kierkegaard&oldid=1365518285
- https://www.britannica.com/biography/Soren-Kierkegaard → https://web.archive.org/web/20260802124050/https://www.britannica.com/biography/Soren-Kierkegaard
- https://www.britannica.com/biography/Jean-Paul-Sartre → https://web.archive.org/web/20260723084244/https://www.britannica.com/biography/Jean-Paul-Sartre
- https://iep.utm.edu/existent/ → https://web.archive.org/web/20260802113204/https://iep.utm.edu/existent/
- https://en.wikipedia.org/wiki/Jean-Paul_Sartre → https://en.wikipedia.org/w/index.php?title=Jean-Paul_Sartre&oldid=1367693189
- https://en.wikipedia.org/wiki/Martin_Heidegger → https://en.wikipedia.org/w/index.php?title=Martin_Heidegger&oldid=1366448599
- https://plato.stanford.edu/entries/technology/ → https://plato.stanford.edu/archives/sum2026/entries/technology/
- https://en.wikipedia.org/wiki/Phenomenology_(philosophy) → https://en.wikipedia.org/w/index.php?title=Phenomenology_(philosophy)&oldid=1362572183
- https://plato.stanford.edu/entries/phenomenology/ → https://plato.stanford.edu/archives/sum2026/entries/phenomenology/

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
