// R11 성계 프로토타입 — 원경(천구) → 중경(성단) → 착륙(지각) 하나의 공간.
// 기존 앱(#/globe)은 손대지 않는다. 이 경로는 구조를 증명하기 위한 것이다.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dataset } from "../types.ts";
import { loadArtManifest, type ArtManifest } from "../globe/art-assets.ts";
import { UniverseScene, type Stage } from "./scene.ts";
import { LENSES, buildLens, type LensId, type LensLine, type LensResult } from "./lenses.ts";
import { RELATION_COLORS } from "../theme.ts";
import { OrbitCard } from "./components/OrbitCard.tsx";
import {
  decodeShare,
  encodeShare,
  emptyPersonal,
  loadPersonal,
  readOrder,
  recommend,
  savePersonal,
  type PersonalState
} from "./personal.ts";
import { magnitude, influenceWeight, periodOf } from "./grammar.ts";
import { buildSearchIndex, searchAuthors } from "../lib/search.ts";
import { languageLabel, regionLabel } from "../i18n/index.ts";
import { PERIOD_TINT } from "../theme.ts";

const YEAR_MIN = 1857;
const YEAR_MAX = 1995;

const STAGE_KO: Record<Stage, string> = { sky: "원경 · 천구", approach: "중경 · 성단", surface: "근경 · 착륙" };

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
  const [shared, setShared] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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
    const p = new URLSearchParams(location.search).get("sky");
    if (p) {
      const s = decodeShare(p);
      if (s) {
        setPersonal(s);
        setShared(p);
        return;
      }
    }
    setPersonal(loadPersonal());
  }, []);

  // 딥링크 — 캡처 하네스와 공유 링크가 같은 문을 쓴다
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const a = q.get("a");
    if (a) setFocusId(a);
    if (q.get("land") === "1" && a) setLandedId(a);
    const l = q.get("lens");
    if (l) setLensId(l === "none" ? null : (l as LensId));
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
    if (!shared) savePersonal(personal);
  }, [personal, shared]);

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
              setLandedId(id);
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
      focus: (id: string | null) => setFocusId(id),
      land: (id: string | null) => setLandedId(id)
    };
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
    // art is NOT a dependency: it arrives async and re-creating the scene
    // would silently drop the state already pushed into it
  }, [dataset, positions, degree]);

  useEffect(() => {
    sceneRef.current?.setArt(art);
  }, [art]);

  useEffect(() => {
    sceneRef.current?.setSafeRight(focusId || landedId ? 392 : 0);
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
      egoLit: ego.lit
    });
  }, [focusId, landedId, year, lens, personal, workId, ego]);

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

  const recs = useMemo(
    () =>
      recommend(personal, dataset.authors, dataset.relations, (a) => a.difficulty, {
        region: (id) => regionLabel(id, "ko"),
        language: (code) => languageLabel(code, "ko")
      }),
    [personal, dataset]
  );

  const toggle = useCallback((key: "read" | "want", id: string) => {
    setPersonal((p) => {
      const next = { ...p, read: { ...p.read }, want: { ...p.want } };
      if (next[key][id]) delete next[key][id];
      else next[key][id] = Date.now();
      if (key === "read" && next.read[id]) delete next.want[id];
      return next;
    });
  }, []);

  const landable = (id: string): boolean => Boolean(art?.grounds?.[id]);
  const maxDeg = Math.max(1, ...Object.values(degree));

  const readCount = Object.keys(personal.read).length;

  return (
    <div className="universe">
      <div className="universe__stage" ref={hostRef} />

      <header className="u-top">
        <h1>문학의 성계</h1>
        <span className="u-stage" data-stage={stage}>
          {STAGE_KO[stage]}
        </span>
        <div className="u-search">
          <input
            type="search"
            placeholder="별 찾기"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="작가 검색"
          />
          {hits.length > 0 && (
            <ul className="u-search__hits">
              {hits.map((h) => (
                <li key={h.author.id}>
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

      <nav className="u-lenses" aria-label="관측층">
        <p className="u-lenses__title">관측층</p>
        {LENSES.map((l) => (
          <button
            key={l.id}
            className={`u-lens ${lensId === l.id ? "is-on" : ""}`}
            onClick={() => setLensId(lensId === l.id ? null : l.id)}
            title={l.hint}
          >
            {l.ko}
          </button>
        ))}
        {lens && lens.groups.length ? (
          <ul className="u-lens-groups">
            {lens.groups.slice(0, 6).map((g) => (
              <li key={g.id}>
                <span className="u-dot" style={{ background: g.color }} aria-hidden="true" />
                {g.label} <em>{g.memberIds.length}</em>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="u-lenses__note">
          성좌는 데이터에 새겨진 소속이 아니라 켜져 있는 렌즈의 산물이다. 한 별은 여러 하늘에
          속한다.
        </p>
      </nav>

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

      <section className="u-mine">
        <h2>나의 성좌</h2>
        <p>
          읽음 <strong>{readCount}</strong> · 궤도 <strong>{Object.keys(personal.want).length}</strong>
        </p>
        {recs.length ? (
          <>
            <h3>다음 독서</h3>
            <ul className="u-recs">
              {recs.map((r) => {
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
          </>
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
        {shared && <p className="u-mine__shared">다른 독자의 성좌를 보고 있다 (읽기 전용)</p>}
      </section>

      {focus && !landed && (
        <OrbitCard
          author={focus}
          works={focusWorks}
          relations={focusRelations}
          art={art}
          landable={landable(focus.id)}
          read={Boolean(personal.read[focus.id])}
          want={Boolean(personal.want[focus.id])}
          onToggleRead={() => toggle("read", focus.id)}
          onToggleWant={() => toggle("want", focus.id)}
          onLand={() => setLandedId(focus.id)}
          onGoto={(id) => setFocusId(id)}
          onClose={() => setFocusId(null)}
        />
      )}

      {landed && (
        <aside className="u-card u-card--landing" aria-label={`${landed.names.ko} 표면`}>
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
        </aside>
      )}
    </div>
  );
}
