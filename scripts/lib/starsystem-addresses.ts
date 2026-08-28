/**
 * The star-system address registry.
 *
 * A star system opens only at a place this repository records. That place takes
 * one of two shapes, and enumerating BOTH is the point of this file:
 *
 *   1. **map-node** — a node ID in /data. Derivable, so it is generated rather
 *      than listed here; a map place with no declared address is reported as
 *      `unregistered`, which is honest: it exists, and nobody has claimed it.
 *   2. **boundary-ruling** — a place the map deliberately left empty. This shape
 *      is NOT derivable from /data, and leaving it out deletes the only star
 *      system that has actually opened.
 *
 * 《문학의 성계》 is shape 2. Decision (86) ruled literature outside the main
 * corpus and reserved the sister product there; the vault records that writing
 * its scope pointer into the charter is a stop-set item, deliberately
 * unexecuted pending CPO. So the corpus contains no node that says "literature
 * opened here" and no amount of /data reading will produce one.
 *
 * Why this lives in code and not in /data: decision (96) makes
 * `foundry:apply-batch` the sole write path into /data and forbids hand-editing,
 * while an address must sometimes name a vault decision number, which /data has
 * no schema for. This registry is not corpus data — it is the map of where
 * corpora may open. (CTO ruling 2026-08-28; reversible if the CPO would rather
 * it be validated data.)
 *
 * Adding a row here is not a promotion and grants nothing. It records that a
 * place has an address, never that anything is ready to be built there.
 */
import type { SeatAddress } from "./starsystem-readiness.ts";

export const STAR_SYSTEM_ADDRESSES: readonly SeatAddress[] = [
  {
    id: "literature",
    shape: "boundary-ruling",
    ref: "(86)",
    corpusPath: "literary-planet/",
    opened: true,
  },
];

/**
 * Seats a ruling bars from revival, as opposed to merely retiring.
 *
 * `domain:meta-knowledge` and `domain:practical-knowledge` are both deprecated,
 * but status alone excludes them for the wrong reason: un-deprecate either and a
 * status-keyed report readmits it. `docs/data-foundry.md` §14 rules that future
 * library-and-information-science coverage enters inside
 * computer-and-information-sciences and explicitly NOT by reviving
 * `domain:meta-knowledge`.
 */
export const REVIVAL_BARRED: ReadonlySet<string> = new Set([
  "meta_knowledge",
  "practical_knowledge",
]);
