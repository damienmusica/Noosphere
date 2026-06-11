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

**Session-#12 consolidated pass: 146 snapshot-compatible URLs processed — 22 fresh SPN archives + 120 existing snapshots verified = 142/146 (97.3%); 4 save-timeouts → retry queue; 16 querystring URLs recorded SPN-incompatible (§8). Strategy: existing-snapshot-first (fast, throttle-immune), saves only for the residue with a 25s timeout — the save endpoint opened with immediate 520s/hangs and recovered mid-pass.**

| URL | status | snapshot / note |
|---|---|---|
| https://www.britannica.com/science/condensed-matter-physics | existing snapshot verified | https://web.archive.org/web/20251013225406/https://www.britannica.com/science/condensed-matter-physics |
| https://engage.aps.org/dcmp/home | existing snapshot verified | https://web.archive.org/web/20260526042232/https://engage.aps.org/dcmp/home |
| https://physh.org/disciplines | (reused session-#11 snapshot) | see natural-sciences-skeleton-v1 ledger |
| https://engage.aps.org/damop/home | existing snapshot verified | https://web.archive.org/web/20260526042230/https://engage.aps.org/damop/home |
| https://www.britannica.com/science/atomic-physics | existing snapshot verified | https://web.archive.org/web/20260513171417/https://www.britannica.com/science/atomic-physics |
| https://www.britannica.com/science/optics | existing snapshot verified | https://web.archive.org/web/20260223190631/https://www.britannica.com/science/optics |
| https://www.optica.org/about/ | existing snapshot verified | https://web.archive.org/web/20260312194534/https://www.optica.org/about/ |
| https://engage.aps.org/dnp/home | existing snapshot verified | https://web.archive.org/web/20260526042234/https://engage.aps.org/dnp/home |
| https://www.britannica.com/science/particle-physics | existing snapshot verified | https://web.archive.org/web/20260408203955/https://www.britannica.com/science/particle-physics |
| https://engage.aps.org/dpf/home | existing snapshot verified | https://web.archive.org/web/20260526042234/https://engage.aps.org/dpf/home |
| https://www.britannica.com/science/plasma-state-of-matter | existing snapshot verified | https://web.archive.org/web/20260403114520/https://www.britannica.com/science/plasma-state-of-matter |
| https://engage.aps.org/dpp/home | existing snapshot verified | https://web.archive.org/web/20260526042234/https://engage.aps.org/dpp/home |
| https://www.britannica.com/science/fluid-mechanics | existing snapshot verified | https://web.archive.org/web/20260426163457/https://www.britannica.com/science/fluid-mechanics |
| https://engage.aps.org/dfd/home | existing snapshot verified | https://web.archive.org/web/20260526042240/https://engage.aps.org/dfd/home |
| https://www.britannica.com/science/statistical-mechanics | existing snapshot verified | https://web.archive.org/web/20260424111015/https://www.britannica.com/science/statistical-mechanics |
| https://www.britannica.com/science/thermodynamics | existing snapshot verified | https://web.archive.org/web/20260607190146/https://www.britannica.com/science/thermodynamics |
| https://www.britannica.com/science/acoustics | existing snapshot verified | https://web.archive.org/web/20260509021057/https://www.britannica.com/science/acoustics |
| https://engage.aps.org/gsnp/home | existing snapshot verified | https://web.archive.org/web/20260208181240/https://engage.aps.org/gsnp/home |
| https://www.britannica.com/science/chaos-theory | existing snapshot verified | https://web.archive.org/web/20260426163306/https://www.britannica.com/science/chaos-theory |
| https://engage.aps.org/dpb/home | existing snapshot verified | https://web.archive.org/web/20260526042234/https://engage.aps.org/dpb/home |
| https://www.britannica.com/science/particle-accelerator | **[SPN-FAILED]** (save-timeout) | retry queue |
| https://www.britannica.com/science/chemistry | existing snapshot verified | https://web.archive.org/web/20260424111015/https://www.britannica.com/science/chemistry |
| https://www.britannica.com/science/astronomy | existing snapshot verified | https://web.archive.org/web/20260523112628/https://www.britannica.com/science/astronomy |
| https://www.britannica.com/science/Earth-sciences | existing snapshot verified | https://web.archive.org/web/20260518182657/https://www.britannica.com/science/Earth-sciences |
| https://www.britannica.com/science/chemical-analysis | existing snapshot verified | https://web.archive.org/web/20260226065141/https://www.britannica.com/science/chemical-analysis |
| https://link.springer.com/journal/216/aims-and-scope | existing snapshot verified | https://web.archive.org/web/20260228160524/https://link.springer.com/journal/216/aims-and-scope |
| https://www.britannica.com/science/inorganic-chemistry | existing snapshot verified | https://web.archive.org/web/20251115020443/https://www.britannica.com/science/inorganic-chemistry |
| https://www.britannica.com/science/organic-chemistry | existing snapshot verified | https://web.archive.org/web/20260414215026/https://www.britannica.com/science/organic-chemistry |
| https://www.britannica.com/science/physical-chemistry | existing snapshot verified | https://web.archive.org/web/20260128015358/https://www.britannica.com/science/physical-chemistry |
| https://www.britannica.com/science/crystallography | existing snapshot verified | https://web.archive.org/web/20260131004623/https://www.britannica.com/science/crystallography |
| https://www.britannica.com/science/electrochemistry | existing snapshot verified | https://web.archive.org/web/20260520022841/https://www.britannica.com/science/electrochemistry |
| https://www.nist.gov/quantum-information-science | existing snapshot verified | https://web.archive.org/web/20260610201606/https://www.nist.gov/quantum-information-science |
| https://www.britannica.com/science/astrophysics | existing snapshot verified | https://web.archive.org/web/20251112094601/https://www.britannica.com/science/astrophysics |
| https://id.loc.gov/authorities/classification/QB460.json | archived (SPN) | https://web.archive.org/web/20260611074924/https://id.loc.gov/authorities/classification/QB460.json |
| https://www.britannica.com/science/cosmology-astronomy | existing snapshot verified | https://web.archive.org/web/20260516100851/https://www.britannica.com/science/cosmology-astronomy |
| https://id.loc.gov/authorities/classification/QB981.json | archived (SPN) | https://web.archive.org/web/20260611074947/https://id.loc.gov/authorities/classification/QB981.json |
| https://science.nasa.gov/planetary-science/ | existing snapshot verified | https://web.archive.org/web/20260610210551/https://science.nasa.gov/planetary-science/ |
| https://id.loc.gov/authorities/classification/QB601.json | archived (SPN) | https://web.archive.org/web/20260611075009/https://id.loc.gov/authorities/classification/QB601.json |
| http://web.archive.org/web/20260527195944/https://dps.aas.org/ | already-a-snapshot | cited snapshot URL |
| https://www.britannica.com/science/geology | existing snapshot verified | https://web.archive.org/web/20260527230012/https://www.britannica.com/science/geology |
| https://id.loc.gov/authorities/classification/QE351.json | archived (SPN) | https://web.archive.org/web/20260611075032/https://id.loc.gov/authorities/classification/QE351.json |
| https://www.britannica.com/science/geophysics | existing snapshot verified | https://web.archive.org/web/20251116221726/https://www.britannica.com/science/geophysics |
| https://id.loc.gov/authorities/classification/QC806.json | archived (SPN) | https://web.archive.org/web/20260611075055/https://id.loc.gov/authorities/classification/QC806.json |
| https://www.britannica.com/science/geochemistry | existing snapshot verified | https://web.archive.org/web/20260218102120/https://www.britannica.com/science/geochemistry |
| https://www.britannica.com/science/mineralogy | existing snapshot verified | https://web.archive.org/web/20260518072409/https://www.britannica.com/science/mineralogy |
| https://www.britannica.com/science/petrology | existing snapshot verified | https://web.archive.org/web/20260311000248/https://www.britannica.com/science/petrology |
| https://id.loc.gov/authorities/classification/QE420.json | archived (SPN) | https://web.archive.org/web/20260611075117/https://id.loc.gov/authorities/classification/QE420.json |
| https://www.britannica.com/science/paleontology | existing snapshot verified | https://web.archive.org/web/20260317024729/https://www.britannica.com/science/paleontology |
| https://id.loc.gov/authorities/classification/QE701.json | archived (SPN) | https://web.archive.org/web/20260611075140/https://id.loc.gov/authorities/classification/QE701.json |
| https://www.britannica.com/science/seismology | existing snapshot verified | https://web.archive.org/web/20251112225513/https://www.britannica.com/science/seismology |
| https://www.seismosoc.org/ | existing snapshot verified | https://web.archive.org/web/20260530103744/https://www.seismosoc.org/ |
| https://www.britannica.com/science/volcanology | existing snapshot verified | https://web.archive.org/web/20260123151459/https://www.britannica.com/science/volcanology |
| https://id.loc.gov/authorities/classification/QE521.json | archived (SPN) | https://web.archive.org/web/20260611075202/https://id.loc.gov/authorities/classification/QE521.json |
| https://www.britannica.com/science/atmospheric-science | existing snapshot verified | https://web.archive.org/web/20251007163203/https://www.britannica.com/science/atmospheric-science |
| https://id.loc.gov/authorities/classification/QC861.json | archived (SPN) | https://web.archive.org/web/20260611075225/https://id.loc.gov/authorities/classification/QC861.json |
| https://www.britannica.com/science/environmental-science | existing snapshot verified | https://web.archive.org/web/20251217002308/https://www.britannica.com/science/environmental-science |
| https://www.nature.com/subjects/environmental-sciences | existing snapshot verified | https://web.archive.org/web/20260317033121/https://www.nature.com/subjects/environmental-sciences |
| https://udcsummary.info/php/getrecord.php?id=5&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.britannica.com/science/biophysics | existing snapshot verified | https://web.archive.org/web/20260220123816/https://www.britannica.com/science/biophysics |
| https://www.biophysics.org/about-bps/mission-vision | existing snapshot verified | https://web.archive.org/web/20250913135640/https://www.biophysics.org/about-bps/mission-vision |
| https://udcsummary.info/php/getrecord.php?id=577&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.britannica.com/science/biochemistry | existing snapshot verified | https://web.archive.org/web/20260519075413/https://www.britannica.com/science/biochemistry |
| https://id.loc.gov/authorities/classification/QD415-QD436.json | existing snapshot verified | https://web.archive.org/web/20250426205819/https://id.loc.gov/authorities/classification/QD415-QD436.json |
| https://www.asbmb.org/about | existing snapshot verified | https://web.archive.org/web/20260506045100/https://www.asbmb.org/about |
| https://www.britannica.com/science/oceanography | existing snapshot verified | https://web.archive.org/web/20260426144746/https://www.britannica.com/science/oceanography |
| https://udcsummary.info/php/getrecord.php?id=551.46&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.britannica.com/science/hydrology | existing snapshot verified | https://web.archive.org/web/20260303110058/https://www.britannica.com/science/hydrology |
| https://udcsummary.info/php/getrecord.php?id=556&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://www.britannica.com/science/geomorphology | existing snapshot verified | https://web.archive.org/web/20260520005920/https://www.britannica.com/science/geomorphology |
| https://udcsummary.info/php/getrecord.php?id=551.4&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://geodesy.science/about-geodesy/ | existing snapshot verified | https://web.archive.org/web/20260609200317/https://geodesy.science/about-geodesy/ |
| https://id.loc.gov/authorities/classification/QB275-QB343.json | archived (SPN) | https://web.archive.org/web/20260611075247/https://id.loc.gov/authorities/classification/QB275-QB343.json |
| https://udcsummary.info/php/getrecord.php?id=528&lang=1 | SPN-incompatible (querystring) | content quoted in report; Wikidata states lastrevid-pinned |
| https://geodesy.science/geodesy-earth-iag/ | existing snapshot verified | https://web.archive.org/web/20260228024952/https://geodesy.science/geodesy-earth-iag/ |


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
