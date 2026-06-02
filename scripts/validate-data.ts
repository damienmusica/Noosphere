/**
 * Data validation for Noosphere.
 *
 * Validates every file in /data against the Zod schemas in /src/schema, then runs
 * cross-file integrity and policy checks (referential integrity, license/evidence,
 * NamuWiki external-only rule, indexability, circular prerequisites, ...).
 *
 * Exits non-zero if any check fails. Run with: npm run validate:data
 */
import { readFileSync } from "node:fs";
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

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

const errors: string[] = [];
const fail = (msg: string) => errors.push(msg);

function readJson(file: string): unknown {
  const path = join(DATA_DIR, file);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    fail(`[${file}] could not read/parse JSON: ${(err as Error).message}`);
    return undefined;
  }
}

/** Parse `data` as an array of `schema`, recording errors under the file name. */
function parseArray<S extends z.ZodTypeAny>(
  file: string,
  schema: S,
  data: unknown,
): z.infer<S>[] {
  if (data === undefined) return [];
  const result = z.array(schema).safeParse(data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      fail(`[${file}] ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
    return [];
  }
  return result.data;
}

/** Report duplicate ids in a collection. */
function checkDuplicates(file: string, ids: string[], label = "id"): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) fail(`[${file}] duplicate ${label}: ${id}`);
    seen.add(id);
  }
}

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

const nodeIds = new Set(nodes.map((n) => n.id));
const sourceIds = new Set(sources.map((s) => s.id));
const nodesById = new Map(nodes.map((n) => [n.id, n]));

// Sources that represent NamuWiki. NamuWiki is external-links-only and must never
// be cited as primary evidence (hard constraint). Identify by id or URL host.
const namuWikiSourceIds = new Set<string>();
for (const s of sources) {
  let host = "";
  if (s.url) {
    try {
      host = new URL(s.url).host.toLowerCase();
    } catch {
      // invalid source URL is reported by schema validation; ignore here
    }
  }
  if (s.id === "source:namuwiki" || host === "namu.wiki" || host.endsWith(".namu.wiki")) {
    namuWikiSourceIds.add(s.id);
  }
}

// --- Duplicate IDs -----------------------------------------------------------
checkDuplicates("nodes.json", nodes.map((n) => n.id));
checkDuplicates("edges.json", edges.map((e) => e.id));
checkDuplicates("sources.json", sources.map((s) => s.id));

// --- Nodes: indexability + living-person rules -------------------------------
for (const node of nodes) {
  if (node.indexable && node.status !== "reviewed") {
    fail(`[nodes.json] node ${node.id} is indexable but status is "${node.status}" (only reviewed nodes may be indexable)`);
  }
  if (node.is_living_person) {
    // Living people require stricter evidence metadata and conservative status.
    if (Object.keys(node.external_ids).length === 0) {
      fail(`[nodes.json] living-person node ${node.id} must have at least one external identifier`);
    }
    if (node.status === "draft" || node.status === "generated") {
      fail(`[nodes.json] living-person node ${node.id} must not have status "${node.status}" (needs human review)`);
    }
  }
}

// --- Translations: references, duplicates, default-locale coverage -----------
const translationKeys = translations.map((t) => `${t.node_id}@${t.locale}`);
checkDuplicates("node-translations.json", translationKeys, "node_id+locale");
for (const t of translations) {
  if (!nodeIds.has(t.node_id)) {
    fail(`[node-translations.json] translation references unknown node: ${t.node_id}`);
  }
}
const localizedDefault = new Set(
  translations.filter((t) => t.locale === DEFAULT_LOCALE).map((t) => t.node_id),
);
for (const node of nodes) {
  if (!localizedDefault.has(node.id)) {
    fail(`[node-translations.json] node ${node.id} is missing a "${DEFAULT_LOCALE}" translation`);
  }
}

// --- Edges: referential integrity + evidence ---------------------------------
for (const edge of edges) {
  if (!nodeIds.has(edge.source)) {
    fail(`[edges.json] edge ${edge.id} source references unknown node: ${edge.source}`);
  }
  if (!nodeIds.has(edge.target)) {
    fail(`[edges.json] edge ${edge.id} target references unknown node: ${edge.target}`);
  }
  for (const ev of edge.evidence) {
    if (!sourceIds.has(ev)) {
      fail(`[edges.json] edge ${edge.id} evidence references unknown source: ${ev}`);
    }
    if (namuWikiSourceIds.has(ev)) {
      fail(`[edges.json] edge ${edge.id} cites NamuWiki source "${ev}" as evidence (NamuWiki is external-links-only and must never be primary evidence)`);
    }
  }
  // Edges touching a living person require stricter (reviewed/proposed) status.
  const touchesLivingPerson =
    nodesById.get(edge.source)?.is_living_person || nodesById.get(edge.target)?.is_living_person;
  if (touchesLivingPerson && (edge.status === "draft" || edge.status === "generated")) {
    fail(`[edges.json] edge ${edge.id} involves a living person but has status "${edge.status}" (needs human review)`);
  }
}

// --- Circular prerequisite detection -----------------------------------------
{
  const adj = new Map<string, string[]>();
  for (const edge of edges) {
    if (edge.relation !== "prerequisite_for") continue;
    const list = adj.get(edge.source) ?? [];
    list.push(edge.target);
    adj.set(edge.source, list);
  }
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map<string, number>();
  const visit = (n: string, stack: string[]): void => {
    color.set(n, GRAY);
    for (const next of adj.get(n) ?? []) {
      const c = color.get(next) ?? WHITE;
      if (c === GRAY) {
        fail(`[edges.json] circular prerequisite chain detected: ${[...stack, n, next].join(" -> ")}`);
      } else if (c === WHITE) {
        visit(next, [...stack, n]);
      }
    }
    color.set(n, BLACK);
  };
  for (const n of adj.keys()) {
    if ((color.get(n) ?? WHITE) === WHITE) visit(n, []);
  }
}

// --- External links: references, scheme, NamuWiki rule -----------------------
const ALLOWED_SCHEMES = new Set(["http:", "https:"]);
for (const link of externalLinks) {
  if (!nodeIds.has(link.node_id)) {
    fail(`[external-links.json] link references unknown node: ${link.node_id}`);
  }
  let scheme: string | undefined;
  let host = "";
  try {
    const parsed = new URL(link.url);
    scheme = parsed.protocol;
    host = parsed.host.toLowerCase();
  } catch {
    fail(`[external-links.json] invalid URL for node ${link.node_id}: ${link.url}`);
  }
  if (scheme && !ALLOWED_SCHEMES.has(scheme)) {
    fail(`[external-links.json] disallowed URL scheme "${scheme}" for node ${link.node_id} (only http/https allowed)`);
  }
  // NamuWiki is external-links-only and must never cache content. Detect it by
  // provider OR URL host, so a mistyped/generic provider cannot bypass the rule.
  const isNamuWiki = link.provider === "namuwiki" || host === "namu.wiki" || host.endsWith(".namu.wiki");
  if (isNamuWiki && link.content_cached) {
    fail(`[external-links.json] NamuWiki link for node ${link.node_id} has content_cached=true (NamuWiki must be external-only)`);
  }
}

// --- Learning paths: references, indexability --------------------------------
checkDuplicates("learning-paths.json", learningPaths.map((p) => p.id));
for (const path of learningPaths) {
  for (const nodeId of path.node_sequence) {
    if (!nodeIds.has(nodeId)) {
      fail(`[learning-paths.json] path ${path.id} references unknown node: ${nodeId}`);
    }
  }
  for (const ev of path.evidence) {
    if (namuWikiSourceIds.has(ev)) {
      fail(`[learning-paths.json] path ${path.id} cites NamuWiki source "${ev}" as evidence (NamuWiki is external-links-only and must never be primary evidence)`);
    }
    if (!sourceIds.has(ev)) {
      fail(`[learning-paths.json] path ${path.id} evidence references unknown source: ${ev}`);
    }
  }
  if (path.indexable && path.status !== "reviewed") {
    fail(`[learning-paths.json] path ${path.id} is indexable but status is "${path.status}" (only reviewed paths may be indexable)`);
  }
}

// --- Report ------------------------------------------------------------------
if (errors.length > 0) {
  console.error(`\n✗ Data validation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}

console.log(
  `✓ Data validation passed: ${nodes.length} nodes, ${translations.length} translations, ` +
    `${edges.length} edges, ${sources.length} sources, ${externalLinks.length} external links, ` +
    `${learningPaths.length} learning paths.`,
);
