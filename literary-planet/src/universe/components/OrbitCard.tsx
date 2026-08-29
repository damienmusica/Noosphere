// 궤도 카드 — **모든 별**이 갖는 관측 정보.
//
// 3단 계약 (R11-b, 외부 리뷰 지적 ②):
//   · 전원        → 궤도 카드
//   · 자산 미준비 → 풍부한 궤도 관측 (착륙 없음)
//   · 준비 완료   → 착륙 CTA
// 백지 지각에 실제로 내려앉게 두면 R10 의 이니셜 플레이스홀더 문제를 우주
// 뒤로 옮긴 것일 뿐이다. 준비되지 않은 곳에는 내려앉지 않는 것이 정직하다.
//
// 초상 사다리 (R9 개정안, CPO 2026-08-20 판정): **상상된 인간 얼굴은 최종
// 자산으로 쓰지 않는다.** 권리 확인 실제 초상 → 실제 문헌·사물 → 근거 있는
// 사물 초상 → 비인물적 타이포그래피 명판. R12 서명 파도(CPO 룰링 C·E,
// 2026-08-24)로 2단이 열렸다: 권리 확인된 **서명**은 실물 기록이고, 창작성 문턱
// 아래라 사망 연도와 무관하게 쓸 수 있다. 지금 1단 3인 · 2단 59인 · 4단 38인.

import { useEffect, useRef } from "react";
import type { Author, Relation, Work } from "../../types.ts";
import { artUrl, type ArtManifest, type AssetProvenance } from "../../globe/art-assets.ts";
import { periodOf } from "../grammar.ts";
import { EVIDENCE_KO, REL_KO, anchorChips, relationGlyph, sortRelations } from "../relations.ts";
import { PERIOD_TINT, COLORS } from "../../theme.ts";

export interface SkyMembership {
  lens: string;
  group: string;
}

/** 책 한 권의 개인 기록(v2) — 궤도 카드와 착륙 서가가 같은 표면을 쓴다.
 *  읽음이 켜지면 같은 책의 담음은 지워진다(규칙은 토글 핸들러 쪽에 있다). */
export function WorkMarks(p: {
  read: boolean;
  want: boolean;
  readOnly: boolean;
  onToggle(kind: "read" | "want"): void;
}) {
  const hint = p.readOnly
    ? "다른 독자의 성좌를 보는 중 — 내 성좌로 복사한 뒤 표시할 수 있다"
    : undefined;
  return (
    <span className="u-wmark" data-testid="work-marks">
      <button
        className={p.read ? "is-on" : ""}
        disabled={p.readOnly}
        title={hint}
        onClick={() => p.onToggle("read")}
      >
        {p.read ? "읽음 ✓" : "읽음"}
      </button>
      <button
        className={p.want ? "is-on" : ""}
        disabled={p.readOnly}
        title={hint}
        onClick={() => p.onToggle("want")}
      >
        {p.want ? "담아 둠" : "읽고 싶음"}
      </button>
    </span>
  );
}

export interface OrbitCardProps {
  author: Author;
  works: Work[];
  relations: Array<{ rel: Relation; other: Author }>;
  art: ArtManifest | null;
  /** 착륙지가 준비됐는가 = 명시적 검증 상태(data/depth-readiness.json) */
  landable: boolean;
  /** 준비도 상태와 근거 — 없으면 not-started */
  readiness: { state: string; met: string[]; verifiedAt?: string; note?: string } | null;
  /** 다른 독자의 공유 성좌를 보는 중 — 개인 상태를 바꿀 수 없다 */
  readOnly: boolean;
  /** 이 별이 속한 하늘들 — 관측층이 데이터에서 파생한 소속 */
  skies: SkyMembership[];
  /** 하늘에 그려지는 그 별의 실제 값 — 미해상 기록이 같은 값으로 다시 그린다 */
  star: { px: number; color: string; magnitude: number };
  /** 개인 기록은 책에 붙는다(v2) — 작가 단위 표시는 없다 */
  workRead(id: string): boolean;
  workWant(id: string): boolean;
  onToggleWork(kind: "read" | "want", id: string): void;
  onLand(): void;
  onGoto(id: string): void;
  /** 관계 행에 얹거나 포커스가 가면 그 별을 지목한다 — 하늘에 실 한 가닥이
   *  걸리고 "왜"가 무대에 적힌다. 지금까지 지목 수단은 캔버스 호버뿐이라
   *  키보드 사용자에게는 아예 없었고, 카드 행은 데스크톱에서도 무반응이었다. */
  onPeek(id: string | null): void;
  onClose(): void;
  /** 작품 id → 한국어 제목 (앵커 칩용; 상대 작가의 작품일 수 있다) */
  workTitle(id: string): string | undefined;
}

/** 사다리 1단 — 권리 확인 기록 사진. 근거는 **사진이 보이는 이 표면**이 싣는다 */
function ArchivalPortrait({
  file,
  provenance
}: {
  file: string;
  provenance?: AssetProvenance | null;
}) {
  return (
    <figure className="u-portrait u-portrait--archival">
      <img src={artUrl(file)} alt="" />
      <figcaption>
        기록 사진
        {provenance ? (
          <details className="u-prov u-prov--inline" data-testid="portrait-provenance">
            <summary>근거</summary>
            <span className="u-prov__title">{provenance.title ?? "제목 미기재"}</span>
            <span className="u-prov__meta">
              {provenance.collection ?? "소장처 미기재"} · {provenance.licence ?? "라이선스 미기재"}
              {provenance.pageUrl ? (
                <>
                  {" · "}
                  <a href={provenance.pageUrl} target="_blank" rel="noopener noreferrer">
                    원본 파일 페이지
                  </a>
                </>
              ) : null}
            </span>
          </details>
        ) : null}
      </figcaption>
    </figure>
  );
}

/**
 * 사다리 2단 — **서명 기록**. 얼굴은 없지만 실물이 있다: 그 사람의 손이 남긴
 * 이름. 근거는 사진과 같은 형식으로 **이 표면**이 싣는다. 별의 측광 기록
 * (미해상 기록의 값)은 그대로 아래에 남긴다 — 서명이 광도·시대를 대신하지 않는다.
 */
function MarkRecord({
  file,
  provenance,
  author,
  star,
  counts
}: {
  file: string;
  provenance?: AssetProvenance | null;
  author: Author;
  star: { px: number; color: string; magnitude: number };
  counts: { relations: number; works: number; covers: number };
}) {
  return (
    <figure className="u-portrait u-portrait--mark" data-testid="mark-record">
      <img src={artUrl(file)} alt={`${author.names.ko}의 서명`} />
      <div className="u-record">
        <span className="u-record__name">{author.names.original}</span>
        <span>
          광도 {star.magnitude.toFixed(2)} (영향력) · {PERIOD_KO[periodOf(author)] ?? periodOf(author)}{" "}
          {author.anchorYear}
        </span>
        <span>
          관계 {counts.relations} · 작품 {counts.works} · 초판 실물 {counts.covers} · 육필 없음
        </span>
      </div>
      <figcaption>
        서명 · 실물 기록
        {provenance ? (
          <details className="u-prov u-prov--inline" data-testid="mark-provenance">
            <summary>근거</summary>
            <span className="u-prov__title">{provenance.title ?? "제목 미기재"}</span>
            <span className="u-prov__meta">
              {provenance.collection ?? "소장처 미기재"} · {provenance.licence ?? "라이선스 미기재"}
              {provenance.pageUrl ? (
                <>
                  {" · "}
                  <a href={provenance.pageUrl} target="_blank" rel="noopener noreferrer">
                    원본 파일 페이지
                  </a>
                </>
              ) : null}
            </span>
          </details>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** 시대층의 한국어 이름 — 카드는 독자에게 말하지, 코드 값(`early-modernism`)을 내보이지 않는다 */
const PERIOD_KO: Record<string, string> = {
  roots: "19세기 이전",
  "early-modernism": "모더니즘 초기",
  "mid-century": "20세기 중반",
  "late-postmodern": "후기·포스트모던",
  contemporary: "동시대"
};

/**
 * 사다리 4단 — **미해상 기록(未解像 記錄)**. 얼굴도, 문장(紋章)도, 성씨에서
 * 파생한 글자도 없다.
 *
 * 천문학은 "목록에 있으나 해상되지 않은 천체"에 대해 그림을 내놓지 않는다 —
 * 측광 기록을 내놓는다. 그래서 초상 자리에 그 작가의 **별 자체**를 프로덕션과
 * 같은 값으로 그리고(크기=광도, 색=시대), 나머지는 /data 에 실재하는 항목만
 * 적는다. 이전의 인장 글리프는 성씨 이니셜에서 파생한 근거 없는 문양이었고,
 * CPO 판정(2026-08-20)으로 폐기됐다.
 */
function UnresolvedRecord({
  author,
  star,
  counts
}: {
  author: Author;
  star: { px: number; color: string; magnitude: number };
  counts: { relations: number; works: number; covers: number };
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = 96;
    c.width = size * dpr;
    c.height = size * dpr;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, size, size);
    // 하늘의 별과 같은 닫힌 형태: 코어 + 회절 스파이크. 링·글로우 없음.
    const cx = size / 2;
    const cy = size / 2;
    const r = Math.max(6, star.px * 0.9);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, star.color);
    g.addColorStop(0.35, `${star.color}b0`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    if (star.magnitude > 0.55) {
      ctx.strokeStyle = `${star.color}66`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - r * 1.7, cy);
      ctx.lineTo(cx + r * 1.7, cy);
      ctx.moveTo(cx, cy - r * 1.7);
      ctx.lineTo(cx, cy + r * 1.7);
      ctx.stroke();
    }
    c.dataset.ready = "1";
  }, [author.id, star.px, star.color, star.magnitude]);

  return (
    <figure className="u-portrait u-portrait--unresolved" data-testid="unresolved-record">
      <canvas ref={ref} width={96} height={96} aria-hidden="true" />
      <div className="u-record">
        <span className="u-record__name">{author.names.original}</span>
        <span>
          {author.birthYear ?? "?"}–{author.deathYear ?? ""} · {author.languages.join("·")}
        </span>
        <span>
          광도 {star.magnitude.toFixed(2)} (영향력) · {PERIOD_KO[periodOf(author)] ?? periodOf(author)}{" "}
          {author.anchorYear}
        </span>
        <span>
          관계 {counts.relations} · 작품 {counts.works} · 초판 실물 {counts.covers} · 육필 없음
        </span>
      </div>
      <figcaption>기록 초상 없음 — 미해상</figcaption>
    </figure>
  );
}

/** 글리프의 스크린리더 이름 — 화살표 문자는 읽히지 않는다 */
const GLYPH_KO: Record<string, string> = {
  "→": "이 작가가 출발점",
  "←": "상대가 출발점",
  "↔": "방향 없는 관계"
};

export function OrbitCard(p: OrbitCardProps) {
  const a = p.author;
  const tint = PERIOD_TINT[periodOf(a)];
  const archival = p.art?.archival?.[a.id];
  const mark = p.art?.marks?.[a.id] ?? p.art?.signatures?.[a.id];
  // 입문 순서는 **편집이 실제로 지목한 것**(readingOrder)만이다. 이전 판은
  // 나머지 작품을 뒤에 이어 붙여 "독서 순서 5"로 번호를 매겼다 — 큐레이션의
  // 부재를 큐레이션으로 위장한 것이고, 착륙 서가는 같은 작품을 "입문 경로
  // 밖"이라며 뒷단에 내리므로 두 표면이 서로 모순이었다. 여기서 갈라 둔다.
  const ordered = a.readingOrder
    .map((id) => p.works.find((w) => w.id === id))
    .filter((w): w is Work => Boolean(w));
  const rest = p.works
    .filter((w) => !a.readingOrder.includes(w.id))
    .sort((x, y) => x.year - y.year);
  const covers = p.works.filter((w) => p.art?.covers?.[w.id]).length;

  return (
    <aside className="u-card" data-author={a.id} aria-label={`${a.names.ko} 궤도 정보`} tabIndex={-1}>
      <button className="u-card__close" onClick={p.onClose} aria-label="닫기">
        ×
      </button>
      <header className="u-card__head">
        {archival ? (
          <ArchivalPortrait file={archival.file} provenance={archival.provenance ?? null} />
        ) : mark ? (
          <MarkRecord
            file={mark.file}
            provenance={mark.provenance ?? null}
            author={a}
            star={p.star}
            counts={{ relations: p.relations.length, works: p.works.length, covers }}
          />
        ) : (
          <UnresolvedRecord
            author={a}
            star={p.star}
            counts={{ relations: p.relations.length, works: p.works.length, covers }}
          />
        )}
        <div>
          <h2>{a.names.ko}</h2>
          <p className="u-card__orig">{a.names.original}</p>
          <p className="u-card__life">
            <span className="u-dot" style={{ background: tint }} aria-hidden="true" />
            {a.birthYear ?? "?"}–{a.deathYear ?? ""} · {a.languages.join("·")} ·{" "}
            {a.regions.join("·")}
          </p>
        </div>
      </header>

      {/* 문은 접힘선 위에 있어야 한다 — 긴 궤도 관측 아래로 내려가면 R9 의
          "자동 스크롤이 발견을 제조한다" 함정이 그대로 재현된다.
          읽음·읽고 싶음은 여기 없다 — "카프카를 읽었다"는 어느 책인지 말하지
          못하는 주장이라, 기록은 아래 작품 행마다 붙는다(v2). */}
      {p.landable ? (
        <div className="u-card__acts">
          <button className="u-btn u-btn--land" onClick={p.onLand} data-testid="land">
            착륙
          </button>
        </div>
      ) : null}

      <p className="u-card__ready" data-testid="readiness">
        {p.landable ? (
          <>
            착륙지 <strong>준비됨</strong> — 육필 지각 · 초판 실물 {covers}종 · 기록 사진 ·
            문구 검수 {p.readiness?.verifiedAt ?? "완료"}
          </>
        ) : (
          <>
            착륙지 <strong>미준비</strong> — 육필·초판 같은 실물 자료를 아직 검수하지 못했다.
            이 궤도에서 읽는 것이 이 작가의 전부이고, 전부 실제 자료다.
          </>
        )}
      </p>

      <p className="u-card__why">{a.importanceReason}</p>

      {p.skies.length ? (
        <p className="u-card__skies">
          속한 하늘 —{" "}
          {p.skies.map((s, i) => (
            <span key={`${s.lens}:${s.group}`}>
              {i ? " · " : ""}
              <em>{s.group}</em>
              <span className="u-card__skies-lens">{s.lens}</span>
            </span>
          ))}
        </p>
      ) : null}

      {/* 궤도 관측 — 착륙하지 않아도 이 작가를 읽을 수 있는 전부 */}
      <div className="u-card__reading" data-testid="orbit-reading">
        <h3>입문 순서 {ordered.length}</h3>
        <ol>
          {ordered.map((w, i) => (
            <li key={w.id} className={w.id === a.readingEntry ? "is-entry" : ""}>
              <strong>{w.titleKo}</strong>
              <span className="u-year">{w.year}</span>
              {p.art?.covers?.[w.id] ? <span className="u-tag">초판</span> : null}
              <WorkMarks
                read={p.workRead(w.id)}
                want={p.workWant(w.id)}
                readOnly={p.readOnly}
                onToggle={(kind) => p.onToggleWork(kind, w.id)}
              />
              {i === 0 ? <p className="u-card__entry-why">{a.readingEntryReason}</p> : null}
              <p className="u-works__sig">{w.significance}</p>
            </li>
          ))}
        </ol>
        {rest.length ? (
          <div className="u-card__rest" data-testid="orbit-rest">
            <h3>그 밖의 작품 {rest.length}</h3>
            <ul>
              {rest.map((w) => (
                <li key={w.id}>
                  <strong>{w.titleKo}</strong>
                  <span className="u-year">{w.year}</span>
                  {p.art?.covers?.[w.id] ? <span className="u-tag">초판</span> : null}
                  <WorkMarks
                    read={p.workRead(w.id)}
                    want={p.workWant(w.id)}
                    readOnly={p.readOnly}
                    onToggle={(kind) => p.onToggleWork(kind, w.id)}
                  />
                  <p className="u-works__sig">{w.significance}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {a.readingWarning ? (
          <p className="u-card__warn">
            <span className="u-tag u-tag--warn">주의</span>
            {a.readingWarning}
          </p>
        ) : null}
        <p className="u-card__diff">
          난도 {a.difficulty}/5 — {a.difficultyReason}
        </p>
      </div>

      {/* 관계 — 선은 왜 그어졌는가. 이름만 나열하면 독자는 "관련 있다"까지만
          읽고 방향도 이유도 못 읽는다(합성 파일럿 4/4 · 외부 검토 2차). 각 행은
          방향 글리프 · 유형 · 상대 · **요약문** · 근거 등급을 싣고, 강한 근거가
          먼저 온다. 이것이 미준비 궤도의 "왜 이 별에 다시 와야 하는가" 단서다. */}
      {p.relations.length ? (
        <div className="u-card__rel" data-testid="orbit-relations">
          <h3>관계 {p.relations.length} — 선이 그어진 이유</h3>
          <ul>
            {sortRelations(p.relations).map(({ rel, other }) => {
              const glyph = relationGlyph(rel, a.id);
              return (
                <li
                  key={rel.id}
                  data-relation={rel.id}
                  data-direction={glyph}
                  data-evidence={rel.evidenceLevel}
                >
                  <button
                    onClick={() => p.onGoto(other.id)}
                    onMouseEnter={() => p.onPeek(other.id)}
                    onFocus={() => p.onPeek(other.id)}
                    onMouseLeave={() => p.onPeek(null)}
                    onBlur={() => p.onPeek(null)}
                  >
                    <span className="u-rel__glyph" aria-label={GLYPH_KO[glyph]}>
                      {glyph}
                    </span>
                    <span className="u-tag u-tag--rel">{REL_KO[rel.type] ?? rel.type}</span>
                    {other.names.ko}
                    {anchorChips(rel, p.workTitle).map((chip) => (
                      <span key={chip} className="u-rel__anchor" data-testid="anchor-chip">
                        {chip}
                      </span>
                    ))}
                  </button>
                  <p className="u-rel__why">
                    {rel.summary}
                    <span className="u-rel__ev">
                      {EVIDENCE_KO[rel.evidenceLevel] ?? rel.evidenceLevel}
                      {rel.sourceIds.length ? ` · 출처 ${rel.sourceIds.length}건` : ""}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <p className="u-card__src">
        출처 {a.sourceIds.length}건 · {a.reviewStatus}
      </p>

    </aside>
  );
}
