/**
 * Claim-anchor checker — the *mechanical half* of citation QC.
 *
 * Usage:
 *   npm run foundry:claim-anchor -- <captured-page-file> "<quoted claim>"
 *   npm run foundry:claim-anchor -- <captured-page-file> --quotes <quotes.json>
 *     (quotes.json: array of strings, or array of { quote: string, … })
 *
 * Checks whether a quoted claim actually appears in a locally captured page
 * (HTML or text), after normalizing the typographic variants that produced
 * false misses in past QC passes — see lib/normalize-text.ts (shared with
 * fetch-verify.ts so offline and live checks apply identical normalization).
 *
 * IMPORTANT BOUNDARY: a FOUND result means the *string* is on the page after
 * normalization — it does NOT mean the claim is true, in context, or fairly
 * used; a NOT-FOUND result may still be a paraphrase a human accepts. The
 * verdict on every citation remains a human QC judgment (editorial v1).
 * Fully offline; reads only local files.
 */
import { readFileSync } from "node:fs";
import { normalize, nearestWindow } from "./lib/normalize-text.ts";

function main(): void {
  const [file, ...rest] = process.argv.slice(2);
  if (!file || rest.length === 0) {
    console.error(
      'usage: claim-anchor-check.ts <captured-page-file> "<quote>"\n' +
        "       claim-anchor-check.ts <captured-page-file> --quotes <quotes.json>",
    );
    process.exit(2);
  }
  const raw = readFileSync(file, "utf8");
  const hay = normalize(raw);

  let quotes: string[];
  if (rest[0] === "--quotes") {
    const parsed = JSON.parse(readFileSync(rest[1]!, "utf8")) as unknown[];
    quotes = parsed.map((q) =>
      typeof q === "string" ? q : (q as { quote: string }).quote,
    );
  } else {
    quotes = [rest.join(" ")];
  }

  let misses = 0;
  for (const quote of quotes) {
    const needle = normalize(quote);
    const idx = hay.indexOf(needle);
    if (idx >= 0) {
      const ctx = hay.slice(Math.max(0, idx - 80), idx + needle.length + 80);
      console.log(`FOUND      "${quote.slice(0, 70)}${quote.length > 70 ? "…" : ""}"`);
      console.log(`  context: …${ctx}…`);
    } else {
      misses++;
      console.log(`NOT-FOUND  "${quote.slice(0, 70)}${quote.length > 70 ? "…" : ""}"`);
      console.log(`  nearest: ${nearestWindow(raw, needle)}`);
    }
  }
  console.log("");
  console.log(
    `${quotes.length - misses}/${quotes.length} quotes found after normalization. ` +
      "Mechanical half only — context, fairness and truth of every citation remain human QC judgments.",
  );
  // Misses are NOT an error exit: a paraphrase can be a legitimate citation.
}

main();
