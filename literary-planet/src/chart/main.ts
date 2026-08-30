// B안 — 2D 성좌도 (3안 비교 프로토타입, 판결 §5-1 집행 2026-08-30).
//
// 은유는 전제가 아니라 변수다: 같은 데이터·같은 여정(발견 → 관계 홉 → 책
// 담기)을 **비행 없는 한 장의 지도**로 세운다. A(3D 관측선)와 낯선 5인의
// 과제로 겨루고, 지는 안은 죽는다 — 이 파일이 이기든 지든 그 판정이 가치다.
//
// 프로토타입 규율: 계약 없음(UX 계약 신설 동결), 의존 최소(SVG + 기존 데이터
// 로더·테마만), 담기는 성계와 같은 localStorage 성좌를 쓴다.

import { loadDataset } from "../data/load.ts";
import { PERIOD_TINT, RELATION_COLORS } from "../theme.ts";
import { periodOf } from "../universe/grammar.ts";
import { EVIDENCE_KO, REL_KO, relationGlyph } from "../universe/relations.ts";
import type { Author, Relation } from "../types.ts";

const d = loadDataset();
const byId = new Map(d.authors.map((a) => [a.id, a]));
const W = 2400;
const H = 1200;

// 동결 좌표(단위 벡터)를 등장방형으로 편다 — 3D 와 같은 이웃 관계, 다른 투영
const pos = new Map<string, { x: number; y: number }>();
for (const a of d.authors) {
  const v = d.positions.positions[a.id];
  if (!v) continue;
  const lon = Math.atan2(v[2], v[0]);
  const lat = Math.asin(Math.max(-1, Math.min(1, v[1])));
  pos.set(a.id, {
    x: ((lon + Math.PI) / (2 * Math.PI)) * W,
    y: ((Math.PI / 2 - lat) / Math.PI) * H
  });
}

const REL_TYPES = ["translation", "documented_influence", "affinity"] as const;
const REL_LABEL: Record<string, string> = {
  translation: "번역과 수용",
  documented_influence: "직접 영향",
  affinity: "사후 친연성"
};
const relColor = (t: string): string =>
  (RELATION_COLORS as Record<string, string>)[t] ?? "#9db77a";

const root = document.getElementById("root")!;
root.innerHTML = `
<style>
:root{--bg:#14100a;--text:#ecdfc3;--dim:#b5aa90;--faint:#8f8674;--brass:#cfa759;--brass-b:#e9c76f;--line:rgba(207,167,89,.22);--veil:rgba(20,16,10,.88)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:'Noto Serif KR',serif;overflow:hidden}
#stage{position:fixed;inset:0;cursor:grab}
#stage.drag{cursor:grabbing}
.top{position:fixed;top:0;left:0;right:0;display:flex;gap:14px;align-items:center;padding:12px 16px;z-index:5;background:linear-gradient(var(--bg),transparent)}
.top h1{font-size:15px;letter-spacing:.3em;font-weight:600}
.top nav{margin-left:auto;font-size:12px;display:flex;gap:12px}
.top a{color:var(--brass-b);text-decoration:none}
.top input{font:inherit;font-size:13px;background:none;border:1px solid var(--line);color:var(--text);padding:5px 10px;width:170px}
.legend{position:fixed;left:16px;bottom:16px;z-index:5;background:var(--veil);border:1px solid var(--line);padding:10px 12px;font-size:12px}
.legend label{display:flex;gap:7px;align-items:center;padding:2px 0;cursor:pointer;color:var(--dim)}
.legend .sw{width:14px;height:2px;display:inline-block}
#panel{position:fixed;top:0;right:0;bottom:0;width:min(400px,92vw);z-index:6;background:var(--veil);border-left:1px solid var(--line);padding:20px;overflow-y:auto;display:none}
#panel.open{display:block}
#panel h2{font-size:21px;letter-spacing:.04em}
#panel .orig{color:var(--dim);font-size:13px}
#panel .life{color:var(--faint);font-size:12px;margin:4px 0 12px}
#panel .why{font-size:13.5px;line-height:1.65;border-left:2px solid var(--brass);padding-left:10px;margin-bottom:14px}
#panel h3{font-size:11px;letter-spacing:.2em;color:var(--faint);margin:16px 0 6px}
#panel ul{list-style:none}
#panel .works li{padding:6px 0;border-bottom:1px dashed var(--line);font-size:13.5px}
#panel .works .y{color:var(--faint);font-size:11px;margin-left:6px}
#panel .works .sig{color:var(--dim);font-size:12.5px;margin-top:2px}
#panel .rels li{padding:5px 0;font-size:13px;border-bottom:1px dashed var(--line)}
#panel .rels button{font:inherit;color:var(--brass-b);background:none;border:0;cursor:pointer;padding:0}
#panel .rels .rt{font-size:10.5px;color:var(--faint);margin-left:6px}
#panel .rels .sum{color:var(--dim);font-size:12px;margin-top:2px}
#panel .doors{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;font-size:12px}
#panel .doors a{border:1px solid var(--brass);padding:5px 10px;color:var(--brass-b);text-decoration:none}
#panel .close{position:absolute;top:10px;right:12px;font-size:18px;background:none;border:0;color:var(--dim);cursor:pointer}
button.want{font:inherit;font-size:10.5px;color:var(--dim);background:none;border:1px solid var(--line);border-radius:2px;padding:1px 7px;margin-left:7px;cursor:pointer;white-space:nowrap}
button.want.on{background:rgba(207,167,89,.16);color:var(--text);border-color:var(--brass)}
text{font-family:'Noto Serif KR',serif;fill:var(--dim);pointer-events:none}
circle.star{cursor:pointer}
.hint{position:fixed;bottom:16px;right:16px;z-index:5;font-size:11.5px;color:var(--faint)}
</style>
<div class="top">
  <h1>문학의 성좌도</h1>
  <input id="q" placeholder="별 찾기" />
  <nav><a href="/">성계(3D)</a><a href="/walk/">산책</a><a href="/authors/">색인</a></nav>
</div>
<div id="stage"></div>
<div class="legend" id="legend"></div>
<aside id="panel"></aside>
<p class="hint">끌어서 이동 · 휠로 확대 · 별을 누르면 방이 열린다</p>
`;

const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");
const gLines = document.createElementNS(svgNS, "g");
const gStars = document.createElementNS(svgNS, "g");
const gLabels = document.createElementNS(svgNS, "g");
svg.append(gLines, gStars, gLabels);
document.getElementById("stage")!.appendChild(svg);

const vb = { x: 0, y: 0, w: W, h: H };
const applyVb = (): void => svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
applyVb();

// ——— 별 ———
const starEls = new Map<string, SVGCircleElement>();
const labelEls = new Map<string, SVGTextElement>();
for (const a of d.authors) {
  const p = pos.get(a.id);
  if (!p) continue;
  const c = document.createElementNS(svgNS, "circle");
  const r = a.tier === "anchor" ? 7 : a.tier === "major" ? 5 : 3.6;
  c.setAttribute("cx", String(p.x));
  c.setAttribute("cy", String(p.y));
  c.setAttribute("r", String(r));
  c.setAttribute("fill", PERIOD_TINT[periodOf(a)]);
  c.setAttribute("class", "star");
  c.addEventListener("click", () => select(a.id));
  c.addEventListener("mouseenter", () => hover(a.id, true));
  c.addEventListener("mouseleave", () => hover(a.id, false));
  gStars.appendChild(c);
  starEls.set(a.id, c);
  const t = document.createElementNS(svgNS, "text");
  t.setAttribute("x", String(p.x));
  t.setAttribute("y", String(p.y + r + 13));
  t.setAttribute("text-anchor", "middle");
  t.textContent = a.names.ko;
  gLabels.appendChild(t);
  labelEls.set(a.id, t);
}

function refreshLabels(): void {
  const k = W / vb.w;
  const fs = Math.max(6, 13 / k);
  for (const [id, t] of labelEls) {
    const a = byId.get(id)!;
    const show = a.tier !== "context" || k >= 2.1 || id === selected || hovered === id;
    t.setAttribute("font-size", String(fs));
    t.style.display = show ? "" : "none";
  }
}

// ——— 관계선 ———
const active = new Set<string>(["documented_influence"]);
function drawLines(): void {
  gLines.innerHTML = "";
  const k = W / vb.w;
  for (const r of d.relations) {
    const focusTouch = hovered && (r.sourceId === hovered || r.targetId === hovered);
    if (!active.has(r.type) && !focusTouch) continue;
    const a = pos.get(r.sourceId);
    const b = pos.get(r.targetId);
    if (!a || !b) continue;
    // 등장방형의 이음새(경도 ±180°)를 넘는 쌍은 짧은 쪽으로 감아 그린다
    const dx = b.x - a.x;
    const wrap = Math.abs(dx) > W / 2 ? (dx > 0 ? -W : W) : 0;
    const seg = document.createElementNS(svgNS, "line");
    seg.setAttribute("x1", String(a.x));
    seg.setAttribute("y1", String(a.y));
    seg.setAttribute("x2", String(b.x + wrap));
    seg.setAttribute("y2", String(b.y));
    seg.setAttribute("stroke", relColor(r.type));
    seg.setAttribute("stroke-width", String((focusTouch ? 2 : 0.8) / k));
    seg.setAttribute("opacity", focusTouch ? "0.95" : "0.4");
    gLines.appendChild(seg);
  }
}

const legend = document.getElementById("legend")!;
for (const t of REL_TYPES) {
  const row = document.createElement("label");
  row.innerHTML = `<input type="checkbox" ${active.has(t) ? "checked" : ""}/> <span class="sw" style="background:${relColor(t)}"></span> ${REL_LABEL[t]}`;
  row.querySelector("input")!.addEventListener("change", (e) => {
    if ((e.target as HTMLInputElement).checked) active.add(t);
    else active.delete(t);
    drawLines();
  });
  legend.appendChild(row);
}

// ——— 팬·줌 ———
const stage = document.getElementById("stage")!;
let dragFrom: { px: number; py: number; vx: number; vy: number } | null = null;
stage.addEventListener("pointerdown", (e) => {
  dragFrom = { px: e.clientX, py: e.clientY, vx: vb.x, vy: vb.y };
  stage.classList.add("drag");
});
window.addEventListener("pointermove", (e) => {
  if (!dragFrom) return;
  const scale = vb.w / stage.clientWidth;
  vb.x = dragFrom.vx - (e.clientX - dragFrom.px) * scale;
  vb.y = Math.max(-H * 0.2, Math.min(H * 0.6, dragFrom.vy - (e.clientY - dragFrom.py) * scale));
  applyVb();
});
window.addEventListener("pointerup", () => {
  dragFrom = null;
  stage.classList.remove("drag");
});
stage.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const k = e.deltaY > 0 ? 1.15 : 1 / 1.15;
    const nw = Math.max(W / 14, Math.min(W * 1.4, vb.w * k));
    const mx = vb.x + (e.clientX / stage.clientWidth) * vb.w;
    const my = vb.y + (e.clientY / stage.clientHeight) * vb.h;
    vb.x = mx - ((mx - vb.x) * nw) / vb.w;
    vb.y = my - ((my - vb.y) * nw) / vb.w;
    vb.h = (vb.h * nw) / vb.w;
    vb.w = nw;
    applyVb();
    refreshLabels();
    drawLines();
  },
  { passive: false }
);

// ——— 계측 + 성좌 (성계와 같은 저장소) ———
try {
  const m = JSON.parse(localStorage.getItem("lp.metrics") ?? "{}");
  if (!m.firstLoad) {
    m.firstLoad = Date.now();
    localStorage.setItem("lp.metrics", JSON.stringify(m));
  }
} catch {
  /* private mode */
}
function toggleWant(workId: string, btn: HTMLButtonElement): void {
  try {
    const k = "lp.universe.personal.v2";
    const p = JSON.parse(localStorage.getItem(k) ?? '{"v":2,"read":{},"want":{}}');
    if (p.want[workId]) {
      delete p.want[workId];
      btn.classList.remove("on");
      btn.textContent = "읽고 싶음";
    } else {
      p.want[workId] = Date.now();
      btn.classList.add("on");
      btn.textContent = "담아 둠 ✓";
      const m = JSON.parse(localStorage.getItem("lp.metrics") ?? "{}");
      if (!m.firstWant) {
        m.firstWant = Date.now();
        localStorage.setItem("lp.metrics", JSON.stringify(m));
      }
    }
    localStorage.setItem(k, JSON.stringify(p));
  } catch {
    /* private mode */
  }
}
const wantSet = (): Set<string> => {
  try {
    const p = JSON.parse(localStorage.getItem("lp.universe.personal.v2") ?? "null");
    return new Set(Object.keys(p?.want ?? {}));
  } catch {
    return new Set();
  }
};

// ——— 선택·패널 ———
let selected: string | null = null;
let hovered: string | null = null;
function hover(id: string, on: boolean): void {
  hovered = on ? id : null;
  drawLines();
  refreshLabels();
}
const GLYPH: Record<string, string> = { out: "→", in: "←", both: "↔" };
const firstSentence = (s: string): string => s.match(/^.*?다\./)?.[0] ?? s;

function panTo(id: string): void {
  const p = pos.get(id);
  if (!p) return;
  vb.w = Math.min(vb.w, W / 4);
  vb.h = (vb.h / (vb.w / Math.min(vb.w, W / 4))) as number;
  vb.x = p.x - vb.w / 2;
  vb.y = p.y - vb.h / 2;
  applyVb();
  refreshLabels();
  drawLines();
}

function select(id: string): void {
  selected = id;
  const a = byId.get(id);
  if (!a) return;
  for (const [sid, c] of starEls) c.setAttribute("stroke", sid === id ? "#e9c76f" : "none");
  const works = d.works.filter((w) => w.authorId === id);
  const ordered = a.readingOrder
    .map((wid) => works.find((w) => w.id === wid))
    .filter((w): w is NonNullable<typeof w> => Boolean(w))
    .slice(0, 3);
  const rels = d.relations
    .filter((r) => r.sourceId === id || r.targetId === id)
    .sort((x, y) => (y.weight ?? 0.7) - (x.weight ?? 0.7));
  const wants = wantSet();
  const panel = document.getElementById("panel")!;
  panel.className = "open";
  panel.innerHTML = `
  <button class="close" aria-label="닫기">×</button>
  <h2>${a.names.ko}</h2>
  <p class="orig">${a.names.original}</p>
  <p class="life">${a.birthYear ?? "?"}–${a.deathYear ?? ""} · ${a.languages.join("·")} · 난도 ${a.difficulty}/5</p>
  <p class="why">${firstSentence(a.importanceReason)}</p>
  <h3>여기서 읽기 시작한다면</h3>
  <ul class="works">${ordered
    .map(
      (w, i) => `<li>${w.titleKo}<span class="y">${w.year}</span><button class="want ${wants.has(w.id) ? "on" : ""}" data-w="${w.id}">${wants.has(w.id) ? "담아 둠 ✓" : "읽고 싶음"}</button>
      ${i === 0 ? `<p class="sig">${a.readingEntryReason}</p>` : `<p class="sig">${firstSentence(w.significance)}</p>`}</li>`
    )
    .join("")}</ul>
  <h3>관계 ${rels.length} — 눌러서 건너간다</h3>
  <ul class="rels">${rels
    .map((r: Relation) => {
      const otherId = r.sourceId === id ? r.targetId : r.sourceId;
      const other = byId.get(otherId);
      if (!other) return "";
      return `<li><span style="color:var(--brass)">${GLYPH[relationGlyph(r, id)] ?? "·"}</span>
      <button data-goto="${otherId}">${other.names.ko}</button><span class="rt">${REL_KO[r.type] ?? r.type} · ${EVIDENCE_KO[r.evidenceLevel] ?? ""}</span>
      <p class="sum">${r.summary}</p></li>`;
    })
    .join("")}</ul>
  <div class="doors">
    <a href="/authors/${a.id}/">이 작가의 방(전체 기록)</a>
    <a href="/universe.html?lens=movement&a=${a.id}">성계(3D)에서</a>
  </div>`;
  panel.querySelector(".close")!.addEventListener("click", () => {
    panel.className = "";
    selected = null;
    for (const c of starEls.values()) c.setAttribute("stroke", "none");
  });
  panel.querySelectorAll("button.want").forEach((b) =>
    b.addEventListener("click", () => toggleWant((b as HTMLElement).dataset.w!, b as HTMLButtonElement))
  );
  panel.querySelectorAll("[data-goto]").forEach((b) =>
    b.addEventListener("click", () => {
      const to = (b as HTMLElement).dataset.goto!;
      panTo(to);
      select(to);
    })
  );
  panTo(id);
}

// ——— 검색 ———
const q = document.getElementById("q") as HTMLInputElement;
q.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  const s = q.value.trim().toLowerCase();
  if (!s) return;
  const hit = d.authors.find(
    (a: Author) =>
      a.names.ko.toLowerCase().includes(s) ||
      a.names.original.toLowerCase().includes(s) ||
      a.names.aliases.some((x) => x.toLowerCase().includes(s))
  );
  if (hit) select(hit.id);
});

drawLines();
refreshLabels();
