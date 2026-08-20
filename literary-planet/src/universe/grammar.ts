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
 *  중심까지의 거리가 아니라 그 지면에서의 거리다 — 2.1r 이면 서가를 가로질러
 *  보는 시선이 되고 위쪽에 하늘이 남는다. */
export const LANDING_ALT = 2.1;

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
