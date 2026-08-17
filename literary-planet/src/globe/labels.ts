// DOM label overlay with greedy screen-space collision.
// DOM (not sprites) keeps Korean text crisp and screen-reader reachable.

export type LabelState = "normal" | "selected" | "hovered" | "neighbor" | "dim";

export interface LabelItem {
  id: string;
  text: string;
  kind: "author" | "movement" | "work" | "relation" | "region";
  size: "lg" | "md" | "sm";
  priority: number;
  x: number;
  y: number;
  state: LabelState;
  /** explicit ink (relation-type labels use their line's color) */
  color?: string;
  /** clickable + focusable (work towns); activation reported via onActivate */
  interactive?: boolean;
  ariaLabel?: string;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function overlaps(a: Rect, b: Rect, pad: number): boolean {
  return (
    a.x - pad < b.x + b.w &&
    a.x + a.w + pad > b.x &&
    a.y - pad < b.y + b.h &&
    a.y + a.h + pad > b.y
  );
}

function estimateWidth(text: string, fontSize: number): number {
  let units = 0;
  for (const ch of text) {
    units += /[ᄀ-ᇿ㄰-㆏가-힯一-鿿぀-ヿ]/.test(ch)
      ? 1
      : 0.56;
  }
  return units * fontSize + 8;
}

const FONT_SIZE: Record<LabelItem["size"], number> = { lg: 14, md: 12, sm: 11 };

export class LabelLayer {
  private root: HTMLDivElement;
  private pool = new Map<string, HTMLDivElement>();
  /** fired when an interactive label (work town) is clicked or Enter/Space-ed */
  onActivate: ((id: string) => void) | null = null;
  /** fired as the pointer enters/leaves an interactive label — the DOM half
   * of the shared marker↔label hover state */
  onHover: ((id: string | null) => void) | null = null;
  /** labels placed in the last update (instrumentation) */
  lastShown = 0;
  /**
   * candidates the greedy pass refused to place because they would have
   * overlapped (instrumentation) — these do NOT render; a high number means
   * "much of the map is unlabeled", not "labels overlap on screen"
   */
  lastSuppressed = 0;
  /**
   * placed labels that nevertheless overlap another placed label
   * (instrumentation) — only must-show labels (selected/hovered) can do
   * this, since they bypass the greedy check; this is the true on-screen
   * overlap count
   */
  lastOverlapping = 0;
  /** per-kind breakdown of the last update (instrumentation) */
  lastShownByKind: Record<string, number> = {};

  constructor(container: HTMLElement) {
    this.root = document.createElement("div");
    this.root.className = "globe-labels";
    // aria-hidden lives on each non-interactive label, not the root — work
    // towns are real buttons and must stay in the accessibility tree
    container.appendChild(this.root);
  }

  update(items: LabelItem[], width: number, height: number, budget: number): void {
    const placed: Rect[] = [];
    const shown = new Set<string>();
    let suppressed = 0;
    let overlapping = 0;
    const byKind: Record<string, number> = {};
    const sorted = [...items].sort((a, b) => b.priority - a.priority);

    for (const item of sorted) {
      if (shown.size >= budget && item.state === "normal") continue;
      if (item.x < -40 || item.x > width + 40 || item.y < -20 || item.y > height + 20) continue;
      const fs = FONT_SIZE[item.size];
      const w = estimateWidth(item.text, fs);
      const rect: Rect = { x: item.x - w / 2, y: item.y, w, h: fs + 6 };
      const mustShow = item.state === "selected" || item.state === "hovered";
      const collides = placed.some((p) => overlaps(p, rect, 2));
      if (!mustShow && collides) {
        suppressed++;
        continue;
      }
      if (mustShow && collides) overlapping++;
      placed.push(rect);
      shown.add(item.id);
      byKind[item.kind] = (byKind[item.kind] ?? 0) + 1;

      let el = this.pool.get(item.id);
      if (!el) {
        el = document.createElement("div");
        el.dataset.labelId = item.id;
        el.addEventListener("click", () => {
          if (el!.dataset.interactive === "1") this.onActivate?.(el!.dataset.labelId!);
        });
        el.addEventListener("keydown", (e) => {
          if (el!.dataset.interactive !== "1") return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.onActivate?.(el!.dataset.labelId!);
          }
        });
        el.addEventListener("pointerenter", () => {
          if (el!.dataset.interactive === "1") this.onHover?.(el!.dataset.labelId!);
        });
        el.addEventListener("pointerleave", () => {
          if (el!.dataset.interactive === "1") this.onHover?.(null);
        });
        this.pool.set(item.id, el);
        this.root.appendChild(el);
      }
      el.className = `globe-label globe-label--${item.kind} globe-label--${item.size} is-${item.state}${item.interactive ? " is-interactive" : ""}`;
      if (el.textContent !== item.text) el.textContent = item.text;
      el.style.color = item.color ?? "";
      el.style.transform = `translate(-50%, 0) translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0)`;
      el.style.display = "block";
      if (item.interactive) {
        el.dataset.interactive = "1";
        el.setAttribute("role", "button");
        el.tabIndex = 0;
        el.setAttribute("aria-label", item.ariaLabel ?? item.text);
        el.removeAttribute("aria-hidden");
      } else {
        delete el.dataset.interactive;
        el.removeAttribute("role");
        el.removeAttribute("tabindex");
        el.removeAttribute("aria-label");
        el.setAttribute("aria-hidden", "true");
      }
    }

    for (const [id, el] of this.pool) {
      if (!shown.has(id)) el.style.display = "none";
    }
    this.lastShown = shown.size;
    this.lastSuppressed = suppressed;
    this.lastOverlapping = overlapping;
    this.lastShownByKind = byKind;
  }

  clear(): void {
    for (const el of this.pool.values()) el.style.display = "none";
  }

  dispose(): void {
    this.root.remove();
    this.pool.clear();
  }
}
