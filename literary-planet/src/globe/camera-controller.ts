import * as THREE from "three";
import type { OrbitControls } from "three/addons/controls/OrbitControls.js";

/**
 * Camera ownership as an explicit state machine (7th review PR1). The rules
 * this module exists to enforce:
 *
 * - Programmatic moves (focus, mode transition) are ALWAYS cancellable: the
 *   first pointerdown/wheel on the canvas kills the animation inside the same
 *   frame and the user's gesture proceeds from the current pose — no snap,
 *   no fight, no dead input.
 * - Focus duration scales with travel (450–650ms), never a fixed 850ms.
 * - Escape restores where you came from: pose bookmarks are pushed when the
 *   exploration state deepens (planet→author→work) and popped on the way out.
 * - A side panel must not bury the selection: safe-area framing shifts the
 *   projection (setViewOffset) so the world center lands in the uncovered
 *   viewport. Orbit mechanics never see the shift — no wobble, no drift.
 * - zoom-to-cursor (OrbitControls r167+) is on; the orbit target it drifts
 *   is eased back to the planet core at overview heights.
 */

export type CameraStateKind = "idle" | "gesture" | "focus" | "transition";

export const FOCUS_MIN_MS = 450;
export const FOCUS_MAX_MS = 650;

/** travel-scaled focus duration: short hops snap, half-globe swings breathe */
export function focusDuration(
  angleRad: number,
  distDelta: number,
  distSpan: number
): number {
  const a = Math.min(1, Math.max(0, angleRad) / Math.PI);
  const d = distSpan > 0 ? Math.min(1, Math.abs(distDelta) / distSpan) : 0;
  return Math.round(FOCUS_MIN_MS + (FOCUS_MAX_MS - FOCUS_MIN_MS) * Math.max(a, d));
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export interface CameraPose {
  dir: [number, number, number];
  dist: number;
}

interface Anim {
  fromDir: THREE.Vector3;
  toDir: THREE.Vector3;
  fromDist: number;
  toDist: number;
  fromTarget: THREE.Vector3;
  start: number;
  dur: number;
  kind: "focus" | "transition";
}

export interface CameraControllerOpts {
  minDist: number;
  maxDist: number;
  /** above this camera distance the zoom-to-cursor target eases back to the core */
  recenterAbove: number;
  reducedMotion: () => boolean;
  log: (type: string, data?: Record<string, unknown>) => void;
}

export class CameraController {
  private anim: Anim | null = null;
  private gestureActive = false;
  private bookmarks = new Map<string, CameraPose>();
  private insets = { right: 0, bottom: 0 };
  private shownInsets = { right: 0, bottom: 0 };
  private offsetActive = false;
  private detach: Array<() => void> = [];

  constructor(
    private camera: THREE.PerspectiveCamera,
    private controls: OrbitControls,
    private dom: HTMLElement,
    private opts: CameraControllerOpts
  ) {
    // capture phase: cancellation must run BEFORE OrbitControls' own handlers
    // see this same event, so the gesture continues from the adopted pose
    const onDown = (): void => {
      this.gestureActive = true;
      if (this.anim) this.cancel("pointer");
    };
    const onUp = (): void => {
      this.gestureActive = false;
    };
    const onWheel = (): void => {
      if (this.anim) this.cancel("wheel");
    };
    dom.addEventListener("pointerdown", onDown, { capture: true });
    window.addEventListener("pointerup", onUp, { capture: true });
    dom.addEventListener("wheel", onWheel, { capture: true, passive: true });
    this.detach.push(
      () => dom.removeEventListener("pointerdown", onDown, { capture: true }),
      () => window.removeEventListener("pointerup", onUp, { capture: true }),
      () => dom.removeEventListener("wheel", onWheel, { capture: true })
    );
    controls.zoomToCursor = true;
  }

  stateKind(): CameraStateKind {
    if (this.anim) return this.anim.kind;
    return this.gestureActive ? "gesture" : "idle";
  }

  animating(): boolean {
    return this.anim !== null;
  }

  /** true while the safe-area projection shift is still easing */
  offsetSettling(): boolean {
    return (
      Math.abs(this.shownInsets.right - this.insets.right) > 0.5 ||
      Math.abs(this.shownInsets.bottom - this.insets.bottom) > 0.5
    );
  }

  pose(): CameraPose {
    const n = this.camera.position.clone().normalize();
    return { dir: [n.x, n.y, n.z], dist: this.camera.position.length() };
  }

  /** first push wins: author→author reselects keep the original planet pose */
  pushBookmark(tag: string): void {
    if (!this.bookmarks.has(tag)) this.bookmarks.set(tag, this.pose());
  }

  restoreBookmark(tag: string): boolean {
    const p = this.bookmarks.get(tag);
    if (!p) return false;
    this.bookmarks.delete(tag);
    // no-op flight guard: if the camera never left, don't animate to itself
    const dir = new THREE.Vector3(p.dir[0], p.dir[1], p.dir[2]);
    const cur = this.camera.position.clone().normalize();
    if (cur.angleTo(dir) < 0.01 && Math.abs(this.camera.position.length() - p.dist) < 1) {
      return false;
    }
    this.focusTo(dir, p.dist, { tag: `restore:${tag}` });
    return true;
  }

  clearBookmarks(): void {
    this.bookmarks.clear();
  }

  focusTo(
    dir: THREE.Vector3,
    dist: number,
    o?: { kind?: "focus" | "transition"; tag?: string }
  ): void {
    const toDir = dir.clone().normalize();
    if (this.opts.reducedMotion()) {
      this.controls.target.set(0, 0, 0);
      this.camera.position.copy(toDir).multiplyScalar(dist);
      this.camera.lookAt(0, 0, 0);
      this.anim = null;
      return;
    }
    // flush any damping tail so a leftover flick can't drift the pose after
    // the animation ends (the classic disable-update-restore trick)
    const hadDamping = this.controls.enableDamping;
    this.controls.enableDamping = false;
    this.controls.update();
    this.controls.enableDamping = hadDamping;
    // start pose measured relative to the (possibly drifted) orbit target so
    // k=0 reproduces the current frame exactly; the target lerps home to the
    // core in update(), so k=1 lands on the canonical origin-centered pose
    const fromOffset = this.camera.position.clone().sub(this.controls.target);
    const fromDist = fromOffset.length();
    const fromDir = fromOffset.normalize();
    const dur = focusDuration(
      fromDir.angleTo(toDir),
      dist - fromDist,
      this.opts.maxDist - this.opts.minDist
    );
    this.anim = {
      fromDir,
      toDir,
      fromDist,
      toDist: dist,
      fromTarget: this.controls.target.clone(),
      start: performance.now(),
      dur,
      kind: o?.kind ?? "focus"
    };
    this.opts.log("camera-anim-start", {
      toDist: Math.round(dist),
      dur,
      kind: this.anim.kind,
      ...(o?.tag ? { tag: o.tag } : {})
    });
  }

  /** adopt the current interpolated pose and hand control back to the user */
  cancel(trigger: string): void {
    if (!this.anim) return;
    this.anim = null;
    this.opts.log("camera-cancelled", {
      trigger,
      dist: Math.round(this.camera.position.length())
    });
  }

  /**
   * viewport insets covered by UI panels (CSS px). The projection is shifted
   * so the world center sits at the center of the uncovered area.
   */
  setSafeInsets(insets: { right?: number; bottom?: number }): void {
    this.insets = {
      right: Math.max(0, insets.right ?? 0),
      bottom: Math.max(0, insets.bottom ?? 0)
    };
    if (this.opts.reducedMotion()) this.shownInsets = { ...this.insets };
  }

  private updateViewOffset(): void {
    const k = this.opts.reducedMotion() ? 1 : 0.12; // ≈300ms ease at 60fps
    const sx = this.shownInsets.right + (this.insets.right - this.shownInsets.right) * k;
    const sy = this.shownInsets.bottom + (this.insets.bottom - this.shownInsets.bottom) * k;
    this.shownInsets = { right: sx, bottom: sy };
    if (sx < 0.5 && sy < 0.5) {
      if (this.offsetActive) {
        this.camera.clearViewOffset();
        this.offsetActive = false;
      }
      return;
    }
    const w = this.dom.clientWidth;
    const h = Math.max(1, this.dom.clientHeight);
    // shifting the rendered sub-rect right/down moves the content left/up:
    // the point aimed at the true center lands at the safe-area center
    this.camera.setViewOffset(w, h, sx / 2, sy / 2, w, h);
    this.offsetActive = true;
  }

  update(now: number): void {
    this.updateViewOffset();
    const a = this.anim;
    if (a) {
      const t = a.dur === 0 ? 1 : Math.min(1, (now - a.start) / a.dur);
      const k = easeInOut(t);
      const dir = a.fromDir.clone().lerp(a.toDir, k).normalize();
      const dist = a.fromDist + (a.toDist - a.fromDist) * k;
      this.controls.target.copy(a.fromTarget).multiplyScalar(1 - k);
      this.camera.position.copy(dir.multiplyScalar(dist)).add(this.controls.target);
      this.camera.lookAt(this.controls.target);
      if (t >= 1) {
        this.anim = null;
        this.opts.log("camera-anim-end", {
          dist: Math.round(this.camera.position.length())
        });
      }
      return;
    }
    this.controls.update();
    const dist = this.camera.position.length();
    // zoom-to-cursor drifts the orbit target off the core; at overview
    // heights ease it home so the planet stays the pivot
    if (dist > this.opts.recenterAbove && this.controls.target.lengthSq() > 1e-4) {
      this.controls.target.multiplyScalar(0.92);
      if (this.controls.target.lengthSq() < 0.01) this.controls.target.set(0, 0, 0);
    }
    // absolute floor to the planet surface (min/maxDistance are relative to
    // the possibly-drifted target, so they alone cannot guarantee this)
    if (dist < this.opts.minDist * 0.96) {
      this.camera.position.multiplyScalar((this.opts.minDist * 0.96) / dist);
    }
  }

  dispose(): void {
    for (const fn of this.detach) fn();
    this.detach = [];
    if (this.offsetActive) this.camera.clearViewOffset();
  }
}
