/**
 * Golden fixtures for the stale recorded-gap detector (decision (119)).
 *
 * Purpose: CLOSURE-VOCABULARY FIDELITY. The detector's job is to notice when a
 * gap this corpus wrote down has quietly closed. It fails not by crashing but
 * by reporting a reassuring "none" about a closure shape nobody taught it —
 * which is exactly what happened twice: decision (118)'s first version scanned
 * forward from a label and missed six stale notes, and its shipped version
 * knew only the phrase "not a corpus node" while three other shapes were live
 * in /data, one of them written by that same repair.
 *
 * So every rule in `scripts/lib/stale-gaps.ts` gets a fixture that FIRES and,
 * where the rule is a restriction, one that must STAY SILENT. Delete a
 * phrasing family, widen the label lane to broad English, drop the inline
 * suppression, or revert the backward attribution to a forward scan, and a
 * fixture fails immediately. A fixture whose removal breaks nothing measures
 * nothing (decision (114)); each case below names the single rule it holds.
 *
 * Offline, synthetic, no /data dependency — the real corpus is a moving target
 * and cannot serve as its own regression suite. Run: npm run report:gap-fixtures
 */
import { findStaleGaps, type StaleGapEdge, type StaleGapKind } from "./lib/stale-gaps.ts";

type Fixture = {
  name: string;
  /** The rule this case exists to hold. */
  rule: string;
  edges: StaleGapEdge[];
  nodes: string[];
  labels: [string, string][];
  /** Expected hits as `edgeId|nodeId|kind`, in any order. */
  expect: string[];
};

const E = (
  id: string,
  source: string,
  target: string,
  note: string,
  relation = "founded_or_formalized",
): StaleGapEdge => ({ id, source, target, relation, note });

const hit = (edgeId: string, nodeId: string, kind: StaleGapKind) => `${edgeId}|${nodeId}|${kind}`;

const fixtures: Fixture[] = [
  {
    name: "label lane fires on the canonical 'not a corpus node' phrasing",
    rule: "NODE_ABSENT_UNAMBIGUOUS + label attribution",
    edges: [
      E(
        "edge:virchow-founded-cell-theory",
        "person:rudolf-virchow",
        "concept:cell-theory",
        "Priority preserved: Robert Remak is not a corpus node — an honest gap.",
      ),
    ],
    nodes: ["person:robert-remak", "person:rudolf-virchow", "concept:cell-theory"],
    labels: [["Robert Remak", "person:robert-remak"]],
    expect: [hit("edge:virchow-founded-cell-theory", "person:robert-remak", "node-absent")],
  },
  {
    name: "label lane attributes BACKWARD when the name also appears in an earlier quote",
    rule: "labelBefore scans backward from the gap phrase, not forward from the first mention",
    edges: [
      E(
        "edge:virchow-founded-cell-theory",
        "person:rudolf-virchow",
        "concept:cell-theory",
        'Source quote: "the idea had already been proposed by Robert Remak", which the field disputes at length across several sentences of recorded context here. Separately, Rudolf Virchow is not a corpus node.',
      ),
    ],
    nodes: ["person:robert-remak", "person:rudolf-virchow"],
    labels: [
      ["Robert Remak", "person:robert-remak"],
      ["Rudolf Virchow", "person:rudolf-virchow"],
    ],
    // A forward scan from the first label would blame Remak; backward attribution names Virchow.
    expect: [hit("edge:virchow-founded-cell-theory", "person:rudolf-virchow", "node-absent")],
  },
  {
    name: "explicit-id lane fires on 'no <id> node exists'",
    rule: "NODE_ABSENT_BROAD accepted beside a machine-checkable ID",
    edges: [
      E(
        "edge:bertrand-russell-founded-type-theory",
        "person:bertrand-russell",
        "subfield:type-theory",
        "Honest gap: no person:alfred-north-whitehead node exists.",
      ),
    ],
    nodes: ["person:alfred-north-whitehead", "person:bertrand-russell", "subfield:type-theory"],
    labels: [],
    expect: [
      hit("edge:bertrand-russell-founded-type-theory", "person:alfred-north-whitehead", "node-absent"),
    ],
  },
  {
    name: "explicit-id lane fires on '<id> does not exist'",
    rule: "NODE_ABSENT_BROAD covers the 'does not exist' phrasing (118) could not see",
    edges: [
      E(
        "edge:principia-canonical-work-russell",
        "work:principia-mathematica",
        "person:bertrand-russell",
        "The lead names both, but person:alfred-north-whitehead does not exist, having been dropped as an honesty gap.",
      ),
    ],
    nodes: ["person:alfred-north-whitehead", "work:principia-mathematica", "person:bertrand-russell"],
    labels: [],
    expect: [
      hit("edge:principia-canonical-work-russell", "person:alfred-north-whitehead", "node-absent"),
    ],
  },
  {
    name: "adjudication lane fires when the owed edge now exists",
    rule: "EDGE_UNADJUDICATED closes on the edge, not on the node",
    edges: [
      E(
        "edge:kenneth-arrow-founded-social-choice-theory",
        "person:kenneth-arrow",
        "subfield:social-choice-theory",
        "Duncan Black is a corpus node (person:duncan-black); whether he earns his own founder edge on this field has not been adjudicated.",
      ),
      E(
        "edge:duncan-black-founded-social-choice-theory",
        "person:duncan-black",
        "subfield:social-choice-theory",
        "",
      ),
    ],
    nodes: ["person:duncan-black", "person:kenneth-arrow", "subfield:social-choice-theory"],
    labels: [["Duncan Black", "person:duncan-black"]],
    expect: [
      hit(
        "edge:kenneth-arrow-founded-social-choice-theory",
        "person:duncan-black",
        "edge-unadjudicated",
      ),
    ],
  },
  {
    name: "adjudication lane fires on 'one edge short'",
    rule: "EDGE_UNADJUDICATED vocabulary is a family, not one phrase",
    edges: [
      E(
        "edge:amartya-sen-founded-social-choice-theory",
        "person:amartya-sen",
        "subfield:social-choice-theory",
        "The plural-founding record here (person:duncan-black) is still one edge short of what the source names.",
      ),
      E(
        "edge:duncan-black-founded-social-choice-theory",
        "person:duncan-black",
        "subfield:social-choice-theory",
        "",
      ),
    ],
    nodes: ["person:duncan-black", "person:amartya-sen", "subfield:social-choice-theory"],
    labels: [],
    expect: [
      hit(
        "edge:amartya-sen-founded-social-choice-theory",
        "person:duncan-black",
        "edge-unadjudicated",
      ),
    ],
  },
  {
    name: "label lane fires on the 'absent from the corpus' phrasing",
    rule: "NODE_ABSENT_UNAMBIGUOUS is a family — each member earns its own case",
    edges: [
      E(
        "edge:john-mauchly-influenced-computer-systems",
        "person:john-mauchly",
        "subfield:computer-systems",
        "Recorded from the refutation trail: John Atanasoff is absent from the corpus.",
      ),
    ],
    nodes: ["person:john-atanasoff", "subfield:computer-systems"],
    labels: [["John Atanasoff", "person:john-atanasoff"]],
    expect: [
      hit("edge:john-mauchly-influenced-computer-systems", "person:john-atanasoff", "node-absent"),
    ],
  },
  {
    name: "explicit-id lane takes the NEAREST id, not the first one in the window",
    rule: "idBefore returns the last match — an ID mentioned earlier in the clause is not the subject",
    edges: [
      E(
        "edge:kenneth-arrow-founded-social-choice-theory",
        "person:kenneth-arrow",
        "subfield:social-choice-theory",
        "person:kenneth-arrow originated the modern field; whether person:duncan-black earns his own founder edge on it has not been adjudicated.",
      ),
      E(
        "edge:duncan-black-founded-social-choice-theory",
        "person:duncan-black",
        "subfield:social-choice-theory",
        "",
      ),
    ],
    nodes: ["person:kenneth-arrow", "person:duncan-black", "subfield:social-choice-theory"],
    labels: [],
    expect: [
      hit(
        "edge:kenneth-arrow-founded-social-choice-theory",
        "person:duncan-black",
        "edge-unadjudicated",
      ),
    ],
  },
  {
    name: "label lane fires on the deferral phrasing 'a candidate for a future node'",
    rule: "absence expressed as a future plan is still an absence claim",
    edges: [
      E(
        "edge:john-von-neumann-founded-game-theory",
        "person:john-von-neumann",
        "subfield:game-theory",
        "The true 1944 co-founder is Oskar Morgenstern -- an economist and a candidate for a future (cross-domain) founder node -- not Nash.",
      ),
    ],
    nodes: ["person:oskar-morgenstern", "person:john-von-neumann", "subfield:game-theory"],
    labels: [["Oskar Morgenstern", "person:oskar-morgenstern"]],
    expect: [
      hit("edge:john-von-neumann-founded-game-theory", "person:oskar-morgenstern", "node-absent"),
    ],
  },
  {
    name: "label lane fires on the parenthetical shorthand '(noted, no node yet)'",
    rule: "shorthand absence markers belong to the vocabulary too",
    edges: [
      E(
        "edge:auguste-comte-founded-sociology",
        "person:auguste-comte",
        "field:sociology",
        "Karl Marx is also frequently co-cited as a principal architect (noted, no node yet).",
      ),
    ],
    nodes: ["person:karl-marx", "person:auguste-comte", "field:sociology"],
    labels: [["Karl Marx", "person:karl-marx"]],
    expect: [hit("edge:auguste-comte-founded-sociology", "person:karl-marx", "node-absent")],
  },
  {
    name: "label lane fires on the verb form 'neither nodified'",
    rule: "the vocabulary follows the corpus's own wording, including its coinages",
    edges: [
      E(
        "edge:theodor-schwann-founded-cell-biology",
        "person:theodor-schwann",
        "subfield:cell-biology",
        'Rudolf Virchow added "omnis cellula e cellula" (1855) and Robert Hooke coined the term "cell" (1665) -- neither nodified.',
      ),
    ],
    nodes: ["person:rudolf-virchow", "person:theodor-schwann", "subfield:cell-biology"],
    labels: [
      ["Rudolf Virchow", "person:rudolf-virchow"],
      ["Robert Hooke", "person:robert-hooke"],
    ],
    // Hooke is genuinely absent, so the nearest KNOWN label is Virchow, who is not.
    expect: [hit("edge:theodor-schwann-founded-cell-biology", "person:rudolf-virchow", "node-absent")],
  },
  {
    name: "founder-edge lane fires when the node now has a founder edge",
    rule: "FOUNDER_EDGE_ABSENT closes on any inbound founded_or_formalized edge",
    edges: [
      E(
        "edge:entropy-part-of-thermodynamics",
        "concept:entropy",
        "subfield:thermodynamics",
        "Single parent, strand recorded. concept:entropy is still without a founder edge.",
        "part_of",
      ),
      E(
        "edge:rudolf-clausius-founded-entropy",
        "person:rudolf-clausius",
        "concept:entropy",
        "",
      ),
    ],
    nodes: ["concept:entropy", "subfield:thermodynamics", "person:rudolf-clausius"],
    labels: [],
    expect: [
      hit("edge:entropy-part-of-thermodynamics", "concept:entropy", "founder-edge-absent"),
    ],
  },
  {
    name: "founder-edge lane stays silent when the node still has no founder edge",
    rule: "an influenced edge is not a founder edge",
    edges: [
      E(
        "edge:girolamo-fracastoro-influenced-germ-theory-of-disease",
        "person:girolamo-fracastoro",
        "concept:germ-theory-of-disease",
        "This leaves concept:germ-theory-of-disease still without a founder edge, which is the honest state.",
        "influenced",
      ),
    ],
    nodes: ["concept:germ-theory-of-disease", "person:girolamo-fracastoro"],
    labels: [],
    expect: [],
  },
  {
    name: "silent when the named node is genuinely still missing",
    rule: "the detector reports closure, not the existence of a gap",
    edges: [
      E(
        "edge:louis-pasteur-founded-microbiology",
        "person:louis-pasteur",
        "subfield:microbiology",
        "Antonie van Leeuwenhoek, co-credited for early microscopy, is still not a corpus node — that gap is live.",
      ),
    ],
    nodes: ["person:louis-pasteur", "subfield:microbiology"],
    labels: [["Antonie van Leeuwenhoek", "person:antonie-van-leeuwenhoek"]],
    expect: [],
  },
  {
    name: "silent when the owed edge still does not exist",
    rule: "adjudication lane requires the edge, not merely the node",
    edges: [
      E(
        "edge:bertrand-russell-founded-type-theory",
        "person:bertrand-russell",
        "subfield:type-theory",
        "A person:alfred-north-whitehead co-founder edge is left for a later wave rather than asserted here.",
      ),
    ],
    nodes: ["person:alfred-north-whitehead", "person:bertrand-russell", "subfield:type-theory"],
    labels: [],
    expect: [],
  },
  {
    name: "silent when the note records its own resolution inline",
    rule: "INLINE_RESOLUTION suppression, same subject only",
    edges: [
      E(
        "edge:biochemistry-part-of-life-sciences",
        "subfield:biochemistry",
        "field:biology",
        "Re-target note: field:biology does not exist yet — domain direct target; re-target when the skeleton lands. || RE-TARGET EXECUTED 2026-06-11: field:biology now exists in /data; target moved.",
      ),
    ],
    nodes: ["field:biology", "subfield:biochemistry"],
    labels: [],
    expect: [],
  },
  {
    name: "silent for text after a [Note refreshed] stamp",
    rule: "livePart — the tail quotes what was replaced and is not a live claim",
    edges: [
      E(
        "edge:louis-pasteur-founded-microbiology",
        "person:louis-pasteur",
        "subfield:microbiology",
        "Plural founding preserved. [Note refreshed 2026-07-30: the original text said person:robert-koch does not exist, which went stale.]",
      ),
    ],
    nodes: ["person:robert-koch", "person:louis-pasteur", "subfield:microbiology"],
    labels: [],
    expect: [],
  },
  {
    name: "silent on broad English with no node ID beside it",
    rule: "NODE_ABSENT_BROAD is explicit-id-lane only — ordinary prose is not a gap record",
    edges: [
      E(
        "edge:wallace-influenced-philosophy-of-biology",
        "person:alfred-russel-wallace",
        "subfield:philosophy-of-biology",
        "Held proposed: SEP 'wallace' entry does not exist (slug 404); insufficient clean sourcing.",
      ),
      E(
        "edge:jean-piaget-influenced-philosophy-of-mind",
        "person:jean-piaget",
        "subfield:philosophy-of-mind",
        "Jean Piaget: the generator's cited 'Piaget-Chomsky debates' article does not exist — substituted at QC.",
      ),
    ],
    nodes: ["person:alfred-russel-wallace", "person:jean-piaget", "subfield:philosophy-of-mind"],
    labels: [["Jean Piaget", "person:jean-piaget"]],
    expect: [],
  },
  {
    name: "a resolution marker about a DIFFERENT subject does not suppress",
    rule: "resolvedInline requires the same subject — (118) resolved half a sentence and left the rest false",
    edges: [
      E(
        "edge:kenneth-arrow-founded-social-choice-theory",
        "person:kenneth-arrow",
        "subfield:social-choice-theory",
        "Whether person:duncan-black earns his own founder edge has not been adjudicated. Separately, person:amartya-sen now exists and carries his own edge.",
      ),
      E(
        "edge:duncan-black-founded-social-choice-theory",
        "person:duncan-black",
        "subfield:social-choice-theory",
        "",
      ),
    ],
    nodes: ["person:duncan-black", "person:amartya-sen", "subfield:social-choice-theory"],
    labels: [],
    expect: [
      hit(
        "edge:kenneth-arrow-founded-social-choice-theory",
        "person:duncan-black",
        "edge-unadjudicated",
      ),
    ],
  },
  {
    name: "the longest matching label wins over a bare surname",
    rule: "labelBefore prefers the longer label — a surname can belong to a different person",
    edges: [
      E(
        "edge:virchow-founded-cell-theory",
        "person:rudolf-virchow",
        "concept:cell-theory",
        "Priority preserved: Robert Remak is not a corpus node.",
      ),
    ],
    // Only the full-name node exists; the surname maps to the grandson, who does not.
    nodes: ["person:robert-remak", "person:rudolf-virchow"],
    labels: [
      ["Robert Remak", "person:robert-remak"],
      ["Remak", "person:remak-the-mathematician"],
    ],
    expect: [hit("edge:virchow-founded-cell-theory", "person:robert-remak", "node-absent")],
  },
  {
    name: "explicit-id lane stays silent when the named ID genuinely does not exist",
    rule: "nodeIds.has() gate on the explicit lane",
    edges: [
      E(
        "edge:roman-jakobson-founded-phonology",
        "person:roman-jakobson",
        "subfield:phonology",
        "Co-founding recorded: person:nikolai-trubetzkoy does not exist.",
      ),
    ],
    nodes: ["person:roman-jakobson", "subfield:phonology"],
    labels: [],
    expect: [],
  },
  {
    name: "one note can be stale in two different ways at once",
    rule: "dedupe key includes kind — an absence and a ruling are separate closures",
    edges: [
      E(
        "edge:principia-canonical-work-russell",
        "work:principia-mathematica",
        "person:bertrand-russell",
        "person:alfred-north-whitehead does not exist; whether person:alfred-north-whitehead earns this leg has not been adjudicated.",
      ),
      E(
        "edge:principia-canonical-work-whitehead",
        "work:principia-mathematica",
        "person:alfred-north-whitehead",
        "",
      ),
    ],
    nodes: [
      "person:alfred-north-whitehead",
      "person:bertrand-russell",
      "work:principia-mathematica",
    ],
    labels: [],
    expect: [
      hit("edge:principia-canonical-work-russell", "person:alfred-north-whitehead", "node-absent"),
      hit(
        "edge:principia-canonical-work-russell",
        "person:alfred-north-whitehead",
        "edge-unadjudicated",
      ),
    ],
  },
  {
    name: "a distant unrelated ID does not get mistaken for the gap's subject",
    rule: "ABSENCE_LOOKBEHIND is tight — an absence claim names its subject adjacently",
    // Caught by running the detector against real /data: the subject here is a
    // prose name with no node at all, and the nearest ID sat 196 characters back.
    edges: [
      E(
        "edge:girolamo-fracastoro-influenced-germ-theory-of-disease",
        "person:girolamo-fracastoro",
        "concept:germ-theory-of-disease",
        "This leaves concept:germ-theory-of-disease still without a founder edge, which is the honest state: Pasteur and Koch were ruled NEI in concept-wave3-v1, and Marcus von Plenciz, named alongside Fracastoro, is not a corpus node.",
      ),
    ],
    nodes: ["concept:germ-theory-of-disease", "person:girolamo-fracastoro"],
    labels: [["Girolamo Fracastoro", "person:girolamo-fracastoro"]],
    expect: [],
  },
  {
    name: "an edge does not close its own gap sentence",
    rule: "closedBy !== the note's own edge",
    edges: [
      E(
        "edge:duncan-black-founded-social-choice-theory",
        "person:duncan-black",
        "subfield:social-choice-theory",
        "Whether person:duncan-black earns this has not been adjudicated.",
      ),
    ],
    nodes: ["person:duncan-black", "subfield:social-choice-theory"],
    labels: [],
    expect: [],
  },
];

let failures = 0;
for (const f of fixtures) {
  const got = findStaleGaps({
    edges: f.edges,
    nodeIds: new Set(f.nodes),
    labelToNode: new Map(f.labels),
  }).map((g) => hit(g.edgeId, g.nodeId, g.kind));

  const want = [...f.expect].sort();
  const have = [...got].sort();
  const ok = want.length === have.length && want.every((w, i) => w === have[i]);

  if (ok) {
    console.log(`  ✓ ${f.name}`);
  } else {
    failures += 1;
    console.error(
      `  ✗ ${f.name}\n      rule: ${f.rule}\n      expected: ${want.join(", ") || "(silence)"}\n      got:      ${have.join(", ") || "(silence)"}`,
    );
  }
}

if (failures > 0) {
  console.error(
    `\n✗ stale-gap fixtures: ${failures}/${fixtures.length} FAILED — a closure shape the detector is supposed to see has drifted.`,
  );
  process.exit(1);
}
console.log(
  `\n✓ stale-gap fixtures: ${fixtures.length}/${fixtures.length} passed (every closure shape: fires + stays silent where restricted).`,
);
