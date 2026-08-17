// Work towns as first-class scene entities (territory grammar v2.0, D5;
// 4th review P0-3). The printed marks stay on the plate — these markers are
// the selection lighting them up: raised, pickable, hoverable, and measured.
// One entity model backs the 3D marker, the DOM label, and the URL.

import * as THREE from "three";
import { GLOBE, COLORS } from "../theme.ts";
import { gridToVec3 } from "../lib/territory-geometry.ts";
import type { TerritoryGeometry, Work } from "../types.ts";

export interface CityEntity {
  workId: string;
  isEntry: boolean;
  /** curated reading rank (0 = entry) or null when outside the order */
  rank: number | null;
  position: THREE.Vector3;
}

const RING_INNER = 0.72;
const RING_OUTER = 1.0;
const HIT_RADIUS = 2.6; // ≈70 CSS px at reading distance — beats the 44px floor

export class CityMarkers {
  readonly group = new THREE.Group();
  private cities: CityEntity[] = [];
  private ringMesh: THREE.InstancedMesh | null = null;
  private hitMesh: THREE.InstancedMesh | null = null;
  private hoveredId: string | null = null;
  private selectedId: string | null = null;
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
    worksById: Map<string, Work>
  ): void {
    this.clear();
    if (!authorId || !geometry) return;
    const cities = geometry.cities[authorId];
    if (!cities) return;

    for (const town of cities.towns) {
      if (!worksById.has(town.id)) continue;
      const p = gridToVec3(town.x, town.y, geometry.gridWidth, geometry.gridHeight);
      const rank = rankOf(town.id);
      this.cities.push({
        workId: town.id,
        isEntry: cities.portWork === town.id,
        rank: rank ?? null,
        position: new THREE.Vector3(p[0], p[1], p[2]).multiplyScalar(GLOBE.terrainRadius + 0.35)
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

    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 0, 1);
    this.cities.forEach((c, i) => {
      // flat on the ground, facing outward along the surface normal
      q.setFromUnitVectors(up, c.position.clone().normalize());
      m.compose(c.position, q, new THREE.Vector3(1, 1, 1).multiplyScalar(this.scaleOf(c)));
      this.ringMesh!.setMatrixAt(i, m);
      m.compose(c.position, q, new THREE.Vector3(1, 1, 1));
      this.hitMesh!.setMatrixAt(i, m);
      this.ringMesh!.setColorAt(i, new THREE.Color(c.isEntry ? COLORS.brassBright : COLORS.brass));
    });
    this.ringMesh.instanceMatrix.needsUpdate = true;
    this.hitMesh.instanceMatrix.needsUpdate = true;
    if (this.ringMesh.instanceColor) this.ringMesh.instanceColor.needsUpdate = true;
    this.group.add(this.ringMesh, this.hitMesh);
  }

  /** entry loudest, then the curated order; outside-order works smallest */
  private scaleOf(c: CityEntity): number {
    const base = c.isEntry ? 1.5 : c.rank !== null ? Math.max(0.85, 1.3 - c.rank * 0.18) : 0.7;
    const emphasized = c.workId === this.hoveredId || c.workId === this.selectedId;
    return base * (emphasized ? 1.3 : 1);
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
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 0, 1);
    this.cities.forEach((c, i) => {
      q.setFromUnitVectors(up, c.position.clone().normalize());
      m.compose(c.position, q, new THREE.Vector3(1, 1, 1).multiplyScalar(this.scaleOf(c)));
      this.ringMesh!.setMatrixAt(i, m);
    });
    this.ringMesh.instanceMatrix.needsUpdate = true;
  }

  setVisible(v: boolean): void {
    this.group.visible = v && this.cities.length > 0;
  }

  /** screen positions for QA (true 3D-pick E2E clicks land on these) */
  screenPositions(
    camera: THREE.Camera,
    width: number,
    height: number
  ): Array<{ id: string; x: number; y: number }> {
    if (!this.group.visible) return [];
    const v = new THREE.Vector3();
    const out: Array<{ id: string; x: number; y: number }> = [];
    for (const c of this.cities) {
      v.copy(c.position).project(camera);
      if (v.z > 1) continue;
      out.push({
        id: c.workId,
        x: Math.round(((v.x + 1) / 2) * width),
        y: Math.round(((-v.y + 1) / 2) * height)
      });
    }
    return out;
  }

  get count(): number {
    return this.group.visible ? this.cities.length : 0;
  }

  private clear(): void {
    for (const mesh of [this.ringMesh, this.hitMesh]) {
      if (mesh) {
        this.group.remove(mesh);
        mesh.dispose();
      }
    }
    for (const d of this.disposables.splice(0)) d.dispose();
    this.ringMesh = null;
    this.hitMesh = null;
    this.cities = [];
  }

  dispose(): void {
    this.clear();
    this.scene.remove(this.group);
  }
}
