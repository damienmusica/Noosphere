// Work towns as first-class scene entities (territory grammar v2.0, D5;
// 4th review P0-3; 7th review PR4). The printed marks stay on the plate —
// the selection raises REAL cities over them: low-poly woodcut building
// clusters with a footprint and a silhouette per role (capital = the
// readingOrder entry, city = ranked works, outpost = the rest), the curated
// reading order drawn as a dashed road between them. Face-shaded vertex
// colors carry the engraved look — no lights, no textures. One entity model
// still backs the 3D marker, the DOM label, and the URL.

import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { GLOBE, COLORS } from "../theme.ts";
import { gridToVec3 } from "../lib/territory-geometry.ts";
import { arcPoints, type Vec3 } from "../lib/sphere.ts";
import type { TerritoryGeometry, Work } from "../types.ts";

export interface CityEntity {
  workId: string;
  isEntry: boolean;
  /** curated reading rank (0 = entry) or null when outside the order */
  rank: number | null;
  position: THREE.Vector3;
  archetype: "capital" | "city" | "outpost";
  /** index within its archetype's InstancedMesh */
  instanceIdx: number;
}

const RING_INNER = 0.72;
const RING_OUTER = 1.0;
const HIT_RADIUS = 2.6; // ≈70 CSS px at reading distance — beats the 44px floor
const GROW_MS = 340;

/** one box of a building cluster, face-shaded by vertex color (top light,
 * flanks two-tone, base dark — the woodcut's fixed sun) */
function shadedBox(w: number, d: number, h: number, ox: number, oy: number): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, d, h);
  g.translate(ox, oy, h / 2);
  const n = g.getAttribute("normal") as THREE.BufferAttribute;
  const colors = new Float32Array(n.count * 3);
  const top = new THREE.Color("#d8c194");
  const sideA = new THREE.Color("#9a8259");
  const sideB = new THREE.Color("#6f5d40");
  const bottom = new THREE.Color("#4f4331");
  for (let i = 0; i < n.count; i++) {
    const nz = n.getZ(i);
    const nx = n.getX(i);
    const c = nz > 0.5 ? top : nz < -0.5 ? bottom : Math.abs(nx) > 0.5 ? sideA : sideB;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return g;
}

function archetypeGeometry(kind: CityEntity["archetype"]): THREE.BufferGeometry {
  if (kind === "capital") {
    const spire = shadedBox(0.34, 0.34, 1.2, 0, 0);
    spire.translate(0, 0, 2.4);
    return mergeGeometries([
      shadedBox(1.5, 1.5, 2.4, 0, 0),
      shadedBox(0.95, 0.95, 1.5, 1.15, 0.25),
      shadedBox(0.75, 0.75, 1.0, -1.0, -0.55),
      spire
    ])!;
  }
  if (kind === "city") {
    return mergeGeometries([shadedBox(1.15, 1.15, 1.5, 0, 0), shadedBox(0.8, 0.8, 0.95, 0.95, -0.3)])!;
  }
  return shadedBox(0.85, 0.85, 0.9, 0, 0);
}

export class CityMarkers {
  readonly group = new THREE.Group();
  private cities: CityEntity[] = [];
  private ringMesh: THREE.InstancedMesh | null = null;
  private hitMesh: THREE.InstancedMesh | null = null;
  private buildingMeshes = new Map<CityEntity["archetype"], THREE.InstancedMesh>();
  private roadLines: THREE.Line[] = [];
  private hoveredId: string | null = null;
  private selectedId: string | null = null;
  private builtAt = -1;
  private growK = 1;
  private readonly disposables: Array<{ dispose(): void }> = [];

  constructor(private scene: THREE.Scene) {
    this.group.visible = false;
    scene.add(this.group);
  }

  /** rebuild markers for one author's realm (empty id clears) */
  build(
    authorId: string | null,
    geometry: TerritoryGeometry | undefined,
    rankOf: (workId: string) => number | undefined,
    worksById: Map<string, Work>,
    /** clause 4 (v2.5): towns are founded at publication */
    townVisible: (workId: string) => boolean = () => true,
    /** growth animation on founding — skipped under reduced motion */
    animateGrowth = false
  ): void {
    this.clear();
    if (!authorId || !geometry) return;
    const cities = geometry.cities[authorId];
    if (!cities) return;

    const counts: Record<CityEntity["archetype"], number> = { capital: 0, city: 0, outpost: 0 };
    for (const town of cities.towns) {
      if (!worksById.has(town.id)) continue;
      if (!townVisible(town.id)) continue;
      const p = gridToVec3(town.x, town.y, geometry.gridWidth, geometry.gridHeight);
      const rank = rankOf(town.id);
      const isEntry = cities.portWork === town.id;
      const archetype: CityEntity["archetype"] = isEntry
        ? "capital"
        : rank !== undefined
          ? "city"
          : "outpost";
      this.cities.push({
        workId: town.id,
        isEntry,
        rank: rank ?? null,
        position: new THREE.Vector3(p[0], p[1], p[2]).multiplyScalar(GLOBE.terrainRadius + 0.35),
        archetype,
        instanceIdx: counts[archetype]++
      });
    }
    if (this.cities.length === 0) return;

    const ringGeom = new THREE.RingGeometry(RING_INNER, RING_OUTER, 28);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COLORS.brass,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.disposables.push(ringGeom, ringMat);
    this.ringMesh = new THREE.InstancedMesh(ringGeom, ringMat, this.cities.length);
    this.ringMesh.renderOrder = 2;

    const hitGeom = new THREE.CircleGeometry(HIT_RADIUS, 12);
    const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    this.disposables.push(hitGeom, hitMat);
    this.hitMesh = new THREE.InstancedMesh(hitGeom, hitMat, this.cities.length);

    // building clusters: one InstancedMesh per archetype silhouette
    const buildingMat = new THREE.MeshBasicMaterial({ vertexColors: true });
    this.disposables.push(buildingMat);
    for (const kind of ["capital", "city", "outpost"] as const) {
      if (counts[kind] === 0) continue;
      const geom = archetypeGeometry(kind);
      this.disposables.push(geom);
      const mesh = new THREE.InstancedMesh(geom, buildingMat, counts[kind]);
      mesh.renderOrder = 3;
      this.buildingMeshes.set(kind, mesh);
      this.group.add(mesh);
    }

    this.builtAt = animateGrowth ? performance.now() : -1;
    this.growK = animateGrowth ? 0 : 1;
    this.composeAll();
    this.cities.forEach((c, i) => {
      this.ringMesh!.setColorAt(i, new THREE.Color(c.isEntry ? COLORS.brassBright : COLORS.brass));
    });
    if (this.ringMesh.instanceColor) this.ringMesh.instanceColor.needsUpdate = true;
    this.group.add(this.ringMesh, this.hitMesh);

    // the curated reading order as a dashed road between ranked towns
    const ranked = this.cities
      .filter((c) => c.rank !== null)
      .sort((a, b) => a.rank! - b.rank!);
    for (let i = 0; i + 1 < ranked.length; i++) {
      const a = ranked[i]!.position.clone().normalize().toArray() as Vec3;
      const b = ranked[i + 1]!.position.clone().normalize().toArray() as Vec3;
      const pts = arcPoints(a, b, 20, GLOBE.terrainRadius + 0.3);
      const geomR = new THREE.BufferGeometry().setFromPoints(
        pts.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
      );
      const matR = new THREE.LineDashedMaterial({
        color: COLORS.brass,
        transparent: true,
        opacity: 0.5,
        dashSize: 0.9,
        gapSize: 0.7,
        depthWrite: false
      });
      this.disposables.push(geomR, matR);
      const line = new THREE.Line(geomR, matR);
      line.computeLineDistances();
      line.renderOrder = 2;
      this.roadLines.push(line);
      this.group.add(line);
    }
  }

  /** entry loudest, then the curated order; outside-order works smallest */
  private scaleOf(c: CityEntity): number {
    const base = c.isEntry ? 1.5 : c.rank !== null ? Math.max(0.85, 1.3 - c.rank * 0.18) : 0.7;
    const emphasized = c.workId === this.hoveredId || c.workId === this.selectedId;
    return base * (emphasized ? 1.3 : 1);
  }

  private composeAll(): void {
    const ring = this.ringMesh;
    const hit = this.hitMesh;
    if (!ring || !hit) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 0, 1);
    this.cities.forEach((c, i) => {
      q.setFromUnitVectors(up, c.position.clone().normalize());
      m.compose(c.position, q, new THREE.Vector3(1, 1, 1).multiplyScalar(this.scaleOf(c)));
      ring.setMatrixAt(i, m);
      m.compose(c.position, q, new THREE.Vector3(1, 1, 1));
      hit.setMatrixAt(i, m);
      const bMesh = this.buildingMeshes.get(c.archetype);
      if (bMesh) {
        // footprint scales with the reading rank; founding grows in over 340ms
        const s = this.scaleOf(c) * 0.9 * Math.max(0.02, this.growK);
        m.compose(c.position, q, new THREE.Vector3(s, s, s));
        bMesh.setMatrixAt(c.instanceIdx, m);
      }
    });
    ring.instanceMatrix.needsUpdate = true;
    hit.instanceMatrix.needsUpdate = true;
    for (const mesh of this.buildingMeshes.values()) mesh.instanceMatrix.needsUpdate = true;
  }

  /** founding growth tick — cheap no-op once settled */
  update(now: number): void {
    if (this.builtAt < 0 || this.cities.length === 0) return;
    const t = Math.min(1, (now - this.builtAt) / GROW_MS);
    const k = 1 - Math.pow(1 - t, 3);
    this.growK = k;
    this.composeAll();
    if (t >= 1) this.builtAt = -1;
  }

  /** raycast → workId (uses the generous invisible hit discs) */
  pick(raycaster: THREE.Raycaster): string | null {
    if (!this.hitMesh || !this.group.visible) return null;
    const hit = raycaster.intersectObject(this.hitMesh, false)[0];
    if (hit?.instanceId === undefined) return null;
    return this.cities[hit.instanceId]?.workId ?? null;
  }

  /** hover/selection emphasis shared with the DOM labels via the store */
  setEmphasis(hoveredId: string | null, selectedId: string | null): void {
    if (hoveredId === this.hoveredId && selectedId === this.selectedId) return;
    this.hoveredId = hoveredId;
    this.selectedId = selectedId;
    if (!this.ringMesh) return;
    this.composeAll();
  }

  setVisible(v: boolean): void {
    this.group.visible = v && this.cities.length > 0;
  }

  /** the town's world position (city focus aims here) */
  positionOf(workId: string): THREE.Vector3 | null {
    return this.cities.find((c) => c.workId === workId)?.position.clone() ?? null;
  }

  /** screen positions for QA (true 3D-pick E2E clicks land on these) */
  screenPositions(
    camera: THREE.Camera,
    width: number,
    height: number
  ): Array<{ id: string; x: number; y: number; r: number; rank: number | null }> {
    if (!this.group.visible) return [];
    const v = new THREE.Vector3();
    const e = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(right);
    right.cross(camera.up).normalize();
    const out: Array<{ id: string; x: number; y: number; r: number; rank: number | null }> = [];
    for (const c of this.cities) {
      v.copy(c.position).project(camera);
      if (v.z > 1) continue;
      // projected footprint radius in px (8th review: "meaningfully visible"
      // is a measured claim, not a state flag) — project the footprint edge
      const worldR = this.scaleOf(c) * 0.9;
      e.copy(c.position).addScaledVector(right, worldR).project(camera);
      const x = ((v.x + 1) / 2) * width;
      const y = ((-v.y + 1) / 2) * height;
      const ex = ((e.x + 1) / 2) * width;
      const ey = ((-e.y + 1) / 2) * height;
      out.push({
        id: c.workId,
        x: Math.round(x),
        y: Math.round(y),
        r: Math.round(Math.hypot(ex - x, ey - y) * 10) / 10,
        rank: c.rank
      });
    }
    return out;
  }

  get count(): number {
    return this.group.visible ? this.cities.length : 0;
  }

  /** instrumentation: building instances + road segments on screen */
  get buildingCount(): number {
    if (!this.group.visible) return 0;
    let n = 0;
    for (const mesh of this.buildingMeshes.values()) n += mesh.count;
    return n;
  }

  get roadSegments(): number {
    return this.group.visible ? this.roadLines.length : 0;
  }

  private clear(): void {
    for (const mesh of [this.ringMesh, this.hitMesh, ...this.buildingMeshes.values()]) {
      if (mesh) {
        this.group.remove(mesh);
        mesh.dispose();
      }
    }
    for (const line of this.roadLines) this.group.remove(line);
    this.roadLines = [];
    this.buildingMeshes.clear();
    for (const d of this.disposables.splice(0)) d.dispose();
    this.ringMesh = null;
    this.hitMesh = null;
    this.cities = [];
    this.builtAt = -1;
    this.growK = 1;
  }

  dispose(): void {
    this.clear();
    this.scene.remove(this.group);
  }
}
