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

import type { Author, Relation, Work } from "../../types.ts";
import { artUrl, type ArtManifest } from "../../globe/art-assets.ts";
import { sealGlyph } from "../../lib/seal.ts";
import { periodOf } from "../grammar.ts";
import { PERIOD_TINT } from "../../theme.ts";

export interface SkyMembership {
  lens: string;
  group: string;
}

export interface OrbitCardProps {
  author: Author;
  works: Work[];
  relations: Array<{ rel: Relation; other: Author }>;
  art: ArtManifest | null;
  /** 착륙지가 준비됐는가 = 육필 지각 자산 보유 */
  landable: boolean;
  /** 이 별이 속한 하늘들 — 관측층이 데이터에서 파생한 소속 */
  skies: SkyMembership[];
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
 * 사다리 4단 — 비인물적 타이포그래피 명판. 얼굴을 발명하지 않는다.
 * 인장 글리프는 원어 성씨에서 파생한 활자이지 초상이 아니다.
 */
function TypePlate({ author }: { author: Author }) {
  return (
    <figure className="u-portrait u-portrait--type" data-testid="type-plate">
      <div className="u-typeplate">
        <span className="u-typeplate__seal" aria-hidden="true">
          {sealGlyph(author.id, author.names.original)}
        </span>
        <span className="u-typeplate__name">{author.names.original}</span>
        <span className="u-typeplate__life">
          {author.birthYear ?? "?"}–{author.deathYear ?? ""}
        </span>
      </div>
      <figcaption>기록 초상 없음 · 활자 명판</figcaption>
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
        {archival ? <ArchivalPortrait file={archival.file} /> : <TypePlate author={a} />}
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
        <button className={`u-btn ${p.read ? "is-on" : ""}`} onClick={p.onToggleRead}>
          {p.read ? "읽음 ✓" : "읽음 표시"}
        </button>
        <button className={`u-btn ${p.want ? "is-on" : ""}`} onClick={p.onToggleWant}>
          {p.want ? "궤도에 있음" : "읽고 싶음"}
        </button>
        {p.landable ? (
          <button className="u-btn u-btn--land" onClick={p.onLand} data-testid="land">
            착륙
          </button>
        ) : null}
      </div>

      <p className="u-card__ready" data-testid="readiness">
        {p.landable
          ? `착륙지 준비됨 — 육필 지각과 초판 도시 ${covers}종`
          : `착륙지 미준비 — 육필 지각 없음 · 실물 초판 ${covers}종. 준비되지 않은 표면에는 내려앉지 않는다.`}
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
