# Noosphere Project Charter

This is the **durable, top-level charter** for Noosphere. It records the principles that are meant
to outlive any single phase. Phase-specific working briefs (currently
[`docs/data-foundry.md`](data-foundry.md)) and operational instructions
([`CLAUDE.md`](../CLAUDE.md)) defer to this charter for overall identity, posture, and boundaries.

Where this charter and a more specific document disagree on a narrow topic the specific document
owns (e.g. the relation taxonomy owns relation types, the license policy owns source/license rules),
prefer the specific document for that topic. Where they disagree on **identity, posture, or
boundaries**, this charter governs. See [`docs/source-of-truth.md`](source-of-truth.md) for the full
hierarchy and how authority moves between documents across phases.

## 1. Identity

Noosphere is an **English-first, multilingual-ready, static/read-only knowledge atlas**. It maps
fields, concepts, people, works, methods, and evidence-backed relationships into a navigable
knowledge graph — a *navigation layer over human knowledge*.

Noosphere is **not**:

- **not a wiki clone** — it does not reproduce or cache third-party article bodies;
- **not an SEO content farm** — it does not mass-generate thin pages for search traffic;
- **not a chatbot product** — it does not ship a conversational assistant as its interface.

## 2. Product and runtime posture

- **Static/read-only first.** The atlas is served as static, read-only data. Data changes happen
  through Git commits and pull requests, never through a runtime write path.
- **JSON-first data.** Data lives as JSON files under `/data`, validated against Zod schemas. There
  is no database in the MVP.
- **Minimal surface.** No auth, login, or accounts. No admin UI. No database. No user-generated
  content, comments, or public editing.
- **No secrets.** No secrets, API keys, or tokens in the repository or its environment.
- **No commercialization surface.** No ads, no payments.

## 3. Data posture

- **Stable, language-independent IDs.** Every node has a stable ID matching
  `^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$`. Display labels and non-English text are never used as IDs.
- **Display separate from topology.** Localized labels, summaries, and aliases live in a translation
  layer keyed by `node_id` + `locale`. Graph topology never depends on displayed label text.
- **Evidence-backed edges.** Every edge carries a relation type, confidence, status, and non-empty
  evidence referencing recorded sources.
- **Sources require license metadata.** Every source records license, commercial-use,
  attribution, and share-alike metadata. Edges may only cite recorded sources.
- **NamuWiki is external-link-only.** NamuWiki is never registered as a source, never cited as
  evidence, and never cached. It appears only as external links (`content_cached: false`).

## 4. LLM boundary

Noosphere is built and maintained with heavy **interactive** use of large language models, and at
the same time its own tooling must not **depend** on cloud LLM APIs. The two ideas are not in
tension — one is about how maintainers work, the other is about what the repository runs.

- **LLMs may be used interactively by maintainers.** Reasoning, design, review, prompt writing,
  data proposals, and code implementation may all be assisted by LLMs used as interactive
  human-operated tools.
- **ChatGPT** may serve as a PM / reasoning / review / prompting assistant.
- **Claude Code** may serve as an implementation assistant.
- **No repo tooling may require cloud LLM APIs.** No Noosphere script, build, CI, runtime,
  validation, export, reporting, or maintenance step may depend on a cloud LLM API.
- **The deterministic core stays offline.** Build, validation, export, reporting, and runtime must
  remain deterministic and runnable offline. Data Foundry source-resolution and proposal-fetch jobs
  may reach **open, free, public knowledge APIs** (e.g. Wikidata, OpenAlex, ORCID — see §5 and
  [`docs/data-foundry.md`](data-foundry.md)); they are network-dependent by nature, produce only
  candidate data, and must not gate the offline core.
- **No cloud LLM API calls in repo tooling.** Repository code must not call OpenAI, Anthropic, or
  any other cloud LLM API.
- **No LLM secrets.** No LLM API keys, secrets, or tokens are stored or required.

## 5. Data Foundry principle

The main bottleneck for Noosphere is high-quality graph data, not UI. To build data at scale without
violating the boundaries above:

- **Open, free, public knowledge APIs and datasets may be used** where they are safe, documented,
  useful, and license-compatible (for example Wikidata, OpenAlex, ORCID, public dumps).
- **Foundry outputs are candidates, not truth.** Anything produced by tooling or models is
  `generated`/`proposed` data — never automatically public truth.
- **Public/indexable data comes from reviewed static releases.** Only data that has passed the
  curation gate for its risk tier and been accepted through a batch/release decision becomes
  `reviewed`, and only `reviewed` data may be `indexable`.

See [`docs/data-foundry.md`](data-foundry.md) for the current working brief that operationalizes
this principle.
