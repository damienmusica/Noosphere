# computing-wave1-v1 — promotion decision report

**Decided 2026-08-08** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/computing-wave1-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (13 errors) — this decision does not apply cleanly:
> - adds.nodes: node person:john-mauchly already exists
> - adds.nodes: node person:j-presper-eckert already exists
> - adds.nodes: node person:john-atanasoff already exists
> - adds.nodes: node concept:eniac already exists
> - adds.translations: translation person:john-mauchly@en already exists (use translation_updates)
> - adds.translations: translation person:j-presper-eckert@en already exists (use translation_updates)
> - adds.translations: translation person:john-atanasoff@en already exists (use translation_updates)
> - adds.translations: translation concept:eniac@en already exists (use translation_updates)
> - adds.edges: edge edge:john-mauchly-influenced-computer-systems already exists
> - adds.edges: edge edge:j-presper-eckert-influenced-computer-systems already exists
> - adds.edges: edge edge:john-mauchly-founded-eniac already exists
> - adds.edges: edge edge:j-presper-eckert-founded-eniac already exists
> - adds.edges: edge edge:john-atanasoff-influenced-john-mauchly already exists

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `edge:john-mauchly-influenced-computer-systems` | **supported** | ✓ | ✓ | 3 (3) | Independent verifier, refutation-first, live identity Q522162 (P31=Q5, 1907-1980). Wave-12 split did not recur. Verifier self-reported model ID: claude-fable-5. |
| `edge:j-presper-eckert-influenced-computer-systems` | **supported** | ✓ | ✓ | 3 (3) | Independent verifier, refutation-first, live identity Q457906. Britannica [UNFETCHED] (403 + Wayback outage), recorded honestly. Verifier self-reported model ID: claude-fable-5. |
| `edge:john-mauchly-founded-eniac` | **supported** | ✓ | ✓ | 3 (2) | Referent-precision verifier: ENIAC is the best-supported founding referent for both men; EDVAC real but secondary; stored-program lineage rejected as referent (Turing 1936 antecedent, "popularized" language, and its paternity is itself the dispute). Verifier self-reported model ID: claude-fable-5. |
| `edge:j-presper-eckert-founded-eniac` | **supported** | ✓ | ✓ | 3 (3) | Same referent-precision pass as the Mauchly leg. Verifier self-reported model ID: claude-fable-5. |
| `edge:john-atanasoff-influenced-john-mauchly` | **disputed** | ✓ | ✓ | 3 (2) | Verdict disputed (verifier suggestion 0.55): sourced positions on both sides, live scholarly battleground (IEEE Annals). Mauchly leg only — the Eckert leg was rejected on total silence (see rejections). Verifier self-reported model ID: claude-fable-5. |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `person:john-mauchly` | wikidata:Q522162 | ✓ | wbgetentities | 2026-08-07 |  |
| `person:j-presper-eckert` | wikidata:Q457906 | ✓ | wbgetentities | 2026-08-07 |  |
| `person:john-atanasoff` | wikidata:Q314308 | ✓ | wbgetentities | 2026-08-07 |  |
| `concept:eniac` | wikidata:Q169399 | ✓ | wbgetentities | 2026-08-07 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `person:john-mauchly` | node add | reviewed | node-promotion-v1 |
| `person:j-presper-eckert` | node add | reviewed | node-promotion-v1 |
| `person:john-atanasoff` | node add | proposed | — |
| `concept:eniac` | node add | reviewed | node-promotion-v1 |
| `edge:john-mauchly-influenced-computer-systems` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:j-presper-eckert-influenced-computer-systems` | edge add (influenced) | reviewed | a-relation-auto-68 |
| `edge:john-mauchly-founded-eniac` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:j-presper-eckert-founded-eniac` | edge add (founded_or_formalized) | reviewed | founded-or-formalized-auto-60 |
| `edge:john-atanasoff-influenced-john-mauchly` | edge add (influenced) | proposed | — |

## Tally

- Adds: 4 nodes, 5 edges, 0 sources, 4 translations, 0 external links.
- Reviewed outcomes: 7 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held entries closed** (3, dropped from foundry/held.json):
  - `person:john-mauchly`: ADMITTED this batch, both lanes of decision (121)'s corrected unblock executed: Lane A person:john-mauchly → influenced → subfield:computer-systems (reviewed 0.85, von-Neumann-edge mirror) and Lane B referent-precision resolved to concept:eniac with edge:john-mauchly-founded-eniac (reviewed 0.9, decision (71) shape, vint-cerf mirror). The cheap path the order named (re-search) was run by independent verifiers and both men survived on live evidence — wave-12's split did not recur.
  - `person:j-presper-eckert`: ADMITTED this batch on the same terms as Mauchly (his own ledger row, created by decision (121) precisely so his /data state is machine-checked separately, resolves with his own edges: edge:j-presper-eckert-influenced-computer-systems reviewed 0.85, edge:j-presper-eckert-founded-eniac reviewed 0.9).
  - `person:john-atanasoff`: RESOLVED AS WRITTEN-AT-PROPOSED, exactly per the ledger's unblock clause: both endpoint persons landed this batch, and edge:john-atanasoff-influenced-john-mauchly is written at proposed with disputed:true (clause-6 v2 stops promotion while the dispute is live; nietzsche-influenced-freud precedent). The Eckert leg was rejected on total silence — see rejections. His node enters at proposed (not reviewed: decision (121) requires a reviewed edge for a reviewed node, and his only edge is proposed).
- **Rejected** (2, recorded in foundry/rejections.json):
  - stored-program computer as the founding referent (concept node + three founder edges): The generator chose concept:stored-program-computer as the Lane-B referent; independent referent-precision verification rejected it on three grounds: (1) the referent predates the claimed founders — enwiki 'Stored-program computer' (oldid 1366970646): 'The concept of the stored-program computer can be traced back to the 1936 theoretical concept of a universal Turing machine'; (2) the credit language for Mauchly/Eckert at that grain is 'popularized the concept of the stored program' (enwiki John Mauchly) — popularise is not founding (Whewell rule); (3) the concept's paternity is ITSELF the live Eckert-vs-von-Neumann dispute, so no founder edge into it could be written undisputed. The von Neumann leg was a SEEDED PROBE (his First Draft as 'founding document of the lineage'): the generator FAILED to refuse it, proposing it at 0.85; verification killed it with the referent — recorded honestly as the first generation-time probe miss after two waves of generation-time refusals. ENIAC is the verified referent (concept:eniac, this batch). This rejection does not bar a future stored-program-computer node arriving with edge demand at honest grains (e.g. formalizes/influenced), only the founder edges as proposed.
  - Atanasoff influenced Eckert (the Eckert leg): REJECTED on total silence, distinct from the disputed Mauchly leg: the entire enwiki J. Presper Eckert biography (oldid 1361713244, 14.5KB, grepped whole) contains zero mentions of Atanasoff, the ABC, or Honeywell v. Sperry Rand; Britannica's paraphrase of the ruling names only Mauchly ('Mauchly had not considered such a device until his time with Atanasoff'); no fetched source documents any Atanasoff-Eckert contact. The 1973 ruling's joint phrasing ('Eckert and Mauchly ... derived') flows through the joint patent, and the documented influence path runs Atanasoff → Mauchly → (ENIAC partnership). Re-proposable only if claim-stating prose of person-level influence on Eckert himself surfaces.

## §8 permanence anchors

- https://en.wikipedia.org/wiki/John_Mauchly → https://en.wikipedia.org/w/index.php?title=John_Mauchly&oldid=1357213830
- https://www.britannica.com/biography/John-Mauchly → https://web.archive.org/web/20260102105803/https://www.britannica.com/biography/John-Mauchly
- https://en.wikipedia.org/wiki/Von_Neumann_architecture → https://en.wikipedia.org/w/index.php?title=Von_Neumann_architecture&oldid=1360745761
- https://en.wikipedia.org/wiki/J._Presper_Eckert → https://en.wikipedia.org/w/index.php?title=J._Presper_Eckert&oldid=1361713244
- https://www.britannica.com/technology/ENIAC → https://web.archive.org/web/20260801160056/https://www.britannica.com/technology/ENIAC
- https://en.wikipedia.org/wiki/John_Vincent_Atanasoff → https://en.wikipedia.org/w/index.php?title=John_Vincent_Atanasoff&oldid=1358599454
- https://en.wikipedia.org/wiki/Honeywell,_Inc._v._Sperry_Rand_Corp. → https://en.wikipedia.org/w/index.php?title=Honeywell,_Inc._v._Sperry_Rand_Corp.&oldid=1337951244
- https://www.britannica.com/biography/John-V-Atanasoff → https://web.archive.org/web/20251110050806/https://www.britannica.com/biography/John-V-Atanasoff
- https://mathshistory.st-andrews.ac.uk/Biographies/Eckert_J_Presper/ — [SPN-FAILED] save did not materialize and no prior snapshot exists

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
