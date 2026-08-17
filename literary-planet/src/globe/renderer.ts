import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { Author, Dataset, Movement, PeriodId, Relation, Work } from "../types.ts";
import type { YearMode } from "../lib/filter.ts";
import { TemporalTerrainLayer } from "./layers/temporal-terrain.ts";
import { resolveRelationView, type RelationView } from "./layers/relation-view.ts";
import { FlowStoryLayer } from "./layers/flow-story.ts";
import type { Locale } from "../i18n/index.ts";
import { RELATION_DEFS } from "../types.ts";
import { COLORS, GEO_COLORS, GLOBE, PERIOD_TINT, RELATION_COLORS, UNION_COLORS } from "../theme.ts";
import { arcPoints, slerp, type Vec3 } from "../lib/sphere.ts";
import { sealGlyph } from "../lib/seal.ts";
import { TIMELINE_MAX, visibleAuthorIds, visibleRelations } from "../lib/filter.ts";
import { instr } from "../lib/instrument.ts";
import {
  LIFE_TEX_WIDTH,
  buildLifeTexData,
  lifecycleEngaged,
  lifecycleOf,
  treatyOf,
  treatyPresence,
  type Treaty
} from "./lifecycle.ts";
import { UNION_INFO_WIDTH, buildOwnerTexture, unionColorLinear } from "./territory-textures.ts";
import { CityMarkers } from "./city-markers.ts";
import {
  CAMERA_DEFAULT,
  CAMERA_MAX,
  CAMERA_MIN,
  LOD_EXIT_MID,
  LodGate,
  labelBudget,
  labelPriority,
  tierVisibleAtLod,
  type LodLevel
} from "../lib/lod.ts";
import { CameraController } from "./camera-controller.ts";
import type { AppState, Store } from "../state/store.ts";
import { LabelLayer, type LabelItem, type LabelState } from "./labels.ts";
import { paintTerrainTexture } from "./terrain-texture.ts";
import { buildNationHeightPatch } from "./terrain-height.ts";
import { paintSealTexture } from "./seal-texture.ts";
import { gridToVec3 } from "../lib/territory-geometry.ts";
import { evidenceLabel, regionLabel, relationTypeShort } from "../i18n/index.ts";

export interface GlobeCallbacks {
  onSelect(id: string | null): void;
  onHover(id: string | null): void;
  onRelationPick(relation: Relation): void;
  onRelationHover(relation: Relation | null): void;
  onWorkPick(work: Work): void;
  onWorkHover(work: Work | null): void;
  /** a geo seal cluster's chip was activated — open the member list; repId
   * identifies the chip so focus can return to it on close (PR5 a11y) */
  onClusterPick(memberIds: string[], at: { x: number; y: number }, repId: string): void;
}

export interface GlobeI18n {
  authorLabel(a: Author, locale: Locale): string;
  movementLabel(m: Movement, locale: Locale): string;
  workLabel(w: Work, locale: Locale): string;
  workAria(w: Work, locale: Locale): string;
  clusterMore(n: number, locale: Locale): string;
  clusterAria(name: string, n: number, locale: Locale): string;
}

export interface GlobeHandle {
  focusAuthor(id: string, opts?: { distance?: number }): void;
  resetCamera(): void;
  zoomBy(factor: number): void;
  /**
   * The user reached for the year fader (focus/press) — pre-warm the
   * tectonic keyframes. Nothing era-related loads or paints before intent
   * (6th review PR2: chunk splitting alone was not demand loading).
   */
  timelineIntent(): void;
  /**
   * Viewport CSS px covered by UI panels (right dock / bottom sheet). The
   * camera shifts its projection so the selection lands in the uncovered
   * area instead of under the panel (7th review PR1 safe-area framing).
   */
  setSafeInsets(insets: { right?: number; bottom?: number }): void;
  dispose(): void;
}

interface EdgeGroup {
  lines: THREE.LineSegments;
  relations: Relation[]; // parallel: segment block i belongs to relations[i]
  baseOpacity: number;
}

// D2: hierarchy is the information — anchor:context = 3:1
const NODE_SCALE: Record<Author["tier"], number> = { anchor: 2.1, major: 1.1, context: 0.7 };
const SEAL_SCALE: Record<Author["tier"], number> = { anchor: 7.4, major: 5.6, context: 4.4 };
const ARC_SEG = GLOBE.arcSegments;

// D9 v2 (ex libris 방인): texture painting lives in seal-texture.ts

// §⑤ two plates: affinity = warm-black sky, geography = midnight cobalt
interface ModePalette {
  surface: THREE.Color;
  line: THREE.Color;
  lineOp: number;
  ref: THREE.Color;
  refOp: number;
  atmo: THREE.Color;
  atmoOp: number;
}
const SEM_PAL: ModePalette = {
  // L1 of the five-value ladder: the sea must sit above the page ground
  // (applyPalette overwrites the material color every mode-fade frame, so
  // the ladder value must live HERE, not in the material constructor)
  surface: new THREE.Color(COLORS.sea),
  line: new THREE.Color(COLORS.line),
  lineOp: 0.28,
  ref: new THREE.Color(COLORS.lineAccent),
  refOp: 0.55,
  atmo: new THREE.Color(COLORS.brass),
  atmoOp: 0.06
};
const GEO_PAL: ModePalette = {
  surface: new THREE.Color(GEO_COLORS.surface),
  line: new THREE.Color(GEO_COLORS.line),
  lineOp: 0.32,
  ref: new THREE.Color(GEO_COLORS.lineStrong),
  refOp: 0.55,
  atmo: new THREE.Color(GEO_COLORS.atmosphere),
  atmoOp: 0.09
};

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function createGlobe(
  container: HTMLElement,
  dataset: Dataset,
  semantic: Map<string, Vec3>,
  geo: Map<string, Vec3>,
  store: Store,
  cbs: GlobeCallbacks,
  i18n: GlobeI18n = {
    authorLabel: (a) => a.names.ko,
    movementLabel: (m) => m.ko,
    workLabel: (w) => w.titleKo,
    workAria: (w) => `작품 카드 열기: ${w.titleKo}`,
    clusterMore: (n) => `+${n}`,
    clusterAria: (name, n) => `${name} 부근의 작가 ${n}명 목록 열기`
  }
): GlobeHandle {
  const authors = dataset.authors;
  const indexOf = new Map(authors.map((a, i) => [a.id, i]));
  const R = GLOBE.radius;

  // --- three basics ---------------------------------------------------------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const smallScreen = container.clientWidth < 768;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, smallScreen ? 1.5 : 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.className = "globe-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  // identity of the GL device, for the debug overlay and QA metrics
  const glInfo = (() => {
    try {
      const gl = renderer.getContext();
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      return {
        webgl2: renderer.capabilities.isWebGL2,
        vendor: String(
          dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR)
        ),
        renderer: String(
          dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
        )
      };
    } catch {
      return { webgl2: false, vendor: "unknown", renderer: "unknown" };
    }
  })();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / Math.max(1, container.clientHeight),
    1,
    2000
  );
  camera.position.set(0, CAMERA_DEFAULT * 0.32, CAMERA_DEFAULT * 0.95);
  camera.lookAt(0, 0, 0);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = CAMERA_MIN;
  controls.maxDistance = CAMERA_MAX;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.7;
  controls.enableDamping = true;

  // camera ownership state machine (7th review PR1): cancellable focus,
  // travel-scaled duration, Escape bookmarks, safe-area framing, zoom-to-cursor
  const cam = new CameraController(camera, controls, renderer.domElement, {
    minDist: CAMERA_MIN,
    maxDist: CAMERA_MAX,
    recenterAbove: LOD_EXIT_MID,
    reducedMotion: () => store.getState().reducedMotion,
    log: (type, data) => instr.log(type, data)
  });

  // --- static globe ---------------------------------------------------------
  const disposables: Array<{ dispose(): void }> = [];
  function track<T extends { dispose(): void }>(x: T): T {
    disposables.push(x);
    return x;
  }

  // texture byte ledger (6th review: "counts, not bytes") — every texture the
  // globe creates registers here; the probe reports the estimated resident
  // bytes (w×h×4, ×4/3 when mipmapped) so memory work is measured, not felt
  const texRegistry = new Set<THREE.Texture>();
  function reg<T extends THREE.Texture>(t: T): T {
    texRegistry.add(t);
    return t;
  }
  function unreg(t: THREE.Texture): void {
    texRegistry.delete(t);
  }
  function textureBytesEstimate(): number {
    let sum = 0;
    for (const t of texRegistry) {
      const img = (t as { image?: { width?: number; height?: number } }).image;
      if (!img?.width || !img.height) continue;
      sum += img.width * img.height * 4 * (t.generateMipmaps ? 4 / 3 : 1);
    }
    return Math.round(sum);
  }

  /** boot-deferrable work runs when the main thread is idle (PR2); the
   * callback gets the IdleDeadline so chunked work can yield mid-batch */
  const scheduleIdle: (fn: (deadline?: IdleDeadline) => void) => void =
    typeof requestIdleCallback === "function"
      ? (fn) => requestIdleCallback((d) => fn(d), { timeout: 2000 })
      : (fn) => setTimeout(() => fn(), 60);

  const surfaceMat = track(new THREE.MeshBasicMaterial({ color: COLORS.sea }));
  const surface = new THREE.Mesh(
    track(new THREE.SphereGeometry(GLOBE.surfaceRadius, 48, 32)),
    surfaceMat
  );
  scene.add(surface);

  const atmoMat = track(
    new THREE.MeshBasicMaterial({
      color: COLORS.brass,
      transparent: true,
      opacity: 0.06,
      side: THREE.BackSide,
      depthWrite: false
    })
  );
  const atmosphere = new THREE.Mesh(
    track(new THREE.SphereGeometry(GLOBE.surfaceRadius * GLOBE.atmosphereScale, 48, 32)),
    atmoMat
  );
  scene.add(atmosphere);

  // Terrain P1 (thesis §②-6/7): the affinity plate — baked coastlines painted
  // once into a canvas texture, mounted between the surface and the instrument
  // graticule. Opacity rides the SAME interpolator as the mode palette
  // (1 − paletteK), so the map cross-fades with the plate colors and can never
  // appear in geography mode; a distance ramp keeps the far view a star chart.
  let terrainMat: THREE.ShaderMaterial | null = null;
  let terrainMesh: THREE.Mesh | null = null;
  const readingRank = new Map<string, number>();
  for (const a of authors) a.readingOrder.forEach((wid, i) => readingRank.set(wid, i));
  // v2.5 tectonics, PR2 shape: the TemporalTerrainLayer owns eras loading
  // (worker-side, on timeline intent only), worker plate painting, and the
  // ≤3-plate LRU. The renderer holds the COMMITTED display state — target
  // year (slider) and display year (world) split so lifecycle, plate,
  // cities, and treaties change in one frame, never one-before-the-other.
  let temporal: TemporalTerrainLayer | null = null;
  const ERA_CELL = 2;
  let nearPlateCell = 4;
  let display: { year: number; yearMode: YearMode; engaged: boolean } = {
    year: TIMELINE_MAX,
    yearMode: "cumulative",
    engaged: false
  };
  let eraActive = false;
  let eraBracket: [number, number] | null = null;
  let eraMixNow = 0;
  let eraLoadingSent = false;
  function setEraLoading(v: boolean): void {
    if (v === eraLoadingSent) return;
    eraLoadingSent = v;
    // microtask: never re-enter the store while inside its own subscription
    queueMicrotask(() => {
      if (!disposed) store.set({ eraLoading: v });
    });
  }
  let lifeTexture: THREE.DataTexture | null = null;
  let unionInfoTexture: THREE.DataTexture | null = null;
  let movementTreaties: Array<{ movement: Movement; treaty: Treaty } | null> = [];
  let unionTarget = 0;
  // two plates of the same bake: mid/far, plus a double-scale near plate whose
  // constant-pixel strokes read as finer engraving at reading distance
  let terrainTexMid: THREE.CanvasTexture | null = null;
  let terrainTexNear: THREE.CanvasTexture | null = null;
  if (dataset.territory) {
    const periodByAuthor = new Map(authors.map((a) => [a.id, a.periods[0]]));
    const periodOf = (id: string) => periodByAuthor.get(id);
    const makeTex = (cellPx: number, withCities = false): THREE.CanvasTexture => {
      const tex = reg(
        track(
          new THREE.CanvasTexture(
            paintTerrainTexture(dataset.territory!, periodOf, cellPx, withCities, (wid) =>
              readingRank.get(wid)
            )
          )
        )
      );
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };
    terrainTexMid = makeTex(2);
    // reading-distance plate: as dense as the GPU allows (CPO report: the
    // near view upscaled a 4096px bake ~3× and read blurry). grid 1024 →
    // cell 8 = 8192px wide, matching the planet scale-up's closer reading
    // height; small screens and small GPUs stay at 4096. PR2: it paints in
    // the worker on FIRST near-LOD entry, never at boot (the synchronous
    // 33MP paint was part of the first-interaction stall).
    nearPlateCell = !smallScreen && renderer.capabilities.maxTextureSize >= 8192 ? 8 : 4;
    // --- territory grammar v2.0: sovereignty shader ------------------------
    // The plate stays exactly as baked; per-nation lifecycle (presence,
    // patina) and per-union treaty strokes ride in small lookup textures.
    // Coastlines never move — the year fader crossfades sovereignty states.
    const geom = dataset.territory.geometry;
    const ownerTexture = reg(track(buildOwnerTexture(geom)));
    lifeTexture = reg(
      track(
        new THREE.DataTexture(
          buildLifeTexData(authors, store.getState().year, store.getState().yearMode),
          LIFE_TEX_WIDTH,
          1,
          THREE.RGBAFormat
        )
      )
    );
    lifeTexture.magFilter = THREE.NearestFilter;
    lifeTexture.minFilter = THREE.NearestFilter;
    lifeTexture.needsUpdate = true;

    const ownerIndexOf = new Map(geom.authors.map((id, i) => [id, i]));
    movementTreaties = dataset.movements.map((mv) => {
      const members = authors.filter((a) => a.movements.includes(mv.id));
      const treaty = treatyOf(members);
      return treaty ? { movement: mv, treaty } : null;
    });
    // union stroke plate: only visible at mid LOD (uUnion eases in there) —
    // painted in the WORKER after boot, a 1×1 transparent placeholder until
    // it lands (PR2: this paint was part of the boot stall)
    const unionTexture = reg(
      track(new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1, THREE.RGBAFormat))
    );
    unionTexture.needsUpdate = true;
    scheduleIdle(() => {
      if (!disposed) temporal?.ensureUnionPaint();
    });

    unionInfoTexture = reg(
      track(
        new THREE.DataTexture(
          new Uint8Array(UNION_INFO_WIDTH * 4),
          UNION_INFO_WIDTH,
          1,
          THREE.RGBAFormat
        )
      )
    );
    unionInfoTexture.magFilter = THREE.NearestFilter;
    unionInfoTexture.minFilter = THREE.NearestFilter;

    // PR2: the temporal layer owns eras loading + worker plate painting;
    // nothing here runs before timeline intent
    temporal = new TemporalTerrainLayer({
      territory: dataset.territory,
      periodByAuthor: Object.fromEntries(
        authors.map((a) => [a.id, a.periods[0] ?? "mid-century"])
      ) as Record<string, PeriodId>,
      readingRank: Object.fromEntries(readingRank),
      workYears: Object.fromEntries(dataset.works.map((w) => [w.id, w.year])),
      movementIds: dataset.movements.map((m) => m.id),
      unionMembers: Object.fromEntries(
        dataset.movements.map((m) => [
          m.id,
          authors
            .filter((a) => a.movements.includes(m.id))
            .map((a) => ownerIndexOf.get(a.id))
            .filter((i): i is number => i !== undefined)
        ])
      ),
      timelineMax: TIMELINE_MAX,
      anisotropy: renderer.capabilities.getMaxAnisotropy(),
      regTexture: (t) => reg(t),
      unregTexture: (t) => unreg(t),
      onUnionPlate: (tex) => {
        if (disposed || !terrainMat) return;
        track(tex);
        terrainMat.uniforms.unionTex!.value = tex;
        unreg(unionTexture);
      },
      onChange: () => {
        if (disposed) return;
        const before = display;
        refreshEraTextures();
        // a commit moved the display year — towns and labels follow in the
        // same frame (atomic transition, 6th review)
        if (display !== before) {
          updateLabels();
          syncCityMarkers();
        }
      }
    });

    terrainMat = track(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          map: { value: terrainTexMid },
          mapB: { value: terrainTexMid },
          uEraMix: { value: 0 },
          ownerTex: { value: ownerTexture },
          lifeTex: { value: lifeTexture },
          unionTex: { value: unionTexture },
          unionInfoTex: { value: unionInfoTexture },
          uOpacity: { value: 0 },
          uLifecycleOn: { value: 0 },
          uUnion: { value: 0 },
          // contact feedback (7th review PR2): the pressed nation's land
          // answers inside the same frame — attack 50ms, decay 160ms
          uContactIdx: { value: -1 },
          uContactK: { value: 0 },
          // lens elevation (grammar §4¾): 2.5D hillshade for ONE nation's
          // relief patch — flat unless the user turns the lens on
          uLensOn: { value: 0 },
          uLensNation: { value: -1 },
          uLensAmp: { value: 0 },
          uLensTex: { value: null },
          uLensRect: { value: new THREE.Vector4(0, 0, 1, 1) },
          uLensTexel: { value: new THREE.Vector2(1, 1) }
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform sampler2D map;
          uniform sampler2D mapB;
          uniform float uEraMix;
          uniform sampler2D ownerTex;
          uniform sampler2D lifeTex;
          uniform sampler2D unionTex;
          uniform sampler2D unionInfoTex;
          uniform float uOpacity;
          uniform float uLifecycleOn;
          uniform float uUnion;
          uniform float uContactIdx;
          uniform float uContactK;
          uniform float uLensOn;
          uniform float uLensNation;
          uniform float uLensAmp;
          uniform sampler2D uLensTex;
          uniform vec4 uLensRect; // u0, v0, uSpan, vSpan
          uniform vec2 uLensTexel;
          varying vec2 vUv;

          float lensHeight(vec2 uv) {
            vec2 p = (uv - uLensRect.xy) / uLensRect.zw;
            if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return 0.0;
            return texture2D(uLensTex, p).r;
          }
          void main() {
            // v2.5: the plate itself is a blend of the tectonic bracket —
            // coastlines grow between keyframes
            vec4 base = mix(texture2D(map, vUv), texture2D(mapB, vUv), uEraMix);
            vec3 col = base.rgb;
            float alpha = base.a;
            // treaty ink may only mark land that currently exists
            float landNow = smoothstep(0.02, 0.14, base.a);

            float oid = texture2D(ownerTex, vUv).r * 255.0;
            if (uLifecycleOn > 0.5 && oid < 254.5) {
              vec3 life = texture2D(lifeTex, vec2((oid + 0.5) / ${LIFE_TEX_WIDTH}.0, 0.5)).rgb;
              // heritage patina: toward an aged, slightly sepia plate
              float luma = dot(col, vec3(0.299, 0.587, 0.114));
              vec3 aged = mix(col, vec3(luma) * vec3(1.04, 0.96, 0.82), 0.55);
              col = mix(col, aged, life.g);
              alpha *= life.r; // presence: unformed land is a coast ghost
            }

            // contact flash: the pressed territory brightens once — warm
            // brass ink, gone in ~200ms; the selection reticle then owns
            // the highlight (5-value ownership rule)
            if (uContactK > 0.004 && abs(oid - uContactIdx) < 0.5) {
              col += vec3(0.30, 0.24, 0.12) * uContactK;
              alpha = max(alpha, 0.4 * uContactK * landNow);
            }

            // lens elevation (§4¾): 2.5D hillshade of the selected nation's
            // relief — center a low hill, coast at sea level. Explicitly
            // opt-in; a mountain with the lens off is a bug.
            if (uLensOn > 0.5 && abs(oid - uLensNation) < 0.5) {
              float hC = lensHeight(vUv);
              float hX = lensHeight(vUv + vec2(uLensTexel.x, 0.0));
              float hY = lensHeight(vUv + vec2(0.0, uLensTexel.y));
              vec3 nrm = normalize(vec3((hC - hX) * 30.0 * uLensAmp, (hC - hY) * 30.0 * uLensAmp, 1.0));
              float hill = clamp(dot(nrm, normalize(vec3(-0.5, 0.62, 0.72))), 0.0, 1.0);
              col = col * (0.78 + 0.5 * hill) + vec3(0.10, 0.085, 0.05) * hC * uLensAmp;
              alpha = max(alpha, hC * 0.25 * uLensAmp);
            }

            vec4 uni = texture2D(unionTex, vUv);
            if (uUnion > 0.01 && uni.a > 0.02) {
              float mi = uni.r * 255.0;
              vec4 info = texture2D(unionInfoTex, vec2((mi + 0.5) / ${UNION_INFO_WIDTH}.0, 0.5));
              float ink = uni.a * info.a * uUnion * landNow;
              // treaty ink retreats to a quiet register (7th review §3.1) —
              // every border wearing full-strength union color competed with
              // the selection layer; the cartouche + legend carry the detail
              col = mix(col, info.rgb, ink * 0.6);
              alpha = max(alpha, ink * 0.45);
            }

            gl_FragColor = vec4(col, alpha * uOpacity);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`
      })
    );
    terrainMesh = new THREE.Mesh(
      track(new THREE.SphereGeometry(GLOBE.terrainRadius, 96, 64)),
      terrainMat
    );
    terrainMesh.renderOrder = -1;
    terrainMesh.visible = false;
    scene.add(terrainMesh);
    // NOTE: the first refreshEraTextures() runs in the init sequence below —
    // it reads `lod`, which is declared after this block
  }

  /** treaty ink alphas for one (year, mode) — full strength at the atlas */
  function fillUnionInfo(year: number, yearMode: YearMode): void {
    if (!unionInfoTexture) return;
    const data = unionInfoTexture.image.data as Uint8Array;
    data.fill(0);
    movementTreaties.forEach((entry, mi) => {
      if (!entry || mi >= UNION_INFO_WIDTH) return;
      const [r, g, b] = unionColorLinear(mi);
      const o = mi * 4;
      data[o] = r;
      data[o + 1] = g;
      data[o + 2] = b;
      data[o + 3] = Math.round(treatyPresence(entry.treaty, year, yearMode) * 255);
    });
    unionInfoTexture.needsUpdate = true;
  }

  /**
   * Commit the temporal display state. Target (slider) and display (world)
   * are split: while the needed plates are still painting in the worker the
   * world KEEPS its last consistent look and reports 준비 중; when the
   * bracket lands, plate + lifecycle + treaty ink + (via onChange) towns and
   * labels move in the same frame (6th review: no lifecycle-first snap).
   */
  function refreshEraTextures(): void {
    if (!terrainMat) return;
    const s = store.getState();
    // scrub preview (7th review PR2): while the fader is held, the WORLD
    // previews the dragged year — terrain, sovereignty, treaties, towns —
    // but filters/relations/URL stay at the committed year until release
    const effYear = s.yearPreview ?? s.year;
    const wantEngaged = lifecycleEngaged(effYear, s.yearMode);

    if (!wantEngaged || !temporal) {
      // the atlas view — the frozen default plate, bit-identical (clause 2)
      display = { year: effYear, yearMode: s.yearMode, engaged: false };
      eraActive = false;
      eraBracket = null;
      eraMixNow = 0;
      terrainMat.uniforms.uEraMix!.value = 0;
      terrainMat.uniforms.uLifecycleOn!.value = 0;
      const want = lod === "near" ? (temporal?.nearPlate() ?? terrainTexMid) : terrainTexMid;
      if (want) {
        terrainMat.uniforms.map!.value = want;
        terrainMat.uniforms.mapB!.value = want;
      }
      fillUnionInfo(effYear, s.yearMode);
      temporal?.noteDisengaged();
      setEraLoading(false);
      return;
    }

    const br = temporal.bracketFor(effYear, ERA_CELL);
    if (!br) {
      // plates not resident yet — hold the previous consistent world and
      // report loading; the worker's onChange recommits when ready
      setEraLoading(true);
      return;
    }
    display = { year: effYear, yearMode: s.yearMode, engaged: true };
    eraActive = true;
    eraBracket = [br.y0, br.y1];
    eraMixNow = br.mix;
    terrainMat.uniforms.map!.value = br.texA;
    terrainMat.uniforms.mapB!.value = br.texB === "atlas" ? terrainTexMid : br.texB;
    terrainMat.uniforms.uEraMix!.value = br.mix;
    terrainMat.uniforms.uLifecycleOn!.value = 1;
    if (lifeTexture) {
      (lifeTexture.image.data as Uint8Array).set(
        buildLifeTexData(authors, display.year, display.yearMode)
      );
      lifeTexture.needsUpdate = true;
    }
    fillUnionInfo(display.year, display.yearMode);
    setEraLoading(false);
  }
  // --- lens elevation (§4¾, 7th review PR4) --------------------------------
  // corpus-density values: norm(works + documented relations) — the CURRENT
  // corpus's documentation density, never quality (bias note in the legend)
  const corpusDensity = (() => {
    const per = new Map<string, number>();
    for (const a of authors) per.set(a.id, 0);
    for (const w of dataset.works) per.set(w.authorId, (per.get(w.authorId) ?? 0) + 1);
    for (const r of dataset.relations) {
      if (r.evidenceLevel !== "documented") continue;
      per.set(r.sourceId, (per.get(r.sourceId) ?? 0) + 1);
      per.set(r.targetId, (per.get(r.targetId) ?? 0) + 1);
    }
    const max = Math.max(1, ...per.values());
    const out = new Map<string, number>();
    for (const [id, v] of per) out.set(id, v / max);
    return out;
  })();

  let lensTexture: THREE.DataTexture | null = null;
  let lensActiveNation = -1;
  function refreshLens(): void {
    if (!terrainMat) return;
    const s = store.getState();
    const idx = s.selectedAuthorId ? indexOf.get(s.selectedAuthorId) : undefined;
    const wantOn =
      s.lens === "corpus-density" &&
      idx !== undefined &&
      s.mode === "semantic" &&
      dataset.territory !== undefined;
    if (!wantOn) {
      terrainMat.uniforms.uLensOn!.value = 0;
      lensActiveNation = -1;
      return;
    }
    if (lensActiveNation !== idx) {
      const patch = buildNationHeightPatch(dataset.territory!.geometry, idx);
      if (!patch) {
        terrainMat.uniforms.uLensOn!.value = 0;
        lensActiveNation = -1;
        return;
      }
      if (lensTexture) {
        unreg(lensTexture);
        lensTexture.dispose();
      }
      lensTexture = new THREE.DataTexture(
        patch.data,
        patch.w,
        patch.h,
        THREE.RedFormat,
        THREE.UnsignedByteType
      );
      lensTexture.minFilter = THREE.LinearFilter;
      lensTexture.magFilter = THREE.LinearFilter;
      lensTexture.needsUpdate = true;
      reg(lensTexture);
      terrainMat.uniforms.uLensTex!.value = lensTexture;
      (terrainMat.uniforms.uLensRect!.value as THREE.Vector4).set(
        patch.u0,
        patch.v0,
        patch.uSpan,
        patch.vSpan
      );
      (terrainMat.uniforms.uLensTexel!.value as THREE.Vector2).set(
        patch.uSpan / patch.w,
        patch.vSpan / patch.h
      );
      lensActiveNation = idx;
      instr.log("lens-active", { lens: s.lens, author: s.selectedAuthorId });
    }
    terrainMat.uniforms.uLensNation!.value = idx;
    terrainMat.uniforms.uLensAmp!.value =
      0.45 + 0.55 * (corpusDensity.get(s.selectedAuthorId!) ?? 0);
    terrainMat.uniforms.uLensOn!.value = 1;
  }

  // full planetary map through mid LOD, receding to faint continents far out.
  // Floor raised 0.3→0.38 (7th review: the far view had L0–L2 collapsed into
  // one near-black band — the land must stay a readable value above the sea)
  function terrainFade(dist: number): number {
    const t = Math.min(1, Math.max(0, (340 - dist) / 70));
    const s = t * t * (3 - 2 * t);
    return 0.38 + 0.62 * s;
  }

  // D1: fine 15° instrument grid — each line shy, the system dense.
  // Equator + prime meridian live in a separate accent geometry with tick marks.
  const gratMat = track(
    new THREE.LineBasicMaterial({ color: COLORS.line, transparent: true, opacity: 0.28 })
  );
  const refMat = track(
    new THREE.LineBasicMaterial({ color: COLORS.lineAccent, transparent: true, opacity: 0.55 })
  );

  function buildGraticule(): THREE.LineSegments {
    const pts: number[] = [];
    const r = GLOBE.graticuleRadius;
    const step = Math.PI / 12;
    for (let lat = -Math.PI / 2 + step; lat < Math.PI / 2 - 1e-4; lat += step) {
      if (Math.abs(lat) < 1e-4) continue; // equator drawn as reference ring
      const rl = Math.cos(lat) * r;
      const y = Math.sin(lat) * r;
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const b = ((i + 1) / 72) * Math.PI * 2;
        pts.push(Math.sin(a) * rl, y, Math.cos(a) * rl, Math.sin(b) * rl, y, Math.cos(b) * rl);
      }
    }
    for (let lon = 0; lon < Math.PI * 2 - 1e-4; lon += step) {
      if (Math.abs(lon) < 1e-4 || Math.abs(lon - Math.PI) < 1e-4) continue; // prime meridian ring
      for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI - Math.PI / 2;
        const b = ((i + 1) / 72) * Math.PI - Math.PI / 2;
        pts.push(
          Math.cos(a) * Math.sin(lon) * r, Math.sin(a) * r, Math.cos(a) * Math.cos(lon) * r,
          Math.cos(b) * Math.sin(lon) * r, Math.sin(b) * r, Math.cos(b) * Math.cos(lon) * r
        );
      }
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(g, gratMat);
  }
  scene.add(buildGraticule());

  function buildReferenceRings(): THREE.LineSegments {
    const pts: number[] = [];
    const r = GLOBE.graticuleRadius + 0.05;
    // equator
    for (let i = 0; i < 144; i++) {
      const a = (i / 144) * Math.PI * 2;
      const b = ((i + 1) / 144) * Math.PI * 2;
      pts.push(Math.sin(a) * r, 0, Math.cos(a) * r, Math.sin(b) * r, 0, Math.cos(b) * r);
    }
    // prime meridian (full great circle through both poles)
    for (let i = 0; i < 144; i++) {
      const a = (i / 144) * Math.PI * 2;
      const b = ((i + 1) / 144) * Math.PI * 2;
      pts.push(0, Math.sin(a) * r, Math.cos(a) * r, 0, Math.sin(b) * r, Math.cos(b) * r);
    }
    // 15° tick marks on the equator — the instrument's scale
    for (let k = 0; k < 24; k++) {
      const a = (k / 24) * Math.PI * 2;
      const sa = Math.sin(a);
      const ca = Math.cos(a);
      pts.push(sa * r, 0, ca * r, sa * (r + 1.8), 0, ca * (r + 1.8));
    }
    const g = track(new THREE.BufferGeometry());
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.LineSegments(g, refMat);
  }
  scene.add(buildReferenceRings());

  function applyPalette(k: number): void {
    surfaceMat.color.lerpColors(SEM_PAL.surface, GEO_PAL.surface, k);
    gratMat.color.lerpColors(SEM_PAL.line, GEO_PAL.line, k);
    gratMat.opacity = SEM_PAL.lineOp + (GEO_PAL.lineOp - SEM_PAL.lineOp) * k;
    refMat.color.lerpColors(SEM_PAL.ref, GEO_PAL.ref, k);
    refMat.opacity = SEM_PAL.refOp + (GEO_PAL.refOp - SEM_PAL.refOp) * k;
    atmoMat.color.lerpColors(SEM_PAL.atmo, GEO_PAL.atmo, k);
    atmoMat.opacity = SEM_PAL.atmoOp + (GEO_PAL.atmoOp - SEM_PAL.atmoOp) * k;
  }
  let paletteK = store.getState().mode === "geo" ? 1 : 0;
  applyPalette(paletteK);

  // --- nodes ----------------------------------------------------------------
  const nodeGeom = track(new THREE.SphereGeometry(1.35, 24, 16));
  const nodeMat = track(new THREE.MeshBasicMaterial({ color: "#ffffff" }));
  const nodes = new THREE.InstancedMesh(nodeGeom, nodeMat, authors.length);
  nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(nodes);

  // stars must win against the lines threading past them (UX audit P1-1)
  const pickGeom = track(new THREE.SphereGeometry(5.6, 8, 6));
  const pickMat = track(
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, transparent: true })
  );
  const pickMesh = new THREE.InstancedMesh(pickGeom, pickMat, authors.length);
  pickMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(pickMesh);

  // D3: the selection marker is a reticle — thin double ring + cardinal ticks,
  // the aiming language of an astronomical instrument.
  function makeReticle(color: string, opacity: number, double: boolean): THREE.Group {
    const group = new THREE.Group();
    const mat = track(
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    if (double) {
      // PR5 value hierarchy: ONE ring + a short faint halo instead of the
      // double concentric pair — the selection mark stops out-shouting the
      // towns and the arriving pulses (6th review)
      group.add(new THREE.Mesh(track(new THREE.RingGeometry(2.7, 2.85, 48)), mat));
      const haloMat = track(
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: opacity * 0.22,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      group.add(new THREE.Mesh(track(new THREE.RingGeometry(3.05, 3.5, 48)), haloMat));
      const tickGeom = track(new THREE.PlaneGeometry(0.14, 0.6));
      for (let i = 0; i < 4; i++) {
        const tick = new THREE.Mesh(tickGeom, mat);
        const a = (i / 4) * Math.PI * 2;
        tick.position.set(Math.cos(a) * 3.4, Math.sin(a) * 3.4, 0);
        tick.rotation.z = a + Math.PI / 2;
        group.add(tick);
      }
    } else {
      group.add(new THREE.Mesh(track(new THREE.RingGeometry(2.9, 3.05, 48)), mat));
    }
    return group;
  }
  const ring = makeReticle(COLORS.brass, 0.95, true);
  ring.visible = false;
  scene.add(ring);
  const hoverRing = makeReticle(COLORS.text, 0.4, false);
  hoverRing.visible = false;
  scene.add(hoverRing);

  // D2: anchors alone get a micro halo — a single additive billboard, no bloom.
  function makeGlowTexture(): THREE.CanvasTexture {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    if (g) {
      const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      grd.addColorStop(0, "rgba(255,255,255,0.9)");
      grd.addColorStop(0.35, "rgba(255,255,255,0.26)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(c);
  }
  const glowTexture = reg(track(makeGlowTexture()));
  const glowSprites = new Map<string, THREE.Sprite>();
  for (const a of authors) {
    if (a.tier !== "anchor") continue;
    const mat = track(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: COLORS.brassBright,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(8.5, 8.5, 1);
    sprite.visible = false;
    scene.add(sprite);
    glowSprites.set(a.id, sprite);
  }

  // D9 v2: at reading distance the point becomes the author's ex libris — a
  // square 방인 (anchors 백문, others 주문) with seeded carving accidents.
  // Drawn white, tinted through material.color so selection/dim states need
  // no redraws. PR2: the 100 seal canvases paint in idle chunks after boot —
  // seals are invisible until the reader zooms (sealK 0 at far), and the
  // batch was part of the 100ms+ first-interaction stall the 6th review
  // measured.
  const sealSprites = new Map<string, THREE.Sprite>();
  {
    // R7 PR5: one shared atlas instead of 100 individual CanvasTextures.
    // Same pixel budget (√N grid of 256px cells — bytes measured ±0), but
    // texture count 100→1 and ONE GPU upload: clones share the base's
    // .source, so per-sprite uv windows are free (sprite shader has
    // mapTransform since r152; verified in this three build). Cells still
    // paint in deadline-aware idle chunks; the single upload happens once
    // at completion — seals are invisible at boot's far view anyway.
    const CELL = 256;
    const COLS = Math.ceil(Math.sqrt(authors.length));
    const atlas = document.createElement("canvas");
    atlas.width = atlas.height = COLS * CELL;
    const atlasCtx = atlas.getContext("2d")!;
    const atlasBase = reg(track(new THREE.CanvasTexture(atlas)));
    let si = 0;
    const buildChunk = (deadline?: IdleDeadline): void => {
      if (disposed) return;
      // at least one per tick, then yield when the idle deadline runs dry
      // (a fixed 20-seal batch was itself a 50ms+ task — the stall had just
      // moved into idle); 4 per tick where deadlines are unavailable
      let painted = 0;
      while (si < authors.length) {
        if (painted > 0 && (deadline ? deadline.timeRemaining() < 4 : painted >= 4)) break;
        const a = authors[si]!;
        const col = si % COLS;
        const row = Math.floor(si / COLS);
        atlasCtx.drawImage(
          paintSealTexture(sealGlyph(a.id, a.names.original), a.tier, a.id),
          col * CELL,
          row * CELL,
          CELL,
          CELL
        );
        // a view into the atlas — NOT registered in the byte ledger (the
        // base carries the bytes once) and never needsUpdate'd (that would
        // re-upload the whole shared source per seal)
        const tex = track(atlasBase.clone());
        tex.repeat.set(1 / COLS, 1 / COLS);
        tex.offset.set(col / COLS, 1 - (row + 1) / COLS);
        const mat = track(
          new THREE.SpriteMaterial({
            map: tex,
            color: COLORS.text,
            transparent: true,
            opacity: 0,
            depthWrite: false
          })
        );
        const sprite = new THREE.Sprite(mat);
        sprite.visible = false;
        sprite.renderOrder = 6;
        scene.add(sprite);
        sealSprites.set(a.id, sprite);
        si++;
        painted++;
      }
      if (si < authors.length) scheduleIdle(buildChunk);
      else atlasBase.needsUpdate = true; // the one upload
    };
    scheduleIdle(buildChunk);
  }
  // 0 at ≥235 (mid LOD), 1 at ≤195 — the stamp develops as you lean in
  let sealK = 0;
  function sealFade(dist: number): number {
    const t = Math.min(1, Math.max(0, (235 - dist) / 40));
    return t * t * (3 - 2 * t);
  }

  // Real-geography seal clustering (5th review P0-3): in geo mode, seals
  // whose screen squares would collide collapse into the highest-priority
  // seal plus a "+N" chip; members expand via the chip (list popover). The
  // collision predicate is the same rectangle test the overlap metric
  // counts, so clustered views keep overlapPairs near zero structurally.
  // Semantic mode is untouched — the affinity layout spaces its own nations.
  interface SealCluster {
    repId: string;
    members: string[];
    x: number;
    y: number;
  }
  let sealClusters: SealCluster[] = [];
  let clusterHidden = new Set<string>();
  let clusterRepOf = new Map<string, string>();
  const lastClusterCam = new THREE.Vector3(Infinity, 0, 0);

  /** returns true when the cluster composition changed (seals need refresh) */
  function computeSealClusters(force = false): boolean {
    const s = store.getState();
    const active = s.mode === "geo" && sealK > 0.02 && !transition;
    if (!active) {
      if (sealClusters.length === 0 && clusterHidden.size === 0) return false;
      sealClusters = [];
      clusterHidden = new Set();
      lastClusterCam.setX(Infinity);
      return true;
    }
    if (!force && camera.position.distanceTo(lastClusterCam) < 0.75) return false;
    lastClusterCam.copy(camera.position);

    const w = container.clientWidth;
    const h = Math.max(1, container.clientHeight);
    const halfFovTan = Math.tan((camera.fov * Math.PI) / 360);
    const camDir = camera.position.clone().normalize();
    const rankOf = { anchor: 0, major: 1, context: 2 } as const;
    interface Cand {
      id: string;
      x: number;
      y: number;
      size: number;
      rank: number;
    }
    const cands: Cand[] = [];
    for (const a of authors) {
      if (!nodeVisible(a)) continue;
      const p = current.get(a.id);
      if (!p) continue;
      const facing = camDir.x * p[0] + camDir.y * p[1] + camDir.z * p[2];
      if (facing < 0.05) continue;
      tmpV.set(p[0] * (R + 2.6), p[1] * (R + 2.6), p[2] * (R + 2.6));
      const d = camera.position.distanceTo(tmpV);
      tmpV.project(camera);
      if (tmpV.z > 1) continue;
      cands.push({
        id: a.id,
        x: ((tmpV.x + 1) / 2) * w,
        y: ((-tmpV.y + 1) / 2) * h,
        size: (SEAL_SCALE[a.tier] * h) / (2 * d * halfFovTan),
        // selection and hover must stay individually visible; then tier
        rank:
          a.id === s.selectedAuthorId ? -2 : a.id === s.hoveredAuthorId ? -1 : rankOf[a.tier]
      });
    }
    cands.sort((a, b) => a.rank - b.rank || (a.id < b.id ? -1 : 1));
    const reps: Cand[] = [];
    const memberMap = new Map<string, string[]>();
    const hidden = new Set<string>();
    for (const c of cands) {
      const hit = reps.find(
        (r) =>
          Math.abs(r.x - c.x) < (r.size + c.size) / 2 + 4 &&
          Math.abs(r.y - c.y) < (r.size + c.size) / 2 + 4
      );
      if (hit) {
        memberMap.get(hit.id)!.push(c.id);
        hidden.add(c.id);
      } else {
        reps.push(c);
        memberMap.set(c.id, [c.id]);
      }
    }
    const next = reps
      .filter((r) => memberMap.get(r.id)!.length > 1)
      .map((r) => ({ repId: r.id, members: memberMap.get(r.id)!, x: r.x, y: r.y }));
    const nextRepOf = new Map<string, string>();
    for (const [repId, members] of memberMap) {
      for (const m of members) nextRepOf.set(m, repId);
    }

    const changed =
      next.length !== sealClusters.length ||
      hidden.size !== clusterHidden.size ||
      next.some((c, i) => {
        const old = sealClusters[i];
        return !old || old.repId !== c.repId || old.members.length !== c.members.length;
      }) ||
      [...hidden].some((id) => !clusterHidden.has(id));
    sealClusters = next;
    clusterHidden = hidden;
    clusterRepOf = nextRepOf;
    return changed;
  }

  // --- edges ----------------------------------------------------------------
  const edgeRoot = new THREE.Group();
  scene.add(edgeRoot);
  const highlightRoot = new THREE.Group();
  scene.add(highlightRoot);
  // transient webs: the hovered star's constellation, and the hovered line
  const hoverWebRoot = new THREE.Group();
  scene.add(hoverWebRoot);
  const relHoverRoot = new THREE.Group();
  relHoverRoot.renderOrder = 5;
  scene.add(relHoverRoot);
  let edgeGroups: EdgeGroup[] = [];
  let highlightGroups: EdgeGroup[] = [];
  let hoverWebGroups: EdgeGroup[] = [];
  const relationById = new Map(dataset.relations.map((r) => [r.id, r]));

  // D4: the arrowhead is a confirmation stamp, not the protagonist —
  // direction is already carried by the dim-source/bright-target gradient
  const arrowGeom = track(new THREE.ConeGeometry(0.55, 1.6, 8));
  let arrowMesh: THREE.InstancedMesh | null = null;

  function clearGroup(root: THREE.Group, groups: EdgeGroup[]): void {
    for (const g of groups) {
      root.remove(g.lines);
      g.lines.geometry.dispose();
      (g.lines.material as THREE.Material).dispose();
    }
  }

  function buildEdgeGroups(
    rels: Relation[],
    positions: Map<string, Vec3>,
    root: THREE.Group,
    opacityScale: number,
    highlighted: boolean
  ): EdgeGroup[] {
    const byType = new Map<string, Relation[]>();
    for (const r of rels) {
      const list = byType.get(r.type) ?? [];
      list.push(r);
      byType.set(r.type, list);
    }
    const groups: EdgeGroup[] = [];
    for (const def of RELATION_DEFS) {
      const list = byType.get(def.id);
      if (!list || list.length === 0) continue;
      const positionsArr: number[] = [];
      const colorsArr: number[] = [];
      const color = new THREE.Color(RELATION_COLORS[def.id]);
      for (const r of list) {
        const a = positions.get(r.sourceId);
        const b = positions.get(r.targetId);
        if (!a || !b) continue;
        const pts = arcPoints(a, b, ARC_SEG, R);
        for (let i = 0; i < ARC_SEG; i++) {
          const p = pts[i]!;
          const n = pts[i + 1]!;
          positionsArr.push(p[0], p[1], p[2], n[0], n[1], n[2]);
          // directed types: dim at source, bright at target = readable direction cue
          const t0 = i / ARC_SEG;
          const t1 = (i + 1) / ARC_SEG;
          const dim = def.direction === "directed" ? 0.45 : 0.85;
          const k0 = dim + (1 - dim) * t0;
          const k1 = dim + (1 - dim) * t1;
          colorsArr.push(color.r * k0, color.g * k0, color.b * k0);
          colorsArr.push(color.r * k1, color.g * k1, color.b * k1);
        }
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.Float32BufferAttribute(positionsArr, 3));
      geom.setAttribute("color", new THREE.Float32BufferAttribute(colorsArr, 3));
      // D5: three-step hierarchy — overview lines carry "milky-way density"
      const baseOpacity = (highlighted ? 0.95 : def.dashed ? 0.34 : 0.42) * opacityScale;
      const mat = def.dashed
        ? new THREE.LineDashedMaterial({
            vertexColors: true,
            transparent: true,
            opacity: baseOpacity,
            dashSize: 2.4,
            gapSize: 1.8,
            depthWrite: false
          })
        : new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: baseOpacity,
            depthWrite: false
          });
      const lines = new THREE.LineSegments(geom, mat);
      if (def.dashed) lines.computeLineDistances();
      lines.renderOrder = highlighted ? 3 : 1;
      root.add(lines);
      groups.push({ lines, relations: list, baseOpacity });
    }
    return groups;
  }

  function buildArrows(rels: Relation[], positions: Map<string, Vec3>): void {
    if (arrowMesh) {
      scene.remove(arrowMesh);
      arrowMesh.dispose();
      arrowMesh = null;
    }
    const directed = rels.filter((r) => r.direction === "directed");
    if (directed.length === 0) return;
    const mesh = new THREE.InstancedMesh(
      arrowGeom,
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.8, depthWrite: false }),
      directed.length
    );
    const m = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    directed.forEach((r, i) => {
      const a = positions.get(r.sourceId);
      const b = positions.get(r.targetId);
      if (!a || !b) return;
      const pts = arcPoints(a, b, ARC_SEG, R);
      const tip = pts[Math.round(ARC_SEG * 0.9)]!;
      const prev = pts[Math.round(ARC_SEG * 0.9) - 1]!;
      const pos = new THREE.Vector3(...tip);
      const dir = new THREE.Vector3(tip[0] - prev[0], tip[1] - prev[1], tip[2] - prev[2]).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
      m.compose(pos, quat, new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, new THREE.Color(RELATION_COLORS[r.type]));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.renderOrder = 4;
    scene.add(mesh);
    arrowMesh = mesh;
  }

  // --- directional flow on the selection web (FlowStoryLayer, 7th review PR2)
  // The narrative machine lives in layers/flow-story.ts and owns its clock:
  // camera moves, LOD switches and geometry rebuilds route through setStory()
  // and are no-ops while the story key (selection|mode|replayToken) holds.
  const flowStory = new FlowStoryLayer({
    scene,
    glowTexture,
    arcRadius: R * 1.006,
    arcSegments: ARC_SEG,
    log: (type, data) => instr.log(type, data),
    trackTexture: (t) => {
      texRegistry.add(t);
      disposables.push(t);
    },
    reducedMotion: () => store.getState().reducedMotion
  });

  // --- per-frame state ------------------------------------------------------
  const labels = new LabelLayer(container);
  labels.onActivate = (id) => {
    if (id.startsWith("cl:")) {
      const cl = sealClusters.find((c) => c.repId === id.slice(3));
      if (cl) cbs.onClusterPick([...cl.members], { x: cl.x, y: cl.y }, cl.repId);
      return;
    }
    if (!id.startsWith("wk:")) return;
    const wk = dataset.works.find((x) => x.id === id.slice(3));
    if (wk) cbs.onWorkPick(wk);
  };
  labels.onHover = (id) => {
    const wk = id?.startsWith("wk:") ? (worksById.get(id.slice(3)) ?? null) : null;
    cbs.onWorkHover(wk);
  };

  // work towns as scene entities: raised pickable rings over the printed
  // marks, shown for the selected author's realm at reading distance
  const cityMarkers = new CityMarkers(scene);
  let cityMarkersFor: string | null = null;
  function syncCityMarkers(): void {
    const s = store.getState();
    const show =
      s.selectedAuthorId !== null &&
      lod === "near" &&
      s.mode === "semantic" &&
      dataset.territory !== undefined;
    // clause 4: markers follow city founding at the COMMITTED display year —
    // never the slider's target while plates are still painting (PR2)
    const engaged = display.engaged;
    const buildKey = show ? `${s.selectedAuthorId}|${engaged ? display.year : "atlas"}` : null;
    if (buildKey !== null && buildKey !== cityMarkersFor) {
      cityMarkers.build(
        s.selectedAuthorId,
        dataset.territory?.geometry,
        (wid) => readingRank.get(wid),
        worksById,
        (wid) => !engaged || (worksById.get(wid)?.year ?? 0) <= display.year,
        !s.reducedMotion // towns grow in on founding (PR4)
      );
      cityMarkersFor = buildKey;
    } else if (!show && cityMarkersFor !== null) {
      cityMarkers.build(null, undefined, () => undefined, worksById);
      cityMarkersFor = null;
    }
    cityMarkers.setVisible(show);
    cityMarkers.setEmphasis(s.hoveredWorkId, s.selectedWorkId);
  }
  let current = new Map<string, Vec3>(); // live positions (unit vectors)
  let visibleSet = new Set<string>();
  let visRels: Relation[] = [];
  // hysteresis + dwell (7th review PR1): boundary oscillation must not
  // rebuild the world — the gate owns the tier and counts real transitions
  const lodGate = new LodGate(camera.position.length());
  let lod: LodLevel = lodGate.tier;

  // immediate contact feedback (7th review PR2 §4.4): the press answers in
  // the same frame — node-side via the terrain flash, long before the
  // camera or the narrative moves. 50ms attack, 160ms decay.
  let contact: { idx: number; start: number } | null = null;
  let lastContact = { id: "", at: -1e9 };
  function triggerContact(authorId: string, evTs?: number): void {
    if (store.getState().reducedMotion) return;
    const idx = indexOf.get(authorId);
    if (idx === undefined) return;
    const now = performance.now();
    if (lastContact.id === authorId && now - lastContact.at < 300) return;
    lastContact = { id: authorId, at: now };
    contact = { idx, start: now };
    if (evTs !== undefined) instr.latency("contact", now - evTs);
    instr.log("contact-feedback", { id: authorId });
  }
  let neighborIds = new Set<string>();
  let transition: { from: Map<string, Vec3>; start: number; dur: number } | null = null;
  let paletteFrom = 0;
  let disposed = false;

  function positionsFor(mode: AppState["mode"]): Map<string, Vec3> {
    return mode === "geo" ? geo : semantic;
  }

  function setCurrentFrom(map: Map<string, Vec3>): void {
    current = new Map(map);
  }
  setCurrentFrom(positionsFor(store.getState().mode));

  const tmpM = new THREE.Matrix4();
  const tmpV = new THREE.Vector3();
  const hidden = new THREE.Matrix4().makeScale(0, 0, 0);

  function nodeVisible(a: Author): boolean {
    return visibleSet.has(a.id) && tierVisibleAtLod(a.tier, lod);
  }

  function updateNodeInstances(): void {
    const s = store.getState();
    authors.forEach((a, i) => {
      const p = current.get(a.id);
      if (!p || !nodeVisible(a)) {
        nodes.setMatrixAt(i, hidden);
        pickMesh.setMatrixAt(i, hidden);
        return;
      }
      const scaleK =
        NODE_SCALE[a.tier] *
        (a.id === s.selectedAuthorId ? 1.35 : a.id === s.hoveredAuthorId ? 1.25 : 1) *
        (1 - 0.68 * sealK); // the ball recedes to a mounting pin as its seal develops
      tmpV.set(p[0] * R, p[1] * R, p[2] * R);
      tmpM.compose(
        tmpV,
        new THREE.Quaternion(),
        new THREE.Vector3(scaleK, scaleK, scaleK)
      );
      nodes.setMatrixAt(i, tmpM);
      tmpM.compose(tmpV, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
      pickMesh.setMatrixAt(i, tmpM);

      const dimmed =
        s.selectedAuthorId !== null &&
        a.id !== s.selectedAuthorId &&
        !neighborIds.has(a.id);
      const tint = new THREE.Color(PERIOD_TINT[a.periods[0] ?? "early-modernism"]);
      if (a.id === s.selectedAuthorId) tint.set(COLORS.brassBright);
      // selection must silence the crowd — 0.42 left too much background
      // glare to read the constellation against (2026-08-16 review)
      if (dimmed) tint.multiplyScalar(0.25);
      nodes.setColorAt(i, tint);
    });
    nodes.instanceMatrix.needsUpdate = true;
    pickMesh.instanceMatrix.needsUpdate = true;
    if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
    nodes.computeBoundingSphere();
    pickMesh.computeBoundingSphere();

    for (const [id, sprite] of glowSprites) {
      const a = authors[indexOf.get(id) ?? -1];
      const p = current.get(id);
      if (!a || !p || !nodeVisible(a)) {
        sprite.visible = false;
        continue;
      }
      sprite.visible = true;
      sprite.position.set(p[0] * R, p[1] * R, p[2] * R);
      const dimmed =
        s.selectedAuthorId !== null && id !== s.selectedAuthorId && !neighborIds.has(id);
      (sprite.material as THREE.SpriteMaterial).opacity = dimmed ? 0.1 : 0.32;
    }

    for (const [id, sprite] of sealSprites) {
      const a = authors[indexOf.get(id) ?? -1];
      const p = current.get(id);
      if (!a || !p || sealK < 0.02 || !nodeVisible(a) || clusterHidden.has(id)) {
        sprite.visible = false;
        continue;
      }
      sprite.visible = true;
      // lifted off the surface so the globe occludes far-side seals itself
      sprite.position.set(p[0] * (R + 2.6), p[1] * (R + 2.6), p[2] * (R + 2.6));
      // seal retreat (7th review §3.2): unengaged seals are quiet marks, not
      // the front layer — selection/hover/neighborhood carries the emblem
      // forward; towns and terrain must never lose to a catalogue of initials
      const engagedSeal =
        id === s.selectedAuthorId || id === s.hoveredAuthorId || neighborIds.has(id);
      const k = SEAL_SCALE[a.tier] * (engagedSeal ? 1 : 0.82);
      sprite.scale.set(k, k, 1);
      const dimmed =
        s.selectedAuthorId !== null && id !== s.selectedAuthorId && !neighborIds.has(id);
      const mat = sprite.material as THREE.SpriteMaterial;
      mat.opacity = sealK * (dimmed ? 0.22 : engagedSeal ? 0.92 : 0.55);
      mat.color.set(id === s.selectedAuthorId ? COLORS.brassBright : COLORS.text);
    }
  }

  // aggregate routes (PR3): geo overview lines are computed corridors between
  // regions/clusters, never the raw 229-edge tangle. Count → opacity (line
  // width is fixed in WebGL core), dominant type → ink; legend-registered as
  // a computed navigation layer.
  const aggRoot = new THREE.Group();
  scene.add(aggRoot);
  let aggLines: THREE.LineSegments[] = [];
  let lastRelationView: RelationView | null = null;
  let egoHiddenSent = 0;

  function clearAggregates(): void {
    for (const l of aggLines) {
      aggRoot.remove(l);
      l.geometry.dispose();
      (l.material as THREE.Material).dispose();
    }
    aggLines = [];
  }

  function groupCentroid(key: string): Vec3 | null {
    // cluster keys are author ids (the rep); "mv:" keys are constellations
    // (semantic mid, R7 PR3); bare keys aggregate region members
    if (indexOf.has(key)) return current.get(key) ?? null;
    const isMovement = key.startsWith("mv:");
    const bare = isMovement ? key.slice(3) : key;
    let cx = 0;
    let cy = 0;
    let cz = 0;
    let n = 0;
    for (const a of authors) {
      if ((isMovement ? a.movements[0] !== bare : a.regions[0] !== key) || !nodeVisible(a))
        continue;
      const p = current.get(a.id);
      if (!p) continue;
      cx += p[0];
      cy += p[1];
      cz += p[2];
      n++;
    }
    if (n === 0) return null;
    const len = Math.hypot(cx, cy, cz) || 1;
    return [cx / len, cy / len, cz / len];
  }

  function buildAggregateRoutes(routes: RelationView["aggregates"]): void {
    clearAggregates();
    if (routes.length === 0) return;
    const maxCount = routes[0]!.count;
    for (const route of routes) {
      const pa = groupCentroid(route.a);
      const pb = groupCentroid(route.b);
      if (!pa || !pb) continue;
      const pts = arcPoints(pa, pb, ARC_SEG, R * 1.01);
      const arr: number[] = [];
      for (let i = 0; i < ARC_SEG; i++) {
        arr.push(...pts[i]!, ...pts[i + 1]!);
      }
      const geomB = new THREE.BufferGeometry();
      geomB.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
      const mat = new THREE.LineBasicMaterial({
        color: RELATION_COLORS[route.dominantType],
        transparent: true,
        opacity: 0.2 + 0.5 * Math.sqrt(route.count / maxCount),
        depthWrite: false
      });
      const lines = new THREE.LineSegments(geomB, mat);
      lines.renderOrder = 1;
      aggRoot.add(lines);
      aggLines.push(lines);
    }
  }

  function rebuildEdges(): void {
    clearGroup(edgeRoot, edgeGroups);
    clearGroup(highlightRoot, highlightGroups);
    edgeGroups = [];
    highlightGroups = [];
    const s = store.getState();
    const lodRels = visRels.filter((r) => {
      const sa = authors[indexOf.get(r.sourceId) ?? -1];
      const ta = authors[indexOf.get(r.targetId) ?? -1];
      return sa && ta && nodeVisible(sa) && nodeVisible(ta);
    });
    const view = resolveRelationView({
      mode: s.mode,
      lod,
      selectedAuthorId: s.selectedAuthorId,
      egoExpanded: s.egoExpanded,
      visibleRelations: lodRels,
      regionOf: (id) => authors[indexOf.get(id) ?? -1]?.regions[0],
      // upper mid (seals not yet developed → no screen clusters): regions
      // still carry the corridor story; once seals cluster, corridors run
      // between clusters (singles group as themselves)
      clusterGroupOf: (id) =>
        clusterRepOf.get(id) ??
        (sealK > 0.02 ? id : authors[indexOf.get(id) ?? -1]?.regions[0]),
      // semantic mid corridors run between constellations (primary movement);
      // movement keys are namespaced so region slugs can never collide
      movementOf: (id) => {
        const m = authors[indexOf.get(id) ?? -1]?.movements[0];
        return m ? `mv:${m}` : undefined;
      }
    });
    lastRelationView = view;
    if (view.hiddenCount !== egoHiddenSent) {
      egoHiddenSent = view.hiddenCount;
      queueMicrotask(() => {
        if (!disposed) store.set({ egoHiddenCount: view.hiddenCount });
      });
    }
    const sel = s.selectedAuthorId;
    if (sel) {
      // context edges: the dim semantic web stays; geo hides the rest
      // entirely — its lines belong to selection intent only (PR3)
      const rest =
        s.mode === "semantic"
          ? lodRels.filter((r) => r.sourceId !== sel && r.targetId !== sel)
          : [];
      edgeGroups = buildEdgeGroups(rest, current, edgeRoot, 0.16, false);
      highlightGroups = buildEdgeGroups(view.raw, current, highlightRoot, 1, true);
      buildArrows(view.raw, current);
      flowStory.setStory({
        selectedId: sel,
        mode: s.mode,
        replayToken: s.flowReplayToken,
        relations: view.raw,
        positions: current
      });
    } else {
      if (view.raw.length > 0) {
        edgeGroups = buildEdgeGroups(view.raw, current, edgeRoot, 1, false);
      }
      buildArrows([], current);
      flowStory.clear();
    }
    buildAggregateRoutes(view.aggregates);
  }

  // --- hovered-line emphasis + tooltip (who connects to whom, zero clicks) --
  const tooltip = document.createElement("div");
  tooltip.className = "globe-edge-tooltip";
  tooltip.style.display = "none";
  container.appendChild(tooltip);

  function clearRelHover(): void {
    for (const child of [...relHoverRoot.children]) {
      relHoverRoot.remove(child);
      const line = child as THREE.Line;
      line.geometry?.dispose?.();
      (line.material as THREE.Material | undefined)?.dispose?.();
    }
  }

  function updateRelationHover(): void {
    clearRelHover();
    clearGroup(hoverWebRoot, hoverWebGroups);
    hoverWebGroups = [];
    const s = store.getState();

    // hovered star: its whole constellation surfaces before any click
    if (s.hoveredAuthorId && s.hoveredAuthorId !== s.selectedAuthorId) {
      const touching = visRels.filter(
        (r) => r.sourceId === s.hoveredAuthorId || r.targetId === s.hoveredAuthorId
      );
      hoverWebGroups = buildEdgeGroups(touching, current, hoverWebRoot, 1, true);
    }

    // hovered line: redraw it bright with a soft halo
    const rel = s.hoveredRelationId ? relationById.get(s.hoveredRelationId) : undefined;
    if (rel) {
      const a = current.get(rel.sourceId);
      const b = current.get(rel.targetId);
      if (a && b) {
        const pts = arcPoints(a, b, ARC_SEG, R).map(
          (p) => new THREE.Vector3(p[0], p[1], p[2])
        );
        const halo = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(
            pts.map((p) => p.clone().multiplyScalar(1.004))
          ),
          new THREE.LineBasicMaterial({
            color: COLORS.brassBright,
            transparent: true,
            opacity: 0.35,
            depthWrite: false
          })
        );
        const core = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({
            color: RELATION_COLORS[rel.type],
            transparent: true,
            opacity: 1,
            depthWrite: false
          })
        );
        relHoverRoot.add(halo, core);
      }
    }
  }

  function setEdgeTooltip(rel: Relation | null): void {
    if (!rel) {
      tooltip.style.display = "none";
      return;
    }
    const s = store.getState();
    const src = authors[indexOf.get(rel.sourceId) ?? -1];
    const tgt = authors[indexOf.get(rel.targetId) ?? -1];
    if (!src || !tgt) return;
    tooltip.replaceChildren();
    const names = document.createElement("div");
    names.className = "et-names";
    names.textContent = `${i18n.authorLabel(src, s.locale)} ${
      rel.direction === "directed" ? "→" : "↔"
    } ${i18n.authorLabel(tgt, s.locale)}`;
    const meta = document.createElement("div");
    meta.className = "et-meta";
    const dot = document.createElement("span");
    dot.className = "et-dot";
    dot.style.background = RELATION_COLORS[rel.type];
    meta.append(
      dot,
      ` ${relationTypeShort(rel.type, s.locale)} · ${evidenceLabel(rel.evidenceLevel, s.locale)}`
    );
    tooltip.append(names, meta);
    tooltip.style.display = "block";
  }

  function moveTooltip(clientX: number, clientY: number): void {
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const flip = x > rect.width - 240;
    tooltip.style.transform = `translate(${flip ? x - 16 : x + 16}px, ${y + 14}px) translateX(${flip ? "-100%" : "0"})`;
  }

  function recomputeVisibility(): void {
    const s = store.getState();
    visibleSet = visibleAuthorIds(authors, s.filters, s.year, s.yearMode);
    visRels = visibleRelations(dataset.relations, s.filters, visibleSet);
    neighborIds = new Set();
    if (s.selectedAuthorId) {
      for (const r of visRels) {
        if (r.sourceId === s.selectedAuthorId) neighborIds.add(r.targetId);
        if (r.targetId === s.selectedAuthorId) neighborIds.add(r.sourceId);
      }
    }
  }

  function updateRings(): void {
    const s = store.getState();
    for (const [mesh, id] of [
      [ring, s.selectedAuthorId],
      [hoverRing, s.hoveredAuthorId !== s.selectedAuthorId ? s.hoveredAuthorId : null]
    ] as Array<[THREE.Object3D, string | null]>) {
      const p = id ? current.get(id) : undefined;
      const a = id ? authors[indexOf.get(id) ?? -1] : undefined;
      if (!id || !p || !a || !nodeVisible(a)) {
        mesh.visible = false;
        continue;
      }
      mesh.visible = true;
      mesh.position.set(p[0] * R, p[1] * R, p[2] * R);
      mesh.lookAt(camera.position);
      const k = NODE_SCALE[a.tier];
      mesh.scale.set(k, k, k);
    }
  }

  // --- labels ---------------------------------------------------------------
  const worksById = new Map(dataset.works.map((wk) => [wk.id, wk]));
  const movementMembers = new Map<string, string[]>();
  for (const m of dataset.movements) {
    movementMembers.set(
      m.id,
      authors.filter((a) => a.movements.includes(m.id)).map((a) => a.id)
    );
  }

  function updateLabels(): void {
    const s = store.getState();
    const w = container.clientWidth;
    const h = container.clientHeight;
    const camDir = camera.position.clone().normalize();
    const items: LabelItem[] = [];

    // transient emphases: both ends of a hovered line always get named, and a
    // hovered star's neighbors surface before any click
    const hovRel = s.hoveredRelationId ? relationById.get(s.hoveredRelationId) : undefined;
    const edgeEnds = hovRel ? new Set([hovRel.sourceId, hovRel.targetId]) : null;
    let hovNeighbors: Set<string> | null = null;
    if (s.hoveredAuthorId && s.hoveredAuthorId !== s.selectedAuthorId) {
      hovNeighbors = new Set();
      for (const r of visRels) {
        if (r.sourceId === s.hoveredAuthorId) hovNeighbors.add(r.targetId);
        if (r.targetId === s.hoveredAuthorId) hovNeighbors.add(r.sourceId);
      }
    }

    // geo far view speaks in regions, not individuals — 100 authors over
    // real geography drown the far view (2026-08-16 review: 45 label
    // candidates suppressed); authors return at the next zoom step
    const geoFar = s.mode === "geo" && lod === "far";

    // far view fairness: every visible region's strongest author gets a
    // representation boost so the far map is not one continent's roster
    let regionRep: Map<string, string> | null = null;
    if (lod === "far" && !geoFar) {
      regionRep = new Map();
      const rank = { anchor: 0, major: 1, context: 2 } as const;
      for (const a of authors) {
        if (!nodeVisible(a)) continue;
        const region = a.regions[0];
        if (!region) continue;
        const curId = regionRep.get(region);
        const cur = curId ? authors[indexOf.get(curId) ?? -1] : undefined;
        if (
          !cur ||
          rank[a.tier] < rank[cur.tier] ||
          (rank[a.tier] === rank[cur.tier] && a.id < cur.id)
        ) {
          regionRep.set(region, a.id);
        }
      }
    }

    for (const a of authors) {
      if (!nodeVisible(a)) continue;
      const p = current.get(a.id);
      if (!p) continue;
      const facing = camDir.x * p[0] + camDir.y * p[1] + camDir.z * p[2];
      const state: LabelState =
        a.id === s.selectedAuthorId
          ? "selected"
          : a.id === s.hoveredAuthorId
            ? "hovered"
            : neighborIds.has(a.id) || edgeEnds?.has(a.id) || hovNeighbors?.has(a.id)
              ? "neighbor"
              : s.selectedAuthorId
                ? "dim"
                : "normal";
      if (geoFar && (state === "normal" || state === "dim")) continue;
      // clustered members speak through their cluster's chip, not their own
      // label (selection/hover never cluster, by construction)
      if (clusterHidden.has(a.id) && state !== "selected" && state !== "hovered") continue;
      let priority = labelPriority({
        tier: a.tier,
        isSelected: state === "selected",
        isHovered: state === "hovered",
        isNeighborOfSelected: state === "neighbor",
        facingDot: facing
      });
      if (priority < 0) continue;
      if (edgeEnds?.has(a.id)) priority += 140;
      if (hovNeighbors?.has(a.id)) priority += 50;
      if (regionRep?.get(a.regions[0] ?? "") === a.id) priority += 28;
      tmpV.set(p[0] * R, p[1] * R, p[2] * R).project(camera);
      if (tmpV.z > 1) continue;
      items.push({
        id: a.id,
        text: i18n.authorLabel(a, s.locale),
        kind: "author",
        size: a.tier === "anchor" ? "md" : "sm",
        priority,
        x: ((tmpV.x + 1) / 2) * w,
        y: ((-tmpV.y + 1) / 2) * h + 7,
        state
      });
    }

    // geo cluster chips: "+N" under the representative seal — the door to
    // the member list (interactive, measured, budget-exempt via priority)
    for (const cl of sealClusters) {
      const rep = authors[indexOf.get(cl.repId) ?? -1];
      if (!rep) continue;
      items.push({
        id: `cl:${cl.repId}`,
        text: i18n.clusterMore(cl.members.length - 1, s.locale),
        kind: "cluster",
        size: "sm",
        priority: 86,
        x: cl.x,
        y: cl.y + 24,
        state: "normal",
        interactive: true,
        ariaLabel: i18n.clusterAria(
          i18n.authorLabel(rep, s.locale),
          cl.members.length,
          s.locale
        )
      });
    }

    if (geoFar) {
      // one label per region: centroid of its visible members + member count
      const agg = new Map<string, { count: number; x: number; y: number; z: number }>();
      for (const a of authors) {
        if (!nodeVisible(a)) continue;
        const p = current.get(a.id);
        const region = a.regions[0];
        if (!p || !region) continue;
        const e = agg.get(region) ?? { count: 0, x: 0, y: 0, z: 0 };
        e.count++;
        e.x += p[0];
        e.y += p[1];
        e.z += p[2];
        agg.set(region, e);
      }
      // European regions crowd on the geo hemisphere — nudge colliding
      // region labels vertically so every visible region stays named
      // (the far map missing region names is the exact failure this view
      // replaced)
      const regionCands: Array<{ region: string; count: number; facing: number; x: number; y: number }> = [];
      for (const [region, e] of agg) {
        const len = Math.hypot(e.x, e.y, e.z) || 1;
        const px = e.x / len;
        const py = e.y / len;
        const pz = e.z / len;
        const facing = camDir.x * px + camDir.y * py + camDir.z * pz;
        if (facing < 0.15) continue;
        tmpV.set(px * R, py * R, pz * R).project(camera);
        if (tmpV.z > 1) continue;
        regionCands.push({
          region,
          count: e.count,
          facing,
          x: ((tmpV.x + 1) / 2) * w,
          y: ((-tmpV.y + 1) / 2) * h
        });
      }
      regionCands.sort((a, b) => b.facing - a.facing);
      const placedRegions: Array<{ x0: number; x1: number; y0: number; y1: number }> = [];
      for (const c of regionCands) {
        const text = `${regionLabel(c.region, s.locale)} · ${c.count}`;
        const wpx = text.length * 12 + 10; // md serif, KO-weighted estimate
        let y = c.y;
        for (const dy of [0, -18, 18, -36, 36]) {
          const box = { x0: c.x - wpx / 2, x1: c.x + wpx / 2, y0: c.y + dy - 8, y1: c.y + dy + 12 };
          if (!placedRegions.some((p) => p.x0 < box.x1 && p.x1 > box.x0 && p.y0 < box.y1 && p.y1 > box.y0)) {
            y = c.y + dy;
            placedRegions.push(box);
            break;
          }
        }
        items.push({
          id: `region:${c.region}`,
          text,
          kind: "region",
          size: "md",
          priority: 92 + c.facing * 8,
          x: c.x,
          y,
          state: s.selectedAuthorId ? "dim" : "normal"
        });
      }
    }

    // P3: the selected author's works label their towns at reading distance
    if (s.selectedAuthorId && lod === "near" && dataset.territory) {
      const g = dataset.territory.geometry;
      const cities = g.cities[s.selectedAuthorId];
      if (cities) {
        for (const town of cities.towns) {
          const wk = worksById.get(town.id);
          if (!wk) continue;
          // clause 4: a town exists only after its work is published — at
          // the committed display year (atomic with the plate)
          if (display.engaged && wk.year > display.year) continue;
          const p = gridToVec3(town.x, town.y, g.gridWidth, g.gridHeight);
          const facing = camDir.x * p[0] + camDir.y * p[1] + camDir.z * p[2];
          if (facing < 0.25) continue;
          tmpV
            .set(
              p[0] * GLOBE.terrainRadius,
              p[1] * GLOBE.terrainRadius,
              p[2] * GLOBE.terrainRadius
            )
            .project(camera);
          if (tmpV.z > 1) continue;
          items.push({
            id: `wk:${town.id}`,
            text: i18n.workLabel(wk, s.locale),
            kind: "work",
            size: "sm",
            priority: 88 + facing * 8,
            x: ((tmpV.x + 1) / 2) * w,
            y: ((-tmpV.y + 1) / 2) * h + 9,
            state:
              town.id === s.selectedWorkId
                ? "selected"
                : town.id === s.hoveredWorkId
                  ? "hovered"
                  : "normal",
            // towns are real destinations, not decoration — click or
            // Enter opens the work card (2026-08-16 review P0-4)
            interactive: true,
            ariaLabel: i18n.workAria(wk, s.locale)
          });
        }
      }
    }

    // a focused line names its bond in place only when the reader asks for
    // it (hover or pick) — repeating the type on every spoke was pattern
    // noise (2026-08-16 review); the always-on legend carries the key
    if (s.selectedAuthorId && lod !== "far") {
      const touching = visRels.filter(
        (r) =>
          (r.id === s.hoveredRelationId || r.id === s.pickedRelationId) &&
          (r.sourceId === s.selectedAuthorId || r.targetId === s.selectedAuthorId)
      );
      for (const r of touching) {
        const pa = current.get(r.sourceId);
        const pb = current.get(r.targetId);
        if (!pa || !pb) continue;
        const mid = arcPoints(pa, pb, 8, R * 1.012)[4]!;
        const len = Math.hypot(mid[0], mid[1], mid[2]) || 1;
        const facing =
          (camDir.x * mid[0] + camDir.y * mid[1] + camDir.z * mid[2]) / len;
        if (facing < 0.2) continue;
        tmpV.set(mid[0], mid[1], mid[2]).project(camera);
        if (tmpV.z > 1) continue;
        items.push({
          id: `rel:${r.id}`,
          text: relationTypeShort(r.type, s.locale),
          kind: "relation",
          size: "sm",
          priority: 72 + facing * 6,
          x: ((tmpV.x + 1) / 2) * w,
          y: ((-tmpV.y + 1) / 2) * h,
          state: "normal",
          color: RELATION_COLORS[r.type]
        });
      }
    }

    // in the geo far view the region clusters carry the grouping story;
    // movement centroids are literary-space constructs and only add load
    if (lod !== "near" && !s.selectedAuthorId && !geoFar) {
      for (const m of dataset.movements) {
        const members = (movementMembers.get(m.id) ?? []).filter((id) => {
          const a = authors[indexOf.get(id) ?? -1];
          return a && nodeVisible(a);
        });
        if (members.length < 3) continue;
        let cx = 0, cy = 0, cz = 0;
        for (const id of members) {
          const p = current.get(id);
          if (!p) continue;
          cx += p[0]; cy += p[1]; cz += p[2];
        }
        const len = Math.hypot(cx, cy, cz);
        if (len < members.length * 0.45) continue; // members scattered — centroid meaningless
        cx /= len; cy /= len; cz /= len;
        const facing = camDir.x * cx + camDir.y * cy + camDir.z * cz;
        if (facing < 0.25) continue;
        tmpV.set(cx * R * 1.04, cy * R * 1.04, cz * R * 1.04).project(camera);
        // union annotation (D1): the treaty period joins the name, in the
        // union's own ink — the label is the overlay's cartouche
        const mvIdx = dataset.movements.indexOf(m);
        const entry = movementTreaties[mvIdx] ?? null;
        const treatyAlpha = entry
          ? treatyPresence(entry.treaty, display.year, display.yearMode)
          : 0;
        items.push({
          id: `mv:${m.id}`,
          // ≈ marks the span as computed from member activity overlap, not a
          // curated historical period (5th review P0-2; legend carries the key)
          text:
            entry && treatyAlpha > 0.05
              ? `${i18n.movementLabel(m, s.locale)} ≈ ${entry.treaty.start}–${entry.treaty.end}`
              : i18n.movementLabel(m, s.locale),
          kind: "movement",
          size: "lg",
          // LOD contract: the mid view belongs to nations AND their unions —
          // an active treaty's cartouche outranks ordinary nation labels
          // there; at far it competes as before
          priority: (entry && treatyAlpha > 0.05 && lod === "mid" ? 76 : 30) + facing * 8,
          x: ((tmpV.x + 1) / 2) * w,
          y: ((-tmpV.y + 1) / 2) * h,
          state: "normal",
          color: entry && treatyAlpha > 0.05 ? UNION_COLORS[mvIdx % UNION_COLORS.length] : undefined
        });
      }
    }

    labels.update(items, w, h, labelBudget(lod));
  }

  // --- picking --------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  raycaster.params.Line = { threshold: 1.5 };
  const pointer = new THREE.Vector2();
  let downAt: { x: number; y: number; t: number } | null = null;
  let hoverPending = false;

  function pickAuthor(clientX: number, clientY: number): string | null {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObject(pickMesh, false);
    const first = hits[0];
    if (first?.instanceId === undefined) return null;
    const a = authors[first.instanceId];
    return a && nodeVisible(a) ? a.id : null;
  }

  /** city markers use the raycaster state the author pick just set */
  function pickCity(): Work | null {
    const wid = cityMarkers.pick(raycaster);
    return wid ? (worksById.get(wid) ?? null) : null;
  }

  function pickRelation(): Relation | null {
    const groups = [...highlightGroups, ...edgeGroups];
    for (const g of groups) {
      const hits = raycaster.intersectObject(g.lines, false);
      const first = hits[0];
      if (first?.index !== undefined) {
        const rel = g.relations[Math.floor(first.index / (ARC_SEG * 2))];
        if (rel) return rel;
      }
    }
    return null;
  }

  function onPointerMove(e: PointerEvent): void {
    if (e.pointerType === "touch") return;
    moveTooltip(e.clientX, e.clientY);
    if (hoverPending) return;
    hoverPending = true;
    const evT = e.timeStamp; // same clock as performance.now()
    requestAnimationFrame(() => {
      hoverPending = false;
      if (disposed) return;
      const s = store.getState();
      const rawAuthor = pickAuthor(e.clientX, e.clientY); // also arms the raycaster
      // towns are precise targets that only exist inside the selected realm
      // at reading distance — when the pointer hits one, no star's generous
      // pick disc may swallow it (7th review vertical slice). Star beats
      // town only when the town disc is NOT hit.
      const cw = pickCity();
      const id = cw ? null : rawAuthor;
      const rel = id || cw ? null : pickRelation();
      renderer.domElement.style.cursor = id || cw || rel ? "pointer" : "grab";
      const changed =
        id !== s.hoveredAuthorId ||
        (cw?.id ?? null) !== s.hoveredWorkId ||
        (rel?.id ?? null) !== s.hoveredRelationId;
      if (id !== s.hoveredAuthorId) cbs.onHover(id);
      if ((cw?.id ?? null) !== s.hoveredWorkId) cbs.onWorkHover(cw);
      if ((rel?.id ?? null) !== s.hoveredRelationId) cbs.onRelationHover(rel);
      // pointer event → hover state applied (store writes above run the
      // renderer's subscription synchronously, so this is the apply time; the
      // paint follows inside this same rAF turn)
      if (changed) instr.latency("hover", performance.now() - evT);
    });
  }

  function onPointerDown(e: PointerEvent): void {
    downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
    // contact fires at PRESS, not at click resolution — the world answers
    // before the finger lifts (7th review §4.4 stage 1)
    const id = pickAuthor(e.clientX, e.clientY);
    if (id) triggerContact(id, e.timeStamp);
  }

  function onPointerUp(e: PointerEvent): void {
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    const dt = performance.now() - downAt.t;
    downAt = null;
    if (moved > 6 || dt > 700) return; // drag, not click
    const id = pickAuthor(e.clientX, e.clientY); // also arms the raycaster
    // a hit town outranks every star's pick disc (see onPointerMove note)
    const cw = pickCity();
    if (cw) {
      cbs.onWorkPick(cw);
      return;
    }
    if (id) {
      cbs.onSelect(id);
      return;
    }
    const rel = pickRelation();
    if (rel) {
      cbs.onRelationPick(rel);
      return;
    }
    cbs.onSelect(null);
  }

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointerleave", () => {
    const s = store.getState();
    if (s.hoveredAuthorId) cbs.onHover(null);
    if (s.hoveredRelationId) cbs.onRelationHover(null);
    // leaving the canvas must also drop town-marker emphasis (5th review)
    if (s.hoveredWorkId) cbs.onWorkHover(null);
  });

  // --- store subscription with field diffing --------------------------------
  let prev = store.getState();
  let prevReducedMotion = prev.reducedMotion;
  let prevEgoExpanded = prev.egoExpanded;
  let prevReplayToken = prev.flowReplayToken;
  recomputeVisibility();
  refreshEraTextures(); // seeds union alphas + terrain uniforms (atlas view)
  updateNodeInstances();
  rebuildEdges();
  updateLabels();

  // deep links (#/?a=…) should open already aimed at their author
  {
    const boot = store.getState().selectedAuthorId;
    const p = boot ? current.get(boot) : undefined;
    if (p) {
      camera.position.set(p[0], p[1], p[2]).normalize().multiplyScalar(240);
      camera.lookAt(0, 0, 0);
    }
  }

  const unsub = store.subscribe(() => {
    const s = store.getState();
    const filtersChanged =
      s.filters !== prev.filters || s.year !== prev.year || s.yearMode !== prev.yearMode;
    const selectionChanged = s.selectedAuthorId !== prev.selectedAuthorId;
    const hoverChanged = s.hoveredAuthorId !== prev.hoveredAuthorId;
    const relHoverChanged = s.hoveredRelationId !== prev.hoveredRelationId;
    const pickedChanged =
      s.pickedRelationId !== prev.pickedRelationId ||
      s.selectedWorkId !== prev.selectedWorkId;
    const modeChanged = s.mode !== prev.mode;
    const localeChanged = s.locale !== prev.locale;
    // captured BEFORE prev is replaced — the old compare-after-assign made
    // this branch dead code and hover emphasis never reached the markers
    // (latent bug surfaced by the 5th-review pointerleave audit)
    const workEmphasisChanged =
      s.hoveredWorkId !== prev.hoveredWorkId || s.selectedWorkId !== prev.selectedWorkId;
    const workHoverChanged = s.hoveredWorkId !== prev.hoveredWorkId;
    const prevSelForCam = prev.selectedAuthorId;
    const prevWorkForCam = prev.selectedWorkId;
    const previewChanged = s.yearPreview !== prev.yearPreview;
    const lensChanged = s.lens !== prev.lens;
    prev = s;

    // Escape restores where you came from (7th review §7): pose bookmarks
    // push when exploration deepens and pop on the way out — planet→author
    // and author→work, symmetric on close
    if (selectionChanged) {
      if (!prevSelForCam && s.selectedAuthorId) cam.pushBookmark("planet");
      else if (prevSelForCam && !s.selectedAuthorId) cam.restoreBookmark("planet");
    }
    if (s.selectedWorkId !== prevWorkForCam) {
      if (!prevWorkForCam && s.selectedWorkId) {
        cam.pushBookmark("author");
        // author → work: the camera walks INTO the town (7th review §7);
        // safe-area framing keeps it beside the card, and the flight is
        // cancellable like every programmatic move
        const town = s.selectedAuthorId
          ? dataset.territory?.geometry.cities[s.selectedAuthorId]?.towns.find(
              (t) => t.id === s.selectedWorkId
            )
          : undefined;
        if (town && s.mode === "semantic" && dataset.territory) {
          const g = dataset.territory.geometry;
          const p = gridToVec3(town.x, town.y, g.gridWidth, g.gridHeight);
          cam.focusTo(new THREE.Vector3(p[0], p[1], p[2]), CAMERA_MIN + 4, { tag: "city" });
        }
      } else if (prevWorkForCam && !s.selectedWorkId) cam.restoreBookmark("author");
    }
    if (lensChanged) refreshLens();

    // the picked line carries the only in-place type label — refresh it
    if (pickedChanged) updateLabels();
    // marker ↔ label emphasis stays in lockstep through the store
    if (workEmphasisChanged) {
      cityMarkers.setEmphasis(s.hoveredWorkId, s.selectedWorkId);
      if (workHoverChanged) updateLabels();
    }

    if (localeChanged) updateLabels();
    if (relHoverChanged) {
      updateRelationHover();
      setEdgeTooltip(s.hoveredRelationId ? relationById.get(s.hoveredRelationId) ?? null : null);
      updateLabels();
    }

    if (modeChanged) {
      const from = new Map(current);
      transition = {
        from,
        start: performance.now(),
        dur: s.reducedMotion ? 0 : 950
      };
      instr.log("mode-transition-start", { to: s.mode, dur: transition.dur });
      paletteFrom = paletteK;
      edgeRoot.visible = false;
      highlightRoot.visible = false;
      if (arrowMesh) arrowMesh.visible = false;
      flowStory.setVisible(false);
      // swing the camera with the nodes, or the map ends up facing empty ocean
      const target = positionsFor(s.mode);
      let aim: Vec3 | undefined = s.selectedAuthorId
        ? target.get(s.selectedAuthorId)
        : undefined;
      if (!aim) {
        let cx = 0, cy = 0, cz = 0;
        for (const id of visibleSet) {
          const p = target.get(id);
          if (!p) continue;
          cx += p[0]; cy += p[1]; cz += p[2];
        }
        const len = Math.hypot(cx, cy, cz);
        if (len > 1e-3) aim = [cx / len, cy / len, cz / len];
      }
      if (aim) {
        animateCameraTo(
          new THREE.Vector3(aim[0], aim[1], aim[2]),
          camera.position.length(),
          "transition"
        );
      }
      refreshLens(); // relief belongs to the semantic plate only
    }
    // the year fader drives sovereignty: nation lifecycle + treaty alphas.
    // A held-scrub preview refreshes the WORLD only (labels/towns follow the
    // atomic display commit); relations and visibility wait for the commit.
    if (filtersChanged || previewChanged) {
      const prevDisplay = display;
      refreshEraTextures();
      if (previewChanged && !filtersChanged && display !== prevDisplay) {
        updateLabels();
        syncCityMarkers();
      }
    }
    if (filtersChanged || selectionChanged) {
      // keyboard/search selection has no pointerdown — contact still fires
      if (selectionChanged && s.selectedAuthorId) triggerContact(s.selectedAuthorId);
      recomputeVisibility();
      computeSealClusters(true);
      updateNodeInstances();
      if (!transition) rebuildEdges();
      updateLabels();
      syncCityMarkers();
      if (selectionChanged) refreshLens();
    } else if (hoverChanged) {
      updateRelationHover();
      updateNodeInstances();
      updateLabels();
    }
    if (selectionChanged || filtersChanged) updateRelationHover();
    // OS-level motion preference can flip mid-session — drop/restore the flows
    if (s.reducedMotion !== prevReducedMotion && !transition) rebuildEdges();
    prevReducedMotion = s.reducedMotion;
    // "모두 보기" lifts the map's ego cap for this selection (PR3)
    if (s.egoExpanded !== prevEgoExpanded && !transition) rebuildEdges();
    prevEgoExpanded = s.egoExpanded;
    // explicit replay: the ONLY way to reset the story clock besides a new
    // selection (7th review PR2) — the token changes the story key
    if (s.flowReplayToken !== prevReplayToken && !transition) rebuildEdges();
    prevReplayToken = s.flowReplayToken;
    updateRings();
  });

  // --- camera focus ---------------------------------------------------------
  function animateCameraTo(
    dir: THREE.Vector3,
    dist: number,
    kind: "focus" | "transition" = "focus"
  ): void {
    cam.focusTo(dir, dist, { kind });
  }

  function focusAuthor(id: string, opts?: { distance?: number }): void {
    const p = current.get(id);
    if (!p) return;
    const dist = opts?.distance ?? Math.min(camera.position.length(), 215);
    animateCameraTo(new THREE.Vector3(p[0], p[1], p[2]), dist);
  }

  function resetCamera(): void {
    // explicit navigation re-baselines the pose history — a later Escape must
    // not fly back to a view the user deliberately left
    cam.clearBookmarks();
    animateCameraTo(new THREE.Vector3(0, 0.32, 0.95).normalize(), CAMERA_DEFAULT);
  }

  function zoomBy(factor: number): void {
    const dist = Math.min(
      CAMERA_MAX,
      Math.max(CAMERA_MIN, camera.position.length() * factor)
    );
    animateCameraTo(camera.position.clone().normalize(), dist);
  }

  // --- resize / loop --------------------------------------------------------
  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    updateLabels();
  });
  ro.observe(container);

  let rafId = 0;
  let lastCamPos = camera.position.clone();

  // screen-space seal overlap: DOM-label metrics alone let a visually
  // collapsed geo view report "overlap 0" (4th review) — this measures what
  // the eye actually sees. Sprites are projected to screen squares; pairs
  // that intersect are counted. Only runs when the probe is polled.
  function sealScreenOverlap(): { visible: number; overlapPairs: number } {
    const w = container.clientWidth;
    const h = Math.max(1, container.clientHeight);
    const halfFovTan = Math.tan((camera.fov * Math.PI) / 360);
    const rects: Array<{ x0: number; x1: number; y0: number; y1: number }> = [];
    for (const [, sprite] of sealSprites) {
      if (!sprite.visible) continue;
      const mat = sprite.material as THREE.SpriteMaterial;
      if (mat.opacity < 0.05) continue;
      const d = camera.position.distanceTo(sprite.position);
      if (d <= 0) continue;
      tmpV.copy(sprite.position).project(camera);
      if (tmpV.z > 1 || tmpV.x < -1.2 || tmpV.x > 1.2 || tmpV.y < -1.2 || tmpV.y > 1.2) continue;
      const px = ((tmpV.x + 1) / 2) * w;
      const py = ((-tmpV.y + 1) / 2) * h;
      const sizePx = (sprite.scale.x * h) / (2 * d * halfFovTan);
      rects.push({ x0: px - sizePx / 2, x1: px + sizePx / 2, y0: py - sizePx / 2, y1: py + sizePx / 2 });
    }
    let pairs = 0;
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i]!;
        const b = rects[j]!;
        if (a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0) pairs++;
      }
    }
    return { visible: rects.length, overlapPairs: pairs };
  }

  // live renderer numbers for the debug overlay / QA metrics — every value is
  // read from what this frame actually holds, nothing is estimated
  const probe = () => ({
    gl: glInfo,
    pixelRatio: renderer.getPixelRatio(),
    drawCalls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    glLines: renderer.info.render.lines,
    glPoints: renderer.info.render.points,
    geometries: renderer.info.memory.geometries,
    textures: renderer.info.memory.textures,
    memory: {
      texturesTracked: texRegistry.size,
      textureBytesEstimate: textureBytesEstimate()
    },
    cameraDistance: Math.round(camera.position.length() * 10) / 10,
    cameraDir: camera.position
      .clone()
      .normalize()
      .toArray()
      .map((v) => Math.round(v * 1000) / 1000),
    lod,
    modeTransition: transition !== null,
    cameraAnimating: cam.animating(),
    cameraState: cam.stateKind(),
    safeAreaSettling: cam.offsetSettling(),
    interaction: {
      lodTransitions: lodGate.transitions,
      flowStoryBuilds: flowStory.storyBuilds,
      flowStoryDiffs: flowStory.storyDiffs,
      storyKey: flowStory.metrics().storyKey
    },
    rendererVisibleAuthors: visibleSet.size,
    rendererVisibleRelations: visRels.length,
    relationView: lastRelationView
      ? {
          reason: lastRelationView.reason,
          rawDrawn: lastRelationView.raw.length,
          hiddenCount: lastRelationView.hiddenCount,
          aggregateRoutes: lastRelationView.aggregates.length
        }
      : null,
    flowSparks: (flowStory.metrics().sparks as number) ?? 0,
    /** nodes that have answered an arriving spark with their one pulse */
    flowArrivals: (flowStory.metrics().arrivals as number) ?? 0,
    /** pulses alive this frame — the event-synced capture waits on this */
    activePulses: flowStory.activePulses(),
    // static direction encoding — must survive reduced-motion
    arrowInstances: arrowMesh ? arrowMesh.count : 0,
    labelsShown: labels.lastShown,
    labelsSuppressed: labels.lastSuppressed,
    labelsOverlapping: labels.lastOverlapping,
    labelsByKind: labels.lastShownByKind,
    seals: {
      ...sealScreenOverlap(),
      clusters: sealClusters.length,
      clusteredMembers: clusterHidden.size
    },
    lifecycle: (() => {
      const s = store.getState();
      const sel = s.selectedAuthorId ? authors[indexOf.get(s.selectedAuthorId) ?? -1] : undefined;
      // reported at the COMMITTED display year — what the world shows, not
      // where the slider is mid-load
      return {
        on: display.engaged,
        selected: sel ? lifecycleOf(sel, display.year, display.yearMode) : null,
        activeTreaties: movementTreaties.filter(
          (e) => e !== null && treatyPresence(e.treaty, display.year, display.yearMode) > 0.5
        ).length
      };
    })(),
    unionOverlay: terrainMat
      ? Math.round((terrainMat.uniforms.uUnion!.value as number) * 100) / 100
      : 0,
    era: {
      ...(temporal?.metrics() ?? { status: "idle" }),
      active: eraActive,
      bracket: eraBracket,
      mix: Math.round(eraMixNow * 1000) / 1000,
      targetYear: store.getState().year,
      previewYear: store.getState().yearPreview,
      displayYear: display.year,
      loading: eraLoadingSent
    },
    cityMarkers: (() => {
      // page coordinates (not container-relative) so the QA harness can
      // click the marker's true screen position
      const rect = container.getBoundingClientRect();
      return {
        count: cityMarkers.count,
        buildings: cityMarkers.buildingCount,
        roadSegments: cityMarkers.roadSegments,
        screen: cityMarkers
          .screenPositions(camera, container.clientWidth, container.clientHeight)
          .map((p) => ({ id: p.id, x: p.x + Math.round(rect.left), y: p.y + Math.round(rect.top) }))
      };
    })(),
    lens: {
      id: store.getState().lens,
      active: terrainMat ? (terrainMat.uniforms.uLensOn!.value as number) > 0.5 : false,
      amp: terrainMat
        ? Math.round((terrainMat.uniforms.uLensAmp!.value as number) * 100) / 100
        : 0
    },
    // anchor-star page coordinates so QA can drive REAL pointer paths
    // (hover/click a node without private action hooks)
    authorScreens: (() => {
      const rect = container.getBoundingClientRect();
      const camDir = camera.position.clone().normalize();
      const v = new THREE.Vector3();
      const out: Array<{ id: string; x: number; y: number }> = [];
      for (const a of authors) {
        if (a.tier !== "anchor" || !nodeVisible(a)) continue;
        const p = current.get(a.id);
        if (!p) continue;
        if (p[0] * camDir.x + p[1] * camDir.y + p[2] * camDir.z < 0.25) continue; // back side
        v.set(p[0], p[1], p[2]).multiplyScalar(R).project(camera);
        if (v.z > 1) continue;
        out.push({
          id: a.id,
          x: Math.round(((v.x + 1) / 2) * container.clientWidth) + Math.round(rect.left),
          y: Math.round(((-v.y + 1) / 2) * container.clientHeight) + Math.round(rect.top)
        });
      }
      return out;
    })()
  });
  instr.registerRenderer(probe);

  function frame(now: number): void {
    if (disposed) return;
    rafId = requestAnimationFrame(frame);
    instr.frameTick(now);

    // zoom-proportional input: a fixed angular speed hurls the map at
    // reading distance (CPO report) — scale by height above the surface
    controls.rotateSpeed =
      0.55 *
      Math.min(1, Math.max(0.15, (camera.position.length() - R) / (CAMERA_DEFAULT - R)));

    cam.update(now);

    {
      const newSealK = sealFade(camera.position.length());
      const sealChanged = Math.abs(newSealK - sealK) > 0.004;
      sealK = newSealK;
      if (sealChanged && !transition) {
        computeSealClusters(true);
        updateNodeInstances();
      }
    }

    if (transition) {
      const s = store.getState();
      const target = positionsFor(s.mode);
      const t =
        transition.dur === 0 ? 1 : Math.min(1, (now - transition.start) / transition.dur);
      const k = easeInOut(t);
      for (const a of authors) {
        const from = transition.from.get(a.id);
        const to = target.get(a.id);
        if (from && to) current.set(a.id, slerp(from, to, k));
      }
      // ⑤ the stars stay, the world changes: plate colors cross-fade in sync
      const targetK = s.mode === "geo" ? 1 : 0;
      paletteK = paletteFrom + (targetK - paletteFrom) * k;
      applyPalette(paletteK);
      updateNodeInstances();
      updateRings();
      updateLabels();
      if (t >= 1) {
        transition = null;
        setCurrentFrom(target);
        paletteK = targetK;
        applyPalette(paletteK);
        edgeRoot.visible = true;
        highlightRoot.visible = true;
        if (arrowMesh) arrowMesh.visible = true;
        flowStory.setVisible(true);
        computeSealClusters(true);
        rebuildEdges();
        updateNodeInstances();
        updateRelationHover();
        updateLabels();
        instr.log("mode-transition-end", { mode: s.mode });
      }
    }

    if (terrainMat && terrainMesh) {
      // after the transition block so paletteK is this frame's value (§②-7)
      const op = (1 - paletteK) * terrainFade(camera.position.length());
      const cur = terrainMat.uniforms.uOpacity!.value as number;
      if (Math.abs(op - cur) > 0.003 || (op > 0.004) !== terrainMesh.visible) {
        terrainMat.uniforms.uOpacity!.value = op;
        terrainMesh.visible = op > 0.004;
      }
    }

    const newLod = lodGate.update(camera.position.length(), now);
    if (newLod !== lod) {
      const wasNear = lod === "near";
      lod = newLod;
      // soften the rebuild pop: DOM labels restart a 200ms fade-in; the WebGL
      // layers (seals/terrain/union) already fade continuously with distance
      labels.pulseFade();
      // PR2: the 8192px reading plate paints in the worker on first near
      // entry (mid serves until it lands); long absence releases it
      if (lod === "near") temporal?.ensureNearPlate(nearPlateCell);
      else if (wasNear) temporal?.noteAwayFromNear();
      if (terrainMat && terrainTexMid && !eraActive) {
        // near/mid plate swap belongs to the atlas view; while the tectonic
        // bracket is active the era plates serve every LOD
        const want = lod === "near" ? (temporal?.nearPlate() ?? terrainTexMid) : terrainTexMid;
        if (terrainMat.uniforms.map!.value !== want) {
          terrainMat.uniforms.map!.value = want;
          terrainMat.uniforms.mapB!.value = want;
        }
      }
      computeSealClusters(true);
      updateNodeInstances();
      if (!transition) rebuildEdges();
      updateLabels();
      syncCityMarkers();
    } else if (!camera.position.equals(lastCamPos)) {
      // panning across geo reclusters the seals (throttled by camera delta);
      // recluster also regroups the mid-LOD aggregate routes (PR3)
      if (computeSealClusters()) {
        updateNodeInstances();
        const sNow = store.getState();
        if (!sNow.selectedAuthorId && sNow.mode === "geo" && lod === "mid" && !transition) {
          rebuildEdges();
        }
      }
      updateLabels();
      updateRings();
    }
    lastCamPos.copy(camera.position);

    // union treaty overlay belongs to the mid view (LOD contract) — eased in
    unionTarget = lod === "mid" ? 1 : 0;
    if (terrainMat) {
      const u = terrainMat.uniforms.uUnion!;
      u.value = (u.value as number) + (unionTarget - (u.value as number)) * 0.08;
    }

    cityMarkers.update(now); // founding growth tick (settled = no-op)

    if (contact && terrainMat) {
      const t = now - contact.start;
      const k = t < 50 ? t / 50 : Math.max(0, 1 - (t - 50) / 160);
      terrainMat.uniforms.uContactIdx!.value = contact.idx;
      terrainMat.uniforms.uContactK!.value = k;
      if (t > 240) {
        contact = null;
        terrainMat.uniforms.uContactK!.value = 0;
      }
    }

    flowStory.update(now);
    renderer.render(scene, camera);
  }
  // one-time GPU warmup BEFORE the frame loop: shader compiles + the mid
  // plate upload belong to load, not to the first interactive frame (PR2 —
  // this was the last 50ms+ long task in the boot segment)
  renderer.compile(scene, camera);
  if (terrainTexMid) renderer.initTexture(terrainTexMid);
  rafId = requestAnimationFrame(frame);

  function dispose(): void {
    disposed = true;
    instr.unregisterRenderer(probe);
    cancelAnimationFrame(rafId);
    unsub();
    ro.disconnect();
    labels.dispose();
    tooltip.remove();
    clearRelHover();
    clearGroup(hoverWebRoot, hoverWebGroups);
    clearGroup(edgeRoot, edgeGroups);
    clearGroup(highlightRoot, highlightGroups);
    if (arrowMesh) {
      scene.remove(arrowMesh);
      arrowMesh.dispose();
    }
    flowStory.dispose();
    clearAggregates();
    scene.remove(aggRoot);
    temporal?.dispose();
    cityMarkers.dispose();
    nodes.dispose();
    pickMesh.dispose();
    for (const d of disposables) d.dispose();
    cam.dispose();
    controls.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  function timelineIntent(): void {
    temporal?.requestEras();
  }

  function setSafeInsets(insets: { right?: number; bottom?: number }): void {
    cam.setSafeInsets(insets);
  }

  return { focusAuthor, resetCamera, zoomBy, timelineIntent, setSafeInsets, dispose };
}
