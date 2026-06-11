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
 * false misses in past QC passes (session #9 measured patterns):
 *   - TeX markup: `$K$-theory` → `K-theory`, `\command{x}` → `x`
 *   - arrow variants: → ⟶ ⇒ ↦ and `->` all normalize to `->`
 *   - hyphen/dash variants: ‐ ‑ ‒ – — ― − all normalize to `-`
 *   - quote variants: curly/angled single+double quotes → straight
 *   - HTML: tags stripped, common entities decoded, whitespace collapsed
 *
 * IMPORTANT BOUNDARY: a FOUND result means the *string* is on the page after
 * normalization — it does NOT mean the claim is true, in context, or fairly
 * used; a NOT-FOUND result may still be a paraphrase a human accepts. The
 * verdict on every citation remains a human QC judgment (editorial v1).
 * Fully offline; reads only local files.
 */
import { readFileSync } from "node:fs";

function normalize(input: string): string {
  let s = input;
  // Strip HTML if it looks like markup: remove script/style bodies, then tags.
  if (/<[a-z!/][^>]*>/i.test(s)) {
    s = s.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ");
    s = s.replace(/<[^>]+>/g, " ");
  }
  // Decode the entities that actually occur in captured scholarly pages.
  s = s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&rarr;|&#8594;/g, "->");
  // TeX: `$...$` keeps inner text; `\command{arg}` keeps arg; bare `\command` drops.
  s = s.replace(/\$([^$]*)\$/g, "$1");
  s = s.replace(/\\[a-zA-Z]+\{([^}]*)\}/g, "$1");
  s = s.replace(/\\[a-zA-Z]+/g, " ");
  s = s.replace(/[{}]/g, "");
  // Arrows → "->" ; hyphen/dash family → "-" ; curly quotes → straight.
  s = s.replace(/[→⟶⇒↦⇨⟹]/g, "->");
  s = s.replace(/[‐‑‒–—―−]/g, "-");
  s = s.replace(/[‘’‚‹›]/g, "'");
  s = s.replace(/[“”„«»]/g, '"');
  // Ligatures & soft hyphens that survive PDF/text extraction.
  s = s.replace(/­/g, "").replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl");
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

/** Cheap best-effort locator for a near-miss: the line with the most shared tokens. */
function nearestWindow(haystackRaw: string, needle: string): string {
  const tokens = new Set(needle.split(/\W+/).filter((t) => t.length > 3));
  if (tokens.size === 0) return "(no locatable tokens)";
  let best = "";
  let bestScore = 0;
  for (const line of haystackRaw.split(/[\n.]+/)) {
    const norm = normalize(line);
    if (!norm) continue;
    let score = 0;
    for (const t of tokens) if (norm.includes(t)) score++;
    if (score > bestScore) {
      bestScore = score;
      best = norm.slice(0, 240);
    }
  }
  return bestScore === 0
    ? "(no line shares tokens with the quote)"
    : `~${Math.round((bestScore / tokens.size) * 100)}% token overlap: "${best}"`;
}

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
