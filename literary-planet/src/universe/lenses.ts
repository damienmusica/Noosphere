// R11 관측층(觀測層) — 사조·언어·시대·지역은 고정된 우주 영토가 아니라
// 독자가 켜고 끄는 해석이다.
//
// 왜 렌즈여야 하는가: 카프카는 독일어권이자 프라하이자 유대 문학이자
// 모더니즘이자 실존주의적 수용이다. 하나의 공식 분류를 별에 새기면 우주
// 은유가 문학을 다시 국경으로 고정한다. 그래서 성좌는 **데이터에 새겨진
// 소속이 아니라 지금 켜져 있는 렌즈의 산물**이다.

import type { Author, Relation } from "../types.ts";
import { RELATION_COLORS, UNION_COLORS } from "../theme.ts";

export type LensId =
  | "movement"
  | "language"
  | "exile"
  | "translation"
  | "influence"
  | "affinity"
  | "personal";

export interface LensLine {
  a: string;
  b: string;
  color: string;
  /** 0..1 — 선의 존재 강도(증거 등급 또는 소속 확실성) */
  weight: number;
  /** 관계 렌즈일 때만 있는 원본 관계 id — 클릭하면 증거로 간다 */
  relationId?: string;
}

export interface LensGroup {
  id: string;
  label: string;
  memberIds: string[];
  color: string;
  /** 색인 번호 — 아틀라스 범례 문법. 별에는 아무 채널도 쓰지 않고
   *  이름표 옆 활자 하나로만 소속을 말한다(R11-b, 외부 리뷰 지적 ①). */
  index: number;
}

export interface LensResult {
  /** **실제 관계와 개인 연결만** 선을 갖는다. 속성 렌즈는 선을 그리지 않는다:
   *  최소신장트리는 계산 편의가 만든 가짜 인접성이고, 사용자는 선을 인과·친연
   *  관계로 읽는다(외부 리뷰 지적 ①, 전면 수용). */
  lines: LensLine[];
  groups: LensGroup[];
  /** 이 렌즈에 속한 별. **밝기·색·링을 건드리지 않는다** — 그 세 채널은
   *  영향력·시대·개인 궤도가 이미 점유했다. 소속은 이름표 옆 색인 번호와
   *  목록↔하늘 연동으로만 말한다. */
  lit: Set<string>;
  /** authorId → 색인 번호들. 여러 하늘에 속하면 여러 개가 붙는다 */
  marks: Map<string, number[]>;
}

export interface LensDef {
  id: LensId;
  ko: string;
  hint: string;
  /** 속성 렌즈는 성좌(체인)를, 관계 렌즈는 실제 관계선을 그린다 */
  kind: "attribute" | "relation" | "personal";
}

export const LENSES: readonly LensDef[] = [
  { id: "movement", ko: "사조 성좌", hint: "같은 사조로 묶인 별을 잇는다", kind: "attribute" },
  { id: "language", ko: "언어권 성좌", hint: "같은 언어로 쓴 별을 잇는다", kind: "attribute" },
  {
    id: "exile",
    ko: "망명과 디아스포라",
    hint: "망명·이주 이력이 기록된 별",
    kind: "attribute"
  },
  { id: "translation", ko: "번역과 수용", hint: "번역으로 이어진 관계", kind: "relation" },
  { id: "influence", ko: "직접 영향", hint: "문서로 확인된 영향 관계", kind: "relation" },
  { id: "affinity", ko: "사후 친연성", hint: "후대가 발견한 유사성", kind: "relation" },
  { id: "personal", ko: "나의 성좌", hint: "내가 읽은 별을 읽은 순서로", kind: "personal" }
] as const;

const ATTR_COLOR: Record<string, string> = {
  movement: "#8a93c9",
  language: "#7fb3a4",
  exile: "#c4776a",
  personal: "#eccb82"
};

// ---------------------------------------------------------------------------

function angular(a: [number, number, number], b: [number, number, number]): number {
  const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  return Math.acos(Math.min(1, Math.max(-1, d)));
}

/**
 * (은퇴, R11-b) 그룹 내부를 각거리 최소신장트리로 이었던 함수. 선이라는
 * 채널을 실제 관계와 공유한 것이 잘못이었다 — 아래 주석이 그 자백이다:
 * "가까운 별끼리 이은 경로일 뿐 영향의 방향을 주장하지 않는다". 사용자는
 * 그 구분을 볼 수 없다. 코드는 근거 기록으로 남기되 호출하지 않는다.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function chain(
  members: string[],
  pos: Record<string, [number, number, number]>
): Array<[string, string]> {
  const rest = members.filter((m) => pos[m]);
  if (rest.length < 2) return [];
  const first = rest.shift() as string;
  const inTree: string[] = [first];
  const out: Array<[string, string]> = [];
  while (rest.length) {
    let best = Infinity;
    let bi = 0;
    let bj = 0;
    for (let i = 0; i < inTree.length; i++) {
      const pa = pos[inTree[i] as string] as [number, number, number];
      for (let j = 0; j < rest.length; j++) {
        const d = angular(pa, pos[rest[j] as string] as [number, number, number]);
        if (d < best) {
          best = d;
          bi = i;
          bj = j;
        }
      }
    }
    const from = inTree[bi] as string;
    const to = rest[bj] as string;
    out.push([from, to]);
    inTree.push(to);
    rest.splice(bj, 1);
  }
  return out;
}

const EVIDENCE_WEIGHT: Record<string, number> = {
  documented: 1,
  scholarly_consensus: 0.72,
  editorial_inference: 0.45
};

export interface LensInput {
  authors: Author[];
  relations: Relation[];
  positions: Record<string, [number, number, number]>;
  movementLabel: (id: string) => string;
  /** 개인 렌즈용 — 읽은 순서 */
  readOrder: string[];
  /** 개인 렌즈용 — 궤도에 담은 별(선은 없지만 하늘에서 물러나지 않는다) */
  wantIds: string[];
}

export function buildLens(id: LensId, input: LensInput): LensResult {
  const { authors, relations, positions } = input;
  const def = LENSES.find((l) => l.id === id)!;
  const lines: LensLine[] = [];
  const groups: LensGroup[] = [];
  const lit = new Set<string>();
  const marks = new Map<string, number[]>();

  if (def.kind === "relation") {
    const want =
      id === "translation" ? "translation" : id === "influence" ? "documented_influence" : "affinity";
    for (const r of relations) {
      if (r.type !== want) continue;
      if (!positions[r.sourceId] || !positions[r.targetId]) continue;
      lines.push({
        a: r.sourceId,
        b: r.targetId,
        color: RELATION_COLORS[r.type],
        weight: EVIDENCE_WEIGHT[r.evidenceLevel] ?? 0.5,
        relationId: r.id
      });
      lit.add(r.sourceId);
      lit.add(r.targetId);
    }
    return { lines, groups, lit, marks };
  }

  if (def.kind === "personal") {
    const seq = input.readOrder.filter((x) => positions[x]);
    for (const x of seq) lit.add(x);
    // 담아 둔 별도 밝힌다 — "다음에 갈 곳"이 안 보이면 개인 성좌가 과거형이 된다
    for (const x of input.wantIds) if (positions[x]) lit.add(x);
    for (let i = 1; i < seq.length; i++) {
      lines.push({
        a: seq[i - 1] as string,
        b: seq[i] as string,
        color: ATTR_COLOR.personal ?? "#eccb82",
        weight: 1
      });
    }
    if (seq.length)
      groups.push({
        id: "personal",
        label: "나의 성좌",
        memberIds: seq,
        color: ATTR_COLOR.personal ?? "#eccb82",
        index: 1
      });
    return { lines, groups, lit, marks };
  }

  // attribute lenses
  const buckets = new Map<string, string[]>();
  for (const a of authors) {
    if (!positions[a.id]) continue;
    let keys: string[] = [];
    if (id === "movement") keys = a.movements;
    else if (id === "language") keys = a.languages;
    else if (id === "exile")
      keys = a.locations.some((l) => l.role === "exile") ? ["exile"] : [];
    for (const k of keys) {
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k)!.push(a.id);
      lit.add(a.id);
    }
  }
  const fallback: string = ATTR_COLOR[id] ?? "#cfa759";
  let ci = 0;
  let index = 0;
  for (const [k, members] of [...buckets].sort((x, y) => y[1].length - x[1].length)) {
    if (members.length < 2) continue;
    const color: string =
      id === "exile" ? fallback : (UNION_COLORS[ci++ % UNION_COLORS.length] as string);
    const label =
      id === "movement"
        ? input.movementLabel(k)
        : id === "language"
          ? (LANGUAGE_KO[k] ?? k.toUpperCase())
          : "망명·디아스포라";
    index += 1;
    groups.push({ id: k, label, memberIds: members, color, index });
    // 선은 그리지 않는다. 소속은 색인 번호로만.
    for (const m of members) {
      const cur = marks.get(m);
      if (cur) cur.push(index);
      else marks.set(m, [index]);
    }
  }
  return { lines, groups, lit, marks };
}

/** 색인 번호 활자 — 20까지는 원문자, 그 이상은 괄호 숫자 */
export function indexGlyph(n: number): string {
  const circled = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳";
  return n >= 1 && n <= 20 ? (circled[n - 1] as string) : `(${n})`;
}

export const LANGUAGE_KO: Record<string, string> = {
  en: "영어",
  fr: "프랑스어",
  de: "독일어",
  es: "스페인어",
  ru: "러시아어",
  ja: "일본어",
  pt: "포르투갈어",
  pl: "폴란드어",
  ko: "한국어",
  it: "이탈리아어",
  ar: "아랍어",
  zh: "중국어",
  bn: "벵골어",
  cs: "체코어",
  tr: "튀르키예어",
  no: "노르웨이어",
  sv: "스웨덴어",
  he: "히브리어",
  yi: "이디시어",
  sr: "세르비아어",
  hu: "헝가리어",
  el: "그리스어",
  nl: "네덜란드어",
  fa: "페르시아어",
  af: "아프리칸스어"
};
