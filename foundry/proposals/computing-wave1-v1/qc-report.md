# QC report — `computing-wave1-v1`

Session #64, 2026-08-08. QC/adjudication = orchestrator (self-reported model ID `claude-fable-5`);
verification = independent contexts that never opened this directory's proposals (each self-reported
`claude-fable-5`); generation = separated-context `claude-sonnet-5` (see `report.md`).

## Outcomes

| item | outcome |
|---|---|
| `person:john-mauchly` + `edge:john-mauchly-influenced-computer-systems` (0.85) + `edge:john-mauchly-founded-eniac` (0.9) | **reviewed** — both lanes of decision (121)'s unblock |
| `person:j-presper-eckert` + `edge:j-presper-eckert-influenced-computer-systems` (0.85) + `edge:j-presper-eckert-founded-eniac` (0.9) | **reviewed** — his own ledger row resolved |
| `concept:eniac` | **reviewed** — the verified referent (decision (71) shape, `concept:internet` mirror) |
| `person:john-atanasoff` + `edge:john-atanasoff-influenced-john-mauchly` | **proposed**, `disputed: true`, 0.55 (clause-6 v2; `nietzsche-influenced-freud` precedent) |
| `concept:stored-program-computer` + 3 founder edges (incl. the seeded von Neumann probe) | **rejected** — referent predates founders (Turing 1936), "popularized" language, paternity is itself the dispute |
| `edge:john-atanasoff-influenced-j-presper-eckert` | **rejected** — total silence (Eckert bio: zero Atanasoff mentions) |

★ The order's citation "based on the work of Eckert and Mauchly" (attributed to enwiki First Draft)
does **not exist in that article** — content is real but lives in enwiki Von Neumann architecture.
Fourth incident of the order-false-premise shape; recorded in the decision file.

★ Probe honesty: the seeded von Neumann founder edge was NOT refused at generation (proposed 0.85);
verification killed it. The generation-time refusal streak is broken — the catch moved one stage right.

## Machine checks

- identity: 4/4 live — Q522162, Q457906, Q314308, Q169399 (Atanasoff label corrected to the entity's
  "John Vincent Atanasoff" at verify-identity's flag). Eckert P569 discrepancy recorded (Wikidata
  1919-04-06 vs enwiki April 9, 1919).
- fetch-verify: **PASS 10/15 · MISS 0**; 5 UNVERIFIED = Britannica live 403, every quote
  machine-checked verbatim by the orchestrator against the recorded Wayback snapshots below
  (rendered link-boundary spacing preserved per wave13 precedent).
- ladder-check: green (`node-promotion-v1` ×3, `a-relation-auto-68` ×2, `founded-or-formalized-auto-60` ×2).
- MacTutor URL corrected at QC (guessed slug 404'd; real page `Biographies/Eckert_John/` verified
  live 200, Wallace-Eckert homonym ruled out).
- Britannica ENIAC page: the "designed and built" sentence exists **only** in AI-generated
  FAQ/Top-Questions furniture and was not used; quotes come from the article body (byline
  Freiberger & Swaine).

## Evidence-permanence anchors

- https://en.wikipedia.org/w/index.php?title=John_Mauchly&oldid=1357213830
- https://en.wikipedia.org/w/index.php?title=J._Presper_Eckert&oldid=1361713244
- https://en.wikipedia.org/w/index.php?title=ENIAC&oldid=1365289299
- https://en.wikipedia.org/w/index.php?title=Von_Neumann_architecture&oldid=1360745761
- https://en.wikipedia.org/w/index.php?title=John_Vincent_Atanasoff&oldid=1358599454
- https://en.wikipedia.org/w/index.php?title=Honeywell,_Inc._v._Sperry_Rand_Corp.&oldid=1337951244
- https://web.archive.org/web/20260801160056/https://www.britannica.com/technology/ENIAC
- https://web.archive.org/web/20260102105803/https://www.britannica.com/biography/John-Mauchly
- https://web.archive.org/web/20251110050806/https://www.britannica.com/biography/John-V-Atanasoff
- MacTutor https://mathshistory.st-andrews.ac.uk/Biographies/Eckert_John/ — [SPN-FAILED] fresh save
  did not materialize today (SPN circuit open); quote verified live 200.
