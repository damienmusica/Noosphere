# Adversarial QID audit — medicine-and-health skeleton (inline)

> Inline adversarial audit, session #18, 2026-06-12 (decision (34)② — the audit is a
> standard step of every skeleton session, no "audit queue" debt accrued). Fan-out =
> 5 refutation agents (general-purpose, separate context, QC-side, live Wikidata
> EntityData), judgment = orchestrator. Scope: the 50 newly-introduced QIDs of the
> medicine skeleton (0 reused existing /data QIDs).

## Result

- **48/50 CONFIRMED** on first pass.
- **1 REFUTED → corrected:** `subfield:infectious-diseases` was **Q18123741** "infectious disease" — the **disease object** (P31 = Q112193867 *class of disease*, "disease caused by infection of pathogenic agents"), NOT the medical specialty. Corrected to **Q788926** "infectious diseases" (P31 = Q930752 *medical specialty*, aliases infectiology / infectious-disease-medicine, 38 sitelinks). Live-verified, 0 /data collision, applied to nodes.json + nodes.proposed.json + grounding-report + golden-set before PR.
- **1 SUSPECT → no change:** `subfield:cardiothoracic-surgery` Q2964004 primary label is "thoracic surgery" with **"cardiothoracic surgery" a listed alias** — same referent (P31 medical specialty); no distinct cardiothoracic-surgery entity exists. Recorded as a benign label-vs-node note (ceramic-arts practice-vs-discipline medium-note precedent).

## Significance — new error class caught (dashboard)

This is the **adversarial audit's first medicine-continent catch**, and it is a class that **both the resolver and the orchestrator's multi-signal verification passed**: the resolver selected Q18123741 (rank-1, score 140) and the grounding pass did not live-fetch it (it was not flagged ambiguous, and "infectious disease" reads correct). The refutation-framed audit caught it by checking P31 = *class of disease* vs *medical specialty* — the **disease-object vs clinical-specialty homonym**, exactly the "임상 동음이의 함정" the order warned of. This validates decision (34)②'s inline-audit-as-standard-step: the audit is not redundant with resolver+grounding; it catches a distinct failure mode. **Precedent for the §12/audit log: in medicine, an organ/condition discipline's label often collides with the disease object — audit P31 must be a specialty/discipline class, never a `class of disease`.**

## Adversarial rigor

- Each agent was prompted to REFUTE, default to scrutiny, and check for journals, persons, hospital orgs, disease objects, homonyms, and sub-referents.
- Caught & rejected near-duplicates / sub-referents that the agents flagged but that were already correctly handled at grounding: orthopedic-surgery Q216685 (kept over thin Q15218776), forensic-medicine Q454812 (kept over Q20565501 grouping; distinct from the Istanbul org Q6060184), pharmacy Q614304 (distinct from the shop Q13107184 and MDPI journal Q27727316), geriatrics Q10384 (distinct from gerontology Q10387).
- Low-sitelink-but-correct notes (no change): health-policy-and-management Q18348859 (3 sitelinks), global-health Q2725393 (15), environmental-health Q932068 (21), PM&R Q2678675 (29) — all P31 squarely discipline/specialty.

## Cumulative

- Pipeline residual error rate: **0 residual** (the 1 caught error was corrected inline before PR — the inline-audit safety net working as designed). Cumulative confirmed residual into shipped /data stays **2/252** (both seed-era; pipeline 0/289 after +50 audited). Golden-set 313→363 (+50), regression 0.
