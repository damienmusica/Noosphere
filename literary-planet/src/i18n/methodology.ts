// Methodology-page prose in both locales. This is identity text — maintained
// by hand, not by the translation generation wave.

import type { Locale } from "./index.ts";

export interface MethodologyStrings {
  title: string;
  lede: { pre: (a: number, w: number, r: number) => string; strong: string; post: string };

  eraHead: string;
  eraBody: string;

  selHead: string;
  selItems: string[];
  selClose: string;

  relHead: string;
  relBody: { pre: string; strong: string };
  relClose: { pre: string; post: string };
  relWeight: string;

  coordHead: string;
  coord: {
    semStrong: string;
    semBody: (version: string, seed: number) => string;
    geoStrong: string;
    geoBody: string;
    terrainStrong: string;
    terrainBody: string;
  };

  srcHead: string;
  srcBody: { pre: string; mid1: string; mid2: string; post: string };
  srcPortrait: { strong: string; body: string };
  countAuthors: (n: number) => string;
  countRels: (n: number) => string;
  relRowPrefix: string;

  distHead: string;
  distBody: string;
  distTitles: {
    regions: string;
    languages: string;
    gender: string;
    genres: string;
    periods: string;
    relTypes: string;
  };

  logHead: string;
  logV01: (a: number, w: number, r: number, version: string) => string;
  closing: { pre: string; strong: string; mid: string; em: string };
}

const KO: MethodologyStrings = {
  title: "방법론 — 이 지도는 어떻게 만들어졌나",
  lede: {
    pre: (a, w, r) =>
      `《문학의 행성》은 20세기 세계문학의 작가 ${a}명, 작품 ${w}편, 관계 ${r}개를 회전하는 구면 위에 배치한 독서·연구 도구다. 여기 실린 정전(canon)은 `,
    strong: "객관적 진리가 아니라 편집 가능한 지도",
    post: "다 — 아래에 그 편집의 규칙과 한계를 공개한다."
  },

  eraHead: "시대 범위와 층 구조",
  eraBody:
    "중심 범위는 20세기다. '20세기 작가'를 출생연도로 기계적으로 자르지 않고 주요 작품 발표 시기·활동 시기·후대 영향으로 판단했으며, 시간층은 실제 문학사처럼 의도적으로 겹치게 설계했다. '20세기'라는 시간 필터와 '모더니즘'이라는 미학·운동 필터는 별개 축이며 별개 필터로 제공된다.",

  selHead: "선정 기준",
  selItems: [
    "형식적 혁신 — 서사·시·극의 문법 자체를 바꾸었는가.",
    "후대 작가와 다른 언어권에 미친 확인 가능한 영향.",
    "시대·지역·언어권을 대표하면서 내부의 복잡성을 보여주는가.",
    "번역·잡지·비평을 통한 문학권 사이의 매개 역할.",
    "지속적인 재독과 비평적 논쟁의 대상인가.",
    "서구 중심 정전에서 배제되어 온 전통의 복원 필요.",
    "판매량·수상 경력만으로는 선정하지 않았다."
  ],
  selClose:
    "초기 코퍼스 100명은 위 기준으로 고른 필수 검토 목록이며, 확장 슬레이트(발저, 츠바이크, 레비, 먼로, 파묵, 무라카미 등)는 다음 판에서 같은 기준으로 검토된다.",

  relHead: "관계 유형과 근거 수준",
  relBody: {
    pre: "모든 관계선은 세 가지 근거 수준 중 하나를 명시한다. 이 구분을 섞는 것이 이런 지도의 가장 흔한 부정직함이므로, 기계 검증이 이를 강제한다: ",
    strong: "직접 영향·번역·사사 관계는 출처 없이 저장될 수 없다."
  },
  relClose: {
    pre: "'카프카와 베케트가 비슷하다'는 것만으로는 영향 관계가 되지 않는다 — 그런 관계는 ",
    post: "로 점선 표시된다. 관계 수는 작가마다 다르며, 억지로 균등하게 만들지 않았다."
  },
  relWeight:
    "관계 카드의 '지도 가중치'는 측정된 영향력 수치가 아니다. 근거 수준별 대역(문서 확인 0.70–0.95 · 학술 합의 0.50–0.75 · 편집 추정 0.30–0.55) 안에서 편집자가 부여한 값으로, 좌표 계산의 인력과 관계선의 강조에만 쓰인다. 그래서 카드에는 백분율 대신 강함·중간·낮음의 정성 단계로 표시한다.",

  coordHead: "좌표 계산 방식",
  coord: {
    semStrong: "문학적 친연성 모드",
    semBody: (version, seed) =>
      `의 좌표는 관계 그래프(유형별 가중치)와 운동·시대 태그로부터 시드 고정 구면 force-directed 배치로 계산한다. 같은 데이터와 시드에서는 항상 같은 좌표가 나오며(결정성 테스트로 보증), 계산된 좌표는 버전과 함께 동결된다(현재 v${version}, seed ${seed}). 새 작가가 추가되어도 기존 좌표는 재계산하지 않고, 이웃 앵커의 가중 중심으로 증분 배치한다 — 사용자의 공간 기억을 보존하기 위해서다. `,
    geoStrong: "실제 지리 모드",
    geoBody:
      "는 작가의 대표 활동지 경위도를 쓰되, 도시가 밀집한 지역(예: 중부유럽)에서는 겹친 점이 읽히도록 결정적 최소 변위를 적용한다 — 지도학의 표준적 displacement 관행이며, 정확한 좌표는 데이터 파일에 보존된다. 두 모드의 분리가 이 지도의 핵심 주장이다: 문학적 거리는 지리적 거리가 아니다.",
    terrainStrong: "친연성 모드의 지형",
    terrainBody:
      "은 실제 지구가 아니다. 전체 시기 도판에서 각 작가 영토의 면적은 편집 tier(anchor 2.4 : major 1.0 : context 0.55)가 1차로 정하고 관계 밀도가 ±30% 안에서 변조하며, 해안선은 시드 고정 노이즈가 새긴다(시드·파라미터의 정본은 territory.v1.json 헤더). 대륙과 섬, 두 극관까지 모두 친연성 배치의 산물이며 어떤 실존 국경·지형과도 무관하다. 연도 페이더는 판구조를 움직인다: 행성은 1850–2000의 8개 키프레임(정본 territory.v1.eras.json)을 지나며 자라고, 각 국가는 최종 영토의 핵심부터 g = 0.06 + 0.94 × (0.5 × 건국 램프[활동 시작 ±5년] + 0.5 × 그 연도까지의 수록 작품 출간 비중) 만큼만 융기해 있다. 여기서 '수록 작품'은 전작 목록이 아니라 이 코퍼스에 선별된 대표작이다 — 시대별 면적·해안선은 측정된 창작량이 아니라 큐레이션에서 계산된 편집적 애니메이션이다. 한 번 융기한 땅은 가라앉지도, 소유자가 바뀌지도 않는다. 미래의 작가도 1850년부터 배아 섬으로 존재한다 — 위치와 방향(주소)은 처음부터 예고되고, 면적만 시간을 따라온다. 그 위에서 주권 상태(미형성 유령 → 형성 → 활동 → 유산 파티나)와 사조 연합의 조약 잉크가 크로스페이드되고, 도시(작품)는 출간년에 창건된다. 페이더를 전체 시기에 두면 이 층 전체가 우회되어 동결 도판과 비트 단위로 같다 — 접속할 때마다 같은 행성이다. 사조는 땅을 소유하지 않는 조약 오버레이다 — 땅의 소유자는 언제나 작가이며, 화면의 조약 기간(≈ 표기)은 역사 기록이 아니라 코퍼스 수록 가맹 작가들의 활동 중첩에서 계산된 값이다."
  },

  srcHead: "데이터 출처와 검토 상태",
  srcBody: {
    pre: "프로필 초안은 LLM(유지관리자 대화형 사용)이 작성하고, 기계 검증(스키마·교차 참조·연도 논리) → Wikidata 생몰년 교차확인 → 편집 정독 샘플링을 통과한 배치가 ",
    mid1: " 상태가 된다. ",
    mid2: "는 외부 검증 절차가 갖춰질 때까지 부여하지 않는다.",
    post: " 출처는 확인 가능한 기관·문헌만 기록하며, 검증되지 않은 딥 링크는 기록하지 않는다. 번역 제목은 출판사마다 다를 수 있어 항상 원제를 병기한다."
  },
  srcPortrait: {
    strong: "작가 도판",
    body: "은 사진이 아니라 생성된 동판화풍 상상 도판이며, 모든 도판에 '상상 초상' 또는 '상징 정물' 라벨이 붙는다. 얼굴은 도상원이 퍼블릭 도메인이거나 일반 인상만으로 그릴 수 있는 작고한 작가에 한하고, 특정 사진의 구도는 복제하지 않는다. 생존 작가는 얼굴 대신 작품 속 상징물(예: 자정의 회중시계와 처트니 단지)로 표상한다. 원 자산은 회색조로만 반입되어 앱이 판의 듀오톤으로 입히며, 생성 프롬프트·시드·모티프 근거는 portraits.json에 기록된다."
  },
  countAuthors: (n) => `${n}명`,
  countRels: (n) => `${n}개`,
  relRowPrefix: "관계: ",

  distHead: "분포 — 이 지도의 편중을 숫자로 공개한다",
  distBody:
    "어떤 정전도 중립적이지 않다. 아래 수치는 이 지도가 현재 무엇을 과대·과소 대표하는지 보여준다. 편중의 축소는 다음 확장의 명시적 목표다. 작가 한 명이 여러 지역·언어·장르·시대층에 동시에 속할 수 있으므로, 각 표의 백분율 합계는 100%를 넘을 수 있다.",
  distTitles: {
    regions: "지역",
    languages: "언어",
    gender: "젠더",
    genres: "장르",
    periods: "시대층",
    relTypes: "관계 유형"
  },

  logHead: "변경 기록",
  logV01: (a, w, r, version) =>
    `v0.1 (2026-08) — 최초 공개 코퍼스: 작가 ${a}명 · 작품 ${w}편 · 관계 ${r}개 · 좌표 v${version}.`,
  closing: {
    pre: "이 프로젝트는 지식 아틀라스 Noosphere 항성계의 ",
    strong: "제1행성",
    mid: "('Booksphere' 계보)이며, 같은 원칙을 상속한다: ",
    em: "담론의 상태를 기록하되, 판정하지 않는다."
  }
};

const EN: MethodologyStrings = {
  title: "Methodology — how this map was made",
  lede: {
    pre: (a, w, r) =>
      `Literary Planet is a reading and research instrument that places ${a} writers, ${w} works, and ${r} relations of 20th-century world literature on a rotating sphere. The canon presented here is `,
    strong: "not an objective truth but an editable map",
    post: " — the rules and limits of that editing are published below."
  },

  eraHead: "Time range and layered periods",
  eraBody:
    "The core range is the 20th century. Writers were not cut mechanically by birth year; we judged by when their major works appeared, when they were active, and how they influenced what came after. The period layers deliberately overlap, as real literary history does. 'The 20th century' (a time filter) and 'modernism' (an aesthetic-movement filter) are separate axes, offered as separate filters.",

  selHead: "Selection criteria",
  selItems: [
    "Formal innovation — did they change the grammar of narrative, poetry, or drama itself?",
    "Verifiable influence on later writers and on other language spheres.",
    "Representing an era, region, or language while showing its internal complexity.",
    "Mediating between literary spheres through translation, magazines, criticism.",
    "Remaining an object of sustained rereading and critical argument.",
    "The need to restore traditions excluded from the Western-centric canon.",
    "Sales and prizes alone selected no one."
  ],
  selClose:
    "The initial corpus of 100 is a required-review list chosen by these criteria; the expansion slate (Walser, Zweig, Levi, Munro, Pamuk, Murakami and others) will be reviewed by the same criteria in the next edition.",

  relHead: "Relation types and evidence levels",
  relBody: {
    pre: "Every relation line declares one of three evidence levels. Mixing them is the most common dishonesty in maps like this, so machine validation enforces the boundary: ",
    strong: "direct influence, translation, and mentorship cannot be stored without a source."
  },
  relClose: {
    pre: "'Kafka and Beckett feel similar' does not make an influence claim — such relations are drawn as dashed lines marked ",
    post: ". Relation counts differ between writers, and we did not force them to be equal."
  },
  relWeight:
    "The 'map weight' on a relation card is not a measured strength of influence. It is an editorial value assigned within evidence-level bands (documented 0.70–0.95 · scholarly consensus 0.50–0.75 · editorial inference 0.30–0.55), used only for layout attraction and line emphasis. That is why the card shows a qualitative tier — strong, medium, light — instead of a percentage.",

  coordHead: "How coordinates are computed",
  coord: {
    semStrong: "Literary-affinity mode",
    semBody: (version, seed) =>
      ` computes its coordinates from the relation graph (weighted by type) and movement/period tags, with a seed-fixed spherical force-directed layout. The same data and seed always produce the same coordinates (guaranteed by determinism tests), and the computed layout is frozen with a version (currently v${version}, seed ${seed}). When new writers are added, existing coordinates are never recomputed; newcomers are placed incrementally at the weighted center of their neighbors — to preserve the reader's spatial memory. `,
    geoStrong: "Real-geography mode",
    geoBody:
      " uses the latitude and longitude of each writer's primary place of activity, applying a deterministic minimum displacement where cities crowd together (central Europe, for instance) so overlapping points stay readable — standard cartographic practice; exact coordinates are preserved in the data files. The separation of the two modes is this map's central claim: literary distance is not geographic distance.",
    terrainStrong: "The terrain in affinity mode",
    terrainBody:
      " is not the Earth. On the all-years plate each writer's territory gets its area primarily from editorial tier (anchor 2.4 : major 1.0 : context 0.55), modulated within ±30% by relation density, and its coastlines are carved by seed-fixed noise (the header of territory.v1.json is authoritative for seed and parameters). The continents, the islands, and both polar caps are artifacts of the affinity layout and correspond to no real border or landmass. The year fader moves the planet's tectonics: the world grows through 8 keyframes from 1850 to 2000 (territory.v1.eras.json is authoritative), and each nation has risen only to g = 0.06 + 0.94 × (0.5 × founding ramp [active start ±5y] + 0.5 × the share of its collected works published by that year), counted from its final territory's core outward. 'Collected works' means the curated works in this corpus, not a complete bibliography — era area and coastline are an editorial animation computed from curation, not a measurement of output. Risen land never sinks and never changes owner. Future writers exist from 1850 as embryonic islets — position and bearing (the address) are foretold; only area follows time. Over this, sovereignty states (unformed ghost → founding → active → heritage patina) and the treaty ink of movement unions crossfade, and towns (works) are founded in their publication year. Park the fader at all years and the whole layer is bypassed — bit-identical to the frozen plate, the same planet every time you visit. Movements are landless treaty overlays — the land always belongs to the writer, and the treaty span on screen (marked ≈) is computed from the overlap of member writers' active ranges in this corpus, not from historical record."
  },

  srcHead: "Data sources and review status",
  srcBody: {
    pre: "Profile drafts are written by an LLM (used interactively by maintainers only) and a batch reaches ",
    mid1: " after machine validation (schema, cross-references, year logic), a Wikidata birth/death crosscheck, and editorial close-read sampling. ",
    mid2: " is withheld until an external verification procedure exists.",
    post: " Only verifiable institutions and works are recorded as sources; unverified deep links are never stored. Translated titles vary by publisher, so original titles are always shown alongside."
  },
  srcPortrait: {
    strong: "Author plates",
    body: " are generated engraving-style imagined figures, never photographs, and every plate carries an 'imagined portrait' or 'emblematic still life' label. Faces are drawn only for deceased authors whose iconography is public-domain or renderable from general impression alone — no specific photograph's composition is ever replicated. Living authors are represented by an emblem from their work instead of a face (a pocket watch at midnight and a chutney jar, for instance). Assets enter the repository as grayscale only and the app maps them onto the plate's duotone; prompts, seeds, and motif rationales are recorded in portraits.json."
  },
  countAuthors: (n) => `${n}`,
  countRels: (n) => `${n}`,
  relRowPrefix: "Relations: ",

  distHead: "Distributions — this map's biases, in numbers",
  distBody:
    "No canon is neutral. The numbers below show what this map currently over- and under-represents. Reducing these biases is an explicit goal of the next expansion. A writer can belong to several regions, languages, genres, and period layers at once, so each table's percentages can sum past 100%.",
  distTitles: {
    regions: "Regions",
    languages: "Languages",
    gender: "Gender",
    genres: "Genres",
    periods: "Period layers",
    relTypes: "Relation types"
  },

  logHead: "Changelog",
  logV01: (a, w, r, version) =>
    `v0.1 (2026-08) — first public corpus: ${a} writers · ${w} works · ${r} relations · layout v${version}.`,
  closing: {
    pre: "This project is the ",
    strong: "first planet",
    mid: " of the Noosphere star system (the 'Booksphere' lineage), and inherits the same principle: ",
    em: "record the state of the discourse; do not adjudicate it."
  }
};

export const METHODOLOGY: Record<Locale, MethodologyStrings> = { ko: KO, en: EN };
