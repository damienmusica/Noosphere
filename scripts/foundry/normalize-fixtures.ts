/**
 * Golden fixtures for scripts/foundry/lib/normalize-text.ts — CI-gated.
 *
 * Every measured false-miss family gets two directions: the real quote MATCHES
 * after normalization, and an adversarial/invisible variant stays ABSENT (the
 * content-free invariant: normalization removes mechanical noise only; it must
 * never make a laundered quote match). Run: npm run foundry:normalize-fixtures.
 *
 * Origin: session #64 ruled three fetch-verify misses on enwiki ENIAC
 * (oldid=1365289299) as false-misses by independent fetch; the trace found an
 * HTML comment containing an apostrophe bridging 14.6KB into one "tag"
 * (comment-stripping now precedes tag-stripping). The other families encode
 * the session #17/#55/#57 measured patterns so the next normalize edit cannot
 * silently regress them.
 */
import { normalize } from "./lib/normalize-text";

type Fixture = {
  name: string;
  page: string;
  quote: string;
  expect: "match" | "absent";
};

// The session-#64 bridge shape, miniaturized from the real page: a comment
// with an apostrophe, then the lead (link-dense, footnote markers), then a
// Parsoid transclusion span whose single-quoted data-mw carries apostrophes
// as &apos; and a literal `>` inside its quoted value.
const ENIAC_SHAPE = `
<!-- {{Other uses}} at present, the disambiguation page doesn't have any other live links -->
<p><b>ENIAC</b> was the first <a href="/wiki/Programmable">programmable</a>,
<a href="/wiki/Electronics">electronic</a>, general-purpose digital
<a href="/wiki/Computer">computer</a>, completed in 1945.[3][4] Other computers
had some of these features, but ENIAC was the first to have them all.</p>
<span typeof="mw:Transclusion" data-mw='{"parts":[{"template":{"target":{"wt":"Refbegin"},"params":{"1":{"wt":"citation with &apos;quotes&apos; and a literal </ref> tag"}},"i":0}}]}'></span>
<p>ENIAC was designed by <a href="/wiki/John_Mauchly">John Mauchly</a> and
<a href="/wiki/J._Presper_Eckert">J. Presper Eckert</a> to calculate artillery
firing tables for the <a href="/wiki/United_States_Army">United States Army</a>'s
Ballistic Research Laboratory.</p>`;

const FIXTURES: Fixture[] = [
  {
    name: "comment with apostrophe does not swallow the lead (session #64 bridge)",
    page: ENIAC_SHAPE,
    quote:
      "was the first programmable, electronic, general-purpose digital computer, completed in 1945.",
    expect: "match",
  },
  {
    name: "text after an apostrophe-bearing comment and a data-mw span survives",
    page: ENIAC_SHAPE,
    quote:
      "ENIAC was designed by John Mauchly and J. Presper Eckert to calculate artillery firing tables for the United States Army",
    expect: "match",
  },
  {
    name: "rendered link-boundary spacing variant matches the same clean quote",
    page: ENIAC_SHAPE.replace("programmable</a>,", "programmable</a> ,"),
    quote:
      "was the first programmable, electronic, general-purpose digital computer, completed in 1945.",
    expect: "match",
  },
  {
    name: "a quote that exists ONLY inside a comment stays absent (reader-invisible)",
    page: ENIAC_SHAPE,
    quote: "the disambiguation page doesn't have any other live links",
    expect: "absent",
  },
  {
    name: "data-mw attribute JSON does not leak into text (session #55 family)",
    page: ENIAC_SHAPE,
    quote: "citation with 'quotes' and a literal",
    expect: "absent",
  },
  {
    name: "footnote markers interjected in a quoted span (session #17 family)",
    page: "<p>used for buildings[1] and other[a] structures in the city.</p>",
    quote: "used for buildings and other structures in the city.",
    expect: "match",
  },
  {
    name: "tag-stripping space before punctuation (session #17 family)",
    page: "<p>the study of <a>geotechnics</a> , applied to soils.</p>",
    quote: "the study of geotechnics, applied to soils.",
    expect: "match",
  },
  {
    name: "named typographic entities decode (session #57 family)",
    page: "<p>Whitehead&rsquo;s &ldquo;philosophy of organism&rdquo; endures.</p>",
    quote: "Whitehead's \"philosophy of organism\" endures.",
    expect: "match",
  },
  {
    name: "both-sided spaced dash is real punctuation — fabricated hyphenation stays absent",
    page: "<p>an in — depth treatment of the subject.</p>",
    quote: "an in-depth treatment",
    expect: "absent",
  },
  {
    name: "script and style bodies never match",
    page: "<script>var x = 'the hidden founding sentence';</script><p>visible prose only.</p>",
    quote: "the hidden founding sentence",
    expect: "absent",
  },
];

let pass = 0;
const failures: string[] = [];
for (const f of FIXTURES) {
  const hit = normalize(f.page).includes(normalize(f.quote));
  const ok = f.expect === "match" ? hit : !hit;
  if (ok) {
    pass++;
    console.log(`  ✓ ${f.name}`);
  } else {
    failures.push(f.name);
    console.error(`  ✗ ${f.name} (expected ${f.expect}, got ${hit ? "match" : "absent"})`);
  }
}

if (failures.length > 0) {
  console.error(`\n✗ normalize fixtures: ${pass}/${FIXTURES.length} passed.`);
  process.exit(1);
}
console.log(
  `\n✓ normalize fixtures: ${pass}/${FIXTURES.length} passed (every measured false-miss family: match + content-free absence).`,
);
