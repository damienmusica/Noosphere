/**
 * Shared text-normalization for citation QC tools (claim-anchor-check,
 * fetch-verify). Extracted verbatim from claim-anchor-check.ts so both tools
 * apply the *same* normalization — a quote that passes offline must pass
 * against the identical live capture, and vice versa.
 *
 * Normalizes the typographic variants that produced false misses in past QC
 * passes (session #9 measured patterns):
 *   - TeX markup: `$K$-theory` → `K-theory`, `\command{x}` → `x`
 *   - arrow variants: → ⟶ ⇒ ↦ and `->` all normalize to `->`
 *   - hyphen/dash variants: ‐ ‑ ‒ – — ― − all normalize to `-`
 *   - quote variants: curly/angled single+double quotes → straight
 *   - HTML: tags stripped, common entities decoded, whitespace collapsed
 *
 * Session #17 measured patterns (live-fetch false misses on already-verified
 * ENG citations — mechanical artifacts, not content differences):
 *   - Wikipedia footnote markers interjected inside a quoted span:
 *     `… for buildings[1] and …` → marker stripped (bracketed digits only)
 *   - tag stripping inserting a space before punctuation:
 *     `<a>geotechnics</a>,` → `geotechnics ,` → space-before-punctuation removed
 * Both rules are SYMMETRIC (quote and page get identical treatment) and
 * content-free, so they only remove mechanical noise — they cannot make a
 * laundered (absent) quote match.
 *
 * Session #55 measured patterns (live-fetch false misses on already-verified
 * editorial person citations against Wikipedia's Parsoid read-view HTML — all
 * mechanical artifacts, 12/102 quotes; each fix verified SYMMETRIC + content-free
 * against adversarial fabricated quotes that stay correctly absent):
 *   - Parsoid `data-mw='{…&lt;/ref>…}'` attributes embed a literal `>`, so the
 *     naive `<[^>]+>` tag matcher terminated early and leaked JSON into the lead
 *     text → a quote-aware tag matcher skips `>` inside quoted attribute values.
 *   - numeric HTML entities the named-entity table missed (`&#160;` nbsp,
 *     `&#8211;` en-dash, `&#32;` space, …) → decode decimal + hex to real chars.
 *   - single-letter footnote markers (`[a]`, `[b]`) alongside the digit ones.
 *   - quote/apostrophe-adjacent spaces from split spans (`psychology "`,
 *     `Cantor 's`, `" impossibility theorem "`) → space next to `'`/`"` removed.
 *   - a ONE-sided space beside a dash from a wikilink boundary
 *     (`algebra <a>…</a>—essential` → `algebra -essential`) → the one-sided
 *     space collapses into the dash, but never inside an `->` arrow. BOTH-sided
 *     spaced dashes (` - `, real punctuation) are PRESERVED as word separators:
 *     the original collapse-everything rule let a fabricated hyphenated quote
 *     (`in-depth`) falsely match spaced-dash prose (`in — depth`) — a false
 *     PASS violating the content-free invariant above; corrected per the
 *     2026-07-02 inspection finding (protect ` - `, collapse one-sided
 *     artifacts, restore).
 */

export function normalize(input: string): string {
  let s = input;
  // Strip HTML if it looks like markup: remove script/style bodies, then tags.
  // The tag matcher is quote-aware — a `>` inside a quoted attribute value (e.g.
  // Parsoid `data-mw='{…&lt;/ref>…}'`) must NOT end the tag, or the JSON leaks
  // into the running text and corrupts a lead-sentence quote (session #55).
  if (/<[a-z!/]/i.test(s)) {
    s = s.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ");
    s = s.replace(/<[a-zA-Z!/][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/g, " ");
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
    .replace(/&rarr;|&#8594;/g, "->")
    .replace(/&#91;/g, "[")
    .replace(/&#93;/g, "]");
  // Decode any remaining numeric HTML entities (decimal + hex) to their real
  // characters — the dash/quote/space normalizers below then handle the results.
  s = s
    .replace(/&#(\d+);/g, (_m, n: string) => codePoint(Number.parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, h: string) => codePoint(Number.parseInt(h, 16)));
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
  // Wikipedia-style footnote markers interjected in running prose — numeric
  // (`[1]`) and single-letter note markers (`[a]`, `[b]`).
  s = s.replace(/\[\s*\d+\s*\]/g, " ").replace(/\[\s*[a-z]\s*\]/gi, " ");
  s = s.replace(/\s+/g, " ").trim().toLowerCase();
  // Tag/marker stripping leaves stray spaces around punctuation — remove space
  // before closing punctuation, after an opening bracket, and adjacent to a
  // straight quote/apostrophe (split spans render `psychology "` / `Cantor 's`).
  s = s.replace(/ ([,.;:!?)\]])/g, "$1").replace(/([([]) /g, "$1");
  s = s.replace(/ (['"])/g, "$1").replace(/(['"]) /g, "$1");
  // A wikilink boundary can leave a ONE-sided space beside a dash
  // (`algebra -essential`); only that one-sided artifact may collapse into the
  // dash — never inside an `->` arrow. A BOTH-sided spaced dash (` - `) is real
  // punctuation and must survive as a word separator: collapsing it would let a
  // fabricated hyphenated quote (`in-depth`) falsely match spaced-dash prose
  // (`in — depth`), breaking the content-free invariant (2026-07-02
  // inspection). Protect ` - ` with a placeholder, collapse the one-sided
  // artifacts, then restore.
  s = s.replace(/ - /g, "\x01");
  s = s.replace(/ -(?=[^>\s])/g, "-").replace(/(?<=\S)-(?!>) /g, "-");
  s = s.replace(/\x01/g, " - ");
  return s;
}

/** Safe String.fromCodePoint — an out-of-range value becomes a space, not a throw. */
function codePoint(n: number): string {
  if (!Number.isFinite(n) || n < 0 || n > 0x10ffff) return " ";
  try {
    return String.fromCodePoint(n);
  } catch {
    return " ";
  }
}

/** Cheap best-effort locator for a near-miss: the line with the most shared tokens. */
export function nearestWindow(haystackRaw: string, needle: string): string {
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
