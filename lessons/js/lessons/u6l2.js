/* Math 15 · Unit 6 · Lesson 2 — Measuring the Length of a Line Segment.
 * Warm-up (The Elevator: ride between floors above and below the lobby and count the floors; the subway runs sideways,
 * tap two stops), static figures, and the explainers:
 *   segIntro (plot two points from the origin, the line through them runs forever, the segment stops: it has a length),
 *   lengthsH / lengthsV (count the squares, or subtract the coordinates; a horizontal segment, a vertical one turned 90°;
 *   Example 1–4 checks; from Math 10C u6l1 "lengths"), absVal (walk both ways on a number line: −14 and 14, the same
 *   distance; Example 2(a), the big one, the subway), slide (coordinates with a letter: the segment slides, the length
 *   stays; Example 2(b) and 4(b)), whichWay (find the matching coordinate first), perimeter (walk around a rectangle on a
 *   grid; Example 5). Stand Up Break: lengths from coordinates → bigger numbers and letters → perimeters.
 * Colours (as in Math 10C u6): horizontal / run amber, vertical / rise purple, segments blue, the match green. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, anim,
  pairTex, texNum, svgEl, liveCtx, pulse, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = COLORS.amber, PUR = COLORS.purple, BLUE = COLORS.blue, RED = COLORS.red, GRN = COLORS.green, INK = COLORS.ink;
const tn = (v) => texNum(v);
const par = (v) => (v < 0 ? `(${tn(v)})` : tn(v));                 // a negative in brackets when it is subtracted
const minus = (a, b) => `${tn(a)}-${par(b)}`;                        // "a-(b)"
const ptT = (n, x, y) => `${n}${pairTex(x, y)}`;                     // "A(-5,\ 5)"
const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u6l2-panel', title ? `<div class="u6l2-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l2-line ' + cls, html); p.appendChild(d); return d; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const hide = (el) => { el.style.opacity = 0; return el; };
const lab = (host, x, y, html, cls = '') => { const d = h('div', cls, html); d.style.position = 'absolute'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.translate = '-50% -50%'; host.appendChild(d); return d; };

/** a window with equal units that holds every point (and the origin), for a graph of W × H px with 18 px padding */
function fitWin(pts, W, H, pad = 1) {
  const xs = pts.map((p) => p[0]).concat(0), ys = pts.map((p) => p[1]).concat(0);
  const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  const pw = W - 36, ph = H - 36, u = Math.min(pw / (x1 - x0), ph / (y1 - y0)), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return { xmin: cx - pw / u / 2, xmax: cx + pw / u / 2, ymin: cy - ph / u / 2, ymax: cy + ph / u / 2 };
}
/** an arc from graph point p to q, bulging by `bulge` px in the px direction (nx, ny) */
function hopArc(G, p, q, o) {
  const b = o.bulge || 12;
  return G.curve(() => {
    const P = G.toPx(p[0], p[1]), Q = G.toPx(q[0], q[1]), C = [(P[0] + Q[0]) / 2 + o.nx * b * 2, (P[1] + Q[1]) / 2 + o.ny * b * 2], pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12, u = 1 - t; pts.push([u * u * P[0] + 2 * t * u * C[0] + t * t * Q[0], u * u * P[1] + 2 * t * u * C[1] + t * t * Q[1]]); }
    return { subs: [pts] };
  }, { color: o.color, width: 2.6 }, 'u6l2-hop', G.layers.top);
}
/** unit hops from A to B (a horizontal or vertical run), numbered 1, 2, 3 … ; side: px direction [nx, ny] */
async function countHops(G, c, A, B, o) {
  const horiz = A[1] === B[1], dd = horiz ? B[0] - A[0] : B[1] - A[1], n = Math.round(Math.abs(dd)), s = Math.sign(dd), [nx, ny] = o.side, b = 11, els = [];
  for (let i = 0; i < n; i++) {
    const p = horiz ? [A[0] + s * i, A[1]] : [A[0], A[1] + s * i], q = horiz ? [A[0] + s * (i + 1), A[1]] : [A[0], A[1] + s * (i + 1)];
    const arc = hopArc(G, p, q, { color: o.color, nx, ny, bulge: b });
    const l = hide(G.label((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, String(i + 1), { cls: 'u6l2-hopn', color: o.color, dx: nx * (b + 12), dy: ny * (b + 12) }));
    els.push(arc, l);
    await G.drawIn(arc, o.ms || 150, c); await appear(c, l, 80);
  }
  return els;
}
/** a static grid figure with labelled segments: segs = [[[name, x, y, pos], [name, x, y, pos]], …] */
function segFig(id, segs, win, o = {}) {
  const host = document.getElementById(id); if (!host) return null;
  const G = new Graph(host, Object.assign({ width: 400, height: 400, xlabels: 2, ylabels: 2 }, win, o));
  for (const s of segs) {
    G.segment(s[0].slice(1, 3), s[1].slice(1, 3), { color: BLUE, width: 4 });
    for (const p of s) G.point(p[1], p[2], { color: BLUE, label: T(p[0]), pos: p[3], labelColor: INK });
  }
  return G;
}

/* =============================== warm-up: The Elevator =============================== */
function mountWarm() {
  const host = document.getElementById('u6l2-bldg'); if (!host) return;
  const FH = 27, F0 = -4, F1 = 10, top = 34, W = 240, Hh = top + (F1 - F0 + 1) * FH + 14;
  const yOf = (f) => top + (F1 - f) * FH;             // top edge of floor f's band
  const svg = svgEl('svg', { width: W, height: Hh, viewBox: `0 0 ${W} ${Hh}`, class: 'u6l2-bsvg' }); host.appendChild(svg);
  const txt = (x, y, s, cls, attrs = {}) => { const e = svgEl('text', Object.assign({ x, y, class: cls }, attrs), svg); e.textContent = s; return e; };
  const bx = 44, bw = 150, sx = 104, sw = 30;
  svgEl('rect', { x: 0, y: yOf(-1), width: W, height: Hh - yOf(-1), fill: '#e9d3b0' }, svg);              // the ground
  svgEl('rect', { x: bx, y: top - 6, width: bw, height: yOf(0) + FH - top + 6, fill: '#ffe2a0', stroke: '#c88c14', 'stroke-width': 1.5 }, svg);
  svgEl('rect', { x: bx, y: yOf(-1), width: bw, height: 4 * FH, fill: '#dcc39b', stroke: '#a8885a', 'stroke-width': 1.5 }, svg);
  svgEl('rect', { x: bx + 30, y: top - 16, width: bw - 60, height: 10, fill: '#c88c14' }, svg);
  for (let f = F0; f <= F1; f++) {
    const y = yOf(f);
    svgEl('line', { x1: bx, x2: bx + bw, y1: y + FH, y2: y + FH, stroke: f < 0 ? '#a8885a' : '#c88c14', 'stroke-width': 1 }, svg);
    txt(bx - 8, y + FH / 2 + 6, f < 0 ? '−' + -f : String(f), 'u6l2-fl', { 'text-anchor': 'end' });
    if (f >= 0) { for (const wx of [bx + 8, bx + 34, bx + bw - 26]) svgEl('rect', { x: wx, y: y + 6, width: 16, height: FH - 12, fill: '#fff', stroke: '#c88c14', 'stroke-width': 1 }, svg); }
    else txt(bx + 22, y + FH / 2 + 5, 'P', 'u6l2-pk', { 'text-anchor': 'middle' });
  }
  svgEl('line', { x1: 0, x2: W, y1: yOf(0) + FH, y2: yOf(0) + FH, stroke: '#3c7a2a', 'stroke-width': 4 }, svg);
  txt(bx + bw + 4, yOf(0) + FH / 2 + 5, 'lobby', 'u6l2-pk2');
  txt(4, top - 12, 'Floor', 'u6l2-pk2');
  svgEl('rect', { x: sx, y: top - 6, width: sw, height: yOf(F0) + FH - top + 6, fill: '#e6e8ee', stroke: '#8a93a6', 'stroke-width': 1.2 }, svg);
  const car = svgEl('rect', { x: sx + 3, y: 0, width: sw - 6, height: FH - 4, rx: 3, fill: RED, stroke: '#8f2622', 'stroke-width': 1.2 }, svg);
  const place = (f) => car.setAttribute('y', yOf(f) + 2);
  let at = 7; place(at);
  const out = document.getElementById('u6l2-rideout'), ctx = liveCtx(); let marks = [], busy = false;
  document.querySelectorAll('[data-ride]').forEach((b) => b.addEventListener('click', async () => {
    if (busy) return; busy = true;
    const [a, z] = b.dataset.ride.split(',').map(Number), n = Math.abs(z - a), s = Math.sign(z - a);
    marks.forEach((m) => m.remove()); marks = []; out.innerHTML = '';
    place(a); at = a; await sleep(ctx, 250);
    for (let i = 1; i <= n; i++) {
      const f0 = a + s * (i - 1), f1 = a + s * i, yb = s > 0 ? yOf(f0) : yOf(f1);      // the slab between the two floors
      await tween(ctx, 260, (t) => car.setAttribute('y', yOf(f0) + 2 + (yOf(f1) - yOf(f0)) * t));
      const c0 = svgEl('circle', { cx: sx + sw + 13, cy: yb, r: 9, fill: BLUE }, svg), t0 = txt(sx + sw + 13, yb + 4.5, String(i), 'u6l2-cnt', { 'text-anchor': 'middle' });
      marks.push(c0, t0);
    }
    at = z;
    const sub = z >= a ? `${z}-${par(a)}=${n}` : `${a}-${par(z)}=${n}`;
    out.innerHTML = `<b>${n} floors</b> &nbsp;${T(sub)}`;
    busy = false;
  }));
  // the subway: a number line from −6 to 6, five stops; tap two to measure
  const sh = document.getElementById('u6l2-subway'); if (!sh) return;
  const SW = 320, SH = 92, x0 = 16, ux = (SW - 32) / 12, Y = 60, X = (v) => x0 + (v + 6) * ux;
  const s2 = svgEl('svg', { width: SW, height: SH, viewBox: `0 0 ${SW} ${SH}` }); sh.appendChild(s2); sh.style.width = SW + 'px'; sh.style.height = SH + 'px';
  svgEl('line', { x1: 4, x2: SW - 4, y1: Y, y2: Y, stroke: '#9aa0ab', 'stroke-width': 5, 'stroke-linecap': 'round' }, s2);
  for (let v = -6; v <= 6; v++) { svgEl('line', { x1: X(v), x2: X(v), y1: Y - 5, y2: Y + 5, stroke: INK, 'stroke-width': 1.5 }, s2); const t = svgEl('text', { x: X(v), y: Y + 22, class: 'u6l2-snum', 'text-anchor': 'middle' }, s2); t.textContent = v < 0 ? '−' + -v : String(v); }
  const STOPS = [[-6, 'Airport', 0], [-2, 'Mall', 0], [0, 'Downtown', 1], [3, 'Arena', 0], [6, 'Zoo', 0]];
  const arcG = svgEl('g', {}, s2), sOut = document.getElementById('u6l2-subout');
  let pick = [];
  STOPS.forEach(([v, name, hi]) => {
    svgEl('circle', { cx: X(v), cy: Y, r: 6.5, fill: '#fff', stroke: RED, 'stroke-width': 3 }, s2);
    const b = h('button', 'u6l2-stop' + (hi ? ' hi' : ''), name); b.type = 'button'; b.style.left = X(v) + 'px'; sh.appendChild(b);
    b.addEventListener('click', () => {
      if (pick.length === 2) { pick = []; arcG.innerHTML = ''; sOut.innerHTML = ''; sh.querySelectorAll('.u6l2-stop').forEach((e) => e.classList.remove('on')); }
      if (pick.includes(v)) return;
      pick.push(v); b.classList.add('on');
      if (pick.length === 2) {
        const [a, z] = pick, lo = Math.min(a, z), hi2 = Math.max(a, z);
        svgEl('path', { d: `M${X(lo)} ${Y - 8} Q${(X(lo) + X(hi2)) / 2} ${Y - 8 - (X(hi2) - X(lo)) * 0.28} ${X(hi2)} ${Y - 8}`, fill: 'none', stroke: BLUE, 'stroke-width': 3 }, arcG);
        sOut.innerHTML = `${T(`|${hi2}-${par(lo)}|=${hi2 - lo}`)} <b>blocks</b>`;
      }
    });
  });
}

/* =============================== static figures =============================== */
function mountStatics() {
  const W6 = { xmin: -6.6, xmax: 6.6, ymin: -6.6, ymax: 6.6 };
  segFig('u6l2-ex1fig', [[['A', -4, 3, 'n'], ['B', 3, 3, 'n']], [['C', -5, -3, 's'], ['D', 1, -3, 's']]], W6);
  segFig('u6l2-ex3fig', [[['G', -3, 4, 'n'], ['H', -3, -2, 's']], [['I', 2, 5, 'n'], ['J', 2, -3, 's']]], W6);
  const e5 = document.getElementById('u6l2-ex5fig');
  if (e5) {
    const G = new Graph(e5, Object.assign({ width: 400, height: 400, xlabels: 2, ylabels: 2 }, W6));
    G.polyline([[-4, -2], [5, -2], [5, 4], [-4, 4]], { closed: true, color: BLUE, width: 4 });
    [['A', -4, -2, 'sw'], ['B', 5, -2, 'se'], ['C', 5, 4, 'ne'], ['D', -4, 4, 'nw']].forEach(([n, x, y, pos]) => G.point(x, y, { color: BLUE, label: T(n), pos, labelColor: INK }));
  }
  // section 1: a full line and a segment
  const s1 = document.getElementById('u6l2-s1fig');
  if (s1) {
    const W = 250, H = 150, svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }); s1.appendChild(svg);
    const t = (x, y, s, cls) => { const e = svgEl('text', { x, y, class: cls, 'text-anchor': 'middle' }, svg); e.textContent = s; };
    const row = (y, full) => {
      if (full) { svgEl('line', { x1: 16, x2: W - 16, y1: y, y2: y, stroke: '#7d8597', 'stroke-width': 3 }, svg); [[10, -1], [W - 10, 1]].forEach(([x, d]) => svgEl('path', { d: `M${x} ${y} l${-d * 12} -7 l0 14 Z`, fill: '#7d8597' }, svg)); }
      else svgEl('line', { x1: 75, x2: 175, y1: y, y2: y, stroke: BLUE, 'stroke-width': 5 }, svg);
      [75, 175].forEach((x, i) => { svgEl('circle', { cx: x, cy: y, r: 5.5, fill: full ? INK : BLUE }, svg); t(x, y - 12, i ? 'B' : 'A', 'u6l2-s1t'); });
    };
    row(40, true); t(W / 2, 66, 'a full line: goes on forever', 'u6l2-s1c');
    row(112, false); t(W / 2, 138, 'segment AB: stops at A and B', 'u6l2-s1c');
  }
  // section 3: two mini axes
  const mini = (id, vert) => {
    const e = document.getElementById(id); if (!e) return;
    const svg = svgEl('svg', { width: 130, height: 100, viewBox: '0 0 130 100' }); e.appendChild(svg);
    svgEl('line', { x1: 8, x2: 122, y1: 80, y2: 80, stroke: '#9aa0ab', 'stroke-width': 2 }, svg); svgEl('line', { x1: 24, x2: 24, y1: 6, y2: 94, stroke: '#9aa0ab', 'stroke-width': 2 }, svg);
    const [a, b] = vert ? [[72, 70], [72, 18]] : [[40, 40], [108, 40]];
    svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: vert ? PUR : AMB, 'stroke-width': 5 }, svg);
    [a, b].forEach((p) => svgEl('circle', { cx: p[0], cy: p[1], r: 5.5, fill: vert ? PUR : AMB }, svg));
  };
  mini('u6l2-minih', false); mini('u6l2-miniv', true);
}

/* ======================================================================================
 * Explainer 1: points, a line and a segment
 * ====================================================================================== */
const SI = {
  h: { label: `${T('A(-3,\\ 2)')} and ${T('B(4,\\ 2)')}`, A: ['A', -3, 2], B: ['B', 4, 2] },
  v: { label: `${T('P(1,\\ -4)')} and ${T('Q(1,\\ 3)')}`, A: ['P', 1, -4], B: ['Q', 1, 3] }
};
const segIntro = {
  title: 'Plot the endpoints, then cut the line down to a segment',
  height: 440,
  minW: 900,
  choices: Object.keys(SI).map((k) => ({ v: k, label: SI[k].label })),
  intro: 'Every point is a trip from the origin: across first, then up or down. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SI[k], [nA, xA, yA] = d.A, [nB, xB, yB] = d.B, A = [xA, yA], B = [xB, yB], W = ex.W, H = ex.def.height, horiz = yA === yB;
    const G = new Graph(stage, { x: 10, y: 6, width: 430, height: 430, xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2 });
    const P = panel(stage, 460, 16, W - 470, H - 32, 'Trips from the origin');
    const lines = [];
    const trip = async (c, n, x, y, i) => {
      const run = G.segment([0, 0], [x, 0], { color: AMB, width: 4, arrowB: true }), rise = G.segment([x, 0], [x, y], { color: PUR, width: 4, arrowB: true });
      await G.drawIn(run, 600, c); await G.drawIn(rise, 600, c);
      const p = G.point(x, y, { color: BLUE, label: T(ptT(n, x, y)), pos: horiz ? 'n' : (y > 0 ? 'e' : 'e'), labelColor: INK }); await G.reveal(p, c);
      lines[i] = line(P, `${T(ptT(n, x, y))}: ${x < 0 ? Math.abs(x) + ' left' : x > 0 ? x + ' right' : 'stay'}, ${y < 0 ? Math.abs(y) + ' down' : y + ' up'}`);
      await show(c, lines[i]);
      await sleep(c, 300); G.remove(run, rise);
    };
    const words = (x, y) => `go ${x < 0 ? `<b>${-x} left</b>` : x > 0 ? `<b>${x} right</b>` : '<b>nowhere</b> across'}, then ${y < 0 ? `<b>${-y} down</b>` : `<b>${y} up</b>`}`;
    let full, seg, hops = [];
    const len = Math.abs(horiz ? xB - xA : yB - yA);
    return [
      { cap: `Start at the origin ${T('(0,\\ 0)')}. To plot ${T(ptT(nA, xA, yA))}: ${words(xA, yA)}.`, run: (c) => trip(c, nA, xA, yA, 0) },
      { cap: `${T(ptT(nB, xB, yB))}: ${words(xB, yB)}.`, run: (c) => trip(c, nB, xB, yB, 1) },
      { cap: `A <b>line</b> through ${T(nA)} and ${T(nB)} keeps going forever in both directions (the arrows). It has no length.`,
        run: async (c) => { full = G.line(A, B, { color: '#7d8597', width: 3 }); await G.drawIn(full, 900, c); } },
      { cap: `The <b>segment</b> ${T(`\\overline{${nA}${nB}}`)} is only the piece between the two <b>endpoints</b>. It stops, so it has a length.`,
        run: async (c) => { await anim(c, full, [{ opacity: 1 }, { opacity: 0.25 }], 400); seg = G.segment(A, B, { color: BLUE, width: 6 }); await G.drawIn(seg, 700, c); await show(c, line(P, `segment ${T(`\\overline{${nA}${nB}}`)}`, 'u6l2-cb')); } },
      { cap: `Count the grid squares from ${T(nA)} to ${T(nB)}: <b>${len}</b>. We write the length as ${T(`${nA}${nB}=${len}`)}.`,
        run: async (c) => { hops = await countHops(G, c, A, B, { color: horiz ? AMB : PUR, side: horiz ? [0, 1] : [-1, 0] }); await pop(c, line(P, `length ${T(`${nA}${nB}=${len}`)}`, 'u6l2-boxed')); } }
    ];
  }
};

/* ======================================================================================
 * Explainers 2 & 3: count the squares, or subtract the coordinates (from Math 10C u6l1 "lengths")
 * ====================================================================================== */
// each segment: P1 → P2; the difference shown is (coordinate of P2) − (coordinate of P1)
const LEN = {
  demoH: { label: 'Horizontal demo', segs: [{ name: 'RS', P1: ['R', -3, 3], P2: ['S', 5, 3] }] },
  ex1: { label: 'Example 1 check', segs: [{ name: 'AB', P1: ['A', -4, 3], P2: ['B', 3, 3] }, { name: 'CD', P1: ['C', -5, -3], P2: ['D', 1, -3] }] },
  ex2a: { label: 'Example 2(a) check', segs: [{ name: 'TU', P1: ['T', 8, -3], P2: ['U', -6, -3] }] },
  demoV: { label: 'Vertical: turn it 90°', turn: true, segs: [{ name: 'RS', P1: ['R', -1, -2], P2: ['S', -1, 4] }] },
  ex3: { label: 'Example 3 check', segs: [{ name: 'GH', P1: ['H', -3, -2], P2: ['G', -3, 4] }, { name: 'IJ', P1: ['J', 2, -3], P2: ['I', 2, 5] }] },
  ex4a: { label: 'Example 4(a) check', segs: [{ name: 'KL', P1: ['K', 5, -8], P2: ['L', 5, 6] }] }
};
function lengthsDef(keys) {
  return {
    title: 'Count the squares, or subtract the coordinates',
    height: 480,
    minW: 950,
    choices: keys.map((k) => ({ v: k, label: LEN[k].label })),
    intro: (k) => (LEN[k].turn ? 'The same two ways, for a vertical segment. Press <b>Next</b>.' : 'Two ways to measure a segment on a grid. Do they always agree? Press <b>Next</b>.'),
    make(stage, k, ex) {
      const d = LEN[k], GW = 460, segs = d.segs.map((s) => Object.assign({}, s, { H: s.P1[2] === s.P2[2] }));
      const pts = segs.flatMap((s) => [s.P1.slice(1), s.P2.slice(1)]).concat([[-6, -6], [6, 6]], d.turn ? [[-4, 1], [2, 1]] : []);
      const G = new Graph(stage, Object.assign({ x: 8, y: 10, width: GW, height: 460, xlabels: 2, ylabels: 2 }, fitWin(pts, GW, 460, 1)));
      const P = panel(stage, GW + 28, 10, ex.W - GW - 36, 460, 'Count or subtract');
      const tb = h('div', 'u6l2-ct', `<div class="u6l2-cth">seg.</div><div class="u6l2-cth">count</div><div class="u6l2-cth">subtract</div>`); P.appendChild(tb);
      let hops = [], drops = [];
      const steps = [];
      const labPos = (s, p) => (s.H ? (p[2] > 0 ? 'n' : 's') : (p[1] > 0 ? 'e' : 'w'));
      const hopSide = (s) => (s.H ? [0, s.P1[2] > 0 ? 1 : -1] : [s.P1[1] > 0 ? -1 : 1, 0]);
      const drawSeg = (s, c) => {
        const A = s.P1.slice(1), B = s.P2.slice(1);
        s.seg = G.segment(A, B, { color: BLUE, width: 4.5 });
        s.pA = G.point(...A, { color: BLUE, label: T(s.P1[0]), pos: labPos(s, s.P1), labelColor: INK });
        s.pB = G.point(...B, { color: BLUE, label: T(s.P2[0]), pos: labPos(s, s.P2), labelColor: INK });
        return Promise.all([G.drawIn(s.seg, 500, c), G.reveal(s.pA, c), G.reveal(s.pB, c)]);
      };
      if (d.turn) {
        const s = segs[0], A0 = [-4, 1], B0 = [2, 1], C0 = [-1, 1], A = A0.slice(), B = B0.slice();
        steps.push({ cap: 'Start with a <b>horizontal</b> segment, 6 units long.',
          run: async (c) => { s.seg = G.segment(A, B, { color: BLUE, width: 4.5 }); s.pA = G.point(...A, { color: BLUE }); s.pB = G.point(...B, { color: BLUE }); await G.drawIn(s.seg, 500, c); await Promise.all([G.reveal(s.pA, c), G.reveal(s.pB, c)]); } });
        steps.push({ cap: `Turn it ${T('90^\\circ')} about its middle. Now it is <b>vertical</b>: both endpoints share the same <b>x</b>-coordinate.`,
          run: async (c) => {
            await tween(c, 1200, (t) => {
              const a = t * Math.PI / 2, cs = Math.cos(a), sn = Math.sin(a);
              const rot = (p0, p) => { const dx = p0[0] - C0[0], dy = p0[1] - C0[1]; p[0] = C0[0] + dx * cs - dy * sn; p[1] = C0[1] + dx * sn + dy * cs; };
              rot(A0, A); rot(B0, B); s.seg._bkDraw(); G.moveTo(s.pA, ...A); G.moveTo(s.pB, ...B);
            });
            G.remove(s.pA, s.pB);
            s.pA = G.point(...s.P1.slice(1), { color: BLUE, label: T(s.P1[0]), pos: 'w', labelColor: INK }); s.pB = G.point(...s.P2.slice(1), { color: BLUE, label: T(s.P2[0]), pos: 'w', labelColor: INK });
            await Promise.all([fadeIn(c, s.pA.label), fadeIn(c, s.pB.label)]);
          } });
      }
      segs.forEach((s, i) => {
        const Hz = s.H, X = Hz ? 'x' : 'y', Y = Hz ? 'y' : 'x', col = Hz ? AMB : PUR, ci = Hz ? 1 : 2, word = Hz ? 'right minus left' : 'upper minus lower';
        const a = s.P1[ci], b = s.P2[ci], diff = b - a, len = Math.abs(diff), neg = diff < 0;
        const A = s.P1.slice(1), B = s.P2.slice(1);
        const subT = `${X}_{${s.P2[0]}}-${X}_{${s.P1[0]}}=${minus(b, a)}=${tn(diff)}`;
        let cells;
        steps.push({
          cap: `${T(s.name)} is <b>${Hz ? 'horizontal' : 'vertical'}</b>. Count the squares from ${T(s.P1[0])} to ${T(s.P2[0])}: <b>${len}</b>.`,
          run: async (c) => {
            G.remove(...hops, ...drops); hops = []; drops = [];
            if (!s.seg) await drawSeg(s, c);
            hops = await countHops(G, c, A, B, { color: col, side: hopSide(s) });
            cells = [h('div', 'u6l2-ctn', T(s.name)), h('div', 'u6l2-ctn', `<span style="color:${col}">${len}</span>`), h('div', '', '')];
            cells.forEach((e) => tb.appendChild(e)); await Promise.all(cells.slice(0, 2).map((e) => show(c, e)));
          }
        });
        steps.push({
          cap: neg
            ? `${T(ptT(...s.P1))} and ${T(ptT(...s.P2))}: same ${T(Y)}. Subtract the ${T(X)}’s in the order given: ${T(`${minus(b, a)}=${tn(diff)}`)}. <b>Negative!</b>`
            : `${T(ptT(...s.P1))} and ${T(ptT(...s.P2))}: same ${T(Y)}. Subtract the ${T(X)}’s, ${word}: ${T(`${minus(b, a)}=${diff}`)}. The <b>same</b> as the count.`,
          run: async (c) => {
            G.remove(...hops); hops = [];
            const [nx, ny] = hopSide(s), at = (t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
            const ci2 = Hz ? 0 : 1, m = [0.5, 0.25, 0.75].map(at).find((q) => Math.abs(q[ci2]) >= 1.2) || at(0.5);
            s.pill = G.label(...m, T(String(len)), { cls: 'u6l2-pill', color: col, dx: nx * 24, dy: ny * 24 });
            G.remove(s.pA.label, s.pB.label);
            const lA = G.label(...A, T(ptT(...s.P1)), { pos: labPos(s, s.P1), cls: 'bk-ptlab', gap: 6 }), lB = G.label(...B, T(ptT(...s.P2)), { pos: labPos(s, s.P2), cls: 'bk-ptlab', gap: 6 });
            s.pA.label = lA; s.pB.label = lB;
            for (const p of [A, B]) {
              const v = Hz ? p[0] : p[1], ln = G.segment(p, Hz ? [p[0], 0] : [0, p[1]], { color: 'gray', width: 2, dash: '5 5' });
              const pl = G.label(Hz ? p[0] : 0, Hz ? 0 : p[1], T(tn(v)), { cls: 'u6l2-pill', color: col });
              drops.push(ln, pl);
            }
            await Promise.all([pop(c, s.pill), fadeIn(c, lA), fadeIn(c, lB)]);
            for (const e of drops) await (e.classList.contains('bk-curve') ? G.drawIn(e, 300, c) : pop(c, e, 260));
            cells[2].innerHTML = T(neg ? subT : `${subT}\\ \\checkmark`); if (neg) cells[2].classList.add('u6l2-cr');
            await show(c, cells[2]);
          }
        });
        if (neg) steps.push({
          cap: `A length can’t be negative. Take the size: ${T(`|${tn(diff)}|=${len}`)}, just like the count. The sign only told us <b>which way</b> we walked.`,
          run: async (c) => { cells[2].classList.remove('u6l2-cr'); cells[2].innerHTML = T(`|${minus(b, a)}|=|${tn(diff)}|=${len}\\ \\checkmark`); await pulse(c, cells[2], 1.06); }
        });
      });
      const kinds = [...new Set(segs.map((s) => s.H))];
      steps.push({
        cap: kinds[0] ? `No grid? Subtract. <b>Horizontal:</b> length ${T('=|x_2-x_1|')}. The ${T('y')}-coordinates play no part.` : `<b>Vertical:</b> length ${T('=|y_2-y_1|')}. The ${T('x')}-coordinates play no part. Same idea, turned ${T('90^\\circ')}.`,
        run: async (c) => {
          G.remove(...drops); drops = [];
          const r = h('div', 'u6l2-rule', kinds.map((Hz) => `<div class="${Hz ? 'u6l2-ch' : 'u6l2-cv'}"><b>${Hz ? 'Horizontal' : 'Vertical'}:</b> length ${T(Hz ? '=|x_2-x_1|' : '=|y_2-y_1|')}</div>`).join(''));
          P.appendChild(r); await pop(c, r);
        }
      });
      return steps;
    }
  };
}
const lengthsH = lengthsDef(['demoH', 'ex1', 'ex2a']);
const lengthsV = lengthsDef(['demoV', 'ex3', 'ex4a']);

/* ======================================================================================
 * Explainer 4: why the absolute value — walk both ways on a number line
 * ====================================================================================== */
const AV = {
  ex2a: { label: 'Example 2(a): T and U', a: 8, b: -6, na: 'T', nb: 'U', unit: 'units', what: `${T('T(8,\\ -3)')} and ${T('U(-6,\\ -3)')} share ${T('y=-3')}, so only the ${T('x')}’s matter` },
  big: { label: 'The big one: −3 and 5', a: 5, b: -3, na: '5', nb: '-3', unit: 'floors', what: 'Floors 5 and −3 (turned on their side)' },
  sub: { label: 'Subway: Arena and Airport', a: 3, b: -6, na: '\\text{Arena}', nb: '\\text{Airport}', unit: 'blocks', what: 'The Arena is at 3 and the Airport at −6' }
};
const absVal = {
  title: 'Both ways: the same distance',
  height: 380,
  minW: 900,
  choices: Object.keys(AV).map((k) => ({ v: k, label: AV[k].label })),
  intro: 'Subtract one way, then the other. What changes? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = AV[k], { a, b } = d, W = ex.W, len = Math.abs(a - b), lo = Math.min(a, b) - 2, hi = Math.max(a, b) + 2;
    const N = new NumberLine(stage, { x: 30, y: 130, width: W - 60, height: 110, min: lo, max: hi, step: 1 });
    const pa = N.point(a, { color: BLUE, label: T(d.na) }), pb = N.point(b, { color: BLUE, label: T(d.nb) });
    [pa, pb].forEach(hide);
    const L1 = hide(lab(stage, W / 2, 34, '', 'u6l2-avl')), L2 = hide(lab(stage, W / 2, 300, '', 'u6l2-avl')), L3 = hide(lab(stage, W / 2, 352, '', 'u6l2-avl u6l2-avbig'));
    return [
      { cap: `${d.what}: ${T(String(a))} and ${T(String(b))}.`, run: async (c) => { await pop(c, pa); await pop(c, pb); } },
      { cap: `Walk from ${T(String(a))} to ${T(String(b))}: ${len} steps to the <b>left</b>. Subtracting that way: ${T(`${minus(b, a)}=${b - a}`)}. The minus sign means <b>left</b>.`,
        run: async (c) => { await N.hop(c, a, b, { label: T(String(b - a)), below: true, color: RED, height: 50 }); L2.innerHTML = T(`${minus(b, a)}=${b - a}`); L2.style.color = RED; await show(c, L2); } },
      { cap: `Walk back from ${T(String(b))} to ${T(String(a))}: ${len} steps to the <b>right</b>. ${T(`${minus(a, b)}=${a - b}`)}.`,
        run: async (c) => { await N.hop(c, b, a, { label: T('+' + (a - b)), color: GRN, height: 50 }); L1.innerHTML = T(`${minus(a, b)}=${a - b}`); L1.style.color = GRN; await show(c, L1); } },
      { cap: `Same trip, same distance: <b>${len} ${d.unit}</b>. The absolute value keeps the size and drops the sign: ${T(`|${b - a}|=|${a - b}|=${len}`)}.`,
        run: async (c) => { L3.innerHTML = T(`|${b - a}|=|${a - b}|=${len}`) + ` ${d.unit}`; await pop(c, L3); } }
    ];
  }
};

/* ======================================================================================
 * Explainer 5: coordinates with a letter — the segment slides, the length stays
 * ====================================================================================== */
const SL = {
  ex2b: { label: 'Example 2(b): V and W', v: 'k', o: 'h', A: ['V', -4], B: ['W', 7], fixed: 'm', tries: [0, 5, -3], min: -8, max: 13 },
  ex4b: { label: 'Example 4(b): M and N', v: 'n', o: 'v', A: ['M', -5], B: ['N', 9], fixed: 'h', tries: [0, 3, -4], min: -10, max: 13 }
};
const slide = {
  title: 'Try some numbers for the letter',
  height: 470,
  minW: 920,
  choices: Object.keys(SL).map((k) => ({ v: k, label: SL[k].label })),
  intro: (k) => { const d = SL[k], L = d.v; return `${T(`${d.A[0]}${d.o === 'h' ? `(${L}${d.A[1]},\\ ${d.fixed})` : `(${d.fixed},\\ ${L}${d.A[1]})`}`)} and ${T(`${d.B[0]}${d.o === 'h' ? `(${L}+${d.B[1]},\\ ${d.fixed})` : `(${d.fixed},\\ ${L}+${d.B[1]})`}`)}. How long? Press <b>Next</b>.`; },
  make(stage, k, ex) {
    const d = SL[k], L = d.v, hz = d.o === 'h', W = ex.W, H = ex.def.height, [nA, oa] = d.A, [nB, ob] = d.B, len = ob - oa;
    const svg = svgEl('svg', { width: W, height: H, class: 'u6l2-svg' }); svg.style.position = 'absolute'; svg.style.left = '0px'; svg.style.top = '0px'; stage.appendChild(svg);
    // the ruler: horizontal along the top half, or vertical on the left
    const R = hz ? { x0: 40, x1: W - 40, y: 96 } : { x: 120, y0: H - 30, y1: 52 };
    const span = d.max - d.min, toPx = (v) => (hz ? R.x0 + (v - d.min) / span * (R.x1 - R.x0) : R.y0 - (v - d.min) / span * (R.y0 - R.y1));
    const at = (v) => (hz ? [toPx(v), R.y] : [R.x, toPx(v)]);
    const lnA = hz ? { x1: R.x0 - 14, x2: R.x1 + 14, y1: R.y, y2: R.y } : { x1: R.x, x2: R.x, y1: R.y0 + 14, y2: R.y1 - 14 };
    svgEl('line', Object.assign({ stroke: INK, 'stroke-width': 2.5 }, lnA), svg);
    for (let v = d.min; v <= d.max; v++) {
      const [px, py] = at(v), big = v % 2 === 0;
      svgEl('line', hz ? { x1: px, x2: px, y1: py - (big ? 8 : 5), y2: py + (big ? 8 : 5), stroke: INK, 'stroke-width': 1.5 } : { x1: px - (big ? 8 : 5), x2: px + (big ? 8 : 5), y1: py, y2: py, stroke: INK, 'stroke-width': 1.5 }, svg);
      if (big) lab(stage, hz ? px : px - 26, hz ? py + 24 : py, T(tn(v)), 'u6l2-rnum');
    }
    lab(stage, ...(hz ? [R.x1 + 26, R.y] : [R.x, R.y1 - 30]), T(hz ? 'x' : 'y'), 'u6l2-rnum u6l2-raxis');
    const col = hz ? AMB : PUR;
    const seg = svgEl('line', { stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round' }, svg), dA = svgEl('circle', { r: 8, fill: BLUE }, svg), dB = svgEl('circle', { r: 8, fill: BLUE }, svg);
    const lA = lab(stage, 0, 0, '', 'u6l2-plab'), lB = lab(stage, 0, 0, '', 'u6l2-plab'), lL = lab(stage, 0, 0, '', 'u6l2-pill u6l2-lenl');
    lL.style.color = col;
    let kv = d.tries[0];
    const put = (kk) => {
      const pa = at(kk + oa), pb = at(kk + ob);
      seg.setAttribute('x1', pa[0]); seg.setAttribute('y1', pa[1]); seg.setAttribute('x2', pb[0]); seg.setAttribute('y2', pb[1]);
      dA.setAttribute('cx', pa[0]); dA.setAttribute('cy', pa[1]); dB.setAttribute('cx', pb[0]); dB.setAttribute('cy', pb[1]);
      const off = hz ? [0, -34] : [52, 0];
      Object.assign(lA.style, { left: pa[0] + off[0] + 'px', top: pa[1] + off[1] + 'px' }); Object.assign(lB.style, { left: pb[0] + off[0] + 'px', top: pb[1] + off[1] + 'px' });
      const r = Math.round(kk);
      lA.innerHTML = T(`${nA}\\ (${tn(r + oa)})`); lB.innerHTML = T(`${nB}\\ (${tn(r + ob)})`);
      const m = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2]; Object.assign(lL.style, { left: m[0] + (hz ? 0 : 62) + 'px', top: m[1] + (hz ? -40 : 0) + 'px' }); lL.innerHTML = T(String(len));
    };
    [seg, dA, dB, lA, lB, lL].forEach(hide);
    // the table of tries
    const P = panel(stage, hz ? 120 : 330, hz ? 160 : 20, hz ? W - 240 : W - 350, hz ? H - 170 : H - 40, 'Try a number for ' + T(L));
    const tb = h('div', 'u6l2-tt', `<div class="u6l2-cth">${T(L)}</div><div class="u6l2-cth">${T(nA)}</div><div class="u6l2-cth">${T(nB)}</div><div class="u6l2-cth">length</div>`); P.appendChild(tb);
    const row = (kk) => [T(tn(kk)), T(tn(kk + oa)), T(tn(kk + ob)), T(`${tn(kk + ob)}-${par(kk + oa)}=${len}`)].map((s) => { const e = hide(h('div', 'u6l2-ttc', s)); tb.appendChild(e); return e; });
    const rows = d.tries.map(row);
    const alg = hide(line(P, T(`|(${L}+${ob})-(${L}${oa})|=|${L}+${ob}-${L}+${-oa}|=|${len}|=${len}`), 'u6l2-boxed'));
    const slideTo = (c, k2) => tween(c, 1100, (t) => put(kv + (k2 - kv) * t)).then(() => { kv = k2; put(k2); });
    const showRow = async (c, r) => { for (const e of r) await show(c, e, 220); };
    const coord = hz ? 'x' : 'y', [t0, t1, t2] = d.tries;
    return [
      { cap: `Both endpoints have ${T(`${hz ? 'y' : 'x'}=${d.fixed}`)}, so the segment is <b>${hz ? 'horizontal' : 'vertical'}</b>. Its length comes from the ${T(coord)}’s: ${T(`${L}${oa}`)} and ${T(`${L}+${ob}`)}.`,
        run: async (c) => { put(kv); await Promise.all([seg, dA, dB, lA, lB].map((e) => appear(c, e, 350))); } },
      { cap: `Try ${T(`${L}=${t0}`)}: the ${T(coord)}’s are ${T(tn(t0 + oa))} and ${T(tn(t0 + ob))}. Length ${T(`${tn(t0 + ob)}-${par(t0 + oa)}=${len}`)}.`,
        run: async (c) => { await pop(c, lL); await showRow(c, rows[0]); } },
      { cap: `Try ${T(`${L}=${t1}`)}: the whole segment slides ${hz ? 'right' : 'up'}. ${T(`${tn(t1 + ob)}-${par(t1 + oa)}=${len}`)} again!`,
        run: async (c) => { await slideTo(c, t1); await showRow(c, rows[1]); } },
      { cap: `Try ${T(`${L}=${tn(t2)}`)}: it slides ${hz ? 'left' : 'down'}. Still ${T(`${tn(t2 + ob)}-${par(t2 + oa)}=${len}`)}.`,
        run: async (c) => { await slideTo(c, t2); await showRow(c, rows[2]); } },
      { cap: `With the letter: ${T(`(${L}+${ob})-(${L}${oa})=${L}+${ob}-${L}+${-oa}=${len}`)}. The ${T(L)}’s cancel, so ${T(`${nA}${nB}=${len}`)} units, whatever ${T(L)} is.`,
        run: (c) => pop(c, alg) }
    ];
  }
};

/* ======================================================================================
 * Explainer 6: same x or same y? Find the match first
 * ====================================================================================== */
const WW = {
  a: { label: `${T('E(-3,\\ 4)')}, ${T('F(6,\\ 4)')}`, A: ['E', -3, 4], B: ['F', 6, 4] },
  b: { label: `${T('G(2,\\ -5)')}, ${T('H(2,\\ 7)')}`, A: ['G', 2, -5], B: ['H', 2, 7] },
  c: { label: `${T('J(-7,\\ -1)')}, ${T('K(-7,\\ 8)')}`, A: ['J', -7, -1], B: ['K', -7, 8] },
  d: { label: `${T('L(10,\\ -6)')}, ${T('M(-4,\\ -6)')}`, A: ['L', 10, -6], B: ['M', -4, -6] }
};
const whichWay = {
  title: 'Find the coordinate that matches',
  height: 400,
  minW: 900,
  choices: Object.keys(WW).map((k) => ({ v: k, label: WW[k].label })),
  intro: 'Two endpoints. Which coordinate is the same? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = WW[k], [nA, xA, yA] = d.A, [nB, xB, yB] = d.B, hz = yA === yB, W = ex.W;
    const card = (n, x, y, top) => {
      const e = add(stage, h('div', 'u6l2-pcard', `<span class="u6l2-pn">${T(n)}</span><span class="u6l2-pp">(</span><span class="u6l2-px">${T(tn(x))}</span><span class="u6l2-pp">,</span><span class="u6l2-py">${T(tn(y))}</span><span class="u6l2-pp">)</span>`), 40, top);
      return { el: e, x: e.querySelector('.u6l2-px'), y: e.querySelector('.u6l2-py') };
    };
    const cA = card(nA, xA, yA, 40), cB = card(nB, xB, yB, 130);
    const verdict = hide(add(stage, h('div', 'u6l2-verdict ' + (hz ? 'u6l2-ch' : 'u6l2-cv'), `same ${T(hz ? 'y' : 'x')} → <b>${hz ? 'horizontal' : 'vertical'}</b>`), 40, 230));
    const a = hz ? xA : yA, b = hz ? xB : yB, big = Math.max(a, b), small = Math.min(a, b), len = big - small, cn = hz ? 'x' : 'y';
    const calc = hide(add(stage, h('div', 'u6l2-calc', `${T(`${nA}${nB}=|${big}-${par(small)}|=${len}`)}`), 40, 310));
    const win = fitWin([[xA, yA], [xB, yB]], 400, 380, 1.5);
    const G = new Graph(stage, Object.assign({ x: W - 420, y: 8, width: 400, height: 384, xlabels: 2, ylabels: 2 }, win));
    let seg, pA, pB;
    return [
      { cap: `${T(ptT(nA, xA, yA))} and ${T(ptT(nB, xB, yB))}. Compare the ${T('x')}’s, then the ${T('y')}’s.`, run: (c) => Promise.all([pop(c, cA.el), pop(c, cB.el, 380, { delay: 150 })]) },
      { cap: `The ${T(hz ? 'y' : 'x')}’s match (${T(tn(hz ? yA : xA))} and ${T(tn(hz ? yB : xB))}), so the segment is <b>${hz ? 'horizontal' : 'vertical'}</b>.`,
        run: async (c) => {
          [cA, cB].forEach((q) => { q[hz ? 'y' : 'x'].classList.add('u6l2-match'); q[hz ? 'x' : 'y'].classList.add(hz ? 'u6l2-useh' : 'u6l2-usev'); });
          await pop(c, verdict);
          seg = G.segment([xA, yA], [xB, yB], { color: hz ? AMB : PUR, width: 5 }); pA = G.point(xA, yA, { color: BLUE, label: T(nA), pos: hz ? 'n' : 'e' }); pB = G.point(xB, yB, { color: BLUE, label: T(nB), pos: hz ? 'n' : 'e' });
          await G.drawIn(seg, 600, c); await Promise.all([G.reveal(pA, c), G.reveal(pB, c)]);
        } },
      { cap: `The <b>other</b> coordinates, the ${T(cn)}’s, give the length. Bigger minus smaller: ${T(`${big}-${par(small)}=${len}`)}.`,
        run: async (c) => { await pop(c, calc); const m = [(xA + xB) / 2, (yA + yB) / 2]; const pl = G.label(...m, T(String(len)), { cls: 'u6l2-pill', color: hz ? AMB : PUR, dx: hz ? 0 : 26, dy: hz ? -24 : 0 }); await pop(c, pl); } }
    ];
  }
};

/* ======================================================================================
 * Explainer 7: perimeter — walk around the rectangle
 * ====================================================================================== */
const PER = {
  demo: { label: 'Demo: sides 6 and 4', V: [['A', -2, -1], ['B', 4, -1], ['C', 4, 3], ['D', -2, 3]] },
  ex5: { label: 'Example 5 check', V: [['A', -4, -2], ['B', 5, -2], ['C', 5, 4], ['D', -4, 4]] }
};
const perimeter = {
  title: 'Walk all the way around',
  height: 460,
  minW: 920,
  choices: Object.keys(PER).map((k) => ({ v: k, label: PER[k].label })),
  intro: 'A rectangle on a grid: every side is horizontal or vertical. Press <b>Next</b>.',
  make(stage, k, ex) {
    const [A, B, C, D] = PER[k].V, W = ex.W, H = ex.def.height;
    const G = new Graph(stage, { x: 8, y: 6, width: 448, height: 448, xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2 });
    const pts = [A, B, C, D].map((p) => p.slice(1));
    const poly = G.polyline(pts, { closed: true, color: BLUE, width: 4 });
    const POS = ['s', 's', 'n', 'n'];
    [A, B, C, D].forEach((p, i) => G.point(p[1], p[2], { color: BLUE, label: T(ptT(...p)), pos: POS[i], labelColor: INK }));
    const hor = Math.abs(B[1] - A[1]), ver = Math.abs(C[2] - B[2]), per = 2 * hor + 2 * ver;
    const P = panel(stage, 476, 16, W - 486, H - 32, 'The four sides');
    const Ls = [
      line(P, `<span class="u6l2-ch">${T(`AB=|${B[1]}-${par(A[1])}|=${hor}`)}</span>`),
      line(P, `<span class="u6l2-cv">${T(`BC=|${C[2]}-${par(B[2])}|=${ver}`)}</span>`),
      line(P, `<span class="u6l2-ch">${T(`DC=${hor}`)}</span>, <span class="u6l2-cv">${T(`AD=${ver}`)}</span>`),
      line(P, T(`P=2(${hor})+2(${ver})`)), line(P, T(`P=${2 * hor}+${2 * ver}=${per}`) + ' units', 'u6l2-boxed')
    ];
    Ls.forEach(hide);
    const pill = (p, q, v, col, dx, dy) => G.label((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, T(String(v)), { cls: 'u6l2-pill', color: col, dx, dy });
    let trail;
    return [
      { cap: `Rectangle ${T('ABCD')}. Its sides are horizontal or vertical, so each length is one subtraction.`, run: (c) => G.drawIn(poly, 900, c) },
      { cap: `${T('\\overline{AB}')}: both ${T(`y=${tn(A[2])}`)}, so horizontal. ${T(`AB=|${B[1]}-${par(A[1])}|=${hor}`)}.`,
        run: async (c) => { await pop(c, pill(pts[0], pts[1], hor, AMB, 0, 24)); await show(c, Ls[0]); } },
      { cap: `${T('\\overline{BC}')}: both ${T(`x=${tn(B[1])}`)}, so vertical. ${T(`BC=|${C[2]}-${par(B[2])}|=${ver}`)}.`,
        run: async (c) => { await pop(c, pill(pts[1], pts[2], ver, PUR, 26, 0)); await show(c, Ls[1]); } },
      { cap: `Opposite sides of a rectangle are equal: ${T(`DC=${hor}`)} and ${T(`AD=${ver}`)}.`,
        run: async (c) => { await Promise.all([pop(c, pill(pts[3], pts[2], hor, AMB, 0, -24)), pop(c, pill(pts[0], pts[3], ver, PUR, -26, 0))]); await show(c, Ls[2]); } },
      { cap: `Walk all the way around: ${T(`P=2(${hor})+2(${ver})=${2 * hor}+${2 * ver}=${per}`)} units. Check: ${T(`${hor}+${ver}+${hor}+${ver}=${per}`)} ✓`,
        run: async (c) => { trail = G.polyline(pts.concat([pts[0]]), { color: RED, width: 3, dash: '8 6' }); await G.drawIn(trail, 1600, c); await show(c, Ls[3]); await pop(c, Ls[4]); } }
    ];
  }
};

mountWarm();
mountStatics();
export const explainers = mountExplainers({ segIntro, lengthsH, absVal, slide, lengthsV, whichWay, perimeter });

/* ============ Stand Up Break! — lengths of horizontal and vertical segments at the whiteboards (lessons/js/standup.js) ============ */
const suL = () => 'ABCDEFGHJKMNPQRSTUVW';
function suSeg(r, lim, nz) { // two endpoints that share x or y; at least one negative coordinate when nz
  const hz = r.chance(0.5), names = suL(), i = r.int(0, names.length - 2), nA = names[i], nB = names[i + 1];
  let a, b, s;
  do { a = r.int(-lim, lim); b = r.int(-lim, lim); s = r.int(-lim, lim); } while (a === b || Math.abs(a - b) < 3 || (nz && a >= 0 && b >= 0));
  const A = hz ? [a, s] : [s, a], B = hz ? [b, s] : [s, b], big = Math.max(a, b), small = Math.min(a, b);
  return { hz, nA, nB, A, B, len: big - small, ans: [`\\text{same } ${hz ? 'y' : 'x'} \\Rightarrow \\text{${hz ? 'horizontal' : 'vertical'}}`, `${nA}${nB}=|${big}-${par(small)}|=${big - small}`] };
}
const suTo = (a, b) => `\\begin{array}{c}${a}\\ \\text{to}\\\\ ${b}\\end{array}`;
standup('u6l2', {
  intro: 'At your whiteboard station: find the coordinate that matches, then subtract the other two. A length is never negative.',
  levels: {
    BEG: (r) => { const s = suSeg(r, 9, true); return { text: 'Find the length of the segment.', q: suTo(ptT(s.nA, ...s.A), ptT(s.nB, ...s.B)), a: s.ans }; },
    PRG: (r) => {
      if (r.chance(0.6)) { const s = suSeg(r, 60, true); return { text: 'Is the segment horizontal or vertical? Find its length.', q: suTo(ptT(s.nA, ...s.A), ptT(s.nB, ...s.B)), a: s.ans }; }
      const L = r.pick(['k', 'm', 'n', 'p', 't']), p = r.int(2, 9), q = r.int(2, 12), c0 = r.int(-6, 6), hz = r.chance(0.5);
      const A = hz ? [`${L}-${p}`, c0] : [c0, `${L}-${p}`], B = hz ? [`${L}+${q}`, c0] : [c0, `${L}+${q}`];
      return { text: 'Find the length of the segment.', q: suTo(`R${pairTex(...A)}`, `S${pairTex(...B)}`),
        a: [`\\text{same } ${hz ? 'y' : 'x'} \\Rightarrow \\text{${hz ? 'horizontal' : 'vertical'}}`, `RS=|(${L}+${q})-(${L}-${p})|`, `=|${L}+${q}-${L}+${p}|=${p + q}`] };
    },
    MAS: (r) => {
      if (r.chance(0.6)) { // a rectangle from its four vertices
        let x1, x2, y1, y2; do { x1 = r.int(-9, 4); x2 = r.int(x1 + 3, 10); y1 = r.int(-9, 3); y2 = r.int(y1 + 2, 9); } while (x1 >= 0 && y1 >= 0);
        const w = x2 - x1, hh = y2 - y1;
        return { text: 'A rectangle has these vertices. Find its perimeter.', q: `\\begin{array}{ll}${ptT('A', x1, y1)}, & ${ptT('B', x2, y1)},\\\\ ${ptT('C', x2, y2)}, & ${ptT('D', x1, y2)}\\end{array}`,
          a: [`AB=|${x2}-${par(x1)}|=${w},\\quad BC=|${y2}-${par(y1)}|=${hh}`, `P=2(${w})+2(${hh})=${2 * w + 2 * hh}\\text{ units}`] };
      }
      const s1 = suSeg(r, 25, true), s2 = suSeg(r, 25, true);
      const n1 = 'AB', n2 = 'CD', more = s1.len > s2.len ? n1 : s2.len > s1.len ? n2 : null;
      return { text: 'Which segment is longer, and by how many units?', q: `\\begin{array}{l}${ptT('A', ...s1.A)}\\text{ to }${ptT('B', ...s1.B)}\\\\ ${ptT('C', ...s2.A)}\\text{ to }${ptT('D', ...s2.B)}\\end{array}`,
        a: [`${n1}=${s1.len},\\quad ${n2}=${s2.len}`, more ? `${more}\\text{ is longer by }${Math.abs(s1.len - s2.len)}\\text{ units}` : '\\text{same length}'] };
    }
  }
});
