# QC report — natural-sciences-summaries-v1 (editorial layer, 6th batch)

- **QC by:** Claude Fable 5 (claude-fable-5), orchestrator session #12, 2026-06-11.
- **Generation:** Claude Opus (claude-opus-4-8) per the ratified editorial-track model decision
  (vault decision log 2026-06-11 (26)), in **three separate contexts** (batch-a physics wing 12 /
  batch-b fields+chemistry+QIS 10 / batch-c astro+earth 12 — raw generated sets preserved as
  `summaries.batch-{a,b,c}.json`, ADR 0007 generation/QC separation upheld).
- **Scope:** the full 34-node reviewed-without-summary gap from the natural-sciences skeleton
  (session #11 carryover). All parent nodes are `reviewed` (editorial v1 precondition); every
  English translation row is marked `reviewed`. The seven B-contested nodes were **excluded by
  order** (resolved separately in `ns-bflag-resolution-v1`; their summaries are a follow-up batch
  in this session reflecting the resolutions).
- **Generation contract (all three orders, identical mandatory clauses):** live-fetch duty +
  [UNFETCHED] self-marking + anti-laundering clause ("only claims that actually exist in the named
  document/URL may be cited to it") + §8 SPN rules stated (snapshot valid only as
  `web/<timestamp>/` pattern; failures recorded [SPN-FAILED]); SPN execution centralized to the
  orchestrator at QC time (per-IP throttle discipline), agents return `spn_queue`.

## Dashboard

| Metric | Value |
|---|---|
| Summaries generated / kept | 34 / 34 (0 rejections) |
| Cited-URL hallucinations (dead or wrong-entry) | **0/56 unique URLs — 8th consecutive 0%** |
| Verbatim quote checks (every quoted span in every summary) | **93/93 verified** (91 mechanical + 2 manual: a meta-tag-embedded phrase and a crosslink-markup artifact, both confirmed verbatim in page source) |
| Hint-laundering | **0** (every classification claim either self-fetched or honestly flagged [UNFETCHED] — flagged ones QC-backstopped below) |
| In-page misattribution | 0 |
| Opus QC edit rate | **3/34 substantive trims** (word/sentence level, no factual rewrites) + 7 mechanical HTML-entity de-escapes (`&amp;` → `&`) |
| Honest [UNFETCHED] self-disclosures | 14 (all genuine — bot-blocked societies, missing Britannica slugs, unfetched classification records) |

Live re-verification method: every cited URL bulk-fetched by the orchestrator (browser UA;
physh.org with `Accept: application/json`), every quoted span string-matched after entity/markup
normalization. Two URLs that now serve bot-challenge shells live (link.springer.com journal 216
aims-and-scope; both quotes) were verified verbatim against the real Wayback snapshot
`https://web.archive.org/web/20250406075912/https://link.springer.com/journal/216/aims-and-scope`.

## QC backstops (agent-flagged [UNFETCHED] claims, orchestrator live-verified — MSC 81P68 pattern)

- **optics — UDC 535:** `getrecord.php?id=535&lang=1` live 2026-06-11: "535 Optics" own entry
  under "53 Physics". Claim stands.
- **acoustics — UDC 534:** getrecord live: "534 Vibrations. Waves. Acoustics". Claim stands.
- **geology — QE subclass:** id.loc.gov QE351 componentList live: "Science--Geology--Mineralogy"
  (QE range labels under Geology), corroborated by the session-#11 LCC Q outline snapshot
  (`web.archive.org/web/20260611023031/...lcco_q.pdf`, QE1-996.5 Geology). Claim stands.
- **planetary-science — "QB454-QB456 Astrogeology":** id.loc.gov QB454 live shows the authority
  range is **QB454-QB454.2**, not QB456, and the claim was uncited → **clause trimmed** (edit 2).

## QC edit log (3 substantive)

1. **subfield:geology** — trailing meta-commentary sentence ("This node represents …") removed:
   scaffolding addressed to QC, not encyclopedic content.
2. **subfield:planetary-science** — uncited "and QB454-QB456 to 'Astrogeology'" clause removed
   (range bounds wrong per live authority record; cited QB600-701 claim retained).
3. **subfield:quantum-information-science** — interpretive lead-in ("The physics community
   recognizes it as a top-level research discipline; …") reduced to the sourced PhySH statement;
   unsourced "and related foundations" trimmed from the breadth list (NIST sources computing,
   sensing, networks).

Mechanical: 7 summaries carried literal `&amp;` from PhySH JSON labels — de-escaped to `&`.

## Consistency duties (verified against prior rulings)

optics ↔ AMO written as peers (no containment claim either way); statistical-physics referent is
statistical physics proper with the thermodynamics relation fetch-sourced; atmospheric-science
written as the umbrella over meteorology/climatology (Britannica three-topical-areas quote);
earth-sciences (umbrella field) vs geology (subfield) referents kept distinct; QIS not equated
with quantum computing (NIST "other focus areas" quote anchors the breadth) — all hold.

## Evidence permanence (§8)

The 56 cited URLs were submitted to the session's serial SPN pass (16s+ spacing, retry passes on
throttle); the consolidated ledger is appended below. Already-archived URLs from the session-#11
ledger (physh.org/disciplines; the lcco_q.pdf outline) reuse those snapshots. The dps.aas.org
citation already cites a Wayback snapshot URL directly. Querystring URLs are known SPN-incompatible
and recorded as such.

### SPN ledger (appended at end of session #12 pass)

(see table below — appended after the serial pass completed)

## Addendum — batch-d (the seven clause-6-resolved nodes, same session)

After `ns-bflag-resolution-v1` resolved the seven B-contested nodes, a fourth Opus order
(separate context, identical contract) wrote their summaries with the resolutions as binding
consistency duties (interface framing for the three §13 dual-membership nodes; earth-science
framing for the class-G cluster; field-level natural-science framing for environmental-science).
Raw set preserved as `summaries.batch-d.json`.

| Metric (batch-d, 7 items) | Value |
|---|---|
| Cited-URL liveness | 30/30 (0 dead) — 0% streak holds |
| Verbatim quote checks (citations + every inline span) | 30/30 + 29/29 |
| Hint-laundering / misattribution | 0 / 0 |
| QC edits | **1 substantive trim** (oceanography: uncited "institutionally associated…" clause reduced to the cluster-standard closing sentence) |
| QC backstop | 1 — "physics of living systems" heading verified against the cached PhySH disciplines JSON (discipline "Physics of Living Systems" present) |

Session editorial totals: **41 summaries, 4 substantive QC trims, citation hallucination 0%
(86/86 unique URLs live or snapshot-verified; 122/122 inline spans verbatim) — 8th consecutive
0% batch.** Reviewed-node summary coverage after this batch: **188/188**.
