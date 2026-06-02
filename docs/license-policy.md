# License & Source Policy

Sources are tracked explicitly. Every source in `sources.json` carries complete license metadata,
and every edge cites at least one source as `evidence`.

## Source metadata

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

Required fields: `id`, `name`, `source_type`, `license`, `commercial_use`, `attribution_required`,
`share_alike_required`, `last_checked_at`. `url` may be `null` for manual curation.

`source_type`: `open_data` | `scholarly` | `reference` | `primary` | `manual`.

## Preferred public/open sources

- **Wikidata** — IDs and structured metadata (CC0).
- **OpenAlex** — scholarly works, authors, concepts, institutions, citation data.
- **ORCID** — researcher identifiers.
- **VIAF / library authority records** — identity disambiguation.
- **Wikipedia** — external links and limited factual reference, license rules respected.
- **SEP, Britannica, official institution pages, primary sources** — external links or evidence references.

## Third-party wikis

- **Wikipedia:** link and cite carefully. Do **not** bulk-copy article text into the product unless
  the license and attribution/share-alike requirements are explicitly handled.
- **NamuWiki: external links only.** Do not cache article text, do not reproduce article structure,
  and do not treat it as primary evidence. `external-links.json` entries for `namuwiki` must have
  `content_cached: false`, and a `namu.wiki` URL must use the `namuwiki` provider (enforced by
  validation). NamuWiki must **never** be registered in `sources.json`: a source entry implies it
  could be cited as evidence, which is forbidden. Validation rejects any NamuWiki source (matched by
  id, name, or `namu.wiki` host) and any edge/path that cites one.

## What we never store

- Scraped article bodies.
- Long quoted excerpts.
- Copyrighted images without complete license metadata.

## Repository license

The repository itself is `UNLICENSED` (all rights reserved) during the private/planning stage.
The open-source vs. commercial strategy is decided later, before the repository is made public.
