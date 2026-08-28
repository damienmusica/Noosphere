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

This scope is **people-inclusive by definition**: the globe maps not only fields and concepts but
the people, works, and discourse that produce and contest knowledge — knowledge cannot be honestly
mapped apart from those who make it. The field-first build order of the foundation phase (the
`part_of` skeleton, built first because it is low-risk and cheap to cover) is a **sequencing
strategy**, never a narrowing of this identity to a "field map." People and works are first-class
from the definition; the only standing boundary on admitting a person is the stricter evidence and
conservative handling required for **living people** (§3; operationalized in
[`docs/data-foundry.md`](data-foundry.md) §8) — a matter of responsibility, not of identity.

Noosphere is **not**:

- **not a wiki clone** — it does not reproduce or cache third-party article bodies;
- **not an SEO content farm** — it does not mass-generate thin pages for search traffic;
- **not a chatbot product** — it does not ship a conversational assistant as its interface.

### Shape: a globe, not a tree

Noosphere's graph is a **globe, not a single hierarchy.** Knowledge is not a tree with one canonical
root and one path to each topic; it is closer to a globe whose axes bend, meet, and part — a
discipline can belong to more than one parent, and concepts connect up, down, and sideways. This is
the native shape, not a workaround. The data model carries **co-equal multiple parents** with no
primary-parent marker (see [`docs/data-foundry.md`](data-foundry.md) §13) and typed, directional,
evidence-backed relations that cross the hierarchy. The top-down `part_of` structure is a clean spine
for navigation — never a claim that knowledge *is* a tree, or that any one arrangement is the
canonical one.

### Shape: one universe, many star systems

Noosphere is a **universe, not a single star system** (decision (130), amending (129)). What the
universe holds is threefold: the **law** every star system inherits, the **map** that fixes where
star systems may open (the domain / field / subfield skeleton under `/data`), and the
**cross-domain cast** — the people, works, and concepts that belong to no single domain and
therefore stay at the centre.

A **star system** is a domain that someone has entered at depth. It keeps its own corpus, its own
relation taxonomy (its gravity), its own visual constitution and art direction. **Star systems are
not partitions of the corpus**: nothing is carved out of `/data` to make one — they are gathered,
never cut. A star system opens the way a surface resolves as you approach it; the mechanism is
**distance, not projection**. A field no one has entered yet stays a point of light, and saying so
is honest, not a gap.

A star system opens only at a place this project records: either a node ID on the map, or a
boundary ruling that deliberately left the place empty (the registry lives in
[`scripts/lib/starsystem-addresses.ts`](../scripts/lib/starsystem-addresses.ts)). The **first star
system is 《문학의 성계》 (the Literary Star System)**, which opens at the boundary rule of decision
(86) — literature was ruled outside the main corpus and the sister product reserved there. It is
maintained in [`literary-planet/`](../literary-planet/). Star systems defer to this charter for
identity, posture, and boundaries; star-system-specific editorial policy lives with the star system.

Entities join across star systems by **Wikidata QID** (`external_ids`), never by display label. A
star system introduces no second source of truth for a shared identity: Kafka is a node in both
spheres, and each holds the aspect that is its own.

**Membership is a lens, never a stored fact** (decision (130), the Pluto rule). The corpus records
**events** — who founded, influenced, wrote — and "who belongs to this domain" is always computed
from those events. Pluto did not change in 2006; a definition did, and no recorded observation
became false. Storing membership as data would have made it a lie the day the lens moved, so
persons and works carry no `part_of` membership edges, by design and permanently.

Star systems declare which universal law they inherit; they never copy it. Universal law is
anything whose violation would reach another star system (the hard constraints, QID joins, evidence
verifiability, recording of source rights status, generation/QC separation, the *existence* of a
promotion ladder). Local law is what ends inside the system (the ladder's calibration, the relation
taxonomy, the visual grammar, collection priorities).

### Stance: organize, do not adjudicate

Noosphere **organizes and connects; it does not rank, judge, or settle.** Its job is to lay down the
points and the evidence-backed relationships between them, honestly tagged, so they can be explored —
not to decide who is right.

- **Noosphere records the *state* of discourse — including the unresolved and the contested — it
  does not resolve it.** Where scholars genuinely disagree, both sides are recorded (co-existing
  edges, `disputed: true`, the minority position preserved in `note`). The disagreement is *data to
  be navigated*, not a verdict to be reached. This follows directly from the north star —
  relationships have no single right answer; they are evaluated by whether they are *worth
  exploring*, not by *true/false*.
- The graph therefore corrects only **identity/referent-axis** errors (e.g. an external ID pointing
  at the wrong entity) and **preserves perspective/context-axis** disagreement (competing views,
  schools, framings). The only judgment Noosphere makes is a **data-quality** one — telling a genuine
  scholarly disagreement apart from a hallucination or a sourcing error — never a judgment about the
  world. Honest coverage and a source floor under every claim (including contested ones) are
  disciplines that serve this stance.

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
  evidence referencing recorded sources. Evidence may be externally-sourced or editorial/curatorial;
  the `source_type` must honestly reflect which, and pedagogical edges prefer a real cited source
  where one exists (see [`docs/data-foundry.md`](data-foundry.md)).
- **Sources require license metadata.** Every source records license, commercial-use,
  attribution, and share-alike metadata. Edges may only cite recorded sources.
- **NamuWiki is external-link-only.** NamuWiki is never registered as a source, never cited as
  evidence, and never cached. It appears only as external links (`content_cached: false`).
- **Living people: stricter evidence, conservative handling — not a blanket gate.** Claims about
  living people require stricter evidence and conservative, attributed wording, and are tiered by
  *claim type × source authority × contention* — not by aliveness alone. Noosphere records only
  positive, public, professional/scholarly contributions of living people (who founded or influenced
  what); never their private life, never negative or reputational claims. The owner governs the
  policy, its thresholds, and an escalation queue — **not** per-item sign-off; only a narrow set of
  risk signals (a contested claim, thin or non-authoritative sourcing, or any content touching private
  life or reputation) escalates to review. The operational policy lives in
  [`docs/data-foundry.md`](data-foundry.md) §8.

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
