// R11 개인 성좌 — 독자가 자기 정신의 지도를 만드는 층.
//
// 경계(하드 제약 준수): 계정 없음 · 서버 없음 · DB 없음. 전부 이 브라우저의
// localStorage 에만 있고, 공유는 URL 안에 상태를 넣어 보내는 방식이라
// 어떤 것도 저장소나 /data 에 기입되지 않는다. 독서 표시는 **상태이지
// 게시물이 아니다** — 독자가 쓴 문장을 우리 잉크로 렌더하는 기능(개인 연결
// 생성)은 UGC 경계에 걸리므로 이 층에 포함하지 않았다.

import type { Author, Relation } from "../types.ts";

const KEY = "lp.universe.personal.v1";

export interface PersonalState {
  v: 1;
  /** authorId → 읽은 시각(ms) */
  read: Record<string, number>;
  /** authorId → 담은 시각(ms) */
  want: Record<string, number>;
}

export function emptyPersonal(): PersonalState {
  return { v: 1, read: {}, want: {} };
}

export function loadPersonal(): PersonalState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyPersonal();
    const p = JSON.parse(raw) as PersonalState;
    if (p.v !== 1 || typeof p.read !== "object") return emptyPersonal();
    return { v: 1, read: p.read ?? {}, want: p.want ?? {} };
  } catch {
    return emptyPersonal();
  }
}

export function savePersonal(p: PersonalState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* private mode — the constellation simply does not persist */
  }
}

/** 읽은 순서 = 표시한 순서. 성좌의 선은 이 순서를 따라 이어진다. */
export function readOrder(p: PersonalState): string[] {
  return Object.entries(p.read)
    .sort((a, b) => a[1] - b[1])
    .map(([id]) => id);
}

// ---------------------------------------------------------------------------
// 공유 — 서버 없이 링크 안에 성좌를 담는다
// ---------------------------------------------------------------------------

export function encodeShare(p: PersonalState): string {
  const r = readOrder(p).join(",");
  const w = Object.keys(p.want).join(",");
  return btoa(unescape(encodeURIComponent(`r=${r}&w=${w}`)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeShare(code: string): PersonalState | null {
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const txt = decodeURIComponent(escape(atob(b64)));
    const params = new URLSearchParams(txt);
    const out = emptyPersonal();
    let t = 1;
    for (const id of (params.get("r") ?? "").split(",").filter(Boolean)) out.read[id] = t++;
    for (const id of (params.get("w") ?? "").split(",").filter(Boolean)) out.want[id] = t++;
    return out;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 다음 독서 추천 — 블랙박스 금지. 모든 추천은 왜 추천됐는지 문장을 갖는다.
// ---------------------------------------------------------------------------

export interface Recommendation {
  authorId: string;
  score: number;
  /** 사용자에게 그대로 보이는 근거 */
  reasons: string[];
}

const REL_WEIGHT: Record<string, number> = {
  documented_influence: 1,
  mentorship: 1,
  translation: 0.8,
  dialogue: 0.7,
  affinity: 0.6,
  contrast: 0.6
};

/**
 * 세 항의 합: ① 읽은 별과의 관계 밀도 ② **아직 비어 있는 지역/언어**
 * ③ 진입 난이도. ②가 있는 이유는 정전화 편향 때문이다 — 관계 밀도만 쓰면
 * 이미 조밀한 유럽 중심부를 계속 추천하게 된다.
 */
export function recommend(
  p: PersonalState,
  authors: Author[],
  relations: Relation[],
  difficultyOf: (a: Author) => number,
  label: { region: (id: string) => string; language: (code: string) => string },
  limit = 5
): Recommendation[] {
  const read = new Set(Object.keys(p.read));
  if (!read.size) return [];
  const byId = new Map(authors.map((a) => [a.id, a]));

  const readRegions = new Map<string, number>();
  const readLangs = new Map<string, number>();
  for (const id of read) {
    const a = byId.get(id);
    if (!a) continue;
    for (const r of a.regions) readRegions.set(r, (readRegions.get(r) ?? 0) + 1);
    for (const l of a.languages) readLangs.set(l, (readLangs.get(l) ?? 0) + 1);
  }

  const tie = new Map<string, { w: number; via: Set<string> }>();
  for (const rel of relations) {
    const w = REL_WEIGHT[rel.type] ?? 0.5;
    const pairs: Array<[string, string]> = [
      [rel.sourceId, rel.targetId],
      [rel.targetId, rel.sourceId]
    ];
    for (const [from, to] of pairs) {
      if (!read.has(from) || read.has(to)) continue;
      const cur = tie.get(to) ?? { w: 0, via: new Set<string>() };
      cur.w += w * (rel.weight ?? 0.7);
      cur.via.add(from);
      tie.set(to, cur);
    }
  }

  const maxTie = Math.max(1, ...[...tie.values()].map((t) => t.w));
  const out: Recommendation[] = [];
  for (const a of authors) {
    if (read.has(a.id)) continue;
    const t = tie.get(a.id);
    const tieScore = t ? t.w / maxTie : 0;
    const regionGap = a.regions.every((r) => !readRegions.has(r)) ? 1 : 0;
    const langGap = a.languages.every((l) => !readLangs.has(l)) ? 1 : 0;
    const gap = Math.min(1, regionGap * 0.7 + langGap * 0.3);
    const ease = (6 - difficultyOf(a)) / 5;
    const score = 0.45 * tieScore + 0.35 * gap + 0.2 * ease;
    if (score <= 0.16) continue;
    const reasons: string[] = [];
    if (t && t.via.size) {
      const names = [...t.via]
        .slice(0, 2)
        .map((id) => byId.get(id)?.names.ko ?? id)
        .join("·");
      reasons.push(`${names}${t.via.size > 2 ? " 외" : ""}와 이어져 있다`);
    }
    if (regionGap) reasons.push(`아직 비어 있는 지역: ${label.region(a.regions[0] ?? "")}`);
    else if (langGap) reasons.push(`아직 읽지 않은 언어: ${label.language(a.languages[0] ?? "")}`);
    if (difficultyOf(a) <= 2) reasons.push("진입 난이도가 낮다");
    if (p.want[a.id]) reasons.push("읽고 싶은 별로 담아 두었다");
    out.push({ authorId: a.id, score, reasons });
  }
  return out.sort((x, y) => y.score - x.score).slice(0, limit);
}

/** 성좌의 성장 — 표시한 시각 순서대로 누적 개수 */
export function growth(p: PersonalState): Array<{ at: number; n: number }> {
  const ts = Object.values(p.read).sort((a, b) => a - b);
  return ts.map((at, i) => ({ at, n: i + 1 }));
}
