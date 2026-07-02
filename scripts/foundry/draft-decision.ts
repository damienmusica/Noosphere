/**
 * draft-decision — schema-valid decision-file skeleton generator
 * (v1.1 hardening, 2026-07-02; the decision-authoring mirror of
 * build-proposal-skeleton).
 *
 * Since §15, every batch's QC outcome lives in a decision file — but sessions
 * were assembling those files with hand-rolled scratchpad JS, re-deriving the
 * schema each time. This tool emits a validated skeleton and seeds the two
 * most common shapes:
 *
 *   --summaries <file>   editorial batch: seeds translation_updates
 *                        (reviewed:true) + editorial-v2 sanctions + supported
 *                        verdicts whose sources carry the citations' verbatim
 *                        quotes (independent = first occurrence of a URL
 *                        within each verdict). Input = the generator-merge
 *                        shape fetch-verify already reads:
 *                        { summaries: [{ node_id, summary,
 *                          citations: [{ url, quote }], self_flags? }] }
 *
 *   --flip-indexable <id,id,…>
 *                        indexable earned-rule flips: seeds reviewed→reviewed
 *                        metadata-flip promotion ops (set_indexable:true) —
 *                        the CPO-ratified metadata-flip path (2026-07-02).
 *
 *   --promote <kind>:<id>:<from>:<to>   (repeatable) generic promotion op —
 *                        ladder sanctions/verdicts still need hand-filling.
 *
 * The skeleton is validated against foundryDecisionSchema before writing, so
 * a draft is never schema-invalid. It is a STARTING POINT: verdict sources,
 * identity records, held/rejection entries and notes remain the
 * orchestrator's QC judgment — this tool never invents evidence.
 *
 * Offline by design. Writes ONLY the decision file (default
 * foundry/decisions/<batch-id>.json; refuses overwrite without --force).
 *
 * Usage:
 *   npm run foundry:draft-decision -- <batch-id> --qc-by "<model_name>=<model_version>"
 *       [--summaries <file>] [--flip-indexable <id,id,…>]
 *       [--promote <kind>:<id>:<from>:<to>]… [--out <path>] [--force]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, isAbsolute, join, resolve } from "node:path";

import {
  foundryDecisionSchema,
  type FoundryDecision,
  type PromotionOp,
  type Sanction,
  type TranslationUpdate,
  type VerdictRecord,
} from "../../src/schema/foundry-decision.ts";
import { die } from "./lib/decision-io.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const today = new Date().toISOString().slice(0, 10);

function parseArgs(argv: string[]): {
  batchId: string | undefined;
  opts: Record<string, string | boolean>;
  promotes: string[];
} {
  let batchId: string | undefined;
  const opts: Record<string, string | boolean> = {};
  const promotes: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        if (key === "promote") promotes.push(next);
        else opts[key] = next;
        i++;
      } else opts[key] = true;
    } else batchId = a;
  }
  return { batchId, opts, promotes };
}

interface SummariesInput {
  summaries: {
    node_id?: string;
    summary?: string;
    citations?: { url?: string; quote?: string }[];
    self_flags?: string[];
  }[];
}

function main(): void {
  const { batchId, opts, promotes } = parseArgs(process.argv.slice(2));
  const usage =
    'usage: draft-decision.ts <batch-id> --qc-by "<model_name>=<model_version>"\n' +
    "    [--summaries <file>] [--flip-indexable <id,id,…>]\n" +
    "    [--promote <kind>:<id>:<from>:<to>]… [--out <path>] [--force]";
  if (!batchId) die(usage);
  const qcByRaw = typeof opts["qc-by"] === "string" ? (opts["qc-by"] as string) : undefined;
  if (!qcByRaw || !qcByRaw.includes("=")) {
    die(`--qc-by "<model_name>=<model_version>" is required (honest QC provenance)\n${usage}`);
  }
  const [qcName, ...qcVersionParts] = qcByRaw.split("=");
  const qcVersion = qcVersionParts.join("=");
  if (!qcName?.trim() || !qcVersion.trim()) die(`--qc-by could not be parsed from "${qcByRaw}"`);

  const translation_updates: TranslationUpdate[] = [];
  const sanctions: Sanction[] = [];
  const verdicts: VerdictRecord[] = [];
  const promotions: PromotionOp[] = [];

  // --- --summaries seeding (editorial batches) ---------------------------------
  if (typeof opts.summaries === "string") {
    const parsed = JSON.parse(readFileSync(opts.summaries, "utf8")) as SummariesInput;
    if (!Array.isArray(parsed.summaries)) {
      die(`${opts.summaries}: expected { summaries: [{ node_id, summary, citations }] }`);
    }
    for (const s of parsed.summaries) {
      if (!s.node_id || !s.summary?.trim()) {
        die(`--summaries: an entry is missing node_id or summary`);
      }
      translation_updates.push({ node_id: s.node_id, locale: "en", summary: s.summary, reviewed: true });
      sanctions.push({ subject_id: s.node_id, ladder: "editorial-v2" });
      const seen = new Set<string>();
      const sources = (s.citations ?? [])
        .filter((c): c is { url: string; quote?: string } => typeof c.url === "string" && !!c.url)
        .map((c) => {
          const independent = !seen.has(c.url);
          seen.add(c.url);
          return {
            url: c.url,
            retrieved_at: today,
            ...(c.quote ? { quote: c.quote } : {}),
            independent,
          };
        });
      verdicts.push({
        subject_id: s.node_id,
        verdict: "supported",
        sources,
        ...(s.self_flags?.length ? { notes: `generator self-flags: ${s.self_flags.join(" | ")}` } : {}),
      });
    }
  }

  // --- --flip-indexable seeding (metadata flips) --------------------------------
  if (typeof opts["flip-indexable"] === "string") {
    for (const id of (opts["flip-indexable"] as string).split(",").map((s) => s.trim()).filter(Boolean)) {
      promotions.push({ kind: "node", id, from: "reviewed", to: "reviewed", set_indexable: true });
    }
  }

  // --- --promote seeding (generic ops) -------------------------------------------
  for (const spec of promotes) {
    const parts = spec.split(":");
    // id itself contains one ":" (e.g. person:isaac-newton) → kind : idA : idB : from : to
    if (parts.length !== 5 || (parts[0] !== "node" && parts[0] !== "edge")) {
      die(`--promote expects <kind>:<id>:<from>:<to> (got "${spec}")`);
    }
    const [kind, idA, idB, from, to] = parts as [
      "node" | "edge",
      string,
      string,
      PromotionOp["from"],
      PromotionOp["to"],
    ];
    promotions.push({ kind, id: `${idA}:${idB}`, from, to });
  }

  const draft: FoundryDecision = foundryDecisionSchema.parse({
    version: 1,
    batch_id: batchId,
    decided_at: today,
    qc_by: { model_name: qcName.trim(), model_version: qcVersion.trim(), proposed_at: today },
    promotions,
    translation_updates,
    verdicts,
    sanctions,
    notes: [
      "DRAFT skeleton (foundry:draft-decision) — fill in QC judgment before apply: " +
        "verdict quotes/notes, identity records, held/rejection entries, batch notes.",
    ],
  });

  const outPath =
    typeof opts.out === "string"
      ? isAbsolute(opts.out)
        ? (opts.out as string)
        : resolve(process.cwd(), opts.out as string)
      : join(REPO_ROOT, "foundry", "decisions", `${batchId}.json`);
  if (existsSync(outPath) && !opts.force) {
    die(`${outPath} already exists — decision files are audit trail; use --force only for un-applied drafts`);
  }
  writeFileSync(outPath, JSON.stringify(draft, null, 2) + "\n");
  console.log(
    `✓ wrote ${outPath} (${translation_updates.length} translation update(s), ` +
      `${promotions.length} promotion(s), ${verdicts.length} verdict(s), ${sanctions.length} sanction(s))`,
  );
  console.log(
    "next: foundry:verify-identity / foundry:anchor → foundry:ladder-check → foundry:apply-batch → foundry:report",
  );
}

main();
