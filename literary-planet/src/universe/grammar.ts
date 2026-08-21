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
/** 착륙 고도 = 천체 반경 × 이 계수. 주시점이 **지면 위 한 점**이므로 이 값은
 *  중심까지의 거리가 아니라 그 지면에서의 거리다. */
export const LANDING_ALT = 1.5;

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
/** 두 단 사이의 위도 간격(rad). 책 높이보다 커야 앞단이 뒷단을 삼키지 않는다 */
export const SHELF_ROW_LAT = (17 * Math.PI) / 180;
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

/**
 * 연도 → 경도. **순서는 연도가 정하고, 간격은 연도 간격에 비례하되 최소
 * 간격 아래로는 압축되지 않는다.** 비례를 무조건 지키면 인접 연도의 두 권이
 * 물리적으로 겹치고(카프카 1925·1926 은 연도 축의 1/13 밖에 안 떨어져 있는데
 * 책은 그보다 넓다), 겹친 책은 어떤 값도 전달하지 못한다. 왜곡은 감추지 않는다 — 서가 난간의 눈금이 같은 사상을
 * 통과해 놓이므로 어디가 밀렸는지 눈에 보인다.
 *
 * 반환은 입력 순서에 대응한다. 동률 연도는 입력 순서를 유지한다.
 */
export function shelfLongitudes(years: readonly number[], minGap: number): number[] {
  const n = years.length;
  if (n === 0) return [];
  if (n === 1) return [0];
  const idx = years.map((_, i) => i).sort((a, b) => (years[a] as number) - (years[b] as number) || a - b);
  const ys = idx.map((i) => years[i] as number);
  const yMin = ys[0] as number;
  const yMax = ys[n - 1] as number;
  const span = 2 * SHELF_LON;
  const pos = ys.map((y) =>
    yMax > yMin ? -SHELF_LON + (span * (y - yMin)) / (yMax - yMin) : 0
  );
  for (let i = 1; i < n; i++) pos[i] = Math.max(pos[i] as number, (pos[i - 1] as number) + minGap);
  if ((pos[n - 1] as number) > SHELF_LON) {
    pos[n - 1] = SHELF_LON;
    for (let i = n - 2; i >= 0; i--)
      pos[i] = Math.min(pos[i] as number, (pos[i + 1] as number) - minGap);
  }
  if ((pos[0] as number) < -SHELF_LON) {
    // 띠가 물리적으로 모자란다 — 비례를 포기하고 순서만 지킨다.
    const step = span / (n - 1);
    for (let i = 0; i < n; i++) pos[i] = -SHELF_LON + step * i;
  }
  const out = new Array<number>(n);
  idx.forEach((orig, k) => {
    out[orig] = pos[k] as number;
  });
  return out;
}

/**
 * 서가 난간의 눈금 간격 — 3~6개가 놓이는 가장 촘촘한 단위를 고른다.
 * 눈금이 하나뿐이면 축이 아니라 표식이고, 열 개면 난간이 아니라 자다.
 */
export function shelfTickStep(yMin: number, yMax: number): number {
  const span = Math.max(1, yMax - yMin);
  for (const s of [1, 2, 5, 10, 20, 50, 100]) if (span / s <= 6) return s;
  return 200;
}

/**
 * 연도 → 경도 보간. 작품이 놓인 (연도, 경도) 쌍을 통과하는 단조 조각선형
 * 사상이다. 눈금이 이 사상을 쓰기 때문에 최소 간격이 만든 왜곡이 난간 위에
 * 그대로 드러난다.
 */
export function yearToLon(
  year: number,
  pairs: ReadonlyArray<readonly [number, number]>
): number {
  if (!pairs.length) return 0;
  const p = [...pairs].sort((a, b) => a[0] - b[0]);
  const first = p[0] as readonly [number, number];
  const last = p[p.length - 1] as readonly [number, number];
  if (year <= first[0]) return first[1];
  if (year >= last[0]) return last[1];
  for (let i = 1; i < p.length; i++) {
    const a = p[i - 1] as readonly [number, number];
    const b = p[i] as readonly [number, number];
    if (year <= b[0]) {
      if (b[0] === a[0]) return b[1];
      const t = (year - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * t;
    }
  }
  return last[1];
}

/** 주시점을 지면 위로 올리는 높이(천체 반경 대비) — 책 높이의 절반 남짓 */
export const SHELF_EYE_LIFT = VOL_W_MAX * VOL_ASPECT * 0.5;
