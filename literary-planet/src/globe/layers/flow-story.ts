import * as THREE from "three";
import type { Relation } from "../../types.ts";
import { RELATION_DEFS } from "../../types.ts";
import { RELATION_COLORS } from "../../theme.ts";
import { arcPoints, type Vec3 } from "../../lib/sphere.ts";

/**
 * FlowStoryLayer (7th review PR2) — the relation narrative with a lifecycle
 * of its own. The 6th-review state machine (dim → incoming staggered → the
 * center's IMPACT ripple → outgoing in three waves → one pulse per receiver
 * → ambient loop) is unchanged; what this extraction fixes is WHO owns the
 * clock:
 *
 * - The story key is (selection, coordinate mode, replay token). Camera
 *   moves, LOD switches, panel toggles and geometry rebuilds NEVER touch the
 *   clock — the 7th review caught rebuildEdges() restarting the story 413ms
 *   into every selection because the focus flight crossed an LOD boundary.
 * - When the relation SET changes under the same key (year commit, filter),
 *   the story does not restart: removed sparks fade out over 150ms, new
 *   sparks join the ambient loop at the current phase (diff, not reset).
 * - A full restart happens only on selection/mode change or an explicit
 *   replay request (the token).
 *
 * Timing is per-item absolute (bornAt), not layer-global, so kept items keep
 * their schedule across diffs by construction.
 */

const STORY_DUR = 620;
const IN_BASE = 180;
const IN_STAGGER = 55;
const OUT_BASE = 1050;
const WAVE_GAP = 450;
const RECEIVER_PULSE_MS = 620;
const IMPACT_PULSE_MS = 750;
const FADE_OUT_MS = 150;

interface FlowItem {
  relId: string;
  pts: Vec3[];
  /** ambient loop traversal duration in ms */
  dur: number;
  phase: number;
  /** absolute time this spark appears (story schedule or diff join) */
  bornAt: number;
  /** the node this spark flows INTO — arrival fires the receiver's pulse */
  endId: string;
  kind: "incoming" | "outgoing" | "dialogue";
  color: THREE.Color;
  /** first lap runs the story timeline (single fast pass, then ambient) */
  story: boolean;
  ambientBase: number;
  prevT: number;
  arrived: boolean;
  /** set when the relation left the set — fade to nothing by this time */
  dieAt: number;
}

interface PulseSlot {
  sprite: THREE.Sprite;
  mat: THREE.SpriteMaterial;
  start: number;
  dur: number;
  node: string;
  kind: string;
}

interface Animatable {
  r: Relation;
  pts: Vec3[];
  reversed: Vec3[] | null;
  incoming: boolean;
  dialogue: boolean;
  direction: string;
}

export interface FlowStoryDeps {
  scene: THREE.Scene;
  glowTexture: THREE.Texture;
  /** spark arcs fly just above the surface */
  arcRadius: number;
  arcSegments: number;
  log(type: string, data?: Record<string, unknown>): void;
  trackTexture(t: THREE.Texture): void;
  reducedMotion(): boolean;
}

export interface StoryInput {
  selectedId: string | null;
  mode: string;
  replayToken: number;
  relations: Relation[];
  positions: Map<string, Vec3>;
}

export class FlowStoryLayer {
  private items: FlowItem[] = [];
  private points: THREE.Points | null = null;
  private pulsePool: PulseSlot[] = [];
  private pulseSeen = new Set<string>();
  private storyKey: string | null = null;
  private relIds = new Set<string>();
  private selectedId: string | null = null;
  private ringTexture: THREE.Texture;
  private flowTexture: THREE.Texture;
  private visible = true;
  /** full story (re)starts — the QA restart-thrash metric */
  storyBuilds = 0;
  /** in-place relation-set diffs that preserved the clock */
  storyDiffs = 0;

  constructor(private deps: FlowStoryDeps) {
    this.ringTexture = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      g.strokeStyle = "rgba(255,255,255,1)";
      g.lineWidth = 5;
      g.beginPath();
      g.arc(32, 32, 24, 0, Math.PI * 2);
      g.stroke();
      const tex = new THREE.CanvasTexture(c);
      deps.trackTexture(tex);
      return tex;
    })();
    this.flowTexture = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 32;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.45, "rgba(255,255,255,0.85)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 32, 32);
      const tex = new THREE.CanvasTexture(c);
      deps.trackTexture(tex);
      return tex;
    })();
  }

  /**
   * Reconcile the story with the wanted state. Same key + same relation set
   * → nothing happens (this is what lets LOD/camera rebuilds call through
   * harmlessly). Same key + different set → diff. New key → full story.
   */
  setStory(input: StoryInput): void {
    const { selectedId, relations } = input;
    if (!selectedId || this.deps.reducedMotion()) {
      this.clear();
      return;
    }
    const key = `${selectedId}|${input.mode}|${input.replayToken}`;
    const wantedIds = new Set(relations.map((r) => r.id));
    if (key === this.storyKey) {
      if (
        wantedIds.size === this.relIds.size &&
        [...wantedIds].every((id) => this.relIds.has(id))
      ) {
        return; // geometry callers rebuild lines; the story is not theirs
      }
      this.diff(input, wantedIds);
      return;
    }
    this.fullBuild(input, key, wantedIds);
  }

  setVisible(v: boolean): void {
    this.visible = v;
    if (this.points) this.points.visible = v;
    if (!v) for (const p of this.pulsePool) p.sprite.visible = p.start >= 0 && v;
  }

  clear(): void {
    if (this.points) {
      this.deps.scene.remove(this.points);
      this.points.geometry.dispose();
      (this.points.material as THREE.Material).dispose();
      this.points = null;
    }
    if (this.items.length > 0) this.deps.log("flows-cleared", { sparks: this.items.length });
    this.items = [];
    this.relIds = new Set();
    this.storyKey = null;
    this.selectedId = null;
    this.clearPulsePool();
    this.pulseSeen.clear();
  }

  // --- build paths ----------------------------------------------------------

  private animatables(input: StoryInput): Animatable[] {
    const out: Animatable[] = [];
    for (const r of input.relations) {
      const a = input.positions.get(r.sourceId);
      const b = input.positions.get(r.targetId);
      if (!a || !b) continue;
      const def = RELATION_DEFS.find((d) => d.id === r.type);
      if (!def || def.dashed) continue; // affinity/contrast: nothing to animate
      const pts = arcPoints(a, b, this.deps.arcSegments, this.deps.arcRadius);
      out.push({
        r,
        pts,
        reversed: def.direction === "bidirectional" ? [...pts].reverse() : null,
        incoming: r.targetId === input.selectedId,
        dialogue: def.direction === "bidirectional",
        direction: def.direction
      });
    }
    return out;
  }

  private itemFor(
    relId: string,
    pts: Vec3[],
    dur: number,
    phase: number,
    bornAt: number,
    endId: string,
    kind: FlowItem["kind"],
    color: THREE.Color,
    story: boolean
  ): FlowItem {
    return {
      relId,
      pts,
      dur,
      phase,
      bornAt,
      endId,
      kind,
      color,
      story,
      ambientBase: story ? 0 : bornAt,
      prevT: -1,
      arrived: false,
      dieAt: 0
    };
  }

  private fullBuild(input: StoryInput, key: string, wantedIds: Set<string>): void {
    this.clear();
    this.storyKey = key;
    this.relIds = wantedIds;
    this.selectedId = input.selectedId;
    const anims = this.animatables(input);
    if (anims.length === 0) return;

    const now = performance.now();
    const items: FlowItem[] = [];
    const animated: Array<Record<string, string>> = [];
    const inbound = anims.filter((x) => x.incoming).sort((x, y) => y.r.weight - x.r.weight);
    const outbound = anims.filter((x) => !x.incoming).sort((x, y) => y.r.weight - x.r.weight);
    const waveSize = Math.max(1, Math.ceil(outbound.length / 3));

    for (const list of [inbound, outbound]) {
      list.forEach((x, i) => {
        const delay =
          list === inbound
            ? IN_BASE + i * IN_STAGGER
            : OUT_BASE + Math.floor(i / waveSize) * WAVE_GAP + (i % waveSize) * 37;
        const dur = 3200 - x.r.weight * 900;
        const color = new THREE.Color(RELATION_COLORS[x.r.type]);
        const kind: FlowItem["kind"] = x.dialogue
          ? "dialogue"
          : list === inbound
            ? "incoming"
            : "outgoing";
        animated.push({
          id: x.r.id,
          from: x.r.sourceId,
          to: x.r.targetId,
          type: x.r.type,
          direction: x.direction
        });
        items.push(this.itemFor(x.r.id, x.pts, dur, 0, now + delay, x.r.targetId, kind, color, true));
        items.push(
          this.itemFor(x.r.id, x.pts, dur, 0.5, now + delay + STORY_DUR + 300, x.r.targetId, kind, color, false)
        );
        if (x.reversed) {
          // the dialogue's answer departs after the story lap arrives
          items.push(
            this.itemFor(
              x.r.id,
              x.reversed,
              dur,
              0,
              now + delay + STORY_DUR + 500,
              x.r.sourceId,
              "dialogue",
              color,
              false
            )
          );
        }
      });
    }

    // one pool slot per node that will ever pulse — sized exactly, so
    // completion-before-reuse holds by construction
    this.allocPulsePool(new Set(items.map((f) => f.endId)).size);
    this.items = items;
    this.rebuildPoints();
    this.storyBuilds++;
    this.deps.log("flows-built", {
      sparks: items.length,
      relations: animated,
      staging: {
        incomingBase: IN_BASE,
        incomingStagger: IN_STAGGER,
        outgoingBase: OUT_BASE,
        waveGap: WAVE_GAP,
        storyDur: STORY_DUR,
        incoming: inbound.length,
        outgoing: outbound.length
      }
    });
  }

  /** relation set changed under the same story: fade removed, join added */
  private diff(input: StoryInput, wantedIds: Set<string>): void {
    const now = performance.now();
    // drop corpses from the previous diff, mark the newly removed
    this.items = this.items.filter((f) => f.dieAt === 0 || now < f.dieAt + 100);
    let removed = 0;
    for (const f of this.items) {
      if (!wantedIds.has(f.relId) && f.dieAt === 0) {
        f.dieAt = now + FADE_OUT_MS;
        removed++;
      }
    }
    const existing = new Set(this.items.filter((f) => f.dieAt === 0).map((f) => f.relId));
    const freshRels = input.relations.filter((r) => !existing.has(r.id));
    const anims = this.animatables({ ...input, relations: freshRels });
    let added = 0;
    for (const x of anims) {
      const dur = 3200 - x.r.weight * 900;
      const color = new THREE.Color(RELATION_COLORS[x.r.type]);
      const kind: FlowItem["kind"] = x.dialogue ? "dialogue" : x.incoming ? "incoming" : "outgoing";
      // joiners skip the story lap and enter the ambient loop at the current
      // phase — the review's contract: diff, never restart
      this.items.push(
        this.itemFor(x.r.id, x.pts, dur, 0, now + added * 40, x.r.targetId, kind, color, false)
      );
      this.items.push(
        this.itemFor(x.r.id, x.pts, dur, 0.5, now + added * 40, x.r.targetId, kind, color, false)
      );
      if (x.reversed) {
        this.items.push(
          this.itemFor(x.r.id, x.reversed, dur, 0, now + added * 40 + 500, x.r.sourceId, "dialogue", color, false)
        );
      }
      added++;
    }
    this.relIds = wantedIds;
    this.growPulsePool(new Set(this.items.filter((f) => f.dieAt === 0).map((f) => f.endId)).size);
    this.rebuildPoints();
    this.storyDiffs++;
    this.deps.log("flows-diff", { added, removed, kept: this.relIds.size - added });
  }

  private rebuildPoints(): void {
    if (this.points) {
      this.deps.scene.remove(this.points);
      this.points.geometry.dispose();
      (this.points.material as THREE.Material).dispose();
      this.points = null;
    }
    if (this.items.length === 0) return;
    const colors: number[] = [];
    for (const f of this.items) colors.push(f.color.r, f.color.g, f.color.b);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(this.items.length * 3, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 2.7,
      map: this.flowTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      sizeAttenuation: true
    });
    this.points = new THREE.Points(geom, mat);
    this.points.renderOrder = 5;
    this.points.frustumCulled = false;
    this.points.visible = this.visible;
    this.deps.scene.add(this.points);
  }

  // --- pulses ---------------------------------------------------------------

  private clearPulsePool(): void {
    for (const p of this.pulsePool) {
      this.deps.scene.remove(p.sprite);
      p.mat.dispose();
    }
    this.pulsePool = [];
  }

  private allocPulsePool(n: number): void {
    this.clearPulsePool();
    this.growPulsePool(n);
  }

  /** grow-only: a diff must never kill a pulse already in flight */
  private growPulsePool(n: number): void {
    while (this.pulsePool.length < n) {
      const mat = new THREE.SpriteMaterial({
        map: this.deps.glowTexture,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      sprite.visible = false;
      sprite.renderOrder = 7;
      this.deps.scene.add(sprite);
      this.pulsePool.push({ sprite, mat, start: -1, dur: RECEIVER_PULSE_MS, node: "", kind: "" });
    }
  }

  private firePulse(
    pos: Vec3,
    color: THREE.Color,
    now: number,
    node: string,
    kind: "impact" | "incoming" | "outgoing" | "dialogue"
  ): void {
    const slot = this.pulsePool.find((p) => p.start < 0);
    if (!slot) return; // sized exactly — unreachable while one-per-node holds
    slot.start = now;
    slot.node = node;
    slot.kind = kind;
    slot.dur = kind === "impact" ? IMPACT_PULSE_MS : RECEIVER_PULSE_MS;
    // the impact is a ring RIPPLE outside the selection reticle — a different
    // shape from the receiver glow, so the center's answer reads as an event
    slot.mat.map = kind === "impact" ? this.ringTexture : this.deps.glowTexture;
    slot.sprite.position.set(pos[0], pos[1], pos[2]);
    slot.mat.color.copy(color);
    slot.sprite.visible = this.visible;
    this.deps.log("pulse-start", { node, kind });
  }

  private flowArrival(f: FlowItem, now: number): void {
    if (this.pulseSeen.has(f.endId)) return;
    this.pulseSeen.add(f.endId);
    // the center's answer is the IMPACT ripple, whoever delivered it
    const kind = f.endId === this.selectedId ? "impact" : f.kind;
    this.firePulse(f.pts[f.pts.length - 1]!, f.color, now, f.endId, kind);
    this.deps.log("flow-arrival", { node: f.endId, kind: f.kind, order: this.pulseSeen.size });
  }

  // --- per-frame ------------------------------------------------------------

  update(now: number): void {
    this.updateSparks(now);
    this.updatePulses(now);
  }

  private updateSparks(now: number): void {
    if (!this.points || this.items.length === 0) return;
    const attr = this.points.geometry.getAttribute("position") as THREE.BufferAttribute;
    const colAttr = this.points.geometry.getAttribute("color") as THREE.BufferAttribute;
    let colorsDirty = false;
    for (let i = 0; i < this.items.length; i++) {
      const f = this.items[i]!;
      if (f.dieAt > 0) {
        // leaving the set: fade the spark's ink to space over 150ms
        const k = Math.min(1, Math.max(0, (f.dieAt - now) / FADE_OUT_MS));
        colAttr.setXYZ(i, f.color.r * k, f.color.g * k, f.color.b * k);
        colorsDirty = true;
        if (k <= 0) {
          attr.setXYZ(i, 0, 0, 0);
          continue;
        }
      }
      const local = now - f.bornAt;
      if (local < 0) {
        // parked at the globe's core until its stage begins — depth testing
        // hides it behind the surface
        attr.setXYZ(i, 0, 0, 0);
        continue;
      }
      let t: number;
      if (f.story) {
        // story lap: one scheduled pass — its landing IS the staged arrival
        t = Math.min(1, local / STORY_DUR);
        if (t >= 1) {
          if (!f.arrived) {
            f.arrived = true;
            this.flowArrival(f, now);
          }
          f.story = false;
          f.ambientBase = now;
          t = 0; // respawn at the source, joining the ambient loop
        }
      } else {
        const base = f.ambientBase > 0 ? f.ambientBase : f.bornAt;
        t = ((((now - base) / f.dur + f.phase) % 1) + 1) % 1;
        // ambient wraps still count as first arrival for late (phase .5) sparks
        if (f.prevT >= 0 && f.prevT > t + 0.5 && !f.arrived) {
          f.arrived = true;
          this.flowArrival(f, now);
        }
        f.prevT = t;
      }
      const x = t * (f.pts.length - 1);
      const i0 = Math.min(f.pts.length - 2, Math.floor(x));
      const k = x - i0;
      const p = f.pts[i0]!;
      const q = f.pts[i0 + 1]!;
      attr.setXYZ(i, p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, p[2] + (q[2] - p[2]) * k);
    }
    attr.needsUpdate = true;
    if (colorsDirty) colAttr.needsUpdate = true;
  }

  private updatePulses(now: number): void {
    for (const p of this.pulsePool) {
      if (p.start < 0) continue;
      const k = (now - p.start) / p.dur;
      if (k >= 1) {
        p.start = -1;
        p.sprite.visible = false;
        this.deps.log("pulse-end", { node: p.node, kind: p.kind });
        continue;
      }
      if (p.kind === "impact") {
        const size = 9 + 16 * k;
        p.sprite.scale.set(size, size, 1);
        p.mat.opacity = 0.85 * (1 - k);
      } else {
        const size = 6 + 11 * k;
        p.sprite.scale.set(size, size, 1);
        p.mat.opacity = 0.6 * (1 - k) * (1 - k);
      }
    }
  }

  // --- introspection --------------------------------------------------------

  activePulses(): number {
    return this.pulsePool.filter((p) => p.start >= 0).length;
  }

  metrics(): Record<string, unknown> {
    return {
      sparks: this.items.filter((f) => f.dieAt === 0).length,
      arrivals: this.pulseSeen.size,
      activePulses: this.activePulses(),
      storyBuilds: this.storyBuilds,
      storyDiffs: this.storyDiffs,
      storyKey: this.storyKey
    };
  }

  dispose(): void {
    this.clear();
    // ring/flow textures are registered with the renderer's disposables
  }
}
