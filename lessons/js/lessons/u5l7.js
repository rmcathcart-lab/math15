/* Math 15 · Unit 5 · Lesson 7 — Using Technology to Graph and Explore Relations (RF5, RF2). No Math 10C twin.
 * Centrepiece: the Window Lab, a graphing-screen simulation (not an emulator): the whole plane with the viewing window
 * drawn on it as a frame, beside the calculator screen that shows only what is inside the frame. Xmin/Xmax/Ymin/Ymax
 * steppers (or type a value), ZStandard, Zoom Out/In ×4, "Fit both intercepts", drag the frame, tap the screen to
 * trace, 2nd CALC zero and value at x = 0, and whether each intercept is on the screen or off it (which way).
 * Warm-up "Wrong Window!": four screens of y = 2x − 40; Card D (the standard window) is live, so the class can change
 * one number and watch the line appear.
 * Explainers: frame (the window is a picture frame; Example 1 check; the frame that misses), keys (TI-84 Y= / WINDOW /
 * GRAPH / ZOOM 6, and Desmos), fixWindow (find the intercepts first, then set the window; Example 2 check; zoom out
 * instead), tools (trace, zero, value; Example 3 check), table (the rows with y = 0 and x = 0; ΔTbl), offEdges (domain
 * and range off the screen; Example 4 check; a segment; a horizontal line), context (C = 5 + 2n: what the intercepts
 * mean, dots only; a bike rental where any number of hours makes sense).
 * Colours: x-intercepts red, y-intercepts blue (as in Lesson 4), the frame amber, graphs calculator blue. */
import {
  h, tex, add, box, place, Graph, mountExplainers, pop, fadeIn, appear, sleep, tween, pairTex, texNum, svgEl, pulse,
  COLORS, calcNum, compile, zero as zeroOf, num, arrowHead
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RED = COLORS.red, BLUE = COLORS.blue, AMB = COLORS.amber, GRN = COLORS.green, SLATE = COLORS.slate, PUR = COLORS.purple;
const mn = (v) => num(v, 4);                               // plain text number, real minus
const tn = (v) => calcNum(v).replace('−', '-');            // calculator digits, for TeX
const nice = (r) => { if (!(r > 0)) return 1; const p = Math.pow(10, Math.floor(Math.log10(r))); for (const k of [1, 2, 5, 10]) if (k * p >= r * (1 - 1e-9)) return k * p; return 10 * p; };
const gridFor = (w, n = 12) => ({ xstep: nice((w.xmax - w.xmin) / n), ystep: nice((w.ymax - w.ymin) / n) });
const STD = { xmin: -10, xmax: 10, ymin: -10, ymax: 10 };
const KEYS4 = ['xmin', 'xmax', 'ymin', 'ymax'];
const winTex = (w) => `x:[${texNum(w.xmin)},\\ ${texNum(w.xmax)}],\\ \\ y:[${texNum(w.ymin)},\\ ${texNum(w.ymax)}]`;
/* y = mx + b as TeX (yv, xv: the variable names) */
function lineTex(m, b, yv = 'y', xv = 'x') {
  if (m === 0) return `${yv}=${texNum(b)}`;
  const mt = m === 1 ? '' : m === -1 ? '-' : texNum(m), bt = b === 0 ? '' : (b < 0 ? '-' : '+') + texNum(Math.abs(b));
  return `${yv}=${mt}${xv}${bt}`;
}
/* the calculator's Y= line: Y1=4X−12 */
const tiLine = (m, b) => 'Y1=' + lineTex(m, b, 'Y', 'X').slice(2).replace(/-/g, '−');

const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u5l7-panel ' + cls, title ? `<div class="u5l7-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u5l7-line ' + cls, html); p.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);

/* ---------------- calculator screens ---------------- */
/** a calculator screen (Graph, theme 'calc') with light grid lines: o = { x, y, width, height, win, gx, gy } */
function screen(host, o) {
  const w = o.win || STD, g = gridFor(w), opts = Object.assign({ theme: 'calc', grid: true, ticks: false }, o, w, { xstep: o.gx || g.xstep, ystep: o.gy || g.ystep });
  delete opts.win; delete opts.gx; delete opts.gy;
  return new Graph(host, opts);
}
/** set a screen's window now (grid spacing follows the window unless fixed) */
function setWin(G, w, fixed) { Object.assign(G.win, w); if (!fixed) Object.assign(G.win, gridFor(G.win)); G.redraw(); }
/** animate a screen's window */
function toWin(c, G, to, ms = 900, each) {
  const from = { ...G.win };
  return tween(c, ms, (t) => { const w = {}; KEYS4.forEach((k) => (w[k] = from[k] + (to[k] - from[k]) * t)); setWin(G, w); if (each) each(t, w); });
}
/** the TI-84 WINDOW card: four rows that fill in and light up */
function winCard(host, x, y, w, win, o = {}) {
  const el = add(host, box(h('div', 'u5l7-wincard' + (o.row ? ' u5l7-wcrow' : ''), `<div class="u5l7-wch">WINDOW</div><div class="u5l7-wcg"></div>`), w, null), x, y);
  const g = el.querySelector('.u5l7-wcg'), rows = {};
  [['xmin', 'Xmin'], ['xmax', 'Xmax'], ['ymin', 'Ymin'], ['ymax', 'Ymax']].forEach(([k, lab]) => { const r = h('div', 'u5l7-wcr', `${lab}=<b></b>`); g.appendChild(r); rows[k] = r; });
  const C = {
    el, rows,
    set(w2, hot, round) {
      for (const k in rows) {
        const v = w2 && w2[k] != null ? (round ? Math.round(w2[k]) : w2[k]) : null;
        rows[k].querySelector('b').textContent = v == null ? '' : mn(v);
        rows[k].classList.toggle('u5l7-hot', !!hot && hot.includes(k));
      }
    }
  };
  C.set(win); return C;
}
/* a word on the screen (e.g. "empty!") */
function scrNote(G, html, cls = '') { const d = h('div', 'u5l7-snote ' + cls, html); G.el.appendChild(d); return d; }

/* ---------------- the frame on the whole plane ---------------- */
function frameOn(G, getW, o = {}) {
  return G.curve(() => {
    const w = getW(); if (!w) return { subs: [] };
    const P = (x, y) => G.toPx(x, y);
    return { subs: [[P(w.xmin, w.ymin), P(w.xmax, w.ymin), P(w.xmax, w.ymax), P(w.xmin, w.ymax)]], closed: true };
  }, { color: AMB, width: o.width || 4, fill: AMB, fillOpacity: 0.1, cap: 'butt' }, 'u5l7-frame', G.layers.data);
}
/** the four edge names, just inside the frame */
function frameLabels(G, getW, o = {}) {
  const mk = (k) => { const d = h('div', 'bk-lab u5l7-flab'); G.html.appendChild(d); d.k = k; return d; };
  const L = KEYS4.map(mk), names = { xmin: 'Xmin', xmax: 'Xmax', ymin: 'Ymin', ymax: 'Ymax' };
  const draw = () => {
    const w = getW(); L.forEach((d) => (d.style.display = w ? '' : 'none')); if (!w) return;
    const r = (v) => mn(o.round ? Math.round(v) : v);
    L.forEach((d) => { d.innerHTML = `${names[d.k]} ${r(w[d.k])}`; });
    // off the middle, so they don't sit on the axes or the numbers
    const ly = w.ymin + 0.64 * (w.ymax - w.ymin), lx = w.xmin + 0.64 * (w.xmax - w.xmin);
    place(L[0], ...G.toPx(w.xmin, ly), 'e', 5); place(L[1], ...G.toPx(w.xmax, ly), 'w', 5);
    place(L[2], ...G.toPx(lx, w.ymin), 'n', 5); place(L[3], ...G.toPx(lx, w.ymax), 's', 5);
  };
  G.track(L[0], draw);
  return L;
}
const edgePt = (pin, pout, w) => { const yb = pout[1] > w.ymax ? w.ymax : w.ymin, t = (yb - pin[1]) / (pout[1] - pin[1]); return [pin[0] + t * (pout[0] - pin[0]), yb]; };
/** the part of y = f(x) inside the frame, drawn thick */
function insidePart(G, f, getW, o = {}) {
  return G.curve(() => {
    const w = getW(); if (!w) return { subs: [] };
    const N = 300, subs = []; let cur = null, prev = null;
    for (let i = 0; i <= N; i++) {
      const x = w.xmin + (w.xmax - w.xmin) * i / N, y = f(x), ins = Number.isFinite(y) && y >= w.ymin - 1e-9 && y <= w.ymax + 1e-9;
      if (ins) { if (!cur) { cur = []; if (prev && Number.isFinite(prev[1])) cur.push(edgePt([x, y], prev, w)); } cur.push([x, y]); }
      else if (cur) { if (Number.isFinite(y)) cur.push(edgePt(cur[cur.length - 1], [x, y], w)); subs.push(cur); cur = null; }
      prev = [x, y];
    }
    if (cur) subs.push(cur);
    return { subs: subs.map((s) => s.map((p) => G.toPx(p[0], p[1]))) };
  }, { color: o.color || BLUE, width: o.width || 5.5 }, 'u5l7-inside', G.layers.data);
}
/** does any of y = f(x) show inside window w? */
function visibleIn(f, w) { for (let i = 0; i <= 400; i++) { const x = w.xmin + (w.xmax - w.xmin) * i / 400, y = f(x); if (Number.isFinite(y) && y >= w.ymin && y <= w.ymax) return true; } return false; }
/** a window a little beyond both intercepts (the booklet's strategy), with tidy numbers */
function fitInts(xi, yi) {
  const xs = [0], ys = [0]; if (xi != null && Number.isFinite(xi)) xs.push(xi); if (Number.isFinite(yi)) ys.push(yi);
  const side = (vs, lo0, hi0) => {
    let lo = Math.min(...vs), hi = Math.max(...vs); if (hi - lo < 1e-9) { lo = lo0; hi = hi0; }
    const s = nice((hi - lo) / 5); return { lo: Math.floor((lo - s * 0.6) / s) * s, hi: Math.ceil((hi + s * 0.6) / s) * s };
  };
  const X = side(xs, -10, 10), Y = side(ys, -10, 10);
  return { xmin: X.lo, xmax: X.hi, ymin: Y.lo, ymax: Y.hi };
}

/* =============================== warm-up: Wrong Window! =============================== */
const WU = {
  A: { xmin: -10, xmax: 10, ymin: -200, ymax: 200, xstep: 2, ystep: 40 },
  B: { xmin: -100, xmax: 100, ymin: -10, ymax: 10, xstep: 20, ystep: 2 },
  C: { xmin: -10, xmax: 30, ymin: -50, ymax: 10, xstep: 10, ystep: 10 },
  D: { xmin: -10, xmax: 10, ymin: -10, ymax: 10, xstep: 2, ystep: 2 }
};
const wline = (x) => 2 * x - 40;
function mountWarm() {
  const host = document.getElementById('wu'); if (!host) return;
  let GD = null;
  host.querySelectorAll('[data-wscreen]').forEach((el) => {
    const k = el.dataset.wscreen, W = el.clientWidth || 180;
    const G = new Graph(el, Object.assign({ theme: 'calc', grid: true, ticks: false, width: W, height: Math.round(W / 1.55) }, WU[k]));
    G.fn(wline, { color: RED, width: 3.5 });
    if (k === 'D') GD = G;
  });
  // Card D: change one number at a time and watch Screen D
  const wd = { ...STD }, msg = host.querySelector('#wDmsg');
  const draw = () => {
    host.querySelectorAll('[data-wv]').forEach((b) => (b.textContent = mn(wd[b.dataset.wv])));
    if (GD) { Object.assign(GD.win, wd, { xstep: nice((wd.xmax - wd.xmin) / 10), ystep: nice((wd.ymax - wd.ymin) / 10) }); GD.redraw(); }
    const vis = visibleIn(wline, wd), std = KEYS4.every((k) => wd[k] === STD[k]);
    msg.textContent = vis ? 'there it is!' : std ? 'empty!' : 'still empty';
    msg.classList.toggle('u5l7-yes', vis);
  };
  host.querySelectorAll('[data-wd]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.wd.slice(0, 4), d = b.dataset.wd.slice(4) === '+' ? 10 : -10, v = wd[k] + d;
    if (Math.abs(v) > 200) return;
    const t = { ...wd, [k]: v }; if (t.xmin >= t.xmax || t.ymin >= t.ymax) return;
    wd[k] = v; draw();
  }));
  draw();
  // Q2's answer names each screen's card
  const q2 = host.querySelector('#wq2'), scr = host.querySelector('.u5l7-wscreens');
  if (q2 && scr) { const f = () => scr.classList.toggle('u5l7-on', q2.classList.contains('shown')); new MutationObserver(f).observe(q2, { attributes: true, attributeFilter: ['class'] }); f(); }
}

/* =============================== static figures (the booklet's screens) =============================== */
const FIGS = {
  ex1: { win: STD, gx: 2, gy: 2, f: (x) => 2 * x + 1 },
  ex2a: { win: STD, gx: 2, gy: 2, f: (x) => 5 * x - 40 },
  ex2b: { win: { xmin: -2, xmax: 12, ymin: -45, ymax: 10 }, gx: 2, gy: 5, f: (x) => 5 * x - 40 },
  ex3: { win: { xmin: -2, xmax: 8, ymin: -14, ymax: 6 }, gx: 2, gy: 2, f: (x) => 4 * x - 12 },
  ex4: { win: STD, gx: 2, gy: 2, f: (x) => -3 * x + 6 },
  ex5: { win: { xmin: 0, xmax: 12, ymin: 0, ymax: 30 }, gx: 2, gy: 5, f: (x) => 5 + 2 * x, dots: true, names: ['n', 'C'], w: 320, h: 266 }
};
function mountFigures() {
  document.querySelectorAll('[data-fig]').forEach((el) => {
    const d = FIGS[el.dataset.fig]; if (!d || el.dataset.done) return; el.dataset.done = '1';
    const G = screen(el, { width: d.w || 290, height: d.h || 290, win: d.win, gx: d.gx, gy: d.gy });
    G.fn(d.f, { width: 3.5 });
    if (d.dots) for (let n = d.win.xmin; n <= d.win.xmax; n++) G.point(n, d.f(n), { color: RED, r: 4.5 });
    if (d.names) { G.label(d.win.xmax, d.win.ymin, T(d.names[0]), { pos: 'nw', cls: 'u5l7-axn', clip: false }); G.label(d.win.xmin, d.win.ymax, T(d.names[1]), { pos: 'se', cls: 'u5l7-axn', clip: false }); }
  });
}

/* =============================== the Window Lab =============================== */
const LAB_EQS = [
  { m: 2, b: 1, note: 'Ex 1' }, { m: 5, b: -40, note: 'Ex 2' }, { m: 4, b: -12, note: 'Ex 3' }, { m: -3, b: 6, note: 'Ex 4' }, { m: 2, b: -40, note: 'warm-up' }
].map((e) => ({ ...e, f: (x) => e.m * x + e.b, tex: lineTex(e.m, e.b), ti: tiLine(e.m, e.b) }));
/** the class's own relation: "3x-15", "y = 0.5x + 2", "x^2-4" (digits, x, + − * / ^ ( ) only) */
function parseRel(s) {
  const t = String(s).toLowerCase().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/×/g, '*').replace(/^y=/, '');
  if (!t || t.length > 40 || /[^0-9x+\-*/^().]/.test(t)) return null;
  const js = t.replace(/(\d|\.|\))(?=x|\()/g, '$1*').replace(/x(?=\d|\(|x)/g, 'x*').replace(/\)(?=\d)/g, ')*');
  let f; try { f = compile(js); const v = f(1.2345); if (typeof v !== 'number' || Number.isNaN(v)) return null; } catch (e) { return null; }
  const texS = t.replace(/\*/g, '\\cdot ').replace(/\^(\d+)/g, '^{$1}');
  return { f, tex: 'y=' + texS, ti: 'Y1=' + t.toUpperCase().replace(/-/g, '−').replace(/\*/g, '') };
}
function mountLab() {
  const root = document.getElementById('lab'); if (!root) return;
  const mapHost = root.querySelector('#labMap'), scrHost = root.querySelector('#labScr'), winHost = root.querySelector('#labWin');
  const status = root.querySelector('#labStatus'), eqLab = root.querySelector('#labEqLabel');
  let rel = LAB_EQS[0]; const W = { ...STD };
  const f = (x) => rel.f(x);
  let xi = null, yi = 0;
  const ints = () => { yi = f(0); xi = zeroOf(f, -5000, 5000); if (xi != null && Math.abs(f(xi)) > 1e-6) xi = null; };
  ints();
  function mapFor(w) {
    const xs = [w.xmin, w.xmax, 0], ys = [w.ymin, w.ymax, 0];
    if (xi != null && Math.abs(xi) < 5000) xs.push(xi); if (Number.isFinite(yi) && Math.abs(yi) < 5000) ys.push(yi);
    let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const px = (x1 - x0) * 0.14 || 2, py = (y1 - y0) * 0.14 || 2; x0 -= px; x1 += px; y0 -= py; y1 += py;
    const sx = nice((x1 - x0) / 8), sy = nice((y1 - y0) / 8);
    return { xmin: Math.floor(x0 / sx) * sx, xmax: Math.ceil(x1 / sx) * sx, ymin: Math.floor(y0 / sy) * sy, ymax: Math.ceil(y1 / sy) * sy, xstep: sx, ystep: sy };
  }
  const MW = mapHost.clientWidth || 400;
  const M = new Graph(mapHost, Object.assign({ width: MW, height: MW, numbers: false }, mapFor(W)));
  M.fn(f, { color: '#8da2c9', width: 3 });
  frameOn(M, () => W, { width: 3.5 });
  insidePart(M, f, () => W);
  frameLabels(M, () => W);
  const mx = M.point(0, 0, { color: RED, r: 6.5 }), my = M.point(0, 0, { color: BLUE, r: 6.5 });
  const SWd = scrHost.clientWidth || 520;
  const S = screen(scrHost, { width: SWd, height: Math.round(SWd * 0.58), win: W });
  S.fn(f, { width: 3.5 });
  let marks = [], tr = null;
  const clearMarks = () => { S.remove(...marks); marks = []; if (tr) { tr.remove(); tr = null; } S.readout(null); };
  // window editor
  const inputs = {};
  [['xmin', 'Xmin'], ['xmax', 'Xmax'], ['ymin', 'Ymin'], ['ymax', 'Ymax']].forEach(([k, lab]) => {
    const r = h('div', 'u5l7-lw', `<span class="u5l7-lwl">${lab}=</span>`);
    const minus = h('button', 'u5l7-sb', '−'), plus = h('button', 'u5l7-sb', '+'), inp = h('input', 'u5l7-lwi');
    minus.type = plus.type = 'button'; inp.type = 'text'; inp.inputMode = 'text'; inp.setAttribute('aria-label', lab);
    r.append(minus, inp, plus); winHost.appendChild(r); inputs[k] = inp;
    const stepBy = (d) => { const s = nice((W[k.startsWith('x') ? 'xmax' : 'ymax'] - W[k.startsWith('x') ? 'xmin' : 'ymin']) / 5); const v = Math.round((W[k] + d * s) / s) * s; tryWin({ ...W, [k]: v }); };
    minus.addEventListener('click', () => stepBy(-1)); plus.addEventListener('click', () => stepBy(1));
    inp.addEventListener('change', () => { const v = Number(inp.value.replace(/[−–]/g, '-').trim()); if (inp.value.trim() !== '' && Number.isFinite(v)) tryWin({ ...W, [k]: v }); else sync(); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') inp.blur(); });
  });
  function sync() { KEYS4.forEach((k) => { if (document.activeElement !== inputs[k]) inputs[k].value = mn(W[k]); }); }
  function tryWin(w) { if (!(w.xmin < w.xmax && w.ymin < w.ymax) || KEYS4.some((k) => !Number.isFinite(w[k]) || Math.abs(w[k]) > 1e6)) { sync(); return; } go(w); }
  // animate the window and the map together
  let gen = 0;
  function go(to, ms = 480) {
    const my2 = ++gen, from = { ...W }, mf = { ...M.win }, mt = mapFor(to), t0 = performance.now();
    Object.assign(M.win, { xstep: mt.xstep, ystep: mt.ystep });
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const tick = (now) => {
      if (my2 !== gen) return;
      const t = ease(Math.min(1, (now - t0) / ms));
      KEYS4.forEach((k) => { W[k] = from[k] + (to[k] - from[k]) * t; M.win[k] = mf[k] + (mt[k] - mf[k]) * t; });
      M.redraw(); setWin(S, W);
      if (now - t0 < ms) requestAnimationFrame(tick); else { Object.assign(W, to); KEYS4.forEach((k) => (M.win[k] = mt[k])); M.redraw(); setWin(S, W); after(); }
    };
    sync(); requestAnimationFrame(tick);
  }
  function after() {
    sync();
    const vis = visibleIn(f, W), inX = (v) => v >= W.xmin && v <= W.xmax, inY = (v) => v >= W.ymin && v <= W.ymax;
    const where = (x, y) => { const d = []; if (y > W.ymax) d.push('above ↑'); if (y < W.ymin) d.push('below ↓'); if (x > W.xmax) d.push('to the right →'); if (x < W.xmin) d.push('to the left ←'); return d.join(' and '); };
    const pill = (name, on, off) => `<span class="u5l7-st ${on ? 'ok' : 'off'}">${name}: <b>${on ? 'on the screen ✓' : off}</b></span>`;
    const xs = xi == null ? `<span class="u5l7-st none">${T('x')}-intercept: <b>none</b></span>` : pill(`${T('x')}-intercept`, inX(xi) && inY(0), 'off the screen, ' + where(xi, 0));
    const ys = !Number.isFinite(yi) ? `<span class="u5l7-st none">${T('y')}-intercept: <b>none</b></span>` : pill(`${T('y')}-intercept`, inX(0) && inY(yi), 'off the screen, ' + where(0, yi));
    status.innerHTML = (vis ? '' : '<span class="u5l7-st off"><b>The screen is empty!</b></span>') + xs + ys;
  }
  function setRel(r) {
    rel = r; ints(); clearMarks();
    eqLab.innerHTML = '· ' + T(r.tex);
    if (xi != null) M.moveTo(mx, xi, 0); mx.style.visibility = xi == null ? 'hidden' : '';
    if (Number.isFinite(yi)) M.moveTo(my, 0, yi); my.style.visibility = Number.isFinite(yi) ? '' : 'hidden';
    S.redraw(); go({ ...W }, 300);
    root.querySelectorAll('.u5l7-eqb').forEach((b) => b.classList.toggle('on', b.rel === r));
  }
  // relation chips and the class's own
  const eqs = root.querySelector('#labEqs');
  LAB_EQS.forEach((e) => { const b = h('button', 'chip u5l7-eqb', `${T(e.tex)} <small>${e.note}</small>`); b.type = 'button'; b.rel = e; b.addEventListener('click', () => setRel(e)); eqs.appendChild(b); });
  const own = root.querySelector('#labOwn'), oin = root.querySelector('#labInput');
  own.addEventListener('submit', (e) => { e.preventDefault(); const r = parseRel(oin.value); if (!r) { oin.value = ''; oin.placeholder = 'try 3x-15'; return; } oin.blur(); setRel(r); });
  // buttons
  root.querySelectorAll('[data-lab]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.lab, cx = (W.xmin + W.xmax) / 2, cy = (W.ymin + W.ymax) / 2, hx = (W.xmax - W.xmin) / 2, hy = (W.ymax - W.ymin) / 2;
    if (k === 'std') go({ ...STD });
    else if (k === 'out') go({ xmin: cx - 4 * hx, xmax: cx + 4 * hx, ymin: cy - 4 * hy, ymax: cy + 4 * hy });
    else if (k === 'in') go({ xmin: cx - hx / 4, xmax: cx + hx / 4, ymin: cy - hy / 4, ymax: cy + hy / 4 });
    else if (k === 'fit') go(fitInts(xi, yi));
    else if (k === 'zero') {
      clearMarks(); const z = zeroOf(f, W.xmin, W.xmax);
      if (z == null) { S.readout('ERR: NO SIGN CHANGE', null); return; }
      marks.push(S.point(z, 0, { color: RED, r: 7 })); S.readout('Zero', { x: z, y: 0 });
    } else if (k === 'value') {
      clearMarks();
      if (0 < W.xmin || 0 > W.xmax) { S.readout('ERR: INVALID (X=0 is off the screen)', null); return; }
      marks.push(S.point(0, f(0), { color: BLUE, r: 7 })); S.readout('', { x: 0, y: f(0) });
    }
  }));
  // tap or drag on the screen: trace (the cursor steps pixel by pixel, like a TI-84: 94 steps across)
  S.svg.style.touchAction = 'none';
  let tracing = false;
  const traceAt = (e) => { const [x] = S.fromEvent(e), dx = (W.xmax - W.xmin) / 94, k = Math.round((x - W.xmin) / dx), xv = W.xmin + Math.max(0, Math.min(94, k)) * dx; if (!tr) { S.remove(...marks); marks = []; tr = S.traceMarker(f, xv, { title: rel.ti }); } else tr.set(xv); };
  S.svg.addEventListener('pointerdown', (e) => { e.preventDefault(); tracing = true; try { S.svg.setPointerCapture(e.pointerId); } catch (er) { /* */ } traceAt(e); });
  S.svg.addEventListener('pointermove', (e) => { if (tracing) traceAt(e); });
  const stopT = () => { tracing = false; }; S.svg.addEventListener('pointerup', stopT); S.svg.addEventListener('pointercancel', stopT);
  // drag the frame on the map (tap outside it to move it there)
  M.svg.style.touchAction = 'none';
  let drag = null;
  M.svg.addEventListener('pointerdown', (e) => {
    e.preventDefault(); const [x, y] = M.fromEvent(e);
    if (x >= W.xmin && x <= W.xmax && y >= W.ymin && y <= W.ymax) { drag = { x, y, w: { ...W } }; try { M.svg.setPointerCapture(e.pointerId); } catch (er) { /* */ } return; }
    const sx = nice((W.xmax - W.xmin) / 20), sy = nice((W.ymax - W.ymin) / 20), hx = (W.xmax - W.xmin) / 2, hy = (W.ymax - W.ymin) / 2;
    const cx = Math.round(x / sx) * sx, cy = Math.round(y / sy) * sy;
    go({ xmin: cx - hx, xmax: cx + hx, ymin: cy - hy, ymax: cy + hy });
  });
  M.svg.addEventListener('pointermove', (e) => {
    if (!drag) return; const [x, y] = M.fromEvent(e), w = drag.w;
    const sx = nice((w.xmax - w.xmin) / 20), sy = nice((w.ymax - w.ymin) / 20), dx = Math.round((x - drag.x) / sx) * sx, dy = Math.round((y - drag.y) / sy) * sy;
    gen++; W.xmin = w.xmin + dx; W.xmax = w.xmax + dx; W.ymin = w.ymin + dy; W.ymax = w.ymax + dy; M.redraw(); setWin(S, W); sync();
  });
  const endDrag = () => { if (!drag) return; drag = null; go({ ...W }); };
  M.svg.addEventListener('pointerup', endDrag); M.svg.addEventListener('pointercancel', endDrag);
  setRel(LAB_EQS[0]);
}

/* =============================== explainer 1: the window is a picture frame =============================== */
const FRAMES = {
  ex1: { label: `Example 1 check: ${T('y=2x+1')}`, m: 2, b: 1, map: { xmin: -16, xmax: 16, ymin: -16, ymax: 16, xstep: 2, ystep: 2 } },
  miss: { label: `${T('y=2x-40')}: a frame that misses`, m: 2, b: -40, map: { xmin: -20, xmax: 40, ymin: -70, ymax: 20, xstep: 10, ystep: 10 } }
};
const frame = {
  title: 'The viewing window is a picture frame',
  height: 470,
  minW: 960,
  choices: Object.keys(FRAMES).map((k) => ({ v: k, label: FRAMES[k].label })),
  intro: 'The left picture is the whole plane. The right picture is the calculator screen. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FRAMES[k], f = (x) => d.m * x + d.b, W = ex.W;
    const fw = { ...STD }; let on = false, insOn = k !== 'ex1'; const getW = () => (on ? fw : null), getIns = () => (on && insOn ? fw : null);
    const M = new Graph(stage, Object.assign({ x: 6, y: 8, width: 452, height: 452, numbers: false }, d.map));
    add(stage, h('div', 'u5l7-tag', 'The whole plane'), 14, 10);
    const rect = frameOn(M, getW), labs = frameLabels(M, getW, { round: true }), ins = insidePart(M, f, getIns);
    const S = screen(stage, { x: 500, y: 19, width: W - 520, height: 262, win: STD });
    add(stage, h('div', 'u5l7-tag u5l7-tagS', 'The screen'), 506, 24);
    const card = winCard(stage, 489, 302, W - 497, null);
    const P = panel(stage, 489, 382, W - 497, 82, '', 'u5l7-notes');
    const moveFrame = (c, to, ms = 1100) => { const from = { ...fw }; return tween(c, ms, (t) => { for (const q in to) fw[q] = from[q] + (to[q] - from[q]) * t; M.redraw(); setWin(S, fw); card.set(fw, Object.keys(to), t < 1); }); };
    const showFrame = async (c) => { on = true; M.redraw(); await Promise.all([appear(c, rect, 500), ...labs.map((l) => appear(c, l, 500))]); card.set(fw, KEYS4); await pop(c, card.el, 420); };
    if (k === 'ex1') {
      let yi, xi;
      return [
        { cap: `Here is ${T('y=2x+1')} on the <b>whole plane</b>. The line goes on forever in both directions.`, run: (c) => M.drawIn(M.fn(f, { color: '#7d93bd', width: 3 }), 900, c) },
        { cap: `Lay a <b>frame</b> over the plane: the standard window, ${T('x:[-10,\\ 10]')}, ${T('y:[-10,\\ 10]')}. The four numbers are its edges.`, run: showFrame },
        { cap: 'The screen shows <b>only what is inside the frame</b>.', run: async (c) => { card.set(fw); insOn = true; M.redraw(); await Promise.all([M.drawIn(ins, 900, c), S.drawIn(S.fn(f), 900, c)]); } },
        { cap: 'Room to spare? The line goes through the middle, and both intercepts are near the origin, <b>well inside</b> the frame.',
          run: async (c) => { yi = S.point(0, 1, { color: BLUE, r: 7 }); xi = S.point(-0.5, 0, { color: RED, r: 7 }); await pop(c, yi); await pop(c, xi); await show(c, line(P, '<b>Yes:</b> both intercepts are well inside.')); } },
        { cap: `Estimate: ${T('y')}-intercept ${T('(0,\\ 1)')}. The ${T('x')}-intercept is halfway between −1 and 0: ${T('(-0.5,\\ 0)')}.`,
          run: async (c) => {
            const a = S.label(0, 1, T('(0,\\ 1)'), { pos: 'nw', cls: 'bk-ptlab', color: BLUE }), b = S.label(-0.5, 0, T('(-0.5,\\ 0)'), { pos: 'se', cls: 'bk-ptlab', color: RED });
            await Promise.all([appear(c, a), appear(c, b)]);
            await show(c, line(P, `Check: ${T('0=2x+1')} gives ${T('x=-0.5')} ✓`));
          } }
      ];
    }
    let empty;
    return [
      { cap: `Here is ${T('y=2x-40')}, the warm-up line, on the <b>whole plane</b>.`, run: (c) => M.drawIn(M.fn(f, { color: '#7d93bd', width: 3 }), 900, c) },
      { cap: 'Lay the <b>standard</b> frame on it. The screen is <b>empty</b>!',
        run: async (c) => { await showFrame(c); S.fn(f); card.set(fw); empty = scrNote(S, 'empty!'); await pop(c, empty); } },
      { cap: `From ${T('x=-10')} to ${T('x=10')} the line only goes from ${T('y=-60')} up to ${T('y=-20')}. All of it is <b>below</b> the frame.`,
        run: async (c) => {
          const g1 = M.segment([-10, -10], [-10, -60], { color: SLATE, width: 2, dash: true }), g2 = M.segment([10, -10], [10, -20], { color: SLATE, width: 2, dash: true });
          const s = M.segment([-10, -60], [10, -20], { color: RED, width: 6 });
          await Promise.all([M.drawIn(g1, 500, c), M.drawIn(g2, 500, c)]); await M.drawIn(s, 700, c);
          const a = M.point(-10, -60, { color: RED, r: 6, label: T('(-10,\\ -60)'), pos: 'se' }), b = M.point(10, -20, { color: RED, r: 6, label: T('(10,\\ -20)'), pos: 'e' });
          await Promise.all([M.reveal(a, c), M.reveal(b, c)]);
          await show(c, line(P, 'Nothing is broken: the frame is in the <b>wrong place</b>.'));
        } },
      { cap: `Change <b>one</b> number: ${T('\\text{Ymin}=-50')}. The bottom of the frame drops, and the line appears on the screen.`,
        run: async (c) => { empty.remove(); await moveFrame(c, { ymin: -50 }); } },
      { cap: `Also make ${T('\\text{Xmax}=30')} (Card 1). Now both intercepts, ${T('(20,\\ 0)')} and ${T('(0,\\ -40)')}, are inside. The line never moved: <b>only the frame did</b>.`,
        run: async (c) => {
          await moveFrame(c, { xmax: 30 });
          const ps = [S.point(20, 0, { color: RED, r: 7, label: T('(20,\\ 0)'), pos: 'nw' }), S.point(0, -40, { color: BLUE, r: 7, label: T('(0,\\ -40)'), pos: 'e' }), M.point(20, 0, { color: RED, r: 6 }), M.point(0, -40, { color: BLUE, r: 6 })];
          await Promise.all(ps.map((p) => (p.label ? S.reveal(p, c) : pop(c, p))));
        } }
    ];
  }
};

/* =============================== explainer 2: TI-84 keys, or Desmos =============================== */
function ti84(stage, x, y) {
  const el = add(stage, box(h('div', 'u5l7-ti'), 330, 452), x, y);
  el.innerHTML = '<div class="u5l7-ti-name">TI-84</div><div class="u5l7-ti-scr"><div class="u5l7-ti-txt"></div><div class="u5l7-ti-g"></div></div>';
  const rows = [['Y=', 'WINDOW', 'ZOOM', 'TRACE', 'GRAPH'], ['2nd', 'MODE', 'DEL', 'X,T,θ,n', 'STAT'], ['7', '8', '9', '×', '÷'], ['4', '5', '6', '−', '^'], ['1', '2', '3', '+', '('], ['0', '.', '(−)', 'ENTER', ')']];
  const keys = {}, kb = h('div', 'u5l7-ti-keys'); el.appendChild(kb);
  rows.forEach((r, i) => r.forEach((k) => { const b = h('div', 'u5l7-ti-k' + (i === 0 ? ' top' : '') + (/^\d$|^\.$|^\(−\)$/.test(k) ? ' num' : '') + (k === 'ENTER' ? ' ent' : '') + (k === '2nd' ? ' sec' : ''), k); kb.appendChild(b); keys[k] = b; }));
  const txt = el.querySelector('.u5l7-ti-txt'), gbox = el.querySelector('.u5l7-ti-g');
  const G = screen(gbox, { width: 290, height: 176, win: STD }); G.el.classList.add('u5l7-tig');
  const D = {
    el, keys, txt, G,
    mode(m) { txt.style.display = m === 'text' ? '' : 'none'; gbox.style.display = m === 'graph' ? '' : 'none'; },
    text(lines) { D.mode('text'); txt.innerHTML = lines.map((l) => `<div>${l}</div>`).join(''); },
    async press(c, k) { const b = keys[k]; b.classList.add('u5l7-down'); await pulse(c, b, 1.18, 300); b.classList.remove('u5l7-down'); }
  };
  D.mode('text'); D.text([]);
  return D;
}
const yEq = (s, cur) => ['<span class="u5l7-ti-inv">Plot1</span> Plot2 Plot3', `<b class="u5l7-ti-on">■</b>\\Y₁=${s}${cur ? '<i class="u5l7-cur"></i>' : ''}`, '<b class="u5l7-ti-on">■</b>\\Y₂=', '<b class="u5l7-ti-on">■</b>\\Y₃=', '<b class="u5l7-ti-on">■</b>\\Y₄=', '<b class="u5l7-ti-on">■</b>\\Y₅='];
const winList = (v) => ['<span class="u5l7-ti-inv">WINDOW</span>', `Xmin=${v[0] ?? ''}`, `Xmax=${v[1] ?? ''}`, 'Xscl=1', `Ymin=${v[2] ?? ''}`, `Ymax=${v[3] ?? ''}`, 'Yscl=1'];
const keys = {
  title: 'Graphing it: a TI-84 or Desmos',
  height: 470,
  minW: 960,
  choices: [{ v: 'ti', label: 'TI-84' }, { v: 'des', label: 'Desmos' }],
  intro: `Graph ${T('y=2x+1')} (Example 1) in the standard window. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const W = ex.W, f = (x) => 2 * x + 1;
    if (k === 'ti') {
      const D = ti84(stage, 16, 8), P = panel(stage, 380, 8, W - 390, 452, 'What you press');
      const typeSeq = async (c, seq, render) => { let s = ''; for (const [key, add2] of seq) { await D.press(c, key); s += add2; render(s); await sleep(c, 120); } };
      return [
        { cap: `Press <b>Y=</b>. This is the list of equations to graph. The equation must start with ${T('y=')}, so solve for ${T('y')} first if it doesn’t.`,
          run: async (c) => { await D.press(c, 'Y='); D.text(yEq('', true)); await show(c, line(P, '<b>1.</b> <span class="keys"><kbd>Y=</kbd></span> opens the equation list.')); } },
        { cap: `Type the right side of ${T('y=2x+1')}: <b>2</b>, then the ${T('x')} key (<b>X,T,θ,n</b>), then <b>+</b>, <b>1</b>.`,
          run: async (c) => { await typeSeq(c, [['2', '2'], ['X,T,θ,n', 'X'], ['+', '+'], ['1', '1']], (s) => D.text(yEq(s, true))); await show(c, line(P, '<b>2.</b> Type <span class="keys"><kbd>2</kbd><kbd>X,T,θ,n</kbd><kbd>+</kbd><kbd>1</kbd></span>. The <kbd>X,T,θ,n</kbd> key types <span class="tex">x</span>.')); } },
        { cap: 'Press <b>WINDOW</b> and type the four edges. The standard window is −10, 10, −10, 10. (Leave Xscl and Yscl at 1.)',
          run: async (c) => {
            await D.press(c, 'WINDOW'); const v = []; D.text(winList(v));
            for (const val of ['−10', '10', '−10', '10']) { await sleep(c, 150); if (val[0] === '−') await D.press(c, '(−)'); await D.press(c, '1'); await D.press(c, '0'); await D.press(c, 'ENTER'); v.push(val); D.text(winList(v)); }
            await show(c, line(P, '<b>3.</b> <span class="keys"><kbd>WINDOW</kbd></span>: Xmin, Xmax, Ymin, Ymax. Use <kbd>(−)</kbd> for a negative.'));
          } },
        { cap: 'Press <b>GRAPH</b>. The calculator draws only the part of the line inside the window.',
          run: async (c) => { await D.press(c, 'GRAPH'); D.mode('graph'); await D.G.drawIn(D.G.fn(f, { width: 3 }), 900, c); await show(c, line(P, '<b>4.</b> <span class="keys"><kbd>GRAPH</kbd></span> draws it.')); } },
        { cap: 'Shortcut: <b>ZOOM</b>, then <b>6</b> (ZStandard) sets the standard window in one step. <b>ZOOM 3</b> zooms out.',
          run: async (c) => {
            await D.press(c, 'ZOOM');
            D.text(['<span class="u5l7-ti-inv">ZOOM</span> MEMORY', '1:ZBox', '2:Zoom In', '<span class="u5l7-ti-hl">3:Zoom Out</span>', '4:ZDecimal', '5:ZSquare', '<span class="u5l7-ti-hl">6:ZStandard</span>']);
            await show(c, line(P, '<b>Shortcut:</b> <span class="keys"><kbd>ZOOM</kbd><kbd>6</kbd></span> = standard window, <span class="keys"><kbd>ZOOM</kbd><kbd>3</kbd></span> = zoom out.', 'u5l7-tipl'));
          } }
      ];
    }
    // Desmos
    const box2 = add(stage, box(h('div', 'u5l7-des'), 600, 452), 10, 8);
    box2.innerHTML = '<div class="u5l7-des-list"><div class="u5l7-des-row"><i>1</i><div class="u5l7-des-in"></div></div><div class="u5l7-des-row"><i>2</i><div></div></div></div><div class="u5l7-des-g"></div><div class="u5l7-des-wr" title="Graph settings">🔧</div>';
    const inp = box2.querySelector('.u5l7-des-in'), gh = box2.querySelector('.u5l7-des-g'), wr = box2.querySelector('.u5l7-des-wr');
    const G = new Graph(gh, { width: 400, height: 440, ...STD, xstep: 1, ystep: 1, fontSize: 14 });
    const pop2 = add(box2, box(h('div', 'u5l7-des-pop'), 230, null), 356, 50); pop2.style.opacity = 0;
    const P = panel(stage, 626, 8, W - 636, 452, 'Desmos');
    const typed = (s) => { inp.innerHTML = s ? `<i class="u5l7-dot"></i>${T(s)}` : '<span class="muted">type here</span>'; };
    typed('');
    return [
      { cap: `Click an empty line of the expression list and type ${T('y=2x+1')}.`,
        run: async (c) => { inp.classList.add('u5l7-focus'); for (const s of ['y', 'y=', 'y=2', 'y=2x', 'y=2x+', 'y=2x+1']) { typed(s); await sleep(c, 160); } await show(c, line(P, '<b>1.</b> Type the equation on an empty line.')); } },
      { cap: 'The graph appears <b>at once</b>. There is no GRAPH button.',
        run: async (c) => { inp.classList.remove('u5l7-focus'); await G.drawIn(G.fn(f, { color: RED, width: 3.5 }), 800, c); await show(c, line(P, '<b>2.</b> The graph shows right away.')); } },
      { cap: 'Drag to move around. Scroll, or pinch on a tablet, to <b>zoom out</b> and in.',
        run: async (c) => { await toDes(c, G, { xmin: -20, xmax: 20, ymin: -20, ymax: 20 }); await show(c, line(P, '<b>3.</b> Drag to move; scroll or pinch to zoom.')); } },
      { cap: `For exact values, click the <b>wrench</b> and type the window: ${T('-10\\le x\\le 10')} and ${T('-10\\le y\\le 10')}.`,
        run: async (c) => {
          await pulse(c, wr, 1.3, 400);
          pop2.innerHTML = `<div class="u5l7-des-ph">Graph settings</div><div class="u5l7-des-f"><b>−10</b> ≤ ${T('x')} ≤ <b>10</b></div><div class="u5l7-des-f"><b>−10</b> ≤ ${T('y')} ≤ <b>10</b></div>`;
          await appear(c, pop2, 300); await toDes(c, G, STD);
          await show(c, line(P, '<b>4.</b> The wrench sets an exact window.'));
        } }
    ];
  }
};
function toDes(c, G, to) { const from = { ...G.win }; return tween(c, 900, (t) => { KEYS4.forEach((k) => (G.win[k] = from[k] + (to[k] - from[k]) * t)); const s = (G.win.xmax - G.win.xmin) > 30 ? 2 : 1; G.win.xstep = G.win.ystep = s; G.redraw(); }); }

/* =============================== explainer 3: fix the window =============================== */
const FIX = {
  ex2: { label: `Example 2 check: ${T('y=5x-40')}`, m: 5, b: -40, best: { xmin: -2, xmax: 12, ymin: -45, ymax: 10 }, piece: 'only a short, steep piece of the line shows, on the <b>right side</b>' },
  zoom: { label: 'Zoom out instead', m: 5, b: -40, zoom: true, best: { xmin: -2, xmax: 12, ymin: -45, ymax: 10 } },
  demo: { label: T('y=0.5x+12'), m: 0.5, b: 12, best: { xmin: -30, xmax: 5, ymin: -5, ymax: 15 }, piece: 'only a short piece of the line shows, in the <b>top-left corner</b>' }
};
const fixWindow = {
  title: 'Missing intercepts? Fix the window',
  height: 470,
  minW: 960,
  choices: Object.keys(FIX).map((k) => ({ v: k, label: FIX[k].label })),
  intro: 'Start with the standard window and look for the intercepts. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FIX[k], f = (x) => d.m * x + d.b, W = ex.W, xi = -d.b / d.m, yi = d.b, eq = lineTex(d.m, d.b);
    const S = screen(stage, { x: 21, y: 21, width: 540, height: 338, win: STD });
    const card = winCard(stage, 10, 384, 562, STD, { row: true });
    const P = panel(stage, 600, 8, W - 610, 452, k === 'zoom' ? 'Zooming out' : 'Fixing the window');
    const go = (c, to, ms = 1100) => toWin(c, S, to, ms, (t, w) => card.set(w, KEYS4, t < 1));
    const ptX = () => S.point(xi, 0, { color: RED, r: 7, label: T(pairTex(xi, 0)), pos: xi > 0 ? 'nw' : 'se' });
    const ptY = () => S.point(0, yi, { color: BLUE, r: 7, label: T(pairTex(0, yi)), pos: yi > 0 ? 'se' : 'e' });
    const first = { cap: `Standard window: ${k === 'zoom' ? FIX.ex2.piece : d.piece}.`, run: (c) => S.drawIn(S.fn(f, { width: 3.5 }), 900, c) };
    if (k === 'zoom') {
      let py;
      return [first,
        { cap: `<b>ZOOM 3</b> (Zoom Out) makes the window 4 times as wide and 4 times as tall: ${T('x:[-40,\\ 40]')}, ${T('y:[-40,\\ 40]')}.`,
          run: async (c) => { await go(c, { xmin: -40, xmax: 40, ymin: -40, ymax: 40 }); await show(c, line(P, `Zoom out: ${T(winTex({ xmin: -40, xmax: 40, ymin: -40, ymax: 40 }))}`)); } },
        { cap: `The ${T('y')}-intercept ${T('(0,\\ -40)')} lands right <b>on the bottom edge</b>. No room to spare.`,
          run: async (c) => { py = S.point(0, -40, { color: BLUE, r: 8 }); await pop(c, py); await pulse(c, py, 1.6, 600); await show(c, line(P, `${T('(0,\\ -40)')} is <b>on the edge</b>: hard to see.`, 'u5l7-bad')); } },
        { cap: `Zoom out again: ${T('x:[-160,\\ 160]')}, ${T('y:[-160,\\ 160]')}. Both intercepts show, but the line is <b>squashed</b> into the middle.`,
          run: async (c) => { await go(c, { xmin: -160, xmax: 160, ymin: -160, ymax: 160 }); const px = S.point(8, 0, { color: RED, r: 6 }); await pop(c, px); await show(c, line(P, `Again: ${T('x:[-160,\\ 160]')}, ${T('y:[-160,\\ 160]')}: <b>too small</b>.`, 'u5l7-bad')); } },
        { cap: `Zooming out works in a pinch. A <b>custom window</b> built from the intercepts shows the line best: ${T(winTex(d.best))}.`,
          run: async (c) => { S.clear(); S.fn(f, { width: 3.5 }); await go(c, d.best); const a = ptX(), b = ptY(); await Promise.all([S.reveal(a, c), S.reveal(b, c)]); await show(c, line(P, `Custom: ${T(winTex(d.best))} ✓`, 'u5l7-good')); } }
      ];
    }
    let notes = [];
    const offNote = (html, px, py, cls) => { const n = h('div', 'u5l7-off ' + cls, html); S.el.appendChild(n); n.style.left = px + 'px'; n.style.top = py + 'px'; notes.push(n); return n; };
    const [x0px] = S.toPx(0, 0), plotL = S.P.l, plotT = S.P.t, plotB = S.H - S.P.b;
    const xiTx = `0=${eq.slice(2)}`;
    return [first,
      { cap: k === 'ex2' ? `The ${T('x')}-intercept is on the screen, but where is the ${T('y')}-intercept? Far <b>below</b> the screen: it can’t be seen.` : `Neither intercept is on the screen. The ${T('y')}-intercept is just <b>above</b>, and the ${T('x')}-intercept is far to the <b>left</b>.`,
        run: async (c) => {
          const ns = k === 'ex2' ? [offNote(`${T('y')}-intercept is<br>down here ↓`, x0px, plotB - 8, 'u5l7-offB')]
            : [offNote(`↑ ${T('y')}-intercept just above`, x0px, plotT + 6, 'u5l7-offT'), offNote(`← ${T('x')}-intercept far left`, plotL + 6, S.toPx(0, 0)[1], 'u5l7-offL')];
          for (const n of ns) await pop(c, n);
        } },
      { cap: `Find the intercepts <b>first</b>. ${T('x')}-intercept: put ${T('y=0')}: ${T(xiTx)}, so ${T('x=' + texNum(xi))}. ${T('y')}-intercept: put ${T('x=0')}: ${T('y=' + texNum(yi))}.`,
        run: async (c) => { await show(c, line(P, `${T('x')}-int: ${T(xiTx)} → ${T('x=' + texNum(xi))}`, 'u5l7-cx')); await show(c, line(P, `${T('y')}-int: ${T('x=0')} → ${T('y=' + texNum(yi))}`, 'u5l7-cy')); } },
      { cap: `Set the window a little <b>beyond</b> both: Xmin ${mn(d.best.xmin)}, Xmax ${mn(d.best.xmax)}, Ymin ${mn(d.best.ymin)}, Ymax ${mn(d.best.ymax)}.`,
        run: async (c) => { notes.forEach((n) => n.remove()); notes = []; await go(c, d.best); await show(c, line(P, `Window: ${T(winTex(d.best))}`)); } },
      { cap: `Both intercepts are on the screen, with room to spare. Same line: <b>only the window changed</b>.`,
        run: async (c) => { const a = ptX(), b = ptY(); await S.reveal(a, c); await S.reveal(b, c); await show(c, line(P, `Both show: ${T(pairTex(xi, 0))} and ${T(pairTex(0, yi))} ✓`, 'u5l7-good')); } }
    ];
  }
};

/* =============================== explainer 4: trace, zero, value =============================== */
const TOOLS = {
  ex3: { label: `Example 3 check: ${T('y=4x-12')}`, m: 4, b: -12, win: { xmin: -2, xmax: 8, ymin: -14, ymax: 6 } },
  demo: { label: T('y=-2x+7'), m: -2, b: 7, win: { xmin: -2, xmax: 6, ymin: -6, ymax: 10 } }
};
const tools = {
  title: 'Calculator tools: trace, zero, value',
  height: 470,
  minW: 960,
  choices: Object.keys(TOOLS).map((k) => ({ v: k, label: TOOLS[k].label })),
  intro: 'Find both intercepts with the calculator’s tools. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TOOLS[k], f = (x) => d.m * x + d.b, W = ex.W, w = d.win, xi = -d.b / d.m, yi = d.b, ti = tiLine(d.m, d.b);
    const S = screen(stage, { x: 21, y: 21, width: 560, height: 360, win: w });
    const ro0 = S.readout.bind(S); S.readout = (t, xy, o = {}) => ro0(t, xy, Object.assign({ pos: d.m > 0 ? 'tl' : 'bl' }, o)); // keep the readout off the line
    const sub = add(stage, box(h('div', 'u5l7-ti-sub'), 582, 40), 10, 406);
    const P = panel(stage, 620, 8, W - 630, 452, 'Calculator results');
    // the trace cursor steps 94 pixels across the screen, like a TI-84: it lands near the crossing, not on it
    const dx = (w.xmax - w.xmin) / 94; let kk = Math.floor((xi - w.xmin) / dx + 1e-9); if (Math.abs(w.xmin + kk * dx - xi) < 1e-9) kk -= 1;
    const tx = w.xmin + kk * dx, ty = f(tx), tx0 = w.xmin + 12 * dx;
    let tr, menu, lb, rb;
    return [
      { cap: `${T(lineTex(d.m, d.b))} in the window ${T(winTex(w))}.`, run: (c) => S.drawIn(S.fn(f, { width: 3.5 }), 900, c) },
      { cap: `<b>TRACE</b>: a cursor rides along the line. The bottom of the screen shows its ${T('X')} and ${T('Y')}.`,
        run: async (c) => { tr = S.traceMarker(f, tx0, { title: ti }); await pop(c, tr.el); await tr.move(c, tx, 1700); tr.set(tx); } },
      { cap: `Near the ${T('x')}-axis: ${T('X=' + tn(tx))}, ${T('Y=' + tn(ty))}. Close, but ${T('Y')} is not 0. Trace jumps pixel to pixel, so it only <b>estimates</b>.`,
        run: async (c) => { await pulse(c, S.ro, 1.12, 500); await show(c, line(P, `Trace: ${T('X=' + tn(tx))}, ${T('Y=' + tn(ty))} <span class="muted">(close)</span>`)); } },
      { cap: '<b>2nd TRACE</b> opens the CALCULATE menu. Choose <b>2: zero</b>.',
        run: async (c) => { tr.remove(); menu = h('div', 'u5l7-calcmenu', '<div class="u5l7-ti-inv">CALCULATE</div><div>1:value</div><div class="u5l7-ti-hl">2:zero</div><div>3:minimum</div><div>4:maximum</div><div>5:intersect</div>'); S.el.appendChild(menu); await appear(c, menu, 300); } },
      { cap: 'Move the cursor to a <b>Left Bound</b> and a <b>Right Bound</b>, one on each side of the crossing, then press <b>ENTER</b> once more for the guess.',
        run: async (c) => {
          menu.remove(); lb = S.vline(Math.floor(xi) - 1, { color: SLATE, width: 2 }); rb = S.vline(Math.floor(xi) + 2, { color: SLATE, width: 2 });
          sub.textContent = 'Left Bound?'; await S.drawIn(lb, 400, c); sub.textContent = 'Right Bound?'; await S.drawIn(rb, 400, c); sub.textContent = 'Guess?'; await sleep(c, 400);
        } },
      { cap: `<b>Zero</b>: ${T('X=' + texNum(xi))}, ${T('Y=0')}. Exact! The ${T('x')}-intercept is ${T(pairTex(xi, 0))}.`,
        run: async (c) => { S.remove(lb, rb); sub.textContent = ''; const p = S.point(xi, 0, { color: RED, r: 7, label: T(pairTex(xi, 0)), pos: d.m > 0 ? 'nw' : 'ne' }); S.readout('Zero', { x: xi, y: 0 }); await S.reveal(p, c); await show(c, line(P, `Zero: ${T('x=' + texNum(xi))} → ${T(pairTex(xi, 0))}`, 'u5l7-cx')); } },
      { cap: `<b>2nd TRACE</b>, <b>1: value</b>, type <b>0</b>: ${T('Y=' + texNum(yi))}. The ${T('y')}-intercept is ${T(pairTex(0, yi))}.`,
        run: async (c) => { sub.textContent = 'X=0'; const p = S.point(0, yi, { color: BLUE, r: 7, label: T(pairTex(0, yi)), pos: d.m > 0 ? 'e' : 'ne' }); S.readout('', { x: 0, y: yi }); await S.reveal(p, c); await show(c, line(P, `Value at ${T('x=0')}: ${T('y=' + texNum(yi))} → ${T(pairTex(0, yi))}`, 'u5l7-cy')); } }
    ];
  }
};

/* =============================== explainer 5: the table =============================== */
const TABLES = {
  ex3: { label: `Example 3 check: ${T('y=4x-12')}`, m: 4, b: -12, win: { xmin: -2, xmax: 8, ymin: -14, ymax: 6 }, start: -2, d: 1 },
  demo: { label: `${T('y=-2x+7')}: no row with 0?`, m: -2, b: 7, win: { xmin: -2, xmax: 6, ymin: -6, ymax: 10 }, start: 0, d: 1, start2: 2, d2: 0.5 }
};
function tiTable(stage, x, y, w) {
  const el = add(stage, box(h('div', 'u5l7-tab'), w, null), x, y);
  el.innerHTML = '<div class="u5l7-tab-h"><div>X</div><div>Y₁</div></div>';
  const rows = []; for (let i = 0; i < 7; i++) { const r = h('div', 'u5l7-tab-r', '<div></div><div></div>'); el.appendChild(r); rows.push(r); }
  const foot = h('div', 'u5l7-tab-f', ''); el.appendChild(foot);
  return { el, rows, foot, fill(xs, f) { rows.forEach((r, i) => { r.children[0].textContent = mn(xs[i]); r.children[1].textContent = mn(f(xs[i])); r.className = 'u5l7-tab-r'; }); }, mark(i, cls) { rows[i].classList.add(cls); } };
}
const table = {
  title: 'The table feature',
  height: 470,
  minW: 960,
  choices: Object.keys(TABLES).map((k) => ({ v: k, label: TABLES[k].label })),
  intro: 'A table lists points on the graph. Two rows give the intercepts. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TABLES[k], f = (x) => d.m * x + d.b, W = ex.W, xi = -d.b / d.m, yi = d.b;
    const tb = tiTable(stage, 16, 10, 340);
    tb.rows.forEach((r) => (r.style.visibility = 'hidden'));
    const S = screen(stage, { x: 400, y: 21, width: W - 420, height: 300, win: d.win });
    const P = panel(stage, 389, 342, W - 397, 120, '', 'u5l7-notes');
    const xs = Array.from({ length: 7 }, (_, i) => d.start + i * d.d);
    let dots = [];
    const fillRows = async (c, xs2) => { tb.fill(xs2, f); S.remove(...dots); dots = []; for (let i = 0; i < 7; i++) { tb.rows[i].style.visibility = ''; await appear(c, tb.rows[i], 160); const y = f(xs2[i]); const p = S.point(xs2[i], y, { color: SLATE, r: 5 }); dots.push(p); if (c && !c.fast) await pop(c, p, 200); } };
    const iOf = (arr, v) => arr.findIndex((q) => Math.abs(q - v) < 1e-9);
    const start = { cap: `<b>2nd GRAPH</b> opens the table. Each row is a point ${T('(x,\\ y)')} on the line ${T(lineTex(d.m, d.b))}.`, run: async (c) => { tb.foot.textContent = `TblStart=${mn(d.start)}  ΔTbl=${mn(d.d)}`; await fillRows(c, xs); } };
    const yRow = { cap: `Find the row where ${T('X=0')}: ${T('Y_1=' + texNum(yi))}. That is the ${T('y')}-intercept, ${T(pairTex(0, yi))}.`,
      run: async (c) => { const i = iOf(xs, 0); tb.mark(i, 'u5l7-ry'); await pulse(c, tb.rows[i], 1.06); const p = S.point(0, yi, { color: BLUE, r: 7, label: T(pairTex(0, yi)), pos: d.m > 0 ? 'e' : 'ne' }); await S.reveal(p, c); await show(c, line(P, `Row ${T('X=0')} → ${T('y')}-intercept ${T(pairTex(0, yi))}`, 'u5l7-cy')); } };
    const lineStep = { cap: 'The rows are points on the line. The two coloured rows are exactly where the line crosses the axes.', run: (c) => S.drawIn(S.fn(f, { width: 3.5 }), 900, c) };
    if (k === 'ex3') {
      return [start,
        { cap: `Find the row where ${T('Y_1=0')}: ${T('X=' + texNum(xi))}. That is the ${T('x')}-intercept, ${T(pairTex(xi, 0))}.`,
          run: async (c) => { const i = iOf(xs, xi); tb.mark(i, 'u5l7-rx'); await pulse(c, tb.rows[i], 1.06); const p = S.point(xi, 0, { color: RED, r: 7, label: T(pairTex(xi, 0)), pos: 'nw' }); await S.reveal(p, c); await show(c, line(P, `Row ${T('Y_1=0')} → ${T('x')}-intercept ${T(pairTex(xi, 0))}`, 'u5l7-cx')); } },
        yRow, lineStep];
    }
    const xs2 = Array.from({ length: 7 }, (_, i) => d.start2 + i * d.d2), lo = Math.floor(xi), hi = lo + 1;
    return [start, yRow,
      { cap: `Now look for ${T('Y_1=0')}… <b>no row has it!</b> ${T('Y_1')} goes from ${f(lo)} (at ${T('X=' + lo)}) to ${mn(f(hi))} (at ${T('X=' + hi)}), so the line crosses <b>between</b> them.`,
        run: async (c) => { tb.mark(iOf(xs, lo), 'u5l7-ra'); tb.mark(iOf(xs, hi), 'u5l7-ra'); await show(c, line(P, `No ${T('Y_1=0')} row: the crossing is between ${T('X=' + lo)} and ${T('X=' + hi)}.`)); } },
      { cap: `<b>TBLSET</b>: start at ${d.start2} and step by ${T(texNum(d.d2))}. Now the row ${T('X=' + texNum(xi))} has ${T('Y_1=0')}: the ${T('x')}-intercept is ${T(pairTex(xi, 0))}.`,
        run: async (c) => {
          tb.foot.textContent = `TblStart=${mn(d.start2)}  ΔTbl=${mn(d.d2)}`; await fillRows(c, xs2);
          const i = iOf(xs2, xi); tb.mark(i, 'u5l7-rx'); await pulse(c, tb.rows[i], 1.06);
          const p = S.point(xi, 0, { color: RED, r: 7, label: T(pairTex(xi, 0)), pos: 'ne' }); await S.reveal(p, c);
          await show(c, line(P, `Step ${T('0.5')}: row ${T('Y_1=0')} → ${T(pairTex(xi, 0))}`, 'u5l7-cx'));
        } },
      lineStep];
  }
};

/* =============================== explainer 6: domain and range off the screen =============================== */
const EDGES = {
  ex4: { label: `Example 4 check: ${T('y=-3x+6')}`, m: -3, b: 6 },
  seg: { label: 'A segment that stops', seg: [[-6, -2], [4, 3]] },
  flat: { label: `A horizontal line, ${T('y=4')}`, m: 0, b: 4 }
};
const offEdges = {
  title: 'Domain and range from the screen',
  height: 470,
  minW: 960,
  choices: Object.keys(EDGES).map((k) => ({ v: k, label: EDGES[k].label })),
  intro: 'Does the graph run off the edges, or does it stop? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = EDGES[k], W = ex.W;
    const S = screen(stage, { x: 21, y: 21, width: 540, height: 360, win: STD, gx: 2, gy: 2 });
    const card = winCard(stage, 10, 404, 562, STD, { row: true });
    const P = panel(stage, 600, 8, W - 610, 452, 'Domain and range');
    const go = (c, to, ms = 900) => toWin(c, S, to, ms, (t, w) => card.set(w, KEYS4, t < 1));
    const shX = (a, b) => S.shadeX(a, b, { band: true, color: AMB }), shY = (a, b) => S.shadeY(a, b, { band: true, color: PUR });
    if (k === 'seg') {
      const [A, B] = d.seg;
      return [
        { cap: 'This graph is a <b>segment</b>: you can see both of its ends on the screen.', run: (c) => S.drawIn(S.segment(A, B, { closedA: true, closedB: true, color: BLUE }), 900, c) },
        { cap: 'Zoom out: the ends stay put. This graph really <b>stops</b>.', run: async (c) => { await go(c, { xmin: -40, xmax: 40, ymin: -40, ymax: 40 }); await sleep(c, 500); await go(c, STD); await show(c, line(P, 'It has <b>endpoints</b>: limited.')); } },
        { cap: `<b>Domain</b>: from ${T('x=-6')} to ${T('x=4')} (${T('-6\\le x\\le 4')}).`, run: async (c) => { await S.drawIn(shX(-6, 4), 800, c); await show(c, line(P, `Domain: ${T('x')} from ${T('-6')} to ${T('4')}`, 'u5l7-cd')); } },
        { cap: `<b>Range</b>: from ${T('y=-2')} to ${T('y=3')} (${T('-2\\le y\\le 3')}).`, run: async (c) => { await S.drawIn(shY(-2, 3), 800, c); await show(c, line(P, `Range: ${T('y')} from ${T('-2')} to ${T('3')}`, 'u5l7-cr')); } }
      ];
    }
    const f = (x) => d.m * x + d.b;
    if (k === 'flat') {
      return [
        { cap: `A <b>horizontal</b> line, ${T('y=4')}. It runs off the left and right edges.`, run: (c) => S.drawIn(S.fn(f, { width: 3.5 }), 900, c) },
        { cap: `<b>Domain</b>: every ${T('x')} has a point on it: ${T('x\\in R')}.`, run: async (c) => { await S.drawIn(shX(-Infinity, Infinity), 800, c); await show(c, line(P, `Domain: all real numbers, ${T('x\\in R')}`, 'u5l7-cd')); } },
        { cap: `<b>Range</b>: only <b>one</b> height, ${T('y=4')}. That is why the rule is about <b>slanted</b> lines.`, run: async (c) => { await S.drawIn(shY(4, 4), 500, c); await show(c, line(P, `Range: only ${T('y=4')}`, 'u5l7-cr')); } }
      ];
    }
    const top = (10 - d.b) / d.m, bot = (-10 - d.b) / d.m;
    let marks = [];
    return [
      { cap: `${T(lineTex(d.m, d.b))} in the standard window. Does it stop anywhere on the screen?`, run: (c) => S.drawIn(S.fn(f, { width: 3.5 }), 900, c) },
      { cap: 'No. It leaves through the <b>top</b> edge and the <b>bottom</b> edge. There are no endpoints on the screen.',
        run: async (c) => {
          marks = [S.point(top, 10, { color: COLORS.orange, r: 10, open: true }), S.point(bot, -10, { color: COLORS.orange, r: 10, open: true })];
          const [ax, ay] = S.toPx(top, 10), [bx, by] = S.toPx(bot, -10);
          marks.push(arrowHead(S.layers.top, ax - 9, ay - 26, -0.35, -1, { color: COLORS.orange, width: 4 }), arrowHead(S.layers.top, bx + 9, by + 26, 0.35, 1, { color: COLORS.orange, width: 4 }));
          await Promise.all(marks.slice(0, 2).map((m) => pop(c, m))); await show(c, line(P, 'Runs off the <b>top</b> and the <b>bottom</b>.'));
        } },
      { cap: 'Zoom out (×4), and again. The line <b>still</b> runs off the edges. It never stops.',
        run: async (c) => { S.remove(...marks); marks.forEach((m) => m.remove()); await go(c, { xmin: -40, xmax: 40, ymin: -40, ymax: 40 }); await sleep(c, 400); await go(c, { xmin: -160, xmax: 160, ymin: -160, ymax: 160 }); await show(c, line(P, 'Zoom out, zoom out: <b>still no ends</b>.')); } },
      { cap: `Back to standard. <b>Domain</b>: scan left to right. Every ${T('x')} has a point on the line: ${T('x\\in R')} (all real numbers).`,
        run: async (c) => { await go(c, STD); await S.drawIn(shX(-Infinity, Infinity), 800, c); await show(c, line(P, `Domain: all real numbers, ${T('x\\in R')}`, 'u5l7-cd')); } },
      { cap: `<b>Range</b>: scan bottom to top. The slanted line reaches <b>every height</b>: ${T('y\\in R')}.`,
        run: async (c) => { await S.drawIn(shY(-Infinity, Infinity), 800, c); await show(c, line(P, `Range: all real numbers, ${T('y\\in R')}`, 'u5l7-cr')); } }
    ];
  }
};

/* =============================== explainer 7: the context decides =============================== */
const CTX = {
  ex5: { label: `Example 5 check: ${T('C=5+2n')}`, F: 5, r: 2, v: 'n', win: { xmin: 0, xmax: 12, ymin: 0, ymax: 30 }, wide: { xmin: -4, xmax: 12, ymin: -4, ymax: 30 }, whole: true, k: 6, total: 23 },
  bike: { label: `Bike rental: ${T('C=8+2h')}`, F: 8, r: 2, v: 'h', win: { xmin: 0, xmax: 10, ymin: 0, ymax: 30 }, wide: { xmin: -6, xmax: 10, ymin: -4, ymax: 30 }, whole: false, k: 2.5 }
};
const context = {
  title: 'Technology finds it; the context decides',
  height: 470,
  minW: 960,
  choices: Object.keys(CTX).map((k) => ({ v: k, label: CTX[k].label })),
  intro: 'Graph the cost, find the intercepts, then ask: does this make sense? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CTX[k], W = ex.W, v = d.v, f = (x) => d.F + d.r * x, xi = -d.F / d.r, eq = `C=${d.F}+${d.r}${v}`;
    const S = screen(stage, { x: 21, y: 21, width: 540, height: 400, win: d.win, gx: 2, gy: 5 });
    const ro0 = S.readout.bind(S); S.readout = (t, xy, o = {}) => ro0(t, xy, Object.assign({ pos: 'br' }, o));
    const nl = S.label(d.win.xmax, 0, T(v), { pos: 'nw', cls: 'u5l7-axn' }), cl = S.label(0, d.win.ymax, T('C'), { pos: 'se', cls: 'u5l7-axn' });
    void nl; void cl;
    const P = panel(stage, 600, 8, W - 610, 452, k === 'ex5' ? 'Candles' : 'Bike rental');
    const go = (c, to) => toWin(c, S, to, 900);
    let fl, tr, bad;
    const steps = [
      { cap: `${T(eq)} with the window ${T(winTex(d.win))}. On the calculator ${T(v)} is X and ${T('C')} is Y.`, run: async (c) => { fl = S.fn(f, { width: 3.5 }); await S.drawIn(fl, 900, c); } },
      { cap: `<b>value</b> at ${T(v + '=0')}: ${T('C=' + d.F)}. The ${T('C')}-intercept ${T(pairTex(0, d.F))} is the <b>$${d.F} ${k === 'ex5' ? 'shipping fee' : 'base fee'}</b>, paid before any ${k === 'ex5' ? 'candles' : 'hours'}.`,
        run: async (c) => { const p = S.point(0, d.F, { color: BLUE, r: 7, label: T(pairTex(0, d.F)), pos: 'se' }); S.readout('', { x: 0, y: d.F }); await S.reveal(p, c); await show(c, line(P, `${T('C')}-intercept ${T(pairTex(0, d.F))}: the $${d.F} ${k === 'ex5' ? 'shipping' : 'base'} fee`, 'u5l7-cy')); } },
      { cap: `The ${T(v)}-intercept is off the screen, to the left: ${T(`0=${d.F}+${d.r}${v}`)} gives ${T(v + '=' + texNum(xi))}. ${k === 'ex5' ? 'Order −2.5 candles?' : 'Ride for −4 hours?'} <b>That makes no sense.</b>`,
        run: async (c) => { S.readout(null); await go(c, d.wide); bad = S.point(xi, 0, { color: RED, r: 7, label: T(pairTex(xi, 0)) + ' ?', pos: 'n' }); await S.reveal(bad, c); await show(c, line(P, `${T(v)}-intercept ${T(pairTex(xi, 0))}: <b>not possible</b> here`, 'u5l7-bad')); } },
      { cap: `Back to the window. <b>value</b> at ${T(v + '=' + texNum(d.k))}: ${T('C=' + texNum(f(d.k)))}. ${k === 'ex5' ? 'Six candles cost <b>$17</b>.' : 'Two and a half hours cost <b>$13</b>: part of an hour is fine.'}`,
        run: async (c) => { S.remove(bad); await go(c, d.win); tr = S.traceMarker(f, d.k, { title: '' }); await pop(c, tr.el); await show(c, line(P, `${T(v + '=' + texNum(d.k))}: ${T('C=' + d.F + '+' + d.r + '(' + texNum(d.k) + ')=' + texNum(f(d.k)))}`)); } }
    ];
    if (k === 'ex5') {
      steps.push(
        { cap: `<b>Trace</b> along until ${T('Y=23')}: there ${T('X=9')}. A $23 order is <b>9 candles</b>.`,
          run: async (c) => { await tr.move(c, 9, 1200); await show(c, line(P, `${T('C=23')}: ${T('23=5+2n')}, ${T('n=9')} candles`)); } },
        { cap: 'You can only buy <b>whole</b> candles, so the graph is really just the <b>dots</b>.',
          run: async (c) => { tr.remove(); fl.path.setAttribute('stroke-dasharray', '6 7'); fl.path.setAttribute('stroke-opacity', 0.45); const ds = []; for (let n = 0; n <= 12; n++) ds.push(S.point(n, f(n), { color: RED, r: 5.5 })); if (c && !c.fast) for (const p of ds) await pop(c, p, 160); } },
        { cap: `<b>Domain:</b> ${T('n=0,\\ 1,\\ 2,\\ \\dots')} (up to 12 on this screen). <b>Range:</b> ${T('C=5,\\ 7,\\ 9,\\ \\dots')} (up to $29 here).`,
          run: async (c) => { await show(c, line(P, `Domain: ${T('n=0,\\ 1,\\ 2,\\ 3,\\ \\dots')}`, 'u5l7-cd')); await show(c, line(P, `Range: ${T('C=5,\\ 7,\\ 9,\\ 11,\\ \\dots')}`, 'u5l7-cr')); } });
    } else {
      steps.push(
        { cap: `Any number of hours from 0 up makes sense, so the graph is the <b>solid ray</b> starting at ${T(pairTex(0, d.F))}.`,
          run: async (c) => { tr.remove(); S.readout(null); const r = S.ray([0, d.F], [1, d.F + d.r], { start: 'closed', color: GRN, width: 6 }); await S.drawIn(r, 900, c); } },
        { cap: `<b>Domain:</b> ${T('h\\ge 0')}. <b>Range:</b> ${T('C\\ge 8')}.`,
          run: async (c) => { await show(c, line(P, `Domain: ${T('h\\ge 0')} (any amount of time)`, 'u5l7-cd')); await show(c, line(P, `Range: ${T('C\\ge 8')}`, 'u5l7-cr')); } });
    }
    return steps;
  }
};

/* =============================== Stand Up Break! =============================== */
/* BEG: read the intercepts (and domain and range) off a standard-window screen; PRG: intercepts from the equation, and
 * does the standard window show them (if not, a better window); MAS: a cost relation in context. */
function suScreen(xi, yi) {
  const S = 300, P = 16, u = (S - 2 * P) / 20, X = (x) => P + (x + 10) * u, Y = (y) => P + (10 - y) * u;
  let s = `<svg viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" class="u5l7-sufig"><rect x="${P - 5}" y="${P - 5}" width="${S - 2 * P + 10}" height="${S - 2 * P + 10}" rx="7" fill="#2a2f37"/><rect x="${P}" y="${P}" width="${S - 2 * P}" height="${S - 2 * P}" fill="#fff"/>`;
  for (let i = -10; i <= 10; i++) { const c = i % 5 === 0 ? '#c5cad3' : '#e6e9ee'; s += `<line x1="${X(i)}" x2="${X(i)}" y1="${Y(10)}" y2="${Y(-10)}" stroke="${c}"/><line x1="${X(-10)}" x2="${X(10)}" y1="${Y(i)}" y2="${Y(i)}" stroke="${c}"/>`; }
  s += `<line x1="${X(-10)}" x2="${X(10)}" y1="${Y(0)}" y2="${Y(0)}" stroke="#111" stroke-width="1.8"/><line x1="${X(0)}" x2="${X(0)}" y1="${Y(10)}" y2="${Y(-10)}" stroke="#111" stroke-width="1.8"/>`;
  for (const n of [-10, -5, 5, 10]) { s += `<text x="${X(n)}" y="${Y(0) + 15}" font-size="13" text-anchor="middle" fill="#3a4254" font-weight="700" paint-order="stroke" stroke="#fff" stroke-width="3">${n < 0 ? '−' + -n : n}</text><text x="${X(0) - 5}" y="${Y(n) + 4}" font-size="13" text-anchor="end" fill="#3a4254" font-weight="700" paint-order="stroke" stroke="#fff" stroke-width="3">${n < 0 ? '−' + -n : n}</text>`; }
  // the line through (xi, 0) and (0, yi), clipped to the window
  const m = -yi / xi, b = yi, pts = [];
  for (const x of [-10, 10]) { const y = m * x + b; if (y >= -10 && y <= 10) pts.push([x, y]); }
  for (const y of [-10, 10]) { const x = (y - b) / m; if (x > -10 && x < 10) pts.push([x, y]); }
  pts.sort((p, q) => p[0] - q[0]);
  if (pts.length >= 2) s += `<line x1="${X(pts[0][0])}" y1="${Y(pts[0][1])}" x2="${X(pts[pts.length - 1][0])}" y2="${Y(pts[pts.length - 1][1])}" stroke="${BLUE}" stroke-width="3.5" stroke-linecap="round"/>`;
  return s + '</svg>';
}
const wTex = (w) => `x:[${w.xmin},\\ ${w.xmax}],\\ y:[${w.ymin},\\ ${w.ymax}]`;
const SU_CTX = [
  { who: 'A ticket website', fee: 'booking fee', per: 'per ticket', v: 'n', whole: true, thing: 'tickets', k: [2, 8] },
  { who: 'A pizza shop', fee: 'delivery fee', per: 'per pizza', v: 'p', whole: true, thing: 'pizzas', k: [2, 6] },
  { who: 'A print shop', fee: 'set-up fee', per: 'per T-shirt', v: 's', whole: true, thing: 'T-shirts', k: [3, 12] },
  { who: 'A music store', fee: 'membership fee', per: 'per lesson', v: 'L', whole: true, thing: 'lessons', k: [2, 10] },
  { who: 'A parking lot', fee: 'entry fee', per: 'per hour', v: 'h', whole: false, thing: 'hours', k: [2, 6] },
  { who: 'A taxi', fee: 'pick-up fee', per: 'per kilometre', v: 'd', whole: false, thing: 'kilometres', k: [3, 15] },
  { who: 'A kayak rental', fee: 'base fee', per: 'per hour', v: 't', whole: false, thing: 'hours', k: [2, 5] }
];
standup('u5l7', {
  intro: 'Work it out at your whiteboard station. Check each intercept by putting it back into the equation.',
  levels: {
    BEG: (r) => {
      if (r.chance(0.35)) { // like Example 1: an x-intercept halfway between two grid lines
        const m = r.pick([2, -2]), yi = r.sign() * r.pick([1, 3, 5, 7]), xi = -yi / m;
        return { q: '', text: 'The screen shows a line in the <b>standard window</b> (grid lines 1 apart). <b>Estimate</b> the x-intercept and the y-intercept.',
          fig: suScreen(xi, yi), a: [`x\\text{-intercept } (${texNum(xi)},\\ 0)`, `\\text{(halfway between } ${Math.floor(xi)} \\text{ and } ${Math.ceil(xi)}\\text{)}`, `y\\text{-intercept } (0,\\ ${yi})`] };
      }
      const xi = r.sign() * r.int(1, 9), yi = r.sign() * r.int(1, 9);
      return { q: '', text: 'The screen shows a line in the <b>standard window</b> (grid lines 1 apart). State the <b>x-intercept</b> and the <b>y-intercept</b>. Then state the domain and range.',
        fig: suScreen(xi, yi),
        a: [`x\\text{-intercept } (${xi},\\ 0)`, `y\\text{-intercept } (0,\\ ${yi})`, '\\text{Domain and range: all real numbers}'] };
    },
    PRG: (r) => {
      const m = r.pick([1, 2, 3, 4, 5, 6, -1, -2, -3, -4, -5, 0.5, -0.5]);
      let p = r.sign() * r.int(1, r.chance(0.5) ? 9 : 25); if (!Number.isInteger(m * p)) p *= 2;
      const b = -m * p, eq = lineTex(m, b), inStd = Math.abs(p) <= 9 && Math.abs(b) <= 9;
      const w = fitInts(p, b);
      return { q: eq, text: 'Find the <b>x- and y-intercepts</b>. Would the <b>standard window</b> show both? If not, give a better window.',
        a: [`x\\text{-int: } 0=${eq.slice(2)}\\ \\Rightarrow\\ x=${p}:\\ (${p},\\ 0)`, `y\\text{-int: } (0,\\ ${texNum(b)})`,
          inStd ? '\\text{The standard window shows both.}' : `\\text{Adjust, e.g. } ${wTex(w)}`] };
    },
    MAS: (r) => {
      const t = r.pick(SU_CTX), F = r.int(3, 15), rate = r.int(2, 6), k = r.int(t.k[0], t.k[1]), n2 = r.int(t.k[0] + 1, t.k[1] + 4), tot = F + rate * n2, v = t.v;
      const dom = t.whole ? `${v}=0,\\ 1,\\ 2,\\ \\dots` : `${v}\\ge 0`, rng = t.whole ? `C=${F},\\ ${F + rate},\\ ${F + 2 * rate},\\ \\dots` : `C\\ge ${F}`;
      return { q: `C=${F}+${rate}${v}`, text: `${t.who} charges a $${F} ${t.fee} plus $${rate} ${t.per}. (a) Find the <b>C-intercept</b>: what does it mean? (b) Find the cost for ${k} ${t.thing}. (c) How many ${t.thing} for a total of $${tot}? (d) State a sensible domain and range.`,
        a: [`\\text{(a) } (0,\\ ${F}):\\ \\text{the \\$${F} ${t.fee}}`, `\\text{(b) } C=${F}+${rate}(${k})=${F + rate * k}\\ \\text{dollars}`,
          `\\text{(c) } ${tot}=${F}+${rate}${v}\\ \\Rightarrow\\ ${v}=${n2}`, `\\text{(d) Domain: } ${dom}\\quad\\text{Range: } ${rng}`] };
    }
  }
});

mountFigures(); mountWarm(); mountLab();
mountExplainers({ frame, keys, fixWindow, tools, table, offEdges, context });
