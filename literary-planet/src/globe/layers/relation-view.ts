// RelationLayer policy (6th review PR3): WHAT relations are drawn is a
// display decision owned here, not scattered renderer conditionals. The 6th
// review's largest product finding: real-geography mid zoom drew all 229 raw
// relations with nothing selected — a tangle, not information. Policy:
//
//   geo far,  no selection → 0 raw; ≤16 region-pair aggregate routes
//   geo mid,  no selection → 0 raw; ≤24 screen-cluster-pair aggregate routes
//   geo near, no selection → 0 raw (hover still surfaces a star's web)
//   selection (any mode)   → ego only, ≤20 by evidence level then weight,
//                            hidden count reported (never silently dropped)
//   "show all"             → the full ego set
//   semantic, no selection → the raw milky way stays (its layout spaces it)
//
// Aggregates are NAVIGATION, not new historical claims: the count of corpus
// relations between two groups, undirected, legend-registered as computed.

import type { Relation } from "../../types.ts";

export interface AggregateRoute {
  /** group keys (region ids at far, cluster rep ids at mid) */
  a: string;
  b: string;
  count: number;
  /** most frequent relation type on the route — its ink colors the line */
  dominantType: Relation["type"];
}

export interface RelationView {
  /** relations drawn as individual arcs (empty in aggregate modes) */
  raw: Relation[];
  /** ego relations hidden by the cap — 0 unless a selection overflows */
  hiddenCount: number;
  aggregates: AggregateRoute[];
  reason: "semantic-overview" | "geo-aggregate" | "geo-quiet" | "ego" | "ego-expanded";
}

const EGO_CAP = 20;
const FAR_ROUTE_CAP = 16;
const MID_ROUTE_CAP = 24;

const EVIDENCE_RANK: Record<string, number> = {
  documented: 0,
  scholarly_consensus: 1,
  editorial_inference: 2
};

/** ego ordering: the knowledge contract's ladder first, then weight */
export function orderEgo(rels: Relation[]): Relation[] {
  return [...rels].sort(
    (x, y) =>
      (EVIDENCE_RANK[x.evidenceLevel] ?? 9) - (EVIDENCE_RANK[y.evidenceLevel] ?? 9) ||
      y.weight - x.weight ||
      (x.id < y.id ? -1 : 1)
  );
}

function aggregate(
  rels: Relation[],
  groupOf: (authorId: string) => string | undefined,
  cap: number
): AggregateRoute[] {
  const byPair = new Map<string, { a: string; b: string; count: number; types: Map<string, number> }>();
  for (const r of rels) {
    const ga = groupOf(r.sourceId);
    const gb = groupOf(r.targetId);
    if (!ga || !gb || ga === gb) continue; // intra-group links draw no route
    const [a, b] = ga < gb ? [ga, gb] : [gb, ga];
    const key = `${a}|${b}`;
    let e = byPair.get(key);
    if (!e) byPair.set(key, (e = { a, b, count: 0, types: new Map() }));
    e.count++;
    e.types.set(r.type, (e.types.get(r.type) ?? 0) + 1);
  }
  return [...byPair.values()]
    .sort((x, y) => y.count - x.count || (x.a < y.a ? -1 : 1))
    .slice(0, cap)
    .map((e) => ({
      a: e.a,
      b: e.b,
      count: e.count,
      dominantType: [...e.types.entries()].sort(
        (x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1)
      )[0]![0] as Relation["type"]
    }));
}

export function resolveRelationView(opts: {
  mode: "semantic" | "geo";
  lod: "far" | "mid" | "near";
  selectedAuthorId: string | null;
  egoExpanded: boolean;
  visibleRelations: Relation[];
  /** far grouping: region id; mid grouping: screen-cluster rep id */
  regionOf: (authorId: string) => string | undefined;
  clusterGroupOf: (authorId: string) => string | undefined;
}): RelationView {
  const { selectedAuthorId: sel } = opts;
  if (sel) {
    const ego = opts.visibleRelations.filter((r) => r.sourceId === sel || r.targetId === sel);
    if (opts.egoExpanded || ego.length <= EGO_CAP) {
      return {
        raw: ego,
        hiddenCount: 0,
        aggregates: [],
        reason: opts.egoExpanded ? "ego-expanded" : "ego"
      };
    }
    return {
      raw: orderEgo(ego).slice(0, EGO_CAP),
      hiddenCount: ego.length - EGO_CAP,
      aggregates: [],
      reason: "ego"
    };
  }
  if (opts.mode === "semantic") {
    return { raw: opts.visibleRelations, hiddenCount: 0, aggregates: [], reason: "semantic-overview" };
  }
  if (opts.lod === "far") {
    return {
      raw: [],
      hiddenCount: 0,
      aggregates: aggregate(opts.visibleRelations, opts.regionOf, FAR_ROUTE_CAP),
      reason: "geo-aggregate"
    };
  }
  if (opts.lod === "mid") {
    return {
      raw: [],
      hiddenCount: 0,
      aggregates: aggregate(opts.visibleRelations, opts.clusterGroupOf, MID_ROUTE_CAP),
      reason: "geo-aggregate"
    };
  }
  return { raw: [], hiddenCount: 0, aggregates: [], reason: "geo-quiet" };
}

export { EGO_CAP, FAR_ROUTE_CAP, MID_ROUTE_CAP };
