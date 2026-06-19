# founder-wave3-v1 — QC report (orchestrator)

> Session #33, round 4 Lane B. **Person wave 3 — non-formal-science founders + first living-person
> policy validation.** Generation (Sonnet, separate context, ADR 0007) → orchestrator QC (this
> report). The `founded_or_formalized` auto-`reviewed` ladder is open (decisions (60)/(61)); this is
> its first non-FS application and the first exercise of the living-founder guard codified in (61).

## Stage 2 — node identity (full live QID resolver-verification)

Method: for each candidate, resolve the name via Wikidata `wbsearchentities`, fetch the entity
(`Special:EntityData`), confirm **P31 = Q5 (human)**, and read **P569 (birth) / P570 (death)** to
classify deceased vs living. The generator's QID hints are untrusted training-recall and were
**not** used as ground truth.

**Generated QID hallucination: 11/13 = 85%** (consistent with the ~66–93% prior measurements),
**all caught and corrected**:

| person | generated hint | resolved (correct) | hint verdict | b–d |
|---|---|---|---|---|
| Charles Darwin | Q1035 | Q1035 | ✓ correct | 1809–1882 |
| Gregor Mendel | Q36648 (Torres Strait Creole) | Q37970 | ✗ | 1822–1884 |
| Louis Pasteur | Q48268 (IUCN) | Q529 | ✗ | 1822–1895 |
| Antoine Lavoisier | Q1406 (Microsoft Windows) | Q39607 | ✗ | 1743–1794 |
| Auguste Comte | Q5950 (James Brown) | Q12718 | ✗ | 1798–1857 |
| Émile Durkheim | Q186373 (Oenoanda) | Q15948 | ✗ | 1858–1917 |
| Max Weber | Q9177 (Bundesautobahn 23) | Q9387 | ✗ | 1864–1920 |
| Adam Smith | Q9381 | Q9381 | ✓ correct | 1723–1790 |
| Franz Boas | Q76692 (Augustus Siebe) | Q76857 | ✗ | 1858–1942 |
| Wilhelm Wundt | Q57242 (August von Kotzebue) | Q75814 | ✗ | 1832–1920 |
| Ferdinand de Saussure | Q9068 | Q13230 | ✗ | 1857–1913 |
| Martin Seligman | Q448455 | Q320927 | ✗ | 1942–**LIVING** |
| Vint Cerf | Q92785 | Q92743 | ✗ | 1943–**LIVING** |

All 13 resolved to verified humans (P31=Q5). **11 deceased (P570 present); 2 living (Seligman, Cerf —
P570 absent, birth-only).** The 85% hint-hallucination caught entirely at the identity axis is the
strong referent-axis measurement (mirrors wave-1/2).

## Stage 3 — edge grounding (≥2 independent live claim-stating sources)

Each edge grounded on **two independent Wikipedia articles** — the person article and the target-field
article — both **verbatim-captured** (live, HTTP 200). Britannica was **403-blocked** (bot-block,
known); SEP entries for these figures have **biographical preambles that do not cleanly state
discipline-founding** in a quotable sentence (Comte/Weber/Smith/Wundt entries fetched but founding
claim is deeper in the text), so they were not cited as claim-anchors (avoiding evidence-laundering).
The founding attributions here are canonical/uncontested encyclopedic facts; the two independent
Wikipedia claim-statements per edge are recorded verbatim in each `/data` edge `note`. Source-diversity
is therefore lower than the FS-founder waves (which had SEP discipline entries) — recorded honestly.

**Verdicts: 11 deceased supported / 0 disputed / 1 NEI · claim-level hallucination 0/13 · deceased
edge precision 11/11 = 1.0.**

### Plural/layered founding preserved (record-not-resolve, not disputed) — 5 sets
- **sociology**: Comte (coined the term) + Durkheim (established the discipline) + Weber (central
  figure) — a 3-way cluster; **Karl Marx** co-cited by Wikipedia as a principal architect (noted, no
  node yet).
- **microbiology**: Pasteur + Robert Koch (+ van Leeuwenhoek for early microscopy) — Koch not a node.
- **evolutionary-biology**: Darwin + Alfred Russel Wallace (1858 independent co-discovery of natural
  selection).
- **semiotics**: Saussure (semiology) + Charles Sanders Peirce (semiotics) — two independent founders.
- (Lavoisier→chemistry carries a referent note rather than a co-founder; see below.)

### Referent watch
- **Lavoisier → chemistry: supported with note.** He helped found *modern* (quantitative) chemistry —
  the chemical revolution — not chemistry-the-practice (which predates him). `founded_or_formalized`
  covers this formalizing act; recorded as a record-not-resolve note. Admitted.
- **Saussure → semiotics (not linguistics): supported.** Target chosen as semiotics because Saussure's
  founding of semiology is cleaner than "linguistics" (which predates him). Confirmed by both articles.

### ★ NEI — Cerf → computer-networks (referent over-broad)
Vint Cerf is "one of the fathers of **the Internet**" (with Bob Kahn) via TCP/IP — a landmark
*within* computer networking, **not** the founder of the computer-networks **field**. The field was
substantially founded earlier by packet-switching pioneers (Baran, Davies, Kleinrock) and ARPANET; the
`Computer network` Wikipedia article does **not** name Cerf, corroborating the over-breadth. The
`subfield:computer-networks` node is defined as the broad discipline ("interconnection of computing
devices … ISO OSI"). No "internet" node exists. **Verdict NEI — honest gap, NOT written to /data**
(held in foundry). Note: the rejection fired on a *living, famous* candidate on referent grounds —
evidence the QC stays robust after the ladder opened.

## ★ Living-founder guard — fired 2/2

Neither living candidate auto-promoted (guard working):
- **Cerf** — doubly held (NEI-referent **and** living). Not written.
- **Seligman → positive-psychology — supported, but LIVING.** The guard (`is_living_person:true`)
  blocked auto-promotion and routed the node to **CPO review** (charter stricter evidence + conservative
  wording). Evidence is clean and double-grounded: *"Positive psychology began as a new domain of
  psychology in 1998 when Martin Seligman chose it as the theme for his term as president of the
  American Psychological Association"* (Wikipedia, Positive psychology) + Seligman's founding role
  (Wikipedia, Martin Seligman). **CPO approved at the gate (decision (62))** → node + edge admitted
  `reviewed` via the **living-person review path** (not the auto-ladder). The corpus's **first
  living-person node**; conservative — no summary, `indexable:false`. This is the first living-founder
  precedent: auto-promotion blocked → CPO review → admitted on approval.

## Write-in summary
- **12 person nodes `reviewed`** (11 deceased via node policy v1 auto-`reviewed` + Seligman via CPO
  living-person review). All `indexable:false`, summaries deferred (editorial).
- **12 `founded_or_formalized` edges `reviewed`** (11 deceased via the open ladder + Seligman via CPO
  review). Evidence `source:wikipedia`; full provenance retained.
- **Cerf node + edge NOT written** (NEI-referent; honest gap recorded).
- Schema unchanged; 12-type taxonomy unchanged. No new sources.

## SPN §8 (evidence permanence)
Live anchors all HTTP 200 at QC time. Grounding URLs are Wikipedia article URLs (the most heavily
Wayback-archived domain — pre-existing snapshots cover them). No new save-snapshots attempted this
session for the canonical Wikipedia anchors; if a dedicated SPN sweep is desired the URLs are listed
in each edge `note`. Recorded honestly.
