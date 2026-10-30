/* Math 15 · Unit 6 · Lesson 9 — Parallel and Perpendicular Lines.
 * The Pick-Up Sticks warm-up (a square pegboard: count, make longer, check the square corners), the static figures
 * (worked demonstrations, Examples 1 and 3), the explainers:
 *   spin (turn a line until it is parallel, then perpendicular), translate (parallel = a slid copy of one slope triangle),
 *   meet (make them longer: equal slopes never meet; different slopes cross, even far away), rotate (the slope triangle
 *   turned 90° about the shared point: rise and run swap, one sign flips), flipSign (parallel and perpendicular slopes from
 *   one slope), perpTest (multiply the slopes: −1 or not), classify (parallel / perpendicular / neither flowchart),
 *   dialK (a missing number in a slope),
 * the Stand Up Break and the Math History box (Recorde's equals sign).
 * Colours: run amber (horizontal), rise purple (vertical); first segment blue, second red; parallel green, perpendicular red.
 * Explainers adapted from Math 10C u6l3 (same engine). */
import {
  h, tex, add, box, Graph, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, rightMark, angleArc, drawIn, COLORS, col
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = COLORS.amber, PUR = COLORS.purple, BLUE = COLORS.blue, RED = COLORS.red, GRN = COLORS.green, INK = COLORS.ink;

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
const par = (v) => (v < 0 ? `(${v})` : `${v}`);
/** slope working from P to Q: sub (the substitution), raw (rise/run), val (simplified) */
function slopeOf(P, Q) {
  const rise = Q[1] - P[1], run = Q[0] - P[0];
  const sub = `\\dfrac{${Q[1]}-${par(P[1])}}{${Q[0]}-${par(P[0])}}`, raw = `\\dfrac{${rise}}{${run}}`, val = frac(rise, run);
  return { rise, run, sub, raw, val, m: rise / run, all: `${sub}=${raw}${raw === val ? '' : '=' + val}` };
}
const prodTex = (a, b) => `${a}\\times${String(b).startsWith('-') ? `\\left(${b}\\right)` : b}`;
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u6l9-panel ' + cls, title ? `<div class="u6l9-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l9-line ' + cls, html); p.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const hid = (el) => { if (el) el.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; return el; };
/** a Graph whose x and y units are the same size (so right angles look right) */
function sqG(stage, x, y, win, unit, o = {}) {
  const room = o.numbers !== false || (o.xtitle ?? 'x') !== '', l = room && win.xmin >= 0 ? 42 : 18, b = room && win.ymin >= 0 ? 34 : 18;
  return new Graph(stage, Object.assign({ x, y, width: Math.round((win.xmax - win.xmin) * unit) + l + 18, height: Math.round((win.ymax - win.ymin) * unit) + 18 + b }, win, o));
}
const dOf = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
function pth(parent, pts, color, o = {}) {
  const p = svgEl('path', { class: 'bk-stroke', d: dOf(pts), fill: 'none', stroke: color, 'stroke-width': o.w || 5, 'stroke-linecap': 'round' }, parent);
  if (o.dash) p.setAttribute('stroke-dasharray', o.dash);
  return p;
}
const ptLab = (n, x, y) => T(`${n}(${x},\\ ${y})`);
/** a slope triangle from P to Q: run (amber) along P's row, then rise (purple) up/down to Q. o: { seg, runLab, riseLab, hidden, fill } */
function tri(G, P, Q, o = {}) {
  const C = [Q[0], P[1]], p = G.toPx(...P), cc = G.toPx(...C), q = G.toPx(...Q);
  const g = svgEl('g', { class: 'u6l9-tri' }, o.parent || G.layers.data);
  g.style.transformBox = 'view-box'; g.style.transformOrigin = '0px 0px'; // blocks.css centres g transforms; rotate about a graph point instead
  const fill = svgEl('path', { d: dOf([p, cc, q]) + 'Z', fill: o.fill || PUR, 'fill-opacity': 0.09, stroke: 'none' }, g);
  const seg = o.seg ? pth(g, [p, q], col(o.seg), { w: 4.5 }) : null;
  const run = pth(g, [p, cc], AMB), rise = pth(g, [cc, q], PUR);
  const rn = Q[0] - P[0], rs = Q[1] - P[1];
  const rA = o.runAt ?? 0.5, sA = o.riseAt ?? 0.5;
  const rl = o.runLab === false ? null : G.label(P[0] + (C[0] - P[0]) * rA, P[1], o.runLab || T(`\\text{run}=${rn}`), { pos: o.runPos || (rs >= 0 ? 's' : 'n'), cls: 'bk-ptlab u6l9-runlab', gap: 7 });
  const sl = o.riseLab === false ? null : G.label(C[0], C[1] + (Q[1] - C[1]) * sA, o.riseLab || T(`\\text{rise}=${rs}`), { pos: o.risePos || (rn >= 0 ? 'e' : 'w'), cls: 'bk-ptlab u6l9-riselab', gap: 7 });
  const t = { g, fill, seg, run, rise, rl, sl, P, Q, C, labs: [rl, sl].filter(Boolean) };
  if (o.hidden !== false) [fill, seg, run, rise, rl, sl].forEach(hid);
  return t;
}
async function showTri(c, t, ms = 420) {
  if (t.seg) { unhide(t.seg); await drawIn(t.seg, ms, c); }
  unhide(t.fill); await appear(c, t.fill, 250);
  unhide(t.run); await drawIn(t.run, ms, c); if (t.rl) { unhide(t.rl); await fadeIn(c, t.rl, 250); }
  unhide(t.rise); await drawIn(t.rise, ms, c); if (t.sl) { unhide(t.sl); await fadeIn(c, t.sl, 250); }
}
const dropTri = (t) => { if (!t) return; t.g.remove(); t.labs.forEach((l) => l.remove()); };
const pt = (G, n, x, y, pos, o = {}) => G.point(x, y, Object.assign({ color: INK, label: o.name ? T(n) : ptLab(n, x, y), pos }, o));
async function showPt(c, G, p) { unhide(p); if (p.label) unhide(p.label); await G.reveal(p, c); }
const hidPt = (p) => { hid(p); if (p.label) hid(p.label); return p; };
/** where line P1Q1 meets line P2Q2 */
function meet(P1, Q1, P2, Q2) {
  const d1 = [Q1[0] - P1[0], Q1[1] - P1[1]], d2 = [Q2[0] - P2[0], Q2[1] - P2[1]], den = d1[0] * d2[1] - d1[1] * d2[0];
  const t = ((P2[0] - P1[0]) * d2[1] - (P2[1] - P1[1]) * d2[0]) / den;
  return [P1[0] + t * d1[0], P1[1] + t * d1[1]];
}
/** the right-angle square at graph point V between graph directions d1 and d2 */
function rmark(G, V, d1, d2, s = 16) {
  const v = G.toPx(...V), a = G.toPx(V[0] + d1[0], V[1] + d1[1]), b = G.toPx(V[0] + d2[0], V[1] + d2[1]);
  return rightMark(G.layers.top, v, a, b, s, { color: INK, width: 2.5 });
}
/** the angle (degrees) between graph directions d1 and d2 */
const angDeg = (d1, d2) => Math.acos((d1[0] * d2[0] + d1[1] * d2[1]) / Math.hypot(...d1) / Math.hypot(...d2)) * 180 / Math.PI;
const pstamp = async (c, P, text, ok) => { const s = stamp(P, text, { ok }); s.classList.add('u6l9-pstamp'); await stampIn(c, s); };

/* =============================== warm-up: Pick-Up Sticks =============================== */
// pegs are 1 unit apart, (0, 0) at the bottom-left peg; [name, from, to, colour, label at, label pos]
const STICKS = {
  A: [[0, 1], [6, 3], '#d23c32', 0.5, 's'], G: [[0, 3], [5, 5], '#28964a', 0.55, 's'], B: [[1, 6], [4, 7], '#2864c8', 0.5, 'n'],
  C: [[8, 1], [12, 7], '#e6821a', 0.8, 'e'], D: [[8, 6], [12, 3], '#823caa', 0.15, 's'], E: [[15, 0], [21, 4], '#148c96', 0.55, 's'],
  F: [[16, 8], [18, 5], '#965a28', 0.4, 'e']
};
function mountBoard() {
  const host = document.getElementById('u6l9-board'); if (!host) return;
  const u = 24.5, win = { xmin: -0.8, xmax: 21.8, ymin: -0.8, ymax: 8.8 };
  const G = new Graph(host, Object.assign({ width: Math.round(22.6 * u) + 12, height: Math.round(9.6 * u) + 12, grid: false, axes: false, numbers: false, xtitle: '', ytitle: '', pad: 6 }, win));
  const [x0, y0] = G.toPx(-0.6, -0.6), [x1, y1] = G.toPx(21.6, 8.6);
  svgEl('rect', { x: x0, y: y1, width: x1 - x0, height: y0 - y1, rx: 8, fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 2 }, G.layers.bg);
  for (let i = 0; i <= 21; i++) for (let j = 0; j <= 8; j++) { const [px, py] = G.toPx(i, j); svgEl('circle', { cx: px, cy: py, r: 2.6, fill: '#d6a43c' }, G.layers.bg); }
  const sg = svgEl('g', { class: 'u6l9-sticks' }, G.layers.top);
  for (const [n, [a, b, fc, at, pos]] of Object.entries(STICKS)) {
    const pa = G.toPx(...a), pb = G.toPx(...b);
    svgEl('line', { x1: pa[0], y1: pa[1], x2: pb[0], y2: pb[1], stroke: fc, 'stroke-width': 9, 'stroke-linecap': 'round' }, sg);
    const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]), ux = (pb[0] - pa[0]) / L, uy = (pb[1] - pa[1]) / L, e = 10;
    svgEl('line', { x1: pa[0], y1: pa[1], x2: pa[0] + ux * e, y2: pa[1] + uy * e, stroke: '#1e2d46', 'stroke-width': 9 }, sg);
    svgEl('line', { x1: pb[0], y1: pb[1], x2: pb[0] - ux * e, y2: pb[1] - uy * e, stroke: '#1e2d46', 'stroke-width': 9 }, sg);
    const lab = G.label(a[0] + (b[0] - a[0]) * at, a[1] + (b[1] - a[1]) * at, n, { pos, cls: 'u6l9-stlab', gap: 9 });
    lab.style.color = fc; lab.style.borderColor = fc;
  }
  const note = document.getElementById('u6l9-wnote');
  const setNote = (s) => { if (note) note.innerHTML = s; };
  const S = (n) => STICKS[n];
  const toggles = {};
  const toggle = (id, build) => {
    const b = document.getElementById(id); if (!b) return;
    b.addEventListener('click', async () => {
      if (toggles[id]) { toggles[id](); toggles[id] = null; b.classList.remove('on'); setNote(''); return; }
      b.classList.add('on'); toggles[id] = await build(liveCtx());
    });
  };
  toggle('u6l9-wcount', async (c) => {
    const ts = [tri(G, ...S('A').slice(0, 2), { runLab: T('6'), riseLab: T('2') }), tri(G, ...S('B').slice(0, 2), { runLab: T('3'), riseLab: T('1') }),
      tri(G, ...S('G').slice(0, 2), { runLab: T('5'), riseLab: T('2'), runPos: 'n' })];
    setNote(`A: up 2, across 6 &nbsp;·&nbsp; B: up 1, across 3 &nbsp;·&nbsp; G: up 2, across 5`);
    for (const t of ts) await showTri(c, t, 300);
    return () => ts.forEach(dropTri);
  });
  toggle('u6l9-wlong', async (c) => {
    const ls = ['A', 'B', 'G'].map((n) => G.line(S(n)[0], S(n)[1], { color: S(n)[2], width: 2.5, dash: '9 7', arrows: false }));
    setNote('A and B stay the <b>same distance apart</b> forever. G and A get closer to the left: they cross 30 pegs left of the board.');
    await Promise.all(ls.map((l) => G.drawIn(l, 900, c)));
    return () => G.remove(...ls);
  });
  toggle('u6l9-wsq', async (c) => {
    const ls = ['C', 'D', 'E', 'F'].map((n) => G.line(S(n)[0], S(n)[1], { color: S(n)[2], width: 2.5, dash: '9 7', arrows: false }));
    await Promise.all(ls.map((l) => G.drawIn(l, 800, c)));
    const X1 = meet(S('C')[0], S('C')[1], S('D')[0], S('D')[1]), X2 = meet(S('E')[0], S('E')[1], S('F')[0], S('F')[1]);
    const v1 = G.toPx(...X1), arc = angleArc(G.layers.top, v1, G.toPx(...S('C')[1]), G.toPx(...S('D')[1]), 24, { color: RED, width: 3 });
    const l1 = G.label(...X1, `≈ 93°`, { pos: 'e', cls: 'bk-ptlab u6l9-redlab', gap: 30 });
    const mk = rmark(G, X2, [-1, 1.5], [1, 2 / 3], 14);
    const l2 = G.label(...X2, `90°`, { pos: 'n', cls: 'bk-ptlab u6l9-oklab', gap: 22 });
    setNote('C and D: about <b>93°</b>, a few degrees off. E and F: exactly <b>90°</b>. Your eyes can’t tell, but the slopes can.');
    await Promise.all([appear(c, arc), fadeIn(c, l1), appear(c, mk), fadeIn(c, l2)]);
    return () => { G.remove(...ls); arc.remove(); mk.remove(); l1.remove(); l2.remove(); };
  });
}

/* =============================== static figures =============================== */
function fig(id, win, unit, segs, pts, extra, o = {}) {
  const host = document.getElementById(id); if (!host) return null;
  const G = sqG(host, null, null, win, unit, Object.assign({ xlabels: 2, ylabels: 2, fontSize: 15 }, o));
  segs.forEach(([a, b, color]) => G.segment(a, b, { color, width: 4 }));
  pts.forEach(([n, x, y, pos]) => pt(G, n, x, y, pos));
  if (extra) extra(G);
  return G;
}
function mountFigures() {
  fig('u6l9-demo2', { xmin: -7, xmax: 6, ymin: -5, ymax: 2 }, 31, [[[-6, -2], [-1, 1], BLUE], [[0, -4], [5, -1], RED]],
    [['A', -6, -2, 's'], ['B', -1, 1, 'n'], ['C', 0, -4, 's'], ['D', 5, -1, 'n']], (G) => {
      G.label(-3.5, -0.5, T('m_{AB}=\\tfrac{3}{5}'), { pos: 'se', cls: 'bk-ptlab u6l9-bluelab', gap: 6 });
      G.label(2.5, -2.5, T('m_{CD}=\\tfrac{3}{5}'), { pos: 'se', cls: 'bk-ptlab u6l9-redlab', gap: 4 });
    });
  fig('u6l9-ex1fig', { xmin: -6, xmax: 5, ymin: -6, ymax: 4 }, 32, [[[-5, -3], [-1, 3], BLUE], [[0, -5], [4, 1], RED]],
    [['P', -5, -3, 's'], ['Q', -1, 3, 'nw'], ['R', 0, -5, 'e'], ['S', 4, 1, 'n']]);
  fig('u6l9-demo3', { xmin: -3, xmax: 6, ymin: -5, ymax: 1 }, 38, [[[-2, -3], [2, 0], BLUE], [[2, 0], [5, -4], RED]],
    [['E', -2, -3, 's'], ['F', 2, 0, 'n'], ['G', 5, -4, 'w']], (G) => {
      rmark(G, [2, 0], [-4, -3], [3, -4], 13);
      G.label(-1, -2.25, T('m_{EF}=\\tfrac{3}{4}'), { pos: 'nw', cls: 'bk-ptlab u6l9-bluelab', gap: 6 });
      G.label(3.5, -2, T('m_{FG}=-\\tfrac{4}{3}'), { pos: 'e', cls: 'bk-ptlab u6l9-redlab', gap: 10 });
    });
  fig('u6l9-ex3fig', { xmin: -6, xmax: 5, ymin: -4, ymax: 2 }, 34, [[[-4, -3], [2, 1], BLUE], [[2, 1], [4, -2], RED]],
    [['M', -4, -3, 's'], ['N', 2, 1, 'n'], ['O', 4, -2, 'w']], (G) => { rmark(G, [2, 1], [-6, -4], [2, -3], 13); });
}

/* =============================== 1. spin: turn a line until it is parallel, then perpendicular =============================== */
const SPIN = {
  half: { label: 'Slope ' + T('\\tfrac12'), P: [-5, -4], Q: [-1, -2], from: 3, parT: [4, 2], perpT: [2, -4], m: '\\dfrac12', mp: '-2', f1: '\\dfrac21', check: '\\dfrac12\\times(-2)=-1' },
  demo: { label: 'Worked demo: ' + T('\\tfrac34'), P: [-5, -4], Q: [-1, -1], from: 4, parT: [4, 3], perpT: [3, -4], m: '\\dfrac34', mp: '-\\dfrac43', f1: '\\dfrac43', check: '\\dfrac34\\times\\left(-\\dfrac43\\right)=-1' },
  zero: { label: 'Slope ' + T('0') + ': the special case', P: [-5, -3], Q: [-1, -3], from: 1, zero: true, m: '0' }
};
const spin = {
  title: 'Turn a line: parallel, then perpendicular',
  height: 470,
  minW: 860,
  choices: Object.keys(SPIN).map((k) => ({ v: k, label: SPIN[k].label })),
  intro: 'The blue segment stays put. The red line turns about the point <b>R</b>. When is it parallel? When does it make a square corner? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SPIN[k], R = [2, 1], s = slopeOf(d.P, d.Q);
    const G = sqG(stage, 14, 14, { xmin: -6, xmax: 7, ymin: -5, ymax: 5 }, 33, { xlabels: 2, ylabels: 2 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Slopes');
    G.segment(d.P, d.Q, { color: BLUE, width: 4.5 });
    const t0 = tri(G, d.P, d.Q, { runLab: T(String(s.run)), riseLab: T(String(s.rise)) });
    const st = { a: Math.atan(d.from) };
    const red = G.curve(() => { const dx = Math.cos(st.a), dy = Math.sin(st.a); return { subs: [[G.toPx(R[0] - 30 * dx, R[1] - 30 * dy), G.toPx(R[0] + 30 * dx, R[1] + 30 * dy)]] }; }, { color: RED, width: 3.5 }, 'u6l9-spinline', G.layers.data);
    hid(red);
    const Rp = G.point(...R, { color: RED, label: T('R'), pos: 'nw' }); hidPt(Rp);
    const ro = h('div', 'u6l9-ro');
    const mTxt = () => { const c = Math.cos(st.a); if (Math.abs(c) < 1e-6) return '\\text{undefined}'; const m = Math.tan(st.a); return (Math.abs(m) < 0.005 ? '0' : String(parseFloat(m.toFixed(2)))); };
    const setRo = (exact) => { ro.innerHTML = `red slope: ${T(exact || mTxt())}`; };
    const turn = (c, to, ms) => { const a0 = st.a; return tween(c, ms, (q) => { st.a = a0 + (to - a0) * q; red._bkDraw(); setRo(); }); };
    const blueLine = G.line(d.P, d.Q, { color: BLUE, width: 2, dash: '8 7' }); hid(blueLine);
    const aPar = Math.atan(s.m), aPerp = d.zero ? -Math.PI / 2 : Math.atan(-1 / s.m);
    const X = d.zero ? [R[0], d.P[1]] : meet(d.P, d.Q, R, [R[0] + d.perpT[0], R[1] + d.perpT[1]]);
    let tp = null;
    const steps = [
      { cap: d.zero ? `The blue segment is <b>flat</b>: rise ${T('0')}, so its slope is ${T('0')}.` : `The blue segment: run ${T(String(s.run))}, rise ${T(String(s.rise))}. Its slope is ${T(`${s.raw}${s.raw === s.val ? '' : '=' + s.val}`)}.`,
        run: async (c) => { if (!d.zero) await showTri(c, t0, 360); await show(c, line(P, `<span class="u6l9-bl">blue</span> ${T(`m=${d.zero ? '0' : s.val}`)}`, 'u6l9-big')); } },
      { cap: `The red line turns about ${T('R')}. Right now its slope is ${T(String(d.from))}: ${d.from > 1 ? 'much steeper than blue' : 'not the same as blue'}.`,
        run: async (c) => { unhide(Rp); unhide(Rp.label); await G.reveal(Rp, c); unhide(red); await G.drawIn(red, 500, c); setRo(); P.appendChild(ro); await show(c, ro); } },
      { cap: d.zero ? `Turn it until it is flat too: slope ${T('0')}. Same slope, so the lines are <b>parallel</b>. They never meet.` : `Turn it until it points the <b>same way</b> as blue: slope ${T(d.m)}. Same slope, so the lines are <b>parallel</b>. They never meet.`,
        run: async (c) => {
          await turn(c, aPar, 1500); st.a = aPar; red._bkDraw(); setRo(d.m);
          if (!d.zero) { tp = tri(G, R, [R[0] + d.parT[0], R[1] + d.parT[1]], { runLab: T(String(d.parT[0])), riseLab: T(String(d.parT[1])) }); await showTri(c, tp, 300); }
          await show(c, line(P, `<b class="u6l9-part">parallel:</b> ${T(`m=${d.m}`)}`, 'u6l9-mline'));
        } },
      { cap: d.zero ? `Keep turning. The red line gets steeper and steeper… until it is <b>vertical</b>: a square corner with blue. Its slope is <b>undefined</b> (run ${T('0')}).` : `Keep turning, past flat (slope ${T('0')})… until red crosses blue at a <b>square corner</b>. Now its slope is ${T(d.mp)}.`,
        run: async (c) => {
          dropTri(tp); tp = null;
          await turn(c, aPerp, 2000); st.a = aPerp; red._bkDraw(); setRo(d.zero ? '\\text{undefined}' : d.mp);
          unhide(blueLine); await G.drawIn(blueLine, 500, c);
          const mk = rmark(G, X, d.zero ? [-1, 0] : [s.run, s.rise], d.zero ? [0, 1] : [-d.perpT[0], -d.perpT[1]], 15); mk.style.opacity = 0; await appear(c, mk);
          if (!d.zero) { tp = tri(G, R, [R[0] + d.perpT[0], R[1] + d.perpT[1]], { runLab: T(String(d.perpT[0])), riseLab: T(String(d.perpT[1])) }); await showTri(c, tp, 300); }
          await show(c, line(P, `<b class="u6l9-perp">perpendicular:</b> ${T(`m=${d.zero ? '\\text{undefined}' : d.mp}`)}`, 'u6l9-mline'));
        } },
      { cap: d.zero ? `The special case: <b>horizontal ⊥ vertical</b>. You can’t multiply by “undefined”, so the product rule doesn’t apply here.` : `Compare ${T(d.m)} and ${T(d.mp)}: <b>flip it</b> (${T(d.f1)}) and <b>change the sign</b> (${T(d.mp)}). Check: ${T(d.check)}.`,
        run: async (c) => { await pop(c, line(P, d.zero ? 'horizontal (0) ⊥ vertical (undefined)' : T(d.check), 'u6l9-rulebox')); } }
    ];
    return steps;
  }
};

/* =============================== 2. parallel: a slid copy of one slope triangle =============================== */
const TRANS = {
  demo: { label: 'Worked demo: ' + T('AB') + ' and ' + T('CD'), A: ['A', -6, -2, 's'], B: ['B', -1, 1, 'n'], n: ['C', 'D'], pos: ['s', 'n'], dx: 6, dy: -2,
    win: { xmin: -7, xmax: 6, ymin: -6, ymax: 3 }, unit: 33 },
  ex1: { label: 'Example 1 check', A: ['P', -5, -3, 'w'], B: ['Q', -1, 3, 'w'], n: ['R', 'S'], pos: ['e', 'e'], dx: 5, dy: -2,
    win: { xmin: -8, xmax: 5, ymin: -6, ymax: 4 }, unit: 36 },
  ex2: { label: 'Example 2 check', A: ['T', -8, 5, 'n'], B: ['U', 4, -1, 'e'], n: ['V', 'W'], pos: ['s', 's'], dx: 5, dy: -7,
    win: { xmin: -9, xmax: 10, ymin: -9, ymax: 6 }, unit: 24 }
};
const moveTxt = (dx, dy) => `${Math.abs(dx)} ${dx >= 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy <= 0 ? 'down' : 'up'}`;
const translate = {
  title: 'Parallel: a slid copy of the same slope triangle',
  height: 470,
  minW: 900,
  choices: Object.keys(TRANS).map((k) => ({ v: k, label: TRANS[k].label })),
  intro: 'Find the first slope, then slide the segment (slope triangle and all) without turning it. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TRANS[k], [an, ax, ay, ap] = d.A, [bn, bx, by, bp] = d.B, A = [ax, ay], B = [bx, by];
    const C = [ax + d.dx, ay + d.dy], D = [bx + d.dx, by + d.dy], [cn, dn] = d.n;
    const G = sqG(stage, 14, 14, d.win, d.unit, { xlabels: 2, ylabels: 2 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Slopes');
    const s = slopeOf(A, B), sc = slopeOf(C, D);
    G.segment(A, B, { color: BLUE, width: 4.5 }); pt(G, an, ax, ay, ap); pt(G, bn, bx, by, bp);
    const segCD = G.segment(C, D, { color: RED, width: 4.5 }); hid(segCD);
    const pC = hidPt(pt(G, cn, ...C, d.pos[0])), pD = hidPt(pt(G, dn, ...D, d.pos[1]));
    const t0 = tri(G, A, B, { runLab: T(`${s.run}`), riseLab: T(`${s.rise}`) });
    let t1 = null;
    return [
      { cap: `${T(an + bn)}: run ${T(String(s.run))}, rise ${T(String(s.rise))}. ${T(`m_{${an}${bn}}=${s.all}`)}.`,
        run: async (c) => { await showTri(c, t0); await show(c, line(P, T(`m_{${an}${bn}}=${s.all}`), 'u6l9-cblue')); } },
      { cap: `Slide a copy ${moveTxt(d.dx, d.dy)}, without turning it. It lands exactly on ${T(cn + dn)}.`,
        run: async (c) => {
          const cp = tri(G, A, B, { seg: RED, runLab: false, riseLab: false, hidden: false });
          const [px, py] = [d.dx * G.ux, -d.dy * G.uy];
          await tween(c, 1300, (q) => cp.g.setAttribute('transform', `translate(${px * q} ${py * q})`));
          dropTri(cp);
          unhide(segCD); await Promise.all([showPt(c, G, pC), showPt(c, G, pD)]);
          t1 = tri(G, C, D, { runLab: T(`${sc.run}`), riseLab: T(`${sc.rise}`), hidden: false });
          await Promise.all(t1.labs.map((l) => fadeIn(c, l)));
        } },
      { cap: `Check with the formula: ${T(`m_{${cn}${dn}}=${sc.all}`)}. Same rise, same run: the <b>same slope</b>.`,
        run: async (c) => { await show(c, line(P, T(`m_{${cn}${dn}}=${sc.all}`), 'u6l9-cred')); } },
      { cap: `Make them longer: they point the same way and never meet. <b>Equal slopes mean parallel</b>: ${T(`${an}${bn}\\parallel ${cn}${dn}`)}.`,
        run: async (c) => {
          const Ls = [[A, B], [C, D]].map(([p, q]) => G.line(p, q, { color: 'gray', width: 2, dash: '8 7' }));
          await Promise.all(Ls.map((L) => G.drawIn(L, 800, c)));
          await pop(c, line(P, `${T(`m_{${an}${bn}}=m_{${cn}${dn}}`)}, so ${T(`${an}${bn}\\parallel ${cn}${dn}`)}`, 'u6l9-rulebox'));
        } }
    ];
  }
};

/* =============================== 2b. make them longer: do they meet? =============================== */
const BOARD = { xmin: -1, xmax: 22, ymin: -1, ymax: 9 };
const MEET = {
  ex1: { label: 'Example 1 check: ' + T('PQ') + ' and ' + T('RS'), win: { xmin: -8, xmax: 5, ymin: -6, ymax: 4 }, unit: 36,
    a: ['PQ', [-5, -3], [-1, 3], BLUE], b: ['RS', [0, -5], [4, 1], RED], gaps: [-3, -1, 1] },
  ab: { label: 'Warm-up: sticks A and B', win: BOARD, unit: 20.5, board: true,
    a: ['A', [0, 1], [6, 3], '#d23c32'], b: ['B', [1, 6], [4, 7], '#2864c8'], gaps: [2, 6, 9] },
  ag: { label: 'Warm-up: sticks A and G', win: BOARD, unit: 20.5, board: true,
    a: ['A', [0, 1], [6, 3], '#d23c32'], b: ['G', [0, 3], [5, 5], '#28964a'], zoom: { xmin: -34, xmax: 23, ymin: -16, ymax: 9 } }
};
const meetEx = {
  title: 'Make them longer: do they ever meet?',
  height: 470,
  minW: 900,
  choices: Object.keys(MEET).map((k) => ({ v: k, label: MEET[k].label })),
  intro: (k) => (MEET[k].board ? 'Pegs are 1 unit apart, with (0, 0) at the bottom-left peg. Find both slopes, then make the sticks longer. Press <b>Next</b>.' : 'Find both slopes, then make the segments longer. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = MEET[k], [na, A1, A2, ca] = d.a, [nb, B1, B2, cb] = d.b;
    const o = d.board ? { grid: false, axes: false, numbers: false, xtitle: '', ytitle: '' } : { xlabels: 2, ylabels: 2 };
    const G = sqG(stage, 14, d.board ? 120 : 14, d.win, d.unit, o);
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Slopes');
    if (d.board) {
      G.polyline([[-0.6, -0.6], [21.6, -0.6], [21.6, 8.6], [-0.6, 8.6]], { closed: true, color: '#c88c14', width: 2, fill: '#ffecb3', fillOpacity: 1 });
      const pegs = svgEl('path', { fill: '#d6a43c' }, G.layers.data);
      G.track(pegs, () => { let dd = ''; for (let i = 0; i <= 21; i++) for (let j = 0; j <= 8; j++) { const [px, py] = G.toPx(i, j), r = Math.min(2.4, G.ux / 9); dd += `M${(px - r).toFixed(1)} ${py.toFixed(1)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`; } pegs.setAttribute('d', dd); });
    }
    G.segment(A1, A2, { color: ca, width: 6 }); G.segment(B1, B2, { color: cb, width: 6 });
    if (d.board) { G.label(...A1, T(na), { pos: 'w', cls: 'bk-ptlab', color: ca, gap: 6 }); G.label(...B2, T(nb), { pos: 'e', cls: 'bk-ptlab', color: cb, gap: 6 }); }
    else { [[na[0], A1, 'w'], [na[1], A2, 'w'], [nb[0], B1, 'e'], [nb[1], B2, 'e']].forEach(([n, p, pos]) => pt(G, n, p[0], p[1], pos)); }
    const sa = slopeOf(A1, A2), sb = slopeOf(B1, B2), same = sa.val === sb.val;
    const ta = tri(G, A1, A2, { runLab: T(`${sa.run}`), riseLab: T(`${sa.rise}`) }), tb = tri(G, B1, B2, { runLab: T(`${sb.run}`), riseLab: T(`${sb.rise}`), runPos: d.board && !same ? 'n' : undefined });
    const nm = (n) => (d.board ? `m_${n}` : `m_{${n}}`);
    const La = G.line(A1, A2, { color: ca, width: 2.5, dash: '9 7' }), Lb = G.line(B1, B2, { color: cb, width: 2.5, dash: '9 7' }); hid(La); hid(Lb);
    const steps = [
      { cap: `${d.board ? 'Stick ' + na : T(na)}: ${T(`${nm(na)}=${sa.all}`)}. ${d.board ? 'Stick ' + nb : T(nb)}: ${T(`${nm(nb)}=${sb.all}`)}.`,
        run: async (c) => {
          await showTri(c, ta, 320); await show(c, line(P, T(`${nm(na)}=${sa.all}`), 'u6l9-mline'));
          await showTri(c, tb, 320); await show(c, line(P, T(`${nm(nb)}=${sb.all}`), 'u6l9-mline'));
        } },
      { cap: same ? `The slopes are <b>equal</b>. Make both longer…` : `${T(sa.val)} and ${T(sb.val)} are close (${T('0.33')} and ${T('0.4')}), but <b>not equal</b>. Make both longer…`,
        run: async (c) => { dropTri(ta); dropTri(tb); unhide(La); unhide(Lb); await Promise.all([G.drawIn(La, 900, c), G.drawIn(Lb, 900, c)]); await show(c, line(P, same ? T(`${nm(na)}=${nm(nb)}`) : T(`${nm(na)}\\ne ${nm(nb)}`), same ? 'u6l9-good' : 'u6l9-hot')); } }
    ];
    if (same) {
      steps.push({ cap: `Measure the gap across at a few places: it is the <b>same every time</b>. The lines never get closer, so they never meet: <b>parallel</b>.`,
        run: async (c) => {
          const xa = (y) => A1[0] + (y - A1[1]) * sa.run / sa.rise, xb = (y) => B1[0] + (y - B1[1]) * sb.run / sb.rise;
          for (const v of d.gaps) {
            const g = d.board ? G.segment([v, A1[1] + (v - A1[0]) * sa.m], [v, B1[1] + (v - B1[0]) * sb.m], { color: GRN, width: 4, ends: ['arrow', 'arrow'], layer: 'top' })
              : G.segment([xa(v), v], [xb(v), v], { color: GRN, width: 4, ends: ['arrow', 'arrow'], layer: 'top' });
            await G.drawIn(g, 380, c);
          }
          await pstamp(c, P, 'parallel ✓', true);
        } });
    } else {
      steps.push({ cap: `To the left, the gap <b>shrinks</b>. Zoom out to follow them…`,
        run: async (c) => { await G.setWindow(d.zoom, c, 1800); } });
      steps.push({ cap: `There! They cross at ${T('(-30,\\ -9)')}, 30 pegs left of the board. Different slopes, so <b>not parallel</b>, even if the sticks look alike.`,
        run: async (c) => {
          const X = G.point(-30, -9, { color: RED, r: 8, label: T('(-30,\\ -9)'), pos: 'n' }); await G.reveal(X, c); await pulse(c, X.label, 1.3);
          await pstamp(c, P, 'not parallel', false);
        } });
    }
    return steps;
  }
};

/* =============================== 3. perpendicular: turn the slope triangle 90° =============================== */
const ROT = {
  demo: { label: 'Worked demo: ' + T('EF') + ' and ' + T('FG'), V: ['F', 2, 0, 'nw'], U: ['E', -2, -3, 'w'], W: ['G', 5, -4, 'e'] },
  ex3: { label: 'Example 3 check', V: ['N', 2, 1, 'nw'], U: ['M', -4, -3, 'w'], W: ['O', 4, -2, 'sw'] },
  a: { label: 'Slope ' + T('\\tfrac13'), V: ['B', 3, 1, 'nw'], U: ['A', -3, -1, 'w'], W: null }
};
const rotate = {
  title: 'Perpendicular: turn the slope triangle 90°',
  height: 470,
  minW: 860,
  choices: Object.keys(ROT).map((k) => ({ v: k, label: ROT[k].label })),
  intro: 'Turn the slope triangle a quarter turn about the shared point. Watch what happens to the rise and the run. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ROT[k], [vn, vx, vy, vp] = d.V, [un, ux, uy, up] = d.U, V = [vx, vy], U = [ux, uy];
    const G = sqG(stage, 14, 14, { xmin: -5, xmax: 8, ymin: -6, ymax: 3 }, 34, { xlabels: 2, ylabels: 2 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Slopes');
    const nmo = { name: true };
    const s = slopeOf(U, V), run = s.run, rise = s.rise;           // left to right, U → V
    const U2 = [vx + rise, vy - run];                                // U turned 90° about V (the new segment V → U2)
    const s2 = slopeOf(V, U2);
    G.segment(U, V, { color: BLUE, width: 4.5 }); pt(G, un, ux, uy, up, nmo); pt(G, vn, vx, vy, vp, nmo);
    const wSeg = d.W ? G.segment(V, [d.W[1], d.W[2]], { color: RED, width: 4.5 }) : null; if (wSeg) hid(wSeg);
    const wPt = d.W ? hidPt(pt(G, d.W[0], d.W[1], d.W[2], d.W[3], nmo)) : null;
    const t0 = tri(G, U, V, { runLab: T(`\\text{run}=${run}`), riseLab: T(`\\text{rise}=${rise}`), risePos: 'e' });
    const [px, py] = G.toPx(...V);
    const m1 = s.val, m2 = s2.val, flip = frac(run, rise);
    let l1, l2;
    const nm2 = d.W ? vn + d.W[0] : vn + "C";
    return [
      { cap: `${T(un + vn)}: run ${T(String(run))}, rise ${T(String(rise))}. ${T(`m_{${un}${vn}}=${s.raw}${s.raw === m1 ? '' : '=' + m1}`)}.`,
        run: async (c) => { await showTri(c, t0); await show(c, line(P, T(`m_{${un}${vn}}=${s.raw}${s.raw === m1 ? '' : '=' + m1}`), 'u6l9-cblue u6l9-big')); } },
      { cap: `Turn the whole triangle a <b>quarter turn</b> (${T('90^\\circ')}) about ${T(vn)}.${d.W ? ` It lands right along ${T(vn + d.W[0])}.` : ''}`,
        run: async (c) => {
          const cp = tri(G, U, V, { seg: RED, runLab: false, riseLab: false, hidden: false });
          await tween(c, 1700, (q) => cp.g.setAttribute('transform', `rotate(${-90 * q} ${px} ${py})`));
          if (d.W) { unhide(wSeg); await G.drawIn(wSeg, 400, c); await showPt(c, G, wPt); }
          else { const p2 = G.point(...U2, { color: RED, label: T('C'), pos: 'e' }); await G.reveal(p2, c); }
        } },
      { cap: `The old <b>run</b> (amber) now stands up and points <b>down</b>: the new rise is ${T(String(-run))}. The old <b>rise</b> (purple) now lies flat: the new run is ${T(String(rise))}. <b>Rise and run swap, and the sign flips.</b>`,
        run: async (c) => {
          l1 = G.label(vx + rise, vy - run / 2, T(`\\text{rise}=${-run}`), { pos: 'e', cls: 'bk-ptlab u6l9-runlab', gap: 8 });
          l2 = G.label(vx + rise / 2, vy, T(`\\text{run}=${rise}`), { pos: 'n', cls: 'bk-ptlab u6l9-riselab', gap: 8 });
          await Promise.all(t0.labs.map((l) => c.anim(l, [{ opacity: 1 }, { opacity: 0.3 }], 300)));
          await fadeIn(c, l1); await pulse(c, l1, 1.15); await fadeIn(c, l2); await pulse(c, l2, 1.15);
        } },
      { cap: `New slope: ${T(`\\dfrac{${-run}}{${rise}}${m2 === `\\dfrac{${-run}}{${rise}}` ? '' : '=' + m2}`)}. ${T(m1)} <b>flipped</b> is ${T(flip)}; <b>change the sign</b>: ${T(m2)}. That is the <b>negative reciprocal</b>.`,
        run: async (c) => { await show(c, line(P, T(`m_{${nm2}}=\\dfrac{${-run}}{${rise}}${m2 === `\\dfrac{${-run}}{${rise}}` ? '' : '=' + m2}`), 'u6l9-cred u6l9-big')); } },
      { cap: `Multiply: ${T(`${prodTex(m1, m2)}=-1`)}. A square corner every time: perpendicular slopes multiply to ${T('-1')}.`,
        run: async (c) => {
          const mk = rmark(G, V, [ux - vx, uy - vy], [rise, -run], 17); mk.style.opacity = 0; await appear(c, mk);
          await pop(c, line(P, T(`${prodTex(m1, m2)}=-1`), 'u6l9-rulebox'));
        } }
    ];
  }
};

/* =============================== 3b. parallel and perpendicular slopes from one slope =============================== */
const NR = {
  d34: { label: 'Worked demo: ' + T('\\tfrac34'), g: { P: [-5, -4], Q: [-1, -1] }, p: { P: [0, -5], Q: [4, -2] }, q: { P: [-4, 3], Q: [-1, -1] }, at: [-1, -1], mk: [[-4, -3], [-3, 4]],
    given: 'm=\\dfrac34', parT: 'm=\\dfrac34', f0: '\\dfrac34', f1: '\\dfrac43', f2: '-\\dfrac43', perpT: 'm=-\\dfrac43', check: '\\dfrac34\\times\\left(-\\dfrac43\\right)=-1' },
  m3: { label: 'Slope ' + T('-3'), g: { P: [-5, 5], Q: [-3, -1] }, p: { P: [3, 3], Q: [5, -3] }, q: { P: [-3, -1], Q: [3, 1] }, at: [-3, -1], mk: [[-2, 6], [6, 2]],
    given: 'm=-3', parT: 'm=-3', f0: '-\\dfrac31', f1: '-\\dfrac13', f2: '\\dfrac13', perpT: 'm=\\dfrac13', check: '-3\\times\\dfrac13=-1', whole: true },
  zero: { label: 'Slope ' + T('0') + ': the special case', zero: true, g: { P: [-4, 1], Q: [4, 1] }, p: { P: [-4, -3], Q: [4, -3] }, q: { P: [0, -5], Q: [0, 5] }, at: [0, 1], mk: [[1, 0], [0, 1]],
    given: 'm=0', parT: 'm=0', f0: '\\dfrac01', f1: '\\dfrac10', f2: '\\text{undefined}', perpT: '\\text{undefined (vertical)}', check: '' }
};
const flipSign = {
  title: 'Flip it and change the sign',
  height: 470,
  minW: 900,
  choices: Object.keys(NR).map((k) => ({ v: k, label: NR[k].label })),
  intro: 'One given slope. A <b>parallel</b> line copies its slope triangle; a <b>perpendicular</b> line turns it 90°. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = NR[k];
    const G = sqG(stage, 14, 14, { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }, 34, { xlabels: 2, ylabels: 2 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, '');
    const seg = (s, color) => { const el = G.segment(s.P, s.Q, { color, width: 4.5 }); hid(el); return { el, show: async (c) => { unhide(el); await G.drawIn(el, 600, c); } }; };
    const S1 = seg(d.g, BLUE), S2 = seg(d.p, GRN), S3 = seg(d.q, RED);
    const short = (s) => ({ runLab: T(`${s.Q[0] - s.P[0]}`), riseLab: T(`${s.Q[1] - s.P[1]}`) });
    const t1 = d.zero ? null : tri(G, d.g.P, d.g.Q, short(d.g));
    const t2 = d.zero ? null : tri(G, d.p.P, d.p.Q, short(d.p)), t3 = d.zero ? null : tri(G, d.q.P, d.q.Q, Object.assign(short(d.q), { risePos: 'w' }));
    const row = (lab, cls) => { const r = h('div', 'u6l9-nrrow ' + cls, `<div class="u6l9-nrl">${lab}</div><div class="u6l9-nrv"></div>`); P.appendChild(r); hid(r); return r; };
    const rG = row('Given', 'u6l9-nrg'), rP = row('Parallel', 'u6l9-nrp'), rQ = row('Perpendicular', 'u6l9-nrq'), rC = row('Check', 'u6l9-nrc');
    const card = h('span', 'u6l9-fcard', T(d.f0));
    const flip = async (c, el, html) => { await c.anim(el, [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(90deg)' }], 260); el.innerHTML = html; await c.anim(el, [{ transform: 'rotateY(90deg)' }, { transform: 'rotateY(0deg)' }], 260); };
    return [
      { cap: `The given segment has slope ${T(d.given.split('=').pop())}${d.zero ? ': it is horizontal' : ''}.`,
        run: async (c) => { await S1.show(c); if (t1) await showTri(c, t1, 360); rG.querySelector('.u6l9-nrv').innerHTML = T(d.given); unhide(rG); await show(c, rG); } },
      { cap: d.zero ? `<b>Parallel:</b> slide a copy up or down. Still a rise of ${T('0')}: ${T(d.parT)}.` : `<b>Parallel:</b> slide a copy of the same slope triangle somewhere else. Same rise, same run: ${T(d.parT)}.`,
        run: async (c) => { await S2.show(c); if (t2) await showTri(c, t2, 360); rP.querySelector('.u6l9-nrv').innerHTML = T(d.parT); unhide(rP); await show(c, rP); } },
      { cap: d.zero ? `<b>Perpendicular:</b> write ${T('0=\\dfrac01')} and flip it: ${T('\\dfrac10')}. You can’t divide by zero, so the slope is <b>undefined</b>.` : (d.whole ? `<b>Perpendicular:</b> turning the triangle 90° swaps rise and run. Write ${T('-3')} as ${T(d.f0)} and <b>flip it</b>: ${T(d.f1)}.` : `<b>Perpendicular:</b> turning the triangle 90° swaps rise and run, so <b>flip it</b>: ${T(d.f0)} becomes ${T(d.f1)}.`),
        run: async (c) => { const v = rQ.querySelector('.u6l9-nrv'); v.innerHTML = ''; v.appendChild(card); unhide(rQ); await show(c, rQ); await sleep(c, 250); await flip(c, card, T(d.f1)); } },
      { cap: d.zero ? `An undefined slope means a <b>vertical</b> line. Horizontal and vertical lines are <b>perpendicular</b>, even though ${T('0')} and undefined can’t be multiplied.` : `…and <b>change the sign</b>: ${T(d.perpT)}. That is the <b>negative reciprocal</b>.`,
        run: async (c) => {
          if (d.zero) card.innerHTML = T(d.f2); else await flip(c, card, T(d.f2));
          await S3.show(c); if (t3) await showTri(c, t3, 360);
          const mk = rmark(G, d.at, d.mk[0], d.mk[1], 15); mk.style.opacity = 0; await appear(c, mk);
        } },
      { cap: d.zero ? `Two horizontal lines (slope ${T('0')}) are parallel; a horizontal and a vertical line are perpendicular.` : `Check: ${T(d.check)} ✓. Perpendicular slopes multiply to ${T('-1')}.`,
        run: async (c) => { rC.querySelector('.u6l9-nrv').innerHTML = d.zero ? 'horizontal ⊥ vertical' : T(d.check); unhide(rC); await pop(c, rC); } }
    ];
  }
};

/* =============================== 3c. multiply the slopes: −1 or not? =============================== */
const PT_ = {
  ex3: { label: 'Example 3 check', win: { xmin: -8, xmax: 6, ymin: -4, ymax: 2 }, unit: 34,
    a: ['M', [-4, -3], 'N', [2, 1], ['w', 'n']], b: ['N', [2, 1], 'O', [4, -2], [null, 'e']] },
  ex4: { label: 'Example 4 check', win: { xmin: -8, xmax: 3, ymin: -7, ymax: 3 }, unit: 38,
    a: ['H', [-7, 2], 'I', [1, -2], ['n', 'e']], b: ['J', [-3, -6], 'K', [1, 2], ['w', 'e']] },
  cd: { label: 'Warm-up: sticks C and D', win: { xmin: 6, xmax: 14, ymin: 0, ymax: 8 }, unit: 46, board: true,
    a: ['C', [8, 1], null, [12, 7], ['w', 'e']], b: ['D', [8, 6], null, [12, 3], ['w', 'e']] }
};
const perpTest = {
  title: 'Multiply the slopes: is it a square corner?',
  height: 470,
  minW: 900,
  choices: Object.keys(PT_).map((k) => ({ v: k, label: PT_[k].label })),
  intro: (k) => (PT_[k].board ? 'C and D cross in a convincing “+”. Is it really 90°? Pegs are 1 unit apart. Press <b>Next</b>.' : 'Find both slopes, then multiply them. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = PT_[k], [a1n, A1, a2n, A2, apos] = d.a, [b1n, B1, b2n, B2, bpos] = d.b;
    const o = d.board ? { grid: false, axes: false, numbers: false, xtitle: '', ytitle: '' } : { xlabels: 2, ylabels: 2 };
    const G = sqG(stage, 14, 14, d.win, d.unit, o);
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Slopes');
    if (d.board) {
      const [x0, y0] = G.toPx(6.4, 0.4), [x1, y1] = G.toPx(13.6, 7.6);
      svgEl('rect', { x: x0, y: y1, width: x1 - x0, height: y0 - y1, rx: 8, fill: '#ffecb3' }, G.layers.bg);
      for (let i = 7; i <= 13; i++) for (let j = 1; j <= 7; j++) { const [px, py] = G.toPx(i, j); svgEl('circle', { cx: px, cy: py, r: 3, fill: '#d6a43c' }, G.layers.bg); }
    }
    const nA = a2n ? a1n + a2n : a1n, nB = b2n ? b1n + b2n : b1n;
    const segA = G.segment(A1, A2, { color: BLUE, width: 5 }), segB = G.segment(B1, B2, { color: RED, width: 5 }); hid(segA); hid(segB);
    const pts = [];
    if (d.board) { pts.push(G.label(...A2, T(a1n), { pos: 'ne', cls: 'bk-ptlab u6l9-bluelab', gap: 6 }), G.label(...B1, T(b1n), { pos: 'nw', cls: 'bk-ptlab u6l9-redlab', gap: 6 })); }
    else {
      pts.push(pt(G, a1n, ...A1, apos[0]), pt(G, a2n, ...A2, apos[1]));
      if (b1n !== a2n) pts.push(pt(G, b1n, ...B1, bpos[0])); pts.push(pt(G, b2n, ...B2, bpos[1]));
    }
    pts.forEach((p) => (p.label ? hidPt(p) : hid(p)));
    const sa = slopeOf(A1, A2), sb = slopeOf(B1, B2);
    const ta = tri(G, A1, A2, { runLab: T(`${sa.run}`), riseLab: T(`${sa.rise}`) }), tb = tri(G, B1, B2, { runLab: T(`${sb.run}`), riseLab: T(`${sb.rise}`), runPos: d.board ? 'n' : undefined });
    const num = sa.rise * sb.rise, den = sa.run * sb.run, prod = frac(num, den), ok = num === -den;
    const X = meet(A1, A2, B1, B2), ang = angDeg([sa.run, sa.rise], [sb.run, sb.rise]);
    const nm = (n) => (n.length > 1 ? `m_{${n}}` : `m_${n}`);
    return [
      { cap: d.board ? `Stick ${T('C')} and stick ${T('D')} cross near the middle. By eye, it looks like a perfect “+”.` : `Plot ${T(nA)} and ${T(nB)}.`,
        run: async (c) => { unhide(segA); await G.drawIn(segA, 500, c); unhide(segB); await G.drawIn(segB, 500, c); for (const p of pts) { if (p.label) await showPt(c, G, p); else { unhide(p); await fadeIn(c, p); } } } },
      { cap: `${T(nA)}: ${T(`${nm(nA)}=${sa.all}`)}.`,
        run: async (c) => { await showTri(c, ta, 340); await show(c, line(P, T(`${nm(nA)}=${sa.all}`), 'u6l9-cblue')); } },
      { cap: `${T(nB)}: ${T(`${nm(nB)}=${sb.all}`)}.`,
        run: async (c) => { await showTri(c, tb, 340); await show(c, line(P, T(`${nm(nB)}=${sb.all}`), 'u6l9-cred')); } },
      { cap: ok ? `Multiply: ${T(`${prodTex(sa.val, sb.val)}=-1`)}. Negative reciprocals, so ${T(`${nA}\\perp ${nB}`)}: a <b>right angle</b>.`
          : `Multiply: ${T(`${prodTex(sa.val, sb.val)}=${prod}`)}. Not ${T('-1')}, so <b>not perpendicular</b>. The negative reciprocal of ${T(sa.val)} is ${T(frac(-sa.run, sa.rise))}, not ${T(sb.val)}.`,
        run: async (c) => {
          dropTri(ta); dropTri(tb);
          await pop(c, line(P, T(`${nm(nA)}\\times ${nm(nB)}=${prodTex(sa.val, sb.val)}=${prod}`), ok ? 'u6l9-rulebox' : 'u6l9-rulebox u6l9-hotbox'));
          if (ok) { const mk = rmark(G, X, [A1[0] - X[0], A1[1] - X[1]], [B2[0] - X[0], B2[1] - X[1]], 16); mk.style.opacity = 0; await appear(c, mk); }
          else {
            const arc = angleArc(G.layers.top, G.toPx(...X), G.toPx(...A2), G.toPx(...B2), 30, { color: RED, width: 3 }); arc.style.opacity = 0; await appear(c, arc);
            await fadeIn(c, G.label(...X, `≈ ${Math.round(ang)}°`, { pos: 'e', cls: 'bk-ptlab u6l9-redlab', gap: 36 }));
          }
          await pstamp(c, P, ok ? 'perpendicular ✓' : 'not perpendicular', ok);
        } }
    ];
  }
};

/* =============================== 4. parallel, perpendicular, or neither =============================== */
const CL = {
  a: { label: 'Example 5(a) check', m1: '\\dfrac{2}{5}', m2: '\\dfrac{2}{5}', eq: '\\dfrac25=\\dfrac25', isEq: true, L: [{ m: 0.4, b: 1.5 }, { m: 0.4, b: -1.5 }], v: 'par',
    caps: ['The slopes are <b>equal</b>.', 'Equal slopes: the lines are <b>parallel</b>.'] },
  b: { label: 'Example 5(b) check', m1: '\\dfrac{3}{4}', m2: '-\\dfrac{4}{3}', eq: '\\dfrac34\\ne-\\dfrac43', prod: '\\dfrac{3}{4}\\times\\left(-\\dfrac{4}{3}\\right)=-1', L: [{ m: 0.75, b: 0 }, { m: -4 / 3, b: 0 }], v: 'perp',
    caps: ['Not equal, so not parallel.', 'Multiply: ' + T('\\dfrac{3}{4}\\times\\left(-\\dfrac{4}{3}\\right)=-1') + '. Negative reciprocals: <b>perpendicular</b>.'] },
  c: { label: 'Example 5(c) check', m1: '\\dfrac{5}{6}', m2: '\\dfrac{6}{5}', eq: '\\dfrac56\\ne\\dfrac65', prod: '\\dfrac{5}{6}\\times\\dfrac{6}{5}=+1\\ne-1', L: [{ m: 5 / 6, b: 0 }, { m: 1.2, b: 0 }], v: 'nei',
    caps: ['Not equal, so not parallel.', 'The product is ' + T('+1') + ', not ' + T('-1') + '. Flipped, but the sign never changed: <b>neither</b>.'] },
  hv: { label: T('0') + ' and undefined', m1: '0', m2: '\\text{undefined}', eq: '0\\ne\\text{undefined}', prod: '0\\times\\text{undefined}:\\ \\text{can’t multiply}', L: [{ m: 0, b: 1.5 }, { x: 1.5 }], v: 'perp',
    caps: ['Not equal, so not parallel.', 'They can’t be multiplied, but slope 0 is horizontal and undefined is vertical: the special case, <b>perpendicular</b>.'] }
};
const classify = {
  title: 'Parallel, perpendicular, or neither?',
  height: 470,
  minW: 900,
  choices: Object.keys(CL).map((k) => ({ v: k, label: CL[k].label })),
  intro: 'Follow the flowchart with the two slopes. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CL[k], FW = ex.W - 400;
    const P = panel(stage, 14, 14, 366, 210, 'The two slopes', 'u6l9-sm');
    const G = sqG(stage, 30, 234, { xmin: -6, xmax: 6, ymin: -4, ymax: 4 }, 25, { numbers: false });
    const c1 = FW * 0.33, c2 = FW - 112;
    const F = new Flowchart(stage, { x: 392, y: 14, width: FW, height: 442,
      nodes: {
        start: { x: c1, y: 42, w: 290, h: 58, html: `<b>Two slopes</b>${T('m_1')} and ${T('m_2')}`, cls: 'bk-round' },
        eq: { x: c1, y: 156, w: 290, h: 62, html: '<b>Equal?</b>', color: 'blue' },
        par: { x: c2, y: 156, w: 200, h: 62, html: '<b>Parallel</b>', color: 'green' },
        prod: { x: c1, y: 276, w: 290, h: 62, html: `<b>Product ${T('=-1')}?</b>`, color: 'blue' },
        perp: { x: c2, y: 276, w: 200, h: 76, html: '<b>Perpendicular</b><span class="u6l9-fsm">or one 0, one undefined</span>', color: 'red' },
        nei: { x: c1, y: 392, w: 290, h: 56, html: '<b>Neither</b>', color: 'slate' }
      },
      edges: [{ from: 'start', to: 'eq' }, { from: 'eq', to: 'par', label: 'yes' }, { from: 'eq', to: 'prod', label: 'no' }, { from: 'prod', to: 'perp', label: 'yes' }, { from: 'prod', to: 'nei', label: 'no' }] });
    const lines = d.L.map((L, i) => { const el = G.line(L.x != null ? { x: L.x } : { m: L.m, b: L.b }, { color: i ? RED : BLUE, width: 3.5 }); hid(el); return el; });
    const steps = [
      { cap: `Start with ${T(`m_1=${d.m1}`)} and ${T(`m_2=${d.m2}`)}.`,
        run: async (c) => { await F.visit(c, 'start'); await show(c, line(P, `${T(`m_1=${d.m1}`)}, &nbsp; ${T(`m_2=${d.m2}`)}`, 'u6l9-mline')); } },
      { cap: d.caps[0],
        run: async (c) => { await F.go(c, 'start', 'eq'); await F.visit(c, 'eq'); await show(c, line(P, T(d.eq), d.isEq ? 'u6l9-good' : '')); } }
    ];
    if (d.v === 'par') {
      steps.push({ cap: d.caps[1], run: async (c) => { await F.go(c, 'eq', 'par'); await F.visit(c, 'par'); for (const L of lines) { unhide(L); await G.drawIn(L, 600, c); } } });
    } else {
      steps.push({ cap: d.caps[1], run: async (c) => { await F.go(c, 'eq', 'prod'); await F.visit(c, 'prod'); await show(c, line(P, T(d.prod), d.v === 'perp' ? 'u6l9-good' : 'u6l9-hot')); } });
      steps.push({ cap: d.v === 'perp' ? 'The lines meet at a <b>right angle</b>.' : 'The lines cross, but <b>not</b> at a right angle.',
        run: async (c) => {
          await F.go(c, 'prod', d.v); await F.visit(c, d.v);
          for (const L of lines) { unhide(L); await G.drawIn(L, 600, c); }
          if (d.v === 'perp') { const V = d.L[1].x != null ? [1.5, 1.5] : [0, 0], d1 = d.L[0].m != null ? [1, d.L[0].m] : [0, 1], d2 = d.L[1].x != null ? [0, -1] : [1, d.L[1].m]; const mk = rmark(G, V, d1, d2, 14); mk.style.opacity = 0; await appear(c, mk); }
        } });
    }
    return steps;
  }
};

/* =============================== 5. a missing number in a slope: turn the k-line =============================== */
const KD = {
  a: { label: 'Parallel', to: -2, v: 'par', alg: ['\\dfrac{k}{4}=-\\dfrac{1}{2}', 'k=4\\times\\left(-\\dfrac{1}{2}\\right)', 'k=-2'] },
  b: { label: 'Perpendicular', to: 8, v: 'perp', alg: ['-\\dfrac12\\ \\to\\ \\text{flip, change the sign}\\ \\to\\ 2', '\\dfrac{k}{4}=2', 'k=4\\times2=8'] }
};
const dialK = {
  title: 'Turn the dial: find k',
  height: 470,
  minW: 820,
  choices: Object.keys(KD).map((k) => ({ v: k, label: KD[k].label })),
  intro: `The blue line has slope ${T('-\\tfrac12')}. The red line has run 4 and rise <b>k</b>, so its slope is ${T('\\tfrac{k}{4}')}. Change k until the lines are right. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = KD[k];
    const G = sqG(stage, 14, 14, { xmin: -9, xmax: 9, ymin: -9, ymax: 9 }, 23, { xlabels: 2, ylabels: 2 });
    const P = panel(stage, G.W + 34, 14, ex.W - G.W - 48, 440, 'Find ' + T('k'));
    const fix = (x) => 2 - x / 2, S = [-6, -3], st = { k: 3 }, RUN = 4;
    const L1 = G.fn(fix, { color: BLUE, width: 3.5 }); hid(L1);
    const t1 = tri(G, [-8, 6], [-4, 4], { runLab: T('4'), riseLab: T('-2') });
    const L2 = G.curve(() => { const m = st.k / RUN, a = [-10, S[1] + m * (-10 - S[0])], b = [10, S[1] + m * (10 - S[0])]; return { subs: [[G.toPx(...a), G.toPx(...b)]] }; }, { color: RED, width: 3.5 }, 'u6l9-kline', G.layers.data); hid(L2);
    const E = [S[0] + RUN, S[1]];
    const g2 = svgEl('g', {}, G.layers.data); hid(g2);
    pth(g2, [G.toPx(...S), G.toPx(...E)], AMB);
    const rise2 = svgEl('path', { class: 'bk-stroke', fill: 'none', stroke: PUR, 'stroke-width': 5, 'stroke-linecap': 'round' }, g2);
    const fill2 = svgEl('path', { fill: PUR, 'fill-opacity': 0.09 }, g2);
    const lr = G.label(S[0] + RUN / 2, S[1], T('4'), { pos: 's', cls: 'bk-ptlab u6l9-runlab', gap: 6 }); hid(lr);
    const lk = G.label(E[0], S[1], T('k'), { pos: 'e', cls: 'bk-ptlab u6l9-riselab', gap: 8 }); hid(lk);
    const drawK = () => {
      const q = [E[0], S[1] + st.k]; L2._bkDraw();
      rise2.setAttribute('d', dOf([G.toPx(...E), G.toPx(...q)])); fill2.setAttribute('d', dOf([G.toPx(...S), G.toPx(...E), G.toPx(...q)]) + 'Z');
      lk.gy = S[1] + st.k / 2; lk._bkDraw();
    };
    drawK();
    const fmtK = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(1)).replace('-', '−');
    const ro = h('div', 'u6l9-kro');
    const setRo = (exact) => { ro.innerHTML = `<div>${T('k')} = <b>${exact ? fmtK(st.k) : fmtK(Math.round(st.k * 10) / 10)}</b></div><div class="u6l9-muted">red slope ${T('\\dfrac{k}{4}')} ≈ ${(st.k / RUN).toFixed(2).replace('-', '−')}</div>`; };
    const X = meet([0, 2], [2, 1], S, [E[0], S[1] + d.to]);
    return [
      { cap: `The blue line has slope ${T('-\\dfrac12')}: run 4, rise ${T('-2')}.`,
        run: async (c) => { unhide(L1); await G.drawIn(L1, 700, c); await showTri(c, t1, 340); await show(c, line(P, `${T('m_1=-\\dfrac12')}, &nbsp; ${T('m_2=\\dfrac{k}{4}')}`, 'u6l9-mline')); } },
      { cap: `The red line’s slope triangle has run ${T('4')} and rise ${T('k')}, so its slope is ${T('\\dfrac{k}{4}')}. Try ${T('k=3')}: slope ${T('\\tfrac34')}. Not right yet.`,
        run: async (c) => { unhide(L2); await G.drawIn(L2, 700, c); unhide(g2); await appear(c, g2); unhide(lr); unhide(lk); await fadeIn(c, lr); await fadeIn(c, lk); setRo(true); P.appendChild(ro); await show(c, ro); } },
      { cap: d.v === 'par' ? `Turn the dial down: the red line swings round until it runs <b>parallel</b> to the blue one, at ${T('k=-2')}.` : `Turn the dial up: the red line swings round until it crosses the blue one at a <b>right angle</b>, at ${T('k=8')}.`,
        run: async (c) => {
          const k0 = st.k;
          await tween(c, 2200, (q) => { st.k = k0 + (d.to - k0) * q; drawK(); setRo(false); });
          st.k = d.to; drawK(); setRo(true);
          if (d.v === 'perp') { const mk = rmark(G, X, [2, -1], [RUN, d.to], 15); mk.style.opacity = 0; await appear(c, mk); }
          const s = stamp(stage, d.v === 'par' ? 'parallel' : 'perpendicular', { ok: true, x: G.W / 2 + 14, y: 34 }); await stampIn(c, s);
        } },
      { cap: d.v === 'par' ? `With algebra: parallel means <b>equal slopes</b>, so ${T('\\dfrac{k}{4}=-\\dfrac12')}. Multiply both sides by 4: ${T('k=-2')}.` : `With algebra: the perpendicular slope is the <b>negative reciprocal</b> of ${T('-\\dfrac12')}, which is ${T('2')}. So ${T('\\dfrac{k}{4}=2')}, and ${T('k=8')}.`,
        run: async (c) => { for (let i = 0; i < d.alg.length; i++) await show(c, line(P, T(d.alg[i]), i === d.alg.length - 1 ? 'u6l9-big u6l9-ans' : 'u6l9-mline')); } }
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
  const mSteps = (nm, A, B) => { const dy = B[1] - A[1], dx = B[0] - A[0], raw = '\\dfrac{' + dy + '}{' + dx + '}', v = fr(dy, dx); return 'm_{' + nm + '}=\\dfrac{' + B[1] + '-' + pr(A[1]) + '}{' + B[0] + '-' + pr(A[0]) + '}=' + raw + (raw === v ? '' : '=' + v); };
  const times = (a, b) => a + '\\times' + (b.startsWith('-') ? '\\left(' + b + '\\right)' : b);
  // slopes p/q in lowest terms, small numbers; leave out the assignment's own slopes (2/3, −5, 4/9, −3/7) for the reps
  const AVOID = ['2/3', '-5/1', '4/9', '-3/7'];
  const SL = []; for (let q = 1; q <= 6; q++) for (let p = -6; p <= 6; p++) if (p !== 0 && g2(p, q) === 1 && !AVOID.includes(p + '/' + q)) SL.push([p, q]);
  const NAMES = [['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'], ['E', 'F', 'G', 'H'], ['J', 'K', 'L', 'M'], ['T', 'U', 'V', 'W']];
  const fits = (pts, lim = 9) => pts.every((v) => Math.abs(v[0]) <= lim && Math.abs(v[1]) <= lim);
  // a segment with slope p/q (step k), starting somewhere that keeps both ends on a ±9 grid
  const segWith = (r, p, q) => { for (;;) { const k = r.int(1, 2) * r.sign(), A = [r.int(-8, 8), r.int(-8, 8)], B = [A[0] + q * k, A[1] + p * k]; if (fits([A, B]) && (q * Math.abs(k) >= 2 || Math.abs(p * k) >= 2)) return k > 0 ? [A, B] : [B, A]; } };
  standup('u6l9', {
    intro: 'At your whiteboard station: find both slopes, then compare. Equal: parallel. Product −1: perpendicular.',
    levels: {
      BEG: (r) => {
        const [p, q] = r.pick(SL);
        if (r.chance(0.55)) {
          return { text: 'A line has the slope shown. State the slope of a line <b>parallel</b> to it and the slope of a line <b>perpendicular</b> to it.', q: 'm=' + fr(p, q),
            a: ['\\text{parallel: the same slope: } m=' + fr(p, q), '\\text{perpendicular: flip it and change the sign: } m=' + fr(-q, p), '\\text{check: } ' + times(fr(p, q), fr(-q, p)) + '=-1'] };
        }
        const kind = r.pick(['par', 'perp', 'perp', 'flip', 'sign']);
        const m2 = red(...(kind === 'par' ? [p, q] : kind === 'perp' ? [-q, p] : kind === 'flip' ? [q, p] : [-p, q]));
        const eq = m2[0] === p && m2[1] === q, perp = p * m2[0] === -q * m2[1];
        const verdict = eq ? '\\text{equal slopes: }\\textbf{parallel}' : perp ? times(fr(p, q), fr(...m2)) + '=-1:\\ \\textbf{perpendicular}'
          : times(fr(p, q), fr(...m2)) + '=' + fr(p * m2[0], q * m2[1]) + '\\ne-1:\\ \\textbf{neither}';
        return { text: 'For this pair of slopes, are the lines <b>parallel</b>, <b>perpendicular</b>, or <b>neither</b>?', q: 'm_1=' + fr(p, q) + ',\\quad m_2=' + fr(...m2), a: [verdict] };
      },
      PRG: (r) => { // are these two segments parallel?
        for (;;) {
          const [p, q] = r.pick(SL), on = r.chance(0.6), [A, B] = segWith(r, p, q);
          let [C, D] = segWith(r, p, q);
          if (!on) { D = [D[0], D[1] + r.pick([-1, 1])]; if (!fits([D]) || D[0] === C[0]) continue; }
          if ([A, B].some((v) => (v[0] === C[0] && v[1] === C[1]) || (v[0] === D[0] && v[1] === D[1]))) continue;
          if (on && (C[1] - A[1]) * q === (C[0] - A[0]) * p) continue; // same line: not a fair "parallel" question
          if (![A, B, C, D].some((v) => v[0] < 0 || v[1] < 0)) continue;
          const [a, b, c, d] = r.pick(NAMES), s1 = fr(B[1] - A[1], B[0] - A[0]), s2 = fr(D[1] - C[1], D[0] - C[0]);
          return { text: `Calculate both slopes. Are <i>${a}${b}</i> and <i>${c}${d}</i> parallel?`, q: P(a, A) + ',\\ ' + P(b, B) + '\\qquad ' + P(c, C) + ',\\ ' + P(d, D),
            a: [mSteps(a + b, A, B), mSteps(c + d, C, D), s1 === s2 ? '\\text{equal slopes: }\\textbf{parallel}' : s1 + '\\ne ' + s2 + ':\\ \\textbf{not parallel}'] };
        }
      },
      MAS: (r) => { // parallel, perpendicular, or neither, from coordinates
        for (;;) {
          const [p, q] = r.pick(SL), kind = r.pick(['par', 'perp', 'perp', 'nei']), [A, B] = segWith(r, p, q);
          const m2 = kind === 'par' ? [p, q] : kind === 'perp' ? [-q, p] : r.pick([[q, p], [-p, q], [p + 1, q]]);
          if (kind === 'nei' && (m2[0] * q === p * m2[1] || m2[0] * p === -q * m2[1] || m2[0] === 0)) continue;
          const [n2, d2] = red(m2[0], m2[1]); const [C, D] = segWith(r, n2, d2);
          if (![A, B, C, D].some((v) => v[0] < 0 || v[1] < 0)) continue;
          if (kind === 'par' && (C[1] - A[1]) * q === (C[0] - A[0]) * p) continue;
          const [a, b, c, d] = r.pick(NAMES), s1 = fr(B[1] - A[1], B[0] - A[0]), s2 = fr(D[1] - C[1], D[0] - C[0]);
          const verdict = s1 === s2 ? '\\text{equal slopes: }\\textbf{parallel}'
            : (B[1] - A[1]) * (D[1] - C[1]) === -(B[0] - A[0]) * (D[0] - C[0]) ? times(s1, s2) + '=-1:\\ \\textbf{perpendicular}'
              : times(s1, s2) + '=' + fr((B[1] - A[1]) * (D[1] - C[1]), (B[0] - A[0]) * (D[0] - C[0])) + ':\\ \\textbf{neither}';
          return { text: `Are <i>${a}${b}</i> and <i>${c}${d}</i> parallel, perpendicular, or neither? Show both slopes.`, q: P(a, A) + ',\\ ' + P(b, B) + '\\qquad ' + P(c, C) + ',\\ ' + P(d, D),
            a: [mSteps(a + b, A, B), mSteps(c + d, C, D), verdict] };
        }
      }
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountBoard();
mountFigures();
export const explainers = mountExplainers({ spin, translate, meet: meetEx, rotate, flipSign, perpTest, classify, dialK });
export const _test = { SPIN, TRANS, MEET, ROT, NR, PT_, CL, KD, frac, slopeOf };

/* ---------- Math History box: Recorde's equals sign (1557) ----------
 * "is equalle to" → two long twin lines → today's short "=" → tilted onto a grid (rise 4, run 8: both slopes 1/2).
 * Adapted from Math 10C 6.3. */
(function recordeEquals() {
  const svg = document.getElementById('u6l9-hist'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  const ease = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  const lerp = (a, b, u) => a + (b - a) * u;
  const U = 24, OX = 204, OY = 250, P = (x, y) => [OX + x * U, OY - y * U];
  const grid = mk('g', { class: 'u6l9h-grid' });
  for (let i = -1; i <= 9; i++) mk('line', { x1: OX + i * U, x2: OX + i * U, y1: OY + U, y2: OY - 8 * U }, grid);
  for (let j = -1; j <= 8; j++) mk('line', { x1: OX - U, x2: OX + 9 * U, y1: OY - j * U, y2: OY - j * U }, grid);
  txt('The Whetstone of Witte', { x: 40, y: 32, class: 'u6l9h-cap' });
  txt('1557', { x: 40, y: 62, class: 'u6l9h-year' });
  const note = txt('', { x: 562, y: 36, 'text-anchor': 'end', class: 'u6l9h-note' });
  const [b0, b1, t0p, t1p] = [P(0, 0), P(8, 4), P(0, 3), P(8, 7)];
  const triT = mk('g', { class: 'u6l9h-tri' }), triB = mk('g', { class: 'u6l9h-tri' });
  mk('path', { d: `M${t0p[0]} ${t0p[1]} V${t1p[1]} H${t1p[0]}`, class: 'u6l9h-leg' }, triT);
  txt('rise 4', { x: t0p[0] - 8, y: (t0p[1] + t1p[1]) / 2 + 5, 'text-anchor': 'end', class: 'u6l9h-lab' }, triT);
  txt('run 8', { x: (t0p[0] + t1p[0]) / 2, y: t1p[1] - 9, 'text-anchor': 'middle', class: 'u6l9h-lab' }, triT);
  mk('path', { d: `M${b0[0]} ${b0[1]} H${b1[0]} V${b1[1]}`, class: 'u6l9h-leg' }, triB);
  txt('run 8', { x: (b0[0] + b1[0]) / 2, y: b0[1] + 19, 'text-anchor': 'middle', class: 'u6l9h-lab' }, triB);
  txt('rise 4', { x: b1[0] + 8, y: (b0[1] + b1[1]) / 2 + 5, class: 'u6l9h-lab' }, triB);
  const slT = txt('m = 4/8 = 1/2', { x: t1p[0] + 14, y: t1p[1] + 18, class: 'u6l9h-slope' });
  const slB = txt('m = 4/8 = 1/2', { x: b1[0] + 14, y: b1[1] + 4, class: 'u6l9h-slope' });
  const eqL = txt('14x + 15', { x: 180, y: 160, 'text-anchor': 'end', class: 'u6l9h-eq' });
  const eqR = txt('71', { x: 420, y: 160, class: 'u6l9h-eq' });
  const words = txt('is equalle to', { x: 300, y: 158, 'text-anchor': 'middle', class: 'u6l9h-words' });
  const lnT = mk('line', { class: 'u6l9h-ln' }), lnB = mk('line', { class: 'u6l9h-ln' });
  const LONG = [[190, 140, 410, 140], [190, 162, 410, 162]];
  const DOT = [[300, 140, 300, 140], [300, 162, 300, 162]];
  const TILT = [[...t0p, ...t1p], [...b0, ...b1]];
  const SHORT = [[278, 143, 322, 143], [278, 159, 322, 159]];
  const mix = (A, B, u) => A.map((r, i) => r.map((v, j) => lerp(v, B[i][j], u)));
  const setLn = (S) => [lnT, lnB].forEach((l, i) => { l.setAttribute('x1', S[i][0]); l.setAttribute('y1', S[i][1]); l.setAttribute('x2', S[i][2]); l.setAttribute('y2', S[i][3]); });
  const op = (el, v) => { el.style.opacity = v; };
  const END = 10400;
  function draw(t) {
    const w = (a, b) => ease((t - a) / (b - a));
    let S = mix(DOT, LONG, w(1900, 2900));
    if (t >= 3600) S = mix(LONG, SHORT, w(3600, 5000));
    if (t >= 6000) S = mix(SHORT, TILT, w(6000, 7600));
    setLn(S); [lnT, lnB].forEach((l) => l.classList.toggle('u6l9h-gold', t >= 5000 && t < 6000));
    op(lnT, t >= 1900 ? 1 : 0); op(lnB, t >= 1900 ? 1 : 0);
    op(words, 1 - w(1200, 1800));
    const sh = w(3600, 5000);
    eqL.setAttribute('x', lerp(180, 264, sh)); eqR.setAttribute('x', lerp(420, 336, sh));
    const eqOp = 1 - w(5900, 6300); op(eqL, eqOp); op(eqR, eqOp);
    op(grid, w(6000, 6600));
    op(triT, w(7800, 8300)); op(triB, w(8200, 8700)); op(slT, w(8800, 9200)); op(slB, w(9000, 9400));
    note.textContent = t < 1200 ? 'in words' : t < 3600 ? 'twin lines of one length' : t < 6000 ? (t < 5000 ? '' : 'today’s =') : t < 7800 ? 'tilt the sign onto a grid' : 'equal slopes: parallel';
  }
  let st = 0, raf = 0;
  function frame(now) { if (!st) st = now; const t = Math.min(END, now - st); draw(t); if (t < END) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); st = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(END); return; }
    raf = requestAnimationFrame(frame);
  }
  draw(0);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
})();
