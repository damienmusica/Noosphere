# QC report — social-sciences-summaries-v1 (editorial layer, 7th batch)

- **QC by:** Claude Fable 5 (claude-fable-5), orchestrator session #15, 2026-06-12.
- **Generation:** Claude Opus (claude-opus-4-8) per the ratified editorial-track model decision
  (vault decision log 2026-06-11 (26)), in **four separate contexts** (batch-a 6 fields /
  batch-b 8 economics-wing + demography / batch-c 8 sociology·polisci·anthropology subfields /
  batch-d 8 education-wing + law-wing — raw generated sets preserved as
  `summaries.batch-{a,b,c,d}.json`, ADR 0007 generation/QC separation upheld).
- **Scope:** the 30 reviewed-without-summary social-sciences nodes carried out of the parallel
  round (13a) — debt-ledger-round1.md §1, repayment 1 of 3. All parent nodes are `reviewed`
  (editorial v1 precondition); every English translation row is marked `reviewed`.
- **Generation contract (all four orders, identical mandatory clauses):** live-fetch duty +
  [UNFETCHED] self-marking + anti-laundering clause ("only claims that actually exist in the named
  document/URL may be cited to it") + §8 SPN rules (snapshot valid only as `web/<timestamp>/`
  pattern); SPN execution centralized to the orchestrator (per-IP throttle discipline), agents
  return `spn_queue`.

## Dashboard

| Metric | Value |
|---|---|
| Summaries generated / kept | 30 / 30 (0 rejections) |
| Cited-URL hallucinations (dead or wrong-entry) | **0/72 unique URLs — 9th consecutive 0%** |
| Verbatim quote checks (every quoted span, all 4 batches) | **112/112 verified** |
| Hint-laundering | **0** (every classification claim either self-fetched or honestly flagged [UNFETCHED]) |
| In-page misattribution | 0 |
| Opus QC substantive edits | **2/30** (comparative-politics, civil-law — both backstop *strengthenings*, not factual rewrites; see edit log) |
| Honest [UNFETCHED] self-disclosures | 18 (all genuine — Cloudflare/403 Britannica, bot-blocked societies, JS-rendered shells) |
| Self-flags | 53 |
| Word count in [90,160] | 30/30 |

Live re-verification method: every cited URL bulk-fetched by the orchestrator (browser UA,
`-L` redirect-following; HTML-entity unescape + whitespace normalization before substring match).
Of the 112 quotes, 6 failed the first automated pass and were each manually confirmed verbatim:
3 were 301-redirect artifacts (apsanet.org/ABOUT, americananthro.org ×2 — the agents fetched the
redirected target; quotes present after `-L`), 1 needed a fuller fetch (culanth.org/about, present
in raw HTML), 1 needed HTML-unescape (international-relations Britannica Wayback meta), and 1
matched the full article body modulo a tag-stripping space-before-comma (special-education
Britannica Wayback: the meta-description truncates at "intellectual," but the body carries
"...intellectual, hearing, vision, speech, or learning disabilities..." verbatim). **0 genuine
misses.**

## QC backstops (agent-flagged [UNFETCHED] claims, orchestrator live-verified or trimmed)

The 18 [UNFETCHED] disclosures are overwhelmingly "could not add this extra source" notes where
the summary already rests on other fetched citations (e.g. economics anchored on AEA + LCC HB
instead of the Cloudflare-blocked Britannica; criminology on ASC + UDC 343.9; demography on
Britannica-Wayback + IUSSP + UDC 314). Two summaries had a *load-bearing* claim resting on
unfetched/conventional material — both resolved at QC (edit log below). Bare (non-quoted)
classification assertions in the economics wing were independently re-fetched live by the
orchestrator and confirmed: UDC 336.1 "Public sector finance. Government finance in general",
336.2 "Public revenue", 336.5 "Public expenditure. State expenditure", 336.7 "Money. Monetary
system. Banking. Stock exchanges", 314 "Demography. Population studies", 332 "Regional economics.
Territorial economics" — all hold.

## QC edit log (2 substantive)

1. **subfield:comparative-politics** — the generated text rested on a single fetched citation
   (UDC 32) and carried (a) an unsourced closing sentence about "organized sections of national
   and international political-science associations" (the agent self-flagged it for trimming; APSA
   section pages are JS shells / 404, no fetchable description) and (b) an interpretive "empirical
   core of this class" claim not in any source. **Both removed.** Replaced with a stronger,
   comparative-specific gate anchor the orchestrator fetched live: **LCC class JF** —
   `id.loc.gov/authorities/classification/JF20-JF2112` "Political institutions and public
   administration (General)", whose schedule carries the caption "General. Comparative government"
   (live 2026-06-12) — plus the retained UDC 32 / 321 placement. Final text rests entirely on
   fetched classification sources.
2. **subfield:civil-law** — the generated enumeration "the law of contracts, property, torts,
   family, and obligations" was self-flagged as conventional knowledge with no single verbatim
   source. **Backstopped, not trimmed:** UDC 347 "Civil law" subdivides *exactly* into these
   branches, confirmed live by the orchestrator (`getrecord.php?id=347`): 347.2 "Law of realty.
   Real rights" (property), 347.4 "Commitments. Contractual liabilities. Bonds. Contracts",
   347.5 "Noncontractual liabilities. Torts", 347.6 "Family law. Law of inheritance". The summary
   now grounds the enumeration in these UDC 347 subdivisions. The referent pin held throughout
   (branch-of-law sense Q222249; the Romano-Germanic legal-system article was deliberately not
   cited — the generator's pre-registered sense check).

## Referent / consistency pins (all verified held)

- **civil-law** = branch-of-law sense (Q222249), private law between persons — NOT the
  continental legal-system sense. Held (edit 2; generator self-enforced).
- **demography** written standalone/interdisciplinary at UDC 314 — NOT nested under sociology
  (UDC 316); supports the domain-direct placement (its sociology nesting was flattened in 13a).
- **public-administration** kept domain-direct (NASPAA + UDC 35 directly under "3 SOCIAL
  SCIENCES") — not called a political-science subfield.
- **economic-geography** framed as an economics/geography *interface* with no single home
  (Britannica's human-geography treatment + journal remit + UDC 332 cognate area).
- **criminology** interface framing (ASC "multidisciplinary setting" + UDC 343.9 scope note
  "Criminal sociology"/"Forensic psychology") — no single parent (sociology vs law) asserted.
- **economic-history** "branch of historiography" presented strictly as Britannica's attributed
  quote, not atlas doctrine; the parked history-side relation is not pre-empted.
- **gender-studies** interdisciplinary/domain-direct via the verbatim UDC 305 "interdisciplinary
  viewpoint" scope note — not nested under any field.
- **higher-education** written as the research field (ASHE + AERA Division J), not a universities
  primer. **field:education** / **field:law** written as the academic disciplines (LCC L / K),
  not institutional/legal-systems primers.
- **financial-economics** kept neutral on financial mathematics (no containment either way).
- The six fields written as peers (no containment among economics/sociology/political-science/
  education/law/anthropology).

## Evidence permanence (§8)

The 72 cited URLs are recorded in the consolidated `spn_queue` (across the four batch files) for
the session SPN pass. Many are Wayback snapshot URLs already (the Britannica captures the agents
used); udcsummary `getrecord.php?...` and id.loc.gov range URLs are querystring/redirect forms,
the former known SPN-incompatible (recorded §8 — content quoted in summaries, lastrevid-free
classification captions are re-fetchable). The orchestrator's session SPN pass (existing-snapshot
-first) is logged in the session #15 SPN ledger (qid-adversarial-audit-round1-v1 report shares
the pass).

## Provenance

Generation Opus (claude-opus-4-8), 4 separate contexts; QC Claude Fable 5, single orchestrator
context (generation/QC separation upheld). Final post-QC summaries written to
`data/node-translations.json` (locale en). debt-ledger-round1.md §1: 98 → **68** (SS 30 repaid;
remaining LS 17 · Arts 23 · ENG 28 for cleanup rounds 2–3).
