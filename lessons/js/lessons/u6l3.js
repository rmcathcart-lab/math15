/* Math 15 · Unit 6 · Lesson 3 — Measuring the Length of a Line Segment: Diagonal Segments and the Distance Formula.
 * Warm-up (Drone vs. Delivery Truck: a city map, a truck on the streets and a drone flying straight), static figures,
 * and the explainers:
 *   hidden  (the right triangle grows out of a diagonal segment; run and rise counted and subtracted; squares on the
 *            sides; Pythagoras — notes, Example 1 check, a √29 one),
 *   corner  (where is the right-angle corner? across from one end, up/down from the other: it borrows one coordinate
 *            from each; the other corner works too),
 *   lift    (the legs lifted into symbols → the distance formula; Example 2(a), 2(b) checks),
 *   order   (either point can go first: the signs flip, squaring erases them; Example 2(b), notes),
 *   recipe  (label, subtract, square, add, root: the five steps with a little triangle beside; Examples 3(a), 3(b), 4),
 *   simplify (a mixed radical in simplest form: find the biggest perfect square; √18, Example 3(b) √45, Example 4 √40),
 *   map     (Example 5 on a park map with a 25 m tape measure; the warm-up's Farm with 100 m blocks).
 * Colours (as in the 10C twin): run amber, rise purple, segments / hypotenuse blue, the corner and answers red,
 * truck navy. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pairTex, texNum, svgEl,
  liveCtx, pulse, rightMark, num, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = COLORS.amber, PUR = COLORS.purple, BLUE = COLORS.blue, RED = COLORS.red, INK = COLORS.ink, NAVY = '#1e3a6e';
const RUN = AMB, RISE = PUR, SEG = BLUE;
const tn = (v) => texNum(v);
const par = (v) => (v < 0 ? `(${tn(v)})` : tn(v));                 // a negative in brackets when it is subtracted or squared
const minus = (a, b) => `${tn(a)}-${par(b)}`;                        // "a-(b)"
const ptT = (n, x, y) => `${n}${pairTex(x, y)}`;                     // "A(-5,\ 5)"
const P2 = (x, y) => pairTex(x, y);
const bigTex = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');   // 1300 → 1\,300 (TeX)
const bigNum = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f'); // 1300 → 1 300 (text)
const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u6l3-panel', title ? `<div class="u6l3-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l3-line ' + cls, html); p.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { el.style.opacity = 0; return el; };
const lab = (host, x, y, html, cls = '') => { const d = h('div', cls, html); d.style.position = 'absolute'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.translate = '-50% -50%'; host.appendChild(d); return d; };
const sgn = (v) => (v > 0 ? 1 : v < 0 ? -1 : 0);
/** √n in simplest form: [k, m] with n = k²·m */
function simpRad(n) { let k = 1; for (let d = 2; d * d <= n; d++) if (n % (d * d) === 0) k = d; return [k, n / (k * k)]; }
const radTex = (n) => { const [k, m] = simpRad(n); return m === 1 ? String(k) : (k === 1 ? '' : k) + `\\sqrt{${m}}`; };

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
/** the helper corner (x2, y1) and which sides of the triangle are "outside" */
const corner = (A, B) => [B[0], A[1]];
const outside = (A, B) => ({ run: B[1] >= A[1] ? 's' : 'n', rise: B[0] >= A[0] ? 'e' : 'w' });

/** draw the two dashed legs and the right-angle mark; returns { run, rise, rm, C } */
async function drawLegs(G, c, A, B, o = {}) {
  const C = corner(A, B);
  const run = G.segment(A, C, { color: o.runColor || RUN, width: 3.5, dash: true }), rise = G.segment(C, B, { color: o.riseColor || RISE, width: 3.5, dash: true });
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
  return G.label(at[0], at[1], html, { pos: o.pos || (which === 'run' ? out.run : out.rise), cls: 'u6l3-legl ' + (which === 'run' ? 'u6l3-lrun' : 'u6l3-lrise'), gap: 6 });
}
/** an arc from graph point p to q, bulging in the px direction (nx, ny) */
function hopArc(G, p, q, o) {
  const b = o.bulge || 12;
  return G.curve(() => {
    const P = G.toPx(p[0], p[1]), Q = G.toPx(q[0], q[1]), C = [(P[0] + Q[0]) / 2 + o.nx * b * 2, (P[1] + Q[1]) / 2 + o.ny * b * 2], pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12, u = 1 - t; pts.push([u * u * P[0] + 2 * t * u * C[0] + t * t * Q[0], u * u * P[1] + 2 * t * u * C[1] + t * t * Q[1]]); }
    return { subs: [pts] };
  }, { color: o.color, width: 2.6 }, 'u6l3-hop', G.layers.top);
}
/** unit hops from A to B (a horizontal or vertical leg), numbered 1, 2, 3 … ; side: px direction [nx, ny] */
async function countHops(G, c, A, B, o) {
  const horiz = A[1] === B[1], dd = horiz ? B[0] - A[0] : B[1] - A[1], n = Math.round(Math.abs(dd)), s = Math.sign(dd), [nx, ny] = o.side, b = 11, els = [];
  for (let i = 0; i < n; i++) {
    const p = horiz ? [A[0] + s * i, A[1]] : [A[0], A[1] + s * i], q = horiz ? [A[0] + s * (i + 1), A[1]] : [A[0], A[1] + s * (i + 1)];
    const arc = hopArc(G, p, q, { color: o.color, nx, ny, bulge: b });
    const l = hide(G.label((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, String(i + 1), { cls: 'u6l3-hopn', color: o.color, dx: nx * (b + 12), dy: ny * (b + 12) }));
    els.push(arc, l);
    await G.drawIn(arc, o.ms || 150, c); await appear(c, l, 80);
  }
  return els;
}
/** a right-angle mark at graph point K between the directions to P and Q (tracks zooms) */
function rightAngle(G, K, P, Q, color) {
  return G.curve(() => {
    const k = G.toPx(...K), p = G.toPx(...P), q = G.toPx(...Q), s = 14;
    const u = [p[0] - k[0], p[1] - k[1]], v = [q[0] - k[0], q[1] - k[1]], lu = Math.hypot(...u) || 1, lv = Math.hypot(...v) || 1;
    const a = [k[0] + u[0] / lu * s, k[1] + u[1] / lu * s], b = [k[0] + v[0] / lv * s, k[1] + v[1] / lv * s];
    return { subs: [[a, [a[0] + v[0] / lv * s, a[1] + v[1] / lv * s], b]] };
  }, { color: color || INK, width: 2 }, 'u6l3-ra', G.layers.top);
}
/** fly a copy of `from` (an element on the stage) into the slot `to`, then fill the slot */
async function fly(c, stage, from, to, cls = '') {
  c.check();
  if (c.fast) { to.classList.add('u6l3-filled'); return; }
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
  const clone = h('div', 'u6l3-fly ' + cls + ' ' + [...from.classList].filter((x) => /u6l3-l(run|rise)/.test(x)).join(' '), from.innerHTML);
  stage.appendChild(clone);
  const ax = (a.left - sr.left) / k, ay = (a.top - sr.top) / k;
  clone.style.left = ax + 'px'; clone.style.top = ay + 'px';
  const dx = (b.left + b.width / 2 - sr.left) / k - clone.offsetWidth / 2 - ax, dy = (b.top + b.height / 2 - sr.top) / k - clone.offsetHeight / 2 - ay;
  try { await c.anim(clone, [{ transform: 'translate(0, 0) scale(1)' }, { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(1.25)`, offset: 0.5 }, { transform: `translate(${dx}px, ${dy}px) scale(1)` }], 900); }
  finally { clone.remove(); }
  to.classList.add('u6l3-filled');
  await pulse(c, to, 1.12);
}
/** a formula line with empty slots: parts are TeX strings or { slot: TeX } */
function slotLine(P, parts, cls = '') {
  const d = h('div', 'u6l3-line u6l3-fline ' + cls), slots = [];
  parts.forEach((p) => { if (typeof p === 'string') d.insertAdjacentHTML('beforeend', T(p)); else { const s = h('span', 'u6l3-slot ' + (slots.length ? 'u6l3-srise' : 'u6l3-srun'), T(p.slot)); d.appendChild(s); slots.push(s); } });
  P.appendChild(d); return { el: d, slots };
}

/* =============================== little map pictures =============================== */
function house(G, x, y, color, layer) {
  const [px, py] = G.toPx(x, y), g = svgEl('g', { class: 'u6l3-house' }, layer || G.layers.top);
  svgEl('rect', { x: px - 12, y: py - 20, width: 24, height: 15, fill: color, stroke: INK, 'stroke-width': 1.6 }, g);
  svgEl('path', { d: `M${px - 16} ${py - 19} L${px} ${py - 33} L${px + 16} ${py - 19} Z`, fill: color, stroke: INK, 'stroke-width': 1.6, 'fill-opacity': 0.75 }, g);
  svgEl('rect', { x: px - 3, y: py - 13, width: 6, height: 8, fill: '#fff', stroke: INK, 'stroke-width': 1 }, g);
  svgEl('circle', { cx: px, cy: py, r: 5, fill: INK, stroke: '#fff', 'stroke-width': 1.6 }, g);
  return g;
}
/** gray city blocks between the streets (grid lines) of a Graph, i0…i1 × j0…j1 */
function cityBlocks(G, i0, i1, j0, j1) {
  for (let i = i0; i < i1; i++) for (let j = j0; j < j1; j++) {
    const [x0, y0] = G.toPx(i + 0.14, j + 0.86), [x1, y1] = G.toPx(i + 0.86, j + 0.14);
    svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 3, fill: '#e3e5ea' }, G.layers.bg);
  }
}
/** a delivery truck (moves with place) */
function truckFig(G) {
  const g = svgEl('g', { class: 'u6l3-truck' }, G.layers.top), b = svgEl('g', {}, g);
  svgEl('rect', { x: -15, y: -19, width: 19, height: 13, rx: 1.5, fill: '#ffecb3', stroke: INK, 'stroke-width': 1.6 }, b);
  svgEl('path', { d: 'M4 -6 V-15 H10 L14 -10 V-6 Z', fill: '#c88c14', stroke: INK, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, b);
  svgEl('circle', { cx: -9, cy: -5, r: 3.2, fill: INK }, b); svgEl('circle', { cx: 9, cy: -5, r: 3.2, fill: INK }, b);
  g.place = (x, y) => { const [px, py] = G.toPx(x, y); g.setAttribute('transform', `translate(${px} ${py})`); };
  return g;
}
/** a little drone (moves with place) */
function droneFig(G) {
  const g = svgEl('g', { class: 'u6l3-drone' }, G.layers.top);
  svgEl('path', { d: 'M-11 -4 L11 4 M-11 4 L11 -4', stroke: INK, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
  for (const [x, y] of [[-12, -4.5], [12, -4.5], [-12, 4.5], [12, 4.5]]) svgEl('ellipse', { cx: x, cy: y, rx: 6, ry: 2.2, fill: '#e8f0fc', stroke: INK, 'stroke-width': 1.3 }, g);
  svgEl('circle', { cx: 0, cy: 0, r: 3.6, fill: RED, stroke: INK, 'stroke-width': 1.2 }, g);
  g.place = (x, y) => { const [px, py] = G.toPx(x, y); g.setAttribute('transform', `translate(${px} ${py - 2})`); };
  return g;
}

/* =============================== warm-up: Drone vs. Delivery Truck =============================== */
const DEST = {
  A: { p: [3, 4], name: 'House A', col: '#d9604f', truck: '3+4=7', drone: '5', tl: [[3, 2], 'e'], dl: [[1.5, 2], 'nw'] },
  B: { p: [6, 0], name: 'House B', col: '#e8a01e', truck: '6', drone: '6', tl: [[3, 0], 'n'], dl: null },
  F: { p: [12, 5], name: 'Farm', col: '#3f8a4a', truck: '12+5=17', drone: '13', tl: [[12, 2.5], 'w'], dl: [[6.5, 2.7], 'nw'] }
};
function mountCity() {
  const host = document.getElementById('u6l3-city'); if (!host) return;
  const w = Math.min(600, host.clientWidth || 580);
  const G = sqGraph(host, { xmin: -0.75, xmax: 12.75, ymin: -0.75, ymax: 6.85 }, w, 296, { g: { xlabels: 1, ylabels: 1, xtitle: '', ytitle: '', arrows: false } });
  cityBlocks(G, 0, 12, 0, 6);
  const [ox, oy] = G.toPx(0, 0);
  for (const [k, d] of Object.entries(DEST)) {
    house(G, d.p[0], d.p[1], d.col);
    G.label(d.p[0], d.p[1], `<b>${d.name}</b>`, { pos: k === 'F' ? 'w' : 'n', cls: 'u6l3-hlab', gap: k === 'F' ? 18 : 34 });
  }
  const shop = h('div', 'u6l3-shop', 'SHOP'); add(G.html, shop, ox, oy);
  const ctx = liveCtx(), live = {};
  const buttons = [...document.querySelectorAll('[data-u6l3-go]')];
  async function go(k, btn) {
    if (live[k]) { G.remove(...live[k]); live[k] = null; btn.classList.remove('on'); return; }
    const d = DEST[k], P = d.p, K = [P[0], 0], els = live[k] = [];
    btn.classList.add('on');
    // the truck drives the streets
    const t1 = G.segment([0, 0], K, { color: NAVY, width: 6 }); els.push(t1);
    const t2 = P[1] ? G.segment(K, P, { color: NAVY, width: 6 }) : null; if (t2) els.push(t2);
    const tr = truckFig(G); els.push(tr); tr.place(0, 0);
    const legs = [[[0, 0], K, t1]].concat(t2 ? [[K, P, t2]] : []);
    for (const [a, b, s] of legs) {
      await Promise.all([G.drawIn(s, 260 * Math.hypot(b[0] - a[0], b[1] - a[1]), ctx), tween(ctx, 260 * Math.hypot(b[0] - a[0], b[1] - a[1]), (t) => tr.place(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))]);
    }
    if (t2) { const ra = rightAngle(G, K, [0, 0], P); els.push(ra); await appear(ctx, ra); }
    const tl = G.label(...d.tl[0], `truck ${T(d.truck)}`, { pos: d.tl[1], cls: 'u6l3-tpill', gap: 8 }); els.push(tl); await pop(ctx, tl);
    // the drone flies straight
    const ds = G.segment([0, 0], P, { color: RED, width: 3.5, dash: '9 6' }); els.push(ds);
    const dr = droneFig(G); els.push(dr); dr.place(0, 0.25);
    const L = Math.hypot(P[0], P[1]);
    await Promise.all([G.drawIn(ds, 200 * L, ctx), tween(ctx, 200 * L, (t) => dr.place(P[0] * t, P[1] * t + 0.25))]);
    if (d.dl) { const dl = G.label(...d.dl[0], `drone ${T(d.drone)}`, { pos: d.dl[1], cls: 'u6l3-dpill', gap: 6 }); els.push(dl); await pop(ctx, dl); }
    else { tl.innerHTML = `truck ${T('6')} = drone ${T('6')}`; await pulse(ctx, tl, 1.1); }
  }
  buttons.forEach((b) => b.addEventListener('click', () => go(b.dataset.u6l3Go, b)));
  const clr = document.getElementById('u6l3-wclear');
  if (clr) clr.addEventListener('click', () => { for (const b of buttons) if (live[b.dataset.u6l3Go]) go(b.dataset.u6l3Go, b); });
}

/* =============================== static figures =============================== */
function mountStatics() {
  let e = document.getElementById('u6l3-s1fig');
  if (e) {
    const G = sqGraph(e, { xmin: -0.6, xmax: 6.6, ymin: -0.6, ymax: 5.6 }, 330, 300, { g: { xlabels: 1, ylabels: 1 } });
    G.segment([1, 1], [5, 1], { color: RUN, width: 3.5, dash: true }); G.segment([5, 1], [5, 4], { color: RISE, width: 3.5, dash: true });
    rightMark(G.layers.top, G.toPx(5, 1), G.toPx(1, 1), G.toPx(5, 4), 13, { color: INK, width: 2 });
    G.segment([1, 1], [5, 4], { color: SEG, width: 4.5 });
    G.point(1, 1, { color: SEG, label: T('A'), pos: 'nw', labelColor: INK }); G.point(5, 4, { color: SEG, label: T('B'), pos: 'ne', labelColor: INK });
    G.point(5, 1, { color: INK, label: T('C'), pos: 'se' });
    G.label(3, 1, `run ${T('=4')}`, { pos: 's', cls: 'u6l3-flab u6l3-ca', gap: 6 }); G.label(5, 2.5, `rise ${T('=3')}`, { pos: 'e', cls: 'u6l3-flab u6l3-cp', gap: 6 });
  }
  const ex1 = (id, w, ans) => {
    const el = document.getElementById(id); if (!el) return null;
    const G = sqGraph(el, { xmin: -4.6, xmax: 5.6, ymin: -4.6, ymax: 3.6 }, w, w, { g: { xlabels: ans ? 2 : 1, ylabels: ans ? 2 : 1, fontSize: ans ? 14 : 16 } });
    if (ans) {
      G.segment([-1, -2], [3, -2], { color: RUN, width: 3.5, dash: true }); G.segment([3, -2], [3, 1], { color: RISE, width: 3.5, dash: true });
      rightMark(G.layers.top, G.toPx(3, -2), G.toPx(-1, -2), G.toPx(3, 1), 12, { color: INK, width: 2 });
    }
    G.segment([-1, -2], [3, 1], { color: SEG, width: 4.5 });
    G.point(-1, -2, { color: SEG, label: T('C'), pos: ans ? 'w' : 'sw', labelColor: INK }); G.point(3, 1, { color: SEG, label: T('D'), pos: 'ne', labelColor: INK });
    if (ans) {
      G.point(3, -2, { color: RED, label: T('E(3,\\ -2)'), pos: 'se', labelColor: RED });
      G.label(1, -2, T('4'), { pos: 's', cls: 'u6l3-flab u6l3-ca', gap: 4 }); G.label(3, -1.1, T('3'), { pos: 'e', cls: 'u6l3-flab u6l3-cp', gap: 4 });
    }
    return G;
  };
  ex1('u6l3-ex1fig', 420, false);
  ex1('u6l3-ex1ans', 310, true);
}

/* ======================================================================================
 * Explainer: the right triangle hidden under a diagonal segment
 * ====================================================================================== */
const HID = {
  notes: { label: `Notes: ${T('A(1,\\ 1)')} to ${T('B(5,\\ 4)')}`, A: ['A', 1, 1], B: ['B', 5, 4], K: 'C' },
  ex1: { label: 'Example 1 check: CD', A: ['C', -1, -2], B: ['D', 3, 1], K: 'E' },
  odd: { label: `Not a whole number: ${T('P(-3,\\ 2)')} to ${T('Q(2,\\ 4)')}`, A: ['P', -3, 2], B: ['Q', 2, 4], K: 'R' }
};
const hidden = {
  title: 'The right triangle hiding under a diagonal segment',
  height: 500,
  minW: 880, // drawn this wide and scaled to fit beside the sidebar
  choices: Object.keys(HID).map((k) => ({ v: k, label: HID[k].label })),
  intro: 'A diagonal segment has no row of squares to count. But it hides something. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = HID[k], [nA, xA, yA] = d.A, [nB, xB, yB] = d.B, A = [xA, yA], B = [xB, yB], K = [xB, yA], name = nA + nB;
    const run = xB - xA, rise = yB - yA, c2 = run * run + rise * rise, [rk, rm] = simpRad(c2), cDec = Math.sqrt(c2);
    // outward squares: run square below the run, rise square right of the rise, hypotenuse square away from the corner
    const runN = [0, -run], riseN = [rise, 0];
    const v = [xB - xA, yB - yA]; let hn = [-v[1], v[0]]; if (hn[0] * (K[0] - xA) + hn[1] * (K[1] - yA) > 0) hn = [v[1], -v[0]];
    const corners = [A, B, K, [A[0] + runN[0], A[1] + runN[1]], [K[0] + runN[0], K[1] + runN[1]], [K[0] + riseN[0], K[1] + riseN[1]], [B[0] + riseN[0], B[1] + riseN[1]], [A[0] + hn[0], A[1] + hn[1]], [B[0] + hn[0], B[1] + hn[1]]];
    const GW = 600, GH = 480;
    const win0 = fitWin([A, B, K, [0, 0]], GW, GH, 2), win1 = fitWin(corners, GW, GH, 1);
    const G = new Graph(stage, Object.assign({ x: 6, y: 12, width: GW, height: GH }, win0));
    const P = panel(stage, GW + 22, 5, ex.W - GW - 28, GH, 'Run, rise, Pythagoras');
    const exact = rm === 1 ? `\\sqrt{${c2}}=${rk}` : `\\sqrt{${c2}}`;
    const dec = rm === 1 ? '' : `\\approx${cDec.toFixed(2)}`;
    const sq = { a: 0, b: 0, c: 0 }, st = { r: 0, s: 0 }, ends = [];
    let legR, legS, cornerPt, hopsR = [], hopsS = [], labC;
    const PX = (p) => G.toPx(p[0], p[1]);
    const square = (key, p, q, n, color) => G.curve(() => { const t = sq[key], a = PX(p), b = PX(q), c = PX([q[0] + n[0] * t, q[1] + n[1] * t]), e = PX([p[0] + n[0] * t, p[1] + n[1] * t]); return { subs: [[a, b, c, e]], closed: true }; },
      { color, width: 3, fill: color, fillOpacity: 0.15 }, 'u6l3-sq', G.layers.data);
    const cen = (p, q, n) => [(p[0] + q[0] + n[0]) / 2, (p[1] + q[1] + n[1]) / 2];
    return [
      { cap: `Segment ${T(name)} goes from ${T(ptT(nA, xA, yA))} to ${T(ptT(nB, xB, yB))}. It is <b>diagonal</b>: no row of squares to count along.`,
        run: async (c) => {
          const s = G.segment(A, B, { color: BLUE, width: 5 }); await G.drawIn(s, 700, c);
          for (const [n, x, y] of [d.A, d.B]) { const p = G.point(x, y, { color: BLUE, label: T(ptT(n, x, y)), pos: y === yB ? 'n' : 'w', labelColor: INK }); ends.push([p, n]); await G.reveal(p, c); }
        } },
      { cap: `Every diagonal segment hides a <b>right triangle</b>. Slide straight across from ${T(nA)} (the <b class="u6l3-ca">run</b>), then up to ${T(nB)} (the <b class="u6l3-cp">rise</b>). The corner is ${T(ptT(d.K, ...K))}.`,
        run: async (c) => {
          legR = G.curve(() => ({ subs: [[PX(A), PX([xA + (K[0] - xA) * st.r, yA])]] }), { color: AMB, width: 5 }, 'u6l3-leg', G.layers.data);
          legS = G.curve(() => ({ subs: [[PX(K), PX([K[0], yA + (yB - yA) * st.s])]] }), { color: PUR, width: 5 }, 'u6l3-leg', G.layers.data);
          const dot = G.point(...A, { color: INK, r: 6 });
          await tween(c, 1100, (t) => { st.r = t; legR._bkDraw(); G.moveTo(dot, xA + (K[0] - xA) * t, yA); });
          await tween(c, 1100, (t) => { st.s = t; legS._bkDraw(); G.moveTo(dot, K[0], yA + (yB - yA) * t); });
          G.remove(dot); const ra = rightAngle(G, K, A, B); await appear(c, ra);
          cornerPt = G.point(...K, { color: RED, r: 7, label: T(ptT(d.K, ...K)), pos: 'se', labelColor: RED }); await G.reveal(cornerPt, c);
        } },
      { cap: `Count the <b class="u6l3-ca">run</b>: <b>${run}</b> squares. Or subtract the ${T('x')}’s: ${T(`${minus(xB, xA)}=${run}`)}.`,
        run: async (c) => {
          hopsR = await countHops(G, c, A, K, { color: AMB, side: [0, 1] });
          await show(c, line(P, `<b>run</b> ${T(`=${minus(xB, xA)}=${run}`)}`, 'u6l3-ca'));
        } },
      { cap: `Count the <b class="u6l3-cp">rise</b>: <b>${rise}</b> squares. Or subtract the ${T('y')}’s: ${T(`${minus(yB, yA)}=${rise}`)}.`,
        run: async (c) => {
          hopsS = await countHops(G, c, K, B, { color: PUR, side: [1, 0], ms: 120 });
          await show(c, line(P, `<b>rise</b> ${T(`=${minus(yB, yA)}=${rise}`)}`, 'u6l3-cp'));
        } },
      { cap: `Build a <b>square</b> on each leg. Count the little squares inside: ${T(`${run}^2=${run * run}`)} and ${T(`${rise}^2=${rise * rise}`)}.`,
        run: async (c) => {
          G.remove(...hopsR, ...hopsS); hopsR = []; hopsS = [];
          for (const [p, n] of ends) p.label.innerHTML = T(n);
          if (cornerPt) cornerPt.label.innerHTML = T(d.K);
          await G.setWindow(win1, c, 900);
          const sa = square('a', A, K, runN, AMB); await tween(c, 700, (t) => { sq.a = t; sa._bkDraw(); });
          const la = G.label(...cen(A, K, runN), T(`${run * run}`), { cls: 'u6l3-sqlab', color: AMB }); await pop(c, la);
          const sb = square('b', K, B, riseN, PUR); await tween(c, 800, (t) => { sq.b = t; sb._bkDraw(); });
          const lb = G.label(...cen(K, B, riseN), T(`${rise * rise}`), { cls: 'u6l3-sqlab', color: PUR }); await pop(c, lb);
        } },
      { cap: `Now a square on the diagonal side, the <b class="u6l3-cb">hypotenuse</b>. Its area is ${T(`(${name})^2`)}: too awkward to count.`,
        run: async (c) => {
          const sc = square('c', A, B, hn, BLUE); await tween(c, 900, (t) => { sq.c = t; sc._bkDraw(); });
          labC = G.label(...cen(A, B, hn), T('?'), { cls: 'u6l3-sqlab', color: BLUE }); await pop(c, labC);
        } },
      { cap: `Pythagoras: the two small squares <b>together</b> have the same area as the big one. ${T(`${run * run}+${rise * rise}=${c2}`)}, so ${T(`(${name})^2=${c2}`)}.`,
        run: async (c) => {
          for (const s of [`(${name})^2=\\text{run}^2+\\text{rise}^2`, `(${name})^2=${run}^2+${rise}^2`, `(${name})^2=${run * run}+${rise * rise}=${c2}`]) await show(c, line(P, T(s)));
          labC.innerHTML = T(`${c2}`); await pulse(c, labC, 1.2);
        } },
      { cap: rm === 1 ? `So ${T(`${name}=${exact}`)} units. A whole number this time!` : `So ${T(`${name}=${exact}${dec}`)} units. ${c2} has no perfect-square factor, so ${T(exact)} is already in simplest form.`,
        run: async (c) => {
          await show(c, line(P, `${T(`${name}=${exact}`)}${dec ? ' ' + T(dec) : ''} units`, 'u6l3-cb u6l3-big'));
          const sp = stamp(P, `${name} = ${rm === 1 ? rk : '√' + c2}`, { ok: true, size: 'sm' }); sp.style.alignSelf = 'center'; sp.style.marginTop = 'auto'; await stampIn(c, sp);
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: finding the corner (one coordinate from each end)
 * ====================================================================================== */
const CRN = {
  notes: { label: `Notes: ${T('A(1,\\ 1)')} to ${T('B(5,\\ 4)')}`, A: ['A', 1, 1], B: ['B', 5, 4], K: 'C' },
  ex1: { label: 'Example 1 check: CD', A: ['C', -1, -2], B: ['D', 3, 1], K: 'E' },
  down: { label: `Going down: ${T('P(-2,\\ 3)')} to ${T('Q(4,\\ -1)')}`, A: ['P', -2, 3], B: ['Q', 4, -1], K: 'R' }
};
const pairCard = (n, x, y, cls = '') => `<div class="u6l3-pcard ${cls}"><span class="u6l3-pn">${n}</span>(<span class="u6l3-px">${num(x)}</span>, <span class="u6l3-py">${num(y)}</span>)</div>`;
const cornerEx = {
  title: 'Where is the right-angle corner?',
  height: 480,
  minW: 880,
  choices: Object.keys(CRN).map((k) => ({ v: k, label: CRN[k].label })),
  intro: 'The corner has to be straight across from one end and straight up or down from the other. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CRN[k], [nA, xA, yA] = d.A, [nB, xB, yB] = d.B, A = [xA, yA], B = [xB, yB], K = [xB, yA], K2 = [xA, yB], H = ex.def.height;
    const up = yB > yA, run = Math.abs(xB - xA), rise = Math.abs(yB - yA);
    const G = sqGraph(stage, fitWin([A, B, [0, 0], [xA - 1, yA], [xB + 1, yB]], 470, H - 20, 1), 470, H - 20, { x: 10, y: 10, center: true });
    const P = panel(stage, G.W + 30, 14, ex.W - G.W - 44, H - 28, 'One coordinate from each end');
    const cards = h('div', 'u6l3-pcards', pairCard(nA, xA, yA, 'u6l3-pA') + pairCard(nB, xB, yB, 'u6l3-pB'));
    const target = h('div', 'u6l3-pcard u6l3-pK', `<span class="u6l3-pn u6l3-cr">${d.K}</span>(<span class="u6l3-pslot">${num(K[0])}</span>, <span class="u6l3-pslot">${num(K[1])}</span>)`);
    P.appendChild(cards); P.appendChild(hide(target));
    const [sx, sy] = target.querySelectorAll('.u6l3-pslot');
    let hl, vl, legs2 = [];
    return [
      { cap: `Segment ${T(nA + nB)} from ${T(ptT(nA, xA, yA))} to ${T(ptT(nB, xB, yB))}. Where is the corner of the right triangle?`,
        run: async (c) => {
          await G.drawIn(G.segment(A, B, { color: SEG, width: 5 }), 700, c);
          await G.reveal(G.point(...A, { color: SEG, label: T(ptT(nA, xA, yA)), pos: up ? 'w' : 'n' }), c);
          await G.reveal(G.point(...B, { color: SEG, label: T(ptT(nB, xB, yB)), pos: up ? 'n' : 'e' }), c);
          await show(c, cards);
        } },
      { cap: `Go straight <b>across</b> from ${T(nA)}: its ${T('y')} stays ${T(tn(yA))}. Go straight <b>${up ? 'down' : 'up'}</b> from ${T(nB)}: its ${T('x')} stays ${T(tn(xB))}. The two lines meet at the corner.`,
        run: async (c) => {
          hl = G.hline(yA, { color: RUN, width: 2.5 }); await G.drawIn(hl, 600, c);
          vl = G.vline(xB, { color: RISE, width: 2.5 }); await G.drawIn(vl, 600, c);
          const ay = cards.querySelector('.u6l3-pA .u6l3-py'), bx = cards.querySelector('.u6l3-pB .u6l3-px');
          ay.classList.add('u6l3-hiy'); bx.classList.add('u6l3-hix'); await Promise.all([pulse(c, ay, 1.3), pulse(c, bx, 1.3)]);
        } },
      { cap: `So the corner borrows ${T(nB)}’s ${T('x')} and ${T(nA)}’s ${T('y')}: ${T(ptT(d.K, ...K))}.`,
        run: async (c) => {
          await show(c, target);
          await fly(c, stage, cards.querySelector('.u6l3-pB .u6l3-px'), sx, 'u6l3-flyx');
          await fly(c, stage, cards.querySelector('.u6l3-pA .u6l3-py'), sy, 'u6l3-flyy');
          await G.reveal(G.point(...K, { color: RED, r: 8, label: T(ptT(d.K, ...K)), pos: up ? 'se' : 'ne', labelColor: RED }), c);
        } },
      { cap: `Draw the legs. The <b class="u6l3-ca">run</b> is ${T(String(run))} and the <b class="u6l3-cp">rise</b> is ${T(String(rise))}, with the right angle at ${T(d.K)}.`,
        run: async (c) => {
          G.remove(hl, vl);
          await drawLegs(G, c, A, B);
          await pop(c, legLabel(G, A, B, 'run', T(String(run)))); await pop(c, legLabel(G, A, B, 'rise', T(String(rise))));
          await show(c, line(P, `<span class="u6l3-ca"><b>run</b> ${T(String(run))}</span> &nbsp; <span class="u6l3-cp"><b>rise</b> ${T(String(rise))}</span>`));
        } },
      { cap: `The <b>other corner</b> works too: ${T(nA)}’s ${T('x')} and ${T(nB)}’s ${T('y')} give ${T(P2(...K2))}. The triangle is flipped, but the legs are the same: ${run} and ${rise}.`,
        run: async (c) => {
          const s1 = G.segment(A, K2, { color: RISE, width: 3, dash: '4 6' }), s2 = G.segment(K2, B, { color: RUN, width: 3, dash: '4 6' }); legs2.push(s1, s2);
          await G.drawIn(s1, 500, c); await G.drawIn(s2, 500, c);
          const q = G.point(...K2, { color: INK, r: 6, label: T(P2(...K2)), pos: up ? 'nw' : 'sw' }); await G.reveal(q, c);
          await show(c, line(P, `other corner ${T(P2(...K2))}: same run, same rise, same length`, 'u6l3-note'));
        } },
      { cap: `Either corner gives the same length. The one we’ll use: the ${T('x')} of the <b>second</b> point and the ${T('y')} of the <b>first</b>, ${T('(x_2,\\ y_1)')}.`,
        run: async (c) => { const r = h('div', 'u6l3-rule', `corner ${T('=(x_2,\\ y_1)')}<br><span class="u6l3-sm">across from point 1, ${up ? 'below' : 'above'} point 2</span>`); P.appendChild(r); await pop(c, r); } }
    ];
  }
};

/* =============================== explainer: lifting the triangle into symbols =============================== */
const LIFT = {
  sym: { label: 'Any two points', sym: true, A: [2, 2], B: [9, 7], win: { xmin: 0, xmax: 10.5, ymin: 0, ymax: 8.5 } },
  ex2a: { label: 'Example 2(a) check', A: [0, 0], B: [6, 8], nA: 'E', nB: 'F', win: { xmin: -1.5, xmax: 8.5, ymin: -1.5, ymax: 9.5 },
    run: ['x_2-x_1=6-0=6', '6'], rise: ['y_2-y_1=8-0=8', '8'], slots: ['d^2=', '6^2', '8^2'], after: ['d=\\sqrt{36+64}', '=\\sqrt{100}=10'], stamp: 'EF = 10', riseT: 0.5, runPos: 'n', cpos: 'ne' },
  ex2b: { label: 'Example 2(b) check', A: [-3, 4], B: [1, 1], nA: 'G', nB: 'H', win: { xmin: -5, xmax: 3, ymin: -1, ymax: 6 },
    run: ['x_2-x_1=1-(-3)=4', '4'], rise: ['y_2-y_1=1-4=-3', '-3'], slots: ['d^2=', '4^2', '(-3)^2'], after: ['d=\\sqrt{16+9}', '=\\sqrt{25}=5'], stamp: 'GH = 5', down: '3 down', riseT: 0.5 }
};
const lift = {
  title: 'The distance formula: lift the triangle into symbols',
  height: 470,
  minW: 860,
  choices: Object.keys(LIFT).map((k) => ({ v: k, label: LIFT[k].label })),
  intro: (k) => (LIFT[k].sym ? 'The same right triangle, but for <b>any</b> two points. Press <b>Next</b>.' : 'Check the example: the triangle, then the formula. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = LIFT[k], A = d.A, B = d.B, C = corner(A, B), H = ex.def.height;
    const G = sqGraph(stage, d.win, 470, H - 20, d.sym ? { x: 10, y: 10, center: true, g: { numbers: false }, pad: [18, 18, 46, 54] } : { x: 10, y: 10, center: true });
    const PW = ex.W - G.W - 44, P = panel(stage, G.W + 30, 14, PW, H - 28, 'Pythagoras on the triangle');
    const legs = {};
    if (d.sym) {
      const pl = (n, i) => T(`${n}(x_${i},\\ y_${i})`);
      return [
        { cap: `Any two points: ${T('P(x_1,\\ y_1)')} and ${T('Q(x_2,\\ y_2)')}. How far apart are they?`,
          run: async (c) => { const s = G.segment(A, B, { color: SEG, width: 5 }); await G.drawIn(s, 700, c); await G.reveal(G.point(...A, { color: SEG, label: pl('P', 1), pos: 'nw' }), c); await G.reveal(G.point(...B, { color: SEG, label: pl('Q', 2), pos: 'nw' }), c); } },
        { cap: `The corner ${T('R')} is straight below ${T('Q')} (same ${T('x')} as ${T('Q')}) and straight across from ${T('P')} (same ${T('y')} as ${T('P')}): ${T('R(x_2,\\ y_1)')}.`,
          run: async (c) => { await drawLegs(G, c, A, B); await G.reveal(G.point(...C, { color: RED, label: T('R(x_2,\\ y_1)'), pos: 'se', labelColor: RED }), c); } },
        { cap: `<b>Run:</b> drop down to the ${T('x')}-axis. From ${T('x_1')} across to ${T('x_2')} is ${T('x_2-x_1')}.`,
          run: async (c) => {
            const g1 = G.segment(A, [A[0], 0], { color: 'gray', width: 2, dash: '5 5' }), g2 = G.segment(B, [B[0], 0], { color: 'gray', width: 2, dash: '5 5' });
            await Promise.all([G.drawIn(g1, 500, c), G.drawIn(g2, 500, c)]);
            const t1 = G.label(A[0], 0, T('x_1'), { pos: 's', cls: 'u6l3-axl', gap: 6 }), t2 = G.label(B[0], 0, T('x_2'), { pos: 's', cls: 'u6l3-axl', gap: 6 });
            await Promise.all([pop(c, t1), pop(c, t2)]);
            await G.drawIn(G.segment([A[0], 0], [B[0], 0], { color: RUN, width: 8, opacity: 0.6, cap: 'butt' }), 600, c);
            legs.run = legLabel(G, A, B, 'run', T('x_2-x_1')); await pop(c, legs.run);
          } },
        { cap: `<b>Rise:</b> across to the ${T('y')}-axis. From ${T('y_1')} up to ${T('y_2')} is ${T('y_2-y_1')}.`,
          run: async (c) => {
            const g1 = G.segment(A, [0, A[1]], { color: 'gray', width: 2, dash: '5 5' }), g2 = G.segment(B, [0, B[1]], { color: 'gray', width: 2, dash: '5 5' });
            await Promise.all([G.drawIn(g1, 500, c), G.drawIn(g2, 500, c)]);
            const t1 = G.label(0, A[1], T('y_1'), { pos: 'w', cls: 'u6l3-axl', gap: 8 }), t2 = G.label(0, B[1], T('y_2'), { pos: 'w', cls: 'u6l3-axl', gap: 8 });
            await Promise.all([pop(c, t1), pop(c, t2)]);
            await G.drawIn(G.segment([0, A[1]], [0, B[1]], { color: RISE, width: 8, opacity: 0.6, cap: 'butt' }), 600, c);
            legs.rise = legLabel(G, A, B, 'rise', T('y_2-y_1')); await pop(c, legs.rise);
          } },
        { cap: `Pythagoras: ${T('d^2=\\text{run}^2+\\text{rise}^2')}. Lift the two legs off the grid and into the equation.`,
          run: async (c) => {
            await show(c, line(P, T('c^2=a^2+b^2'), 'u6l3-mute'));
            const L = slotLine(P, ['d^2=', { slot: '(x_2-x_1)^2' }, '+', { slot: '(y_2-y_1)^2' }]);
            await show(c, L.el);
            await fly(c, stage, legs.run, L.slots[0]); await fly(c, stage, legs.rise, L.slots[1]);
          } },
        { cap: `Take the square root of both sides: that is the <b>distance formula</b>. Run squared, plus rise squared, then the square root.`,
          run: async (c) => { const f = line(P, T('d=\\sqrt{(\\textcolor{#c27a0e}{x_2-x_1})^2+(\\textcolor{#7b4fc4}{y_2-y_1})^2}'), 'u6l3-boxed'); await pop(c, f, 500); } }
      ];
    }
    const nm = (n, p) => T(n + P2(p[0], p[1]));
    return [
      { cap: `${nm(d.nA, A)} and ${nm(d.nB, B)}. Call ${T(d.nA)} point 1 and ${T(d.nB)} point 2.`,
        run: async (c) => { const s = G.segment(A, B, { color: SEG, width: 5 }); await G.drawIn(s, 700, c); await G.reveal(G.point(...A, { color: SEG, label: nm(d.nA, A), pos: B[1] > A[1] ? 'nw' : 'w' }), c); await G.reveal(G.point(...B, { color: SEG, label: nm(d.nB, B), pos: B[1] > A[1] ? 'n' : 's' }), c); } },
      { cap: `The corner: ${T('(x_2,\\ y_1)=' + P2(C[0], C[1]))}, ${B[1] > A[1] ? 'below' : 'above'} ${T(d.nB)} and across from ${T(d.nA)}.`,
        run: async (c) => { await drawLegs(G, c, A, B); await G.reveal(G.point(...C, { color: RED, label: T(P2(C[0], C[1])), pos: d.cpos || (B[1] > A[1] ? 'se' : 'ne'), labelColor: RED }), c); } },
      { cap: `<b>Run:</b> ${T(d.run[0])}.`,
        run: async (c) => { legs.run = legLabel(G, A, B, 'run', T(d.run[1]), { pos: d.runPos }); await pop(c, legs.run); await show(c, line(P, T(d.run[0]), 'u6l3-trun')); } },
      { cap: `<b>Rise:</b> ${T(d.rise[0])}${d.down ? ` (${d.down})` : ''}.`,
        run: async (c) => { legs.rise = legLabel(G, A, B, 'rise', T(d.rise[1]), { t: d.riseT }); await pop(c, legs.rise); await show(c, line(P, T(d.rise[0]), 'u6l3-trise')); } },
      { cap: `Lift the legs into Pythagoras: ${T(d.slots[0] + d.slots[1] + '+' + d.slots[2])}.`,
        run: async (c) => { const L = slotLine(P, [d.slots[0], { slot: d.slots[1] }, '+', { slot: d.slots[2] }]); await show(c, L.el); await fly(c, stage, legs.run, L.slots[0]); await fly(c, stage, legs.rise, L.slots[1]); } },
      { cap: `${T(d.after.join(''))} units.`,
        run: async (c) => { for (const s of d.after) await show(c, line(P, T(s))); const s = stamp(P, d.stamp); s.style.alignSelf = 'center'; s.style.marginTop = '8px'; await stampIn(c, s); } }
    ];
  }
};

/* =============================== explainer: either point can go first =============================== */
const ORD = {
  ex2b: { label: 'Example 2(b) check: G and H', A: ['G', -3, 4], B: ['H', 1, 1] },
  notes: { label: `Notes: ${T('A(1,\\ 1)')} and ${T('B(5,\\ 4)')}`, A: ['A', 1, 1], B: ['B', 5, 4] }
};
const order = {
  title: 'Which point goes first? It doesn’t matter',
  height: 470,
  minW: 900,
  choices: Object.keys(ORD).map((k) => ({ v: k, label: ORD[k].label })),
  intro: 'Do the distance formula twice, once with each point first. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ORD[k], [nA, xA, yA] = d.A, [nB, xB, yB] = d.B, A = [xA, yA], B = [xB, yB], H = ex.def.height;
    const G = sqGraph(stage, fitWin([A, B, [0, 0]], 450, H - 20, 1), 450, H - 20, { x: 10, y: 10, center: true });
    const PW = ex.W - G.W - 44, P = panel(stage, G.W + 30, 14, PW, H - 28, '');
    const cols = h('div', 'u6l3-cols'), c1 = h('div', 'u6l3-col'), c2 = h('div', 'u6l3-col');
    c1.innerHTML = `<div class="u6l3-colh">${T(nA)} first</div>`; c2.innerHTML = `<div class="u6l3-colh">${T(nB)} first</div>`;
    cols.append(c1, c2); P.appendChild(cols); hide(c1); hide(c2);
    const r1 = xB - xA, s1 = yB - yA, r2 = -r1, s2 = -s1, dd = r1 * r1 + s1 * s1, [rk, rm] = simpRad(dd);
    const dir = (v, pos, neg) => `${Math.abs(v)} ${v > 0 ? pos : neg}`;
    const walk = async (c, from, to, col) => { const s = G.segment(from, to, { color: col, width: 5, arrowB: true }); await G.drawIn(s, 600, c); return s; };
    const ans = rm === 1 ? `=${rk}` : '';
    return [
      { cap: `${T(ptT(nA, xA, yA))} and ${T(ptT(nB, xB, yB))}. Which one is point 1? Try it <b>both ways</b>.`,
        run: async (c) => {
          await G.drawIn(G.segment(A, B, { color: SEG, width: 4.5 }), 600, c);
          await G.reveal(G.point(...A, { color: SEG, label: T(ptT(nA, xA, yA)), pos: 'n' }), c); await G.reveal(G.point(...B, { color: SEG, label: T(ptT(nB, xB, yB)), pos: yB > yA ? 'n' : 's' }), c);
        } },
      { cap: `${T(nA)} first: run ${T(`=${minus(xB, xA)}=${tn(r1)}`)} (${dir(r1, 'right', 'left')}), rise ${T(`=${minus(yB, yA)}=${tn(s1)}`)} (${dir(s1, 'up', 'down')}).`,
        run: async (c) => {
          await walk(c, A, [xB, yA], RUN); await walk(c, [xB, yA], B, RISE);
          await show(c, c1);
          line(c1, T(`\\text{run}=${minus(xB, xA)}=${tn(r1)}`), 'u6l3-trun'); line(c1, T(`\\text{rise}=${minus(yB, yA)}=${tn(s1)}`), 'u6l3-trise');
        } },
      { cap: `${T(nB)} first: run ${T(`=${minus(xA, xB)}=${tn(r2)}`)} (${dir(r2, 'right', 'left')}), rise ${T(`=${minus(yA, yB)}=${tn(s2)}`)} (${dir(s2, 'up', 'down')}). Same sizes, <b>opposite signs</b>.`,
        run: async (c) => {
          await walk(c, B, [xA, yB], RUN); await walk(c, [xA, yB], A, RISE);
          await show(c, c2);
          line(c2, T(`\\text{run}=${minus(xA, xB)}=${tn(r2)}`), 'u6l3-trun'); line(c2, T(`\\text{rise}=${minus(yA, yB)}=${tn(s2)}`), 'u6l3-trise');
        } },
      { cap: `Square them: ${T(`${par(r1)}^2`)} and ${T(`${par(r2)}^2`)} are both ${T(String(r1 * r1))}; ${T(`${par(s1)}^2`)} and ${T(`${par(s2)}^2`)} are both ${T(String(s1 * s1))}. Squaring <b>erases the sign</b>.`,
        run: async (c) => {
          const ls = [line(c1, T(`${par(r1)}^2=${r1 * r1}`), 'u6l3-trun'), line(c1, T(`${par(s1)}^2=${s1 * s1}`), 'u6l3-trise'), line(c2, T(`${par(r2)}^2=${r2 * r2}`), 'u6l3-trun'), line(c2, T(`${par(s2)}^2=${s2 * s2}`), 'u6l3-trise')];
          ls.forEach(hide); for (const e of ls) await show(c, e);
        } },
      { cap: `Both ways: ${T(`d=\\sqrt{${r1 * r1}+${s1 * s1}}=\\sqrt{${dd}}${ans}`)}. The same length, whichever point goes first.`,
        run: async (c) => {
          const ls = [line(c1, T(`d=\\sqrt{${r1 * r1}+${s1 * s1}}`)), line(c1, T(`=\\sqrt{${dd}}${ans}`), 'u6l3-cb u6l3-big'), line(c2, T(`d=\\sqrt{${r2 * r2}+${s2 * s2}}`)), line(c2, T(`=\\sqrt{${dd}}${ans}`), 'u6l3-cb u6l3-big')];
          ls.forEach(hide); for (const e of ls) await show(c, e);
          const sp = stamp(P, 'same length!', { ok: true, size: 'sm' }); sp.style.alignSelf = 'center'; sp.style.marginTop = 'auto'; await stampIn(c, sp);
        } }
    ];
  }
};

/* =============================== explainer: the five steps =============================== */
const REC = {
  ex3a: { label: 'Example 3(a) check', A: ['I', 0, 0], B: ['J', 5, 12] },
  ex3b: { label: 'Example 3(b) check', A: ['K', 2, 3], B: ['L', 5, 9] },
  ex4: { label: 'Example 4 check', A: ['M', -3, -2], B: ['N', 3, 0] }
};
const STEPS5 = [['Label', 'the points'], ['Subtract', 'run and rise'], ['Square', 'each one'], ['Add', 'the squares'], ['Square root', 'simplify']];
const recipe = {
  title: 'The distance formula in five steps',
  height: 470,
  minW: 940,
  choices: Object.keys(REC).map((k) => ({ v: k, label: REC[k].label })),
  intro: 'Label, subtract, square, add, square root. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = REC[k], [nA, x1, y1] = d.A, [nB, x2, y2] = d.B, A = [x1, y1], B = [x2, y2], H = ex.def.height;
    const r = x2 - x1, s = y2 - y1, rr = r * r, ss = s * s, N = rr + ss, [rk, rm] = simpRad(N), name = nA + nB;
    const LW = 196, GW = 270, WW = ex.W - LW - GW - 46;
    const tiles = STEPS5.map(([a, b], i) => add(stage, box(h('div', 'u6l3-rtile', `<b class="n">${i + 1}</b><div><b>${a}</b><br><span>${b}</span></div>`), LW, 78), 10, 14 + i * 88));
    const W = panel(stage, LW + 22, 14, WW, H - 28, `${T(name)}`); W.classList.add('u6l3-rec');
    const G = sqGraph(stage, fitWin([A, B, [0, 0]], GW, H - 40, 1), GW, H - 40, { x: ex.W - GW - 10, y: 20, center: true, g: { numbers: false } });
    const light = (i) => tiles.forEach((t, j) => { t.classList.toggle('on', j === i); t.classList.toggle('done', j < i); });
    const cR = (v) => `\\textcolor{#c27a0e}{${v}}`, cS = (v) => `\\textcolor{#7b4fc4}{${v}}`;
    const ln = (c, tx, cls) => show(c, line(W, T(tx), cls));
    const last = rm === 1 ? `\\sqrt{${N}}=${rk}` : `\\sqrt{${N}}` + (rk > 1 ? `=\\sqrt{${rk * rk}}\\cdot\\sqrt{${rm}}=${rk}\\sqrt{${rm}}` : '');
    const dec = Math.sqrt(N).toFixed(2);
    return [
      { cap: `<b>1. Label.</b> Call ${T(nA)} point 1 and ${T(nB)} point 2: ${T(`x_1=${tn(x1)},\\ y_1=${tn(y1)}`)} and ${T(`x_2=${tn(x2)},\\ y_2=${tn(y2)}`)}.`,
        run: async (c) => {
          light(0);
          await G.drawIn(G.segment(A, B, { color: SEG, width: 4 }), 500, c);
          await G.reveal(G.point(...A, { color: SEG, label: T(nA), pos: s > 0 ? 'w' : 'n', labelColor: INK }), c); await G.reveal(G.point(...B, { color: SEG, label: T(nB), pos: s > 0 ? 'n' : 's', labelColor: INK }), c);
          await ln(c, `${nA}(\\underset{x_1}{${tn(x1)}},\\ \\underset{y_1}{${tn(y1)}})\\quad ${nB}(\\underset{x_2}{${tn(x2)}},\\ \\underset{y_2}{${tn(y2)}})`, 'u6l3-lab2');
        } },
      { cap: `<b>2. Subtract.</b> Run: ${T(`x_2-x_1=${minus(x2, x1)}=${tn(r)}`)}. Rise: ${T(`y_2-y_1=${minus(y2, y1)}=${tn(s)}`)}.`,
        run: async (c) => {
          light(1);
          await drawLegs(G, c, A, B, { ms: 400 });
          await pop(c, legLabel(G, A, B, 'run', T(tn(r)))); await pop(c, legLabel(G, A, B, 'rise', T(tn(s))));
          await ln(c, `d=\\sqrt{(${cR(minus(x2, x1))})^2+(${cS(minus(y2, y1))})^2}`);
          await ln(c, `=\\sqrt{${cR(par(r))}^2+${cS(par(s))}^2}`);
        } },
      { cap: `<b>3. Square</b> each one: ${T(`${par(r)}^2=${rr}`)} and ${T(`${par(s)}^2=${ss}`)}.`,
        run: async (c) => { light(2); await ln(c, `=\\sqrt{${cR(rr)}+${cS(ss)}}`); } },
      { cap: `<b>4. Add:</b> ${T(`${rr}+${ss}=${N}`)}.`,
        run: async (c) => { light(3); await ln(c, `=\\sqrt{${N}}`); } },
      { cap: rm === 1 ? `<b>5. Square root:</b> ${T(`\\sqrt{${N}}=${rk}`)}, a perfect square. ${T(`${name}=${rk}`)} units exactly.`
        : `<b>5. Square root.</b> ${N} is not a perfect square, so simplify: ${T(`${name}=${rk}\\sqrt{${rm}}`)} units, about ${T(dec)}.`,
        run: async (c) => {
          light(4);
          await ln(c, rm === 1 ? `=${rk}` : `=${rk}\\sqrt{${rm}}\\approx${dec}`, 'u6l3-cb u6l3-big');
          tiles[4].classList.add('done');
          const sp = stamp(W, `${name} = ${rm === 1 ? rk : rk + '√' + rm}`, { ok: true, size: 'sm' }); sp.style.alignSelf = 'center'; sp.style.marginTop = 'auto'; await stampIn(c, sp);
          void last;
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: simplest radical form (from the 10C twin)
 * ====================================================================================== */
const SR = { r18: { label: 'Demo: √18', n: 18 }, r45: { label: 'Example 3(b): √45', n: 45 }, r40: { label: 'Example 4(a): √40', n: 40 } };
const simplify = {
  title: 'Simplest form: find the biggest perfect square',
  height: 420,
  minW: 860,
  choices: Object.keys(SR).map((k) => ({ v: k, label: SR[k].label })),
  intro: 'Is there a perfect square hiding under the root? Press <b>Next</b>.',
  make(stage, key, ex) {
    const n = SR[key].n, [k, m] = simpRad(n), ks = [];
    for (let j = 2; j * j <= n; j++) ks.push(j);
    const fits = ks.filter((j) => n % (j * j) === 0), tw = 84, gap = 26, x0 = (ex.W - ks.length * (tw + gap) + gap) / 2, ty = 70;
    const head = lab(stage, ex.W / 2, 28, T(`\\sqrt{${n}}`), 'u6l3-big'); head.style.fontSize = '34px';
    const tiles = ks.map((j, i) => hide(add(stage, h('div', 'u6l3-tile', `<div class="u6l3-tn">${j * j}</div><div class="u6l3-ts">${T(`${j}^2`)}</div>`), x0 + i * (tw + gap), ty)));
    const qs = ks.map((j, i) => { const q = n / (j * j), ok = Number.isInteger(q); return hide(add(stage, h('div', 'u6l3-tq', `${T(`${n}\\div${j * j}`)}<br>${ok ? T(String(q)) : 'not whole'} <b class="${ok ? 'u6l3-cg' : 'u6l3-cr'}">${ok ? '✓' : '✗'}</b>`), x0 + i * (tw + gap) - 10, ty + tw + 6)); });
    const e1 = hide(lab(stage, ex.W / 2, 268, '', 'u6l3-steq')), e2 = hide(lab(stage, ex.W / 2, 328, '', 'u6l3-steq')), e3 = hide(lab(stage, ex.W / 2, 384, '', 'u6l3-steq'));
    const sq = Math.sqrt(n), fitWord = fits.length > 1 ? `Several fit (${fits.map((j) => j * j).join(', ')}). Use the <b>biggest</b>` : `Only <b>${k * k}</b> fits`;
    return [
      { cap: `Simplify ${T(`\\sqrt{${n}}`)}. Here are the perfect squares up to ${n}.`,
        run: async (c) => { for (const t of tiles) await pop(c, t, 220); } },
      { cap: `Divide ${n} by each one. A whole-number answer (green) means that square <b>divides ${n} evenly</b>.`,
        run: async (c) => { for (let i = 0; i < ks.length; i++) { const ok = fits.includes(ks[i]); tiles[i].classList.add(ok ? 'u6l3-yes' : 'u6l3-no'); await fadeIn(c, qs[i], 200); } } },
      { cap: `${fitWord}: ${T(`${n}=${k * k}\\times${m}`)}.`,
        run: async (c) => { tiles[ks.indexOf(k)].classList.add('u6l3-best'); await pulse(c, tiles[ks.indexOf(k)], 1.12); e1.innerHTML = T(`\\sqrt{${n}}=\\sqrt{${k * k}}\\cdot\\sqrt{${m}}`); await show(c, e1); } },
      { cap: `${T(`\\sqrt{${k * k}}=${k}`)} comes out front: ${T(`\\sqrt{${n}}=${k}\\sqrt{${m}}`)}. That is the <b>mixed radical</b> in simplest form.`,
        run: async (c) => { e2.innerHTML = T(`=${k}\\times\\sqrt{${m}}=\\boldsymbol{${k}\\sqrt{${m}}}`); await show(c, e2); } },
      { cap: `Decimal (calculator): ${T(`\\sqrt{${n}}=${sq.toFixed(4)}\\ldots`)}, so ${T(`\\approx${sq.toFixed(2)}`)} to the nearest hundredth. Round only at the end.`,
        run: async (c) => { e3.innerHTML = T(`\\approx${sq.toFixed(4)}\\ldots\\approx\\boldsymbol{${sq.toFixed(2)}}`); await show(c, e3); } }
    ];
  }
};

/* =============================== explainer: distance on a map =============================== */
const MAPS = {
  ex5: { label: 'Example 5 check: shelter to dock', kind: 'park', A: [3, 8], B: [11, 2], nA: 'picnic shelter', nB: 'swimming dock', scale: 25, unit: 'm',
    win: { xmin: 0, xmax: 14, ymin: 0, ymax: 10 }, every: 2, down: true },
  farm: { label: 'Warm-up: the Farm (1 block = 100 m)', kind: 'city', A: [0, 0], B: [12, 5], nA: 'shop', nB: 'Farm', scale: 100, unit: 'm',
    win: { xmin: -0.7, xmax: 13, ymin: -0.7, ymax: 7 }, every: 5 }
};
function parkBg(G) {
  const bg = G.layers.bg, [x0, y0] = G.toPx(0, 10), [x1, y1] = G.toPx(14, 0);
  svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: '#eaf5e1' }, bg);
  const [lx, ly] = G.toPx(13.2, 1.6), ux = G.ux, dl = G.layers.data; // the lake and trees go in the clipped data layer
  svgEl('ellipse', { cx: lx, cy: ly, rx: ux * 2.1, ry: ux * 1.3, fill: '#bfe0f5', stroke: '#8cc3e6', 'stroke-width': 2 }, dl);
  for (const [x, y] of [[1, 3], [2, 2], [5, 4.5], [1.5, 6], [13, 9], [7.5, 3], [13.2, 4.6]]) { const [px, py] = G.toPx(x, y); svgEl('circle', { cx: px, cy: py, r: ux * 0.38, fill: '#9fcf8e', stroke: '#6fa85e', 'stroke-width': 1.5 }, dl); }
  G.label(13.6, 1.25, 'lake', { cls: 'u6l3-mapl u6l3-mapr' });
}
function shelterFig(G, x, y) {
  const [px, py] = G.toPx(x, y), g = svgEl('g', {}, G.layers.top);
  svgEl('path', { d: `M${px - 20} ${py - 12} L${px} ${py - 28} L${px + 20} ${py - 12} Z`, fill: '#c0563f', stroke: INK, 'stroke-width': 1.6 }, g);
  svgEl('path', { d: `M${px - 14} ${py - 12} V${py - 1} M${px + 14} ${py - 12} V${py - 1}`, stroke: INK, 'stroke-width': 2.4 }, g);
  svgEl('rect', { x: px - 9, y: py - 8, width: 18, height: 4, fill: '#a0703a', stroke: INK, 'stroke-width': 1 }, g);
  svgEl('circle', { cx: px, cy: py, r: 5, fill: INK, stroke: '#fff', 'stroke-width': 1.6 }, g);
  return g;
}
function dockFig(G, x, y) {
  const [px, py] = G.toPx(x, y), g = svgEl('g', {}, G.layers.top);
  svgEl('rect', { x: px - 4, y: py - 2, width: 30, height: 9, fill: '#b98a52', stroke: INK, 'stroke-width': 1.4 }, g);
  for (const dx of [2, 10, 18]) svgEl('line', { x1: px + dx, y1: py - 2, x2: px + dx, y2: py + 7, stroke: INK, 'stroke-width': 0.8 }, g);
  svgEl('circle', { cx: px, cy: py, r: 5, fill: INK, stroke: '#fff', 'stroke-width': 1.6 }, g);
  return g;
}
const map = {
  title: 'Distance on a map: grid units, then the scale',
  height: 480,
  minW: 900,
  choices: Object.keys(MAPS).map((k) => ({ v: k, label: MAPS[k].label })),
  intro: (k) => (k === 'ex5' ? 'A coordinate grid over a park map: 1 grid unit = 25 m. Press <b>Next</b>.' : 'The warm-up map: 1 block = 100 m. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = MAPS[k], A = d.A, B = d.B, C = corner(A, B), H = ex.def.height;
    const city = d.kind === 'city';
    const G = sqGraph(stage, d.win, 540, H - 20, { x: 10, y: 10, center: true, g: city ? { xtitle: '', ytitle: '', arrows: false } : { xlabels: 2, ylabels: 2 } });
    if (city) { cityBlocks(G, 0, 12, 0, 6); } else parkBg(G);
    const P = panel(stage, G.W + 30, 14, ex.W - G.W - 44, H - 28, 'Distance on the map');
    const r = B[0] - A[0], s = B[1] - A[1], N = r * r + s * s, dd = Math.round(Math.sqrt(N)), real = dd * d.scale;
    const uName = city ? 'blocks' : 'grid units';
    const cap1 = city ? `The shop is at ${T('(0,\\ 0)')} and the Farm at ${T('(12,\\ 5)')}. Each block is <b>100 m</b>.`
      : `The ${d.nA} is at ${T(P2(...A))} and the ${d.nB} at ${T(P2(...B))}. Each grid unit is <b>25 m</b>.`;
    return [
      { cap: cap1,
        run: async (c) => {
          if (city) { const s0 = h('div', 'u6l3-shop', 'SHOP'); add(G.html, s0, ...G.toPx(0, 0)); await pop(c, s0); const hs = house(G, 12, 5, '#3f8a4a'); await appear(c, hs); await appear(c, G.label(12, 5, '<b>Farm</b>', { pos: 'n', cls: 'u6l3-hlab', gap: 34 })); }
          else {
            await appear(c, shelterFig(G, ...A)); await appear(c, G.label(...A, `picnic shelter ${T(P2(...A))}`, { pos: 'n', cls: 'bk-ptlab', gap: 30 }));
            await appear(c, dockFig(G, ...B)); await appear(c, G.label(...B, `dock ${T(P2(...B))}`, { pos: 'sw', cls: 'bk-ptlab', gap: 8 }));
          }
          const sc = line(P, `<span class="u6l3-scale"><i></i></span> 1 ${city ? 'block' : 'unit'} = ${d.scale} m`, 'u6l3-sm'); hide(sc); await show(c, sc);
        } },
      { cap: city ? `The truck’s two streets are the legs of the right triangle. The corner is ${T('(12,\\ 0)')}.`
        : `The right triangle is still there. Its corner is ${T(P2(...C))}: above the dock, across from the shelter.`,
        run: async (c) => { await drawLegs(G, c, A, B); } },
      { cap: `<b>Run:</b> ${T(`${minus(B[0], A[0])}=${r}`)}. <b>Rise:</b> ${T(`${minus(B[1], A[1])}=${tn(s)}`)}${s < 0 ? ` (${-s} down)` : ''}.`,
        run: async (c) => {
          await pop(c, legLabel(G, A, B, 'run', T(String(r)), { pos: city ? 'n' : undefined })); await pop(c, legLabel(G, A, B, 'rise', T(tn(s))));
          await show(c, line(P, T(`\\text{run}=${minus(B[0], A[0])}=${r}`), 'u6l3-trun')); await show(c, line(P, T(`\\text{rise}=${minus(B[1], A[1])}=${tn(s)}`), 'u6l3-trise'));
        } },
      { cap: `${T(`d=\\sqrt{${par(r)}^2+${par(s)}^2}=\\sqrt{${r * r}+${s * s}}=\\sqrt{${N}}=${dd}`)} ${uName}.`,
        run: async (c) => {
          await G.drawIn(G.segment(A, B, { color: city ? RED : SEG, width: 4.5, dash: city ? '9 6' : undefined }), 700, c);
          for (const t of [`d=\\sqrt{${par(r)}^2+${par(s)}^2}`, `=\\sqrt{${r * r}+${s * s}}=\\sqrt{${N}}`, `=${dd}\\text{ ${uName}}`]) await show(c, line(P, T(t)));
        } },
      { cap: city ? `Each block is 100 m: the drone flies ${T('13\\times100=1\\,300')} m, or <b>1.3 km</b>. The truck drives ${T('17\\times100=1\\,700')} m, or 1.7 km.`
        : `Now the scale. Lay a tape along the path: each unit is 25 m, so ${T(`${dd}\\times25=${real}`)} m.`,
        run: async (c) => {
          // a tape measure along the segment: a tick every unit, a running total every few
          const [ax, ay] = G.toPx(...A), [bx, by] = G.toPx(...B), L = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / L, uy = (by - ay) / L, nx = -uy, ny = ux;
          const g = svgEl('g', {}, G.layers.top);
          for (let i = 0; i <= dd; i++) {
            const px = ax + ux * L * i / dd, py = ay + uy * L * i / dd, big = i % d.every === 0 || i === dd;
            const t = svgEl('line', { x1: px - nx * (big ? 9 : 5), y1: py - ny * (big ? 9 : 5), x2: px + nx * (big ? 9 : 5), y2: py + ny * (big ? 9 : 5), stroke: INK, 'stroke-width': big ? 2.4 : 1.6 }, g);
            t.style.opacity = 0;
          }
          for (const t of g.children) { await appear(c, t, 60); }
          const labs = [];
          for (let i = d.every; i <= dd; i += d.every) labs.push(i);
          if (labs[labs.length - 1] !== dd) labs.push(dd);
          for (const i of labs) {
            const p = [A[0] + r * i / dd, A[1] + s * i / dd];
            const sd = city ? 1 : -1, l = G.label(...p, bigNum(i * d.scale), { cls: 'u6l3-tape' + (i === dd ? ' u6l3-tapeend' : ''), dx: sd * nx * 24, dy: sd * ny * 24 }); hide(l); await pop(c, l, 220);
          }
          await show(c, line(P, T(`${dd}\\times${d.scale}=${bigTex(real)}\\text{ m}`), 'u6l3-big u6l3-cb'));
          if (city) await show(c, line(P, `truck: ${T('17\\times100=1\\,700')} m`, 'u6l3-sm'));
          const sp = stamp(P, city ? '1.3 km' : `${real} m`); sp.style.alignSelf = 'center'; sp.style.marginTop = 'auto'; await stampIn(c, sp);
        } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const pr = (v) => (v < 0 ? '(' + v + ')' : String(v));               // bracket a negative
  const P = (n, p) => n + '(' + p[0] + ',\\ ' + p[1] + ')';               // A(3,\ -2)
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
      let vx = p.p[0] - p.away[0], vy = -(p.p[1] - p.away[1]); const n = Math.hypot(vx, vy) || 1; vx /= n; vy /= n;
      const lx = Math.max(12, Math.min(W - 12, cx + vx * 17)), ly = Math.max(14, Math.min(Hh - 6, cy + vy * 17 + 6));
      s += `<text x="${f(lx)}" y="${f(ly)}" font-size="19" font-weight="700" fill="${c}" text-anchor="middle" ${halo}>${p.t}</text>`;
    });
    return s + '</svg>';
  }
  function simp(N) { let k = 1, m = N; for (let q = 2; q * q <= m; q++) while (m % (q * q) === 0) { m /= q * q; k *= q; } return { k, m }; }
  const rootEnd = (N) => { const { k, m } = simp(N); if (m === 1) return '\\sqrt{' + N + '}=' + k; if (k === 1) return '\\sqrt{' + N + '}\\ \\ (\\text{already simplest})'; return '\\sqrt{' + N + '}=\\sqrt{' + k * k + '}\\cdot\\sqrt{' + m + '}=' + k + '\\sqrt{' + m + '}'; };
  const tenth = (x) => (Math.round(x * 10) / 10).toFixed(1);
  const NAMES = [['A', 'B'], ['C', 'D'], ['P', 'Q'], ['M', 'N'], ['R', 'S'], ['E', 'F'], ['J', 'K'], ['G', 'H']];
  const TRIPLES = [[3, 4], [4, 3], [6, 8], [8, 6]];
  // the distance formula written out with the given points (point 1 = A, point 2 = B)
  const dLines = (A, B, nm) => {
    const dx = B[0] - A[0], dy = B[1] - A[1], N = dx * dx + dy * dy;
    return [nm + '=\\sqrt{(' + B[0] + '-' + pr(A[0]) + ')^2+(' + B[1] + '-' + pr(A[1]) + ')^2}',
      '=\\sqrt{' + pr(dx) + '^2+' + pr(dy) + '^2}=\\sqrt{' + dx * dx + '+' + dy * dy + '}=\\sqrt{' + N + '}'];
  };
  // Beginning: a segment on the grid, legs a Pythagorean triple: run, rise, length
  function onGrid(r) {
    for (;;) {
      const [a, b] = r.pick(TRIPLES), A = [r.int(-6, 6), r.int(-6, 6)], B = [A[0] + r.sign() * a, A[1] + r.sign() * b];
      if (Math.abs(B[0]) > 6 || Math.abs(B[1]) > 6 || [...A, ...B].includes(0)) continue; // off the axes: easier to read
      const [n1, n2] = r.pick(NAMES), nm = n1 + n2, K = [B[0], A[1]], N = a * a + b * b;
      return {
        text: `Draw the right triangle under <i>${nm}</i>. Find the run, the rise, and the length of <i>${nm}</i>.`,
        q: '',
        fig: gridSVG({ label: 'segment ' + nm, segs: [{ a: A, b: B }], pts: [{ p: A, t: n1, away: B }, { p: B, t: n2, away: A }] }),
        a: [P(n1, A) + ',\\ ' + P(n2, B) + '\\qquad \\text{corner }(' + K[0] + ',\\ ' + K[1] + ')',
          '\\text{run}=' + a + ',\\quad \\text{rise}=' + b,
          '(' + nm + ')^2=' + a + '^2+' + b + '^2=' + a * a + '+' + b * b + '=' + N,
          nm + '=\\sqrt{' + N + '}=' + Math.sqrt(N) + '\\text{ units}']
      };
    }
  }
  // Progressing: the distance formula with negatives; exact answer in simplest form
  function formula(r) {
    for (;;) {
      const a = r.int(1, 8), b = r.int(1, 8), N = a * a + b * b, { k, m } = simp(N);
      if (m !== 1 && k === 1 && r.chance(0.6)) continue; // mostly answers that are whole or simplify
      const A = [r.int(-8, 8), r.int(-8, 8)], B = [A[0] + r.sign() * a, A[1] + r.sign() * b];
      if (Math.abs(B[0]) > 9 || Math.abs(B[1]) > 9 || ![...A, ...B].some((v) => v < 0)) continue;
      const [n1, n2] = r.pick(NAMES), nm = n1 + n2;
      return {
        text: `Use the distance formula. Find the <b>exact</b> length of <i>${nm}</i>, in simplest form.`,
        q: P(n1, A) + '\\qquad ' + P(n2, B),
        a: dLines(A, B, nm).concat([m === 1 ? '=' + k + '\\text{ units}'
          : k > 1 ? '=\\sqrt{' + k * k + '}\\cdot\\sqrt{' + m + '}=' + k + '\\sqrt{' + m + '}\\text{ units}'
            : '\\sqrt{' + N + '}\\text{ is already in simplest form.}'])
      };
    }
  }
  // Mastery: exact and to the nearest tenth, or a map with a scale
  function decimal(r) {
    for (;;) {
      const a = r.int(1, 9), b = r.int(1, 9), N = a * a + b * b, { m } = simp(N);
      if (m === 1) continue;
      const A = [r.int(-9, 9), r.int(-9, 9)], B = [A[0] + r.sign() * a, A[1] + r.sign() * b];
      if (Math.abs(B[0]) > 12 || Math.abs(B[1]) > 12 || ![...A, ...B].some((v) => v < 0)) continue;
      const [n1, n2] = r.pick(NAMES), nm = n1 + n2, { k } = simp(N);
      return {
        text: `Find the length of <i>${nm}</i>: exactly (in simplest form), then as a decimal to the nearest tenth.`,
        q: P(n1, A) + '\\qquad ' + P(n2, B),
        a: dLines(A, B, nm).concat([(k > 1 ? '=' + k + '\\sqrt{' + m + '}' : '=\\sqrt{' + N + '}') + '\\approx' + tenth(Math.sqrt(N)) + '\\text{ units}'])
      };
    }
  }
  const PLACES = [['the school', 'the library'], ['the arena', 'the pool'], ['the bakery', 'the bus stop'], ['the campsite', 'the lookout'], ['the fire hall', 'the hospital'], ['the barn', 'the pond']];
  const SCALES = [[2, 'km'], [5, 'km'], [25, 'm'], [50, 'm'], [10, 'm'], [100, 'm'], [3, 'km']];
  const BIG = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]];
  function mapQ(r) {
    for (;;) {
      const [a, b] = r.pick(BIG), A = [r.int(-6, 10), r.int(-6, 10)], B = [A[0] + r.sign() * a, A[1] + r.sign() * b];
      if (Math.abs(B[0]) > 14 || Math.abs(B[1]) > 14) continue;
      const [p1, p2] = r.pick(PLACES), [sc, u] = r.pick(SCALES), dd = Math.sqrt(a * a + b * b);
      const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
      return {
        text: `On a map grid, each unit is <b>${sc} ${u}</b>. How far apart are ${p1} and ${p2}, in ${u}?`,
        q: '\\text{' + cap(p1.replace('the ', '')) + ' }(' + A[0] + ',\\ ' + A[1] + ')\\qquad \\text{' + cap(p2.replace('the ', '')) + ' }(' + B[0] + ',\\ ' + B[1] + ')',
        a: dLines(A, B, 'd').concat(['=' + dd + '\\text{ grid units}', dd + '\\times' + sc + '=' + bigTex(dd * sc) + '\\text{ ' + u + '}'])
      };
    }
  }
  standup('u6l3', {
    intro: 'Find the length at your whiteboard station: the run and the rise first, then square, add, and take the square root.',
    levels: {
      BEG: onGrid,                                            // build the triangle on a grid; whole-number lengths
      PRG: formula,                                           // the distance formula with negatives; simplest form
      MAS: (r) => (r.chance(0.5) ? decimal(r) : mapQ(r))      // exact and to the nearest tenth, or a map scale
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountCity();
mountStatics();
export const explainers = mountExplainers({ hidden, corner: cornerEx, lift, order, recipe, simplify, map });
export const _test = { HID, CRN, LIFT, ORD, REC, SR, MAPS, simpRad, radTex, sgn };
