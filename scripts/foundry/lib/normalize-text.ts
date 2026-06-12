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
 */

export function normalize(input: string): string {
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
    .replace(/&rarr;|&#8594;/g, "->")
    .replace(/&#91;/g, "[")
    .replace(/&#93;/g, "]");
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
  // Wikipedia-style numeric footnote markers interjected in running prose.
  s = s.replace(/\[\s*\d+\s*\]/g, " ");
  s = s.replace(/\s+/g, " ").trim().toLowerCase();
  // Tag/marker stripping leaves stray spaces around punctuation — remove
  // space before closing punctuation and after an opening bracket.
  s = s.replace(/ ([,.;:!?)\]])/g, "$1").replace(/([([]) /g, "$1");
  return s;
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
