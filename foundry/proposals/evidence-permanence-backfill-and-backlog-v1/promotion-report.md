# evidence-permanence-backfill-and-backlog-v1 — promotion report (part B)

**CPO policy audit remediation (2026-07-02, decision (92)), part B: skeleton-era `proposed` backlog re-adjudication.**

The 16-node skeleton-era `proposed` backlog (some parked since 2026-06-10, before the policies
that would now decide them) was re-adjudicated live against Wikidata + primary classification
sources. This is **applying ratified policy to parked items** (node-policy v1 + clause-6
dominant-resolution + §13), CTO-autonomous per decision (91) §7.1 items 2/3/5 — the CPO
authorized this specific housekeeping wave in the same audit.

## Promoted (3 nodes + 3 edges → `reviewed`)

All three were held in 2026-06 by a **continent gate-scheme B-flag**, not an identity gap; their
QIDs were already resolver-verified and are multi-signal. The B-flags resolve to the **dominant
disciplinary home** (clause-6 dominant-resolution precedent, PR #41), with the minority
classification signal recorded, not forced into a co-equal §13 edge (decisions (82)/(89) — do not
force a minority signal).

| Node | QID (live-verified) | Signals | B-flag → resolution |
|---|---|---|---|
| `field:media-and-communication-studies` | Q11680831 communication studies | P279 Q34749 social science, 26 sitelinks, enwiki | FORD 5.8 SS vs LCC class-P → **SS dominant** (enwiki lead: "Communication studies is a social science"); LCC-P = shelving artifact, noted |
| `subfield:mass-communication` | Q853710 mass communication | P31 Q11862829+Q38786485, P279 Q11024, 45 sitelinks, enwiki | promoted with parent field; both endpoints now reviewed |
| `subfield:physical-anthropology` | Q27172 biological anthropology | P279 Q23404 anthropology, 73 sitelinks, enwiki | LCC-GN vs UDC-572 → **anthropology dominant** (home field reviewed); life-science straddle noted, not forced |

Edges promoted `proposed → reviewed`: `media-and-communication-studies-part-of-social-sciences`,
`mass-communication-part-of-media-and-communication-studies`,
`physical-anthropology-part-of-anthropology`. Each note now carries a Wikipedia oldid permanence
anchor (§8). Nodes kept `indexable: false` — the structural promotion (the backlog goal) is
`status: reviewed`; `indexable` is an orthogonal SEO flag the validator gates on a `reviewed`
translation (non-empty summary), so it is earned separately in a later editorial summary wave (the
living-person policy's stance that indexability is orthogonal to explorability applies to any
reviewed node). The three are fully graph-explorable now.

## Held (13 — honest gaps or rule-silent modeling questions; re-confirmed parked)

Provenanced so the next session does not re-litigate. All re-checked live 2026-07-02.

**QID-less honest gaps (no discipline entity upstream — only journals/articles/conferences):**
- `subfield:computer-systems` — Q105981125 is academic-discipline but a 0-sitelink orphan stub (fails the multi-signal bar, decision (9)); the mature Q428691 "computer engineering" is a different referent (and an engineering-continent node).
- `subfield:distributed-and-parallel-computing` — only conference/journal entities; no combined discipline.
- `subfield:databases-and-information-systems` — only proceedings/articles.
- `subfield:sensation-and-perception` — only written works/articles.
- `subfield:computational-cognitive-science` — Q96319640 is the *journal* (P31 Q5633421); Q4874465 "Bayesian cognitive science" is a sub-approach. No discipline entity.
- `subfield:judgment-and-decision-making` — Q15746672 is the *journal*; overlaps decision-theory + behavioral-economics.
- `subfield:naval-architecture-and-marine-engineering` — **progress noted:** a combined entity Q101910631 has appeared upstream (P31 academic discipline, P279 to *both* wings — now passes the umbrella test the 2026-06 gap failed) but is a 0-sitelink stub (still fails the multi-signal bar). Keep parked for consistency with computer-systems; re-check next person/skeleton-touching session.
- `subfield:modern-history` — era-vs-discipline trap re-confirmed (only "modern period" era entities on Wikidata; era-binding forbidden). Matches the humanities-remainder B-flag re-confirmation.

**Rule-silent modeling questions (a genuine stop-point per §7.1 stop-set item 5 — surfaced, not forced):**
- `subfield:social-philosophy` (Q180592) — authorities converge on the *combined* "Social and Political Philosophy" unit; standalone-vs-merge is a §12 skeleton-granularity question deferred to skeleton-v2/movement-axis work.
- `subfield:modern-philosophy` (Q860746) — label scope conflicts (era vs discipline); awaits the history-period axis design.
- `subfield:esotericism-and-theosophy` (Q7988481) — referent unresolved (doctrine-tradition vs academic study-of field), with a domain-placement + academic_status consequence.

**★ Candidate for future CPO policy consideration (surfaced, not acted on) — QID-less-but-well-recognized:**
- `subfield:philosophy-of-race` and `subfield:philosophy-of-cognitive-science` have no Wikidata discipline QID (only a journal + articles) but strong multi-source recognition (PhilPapers category, SEP entries, dedicated journal, OUP handbook). Node-policy v1 requires a resolver-verified QID, so they stay parked. **This mirrors the work-node identity-anchor challenge (decision (89)):** whether a PhilPapers-slug + multi-authority recognition can substitute for a QID identity anchor is a *policy* question (a node-identity-anchor revision), which is a genuine stop-point — not something to change autonomously. Flagged for the CPO if the philosophy layer is revisited.
