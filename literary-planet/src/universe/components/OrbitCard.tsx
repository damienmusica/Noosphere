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
// 사물 초상 → 비인물적 타이포그래피 명판. 이 프로토타입은 1단(3인)과
// 4단(97인)을 구현한다; 2·3단은 자산 수집이 선행이다.

import { useEffect, useRef } from "react";
import type { Author, Relation, Work } from "../../types.ts";
import { artUrl, type ArtManifest } from "../../globe/art-assets.ts";
import { periodOf } from "../grammar.ts";
import { PERIOD_TINT, COLORS } from "../../theme.ts";

export interface SkyMembership {
  lens: string;
  group: string;
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
  read: boolean;
  want: boolean;
  onToggleRead(): void;
  onToggleWant(): void;
  onLand(): void;
  onGoto(id: string): void;
  onClose(): void;
}

/** 사다리 1단 — 권리 확인 기록 사진 */
function ArchivalPortrait({ file }: { file: string }) {
  return (
    <figure className="u-portrait u-portrait--archival">
      <img src={artUrl(file)} alt="" />
      <figcaption>기록 사진</figcaption>
    </figure>
  );
}

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
          광도 {star.magnitude.toFixed(2)} · {periodOf(author)}({author.anchorYear})
        </span>
        <span>
          관계 {counts.relations} · 작품 {counts.works} · 초판 {counts.covers} · 육필 없음
        </span>
      </div>
      <figcaption>기록 초상 없음 — 미해상</figcaption>
    </figure>
  );
}

const REL_KO: Record<string, string> = {
  documented_influence: "영향",
  translation: "번역",
  mentorship: "사사",
  dialogue: "대화",
  affinity: "친연",
  contrast: "대비"
};

export function OrbitCard(p: OrbitCardProps) {
  const a = p.author;
  const tint = PERIOD_TINT[periodOf(a)];
  const archival = p.art?.archival?.[a.id];
  const order = a.readingOrder.length ? a.readingOrder : p.works.map((w) => w.id);
  const ordered = order
    .map((id) => p.works.find((w) => w.id === id))
    .filter((w): w is Work => Boolean(w));
  const rest = p.works.filter((w) => !order.includes(w.id));
  const reading = [...ordered, ...rest];
  const covers = p.works.filter((w) => p.art?.covers?.[w.id]).length;

  return (
    <aside className="u-card" data-author={a.id} aria-label={`${a.names.ko} 궤도 정보`}>
      <button className="u-card__close" onClick={p.onClose} aria-label="닫기">
        ×
      </button>
      <header className="u-card__head">
        {archival ? (
          <ArchivalPortrait file={archival.file} />
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
            {a.birthYear ?? "?"}–{a.deathYear ?? "현재"} · {a.languages.join("·")} ·{" "}
            {a.regions.join("·")}
          </p>
        </div>
      </header>

      {/* 문은 접힘선 위에 있어야 한다 — 긴 궤도 관측 아래로 내려가면 R9 의
          "자동 스크롤이 발견을 제조한다" 함정이 그대로 재현된다 */}
      <div className="u-card__acts">
        <button
          className={`u-btn ${p.read ? "is-on" : ""}`}
          onClick={p.onToggleRead}
          disabled={p.readOnly}
          title={p.readOnly ? "다른 독자의 성좌를 보는 중 — 내 성좌로 복사한 뒤 표시할 수 있다" : undefined}
        >
          {p.read ? "읽음 ✓" : "읽음 표시"}
        </button>
        <button
          className={`u-btn ${p.want ? "is-on" : ""}`}
          onClick={p.onToggleWant}
          disabled={p.readOnly}
          title={p.readOnly ? "다른 독자의 성좌를 보는 중 — 내 성좌로 복사한 뒤 담을 수 있다" : undefined}
        >
          {p.want ? "궤도에 있음" : "읽고 싶음"}
        </button>
        {p.landable ? (
          <button className="u-btn u-btn--land" onClick={p.onLand} data-testid="land">
            착륙
          </button>
        ) : null}
      </div>

      <p className="u-card__ready" data-testid="readiness">
        {p.landable ? (
          <>
            착륙지 <strong>준비됨</strong> — 검수 {p.readiness?.verifiedAt ?? "완료"} · 기준{" "}
            {p.readiness?.met.length ?? 0}/4 충족 · 초판 도시 {covers}종
          </>
        ) : (
          <>
            착륙지 <strong>미준비</strong>({p.readiness?.state ?? "not-started"}) — 이 작가는
            항성과 궤도 아카이브로 존재한다. 표면은 검수된 뒤에 열린다.
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
        <h3>독서 순서 {reading.length}</h3>
        <ol>
          {reading.map((w, i) => (
            <li key={w.id} className={w.id === a.readingEntry ? "is-entry" : ""}>
              <strong>{w.titleKo}</strong>
              <span className="u-year">{w.year}</span>
              {p.art?.covers?.[w.id] ? <span className="u-tag">초판</span> : null}
              {i === 0 ? <p className="u-card__entry-why">{a.readingEntryReason}</p> : null}
              <p className="u-works__sig">{w.significance}</p>
            </li>
          ))}
        </ol>
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

      {p.relations.length ? (
        <div className="u-card__rel">
          <h3>관계 {p.relations.length}</h3>
          <ul>
            {p.relations.map(({ rel, other }) => (
              <li key={rel.id}>
                <button onClick={() => p.onGoto(other.id)}>
                  <span className="u-tag u-tag--rel">{REL_KO[rel.type] ?? rel.type}</span>
                  {other.names.ko}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="u-card__src">
        출처 {a.sourceIds.length}건 · {a.reviewStatus}
      </p>

    </aside>
  );
}
