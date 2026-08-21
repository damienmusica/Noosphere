// R10 paper-planet art assets — the rights-verified archival material the
// grammar ships (marks/signatures, archival portraits, first-edition cover
// plates, manuscript grounds). Everything here traces to a row in
// docs/art-direction-r10.md's provenance ledger; authors without assets fall
// back to the honest fallback grammar (initial seal, hatched board, laid
// paper) — absence is part of the language, never faked.

/** 원장 한 행 — 출하되는 모든 파생물이 이것을 달고 나간다(R11-d).
 *  프로비넌스가 산문 문서에만 있으면 앱은 그것을 보여줄 수 없고,
 *  보여주지 못하는 근거는 없는 근거와 같다. */
export interface AssetProvenance {
  title: string | null;
  collection: string | null;
  pageUrl: string | null;
  licence: string | null;
  licenceBasis: string | null;
  /** 관할 한정 PD 는 boolean 으로 접지 않는다 */
  commercialUse: "yes" | "no" | "unknown" | "unverified-outside-source-jurisdiction";
}

export interface ArtAsset {
  file: string;
  w: number;
  h: number;
  license?: string;
  provenance?: AssetProvenance | null;
}

export interface ArtManifest {
  marks: Record<string, ArtAsset>;
  archival: Record<string, ArtAsset>;
  covers: Record<string, ArtAsset>;
  grounds: Record<string, ArtAsset>;
}

export function artUrl(file: string): string {
  return `${import.meta.env.BASE_URL}art/${file}`;
}

let cached: Promise<ArtManifest | null> | null = null;

/** null when the art bundle is absent — every caller must keep working */
export function loadArtManifest(): Promise<ArtManifest | null> {
  cached ??= fetch(artUrl("manifest.json"))
    .then((r) => (r.ok ? (r.json() as Promise<ArtManifest>) : null))
    .catch(() => null);
  return cached;
}
