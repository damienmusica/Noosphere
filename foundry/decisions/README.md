# foundry/decisions — promotion decision files

One committed JSON file per batch: the machine-readable record of that batch's
QC outcome (`src/schema/foundry-decision.ts`), and the input to the entire
deterministic toolchain — see `docs/data-foundry.md` §15 for the full spec and
§15.3 for the command flow.

- **These files are the audit trail.** Every verdict records the URLs QC read,
  when it read them, and their permanence anchors; every reviewed outcome
  records the ladder that sanctioned it. Bulk re-audit replays them. Treat
  them as append-only history once merged.
- **Re-audit replay recipe (measured, 2026-07-02 inspection):** replay decision
  files in chronological order against the `/data` state of the commit *before*
  the first replayed batch (`git checkout <commit> -- data/`), using the
  current toolchain; the inspection reproduced HEAD byte-identically this way.
- `npm run foundry:apply-batch -- foundry/decisions/<batch>.json` is the only
  sanctioned write path from a decision to `/data`.
- The generated report skeleton (`npm run foundry:report -- ... --write`)
  lands next to the decision as `<batch>.report.md`; copy or link it into the
  batch's `foundry/proposals/<batch>/` record as usual.
