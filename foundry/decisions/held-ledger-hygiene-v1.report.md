# held-ledger-hygiene-v1 — promotion decision report

**Decided 2026-07-29** · QC by Claude Opus (`claude-opus-5`) · generated from `foundry/decisions/held-ledger-hygiene-v1.json` by `npm run foundry:report`.

> ✓ ladder-check: every reviewed outcome is sanctioned.

## Outcomes

## Tally

- Adds: 0 nodes, 0 edges, 0 sources, 0 translations, 0 external links.
- Reviewed outcomes: 0 adds + 0 promotions (all ladder-sanctioned above).
- Editorial summary updates: 0.
- **Held** (4):
  - `concept:bureaucracy`: C3 hold RESOLVED by re-scope 2026-07-03 (decision (108), batch weber-referent-precision-v1): node + 2 edges DEPRECATED (generic-institution referent Q72468 cannot carry Weber's founder claim); the claim now lives on edge:max-weber-founded-tripartite-classification-of-authority (successor concept node Q3565078, reviewed). REMAINING TRIGGER: the narrow 1:1 referent (Weber's bureaucracy ideal-type, proposal weber-referent-precision-v1 candidate 1 'concept:weberian-bureaucracy') is identity-blocked — no recognized entity (Q113625093 'theory of bureaucracy' = 0-sitelink orphan stub 2026-07-03). Re-create the narrow concept + retarget/augment the founder record iff that entity (or an equivalent) gains multi-signal standing (sitelinks + description + P31). (recheck: trigger)
  - `subfield:esotericism-and-theosophy`: Section-12 hold-resolution clause 1 ruled 2026-07-03 (decision (106)): node + part_of edge DEPRECATED on referent mismatch (slug vs Q7988481 'Western esotericism'). Regeneration as subfield:western-esotericism blocked — precise referent fails skeleton admission: PhilPapers (the philosophy registry taxonomy) maintains no esotericism/theosophy category (0/11,908 archived browse slugs, Wayback CDX 2026-07-03); academic home is religious studies (ESSWE/Aries), no ratified taxonomy in the (102) registry. Re-creation triggers: (a) a religious-studies taxonomy authority admitted to the (102) registry (CPO gate) with a Western-esotericism unit by name, or (b) PhilPapers adding the category. (recheck: trigger)
  - `subfield:modern-philosophy`: Section-12 hold-resolution clauses 1+2 ruled 2026-07-03 (decision (106)): node + part_of edge DEPRECATED on referent mismatch (slug vs Q860746 'early modern philosophy'). Regeneration as subfield:early-modern-philosophy blocked by the strict name-identity test — PhilPapers' period units are 17th/18th Century Philosophy etc., no 'Early Modern Philosophy' unit by name; nearby-unit referent bridging disallowed (CPO ruling). Re-creation triggers: (a) a ratified taxonomy maintaining an Early Modern Philosophy unit by name, or (b) the future dedicated period-axis design admitting era-cut nodes outside the field skeleton. (recheck: trigger)
  - `subfield:modern-history`: Section-12 hold-resolution clause 2 ruled 2026-07-03 (decision (106)) — the period axis is now governed by standing rule, no longer rule-silent: LCC D204-475 era ranges are shelving classification (T2 fail — literature shelving is not field curation), and the (102) registry contains no history disciplinary taxonomy at all, so the era-unit cannot hold clause-1-grade standing. Node stays proposed in /data as an honest parked gap (QID-less: Wikidata still models 'modern history' only as the era Q3281534). Unpark triggers: (a) a history disciplinary taxonomy admitted to the (102) registry (CPO gate) maintaining a Modern History unit by name, or (b) the future dedicated period-axis design. (recheck: trigger)
- **Held entries closed** (2, dropped from foundry/held.json):
  - `edge:max-weber-founded-bureaucracy`: Terminally closed by decision (108) (batch weber-referent-precision-v1): deprecated and re-scoped to edge:max-weber-founded-tripartite-classification-of-authority (reviewed, founder ladder (60)/(61)). Its own blocking_condition states 'No further work on this id' — it has been carried on the worklist since 2026-07-03 only because apply-batch could resolve a hold on promotion-to-reviewed and on nothing else.
  - `edge:bureaucracy-part-of-sociology`: Terminally closed by decision (108) (batch weber-referent-precision-v1): deprecated with its endpoint; the sociological placement now lives on edge:tripartite-classification-of-authority-part-of-sociology (reviewed, structural tier). Its own blocking_condition states 'No further work on this id'. Audit record: foundry/decisions/weber-referent-precision-v1.json.

## §8 permanence anchors

[NO-EXTERNAL-EVIDENCE]

## Orchestrator commentary

<!-- Judgment prose goes here: what QC actually weighed, probe design/outcomes,
     pattern observations, anything the next session should know. The tables
     above are generated — edit the decision file, not the tables. -->
