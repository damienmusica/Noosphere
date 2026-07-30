/**
 * Stale recorded-gap detection.
 *
 * An edge note that records something missing from the corpus is load-bearing:
 * the next wave's slate is built from those sentences, so a reader trusts them.
 * When the missing thing arrives, the sentence silently becomes false — in the
 * same commit, invisibly. Decision (118) built the first detector for this and
 * measured seven stale notes, two of which had been falsified hours earlier by
 * another batch in the same session.
 *
 * ★ Why this file exists (decision (119)). That first detector watched exactly
 * ONE way a gap can close: the named node coming into existence, phrased as
 * "not a corpus node". Three more closure shapes were live in the corpus the
 * day it reported "none":
 *
 *   1. the same node-absence claim written as `person:x does not exist` or
 *      `no person:x node exists` — a pure vocabulary hole,
 *   2. an *adjudication* gap ("whether he earns his own founder edge here has
 *      not been adjudicated") closing when that edge is admitted,
 *   3. and worst, (118)'s own repair WROTE shape 2 into two reviewed notes on
 *      2026-07-30 — the edge it called unadjudicated had been `reviewed` since
 *      2026-07-01, and the next session's work order copied the false sentence
 *      into its slate.
 *
 * That is decision (116) recurring in a third ledger: **a record must account
 * for every way the thing it tracks can actually end.** (116) taught it about
 * anchor terminal states, (111) about held-ledger exits; this is the gap
 * ledger's turn. The lesson is not "add a regex" — it is that a mechanism
 * built to watch one closure shape reports a reassuring "none" about all the
 * others, so the closure vocabulary is itself the thing to enumerate.
 *
 * ## Two lanes, deliberately unequal
 *
 * **explicit-id lane (deterministic).** The gap sentence names a real node ID
 * (`type:slug`). Nothing is guessed: the ID either exists in /data or it does
 * not. Because it is exact, this lane may use broad English phrasings like
 * "does not exist" that would be hopeless on their own.
 *
 * **label lane (heuristic).** The gap sentence names a person in prose. The
 * label is matched against en translations and attributed by looking BACKWARD
 * from the gap phrase to the nearest known label — never forward from the
 * label, because a note may name the same person in a quotation before naming
 * them in its gap sentence, and a forward scan silently misses the gap. That
 * exact bug made (118)'s first version report a clean corpus while six notes
 * were stale. This lane is restricted to the unambiguous corpus-node
 * phrasings: `does not exist` is ordinary English and appears in this corpus
 * about dead SEP slugs, hallucinated article titles and wrong taxonomy paths,
 * so it is trustworthy only when a machine-checkable ID sits next to it.
 *
 * ## Suppression
 *
 * Two conventions already record a closure inside the note itself: a trailing
 * `[Note refreshed ...]` stamp (text after it quotes what was replaced, so it
 * is not a live claim) and an inline `|| RE-TARGET EXECUTED ...` clause that
 * preserves the original sentence and appends its resolution. Both are honest
 * bookkeeping and must not be reported. Only same-subject resolutions count —
 * a note that resolves the node-existence half of its gap does not thereby
 * resolve an adjudication claim in the same sentence, which is precisely how
 * (118)'s repair left a false clause behind.
 *
 * This is a REPORT, not a validator. The label lane is a heuristic and a false
 * positive must not fail CI. Its logic is covered by offline golden fixtures
 * (`npm run report:gap-fixtures`) so that the detector's own coverage is
 * measured rather than asserted — the discipline decisions (114) and (118)
 * both paid for.
 */

/** Node ID grammar, mirroring `^[a-z]+:[a-z0-9]+(?:-[a-z0-9]+)*$` from AGENTS.md. */
const NODE_ID_RE =
  /\b(?:domain|field|subfield|concept|person|work|method|tool|institution):[a-z0-9]+(?:-[a-z0-9]+)*\b/g;

/**
 * Ways this corpus says a node is missing. The first group is unambiguous
 * enough for prose-label attribution; the second is ordinary English and is
 * accepted only beside an explicit node ID.
 */
const NODE_ABSENT_UNAMBIGUOUS =
  /not (?:yet )?a corpus node|are not corpus nodes|not yet a node|not yet nodes|has no corpus node|no corpus node|is absent from the corpus|(?:not|neither) nodified|no node yet|has no node|not a node|candidate (?:for a )?future[^.;]{0,40}node/gi;
const NODE_ABSENT_BROAD =
  /does not (?:yet )?exist|do not (?:yet )?exist|node exists|no corpus endpoint/gi;

/**
 * Ways this corpus says an edge or a ruling is still owed. These close when
 * the edge arrives, not when the node does — the shape (118)'s repair wrote
 * and its detector could not see.
 */
const EDGE_UNADJUDICATED =
  /has not been adjudicated|one edge short|is left for a later wave|left for a later wave/gi;

/**
 * A claim that a node carries no founder edge *at all*. Unlike the two families
 * above this is about a relation type on one node, not about a parallel leg, so
 * it closes the moment any `founded_or_formalized` edge points at that node.
 */
const FOUNDER_EDGE_ABSENT = /no founder edge|without a founder edge/gi;

/** Marks the tail of a note as historical rather than a live claim. */
const REFRESH_STAMP = "[Note refreshed";
/** Inline "the gap above has since been closed" bookkeeping. */
const INLINE_RESOLUTION =
  /now exists|RE-TARGET EXECUTED|which this edge closes|has since been (?:promoted|admitted|added)|is (?:now )?a corpus node/i;

/**
 * How far back to look for the subject of a gap phrase — measured against the
 * real corpus, not guessed. An absence claim names its subject adjacently
 * ("`person:x` does not exist", "no `person:x` node exists": distance ~1), so a
 * wide window there only lets an unrelated ID elsewhere in the note pose as the
 * subject; that produced a live false positive on the Fracastoro note, where
 * the real subject is a prose name with no node at all and the nearest ID sat
 * 196 characters back. An adjudication clause instead refers to a subject
 * introduced one clause earlier ("(`person:duncan-black`); whether he earns his
 * own founder edge … has not been adjudicated": distance ~65), so it needs the
 * room.
 */
const ABSENCE_LOOKBEHIND = 40;
const ADJUDICATION_LOOKBEHIND = 200;
const LABEL_LOOKBEHIND = 120;
/** How far after a gap phrase an inline resolution may sit and still count. */
const RESOLUTION_LOOKAHEAD = 320;

export type StaleGapKind = "node-absent" | "edge-unadjudicated" | "founder-edge-absent";
export type StaleGapLane = "explicit-id" | "label";

export interface StaleGap {
  edgeId: string;
  kind: StaleGapKind;
  lane: StaleGapLane;
  /** The gap phrasing as it appears in the note. */
  phrase: string;
  /** What the sentence named — a node ID, or an en label for the label lane. */
  subject: string;
  nodeId: string;
  /** The node or edge whose existence falsifies the sentence. */
  closedBy: string;
}

export interface StaleGapEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  note?: string | null;
}

export interface StaleGapInput {
  edges: readonly StaleGapEdge[];
  nodeIds: ReadonlySet<string>;
  /** en label → node ID, for prose-name attribution in the label lane. */
  labelToNode: ReadonlyMap<string, string>;
}

/** Live prose only: everything from a refresh stamp on quotes what it replaced. */
function livePart(note: string): string {
  const at = note.indexOf(REFRESH_STAMP);
  return at === -1 ? note : note.slice(0, at);
}

/** Is the gap at `at` already answered later in the same note, for this subject? */
function resolvedInline(live: string, at: number, subject: string): boolean {
  const after = live.slice(at, at + RESOLUTION_LOOKAHEAD);
  if (!INLINE_RESOLUTION.test(after)) return false;
  return after.includes(subject);
}

/** The nearest explicit node ID within `window` characters before `at`. */
function idBefore(live: string, at: number, window: number): string | undefined {
  const prefix = live.slice(Math.max(0, at - window), at);
  const found = prefix.match(NODE_ID_RE);
  return found ? found[found.length - 1] : undefined;
}

/** The nearest known en label before `at`; longest label wins so a full name beats a surname. */
function labelBefore(
  live: string,
  at: number,
  labelToNode: ReadonlyMap<string, string>,
): { label: string; nodeId: string } | undefined {
  const prefix = live.slice(Math.max(0, at - LABEL_LOOKBEHIND), at);
  let best: { label: string; nodeId: string } | undefined;
  for (const [label, nodeId] of labelToNode) {
    if (!prefix.includes(label)) continue;
    if (!best || label.length > best.label.length) best = { label, nodeId };
  }
  return best;
}

export function findStaleGaps(input: StaleGapInput): StaleGap[] {
  const { edges, nodeIds, labelToNode } = input;

  // Unordered endpoint pairs that already carry an edge, for the adjudication lane.
  const pairs = new Map<string, string>();
  // Nodes that now carry an inbound founder edge, for the founder-edge lane.
  const founded = new Map<string, string>();
  for (const e of edges) {
    pairs.set(`${e.source}|${e.target}`, e.id);
    if (e.relation === "founded_or_formalized") founded.set(e.target, e.id);
  }

  const out: StaleGap[] = [];
  const seen = new Set<string>();
  const push = (g: StaleGap) => {
    const key = `${g.edgeId}|${g.nodeId}|${g.kind}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(g);
  };

  for (const e of edges) {
    if (!e.note) continue;
    const live = livePart(e.note);

    // --- node-absent, explicit-id lane (deterministic) -----------------------
    for (const re of [NODE_ABSENT_UNAMBIGUOUS, NODE_ABSENT_BROAD]) {
      re.lastIndex = 0;
      for (const m of live.matchAll(re)) {
        const at = m.index ?? 0;
        const id = idBefore(live, at, ABSENCE_LOOKBEHIND);
        if (!id || !nodeIds.has(id)) continue;
        if (resolvedInline(live, at, id)) continue;
        push({
          edgeId: e.id,
          kind: "node-absent",
          lane: "explicit-id",
          phrase: m[0],
          subject: id,
          nodeId: id,
          closedBy: id,
        });
      }
    }

    // --- node-absent, label lane (heuristic, unambiguous phrasings only) -----
    NODE_ABSENT_UNAMBIGUOUS.lastIndex = 0;
    for (const m of live.matchAll(NODE_ABSENT_UNAMBIGUOUS)) {
      const at = m.index ?? 0;
      const best = labelBefore(live, at, labelToNode);
      if (!best || !nodeIds.has(best.nodeId)) continue;
      if (resolvedInline(live, at, best.label)) continue;
      push({
        edgeId: e.id,
        kind: "node-absent",
        lane: "label",
        phrase: m[0],
        subject: best.label,
        nodeId: best.nodeId,
        closedBy: best.nodeId,
      });
    }

    // --- edge-unadjudicated (deterministic: does that edge exist now?) -------
    EDGE_UNADJUDICATED.lastIndex = 0;
    for (const m of live.matchAll(EDGE_UNADJUDICATED)) {
      const at = m.index ?? 0;
      const id = idBefore(live, at, ADJUDICATION_LOOKBEHIND);
      if (!id) continue;
      // No node-existence gate here, deliberately: this lane only fires when a
      // real edge is found below, and in valid /data every edge endpoint is a
      // reviewed node (validate:data rejects dangling endpoints). A gate that
      // can only fire on data the validator forbids is untestable weight.
      // The owed edge is the PARALLEL LEG of this one: same subject-matter
      // endpoint, different person. Which endpoint that is depends on the
      // relation's direction — a founder note owes `other → this.target`
      // ("his own founder edge on this field"), while a canonical_work note
      // owes `this.source → other` ("the co-author leg of this same work").
      // Checking only the target missed the second shape, which is exactly the
      // one the Principia notes carry.
      const closedBy =
        pairs.get(`${id}|${e.target}`) ??
        pairs.get(`${e.target}|${id}`) ??
        pairs.get(`${e.source}|${id}`) ??
        pairs.get(`${id}|${e.source}`);
      if (!closedBy || closedBy === e.id) continue;
      if (resolvedInline(live, at, id)) continue;
      push({
        edgeId: e.id,
        kind: "edge-unadjudicated",
        lane: "explicit-id",
        phrase: m[0],
        subject: id,
        nodeId: id,
        closedBy,
      });
    }

    // --- founder-edge-absent (deterministic: any founder edge on that node?) --
    FOUNDER_EDGE_ABSENT.lastIndex = 0;
    for (const m of live.matchAll(FOUNDER_EDGE_ABSENT)) {
      const at = m.index ?? 0;
      const id = idBefore(live, at, ADJUDICATION_LOOKBEHIND);
      if (!id) continue;
      const closedBy = founded.get(id);
      if (!closedBy || closedBy === e.id) continue;
      if (resolvedInline(live, at, id)) continue;
      push({
        edgeId: e.id,
        kind: "founder-edge-absent",
        lane: "explicit-id",
        phrase: m[0],
        subject: id,
        nodeId: id,
        closedBy,
      });
    }
  }

  return out.sort(
    (a, b) => a.edgeId.localeCompare(b.edgeId) || a.nodeId.localeCompare(b.nodeId),
  );
}
