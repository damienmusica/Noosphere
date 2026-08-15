// DOM label overlay with greedy screen-space collision.
// DOM (not sprites) keeps Korean text crisp and screen-reader reachable.

export type LabelState = "normal" | "selected" | "hovered" | "neighbor" | "dim";

export interface LabelItem {
  id: string;
  text: string;
  kind: "author" | "movement";
  size: "lg" | "md" | "sm";
  priority: number;
  x: number;
  y: number;
  state: LabelState;
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

  constructor(container: HTMLElement) {
    this.root = document.createElement("div");
    this.root.className = "globe-labels";
    this.root.setAttribute("aria-hidden", "true");
    container.appendChild(this.root);
  }

  update(items: LabelItem[], width: number, height: number, budget: number): void {
    const placed: Rect[] = [];
    const shown = new Set<string>();
    const sorted = [...items].sort((a, b) => b.priority - a.priority);

    for (const item of sorted) {
      if (shown.size >= budget && item.state === "normal") continue;
      if (item.x < -40 || item.x > width + 40 || item.y < -20 || item.y > height + 20) continue;
      const fs = FONT_SIZE[item.size];
      const w = estimateWidth(item.text, fs);
      const rect: Rect = { x: item.x - w / 2, y: item.y, w, h: fs + 6 };
      const mustShow = item.state === "selected" || item.state === "hovered";
      if (!mustShow && placed.some((p) => overlaps(p, rect, 2))) continue;
      placed.push(rect);
      shown.add(item.id);

      let el = this.pool.get(item.id);
      if (!el) {
        el = document.createElement("div");
        this.pool.set(item.id, el);
        this.root.appendChild(el);
      }
      el.className = `globe-label globe-label--${item.kind} globe-label--${item.size} is-${item.state}`;
      if (el.textContent !== item.text) el.textContent = item.text;
      el.style.transform = `translate(-50%, 0) translate3d(${item.x.toFixed(1)}px, ${item.y.toFixed(1)}px, 0)`;
      el.style.display = "block";
    }

    for (const [id, el] of this.pool) {
      if (!shown.has(id)) el.style.display = "none";
    }
  }

  clear(): void {
    for (const el of this.pool.values()) el.style.display = "none";
  }

  dispose(): void {
    this.root.remove();
    this.pool.clear();
  }
}
