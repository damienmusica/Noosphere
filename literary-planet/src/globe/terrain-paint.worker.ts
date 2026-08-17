// Terrain plate painter worker (6th review PR2): the 2D-canvas engraving of
// era and near plates runs here, off the main thread — setTimeout slicing on
// the main thread still produced 100–150ms first-interaction stalls. The
// worker also owns loading + validating the tectonic keyframes, so the ~1.4MB
// eras JSON never parses on the main thread either. Plates return as
// pre-flipped ImageBitmaps (ImageBitmap uploads ignore texture.flipY).

import { paintTerrainTexture } from "./terrain-texture.ts";
import { paintUnionCanvas } from "./territory-textures.ts";
import { loadTerritoryEras } from "../data/load-eras.ts";
import type { Movement, PeriodId, Territory, TerritoryEras } from "../types.ts";

export interface PaintWorkerInit {
  kind: "init";
  territory: Territory;
  periodByAuthor: Record<string, PeriodId>;
  readingRank: Record<string, number>;
  workYears: Record<string, number>;
  /** ordered movement ids + member owner-indices for the union stroke plate */
  movementIds: string[];
  unionMembers: Record<string, number[]>;
}
export interface PaintWorkerLoadEras {
  kind: "load-eras";
}
export interface PaintWorkerPaintEra {
  kind: "paint-era";
  year: number;
  cell: number;
}
export interface PaintWorkerPaintNear {
  kind: "paint-atlas-near";
  cell: number;
}
export interface PaintWorkerPaintUnion {
  kind: "paint-union";
}
export type PaintWorkerRequest =
  | PaintWorkerInit
  | PaintWorkerLoadEras
  | PaintWorkerPaintEra
  | PaintWorkerPaintNear
  | PaintWorkerPaintUnion;

export type PaintWorkerResponse =
  | { kind: "eras-ready"; years: number[] }
  | { kind: "eras-error"; message: string }
  | { kind: "plate"; plate: "era"; year: number; bitmap: ImageBitmap }
  | { kind: "plate"; plate: "atlas-near"; year: null; bitmap: ImageBitmap }
  | { kind: "plate"; plate: "union"; year: null; bitmap: ImageBitmap };

const post = (msg: PaintWorkerResponse, transfer?: Transferable[]) =>
  (self as unknown as { postMessage(m: unknown, t?: Transferable[]): void }).postMessage(
    msg,
    transfer
  );

let base: PaintWorkerInit | null = null;
let eras: TerritoryEras | null = null;

self.onmessage = async (e: MessageEvent<PaintWorkerRequest>) => {
  const msg = e.data;
  if (msg.kind === "init") {
    base = msg;
    return;
  }
  if (msg.kind === "load-eras") {
    try {
      eras ??= await loadTerritoryEras();
      post({ kind: "eras-ready", years: eras.keyframes.map((k) => k.year) });
    } catch (err) {
      post({ kind: "eras-error", message: String(err) });
    }
    return;
  }
  if (!base) return;
  if (msg.kind === "paint-era") {
    const kf = eras?.keyframes.find((k) => k.year === msg.year);
    if (!kf) return;
    const territory: Territory = {
      ...base.territory,
      geometry: {
        ...base.territory.geometry,
        ownerRle: kf.ownerRle,
        coast: kf.coast,
        boundaries: []
      }
    };
    const canvas = paintTerrainTexture(
      territory,
      (id) => base!.periodByAuthor[id],
      msg.cell,
      true,
      (wid) => base!.readingRank[wid],
      (wid) => (base!.workYears[wid] ?? 0) <= kf.year
    );
    const bitmap = await createImageBitmap(canvas as OffscreenCanvas, {
      imageOrientation: "flipY"
    });
    post({ kind: "plate", plate: "era", year: msg.year, bitmap }, [bitmap]);
    return;
  }
  if (msg.kind === "paint-atlas-near") {
    const canvas = paintTerrainTexture(
      base.territory,
      (id) => base!.periodByAuthor[id],
      msg.cell,
      true,
      (wid) => base!.readingRank[wid]
    );
    const bitmap = await createImageBitmap(canvas as OffscreenCanvas, {
      imageOrientation: "flipY"
    });
    post({ kind: "plate", plate: "atlas-near", year: null, bitmap }, [bitmap]);
    return;
  }
  if (msg.kind === "paint-union") {
    const canvas = paintUnionCanvas(
      base.territory.geometry,
      base.movementIds.map((id) => ({ id }) as Movement),
      (id) => base!.unionMembers[id] ?? []
    );
    const bitmap = await createImageBitmap(canvas as OffscreenCanvas, {
      imageOrientation: "flipY"
    });
    post({ kind: "plate", plate: "union", year: null, bitmap }, [bitmap]);
  }
};
