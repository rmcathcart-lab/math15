/* Math 15 · Unit 6 · Lesson 4 — The Midpoint Formula.
 * Warm-up (Meet Me Halfway: a town map; pick two friends and they walk to meet halfway), static figures, the
 * drag-the-endpoints playground, and the explainers:
 *   halfway  (on a number line: step in from both ends, they meet in the middle; add and halve — warm-up numbers),
 *   midcount (count from both ends on a grid; Example 1(a), 1(b) checks and an odd count; from the 10C twin),
 *   walker   (half the run, half the rise; Example 2 check, Ben and Cara, Ava and Dev in the lake; from the 10C twin),
 *   average  (the midpoint formula as two averages on two number lines; formula, Examples 3(a), 3(b), 4(a), 4(b)),
 *   traps    (spot the mistake: forgot to halve, subtracted, a sign slip, a guess; the big one and Example 4(a)),
 *   trail    (Example 5: Fairview to Oakdale, a hiker walks half the run and half the rise to the rest area).
 * Colours (as in the 10C twin): run / x amber, rise / y purple, segments blue, midpoints red. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pairTex, texNum,
  svgEl, liveCtx, pulse, rightMark, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = COLORS.amber, PUR = COLORS.purple, BLUE = COLORS.blue, RED = COLORS.red, INK = COLORS.ink, GRN = COLORS.green;
const RUN = AMB, RISE = PUR, SEG = BLUE, MID = RED;
const tn = (v) => texNum(v);
const par = (v) => (v < 0 ? `(${tn(v)})` : tn(v));
const P2 = (x, y) => pairTex(x, y);
const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u6l4-panel', title ? `<div class="u6l4-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l4-line ' + cls, html); p.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { el.style.opacity = 0; return el; };
const lab = (host, x, y, html, cls = '') => { const d = h('div', cls, html); d.style.position = 'absolute'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.translate = '-50% -50%'; host.appendChild(d); return d; };
const sgn = (v) => (v > 0 ? 1 : v < 0 ? -1 : 0);
const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
const avgTex = (a, b) => `\\dfrac{${tn(a)}+${par(b)}}{2}=\\dfrac{${tn(a + b)}}{2}=${tn((a + b) / 2)}`;
function simpRad(n) { let k = 1; for (let d = 2; d * d <= n; d++) if (n % (d * d) === 0) k = d; return [k, n / (k * k)]; }

/** a window with equal units that holds every point, for a graph of W × H px with 18 px padding */
function fitWin(pts, W, H, pad = 1) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  const pw = W - 36, ph = H - 36, u = Math.min(pw / (x1 - x0), ph / (y1 - y0)), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return { xmin: cx - pw / u / 2, xmax: cx + pw / u / 2, ymin: cy - ph / u / 2, ymax: cy + ph / u / 2 };
}
/** a graph with equal x and y scales that fits in maxW × maxH. o: { x, y, center, g (extra Graph options), pad } */
function sqGraph(host, win, maxW, maxH, o = {}) {
  const g = o.g || {}, numbers = g.numbers !== false;
  const pd = o.pad || [18, 18, numbers && win.ymin >= 0 ? 34 : 18, numbers && win.xmin >= 0 ? 42 : 18];
  const xr = win.xmax - win.xmin, yr = win.ymax - win.ymin;
  const u = Math.min((maxW - pd[1] - pd[3]) / xr, (maxH - pd[0] - pd[2]) / yr);
  const W = u * xr + pd[1] + pd[3], H = u * yr + pd[0] + pd[2];
  const opts = Object.assign({ width: W, height: H, pad: pd }, win, g);
  if (o.x != null) { opts.x = o.x + (o.center ? (maxW - W) / 2 : 0); opts.y = (o.y || 0) + (o.center ? (maxH - H) / 2 : 0); }
  return new Graph(host, opts);
}
const corner = (A, B) => [B[0], A[1]];
const outside = (A, B) => ({ run: B[1] >= A[1] ? 's' : 'n', rise: B[0] >= A[0] ? 'e' : 'w' });
async function drawLegs(G, c, A, B, o = {}) {
  const C = corner(A, B);
  const run = G.segment(A, C, { color: RUN, width: 3.5, dash: true }), rise = G.segment(C, B, { color: RISE, width: 3.5, dash: true });
  const rm = rightMark(G.layers.top, G.toPx(...C), G.toPx(...A), G.toPx(...B), 14, { color: INK, width: 2 });
  rm.style.opacity = 0;
  await G.drawIn(run, o.ms || 600, c); await G.drawIn(rise, o.ms || 600, c);
  await appear(c, rm, 250);
  return { run, rise, rm, C };
}
function legLabel(G, A, B, which, html, o = {}) {
  const C = corner(A, B), out = outside(A, B), t = o.t ?? 0.5;
  const [p, q] = which === 'run' ? [A, C] : [C, B], at = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  return G.label(at[0], at[1], html, { pos: o.pos || (which === 'run' ? out.run : out.rise), cls: 'u6l4-legl ' + (which === 'run' ? 'u6l4-lrun' : 'u6l4-lrise'), gap: 6 });
}
/** count squares along a leg with little numbered bubbles, then remove them */
async function countLeg(G, c, from, to, ms = 110) {
  const dx = sgn(to[0] - from[0]), dy = sgn(to[1] - from[1]), n = Math.round(Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]));
  const els = [];
  for (let i = 1; i <= n; i++) {
    const e = G.label(from[0] + dx * (i - 0.5), from[1] + dy * (i - 0.5), String(i), { cls: 'u6l4-tick' + (dx ? ' u6l4-tick-r' : ' u6l4-tick-u') });
    e.style.opacity = 0; els.push(e); await pop(c, e, ms * 1.6); await sleep(c, ms * 0.4);
  }
  await sleep(c, 450);
  G.remove(...els);
  return n;
}
/** a little hiker standing at a graph point */
function walkerFig(G, color = INK) {
  const g = svgEl('g', { class: 'u6l4-walker' }, G.layers.top), b = g.body = svgEl('g', { class: 'u6l4-wbody' }, g);
  svgEl('rect', { x: -10, y: -26, width: 7, height: 12, rx: 2.5, fill: RUN }, b);
  svgEl('path', { d: 'M0 -25 V-11 M0 -11 L-6 0 M0 -11 L6 0 M0 -21 L8 -15', stroke: color, 'stroke-width': 3.6, 'stroke-linecap': 'round', fill: 'none' }, b);
  svgEl('circle', { cx: 0, cy: -32, r: 6.5, fill: color }, b);
  g.at = [0, 0];
  g.place = (x, y) => { g.at = [x, y]; const [px, py] = G.toPx(x, y); g.setAttribute('transform', `translate(${px} ${py})`); };
  return g;
}
async function walkTo(G, c, w, to, color, ms = 900) {
  const from = w.at.slice(), trail = G.segment(from, to, { color, width: 5, arrowB: true, cls: 'u6l4-trail' });
  await Promise.all([G.drawIn(trail, ms, c), tween(c, ms, (t) => w.place(from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t))]);
  w.place(...to);
  return trail;
}
function house(G, x, y, color) {
  const [px, py] = G.toPx(x, y), g = svgEl('g', { class: 'u6l4-house' }, G.layers.top);
  svgEl('rect', { x: px - 11, y: py - 18, width: 22, height: 14, fill: color, stroke: INK, 'stroke-width': 1.5 }, g);
  svgEl('path', { d: `M${px - 15} ${py - 17} L${px} ${py - 30} L${px + 15} ${py - 17} Z`, fill: color, stroke: INK, 'stroke-width': 1.5, 'fill-opacity': 0.75 }, g);
  svgEl('rect', { x: px - 3, y: py - 12, width: 6, height: 8, fill: '#fff', stroke: INK, 'stroke-width': 1 }, g);
  svgEl('circle', { cx: px, cy: py, r: 4.5, fill: INK, stroke: '#fff', 'stroke-width': 1.5 }, g);
  return g;
}
/** the lake of the warm-up map (centre (−1.8, 0.1), radii 1.1 × 0.8) */
function lake(G, layer) {
  const [cx, cy] = G.toPx(-1.8, 0.1);
  return svgEl('ellipse', { cx, cy, rx: G.ux * 1.1, ry: Math.abs(G.uy) * 0.8, fill: '#9fd0f0', stroke: '#4f8fc4', 'stroke-width': 2 }, layer || G.layers.data);
}

/* =============================== warm-up: Meet Me Halfway =============================== */
const FRIENDS = { Ava: { p: [-5, 3], col: '#f2d58a' }, Ben: { p: [1, 3], col: '#cfe0f7' }, Cara: { p: [5, -3], col: '#f2d58a' }, Dev: { p: [2, -3], col: '#cfe0f7' } };
function mountTown() {
  const host = document.getElementById('u6l4-town'); if (!host) return;
  const w = Math.min(520, host.clientWidth || 520);
  const G = sqGraph(host, { xmin: -6.6, xmax: 6.6, ymin: -4.6, ymax: 4.6 }, w, 300, { g: { numbers: false }, pad: [12, 12, 28, 30] });
  for (let x = -6; x <= 6; x++) G.label(x, -4.6, String(x).replace('-', '−'), { pos: 's', cls: 'u6l4-edge', gap: 4 });   // street numbers on the frame, like the board
  for (let y = -4; y <= 4; y++) G.label(-6.6, y, String(y).replace('-', '−'), { pos: 'w', cls: 'u6l4-edge', gap: 5 });
  const bg = G.layers.bg, [x0, y0] = G.toPx(-6.6, 4.6), [x1, y1] = G.toPx(6.6, -4.6);
  svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: '#eef5dc' }, bg);
  const [pk0, pk1] = [G.toPx(-5.6, -1.5), G.toPx(-3.3, -3.9)];
  svgEl('rect', { x: pk0[0], y: pk0[1], width: pk1[0] - pk0[0], height: pk1[1] - pk0[1], rx: 6, fill: '#bfe3a6' }, G.layers.data);
  for (const [x, y] of [[-5.1, -3.4], [-4.4, -3.5], [-3.8, -3.2], [-4.8, -2.6], [-3.9, -2.5]]) { const [px, py] = G.toPx(x, y); svgEl('circle', { cx: px, cy: py, r: G.ux * 0.28, fill: '#5e9e4e' }, G.layers.data); }
  G.label(-4.45, -1.85, '<b>Park</b>', { cls: 'u6l4-tlab' });
  lake(G); G.label(-1.8, 0.42, '<b>Lake</b>', { cls: 'u6l4-lakel' });
  // Town Hall and the Bakery
  const th = svgEl('g', {}, G.layers.top), [hx, hy] = G.toPx(0, 0);
  svgEl('rect', { x: hx + 3, y: hy - 22, width: 16, height: 16, fill: '#e8e3d6', stroke: INK, 'stroke-width': 1.4 }, th);
  svgEl('path', { d: `M${hx + 5} ${hy - 22} V${hy - 33} l7 3 l-7 3`, stroke: INK, 'stroke-width': 1.2, fill: RED }, th);
  G.label(0, 0, '<b>Town Hall</b>', { pos: 'se', cls: 'u6l4-tlab', gap: 6 });
  const bk = svgEl('g', {}, G.layers.top), [bx, by] = G.toPx(3, 0);
  svgEl('rect', { x: bx - 8, y: by - 18, width: 16, height: 14, fill: '#f7d9c4', stroke: INK, 'stroke-width': 1.4 }, bk);
  svgEl('circle', { cx: bx, cy: by, r: 4, fill: INK }, bk);
  G.label(3, 0, '<b>Bakery</b>', { pos: 'n', cls: 'u6l4-tlab', gap: 24 });
  for (const [n, f] of Object.entries(FRIENDS)) { house(G, ...f.p, f.col); G.label(...f.p, `<b>${n}</b>`, { pos: 's', cls: 'u6l4-tlab', gap: 6 }); }
  const ctx = liveCtx(), btns = [...document.querySelectorAll('[data-u6l4-f]')];
  let pick = [], live = [];
  const clear = () => { G.remove(...live); live = []; };
  async function meet(a, b) {
    clear();
    const A = FRIENDS[a].p, B = FRIENDS[b].p, M = mid(A, B);
    const path = G.segment(A, B, { color: RED, width: 3, dash: '8 6' }); live.push(path); await G.drawIn(path, 500, ctx);
    const wa = G.point(...A, { color: AMB, r: 8 }), wb = G.point(...B, { color: PUR, r: 8 }); live.push(wa, wb);
    await tween(ctx, 1300, (t) => { G.moveTo(wa, A[0] + (M[0] - A[0]) * t, A[1] + (M[1] - A[1]) * t); G.moveTo(wb, B[0] + (M[0] - B[0]) * t, B[1] + (M[1] - B[1]) * t); });
    G.remove(wa, wb);
    const m = G.point(...M, { color: MID, r: 8, label: T(P2(...M)), pos: M[1] > 0 ? 'n' : 'e', labelColor: MID, cls: 'u6l4-mpt' }); live.push(m, m.label);
    await G.reveal(m, ctx);
  }
  btns.forEach((b) => b.addEventListener('click', () => {
    const n = b.dataset.u6l4F;
    if (pick.includes(n)) { pick = pick.filter((x) => x !== n); b.classList.remove('on'); return; }
    if (pick.length === 2) { pick = []; btns.forEach((x) => x.classList.remove('on')); clear(); }
    pick.push(n); b.classList.add('on');
    if (pick.length === 2) meet(...pick);
  }));
  const clr = document.getElementById('u6l4-wclear');
  if (clr) clr.addEventListener('click', () => { pick = []; btns.forEach((x) => x.classList.remove('on')); clear(); });
}

/* =============================== static figures =============================== */
function mountStatics() {
  const grid = (id, w, numbers = true) => { const e = document.getElementById(id); return e ? sqGraph(e, { xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5 }, w, w, { g: { xlabels: 2, ylabels: 2, numbers } }) : null; };
  let G = grid('u6l4-ex1a', 330);
  if (G) { G.segment([-5, -2], [3, -2], { color: INK, width: 4.5 }); G.point(-5, -2, { color: INK, label: T('A'), pos: 's' }); G.point(3, -2, { color: INK, label: T('B'), pos: 's' }); }
  G = grid('u6l4-ex1b', 330);
  if (G) { G.segment([4, 5], [4, -3], { color: INK, width: 4.5 }); G.point(4, 5, { color: INK, label: T('C'), pos: 'e' }); G.point(4, -3, { color: INK, label: T('D'), pos: 'e' }); }
  G = grid('u6l4-ex1aA', 250, false);
  if (G) {
    G.segment([-5, -2], [3, -2], { color: INK, width: 4 }); G.point(-5, -2, { color: INK, label: T('A'), pos: 'w' }); G.point(3, -2, { color: INK, label: T('B'), pos: 'e' });
    G.segment([-5, -3.3], [-1, -3.3], { color: MID, width: 2.5, arrowA: true, arrowB: true }); G.segment([-1, -3.3], [3, -3.3], { color: MID, width: 2.5, arrowA: true, arrowB: true });
    G.label(-3, -3.3, T('4'), { pos: 's', color: MID, gap: 2 }); G.label(1, -3.3, T('4'), { pos: 's', color: MID, gap: 2 });
    G.point(-1, -2, { color: MID, label: T('M(-1,\\ -2)'), pos: 'n', labelColor: MID });
  }
  G = grid('u6l4-ex1bA', 250, false);
  if (G) {
    G.segment([4, 5], [4, -3], { color: INK, width: 4 }); G.point(4, 5, { color: INK, label: T('C'), pos: 'w' }); G.point(4, -3, { color: INK, label: T('D'), pos: 'w' });
    G.segment([5.3, 5], [5.3, 1], { color: MID, width: 2.5, arrowA: true, arrowB: true }); G.segment([5.3, 1], [5.3, -3], { color: MID, width: 2.5, arrowA: true, arrowB: true });
    G.label(5.3, 3, T('4'), { pos: 'e', color: MID, gap: 2 }); G.label(5.3, -1, T('4'), { pos: 'e', color: MID, gap: 2 });
    G.point(4, 1, { color: MID, label: T('M(4,\\ 1)'), pos: 'w', labelColor: MID });
  }
  G = grid('u6l4-ex2', 380);
  if (G) { G.segment([1, 1], [5, 5], { color: INK, width: 4.5 }); G.point(1, 1, { color: INK, label: T('E'), pos: 'nw' }); G.point(5, 5, { color: INK, label: T('F'), pos: 'nw' }); }
}

/* =============================== the drag-the-endpoints playground =============================== */
function mountPlay() {
  const host = document.getElementById('u6l4-play'), ro = document.getElementById('u6l4-readout'); if (!host || !ro) return;
  let seg = null, mp = null;
  const G = new Graph(host, { width: 430, height: 430, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2,
    interactive: { snap: 1, max: 2, coords: true, color: 'blue', onChange: () => render() } });
  function render() {
    if (seg) G.remove(seg); if (mp) G.remove(mp, mp.label); seg = mp = null;
    const pts = G.points();
    if (pts.length < 2) { ro.innerHTML = `<div class="u6l4-line">Tap the grid to place ${pts.length ? 'one more point' : 'two points'}.</div>`; return; }
    const [[x1, y1], [x2, y2]] = pts, M = mid(pts[0], pts[1]);
    seg = G.segment(pts[0], pts[1], { color: SEG, width: 4 });
    mp = G.point(...M, { color: MID, r: 8, label: T('M' + P2(...M)), pos: (x2 - x1) * (y2 - y1) >= 0 ? 'se' : 'ne', labelColor: MID });
    const dx = x2 - x1, dy = y2 - y1, N = dx * dx + dy * dy, [k, m] = simpRad(N);
    const len = N === 0 ? '0' : m === 1 ? String(k) : `${k > 1 ? k : ''}\\sqrt{${m}}\\approx${Math.sqrt(N).toFixed(2)}`;
    ro.innerHTML = `<div class="u6l4-line">${T(`(x_1,\\ y_1)=${P2(x1, y1)}`)}<br>${T(`(x_2,\\ y_2)=${P2(x2, y2)}`)}</div>`
      + `<div class="u6l4-line u6l4-trun">${T(`x_M=${avgTex(x1, x2)}`)}</div>`
      + `<div class="u6l4-line u6l4-trise">${T(`y_M=${avgTex(y1, y2)}`)}</div>`
      + `<div class="u6l4-line u6l4-big u6l4-cm">${T('M' + P2(...M))}</div>`
      + `<div class="u6l4-line u6l4-note">length (Lesson 3): ${T(`\\sqrt{${par(dx)}^2+${par(dy)}^2}=${len}`)}<br>each half is exactly half of that.</div>`;
  }
  for (const [x, y] of [[-5, -3], [3, 5]]) { const p = G.point(x, y, { color: 'blue', coords: true, r: 8, cls: 'bk-upt' }); G.userPts.push(p); }
  render();
}

/* ======================================================================================
 * Explainer: halfway on a number line
 * ====================================================================================== */
const HW = {
  q3: { label: 'Warm-up Q3: 2 and 8', a: 2, b: 8, min: 0, max: 10 },
  q1: { label: 'Ava and Ben: −5 and 1', a: -5, b: 1, min: -6, max: 2 },
  big: { label: 'Ava and Dev: −5 and 2', a: -5, b: 2, min: -6, max: 3 }
};
const halfway = {
  title: 'Halfway between two numbers',
  height: 400,
  minW: 860,
  choices: Object.keys(HW).map((k) => ({ v: k, label: HW[k].label })),
  intro: 'Two walkers start at the two numbers and step toward each other. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = HW[k], a = d.a, b = d.b, n = b - a, m = (a + b) / 2, whole = Math.floor(n / 2), odd = n % 2 === 1;
    const NL = new NumberLine(stage, { x: 30, y: 20, width: ex.W - 60, height: 170, axisY: 110, min: d.min, max: d.max });
    const pa = hide(NL.point(a, { color: INK })), pb = hide(NL.point(b, { color: INK }));
    const e1 = hide(lab(stage, ex.W / 2, 250, '', 'u6l4-steq')), e2 = hide(lab(stage, ex.W / 2, 320, '', 'u6l4-steq u6l4-mute'));
    return [
      { cap: `Two numbers: ${T(tn(a))} and ${T(tn(b))}. Which number is exactly <b>halfway</b> between them?`,
        run: async (c) => { await Promise.all([pop(c, pa), pop(c, pb)]); } },
      { cap: `Step in from <b>both ends</b> at the same time: ${whole} whole step${whole === 1 ? '' : 's'} each${odd ? ', then half a step more' : ''}.`,
        run: async (c) => {
          for (let i = 0; i < whole; i++) await Promise.all([NL.hop(c, a + i, a + i + 1, { color: RUN, height: 30 }), NL.hop(c, b - i, b - i - 1, { color: RISE, height: 30, below: true })]);
          if (odd) await Promise.all([NL.hop(c, a + whole, m, { color: RUN, height: 22 }), NL.hop(c, b - whole, m, { color: RISE, height: 22, below: true })]);
        } },
      { cap: `They meet at <b>${tn(m).replace('-', '−')}</b>, ${tn(n / 2)} from each end. That is the halfway point.`,
        run: async (c) => { const p = NL.point(m, { color: MID, r: 10 }); await pop(c, p); const l = lab(stage, 30 + NL.toPx(m), 66, T(tn(m)), 'u6l4-nlm'); await pop(c, l); } },
      { cap: `Shortcut: <b>add and halve</b>. ${T(avgTex(a, b))}. That is the <b>average</b> of the two numbers.`,
        run: async (c) => { e1.innerHTML = T(`\\text{halfway}=${avgTex(a, b)}`); await show(c, e1); } },
      { cap: `Careful: <b>subtracting</b> tells how <b>far apart</b> they are (${T(`${tn(b)}-${par(a)}=${n}`)}), not <b>where</b> the middle is.`,
        run: async (c) => { e2.innerHTML = T(`\\text{how far apart}=${tn(b)}-${par(a)}=${n}`); await show(c, e2); } }
    ];
  }
};

/* =============================== explainer: count from both ends (10C twin) =============================== */
const CNT = {
  a: { label: 'Example 1(a) check', A: [-5, -2], B: [3, -2], nA: 'A', nB: 'B', ax: 'x', min: -6, max: 4 },
  b: { label: 'Example 1(b) check', A: [4, 5], B: [4, -3], nA: 'C', nB: 'D', ax: 'y', min: -4, max: 6 },
  odd: { label: `An odd count: ${T('P(-4,\\ 2)')} to ${T('Q(3,\\ 2)')}`, A: [-4, 2], B: [3, 2], nA: 'P', nB: 'Q', ax: 'x', min: -5, max: 4 }
};
const midcount = {
  title: 'Count from both ends',
  height: 470,
  minW: 860,
  choices: Object.keys(CNT).map((k) => ({ v: k, label: CNT[k].label })),
  intro: 'Two walkers start at the ends and step toward each other, one square at a time. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CNT[k], A = d.A, B = d.B, H = ex.def.height, hz = d.ax === 'x', M = mid(A, B), n = Math.abs(hz ? B[0] - A[0] : B[1] - A[1]);
    const G = sqGraph(stage, { xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5 }, 450, H - 20, { x: 10, y: 10, center: true, g: { xlabels: 2, ylabels: 2 } });
    const P = panel(stage, G.W + 30, 14, ex.W - G.W - 44, H - 28, `The ${T(d.ax)}-coordinates on a number line`);
    const share = hz ? `same ${T('y')}` : `same ${T('x')}`, cA = hz ? A[0] : A[1], cB = hz ? B[0] : B[1], cM = hz ? M[0] : M[1];
    let w1, w2;
    const dot = (p) => { const g = svgEl('circle', { r: 11, fill: RUN, stroke: '#fff', 'stroke-width': 3, class: 'u6l4-wdot' }, G.layers.top); g.at = p.slice(); g.place = (x, y) => { g.at = [x, y]; const [px, py] = G.toPx(x, y); g.setAttribute('cx', px); g.setAttribute('cy', py); }; g.place(...p); return g; };
    const posA = hz ? 'n' : 'w';
    return [
      { cap: `${T(d.nA + P2(...A))} and ${T(d.nB + P2(...B))} have the ${share}, so the segment is <b>${hz ? 'horizontal' : 'vertical'}</b>.`,
        run: async (c) => { await G.drawIn(G.segment(A, B, { color: INK, width: 4.5 }), 600, c); await G.reveal(G.point(...A, { color: INK, label: T(d.nA + P2(...A)), pos: posA }), c); await G.reveal(G.point(...B, { color: INK, label: T(d.nB + P2(...B)), pos: posA }), c); } },
      { cap: `Count the squares from ${T(d.nA)} to ${T(d.nB)}: <b>${n}</b>.`,
        run: async (c) => { await countLeg(G, c, A, B, 150); } },
      { cap: `A walker starts at each end. They step toward each other at the same speed${n % 2 ? `: ${Math.floor(n / 2)} whole squares each, then half a square more` : `, ${n / 2} squares each`}.`,
        run: async (c) => {
          w1 = dot(A); w2 = dot(B); await Promise.all([pop(c, w1), pop(c, w2)]);
          const ux = sgn(B[0] - A[0]), uy = sgn(B[1] - A[1]);
          let t = 0; const hn = n / 2;
          while (t < hn - 1e-9) {
            const st = Math.min(1, hn - t), a0 = w1.at.slice(), b0 = w2.at.slice();
            await tween(c, 420 * st + 120, (s) => { w1.place(a0[0] + ux * st * s, a0[1] + uy * st * s); w2.place(b0[0] - ux * st * s, b0[1] - uy * st * s); });
            t += st; await sleep(c, 140);
          }
          w1.place(...M); w2.place(...M);
        } },
      { cap: `They meet ${T(tn(n / 2))} squares in from each end: the midpoint ${T('M' + P2(...M))}.${n % 2 ? ' A midpoint can sit in the middle of a square.' : ''}`,
        run: async (c) => {
          G.remove(w1, w2);
          const m = G.point(...M, { color: MID, r: 9, label: T('M' + P2(...M)), pos: hz ? 'n' : 'w', labelColor: MID, gap: hz ? 30 : 8 }); await G.reveal(m, c);
          const o = 1.15, sd = hz ? -1 : 1;
          const segs = hz ? [[[A[0], A[1] + sd * o], [M[0], M[1] + sd * o]], [[M[0], M[1] + sd * o], [B[0], B[1] + sd * o]]] : [[[A[0] + sd * o, A[1]], [M[0] + sd * o, M[1]]], [[M[0] + sd * o, M[1]], [B[0] + sd * o, B[1]]]];
          for (const [p, q] of segs) { await G.drawIn(G.segment(p, q, { color: MID, width: 2.5, arrowA: true, arrowB: true }), 400, c); await pop(c, G.label(...mid(p, q), T(tn(n / 2)), { pos: hz ? 's' : 'e', color: MID, gap: 3, cls: 'u6l4-hl' })); }
        } },
      { cap: `In numbers: ${T('M')} keeps the ${share}, and its ${T(d.ax)} is the <b>average</b> of ${T(tn(cA))} and ${T(tn(cB))}: ${T(avgTex(cA, cB))}.`,
        run: async (c) => {
          const NL = new NumberLine(P, { width: ex.W - G.W - 72, height: 120, axisY: 82, min: d.min, max: d.max });
          NL.point(cA, { color: INK }); NL.point(cB, { color: INK });
          await appear(c, NL.el);
          await NL.hop(c, cA, cM, { label: T(tn(Math.abs(cM - cA))), color: RUN, height: 38 }); await NL.hop(c, cM, cB, { label: T(tn(Math.abs(cB - cM))), color: RUN, height: 38 });
          await pop(c, NL.point(cM, { color: MID, r: 9 }));
          await show(c, line(P, T(`${d.ax}_M=${avgTex(cA, cB)}`), 'u6l4-big'));
          await show(c, line(P, 'Add the two ends and halve: the <b>average</b> is the number exactly halfway between them.', 'u6l4-note'));
        } }
    ];
  }
};

/* =============================== explainer: half the run, half the rise (10C twin) =============================== */
const WALK = {
  ex2: { label: 'Example 2 check', A: [1, 1], B: [5, 5], nA: 'E', nB: 'F', win: { xmin: -1.5, xmax: 7.5, ymin: -1.5, ymax: 7 } },
  warm: { label: 'Warm-up: Ben and Cara', A: [1, 3], B: [5, -3], nA: '\\text{Ben}', nB: '\\text{Cara}', win: { xmin: -1.5, xmax: 7.5, ymin: -4.5, ymax: 4.8 } },
  big: { label: 'The big one: Ava and Dev', A: [-5, 3], B: [2, -3], nA: '\\text{Ava}', nB: '\\text{Dev}', win: { xmin: -6.6, xmax: 3.6, ymin: -4.5, ymax: 4.8 }, lake: true }
};
const walker = {
  title: 'Half the run, half the rise',
  height: 480,
  minW: 880,
  choices: Object.keys(WALK).map((k) => ({ v: k, label: WALK[k].label })),
  intro: 'A hiker walks the triangle instead of the slant: across, then up or down. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = WALK[k], A = d.A, B = d.B, M = mid(A, B), H = ex.def.height;
    const G = sqGraph(stage, d.win, 520, H - 20, { x: 10, y: 10, center: true, g: { xlabels: 1, ylabels: 1 } });
    if (d.lake) { lake(G); G.label(-2.35, -0.3, 'lake', { cls: 'u6l4-lakel u6l4-sm' }); }
    const P = panel(stage, G.W + 30, 14, ex.W - G.W - 44, H - 28, `${T(d.nA)} to ${T(d.nB)}`);
    const rx = B[0] - A[0], ry = B[1] - A[1], H1 = [A[0] + rx / 2, A[1]], up = ry > 0;
    const run = Math.abs(rx), rise = Math.abs(ry), ud = up ? 'up' : 'down';
    const whole = [`${run} right`, `${rise} ${ud}`], half = [`${tn(run / 2)} right`, `${tn(rise / 2)} ${ud}`];
    let w;
    return [
      { cap: `Segment from ${T(d.nA + P2(...A))} to ${T(d.nB + P2(...B))} is diagonal: no shared coordinate to count along.`,
        run: async (c) => { await G.drawIn(G.segment(A, B, { color: SEG, width: 5 }), 700, c); await G.reveal(G.point(...A, { color: SEG, label: T(d.nA + P2(...A)), pos: up ? 's' : 'n' }), c); await G.reveal(G.point(...B, { color: SEG, label: T(d.nB + P2(...B)), pos: up ? 'n' : 's' }), c); } },
      { cap: `The whole trip from ${T(d.nA)} to ${T(d.nB)}: <b>${whole[0]}</b> and <b>${whole[1]}</b>.`,
        run: async (c) => {
          await drawLegs(G, c, A, B);
          await pop(c, legLabel(G, A, B, 'run', T(String(run)))); await pop(c, legLabel(G, A, B, 'rise', T(String(rise)), { t: 0.75 }));
          await show(c, line(P, `whole trip: <b class="u6l4-crun">${whole[0]}</b>, <b class="u6l4-crise">${whole[1]}</b>`));
        } },
      { cap: `The hiker walks <b>half the run</b>: ${half[0]}…`,
        run: async (c) => { w = walkerFig(G); w.place(...A); await pop(c, w.body); await walkTo(G, c, w, H1, RUN, 900); } },
      { cap: `…then <b>half the rise</b>: ${half[1]}. The hiker is standing on the segment, at ${T('M' + P2(...M))}.${d.lake ? ' In the lake!' : ''}`,
        run: async (c) => {
          await walkTo(G, c, w, M, RISE, 900);
          await G.reveal(G.point(...M, { color: MID, r: 9, label: T('M' + P2(...M)), pos: up ? 'se' : 'ne', labelColor: MID }), c);
          await show(c, line(P, `half of each: <b class="u6l4-crun">${half[0]}</b>, <b class="u6l4-crise">${half[1]}</b> → ${T('M' + P2(...M))}`));
        } },
      { cap: `Do the same again (${half[0]}, ${half[1]}) and the hiker lands exactly on ${T(d.nB)}. So ${T('M')} really is halfway.`,
        run: async (c) => { await walkTo(G, c, w, [B[0], M[1]], RUN, 800); await walkTo(G, c, w, B, RISE, 800); } },
      { cap: `Check with averages: ${T(`x_M=${avgTex(A[0], B[0])}`)} and ${T(`y_M=${avgTex(A[1], B[1])}`)}.`,
        run: async (c) => {
          G.remove(w);
          await show(c, line(P, T('x_M=' + avgTex(A[0], B[0])), 'u6l4-trun')); await show(c, line(P, T('y_M=' + avgTex(A[1], B[1])), 'u6l4-trise'));
          await show(c, line(P, 'Counting and averaging give the <b>same point</b>.', 'u6l4-note'));
        } }
    ];
  }
};

/* =============================== explainer: the midpoint formula as the average (10C twin) =============================== */
const AVG = {
  sym: { label: 'The formula', sym: true, A: [2, 7], B: [9, 2], win: { xmin: 0, xmax: 10.5, ymin: 0, ymax: 8.5 } },
  ex3a: { label: 'Example 3(a) check', A: [2, 8], B: [10, 4], nA: 'P', nB: 'Q', win: { xmin: -1, xmax: 12, ymin: -1, ymax: 10 }, xr: [0, 12], yr: [2, 10] },
  ex3b: { label: 'Example 3(b) check', A: [5, 1], B: [11, 9], nA: 'R', nB: 'S', win: { xmin: -1, xmax: 13, ymin: -1, ymax: 11 }, xr: [3, 13], yr: [0, 10] },
  ex4a: { label: 'Example 4(a) check', A: [-6, 3], B: [2, -7], nA: 'A', nB: 'B', win: { xmin: -8, xmax: 4, ymin: -9, ymax: 5 }, xr: [-8, 4], yr: [-8, 4] },
  ex4b: { label: 'Example 4(b) check', A: [-9, -4], B: [3, -10], nA: 'C', nB: 'D', win: { xmin: -11, xmax: 5, ymin: -12, ymax: 2 }, xr: [-10, 4], yr: [-11, -2] },
  ex4c: { label: 'Example 4(c) check', A: [-3, 4], B: [2, -1], nA: 'P', nB: 'Q', win: { xmin: -5, xmax: 4, ymin: -3, ymax: 6 }, xr: [-4, 3], yr: [-2, 5] }
};
const average = {
  title: 'The midpoint formula: average the x’s, average the y’s',
  height: 480,
  minW: 880,
  choices: Object.keys(AVG).map((k) => ({ v: k, label: AVG[k].label })),
  intro: 'Split the two points into their x-values and their y-values, and find the middle of each. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = AVG[k], A = d.A, B = d.B, M = mid(A, B), H = ex.def.height, sym = !!d.sym;
    const G = sqGraph(stage, d.win, 430, H - 20, sym ? { x: 10, y: 10, center: true, g: { numbers: false }, pad: [18, 18, 46, 54] } : { x: 10, y: 10, center: true, g: { xlabels: 2, ylabels: 2 } });
    const PW = ex.W - G.W - 44, P = panel(stage, G.W + 30, 14, PW, H - 28, '');
    const NW = PW - 28;
    const lx = sym ? [{ v: A[0], html: T('x_1') }, { v: B[0], html: T('x_2') }] : null, ly = sym ? [{ v: B[1], html: T('y_2') }, { v: A[1], html: T('y_1') }] : null;
    const xs = sym ? [1, 10] : d.xr, ys = sym ? [1, 8] : d.yr;
    const nmA = sym ? 'P(x_1,\\ y_1)' : d.nA + P2(...A), nmB = sym ? 'Q(x_2,\\ y_2)' : d.nB + P2(...B);
    const xm = sym ? '\\dfrac{x_1+x_2}{2}' : avgTex(A[0], B[0]), ym = sym ? '\\dfrac{y_1+y_2}{2}' : avgTex(A[1], B[1]);
    const gap = (a, b) => (sym ? '' : T((b > a ? '+' : '') + tn(b - a)));
    const NL = (labT, rng, labels) => {
      const t = line(P, `<b>${labT}</b>`, 'u6l4-nlh');
      const L = new NumberLine(P, { width: NW, height: 74, axisY: 44, min: rng[0], max: rng[1], numbers: true, labels, labelStep: rng[1] - rng[0] > 12 ? 2 : 1 });
      hide(t); hide(L.el); return { t, L };
    };
    const X = NL(`${T('x')}-values`, xs, lx), Y = NL(`${T('y')}-values`, ys, ly);
    return [
      { cap: `${T(nmA)} and ${T(nmB)}.`,
        run: async (c) => { await G.drawIn(G.segment(A, B, { color: SEG, width: 5 }), 700, c); await G.reveal(G.point(...A, { color: SEG, label: T(nmA), pos: A[1] > B[1] ? 'n' : 's' }), c); await G.reveal(G.point(...B, { color: SEG, label: T(nmB), pos: B[1] > A[1] ? 'n' : 's' }), c); } },
      { cap: sym ? `The ${T('x')}-values alone: halfway between ${T('x_1')} and ${T('x_2')} is their average, ${T('\\frac{x_1+x_2}{2}')}.` : `The ${T('x')}-values alone: ${T(tn(A[0]))} and ${T(tn(B[0]))}. Add and halve: ${T('x_M=' + xm)}.`,
        run: async (c) => {
          await show(c, X.t); await appear(c, X.L.el);
          await Promise.all([pop(c, X.L.point(A[0], { color: SEG })), pop(c, X.L.point(B[0], { color: SEG }))]);
          await X.L.hop(c, A[0], M[0], { label: gap(A[0], M[0]), color: RUN, height: 24 }); await X.L.hop(c, M[0], B[0], { label: gap(M[0], B[0]), color: RUN, height: 24 });
          await pop(c, X.L.point(M[0], { color: MID, r: 9 })); await show(c, line(P, T('x_M=' + xm), 'u6l4-trun'));
        } },
      { cap: sym ? `The ${T('y')}-values alone: halfway between ${T('y_1')} and ${T('y_2')} is ${T('\\frac{y_1+y_2}{2}')}.` : `The ${T('y')}-values alone: ${T(tn(A[1]))} and ${T(tn(B[1]))}. ${T('y_M=' + ym)}.`,
        run: async (c) => {
          await show(c, Y.t); await appear(c, Y.L.el);
          await Promise.all([pop(c, Y.L.point(A[1], { color: SEG })), pop(c, Y.L.point(B[1], { color: SEG }))]);
          await Y.L.hop(c, A[1], M[1], { label: gap(A[1], M[1]), color: RISE, height: 24 }); await Y.L.hop(c, M[1], B[1], { label: gap(M[1], B[1]), color: RISE, height: 24 });
          await pop(c, Y.L.point(M[1], { color: MID, r: 9 })); await show(c, line(P, T('y_M=' + ym), 'u6l4-trise'));
        } },
      { cap: sym ? 'Put the two averages together: that point lands exactly halfway along the segment.' : `Put them together: ${T('M' + P2(...M))}. It lands right on the segment, halfway along.`,
        run: async (c) => {
          await G.drawIn(G.vline(M[0], { color: RUN, width: 2.5 }), 500, c); await G.drawIn(G.hline(M[1], { color: RISE, width: 2.5 }), 500, c);
          await G.reveal(G.point(...M, { color: MID, r: 9, label: sym ? T('M') : T('M' + P2(...M)), pos: (B[1] - A[1]) * (B[0] - A[0]) > 0 ? 'nw' : 'ne', labelColor: MID }), c);
        } },
      { cap: `The <b>midpoint formula</b>: average the ${T('x')}’s and average the ${T('y')}’s.`,
        run: async (c) => { const f = line(P, T('M\\left(\\dfrac{x_1+x_2}{2},\\ \\dfrac{y_1+y_2}{2}\\right)'), 'u6l4-boxed'); await pop(c, f, 500); } }
    ];
  }
};

/* =============================== explainer: spot the mistake =============================== */
const TRAP = {
  big: { label: 'The big one: Ava and Dev', A: ['\\text{Ava}', -5, 3], B: ['\\text{Dev}', 2, -3], win: { xmin: -6.5, xmax: 5, ymin: -4.5, ymax: 4.5 }, lake: true,
    answers: [
      { who: 'Sam', p: [0, 0], pos: 'se', why: `guessed “the middle of town”. ${T('(0,\\ 0)')} isn’t even on the segment.` },
      { who: 'Priya', p: [-3, 0], pos: 'sw', why: `added but <b>forgot to halve</b>: ${T('-5+2=-3')}.` },
      { who: 'Jordan', p: [3.5, -3], pos: 'e', why: `<b>subtracted</b>: ${T('\\frac{2-(-5)}{2}=3.5')}. That’s the distance habit.` },
      { who: 'Lee', p: [-1.5, 0], pos: 'ne', ok: true, why: `added <b>and</b> halved: ${T('\\frac{-5+2}{2}=-1.5')} and ${T('\\frac{3+(-3)}{2}=0')}.` }] },
  ex4a: { label: 'Example 4(a) check', A: ['A', -6, 3], B: ['B', 2, -7], win: { xmin: -8, xmax: 6, ymin: -8.5, ymax: 6 },
    answers: [
      { who: 'Sam', p: [-4, -4], pos: 'w', why: `added but <b>forgot to halve</b>: ${T('-6+2=-4')} and ${T('3+(-7)=-4')}.` },
      { who: 'Priya', p: [4, -5], pos: 'e', why: `<b>subtracted</b>: ${T('\\frac{2-(-6)}{2}=4')} and ${T('\\frac{-7-3}{2}=-5')}.` },
      { who: 'Jordan', p: [-2, 5], pos: 'e', why: `a <b>sign slip</b>: ${T('3+(-7)')} is ${T('-4')}, not 10.` },
      { who: 'Lee', p: [-2, -2], pos: 'e', ok: true, why: `${T('\\frac{-6+2}{2}=-2')} and ${T('\\frac{3+(-7)}{2}=-2')}.` }] }
};
const traps = {
  title: 'Spot the mistake',
  height: 480,
  minW: 900,
  choices: Object.keys(TRAP).map((k) => ({ v: k, label: TRAP[k].label })),
  intro: 'Four students, four answers. Plot each one and check it. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TRAP[k], [nA, xA, yA] = d.A, [nB, xB, yB] = d.B, A = [xA, yA], B = [xB, yB], M = mid(A, B), H = ex.def.height;
    const G = sqGraph(stage, d.win, 440, H - 20, { x: 10, y: 10, center: true, g: { xlabels: 2, ylabels: 2 } });
    if (d.lake) lake(G);
    const P = panel(stage, G.W + 30, 14, ex.W - G.W - 44, H - 28, `Midpoint of ${T(nA)} and ${T(nB)}`);
    const steps = [
      { cap: `${T(nA + P2(xA, yA))} and ${T(nB + P2(xB, yB))}. Where is the midpoint? Four students answered.`,
        run: async (c) => {
          await G.drawIn(G.segment(A, B, { color: SEG, width: 4.5 }), 600, c);
          await G.reveal(G.point(...A, { color: SEG, label: T(nA + P2(xA, yA)), pos: 'n' }), c); await G.reveal(G.point(...B, { color: SEG, label: T(nB + P2(xB, yB)), pos: 's' }), c);
        } }
    ];
    d.answers.forEach((s) => {
      steps.push({
        cap: `<b>${s.who}</b> says ${T(P2(...s.p))}: ${s.why}${s.ok ? ' <b>Right!</b> It sits on the segment, exactly halfway.' : ''}`,
        run: async (c) => {
          const col = s.ok ? MID : '#8a8f99';
          const p = G.point(...s.p, { color: col, r: s.ok ? 9 : 7, open: !s.ok, label: `<b>${s.who}</b>${s.ok ? '' : ' ✗'}`, pos: s.pos, labelColor: col }); await G.reveal(p, c);
          const card = h('div', 'u6l4-tcard' + (s.ok ? ' ok' : ''), `<b>${s.who}</b> ${T(P2(...s.p))} <span class="u6l4-tmark">${s.ok ? '✓' : '✗'}</span><div class="u6l4-twhy">${s.why}</div>`);
          P.appendChild(hide(card)); await show(c, card);
          if (s.ok) {
            for (const [p1, p2] of [[A, M], [M, B]]) {
              const [a, b] = [G.toPx(...p1), G.toPx(...p2)], cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2, L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L * 9, ny = (b[0] - a[0]) / L * 9;
              const t = svgEl('path', { d: `M${cx - nx} ${cy - ny} L${cx + nx} ${cy + ny} M${cx - nx + (b[0] - a[0]) / L * 6} ${cy - ny + (b[1] - a[1]) / L * 6} L${cx + nx + (b[0] - a[0]) / L * 6} ${cy + ny + (b[1] - a[1]) / L * 6}`, stroke: MID, 'stroke-width': 3 }, G.layers.top);
              await appear(c, t, 250);
            }
          }
        }
      });
    });
    return steps;
  }
};

/* =============================== explainer: Example 5 on the trail map =============================== */
const trail = {
  title: 'Example 5 check: a rest area halfway',
  height: 480,
  minW: 900,
  intro: 'A trail map with a grid: 1 unit = 1 km. Press <b>Next</b>.',
  make(stage, k, ex) {
    const H = ex.def.height, A = [-15, 22], B = [35, -8], M = [10, 7];
    const G = sqGraph(stage, { xmin: -22, xmax: 40, ymin: -14, ymax: 30 }, 540, H - 20, { x: 10, y: 10, center: true, g: { xstep: 5, ystep: 5, xlabels: 10, ylabels: 10 } });
    const bg = G.layers.bg, Pp = (x, y) => G.toPx(x, y).map((v) => v.toFixed(1)).join(' ');
    svgEl('path', { d: `M${Pp(-22, 5)} C${Pp(-5, 12)} ${Pp(5, -2)} ${Pp(18, 2)} S${Pp(30, 18)} ${Pp(40, 14)}`, stroke: '#9ccbee', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, bg);
    G.label(26, 13, 'river', { cls: 'u6l4-mapl u6l4-mapr' });
    const P = panel(stage, G.W + 30, 14, ex.W - G.W - 44, H - 28, 'Rest area');
    const town = (p, n, pos) => { const g = house(G, ...p, '#f2d58a'); const l = G.label(...p, `<b>${n}</b> ${T(P2(...p))}`, { pos, cls: 'bk-ptlab', gap: pos === 'n' ? 32 : 10 }); return [g, l]; };
    let w;
    return [
      { cap: `Fairview is at ${T('(-15,\\ 22)')} and Oakdale is at ${T('(35,\\ -8)')}. The rest area goes exactly halfway along the straight trail.`,
        run: async (c) => {
          for (const e of town(A, 'Fairview', 'n')) await appear(c, e);
          for (const e of town(B, 'Oakdale', 'sw')) await appear(c, e);
          await G.drawIn(G.segment(A, B, { color: SEG, width: 4 }), 700, c);
        } },
      { cap: `The whole trip: ${T('35-(-15)=50')} km east and ${T('-8-22=-30')}, so 30 km south.`,
        run: async (c) => {
          await drawLegs(G, c, A, B);
          await pop(c, legLabel(G, A, B, 'run', T('50'))); await pop(c, legLabel(G, A, B, 'rise', T('30')));
          await show(c, line(P, '<b class="u6l4-crun">50 km east</b>, <b class="u6l4-crise">30 km south</b>'));
        } },
      { cap: 'A hiker from Fairview walks <b>half</b> of each: 25 km east, then 15 km south…',
        run: async (c) => {
          w = walkerFig(G); w.place(...A); await pop(c, w.body);
          await walkTo(G, c, w, [10, 22], RUN, 900); await walkTo(G, c, w, M, RISE, 900);
          await show(c, line(P, `half: <b class="u6l4-crun">25 east</b>, <b class="u6l4-crise">15 south</b>`));
        } },
      { cap: `…and lands on the trail at ${T('(10,\\ 7)')}: the rest area.`,
        run: async (c) => {
          G.remove(w);
          await G.reveal(G.point(...M, { color: MID, r: 9, label: `rest area ${T('(10,\\ 7)')}`, pos: 'ne', labelColor: MID }), c);
        } },
      { cap: `Check with the formula: ${T('\\left(\\frac{-15+35}{2},\\ \\frac{22+(-8)}{2}\\right)=\\left(\\frac{20}{2},\\ \\frac{14}{2}\\right)=(10,\\ 7)')}`,
        run: async (c) => {
          for (const s of ['x_M=\\dfrac{-15+35}{2}=\\dfrac{20}{2}=10', 'y_M=\\dfrac{22+(-8)}{2}=\\dfrac{14}{2}=7']) await show(c, line(P, T(s), s[0] === 'x' ? 'u6l4-trun' : 'u6l4-trise'));
          const s = stamp(P, '(10, 7)'); s.style.alignSelf = 'center'; s.style.marginTop = 'auto'; await stampIn(c, s);
        } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const pr = (v) => (v < 0 ? '(' + v + ')' : String(v));
  const tx = (v) => String(v);
  const P = (n, p) => n + '(' + tx(p[0]) + ',\\ ' + tx(p[1]) + ')';
  const avg = (a, b) => '\\dfrac{' + a + '+' + pr(b) + '}{2}=\\dfrac{' + (a + b) + '}{2}=' + tx((a + b) / 2);
  const SU_C = { ink: '#1c2230', grid: '#cdd3dc', num: '#3a4254', blue: '#1f5bd6' };
  function gridSVG(o) {
    const x0 = -7, x1 = 7, y0 = -7, y1 = 7, u = 25, m = 24, W = (x1 - x0) * u + 2 * m, Hh = (y1 - y0) * u + 2 * m, ev = 2;
    const X = (x) => m + (x - x0) * u, Y = (y) => m + (y1 - y) * u, f = (v) => Math.round(v * 10) / 10;
    let s = `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, -apple-system, Segoe UI, sans-serif" role="img" aria-label="${o.label || 'coordinate grid'}">`;
    s += `<rect x="${X(x0)}" y="${Y(y1)}" width="${(x1 - x0) * u}" height="${(y1 - y0) * u}" fill="#fff"/>`;
    for (let x = x0; x <= x1; x++) s += `<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" stroke="${SU_C.grid}" stroke-width="1"/>`;
    for (let y = y0; y <= y1; y++) s += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="${SU_C.grid}" stroke-width="1"/>`;
    const arrow = (x, y, dx, dy, c) => { const L = 9, w = 5; return `<polygon points="${f(x)},${f(y)} ${f(x - dx * L - dy * w)},${f(y - dy * L + dx * w)} ${f(x - dx * L + dy * w)},${f(y - dy * L - dx * w)}" fill="${c}"/>`; };
    s += `<line x1="${X(x0) - 10}" y1="${Y(0)}" x2="${X(x1) + 10}" y2="${Y(0)}" stroke="${SU_C.ink}" stroke-width="2"/>` + arrow(X(x1) + 14, Y(0), 1, 0, SU_C.ink) + arrow(X(x0) - 14, Y(0), -1, 0, SU_C.ink)
      + `<text x="${X(x1) + 10}" y="${Y(0) - 9}" font-size="17" font-style="italic" font-weight="600" fill="${SU_C.ink}" text-anchor="end">x</text>`;
    s += `<line x1="${X(0)}" y1="${Y(y0) + 10}" x2="${X(0)}" y2="${Y(y1) - 10}" stroke="${SU_C.ink}" stroke-width="2"/>` + arrow(X(0), Y(y1) - 14, 0, -1, SU_C.ink) + arrow(X(0), Y(y0) + 14, 0, 1, SU_C.ink)
      + `<text x="${X(0) + 10}" y="${Y(y1) - 4}" font-size="17" font-style="italic" font-weight="600" fill="${SU_C.ink}">y</text>`;
    (o.segs || []).forEach((g) => { s += `<line x1="${X(g.a[0])}" y1="${Y(g.a[1])}" x2="${X(g.b[0])}" y2="${Y(g.b[1])}" stroke="${g.c || SU_C.blue}" stroke-width="3.5" stroke-linecap="round"/>`; });
    const halo = 'paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"';
    for (let x = Math.ceil(x0 / ev) * ev; x <= x1; x += ev) if (x !== 0 && x !== x0 && x !== x1) s += `<text x="${X(x)}" y="${Y(0) + 17}" font-size="14" font-weight="600" fill="${SU_C.num}" text-anchor="middle" ${halo}>${x < 0 ? '−' + -x : x}</text>`;
    for (let y = Math.ceil(y0 / ev) * ev; y <= y1; y += ev) if (y !== 0 && y !== y0 && y !== y1) s += `<text x="${X(0) - 6}" y="${Y(y) + 5}" font-size="14" font-weight="600" fill="${SU_C.num}" text-anchor="end" ${halo}>${y < 0 ? '−' + -y : y}</text>`;
    (o.pts || []).forEach((p) => {
      const c = p.c || SU_C.ink, cx = X(p.p[0]), cy = Y(p.p[1]);
      s += `<circle cx="${cx}" cy="${cy}" r="5.5" fill="${c}" stroke="#fff" stroke-width="1.5"/>`;
      const [vx, vy] = p.dir; const lx = Math.max(12, Math.min(W - 12, cx + vx * 17)), ly = Math.max(14, Math.min(Hh - 6, cy + vy * 17 + 6));
      s += `<text x="${f(lx)}" y="${f(ly)}" font-size="19" font-weight="700" fill="${c}" text-anchor="middle" ${halo}>${p.t}</text>`;
    });
    return s + '</svg>';
  }
  const NAMES = [['A', 'B'], ['C', 'D'], ['P', 'Q'], ['R', 'S'], ['E', 'F'], ['J', 'K'], ['G', 'H']];
  // Beginning: a horizontal or vertical segment on the grid, an even number of squares long: count to the middle
  function onGrid(r) {
    for (;;) {
      const L = 2 * r.int(2, 5), hz = r.chance(0.5), A = [r.int(-6, 6), r.int(-6, 6)], s = r.sign();
      const B = hz ? [A[0] + s * L, A[1]] : [A[0], A[1] + s * L];
      if (Math.abs(B[0]) > 6 || Math.abs(B[1]) > 6 || [...A, ...B].includes(0)) continue; // off the axes: easier to read
      const [n1, n2] = r.pick(NAMES), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], ci = hz ? 0 : 1, dir = hz ? [0, -1] : [-1, 0];
      return {
        text: `Count squares to find the midpoint <i>M</i> of <i>${n1}${n2}</i>. Then check by averaging.`,
        q: '',
        fig: gridSVG({ label: 'segment ' + n1 + n2, segs: [{ a: A, b: B }], pts: [{ p: A, t: n1, dir }, { p: B, t: n2, dir }] }),
        a: [P(n1, A) + ',\\ ' + P(n2, B), L + '\\text{ squares, so step in }' + L / 2,
          (hz ? 'x' : 'y') + '_M=' + avg(A[ci], B[ci]) + '\\qquad M' + '(' + M[0] + ',\\ ' + M[1] + ')']
      };
    }
  }
  // Progressing: the formula, with negatives; whole-number answers
  function formula(r) {
    for (;;) {
      const A = [r.int(-12, 12), r.int(-12, 12)], B = [r.int(-12, 12), r.int(-12, 12)];
      if ((A[0] + B[0]) % 2 || (A[1] + B[1]) % 2 || A[0] === B[0] || A[1] === B[1] || ![...A, ...B].some((v) => v < 0)) continue;
      const [n1, n2] = r.pick(NAMES);
      return {
        text: 'Use the midpoint formula to find the midpoint.',
        q: P(n1, A) + '\\qquad ' + P(n2, B),
        a: ['x_M=' + avg(A[0], B[0]), 'y_M=' + avg(A[1], B[1]), 'M(' + (A[0] + B[0]) / 2 + ',\\ ' + (A[1] + B[1]) / 2 + ')']
      };
    }
  }
  // Mastery: a midpoint between grid lines (.5), or a halfway point on a map
  function half(r) {
    for (;;) {
      const A = [r.int(-9, 9), r.int(-9, 9)], B = [r.int(-9, 9), r.int(-9, 9)];
      if (!((A[0] + B[0]) % 2 || (A[1] + B[1]) % 2) || A[0] === B[0] || A[1] === B[1] || ![...A, ...B].some((v) => v < 0)) continue;
      const [n1, n2] = r.pick(NAMES);
      return {
        text: 'Find the midpoint. (It may land between grid lines.)',
        q: P(n1, A) + '\\qquad ' + P(n2, B),
        a: ['x_M=' + avg(A[0], B[0]), 'y_M=' + avg(A[1], B[1]), 'M(' + (A[0] + B[0]) / 2 + ',\\ ' + (A[1] + B[1]) / 2 + ')']
      };
    }
  }
  const PLACES = [['Hillcrest', 'Lakeview'], ['Pine Ridge', 'Elm Creek'], ['Stony Plain', 'Red Deer Hill'], ['the ranch', 'the gas station'], ['the arena', 'the library'], ['Camp Willow', 'Camp Birch']];
  function mapQ(r) {
    for (;;) {
      const A = [r.int(-30, 30), r.int(-30, 30)], B = [r.int(-30, 40), r.int(-30, 40)];
      if ((A[0] + B[0]) % 2 || (A[1] + B[1]) % 2 || Math.abs(A[0] - B[0]) < 10 || Math.abs(A[1] - B[1]) < 10 || ![...A, ...B].some((v) => v < 0)) continue;
      const [p1, p2] = r.pick(PLACES), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      return {
        text: `On a map grid (1 unit = 1 km), a meeting spot goes exactly halfway between ${p1} and ${p2}. Where?`,
        q: '\\text{' + p1 + ' }(' + A[0] + ',\\ ' + A[1] + ')\\qquad \\text{' + p2 + ' }(' + B[0] + ',\\ ' + B[1] + ')',
        a: ['x_M=' + avg(A[0], B[0]), 'y_M=' + avg(A[1], B[1]), '\\text{meeting spot }(' + M[0] + ',\\ ' + M[1] + ')']
      };
    }
  }
  standup('u6l4', {
    intro: 'Find the midpoint at your whiteboard station: average the x’s, average the y’s. Add first, then halve.',
    levels: {
      BEG: onGrid,                                            // count squares on a horizontal or vertical segment
      PRG: formula,                                           // the formula with negatives; whole-number answers
      MAS: (r) => (r.chance(0.5) ? half(r) : mapQ(r))         // a .5 midpoint, or a halfway point on a map
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountTown();
mountStatics();
mountPlay();
export const explainers = mountExplainers({ halfway, midcount, walker, average, traps, trail });
export const _test = { HW, CNT, WALK, AVG, TRAP, avgTex };
void GRN;
