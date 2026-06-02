# SEO Policy

Noosphere must **not** become a thin, auto-generated SEO content farm. Indexability is a privilege
earned by review and original value, not a default.

## Rules

- Auto-generated pages are `noindex` by default.
- Pages with only external links are `noindex`.
- A page may be indexable only when its node has `status: reviewed` **and** it offers original value:
  a relationship explanation, learning-path context, curated sources, or an original summary.
- Do not generate thousands of low-value pages.
- Every indexable node page must have a useful reason to exist.
- Prefer a small number of high-quality curated pages at first.

## Enforcement

`nodes.json` carries an `indexable` flag. `scripts/validate-data.ts` rejects any node whose
`status` is not `reviewed` but whose `indexable` is `true`. The same rule applies to learning paths.

When node/path pages are eventually generated, the rendering layer must read `indexable` and emit
`<meta name="robots" content="noindex">` for anything not explicitly indexable.
