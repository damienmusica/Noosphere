// R11 성계 프로토타입 — 원경(천구) → 중경(성단) → 착륙(지각) 하나의 공간.
// 기존 앱(#/globe)은 손대지 않는다. 이 경로는 구조를 증명하기 위한 것이다.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dataset } from "../types.ts";
import { loadArtManifest, type ArtManifest } from "../globe/art-assets.ts";
import { UniverseScene, type Stage } from "./scene.ts";
import {
  LENSES,
  buildLens,
  indexGlyph,
  type LensId,
  type LensLine,
  type LensResult
} from "./lenses.ts";
import { RELATION_COLORS } from "../theme.ts";
import { OrbitCard, type SkyMembership } from "./components/OrbitCard.tsx";
import { WorkSheet } from "./components/WorkSheet.tsx";
import {
  decodeShare,
  encodeShare,
  emptyPersonal,
  loadPersonal,
  readOrder,
  recommendTracks,
  savePersonal,
  type PersonalState
} from "./personal.ts";
import {
  LENS_MAG,
  magnitude,
  influenceWeight,
  periodOf,
  starPixels,
  APPROACH_LINE,
  APPROACH_WHY,
  APPROACH_RELATION,
  APPROACH_OPENING
} from "./grammar.ts";
import { isLandable, readinessOf, readinessState } from "./readiness.ts";
import { relationCaption, relationGlyph, REL_KO, EVIDENCE_RANK } from "./relations.ts";
import { preloadAuthor, trackPreload, type AssetSet } from "./assets.ts";
import { buildSearchIndex, searchAuthors } from "../lib/search.ts";
import { languageLabel, regionLabel } from "../i18n/index.ts";
import { PERIOD_TINT } from "../theme.ts";

const YEAR_MIN = 1857;
const YEAR_MAX = 1995;

/** 손안의 화면 — 크롬이 좌우 레일이 아니라 가장자리 판으로 앉는 크기.
 *  폭 900 은 태블릿 세로(768·810·834)까지 포함한다: 그 폭에서 데스크톱
 *  배치를 쓰면 연도판이 좌측 레일과 착륙 카드 사이에서 양쪽에 겹친다(실측,
 *  iPad 810×1080). 높이 520 은 전화기 가로다 — 폭은 넉넉해도 세로가 없으면
 *  레일도 카드도 잘린다(실측, 844×390). */
const NARROW_Q = "(max-width: 900px), (max-height: 520px)";
/** 세로가 없는 화면 — 시트는 아래가 아니라 **옆**에서 온다 */
const SHORT_Q = "(max-height: 520px)";
/** 좁은 화면에서 시트가 쉬는 높이(peek). 하늘이 화면의 절반 이상 남는다. */
const SHEET_PEEK_VH = 0.42;
/** 펼친 시트 — 하늘은 어깨만 남는다 */
const SHEET_FULL_VH = 0.86;

function useMedia(query: string): boolean {
  const [on, setOn] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setOn(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [query]);
  return on;
}

const STAGE_KO: Record<Stage, string> = {
  sky: "원경 · 천구",
  approach: "중경 · 관측 렌즈",
  surface: "근경 · 착륙"
};

export function UniverseApp({ dataset }: { dataset: Dataset }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<UniverseScene | null>(null);
  const [art, setArt] = useState<ArtManifest | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [landedId, setLandedId] = useState<string | null>(null);
  const [workId, setWorkId] = useState<string | null>(null);
  /** 하늘에서 마우스가 올라간 별 — 선택한 별의 이웃이면 그 선의 "왜"가 무대에 적힌다 */
  const [hoverId, setHoverId] = useState<string | null>(null);
  /** 좁은 화면 배치 — 레일은 서랍, 카드는 시트 */
  const narrow = useMedia(NARROW_Q);
  /** 가로로 누운 전화기 — 아래에서 올라오는 시트는 하늘을 다 먹는다 */
  const short = useMedia(SHORT_Q);
  /** 손가락이 주 입력인 기기 — 얹는 동작이 없다 */
  const coarse = useMedia("(pointer: coarse)");
  /** 마지막 입력의 종류. 브라우저는 탭에서도 mouseenter·focus 를 **합성**하므로,
   *  그것을 얹음으로 받으면 첫 탭이 지목을 켜고 곧바로 클릭이 이동해 버린다
   *  (두 탭 문법이 한 탭으로 붕괴 — 실측). 얹음은 진짜 마우스에만 연다. */
  const pointerKind = useRef<string>("mouse");
  useEffect(() => {
    const mark = (e: PointerEvent) => {
      pointerKind.current = e.pointerType || "mouse";
    };
    window.addEventListener("pointerdown", mark, true);
    return () => window.removeEventListener("pointerdown", mark, true);
  }, []);
  /** 좁은 화면에서 관측층 서랍이 열려 있는가 */
  const [drawer, setDrawer] = useState(false);
  /** 좁은 화면에서 시트가 펼쳐져 있는가(쉬는 높이 ↔ 전체) */
  const [sheetFull, setSheetFull] = useState(false);
  /** 카메라가 스스로 움직이는 중 — 시트가 물러나고 손잡이만 남는다 */
  const [moving, setMoving] = useState(false);
  /** 다가가서 천체로 분해된 작가 — 고르지 않아도 자산을 부른다 */
  const [nearId, setNearId] = useState<string | null>(null);
  /** 접근의 사다리(R13-b) — 지목/최근접 별과 그 거리. 관측 스트립의 원천. */
  const [approach, setApproach] = useState<{ id: string; d: number } | null>(null);
  /** 성계 안쪽까지 날아 들어왔다 — 돌아올 길을 띄운다 */
  const [deep, setDeep] = useState(false);
  /** 뷰포트가 바뀔 때마다 오르는 값 — 띠와 크롬 사각형을 다시 재게 한다.
   *  주소창이 접히는 것 같은 일상 동작에 띠가 얼어붙어 있으면, 라벨이
   *  사라지거나(852→734 에서 2/10 삭제) 무방비 창이 열린다(734→852 에서
   *  43.8px 동안 밀란 쿤데라가 시트에 매몰됐다 — 실측). */
  const [vpTick, setVpTick] = useState(0);
  // 첫 화면에 성좌가 이미 그려져 있어야 "이 하늘은 관계의 하늘"이 읽힌다
  const [lensId, setLensId] = useState<LensId | null>("movement");
  const [year, setYear] = useState(YEAR_MAX);
  const [stage, setStage] = useState<Stage>("sky");
  const [personal, setPersonal] = useState<PersonalState>(emptyPersonal);
  /** 저장소에서 성좌를 읽은 뒤에만 저장한다. 그 전에 저장하면 마운트 첫 커밋이
   *  **빈 성좌를 써 버린다** — 공유 링크로 연 브라우저에도 빈 기록이 남았다(계약 실측). */
  const [personalReady, setPersonalReady] = useState(false);
  const [shared, setShared] = useState<string | null>(null);
  /** art 매니페스트가 도착해야 착륙 가능 여부를 안다 — 딥링크는 대기한다 */
  const [pendingLand, setPendingLand] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  /** 범례에서 지목한 성좌 — 목록↔하늘 연동 */
  /** 범례 행에 **얹은** 상태 — 호버·포커스가 쓰는 휘발성 채널 */
  const [groupFocus, setGroupFocus] = useState<string | null>(null);
  /** 범례 행을 **누른** 상태 — 손끝에는 얹는 동작이 없으므로 누름이 유일한
   *  지목 수단이다. 두 채널을 한 칸에 두었더니 탭 하나가 mouseenter 로 켜고
   *  click 으로 곧바로 껐다(실측: 콜드 첫 탭 7/7 무반응, 커서를 얹은 채
   *  탭하면 오히려 해제). 얹음과 누름은 다른 등록부다. */
  const [groupPin, setGroupPin] = useState<string | null>(null);
  const [assets, setAssets] = useState<AssetSet | null>(null);
  const landedRef = useRef<string | null>(null);
  /** 다음 focus/landed 변화의 카메라 뜻(R13-c) — 씬 생성 전(딥링크)에도 적을 수
   *  있도록 ref 로 들고, 동기화 이펙트가 setState 직전에 씬으로 옮긴다. */
  const cameraCauseRef = useRef<"pick" | "summon" | "immediate" | null>(null);
  const assetsRef = useRef<AssetSet | null>(null);
  const artRef = useRef<ArtManifest | null>(null);

  const byId = useMemo(() => new Map(dataset.authors.map((a) => [a.id, a])), [dataset]);
  const searchIndex = useMemo(() => buildSearchIndex(dataset.authors), [dataset]);
  const hits = useMemo(
    () => (query.trim() ? searchAuthors(searchIndex, query, 7) : []),
    [query, searchIndex]
  );
  const positions = dataset.positions.positions;

  const degree = useMemo(() => {
    const d: Record<string, number> = {};
    for (const r of dataset.relations) {
      d[r.sourceId] = (d[r.sourceId] ?? 0) + (r.weight ?? 0.7);
      d[r.targetId] = (d[r.targetId] ?? 0) + (r.weight ?? 0.7);
    }
    return d;
  }, [dataset]);

  useEffect(() => {
    loadArtManifest().then(setArt);
    const known = new Set(dataset.authors.map((x) => x.id));
    const p = new URLSearchParams(location.search).get("sky");
    if (p) {
      const s = decodeShare(p, known);
      if (s) {
        setPersonal(s);
        setShared(p);
        return; // 공유 성좌는 저장하지 않는다 — ready 를 켜지 않는다
      }
    }
    setPersonal(loadPersonal(known));
    setPersonalReady(true);
  }, []);

  // 포커스는 단계를 따라간다. 별을 고르면 궤도 카드로, 착륙하면 착륙 패널로,
  // 하늘로 돌아오면 검색으로 — 전환마다 <body> 로 떨어지던 포커스는 키보드
  // 사용자에게 "아무 일도 안 일어난" 전환이다. 첫 로드에는 건드리지 않는다
  // (관찰의 첫 60초는 아무것도 지시하지 않는다).
  const hadSelection = useRef(false);
  useEffect(() => {
    const sel = landedId
      ? document.querySelector<HTMLElement>(".u-card--landing")
      : focusId
        ? document.querySelector<HTMLElement>(".u-card:not(.u-card--landing)")
        : hadSelection.current
          ? document.querySelector<HTMLElement>(".u-search input")
          : null;
    hadSelection.current = Boolean(focusId || landedId);
    sel?.focus({ preventScroll: true });
  }, [focusId, landedId]);

  // Escape 는 **한 겹씩** 닫는다 — 열린 작품 시트가 먼저, 그다음 카드.
  //
  // 적대 심사(2026-08-28)가 잡았다: 앱 전체에서 Escape 를 듣는 곳이 검색
  // 콤보박스 하나뿐이라, 카드와 작품 시트에는 **닫는 키보드 경로가 아예
  // 없었다.** 손이 없는 관측자는 '×' 버튼을 Tab 으로 찾아가야 했다.
  //
  // 한 번에 다 닫지 않는 이유: 작품을 읽다 Escape 를 누른 사람이 원하는 것은
  // 그 작품을 덮는 것이지 그 작가를 떠나는 것이 아니다. 검색창이 자기 Escape 를
  // 먼저 쓰므로(자기 팝업을 닫는다) 여기서는 글자를 받는 자리를 비켜 간다.
  useEffect(() => {
    const onEsc = (e: KeyboardEvent): void => {
      if (e.key !== "Escape" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)))
        return;
      if (workId) {
        setWorkId(null);
        e.preventDefault();
        return;
      }
      if (focusId && !landedId) {
        setFocusId(null);
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [workId, focusId, landedId]);

  // 딥링크 — 캡처 하네스와 공유 링크가 같은 문을 쓴다
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const a = q.get("a");
    // 입구는 비행이 아니다 — 링크로 들어온 사람은 그 자리에서 시작한다.
    if (a) cameraCauseRef.current = "immediate";
    if (a) setFocusId(a);
    if (q.get("land") === "1" && a) setPendingLand(a);
    const l = q.get("lens");
    // 모르는 층 이름은 무시한다 — 캐스트만 하면 빈 #root 로 죽는다(실측)
    if (l === "none") setLensId(null);
    else if (l && LENSES.some((d) => d.id === l)) setLensId(l as LensId);
    const y = Number(q.get("y"));
    if (y >= YEAR_MIN && y <= YEAR_MAX) setYear(y);
    const w = q.get("w");
    if (w) setWorkId(w);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (focusId) q.set("a", focusId);
    else q.delete("a");
    if (landedId) q.set("land", "1");
    else q.delete("land");
    if (lensId) q.set("lens", lensId);
    else q.delete("lens");
    if (workId) q.set("w", workId);
    else q.delete("w");
    const s2 = q.toString();
    history.replaceState(null, "", s2 ? `?${s2}` : location.pathname);
  }, [focusId, landedId, lensId, workId]);

  useEffect(() => {
    if (personalReady && !shared) savePersonal(personal);
  }, [personal, shared, personalReady]);

  const lens: LensResult | null = useMemo(() => {
    if (!lensId) return null;
    return buildLens(lensId, {
      authors: dataset.authors,
      relations: dataset.relations,
      positions,
      movementLabel: (id) => dataset.movements.find((m) => m.id === id)?.ko ?? id,
      readOrder: readOrder(personal),
      wantIds: Object.keys(personal.want)
    });
  }, [lensId, dataset, positions, personal]);

  // 자기 성좌 — **선 다이어트** (CPO 2026-08-24): 관련성은 이름이 말한다.
  // 이웃 전원은 이름표(lit)로 서고, 실은 **지목한 별 하나**에만 걸린다 — 그
  // 실이 방향 화살촉과 "왜" 캡션을 나른다. 18가닥을 늘 그리던 이전 판은 합성
  // 파일럿 실측(관련성은 이름에서 읽혔고 방향은 선에서 안 읽혔다)과 CPO 판정
  // ("너저분")이 함께 물렸다. 실을 당겨 따라가는 동작 자체가 탐험이다.
  const ego = useMemo(() => {
    if (!focusId) return { lines: [] as LensLine[], lit: new Set<string>() };
    const lines: LensLine[] = [];
    const lit = new Set<string>([focusId]);
    for (const r of dataset.relations) {
      if (r.sourceId !== focusId && r.targetId !== focusId) continue;
      if (!positions[r.sourceId] || !positions[r.targetId]) continue;
      const otherId = r.sourceId === focusId ? r.targetId : r.sourceId;
      lit.add(otherId);
      if (hoverId === otherId)
        lines.push({
          a: r.sourceId,
          b: r.targetId,
          color: RELATION_COLORS[r.type],
          weight: 1,
          relationId: r.id,
          directed: r.direction === "directed",
          anchor: r.anchors?.[0]
        });
    }
    return { lines, lit };
  }, [focusId, hoverId, dataset, positions]);

  // scene lifecycle
  useEffect(() => {
    const host = hostRef.current;
    if (!host || sceneRef.current) return;
    const scene = new UniverseScene(
      host,
      { authors: dataset.authors, works: dataset.works, relations: dataset.relations, positions, degree, art },
      {
        onPickAuthor: (id) => {
          // 하늘의 픽은 몸을 옮기지 않지만(R13-c), **착륙 중의 픽은 이륙이다**
          // (R12-c: 하늘 단계 없이 직행) — 회랑에서 별을 부르는 것은 명시적
          // 여행 요청이므로 배가 데려간다.
          cameraCauseRef.current = landedRef.current && id && id !== landedRef.current ? "summon" : "pick";
          // 이륙 (R12-c): 착륙한 채로 다른 별을 누르면 하늘 단계 없이 그 자리에서
          // 날아오른다 — 행성이 뒤로 작아지고 다음 작가의 궤도로 이어지는 한 호흡.
          setLandedId((landedPrev) => (id && landedPrev && id !== landedPrev ? null : id ? landedPrev : null));
          setFocusId((prev) => {
            if (id && prev === id) {
              if (landable(id)) setPendingLand(id);
              return id;
            }
            return id;
          });
        },
        onHoverAuthor: (id) => setHoverId(id),
        onPickWork: (id) => setWorkId(id),
        onStageChange: (s) => setStage(s),
        onMotion: (m) => setMoving(m),
        onDeep: (d) => setDeep(d),
        onNear: (id) => setNearId(id),
        onApproach: (id, d) => setApproach(id ? { id, d } : null),
        // 추력은 붙잡고 있던 것을 놓는다 — 당긴 책이 먼저, 그다음이 궤도.
        // 착륙 자체는 놓지 않는다: 회랑에서 추력은 이륙이 아니라 걷기다.
        onLeaveOrbit: () =>
          setWorkId((w) => {
            if (w) return null;
            setFocusId((f) => (f && !landedRef.current ? null : f));
            return w;
          })
      }
    );
    sceneRef.current = scene;
    (window as unknown as { __universe?: unknown }).__universe = {
      metrics: () => scene.metrics,
      settle: () => scene.settle(),
      art: () => Boolean(artRef.current),
      assets: () => {
        const a = assetsRef.current;
        return a
          ? { authorId: a.authorId, ground: Boolean(a.ground), mark: Boolean(a.mark), covers: a.covers.size, prov: a.provenance.length }
          : null;
      },
      focus: (id: string | null) => setFocusId(id),
      land: (id: string | null) => setLandedId(id && landable(id) ? id : null),
      /** 별의 현재 화면 좌표(CSS px) — 하네스가 실제 마우스를 그 위에 올린다 */
      project: (id: string, raw?: boolean) => scene.project(id, raw)
    };
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
    // art is NOT a dependency: it arrives async and re-creating the scene
    // would silently drop the state already pushed into it
  }, [dataset, positions, degree]);

  useEffect(() => {
    artRef.current = art;
    sceneRef.current?.setArt(art);
  }, [art]);

  // 접근이 시작되는 순간 그 작가의 실물 자산을 전부 디코드해 둔다 — 착륙
  // 프레임에서 텍스처가 튀어 들어오면 "같은 천체가 계속 있었다"가 깨진다.
  // 자유 비행(R12-f)에서는 **고르지 않고 다가간다.** 방아쇠가 선택뿐이면
  // 조준해서 분해시킨 천체가 무늬 없는 공으로 남는다 — 미준비 작가에게 착륙을
  // 금지한 바로 그 화면이다(실측: 카프카가 민무늬 구슬).
  useEffect(() => {
    const target = focusId ?? nearId;
    if (!target) {
      setAssets(null);
      return;
    }
    // 매니페스트가 오기 전에는 **시작하지 않는다.** 빈 묶음을 한 번이라도
    // 만들면 그것이 상태에 앉아 실제 자산을 영영 이기는 경우가 생긴다
    // (실측: 딥링크 착륙에서 육필 지각이 백지로 굳었다).
    if (!art) return;
    let live = true;
    const workIds = dataset.works.filter((w) => w.authorId === target).map((w) => w.id);
    void trackPreload(preloadAuthor(target, workIds, art)).then((set) => {
      if (live) setAssets(set);
    });
    return () => {
      live = false;
    };
  }, [focusId, nearId, art, dataset]);

  useEffect(() => {
    assetsRef.current = assets;
    sceneRef.current?.setAssets(assets);
  }, [assets]);

  useEffect(() => {
    const bump = () => setVpTick((n) => n + 1);
    window.addEventListener("resize", bump);
    window.addEventListener("orientationchange", bump);
    // 주소창 접힘은 window.resize 를 내지 않는 브라우저가 있다 — 시각
    // 뷰포트가 정본이다.
    window.visualViewport?.addEventListener("resize", bump);
    return () => {
      window.removeEventListener("resize", bump);
      window.removeEventListener("orientationchange", bump);
      window.visualViewport?.removeEventListener("resize", bump);
    };
  }, []);

  useEffect(() => {
    if (focusId || landedId) setDrawer(false);
  }, [focusId, landedId]);

  // 층이 바뀌면 그 층의 그룹을 가리키던 핀은 뜻을 잃는다. 착륙 중에는 범례
  // 자체가 내려가므로(테제 §④) 핀도 함께 내린다.
  useEffect(() => {
    setGroupPin(null);
  }, [lensId, landedId]);

  // 다른 별로 옮겨 가면 시트는 다시 쉬는 높이로 — 펼침은 그 별에 대한 상태다
  useEffect(() => {
    setSheetFull(false);
    setHoverId(null);
  }, [focusId, landedId]);

  // 서가에서 책을 당기면 그 책의 자료가 시트 어딘가에 펼쳐진다. 좁은 화면의
  // 시트는 첫 줄만 보이므로, 열린 작품을 시트 안에서 눈앞으로 데려온다 —
  // 그러지 않으면 "눌렀는데 아무 일도 안 일어났다"로 읽힌다.
  useEffect(() => {
    if (!narrow || !workId) return;
    const t = setTimeout(() => {
      document
        .querySelector(".u-card .u-works li.is-on")
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 60);
    return () => clearTimeout(t);
  }, [narrow, workId]);

  useEffect(() => {
    // 넓은 화면: 좌측 관측층 범례는 상시, 우측 카드는 선택 시 — 투영만 민다.
    // 좁은 화면: 레일은 서랍으로 접히고 카드는 아래에서 올라오므로 띠도
    // 위·아래다. 데스크톱 폭을 그대로 먹이면 좌우 합이 화면보다 넓어져
    // 이름표가 전멸하고(실측: 라벨 1/99) 프레임이 71px 밀려 회랑이 화면
    // 밖으로 나갔다.
    if (!narrow) {
      sceneRef.current?.setSafeInsets(250, focusId || landedId ? 392 : 0, 0, 0);
      return;
    }
    const open = focusId || landedId;
    if (short) {
      // 누운 화면에서는 시트가 오른쪽 절반이다 — 띠도 오른쪽에 선다.
      // 물러나는 규칙도 여기 있어야 한다: `data-sheet` 는 세로 배치 전용이라
      // 누운 화면에서는 "away" 가 닿지 않았고, 852 중 380(45%)이 나는 내내
      // 덮여 있었다(실측). 계약이 없는 화면에서 조용히 빠진 자리다.
      sceneRef.current?.setSafeInsets(
        0,
        open && !moving ? Math.round(Math.min(window.innerWidth * 0.52, 380)) : 0,
        46,
        0
      );
      return;
    }
    // 시트 높이 + 어깨(손잡이 30) + 이름표 한 줄(20). 이름표의 y 는 글자
    // 상단이라 여유를 두지 않으면 시트 위에 반쯤 걸린 이름이 남는다.
    const sheet =
      open && !moving
        ? Math.round(window.innerHeight * (sheetFull ? SHEET_FULL_VH : SHEET_PEEK_VH)) + 50
        : 92;
    sceneRef.current?.setSafeInsets(0, 0, 58, sheet);
  }, [focusId, landedId, narrow, short, sheetFull, moving, vpTick]);

  // 크롬이 **실제로** 덮은 자리를 재서 장면에 넘긴다. 스칼라 띠는 카메라
  // 프레이밍용이고, 이름표는 이 사각형들과 상자로 대조한다 — 연도판은 가운데
  // 아래에 뜬 별개의 판이고 누운 화면에서는 왼쪽에 붙으므로 어떤 스칼라로도
  // 표현되지 않는다.
  useEffect(() => {
    const measure = () => {
      const scene = sceneRef.current;
      if (!scene) return;
      const out: Array<{ x: number; y: number; w: number; h: number }> = [];
      const sel =
        ".u-top, .u-time, .u-card, .u-grip, .u-lenses, .u-mine, .u-why, .u-approach, .u-search__hits";
      for (const el of document.querySelectorAll<HTMLElement>(sel)) {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) < 0.05)
          continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        out.push({ x: r.left, y: r.top, w: r.width, h: r.height });
      }
      scene.setChromeRects(out);
    };
    const raf = requestAnimationFrame(measure);
    // 서랍은 220ms 를 미끄러진다 — 끝난 자리에서 한 번 더 잰다
    const t = setTimeout(measure, 280);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [focusId, landedId, workId, narrow, short, sheetFull, drawer, lensId, query, moving, vpTick]);

  useEffect(() => {
    landedRef.current = landedId;
    if (sceneRef.current && cameraCauseRef.current) {
      sceneRef.current.cameraCause = cameraCauseRef.current;
      cameraCauseRef.current = null;
    }
    sceneRef.current?.setState({
      focusId,
      landedId,
      year,
      lens,
      read: new Set(Object.keys(personal.read)),
      want: new Set(Object.keys(personal.want)),
      selectedWorkId: workId,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      ego: ego.lines,
      egoLit: ego.lit,
      // 층을 켜는 **첫 프레임에** 전 구성원의 이름표 선두에 색인 번호가
      // 새겨진다 — 그것이 관측층의 즉각 반응이다. 미아 번호 우려는 범례가
      // 전 그룹(①~⑫)을 싣게 되면서 이미 해소됐다(R11-d 사양 §5).
      // 범례 행을 지목하는 것은 그 다음 상호작용이다(한 번에 한 항목).
      lensMarks: lens?.marks ?? new Map(),
      lensGroupFocus: linked ? new Set(linked.memberIds) : null,
      lensRelationGroups: lensDef?.kind === "relation"
    });
  }, [focusId, landedId, year, lens, personal, workId, ego, groupFocus, groupPin]);

  const lensDef = lensId ? LENSES.find((l) => l.id === lensId) : undefined;
  // 누른 것이 얹은 것을 이긴다 — 누름은 손을 떼도 남는 판정이기 때문이다
  const groupActive = groupPin ?? groupFocus;
  const linked = groupActive ? lens?.groups.find((g) => g.id === groupActive) : undefined;

  const focus = focusId ? byId.get(focusId) : null;
  const landed = landedId ? byId.get(landedId) : null;
  const focusWorks = useMemo(
    () => (focus ? dataset.works.filter((w) => w.authorId === focus.id) : []),
    [focus, dataset]
  );
  const focusRelations = useMemo(() => {
    if (!focus) return [];
    const out: Array<{ rel: (typeof dataset.relations)[number]; other: NonNullable<typeof focus> }> = [];
    for (const r of dataset.relations) {
      const otherId = r.sourceId === focus.id ? r.targetId : r.targetId === focus.id ? r.sourceId : null;
      if (!otherId) continue;
      const other = byId.get(otherId);
      if (other) out.push({ rel: r, other });
    }
    return out;
  }, [focus, dataset, byId]);

  // 관측 일지 — 선택한 별에서 이웃에 마우스를 올리면 그 관계가 왜 그어졌는지.
  // 선 자체는 집을 수 없고(1px 선분), 선의 끝에 있는 별은 이미 집힌다 — 같은
  // 정보를 카드가 접근 가능하게 싣고, 하늘은 호버로 같은 문장을 보여 준다.
  const hoverWhy = useMemo(() => {
    if (!focus || !hoverId || hoverId === focus.id) return null;
    const row = focusRelations.find((x) => x.other.id === hoverId);
    if (!row) return null;
    return relationCaption(row.rel, focus.id, (id) => byId.get(id)?.names.ko ?? id);
  }, [focus, hoverId, focusRelations, byId]);

  // 접근의 사다리(R13-b) — 정보는 클릭의 보상이 아니라 **접근의 응답**이다.
  // 거리 문턱마다 한 줄씩 깊어진다: 이름 → 생몰·언어 → 한 줄 해설 → 최강
  // 관계 → 여는 문장·초대. 카드가 열려 있으면 물러나고(같은 내용의 상위
  // 표면), 착륙하면 서지 않는다(표면이 곧 세계다). 없는 단은 없다고 둔다 —
  // 여는 문장이 없는 작가는 그 줄이 비는 것이 정직한 상태다.
  const approachRungs = useMemo(() => {
    if (!approach || landedId || focusId) return null;
    const a = byId.get(approach.id);
    if (!a) return null;
    const d = approach.d;
    const rows: { key: string; text: string; lang?: string }[] = [
      { key: "name", text: a.names.ko }
    ];
    if (d <= APPROACH_LINE) {
      const life = a.birthYear !== undefined ? `${a.birthYear}–${a.deathYear ?? ""}` : null;
      const langs = a.languages.map((l) => languageLabel(l, "ko")).join(" · ");
      const line = [life, langs].filter(Boolean).join(" · ");
      if (line) rows.push({ key: "line", text: line });
    }
    if (d <= APPROACH_WHY) {
      const s = a.importanceReason;
      const cut = s.indexOf("다. ");
      rows.push({ key: "why", text: cut > 0 ? s.slice(0, cut + 2) : s });
    }
    if (d <= APPROACH_RELATION) {
      const best = dataset.relations
        .filter((r) => r.sourceId === a.id || r.targetId === a.id)
        .sort(
          (x, y) =>
            EVIDENCE_RANK[y.evidenceLevel] - EVIDENCE_RANK[x.evidenceLevel] || y.weight - x.weight
        )[0];
      if (best) {
        const other = byId.get(best.sourceId === a.id ? best.targetId : best.sourceId);
        if (other) {
          rows.push({
            key: "relation",
            text: `${relationGlyph(best, a.id)} ${other.names.ko} · ${REL_KO[best.type] ?? best.type}`
          });
        }
      }
    }
    if (d <= APPROACH_OPENING) {
      const entry = dataset.works.find((w) => w.authorId === a.id && w.id === a.readingEntry);
      if (entry?.world) {
        rows.push({
          key: "opening",
          text: `『${entry.titleKo}』 「${entry.world.opening.original}」`
        });
      }
      rows.push({
        key: "invite",
        // 모듈 수준 isLandable — 컴포넌트의 landable 콜백은 이 아래에서 선언되고,
        // TDZ 참조가 첫 렌더에서 던져 씬 프레임 루프까지 죽였다(실측: 별이 22px
        // 에 동결, 콘솔 ReferenceError 4). 렌더 경로는 선언 순서에 물리지 않는다.
        text: isLandable(a.id) ? "착륙 준비됨 — 회랑이 열린다" : "궤도 아카이브"
      });
    }
    return rows;
  }, [approach, landedId, focusId, byId, dataset]);

  const tracks = useMemo(
    () =>
      recommendTracks(personal, dataset.authors, dataset.relations, (a) => a.difficulty, {
        region: (id: string) => regionLabel(id, "ko"),
        language: (code: string) => languageLabel(code, "ko")
      }),
    [personal, dataset]
  );

  /** 착륙지 준비 = **명시적 검증 상태**(data/depth-readiness.json). 자산 파일의
   *  존재로 추론하지 않는다 — 지면이 있어도 표면 문구가 검수되지 않았으면
   *  착륙지가 아니다(R11-c) */
  const landable = useCallback((id: string): boolean => isLandable(id), []);

  /** 이 별이 속한 하늘들 — 궤도 카드용 (관측층이 데이터에서 파생) */
  const skiesOf = useCallback(
    (id: string): SkyMembership[] => {
      const out: SkyMembership[] = [];
      for (const def of LENSES) {
        if (def.kind !== "attribute") continue;
        const r = buildLens(def.id, {
          authors: dataset.authors,
          relations: dataset.relations,
          positions,
          movementLabel: (m) => dataset.movements.find((x) => x.id === m)?.ko ?? m,
          readOrder: [],
          wantIds: []
        });
        for (const g of r.groups)
          if (g.memberIds.includes(id)) out.push({ lens: def.ko, group: g.label });
      }
      return out;
    },
    [dataset, positions]
  );

  // 딥링크 착륙은 준비도 게이트를 지나고, **자산이 디코드된 뒤에** 성립한다.
  // 착륙이 자산보다 먼저 도착하면 텍스처가 프레임 도중에 튀어 들어온다.
  useEffect(() => {
    if (!pendingLand) return;
    if (!landable(pendingLand)) {
      setPendingLand(null);
      return;
    }
    if (assets?.authorId !== pendingLand) return; // 자산을 기다린다
    setLandedId(pendingLand);
    setPendingLand(null);
  }, [pendingLand, landable, assets]);

  const toggle = useCallback((key: "read" | "want", id: string) => {
    setPersonal((p) => {
      const next = { ...p, read: { ...p.read }, want: { ...p.want } };
      if (next[key][id]) delete next[key][id];
      else next[key][id] = Date.now();
      if (key === "read" && next.read[id]) delete next.want[id];
      return next;
    });
  }, []);

  const maxDeg = Math.max(1, ...Object.values(degree));

  const readCount = Object.keys(personal.read).length;

  return (
    <div
      className={`universe${narrow ? " is-narrow" : ""}${narrow && short ? " is-short" : ""}${moving ? " is-moving" : ""}${deep ? " is-deep" : ""}`}
      data-drawer={narrow && drawer ? "open" : undefined}
      data-sheet={
        narrow && !short && (focus || landed)
          ? moving
            ? "away"
            : sheetFull
              ? "full"
              : "peek"
          : undefined
      }
    >
      <div className="universe__stage" ref={hostRef} />

      <header className="u-top">
        <h1>문학의 성계</h1>
        <span className="u-stage" data-stage={stage} role="status" aria-live="polite">
          {STAGE_KO[stage]}
          {/* 배율을 숨기면 "같은 공간인 척"이 된다 — 왜곡은 공표될 때만 기만이 아니다 */}
          {stage === "approach" && focusId && !landedId
            ? isLandable(focusId)
              ? ` ×${LENS_MAG}`
              : " · 궤도 아카이브"
            : ""}
        </span>
        <div
          className="u-search"
          // 포커스가 검색 밖으로 나가면 목록을 닫는다 — 관측층 버튼을 눌러도
          // 결과 행이 남아 있던 것(합성 파일럿 3/4)은 목록이 입력값에만 묶여
          // 있었기 때문이다.
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setQuery("");
          }}
        >
          <input
            type="search"
            placeholder="별 찾기"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // Enter 는 첫 결과를 고른다. 아무 일도 안 하는 Enter 는 "왜 안 되지"로
            // 읽힌다(합성 파일럿 4/4 가 Enter 를 쳤다).
            onKeyDown={(e) => {
              if (e.key === "Enter" && hits[0]) {
                e.preventDefault();
                setFocusId(hits[0].author.id);
                setLandedId(null);
                setQuery("");
              } else if (e.key === "Escape") {
                setQuery("");
              }
            }}
            aria-label="작가 검색"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls="u-search-hits"
            aria-autocomplete="list"
          />
          {hits.length > 0 && (
            <ul className="u-search__hits" id="u-search-hits" role="listbox">
              {hits.map((h) => (
                <li key={h.author.id} role="option" aria-selected={false}>
                  <button
                    onClick={() => {
                      // 검색은 명시적 이동 요청이다 — 배가 데려간다(정직한 비행).
                      cameraCauseRef.current = "summon";
                      setFocusId(h.author.id);
                      setLandedId(null);
                      setQuery("");
                    }}
                  >
                    <span
                      className="u-dot"
                      style={{ background: PERIOD_TINT[periodOf(h.author)] }}
                      aria-hidden="true"
                    />
                    {h.author.names.ko}
                    <em>{h.matched}</em>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="u-btn u-btn--ghost u-drawer-key"
          aria-expanded={drawer}
          aria-controls="u-rail"
          onClick={() => setDrawer((d) => !d)}
        >
          {drawer ? "닫기" : "관측층"}
        </button>
        {deep && !focusId && !landedId && (
          <button
            className="u-btn u-btn--ghost"
            data-testid="to-overview"
            onClick={() => sceneRef.current?.overview()}
          >
            {narrow ? "원경" : "원경으로"}
          </button>
        )}
        {(focusId || landedId) && (
          <button
            className="u-btn u-btn--ghost"
            data-testid="to-sky"
            onClick={() => {
              cameraCauseRef.current = "summon";
              setLandedId(null);
              setFocusId(null);
              setWorkId(null);
            }}
          >
            하늘로
          </button>
        )}
        {landedId && (
          <button
            className="u-btn u-btn--ghost"
            data-testid="to-orbit"
            onClick={() => {
              cameraCauseRef.current = "summon";
              setLandedId(null);
              setWorkId(null);
            }}
          >
            궤도로
          </button>
        )}
      </header>

      <div className="u-rail" id="u-rail">
        <nav className="u-lenses" aria-label="관측층">
          <p className="u-lenses__title">관측층</p>
          {LENSES.map((l) => (
            <button
              key={l.id}
              className={`u-lens ${lensId === l.id ? "is-on" : ""}`}
              aria-pressed={lensId === l.id}
              onClick={() => {
                setLensId(lensId === l.id ? null : l.id);
                setDrawer(false);
              }}
              title={l.hint}
            >
              {l.ko}
            </button>
          ))}
          {lens && lens.groups.length && !landedId ? (
            <ul className="u-lens-groups" data-testid="lens-legend">
              {lens.groups.map((g) => (
                <li key={g.id}>
                  <button
                    className={groupActive === g.id ? "is-on" : ""}
                    aria-pressed={groupPin === g.id}
                    onMouseEnter={() => setGroupFocus(g.id)}
                    onFocus={() => setGroupFocus(g.id)}
                    onMouseLeave={() => setGroupFocus((c) => (c === g.id ? null : c))}
                    onBlur={() => setGroupFocus((c) => (c === g.id ? null : c))}
                    onClick={() => {
                      // 누르면 남는다. 좁은 화면에서는 서랍이 물러나야 하늘이
                      // 보이므로, 고른 즉시 닫고 지목만 남긴다.
                      setGroupPin((pin) => (pin === g.id ? null : g.id));
                      setDrawer(false);
                    }}
                  >
                    <span className="u-index" aria-hidden="true">
                      {indexGlyph(g.index)}
                    </span>
                    {g.label} <em>{g.memberIds.length}</em>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="u-lenses__note">
            {lensDef?.kind === "attribute"
              ? "속성층은 색인이다. 목록이 본체이고, 하늘은 한 번에 한 항목만 지목한다 — 사조와 언어는 공간적으로 뭉쳐 있지 않으므로 선도 영역도 그리지 않는다."
              : "소속은 데이터에 새겨진 것이 아니라 켜져 있는 층의 산물이다. 한 작가는 여러 층에 속한다."}
          </p>
        </nav>
        <section className="u-mine">
          <h2>나의 성좌</h2>
          <p>
            읽음 <strong>{readCount}</strong> · 읽고 싶음 <strong>{Object.keys(personal.want).length}</strong>
          </p>
          {tracks.length ? (
            <div className="u-tracks" data-testid="tracks">
              <h3>다음 독서 — 방향을 고르세요</h3>
              {tracks.map((t) => (
                <div key={t.id} className="u-track">
                  <p className="u-track__name" title={t.hint}>
                    {t.ko}
                  </p>
                  <ul className="u-recs">
                    {t.items.map((r) => {
                      const a = byId.get(r.authorId);
                      if (!a) return null;
                      return (
                        <li key={r.authorId}>
                          <button onClick={() => setFocusId(r.authorId)}>
                            <span
                              className="u-dot"
                              style={{ background: PERIOD_TINT[periodOf(a)] }}
                              aria-hidden="true"
                            />
                            {a.names.ko}
                          </button>
                          <em>{r.reasons.join(" · ")}</em>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="u-mine__empty">별을 읽음으로 표시하면 다음 독서를 여기서 제안한다.</p>
          )}
          {readCount > 0 && (
            <button
              className="u-btn u-btn--ghost"
              onClick={() => {
                const url = `${location.origin}${location.pathname}?sky=${encodeShare(personal)}`;
                void navigator.clipboard?.writeText(url);
              }}
            >
              성좌 링크 복사
            </button>
          )}
          {shared && (
          <>
            <p className="u-mine__shared">
              다른 독자의 성좌를 보고 있다. 읽기 전용이며 이 브라우저에 저장되지 않는다.
            </p>
            <button
              className="u-btn"
              onClick={() => {
                setShared(null);
                setPersonalReady(true);
                savePersonal(personal);
                history.replaceState(null, "", location.pathname);
              }}
            >
              내 성좌로 복사
            </button>
          </>
        )}
        </section>
      </div>

      {narrow && drawer ? (
        <button
          className="u-scrim"
          aria-label="관측층 닫기"
          onClick={() => setDrawer(false)}
        />
      ) : null}

      {narrow && !short && (focus || landed) ? (
        <button
          className="u-grip"
          data-testid="sheet-grip"
          aria-expanded={sheetFull}
          onClick={() => setSheetFull((f) => !f)}
        >
          <span aria-hidden="true" />
          {sheetFull ? "접기" : "펼치기"}
        </button>
      ) : null}

      {hoverWhy ? (
        <p className="u-why" data-testid="why" aria-hidden="true">
          {hoverWhy}
        </p>
      ) : null}

      {stage !== "surface" ? (
        // 관측창 프레임(R13-d) — 배는 텍스트가 아니라 **창의 가장자리**로 존재한다.
        // 3자 판정 수렴(GD 조건부 합격 · VAD 재도전 지침 · 제작): 코너 헤어라인
        // 4점 + 초미세 비네트, 숫자·계기 0(정보는 접근 스트립의 몫), 표면에서는
        // 걷는 몸이므로 숨긴다. 순수 장식이 아니라 "기기 안에서 보고 있다"의 상수.
        <div className="u-hull" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
      ) : null}

      {approachRungs ? (
        <aside className="u-approach" data-testid="approach" role="status" aria-live="polite">
          <ol>
            {approachRungs.map((r) => (
              <li key={r.key} data-rung={r.key} lang={r.lang}>
                {r.text}
              </li>
            ))}
          </ol>
        </aside>
      ) : null}

      <div className="u-time">
        <label htmlFor="u-year">연도</label>
        <input
          id="u-year"
          type="range"
          min={YEAR_MIN}
          max={YEAR_MAX}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <output>{year}</output>
        <span className="u-time__hint">활동 전 = 어둠 · 활동기 = 점등 · 사후 = 잔광</span>
      </div>

      {focus && !landed && (
        <OrbitCard
          // 별이 바뀌면 **새 노드**다. 같은 <aside> 를 재사용하면 스크롤 위치가
          // 그대로 남아, 관계 홉으로 도착한 카드가 초상·이름·착륙 문을 전부
          // 접힘선 위로 밀어낸 채 열린다(실측: 모바일 0→1113→1247, 데스크톱
          // 0→1205→1357 — 도착 화소에 되돌아가는 버튼이 놓였다). 9차 조항
          // "다음 행동은 뷰포트 안에 있다"의 위반이고, key 하나로 닫힌다.
          key={focus.id}
          author={focus}
          works={focusWorks}
          relations={focusRelations}
          workTitle={(id) => dataset.works.find((w) => w.id === id)?.titleKo}
          art={art}
          landable={landable(focus.id)}
          readiness={
            readinessOf(focus.id) ?? { state: readinessState(focus.id), met: [] }
          }
          readOnly={Boolean(shared)}
          star={(() => {
            const m = magnitude(influenceWeight(focus.tier, degree[focus.id] ?? 0, maxDeg));
            return { px: starPixels(m), color: PERIOD_TINT[periodOf(focus)], magnitude: m };
          })()}
          skies={skiesOf(focus.id)}
          read={Boolean(personal.read[focus.id])}
          want={Boolean(personal.want[focus.id])}
          onToggleRead={() => toggle("read", focus.id)}
          onToggleWant={() => toggle("want", focus.id)}
          onLand={() => setPendingLand(focus.id)}
          onGoto={(id) => {
            // 손끝에는 얹는 동작이 없다 — 첫 탭이 지목, 같은 행의 두 번째
            // 탭이 이동이다(헌법 12차 조항). 이동은 비행 한 번이 드는
            // 행동이므로, 왜 이어져 있는지 먼저 보여주고 옮긴다.
            if (coarse && hoverId !== id) {
              setHoverId(id);
              return;
            }
            setFocusId(id);
          }}
          onPeek={(id) => {
            if (pointerKind.current !== "mouse") return;
            setHoverId(id);
          }}
          onClose={() => setFocusId(null)}
        />
      )}

      {landed && (
        <aside
          key={landed.id}
          className="u-card u-card--landing"
          aria-label={`${landed.names.ko} 표면`}
          tabIndex={-1}
        >
          <h2>{landed.names.ko}</h2>
          {art?.marks?.[landed.id] ? (
            <img
              className="u-mark"
              src={`${import.meta.env.BASE_URL}art/${art.marks[landed.id]!.file}`}
              alt=""
              data-testid="mark"
            />
          ) : null}
          <p className="u-card__life">
            {landed.birthYear ?? "?"}–{landed.deathYear ?? "현재"} ·{" "}
            {landable(landed.id) ? "육필 지각" : "백지 지각"} · 광도{" "}
            {magnitude(influenceWeight(landed.tier, degree[landed.id] ?? 0, maxDeg)).toFixed(2)}
          </p>
          <h3>도시 {dataset.works.filter((w) => w.authorId === landed.id).length}</h3>
          <ul className="u-works">
            {dataset.works
              .filter((w) => w.authorId === landed.id)
              .map((w) => (
                <li key={w.id} className={workId === w.id ? "is-on" : ""}>
                  {/* 이 버튼은 바로 아래에 긴 블록(원문·번역·판본·근거)을 펼친다.
                      펼침 상태를 말하지 않으면 화면을 못 보는 사람에게는 그냥
                      제목 버튼이다 — 적대 심사 지적(2026-08-28). */}
                  <button
                    onClick={() => setWorkId(w.id === workId ? null : w.id)}
                    aria-expanded={workId === w.id}
                    aria-controls={`u-work-${w.id}`}
                  >
                    <strong>{w.titleKo}</strong>
                    <span className="u-year">{w.year}</span>
                    {art?.covers?.[w.id] ? <span className="u-tag">초판</span> : null}
                  </button>
                  {workId === w.id && (
                    <WorkSheet
                      id={`u-work-${w.id}`}
                      work={w}
                      lang={landed.languages[0] ?? "und"}
                      sourceOf={(id) => dataset.sources.find((x) => x.id === id)}
                    />
                  )}
                </li>
              ))}
          </ul>
          <p className="u-card__ready">
            {landable(landed.id)
              ? "지각은 이 작가의 육필 원고다."
              : "이 천체의 지각은 아직 백지다 — 실물 자료가 확보되면 채워진다."}
          </p>

          {/* 프로비넌스는 문서가 아니라 **표면에** 있어야 한다 — 보여주지 못하는
              근거는 없는 근거와 같다. 이 목록은 이 표면에 실제로 쓰인 실물
              자산만 싣고, 각 행은 매니페스트의 원장에서 그대로 온다. */}
          {assets && assets.provenance.length ? (
            <details className="u-prov" data-testid="provenance">
              <summary>자료 근거 {assets.provenance.length}건</summary>
              <ul>
                {assets.provenance.map((p) => {
                  const w = p.workId ? dataset.works.find((x) => x.id === p.workId) : null;
                  return (
                    <li key={`${p.role}:${p.workId ?? ""}`}>
                      <span className="u-tag">{p.role}</span>
                      {w ? <strong>{w.titleKo}</strong> : null}
                      <span className="u-prov__title">{p.prov.title}</span>
                      <span className="u-prov__meta">
                        {p.prov.collection}
                        {p.prov.licence ? ` · ${p.prov.licence}` : ""}
                        {p.prov.commercialUse && p.prov.commercialUse !== "yes"
                          ? ` · 상업 사용 ${p.prov.commercialUse === "no" ? "불가" : "미확인"}`
                          : ""}
                      </span>
                      {p.prov.pageUrl ? (
                        <a href={p.prov.pageUrl} target="_blank" rel="noreferrer noopener">
                          원본 파일 페이지
                        </a>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </details>
          ) : null}
        </aside>
      )}
    </div>
  );
}
