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
import type { ArtManifest } from "../globe/art-assets.ts";
import { artUrl } from "../globe/art-assets.ts";
import { LabelLayer, type LabelItem } from "../globe/labels.ts";
import {
  CAM_SKY_DEFAULT,
  CAM_SKY_MAX,
  LANDING_ALT,
  LENS_DIST,
  LENS_MAG,
  SHELL_R,
  STAR_TO_DISC_PX,
  apparentRadiusPx,
  bodyRadius,
  genreHarmonics,
  influenceWeight,
  magnitude,
  representationFor,
  starLife,
  lensPosition,
  starPixels,
  tintOf,
  silhouetteRadius,
  SHELF_LON,
  SHELF_AXIS_DEG,
  SHELF_EYE_LIFT,
  LANDING_INCIDENCE_DEG,
  SHELF_ROW_LAT,
  VOL_ASPECT,
  VOL_DEPTH,
  VOL_AIR,
  volumeWidth,
  shelfLongitudes,
  shelfTickStep,
  yearToLon
} from "./grammar.ts";
import { indexGlyph } from "./lenses.ts";
import { isLandable } from "./readiness.ts";
import type { AssetSet } from "./assets.ts";
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
  /** 지목된 한 그룹의 색인 번호만 하늘에 표시된다. 별의 밝기·색·링은 무접촉 */
  lensMarks: Map<string, number[]>;
  /** 범례에서 지목된 그룹의 구성원 — 이름표를 강제로 띄운다(목록↔하늘 연동) */
  lensGroupFocus: Set<string> | null;
  /** 이 렌즈가 실제 관계선을 그리는가 — 속성 색인층은 false */
  lensRelationGroups: boolean;
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
/** 준비되지 않은 천체가 강제로 머무는 표현 단계 */
const REP_STAR = "star" as const;

/** 궤적 한 개당 침목 틱 수 — 원공간 등간격으로 잡아 압축을 눈금화한다 */
const TRACE_TICKS = 7;

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
  private selWedges: THREE.Sprite[] = [];
  private selCorners: THREE.Sprite[] = [];
  private readLamp: THREE.PointLight;

  private bodies = new Map<string, BodyRecord>();
  private cityGroup = new THREE.Group();
  private cityRecords: Array<{
    workId: string;
    obj: THREE.Object3D;
    pos: THREE.Vector3;
    year: number;
    /** 제본된 책 — 정면/책등은 이 회전에서 읽는다 */
    book: THREE.Group;
    /** 책등판 — 어느 면이 관측자를 향하는지는 이 메시의 월드 법선이 정본이다 */
    spine: THREE.Mesh;
    /** 앞표지판 — 정면에 실물 표지가 붙었는지 계약이 여기서 읽는다 */
    front: THREE.Mesh;
    halfW: number;
    halfH: number;
    halfD: number;
    /** 0 = 입문 경로 단, 1 = 그 외 단 */
    row: number;
    /** readingOrder 안에서의 자리(없으면 -1) — 색인 글리프가 이걸 나른다 */
    orderIndex: number;
    /** 배치 경도(연도 축) — 계약이 연도 단조성과 분산을 검사한다 */
    lon: number;
  }> = [];
  /** 난간·눈금·연도 — 책이 아닌 서가 부속. 착륙 해제 시 같이 걷힌다 */
  private cityChrome: THREE.Object3D[] = [];
  /** 서가 부속이 놓인 자리 — 계약이 "지각 안에 묻히지 않았는가"를 여기서 잰다 */
  private cityAnchors: THREE.Vector3[] = [];
  /** 난간에 실제로 새겨진 연도 눈금 수. 난간 자리 수와 **따로** 센다 —
   *  합치면 난간 두 줄만으로 정족수가 차서 눈금이 0개여도 계약이 초록이다. */
  private cityTicks = 0;
  private geoCache = new Map<string, THREE.BufferGeometry>();
  private texCache = new Map<string, THREE.Texture>();
  /** 사전 로드된 실물 자산 — 착륙 시점에 이미 디코드되어 있다 */
  private assets: AssetSet | null = null;

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
    egoLit: new Set(),
    lensMarks: new Map(),
    lensGroupFocus: null,
    lensRelationGroups: false
  };
  private stage: Stage = "sky";
  private anim: {
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    fromUp: THREE.Vector3;
    toUp: THREE.Vector3;
    start: number;
    dur: number;
  } | null = null;
  /** 관측 렌즈 진행도 0..1 — 진입/이탈 애니메이션이 왜곡을 눈에 보이게 한다 */
  private lensK = 0;
  private lensKTarget = 0;
  /** authorId → 압축된 목적지(월드) */
  private lensTarget = new Map<string, THREE.Vector3>();
  private lensStars!: THREE.Points;
  private lensStarGeo!: THREE.BufferGeometry;
  private lensTraces!: THREE.LineSegments;
  private lensIds: string[] = [];
  /** 착륙 시 주시점(지면 위 한 점) — 궤도 회전이 이 점을 중심으로 돈다 */
  private landTarget: THREE.Vector3 | null = null;
  /** 착륙이 자산보다 먼저 도착한 적이 있는가 — 사전 로드 계약의 관측점 */
  private landedWithoutAssets = false;
  private lastSkyLabels = 0;
  private lastCrustLabels = 0;
  private lastCrustAuthorLabels = 0;
  private safeLeft = 0;
  private safeRight = 0;
  private raf = 0;
  private disposed = false;
  /** instrumentation for the QA harness */
  metrics = {
    stage: "sky" as Stage,
    dist: CAM_SKY_DEFAULT,
    bodies: 0,
    labels: 0,
    skyLabels: 0,
    crustLabels: 0,
    crustAuthorLabels: 0,
    frames: 0,
    /** 화면에 실제로 그려진 별 — 착륙해도 하늘이 남는지의 증거 */
    stars: 0,
    /** 선택된 별의 자기 성좌 선 수 */
    ego: 0,
    /** 착륙한 천체의 지각 종류: manuscript(육필) | paper(백지) | null */
    crust: null as string | null,
    /** 관측 렌즈 진행도(0..1)와 일률 배율 — 회귀 방지용 계측 */
    lensK: 0,
    lensMag: 1,
    lensMoved: 0,
    /** 선택 대상이 항성+궤도 아카이브 상태인가 (준비되지 않은 작가) */
    orbitArchive: false,
    /** 착륙 대상의 실물 자산이 착륙 이전에 디코드되어 있었는가 */
    assetsPreloaded: false,
    landedWithoutAssets: false,
    /** 작품 도시(연도 서가) — 전부 렌더에서 잰다. cityMetrics() 참조 */
    cities: {
      faceOut: 0,
      spineOut: 0,
      spineFacing: 0,
      coverFacing: 0,
      spineDressed: 0,
      coverDressed: 0,
      byYear: true,
      lonSpreadDeg: 0,
      rows: 0,
      overlaps: 0,
      minGapPx: -1,
      crossHidden: 0,
      chrome: 0,
      chromeBuried: 0,
      ticks: 0,
      ordered: [] as string[],
      rowFrontY: -1,
      rowBackY: -1,
      uprightRatio: -1,
      total: 0
    }
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
    this.buildSelMarks();
    this.constellation = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })
    );
    this.constellation.frustumCulled = false;
    this.scene.add(this.constellation);
    // 궤적은 관계선과 **다른 프리미티브**다(R11-d).
    //   · 관계선은 서로 다른 두 천체를 잇는다 — 연속 획, 관계 유형 색.
    //   · 궤적은 한 천체를 자기 자신에게 잇는다 — 연결이 아니라 **변위 기록**.
    // 그래서 획이 아니라 **침목 틱열**로 그린다. 틱을 원공간 등간격으로 잡아
    // 각각 lensPosition() 을 통과시키므로 **압축이 강한 구간에서 틱이 몰린다** —
    // 왜곡이 보이는 것을 넘어 측정 가능해진다.
    // 잉크는 --stitch #7a6644: 관계 6색 색역 밖이고(L 0.1406 < 최저 0.2237),
    // bg 대비 3.52:1 로 그래픽 하한을 넘는다. --line-accent(2.90:1)는 미달.
    this.lensTraces = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: new THREE.Color(COLORS.stitch),
        transparent: true,
        opacity: 0
      })
    );
    this.lensTraces.frustumCulled = false;
    this.scene.add(this.lensTraces);
    this.lensStarGeo = new THREE.BufferGeometry();
    this.lensStars = new THREE.Points(this.lensStarGeo, this.starMat);
    this.lensStars.frustumCulled = false;
    this.lensStars.visible = false;
    this.scene.add(this.lensStars);
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

  /**
   * 선택 표식 — **관측 표식(觀測標識)**. 조준환을 폐기한다(R11-d).
   *
   * 천문 도판에서 대상은 십자선으로 덮지 않는다 — 측광을 해야 하므로 덮을 수
   * 없고, 그래서 **마주 보는 두 개의 짧은 표식**으로 가리킨다. 표식은 천체와
   * **같은 거리 사다리로 해상된다**: 별이면 쐐기 2개, 원반이면 모서리 레지스터
   * 4개, 표면이면 물러난다(읽기 거리에서 식별 크롬은 절하고 퇴장한다).
   */
  private buildSelMarks(): void {
    const wedge = document.createElement("canvas");
    wedge.width = wedge.height = 64;
    const wc = wedge.getContext("2d");
    if (wc) {
      wc.fillStyle = COLORS.vermilion;
      wc.beginPath();
      wc.moveTo(32, 4); // 꼭짓점이 별을 향한다
      wc.lineTo(58, 60);
      wc.lineTo(6, 60);
      wc.closePath();
      wc.fill();
    }
    const wtex = new THREE.CanvasTexture(wedge);

    const corner = document.createElement("canvas");
    corner.width = corner.height = 64;
    const cc = corner.getContext("2d");
    if (cc) {
      cc.strokeStyle = COLORS.vermilion;
      cc.lineWidth = 9; // 64px 캔버스 → 화면 2px 상당
      cc.beginPath();
      cc.moveTo(4, 60);
      cc.lineTo(4, 4);
      cc.lineTo(60, 4);
      cc.stroke();
    }
    const ctex = new THREE.CanvasTexture(corner);

    const mk = (tex: THREE.Texture, rot: number): THREE.Sprite => {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          opacity: 0.92,
          rotation: rot
        })
      );
      sp.visible = false;
      this.scene.add(sp);
      return sp;
    };
    // 대각 한 축의 쐐기 2개 — 교차점이 생기지 않아 조준환으로 읽히지 않는다
    this.selWedges = [mk(wtex, (-45 * Math.PI) / 180), mk(wtex, (135 * Math.PI) / 180)];
    this.selCorners = [
      mk(ctex, 0),
      mk(ctex, -Math.PI / 2),
      mk(ctex, Math.PI),
      mk(ctex, Math.PI / 2)
    ];
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
  setSafeInsets(left: number, right: number): void {
    if (left === this.safeLeft && right === this.safeRight) return;
    this.safeLeft = left;
    this.safeRight = right;
    this.applyViewOffset();
  }

  private applyViewOffset(): void {
    const w = this.renderer.domElement.clientWidth || 1;
    const h = this.renderer.domElement.clientHeight || 1;
    const dx = (this.safeRight - this.safeLeft) / 2;
    if (Math.abs(dx) < 1) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, dx, 0, w, h);
    this.camera.updateProjectionMatrix();
  }

  /** 접근이 시작될 때 디코드까지 끝난 자산 묶음을 받는다 */
  setAssets(set: AssetSet | null): void {
    this.assets = set;
    for (const rec of this.bodies.values()) rec.textured = false;
    if (this.state.landedId) this.refreshCities();
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
    this.rebuildLens();
    this.refreshConstellation();
    if (this.state.landedId !== prevLanded) {
      if (this.state.landedId && this.assets?.authorId !== this.state.landedId)
        this.landedWithoutAssets = true;
      this.refreshCities();
    }
    if (this.state.focusId !== prevFocus || this.state.landedId !== prevLanded) this.retarget();
  }

  /**
   * 별의 상태는 **상호작용 상태만** 반영한다. 관측층 소속은 여기에 손대지
   * 않는다 — 밝기는 영향력, 색은 시대, 링은 개인 궤도가 이미 점유한 채널이고,
   * 렌즈가 그것을 빌려 쓰면 "어두운 별"이 영향력이 낮은 것인지 렌즈 밖인지
   * 구분되지 않는다(R11-b, CPO 제약).
   */
  private starState(id: string): { boost: number; dim: number } {
    const s = this.state;
    if (id === s.landedId || id === s.focusId) return { boost: 1.55, dim: 1 };
    if (id === s.hoveredId) return { boost: 1.3, dim: 1 };
    if (s.egoLit.has(id)) return { boost: 1.22, dim: 1 };
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

  /** 렌즈가 걸린 별의 화면상 실효 위치. 라벨·픽·관계선이 모두 이걸 쓴다 */
  private effectivePos(id: string, out: THREE.Vector3): THREE.Vector3 {
    const i = this.index.get(id);
    if (i === undefined) return out.set(0, 0, 0);
    out.copy(this.dirs[i] as THREE.Vector3).multiplyScalar(SHELL_R);
    const t = this.lensTarget.get(id);
    if (t && this.lensK > 0) out.lerp(t, this.lensK);
    return out;
  }

  /**
   * 렌즈 목적지 계산 — 각방향은 그대로, 반경만 압축.
   * 선택 천체 자신은 움직이지 않는다(관측의 기준점이므로).
   */
  private rebuildLens(): void {
    this.lensTarget.clear();
    this.lensIds = [];
    const focus = this.state.focusId;
    if (!focus || this.state.landedId) {
      this.lensKTarget = 0;
      this.rebuildLensBuffers();
      return;
    }
    const fi = this.index.get(focus);
    if (fi === undefined) return;
    const c = (this.dirs[fi] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
    const members = [...this.state.egoLit].filter((id) => id !== focus && this.index.has(id));
    if (!members.length) {
      this.lensKTarget = 0;
      this.rebuildLensBuffers();
      return;
    }
    const v = new THREE.Vector3();
    const dists = members.map((id) => {
      const i = this.index.get(id) as number;
      return v.copy(this.dirs[i] as THREE.Vector3).multiplyScalar(SHELL_R).distanceTo(c);
    });
    const dMin = Math.min(...dists);
    const dMax = Math.max(...dists);
    members.forEach((id) => {
      const i = this.index.get(id) as number;
      const p = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      const q = lensPosition([c.x, c.y, c.z], [p.x, p.y, p.z], dMin, dMax);
      this.lensTarget.set(id, new THREE.Vector3(q[0], q[1], q[2]));
    });
    this.lensIds = members;
    this.lensKTarget = 1;
    this.rebuildLensBuffers();
  }

  /** 압축된 사본(별)과 원위치로 이어지는 궤적 */
  private rebuildLensBuffers(): void {
    const n = this.lensIds.length;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const px = new Float32Array(n);
    const alpha = new Float32Array(n);
    const spike = new Float32Array(n);
    const ring = new Float32Array(n);
    const srcCol = this.starGeo.getAttribute("aColor") as THREE.BufferAttribute;
    const srcPx = this.starGeo.getAttribute("aPx") as THREE.BufferAttribute;
    this.lensIds.forEach((id, k) => {
      const i = this.index.get(id) as number;
      col[k * 3] = srcCol.getX(i);
      col[k * 3 + 1] = srcCol.getY(i);
      col[k * 3 + 2] = srcCol.getZ(i);
      px[k] = srcPx.getX(i);
      alpha[k] = 1;
      spike[k] = 1;
      ring[k] = this.state.want.has(id) ? 1 : 0;
    });
    const g = this.lensStarGeo;
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.setAttribute("aPx", new THREE.BufferAttribute(px, 1));
    g.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    g.setAttribute("aSpike", new THREE.BufferAttribute(spike, 1));
    g.setAttribute("aRing", new THREE.BufferAttribute(ring, 1));
    const trace = new Float32Array(n * TRACE_TICKS * 6);
    const tg = new THREE.BufferGeometry();
    tg.setAttribute("position", new THREE.BufferAttribute(trace, 3));
    this.lensTraces.geometry.dispose();
    this.lensTraces.geometry = tg;
  }

  /** 매 프레임: 렌즈 사본 위치와 궤적을 실효 위치로 갱신 */
  private updateLensBuffers(): void {
    const n = this.lensIds.length;
    this.lensStars.visible = n > 0 && this.lensK > 0.01;
    this.lensTraces.visible = this.lensStars.visible;
    if (!this.lensStars.visible) return;
    const pos = this.lensStarGeo.getAttribute("position") as THREE.BufferAttribute;
    const alpha = this.lensStarGeo.getAttribute("aAlpha") as THREE.BufferAttribute;
    const tr = this.lensTraces.geometry.getAttribute("position") as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const perp = new THREE.Vector3();
    const camDir = this.camera.getWorldDirection(new THREE.Vector3());
    const h = this.renderer.domElement.clientHeight || 900;
    this.lensIds.forEach((id, k) => {
      const i = this.index.get(id) as number;
      const orig = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      this.effectivePos(id, v);
      pos.setXYZ(k, v.x, v.y, v.z);
      alpha.setX(k, this.lensK);
      // 침목: 원위치→압축위치 경로를 원공간 등간격으로 나눈 지점마다
      // 경로에 수직인 짧은 틱. 화면상 길이를 고정해 거리와 무관하게 읽힌다.
      for (let t = 0; t < TRACE_TICKS; t++) {
        const s0 = (t + 0.5) / TRACE_TICKS;
        a.copy(orig).lerp(v, s0);
        b.copy(orig).lerp(v, Math.min(1, s0 + 0.02));
        dir.copy(b).sub(a);
        if (dir.lengthSq() < 1e-9) dir.set(1, 0, 0);
        perp.crossVectors(dir, camDir).normalize();
        const worldPerPx =
          (2 * Math.tan((this.camera.fov * Math.PI) / 360) * a.distanceTo(this.camera.position)) / h;
        const half = worldPerPx * 2.5;
        const o = (k * TRACE_TICKS + t) * 2;
        tr.setXYZ(o, a.x - perp.x * half, a.y - perp.y * half, a.z - perp.z * half);
        tr.setXYZ(o + 1, a.x + perp.x * half, a.y + perp.y * half, a.z + perp.z * half);
      }
    });
    pos.needsUpdate = true;
    alpha.needsUpdate = true;
    tr.needsUpdate = true;
    (this.lensTraces.material as THREE.LineBasicMaterial).opacity = 0.55 * this.lensK;
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
      const pa = this.effectivePos(l.a, new THREE.Vector3());
      const pb = this.effectivePos(l.b, new THREE.Vector3());
      const c = new THREE.Color(l.color);
      const k = 0.3 + 0.7 * l.weight;
      const off = n * 6;
      pos[off] = pa.x;
      pos[off + 1] = pa.y;
      pos[off + 2] = pa.z;
      pos[off + 3] = pb.x;
      pos[off + 4] = pb.y;
      pos[off + 5] = pb.z;
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
      const r = silhouetteRadius(h, v.x, v.y, v.z);
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
    // 근거 없는 인장은 폐기됐다(CPO 2026-08-20). 아무것도 대신 새기지 않는다 —
    // 끼워지지 않은 판에는 아무것도 새겨져 있지 않다. 착륙 게이트상 이 지각은
    // 유저에게 열리지 않으므로, 빈 채로 두는 것이 유일하게 정직하다.
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
    const a = this.data.authors.find((x) => x.id === rec.id);
    if (!a) return;
    const ground = this.data.art?.grounds?.[rec.id];
    const pre0 = this.assets?.authorId === rec.id ? this.assets.ground : null;
    // **원고가 있어야 하는데 아직 도착하지 않았으면 칠하지 않고, 잠그지도
    // 않는다.** 첫 페인트가 이기게 두면(실측 버그) 자산이 뒤늦게 와도 지각이
    // 백지로 굳는다 — 딥링크로 곧장 착륙할 때 정확히 그렇게 됐다.
    if (ground && !pre0) return;
    rec.textured = true;
    // 지각을 칠할 때 형상도 고해상으로 바꾼다(다각형 윤곽이 보이면 종이가 아니다)
    rec.mesh.geometry = this.bodyGeometry(a, "hi");
    rec.mat.color.set(0xd6cdba);
    const pre = pre0;
    if (ground && pre) {
      // R10 의 지면 고스트(잉크 16%)는 평면 플레이트 아래 깔리도록 만든 값이다.
      // 조명 받는 구면에서 그대로 쓰면 흰 공이 된다 — 같은 원고를 잉크
      // 존재감만 올려 다시 굽는다(자료를 바꾸는 게 아니라 노출을 바꾼다).
      const c = document.createElement("canvas");
      c.width = pre.naturalWidth;
      c.height = pre.naturalHeight;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.drawImage(pre, 0, 0);
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
      }
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
    const drop = (o: THREE.Object3D): void => {
      this.cityGroup.remove(o);
      o.traverse((n) => {
        const m = n as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
    };
    for (const c of this.cityRecords) drop(c.obj);
    for (const o of this.cityChrome) drop(o);
    this.cityRecords = [];
    this.cityChrome = [];
    this.cityAnchors = [];
    this.cityTicks = 0;
  }

  private refreshCities(): void {
    this.clearCities();
    const id = this.state.landedId;
    if (!id) return;
    const rec = this.ensureBody(id);
    if (!rec) return;
    const author = this.data.authors.find((a) => a.id === id);
    const works = this.data.works.filter((w) => w.authorId === id);
    if (!works.length) return;

    // ——— 배치: 실제 데이터가 정한다 ———
    // 황금각 나선은 폐기됐다(CPO 2026-08-20) — 아름다웠지만 아무것도 말하지
    // 않았다. 경도 = 발표 연도, 단(段) = 입문 경로 소속. 둘 다 /data 에
    // 실재하는 값이다. 입문 **순서**는 라벨의 색인 글리프가 나른다
    // (grammar.ts 서가 절: 위도 미세 단차는 곡면 사입 시점에서 순서로 읽히지
    // 않았고, 책 높이보다 훨씬 작아서 이웃한 연도의 두 권을 관통시켰다).
    const order = author?.readingOrder ?? [];
    // 서가의 좌표계는 **관측자의 화면에서** 정의된다. 기준축은 반경 축이 아니라
    // 카메라가 실제로 내려앉는 지면이고(반경 축을 쓰면 비스듬한 착륙에서 서가가
    // 통째로 림으로 밀려난다), 좌우와 앞뒤도 월드 상방이 아니라 시선이 정한다.
    // 월드 상방으로 세우면 껍질의 어느 반구에 앉은 작가냐에 따라 연도 축이
    // 좌우로 뒤집히고 앞단과 뒷단이 자리를 바꾼다(실측: 카프카에서 1926 이 왼쪽
    // 끝에 섰다).
    const radial = rec.center.clone().normalize();
    const outward = this.arrivalDir(radial, SHELF_AXIS_DEG);
    const camDir = this.arrivalDir(radial, SHELF_AXIS_DEG + LANDING_INCIDENCE_DEG);
    const right = new THREE.Vector3().crossVectors(outward, camDir).normalize();
    const toward = camDir.clone().addScaledVector(outward, -camDir.dot(outward)).normalize();
    // 축 v 를 축 a 로 돌리면 v 는 (a × v) 방향으로 움직인다 — 그래서 경도 축은
    // outward × right 이고(θ>0 이면 오른쪽), 위도 축은 outward × toward 다
    // (φ>0 이면 관측자 쪽).
    const lonAxis = new THREE.Vector3().crossVectors(outward, right).normalize();
    const latAxis = new THREE.Vector3().crossVectors(outward, toward).normalize();

    const bw = rec.radius * volumeWidth(works.length);
    const bh = bw * VOL_ASPECT;
    const bd = bw * VOL_DEPTH;
    // 최소 간격은 **책이 실제로 차지하는 각폭**이다. 이보다 좁으면 두 권이
    // 서로를 관통한다 — 계약이 아니라 기하다.
    const minGap = (bw / rec.radius) * VOL_AIR;
    const lons = shelfLongitudes(
      works.map((w) => w.year),
      minGap
    );

    const dirAt = (theta: number, phi: number): THREE.Vector3 =>
      outward.clone().applyAxisAngle(lonAxis, theta).applyAxisAngle(latAxis, phi).normalize();
    // 표면에 놓이는 것은 전부 **그 방향의 실제 표면**에 놓는다. 실루엣이
    // ±6% 로 출렁이므로 상수 반경을 쓰면 부푼 쪽에서 통째로 묻힌다.
    const harm = author ? genreHarmonics(author) : ([0, 0, 0, 0] as [number, number, number, number]);
    const onSurface = (d: THREE.Vector3, lift: number): THREE.Vector3 =>
      rec.center.clone().addScaledVector(d, rec.radius * (silhouetteRadius(harm, d.x, d.y, d.z) + lift));
    // 앞단(관측자 쪽) = 입문 경로, 뒷단 = 그 외. 두 단의 위도차는 책 높이보다
    // 크다 — 앞단이 뒷단을 삼키지 않는 유일한 조건이다.
    const rowPhi = (inOrder: boolean): number => (inOrder ? 1 : -1) * SHELF_ROW_LAT * 0.5;

    // ——— 난간: 연도 축을 물건으로 만든다 ———
    // 최소 간격이 비례를 밀어낸 자리는 감추지 않는다. 눈금이 책과 **같은
    // 사상**(yearToLon)을 통과하므로, 밀린 구간에서는 눈금 간격도 같이 벌어진다.
    const pairs = works.map((w, i) => [w.year, lons[i] as number] as const);
    const yrs = works.map((w) => w.year);
    const yLo = Math.min(...yrs);
    const yHi = Math.max(...yrs);
    const railMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLORS.stitch),
      roughness: 0.8,
      metalness: 0.2
    });
    // 난간은 **책의 발치**에, 같은 위도에 놓인다. 앞으로 밀어 놓으면 사입
    // 시점에서 위도차가 큰 화면 거리로 벌어져 책이 허공에 뜬 것처럼 보인다
    // (실측: 뒷단의 두 권이 제 난간에서 35px 떠 있었다). 같은 위도에 두면
    // 난간은 권과 권 사이로만 드러나는데, 그것이 서가가 실제로 보이는 방식이다.
    const railOffset = (bw * 0.5) / rec.radius + 0.014;
    for (const inOrder of [true, false]) {
      if (!works.some((w) => order.includes(w.id) === inOrder)) continue;
      const front = rowPhi(inOrder);
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 28; k++) {
        const th = -SHELF_LON * 1.1 + SHELF_LON * 2.2 * (k / 28);
        const q = onSurface(dirAt(th, front), 0);
        pts.push(q);
        if (k % 7 === 0) this.cityAnchors.push(q.clone());
      }
      const rail = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, rec.radius * 0.010, 6, false),
        railMat
      );
      this.cityGroup.add(rail);
      this.cityChrome.push(rail);
      if (!inOrder) continue;
      // 눈금은 앞 난간에만 새긴다. 축은 두 단이 공유하므로 한 번이면 된다.
      const step = shelfTickStep(yLo, yHi);
      const tickPts: THREE.Vector3[] = [];
      // 최소 간격이 밀어낸 구간에서는 눈금끼리도 붙는다(실측: 타고르의
      // 1895·1900·1905 가 한 덩어리로 겹쳤다). 겹친 눈금은 **버린다** —
      // 없는 눈금은 축을 덜 말할 뿐이지만, 겹친 눈금은 틀린 축을 말한다.
      let lastTh = -Infinity;
      const tickGap = minGap * 0.62;
      for (let y = Math.ceil(yLo / step) * step; y <= yHi; y += step) {
        const th = yearToLon(y, pairs);
        if (th - lastTh < tickGap) continue;
        lastTh = th;
        const a = onSurface(dirAt(th, front), 0);
        const spur = dirAt(th, front + railOffset * 1.15);
        const b = onSurface(spur, 0.004);
        tickPts.push(a, b);
        this.cityAnchors.push(a.clone(), b.clone());
        this.cityTicks++;
        const numeral = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: this.numeralTexture(y),
            transparent: true,
            depthWrite: false
          })
        );
        // 눈금 끝(b)에서 난간 반대쪽으로 조금 더 — 숫자가 난간에 얹히지 않는다
        numeral.position.copy(b).addScaledVector(b.clone().sub(a), 0.55);
        numeral.scale.set(bh * 0.42, bh * 0.19, 1);
        this.cityGroup.add(numeral);
        this.cityChrome.push(numeral);
      }
      if (tickPts.length) {
        const ticks = new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(tickPts),
          new THREE.LineBasicMaterial({ color: new THREE.Color(COLORS.stitch) })
        );
        this.cityGroup.add(ticks);
        this.cityChrome.push(ticks);
      }
    }

    works.forEach((w, i) => {
      const oi = order.indexOf(w.id);
      const theta = lons[i] as number;
      const dir = dirAt(theta, rowPhi(oi >= 0));
      const surface = onSurface(dir, -0.002);

      const group = new THREE.Group();
      group.position.copy(surface);
      group.userData.workId = w.id;
      group.userData.dir = dir;
      // 세울 때 쓰는 상방은 **서가 한가운데의 지면 법선 하나**다. 권마다 제
      // 자리의 법선을 쓰면 곡률만큼 부챗살로 벌어지고(실측: 양 끝에서 20°가
      // 넘었다) 서가가 아니라 쓰러지는 책 더미로 읽힌다. 밑동은 여전히 각자의
      // 지면에 놓이므로 서가는 곡면을 따라간다 — 기울기만 공유한다.
      group.userData.up = outward.clone();

      const cover = this.data.art?.covers?.[w.id];
      const vol = this.buildVolume(w, bw, bh, bd, cover?.file);
      group.add(vol.root);

      this.cityGroup.add(group);
      this.cityRecords.push({
        workId: w.id,
        obj: group,
        pos: surface,
        year: w.year,
        // 데이터(cover 유무)가 아니라 **실제 메시 회전**에서 읽는다 — 데이터를
        // 되읽으면 렌더가 규칙을 어겨도 계약이 초록이다(변이 스윕 실측).
        book: vol.root,
        spine: vol.spine,
        front: vol.front,
        halfW: bw * 0.5,
        halfH: bh * 0.5,
        halfD: bd * 0.5,
        row: oi >= 0 ? 0 : 1,
        orderIndex: oi,
        lon: theta
      });
    });
  }

  /**
   * 제본된 책 한 권. **판이 아니라 책이다** — 앞뒤 표지판 두 장, 책등 한 장,
   * 그 사이에 조금 작은 본문 종이 뭉치. 표지판이 머리·발·앞마구리에서 본문보다
   * 조금 튀어나오는 것(square)이 "제본된 물건"의 결정적 단서이고, 상자 하나로는
   * 어떤 재질을 발라도 그 단서가 생기지 않는다. R11-d 초판이 그랬다: 책등을
   * 정면으로 돌려도 두께 없는 띠 하나로 읽혔다.
   *
   * **소장 여부는 방향으로 말한다** — 실물 초판이 있으면 표지가 정면(face-out),
   * 없으면 책등이 정면(spine-out). 밝기나 채도가 아니라 형태가 갈리므로 한눈에
   * 세어진다. 부재가 존재보다 화려하지 않다.
   */
  private buildVolume(
    w: Work,
    bw: number,
    bh: number,
    bd: number,
    coverFile: string | undefined
  ): { root: THREE.Group; spine: THREE.Mesh; front: THREE.Mesh } {
    const root = new THREE.Group();
    const t = bd * 0.13; // 표지판 두께
    const sq = t * 0.85; // square — 표지판이 본문보다 튀어나온 폭
    const boardMat = new THREE.MeshStandardMaterial({
      map: this.clothTexture(),
      roughness: 0.96
    });
    const leavesMat = new THREE.MeshStandardMaterial({
      map: this.leavesTexture(),
      roughness: 0.94
    });
    const faceMat = coverFile
      ? new THREE.MeshStandardMaterial({ map: this.coverTexture(w.id, coverFile), roughness: 0.86 })
      : new THREE.MeshStandardMaterial({ map: this.clothTexture(), roughness: 0.96 });
    const spineMat = new THREE.MeshStandardMaterial({
      map: this.spineTexture(w.id, w.titleKo),
      roughness: 0.92
    });

    // BoxGeometry 재질 순서: +X, -X, +Y, -Y, +Z, -Z
    // 표지판은 책등판에 **맞대어** 놓는다. 전폭으로 만들면 표지판의 +X 끝이
    // 책등판 안으로 들어가 두 메시의 바깥면이 정확히 동일 평면이 되고, 책등
    // 얼굴의 위아래 끝이 z-fighting 으로 어른거린다(판형이 작을수록 더 눈에
    // 띈다). 폭을 t 만큼 줄이고 -X 로 t/2 옮기면 면이 맞닿기만 한다.
    const boardW = bw - t;
    const front = new THREE.Mesh(new THREE.BoxGeometry(boardW, bh, t), [
      boardMat,
      boardMat,
      boardMat,
      boardMat,
      faceMat,
      boardMat
    ]);
    front.position.set(-t * 0.5, 0, bd * 0.5 - t * 0.5);
    const back = new THREE.Mesh(new THREE.BoxGeometry(boardW, bh, t), boardMat);
    back.position.set(-t * 0.5, 0, -bd * 0.5 + t * 0.5);
    // 책등은 +X. 제본된 쪽이고, 앞마구리(-X)는 종이다.
    const spine = new THREE.Mesh(new THREE.BoxGeometry(t, bh, bd), [
      spineMat,
      boardMat,
      boardMat,
      boardMat,
      boardMat,
      boardMat
    ]);
    spine.position.set(bw * 0.5 - t * 0.5, 0, 0);
    const blockW = bw - t - sq;
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(blockW, bh - sq * 2, bd - t * 2),
      leavesMat
    );
    block.position.set((sq - t) * 0.5, 0, 0);

    root.add(front, back, spine, block);
    root.position.set(0, bh * 0.5, 0);
    root.userData.workId = w.id;
    // 기울이지 않는다. 빌보드가 이미 관측자를 향하고, 여기에 뒤로 눕히는 각을
    // 더하면 구면 곡률과 합쳐져 "누워 있는 판"으로 보인다(실측).
    // −90°는 +X(책등)를 관측자 쪽(+Z)으로 돌린다. +90°는 앞마구리를 돌린다 —
    // 부호를 틀리면 종이 단면을 책등이라고 부르게 된다.
    if (!coverFile) root.rotation.y = -Math.PI / 2;
    return { root, spine, front };
  }

  /** 표지판 클로스 — 씨실날실 결 */
  private clothTexture(): THREE.Texture {
    const hit = this.texCache.get("cloth");
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#6b5e49";
    ctx.fillRect(0, 0, 128, 128);
    ctx.strokeStyle = "rgba(28,21,13,0.30)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 128; i += 3) {
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0);
      ctx.lineTo(i + 0.5, 128);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(240,231,205,0.10)";
    for (let i = 0; i < 128; i += 3) {
      ctx.beginPath();
      ctx.moveTo(0, i + 0.5);
      ctx.lineTo(128, i + 0.5);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 4);
    tex.userData.kind = "cloth";
    this.texCache.set("cloth", tex);
    return tex;
  }

  /**
   * 본문 종이 뭉치의 단면. 낱장이 쌓인 결이 보여야 상자가 아니라 책이 된다 —
   * 표지가 정면인 권에서도 머리와 앞마구리에 이 면이 드러나므로, 실물 표지가
   * 있든 없든 모든 권이 "제본된 물건"으로 읽히는 것은 이 재질이 맡는다.
   */
  private leavesTexture(): THREE.Texture {
    const hit = this.texCache.get("leaves");
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#d8cbab";
    ctx.fillRect(0, 0, 64, 256);
    for (let y = 0; y < 256; y += 2) {
      ctx.fillStyle = y % 4 === 0 ? "rgba(74,60,40,0.34)" : "rgba(240,231,205,0.30)";
      ctx.fillRect(0, y, 64, 1);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.userData.kind = "leaves";
    this.texCache.set("leaves", tex);
    return tex;
  }

  /**
   * 책등. 밴드(제본 이음)와 제목 판넬이 있어야 "돌려세운 책"으로 읽힌다.
   * 제목 글자는 이 크기에서 낱자로 읽히지 않지만, 세로로 흐르는 글줄과 위아래
   * 밴드는 남는다 — 그 실루엣이 책등의 형태소다.
   */
  private spineTexture(workId: string, title: string): THREE.Texture {
    const key = `spine:${workId}`;
    const hit = this.texCache.get(key);
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 96;
    c.height = 384;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#6b5e49";
    ctx.fillRect(0, 0, c.width, c.height);
    // 결
    ctx.strokeStyle = "rgba(28,21,13,0.26)";
    for (let i = 0; i < c.width; i += 3) {
      ctx.beginPath();
      ctx.moveTo(i + 0.5, 0);
      ctx.lineTo(i + 0.5, c.height);
      ctx.stroke();
    }
    // 이음 밴드 — 위아래 두 쌍
    const band = (y: number): void => {
      ctx.fillStyle = "rgba(28,21,13,0.55)";
      ctx.fillRect(0, y, c.width, 7);
      ctx.fillStyle = "rgba(240,231,205,0.20)";
      ctx.fillRect(0, y - 3, c.width, 3);
    };
    // 밴드는 위아래 하나씩이면 된다. 네 줄은 이 크기에서 결로 뭉개진다.
    band(Math.round(c.height * 0.17));
    band(Math.round(c.height * 0.82));
    // 제목 판넬 — 종이 라벨에 잉크. 어두운 가죽에 금박을 쓰면 이 크기에서
    // 판넬 자체가 배경과 붙어 책등이 막대로 읽힌다(실측). 지각의 활판 슬립과
    // 같은 재료를 쓰는 편이 문법에도 맞고 대비도 산다(종이 위 잉크 10.07:1).
    const py0 = Math.round(c.height * 0.235);
    const py1 = Math.round(c.height * 0.775);
    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(4, py0, c.width - 8, py1 - py0);
    ctx.strokeStyle = "rgba(43,32,21,0.55)";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, py0 + 4, c.width - 16, py1 - py0 - 8);
    // 세로 글줄
    ctx.save();
    ctx.translate(c.width * 0.5, (py0 + py1) * 0.5);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = COLORS.paperInk;
    ctx.font = "600 36px 'Noto Serif KR', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 0, 0, py1 - py0 - 18);
    ctx.restore();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    // 계약이 **관측자를 향한 그 면에 무엇이 붙어 있는지** 물을 수 있어야 한다.
    // 기하만 보면 재질 배열이 뒤바뀌어 앞마구리 천이 책등 자리에 와도 초록이다
    // (변이 스윕에서 유일하게 살아남은 변이였다).
    tex.userData.kind = "spine";
    tex.userData.workId = workId;
    this.texCache.set(key, tex);
    return tex;
  }

  /** 난간에 새긴 연도 — 축을 주장하지 않고 읽히게 한다 */
  private numeralTexture(year: number): THREE.Texture {
    const key = `numeral:${year}`;
    const hit = this.texCache.get(key);
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 192;
    c.height = 88;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = "600 56px 'Noto Serif KR', serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(240,231,205,0.72)";
    ctx.fillText(String(year), c.width / 2, c.height / 2 + 3);
    ctx.fillStyle = COLORS.paperInk;
    ctx.fillText(String(year), c.width / 2, c.height / 2);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.texCache.set(key, tex);
    return tex;
  }

  private coverTexture(workId: string, file: string): THREE.Texture {
    const key = `cover:${workId}`;
    const hit = this.texCache.get(key);
    if (hit) return hit;
    const pre = this.assets?.covers.get(workId);
    const tex = pre ? new THREE.Texture(pre) : new THREE.TextureLoader().load(artUrl(file));
    if (pre) tex.needsUpdate = true;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.userData.kind = "cover";
    tex.userData.workId = workId;
    this.texCache.set(key, tex);
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
      this.controls.minDistance = r * 0.6;
      // 착륙의 주시점은 천체 중심이 아니라 **서가가 선 지면**이다. 중심을
      // 겨누면 책이 프레임 가장자리로 밀리고 지각이 화면을 반만 채운다.
      // 지면을 겨누면 카메라가 서가를 가로질러 보게 되고, 서 있는 것이 서 있는
      // 것으로 보이며, 위쪽에 하늘이 남는다.
      const axis = this.arrivalDir(c.clone().normalize(), SHELF_AXIS_DEG);
      // 주시점은 지면보다 조금 위다. 정확히 지면을 겨누면 책이 전부 화면
      // 위쪽 절반에 서고(책은 지면에서 **올라오므로**) 아래 절반이 빈 지각으로
      // 남는다 — 서가가 프레임의 중심에 오도록 책 높이의 절반만큼 올린다.
      const ground = c.clone().addScaledVector(axis, r * (0.92 + SHELF_EYE_LIFT));
      this.landTarget = ground;
      this.flyTo(ground, r * LANDING_ALT, 1150);
      return;
    }
    if (s.focusId) {
      const i = this.index.get(s.focusId);
      if (i === undefined) return;
      const c = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      // 중경 = 관측 렌즈 상태. 거리 자체가 계약이 아니라, 이 거리에서 렌즈가
      // (확대된 천체 + 압축된 이웃 + 원위치 궤적)을 한 프레임에 담는다.
      this.landTarget = null;
      this.flyTo(c.clone(), LENS_DIST, 1050);
      return;
    }
    this.landTarget = null;
    this.flyTo(new THREE.Vector3(0, 0, 0), CAM_SKY_DEFAULT, 1000);
  }

  /**
   * 도착 방향. 천체의 반경 축을 그대로 타고 내려가면 (a) 이웃 별이 전부
   * 방사형으로 퍼져 거미줄처럼 보이고 (b) 항성이 천체 정반대에 놓여 완전한
   * 역광이 된다. 26° 기울여 접근하면 성좌가 입체로, 지각이 초승달로 읽힌다.
   */
  private arrivalDir(radial: THREE.Vector3, deg = 26): THREE.Vector3 {
    const up = Math.abs(radial.y) > 0.92 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    const perp = up.clone().addScaledVector(radial, -up.dot(radial)).normalize();
    return radial.clone().addScaledVector(perp, Math.tan((deg * Math.PI) / 180)).normalize();
  }

  private flyTo(target: THREE.Vector3, dist: number, dur: number): void {
    const dir = this.camera.position.clone().sub(this.controls.target);
    let approach: THREE.Vector3;
    // 착륙하면 화면의 위쪽은 **그 지면의 위쪽**이다. 월드 상방을 그대로 쓰면,
    // 천체의 반경 방향이 월드 아래쪽을 향하는 작가(껍질의 남반구에 자리한
    // 작가)에서 서가가 통째로 뒤집혀 그려진다 — 표지 글자가 거꾸로 서고 책이
    // 난간에 매달린 것처럼 보인다(실측: 카프카). 지평선을 가진 곳에 내려앉는
    // 이상 상방은 지역량이다.
    let toUp = new THREE.Vector3(0, 1, 0);
    if (this.landTarget && target === this.landTarget) {
      approach = this.arrivalDir(target.clone().normalize(), SHELF_AXIS_DEG + LANDING_INCIDENCE_DEG);
      toUp = this.arrivalDir(target.clone().normalize(), SHELF_AXIS_DEG);
    } else if (target.lengthSq() > 1) {
      // 천체를 향할 때는 바깥에서 비스듬히 내려앉는다 — 별들 사이를 통과하는 경로
      // 착륙은 **비스듬히** 내려앉는다. 반경 축을 그대로 타고 내려가면 시선이
      // 지면 법선과 나란해져 표면에 서 있는 것들(제본된 책)을 위에서 내려다보게
      // 되고, 서 있다는 사실 자체가 투영에서 사라진다.
      approach = this.arrivalDir(target.clone().normalize(), dist < 200 ? 52 : 26);
    } else {
      approach = dir.clone().normalize();
    }
    const toPos = target.clone().addScaledVector(approach, dist);
    if (this.state.reducedMotion) {
      this.controls.target.copy(target);
      this.camera.position.copy(toPos);
      this.setCameraUp(toUp);
      this.anim = null;
      return;
    }
    this.anim = {
      fromTarget: this.controls.target.clone(),
      toTarget: target.clone(),
      fromPos: this.camera.position.clone(),
      toPos,
      fromUp: this.camera.up.clone(),
      toUp,
      start: performance.now(),
      dur
    };
  }

  /**
   * 카메라 상방을 바꾼다. OrbitControls 는 상방 회전을 **생성자에서 한 번**
   * 캐시하므로(r172 `_quat`), 그것도 같이 다시 계산해야 드래그가 새 상방을
   * 따른다. 재생성 대신 이 두 값만 갱신하는 이유는 컨트롤을 다시 만들면
   * 감쇠 상태와 진행 중인 포인터 제스처가 끊기기 때문이다.
   */
  private setCameraUp(up: THREE.Vector3): void {
    this.camera.up.copy(up).normalize();
    const c = this.controls as unknown as {
      _quat?: THREE.Quaternion;
      _quatInverse?: THREE.Quaternion;
    };
    if (c._quat && c._quatInverse) {
      c._quat.setFromUnitVectors(this.camera.up, new THREE.Vector3(0, 1, 0));
      c._quatInverse.copy(c._quat).invert();
    }
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
      // 렌즈는 별을 걸러내지 않는다 — 주석(annotation)이지 필터가 아니다
      this.effectivePos(id, v).project(this.camera);
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
      this.setCameraUp(
        new THREE.Vector3().copy(this.anim.fromUp).lerp(this.anim.toUp, e).normalize()
      );
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
      // 배율에는 준비도 조건을 두지 않는다. 준비도 게이트는 바로 아래 표현
      // 사다리 한 곳에만 있다 — 같은 규칙을 두 곳에 두면 **서로를 가려**
      // 한쪽을 지워도 계약이 초록으로 남는다(변이 스윕 실측, 2026-08-20).
      const scaled =
        (this.radii[i] ?? 12) *
        (id === this.state.focusId && !this.state.landedId
          ? 1 + (LENS_MAG - 1) * this.lensK
          : 1);
      const ap = apparentRadiusPx(scaled, d, this.camera.fov, h);
      // 준비되지 않은 작가는 **항성으로 남는다.** 무늬 없는 구로 분해하면
      // 정보는 없고 실망만 있는 표면이 생긴다 — 착륙을 막은 이유가 그것이었다.
      // 궤도 아카이브(궤도 카드)가 그 자리의 경험이다(R11-c).
      const rep: typeof REP_STAR | "resolved" | "surface" = isLandable(id)
        ? representationFor(ap, h)
        : REP_STAR;
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
          // 확대된 상태에서도 지각을 칠한다. 아끼면 중경의 주인공이 **무늬 없는
          // 공**이 되고, 그것은 미준비 작가에게 금지한 바로 그 화면이다.
          // 착륙이 더하는 것은 지각이 아니라 서가와 읽을 것이다.
          // 60px 은 확대된 중경의 실측 겉보기 반경(86px)보다 낮다 — 중경의
          // 주인공이 지각을 갖고 등장한다.
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
    // 렌즈가 옮긴 별은 **원위치에서 유령이 된다.** 이 처리가 없으면 같은 별이
    // 두 곳에서 같은 밝기로 떠 있고, 궤적이 잇는 두 끝이 대칭이라 어느 쪽이
    // 실제인지 말하지 않는다. 살아 있는 쪽은 압축 사본이다(R11-d 사양 §6-③).
    if (this.lensK > 0) {
      const spike = this.starGeo.getAttribute("aSpike") as THREE.BufferAttribute;
      const ring = this.starGeo.getAttribute("aRing") as THREE.BufferAttribute;
      for (const id of this.lensIds) {
        const i = this.index.get(id);
        if (i === undefined) continue;
        alpha.setX(i, alpha.getX(i) * (1 - 0.75 * this.lensK));
        spike.setX(i, 0);
        ring.setX(i, 0); // 읽고 싶음 링은 압축 사본 쪽에만 남는다
      }
      spike.needsUpdate = true;
      ring.needsUpdate = true;
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

    // 관측 표식은 화면상 크기가 고정된다 — 표식은 판(plate)에 속하고 대상은
    // 하늘에 속한다. 줌해도 픽셀 치수가 불변인 유일한 객체군이므로, 카메라를
    // 한 번 움직이면 "판 위의 표시"임이 스스로 드러난다.
    const selId = this.state.focusId;
    const selIdx = selId ? this.index.get(selId) : undefined;
    const hideMarks = (): void => {
      for (const sp of this.selWedges) sp.visible = false;
      for (const sp of this.selCorners) sp.visible = false;
    };
    if (selIdx === undefined || this.state.landedId) {
      hideMarks();
    } else {
      const c = (this.dirs[selIdx] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      const dCam = c.distanceTo(this.camera.position);
      const worldPerPx = (2 * Math.tan((this.camera.fov * Math.PI) / 360) * dCam) / h;
      const camRight = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
      const camUp = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1);
      // 단계는 표현 사다리가 이미 낸 값을 **읽기만** 한다 — 같은 규칙을 두 곳에
      // 두면 서로를 가려 한쪽을 지워도 계약이 초록으로 남는다(실측 교훈).
      const scaled =
        (this.radii[selIdx] ?? 12) * (isLandable(selId as string) ? 1 + (LENS_MAG - 1) * this.lensK : 1);
      const ap = apparentRadiusPx(scaled, dCam, this.camera.fov, h);
      const asStar = ap < STAR_TO_DISC_PX;
      const markR = asStar ? starPixels(this.mags[selIdx] ?? 0) / 2 : ap;
      const place = (sp: THREE.Sprite, dx: number, dy: number, px: number): void => {
        sp.position
          .copy(c)
          .addScaledVector(camRight, dx * worldPerPx)
          .addScaledVector(camUp, dy * worldPerPx);
        sp.scale.setScalar(worldPerPx * px);
        sp.visible = true;
      };
      if (asStar) {
        // 단계 A — 마주 보는 쐐기 2개. 대상은 비워 둔다(측광을 덮지 않는다).
        for (const sp of this.selCorners) sp.visible = false;
        const gap = Math.max(9, markR * 1.6 + 5) + 6;
        const d = gap / Math.SQRT2;
        place(this.selWedges[0] as THREE.Sprite, d, d, 12);
        place(this.selWedges[1] as THREE.Sprite, -d, -d, 12);
      } else {
        // 단계 B — 원반 바운딩 박스의 모서리 레지스터 4개
        for (const sp of this.selWedges) sp.visible = false;
        const vw = this.renderer.domElement.clientWidth || 1600;
        const box = Math.min(markR * 1.25 + 8, Math.min(vw, h) * 0.31);
        const corners: Array<[number, number]> = [
          [-box, box],
          [box, box],
          [box, -box],
          [-box, -box]
        ];
        corners.forEach(([dx, dy], i) => place(this.selCorners[i] as THREE.Sprite, dx, dy, 22));
      }
    }
    // 관측 렌즈 진행도 — 진입/이탈이 보이도록 애니메이션한다
    const prevK = this.lensK;
    if (this.lensK !== this.lensKTarget) {
      const step = this.state.reducedMotion ? 1 : 1 / 42;
      this.lensK += Math.sign(this.lensKTarget - this.lensK) * step;
      if (Math.abs(this.lensKTarget - this.lensK) < step) this.lensK = this.lensKTarget;
    }
    this.updateLensBuffers();
    if (this.lensK !== prevK) this.buildLines(this.egoLines, this.state.ego);
    // 선택 천체는 일률 배율로 확대 — 배율이 같으므로 크기 차이(=영향력)는 남는다
    for (const [id, rec] of this.bodies) {
      // 준비되지 않은 작가는 애초에 천체가 만들어지지 않으므로 이 루프에
      // 등장하지 않는다 — 게이트는 표현 사다리 한 곳뿐이다.
      const want =
        id === this.state.focusId && !this.state.landedId
          ? 1 + (LENS_MAG - 1) * this.lensK
          : 1;
      const target = rec.radius * want;
      if (Math.abs(rec.mesh.scale.x - target) > 1e-4) rec.mesh.scale.setScalar(target);
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
      skyLabels: this.lastSkyLabels,
      crustLabels: this.lastCrustLabels,
      crustAuthorLabels: this.lastCrustAuthorLabels,
      frames: this.metrics.frames + 1,
      stars: drawn,
      ego: this.state.ego.length,
      lensK: Number(this.lensK.toFixed(3)),
      lensMag: this.lensK > 0 ? LENS_MAG : 1,
      lensMoved: this.lensStars.visible ? this.lensIds.length : 0,
      orbitArchive: Boolean(this.state.focusId && !isLandable(this.state.focusId)),
      assetsPreloaded: Boolean(
        this.state.focusId && this.assets?.authorId === this.state.focusId
      ),
      landedWithoutAssets: this.landedWithoutAssets,
      cities: this.cityMetrics(),
      crust: (landedRec?.mesh.userData.crust as string | undefined) ?? null
    };
  }

  /**
   * 서가의 측정. **전부 렌더에서 읽는다** — 배치를 만든 데이터를 되읽으면
   * 렌더가 규칙을 어겨도 계약이 초록이다(변이 스윕이 실제로 잡아낸 오탐 4건이
   * 전부 이 형태였다). 겹침은 투영된 화면 사각형끼리 재고, 어느 면이 관측자를
   * 향하는지는 메시의 월드 법선으로 잰다.
   */
  private cityMetrics(): {
    faceOut: number;
    spineOut: number;
    spineFacing: number;
    coverFacing: number;
    /** 그 면에 실제로 책등 재질 / 실물 표지 재질이 붙어 있는 권 수 */
    spineDressed: number;
    coverDressed: number;
    byYear: boolean;
    lonSpreadDeg: number;
    rows: number;
    overlaps: number;
    minGapPx: number;
    /** 두 단의 화면상 평균 세로 위치 — 입문 경로 단이 관측자 쪽(아래)이어야 한다 */
    rowFrontY: number;
    rowBackY: number;
    /** 다른 단에 가려진 최대 비율 — 앞이 뒤를 알아볼 수 없게 먹으면 안 된다 */
    crossHidden: number;
    /** 서가 부속(난간·눈금·연도) 자리 수와, 그중 지각 안으로 묻힌 수 */
    chrome: number;
    chromeBuried: number;
    /** 난간에 새겨진 연도 눈금 수 */
    ticks: number;
    /** 입문 경로에 속한 권의 작품 ID — 라벨의 색인 글리프가 정확히 이 집합이어야 한다 */
    ordered: string[];
    /** 투영된 책의 세로/가로 비 최솟값 — 1 미만이면 서 있던 것이 누웠다 */
    uprightRatio: number;
    total: number;
  } {
    const cs = [...this.cityRecords].sort((x, y) => x.year - y.year);
    // 연도가 다르면 경도도 **엄격히** 달라야 한다. 비감소만 보면
    // "전부 같은 경도"(연도 무시)가 통과한다(변이 스윕 실측).
    let byYear = true;
    for (let i = 1; i < cs.length; i++) {
      const a = cs[i] as (typeof cs)[number];
      const b = cs[i - 1] as (typeof cs)[number];
      if (a.year !== b.year && a.lon <= b.lon + 1e-6) byYear = false;
    }
    const lons = cs.map((c) => c.lon);
    const spread = lons.length ? Math.max(...lons) - Math.min(...lons) : 0;
    const isFaceOut = (c: (typeof cs)[number]): boolean => Math.abs(c.book.rotation.y) < 0.01;

    this.cityGroup.updateMatrixWorld(true);
    const w = this.renderer.domElement.clientWidth;
    const h = this.renderer.domElement.clientHeight;
    const camPos = this.camera.position;
    const axis = new THREE.Vector3();
    const centre = new THREE.Vector3();
    const toCam = new THREE.Vector3();
    const p = new THREE.Vector3();
    let spineFacing = 0;
    let coverFacing = 0;
    let spineDressed = 0;
    let coverDressed = 0;
    const boxes: Array<[number, number, number, number]> = [];
    const rowY: [number[], number[]] = [[], []];
    const sameRow: number[] = [];
    let upright = Infinity;
    for (const c of this.cityRecords) {
      const m = c.book.matrixWorld;
      centre.setFromMatrixPosition(m);
      toCam.copy(camPos).sub(centre).normalize();
      // 임계값이 아니라 **argmax** 로 묻는다: 여섯 면 중 관측자에게 가장
      // 정면인 면이 어느 것인가. 사입각이 64°(LANDING_INCIDENCE_DEG)인 이상
      // 어떤 면도 시선과 나란하지 않으므로, 0.7 같은 임계값은 전부 탈락시켜
      // "아무 면도 안 보인다"는 거짓을 낸다(실측: 전 권 0/0).
      const dotAxis = (k: number, sign: number): number =>
        axis
          .set(m.elements[k] as number, m.elements[k + 1] as number, m.elements[k + 2] as number)
          .normalize()
          .multiplyScalar(sign)
          .dot(toCam);
      const faces: Array<[string, number]> = [
        ["spine", dotAxis(0, 1)],
        ["fore", dotAxis(0, -1)],
        ["cover", dotAxis(8, 1)],
        ["back", dotAxis(8, -1)]
      ];
      const winner = faces.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
      if (winner === "spine") spineFacing++;
      if (winner === "cover") coverFacing++;
      // 기하가 어느 면을 내놓는지에 더해, **그 면에 무엇이 붙어 있는지**를
      // 묻는다. BoxGeometry 재질 배열 순서는 +X,-X,+Y,-Y,+Z,-Z 다.
      const kindAt = (m: THREE.Mesh, slot: number): string => {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        const one = mats[slot] as THREE.MeshStandardMaterial | undefined;
        return (one?.map?.userData?.kind as string | undefined) ?? "";
      };
      if (winner === "spine" && kindAt(c.spine, 0) === "spine") spineDressed++;
      if (winner === "cover" && kindAt(c.front, 4) === "cover") coverDressed++;
      let x0 = Infinity;
      let y0 = Infinity;
      let x1 = -Infinity;
      let y1 = -Infinity;
      let behind = false;
      for (const sx of [-1, 1])
        for (const sy of [-1, 1])
          for (const sz of [-1, 1]) {
            p.set(c.halfW * sx, c.halfH * sy, c.halfD * sz).applyMatrix4(m).project(this.camera);
            if (p.z > 1) behind = true;
            const px = ((p.x + 1) / 2) * w;
            const py = ((-p.y + 1) / 2) * h;
            x0 = Math.min(x0, px);
            y0 = Math.min(y0, py);
            x1 = Math.max(x1, px);
            y1 = Math.max(y1, py);
          }
      if (!behind) {
        boxes.push([x0, y0, x1, y1]);
        sameRow.push(c.row);
        (rowY[c.row === 0 ? 0 : 1] as number[]).push((y0 + y1) / 2);
        if (x1 > x0) upright = Math.min(upright, (y1 - y0) / (x1 - x0));
      }
    }
    // 서가 부속이 지각 **안에** 놓이면 아예 보이지 않는다. 실루엣이 장르
    // 조화로 ±6% 출렁이므로 이것은 상수 반경을 쓰는 순간 조용히 일어난다
    // (실측: 소세키에서 난간과 눈금 전부가 사라졌고, 카프카에서는 같은
    // 코드가 멀쩡했다). 여기서는 **작가의 장르 데이터로 표면을 다시 계산해**
    // 실제 자리와 비교한다 — 배치 코드가 쓰는 값을 되읽지 않는다.
    let buried = 0;
    const landed = this.state.landedId ? this.bodies.get(this.state.landedId) : null;
    const landedAuthor = this.data.authors.find((a) => a.id === this.state.landedId);
    if (landed && landedAuthor) {
      const harm = genreHarmonics(landedAuthor);
      const d = new THREE.Vector3();
      for (const q of this.cityAnchors) {
        d.copy(q).sub(landed.center);
        const len = d.length();
        if (len === 0) continue;
        d.divideScalar(len);
        if (len < landed.radius * silhouetteRadius(harm, d.x, d.y, d.z) - 1e-6) buried++;
      }
    }

    const mean = (xs: number[]): number =>
      xs.length ? Number((xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1)) : -1;
    let overlaps = 0;
    let crossHidden = 0;
    let minGapPx = Infinity;
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i] as [number, number, number, number];
        const b = boxes[j] as [number, number, number, number];
        const gx = Math.max(a[0] - b[2], b[0] - a[2]);
        const gy = Math.max(a[1] - b[3], b[1] - a[3]);
        // 두 축 모두 겹치면 실제로 겹친 것이다. 한 축만 떨어져도 분리된다.
        const hit = gx < 0 && gy < 0;
        if (sameRow[i] === sameRow[j]) {
          // 같은 단에서의 겹침은 결함이다 — 깊이 단서가 없으므로 두 권이 한
          // 자리를 다툰다.
          if (hit) overlaps++;
          minGapPx = Math.min(minGapPx, Math.max(gx, gy));
        } else if (hit) {
          // 다른 단끼리는 앞이 뒤를 가리는 것이 정상이다. 다만 뒤엣것이
          // 무엇인지 알아볼 수 없을 만큼 먹히면 안 된다.
          const inter = -gx * -gy;
          const areaA = (a[2] - a[0]) * (a[3] - a[1]);
          const areaB = (b[2] - b[0]) * (b[3] - b[1]);
          crossHidden = Math.max(crossHidden, inter / Math.max(1, Math.min(areaA, areaB)));
        }
      }
    return {
      faceOut: this.cityRecords.filter(isFaceOut).length,
      spineOut: this.cityRecords.filter((c) => !isFaceOut(c)).length,
      spineFacing,
      coverFacing,
      spineDressed,
      coverDressed,
      byYear,
      lonSpreadDeg: Number(((spread * 180) / Math.PI).toFixed(1)),
      rows: new Set(this.cityRecords.map((c) => c.row)).size,
      overlaps,
      minGapPx: Number.isFinite(minGapPx) ? Number(minGapPx.toFixed(1)) : -1,
      crossHidden: Number(crossHidden.toFixed(2)),
      chrome: this.cityAnchors.length,
      chromeBuried: buried,
      ticks: this.cityTicks,
      ordered: this.cityRecords.filter((c) => c.orderIndex >= 0).map((c) => c.workId),
      rowFrontY: mean(rowY[0]),
      rowBackY: mean(rowY[1]),
      uprightRatio: Number.isFinite(upright) ? Number(upright.toFixed(2)) : -1,
      total: this.cityRecords.length
    };
  }

  /** 판은 표면에 서 있고(+Y = 지면 법선) 관측자를 향해 돈다 — 축 고정 빌보드 */
  private orientCities(): void {
    if (!this.cityRecords.length) return;
    const m = new THREE.Matrix4();
    const right = new THREE.Vector3();
    const fwd = new THREE.Vector3();
    for (const c of this.cityRecords) {
      const up = (c.obj.userData.up ?? c.obj.userData.dir) as THREE.Vector3 | undefined;
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
      // 원경은 이름을 아끼는 자리다. **속성 그룹의 평균점 이름표는 그리지
      // 않는다** — 사조는 공간적으로 뭉쳐 있지 않으므로 중심점이란 것이 없고,
      // 흩어진 점들의 평균에 이름을 놓으면 있지도 않은 장소를 주장한다(R11-c).
      // 관계층의 성좌 이름은 실제 선이 만드는 형태를 가리키므로 남는다.
      if (s.lens && s.lensRelationGroups)
        for (const g of s.lens.groups.slice(0, 8)) {
          const c = new THREE.Vector3();
          let n = 0;
          for (const m of g.memberIds) {
            const i = this.index.get(m);
            if (i === undefined || !this.present(i)) continue;
            c.add(this.dirs[i] as THREE.Vector3);
            n++;
          }
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
        const inGroupFocus = s.lensGroupFocus?.has(id) ?? false;
        const named =
          id === s.focusId ||
          id === s.hoveredId ||
          inGroupFocus ||
          s.egoLit.has(id) ||
          s.read.has(id) ||
          s.want.has(id) ||
          (this.mags[i] ?? 0) > (sky ? 0.62 : 0.3);
        if (!named) continue;
        const world = this.effectivePos(id, new THREE.Vector3());
        const toward = world.clone().sub(this.camera.position).normalize();
        if (toward.dot(camDir) < 0.28) continue;
        v.copy(world).project(this.camera);
        if (v.z > 1) continue;
        const mag = this.mags[i] ?? 0;
        // "neighbor" 는 그리디 예산을 우회한다(labels.ts). 렌즈가 켜지면 밝혀진
        // 별이 수십 개라 그 상태를 주면 원경이 이름으로 뒤덮인다(실측 41개).
        // 예산을 넘겨도 되는 것은 선택 자신과 그 자기 성좌뿐이다.
        // "neighbor" 는 그리디 예산을 우회한다(labels.ts). 예산을 넘겨도 되는
        // 것은 선택 자신·자기 성좌·범례에서 지목된 성좌뿐이다.
        const state =
          id === s.focusId || id === s.landedId
            ? "selected"
            : id === s.hoveredId
              ? "hovered"
              : s.egoLit.has(id) || inGroupFocus
                ? "neighbor"
                : "normal";
        const glyphs = (s.lensMarks.get(id) ?? []).map(indexGlyph).join("");
        const sx = ((v.x + 1) / 2) * w;
        // 패널이 덮는 띠에는 이름을 놓지 않는다 — 읽을 수 없는 라벨은
        // 정보가 아니라 소음이다(R9 "뷰포트 안의 다음 행동" 계승)
        if (sx < this.safeLeft && id !== s.focusId) continue;
        if (sx > w - this.safeRight && id !== s.focusId) continue;
        items.push({
          id,
          text: glyphs ? `${a.names.ko}\u2009${glyphs}` : a.names.ko,
          kind: "author",
          size: mag > 0.6 ? "lg" : mag > 0.3 ? "md" : "sm",
          priority:
            (id === s.focusId ? 400 : 0) +
            (id === s.hoveredId ? 200 : 0) +
            (inGroupFocus ? 300 : 0) +
            (s.read.has(id) ? 60 : 0) +
            mag * 100,
          x: sx,
          y: ((-v.y + 1) / 2) * h + 14,
          state,
          ground: "sky",
          // 층이 켜져 있고 이 별이 그 층 밖이면 글자를 접는다(틱만 남는다).
          // 선택·호버·이웃·개인 기록은 접지 않는다 — 방향감이 사라진다.
          muted:
            Boolean(s.lens) &&
            state === "normal" &&
            !s.lensMarks.has(id) &&
            !s.read.has(id) &&
            !s.want.has(id)
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
          // 입문 **순서**는 여기서만 말한다. 색인 글리프는 관측층 범례가 이미
          // 쓰는 어휘이므로 새 채널이 아니다 — 같은 글자가 같은 뜻을 나른다.
          text: c.orderIndex >= 0 ? `${indexGlyph(c.orderIndex + 1)} ${work.titleKo}` : work.titleKo,
          kind: "work",
          size: "sm",
          priority: work.id === s.selectedWorkId ? 400 : 100,
          x: ((v.x + 1) / 2) * w,
          y: ((-v.y + 1) / 2) * h + 10,
          state: work.id === s.selectedWorkId ? "selected" : "normal",
          // 작품 라벨만 작가의 실제 종이 위에 선다 — 슬립이 살아 있는 유일한 자리
          ground: "crust",
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
              state: "selected",
              // 착륙한 작가의 이름은 화면 상단 빈 공간에 뜬다 — 종이 위가 아니다
              ground: "sky"
            });
        }
      }
    }
    this.lastSkyLabels = items.filter((i) => i.ground === "sky").length;
    this.lastCrustLabels = items.filter((i) => i.ground === "crust").length;
    // 종이 슬립은 **작품 라벨만** 가질 수 있다. 작가 이름이 슬립을 달면
    // 하늘에 판이 돌아온 것이고, 그것이 이 숫자로 잡힌다.
    this.lastCrustAuthorLabels = items.filter(
      (i) => i.ground === "crust" && i.kind !== "work"
    ).length;
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
