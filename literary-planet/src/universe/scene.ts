// R11 성계 장면 — 하나의 연속 공간. 카메라 거리 하나가 별 → 천체 → 지각을
// 결정하고, 그 사이에 화면 전환이 없다.
//
// 핵심 규칙:
//  · 별과 천체는 **같은 객체**다. 겉보기 반경이 3px 미만이면 별로, 그 이상이면
//    구로, 화면의 22%를 넘으면 지각으로 그린다(grammar.ts).
//  · 빛은 원점에서 온다. 원점은 정본 코퍼스(항성)이고, 그래서 모든 천체는
//    코퍼스 쪽 면이 밝다. 관측자의 독서등(카메라 필)은 착륙할수록 세진다.
//  · 착륙해도 하늘은 남는다. 다른 천체는 여전히 900 반경의 껍질 위에 있다.

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Author, Work } from "../types.ts";
import { COLORS } from "../theme.ts";
import { sealGlyph } from "../lib/seal.ts";
import type { ArtManifest } from "../globe/art-assets.ts";
import { artUrl } from "../globe/art-assets.ts";
import { LabelLayer, type LabelItem } from "../globe/labels.ts";
import {
  CAM_SKY_DEFAULT,
  CAM_SKY_MAX,
  LANDING_ALT,
  SHELL_R,
  STAR_TO_DISC_PX,
  apparentRadiusPx,
  bodyRadius,
  genreHarmonics,
  influenceWeight,
  magnitude,
  representationFor,
  starLife,
  starPixels,
  tintOf,
  SILHOUETTE_AMP
} from "./grammar.ts";
import type { LensLine, LensResult } from "./lenses.ts";

export interface UniverseData {
  authors: Author[];
  works: Work[];
  positions: Record<string, [number, number, number]>;
  degree: Record<string, number>;
  art: ArtManifest | null;
}

export interface UniverseSceneState {
  focusId: string | null;
  landedId: string | null;
  hoveredId: string | null;
  year: number;
  lens: LensResult | null;
  read: Set<string>;
  want: Set<string>;
  selectedWorkId: string | null;
  reducedMotion: boolean;
  /** 선택된 별의 자기 성좌 — 렌즈와 무관하게 항상 그린다(중경의 관계 흐름) */
  ego: LensLine[];
  egoLit: Set<string>;
}

export interface UniverseCallbacks {
  onPickAuthor(id: string | null): void;
  onHoverAuthor(id: string | null): void;
  onPickWork(id: string): void;
  onStageChange(stage: Stage): void;
}

export type Stage = "sky" | "approach" | "surface";

interface BodyRecord {
  id: string;
  mesh: THREE.Mesh;
  mat: THREE.MeshStandardMaterial;
  radius: number;
  center: THREE.Vector3;
  textured: boolean;
}

// 로그 깊이 버퍼를 켰으므로 커스텀 셰이더도 같은 깊이를 써야 한다 —
// 빼먹으면 별이 전부 깊이 테스트에서 탈락해 하늘이 통째로 사라진다(실측).
const STAR_VERT = `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute float aPx;
attribute float aAlpha;
attribute float aSpike;
attribute float aRing;
attribute vec3 aColor;
varying float vAlpha;
varying float vSpike;
varying float vRing;
varying vec3 vColor;
uniform float uDpr;
void main() {
  vAlpha = aAlpha; vSpike = aSpike; vRing = aRing; vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aPx * uDpr;
  gl_Position = projectionMatrix * mv;
  #include <logdepthbuf_vertex>
}
`;

const STAR_FRAG = `
#include <common>
#include <logdepthbuf_pars_fragment>
varying float vAlpha;
varying float vSpike;
varying float vRing;
varying vec3 vColor;
void main() {
  #include <logdepthbuf_fragment>
  vec2 p = (gl_PointCoord - 0.5) * 2.0;
  float d = length(p);
  if (d > 1.0) discard;
  float core = pow(smoothstep(1.0, 0.0, d), 2.4);
  float spike = (max(0.0, 1.0 - abs(p.x) * 7.0) + max(0.0, 1.0 - abs(p.y) * 7.0))
              * smoothstep(1.0, 0.05, d) * vSpike;
  float ring = max(0.0, 1.0 - abs(d - 0.84) / 0.09) * vRing;
  float a = (core + spike * 0.5 + ring * 0.85) * vAlpha;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(vColor, a);
}
`;

export class UniverseScene {
  readonly renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private labels: LabelLayer;
  private raycaster = new THREE.Raycaster();

  private stars!: THREE.Points;
  private starGeo!: THREE.BufferGeometry;
  private starMat!: THREE.ShaderMaterial;
  private constellation!: THREE.LineSegments;
  private egoLines!: THREE.LineSegments;
  private graticule!: THREE.LineSegments;
  private sunGlow!: THREE.Sprite;
  private selRing!: THREE.Sprite;
  private readLamp: THREE.PointLight;

  private bodies = new Map<string, BodyRecord>();
  private cityGroup = new THREE.Group();
  private cityRecords: Array<{ workId: string; obj: THREE.Object3D; pos: THREE.Vector3 }> = [];
  private geoCache = new Map<string, THREE.BufferGeometry>();
  private texCache = new Map<string, THREE.Texture>();

  private order: string[] = [];
  private authorList: Author[] = [];
  private index = new Map<string, number>();
  private dirs: THREE.Vector3[] = [];
  private mags: number[] = [];
  /** refreshStars() 가 계산한 기준 알파. 프레임 루프는 여기서 다시 시작한다
   *  — 속성 버퍼를 직접 곱하면 매 프레임 누적돼 별이 조용히 꺼진다. */
  private baseAlpha: Float32Array = new Float32Array(0);
  private radii: number[] = [];

  private state: UniverseSceneState = {
    focusId: null,
    landedId: null,
    hoveredId: null,
    year: 1995,
    lens: null,
    read: new Set(),
    want: new Set(),
    selectedWorkId: null,
    reducedMotion: false,
    ego: [],
    egoLit: new Set()
  };
  private stage: Stage = "sky";
  private anim: {
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    start: number;
    dur: number;
  } | null = null;
  private safeRight = 0;
  private raf = 0;
  private disposed = false;
  /** instrumentation for the QA harness */
  metrics = {
    stage: "sky" as Stage,
    dist: CAM_SKY_DEFAULT,
    bodies: 0,
    labels: 0,
    frames: 0,
    /** 화면에 실제로 그려진 별 — 착륙해도 하늘이 남는지의 증거 */
    stars: 0,
    /** 선택된 별의 자기 성좌 선 수 */
    ego: 0,
    /** 착륙한 천체의 지각 종류: manuscript(육필) | paper(백지) | null */
    crust: null as string | null
  };

  constructor(
    private host: HTMLElement,
    private data: UniverseData,
    private cb: UniverseCallbacks
  ) {
    const w = host.clientWidth || 1280;
    const h = host.clientHeight || 800;
    // 천문 규모(천구 900 vs 천체 1~2.6)를 한 깊이 버퍼에 담으려면 로그 깊이가 필요하다
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      logarithmicDepthBuffer: true
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.setSize(w, h);
    this.renderer.setClearColor(new THREE.Color(COLORS.bg), 1);
    host.appendChild(this.renderer.domElement);
    this.renderer.domElement.className = "universe-canvas";

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.05, 24000);
    this.camera.position.set(0, 420, CAM_SKY_DEFAULT);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = CAM_SKY_MAX;
    this.controls.rotateSpeed = 0.42;
    this.controls.zoomSpeed = 0.72;

    this.labels = new LabelLayer(host);

    // 항성 = 정본 코퍼스. 모든 빛의 출처.
    // 세기는 물리 단위(칸델라)다 — decay 0 이라 거리와 무관하게 일정하다.
    const sun = new THREE.PointLight(0xffd9a0, 6, 0, 0.0);
    sun.position.set(0, 0, 0);
    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0x2a2118, 1.0));
    // 관측자의 독서등 — 착륙할수록 세진다
    this.readLamp = new THREE.PointLight(0xffe9c8, 1.4, 0, 0.0);
    this.scene.add(this.readLamp);

    this.buildIndex();
    this.buildStars();
    this.buildGraticule();
    this.buildSunGlow();
    this.buildSelRing();
    this.constellation = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })
    );
    this.constellation.frustumCulled = false;
    this.scene.add(this.constellation);
    this.egoLines = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1 })
    );
    this.egoLines.frustumCulled = false;
    this.scene.add(this.egoLines);
    this.scene.add(this.cityGroup);

    this.renderer.domElement.addEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("resize", this.onResize);
    this.loop();
  }

  // -------------------------------------------------------------------------

  private buildIndex(): void {
    const maxDeg = Math.max(1, ...Object.values(this.data.degree));
    for (const a of this.data.authors) {
      const p = this.data.positions[a.id];
      if (!p) continue;
      this.index.set(a.id, this.order.length);
      this.order.push(a.id);
      this.authorList.push(a);
      this.dirs.push(new THREE.Vector3(p[0], p[1], p[2]).normalize());
      const m = magnitude(influenceWeight(a.tier, this.data.degree[a.id] ?? 0, maxDeg));
      this.mags.push(m);
      this.radii.push(bodyRadius(m));
    }
  }

  private buildStars(): void {
    const n = this.order.length;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const d = this.dirs[i] as THREE.Vector3;
      pos[i * 3] = d.x * SHELL_R;
      pos[i * 3 + 1] = d.y * SHELL_R;
      pos[i * 3 + 2] = d.z * SHELL_R;
      const a = this.authorAt(i);
      // 별은 발광체다 — 지면 워시보다 채도를 올려 시대 램프가 실제로 읽히게 한다
      const c = new THREE.Color(a ? tintOf(a) : "#e7c893");
      const hsl = { h: 0, s: 0, l: 0 };
      c.getHSL(hsl);
      c.setHSL(hsl.h, Math.min(1, hsl.s * 2.1), Math.min(1, hsl.l * 1.04));
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aPx", new THREE.BufferAttribute(new Float32Array(n), 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(new Float32Array(n), 1));
    g.setAttribute("aSpike", new THREE.BufferAttribute(new Float32Array(n), 1));
    g.setAttribute("aRing", new THREE.BufferAttribute(new Float32Array(n), 1));
    this.baseAlpha = new Float32Array(n);
    this.starGeo = g;
    this.starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      uniforms: { uDpr: { value: this.renderer.getPixelRatio() } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    this.stars = new THREE.Points(g, this.starMat);
    this.stars.frustumCulled = false;
    this.scene.add(this.stars);
    this.refreshStars();
  }

  private buildGraticule(): void {
    const pts: number[] = [];
    const ring = (axis: "lat" | "lon", t: number): void => {
      const seg = 96;
      for (let i = 0; i < seg; i++) {
        for (const k of [i, i + 1]) {
          const u = (k / seg) * Math.PI * 2;
          let v: THREE.Vector3;
          if (axis === "lat") {
            const r = Math.cos(t);
            v = new THREE.Vector3(Math.cos(u) * r, Math.sin(t), Math.sin(u) * r);
          } else {
            v = new THREE.Vector3(
              Math.cos(u) * Math.cos(t),
              Math.sin(u),
              Math.cos(u) * Math.sin(t)
            );
          }
          pts.push(v.x * SHELL_R, v.y * SHELL_R, v.z * SHELL_R);
        }
      }
    };
    for (const lat of [-Math.PI / 3, -Math.PI / 6, 0, Math.PI / 6, Math.PI / 3]) ring("lat", lat);
    for (let i = 0; i < 6; i++) ring("lon", (i / 6) * Math.PI);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    this.graticule = new THREE.LineSegments(
      g,
      new THREE.LineBasicMaterial({
        color: new THREE.Color(COLORS.line),
        transparent: true,
        opacity: 0.5
      })
    );
    this.graticule.frustumCulled = false;
    this.scene.add(this.graticule);
  }

  private buildSunGlow(): void {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,238,205,0.95)");
    g.addColorStop(0.18, "rgba(240,196,120,0.55)");
    g.addColorStop(0.5, "rgba(196,140,70,0.14)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    this.sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      })
    );
    this.sunGlow.scale.setScalar(420);
    this.scene.add(this.sunGlow);
  }

  /** 선택 표식 — R10 의 감상인(鑑賞印) 문법을 하늘로 가져온다.
   *  주홍은 여전히 선택 채널의 유일한 사용자다. */
  private buildSelRing(): void {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.strokeStyle = COLORS.vermilion;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(64, 64, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(64, 64, 58, 0, Math.PI * 2);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    this.selRing = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false })
    );
    this.selRing.visible = false;
    this.scene.add(this.selRing);
  }

  private authorAt(i: number): Author | undefined {
    return this.authorList[i];
  }

  // -------------------------------------------------------------------------
  // state
  // -------------------------------------------------------------------------

  /** 아트 매니페스트는 비동기로 온다 — 장면을 다시 만들지 않고 갈아 끼운다
   *  (재생성하면 이미 반영된 상태가 조용히 사라진다) */
  /** 패널이 덮는 폭(px). 투영만 밀어서 궤도 역학은 건드리지 않는다(R7 PR1 계승) */
  setSafeRight(px: number): void {
    if (px === this.safeRight) return;
    this.safeRight = px;
    this.applyViewOffset();
  }

  private applyViewOffset(): void {
    const w = this.renderer.domElement.clientWidth || 1;
    const h = this.renderer.domElement.clientHeight || 1;
    if (this.safeRight <= 0) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, this.safeRight / 2, 0, w, h);
    this.camera.updateProjectionMatrix();
  }

  setArt(art: ArtManifest | null): void {
    this.data = { ...this.data, art };
    for (const rec of this.bodies.values()) rec.textured = false;
    if (this.state.landedId) this.refreshCities();
  }

  setState(next: Partial<UniverseSceneState>): void {
    const prevLanded = this.state.landedId;
    const prevFocus = this.state.focusId;
    this.state = { ...this.state, ...next };
    this.refreshStars();
    this.refreshConstellation();
    if (this.state.landedId !== prevLanded) this.refreshCities();
    if (this.state.focusId !== prevFocus || this.state.landedId !== prevLanded) this.retarget();
  }

  private starState(id: string): { boost: number; dim: number } {
    const s = this.state;
    if (id === s.landedId || id === s.focusId) return { boost: 1.55, dim: 1 };
    if (id === s.hoveredId) return { boost: 1.3, dim: 1 };
    if (s.egoLit.has(id)) return { boost: 1.22, dim: 1 };
    if (s.lens) return s.lens.lit.has(id) ? { boost: 1.06, dim: 1 } : { boost: 1, dim: 0.34 };
    return { boost: 1, dim: 1 };
  }

  private refreshStars(): void {
    const aPx = this.starGeo.getAttribute("aPx") as THREE.BufferAttribute;
    const aAlpha = this.starGeo.getAttribute("aAlpha") as THREE.BufferAttribute;
    const aSpike = this.starGeo.getAttribute("aSpike") as THREE.BufferAttribute;
    const aRing = this.starGeo.getAttribute("aRing") as THREE.BufferAttribute;
    for (let i = 0; i < this.order.length; i++) {
      const id = this.order[i] as string;
      const a = this.authorAt(i);
      const mag = this.mags[i] ?? 0;
      const life = a ? starLife(a, this.state.year) : { presence: 1, afterglow: false };
      const st = this.starState(id);
      const read = this.state.read.has(id);
      const px = starPixels(mag) * st.boost * (read ? 1.12 : 1);
      const alpha =
        life.presence *
        st.dim *
        (0.5 + 0.5 * mag) *
        (life.afterglow ? 0.72 : 1) *
        (read ? 1.35 : 1);
      aPx.setX(i, px);
      this.baseAlpha[i] = Math.min(1.6, alpha);
      aAlpha.setX(i, Math.min(1.6, alpha));
      aSpike.setX(i, mag > 0.55 || read ? 1 : 0);
      aRing.setX(i, this.state.want.has(id) ? 1 : 0);
    }
    aPx.needsUpdate = true;
    aAlpha.needsUpdate = true;
    aSpike.needsUpdate = true;
    aRing.needsUpdate = true;
  }

  private present(i: number): boolean {
    const a = this.authorAt(i);
    return !a || starLife(a, this.state.year).presence > 0.05;
  }

  private refreshConstellation(): void {
    this.buildLines(this.constellation, this.state.lens ? this.state.lens.lines : []);
    this.buildLines(this.egoLines, this.state.ego);
  }

  private buildLines(mesh: THREE.LineSegments, lines: LensLine[]): void {
    const pos = new Float32Array(lines.length * 6);
    const col = new Float32Array(lines.length * 6);
    let n = 0;
    for (const l of lines) {
      const ia = this.index.get(l.a);
      const ib = this.index.get(l.b);
      if (ia === undefined || ib === undefined) continue;
      // 아직 태어나지 않은 별 사이에는 선도 없다 — 연도 스크럽에서 관계가
      // 그 관계의 당사자보다 먼저 존재하면 시간 채널이 거짓말이 된다
      if (!this.present(ia) || !this.present(ib)) continue;
      const da = this.dirs[ia] as THREE.Vector3;
      const db = this.dirs[ib] as THREE.Vector3;
      const c = new THREE.Color(l.color);
      const k = 0.3 + 0.7 * l.weight;
      const off = n * 6;
      pos[off] = da.x * SHELL_R;
      pos[off + 1] = da.y * SHELL_R;
      pos[off + 2] = da.z * SHELL_R;
      pos[off + 3] = db.x * SHELL_R;
      pos[off + 4] = db.y * SHELL_R;
      pos[off + 5] = db.z * SHELL_R;
      for (let s = 0; s < 2; s++) {
        col[off + s * 3] = c.r * k;
        col[off + s * 3 + 1] = c.g * k;
        col[off + s * 3 + 2] = c.b * k;
      }
      n++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos.subarray(0, n * 6), 3));
    g.setAttribute("color", new THREE.BufferAttribute(col.subarray(0, n * 6), 3));
    mesh.geometry.dispose();
    mesh.geometry = g;
  }

  // -------------------------------------------------------------------------
  // bodies
  // -------------------------------------------------------------------------

  private bodyGeometry(a: Author, detail: "lo" | "hi" = "lo"): THREE.BufferGeometry {
    const h = genreHarmonics(a);
    const key = `${detail}:${h.map((x) => x.toFixed(3)).join("|")}`;
    const hit = this.geoCache.get(key);
    if (hit) return hit;
    // 정방도법 UV 가 필요하다 — 이십면체 UV 는 육필 원고 맵을 조각낸다
    const geo =
      detail === "hi"
        ? new THREE.SphereGeometry(1, 160, 80)
        : new THREE.SphereGeometry(1, 64, 32);
    const p = geo.getAttribute("position") as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).normalize();
      // 저주파 조화 4채널 = 장르 4채널. 진폭은 ±6% 로 묶여 광도 채널을 침범하지 않는다.
      const y1 = v.y;
      const y2 = (3 * v.z * v.z - 1) / 2;
      const y3 = v.x * v.y * 2;
      const y4 = v.x * v.x - v.y * v.y;
      const r =
        1 +
        SILHOUETTE_AMP *
          ((h[0] ?? 0) * y1 + (h[1] ?? 0) * y2 + (h[2] ?? 0) * y3 + (h[3] ?? 0) * y4);
      p.setXYZ(i, v.x * r, v.y * r, v.z * r);
    }
    geo.computeVertexNormals();
    this.geoCache.set(key, geo);
    return geo;
  }

  private fallbackTexture(a: Author): THREE.Texture {
    const key = `fallback:${a.id}`;
    const hit = this.texCache.get(key);
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = COLORS.paperLaid;
    ctx.fillRect(0, 0, c.width, c.height);
    // laid lines — 종이는 종이다. 없는 육필을 지어내지 않는다.
    ctx.strokeStyle = "rgba(43,32,21,0.055)";
    ctx.lineWidth = 1;
    for (let x = 0; x < c.width; x += 7) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, c.height);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(43,32,21,0.09)";
    for (let y = 0; y < c.height; y += 46) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(c.width, y);
      ctx.stroke();
    }
    // 인장 하나 — 이름의 첫 글자. 자료가 아직 없다는 표시이기도 하다.
    const glyph = sealGlyph(a.id, a.names.original);
    ctx.fillStyle = "rgba(192,57,46,0.42)";
    ctx.font = "700 116px 'Noto Serif KR', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, c.width * 0.5, c.height * 0.5);
    ctx.strokeStyle = "rgba(192,57,46,0.42)";
    ctx.lineWidth = 6;
    ctx.strokeRect(c.width * 0.5 - 84, c.height * 0.5 - 84, 168, 168);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.texCache.set(key, tex);
    return tex;
  }

  private ensureBody(id: string): BodyRecord | null {
    const hit = this.bodies.get(id);
    if (hit) return hit;
    const i = this.index.get(id);
    if (i === undefined) return null;
    const a = this.data.authors.find((x) => x.id === id);
    if (!a) return null;
    const radius = this.radii[i] ?? 12;
    const center = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(tintOf(a)).multiplyScalar(0.62),
      roughness: 0.94,
      metalness: 0
    });
    const mesh = new THREE.Mesh(this.bodyGeometry(a), mat);
    mesh.scale.setScalar(radius);
    mesh.position.copy(center);
    mesh.userData.authorId = id;
    this.scene.add(mesh);
    const rec: BodyRecord = { id, mesh, mat, radius, center, textured: false };
    this.bodies.set(id, rec);
    return rec;
  }

  /** 표면 단계에 들어간 천체에만 지각을 칠한다 */
  private paintCrust(rec: BodyRecord): void {
    if (rec.textured) return;
    rec.textured = true;
    const a = this.data.authors.find((x) => x.id === rec.id);
    if (!a) return;
    const ground = this.data.art?.grounds?.[rec.id];
    // 지각을 칠할 때 형상도 고해상으로 바꾼다(다각형 윤곽이 보이면 종이가 아니다)
    rec.mesh.geometry = this.bodyGeometry(a, "hi");
    rec.mat.color.set(0xd6cdba);
    if (ground) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // R10 의 지면 고스트(잉크 16%)는 평면 플레이트 아래 깔리도록 만든 값이다.
        // 조명 받는 구면에서 그대로 쓰면 흰 공이 된다 — 같은 원고를 잉크
        // 존재감만 올려 다시 굽는다(자료를 바꾸는 게 아니라 노출을 바꾼다).
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height);
        const px = d.data;
        for (let i = 0; i < px.length; i += 4) {
          for (let k = 0; k < 3; k++) {
            const v = px[i + k] as number;
            px[i + k] = Math.max(0, Math.min(255, 236 - (236 - v) * 3.4));
          }
        }
        ctx.putImageData(d, 0, 0);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        // 거울 반복 — 단순 반복은 원고 가장자리에서 세로 이음선을 남긴다
        tex.wrapS = THREE.MirroredRepeatWrapping;
        tex.repeat.set(2, 1);
        rec.mat.map = tex;
        rec.mat.needsUpdate = true;
        rec.mesh.userData.crust = "manuscript";
      };
      img.src = artUrl(ground.file);
    } else {
      rec.mat.map = this.fallbackTexture(a);
      rec.mat.needsUpdate = true;
      rec.mesh.userData.crust = "paper";
    }
  }

  // -------------------------------------------------------------------------
  // cities (works) — 착륙한 천체에만
  // -------------------------------------------------------------------------

  private clearCities(): void {
    for (const c of this.cityRecords) {
      this.cityGroup.remove(c.obj);
      c.obj.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
    }
    this.cityRecords = [];
  }

  private refreshCities(): void {
    this.clearCities();
    const id = this.state.landedId;
    if (!id) return;
    const rec = this.ensureBody(id);
    if (!rec) return;
    const works = this.data.works.filter((w) => w.authorId === id);
    const outward = rec.center.clone().normalize();
    const up = Math.abs(outward.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const ex = new THREE.Vector3().crossVectors(up, outward).normalize();
    const ey = new THREE.Vector3().crossVectors(outward, ex).normalize();
    const GOLD = Math.PI * (3 - Math.sqrt(5));
    works.forEach((w, i) => {
      // 착륙면(바깥쪽) 주위 55° 캡 안에 황금각 나선 — 결정적이고, 내려서면 다 보인다
      const t = works.length === 1 ? 0 : i / Math.max(1, works.length - 1);
      const theta = 0.16 + t * 0.72; // rad from the outward normal
      const phi = i * GOLD;
      const dir = outward
        .clone()
        .multiplyScalar(Math.cos(theta))
        .addScaledVector(ex, Math.sin(theta) * Math.cos(phi))
        .addScaledVector(ey, Math.sin(theta) * Math.sin(phi))
        .normalize();
      const surface = rec.center.clone().addScaledVector(dir, rec.radius * 0.995);
      const group = new THREE.Group();
      group.position.copy(surface);
      group.userData.workId = w.id;

      const cover = this.data.art?.covers?.[w.id];
      const bw = rec.radius * 0.3;
      const bh = bw * 1.42;
      const boardMat = cover
        ? new THREE.MeshBasicMaterial({ map: this.coverTexture(w.id, cover.file), side: THREE.DoubleSide })
        : new THREE.MeshBasicMaterial({ map: this.hatchTexture(), side: THREE.DoubleSide });
      const board = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), boardMat);
      board.position.set(0, bh * 0.52, 0); // 그룹 로컬 +Y = 지면 법선
      board.userData.workId = w.id;
      group.add(board);
      // 받침 — 판이 표면에 서 있다는 것을 말하는 최소한의 그림자 선
      const base = new THREE.Mesh(
        new THREE.CircleGeometry(bw * 0.46, 20),
        new THREE.MeshBasicMaterial({ color: 0x2b2015, transparent: true, opacity: 0.22 })
      );
      base.rotation.x = -Math.PI / 2; // 로컬 XZ 평면 = 지면
      base.position.set(0, 0.004 * rec.radius, 0);
      group.add(base);
      group.userData.dir = dir;
      this.cityGroup.add(group);
      this.cityRecords.push({ workId: w.id, obj: group, pos: surface });
    });
  }

  private coverTexture(workId: string, file: string): THREE.Texture {
    const key = `cover:${workId}`;
    const hit = this.texCache.get(key);
    if (hit) return hit;
    const tex = new THREE.TextureLoader().load(artUrl(file));
    tex.colorSpace = THREE.SRGBColorSpace;
    this.texCache.set(key, tex);
    return tex;
  }

  private hatchTexture(): THREE.Texture {
    const hit = this.texCache.get("hatch");
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 180;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    // 실물 표지가 있는 도시가 시각적으로 앞서야 한다 — 폴백 판은 한 단 어둡게
    ctx.fillStyle = COLORS.paperLaid;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "rgba(43,32,21,0.13)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgba(43,32,21,0.46)";
    ctx.lineWidth = 3;
    for (let i = -c.height; i < c.width; i += 14) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + c.height, c.height);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(43,32,21,0.75)";
    ctx.lineWidth = 5;
    ctx.strokeRect(4, 4, c.width - 8, c.height - 8);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.texCache.set("hatch", tex);
    return tex;
  }

  // -------------------------------------------------------------------------
  // camera
  // -------------------------------------------------------------------------

  private retarget(): void {
    const s = this.state;
    if (s.landedId) {
      const i = this.index.get(s.landedId);
      if (i === undefined) return;
      const c = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      const r = this.radii[i] ?? 2;
      this.controls.minDistance = r * 1.35;
      this.flyTo(c, r * LANDING_ALT, 1150);
      return;
    }
    if (s.focusId) {
      const i = this.index.get(s.focusId);
      if (i === undefined) return;
      const c = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      // 중경은 한 지점이 아니라 통과 구간이지만, 첫 클릭이 멈추는 자리는
      // **관계가 읽히는 거리**여야 한다. 천체까지 40 까지 내려가면 이웃이 전부
      // 화면 밖으로 나가 "작은 공 하나"가 된다(실측: 라벨 2개). 430 이면 그 별의
      // 자기 성좌가 프레임 안에 수렴하고, 착륙은 두 번째 클릭이 맡는다.
      this.flyTo(c.clone(), 430, 1050);
      return;
    }
    this.flyTo(new THREE.Vector3(0, 0, 0), CAM_SKY_DEFAULT, 1000);
  }

  /**
   * 도착 방향. 천체의 반경 축을 그대로 타고 내려가면 (a) 이웃 별이 전부
   * 방사형으로 퍼져 거미줄처럼 보이고 (b) 항성이 천체 정반대에 놓여 완전한
   * 역광이 된다. 26° 기울여 접근하면 성좌가 입체로, 지각이 초승달로 읽힌다.
   */
  private arrivalDir(radial: THREE.Vector3): THREE.Vector3 {
    const up = Math.abs(radial.y) > 0.92 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const perp = up.clone().addScaledVector(radial, -up.dot(radial)).normalize();
    return radial.clone().addScaledVector(perp, Math.tan((26 * Math.PI) / 180)).normalize();
  }

  private flyTo(target: THREE.Vector3, dist: number, dur: number): void {
    const dir = this.camera.position.clone().sub(this.controls.target);
    let approach: THREE.Vector3;
    if (target.lengthSq() > 1) {
      // 천체를 향할 때는 바깥에서 비스듬히 내려앉는다 — 별들 사이를 통과하는 경로
      approach = this.arrivalDir(target.clone().normalize());
    } else {
      approach = dir.clone().normalize();
    }
    const toPos = target.clone().addScaledVector(approach, dist);
    if (this.state.reducedMotion) {
      this.controls.target.copy(target);
      this.camera.position.copy(toPos);
      this.anim = null;
      return;
    }
    this.anim = {
      fromTarget: this.controls.target.clone(),
      toTarget: target.clone(),
      fromPos: this.camera.position.clone(),
      toPos,
      start: performance.now(),
      dur
    };
  }

  private cancelFly(): void {
    this.anim = null;
  }

  // -------------------------------------------------------------------------
  // interaction
  // -------------------------------------------------------------------------

  private pointerNdc(e: PointerEvent): THREE.Vector2 {
    const r = this.renderer.domElement.getBoundingClientRect();
    return new THREE.Vector2(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1
    );
  }

  /** 화면 좌표에서 가장 가까운 별 — Points 레이캐스트보다 예측 가능하다 */
  private pickStar(e: PointerEvent): string | null {
    const r = this.renderer.domElement.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    let best: string | null = null;
    let bestD = 26;
    const v = new THREE.Vector3();
    for (let i = 0; i < this.order.length; i++) {
      const id = this.order[i] as string;
      const a = this.authorAt(i);
      if (a && starLife(a, this.state.year).presence <= 0.02) continue;
      if (
        this.state.lens &&
        this.state.lens.lit.size &&
        !this.state.lens.lit.has(id) &&
        !this.state.egoLit.has(id)
      )
        continue;
      v.copy(this.dirs[i] as THREE.Vector3).multiplyScalar(SHELL_R).project(this.camera);
      if (v.z > 1) continue;
      const sx = ((v.x + 1) / 2) * r.width;
      const sy = ((-v.y + 1) / 2) * r.height;
      const d = Math.hypot(sx - px, sy - py);
      if (d < bestD) {
        bestD = d;
        best = id;
      }
    }
    return best;
  }

  private pickWork(e: PointerEvent): string | null {
    if (!this.cityRecords.length) return null;
    this.raycaster.setFromCamera(this.pointerNdc(e), this.camera);
    const hits = this.raycaster.intersectObjects(this.cityGroup.children, true);
    for (const h of hits) {
      const w = (h.object.userData.workId ?? h.object.parent?.userData.workId) as string | undefined;
      if (w) return w;
    }
    return null;
  }

  private onPointerDown = (e: PointerEvent): void => {
    this.cancelFly();
    const w = this.pickWork(e);
    if (w) {
      this.cb.onPickWork(w);
      return;
    }
    const s = this.pickStar(e);
    if (s) this.cb.onPickAuthor(s);
  };

  private onPointerMove = (e: PointerEvent): void => {
    const s = this.pickStar(e);
    if (s !== this.state.hoveredId) {
      this.state.hoveredId = s;
      this.refreshStars();
      this.cb.onHoverAuthor(s);
    }
    this.renderer.domElement.style.cursor = s || this.pickWork(e) ? "pointer" : "grab";
  };

  private onResize = (): void => {
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.applyViewOffset();
  };

  // -------------------------------------------------------------------------
  // frame
  // -------------------------------------------------------------------------

  private easeInOut(k: number): number {
    return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  }

  /** 진행 중인 비행을 즉시 끝내고 한 프레임을 그린다.
   *  reduced-motion 과 QA 하네스(비가시 탭에서 rAF 가 스로틀되는 환경)의 공용 경로. */
  settle(): void {
    if (this.anim) {
      this.anim.start = performance.now() - this.anim.dur;
      this.advance(performance.now());
    }
    this.step();
  }

  private advance(now: number): void {
    if (this.anim) {
      const k = Math.min(1, (now - this.anim.start) / this.anim.dur);
      const e = this.easeInOut(k);
      // 주시점은 거리보다 먼저 도착한다. 둘을 같은 속도로 보간하면 비행 중반에
      // 카메라가 껍질 안쪽 빈 공간을 바라보게 되고(실측: 전환 3프레임이 검은
      // 화면), 여정이 "어디로 가는지 모르는 구간"을 갖는다.
      const te = this.easeInOut(Math.min(1, k / 0.45));
      const tgt = new THREE.Vector3().lerpVectors(this.anim.fromTarget, this.anim.toTarget, te);
      this.controls.target.copy(tgt);
      // 거리는 로그 공간에서 보간한다. 2150 → 6 같은 350배 접근을 선형으로
      // 보간하면 여정의 90%가 "아무 일도 없는 구간"이 된다.
      const fromOff = this.anim.fromPos.clone().sub(this.anim.fromTarget);
      const toOff = this.anim.toPos.clone().sub(this.anim.toTarget);
      const d0 = Math.max(0.01, fromOff.length());
      const d1 = Math.max(0.01, toOff.length());
      const dir = fromOff.normalize().lerp(toOff.clone().normalize(), e).normalize();
      const dist = Math.exp(Math.log(d0) * (1 - e) + Math.log(d1) * e);
      this.camera.position.copy(tgt).addScaledVector(dir, dist);
      if (k >= 1) this.anim = null;
    }
  }

  private loop = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    this.advance(performance.now());
    this.step();
  };

  private step(): void {
    // 최소 거리는 update() 보다 먼저 정한다 — 순서가 뒤바뀌면 착륙 프레임에서
    // 직전 프레임의 하한(40)이 카메라를 그 자리에 못박는다(실측 버그).
    this.controls.minDistance = this.state.landedId
      ? (this.radii[this.index.get(this.state.landedId) ?? 0] ?? 2) * 1.35
      : 20;
    this.controls.update();

    const h = this.renderer.domElement.clientHeight || 800;
    const dist = this.camera.position.distanceTo(this.controls.target);

    // 별 ↔ 천체: 겉보기 크기가 결정한다
    let resolved = 0;
    let surfaceId: string | null = null;
    const alpha = this.starGeo.getAttribute("aAlpha") as THREE.BufferAttribute;
    for (let i = 0; i < this.order.length; i++) {
      const id = this.order[i] as string;
      const center = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      const d = center.distanceTo(this.camera.position);
      const ap = apparentRadiusPx(this.radii[i] ?? 12, d, this.camera.fov, h);
      const rep = representationFor(ap, h);
      if (rep === "star") {
        const body = this.bodies.get(id);
        if (body) body.mesh.visible = false;
      } else {
        const body = this.ensureBody(id);
        if (body) {
          body.mesh.visible = true;
          resolved++;
          // 지각은 표면 단계보다 먼저 칠한다 — 도착하는 순간 텍스처가 튀어
          // 들어오면 "같은 천체가 계속 있었다"는 규칙이 깨진다
          if (ap > 60) this.paintCrust(body);
          if (rep === "surface") surfaceId = id;
        }
        // 구가 보이면 별 스프라이트는 물러난다 — 같은 객체가 두 번 그려지지 않게
        const fade = Math.max(0, 1 - (ap - STAR_TO_DISC_PX) / STAR_TO_DISC_PX);
        alpha.setX(i, (this.baseAlpha[i] ?? 0) * fade);
        continue;
      }
      alpha.setX(i, this.baseAlpha[i] ?? 0);
    }
    alpha.needsUpdate = true;

    const stage: Stage = surfaceId ? "surface" : resolved > 0 || dist < 1250 ? "approach" : "sky";
    if (stage !== this.stage) {
      this.stage = stage;
      this.cb.onStageChange(stage);
    }

    // 독서등 — 착륙할수록 세진다
    const prox = stage === "surface" ? 1 : stage === "approach" ? 0.28 : 0;
    // 관측자의 독서등: 원경에서는 꺼져 있고(태양의 초승달만 보인다),
    // 착륙하면 표면을 읽을 만큼 밝아진다.
    this.readLamp.intensity = 1.35 + prox * 1.15;
    this.readLamp.position.copy(this.camera.position);
    (this.graticule.material as THREE.LineBasicMaterial).opacity =
      0.5 * Math.max(0, Math.min(1, (dist - 900) / 900));
    this.sunGlow.visible = stage !== "surface";
    (this.constellation.material as THREE.LineBasicMaterial).opacity =
      stage === "surface" ? 0.25 : this.state.focusId ? 0.4 : 0.9;
    (this.egoLines.material as THREE.LineBasicMaterial).opacity = stage === "surface" ? 0.3 : 0.72;

    // 선택 링은 화면상 크기를 고정한다 — 표식은 거리 정보를 나르지 않는다
    const selId = this.state.focusId;
    const selIdx = selId ? this.index.get(selId) : undefined;
    if (selIdx !== undefined && !this.state.landedId) {
      const c = (this.dirs[selIdx] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      const dCam = c.distanceTo(this.camera.position);
      this.selRing.position.copy(c);
      const worldPerPx = (2 * Math.tan((this.camera.fov * Math.PI) / 360) * dCam) / h;
      this.selRing.scale.setScalar(worldPerPx * 46);
      this.selRing.visible = true;
    } else {
      this.selRing.visible = false;
    }
    this.orientCities();
    this.updateLabels();
    this.renderer.render(this.scene, this.camera);
    let drawn = 0;
    for (let i = 0; i < this.order.length; i++) if (alpha.getX(i) > 0.02) drawn++;
    const landedRec = this.state.landedId ? this.bodies.get(this.state.landedId) : undefined;
    this.metrics = {
      stage,
      dist: Math.round(dist),
      bodies: resolved,
      labels: this.labels.lastShown,
      frames: this.metrics.frames + 1,
      stars: drawn,
      ego: this.state.ego.length,
      crust: (landedRec?.mesh.userData.crust as string | undefined) ?? null
    };
  }

  /** 판은 표면에 서 있고(+Y = 지면 법선) 관측자를 향해 돈다 — 축 고정 빌보드 */
  private orientCities(): void {
    if (!this.cityRecords.length) return;
    const m = new THREE.Matrix4();
    const right = new THREE.Vector3();
    const fwd = new THREE.Vector3();
    for (const c of this.cityRecords) {
      const up = c.obj.userData.dir as THREE.Vector3 | undefined;
      if (!up) continue;
      fwd.copy(this.camera.position).sub(c.obj.position);
      fwd.addScaledVector(up, -fwd.dot(up));
      if (fwd.lengthSq() < 1e-9) continue;
      fwd.normalize();
      right.crossVectors(up, fwd).normalize();
      m.makeBasis(right, up, fwd);
      c.obj.quaternion.setFromRotationMatrix(m);
    }
  }

  private updateLabels(): void {
    const w = this.renderer.domElement.clientWidth;
    const h = this.renderer.domElement.clientHeight;
    const items: LabelItem[] = [];
    const v = new THREE.Vector3();
    const camDir = this.camera.getWorldDirection(new THREE.Vector3());
    const s = this.state;

    if (this.stage !== "surface") {
      // 원경은 이름을 아끼는 자리다. 사조 성좌 이름이 먼저 오고, 개별 작가는
      // 밝은 별·선택·호버·읽은 별만 말한다(8차 리뷰의 bystander 침묵 규칙 계승).
      if (s.lens)
        for (const g of s.lens.groups.slice(0, 8)) {
          const c = new THREE.Vector3();
          let n = 0;
          for (const m of g.memberIds) {
            const i = this.index.get(m);
            if (i === undefined || !this.present(i)) continue;
            c.add(this.dirs[i] as THREE.Vector3);
            n++;
          }
          // 아직 아무도 태어나지 않은 성좌는 이름도 없다
          if (n < 2) continue;
          c.divideScalar(n).normalize().multiplyScalar(SHELL_R * 1.02);
          const toward = c.clone().sub(this.camera.position).normalize();
          if (toward.dot(camDir) < 0.3) continue;
          v.copy(c).project(this.camera);
          if (v.z > 1) continue;
          items.push({
            id: `grp:${g.id}`,
            text: g.label,
            kind: "movement",
            size: "md",
            priority: 700,
            x: ((v.x + 1) / 2) * w,
            y: ((-v.y + 1) / 2) * h,
            state: "normal",
            color: g.color
          });
        }
      const sky = this.stage === "sky";
      for (let i = 0; i < this.order.length; i++) {
        const id = this.order[i] as string;
        const a = this.authorAt(i);
        if (!a) continue;
        if (starLife(a, s.year).presence <= 0.05) continue;
        if (
          s.lens &&
          s.lens.lit.size &&
          !s.lens.lit.has(id) &&
          id !== s.focusId &&
          !s.egoLit.has(id)
        )
          continue;
        const named =
          id === s.focusId ||
          id === s.hoveredId ||
          s.egoLit.has(id) ||
          s.read.has(id) ||
          s.want.has(id) ||
          (this.mags[i] ?? 0) > (sky ? 0.62 : 0.3);
        if (!named) continue;
        const world = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
        const toward = world.clone().sub(this.camera.position).normalize();
        if (toward.dot(camDir) < 0.28) continue;
        v.copy(world).project(this.camera);
        if (v.z > 1) continue;
        const mag = this.mags[i] ?? 0;
        // "neighbor" 는 그리디 예산을 우회한다(labels.ts). 렌즈가 켜지면 밝혀진
        // 별이 수십 개라 그 상태를 주면 원경이 이름으로 뒤덮인다(실측 41개).
        // 예산을 넘겨도 되는 것은 선택 자신과 그 자기 성좌뿐이다.
        const state =
          id === s.focusId || id === s.landedId
            ? "selected"
            : id === s.hoveredId
              ? "hovered"
              : s.egoLit.has(id)
                ? "neighbor"
                : "normal";
        items.push({
          id,
          text: a.names.ko,
          kind: "author",
          size: mag > 0.6 ? "lg" : mag > 0.3 ? "md" : "sm",
          priority:
            (id === s.focusId ? 400 : 0) +
            (id === s.hoveredId ? 200 : 0) +
            (s.read.has(id) ? 60 : 0) +
            mag * 100,
          x: ((v.x + 1) / 2) * w,
          y: ((-v.y + 1) / 2) * h + 14,
          state
        });
      }
    } else {
      for (const c of this.cityRecords) {
        const work = this.data.works.find((x) => x.id === c.workId);
        if (!work) continue;
        v.copy(c.pos).project(this.camera);
        if (v.z > 1) continue;
        const toward = c.pos.clone().sub(this.camera.position).normalize();
        if (toward.dot(camDir) < 0.1) continue;
        items.push({
          id: c.workId,
          text: work.titleKo,
          kind: "work",
          size: "sm",
          priority: work.id === s.selectedWorkId ? 400 : 100,
          x: ((v.x + 1) / 2) * w,
          y: ((-v.y + 1) / 2) * h + 10,
          state: work.id === s.selectedWorkId ? "selected" : "normal",
          interactive: true,
          ariaLabel: `${work.titleKo} — 작품 열기`
        });
      }
      const landed = s.landedId ? this.data.authors.find((a) => a.id === s.landedId) : null;
      if (landed) {
        const i = this.index.get(landed.id);
        if (i !== undefined) {
          const c = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
          v.copy(c).project(this.camera);
          if (v.z <= 1)
            items.push({
              id: `landed:${landed.id}`,
              text: landed.names.ko,
              kind: "author",
              size: "lg",
              priority: 900,
              x: ((v.x + 1) / 2) * w,
              y: 58,
              state: "selected"
            });
        }
      }
    }
    this.labels.onActivate = (id) => this.cb.onPickWork(id);
    this.labels.update(items, w, h, this.stage === "surface" ? 40 : this.stage === "sky" ? 18 : 32);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("resize", this.onResize);
    this.labels.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
