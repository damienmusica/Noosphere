// R10 paper-planet art assets — the rights-verified archival material the
// grammar ships (marks/signatures, archival portraits, first-edition cover
// plates, manuscript grounds). Everything here traces to a row in
// docs/art-direction-r10.md's provenance ledger; authors without assets fall
// back to the honest fallback grammar (initial seal, hatched board, laid
// paper) — absence is part of the language, never faked.

export interface ArtManifest {
  marks: Record<string, { file: string; w: number; h: number }>;
  archival: Record<string, { file: string; w: number; h: number }>;
  covers: Record<string, { file: string; w: number; h: number; license?: string }>;
  grounds: Record<string, { file: string; w: number; h: number }>;
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
