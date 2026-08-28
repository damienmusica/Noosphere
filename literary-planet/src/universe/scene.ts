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
import type { Author, Relation, Work } from "../types.ts";
import { COLORS } from "../theme.ts";
import type { ArtManifest } from "../globe/art-assets.ts";
import { artUrl } from "../globe/art-assets.ts";
import {
  LabelLayer,
  estimateWidth,
  LABEL_CHROME_ENGRAVED,
  LABEL_CHROME_SLIP,
  type LabelItem
} from "../globe/labels.ts";
import {
  CAM_SKY_DEFAULT,
  CAM_SKY_MAX,
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
  starDiameterPx,
  tintOf,
  silhouetteRadius,
  SHELF_AXIS_DEG,
  LANDING_INCIDENCE_DEG,
  CORRIDOR_CELL_AIR,
  CORRIDOR_EYE,
  CORRIDOR_ROW_GAP,
  corridorSpan,
  corridorCellArc,
  corridorTheta,
  anchorYearOf,
  CORRIDOR_LEAD_YEARS,
  CORRIDOR_TAIL_YEARS,
  type CorridorSpan,
  VOL_ASPECT,
  VOL_DEPTH,
  VOL_AIR,
  volumeWidth,
  FREE_PIVOT,
  THRUST_PER_PX,
  THRUST_MAX,
  THRUST_DAMP,
  FREE_R_MIN,
  WALK_PER_PX,
  WALK_MAX,
  WALK_DAMP,
  LOOK_YAW_MAX,
  LOOK_PITCH_MAX,
  TURN_GAIN,
  ARRIVE_STANDOFF,
  ALIGN_RATE,
} from "./grammar.ts";
import { indexGlyph } from "./lenses.ts";
import { REL_KO, relationGlyph } from "./relations.ts";

/** 하단 연도 슬라이더 판이 덮는 띠 — 여기 놓인 이름은 읽을 수 없다 */
import { isLandable } from "./readiness.ts";
import type { AssetSet } from "./assets.ts";
import type { LensLine, LensResult } from "./lenses.ts";

export interface UniverseData {
  authors: Author[];
  works: Work[];
  positions: Record<string, [number, number, number]>;
  degree: Record<string, number>;
  relations?: Relation[];
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
  /** 전 구성원의 색인 번호가 이름표에 붙는다(첫 프레임). 범례 지목은 이름표를 띄우는 별도 상호작용. 별의 밝기·색·링은 무접촉 */
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
  /** 카메라가 스스로 움직이는 동안(추력·걷기·비행) 참. 시트가 물러날 신호. */
  onMotion(moving: boolean): void;
  /** 성계 전체가 보이던 자리에서 충분히 들어왔는가 — 돌아올 길을 띄울 신호 */
  onDeep(deep: boolean): void;
  /** 가장 가까이서 **천체로 분해된** 작가. 자유 비행은 고르지 않고 다가가므로,
   *  자산 사전 로드의 방아쇠가 선택만이면 지각이 영영 백지로 남는다. */
  onNear(id: string | null): void;
  /** 추력이 궤도를 떠났다 — 휠은 언제나 추력이므로, 궤도에 묶여 있지 않다는
   *  증거가 같은 제스처 안에 있어야 한다. */
  onLeaveOrbit(): void;
  /** 접근의 사다리(R13-b) — 지목했거나 이름 거리(NAME_NEAR) 안에 든 별과
   *  그 거리. 정보는 클릭의 보상이 아니라 접근의 응답이므로, 이 신호가 관측
   *  스트립의 유일한 원천이다. 착륙 중엔 null(표면이 곧 세계다). */
  onApproach(id: string | null, d: number): void;
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

/** 화살촉 버퍼 용량 — 한 별의 방향 있는 관계 수 최대(데이터 최대 16)를 넉넉히 */
const ARROW_CAP = 64;

/** 클릭과 드래그를 가르는 이동량(CSS px). 손끝은 누른 채 조금 흔들린다. */
const DRAG_SLOP = 6;

// (R13) ROTATE_SPEED 는 은퇴했다 — 드래그 회전은 OrbitControls 가 아니라
// look()→turn() 의 고개의 법 하나(TURN_GAIN, grammar.ts)로만 들어온다.

/** 이 거리 안에 든 별은 등급과 무관하게 이름을 갖는다 — 접근의 응답 (R12-f).
 *  천구 반경 900 에 100인이면 별 사이 평균 간격이 ≈ 320 이므로, 이 값은
 *  "지나치는 별"이 아니라 "다가간 별"만 잡는다. */
const NAME_NEAR = 430;

/** 2차 베지에 — 회랑의 실이 그리는 호 */
function quadBezier(
  p0: THREE.Vector3,
  p1: THREE.Vector3,
  p2: THREE.Vector3,
  t: number,
  out: THREE.Vector3
): THREE.Vector3 {
  const u = 1 - t;
  out.set(
    u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
    u * u * p0.z + 2 * u * t * p1.z + t * t * p2.z
  );
  return out;
}

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
  /** 자기 성좌의 화살촉 — 방향 있는 관계의 도착 끝에만 붙는다 (R12 관계 인과성) */
  private egoArrows!: THREE.Mesh;
  /** 화살촉을 받을 선(방향 있음, 실제로 그려진 것) — buildLines 가 채운다.
   *  start/end 가 있으면 별의 위치 대신 그 점(회랑의 앵커)을 쓴다 */
  private egoDirected: Array<{
    a: string;
    b: string;
    color: string;
    start?: THREE.Vector3;
    end?: THREE.Vector3;
  }> = [];
  /** 마지막 프레임의 화살촉 끝점 — 계측이 "도착 끝에 있는가"를 독립으로 센다 */
  private arrowTips: Array<{
    a: string;
    b: string;
    tip: THREE.Vector3;
    start?: THREE.Vector3;
    end?: THREE.Vector3;
  }> = [];
  /** 화살촉 버퍼는 한 번만 할당한다 — 매 프레임 지오메트리를 새로 만들면 GPU
   *  버퍼 교체가 프레임을 잡아먹고, 렌즈 램프(프레임 수 기준)가 느려져 "천체로
   *  분해" 계약이 시간에 따라 흔들린다(실측: 3회 중 2회 실패). */
  private arrowPos = new Float32Array(ARROW_CAP * 9);
  private arrowCol = new Float32Array(ARROW_CAP * 9);
  private arrowsDirty = false;
  private arrowCam = new THREE.Vector3(Number.NaN, 0, 0);
  private arrowQuat = new THREE.Quaternion();
  private graticule!: THREE.LineSegments;
  private sunGlow!: THREE.Sprite;
  private selWedges: THREE.Sprite[] = [];
  private selCorners: THREE.Sprite[] = [];
  /** 성계 방향 표식 — 하늘에 아무것도 남지 않았을 때만 뜬다 (R12-f) */
  private homeMark!: THREE.Sprite;
  private homeLabel!: THREE.Sprite;
  private lastOnScreen = 0;
  /** 가장 가까운 별까지의 거리 — 추력이 이 값으로 느려진다 */
  private nearD = Infinity;
  /** 마지막으로 알린 "분해된 가장 가까운 천체" */
  private lastNearBody: string | null = null;
  /** 접근 통지의 변화 감지 — id 또는 10 단위 거리 버킷이 바뀔 때만 콜백 */
  private lastApproachId: string | null = null;
  private lastApproachBucket = -1;
  /** 회랑 자세가 마지막으로 계산한 서가 거리(책 높이 배) — 계측은 결과를 읽는다 */
  private poseLat = 0;
  /** 추력이 궤도를 끊었는가 — 고른 것은 남고 카메라만 풀린다 */
  private orbitBroken = false;
  /** 마지막으로 알린 "원경에서 멀어졌다" */
  private lastDeep = false;
  private readLamp: THREE.PointLight;
  private ambient!: THREE.AmbientLight;
  /** 착륙 시에만 켜는 깊이 안개 — 회랑이 지평선 톤으로 물러난다 */
  private surfaceFog: THREE.Fog | null = null;

  private bodies = new Map<string, BodyRecord>();
  private cityGroup = new THREE.Group();
  /** 마지막으로 **하늘에 머물던** 카메라 위치. '하늘로'는 원경이 아니라 **이 자리**로
   *  돌아온다 — 합성 파일럿 4/4 가 복귀 후 출발 별을 잃었다(착륙 접근각이 그대로
   *  남아 다른 구도로 돌아왔기 때문). 처음 있던 화면으로 돌아오지 못하면 방향감
   *  과제는 사람이 아니라 제품을 잰다. */
  private skyPose = new THREE.Vector3(0, 420, CAM_SKY_DEFAULT);
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
    /** 칸 안에서의 국소 X 오프셋(같은 해 여러 권) */
    localX: number;
    /** 무리가 칸에 맞도록 좁힌 폭 배율 */
    scaleX: number;
    /** 0 = 입문 경로 단, 1 = 그 외 단 */
    row: number;
    /** readingOrder 안에서의 자리(없으면 -1) — 색인 글리프가 이걸 나른다 */
    orderIndex: number;
    /** 배치 경도(연도 축) — 계약이 연도 단조성과 분산을 검사한다 */
    lon: number;
    /** 회랑 접선(연도가 자라는 방향)과 벽 법선 — 카메라와 무관한 방향 계약용 */
    tangent?: THREE.Vector3;
    normal?: THREE.Vector3;
  }> = [];
  /** 회랑 부속(기둥·판·각인·사망선·명판) — 책이 아닌 것. 착륙 해제 시 같이 걷힌다 */
  private cityChrome: THREE.Object3D[] = [];
  /** 회랑 (R12-c): 경첩으로 일어서는 단위들과 좌표 프레임 */
  private corridorStand: THREE.Group[] = [];
  private corridorFrame: {
    center: THREE.Vector3;
    radius: number;
    outward: THREE.Vector3;
    lonAxis: THREE.Vector3;
    latAxis: THREE.Vector3;
    harm: [number, number, number, number];
    span: CorridorSpan;
    cellArc: number;
    bw: number;
    bh: number;
    bd: number;
    eyePhi: number;
    eyeLift: number;
    /** 회랑 진행 방향(연도가 자라는 쪽) — 표면 하늘 투영의 정면 */
    fwd: THREE.Vector3;
  } | null = null;
  /** 접힘 진행도 0(지각과 한 몸) → 1(회랑이 섰다). 착륙 비행 마지막 45% 가 만든다 */
  private foldK = 0;
  /** 이번 착륙에서 접힘이 한 번 끝났는가 — 당김 리프레임이 접힘을 재구동하지 않게 */
  private foldDone = false;
  private lastPulled: string | null = null;
  /** 당겨진 책과 권별 당김 진행도 — 전부 책등, 당기면 표지 (CPO 룰링 2026-08-24) */
  private pullK = new Map<string, number>();
  /** 연보 명패 (R12-c 채움): 관계·판본의 실제 사건이 제 해의 칸에 선다 */
  private eventSlips: Array<{ relId?: string; year: number; obj: THREE.Object3D; folded?: boolean }> = [];
  /** 이륙 중 — 착륙은 풀렸지만 회랑은 비행이 끝날 때까지 서 있다 */
  private corridorDeparting = false;

  // ——— 카메라 주권 (R12-f) · 관측선 (R13) ———
  /** 추력 속도(단위/초). 휠·핀치가 더하고 감쇠가 뺀다. */
  private thrust = 0;
  /** 추력이 미는 방향 — push() 가 조준을 해소해 정한다(지목 별 > 커서 > 시선).
   *  null 이면 시선 정면. 지목 별이 있으면 매 프레임 그 별로 재조준(호밍)된다. */
  private thrustDir: THREE.Vector3 | null = null;
  /** 지목 항법의 목표 별 — 이 별까지의 거리가 감속을 정하고, ARRIVE_STANDOFF
   *  에서 선다. 새로 잡는 제스처(pointerdown)가 지운다: 새 손은 새 뜻이다. */
  private aimId: string | null = null;
  /** 지목이 잠긴 순간의 커서 자리(CSS px). 정렬이 하늘을 끌고 가는 동안 가만히
   *  서 있는 커서 밑으로 다른 별이 지나가는데, 그때의 휠이 그 별로 갈아타면
   *  비행이 갈지자가 된다(계약 실측). 커서가 움직이지 않았으면 뜻도 그대로다. */
  private aimAt: { x: number; y: number } | null = null;
  /**
   * 다음 focus/landed 변화가 카메라에 갖는 뜻(R13-c, 문 0 2차). 앱이 상태를
   * 바꾸기 직전에 적어 둔다:
   * - "pick"   — 사용자의 클릭. **몸을 옮기지 않는다** — 고르는 것은 카드와
   *              렌즈의 일이지 순간이동이 아니다("스크롤한 정도와 상황과 상관
   *              없이 클릭하면 훅 이동" 지적의 처방). 기본값.
   * - "summon" — 명시적 이동 요청(검색·하늘로·궤도로). 정직한 비행으로 간다.
   * - "immediate" — 입구(URL 딥링크). 비행 없이 그 자리에서 시작한다.
   */
  cameraCause: "pick" | "summon" | "immediate" | null = null;
  /** 고른 순간의 그 별까지의 거리 — 카드가 닫히는 "충분히 멀어짐"의 기준점.
   *  몸이 어디서 골랐는지에 따라 떠남의 거리도 달라진다. */
  private focusDistAtSelect = LENS_DIST;
  /** 회랑에서 서 있는 해(실수) — 착륙 자세의 유일한 매개변수 */
  private walkYear = 0;
  /** 걷기 속도(연/초) */
  private walkVel = 0;
  /** 회랑의 기본 자세에 더하는 시선 offset(라디안) */
  private lookYaw = 0;
  private lookPitch = 0;
  /** 포인터 하나의 이동 누적 — 6px 을 넘으면 그것은 클릭이 아니라 드래그다.
   *  집던 자리에서 곧바로 골라 버리면 별에서 시작한 모든 둘러보기가 선택이 된다. */
  private drag: { id: number; x: number; y: number; moved: number } | null = null;
  /** 활성 포인터 — 두 개면 핀치(손끝의 추력) */
  private pointers = new Map<number, { x: number; y: number }>();
  private pinchPrev = 0;
  /** 이번 프레임에 카메라가 스스로 움직이고 있는가 — 시트가 물러날 신호 */
  private moving = false;
  /** 마지막으로 그린 실의 앵커 끝 — 계약이 화면 좌표로 대조한다 */
  private threadEnd: THREE.Vector3 | null = null;
  private landUp: THREE.Vector3 | null = null;
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
  /** 거리와 무관한 광휘(px) — 화면 지름은 이것과 실제 원반 중 큰 쪽이다 */
  private baseGlare: Float32Array = new Float32Array(0);
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
  private safeTop = 0;
  private safeBottom = 0;
  /** 크롬이 실제로 덮은 화면 사각형들(CSS px). 띠(inset)는 카메라 프레이밍용
   *  스칼라이고, 이름표는 **이 사각형들**과 상자로 대조한다 — 연도판은 화면
   *  가운데 아래에 뜬 별개의 판이고 누운 화면에서는 왼쪽으로 붙는데, 스칼라
   *  띠로는 그 어느 것도 표현되지 않는다(실측: 누운 화면에서 『소송』이
   *  슬라이더 밑에 100% 깔려 탭이 연도를 1995→1882 로 옮겼다). */
  private chromeRects: Array<{ x: number; y: number; w: number; h: number }> = [];
  /** 손가락이 주 입력인 기기 — 호버가 없으므로 "지목"이 한 단계 늦다 */
  private coarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
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
    cam: [0, 0, 0] as [number, number, number],
    linesTouchingLanded: 0,
    /** 자기 성좌의 화살촉 — 방향 있는 선 수 · 실제 그려진 화살촉 · 도착 끝에 있는 것 */
    arrows: 0,
    arrowsExpected: 0,
    arrowsAtTarget: 0,
    /** 회랑 (R12-c): 접힘 진행도 · 칸 수 · 당겨진 책 · 실의 앵커 화면 좌표 */
    foldK: 0,
    bays: 0,
    pulled: null as string | null,
    deathLine: false,
    plate: false,
    threadEnd: null as [number, number] | null,
    occludedLabels: 0,
    labelsOverFocus: 0,
    /** 크롬이 차지한다고 선언된 띠 [좌, 우, 위, 아래]와 받은 사각형 수 */
    insets: [0, 0, 0, 0] as [number, number, number, number],
    chromeRects: 0,
    /** 카메라 주권 (R12-f): 원점 거리 · 운동 중 · 시선 앞 피벗 · 서 있는 해 · 고개 */
    camR: 0,
    moving: false,
    pivot: 0,
    walkYear: null as number | null,
    walked: 0,
    aheadPx: null as [number, number] | null,
    look: [0, 0] as [number, number],
    onScreenStars: 0,
    homeMark: false,
    sunPx: null as [number, number] | null,
    aim: [0, 0] as [number, number],
    /** 지목 항법의 목표(R13) — 추력이 이 별로 호밍 중이면 그 id, 아니면 null */
    aimLock: null as string | null,
    /** 접근의 사다리(R13-b) — [대상 별, 거리(10 단위)] · 대상 없음 = [null, -10] */
    approach: [null, -10] as [string | null, number],
    nearest: [null, 0] as [string | null, number],
    /** 가장 가까운 별이 **실제로 그려진** 화면 지름(px). 규칙을 다시 계산해
     *  적으면 계측이 코드가 아니라 의도를 읽는다 — 셰이더에 넘어간 그 값을 읽는다. */
    nearPx: 0,
    crustPainted: 0,
    nearNamed: 0,
    deep: false,
    focusDist: null as number | null,
    throttle: 1,
    walking: false,
    flying: false,
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
      sameBayGapW: 999,
      crossHidden: 0,
      chrome: 0,
      chromeBuried: 0,
      ticks: 0,
      ordered: [] as string[],
      boxes: {} as Record<string, [number, number, number, number]>,
      spineOutIds: [] as string[],
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
    // 손이 없는 관측자도 카메라를 잡을 수 있어야 한다 — 탭으로 닿고, 화살표로
    // 고개를 돌리고, +/− 로 나아간다.
    this.renderer.domElement.tabIndex = 0;
    this.renderer.domElement.setAttribute("role", "application");
    this.renderer.domElement.setAttribute(
      "aria-label",
      "성계. 화살표 키로 둘러보고 더하기·빼기 키로 앞뒤로 이동한다."
    );

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.05, 24000);
    this.camera.position.set(0, 420, CAM_SKY_DEFAULT);
    // 관측선(R13): OrbitControls 는 입력을 잃었다. 드래그는 look()→turn() 의
    // 고개의 법 하나로만 들어오고(문 0: 같은 드래그에 법이 셋 — 하늘 3.6배·
    // 회랑 1.6배·궤도 부호 반대 — 이던 것의 폐지), 휠·핀치는 push() 한 곳이다.
    // 컨트롤 객체가 남는 이유는 target 북키핑뿐이다: 연출 비행(advance)과
    // 거리 계측(dist·pivot)이 주시점을 여기서 읽는다. update() 는 어디서도
    // 부르지 않는다 — 카메라를 쓰는 자는 advance(비행)·moveCamera(손)·
    // corridorPose(걷기) 셋뿐이다.
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false;
    this.controls.enablePan = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = CAM_SKY_MAX;
    this.controls.enableZoom = false;
    this.camera.lookAt(this.controls.target);

    this.labels = new LabelLayer(host);

    // 항성 = 정본 코퍼스. 모든 빛의 출처.
    // 세기는 물리 단위(칸델라)다 — decay 0 이라 거리와 무관하게 일정하다.
    const sun = new THREE.PointLight(0xffd9a0, 6, 0, 0.0);
    sun.position.set(0, 0, 0);
    this.scene.add(sun);
    this.ambient = new THREE.AmbientLight(0x2a2118, 1.0);
    this.scene.add(this.ambient);
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
    // 화살촉은 선과 같은 잉크의 삼각형이다. 선분은 폭을 가질 수 없으므로(WebGL
    // 1px) 방향은 끝의 형태로만 말할 수 있다 — 화살촉의 존재 = 방향 주장.
    const arrowGeo = new THREE.BufferGeometry();
    arrowGeo.setAttribute("position", new THREE.BufferAttribute(this.arrowPos, 3).setUsage(THREE.DynamicDrawUsage));
    arrowGeo.setAttribute("color", new THREE.BufferAttribute(this.arrowCol, 3).setUsage(THREE.DynamicDrawUsage));
    arrowGeo.setDrawRange(0, 0);
    this.egoArrows = new THREE.Mesh(
      arrowGeo,
      new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        side: THREE.DoubleSide
      })
    );
    this.egoArrows.frustumCulled = false;
    this.scene.add(this.egoArrows);
    this.scene.add(this.cityGroup);

    this.renderer.domElement.addEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.addEventListener("pointermove", this.onPointerMove);
    this.renderer.domElement.addEventListener("pointerup", this.onPointerUp);
    this.renderer.domElement.addEventListener("pointercancel", this.onPointerUp);
    this.renderer.domElement.addEventListener("wheel", this.onWheel, { passive: false });
    this.host.ownerDocument.addEventListener("keydown", this.onKeyDown);
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
    this.baseGlare = new Float32Array(n);
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

    // 성계 방향 — **선택 등록부를 빌리지 않는다.** 주홍 채운 쐐기는 "고른 것"의
    // 표시이고, 이것은 고른 것이 아니라 세계가 있는 쪽이다. 놋쇠 윤곽 갈매기.
    const home = document.createElement("canvas");
    home.width = home.height = 64;
    const hc = home.getContext("2d");
    if (hc) {
      hc.strokeStyle = COLORS.brass;
      hc.lineWidth = 7;
      hc.lineCap = "round";
      hc.lineJoin = "round";
      hc.beginPath();
      hc.moveTo(50, 8);
      hc.lineTo(16, 32); // 꼭짓점이 성계를 향한다
      hc.lineTo(50, 56);
      hc.stroke();
    }
    this.homeMark = mk(new THREE.CanvasTexture(home), 0);

    // 갈매기 하나는 방향을 말하지만 **무엇의** 방향인지는 말하지 않는다.
    // 검은 프레임에 홀로 뜨는 표식이므로 이름을 같이 단다(돌지 않는다).
    const word = document.createElement("canvas");
    word.width = 256;
    word.height = 64;
    const dc = word.getContext("2d");
    if (dc) {
      dc.font = "500 34px 'Noto Serif KR', serif";
      dc.fillStyle = COLORS.brass;
      dc.textAlign = "center";
      dc.textBaseline = "middle";
      dc.fillText("성계", 128, 34);
    }
    this.homeLabel = mk(new THREE.CanvasTexture(word), 0);
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
  /** 크롬이 실제로 덮은 사각형들. DOM 에서 잰 값이 그대로 들어온다 —
   *  상수로 근사하면 레이아웃이 바뀔 때마다 근사가 틀린다. */
  setChromeRects(rects: Array<{ x: number; y: number; w: number; h: number }>): void {
    this.chromeRects = rects;
  }

  /**
   * 이름표가 크롬에 물리는가 — **상자**로 잰다. 앵커 한 점으로 자르면 상자는
   * 중앙 정렬로 그려지므로(labels.ts) 절반이 패널에 물린 채 통과한다
   * (실측: 누운 화면 13/87, 데스크톱 1440×900 7/90 — 윌리엄 포크너 ① 은
   * 헤더에 통째로 매몰됐다).
   */
  private labelHidden(
    sx: number,
    sy: number,
    text: string,
    fs: number,
    chrome: number,
    w: number,
    h: number
  ): boolean {
    // 글리프 모델(fs + 6)은 실제 칩보다 작다 — 레터프레스 슬립의 패딩·테두리가
    // 모델 밖에 있어서, 13 모델 라벨의 실제 DOM 높이는 **28px** 이다(실측).
    // 크롬 대조는 넉넉히 잡는다: 가장자리에서 몇 픽셀 물리는 것보다 하나 덜
    // 세우는 편이 낫다.
    const half = estimateWidth(text, fs, chrome) / 2 + 6;
    const box = { x0: sx - half, x1: sx + half, y0: sy - 2, y1: sy + fs + 16 };
    // 화면 밖으로 나간 것은 어차피 라벨 레이어가 버린다. 덮인 자리는 **띠가
    // 아니라 사각형**이 정본이다 — 한 가지 일에 한 가지 기제. 스칼라 띠는
    // 카메라 프레이밍(뷰 오프셋) 전용으로 남는다. 둘을 겹쳐 두었더니 넉넉한
    // 띠가 상자 검사를 가려, 상자를 점으로 되돌리는 변이가 생존했다(실측).
    void w;
    void h;
    for (const r of this.chromeRects) {
      if (box.x1 <= r.x || box.x0 >= r.x + r.w) continue;
      if (box.y1 <= r.y || box.y0 >= r.y + r.h) continue;
      return true;
    }
    return false;
  }

  /** 크롬이 덮는 네 변의 띠(CSS px). 좁은 화면에서는 패널이 좌우가 아니라
   *  위·아래에 앉으므로 가로 두 값만으로는 프레임을 옳게 밀 수 없다. */
  setSafeInsets(left: number, right: number, top = 0, bottom = 0): void {
    if (
      left === this.safeLeft &&
      right === this.safeRight &&
      top === this.safeTop &&
      bottom === this.safeBottom
    )
      return;
    this.safeLeft = left;
    this.safeRight = right;
    this.safeTop = top;
    this.safeBottom = bottom;
    this.applyViewOffset();
  }

  private applyViewOffset(): void {
    const w = this.renderer.domElement.clientWidth || 1;
    const h = this.renderer.domElement.clientHeight || 1;
    const dx = (this.safeRight - this.safeLeft) / 2;
    const dy = (this.safeBottom - this.safeTop) / 2;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, dx, dy, w, h);
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
    // 감쇠 관성은 비행이 아니라도 움직임이다 — reduced-motion 이면 끈다
    this.controls.enableDamping = !this.state.reducedMotion;
    this.refreshStars();
    this.rebuildLens();
    this.refreshConstellation();
    if (this.state.landedId !== prevLanded) {
      if (this.state.landedId) {
        if (this.assets?.authorId !== this.state.landedId) this.landedWithoutAssets = true;
        this.corridorDeparting = false;
        this.foldDone = false;
        this.refreshCities();
      } else {
        // 이륙: 회랑은 비행이 끝날 때까지 서 있다 — 행성이 뒤로 작아지는 동안
        // 회랑이 그 표면 위에 보여야 "내가 있던 곳"이 남는다.
        this.corridorDeparting = true;
      }
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
      const glare = starPixels(mag) * st.boost * (read ? 1.12 : 1);
      const alpha =
        life.presence *
        st.dim *
        (0.5 + 0.5 * mag) *
        (life.afterglow ? 0.72 : 1) *
        (read ? 1.35 : 1);
      // 화면 지름은 여기서 정하지 않는다 — 거리를 아는 것은 프레임 루프뿐이고,
      // 같은 규칙을 두 곳에 두면 서로를 가려 한쪽을 지워도 계약이 초록으로 남는다.
      this.baseGlare[i] = glare;
      this.baseAlpha[i] = Math.min(1.6, alpha);
      aAlpha.setX(i, Math.min(1.6, alpha));
      aSpike.setX(i, mag > 0.55 || read ? 1 : 0);
      aRing.setX(i, this.state.want.has(id) ? 1 : 0);
    }
    aAlpha.needsUpdate = true;
    aSpike.needsUpdate = true;
    aRing.needsUpdate = true;
  }

  /**
   * 표면 하늘의 투영 (R12-c) — **공표된 렌즈다**. 별은 전부 같은 껍질 위에
   * 있으므로, 표면에 선 관측자에게 다른 별은 모두 접평면 아래에 있다(현 P 에서
   * 같은 구면의 Q 로 가는 현은 언제나 접평면 밑으로 처진다 — 기하학이지 버그가
   * 아니다). 그대로 두면 착륙 하늘이 비고, 실이 닿을 곳이 없다. 그래서 착륙
   * 중에는 각 별의 방향을 **접평면에 대해 반사**한다: 방위각은 보존되고 고도만
   * 절댓값이 된다. 가까운 별은 실제처럼 지평선 곁에 남고, 먼 별일수록 높이
   * 뜬다. 중경의 관측 렌즈와 같은 원칙 — 왜곡은 공표될 때만 기만이 아니다
   * (테제 §⑦에 명기).
   */
  private surfaceSkyPos(id: string, out: THREE.Vector3): THREE.Vector3 {
    const f = this.corridorFrame;
    const i = this.index.get(id);
    if (!f || i === undefined) return out.set(0, 0, 0);
    const P = f.center;
    const n = P.clone().normalize();
    out.copy(this.dirs[i] as THREE.Vector3).multiplyScalar(SHELL_R).sub(P);
    const d = out.length();
    if (d < 1e-6) return out.copy(P);
    const u = out.clone().divideScalar(d);
    // 관측창 사상: 전천의 방위를 반으로 접어 회랑 정면의 반구에 넣는다(좌우
    // 순서 보존) · 고도는 |고도|를 지평선 띠로 눕힌다. 어느 별도 사라지지 않고,
    // 방위의 순서가 뒤집히지 않으며, 사상은 연속이다 — 그리고 공표된다.
    const fwd = f.fwd;
    const side = new THREE.Vector3().crossVectors(n, fwd).normalize();
    const h = Math.max(-1, Math.min(1, u.dot(n)));
    const t = u.clone().addScaledVector(n, -h);
    const az = Math.atan2(t.dot(side), t.dot(fwd));
    const elev = Math.asin(h);
    const az2 = az * 0.32;
    const elev2 = 0.03 + Math.abs(elev) * 0.18;
    out
      .copy(fwd)
      .multiplyScalar(Math.cos(elev2) * Math.cos(az2))
      .addScaledVector(side, Math.cos(elev2) * Math.sin(az2))
      .addScaledVector(n, Math.sin(elev2))
      .multiplyScalar(d);
    return out.add(P);
  }

  /** 렌즈가 걸린 별의 화면상 실효 위치. 라벨·픽·관계선이 모두 이걸 쓴다 */
  private effectivePos(id: string, out: THREE.Vector3): THREE.Vector3 {
    const i = this.index.get(id);
    if (i === undefined) return out.set(0, 0, 0);
    if (this.state.landedId && this.corridorFrame && this.foldK > 0 && id !== this.state.landedId) {
      const proj = this.surfaceSkyPos(id, new THREE.Vector3());
      out.copy(this.dirs[i] as THREE.Vector3).multiplyScalar(SHELL_R);
      return out.lerp(proj, this.foldK);
    }
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
    this.lensIds.forEach((id, k) => {
      const i = this.index.get(id) as number;
      col[k * 3] = srcCol.getX(i);
      col[k * 3 + 1] = srcCol.getY(i);
      col[k * 3 + 2] = srcCol.getZ(i);
      // 렌즈가 옮긴 사본은 **상징이지 천체가 아니다** — 당겨진 자리의 거리로
      // 원반을 키우면 압축이 크기로 새어 나가 광도와 구분되지 않는다.
      px[k] = starDiameterPx(this.baseGlare[i] ?? 0, 0);
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
    // 0.55 를 곱하면 하늘 위 1.86:1 로 떨어져 테제가 측정한 --stitch(3.52:1)가
    // 아니다. 페이드는 lensK 가 맡고 잉크는 토큰 그대로 둔다.
    (this.lensTraces.material as THREE.LineBasicMaterial).opacity = this.lensK;
  }

  private present(i: number): boolean {
    const a = this.authorAt(i);
    return !a || starLife(a, this.state.year).presence > 0.05;
  }

  private refreshConstellation(): void {
    this.buildLines(this.constellation, this.state.lens ? this.state.lens.lines : []);
    this.buildLines(this.egoLines, this.state.ego);
  }

  /** 실제로 그려진 선의 양 끝 — 계약이 "착륙한 천체에 닿는 선이 0"을 여기서 센다 */
  private drawnLineEnds: Array<[string, string]> = [];

  private buildLines(mesh: THREE.LineSegments, lines: LensLine[]): void {
    if (mesh === this.egoLines) {
      this.drawnLineEnds = [];
      this.egoDirected = [];
      this.threadEnd = null;
    }
    // 회랑의 실은 한 선이 24개 세그먼트가 된다 — 버퍼는 넉넉히 잡고 앞부분만 쓴다
    const cap = lines.length * 6 * 26 + 6;
    const pos = new Float32Array(cap);
    const col = new Float32Array(cap);
    let n = 0;
    const arcPush = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Color, weight: number): void => {
      const k = 0.3 + 0.7 * weight;
      const off = n * 6;
      pos[off] = a.x;
      pos[off + 1] = a.y;
      pos[off + 2] = a.z;
      pos[off + 3] = b.x;
      pos[off + 4] = b.y;
      pos[off + 5] = b.z;
      for (let sIdx = 0; sIdx < 2; sIdx++) {
        col[off + sIdx * 3] = c.r * k;
        col[off + sIdx * 3 + 1] = c.g * k;
        col[off + sIdx * 3 + 2] = c.b * k;
      }
      n++;
    };
    for (const l of lines) {
      const ia = this.index.get(l.a);
      const ib = this.index.get(l.b);
      if (ia === undefined || ib === undefined) continue;
      // 아직 태어나지 않은 별 사이에는 선도 없다 — 연도 스크럽에서 관계가
      // 그 관계의 당사자보다 먼저 존재하면 시간 채널이 거짓말이 된다
      if (!this.present(ia) || !this.present(ib)) continue;
      // 착륙 중의 실 (R12-c): 착륙한 천체에 닿는 선은 천체 중심이 아니라
      // **회랑의 앵커**(그 책·그 연도 칸·입구 명판)에서 출발해 하늘의 별로
      // 오르는 호(弧)가 된다 — "1947년 보고타에서 『변신』을 읽었다"가 기하가
      // 되는 자리다. 렌즈 선(mesh !== egoLines)은 여전히 표면에서 퇴장한다.
      const landed = this.state.landedId;
      if (landed && (l.a === landed || l.b === landed)) {
        if (mesh !== this.egoLines || !this.corridorFrame) continue;
        const otherId = l.a === landed ? l.b : l.a;
        const anchorP = this.anchorPoint(l.anchor);
        // 닿을 자리가 화면에 없으면 **실을 그리지 않는다** — 캔버스 밖으로
        // 날려 보내면 사용자는 아무것도 못 보고, 계측은 착지점이 있는 것처럼
        // 거짓을 말한다(적대 심사 2026-08-28).
        if (!anchorP) {
          this.threadEnd = null;
          continue;
        }
        const starP = this.effectivePos(otherId, new THREE.Vector3());
        this.threadEnd = anchorP.clone();
        const mid = anchorP
          .clone()
          .add(starP)
          .multiplyScalar(0.5)
          .addScaledVector(this.corridorFrame.outward, anchorP.distanceTo(starP) * 0.22);
        const SEG = 24;
        const prev = new THREE.Vector3();
        const cur = new THREE.Vector3();
        const col = new THREE.Color(l.color);
        for (let t = 0; t < SEG; t++) {
          const t0 = t / SEG;
          const t1 = (t + 1) / SEG;
          quadBezier(anchorP, mid, starP, t0, prev);
          quadBezier(anchorP, mid, starP, t1, cur);
          arcPush(prev, cur, col, l.weight);
        }
        this.drawnLineEnds.push([l.a, l.b]);
        if (l.directed) {
          // 방향: 나가는 관계(landed = a)면 화살촉이 별에, 들어오는 관계면 앵커에
          if (l.a === landed) this.egoDirected.push({ a: l.a, b: l.b, color: l.color, start: anchorP.clone() });
          else this.egoDirected.push({ a: l.a, b: l.b, color: l.color, end: anchorP.clone() });
        }
        continue;
      }
      this.drawnLineEnds.push([l.a, l.b]);
      if (mesh === this.egoLines && l.directed) this.egoDirected.push({ a: l.a, b: l.b, color: l.color });
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
    if (mesh === this.egoLines) {
      this.arrowsDirty = true;
      if (!this.egoDirected.length) {
        this.arrowTips = [];
        this.egoArrows.geometry.setDrawRange(0, 0);
      }
    }
  }

  /** 천체의 현재 월드 반경 — 초점 천체는 렌즈 배율만큼 커져 있다 */
  private apparentRadius(id: string): number {
    const i = this.index.get(id);
    if (i === undefined) return 1;
    const base = this.radii[i] ?? 1;
    return id === this.state.focusId && !this.state.landedId ? base * (1 + (LENS_MAG - 1) * this.lensK) : base;
  }

  /**
   * 화살촉 — 방향 있는 자기 성좌 선의 **도착 끝**에, 도착 천체의 가장자리에
   * 닿게 놓는다. 카메라를 향해 눕힌 삼각형이라 매 프레임 다시 세운다(선 ≤ 20,
   * 비용 없음). 선이 너무 짧아 화살촉이 출발점까지 먹으면 그리지 않는다 —
   * 방향을 잘못 말하느니 말하지 않는다.
   */
  private refreshArrows(): void {
    const lines = this.egoDirected;
    const pos = this.arrowPos;
    const col = this.arrowCol;
    const view = this.camera.getWorldDirection(new THREE.Vector3());
    const pa = new THREE.Vector3();
    const pb = new THREE.Vector3();
    const d = new THREE.Vector3();
    const side = new THREE.Vector3();
    const tip = new THREE.Vector3();
    const base = new THREE.Vector3();
    const c = new THREE.Color();
    this.arrowTips = [];
    let m = 0;
    for (const l of lines) {
      if (m >= ARROW_CAP) break;
      if (l.start) pa.copy(l.start);
      else this.effectivePos(l.a, pa);
      if (l.end) pb.copy(l.end);
      else this.effectivePos(l.b, pb);
      d.subVectors(pb, pa);
      const len = d.length();
      if (len < 1e-3) continue;
      d.divideScalar(len);
      // 끝이 앵커(회랑의 한 점)면 천체 반경이 아니라 작은 여백만 남긴다
      const margin = l.end ? 1.5 : this.apparentRadius(l.b) + 2;
      const size = Math.min(14, Math.max(5, len * 0.035));
      if (len < margin + size * 1.5) continue;
      tip.copy(pb).addScaledVector(d, -margin);
      base.copy(tip).addScaledVector(d, -size);
      side.crossVectors(d, view);
      if (side.lengthSq() < 1e-6) side.set(0, 1, 0).cross(d);
      side.normalize().multiplyScalar(size * 0.42);
      c.set(l.color);
      const off = m * 9;
      pos[off] = tip.x;
      pos[off + 1] = tip.y;
      pos[off + 2] = tip.z;
      pos[off + 3] = base.x + side.x;
      pos[off + 4] = base.y + side.y;
      pos[off + 5] = base.z + side.z;
      pos[off + 6] = base.x - side.x;
      pos[off + 7] = base.y - side.y;
      pos[off + 8] = base.z - side.z;
      for (let k = 0; k < 3; k++) {
        col[off + k * 3] = c.r;
        col[off + k * 3 + 1] = c.g;
        col[off + k * 3 + 2] = c.b;
      }
      this.arrowTips.push({ a: l.a, b: l.b, tip: tip.clone(), start: l.start, end: l.end });
      m++;
    }
    const g = this.egoArrows.geometry;
    (g.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    (g.getAttribute("color") as THREE.BufferAttribute).needsUpdate = true;
    g.setDrawRange(0, m * 3);
    this.arrowsDirty = false;
    this.arrowCam.copy(this.camera.position);
    this.arrowQuat.copy(this.camera.quaternion);
  }

  /**
   * 계측: 화살촉이 실제로 도착 끝에 있는가. 저장된 끝점을 **현재** 양 끝 위치와
   * 다시 재서 센다 — 화살촉을 출발 끝에 놓는 변이가 초록으로 남지 않게.
   */
  private arrowMetrics(): { arrows: number; arrowsExpected: number; arrowsAtTarget: number } {
    const pa = new THREE.Vector3();
    const pb = new THREE.Vector3();
    let atTarget = 0;
    for (const t of this.arrowTips) {
      if (t.start) pa.copy(t.start);
      else this.effectivePos(t.a, pa);
      if (t.end) pb.copy(t.end);
      else this.effectivePos(t.b, pb);
      const toB = t.tip.distanceTo(pb);
      const toA = t.tip.distanceTo(pa);
      const margin = t.end ? 1.5 + 1e-3 : this.apparentRadius(t.b) + 2 + 1e-3;
      if (toB < toA && toB <= margin) atTarget++;
    }
    return { arrows: this.arrowTips.length, arrowsExpected: this.egoDirected.length, arrowsAtTarget: atTarget };
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
    this.corridorStand = [];
    this.eventSlips = [];
    this.pullK.clear();
    this.threadEnd = null;
    this.cityGroup.visible = true;
  }

  private refreshCities(): void {
    this.clearCities();
    const id = this.state.landedId;
    if (!id) return;
    const rec = this.ensureBody(id);
    if (!rec) return;
    const author = this.data.authors.find((a) => a.id === id);
    if (!author) return;
    const works = this.data.works.filter((w) => w.authorId === id);
    if (!works.length) return;

    // ——— 서가 회랑 (R12-c) ———
    // 회랑은 제3의 공간이 아니라 **이 행성의 표면**이다: 벽은 착륙한 지각과 같은
    // 원고 종이이고, 연도 칸은 표면의 호를 따라 지평선 너머로 이어진다. 칸은
    // 연도당 하나, 균일하다 — 이전 서가의 최소-간격 압축은 여기서 소멸한다.
    // 전부 책등이고, 당기면 표지가 나온다(CPO 룰링: 책장의 리듬은 책등이다).
    const order = author.readingOrder ?? [];
    const radial = rec.center.clone().normalize();
    const outward = this.arrivalDir(radial, SHELF_AXIS_DEG);
    const camDir = this.arrivalDir(radial, SHELF_AXIS_DEG + LANDING_INCIDENCE_DEG);
    const right = new THREE.Vector3().crossVectors(outward, camDir).normalize();
    const toward = camDir.clone().addScaledVector(outward, -camDir.dot(outward)).normalize();
    const lonAxis = new THREE.Vector3().crossVectors(outward, right).normalize();
    const latAxis = new THREE.Vector3().crossVectors(outward, toward).normalize();

    const R = rec.radius;
    const workYears = works.map((w) => w.year);
    const anchorYears: number[] = [];
    for (const r of this.data.relations ?? []) {
      if (r.sourceId !== id && r.targetId !== id) continue;
      for (const an of r.anchors ?? []) {
        const y = anchorYearOf(an, (wid) => this.data.works.find((w) => w.id === wid)?.year);
        if (y !== undefined) anchorYears.push(y);
      }
    }
    const span = corridorSpan(workYears, anchorYears, author.deathYear);
    // 책의 크기는 회랑이 정한다 — 회랑 전체 호의 상한이 칸 호를, 칸 호가 책
    // 폭을 역산한다. 책은 사람 척도로 작아지고 지평선은 행성 척도로 남는다.
    const bayN = Math.max(1, Math.round(span.yEnd - span.yStart));
    const cellArc = corridorCellArc(bayN, volumeWidth(works.length));
    const bw = (cellArc / CORRIDOR_CELL_AIR) * R;
    const bh = bw * VOL_ASPECT;
    const bd = bw * VOL_DEPTH;
    const harm = genreHarmonics(author);
    this.corridorFrame = {
      center: rec.center.clone(),
      radius: R,
      outward,
      lonAxis,
      latAxis,
      harm,
      span,
      cellArc,
      bw,
      bh,
      bd,
      eyePhi: (bh * 1.9) / R,
      eyeLift: (bh * CORRIDOR_EYE) / R,
      fwd: new THREE.Vector3()
    };

    const dirAt = (theta: number, phi: number): THREE.Vector3 =>
      outward.clone().applyAxisAngle(lonAxis, theta).applyAxisAngle(latAxis, phi).normalize();
    const onSurface = (d: THREE.Vector3, lift: number): THREE.Vector3 =>
      rec.center.clone().addScaledVector(d, R * (silhouetteRadius(harm, d.x, d.y, d.z) + lift));
    const pointAt = (theta: number, phi: number, lift: number): THREE.Vector3 =>
      onSurface(dirAt(theta, phi), lift);
    this.corridorFrame.fwd
      .copy(pointAt(0.02, 0, 0))
      .sub(pointAt(-0.02, 0, 0))
      .normalize();
    // 새 회랑에 들어서면 입구에 선다. 걸어 둔 자리와 돌린 고개는 그 회랑의 것이다.
    this.walkYear = span.yStart + 0.8;
    this.walkVel = 0;
    this.lookYaw = 0;
    this.lookPitch = 0;

    // ——— 재질: 벽은 지각과 같은 종이 ———
    const wallMat = this.crustWallMaterial(rec);
    const boardMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x4a3c28),
      roughness: 0.97
    });
    // 개구부 모서리는 화면의 유일한 밝은 선이다 — 각인 잉크(stitch)가 아니라
    // 놋쇠. 각인·사망선과 같은 잉크면 구조 프레임이 주석과 구분되지 않는다.
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(COLORS.brass),
      transparent: true,
      opacity: 0.9
    });

    // ——— 칸의 치수 ———
    const cellW = cellArc * R;
    const boardT = bh * 0.075;
    const rowH = bh * (1 + CORRIDOR_ROW_GAP);
    const wallH = rowH * 2 + boardT;
    const backD = bd * 1.9;
    const postW = cellW * 0.055;

    const bayCount = bayN;
    const bookBaseZ = -backD * 0.2;
    const bayOf = new Map<number, THREE.Group>();

    for (let k = 0; k < bayCount; k++) {
      const year = span.yStart + k;
      const th = corridorTheta(year + 0.5, span, cellArc);
      const base = pointAt(th, 0, 0);
      const U0 = base.clone().sub(rec.center).normalize();
      const T = pointAt(th + 0.01, 0, 0).sub(pointAt(th - 0.01, 0, 0)).normalize();
      // 프레임은 **경로의 평행이동 프레임**이고 언제나 오른손이다: U 는 T 에
      // 직교화한 위, N = T × U. 이전 판은 φ-오프셋 방향으로 벽면을 뒤집었는데,
      // φ-회전은 경로를 따라 평행이동되지 않아 θ ≈ 90° 너머에서 경로의 좌우를
      // 건너간다 — 그 보정이 왼손 기저(det −1)를 만들어 칸을 뒤틀었다(실측:
      // 소세키 1914 칸 |q| 0.795, 책등 축 38° 틀어짐). 횡 오프셋이 필요한 것들
      // (바닥·카메라·앵커)은 φ 가 아니라 이 프레임의 N 으로 옮긴다.
      const U = U0.clone().addScaledVector(T, -U0.dot(T)).normalize();
      const N = new THREE.Vector3().crossVectors(T, U).normalize();
      const bay = new THREE.Group();
      bay.position.copy(base);
      bay.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(T, U, N));
      // 경첩 자식 — 접힘은 이 그룹의 x축 회전이다(축 = 회랑 접선)
      const stand = new THREE.Group();
      bay.add(stand);
      this.corridorStand.push(stand);
      bayOf.set(year, stand);
      this.cityGroup.add(bay);
      this.cityChrome.push(bay);

      // 뒤판(원고 종이) — 회랑의 벽
      const back = new THREE.Mesh(new THREE.PlaneGeometry(cellW, wallH), wallMat);
      back.position.set(0, wallH / 2, -backD);
      stand.add(back);
      // 기둥 둘 + 판 셋(바닥·단·상단)
      for (const sx of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(postW, wallH, backD), boardMat);
        post.position.set((sx * (cellW - postW)) / 2, wallH / 2, -backD / 2);
        stand.add(post);
      }
      for (const yb of [0, rowH, 2 * rowH]) {
        const board = new THREE.Mesh(new THREE.BoxGeometry(cellW, boardT, backD), boardMat);
        board.position.set(0, yb + boardT / 2, -backD / 2);
        stand.add(board);
      }
      // 개구부의 놋쇠 모서리 — 하늘 격자와 같은 잉크
      const eg = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-cellW / 2, 0, 0),
        new THREE.Vector3(-cellW / 2, wallH, 0),
        new THREE.Vector3(cellW / 2, 0, 0),
        new THREE.Vector3(cellW / 2, wallH, 0),
        new THREE.Vector3(-cellW / 2, wallH, 0),
        new THREE.Vector3(cellW / 2, wallH, 0)
      ]);
      const edge = new THREE.LineSegments(eg, edgeMat);
      stand.add(edge);
    }

    // ——— 바닥: 연도 각인 — 5년마다 숫자, 매 연도 가는 줄 ———
    const floorPts: THREE.Vector3[] = [];
    for (let k = 0; k <= bayCount; k++) {
      const year = span.yStart + k;
      const th = corridorTheta(year, span, cellArc);
      const a = this.corridorLatPoint(th, bh * 0.12, 0.001);
      const b = this.corridorLatPoint(th, bh * 4.2, 0.001);
      floorPts.push(a, b);
      if (year % 5 === 0) {
        const numeral = new THREE.Mesh(
          new THREE.PlaneGeometry(bh * 0.62, bh * 0.28),
          new THREE.MeshBasicMaterial({
            map: this.numeralTexture(year),
            transparent: true,
            depthWrite: false
          })
        );
        const np = this.corridorLatPoint(th + cellArc * 0.22, bh * 2.3, 0.002);
        const nu = np.clone().sub(rec.center).normalize();
        const nt = this.corridorLatPoint(th + 0.01, bh * 2.3, 0).sub(this.corridorLatPoint(th - 0.01, bh * 2.3, 0)).normalize();
        const nn = new THREE.Vector3().crossVectors(nt, nu).normalize();
        numeral.position.copy(np);
        numeral.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(nt, nn, nu));
        this.cityGroup.add(numeral);
        this.cityChrome.push(numeral);
        this.cityTicks++;
      }
    }
    const floorLines = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(floorPts),
      new THREE.LineBasicMaterial({ color: new THREE.Color(COLORS.stitch), transparent: true, opacity: 0.78 })
    );
    this.cityGroup.add(floorLines);
    this.cityChrome.push(floorLines);
    for (const q of floorPts) this.cityAnchors.push(q.clone());

    // ——— 1924 사망선: 그 해의 칸에 세로 점선 — 침묵의 설명 ———
    if (author.deathYear !== undefined && author.deathYear >= span.yStart && author.deathYear <= span.yEnd) {
      const stand = bayOf.get(author.deathYear);
      if (stand) {
        const thD = corridorTheta(author.deathYear, span, cellArc);
        const thMid = corridorTheta(author.deathYear + 0.5, span, cellArc);
        const dx = (thD - thMid) * R;
        const dashPts: THREE.Vector3[] = [];
        const dashN = 9;
        for (let i = 0; i < dashN; i++) {
          const y0 = (wallH * 1.12 * i) / dashN;
          dashPts.push(new THREE.Vector3(dx, y0, 0.004), new THREE.Vector3(dx, y0 + (wallH * 1.12) / dashN / 2, 0.004));
        }
        const death = new THREE.LineSegments(
          new THREE.BufferGeometry().setFromPoints(dashPts),
          new THREE.LineBasicMaterial({ color: new THREE.Color(COLORS.stitch), transparent: true, opacity: 0.85 })
        );
        death.userData.deathLine = true;
        stand.add(death);
        const tag = new THREE.Mesh(
          new THREE.PlaneGeometry(bh * 0.9, bh * 0.22),
          new THREE.MeshBasicMaterial({
            map: this.engravedTexture(`${author.deathYear} · 사망`),
            transparent: true,
            depthWrite: false
          })
        );
        tag.position.set(dx, wallH * 1.2, 0.004);
        stand.add(tag);
        this.cityChrome.push(death, tag);
      }
    }

    // ——— 입구 명판: 서명(실물) + 각인 — 회랑의 첫 칸 ———
    const first = bayOf.get(span.yStart + 1) ?? this.corridorStand[0];
    if (first) {
      const plate = new THREE.Mesh(
        new THREE.PlaneGeometry(cellW * 0.9, wallH * 0.52),
        new THREE.MeshBasicMaterial({ map: this.platePlateTexture(author, span), transparent: false })
      );
      plate.position.set(0, wallH * 0.62, -backD * 0.18);
      plate.userData.plate = true;
      first.add(plate);
      this.cityChrome.push(plate);
    }

    // ——— 책: 전부 책등, 제 연도의 칸에 ———
    const byYearCount = new Map<number, number>();
    works.forEach((w) => byYearCount.set(w.year, (byYearCount.get(w.year) ?? 0) + 1));
    const yearSeen = new Map<number, number>();
    for (const w of [...works].sort((a, b) => a.year - b.year)) {
      const stand = bayOf.get(w.year);
      if (!stand) continue;
      const oi = order.indexOf(w.id);
      const nIn = byYearCount.get(w.year) ?? 1;
      const slot = yearSeen.get(w.year) ?? 0;
      yearSeen.set(w.year, slot + 1);
      // 같은 해의 두 권은 **폭**만큼 떨어져야 한다. 옛 식은 두께 상수(bd·2.2 =
      // 0.66bw)를 폭 축에 썼고, 그래서 타고르 1910 의 『기탄잘리』와 『고라』가
      // 서로를 폭의 34% 만큼 관통했다(실측 minGap −17.5px). 최소 공기는
      // VOL_AIR 가 이미 정의한다. 무리가 칸보다 넓어지면 칸에 맞게 함께
      // 얇아진다 — 칸을 넘어 옆 해로 넘치는 것보다 얇은 권이 정직하다.
      const step = bw * VOL_AIR;
      const spread = (nIn - 1) * step + bw;
      const fit = Math.min(1, (cellW * 0.94) / spread);
      const dx = nIn > 1 ? (slot - (nIn - 1) / 2) * step * fit : 0;
      const rowBase = (oi >= 0 ? 0 : rowH) + boardT;
      const wrap = new THREE.Group();
      wrap.position.set(dx, rowBase, bookBaseZ);
      if (nIn > 1) wrap.scale.x = fit;
      wrap.userData.workId = w.id;
      const cover = this.data.art?.covers?.[w.id];
      const vol = this.buildVolume(w, bw, bh, bd, cover?.file);
      // 책등이 **입구**를 향한다 — 회랑을 걸어 들어오는 시선에 책등의 리듬이
      // 정면으로 선다(전부 책등, CPO 룰링). 당기면 표지가 통로를 향해 돌고
      // 카메라가 그 책 앞으로 온다(당김의 보상 = 실물 표지).
      vol.root.rotation.y = Math.PI;
      wrap.add(vol.root);
      const proxy = new THREE.Mesh(
        new THREE.BoxGeometry(Math.max(bd * 2.4, bw * 0.6), bh * 1.1, bw),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      proxy.position.set(0, bh * 0.5, 0);
      proxy.userData.workId = w.id;
      proxy.userData.hitProxy = true;
      wrap.add(proxy);
      stand.add(wrap);
      const bayObj = stand.parent as THREE.Group;
      const bayQ = bayObj.getWorldQuaternion(new THREE.Quaternion());
      this.cityRecords.push({
        workId: w.id,
        obj: wrap,
        pos: new THREE.Vector3(),
        year: w.year,
        book: vol.root,
        spine: vol.spine,
        front: vol.front,
        halfW: bw * 0.5,
        halfH: bh * 0.5,
        halfD: bd * 0.5,
        /** 칸 안에서의 국소 X 오프셋과 폭 배율 — 같은 칸의 관통은 화면이
         *  아니라 **여기서** 재야 한다(회랑 카메라는 서가를 스치듯 보므로
         *  나란히 선 두 권의 화면 상자는 언제나 겹친다). */
        localX: dx,
        scaleX: nIn > 1 ? fit : 1,
        row: oi >= 0 ? 0 : 1,
        orderIndex: oi,
        lon: corridorTheta(w.year, span, cellArc),
        tangent: new THREE.Vector3(1, 0, 0).applyQuaternion(bayQ),
        normal: new THREE.Vector3(0, 0, 1).applyQuaternion(bayQ)
      });
    }
    // ——— 연보 명패: 빈 칸을 채우는 것은 장식이 아니라 **일어난 일**이다 ———
    // (CPO 2026-08-25: "꼭 책이 아니더라도 넣을 만한 것들이 있으면 전부 넣어서
    // 채우자") 관계 앵커의 연도 사건(1938 서문 · 1947 보고타 · 1969 카네티…)과
    // 발표 연도 밖의 판본 사건(1916 『선고』 단행본)이 제 해의 칸에 명패로
    // 선다. 전부 /data 에 이미 있는, 출처 달린 사실이다 — 사망선 뒤의 침묵을
    // 수용사(受容史)가 채우고, 그래도 빈 칸만 진짜 침묵으로 남는다.
    type CorridorEvent = { year: number; big: string; small: string; relId?: string };
    const events: CorridorEvent[] = [];
    for (const r of this.data.relations ?? []) {
      if (r.sourceId !== id && r.targetId !== id) continue;
      const otherId = r.sourceId === id ? r.targetId : r.sourceId;
      const other = this.data.authors.find((a) => a.id === otherId);
      if (!other) continue;
      const seenYears = new Set<number>();
      for (const an of r.anchors ?? []) {
        // 연보의 연도는 **사건이 일어난 해**다(an.year 우선). 실이 닿는 책의
        // 발표 연도(anchorYearOf)와는 다른 사상이다 — 1947 보고타의 독서는
        // 1947 칸의 사건이고, 실은 1915 의 『변신』에 닿는다.
        const y = an.year ?? anchorYearOf(an, (wid) => this.data.works.find((w) => w.id === wid)?.year);
        if (y === undefined || seenYears.has(y)) continue;
        seenYears.add(y);
        const glyph = relationGlyph(r, id);
        events.push({
          year: y,
          big: `${glyph} ${other.names.ko}`,
          small: REL_KO[r.type] ?? r.type,
          relId: r.id
        });
      }
    }
    for (const w of works) {
      for (const e of w.world?.editions ?? []) {
        if (e.year !== w.year) {
          events.push({
            year: e.year,
            big: `『${w.titleKo}』`,
            small: e.kind === "first-printing" ? "첫 인쇄" : w.world?.posthumous ? "초판 · 유고" : "초판"
          });
        } else if (e.kind === "first-printing" && e.venue) {
          // 같은 해의 첫 인쇄는 그 책 칸의 윗단 명패가 된다 — 게재지 이름은
          // /data 의 사실이고, 책의 시대 쪽 밀도를 실제 사건으로 채운다.
          const m = e.venue.match(/『[^』]+』/);
          events.push({ year: e.year, big: m ? m[0] : e.publisher, small: "첫 인쇄" });
        }
      }
    }
    const slotInCell = new Map<number, number>();
    // 책이 선 칸의 아랫단은 책의 자리다 — 명패는 그 위 단으로 올라간다
    const bookRows = new Map<number, Set<number>>();
    for (const c of this.cityRecords) {
      if (!bookRows.has(c.year)) bookRows.set(c.year, new Set());
      bookRows.get(c.year)!.add(c.row);
    }
    // 한 칸의 명패는 둘까지다(R13-c) — 앵커 웨이브가 채운 해는 명패가 탑으로
    // 쌓여 칸 위 공간을 다 먹었다("책장의 구분을 뛰어넘어서 공간 차지" — 문 0
    // 2차). 셋째부터는 "외 N건" 한 장으로 접는다: 기록은 정확히, 화면은 조용히.
    const perYear = new Map<number, typeof events>();
    for (const ev of events.sort((x, y) => x.year - y.year)) {
      (perYear.get(ev.year) ?? perYear.set(ev.year, []).get(ev.year)!).push(ev);
    }
    for (const [yr, evs] of perYear) {
      const stand = bayOf.get(yr);
      if (!stand) continue;
      const occupied = bookRows.get(yr);
      const rowBase = occupied?.has(0) && !occupied.has(1) ? rowH : occupied?.has(0) ? rowH : 0;
      const shown = evs.length > 2 ? evs.slice(0, 2) : evs;
      const folded = evs.length - shown.length;
      const put = (big: string, small: string, slot: number, relId?: string, year?: number, folded = false) => {
        const slip = new THREE.Mesh(
          new THREE.PlaneGeometry(cellW * 0.72, cellW * 0.3),
          new THREE.MeshBasicMaterial({
            map: this.eventSlipTexture(big, small),
            transparent: false
          })
        );
        slip.position.set(0, rowBase + boardT + bh * (0.34 + slot * 0.42), -backD * 0.12);
        slip.userData.eventSlip = true;
        stand.add(slip);
        this.cityChrome.push(slip);
        this.eventSlips.push({ relId, year: year ?? yr, obj: slip, folded });
        slotInCell.set(yr, slot + 1);
      };
      shown.forEach((ev, slot) => put(ev.big, ev.small, slot, ev.relId, ev.year));
      if (folded > 0) put(`외 ${folded}건`, "연보", shown.length, undefined, undefined, true);
    }

    this.applyFold();
    this.updateCorridor(0);
  }

  /** 연보 명패의 지면 — 종이 슬립에 이름 크게, 유형 작게 */
  private eventSlipTexture(big: string, small: string): THREE.Texture {
    const key = `event:${big}|${small}`;
    const hit = this.texCache.get(key);
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 212;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#e7dfc8";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "#4a3c28";
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, c.width - 16, c.height - 16);
    ctx.fillStyle = "#3b2f1e";
    ctx.textAlign = "center";
    ctx.font = "600 52px 'Noto Serif KR', serif";
    ctx.fillText(big, c.width / 2, 96, c.width - 48);
    ctx.fillStyle = "#6b5b40";
    ctx.font = "500 34px 'Noto Serif KR', serif";
    ctx.fillText(small, c.width / 2, 158, c.width - 48);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.texCache.set(key, tex);
    return tex;
  }

  /**
   * 회랑 경로 프레임의 횡 좌표 — θ 위의 기준점에서 경로 법선(N) 방향으로 lat
   * (월드 단위) 만큼 나간 뒤 표면에 재투영한다. φ-회전을 쓰지 않는 이유는 위
   * 기저 주석과 같다.
   */
  private corridorLatPoint(th: number, lat: number, lift: number): THREE.Vector3 {
    const f = this.corridorFrame;
    if (!f) return new THREE.Vector3();
    const dirAt = (theta: number): THREE.Vector3 =>
      f.outward.clone().applyAxisAngle(f.lonAxis, theta).normalize();
    const at0 = (theta: number): THREE.Vector3 => {
      const d = dirAt(theta);
      return f.center
        .clone()
        .addScaledVector(d, f.radius * silhouetteRadius(f.harm, d.x, d.y, d.z));
    };
    const base = at0(th);
    const U0 = base.clone().sub(f.center).normalize();
    const T = at0(th + 0.01).sub(at0(th - 0.01)).normalize();
    const U = U0.clone().addScaledVector(T, -U0.dot(T)).normalize();
    const N = new THREE.Vector3().crossVectors(T, U).normalize();
    const dir2 = base.clone().addScaledVector(N, lat).sub(f.center).normalize();
    return f.center
      .clone()
      .addScaledVector(dir2, f.radius * (silhouetteRadius(f.harm, dir2.x, dir2.y, dir2.z) + lift));
  }

  /**
   * 실의 앵커 — 관계가 회랑에서 닿는 자리. 책 앵커는 그 책의 머리, 연도 앵커는
   * 그 해의 바닥 각인, 앵커가 없으면 입구 명판(이름에 닿는다 — 그것도 정직한
   * 독해다).
   */
  private anchorPoint(anchor?: { workId?: string; year?: number }): THREE.Vector3 | null {
    const p = this.anchorTarget(anchor);
    // **어느 분기에서 왔든 화면 밖이면 실을 그리지 않는다.** 처음에는 입구 명판
    // 폴백에만 가드를 걸었는데, 계약이 곧바로 두 번째 경우를 잡았다 — 연도
    // 앵커도 화면 아래로 나간다(`[619, 1333]`, 뷰포트 높이 1000). 가드는 출구
    // 한 곳에 있어야지 분기마다 있으면 다음 분기에서 또 새어 나간다.
    return p && this.onScreen(p) ? p : null;
  }

  /** 앵커가 회랑에서 가리키는 자리 — 화면 안팎은 따지지 않는다(`anchorPoint` 가 판정) */
  private anchorTarget(anchor?: { workId?: string; year?: number }): THREE.Vector3 | null {
    const f = this.corridorFrame;
    if (!f) return null;
    if (anchor?.workId) {
      const rec = this.cityRecords.find((c) => c.workId === anchor.workId);
      if (rec) {
        const q = rec.obj.getWorldPosition(new THREE.Vector3());
        const up = q.clone().sub(f.center).normalize();
        return q.addScaledVector(up, f.bh * 1.12);
      }
    }
    if (anchor?.year !== undefined) {
      // 그 해의 명패가 서 있으면 실은 바닥이 아니라 명패에 닿는다 — 사건에
      // 사건의 실이 닿는 것이 연보의 문법이다.
      const slip = this.eventSlips.find((e) => e.year === anchor.year);
      if (slip) {
        const q = slip.obj.getWorldPosition(new THREE.Vector3());
        const up = q.clone().sub(f.center).normalize();
        return q.addScaledVector(up, f.bh * 0.2);
      }
      return this.corridorLatPoint(corridorTheta(anchor.year, f.span, f.cellArc), f.bh * 1.1, 0.004);
    }
    // 명판 — 회랑의 입구 칸.
    //
    // **다만 그 이름이 화면에 있을 때만이다.** 이 폴백은 "앵커가 없으면 이름에
    // 닿는다 — 그것도 정직한 독해다"로 설계됐는데, 회랑을 걸어 들어간 뒤에는
    // 입구가 옆으로 한참 밀려나 실이 캔버스 밖 수천 px 로 날아갔다(적대 심사
    // 실측 2026-08-28: `threadEnd = [-3564, 612]`, 뷰포트는 1600×1000). 화면에는
    // 아무 호도 그려지지 않고 별 옆에 뭉개진 점 하나만 남는다 — 이름에 닿기는
    // 커녕 **닿지 않는다는 말조차 못 하고 있었다.**
    //
    // 이름이 보이면 이름에 닿고, 보이지 않으면 **실을 그리지 않는다.** 그리지
    // 않는 것이 이 회랑의 어떤 책에도 닿지 않는다는 뜻이다 — 만들지 않은 것을
    // 만들지 않았다고 적는 이 프로젝트의 버릇 그대로다.
    return this.corridorLatPoint(
      corridorTheta(f.span.yStart + 1.5, f.span, f.cellArc),
      0,
      (f.bh * 1.4) / f.radius
    );
  }

  /**
   * 실이 닿을 수 있는 자리인가 — **프레임 안일 필요는 없고, 프레임 곁이면 된다.**
   *
   * 처음에는 "뷰포트 안"으로 잡았는데 계약이 곧바로 반례를 냈다: 가장자리에
   * 걸쳐 선 책(『변신』, 화면 상자 x −159…50)은 머리가 57px 밖이어서 실이
   * 지워졌다 — 그 실은 멀쩡히 보이는 실이다. 심사가 잡은 진짜 결함은 정도가
   * 다르다(입구 명판 −3564px, 한 화면 너비의 2.2배 밖). 그래서 기준을 이분법이
   * 아니라 **거리**로 쓴다: 프레임 밖으로 **한 화면**까지는 실을 그린다(호의
   * 상당 부분이 화면에 남는다). 그보다 멀면 화면에 아무것도 남지 않으므로
   * 그리지 않는다.
   */
  private onScreen(p: THREE.Vector3): boolean {
    const v = p.clone().project(this.camera);
    const M = 3; // NDC — 프레임(±1) 밖으로 한 화면(±2) 더
    return v.z <= 1 && v.x >= -M && v.x <= M && v.y >= -M && v.y <= M;
  }

  /** 벽의 재질 — 착륙한 지각과 같은 원고 종이. 자산이 없으면 종이색 */
  private crustWallMaterial(rec: BodyRecord): THREE.MeshStandardMaterial {
    const key = `wall:${rec.id}`;
    const cached = this.texCache.get(key);
    const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(0xb0a288), roughness: 0.96 });
    if (cached) {
      mat.map = cached;
      return mat;
    }
    const pre = this.assets?.authorId === rec.id ? this.assets.ground : null;
    if (pre) {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.drawImage(pre, 0, 0, c.width, c.height);
        const d = ctx.getImageData(0, 0, c.width, c.height);
        const px = d.data;
        for (let i = 0; i < px.length; i += 4)
          for (let j = 0; j < 3; j++) {
            const v = px[i + j] as number;
            px[i + j] = Math.max(0, Math.min(255, 232 - (232 - v) * 2.6));
          }
        ctx.putImageData(d, 0, 0);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        this.texCache.set(key, tex);
        mat.map = tex;
      }
    }
    return mat;
  }

  /** 기기 각인 텍스트(연도·사망선 등) — 숫자 텍스처와 같은 잉크 */
  private engravedTexture(text: string): THREE.Texture {
    const key = `engraved:${text}`;
    const hit = this.texCache.get(key);
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = COLORS.stitch;
    ctx.font = `500 64px 'Noto Serif KR', serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, c.width / 2, c.height / 2);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.texCache.set(key, tex);
    return tex;
  }

  /** 입구 명판 — 실물 서명 + 각인. 지어낸 것 없음: 서명 자산이 없으면 활자만 */
  private platePlateTexture(author: Author, span: CorridorSpan): THREE.Texture {
    const key = `plate:${author.id}`;
    const hit = this.texCache.get(key);
    if (hit) return hit;
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 640;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#e7dfc8";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = COLORS.stitch;
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, c.width - 36, c.height - 36);
    const mark = this.assets?.authorId === author.id ? this.assets.mark : null;
    if (mark) {
      const mh = 220;
      const mw = Math.min(860, (mark.naturalWidth / mark.naturalHeight) * mh);
      ctx.drawImage(mark, (c.width - mw) / 2, 70, mw, mh);
    }
    ctx.fillStyle = "#4a3c28";
    ctx.textAlign = "center";
    ctx.font = `500 30px 'Noto Serif KR', serif`;
    ctx.fillText(mark ? "서명 · 실물" : "서명 미보유", c.width / 2, 360);
    ctx.font = `600 64px 'Noto Serif KR', serif`;
    ctx.fillText(author.names.ko, c.width / 2, 452);
    ctx.font = `500 34px 'Noto Serif KR', serif`;
    ctx.fillText(`서고 ${span.yStart + CORRIDOR_LEAD_YEARS} – ${span.yEnd - CORRIDOR_TAIL_YEARS}`, c.width / 2, 540);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    this.texCache.set(key, tex);
    return tex;
  }

  /** 접힘 적용 — 경첩 자식들의 x축 회전. 4° 에서 출발해 z-fighting 을 피한다 */
  private applyFold(): void {
    const lie = -(Math.PI / 2 - 0.07);
    for (const g of this.corridorStand) g.rotation.x = lie * (1 - this.foldK);
    this.cityGroup.visible = this.foldK > 0.02 || !this.state.landedId;
    this.applySurfaceSky();
  }

  /** 별 버퍼를 표면 투영에 맞춘다 — 라벨·픽(effectivePos)과 같은 사상 */
  private applySurfaceSky(): void {
    const posAttr = this.starGeo.getAttribute("position") as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    const useProj = Boolean(this.state.landedId && this.corridorFrame && this.foldK > 0);
    for (let i = 0; i < this.order.length; i++) {
      const id = this.order[i] as string;
      if (useProj && id !== this.state.landedId) {
        this.surfaceSkyPos(id, v);
        const base = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
        base.lerp(v, this.foldK);
        posAttr.setXYZ(i, base.x, base.y, base.z);
      } else {
        const d = this.dirs[i] as THREE.Vector3;
        posAttr.setXYZ(i, d.x * SHELL_R, d.y * SHELL_R, d.z * SHELL_R);
      }
    }
    posAttr.needsUpdate = true;
  }

  /**
   * 매 프레임의 회랑 정비 — 월드 좌표 갱신(라벨·계약이 읽는다)과 당김 애니메이션.
   * 당김: 책등의 권이 칸에서 미끄러져 나와 관측자를 향해 돌며 표지를 보인다 —
   * 실물 표지가 주목의 순간에 나타나고, 없는 책은 민무늬 장정 그대로 나온다.
   */
  private updateCorridor(dt: number): void {
    if (!this.corridorFrame) return;
    // 당김 리프레임 — 책이 나오는 동안 카메라가 그 칸 정면으로 온다. 취소
    // 가능(드래그가 비행을 끊는 기존 규칙 그대로)이고, 닫으면 회랑 자세로.
    if (this.state.selectedWorkId !== this.lastPulled) {
      this.lastPulled = this.state.selectedWorkId;
      if (this.state.selectedWorkId) {
        const c = this.cityRecords.find((x) => x.workId === this.state.selectedWorkId);
        if (c) {
          const f = this.corridorFrame;
          const q = c.obj.getWorldPosition(new THREE.Vector3());
          const up = q.clone().sub(f.center).normalize();
          const bay = c.obj.parent?.parent; // stand → bay
          const N = new THREE.Vector3(0, 0, 1);
          if (bay) N.applyQuaternion(bay.getWorldQuaternion(new THREE.Quaternion()));
          const tgt = q.clone().addScaledVector(up, f.bh * 0.55);
          const approach = N.clone().addScaledVector(up, 0.35).normalize();
          this.flyTo(tgt, f.bh * 3.6, 700, approach, up);
        }
      } else if (this.state.landedId) {
        this.retarget();
      }
    }
    const { bd, bh } = this.corridorFrame;
    const step = dt > 0 ? Math.min(1, dt / 260) : 1;
    for (const c of this.cityRecords) {
      const want = c.workId === this.state.selectedWorkId ? 1 : 0;
      const cur = this.pullK.get(c.workId) ?? 0;
      const k = dt > 0 ? cur + Math.sign(want - cur) * step : want;
      const next = Math.max(0, Math.min(1, Math.abs(want - k) < step ? want : k));
      this.pullK.set(c.workId, next);
      const e = next * next * (3 - 2 * next);
      c.obj.position.z = -bd * 1.9 * 0.2 + e * (bd * 1.9 * 0.2 + bd * 2.0);
      c.obj.position.y = (c.row === 0 ? 0 : bh * (1 + CORRIDOR_ROW_GAP)) + bh * 0.075 + e * bh * 0.06;
      c.book.rotation.y = Math.PI * (1 - e);
      c.obj.getWorldPosition(c.pos);
    }
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

  /**
   * 회랑의 자세 — **걷는 사람의 좌표 하나**(`year`)와 고개 각도 둘로 완전히
   * 결정된다. 이전 판은 `yStart + 0.8` 을 상수로 박아 두었고, 그래서 착륙은
   * 자세였지 자리가 아니었다: 입구에 세워 놓고 회랑을 보여 줄 수는 있어도
   * 회랑을 걸을 수는 없었다.
   *
   * 입구 값(year = yStart + 0.8, yaw = pitch = 0)에서 이 함수는 R12-d 의
   * 착륙 자세와 **같은 값**을 낸다 — 진입 계약은 그대로 성립한다.
   */
  private corridorPose(
    year: number,
    yaw0: number,
    pitch0: number
  ): { eye: THREE.Vector3; dir: THREE.Vector3; up: THREE.Vector3; look: THREE.Vector3; L: number } | null {
    const f = this.corridorFrame;
    if (!f) return null;
    // 회랑의 착륙 자세 — 서가 앞에 서서 회랑을 따라 내려다본다. 주시점은 회랑
    // 안쪽(연도가 자라는 방향)이고, 눈높이는 사람이 서가 앞에 선 키다.
    // 위쪽 1/3 에 하늘이 남고, 지평선이 곡선으로 보인다.
    const thEye = corridorTheta(year, f.span, f.cellArc);
    // 세로 화면은 가로 시야를 잃는다(42° 세로 fov 기준: 가로 63° → 25°).
    // 넓은 화면의 자세를 그대로 쓰면 서가는 왼쪽 가장자리의 한 조각으로
    // 밀려나고 화면의 대부분이 빈 지면이 된다(실측). fov 는 건드리지
    // 않는다 — 별의 겉보기 크기가 그 값에 매여 있다. 대신 **서 있는
    // 자리**를 바꾼다: 벽에서 한 걸음 물러나 몸을 서가 쪽으로 돌린다.
    // 세로 프레임에는 물러나며 사라지는 서가가 세로로 앉는다.
    const port = Math.min(1, Math.max(0, (1.15 - this.camera.aspect) / 0.5));
    // 몸의 회랑(R13-c): 서가와의 거리는 책을 **읽을 수 있는** 거리다. 1.9권은
    // 코앞이었다("좌측의 서가를 보면 너무 가까워서 제대로 보이지도 않고" —
    // 문 0 2차, 최근접 책 화면 높이 ≈534px). 큰 회랑(카프카 88칸)은 2.45권에서
    // ≈420px — 팔을 뻗으면 닿을 듯하되 한 권이 한눈에 들어온다. 작은 회랑은
    // 행성 반경이 작아 곡률이 급하므로 같은 거리면 읽히는 책이 전부 좌측 크롬
    // 뒤로 들어간다(프로브 실측: 타고르 55칸 라벨 0) — 칸수로 보간해 덜 물러선다.
    const bays = Math.max(1, Math.round(f.span.yEnd - f.span.yStart));
    const spanK = Math.min(1, Math.max(0, (bays - 24) / 64));
    const lat = f.bh * (2.1 + 0.35 * spanK + 0.65 * port);
    this.poseLat = lat / f.bh;
    const eye = this.corridorLatPoint(thEye, lat, f.eyeLift);
    const n = eye.clone().sub(f.center).normalize();
    const fwd = f.fwd.clone().addScaledVector(n, -f.fwd.dot(n)).normalize();
    // 횡 방향 = 경로 법선(N). 프레임과 같은 평행이동이라 좌우가 뒤집히지 않는다.
    const side = this.corridorLatPoint(thEye, lat + f.bh, f.eyeLift).sub(eye).normalize();
    // side 는 서가에서 **멀어지는** 쪽이다. 넓은 화면에서는 +5° 로 살짝
    // 틀어 서가를 왼쪽에 두고, 세로 화면에서는 음수로 돌려 서가를 화면
    // 한가운데로 데려온다.
    // 물러선 만큼 몸을 서가 쪽으로 돌린다(R13-c) — lat 1.9→2.45 에서 요 +5° 를
    // 그대로 두면 서가가 화면 왼쪽 가장자리로 미끄러진다(프로브 실측). 기하 보정
    // ≈ atan(Δlat/전방 6칸) ≈ 5° → 넓은 화면 0°, 세로 화면은 기존 −15° 유지.
    const yaw = ((0 - 15 * port) * Math.PI) / 180 + yaw0;
    // 피치는 접평면이 아니라 **보이는 지평선** 기준이다. 작은 행성의 지평선은
    // 접평면보다 훨씬 아래에 있다(눈높이 0.12 에 반경 2.6 이면 침하 ≈ 17°).
    const hEye = f.radius * f.eyeLift;
    const dip = Math.acos(f.radius / (f.radius + hEye));
    // 세로 화면은 서가로 몸을 돌린 만큼 하늘을 잃는다 — 고개를 조금 든다.
    const pitch = ((9 + 5 * port) * Math.PI) / 180 - dip + pitch0;
    const dir = fwd
      .clone()
      .multiplyScalar(Math.cos(yaw))
      .addScaledVector(side, Math.sin(yaw))
      .multiplyScalar(Math.cos(pitch))
      .addScaledVector(n, Math.sin(pitch))
      .normalize();
    const L = f.cellArc * f.radius * 10;
    return { eye, dir, up: n.clone(), look: eye.clone().addScaledVector(dir, L), L };
  }

  private retarget(): void {
    const s = this.state;
    // 새로 고르거나 착륙하면 궤도는 다시 이어진다 — 지목 항법도 여기서 끝난다:
    // 연출 비행이 카메라를 데려가는 동안 호밍이 함께 당기면 두 손이 싸운다.
    this.orbitBroken = false;
    this.thrust = 0;
    this.aimId = null;
    this.aimAt = null;
    this.thrustDir = null;
    const cause = this.cameraCause ?? "pick";
    this.cameraCause = null;
    if (s.landedId) {
      const f = this.corridorFrame;
      if (!f) return;
      const p = this.corridorPose(this.walkYear, this.lookYaw, this.lookPitch);
      if (!p) return;
      this.landTarget = p.look;
      this.landUp = p.up;
      this.controls.minDistance = f.bh * 0.5;
      // 착륙은 진짜 여정이다 — 거리 무관 고정 1.4초는 워프로 읽혔고("카프카
      // 행성 눌러도 워프하듯이", 문 0 2차), 시간은 거리비의 함수가 된다.
      const dHere = this.camera.position.distanceTo(p.look);
      this.flyTo(p.look, p.L, this.flightDur(dHere, p.L), p.dir.clone().negate(), undefined,
        cause === "immediate");
      return;
    }
    if (s.focusId) {
      const i = this.index.get(s.focusId);
      if (i === undefined) return;
      const c = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      this.landTarget = null;
      const dNow = this.camera.position.distanceTo(c);
      if (cause === "pick") {
        // 관측선(R13-c): **고르는 것은 몸을 옮기지 않는다.** 카드가 열리고
        // 렌즈가 그 별을 확대한다 — 다가가는 것은 언제나 당신의 휠이다.
        // ("스크롤한 정도와 상황과 상관없이 클릭하면 훅 이동" — 문 0 2차)
        // 주시점 북키핑만 그 별로 — 고른 별이 곧 주시점이다(dist 계측의 원본).
        this.controls.target.copy(c);
        this.focusDistAtSelect = dNow;
        return;
      }
      // 검색·딥링크 같은 명시적 이동 요청만 관측 렌즈 거리로 데려간다.
      this.focusDistAtSelect = LENS_DIST;
      this.flyTo(c.clone(), LENS_DIST, this.flightDur(dNow, LENS_DIST), undefined, undefined,
        cause === "immediate");
      return;
    }
    this.landTarget = null;
    if (cause === "pick") {
      // 카드를 덮는 것도 몸을 옮기지 않는다 — 떠나는 것은 언제나 손이다.
      return;
    }
    // 원경 거리로 돌아가되 **출발 구도**로 돌아간다. 현재 오프셋 방향을 쓰면
    // 착륙 접근각이 그대로 남아 "처음 있던 화면"이 아닌 곳에 내려놓는다.
    this.flyTo(new THREE.Vector3(0, 0, 0), this.skyPose.length(), 1000, this.skyPose.clone().normalize(),
      undefined, cause === "immediate");
  }

  /**
   * 정직한 비행 시간 — 거리**비**의 함수. 접근은 로그 공간에서 보간되므로
   * (advance 참조), 체감 속도가 일정하려면 시간도 비율의 로그를 따라야 한다.
   * 2600→6 이면 ≈3.6초(행성이 자라는 것이 보인다), 2150→1200 이면 ≈0.9초.
   */
  private flightDur(from: number, to: number): number {
    const hi = Math.max(from, to, 6);
    const lo = Math.max(6, Math.min(from, to));
    return Math.min(3800, Math.round(650 + 340 * Math.log2(Math.max(1.01, hi / lo))));
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

  private flyTo(
    target: THREE.Vector3,
    dist: number,
    dur: number,
    approachOverride?: THREE.Vector3,
    upOverride?: THREE.Vector3,
    immediate = false
  ): void {
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
      toUp = this.landUp ?? this.arrivalDir(target.clone().normalize(), SHELF_AXIS_DEG);
    } else if (target.lengthSq() > 1) {
      // 천체를 향할 때는 바깥에서 비스듬히 내려앉는다 — 별들 사이를 통과하는 경로
      // 착륙은 **비스듬히** 내려앉는다. 반경 축을 그대로 타고 내려가면 시선이
      // 지면 법선과 나란해져 표면에 서 있는 것들(제본된 책)을 위에서 내려다보게
      // 되고, 서 있다는 사실 자체가 투영에서 사라진다.
      approach = this.arrivalDir(target.clone().normalize(), dist < 200 ? 52 : 26);
    } else {
      approach = dir.clone().normalize();
    }
    if (approachOverride) approach = approachOverride;
    if (upOverride) toUp = upOverride;
    const toPos = target.clone().addScaledVector(approach, dist);
    if (this.state.reducedMotion || immediate) {
      this.controls.target.copy(target);
      this.camera.position.copy(toPos);
      this.setCameraUp(toUp);
      this.anim = null;
      if (this.state.landedId && this.landTarget) {
        this.foldK = 1;
        this.foldDone = true;
        this.applyFold();
      }
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

  /**
   * 추력 배율 — **가까울수록 느려진다.** 성계는 반경 900 인데 한 노치가 225를
   * 미는 판에서는, 한 번 더 굴리는 것이 별을 스쳐 지나 반대쪽 허공으로 나가는
   * 일이 된다(실측: 보르헤스를 조준하고 밀었더니 camR 3241 에서 멈췄다).
   * 접근 속도가 거리에 비례하면 별 앞에 **설 수** 있다.
   */
  private throttleScale(): number {
    // 지목 항법(R13): 감속은 최근접 별이 아니라 **목표까지의 거리**가 정한다 —
    // 스쳐 지나가는 남의 별마다 브레이크가 걸리던 것이 문 0 의 "원하는 곳으로
    // 가기 어렵다"의 절반이었다. 목표가 없을 때만 최근접 별로 돌아간다.
    const i = this.aimId !== null ? this.index.get(this.aimId) : undefined;
    if (i !== undefined) {
      const d = (this.dirs[i] as THREE.Vector3)
        .clone()
        .multiplyScalar(SHELL_R)
        .distanceTo(this.camera.position);
      return Math.max(0.1, Math.min(1, d / SHELL_R));
    }
    if (!Number.isFinite(this.nearD)) return 1;
    return Math.max(0.1, Math.min(1, this.nearD / SHELL_R));
  }

  /** 입구 자세에서 카메라가 실제로 옮겨 간 거리 — 칸(연도) 단위 */
  private walkedBays(): number {
    const f = this.corridorFrame;
    if (!f || !this.state.landedId) return 0;
    const entry = this.corridorPose(f.span.yStart + 0.8, 0, 0);
    if (!entry) return 0;
    return Number((entry.eye.distanceTo(this.camera.position) / (f.cellArc * f.radius)).toFixed(2));
  }

  /**
   * 여섯 칸 앞 바닥의 화면 좌표. 제자리에서 고개만 돌리면 이 점이 화면을
   * 가로지르고, 걷지 않으면 세계 좌표는 그대로다 — "고개를 돌렸다"를 상태가
   * 아니라 **프레임**에서 읽는 자리.
   */
  private corridorAheadPx(): [number, number] | null {
    const f = this.corridorFrame;
    if (!f || !this.state.landedId) return null;
    const y = Math.min(f.span.yEnd - 0.3, this.walkYear + 6);
    const p = this.corridorLatPoint(corridorTheta(y, f.span, f.cellArc), 0, 0.001);
    const v = p.clone().project(this.camera);
    if (v.z > 1) return null;
    const r = this.renderer.domElement.getBoundingClientRect();
    return [
      Math.round(((v.x + 1) / 2) * r.width),
      Math.round(((-v.y + 1) / 2) * r.height)
    ];
  }

  /** 추력이 향하는 화면 좌표(CSS px, 뷰포트 기준) */
  private aimPoint(): [number, number] {
    const r = this.renderer.domElement.getBoundingClientRect();
    const v = this.camera.position
      .clone()
      .addScaledVector(this.camera.getWorldDirection(new THREE.Vector3()), 1000)
      .project(this.camera);
    return [
      Math.round(((v.x + 1) / 2) * r.width + r.left),
      Math.round(((-v.y + 1) / 2) * r.height + r.top)
    ];
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
  /** 계측·하네스용: 별의 현재 화면 좌표(뷰포트 기준 CSS px). 화면 밖이면 null */
  project(id: string, raw = false): [number, number] | null {
    const r = this.renderer.domElement.getBoundingClientRect();
    const v = this.effectivePos(id, new THREE.Vector3()).project(this.camera);
    if (raw) return [Math.round(v.x * 100) / 100, Math.round(v.y * 100) / 100, Math.round(v.z * 10000) / 10000] as unknown as [number, number];
    if (v.z > 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) return null;
    return [((v.x + 1) / 2) * r.width + r.left, ((-v.y + 1) / 2) * r.height + r.top];
  }

  private pickStar(e: PointerEvent): string | null {
    return this.pickStarXY(e.clientX, e.clientY);
  }

  /** 클라이언트 좌표로 별을 집는다 — 클릭·호버·조준(휠의 커서)이 같은 자를 쓴다. */
  private pickStarXY(cx: number, cy: number, radius = 26): string | null {
    const r = this.renderer.domElement.getBoundingClientRect();
    const px = cx - r.left;
    const py = cy - r.top;
    let best: string | null = null;
    let bestD = radius;
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
    // 새 손은 새 뜻이다(R13) — 잡는 순간 지목 항법이 풀린다. 활공은 마지막
    // 방향 그대로 이어지고(thrustDir 동결), 다음 휠·핀치가 조준을 다시 푼다.
    this.aimId = null;
    this.aimAt = null;
    // 주 포인터가 내려온다는 것은 **다른 포인터가 없다**는 뜻이다(포인터 이벤트
    // 규약). 제스처 사이에 유령 포인터가 남으면 두 손가락이 세 개로 세어지고
    // 핀치가 조용히 죽는다(실측: 손끝 세 번째 제스처부터 추력 0).
    if (e.isPrimary) this.pointers.clear();
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()] as [{ x: number; y: number }, { x: number; y: number }];
      this.pinchPrev = Math.hypot(a.x - b.x, a.y - b.y);
      this.drag = null; // 두 손가락은 고르는 제스처가 아니다
      return;
    }
    this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 };
  };

  /**
   * 손가락에는 호버가 없다. 회랑에서 별을 누르면 곧바로 이륙해 버리므로,
   * 왜 그 별과 이어져 있는지(실 한 가닥 + "왜" 한 문장)를 읽을 기회가
   * 아예 없다 — 마우스가 호버로 얻는 것을 탭 하나가 건너뛴다. 그래서
   * 손가락에서는 **첫 탭이 지목, 같은 별의 두 번째 탭이 출발**이다.
   * 하늘(원경)에서는 그대로 한 번에 연다: 궤도 카드는 닫으면 그만이고,
   * 이륙처럼 되돌리는 데 한 번의 비행이 드는 행동이 아니다.
   */
  private aimFirst(id: string): boolean {
    if (!this.coarse) return false;
    // 지목할 것이 있어야 지목이다. 선택된 별이 없으면 실도 "왜"도 없으므로
    // 한 단계를 더 두는 것은 그냥 느린 것이다 — 원경의 첫 탭은 그대로 연다.
    // 선택이 있으면 **궤도에서도** 이웃 별의 첫 탭은 지목이다(CPO 룰링
    // 2026-08-24: 착륙 가능 작가는 100인 중 3인이라, 착륙 상태에만 걸린
    // 문법은 손끝 사용자의 97%에게 도달하지 않았다).
    const anchor = this.state.landedId ?? this.state.focusId;
    if (!anchor || id === anchor) return false;
    if (!this.state.egoLit.has(id)) return false;
    if (this.state.hoveredId === id) return false;
    this.state.hoveredId = id;
    this.refreshStars();
    this.cb.onHoverAuthor(id);
    return true;
  }

  private onPointerMove = (e: PointerEvent): void => {
    const p = this.pointers.get(e.pointerId);
    if (p) {
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (this.pointers.size >= 2) {
        this.pinch();
        return;
      }
      if (this.drag && this.drag.id === e.pointerId) {
        this.drag.moved += Math.hypot(dx, dy);
        // 고개의 법 하나(R13) — 하늘·궤도·회랑 어디서나 같은 문, 같은 공식,
        // 같은 부호. 회랑만의 특례였던 것이 원칙이 됐다.
        this.look(dx, dy);
      }
      // 끄는 동안은 호버를 다시 세지 않는다. 둘러보는 내내 지나가는 별마다
      // 실이 켜지면 "지목"이 지목이기를 그친다.
      return;
    }
    const s = this.pickStar(e);
    if (s !== this.state.hoveredId) {
      this.state.hoveredId = s;
      this.refreshStars();
      this.cb.onHoverAuthor(s);
    }
    this.renderer.domElement.style.cursor = s || this.pickWork(e) ? "pointer" : "grab";
  };

  /**
   * 고르는 것은 **떼는 순간**이다. 집던 자리에서 곧바로 골라 버리면 별에서
   * 시작한 모든 둘러보기가 선택이 된다 — 자유 비행이 들어온 뒤로는 드래그가
   * 여정의 기본 동작이므로, 누르는 순간의 선택은 오조작의 상시 원천이다.
   */
  private onPointerUp = (e: PointerEvent): void => {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinchPrev = 0;
    const d = this.drag;
    this.drag = null;
    if (!d || d.id !== e.pointerId || d.moved > DRAG_SLOP) return;
    const w = this.pickWork(e);
    if (w) {
      this.cb.onPickWork(w);
      return;
    }
    const s = this.pickStar(e);
    if (!s) return;
    if (this.aimFirst(s)) return;
    this.cb.onPickAuthor(s);
  };

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    // 휠은 커서를 안다(R13) — 추력은 화면 한가운데가 아니라 커서가 가리키는
    // 곳으로 간다. "저기로 가고 싶다"가 조준과 추진 두 동작이 아니라 하나가 된다.
    this.push(-e.deltaY * unit, { x: e.clientX, y: e.clientY });
  };

  private pinch(): void {
    if (this.pointers.size !== 2) return;
    const [a, b] = [...this.pointers.values()] as [{ x: number; y: number }, { x: number; y: number }];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (this.pinchPrev > 0) this.push((d - this.pinchPrev) * 2.6);
    this.pinchPrev = d;
  }

  /**
   * 추력 한 곳 — 휠과 핀치가 같은 문으로 들어온다. `px` 는 "앞으로 민 거리".
   * 붙잡고 있던 것(궤도·당긴 책)이 있으면 먼저 놓는다: 휠이 언제나 추력이라는
   * 규칙이 성립하려면, 묶여 있지 않다는 증거가 같은 제스처 안에 있어야 한다.
   */
  private push(px: number, at?: { x: number; y: number }): void {
    if (!px) return;
    if (this.state.landedId) {
      if (this.anim) return; // 착륙·당김 비행 중에는 손대지 않는다
      if (this.state.selectedWorkId) {
        this.cb.onLeaveOrbit();
        return;
      }
      if (!this.corridorFrame) return;
      this.walkVel = Math.max(-WALK_MAX, Math.min(WALK_MAX, this.walkVel + px * WALK_PER_PX));
      return;
    }
    this.cancelFly();
    // 궤도를 끊는다 — 그러나 읽던 것은 그대로 둔다(멀어지면 그때 닫힌다)
    if (this.state.focusId) this.orbitBroken = true;
    if (px > 0) this.resolveAim(at);
    const k = this.throttleScale();
    const cap = THRUST_MAX * k;
    this.thrust = Math.max(-cap, Math.min(cap, this.thrust + px * THRUST_PER_PX * k));
  }

  /**
   * 조준 해소(R13) — 전진 추력이 향할 곳을 정한다. 우선순위:
   * 커서 아래 별(지목 항법이 된다) > 커서 방향(빈 하늘) > 이미 지목된 별
   * (손끝의 첫 탭) > 시선 정면. 커서의 픽 반경은 클릭(26px)보다 넉넉하다 —
   * 조준은 선택이 아니라 방향이므로, 근처를 가리킨 것으로 충분하다.
   */
  private resolveAim(at?: { x: number; y: number }): void {
    if (at) {
      // 커서가 지목 이후 제자리면 뜻도 제자리다 — 정렬이 하늘을 끌고 가는
      // 동안 커서 밑을 지나가는 남의 별로 갈아타지 않는다.
      if (
        this.aimId !== null &&
        this.aimAt !== null &&
        Math.hypot(at.x - this.aimAt.x, at.y - this.aimAt.y) < 8
      ) {
        return;
      }
      const s = this.pickStarXY(at.x, at.y, 44);
      if (s) {
        this.aimId = s;
        this.aimAt = { x: at.x, y: at.y };
        return;
      }
      // 커서를 **다른** 빈 하늘로 옮겨 굴렸다면 그것은 새 뜻이다 — 지목을
      // 풀고 그 방향으로 간다. (제자리 커서의 락 유지는 위 가드 한 곳뿐이다:
      // 같은 보증을 두 곳에 두면 서로를 가려 변이가 생존한다 — 실측.)
      this.aimId = null;
      this.aimAt = null;
      const r = this.renderer.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((at.x - r.left) / r.width) * 2 - 1,
        -(((at.y - r.top) / r.height) * 2 - 1)
      );
      this.raycaster.setFromCamera(ndc, this.camera);
      this.thrustDir = this.raycaster.ray.direction.clone().normalize();
      return;
    }
    // 커서 없는 손(핀치·키보드): 지목이 있으면 그 별로, 없으면 시선 정면으로.
    if (this.aimId === null) {
      if (this.state.hoveredId !== null) this.aimId = this.state.hoveredId;
      else this.thrustDir = null;
    }
  }

  /** 고개를 돌린다 — 화면 px 을 시야각으로 바꾸는 공식은 어디서나 이것 하나다.
   *  하늘·궤도·회랑이 같은 배율(TURN_GAIN)·같은 부호를 쓴다(R13 고개의 법). */
  private look(dx: number, dy: number): void {
    const h = this.renderer.domElement.clientHeight || 800;
    const perPx = (((this.camera.fov * Math.PI) / 180) / h) * TURN_GAIN;
    this.turn(dx * perPx, dy * perPx);
  }

  /**
   * 고개를 돌린다 — **라디안 한 문**으로. 드래그(픽셀)와 키보드(고정 각)가
   * 여기로 들어온다. 부호는 드래그 규약이다(양수 = 오른쪽/아래로 끄는 것 =
   * 하늘이 그쪽으로 오는 것).
   *
   * 자유 비행에서는 제자리에서 카메라를 돌린다. 피벗은 다음 프레임에 새 시선
   * 앞으로 다시 놓이므로, 드래그가 만드는 "앞의 한 점 주위를 도는" 것과 같은
   * 결과가 된다 — 기제는 여전히 하나(주시점을 앞에 둔다)다.
   */
  private turn(yaw: number, pitch: number): void {
    if (this.walkMode()) {
      const yMax = (LOOK_YAW_MAX * Math.PI) / 180;
      const pMax = (LOOK_PITCH_MAX * Math.PI) / 180;
      this.lookYaw = Math.max(-yMax, Math.min(yMax, this.lookYaw - yaw));
      this.lookPitch = Math.max(-pMax, Math.min(pMax, this.lookPitch + pitch));
      return;
    }
    // 관측선(R13): 고개는 어디서나 돌아간다 — 자유 비행만이 아니라 궤도에
    // 서 있을 때도, 책을 당겨 든 채로도. 연출 비행 중은 예외다(카메라가
    // 안무의 손에 있고, pointerdown 이 이미 비행을 끊는 문이다).
    if (this.anim) return;
    this.camera.rotateOnWorldAxis(this.camera.up, yaw);
    this.camera.rotateX(pitch);
  }

  /**
   * 손이 없는 관측자에게도 카메라를 준다. R12-f 이전에는 이동이 곧 선택이어서
   * 검색과 카드만으로 성계를 다 볼 수 있었지만, 자유 비행이 탐험의 기본 동사가
   * 된 뒤로 **키보드 사용자에게는 그 동사가 아예 없었다** — R12-e 의 일곱 번째
   * 수리("인과 채널을 부를 수단이 캔버스 호버뿐")와 같은 결함이다.
   *
   * 규칙은 하나다: 화살표는 고개, `+`/`-`(와 PageUp/PageDown)는 앞뒤.
   * 하늘에서는 추력이고 회랑에서는 걷기다 — 휠과 같은 문(push)으로 들어간다.
   */
  /**
   * 카메라 키가 **글자를 먹지 않아야 하는 자리** — 여기에 초점이 있으면 손을 뗀다.
   * 검색 콤보박스는 화살표로 후보를 고르고, 연도 슬라이더는 화살표로 값을 옮긴다.
   * 이 목록은 "카메라가 양보하는 곳"이고, 그 밖의 모든 곳에서 카메라는 살아 있다.
   */
  private typingTarget(el: Element | null): boolean {
    if (!el) return false;
    const t = el as HTMLElement;
    if (t.isContentEditable) return true;
    const tag = t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
    const role = t.getAttribute("role");
    return role === "combobox" || role === "listbox" || role === "option" || role === "slider";
  }

  /**
   * 카메라 키는 **문서에서 듣는다.** 캔버스에만 걸려 있던 판에서, 별을 고르거나
   * 착륙하는 순간 접근성 배선이 초점을 카드로 옮기면 화살표와 +/- 가 통째로
   * 죽었다 — 캔버스로 돌아가려면 Tab 아홉 번이었다(적대 심사 실측, 2026-08-28).
   * 그동안 비행 계약이 초록이었던 이유는 계약이 **키 입력 직전마다
   * `canvas.focus()` 를 강제**했기 때문이다: 실제 여정이 남기는 초점 상태를
   * 우회하고 **도달할 수 없는 상태**를 재고 있었다.
   *
   * 카메라는 이 화면의 기본 동사이므로 기본값이 "듣는다"여야 하고, 글자를 받는
   * 자리에서만 양보한다(`typingTarget`).
   */
  private onKeyDown = (e: KeyboardEvent): void => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (this.typingTarget(this.host.ownerDocument.activeElement)) return;
    const step = ((this.camera.fov * Math.PI) / 180) / 6;
    let handled = true;
    switch (e.key) {
      case "ArrowLeft":
        this.turn(step, 0);
        break;
      case "ArrowRight":
        this.turn(-step, 0);
        break;
      case "ArrowUp":
        this.turn(0, step);
        break;
      case "ArrowDown":
        this.turn(0, -step);
        break;
      case "+":
      case "=":
      case "PageUp":
        this.push(150);
        break;
      case "-":
      case "_":
      case "PageDown":
        this.push(-150);
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  };

  /** 회랑을 걷고 있는가 — 착륙했고, 비행도 당김도 없다 */
  private walkMode(): boolean {
    return Boolean(
      this.state.landedId && this.corridorFrame && !this.anim && !this.state.selectedWorkId
    );
  }

  /** 하늘을 자유 비행 중인가 — 궤도에도 지면에도 묶여 있지 않다.
   *  궤도는 **추력이 끊는다**(`orbitBroken`): 고른 것 주위를 도는 것과
   *  그것을 읽는 것은 다른 일이므로, 손이 카메라를 잡았다고 해서 읽던 카드를
   *  뺏지 않는다. 카드는 그 별에서 충분히 멀어질 때 닫힌다. */
  private freeMode(): boolean {
    return !this.state.landedId && !this.anim && (!this.state.focusId || this.orbitBroken);
  }

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
  /**
   * 하네스용 — 진행 중인 모든 운동을 끝까지 보낸다. 카메라 비행만 당기고 한
   * 프레임을 돌리던 이전 판은 **렌즈 램프(프레임 수 기준, 42프레임)와 관성
   * 감쇠를 그대로 두어**, 브라우저 창이 가려져 rAF 가 느려진 날에는 "천체로
   * 분해"·"화살촉이 도착 끝에" 계약이 흔들렸다(실측: 5회 중 3회 실패). 이제
   * 램프 길이만큼 step() 을 동기로 돌린다 — 계약은 프레임 속도가 아니라
   * 상태를 읽는다.
   */
  /**
   * 원경으로 — 자유 비행이 데려간 곳에서 성계 전체가 보이는 자리로 돌아온다.
   * **자유는 돌아올 길과 함께 준다**: 껍질 안으로 들어가 버리면 지도는 사라지고,
   * 다시 만드는 유일한 방법이 새로고침이어서는 안 된다.
   */
  overview(): void {
    this.thrust = 0;
    this.aimId = null;
    this.aimAt = null;
    this.thrustDir = null;
    this.orbitBroken = false;
    this.landTarget = null;
    this.skyPose.set(0, 420, CAM_SKY_DEFAULT);
    this.flyTo(
      new THREE.Vector3(0, 0, 0),
      this.skyPose.length(),
      1100,
      this.skyPose.clone().normalize()
    );
  }

  settle(): void {
    if (this.anim) {
      this.anim.start = performance.now() - this.anim.dur;
      this.advance(performance.now());
    }
    // 관성은 시간의 함수다. settle 안에서 dt 는 0 에 가까우므로, 고정 간격을
    // 넘겨 **운동을 실제로 소진**시킨다 — 그러지 않으면 추력을 넣은 하네스가
    // "아직 안 움직였다"를 읽는다.
    const n = this.state.reducedMotion ? 2 : 48;
    for (let i = 0; i < n; i++) this.step(16);
    // 관성이 남아 있으면 끝까지 보낸다 — 계약은 "휠 뒤 어딘가"가 아니라
    // **활공이 끝난 자리**를 읽어야 재현된다.
    for (let i = 0; i < 240 && (this.thrust || this.walkVel); i++) this.step(16);
    if (this.state.landedId && this.foldK < 1) {
      this.foldK = 1;
      this.foldDone = true;
      this.applyFold();
      this.step();
    }
    // 당김 애니메이션도 상태로 당긴다 — dt 가 0 에 가까운 settle 루프에서는
    // 시간 기반 당김이 영영 끝나지 않는다(실측)
    if (this.corridorFrame) {
      this.updateCorridor(0);
      this.step();
    }
  }

  private advance(now: number): void {
    if (this.anim) {
      const k = Math.min(1, (now - this.anim.start) / this.anim.dur);
      const e = this.easeInOut(k);
      // 주시점은 거리보다 먼저 도착한다. 둘을 같은 속도로 보간하면 비행 중반에
      // 카메라가 껍질 안쪽 빈 공간을 바라보게 되고(실측: 전환 3프레임이 검은
      // 화면), 여정이 "어디로 가는지 모르는 구간"을 갖는다.
      // 이륙 룩백(R12-c): 회랑을 떠나는 비행의 첫 40% 는 시선이 아직 행성에
      // 남는다 — 회랑이 뒤로 작아지는 것이 보여야 "내가 있던 곳"이 남는다.
      const lookDelay = this.corridorDeparting ? 0.4 : 0;
      const te = this.easeInOut(Math.max(0, Math.min(1, (k - lookDelay) / (0.45 * (1 - lookDelay) + (1 - 0.45) * 0))) );
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
      // 관측선(R13): 시선은 여기서 직접 준다 — OrbitControls.update() 가 하던
      // lookAt 은 컨트롤 은퇴와 함께 이 줄로 왔다. 주시점 선행 보간(te)이
      // "어디로 가는지 아는 비행"을 만드는 자리이므로, 시선의 원본도 같은 값.
      this.camera.lookAt(tgt);
      // 접힘은 착륙 비행의 마지막 45% 가 만든다 — 검은 빈 구간이던 자리다.
      // 지각의 연도 격자가 경첩을 축으로 일어서고, 드래그 취소는 비행 취소가
      // 접힘도 되돌린다(같은 k 를 공유하므로).
      if (this.state.landedId && this.landTarget && !this.foldDone) {
        const fk = Math.max(0, Math.min(1, (k - 0.55) / 0.45));
        this.foldK = fk * fk * (3 - 2 * fk);
        this.applyFold();
        if (this.foldK >= 1) this.foldDone = true;
      }
      if (k >= 1) this.anim = null;
    }
  }

  private loop = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    this.advance(performance.now());
    if (!this.state.focusId && !this.state.landedId && !this.anim)
      this.skyPose.copy(this.camera.position);
    this.step();
  };

  private lastStep = 0;

  /**
   * 카메라를 손에 넘기는 한 곳. 세 모드가 여기서 갈린다:
   *  · 회랑 — **걷는다.** 자세는 walkYear/lookYaw/lookPitch 가 전부 결정한다.
   *  · 하늘(자유) — 피벗을 시선 앞에 둔다. 드래그 = 고개 돌리기, 추력 = 전진.
   *  · 궤도·비행 — 예전 그대로 대상 주위를 돈다.
   *
   * 자유 비행에서 컨트롤을 버리지 않는 이유: 표현 사다리가 이미 거리의
   * 함수이므로, 필요한 것은 새 리그가 아니라 **주시점을 앞에 두는 한 줄**이다.
   */
  private moveCamera(dt: number): void {
    const sec = dt / 1000;
    // 운동 신호는 **손이 카메라를 잡고 있는 동안**만이다. 연출된 비행(착륙·궤도
    // 진입)까지 여기 넣으면, 관계 행을 눌러 옮겨 갈 때마다 시트가 접혔다 펴지며
    // 깜박인다 — 목적지가 그 카드인 이동에서 카드를 치우는 것은 손해다.
    let moving = false;
    const walking = this.walkMode();
    // 회랑에서 컨트롤을 재우는 줄이 여기 있었다("깨어 있으면 드래그가 회전량을
    // 쌓아 두었다가 당김 리프레임에서 터진다"). **변이 스윕이 그 주장을
    // 반증했다** — 지워도 어떤 계약도 죽지 않았고, 직접 재 보니 걷는 동안
    // 쌓인 델타는 `update()` 를 건너뛰는 프레임마다 감쇠로 흩어져 당김 자세를
    // 흔들지 못했다. 측정되지 않는 방어는 코드가 아니라 미신이므로 걷어낸다.
    if (walking) {
      const f = this.corridorFrame as NonNullable<typeof this.corridorFrame>;
      if (this.walkVel) {
        if (this.state.reducedMotion) {
          this.walkYear += this.walkVel / -Math.log(WALK_DAMP);
          this.walkVel = 0;
        } else {
          this.walkYear += this.walkVel * sec;
          this.walkVel *= Math.pow(WALK_DAMP, sec);
          if (Math.abs(this.walkVel) < 0.02) this.walkVel = 0;
        }
        moving = true;
      }
      const lo = f.span.yStart + 0.3;
      const hi = f.span.yEnd - 0.3;
      if (this.walkYear <= lo || this.walkYear >= hi) this.walkVel = 0;
      this.walkYear = Math.max(lo, Math.min(hi, this.walkYear));
      const p = this.corridorPose(this.walkYear, this.lookYaw, this.lookPitch);
      if (p) {
        this.camera.position.copy(p.eye);
        this.controls.target.copy(p.look);
        this.setCameraUp(p.up);
        this.camera.lookAt(p.look);
      }
    } else if (this.freeMode()) {
      // 관측선(R13): 추력은 시선 정면이 아니라 **뜻한 곳**으로 간다. 지목한
      // 별이 있으면 매 프레임 그 별로 재조준하고(호밍 — 별은 서 있지만 배는
      // 움직이므로), 기수가 목표 쪽으로 서서히 정렬된다: 손을 대지 않아도
      // 목표가 화면 중앙으로 걸어 들어온다. 낚아채지 않고 데려간다.
      const fwd = this.camera.getWorldDirection(new THREE.Vector3());
      const aimStar = this.aimId !== null ? this.index.get(this.aimId) : undefined;
      if (aimStar !== undefined) {
        const center = (this.dirs[aimStar] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
        const to = center.sub(this.camera.position);
        const d = to.length();
        // 별 앞에 선다 — 스쳐 지나가는 것은 도착이 아니다. STANDOFF 안쪽에서
        // 전진 추력은 소진되고 지목이 풀린다(후진은 언제나 자유).
        if (d <= ARRIVE_STANDOFF && this.thrust > 0) {
          this.thrust = 0;
          this.aimId = null;
          this.aimAt = null;
          this.thrustDir = null;
        } else {
          this.thrustDir = to.normalize();
          if (this.thrust > 0 && !this.state.reducedMotion) {
            const ang = fwd.angleTo(this.thrustDir);
            if (ang > 1e-4) {
              const step = Math.min(1, (ALIGN_RATE * sec) / ang);
              const newFwd = fwd.clone().lerp(this.thrustDir, step).normalize();
              this.camera.lookAt(this.camera.position.clone().add(newFwd));
            }
          }
        }
      }
      if (this.thrust) {
        const dir = this.thrustDir ?? fwd;
        if (this.state.reducedMotion) {
          this.camera.position.addScaledVector(dir, this.thrust / -Math.log(THRUST_DAMP));
          this.thrust = 0;
        } else {
          this.camera.position.addScaledVector(dir, this.thrust * sec);
          this.thrust *= Math.pow(THRUST_DAMP, sec);
          if (Math.abs(this.thrust) < 1) this.thrust = 0;
        }
        moving = true;
      }
      // 주시점 북키핑 — 시선 앞 150(R12-f). 회전은 turn() 이 제자리에서 하므로
      // 이 값은 조향이 아니라 계측(pivot)과 연출 비행의 출발점이다.
      const fwd2 = this.camera.getWorldDirection(new THREE.Vector3());
      this.controls.target.copy(this.camera.position).addScaledVector(fwd2, FREE_PIVOT);
      // 성계를 벗어나지도, 항성을 관통하지도 않는다. **자리를 잡는 곳은 여기
      // 한 곳이다** — 두 곳에서 잡으면 어느 한쪽을 지워도 계약이 초록으로
      // 남는다(변이 스윕 실측, 2026-08-25: 생존 2건이 이 그림자였다).
      const r = this.camera.position.length();
      if (r > CAM_SKY_MAX || r < FREE_R_MIN) {
        this.camera.position.setLength(Math.max(FREE_R_MIN, Math.min(CAM_SKY_MAX, r)));
        this.thrust = 0;
      }
    } else {
      // 궤도·당김·비행 대기: 배는 서 있다. 고개(turn)는 어디서나 돌아가고,
      // 카메라를 움직이는 것은 연출 비행(advance)뿐이다. OrbitControls 의
      // "붙잡고 돌린다"는 문 0 판정으로 은퇴했다 — 같은 드래그는 어디서나
      // 같은 방향으로 하늘을 옮긴다.
      this.thrust = 0;
    }
    if (moving !== this.moving) {
      this.moving = moving;
      this.cb.onMotion(moving);
    }
  }

  private step(dtOverride?: number): void {
    const nowMs = performance.now();
    const dt = dtOverride ?? (this.lastStep ? Math.min(64, nowMs - this.lastStep) : 16);
    this.lastStep = nowMs;
    // 이륙이 끝나면 회랑을 걷는다(비행 중에는 서 있다)
    if (this.corridorDeparting && !this.anim) {
      this.corridorDeparting = false;
      this.foldK = 0;
      this.clearCities();
      this.corridorFrame = null;
      this.applySurfaceSky();
    }
    if (this.state.landedId && this.corridorFrame) this.updateCorridor(dt);
    // 최소 거리는 update() 보다 먼저 정한다 — 순서가 뒤바뀌면 착륙 프레임에서
    // 직전 프레임의 하한(40)이 카메라를 그 자리에 못박는다(실측 버그).
    this.controls.minDistance = this.state.landedId
      ? this.corridorFrame
        ? this.corridorFrame.bh * 0.5
        : (this.radii[this.index.get(this.state.landedId) ?? 0] ?? 2) * 1.35
      : 20;
    this.moveCamera(dt);

    const h = this.renderer.domElement.clientHeight || 800;
    const dist = this.camera.position.distanceTo(this.controls.target);
    const camR = this.camera.position.length();

    // 별 ↔ 천체: 겉보기 크기가 결정한다
    let resolved = 0;
    let surfaceId: string | null = null;
    // 가장 가까운 별과 그 거리 — 자유 비행의 "나는 지금 어디인가". 미준비
    // 작가는 영영 천체로 분해되지 않으므로(항성으로 남는다) 도착을 말할 수
    // 있는 값은 이것뿐이다.
    let nearId: string | null = null;
    let nearD = Infinity;
    // 분해된 천체 중 가장 가까운 것 — 자산 사전 로드의 방아쇠
    let bodyNearId: string | null = null;
    let bodyNearD = Infinity;
    const alpha = this.starGeo.getAttribute("aAlpha") as THREE.BufferAttribute;
    const pxAttr = this.starGeo.getAttribute("aPx") as THREE.BufferAttribute;
    for (let i = 0; i < this.order.length; i++) {
      const id = this.order[i] as string;
      const center = (this.dirs[i] as THREE.Vector3).clone().multiplyScalar(SHELL_R);
      const d = center.distanceTo(this.camera.position);
      if (d < nearD) {
        nearD = d;
        nearId = id;
      }

      // 배율에는 준비도 조건을 두지 않는다. 준비도 게이트는 바로 아래 표현
      // 사다리 한 곳에만 있다 — 같은 규칙을 두 곳에 두면 **서로를 가려**
      // 한쪽을 지워도 계약이 초록으로 남는다(변이 스윕 실측, 2026-08-20).
      const scaled =
        (this.radii[i] ?? 12) *
        (id === this.state.focusId && !this.state.landedId
          ? 1 + (LENS_MAG - 1) * this.lensK
          : 1);
      const ap = apparentRadiusPx(scaled, d, this.camera.fov, h);
      // 별에도 크기가 있다 (R12-g) — 화면 지름은 광휘와 실제 원반 중 큰 쪽이다.
      // 이 한 줄이 준비도와 무관한 이유: 크기는 내용에 대한 주장이 아니라
      // **그 자리에 얼마나 있는가**이고, 준비되지 않은 작가도 거기 있다.
      pxAttr.setX(i, starDiameterPx(this.baseGlare[i] ?? 0, ap));
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
          // 문턱은 없앴다(R12-f). 자유 비행은 **누르지 않고** 별에 다가가므로,
          // 분해되는 첫 순간이 곧 그 천체의 첫인상이다 — 60px 을 기다리면 그
          // 첫인상이 무늬 없는 공이고, 그것은 미준비 작가에게 착륙을 금지한
          // 바로 그 화면이다(실측: 조준해서 밀어 분해시킨 카프카가 민무늬 구슬).
          // paintCrust 는 멱등이고 착륙 가능 작가는 셋뿐이라 값이 싸다.
          this.paintCrust(body);
          if (d < bodyNearD) {
            bodyNearD = d;
            bodyNearId = id;
          }
          if (rep === "surface") surfaceId = id;
        }
        // 구가 보이면 별 스프라이트는 물러난다 — 같은 객체가 두 번 그려지지 않게
        // 크로스페이드 창을 임계의 2배로 — 7px 창은 착륙 비행의 속도에 뭉개져
        // "없던 행성이 갑자기 툭"(문 0 2차)으로 읽혔다. 천체는 나타나는 것이
        // 아니라 별이 천천히 몸을 얻는 것이어야 한다.
        const fade = Math.max(0, 1 - (ap - STAR_TO_DISC_PX) / (STAR_TO_DISC_PX * 2));
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
    pxAttr.needsUpdate = true;
    alpha.needsUpdate = true;

    // 단계의 두 번째 절은 원래 "고른 것에 렌즈 거리만큼 가까운가"였고, 그것을
    // `controls.target` 까지의 거리로 재고 있었다. 자유 비행은 그 주시점을 늘
    // 시선 앞 150 에 두므로 같은 식이 상수가 된다 — **고른 별까지의 거리**로
    // 직접 잰다(궤도 아카이브는 분해되지 않으므로 이 절이 유일한 근거다).
    const focusIdx = this.state.focusId ? this.index.get(this.state.focusId) : undefined;
    const focusDist =
      focusIdx === undefined
        ? Infinity
        : (this.dirs[focusIdx] as THREE.Vector3)
            .clone()
            .multiplyScalar(SHELL_R)
            .distanceTo(this.camera.position);
    this.nearD = nearD;
    // 궤도를 끊고 **떠나면** 읽던 것도 닫힌다 — 렌즈 거리의 두 배가 "떠났다"의 자
    // 1.6배 = 렌즈 거리 1200 에서 1920. 2배(2400)는 **닿지 않는다** — 카메라가
    // 성계 밖 한계(3200)에 걸려 실측 최대가 2372 였다(계약이 잡았다).
    // 떠남의 기준은 **고른 자리**다(R13-c) — 멀리서 고른 카드가 첫 휠에 닫히면
    // 고르기가 곧 상실이 된다. 고른 거리의 1.35배 또는 렌즈 거리의 1.6배 중
    // 큰 쪽을 넘어야 떠난 것이다.
    if (
      this.orbitBroken &&
      this.state.focusId &&
      focusDist > Math.max(LENS_DIST * 1.6, this.focusDistAtSelect * 1.35)
    )
      this.cb.onLeaveOrbit();
    // 성계 전체가 보이던 자리에서 얼마나 들어왔는가 — 돌아올 길의 조건
    const deep = this.freeMode() && camR < CAM_SKY_DEFAULT * 0.82;
    if (deep !== this.lastDeep) {
      this.lastDeep = deep;
      this.cb.onDeep(deep);
    }
    const near = this.state.landedId ?? bodyNearId;
    if (near !== this.lastNearBody) {
      this.lastNearBody = near;
      this.cb.onNear(near);
    }
    // 접근의 사다리(R13-b) — 대상은 뜻(지목)이 우선이고, 뜻이 없으면 이름
    // 거리 안에 든 최근접 별이다. 거리는 10 단위 버킷으로만 통지한다: 매
    // 프레임 콜백은 React 를 상대로 한 소음이고, 사다리의 단은 10 보다 성기다.
    let apprId: string | null = null;
    let apprD = 0;
    if (!this.state.landedId) {
      const ai = this.aimId !== null ? this.index.get(this.aimId) : undefined;
      if (ai !== undefined) {
        apprId = this.aimId;
        apprD = (this.dirs[ai] as THREE.Vector3)
          .clone()
          .multiplyScalar(SHELL_R)
          .distanceTo(this.camera.position);
      } else if (nearId !== null && nearD < NAME_NEAR) {
        apprId = nearId;
        apprD = nearD;
      }
    }
    const apprBucket = apprId === null ? -1 : Math.round(apprD / 10);
    if (apprId !== this.lastApproachId || apprBucket !== this.lastApproachBucket) {
      this.lastApproachId = apprId;
      this.lastApproachBucket = apprBucket;
      this.cb.onApproach(apprId, Math.round(apprD));
    }
    const stage: Stage = surfaceId ? "surface" : resolved > 0 || focusDist < 1250 ? "approach" : "sky";
    if (stage !== this.stage) {
      this.stage = stage;
      this.cb.onStageChange(stage);
    }

    // 독서등 — 착륙할수록 세진다
    const prox = stage === "surface" ? 1 : stage === "approach" ? 0.28 : 0;
    // 관측자의 독서등: 원경에서는 꺼져 있고(태양의 초승달만 보인다),
    // 착륙하면 표면을 읽을 만큼 밝아진다.
    // 회랑의 빛 위계(그래픽 리뷰 2026-08-25): 균일광 두 개가 전 표면을 같은
    // 밝기로 채우면 "종이-금속-어둠"의 3단 명도가 "고른 세피아"로 뭉갠다.
    // 착륙 중에는 램프·환경광을 낮추고 깊이 안개를 켠다 — 어둠이 값을 되찾는다.
    const inCorridor = Boolean(this.state.landedId && this.corridorFrame);
    this.readLamp.intensity = inCorridor ? 1.05 : 1.35 + prox * 1.15;
    this.ambient.intensity = inCorridor ? 0.45 : 1.0;
    if (inCorridor) {
      const f = this.corridorFrame!;
      if (!this.surfaceFog) this.surfaceFog = new THREE.Fog(new THREE.Color(COLORS.bg), f.bh * 4, f.radius * 1.15);
      this.scene.fog = this.surfaceFog;
    } else if (this.scene.fog) {
      this.scene.fog = null;
    }
    this.readLamp.position.copy(this.camera.position);
    // 좌표 격자는 천구의 것이다 — 관측자가 껍질에서 얼마나 떨어졌는가로 옅어진다
    // (주시점까지의 거리로 재던 이전 판은 자유 비행에서 상수가 된다).
    (this.graticule.material as THREE.LineBasicMaterial).opacity =
      0.5 * Math.max(0, Math.min(1, (camR - SHELL_R) / 900));
    this.sunGlow.visible = stage !== "surface";
    (this.constellation.material as THREE.LineBasicMaterial).opacity =
      stage === "surface" ? 0.25 : this.state.focusId ? 0.4 : 0.9;
    // 표면에서 실을 죽이던 0.3 은 "관계선 퇴장" 시대의 값이다 — 회랑의 실은
    // 지목의 보상이므로 오히려 또렷해야 한다.
    (this.egoLines.material as THREE.LineBasicMaterial).opacity = stage === "surface" ? 0.92 : 0.72;
    (this.egoArrows.material as THREE.MeshBasicMaterial).opacity = stage === "surface" ? 0.95 : 0.85;
    if (
      this.egoDirected.length &&
      (this.arrowsDirty ||
        !this.arrowCam.equals(this.camera.position) ||
        !this.arrowQuat.equals(this.camera.quaternion))
    )
      this.refreshArrows();

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
      const markR = asStar ? starDiameterPx(this.baseGlare[selIdx] ?? 0, ap) / 2 : ap;
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
    // ——— 성계 방향 (R12-f) ———
    // 자유 비행은 등을 돌릴 자유까지 준다: 껍질 밖에서 바깥을 보면 프레임이
    // **완전히 빈다**(실측 — 휠 30번이면 검은 화면 하나가 남는다). 카메라를
    // 대신 돌리지 않는다. 세계가 어느 쪽인지만 말하고, 돌리는 것은 손이다.
    let onScreen = 0;
    if (!this.state.landedId) {
      const v = new THREE.Vector3();
      for (let i = 0; i < this.order.length && onScreen === 0; i++) {
        v.copy(this.dirs[i] as THREE.Vector3).multiplyScalar(SHELL_R).project(this.camera);
        if (v.z <= 1 && Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1) onScreen++;
      }
    }
    this.lastOnScreen = onScreen;
    if (onScreen || this.state.landedId) {
      this.homeMark.visible = false;
      this.homeLabel.visible = false;
    } else {
      const o = new THREE.Vector3(0, 0, 0).project(this.camera);
      let nx = o.x;
      let ny = o.y;
      if (o.z > 1) {
        // 성계가 등 뒤에 있으면 투영은 반대편으로 나온다 — 뒤집어 읽는다
        nx = -nx;
        ny = -ny;
      }
      const len = Math.hypot(nx, ny) || 1;
      nx /= len;
      ny /= len;
      const vw2 = this.renderer.domElement.clientWidth || 1600;
      const camRight = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
      const camUp2 = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1);
      const fwd2 = this.camera.getWorldDirection(new THREE.Vector3());
      const D = 60;
      const wpp = (2 * Math.tan((this.camera.fov * Math.PI) / 360) * D) / h;
      const rad = Math.min(vw2, h) * 0.4;
      this.homeMark.position
        .copy(this.camera.position)
        .addScaledVector(fwd2, D)
        .addScaledVector(camRight, nx * rad * wpp)
        .addScaledVector(camUp2, ny * rad * wpp);
      this.homeMark.scale.setScalar(wpp * 46);
      // 텍스처의 꼭짓점은 국소 -x 를 향한다 — 그것이 (nx, ny) 를 가리키게 돌린다
      (this.homeMark.material as THREE.SpriteMaterial).rotation = Math.atan2(-ny, -nx);
      this.homeMark.visible = true;
      this.homeLabel.position
        .copy(this.homeMark.position)
        .addScaledVector(camRight, -nx * 46 * wpp)
        .addScaledVector(camUp2, -ny * 46 * wpp);
      this.homeLabel.scale.set(wpp * 104, wpp * 26, 1);
      this.homeLabel.visible = true;
    }
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
      crust: (landedRec?.mesh.userData.crust as string | undefined) ?? null,
      cam: [
        Math.round(this.camera.position.x),
        Math.round(this.camera.position.y),
        Math.round(this.camera.position.z)
      ] as [number, number, number],
      // 착륙한 천체에 닿는 선이 **실제로 그려졌는가** — 건너뛰는 코드를 되읽지
      // 않고 버퍼에 들어간 선의 양 끝을 센다
      linesTouchingLanded: this.state.landedId
        ? this.drawnLineEnds.filter(([a, b]) => a === this.state.landedId || b === this.state.landedId).length
        : 0,
      // 크롬이 차지한다고 **선언된** 띠와 실제로 받은 사각형 수. 리사이즈에
      // 따라왔는지를 라벨의 부수 효과로 추론하지 않고 직접 읽는다.
      insets: [this.safeLeft, this.safeRight, this.safeTop, this.safeBottom] as [
        number,
        number,
        number,
        number
      ],
      chromeRects: this.chromeRects.length,
      // ——— 카메라 주권 (R12-f) ———
      /** 원점(항성)으로부터의 거리 — 자유 비행에서 `dist` 는 피벗까지의 상수다 */
      camR: Math.round(camR),
      /** 카메라가 스스로 움직이는 중인가(추력·걷기·비행) */
      moving: this.moving,
      // 피벗은 **의도가 아니라 결과**로 잰다. `freeMode() ? FREE_PIVOT : 0` 이라고
      // 쓰면 주시점을 앞에 놓는 줄을 지워도 이 값이 150 으로 남는다 — 계측이
      // 기제를 가리는 자리다(R12-e 에서 값을 치른 형태).
      pivot: this.freeMode() ? Math.round(dist) : 0,
      /** 회랑에서 서 있는 해 — 걸으면 바뀐다 */
      walkYear: this.state.landedId && this.corridorFrame ? Number(this.walkYear.toFixed(2)) : null,
      /** 입구에서 **실제로** 걸어 나온 거리(칸 단위). walkYear 는 상태이고 이것은
       *  카메라다 — 자세가 그 상태를 읽지 않으면 여기서 드러난다. */
      walked: this.walkedBays(),
      /** 여섯 칸 앞 바닥의 화면 좌표 — 고개를 돌리면 프레임을 가로지른다 */
      aheadPx: this.corridorAheadPx(),
      /** 고개 각도(도) — 회랑에서만 */
      look: [
        Math.round((this.lookYaw * 180) / Math.PI),
        Math.round((this.lookPitch * 180) / Math.PI)
      ] as [number, number],
      /** 프레임 안에 자리를 가진 별이 하나라도 있는가 (0 이면 성계 표식이 뜬다) */
      onScreenStars: this.lastOnScreen,
      homeMark: this.homeMark.visible,
      /** 항성(정본 코퍼스)의 화면 좌표 — 성계의 원점이자 유일한 광원 */
      sunPx: (() => {
        const v = new THREE.Vector3(0, 0, 0).project(this.camera);
        if (v.z > 1 || Math.abs(v.x) > 1 || Math.abs(v.y) > 1) return null;
        const rect = this.renderer.domElement.getBoundingClientRect();
        return [
          Math.round(((v.x + 1) / 2) * rect.width + rect.left),
          Math.round(((-v.y + 1) / 2) * rect.height + rect.top)
        ] as [number, number];
      })(),
      /** 추력이 향하는 화면 좌표. 안전 띠가 프레임을 밀므로 기하학적 중심과
       *  다르다 — 하네스는 "가운데"가 아니라 **여기**로 별을 조준한다. */
      aim: this.aimPoint(),
      aimLock: this.aimId,
      approach: [this.lastApproachId, this.lastApproachBucket * 10] as [string | null, number],
      /** 가장 가까운 별과 그 거리 */
      nearest: [nearId, Math.round(nearD)] as [string | null, number],
      nearPx:
        nearId === null || this.index.get(nearId) === undefined
          ? 0
          : Math.round(pxAttr.getX(this.index.get(nearId) as number)),
      /** 다른 이유 없이 가깝다는 것만으로 이름을 받은 별 수 */
      nearNamed: this.lastNearNamed,
      /** 지각이 실제로 칠해진 천체 수 — 자유 비행의 도착이 무늬 없는 공이
       *  아니라는 증거. 착륙 상태가 아니어도 센다. */
      crustPainted: [...this.bodies.values()].filter((b) => b.textured).length,
      /** 원경에서 충분히 들어왔는가 — 돌아올 길이 떠 있어야 하는 상태 */
      deep: this.lastDeep,
      /** 고른 별까지의 거리 — 단계 판정의 두 번째 절이자 "떠났다"의 자 */
      focusDist: Number.isFinite(focusDist) ? Math.round(focusDist) : null,
      /** 이번 프레임의 추력 배율 — 가까울수록 느려진다 */
      throttle: Number(this.throttleScale().toFixed(2)),
      /** 회랑을 걸을 수 있는 상태인가 — 비행도 당김도 없다 */
      walking: this.walkMode(),
      /** 진행 중인 연출 비행이 있는가 */
      flying: Boolean(this.anim),
      ...this.arrowMetrics(),
      ...this.corridorMetrics(),
      occludedLabels: this.lastOccludedLabels,
      labelsOverFocus: this.labelsOverFocus()
    };
  }

  /** 회랑 계측 — 접힘·칸·당김·사망선·명판·실의 앵커(화면 좌표)·방향 정렬 */
  private corridorMetrics(): {
    foldK: number;
    bays: number;
    pulled: string | null;
    deathLine: boolean;
    plate: boolean;
    threadEnd: [number, number] | null;
    /** 연보 명패 수 — 관계 앵커 연도 사건 + 발표 연도 밖 판본 사건 (캡 적용 후) */
    eventSlips: number;
    /** 한 칸에 선 명패의 최댓값 — R13-c 캡(둘 + 접힘)이면 3 을 넘지 않는다 */
    slipMaxPerYear: number;
    /** "외 N건" 접힘 명패 수 */
    slipFolded: number;
    /** 회랑 자세의 서가 거리(책 높이 배) — corridorPose 가 마지막으로 계산한 값 */
    standLat: number;
    /** 쉬는 권 중 책등 축이 입구를 향한 수 — 카메라가 아니라 회랑 접선과 잰다 */
    restingSpineToEntrance: number;
    resting: number;
    /** 당겨진 권의 표지 축이 통로 법선을 향하는가 */
    pulledCoverToWalkway: boolean;
    /** 입문 단(row 0)이 위 단보다 낮게 서는가 — 국소 y 로 잰다 */
    entryRowBelow: boolean;
    /** 권별 책등 축·접선 내적 — 계약 디버그용(어느 권이 틀어졌는지) */
    restingDots: Record<string, number>;
    /** 입구를 향한 그 면에 실제 책등 재질이 붙은 쉬는 권 수 */
    restingSpineDressed: number;
    /** 크롬이 덮지 않는 띠 안에 실제로 들어온 칸 수 — 세로 화면에서 회랑이
     *  프레임 밖으로 밀려나면 "단계=표면"은 초록인데 화면은 빈 지면이다. */
    baysInFrame: number;
  } {
    let death = false;
    let plate = false;
    for (const o of this.cityChrome) {
      o.traverse((x) => {
        if (x.userData.deathLine) death = true;
        if (x.userData.plate) plate = true;
      });
    }
    let pulled: string | null = null;
    for (const [wid, k] of this.pullK) if (k > 0.95) pulled = wid;
    let te: [number, number] | null = null;
    if (this.threadEnd) {
      const v = this.threadEnd.clone().project(this.camera);
      if (v.z <= 1) {
        const w = this.renderer.domElement.clientWidth;
        const h = this.renderer.domElement.clientHeight;
        te = [Math.round(((v.x + 1) / 2) * w), Math.round(((-v.y + 1) / 2) * h)];
      }
    }
    // 칸이 **보이는 띠 안에** 몇 개나 들어와 있는가. 화면 좌표로 재므로
    // 세로/가로, 시트 높이, 카메라 자세가 전부 반영된다.
    let baysInFrame = 0;
    {
      const w = this.renderer.domElement.clientWidth;
      const h = this.renderer.domElement.clientHeight;
      const q = new THREE.Vector3();
      const bh = this.corridorFrame?.bh ?? 0;
      // 칸은 점이 아니라 **선반**이다. 바닥 원점만 재면 서가가 화면을 가득
      // 채우고 있어도 0 이 나온다(세로 화면 실측: 원점은 전부 시트 아래).
      // 바닥과 머리 두 점을 재서 둘 중 하나라도 띠에 들어오면 든 것으로 센다.
      const scr = (v: THREE.Vector3): [number, number] | null => {
        v.project(this.camera);
        if (v.z > 1) return null;
        return [((v.x + 1) / 2) * w, ((-v.y + 1) / 2) * h];
      };
      const top = this.safeTop;
      const bot = h - this.safeBottom;
      for (const g of this.corridorStand) {
        const a = scr(g.getWorldPosition(q));
        const c = scr(g.localToWorld(new THREE.Vector3(0, bh, 0)));
        if (!a || !c) continue;
        // 칸이 띠를 **가로지르기만 해도** 보이는 것이다: 가까운 칸은 밑동이
        // 시트 아래, 머리가 띠 안에 있고, 아주 가까운 칸은 띠를 통째로
        // 관통한다. 두 끝점만 검사하면 그 둘을 놓친다.
        if (Math.max(a[0], c[0]) < 0 || Math.min(a[0], c[0]) > w) continue;
        if (Math.max(a[1], c[1]) < top || Math.min(a[1], c[1]) > bot) continue;
        baysInFrame++;
      }
    }
    let restingAligned = 0;
    let restingDressed = 0;
    let resting = 0;
    let pulledCover = false;
    const restingDots: Record<string, number> = {};
    const ax = new THREE.Vector3();
    const kindAt = (mesh: THREE.Mesh, slot: number): string => {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const one = mats[slot] as THREE.MeshStandardMaterial | undefined;
      return (one?.map?.userData?.kind as string | undefined) ?? "";
    };
    for (const c of this.cityRecords) {
      const m4 = c.book.matrixWorld;
      if (c.workId === pulled) {
        // 표지 축 = 책의 +Z (BoxGeometry 재질 순서와 같은 규약)
        ax.set(m4.elements[8] as number, m4.elements[9] as number, m4.elements[10] as number).normalize();
        pulledCover = Boolean(c.normal && ax.dot(c.normal) > 0.7);
        continue;
      }
      resting++;
      ax.set(m4.elements[0] as number, m4.elements[1] as number, m4.elements[2] as number).normalize();
      const dot = c.tangent ? ax.dot(c.tangent) : 0;
      restingDots[c.workId] = Number(dot.toFixed(3));
      if (dot < -0.85) restingAligned++;
      // 축이 맞아도 그 면에 붙은 것이 책등 재질이 아니면 책등이 아니다 —
      // 재질 배열이 뒤바뀐 변이가 축 계약만으로는 초록이었다(스윕 실측).
      if (kindAt(c.spine, 0) === "spine") restingDressed++;
    }
    const rows0 = this.cityRecords.filter((c) => c.row === 0).map((c) => c.obj.position.y);
    const rows1 = this.cityRecords.filter((c) => c.row === 1).map((c) => c.obj.position.y);
    const avg = (xs: number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
    return {
      foldK: Number(this.foldK.toFixed(3)),
      bays: this.corridorStand.length,
      pulled,
      deathLine: death,
      plate,
      threadEnd: te,
      eventSlips: this.eventSlips.length,
      slipMaxPerYear: (() => {
        const c = new Map<number, number>();
        for (const e of this.eventSlips) c.set(e.year, (c.get(e.year) ?? 0) + 1);
        return c.size ? Math.max(...c.values()) : 0;
      })(),
      slipFolded: this.eventSlips.filter((e) => e.folded).length,
      standLat: Math.round(this.poseLat * 100) / 100,
      restingSpineToEntrance: restingAligned,
      restingSpineDressed: restingDressed,
      baysInFrame,
      resting,
      pulledCoverToWalkway: pulledCover,
      entryRowBelow: rows1.length === 0 || avg(rows0) < avg(rows1),
      restingDots
    };
  }

  /**
   * 초점 원반 **안에** 앵커가 놓인 타인 이름표 수(DOM 에서 읽는다). 가림 가드가
   * 제대로면 0 이다 — 가드 코드가 아니라 화면에 남은 라벨을 센다.
   */
  /** 초점 원반의 화면 투영 — 계약과 라벨 가드가 같은 값을 쓴다 */
  private focusDiscPx(): { cx: number; cy: number; r: number } | null {
    const s = this.state;
    const fid = s.focusId;
    if (!fid || s.landedId || this.stage === "surface") return null;
    const body = this.bodies.get(fid);
    if (!body || !body.mesh.visible) return null;
    const w = this.renderer.domElement.clientWidth;
    const h = this.renderer.domElement.clientHeight;
    const c = body.center.clone().project(this.camera);
    const rWorld = body.radius * (isLandable(fid) ? 1 + (LENS_MAG - 1) * this.lensK : 1);
    return {
      cx: ((c.x + 1) / 2) * w,
      cy: ((-c.y + 1) / 2) * h,
      r: apparentRadiusPx(rWorld, body.center.distanceTo(this.camera.position), this.camera.fov, h)
    };
  }

  /**
   * 초점 원반 위에 **글자가 걸친** 타인 이름표 수(DOM 에서 읽는다). 앵커만 보면
   * 원반 가장자리 바로 밖의 앵커에서 글자가 원반 위로 넘어간다(실측: 소세키
   * 원반 우측 '프란츠 카프카 ①'). 라벨의 실제 사각형과 원을 겹쳐 본다.
   */
  private labelsOverFocus(): number {
    const d = this.focusDiscPx();
    if (!d) return 0;
    const fid = this.state.focusId;
    const hostRect = this.host.getBoundingClientRect();
    let n = 0;
    for (const el of this.host.querySelectorAll<HTMLElement>(".globe-label--author")) {
      if (el.style.display === "none" || el.dataset.labelId === fid) continue;
      const r = el.getBoundingClientRect();
      const x0 = r.left - hostRect.left;
      const x1 = r.right - hostRect.left;
      const y0 = r.top - hostRect.top;
      const y1 = r.bottom - hostRect.top;
      // 사각형과 원의 최근접점 거리
      const px = Math.max(x0, Math.min(d.cx, x1));
      const py = Math.max(y0, Math.min(d.cy, y1));
      if (Math.hypot(px - d.cx, py - d.cy) < d.r) n++;
    }
    return n;
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
    /** 같은 칸(같은 해·같은 단) 두 권의 국소 간격 — 책 폭 대비. 음수면 관통.
     *  같은 칸이 없으면 999(제약 없음). */
    sameBayGapW: number;
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
    /** 입문 경로에 속한 권의 작품 ID — 라벨의 순서 숫자가 정확히 이 집합이어야 한다 */
    ordered: string[];
    /** 권마다 투영된 화면 사각형 [x0,y0,x1,y1] 과 책등 정면인 권의 ID — 클릭 계약용 */
    boxes: Record<string, [number, number, number, number]>;
    spineOutIds: string[];
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
    const boxById: Record<string, [number, number, number, number]> = {};
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
        boxById[c.workId] = [Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1)];
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
    // **같은 칸**(같은 해·같은 단)의 두 권은 깊이 단서가 없다 — 겹치면 그냥
    // 관통이다. 다른 해끼리의 겹침은 원근이므로 결함이 아니다. 두 경우를
    // 한 숫자로 묶으면 진짜 관통이 원근에 묻힌다(실측: 타고르 1910 의 두 권이
    // 폭의 34% 를 관통하는 동안 minGapPx 는 카프카의 원근값에 가려져 있었다).
    // 회랑 카메라는 서가를 **스치듯** 본다(로컬 X = 걷는 방향). 그래서 나란히
    // 선 두 권의 화면 상자는 실제로 떨어져 있어도 언제나 겹친다 — 화면으로
    // 재면 진짜 관통과 원근이 구별되지 않는다. 국소 좌표에서 잰다.
    let sameBayGapW = Infinity;
    for (let i = 0; i < this.cityRecords.length; i++)
      for (let j = i + 1; j < this.cityRecords.length; j++) {
        const ci = this.cityRecords[i]!;
        const cj = this.cityRecords[j]!;
        if (ci.year !== cj.year || ci.row !== cj.row) continue;
        const gap =
          Math.abs(ci.localX - cj.localX) -
          (ci.halfW * ci.scaleX + cj.halfW * cj.scaleX);
        sameBayGapW = Math.min(sameBayGapW, gap / Math.max(1e-9, ci.halfW * 2));
      }
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
      sameBayGapW: Number.isFinite(sameBayGapW) ? Number(sameBayGapW.toFixed(3)) : 999,
      crossHidden: Number(crossHidden.toFixed(2)),
      chrome: this.cityAnchors.length,
      chromeBuried: buried,
      ticks: this.cityTicks,
      ordered: this.cityRecords.filter((c) => c.orderIndex >= 0).map((c) => c.workId),
      boxes: boxById,
      spineOutIds: this.cityRecords.filter((c) => !isFaceOut(c)).map((c) => c.workId),
      rowFrontY: mean(rowY[0]),
      rowBackY: mean(rowY[1]),
      uprightRatio: Number.isFinite(upright) ? Number(upright.toFixed(2)) : -1,
      total: this.cityRecords.length
    };
  }

  /** 이번 프레임에 초점 원반에 걸려 접은 이름 수 — 계약은 이것이 아니라
   *  화면에 남은 라벨(labelsOverFocus)을 읽는다 */
  private lastOccludedLabels = 0;
  /** 다른 이유 없이 **가깝다는 것만으로** 이름을 받은 별 수 (R12-f) */
  private lastNearNamed = 0;

  /** 판은 표면에 서 있고(+Y = 지면 법선) 관측자를 향해 돈다 — 축 고정 빌보드 */


  private updateLabels(): void {
    const w = this.renderer.domElement.clientWidth;
    const h = this.renderer.domElement.clientHeight;
    const items: LabelItem[] = [];
    const v = new THREE.Vector3();
    const camDir = this.camera.getWorldDirection(new THREE.Vector3());
    const s = this.state;
    this.lastOccludedLabels = 0;
    let nearNamed = 0;
    const disc = this.focusDiscPx();

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
        // **다가간 별은 이름을 갖는다** (R12-f). 겉보기 크기는 영향력에 매여
        // 있으므로(성좌 아틀라스의 형식), 미준비 작가는 아무리 가까이 가도
        // 점의 크기가 변하지 않는다 — 자유 비행이 들어온 뒤로 그것은 "날아가도
        // 아무 일도 일어나지 않는다"가 된다(실측: 보르헤스 192단위, 이름 없음).
        // 크기를 거리에 매는 대신 **이름을** 거리에 맨다: 형식은 그대로 두고,
        // 접근에 대한 응답만 돌려준다.
        const dCam = (this.dirs[i] as THREE.Vector3)
          .clone()
          .multiplyScalar(SHELL_R)
          .distanceTo(this.camera.position);
        const near = dCam < NAME_NEAR;
        // 다른 이유가 하나도 없는데 **가깝다는 것만으로** 이름을 받는 별을
        // 따로 센다. 그러지 않으면 등급이 높아 어차피 이름을 받는 별을 두고
        // "다가가면 이름이 뜬다"를 주장하게 된다(스윕 생존 실측).
        const otherwise =
          id === s.focusId ||
          id === s.hoveredId ||
          inGroupFocus ||
          s.egoLit.has(id) ||
          s.read.has(id) ||
          s.want.has(id) ||
          (this.mags[i] ?? 0) > (sky ? 0.62 : 0.3);
        const named = otherwise || near;
        if (!named) continue;
        if (near && !otherwise) nearNamed++;
        const world = this.effectivePos(id, new THREE.Vector3());
        const toward = world.clone().sub(this.camera.position).normalize();
        if (toward.dot(camDir) < 0.28) continue;
        v.copy(world).project(this.camera);
        if (v.z > 1) continue;
        // 해상된 초점 원반 **위에 글자가 걸치는** 이름은 그리지 않는다 — 뒤에
        // 가려진 별(실측: 소세키 원반 위 '프란츠 카프카 ①')도, 앵커는 원반 밖인데
        // 가운데 정렬된 글자가 원반으로 넘어오는 별도 같은 검사로 접힌다. 처음엔
        // 광선-구 검사를 따로 뒀는데 변이 스윕이 그것이 이 검사에 **완전히
        // 포괄되는 죽은 코드**임을 증명해 걷어냈다. 초점 자신은 예외(그 원반은
        // 그 이름의 것이다).
        if (id !== s.focusId && id !== s.landedId && disc) {
          const ax = ((v.x + 1) / 2) * w;
          const ay = ((-v.y + 1) / 2) * h + 14;
          // 라벨의 실제 폭으로 잰다 — 라벨 레이어와 같은 추정 함수, 같은 각자 크롬
          const mag0 = this.mags[i] ?? 0;
          const fs = mag0 > 0.6 ? 16 : mag0 > 0.3 ? 14 : 13;
          const glyphs0 = (s.lensMarks.get(id) ?? []).map(indexGlyph).join("");
          const text0 = glyphs0 ? `${a.names.ko}\u2009${glyphs0}` : a.names.ko;
          const halfW = estimateWidth(text0, fs, LABEL_CHROME_ENGRAVED) / 2 + 6;
          const nx = Math.max(ax - halfW, Math.min(disc.cx, ax + halfW));
          const ny = Math.max(ay, Math.min(disc.cy, ay + fs + 6));
          if (Math.hypot(nx - disc.cx, ny - disc.cy) < disc.r) {
            this.lastOccludedLabels++;
            continue;
          }
        }
        const mag = this.mags[i] ?? 0;
        // "neighbor" 와 "listed" 는 그리디 예산을 우회한다(labels.ts). 예산을
        // 넘겨도 되는 것은 선택 자신·자기 성좌·범례에서 지목된 구성원뿐이다.
        // 지목된 구성원은 **관계 이웃과 다른 상태**다 — 같은 놋쇠 기준선을 주면
        // 사조가 같을 뿐인 별이 근거 있는 관계 이웃과 구분되지 않는다(실측:
        // 마푸즈·마샤두가 보르헤스와 바이트 단위로 같은 라벨이었다).
        const state =
          id === s.focusId || id === s.landedId
            ? "selected"
            : id === s.hoveredId
              ? "hovered"
              : s.egoLit.has(id)
                ? "neighbor"
                : inGroupFocus
                  ? "listed"
                  : "normal";
        const glyphs = (s.lensMarks.get(id) ?? []).map(indexGlyph).join("");
        const sx = ((v.x + 1) / 2) * w;
        const sy = ((-v.y + 1) / 2) * h + 14;
        const text = glyphs ? `${a.names.ko}\u2009${glyphs}` : a.names.ko;
        const fs = mag > 0.6 ? 16 : mag > 0.3 ? 14 : 13;
        // 패널이 덮는 자리에는 이름을 놓지 않는다 — 읽을 수 없는 라벨은
        // 정보가 아니라 소음이다(R9 "뷰포트 안의 다음 행동" 계승).
        // 고른 별도 예외가 아니다(R13-c): 픽이 몸을 옮기지 않게 되면서 고른
        // 별이 크롬 위에 설 수 있게 됐고(실측: 손안 그립 위의 카프카), 그
        // 이름은 이미 카드 제목이 들고 있다 — 컨트롤 위의 글자는 소음이다.
        if (this.labelHidden(sx, sy, text, fs, LABEL_CHROME_ENGRAVED, w, h)) continue;
        items.push({
          id,
          text,
          kind: "author",
          size: mag > 0.6 ? "lg" : mag > 0.3 ? "md" : "sm",
          priority:
            (id === s.focusId ? 400 : 0) +
            (id === s.hoveredId ? 200 : 0) +
            (inGroupFocus ? 300 : 0) +
            (s.read.has(id) ? 60 : 0) +
            // 가까울수록 먼저 — 예산이 모자랄 때 남는 것은 지나치는 별이 아니라
            // 다가간 별이어야 한다
            (near ? 260 * (1 - dCam / NAME_NEAR) : 0) +
            mag * 100,
          x: sx,
          y: sy,
          state,
          ground: "sky",
          // 층이 켜져 있고 이 별이 그 층 밖이면 글자를 접는다(틱만 남는다).
          // 선택·호버·이웃·개인 기록은 접지 않는다 — 방향감이 사라진다.
          // **다가간 별도 접지 않는다**(R12-f): 층은 색인이지 필터가 아니고,
          // 코앞의 별 이름이 틱으로 접혀 있으면 자유 비행은 "날아가도 아무 일도
          // 없다"가 된다(실측: 보르헤스 192단위에서 라벨은 있었고 접혀 있었다).
          muted:
            Boolean(s.lens) &&
            state === "normal" &&
            !near &&
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
        // 작품 이름표도 같은 자로 잰다. 이 경로에는 좌우 축도 연도판 가드도
        // 없었고, 그래서 누운 화면에서 『소송』이 연도 슬라이더 위에 얹혀
        // **탭이 작품 대신 연도를 옮겼다**(1995 → 1882, 실측).
        const wy = ((-v.y + 1) / 2) * h + 10;
        const wx = ((v.x + 1) / 2) * w;
        const wtext = c.orderIndex >= 0 ? `${c.orderIndex + 1} ${work.titleKo}` : work.titleKo;
        if (this.labelHidden(wx, wy, wtext, 13, LABEL_CHROME_SLIP, w, h)) continue;
        items.push({
          id: c.workId,
          // 입문 **순서**는 여기서만 말한다 — 궤도 카드의 「입문 순서」목록과 같은
          // 일반 숫자로. 원 숫자 ①②③ 는 관측층 색인(명목) 전용이다: 같은 글자가
          // 하늘에선 소속, 서가에선 순서를 뜻하던 것을 두 측정(모의 심사·합성
          // 파일럿 4/4)이 동시에 잡았다.
          text: wtext,
          kind: "work",
          size: "sm",
          // 입문 경로 권의 숫자는 문법의 나름이다 — 충돌 컬링이 지우면 순서
          // 채널이 사라진다. 순서 권은 우선순위를 올려 끝까지 남긴다.
          priority: work.id === s.selectedWorkId ? 400 : c.orderIndex >= 0 ? 320 : 100,
          x: wx,
          y: wy,
          state: work.id === s.selectedWorkId ? "selected" : "normal",
          // 작품 라벨만 작가의 실제 종이 위에 선다 — 슬립이 살아 있는 유일한 자리
          ground: "crust",
          interactive: true,
          ariaLabel: `${work.titleKo} — 작품 열기`
        });
      }
      // 관련 별의 이름 (R12-c 선 다이어트): 착륙 중에도 이웃은 **이름으로**
      // 하늘에 서 있다 — 회랑의 끝이 벽이 아니라 갈 수 있는 곳이라는 증거.
      // 누르면 그 자리에서 날아오른다(이름표·별 픽 둘 다).
      for (const nid of s.egoLit) {
        if (nid === s.landedId) continue;
        const a = this.data.authors.find((x) => x.id === nid);
        const i = this.index.get(nid);
        if (!a || i === undefined || !this.present(i)) continue;
        this.effectivePos(nid, v).project(this.camera);
        if (v.z > 1) continue;
        const sx = ((v.x + 1) / 2) * w;
        const sy = ((-v.y + 1) / 2) * h + 14;
        if (this.labelHidden(sx, sy, a.names.ko, 13, LABEL_CHROME_ENGRAVED, w, h)) continue;
        items.push({
          id: nid,
          text: a.names.ko,
          kind: "author",
          size: "sm",
          priority: (nid === s.hoveredId ? 250 : 0) + 80,
          x: sx,
          y: sy,
          state: nid === s.hoveredId ? "hovered" : "neighbor",
          ground: "sky",
          interactive: true,
          ariaLabel: `${a.names.ko} — 이 별로 날아오르기`
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
    this.lastNearNamed = nearNamed;
    this.lastSkyLabels = items.filter((i) => i.ground === "sky").length;
    this.lastCrustLabels = items.filter((i) => i.ground === "crust").length;
    // 종이 슬립은 **작품 라벨만** 가질 수 있다. 작가 이름이 슬립을 달면
    // 하늘에 판이 돌아온 것이고, 그것이 이 숫자로 잡힌다.
    this.lastCrustAuthorLabels = items.filter(
      (i) => i.ground === "crust" && i.kind !== "work"
    ).length;
    this.labels.onActivate = (id) => {
      if (!this.index.has(id)) {
        this.cb.onPickWork(id);
        return;
      }
      if (this.aimFirst(id)) return;
      this.cb.onPickAuthor(id);
    };
    this.labels.update(items, w, h, this.stage === "surface" ? 40 : this.stage === "sky" ? 18 : 32);
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.renderer.domElement.removeEventListener("pointerdown", this.onPointerDown);
    this.renderer.domElement.removeEventListener("pointermove", this.onPointerMove);
    this.renderer.domElement.removeEventListener("pointerup", this.onPointerUp);
    this.renderer.domElement.removeEventListener("pointercancel", this.onPointerUp);
    this.renderer.domElement.removeEventListener("wheel", this.onWheel);
    this.host.ownerDocument.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("resize", this.onResize);
    this.labels.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
