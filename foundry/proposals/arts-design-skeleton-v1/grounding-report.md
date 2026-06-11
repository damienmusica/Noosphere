# Grounding report — arts-design-skeleton-v1 (resolver v4, parallel round 13d)

- **Resolver:** v4, run locally 2026-06-11 under the round network lock (`/tmp/noosphere-net-lock/`,
  protocol ③ — acquired after a ~100s wait on 13a's resolver run, released immediately after).
  Raw result: 25/25 resolved, 0 unresolved, resolver-ambiguous 11, total candidates 75.
- **QC adjudication:** Claude Fable 5 (orchestrator session #13d). Identity verdicts are
  multi-signal from the resolver's live entity captures (exact label + English description + P31 +
  enwiki sitelink + aliases, with `wikidata_lastrevid` pinning each observed state below) — never
  QID-only lookups, never label-only matching (decision-log (9)). The four non-routine cases (two
  manual overrides + the near-tie twin + the upstream label typo) were **re-fetched live by the
  orchestrator** before acceptance (Q2921001, Q631931, Q50637/Q50641, Q208365 — no lock needed for
  Wikidata API reads, 500ms spacing, descriptive UA).

## v4 live dashboard

| Metric | Value |
|---|---|
| Resolver–QC agreement (selection accepted as-is) | **23/25 (92.0%)** — vs 97.6% (NS, v4) / 83% (CS, v3) / 81% (FS, v3) |
| Manual overrides | **2** (drawing, decorative-arts — both referent-twin cases, below) |
| Fallback fire rate (v4 metric) | **0/25** — no compound-label decomposition needed; both manual targets were already in the candidate pool at rank 2 |
| Component-anchor flags | 0 |
| Fallback selections auto-accepted | 0 (n/a — design holds vacuously) |
| Resolver-ambiguous → QC-resolved | 11/11 (9 accepts on label+sitelink+identity per decision-log (9), 2 manual overrides) |
| QID-hint hallucination | **16/24 (66.7%)** — trend 93 → 71 → 72 → 80 → **67** (one hint withdrawn at QC, excluded from the base) |
| Upstream gaps | 0 (second consecutive full-coverage batch) |
| New watch items | 2 (Q208365 upstream en-label typo; Q2921001 thin anchor) |

Notable hint hallucinations confirming the training-knowledge ban: the theatre-studies hint
Q33999 is actually *actor*; the sculpture hint Q860861 is the *three-dimensional artwork object*,
not the discipline (the object-twin trap — see verdicts); the printmaking hint Q185925 is
*graphic design* (the generator's self-reported collision: the value was right for graphic-design
and wrong for printmaking; QC had withdrawn the graphic-design copy pre-resolver, and the
resolver independently re-derived Q185925 for graphic-design at rank 1 with full type signals).

## Manual overrides (decision-log (9) path, orchestrator re-fetched live)

1. **drawing → Q2921001 MANUAL (override of selection Q192521).** The resolver selected Q192521
   "technical drawing" (score 140 — type signal + exact alias "drawing" + enwiki) — that is the
   engineering-drafting referent (aliases "drafting", "technical drafting process"), not the
   visual-arts discipline the node models (LCC NC, UDC 741). Q2921001 "art of drawing" —
   *artistic technique and discipline of drawing*, P31 Q11862829 (academic discipline) +
   Q4671286, aliases "drawing", "drawing (art form)" — is the exact referent and sat at rank 2
   (score 130). Node identity wins over type-signal score (statistical-physics precedent).
   Live re-fetch confirmed: **no enwiki sitelink, 5 sitelinks total** — the enwiki "Drawing"
   article sits on Q93184, the *artwork-object* twin ("visual artwork in two-dimensional
   medium"). Guards: `must_not_select` Q192521 (wrong referent) and Q93184 (object twin).
   **Thin-anchor watch item** (differential-equations Q28575007 pattern).
2. **decorative-arts → Q631931 MANUAL (override of selection Q207241).** The resolver selected
   Q207241 "applied arts" (score 140, enwiki Applied_arts) — a related but distinct umbrella
   (UDC 745/749 wording notwithstanding, the node's referent is LCC subclass NK "Decorative
   arts"). Q631931 "decorative art" — *arts or crafts concerned with the design and manufacture
   of functional, beautiful objects*, P31 Q11862829 + Q1792379, **enwiki "Decorative arts"**,
   42 sitelinks, alias "decorative arts" — is the exact referent, at rank 2. Guard:
   `must_not_select` Q207241 (umbrella twin).

## Twin/typo adjudications (accepted with guards or watch notes)

- **art-history → Q50637 ACCEPT** (resolver's selection upheld over the near-tie). Q50637 "art
  history" = *academic study of objects of art in their historical development* (P31 academic
  discipline, enwiki Art_history, 71 sitelinks) vs Q50641 "history of art" = the *phenomenon's
  history itself* (P31 aspect-of-history family, enwiki History_of_art). Discipline-vs-phenomenon
  twin; guard `must_not_select` Q50641.
- **sculpture → Q11634 ACCEPT** (flag override). Q11634 "art of sculpture" = *branch of the
  visual arts that operates in three dimensions*, enwiki Sculpture — correct discipline referent.
  The generator's hint Q860861 is the artwork-*object* class (no enwiki, description
  "three-dimensional work of art") — guard `must_not_select` Q860861.
- **interior-design → Q179232 ACCEPT** (flag override on the Q1329946 "interior architecture"
  near-tie — a *sibling discipline*, not the same referent; guard `must_not_select` Q1329946).
- **ethnomusicology → Q208365 ACCEPT.** Upstream en label currently reads **"etnomusicology"**
  (typo state, lastrevid 2499580361) — identity is pinned by description + P31 (academic
  discipline) + enwiki "Ethnomusicology" + correctly-spelled alias; label matching is banned
  anyway (decision-log (9)). **Watch item:** upstream label typo may be fixed at any time
  (cosmetic, no identity impact).

## Mechanical-flag overrides on clean identities (7)

performing-arts (Q184485 — P31 outside curated families, identity unambiguous on exact label +
enwiki), architecture (Q12271 — near-tie with history-of-architecture Q8180985, clear identity),
painting (Q11629 — practice entity over object twin Q3305213), printmaking (Q271588 — P31-less
entity, label+sitelink rule), ceramic-arts (Q13464614 — art-form entity, label+sitelink), dance
(Q11639 — art-form entity, P31 includes performing-arts), plus the art-history near-tie above.
All accepted per decision-log (9): a flagged winner with clean multi-signal identity is a QC
accept, not a resolver failure — the flag design did its job by forcing adjudication.

## Per-QID verdicts (final verified set, 25/25)

| node | QID | observed label | enwiki | lastrevid | verdict | hint |
|---|---|---|---|---|---|---|
| field:music | Q638 | music | Music | 2503331427 | accept rank-1 | match |
| field:visual-arts | Q36649 | visual arts | Visual_arts | 2504591389 | accept rank-1 | match |
| field:design | Q82604 | design | Design | 2498501427 | accept rank-1 | match |
| field:performing-arts | Q184485 | performing arts | Performing_arts | 2501419541 | accept (QC override of mechanical flag) | match |
| field:architecture | Q12271 | architecture | Architecture | 2504033401 | accept (QC override of mechanical flag) | match |
| subfield:musicology | Q164204 | musicology | Musicology | 2500099435 | accept rank-1 | WRONG (Q171558) |
| subfield:music-theory | Q193544 | music theory | Music_theory | 2496981523 | accept rank-1 | WRONG (Q207628) |
| subfield:ethnomusicology | Q208365 | etnomusicology (upstream typo — watch) | Ethnomusicology | 2499580361 | accept rank-1 | WRONG (Q189201) |
| subfield:music-education | Q27908 | music education | Music_education | 2496381628 | accept rank-1 | WRONG (Q1988706) |
| subfield:art-history | Q50637 | art history | Art_history | 2503446418 | accept (QC override; twin guard Q50641) | WRONG (Q8242) |
| subfield:painting | Q11629 | painting | Painting | 2492932620 | accept (QC override of mechanical flag) | match |
| subfield:sculpture | Q11634 | art of sculpture | Sculpture | 2501737548 | accept (QC override; object-twin guard Q860861) | WRONG (Q860861) |
| subfield:drawing | Q2921001 | art of drawing | — (enwiki on object twin Q93184) | 2494201261 | **manual: referent override of Q192521** | WRONG (Q11835431) |
| subfield:printmaking | Q271588 | printmaking | Printmaking | 2502102545 | accept (QC override of mechanical flag) | WRONG (Q185925 = graphic design) |
| subfield:photography | Q11633 | photography | Photography | 2501672451 | accept rank-1 | match |
| subfield:graphic-design | Q185925 | graphic design | Graphic_design | 2503690358 | accept rank-1 | (withdrawn at QC) |
| subfield:industrial-design | Q243606 | industrial design | Industrial_design | 2497059708 | accept rank-1 | WRONG (Q336176) |
| subfield:interior-design | Q179232 | interior design | Interior_design | 2496878211 | accept (QC override; sibling guard Q1329946) | WRONG (Q1144896) |
| subfield:decorative-arts | Q631931 | decorative art | Decorative_arts | 2497517483 | **manual: umbrella-twin override of Q207241** | WRONG (Q190588) |
| subfield:ceramic-arts | Q13464614 | ceramic art | Ceramic_art | 2504471433 | accept (QC override of mechanical flag) | WRONG (Q11642) |
| subfield:theatre-studies | Q960543 | theatre studies | Theatre_studies | 2495283145 | accept rank-1 | WRONG (Q33999 = actor) |
| subfield:dance | Q11639 | dance | Dance | 2503563655 | accept (QC override of mechanical flag) | match |
| subfield:film-studies | Q1660187 | film studies | Film_studies | 2499329985 | accept rank-1 | WRONG (Q1968665) |
| subfield:landscape-architecture | Q47844 | landscape architecture | Landscape_architecture | 2496601774 | accept rank-1 | WRONG (Q697686) |
| subfield:urban-planning | Q69883 | urban planning | Urban_planning | 2504204465 | accept rank-1 | WRONG (Q178512) |

## Golden set

25 entries appended (`batch:arts-design-skeleton-v1`): 23 rank-1 verified + 2 manual-path
(drawing — `must_not_select: [Q192521, Q93184]`; decorative-arts — `must_not_select: [Q207241]`),
plus twin guards on art-history (`Q50641`), sculpture (`Q860861`) and interior-design
(`Q1329946`) recorded as `must_not_select` on their verified entries. Next step: promotion under
node policy v1/v1.2/v1.3 in `promotion-report.md` (merge order 4).
