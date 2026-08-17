// Locale system. Adding a language = one LOCALES entry + one UI dictionary +
// one data/translations/<locale>/ pack. Graph topology and all ids stay
// language-independent (inherited Noosphere invariant).

import type {
  Author,
  Dataset,
  EvidenceLevel,
  Gender,
  GenreId,
  LocalePack,
  Movement,
  PeriodId,
  Relation,
  RelationType,
  ReviewStatus,
  Tier,
  Tour,
  Work
} from "../types.ts";
import {
  EVIDENCE_LEVEL_EN,
  EVIDENCE_LEVEL_KO,
  GENDER_EN,
  GENDER_KO,
  GENRE_DEFS,
  LANGUAGE_LABELS,
  LANGUAGE_LABELS_EN,
  PERIOD_DEFS,
  REGION_DEFS,
  RELATION_DEFS,
  REVIEW_STATUS_EN,
  REVIEW_STATUS_KO,
  TIER_LABELS
} from "../types.ts";

export const LOCALES = [
  { id: "ko", label: "한국어", short: "한" },
  { id: "en", label: "English", short: "EN" }
] as const;

export type Locale = (typeof LOCALES)[number]["id"];
export const DEFAULT_LOCALE: Locale = "ko";

export function isLocale(x: string | null | undefined): x is Locale {
  return LOCALES.some((l) => l.id === x);
}

// ---------------------------------------------------------------------------
// UI chrome strings
// ---------------------------------------------------------------------------

export interface UIStrings {
  brand: string;
  brandSub: (
    authors: number,
    authorsTotal: number,
    relations: number,
    relationsTotal: number
  ) => string;
  brandSubAria: string;
  brandSubTitle: (contrastCount: number) => string;
  skipLink: string;
  panelToggle: string;
  modeAria: string;
  modeSemantic: string;
  modeGeo: string;
  navAria: string;
  navMap: string;
  navWriters: string;
  navMethodology: string;
  localeAria: string;

  searchAria: string;
  searchPlaceholder: string;
  searchResultsAria: string;

  compareHint: string;
  cancel: string;

  allYears: string;
  upToYear: (y: number) => string;
  activeInYear: (y: number) => string;
  yearModeAria: string;
  cumulative: string;
  cumulativeTitle: string;
  activeMode: string;
  activeTitle: string;
  yearSliderAria: string;
  viewControlsAria: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;

  webglTitle: string;
  webglNote: string;
  fallbackPickHint: string;
  fallbackEgoAria: (name: string) => string;
  fallbackShowAll: string;
  legendTitle: string;
  legendCoord: (modeLabel: string) => string;
  legendTerrain: string;
  legendTerrainTitle: string;
  legendEra: string;
  legendEraTitle: string;
  legendUnion: string;
  legendOff: string;
  /** geo cluster chip under the representative seal ("+4") */
  clusterMore: (n: number) => string;
  clusterAria: (name: string, n: number) => string;
  clusterListAria: string;
  clusterNote: string;
  legendSecRelations: string;
  legendSecTerritory: string;
  legendSecTime: string;
  legendSecUnion: string;
  /** sovereignty-state badge on the profile while the fader is engaged */
  eraBadgeUnformed: string;
  eraBadgeForming: string;
  eraBadgeHeritage: string;
  eraBadgeInactive: string;
  eraBadgeTitle: string;
  /** shown beside the year label while the temporal plates paint (PR2) */
  eraPreparing: string;
  /** geo overview relation policy (PR3): computed corridors, not raw edges */
  legendRoutes: string;
  mapRelationsCapped: (shown: number, total: number) => string;
  showAllRelations: string;
  /** replays the relation narrative — the only sanctioned story reset (R7) */
  replayFlows: string;
  replayFlowsTitle: string;
  workCardAria: string;
  workEntryBadge: string;
  workOrder: (n: number, total: number) => string;
  workOutsideOrder: string;
  workOpenAria: (title: string) => string;
  fallbackSummary: (incoming: number, outgoing: number, undirected: number) => string;
  fallbackNodeAria: (name: string) => string;
  fallbackCenterAria: (name: string) => string;
  fallbackEdgeAria: (parties: string, type: string) => string;
  globeAria: string;

  detailAria: (name: string) => string;
  activeLabel: string;
  speculativeChip: string;
  imaginedPortrait: string;
  emblemPortrait: string;
  openProfile: string;
  miniStats: (relations: number, works: number) => string;
  onboardHint: string;
  closeDetail: string;
  whyImportant: string;
  whereToStart: string;
  readingDifficulty: string;
  majorWorks: string;
  worksHead: string;
  relationsHead: string;
  noRelations: string;
  influencedArrow: string;
  influencedByArrow: string;
  sourcesHead: string;
  compareOther: string;
  centerOnMap: string;
  difficultyAria: (v: number) => string;
  bornSuffix: (y: number) => string;

  filterAria: string;
  exploreHead: string;
  closePanel: string;
  toursHead: string;
  periodsHead: string;
  canonizing: string;
  genresHead: string;
  speculativeOnly: string;
  relationsLegendHead: string;
  legendNote: string;
  regionsHead: string;
  languagesHead: string;
  movementsHead: string;
  resetAll: string;

  compareAria: string;
  compareTitle: (a: string, b: string) => string;
  closeCompare: string;
  entryWork: string;
  difficultyShort: string;
  directRelations: string;
  noDirectRelations: string;
  shortestPathHead: string;
  noPath: string;

  relationDialogAria: string;
  close: string;
  weightTier: (tier: "strong" | "medium" | "light") => string;
  weightTitle: string;
  evidenceExplain: Record<EvidenceLevel, string>;

  tourAria: (title: string) => string;
  prev: string;
  next: string;
  autoplay: string;
  pause: string;
  autoplayTitle: string;
  exitTour: string;

  writersTitle: string;
  writersNote: (n: number) => string;
  writersSearchAria: string;
  writersSearchPlaceholder: string;
  colName: string;
  colOriginal: string;
  colLife: string;
  colAnchorYear: string;
  colPeriods: string;
  colRegionLang: string;
  colWorks: string;
  colWorksTitle: string;
  colDifficulty: string;
  colTier: string;
  colReview: string;
  noRows: string;
}

/** "229/263" when filtered, plain "263" when everything is shown */
const frac = (v: number, total: number): string => (v === total ? `${v}` : `${v}/${total}`);

const KO: UIStrings = {
  brand: "문학의 행성",
  brandSub: (a, aT, r, rT) => `작가 ${frac(a, aT)} · 관계 ${frac(r, rT)}`,
  brandSubAria: "현재 표시 중인 작가와 관계 수 (표시 중/전체)",
  brandSubTitle: (n) =>
    `필터가 표시 수를 결정합니다. 기본 보기에서는 대조·반대항 관계 ${n}개가 꺼져 있으며, 탐색·필터 패널에서 켤 수 있습니다.`,
  skipLink: "키보드로 탐색하기: 작가 목록 페이지로 이동",
  panelToggle: "탐색·필터",
  modeAria: "좌표계 선택",
  modeSemantic: "문학적 친연성",
  modeGeo: "실제 지리",
  navAria: "페이지",
  navMap: "지도",
  navWriters: "작가 목록",
  navMethodology: "방법론",
  localeAria: "언어 선택",

  searchAria: "작가 검색 — 한국어·원어·다른 표기 지원",
  searchPlaceholder: "작가 검색 (한국어·원어)",
  searchResultsAria: "검색 결과",

  compareHint: "비교할 두 번째 작가를 검색하거나 지도에서 선택하세요.",
  cancel: "취소",

  allYears: "전체 시기",
  upToYear: (y) => `${y}년까지`,
  activeInYear: (y) => `${y}년 활동`,
  yearModeAria: "연대 보기 방식",
  cumulative: "누적",
  cumulativeTitle: "선택 연도까지 등장한 작가를 누적해 보여줍니다",
  activeMode: "당시 활동",
  activeTitle: "선택 연도에 활동 중이던 작가만 보여줍니다",
  yearSliderAria: "연대 슬라이더",
  viewControlsAria: "화면 제어",
  zoomIn: "확대",
  zoomOut: "축소",
  resetView: "초기화",

  webglTitle: "3차원 지도를 사용할 수 없는 환경입니다",
  webglNote:
    "WebGL 없이 동작하는 2차원 관계 지도로 표시합니다. 검색·필터·타임라인·프로필·비교는 동일하게 동작하며, 확대·좌표계 전환 같은 지구본 전용 조작만 빠집니다.",
  fallbackPickHint: "작가를 선택하면 그 작가를 중심으로 한 관계망이 여기에 표시됩니다.",
  fallbackEgoAria: (name) => `${name} 중심의 관계망`,
  fallbackShowAll: "전체 작가 보기",
  legendTitle: "범례",
  legendCoord: (modeLabel) => `좌표: ${modeLabel}`,
  legendTerrain:
    "영토 면적(전체 시기 도판) = 편집 위계(1차) · 전체 관계 밀도 ±30% 보정 — 높이 없음(평면 도판) · 도시 링 = 권장 읽기 순서(◆ 항구 = 입문작) — 방법론 참조",
  legendTerrainTitle:
    "면적 공식: tierBase(anchor 2.4 · major 1.0 · context 0.55) × (1 + 0.3 × 정규화 관계 차수) — territory.v1 헤더가 정본. 하이트맵·릴리프 없음(아트 테제 §높이 금지).",
  legendEra:
    "연도 페이더 = 판구조(계산치): 1850–2000 사이 8개 키프레임을 지나며 면적·해안선이 자란다 — 건국 램프 + 그 연도까지의 수록 작품 출간 비중. 국가 상태: 미형성 유령 → 형성 → 활동 → 유산 파티나 · 도시는 출간년에 창건 · 전체 시기 = 동결 도판 그대로",
  legendEraTitle:
    "성장 공식: g = 0.06 + 0.94 × (0.5 × 건국 램프[활동 시작 ±5년] + 0.5 × 수록 작품 출간 비중) — territory.v1.eras.json params가 정본. '수록 작품'은 선별 대표작 기준(전작 아님) — 측정이 아니라 편집적 애니메이션.",
  legendUnion:
    "사조 = 연합(조약) — 가맹 영토 안쪽 세선, 중경에서 표시. ≈ 기간은 코퍼스 수록 가맹 작가들의 활동 중첩에서 계산한 값(역사적 존속 기간 아님). 땅의 소유자는 언제나 작가.",
  clusterMore: (n) => `+${n}`,
  clusterAria: (name, n) => `${name} 부근의 작가 ${n}명 목록 열기`,
  clusterListAria: "이 지점의 작가들",
  clusterNote: "화면상 가까워 묶인 표시입니다 — 같은 도시라는 뜻이 아니며, 정확한 좌표는 데이터에 보존됩니다.",
  legendSecRelations: "관계",
  legendSecTerritory: "영토",
  legendSecTime: "시간",
  legendSecUnion: "조약·항로",
  eraBadgeUnformed: "이 연도에는 미형성",
  eraBadgeForming: "이 연도에는 형성 중",
  eraBadgeHeritage: "이 연도에는 유산",
  eraBadgeInactive: "이 연도에는 활동 밖",
  eraBadgeTitle:
    "연도 페이더 기준의 주권 상태입니다. 선택은 유지됩니다 — 전체 시기로 돌리면 사라집니다.",
  eraPreparing: "시간 지도 준비 중…",
  legendRoutes:
    "지리 항로 = 지역·군집 사이 관계 개수 집계(계산치·무방향, 짙을수록 많음) — 개별 관계는 작가를 선택하면 펼쳐진다",
  mapRelationsCapped: (shown, total) => `지도에 관계 ${shown}/${total}개 표시`,
  showAllRelations: "모두 보기",
  replayFlows: "다시 재생",
  replayFlowsTitle: "관계 흐름 연출을 처음부터 다시 재생합니다",
  legendOff: "탐색·필터에서 꺼진 유형",
  workCardAria: "작품 카드",
  workEntryBadge: "입문작 — 여기서 시작",
  workOrder: (n, total) => `권장 읽기 순서 ${n}/${total}`,
  workOutsideOrder: "권장 순서 밖의 작품",
  workOpenAria: (title) => `작품 카드 열기: ${title}`,
  fallbackSummary: (i, o, u) => `들어오는 관계 ${i} · 나가는 관계 ${o} · 무방향 ${u}`,
  fallbackNodeAria: (name) => `${name}(으)로 이동`,
  fallbackCenterAria: (name) => `${name} 프로필 열기`,
  fallbackEdgeAria: (parties, type) => `근거 열기: ${parties} · ${type}`,
  globeAria:
    "문학의 행성 3차원 지도. 드래그로 회전, 휠·핀치로 확대. 키보드 탐색은 작가 목록 페이지를 이용하세요.",

  detailAria: (name) => `${name} 상세 정보`,
  activeLabel: "활동",
  speculativeChip: "사변·SF",
  imaginedPortrait: "상상 초상",
  emblemPortrait: "상징 정물",
  openProfile: "상세 프로필",
  miniStats: (r, w) => `관계 ${r} · 작품 ${w}`,
  onboardHint: "별을 클릭하면 그 작가의 성좌가 떠오르고, 선 위에 올리면 관계가 읽힙니다",
  closeDetail: "상세 패널 닫기",
  whyImportant: "왜 중요한가",
  whereToStart: "어디서부터 읽을까",
  readingDifficulty: "독서 난도",
  majorWorks: "대표작",
  worksHead: "작품",
  relationsHead: "관계",
  noRelations: "아직 기록된 관계가 없습니다. 관계 데이터는 단계적으로 채워지고 있습니다.",
  influencedArrow: "→ 영향을 준 작가",
  influencedByArrow: "← 영향을 받은 원천",
  sourcesHead: "근거 출처",
  compareOther: "다른 작가와 비교",
  centerOnMap: "지도 중앙으로",
  difficultyAria: (v) => `독서 난도 5점 중 ${v}점`,
  bornSuffix: (y) => `${y}년생`,

  filterAria: "탐색과 필터",
  exploreHead: "탐색",
  closePanel: "패널 닫기",
  toursHead: "안내 여정",
  periodsHead: "시대층",
  canonizing: "정전화 진행 중",
  genresHead: "장르층",
  speculativeOnly: "사변소설·SF 계보만",
  relationsLegendHead: "관계 유형 · 범례",
  legendNote:
    "실선 = 확인된 관계, 점선 = 친연성·대조(편집적 판단 포함). 선을 클릭하면 근거를 보여줍니다.",
  regionsHead: "지역",
  languagesHead: "언어",
  movementsHead: "문학운동",
  resetAll: "보기 초기화",

  compareAria: "작가 비교",
  compareTitle: (a, b) => `${a} · ${b} 비교`,
  closeCompare: "비교 닫기",
  entryWork: "입문작",
  difficultyShort: "난도",
  directRelations: "두 작가 사이의 기록된 관계",
  noDirectRelations: "직접 기록된 관계는 없습니다.",
  shortestPathHead: "최단 관계 경로",
  noPath: "현재 데이터에서 두 작가를 잇는 경로가 없습니다.",

  relationDialogAria: "관계 설명",
  close: "닫기",
  weightTier: (tier) =>
    `지도 가중치: ${tier === "strong" ? "강함" : tier === "medium" ? "중간" : "낮음"}`,
  weightTitle:
    "근거 수준 대역 안에서 부여한 편집 값 — 좌표 인력과 선 강조에 쓰입니다. 측정된 영향력 수치가 아닙니다 (방법론 참조).",
  evidenceExplain: {
    documented: "서신·인터뷰·번역·회고록 같은 1차 기록으로 확인되는 관계입니다.",
    scholarly_consensus: "신뢰할 만한 2차 연구가 반복적으로 다뤄 온 계보입니다.",
    editorial_inference:
      "직접 접촉의 기록은 없습니다. 형식·주제의 친연성을 근거로 이 지도가 가까이 놓은, 편집적 판단이 포함된 관계입니다."
  },

  tourAria: (title) => `안내 여정: ${title}`,
  prev: "이전",
  next: "다음",
  autoplay: "자동 진행",
  pause: "일시정지",
  autoplayTitle: "9초 간격으로 자동 진행",
  exitTour: "자유 탐색으로",

  writersTitle: "작가 목록",
  writersNote: (n) =>
    `지도의 필터가 이 목록에도 적용됩니다. 현재 ${n}명 표시 중. 행을 선택하면 지도의 해당 위치로 이동합니다.`,
  writersSearchAria: "목록에서 작가 검색",
  writersSearchPlaceholder: "이름·표기 검색",
  colName: "이름",
  colOriginal: "원어 표기",
  colLife: "생몰",
  colAnchorYear: "중심 연도",
  colPeriods: "시대층",
  colRegionLang: "지역 · 언어",
  colWorks: "대표작",
  colWorksTitle: "편집 선정 대표작 — 첫 항목이 권장 입문작입니다 (수록 순서가 아니라 큐레이션 순서)",
  colDifficulty: "난도",
  colTier: "구분",
  colReview: "검토",
  noRows: "조건에 맞는 작가가 없습니다. 필터를 완화하거나 검색어를 바꿔 보세요."
};

const EN: UIStrings = {
  brand: "Literary Planet",
  brandSub: (a, aT, r, rT) => `${frac(a, aT)} writers · ${frac(r, rT)} relations`,
  brandSubAria: "Writers and relations currently shown (shown/total)",
  brandSubTitle: (n) =>
    `Filters decide these counts. The default view keeps ${n} contrast relations off — enable them in the explore panel.`,
  skipLink: "Keyboard navigation: go to the writers list",
  panelToggle: "Explore & filter",
  modeAria: "Coordinate system",
  modeSemantic: "Literary affinity",
  modeGeo: "Real geography",
  navAria: "Pages",
  navMap: "Map",
  navWriters: "Writers",
  navMethodology: "Methodology",
  localeAria: "Language",

  searchAria: "Search writers — Korean, original script, and other spellings",
  searchPlaceholder: "Search writers",
  searchResultsAria: "Search results",

  compareHint: "Search or pick a second writer on the map to compare.",
  cancel: "Cancel",

  allYears: "All years",
  upToYear: (y) => `Up to ${y}`,
  activeInYear: (y) => `Active in ${y}`,
  yearModeAria: "Timeline mode",
  cumulative: "Cumulative",
  cumulativeTitle: "Show every writer who has appeared up to the chosen year",
  activeMode: "Active then",
  activeTitle: "Show only writers active in the chosen year",
  yearSliderAria: "Year slider",
  viewControlsAria: "View controls",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resetView: "Reset",

  webglTitle: "3D map unavailable in this environment",
  webglNote:
    "Showing the 2D relation map that works without WebGL. Search, filters, timeline, profiles, and comparison all work the same — only globe-specific controls (zoom, coordinate modes) are absent.",
  fallbackPickHint: "Select a writer to see their relation web here.",
  fallbackEgoAria: (name) => `Relation web centered on ${name}`,
  fallbackShowAll: "Show all writers",
  legendTitle: "Legend",
  legendCoord: (modeLabel) => `Coordinates: ${modeLabel}`,
  legendTerrain:
    "Territory area (all-years plate) = editorial tier (primary) · ±30% all-relation-density modulation — no elevation (flat plate) · town ring = curated reading order (◆ harbor = entry work) — see Methodology",
  legendTerrainTitle:
    "Area formula: tierBase(anchor 2.4 · major 1.0 · context 0.55) × (1 + 0.3 × normalized relation degree) — territory.v1 header is authoritative. No heightmap or relief (art thesis: height ban).",
  legendEra:
    "Year fader = tectonics (computed): area and coastline grow through 8 keyframes, 1850–2000 — founding ramp + the share of collected works published by that year. Nation states: unformed ghost → founding → active → heritage patina · towns founded at publication · all years = the frozen plate untouched",
  legendEraTitle:
    "Growth formula: g = 0.06 + 0.94 × (0.5 × founding ramp [active start ±5y] + 0.5 × collected-works share) — territory.v1.eras.json params are authoritative. 'Collected works' = the curated corpus, not a bibliography — an editorial animation, not a measurement.",
  legendUnion:
    "Movements = unions (treaties) — thin lines inside member coastlines, shown at mid zoom. The ≈ span is computed from member writers' active-range overlap in this corpus (not a historical period). The land always belongs to the writer.",
  clusterMore: (n) => `+${n}`,
  clusterAria: (name, n) => `Open the list of ${n} writers near ${name}`,
  clusterListAria: "Writers at this point",
  clusterNote: "Grouped because they sit close on screen — not the same city; exact coordinates are preserved in the data.",
  legendSecRelations: "Relations",
  legendSecTerritory: "Territory",
  legendSecTime: "Time",
  legendSecUnion: "Treaties · routes",
  eraBadgeUnformed: "Unformed in this year",
  eraBadgeForming: "Founding in this year",
  eraBadgeHeritage: "Heritage in this year",
  eraBadgeInactive: "Outside active years",
  eraBadgeTitle:
    "Sovereignty state at the year fader's position. The selection is kept — return to all years and this disappears.",
  eraPreparing: "Preparing the time atlas…",
  legendRoutes:
    "Geo routes = computed counts of relations between regions/clusters (undirected; darker = more) — individual relations unfold when a writer is selected",
  mapRelationsCapped: (shown, total) => `Showing ${shown}/${total} relations on the map`,
  showAllRelations: "Show all",
  replayFlows: "Replay",
  replayFlowsTitle: "Replay the relation flow narrative from the start",
  legendOff: "Switched off in Explore/Filter",
  workCardAria: "Work card",
  workEntryBadge: "Entry work — start here",
  workOrder: (n, total) => `Curated reading order ${n}/${total}`,
  workOutsideOrder: "Outside the curated order",
  workOpenAria: (title) => `Open work card: ${title}`,
  fallbackSummary: (i, o, u) => `Incoming ${i} · outgoing ${o} · undirected ${u}`,
  fallbackNodeAria: (name) => `Travel to ${name}`,
  fallbackCenterAria: (name) => `Open ${name}'s profile`,
  fallbackEdgeAria: (parties, type) => `Open evidence: ${parties} · ${type}`,
  globeAria:
    "Literary Planet 3D map. Drag to rotate, wheel or pinch to zoom. For keyboard navigation use the writers list.",

  detailAria: (name) => `Details for ${name}`,
  activeLabel: "active",
  speculativeChip: "Speculative / SF",
  imaginedPortrait: "Imagined portrait",
  emblemPortrait: "Emblematic still life",
  openProfile: "Full profile",
  miniStats: (r, w) => `${r} relations · ${w} works`,
  onboardHint: "Click a star to raise its constellation; rest on a line to read the bond",
  closeDetail: "Close detail panel",
  whyImportant: "Why they matter",
  whereToStart: "Where to start",
  readingDifficulty: "Reading difficulty",
  majorWorks: "Major works",
  worksHead: "Works",
  relationsHead: "Relations",
  noRelations: "No relations recorded yet. Relation data is being filled in stages.",
  influencedArrow: "→ influenced",
  influencedByArrow: "← drew from",
  sourcesHead: "Sources",
  compareOther: "Compare with another writer",
  centerOnMap: "Center on map",
  difficultyAria: (v) => `Reading difficulty ${v} of 5`,
  bornSuffix: (y) => `b. ${y}`,

  filterAria: "Explore and filter",
  exploreHead: "Explore",
  closePanel: "Close panel",
  toursHead: "Guided tours",
  periodsHead: "Period layers",
  canonizing: "still being canonized",
  genresHead: "Genre layers",
  speculativeOnly: "Speculative / SF lineage only",
  relationsLegendHead: "Relation types · legend",
  legendNote:
    "Solid = confirmed relations, dashed = affinity/contrast (includes editorial judgment). Click a line to see its evidence.",
  regionsHead: "Regions",
  languagesHead: "Languages",
  movementsHead: "Movements",
  resetAll: "Reset view",

  compareAria: "Compare writers",
  compareTitle: (a, b) => `${a} · ${b}`,
  closeCompare: "Close comparison",
  entryWork: "Entry point",
  difficultyShort: "Difficulty",
  directRelations: "Recorded relations between the two",
  noDirectRelations: "No direct relation on record.",
  shortestPathHead: "Shortest relation path",
  noPath: "No path connects these two writers in the current data.",

  relationDialogAria: "Relation details",
  close: "Close",
  weightTier: (tier) =>
    `Map weight: ${tier === "strong" ? "strong" : tier === "medium" ? "medium" : "light"}`,
  weightTitle:
    "An editorial value within evidence-level bands, used for layout attraction and line emphasis. Not a measured influence score (see Methodology).",
  evidenceExplain: {
    documented:
      "Confirmed by primary records — letters, interviews, translations, memoirs.",
    scholarly_consensus: "A lineage that reliable secondary scholarship keeps returning to.",
    editorial_inference:
      "No record of direct contact. Placed close by this map on grounds of formal and thematic affinity — an editorial judgment."
  },

  tourAria: (title) => `Guided tour: ${title}`,
  prev: "Previous",
  next: "Next",
  autoplay: "Autoplay",
  pause: "Pause",
  autoplayTitle: "Advance automatically every 9 seconds",
  exitTour: "Back to free exploration",

  writersTitle: "Writers",
  writersNote: (n) =>
    `The map's filters apply to this list too. Showing ${n} writers. Selecting a row jumps to their place on the map.`,
  writersSearchAria: "Search within the list",
  writersSearchPlaceholder: "Search by name or spelling",
  colName: "Name",
  colOriginal: "Original",
  colLife: "Lived",
  colAnchorYear: "Anchor year",
  colPeriods: "Periods",
  colRegionLang: "Region · language",
  colWorks: "Major works",
  colWorksTitle:
    "Editorially selected major works — the first item is the recommended entry point (curated order, not file order)",
  colDifficulty: "Difficulty",
  colTier: "Tier",
  colReview: "Review",
  noRows: "No writers match. Loosen the filters or change the search."
};

export const UI: Record<Locale, UIStrings> = { ko: KO, en: EN };

// ---------------------------------------------------------------------------
// Registry label helpers
// ---------------------------------------------------------------------------

const periodById = new Map(PERIOD_DEFS.map((p) => [p.id, p]));
const genreById = new Map(GENRE_DEFS.map((g) => [g.id, g]));
const relationById = new Map(RELATION_DEFS.map((r) => [r.id, r]));
const regionById = new Map(REGION_DEFS.map((r) => [r.id, r]));

export function periodLabel(id: PeriodId, locale: Locale): string {
  const d = periodById.get(id);
  return d ? (locale === "ko" ? d.ko : d.en) : id;
}
export function periodShort(id: PeriodId, locale: Locale): string {
  const d = periodById.get(id);
  return d ? (locale === "ko" ? d.shortKo : d.shortEn) : id;
}
export function periodDesc(id: PeriodId, locale: Locale): string {
  const d = periodById.get(id);
  return d ? (locale === "ko" ? d.description : d.descriptionEn) : "";
}
export function genreLabel(id: GenreId, locale: Locale): string {
  const d = genreById.get(id);
  return d ? (locale === "ko" ? d.ko : d.en) : id;
}
export function relationTypeLabel(id: RelationType, locale: Locale): string {
  const d = relationById.get(id);
  return d ? (locale === "ko" ? d.ko : d.en) : id;
}
export function relationTypeShort(id: RelationType, locale: Locale): string {
  const d = relationById.get(id);
  return d ? (locale === "ko" ? d.short : d.shortEn) : id;
}
export function relationTypeDesc(id: RelationType, locale: Locale): string {
  const d = relationById.get(id);
  return d ? (locale === "ko" ? d.description : d.descriptionEn) : "";
}
export function regionLabel(id: string, locale: Locale): string {
  const d = regionById.get(id);
  return d ? (locale === "ko" ? d.ko : d.en) : id;
}
export function languageLabel(code: string, locale: Locale): string {
  return (locale === "ko" ? LANGUAGE_LABELS : LANGUAGE_LABELS_EN)[code] ?? code;
}
export function evidenceLabel(level: EvidenceLevel, locale: Locale): string {
  return (locale === "ko" ? EVIDENCE_LEVEL_KO : EVIDENCE_LEVEL_EN)[level];
}
export function reviewLabel(status: ReviewStatus, locale: Locale): string {
  return (locale === "ko" ? REVIEW_STATUS_KO : REVIEW_STATUS_EN)[status];
}
export function genderLabel(g: Gender, locale: Locale): string {
  return (locale === "ko" ? GENDER_KO : GENDER_EN)[g];
}
export function tierLabel(tier: Tier, locale: Locale): string {
  return TIER_LABELS[locale][tier];
}

// ---------------------------------------------------------------------------
// Editorial content access — locale pack with honest fallback to the source
// locale (ko). A shipped locale is validated 100% complete, so fallback only
// matters for future in-progress locales.
// ---------------------------------------------------------------------------

export interface ContentAccess {
  locale: Locale;
  authorName(a: Author): string;
  /** the secondary line under the name: original script (+ Korean form in EN) */
  authorAltNames(a: Author): string[];
  authorField(
    a: Author,
    field:
      | "importanceReason"
      | "readingEntryReason"
      | "readingWarning"
      | "difficultyReason"
      | "worksException"
  ): string | undefined;
  workTitle(w: Work): string;
  workSignificance(w: Work): string;
  relationSummary(r: Relation): string;
  movementName(m: Movement): string;
  movementDesc(m: Movement): string;
  tourTitle(t: Tour): string;
  tourDesc(t: Tour): string;
  tourStopNote(t: Tour, index: number): string;
}

interface PackIndex {
  authors: Map<string, LocalePack["authors"][number]>;
  works: Map<string, LocalePack["works"][number]>;
  relations: Map<string, LocalePack["relations"][number]>;
  movements: Map<string, LocalePack["movements"][number]>;
  tours: Map<string, LocalePack["tours"][number]>;
}

function indexPack(pack: LocalePack | undefined): PackIndex {
  return {
    authors: new Map((pack?.authors ?? []).map((x) => [x.id, x])),
    works: new Map((pack?.works ?? []).map((x) => [x.id, x])),
    relations: new Map((pack?.relations ?? []).map((x) => [x.id, x])),
    movements: new Map((pack?.movements ?? []).map((x) => [x.id, x])),
    tours: new Map((pack?.tours ?? []).map((x) => [x.id, x]))
  };
}

export function buildContentAccess(dataset: Dataset, locale: Locale): ContentAccess {
  const pack =
    locale === DEFAULT_LOCALE
      ? undefined
      : dataset.translations.find((p) => p.locale === locale);
  const idx = indexPack(pack);
  const isDefault = locale === DEFAULT_LOCALE;

  return {
    locale,
    authorName(a) {
      if (isDefault) return a.names.ko;
      return idx.authors.get(a.id)?.name ?? a.names.original;
    },
    authorAltNames(a) {
      if (isDefault) {
        return [a.names.original, ...a.names.aliases];
      }
      const name = this.authorName(a);
      const alts: string[] = [];
      if (a.names.original !== name) alts.push(a.names.original);
      alts.push(a.names.ko);
      const packAliases = idx.authors.get(a.id)?.aliases;
      for (const al of packAliases ?? a.names.aliases) {
        if (al !== name && !alts.includes(al)) alts.push(al);
      }
      return alts;
    },
    authorField(a, field) {
      if (!isDefault) {
        const ta = idx.authors.get(a.id);
        if (ta) {
          const v = ta[field];
          if (v !== undefined) return v;
          // optional fields mirror the source: absent there means absent here
          if (field === "readingWarning" || field === "worksException")
            return a[field] === undefined ? undefined : a[field];
        }
      }
      return a[field];
    },
    workTitle(w) {
      if (isDefault) return w.titleKo;
      return idx.works.get(w.id)?.title ?? w.titleOriginal;
    },
    workSignificance(w) {
      if (isDefault) return w.significance;
      return idx.works.get(w.id)?.significance ?? w.significance;
    },
    relationSummary(r) {
      if (isDefault) return r.summary;
      return idx.relations.get(r.id)?.summary ?? r.summary;
    },
    movementName(m) {
      if (isDefault) return m.ko;
      return idx.movements.get(m.id)?.name ?? m.original ?? m.ko;
    },
    movementDesc(m) {
      if (isDefault) return m.description;
      return idx.movements.get(m.id)?.description ?? m.description;
    },
    tourTitle(t) {
      if (isDefault) return t.title;
      return idx.tours.get(t.id)?.title ?? t.title;
    },
    tourDesc(t) {
      if (isDefault) return t.description;
      return idx.tours.get(t.id)?.description ?? t.description;
    },
    tourStopNote(t, index) {
      if (!isDefault) {
        const note = idx.tours.get(t.id)?.stopNotes[index];
        if (note !== undefined) return note;
      }
      return t.stops[index]?.note ?? "";
    }
  };
}

/** search forms contributed by translation packs (names + aliases, all locales) */
export function translationSearchForms(dataset: Dataset): Map<string, string[]> {
  const extra = new Map<string, string[]>();
  for (const pack of dataset.translations) {
    for (const ta of pack.authors) {
      const list = extra.get(ta.id) ?? [];
      list.push(ta.name, ...(ta.aliases ?? []));
      extra.set(ta.id, list);
    }
  }
  return extra;
}
