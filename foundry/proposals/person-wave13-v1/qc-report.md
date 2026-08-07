# QC report — `person-wave13-v1`

Session #64, 2026-08-08. QC/adjudication = orchestrator (self-reported model ID `claude-fable-5`);
verification = independent contexts that never opened this directory's proposals (each self-reported
`claude-fable-5`); generation = separated-context `claude-sonnet-5` (see `report.md`).

## Outcomes

| item | outcome |
|---|---|
| `person:baudouin-de-courtenay` + `edge:baudouin-de-courtenay-influenced-phonology` | **reviewed**, 0.85 — held-ledger unblock satisfied (see decision `held_resolutions`) |
| `person:robert-hooke` + `edge:robert-hooke-influenced-cell-biology` | **reviewed**, 0.8 — founding reading refuted, influence grain verified |
| `edge:robert-hooke-influenced-cell-theory` | declined without prejudice (redundant grain, not independently verified) |
| `person:marcello-malpighi` + edge | **rejected** (unmarked reject probe; generator partially fired — downgraded but still proposed; verification rejected 0.97) |

Gap notes on the Schleiden and Schwann edges refreshed in the same decision file (decision (119) rule).

## Machine checks

- identity: 2/2 live (`wbgetentities`) — Q335092, Q46830; homonyms ruled out (journalist Q11717009; US statistician Q102198851).
- fetch-verify: **PASS 6/8 · MISS 0**; 2 UNVERIFIED = Britannica live 403 (Cloudflare), both quotes machine-checked verbatim by the orchestrator against the recorded Wayback snapshots below.
- ladder-check: green (`node-promotion-v1` ×2, `a-relation-auto-68` ×2).

## Evidence-permanence anchors

- https://en.wikipedia.org/w/index.php?title=Jan_Baudouin_de_Courtenay&oldid=1365158762
- https://en.wikipedia.org/w/index.php?title=Phonology&oldid=1347090635
- https://en.wikipedia.org/w/index.php?title=Cell_(biology)&oldid=1367527367
- https://en.wikipedia.org/w/index.php?title=Cell_theory&oldid=1365081375
- https://web.archive.org/web/20250917185434/https://www.britannica.com/biography/Jan-Niecislaw-Baudouin-de-Courtenay
- https://web.archive.org/web/20260714155139/https://www.britannica.com/biography/Robert-Hooke (quote is article-body prose at ~offset 30545; the page's Top Questions block carries only a truncated copy)

SPN is down today (circuit breaker fired earlier this session); fresh Britannica saves ride the
snapshots above and will be re-attempted on a recovery day — non-load-bearing, quotes verified.

## Named follow-up (recorded, not resolved)

`edge:antonie-van-leeuwenhoek-founded-microbiology`'s Britannica quote ("effectively began the
discipline") was observed by a verifier to sit in the article's **Top Questions** block, which a
separate verifier confirmed is explicitly AI-generated on at least one Britannica page. If that
placement holds, the quote is furniture under §8's body-prose standard and the edge needs
re-anchoring to body prose. Slate candidate for session #65.
