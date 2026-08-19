// 궤도 카드 — **모든 별**이 갖는 최소 정보. 착륙지가 준비되지 않았다는 것이
// 정보가 없다는 뜻이 되면 안 된다(정전화 편향 방지, CPO 보정 ③).
//
// 초상 · 핵심 작품 · 짧은 해설 · 관계 · 출처 — 이 다섯은 100/100 작가가 갖는다.
// 없는 것은 없다고 쓴다: 기록 사진이 있는 작가는 "기록 사진", 없으면 "상상 초상".

import { useEffect, useRef, useState } from "react";
import type { Author, Relation, Work } from "../../types.ts";
import { duotoneInto } from "../../lib/duotone.ts";
import { artUrl, type ArtManifest } from "../../globe/art-assets.ts";
import { periodOf } from "../grammar.ts";
import { PERIOD_TINT } from "../../theme.ts";

export interface OrbitCardProps {
  author: Author;
  works: Work[];
  relations: Array<{ rel: Relation; other: Author }>;
  art: ArtManifest | null;
  landable: boolean;
  read: boolean;
  want: boolean;
  onToggleRead(): void;
  onToggleWant(): void;
  onLand(): void;
  onGoto(id: string): void;
  onClose(): void;
}

function Portrait({ author, art }: { author: Author; art: ArtManifest | null }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const archival = art?.archival?.[author.id];
  useEffect(() => {
    if (archival) return;
    const canvas = ref.current;
    if (!canvas) return;
    setFailed(false);
    const img = new Image();
    img.onload = () => {
      if (ref.current === canvas) {
        duotoneInto(canvas, img);
        canvas.dataset.ready = "1";
      }
    };
    img.onerror = () => setFailed(true);
    img.src = `${import.meta.env.BASE_URL}portraits/${author.id}.jpg`;
  }, [author.id, archival]);

  if (archival)
    return (
      <figure className="u-portrait u-portrait--archival">
        <img src={artUrl(archival.file)} alt="" />
        <figcaption>기록 사진</figcaption>
      </figure>
    );
  if (failed) return null;
  return (
    <figure className="u-portrait">
      <canvas ref={ref} aria-hidden="true" />
      <figcaption>상상 초상</figcaption>
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
  const entry = p.works.find((w) => w.id === a.readingEntry) ?? p.works[0];
  const tint = PERIOD_TINT[periodOf(a)];
  return (
    <aside className="u-card" data-author={a.id} aria-label={`${a.names.ko} 궤도 정보`}>
      <button className="u-card__close" onClick={p.onClose} aria-label="닫기">
        ×
      </button>
      <header className="u-card__head">
        <Portrait author={a} art={p.art} />
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

      <p className="u-card__why">{a.importanceReason}</p>

      {entry ? (
        <div className="u-card__entry">
          <span className="u-tag">입문</span>
          <strong>{entry.titleKo}</strong>
          <span className="u-year">{entry.year}</span>
          <p>{a.readingEntryReason}</p>
        </div>
      ) : null}

      {p.relations.length ? (
        <div className="u-card__rel">
          <h3>관계 {p.relations.length}</h3>
          <ul>
            {p.relations.slice(0, 6).map(({ rel, other }) => (
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

      <p className="u-card__src">출처 {a.sourceIds.length}건 · {a.reviewStatus}</p>

      <div className="u-card__acts">
        <button className={`u-btn ${p.read ? "is-on" : ""}`} onClick={p.onToggleRead}>
          {p.read ? "읽음 ✓" : "읽음 표시"}
        </button>
        <button className={`u-btn ${p.want ? "is-on" : ""}`} onClick={p.onToggleWant}>
          {p.want ? "궤도에 있음" : "읽고 싶음"}
        </button>
        <button className="u-btn u-btn--land" onClick={p.onLand} data-testid="land">
          착륙
        </button>
      </div>
      <p className="u-card__ready">
        {p.landable
          ? "착륙지 준비됨 — 육필 지각과 초판 도시가 있다"
          : "착륙 가능 · 지각은 아직 백지다 (실물 자료 수집 전)"}
      </p>
    </aside>
  );
}
