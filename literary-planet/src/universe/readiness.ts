// 착륙지 준비도 — **자산 파일의 존재가 아니라 명시적 검증 상태** (R11-c).
//
// 첫 구현은 `art.grounds[id]` 유무로 착륙을 열었다. 그것은 "파일이 있으면
// 준비된 것"이라는 추론이고, 준비도는 추론이 아니라 편집 판단이다 — 지면
// 자산이 있어도 표면에서 읽히는 문구가 검수되지 않았으면 착륙지가 아니다.

import raw from "../../data/depth-readiness.json";

export type ReadinessState = "ready" | "in-progress" | "not-started";

export interface ReadinessEntry {
  authorId: string;
  state: ReadinessState;
  met: string[];
  verifiedAt: string;
  verifiedBy: string;
  note: string;
}

export interface ReadinessFile {
  version: number;
  note: string;
  criteria: Record<string, string>;
  states: Record<string, string>;
  default: ReadinessState;
  entries: ReadinessEntry[];
}

export const READINESS = raw as ReadinessFile;

const byId = new Map(READINESS.entries.map((e) => [e.authorId, e]));

export function readinessOf(authorId: string): ReadinessEntry | null {
  return byId.get(authorId) ?? null;
}

export function readinessState(authorId: string): ReadinessState {
  return byId.get(authorId)?.state ?? READINESS.default;
}

/** 착륙은 **검수된 ready** 에만 열린다 */
export function isLandable(authorId: string): boolean {
  return readinessState(authorId) === "ready";
}

export const READY_IDS: ReadonlySet<string> = new Set(
  READINESS.entries.filter((e) => e.state === "ready").map((e) => e.authorId)
);
