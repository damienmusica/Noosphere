/**
 * Star-system seat reporting.
 *
 * A "seat" is a place where a star system may open. The universe holds the law,
 * the map, and the cross-domain cast; a star system is a domain entered at depth,
 * gathered rather than carved (vault draft `universe-architecture-design.md`,
 * decision (130) amending (129)). This module answers one question per seat:
 * **what is actually there** — not whether it is ready.
 *
 * ## ★ Why this file reports state and refuses to rank (2026-08-28 panel)
 *
 * The first design ranked seats by resident density. A 14-agent adversarial
 * panel killed all eight density dimensions it was given, and every refutation
 * converged on the same counterexample:
 *
 *   `field:literary-studies` — the map address of the ONLY star system that has
 *   actually opened — has ZERO residents in its part_of subtree. The two
 *   entities that touch it are `person:claude-levi-strauss` and
 *   `person:sigmund-freud`, arriving from outside on `influenced` edges. Neither
 *   is a literary figure.
 *
 * That is not a data defect. Decision (86) ruled literature OUTSIDE the main
 * corpus, so the corpus systematically pushes literature-qualifying population
 * out of that seat. The seat is empty BECAUSE it is a genuine star-system
 * candidate. Any density ranking therefore orders the candidates backwards.
 *
 * The panel also found no machine test that separates "this seat needs its own
 * gravity" from "nobody has worked this seat yet": `field:surgery` and
 * `field:music` are identical under every density axis (both zero) and only one
 * is a plausible next star system. So **no cell in this report may say "ready",
 * and rows are emitted in a fixed order, never sorted by any score.** Choosing
 * the next star system stays a human judgment; this report only refuses to let
 * that judgment run on invented numbers.
 *
 * ## The lies this shape exists to prevent
 *
 * - **0/0 is the greenest cell.** 381 of 417 field+subfield seats hold zero
 *   residents. A ratio with the usual guard (`total ? x / total : 0`) awards the
 *   empty seats a perfect score — decision (118)'s detector reporting "clean"
 *   where the data was thinnest, exactly. Ratios are therefore banned: counts
 *   are integers, and a seat below the resident floor renders `n/a`, never `0`.
 * - **Cataloguing masquerading as a world.** Of 119 entity-to-entity edges, 98
 *   are attachment (`canonical_work` 50, `founded_or_formalized` 39, `member_of`
 *   8, `formalizes` 1) and only 21 are peer. 38 of 44 works reach degree 1 by a
 *   single `canonical_work` edge to their author. Summed into one "density"
 *   number, listing three works per author triples it while creating no tie
 *   between residents. The two are counted in separate columns and never added.
 * - **A ledger keyed on the map deletes the only real star system.** Literature
 *   opened at decision (86)'s boundary ruling, and its repo address was
 *   deliberately left unwritten (a stop-set item). So addresses come from an
 *   explicit registry, and every registered shape is enumerated — the
 *   (116)/(111)/(119) lesson applied to openings instead of closures.
 * - **One-hop residency hides Einstein.** `person:albert-einstein` touches no
 *   field or subfield directly; `field:physics` is two hops away. Counting only
 *   direct attachment reports "physics has no Einstein" in green. Direct,
 *   indirect and unattached are three separate columns.
 *
 * ## Residency is a lens, not a fact (decision (130), the Pluto rule)
 *
 * Zero persons and zero works hold a `part_of` membership edge, and that is
 * RATIFIED DESIGN, not a gap awaiting a wave (CPO, 2026-08-28). The corpus
 * records events — founded, influenced, wrote — and "who belongs to this
 * domain" is always computed from those events, exactly as this module does
 * with its hop-based reach. Pluto did not change in 2006; a definition did,
 * and because membership was never stored as data, no recorded fact became
 * false. Do not "fix" residents by minting membership edges: a stored
 * membership is a lie waiting for the lens to move.
 *
 * This is a REPORT, not a validator: a thin seat is the current state of an
 * early corpus, not a failure. Its own coverage is measured rather than asserted
 * (`npm run report:starsystem-fixtures`), per the discipline decisions (114),
 * (118) and (119) each paid for.
 */

/**
 * Node shape this module needs. Mirrors /data, minus fields it must not read.
 *
 * `domain` is OPTIONAL because the schema makes it optional, even though every
 * one of the 650 nodes currently carries one. A resident with no domain belongs
 * to no seat, so keying on it silently drops that resident from every row and
 * from the totals — one more shape that would make a "0" a lie. Such nodes are
 * counted and reported instead (`SeatReport.unseated`).
 */
export type SeatNode = {
  id: string;
  type: string;
  status: string;
  domain?: string;
};

/** Edge shape this module needs. */
export type SeatEdge = {
  id: string;
  source: string;
  target: string;
  relation: string;
  status: string;
};

/** How a seat came to be a place a star system may open at. */
export type AddressShape = "map-node" | "boundary-ruling";

/**
 * A registered address.
 *
 * Lives in code, not in /data, and deliberately: decision (96) makes
 * `foundry:apply-batch` the sole write path into /data and forbids hand-editing,
 * while an address must sometimes name a vault decision number that /data has no
 * schema for. This registry is not corpus data — it is the map of where corpora
 * may open. (CTO ruling 2026-08-28, recorded in the draft §11.4-3; reversible.)
 */
export type SeatAddress = {
  /** Stable slug for the seat, independent of display text. */
  id: string;
  shape: AddressShape;
  /** A node ID for `map-node`, or a `(NNN)` vault decision number for `boundary-ruling`. */
  ref: string;
  /** Where the seat's own corpus lives, if it has opened. */
  corpusPath: string | null;
  /** Whether a star system has actually opened here. */
  opened: boolean;
};

export type SeatRow = {
  seat: string;
  addressShape: AddressShape | "unregistered";
  addressRef: string;
  /** False when `ref` names a node that does not exist, or an unparseable decision number. */
  refResolves: boolean;
  seatStatus: string;
  /** True when a ruling bars this seat from being revived rather than merely retiring it. */
  revivalBarred: boolean;
  opened: boolean;
  corpusPath: string | null;
  /**
   * Reviewed entities whose primary `domain` is this seat, or which attach into
   * its subtree. NOT readiness — read as map-claim / encroachment risk. See the
   * header: this number is anti-correlated with star-system candidacy.
   */
  residents: number;
  /** Residents reaching a structural node directly (1 hop). */
  residencyDirect: number;
  /** Residents reaching one only through another entity (2 hops). */
  residencyIndirect: number;
  /** Residents reaching no structural node at all. */
  residencyUnattached: number;
  /** Entity-to-entity ties that are NOT attachment. Integer. `null` below the floor. */
  peerTies: number | null;
  /** Entity-to-entity attachment ties (cataloguing). Never summed into peerTies. */
  attachmentTies: number | null;
  /** Distinct relation types among peerTies. */
  peerVocabulary: number | null;
  /** Why a numeric column is `null`, so an empty cell is never read as zero. */
  suppressed: string | null;
};

/**
 * Relations that attach a thing to its catalogue rather than tie two residents
 * together. Cheap to mint in bulk, so they must never share a channel with
 * evidenced peer relation — the same "one channel, one meaning" finding that
 * removed the R11-b MST lines from the literary sky.
 */
export const ATTACHMENT_RELATIONS = new Set([
  "canonical_work",
  "founded_or_formalized",
  "member_of",
  "formalizes",
]);

/** Node types that are map scaffold rather than inhabitants. */
export const SCAFFOLD_TYPES = new Set(["domain", "field", "subfield"]);

/**
 * Below this many residents, tie counts are suppressed to `n/a` instead of
 * rendered. A seat with two residents and one edge must not read as denser than
 * a seat with thirty-nine residents and two, and an empty seat must not read as
 * perfect. The floor is the whole defence against 0/0.
 */
export const RESIDENT_FLOOR = 3;

/** Vault decision reference, e.g. `(86)`. */
const DECISION_REF_RE = /^\(\d{1,4}\)$/;

const normaliseDomain = (id: string): string => id.replace(/^domain:/, "").replace(/-/g, "_");

export type SeatInput = {
  nodes: readonly SeatNode[];
  edges: readonly SeatEdge[];
  addresses: readonly SeatAddress[];
  /** Seat IDs a ruling bars from revival (e.g. docs/data-foundry.md §14). */
  revivalBarred?: ReadonlySet<string>;
};

export type SeatReport = {
  rows: SeatRow[];
  /** Reviewed entities carrying no `domain`, and so belonging to no row. */
  unseated: string[];
};

/**
 * Build one row per seat.
 *
 * Rows are returned in a FIXED order — registered addresses in registry order,
 * then generated map rows by ID — and callers must not re-sort them by any
 * measured column. Sorting is a soft ranking, and this report has established it
 * cannot rank honestly.
 */
export function buildSeatRows(input: SeatInput): SeatReport {
  const { nodes, edges, addresses } = input;
  const revivalBarred = input.revivalBarred ?? new Set<string>();

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const liveEdges = edges.filter((e) => e.status !== "deprecated");

  // Adjacency over live edges, used for both structural reach and tie counting.
  const adj = new Map<string, Set<string>>();
  for (const e of liveEdges) {
    if (!byId.has(e.source) || !byId.has(e.target)) continue;
    (adj.get(e.source) ?? adj.set(e.source, new Set()).get(e.source)!).add(e.target);
    (adj.get(e.target) ?? adj.set(e.target, new Set()).get(e.target)!).add(e.source);
  }

  const isScaffold = (id: string): boolean => SCAFFOLD_TYPES.has(byId.get(id)?.type ?? "");
  const isEntity = (id: string): boolean => {
    const n = byId.get(id);
    return n !== undefined && !SCAFFOLD_TYPES.has(n.type);
  };

  /**
   * Structural nodes an entity reaches, split by hop count. Two hops, not one:
   * Einstein reaches `field:physics` only through a concept, and a one-hop count
   * reports physics as having no Einstein while staying green.
   */
  function structuralReach(id: string): { direct: Set<string>; indirect: Set<string> } {
    const direct = new Set<string>();
    const indirect = new Set<string>();
    const firstHop = adj.get(id) ?? new Set<string>();
    for (const n of firstHop) {
      if (isScaffold(n)) direct.add(n);
    }
    if (direct.size === 0) {
      for (const n of firstHop) {
        if (isScaffold(n)) continue;
        for (const m of adj.get(n) ?? []) {
          if (m !== id && isScaffold(m)) indirect.add(m);
        }
      }
    }
    return { direct, indirect };
  }

  /** Domain a scaffold node belongs to, by its own declared `domain` field. */
  const seatKeyOfNode = (id: string): string | undefined => byId.get(id)?.domain;

  // Reviewed entities only. Unfiltered, a deprecated concept and a proposed
  // person are both counted as residents — measured on this corpus.
  const residentsOf = new Map<string, SeatNode[]>();
  const unseated: string[] = [];
  for (const n of nodes) {
    if (SCAFFOLD_TYPES.has(n.type)) continue;
    if (n.status !== "reviewed") continue;
    const key = n.domain;
    if (key === undefined) {
      unseated.push(n.id);
      continue;
    }
    (residentsOf.get(key) ?? residentsOf.set(key, []).get(key)!).push(n);
  }

  function tiesFor(residentIds: ReadonlySet<string>): {
    peer: number;
    attachment: number;
    vocabulary: number;
  } {
    let peer = 0;
    let attachment = 0;
    const vocab = new Set<string>();
    for (const e of liveEdges) {
      if (e.status !== "reviewed") continue;
      if (!isEntity(e.source) || !isEntity(e.target)) continue;
      if (!residentIds.has(e.source) || !residentIds.has(e.target)) continue;
      if (ATTACHMENT_RELATIONS.has(e.relation)) {
        attachment += 1;
      } else {
        peer += 1;
        vocab.add(e.relation);
      }
    }
    return { peer, attachment, vocabulary: vocab.size };
  }

  function rowFor(
    seat: string,
    shape: AddressShape | "unregistered",
    ref: string,
    refResolves: boolean,
    seatStatus: string,
    opened: boolean,
    corpusPath: string | null,
  ): SeatRow {
    const residents = residentsOf.get(seat) ?? [];
    const ids = new Set(residents.map((r) => r.id));

    let direct = 0;
    let indirect = 0;
    let unattached = 0;
    for (const r of residents) {
      const reach = structuralReach(r.id);
      if (reach.direct.size > 0) direct += 1;
      else if (reach.indirect.size > 0) indirect += 1;
      else unattached += 1;
    }

    const belowFloor = residents.length < RESIDENT_FLOOR;
    const ties = belowFloor ? null : tiesFor(ids);

    return {
      seat,
      addressShape: shape,
      addressRef: ref,
      refResolves,
      seatStatus,
      revivalBarred: revivalBarred.has(seat),
      opened,
      corpusPath,
      residents: residents.length,
      residencyDirect: direct,
      residencyIndirect: indirect,
      residencyUnattached: unattached,
      peerTies: ties?.peer ?? null,
      attachmentTies: ties?.attachment ?? null,
      peerVocabulary: ties?.vocabulary ?? null,
      suppressed: belowFloor ? `residents=${residents.length} < floor ${RESIDENT_FLOOR}` : null,
    };
  }

  const rows: SeatRow[] = [];
  const claimed = new Set<string>();

  // 1. Registered addresses first, in registry order. A boundary-ruling address
  //    has no node to look up, which is the whole reason the registry exists.
  for (const a of addresses) {
    const refResolves =
      a.shape === "map-node" ? byId.has(a.ref) : DECISION_REF_RE.test(a.ref);
    const seatKey =
      a.shape === "map-node" ? (seatKeyOfNode(a.ref) ?? a.id) : a.id;
    const status =
      a.shape === "map-node" ? (byId.get(a.ref)?.status ?? "unresolved") : "ruling";
    claimed.add(seatKey);
    rows.push(rowFor(a.id, a.shape, a.ref, refResolves, status, a.opened, a.corpusPath));
  }

  // 2. Every live map domain that no registry row claimed, so a seat can never
  //    be hidden by being left out of the registry.
  const mapSeats = nodes
    .filter((n) => n.type === "domain")
    .map((n) => n.id)
    .sort();
  for (const id of mapSeats) {
    const key = normaliseDomain(id);
    if (claimed.has(key)) continue;
    const node = byId.get(id)!;
    rows.push(rowFor(key, "unregistered", id, true, node.status, false, null));
  }

  return { rows, unseated: unseated.sort() };
}

/**
 * Places that exist on the map but hang off nothing, and places that hang off
 * more than one parent. Reported, never dropped: a ledger that enumerates seats
 * by walking down from the domains cannot see an orphan at all, and one that
 * assumes a single parent silently picks a side for the 31 cross-listed places.
 * Cross-listing is design (§13), not damage.
 */
export function mapAnomalies(nodes: readonly SeatNode[], edges: readonly SeatEdge[]): {
  orphans: string[];
  crossListed: { id: string; parents: string[] }[];
} {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const parents = new Map<string, string[]>();
  for (const e of edges) {
    if (e.relation !== "part_of" || e.status === "deprecated") continue;
    if (!byId.has(e.source) || !byId.has(e.target)) continue;
    (parents.get(e.source) ?? parents.set(e.source, []).get(e.source)!).push(e.target);
  }

  const orphans: string[] = [];
  const crossListed: { id: string; parents: string[] }[] = [];
  for (const n of nodes) {
    if (n.type !== "field" && n.type !== "subfield") continue;
    if (n.status === "deprecated") continue;
    const ps = parents.get(n.id) ?? [];
    if (ps.length === 0) orphans.push(n.id);
    else if (ps.length > 1) crossListed.push({ id: n.id, parents: [...ps].sort() });
  }
  return { orphans: orphans.sort(), crossListed: crossListed.sort((a, b) => (a.id < b.id ? -1 : 1)) };
}
