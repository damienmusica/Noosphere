/**
 * Graph summary report for Noosphere.
 *
 * Reads the repository-managed JSON files in /data, validates them against the
 * same Zod schemas in /src/schema, and prints a concise, deterministic overview
 * of the current graph: totals, breakdowns (nodes/edges/sources/links/
 * translations/paths), and simple connectivity signals (isolated nodes, top
 * nodes by degree, edges by relation).
 *
 * This is an *observational* report, not a validation gate. It does NOT
 * duplicate scripts/validate-data.ts — full cross-file integrity and policy
 * checks (referential integrity, license/evidence, NamuWiki external-only rule,
 * indexability, circular prerequisites, ...) remain the source of truth for
 * pass/fail there. This script exits non-zero only for an actual data/contract
 * problem it cannot read past (missing/malformed file, schema-invalid data), not
 * for ordinary low coverage in this early MVP stage.
 *
 * It fetches nothing, writes nothing, and never depends on a committed
 * dist/noosphere-graph.json. Run with: npm run report:graph
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
import { findStaleGaps } from "./lib/stale-gaps.ts";
import { buildSeatRows, mapAnomalies } from "./lib/starsystem-readiness.ts";
import { STAR_SYSTEM_ADDRESSES, REVIVAL_BARRED } from "./lib/starsystem-addresses.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

/** How many top-degree nodes to list under connectivity. */
const TOP_DEGREE_LIMIT = 10;
/** Cap on how many isolated node IDs to print verbatim before summarizing. */
const ISOLATED_LIST_LIMIT = 20;

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

// --- Load & schema-validate every file (fail fast on real data problems) -----
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

// --- Small tally helpers -----------------------------------------------------
type Tally = Map<string, number>;

/** Count occurrences of each key produced by `keyOf`. */
function tallyBy<T>(items: readonly T[], keyOf: (item: T) => string): Tally {
  const tally: Tally = new Map();
  for (const item of items) {
    const key = keyOf(item);
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  return tally;
}

/** Count a boolean field, always reporting both `true` and `false` rows. */
function tallyBool<T>(items: readonly T[], valueOf: (item: T) => boolean): Tally {
  const tally: Tally = new Map([
    ["true", 0],
    ["false", 0],
  ]);
  for (const item of items) {
    const key = valueOf(item) ? "true" : "false";
    tally.set(key, (tally.get(key) ?? 0) + 1);
  }
  return tally;
}

const lines: string[] = [];
const out = (line = "") => lines.push(line);

/**
 * Render a tally as bullet lines. By default rows are ordered by descending
 * count then ascending key (deterministic). Pass `order` to force a fixed key
 * order instead (e.g. confidence buckets).
 */
function section(title: string, tally: Tally, order?: readonly string[]): void {
  out(title);
  const entries = order
    ? order.map((key): [string, number] => [key, tally.get(key) ?? 0])
    : [...tally.entries()].sort((a, b) => b[1] - a[1] || byString(a[0], b[0]));
  if (entries.length === 0) {
    out("- (none)");
  } else {
    for (const [key, count] of entries) out(`- ${key}: ${count}`);
  }
  out();
}

// --- 1. Totals ---------------------------------------------------------------
out("Noosphere graph report");
out("======================");
out();
out("Totals");
out(`- Nodes: ${nodes.length}`);
out(`- Edges: ${edges.length}`);
out(`- Sources: ${sources.length}`);
out(`- External links: ${externalLinks.length}`);
out(`- Learning paths: ${learningPaths.length}`);
out(`- Translations: ${translations.length}`);
out();

// --- 2. Nodes ----------------------------------------------------------------
section("Nodes by type", tallyBy(nodes, (n) => n.type));
section("Nodes by status", tallyBy(nodes, (n) => n.status));
section("Nodes by indexable", tallyBool(nodes, (n) => n.indexable));
section("Nodes by living-person", tallyBool(nodes, (n) => n.is_living_person));

// --- 3. Edges ----------------------------------------------------------------
const CONFIDENCE_BUCKETS = ["0.00-0.49", "0.50-0.79", "0.80-1.00"] as const;
const confidenceBucket = (confidence: number): string =>
  confidence < 0.5 ? CONFIDENCE_BUCKETS[0] : confidence < 0.8 ? CONFIDENCE_BUCKETS[1] : CONFIDENCE_BUCKETS[2];

section("Edges by relation", tallyBy(edges, (e) => e.relation));
section("Edges by status", tallyBy(edges, (e) => e.status));
section("Edges by confidence bucket", tallyBy(edges, (e) => confidenceBucket(e.confidence)), CONFIDENCE_BUCKETS);

// --- 4. Sources --------------------------------------------------------------
section("Sources by source_type", tallyBy(sources, (s) => s.source_type));
section("Sources by license", tallyBy(sources, (s) => s.license));
section("Sources by commercial_use", tallyBool(sources, (s) => s.commercial_use));
section("Sources by attribution_required", tallyBool(sources, (s) => s.attribution_required));
section("Sources by share_alike_required", tallyBool(sources, (s) => s.share_alike_required));

// --- 5. External links -------------------------------------------------------
section("External links by provider", tallyBy(externalLinks, (l) => l.provider));
section("External links by content_cached", tallyBool(externalLinks, (l) => l.content_cached));

// --- 6. Translations ---------------------------------------------------------
section("Translations by locale", tallyBy(translations, (t) => t.locale));
section("Translations by reviewed", tallyBool(translations, (t) => t.reviewed));

// --- 7. Learning paths -------------------------------------------------------
section("Learning paths by status", tallyBy(learningPaths, (p) => p.status));
section("Learning paths by indexable", tallyBool(learningPaths, (p) => p.indexable));

// --- 8. Connectivity ---------------------------------------------------------
// Degree is computed over stable IDs only; topology never depends on label text.
// Edges referencing unknown nodes are a validation concern (validate:data), not a
// report failure, so we simply skip endpoints that are not in the node set.
const nodeIds = new Set(nodes.map((n) => n.id));
const inDegree = new Map<string, number>();
const outDegree = new Map<string, number>();
for (const id of nodeIds) {
  inDegree.set(id, 0);
  outDegree.set(id, 0);
}
for (const edge of edges) {
  if (nodeIds.has(edge.source)) outDegree.set(edge.source, (outDegree.get(edge.source) ?? 0) + 1);
  if (nodeIds.has(edge.target)) inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
}

const degreeOf = (id: string): number => (inDegree.get(id) ?? 0) + (outDegree.get(id) ?? 0);

const isolated = [...nodeIds].filter((id) => degreeOf(id) === 0).sort(byString);

const ranked = [...nodeIds]
  .sort((a, b) => degreeOf(b) - degreeOf(a) || byString(a, b))
  .slice(0, TOP_DEGREE_LIMIT);

out("Connectivity");
out(`- Isolated nodes (no incoming or outgoing edges): ${isolated.length}`);
if (isolated.length > 0) {
  for (const id of isolated.slice(0, ISOLATED_LIST_LIMIT)) out(`  - ${id}`);
  if (isolated.length > ISOLATED_LIST_LIMIT) {
    out(`  - ... and ${isolated.length - ISOLATED_LIST_LIMIT} more`);
  }
}
out(`- Top nodes by degree (limit ${TOP_DEGREE_LIMIT}):`);
if (ranked.length === 0) {
  out("  - (none)");
} else {
  for (const id of ranked) {
    out(`  - ${id} — degree ${degreeOf(id)} (in ${inDegree.get(id) ?? 0}, out ${outDegree.get(id) ?? 0})`);
  }
}
out();

out("Edge count by relation");
const edgesByRelation = tallyBy(edges, (e) => e.relation);
const relationEntries = [...edgesByRelation.entries()].sort(
  (a, b) => b[1] - a[1] || byString(a[0], b[0]),
);
if (relationEntries.length === 0) {
  out("- (none)");
} else {
  for (const [relation, count] of relationEntries) out(`- ${relation}: ${count}`);
}
out();

// --- 9. Editorial gap ----------------------------------------------------------
// Structure lands faster than public-facing prose, so the summary gap grows by
// design — the dashboard makes it a TRACKED, BOUNDED number instead of a silent
// one (ops-efficiency package, 2026-07-02). The priority list is degree-ordered:
// the gap that readers actually hit closes first. Editorial batches should be
// drawn from the top of this list.
const EDITORIAL_PRIORITY_LIMIT = 20;
const enTranslationByNode = new Map(
  translations.filter((t) => t.locale === "en").map((t) => [t.node_id, t]),
);
const reviewedNodes = nodes.filter((n) => n.status === "reviewed");
const summaryGap = reviewedNodes.filter((n) => {
  const t = enTranslationByNode.get(n.id);
  return !t || t.summary.trim() === "";
});
const unreviewedSummaries = reviewedNodes.filter((n) => {
  const t = enTranslationByNode.get(n.id);
  return t !== undefined && t.summary.trim() !== "" && !t.reviewed;
});

out("Editorial gap (summary coverage)");
out(`- Reviewed nodes: ${reviewedNodes.length}`);
out(
  `- Reviewed nodes without an en summary: ${summaryGap.length} ` +
    `(${reviewedNodes.length > 0 ? Math.round((summaryGap.length / reviewedNodes.length) * 100) : 0}% gap)`,
);
out(`- Reviewed nodes with a summary awaiting editorial review: ${unreviewedSummaries.length}`);
const gapRanked = summaryGap
  .map((n) => n.id)
  .sort((a, b) => degreeOf(b) - degreeOf(a) || byString(a, b))
  .slice(0, EDITORIAL_PRIORITY_LIMIT);
out(`- Editorial priority (degree-ordered, limit ${EDITORIAL_PRIORITY_LIMIT}):`);
if (gapRanked.length === 0) {
  out("  - (none — gap closed)");
} else {
  for (const id of gapRanked) out(`  - ${id} — degree ${degreeOf(id)}`);
}

// --- 10. Stale recorded gaps ----------------------------------------------------
// An edge note that records something missing is load-bearing: it is how the
// next wave's slate gets built, so a later reader trusts it. When the missing
// thing arrives, the sentence silently becomes false in the same commit.
// Detection lives in scripts/lib/stale-gaps.ts, which enumerates the ways a
// recorded gap can actually close — a node arriving, and a ruling being made —
// after the first version of this section watched only the first and reported
// "none" while the corpus held live instances of both (decisions (118), (119)).
// A report, not a validator: the label lane is heuristic and a false positive
// must not fail CI. Its own coverage is measured by npm run report:gap-fixtures.
const labelToNode = new Map<string, string>();
for (const [nodeId, tr] of enTranslationByNode) {
  const label = (tr as { label?: string }).label;
  if (label && label.trim().length > 3) labelToNode.set(label.trim(), nodeId);
}
const staleGaps = findStaleGaps({
  edges: edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    relation: e.relation,
    note: e.note,
  })),
  nodeIds: new Set(nodes.map((n) => n.id)),
  labelToNode,
});
out("");
out("Stale recorded gaps (a note records something as missing that the corpus now has)");
if (staleGaps.length === 0) {
  out("  - none");
} else {
  for (const g of staleGaps) {
    const what =
      g.kind === "node-absent"
        ? `names "${g.subject}" as missing, but ${g.nodeId} exists`
        : g.kind === "founder-edge-absent"
          ? `says "${g.subject}" has no founder edge, but ${g.closedBy} exists`
          : `says the ruling on "${g.subject}" is still owed, but ${g.closedBy} exists`;
    out(`  - ${g.edgeId} — ${what}  [${g.kind}/${g.lane}: "${g.phrase}"]`);
  }
  out(`  ${staleGaps.length} stale gap note(s) — refresh via a set_note metadata flip.`);
}

// --- 11. Star-system seats -------------------------------------------------------
// Where a star system may open, and what is actually at each place. Deliberately
// NOT a ranking: a 2026-08-28 adversarial panel killed every density metric it
// was given on one counterexample — `field:literary-studies`, the map address of
// the only star system that ever opened, holds zero residents, because decision
// (86) rules literature outside this corpus. Density therefore orders candidates
// backwards, and no machine test was found that separates "needs its own
// gravity" from "nobody has worked this seat yet". Rows print in a fixed order.
// Logic and rationale live in scripts/lib/starsystem-readiness.ts; its own
// coverage is measured by npm run report:starsystem-fixtures.
const seatReport = buildSeatRows({
  nodes: nodes.map((n) => ({ id: n.id, type: n.type, status: n.status, domain: n.domain })),
  edges: edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    relation: e.relation,
    status: e.status,
  })),
  addresses: STAR_SYSTEM_ADDRESSES,
  revivalBarred: REVIVAL_BARRED,
});

out("");
out("Star-system seats (state, not readiness — this report does not rank)");
out(`- Registered addresses: ${STAR_SYSTEM_ADDRESSES.length} | rows: ${seatReport.rows.length}`);
for (const r of seatReport.rows) {
  const flags = [
    r.opened ? "OPEN" : null,
    r.addressShape === "unregistered" ? "unregistered" : r.addressShape,
    r.refResolves ? null : `REF UNRESOLVED (${r.addressRef})`,
    r.seatStatus === "reviewed" || r.seatStatus === "ruling" ? null : r.seatStatus,
    r.revivalBarred ? "revival-barred" : null,
  ].filter(Boolean);
  out(`  - ${r.seat} [${flags.join(" · ")}]`);
  if (r.corpusPath) {
    // A seat whose corpus lives elsewhere has no /data population BY
    // CONSTRUCTION. Printing that as `residents 0` next to the other rows reads
    // as "empty" when it means "not here" — the exact conflation that let
    // decision (119)'s repair write a falsehood. State it, never score it.
    out(`      population lives in ${r.corpusPath} — not read by this report (sibling corpus)`);
    out(`      residents in /data: ${r.residents} (n/a by construction, not a measure of this seat)`);
  } else {
    out(
      `      residents ${r.residents} (direct ${r.residencyDirect} · via-entity ${r.residencyIndirect} · unattached ${r.residencyUnattached})`,
    );
  }
  if (r.corpusPath) {
    out("      ties n/a — sibling corpus");
  } else if (r.suppressed) {
    out(`      ties n/a — ${r.suppressed}`);
  } else {
    out(
      `      peer ties ${r.peerTies} (${r.peerVocabulary} relation type(s)) · attachment ties ${r.attachmentTies} — never summed`,
    );
  }
}
out("  Note: `residents` is map-claim, NOT candidacy — it is anti-correlated with it.");
out(
  `- Residents belonging to no seat (no domain, so counted in no row above): ${seatReport.unseated.length}`,
);
for (const id of seatReport.unseated.slice(0, 10)) out(`  - ${id}`);

const anomalies = mapAnomalies(
  nodes.map((n) => ({ id: n.id, type: n.type, status: n.status, domain: n.domain })),
  edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    relation: e.relation,
    status: e.status,
  })),
);
out("");
out("Map shape (the map is a DAG, not a tree — enumerate places, never walk down)");
out(`- Orphan places (no part_of parent; invisible to a top-down walk): ${anomalies.orphans.length}`);
for (const id of anomalies.orphans) out(`  - ${id}`);
// Recipe matters and must be printed with the number: counting DIRECT parents
// gives 37, while counting places that resolve UP to more than one domain gives
// 31. Both are correct under their own definition, and a bare count invites the
// definition collision the 2026-08-28 panel hit three times inside itself.
out(
  `- Cross-listed places [recipe: >1 direct part_of parent] (design, per §13): ${anomalies.crossListed.length}`,
);
for (const c of anomalies.crossListed.slice(0, 5)) {
  out(`  - ${c.id} → ${c.parents.join(" ∥ ")}`);
}
if (anomalies.crossListed.length > 5) {
  out(`  - ... and ${anomalies.crossListed.length - 5} more`);
}

console.log(lines.join("\n"));
