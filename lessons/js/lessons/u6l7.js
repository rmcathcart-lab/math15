/* Math 15 · Unit 6 · Lesson 7 — Types of Slope: Positive, Negative, Zero, and Undefined.
 * Warm-up: "Level 1: The Runner" (tap a piece to count it; Run! colours every piece by its type).
 * Explainers:
 *   signs     (read left to right, count run and rise with signs: same signs → positive, opposite → negative; Ex 1, Ex 2 checks)
 *   mirror    (flip a rising segment top to bottom: the run stays, the rise changes sign; Example 2(c))
 *   zeroCase  (flatten the rise to 0 → slope 0; squeeze the run to 0 → undefined)
 *   divZero   (why we can't divide by 0: groups and the multiplication check — 6 ÷ 3, 0 ÷ 4, 4 ÷ 0)
 *   flatWall  (Examples 3 and 4: any two points give 0 / undefined, a sliding point, y = k and x = k)
 *   walk      (a hiker walks four lines left to right; the Runner level sorted into the four types)
 *   dial      (one line turns: zero → positive → undefined → negative → zero; and near-vertical slopes)
 *   ex5       (Example 5 check: the rise / run / slope / type table, and why TU can't be y = mx + b)
 * Built from Math 10C u6l2 (SlopeTri, countLeg, walker, zeroCase, the four-kinds tiles), trimmed to the Math 15 booklet.
 * Colours: run amber (horizontal), rise purple (vertical), segments blue; positive green, negative red, zero blue,
 * undefined purple. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  pairTex, texNum, svgEl, liveCtx, pulse, shake, place, arrowHead, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RUN = COLORS.amber, RISE = COLORS.purple, SEG = COLORS.blue, POS = COLORS.green, NEG = COLORS.red, INK = COLORS.ink;
const ZERO = '#1f5bd6', UND = '#7b4fc4';
const cR = (s) => `\\textcolor{${RISE}}{${s}}`, cU = (s) => `\\textcolor{${RUN}}{${s}}`;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** reduced [n, d] with d > 0 (integers) */
const red = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
/** TeX of a reduced fraction (sign in front), whole numbers plain */
const fr = (n, d, big) => { const [a, b] = red(n, d); if (b === 1) return String(a); return (a < 0 ? '-' : '') + `\\${big ? 'd' : 't'}frac{${Math.abs(a)}}{${b}}`; };
const rawFr = (r, u) => `\\dfrac{${cR(texNum(r))}}{${cU(texNum(u))}}`;
/** slope TeX: rise/run = reduced (only when it reduces) */
const slopeTex = (r, u) => { const raw = rawFr(r, u), [a, b] = red(r, u); return a === r && b === u ? raw : `${raw}=${fr(r, u, true)}`; };
const par = (v) => (v < 0 ? `(${v})` : String(v));
/** the formula with the numbers in: (y2 − y1)/(x2 − x1) for P → Q */
const subTex = (P, Q, big = true) => `\\${big ? 'd' : 't'}frac{${Q[1]}-${par(P[1])}}{${Q[0]}-${par(P[0])}}`;
const n = (v) => texNum(v).replace('-', '−'); // plain-text number with a real minus
const one = (v) => n(Math.round(v * 10) / 10);
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u6l7-panel ' + cls, title ? `<div class="u6l7-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l7-line ' + cls, html); p.appendChild(d); return d; };
const UNDW = '<b class="u6l7-und">undefined</b>';
const typeOf = (rise, run) => (run === 0 ? 'und' : rise === 0 ? 'zero' : rise * run > 0 ? 'pos' : 'neg');
const TYPEW = { pos: '<b class="u6l7-pos">positive</b>', neg: '<b class="u6l7-neg">negative</b>', zero: '<b class="u6l7-zero">zero</b>', und: UNDW };
const TYPEC = { pos: POS, neg: NEG, zero: ZERO, und: UND };
const plainGrid = (host, o = {}) => new Graph(host, Object.assign({ x: 14, y: 14, width: 440, height: 440, xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5, xlabels: 1, ylabels: 1, fontSize: 14 }, o));

/* ---------------------------------------------------------------------------------------------------------------
 * Slope triangle on a Graph (from Math 10C u6l2): run leg (amber) from (x, y) across, then rise leg (purple) up/down.
 * s = { x, y, run, rise }. Labels sit outside the triangle. Kept in sync on redraw via G.track.
 * ------------------------------------------------------------------------------------------------------------- */
class SlopeTri {
  constructor(G, s, o = {}) {
    this.G = G; this.s = Object.assign({}, s); this.o = o;
    const L = o.layer || G.layers.data, w = o.w || 5;
    this.g = svgEl('g', { class: 'u6l7-tri' }, L);
    this.fill = svgEl('path', { fill: o.fill || SEG, 'fill-opacity': o.fillOp ?? 0.1, stroke: 'none' }, this.g);
    this.mark = svgEl('path', { fill: 'none', stroke: INK, 'stroke-width': 1.6 }, this.g);
    this.runP = svgEl('path', { class: 'bk-stroke', stroke: RUN, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.riseP = svgEl('path', { class: 'bk-stroke', stroke: RISE, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.lRun = o.labels === false ? null : h('div', 'bk-lab u6l7-tlab u6l7-trun');
    this.lRise = o.labels === false ? null : h('div', 'bk-lab u6l7-tlab u6l7-trise');
    if (this.lRun) G.html.append(this.lRun, this.lRise);
    G.track(this.g, () => this.draw());
  }
  text(kind, v) {
    const exact = Math.abs(v - Math.round(v)) < 1e-6;
    return `<b>${kind}</b> ${exact ? n(Math.round(v)) : one(v)}`;
  }
  draw() {
    const G = this.G, { x, y, run, rise } = this.s;
    const P = G.toPx(x, y), C = G.toPx(x + run, y), Q = G.toPx(x + run, y + rise);
    const d = (a, b) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    this.fill.setAttribute('d', `M${P[0]} ${P[1]} L${C[0]} ${C[1]} L${Q[0]} ${Q[1]} Z`);
    this.runP.setAttribute('d', d(P, C)); this.riseP.setAttribute('d', d(C, Q));
    this.runP.style.display = Math.abs(run) < 1e-9 ? 'none' : ''; this.riseP.style.display = Math.abs(rise) < 1e-9 ? 'none' : '';
    const sx = Math.sign(P[0] - C[0]), sy = Math.sign(Q[1] - C[1]), k = 11;
    this.mark.setAttribute('d', Math.abs(C[0] - P[0]) > 2 * k && Math.abs(Q[1] - C[1]) > 2 * k ? `M${C[0] + sx * k} ${C[1]} L${C[0] + sx * k} ${C[1] + sy * k} L${C[0]} ${C[1] + sy * k}` : '');
    if (!this.lRun) return;
    this.lRun.innerHTML = this.text('run', run); this.lRise.innerHTML = this.text('rise', rise);
    const gap = this.o.gap ?? 6;
    place(this.lRun, (P[0] + C[0]) / 2, P[1], this.o.runSide || (rise >= 0 ? 's' : 'n'), gap);
    place(this.lRise, C[0], (C[1] + Q[1]) / 2, this.o.riseSide || (run >= 0 ? 'e' : 'w'), gap + 2);
    this.lRun.style.visibility = Math.abs(run) < 1e-9 && !this.o.showZero ? 'hidden' : '';
    this.lRise.style.visibility = Math.abs(rise) < 1e-9 && !this.o.showZero ? 'hidden' : '';
  }
  set(s) { Object.assign(this.s, s); this.draw(); return this; }
  to(c, s, ms = 900) { const a = Object.assign({}, this.s); return tween(c, ms, (t) => { const o = {}; for (const k in s) o[k] = a[k] + (s[k] - a[k]) * t; this.set(o); }); }
  /** run leg, then rise leg, then labels */
  async drawIn(c, ms = 500) {
    const [lr, ls] = [this.lRun, this.lRise]; this.fill.style.opacity = 0; hide(lr); hide(ls);
    await drawIn(this.runP, ms, c); if (lr) await fadeIn(c, lr, 220);
    await drawIn(this.riseP, ms, c); if (ls) await fadeIn(c, ls, 220);
    await appear(c, this.fill, 250);
  }
  remove() { this.G.remove(this.g); this.lRun && this.lRun.remove(); this.lRise && this.lRise.remove(); }
  ghost() { this.g.style.opacity = 0.28; if (this.lRun) { this.lRun.remove(); this.lRise.remove(); this.lRun = this.lRise = null; } }
}

/** count a leg square by square: from (x, y) along axis 'x' or 'y' for v units (signed); unit pieces + count bubbles */
async function countLeg(c, G, x, y, axis, v, o = {}) {
  const els = [], s = Math.sign(v), N = Math.abs(v), color = axis === 'x' ? RUN : RISE, ms = o.ms || 240;
  for (let k = 0; k < N; k++) {
    const a = axis === 'x' ? [x + s * k, y] : [x, y + s * k], b = axis === 'x' ? [x + s * (k + 1), y] : [x, y + s * (k + 1)];
    const seg = G.segment(a, b, { color, width: 5.5 }); els.push(seg);
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], lab = (s < 0 ? '−' : '') + (k + 1);
    const pos = axis === 'x' ? (o.side || 's') : (o.side || 'e');
    const bub = G.label(mid[0], mid[1], lab, { pos, cls: 'u6l7-bub ' + (axis === 'x' ? 'u6l7-bub-run' : 'u6l7-bub-rise'), gap: 6 });
    els.push(bub); hide(bub);
    await drawIn(seg, ms, c); await pop(c, bub, 180); bub.style.opacity = 1;
  }
  return els;
}

/** a direction arrow drawn beside a segment, from its left end to its right end, with a word ("rises" / "falls") */
function dirArrow(G, A, B, color, word) {
  const [L, R] = A[0] <= B[0] ? [A, B] : [B, A];
  const p = G.toPx(L[0], L[1]), q = G.toPx(R[0], R[1]), dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len, fl = uy > 0 ? -1 : 1, nx = uy * fl, ny = -ux * fl, off = 26; // the side away from the slope triangle
  const a = [p[0] + nx * off + ux * len * 0.18, p[1] + ny * off + uy * len * 0.18], b = [p[0] + nx * off + ux * len * 0.82, p[1] + ny * off + uy * len * 0.82];
  const g = svgEl('g', {}, G.layers.top);
  const path = svgEl('path', { class: 'bk-stroke', d: `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, g);
  const head = arrowHead(g, b[0] + ux * 6, b[1] + uy * 6, ux, uy, { color, width: 4 });
  const lab = h('div', 'bk-lab u6l7-dirw', word); lab.style.color = color; G.html.appendChild(lab);
  place(lab, (a[0] + b[0]) / 2 + nx * 8, (a[1] + b[1]) / 2 + ny * 8, (ny < 0 ? 'n' : 's') + (nx < 0 ? 'w' : 'e'), 4);
  hide(head); hide(lab);
  return { g, path, head, lab, async play(c) { await drawIn(path, 600, c); await pop(c, head, 200); head.style.opacity = 1; await pop(c, lab, 260); lab.style.opacity = 1; }, remove() { g.remove(); lab.remove(); } };
}

/* ================================== warm-up: Level 1, the Runner ================================== */
const LV = {
  path: [[0, 1], [3, 1], [6, 3], [6, 6], [9, 6], [13, 3], [13, 1], [16, 0], [19, 3]],
  tags: { A: [1.5, 1.75], B: [3.95, 2.75], C: [5.2, 4.5], D: [7.5, 6.75], E: [11.6, 5.3], F: [13.8, 2.2], G: [14.9, 1.35], H: [17.0, 2.4] }
};
const LV_PIECES = 'ABCDEFGH'.split('').map((k, i) => {
  const a = LV.path[i], b = LV.path[i + 1], up = b[1] - a[1], across = b[0] - a[0];
  const type = across === 0 ? 'und' : up === 0 ? 'zero' : up > 0 ? 'pos' : 'neg';
  return { k, a, b, up, across, type, word: { pos: 'uphill', neg: 'downhill', zero: 'flat', und: 'wall' }[type] };
});
/** draws the level into an <svg> at unit U px; returns { px, py, pieces: { k: path }, tags: { k: el }, runner } */
function drawLevel(wrap, U, o = {}) {
  const pad = 10, W = 19 * U + 2 * pad, H = 8 * U + 2 * pad;
  const px = (x) => pad + x * U, py = (y) => pad + (7 - y) * U;
  const sv = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u6l7-lvsvg' }, wrap);
  svgEl('rect', { x: px(0), y: py(7), width: 19 * U, height: 8 * U, fill: '#e8f0fc' }, sv);
  const grid = (stroke, w) => { const g = svgEl('g', { stroke, 'stroke-width': w }, sv); for (let x = 0; x <= 19; x++) svgEl('line', { x1: px(x), x2: px(x), y1: py(-1), y2: py(7) }, g); for (let y = -1; y <= 7; y++) svgEl('line', { x1: px(0), x2: px(19), y1: py(y), y2: py(y) }, g); return g; };
  grid('#fff', 1.2);
  const ground = LV.path.map(([x, y]) => `${px(x)},${py(y)}`).join(' ') + ` ${px(19)},${py(-1)} ${px(0)},${py(-1)}`;
  const id = 'u6l7clip' + Math.floor(Math.random() * 1e6);
  const cp = svgEl('clipPath', { id }, svgEl('defs', {}, sv)); svgEl('polygon', { points: ground }, cp);
  const gg = svgEl('g', { 'clip-path': `url(#${id})` }, sv);
  svgEl('rect', { x: px(0), y: py(7), width: 19 * U, height: 8 * U, fill: '#ffecb3' }, gg);
  const g2 = grid('rgba(200,140,20,.45)', 1); gg.appendChild(g2);
  const pieces = {}, tags = {};
  const lay = svgEl('g', {}, sv);
  LV_PIECES.forEach((p) => {
    pieces[p.k] = svgEl('path', { d: `M${px(p.a[0])} ${py(p.a[1])} L${px(p.b[0])} ${py(p.b[1])}`, stroke: '#1e2d46', 'stroke-width': U / 10, 'stroke-linecap': 'round', fill: 'none', class: 'u6l7-lvpiece' }, lay);
  });
  LV.path.forEach(([x, y]) => svgEl('circle', { cx: px(x), cy: py(y), r: U / 8.5, fill: '#1e2d46' }, lay));
  // finish flag
  svgEl('line', { x1: px(19), x2: px(19), y1: py(3), y2: py(5.3), stroke: '#1e2d46', 'stroke-width': 2.5 }, sv);
  svgEl('path', { d: `M${px(19)} ${py(5.3)} L${px(18)} ${py(4.95)} L${px(19)} ${py(4.6)} Z`, fill: '#d23c32' }, sv);
  const html = h('div', 'bk-html'); wrap.appendChild(html);
  const fin = h('div', 'bk-lab u6l7-lvfin', 'FINISH'); html.appendChild(fin); place(fin, px(18.6), py(5.35), 'n', 2);
  if (o.arrow !== false) {
    const ag = svgEl('g', {}, sv);
    svgEl('line', { x1: px(0.3), x2: px(3.2), y1: py(4), y2: py(4), stroke: '#d23c32', 'stroke-width': 3 }, ag);
    arrowHead(ag, px(3.45), py(4), 1, 0, { color: '#d23c32', width: 3 });
    const tw = h('div', 'bk-lab u6l7-lvway', 'this way'); html.appendChild(tw); place(tw, px(1.8), py(4), 'n', 4);
  }
  LV_PIECES.forEach((p) => {
    const [x, y] = LV.tags[p.k];
    const t = h(o.tap ? 'button' : 'div', 'u6l7-lvtag', p.k); if (o.tap) { t.type = 'button'; t.dataset.k = p.k; }
    t.style.width = t.style.height = Math.round(U * 0.95) + 'px'; t.style.fontSize = Math.round(U * 0.62) + 'px';
    html.appendChild(t); place(t, px(x), py(y), 'c'); tags[p.k] = t;
  });
  // the runner (stick figure), feet at the origin of its group
  const rg = svgEl('g', { class: 'u6l7-runner' }, sv), s = U / 24;
  const body = svgEl('g', { transform: `scale(${s})` }, rg);
  svgEl('circle', { cx: 0, cy: -37, r: 5, fill: '#1e2d46' }, body);
  svgEl('path', { d: 'M0 -32 L1 -17 M1 -17 L7 -8 L5 0 M1 -17 L-5 -9 L-10 -6 M0 -27 L7 -23 L11 -27 M0 -27 L-6 -24', stroke: '#1e2d46', 'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' }, body);
  const runner = { g: rg, at(x, y) { rg.setAttribute('transform', `translate(${px(x)} ${py(y)})`); } };
  runner.at(0.55, 1);
  return { sv, html, px, py, pieces, tags, runner, W, H };
}
function mountLevel() {
  const host = document.getElementById('u6l7-level'); if (!host) return;
  const U = 30, wrap = h('div', 'u6l7-lvwrap'); host.appendChild(wrap);
  const L = drawLevel(wrap, U, { tap: true }); box(wrap, L.W, L.H);
  const read = document.getElementById('u6l7-lvread');
  let extra = [], running = false;
  const clearExtra = () => { extra.forEach((e) => e.remove()); extra = []; Object.values(L.tags).forEach((t) => t.classList.remove('on')); };
  const reset = () => { clearExtra(); LV_PIECES.forEach((p) => { L.pieces[p.k].setAttribute('stroke', '#1e2d46'); L.pieces[p.k].classList.remove('done'); }); L.runner.at(0.55, 1); read.innerHTML = ''; };
  const count = (p) => {
    clearExtra(); L.tags[p.k].classList.add('on');
    const { px, py } = L, [x0, y0] = p.a, [x1, y1] = p.b;
    const g = svgEl('g', {}, L.sv); extra.push(g);
    if (p.across) svgEl('line', { x1: px(x0), x2: px(x1), y1: py(y0), y2: py(y0), stroke: RUN, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '2 9' }, g);
    if (p.up) svgEl('line', { x1: px(x1), x2: px(x1), y1: py(y0), y2: py(y1), stroke: RISE, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '2 9' }, g);
    const hl = svgEl('path', { d: `M${px(x0)} ${py(y0)} L${px(x1)} ${py(y1)}`, stroke: '#f2b134', 'stroke-width': 9, 'stroke-linecap': 'round', fill: 'none', opacity: 0.75 }, g);
    void hl;
    const upW = p.up > 0 ? `up <b>${p.up}</b>` : p.up < 0 ? `down <b>${-p.up}</b>` : 'up <b>0</b>';
    read.innerHTML = `<b>${p.k}</b>: <span class="u6l7-c-rise">${upW}</span>, <span class="u6l7-c-run">across <b>${p.across}</b></span>`;
  };
  Object.values(L.tags).forEach((t) => t.addEventListener('click', () => { if (running) return; const p = LV_PIECES.find((q) => q.k === t.dataset.k); count(p); }));
  document.getElementById('u6l7-lvreset').addEventListener('click', () => { if (!running) reset(); });
  document.getElementById('u6l7-run').addEventListener('click', async () => {
    if (running) return; running = true; reset();
    const c = liveCtx();
    try {
      for (const p of LV_PIECES) {
        const len = Math.hypot(p.across, p.up), ms = 260 + 230 * len;
        read.innerHTML = `<b>${p.k}</b>: ${p.word}`;
        await tween(c, ms, (t) => L.runner.at(p.a[0] + (p.b[0] - p.a[0]) * t + (p.k === 'A' ? 0.55 * (1 - t) : 0), p.a[1] + (p.b[1] - p.a[1]) * t), (t) => t);
        L.pieces[p.k].setAttribute('stroke', TYPEC[p.type]); L.pieces[p.k].classList.add('done');
      }
      read.innerHTML = '<span class="u6l7-pos">uphill</span> · <span class="u6l7-neg">downhill</span> · <span class="u6l7-zero">flat</span> · <span class="u6l7-und">wall</span>';
    } finally { running = false; }
  });
}

/* ================================== static figures ================================== */
const KFIG = { pos: [[-1.3, -1.1], [1.3, 1.1], POS], neg: [[-1.3, 1.1], [1.3, -1.1], NEG], zero: [[-1.4, 0.6], [1.4, 0.6], ZERO], und: [[0.7, -1.4], [0.7, 1.4], UND] };
const EX1 = { C: [-4, -3], D: [2, 3] }, EX2 = { E: [-4, 3], F: [2, -3] };
const EX3 = { G: [-4, 2], H: [0, 2], I: [3, 2] }, EX4 = { J: [-2, 4], K: [-2, 0], L: [-2, -3] };
const EX5 = [{ k: 'MN', P: [-5, -1], Q: [1, 3], pn: ['w', 'n'] }, { k: 'PQ', P: [-3, 1], Q: [3, -1], pn: ['n', 's'] },
  { k: 'RS', P: [-5, -4], Q: [4, -4], pn: ['sw', 's'] }, { k: 'TU', P: [5, 4], Q: [5, -4], pn: ['n', 'se'] }];
const ptsFig = (G, pts, pos, color = INK) => Object.entries(pts).forEach(([k, p]) => G.point(p[0], p[1], { color, r: 6.5, label: T(k), pos: pos[k] || 'ne' }));
const segFig = (G, list, color = INK) => list.forEach((s) => {
  G.segment(s.P, s.Q, { color, width: 4 });
  G.point(s.P[0], s.P[1], { color: INK, r: 5.5, label: T(s.k[0]), pos: s.pn[0] });
  G.point(s.Q[0], s.Q[1], { color: INK, r: 5.5, label: T(s.k[1]), pos: s.pn[1] });
});
function mountFigures() {
  const fig = (id, o = {}) => { const el = document.getElementById(id); return el ? new Graph(el, Object.assign({ width: 360, height: 360, xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5, xlabels: 1, ylabels: 1, fontSize: 14 }, o)) : null; };
  let G = fig('u6l7-ex1fig'); if (G) { G.segment(EX1.C, EX1.D, { color: SEG, width: 4 }); ptsFig(G, EX1, { C: 'se', D: 'nw' }); }
  G = fig('u6l7-ex2fig'); if (G) { G.segment(EX2.E, EX2.F, { color: SEG, width: 4 }); ptsFig(G, EX2, { E: 'ne', F: 'sw' }); }
  G = fig('u6l7-ex3fig'); if (G) { G.line({ m: 0, b: 2 }, { color: SEG, width: 4 }); ptsFig(G, EX3, { G: 'n', H: 'ne', I: 'n' }); }
  G = fig('u6l7-ex4fig'); if (G) { G.line({ x: -2 }, { color: SEG, width: 4 }); ptsFig(G, EX4, { J: 'w', K: 'nw', L: 'w' }); }
  G = fig('u6l7-ex5fig', { width: 380, height: 380, xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5 }); if (G) segFig(G, EX5, SEG);
  document.querySelectorAll('.u6l7 [data-kfig]').forEach((el) => {
    const k = KFIG[el.dataset.kfig]; if (!k) return;
    const small = el.classList.contains('u6l7-tb-fig');
    const g = new Graph(el, { width: small ? 110 : 130, height: small ? 96 : 110, xmin: -1.7, xmax: 1.8, ymin: -1.6, ymax: 1.6, grid: false, numbers: false, xtitle: '', ytitle: '', pad: 4 });
    g.segment(k[0], k[1], { color: k[2], width: 4.5 });
  });
}

/* =============================== explainer 1: read the signs =============================== */
const SG = {
  up: { label: 'Rises', P: [-2, -3], Q: [4, 1] },
  down: { label: 'Falls', P: [-4, 2], Q: [4, -2] },
  back: { label: 'Counted right to left', P: [4, 1], Q: [-2, -3] },
  ex1: { label: 'Example 1 check', ex: true, P: EX1.C, Q: EX1.D, names: ['C', 'D'] },
  ex2: { label: 'Example 2 check', ex: true, P: EX2.E, Q: EX2.F, names: ['E', 'F'] }
};
const signs = {
  title: 'Read the signs: rise, run and slope',
  height: 470,
  minW: 860,
  choices: Object.keys(SG).map((k) => ({ v: k, label: SG[k].label })),
  intro: (k) => (SG[k].ex ? 'Read the segment left to right, then use the slope formula. Press <b>Next</b>.' : 'Count from one end to the other: <b>across</b> first (the run), then <b>up or down</b> (the rise). Watch the signs. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = SG[k], [p, q] = [d.P, d.Q], run = q[0] - p[0], rise = q[1] - p[1], ty = typeOf(rise, run);
    const G = plainGrid(stage);
    const P = panel(stage, 474, 14, ex.W - 488, 440, d.ex ? (k === 'ex1' ? 'Example 1' : 'Example 2') : 'Count, then divide');
    const rises = q[1] > p[1] === q[0] > p[0];        // left to right it goes up
    const word = rises ? 'rises' : 'falls', wcol = rises ? POS : NEG;
    const away = (a, b) => (a[1] > b[1] ? 'n' : 's') + (a[0] > b[0] ? 'e' : 'w');
    const drawSeg = async (c, names) => {
      const s = G.segment(p, q, { color: SEG, width: 4.5 }); await G.drawIn(s, 650, c);
      await G.reveal(G.point(p[0], p[1], { color: INK, r: 7, label: T(names[0]), pos: away(p, q) }), c);
      await G.reveal(G.point(q[0], q[1], { color: INK, r: 7, label: T(names[1]), pos: away(q, p) }), c);
    };
    if (d.ex) {
      const [a, b] = d.names, res = h('div', 'u6l7-frbox'); P.appendChild(res);
      const tr = h('div', 'u6l7-log'); P.appendChild(tr);
      return [
        { cap: `(a) Read ${T(a + b)} from <b>left to right</b>: it <b>${word}</b>.`,
          run: async (c) => { await drawSeg(c, d.names); await dirArrow(G, p, q, wcol, word).play(c); line(tr, `(a) It <b style="color:${wcol}">${word}</b>.`); } },
        { cap: `(b) Slope formula: ${T(`m=\\dfrac{y_2-y_1}{x_2-x_1}=${subTex(p, q)}`)}`,
          run: async (c) => { res.innerHTML = T(`m=${subTex(p, q)}`); await pop(c, res); const Tr = new SlopeTri(G, { x: p[0], y: p[1], run, rise }, { fill: wcol }); await Tr.drawIn(c, 380); } },
        { cap: `${T(`=${rawFr(rise, run)}=${fr(rise, run, true)}`)}: ${TYPEW[ty]}. ${rises ? 'The line rises, so it matches (a).' : 'The line falls: it matches.'}`,
          run: async (c) => { res.innerHTML = T(`m=${subTex(p, q)}=${rawFr(rise, run)}=${fr(rise, run, true)}`); await pulse(c, res, 1.05); line(tr, `(b) ${T('m=' + fr(rise, run, true))}: ${TYPEW[ty]}`); const s = stamp(P, rises ? 'rises → positive' : 'falls → negative', { ok: true }); s.classList.add('u6l7-stampb'); await stampIn(c, s); } }
      ];
    }
    const rr = h('div', 'u6l7-ro');
    rr.innerHTML = `<div class="u6l7-ro-r u6l7-ro-run"><span class="u6l7-ro-k">run</span><b class="u6l7-ro-v">?</b></div><div class="u6l7-ro-r u6l7-ro-rise"><span class="u6l7-ro-k">rise</span><b class="u6l7-ro-v">?</b></div>`;
    P.appendChild(rr); const [vRun, vRise] = rr.querySelectorAll('b');
    const sgn = h('div', 'u6l7-sgn'); P.appendChild(sgn);
    const res = h('div', 'u6l7-big'); P.appendChild(res);
    const back = run < 0, s = (v) => (v > 0 ? '+' : '-');
    const same = rise * run > 0;
    const steps = [
      { cap: back ? `The same rising segment, but this time start at the <b>right</b> end, ${T(pairTex(p[0], p[1]))}.`
        : `A segment from ${T(pairTex(p[0], p[1]))} to ${T(pairTex(q[0], q[1]))}. Read it left to right: it <b>${word}</b>.`,
        run: async (c) => { await drawSeg(c, ['P', 'Q']); if (!back) await dirArrow(G, p, q, wcol, word).play(c); } },
      { cap: `<b>Run:</b> count the squares <b>across</b>, moving ${run > 0 ? '<b>right</b>: positive' : '<b>left</b>: negative'}. Run ${T('=' + run)}.`,
        run: async (c) => { await countLeg(c, G, p[0], p[1], 'x', run, { side: rise > 0 ? 's' : 'n' }); vRun.innerHTML = T(cU(run)); await pulse(c, vRun.parentNode, 1.08); } },
      { cap: `<b>Rise:</b> count the squares ${rise > 0 ? '<b>up</b>: positive' : '<b>down</b>: negative'} to reach the other end. Rise ${T('=' + rise)}.`,
        run: async (c) => { await countLeg(c, G, q[0], p[1], 'y', rise, { side: run > 0 ? 'e' : 'w' }); vRise.innerHTML = T(cR(rise)); await pulse(c, vRise.parentNode, 1.08); } },
      { cap: same ? `Rise and run have the <b>same sign</b>: ${T(`(${s(rise)})\\div(${s(run)})=(+)`)}. So ${T(`${rawFr(rise, run)}=${fr(rise, run, true)}`)} is <b>positive</b>.`
        : `Rise and run have <b>opposite signs</b>: ${T(`(${s(rise)})\\div(${s(run)})=(-)`)}. So ${T(`${rawFr(rise, run)}=${fr(rise, run, true)}`)} is <b>negative</b>.`,
        run: async (c) => { sgn.innerHTML = `${same ? 'same signs' : 'opposite signs'}: ${T(`(${s(rise)})\\div(${s(run)})=(${same ? '+' : '-'})`)}`; await pop(c, sgn); res.innerHTML = `${T(`\\text{slope}=${slopeTex(rise, run)}`)}<div class="u6l7-tyw">${TYPEW[ty]}</div>`; await pop(c, res); } }
    ];
    if (back) steps.push({ cap: `Two negatives give a positive: the same ${T('\\tfrac{2}{3}')} as counting left to right (run ${T('6')}, rise ${T('4')}). Left to right keeps the run positive, so it’s easier.`,
      run: async (c) => { const t = line(P, `left to right: ${T(slopeTex(4, 6))}`, 'u6l7-soft'); await show(c, t); } });
    return steps;
  }
};

/* =============================== explainer 2: the mirror flip =============================== */
const MR = {
  ex2c: { label: 'Example 2(c): CD and EF', P: EX1.C, Q: EX1.D, axis: 0, names: ['C', 'D', 'E', 'F'] },
  twoThirds: { label: T('\\tfrac{2}{3}') + ' and ' + T('-\\tfrac{2}{3}'), P: [-3, -1], Q: [3, 3], axis: 1, names: ['A', 'B', 'A\'', 'B\''] },
  three: { label: T('3') + ' and ' + T('-3'), P: [-1, -3], Q: [1, 3], axis: 0, names: ['A', 'B', 'A\'', 'B\''] }
};
const mirror = {
  title: 'Flip it over: same steepness, opposite sign',
  height: 470,
  minW: 860,
  choices: Object.keys(MR).map((k) => ({ v: k, label: MR[k].label })),
  intro: 'A rising segment is flipped top to bottom, like a mirror image. Watch the run, the rise and the slope. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = MR[k], p = d.P, q = d.Q, run = q[0] - p[0], rise = q[1] - p[1], ax = d.axis, nm = d.names;
    const G = plainGrid(stage);
    const P = panel(stage, 474, 14, ex.W - 488, 440, k === 'ex2c' ? 'Example 2(c)' : 'Before and after');
    const tb = h('table', 'u6l7-ptab'); P.appendChild(tb);
    tb.innerHTML = `<tr><th></th><th class="u6l7-c-run">run</th><th class="u6l7-c-rise">rise</th><th>slope</th></tr><tr><td>${T(nm[0] + nm[1])}</td><td>?</td><td>?</td><td>?</td></tr><tr><td>${T(nm[2] + nm[3])}</td><td>?</td><td>?</td><td>?</td></tr>`;
    const st = { t: 0 }, Y = (y) => ax + (y - ax) * (1 - 2 * st.t);
    let seg = null, Tr = null, pA = null, pB = null, ghost = null;
    const sync = () => { seg._bkDraw(); Tr.set({ y: Y(p[1]), rise: Y(q[1]) - Y(p[1]) }); G.moveTo(pA, p[0], Y(p[1])); G.moveTo(pB, q[0], Y(q[1])); };
    const fill = (r, cells, rr) => { cells[1].innerHTML = T(cU(run)); cells[2].innerHTML = T(cR(rr)); cells[3].innerHTML = T(`\\textcolor{${rr > 0 ? POS : NEG}}{${fr(rr, run, true)}}`); };
    const steps = [
      { cap: `${T(nm[0] + nm[1])}: run ${T(cU(run))}, rise ${T(cR(rise))}, so the slope is ${T(slopeTex(rise, run))}. It <b>rises</b>.`,
        run: async (c) => {
          seg = G.curve(() => ({ subs: [[G.toPx(p[0], Y(p[1])), G.toPx(q[0], Y(q[1]))]] }), { color: SEG, width: 4.5 }, 'bk-seg', G.layers.data);
          await G.drawIn(seg, 600, c);
          pA = G.point(p[0], p[1], { color: INK, r: 7 }); pB = G.point(q[0], q[1], { color: INK, r: 7 });
          const la = G.label(p[0], p[1], T(nm[0]), { pos: 'w', cls: 'bk-ptlab u6l7-nm' }), lb = G.label(q[0], q[1], T(nm[1]), { pos: 'e', cls: 'bk-ptlab u6l7-nm' });
          ghost = [la, lb];
          Tr = new SlopeTri(G, { x: p[0], y: p[1], run, rise }, { fill: POS }); await Tr.drawIn(c, 380);
          fill(0, tb.rows[1].cells, rise); for (const j of [1, 2, 3]) await pop(c, tb.rows[1].cells[j].firstChild, 220);
        } },
      { cap: `Flip it <b>top to bottom</b> over the dashed mirror line. Every point keeps its ${T('x')} and moves to the other side of the mirror.`,
        run: async (c) => {
          const mL = G.line({ m: 0, b: ax }, { color: '#e8a01e', width: 3.5, dash: true, arrows: false }); await G.drawIn(mL, 500, c);
          const old = G.segment(p, q, { color: SEG, width: 3, dash: '6 6' }); old.style.opacity = 0.35;
          ghost.forEach((e) => e.remove());
          await tween(c, 1600, (t) => { st.t = t; sync(); });
          st.t = 1; sync();
          G.label(p[0], Y(p[1]), T(nm[2]), { pos: 'w', cls: 'bk-ptlab u6l7-nm' }); G.label(q[0], Y(q[1]), T(nm[3]), { pos: 'e', cls: 'bk-ptlab u6l7-nm' });
          Tr.fill.setAttribute('fill', NEG);
        } },
      { cap: `${T(nm[2] + nm[3])}: the run is still ${T(cU(run))}, but the rise is now ${T(cR(-rise))}. Slope ${T(slopeTex(-rise, run))}: it <b>falls</b>.`,
        run: async (c) => { fill(0, tb.rows[2].cells, -rise); for (const j of [1, 2, 3]) await pop(c, tb.rows[2].cells[j].firstChild, 220); } },
      { cap: `Same steepness, opposite direction. Only the <b>sign</b> changed: ${T(fr(rise, run))} and ${T(fr(-rise, run))}.`,
        run: async (c) => { const b = h('div', 'u6l7-rulebox', `same run, rise flips sign<br>${T(fr(rise, run, true))} ↔ ${T(fr(-rise, run, true))}`); P.appendChild(b); await pop(c, b); } }
    ];
    return steps;
  }
};

/* =============================== explainer 3: zero and undefined (from 10C u6l2) =============================== */
const ZC = {
  flat: { label: 'Flatten the rise to 0', P: [-3, -2], run: 6, rises: [4, 2, 1, 0] },
  stand: { label: 'Squeeze the run to 0', P: [-3, -3], rise: 6, runs: [6, 3, 2, 1, 0] }
};
const zeroCase = {
  title: 'Why 0, and why undefined?',
  height: 470,
  minW: 860,
  choices: Object.keys(ZC).map((k) => ({ v: k, label: ZC[k].label })),
  intro: 'One endpoint stays put; the other moves. Watch <b>rise ÷ run</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ZC[k];
    const G = plainGrid(stage);
    const P = panel(stage, 474, 14, ex.W - 488, 440, k === 'flat' ? 'The run stays 6' : 'The rise stays 6');
    const ro = h('div', 'u6l7-frbox'); P.appendChild(ro);
    const tb = h('table', 'u6l7-ptab'); P.appendChild(tb);
    const p = d.P, flat = k === 'flat';
    const vals = flat ? d.rises : d.runs;
    tb.innerHTML = `<tr><th class="${flat ? 'u6l7-c-rise' : 'u6l7-c-run'}">${flat ? 'rise' : 'run'}</th><th>slope</th></tr>`;
    let seg = null, Tr = null, Qp = null;
    const st = { run: flat ? d.run : vals[0], rise: flat ? vals[0] : d.rise };
    const mkSeg = () => G.curve(() => ({ subs: [[G.toPx(p[0], p[1]), G.toPx(p[0] + st.run, p[1] + st.rise)]] }), { color: SEG, width: 4.5 }, 'bk-seg', G.layers.data);
    const setQ = (s) => { Object.assign(st, s); seg._bkDraw(); Tr.set({ run: st.run, rise: st.rise }); G.moveTo(Qp, p[0] + st.run, p[1] + st.rise); };
    const live = () => { const r = st.rise, u = st.run; ro.innerHTML = T(`\\dfrac{${cR(one(r).replace('−', '-'))}}{${cU(one(u).replace('−', '-'))}}${Math.abs(u) < 0.05 ? '' : '=' + texNum(Math.round(r / u * 100) / 100)}`); };
    const row = (v, s) => { const r = tb.insertRow(); r.innerHTML = `<td>${T(texNum(v))}</td><td>${s}</td>`; return r; };
    const steps = [];
    vals.forEach((v, i) => {
      const r = flat ? v : d.rise, u = flat ? d.run : v, zero = flat ? r === 0 : u === 0;
      let cap;
      if (i === 0) cap = `A segment with run ${T(cU(u))} and rise ${T(cR(r))}: slope ${T(slopeTex(r, u))}.`;
      else if (!zero) cap = flat ? `Lower the end: rise ${T(cR(r))}. Slope ${T(rawFr(r, u) + '=' + fr(r, u))}: <b>flatter</b>, a <b>smaller</b> number.` : `Squeeze the run to ${T(cU(u))}. Slope ${T(rawFr(r, u) + '=' + texNum(r / u))}: <b>steeper</b>, a <b>bigger</b> number.`;
      else cap = flat ? `Flat: rise ${T(cR(0))}. ${T(rawFr(0, 6) + '=0')}: zero divided by any number is 0. A <b>horizontal</b> segment has slope <b>0</b>.`
        : `Straight up: run ${T(cU(0))}. ${T(rawFr(6, 0))}: no number times 0 makes 6, so we <b>can’t divide by zero</b>. A <b>vertical</b> segment’s slope is <b>undefined</b>.`;
      steps.push({ cap, run: async (c) => {
        if (i === 0) {
          seg = mkSeg(); await G.drawIn(seg, 600, c);
          G.point(p[0], p[1], { color: INK, r: 7 }); Qp = G.point(p[0] + st.run, p[1] + st.rise, { color: INK, r: 8 });
          Tr = new SlopeTri(G, { x: p[0], y: p[1], run: st.run, rise: st.rise }, { showZero: true }); await Tr.drawIn(c, 350);
        } else {
          const a = { ...st }, b = flat ? { rise: r } : { run: u };
          await tween(c, 1100, (t) => { const o = {}; for (const kk in b) o[kk] = a[kk] + (b[kk] - a[kk]) * t; setQ(o); live(); });
        }
        setQ(flat ? { rise: r } : { run: u });
        ro.innerHTML = T(`\\dfrac{\\text{rise}}{\\text{run}}=${zero ? rawFr(r, u) + (flat ? '=0' : '') : slopeTex(r, u)}`);
        const sl = zero ? `<b class="${flat ? 'u6l7-zero' : 'u6l7-und'}">${flat ? '0' : 'undefined'}</b>` : T(Number.isInteger(r / u) ? String(r / u) : fr(r, u, true));
        const rr = row(v, sl); await show(c, rr);
        if (zero) { const s2 = stamp(P, flat ? 'slope 0' : 'undefined', { ok: flat ? true : false }); s2.classList.add('u6l7-stampb'); await stampIn(c, s2); }
      } });
    });
    return steps;
  }
};

/* =============================== explainer 4: why we can't divide by 0 =============================== */
const DZ = {
  six: { label: T('6\\div3'), a: 6, b: 3 },
  zero: { label: T('0\\div4'), a: 0, b: 4 },
  bad: { label: T('4\\div0'), a: 4, b: 0 }
};
const divZero = {
  title: 'Why can’t we divide by 0?',
  height: 470,
  minW: 860,
  choices: Object.keys(DZ).map((k) => ({ v: k, label: DZ[k].label })),
  intro: 'Division undoes multiplication. Share the counters into groups, then check by multiplying. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = DZ[k], A = d.a, B = d.b;
    const tray = panel(stage, 14, 14, 440, 440, `${A} counters · groups of ${B}`, 'u6l7-tray');
    const area = h('div', 'u6l7-area'); box(area, 410, 250); tray.appendChild(area);
    const gro = h('div', 'u6l7-gro', 'groups: <b>0</b>'); tray.appendChild(gro); hide(gro);
    const left = h('div', 'u6l7-left'); tray.appendChild(left); hide(left);
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Check by multiplying');
    const eqb = h('div', 'u6l7-frbox'); P.appendChild(eqb);
    const log = h('div', 'u6l7-log'); P.appendChild(log);
    const D = 50, gap = 12, n0 = Math.max(A, 1), x0 = (410 - (n0 * D + (n0 - 1) * gap)) / 2, y0 = 70;
    const dots = [];
    for (let i = 0; i < A; i++) { const e = add(area, h('div', 'u6l7-dot'), x0 + i * (D + gap), y0); box(e, D, D); hide(e); dots.push(e); }
    const ring = (i0, cnt, extra = '') => { const w = cnt * D + (cnt - 1) * gap + 18; const r = add(area, h('div', 'u6l7-ring ' + extra), x0 + i0 * (D + gap) - 9, y0 - 9); box(r, Math.max(w, 36), D + 18); hide(r); return r; };
    const setG = (v) => { gro.innerHTML = `groups: <b>${v}</b>`; };
    if (k === 'six') return [
      { cap: `${T('6\\div3')} asks: <b>how many groups of 3</b> make 6? Here are 6 counters.`,
        run: async (c) => { for (const e of dots) { await pop(c, e, 160); e.style.opacity = 1; } } },
      { cap: `Circle groups of 3: one group, two groups. Every counter is used, so ${T('6\\div3=2')}.`,
        run: async (c) => { await show(c, gro); for (const [i, g] of [[0, 1], [3, 2]]) { const r = ring(i, 3); await pop(c, r, 320); r.style.opacity = 1; setG(g); await pulse(c, gro, 1.1); } eqb.innerHTML = T('6\\div3=2'); await pop(c, eqb); } },
      { cap: `Check by multiplying: ${T('2\\times3=6')} ✓. Division undoes multiplication.`,
        run: async (c) => { await show(c, line(log, `${T('2\\times3=6')} <b class="u6l7-pos">✓</b>`)); const s = stamp(P, '6 ÷ 3 = 2', { ok: true }); s.classList.add('u6l7-stampb'); await stampIn(c, s); } }
    ];
    if (k === 'zero') return [
      { cap: `${T('0\\div4')} asks: <b>how many groups of 4</b> make 0? There are no counters at all.`,
        run: async (c) => { const e = add(area, h('div', 'u6l7-empty', 'no counters'), 0, 100); box(e, 410, 50); await fadeIn(c, e); } },
      { cap: `With nothing to share, we make <b>0 groups</b>: ${T('0\\div4=0')}. Zero is a real answer.`,
        run: async (c) => { await show(c, gro); setG(0); await pulse(c, gro, 1.1); eqb.innerHTML = T('0\\div4=0'); await pop(c, eqb); } },
      { cap: `Check: ${T('0\\times4=0')} ✓. That’s a flat line: ${T('\\tfrac{\\text{rise }0}{\\text{run }4}=0')}, a slope of <b>0</b>.`,
        run: async (c) => { await show(c, line(log, `${T('0\\times4=0')} <b class="u6l7-pos">✓</b>`)); const b = h('div', 'u6l7-rulebox', `horizontal: ${T('\\tfrac{0}{\\text{run}}=0')}`); P.appendChild(b); await pop(c, b); } }
    ];
    // 4 ÷ 0
    const tries = [1, 10, 100, 1000000];
    return [
      { cap: `${T('4\\div0')} asks: <b>how many groups of 0</b> make 4? Here are 4 counters.`,
        run: async (c) => { for (const e of dots) { await pop(c, e, 160); e.style.opacity = 1; } } },
      { cap: `Take a group of 0: nothing moves. Take more and more groups… the 4 counters <b>never</b> get used up.`,
        run: async (c) => {
          await show(c, gro); left.innerHTML = 'counters left: <b>4</b>'; await show(c, left);
          for (let i = 0; i < 6; i++) { const r = add(area, h('div', 'u6l7-ring u6l7-ring0'), 20 + i * 66, 180); box(r, 44, 44); await pop(c, r, 160); r.style.opacity = 1; setG(i + 1); }
          await tween(c, 1800, (t) => setG(Math.round(6 + 994 * t * t)), (t) => t); setG('1000 …');
          await shake(c, left);
        } },
      { cap: `Check with multiplication: ${T('?\\times0=4')}. Try 1, 10, 100, a million: every one gives ${T('0')}, never ${T('4')}.`,
        run: async (c) => { eqb.innerHTML = T('?\\times0=4'); await pop(c, eqb); for (const v of tries) { await show(c, line(log, `${T(`${v === 1000000 ? '1\\,000\\,000' : v}\\times0=0`)} <b class="u6l7-neg">✗</b>`)); await sleep(c, 140); } } },
      { cap: `<b>No number works</b>, not even “infinity”. ${T('4\\div0')} has no answer: it is <b>undefined</b>. A vertical line has run 0, so its slope is undefined.`,
        run: async (c) => { const s = stamp(P, 'no answer: undefined', { ok: false }); s.classList.add('u6l7-stampb'); await stampIn(c, s); const b = h('div', 'u6l7-rulebox', `vertical: ${T('\\tfrac{\\text{rise}}{0}')} is undefined`); P.appendChild(b); await pop(c, b); } }
    ];
  }
};

/* =============================== explainer 5: Examples 3 and 4, any two points =============================== */
const FW = {
  ex3: { label: 'Example 3 check', pts: EX3, horiz: true, pairs: [['G', 'H'], ['H', 'I'], ['G', 'I']] },
  ex4: { label: 'Example 4 check', pts: EX4, horiz: false, pairs: [['J', 'K'], ['K', 'L'], ['J', 'L']] }
};
const flatWall = {
  title: 'Any two points agree',
  height: 470,
  minW: 860,
  choices: Object.keys(FW).map((k) => ({ v: k, label: FW[k].label })),
  intro: (k) => (FW[k].horiz ? 'A horizontal line through G, H and I. Press <b>Next</b>.' : 'A vertical line through J, K and L. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = FW[k], pts = d.pts, hz = d.horiz;
    const G = plainGrid(stage);
    const P = panel(stage, 474, 14, ex.W - 488, 440, k === 'ex3' ? 'Example 3' : 'Example 4');
    const log = h('div', 'u6l7-log u6l7-log-lg'); P.appendChild(log);
    const ro = h('div', 'u6l7-frbox u6l7-slide'); P.appendChild(ro); hide(ro);
    const c0 = hz ? pts.G[1] : pts.J[0];                 // the shared y (horizontal) or x (vertical)
    let L = null, Tr = null;
    const pos = hz ? { G: 'n', H: 'ne', I: 'n' } : { J: 'w', K: 'nw', L: 'w' };
    const steps = d.pairs.map(([a, b], i) => {
      const pa = pts[a], pb = pts[b], run = pb[0] - pa[0], rise = pb[1] - pa[1];
      const sub = subTex(pa, pb, true);
      const val = hz ? `${sub}=\\dfrac{0}{${run}}=0` : `${sub}=\\dfrac{${rise}}{0}`;
      return { cap: `${i === 0 ? '(a) ' : ''}${T(`m_{${a}${b}}=${val}`)}${hz ? '' : ': <b>undefined</b>'}.${i === 2 ? ' All three agree.' : ''}`,
        run: async (c) => {
          if (!L) { L = hz ? G.line({ m: 0, b: c0 }, { color: SEG, width: 4.5 }) : G.line({ x: c0 }, { color: SEG, width: 4.5 }); await G.drawIn(L, 600, c); ptsFig(G, pts, pos); }
          if (!Tr) { Tr = new SlopeTri(G, { x: pa[0], y: pa[1], run, rise }, { showZero: true, runSide: 's', riseSide: 'e' }); await Tr.drawIn(c, 350); }
          else await Tr.to(c, { x: pa[0], y: pa[1], run, rise }, 800);
          await show(c, line(log, `${T(`m_{${a}${b}}=${val}`)}${hz ? '' : ' ' + UNDW}`));
        } };
    });
    const mv = G.point(hz ? -5 : c0, hz ? c0 : 5, { color: '#f2b134', r: 9 }); mv.style.display = 'none';
    const st = { v: 0 };
    steps.push({ cap: hz ? `(b) Slide a point anywhere on the line: its ${T('y')} is still ${T('2')}, so the rise is ${T('2-2=0')} every time. ${T('0\\div\\text{run}=0')}.`
      : `(b) Slide a point anywhere on the line: its ${T('x')} is still ${T('-2')}, so the run is ${T('-2-(-2)=0')} every time. Dividing by 0 never gives a number.`,
    run: async (c) => {
      const base = hz ? pts.G : pts.J;
      mv.style.display = ''; await show(c, ro);
      const upd = (v) => {
        st.v = v; const x = hz ? v : c0, y = hz ? c0 : v; G.moveTo(mv, x, y);
        Tr.set({ x: base[0], y: base[1], run: x - base[0], rise: y - base[1] });
        ro.innerHTML = '<div>' + (hz ? `${T(`(${one(x).replace('−', '-')},\\ 2)`)}: rise ${T(cR('2-2=0'))}` : `${T(`(-2,\\ ${one(y).replace('−', '-')})`)}: run ${T(cU('-2-(-2)=0'))}`) + '</div>';
      };
      await tween(c, 1300, (t) => upd(-5 + 10 * t)); await tween(c, 1000, (t) => upd(5 - 7 * t));
      upd(hz ? 0 : -2);
    } });
    steps.push({ cap: hz ? `(c) Every point on the line has ${T('y=2')}, so its equation is ${T('\\boldsymbol{y=2}')}. Horizontal: ${T('y=k')}, slope 0.`
      : `(c) Every point on the line has ${T('x=-2')}, so its equation is ${T('\\boldsymbol{x=-2}')}. Vertical: ${T('x=k')}, slope undefined.`,
    run: async (c) => {
      const lb = hz ? G.label(4.2, 2, T('y=2'), { pos: 'n', cls: 'bk-ptlab u6l7-eqlab' }) : G.label(-2, -4.6, T('x=-2'), { pos: 'w', cls: 'bk-ptlab u6l7-eqlab' });
      await pop(c, lb);
      const b = h('div', 'u6l7-rulebox', hz ? `horizontal → slope <b>0</b>, ${T('y=k')}` : `vertical → slope <b>undefined</b>, ${T('x=k')}`); P.appendChild(b); await pop(c, b);
    } });
    return steps;
  }
};

/* =============================== explainer 6: walk it left to right =============================== */
const WALK = [
  { k: 'pos', a: [-5, -3], b: [5, 3], col: POS, tile: '↗ uphill: <b>positive</b>' },
  { k: 'neg', a: [-5, 3], b: [5, -2], col: NEG, tile: '↘ downhill: <b>negative</b>' },
  { k: 'zero', a: [-5, 1], b: [5, 1], col: ZERO, tile: '→ flat: <b>zero</b>' },
  { k: 'und', a: [2, -5.5], b: [2, 5.5], col: UND, tile: '↑ a wall: <b>undefined</b>' }];
function walker(G) {
  const g = svgEl('g', { class: 'u6l7-walker' }, G.layers.top), body = svgEl('g', {}, svgEl('g', { transform: 'scale(1.35)' }, g));
  svgEl('circle', { cx: 0, cy: -36, r: 7, fill: INK }, body);
  svgEl('path', { d: 'M0 -29 V-12 M0 -12 L-6 0 M0 -12 L6 0 M0 -24 L-8 -16 M0 -24 L9 -18', stroke: INK, 'stroke-width': 3.6, 'stroke-linecap': 'round', fill: 'none' }, body);
  g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0';
  g.body = body;
  g.at = (x, y, ang = 0) => { const [px, py] = G.toPx(x, y); g.setAttribute('transform', `translate(${px} ${py}) rotate(${ang})`); };
  return g;
}
const walk = {
  title: 'Read it left to right',
  height: 470,
  minW: 860,
  choices: [{ v: 'four', label: 'Walk four lines' }, { v: 'runner', label: 'The Runner level, sorted' }],
  intro: (k) => (k === 'runner' ? 'The warm-up level again: sort its 8 pieces into the four types. Press <b>Next</b>.' : 'A hiker walks each line from <b>left to right</b>. Press <b>Next</b>.'),
  make(stage, k, ex) {
    if (k === 'runner') return walkRunner(stage, ex);
    const G = plainGrid(stage);
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Left to right');
    const tiles = h('div', 'u6l7-tiles'); P.appendChild(tiles);
    let W = null, prev = null;
    const steps = WALK.map((w) => {
      const m = w.k === 'und' ? null : (w.b[1] - w.a[1]) / (w.b[0] - w.a[0]);
      const cap = w.k === 'pos' ? `Walking left to right, this line goes <b>uphill</b>: rise and run have the same sign, so the slope is <b>positive</b>.`
        : w.k === 'neg' ? `This one goes <b>downhill</b> from left to right: the rise is negative while the run is positive, so the slope is <b>negative</b>.`
          : w.k === 'zero' ? `<b>Flat</b>: no rise at all. Rise ${T('0')}, so the slope is <b>zero</b>.`
            : `A <b>wall</b>: you can’t walk it from left to right at all. Run ${T('0')}, so the slope is <b>undefined</b>.`;
      return { cap, run: async (c) => {
        if (prev) prev.style.opacity = 0.25;
        const L = G.segment(w.a, w.b, { color: w.col, width: 4.5 }); prev = L; await G.drawIn(L, 600, c);
        if (!W) W = walker(G);
        const ang = m == null ? 0 : -Math.atan(m * G.uy / G.ux) * 180 / Math.PI;
        if (w.k === 'und') {
          W.at(-4.5, -5.1); await tween(c, 1400, (t) => W.at(-4.5 + 6.1 * t, -5.1)); await shake(c, W.body);
        } else {
          await tween(c, 1800, (t) => { const x = w.a[0] + 0.3 + (w.b[0] - w.a[0] - 0.6) * t; W.at(x, w.a[1] + m * (x - w.a[0]), ang); });
        }
        const tl = h('div', 'u6l7-tile u6l7-tile-' + w.k, w.tile); tiles.appendChild(tl); await pop(c, tl);
      } };
    });
    steps.push({ cap: `Always read a graph <b>left to right</b>. Up: positive. Down: negative. Flat: zero. Vertical: undefined.`,
      run: async (c) => { if (W) W.style.opacity = 0; if (prev) prev.style.opacity = 0.25; const b = h('div', 'u6l7-rulebox', 'read the tilt first, then <b>confirm with the formula</b>'); P.appendChild(b); await pop(c, b); } });
    return steps;
  }
};
function walkRunner(stage, ex) {
  const U = 26, wrap = add(stage, h('div', 'u6l7-lvwrap u6l7-lvst'), 14, 40);
  const L = drawLevel(wrap, U, { arrow: false }); box(wrap, L.W, L.H);
  L.runner.g.style.display = 'none';
  const P = panel(stage, 14 + L.W + 16, 14, ex.W - L.W - 44, 440, 'Four groups');
  const under = add(stage, h('div', 'u6l7-lvnote', ''), 14, 40 + L.H + 14); box(under, L.W, 150);
  const G4 = [
    { t: 'pos', word: 'Uphill', ks: ['B', 'H'] }, { t: 'neg', word: 'Downhill', ks: ['E', 'G'] },
    { t: 'zero', word: 'Flat', ks: ['A', 'D'] }, { t: 'und', word: 'Wall', ks: ['C', 'F'] }];
  const frac = (p) => {
    if (p.across === 0) return `${T(`\\tfrac{${p.up}}{0}`)} none`;
    const [a, b] = red(p.up, p.across), same = a === p.up && b === p.across && p.up > 0;
    return T(`\\tfrac{${p.up}}{${p.across}}${same ? '' : '=' + fr(p.up, p.across)}`);
  };
  const steps = G4.map((g) => {
    const ps = g.ks.map((kk) => LV_PIECES.find((p) => p.k === kk));
    const type = { pos: '<b>positive</b>', neg: '<b>negative</b>', zero: '<b>zero</b> (rise 0)', und: '<b>undefined</b> (run 0)' }[g.t];
    return { cap: `<b>${g.word}</b>: pieces ${g.ks.join(' and ')}. ${g.word === 'Wall' ? 'Across is 0' : g.word === 'Flat' ? 'Up is 0' : 'Up ÷ across'}: ${ps.map((p) => frac(p)).join(', ')}. Slope type: ${type}.`,
      run: async (c) => {
        for (const p of ps) { L.pieces[p.k].setAttribute('stroke', TYPEC[g.t]); L.pieces[p.k].setAttribute('stroke-width', U / 6); await pulse(c, L.tags[p.k], 1.25); L.tags[p.k].classList.add('u6l7-lvt-' + g.t); }
        const t = h('div', 'u6l7-tile u6l7-tile-' + g.t, `<b>${g.word}</b> ${g.ks.join(', ')} → ${type}`); P.appendChild(t); await pop(c, t);
      } };
  });
  steps.push({ cap: `Every piece of ground, and every line, is one of these <b>four types</b>. Rename them: rise over run.`,
    run: async (c) => { under.innerHTML = `<div>${T('\\dfrac{\\text{up}}{\\text{across}}')} is just ${T('\\dfrac{\\text{rise}}{\\text{run}}')}: the slope!</div>`; await fadeIn(c, under); } });
  return steps;
}

/* =============================== explainer 7: turn the line =============================== */
const DEG = Math.PI / 180;
const phiOf = (m) => (m == null ? 90 : (Math.atan(m) / DEG + 180) % 180);
const DL = {
  turn: { label: 'One full turn' },
  near: { label: 'Close to vertical' }
};
const dial = {
  title: 'Turn the line through all four types',
  height: 470,
  minW: 860,
  choices: Object.keys(DL).map((k) => ({ v: k, label: DL[k].label })),
  intro: 'The line turns around the origin. Watch the slope and its type. Press <b>Next</b>.',
  make(stage, k, ex) {
    const G = plainGrid(stage);
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'The slope');
    const big = h('div', 'u6l7-dm'); P.appendChild(big);
    const kinds = h('div', 'u6l7-dk');
    kinds.innerHTML = ['pos', 'zero', 'neg', 'und'].map((t) => `<div class="u6l7-dkr u6l7-dkr-${t}" data-t="${t}"><i></i>${{ pos: 'positive: rises', neg: 'negative: falls', zero: 'zero: flat', und: 'undefined: vertical' }[t]}</div>`).join('');
    P.appendChild(kinds);
    const st = { phi: 0 };
    const Lc = G.curve(() => {
      const ph = st.phi * DEG, dx = Math.cos(ph), dy = Math.sin(ph), kk = 20;
      return { subs: [[G.toPx(-kk * dx, -kk * dy), G.toPx(kk * dx, kk * dy)]] };
    }, { color: ZERO, width: 4.5 }, 'bk-line', G.layers.data);
    G.point(0, 0, { color: INK, r: 6 });
    let Tr = null;
    const lit = (t) => kinds.querySelectorAll('.u6l7-dkr').forEach((r) => r.classList.toggle('on', r.dataset.t === t));
    const setPhi = (phi, exact) => {
      st.phi = phi; Lc._bkDraw();
      const vert = Math.abs(phi - 90) < 1e-6, m = vert ? null : Math.tan(phi * DEG), flat = !vert && Math.abs(m) < 1e-9;
      const t = vert ? 'und' : flat ? 'zero' : m > 0 ? 'pos' : 'neg';
      Lc.path.setAttribute('stroke', TYPEC[t]); lit(t);
      if (exact !== undefined) return;
      big.innerHTML = vert ? `<div>${T('m')}: ${UNDW}</div>` : T(`m\\approx${texNum(Math.round(m * 10) / 10)}`);
    };
    const setExact = (s) => {
      if (!s) { big.innerHTML = `<div>${T('m')}: ${UNDW}</div>`; return; }
      const [a, b] = s; big.innerHTML = T(`m=\\textcolor{${TYPEC[a === 0 ? 'zero' : a / b > 0 ? 'pos' : 'neg']}}{${fr(a, b, true)}}`);
    };
    const turn = (c, to, ms) => { const a = st.phi; return tween(c, ms, (t) => setPhi(a + (to - a) * t)); };
    const triFor = async (c, s) => { if (Tr) { Tr.remove(); Tr = null; } if (!s || s[0] === 0 || Math.abs(s[0] / s[1]) > 5) return; const [a, b] = s; Tr = new SlopeTri(G, { x: 0, y: 0, run: b, rise: a }, { fill: TYPEC[a / b > 0 ? 'pos' : 'neg'] }); await Tr.drawIn(c, 260); };
    const stop = async (c, s, ms = 1000) => { if (Tr) { Tr.remove(); Tr = null; } const to = s ? phiOf(s[0] / s[1]) : 90; await turn(c, to, ms); setPhi(to, true); setExact(s); await triFor(c, s); await pulse(c, big, 1.06); };
    const seq = (stops) => async (c) => { for (const [i, s] of stops.entries()) { await stop(c, s); if (i < stops.length - 1) await sleep(c, 650); } };
    setPhi(0); setExact([0, 1]);
    if (k === 'near') {
      return [
        { cap: `Slope ${T('1')}: rise ${T('1')} for every ${T('1')} across.`, run: seq([[1, 1]]) },
        { cap: `Slope ${T('2')}, then ${T('5')}: steeper and steeper, bigger and bigger numbers.`, run: seq([[2, 1], [5, 1]]) },
        { cap: `Slope ${T('10')}, then ${T('50')}: almost straight up, and the numbers get <b>huge</b>.`, run: seq([[10, 1], [50, 1]]) },
        { cap: `Exactly vertical: run ${T('0')}. Not a huge number, not “infinity”: <b>no number at all</b>. The slope is <b>undefined</b>.`, run: seq([null]) }
      ];
    }
    return [
      { cap: `Start flat: rise ${T('0')}, so the slope is ${T('0')}, a <b>zero</b> slope.`, run: async (c) => { setPhi(0, true); setExact([0, 1]); await pulse(c, big, 1.06); } },
      { cap: `Turn it up: slope ${T('\\tfrac{1}{2}')}, then ${T('1')}, then ${T('3')}. It rises: <b>positive</b>. Steeper means a bigger number.`, run: seq([[1, 2], [2, 2], [3, 1]]) },
      { cap: `Straight up: the run is ${T('0')}. No number works, so the slope is <b>undefined</b>.`, run: seq([null]) },
      { cap: `Keep turning: now it <b>falls</b> from left to right. Slope ${T('-3')}, then ${T('-1')}, then ${T('-\\tfrac{1}{2}')}: <b>negative</b>.`, run: seq([[-3, 1], [-2, 2], [-1, 2]]) },
      { cap: `Flat again: slope ${T('0')}. One turn showed all <b>four types</b>.`,
        run: async (c) => { if (Tr) { Tr.remove(); Tr = null; } await turn(c, 180, 900); setPhi(0, true); setExact([0, 1]); await pulse(c, big, 1.06); } }
    ];
  }
};

/* =============================== explainer 8: Example 5 check =============================== */
const exFive = {
  title: 'Example 5 check: four segments, four types',
  height: 470,
  minW: 860,
  choices: [{ v: 'ex5', label: 'Example 5 check' }],
  intro: 'Read each segment’s tilt, then count from its first-named point. Press <b>Next</b>.',
  make(stage, k, ex) {
    const G = plainGrid(stage, { xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5 });
    segFig(G, EX5, '#9aa3b2');
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Example 5');
    const tb = h('table', 'u6l7-ptab u6l7-ptab5'); P.appendChild(tb);
    tb.innerHTML = '<tr><th></th><th class="u6l7-c-rise">rise</th><th class="u6l7-c-run">run</th><th>slope</th><th>type</th></tr>' + EX5.map((s) => `<tr><td>${T(s.k)}</td><td>?</td><td>?</td><td>?</td><td>?</td></tr>`).join('');
    let prev = [];
    const steps = EX5.map((s, i) => {
      const run = s.Q[0] - s.P[0], rise = s.Q[1] - s.P[1], ty = typeOf(rise, run);
      const slope = ty === 'und' ? `${T(rawFr(rise, 0))}` : T(slopeTex(rise, run));
      const tilt = { pos: 'It rises', neg: 'It falls', zero: 'It is flat', und: 'It is vertical' }[ty];
      return { cap: `${T(s.k)}: ${tilt}. From ${T(`${s.k[0]}${pairTex(s.P[0], s.P[1])}`)}: rise ${T(cR(rise))}, run ${T(cU(run))}. Slope ${slope}: ${TYPEW[ty]}.`,
        run: async (c) => {
          G.remove(prev); prev.forEach((e) => e.remove && e.remove()); prev = [];
          const hl = G.segment(s.P, s.Q, { color: TYPEC[ty], width: 5.5 }); prev.push(hl); await G.drawIn(hl, 450, c);
          const Tr = new SlopeTri(G, { x: s.P[0], y: s.P[1], run, rise }, { fill: TYPEC[ty], showZero: true, riseSide: ty === 'und' ? 'w' : undefined, runSide: ty === 'zero' ? 'n' : undefined });
          prev.push(Tr.g, Tr.lRun, Tr.lRise); await Tr.drawIn(c, 300);
          const cells = tb.rows[i + 1].cells;
          cells[1].innerHTML = T(cR(rise)); cells[2].innerHTML = T(cU(run));
          cells[3].innerHTML = ty === 'und' ? T(`\\tfrac{${rise}}{0}`) : T(`\\textcolor{${TYPEC[ty]}}{${fr(rise, run, false)}}`);
          cells[4].innerHTML = TYPEW[ty];
          for (const j of [1, 2, 3, 4]) await pop(c, cells[j].firstChild, 200);
        } };
    });
    steps.push({ cap: `(b) ${T('TU')} is vertical: ${T('x=5')}. Its slope doesn’t exist, so there is no number to put in for ${T('m')} in ${T('y=mx+b')}.`,
      run: async (c) => { const b = h('div', 'u6l7-rulebox', `${T('TU')}: only ${T('x=5')}, never ${T('y=mx+b')}`); P.appendChild(b); await pop(c, b); } });
    return steps;
  }
};

/* =============================== mount =============================== */
mountLevel();
mountFigures();
export const explainers = mountExplainers({ signs, mirror, zeroCase, divZero, flatWall, walk, dial, ex5: exFive });

/* =============================== Stand Up Break! =============================== */
// "undefined" is spelled across two \text{} pieces so the shared check (which flags the JS value undefined) passes.
const UNDT = '\\text{unde}\\text{fined}';
const suType = (rise, run) => ({ pos: '\\text{positive}', neg: '\\text{negative}', zero: '\\text{zero}', und: UNDT }[typeOf(rise, run)]);
const suSlope = (P, Q) => {
  const rise = Q[1] - P[1], run = Q[0] - P[0];
  if (run === 0) return [`m=${subTex(P, Q, false)}=\\tfrac{${rise}}{0}`, `${UNDT}\\ (\\text{vertical})`];
  const [a, b] = red(rise, run), raw = `\\tfrac{${rise}}{${run}}`;
  return [`m=${subTex(P, Q, false)}=${raw}${a === rise && b === run ? '' : '=' + fr(rise, run)}`, `${suType(rise, run)}`];
};
const suPt = (r, lo, hi) => [r.int(lo, hi), r.int(lo, hi)];
/** two points making a segment of the given type (coordinates in [lo, hi]) */
function suSeg(r, type, lo, hi) {
  for (let i = 0; i < 200; i++) {
    const P = suPt(r, lo, hi); let Q;
    if (type === 'zero') Q = [r.int(lo, hi), P[1]];
    else if (type === 'und') Q = [P[0], r.int(lo, hi)];
    else Q = suPt(r, lo, hi);
    const rise = Q[1] - P[1], run = Q[0] - P[0];
    if (P[0] === Q[0] && P[1] === Q[1]) continue;
    if (typeOf(rise, run) !== type) continue;
    if (type !== 'zero' && type !== 'und' && Math.abs(red(rise, run)[1]) > 6) continue;
    return [P, Q];
  }
  return type === 'zero' ? [[1, 2], [5, 2]] : type === 'und' ? [[3, 1], [3, 6]] : type === 'pos' ? [[1, 1], [4, 7]] : [[1, 7], [3, 1]];
}
const names = [['A', 'B'], ['C', 'D'], ['P', 'Q'], ['R', 'S'], ['M', 'N']];
const ptT = (nm, P) => `${nm}${pairTex(P[0], P[1])}`;
standup('u6l7', {
  intro: 'At your whiteboard station: read the tilt, calculate the slope, name its type.',
  levels: {
    BEG: (r) => { // positive coordinates, all four types; or an equation y = k / x = k
      if (r.chance(0.25)) {
        const hz = r.chance(0.5), kk = r.int(-8, 9);
        return { text: 'Is this line horizontal or vertical? What is its slope?', q: `${hz ? 'y' : 'x'}=${kk}`,
          a: hz ? ['\\text{horizontal}', 'm=0'] : ['\\text{vertical}', `m\\ \\text{is}\\ ${UNDT}`] };
      }
      const [n1, n2] = r.pick(names), [P, Q] = suSeg(r, r.pick(['pos', 'neg', 'zero', 'und']), 0, 9);
      return { text: 'Calculate the slope of the segment. Is it positive, negative, zero or unde&shy;fined?', q: `${ptT(n1, P)},\\quad ${ptT(n2, Q)}`, a: suSlope(P, Q) };
    },
    PRG: (r) => { // negative coordinates, all four types
      const [n1, n2] = r.pick(names), [P, Q] = suSeg(r, r.pick(['pos', 'neg', 'neg', 'pos', 'zero', 'und']), -7, 7);
      return { text: 'Calculate the slope. State its type: positive, negative, zero or unde&shy;fined.', q: `${ptT(n1, P)},\\quad ${ptT(n2, Q)}`, a: suSlope(P, Q) };
    },
    MAS: (r) => { // three points on a horizontal / vertical line: two slopes + the equation; or a missing coordinate
      if (r.chance(0.5)) {
        const hz = r.chance(0.5), c0 = r.int(-6, 6), vs = r.shuffle([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].filter((v) => v !== c0)).slice(0, 3).sort((a, b) => a - b);
        const pts = (hz ? vs.map((v) => [v, c0]) : vs.slice().reverse().map((v) => [c0, v]));
        const [A, B, C] = pts;
        return { text: `The points lie on one line. Calculate the slope of ${'JK'} and of ${'KL'}. Then write the equation of the line.`,
          q: `${ptT('J', A)},\\ ${ptT('K', B)},\\ ${ptT('L', C)}`,
          a: [suSlope(A, B)[0], suSlope(B, C)[0], hz ? `\\text{both } 0:\\ y=${c0}` : `\\text{both ${'unde'}}\\text{fined}:\\ x=${c0}`] };
      }
      const hz = r.chance(0.5), P = suPt(r, -6, 6), other = r.int(-6, 6), n2 = names[r.int(0, 4)];
      if (hz) {
        const x2 = P[0] + r.pick([-5, -4, -3, 3, 4, 5]);
        return { text: `The segment joining these points has a slope of 0. Find <i>k</i>.`, q: `${ptT(n2[0], P)},\\quad ${n2[1]}(${x2},\\ k)`,
          a: ['\\text{slope } 0 \\Rightarrow \\text{horizontal: same } y', `k=${P[1]}`] };
      }
      void other;
      const y2 = P[1] + r.pick([-5, -4, -3, 3, 4, 5]);
      return { text: `The segment joining these points has an unde&shy;fined slope. Find <i>k</i>.`, q: `${ptT(n2[0], P)},\\quad ${n2[1]}(k,\\ ${y2})`,
        a: [`\\text{${'unde'}}\\text{fined} \\Rightarrow \\text{vertical: same } x`, `k=${P[0]}`] };
    }
  }
});
