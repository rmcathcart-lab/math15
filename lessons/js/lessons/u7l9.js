/* Math 15 · Unit 7 · Lesson 9 — Slope in Context: Interpreting Rates of Change.
 * The Great Race warm-up (three racers with head starts; lift the fog, write the equations), the Example 5 grid
 * (tap to plot) and answer graph, and the explainers:
 *   rate (a story and its graph in sync: the courier on the road, the propane tank draining, the turtle; one-unit steps
 *   show the same change every time; the units — Example 1), sentence (the four blanks of a rate sentence filled from
 *   the equation and its units — Example 1), start (rewind the story to x = 0: the coffee card, the tree, the turtle's
 *   head start — Example 2), build (words to an equation: the rate and the start found in the story, then the bill
 *   built bar by bar until the bar tops make the line — Example 3a, bowling), machine (the equation as a machine,
 *   forwards and backwards — Examples 3b, 3c, 4d), candle (two data points → the rate → b → the equation → when it
 *   burns out, with the candle burning beside the H-axis — Example 4), compare (two plans: plot b, use the slope, drive
 *   a marker along and watch who is cheaper; the break-even point — Example 5, warm-up rabbit vs turtle),
 *   even (the balance: set the two equal and solve, both sides at once — Example 5c, warm-up).
 * Colours: run amber, rise purple, lines blue; slope m blue, y-intercept b green; moving "now" dot orange.
 * Pieces adapted from Math 10C u7l6 (same engine). No calculator in this unit. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, tween, linear, liveCtx,
  pairTex, texNum, svgEl, place, drawIn, pulse, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RUN = COLORS.amber, RISE = COLORS.purple, LINE = COLORS.blue, BCOL = COLORS.green, INK = COLORS.ink, GRAY = COLORS.gray,
  RED = COLORS.red, PUR = COLORS.purple, NOW = COLORS.orange;
const cR = (s) => `\\textcolor{${RISE}}{${s}}`, cU = (s) => `\\textcolor{${RUN}}{${s}}`;
const cM = (s) => `\\textcolor{${LINE}}{${s}}`, cB = (s) => `\\textcolor{${BCOL}}{${s}}`;
const tn = (v, d = 3) => texNum(v, d);
/** plain-text number with a real minus */
const n = (v, d = 3) => tn(v, d).replace('-', '−');
const r1 = (v) => Math.round(v * 10) / 10;
const rr = (v) => Math.round(v * 1e6) / 1e6;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l9-panel ' + cls, title ? `<div class="u7l9-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u7l9-line ' + cls, html); p.appendChild(d); return d; };
const pill = (p, html, cls = '') => { const d = h('div', 'u7l9-pill ' + cls, html); p.appendChild(d); return d; };
/** y = mx + b in TeX with m blue and b green (b = 0 left out) */
const eqTex = (Y, X, m, b, colour = true) => {
  const M = m === 1 ? '' : m === -1 ? '-' : tn(m), B = b === 0 ? '' : (b < 0 ? '-' : '+') + (colour ? cB(tn(Math.abs(b))) : tn(Math.abs(b)));
  return `${Y}=${colour && M !== '' ? cM(M) : M}${X}${B}`;
};

/* ---------------------------------------------------------------------------------------------------------------
 * Slope triangle on a Graph: run leg (amber) from (x, y) across, then rise leg (purple) to the line. Labels outside.
 * ------------------------------------------------------------------------------------------------------------- */
class SlopeTri {
  constructor(G, s, o = {}) {
    this.G = G; this.s = Object.assign({}, s); this.o = o;
    const L = o.layer || G.layers.data, w = o.w || 5;
    this.g = svgEl('g', { class: 'u7l9-tri' }, L);
    this.fill = svgEl('path', { fill: o.fill || LINE, 'fill-opacity': o.fillOp ?? 0.1, stroke: 'none' }, this.g);
    this.mark = svgEl('path', { fill: 'none', stroke: INK, 'stroke-width': 1.6 }, this.g);
    this.runP = svgEl('path', { class: 'bk-stroke', stroke: o.runColor || RUN, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.riseP = svgEl('path', { class: 'bk-stroke', stroke: o.riseColor || RISE, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.lRun = o.labels === false ? null : h('div', 'bk-lab u7l9-tlab u7l9-trun');
    this.lRise = o.labels === false ? null : h('div', 'bk-lab u7l9-tlab u7l9-trise');
    if (this.lRun) G.html.append(this.lRun, this.lRise);
    G.track(this.g, () => this.draw());
  }
  draw() {
    const G = this.G, { x, y, run, rise } = this.s;
    const P = G.toPx(x, y), C = G.toPx(x + run, y), Q = G.toPx(x + run, y + rise);
    const d = (a, b) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    this.fill.setAttribute('d', `M${P[0]} ${P[1]} L${C[0]} ${C[1]} L${Q[0]} ${Q[1]} Z`);
    this.runP.setAttribute('d', d(P, C)); this.riseP.setAttribute('d', d(C, Q));
    const sx = Math.sign(P[0] - C[0]), sy = Math.sign(Q[1] - C[1]), k = 10;
    this.mark.setAttribute('d', Math.abs(C[0] - P[0]) > 2 * k && Math.abs(Q[1] - C[1]) > 2 * k ? `M${C[0] + sx * k} ${C[1]} L${C[0] + sx * k} ${C[1] + sy * k} L${C[0]} ${C[1] + sy * k}` : '');
    if (!this.lRun) return;
    this.lRun.innerHTML = this.o.runText ? this.o.runText(run) : `<b>run</b> ${n(run)}`;
    this.lRise.innerHTML = this.o.riseText ? this.o.riseText(rise) : `<b>rise</b> ${n(rise)}`;
    const gap = this.o.gap ?? 6;
    place(this.lRun, (P[0] + C[0]) / 2, P[1], this.o.runSide || (rise >= 0 ? 's' : 'n'), gap);
    place(this.lRise, C[0], (C[1] + Q[1]) / 2, this.o.riseSide || (run >= 0 ? 'e' : 'w'), gap + 2);
  }
  async drawIn(c, ms = 500) {
    const [lr, ls] = [this.lRun, this.lRise]; this.fill.style.opacity = 0; hide(lr); hide(ls);
    await drawIn(this.runP, ms, c); if (lr) await fadeIn(c, lr, 220);
    await drawIn(this.riseP, ms, c); if (ls) await fadeIn(c, ls, 220);
    await appear(c, this.fill, 250);
  }
  ghost() { this.g.style.opacity = 0.25; if (this.lRun) { this.lRun.remove(); this.lRise.remove(); this.lRun = this.lRise = null; } }
}

/* ---------------------------------------------------------------------------------------------------------------
 * Story pieces drawn beside a graph, sharing its vertical scale.
 * ------------------------------------------------------------------------------------------------------------- */
const ICON = {
  // top-down, pointing up (for the vertical road)
  car: '<svg viewBox="0 0 30 50" width="30" height="50"><rect x="1" y="9" width="4" height="10" rx="2" fill="#1c2230"/><rect x="25" y="9" width="4" height="10" rx="2" fill="#1c2230"/><rect x="1" y="33" width="4" height="10" rx="2" fill="#1c2230"/><rect x="25" y="33" width="4" height="10" rx="2" fill="#1c2230"/><rect x="3" y="2" width="24" height="46" rx="9" fill="#e8a01e" stroke="#1c2230" stroke-width="2"/><path d="M7 14 Q15 9 23 14 L22 20 H8 Z" fill="#cfe0ff"/><rect x="8" y="33" width="14" height="7" rx="2" fill="#cfe0ff"/></svg>',
  turtle: '<svg viewBox="0 0 36 46" width="36" height="46"><ellipse cx="6" cy="16" rx="5" ry="4" fill="#176b3e"/><ellipse cx="30" cy="16" rx="5" ry="4" fill="#176b3e"/><ellipse cx="6" cy="34" rx="5" ry="4" fill="#176b3e"/><ellipse cx="30" cy="34" rx="5" ry="4" fill="#176b3e"/><circle cx="18" cy="6" r="5.5" fill="#7cc495" stroke="#176b3e" stroke-width="1.8"/><ellipse cx="18" cy="25" rx="13" ry="15" fill="#1e8c50" stroke="#176b3e" stroke-width="2"/><path d="M18 13 V37 M8 22 H28 M9 30 H27" stroke="#9fd8b4" stroke-width="1.6"/></svg>'
};
/** side-view racers for the warm-up (facing right) */
const RACER_SVG = {
  rabbit: '<svg viewBox="0 0 56 44" width="56" height="44"><ellipse cx="24" cy="29" rx="15" ry="10" fill="#e3d8f2" stroke="#5a3c84" stroke-width="2"/><circle cx="9" cy="28" r="4" fill="#fff" stroke="#5a3c84" stroke-width="1.6"/><ellipse cx="37" cy="9" rx="3" ry="9" fill="#e3d8f2" stroke="#5a3c84" stroke-width="2" transform="rotate(-12 37 9)"/><ellipse cx="44" cy="9" rx="3" ry="9" fill="#e3d8f2" stroke="#5a3c84" stroke-width="2" transform="rotate(10 44 9)"/><circle cx="41" cy="22" r="7" fill="#e3d8f2" stroke="#5a3c84" stroke-width="2"/><circle cx="43.5" cy="21" r="1.4" fill="#1c2230"/><path d="M18 38 l6 -2 M28 38 l7 -1" stroke="#5a3c84" stroke-width="2.4" stroke-linecap="round"/></svg>',
  turtle: '<svg viewBox="0 0 56 40" width="56" height="40"><ellipse cx="14" cy="34" rx="5" ry="3.5" fill="#176b3e"/><ellipse cx="34" cy="34" rx="5" ry="3.5" fill="#176b3e"/><circle cx="46" cy="25" r="6" fill="#7cc495" stroke="#176b3e" stroke-width="1.6"/><circle cx="48" cy="23.5" r="1.3" fill="#1c2230"/><path d="M5 33 A19 17 0 0 1 43 33 Z" fill="#1e8c50" stroke="#176b3e" stroke-width="2"/><path d="M15 33 L19 22 H29 L33 33 M19 22 L13 18 M29 22 L35 18" stroke="#9fd8b4" stroke-width="1.6" fill="none"/></svg>',
  snail: '<svg viewBox="0 0 56 40" width="56" height="40"><path d="M4 36 H44 Q50 36 50 31 L47 27 H38 L33 33 H4 Z" fill="#f2c79a" stroke="#8a4e10" stroke-width="1.8"/><path d="M45 27 L49 15 M41 27 L41 16" stroke="#8a4e10" stroke-width="1.8"/><circle cx="49" cy="15" r="1.8" fill="#1c2230"/><circle cx="41" cy="16" r="1.8" fill="#1c2230"/><circle cx="21" cy="20" r="13" fill="#c86e14" stroke="#8a4e10" stroke-width="2"/><circle cx="21" cy="20" r="7.5" fill="none" stroke="#ffecb3" stroke-width="2"/><circle cx="21" cy="20" r="2.6" fill="#ffecb3"/></svg>'
};

/** a vertical strip beside graph G sharing its vertical scale. kind: 'road' | 'tank' | 'tree' | 'candle'.
 *  o: { read(v) → html, icon, label, fill, start } — set(v) moves the level */
class Column {
  constructor(stage, G, x, y, kind, o = {}) {
    const w = 130, H = G.H; this.G = G; this.kind = kind; this.o = o; this.cx = 92;
    this.el = add(stage, box(h('div', 'u7l9-col'), w, H), x, y);
    const s = this.svg = svgEl('svg', { width: w, height: H, viewBox: `0 0 ${w} ${H}` }, this.el);
    const py = this.py = (v) => G.toPx(0, v)[1];
    const top = py(G.win.ymax), bot = py(G.win.ymin), cx = this.cx;
    this.top = top; this.bot = bot;
    const st = G.o.ylabels || G.win.ystep;
    const ticks = (x1, x2) => { for (let v = G.win.ymin + st; v <= G.win.ymax + 1e-9; v += st) svgEl('line', { x1, x2, y1: py(v), y2: py(v), stroke: '#c9c3b4', 'stroke-width': 1.5 }, s); };
    if (kind === 'road') {
      const rw = 46;
      svgEl('rect', { x: cx - rw / 2, y: top - 8, width: rw, height: bot - top + 8, rx: 6, fill: '#5d6472' }, s);
      svgEl('line', { x1: cx, x2: cx, y1: top, y2: bot, stroke: '#ffd166', 'stroke-width': 2.5, 'stroke-dasharray': '10 9' }, s);
      for (let v = G.win.ymin; v <= G.win.ymax + 1e-9; v += st) svgEl('line', { x1: cx - rw / 2 - 7, x2: cx - rw / 2, y1: py(v), y2: py(v), stroke: '#5d6472', 'stroke-width': 2 }, s);
      svgEl('rect', { x: cx - rw / 2, y: bot - 3, width: rw, height: 6, fill: '#fff' }, s);
      this.icon = h('div', 'u7l9-icon', ICON[o.icon || 'car']); this.el.appendChild(this.icon);
    } else if (kind === 'tank') {
      ticks(cx - 40, cx - 30);
      svgEl('rect', { x: cx - 27, y: top, width: 54, height: bot - top, rx: 8, fill: '#fff', stroke: INK, 'stroke-width': 3 }, s);
      this.fuel = svgEl('rect', { x: cx - 24, width: 48, rx: 4, fill: o.fill || '#e8a01e' }, s);
      const lab = h('div', 'u7l9-tanklab', o.label || 'FUEL'); this.el.appendChild(lab); place(lab, cx, top + 4, 's', 2);
    } else if (kind === 'tree') {
      ticks(cx - 46, cx - 36);
      svgEl('line', { x1: cx - 34, x2: cx + 34, y1: bot, y2: bot, stroke: '#6b4a2a', 'stroke-width': 5 }, s);
      this.trunk = svgEl('rect', { x: cx - 6, width: 12, fill: '#7a4b28' }, s);
      this.crown = svgEl('ellipse', { cx, rx: 26, fill: '#4f9a3e', stroke: '#2f6b25', 'stroke-width': 2.5 }, s);
    } else if (kind === 'candle') {
      ticks(cx - 40, cx - 30);
      svgEl('ellipse', { cx, cy: bot, rx: 30, ry: 6, fill: '#d9d4c7' }, s);
      this.wax = svgEl('rect', { x: cx - 15, width: 30, rx: 3, fill: '#f6efe0', stroke: '#c9b48c', 'stroke-width': 2 }, s);
      this.wick = svgEl('line', { x1: cx, x2: cx, stroke: INK, 'stroke-width': 2.5 }, s);
      this.flame = svgEl('path', { fill: '#ffb21e', stroke: '#e8701e', 'stroke-width': 1.5 }, s);
      this.puddle = svgEl('ellipse', { cx, cy: bot - 2, rx: 22, ry: 5, fill: '#f6efe0', stroke: '#c9b48c', 'stroke-width': 2, opacity: 0 }, s);
    }
    this.read = h('div', 'u7l9-colread'); this.el.appendChild(this.read);
    this.set(o.start ?? G.win.ymin);
  }
  set(v) {
    const py = this.py(v), cx = this.cx; this.v = v;
    if (this.kind === 'road') place(this.icon, cx, py, 'c');
    else if (this.kind === 'tank') {
      const yy = Math.min(py, this.bot - 3); this.fuel.setAttribute('y', yy); this.fuel.setAttribute('height', Math.max(0, this.bot - 3 - yy));
    } else if (this.kind === 'tree') {
      const crH = Math.min(60, Math.max(14, (this.bot - py) * 0.45));
      this.crown.setAttribute('cy', py + crH / 2); this.crown.setAttribute('ry', crH / 2);
      this.trunk.setAttribute('y', py + crH / 2); this.trunk.setAttribute('height', Math.max(0, this.bot - py - crH / 2));
    } else if (this.kind === 'candle') {
      const yy = Math.min(py, this.bot), lit = v > 0.05 && !this.out;
      this.wax.setAttribute('y', yy); this.wax.setAttribute('height', Math.max(0, this.bot - yy));
      this.wick.setAttribute('y1', yy); this.wick.setAttribute('y2', yy - 8);
      this.flame.setAttribute('d', `M${cx} ${yy - 34} Q${cx + 11} ${yy - 16} ${cx} ${yy - 6} Q${cx - 11} ${yy - 16} ${cx} ${yy - 34} Z`);
      this.flame.style.display = lit ? '' : 'none'; this.wick.style.display = v > 0.05 ? '' : 'none';
      this.puddle.setAttribute('opacity', v > 0.05 ? 0 : 1);
    }
    this.read.innerHTML = this.o.read ? this.o.read(v) : n(r1(v));
    place(this.read, this.kind === 'road' ? cx - 30 : this.kind === 'tree' ? cx - 34 : cx - 32, py, 'w', 0);
  }
}

/** a point that runs along y = f(x) on G, leaving a trail from `from`, with a dashed guide to the vertical axis.
 *  onMove(x, y) keeps the story in sync. */
function tracer(G, f, o = {}) {
  const st = { a: o.from, x: o.from };
  const samp = () => { const N = 40, xs = []; for (let i = 0; i <= N; i++) xs.push(st.a + (st.x - st.a) * i / N); return xs.map((x) => G.toPx(x, f(x))); };
  const trail = G.curve(() => ({ subs: Math.abs(st.x - st.a) < 1e-9 ? [] : [samp()] }), { color: o.color || LINE, width: o.width || 4.5 }, 'u7l9-trail', G.layers.data);
  const guide = G.curve(() => ({ subs: o.guide === false ? [] : [[G.toPx(G.win.xmin, f(st.x)), G.toPx(st.x, f(st.x))]] }), { color: GRAY, width: 2, dash: '6 6' }, 'u7l9-guide', G.layers.data);
  const dot = G.point(o.from, f(o.from), { color: o.dotColor || NOW, r: 8.5 });
  const api = {
    st, trail, dot,
    set(x) { st.x = x; trail._bkDraw(); guide._bkDraw(); G.moveTo(dot, x, f(x)); if (o.onMove) o.onMove(x, f(x)); },
    go(c, x, ms = 2000) { const x0 = st.x; return tween(c, ms, (t) => api.set(x0 + (x - x0) * t), linear); },
    guides(on) { guide.style.display = on ? '' : 'none'; },
    hideDot() { dot.style.visibility = 'hidden'; }, showDot() { dot.style.visibility = ''; }
  };
  api.set(o.from);
  return api;
}

/** fly an HTML token from src into the blank `slot` (inline) */
async function fly(c, stage, src, slot, html) {
  slot.innerHTML = ''; const tok = h('span', 'u7l9-tok', html); slot.appendChild(tok); slot.classList.add('u7l9-sb-on');
  if (!c || c.fast) return;
  const sc = stage.getBoundingClientRect().width / stage.offsetWidth || 1;
  const a = src.getBoundingClientRect(), b = tok.getBoundingClientRect();
  const dx = ((a.left + a.width / 2) - (b.left + b.width / 2)) / sc, dy = ((a.top + a.height / 2) - (b.top + b.height / 2)) / sc;
  await c.anim(tok, [{ transform: `translate(${dx}px, ${dy}px) scale(1.25)`, opacity: 0.4 }, { transform: 'none', opacity: 1 }], 750);
}

/* =============================== warm-up: The Great Race =============================== */
const RACERS = [
  { k: 'rabbit', name: 'Rabbit', m: 10, b: 0, col: '#7850aa', eq: 'd=10t', lab: [1.25, 5.5], ipos: 'se' },
  { k: 'turtle', name: 'Turtle', m: 5, b: 30, col: '#1e8c50', eq: 'd=5t+30', lab: [1.0, 27.5], ipos: 'e' },
  { k: 'snail', name: 'Snail', m: 2.5, b: 50, col: '#c86e14', eq: 'd=2.5t+50', lab: [0.7, 46], ipos: 'e' }
];
function mountRace() {
  const host = document.getElementById('u7l9-race'); if (!host) return;
  const G = new Graph(host, { width: 580, height: 410, xmin: 0, xmax: 8, ymin: 0, ymax: 70, xstep: 1, ystep: 5, ylabels: 10,
    xtitle: 't\\text{ (min)}', ytitle: 'd\\text{ (m)}', origin: true, pad: [24, 54, 34, 44] });
  // the finish line: a checkered strip at 60 m
  const [fx0, fy] = G.toPx(0, 60), fx1 = G.toPx(8, 0)[0], sq = (fx1 - fx0) / 32, fin = svgEl('g', {}, G.layers.bg);
  for (let i = 0; i < 32; i++) for (let j = 0; j < 2; j++) svgEl('rect', { x: fx0 + i * sq, y: fy - sq + j * sq, width: sq, height: sq, fill: (i + j) % 2 ? '#1c2230' : '#fff' }, fin);
  svgEl('rect', { x: fx0, y: fy - sq, width: fx1 - fx0, height: 2 * sq, fill: 'none', stroke: INK, 'stroke-width': 1 }, fin);
  G.label(1.7, 65.5, 'FINISH LINE: 60 m', { cls: 'u7l9-finish' });
  const st = { T: 2 }, fins = [], eqs = [];
  RACERS.forEach((R) => {
    const fT = (60 - R.b) / R.m; R.fT = fT;
    R.ln = G.curve(() => { const t1 = Math.min(st.T, fT); return { subs: [[G.toPx(0, R.b), G.toPx(t1, R.b + R.m * t1)]] }; }, { color: R.col, width: 5 }, 'u7l9-rline', G.layers.data);
    G.point(0, R.b, { color: R.col, r: 6 });
    R.end = G.point(2, R.b + 2 * R.m, { color: R.col, r: 6 });
    R.icon = G.label(2, R.b + 2 * R.m, RACER_SVG[R.k], { pos: R.ipos, gap: 4, cls: 'u7l9-racer' });
    G.label(R.lab[0], R.lab[1], R.name, { cls: 'u7l9-rname', color: R.col });
  });
  // fog over the rest of the race
  const [gx0, gy0] = G.toPx(2.02, 70), [gx1, gy1] = G.toPx(8, 0);
  const fog = add(G.html, box(h('div', 'u7l9-fog', '<b>?</b><i>fog…</i>'), gx1 - gx0, gy1 - gy0), gx0, gy0);
  const note = document.getElementById('u7l9-wnote'), eqBox = document.getElementById('u7l9-weqs');
  if (eqBox) RACERS.forEach((R) => { const e = h('span', 'u7l9-req', `<b>${R.name}</b> ${T(R.eq)}`); e.style.color = R.col; eqBox.appendChild(e); eqs.push(e); });
  const paint = () => RACERS.forEach((R) => { const t1 = Math.min(st.T, R.fT); R.ln._bkDraw(); G.moveTo(R.end, t1, R.b + R.m * t1); G.moveTo(R.icon, t1, R.b + R.m * t1); });
  let busy = false;
  const fogBtn = document.getElementById('u7l9-wfog'), eqBtn = document.getElementById('u7l9-weq'), rs = document.getElementById('u7l9-wreset');
  if (fogBtn) fogBtn.onclick = async () => {
    if (busy || st.T > 2) return; busy = true; fogBtn.classList.add('on');
    fog.style.opacity = 0;
    const c = liveCtx();
    await tween(c, 4200, (t) => { st.T = 2 + 4.6 * t; paint(); RACERS.forEach((R) => { if (st.T >= R.fT - 1e-9 && !R.done) { R.done = true; const f = G.label(R.fT, 60, `${R.fT} min`, { pos: 'n', gap: 26, cls: 'u7l9-ftime', color: R.col }); fins.push(f); pop(c, f); } }); }, linear);
    if (note) note.innerHTML = '<b>The snail wins</b> at 4 min! The rabbit and the turtle <b>tie</b> for second at 6 min. Head starts matter.';
    busy = false;
  };
  if (eqBtn) eqBtn.onclick = () => { eqBtn.classList.add('on'); if (eqBox) eqBox.classList.add('on'); eqs.forEach((e) => pop(liveCtx(), e)); if (note && st.T <= 2) note.innerHTML = 'The slope is the <b>speed</b> (m per minute); the <i>y</i>-intercept is the <b>head start</b>.'; };
  if (rs) rs.onclick = () => {
    if (busy) return; st.T = 2; paint(); fog.style.opacity = ''; fins.splice(0).forEach((f) => f.remove()); RACERS.forEach((R) => (R.done = false));
    if (eqBox) eqBox.classList.remove('on'); [fogBtn, eqBtn].forEach((b) => b && b.classList.remove('on'));
    if (note) note.innerHTML = 'Nobody changes speed. Guess first, then lift the fog.';
  };
}

/* =============================== Example 5 figures =============================== */
const FIG5 = { width: 470, height: 380, xmin: 0, xmax: 520, ymin: 0, ymax: 130, xstep: 50, ystep: 10, xlabels: 100, ylabels: 20,
  xtitle: 'd\\text{ (km)}', ytitle: 'C\\text{ (\\$)}', origin: true, pad: [22, 46, 34, 46] };
function mountFigures() {
  const e5 = document.getElementById('u7l9-ex5fig');
  if (e5) {
    const G = new Graph(e5, Object.assign({}, FIG5, {
      interactive: { snap: 10, max: 4, color: 'blue', onChange: () => {
        (G.userPts || []).forEach((p) => { const sx = Math.round(p.gx / 50) * 50; if (sx !== p.gx) G.moveTo(p, sx, p.gy); });
      } }
    }));
  }
  const a5 = document.getElementById('u7l9-ex5ans');
  if (a5) {
    const G = new Graph(a5, Object.assign({}, FIG5, { width: 400, height: 320, fontSize: 15 }));
    G.segment([0, 30], [500, 130], { color: RED, width: 3.5 }); G.segment([0, 50], [500, 100], { color: PUR, width: 3.5 });
    [[0, 30, RED], [400, 110, RED], [0, 50, PUR], [400, 90, PUR]].forEach(([x, y, c]) => G.point(x, y, { color: c, r: 5.5 }));
    G.point(200, 70, { color: INK, r: 6.5, label: T('(200,\\ 70)'), pos: 'nw', labelCls: 'u7l9-small' });
    G.label(330, 110, '<b>A</b>', { pos: 'nw', cls: 'bk-ptlab', color: RED }); G.label(450, 92, '<b>B</b>', { pos: 'se', cls: 'bk-ptlab', color: PUR });
  }
}

/* =============================== explainer 1: a rate of change, in a story and its graph =============================== */
const RA = {
  ex1a: { label: 'Example 1(a) check: courier', kind: 'road', icon: 'car', Y: 'd', X: 't', m: 70, b: 0, x1: 4.2, steps: 4,
    g: { xmin: 0, xmax: 4.6, ymin: 0, ymax: 300, xstep: 1, ystep: 35, ylabels: 70, xtitle: 't\\text{ (h)}', ytitle: 'd\\text{ (km)}', origin: true },
    yw: 'kilometres', xws: 'hours', yu: 'km', xw: 'hour', qty: 'courier’s distance', read: (v) => `${Math.round(v)} km`, clock: (t) => `${t.toFixed(1)} h` },
  ex1b: { label: 'Example 1(b) check: propane tank', kind: 'tank', tlabel: 'PROPANE', fill: '#6fa8dc', Y: 'V', X: 't', m: -6, b: 40, x1: 6.5, steps: 5,
    g: { xmin: 0, xmax: 7.4, ymin: 0, ymax: 46, xstep: 1, ystep: 2, ylabels: 10, xtitle: 't\\text{ (min)}', ytitle: 'V\\text{ (L)}', origin: true },
    yw: 'litres', xws: 'minutes', yu: 'L', xw: 'minute', qty: 'volume of propane', read: (v) => `${n(r1(v))} L`, clock: (t) => `${t.toFixed(1)} min` },
  turtle: { label: 'Warm-up: the turtle', kind: 'road', icon: 'turtle', Y: 'd', X: 't', m: 5, b: 30, x1: 6, steps: 5,
    g: { xmin: 0, xmax: 6.6, ymin: 0, ymax: 66, xstep: 1, ystep: 5, ylabels: 10, xtitle: 't\\text{ (min)}', ytitle: 'd\\text{ (m)}', origin: true },
    yw: 'metres', xws: 'minutes', yu: 'm', xw: 'minute', qty: 'turtle’s distance', read: (v) => `${n(r1(v))} m`, clock: (t) => `${t.toFixed(1)} min` }
};
const rate = {
  title: 'A rate of change: the same change every step',
  height: 470,
  minW: 940,
  choices: Object.keys(RA).map((k) => ({ v: k, label: RA[k].label })),
  intro: (k) => `The story beside the vertical axis uses the same scale as the graph of ${T(eqTex(RA[k].Y, RA[k].X, RA[k].m, RA[k].b, false))}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = RA[k], f = (x) => d.m * x + d.b, up = d.m > 0, M = Math.abs(d.m);
    const G = new Graph(stage, Object.assign({}, d.g, { x: 146, y: 14, width: 450, height: 440 }));
    const col = new Column(stage, G, 14, 14, d.kind, { icon: d.icon, label: d.tlabel, fill: d.fill, read: d.read, start: f(0) });
    const P = panel(stage, 610, 14, ex.W - 624, 440, 'Rate of change');
    const eq = h('div', 'u7l9-bigeq', T(eqTex(d.Y, d.X, d.m, d.b))); P.appendChild(eq); hide(eq);
    const clk = pill(P, `time: ${d.clock(0)}`, 'u7l9-clock'); hide(clk);
    const tr = tracer(G, f, { from: 0, onMove: (x, y) => { col.set(y); clk.innerHTML = `time: <b>${d.clock(x)}</b>`; } });
    tr.hideDot(); tr.guides(false);
    const sign = up ? '+' : '−';
    return [
      { cap: `Compare ${T(eqTex(d.Y, d.X, d.m, d.b, false))} with ${T('y=mx+b')}. The slope is the number in front of ${T(d.X)}: ${T(`m=${cM(tn(d.m))}`)}.`,
        run: async (c) => { await show(c, eq); await show(c, line(P, T(`m=${cM(tn(d.m))}`), 'u7l9-mline')); } },
      { cap: `Watch the story while the point traces the graph. The ${d.qty} beside the vertical axis is the height of the point.`,
        run: async (c) => { tr.showDot(); tr.guides(true); await show(c, clk); await tr.go(c, d.x1, 3200); } },
      { cap: `Every <b>1 ${d.xw}</b>, the ${d.qty} goes ${up ? 'up' : 'down'} by <b>${M} ${d.yu}</b>: the <b>same</b> change every ${d.xw}. A steady change like this is a <b>rate of change</b>.`,
        run: async (c) => {
          tr.hideDot(); tr.guides(false);
          for (let i = 0; i < d.steps; i++) {
            const s = new SlopeTri(G, { x: i, y: f(i), run: 1, rise: d.m }, { labels: false, fillOp: 0.18, w: 4 }); await s.drawIn(c, 200);
            const l = G.label(i + 1, f(i) + d.m / 2, `${sign}${M}`, { pos: 'e', cls: 'u7l9-bub', gap: 5 }); await pop(c, l, 200);
            col.set(f(i + 1));
          }
          await show(c, line(P, `each ${d.xw}: <b class="u7l9-c-rise">${sign}${M} ${d.yu}</b>`));
        } },
      { cap: `Units: ${T(d.Y)} is in ${d.yw} and ${T(d.X)} is in ${d.xws}, so the slope is in <b>${d.yu} per ${d.xw}</b>: units of ${T('y')} per unit of ${T('x')}.`,
        run: async (c) => { await show(c, line(P, `${T(`m=${cM(tn(d.m))}`)} <b>${d.yu} per ${d.xw}</b>`, 'u7l9-mline u7l9-units')); } },
      { cap: `The slope is ${up ? 'positive' : 'negative'}, so the ${d.qty} is <b>${up ? 'increasing' : 'decreasing'}</b>. Say it with units: “The ${d.qty} is ${up ? 'increasing' : 'decreasing'} by ${M} ${d.yu} per ${d.xw}.”`,
        run: async (c) => {
          await show(c, line(P, `The ${d.qty} is <b>${up ? 'increasing' : 'decreasing'}</b> by <b>${M} ${d.yu} per ${d.xw}</b>.`, 'u7l9-sent'));
          const st = stamp(P, 'with units', { ok: true }); st.classList.add('u7l9-stampb'); await stampIn(c, st);
        } }
    ];
  }
};

/* =============================== explainer 2: say it as a sentence =============================== */
const SE = {
  ex1a: { label: 'Example 1(a) check', story: `A courier’s distance is ${T('d=70t')}, where <span class="u7l9-src" data-s="y">${T('d')} is in kilometres</span> and <span class="u7l9-src" data-s="x">${T('t')} is in hours</span>.`,
    m: 70, X: 't', qty: 'distance', yu: 'km', xw: 'hour', note: '70 km per hour is the courier’s speed: 70 km/h.' },
  ex1b: { label: 'Example 1(b) check', story: `A propane tank holds ${T('V=-6t+40')}, where <span class="u7l9-src" data-s="y">${T('V')} is in litres</span> and <span class="u7l9-src" data-s="x">${T('t')} is in minutes</span> since lighting.`,
    m: -6, X: 't', qty: 'propane', yu: 'L', xw: 'minute', note: 'The tank loses 6 L every minute.' },
  turtle: { label: 'Warm-up: the turtle', story: `The turtle’s distance is ${T('d=5t+30')}, where <span class="u7l9-src" data-s="y">${T('d')} is in metres</span> and <span class="u7l9-src" data-s="x">${T('t')} is in minutes</span>.`,
    m: 5, X: 't', qty: 'turtle’s distance', yu: 'm', xw: 'minute', note: '5 m per minute is the turtle’s speed.' }
};
const sentence = {
  title: 'A rate is a sentence with units',
  height: 400,
  minW: 900,
  choices: Object.keys(SE).map((k) => ({ v: k, label: SE[k].label })),
  intro: 'Four blanks: the direction, the number, the units of <i>y</i> and the units of <i>x</i>. The equation and its units fill them all. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SE[k], up = d.m > 0, M = Math.abs(d.m), W = ex.W;
    const story = add(stage, box(h('div', 'u7l9-story', d.story), W - 28, 96), 14, 12);
    const srcY = story.querySelector('[data-s="y"]'), srcX = story.querySelector('[data-s="x"]');
    const mBox = add(stage, box(h('div', 'u7l9-scale', T(`m=${cM(tn(d.m))}`)), 210, 80), 14, 136); hide(mBox);
    const sent = add(stage, box(h('div', 'u7l9-template', `The ${d.qty} is <span class="u7l9-sb"></span> by <span class="u7l9-sb u7l9-sbs"></span> <span class="u7l9-sb u7l9-sbs"></span> per <span class="u7l9-sb u7l9-sbs"></span>.`), W - 266, 150), 238, 124);
    const slots = [...sent.querySelectorAll('.u7l9-sb')];
    const why = add(stage, box(h('div', 'u7l9-why'), W - 266, 40), 238, 282);
    const tail = add(stage, box(h('div', 'u7l9-tail'), W - 28, 70), 14, 326);
    return [
      { cap: `The slope is the number in front of ${T(d.X)}: ${T(`m=${tn(d.m)}`)}.`,
        run: async (c) => { await pop(c, mBox); } },
      { cap: `The <b>sign</b>: ${T(tn(d.m))} is ${up ? 'positive' : 'negative'}, so the ${d.qty} is <b>${up ? 'increasing' : 'decreasing'}</b>.`,
        run: async (c) => { await fly(c, stage, mBox, slots[0], `<b>${up ? 'increasing' : 'decreasing'}</b>`); why.innerHTML = up ? 'positive slope → increasing' : 'negative slope → decreasing'; await show(c, why); } },
      { cap: `The <b>size</b>: ${T(String(M))} goes in the number blank${up ? '' : `. The minus sign is already in the word “decreasing”, so write ${T(String(M))}, not ${T(tn(d.m))}`}.`,
        run: async (c) => { await fly(c, stage, mBox, slots[1], `<b>${M}</b>`); } },
      { cap: `The units of ${T('y')}: ${srcY.textContent.trim()}, so <b>${d.yu}</b>. That is what changes.`,
        run: async (c) => { srcY.classList.add('u7l9-srcon'); await pulse(c, srcY, 1.08); await fly(c, stage, srcY, slots[2], `<b>${d.yu}</b>`); } },
      { cap: `…<b>per</b> one unit of ${T('x')}: ${srcX.textContent.trim()}, so per <b>${d.xw}</b>.`,
        run: async (c) => { srcX.classList.add('u7l9-srcon'); await pulse(c, srcX, 1.08); await fly(c, stage, srcX, slots[3], `<b>${d.xw}</b>`); } },
      { cap: `“The ${d.qty} is ${up ? 'increasing' : 'decreasing'} by ${M} ${d.yu} per ${d.xw}.” ${d.note} Not just “${n(d.m)}”.`,
        run: async (c) => {
          const bad = line(tail, `not just <s>${n(d.m)}</s>: name the <b>quantity</b>, the <b>rate</b> and the <b>units</b>.`, 'u7l9-bad'); await show(c, bad);
          const st = stamp(tail, 'complete', { ok: true }); st.classList.add('u7l9-stampr'); await stampIn(c, st);
        } }
    ];
  }
};

/* =============================== explainer 3: rewind to the start =============================== */
const ST = {
  ex2a: { label: 'Example 2(a) check: coffee card', kind: 'tank', tlabel: 'CARD $', fill: '#5fb48a', Y: 'B', X: 'n', m: -4, b: 60, x0: 6,
    g: { xmin: 0, xmax: 15.6, ymin: 0, ymax: 66, xstep: 1, ystep: 4, xlabels: 5, ylabels: 20, xtitle: 'n\\text{ (coffees)}', ytitle: 'B\\text{ (\\$)}', origin: true },
    read: (v) => `$${Math.round(v)}`, unit: (v) => `$${v}`, now: 'After 6 coffees, the card has $36 left.', who: 'no coffees have been bought yet',
    notper: '$60 per coffee', meaning: 'the <b>starting balance</b> on the card, before any coffees are bought' },
  ex2b: { label: 'Example 2(b) check: tree', kind: 'tree', Y: 'H', X: 't', m: 20, b: 150, x0: 5,
    g: { xmin: 0, xmax: 8.6, ymin: 0, ymax: 340, xstep: 1, ystep: 25, ylabels: 50, xtitle: 't\\text{ (years)}', ytitle: 'H\\text{ (cm)}', origin: true },
    read: (v) => `${Math.round(v)} cm`, unit: (v) => `${v} cm`, now: 'Five years after planting, the tree is 250 cm tall.', who: 'the tree has just been planted',
    notper: '150 cm per year', meaning: 'the tree’s <b>height at the moment it was planted</b>' },
  turtle: { label: 'Warm-up: the turtle', kind: 'road', icon: 'turtle', Y: 'd', X: 't', m: 5, b: 30, x0: 4,
    g: { xmin: 0, xmax: 6.6, ymin: 0, ymax: 66, xstep: 1, ystep: 5, ylabels: 10, xtitle: 't\\text{ (min)}', ytitle: 'd\\text{ (m)}', origin: true },
    read: (v) => `${n(r1(v))} m`, unit: (v) => `${v} m`, now: 'After 4 minutes, the turtle is 50 m from the start.', who: 'the race has not started yet',
    notper: '30 m per minute', meaning: 'the turtle’s <b>head start</b>' }
};
const start = {
  title: 'Rewind to the start: the y-intercept',
  height: 470,
  minW: 940,
  choices: Object.keys(ST).map((k) => ({ v: k, label: ST[k].label })),
  intro: (k) => `${T(eqTex(ST[k].Y, ST[k].X, ST[k].m, ST[k].b, false))}. We start part-way through the story, then rewind. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = ST[k], f = (x) => d.m * x + d.b, y0 = f(d.x0);
    const G = new Graph(stage, Object.assign({}, d.g, { x: 146, y: 14, width: 450, height: 440 }));
    const col = new Column(stage, G, 14, 14, d.kind, { icon: d.icon, label: d.tlabel, fill: d.fill, read: d.read, start: y0 });
    const P = panel(stage, 610, 14, ex.W - 624, 440, 'The starting value');
    const ln = G.line({ m: d.m, b: d.b }, { color: LINE, width: 3, arrows: false }); ln.style.opacity = 0.35;
    const eq = h('div', 'u7l9-bigeq', T(eqTex(d.Y, d.X, d.m, d.b, false))); P.appendChild(eq);
    let tr = null;
    return [
      { cap: `${T(eqTex(d.Y, d.X, d.m, d.b, false))}. ${d.now}`,
        run: async (c) => {
          tr = tracer(G, f, { from: d.x0, onMove: (x, y) => col.set(y) });
          await pop(c, tr.dot); await show(c, line(P, `now: ${T(`${d.X}=${d.x0},\\ ${d.Y}=${tn(y0)}`)}`, 'u7l9-soft'));
        } },
      { cap: `<b>Rewind</b> the story to the very start, ${T(`${d.X}=0`)}: ${d.who}.`,
        run: async (c) => { await tr.go(c, 0, 2200); } },
      { cap: `At ${T(`${d.X}=0`)} the graph meets the vertical axis at ${T(tn(d.b))}: the ${T('y')}-intercept. In the equation it is the number on its own: ${T(`b=${d.b}`)}.`,
        run: async (c) => {
          tr.hideDot(); tr.guides(false);
          const bp = G.point(0, d.b, { color: BCOL, r: 10 }); await pop(c, bp);
          eq.innerHTML = T(eqTex(d.Y, d.X, d.m, d.b, false).replace(new RegExp(`\\+${d.b}$`), `+${cB(String(d.b))}`)); await pulse(c, eq, 1.06);
          await show(c, line(P, T(`${cB('b=' + d.b)}`), 'u7l9-mline'));
        } },
      { cap: `Units: <b>${d.unit(d.b)}</b>, just the units of ${T(d.Y)}. The start has no “per”: not “${d.notper}”.`,
        run: async (c) => { await show(c, line(P, `<b>${d.unit(d.b)}</b> &nbsp;<span class="u7l9-badi">not <s>${d.notper}</s></span>`, 'u7l9-mline')); } },
      { cap: `So ${T(`b=${d.b}`)} is ${d.meaning}.`,
        run: async (c) => {
          await show(c, line(P, `${T(`b=${d.b}`)}: ${d.meaning}.`, 'u7l9-sent u7l9-sentb'));
          const st = stamp(P, 'starting value', { ok: true }); st.classList.add('u7l9-stampb'); await stampIn(c, st);
        } }
    ];
  }
};

/* =============================== explainer 4: from words to an equation =============================== */
const BU = {
  ex3: { label: 'Example 3(a) check: locksmith', story: 'A locksmith charges a <span class="u7l9-tk u7l9-tkb">$35 service call fee</span>, plus <span class="u7l9-tk u7l9-tkm">$20 for every lock</span> changed.',
    m: 20, b: 35, Y: 'C', X: 'n', xw: 'lock', xws: 'locks', nmax: 5, whyB: 'paid even if no locks are changed', sig: '“For every”',
    g: { xmin: -0.6, xmax: 5.7, ymin: 0, ymax: 150, xstep: 1, ystep: 10, ylabels: 20, xtitle: 'n\\text{ (locks)}', ytitle: 'C\\text{ (\\$)}' } },
  bowl: { label: 'Bowling: shoes plus games', story: 'Bowling costs <span class="u7l9-tk u7l9-tkb">$6 to rent shoes</span>, plus <span class="u7l9-tk u7l9-tkm">$5 for every game</span> you play.',
    m: 5, b: 6, Y: 'C', X: 'g', xw: 'game', xws: 'games', nmax: 5, whyB: 'paid once, even before any games', sig: '“For every”',
    g: { xmin: -0.6, xmax: 5.7, ymin: 0, ymax: 36, xstep: 1, ystep: 1, ylabels: 5, xtitle: 'g\\text{ (games)}', ytitle: 'C\\text{ (\\$)}' } }
};
const build = {
  title: 'From words to an equation',
  height: 470,
  minW: 940,
  choices: Object.keys(BU).map((k) => ({ v: k, label: BU[k].label })),
  intro: 'Find the rate, find the start, write the equation, then see where the line comes from. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = BU[k], W = ex.W, f = (x) => d.m * x + d.b;
    const story = add(stage, box(h('div', 'u7l9-story', d.story), W - 28, 66), 14, 10);
    const tkM = story.querySelector('.u7l9-tkm'), tkB = story.querySelector('.u7l9-tkb');
    const P = panel(stage, 14, 88, 330, 370, 'The equation', 'u7l9-big');
    const G = new Graph(stage, Object.assign({}, d.g, { x: 358, y: 88, width: W - 372, height: 370, numbers: true, pad: [20, 20, 34, 46] }));
    const bars = [], ux = G.ux, bw = 0.5;
    const bar = (i) => {
      const g = svgEl('g', { class: 'u7l9-bar' }, G.layers.bg);   // under the grid and axis numbers
      const [x0, yb] = G.toPx(i - bw / 2, 0), [, yB] = G.toPx(0, d.b);
      svgEl('rect', { x: x0, y: yB, width: bw * ux, height: yb - yB, fill: BCOL, 'fill-opacity': 0.8 }, g);
      for (let j = 0; j < i; j++) { const [, y1] = G.toPx(0, d.b + d.m * (j + 1)), [, y2] = G.toPx(0, d.b + d.m * j); svgEl('rect', { x: x0, y: y1, width: bw * ux, height: y2 - y1, fill: LINE, 'fill-opacity': 0.75, stroke: '#fff', 'stroke-width': 1.5 }, g); }
      const lab = G.label(i, f(i), `$${f(i)}`, { pos: i ? 'n' : 'ne', gap: 6, dx: i ? 0 : 4, cls: 'u7l9-barlab' });
      return { g, lab };
    };
    return [
      { cap: `Find the <b class="u7l9-c-m">rate</b>. ${d.sig} (or “per”) signals the slope: $${d.m} per ${d.xw}, so ${T(`m=${d.m}`)}.`,
        run: async (c) => { tkM.classList.add('u7l9-tkon'); await pulse(c, tkM, 1.06); await show(c, line(P, T(cM(`m=${d.m}`)), 'u7l9-mline')); } },
      { cap: `Find the <b class="u7l9-c-b">starting value</b>. The flat fee is ${d.whyB}: ${T(`b=${d.b}`)}.`,
        run: async (c) => { tkB.classList.add('u7l9-tkon'); await pulse(c, tkB, 1.06); await show(c, line(P, T(cB(`b=${d.b}`)), 'u7l9-mline')); } },
      { cap: `Write ${T('y=mx+b')} with letters that match the story: ${T(d.Y)} for the cost, ${T(d.X)} for the number of ${d.xws}. ${T(`${d.Y}=${d.m}${d.X}+${d.b}`)}.`,
        run: async (c) => { const e = h('div', 'u7l9-bigeq', T(eqTex(d.Y, d.X, d.m, d.b))); P.appendChild(e); await pop(c, e); } },
      { cap: `Build the bill for 0, 1, 2, … ${d.xws}: the <b class="u7l9-c-b">$${d.b}</b> fee every time, plus another <b class="u7l9-c-m">$${d.m}</b> for each ${d.xw}.`,
        run: async (c) => { for (let i = 0; i <= d.nmax; i++) { const b = bar(i); bars.push(b); await appear(c, b.g, 260); await pop(c, b.lab, 200); } } },
      { cap: `The bar tops go up by the same $${d.m} each time, starting at $${d.b}. They sit on a straight line: the graph of ${T(`${d.Y}=${d.m}${d.X}+${d.b}`)}.`,
        run: async (c) => {
          bars.forEach((b) => (b.g.style.opacity = 0.5));
          for (let i = 0; i <= d.nmax; i++) await pop(c, G.point(i, f(i), { color: INK, r: 6 }), 120);
          await G.drawIn(G.segment([0, f(0)], [d.nmax + 0.5, f(d.nmax + 0.5)], { color: LINE, width: 4 }), 700, c);
          await show(c, line(P, `starts at <b class="u7l9-c-b">$${d.b}</b>, climbs <b class="u7l9-c-m">$${d.m}</b> per ${d.xw}`, 'u7l9-soft'));
        } }
    ];
  }
};

/* =============================== explainer 5: forwards and backwards =============================== */
const MC = {
  ex3: { label: 'Example 3(b) and (c) check', eq: 'C=20n+35', inV: 'n', outV: 'C', ops: [{ f: '\\times20', b: '\\div20', fn: (x) => 20 * x, inv: (y) => y / 20 }, { f: '+35', b: '-35', fn: (x) => x + 35, inv: (y) => y - 35 }],
    fwd: 5, back: 175, fwdCap: '(b) 5 locks go in.', backCap: '(c) The bill was <b>$175</b>. How many locks?', ansCap: (v) => `<b>${n(v)} locks</b> were changed.` },
  ex4d: { label: 'Example 4(d) check', eq: 'H=-0.4t+18', inV: 't', outV: 'H', ops: [{ f: '\\times(-0.4)', b: '\\div(-0.4)', fn: (x) => -0.4 * x, inv: (y) => y / -0.4 }, { f: '+18', b: '-18', fn: (x) => x + 18, inv: (y) => y - 18 }],
    fwd: 10, back: 0, fwdCap: 'Forwards: 10 minutes go in (the first data point).', backCap: '(d) When is the height <b>0 cm</b>?', ansCap: (v) => `It burns out after <b>${n(v)} minutes</b>.` },
  bowl: { label: 'Bowling: C = 5g + 6', eq: 'C=5g+6', inV: 'g', outV: 'C', ops: [{ f: '\\times5', b: '\\div5', fn: (x) => 5 * x, inv: (y) => y / 5 }, { f: '+6', b: '-6', fn: (x) => x + 6, inv: (y) => y - 6 }],
    fwd: 3, back: 41, fwdCap: 'Forwards: 3 games.', backCap: 'Backwards: you paid <b>$41</b>. How many games?', ansCap: (v) => `You played <b>${n(v)} games</b>.` }
};
const machine = {
  title: 'The equation as a machine: forwards and backwards',
  height: 440,
  minW: 860,
  choices: Object.keys(MC).map((k) => ({ v: k, label: MC[k].label })),
  intro: (k) => `${T(MC[k].eq)}: multiply, then add. Backwards, undo the last step first. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = MC[k], W = ex.W, xs = [0.11, 0.37, 0.63, 0.89].map((f) => f * W), y = 120, bw = 160, bh = 66;
    const svg = add(stage, svgEl('svg', { width: W, height: 230, viewBox: `0 0 ${W} 230` }), 0, 0);
    const node = (i, html, cls) => add(stage, box(h('div', 'u7l9-mnode ' + cls, html), bw, bh), xs[i] - bw / 2, y - bh / 2);
    node(0, T(d.inV), 'u7l9-mio'); node(1, T(d.ops[0].f), 'u7l9-mop'); node(2, T(d.ops[1].f), 'u7l9-mop'); node(3, T(d.outV), 'u7l9-mio');
    const arrow = (x1, x2, yy, color) => { const g = svgEl('g', {}, svg); svgEl('line', { x1, x2, y1: yy, y2: yy, stroke: color, 'stroke-width': 4, class: 'bk-stroke' }, g); const s = Math.sign(x2 - x1); svgEl('polygon', { points: `${x2},${yy} ${x2 - s * 14},${yy - 8} ${x2 - s * 14},${yy + 8}`, fill: color }, g); return g; };
    const fa = [0, 1, 2].map((i) => arrow(xs[i] + bw / 2 + 4, xs[i + 1] - bw / 2 - 4, y - 14, LINE));
    const ba = [0, 1, 2].map((i) => { const g = arrow(xs[i + 1] - bw / 2 - 4, xs[i] + bw / 2 + 4, y + 18, NOW); g.style.display = 'none'; return g; });
    const binv = [1, 2].map((i) => { const e = add(stage, h('div', 'u7l9-minv', T(d.ops[i - 1].b)), xs[i], y + bh / 2 + 6); e.style.translate = '-50% 0'; e.style.display = 'none'; return e; });
    const val = (i, v, row) => { const e = add(stage, h('div', 'u7l9-mval u7l9-mval-' + row, T(tn(v))), xs[i], row === 'f' ? y - bh / 2 - 44 : y + bh / 2 + 52); e.style.translate = '-50% 0'; return e; };
    const A = add(stage, box(h('div', 'u7l9-malg u7l9-big'), W - 28, 186), 14, 240);
    const f1 = rr(d.ops[0].fn(d.fwd)), f2 = rr(d.ops[1].fn(f1)), b1 = rr(d.ops[1].inv(d.back)), b2 = rr(d.ops[0].inv(b1));
    const [o0, o1] = d.ops, rhs = d.eq.split('=')[1], mx = rhs.split(/[+-](?=\d+$)/)[0];
    return [
      { cap: `${T(d.eq)} as a machine: ${T(d.inV)} goes in, is multiplied (${T(o0.f)}), then has a number added (${T(o1.f)}), and ${T(d.outV)} comes out.`,
        run: async (c) => { for (const a of fa) await drawIn(a.firstChild, 300, c); } },
      { cap: `${d.fwdCap} ${T(`${tn(d.fwd)}${o0.f.replace('\\times', '\\times ')}=${tn(f1)}`)}, then ${T(`${tn(f1)}${o1.f}=${tn(f2)}`)}.`,
        run: async (c) => {
          for (const [i, v] of [[0, d.fwd], [1, f1], [3, f2]]) await pop(c, val(i, v, 'f'), 260);
          await show(c, line(A, `forwards: ${T(`${d.outV}=${rhs.replace(d.inV, `(${tn(d.fwd)})`)}=${tn(f2)}`)}`, 'u7l9-mline'));
        } },
      { cap: `${d.backCap} Run the machine <b>in reverse</b>: undo the last step first (${T(o1.b)}), then the first (${T(o0.b)}).`,
        run: async (c) => { for (const a of ba) { a.style.display = ''; await drawIn(a.firstChild, 260, c); } for (const e of binv) { e.style.display = ''; await pop(c, e, 240); } await pop(c, val(3, d.back, 'b'), 260); } },
      { cap: `Undo ${T(o1.f)}: ${T(`${tn(d.back)}${o1.b}=${tn(b1)}`)}.`,
        run: async (c) => { await pop(c, val(1, b1, 'b'), 260); await show(c, line(A, `backwards: ${T(`${tn(d.back)}=${rhs}`)} → ${T(`${tn(b1)}=${mx}`)}`, 'u7l9-mline')); } },
      { cap: `Undo ${T(o0.f)}: ${T(`${tn(b1)}${o0.b}=${tn(b2)}`)}. ${d.ansCap(b2)}`,
        run: async (c) => {
          await pop(c, val(0, b2, 'b'), 260);
          await show(c, line(A, T(`${d.inV}=${tn(b2)}`), 'u7l9-mline'));
          const s = stamp(A, 'undone', { ok: true }); s.classList.add('u7l9-mstamp'); await stampIn(c, s);
        } }
    ];
  }
};

/* =============================== explainer 6: the candle (two data points) =============================== */
const candleF = (t) => 18 - 0.4 * t;
const candle = {
  title: 'The candle: two data points to an equation',
  height: 480,
  minW: 940,
  choices: [{ v: 'ex4', label: 'Example 4 check' }],
  intro: 'The candle beside the height axis uses the same scale as the graph. Time runs along the bottom. Press <b>Next</b>.',
  make(stage, k, ex) {
    const G = new Graph(stage, { x: 146, y: 14, width: 450, height: 450, xmin: 0, xmax: 50, ymin: 0, ymax: 20, xstep: 5, ystep: 1, xlabels: 10, ylabels: 2,
      xtitle: '', ytitle: 'H\\text{ (cm)}', origin: true, pad: [18, 18, 52, 42] });
    G.label(25, 0, T('t\\text{ (minutes)}'), { pos: 's', gap: 24, clip: false, cls: 'u7l9-axt2' });
    const col = new Column(stage, G, 14, 14, 'candle', { read: (v) => `${n(r1(v))} cm`, start: 14 });
    const P = panel(stage, 610, 14, ex.W - 624, 450, 'Height of the candle');
    const clk = pill(P, 'time: <b>10 min</b>', 'u7l9-clock');
    const sync = (x, y) => { col.set(y); clk.innerHTML = `time: <b>${n(Math.round(x))} min</b>`; };
    let tr = null, Tr = null;
    return [
      { cap: `After ${T('10')} minutes the candle is ${T('14')} cm tall: the point ${T('(10,\\ 14)')}. Let it burn to ${T('25')} minutes: ${T('8')} cm, the point ${T('(25,\\ 8)')}.`,
        run: async (c) => {
          await G.reveal(G.point(10, 14, { color: INK, r: 7, coords: true, pos: 'ne' }), c);
          tr = tracer(G, candleF, { from: 10, onMove: sync }); await tr.go(c, 25, 2400);
          await G.reveal(G.point(25, 8, { color: INK, r: 7, coords: true, pos: 'ne' }), c);
        } },
      { cap: `From ${T('(10,\\ 14)')} to ${T('(25,\\ 8)')}: the run is ${T(cU('15\\text{ min}'))} and the rise is ${T(cR('-6\\text{ cm}'))}. It burned 6 cm in 15 minutes.`,
        run: async (c) => { tr.guides(false); tr.hideDot(); Tr = new SlopeTri(G, { x: 10, y: 14, run: 15, rise: -6 }, { runSide: 'n', runText: () => '<b>run</b> 15 min', riseText: () => '<b>rise</b> −6 cm' }); await Tr.drawIn(c, 550); } },
      { cap: `${T(`m=\\dfrac{8-14}{25-10}=\\dfrac{-6}{15}=${cM('-0.4')}`)}. The candle burns down <b>0.4 cm per minute</b>.`,
        run: async (c) => { await show(c, line(P, T(`m=\\dfrac{-6}{15}=${cM('-0.4')}`), 'u7l9-mline')); await show(c, line(P, '<b>0.4 cm per minute</b>, decreasing', 'u7l9-soft')); } },
      { cap: `Write ${T('H=-0.4t+b')}, where ${T('t')} is the number of <b>minutes</b>. Substitute ${T('(10,\\ 14)')}: ${T('14=-0.4(10)+b')}, so ${T('14=-4+b')} and ${T('b=18')}.`,
        run: async (c) => {
          await show(c, line(P, T('14=-0.4(10)+b'), 'u7l9-mline'));
          await show(c, line(P, T(`14=-4+b\\ \\Rightarrow\\ ${cB('b=18')}`), 'u7l9-mline'));
        } },
      { cap: `${T('b')} is the height at ${T('t=0')}, <b>before it was lit</b>. Rewind: the candle grows back to ${T('18')} cm. ${T(`H=${cM('-0.4')}t+${cB('18')}`)}.`,
        run: async (c) => {
          Tr.ghost();
          const t2 = tracer(G, candleF, { from: 10, onMove: sync }); await t2.go(c, 0, 1800); t2.guides(false); t2.hideDot();
          await G.reveal(G.point(0, 18, { color: BCOL, r: 9, label: T(cB('18')), pos: 'e' }), c);
          const e = h('div', 'u7l9-bigeq', T(`H=${cM('-0.4')}t+${cB('18')}`)); P.appendChild(e); await pop(c, e);
        } },
      { cap: `When does it burn out? Set ${T('H=0')}: ${T('0=-0.4t+18')}, so ${T('0.4t=18')}. Times 10: ${T('4t=180')}, so ${T('t=45')} minutes.`,
        run: async (c) => {
          const t3 = tracer(G, candleF, { from: 25, onMove: sync }); await t3.go(c, 45, 2000); t3.guides(false);
          col.out = true; col.set(0);
          await G.reveal(G.point(45, 0, { color: RED, r: 8, label: T('(45,\\ 0)'), pos: 'nw' }), c);
          await show(c, line(P, `${T('0.4t=18')} → ${T('t=45')}: out after <b>45 min</b>`, 'u7l9-line u7l9-ok'));
        } }
    ];
  }
};

/* =============================== explainer 7: comparing two plans =============================== */
const CP = {
  ex5: { label: 'Example 5 check: rental companies', A: { name: 'A', m: 0.2, b: 30, col: RED }, B: { name: 'B', m: 0.1, b: 50, col: PUR }, X: 'd', Y: 'C',
    g: { xmin: 0, xmax: 520, ymin: 0, ymax: 130, xstep: 50, ystep: 10, xlabels: 100, ylabels: 20, xtitle: 'd\\text{ (km)}', ytitle: 'C\\text{ (\\$)}', origin: true },
    run: 100, low: true, xu: 'km', fy: (v) => `$${n(v)}`, word: 'cheaper', checks: [100, 200, 300], who: (R) => `Company ${R.name}`,
    tie: 'the <b>break-even point</b>', last: 'A is cheaper <b>under 200 km</b> (its smaller start wins early); B is cheaper <b>over 200 km</b> (its smaller rate wins later).' },
  race: { label: 'Warm-up: rabbit vs turtle', A: { name: 'Rabbit', m: 10, b: 0, col: '#7850aa' }, B: { name: 'Turtle', m: 5, b: 30, col: '#1e8c50' }, X: 't', Y: 'd',
    g: { xmin: 0, xmax: 8.6, ymin: 0, ymax: 90, xstep: 1, ystep: 5, ylabels: 10, xtitle: 't\\text{ (min)}', ytitle: 'd\\text{ (m)}', origin: true },
    run: 1, low: false, xu: 'min', fy: (v) => `${n(v)} m`, word: 'ahead', checks: [2, 6, 8], who: (R) => `the ${R.name.toLowerCase()}`,
    tie: 'the <b>catch-up point</b>: a tie, right on the 60 m finish line', last: 'The turtle is ahead <b>before 6 min</b> (its head start wins early); the rabbit is ahead <b>after 6 min</b> (its bigger speed wins later), but the race is already over.' }
};
const compare = {
  title: 'Two plans: who wins, and when?',
  height: 470,
  minW: 940,
  choices: Object.keys(CP).map((k) => ({ v: k, label: CP[k].label })),
  intro: (k) => { const d = CP[k]; return `${d.who(d.A)}: ${T(eqTex(d.Y, d.X, d.A.m, d.A.b, false))} &nbsp; ${d.who(d.B)}: ${T(eqTex(d.Y, d.X, d.B.m, d.B.b, false))}. Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = CP[k], A = d.A, B = d.B, fA = (x) => A.m * x + A.b, fB = (x) => B.m * x + B.b, xe = (B.b - A.b) / (A.m - B.m);
    const G = new Graph(stage, Object.assign({}, d.g, { x: 14, y: 14, width: 560, height: 440, pad: [20, 22, 34, 48] }));
    const P = panel(stage, 590, 14, ex.W - 604, 440, d.low ? 'Total cost' : 'Distance from the start');
    const bars = [A, B].map((R) => {
      const row = h('div', 'u7l9-cbrow', `<div class="u7l9-cbk" style="color:${R.col}">${R.name}</div><div class="u7l9-cbtrack"><div class="u7l9-cbbar" style="background:${R.col}"></div><div class="u7l9-cbval"></div></div>`);
      P.appendChild(row); return { row, bar: row.querySelector('.u7l9-cbbar'), val: row.querySelector('.u7l9-cbval') };
    });
    const verdict = line(P, '', 'u7l9-verdict'); const notes = h('div', 'u7l9-cnotes'); P.appendChild(notes);
    const st = { x: 0 };
    const mk = G.vline(0, { color: NOW, width: 2.5 }); mk.style.display = 'none';
    const dA = G.point(0, fA(0), { color: A.col, r: 7.5 }), dB = G.point(0, fB(0), { color: B.col, r: 7.5 });
    [dA, dB].forEach((p) => (p.style.visibility = 'hidden'));
    const xtag = G.label(0, d.g.ymax, '', { pos: 's', gap: 4, cls: 'u7l9-xtag' }); xtag.style.display = 'none';
    const fmt = (v) => d.fy(rr(v));
    const paint = () => {
      const x = st.x, a = fA(x), b = fB(x);
      mk.set(x); G.moveTo(dA, x, a); G.moveTo(dB, x, b); G.moveTo(xtag, x, d.g.ymax); xtag.innerHTML = `${n(Math.round(x))} ${d.xu}`;
      bars[0].bar.style.width = (a / d.g.ymax * 100) + '%'; bars[1].bar.style.width = (b / d.g.ymax * 100) + '%';
      bars[0].val.innerHTML = fmt(a); bars[1].val.innerHTML = fmt(b);
      const diff = a - b; const win = Math.abs(diff) < 1e-6 ? null : (d.low ? (diff < 0 ? A : B) : (diff > 0 ? A : B));
      verdict.innerHTML = win ? `<b style="color:${win.col}">${win.name}</b> is ${d.word}` : '<b>a tie</b>';
    };
    const goTo = (c, x) => { const x0 = st.x; return tween(c, 1300, (t) => { st.x = x0 + (x - x0) * t; paint(); }); };
    const check = (x) => {
      const a = fA(x), b = fB(x), tie = Math.abs(a - b) < 1e-6;
      const win = tie ? null : (d.low ? (a < b ? A : B) : (a > b ? A : B));
      return {
        cap: `At ${T(`${d.X}=${x}`)} ${d.xu}: ${d.who(A)} ${fmt(a)}, ${d.who(B)} ${fmt(b)}. ${tie ? `Both the same: the lines <b>cross</b>. That is ${d.tie}.` : `<b>${d.who(win).replace(/^./, (s) => s.toUpperCase())}</b> is ${d.word}.`}`,
        run: async (c) => {
          mk.style.display = ''; xtag.style.display = ''; [dA, dB].forEach((p) => (p.style.visibility = '')); await goTo(c, x);
          await show(c, line(notes, `${n(x)} ${d.xu}: ${tie ? 'tie, ' + fmt(a) : `<b style="color:${win.col}">${win.name}</b> (${fmt(a)} vs ${fmt(b)})`}`, 'u7l9-line'));
          if (tie) { const s = G.point(x, a, { color: INK, r: 9, label: T(pairTex(x, a)), pos: 'nw', labelCls: 'u7l9-tie' }); await pop(c, s); }
        }
      };
    };
    return [
      { cap: `Plot each starting value (the ${T('y')}-intercept): ${d.who(A)} starts at ${fmt(A.b)}, ${d.who(B)} at ${fmt(B.b)}.`,
        run: async (c) => {
          for (const R of [A, B]) await G.reveal(G.point(0, R.b, { color: R.col, r: 8, label: `<b>${R.name}</b> ${fmt(R.b)}`, pos: 'e', labelCls: 'u7l9-small' }), c);
        } },
      { cap: `Use each slope: ${d.who(A)} goes up ${fmt(A.m * d.run)} for every ${d.run} ${d.xu}; ${d.who(B)} goes up ${fmt(B.m * d.run)}. Join the points to draw both lines.`,
        run: async (c) => {
          for (const R of [A, B]) {
            const s = new SlopeTri(G, { x: 0, y: R.b, run: d.run, rise: R.m * d.run }, { labels: false, fillOp: 0.15, w: 4, fill: R.col });
            await s.drawIn(c, 300); await pop(c, G.point(d.run, R.b + R.m * d.run, { color: R.col, r: 6 }), 200);
            const xm = d.g.xmax; await G.drawIn(G.segment([0, R.b], [xm, R.m * xm + R.b], { color: R.col, width: 4 }), 700, c);
          }
          paint();
        } },
      check(d.checks[0]), check(d.checks[1]), check(d.checks[2]),
      { cap: d.last,
        run: async (c) => {
          const first = d.low ? (A.b < B.b ? A : B) : (A.b > B.b ? A : B), second = first === A ? B : A;
          for (const [R, a, b] of [[first, 0, xe], [second, xe, d.g.xmax]]) {
            const [x0, y0] = G.toPx(a, d.g.ymax), [x1, y1] = G.toPx(b, 0);
            const rc = svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: R.col, 'fill-opacity': 0.09 }, G.layers.bg);
            const lb = G.label((a + b) / 2, d.g.ymax, `<b>${R.name}</b> ${d.word}`, { pos: 's', gap: 30, cls: 'u7l9-zone', color: R.col });
            await appear(c, rc, 400); await pop(c, lb);
          }
        } }
    ];
  }
};

/* =============================== explainer 8: the balance (solve for the break-even point) =============================== */
const EV = {
  ex5c: { label: 'Example 5(c) check',
    rows: [{ L: '0.20d+30', R: '0.10d+50', cap: 'Same cost: set Company A’s cost <b>equal</b> to Company B’s. The two pans balance.' },
      { op: '-0.10d', L: '0.10d+30', R: '50', cap: `Subtract ${T('0.10d')} from both sides, so ${T('d')} is only on the left: ${T('0.20d-0.10d=0.10d')}.` },
      { op: '-30', L: '0.10d', R: '20', cap: `Subtract ${T('30')} from both sides: ${T('0.10d=20')}.` },
      { op: '\\times10', L: 'd', R: '200', cap: `${T('0.10d')} is one tenth of ${T('d')}. Multiply both sides by ${T('10')}: ${T('d=200')} km.` }],
    check: { cap: `Check: A costs ${T('0.20(200)+30=70')} and B costs ${T('0.10(200)+50=70')}. Both <b>$70</b> at 200 km ✓`, lines: ['\\text{A: }0.20(200)+30=40+30=70', '\\text{B: }0.10(200)+50=20+50=70'] } },
  race: { label: 'Warm-up: rabbit = turtle',
    rows: [{ L: '10t', R: '5t+30', cap: 'Same place at the same time: set the rabbit’s distance <b>equal</b> to the turtle’s.' },
      { op: '-5t', L: '5t', R: '30', cap: `Subtract ${T('5t')} from both sides: ${T('5t=30')}.` },
      { op: '\\div5', L: 't', R: '6', cap: `Divide both sides by ${T('5')}: ${T('t=6')} minutes.` }],
    check: { cap: `Check: rabbit ${T('10(6)=60')}, turtle ${T('5(6)+30=60')}. Both at 60 m: a tie on the finish line ✓`, lines: ['\\text{Rabbit: }10(6)=60', '\\text{Turtle: }5(6)+30=60'] } }
};
const even = {
  title: 'Keep it balanced: solving for the break-even point',
  height: 420,
  minW: 900,
  choices: Object.keys(EV).map((k) => ({ v: k, label: EV[k].label })),
  intro: 'Whatever you do to one pan, do to the other, and the scale stays level. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = EV[k], W = ex.W, bw = 520;
    const svg = add(stage, svgEl('svg', { width: bw, height: 390, viewBox: `0 0 ${bw} 390` }), 14, 14);
    const pv = [bw / 2, 120], pL = [110, 120], pR = [bw - 110, 120];
    svgEl('path', { d: `M${pv[0]} ${pv[1] + 6} L${pv[0] - 46} 360 L${pv[0] + 46} 360 Z`, fill: '#d9d4c7', stroke: INK, 'stroke-width': 2.5 }, svg);
    svgEl('rect', { x: pv[0] - 120, y: 360, width: 240, height: 12, rx: 4, fill: '#bdb6a6' }, svg);
    const beam = svgEl('g', {}, svg); beam.style.transformBox = 'view-box'; beam.style.transformOrigin = `${pv[0]}px ${pv[1]}px`;
    svgEl('line', { x1: pL[0] - 10, x2: pR[0] + 10, y1: 120, y2: 120, stroke: INK, 'stroke-width': 7, 'stroke-linecap': 'round' }, beam);
    for (const p of [pL, pR]) {
      svgEl('path', { d: `M${p[0]} ${p[1]} L${p[0] - 80} 230 M${p[0]} ${p[1]} L${p[0] + 80} 230`, stroke: '#5d6472', 'stroke-width': 2, fill: 'none' }, beam);
      svgEl('path', { d: `M${p[0] - 96} 230 Q${p[0]} 262 ${p[0] + 96} 230 Z`, fill: '#e8a01e', stroke: INK, 'stroke-width': 2.5 }, beam);
    }
    svgEl('circle', { cx: pv[0], cy: pv[1], r: 9, fill: INK }, svg);
    const pan = (p) => add(stage, box(h('div', 'u7l9-pan'), 200, 54), 14 + p[0] - 100, 14 + 172);
    const lp = hide(pan(pL)), rp = hide(pan(pR));
    const tag = (p) => { const e = add(stage, box(h('div', 'u7l9-optag'), 160, 40), 14 + p[0] - 80, 14 + 274); hide(e); return e; };
    const lt = tag(pL), rt = tag(pR);
    const P = panel(stage, bw + 30, 14, W - bw - 44, 390, 'Both sides', 'u7l9-big');
    const set = (r) => { lp.innerHTML = T(r.L); rp.innerHTML = T(r.R); };
    const wobble = (c) => c.anim(beam, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0deg)' }], 700);
    const steps = d.rows.map((r, i) => ({
      cap: r.cap,
      run: async (c) => {
        if (i === 0) { set(r); await pop(c, lp); await pop(c, rp); await show(c, line(P, T(`${r.L}=${r.R}`), 'u7l9-mline')); return; }
        lt.innerHTML = rt.innerHTML = T(r.op); await Promise.all([pop(c, lt), pop(c, rt)]);
        await wobble(c); set(r); await Promise.all([pulse(c, lp, 1.08), pulse(c, rp, 1.08)]);
        await show(c, line(P, `${T(`${r.L}=${r.R}`)} <span class="u7l9-opnote">${T(r.op)} both sides</span>`, 'u7l9-mline'));
        if (i === d.rows.length - 1) { lt.style.opacity = rt.style.opacity = 0; }
      }
    }));
    steps.push({ cap: d.check.cap,
      run: async (c) => {
        for (const L of d.check.lines) await show(c, line(P, T(L), 'u7l9-line u7l9-ok'));
        const s = stamp(P, 'balanced', { ok: true }); s.classList.add('u7l9-stampb'); await stampIn(c, s);
      } });
    return steps;
  }
};

/* =============================== mount =============================== */
mountRace();
mountFigures();
export const explainers = mountExplainers({ rate, sentence, start, build, machine, candle, compare, even });
export const _test = { RA, SE, ST, BU, MC, CP, EV, candleF };

/* ===================== Stand Up Break! (whiteboard stations; ../standup.js) =====================
 * Beginning: an equation in context → the slope as a rate with units, and b as the start.
 * Progressing: a flat fee plus a rate in words → the equation, then use it forwards and backwards.
 * Mastery: two data points → the rate, the equation and when a target is reached; or two plans → the break-even point.
 * Whole numbers (and simple decimals) only: this unit is no-calculator. */
const suD = (v) => String(+(+v).toFixed(4));
const suDH = (v) => suD(v).replace('-', '\u2212');
const suSlopeT = (m) => (m === 1 ? '' : m === -1 ? '-' : suD(m));
const suEq = (Y, X, m, b) => `${Y}=${suSlopeT(m)}${X}${b ? (b < 0 ? '-' : '+') + suD(Math.abs(b)) : ''}`;
const suMoney = (v) => '$' + (Number.isInteger(+suD(v)) ? suD(v) : (+v).toFixed(2));
/* contexts for Beginning: Y, X, the units of each, rising (m > 0) or falling (m < 0) */
const SU_EQ = [
  { t: 'The cost of a taxi ride', Y: 'C', X: 'd', yW: '<i>C</i> is in dollars', xW: '<i>d</i> is the distance in kilometres', ms: [2, 3, 4], bs: [3, 4, 5, 6], m$: true, per: 'kilometre', noun: 'cost',
    bMean: (b) => `${suMoney(b)}: the flat fee, charged before the taxi drives at all (<i>d</i> = 0).` },
  { t: 'The water in a pool being filled', Y: 'V', X: 't', yW: '<i>V</i> is in litres', xW: '<i>t</i> is in minutes', ms: [20, 25, 30, 40, 50], bs: [100, 150, 200, 300], u: 'L', per: 'minute', noun: 'volume of water',
    bMean: (b) => `${b} L: the water already in the pool when the filling started.` },
  { t: 'A phone’s battery charge', Y: 'B', X: 't', yW: '<i>B</i> is in percent', xW: '<i>t</i> is in hours', ms: [-5, -8, -10, -12], bs: [80, 90, 100], u: '%', per: 'hour', noun: 'battery charge',
    bMean: (b) => `${b}%: the charge when the phone was unplugged.` },
  { t: 'A sunflower’s height', Y: 'h', X: 'd', yW: '<i>h</i> is in cm', xW: '<i>d</i> is the number of days', ms: [2, 3, 4], bs: [5, 8, 10, 12], u: 'cm', per: 'day', noun: 'height',
    bMean: (b) => `${b} cm: its height on day 0, when the measuring started.` },
  { t: 'The gas in a car’s tank', Y: 'G', X: 'h', yW: '<i>G</i> is in litres', xW: '<i>h</i> is the hours of driving', ms: [-6, -8, -10], bs: [50, 60, 70], u: 'L', per: 'hour', noun: 'amount of gas',
    bMean: (b) => `${b} L: the gas in the tank at the start of the trip.` },
  { t: 'The snow on a roof', Y: 'S', X: 'd', yW: '<i>S</i> is the depth in cm', xW: '<i>d</i> is the number of days', ms: [-2, -3, -4, -5], bs: [30, 40, 45, 60], u: 'cm', per: 'day', noun: 'snow depth',
    bMean: (b) => `${b} cm: the depth of snow when it started to melt (<i>d</i> = 0).` }
];
const suAmt = (c, v) => (c.m$ ? suMoney(v) : c.u === '%' ? suDH(v) + '%' : suDH(v) + ' ' + c.u);
function suBeg(r) {
  const c = r.pick(SU_EQ), m = r.pick(c.ms), b = r.pick(c.bs);
  return { text: `${c.t} is given by the equation below, where ${c.yW} and ${c.xW}. State the slope and the <i>y</i>-intercept, and say what each one means, with units.`, q: suEq(c.Y, c.X, m, b),
    a: [`m=${m},\\quad b=${b}`],
    atext: `<b>m = ${suDH(m)}</b>: the ${c.noun} is <b>${m > 0 ? 'increasing' : 'decreasing'}</b> by <b>${suAmt(c, Math.abs(m))} per ${c.per}</b>.<br><b>b = ${b}</b>: ${c.bMean(b)}` };
}
/* Progressing: a flat fee plus a rate */
const SU_FEE = [
  { t: (F, R) => `A bike shop rents bikes for a $${F} fee plus $${R} per hour.`, X: 'h', xs: 'hours', fs: [10, 15, 20], rs: [5, 6, 8, 10] },
  { t: (F, R) => `A carpet cleaner charges $${F} to come out, plus $${R} for every room cleaned.`, X: 'r', xs: 'rooms', fs: [25, 30, 40], rs: [15, 20, 25] },
  { t: (F, R) => `A pottery studio charges a $${F} studio fee plus $${R} for every bowl you paint.`, X: 'p', xs: 'bowls', fs: [5, 8, 12], rs: [6, 7, 9] },
  { t: (F, R) => `A tutor charges a $${F} booking fee plus $${R} per hour.`, X: 'h', xs: 'hours', fs: [10, 20, 25], rs: [15, 20, 30] },
  { t: (F, R) => `A food truck caters a party for $${F} plus $${R} per guest.`, X: 'g', xs: 'guests', fs: [50, 60, 80], rs: [6, 8, 9] }
];
function suPrg(r) {
  const c = r.pick(SU_FEE), F = r.pick(c.fs), R = r.pick(c.rs), x0 = r.int(3, 8);
  let x1 = r.int(4, 12); if (x1 === x0) x1 += 1;
  const y0 = R * x0 + F, y1 = R * x1 + F, X = c.X;
  return { text: `${c.t(F, R)} (a) Write an equation for the total cost <i>C</i> in terms of the number of ${c.xs}, <i>${X}</i>. (b) Find the cost for ${x0} ${c.xs}. (c) A bill came to $${y1}. How many ${c.xs}?`, q: '',
    a: [`\\text{(a) } C=${R}${X}+${F}`, `\\text{(b) } C=${R}(${x0})+${F}=${R * x0}+${F}=${y0}`, `\\text{(c) } ${y1}=${R}${X}+${F}\\ \\Rightarrow\\ ${y1 - F}=${R}${X}\\ \\Rightarrow\\ ${X}=${x1}`],
    atext: `(a) rate $${R} → <i>m</i> = ${R}; fee $${F} → <i>b</i> = ${F}. (b) <b>$${y0}</b>. (c) <b>${x1} ${c.xs}</b>.` };
}
/* Mastery A: two data points → rate, equation, target */
const SU_TWO = [
  { t: (P, Q) => `A candle burns at a constant rate. After ${P[0]} h it is ${P[1]} cm tall; after ${Q[0]} h it is ${Q[1]} cm tall.`, Y: 'H', X: 't', yu: 'cm', xu: 'hour', ms: [-1, -2, -3], bs: [18, 20, 24, 30], goal: 0, ask: 'When will it burn out?', ans: (x) => `It burns out after <b>${x} h</b>.`, bMean: 'its height before it was lit' },
  { t: (P, Q) => `A bathtub drains at a constant rate. After ${P[0]} min it holds ${P[1]} L; after ${Q[0]} min it holds ${Q[1]} L.`, Y: 'V', X: 't', yu: 'L', xu: 'minute', ms: [-5, -6, -8, -10], bs: [120, 160, 200, 240], goal: 0, ask: 'When will it be empty?', ans: (x) => `It is empty after <b>${x} min</b>.`, bMean: 'the water in the tub when it started draining' },
  { t: (P, Q) => `A hot-air balloon climbs at a steady rate. After ${P[0]} min it is ${P[1]} m up; after ${Q[0]} min it is ${Q[1]} m up.`, Y: 'A', X: 't', yu: 'm', xu: 'minute', ms: [20, 25, 40, 50], bs: [50, 100, 150], goal: null, ask: null, bMean: 'its height when the timer started' },
  { t: (P, Q) => `A jar fills with coins at a steady rate. After ${P[0]} weeks it holds $${P[1]}; after ${Q[0]} weeks it holds $${Q[1]}.`, Y: 'S', X: 'w', yu: '$', xu: 'week', ms: [4, 5, 6, 8], bs: [10, 12, 20, 30], goal: null, ask: null, bMean: 'the money already in the jar at the start' }
];
function suTwo(r) {
  for (;;) {
    const c = r.pick(SU_TWO), m = r.pick(c.ms), b = r.pick(c.bs), x1 = r.int(1, 4), x2 = x1 + r.int(2, 5);
    const P = [x1, m * x1 + b], Q = [x2, m * x2 + b];
    if (P[1] <= 0 || Q[1] <= 0) continue;
    let goal = c.goal, ask = c.ask, ans = c.ans;
    if (goal === null) { const k = r.int(x2 + 3, x2 + 10); goal = m * k + b; ask = `When will it reach ${c.yu === '$' ? '$' + goal : goal + ' ' + c.yu}?`; ans = (x) => `It reaches ${c.yu === '$' ? '$' + goal : goal + ' ' + c.yu} after <b>${x} ${c.xu}s</b>.`; }
    const xg = (goal - b) / m; if (!Number.isInteger(xg) || xg <= x2) continue;
    const unit = c.yu === '$' ? '\\$' : '\\text{ ' + c.yu + '}';
    return { text: c.t(P, Q) + ` (a) Find the rate of change, with units. (b) Write an equation for <i>${c.Y}</i> in terms of <i>${c.X}</i>, and say what <i>b</i> means. (c) ${ask}`, q: '',
      a: [`m=\\frac{${Q[1]}-${P[1]}}{${x2}-${x1}}=\\frac{${Q[1] - P[1]}}{${x2 - x1}}=${m}`,
        `${P[1]}=${m}(${x1})+b\\ \\Rightarrow\\ ${P[1]}=${m * x1}+b\\ \\Rightarrow\\ b=${b};\\quad ${suEq(c.Y, c.X, m, b)}`,
        `${goal}=${suSlopeT(m)}${c.X}+${b}\\ \\Rightarrow\\ ${goal - b}=${suSlopeT(m)}${c.X}\\ \\Rightarrow\\ ${c.X}=${xg}`],
      atext: `(a) <b>${m > 0 ? 'increasing' : 'decreasing'} by ${c.yu === '$' ? '$' + Math.abs(m) : Math.abs(m) + ' ' + c.yu} per ${c.xu}</b>. (b) <i>b</i> = ${b}: ${c.bMean}. (c) ${ans(xg)}` };
  }
}
/* Mastery B: two plans → break-even */
const SU_PLANS = [
  { t: (a, b) => `Pizza place A charges $${a.F} for delivery plus $${a.R} per pizza. Pizza place B charges $${b.F} for delivery plus $${b.R} per pizza.`, X: 'p', xs: 'pizzas' },
  { t: (a, b) => `Climbing gym A charges a $${a.F} sign-up fee plus $${a.R} per visit. Gym B charges $${b.F} to sign up plus $${b.R} per visit.`, X: 'v', xs: 'visits' },
  { t: (a, b) => `Printer A costs $${a.F} plus $${a.R} per ink cartridge. Printer B costs $${b.F} plus $${b.R} per ink cartridge.`, X: 'c', xs: 'cartridges' }
];
function suPlans(r) {
  for (;;) {
    const c = r.pick(SU_PLANS), RB = r.int(2, 8), RA = RB + r.int(1, 4), k = r.int(3, 10), FA = r.int(1, 6) * 5, FB = FA + (RA - RB) * k;
    if (FB > 150) continue;
    const lo = r.int(1, k - 1), hi = k + r.int(2, 6), X = c.X;
    return { text: c.t({ F: FA, R: RA }, { F: FB, R: RB }) + ` (a) Write an equation for each. (b) Find the break-even number of ${c.xs}. (c) Which is cheaper for ${lo} ${c.xs}? For ${hi}?`, q: '',
      a: [`\\text{A: } C=${RA}${X}+${FA},\\quad \\text{B: } C=${RB}${X}+${FB}`, `${RA}${X}+${FA}=${RB}${X}+${FB}\\ \\Rightarrow\\ ${suSlopeT(RA - RB)}${X}=${FB - FA}\\ \\Rightarrow\\ ${X}=${k}`],
      atext: `(b) They cost the same at <b>${k} ${c.xs}</b> ($${RA * k + FA} each). (c) ${lo}: A $${RA * lo + FA}, B $${RB * lo + FB} → <b>A</b> is cheaper. ${hi}: A $${RA * hi + FA}, B $${RB * hi + FB} → <b>B</b> is cheaper.` };
  }
}
standup('u7l9', {
  intro: 'At your whiteboard: every answer is a sentence with units. The rate is m, the start is b.',
  levels: {
    BEG: (r) => suBeg(r),                                  // read m and b from an equation in context, with units
    PRG: (r) => suPrg(r),                                  // fee + rate in words → equation, forwards and backwards
    MAS: (r) => (r.chance(0.5) ? suTwo(r) : suPlans(r))    // two data points → rate, b, target; or two plans → break-even
  }
});
