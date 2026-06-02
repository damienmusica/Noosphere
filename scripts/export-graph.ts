/**
 * Static graph export for Noosphere.
 *
 * Reads the repository-managed JSON files in /data, validates them against the
 * Zod schemas in /src/schema, and emits a single read-only graph payload that a
 * future static UI can consume without a database or runtime server.
 *
 * This is a build artifact, not a database: it fetches nothing, writes nothing
 * back to /data, and never embeds external article content. Cross-file integrity
 * and policy checks live in scripts/validate-data.ts (run that first); this
 * script fails fast on malformed/missing data and on the one invariant it
 * depends on directly — every node needs an English (default-locale) label.
 *
 * Output: dist/noosphere-graph.json (dist/ is gitignored; not committed).
 * Run with: npm run export:graph
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { z } from "zod";

import { nodeSchema } from "../src/schema/node.ts";
import { nodeTranslationSchema } from "../src/schema/node-translation.ts";
import { edgeSchema } from "../src/schema/edge.ts";
import { sourceSchema } from "../src/schema/source.ts";
import { externalLinkSchema } from "../src/schema/external-link.ts";
import { learningPathSchema } from "../src/schema/learning-path.ts";
import { DEFAULT_LOCALE } from "../src/schema/id.ts";

const PAYLOAD_VERSION = 1;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const OUT_DIR = join(__dirname, "..", "dist");
const OUT_FILE = join(OUT_DIR, "noosphere-graph.json");

/** Read + JSON-parse a /data file, failing fast if it is missing or invalid. */
function readJson(file: string): unknown {
  const path = join(DATA_DIR, file);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    throw new Error(`[${file}] could not read/parse JSON: ${(err as Error).message}`);
  }
}

/** Parse `data` as an array of `schema`, failing fast with all schema issues. */
function parseArray<S extends z.ZodTypeAny>(file: string, schema: S, data: unknown): z.infer<S>[] {
  const result = z.array(schema).safeParse(data);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`[${file}] failed schema validation:\n${details}`);
  }
  return result.data;
}

/** Stable, locale-independent string comparison for deterministic ordering. */
const byString = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

// --- Load & schema-validate every file ---------------------------------------
const nodes = parseArray("nodes.json", nodeSchema, readJson("nodes.json"));
const translations = parseArray(
  "node-translations.json",
  nodeTranslationSchema,
  readJson("node-translations.json"),
);
const edges = parseArray("edges.json", edgeSchema, readJson("edges.json"));
const sources = parseArray("sources.json", sourceSchema, readJson("sources.json"));
const externalLinks = parseArray(
  "external-links.json",
  externalLinkSchema,
  readJson("external-links.json"),
);
const learningPaths = parseArray(
  "learning-paths.json",
  learningPathSchema,
  readJson("learning-paths.json"),
);

// --- Index translations and external links by node ---------------------------
const translationsByNode = new Map<string, typeof translations>();
for (const t of translations) {
  const list = translationsByNode.get(t.node_id) ?? [];
  list.push(t);
  translationsByNode.set(t.node_id, list);
}

const linksByNode = new Map<string, typeof externalLinks>();
for (const link of externalLinks) {
  const list = linksByNode.get(link.node_id) ?? [];
  list.push(link);
  linksByNode.set(link.node_id, list);
}

// --- Build UI-friendly nodes (topology never depends on label text) ----------
const exportedNodes = [...nodes]
  .sort((a, b) => byString(a.id, b.id))
  .map((node) => {
    const nodeTranslations = (translationsByNode.get(node.id) ?? [])
      .slice()
      .sort((a, b) => byString(a.locale, b.locale));

    const defaultTranslation = nodeTranslations.find((t) => t.locale === DEFAULT_LOCALE);
    if (!defaultTranslation) {
      // Never invent a label: the default display label must come from the
      // English translation. validate-data.ts enforces this too; we re-check
      // because the export depends on it directly.
      throw new Error(
        `[node-translations.json] node ${node.id} is missing a "${DEFAULT_LOCALE}" translation; ` +
          `cannot derive a default label`,
      );
    }

    const translationsByLocale: Record<string, { label: string; summary: string; aliases: string[] }> =
      {};
    for (const t of nodeTranslations) {
      translationsByLocale[t.locale] = {
        label: t.label,
        summary: t.summary,
        aliases: t.aliases,
      };
    }

    const exportedLinks = (linksByNode.get(node.id) ?? [])
      .slice()
      // Deterministic: by node_id (already grouped) then provider, then url.
      .sort((a, b) => byString(a.provider, b.provider) || byString(a.url, b.url))
      .map((link) => ({
        locale: link.locale,
        provider: link.provider,
        url: link.url,
        link_type: link.link_type,
        content_cached: link.content_cached,
      }));

    return {
      id: node.id,
      type: node.type,
      domain: node.domain ?? null,
      level: node.level,
      status: node.status,
      indexable: node.indexable,
      label: defaultTranslation.label,
      summary: defaultTranslation.summary,
      translations: translationsByLocale,
      external_links: exportedLinks,
    };
  });

// --- Build edges (sorted by id) ----------------------------------------------
const exportedEdges = [...edges]
  .sort((a, b) => byString(a.id, b.id))
  .map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    relation: edge.relation,
    confidence: edge.confidence,
    status: edge.status,
    evidence: edge.evidence,
    ...(edge.note !== undefined ? { note: edge.note } : {}),
  }));

// --- Sources & learning paths (sorted by id) ---------------------------------
const exportedSources = [...sources].sort((a, b) => byString(a.id, b.id));
const exportedLearningPaths = [...learningPaths].sort((a, b) => byString(a.id, b.id));

// --- Assemble payload --------------------------------------------------------
const payload = {
  version: PAYLOAD_VERSION,
  generated_at: new Date().toISOString(),
  default_locale: DEFAULT_LOCALE,
  nodes: exportedNodes,
  edges: exportedEdges,
  sources: exportedSources,
  learning_paths: exportedLearningPaths,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(
  `✓ Graph export written to dist/noosphere-graph.json: ${exportedNodes.length} nodes, ` +
    `${exportedEdges.length} edges, ${exportedSources.length} sources, ` +
    `${exportedLearningPaths.length} learning paths.`,
);
