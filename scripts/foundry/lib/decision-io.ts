/**
 * Shared IO for promotion decision files, /data collections, and the
 * held/rejection ledgers under foundry/.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

import { DATA_DIR, REPO_ROOT, readDataFile } from "../../lib/canonical-data.ts";
import {
  foundryDecisionSchema,
  heldEntrySchema,
  rejectionEntrySchema,
  type FoundryDecision,
  type HeldEntry,
  type RejectionEntry,
} from "../../../src/schema/foundry-decision.ts";
import type { CurrentData } from "./apply.ts";

export { DATA_DIR, REPO_ROOT };

export const DECISIONS_DIR = join(REPO_ROOT, "foundry", "decisions");
export const REJECTIONS_LEDGER = join(REPO_ROOT, "foundry", "rejections.json");
export const HELD_LEDGER = join(REPO_ROOT, "foundry", "held.json");

export function die(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

export function loadDecision(path: string): FoundryDecision {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    die(`could not read/parse decision file ${path}: ${(err as Error).message}`);
  }
  const result = foundryDecisionSchema.safeParse(raw);
  if (!result.success) {
    console.error(`✗ decision file ${path} is invalid:`);
    for (const issue of result.error.issues.slice(0, 20)) {
      console.error(`  - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
    }
    process.exit(1);
  }
  return result.data;
}

export function loadCurrentData(): CurrentData {
  return {
    nodes: readDataFile("nodes.json"),
    edges: readDataFile("edges.json"),
    sources: readDataFile("sources.json"),
    translations: readDataFile("node-translations.json"),
    externalLinks: readDataFile("external-links.json"),
  };
}

function loadLedger<S extends z.ZodTypeAny>(path: string, schema: S): z.infer<S>[] {
  if (!existsSync(path)) return [];
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    die(`could not read/parse ledger ${path}: ${(err as Error).message}`);
  }
  const result = z.array(schema).safeParse(raw);
  if (!result.success) die(`ledger ${path} is invalid: ${result.error.issues[0]?.message}`);
  return result.data;
}

export function loadRejections(): RejectionEntry[] {
  return loadLedger(REJECTIONS_LEDGER, rejectionEntrySchema);
}

export function loadHeld(): HeldEntry[] {
  return loadLedger(HELD_LEDGER, heldEntrySchema);
}

/** Ledgers stay in chronological append order (recorded_at), 2-space indent. */
export function writeLedger(path: string, entries: unknown[]): void {
  writeFileSync(path, JSON.stringify(entries, null, 2) + "\n");
}

/** The identity fields under which a ledger entry counts as already recorded. */
type LedgerIdentity = { id?: string; label?: string; batch_id: string; recorded_at: string };

/**
 * Idempotence filter for ledger appends: an incoming entry whose identity
 * (id/label + batch_id + recorded_at) already exists in the ledger is skipped,
 * so re-applying a decision never duplicates ledger entries. Rejections carry
 * no `id` (label-keyed); held entries may carry either or both.
 */
export function filterAlreadyLedgered<T extends LedgerIdentity>(
  existing: readonly T[],
  incoming: readonly T[],
): { fresh: T[]; skipped: number } {
  const key = (e: LedgerIdentity) =>
    JSON.stringify([e.id ?? null, e.label ?? null, e.batch_id, e.recorded_at]);
  const seen = new Set(existing.map(key));
  const fresh = incoming.filter((e) => !seen.has(key(e)));
  return { fresh, skipped: incoming.length - fresh.length };
}
