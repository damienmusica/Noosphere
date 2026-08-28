/**
 * Golden fixtures for the star-system seat report.
 *
 * Purpose: FALSE-GREEN RESISTANCE. This report's failure mode is not a crash —
 * it is a reassuring number about a seat nobody taught it to read. The 2026-08-28
 * adversarial panel killed eight density dimensions, and every one of them died
 * on a shape the metric could not see: an empty seat scoring perfect, a
 * catalogue counted as a world, the only open star system scoring last, a
 * resident whose field is two hops away.
 *
 * So every rule in `scripts/lib/starsystem-readiness.ts` gets a case that FIRES
 * and, where the rule is a restriction, one that must STAY SILENT. Suppress the
 * resident floor, merge peer with attachment, drop the boundary-ruling shape,
 * count only one hop, or let a deprecated node be a resident, and a case fails
 * immediately. A fixture whose removal breaks nothing measures nothing
 * (decision (114)); each case names the single rule it holds.
 *
 * Offline and synthetic, with no /data dependency — the real corpus is a moving
 * target and cannot serve as its own regression suite.
 * Run: npm run report:starsystem-fixtures
 */
import {
  buildSeatRows,
  mapAnomalies,
  RESIDENT_FLOOR,
  type SeatAddress,
  type SeatEdge,
  type SeatNode,
} from "./lib/starsystem-readiness.ts";

const N = (id: string, type: string, domain?: string, status = "reviewed"): SeatNode => ({
  id,
  type,
  status,
  domain,
});

const E = (
  id: string,
  source: string,
  target: string,
  relation: string,
  status = "reviewed",
): SeatEdge => ({ id, source, target, relation, status });

const MAP = (domain: string): SeatNode[] => [N(`domain:${domain.replace(/_/g, "-")}`, "domain", domain)];

type Case = {
  name: string;
  /** The single rule this case exists to hold. */
  rule: string;
  nodes: SeatNode[];
  edges: SeatEdge[];
  addresses: SeatAddress[];
  revivalBarred?: Set<string>;
  check: (report: ReturnType<typeof buildSeatRows>) => string | null;
};

const seatOf = (report: ReturnType<typeof buildSeatRows>, id: string) =>
  report.rows.find((r) => r.seat === id);

const cases: Case[] = [
  {
    name: "an empty seat suppresses its tie columns instead of scoring them",
    rule: "RESIDENT_FLOOR — 0/0 must never render as a number",
    nodes: MAP("arts_and_design"),
    edges: [],
    addresses: [],
    check: (r) => {
      const s = seatOf(r, "arts_and_design");
      if (!s) return "no row for arts_and_design";
      if (s.peerTies !== null || s.attachmentTies !== null) {
        return `empty seat scored ties instead of suppressing: peer=${s.peerTies} attach=${s.attachmentTies}`;
      }
      return s.suppressed ? null : "suppression reason missing — an empty cell reads as zero";
    },
  },
  {
    name: `a seat just below the floor (${RESIDENT_FLOOR - 1}) suppresses; at the floor it reports`,
    rule: "RESIDENT_FLOOR — a 2-resident seat must not out-rank a populated one",
    nodes: [
      ...MAP("humanities"),
      N("person:a", "person", "humanities"),
      N("person:b", "person", "humanities"),
    ],
    edges: [E("edge:ab", "person:a", "person:b", "influenced")],
    addresses: [],
    check: (r) => {
      const s = seatOf(r, "humanities");
      if (!s) return "no row";
      return s.peerTies === null ? null : `below-floor seat reported peerTies=${s.peerTies}`;
    },
  },
  {
    name: "attachment edges are never counted as peer ties",
    rule: "ATTACHMENT_RELATIONS — cataloguing must not read as a world",
    nodes: [
      ...MAP("formal_sciences"),
      N("person:x", "person", "formal_sciences"),
      N("work:w1", "work", "formal_sciences"),
      N("work:w2", "work", "formal_sciences"),
    ],
    edges: [
      E("edge:x-w1", "person:x", "work:w1", "canonical_work"),
      E("edge:x-w2", "person:x", "work:w2", "canonical_work"),
    ],
    addresses: [],
    check: (r) => {
      const s = seatOf(r, "formal_sciences");
      if (!s) return "no row";
      if (s.peerTies !== 0) return `canonical_work leaked into peerTies (${s.peerTies})`;
      if (s.attachmentTies !== 2) return `attachmentTies wrong: ${s.attachmentTies}`;
      return s.peerVocabulary === 0 ? null : `vocabulary counted attachment (${s.peerVocabulary})`;
    },
  },
  {
    name: "a boundary-ruling address produces a row with no node to look up",
    rule: "AddressShape 'boundary-ruling' — the only open star system has no map cell",
    nodes: MAP("humanities"),
    edges: [],
    addresses: [
      { id: "literature", shape: "boundary-ruling", ref: "(86)", corpusPath: "lp/", opened: true },
    ],
    check: (r) => {
      const s = seatOf(r, "literature");
      if (!s) return "boundary-ruling address produced no row — the open star system vanished";
      if (!s.refResolves) return "a well-formed decision ref was reported unresolved";
      return s.opened ? null : "opened flag lost";
    },
  },
  {
    name: "a malformed address ref is loud, not silent",
    rule: "DECISION_REF_RE / node lookup — an unresolvable address must be visible",
    nodes: MAP("humanities"),
    edges: [],
    addresses: [
      { id: "ghost", shape: "map-node", ref: "field:does-not-exist", corpusPath: null, opened: false },
    ],
    check: (r) => {
      const s = seatOf(r, "ghost");
      if (!s) return "no row for an unresolvable address";
      return s.refResolves === false ? null : "unresolvable ref reported as resolving";
    },
  },
  {
    name: "a map place with no registry entry still gets a row",
    rule: "generated rows — the registry must not be able to hide a seat",
    nodes: [...MAP("life_sciences"), ...MAP("natural_sciences")],
    edges: [],
    addresses: [],
    check: (r) => {
      const missing = ["life_sciences", "natural_sciences"].filter((d) => !seatOf(r, d));
      if (missing.length) return `unregistered seats hidden: ${missing.join(", ")}`;
      const s = seatOf(r, "life_sciences")!;
      return s.addressShape === "unregistered" ? null : "unregistered seat mislabelled as addressed";
    },
  },
  {
    name: "revival-barred is reported separately from deprecated status",
    rule: "REVIVAL_BARRED — status alone excludes for the wrong reason",
    nodes: [N("domain:meta-knowledge", "domain", "meta_knowledge", "deprecated")],
    edges: [],
    addresses: [],
    revivalBarred: new Set(["meta_knowledge"]),
    check: (r) => {
      const s = seatOf(r, "meta_knowledge");
      if (!s) return "no row";
      if (s.seatStatus !== "deprecated") return `status lost: ${s.seatStatus}`;
      return s.revivalBarred ? null : "revival bar not reported — un-deprecating would readmit it";
    },
  },
  {
    name: "a resident whose field is two hops away counts as indirect, not unattached",
    rule: "structuralReach — one-hop counting reports 'physics has no Einstein' in green",
    nodes: [
      ...MAP("natural_sciences"),
      N("field:physics", "field", "natural_sciences"),
      N("concept:relativity", "concept", "natural_sciences"),
      N("person:einstein", "person", "natural_sciences"),
      N("person:hermit", "person", "natural_sciences"),
    ],
    edges: [
      E("edge:rel-phys", "concept:relativity", "field:physics", "part_of"),
      E("edge:ein-rel", "person:einstein", "concept:relativity", "founded_or_formalized"),
    ],
    addresses: [],
    check: (r) => {
      const s = seatOf(r, "natural_sciences");
      if (!s) return "no row";
      // relativity touches field:physics directly; einstein reaches it only
      // through relativity; hermit reaches nothing. All three must be distinct.
      const got = `direct=${s.residencyDirect} indirect=${s.residencyIndirect} unattached=${s.residencyUnattached}`;
      if (s.residencyDirect !== 1) return `expected relativity direct=1, got ${got}`;
      if (s.residencyIndirect !== 1) return `expected einstein indirect=1, got ${got}`;
      return s.residencyUnattached === 1 ? null : `expected hermit unattached=1, got ${got}`;
    },
  },
  {
    name: "deprecated and proposed nodes are not residents",
    rule: "status filter — an unfiltered count inflates every seat",
    nodes: [
      ...MAP("social_sciences"),
      N("concept:bureaucracy", "concept", "social_sciences", "deprecated"),
      N("person:atanasoff", "person", "social_sciences", "proposed"),
      N("person:weber", "person", "social_sciences"),
    ],
    edges: [],
    addresses: [],
    check: (r) => {
      const s = seatOf(r, "social_sciences");
      if (!s) return "no row";
      return s.residents === 1 ? null : `residents counted non-reviewed nodes: ${s.residents}`;
    },
  },
  {
    name: "a resident with no domain is reported, not dropped",
    rule: "SeatReport.unseated — a resident belonging to no seat is its own shape",
    nodes: [...MAP("humanities"), N("person:homeless", "person", undefined)],
    edges: [],
    addresses: [],
    check: (r) =>
      r.unseated.includes("person:homeless")
        ? null
        : "a domain-less resident vanished from every row and every total",
  },
  {
    name: "founded_or_formalized between two entities is attachment, not peer",
    rule: "ATTACHMENT_RELATIONS — every member of the set, not just canonical_work",
    nodes: [
      ...MAP("cognitive_sciences"),
      N("person:f", "person", "cognitive_sciences"),
      N("concept:c", "concept", "cognitive_sciences"),
      N("person:g", "person", "cognitive_sciences"),
      N("person:h", "person", "cognitive_sciences"),
    ],
    edges: [
      E("edge:f-c", "person:f", "concept:c", "founded_or_formalized"),
      E("edge:g-c", "person:g", "concept:c", "member_of"),
    ],
    addresses: [],
    check: (r) => {
      const s = seatOf(r, "cognitive_sciences");
      if (!s) return "no row";
      if (s.peerTies !== 0) return `founded_or_formalized/member_of leaked into peer (${s.peerTies})`;
      return s.attachmentTies === 2 ? null : `attachmentTies wrong: ${s.attachmentTies}`;
    },
  },
  {
    name: "a deprecated edge does not create structural reach",
    rule: "liveEdges feeds adjacency — a retired edge must not seat a resident",
    nodes: [
      ...MAP("life_sciences"),
      N("field:biology", "field", "life_sciences"),
      N("concept:cell", "concept", "life_sciences"),
      N("person:remak", "person", "life_sciences"),
    ],
    edges: [
      // The only path from remak to a structural node runs through a retired edge.
      E("edge:cell-bio", "concept:cell", "field:biology", "part_of", "deprecated"),
      E("edge:remak-cell", "person:remak", "concept:cell", "founded_or_formalized"),
    ],
    addresses: [],
    check: (r) => {
      const s = seatOf(r, "life_sciences");
      if (!s) return "no row";
      const got = `direct=${s.residencyDirect} indirect=${s.residencyIndirect} unattached=${s.residencyUnattached}`;
      if (s.residencyDirect !== 0) return `retired edge seated a resident directly: ${got}`;
      return s.residencyIndirect === 0 ? null : `retired edge seated a resident indirectly: ${got}`;
    },
  },
  {
    name: "deprecated edges do not create ties",
    rule: "tiesFor status filter — a retired edge must not populate a seat",
    nodes: [
      ...MAP("humanities"),
      N("person:p1", "person", "humanities"),
      N("person:p2", "person", "humanities"),
      N("person:p3", "person", "humanities"),
    ],
    edges: [E("edge:dead", "person:p1", "person:p2", "influenced", "deprecated")],
    addresses: [],
    check: (r) => {
      const s = seatOf(r, "humanities");
      if (!s) return "no row";
      return s.peerTies === 0 ? null : `deprecated edge counted: peerTies=${s.peerTies}`;
    },
  },
];

// --- map-shape cases ---------------------------------------------------------
const mapCases: { name: string; rule: string; run: () => string | null }[] = [
  {
    name: "an orphan place is reported rather than dropped",
    rule: "mapAnomalies.orphans — a top-down walk cannot see a place with no parent",
    run: () => {
      const { orphans } = mapAnomalies(
        [N("domain:humanities", "domain", "humanities"), N("subfield:lonely", "subfield", "humanities")],
        [],
      );
      return orphans.includes("subfield:lonely") ? null : "orphan place not reported";
    },
  },
  {
    name: "a place whose only parent edge is deprecated is an orphan, not attached",
    rule: "mapAnomalies edge filter — a retired part_of must not rebuild the tree",
    run: () => {
      const { orphans, crossListed } = mapAnomalies(
        [
          N("domain:humanities", "domain", "humanities"),
          N("field:philosophy", "field", "humanities"),
          N("subfield:ethics", "subfield", "humanities"),
        ],
        [E("e1", "subfield:ethics", "field:philosophy", "part_of", "deprecated")],
      );
      if (!orphans.includes("subfield:ethics")) {
        return "a place held only by a retired edge was reported as attached";
      }
      return crossListed.length === 0 ? null : "retired edge produced a cross-listing";
    },
  },
  {
    name: "a place with two parents is reported as cross-listed, not silently assigned",
    rule: "mapAnomalies.crossListed — cross-listing is design (§13), and picking a side hides it",
    run: () => {
      const { crossListed } = mapAnomalies(
        [
          N("domain:arts-and-design", "domain", "arts_and_design"),
          N("domain:engineering-and-technology", "domain", "engineering_and_technology"),
          N("field:architecture", "field", "arts_and_design"),
        ],
        [
          E("e1", "field:architecture", "domain:arts-and-design", "part_of"),
          E("e2", "field:architecture", "domain:engineering-and-technology", "part_of"),
        ],
      );
      const hit = crossListed.find((c) => c.id === "field:architecture");
      if (!hit) return "cross-listed place not reported";
      return hit.parents.length === 2 ? null : `parents collapsed: ${hit.parents.join(",")}`;
    },
  },
];

let failed = 0;
for (const c of cases) {
  const report = buildSeatRows({
    nodes: c.nodes,
    edges: c.edges,
    addresses: c.addresses,
    revivalBarred: c.revivalBarred,
  });
  const problem = c.check(report);
  if (problem) {
    failed += 1;
    console.log(`✗ ${c.name}\n    rule: ${c.rule}\n    ${problem}`);
  } else {
    console.log(`✓ ${c.name}`);
  }
}
for (const c of mapCases) {
  const problem = c.run();
  if (problem) {
    failed += 1;
    console.log(`✗ ${c.name}\n    rule: ${c.rule}\n    ${problem}`);
  } else {
    console.log(`✓ ${c.name}`);
  }
}

const total = cases.length + mapCases.length;
console.log(`\nstarsystem fixtures: ${total - failed}/${total} passing`);
if (failed > 0) process.exit(1);
