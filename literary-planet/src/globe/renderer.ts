import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Author, Dataset, Movement, Relation } from "../types.ts";
import type { Locale } from "../i18n/index.ts";
import { RELATION_DEFS } from "../types.ts";
import { COLORS, GEO_COLORS, GLOBE, PERIOD_TINT, RELATION_COLORS } from "../theme.ts";
import { arcPoints, slerp, type Vec3 } from "../lib/sphere.ts";
import { sealGlyph } from "../lib/seal.ts";
import { visibleAuthorIds, visibleRelations } from "../lib/filter.ts";
import {
  CAMERA_DEFAULT,
  CAMERA_MAX,
  CAMERA_MIN,
  labelBudget,
  labelPriority,
  lodLevel,
  tierVisibleAtLod,
  type LodLevel
} from "../lib/lod.ts";
import type { AppState, Store } from "../state/store.ts";
import { LabelLayer, type LabelItem, type LabelState } from "./labels.ts";
import { paintTerrainTexture } from "./terrain-texture.ts";
import { paintSealTexture } from "./seal-texture.ts";

export interface GlobeCallbacks {
  onSelect(id: string | null): void;
  onHover(id: string | null): void;
  onRelationPick(relation: Relation): void;
}

export interface GlobeI18n {
  authorLabel(a: Author, locale: Locale): string;
  movementLabel(m: Movement, locale: Locale): string;
}

export interface GlobeHandle {
  focusAuthor(id: string, opts?: { distance?: number }): void;
  resetCamera(): void;
  zoomBy(factor: number): void;
  dispose(): void;
}

interface EdgeGroup {
  lines: THREE.LineSegments;
  relations: Relation[]; // parallel: segment block i belongs to relations[i]
  baseOpacity: number;
}

// D2: hierarchy is the information — anchor:context = 3:1
const NODE_SCALE: Record<Author["tier"], number> = { anchor: 2.1, major: 1.1, context: 0.7 };
const SEAL_SCALE: Record<Author["tier"], number> = { anchor: 7.4, major: 5.6, context: 4.4 };
const ARC_SEG = GLOBE.arcSegments;

// D9 v2 (ex libris 방인): texture painting lives in seal-texture.ts

// §⑤ two plates: affinity = warm-black sky, geography = midnight cobalt
interface ModePalette {
  surface: THREE.Color;
  line: THREE.Color;
  lineOp: number;
  ref: THREE.Color;
  refOp: number;
  atmo: THREE.Color;
  atmoOp: number;
}
const SEM_PAL: ModePalette = {
  surface: new THREE.Color(COLORS.surface),
  line: new THREE.Color(COLORS.line),
  lineOp: 0.28,
  ref: new THREE.Color(COLORS.lineAccent),
  refOp: 0.55,
  atmo: new THREE.Color(COLORS.brass),
  atmoOp: 0.06
};
const GEO_PAL: ModePalette = {
  surface: new THREE.Color(GEO_COLORS.surface),
  line: new THREE.Color(GEO_COLORS.line),
  lineOp: 0.32,
  ref: new THREE.Color(GEO_COLORS.lineStrong),
  refOp: 0.55,
  atmo: new THREE.Color(GEO_COLORS.atmosphere),
  atmoOp: 0.09
};

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function createGlobe(
  container: HTMLElement,
  dataset: Dataset,
  semantic: Map<string, Vec3>,
  geo: Map<string, Vec3>,
  store: Store,
  cbs: GlobeCallbacks,
  i18n: GlobeI18n = {
    authorLabel: (a) => a.names.ko,
    movementLabel: (m) => m.ko
  }
): GlobeHandle {
  const authors = dataset.authors;
  const indexOf = new Map(authors.map((a, i) => [a.id, i]));
  const R = GLOBE.radius;

  // --- three basics ---------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const smallScreen = container.clientWidth < 768;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, smallScreen ? 1.5 : 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.className = "globe-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / Math.max(1, container.clientHeight),
    1,
    2000
  );
  camera.position.set(0, CAMERA_DEFAULT * 0.32, CAMERA_DEFAULT * 0.95);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = CAMERA_MIN;
  controls.maxDistance = CAMERA_MAX;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.7;
  controls.enableDamping = true;

  // --- static globe ---------------------------------------------------------
  const disposables: Array<{ dispose(): void }> = [];
  function track<T extends { dispose(): void }>(x: T): T {
    disposables.push(x);
    return x;
  }

  const surfaceMat = track(new THREE.MeshBasicMaterial({ color: COLORS.surface }));
  const surface = new THREE.Mesh(
    track(new THREE.SphereGeometry(GLOBE.surfaceRadius, 48, 32)),
    surfaceMat
  );
  scene.add(surface);

  const atmoMat = track(
    new THREE.MeshBasicMaterial({
      color: COLORS.brass,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
      depthWrite: false
    })
  );
  const atmosphere = new THREE.Mesh(
    track(new THREE.SphereGeometry(GLOBE.surfaceRadius * GLOBE.atmosphereScale, 48, 32)),
    atmoMat
  );
  scene.add(atmosphere);

  // Terrain P1 (thesis §②-6/7): the affinity plate — baked coastlines painted
  // once into a canvas texture, mounted between the surface and the instrument
  // graticule. Opacity rides the SAME interpolator as the mode palette
  // (1 − paletteK), so the map cross-fades with the plate colors and can never
  // appear in geography mode; a distance ramp keeps the far view a star chart.
  let terrainMat: THREE.MeshBasicMaterial | null = null;
  let terrainMesh: THREE.Mesh | null = null;
  // two plates of the same bake: mid/far, plus a double-scale near plate whose
  // constant-pixel strokes read as finer engraving at reading distance
  let terrainTexMid: THREE.CanvasTexture | null = null;
  let terrainTexNear: THREE.CanvasTexture | null = null;
  if (dataset.territory) {
    const periodByAuthor = new Map(authors.map((a) => [a.id, a.periods[0]]));
    const periodOf = (id: string) => periodByAuthor.get(id);
    const makeTex = (cellPx: number): THREE.CanvasTexture => {
      const tex = track(
        new THREE.CanvasTexture(paintTerrainTexture(dataset.territory!, periodOf, cellPx))
      );
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };
    terrainTexMid = makeTex(2);
    terrainTexNear = makeTex(4);
    terrainMat = track(
      new THREE.MeshBasicMaterial({
        map: terrainTexMid,
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    );
    terrainMesh = new THREE.Mesh(
      track(new THREE.SphereGeometry(GLOBE.terrainRadius, 96, 64)),
      terrainMat
    );
    terrainMesh.renderOrder = -1;
    terrainMesh.visible = false;
    scene.add(terrainMesh);
  }
  // full planetary map through mid LOD, receding to faint continents far out
  function terrainFade(dist: number): number {
    const t = Math.min(1, Math.max(0, (340 - dist) / 70));
    const s = t * t * (3 - 2 * t);
    return 0.3 + 0.7 * s;
  }

  // D1: fine 15° instrument grid — each line shy, the system dense.
  // Equator + prime meridian live in a separate accent geometry with tick marks.
  const gratMat = track(
    new THREE.LineBasicMaterial({ color: COLORS.line, transparent: true, opacity: 0.28 })
  );
  const refMat = track(
    new THREE.LineBasicMaterial({ color: COLORS.lineAccent, transparent: true, opacity: 0.55 })
  );

  function buildGraticule(): THREE.LineSegments {
    const pts: number[] = [];
    const r = GLOBE.graticuleRadius;
    const step = Math.PI / 12;
    for (let lat = -Math.PI / 2 + step; lat < Math.PI / 2 - 1e-4; lat += step) {
      if (Math.abs(lat) < 1e-4) continue; // equator drawn as reference ring
      const rl = Math.cos(lat) * r;
      const y = Math.sin(lat) * r;
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const b = ((i + 1) / 72) * Math.PI * 2;
        pts.push(Math.sin(a) * rl, y, Math.cos(a) * rl, Math.sin(b) * rl, y, Math.cos(b) * rl);
      }
    }
    for (let lon = 0; lon < Math.PI * 2 - 1e-4; lon += step) {
      if (Math.abs(lon) < 1e-4 || Math.abs(lon - Math.PI) < 1e-4) continue; // prime meridian ring
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI - Math.PI / 2;
        const b = ((i + 1) / 72) * Math.PI - Math.PI / 2;
        pts.push(
          Math.cos(a) * Math.sin(lon) * r, Math.sin(a) * r, Math.cos(a) * Math.cos(lon) * r,
          Math.cos(b) * Math.sin(lon) * r, Math.sin(b) * r, Math.cos(b) * Math.cos(lon) * r
        );
      }
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(g, gratMat);
  }
  scene.add(buildGraticule());

  function buildReferenceRings(): THREE.LineSegments {
    const pts: number[] = [];
    const r = GLOBE.graticuleRadius + 0.05;
    // equator
    for (let i = 0; i < 144; i++) {
      const a = (i / 144) * Math.PI * 2;
      const b = ((i + 1) / 144) * Math.PI * 2;
      pts.push(Math.sin(a) * r, 0, Math.cos(a) * r, Math.sin(b) * r, 0, Math.cos(b) * r);
    }
    // prime meridian (full great circle through both poles)
    for (let i = 0; i < 144; i++) {
      const a = (i / 144) * Math.PI * 2;
      const b = ((i + 1) / 144) * Math.PI * 2;
      pts.push(0, Math.sin(a) * r, Math.cos(a) * r, 0, Math.sin(b) * r, Math.cos(b) * r);
    }
    // 15° tick marks on the equator — the instrument's scale
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2;
      const sa = Math.sin(a);
      const ca = Math.cos(a);
      pts.push(sa * r, 0, ca * r, sa * (r + 1.8), 0, ca * (r + 1.8));
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(g, refMat);
  }
  scene.add(buildReferenceRings());

  function applyPalette(k: number): void {
    surfaceMat.color.lerpColors(SEM_PAL.surface, GEO_PAL.surface, k);
    gratMat.color.lerpColors(SEM_PAL.line, GEO_PAL.line, k);
    gratMat.opacity = SEM_PAL.lineOp + (GEO_PAL.lineOp - SEM_PAL.lineOp) * k;
    refMat.color.lerpColors(SEM_PAL.ref, GEO_PAL.ref, k);
    refMat.opacity = SEM_PAL.refOp + (GEO_PAL.refOp - SEM_PAL.refOp) * k;
    atmoMat.color.lerpColors(SEM_PAL.atmo, GEO_PAL.atmo, k);
    atmoMat.opacity = SEM_PAL.atmoOp + (GEO_PAL.atmoOp - SEM_PAL.atmoOp) * k;
  }
  let paletteK = store.getState().mode === "geo" ? 1 : 0;
  applyPalette(paletteK);

  // --- nodes ----------------------------------------------------------------
  const nodeGeom = track(new THREE.SphereGeometry(1.35, 24, 16));
  const nodeMat = track(new THREE.MeshBasicMaterial({ color: "#ffffff" }));
  const nodes = new THREE.InstancedMesh(nodeGeom, nodeMat, authors.length);
  nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(nodes);

  const pickGeom = track(new THREE.SphereGeometry(4.4, 8, 6));
  const pickMat = track(
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, transparent: true })
  );
  const pickMesh = new THREE.InstancedMesh(pickGeom, pickMat, authors.length);
  pickMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(pickMesh);

  // D3: the selection marker is a reticle — thin double ring + cardinal ticks,
  // the aiming language of an astronomical instrument.
  function makeReticle(color: string, opacity: number, double: boolean): THREE.Group {
    const group = new THREE.Group();
    const mat = track(
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    if (double) {
      group.add(new THREE.Mesh(track(new THREE.RingGeometry(2.7, 2.85, 48)), mat));
      group.add(new THREE.Mesh(track(new THREE.RingGeometry(3.3, 3.45, 48)), mat));
      const tickGeom = track(new THREE.PlaneGeometry(0.14, 0.6));
      for (let i = 0; i < 4; i++) {
        const tick = new THREE.Mesh(tickGeom, mat);
        const a = (i / 4) * Math.PI * 2;
        tick.position.set(Math.cos(a) * 3.85, Math.sin(a) * 3.85, 0);
        tick.rotation.z = a + Math.PI / 2;
        group.add(tick);
      }
    } else {
      group.add(new THREE.Mesh(track(new THREE.RingGeometry(2.9, 3.05, 48)), mat));
    }
    return group;
  }
  const ring = makeReticle(COLORS.brass, 0.95, true);
  ring.visible = false;
  scene.add(ring);
  const hoverRing = makeReticle(COLORS.text, 0.4, false);
  hoverRing.visible = false;
  scene.add(hoverRing);

  // D2: anchors alone get a micro halo — a single additive billboard, no bloom.
  function makeGlowTexture(): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    if (g) {
      const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grd.addColorStop(0, "rgba(255,255,255,0.9)");
      grd.addColorStop(0.35, "rgba(255,255,255,0.26)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(c);
  }
  const glowTexture = track(makeGlowTexture());
  const glowSprites = new Map<string, THREE.Sprite>();
  for (const a of authors) {
    if (a.tier !== "anchor") continue;
    const mat = track(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: COLORS.brassBright,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(8.5, 8.5, 1);
    sprite.visible = false;
    scene.add(sprite);
    glowSprites.set(a.id, sprite);
  }

  // D9 v2: at reading distance the point becomes the author's ex libris — a
  // square 방인 (anchors 백문, others 주문) with seeded carving accidents.
  // Drawn white, tinted through material.color so selection/dim states need
  // no redraws.
  const sealSprites = new Map<string, THREE.Sprite>();
  for (const a of authors) {
    const tex = track(
      new THREE.CanvasTexture(paintSealTexture(sealGlyph(a.id, a.names.original), a.tier, a.id))
    );
    const mat = track(
      new THREE.SpriteMaterial({
        map: tex,
        color: COLORS.text,
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    );
    const sprite = new THREE.Sprite(mat);
    sprite.visible = false;
    sprite.renderOrder = 6;
    scene.add(sprite);
    sealSprites.set(a.id, sprite);
  }
  // 0 at ≥235 (mid LOD), 1 at ≤195 — the stamp develops as you lean in
  let sealK = 0;
  function sealFade(dist: number): number {
    const t = Math.min(1, Math.max(0, (235 - dist) / 40));
    return t * t * (3 - 2 * t);
  }

  // --- edges ----------------------------------------------------------------
  const edgeRoot = new THREE.Group();
  scene.add(edgeRoot);
  const highlightRoot = new THREE.Group();
  scene.add(highlightRoot);
  let edgeGroups: EdgeGroup[] = [];
  let highlightGroups: EdgeGroup[] = [];

  // D4: the arrowhead is a confirmation stamp, not the protagonist —
  // direction is already carried by the dim-source/bright-target gradient
  const arrowGeom = track(new THREE.ConeGeometry(0.55, 1.6, 8));
  let arrowMesh: THREE.InstancedMesh | null = null;

  function clearGroup(root: THREE.Group, groups: EdgeGroup[]): void {
    for (const g of groups) {
      root.remove(g.lines);
      g.lines.geometry.dispose();
      (g.lines.material as THREE.Material).dispose();
    }
  }

  function buildEdgeGroups(
    rels: Relation[],
    positions: Map<string, Vec3>,
    root: THREE.Group,
    opacityScale: number,
    highlighted: boolean
  ): EdgeGroup[] {
    const byType = new Map<string, Relation[]>();
    for (const r of rels) {
      const list = byType.get(r.type) ?? [];
      list.push(r);
      byType.set(r.type, list);
    }
    const groups: EdgeGroup[] = [];
    for (const def of RELATION_DEFS) {
      const list = byType.get(def.id);
      if (!list || list.length === 0) continue;
      const positionsArr: number[] = [];
      const colorsArr: number[] = [];
      const color = new THREE.Color(RELATION_COLORS[def.id]);
      for (const r of list) {
        const a = positions.get(r.sourceId);
        const b = positions.get(r.targetId);
        if (!a || !b) continue;
        const pts = arcPoints(a, b, ARC_SEG, R);
        for (let i = 0; i < ARC_SEG; i++) {
          const p = pts[i]!;
          const n = pts[i + 1]!;
          positionsArr.push(p[0], p[1], p[2], n[0], n[1], n[2]);
          // directed types: dim at source, bright at target = readable direction cue
          const t0 = i / ARC_SEG;
          const t1 = (i + 1) / ARC_SEG;
          const dim = def.direction === "directed" ? 0.45 : 0.85;
          const k0 = dim + (1 - dim) * t0;
          const k1 = dim + (1 - dim) * t1;
          colorsArr.push(color.r * k0, color.g * k0, color.b * k0);
          colorsArr.push(color.r * k1, color.g * k1, color.b * k1);
        }
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.Float32BufferAttribute(positionsArr, 3));
      geom.setAttribute("color", new THREE.Float32BufferAttribute(colorsArr, 3));
      // D5: three-step hierarchy — overview lines carry "milky-way density"
      const baseOpacity = (highlighted ? 0.95 : def.dashed ? 0.34 : 0.42) * opacityScale;
      const mat = def.dashed
        ? new THREE.LineDashedMaterial({
            vertexColors: true,
            transparent: true,
            opacity: baseOpacity,
            dashSize: 2.4,
            gapSize: 1.8,
            depthWrite: false
          })
        : new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: baseOpacity,
            depthWrite: false
          });
      const lines = new THREE.LineSegments(geom, mat);
      if (def.dashed) lines.computeLineDistances();
      lines.renderOrder = highlighted ? 3 : 1;
      root.add(lines);
      groups.push({ lines, relations: list, baseOpacity });
    }
    return groups;
  }

  function buildArrows(rels: Relation[], positions: Map<string, Vec3>): void {
    if (arrowMesh) {
      scene.remove(arrowMesh);
      arrowMesh.dispose();
      arrowMesh = null;
    }
    const directed = rels.filter((r) => r.direction === "directed");
    if (directed.length === 0) return;
    const mesh = new THREE.InstancedMesh(
      arrowGeom,
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.8, depthWrite: false }),
      directed.length
    );
    const m = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    directed.forEach((r, i) => {
      const a = positions.get(r.sourceId);
      const b = positions.get(r.targetId);
      if (!a || !b) return;
      const pts = arcPoints(a, b, ARC_SEG, R);
      const tip = pts[Math.round(ARC_SEG * 0.9)]!;
      const prev = pts[Math.round(ARC_SEG * 0.9) - 1]!;
      const pos = new THREE.Vector3(...tip);
      const dir = new THREE.Vector3(tip[0] - prev[0], tip[1] - prev[1], tip[2] - prev[2]).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
      m.compose(pos, quat, new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, new THREE.Color(RELATION_COLORS[r.type]));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.renderOrder = 4;
    scene.add(mesh);
    arrowMesh = mesh;
  }

  // --- per-frame state ------------------------------------------------------
  const labels = new LabelLayer(container);
  let current = new Map<string, Vec3>(); // live positions (unit vectors)
  let visibleSet = new Set<string>();
  let visRels: Relation[] = [];
  let lod: LodLevel = lodLevel(camera.position.length());
  let neighborIds = new Set<string>();
  let transition: { from: Map<string, Vec3>; start: number; dur: number } | null = null;
  let paletteFrom = 0;
  let camAnim: {
    fromDir: THREE.Vector3;
    toDir: THREE.Vector3;
    fromDist: number;
    toDist: number;
    start: number;
    dur: number;
  } | null = null;
  let disposed = false;

  function positionsFor(mode: AppState["mode"]): Map<string, Vec3> {
    return mode === "geo" ? geo : semantic;
  }

  function setCurrentFrom(map: Map<string, Vec3>): void {
    current = new Map(map);
  }
  setCurrentFrom(positionsFor(store.getState().mode));

  const tmpM = new THREE.Matrix4();
  const tmpV = new THREE.Vector3();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

  function nodeVisible(a: Author): boolean {
    return visibleSet.has(a.id) && tierVisibleAtLod(a.tier, lod);
  }

  function updateNodeInstances(): void {
    const s = store.getState();
    authors.forEach((a, i) => {
      const p = current.get(a.id);
      if (!p || !nodeVisible(a)) {
        nodes.setMatrixAt(i, hidden);
        pickMesh.setMatrixAt(i, hidden);
        return;
      }
      const scaleK =
        NODE_SCALE[a.tier] *
        (a.id === s.selectedAuthorId ? 1.35 : a.id === s.hoveredAuthorId ? 1.25 : 1) *
        (1 - 0.68 * sealK); // the ball recedes to a mounting pin as its seal develops
      tmpV.set(p[0] * R, p[1] * R, p[2] * R);
      tmpM.compose(
        tmpV,
        new THREE.Quaternion(),
        new THREE.Vector3(scaleK, scaleK, scaleK)
      );
      nodes.setMatrixAt(i, tmpM);
      tmpM.compose(tmpV, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
      pickMesh.setMatrixAt(i, tmpM);

      const dimmed =
        s.selectedAuthorId !== null &&
        a.id !== s.selectedAuthorId &&
        !neighborIds.has(a.id);
      const tint = new THREE.Color(PERIOD_TINT[a.periods[0] ?? "early-modernism"]);
      if (a.id === s.selectedAuthorId) tint.set(COLORS.brassBright);
      if (dimmed) tint.multiplyScalar(0.42);
      nodes.setColorAt(i, tint);
    });
    nodes.instanceMatrix.needsUpdate = true;
    pickMesh.instanceMatrix.needsUpdate = true;
    if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
    nodes.computeBoundingSphere();
    pickMesh.computeBoundingSphere();

    for (const [id, sprite] of glowSprites) {
      const a = authors[indexOf.get(id) ?? -1];
      const p = current.get(id);
      if (!a || !p || !nodeVisible(a)) {
        sprite.visible = false;
        continue;
      }
      sprite.visible = true;
      sprite.position.set(p[0] * R, p[1] * R, p[2] * R);
      const dimmed =
        s.selectedAuthorId !== null && id !== s.selectedAuthorId && !neighborIds.has(id);
      (sprite.material as THREE.SpriteMaterial).opacity = dimmed ? 0.1 : 0.32;
    }

    for (const [id, sprite] of sealSprites) {
      const a = authors[indexOf.get(id) ?? -1];
      const p = current.get(id);
      if (!a || !p || sealK < 0.02 || !nodeVisible(a)) {
        sprite.visible = false;
        continue;
      }
      sprite.visible = true;
      // lifted off the surface so the globe occludes far-side seals itself
      sprite.position.set(p[0] * (R + 2.6), p[1] * (R + 2.6), p[2] * (R + 2.6));
      const k = SEAL_SCALE[a.tier];
      sprite.scale.set(k, k, 1);
      const dimmed =
        s.selectedAuthorId !== null && id !== s.selectedAuthorId && !neighborIds.has(id);
      const mat = sprite.material as THREE.SpriteMaterial;
      mat.opacity = sealK * (dimmed ? 0.22 : 0.92);
      mat.color.set(id === s.selectedAuthorId ? COLORS.brassBright : COLORS.text);
    }
  }

  function rebuildEdges(): void {
    clearGroup(edgeRoot, edgeGroups);
    clearGroup(highlightRoot, highlightGroups);
    edgeGroups = [];
    highlightGroups = [];
    const s = store.getState();
    const lodRels = visRels.filter((r) => {
      const sa = authors[indexOf.get(r.sourceId) ?? -1];
      const ta = authors[indexOf.get(r.targetId) ?? -1];
      return sa && ta && nodeVisible(sa) && nodeVisible(ta);
    });
    const sel = s.selectedAuthorId;
    if (sel) {
      const touching = lodRels.filter((r) => r.sourceId === sel || r.targetId === sel);
      const rest = lodRels.filter((r) => r.sourceId !== sel && r.targetId !== sel);
      edgeGroups = buildEdgeGroups(rest, current, edgeRoot, 0.28, false);
      highlightGroups = buildEdgeGroups(touching, current, highlightRoot, 1, true);
      buildArrows(touching, current);
    } else {
      edgeGroups = buildEdgeGroups(lodRels, current, edgeRoot, 1, false);
      buildArrows([], current);
    }
  }

  function recomputeVisibility(): void {
    const s = store.getState();
    visibleSet = visibleAuthorIds(authors, s.filters, s.year, s.yearMode);
    visRels = visibleRelations(dataset.relations, s.filters, visibleSet);
    neighborIds = new Set();
    if (s.selectedAuthorId) {
      for (const r of visRels) {
        if (r.sourceId === s.selectedAuthorId) neighborIds.add(r.targetId);
        if (r.targetId === s.selectedAuthorId) neighborIds.add(r.sourceId);
      }
    }
  }

  function updateRings(): void {
    const s = store.getState();
    for (const [mesh, id] of [
      [ring, s.selectedAuthorId],
      [hoverRing, s.hoveredAuthorId !== s.selectedAuthorId ? s.hoveredAuthorId : null]
    ] as Array<[THREE.Object3D, string | null]>) {
      const p = id ? current.get(id) : undefined;
      const a = id ? authors[indexOf.get(id) ?? -1] : undefined;
      if (!id || !p || !a || !nodeVisible(a)) {
        mesh.visible = false;
        continue;
      }
      mesh.visible = true;
      mesh.position.set(p[0] * R, p[1] * R, p[2] * R);
      mesh.lookAt(camera.position);
      const k = NODE_SCALE[a.tier];
      mesh.scale.set(k, k, k);
    }
  }

  // --- labels ---------------------------------------------------------------
  const movementMembers = new Map<string, string[]>();
  for (const m of dataset.movements) {
    movementMembers.set(
      m.id,
      authors.filter((a) => a.movements.includes(m.id)).map((a) => a.id)
    );
  }

  function updateLabels(): void {
    const s = store.getState();
    const w = container.clientWidth;
    const h = container.clientHeight;
    const camDir = camera.position.clone().normalize();
    const items: LabelItem[] = [];

    for (const a of authors) {
      if (!nodeVisible(a)) continue;
      const p = current.get(a.id);
      if (!p) continue;
      const facing = camDir.x * p[0] + camDir.y * p[1] + camDir.z * p[2];
      const state: LabelState =
        a.id === s.selectedAuthorId
          ? "selected"
          : a.id === s.hoveredAuthorId
            ? "hovered"
            : neighborIds.has(a.id)
              ? "neighbor"
              : s.selectedAuthorId
                ? "dim"
                : "normal";
      const priority = labelPriority({
        tier: a.tier,
        isSelected: state === "selected",
        isHovered: state === "hovered",
        isNeighborOfSelected: state === "neighbor",
        facingDot: facing
      });
      if (priority < 0) continue;
      tmpV.set(p[0] * R, p[1] * R, p[2] * R).project(camera);
      if (tmpV.z > 1) continue;
      items.push({
        id: a.id,
        text: i18n.authorLabel(a, s.locale),
        kind: "author",
        size: a.tier === "anchor" ? "md" : "sm",
        priority,
        x: ((tmpV.x + 1) / 2) * w,
        y: ((-tmpV.y + 1) / 2) * h + 7,
        state
      });
    }

    if (lod !== "near" && !s.selectedAuthorId) {
      for (const m of dataset.movements) {
        const members = (movementMembers.get(m.id) ?? []).filter((id) => {
          const a = authors[indexOf.get(id) ?? -1];
          return a && nodeVisible(a);
        });
        if (members.length < 3) continue;
        let cx = 0, cy = 0, cz = 0;
        for (const id of members) {
          const p = current.get(id);
          if (!p) continue;
          cx += p[0]; cy += p[1]; cz += p[2];
        }
        const len = Math.hypot(cx, cy, cz);
        if (len < members.length * 0.45) continue; // members scattered — centroid meaningless
        cx /= len; cy /= len; cz /= len;
        const facing = camDir.x * cx + camDir.y * cy + camDir.z * cz;
        if (facing < 0.25) continue;
        tmpV.set(cx * R * 1.04, cy * R * 1.04, cz * R * 1.04).project(camera);
        items.push({
          id: `mv:${m.id}`,
          text: i18n.movementLabel(m, s.locale),
          kind: "movement",
          size: "lg",
          priority: 30 + facing * 8,
          x: ((tmpV.x + 1) / 2) * w,
          y: ((-tmpV.y + 1) / 2) * h,
          state: "normal"
        });
      }
    }

    labels.update(items, w, h, labelBudget(lod));
  }

  // --- picking --------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  raycaster.params.Line = { threshold: 2.2 };
  const pointer = new THREE.Vector2();
  let downAt: { x: number; y: number; t: number } | null = null;
  let hoverPending = false;

  function pickAuthor(clientX: number, clientY: number): string | null {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(pickMesh, false);
    const first = hits[0];
    if (first?.instanceId === undefined) return null;
    const a = authors[first.instanceId];
    return a && nodeVisible(a) ? a.id : null;
  }

  function pickRelation(): Relation | null {
    const groups = [...highlightGroups, ...edgeGroups];
    for (const g of groups) {
      const hits = raycaster.intersectObject(g.lines, false);
      const first = hits[0];
      if (first?.index !== undefined) {
        const rel = g.relations[Math.floor(first.index / (ARC_SEG * 2))];
        if (rel) return rel;
      }
    }
    return null;
  }

  function onPointerMove(e: PointerEvent): void {
    if (e.pointerType === "touch") return;
    if (hoverPending) return;
    hoverPending = true;
    requestAnimationFrame(() => {
      hoverPending = false;
      if (disposed) return;
      const id = pickAuthor(e.clientX, e.clientY);
      renderer.domElement.style.cursor = id ? "pointer" : "grab";
      if (id !== store.getState().hoveredAuthorId) cbs.onHover(id);
    });
  }

  function onPointerDown(e: PointerEvent): void {
    downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
  }

  function onPointerUp(e: PointerEvent): void {
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    const dt = performance.now() - downAt.t;
    downAt = null;
    if (moved > 6 || dt > 700) return; // drag, not click
    const id = pickAuthor(e.clientX, e.clientY);
    if (id) {
      cbs.onSelect(id);
      return;
    }
    const rel = pickRelation();
    if (rel) {
      cbs.onRelationPick(rel);
      return;
    }
    cbs.onSelect(null);
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointerleave", () => {
    if (store.getState().hoveredAuthorId) cbs.onHover(null);
  });

  // --- store subscription with field diffing --------------------------------
  let prev = store.getState();
  recomputeVisibility();
  updateNodeInstances();
  rebuildEdges();
  updateLabels();

  // deep links (#/?a=…) should open already aimed at their author
  {
    const boot = store.getState().selectedAuthorId;
    const p = boot ? current.get(boot) : undefined;
    if (p) {
      camera.position.set(p[0], p[1], p[2]).normalize().multiplyScalar(240);
      camera.lookAt(0, 0, 0);
    }
  }

  const unsub = store.subscribe(() => {
    const s = store.getState();
    const filtersChanged =
      s.filters !== prev.filters || s.year !== prev.year || s.yearMode !== prev.yearMode;
    const selectionChanged = s.selectedAuthorId !== prev.selectedAuthorId;
    const hoverChanged = s.hoveredAuthorId !== prev.hoveredAuthorId;
    const modeChanged = s.mode !== prev.mode;
    const localeChanged = s.locale !== prev.locale;
    prev = s;

    if (localeChanged) updateLabels();

    if (modeChanged) {
      const from = new Map(current);
      transition = {
        from,
        start: performance.now(),
        dur: s.reducedMotion ? 0 : 950
      };
      paletteFrom = paletteK;
      edgeRoot.visible = false;
      highlightRoot.visible = false;
      if (arrowMesh) arrowMesh.visible = false;
      // swing the camera with the nodes, or the map ends up facing empty ocean
      const target = positionsFor(s.mode);
      let aim: Vec3 | undefined = s.selectedAuthorId
        ? target.get(s.selectedAuthorId)
        : undefined;
      if (!aim) {
        let cx = 0, cy = 0, cz = 0;
        for (const id of visibleSet) {
          const p = target.get(id);
          if (!p) continue;
          cx += p[0]; cy += p[1]; cz += p[2];
        }
        const len = Math.hypot(cx, cy, cz);
        if (len > 1e-3) aim = [cx / len, cy / len, cz / len];
      }
      if (aim) {
        animateCameraTo(new THREE.Vector3(aim[0], aim[1], aim[2]), camera.position.length());
      }
    }
    if (filtersChanged || selectionChanged) {
      recomputeVisibility();
      updateNodeInstances();
      if (!transition) rebuildEdges();
      updateLabels();
    } else if (hoverChanged) {
      updateNodeInstances();
      updateLabels();
    }
    updateRings();
  });

  // --- camera focus ---------------------------------------------------------
  function animateCameraTo(dir: THREE.Vector3, dist: number): void {
    const s = store.getState();
    if (s.reducedMotion) {
      camera.position.copy(dir.clone().multiplyScalar(dist));
      camera.lookAt(0, 0, 0);
      return;
    }
    camAnim = {
      fromDir: camera.position.clone().normalize(),
      toDir: dir.clone().normalize(),
      fromDist: camera.position.length(),
      toDist: dist,
      start: performance.now(),
      dur: 850
    };
  }

  function focusAuthor(id: string, opts?: { distance?: number }): void {
    const p = current.get(id);
    if (!p) return;
    const dist = opts?.distance ?? Math.min(camera.position.length(), 215);
    animateCameraTo(new THREE.Vector3(p[0], p[1], p[2]), dist);
  }

  function resetCamera(): void {
    animateCameraTo(new THREE.Vector3(0, 0.32, 0.95).normalize(), CAMERA_DEFAULT);
  }

  function zoomBy(factor: number): void {
    const dist = Math.min(
      CAMERA_MAX,
      Math.max(CAMERA_MIN, camera.position.length() * factor)
    );
    animateCameraTo(camera.position.clone().normalize(), dist);
  }

  // --- resize / loop --------------------------------------------------------
  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    updateLabels();
  });
  ro.observe(container);

  let rafId = 0;
  let lastCamPos = camera.position.clone();

  function frame(now: number): void {
    if (disposed) return;
    rafId = requestAnimationFrame(frame);

    if (camAnim) {
      const t = camAnim.dur === 0 ? 1 : Math.min(1, (now - camAnim.start) / camAnim.dur);
      const k = easeInOut(t);
      const dir = camAnim.fromDir.clone().lerp(camAnim.toDir, k).normalize();
      const dist = camAnim.fromDist + (camAnim.toDist - camAnim.fromDist) * k;
      camera.position.copy(dir.multiplyScalar(dist));
      camera.lookAt(0, 0, 0);
      if (t >= 1) camAnim = null;
    } else {
      controls.update();
    }

    {
      const newSealK = sealFade(camera.position.length());
      const sealChanged = Math.abs(newSealK - sealK) > 0.004;
      sealK = newSealK;
      if (sealChanged && !transition) updateNodeInstances();
    }

    if (transition) {
      const s = store.getState();
      const target = positionsFor(s.mode);
      const t =
        transition.dur === 0 ? 1 : Math.min(1, (now - transition.start) / transition.dur);
      const k = easeInOut(t);
      for (const a of authors) {
        const from = transition.from.get(a.id);
        const to = target.get(a.id);
        if (from && to) current.set(a.id, slerp(from, to, k));
      }
      // ⑤ the stars stay, the world changes: plate colors cross-fade in sync
      const targetK = s.mode === "geo" ? 1 : 0;
      paletteK = paletteFrom + (targetK - paletteFrom) * k;
      applyPalette(paletteK);
      updateNodeInstances();
      updateRings();
      updateLabels();
      if (t >= 1) {
        transition = null;
        setCurrentFrom(target);
        paletteK = targetK;
        applyPalette(paletteK);
        edgeRoot.visible = true;
        highlightRoot.visible = true;
        if (arrowMesh) arrowMesh.visible = true;
        rebuildEdges();
        updateLabels();
      }
    }

    if (terrainMat && terrainMesh) {
      // after the transition block so paletteK is this frame's value (§②-7)
      const op = (1 - paletteK) * terrainFade(camera.position.length());
      if (Math.abs(op - terrainMat.opacity) > 0.003 || (op > 0.004) !== terrainMesh.visible) {
        terrainMat.opacity = op;
        terrainMesh.visible = op > 0.004;
      }
    }

    const newLod = lodLevel(camera.position.length());
    if (newLod !== lod) {
      lod = newLod;
      if (terrainMat && terrainTexMid && terrainTexNear) {
        const want = lod === "near" ? terrainTexNear : terrainTexMid;
        if (terrainMat.map !== want) {
          terrainMat.map = want;
          terrainMat.needsUpdate = true;
        }
      }
      updateNodeInstances();
      if (!transition) rebuildEdges();
      updateLabels();
    } else if (!camera.position.equals(lastCamPos)) {
      updateLabels();
      updateRings();
    }
    lastCamPos.copy(camera.position);

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(frame);

  function dispose(): void {
    disposed = true;
    cancelAnimationFrame(rafId);
    unsub();
    ro.disconnect();
    labels.dispose();
    clearGroup(edgeRoot, edgeGroups);
    clearGroup(highlightRoot, highlightGroups);
    if (arrowMesh) {
      scene.remove(arrowMesh);
      arrowMesh.dispose();
    }
    nodes.dispose();
    pickMesh.dispose();
    for (const d of disposables) d.dispose();
    controls.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { focusAuthor, resetCamera, zoomBy, dispose };
}
