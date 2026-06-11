# Report — cis-part-of-edges-v1

- **Generator:** Claude Sonnet (claude-sonnet-4-6), separate context (ADR 0007 contract).
- **Generated:** 2026-06-11.
- **Input:** `foundry/batches/cis-part-of-edges-v1.json` (batch manifest) + live-verified
  classification groundings from `foundry/proposals/computer-and-information-sciences-skeleton-v1/qc-report.md`
  and `grounding-report.md` (2026-06-11, today-fresh). No new network calls made — all
  classification claims traceable to repo artifacts.
- **Output:** 28 edges, 0 nodes.

---

## Coverage table (all 27 nodes → their edge(s))

| Node | Status | Edge(s) proposed | Parent(s) | Depth decision |
|---|---|---|---|---|
| `field:library-and-information-science` | reviewed | edge:library-and-information-science-part-of-cis | `domain:computer-and-information-sciences` | Domain anchor — batch mandate |
| `subfield:algorithms-and-data-structures` | reviewed | edge:algorithms-and-data-structures-part-of-theoretical-computer-science | `subfield:theoretical-computer-science` | **Nested under TCS** — §12 edge-depth precedent; CCS "Theory of computation > Design and analysis of algorithms"; MSC 68Q25 |
| `subfield:computational-complexity-theory` | reviewed | edge:computational-complexity-theory-part-of-theoretical-computer-science | `subfield:theoretical-computer-science` | **Nested under TCS** — CCS "Theory of computation > Computational complexity"; MSC 68Q15 |
| `subfield:programming-languages` | reviewed | edge:programming-languages-part-of-computer-science | `field:computer-science` | Direct — CCS "Software and its engineering" (separate top-level branch from Theory of computation); UDC 004.43 |
| `subfield:software-engineering` | reviewed | edge:software-engineering-part-of-computer-science | `field:computer-science` | Direct — CCS "Software and its engineering" top-level branch; UDC 004.4 |
| `subfield:computer-networks` | reviewed | edge:computer-networks-part-of-computer-science | `field:computer-science` | Direct — CCS "Networks" top-level branch; UDC 004.7 |
| `subfield:artificial-intelligence` | reviewed | edge:artificial-intelligence-part-of-computer-science | `field:computer-science` | Direct — CCS "Computing methodologies > AI" (sibling of CV, NLP, ML); UDC 004.8 |
| `subfield:computer-vision` | reviewed | edge:computer-vision-part-of-computer-science | `field:computer-science` | Direct — CCS "Computing methodologies > Computer vision" (sibling of AI, not nested); UDC 004.93 |
| `subfield:natural-language-processing` | reviewed | edge:natural-language-processing-part-of-computer-science | `field:computer-science` | Direct — CCS "Computing methodologies > NLP" (sibling of AI, not nested); UDC 004.912 |
| `subfield:human-computer-interaction` | reviewed | edge:human-computer-interaction-part-of-computer-science | `field:computer-science` | Direct — CCS "Human-centered computing" top-level branch; UDC 004.5 |
| `subfield:computer-graphics` | reviewed | edge:computer-graphics-part-of-computer-science | `field:computer-science` | Direct — CCS "Computing methodologies > Computer graphics" (sibling of AI, CV, NLP); UDC 004.92 |
| `subfield:cryptography` | reviewed | edge:cryptography-part-of-computer-science | `field:computer-science` | Direct — CCS "Security and privacy > Cryptography"; MSC 94A60+68P25; §12 cross-continent transfer ratified |
| `subfield:computer-security` | reviewed | edge:computer-security-part-of-computer-science | `field:computer-science` | Direct — CCS "Security and privacy" top-level branch; UDC 004.056 |
| `subfield:theoretical-computer-science` | reviewed | edge:theoretical-computer-science-part-of-computer-science | `field:computer-science` | Direct — CCS "Theory of computation" top-level branch; MSC 68Qxx umbrella |
| `subfield:formal-languages-and-automata-theory` | reviewed | edge:formal-languages-and-automata-theory-part-of-theoretical-computer-science | `subfield:theoretical-computer-science` | **Nested under TCS** — CCS "Theory of computation > Formal languages and automata theory"; MSC 68Q45 |
| `subfield:information-retrieval` | reviewed | edge:information-retrieval-part-of-computer-science **+** edge:information-retrieval-part-of-library-and-information-science | `field:computer-science` AND `field:library-and-information-science` | **§13 dual-membership** — CCS/MSC 68P20 (computing); LCC Z699-699.5/UDC 025.4 (LIS) |
| `subfield:knowledge-organization` | reviewed | edge:knowledge-organization-part-of-library-and-information-science | `field:library-and-information-science` | Direct — LCC Z696-Z699; UDC 025.4/02; ISKO community |
| `subfield:digital-libraries` | reviewed | edge:digital-libraries-part-of-library-and-information-science | `field:library-and-information-science` | Direct — LCC Z692.C65; UDC 02; JCDL/iSchools |
| `subfield:bibliometrics` | reviewed | edge:bibliometrics-part-of-library-and-information-science | `field:library-and-information-science` | Direct — LCC Z669.8; QC rename ruling; QID Q603441 |
| `subfield:social-computing` | reviewed | edge:social-computing-part-of-computer-science | `field:computer-science` | Direct — CCS "Human-centered computing > Collaborative and social computing"; QC ruling retains in CS |
| `subfield:visualization` | reviewed | edge:visualization-part-of-computer-science | `field:computer-science` | Direct — CCS "Human-centered computing > Visualization"; LCC QA76.9.I52; QC gap-fill |
| `subfield:history-of-computing` | reviewed | edge:history-of-computing-part-of-computer-science | `field:computer-science` | Direct — CCS "Social and professional topics > History of computing"; LCC QA76.17 (inside continent range); QC gap-fill |
| `subfield:scientific-computing` | **proposed** | edge:scientific-computing-part-of-computer-science | `field:computer-science` | Direct — UDC 004.94; CCS Applied computing; MSC 68U20/68Vxx; **B-type flag → ambiguous:true → proposed** |
| `subfield:quantum-computing` | **proposed** | edge:quantum-computing-part-of-computer-science | `field:computer-science` | Direct — LCC QA76.889 (inside continent range); MSC 68Q12+81P68; **B-type flag → ambiguous:true → proposed** |
| `subfield:computer-systems` | **proposed** | edge:computer-systems-part-of-computer-science | `field:computer-science` | Direct — CCS "Computer systems organization"; UDC 004.2/004.45; MSC 68Mxx; QID-less v1.2 → **proposed** |
| `subfield:distributed-and-parallel-computing` | **proposed** | edge:distributed-and-parallel-computing-part-of-computer-science | `field:computer-science` | Direct — UDC 004.75; CCS branches; QID-less v1.2 → **proposed** |
| `subfield:databases-and-information-systems` | **proposed** | edge:databases-and-information-systems-part-of-computer-science | `field:computer-science` | Direct — UDC 004.65; LCC QA76.9.D3; CCS "Information systems" top-level; QID-less v1.2 → **proposed** |

---

## Edge counts

| Category | Count |
|---|---|
| Total edges | **28** |
| Unique nodes covered | 27 |
| Edges onto reviewed-status nodes | 23 |
| Edges onto proposed-status nodes (status-capped) | 5 |
| §13 dual-membership pairs | 1 (information-retrieval × 2 edges) |
| Depth-nested under subfield:theoretical-computer-science | 3 |
| Flagged `ambiguous: true` | 2 |

---

## Depth-nesting decisions taken

### Nested under `subfield:theoretical-computer-science` (3 edges)

The §12 2026-06-10 edge-depth precedent explicitly addresses this case: "CCS files computational
complexity, formal languages/automata, and algorithms inside the 'Theory of computation' top branch
→ consider `subfield:theoretical-computer-science` as their parent, mirroring the
ASL-pillars-under-mathematical-logic precedent."

Both gate-level classification sources confirm:

| Subfield | CCS path | MSC section |
|---|---|---|
| algorithms-and-data-structures | Theory of computation > Design and analysis of algorithms | 68Q25 (under 68Q Theory of computing) |
| computational-complexity-theory | Theory of computation > Computational complexity and cryptography | 68Q15 (under 68Q) |
| formal-languages-and-automata-theory | Theory of computation > Formal languages and automata theory | 68Q45 (under 68Q) |

The umbrella (`subfield:theoretical-computer-science`) is a direct child of `field:computer-science`
(CCS top-level branch). This creates a 3-hop chain for the theory sub-areas:

```
domain:computer-and-information-sciences
  └─ field:computer-science
       └─ subfield:theoretical-computer-science
            ├─ subfield:algorithms-and-data-structures
            ├─ subfield:computational-complexity-theory
            └─ subfield:formal-languages-and-automata-theory
```

The §12 flat rule governs **node levels** (field/subfield only), not edge depth. Part_of chains
may run deeper than two hops. The formal-sciences batch set the precedent explicitly; this batch
applies it.

### CV and NLP: sibling of AI, not nested under it

CCS files AI, computer-vision, and NLP as siblings under "Computing methodologies". UDC 004.93
(CV) and 004.912 (NLP) are siblings of 004.8 (AI), not children. Both sources agree → direct to
`field:computer-science`, `ambiguous: false`. The batch instructions asked to weigh and flag this
honestly — both gate-level sources agree on sibling status, so the decision is unanimous.

(Note: UDC does file ML under 004.8 AI, but ML's reviewed edge uses `field:computer-science` per
the QC ruling, and the batch excludes ML from re-proposal.)

### Programming languages: under "Software and its engineering", not TCS

CCS files PLT under "Software and its engineering" — a separate CCS top-level branch from "Theory
of computation". UDC 004.43 is in the software range, not in the theoretical foundations range.
No nesting under TCS.

---

## §13 dual-membership: information-retrieval

Two co-equal edges proposed for `subfield:information-retrieval`:

| Edge | Parent | Classification grounding |
|---|---|---|
| edge:information-retrieval-part-of-computer-science | `field:computer-science` | ACM CCS: "Information systems > Information retrieval" (live); MSC 68P20 |
| edge:information-retrieval-part-of-library-and-information-science | `field:library-and-information-science` | LCC Z699–Z699.5 (inside LIS range; live Z outline); UDC 025.4 (under class 02 Librarianship; live) |

ACM SIGIR (computing) and ASIS&T (LIS) represent genuine peer communities. Neither edge is
primary. Per §13: "A second (or nth) part_of edge requires the same externally-sourced
classification grounding and QC as the first." Both edges meet that bar.

---

## Flagged edges — what QC should check first

### `ambiguous: true` (2 edges, B-type flags from skeleton QC)

1. **edge:scientific-computing-part-of-computer-science**
   - Real-world boundary contest with applied mathematics / numerical analysis (SIAM CSE spans
     both). Computing-side grounding is solid; applied-mathematics claim is real.
   - Edge inherits `proposed` status cap from node. Awaits clause-6 pass.
   - QC check: Consider whether a §13 second membership (→ `field:mathematics` or
     `domain:formal-sciences`) should be proposed to resolve the contest.

2. **edge:quantum-computing-part-of-computer-science**
   - MSC dual-files 68Q12 (computing) and 81P68 (physics). Physics departments have a genuine
     institutional claim. LCC QA76.889 keeps it in-continent per §12 rule 3 first prong.
   - Edge inherits `proposed` status cap from node. Awaits clause-6 pass.
   - QC check: Consider whether a §13 second membership (→ natural-sciences physics domain) should
     be proposed as the clause-6 resolution path.

### `ambiguous: false` edges QC should still verify

3. **Depth-nested trio consistency:** confirm no existing reviewed edge connects
   algorithms-and-data-structures, computational-complexity-theory, or
   formal-languages-and-automata-theory directly to `field:computer-science`. (None found in
   `data/edges.json` at generation time.) Promotion PR should create the TCS-anchor edge and the
   three nested edges in the same batch for internal consistency.

4. **AI peer-status consistency:** confirm the existing reviewed edge
   `machine-learning-part-of-computer-science` (ML → CS, not ML → AI) is consistent with the
   proposed `artificial-intelligence-part-of-computer-science` (AI → CS). Both are peers; the
   QC ruling (2026-06-11) explicitly ratified this. No parent-child relationship between AI and ML
   in the graph.

5. **IR dual-membership LIS target:** confirm `field:library-and-information-science` is
   `reviewed` and eligible as an edge target (it is — reviewed+indexable per grounding-report).
   This is the first LIS-wing internal edge, also verifying the LIS subfield → LIS field path.

---

## Status summary for promotion planning

| Final status at promotion | Edges | Reason |
|---|---|---|
| Eligible for `reviewed` | 23 | Reviewed endpoints; no B-type flag; unanimous classification grounding |
| Capped at `proposed` (B-flag) | 2 | scientific-computing, quantum-computing — real-world contests |
| Capped at `proposed` (QID-less v1.2) | 3 | computer-systems, distributed-and-parallel-computing, databases-and-information-systems |

All edge objects carry `"status": "generated"` per the proposal contract. Promotion sets final
status; the cap analysis above is for QC planning only.

ACM CCS source entry: `source:acm-ccs` enters `data/sources.json` at the promotion PR (license
confirmed live 2026-06-11: "freely available for educational and research purposes",
acm.org/publications/class-2012 via Wayback snapshot 20191108093737).
