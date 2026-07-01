# evidence-permanence-backfill-and-backlog-v1 — report

**CPO policy audit remediation (2026-07-02, decision (92)).** Two housekeeping actions in one batch:
(A) retroactive evidence-permanence anchors for the reviewed ladder-edge backlog whose Wikipedia grounding lacked a permanence anchor (the rule lapsed silently from the founder waves onward — the audit finding), and (B) live re-adjudication of the 16-node skeleton-era `proposed` backlog.

No `/data` graph topology was generated here for (A) — it records anchors for already-`reviewed` edges. (B) promoted 3 nodes + 3 edges (see promotion-report.md).

This report is offline-auditable and carries the batch permanence anchors required by docs/data-foundry.md §8 (amended 2026-07-02): the oldid permalinks below.

## A. Evidence-permanence backfill

Reviewed ladder edges (`founded_or_formalized` · `canonical_work` · `formalizes` · `influenced` · `critiques` · `member_of` · `applies_to`): **226 total**.

| Bucket | Count | Permanence anchor |
|---|---|---|
| Wikipedia-grounded — oldid permalink recorded (as of QC date) | 191 | MediaWiki revision permalink (§8 preferred) |
| Work→author edges — Wikidata P50 structured identity | 6 | Immutable Wikidata QID (no live page) |
| SEP / MacTutor / IEP / EoM / nLab primary — **SPN-pending** | 22 | `[SPN-PENDING]` honest gap (stable-URL scholarly refs; future SPN sweep) |
| Parser-miss (wiki-cited, not auto-extracted) — **SPN-pending** | 5 | `[SPN-PENDING]` (has wiki citation; anchor deferred) |
| Predate the permanence rule (2026-06-11) | 2 | grandfathered |

Two title lookups returned PAGE-NOT-FOUND (truncated/non-enwiki titles in note prose): `Cybernetics: Or Control...` and `Foundations of a General Theory of Aggregates` (German original) — the sibling field-side edge of each work carries a resolved anchor, so neither work lacks coverage.

### A.1 Wikipedia oldid permalinks (as of QC 2026-07-02)

One row per reviewed edge; anchor = the revision of each grounding article live at backfill time. `title&oldid=NNN` is immutable.

| Edge | Grounding article(s) — revision permalink |
|---|---|
| `a-mathematical-theory-of-communication-canonical-work-claude-shannon` | [A Mathematical Theory of Communication @1359011097](https://en.wikipedia.org/w/index.php?title=A_Mathematical_Theory_of_Communication&oldid=1359011097)<br>[Claude Shannon @1360643023](https://en.wikipedia.org/w/index.php?title=Claude_Shannon&oldid=1360643023) |
| `a-mathematical-theory-of-communication-canonical-work-information-theory` | [A Mathematical Theory of Communication @1359011097](https://en.wikipedia.org/w/index.php?title=A_Mathematical_Theory_of_Communication&oldid=1359011097) |
| `adam-smith-founded-economics` | [Adam Smith @1359870939](https://en.wikipedia.org/w/index.php?title=Adam_Smith&oldid=1359870939) |
| `alfred-russel-wallace-founded-evolutionary-biology` | [Alfred Russel Wallace @1360504172](https://en.wikipedia.org/w/index.php?title=Alfred_Russel_Wallace&oldid=1360504172)<br>[Evolutionary biology @1347879214](https://en.wikipedia.org/w/index.php?title=Evolutionary_biology&oldid=1347879214) |
| `alfred-tarski-founded-model-theory` | [Model theory @1353748404](https://en.wikipedia.org/w/index.php?title=Model_theory&oldid=1353748404) |
| `alonzo-church-founded-computability-theory` | [Computability theory @1342261942](https://en.wikipedia.org/w/index.php?title=Computability_theory&oldid=1342261942) |
| `amartya-sen-founded-social-choice-theory` | [Social choice theory @1360737554](https://en.wikipedia.org/w/index.php?title=Social_choice_theory&oldid=1360737554) |
| `amos-tversky-founded-behavioral-economics` | [Amos Tversky @1361411477](https://en.wikipedia.org/w/index.php?title=Amos_Tversky&oldid=1361411477) |
| `andreas-vesalius-founded-anatomy` | [Andreas Vesalius @1354613183](https://en.wikipedia.org/w/index.php?title=Andreas_Vesalius&oldid=1354613183)<br>[Anatomy @1356278259](https://en.wikipedia.org/w/index.php?title=Anatomy&oldid=1356278259) |
| `antoine-lavoisier-founded-chemistry` | [Antoine Lavoisier @1358761697](https://en.wikipedia.org/w/index.php?title=Antoine_Lavoisier&oldid=1358761697)<br>[History of chemistry @1358762265](https://en.wikipedia.org/w/index.php?title=History_of_chemistry&oldid=1358762265) |
| `auguste-comte-founded-sociology` | [Auguste Comte @1359719364](https://en.wikipedia.org/w/index.php?title=Auguste_Comte&oldid=1359719364) |
| `auguste-comte-influenced-emile-durkheim` | [Émile Durkheim @1360952863](https://en.wikipedia.org/w/index.php?title=%C3%89mile_Durkheim&oldid=1360952863) |
| `begriffsschrift-canonical-work-gottlob-frege` | [Begriffsschrift @1353573485](https://en.wikipedia.org/w/index.php?title=Begriffsschrift&oldid=1353573485)<br>[Gottlob Frege @1361739607](https://en.wikipedia.org/w/index.php?title=Gottlob_Frege&oldid=1361739607) |
| `begriffsschrift-canonical-work-mathematical-logic` | [Begriffsschrift @1353573485](https://en.wikipedia.org/w/index.php?title=Begriffsschrift&oldid=1353573485) |
| `bertrand-russell-founded-analytic-philosophy` | [Bertrand Russell @1361397523](https://en.wikipedia.org/w/index.php?title=Bertrand_Russell&oldid=1361397523) |
| `carl-friedrich-gauss-founded-number-theory` | [Number theory @1358353266](https://en.wikipedia.org/w/index.php?title=Number_theory&oldid=1358353266) |
| `carl-linnaeus-founded-systematics` | [Carl Linnaeus @1354911007](https://en.wikipedia.org/w/index.php?title=Carl_Linnaeus&oldid=1354911007)<br>[Systematics @1355534225](https://en.wikipedia.org/w/index.php?title=Systematics&oldid=1355534225) |
| `category-theory-formalizes-programming-languages` | [Category theory @1359740136](https://en.wikipedia.org/w/index.php?title=Category_theory&oldid=1359740136)<br>[Semantics @1359088104](https://en.wikipedia.org/w/index.php?title=Semantics&oldid=1359088104) |
| `cesare-beccaria-founded-criminology` | [Criminology @1361116720](https://en.wikipedia.org/w/index.php?title=Criminology&oldid=1361116720)<br>[Cesare Beccaria @1355538301](https://en.wikipedia.org/w/index.php?title=Cesare_Beccaria&oldid=1355538301) |
| `charles-darwin-founded-evolutionary-biology` | [Charles Darwin @1360793412](https://en.wikipedia.org/w/index.php?title=Charles_Darwin&oldid=1360793412)<br>[Evolutionary biology @1347879214](https://en.wikipedia.org/w/index.php?title=Evolutionary_biology&oldid=1347879214) |
| `charles-darwin-influenced-evolutionary-psychology` | [Evolutionary psychology @1354095573](https://en.wikipedia.org/w/index.php?title=Evolutionary_psychology&oldid=1354095573)<br>[Charles Darwin @1360793412](https://en.wikipedia.org/w/index.php?title=Charles_Darwin&oldid=1360793412) |
| `charles-lyell-founded-geology` | [Charles Lyell @1355730169](https://en.wikipedia.org/w/index.php?title=Charles_Lyell&oldid=1355730169)<br>[Geology @1353800106](https://en.wikipedia.org/w/index.php?title=Geology&oldid=1353800106) |
| `charles-sanders-peirce-founded-semiotics` | [Semiotics @1358684791](https://en.wikipedia.org/w/index.php?title=Semiotics&oldid=1358684791)<br>[Charles Sanders Peirce @1360341221](https://en.wikipedia.org/w/index.php?title=Charles_Sanders_Peirce&oldid=1360341221) |
| `charles-spearman-founded-psychometrics` | [Charles Spearman @1361412073](https://en.wikipedia.org/w/index.php?title=Charles_Spearman&oldid=1361412073)<br>[Psychometrics @1360588685](https://en.wikipedia.org/w/index.php?title=Psychometrics&oldid=1360588685) |
| `claude-levi-strauss-founded-structural-anthropology` | [Structural anthropology @1265460381](https://en.wikipedia.org/w/index.php?title=Structural_anthropology&oldid=1265460381) |
| `claude-shannon-influenced-computational-linguistics` | [Language model @1357657805](https://en.wikipedia.org/w/index.php?title=Language_model&oldid=1357657805) |
| `control-theory-formalizes-robotics` | [Control theory @1344611033](https://en.wikipedia.org/w/index.php?title=Control_theory&oldid=1344611033)<br>[Robotics @1361656029](https://en.wikipedia.org/w/index.php?title=Robotics&oldid=1361656029) |
| `cours-de-linguistique-generale-canonical-work-ferdinand-de-saussure` | [Course in General Linguistics @1356605029](https://en.wikipedia.org/w/index.php?title=Course_in_General_Linguistics&oldid=1356605029)<br>[Ferdinand de Saussure @1362071647](https://en.wikipedia.org/w/index.php?title=Ferdinand_de_Saussure&oldid=1362071647) |
| `cours-de-linguistique-generale-canonical-work-linguistics` | [Course in General Linguistics @1356605029](https://en.wikipedia.org/w/index.php?title=Course_in_General_Linguistics&oldid=1356605029)<br>[Linguistics @1361645604](https://en.wikipedia.org/w/index.php?title=Linguistics&oldid=1361645604) |
| `cours-de-philosophie-positive-canonical-work-sociology` | [Course of Positive Philosophy @1357993571](https://en.wikipedia.org/w/index.php?title=Course_of_Positive_Philosophy&oldid=1357993571) |
| `cybernetics-canonical-work-cybernetics` | [Cybernetics @1361254571](https://en.wikipedia.org/w/index.php?title=Cybernetics&oldid=1361254571) |
| `cybernetics-canonical-work-norbert-wiener` | [Norbert Wiener @1362051426](https://en.wikipedia.org/w/index.php?title=Norbert_Wiener&oldid=1362051426) |
| `cybernetics-influenced-artificial-intelligence` | [History of artificial intelligence @1360747741](https://en.wikipedia.org/w/index.php?title=History_of_artificial_intelligence&oldid=1360747741)<br>[Cybernetics @1361254571](https://en.wikipedia.org/w/index.php?title=Cybernetics&oldid=1361254571) |
| `daniel-kahneman-founded-behavioral-economics` | [Behavioral economics @1357481755](https://en.wikipedia.org/w/index.php?title=Behavioral_economics&oldid=1357481755) |
| `david-deutsch-founded-quantum-computing` | [David Deutsch @1358046749](https://en.wikipedia.org/w/index.php?title=David_Deutsch&oldid=1358046749)<br>[Quantum computing @1359355643](https://en.wikipedia.org/w/index.php?title=Quantum_computing&oldid=1359355643) |
| `de-humani-corporis-fabrica-canonical-work-anatomy` | [De Humani Corporis Fabrica Libri Septem @1352479774](https://en.wikipedia.org/w/index.php?title=De_Humani_Corporis_Fabrica_Libri_Septem&oldid=1352479774)<br>[Anatomy @1356278259](https://en.wikipedia.org/w/index.php?title=Anatomy&oldid=1356278259) |
| `de-humani-corporis-fabrica-canonical-work-andreas-vesalius` | [De Humani Corporis Fabrica Libri Septem @1352479774](https://en.wikipedia.org/w/index.php?title=De_Humani_Corporis_Fabrica_Libri_Septem&oldid=1352479774)<br>[Andreas Vesalius @1354613183](https://en.wikipedia.org/w/index.php?title=Andreas_Vesalius&oldid=1354613183) |
| `donald-knuth-founded-analysis-of-algorithms` | [Donald Knuth @1360322990](https://en.wikipedia.org/w/index.php?title=Donald_Knuth&oldid=1360322990) |
| `duncan-black-founded-social-choice-theory` | [Duncan Black @1360900739](https://en.wikipedia.org/w/index.php?title=Duncan_Black&oldid=1360900739) |
| `dynamical-systems-formalizes-ecology` | [Lotka–Volterra equations @1321323466](https://en.wikipedia.org/w/index.php?title=Lotka%E2%80%93Volterra_equations&oldid=1321323466)<br>[Population dynamics @1346604088](https://en.wikipedia.org/w/index.php?title=Population_dynamics&oldid=1346604088) |
| `edmund-husserl-founded-phenomenology` | [Edmund Husserl @1360911899](https://en.wikipedia.org/w/index.php?title=Edmund_Husserl&oldid=1360911899) |
| `elie-metchnikoff-founded-immunology` | [Immunology @1359158274](https://en.wikipedia.org/w/index.php?title=Immunology&oldid=1359158274) |
| `emil-kraepelin-founded-psychiatry` | [Emil Kraepelin @1359782916](https://en.wikipedia.org/w/index.php?title=Emil_Kraepelin&oldid=1359782916)<br>[Psychiatry @1360345621](https://en.wikipedia.org/w/index.php?title=Psychiatry&oldid=1360345621) |
| `emile-durkheim-founded-sociology` | [Émile Durkheim @1360952863](https://en.wikipedia.org/w/index.php?title=%C3%89mile_Durkheim&oldid=1360952863) |
| `emile-durkheim-influenced-anthropology` | [Structural functionalism @1339984055](https://en.wikipedia.org/w/index.php?title=Structural_functionalism&oldid=1339984055) |
| `emmy-noether-founded-algebra` | [Emmy Noether @1361643955](https://en.wikipedia.org/w/index.php?title=Emmy_Noether&oldid=1361643955) |
| `ernst-chladni-founded-acoustics` | [Ernst Chladni @1359073196](https://en.wikipedia.org/w/index.php?title=Ernst_Chladni&oldid=1359073196)<br>[Acoustics @1362070797](https://en.wikipedia.org/w/index.php?title=Acoustics&oldid=1362070797) |
| `ernst-haeckel-founded-ecology` | [Ernst Haeckel @1360783493](https://en.wikipedia.org/w/index.php?title=Ernst_Haeckel&oldid=1360783493)<br>[Ecology @1357945729](https://en.wikipedia.org/w/index.php?title=Ecology&oldid=1357945729) |
| `eugenius-warming-founded-ecology` | [Eugenius Warming @1361416337](https://en.wikipedia.org/w/index.php?title=Eugenius_Warming&oldid=1361416337) |
| `evolutionary-biology-influenced-economics` | [Evolutionary economics @1359270713](https://en.wikipedia.org/w/index.php?title=Evolutionary_economics&oldid=1359270713) |
| `evolutionary-biology-influenced-psychology` | [Psychology @1361242487](https://en.wikipedia.org/w/index.php?title=Psychology&oldid=1361242487)<br>[History of psychology @1360687959](https://en.wikipedia.org/w/index.php?title=History_of_psychology&oldid=1360687959) |
| `experiments-on-plant-hybridization-canonical-work-genetics` | [Experiments on Plant Hybridization @1356375892](https://en.wikipedia.org/w/index.php?title=Experiments_on_Plant_Hybridization&oldid=1356375892)<br>[Genetics @1355932124](https://en.wikipedia.org/w/index.php?title=Genetics&oldid=1355932124) |
| `experiments-on-plant-hybridization-canonical-work-gregor-mendel` | [Experiments on Plant Hybridization @1356375892](https://en.wikipedia.org/w/index.php?title=Experiments_on_Plant_Hybridization&oldid=1356375892)<br>[Gregor Mendel @1359563680](https://en.wikipedia.org/w/index.php?title=Gregor_Mendel&oldid=1359563680) |
| `ferdinand-de-saussure-founded-semiotics` | [Ferdinand de Saussure @1362071647](https://en.wikipedia.org/w/index.php?title=Ferdinand_de_Saussure&oldid=1362071647)<br>[Semiotics @1358684791](https://en.wikipedia.org/w/index.php?title=Semiotics&oldid=1358684791) |
| `ferdinand-de-saussure-influenced-claude-levi-strauss` | [Structuralism @1356196844](https://en.wikipedia.org/w/index.php?title=Structuralism&oldid=1356196844) |
| `franz-boas-founded-cultural-anthropology` | [Franz Boas @1359301314](https://en.wikipedia.org/w/index.php?title=Franz_Boas&oldid=1359301314)<br>[Cultural anthropology @1347739127](https://en.wikipedia.org/w/index.php?title=Cultural_anthropology&oldid=1347739127) |
| `friedrich-nietzsche-influenced-continental-philosophy` | [Continental philosophy @1359566449](https://en.wikipedia.org/w/index.php?title=Continental_philosophy&oldid=1359566449) |
| `friedrich-nietzsche-influenced-existentialism` | [Continental philosophy @1359566449](https://en.wikipedia.org/w/index.php?title=Continental_philosophy&oldid=1359566449) |
| `friedrich-waismann-member-of-vienna-circle` | [Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416)<br>[Friedrich Waismann @1360675753](https://en.wikipedia.org/w/index.php?title=Friedrich_Waismann&oldid=1360675753) |
| `game-theory-formalizes-economics` | [Game theory @1359140415](https://en.wikipedia.org/w/index.php?title=Game_theory&oldid=1359140415) |
| `genetics-influenced-evolutionary-biology` | [Gregor Mendel @1359563680](https://en.wikipedia.org/w/index.php?title=Gregor_Mendel&oldid=1359563680)<br>[Modern synthesis @1107186391](https://en.wikipedia.org/w/index.php?title=Modern_synthesis&oldid=1107186391) |
| `georg-cantor-founded-set-theory` | [Georg Cantor @1361025127](https://en.wikipedia.org/w/index.php?title=Georg_Cantor&oldid=1361025127) |
| `georg-cantor-influenced-david-hilbert` | [David Hilbert @1361411809](https://en.wikipedia.org/w/index.php?title=David_Hilbert&oldid=1361411809)<br>[Georg Cantor @1361025127](https://en.wikipedia.org/w/index.php?title=Georg_Cantor&oldid=1361025127) |
| `george-edward-moore-founded-analytic-philosophy` | [Analytic philosophy @1361722514](https://en.wikipedia.org/w/index.php?title=Analytic_philosophy&oldid=1361722514)<br>[G. E. Moore @1359829230](https://en.wikipedia.org/w/index.php?title=G._E._Moore&oldid=1359829230) |
| `george-miller-founded-cognitive-psychology` | [George Armitage Miller @1361793809](https://en.wikipedia.org/w/index.php?title=George_Armitage_Miller&oldid=1361793809) |
| `georges-cuvier-founded-paleontology` | [Paleontology @1361504375](https://en.wikipedia.org/w/index.php?title=Paleontology&oldid=1361504375)<br>[Georges Cuvier @1355582131](https://en.wikipedia.org/w/index.php?title=Georges_Cuvier&oldid=1355582131) |
| `georgius-agricola-founded-mineralogy` | [Mineralogy @1326295804](https://en.wikipedia.org/w/index.php?title=Mineralogy&oldid=1326295804)<br>[De Natura Fossilium @1320578333](https://en.wikipedia.org/w/index.php?title=De_Natura_Fossilium&oldid=1320578333)<br>[Georgius Agricola @1345170424](https://en.wikipedia.org/w/index.php?title=Georgius_Agricola&oldid=1345170424) |
| `gottfried-wilhelm-leibniz-founded-calculus` | [History of calculus @1360311083](https://en.wikipedia.org/w/index.php?title=History_of_calculus&oldid=1360311083) |
| `gottlob-frege-founded-philosophy-of-language` | [Philosophy of language @1361560980](https://en.wikipedia.org/w/index.php?title=Philosophy_of_language&oldid=1361560980) |
| `gottlob-frege-influenced-linguistics` | [Formal semantics (natural language) @1361131110](https://en.wikipedia.org/w/index.php?title=Formal_semantics_(natural_language)&oldid=1361131110) |
| `gregor-mendel-founded-genetics` | [Gregor Mendel @1359563680](https://en.wikipedia.org/w/index.php?title=Gregor_Mendel&oldid=1359563680)<br>[Genetics @1355932124](https://en.wikipedia.org/w/index.php?title=Genetics&oldid=1355932124) |
| `grove-karl-gilbert-founded-geomorphology` | [Grove Karl Gilbert @1338254219](https://en.wikipedia.org/w/index.php?title=Grove_Karl_Gilbert&oldid=1338254219)<br>[Geomorphology @1361867766](https://en.wikipedia.org/w/index.php?title=Geomorphology&oldid=1361867766) |
| `grundlagen-mannigfaltigkeitslehre-canonical-work-set-theory` |  |
| `hans-hahn-member-of-vienna-circle` | [Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416)<br>[Hans Hahn @1219682335](https://en.wikipedia.org/w/index.php?title=Hans_Hahn&oldid=1219682335)<br>[Hans Hahn (mathematician) @1348271780](https://en.wikipedia.org/w/index.php?title=Hans_Hahn_(mathematician)&oldid=1348271780) |
| `henri-poincare-critiques-set-theory` | [Henri Poincaré @1361412875](https://en.wikipedia.org/w/index.php?title=Henri_Poincar%C3%A9&oldid=1361412875) |
| `henri-poincare-founded-algebraic-topology` | [Henri Poincaré @1361412875](https://en.wikipedia.org/w/index.php?title=Henri_Poincar%C3%A9&oldid=1361412875) |
| `herbert-feigl-member-of-vienna-circle` | [Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416)<br>[Herbert Feigl @1356269272](https://en.wikipedia.org/w/index.php?title=Herbert_Feigl&oldid=1356269272) |
| `information-theory-formalizes-cryptography` | [Information-theoretic security @1349885968](https://en.wikipedia.org/w/index.php?title=Information-theoretic_security&oldid=1349885968) |
| `information-theory-formalizes-telecommunications-engineering` | [Information theory @1359455676](https://en.wikipedia.org/w/index.php?title=Information_theory&oldid=1359455676)<br>[Channel capacity @1322294953](https://en.wikipedia.org/w/index.php?title=Channel_capacity&oldid=1322294953) |
| `information-theory-influenced-cognitive-psychology` | [Cognitive psychology @1358215806](https://en.wikipedia.org/w/index.php?title=Cognitive_psychology&oldid=1358215806)<br>[Cognitive revolution @1345299209](https://en.wikipedia.org/w/index.php?title=Cognitive_revolution&oldid=1345299209) |
| `isaac-newton-founded-calculus` | [History of calculus @1360311083](https://en.wikipedia.org/w/index.php?title=History_of_calculus&oldid=1360311083) |
| `ivan-sutherland-founded-computer-graphics` | [Ivan Sutherland @1354347775](https://en.wikipedia.org/w/index.php?title=Ivan_Sutherland&oldid=1354347775)<br>[Computer graphics @1359504089](https://en.wikipedia.org/w/index.php?title=Computer_graphics&oldid=1359504089) |
| `james-hutton-founded-geology` | [James Hutton @1360045017](https://en.wikipedia.org/w/index.php?title=James_Hutton&oldid=1360045017)<br>[Geology @1353800106](https://en.wikipedia.org/w/index.php?title=Geology&oldid=1353800106) |
| `jan-tinbergen-founded-econometrics` | [Econometrics @1361640881](https://en.wikipedia.org/w/index.php?title=Econometrics&oldid=1361640881)<br>[Jan Tinbergen @1361412234](https://en.wikipedia.org/w/index.php?title=Jan_Tinbergen&oldid=1361412234) |
| `jean-piaget-founded-developmental-psychology` | [Jean Piaget @1361412864](https://en.wikipedia.org/w/index.php?title=Jean_Piaget&oldid=1361412864)<br>[Developmental psychology @1358621191](https://en.wikipedia.org/w/index.php?title=Developmental_psychology&oldid=1358621191) |
| `john-graunt-founded-demography` | [John Graunt @1350480621](https://en.wikipedia.org/w/index.php?title=John_Graunt&oldid=1350480621)<br>[Demography @1361798200](https://en.wikipedia.org/w/index.php?title=Demography&oldid=1361798200) |
| `john-mccarthy-founded-artificial-intelligence` | [John McCarthy (computer scientist) @1360042003](https://en.wikipedia.org/w/index.php?title=John_McCarthy_(computer_scientist)&oldid=1360042003)<br>[Dartmouth workshop @1360638286](https://en.wikipedia.org/w/index.php?title=Dartmouth_workshop&oldid=1360638286) |
| `john-milne-founded-seismology` | [John Milne @1357584139](https://en.wikipedia.org/w/index.php?title=John_Milne&oldid=1357584139)<br>[Seismology @1360735079](https://en.wikipedia.org/w/index.php?title=Seismology&oldid=1360735079) |
| `john-snow-founded-epidemiology` | [Epidemiology @1362091565](https://en.wikipedia.org/w/index.php?title=Epidemiology&oldid=1362091565)<br>[John Snow @1358852016](https://en.wikipedia.org/w/index.php?title=John_Snow&oldid=1358852016) |
| `john-tooby-founded-evolutionary-psychology` | [John Tooby @1348592646](https://en.wikipedia.org/w/index.php?title=John_Tooby&oldid=1348592646)<br>[Evolutionary psychology @1354095573](https://en.wikipedia.org/w/index.php?title=Evolutionary_psychology&oldid=1354095573) |
| `karl-ernst-von-baer-founded-developmental-biology` | [Karl Ernst von Baer @1361409394](https://en.wikipedia.org/w/index.php?title=Karl_Ernst_von_Baer&oldid=1361409394)<br>[Developmental biology @1360432346](https://en.wikipedia.org/w/index.php?title=Developmental_biology&oldid=1360432346) |
| `karl-marx-founded-sociology` | [Sociology @1361624910](https://en.wikipedia.org/w/index.php?title=Sociology&oldid=1361624910)<br>[Karl Marx @1361111805](https://en.wikipedia.org/w/index.php?title=Karl_Marx&oldid=1361111805) |
| `karl-pearson-founded-mathematical-statistics` | [Karl Pearson @1359450552](https://en.wikipedia.org/w/index.php?title=Karl_Pearson&oldid=1359450552) |
| `kenneth-arrow-founded-social-choice-theory` | [Social choice theory @1360737554](https://en.wikipedia.org/w/index.php?title=Social_choice_theory&oldid=1360737554) |
| `kurt-godel-member-of-vienna-circle` | [Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416)<br>[Kurt Gödel @1360364560](https://en.wikipedia.org/w/index.php?title=Kurt_G%C3%B6del&oldid=1360364560) |
| `kurt-lewin-founded-social-psychology` | [Kurt Lewin @1354725353](https://en.wikipedia.org/w/index.php?title=Kurt_Lewin&oldid=1354725353)<br>[Social psychology @1360737633](https://en.wikipedia.org/w/index.php?title=Social_psychology&oldid=1360737633) |
| `laws-of-thought-canonical-work-mathematical-logic` | [The Laws of Thought @1315882804](https://en.wikipedia.org/w/index.php?title=The_Laws_of_Thought&oldid=1315882804) |
| `leda-cosmides-founded-evolutionary-psychology` | [Leda Cosmides @1348592552](https://en.wikipedia.org/w/index.php?title=Leda_Cosmides&oldid=1348592552)<br>[Evolutionary psychology @1354095573](https://en.wikipedia.org/w/index.php?title=Evolutionary_psychology&oldid=1354095573) |
| `linear-algebra-formalizes-quantum-information-science` | [Mathematical formulation of quantum mechanics @1351331998](https://en.wikipedia.org/w/index.php?title=Mathematical_formulation_of_quantum_mechanics&oldid=1351331998) |
| `louis-pasteur-founded-microbiology` | [Louis Pasteur @1361413267](https://en.wikipedia.org/w/index.php?title=Louis_Pasteur&oldid=1361413267)<br>[Microbiology @1358572173](https://en.wikipedia.org/w/index.php?title=Microbiology&oldid=1358572173) |
| `luciano-floridi-founded-philosophy-of-information` | [Luciano Floridi @1342351200](https://en.wikipedia.org/w/index.php?title=Luciano_Floridi&oldid=1342351200) |
| `ludwig-wittgenstein-founded-philosophy-of-language` | [Philosophy of language @1361560980](https://en.wikipedia.org/w/index.php?title=Philosophy_of_language&oldid=1361560980) |
| `martin-hellman-founded-public-key-cryptography` | [Martin Hellman @1342910559](https://en.wikipedia.org/w/index.php?title=Martin_Hellman&oldid=1342910559) |
| `martin-seligman-founded-positive-psychology` | [Positive psychology @1361638962](https://en.wikipedia.org/w/index.php?title=Positive_psychology&oldid=1361638962)<br>[Martin Seligman @1344289987](https://en.wikipedia.org/w/index.php?title=Martin_Seligman&oldid=1344289987) |
| `marvin-minsky-founded-artificial-intelligence` | [Marvin Minsky @1361610866](https://en.wikipedia.org/w/index.php?title=Marvin_Minsky&oldid=1361610866)<br>[Dartmouth workshop @1360638286](https://en.wikipedia.org/w/index.php?title=Dartmouth_workshop&oldid=1360638286) |
| `mathematical-logic-formalizes-programming-languages` | [Curry–Howard correspondence @1361562742](https://en.wikipedia.org/w/index.php?title=Curry%E2%80%93Howard_correspondence&oldid=1361562742)<br>[Semantics @1359088104](https://en.wikipedia.org/w/index.php?title=Semantics&oldid=1359088104) |
| `mathematical-logic-formalizes-set-theory` | [Zermelo–Fraenkel set theory @1357334514](https://en.wikipedia.org/w/index.php?title=Zermelo%E2%80%93Fraenkel_set_theory&oldid=1357334514) |
| `mathematical-logic-formalizes-theoretical-computer-science` | [Theoretical computer science @1353232293](https://en.wikipedia.org/w/index.php?title=Theoretical_computer_science&oldid=1353232293) |
| `mathematics-formalizes-economics` | [Mathematical economics @1360283872](https://en.wikipedia.org/w/index.php?title=Mathematical_economics&oldid=1360283872) |
| `mathieu-orfila-founded-toxicology` | [Mathieu Orfila @1358970920](https://en.wikipedia.org/w/index.php?title=Mathieu_Orfila&oldid=1358970920)<br>[Toxicology @1360742958](https://en.wikipedia.org/w/index.php?title=Toxicology&oldid=1360742958) |
| `matthew-fontaine-maury-founded-oceanography` | [Matthew Fontaine Maury @1361426835](https://en.wikipedia.org/w/index.php?title=Matthew_Fontaine_Maury&oldid=1361426835)<br>[Oceanography @1359583401](https://en.wikipedia.org/w/index.php?title=Oceanography&oldid=1359583401) |
| `matthias-jakob-schleiden-founded-cell-biology` | [Matthias Jakob Schleiden @1361381031](https://en.wikipedia.org/w/index.php?title=Matthias_Jakob_Schleiden&oldid=1361381031)<br>[Cell theory @1360626740](https://en.wikipedia.org/w/index.php?title=Cell_theory&oldid=1360626740) |
| `max-weber-founded-sociology` | [Max Weber @1361488712](https://en.wikipedia.org/w/index.php?title=Max_Weber&oldid=1361488712) |
| `michael-gazzaniga-founded-cognitive-neuroscience` | [Michael Gazzaniga @1358268516](https://en.wikipedia.org/w/index.php?title=Michael_Gazzaniga&oldid=1358268516) |
| `mind-of-primitive-man-canonical-work-cultural-anthropology` | [The Mind of Primitive Man @1341129795](https://en.wikipedia.org/w/index.php?title=The_Mind_of_Primitive_Man&oldid=1341129795) |
| `moritz-schlick-founded-logical-positivism` | [Moritz Schlick @1360580204](https://en.wikipedia.org/w/index.php?title=Moritz_Schlick&oldid=1360580204) |
| `moritz-schlick-member-of-vienna-circle` | [Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416)<br>[Moritz Schlick @1360580204](https://en.wikipedia.org/w/index.php?title=Moritz_Schlick&oldid=1360580204) |
| `noam-chomsky-founded-generative-grammar` | [Noam Chomsky @1361048686](https://en.wikipedia.org/w/index.php?title=Noam_Chomsky&oldid=1361048686) |
| `norbert-wiener-founded-cybernetics` | [Cybernetics @1361254571](https://en.wikipedia.org/w/index.php?title=Cybernetics&oldid=1361254571) |
| `number-theory-formalizes-cryptography` | [Number theory @1358353266](https://en.wikipedia.org/w/index.php?title=Number_theory&oldid=1358353266)<br>[RSA @1360072662](https://en.wikipedia.org/w/index.php?title=RSA&oldid=1360072662) |
| `on-computable-numbers-canonical-work-alan-turing` | [Turing's proof @1360602642](https://en.wikipedia.org/w/index.php?title=Turing's_proof&oldid=1360602642)<br>[Alan Turing @1362088307](https://en.wikipedia.org/w/index.php?title=Alan_Turing&oldid=1362088307) |
| `on-computable-numbers-canonical-work-computability-theory` | [Turing machine @1361925546](https://en.wikipedia.org/w/index.php?title=Turing_machine&oldid=1361925546)<br>[Alan Turing @1362088307](https://en.wikipedia.org/w/index.php?title=Alan_Turing&oldid=1362088307) |
| `on-crimes-and-punishments-canonical-work-cesare-beccaria` | [On Crimes and Punishments @1351517400](https://en.wikipedia.org/w/index.php?title=On_Crimes_and_Punishments&oldid=1351517400)<br>[Cesare Beccaria @1355538301](https://en.wikipedia.org/w/index.php?title=Cesare_Beccaria&oldid=1355538301) |
| `on-crimes-and-punishments-canonical-work-criminology` | [On Crimes and Punishments @1351517400](https://en.wikipedia.org/w/index.php?title=On_Crimes_and_Punishments&oldid=1351517400)<br>[Criminology @1361116720](https://en.wikipedia.org/w/index.php?title=Criminology&oldid=1361116720) |
| `on-the-origin-of-species-canonical-work-charles-darwin` | [On the Origin of Species @1361718398](https://en.wikipedia.org/w/index.php?title=On_the_Origin_of_Species&oldid=1361718398)<br>[Charles Darwin @1360793412](https://en.wikipedia.org/w/index.php?title=Charles_Darwin&oldid=1360793412) |
| `on-the-origin-of-species-canonical-work-evolutionary-biology` | [On the Origin of Species @1361718398](https://en.wikipedia.org/w/index.php?title=On_the_Origin_of_Species&oldid=1361718398)<br>[Evolutionary biology @1347879214](https://en.wikipedia.org/w/index.php?title=Evolutionary_biology&oldid=1347879214) |
| `optimization-formalizes-operations-research` | [Operations research @1356002595](https://en.wikipedia.org/w/index.php?title=Operations_research&oldid=1356002595)<br>[Mathematical optimization @1360707362](https://en.wikipedia.org/w/index.php?title=Mathematical_optimization&oldid=1360707362) |
| `oskar-morgenstern-founded-game-theory` | [Game theory @1359140415](https://en.wikipedia.org/w/index.php?title=Game_theory&oldid=1359140415) |
| `oswald-schmiedeberg-founded-pharmacology` | [Oswald Schmiedeberg @1349936322](https://en.wikipedia.org/w/index.php?title=Oswald_Schmiedeberg&oldid=1349936322)<br>[Pharmacology @1362032384](https://en.wikipedia.org/w/index.php?title=Pharmacology&oldid=1362032384) |
| `otto-neurath-founded-logical-positivism` | [Otto Neurath @1350965325](https://en.wikipedia.org/w/index.php?title=Otto_Neurath&oldid=1350965325) |
| `otto-neurath-member-of-vienna-circle` | [Otto Neurath @1350965325](https://en.wikipedia.org/w/index.php?title=Otto_Neurath&oldid=1350965325)<br>[Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416) |
| `partial-differential-equations-formalizes-fluid-dynamics` | [Navier–Stokes equations @1356630968](https://en.wikipedia.org/w/index.php?title=Navier%E2%80%93Stokes_equations&oldid=1356630968) |
| `paul-ehrlich-founded-immunology` | [Paul Ehrlich @1361410654](https://en.wikipedia.org/w/index.php?title=Paul_Ehrlich&oldid=1361410654) |
| `phenomenology-influenced-psychology` | [Phenomenology @1283301308](https://en.wikipedia.org/w/index.php?title=Phenomenology&oldid=1283301308) |
| `philipp-frank-member-of-vienna-circle` | [Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416)<br>[Philipp Frank @1348271754](https://en.wikipedia.org/w/index.php?title=Philipp_Frank&oldid=1348271754) |
| `philippe-pinel-founded-psychiatry` | [Philippe Pinel @1328903857](https://en.wikipedia.org/w/index.php?title=Philippe_Pinel&oldid=1328903857) |
| `philosophiae-naturalis-principia-mathematica-canonical-work-isaac-newton` | [Philosophiæ Naturalis Principia Mathematica @1361196779](https://en.wikipedia.org/w/index.php?title=Philosophi%C3%A6_Naturalis_Principia_Mathematica&oldid=1361196779)<br>[Isaac Newton @1361665583](https://en.wikipedia.org/w/index.php?title=Isaac_Newton&oldid=1361665583) |
| `philosophiae-naturalis-principia-mathematica-canonical-work-physics` | [Philosophiæ Naturalis Principia Mathematica @1361196779](https://en.wikipedia.org/w/index.php?title=Philosophi%C3%A6_Naturalis_Principia_Mathematica&oldid=1361196779)<br>[Physics @1361145209](https://en.wikipedia.org/w/index.php?title=Physics&oldid=1361145209) |
| `principles-of-geology-canonical-work-charles-lyell` | [Principles of Geology @1360126876](https://en.wikipedia.org/w/index.php?title=Principles_of_Geology&oldid=1360126876)<br>[Charles Lyell @1355730169](https://en.wikipedia.org/w/index.php?title=Charles_Lyell&oldid=1355730169) |
| `principles-of-geology-canonical-work-geology` | [Principles of Geology @1360126876](https://en.wikipedia.org/w/index.php?title=Principles_of_Geology&oldid=1360126876)<br>[Geology @1353800106](https://en.wikipedia.org/w/index.php?title=Geology&oldid=1353800106) |
| `principles-of-physiological-psychology-canonical-work-experimental-psychology` | [Wilhelm Wundt @1361411640](https://en.wikipedia.org/w/index.php?title=Wilhelm_Wundt&oldid=1361411640)<br>[Experimental psychology @1360656985](https://en.wikipedia.org/w/index.php?title=Experimental_psychology&oldid=1360656985) |
| `principles-of-physiological-psychology-canonical-work-wilhelm-wundt` | [Wilhelm Wundt @1361411640](https://en.wikipedia.org/w/index.php?title=Wilhelm_Wundt&oldid=1361411640)<br>[Experimental psychology @1360656985](https://en.wikipedia.org/w/index.php?title=Experimental_psychology&oldid=1360656985) |
| `probability-theory-formalizes-bayesian-inference` | [Bayesian inference @1354610566](https://en.wikipedia.org/w/index.php?title=Bayesian_inference&oldid=1354610566) |
| `probability-theory-formalizes-financial-economics` | [Mathematical finance @1348771090](https://en.wikipedia.org/w/index.php?title=Mathematical_finance&oldid=1348771090)<br>[Financial economics @1353949163](https://en.wikipedia.org/w/index.php?title=Financial_economics&oldid=1353949163) |
| `probability-theory-formalizes-information-theory` | [Information theory @1359455676](https://en.wikipedia.org/w/index.php?title=Information_theory&oldid=1359455676) |
| `probability-theory-formalizes-statistical-physics` | [Statistical mechanics @1355776854](https://en.wikipedia.org/w/index.php?title=Statistical_mechanics&oldid=1355776854) |
| `protestant-ethic-canonical-work-sociology` | [The Protestant Ethic and the Spirit of Capitalism @1353077594](https://en.wikipedia.org/w/index.php?title=The_Protestant_Ethic_and_the_Spirit_of_Capitalism&oldid=1353077594) |
| `ragnar-frisch-founded-econometrics` | [Econometrics @1361640881](https://en.wikipedia.org/w/index.php?title=Econometrics&oldid=1361640881) |
| `rene-just-hauy-founded-crystallography` | [René Just Haüy @1359697757](https://en.wikipedia.org/w/index.php?title=Ren%C3%A9_Just_Ha%C3%BCy&oldid=1359697757)<br>[Crystallography @1351369344](https://en.wikipedia.org/w/index.php?title=Crystallography&oldid=1351369344) |
| `richard-dedekind-founded-set-theory` | [Set theory @1360283457](https://en.wikipedia.org/w/index.php?title=Set_theory&oldid=1360283457) |
| `richard-thaler-founded-behavioral-economics` | [Richard Thaler @1348481541](https://en.wikipedia.org/w/index.php?title=Richard_Thaler&oldid=1348481541) |
| `robert-koch-founded-microbiology` | [Robert Koch @1361412700](https://en.wikipedia.org/w/index.php?title=Robert_Koch&oldid=1361412700)<br>[Microbiology @1358572173](https://en.wikipedia.org/w/index.php?title=Microbiology&oldid=1358572173) |
| `roman-jakobson-founded-phonology` | [Roman Jakobson @1358215180](https://en.wikipedia.org/w/index.php?title=Roman_Jakobson&oldid=1358215180) |
| `roman-jakobson-influenced-claude-levi-strauss` | [Roman Jakobson @1358215180](https://en.wikipedia.org/w/index.php?title=Roman_Jakobson&oldid=1358215180) |
| `ronald-fisher-founded-mathematical-statistics` | [Ronald Fisher @1361842886](https://en.wikipedia.org/w/index.php?title=Ronald_Fisher&oldid=1361842886) |
| `ronald-langacker-founded-cognitive-linguistics` | [Ronald Langacker @1197938824](https://en.wikipedia.org/w/index.php?title=Ronald_Langacker&oldid=1197938824) |
| `rudolf-carnap-founded-logical-positivism` | [Rudolf Carnap @1361397477](https://en.wikipedia.org/w/index.php?title=Rudolf_Carnap&oldid=1361397477) |
| `rudolf-carnap-member-of-vienna-circle` | [Rudolf Carnap @1361397477](https://en.wikipedia.org/w/index.php?title=Rudolf_Carnap&oldid=1361397477)<br>[Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416) |
| `rules-of-sociological-method-canonical-work-sociology` | [The Rules of Sociological Method @1300661555](https://en.wikipedia.org/w/index.php?title=The_Rules_of_Sociological_Method&oldid=1300661555) |
| `samuel-eilenberg-founded-category-theory` | [Category theory @1359740136](https://en.wikipedia.org/w/index.php?title=Category_theory&oldid=1359740136) |
| `saunders-mac-lane-founded-category-theory` | [Category theory @1359740136](https://en.wikipedia.org/w/index.php?title=Category_theory&oldid=1359740136) |
| `set-theory-formalizes-mathematics` | [Zermelo–Fraenkel set theory @1357334514](https://en.wikipedia.org/w/index.php?title=Zermelo%E2%80%93Fraenkel_set_theory&oldid=1357334514) |
| `sigmund-freud-founded-psychoanalysis` | [Psychoanalysis @1361432945](https://en.wikipedia.org/w/index.php?title=Psychoanalysis&oldid=1361432945) |
| `sigmund-freud-influenced-literary-studies` | [Psychoanalytic literary criticism @1358424636](https://en.wikipedia.org/w/index.php?title=Psychoanalytic_literary_criticism&oldid=1358424636) |
| `social-choice-and-individual-values-canonical-work-kenneth-arrow` | [Social Choice and Individual Values @1335439505](https://en.wikipedia.org/w/index.php?title=Social_Choice_and_Individual_Values&oldid=1335439505)<br>[Kenneth Arrow @1346032669](https://en.wikipedia.org/w/index.php?title=Kenneth_Arrow&oldid=1346032669) |
| `social-choice-and-individual-values-canonical-work-social-choice-theory` | [Social Choice and Individual Values @1335439505](https://en.wikipedia.org/w/index.php?title=Social_Choice_and_Individual_Values&oldid=1335439505)<br>[Social choice theory @1360737554](https://en.wikipedia.org/w/index.php?title=Social_choice_theory&oldid=1360737554) |
| `social-choice-theory-applies-to-philosophy` | [Social choice theory @1360737554](https://en.wikipedia.org/w/index.php?title=Social_choice_theory&oldid=1360737554) |
| `social-choice-theory-applies-to-political-science` | [Social choice theory @1360737554](https://en.wikipedia.org/w/index.php?title=Social_choice_theory&oldid=1360737554) |
| `statistical-physics-influenced-information-theory` | [Entropy in thermodynamics and information theory @1354349583](https://en.wikipedia.org/w/index.php?title=Entropy_in_thermodynamics_and_information_theory&oldid=1354349583)<br>[History of entropy @1328823008](https://en.wikipedia.org/w/index.php?title=History_of_entropy&oldid=1328823008) |
| `statistics-formalizes-econometrics` | [Econometrics @1359438878](https://en.wikipedia.org/w/index.php?title=Econometrics&oldid=1359438878)<br>[Economics @1358103395](https://en.wikipedia.org/w/index.php?title=Economics&oldid=1358103395) |
| `statistics-formalizes-machine-learning` | [Machine learning @1358805808](https://en.wikipedia.org/w/index.php?title=Machine_learning&oldid=1358805808)<br>[Statistical learning theory @1296238628](https://en.wikipedia.org/w/index.php?title=Statistical_learning_theory&oldid=1296238628) |
| `stephen-cook-founded-computational-complexity-theory` | [Stephen Cook @1351724976](https://en.wikipedia.org/w/index.php?title=Stephen_Cook&oldid=1351724976) |
| `systema-naturae-canonical-work-carl-linnaeus` | [Systema Naturae @1358076593](https://en.wikipedia.org/w/index.php?title=Systema_Naturae&oldid=1358076593)<br>[Carl Linnaeus @1354911007](https://en.wikipedia.org/w/index.php?title=Carl_Linnaeus&oldid=1354911007) |
| `systema-naturae-canonical-work-systematics` | [Systema Naturae @1358076593](https://en.wikipedia.org/w/index.php?title=Systema_Naturae&oldid=1358076593)<br>[Systematics @1355534225](https://en.wikipedia.org/w/index.php?title=Systematics&oldid=1355534225) |
| `systems-science-influenced-sociology` | [Systems theory @1360553088](https://en.wikipedia.org/w/index.php?title=Systems_theory&oldid=1360553088)<br>[Niklas Luhmann @1353022355](https://en.wikipedia.org/w/index.php?title=Niklas_Luhmann&oldid=1353022355) |
| `the-interpretation-of-dreams-canonical-work-psychoanalysis` | [The Interpretation of Dreams @1341587144](https://en.wikipedia.org/w/index.php?title=The_Interpretation_of_Dreams&oldid=1341587144)<br>[Psychoanalysis @1361432945](https://en.wikipedia.org/w/index.php?title=Psychoanalysis&oldid=1361432945) |
| `the-interpretation-of-dreams-canonical-work-sigmund-freud` | [The Interpretation of Dreams @1341587144](https://en.wikipedia.org/w/index.php?title=The_Interpretation_of_Dreams&oldid=1341587144)<br>[Sigmund Freud @1362025123](https://en.wikipedia.org/w/index.php?title=Sigmund_Freud&oldid=1362025123) |
| `the-wealth-of-nations-canonical-work-adam-smith` | [The Wealth of Nations @1361622943](https://en.wikipedia.org/w/index.php?title=The_Wealth_of_Nations&oldid=1361622943)<br>[Adam Smith @1359870939](https://en.wikipedia.org/w/index.php?title=Adam_Smith&oldid=1359870939) |
| `the-wealth-of-nations-canonical-work-economics` | [The Wealth of Nations @1361622943](https://en.wikipedia.org/w/index.php?title=The_Wealth_of_Nations&oldid=1361622943)<br>[Economics @1361310531](https://en.wikipedia.org/w/index.php?title=Economics&oldid=1361310531) |
| `theodor-schwann-founded-cell-biology` | [Matthias Jakob Schleiden @1361381031](https://en.wikipedia.org/w/index.php?title=Matthias_Jakob_Schleiden&oldid=1361381031)<br>[Cell theory @1360626740](https://en.wikipedia.org/w/index.php?title=Cell_theory&oldid=1360626740)<br>[Theodor Schwann @1332233065](https://en.wikipedia.org/w/index.php?title=Theodor_Schwann&oldid=1332233065) |
| `traite-elementaire-de-chimie-canonical-work-antoine-lavoisier` | [Traité Élémentaire de Chimie @1354179399](https://en.wikipedia.org/w/index.php?title=Trait%C3%A9_%C3%89l%C3%A9mentaire_de_Chimie&oldid=1354179399)<br>[Antoine Lavoisier @1358761697](https://en.wikipedia.org/w/index.php?title=Antoine_Lavoisier&oldid=1358761697) |
| `traite-elementaire-de-chimie-canonical-work-chemistry` | [Traité Élémentaire de Chimie @1354179399](https://en.wikipedia.org/w/index.php?title=Trait%C3%A9_%C3%89l%C3%A9mentaire_de_Chimie&oldid=1354179399)<br>[Chemistry @1358325707](https://en.wikipedia.org/w/index.php?title=Chemistry&oldid=1358325707) |
| `ulric-neisser-founded-cognitive-psychology` | [Ulric Neisser @1342427506](https://en.wikipedia.org/w/index.php?title=Ulric_Neisser&oldid=1342427506)<br>[Cognitive psychology @1358215806](https://en.wikipedia.org/w/index.php?title=Cognitive_psychology&oldid=1358215806) |
| `victor-moritz-goldschmidt-founded-geochemistry` | [Victor Goldschmidt @1358662452](https://en.wikipedia.org/w/index.php?title=Victor_Goldschmidt&oldid=1358662452)<br>[Geochemistry @1359051264](https://en.wikipedia.org/w/index.php?title=Geochemistry&oldid=1359051264) |
| `vienna-circle-formalized-logical-positivism` | [Vienna Circle @1351223416](https://en.wikipedia.org/w/index.php?title=Vienna_Circle&oldid=1351223416)<br>[Moritz Schlick @1360580204](https://en.wikipedia.org/w/index.php?title=Moritz_Schlick&oldid=1360580204) |
| `vint-cerf-founded-internet` | [Vint Cerf @1355092836](https://en.wikipedia.org/w/index.php?title=Vint_Cerf&oldid=1355092836) |
| `vladimir-vernadsky-founded-geochemistry` | [Vladimir Vernadsky @1361248776](https://en.wikipedia.org/w/index.php?title=Vladimir_Vernadsky&oldid=1361248776)<br>[Geochemistry @1359051264](https://en.wikipedia.org/w/index.php?title=Geochemistry&oldid=1359051264) |
| `whitfield-diffie-founded-public-key-cryptography` | [Whitfield Diffie @1346434482](https://en.wikipedia.org/w/index.php?title=Whitfield_Diffie&oldid=1346434482) |
| `wilhelm-wundt-founded-experimental-psychology` | [Wilhelm Wundt @1361411640](https://en.wikipedia.org/w/index.php?title=Wilhelm_Wundt&oldid=1361411640)<br>[Experimental psychology @1360656985](https://en.wikipedia.org/w/index.php?title=Experimental_psychology&oldid=1360656985) |
| `william-labov-founded-sociolinguistics` | [William Labov @1356581526](https://en.wikipedia.org/w/index.php?title=William_Labov&oldid=1356581526)<br>[Sociolinguistics @1361106073](https://en.wikipedia.org/w/index.php?title=Sociolinguistics&oldid=1361106073) |
| `william-morris-davis-founded-geomorphology` | [Geomorphology @1361867766](https://en.wikipedia.org/w/index.php?title=Geomorphology&oldid=1361867766)<br>[William Morris Davis @1331278428](https://en.wikipedia.org/w/index.php?title=William_Morris_Davis&oldid=1331278428) |

### A.2 SPN-pending (non-Wikipedia-primary or parser-miss) — honest gaps

Recorded, never silently dropped (§8). These cite established scholarly reference works (SEP/MacTutor/IEP/EoM/nLab) with stable URLs; a future SPN sweep will snapshot them. Most are 2026-06-19 `formalizes`/`founded_or_formalized` and philosophy `(a)`-edges.

**SEP/MacTutor/IEP/EoM/nLab primary (22):**
- `alan-turing-founded-computability-theory` `[SPN-PENDING]`
- `analytic-philosophy-critiques-continental-philosophy` `[SPN-PENDING]`
- `ancient-philosophy-influenced-medieval-philosophy` `[SPN-PENDING]`
- `andrey-kolmogorov-founded-probability-theory` `[SPN-PENDING]`
- `arthur-schopenhauer-influenced-aesthetics` `[SPN-PENDING]`
- `arthur-schopenhauer-influenced-friedrich-nietzsche` `[SPN-PENDING]`
- `arthur-schopenhauer-influenced-sigmund-freud` `[SPN-PENDING]`
- `category-theory-formalizes-mathematics` `[SPN-PENDING]`
- `claude-shannon-founded-information-theory` `[SPN-PENDING]`
- `david-hilbert-founded-proof-theory` `[SPN-PENDING]`
- `experimental-philosophy-critiques-analytic-philosophy` `[SPN-PENDING]`
- `feminist-philosophy-critiques-epistemology` `[SPN-PENDING]`
- `george-boole-founded-mathematical-logic` `[SPN-PENDING]`
- `gottlob-frege-founded-mathematical-logic` `[SPN-PENDING]`
- `john-nash-founded-game-theory` `[SPN-PENDING]`
- `john-von-neumann-founded-game-theory` `[SPN-PENDING]`
- `ludwig-wittgenstein-influenced-logical-positivism` `[SPN-PENDING]`
- `mathematical-logic-formalizes-mathematics` `[SPN-PENDING]`
- `phenomenology-influenced-existentialism` `[SPN-PENDING]`
- `pragmatism-influenced-philosophy-of-education` `[SPN-PENDING]`
- `probability-theory-formalizes-random-variable` `[SPN-PENDING]`
- `ronald-fisher-critiques-karl-pearson` `[SPN-PENDING]`

**Work→author edges — Wikidata P50 anchor, no live page (6):**
- `cours-de-philosophie-positive-canonical-work-auguste-comte` — permanence via Wikidata QID (immutable); field-side sibling carries the oldid anchor
- `grundlagen-mannigfaltigkeitslehre-canonical-work-georg-cantor` — permanence via Wikidata QID (immutable); field-side sibling carries the oldid anchor
- `laws-of-thought-canonical-work-george-boole` — permanence via Wikidata QID (immutable); field-side sibling carries the oldid anchor
- `mind-of-primitive-man-canonical-work-franz-boas` — permanence via Wikidata QID (immutable); field-side sibling carries the oldid anchor
- `protestant-ethic-canonical-work-max-weber` — permanence via Wikidata QID (immutable); field-side sibling carries the oldid anchor
- `rules-of-sociological-method-canonical-work-emile-durkheim` — permanence via Wikidata QID (immutable); field-side sibling carries the oldid anchor

**Parser-miss (5, wiki-cited):**
- `game-theory-formalizes-evolutionary-biology` `[SPN-PENDING]`
- `game-theory-formalizes-political-science` `[SPN-PENDING]`
- `george-lakoff-founded-cognitive-linguistics` `[SPN-PENDING]`
- `probability-theory-formalizes-probability-distribution` `[SPN-PENDING]`
- `probability-theory-formalizes-statistics` `[SPN-PENDING]`
