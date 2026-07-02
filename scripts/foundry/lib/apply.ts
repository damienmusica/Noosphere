/**
 * Post-state construction for a promotion decision file: applies adds,
 * promotions, and translation updates to the current /data collections in
 * memory, collecting structural preflight errors as it goes.
 *
 * Shared by ladder-check (read-only) and apply-batch (writes). Mutations are
 * performed on RAW parsed JSON objects — never on zod outputs of the current
 * /data files — so optional-field defaults are never silently injected into
 * untouched items; only genuinely new items come from the (defaulted) decision
 * schema, where explicit fields are desirable.
 */
import { z } from "zod";

import type { FoundryDecision, RejectionEntry } from "../../../src/schema/foundry-decision.ts";
import { nodeSchema, type Node } from "../../../src/schema/node.ts";
import { edgeSchema, type Edge } from "../../../src/schema/edge.ts";

type RawItem = Record<string, unknown>;

export type CurrentData = {
  nodes: RawItem[];
  edges: RawItem[];
  sources: RawItem[];
  translations: RawItem[];
  externalLinks: RawItem[];
};

export type PostState = {
  /** Mutated copies of the raw collections, ready for canonical write. */
  raw: CurrentData;
  /** Typed views of the post-apply graph, for ladder arithmetic. */
  nodesById: Map<string, Node>;
  edgesById: Map<string, Edge>;
  errors: string[];
};

export function buildPostState(decision: FoundryDecision, current: CurrentData): PostState {
  const errors: string[] = [];
  const fail = (msg: string) => errors.push(msg);

  // Work on shallow copies of the collections; promoted items are replaced
  // (not mutated) so `current` stays untouched.
  const raw: CurrentData = {
    nodes: [...current.nodes],
    edges: [...current.edges],
    sources: [...current.sources],
    translations: [...current.translations],
    externalLinks: [...current.externalLinks],
  };

  const nodeIndex = new Map(raw.nodes.map((n, i) => [String(n.id), i]));
  const edgeIndex = new Map(raw.edges.map((e, i) => [String(e.id), i]));
  const sourceIds = new Set(raw.sources.map((s) => String(s.id)));
  const translationIndex = new Map(
    raw.translations.map((t, i) => [`${t.node_id}@${t.locale}`, i]),
  );

  // --- Adds: IDs must be new ---------------------------------------------------
  for (const s of decision.adds.sources) {
    if (sourceIds.has(s.id)) fail(`adds.sources: source ${s.id} already exists`);
    else {
      sourceIds.add(s.id);
      raw.sources.push(s as unknown as RawItem);
    }
  }
  for (const n of decision.adds.nodes) {
    if (nodeIndex.has(n.id)) fail(`adds.nodes: node ${n.id} already exists`);
    else {
      nodeIndex.set(n.id, raw.nodes.length);
      raw.nodes.push(n as unknown as RawItem);
    }
  }
  for (const t of decision.adds.translations) {
    const key = `${t.node_id}@${t.locale}`;
    if (translationIndex.has(key)) {
      fail(`adds.translations: translation ${key} already exists (use translation_updates)`);
    } else {
      translationIndex.set(key, raw.translations.length);
      raw.translations.push(t as unknown as RawItem);
    }
  }
  for (const e of decision.adds.edges) {
    if (edgeIndex.has(e.id)) fail(`adds.edges: edge ${e.id} already exists`);
    else {
      edgeIndex.set(e.id, raw.edges.length);
      raw.edges.push(e as unknown as RawItem);
    }
  }
  const linkKey = (l: RawItem) => `${l.node_id}@${l.locale}@${l.provider}@${l.url}`;
  const linkKeys = new Set(raw.externalLinks.map(linkKey));
  for (const l of decision.adds.external_links) {
    const key = linkKey(l as unknown as RawItem);
    if (linkKeys.has(key)) fail(`adds.external_links: duplicate link ${key}`);
    else {
      linkKeys.add(key);
      raw.externalLinks.push(l as unknown as RawItem);
    }
  }

  // --- New nodes must arrive with their default-locale translation -------------
  for (const n of decision.adds.nodes) {
    if (!translationIndex.has(`${n.id}@en`)) {
      fail(`adds.nodes: node ${n.id} has no "en" translation in this decision`);
    }
  }

  // --- Promotions: status flips on existing items -------------------------------
  for (const p of decision.promotions) {
    const index = p.kind === "node" ? nodeIndex.get(p.id) : edgeIndex.get(p.id);
    const collection = p.kind === "node" ? raw.nodes : raw.edges;
    if (index === undefined) {
      fail(`promotions: ${p.kind} ${p.id} not found`);
      continue;
    }
    const item = { ...collection[index] } as RawItem;
    if (item.status !== p.from) {
      fail(`promotions: ${p.kind} ${p.id} has status "${item.status}", expected "${p.from}"`);
      continue;
    }
    item.status = p.to;
    if (p.kind === "node") {
      if (p.set_external_ids) {
        const existing = { ...(item.external_ids as Record<string, string> | undefined) };
        for (const [provider, value] of Object.entries(p.set_external_ids)) {
          if (existing[provider] && existing[provider] !== value) {
            fail(
              `promotions: node ${p.id} external_ids.${provider} is already "${existing[provider]}" — ` +
                `overwriting with "${value}" would silently change identity (deprecate + re-add instead)`,
            );
          }
          existing[provider] = value;
        }
        item.external_ids = existing;
      }
      if (p.set_indexable !== undefined) item.indexable = p.set_indexable;
      item.updated_at = decision.decided_at;
    } else if (p.set_external_ids || p.set_indexable !== undefined) {
      fail(`promotions: edge ${p.id} cannot take set_external_ids/set_indexable`);
    }
    collection[index] = item;
  }

  // --- Translation updates (editorial): upsert summary on existing keys ---------
  for (const tu of decision.translation_updates) {
    const key = `${tu.node_id}@${tu.locale}`;
    const index = translationIndex.get(key);
    if (index === undefined) {
      fail(`translation_updates: translation ${key} not found (new translations go in adds)`);
      continue;
    }
    raw.translations[index] = {
      ...raw.translations[index],
      summary: tu.summary,
      reviewed: tu.reviewed,
    };
  }

  // --- Referential integrity of new edges ---------------------------------------
  for (const e of decision.adds.edges) {
    for (const endpoint of [e.source, e.target]) {
      if (!nodeIndex.has(endpoint)) fail(`adds.edges: edge ${e.id} references unknown node ${endpoint}`);
    }
    for (const ev of e.evidence) {
      if (!sourceIds.has(ev)) fail(`adds.edges: edge ${e.id} cites unknown source ${ev}`);
    }
  }

  // --- Provider-ID uniqueness across the post state ------------------------------
  {
    const seen = new Map<string, string>();
    for (const n of raw.nodes) {
      for (const [provider, value] of Object.entries(
        (n.external_ids as Record<string, string> | undefined) ?? {},
      )) {
        const key = `${provider}:${value}`;
        const prev = seen.get(key);
        if (prev && prev !== String(n.id)) {
          fail(`post-state: nodes ${prev} and ${n.id} share external ID ${key} (one referent, one node)`);
        }
        seen.set(key, String(n.id));
      }
    }
  }

  // --- Typed views for ladder arithmetic -----------------------------------------
  let nodesById = new Map<string, Node>();
  let edgesById = new Map<string, Edge>();
  if (errors.length === 0) {
    const nodesParse = z.array(nodeSchema).safeParse(raw.nodes);
    const edgesParse = z.array(edgeSchema).safeParse(raw.edges);
    if (!nodesParse.success) {
      for (const issue of nodesParse.error.issues.slice(0, 10)) {
        fail(`post-state nodes: ${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      nodesById = new Map(nodesParse.data.map((n) => [n.id, n]));
    }
    if (!edgesParse.success) {
      for (const issue of edgesParse.error.issues.slice(0, 10)) {
        fail(`post-state edges: ${issue.path.join(".")}: ${issue.message}`);
      }
    } else {
      edgesById = new Map(edgesParse.data.map((e) => [e.id, e]));
    }
  }

  return { raw, nodesById, edgesById, errors };
}

/**
 * Cross-check a decision against the rejection ledger: re-admitting a
 * previously rejected candidate must be explicit (`override_rejections`),
 * never silent — the other half of the silent-recall-loss fix.
 */
export function checkAgainstRejections(
  decision: FoundryDecision,
  ledger: RejectionEntry[],
): string[] {
  const problems: string[] = [];
  const overrides = new Set(decision.override_rejections.map((l) => l.toLowerCase().trim()));
  const rejectedLabels = new Map(
    ledger.map((r) => [r.label.toLowerCase().trim(), r] as const),
  );

  const candidates: { id: string; label: string }[] = [];
  for (const t of decision.adds.translations) {
    if (t.locale === "en") candidates.push({ id: t.node_id, label: t.label });
  }
  for (const e of decision.adds.edges) candidates.push({ id: e.id, label: e.id });

  for (const { id, label } of candidates) {
    const hit = rejectedLabels.get(label.toLowerCase().trim());
    if (hit && !overrides.has(label.toLowerCase().trim())) {
      problems.push(
        `${id} matches rejection-ledger entry "${hit.label}" (${hit.batch_id}: ${hit.reason}) — ` +
          `add it to override_rejections with a reason if re-admission is intended`,
      );
    }
  }
  return problems;
}
