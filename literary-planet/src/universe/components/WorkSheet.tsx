// 작품 시트 (R12 작품 세계) — 책을 눌러 얻는 것이 `significance` 한 문장뿐이던
// 자리. 외부 검토 2차: "작품 세계가 없다". 실물 자료로 쓴 한 장을 싣는다:
//   · 여는 문장 — 원문 그대로 + **자체 번역**(기존 번역은 저작물이다. 번역임을 숨기지
//     않는다 — 표지는 그들 것, 슬립은 우리 것)
//   · 집필 시기 · 첫 인쇄 · 초판 · 유고 출간 경위 — 전부 출처를 단다
// 자료가 없는 작품은 없다고 적는다. 만들지 않은 것을 만들지 않았다고 적는 것이
// 이 프로젝트의 버릇이다.

import type { Source, Work, WorkEdition } from "../../types.ts";

const KIND_KO: Record<WorkEdition["kind"], string> = {
  "first-printing": "첫 인쇄",
  "first-edition": "초판"
};

function editionLine(e: WorkEdition): string {
  const when = e.month ? `${e.year}. ${e.month}.` : String(e.year);
  const where = `${e.venue ? `${e.venue} · ` : ""}${e.publisher}, ${e.place}`;
  return `${when} · ${where}${e.series ? ` · ${e.series}` : ""}${e.note ? ` — ${e.note}` : ""}`;
}

export function WorkSheet({
  work,
  lang,
  sourceOf
}: {
  work: Work;
  /** 원문의 언어 코드 — 스크린리더와 서체 선택용 */
  lang: string;
  sourceOf: (id: string) => Source | undefined;
}) {
  const w = work.world;
  const cited = w
    ? Array.from(
        new Set([
          w.opening.sourceId,
          ...w.editions.flatMap((e) => e.sourceIds),
          ...(w.posthumous?.sourceIds ?? [])
        ])
      )
    : [];
  return (
    <div className="u-work" data-testid="work-world" data-work={work.id} data-has-world={w ? "1" : "0"}>
      <p className="u-works__sig">{work.significance}</p>
      {w ? (
        <>
          <blockquote className="u-work__open">
            <p className="u-work__orig" lang={lang}>
              {w.opening.original}
            </p>
            <p className="u-work__ko">{w.opening.ko}</p>
            <span className="u-work__tag">여는 문장 · 자체 번역</span>
          </blockquote>
          {w.written ? (
            <p className="u-work__row">
              <span className="u-work__k">집필</span>
              {w.written}
            </p>
          ) : null}
          <ul className="u-work__eds" data-testid="work-editions">
            {w.editions.map((e, i) => (
              <li key={`${e.kind}-${e.year}-${i}`} data-kind={e.kind}>
                <span className="u-work__k">{KIND_KO[e.kind]}</span>
                {editionLine(e)}
              </li>
            ))}
          </ul>
          {w.posthumous ? (
            <p className="u-work__row u-work__post" data-testid="work-posthumous">
              <span className="u-work__k">유고</span>
              {w.posthumous.editor} 편 — {w.posthumous.note}
            </p>
          ) : null}
          <details className="u-prov u-prov--inline" data-testid="work-sources">
            <summary>근거 {cited.length}건</summary>
            <ul>
              {cited.map((id) => {
                const s = sourceOf(id);
                return (
                  <li key={id}>
                    {s?.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.title}
                      </a>
                    ) : (
                      s?.title ?? id
                    )}
                  </li>
                );
              })}
            </ul>
          </details>
        </>
      ) : (
        <p className="u-work__none">여는 문장·판본 자료는 아직 이 작품에 없다.</p>
      )}
    </div>
  );
}
