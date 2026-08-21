// R11-d 자산 사전 로드 — 착륙하는 순간 텍스처가 튀어 들어오면 "같은 천체가
// 계속 있었다"는 규칙이 깨진다. 슬라이스의 실물 자산은 **접근이 시작될 때**
// 전부 디코드해 두고, 준비 완료를 상태로 노출한다.
//
// 디코드된 이미지를 캐시해서 three 텍스처로 직접 넘긴다 — TextureLoader 에
// 다시 맡기면 같은 파일을 두 번 가져온다.

import { artUrl, type ArtManifest, type AssetProvenance } from "../globe/art-assets.ts";

export interface AssetSet {
  authorId: string;
  ground: HTMLImageElement | null;
  mark: HTMLImageElement | null;
  archival: HTMLImageElement | null;
  covers: Map<string, HTMLImageElement>;
  /** 이 작가의 표면에 쓰이는 모든 실물 자산의 원장 */
  provenance: Array<{ role: string; workId?: string; prov: AssetProvenance }>;
}

const cache = new Map<string, Promise<AssetSet>>();
const decoded = new Map<string, HTMLImageElement>();

function load(file: string): Promise<HTMLImageElement> {
  const hit = decoded.get(file);
  if (hit) return Promise.resolve(hit);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      decoded.set(file, img);
      // decode() 는 **기다리지 않는다.** 비가시 탭에서 해소되지 않는 경우가 있고
      // (실측: 백그라운드 패널에서 Promise.all 이 영영 안 끝났다), 그러면 사전
      // 로드 전체가 매달려 착륙이 자산을 영영 기다린다. 디코드는 최선 노력으로
      // 미리 돌려 두되 준비 완료의 조건으로 삼지 않는다 — 이미지가 로드된
      // 시점에서 첫 draw 의 지연은 프레임 하나 수준이다.
      if (typeof img.decode === "function") void img.decode().catch(() => undefined);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`asset failed: ${file}`));
    img.src = artUrl(file);
  });
}

/** 한 작가의 실물 자산 전부를 디코드까지 마친 뒤 해소된다 */
export function preloadAuthor(
  authorId: string,
  workIds: string[],
  art: ArtManifest | null
): Promise<AssetSet> {
  // 매니페스트가 아직 도착하지 않았을 때의 결과를 **캐시하면 안 된다** —
  // 그러면 매니페스트가 온 뒤 같은 키로 빈 묶음이 영구히 반환되어 육필 지각이
  // 영영 칠해지지 않는다(실측 버그: crust 가 manuscript 대신 paper 로 굳었다).
  const key = `${authorId}|${workIds.join(",")}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const set: AssetSet = {
    authorId,
    ground: null,
    mark: null,
    archival: null,
    covers: new Map(),
    provenance: []
  };
  if (!art) return Promise.resolve(set);

  const jobs: Array<Promise<unknown>> = [];
  const take = (role: string, entry: (typeof art.grounds)[string] | undefined, workId?: string) => {
    if (!entry) return null;
    if (entry.provenance) set.provenance.push({ role, ...(workId ? { workId } : {}), prov: entry.provenance });
    return load(entry.file);
  };

  const g = take("육필 지각", art.grounds[authorId]);
  if (g) jobs.push(g.then((i) => (set.ground = i)).catch(() => null));
  const m = take("서명·낙관", art.marks[authorId]);
  if (m) jobs.push(m.then((i) => (set.mark = i)).catch(() => null));
  const a = take("기록 사진", art.archival[authorId]);
  if (a) jobs.push(a.then((i) => (set.archival = i)).catch(() => null));
  for (const w of workIds) {
    const c = take("초판 표지", art.covers[w], w);
    if (c) jobs.push(c.then((i) => set.covers.set(w, i)).catch(() => null));
  }

  const p = Promise.all(jobs).then(() => set);
  cache.set(key, p);
  return p;
}

/** 이미 디코드가 끝났는가 — 계약이 "착륙 시점에 자산이 이미 있었다"를 건다 */
export function isPreloaded(authorId: string, workIds: string[]): boolean {
  return cache.has(`${authorId}|${workIds.join(",")}`) && pending === 0;
}

let pending = 0;
export function trackPreload<T>(p: Promise<T>): Promise<T> {
  pending += 1;
  return p.finally(() => {
    pending -= 1;
  });
}
export function preloadPending(): number {
  return pending;
}
