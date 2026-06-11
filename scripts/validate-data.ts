/**
 * Data validation for Noosphere.
 *
 * Validates every file in /data against the Zod schemas in /src/schema, then runs
 * cross-file integrity and policy checks (referential integrity, license/evidence,
 * NamuWiki external-only rule, indexability, circular prerequisites, ...), plus
 * offline repo-hygiene checks (foundry/proposals batch index, local .md links).
 *
 * Exits non-zero if any check fails. Run with: npm run validate:data
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
// be cited as primary evidence (hard constraint). Identify by id, name, or URL host
// so a renamed/relocated entry cannot bypass the rule. Use `hostname` (not `host`)
// so an explicit port like `namu.wiki:8443` cannot dodge the domain checks.
const namuWikiSourceIds = new Set<string>();
for (const s of sources) {
  let host = "";
  if (s.url) {
    try {
      host = new URL(s.url).hostname.toLowerCase();
    } catch {
      // invalid source URL is reported by schema validation; ignore here
    }
  }
  const looksLikeNamuWiki =
    /namu[-\s]?wiki/i.test(s.id) ||
    /namu[-\s]?wiki/i.test(s.name) ||
    host === "namu.wiki" ||
    host.endsWith(".namu.wiki");
  if (looksLikeNamuWiki) {
    namuWikiSourceIds.add(s.id);
    // NamuWiki may appear only as an external-link destination. Registering it as a
    // source implies it could be cited as evidence, which the policy forbids outright.
    fail(`[sources.json] NamuWiki must not be registered as a source ("${s.id}"): it is external-links-only and may never be used as evidence`);
  }
}

// --- Duplicate IDs -----------------------------------------------------------
checkDuplicates("nodes.json", nodes.map((n) => n.id));
checkDuplicates("edges.json", edges.map((e) => e.id));
checkDuplicates("sources.json", sources.map((s) => s.id));

// Computed/interpreted metric keys are forbidden inside external_metrics: only
// raw provider-API facts may be recorded (OpenAlex field design, vault decision
// log 2026-06-11 (18)). This denylist catches label/score-shaped names; it is a
// guard against interpretation creep, not an exhaustive semantic check.
const COMPUTED_METRIC_KEY = /(score|rank|rating|label|percentile|normali[sz]ed|weighted|index|vitality|tier|grade)/i;

// --- Nodes: indexability + living-person rules -------------------------------
for (const node of nodes) {
  if (node.indexable && node.status !== "reviewed") {
    fail(`[nodes.json] node ${node.id} is indexable but status is "${node.status}" (only reviewed nodes may be indexable)`);
  }
  // --- external_metrics structural checks (design clauses (1)-(3)) -----------
  for (const [provider, block] of Object.entries(node.external_metrics ?? {})) {
    // Companion fields: every provider block must be re-queryable/re-auditable.
    if (!block.as_of) {
      fail(`[nodes.json] node ${node.id} external_metrics.${provider} is missing "as_of" (every metrics block needs its lookup date)`);
    }
    if (!block.entity) {
      fail(`[nodes.json] node ${node.id} external_metrics.${provider} is missing "entity" (every metrics block needs the provider's canonical entity URL)`);
    }
    // The matched entity ID must be recorded (and verified) in external_ids
    // first — metrics are read only by that ID (two-stage matching, clause 4).
    if (!node.external_ids[provider]) {
      fail(`[nodes.json] node ${node.id} has external_metrics.${provider} but no external_ids["${provider}"] (verified entity ID must come first)`);
    }
    for (const key of Object.keys(block)) {
      if (key === "as_of" || key === "entity") continue;
      if (COMPUTED_METRIC_KEY.test(key)) {
        fail(`[nodes.json] node ${node.id} external_metrics.${provider} has computed/interpreted key "${key}" (raw provider facts only — labels/scores are forbidden)`);
      }
    }
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
const defaultTranslationByNode = new Map(
  translations.filter((t) => t.locale === DEFAULT_LOCALE).map((t) => [t.node_id, t]),
);
for (const node of nodes) {
  const defaultTranslation = defaultTranslationByNode.get(node.id);
  if (!defaultTranslation) {
    fail(`[node-translations.json] node ${node.id} is missing a "${DEFAULT_LOCALE}" translation`);
  } else if (node.indexable && !defaultTranslation.reviewed) {
    // Indexability is earned by reviewed, original content (see seo-policy.md). An
    // indexable page must not ship an unreviewed default-locale label/summary.
    fail(`[node-translations.json] node ${node.id} is indexable but its "${DEFAULT_LOCALE}" translation is not reviewed`);
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

  // --- Edge promotion policy v1 (vault decision log 2026-06-10 (15)) ---------
  // Status cap (clause 3): an edge may never outrank its endpoint nodes.
  if (edge.status === "reviewed") {
    for (const endpointId of [edge.source, edge.target]) {
      const endpoint = nodesById.get(endpointId);
      if (endpoint && endpoint.status !== "reviewed") {
        fail(`[edges.json] edge ${edge.id} is reviewed but endpoint ${endpointId} has status "${endpoint.status}" (edge status must not exceed its endpoints)`);
      }
    }
  }
  // Conservative ladder (clauses 2/5): editorial evidence cannot back a reviewed
  // edge — the editorial reviewed ladder opens only after measured precision.
  if (edge.status === "reviewed" && edge.evidence_kind === "editorial") {
    fail(`[edges.json] edge ${edge.id} is reviewed but evidence_kind is "editorial" (editorial edges stop at proposed under edge promotion policy v1)`);
  }
  // Disputed-position honesty (clause 6): taking the dominant side of a
  // real-world contest requires recording the minority position.
  if (edge.disputed && !edge.note?.trim()) {
    fail(`[edges.json] edge ${edge.id} is disputed but has no note recording the minority position`);
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
    // `hostname` excludes any explicit port so `namu.wiki:8443` still classifies.
    host = parsed.hostname.toLowerCase();
  } catch {
    fail(`[external-links.json] invalid URL for node ${link.node_id}: ${link.url}`);
  }
  if (scheme && !ALLOWED_SCHEMES.has(scheme)) {
    fail(`[external-links.json] disallowed URL scheme "${scheme}" for node ${link.node_id} (only http/https allowed)`);
  }
  // NamuWiki is external-links-only and must never cache content. Detect it by
  // provider OR URL host, so a mistyped/generic provider cannot bypass the rule.
  const hostIsNamuWiki = host === "namu.wiki" || host.endsWith(".namu.wiki");
  const isNamuWiki = link.provider === "namuwiki" || hostIsNamuWiki;
  if (isNamuWiki && link.content_cached) {
    fail(`[external-links.json] NamuWiki link for node ${link.node_id} has content_cached=true (NamuWiki must be external-only)`);
  }
  // A namu.wiki URL must be labeled with provider "namuwiki" so provider-based
  // policy (here and downstream) classifies it honestly and cannot be sidestepped.
  if (hostIsNamuWiki && link.provider !== "namuwiki") {
    fail(`[external-links.json] link for node ${link.node_id} points to namu.wiki but provider is "${link.provider}" (must be "namuwiki")`);
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

// --- Repo hygiene: foundry/proposals batch index ------------------------------
// Every committed proposal batch directory must have its one-line row in
// foundry/proposals/README.md, and every indexed batch must still exist on disk
// (hygiene device ②, vault decision log 2026-06-11 (29)). The index is the human
// entry point to the permanent records; artifact/index drift is the measured
// decay mode this check exists for. Offline by design — CI stays network-free.
const REPO_ROOT = join(__dirname, "..");
{
  const proposalsDir = join(REPO_ROOT, "foundry", "proposals");
  const indexFile = "foundry/proposals/README.md";
  let indexText = "";
  try {
    indexText = readFileSync(join(proposalsDir, "README.md"), "utf8");
  } catch (err) {
    fail(`[${indexFile}] could not read the batch index: ${(err as Error).message}`);
  }
  let batchDirs: string[] = [];
  try {
    batchDirs = readdirSync(proposalsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch (err) {
    fail(`[foundry/proposals] could not list batch directories: ${(err as Error).message}`);
  }
  // An index row is a table line whose first cell is the backticked batch dir:
  // "| `<batch-dir>` | ...". Other backticked mentions in prose do not count.
  const indexed = new Set<string>();
  for (const line of indexText.split("\n")) {
    const row = /^\|\s*`([^`]+)`\s*\|/.exec(line);
    if (row?.[1]) indexed.add(row[1]);
  }
  for (const dir of batchDirs) {
    if (!indexed.has(dir)) {
      fail(`[${indexFile}] batch directory "${dir}" has no index row (every committed batch needs its one-line entry)`);
    }
  }
  for (const name of indexed) {
    if (!batchDirs.includes(name)) {
      fail(`[${indexFile}] index row references missing batch directory "${name}" (stale index entry)`);
    }
  }
}

// --- Repo hygiene: local .md links must resolve --------------------------------
// Relative links to .md files in committed markdown must point at files that
// exist (the PR #60 dead-link sweep, automated). URLs and #anchors are out of
// scope — this guards against file moves/renames, not content drift.
{
  const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".claude"]);
  const mdFiles: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name));
      } else if (entry.name.endsWith(".md")) {
        mdFiles.push(join(dir, entry.name));
      }
    }
  };
  walk(REPO_ROOT);
  const MD_LINK = /\]\(([^()\s]+\.md)(?:#[^)]*)?\)/g;
  for (const file of mdFiles) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(MD_LINK)) {
      const target = match[1];
      if (!target) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue; // http:, mailto:, ... — not local
      const resolved = target.startsWith("/")
        ? join(REPO_ROOT, target)
        : join(dirname(file), target);
      if (!existsSync(resolved)) {
        fail(`[${file.slice(REPO_ROOT.length + 1)}] dead local link: ${target}`);
      }
    }
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
