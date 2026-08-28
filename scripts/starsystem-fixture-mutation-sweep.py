#!/usr/bin/env python3
"""Mutation sweep: does the star-system fixture suite actually have teeth?

MAINTAINER TOOL, NOT CI. It patches `scripts/lib/starsystem-readiness.ts` in
place and restores it after each case. Run it manually:

    python3 scripts/starsystem-fixture-mutation-sweep.py

For each plausible way the seat report could quietly lose a rule — the resident
floor removed so empty seats score, attachment merged into peer so cataloguing
reads as a world, the second hop dropped so a resident's field disappears, the
generated rows removed so the registry can hide a seat — it patches, runs
`scripts/starsystem-fixtures.ts`, and records whether a fixture caught it. A
SURVIVED mutation is an uncovered rule: the suite would stay green while the
report silently stopped seeing that shape.

Why this file exists: the 2026-08-28 adversarial panel killed all eight density
dimensions proposed for this report, every one of them on a shape the metric
could not see. The surviving design is a set of restrictions — no ratios, no
ranking, no summing peer with attachment — and a restriction that nothing
enforces is a comment. This measures the enforcement.

**Restores from an in-memory copy, not from git** — git restore silently eats
uncommitted edits to its target (measured 2026-07-30, twice). Interrupt-safe:
the restore runs in a `finally` and is also registered with `atexit`.

DO NOT run this while another session is building in this tree: the sweep
rewrites a tracked file for the duration of each case.
"""
import atexit
import subprocess
import sys

REPO = subprocess.run(
    ["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True, check=True
).stdout.strip()
TARGET = f"{REPO}/scripts/lib/starsystem-readiness.ts"

# (name, needle, replacement, occurrence_index_1based)
MUTATIONS = [
    # --- the floor: the whole defence against 0/0 scoring greenest -----------
    ("floor: removed entirely (empty seats score)", "export const RESIDENT_FLOOR = 3;", "export const RESIDENT_FLOOR = 0;", 1),
    ("floor: suppression reason dropped (empty cell reads as zero)", "suppressed: belowFloor ? `residents=${residents.length} < floor ${RESIDENT_FLOOR}` : null,", "suppressed: null,", 1),
    ("floor: below-floor seats report ties anyway", "const ties = belowFloor ? null : tiesFor(ids);", "const ties = tiesFor(ids);", 1),
    # --- peer vs attachment: cataloguing must not read as a world -----------
    ("attachment: vocabulary emptied (all ties become peer)", '"canonical_work",\n  "founded_or_formalized",\n  "member_of",\n  "formalizes",', "", 1),
    ("attachment: canonical_work reclassified as peer", '"canonical_work",\n  "founded_or_formalized",', '"founded_or_formalized",', 1),
    ("attachment: founded_or_formalized reclassified as peer", '"founded_or_formalized",\n  "member_of",', '"member_of",', 1),
    ("attachment: counted into peer as well (double channel)", "attachment += 1;", "attachment += 1;\n        peer += 1;", 1),
    ("attachment: vocabulary counts attachment relations too", "peer += 1;\n        vocab.add(e.relation);", "peer += 1;\n        vocab.add(e.relation);\n      }\n      if (true) {\n        vocab.add(e.relation);", 1),
    # --- residency: one hop reports 'physics has no Einstein' in green ------
    ("residency: second hop removed (direct only)", "if (direct.size === 0) {", "if (false) {", 1),
    ("residency: indirect merged into direct", "if (reach.direct.size > 0) direct += 1;\n      else if (reach.indirect.size > 0) indirect += 1;\n      else unattached += 1;", "if (reach.direct.size > 0 || reach.indirect.size > 0) direct += 1;\n      else unattached += 1;", 1),
    ("residency: unattached silently dropped", "else unattached += 1;", "else direct += 0;", 1),
    # --- status filtering ----------------------------------------------------
    ("status: non-reviewed nodes counted as residents", 'if (n.status !== "reviewed") continue;', "", 1),
    ("status: deprecated edges create ties", 'const liveEdges = edges.filter((e) => e.status !== "deprecated");', "const liveEdges = [...edges];", 1),
    # --- addresses: the shape that carries the only open star system --------
    ("address: boundary-ruling refs always reported unresolved", "DECISION_REF_RE.test(a.ref)", "false", 1),
    ("address: unresolvable map refs reported as resolving", "a.shape === \"map-node\" ? byId.has(a.ref) : DECISION_REF_RE.test(a.ref)", "true", 1),
    ("address: generated rows removed (registry can hide a seat)", "for (const id of mapSeats) {", "for (const id of []) {", 1),
    ("address: revival bar never reported", "revivalBarred: revivalBarred.has(seat),", "revivalBarred: false,", 1),
    # --- residents with no seat ---------------------------------------------
    ("unseated: domain-less residents silently dropped", "unseated.push(n.id);\n      continue;", "continue;", 1),
    # --- map shape -----------------------------------------------------------
    ("map: orphan places not collected", "if (ps.length === 0) orphans.push(n.id);", "if (false) orphans.push(n.id);", 1),
    ("map: cross-listed places collapsed to one parent", "else if (ps.length > 1) crossListed.push({ id: n.id, parents: [...ps].sort() });", "", 1),
    ("map: deprecated part_of edges rebuild the tree", 'if (e.relation !== "part_of" || e.status === "deprecated") continue;', 'if (e.relation !== "part_of") continue;', 1),
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
        ["npx", "tsx", "scripts/starsystem-fixtures.ts"], cwd=REPO, capture_output=True, text=True
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
        l.strip() for l in out.splitlines() if l.strip().startswith("✗")
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

print(f"\ntarget file after sweep: {'as found' if open(TARGET).read() == original else 'RESIDUE LEFT — restore failed'}")
