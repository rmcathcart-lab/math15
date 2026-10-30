/* Math 15 · Unit 6 · Lesson 10 — Unit Review: Coordinate Geometry.
 * The Shape Detective warm-up (a mystery quadrilateral: show the slopes, Case 2 slides C and D up), the Formula Summary
 * minis, the static figures (Examples 6 and 8) and the explainers:
 *   whichTool (★ name a quadrilateral: slope and length of every side, then a flowchart; the warm-up, Case 2, Challenge 2),
 *   pyth (squares on the sides: add for the hypotenuse, subtract for a leg; Example 1), lengths (count or subtract for
 *   horizontal/vertical segments; the hidden right triangle in a diagonal one; Examples 2 and 3), midpoint (half the run,
 *   half the rise; the same step again for a missing end; the trail map; Examples 4 and 5), slopes (Example 6's slope
 *   triangle, Example 7's four types, a steepness dial), collinear (Example 8; a path that bends), pairs (Example 9:
 *   parallel and perpendicular from coordinates), triangle (Challenge 1: a right angle by slopes, lengths, Pythagoras,
 *   the midpoint of the hypotenuse), dialQ (Challenge 3: slide K until JK is parallel to LM, then its length),
 * and the Stand Up Break. Explainers adapted from Math 10C u6l5 and Math 15 u6l9 (same engine).
 * Colours (whole unit): run amber, rise purple, segments blue (a second segment red), midpoints teal-green. */
import {
  h, tex, add, box, Graph, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, rightMark, drawIn, place, COLORS, col
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = COLORS.amber, PUR = COLORS.purple, BLUE = COLORS.blue, RED = COLORS.red, GRN = COLORS.green, INK = COLORS.ink, GRAY = '#8b909b', MID = '#0f8a6a';

/* =============================== helpers =============================== */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** simplified TeX for n/d (integers) */
function frac(n, d) {
  if (d === 0) return '\\text{undefined}';
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g;
  if (d === 1) return String(n);
  return (n < 0 ? '-' : '') + `\\dfrac{${Math.abs(n)}}{${d}}`;
}
/** "\dfrac{n}{d}=reduced", or just the fraction when it is already reduced with a positive bottom */
const frEq = (n, d) => { if (d === 0) return `\\dfrac{${n}}{0}`; const r = frac(n, d), raw = `\\dfrac{${n}}{${d}}`; return r === raw ? r : `${raw}=${r}`; };
const par = (v) => (v < 0 ? `(${v})` : `${v}`);
/** √n simplified, as TeX */
function rad(n) {
  for (let k = Math.floor(Math.sqrt(n)); k > 1; k--) if (n % (k * k) === 0) { const r = n / (k * k); return r === 1 ? String(k) : `${k}\\sqrt{${r}}`; }
  return n === 1 ? '1' : `\\sqrt{${n}}`;
}
/** √n, then its simplified form when that is different */
const lenTex = (n) => (rad(n) === `\\sqrt{${n}}` ? rad(n) : `\\sqrt{${n}}=${rad(n)}`);
/** slope working from P to Q */
function slopeOf(P, Q) {
  const rise = Q[1] - P[1], run = Q[0] - P[0];
  const sub = `\\dfrac{${Q[1]}-${par(P[1])}}{${Q[0]}-${par(P[0])}}`, val = frac(rise, run);
  return { rise, run, sub, val, m: rise / run, all: `${sub}=${frEq(rise, run)}` };
}
const prodTex = (a, b) => `${a}\\times${String(b).startsWith('-') ? `\\left(${b}\\right)` : b}`;
const PTX = (n, p) => `${n}(${p[0]},\\ ${p[1]})`;
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u6l10-panel ' + cls, title ? `<div class="u6l10-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l10-line ' + cls, html); p.appendChild(d); return d; };
const say = async (c, p, html, cls) => { const d = line(p, html, cls); await fadeIn(c, d, 300); return d; };
const hid = (el) => { if (el) el.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; return el; };
/** a Graph whose x and y units are the same size */
function sqG(stage, x, y, win, unit, o = {}) {
  const room = o.numbers !== false || (o.xtitle ?? 'x') !== '', l = room && win.xmin >= 0 ? 42 : 18, b = room && win.ymin >= 0 ? 34 : 18;
  return new Graph(stage, Object.assign({ x, y, width: Math.round((win.xmax - win.xmin) * unit) + l + 18, height: Math.round((win.ymax - win.ymin) * unit) + 18 + b }, win, o));
}
const dOf = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
/** a named point (o.coords: label with its coordinates) */
const npt = (G, n, x, y, pos, o = {}) => { const { coords, ...rest } = o; return G.point(x, y, Object.assign({ color: INK, r: 6.5, label: coords ? T(PTX(n, [x, y])) : T(n), pos }, rest)); };
const rmark = (G, V, P, Q, s = 15, color = INK) => rightMark(G.layers.top, G.toPx(...V), G.toPx(...P), G.toPx(...Q), s, { color, width: 2.5 });
const pstamp = async (c, P, text, ok) => { const s = stamp(P, text, { ok, size: 'sm' }); s.classList.add('u6l10-pstamp'); await stampIn(c, s); };
/** where line P1Q1 meets line P2Q2 */
function meet(P1, Q1, P2, Q2) {
  const d1 = [Q1[0] - P1[0], Q1[1] - P1[1]], d2 = [Q2[0] - P2[0], Q2[1] - P2[1]], den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((P2[0] - P1[0]) * d2[1] - (P2[1] - P1[1]) * d2[0]) / den;
  return [P1[0] + t * d1[0], P1[1] + t * d1[1]];
}

/** a slope triangle: run (amber) from (x, y) across, then rise (purple) up or down. st = { x, y, run, rise } can change: S.upd() */
function stair(G, st, o = {}) {
  const w = o.width ?? 4.5, P = (x, y) => G.toPx(x, y), L = o.layer || G.layers.data;
  const fill = G.curve(() => ({ subs: st.run && st.rise && o.fill !== false ? [[P(st.x, st.y), P(st.x + st.run, st.y), P(st.x + st.run, st.y + st.rise)]] : [], closed: true }), { color: 'transparent', width: 0.1, fill: PUR, fillOpacity: 0.08 }, 'u6l10-sfill', L);
  const runEl = G.curve(() => ({ subs: st.run ? [[P(st.x, st.y), P(st.x + st.run, st.y)]] : [] }), { color: AMB, width: w }, 'u6l10-leg', L);
  const riseEl = G.curve(() => ({ subs: st.rise ? [[P(st.x + st.run, st.y), P(st.x + st.run, st.y + st.rise)]] : [] }), { color: PUR, width: w }, 'u6l10-leg', L);
  const txt = o.text || ((k, v) => `${o.words === false ? '' : k + ' '}${T(String(v))}`);
  const mkLab = (color) => { const d = h('div', 'bk-lab u6l10-leglab'); d.style.color = color; G.html.appendChild(d); return d; };
  const rl = mkLab(AMB), sl = mkLab(PUR);
  G.track(rl, () => {
    if (!st.run || o.labels === false) { rl.style.display = 'none'; return; } rl.style.display = '';
    if (rl._v !== st.run) { rl._v = st.run; rl.innerHTML = txt('run', st.run); }
    const [px, py] = P(st.x + st.run / 2, st.y); place(rl, px, py, o.runPos || (st.rise > 0 ? 's' : 'n'), 5);
  });
  G.track(sl, () => {
    if (!st.rise || o.labels === false) { sl.style.display = 'none'; return; } sl.style.display = '';
    if (sl._v !== st.rise) { sl._v = st.rise; sl.innerHTML = txt('rise', st.rise); }
    const [px, py] = P(st.x + st.run, st.y + st.rise / 2); place(sl, px, py, o.risePos || (st.run >= 0 ? 'e' : 'w'), 6);
  });
  hid(rl); hid(sl); hid(fill);
  const S = {
    st, els: [fill, runEl, riseEl, rl, sl],
    upd() { S.els.forEach((e) => e._bkDraw && e._bkDraw()); },
    async show(c, ms = 420) { await appear(c, unhide(fill), 200); await G.drawIn(runEl, ms, c); await fadeIn(c, unhide(rl), 220); await G.drawIn(riseEl, ms, c); await fadeIn(c, unhide(sl), 220); },
    showNow() { [rl, sl, fill].forEach(unhide); },
    dim(op = 0.28) { S.els.forEach((e) => (e.style.opacity = op)); },
    remove() { G.remove(...S.els); }
  };
  return S;
}
/** a pill label on a graph */
const pill = (G, x, y, html, o = {}) => G.label(x, y, html, Object.assign({ cls: 'u6l10-pill', pos: 'c' }, o));
/** tick marks across the middle of a segment (equal sides) */
function ticks(G, a, b, n, o = {}) {
  const g = svgEl('g', { class: 'u6l10-ticks' }, G.layers.top);
  const [x1, y1] = G.toPx(...a), [x2, y2] = G.toPx(...b), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux;
  for (let k = 0; k < n; k++) {
    const off = (k - (n - 1) / 2) * 8, mx = (x1 + x2) / 2 + ux * off, my = (y1 + y2) / 2 + uy * off;
    svgEl('line', { x1: mx - nx * 9, y1: my - ny * 9, x2: mx + nx * 9, y2: my + ny * 9, stroke: o.color || INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
  }
  return g;
}

/* =============================== warm-up: the mystery shape =============================== */
function mountShape() {
  const host = document.getElementById('u6l10-shape'); if (!host) return;
  const G = sqG(host, null, null, { xmin: 0, xmax: 10, ymin: 0, ymax: 10 }, 31, { xlabels: 2, ylabels: 2, fontSize: 15, origin: true });
  const P = { A: [2, 1], B: [9, 2], C: [8, 8], D: [1, 7] }, base = { C: 8, D: 7 };
  const quad = G.polyline([P.A, P.B, P.C, P.D], { closed: true, color: '#c88c14', width: 3.5, fill: '#ffecb3', fillOpacity: 0.85 });
  const q = G.label(5, 4.6, '?', { cls: 'u6l10-qmark' });
  const pts = Object.keys(P).map((n) => G.point(...P[n], { color: '#d23c32', r: 6.5, label: `<b>${n}</b>`, pos: { A: 'sw', B: 'se', C: 'ne', D: 'nw' }[n], labelCls: 'u6l10-vlab' }));
  const st = { slopes: false, t: 0 };
  let pills = [];
  const draw = () => {
    P.C[1] = base.C + st.t; P.D[1] = base.D + st.t; quad._bkDraw(); G.moveTo(pts[2], ...P.C); G.moveTo(pts[3], ...P.D);
    pills.forEach((e) => e.remove()); pills = [];
    if (!st.slopes) return;
    const cen = [5, 4.5 + st.t / 2];
    [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']].forEach(([a, b]) => {
      const p = P[a], r = P[b], m = frac(r[1] - p[1], r[0] - p[0]);
      const mx = (p[0] + r[0]) / 2, my = (p[1] + r[1]) / 2, dx = mx - cen[0], dy = my - cen[1], L = Math.hypot(dx, dy) || 1;
      pills.push(pill(G, mx + dx / L * 0.75, my + dy / L * 0.75, T(`m=${m.replace(/dfrac/g, 'tfrac')}`)));
    });
  };
  q.style.opacity = 1;
  const bS = document.getElementById('u6l10-wslopes'), bC = document.getElementById('u6l10-wcase2');
  if (bS) bS.addEventListener('click', () => { st.slopes = !st.slopes; bS.classList.toggle('on', st.slopes); draw(); });
  if (bC) bC.addEventListener('click', async () => {
    const to = st.t > 0.5 ? 0 : 1, t0 = st.t; bC.classList.toggle('on', to === 1);
    await tween(liveCtx(), 900, (k) => { st.t = t0 + (to - t0) * k; draw(); }); st.t = to; draw();
  });
}

/* =============================== Formula Summary minis =============================== */
function mountMinis() {
  const mini = (host) => new Graph(host, { width: 112, height: 84, numbers: false, xtitle: '', ytitle: '', arrows: false, axes: false, xmin: -0.5, xmax: 6.5, ymin: -0.5, ymax: 4.5, pad: 4 });
  const M = {
    pyth(G) { G.polyline([[1, 0.5], [5.5, 0.5], [1, 4]], { closed: true, color: INK, width: 2.5, fill: PUR, fillOpacity: 0.12 }); rightMark(G.layers.top, G.toPx(1, 0.5), G.toPx(2, 0.5), G.toPx(1, 1.5), 8, { color: INK, width: 1.6 });
      G.label(3.25, 0.5, '<i>b</i>', { pos: 's', cls: 'u6l10-mlab', gap: 1 }); G.label(1, 2.25, '<i>a</i>', { pos: 'w', cls: 'u6l10-mlab', gap: 2 }); G.label(3.4, 2.4, '<i>c</i>', { pos: 'ne', cls: 'u6l10-mlab', gap: 1 }); },
    hv(G) { G.segment([0.5, 3.5], [5, 3.5], { color: AMB, width: 3.5 }); G.segment([5.8, 0.3], [5.8, 3.2], { color: PUR, width: 3.5 }); G.segment([0.5, 1], [4, 1], { color: AMB, width: 3.5 }); },
    dist(G) { G.segment([0.5, 0.5], [5.5, 3.8], { color: BLUE, width: 3.5 }); const S = stair(G, { x: 0.5, y: 0.5, run: 5, rise: 3.3 }, { width: 2, labels: false }); S.showNow(); },
    mid(G) { G.segment([0.5, 0.5], [5.5, 3.8], { color: BLUE, width: 3.5 }); G.point(0.5, 0.5, { color: INK, r: 4 }); G.point(5.5, 3.8, { color: INK, r: 4 }); G.point(3, 2.15, { color: MID, r: 6 }); },
    end(G) { G.segment([0.5, 0.5], [3, 2.15], { color: BLUE, width: 3.5 }); G.segment([3, 2.15], [5.5, 3.8], { color: BLUE, width: 3, dash: '5 4' }); G.point(0.5, 0.5, { color: INK, r: 4 }); G.point(3, 2.15, { color: MID, r: 6 }); G.point(5.5, 3.8, { color: RED, r: 5, open: true }); },
    slope(G) { G.segment([0.5, 0.5], [5.5, 3.5], { color: BLUE, width: 3.5 }); const S = stair(G, { x: 0.5, y: 0.5, run: 5, rise: 3 }, { width: 2.5, labels: false }); S.showNow(); },
    types(G) { G.segment([0.2, 0.2], [2.2, 2], { color: GRN, width: 3 }); G.segment([2.6, 2], [4.4, 0.2], { color: RED, width: 3 }); G.segment([0.3, 3.8], [3, 3.8], { color: INK, width: 3 }); G.segment([5.6, 0.3], [5.6, 4.2], { color: PUR, width: 3 }); },
    col(G) { G.line([0.5, 0.5], [5.5, 3.5], { color: GRN, width: 2, arrows: false, dash: '5 4' }); [[1, 0.8], [3, 2], [5, 3.2]].forEach((p) => G.point(...p, { color: INK, r: 5 })); },
    par(G) { G.segment([0.3, 0.3], [3.8, 2.2], { color: BLUE, width: 3.5 }); G.segment([2.2, 2.2], [5.9, 4.2], { color: BLUE, width: 3.5 }); },
    perp(G) { G.segment([0.8, 0.6], [4.4, 2.4], { color: BLUE, width: 3.5 }); G.segment([4.4, 2.4], [3.4, 4.4], { color: RED, width: 3.5 }); rightMark(G.layers.top, G.toPx(4.4, 2.4), G.toPx(0.8, 0.6), G.toPx(3.4, 4.4), 8, { color: INK, width: 1.6 }); }
  };
  document.querySelectorAll('[data-mini]').forEach((el) => { const k = el.dataset.mini; if (M[k]) M[k](mini(el)); });
}

/* =============================== static figures =============================== */
function mountFigures() {
  const e6 = document.getElementById('u6l10-ex6fig');
  if (e6) { const G = sqG(e6, null, null, { xmin: -4, xmax: 10, ymin: -3, ymax: 5 }, 26, { xlabels: 2, ylabels: 2, fontSize: 15 }); npt(G, 'R', -3, -2, 's'); npt(G, 'S', 9, 4, 'n'); }
  const e8 = document.getElementById('u6l10-ex8fig');
  if (e8) {
    const G = sqG(e8, null, null, { xmin: -6, xmax: 10, ymin: -6, ymax: 20 }, 14, { xlabels: 4, ylabels: 4, fontSize: 15 });
    npt(G, 'X', -4, -2, 's', { coords: true }); npt(G, 'Y', 2, 8, 'e', { coords: true }); npt(G, 'Z', 8, 18, 'w', { coords: true });
  }
}

/* =============================== ★ which tool? name a quadrilateral =============================== */
const QUADS = {
  wu: { label: 'Warm-up: the mystery shape', N: ['A', 'B', 'C', 'D'], P: [[2, 1], [9, 2], [8, 8], [1, 7]], pos: ['sw', 'se', 'ne', 'nw'], win: { xmin: 0, xmax: 10, ymin: 0, ymax: 10 }, unit: 34 },
  case2: { label: 'Warm-up Case 2', N: ['A', 'B', 'C', 'D'], P: [[2, 1], [9, 2], [8, 9], [1, 8]], pos: ['sw', 'se', 'ne', 'nw'], win: { xmin: 0, xmax: 10, ymin: 0, ymax: 10 }, unit: 34 },
  ch2: { label: 'Challenge 2 check', N: ['K', 'L', 'M', 'N'], P: [[-6, -2], [-2, 4], [6, 2], [2, -4]], pos: ['w', 'n', 'e', 's'], win: { xmin: -7, xmax: 7, ymin: -5, ymax: 5 }, unit: 30 }
};
const RESULT = { para: 'parallelogram', rect: 'rectangle', rhom: 'rhombus', sq: 'square', no: 'not a parallelogram' };
function analyse(q) {
  const sides = q.P.map((a, i) => {
    const b = q.P[(i + 1) % 4], run = b[0] - a[0], rise = b[1] - a[1], name = q.N[i] + q.N[(i + 1) % 4];
    return { a, b, run, rise, name, len2: run * run + rise * rise, m: frac(rise, run) };
  });
  const parl = (s, t) => s.rise * t.run === t.rise * s.run;
  const p1 = parl(sides[0], sides[2]), p2 = parl(sides[1], sides[3]), par2 = p1 && p2;
  const perp = sides[0].rise * sides[1].rise === -sides[0].run * sides[1].run;
  const eq = sides.every((s) => s.len2 === sides[0].len2);
  const res = !par2 ? 'no' : perp ? (eq ? 'sq' : 'rect') : (eq ? 'rhom' : 'para');
  return { sides, p1, p2, par: par2, perp, eq, res };
}
const whichTool = {
  title: '★ Which suspect? Name the quadrilateral',
  height: 470,
  minW: 900,
  choices: Object.keys(QUADS).map((k) => ({ v: k, label: QUADS[k].label })),
  intro: (v) => `Follow ${T(QUADS[v].N.join(''))} through the flowchart. Each side’s <b>slope</b> and <b>length</b> appear on the grid. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const q = QUADS[v], A = analyse(q), S = A.sides, quad = q.N.join('');
    const G = sqG(stage, 8, 14, q.win, q.unit, { xlabels: 2, ylabels: 2, fontSize: 15 });
    const FW = ex.W - G.W - 24, k = FW / 500, X = (x) => x * k, fx = ex.W - FW - 8;
    const F = new Flowchart(stage, {
      x: fx, y: 6, width: FW, height: 458,
      nodes: {
        start: { x: X(200), y: 30, w: X(340), h: 46, html: '<b>Slope and length of every side</b>', cls: 'bk-round' },
        par: { x: X(200), y: 118, w: X(330), h: 64, html: '<b>Opposite sides parallel?</b>both pairs: equal slopes', cls: 'bk-diamond' },
        no: { x: X(440), y: 118, w: X(116), h: 64, html: '<b>Not a parallelo&shy;gram</b>', cls: 'bk-dashed', color: GRAY },
        perp: { x: X(200), y: 214, w: X(360), h: 64, html: `<b>Square corners?</b>${T('m_1\\times m_2=-1')}`, cls: 'bk-diamond' },
        eqL: { x: X(108), y: 310, w: X(206), h: 60, html: '<b>All 4 sides equal?</b>lengths' },
        eqR: { x: X(352), y: 310, w: X(206), h: 60, html: '<b>All 4 sides equal?</b>lengths' },
        rhom: { x: X(50), y: 416, w: X(98), h: 48, html: '<b>Rhombus</b>', color: 'brand' },
        para: { x: X(164), y: 416, w: X(124), h: 48, html: '<b>Parallelo&shy;gram</b>', color: 'brand' },
        rect: { x: X(296), y: 416, w: X(116), h: 48, html: '<b>Rectangle</b>', color: 'brand' },
        sq: { x: X(424), y: 416, w: X(98), h: 48, html: '<b>Square</b>', color: 'brand' }
      },
      edges: [
        { from: 'start', to: 'par' }, { from: 'par', to: 'no', label: 'no' }, { from: 'par', to: 'perp', label: 'yes' },
        { from: 'perp', to: 'eqL', label: 'no', route: 'vhv' }, { from: 'perp', to: 'eqR', label: 'yes', route: 'vhv' },
        { from: 'eqL', to: 'rhom', label: 'yes', route: 'vhv' }, { from: 'eqL', to: 'para', label: 'no', route: 'vhv' },
        { from: 'eqR', to: 'rect', label: 'no', route: 'vhv' }, { from: 'eqR', to: 'sq', label: 'yes', route: 'vhv' }
      ]
    });
    F.el.classList.add('u6l10-flow');
    // the travelling shape: a thumbnail of the quadrilateral
    const xs = q.P.map((p) => p[0]), ys = q.P.map((p) => p[1]), x0 = Math.min(...xs), y1 = Math.max(...ys), sc = 40 / Math.max(Math.max(...xs) - x0, y1 - Math.min(...ys));
    const tok = h('div', 'u6l10-token'); const tsv = svgEl('svg', { width: 48, height: 48, viewBox: '-4 -4 48 48' }, tok);
    svgEl('polygon', { points: q.P.map((p) => `${((p[0] - x0) * sc).toFixed(1)},${((y1 - p[1]) * sc).toFixed(1)}`).join(' '), fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, tsv);
    F.html.appendChild(tok); tok.style.opacity = 0;
    const ENDS = ['no', 'rhom', 'para', 'rect', 'sq'];
    const tpos = (id) => { const n = F.node(id).n; return ENDS.includes(id) ? [Math.min(FW - 27, n.x + n.w / 2 - 10), n.y - n.h / 2 - 16] : [Math.max(27, n.x - n.w / 2 - 6), n.y]; };
    let tcur = null;
    const tokTo = async (c, id) => { const [x2, y2] = tpos(id); if (!tcur) { tcur = [x2, y2]; place(tok, x2, y2, 'c'); await pop(c, tok, 300); return; } const [xa, ya] = tcur; await tween(c, 520, (t) => place(tok, xa + (x2 - xa) * t, ya + (y2 - ya) * t, 'c')); tcur = [x2, y2]; };
    const goTo = async (c, a, b) => { await Promise.all([F.go(c, a, b), tokTo(c, b)]); await F.visit(c, b); };
    const cen = [xs.reduce((s, x) => s + x, 0) / 4, ys.reduce((s, y) => s + y, 0) / 4];
    const segs = [], pills = [], stairs = [];
    const sideStep = (i) => {
      const s = S[i], sq2 = `\\sqrt{${par(s.run)}^2+${par(s.rise)}^2}`;
      return {
        cap: `${T(s.name)}: run ${T(String(s.run))}, rise ${T(String(s.rise))}. Slope ${T(`m_{${s.name}}=${frEq(s.rise, s.run)}`)}. Length ${T(`${s.name}=${sq2}=${lenTex(s.len2)}`)}.`,
        run: async (c) => {
          if (i) stairs[i - 1].dim(0.18);
          const st = stair(G, { x: s.a[0], y: s.a[1], run: s.run, rise: s.rise }, { width: 3.5, labels: false }); stairs.push(st); await st.show(c, 340);
          segs[i].path.setAttribute('stroke-width', 5);
          const mx = (s.a[0] + s.b[0]) / 2, my = (s.a[1] + s.b[1]) / 2, [pmx, pmy] = G.toPx(mx, my), [pcx, pcy] = G.toPx(...cen);
          let nx = -(s.b[1] - s.a[1]) * G.uy, ny = -(s.b[0] - s.a[0]) * G.ux; const L = Math.hypot(nx, ny); nx /= L; ny /= L;
          if (nx * (pmx - pcx) + ny * (pmy - pcy) < 0) { nx = -nx; ny = -ny; }
          const d = h('div', 'bk-lab u6l10-spill', `${T('m=' + s.m.replace(/dfrac/g, 'tfrac'))}<br>${T(rad(s.len2))}`); G.html.appendChild(d);
          const off = 34 + Math.abs(nx) * 26; place(d, pmx + nx * off, pmy + ny * off, 'c'); pills.push(d); await pop(c, d, 300);
        }
      };
    };
    const steps = [
      { cap: `Plot ${q.N.map((n, i) => T(PTX(n, q.P[i]))).join(', ')}. First, for every side: its <b>slope</b> and its <b>length</b>.`,
        run: async (c) => {
          for (let i = 0; i < 4; i++) await G.reveal(npt(G, q.N[i], ...q.P[i], q.pos[i]), c, 200);
          for (let i = 0; i < 4; i++) { segs[i] = G.segment(S[i].a, S[i].b, { color: BLUE, width: 3.5 }); await G.drawIn(segs[i], 240, c); }
          await tokTo(c, 'start'); await F.visit(c, 'start');
        } },
      sideStep(0), sideStep(1), sideStep(2), sideStep(3)
    ];
    const colorPair = (i, j, cl) => { [i, j].forEach((t) => { segs[t].path.setAttribute('stroke', cl); segs[t].path.setAttribute('stroke-width', 6); pills[t].style.borderColor = cl; pills[t].style.color = cl; }); };
    const [s0, s1, s2, s3] = S;
    const pairT = (s, u, ok) => (ok ? `m_{${s.name}}=m_{${u.name}}=${s.m}` : `m_{${s.name}}=${s.m},\\ m_{${u.name}}=${u.m}`);
    steps.push({ cap: `Opposite sides: ${T(pairT(s0, s2, A.p1))} ${A.p1 ? '✓' : '✗'} and ${T(pairT(s1, s3, A.p2))} ${A.p2 ? '✓' : '✗'}. ` + (A.par ? 'Both pairs are parallel: <b>yes</b>.' : 'Not both pairs: <b>no</b>.'),
      run: async (c) => { stairs[3].dim(0.18); await goTo(c, 'start', 'par'); colorPair(0, 2, A.p1 ? BLUE : RED); colorPair(1, 3, A.p2 ? GRN : RED); await sleep(c, 200); } });
    if (!A.par) {
      steps.push({ cap: `${T(quad)} is <b>not a parallelogram</b>.`, run: async (c) => { await goTo(c, 'par', 'no'); const s = stamp(stage, 'not a parallelogram', { ok: false, x: G.W / 2 + 8, y: 444, size: 'sm', rotate: -4 }); await stampIn(c, s); } });
      return steps;
    }
    const V = q.P[1], Pp = q.P[0], Qq = q.P[2], ang = Math.round(Math.acos(((Pp[0] - V[0]) * (Qq[0] - V[0]) + (Pp[1] - V[1]) * (Qq[1] - V[1])) / Math.hypot(Pp[0] - V[0], Pp[1] - V[1]) / Math.hypot(Qq[0] - V[0], Qq[1] - V[1])) * 180 / Math.PI);
    const prod = `m_{${s0.name}}\\times m_{${s1.name}}=${prodTex(s0.m, s1.m)}=${frac(s0.rise * s1.rise, s0.run * s1.run)}`;
    steps.push({ cap: A.perp ? `Neighbouring sides: ${T(prod)}. Perpendicular: <b>yes</b>, so all four corners are square.` : `Neighbouring sides: ${T(prod + '\\ne-1')}. <b>No</b> square corners: the corner at ${T(q.N[1])} is about ${T(ang + '^\\circ')}.`,
      run: async (c) => {
        await goTo(c, 'par', 'perp');
        if (A.perp) for (let i = 0; i < 4; i++) { const W = q.P[i], P0 = q.P[(i + 3) % 4], Q0 = q.P[(i + 1) % 4]; const mk = rmark(G, W, P0, Q0, 13, RED); mk.style.opacity = 0; await appear(c, mk, 160); }
        else { const t = G.label(V[0] + (cen[0] - V[0]) * 0.3, V[1] + (cen[1] - V[1]) * 0.3, `≈ ${ang}°`, { cls: 'u6l10-chk' }); await pop(c, t); }
      } });
    const L0 = rad(s0.len2), L1 = rad(s1.len2), eqNode = A.perp ? 'eqR' : 'eqL';
    steps.push({ cap: A.eq ? `Lengths: all four sides are ${T(L0)}. All equal: <b>yes</b>.` : `Lengths: ${T(`${s0.name}=${s2.name}=${L0}`)} but ${T(`${s1.name}=${s3.name}=${L1}`)}. Not all equal: <b>no</b>.`,
      run: async (c) => { await goTo(c, 'perp', eqNode); for (let i = 0; i < 4; i++) { const t = ticks(G, S[i].a, S[i].b, A.eq ? 1 : (i % 2 ? 2 : 1)); await appear(c, t, 160); } } });
    steps.push({ cap: `${T(quad)} is a <b>${RESULT[A.res]}</b>.` + (A.res === 'para' ? ' Opposite sides parallel and equal, but no square corners and the neighbours are not equal.' : A.res === 'sq' ? ' Every test passed: square corners <b>and</b> four equal sides.' : A.res === 'rect' ? ' Square corners, but not all sides equal.' : ' Four equal sides, but no square corners.'),
      run: async (c) => { await goTo(c, eqNode, A.res); const s = stamp(stage, RESULT[A.res], { ok: true, x: G.W / 2 + 8, y: 444, size: 'sm', rotate: -4 }); await stampIn(c, s); } });
    return steps;
  }
};

/* =============================== 1. Pythagoras: squares on the sides =============================== */
const PY = {
  a: { label: 'Example 1(a) check', a: 20, b: 21, find: 'c' },
  b: { label: 'Example 1(b) check', a: 16, b: 30, c: 34, find: 'b' }
};
const pyth = {
  title: 'Squares on the sides: add them, or subtract',
  height: 470,
  minW: 860,
  choices: Object.keys(PY).map((k) => ({ v: k, label: PY[k].label })),
  intro: (k) => (k === 'a' ? 'Two legs are known. Build a square on each side. Press <b>Next</b>.' : 'The hypotenuse and one leg are known. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = PY[k], a = d.a, b = d.b, c2 = a * a + b * b, cc = Math.sqrt(c2);
    const s = Math.min(440 / (2 * a + b), 440 / (a + 2 * b)), ox = 18, oy = 14 + (440 - (a + 2 * b) * s) / 2;
    const X = (x, y) => [ox + (x + a) * s, oy + (a + b - y) * s];
    const svg = svgEl('svg', { width: (2 * a + b) * s + 40, height: 470, class: 'u6l10-pysvg' }, stage); svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px';
    const poly = (pts, attrs) => svgEl('path', Object.assign({ d: dOf(pts.map((p) => X(...p))) + 'Z' }, attrs), svg);
    const sqA = poly([[0, 0], [0, a], [-a, a], [-a, 0]], { fill: PUR, 'fill-opacity': 0.16, stroke: PUR, 'stroke-width': 3 });
    const sqB = poly([[0, 0], [b, 0], [b, -b], [0, -b]], { fill: AMB, 'fill-opacity': 0.16, stroke: AMB, 'stroke-width': 3 });
    const sqC = poly([[0, a], [b, 0], [b + a, b], [a, a + b]], { fill: BLUE, 'fill-opacity': 0.14, stroke: BLUE, 'stroke-width': 3 });
    const triE = poly([[0, 0], [b, 0], [0, a]], { fill: '#fff', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' });
    const rmk = rightMark(svg, X(0, 0), X(1, 0), X(0, 1), 14, { color: INK, width: 2 });
    const lab = (x, y, html, cls) => { const e = h('div', 'bk-lab ' + cls, html); stage.appendChild(e); const [px, py] = X(x, y); place(e, px, py, 'c'); return e; };
    const area = (x, y, html, color) => { const e = lab(x, y, html, 'u6l10-area'); e.style.color = color; return hid(e); };
    const sA = lab(2.6, a / 2, T(String(a)), 'u6l10-side'), sB = lab(b / 2, 2.4, T(String(b)), 'u6l10-side');
    const cLab = lab(b / 2 - a / cc * 3.2, a / 2 - b / cc * 3.2, T(d.find === 'c' ? 'c' : String(d.c)), 'u6l10-side u6l10-hyp');
    if (d.find === 'b') sB.innerHTML = T('?');
    [sqA, sqB, sqC].forEach(hid);
    const aA = area(-a / 2, a / 2, `${T(`${a}^2`)}<br>${T(String(a * a))}`, PUR), aB = area(b / 2, -b / 2, `${T(`${b}^2`)}<br>${T(String(b * b))}`, AMB);
    const aC = area((a + b) / 2, (a + b) / 2, `${T('c^2')}<br>${T(String(c2))}`, BLUE);
    if (d.find === 'b') { aC.innerHTML = `${T(`${d.c}^2`)}<br>${T(String(d.c * d.c))}`; aB.innerHTML = `${T('?^2')}<br>${T(String(b * b))}`; }
    const W = (2 * a + b) * s + 50, P = panel(stage, W, 14, ex.W - W - 14, 440, d.find === 'c' ? 'Find the hypotenuse' : 'Find the missing leg');
    const grow = (c, el) => c.anim(el, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1)' }], 600);
    [sqA, sqB, sqC].forEach((e) => { e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; });
    void triE; void rmk;
    if (d.find === 'c') return [
      { cap: `The legs ${T(String(a))} and ${T(String(b))} meet at the right angle. The <b>hypotenuse</b> ${T('c')} is the long side across from it.`,
        run: async (c) => { await say(c, P, T(`c^2=a^2+b^2`), 'u6l10-mline'); } },
      { cap: `Build a square on the first leg: its area is ${T(`${a}^2=${a * a}`)}.`,
        run: async (c) => { unhide(sqA); await grow(c, sqA); unhide(aA); await fadeIn(c, aA); await say(c, P, T(`c^2=${a}^2+${b}^2`), 'u6l10-mline'); } },
      { cap: `And on the other leg: ${T(`${b}^2=${b * b}`)}.`,
        run: async (c) => { unhide(sqB); await grow(c, sqB); unhide(aB); await fadeIn(c, aB); await say(c, P, T(`c^2=${a * a}+${b * b}`), 'u6l10-mline'); } },
      { cap: `The square on the hypotenuse holds <b>both</b> of them: ${T(`c^2=${a * a}+${b * b}=${c2}`)}.`,
        run: async (c) => { unhide(sqC); await grow(c, sqC); unhide(aC); await fadeIn(c, aC); await say(c, P, T(`c^2=${c2}`), 'u6l10-mline'); } },
      { cap: `Undo the square with a square root: ${T(`c=\\sqrt{${c2}}=${cc}`)}.`,
        run: async (c) => { cLab.innerHTML = T(`c=${cc}`); await pulse(c, cLab, 1.3); await say(c, P, T(`c=\\sqrt{${c2}}=\\boldsymbol{${cc}}`), 'u6l10-mline u6l10-good'); } }
    ];
    const C = d.c, rest = C * C - a * a;
    return [
      { cap: `The hypotenuse is ${T(String(C))} and one leg is ${T(String(a))}. The other leg is missing.`,
        run: async (c) => { await say(c, P, T(`a^2+${a}^2=${C}^2`), 'u6l10-mline'); } },
      { cap: `The square on the hypotenuse: ${T(`${C}^2=${C * C}`)}. It holds the two leg squares together.`,
        run: async (c) => { unhide(sqC); await grow(c, sqC); unhide(aC); await fadeIn(c, aC); } },
      { cap: `The known leg’s square: ${T(`${a}^2=${a * a}`)}.`,
        run: async (c) => { unhide(sqA); await grow(c, sqA); unhide(aA); await fadeIn(c, aA); await say(c, P, T(`a^2=${C * C}-${a * a}`), 'u6l10-mline'); } },
      { cap: `The missing leg’s square is <b>what’s left</b>: ${T(`${C * C}-${a * a}=${rest}`)}. To find a leg, <b>subtract</b>.`,
        run: async (c) => { unhide(sqB); await grow(c, sqB); aB.innerHTML = `${T('?^2')}<br>${T(String(rest))}`; unhide(aB); await fadeIn(c, aB); await say(c, P, T(`a^2=${rest}`), 'u6l10-mline'); } },
      { cap: `${T(`\\sqrt{${rest}}=${b}`)}: the missing leg is ${T(String(b))}.`,
        run: async (c) => { sB.innerHTML = T(String(b)); await pulse(c, sB, 1.3); await say(c, P, T(`a=\\sqrt{${rest}}=\\boldsymbol{${b}}`), 'u6l10-mline u6l10-good'); } }
    ];
  }
};

/* =============================== 2–3. lengths: subtract, or the hidden right triangle =============================== */
const LEN = {
  ex2: { label: 'Example 2 check' },
  ex3a: { label: 'Example 3(a) check', A: ['M', -2, -1, 'w'], B: ['N', 10, 4, 'n'], win: { xmin: -3, xmax: 11, ymin: -2, ymax: 6 }, unit: 30 },
  ex3b: { label: 'Example 3(b) check', A: ['P', -4, 1, 'w'], B: ['Q', 2, 5, 'n'], win: { xmin: -5, xmax: 3, ymin: -1, ymax: 6 }, unit: 46 }
};
const lengths = {
  title: 'Length: subtract, or find the hidden right triangle',
  height: 470,
  minW: 860,
  choices: Object.keys(LEN).map((k) => ({ v: k, label: LEN[k].label })),
  intro: (k) => (k === 'ex2' ? 'A horizontal segment and a vertical segment. Press <b>Next</b>.' : 'A diagonal segment. Press <b>Next</b>.'),
  make(stage, k, ex) {
    if (k === 'ex2') {
      const G = sqG(stage, 14, 10, { xmin: -8, xmax: 6, ymin: -7, ymax: 10 }, 24, { xlabels: 2, ylabels: 2, fontSize: 15 });
      const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Length = positive difference');
      const count = async (c, n, at) => { const out = []; for (let i = 1; i <= n; i++) { const t = G.label(...at(i), String(i), { cls: 'u6l10-cnt' }); out.push(t); if (c && !c.fast) await pop(c, t, 120); } await sleep(c, 350); G.remove(...out); };
      let EF, GH;
      return [
        { cap: `${T('E(-7,\\ 4)')} and ${T('F(5,\\ 4)')}: the same ${T('y')}, so ${T('EF')} is <b>horizontal</b>. ${T('G(3,\\ 9)')} and ${T('H(3,\\ -6)')}: the same ${T('x')}, so ${T('GH')} is <b>vertical</b>.`,
          run: async (c) => {
            EF = G.segment([-7, 4], [5, 4], { color: BLUE, width: 4.5 }); GH = G.segment([3, 9], [3, -6], { color: BLUE, width: 4.5 });
            for (const [n, x, y, p] of [['E', -7, 4, 'n'], ['F', 5, 4, 'n'], ['G', 3, 9, 'e'], ['H', 3, -6, 'e']]) await G.reveal(npt(G, n, x, y, p), c, 160);
            await G.drawIn(EF, 400, c); await G.drawIn(GH, 400, c);
          } },
        { cap: `${T('EF')}: count the squares… or subtract the ${T('x')}’s: ${T('|5-(-7)|=|12|=12')} units.`,
          run: async (c) => { EF.path.setAttribute('stroke', AMB); await count(c, 12, (i) => [-7 + i - 0.5, 4.55]); const l = pill(G, -1, 4, T('12'), { pos: 's', gap: 8 }); l.style.color = AMB; await pop(c, l); await say(c, P, T('EF=|5-(-7)|=|12|=\\boldsymbol{12}'), 'u6l10-mline'); } },
        { cap: `${T('GH')}: subtract the ${T('y')}’s: ${T('-6-9=-15')}. A length is never negative, so take the <b>absolute value</b>: ${T('|-15|=15')} units.`,
          run: async (c) => { GH.path.setAttribute('stroke', PUR); await count(c, 15, (i) => [3.55, -6 + i - 0.5]); const l = pill(G, 3, 1.5, T('15'), { pos: 'w', gap: 8 }); l.style.color = PUR; await pop(c, l); await say(c, P, T('GH=|-6-9|=|-15|=\\boldsymbol{15}'), 'u6l10-mline'); } }
      ];
    }
    const d = LEN[k], [an, ax, ay, ap] = d.A, [bn, bx, by, bp] = d.B, A = [ax, ay], B = [bx, by], run = bx - ax, rise = by - ay, N = run * run + rise * rise;
    const G = sqG(stage, 14, 14, d.win, d.unit, { xlabels: 2, ylabels: 2, fontSize: 15 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'The distance formula');
    let S;
    const r = rad(N), exact = r === `\\sqrt{${N}}` ? null : r, whole = Number.isInteger(Math.sqrt(N));
    const steps = [
      { cap: `Plot ${T(PTX(an, A))} and ${T(PTX(bn, B))}. The segment is <b>diagonal</b>, so no single subtraction gives its length.`,
        run: async (c) => { await G.reveal(npt(G, an, ax, ay, ap), c); await G.reveal(npt(G, bn, bx, by, bp), c); await G.drawIn(G.segment(A, B, { color: BLUE, width: 4.5 }), 600, c); } },
      { cap: `Every diagonal segment hides a <b>right triangle</b>. Run: ${T(`${bx}-${par(ax)}=${run}`)}. Rise: ${T(`${by}-${par(ay)}=${rise}`)}.`,
        run: async (c) => { S = stair(G, { x: ax, y: ay, run, rise }); await S.show(c); await say(c, P, `run ${T(`=${bx}-${par(ax)}=${run}`)}`, 'u6l10-am'); await say(c, P, `rise ${T(`=${by}-${par(ay)}=${rise}`)}`, 'u6l10-pu'); } },
      { cap: `Pythagoras: ${T('d^2=\\text{run}^2+\\text{rise}^2')}. ${T(`d=\\sqrt{${run}^2+${rise}^2}=\\sqrt{${run * run}+${rise * rise}}=\\sqrt{${N}}`)}.`,
        run: async (c) => { for (const s of [`d=\\sqrt{(${bx}-${par(ax)})^2+(${by}-${par(ay)})^2}`, `=\\sqrt{${run}^2+${rise}^2}=\\sqrt{${run * run}+${rise * rise}}`, `=\\sqrt{${N}}`]) await say(c, P, T(s), 'u6l10-mline'); } }
    ];
    if (whole) steps.push({ cap: `${T(`\\sqrt{${N}}=${Math.sqrt(N)}`)}: a perfect square, so the exact distance is the whole number <b>${Math.sqrt(N)}</b> units.`,
      run: async (c) => { await say(c, P, T(`=\\boldsymbol{${Math.sqrt(N)}}`), 'u6l10-mline u6l10-good'); const l = pill(G, (ax + bx) / 2, (ay + by) / 2, T(String(Math.sqrt(N))), { pos: 'nw', gap: 6 }); l.style.color = BLUE; await pop(c, l); } });
    else {
      const k2 = Math.round(Number(exact.split('\\')[0])), m2 = N / (k2 * k2);
      steps.push({ cap: `${T(String(N))} is not a perfect square. Pull out the biggest perfect square factor: ${T(`\\sqrt{${N}}=\\sqrt{${k2 * k2}}\\cdot\\sqrt{${m2}}=${exact}`)} units ${T(`\\approx${(Math.sqrt(N)).toFixed(1)}`)}.`,
        run: async (c) => { await say(c, P, T(`=\\sqrt{${k2 * k2}}\\cdot\\sqrt{${m2}}=\\boldsymbol{${exact}}`), 'u6l10-mline u6l10-good'); await say(c, P, `${T(`\\approx${(Math.sqrt(N)).toFixed(1)}`)} on the calculator`, 'u6l10-small'); const l = pill(G, (ax + bx) / 2, (ay + by) / 2, T(exact), { pos: 'nw', gap: 6 }); l.style.color = BLUE; await pop(c, l); } });
    }
    return steps;
  }
};

/* =============================== 4–5. midpoint: half the run, half the rise =============================== */
const midpoint = {
  title: 'The midpoint: half the run, half the rise',
  height: 470,
  minW: 900,
  choices: [{ v: 'ex4', label: 'Example 4 check' }, { v: 'ex5a', label: 'Example 5(a) check' }, { v: 'ex5b', label: 'Example 5(b) check' }],
  intro: (v) => ({ ex4: 'Find the point halfway from A to B. Press <b>Next</b>.', ex5a: 'M is halfway from C to D. Where is D? Press <b>Next</b>.', ex5b: 'Two trailheads on a park map (1 unit = 10 m). Press <b>Next</b>.' })[v],
  make(stage, v, ex) {
    if (v === 'ex5a') {
      const G = sqG(stage, 14, 10, { xmin: -4, xmax: 14, ymin: -10, ymax: 8 }, 23, { xlabels: 2, ylabels: 2, fontSize: 15 });
      const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Working backwards');
      return [
        { cap: `${T('C(-3,\\ 7)')} is one endpoint and ${T('M(5,\\ -1)')} is the midpoint. ${T('D')} is missing.`,
          run: async (c) => { await G.reveal(npt(G, 'C', -3, 7, 'n', { coords: true }), c); await G.reveal(npt(G, 'M', 5, -1, 'sw', { coords: true, color: MID }), c); await G.drawIn(G.segment([-3, 7], [5, -1], { color: BLUE, width: 4.5 }), 500, c); } },
        { cap: `From ${T('C')} to ${T('M')}: run ${T('5-(-3)=8')}, rise ${T('-1-7=-8')}.`,
          run: async (c) => { await stair(G, { x: -3, y: 7, run: 8, rise: -8 }).show(c); await say(c, P, `${T('C\\to M')}: run 8, rise ${T('-8')}`); } },
        { cap: `${T('M')} is <b>halfway</b>, so ${T('D')} is the <b>same step again</b>: ${T('(5+8,\\ -1-8)=(13,\\ -9)')}.`,
          run: async (c) => {
            await stair(G, { x: 5, y: -1, run: 8, rise: -8 }, { risePos: 'w' }).show(c);
            await G.drawIn(G.segment([5, -1], [13, -9], { color: BLUE, width: 4.5 }), 500, c);
            await G.reveal(npt(G, 'D', 13, -9, 'w', { coords: true, color: RED }), c);
            await say(c, P, `${T('M\\to D')}: the same step, so ${T('D(13,\\ -9)')}`);
          } },
        { cap: `The shortcut: <b>double the midpoint, subtract the known end</b>. ${T('x_D=2(5)-(-3)=13')}, ${T('y_D=2(-1)-7=-9')}.`,
          run: async (c) => { for (const s of ['x_D=2(5)-(-3)=10+3=13', 'y_D=2(-1)-7=-2-7=-9']) await say(c, P, T(s), 'u6l10-mline'); await say(c, P, T('\\boldsymbol{D(13,\\ -9)}'), 'u6l10-mline u6l10-good'); } }
      ];
    }
    if (v === 'ex5b') {
      const G = sqG(stage, 14, 20, { xmin: 0, xmax: 19, ymin: -6, ymax: 10 }, 23, { xlabels: 2, ylabels: 2, fontSize: 15 });
      const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'The rest stop');
      const [x0, y0] = G.toPx(0, 10), [x1, y1] = G.toPx(19, -6);
      svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: '#2f9e5b', 'fill-opacity': 0.07 }, G.layers.bg);
      return [
        { cap: `Trailheads ${T('P(2,\\ 9)')} and ${T('Q(18,\\ -5)')}. Each grid unit is ${T('10')} m.`,
          run: async (c) => { await G.reveal(npt(G, 'P', 2, 9, 'e', { coords: true }), c); await G.reveal(npt(G, 'Q', 18, -5, 'w', { coords: true }), c); await G.drawIn(G.segment([2, 9], [18, -5], { color: BLUE, width: 4, dash: '10 7' }), 600, c); } },
        { cap: `Halfway: walk half the run (${T('16\\div2=8')}) and half the rise (${T('-14\\div2=-7')}). The rest stop is at ${T('(10,\\ 2)')}.`,
          run: async (c) => { const S = stair(G, { x: 2, y: 9, run: 16, rise: -14 }, { risePos: 'w' }); await S.show(c, 300); S.dim(0.3); await stair(G, { x: 2, y: 9, run: 8, rise: -7 }, { width: 6 }).show(c); await G.reveal(npt(G, 'M', 10, 2, 'w', { coords: true, color: MID, r: 8 }), c); } },
        { cap: `The formula agrees: ${T('M=\\left(\\dfrac{2+18}{2},\\ \\dfrac{9+(-5)}{2}\\right)=(10,\\ 2)')}.`,
          run: async (c) => { await say(c, P, T('M=\\left(\\dfrac{2+18}{2},\\ \\dfrac{9+(-5)}{2}\\right)'), 'u6l10-mline'); await say(c, P, T('=\\boldsymbol{(10,\\ 2)}'), 'u6l10-mline u6l10-good'); } },
        { cap: `From ${T('P')}: east ${T('10-2=8')} units ${T('=80')} m, and south ${T('9-2=7')} units ${T('=70')} m.`,
          run: async (c) => { await say(c, P, `East: ${T('8\\times10=\\boldsymbol{80}')} m`, 'u6l10-am'); await say(c, P, `South: ${T('7\\times10=\\boldsymbol{70}')} m`, 'u6l10-pu'); } }
      ];
    }
    // Example 4
    const G = sqG(stage, 14, 30, { xmin: -11, xmax: 7, ymin: -10, ymax: 4 }, 25, { xlabels: 2, ylabels: 2, fontSize: 15 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Two ways');
    let full;
    return [
      { cap: `Plot ${T('A(-10,\\ 3)')} and ${T('B(6,\\ -9)')}.`,
        run: async (c) => { await G.reveal(npt(G, 'A', -10, 3, 'n', { coords: true }), c); await G.reveal(npt(G, 'B', 6, -9, 'w', { coords: true }), c); await G.drawIn(G.segment([-10, 3], [6, -9], { color: BLUE, width: 4.5 }), 600, c); } },
      { cap: `From ${T('A')} to ${T('B')}: run ${T('6-(-10)=16')}, rise ${T('-9-3=-12')}.`,
        run: async (c) => { full = stair(G, { x: -10, y: 3, run: 16, rise: -12 }, { risePos: 'w' }); await full.show(c); full.dim(0.35); await say(c, P, `${T('A\\to B')}: run 16, rise ${T('-12')}`); } },
      { cap: `Walk <b>half</b> the run (${T('8')}) and <b>half</b> the rise (${T('-6')}): ${T('(-10+8,\\ 3-6)=(-2,\\ -3)')}.`,
        run: async (c) => { await stair(G, { x: -10, y: 3, run: 8, rise: -6 }, { width: 6 }).show(c); await G.reveal(G.point(-2, -3, { color: MID, r: 8, label: T('M(-2,\\ -3)'), pos: 'e' }), c); await say(c, P, `<b>Half the step</b>: run 8, rise ${T('-6')}`); } },
      { cap: `Same answer by the formula: <b>average</b> the ${T('x')}’s, then average the ${T('y')}’s.`,
        run: async (c) => { for (const s of ['M\\left(\\dfrac{-10+6}{2},\\ \\dfrac{3+(-9)}{2}\\right)', '=\\left(\\dfrac{-4}{2},\\ \\dfrac{-6}{2}\\right)', '=\\boldsymbol{(-2,\\ -3)}']) await say(c, P, T(s), 'u6l10-mline'); } }
    ];
  }
};

/* =============================== 6–7. slopes: a slope triangle, the four types, a dial =============================== */
const slopes = {
  title: 'Slope: rise over run, and the four types',
  height: 470,
  minW: 860,
  choices: [{ v: 'ex6', label: 'Example 6 check' }, { v: 'ex7', label: 'Example 7 check' }, { v: 'dial', label: 'Steepness dial' }],
  intro: (v) => ({ ex6: 'The slope from R to S. Press <b>Next</b>.', ex7: 'Three segments on one grid. Press <b>Next</b>.', dial: 'Turn a line from flat to vertical and past it. Watch its slope. Press <b>Next</b>.' })[v],
  make(stage, v, ex) {
    if (v === 'dial') {
      const G = sqG(stage, 14, 14, { xmin: -5, xmax: 5, ymin: -5, ymax: 5 }, 42, {});
      const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'The slope');
      const big = h('div', 'u6l10-big', T('m=0')); P.appendChild(big);
      const note = h('div', 'u6l10-line', ''); P.appendChild(note);
      const st = { a: 0 };
      const ln = G.curve(() => { const r = st.a * Math.PI / 180, dx = Math.cos(r), dy = Math.sin(r); return { subs: [[G.toPx(-20 * dx, -20 * dy), G.toPx(20 * dx, 20 * dy)]] }; }, { color: BLUE, width: 4.5 }, 'u6l10-dial', G.layers.data);
      const tr = stair(G, { x: 0, y: 0, run: 1, rise: 0 }, { text: (kk, v2) => `${kk} ${T(String(Math.round(v2 * 100) / 100))}`, fill: false });
      const setA = (a) => {
        st.a = a; ln._bkDraw(); const m = Math.tan(a * Math.PI / 180), vert = Math.abs(((a % 180) + 180) % 180 - 90) < 0.01;
        const big2 = vert || Math.abs(m) > 4.4; tr.st.rise = big2 ? 0 : m; tr.st.run = big2 ? 0 : 1; tr.upd();
        const t = vert ? 'm\\ \\text{undefined}' : `m=${String(Math.round(m * 100) / 100).replace('-', '-')}`; if (big._t !== t) { big._t = t; big.innerHTML = T(t); }
      };
      const turn = (to, ms = 1100) => async (c) => { const a0 = st.a; await tween(c, ms, (t) => setA(a0 + (to - a0) * t)); setA(to); };
      const deg = (m) => Math.atan(m) * 180 / Math.PI;
      const N = (html, cls = '') => async (c) => { note.className = 'u6l10-line ' + cls; note.innerHTML = html; await fadeIn(c, note, 250); };
      return [
        { cap: `A <b>horizontal</b> line: 1 across, 0 up. ${T('m=\\dfrac{0}{1}=0')}: a <b>zero</b> slope.`, run: async (c) => { await G.drawIn(ln, 500, c); tr.showNow(); setA(0); await N(`flat: <b>zero</b> slope`)(c); } },
        { cap: `Turn it a little: 1 across, ${T('\\tfrac12')} up. It <b>rises</b> left to right: a <b>positive</b> slope.`, run: async (c) => { await turn(deg(0.5))(c); await N(`rising: <b>positive</b>`, 'u6l10-good')(c); } },
        { cap: `Steeper: 1 across, 3 up. ${T('m=3')}. The bigger the number, the steeper the line.`, run: async (c) => { await turn(deg(3))(c); await N(`steep: ${T('m=3')}`, 'u6l10-good')(c); } },
        { cap: `Straight up: the run is ${T('0')}, and you can’t divide by ${T('0')}. A vertical line has an <b>undefined</b> slope (not zero!).`, run: async (c) => { await turn(90)(c); await N(`vertical: <b>undefined</b>`)(c); } },
        { cap: `Keep turning: now the line <b>falls</b> left to right. ${T('m=-3')}: a <b>negative</b> slope, just as steep as ${T('3')}.`, run: async (c) => { await turn(180 + deg(-3))(c); await N(`falling: <b>negative</b>`, 'u6l10-bad')(c); } }
      ];
    }
    if (v === 'ex7') {
      const G = sqG(stage, 14, 30, { xmin: -7, xmax: 9, ymin: -5, ymax: 7 }, 29, { xlabels: 2, ylabels: 2, fontSize: 15 });
      const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Classify');
      const SEGS = [
        { n: ['A', 'B'], a: [-5, -3], b: [4, 3], pos: ['s', 'n'], color: GRN, kind: 'positive', why: 'rises left to right' },
        { n: ['C', 'D'], a: [-2, 6], b: [3, 6], pos: ['w', 'e'], color: INK, kind: 'zero', why: 'has the same y, so it is horizontal' },
        { n: ['E', 'F'], a: [7, -4], b: [7, 5], pos: ['e', 'e'], color: PUR, kind: 'undefined', why: 'has the same x, so it is vertical' }
      ];
      const steps = [{ cap: `${T('AB')}, ${T('CD')} and ${T('EF')}. Before calculating, look: which way does each one go?`,
        run: async (c) => { for (const s of SEGS) { await G.drawIn(G.segment(s.a, s.b, { color: BLUE, width: 4.5 }), 350, c); for (let i = 0; i < 2; i++) await G.reveal(npt(G, s.n[i], ...(i ? s.b : s.a), s.pos[i], { coords: true }), c, 120); } } }];
      SEGS.forEach((s) => {
        const sl = slopeOf(s.a, s.b), nm = s.n.join('');
        steps.push({ cap: `${T(nm)}: ${T(`m=${sl.sub}=${sl.run === 0 ? `\\dfrac{${sl.rise}}{0}` : frEq(sl.rise, sl.run)}`)}. It ${s.why}: <b>${s.kind}</b>.`,
          run: async (c) => {
            if (sl.run && sl.rise) await stair(G, { x: s.a[0], y: s.a[1], run: sl.run, rise: sl.rise }, { width: 3.5 }).show(c, 320);
            await say(c, P, `${T(`m_{${nm}}=${sl.run === 0 ? `\\dfrac{${sl.rise}}{0}` : frEq(sl.rise, sl.run)}`)} &nbsp;<b>${s.kind}</b>`, s.kind === 'positive' ? 'u6l10-good' : s.kind === 'undefined' ? 'u6l10-pu' : '');
          } });
      });
      steps.push({ cap: `Watch out: ${T('\\dfrac{0}{5}=0')} is a number (flat), but ${T('\\dfrac{9}{0}')} can’t be calculated (vertical). <b>Zero and undefined are not the same.</b>`,
        run: async (c) => { await say(c, P, `${T('\\dfrac{0}{5}=0')} ✓ &nbsp; ${T('\\dfrac{9}{0}')} ✗`, 'u6l10-rulebox'); } });
      return steps;
    }
    // Example 6
    const R = [-3, -2], Sp = [9, 4], s = slopeOf(R, Sp);
    const G = sqG(stage, 14, 60, { xmin: -6, xmax: 10, ymin: -3, ymax: 5 }, 28, { xlabels: 2, ylabels: 2, fontSize: 15 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'The slope formula');
    return [
      { cap: `Plot ${T('R(-3,\\ -2)')} and ${T('S(9,\\ 4)')}. It rises left to right, so expect a <b>positive</b> slope.`,
        run: async (c) => { await G.reveal(npt(G, 'R', -3, -2, 's', { coords: true }), c); await G.reveal(npt(G, 'S', 9, 4, 'n', { coords: true }), c); await G.drawIn(G.segment(R, Sp, { color: BLUE, width: 4.5 }), 600, c); } },
      { cap: `Run: ${T('9-(-3)=12')}. Rise: ${T('4-(-2)=6')}. Same order top and bottom: ${T('S')} minus ${T('R')}.`,
        run: async (c) => { await stair(G, { x: -3, y: -2, run: 12, rise: 6 }).show(c); } },
      { cap: `${T(`m=${s.all}`)}.`,
        run: async (c) => { for (const t of ['m=\\dfrac{y_2-y_1}{x_2-x_1}', `=${s.sub}`, '=\\dfrac{6}{12}=\\boldsymbol{\\dfrac{1}{2}}']) await say(c, P, T(t), 'u6l10-mline'); } },
      { cap: `The same ${T('\\tfrac12')} all along the segment: six steps of <b>2 right, 1 up</b>.`,
        run: async (c) => { for (let i = 0; i < 6; i++) { const st = stair(G, { x: -3 + 2 * i, y: -2 + i, run: 2, rise: 1 }, { width: 3, labels: false, fill: false }); await st.show(c, 110); } await say(c, P, 'Each step: 2 across, 1 up', 'u6l10-small'); } }
    ];
  }
};

/* =============================== 8. collinear =============================== */
const COL = {
  ex8: { label: 'Example 8 check', pts: [['X', -4, -2, 'e'], ['Y', 2, 8, 'w'], ['Z', 8, 18, 'w']], win: { xmin: -6, xmax: 10, ymin: -4, ymax: 20 }, unit: 17.5, lab: [2, 4] },
  bend: { label: 'A path that bends', pts: [['P', -3, -4, 'e'], ['Q', 1, 2, 'w'], ['R', 5, 7, 'w']], win: { xmin: -5, xmax: 7, ymin: -6, ymax: 9 }, unit: 28, lab: [2, 2] }
};
const collinear = {
  title: 'Collinear: the same slope through the shared point',
  height: 470,
  minW: 820,
  choices: Object.keys(COL).map((k) => ({ v: k, label: COL[k].label })),
  intro: 'Find the slope of each piece of the path. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = COL[k], [[n1, ...p1], [n2, ...p2], [n3, ...p3]] = d.pts.map(([n, x, y]) => [n, x, y]);
    const G = sqG(stage, 14, 7, d.win, d.unit, { xlabels: d.lab[0], ylabels: d.lab[1], fontSize: 15 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Slopes');
    const A = p1, B = p2, C = p3, s1 = slopeOf(A, B), s2 = slopeOf(B, C), same = s1.val === s2.val;
    let t1;
    return [
      { cap: `Plot ${T(PTX(n1, A))}, ${T(PTX(n2, B))} and ${T(PTX(n3, C))}. The middle point ${T(n2)} is shared by both pieces.`,
        run: async (c) => { for (const [n, x, y, pos] of d.pts) await G.reveal(npt(G, n, x, y, pos, { coords: true }), c, 200); } },
      { cap: `${T(n1 + n2)}: ${T(`m_{${n1}${n2}}=${s1.all}`)}.`,
        run: async (c) => { await G.drawIn(G.segment(A, B, { color: BLUE, width: 4 }), 400, c); t1 = stair(G, { x: A[0], y: A[1], run: s1.run, rise: s1.rise }); await t1.show(c, 320); await say(c, P, T(`m_{${n1}${n2}}=${s1.all}`), 'u6l10-mline'); } },
      { cap: `${T(n2 + n3)}: ${T(`m_{${n2}${n3}}=${s2.all}`)}.${same ? ' <b>The same slope.</b>' : ' <b>Different!</b>'}`,
        run: async (c) => { t1.dim(0.3); await G.drawIn(G.segment(B, C, { color: same ? BLUE : RED, width: 4 }), 400, c); await stair(G, { x: B[0], y: B[1], run: s2.run, rise: s2.rise }).show(c, 320); await say(c, P, T(`m_{${n2}${n3}}=${s2.all}`), same ? 'u6l10-mline u6l10-good' : 'u6l10-mline u6l10-bad'); } },
      same ? { cap: `Equal slopes <b>and</b> the shared point ${T(n2)}: one straight line passes through all three. ${T(n1)}, ${T(n2)} and ${T(n3)} are <b>collinear</b>.`,
        run: async (c) => { await G.drawIn(G.line(A, C, { color: GRN, width: 3, dash: '10 7' }), 800, c); await pstamp(c, P, 'collinear ✓', true); } }
        : { cap: `Different slopes, so the path <b>bends</b> at ${T(n2)}. No single straight line passes through all three: <b>not collinear</b>.`,
          run: async (c) => { await G.drawIn(G.line(A, B, { color: GRAY, width: 2.5, dash: '10 7' }), 800, c); await pstamp(c, P, 'not collinear', false); } }
    ];
  }
};

/* =============================== 9. parallel or perpendicular, from coordinates =============================== */
const PAIRS = {
  a: { label: 'Example 9(a) check', s1: ['A', [-6, -1], 'B', [2, 5], ['w', 'n']], s2: ['C', [-3, 4], 'D', [5, 10], ['w', 'n']], win: { xmin: -7, xmax: 6, ymin: -2, ymax: 11 }, unit: 32 },
  b: { label: 'Example 9(b) check', s1: ['E', [-2, 3], 'F', [4, -5], ['n', 'e']], s2: ['G', [1, -4], 'H', [9, 2], ['s', 'n']], win: { xmin: -3, xmax: 10, ymin: -6, ymax: 4 }, unit: 34 }
};
const pairs = {
  title: 'Compare the slopes: equal, or a product of −1?',
  height: 470,
  minW: 900,
  choices: Object.keys(PAIRS).map((k) => ({ v: k, label: PAIRS[k].label })),
  intro: 'Find both slopes. Equal: parallel. Product −1: perpendicular. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = PAIRS[k], [a1, A1, a2, A2, ap] = d.s1, [b1, B1, b2, B2, bp] = d.s2;
    const G = sqG(stage, 14, 8, d.win, d.unit, { xlabels: 2, ylabels: 2, fontSize: 15 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Slopes');
    const sa = slopeOf(A1, A2), sb = slopeOf(B1, B2), nA = a1 + a2, nB = b1 + b2;
    const isPar = sa.val === sb.val, isPerp = sa.rise * sb.rise === -sa.run * sb.run;
    let ta, tb;
    const steps = [
      { cap: `Plot ${T(nA)} and ${T(nB)}.`,
        run: async (c) => {
          await G.drawIn(G.segment(A1, A2, { color: BLUE, width: 4.5 }), 400, c); await G.drawIn(G.segment(B1, B2, { color: RED, width: 4.5 }), 400, c);
          for (const [n, p, pos] of [[a1, A1, ap[0]], [a2, A2, ap[1]], [b1, B1, bp[0]], [b2, B2, bp[1]]]) await G.reveal(npt(G, n, ...p, pos), c, 140);
        } },
      { cap: `${T(`m_{${nA}}=${sa.all}`)}.`,
        run: async (c) => { ta = stair(G, { x: A1[0], y: A1[1], run: sa.run, rise: sa.rise }); await ta.show(c, 320); await say(c, P, T(`m_{${nA}}=${sa.all}`), 'u6l10-mline u6l10-cblue'); } },
      { cap: `${T(`m_{${nB}}=${sb.all}`)}.`,
        run: async (c) => { ta.dim(0.3); tb = stair(G, { x: B1[0], y: B1[1], run: sb.run, rise: sb.rise }); await tb.show(c, 320); await say(c, P, T(`m_{${nB}}=${sb.all}`), 'u6l10-mline u6l10-cred'); } }
    ];
    if (isPar) steps.push({ cap: `${T(`m_{${nA}}=m_{${nB}}=${sa.val}`)}: equal slopes, so ${T(nA)} and ${T(nB)} are <b>parallel</b>. Make them longer: they never meet.`,
      run: async (c) => { ta.dim(0.25); tb.dim(0.25); await Promise.all([G.drawIn(G.line(A1, A2, { color: BLUE, width: 2, dash: '8 7' }), 800, c), G.drawIn(G.line(B1, B2, { color: RED, width: 2, dash: '8 7' }), 800, c)]); await say(c, P, `${T(`m_{${nA}}=m_{${nB}}`)}`, 'u6l10-rulebox'); await pstamp(c, P, 'parallel ✓', true); } });
    else {
      const X = meet(A1, A2, B1, B2);
      steps.push({ cap: `Not equal, so not parallel. Multiply: ${T(`${prodTex(sa.val, sb.val)}=${frac(sa.rise * sb.rise, sa.run * sb.run)}`)}. ${isPerp ? `Negative reciprocals: ${T(`${nA}\\perp ${nB}`)}, a <b>right angle</b>.` : '<b>Neither.</b>'}`,
        run: async (c) => {
          ta.dim(0.25); tb.dim(0.25);
          await say(c, P, T(`m_{${nA}}\\times m_{${nB}}=${prodTex(sa.val, sb.val)}=${frac(sa.rise * sb.rise, sa.run * sb.run)}`), 'u6l10-rulebox');
          if (isPerp) { const mk = rmark(G, X, A1, B2, 15); mk.style.opacity = 0; await appear(c, mk); }
          await pstamp(c, P, isPerp ? 'perpendicular ✓' : 'neither', isPerp ? true : false);
        } });
    }
    return steps;
  }
};

/* =============================== 10. Challenge 1: triangle PQR =============================== */
const triangle = {
  title: 'Challenge 1: a right triangle, three ways',
  height: 470,
  minW: 860,
  choices: [{ v: 'ch1', label: 'Challenge 1 check' }],
  intro: 'Triangle PQR: slopes, then lengths, then the midpoint of the hypotenuse. Press <b>Next</b>.',
  make(stage, v, ex) {
    const Pp = [-5, -3], Q = [3, 1], R = [-1, 9];
    const G = sqG(stage, 14, 8, { xmin: -7, xmax: 5, ymin: -5, ymax: 11 }, 26, { xlabels: 2, ylabels: 2, fontSize: 15 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Triangle PQR');
    let t1, t2;
    const bars = h('div', 'u6l10-bars');
    return [
      { cap: `Plot ${T('P(-5,\\ -3)')}, ${T('Q(3,\\ 1)')} and ${T('R(-1,\\ 9)')} and join them.`,
        run: async (c) => { for (const [n, p, pos] of [['P', Pp, 'w'], ['Q', Q, 'e'], ['R', R, 'w']]) await G.reveal(npt(G, n, ...p, pos), c, 200); await G.drawIn(G.polyline([Pp, Q, R, Pp], { color: BLUE, width: 4 }), 700, c); } },
      { cap: `(a) The two sides that meet at ${T('Q')}: ${T('m_{PQ}=\\dfrac{1-(-3)}{3-(-5)}=\\dfrac{4}{8}=\\dfrac12')} and ${T('m_{QR}=\\dfrac{9-1}{-1-3}=\\dfrac{8}{-4}=-2')}.`,
        run: async (c) => {
          t1 = stair(G, { x: -5, y: -3, run: 8, rise: 4 }, { width: 3.5 }); await t1.show(c, 300); await say(c, P, T('m_{PQ}=\\dfrac{4}{8}=\\dfrac12'), 'u6l10-mline');
          t1.dim(0.25); t2 = stair(G, { x: 3, y: 1, run: -4, rise: 8 }, { width: 3.5 }); await t2.show(c, 300); await say(c, P, T('m_{QR}=\\dfrac{8}{-4}=-2'), 'u6l10-mline');
        } },
      { cap: `Multiply: ${T('\\dfrac12\\times(-2)=-1')}. So ${T('PQ\\perp QR')}: the angle at ${T('Q')} is ${T('90^\\circ')}.`,
        run: async (c) => { t2.dim(0.25); const mk = rmark(G, Q, Pp, R, 16, RED); mk.style.opacity = 0; await appear(c, mk); await say(c, P, `${T('\\dfrac12\\times(-2)=-1')}: right angle at ${T('Q')}`, 'u6l10-good'); } },
      { cap: `(b) Lengths: ${T('PQ=\\sqrt{8^2+4^2}=\\sqrt{80}=4\\sqrt5')}, ${T('QR=\\sqrt{(-4)^2+8^2}=\\sqrt{80}=4\\sqrt5')}, ${T('PR=\\sqrt{4^2+12^2}=\\sqrt{160}=4\\sqrt{10}')}.`,
        run: async (c) => {
          t1.remove(); t2.remove();
          for (const s of ['PQ=\\sqrt{80}=4\\sqrt5', 'QR=\\sqrt{80}=4\\sqrt5', 'PR=\\sqrt{160}=4\\sqrt{10}']) await say(c, P, T(s), 'u6l10-mline');
          for (const [a, b] of [[Pp, Q], [Q, R]]) await appear(c, ticks(G, a, b, 1), 200);
        } },
      { cap: `Pythagoras check: the two legs’ squares add to the hypotenuse’s square. ${T('80+80=160')} ✓`,
        run: async (c) => {
          bars.innerHTML = `<div class="u6l10-barrow"><span class="u6l10-barlab">${T('PQ^2+QR^2')}</span><i class="u6l10-bar am" style="width:110px">80</i><i class="u6l10-bar am2" style="width:110px">80</i></div><div class="u6l10-barrow"><span class="u6l10-barlab">${T('PR^2')}</span><i class="u6l10-bar bl" style="width:220px">160</i></div>`;
          P.appendChild(bars); await fadeIn(c, bars, 400);
        } },
      { cap: `(c) The midpoint of the hypotenuse ${T('PR')}: ${T('M=\\left(\\dfrac{-5+(-1)}{2},\\ \\dfrac{-3+9}{2}\\right)=(-3,\\ 3)')}.`,
        run: async (c) => { await G.reveal(G.point(-3, 3, { color: MID, r: 8, label: T('M(-3,\\ 3)'), pos: 'w' }), c); await say(c, P, T('M=\\boldsymbol{(-3,\\ 3)}'), 'u6l10-mline u6l10-good'); } }
    ];
  }
};

/* =============================== Challenge 3: slide K until JK ∥ LM =============================== */
const dialQ = {
  title: 'Challenge 3: find q, then the length',
  height: 470,
  minW: 820,
  choices: [{ v: 'ch3', label: 'Challenge 3 check' }],
  intro: `${T('LM')} is fixed. ${T('K(2,\\ q)')} can slide up and down the line ${T('x=2')}. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const J = [-4, -1], L = [-3, 5], M = [3, -4], st = { q: 3 }, TO = -10;
    const G = sqG(stage, 14, 8, { xmin: -6, xmax: 5, ymin: -12, ymax: 7 }, 22, { xlabels: 2, ylabels: 2, fontSize: 15 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Find ' + T('q'));
    const sLM = slopeOf(L, M);
    const ro = h('div', 'u6l10-kro');
    const fmt = (v2) => String(Math.round(v2 * 10) / 10).replace('-', '−');
    const setRo = () => { const qq = Math.round(st.q * 10) / 10; ro.innerHTML = `<div>${T('q')} = <b>${fmt(st.q)}</b></div><div class="u6l10-muted">${T('m_{JK}=\\dfrac{q+1}{6}')} ≈ ${fmt((qq + 1) / 6 * 100 / 100)}</div>`; };
    let JK, Kp;
    return [
      { cap: `${T('LM')}: ${T(`m_{LM}=${sLM.all}`)}.`,
        run: async (c) => {
          await G.drawIn(G.segment(L, M, { color: BLUE, width: 4.5 }), 500, c); await G.reveal(npt(G, 'L', ...L, 'w', { coords: true }), c, 150); await G.reveal(npt(G, 'M', ...M, 'e', { coords: true }), c, 150);
          await stair(G, { x: L[0], y: L[1], run: 6, rise: -9 }).show(c, 320); await say(c, P, T(`m_{LM}=${sLM.all}`), 'u6l10-mline u6l10-cblue');
        } },
      { cap: `${T('J(-4,\\ -1)')} is fixed. Try ${T('q=3')}: ${T('m_{JK}=\\dfrac{3-(-1)}{2-(-4)}=\\dfrac{4}{6}')}. It rises, but ${T('LM')} falls: not parallel.`,
        run: async (c) => {
          await G.drawIn(G.vline(2, { color: 'gray', width: 2 }), 400, c);
          JK = G.curve(() => ({ subs: [[G.toPx(...J), G.toPx(2, st.q)]] }), { color: RED, width: 4.5 }, 'u6l10-jk', G.layers.data);
          await G.reveal(npt(G, 'J', ...J, 'n', { coords: true }), c, 150);
          Kp = G.point(2, st.q, { color: RED, r: 8, label: T('K(2,\\ q)'), pos: 'e' }); await G.reveal(Kp, c); await G.drawIn(JK, 400, c);
          setRo(); P.appendChild(ro); await fadeIn(c, ro);
        } },
      { cap: `Slide ${T('K')} down… ${T('JK')} lines up with ${T('LM')} when ${T('q=-10')}: then ${T('m_{JK}=\\dfrac{-9}{6}=-\\dfrac32')}, the same slope.`,
        run: async (c) => {
          const q0 = st.q;
          await tween(c, 2200, (t) => { st.q = q0 + (TO - q0) * t; JK._bkDraw(); G.moveTo(Kp, 2, st.q); setRo(); });
          st.q = TO; JK._bkDraw(); G.moveTo(Kp, 2, TO); setRo();
          await Promise.all([G.drawIn(G.line(J, [2, TO], { color: RED, width: 2, dash: '8 7' }), 700, c), G.drawIn(G.line(L, M, { color: BLUE, width: 2, dash: '8 7' }), 700, c)]);
          const s = stamp(stage, 'parallel', { ok: true, x: G.W / 2 + 40, y: 420 }); await stampIn(c, s);
        } },
      { cap: `With algebra: parallel means equal slopes. ${T('\\dfrac{q+1}{6}=-\\dfrac32')}, so ${T('2(q+1)=-18')}, ${T('q+1=-9')}, ${T('q=-10')}.`,
        run: async (c) => { for (const s of ['\\dfrac{q-(-1)}{2-(-4)}=\\dfrac{q+1}{6}=-\\dfrac{3}{2}', '2(q+1)=-18\\ \\Rightarrow\\ q+1=-9', 'q=-10']) await say(c, P, T(s), s === 'q=-10' ? 'u6l10-mline u6l10-good' : 'u6l10-mline'); } },
      { cap: `(b) ${T('K(2,\\ -10)')}: run ${T('6')}, rise ${T('-9')}. ${T('JK=\\sqrt{6^2+(-9)^2}=\\sqrt{117}=\\sqrt9\\cdot\\sqrt{13}=3\\sqrt{13}')} units (about ${T('10.8')}).`,
        run: async (c) => { await stair(G, { x: J[0], y: J[1], run: 6, rise: -9 }, { risePos: 'w' }).show(c, 320); await say(c, P, T('JK=\\sqrt{36+81}=\\sqrt{117}=\\boldsymbol{3\\sqrt{13}}'), 'u6l10-mline u6l10-good'); } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const g2 = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const red = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = g2(n, d); return [n / g, d / g]; };
  const fr = (n, d) => { const [a, b] = red(n, d); return b === 1 ? String(a) : (a < 0 ? '-' : '') + '\\dfrac{' + Math.abs(a) + '}{' + b + '}'; };
  const pr = (v) => (v < 0 ? '(' + v + ')' : String(v));
  const P = (n, p) => n + '(' + p[0] + ',\\ ' + p[1] + ')';
  const times = (a, b) => a + '\\times' + (b.startsWith('-') ? '\\left(' + b + '\\right)' : b);
  const mSteps = (nm, A, B) => { const dy = B[1] - A[1], dx = B[0] - A[0], raw = '\\dfrac{' + dy + '}{' + dx + '}', v = fr(dy, dx); return 'm_{' + nm + '}=\\dfrac{' + B[1] + '-' + pr(A[1]) + '}{' + B[0] + '-' + pr(A[0]) + '}=' + raw + (raw === v ? '' : '=' + v); };
  function simp(N) { let k = 1, m = N; for (let q = 2; q * q <= m; q++) while (m % (q * q) === 0) { m /= q * q; k *= q; } return { k, m }; }
  const rootSteps = (N) => { const { k, m } = simp(N); if (m === 1) return '\\sqrt{' + N + '}=' + k; if (k === 1) return '\\sqrt{' + N + '}\\approx' + Math.sqrt(N).toFixed(1); return '\\sqrt{' + N + '}=\\sqrt{' + k * k + '}\\cdot\\sqrt{' + m + '}=' + k + '\\sqrt{' + m + '}\\approx' + Math.sqrt(N).toFixed(1); };
  const NAMES = [['A', 'B'], ['C', 'D'], ['P', 'Q'], ['E', 'F'], ['G', 'H'], ['R', 'S']];
  const pt = (r, lo, hi) => [r.int(lo, hi), r.int(lo, hi)];
  const neg = (pts) => pts.some((p) => p[0] < 0 || p[1] < 0);
  const SL = []; for (let q = 1; q <= 5; q++) for (let p = -5; p <= 5; p++) if (p && g2(p, q) === 1) SL.push([p, q]);
  // Beginning: one tool, one step
  const begHV = (r) => {
    for (;;) {
      const hz = r.chance(0.5), a = r.int(-9, 9), b = r.int(-9, 9), c = r.int(-8, 8); if (a === b || (a >= 0 && b >= 0 && c >= 0)) continue;
      const [n1, n2] = r.pick(NAMES), A = hz ? [a, c] : [c, a], B = hz ? [b, c] : [c, b];
      return { text: `Find the length of the ${hz ? 'horizontal' : 'vertical'} segment <i>${n1 + n2}</i>.`, q: P(n1, A) + '\\qquad ' + P(n2, B),
        a: [(hz ? '|x_2-x_1|=|' + b + '-' + pr(a) + '|' : '|y_2-y_1|=|' + b + '-' + pr(a) + '|') + '=|' + (b - a) + '|=' + Math.abs(b - a) + '\\text{ units}'] };
    }
  };
  const begMid = (r) => {
    for (;;) {
      const A = pt(r, -10, 10), B = pt(r, -10, 10);
      if ((A[0] + B[0]) % 2 || (A[1] + B[1]) % 2 || A[0] === B[0] || A[1] === B[1] || !neg([A, B])) continue;
      const [n1, n2] = r.pick(NAMES);
      return { text: `Find the midpoint <i>M</i> of <i>${n1 + n2}</i>.`, q: P(n1, A) + '\\qquad ' + P(n2, B),
        a: ['M\\left(\\dfrac{' + A[0] + '+' + pr(B[0]) + '}{2},\\ \\dfrac{' + A[1] + '+' + pr(B[1]) + '}{2}\\right)=' + P('M', [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2])] };
    }
  };
  const begSlope = (r) => {
    for (;;) {
      const A = pt(r, -9, 9), B = pt(r, -9, 9); if (A[0] === B[0] || A[1] === B[1] || !neg([A, B])) continue;
      const [n1, n2] = r.pick(NAMES);
      return { text: `Find the slope of <i>${n1 + n2}</i>, in lowest terms. Is it positive or negative?`, q: P(n1, A) + '\\qquad ' + P(n2, B),
        a: [mSteps(n1 + n2, A, B), (B[1] - A[1]) * (B[0] - A[0]) > 0 ? '\\text{positive (rises left to right)}' : '\\text{negative (falls left to right)}'] };
    }
  };
  // Progressing: two steps
  const prgDist = (r) => {
    for (;;) {
      const A = pt(r, -8, 8), dx = r.int(1, 8) * r.sign(), dy = r.int(1, 8) * r.sign(), B = [A[0] + dx, A[1] + dy], N = dx * dx + dy * dy;
      if (Math.abs(B[0]) > 10 || Math.abs(B[1]) > 10 || !neg([A, B]) || N < 10) continue;
      const [n1, n2] = r.pick(NAMES);
      return { text: `Find the <b>exact</b> distance between <i>${n1}</i> and <i>${n2}</i> (a whole number or a simplified mixed radical).`, q: P(n1, A) + '\\qquad ' + P(n2, B),
        a: ['d=\\sqrt{(' + B[0] + '-' + pr(A[0]) + ')^2+(' + B[1] + '-' + pr(A[1]) + ')^2}=\\sqrt{' + pr(dx) + '^2+' + pr(dy) + '^2}=\\sqrt{' + dx * dx + '+' + dy * dy + '}', '=' + rootSteps(N)] };
    }
  };
  const prgEnd = (r) => {
    for (;;) {
      const E = pt(r, -8, 8), M = pt(r, -7, 7), F = [2 * M[0] - E[0], 2 * M[1] - E[1]];
      if (E[0] === M[0] || E[1] === M[1] || Math.abs(F[0]) > 15 || Math.abs(F[1]) > 15 || !neg([E, M])) continue;
      const [n1, n2] = r.pick(NAMES);
      return { text: `<i>M</i> is the midpoint of <i>${n1 + n2}</i>. Find the coordinates of <i>${n2}</i>.`, q: P(n1, E) + '\\qquad ' + P('M', M),
        a: ['x=2(' + M[0] + ')-' + pr(E[0]) + '=' + F[0] + ',\\quad y=2(' + M[1] + ')-' + pr(E[1]) + '=' + F[1], P(n2, F)] };
    }
  };
  const prgCol = (r) => {
    for (;;) {
      const [p, q] = r.pick(SL), k1 = r.int(1, 2), k2 = r.int(1, 2), X = pt(r, -8, 4), Y = [X[0] + q * k1, X[1] + p * k1], Z = [Y[0] + q * k2, Y[1] + p * k2], on = r.chance(0.55);
      if (!on) Z[1] += r.pick([-1, 1]);
      if ([Y, Z].some((v) => Math.abs(v[0]) > 12 || Math.abs(v[1]) > 12) || !neg([X, Y, Z])) continue;
      const [a, b, c] = r.pick([['X', 'Y', 'Z'], ['A', 'B', 'C'], ['P', 'Q', 'R']]);
      return { text: `Are <i>${a}</i>, <i>${b}</i> and <i>${c}</i> collinear? Use slopes.`, q: P(a, X) + '\\quad ' + P(b, Y) + '\\quad ' + P(c, Z),
        a: [mSteps(a + b, X, Y), mSteps(b + c, Y, Z), on ? '\\text{equal, and they share } ' + b + ':\\ \\textbf{collinear}' : '\\text{different slopes: }\\textbf{not collinear}'] };
    }
  };
  // Mastery: several tools at once
  const masPair = (r) => {
    for (;;) {
      const [p, q] = r.pick(SL), kind = r.pick(['par', 'perp', 'perp', 'nei']);
      let [p2, q2] = kind === 'par' ? [p, q] : kind === 'perp' ? [-q, p] : r.pick([[q, p], [-p, q], [p + r.sign(), q]]);
      if (p2 === 0 || (kind === 'nei' && (p2 * q === p * q2 || p * p2 === -q * q2))) continue;
      if (q2 < 0) { p2 = -p2; q2 = -q2; }
      const k1 = r.int(1, 2) * r.sign(), k2 = r.int(1, 2) * r.sign(), G = pt(r, -7, 7), J = pt(r, -7, 7), H = [G[0] + q * k1, G[1] + p * k1], K = [J[0] + q2 * k2, J[1] + p2 * k2];
      if ([H, K].some((v) => Math.abs(v[0]) > 12 || Math.abs(v[1]) > 12) || !neg([G, H, J, K])) continue;
      const s1 = fr(H[1] - G[1], H[0] - G[0]), s2 = fr(K[1] - J[1], K[0] - J[0]);
      const verdict = kind === 'par' ? '\\text{equal slopes: }\\textbf{parallel}' : kind === 'perp' ? times(s1, s2) + '=-1:\\ \\textbf{perpendicular}' : times(s1, s2) + '=' + fr(p * p2, q * q2) + '\\ne-1:\\ \\textbf{neither}';
      return { text: '<i>GH</i> and <i>JK</i>: parallel, perpendicular, or neither? Show both slopes.', q: P('G', G) + ',\\ ' + P('H', H) + '\\qquad ' + P('J', J) + ',\\ ' + P('K', K),
        a: [mSteps('GH', G, H), mSteps('JK', J, K), verdict] };
    }
  };
  const masRight = (r) => { // a right triangle: show the right angle with slopes, then the lengths
    for (;;) {
      const [p, q] = r.pick(SL), k1 = r.int(1, 2), k2 = r.int(1, 2), Q = pt(r, -4, 4), Pp = [Q[0] - q * k1, Q[1] - p * k1], R = [Q[0] - p * k2, Q[1] + q * k2];
      if ([Pp, R].some((v) => Math.abs(v[0]) > 10 || Math.abs(v[1]) > 10) || !neg([Pp, Q, R])) continue;
      const len = (A, B) => { const dx = B[0] - A[0], dy = B[1] - A[1]; return dx * dx + dy * dy; };
      const sq = (N) => { const { k, m } = simp(N); return m === 1 ? String(k) : (k === 1 ? '\\sqrt{' + N + '}' : k + '\\sqrt{' + m + '}'); };
      const s1 = fr(Q[1] - Pp[1], Q[0] - Pp[0]), s2 = fr(R[1] - Q[1], R[0] - Q[0]);
      return { text: 'Triangle <i>PQR</i>. (a) Use slopes to show the right angle is at <i>Q</i>. (b) Find the exact length of each leg, <i>PQ</i> and <i>QR</i>.', q: P('P', Pp) + '\\quad ' + P('Q', Q) + '\\quad ' + P('R', R),
        a: [mSteps('PQ', Pp, Q) + ',\\quad ' + mSteps('QR', Q, R), times(s1, s2) + '=-1:\\ \\text{right angle at } Q', 'PQ=\\sqrt{' + len(Pp, Q) + '}' + (sq(len(Pp, Q)) === '\\sqrt{' + len(Pp, Q) + '}' ? '' : '=' + sq(len(Pp, Q))) + ',\\quad QR=\\sqrt{' + len(Q, R) + '}' + (sq(len(Q, R)) === '\\sqrt{' + len(Q, R) + '}' ? '' : '=' + sq(len(Q, R)))] };
    }
  };
  const masEnd = (r) => { // midpoint and missing endpoint in a story
    for (;;) {
      const A = pt(r, 0, 12), M = pt(r, 2, 12), B = [2 * M[0] - A[0], 2 * M[1] - A[1]];
      if (A[0] === M[0] || A[1] === M[1] || B[0] < 0 || B[1] < 0 || B[0] > 24 || B[1] > 24) continue;
      return { text: `On a park map (1 unit = 10 m), a bench at <i>M</i> is exactly halfway between the gate <i>G</i> and the fountain <i>F</i>. Find <i>F</i>, then how far east or west and north or south the fountain is from the gate.`, q: P('G', A) + '\\qquad ' + P('M', M),
        a: ['F=(2(' + M[0] + ')-' + pr(A[0]) + ',\\ 2(' + M[1] + ')-' + pr(A[1]) + ')=' + P('F', B).slice(1), '\\text{' + Math.abs(B[0] - A[0]) * 10 + ' m ' + (B[0] > A[0] ? 'east' : 'west') + ', ' + Math.abs(B[1] - A[1]) * 10 + ' m ' + (B[1] > A[1] ? 'north' : 'south') + '}'] };
    }
  };
  standup('u6l10', {
    intro: 'Pick the right tool (length, midpoint or slope) and show every step at your whiteboard station.',
    levels: {
      BEG: (r) => r.pick([begHV, begMid, begSlope])(r),
      PRG: (r) => r.pick([prgDist, prgEnd, prgCol])(r),
      MAS: (r) => r.pick([masPair, masRight, masEnd])(r)
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountShape();
mountMinis();
mountFigures();
export const explainers = mountExplainers({ whichTool, pyth, lengths, midpoint, slopes, collinear, pairs, triangle, dialQ });
export const _test = { analyse, QUADS, frac, rad, slopeOf };
void drawIn; void col;
