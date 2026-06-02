import { z } from "zod";

import { idSchema, localeSchema } from "./id.ts";
import { nodeStatusSchema, nodeTypeSchema, domainKeySchema } from "./node.ts";
import { edgeStatusSchema, relationTypeSchema } from "./edge.ts";
import { linkProviderSchema, linkTypeSchema } from "./external-link.ts";
import { sourceSchema } from "./source.ts";
import { learningPathSchema } from "./learning-path.ts";

/**
 * Contract for the static graph export produced by `scripts/export-graph.ts`.
 *
 * This schema describes the *exported build artifact* (`dist/noosphere-graph.json`),
 * not the source `/data` files. It exists so the export script can validate the
 * payload before writing it, and so a future static UI can rely on a stable,
 * read-only JSON shape.
 *
 * Design rules (mirroring the source data model, not redesigning it):
 * - Graph topology is expressed through stable IDs, never label text.
 * - `nodes[].label`/`summary` are display-only, derived from the English translation.
 * - `translations` are keyed by locale, as PR #4 emits them.
 * - `external_links` are pointers only — never cached external content.
 * - NamuWiki is external-link-only: it may appear under `external_links` (with
 *   `content_cached: false`) but never as a source or as edge evidence.
 *
 * Reuses the existing enums/schemas so the contract stays in lockstep with the
 * source model. `.strict()` is used throughout to catch accidental shape drift.
 */

/** Current exported-graph payload version. Bump on any breaking shape change. */
export const EXPORTED_GRAPH_VERSION = 1;

/** Display-only localized text bundle for a node, as embedded in the export. */
export const exportedTranslationSchema = z
  .object({
    label: z.string().min(1),
    summary: z.string(),
    aliases: z.array(z.string()),
  })
  .strict();
export type ExportedTranslation = z.infer<typeof exportedTranslationSchema>;

/** Lower-cased URL host (no port), or "" if the URL is unparseable. */
function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/** An external pointer attached to a node. Pointers only — never cached content. */
export const exportedExternalLinkSchema = z
  .object({
    locale: localeSchema,
    provider: linkProviderSchema,
    url: z.string().url(),
    link_type: linkTypeSchema,
    content_cached: z.boolean(),
  })
  .strict()
  // NamuWiki is external-link-only. Classify by host (not just the provider label,
  // which can be wrong) — mirroring scripts/validate-data.ts — so a namu.wiki link
  // can never carry cached content or hide behind a mislabeled provider.
  .superRefine((link, ctx) => {
    const host = hostOf(link.url);
    const hostIsNamuWiki = host === "namu.wiki" || host.endsWith(".namu.wiki");
    const isNamuWiki = link.provider === "namuwiki" || hostIsNamuWiki;
    if (isNamuWiki && link.content_cached) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["content_cached"],
        message: "NamuWiki is external-link-only: content_cached must be false",
      });
    }
    if (hostIsNamuWiki && link.provider !== "namuwiki") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["provider"],
        message: `link points to namu.wiki but provider is "${link.provider}" (must be "namuwiki")`,
      });
    }
  });
export type ExportedExternalLink = z.infer<typeof exportedExternalLinkSchema>;

/** A UI-ready node. Topology comes from `id`; `label`/`summary` are display-only. */
export const exportedNodeSchema = z
  .object({
    id: idSchema,
    type: nodeTypeSchema,
    /** Top-level domain key, or null for `domain` nodes that have none. */
    domain: domainKeySchema.nullable(),
    level: z.number().int().min(0),
    status: nodeStatusSchema,
    indexable: z.boolean(),
    /** Display-only default label, derived from the English translation. */
    label: z.string().min(1),
    /** Display-only default summary, derived from the English translation. */
    summary: z.string(),
    /** Localized display bundles, keyed by locale. */
    translations: z.record(localeSchema, exportedTranslationSchema),
    external_links: z.array(exportedExternalLinkSchema),
  })
  .strict();
export type ExportedNode = z.infer<typeof exportedNodeSchema>;

/** A UI-ready edge. Source/target reference node IDs; topology never uses labels. */
export const exportedEdgeSchema = z
  .object({
    id: idSchema,
    source: idSchema,
    target: idSchema,
    relation: relationTypeSchema,
    confidence: z.number().min(0).max(1),
    status: edgeStatusSchema,
    /** Non-empty list of source IDs backing this relationship. */
    evidence: z.array(idSchema).min(1),
    note: z.string().optional(),
  })
  .strict();
export type ExportedEdge = z.infer<typeof exportedEdgeSchema>;

/**
 * Whether a source represents NamuWiki. Mirrors the heuristic in
 * `scripts/validate-data.ts`: match by id, name, or URL host (using `hostname`,
 * which excludes any explicit port) so a renamed/relocated entry cannot bypass
 * the external-link-only rule.
 */
function isNamuWikiSource(source: { id: string; name: string; url: string | null }): boolean {
  const host = source.url ? hostOf(source.url) : "";
  return (
    /namu[-\s]?wiki/i.test(source.id) ||
    /namu[-\s]?wiki/i.test(source.name) ||
    host === "namu.wiki" ||
    host.endsWith(".namu.wiki")
  );
}

/**
 * The full exported graph payload. Read-only/static: a generated build artifact
 * for future static UI consumption, not a database.
 */
export const exportedGraphSchema = z
  .object({
    version: z.literal(EXPORTED_GRAPH_VERSION),
    /** ISO-8601 timestamp of when the artifact was generated. */
    generated_at: z.string().datetime(),
    default_locale: localeSchema,
    nodes: z.array(exportedNodeSchema),
    edges: z.array(exportedEdgeSchema),
    /** Source registry (reused verbatim from the source model). */
    sources: z.array(sourceSchema),
    /** Curated learning paths (reused verbatim from the source model). */
    learning_paths: z.array(learningPathSchema),
  })
  .strict()
  // Graph-level cross-reference checks the per-field shape schemas can't express
  // (nodes/sources/evidence are only validated independently). These keep the
  // contract self-enforcing even when `export:graph` runs without validate-data:
  //   1. NamuWiki is external-link-only — never a source or cited as evidence.
  //   2. Every evidence ID must resolve to a source in this payload.
  //   3. Every edge endpoint and learning-path step must resolve to a node, so the
  //      static UI never holds a dangling reference.
  .superRefine((graph, ctx) => {
    const nodeIds = new Set(graph.nodes.map((node) => node.id));
    const sourceIds = new Set<string>();
    const namuWikiSourceIds = new Set<string>();
    graph.sources.forEach((source, i) => {
      sourceIds.add(source.id);
      if (isNamuWikiSource(source)) {
        namuWikiSourceIds.add(source.id);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sources", i, "id"],
          message: `NamuWiki must not appear as a source ("${source.id}"): it is external-link-only and may never be used as evidence`,
        });
      }
    });
    const flagEvidence = (
      collection: "edges" | "learning_paths",
      index: number,
      id: string,
      evidence: string[],
    ) => {
      evidence.forEach((ev, j) => {
        if (namuWikiSourceIds.has(ev)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [collection, index, "evidence", j],
            message: `${id} cites NamuWiki source "${ev}" as evidence (NamuWiki is external-link-only and must never be primary evidence)`,
          });
        } else if (!sourceIds.has(ev)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [collection, index, "evidence", j],
            message: `${id} cites evidence "${ev}" that is not present in sources (every evidence ID must resolve to a source)`,
          });
        }
      });
    };
    graph.edges.forEach((edge, i) => {
      flagEvidence("edges", i, edge.id, edge.evidence);
      (["source", "target"] as const).forEach((endpoint) => {
        if (!nodeIds.has(edge[endpoint])) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["edges", i, endpoint],
            message: `edge ${edge.id} ${endpoint} "${edge[endpoint]}" does not resolve to a node`,
          });
        }
      });
    });
    graph.learning_paths.forEach((path, i) => {
      flagEvidence("learning_paths", i, path.id, path.evidence);
      path.node_sequence.forEach((nodeId, j) => {
        if (!nodeIds.has(nodeId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["learning_paths", i, "node_sequence", j],
            message: `learning path ${path.id} references node "${nodeId}" that does not resolve to a node`,
          });
        }
      });
    });
  });
export type ExportedGraph = z.infer<typeof exportedGraphSchema>;
