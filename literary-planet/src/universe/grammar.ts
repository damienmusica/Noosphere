// R11 성계(星系) 문법 — 화면의 모든 채널이 정확히 하나의 정보를 나른다.
//
// 원칙 (docs/universe-thesis.md 가 정본):
//  1. 표현은 소유가 아니라 **겉보기 크기의 함수**다. 같은 천체가 멀면 별,
//     가까우면 구, 더 가까우면 지각이 된다. 데이터에는 "작가가 작품을 소유한다"
//     같은 영구 계층이 없다.
//  2. 한 채널에 한 의미. 광도=영향력, 색=시대, 방향=친연성, 선=관계,
//     점등=개인 독서 기록, 실루엣=장르 구성.
//  3. 없는 것은 없다고 말한다. 실물 자료가 없는 천체는 화려하게 위장하지 않는다.

import type { Author, PeriodId, Tier } from "../types.ts";
import { PERIOD_TINT } from "../theme.ts";

/** 천구 반경 — 모든 작가 천체가 원점(정본 코퍼스=항성)에서 이 거리에 놓인다.
 *  거리를 포기하고 방향만 남기는 것이 성좌 아틀라스의 형식이며, 그래서
 *  겉보기 크기가 순수하게 영향력이 된다(가까운 별인지 큰 별인지의 모호성 제거). */
export const SHELL_R = 900;

/** 카메라 거리(궤도 타깃 기준) 경계 */
export const CAM_SKY_DEFAULT = 2150;
export const CAM_SKY_MAX = 3200;

// ——— 자유 비행 (R12-f) ———
// 표현 사다리는 이미 **거리의 함수**다(별 → 원반 → 지각 → 표면). 없던 것은
// 사다리가 아니라 그 사다리를 오를 이동 수단이었다: 주시점이 `flyTo` 에서만
// 바뀌었으므로 "이미 고른 것 주위를 돌 수는 있어도 고르지 않은 것에는 다가갈
// 수 없다"가 성립했다. 피벗을 시선 앞에 두면 같은 컨트롤이 다르게 읽힌다 —
// 드래그는 고개 돌리기, 휠·핀치는 전진.

/** 시선 앞 피벗까지의 거리. 드래그 한 바퀴가 카메라를 이만큼의 반경으로
 *  돌리므로, 작을수록 "제자리에서 고개를 돌린다"에 가깝다. 천구 반경(900)의
 *  1/6 — 별 사이 간격보다 작아 회전이 시차로 읽히지 않는다. */
export const FREE_PIVOT = 150;
/** 휠 1픽셀이 더하는 속도(단위/초). 한 노치(100px)가 ≈ 900/s, 관성 활공 ≈ 225단위. */
export const THRUST_PER_PX = 9;
/** 속도 상한 — 천구를 한 번에 관통하지 않는 값 */
export const THRUST_MAX = 2600;
/** 1초 뒤 남는 속도 비율. 관성이 있어야 비행이 비행으로 읽힌다. */
export const THRUST_DAMP = 0.02;
/** 원점(항성)에 이보다 가까이는 가지 않는다 — 태양 코로나 안쪽 */
export const FREE_R_MIN = 120;

// ——— 회랑 걷기 (R12-f) ———
// 착륙 자세는 이미 매개변수였다: corridorTheta(yStart + 0.8, …). 그 상수를
// **상태**로 바꾸면 회랑을 걷는다 — 서 있는 해가 바뀌고, 사망선을 지나가고,
// 명패 앞에 설 수 있다.

/** 휠 1픽셀이 더하는 걷기 속도(연/초). 한 노치 ≈ 1칸. */
export const WALK_PER_PX = 0.045;
export const WALK_MAX = 26;
export const WALK_DAMP = 0.01;
/** 회랑 안에서 고개를 돌릴 수 있는 범위(도) — 서가를 잃지 않는 한도 */
export const LOOK_YAW_MAX = 62;
export const LOOK_PITCH_MAX = 30;

/** 서가가 서는 지면의 방향 — 천체 반경 축에서 이만큼 기울어진 곳 */
export const SHELF_AXIS_DEG = 14;
/**
 * 시선과 그 지면 법선이 이루는 각. **이 값이 착륙의 전부다.** 이전 판은 10°
 * 였고(지면 52° · 카메라 62°), 그래서 서가를 거의 수직으로 내려다봤다 —
 * 빌보드가 책을 관측자 쪽으로 돌려 세워도 세로 방향이 통째로 단축되어 제본된
 * 책이 바닥에 놓인 판으로 읽혔다(실측: 유형지에서·선고). 60°대에서 책은
 * 자기 높이의 90%를 화면에 남기고, 지면은 뒤로 물러나며, 지평선이 프레임에
 * 들어온다.
 */
export const LANDING_INCIDENCE_DEG = 64;

// ---------------------------------------------------------------------------
// 영향력 → 광도
// ---------------------------------------------------------------------------

const TIER_BASE: Record<Tier, number> = { anchor: 2.4, major: 1.0, context: 0.55 };

/**
 * 영향력 가중치. **R10 영토 면적과 같은 산식**을 쓴다
 * (tierBase × (1 + 0.3 × 정규화 관계 차수), territory.v1 헤더가 정본) —
 * 같은 데이터가 땅에서는 면적, 하늘에서는 광도가 되도록 두 체계를 일치시킨다.
 */
export function influenceWeight(tier: Tier, degree: number, maxDegree: number): number {
  const degreeHat = maxDegree > 0 ? degree / maxDegree : 0;
  return TIER_BASE[tier] * (1 + 0.3 * degreeHat);
}

/** 0..1 정규화 광도 */
export function magnitude(weight: number): number {
  const lo = TIER_BASE.context;
  const hi = TIER_BASE.anchor * 1.3;
  return Math.min(1, Math.max(0, (weight - lo) / (hi - lo)));
}

/** 별 스프라이트의 화면 크기(px) — 광도의 유일한 소비처 */
export function starPixels(mag: number): number {
  return 6.5 + mag * 16;
}

/**
 * 천체 반경(월드 단위) — 겉보기 크기가 광도와 같은 것을 말하도록 광도에서 파생.
 * 천구 반경(900)에 대해 1/1000 규모인 것은 취향이 아니라 요구사항이다: 천체가
 * 껍질에 비해 작아야 원경에서 3px 미만(=별)이 되고, 그래야 별과 천체가 같은
 * 객체라는 규칙이 성립한다.
 */
export function bodyRadius(mag: number): number {
  return 0.85 + mag * 1.75;
}

// ---------------------------------------------------------------------------
// 시대 → 색 (항성 스펙트럼 램프)
// ---------------------------------------------------------------------------

const PERIOD_ORDER: PeriodId[] = [
  "roots",
  "early-modernism",
  "mid-century",
  "late-postmodern",
  "contemporary"
];

/** anchorYear 가 놓인 시대층 — 별의 색은 작가의 정점 시점이 정한다 */
export function periodOf(a: Author): PeriodId {
  const y = a.anchorYear;
  if (y < 1900) return "roots";
  if (y < 1945) return "early-modernism";
  if (y < 1970) return "mid-century";
  if (y < 1990) return "late-postmodern";
  return "contemporary";
}

export function tintOf(a: Author): string {
  return PERIOD_TINT[periodOf(a)];
}

export function periodIndex(p: PeriodId): number {
  return PERIOD_ORDER.indexOf(p);
}

// ---------------------------------------------------------------------------
// 겉보기 크기 → 표현 단계 (계층이 아니라 거리의 함수)
// ---------------------------------------------------------------------------

export type Representation = "star" | "resolved" | "surface";

/** 별 → 원반 전환 임계(px). 교차 페이드는 이 값에서 2배까지. */
export const STAR_TO_DISC_PX = 7;

/** 천체의 화면상 반경(px) */
export function apparentRadiusPx(
  radius: number,
  distance: number,
  fovYDeg: number,
  viewportH: number
): number {
  if (distance <= radius) return viewportH;
  const halfFov = (fovYDeg * Math.PI) / 360;
  return (radius / distance / Math.tan(halfFov)) * (viewportH / 2);
}

/** 별 스프라이트가 자랄 수 있는 상한(px). 준비되지 않은 작가는 영영 구로
 *  분해되지 않으므로(항성으로 남는다) 그 별의 원반에는 넘겨받을 메시가 없다 —
 *  상한이 없으면 스치듯 지나가는 것만으로 화면이 한 점광원으로 덮인다. */
export const STAR_MAX_PX = 128;

/**
 * 별의 화면 지름(px) — **광휘 바닥과 실제 원반 중 큰 쪽.**
 *
 * 이전 판에서 별의 크기는 광도만의 함수였다(`starPixels`). 그 결과 별은
 * **거리를 가지지 않았다**: 카메라가 2189 → 379 로 다가가는 동안 카프카의
 * 발광 픽셀 폭은 2~3px 로 고정이었다(실측). 크기가 자라는 유일한 길은 구로
 * 분해되는 것뿐인데, 분해는 `isLandable` 이 막는다 — 100인 중 준비된 작가는
 * 셋이다. **나머지 97 개의 별은 아무리 다가가도 같은 점이었다.**
 *
 * 두 항은 서로 다른 사실을 말하므로 둘 다 필요하다:
 *  · 광휘는 거리와 무관하다 — 점광원의 눈부심이고, 하늘 전체를 한눈에 읽게
 *    하는 광도 채널이다. 이것을 거리로 깎으면 먼 하늘이 균일한 먼지가 된다.
 *  · 원반은 거리의 함수다 — 그 천체가 실제로 차지하는 각이다. 다가갈수록
 *    자라고, **같은 거리에서는 영향력이 큰 작가가 더 크다**(반경이 광도에서
 *    파생되므로).
 *
 * 큰 쪽을 쓰면 전환이 연속이다: 원반이 광휘를 넘어서는 순간부터 스프라이트가
 * 자라고, 구가 나타나는 순간(`STAR_TO_DISC_PX`)의 스프라이트 지름은 이미
 * 그 구의 지름이다.
 */
export function starDiameterPx(glarePx: number, apparentRadiusPx_: number): number {
  return Math.min(STAR_MAX_PX, Math.max(glarePx, apparentRadiusPx_ * 2));
}

/**
 * 별 → 구 → 지각. 임계는 지각(知覺)의 사실에서 온다:
 *  · 7px 미만이면 사람 눈에 점이다 → 별로 그린다(광도가 유일한 정보).
 *    (첫 구현의 3px 은 껍질 안으로 들어간 순간 90개 천체를 전부 "해상"으로
 *     바꿔 하늘을 검게 만들었다 — 실측 후 7px 로 올렸다.)
 *  · 7px 이상이면 원반이 보이기 시작한다 → 구로 분해한다.
 *  · 화면 높이의 22%를 넘으면 표면의 글자가 읽힐 크기다 → 지각을 칠한다.
 */
export function representationFor(apparentPx: number, viewportH: number): Representation {
  if (apparentPx < STAR_TO_DISC_PX) return "star";
  if (apparentPx < viewportH * 0.22) return "resolved";
  return "surface";
}

// ---------------------------------------------------------------------------
// 관측 렌즈 — 중경은 거리값이 아니라 상태다
// ---------------------------------------------------------------------------
//
// 한 유클리드 투영 안에서 "천체를 세계로 보는 거리"와 "이웃을 관계로 보는
// 거리"는 동시에 성립하지 않는다. 그것은 물리적 사실이지만 **제품의 불가능성이
// 아니다** — 인터페이스가 단일 투영일 이유가 없기 때문이다(외부 리뷰 지적 ②,
// 전면 수용). 초점+맥락 렌즈를 쓴다:
//
//   · 선택 천체는 **일률 배율**로 확대한다(작가마다 다른 배율을 쓰면 겉보기
//     크기가 영향력을 말한다는 계약이 깨진다 — 배율은 같고 크기 차이는 남는다).
//   · 관계 이웃은 **각방향을 정확히 보존**한 채 반경만 압축한다. 끌어오는 것
//     자체가 관계 정보를 나른다 — 이것은 정보를 나르지 않는 왜곡이 아니다.
//   · 원래 위치는 별과 궤적으로 그대로 남는다. 왜곡이 눈에 보여야 기만이 아니다.
//   · 무관한 별은 자리도 밝기도 건드리지 않는다.

/** 렌즈 상태에서 카메라가 선택 천체로부터 두는 거리 */
export const LENS_DIST = 1200;
/** 선택 천체의 일률 배율 */
export const LENS_MAG = 34;
/** 압축된 이웃이 놓이는 반경 범위 — 하한은 확대된 천체 반경보다 커야 한다 */
export const LENS_MIN = 170;
export const LENS_MAX = 400;

/**
 * 이웃까지의 실제 거리 d 를 렌즈 반경으로 압축한다. 단조 증가이고
 * 방향은 호출부가 보존한다(반경만 바꾼다).
 */
export function lensCompress(d: number, dMin: number, dMax: number): number {
  if (dMax <= dMin) return LENS_MIN;
  const t = Math.min(1, Math.max(0, (d - dMin) / (dMax - dMin)));
  return LENS_MIN + (LENS_MAX - LENS_MIN) * Math.sqrt(t);
}

/**
 * 렌즈가 이웃을 옮기는 자리. **방향 보존이 여기서 구조적으로 보장된다** —
 * 초점에서 원래 위치로 향하는 단위 벡터에 압축된 반경만 곱한다.
 * 장면 코드가 이 함수를 그대로 쓰므로 테스트가 실제 경로를 검증한다
 * (R11-c: 이전 테스트는 `lensCompress(500)===lensCompress(500)` 이라는
 * 결정성만 확인하고 방향 보존은 전혀 보지 않는 오탐이었다).
 */
export function lensPosition(
  focus: readonly [number, number, number],
  orig: readonly [number, number, number],
  dMin: number,
  dMax: number
): [number, number, number] {
  const dx = orig[0] - focus[0];
  const dy = orig[1] - focus[1];
  const dz = orig[2] - focus[2];
  const d = Math.hypot(dx, dy, dz);
  if (d === 0) return [focus[0], focus[1], focus[2]];
  const r = lensCompress(d, dMin, dMax) / d;
  return [focus[0] + dx * r, focus[1] + dy * r, focus[2] + dz * r];
}

// ---------------------------------------------------------------------------
// 시간 — 별의 생성·활동·잔광
// ---------------------------------------------------------------------------

export interface StarLife {
  /** 0 = 아직 없음, 1 = 활동기 최대 */
  presence: number;
  /** 사후 잔광(작품은 남는다) */
  afterglow: boolean;
}

/**
 * 연도 스크럽에 대한 별의 상태. 태어나기 전에는 존재하지 않고, 활동기에
 * 밝아지며, 사후에는 잔광으로 남는다 — "작가는 죽고 작품은 남는다"가
 * 감상이 아니라 규칙이 되도록.
 */
export function starLife(a: Author, year: number): StarLife {
  const [from, to] = a.activeRange;
  // birthYear is optional on drafts; the active range is the contract
  const born = a.birthYear ?? from - 25;
  if (year < born) return { presence: 0, afterglow: false };
  if (year < from) {
    const k = (year - born) / Math.max(1, from - born);
    return { presence: 0.18 * k, afterglow: false };
  }
  if (year <= to) return { presence: 1, afterglow: false };
  return { presence: 0.42, afterglow: true };
}

// ---------------------------------------------------------------------------
// 실루엣 — 장르 구성 (모양도 정보다)
// ---------------------------------------------------------------------------

export const SILHOUETTE_GENRES = ["fiction", "poetry", "drama", "essay-criticism"] as const;

/**
 * 장르 4채널을 저주파 구면 조화의 진폭으로 쓴다(±6%). 시인의 천체와
 * 소설가의 천체는 **다른 데이터를 가졌기 때문에** 다르게 생겼다.
 * 진폭 상한을 6%로 묶는 이유: 실루엣이 광도(=영향력)를 흉내내면 채널이 겹친다.
 */
export function genreHarmonics(a: Author): [number, number, number, number] {
  const g = new Set(a.genres);
  const n = Math.max(1, a.genres.length);
  return SILHOUETTE_GENRES.map((k) => (g.has(k) ? 1 / Math.sqrt(n) : 0)) as unknown as [
    number,
    number,
    number,
    number
  ];
}

export const SILHOUETTE_AMP = 0.06;

/**
 * 방향 하나에서의 천체 표면 반경(단위 반경 기준). 형상 생성과 **표면에 놓이는
 * 모든 것**(서가 난간·눈금·연도·책의 밑동)이 같은 함수를 써야 한다. 상수 1.0 을
 * 쓰면 실루엣이 부풀어 오른 자리에서 난간과 연도가 지각 안으로 파묻힌다
 * (실측: 소세키의 서가에서 난간과 눈금 여섯 개가 통째로 사라졌다 — 카프카에서는
 * 같은 코드가 멀쩡히 보였기 때문에 오래 눈에 띄지 않았다).
 */
export function silhouetteRadius(
  h: readonly [number, number, number, number],
  x: number,
  y: number,
  z: number
): number {
  const y1 = y;
  const y2 = (3 * z * z - 1) / 2;
  const y3 = x * y * 2;
  const y4 = x * x - y * y;
  return 1 + SILHOUETTE_AMP * (h[0] * y1 + h[1] * y2 + h[2] * y3 + h[3] * y4);
}

// ---------------------------------------------------------------------------
// 작품 도시 — 연도 서가
// ---------------------------------------------------------------------------
//
// 서가의 두 축은 둘 다 /data 에 실재하는 값이다:
//   · 경도 = 발표 연도 (works[].year)
//   · 단(段) = 입문 경로 소속 (authors[].readingOrder 안이냐 밖이냐)
// 입문 **순서**는 위도가 아니라 라벨의 색인 글리프(①②③)가 나른다. 순서를
// 위도 단차로 표현하던 이전 판은 두 가지를 동시에 잃었다: 단차는 곡면 위
// 사입 시점에서 순서로 읽히지 않았고, 책 높이보다 작은 위도 차는 이웃한 연도의
// 책 두 권을 서로 관통시켰다. **이전 판에서 실측한 값**이다: 소송 1925 · 성
// 1926 이 경도 3.4°, 위도 13° 떨어져 있었고 책은 14.9°×21.2° 였다(그때의
// 서가 반폭 22° · 책 폭 0.26r 기준 — 지금 상수로 다시 계산하지 말 것).
// 색인 글리프는 관측층 범례가 이미 쓰는 어휘이므로 새 채널이 아니다.

/** 서가가 차지하는 경도 반폭(rad) — 착륙 시야가 실제로 담는 각폭(실측) */
export const SHELF_LON = (18 * Math.PI) / 180;
/** 책 폭 상한(천체 반경 대비). 작품이 많으면 띠에 맞춰 이 아래로 줄어든다 */
export const VOL_W_MAX = 0.17;
/** 판형 — 높이/폭. 4절판보다 세로로 긴 8절판 비율 */
export const VOL_ASPECT = 1.45;
/** 두께/폭. **상수다** — 두께는 보편적으로 쪽수로 읽히고 우리는 쪽수가 없다 */
export const VOL_DEPTH = 0.30;
/**
 * 책 사이 최소 공기(폭 대비). 6%로는 모자란다 — 권마다 관측자를 향해 도는
 * 빌보드이므로, 서가 축에서 α 만큼 벗어난 자리의 책은 서가 방향으로
 * `폭·cos α + 두께·sin α` 를 차지한다. 서가 반폭 18°에서 그 값이 폭의 1.05배가
 * 되고, 6%의 공기는 그대로 잡아먹힌다(실측: 소송 1925 · 성 1926 이 화면에서
 * 겹쳤다 — 3차원에서는 떨어져 있었다).
 */
export const VOL_AIR = 1.32;

/** 작품 수가 정하는 책 폭 — 띠가 모자라면 책이 줄지, 책이 겹치지 않는다 */
export function volumeWidth(count: number): number {
  if (count <= 1) return VOL_W_MAX;
  return Math.min(VOL_W_MAX, (2 * SHELF_LON) / (count - 1) / VOL_AIR);
}





// ---------------------------------------------------------------------------
// 서가 회랑 (R12-c, CPO 연출 비준 2026-08-24) — 행성 지각이 접혀 올라온 회랑
// ---------------------------------------------------------------------------
// 서가는 제3의 공간이 아니라 **내가 착륙한 행성의 표면**이다: 벽은 지각과 같은
// 원고 종이이고, 연도 축은 표면의 호(弧)를 따라 지평선 너머로 이어진다. 칸은
// 연도당 하나로 균일하다 — 이전 서가의 최소-간격 압축(shelfLongitudes)은 회랑
// 좌표가 균일해지면서 소멸한다. 다섯 권의 수장고: 빈 칸은 빈 채로 서고, 침묵은
// 1924 사망선이 설명한다.

/** 한 연도 칸의 호 길이 — 책 폭의 배수. 책이 칸 안에서 숨을 쉬는 여유 */
export const CORRIDOR_CELL_AIR = 1.6;
/** 회랑이 첫 작품 앞에서 시작하기까지의 여유(연 단위) */
export const CORRIDOR_LEAD_YEARS = 2;
/** 마지막 앵커 뒤로 이어지는 빈 칸(연 단위) — 회랑은 벽이 아니라 지평선으로 끝난다 */
export const CORRIDOR_TAIL_YEARS = 4;
/** 눈높이 단의 바닥 높이(책 높이 배수)와 단 사이 간격 */
export const CORRIDOR_ROW_GAP = 0.22;
/** 착륙 시 눈높이 — 책 높이의 배수 (사람이 서가 앞에 선 키) */
export const CORRIDOR_EYE = 1.35;
/**
 * 회랑 전체가 차지할 수 있는 최대 호(라디안). 이것이 책의 크기를 정한다 —
 * 책이 행성을 감으면 회랑이 아니라 띠가 된다(실측: 옛 서가의 책 폭 0.17R 로
 * 62칸을 세우니 행성을 2.7바퀴 감았다). 사람 척도의 책 아래로 행성 척도의
 * 지평선이 놓이는 것이 "행성 위" 느낌의 근거다.
 */
export const CORRIDOR_ARC_MAX = 2.4;

/** 칸 수가 정하는 칸 호 — 상한을 넘지 않는 선에서 책 폭 비례를 따른다 */
export function corridorCellArc(bayCount: number, volWidthFrac: number): number {
  return Math.min(volWidthFrac * CORRIDOR_CELL_AIR, CORRIDOR_ARC_MAX / Math.max(1, bayCount));
}

export interface CorridorSpan {
  yStart: number;
  yEnd: number;
}

/**
 * 회랑이 덮는 연도 구간. 작품 연도 · 관계 앵커 연도 · 사망 연도를 전부 품는다 —
 * 실이 닿는 해가 회랑 밖이면 실이 허공에 닿는다.
 */
export function corridorSpan(
  workYears: number[],
  anchorYears: number[],
  deathYear?: number
): CorridorSpan {
  // 회랑은 **이 작가의** 연보다. 사후의 앵커는 구간을 뒤로 늘린다 — 수용사는
  // 그의 연보에 속한다(1969 카네티가 카프카의 회랑을 늘리는 것이 그것이다).
  // 그러나 첫 작품보다 앞선 앵커는 상대의 전사(前史)이지 그의 연보가 아니다:
  // 마샤두의 『브라스 쿠바스』(1881)를 그대로 받으면 소세키의 서가가 그가
  // 첫 책을 쓰기 24년 전부터 빈 칸으로 늘어선다. 원장(/data)에는 남기고
  // 회랑만 세우지 않는다 — 하늘의 실은 여전히 그 책에 닿는다.
  const own = [...workYears, ...(deathYear !== undefined ? [deathYear] : [])];
  const lo = own.length ? Math.min(...own) : Math.min(...anchorYears);
  const hi = Math.max(...own, ...anchorYears);
  return { yStart: lo - CORRIDOR_LEAD_YEARS, yEnd: hi + CORRIDOR_TAIL_YEARS };
}

/**
 * 연도 → 회랑 호 각(라디안). 균일 사상 — 연도가 다르면 각이 다르고, 간격은
 * 언제나 같다. cellArc 는 씬이 책 폭에서 계산해 넘긴다(bw/radius × AIR).
 * 회랑은 yStart 를 0 에 놓고 양의 방향으로 자란다.
 */
export function corridorTheta(year: number, span: CorridorSpan, cellArc: number): number {
  return (year - span.yStart) * cellArc;
}

/** 관계 앵커가 회랑에서 닿는 연도 — 책 앵커는 그 책의 발표 연도로 해상된다 */
export function anchorYearOf(
  anchor: { workId?: string; year?: number },
  workYear: (id: string) => number | undefined
): number | undefined {
  if (anchor.workId !== undefined) return workYear(anchor.workId) ?? anchor.year;
  return anchor.year;
}
