#!/usr/bin/env python3
"""Mutation sweep: does the stale-gap fixture suite actually have teeth?

MAINTAINER TOOL, NOT CI. It patches `scripts/lib/stale-gaps.ts` in place and
restores it after each case. Run it manually:

    python3 scripts/gap-fixture-mutation-sweep.py

For each plausible way the detector could quietly lose a rule — a phrasing
family dropped from the vocabulary, a lookbehind window widened or narrowed, a
suppression clause disabled, the label lane's backward attribution flipped — it
patches, runs `scripts/gap-fixtures.ts`, and records whether a fixture caught
it. A SURVIVED mutation is an uncovered rule: the suite would stay green while
the detector silently stopped seeing that closure shape.

That failure mode is not hypothetical here. The stale-gap detector has shipped
broken twice. Decision (118)'s first version scanned forward from a label and
reported a clean corpus while six notes were stale; its shipped version knew
one phrasing family while three others were live in /data — one of them written
by that same repair. Both times the detector's own coverage was asserted rather
than measured, which is what this file exists to stop.

**Restores from an in-memory copy, not from git** — unlike the ladder sweep,
which reverts with `git checkout --` and therefore silently eats uncommitted
edits to its target (measured 2026-07-30). Reading the file once and writing
that text back has the same effect for a committed file, works on an
uncommitted one, and removes the "commit first" footgun entirely.

Interrupt-safe: the restore runs in a `finally` and is also registered with
`atexit`, so a Ctrl-C or a kill still leaves the working tree as it was found.
"""
import atexit
import subprocess
import sys

REPO = subprocess.run(
    ["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True, check=True
).stdout.strip()
TARGET = f"{REPO}/scripts/lib/stale-gaps.ts"

# (name, needle, replacement, occurrence_index_1based)
MUTATIONS = [
    # --- closure vocabulary: the exact thing (118) got wrong -----------------
    (
        "vocabulary: broad phrasings dropped ((118) shipped state)",
        "for (const re of [NODE_ABSENT_UNAMBIGUOUS, NODE_ABSENT_BROAD]) {",
        "for (const re of [NODE_ABSENT_UNAMBIGUOUS]) {",
        1,
    ),
    ("vocabulary: 'does not exist' dropped", "does not (?:yet )?exist|", "", 1),
    ("vocabulary: 'node exists' dropped", "|node exists", "", 1),
    ("vocabulary: 'not a corpus node' dropped", "not (?:yet )?a corpus node|", "", 1),
    ("vocabulary: 'is absent from the corpus' dropped", "|is absent from the corpus", "", 1),
    ("vocabulary: deferral phrasing dropped ('candidate for a future node')", "|candidate (?:for a )?future[^.;]{0,40}node", "", 1),
    ("vocabulary: '(no) node yet' shorthand dropped", "|no node yet", "", 1),
    ("vocabulary: 'nodified' verb form dropped", "|(?:not|neither) nodified", "", 1),
    ("vocabulary: 'neither' arm of the nodified form dropped", "(?:not|neither) nodified", "not nodified", 1),
    ("vocabulary: founder-edge lane blinded entirely", "/no founder edge|without a founder edge/gi", "/(?!)/gi", 1),
    ("vocabulary: 'neither X nor Y' family blinded", "/neither[^;]{0,120}?\\bnor\\b[^;]{0,120}?(?:is|are) (?:a )?corpus nodes?/gi", "/(?!)/gi", 1),
    ("neither-nor: span excludes periods again (breaks on 'J. Presper')", "[^;]{0,120}?(?:is|are) (?:a )?corpus nodes?", "[^.;]{0,120}?(?:is|are) (?:a )?corpus nodes?", 1),
    ("suppression: resolution window starts at phrase START again", "resolvedInline(live, at + span.length, subject)", "resolvedInline(live, at, subject)", 1),
    ("vocabulary: 'without a founder edge' dropped", "|without a founder edge", "", 1),
    (
        "vocabulary: adjudication lane blinded entirely",
        "/has not been adjudicated|one edge short|is left for a later wave|left for a later wave/gi",
        "/(?!)/gi",
        1,
    ),
    ("vocabulary: 'one edge short' dropped", "|one edge short", "", 1),
    ("vocabulary: 'has not been adjudicated' dropped", "has not been adjudicated|", "", 1),
    # --- attribution windows, each measured against the real corpus ----------
    ("window: ABSENCE_LOOKBEHIND widened 40 -> 200", "const ABSENCE_LOOKBEHIND = 40;", "const ABSENCE_LOOKBEHIND = 200;", 1),
    ("window: ADJUDICATION_LOOKBEHIND narrowed 200 -> 40", "const ADJUDICATION_LOOKBEHIND = 200;", "const ADJUDICATION_LOOKBEHIND = 40;", 1),
    ("window: LABEL_LOOKBEHIND narrowed 120 -> 10", "const LABEL_LOOKBEHIND = 120;", "const LABEL_LOOKBEHIND = 10;", 1),
    # --- attribution direction: the (118) first-version bug ------------------
    (
        "attribution: label lane scans FORWARD ((118) first-version bug)",
        "const prefix = live.slice(Math.max(0, at - LABEL_LOOKBEHIND), at);",
        "const prefix = live.slice(at, at + LABEL_LOOKBEHIND);",
        1,
    ),
    (
        "attribution: shortest label wins instead of longest",
        "if (!best || label.length > best.label.length) best = { label, nodeId };",
        "if (!best || label.length < best.label.length) best = { label, nodeId };",
        1,
    ),
    (
        "attribution: explicit lane takes the FIRST id in window, not the nearest",
        "return found ? found[found.length - 1] : undefined;",
        "return found ? found[0] : undefined;",
        1,
    ),
    # --- suppression ---------------------------------------------------------
    ("suppression: refresh-stamp tail treated as live prose", "return at === -1 ? note : note.slice(0, at);", "return note;", 1),
    ("suppression: inline resolution disabled", "return after.includes(subject);", "return false;", 1),
    ("suppression: inline resolution ignores the subject", "return after.includes(subject);", "return true;", 1),
    ("suppression: resolution lookahead shrunk 320 -> 5", "const RESOLUTION_LOOKAHEAD = 320;", "const RESOLUTION_LOOKAHEAD = 5;", 1),
    # --- existence gates -----------------------------------------------------
    ("gate: explicit lane fires without checking the node exists", "if (!id || !nodeIds.has(id)) continue;", "if (!id) continue;", 1),
    ("gate: label lane fires without checking the node exists", "if (!best || !nodeIds.has(best.nodeId)) continue;", "if (!best) continue;", 1),
    ("gate: an edge is allowed to close its own gap sentence", "if (!closedBy || closedBy === e.id) continue;", "if (!closedBy) continue;", 1),
    # --- parallel-leg resolution (found by a fixture, not by inspection) -----
    (
        "parallel leg: source-sharing shape dropped (Principia case)",
        "pairs.get(`${e.source}|${id}`) ??\n        pairs.get(`${id}|${e.source}`)",
        "undefined",
        1,
    ),
    (
        "parallel leg: target-sharing shape dropped (founder case)",
        "pairs.get(`${id}|${e.target}`) ??\n        pairs.get(`${e.target}|${id}`) ??",
        "",
        1,
    ),
    # --- dedupe --------------------------------------------------------------
    ("dedupe: key collapses the two closure kinds", "const key = `${g.edgeId}|${g.nodeId}|${g.kind}`;", "const key = `${g.edgeId}|${g.nodeId}`;", 1),
]


def replace_nth(text, needle, repl, n):
    idx = -1
    for _ in range(n):
        idx = text.find(needle, idx + 1)
        if idx == -1:
            return None
    return text[:idx] + repl + text[idx + len(needle):]


def run_fixtures():
    p = subprocess.run(
        ["npx", "tsx", "scripts/gap-fixtures.ts"], cwd=REPO, capture_output=True, text=True
    )
    return p.returncode, p.stdout + p.stderr


original = open(TARGET).read()


def restore():
    with open(TARGET, "w") as fh:
        fh.write(original)


atexit.register(restore)

rc, out = run_fixtures()
if rc != 0:
    print("BASELINE FAILED — aborting sweep")
    print(out[-2000:])
    sys.exit(1)
print(f"baseline: clean ({out.strip().splitlines()[-1]})\n")

survived, caught, unapplied = [], [], []

for name, needle, repl, n in MUTATIONS:
    mutated = replace_nth(original, needle, repl, n)
    if mutated is None or mutated == original:
        unapplied.append(name)
        print(f"  ?? NOT APPLIED  {name}")
        continue
    with open(TARGET, "w") as fh:
        fh.write(mutated)
    try:
        rc, out = run_fixtures()
    finally:
        restore()
    fixture_lines = [
        l.strip() for l in out.splitlines() if l.strip().startswith("✗") and "fixtures:" not in l
    ]
    if rc == 0:
        survived.append(name)
        print(f"  SURVIVED  {name}")
    else:
        tag = "caught" if fixture_lines else "CRASH!"
        caught.append((name, fixture_lines))
        print(f"  {tag}    {name}   [{len(fixture_lines)} fixture(s)]")

applied = len(MUTATIONS) - len(unapplied)
print(
    f"\n=== mutation score: caught {len(caught)}/{applied} applied "
    f"(survived {len(survived)}, not-applied {len(unapplied)}) ==="
)
if survived:
    print("\nBLIND SPOTS (mutation survived — no fixture covers it):")
    for s in survived:
        print(f"  - {s}")
if unapplied:
    print("\nNOT APPLIED (needle did not match — sweep bug, not a harness result):")
    for u in unapplied:
        print(f"  - {u}")

# Compare against the in-memory copy, never against git: git also reports the
# maintainer's own uncommitted edits, and a check that cries wolf gets ignored.
print(f"\ntarget file after sweep: {'as found' if open(TARGET).read() == original else 'RESIDUE LEFT — restore failed'}")
