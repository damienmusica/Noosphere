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
// 다음 독서 — 하나의 점수가 아니라 서로 다른 목적의 갈래로 (R11-b)
//
// 0.45/0.35/0.20 가중합은 설명 가능했지만 여전히 **우리의 편집적 가치판단**을
// 하나의 숫자로 굳힌 것이었고, 테스트로 고정했다고 정당해지지 않는다(외부 리뷰
// 지적 ④, 전면 수용). 갈래를 병렬로 보여주고 방향은 독자가 고른다 —
// 관측층을 독자가 켜는 것과 같은 원칙이다.
// ---------------------------------------------------------------------------

export interface Recommendation {
  authorId: string;
  /** 사용자에게 그대로 보이는 근거 — 블랙박스 금지 */
  reasons: string[];
}

export type TrackId = "lineage" | "unfamiliar" | "gentle";

export interface Track {
  id: TrackId;
  ko: string;
  hint: string;
  items: Recommendation[];
}

const REL_WEIGHT: Record<string, number> = {
  documented_influence: 1,
  mentorship: 1,
  translation: 0.8,
  dialogue: 0.7,
  affinity: 0.6,
  contrast: 0.6
};

export interface TrackLabels {
  region: (id: string) => string;
  language: (code: string) => string;
}

export function recommendTracks(
  p: PersonalState,
  authors: Author[],
  relations: Relation[],
  difficultyOf: (a: Author) => number,
  label: TrackLabels,
  perTrack = 3
): Track[] {
  const read = new Set(Object.keys(p.read));
  if (!read.size) return [];
  const byId = new Map(authors.map((a) => [a.id, a]));

  const readRegions = new Set<string>();
  const readLangs = new Set<string>();
  for (const id of read) {
    const a = byId.get(id);
    if (!a) continue;
    for (const r of a.regions) readRegions.add(r);
    for (const l of a.languages) readLangs.add(l);
  }

  const tie = new Map<string, { w: number; via: Set<string> }>();
  for (const rel of relations) {
    const w = REL_WEIGHT[rel.type] ?? 0.5;
    for (const [from, to] of [
      [rel.sourceId, rel.targetId],
      [rel.targetId, rel.sourceId]
    ] as Array<[string, string]>) {
      if (!read.has(from) || read.has(to)) continue;
      const cur = tie.get(to) ?? { w: 0, via: new Set<string>() };
      cur.w += w * (rel.weight ?? 0.7);
      cur.via.add(from);
      tie.set(to, cur);
    }
  }

  const candidates = authors.filter((a) => !read.has(a.id));
  const viaNames = (id: string): string => {
    const t = tie.get(id);
    if (!t || !t.via.size) return "";
    const names = [...t.via].slice(0, 2).map((x) => byId.get(x)?.names.ko ?? x);
    return `${names.join("·")}${t.via.size > 2 ? " 외" : ""}`;
  };
  const wanted = (id: string): string[] => (p.want[id] ? ["읽고 싶은 별로 담아 두었다"] : []);

  // ① 읽던 계보를 계속하기
  const lineage: Recommendation[] = candidates
    .filter((a) => (tie.get(a.id)?.w ?? 0) > 0)
    .sort((x, y) => (tie.get(y.id)?.w ?? 0) - (tie.get(x.id)?.w ?? 0))
    .slice(0, perTrack)
    .map((a) => ({
      authorId: a.id,
      reasons: [`${viaNames(a.id)}와 이어져 있다`, ...wanted(a.id)]
    }));

  // ② 낯선 언어·지역으로 건너가기
  const gapRank = (a: Author): number =>
    (a.regions.every((r) => !readRegions.has(r)) ? 2 : 0) +
    (a.languages.every((l) => !readLangs.has(l)) ? 1 : 0);
  const unfamiliar: Recommendation[] = candidates
    .filter((a) => gapRank(a) > 0)
    .sort(
      (x, y) => gapRank(y) - gapRank(x) || (tie.get(y.id)?.w ?? 0) - (tie.get(x.id)?.w ?? 0)
    )
    .slice(0, perTrack)
    .map((a) => {
      const reasons: string[] = [];
      if (a.regions.every((r) => !readRegions.has(r)))
        reasons.push(`아직 비어 있는 지역: ${label.region(a.regions[0] ?? "")}`);
      if (a.languages.every((l) => !readLangs.has(l)))
        reasons.push(`아직 읽지 않은 언어: ${label.language(a.languages[0] ?? "")}`);
      if (tie.get(a.id)) reasons.push(`${viaNames(a.id)}와 이어져 있다`);
      return { authorId: a.id, reasons: [...reasons, ...wanted(a.id)] };
    });

  // ③ 쉬운 입문작부터 시작하기
  const gentle: Recommendation[] = candidates
    .filter((a) => difficultyOf(a) <= 2)
    .sort(
      (x, y) =>
        difficultyOf(x) - difficultyOf(y) || (tie.get(y.id)?.w ?? 0) - (tie.get(x.id)?.w ?? 0)
    )
    .slice(0, perTrack)
    .map((a) => ({
      authorId: a.id,
      reasons: [`난도 ${difficultyOf(a)}/5`, ...(tie.get(a.id) ? [`${viaNames(a.id)}와 이어져 있다`] : []), ...wanted(a.id)]
    }));

  const tracks: Track[] = [
    { id: "lineage", ko: "읽던 계보를 계속", hint: "읽은 별과 관계로 이어진 작가", items: lineage },
    {
      id: "unfamiliar",
      ko: "낯선 언어·지역으로",
      hint: "아직 한 명도 읽지 않은 지역이나 언어",
      items: unfamiliar
    },
    { id: "gentle", ko: "쉬운 입문부터", hint: "진입 난도가 낮은 작가", items: gentle }
  ];
  return tracks.filter((t) => t.items.length > 0);
}

/** 성좌의 성장 — 표시한 시각 순서대로 누적 개수 */
export function growth(p: PersonalState): Array<{ at: number; n: number }> {
  const ts = Object.values(p.read).sort((a, b) => a - b);
  return ts.map((at, i) => ({ at, n: i + 1 }));
}
