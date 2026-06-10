# QC report — philosophy-summaries-v2 (editorial layer, 2nd batch)

- **QC by:** Claude Fable 5 (orchestrator session #3), 2026-06-10. Generation: Claude Sonnet (claude-sonnet-4-6) proposal-generator subagent, separate context (ADR 0007).
- **Scope:** 30 summaries for the philosophy nodes promoted to `reviewed` in PR #25. Editorial policy v1 (decision log (10b)): full fact cross-check, one unverifiable claim = rejection; citations below are QC **live-verified** pages and constitute the permanent citation record (generator hints were unverified and are superseded).
- **Verdict totals: 22 approved as generated, 8 QC-edited, 0 rejected.**

## Dashboard — hint URL hallucination

**53 of 90 hint URLs were dead (59%)** — worse than batch v1 (41%). All v1-measured traps reproduced: SEP generic-field-name 404s (logic, ontology, scholasticism, metaphilosophy, analytic/continental-philosophy, natural-philosophy, comparative-philosophy…), guessed IEP slugs, guessed Britannica slugs. One IEP fuzzy redirect produced a *correct* target for once (`/critical-theory/` → `/critical-theory-frankfurt-school/`, a real relevant entry — final URL recorded, not the alias). OUP remains bot-blocked (HTTP 202) — verified via Wayback snapshot per standing tactics. Content layer again far more reliable than the identifier/URL layer: only 1 substantive factual error in 30 summaries.

## QC edits (8) — what changed and why

| node | change | verified against |
|---|---|---|
| jewish-philosophy | **Factual error fixed:** generated text classed Philo of Alexandria as a *medieval* philosopher; Philo is Hellenistic. Rewritten to place Philo in the Hellenistic period and Saadia/Maimonides/Gersonides in the medieval period; "Aristotelian and Neoplatonic" narrowed to "Greek philosophical thought" (engagement verified generically, school-level attribution not verified for all four). | Britannica Jewish philosophy; SEP Saadya; SEP Gersonides |
| buddhist-philosophy | Dating "5th–4th centuries BCE" → "mid-sixth and mid-fourth centuries BCE, northern India" (the live source's range); "Major schools" → "Major traditions" (Zen verified as tradition, not via school taxonomy). | Britannica Buddhism ("teacher who lived in northern India between the mid-6th and mid-4th centuries bce"); SEP The Buddha (Theravada/Madhyamaka/Yogacara) |
| korean-philosophy | Joseon end date 1897 → **1910** (live source's range 1392–1910); Four-Seven Debate description simplified to verified phrasing (moral emotions / principle / material force); colonial framing softened to "modern period" (not verified on cited page). | Britannica Chosŏn dynasty; SEP Korean Philosophy (Four-Seven Debate, T'oegye, Yulgok) |
| scholasticism | Century range "11th–16th" dropped (live source frames the scholastic span as 6th–17th centuries — conflicting ranges, so no range asserted); "Neo-Scholasticism revivals" → "Thomism in particular experienced revivals into the twentieth century" (the verifiable formulation). | Britannica Scholasticism (figures, Catholic influence); Britannica Thomism ("Decline and revival through the mid-20th century"); SEP Abelard; SEP Ockham |
| natural-philosophy | Explicit modern-discipline list (physics/astronomy/chemistry/biology) → "the bundle of inquiries now designated as the natural sciences" (the live source's own phrase); "by the nineteenth century" dropped (only matched in an unrelated context on the cited page). | Britannica Philosophy of Science ("'natural philosophy,' the bundle of inquiries now designated as sciences"); Britannica natural-philosophy topic index |
| continental-philosophy | Movement list trimmed to verified members (German Idealism, phenomenology, existentialism, hermeneutics); structuralism and critical theory dropped from the enumeration (membership not verifiable on the cited page); "power" dropped from theme list. | Britannica Continental philosophy |
| comparative-philosophy | Tradition examples "Western analytic, Indian, Chinese, African" → "Chinese and Western philosophy" (the scope of the verifying SEP entry). | SEP Comparative Philosophy: Chinese and Western (`comparphil-chiwes`) |
| philosophy-of-psychiatry | Final sentence's disciplinary-emergence dating ("emerged as a distinct academic discipline in the latter decades of the twentieth century") dropped — no verifying text found on the cited page. | SEP Philosophy of Psychiatry (`psychiatry`) |

## Approved as generated (22) — verified citation record

Every claim in each summary was checked against the page(s) listed; claim-critical terms (figures, dates, positions, sub-areas) were confirmed present in page text fetched live 2026-06-10.

| node | QC-verified citations |
|---|---|
| ontology | SEP Logic and Ontology <https://plato.stanford.edu/entries/logic-ontology/>; Britannica Ontology <https://www.britannica.com/topic/ontology-metaphysics> |
| logic | Britannica Logic <https://www.britannica.com/topic/logic> (inference, deduction/induction, propositional) |
| philosophy-of-religion | SEP Philosophy of Religion <https://plato.stanford.edu/entries/philosophy-religion/> (existence of God, problem of evil, religious experience, medieval); Britannica <https://www.britannica.com/topic/philosophy-of-religion> |
| philosophy-of-perception | SEP The Problem of Perception <https://plato.stanford.edu/entries/perception-problem/> (sense-data, direct/naive realism, representationalism); SEP Epistemological Problems of Perception <https://plato.stanford.edu/entries/perception-episprob/> |
| philosophy-of-social-science | IEP Philosophy of Social Science <https://iep.utm.edu/soc-sci/> (individualism/holism, natural-science comparison) |
| business-ethics | SEP Business Ethics <https://plato.stanford.edu/entries/ethics-business/> (corporate, stakeholder, 1970s-era emergence); Britannica <https://www.britannica.com/topic/business-ethics> |
| analytic-philosophy | Britannica Analytic Philosophy <https://www.britannica.com/topic/analytic-philosophy> (Frege, Russell, Moore, Wittgenstein, Anglophone dominance). Note: IEP `/analytic/` is a stub/category page — dropped. |
| phenomenology | SEP Phenomenology <https://plato.stanford.edu/entries/phenomenology/> (Husserl, Heidegger, Merleau-Ponty, Sartre, first-person); IEP <https://iep.utm.edu/phenom/>; Britannica <https://www.britannica.com/topic/phenomenology> |
| existentialism | SEP Existentialism <https://plato.stanford.edu/entries/existentialism/> (Kierkegaard, Nietzsche, Sartre, Beauvoir, Camus, authenticity, absurdity); IEP <https://iep.utm.edu/existent/>; Britannica <https://www.britannica.com/topic/existentialism> |
| african-philosophy | SEP African Sage Philosophy <https://plato.stanford.edu/entries/african-sage/> (sage philosophy, ethnophilosophy, oral traditions); SEP African Ethics <https://plato.stanford.edu/entries/african-ethics/> (communitarian ethics); IEP Hunhu/Ubuntu <https://iep.utm.edu/hunhu/> (Ubuntu); SEP Africana Philosophy <https://plato.stanford.edu/entries/africana/> (diaspora) |
| japanese-philosophy | SEP Japanese Philosophy <https://plato.stanford.edu/entries/japanese-philosophy/> (Kyoto School, Nishida, Confucian/Buddhist/Shinto strands); Britannica <https://www.britannica.com/topic/Japanese-philosophy> |
| latin-american-philosophy | SEP Latin American Philosophy <https://plato.stanford.edu/entries/latin-american-philosophy/> (colonial scholasticism, positivism, liberation philosophy, 1970s, identity question) |
| philosophy-of-history | SEP Philosophy of History <https://plato.stanford.edu/entries/history/> (speculative/analytical, explanation, narrative, causation); IEP <https://iep.utm.edu/history/>; Britannica <https://www.britannica.com/topic/philosophy-of-history> |
| philosophy-of-economics | SEP Philosophy of Economics <https://plato.stanford.edu/entries/economics/> (rationality, preference, utility, welfare) |
| feminist-philosophy | SEP Feminist Philosophy <https://plato.stanford.edu/entries/feminist-philosophy/> (feminist epistemology, care ethics, political philosophy); SEP Feminist Epistemology <https://plato.stanford.edu/entries/feminism-epistemology/> (standpoint theory, objectivity) |
| hermeneutics | SEP Hermeneutics <https://plato.stanford.edu/entries/hermeneutics/> (Schleiermacher, Dilthey, Gadamer, interpretation) |
| metaphilosophy | IEP Contemporary Metaphilosophy <https://iep.utm.edu/con-meta/> (nature/aims/methods of philosophy, Lazerowitz and the twentieth-century term) |
| philosophy-of-information | SEP Information <https://plato.stanford.edu/entries/information/> (Floridi, philosophy of information, knowledge/meaning); Floridi *The Philosophy of Information* (OUP) — bot-blocked live, existence verified via Wayback snapshot <https://web.archive.org/web/20230213213751/https://global.oup.com/academic/product/the-philosophy-of-information-9780199232383> |
| ethics-of-ai | SEP Ethics of Artificial Intelligence and Robotics <https://plato.stanford.edu/entries/ethics-ai/> (fairness/bias, transparency/opacity, privacy, robots). Britannica/IEP discrete entries do not exist (hints dead) — single strong source. |
| experimental-philosophy | SEP Experimental Philosophy <https://plato.stanford.edu/entries/experimental-philosophy/> (intuitions, empirical methods, free will); emerging status phrasing kept conservative per prior QC override (decision log (11)). |
| decision-theory | SEP Decision Theory <https://plato.stanford.edu/entries/decision-theory/> (Ramsey, von Neumann, Savage, expected utility); node identity = philosophical decision theory Q177571 stated in-summary per order. |
| critical-theory | SEP Critical Theory <https://plato.stanford.edu/entries/critical-theory/> (Horkheimer, Adorno, Marcuse, Habermas, Frankfurt); IEP Critical Theory (Frankfurt School) <https://iep.utm.edu/critical-theory-frankfurt-school/> (Institute founded 1923 — verified verbatim); Britannica <https://www.britannica.com/topic/critical-theory>. Node identity Q301751 stated in-summary per order. |

## Process notes

- Bulk URL existence check ran **before** content QC (v1 lesson institutionalized): 90 URLs, status + final URL recorded (IEP fuzzy-redirect guard).
- Bot-blocked sites bridged only by verified mirrors (Wayback) — zero verdicts rest on training knowledge (decision log (9) rule).
- All 30 parent nodes are `reviewed` (editorial v1 precondition satisfied); summaries applied to `data/node-translations.json` only.
- Generation artifact `summaries.proposed.json` is preserved unmodified as the re-auditable original.
