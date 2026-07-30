#!/usr/bin/env python3
"""Mutation sweep: does the golden ladder fixture suite actually have teeth?

MAINTAINER TOOL, NOT CI. It patches `scripts/foundry/lib/ladders.ts` in place
and restores it from git after each case, so it must never run in a pipeline
alongside anything else that reads that file. Run it manually:

    python3 scripts/foundry/ladder-fixture-mutation-sweep.py

For each of 44 plausible transcription errors — a threshold moved by one, a
relation dropped from a registry, a safety net weakened, a boolean requirement
inverted — it patches, runs `ladder-fixtures.ts`, and records whether a fixture
caught it. A SURVIVED mutation is an uncovered rule: the fixture suite would
stay green while that ratified threshold silently drifted. Purely mechanical —
the verdict is the runner's exit code, not a judgment.

A mutation reported as CRASH! made the module throw at import instead of
failing a fixture. That is a defect in the mutation operator (it produced
type-unsafe code), not evidence of coverage — rewrite that case as a
realistic, type-safe mistranscription before trusting it.

Interrupt-safe: the mutation is reverted in a `finally`, and `restore` is also
registered with `atexit`, so a Ctrl-C or a kill still leaves the working tree
as it was found.

Measured 2026-07-30 (decision (114)): 44/44 caught, 0 survived, over 55
fixtures. History worth keeping: the first sweep was 29 mutations and scored
24/29, naming six blind spots; an independent adequacy audit of THIS SWEEP then
found fifteen further rules in checkLadders that no mutation targeted at all —
including decision (70) applied to an edge endpoint and the whole edge side of
the promotions branch. Both rounds are the same lesson: adding a fixture without
a mutation that fails when the fixture is removed is unmeasured coverage. Extend
MUTATIONS whenever you touch lib/ladders.ts.
"""
import atexit
import subprocess
import sys

REPO = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True, check=True).stdout.strip()
TARGET = f"{REPO}/scripts/foundry/lib/ladders.ts"

# (name, needle, replacement, occurrence_index_1based)
MUTATIONS = [
    # --- numeric thresholds, each independently -----------------------------
    ("threshold: node-promotion-v1.4  >=2 -> >=1", "independentSources(verdict) < 2", "independentSources(verdict) < 1", 1),
    ("threshold: living-person-v2     >=2 -> >=1", "independentSources(verdict) < 2", "independentSources(verdict) < 1", 2),
    ("threshold: auto-ladders         >=2 -> >=1", "independentSources(verdict) < 2", "independentSources(verdict) < 1", 3),
    ("threshold: structural tier      >=1 -> >=0", "independentSources(verdict) < 1", "independentSources(verdict) < 0", 1),
    ("threshold: clause 6             >=3 -> >=2", "independentSources(verdict) < 3", "independentSources(verdict) < 2", 1),
    # --- registry / map membership ------------------------------------------
    ("registry: CLASSIFICATION_RELATIONS drops part_of", '"part_of", "member_of"', '"member_of"', 1),
    ("registry: CLASSIFICATION_RELATIONS drops member_of", '"member_of", "adjacent_to"', '"adjacent_to"', 1),
    ("registry: CLASSIFICATION_RELATIONS drops adjacent_to", ', "adjacent_to"]', "]", 1),
    ("map: EDGE_AUTO_LADDER drops formalizes", 'formalizes: "formalizes-auto-54",', "", 1),
    ("map: EDGE_AUTO_LADDER drops founded_or_formalized", 'founded_or_formalized: "founded-or-formalized-auto-60",', "", 1),
    ("map: EDGE_AUTO_LADDER drops influenced", 'influenced: "a-relation-auto-68",', "", 1),
    ("map: EDGE_AUTO_LADDER drops critiques", 'critiques: "a-relation-auto-68",', "", 1),
    ("map: EDGE_AUTO_LADDER drops canonical_work ((88) replay)", 'canonical_work: "canonical-work-auto-88",', "", 1),
    ("registry: RATIFIED_TAXONOMY_PROVIDERS drops philpapers", '"philpapers",', "", 1),
    ("registry: RATIFIED_TAXONOMY_PROVIDERS admits unratified lcc", '"philpapers",', '"philpapers",\n  "lcc",', 1),
    # --- safety nets ---------------------------------------------------------
    ("safety: negative-verdict net accepts disputed", 'if (v.verdict !== "supported" && outcomeIds.has(v.subject_id))', 'if (v.verdict !== "supported" && v.verdict !== "disputed" && outcomeIds.has(v.subject_id))', 1),
    ("safety: reviewed-endpoint requirement dropped", 'endpoint.status !== "reviewed"', "false", 1),
    ("safety: editorial-evidence block dropped", 'edge.evidence_kind === "editorial"', "false", 1),
    ("safety: p570_absent_confirmed_at requirement dropped", "} else if (!anchored) {", "} else if (false) {", 1),
    ("safety: metadata flip may carry set_evidence", "if (p.set_external_ids || p.set_evidence) {", "if (p.set_external_ids) {", 1),
    ("safety: set_external_ids identity backing dropped", "if (!backed) {", "if (false) {", 1),
    ("safety: missing-sanction violation downgraded to advisory", "violation(id, `ends reviewed but has no ladder sanction`);", "advisory(id, `ends reviewed but has no ladder sanction`);", 1),
    ("safety: manual-cpo pointer requirement dropped", "if (!sanction.note?.trim()) {", "if (false) {", 1),
    ("safety: editorial-v2 translation sanction dropped", 'if (!s || s.ladder !== "editorial-v2") {', "if (false) {", 1),
    ("safety: promotions escape ladder scrutiny", 'if (p.to === "reviewed" && p.from !== "reviewed") out.push', "if (false) out.push", 1),
    # --- boolean verdict requirements ---------------------------------------
    ("boolean: direction_confirmed not required", "verdict.direction_confirmed !== true", "false", 1),
    ("boolean: identity_referent_verified not required", 'ladder !== "formalizes-auto-54" && verdict.identity_referent_verified !== true', "false", 1),
    ("boolean: v1 accepts unverified identity records", 'const wikidata = verifiedIds.find((r) => r.provider === "wikidata");', 'const wikidata = identities.find((r) => r.provider === "wikidata");', 1),
    ("boolean: v1.4 accepts unverified anchor records", "const alt = verifiedIds.find((r) => RATIFIED_TAXONOMY_PROVIDERS.has(r.provider));", "const alt = identities.find((r) => RATIFIED_TAXONOMY_PROVIDERS.has(r.provider));", 1),
    # --- rules added after the first sweep (2026-07-30 adequacy audit) ------
    ("(70) edge endpoint: in-batch living promotion check dropped", 'if (promotedNow && nodeSanction?.ladder !== "living-person-v2") {', "if (false) {", 1),
    ("(70) edge endpoint: floor advisory removed", "advisory(id, `living endpoint ${endpoint.id}: (70) floor applies", "advisory(id, `REMOVED (70) floor", 1),
    ("dangling-sanction advisory escalated to violation", "advisory(s.subject_id, `sanction (${s.ladder}) has no reviewed outcome in this decision`, s.ladder);", "violation(s.subject_id, `sanction (${s.ladder}) has no reviewed outcome in this decision`, s.ladder);", 1),
    ("v1 external_ids mismatch check dropped", 'node.external_ids["wikidata"] !== wikidata.external_id', "false", 1),
    ("v1.4 external_ids mismatch check dropped", "node.external_ids[alt.provider] !== alt.external_id", "false", 1),
    ("clause 6 loses its OWN classification whitelist copy", "!CLASSIFICATION_RELATIONS.has(edge.relation)", "false", 2),
    ("v1.4 living-person exclusion dropped", "if (node.is_living_person) {", "if (false) {", 2),
    ("living-person-v2 non-living guard dropped", "if (!node.is_living_person) {", "if (false) {", 1),
    ("missing post-apply NODE downgraded to advisory", "violation(id, `sanctioned node not found in post-apply state`, ladder);", "advisory(id, `sanctioned node not found in post-apply state`, ladder);", 1),
    ("missing post-apply EDGE downgraded to advisory", "violation(id, `sanctioned edge not found in post-apply state`, ladder);", "advisory(id, `sanctioned edge not found in post-apply state`, ladder);", 1),
    ("structural evidence_kind requirement dropped", 'if (edge.evidence_kind !== "externally_sourced") {', "if (false) {", 1),
    ("structural disputed-lane guard dropped", "if (edge.disputed) {", "if (false) {", 1),
    ("clause 6 disputed:true requirement dropped", "if (!edge.disputed) {", "if (false) {", 1),
    ("clause 6 minority-note requirement dropped", "if (!edge.note?.trim()) {", "if (false) {", 1),
    ("auto ladder no-verdict guard downgraded to advisory", "violation(id, `${ladder} requires a recorded Lane B verdict`, ladder);", "advisory(id, `${ladder} requires a recorded Lane B verdict`, ladder);", 1),
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
        ["npx", "tsx", "scripts/foundry/ladder-fixtures.ts"],
        cwd=REPO, capture_output=True, text=True,
    )
    return p.returncode, p.stdout + p.stderr


def restore():
    subprocess.run(["git", "checkout", "--", "scripts/foundry/lib/ladders.ts"], cwd=REPO, check=True)


original = open(TARGET).read()

# Interrupt safety: any exit path — Ctrl-C, an exception, a kill from the parent
# harness — must leave the working tree as it was found. Without this, an
# interrupted sweep silently leaves lib/ladders.ts mutated and the NEXT command
# to read it (ladder-check, apply-batch, CI) runs against injected code.
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
    open(TARGET, "w").write(mutated)
    try:
        rc, out = run_fixtures()
    finally:
        restore()
    fixture_lines = [l.strip() for l in out.splitlines() if l.strip().startswith("\u2717") and "fixtures:" not in l]
    if rc == 0:
        survived.append(name)
        print(f"  SURVIVED  {name}")
    else:
        caught.append((name, fixture_lines))
        tag = "caught" if fixture_lines else "CRASH!"
        print(f"  {tag}    {name}   [{len(fixture_lines)} fixture(s)]")

print(f"\n=== mutation score: caught {len(caught)}/{len(MUTATIONS) - len(unapplied)} applied "
      f"(survived {len(survived)}, not-applied {len(unapplied)}) ===")
if survived:
    print("\nBLIND SPOTS (mutation survived — no fixture covers it):")
    for s in survived:
        print(f"  - {s}")
if unapplied:
    print("\nNOT APPLIED (needle did not match — sweep bug, not a harness result):")
    for u in unapplied:
        print(f"  - {u}")

# final cleanliness check
p = subprocess.run(["git", "status", "--short"], cwd=REPO, capture_output=True, text=True)
print(f"\ngit status after sweep: {'CLEAN' if not p.stdout.strip() else 'DIRTY -> ' + p.stdout}")
