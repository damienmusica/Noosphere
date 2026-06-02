# Data Model

All data lives as JSON files under `/data` and is validated against Zod schemas in `/src/schema`
by `scripts/validate-data.ts`. There is no database. Data changes happen via Git.

## Canonical IDs

IDs are stable and language-independent, matching:

```text
^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$
```

Examples: `field:mathematics`, `subfield:linear-algebra`, `concept:vector-space`,
`person:isaac-newton`, `work:principia-mathematica-newton`, `method:bayesian-inference`,
`path:foundations-of-ai`, `source:wikidata`, `edge:...`.

Rules:

- Never use display labels (or non-English labels) as IDs.
- No spaces, punctuation, or unstable provider names in canonical IDs.
- Provider identifiers (Wikidata QID, OpenAlex ID, ORCID) are stored in `external_ids`, never as primary IDs.

## Files

| File | Contents |
| --- | --- |
| `nodes.json` | Graph nodes (topology + metadata, no display text). |
| `node-translations.json` | Localized labels/summaries/aliases, keyed by `node_id` + `locale`. |
| `edges.json` | Relationships between nodes, with relation type, confidence, status, evidence. |
| `sources.json` | Source registry with license metadata. |
| `external-links.json` | Pointers to external pages (never cached content). |
| `learning-paths.json` | Curated ordered sequences of nodes. |

## `nodes.json`

```json
{
  "id": "field:mathematics",
  "type": "field",
  "domain": "formal_sciences",
  "level": 1,
  "status": "reviewed",
  "indexable": true,
  "is_living_person": false,
  "external_ids": { "wikidata": "Q395" },
  "created_at": "2026-06-02",
  "updated_at": "2026-06-02"
}
```

- `type`: `domain` | `field` | `subfield` | `concept` | `person` | `work` | `method` | `tool` | `institution`.
- `status`: `draft` | `generated` | `proposed` | `reviewed` | `deprecated`.
- `indexable`: only `reviewed` nodes may be `true` (see `seo-policy.md`).
- `is_living_person`: defaults to `false`; `true` requires stricter evidence (see `ai-usage-policy.md`).
- `level`: integer depth hint (0 = domain, 1 = field, …).
- `domain`: top-level domain key (see "Domains" below). Required for non-`domain` nodes.

## `node-translations.json`

The graph topology never depends on label text. Display strings live here.

```json
{
  "node_id": "field:mathematics",
  "locale": "en",
  "label": "Mathematics",
  "summary": "The study of structure, quantity, space, and change.",
  "aliases": ["Math"],
  "reviewed": true
}
```

- Default locale is `en`. Every node must have an `en` translation.
- An `indexable` node must have a **reviewed** `en` translation (see `seo-policy.md`).
- Korean (`ko`) is planned, not required for MVP.

## `edges.json`

```json
{
  "id": "edge:linear-algebra-prerequisite-machine-learning",
  "source": "subfield:linear-algebra",
  "target": "field:machine-learning",
  "relation": "prerequisite_for",
  "confidence": 0.95,
  "status": "reviewed",
  "evidence": ["source:manual-curation-v1"],
  "note": "Linear algebra is foundational for machine learning models."
}
```

Required: `id`, `source`, `target`, `relation`, `confidence`, `status`, `evidence`. Rules:

- `id` must use the `edge:` namespace.
- `source` and `target` must reference existing node IDs.
- `source` ≠ `target` (self-loops are rejected).
- `relation` must be in the taxonomy (`relation-taxonomy.md`).
- `confidence` is in `[0, 1]`.
- `evidence` is non-empty and every entry references an existing source ID.
- `evidence` must never reference a NamuWiki source (NamuWiki is external-links-only).
- `prerequisite_for` edges must not form a cycle.

## `sources.json`

```json
{
  "id": "source:wikidata",
  "name": "Wikidata",
  "source_type": "open_data",
  "license": "CC0",
  "commercial_use": true,
  "attribution_required": false,
  "share_alike_required": false,
  "url": "https://www.wikidata.org/",
  "last_checked_at": "2026-06-02"
}
```

Every source carries complete license metadata. `url` may be `null` **only** for `manual`
sources; every non-manual source must record an `http`/`https` URL. NamuWiki must never be
registered here (it is external-links-only). See `license-policy.md`.

## `external-links.json`

```json
{
  "node_id": "person:isaac-newton",
  "locale": "en",
  "provider": "wikipedia",
  "url": "https://en.wikipedia.org/wiki/Isaac_Newton",
  "link_type": "further_reading",
  "content_cached": false
}
```

- `node_id` references an existing node.
- `url` must be `https:` (or `http:`); other schemes are rejected.
- `content_cached` must be `false` for `namuwiki`. We never store scraped bodies, long excerpts,
  or copyrighted images. See `license-policy.md` and `security-policy.md`.

## `learning-paths.json`

```json
{
  "id": "path:foundations-of-ai",
  "status": "reviewed",
  "indexable": true,
  "node_sequence": ["field:mathematics", "subfield:linear-algebra", "field:machine-learning"],
  "evidence": ["source:manual-curation-v1"]
}
```

- `node_sequence` is an ordered list of existing node IDs (length ≥ 2, no duplicates).
- Localized title/description live in `node-translations`-style overrides later; for MVP the path
  carries an optional English `title`/`description` inline.

## Static graph export

`scripts/export-graph.ts` (run via `npm run export:graph`) reads the six `/data` files,
validates them against the same Zod schemas, and emits a single read-only payload at
`dist/noosphere-graph.json` for a future static UI to consume.

This is a **build artifact, not a database**: the script fetches nothing, writes nothing back
to `/data`, and embeds no external article content. `dist/` is gitignored, so the generated file
is **not committed** — regenerate it from the JSON data instead.

Payload shape (abridged):

```json
{
  "version": 1,
  "generated_at": "2026-06-02T00:00:00.000Z",
  "default_locale": "en",
  "nodes": [
    {
      "id": "field:mathematics",
      "type": "field",
      "domain": "formal_sciences",
      "level": 1,
      "status": "reviewed",
      "indexable": true,
      "label": "Mathematics",
      "summary": "The study of structure, quantity, space, and change.",
      "translations": { "en": { "label": "Mathematics", "summary": "…", "aliases": ["Math"] } },
      "external_links": [{ "locale": "en", "provider": "wikipedia", "url": "https://…", "link_type": "further_reading", "content_cached": false }]
    }
  ],
  "edges": [],
  "sources": [],
  "learning_paths": []
}
```

Determinism: nodes/edges/sources/learning paths are sorted by `id`, per-node external links by
`provider` then `url`, and translations keyed by locale. Topology never depends on label text; the
default display `label`/`summary` come from the English (`en`) translation. A node missing its `en`
translation fails the export (it is never given an invented label). Run `npm run validate:data`
first — full cross-file integrity and policy checks live there.

## Domains

Top-level domain keys used by `nodes.json#domain`:

`formal_sciences`, `natural_sciences`, `life_sciences`, `cognitive_sciences`,
`computer_and_information_sciences`, `engineering_and_technology`, `medicine_and_health`,
`social_sciences`, `humanities`, `arts_and_design`, `practical_knowledge`, `meta_knowledge`.
