/* Math 15 · Unit 6 · Lesson 5 — Applications: Distance, Midpoint, and Finding a Missing Endpoint.
 * Warm-up (The Other End of the Zipline: a foggy canyon, the start S and the flag M at the middle), static figures, and
 * the explainers:
 *   tools (one pair of points, two questions: distance subtracts, the midpoint adds and halves),
 *   backward (the midpoint is halfway, so go the same again; worked demo, Example 1 and 2 checks),
 *   solve (one coordinate at a time: undo ÷2 by doubling, undo + by subtracting; a number line agrees),
 *   trap (three tempting answers for the missing end, tested by "is M really the middle?"),
 *   rescue (Example 3: a distance on a map grid, then the map scale and kilometres),
 *   busstop (Example 4: the bus stop halfway between two schools, then how far east/west and north/south),
 *   which (sort real questions into distance / midpoint / midpoint in reverse; Example 5 needs two),
 *   zipline (Example 5: the missing end of the zip-line, then the length of the whole cable in metres).
 * Colours: run / east-west amber, rise / north-south purple, segments blue, midpoints red. Built from the Math 10C
 * u6l1 explainers (walker, legs, hops), reworked for the Math 15 booklet. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  pairTex, texNum, svgEl, liveCtx, pulse, rightMark, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RUN = COLORS.amber, RISE = COLORS.purple, SEG = COLORS.blue, MID = COLORS.red, INK = COLORS.ink, GRN = COLORS.green, ORG = COLORS.orange;
const tn = (v) => texNum(v);
const big = (v) => (Math.abs(v) >= 1000 ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : tn(v)); // 2\,600
const bigH = (v) => (Math.abs(v) >= 1000 ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : String(v)); // plain text 2 600
const par = (v) => (v < 0 ? `(${tn(v)})` : tn(v));                  // a negative in brackets
const P2 = (x, y) => pairTex(x, y);
const ptT = (n, x, y) => `${n}${pairTex(x, y)}`;
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u6l5-panel', title ? `<div class="u6l5-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l5-line ' + cls, html); p.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const hide0 = (el) => { el.style.opacity = 0; return el; };
const dirX = (d) => (d > 0 ? 'right' : 'left'), dirY = (d) => (d > 0 ? 'up' : 'down');
const ew = (d) => (d > 0 ? 'east' : 'west'), ns = (d) => (d > 0 ? 'north' : 'south');
/** "2(9)-4=18-4=14": double the midpoint, subtract the known endpoint */
const dblSub = (m, k) => `2(${tn(m)})-${par(k)}=${tn(2 * m)}${k < 0 ? '+' + tn(-k) : '-' + tn(k)}=${tn(2 * m - k)}`;
/** "\dfrac{4+14}{2}" style average with its value */
const avgT = (a, b) => `\\dfrac{${tn(a)}+${par(b)}}{2}=\\dfrac{${tn(a + b)}}{2}=${tn((a + b) / 2)}`;
const subT = (b, a) => `${tn(b)}-${par(a)}=${tn(b - a)}`;
/** √n tidy: whole number when it is one */
const isSq = (n) => Number.isInteger(Math.sqrt(n));
/** a boxed final answer at the bottom of a panel (stamps upper-case everything, which spoils units like m and km) */
const answerBox = async (c, P, html) => { const r = h('div', 'u6l5-ansbox', `<span class="u6l5-tick">✓</span> ${html}`); P.appendChild(r); await pop(c, r, 450); return r; };

/** a graph with equal x and y scales that fits in maxW × maxH. o: { x, y, center, g (extra Graph options), pad } */
function sqGraph(host, win, maxW, maxH, o = {}) {
  const g = o.g || {}, numbers = g.numbers !== false;
  const pd = o.pad || [18, 18, numbers && win.ymin >= 0 ? 34 : 18, numbers && win.xmin >= 0 ? 42 : 18];
  const xr = win.xmax - win.xmin, yr = win.ymax - win.ymin;
  const u = Math.min((maxW - pd[1] - pd[3]) / xr, (maxH - pd[0] - pd[2]) / yr);
  const W = u * xr + pd[1] + pd[3], H = u * yr + pd[0] + pd[2];
  const opts = Object.assign({ width: W, height: H, pad: pd }, win, g);
  if (o.x != null) { opts.x = o.x + (o.center ? (maxW - W) / 2 : 0); opts.y = (o.y || 0) + (o.center ? (maxH - H) / 2 : 0); }
  const G = new Graph(host, opts); G.W = W; G.H = H; return G;
}
/** a whole-number window around some points (and the origin) */
function winAround(pts, pad = 1, padX = pad) {
  const xs = pts.map((p) => p[0]).concat(0), ys = pts.map((p) => p[1]).concat(0);
  return { xmin: Math.floor(Math.min(...xs)) - padX, xmax: Math.ceil(Math.max(...xs)) + padX, ymin: Math.floor(Math.min(...ys)) - pad, ymax: Math.ceil(Math.max(...ys)) + pad };
}
const step = (win) => ((win.xmax - win.xmin > 14 || win.ymax - win.ymin > 14) ? 2 : 1);

/** the helper corner (x2, y1) and which sides of the triangle are "outside" */
const corner = (A, B) => [B[0], A[1]];
const outside = (A, B) => ({ run: B[1] >= A[1] ? 's' : 'n', rise: B[0] >= A[0] ? 'e' : 'w' });
/** draw the two dashed legs and the right-angle mark; returns { run, rise, rm, C } */
async function drawLegs(G, c, A, B, o = {}) {
  const C = corner(A, B);
  const run = G.segment(A, C, { color: RUN, width: 3.5, dash: true }), rise = G.segment(C, B, { color: RISE, width: 3.5, dash: true });
  const rm = rightMark(G.layers.top, G.toPx(...C), G.toPx(...A), G.toPx(...B), 14, { color: INK, width: 2 });
  rm.style.opacity = 0;
  await G.drawIn(run, o.ms || 600, c); await G.drawIn(rise, o.ms || 600, c);
  await appear(c, rm, 250);
  return { run, rise, rm, C };
}
/** a pill label on a leg (outside the triangle) */
function legLabel(G, A, B, which, html, o = {}) {
  const C = corner(A, B), out = outside(A, B), t = o.t ?? 0.5;
  const [p, q] = which === 'run' ? [A, C] : [C, B], at = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  return G.label(at[0], at[1], html, { pos: o.pos || (which === 'run' ? out.run : out.rise), cls: 'u6l5-legl ' + (which === 'run' ? 'u6l5-lrun' : 'u6l5-lrise'), gap: o.gap ?? 6 });
}
/** a little hiker standing at a graph point */
function walkerFig(G, color = INK) {
  const g = svgEl('g', { class: 'u6l5-walker' }, G.layers.top), b = g.body = svgEl('g', { class: 'u6l5-wbody' }, g);
  svgEl('rect', { x: -10, y: -26, width: 7, height: 12, rx: 2.5, fill: RUN }, b);
  svgEl('path', { d: 'M0 -25 V-11 M0 -11 L-6 0 M0 -11 L6 0 M0 -21 L8 -15', stroke: color, 'stroke-width': 3.6, 'stroke-linecap': 'round', fill: 'none' }, b);
  svgEl('circle', { cx: 0, cy: -32, r: 6.5, fill: color }, b);
  g.at = [0, 0];
  g.place = (x, y) => { g.at = [x, y]; const [px, py] = G.toPx(x, y); g.setAttribute('transform', `translate(${px} ${py})`); };
  return g;
}
/** walk the hiker to a point, leaving an arrow trail */
async function walkTo(G, c, w, to, color, ms = 900) {
  const from = w.at.slice(), trail = G.segment(from, to, { color, width: 5, arrowB: true, cls: 'u6l5-trail' });
  await Promise.all([G.drawIn(trail, ms, c), tween(c, ms, (t) => w.place(from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t))]);
  w.place(...to);
  return trail;
}
/** walk across then up/down from `from` to `to`, with a count pill on each leg; returns the pills and trails */
async function walkLegs(G, c, w, from, to, o = {}) {
  const K = [to[0], from[1]], dx = to[0] - from[0], dy = to[1] - from[1], els = [];
  const wx = o.map ? ew(dx) : dirX(dx), wy = o.map ? ns(dy) : dirY(dy);
  if (dx) {
    els.push(await walkTo(G, c, w, K, RUN, o.ms || 800));
    const l = G.label((from[0] + K[0]) / 2, K[1], `${Math.abs(dx)} ${wx}`, { pos: o.runPos || (dy > 0 ? 'n' : 's'), cls: 'u6l5-legl u6l5-lrun', gap: 8 });
    els.push(l); await pop(c, l);
  }
  if (dy) {
    els.push(await walkTo(G, c, w, to, RISE, o.ms || 800));
    const l = G.label(to[0], (K[1] + to[1]) / 2, `${Math.abs(dy)} ${wy}`, { pos: o.risePos || (dx > 0 ? 'e' : 'w'), cls: 'u6l5-legl u6l5-lrise', gap: 10 });
    els.push(l); await pop(c, l);
  }
  return els;
}

/* ---------------- little map pictures (SVG at a graph point) ---------------- */
function house(G, x, y, color = '#d9604f') {
  const [px, py] = G.toPx(x, y), g = svgEl('g', { class: 'u6l5-icon' }, G.layers.top);
  svgEl('rect', { x: px - 12, y: py - 20, width: 24, height: 15, fill: color, stroke: INK, 'stroke-width': 1.6 }, g);
  svgEl('path', { d: `M${px - 16} ${py - 19} L${px} ${py - 33} L${px + 16} ${py - 19} Z`, fill: color, stroke: INK, 'stroke-width': 1.6, 'fill-opacity': 0.75 }, g);
  svgEl('rect', { x: px - 3, y: py - 13, width: 6, height: 8, fill: '#fff', stroke: INK, 'stroke-width': 1 }, g);
  svgEl('circle', { cx: px, cy: py, r: 5, fill: INK, stroke: '#fff', 'stroke-width': 1.6 }, g);
  return g;
}
function radio(G, x, y) {
  const [px, py] = G.toPx(x, y), g = svgEl('g', { class: 'u6l5-icon' }, G.layers.top), top = py - 22;
  svgEl('path', { d: `M${px - 8} ${py + 2} L${px} ${top} L${px + 8} ${py + 2} M${px - 5} ${py - 8} L${px + 5} ${py - 8}`, stroke: INK, 'stroke-width': 2.4, fill: 'none', 'stroke-linejoin': 'round' }, g);
  for (const r of [7, 12]) {
    svgEl('path', { d: `M${px - r * 0.5} ${top - r * 0.85} A${r} ${r} 0 0 0 ${px - r * 0.5} ${top + r * 0.85}`, stroke: MID, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }, g);
    svgEl('path', { d: `M${px + r * 0.5} ${top - r * 0.85} A${r} ${r} 0 0 1 ${px + r * 0.5} ${top + r * 0.85}`, stroke: MID, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }, g);
  }
  svgEl('circle', { cx: px, cy: py, r: 5.5, fill: SEG, stroke: '#fff', 'stroke-width': 2 }, g);
  return g;
}
function school(G, x, y, color) {
  const [px, py] = G.toPx(x, y), g = svgEl('g', { class: 'u6l5-icon' }, G.layers.top);
  svgEl('rect', { x: px - 17, y: py - 22, width: 34, height: 17, fill: color, stroke: INK, 'stroke-width': 1.6 }, g);
  svgEl('path', { d: `M${px - 20} ${py - 21} L${px} ${py - 31} L${px + 20} ${py - 21} Z`, fill: color, stroke: INK, 'stroke-width': 1.6, 'fill-opacity': 0.8 }, g);
  svgEl('path', { d: `M${px} ${py - 31} V${py - 44}`, stroke: INK, 'stroke-width': 1.6 }, g);
  svgEl('path', { d: `M${px} ${py - 44} L${px + 10} ${py - 40.5} L${px} ${py - 37} Z`, fill: MID }, g);
  for (const dx of [-11, 5]) svgEl('rect', { x: px + dx, y: py - 18, width: 6, height: 6, fill: '#fff', stroke: INK, 'stroke-width': 1 }, g);
  svgEl('circle', { cx: px, cy: py, r: 5, fill: INK, stroke: '#fff', 'stroke-width': 1.6 }, g);
  return g;
}
function busSign(G, x, y) {
  const [px, py] = G.toPx(x, y), g = svgEl('g', { class: 'u6l5-icon' }, G.layers.top);
  svgEl('path', { d: `M${px + 14} ${py} V${py - 34}`, stroke: INK, 'stroke-width': 2.4 }, g);
  svgEl('rect', { x: px + 2, y: py - 50, width: 26, height: 17, rx: 3, fill: '#1f5bd6', stroke: INK, 'stroke-width': 1.4 }, g);
  const t = svgEl('text', { x: px + 15, y: py - 37.5, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 800, fill: '#fff', 'font-family': 'system-ui, sans-serif' }, g); t.textContent = 'BUS';
  return g;
}
/** a compass rose (HTML-free SVG) at stage px (cx, cy) */
function compass(host, cx, cy, r = 30) {
  const s = svgEl('svg', { width: r * 2 + 40, height: r * 2 + 40, viewBox: `${-r - 20} ${-r - 20} ${r * 2 + 40} ${r * 2 + 40}`, class: 'u6l5-rose' });
  svgEl('circle', { r: r * 0.95, fill: '#fff', stroke: '#c9cfd8', 'stroke-width': 1.5 }, s);
  svgEl('path', { d: `M0 ${-r} L${r * 0.18} 0 L0 ${r} L${-r * 0.18} 0 Z`, fill: RISE, 'fill-opacity': 0.85 }, s);
  svgEl('path', { d: `M${-r} 0 L0 ${r * 0.18} L${r} 0 L0 ${-r * 0.18} Z`, fill: RUN, 'fill-opacity': 0.85 }, s);
  for (const [t, x, y] of [['N', 0, -r - 7], ['S', 0, r + 17], ['E', r + 11, 6], ['W', -r - 11, 6]]) {
    const e = svgEl('text', { x, y, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: INK, 'font-family': 'system-ui, sans-serif' }, s); e.textContent = t;
  }
  if (host) { s.style.position = 'absolute'; s.style.left = (cx - r - 20) + 'px'; s.style.top = (cy - r - 20) + 'px'; host.appendChild(s); }
  return s;
}
/** soft map background: contour rings around a hill and a river, drawn in the graph's background layer */
function mapBack(G, hill, rx, ry) {
  const bg = G.layers.bg, Pp = (x, y) => G.toPx(x, y).map((v) => v.toFixed(1)).join(' ');
  const [a, b] = G.toPx(G.win.xmin, G.win.ymax), [c2, d] = G.toPx(G.win.xmax, G.win.ymin);
  svgEl('rect', { x: a, y: b, width: c2 - a, height: d - b, fill: '#f3f8ec' }, bg);
  for (const k of [1, 0.68, 0.38]) {
    const pts = []; for (let i = 0; i <= 48; i++) { const t = i / 48 * Math.PI * 2, wob = 1 + 0.08 * Math.sin(3 * t + k * 5); pts.push(G.toPx(hill[0] + rx * k * wob * Math.cos(t), hill[1] + ry * k * wob * Math.sin(t))); }
    svgEl('path', { d: 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L') + ' Z', fill: k < 0.5 ? '#e4d3a8' : 'none', 'fill-opacity': 0.5, stroke: '#c4a76a', 'stroke-width': 1.6 }, bg);
  }
  const w = G.win;
  svgEl('path', { d: `M${Pp(w.xmin, w.ymin + (w.ymax - w.ymin) * 0.12)} C${Pp(w.xmin + (w.xmax - w.xmin) * 0.35, w.ymin + (w.ymax - w.ymin) * 0.3)} ${Pp(w.xmin + (w.xmax - w.xmin) * 0.6, w.ymin - 1)} ${Pp(w.xmax, w.ymin + (w.ymax - w.ymin) * 0.08)}`, stroke: '#9ccbee', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, bg);
}

/* =============================== warm-up: the zipline in the fog =============================== */
function mountZip() {
  const host = document.getElementById('u6l5-zip'); if (!host) return;
  const w = Math.min(500, host.clientWidth || 500);
  const G = sqGraph(host, { xmin: 0, xmax: 11, ymin: 0, ymax: 10 }, w, w * 0.92);
  const bg = G.layers.bg, Pp = (x, y) => G.toPx(x, y).map((v) => v.toFixed(1)).join(' '), poly = (pts) => 'M' + pts.map((p) => Pp(...p)).join(' L') + ' Z';
  const [x0, y0] = G.toPx(0, 10), [x1, y1] = G.toPx(11, 0), u = G.toPx(1, 0)[0] - G.toPx(0, 0)[0];
  svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: '#e8f0fc' }, bg);
  svgEl('path', { d: poly([[0, 0], [11, 0], [11, 0.7], [0, 0.7]]), fill: '#9cc0ea' }, bg);
  svgEl('path', { d: poly([[0, 0.7], [0, 8], [3.1, 8], [3.5, 6.4], [3.2, 5], [4, 3.2], [3.6, 1.8], [4.3, 0.7]]), fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 1.6 }, bg);
  svgEl('path', { d: poly([[11, 0.7], [11, 2], [9.2, 2], [8.8, 1.3], [8.5, 0.7]]), fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 1.6 }, bg);
  // start tower, the cable (in the data layer, so the fog hides its far end), a rider and the flag
  svgEl('path', { d: `M${Pp(2, 8)} L${Pp(2, 9)} M${Pp(1.5, 8)} L${Pp(2, 9)} L${Pp(2.5, 8)}`, stroke: INK, 'stroke-width': 2.4, fill: 'none' }, bg);
  G.segment([2, 9], [10, 3], { color: INK, width: 3 });
  const [rx, ry] = G.toPx(4.6, 7.05), rider = svgEl('g', { class: 'u6l5-rider' }, G.layers.data);
  svgEl('path', { d: `M${rx} ${ry} v${0.55 * u}`, stroke: INK, 'stroke-width': 1.6 }, rider);
  svgEl('circle', { cx: rx, cy: ry + 0.75 * u, r: 0.2 * u, fill: MID }, rider);
  svgEl('path', { d: `M${rx} ${ry + 0.95 * u} v${0.55 * u} M${rx} ${ry + 1.5 * u} l${-0.2 * u} ${0.45 * u} M${rx} ${ry + 1.5 * u} l${0.2 * u} ${0.45 * u} M${rx - 0.2 * u} ${ry + 0.6 * u} L${rx} ${ry + 0.3 * u} L${rx + 0.2 * u} ${ry + 0.6 * u}`, stroke: MID, 'stroke-width': 2.6, 'stroke-linecap': 'round', fill: 'none' }, rider);
  svgEl('path', { d: `M${Pp(6, 6)} L${Pp(6, 4.9)}`, stroke: INK, 'stroke-width': 1.8 }, G.layers.data);
  svgEl('path', { d: poly([[6, 4.9], [6, 5.75], [6.85, 5.32]]), fill: MID }, G.layers.data);
  // the fog bank (top layer, under the points)
  const fog = svgEl('g', { class: 'u6l5-fog' }, G.layers.top), [fx, fy] = G.toPx(7.6, 10);
  svgEl('rect', { x: fx, y: fy, width: x1 - fx, height: y1 - fy, fill: '#f4f5f7' }, fog);
  for (let yy = 0.4; yy < 10; yy += 0.9) { const [cx, cy] = G.toPx(7.6, yy); svgEl('circle', { cx, cy, r: 0.55 * u, fill: '#f4f5f7' }, fog); }
  const [qx, qy] = G.toPx(9.3, 6.2), q = svgEl('text', { x: qx, y: qy + 0.9 * u, 'text-anchor': 'middle', 'font-size': 2.1 * u, 'font-weight': 800, fill: MID, 'font-family': 'system-ui, sans-serif' }, fog); q.textContent = '?';
  const [tx, ty] = G.toPx(9.3, 4.2), ft = svgEl('text', { x: tx, y: ty, 'text-anchor': 'middle', 'font-size': 18, 'font-style': 'italic', fill: '#6b7280', 'font-family': 'system-ui, sans-serif' }, fog); ft.textContent = 'fog';
  G.point(2, 9, { color: MID, label: T('S'), pos: 'w', gap: 10 }); G.point(6, 6, { color: MID, label: T('M'), pos: 'ne' });
  G.label(0.75, 8.5, 'start', { cls: 'u6l5-wlab' });
  const live = { sm: null, ag: null, fog: false }, ctx = liveCtx();
  const legs = async (A, B, rp = 'n') => {
    const C = [B[0], A[1]], r = G.segment(A, C, { color: RUN, width: 4, dash: true, layer: 'top' }), s = G.segment(C, B, { color: RISE, width: 4, dash: true, layer: 'top' });
    const l1 = hide0(G.label((A[0] + C[0]) / 2, C[1], '4 right', { pos: rp, cls: 'u6l5-legl u6l5-lrun', gap: 6 }));
    const l2 = hide0(G.label(C[0], (C[1] + B[1]) / 2, '3 down', { pos: 'e', cls: 'u6l5-legl u6l5-lrise', gap: 6 }));
    await G.drawIn(r, 500, ctx); await appear(ctx, l1); await G.drawIn(s, 450, ctx); await appear(ctx, l2);
    return [r, s, l1, l2];
  };
  document.getElementById('u6l5-wsm').addEventListener('click', async () => {
    if (live.sm) { G.remove(...live.sm); live.sm = null; return; }
    live.sm = []; live.sm.push(...await legs([2, 9], [6, 6]));
  });
  document.getElementById('u6l5-wagain').addEventListener('click', async () => {
    if (live.ag) { G.remove(...live.ag); live.ag = null; return; }
    live.ag = []; live.ag.push(...await legs([6, 6], [10, 3], 's'));
    const e = G.point(10, 3, { color: GRN, r: 8, label: T('E(10,\\ 3)'), pos: 'w', gap: 10 }); live.ag.push(e, e.label);
    await G.reveal(e, ctx);
  });
  document.getElementById('u6l5-wfog').addEventListener('click', async () => {
    live.fog = !live.fog;
    await ctx.anim(fog, [{ opacity: live.fog ? 1 : 0 }, { opacity: live.fog ? 0 : 1 }], 600);
    fog.style.opacity = live.fog ? 0 : 1;
  });
  // Q1: the rope on a number line
  const rope = document.getElementById('u6l5-rope');
  if (rope) {
    const N = new NumberLine(rope, { width: 400, height: 66, axisY: 40, min: 0, max: 10 });
    N.interval(2, 5, { color: '#c88c14' }); N.point(2, { color: INK }); N.point(5, { color: MID }); N.mark(5, '<b>middle</b>', { pos: 'n' }); N.mark(7.3, '<b class="u6l5-q">?</b>', { pos: 'n' });
  }
}

/* =============================== static figures =============================== */
function schematic(id, A, M, nA, B, o = {}) {
  const host = document.getElementById(id); if (!host) return;
  const pts = [A, M, B], win = { xmin: Math.min(...pts.map((p) => p[0])) - 2.5, xmax: Math.max(...pts.map((p) => p[0])) + 2.5, ymin: Math.min(...pts.map((p) => p[1])) - 1.5, ymax: Math.max(...pts.map((p) => p[1])) + 2 };
  const G = sqGraph(host, win, o.w || 300, o.h || 220, { g: { grid: false, axes: false, numbers: false }, pad: [10, 10, 10, 10] });
  G.segment(A, M, { color: INK, width: 4.5 }); G.segment(M, B, { color: INK, width: 4, dash: '9 7' });
  G.point(...A, { color: INK, label: T(`${nA}${P2(...A)}`), pos: 's', gap: 8 });
  G.point(...M, { color: MID, label: T(`M${P2(...M)}`), pos: 'se', gap: 6 });
  G.label(...B, T(`${o.nB}=\\ ?`), { pos: 'n', cls: 'bk-ptlab', gap: 6 });
}
function mountStatics() {
  schematic('u6l5-demofig', [2, 5], [6, 9], 'P', [10, 13], { nB: 'Q', w: 260, h: 240 });
  schematic('u6l5-ex5fig', [2, 3], [10, 9], 'A', [18, 15], { nB: 'B', w: 320, h: 250 });
  const cp = document.getElementById('u6l5-compass'); if (cp) cp.appendChild(compass(null, 0, 0, 34));
}

/* ======================================================================================
 * Explainer: two questions, two tools (distance subtracts, midpoint adds and halves)
 * ====================================================================================== */
const TOOLS = {
  demo: { label: `Demo: ${T('P(1,\\ 2)')} and ${T('Q(7,\\ 10)')}`, A: [1, 2], B: [7, 10] },
  neg: { label: `With negatives: ${T('P(-3,\\ -1)')} and ${T('Q(5,\\ 5)')}`, A: [-3, -1], B: [5, 5] }
};
const tools = {
  title: 'How far? or Where is halfway? Two questions, two tools',
  height: 470,
  minW: 900,
  choices: Object.keys(TOOLS).map((k) => ({ v: k, label: TOOLS[k].label })),
  intro: 'The same two points can answer two different questions. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TOOLS[k], A = d.A, B = d.B, M = mid(A, B), H = ex.def.height;
    const run = B[0] - A[0], rise = B[1] - A[1], n = run * run + rise * rise, dist = Math.sqrt(n);
    const G = sqGraph(stage, winAround([A, B], 2), 470, H - 20, { x: 10, y: 10, center: true });
    const PW = ex.W - G.W - 44, P = panel(stage, G.W + 30, 10, PW, H - 20, '');
    const b1 = h('div', 'u6l5-tbox u6l5-tdist', '<div class="u6l5-th">How far? <span>distance: subtract</span></div>'), b2 = h('div', 'u6l5-tbox u6l5-tmid', '<div class="u6l5-th">Where is halfway? <span>midpoint: add and halve</span></div>');
    P.append(b1, b2); hide0(b1); hide0(b2);
    const nA = ptT('P', ...A), nB = ptT('Q', ...B);
    const dT = `d=\\sqrt{${par(run)}^2+${par(rise)}^2}=\\sqrt{${run * run}+${rise * rise}}=\\sqrt{${n}}=${tn(dist)}`;
    return [
      { cap: `Two points, ${T(nA)} and ${T(nB)}. Two different questions: <b>how far apart</b> are they, and <b>where is halfway</b>?`,
        run: async (c) => {
          await G.drawIn(G.segment(A, B, { color: SEG, width: 5 }), 700, c);
          await G.reveal(G.point(...A, { color: SEG, label: T(nA), pos: 's' }), c); await G.reveal(G.point(...B, { color: SEG, label: T(nB), pos: 'n' }), c);
        } },
      { cap: `<b>How far?</b> <b>Subtract</b>. Run: ${T('x_2-x_1=' + subT(B[0], A[0]))}. Rise: ${T('y_2-y_1=' + subT(B[1], A[1]))}.`,
        run: async (c) => {
          await show(c, b1);
          await drawLegs(G, c, A, B);
          await pop(c, legLabel(G, A, B, 'run', T(tn(Math.abs(run))))); await pop(c, legLabel(G, A, B, 'rise', T(tn(Math.abs(rise)))));
          await show(c, line(b1, `<span class="u6l5-trun">${T('\\text{run}=' + subT(B[0], A[0]))}</span>&ensp;<span class="u6l5-trise">${T('\\text{rise}=' + subT(B[1], A[1]))}</span>`));
        } },
      { cap: `Square, add, square root: ${T(dT)} units.`,
        run: async (c) => {
          await show(c, line(b1, T(dT)));
          const at = [A[0] + run * 0.3, A[1] + rise * 0.3];
          await pop(c, G.label(...at, T('d=' + tn(dist)), { pos: run * rise > 0 ? 'nw' : 'ne', cls: 'u6l5-legl u6l5-lhyp', gap: 4 }));
        } },
      { cap: `<b>Where is halfway?</b> <b>Add and halve</b>. ${T('x:\\ ' + avgT(A[0], B[0]))}. ${T('y:\\ ' + avgT(A[1], B[1]))}.`,
        run: async (c) => {
          await show(c, b2);
          await G.drawIn(G.guides(...M, { color: MID }), 600, c);
          await G.reveal(G.point(...M, { color: MID, r: 9, label: T('M' + P2(...M)), pos: run * rise > 0 ? 'se' : 'ne', labelColor: MID }), c);
          await show(c, line(b2, `${T('x_M=' + avgT(A[0], B[0]))}`));
          await show(c, line(b2, `${T('y_M=' + avgT(A[1], B[1]))}`));
        } },
      { cap: `Same two points, two tools. Distance <b>subtracts</b>: how far apart. Midpoint <b>adds and halves</b>: the average, where the middle is.`,
        run: async (c) => { const r = h('div', 'u6l5-rule', `<b>How far?</b> subtract → ${T('d=' + tn(dist))} units<br><b>Where is halfway?</b> add, halve → ${T('M' + P2(...M))}`); P.appendChild(r); await pop(c, r); } }
    ];
  }
};

/* ======================================================================================
 * Explainer: the midpoint is halfway, so go the same again
 * ====================================================================================== */
const BK = {
  demo: { label: 'Worked demo', K: ['P', 2, 5], M: [6, 9], nB: 'Q' },
  ex1: { label: 'Example 1 check', K: ['A', 4, 1], M: [9, 6], nB: 'B' },
  ex2a: { label: 'Example 2(a) check', K: ['E', -6, 3], M: [-1, 7], nB: 'F' },
  ex2b: { label: 'Example 2(b) check', K: ['G', 5, -8], M: [2, -3], nB: 'H' }
};
const backward = {
  title: 'The midpoint is halfway, so go the same again',
  height: 480,
  minW: 900,
  choices: Object.keys(BK).map((k) => ({ v: k, label: BK[k].label })),
  intro: 'One endpoint and the midpoint are known. Where is the other end? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = BK[k], [nK, kx, ky] = d.K, K = [kx, ky], M = d.M, B = [2 * M[0] - kx, 2 * M[1] - ky], H = ex.def.height, nB = d.nB;
    const dx = M[0] - kx, dy = M[1] - ky, win = winAround([K, M, B], 2, 3);
    const G = sqGraph(stage, win, 500, H - 20, { x: 10, y: 10, center: true, g: { xlabels: step(win), ylabels: step(win) } });
    const P = panel(stage, G.W + 30, 10, ex.W - G.W - 44, H - 20, 'Go the same again');
    const kT = ptT(nK, kx, ky), mT = ptT('M', ...M), bT = ptT(nB, ...B), mv = `${Math.abs(dx)} ${dirX(dx)} and ${Math.abs(dy)} ${dirY(dy)}`;
    const chk = `\\left(\\dfrac{${tn(kx)}+${par(B[0])}}{2},\\ \\dfrac{${tn(ky)}+${par(B[1])}}{2}\\right)=\\left(\\dfrac{${tn(kx + B[0])}}{2},\\ \\dfrac{${tn(ky + B[1])}}{2}\\right)=${P2(...M)}`;
    const lp = (p, q) => (q[1] > p[1] ? 's' : 'n');
    let w;
    return [
      { cap: `We know one endpoint, ${T(kT)}, and the midpoint, ${T(mT)}. Where is the other end, ${T(nB)}?`,
        run: async (c) => {
          await G.reveal(G.point(...K, { color: SEG, label: T(kT), pos: lp(K, M) }), c);
          await G.reveal(G.point(...M, { color: MID, r: 9, label: T(mT), pos: dx * dy > 0 ? 'nw' : 'ne', labelColor: MID }), c);
        } },
      { cap: `Walk from ${T(nK)} to ${T('M')}: <b>${Math.abs(dx)} ${dirX(dx)}</b> and <b>${Math.abs(dy)} ${dirY(dy)}</b>.`,
        run: async (c) => {
          w = walkerFig(G); w.place(...K); await pop(c, w.body);
          await walkLegs(G, c, w, K, M);
          await show(c, line(P, `${T(nK)} to ${T('M')}: <b class="u6l5-crun">${Math.abs(dx)} ${dirX(dx)}</b>, <b class="u6l5-crise">${Math.abs(dy)} ${dirY(dy)}</b>`));
        } },
      { cap: `${T('M')} is <b>halfway</b>, so <b>go the same again</b>: ${mv}. We land on ${T(bT)}.`,
        run: async (c) => {
          await walkLegs(G, c, w, M, B); G.remove(w);
          await G.reveal(G.point(...B, { color: GRN, r: 8, label: T(bT), pos: lp(B, M) === 's' ? 'n' : 's', labelColor: GRN }), c);
          await G.drawIn(G.segment(K, B, { color: SEG, width: 4 }), 600, c);
          await show(c, line(P, `${T('M')} to ${T(nB)}: the same again → ${T(bT)}`));
        } },
      { cap: `The shortcut gives the same point: <b>double the midpoint, subtract the known endpoint</b>.`,
        run: async (c) => {
          await show(c, line(P, `<b>Shortcut:</b> double the midpoint, subtract the known endpoint`, 'u6l5-note'));
          await show(c, line(P, T(`x_${nB}=${dblSub(M[0], kx)}`), 'u6l5-trun'));
          await show(c, line(P, T(`y_${nB}=${dblSub(M[1], ky)}`), 'u6l5-trise'));
        } },
      { cap: `Check: the midpoint of ${T(nK)} and ${T(bT)} must be ${T('M')}. ${T(chk)} ✓`,
        run: async (c) => {
          await show(c, line(P, T(chk + '\\ \\checkmark'), 'u6l5-sm'));
          const s = stamp(P, `${nB}(${B[0]}, ${B[1]})`.replace(/-/g, '−'), { ok: true, size: 'sm' }); s.style.alignSelf = 'center'; s.style.marginTop = 'auto'; await stampIn(c, s);
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: one coordinate at a time — undo the ÷ 2, undo the +
 * ====================================================================================== */
const SV = {
  demoX: { label: `Worked demo: ${T('x')}`, a: 2, m: 6, v: 'x' },
  demoY: { label: `Worked demo: ${T('y')}`, a: 5, m: 9, v: 'y' },
  ex2a: { label: `Example 2(a): ${T('x')}`, a: -6, m: -1, v: 'x' },
  ex2b: { label: `Example 2(b): ${T('x')}`, a: 5, m: 2, v: 'x' }
};
const solve = {
  title: 'Run the midpoint formula backward: double, then subtract',
  height: 470,
  minW: 900,
  choices: Object.keys(SV).map((k) => ({ v: k, label: SV[k].label })),
  intro: 'One coordinate at a time. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SV[k], a = d.a, m = d.m, x = 2 * m - a, v = d.v, V = `${v}_2`, dd = m - a, H = ex.def.height;
    const lo = Math.min(a, m, x) - 2, hi = Math.max(a, m, x) + 2;
    const NL = new NumberLine(stage, { x: 30, y: 4, width: ex.W - 60, height: 140, axisY: 108, min: lo, max: hi });
    const E = add(stage, box(h('div', 'u6l5-eqs'), ex.W - 240, H - 162), 120, 150);
    const row = (tx, note, cls = '') => { const r = h('div', 'u6l5-eqrow ' + cls, `<div class="u6l5-eq">${T(tx)}</div><div class="u6l5-eqn">${note || ''}</div>`); E.appendChild(r); return r; };
    const aT = tn(a), sub = a < 0 ? `subtract ${T(aT)}, which is the same as <b>adding ${T(tn(-a))}</b>` : `<b>subtract ${T(aT)}</b> from both sides`;
    return [
      { cap: `One coordinate at a time. The known end is at <b>${T(aT)}</b> and the middle is at <b>${T(tn(m))}</b>. Where is the other end, ${T(V)}?`,
        run: async (c) => {
          await appear(c, NL.el);
          await pop(c, NL.point(a, { color: SEG })); await pop(c, NL.mark(a, 'known end', { pos: 'n' }));
          await pop(c, NL.point(m, { color: MID, r: 9 })); await pop(c, NL.mark(m, 'middle', { pos: 'n' }));
        } },
      { cap: `Put what we know into the midpoint formula: ${T(`\\dfrac{${aT}+${V}}{2}=${tn(m)}`)}.`,
        run: async (c) => { await show(c, row(`\\dfrac{${aT}+${V}}{2}=${tn(m)}`, 'the midpoint formula')); } },
      { cap: `Undo the ${T('\\div 2')}: <b>multiply both sides by 2</b>. ${T(`2\\times${par(m)}=${tn(2 * m)}`)}: that's “<b>double the midpoint</b>”.`,
        run: async (c) => { await show(c, row(`${aT}+${V}=${tn(2 * m)}`, `<b>× 2</b> both sides: double the midpoint`, 'u6l5-erun')); } },
      { cap: `Undo the ${T('+' + par(a))}: ${sub}. That's “<b>subtract the known endpoint</b>”: ${T(`${V}=${tn(x)}`)}.`,
        run: async (c) => { const r = row(`${V}=${tn(2 * m)}-${par(a)}=${tn(x)}`, `<b>− ${a < 0 ? '(' + aT.replace('-', '−') + ')' : aT}</b> both sides: subtract the known end`, 'u6l5-erise'); await show(c, r); await pulse(c, r.firstChild, 1.08); } },
      { cap: `The number line agrees: from ${T(aT)} to ${T(tn(m))} is ${Math.abs(dd)} ${dd > 0 ? 'to the right' : 'to the left'}. Go ${Math.abs(dd)} more and you land on ${T(tn(x))}.`,
        run: async (c) => {
          const lab = T((dd > 0 ? '+' : '') + tn(dd));
          await NL.hop(c, a, m, { label: lab, color: RUN, height: 58 }); await NL.hop(c, m, x, { label: lab, color: RUN, height: 58 });
          await pop(c, NL.point(x, { color: GRN, r: 9 })); await pop(c, NL.mark(x, `<b>${tn(x).replace('-', '−')}</b>`, { pos: 's' }));
        } },
      { cap: `Check: ${T(`\\dfrac{${aT}+${par(x)}}{2}=\\dfrac{${tn(a + x)}}{2}=${tn(m)}`)} ✓ The middle is right where it should be.`,
        run: async (c) => {
          await show(c, row(`\\dfrac{${aT}+${par(x)}}{2}=\\dfrac{${tn(a + x)}}{2}=${tn(m)}\\ \\checkmark`, 'check', 'u6l5-echk'));
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: three tempting answers
 * ====================================================================================== */
const TR = {
  ex1: { label: 'Example 1 numbers', K: ['A', 4, 1], M: [9, 6], nB: 'B' },
  warm: { label: 'Warm-up numbers', K: ['S', 2, 9], M: [6, 6], nB: 'E' }
};
const trap = {
  title: 'Three tempting answers, one right one',
  height: 480,
  minW: 920,
  choices: Object.keys(TR).map((k) => ({ v: k, label: TR[k].label })),
  intro: 'Three students found three different answers. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TR[k], [nK, kx, ky] = d.K, K = [kx, ky], M = d.M, H = ex.def.height;
    const tries = [
      { p: mid(K, M), how: `averaged ${nK} and M`, t: `\\left(${avgT(kx, M[0]).split('=').pop()},\\ ${avgT(ky, M[1]).split('=').pop()}\\right)`, col: ORG },
      { p: [kx + M[0], ky + M[1]], how: `added ${nK} and M`, t: '', col: RISE },
      { p: [2 * M[0] - kx, 2 * M[1] - ky], how: 'doubled M, subtracted ' + nK, t: '', col: GRN }
    ];
    const avgL = `\\left(\\dfrac{${tn(kx)}+${tn(M[0])}}{2},\\ \\dfrac{${tn(ky)}+${tn(M[1])}}{2}\\right)=${P2(...tries[0].p)}`;
    const addL = `(${tn(kx)}+${tn(M[0])},\\ ${tn(ky)}+${tn(M[1])})=${P2(...tries[1].p)}`;
    const rgtL = `(${dblSub(M[0], kx).split('=')[0]},\\ ${dblSub(M[1], ky).split('=')[0]})=${P2(...tries[2].p)}`;
    const win = winAround([K, M, ...tries.map((t) => t.p)], 2);
    const G = sqGraph(stage, win, 440, H - 20, { x: 10, y: 10, center: true, g: { xlabels: step(win), ylabels: step(win) } });
    const PW = ex.W - G.W - 44, P = panel(stage, G.W + 30, 10, PW, H - 20, `Is ${T('M' + P2(...M))} the middle?`);
    const rows = tries.map((t, i) => { const r = h('div', 'u6l5-try', `<div class="u6l5-tryh" style="color:${t.col}">Try ${i + 1}</div><div class="u6l5-tryb"></div><div class="u6l5-tryc"></div>`); P.appendChild(r); hide0(r); return r; });
    const mids = tries.map((t) => mid(K, t.p)), midT = (i) => `\\text{mid of }${nK}\\text{ and Try ${i + 1}}=${P2(...mids[i])}`;
    const plotTry = async (c, i, html, pos) => {
      const t = tries[i], r = rows[i];
      r.querySelector('.u6l5-tryb').innerHTML = html; await show(c, r);
      await G.reveal(G.point(...t.p, { color: t.col, r: 8, label: `<b>Try ${i + 1}</b>`, pos, labelColor: t.col, gap: 8 }), c);
    };
    const kT = ptT(nK, kx, ky), mT = ptT('M', ...M);
    let stamps = [];
    return [
      { cap: `Known end ${T(kT)}, midpoint ${T(mT)}. Three students tried to find the other end, ${T(d.nB)}.`,
        run: async (c) => {
          await G.drawIn(G.line(K, M, { color: '#9aa0ab', width: 2, dash: '6 6', arrows: false }), 600, c);
          await G.reveal(G.point(...K, { color: SEG, label: T(kT), pos: 'w', gap: 10 }), c);
          await G.reveal(G.point(...M, { color: MID, r: 9, label: T(mT), pos: (M[1] - ky) * (M[0] - kx) > 0 ? 'nw' : 'sw', labelColor: MID }), c);
        } },
      { cap: `Try 1 <b>averaged</b> ${T(nK)} and ${T('M')}: ${T(avgL)}. It lands <b>between</b> ${T(nK)} and ${T('M')}, on the wrong side of the middle!`,
        run: (c) => plotTry(c, 0, T(avgL), 'se') },
      { cap: `Try 2 <b>added</b> ${T(nK)} and ${T('M')} and never subtracted: ${T(addL)}. That point isn't even on the line through ${T(nK)} and ${T('M')}.`,
        run: (c) => plotTry(c, 1, T(addL), 'e') },
      { cap: `Try 3: <b>double the midpoint, subtract the known endpoint</b>: ${T(rgtL)}. On the line, past ${T('M')}.`,
        run: (c) => plotTry(c, 2, T(rgtL), 'e') },
      { cap: `The test: is ${T('M' + P2(...M))} the midpoint of ${T(nK)} and the try? Only <b>Try 3</b> passes.`,
        run: async (c) => {
          for (let i = 0; i < 3; i++) {
            const ok = i === 2, cc = rows[i].querySelector('.u6l5-tryc');
            cc.innerHTML = T(midT(i) + (ok ? '\\ \\checkmark' : '\\ne' + P2(...M))); cc.classList.add(ok ? 'u6l5-ok' : 'u6l5-bad');
            await show(c, cc);
            const s = stamp(rows[i], ok ? '✓' : '✗', { ok, size: 'sm' }); s.classList.add('u6l5-trys'); stamps.push(s); await stampIn(c, s);
          }
          await G.drawIn(G.segment(K, tries[2].p, { color: GRN, width: 4 }), 600, c);
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: a distance on a map, then the map scale (Example 3)
 * ====================================================================================== */
const RS = {
  ex3: { label: 'Example 3 check', A: [3, 4], B: [8, 16], nA: 'Ranger station', nB: 'Hiker’s signal', s: 200, win: { xmin: 0, xmax: 16, ymin: 0, ymax: 18 }, hill: [9, 9, 4, 4.5] },
  demo: { label: 'Demo: campsite to lookout', A: [1, 2], B: [7, 10], nA: 'Campsite', nB: 'Lookout', s: 500, win: { xmin: 0, xmax: 12, ymin: 0, ymax: 12 }, hill: [7, 6.5, 3.4, 3.2] }
};
const rescue = {
  title: 'Distance on a map: grid units first, then the scale',
  height: 480,
  minW: 920,
  choices: Object.keys(RS).map((k) => ({ v: k, label: RS[k].label })),
  intro: 'A coordinate grid laid over a map. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RS[k], A = d.A, B = d.B, H = ex.def.height, run = B[0] - A[0], rise = B[1] - A[1], n = run * run + rise * rise, u = Math.sqrt(n), m = u * d.s;
    const G = sqGraph(stage, d.win, 470, H - 20, { x: 10, y: 10, center: true, g: { xlabels: 2, ylabels: 2 } });
    mapBack(G, d.hill.slice(0, 2), d.hill[2], d.hill[3]);
    const PW = ex.W - G.W - 44, P = panel(stage, G.W + 30, 10, PW, H - 20, `1 grid unit = ${d.s} m`);
    const dT = [`d=\\sqrt{(${tn(B[0])}-${par(A[0])})^2+(${tn(B[1])}-${par(A[1])})^2}`, `=\\sqrt{${run}^2+${rise}^2}=\\sqrt{${run * run}+${rise * rise}}`, `=\\sqrt{${n}}=${tn(u)}\\text{ grid units}`];
    let bar;
    return [
      { cap: `${d.nA} at ${T(P2(...A))}, ${d.nB.toLowerCase()} at ${T(P2(...B))}. Each grid unit is <b>${d.s} m</b>. How far apart?`,
        run: async (c) => {
          const i1 = house(G, ...A), i2 = radio(G, ...B); await appear(c, i1); await appear(c, i2);
          await appear(c, G.label(...A, `${d.nA} ${T(P2(...A))}`, { pos: 'se', cls: 'bk-ptlab u6l5-mapn', gap: 8 }));
          await appear(c, G.label(...B, `${d.nB} ${T(P2(...B))}`, { pos: 'e', cls: 'bk-ptlab u6l5-mapn', gap: 16 }));
          await G.drawIn(G.segment(A, B, { color: SEG, width: 4.5 }), 700, c);
        } },
      { cap: `The hidden right triangle. <b>Run:</b> ${T(subT(B[0], A[0]))}. <b>Rise:</b> ${T(subT(B[1], A[1]))}.`,
        run: async (c) => {
          await drawLegs(G, c, A, B);
          await pop(c, legLabel(G, A, B, 'run', T(tn(Math.abs(run))), { pos: rise > 0 ? 'n' : 's' })); await pop(c, legLabel(G, A, B, 'rise', T(tn(Math.abs(rise)))));
        } },
      { cap: `Square, add, square root: ${T(`d=\\sqrt{${run}^2+${rise}^2}=\\sqrt{${n}}=${tn(u)}`)} <b>grid units</b>.`,
        run: async (c) => { for (const s of dT) await show(c, line(P, T(s))); } },
      { cap: `Now the map scale. Each unit is ${d.s} m, so ${T(`${tn(u)}\\times${d.s}=${big(m)}`)} m.`,
        run: async (c) => {
          bar = h('div', 'u6l5-bar'); P.appendChild(bar);
          const bw = Math.min(46, (PW - 40) / u);
          const cells = [];
          for (let i = 0; i < u; i++) { const e = h('div', 'u6l5-cell', ''); e.style.width = bw + 'px'; bar.appendChild(e); cells.push(e); hide0(e); }
          const tot = h('div', 'u6l5-tot', ''); P.appendChild(tot);
          for (let i = 0; i < u; i++) { cells[i].style.opacity = 1; tot.innerHTML = `${i + 1} × ${d.s} m = <b>${bigH((i + 1) * d.s)} m</b>`; await pop(c, cells[i], 200); await sleep(c, 40); }
          await show(c, line(P, T(`${tn(u)}\\text{ units}\\times${d.s}\\text{ m per unit}=${big(m)}\\text{ m}`), 'u6l5-big'));
        } },
      { cap: `1\u202f000 m is 1 km, so divide by 1\u202f000: ${T(`${big(m)}\\div1\\,000=${tn(m / 1000)}`)} <b>km</b>.`,
        run: async (c) => {
          await show(c, line(P, T(`${big(m)}\\div1\\,000=${tn(m / 1000)}\\text{ km}`), 'u6l5-big'));
          await answerBox(c, P, `${d.nB} is <b>${String(m / 1000)} km</b> from the ${d.nA.toLowerCase()}`);
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: the bus stop halfway between two schools (Example 4)
 * ====================================================================================== */
const BS = {
  ex4: { label: 'Example 4 check', A: [-6, 10], B: [18, -4], nA: 'Meridian', nB: 'Sunview', s: 100, win: { xmin: -10, xmax: 20, ymin: -6, ymax: 12 }, xl: 4, yl: 2, what: 'bus stop', rose: 'tr' },
  demo: { label: 'Demo: two friends meet halfway', A: [-4, -2], B: [8, 6], nA: 'Kai', nB: 'Lee', s: 50, win: { xmin: -6, xmax: 10, ymin: -4, ymax: 8 }, xl: 2, yl: 2, what: 'meeting spot', rose: 'tl' }
};
const busstop = {
  title: 'Halfway between two places, and which way to walk',
  height: 480,
  minW: 920,
  choices: Object.keys(BS).map((k) => ({ v: k, label: BS[k].label })),
  intro: 'Two places on a town map. Where is halfway, and how do you get there? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = BS[k], A = d.A, B = d.B, M = mid(A, B), H = ex.def.height, dx = M[0] - A[0], dy = M[1] - A[1];
    const G = sqGraph(stage, d.win, 520, H - 20, { x: 10, y: 10, center: true, g: { xlabels: d.xl, ylabels: d.yl } });
    const PW = ex.W - G.W - 44, P = panel(stage, G.W + 30, 10, PW, H - 20, `The ${d.what}`);
    const [gx, gy] = G.toPx(d.rose[1] === 'l' ? d.win.xmin : d.win.xmax, d.rose[0] === 'b' ? d.win.ymin : d.win.ymax);
    compass(stage, parseFloat(G.el.style.left) + gx + (d.rose[1] === 'l' ? 42 : -42), parseFloat(G.el.style.top) + gy + (d.rose[0] === 'b' ? -42 : 42), 26);
    const isSch = k === 'ex4', icon = (p, cl) => (isSch ? school(G, ...p, cl) : house(G, ...p, cl));
    let w, vl, hl;
    return [
      { cap: `${d.nA} at ${T(P2(...A))} and ${d.nB} at ${T(P2(...B))}. The ${d.what} must be <b>exactly halfway</b>.`,
        run: async (c) => {
          await appear(c, icon(A, '#e8a01e')); await appear(c, G.label(...A, `<b>${d.nA}</b>`, { pos: 's', cls: 'bk-ptlab', gap: 8 }));
          await appear(c, icon(B, '#3d8fd6')); await appear(c, G.label(...B, `<b>${d.nB}</b>`, { pos: 'w', cls: 'bk-ptlab', gap: 22 }));
          await G.drawIn(G.segment(A, B, { color: SEG, width: 3, dash: '8 6' }), 700, c);
        } },
      { cap: `Average the ${T('x')}’s: ${T(avgT(A[0], B[0]))}.`,
        run: async (c) => { vl = G.vline(M[0], { color: RUN, width: 2.5 }); await G.drawIn(vl, 500, c); await show(c, line(P, T('x=' + avgT(A[0], B[0])), 'u6l5-trun')); } },
      { cap: `Average the ${T('y')}’s: ${T(avgT(A[1], B[1]))}. The ${d.what} is at ${T(P2(...M))}.`,
        run: async (c) => {
          hl = G.hline(M[1], { color: RISE, width: 2.5 }); await G.drawIn(hl, 500, c); await show(c, line(P, T('y=' + avgT(A[1], B[1])), 'u6l5-trise'));
          if (isSch) await appear(c, busSign(G, ...M));
          await G.reveal(G.point(...M, { color: MID, r: 9, label: T(P2(...M)), pos: 'sw', labelColor: MID, gap: 6 }), c);
          await show(c, line(P, `${d.what[0].toUpperCase() + d.what.slice(1)}: ${T(P2(...M))}`, 'u6l5-big'));
        } },
      { cap: `From ${d.nA} to the ${d.what}: ${T(`\\Delta x=${subT(M[0], A[0])}`)}. ${dx > 0 ? 'Positive' : 'Negative'}, so <b>${ew(dx)}</b>: ${Math.abs(dx)} units.`,
        run: async (c) => {
          G.remove(vl, hl);
          w = walkerFig(G); w.place(...A); await pop(c, w.body);
          await walkTo(G, c, w, [M[0], A[1]], RUN, 1000);
          await pop(c, G.label((A[0] + M[0]) / 2, A[1], `${Math.abs(dx)} ${ew(dx)}`, { pos: 's', cls: 'u6l5-legl u6l5-lrun', gap: 8 }));
          await show(c, line(P, `${T(`\\Delta x=${subT(M[0], A[0])}`)} → <b class="u6l5-crun">${Math.abs(dx)} units ${ew(dx)}</b>`));
        } },
      { cap: `${T(`\\Delta y=${subT(M[1], A[1])}`)}. ${dy > 0 ? 'Positive' : 'Negative'}, so <b>${ns(dy)}</b>: ${Math.abs(dy)} units.`,
        run: async (c) => {
          await walkTo(G, c, w, M, RISE, 900);
          await pop(c, G.label(M[0], (A[1] + M[1]) / 2, `${Math.abs(dy)} ${ns(dy)}`, { pos: dx > 0 ? 'e' : 'w', cls: 'u6l5-legl u6l5-lrise', gap: 10 }));
          await show(c, line(P, `${T(`\\Delta y=${subT(M[1], A[1])}`)} → <b class="u6l5-crise">${Math.abs(dy)} units ${ns(dy)}</b>`));
        } },
      { cap: `Each unit is ${d.s} m: ${T(`${Math.abs(dx)}\\times${d.s}=${big(Math.abs(dx) * d.s)}`)} m ${ew(dx)} and ${T(`${Math.abs(dy)}\\times${d.s}=${big(Math.abs(dy) * d.s)}`)} m ${ns(dy)}.`,
        run: async (c) => {
          G.remove(w);
          await show(c, line(P, `${T(`${Math.abs(dx)}\\times${d.s}=${big(Math.abs(dx) * d.s)}`)} m <b>${ew(dx)}</b>`, 'u6l5-trun u6l5-big'));
          await show(c, line(P, `${T(`${Math.abs(dy)}\\times${d.s}=${big(Math.abs(dy) * d.s)}`)} m <b>${ns(dy)}</b>`, 'u6l5-trise u6l5-big'));
          await answerBox(c, P, `<b>${bigH(Math.abs(dx) * d.s)} m ${ew(dx)}</b> and <b>${bigH(Math.abs(dy) * d.s)} m ${ns(dy)}</b> of ${d.nA}`);
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: which tool? (sort real questions)
 * ====================================================================================== */
const CARDS = [
  { q: 'How <b class="u6l5-kw">long</b> is the bridge from one bank of the river to the other?', bins: [0], short: ['the bridge'], why: '“How long” asks <b>how far</b>: the <b>distance formula</b>.' },
  { q: 'Where should the lifeguard chair go, <b class="u6l5-kw">halfway</b> between the two flags?', bins: [1], short: ['the lifeguard chair'], why: '“Halfway” asks <b>where the middle is</b>: the <b>midpoint formula</b>.' },
  { q: 'We know the <b class="u6l5-kw">middle</b> of a tunnel and one entrance. Where is the <b class="u6l5-kw">other entrance</b>?', bins: [2], short: ['the other tunnel entrance'], why: 'The middle and one end are known, the <b>other end</b> is missing: the <b>midpoint in reverse</b>.' },
  { q: 'How <b class="u6l5-kw">far</b> does the drone fly from the barn to the field?', bins: [0], short: ['the drone flight'], why: '“How far” again: the <b>distance formula</b>.' },
  { q: 'A zip-line starts at A and its <b class="u6l5-kw">halfway</b> anchor is at M. Where does it <b class="u6l5-kw">end</b>, and how <b class="u6l5-kw">long</b> is it?', bins: [2, 0], short: ['where the zip-line ends', 'how long the zip-line is'], why: '<b>Two questions, two tools</b>: first the <b>midpoint in reverse</b> (the end), then the <b>distance formula</b> (how long). That’s Example 5.' }
];
const BINS = [['How far? How long?', 'distance formula', SEG], ['Where is halfway?', 'midpoint formula', MID], ['Where is the other end?', 'midpoint in reverse', RISE]];
const which = {
  title: 'Which tool? Listen for the key words',
  height: 460,
  minW: 900,
  intro: 'Five questions from real life. Which tool does each one need? Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W, H = ex.def.height, bw = (W - 60) / 3, by = 196, bh = H - by - 8;
    const bins = BINS.map((b, i) => { const e = add(stage, box(h('div', 'u6l5-bin', `<div class="u6l5-binh" style="color:${b[2]}; border-color:${b[2]}"><b>${b[0]}</b><span>${b[1]}</span></div><div class="u6l5-binl"></div>`), bw, bh), 20 + i * (bw + 10), by); e.style.borderColor = b[2]; return e; });
    const cardW = Math.min(720, W - 80), cx = (W - cardW) / 2;
    const steps = [];
    CARDS.forEach((cd, i) => {
      let card;
      steps.push({ cap: `“${cd.q.replace(/<[^>]+>/g, '')}”`,
        run: async (c) => { card = add(stage, box(h('div', 'u6l5-card', `<span class="u6l5-cardn">${i + 1}</span>${cd.q}`), cardW), cx, 26); await pop(c, card); } });
      steps.push({ cap: cd.why,
        run: async (c) => {
          const kws = card.querySelectorAll('.u6l5-kw'); kws.forEach((e) => e.classList.add('on')); await pulse(c, card, 1.04);
          for (let j = 0; j < cd.bins.length; j++) {
            const b = bins[cd.bins[j]], L = b.querySelector('.u6l5-binl');
            const tx = b.offsetLeft + bw / 2 - (cx + cardW / 2), ty = b.offsetTop + 60 + L.children.length * 34 - 60;
            if (j === cd.bins.length - 1) {
              await c.anim(card, [{ transform: 'none', opacity: 1 }, { transform: `translate(${tx}px, ${ty}px) scale(.35)`, opacity: 0 }], 700);
              card.remove();
            } else await sleep(c, 300);
            const it = h('div', 'u6l5-binit', `<b>${i + 1}</b> ${cd.bins.length > 1 ? `<span class="u6l5-ord">${j === 0 ? 'first' : 'then'}</span>` : ''}${cd.short[j]}`);
            L.appendChild(it); await pop(c, it);
          }
        } });
    });
    return steps;
  }
};

/* ======================================================================================
 * Explainer: the zip-line — midpoint in reverse, then the distance formula (Example 5)
 * ====================================================================================== */
const ZP = {
  ex5: { label: 'Example 5 check', K: ['A', 2, 3], M: [10, 9], nB: 'B', s: 40, win: { xmin: 0, xmax: 20, ymin: 0, ymax: 17 } },
  warm: { label: 'Warm-up: the foggy canyon', K: ['S', 2, 9], M: [6, 6], nB: 'E', s: 20, win: { xmin: 0, xmax: 11, ymin: 0, ymax: 10 } }
};
const zipline = {
  title: 'Two tools in a row: find the end, then measure the cable',
  height: 490,
  minW: 920,
  capH: 96,
  choices: Object.keys(ZP).map((k) => ({ v: k, label: ZP[k].label })),
  intro: 'A zip-line with a missing end. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ZP[k], [nA, ax, ay] = d.K, A = [ax, ay], M = d.M, B = [2 * M[0] - ax, 2 * M[1] - ay], H = ex.def.height, nB = d.nB;
    const dx = M[0] - ax, dy = M[1] - ay, run = B[0] - ax, rise = B[1] - ay, n = run * run + rise * rise, L = Math.sqrt(n), hn = dx * dx + dy * dy;
    const G = sqGraph(stage, d.win, 470, H - 20, { x: 10, y: 10, center: true, g: { xlabels: step(d.win), ylabels: step(d.win) } });
    const PW = ex.W - G.W - 44, P = panel(stage, G.W + 30, 10, PW, H - 20, `1 grid unit = ${d.s} m`);
    const aT = ptT(nA, ax, ay), mT = ptT('M', ...M), bT = ptT(nB, ...B), up = (v) => (v > 0 ? 'n' : 's');
    let w, legs = [];
    const platform = (p) => { const [px, py] = G.toPx(...p), g = svgEl('g', { class: 'u6l5-icon' }, G.layers.top); svgEl('path', { d: `M${px - 9} ${py + 14} L${px} ${py} L${px + 9} ${py + 14}`, stroke: INK, 'stroke-width': 2.4, fill: 'none' }, g); return g; };
    return [
      { cap: `The start platform is ${T(aT)}. The halfway anchor is ${T(mT)}. Each grid unit is ${d.s} m.`,
        run: async (c) => {
          await appear(c, platform(A));
          await G.reveal(G.point(...A, { color: SEG, label: T(aT), pos: dy > 0 ? 'nw' : 'sw', gap: 8 }), c);
          await G.drawIn(G.segment(A, M, { color: INK, width: 3.5 }), 600, c);
          await G.reveal(G.point(...M, { color: MID, r: 9, label: T(mT), pos: dy > 0 ? 'nw' : 'sw', labelColor: MID }), c);
        } },
      { cap: `<b>Tool 1: the midpoint in reverse.</b> From ${T(nA)} to ${T('M')}: <b>${Math.abs(dx)} ${dirX(dx)}</b> and <b>${Math.abs(dy)} ${dirY(dy)}</b>.`,
        run: async (c) => { w = walkerFig(G); w.place(...A); await pop(c, w.body); legs = await walkLegs(G, c, w, A, M, { ms: 700 }); } },
      { cap: `Go the same again: ${T(bT)}. Shortcut: ${T(`x_${nB}=${dblSub(M[0], ax)}`)}, ${T(`y_${nB}=${dblSub(M[1], ay)}`)}.`,
        run: async (c) => {
          legs.push(...await walkLegs(G, c, w, M, B, { ms: 700 })); G.remove(w);
          await G.drawIn(G.segment(M, B, { color: INK, width: 3.5 }), 500, c);
          await G.reveal(G.point(...B, { color: GRN, r: 8, label: T(bT), pos: dy > 0 ? 'nw' : 'sw', labelColor: GRN }), c);
          await show(c, line(P, `<b>1.</b> ${T(`x_${nB}=${dblSub(M[0], ax)}`)}`));
          await show(c, line(P, `${T(`y_${nB}=${dblSub(M[1], ay)}`)}&ensp;→ ${T(bT)}`));
        } },
      { cap: `<b>Tool 2: the distance formula</b> on the whole cable. Run: ${T(subT(B[0], ax))}. Rise: ${T(subT(B[1], ay))}.`,
        run: async (c) => {
          G.remove(...legs); legs = [];
          await drawLegs(G, c, A, B);
          await pop(c, legLabel(G, A, B, 'run', T(tn(Math.abs(run))), { pos: up(-rise) })); await pop(c, legLabel(G, A, B, 'rise', T(tn(Math.abs(rise)))));
        } },
      { cap: `${T(`d=\\sqrt{${par(run)}^2+${par(rise)}^2}=\\sqrt{${run * run}+${rise * rise}}=\\sqrt{${n}}=${tn(L)}`)} grid units.`,
        run: async (c) => {
          await show(c, line(P, `<b>2.</b> ${T(`d=\\sqrt{${par(run)}^2+${par(rise)}^2}`)}`));
          await show(c, line(P, T(`=\\sqrt{${run * run}+${rise * rise}}=\\sqrt{${n}}=${tn(L)}`) + ' units'));
        } },
      { cap: `<b>Last, the scale:</b> ${T(`${tn(L)}\\times${d.s}=${big(L * d.s)}`)} m of cable.`,
        run: async (c) => {
          await show(c, line(P, `<b>3.</b> ${T(`${tn(L)}\\times${d.s}=${big(L * d.s)}`)} m`, 'u6l5-big'));
          await answerBox(c, P, `<b>${bigH(L * d.s)} m</b> of cable`);
        } },
      { cap: `Quick check: half the cable is ${T(`\\sqrt{${dx}^2+${par(dy)}^2}=\\sqrt{${hn}}=${tn(Math.sqrt(hn))}`)} units, and the whole is ${T(`2\\times${tn(Math.sqrt(hn))}=${tn(L)}`)} ✓`,
        run: async (c) => { await show(c, line(P, T(`\\text{half: }\\sqrt{${hn}}=${tn(Math.sqrt(hn))},\\ \\ 2\\times${tn(Math.sqrt(hn))}=${tn(L)}\\ \\checkmark`), 'u6l5-note')); } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const pr = (v) => (v < 0 ? '(' + v + ')' : String(v));
  const P = (n, p) => n + '(' + p[0] + ',\\ ' + p[1] + ')';
  const ds = (m, k) => '2(' + m + ')-' + pr(k) + '=' + 2 * m + (k < 0 ? '+' + -k : '-' + k) + '=' + (2 * m - k);
  const th = (v) => (v >= 1000 ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : String(v));
  const NAMES = [['A', 'B'], ['C', 'D'], ['P', 'Q'], ['R', 'S'], ['E', 'F'], ['J', 'K'], ['G', 'H']];
  const TRIPLES = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15]];
  const SMALL = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]];
  const PLACES = [['a cabin', 'a lookout tower'], ['a dock', 'a lighthouse'], ['the school', 'the library'], ['a trailhead', 'a waterfall'], ['the arena', 'the skate park'], ['a farmhouse', 'a grain bin']];
  const SCALES = [10, 20, 25, 50, 100, 200, 250, 500];
  // missing endpoint: K known, M the midpoint; B = 2M − K
  function endpoint(r, neg) {
    for (;;) {
      const K = neg ? [r.int(-9, 9), r.int(-9, 9)] : [r.int(1, 9), r.int(1, 9)];
      const d = neg ? [r.sign() * r.int(1, 7), r.sign() * r.int(1, 7)] : [r.int(1, 6), r.int(1, 6)];
      const M = [K[0] + d[0], K[1] + d[1]], B = [M[0] + d[0], M[1] + d[1]];
      if (neg && ![...K, ...M, ...B].some((v) => v < 0)) continue;
      if (neg && (Math.abs(B[0]) > 16 || Math.abs(B[1]) > 16)) continue;
      const [n1, n2] = r.pick(NAMES);
      return {
        text: `<i>${n1}</i> is one endpoint of segment <i>${n1}${n2}</i>, and the midpoint is <i>M</i>. Find the other endpoint, <i>${n2}</i>.`,
        q: P(n1, K) + '\\qquad ' + P('M', M),
        a: ['x_' + n2 + '=' + ds(M[0], K[0]), 'y_' + n2 + '=' + ds(M[1], K[1]), P(n2, B)]
      };
    }
  }
  // a distance on a map with a scale (whole-number answers from Pythagorean triples)
  function mapDist(r) {
    const t = r.pick(TRIPLES), A = [r.int(-6, 8), r.int(-6, 8)], B = [A[0] + r.sign() * t[0], A[1] + r.sign() * t[1]], s = r.pick(SCALES), pl = r.pick(PLACES);
    const dx = B[0] - A[0], dy = B[1] - A[1];
    return {
      text: `On a map grid, ${pl[0]} is at (${A[0]}, ${A[1]}) and ${pl[1]} is at (${B[0]}, ${B[1]}). Each grid unit is ${s} m. How far apart are they, in metres?`.replace(/-/g, '−'),
      q: '',
      a: ['d=\\sqrt{(' + B[0] + '-' + pr(A[0]) + ')^2+(' + B[1] + '-' + pr(A[1]) + ')^2}=\\sqrt{' + pr(dx) + '^2+' + pr(dy) + '^2}',
        '=\\sqrt{' + dx * dx + '+' + dy * dy + '}=\\sqrt{' + t[2] * t[2] + '}=' + t[2] + '\\text{ units}',
        t[2] + '\\times' + s + '=' + th(t[2] * s) + '\\text{ m}']
    };
  }
  // the zip-line: missing end, then the whole length in metres
  function combined(r) {
    const t = r.pick(SMALL), A = [r.int(-4, 6), r.int(-4, 6)], sx = r.sign(), sy = r.sign(), M = [A[0] + sx * t[0], A[1] + sy * t[1]], B = [2 * M[0] - A[0], 2 * M[1] - A[1]], s = r.pick([10, 20, 25, 40, 50]);
    const run = B[0] - A[0], rise = B[1] - A[1], L = 2 * t[2];
    return {
      text: `A zip-line starts at <i>A</i>, and its halfway anchor is at <i>M</i>. Each grid unit is ${s} m. Find the end, <i>B</i>, and the length of the whole zip-line in metres.`,
      q: P('A', A) + '\\qquad ' + P('M', M),
      a: ['x_B=' + ds(M[0], A[0]) + ',\\quad y_B=' + ds(M[1], A[1]) + '\\ \\Rightarrow\\ ' + P('B', B),
        'd=\\sqrt{' + pr(run) + '^2+' + pr(rise) + '^2}=\\sqrt{' + run * run + '+' + rise * rise + '}=\\sqrt{' + L * L + '}=' + L + '\\text{ units}',
        L + '\\times' + s + '=' + th(L * s) + '\\text{ m}']
    };
  }
  // halfway between two places, then how far east/west and north/south from the first
  function halfway(r) {
    for (;;) {
      const A = [r.int(-10, 10), r.int(-10, 10)], d = [r.sign() * r.int(2, 9), r.sign() * r.int(2, 9)], B = [A[0] + 2 * d[0], A[1] + 2 * d[1]], s = r.pick([10, 50, 100, 200]);
      if (Math.abs(B[0]) > 20 || Math.abs(B[1]) > 20) continue;
      const M = [A[0] + d[0], A[1] + d[1]], pl = r.pick(PLACES);
      return {
        text: `${pl[0][0].toUpperCase() + pl[0].slice(1)} is at (${A[0]}, ${A[1]}) and ${pl[1]} is at (${B[0]}, ${B[1]}). A bench goes exactly halfway between them. Each grid unit is ${s} m. Find the bench, then say how far east or west and north or south it is from ${pl[0].replace(/^a /, 'the ')}.`.replace(/-/g, '−'),
        q: '',
        a: ['M\\left(\\dfrac{' + A[0] + '+' + pr(B[0]) + '}{2},\\ \\dfrac{' + A[1] + '+' + pr(B[1]) + '}{2}\\right)=' + P('', M),
          '\\Delta x=' + M[0] + '-' + pr(A[0]) + '=' + d[0] + ',\\quad \\Delta y=' + M[1] + '-' + pr(A[1]) + '=' + d[1],
          th(Math.abs(d[0]) * s) + '\\text{ m ' + (d[0] > 0 ? 'east' : 'west') + ', }' + th(Math.abs(d[1]) * s) + '\\text{ m ' + (d[1] > 0 ? 'north' : 'south') + '}']
      };
    }
  }
  standup('u6l5', {
    intro: 'At your whiteboard station: pick the tool first. Missing end? Double the midpoint, subtract the known end. Map? Grid units first, then the scale.',
    levels: {
      BEG: (r) => endpoint(r, false),                                  // a missing endpoint, all positive
      PRG: (r) => (r.chance(0.5) ? endpoint(r, true) : mapDist(r)),     // a missing endpoint with negatives, or a map distance in metres
      MAS: (r) => (r.chance(0.5) ? combined(r) : halfway(r))           // both tools in a row, or halfway + directions
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountZip();
mountStatics();
export const explainers = mountExplainers({ tools, backward, solve, trap, rescue, busstop, which, zipline });
export const _test = { TOOLS, BK, SV, TR, RS, BS, ZP, CARDS };
