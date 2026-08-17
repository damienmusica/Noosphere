// TemporalTerrainLayer (6th review PR2) — owns everything time-shaped about
// the terrain: demand-loading the tectonic keyframes (nothing is requested
// before timeline intent), painting plates in the worker, an LRU of at most
// three resident era plates, the deferred near plate, and the ready/loading
// status the renderer commits atomically. The renderer keeps only uniforms.

import * as THREE from "three";
import type { PeriodId, Territory } from "../../types.ts";
import type {
  PaintWorkerInit,
  PaintWorkerRequest,
  PaintWorkerResponse
} from "../terrain-paint.worker.ts";

export interface TemporalBracket {
  y0: number;
  y1: number;
  mix: number;
  texA: THREE.Texture;
  /** "atlas" = terminal bracket — blend toward the frozen v1 plate */
  texB: THREE.Texture | "atlas";
}

export type TemporalStatus = "idle" | "loading" | "ready" | "error";

interface Deps {
  territory: Territory;
  periodByAuthor: Record<string, PeriodId>;
  readingRank: Record<string, number>;
  workYears: Record<string, number>;
  movementIds: string[];
  unionMembers: Record<string, number[]>;
  timelineMax: number;
  anisotropy: number;
  regTexture(t: THREE.Texture): void;
  unregTexture(t: THREE.Texture): void;
  /** something became ready/unready — recommit uniforms + loading state */
  onChange(): void;
  /** the union stroke plate finished painting in the worker */
  onUnionPlate(tex: THREE.Texture): void;
}

const MAX_RESIDENT = 3;
const RELEASE_AFTER_MS = 10_000;
const NEAR_RELEASE_AFTER_MS = 60_000;

export class TemporalTerrainLayer {
  private worker: Worker | null = null;
  private deps: Deps;
  private years: number[] = [];
  private erasRequested = false;
  private erasError: string | null = null;
  private plates = new Map<number, { tex: THREE.Texture; lastUsed: number }>();
  private pendingYears = new Set<number>();
  private clock = 0;
  private releaseTimer: ReturnType<typeof setTimeout> | null = null;

  private nearTex: THREE.Texture | null = null;
  private nearPending = false;
  private nearReleaseTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  constructor(deps: Deps) {
    this.deps = deps;
  }

  private ensureWorker(): Worker {
    if (this.worker) return this.worker;
    this.worker = new Worker(new URL("../terrain-paint.worker.ts", import.meta.url), {
      type: "module"
    });
    const init: PaintWorkerInit = {
      kind: "init",
      territory: this.deps.territory,
      periodByAuthor: this.deps.periodByAuthor,
      readingRank: this.deps.readingRank,
      workYears: this.deps.workYears,
      movementIds: this.deps.movementIds,
      unionMembers: this.deps.unionMembers
    };
    this.worker.postMessage(init);
    this.worker.onmessage = (e: MessageEvent<PaintWorkerResponse>) => {
      if (this.disposed) return;
      const msg = e.data;
      if (msg.kind === "eras-ready") {
        this.years = msg.years;
        this.deps.onChange();
        return;
      }
      if (msg.kind === "eras-error") {
        // a broken eras file must be loud (data bug), and the atlas view
        // keeps working — the fader simply reports the error state
        this.erasError = msg.message;
        console.error(`territory eras failed to load: ${msg.message}`);
        this.deps.onChange();
        return;
      }
      if (msg.kind === "plate") {
        const tex = new THREE.Texture(msg.bitmap);
        tex.flipY = false; // the worker pre-flipped the bitmap
        tex.needsUpdate = true;
        this.deps.regTexture(tex);
        if (msg.plate === "union") {
          // stroke plate: index-encoded colors, no mips, wraps at the seam
          tex.magFilter = THREE.LinearFilter;
          tex.minFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.wrapS = THREE.RepeatWrapping;
          this.deps.onUnionPlate(tex);
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = this.deps.anisotropy;
        if (msg.plate === "era") {
          this.pendingYears.delete(msg.year);
          this.plates.set(msg.year, { tex, lastUsed: ++this.clock });
          this.evict();
        } else {
          this.nearPending = false;
          this.nearTex = tex;
        }
        this.deps.onChange();
      }
    };
    return this.worker;
  }

  private send(msg: PaintWorkerRequest): void {
    this.ensureWorker().postMessage(msg);
  }

  /** first timeline intent (slider focus/press, y= deep link, tour year) */
  requestEras(): void {
    if (this.erasRequested || this.disposed) return;
    this.erasRequested = true;
    this.send({ kind: "load-eras" });
  }

  private unionRequested = false;
  /** paint the union stroke plate off-thread (idle-scheduled by the renderer) */
  ensureUnionPaint(): void {
    if (this.unionRequested || this.disposed) return;
    this.unionRequested = true;
    this.send({ kind: "paint-union" });
  }

  status(): TemporalStatus {
    if (this.erasError) return "error";
    if (!this.erasRequested) return "idle";
    return this.years.length > 0 ? "ready" : "loading";
  }

  private bracketYears(year: number): { y0: number; y1: number | "atlas" | "same" } | null {
    const ys = this.years;
    if (ys.length === 0) return null;
    if (year <= ys[0]!) return { y0: ys[0]!, y1: "same" }; // pre-history: first plate alone
    let k = 0;
    while (k + 1 < ys.length && ys[k + 1]! <= year) k++;
    if (k === ys.length - 1) return { y0: ys[k]!, y1: "atlas" }; // terminal → frozen v1
    return { y0: ys[k]!, y1: ys[k + 1]! };
  }

  /**
   * Ask for the bracket serving `year`. Kicks worker paints for missing
   * plates and returns null until every needed plate is resident — the
   * renderer stays fully bypassed (atlas look) until then, then commits
   * lifecycle + plate + cities in one frame.
   */
  bracketFor(year: number, cell: number): TemporalBracket | null {
    if (this.disposed) return null;
    this.requestEras();
    if (this.releaseTimer) {
      clearTimeout(this.releaseTimer);
      this.releaseTimer = null;
    }
    const br = this.bracketYears(year);
    if (!br) return null;
    const need = typeof br.y1 === "number" ? [br.y0, br.y1] : [br.y0];
    let ready = true;
    for (const y of need) {
      const p = this.plates.get(y);
      if (p) {
        p.lastUsed = ++this.clock;
      } else {
        ready = false;
        if (!this.pendingYears.has(y)) {
          this.pendingYears.add(y);
          this.send({ kind: "paint-era", year: y, cell });
        }
      }
    }
    if (!ready) return null;
    const texA = this.plates.get(br.y0)!.tex;
    if (br.y1 === "same") {
      return { y0: br.y0, y1: br.y0, mix: 0, texA, texB: texA };
    }
    if (br.y1 === "atlas") {
      const span = this.deps.timelineMax - br.y0;
      const mix = span <= 0 ? 0 : Math.min(1, Math.max(0, (year - br.y0) / span));
      return { y0: br.y0, y1: this.deps.timelineMax, mix, texA, texB: "atlas" };
    }
    return {
      y0: br.y0,
      y1: br.y1,
      mix: Math.min(1, Math.max(0, (year - br.y0) / (br.y1 - br.y0))),
      texA,
      texB: this.plates.get(br.y1)!.tex
    };
  }

  private evict(): void {
    while (this.plates.size > MAX_RESIDENT) {
      let victim: number | null = null;
      let oldest = Infinity;
      for (const [year, p] of this.plates) {
        if (p.lastUsed < oldest) {
          oldest = p.lastUsed;
          victim = year;
        }
      }
      if (victim === null) return;
      const p = this.plates.get(victim)!;
      this.plates.delete(victim);
      this.deps.unregTexture(p.tex);
      p.tex.dispose();
    }
  }

  /** back at 전체 시기 — after a quiet spell the era plates are released */
  noteDisengaged(): void {
    if (this.plates.size === 0 || this.releaseTimer) return;
    this.releaseTimer = setTimeout(() => {
      this.releaseTimer = null;
      for (const [, p] of this.plates) {
        this.deps.unregTexture(p.tex);
        p.tex.dispose();
      }
      this.plates.clear();
      this.deps.onChange();
    }, RELEASE_AFTER_MS);
  }

  /** reading-distance atlas plate — painted on first near-LOD entry only */
  ensureNearPlate(cell: number): THREE.Texture | null {
    if (this.nearReleaseTimer) {
      clearTimeout(this.nearReleaseTimer);
      this.nearReleaseTimer = null;
    }
    if (this.nearTex) return this.nearTex;
    if (!this.nearPending && !this.disposed) {
      this.nearPending = true;
      this.send({ kind: "paint-atlas-near", cell });
    }
    return null;
  }

  nearPlate(): THREE.Texture | null {
    return this.nearTex;
  }

  /** long absence from reading distance releases the 8192px plate */
  noteAwayFromNear(): void {
    if (!this.nearTex || this.nearReleaseTimer) return;
    this.nearReleaseTimer = setTimeout(() => {
      this.nearReleaseTimer = null;
      if (!this.nearTex) return;
      this.deps.unregTexture(this.nearTex);
      this.nearTex.dispose();
      this.nearTex = null;
    }, NEAR_RELEASE_AFTER_MS);
  }

  metrics(): Record<string, unknown> {
    return {
      status: this.status(),
      residentPlates: [...this.plates.keys()].sort((a, b) => a - b),
      pending: [...this.pendingYears].sort((a, b) => a - b),
      nearPlateReady: this.nearTex !== null
    };
  }

  dispose(): void {
    this.disposed = true;
    if (this.releaseTimer) clearTimeout(this.releaseTimer);
    if (this.nearReleaseTimer) clearTimeout(this.nearReleaseTimer);
    for (const [, p] of this.plates) {
      this.deps.unregTexture(p.tex);
      p.tex.dispose();
    }
    this.plates.clear();
    if (this.nearTex) {
      this.deps.unregTexture(this.nearTex);
      this.nearTex.dispose();
      this.nearTex = null;
    }
    this.worker?.terminate();
    this.worker = null;
  }
}
