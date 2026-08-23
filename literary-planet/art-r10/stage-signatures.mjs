#!/usr/bin/env node
// Signature wave (R12, CPO ruling C·E 2026-08-24) — stage rights-surveyed
// Commons signature files into art-r10/staging/<author>/ with a provenance row,
// so build-art-assets.py can ship them as marks exactly the way the first three
// were shipped. Nothing enters the build without a row.
//
//   node art-r10/stage-signatures.mjs --survey <survey.json> --files <dir>
//
// The survey is the output of the Commons/Wikidata survey (P109 → imageinfo +
// extmetadata). This script applies the *policy*, not the licence judgement:
//   · living authors are held (conservative rule for living persons)
//   · CC BY-SA files are held for a human look (share-alike on a derivative)
//   · files the survey flagged as "more than a signature" are held
//   · PD / CC0 / CC BY files are staged, with the licence tag recorded verbatim
// Why a signature is the first wave: a signature is below the threshold of
// originality regardless of the signer's death year, so it is the one real
// identity object available for most of the corpus (Wikidata P109: 65/97).

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const surveyPath = opt("survey");
const filesDir = opt("files");
if (!surveyPath || !filesDir) {
  console.error("usage: stage-signatures.mjs --survey <survey.json> --files <dir>");
  process.exit(2);
}

/** files the survey marked as not a plain signature (human judgement, recorded here) */
const NOT_A_SIGNATURE = new Set([
  "virginia-woolf", // verso of a photograph print — the whole back of the photo, not an isolated signature
  "rk-narayan" // 1600×1200 photo-like scan; also CC BY-SA
]);

const survey = JSON.parse(readFileSync(surveyPath, "utf8"));
const staged = [];
const held = [];
for (const r of survey) {
  if (!r.fileTitle || !r.localFile) continue;
  const tag = (r.licenseShortName ?? "").trim();
  const lower = tag.toLowerCase();
  let hold = null;
  if (r.living) hold = "living author — held by the living-person rule";
  else if (NOT_A_SIGNATURE.has(r.authorId)) hold = "file is more than a signature — needs a crop or a different file";
  else if (lower.includes("by-sa")) hold = `share-alike licence (${tag}) — needs a human look before a derivative ships`;
  else if (!(lower.includes("public domain") || lower === "cc0" || lower.startsWith("cc by")))
    hold = `licence tag not in the accepted set (${tag || "none"})`;
  if (hold) {
    held.push({ authorId: r.authorId, reason: hold, fileTitle: r.fileTitle });
    continue;
  }
  const ext = path.extname(r.localFile).toLowerCase().replace(".jpeg", ".jpg");
  const dir = path.join(ROOT, "art-r10", "staging", r.authorId);
  mkdirSync(dir, { recursive: true });
  const target = `signature${ext}`;
  copyFileSync(path.join(filesDir, path.basename(r.localFile)), path.join(dir, target));
  const row = {
    file: target,
    title: r.fileTitle.replace(/^File:/, ""),
    sourceCollection: `Wikimedia Commons${r.artist ? ` (${r.artist})` : ""}${r.credit ? ` — ${r.credit}` : ""}`.slice(0, 240),
    filePageUrl: r.pageUrl,
    originalFileUrl: (r.originalUrl ?? "").split("?")[0],
    licenseTag: tag || r.license || "untagged",
    licenseBasis:
      lower.includes("public domain")
        ? "A signature is below the threshold of originality; file page carries a public-domain tag"
        : lower === "cc0"
          ? "Uploader released the trace under CC0; the signature itself is below the threshold of originality"
          : "Uploader's trace licensed CC BY — attribution carried in this row; the signature itself is below the threshold of originality",
    pixelSize: `${r.width}x${r.height}`,
    notes: `Wikidata P109 (${r.qid}). ${r.mime}. Staged by art-r10/stage-signatures.mjs on 2026-08-24.`
  };
  const provPath = path.join(dir, "provenance.json");
  const prov = existsSync(provPath) ? JSON.parse(readFileSync(provPath, "utf8")) : [];
  const without = prov.filter((x) => x.file !== target);
  writeFileSync(provPath, JSON.stringify([...without, row], null, 2) + "\n");
  staged.push({ authorId: r.authorId, file: target, licence: row.licenseTag });
}
console.log(`staged ${staged.length} · held ${held.length}`);
for (const h of held) console.log(`  held  ${h.authorId}: ${h.reason}`);
writeFileSync(
  path.join(ROOT, "art-r10", "staging", "signature-wave.json"),
  JSON.stringify({ stagedAt: "2026-08-24", staged, held }, null, 2) + "\n"
);
