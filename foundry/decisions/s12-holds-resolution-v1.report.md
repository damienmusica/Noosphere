# s12-holds-resolution-v1 — promotion decision report

**Decided 2026-07-03** · QC by Claude Fable 5 (`claude-fable-5`) · generated from `foundry/decisions/s12-holds-resolution-v1.json` by `npm run foundry:report`.

> ⚠ **STRUCTURAL PREFLIGHT FAILED** (6 errors) — this decision does not apply cleanly:
> - promotions: node subfield:social-philosophy has status "reviewed", expected "proposed"
> - promotions: edge edge:social-philosophy-part-of-philosophy has status "reviewed", expected "proposed"
> - promotions: node subfield:esotericism-and-theosophy has status "deprecated", expected "proposed"
> - promotions: edge edge:esotericism-and-theosophy-part-of-philosophy has status "deprecated", expected "proposed"
> - promotions: node subfield:modern-philosophy has status "deprecated", expected "proposed"
> - promotions: edge edge:modern-philosophy-part-of-philosophy has status "deprecated", expected "proposed"

## Verdicts

| Subject | Verdict | Direction | Referent | Sources (indep.) | Notes |
|---|---|---|---|---|---|
| `subfield:social-philosophy` | **supported** | — | ✓ | 3 (3) | Section-12 hold-resolution clause 3 (adjacent-overlap): PhilPapers maintains a dedicated 'Social Philosophy' category (page title 'Social Philosophy - Bibliography - PhilPapers'; 7,570 entries; subcategories incl. 'Social Philosophy, Misc') as a second-level unit under Social and Political Philosophy. The overlap concern (political philosophy / ethics / sociology) does not defeat admission: the taxonomy keeps the exact-name category, and the corpus's existing subfield:political-philosophy is a distinct sibling concern (PhilPapers slices the political wing as Political Theory / History of Political Philosophy / topical categories). Live philpapers.org Cloudflare-blocked at QC time — Wayback snapshots are the verification surface (section-8 bot-block pattern, decisions (104)/(105) precedent). |
| `edge:social-philosophy-part-of-philosophy` | **supported** | ✓ | — | 1 (1) | Classification placement: Social Philosophy sits inside PhilPapers' philosophy taxonomy (value-theory cluster > Social and Political Philosophy > Social Philosophy), corroborating the edge's original UDC class-1 evidence. Direction subfield->field confirmed by the taxonomy nesting. |
| `subfield:esotericism-and-theosophy` | **reject** | — | — | 0 (0) | Section-12 hold-resolution clause 1: referent mismatch established (slug 'esotericism-and-theosophy' vs Q7988481 'Western esotericism') -> deprecate unconditionally; regeneration admission test FAILS — Wayback CDX enumeration of archived philpapers.org/browse/* slugs (11,908 collapsed urlkeys, retrieved 2026-07-03 via http://web.archive.org/cdx/search/cdx?url=philpapers.org/browse/&matchType=prefix&collapse=urlkey) contains zero esoter*/theosoph* category slugs (only the leaf 'hegel-mysticism'), so PhilPapers maintains no such unit. The field's academic home is religious studies (ESSWE / Aries), which has no ratified taxonomy in the decision-(102) registry — admitting one is a CPO gate. Reject = the node as shaped leaves /data (deprecated); the precise referent stays a ledgered future candidate, not a rejected label. |
| `subfield:modern-philosophy` | **reject** | — | — | 2 (2) | Section-12 hold-resolution clauses 1+2: referent mismatch established (slug 'modern-philosophy' vs Q860746 'early modern philosophy') -> deprecate unconditionally. Period-axis admission FAILS the strict name-identity test (CPO ruling 2026-07-03): PhilPapers' History of Western Philosophy units are Ancient Greek and Roman / Medieval and Renaissance / 17th/18th Century / 19th Century / 20th Century Philosophy — no 'Early Modern Philosophy' unit by name (Wayback CDX 2026-07-03 confirms no early-modern-philosophy browse slug; only the leaf 'early-modern-scholasticism'), and nearby-unit referent bridging (17th/18th Century ~ early modern) is disallowed — the equivalence is itself contestable at the Renaissance boundary (T3 tension). |

## Identity verification

| Node | Anchor | Verified | Method | Retrieved | Notes |
|---|---|---|---|---|---|
| `subfield:social-philosophy` | wikidata:Q180592 | ✓ | wbgetentities | 2026-07-03 |  |

## Outcomes

| Subject | Change | Final status | Ladder |
|---|---|---|---|
| `subfield:social-philosophy` | node proposed→reviewed | reviewed | node-promotion-v1 |
| `edge:social-philosophy-part-of-philosophy` | edge proposed→reviewed | reviewed | edge-promotion-v1-structural |
| `subfield:esotericism-and-theosophy` | node proposed→deprecated | deprecated | — |
| `edge:esotericism-and-theosophy-part-of-philosophy` | edge proposed→deprecated | deprecated | — |
| `subfield:modern-philosophy` | node proposed→deprecated | deprecated | — |
| `edge:modern-philosophy-part-of-philosophy` | edge proposed→deprecated | deprecated | — |

## Tally

- Adds: 0 nodes, 0 edges, 0 sources, 0 translations, 0 external links.
- Reviewed outcomes: 0 adds + 2 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (3):
  - `subfield:esotericism-and-theosophy`: Section-12 hold-resolution clause 1 ruled 2026-07-03 (decision (106)): node + part_of edge DEPRECATED on referent mismatch (slug vs Q7988481 'Western esotericism'). Regeneration as subfield:western-esotericism blocked — precise referent fails skeleton admission: PhilPapers (the philosophy registry taxonomy) maintains no esotericism/theosophy category (0/11,908 archived browse slugs, Wayback CDX 2026-07-03); academic home is religious studies (ESSWE/Aries), no ratified taxonomy in the (102) registry. Re-creation triggers: (a) a religious-studies taxonomy authority admitted to the (102) registry (CPO gate) with a Western-esotericism unit by name, or (b) PhilPapers adding the category. (recheck: manual)
  - `subfield:modern-philosophy`: Section-12 hold-resolution clauses 1+2 ruled 2026-07-03 (decision (106)): node + part_of edge DEPRECATED on referent mismatch (slug vs Q860746 'early modern philosophy'). Regeneration as subfield:early-modern-philosophy blocked by the strict name-identity test — PhilPapers' period units are 17th/18th Century Philosophy etc., no 'Early Modern Philosophy' unit by name; nearby-unit referent bridging disallowed (CPO ruling). Re-creation triggers: (a) a ratified taxonomy maintaining an Early Modern Philosophy unit by name, or (b) the future dedicated period-axis design admitting era-cut nodes outside the field skeleton. (recheck: manual)
  - `subfield:modern-history`: Section-12 hold-resolution clause 2 ruled 2026-07-03 (decision (106)) — the period axis is now governed by standing rule, no longer rule-silent: LCC D204-475 era ranges are shelving classification (T2 fail — literature shelving is not field curation), and the (102) registry contains no history disciplinary taxonomy at all, so the era-unit cannot hold clause-1-grade standing. Node stays proposed in /data as an honest parked gap (QID-less: Wikidata still models 'modern history' only as the era Q3281534). Unpark triggers: (a) a history disciplinary taxonomy admitted to the (102) registry (CPO gate) maintaining a Modern History unit by name, or (b) the future dedicated period-axis design. (recheck: manual)

## §8 permanence anchors

- https://philpapers.org/browse/social-philosophy → http://web.archive.org/web/20260224174724/https://philpapers.org/browse/social-philosophy
- https://philpapers.org/browse/social-and-political-philosophy → http://web.archive.org/web/20260520172819/https://philpapers.org/browse/social-and-political-philosophy
- https://www.wikidata.org/wiki/Q180592 → https://www.wikidata.org/w/index.php?title=Q180592&oldid=2511566288
- https://philpapers.org/browse/17th18th-century-philosophy → http://web.archive.org/web/20260520181904/https://philpapers.org/browse/17th18th-century-philosophy
- https://www.wikidata.org/wiki/Q860746 → https://www.wikidata.org/w/index.php?title=Q860746&oldid=2504796126

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
