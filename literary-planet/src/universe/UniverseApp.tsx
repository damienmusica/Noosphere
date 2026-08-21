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
import { LENS_MAG, magnitude, influenceWeight, periodOf, starPixels } from "./grammar.ts";
import { isLandable, readinessOf, readinessState } from "./readiness.ts";
import { preloadAuthor, trackPreload, type AssetSet } from "./assets.ts";
import { buildSearchIndex, searchAuthors } from "../lib/search.ts";
import { languageLabel, regionLabel } from "../i18n/index.ts";
import { PERIOD_TINT } from "../theme.ts";

const YEAR_MIN = 1857;
const YEAR_MAX = 1995;

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
  const [groupFocus, setGroupFocus] = useState<string | null>(null);
  const [assets, setAssets] = useState<AssetSet | null>(null);
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

  // 딥링크 — 캡처 하네스와 공유 링크가 같은 문을 쓴다
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const a = q.get("a");
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

  // 자기 성좌: 선택된 별의 관계선. 렌즈와 독립적으로 늘 그려진다 —
  // "다음에 갈 수 있는 곳"이 중경의 정보다.
  const ego = useMemo(() => {
    if (!focusId) return { lines: [] as LensLine[], lit: new Set<string>() };
    const lines: LensLine[] = [];
    const lit = new Set<string>([focusId]);
    for (const r of dataset.relations) {
      if (r.sourceId !== focusId && r.targetId !== focusId) continue;
      if (!positions[r.sourceId] || !positions[r.targetId]) continue;
      lines.push({
        a: r.sourceId,
        b: r.targetId,
        color: RELATION_COLORS[r.type],
        weight: 1,
        relationId: r.id
      });
      lit.add(r.sourceId === focusId ? r.targetId : r.sourceId);
    }
    return { lines, lit };
  }, [focusId, dataset, positions]);

  // scene lifecycle
  useEffect(() => {
    const host = hostRef.current;
    if (!host || sceneRef.current) return;
    const scene = new UniverseScene(
      host,
      { authors: dataset.authors, works: dataset.works, positions, degree, art },
      {
        onPickAuthor: (id) => {
          setFocusId((prev) => {
            if (id && prev === id) {
              if (landable(id)) setPendingLand(id);
              return id;
            }
            return id;
          });
          if (!id) setLandedId(null);
        },
        onHoverAuthor: () => undefined,
        onPickWork: (id) => setWorkId(id),
        onStageChange: (s) => setStage(s)
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
      land: (id: string | null) => setLandedId(id && landable(id) ? id : null)
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
  useEffect(() => {
    if (!focusId) {
      setAssets(null);
      return;
    }
    // 매니페스트가 오기 전에는 **시작하지 않는다.** 빈 묶음을 한 번이라도
    // 만들면 그것이 상태에 앉아 실제 자산을 영영 이기는 경우가 생긴다
    // (실측: 딥링크 착륙에서 육필 지각이 백지로 굳었다).
    if (!art) return;
    let live = true;
    const workIds = dataset.works.filter((w) => w.authorId === focusId).map((w) => w.id);
    void trackPreload(preloadAuthor(focusId, workIds, art)).then((set) => {
      if (live) setAssets(set);
    });
    return () => {
      live = false;
    };
  }, [focusId, art, dataset]);

  useEffect(() => {
    assetsRef.current = assets;
    sceneRef.current?.setAssets(assets);
  }, [assets]);

  useEffect(() => {
    // 좌측 관측층 범례는 상시, 우측 카드는 선택 시 — 투영만 민다
    sceneRef.current?.setSafeInsets(250, focusId || landedId ? 392 : 0);
  }, [focusId, landedId]);

  useEffect(() => {
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
  }, [focusId, landedId, year, lens, personal, workId, ego, groupFocus]);

  const lensDef = lensId ? LENSES.find((l) => l.id === lensId) : undefined;
  const linked = groupFocus ? lens?.groups.find((g) => g.id === groupFocus) : undefined;

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
    <div className="universe">
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
        {(focusId || landedId) && (
          <button
            className="u-btn u-btn--ghost"
            onClick={() => {
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
            onClick={() => {
              setLandedId(null);
              setWorkId(null);
            }}
          >
            궤도로
          </button>
        )}
      </header>

      <div className="u-rail">
        <nav className="u-lenses" aria-label="관측층">
          <p className="u-lenses__title">관측층</p>
          {LENSES.map((l) => (
            <button
              key={l.id}
              className={`u-lens ${lensId === l.id ? "is-on" : ""}`}
              aria-pressed={lensId === l.id}
              onClick={() => setLensId(lensId === l.id ? null : l.id)}
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
                    className={groupFocus === g.id ? "is-on" : ""}
                    aria-pressed={groupFocus === g.id}
                    onMouseEnter={() => setGroupFocus(g.id)}
                    onFocus={() => setGroupFocus(g.id)}
                    onMouseLeave={() => setGroupFocus((c) => (c === g.id ? null : c))}
                    onBlur={() => setGroupFocus((c) => (c === g.id ? null : c))}
                    onClick={() => setGroupFocus(groupFocus === g.id ? null : g.id)}
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
          author={focus}
          works={focusWorks}
          relations={focusRelations}
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
          onGoto={(id) => setFocusId(id)}
          onClose={() => setFocusId(null)}
        />
      )}

      {landed && (
        <aside className="u-card u-card--landing" aria-label={`${landed.names.ko} 표면`} tabIndex={-1}>
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
                  <button onClick={() => setWorkId(w.id === workId ? null : w.id)}>
                    <strong>{w.titleKo}</strong>
                    <span className="u-year">{w.year}</span>
                    {art?.covers?.[w.id] ? <span className="u-tag">초판</span> : null}
                  </button>
                  {workId === w.id && <p className="u-works__sig">{w.significance}</p>}
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
