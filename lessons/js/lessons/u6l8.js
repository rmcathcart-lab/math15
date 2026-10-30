/* Math 15 · Unit 6 · Lesson 8 — Determining Collinearity Using Slope.
 * Warm-up: "Line Up the Shot" (an arcade grid: fire each laser from the launcher through its target; does it hit the bullseye?).
 * Explainers:
 *   ruler      (lay a ruler's edge through two points: does it touch the third? X, Y, Z; R, S, T; shot 1 fools the eye)
 *   collinear  (equal slopes + a shared point; different slopes bend; equal slopes but no shared point; Example 1 check)
 *   shots      (the three steps on the warm-up shots: launcher → target → bullseye)
 *   threeStep  (Examples 2 and 3: Step 1, Step 2, Step 3 boxes beside the grid)
 *   hinge      (swing the bent piece around the shared point until the slopes agree; where Example 3's I would have to be)
 *   missing    (Example 4: slide L up the line x = 8 until m_KL = m_JK, then the algebra)
 *   road       (Example 5: fire station, school, library on a town map; a straight road, or a bend)
 * Helpers (slopeOf, tri, the collinear explainer) come from Math 10C u6l3, trimmed to the Math 15 booklet.
 * Colours: run amber, rise purple, segments blue; collinear green, not collinear red. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  svgEl, liveCtx, pulse, drawIn, place, COLORS, col
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = COLORS.amber, PUR = COLORS.purple, BLUE = COLORS.blue, RED = COLORS.red, GRN = COLORS.green, INK = COLORS.ink;

/* =============================== helpers =============================== */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** simplified TeX for n/d (integers, d ≠ 0) */
function frac(n, d, small) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g;
  if (d === 1) return String(n);
  return (n < 0 ? '-' : '') + `\\${small ? 't' : 'd'}frac{${Math.abs(n)}}{${d}}`;
}
const par = (v) => (v < 0 ? `(${v})` : `${v}`);
/** slope working from P to Q: sub (the substitution), raw (rise/run), val (simplified) */
function slopeOf(P, Q) {
  const rise = Q[1] - P[1], run = Q[0] - P[0];
  const sub = `\\dfrac{${Q[1]}-${par(P[1])}}{${Q[0]}-${par(P[0])}}`, raw = `\\dfrac{${rise}}{${run}}`, val = frac(rise, run);
  const keep = run > 0 && gcd(Math.abs(rise), run) === 1;   // already in lowest terms: don't repeat it
  return { rise, run, sub, raw, val, m: rise / run, all: `${sub}=${raw}${raw === val || keep ? '' : '=' + val}` };
}
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u6l8-panel ' + cls, title ? `<div class="u6l8-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l8-line ' + cls, html); p.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const hid = (el) => { if (el) el.style.opacity = 0; return el; };
const unhide = (el) => { if (el) el.style.opacity = ''; return el; };
const dOf = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L');
function pth(parent, pts, color, o = {}) {
  const p = svgEl('path', { class: 'bk-stroke', d: dOf(pts), fill: 'none', stroke: color, 'stroke-width': o.w || 5, 'stroke-linecap': 'round' }, parent);
  if (o.dash) p.setAttribute('stroke-dasharray', o.dash);
  return p;
}
const ptLab = (n, x, y) => T(`${n}(${x},\\ ${y})`);
/** a slope triangle from P to Q: run (amber) along P's row, then rise (purple) up/down to Q. Redraws on setWindow. */
function tri(G, P, Q, o = {}) {
  const C = [Q[0], P[1]];
  const g = svgEl('g', { class: 'u6l8-tri' }, o.parent || G.layers.data);
  const fill = svgEl('path', { fill: o.fill || PUR, 'fill-opacity': 0.09, stroke: 'none' }, g);
  const seg = o.seg ? pth(g, [[0, 0], [1, 1]], col(o.seg), { w: 4.5 }) : null;
  const run = pth(g, [[0, 0], [1, 1]], AMB), rise = pth(g, [[0, 0], [1, 1]], PUR);
  G.track(g, () => {
    const p = G.toPx(...P), cc = G.toPx(...C), q = G.toPx(...Q);
    fill.setAttribute('d', dOf([p, cc, q]) + 'Z'); run.setAttribute('d', dOf([p, cc])); rise.setAttribute('d', dOf([cc, q]));
    if (seg) seg.setAttribute('d', dOf([p, q]));
  });
  const rn = Q[0] - P[0], rs = Q[1] - P[1];
  const rl = o.runLab === false ? null : G.label(P[0] + (C[0] - P[0]) * 0.5, P[1], o.runLab || T(`${rn}`), { pos: rs >= 0 ? 's' : 'n', cls: 'bk-ptlab u6l8-runlab', gap: 7 });
  const sl = o.riseLab === false ? null : G.label(C[0], C[1] + (Q[1] - C[1]) * 0.5, o.riseLab || T(`${rs}`), { pos: rn >= 0 ? 'e' : 'w', cls: 'bk-ptlab u6l8-riselab', gap: 7 });
  const t = { g, fill, seg, run, rise, rl, sl, labs: [rl, sl].filter(Boolean) };
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
const pt = (G, n, x, y, pos, o = {}) => G.point(x, y, Object.assign({ color: INK, r: 7, label: o.name ? T(n) : ptLab(n, x, y), pos }, o));
const done = async (c, P, text, ok) => { const s = stamp(P, text, { ok }); s.classList.add('u6l8-pstamp'); await stampIn(c, s); return s; };
const grid = (stage, win, o = {}) => new Graph(stage, Object.assign({ x: 14, y: 14, width: 440, height: 440, xlabels: 1, ylabels: 1, fontSize: 14 }, win, o));

/* =============================== warm-up: Line Up the Shot =============================== */
const LAUNCH = [2, 4];
const SHOTS = { 1: { T: [5, 6], B: [10, 9], c: '#7b4fc4' }, 2: { T: [6, 5], B: [14, 7], c: '#1f7fd6' }, 3: { T: [6, 2], B: [14, 1], c: '#12805a' } };
/** where the beam from L through P leaves the window */
function beamEnd(L, P, win) {
  const dx = P[0] - L[0], dy = P[1] - L[1]; let t = Infinity;
  if (dx > 0) t = Math.min(t, (win.xmax - L[0]) / dx);
  if (dy > 0) t = Math.min(t, (win.ymax - L[1]) / dy);
  if (dy < 0) t = Math.min(t, (win.ymin - L[1]) / dy);
  return [L[0] + dx * t, L[1] + dy * t];
}
function drawArcade(G, o = {}) {
  const top = G.layers.top;
  // launcher: a little cannon whose barrel tip sits at (2, 4)
  const [lx, ly] = G.toPx(...LAUNCH), u = G.ux;
  const lg = svgEl('g', {}, top);
  svgEl('rect', { x: lx - 0.75 * u, y: ly - 0.45 * u, width: 0.7 * u, height: 0.9 * u, rx: 4, fill: '#3b4a66' }, lg);
  svgEl('rect', { x: lx - 0.62 * u, y: ly - 0.3 * u, width: 0.42 * u, height: 0.6 * u, fill: '#ffecb3' }, lg);
  svgEl('rect', { x: lx - 0.1 * u, y: ly - 0.18 * u, width: 0.22 * u, height: 0.36 * u, fill: '#5d6b85' }, lg);
  svgEl('circle', { cx: lx, cy: ly, r: 4.5, fill: RED }, lg);
  if (o.launchLabel !== false) G.label(1.3, 3.2, 'Launcher', { pos: 'c', cls: 'u6l8-launch' });
  const marks = {};
  Object.entries(SHOTS).forEach(([k, s]) => {
    const [tx, ty] = G.toPx(...s.T), [bx, by] = G.toPx(...s.B);
    const tg = svgEl('g', {}, top);
    svgEl('circle', { cx: tx, cy: ty, r: 9, fill: '#fff', stroke: s.c, 'stroke-width': 2.5 }, tg); svgEl('circle', { cx: tx, cy: ty, r: 2.6, fill: INK }, tg);
    const bg = svgEl('g', {}, top);
    svgEl('circle', { cx: bx, cy: by, r: 11, fill: RED, stroke: INK, 'stroke-width': 1 }, bg); svgEl('circle', { cx: bx, cy: by, r: 7, fill: '#fff' }, bg); svgEl('circle', { cx: bx, cy: by, r: 3, fill: RED }, bg);
    const tag = (x, y, dx) => { const d = h('div', 'u6l8-shottag', k); d.style.background = s.c; G.html.appendChild(d); place(d, x + dx, y - 14, 'c', 0); return d; };
    marks[k] = { t: tag(tx, ty, 0), b: tag(bx, by, 22) };
  });
  return marks;
}
function mountArcade() {
  const host = document.getElementById('u6l8-arcade'); if (!host) return;
  const win = { xmin: 0, xmax: 15.4, ymin: 0, ymax: 10.4 };
  const G = new Graph(host, Object.assign({ width: 590, height: 400, xlabels: 1, ylabels: 1, fontSize: 13, origin: true }, win));
  svgEl('rect', { x: G.toPx(0, 0)[0], y: G.toPx(0, 10.4)[1], width: G.ux * 15.4, height: G.uy * 10.4, fill: '#e8f0fc' }, G.layers.bg);
  drawArcade(G);
  let drawn = [];
  const clear = () => { drawn.forEach((e) => e.remove()); drawn = []; };
  let busy = false;
  document.querySelectorAll('.u6l8 [data-shot]').forEach((b) => b.addEventListener('click', async () => {
    if (busy) return; busy = true;
    try {
      const k = b.dataset.shot, s = SHOTS[k], c = liveCtx(), end = beamEnd(LAUNCH, s.T, { xmin: 0, xmax: 15.4, ymin: 0, ymax: 10.4 });
      const beam = G.segment(LAUNCH, end, { color: '#ff3b6b', width: 4 }); beam.classList.add('u6l8-beam'); drawn.push(beam);
      await G.drawIn(beam, 900, c);
      const m = (s.T[1] - LAUNCH[1]) / (s.T[0] - LAUNCH[0]), yAt = LAUNCH[1] + m * (s.B[0] - LAUNCH[0]);
      const hit = Math.abs(yAt - s.B[1]) < 1e-9;
      const lab = G.label(s.B[0], s.B[1], hit ? 'SCORE!' : 'miss', { pos: hit ? 's' : 'sw', cls: 'u6l8-score ' + (hit ? 'u6l8-hit' : 'u6l8-miss'), gap: 14 });
      drawn.push(lab); await pop(c, lab);
    } finally { busy = false; }
  }));
  document.getElementById('u6l8-clear').addEventListener('click', () => { if (!busy) clear(); });
}

/* =============================== static figures =============================== */
function mountFigures() {
  const mk = (id) => { const el = document.getElementById(id); return el ? new Graph(el, { width: 330, height: 240, xmin: 0, xmax: 6.5, ymin: 0, ymax: 4.6, xlabels: 1, ylabels: 1, fontSize: 14 }) : null; };
  let G = mk('u6l8-fxyz');
  if (G) { G.segment([1, 1], [5, 3], { color: BLUE, width: 4 }); [['X', 1, 1, 's'], ['Y', 3, 2, 'nw'], ['Z', 5, 3, 's']].forEach(([n, x, y, p]) => G.point(x, y, { color: INK, r: 6, label: T(n), pos: p })); }
  G = mk('u6l8-frst');
  if (G) { G.polyline([[1, 1], [3, 4], [5, 2]], { color: RED, width: 4 }); [['R', 1, 1, 's'], ['S', 3, 4, 'e'], ['T', 5, 2, 's']].forEach(([n, x, y, p]) => G.point(x, y, { color: INK, r: 6, label: T(n), pos: p })); }
}

/* =============================== explainer: the ruler =============================== */
const RU = {
  xyz: { label: 'X, Y, Z', win: { xmin: 0, xmax: 6.5, ymin: 0, ymax: 4.6 }, size: [500, 360], pts: [['X', 1, 1, 's'], ['Y', 3, 2, 'nw'], ['Z', 5, 3, 's']] },
  rst: { label: 'R, S, T', win: { xmin: 0, xmax: 6.5, ymin: 0, ymax: 4.6 }, size: [500, 360], pts: [['R', 1, 1, 's'], ['S', 3, 4, 'e'], ['T', 5, 2, 's']] },
  fooled: { label: 'Shot 1: eyes fooled', win: { xmin: 0, xmax: 11, ymin: 0, ymax: 10 }, size: [470, 440], pts: [['launcher', 2, 4, 'nw'], ['target', 5, 6, 'nw'], ['bullseye', 10, 9, 'nw']] }
};
/** a ruler whose top edge passes through graph points A and B (pivot A, turned by st.off degrees) */
function ruler(G, A, B) {
  const g = svgEl('g', { class: 'u6l8-ruler' }, G.layers.top), st = { A, B, off: 0 };
  g.style.transformBox = 'view-box'; g.style.transformOrigin = '0 0'; // rotate about the pivot, not the group's centre
  const body = svgEl('rect', { fill: '#f2c14e', 'fill-opacity': 0.55, stroke: '#b8860b', 'stroke-width': 1.5, rx: 3 }, g);
  const ticks = svgEl('path', { stroke: '#8a6408', 'stroke-width': 1.4, fill: 'none' }, g);
  const edge = svgEl('line', { stroke: '#5b4300', 'stroke-width': 2.5 }, g);
  G.track(g, () => {
    const p = G.toPx(...st.A), q = G.toPx(...st.B), L = Math.hypot(q[0] - p[0], q[1] - p[1]), m = 46, th = 30;
    const ang = Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI + st.off;
    g.setAttribute('transform', `translate(${p[0]} ${p[1]}) rotate(${ang})`);
    body.setAttribute('x', -m); body.setAttribute('y', 0); body.setAttribute('width', L + 2 * m); body.setAttribute('height', th);
    edge.setAttribute('x1', -m); edge.setAttribute('x2', L + m); edge.setAttribute('y1', 0); edge.setAttribute('y2', 0);
    let d = ''; for (let x = -m + 8; x < L + m; x += 12) d += `M${x} 0 v${(Math.round((x + m) / 12) % 5) ? 7 : 13}`;
    ticks.setAttribute('d', d);
  });
  g.st = st;
  return g;
}
/** perpendicular distance (graph units, vertical) of P from the line through A and B, measured straight up/down */
const offBy = (A, B, P) => P[1] - (A[1] + (B[1] - A[1]) / (B[0] - A[0]) * (P[0] - A[0]));
const rulerEx = {
  title: 'Lay a ruler on the points',
  height: 470,
  minW: 860,
  choices: Object.keys(RU).map((k) => ({ v: k, label: RU[k].label })),
  intro: 'Line up a ruler’s edge with two of the points. Does it touch the third? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RU[k], [W, H] = d.size;
    const G = new Graph(stage, Object.assign({ x: 14, y: 14 + (440 - H) / 2, width: W, height: H, xlabels: 1, ylabels: 1, fontSize: 14 }, d.win));
    const P = panel(stage, W + 32, 14, ex.W - W - 46, 440, k === 'fooled' ? 'Warm-up shot 1' : 'The ruler test');
    const PT = d.pts.map(([n, x, y]) => [x, y]);
    const pts = d.pts.map(([n, x, y, pos]) => pt(G, n, x, y, pos, k === 'fooled' ? { label: n, r: 6, labelCls: 'u6l8-word' } : { name: true }));
    const lay = async (c, i, j, from = 24) => { const r = ruler(G, PT[i], PT[j]); r.st.off = from; r._bkDraw(); hid(r); await appear(c, r, 250); await tween(c, 900, (t) => { r.st.off = from * (1 - t); r._bkDraw(); }); r.st.off = 0; r._bkDraw(); return r; };
    const colorPt = (p, c2) => p.querySelector('circle').setAttribute('fill', c2);
    if (k === 'xyz') return [
      { cap: `Three points: ${T('X(1,\\ 1)')}, ${T('Y(3,\\ 2)')} and ${T('Z(5,\\ 3)')}.`, run: async (c) => { await show(c, line(P, `${T('X')}, ${T('Y')}, ${T('Z')}`)); } },
      { cap: `Lay a ruler’s edge through ${T('X')} and ${T('Z')}, the two outside points.`, run: async (c) => { await lay(c, 0, 2); await show(c, line(P, `edge through ${T('X')} and ${T('Z')}`)); } },
      { cap: `The edge touches ${T('Y')} too. One straight line passes through all three: they are <b>collinear</b>.`,
        run: async (c) => { colorPt(pts[1], GRN); await pulse(c, pts[1].label, 1.4); await show(c, line(P, `it touches ${T('Y')} too`, 'u6l8-good')); await done(c, P, 'collinear ✓', true); } }
    ];
    if (k === 'rst') {
      let r1 = null;
      return [
        { cap: `Three points: ${T('R(1,\\ 1)')}, ${T('S(3,\\ 4)')} and ${T('T(5,\\ 2)')}.`, run: async (c) => { await show(c, line(P, `${T('R')}, ${T('S')}, ${T('T')}`)); } },
        { cap: `Ruler through ${T('R')} and ${T('S')}: ${T('T')} sits far off to the side.`,
          run: async (c) => { r1 = await lay(c, 0, 1); colorPt(pts[2], RED); await show(c, line(P, `through ${T('R')}, ${T('S')}: misses ${T('T')}`, 'u6l8-bad')); } },
        { cap: `Try ${T('R')} and ${T('T')} instead: now ${T('S')} is off the line.`,
          run: async (c) => { if (r1) r1.style.opacity = 0.15; colorPt(pts[2], INK); await lay(c, 0, 2, -20); colorPt(pts[1], RED); await show(c, line(P, `through ${T('R')}, ${T('T')}: misses ${T('S')}`, 'u6l8-bad')); } },
        { cap: `No ruler position touches all three: the path <b>bends</b> at ${T('S')}. They are <b>not collinear</b>.`,
          run: async (c) => { await G.drawIn(G.polyline([PT[0], PT[1], PT[2]], { color: RED, width: 3, dash: '8 6' }), 700, c); await done(c, P, 'not collinear ✗', false); } }
      ];
    }
    // fooled: shot 1
    let r = null;
    const gap = offBy(PT[0], PT[2], PT[1]);           // target above the launcher–bullseye line by 1/8
    return [
      { cap: `Warm-up shot 1: launcher ${T('(2,\\ 4)')}, target ${T('(5,\\ 6)')}, bullseye ${T('(10,\\ 9)')}.`, run: async (c) => { await show(c, line(P, `${T('(2,\\ 4)')}, ${T('(5,\\ 6)')}, ${T('(10,\\ 9)')}`)); } },
      { cap: `Ruler through the launcher and the bullseye. It <b>seems</b> to touch the target as well…`, run: async (c) => { r = await lay(c, 0, 2); await show(c, line(P, 'looks collinear…')); } },
      { cap: `Zoom in on the target. It sits ${T('\\tfrac{1}{8}')} of a square <b>above</b> the edge! The ruler line passes ${T('x=5')} at ${T('y=5\\tfrac{7}{8}')}.`,
        run: async (c) => {
          await G.setWindow({ xmin: 4.4, xmax: 5.6, ymin: 5.35, ymax: 6.45 }, c, 1400);
          G.label(5, 6 - gap / 2, T('\\tfrac{1}{8}'), { pos: 'e', cls: 'bk-ptlab u6l8-gaplab', gap: 10 });
          await G.drawIn(G.segment([5, 6 - gap], [5, 6], { color: RED, width: 3 }), 400, c);
          await show(c, line(P, `off by ${T('\\tfrac{1}{8}')} of a square`, 'u6l8-bad'));
        } },
      { cap: `Slopes don’t get fooled: launcher to target ${T('\\tfrac{2}{3}')}, target to bullseye ${T('\\tfrac{3}{5}')}. Different, so <b>not collinear</b>.`,
        run: async (c) => { await show(c, line(P, T('\\tfrac{2}{3}\\neq\\tfrac{3}{5}'), 'u6l8-big')); await done(c, P, 'not collinear ✗', false); void r; } }
    ];
  }
};

/* =============================== explainer: the slope test (from 10C u6l3) =============================== */
const COL = {
  yes: { label: 'Same slope, shared point', win: { xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5 }, pts: [['P', -4, -3, 'se'], ['Q', 0, -1, 'sw'], ['R', 4, 1, 'nw']], pairs: [[0, 1], [1, 2]], share: 1, v: 'col' },
  bend: { label: 'Different slopes', win: { xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5 }, pts: [['P', -5, -3, 'se'], ['Q', -1, 1, 'nw'], ['R', 5, 3, 'nw']], pairs: [[0, 1], [1, 2]], share: 1, v: 'bend' },
  par: { label: 'Same slope, no shared point', win: { xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5 }, pts: [['G', -5, 1, 'se'], ['H', 1, 4, 'nw'], ['I', -3, -4, 'se'], ['J', 5, 0, 'sw']], pairs: [[0, 1], [2, 3]], segs: [[0, 1], [2, 3]], v: 'par' },
  ex1: { label: 'Example 1 check', win: { xmin: -0.5, xmax: 7.5, ymin: -0.5, ymax: 13.5 }, pts: [['A', 1, 2, 'nw'], ['B', 3, 6, 'nw'], ['C', 6, 12, 'nw']], pairs: [[0, 1], [1, 2]], share: 1, v: 'col', ylab: 2 }
};
const collinear = {
  title: 'The slope test: equal slopes and a shared point',
  height: 470,
  minW: 860,
  choices: Object.keys(COL).map((k) => ({ v: k, label: COL[k].label })),
  intro: 'Are these points on one straight line? Measure the slope between pairs of points. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = COL[k];
    const G = grid(stage, d.win, { ylabels: d.ylab || 1 });
    const P = panel(stage, 474, 14, ex.W - 488, 440, k === 'ex1' ? 'Example 1' : 'Slopes');
    const PT = d.pts.map(([n, x, y]) => [x, y]);
    (d.segs || []).forEach(([i, j]) => G.segment(PT[i], PT[j], { color: BLUE, width: 4 }));
    const pts = d.pts.map(([n, x, y, pos]) => pt(G, n, x, y, pos));
    const S = d.pairs.map(([i, j]) => slopeOf(PT[i], PT[j]));
    const mName = (i, j) => `m_{${d.pts[i][0]}${d.pts[j][0]}}`;
    let t = null;
    const steps = d.pairs.map(([i, j], q) => ({
      cap: `${T(d.pts[i][0] + d.pts[j][0])}: rise ${T(String(S[q].rise))}, run ${T(String(S[q].run))}, slope ${T(S[q].val)}.${q && S[q].val !== S[0].val ? ' <b>Different!</b>' : q ? ' The same slope.' : ''}`,
      run: async (c) => {
        dropTri(t); t = tri(G, PT[i], PT[j]); await showTri(c, t, 380);
        await show(c, line(P, T(`${mName(i, j)}=${S[q].all}`), q && S[q].val !== S[0].val ? 'u6l8-bad' : ''));
      }
    }));
    if (d.v === 'col') {
      steps.push({ cap: `${T(`${mName(0, 1)}=${mName(1, 2)}`)} <b>and</b> the two segments share the point ${T(d.pts[d.share][0])}.`,
        run: async (c) => { dropTri(t); t = null; await pulse(c, pts[d.share].label, 1.3); await show(c, line(P, `Equal slopes <b>and</b> shared point ${T(d.pts[d.share][0])}`, 'u6l8-rulebox')); } });
      steps.push({ cap: `So one straight line passes through all three points: they are <b>collinear</b>.`,
        run: async (c) => { await G.drawIn(G.line(PT[0], PT[2], { color: GRN, width: 3 }), 800, c); await done(c, P, 'collinear ✓', true); } });
    } else if (d.v === 'par') {
      steps.push({ cap: `Equal slopes, but ${T('GH')} and ${T('IJ')} share <b>no point</b>. Extend them: two different lines that never meet.`,
        run: async (c) => { dropTri(t); t = null; for (const [i, j] of d.segs) await G.drawIn(G.line(PT[i], PT[j], { color: BLUE, width: 2.5, dash: '10 7' }), 700, c); await show(c, line(P, 'Equal slopes, <b>no shared point</b>', 'u6l8-rulebox')); } });
      steps.push({ cap: `That’s why the test uses a <b>shared</b> middle point. (Equal slopes on their own make <b>parallel</b> lines: that’s Lesson 9.)`,
        run: async (c) => done(c, P, 'parallel, not collinear', null) });
    } else {
      steps.push({ cap: `The slopes are different, so the path <b>bends</b> at ${T('Q')}. No single line passes through all three points.`,
        run: async (c) => { dropTri(t); t = null; await G.drawIn(G.polyline([PT[0], PT[1], PT[2]], { color: RED, width: 3 }), 800, c); await done(c, P, 'not collinear ✗', false); } });
    }
    return steps;
  }
};

/* =============================== explainer: the warm-up shots, three steps =============================== */
const shots = {
  title: 'Three steps on the warm-up shots',
  height: 470,
  minW: 860,
  choices: Object.keys(SHOTS).map((k) => ({ v: k, label: 'Shot ' + k })),
  intro: 'Launcher, target and bullseye are three points. The shot scores only if they are <b>collinear</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const s = SHOTS[k], win = { xmin: 0, xmax: 15.4, ymin: 0, ymax: 10.4 };
    const G = new Graph(stage, Object.assign({ x: 14, y: 40, width: 540, height: 380, xlabels: 1, ylabels: 1, fontSize: 13, origin: true }, win));
    svgEl('rect', { x: G.toPx(0, 0)[0], y: G.toPx(0, 10.4)[1], width: G.ux * 15.4, height: G.uy * 10.4, fill: '#e8f0fc' }, G.layers.bg);
    drawArcade(G);
    const P = panel(stage, 570, 14, ex.W - 584, 440, 'Shot ' + k);
    const s1 = slopeOf(LAUNCH, s.T), s2 = slopeOf(s.T, s.B), same = s1.val === s2.val;
    let t = null;
    return [
      { cap: `<b>Step 1</b>, launcher to target: rise ${T(String(s1.rise))}, run ${T(String(s1.run))}. ${T(`m=${s1.all.split('=').slice(1).join('=')}`)}.`,
        run: async (c) => { t = tri(G, LAUNCH, s.T); await showTri(c, t, 380); await show(c, line(P, `Step 1: ${T(`${s1.sub}=${s1.val}`)}`)); } },
      { cap: `<b>Step 2</b>, target to bullseye: rise ${T(String(s2.rise))}, run ${T(String(s2.run))}. ${T(`m=${s2.all.split('=').slice(1).join('=')}`)}.`,
        run: async (c) => { dropTri(t); t = tri(G, s.T, s.B); await showTri(c, t, 380); await show(c, line(P, `Step 2: ${T(`${s2.sub}=${s2.val}`)}`, same ? '' : 'u6l8-bad')); } },
      { cap: same ? `<b>Step 3</b>: ${T(`${s1.val}=${s2.val}`)}, and the target is shared. Collinear: one straight beam hits both. <b>Score!</b>`
        : `<b>Step 3</b>: ${T(`${s1.val}\\neq${s2.val}`)}. Not collinear: the beam would have to bend at the target. <b>Miss.</b>`,
      run: async (c) => {
        dropTri(t); t = null;
        const beam = G.segment(LAUNCH, beamEnd(LAUNCH, s.T, win), { color: '#ff3b6b', width: 4 }); beam.classList.add('u6l8-beam'); await G.drawIn(beam, 900, c);
        await show(c, line(P, `Step 3: ${T(same ? `${s1.val}=${s2.val}` : `${s1.val}\\neq${s2.val}`)}`, same ? 'u6l8-good u6l8-big' : 'u6l8-bad u6l8-big'));
        await done(c, P, same ? 'collinear: score!' : 'not collinear: miss', same);
      } }
    ];
  }
};

/* =============================== explainer: three steps, Examples 2 and 3 =============================== */
const TS = {
  ex2: { label: 'Example 2 check', pts: [['D', -3, -4, 'nw'], ['E', 1, 0, 'nw'], ['F', 5, 4, 'nw']] },
  ex3: { label: 'Example 3 check', pts: [['G', -2, 5, 'w'], ['H', 0, 1, 'sw'], ['I', 3, -2, 'e']] }
};
const threeStep = {
  title: 'Step 1, Step 2, Step 3',
  height: 470,
  minW: 860,
  choices: Object.keys(TS).map((k) => ({ v: k, label: TS[k].label })),
  intro: 'Two slopes that share the middle point, then compare. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TS[k], PT = d.pts.map(([n, x, y]) => [x, y]), N = d.pts.map((p) => p[0]);
    const G = grid(stage, { xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5 });
    const P = panel(stage, 474, 14, ex.W - 488, 440, k === 'ex2' ? 'Example 2' : 'Example 3');
    const box3 = [1, 2, 3].map((i) => { const b = h('div', 'u6l8-sbox', `<div class="u6l8-sh"><b>Step ${i}</b> ${i === 1 ? T(`m_{${N[0]}${N[1]}}`) : i === 2 ? T(`m_{${N[1]}${N[2]}}`) : 'compare'}</div><div class="u6l8-sv"></div>`); P.appendChild(b); return b; });
    const pts = d.pts.map(([n, x, y, pos]) => pt(G, n, x, y, pos));
    const s1 = slopeOf(PT[0], PT[1]), s2 = slopeOf(PT[1], PT[2]), same = s1.val === s2.val;
    let t = null;
    const fillBox = async (c, b, html, cls) => { const v = b.querySelector('.u6l8-sv'); v.innerHTML = html; b.classList.add('on'); if (cls) b.classList.add(cls); await pop(c, v); };
    return [
      { cap: `<b>Step 1:</b> ${T(`m_{${N[0]}${N[1]}}=${s1.all}`)}.`,
        run: async (c) => { t = tri(G, PT[0], PT[1], { seg: BLUE }); await showTri(c, t, 380); await fillBox(c, box3[0], T(s1.all)); } },
      { cap: `<b>Step 2:</b> ${T(`m_{${N[1]}${N[2]}}=${s2.all}`)}. It shares the middle point ${T(N[1])}.`,
        run: async (c) => { if (t) t.g.style.opacity = 0.35; const t2 = tri(G, PT[1], PT[2], { seg: same ? BLUE : RED }); await showTri(c, t2, 380); await pulse(c, pts[1].label, 1.3); await fillBox(c, box3[1], T(s2.all), same ? '' : 'bad'); } },
      { cap: same ? `<b>Step 3:</b> ${T(`${s1.val}=${s2.val}`)} and they share ${T(N[1])}. <b>Yes</b>: ${T(N.join(','))} are collinear.`
        : `<b>Step 3:</b> ${T(`${s1.val}\\neq${s2.val}`)}, so the path bends at ${T(N[1])}. <b>No</b>: ${T(N.join(','))} are not collinear.`,
      run: async (c) => {
        if (same) await G.drawIn(G.line(PT[0], PT[2], { color: GRN, width: 3 }), 800, c);
        await fillBox(c, box3[2], same ? `${T(`${s1.val}=${s2.val}`)}: <b class="u6l8-yes">collinear</b>` : `${T(`${s1.val}\\neq${s2.val}`)}: <b class="u6l8-no">not collinear</b>`, same ? 'good' : 'bad');
      } }
    ];
  }
};

/* =============================== explainer: the hinge =============================== */
const HG = {
  bend: { label: 'Straighten the bend', A: ['A', -4, -3, 'nw'], B: ['B', 0, -1, 'nw'], C: ['C', 3, 3, 'e'], to: [4, 1], swing: true },
  ex3: { label: 'Example 3: where should I be?', A: ['G', -2, 5, 'ne'], B: ['H', 0, 1, 'ne'], C: ['I', 3, -2, 'e'], to: [3, -5], swing: false }
};
const hinge = {
  title: 'Straighten the bend at the shared point',
  height: 470,
  minW: 860,
  choices: Object.keys(HG).map((k) => ({ v: k, label: HG[k].label })),
  intro: (k) => (HG[k].swing ? 'Two segments meet at a shared point. Swing the second one until the slopes agree. Press <b>Next</b>.' : 'In Example 3 the path bends at H. Slide I until it lines up. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = HG[k], A = [d.A[1], d.A[2]], B = [d.B[1], d.B[2]], C0 = [d.C[1], d.C[2]], C1 = d.to, nA = d.A[0], nB = d.B[0], nC = d.C[0];
    const G = grid(stage, { xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5 });
    const P = panel(stage, 474, 14, ex.W - 488, 440, k === 'ex3' ? 'Example 3' : 'The hinge');
    const s1 = slopeOf(A, B), s2 = slopeOf(B, C0), s3 = slopeOf(B, C1);
    G.segment(A, B, { color: BLUE, width: 4.5 });
    pt(G, nA, A[0], A[1], d.A[3], { name: true }); const pB = pt(G, nB, B[0], B[1], d.B[3], { name: true });
    const st = { p: C0.slice() };
    let seg = null, pC = null, t = null, ro = null;
    const roHtml = () => { const rs = st.p[1] - B[1], rn = st.p[0] - B[0], m = rs / rn; return T(`m_{${nB}${nC}}\\approx${(Math.round(m * 100) / 100).toString().replace('-', '-')}`); };
    return [
      { cap: `${T(`m_{${nA}${nB}}=${s1.all}`)}.`,
        run: async (c) => { t = tri(G, A, B); await showTri(c, t, 380); await show(c, line(P, T(`m_{${nA}${nB}}=${s1.val}`), 'u6l8-big')); } },
      { cap: `${T(`m_{${nB}${nC}}=${s2.all}`)}. Not equal: the path <b>bends</b> at ${T(nB)}.`,
        run: async (c) => {
          dropTri(t); t = null;
          seg = G.curve(() => ({ subs: [[G.toPx(...B), G.toPx(...st.p)]] }), { color: RED, width: 4.5 }, 'bk-seg', G.layers.data);
          await G.drawIn(seg, 500, c);
          pC = G.point(C0[0], C0[1], { color: RED, r: 8, label: T(nC), pos: d.C[3] });
          await G.reveal(pC, c);
          await show(c, line(P, T(`m_{${nB}${nC}}=${s2.val}`), 'u6l8-big u6l8-bad'));
        } },
      { cap: d.swing ? `Swing ${T(nC)} around ${T(nB)}, the shared point, until ${T(`m_{${nB}${nC}}`)} is ${T(s1.val)} too. It lands on ${T(`${nC}(${C1[0]},\\ ${C1[1]})`)}.`
        : `Keep ${T('x=3')} and slide ${T(nC)} down until ${T(`m_{${nB}${nC}}=${s1.val}`)}. It would have to be at ${T(`(${C1[0]},\\ ${C1[1]})`)}, not ${T(`(${C0[0]},\\ ${C0[1]})`)}.`,
      run: async (c) => {
        ro = line(P, roHtml(), 'u6l8-ro'); await show(c, ro);
        if (!d.swing) await G.drawIn(G.vline(C0[0], { color: 'gray', width: 2 }), 400, c);
        const r0 = Math.hypot(C0[0] - B[0], C0[1] - B[1]), r1 = Math.hypot(C1[0] - B[0], C1[1] - B[1]);
        const a0 = Math.atan2(C0[1] - B[1], C0[0] - B[0]), a1 = Math.atan2(C1[1] - B[1], C1[0] - B[0]);
        await tween(c, 1800, (u) => {
          st.p = d.swing ? [B[0] + (r0 + (r1 - r0) * u) * Math.cos(a0 + (a1 - a0) * u), B[1] + (r0 + (r1 - r0) * u) * Math.sin(a0 + (a1 - a0) * u)] : [C0[0], C0[1] + (C1[1] - C0[1]) * u];
          seg._bkDraw(); G.moveTo(pC, st.p[0], st.p[1]); ro.innerHTML = roHtml();
        });
        st.p = C1.slice(); seg._bkDraw(); G.moveTo(pC, C1[0], C1[1]);
        ro.innerHTML = T(`m_{${nB}${nC}}=${s3.all}`); ro.classList.add('u6l8-good');
        seg.path.setAttribute('stroke', GRN); pC.querySelector('circle').setAttribute('fill', GRN); await pulse(c, ro, 1.05);
      } },
      { cap: d.swing ? `Now ${T(`m_{${nA}${nB}}=m_{${nB}${nC}}=${s1.val}`)} and they share ${T(nB)}: one straight line. <b>Collinear!</b>`
        : `Only ${T(`(${C1[0]},\\ ${C1[1]})`)} would line up with ${T(nA)} and ${T(nB)}. The real ${T(`${nC}(${C0[0]},\\ ${C0[1]})`)} is 3 squares too high: <b>not collinear</b>.`,
      run: async (c) => {
        await G.drawIn(G.line(A, C1, { color: GRN, width: 2.5, dash: '9 6' }), 700, c); void pB;
        if (!d.swing) { const g = G.point(C0[0], C0[1], { color: RED, r: 7, label: T(`(${C0[0]},\\ ${C0[1]})`), pos: 'e' }); await G.reveal(g, c); }
        await done(c, P, d.swing ? 'collinear ✓' : 'real I: not collinear', d.swing ? true : false);
      } }
    ];
  }
};

/* =============================== explainer: a missing coordinate (from 10C u6l3) =============================== */
const MISS = {
  ex4: { label: 'Example 4 check', A: ['J', 2, 3, 'nw'], B: ['K', 5, 9, 'nw'], C: 'L', cx: 8, from: 11, to: 15, win: { xmin: -0.5, xmax: 9.5, ymin: -0.5, ymax: 17.5 }, ylab: 2,
    alg: ['\\dfrac{k-9}{8-5}=2', '\\dfrac{k-9}{3}=2', 'k-9=6', 'k=15'], check: 'm_{JL}=\\dfrac{15-3}{8-2}=\\dfrac{12}{6}=2\\ \\checkmark' },
  demo: { label: 'Demo: ' + T('C(6,\\ k)'), A: ['A', 0, 1, 'se'], B: ['B', 2, 4, 'nw'], C: 'C', cx: 6, from: 6, to: 10, win: { xmin: -0.5, xmax: 7.5, ymin: -0.5, ymax: 12.5 }, ylab: 2,
    alg: ['\\dfrac{k-4}{6-2}=\\dfrac{3}{2}', '\\dfrac{k-4}{4}=\\dfrac{3}{2}', 'k-4=6', 'k=10'], check: 'm_{AC}=\\dfrac{10-1}{6-0}=\\dfrac{9}{6}=\\dfrac{3}{2}\\ \\checkmark' }
};
const missing = {
  title: 'A missing coordinate',
  height: 470,
  minW: 860,
  choices: Object.keys(MISS).map((k) => ({ v: k, label: MISS[k].label })),
  intro: (k) => `The point ${T(`${MISS[k].C}(${MISS[k].cx},\\ k)`)} must line up with the other two. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = MISS[k], [an, ax, ay, ap] = d.A, [bn, bx, by, bp] = d.B, A = [ax, ay], B = [bx, by];
    const G = grid(stage, d.win, { ylabels: d.ylab || 1 });
    const P = panel(stage, 474, 14, ex.W - 488, 440, 'Find ' + T('k'));
    const s = slopeOf(A, B);
    G.segment(A, B, { color: BLUE, width: 4.5 }); pt(G, an, ax, ay, ap); pt(G, bn, bx, by, bp);
    const st = { y: d.from };
    let Cp, seg, ro;
    const roHtml = () => T(`k=${st.y}:\\ m_{${bn}${d.C}}=\\dfrac{${st.y}-${by}}{${d.cx}-${bx}}=${frac(st.y - by, d.cx - bx)}`);
    return [
      { cap: `First the known slope: ${T(`m_{${an}${bn}}=${s.all}`)}.`,
        run: async (c) => { await show(c, line(P, T(`m_{${an}${bn}}=${s.val}`), 'u6l8-big')); } },
      { cap: `${T(d.C)} has x-coordinate ${T(String(d.cx))}, so it sits somewhere on the line ${T(`x=${d.cx}`)}. Try ${T(`k=${d.from}`)}: the slope from ${T(bn)} is ${T(frac(d.from - by, d.cx - bx))}. Not ${T(s.val)}.`,
        run: async (c) => {
          await G.drawIn(G.vline(d.cx, { color: 'gray', width: 2 }), 500, c);
          seg = G.curve(() => ({ subs: [[G.toPx(bx, by), G.toPx(d.cx, st.y)]] }), { color: RED, width: 3.5, dash: '9 7' }, 'u6l8-try', G.layers.data);
          Cp = G.point(d.cx, st.y, { color: RED, r: 8, label: T(`${d.C}(${d.cx},\\ k)`), pos: 'e' });
          await G.drawIn(seg, 500, c); await G.reveal(Cp, c);
          ro = line(P, roHtml(), 'u6l8-ro'); await show(c, ro);
        } },
      { cap: `Slide ${T(d.C)} up the line ${T(`x=${d.cx}`)}, watching its slope from ${T(bn)}… it matches when ${T(`k=${d.to}`)}: the slope is ${T(s.val)}.`,
        run: async (c) => {
          for (let y = d.from + 1; y <= d.to; y++) { st.y = y; seg._bkDraw(); G.moveTo(Cp, d.cx, y); ro.innerHTML = roHtml(); await sleep(c, 260); }
          Cp.querySelector('circle').setAttribute('fill', GRN); seg.path.setAttribute('stroke', GRN); ro.classList.add('u6l8-good'); await pulse(c, ro, 1.05);
        } },
      { cap: `Algebra goes straight there: <b>set the slope with ${T('k')} in it equal to</b> ${T(s.val)} and solve. ${T(`k=${d.to}`)}.`,
        run: async (c) => { for (const a of d.alg) await show(c, line(P, T(a), a === d.alg[d.alg.length - 1] ? 'u6l8-big u6l8-good' : 'u6l8-mline')); } },
      { cap: `Check with the outside points: ${T(d.check)}`,
        run: async (c) => { await G.drawIn(G.line(A, [d.cx, d.to], { color: GRN, width: 2.5 }), 700, c); await show(c, line(P, T(d.check), 'u6l8-mline')); } }
    ];
  }
};

/* =============================== explainer: one straight road? =============================== */
const RD = {
  ex5: { label: 'Example 5 check', L: [12, 18] },
  moved: { label: 'Library at (12, 17)?', L: [12, 17] }
};
const road = {
  title: 'One straight road?',
  height: 470,
  minW: 860,
  choices: Object.keys(RD).map((k) => ({ v: k, label: RD[k].label })),
  intro: 'A town map, each unit 1 km. Can one straight road join all three places? Press <b>Next</b>.',
  make(stage, k, ex) {
    const F = [2, 3], S = [6, 9], L = RD[k].L;
    const G = new Graph(stage, { x: 14, y: 14, width: 440, height: 440, xmin: -0.5, xmax: 13.5, ymin: -0.5, ymax: 19.5, xlabels: 2, ylabels: 2, fontSize: 14 });
    svgEl('rect', { x: G.toPx(-0.5, 0)[0], y: G.toPx(0, 19.5)[1], width: G.ux * 14, height: G.uy * 20, fill: '#eef6e6' }, G.layers.bg);
    const P = panel(stage, 474, 14, ex.W - 488, 440, k === 'ex5' ? 'Example 5' : 'What if…?');
    const place3 = [['F', F, 'Fire Station', '#c93a33'], ['S', S, 'School', '#1f5bd6'], ['L', L, 'Library', '#7b4fc4']];
    place3.forEach(([n, p, name, c2]) => { G.point(p[0], p[1], { color: c2, r: 8 }); G.label(p[0], p[1], `<b>${n}</b> ${name} ${T(`(${p[0]},\\ ${p[1]})`)}`, { pos: n === 'L' ? 'w' : 'e', cls: 'u6l8-place', gap: 12 }); });
    const s1 = slopeOf(F, S), s2 = slopeOf(S, L), same = s1.val === s2.val;
    let t = null;
    const roadPath = (pts, c2) => { const g = svgEl('g', {}, G.layers.data); const ps = pts.map((p) => G.toPx(...p)); pth(g, ps, '#8d8f96', { w: 16 }); pth(g, ps, '#fff', { w: 2, dash: '10 9' }); return g; };
    return [
      { cap: `Fire Station to School: ${T(`m_{FS}=${s1.all}`)}.`,
        run: async (c) => { t = tri(G, F, S, { runLab: T(`${s1.run}\\text{ km}`), riseLab: T(`${s1.rise}\\text{ km}`) }); await showTri(c, t, 380); await show(c, line(P, T(`m_{FS}=${s1.all}`))); } },
      { cap: `School to Library: ${T(`m_{SL}=${s2.all}`)}.${same ? '' : ' <b>Different!</b>'}`,
        run: async (c) => { dropTri(t); t = tri(G, S, L, { runLab: T(`${s2.run}\\text{ km}`), riseLab: T(`${s2.rise}\\text{ km}`) }); await showTri(c, t, 380); await show(c, line(P, T(`m_{SL}=${s2.all}`), same ? '' : 'u6l8-bad')); } },
      { cap: same ? `${T(`m_{FS}=m_{SL}=${s1.val}`)} and they share the School: all three <b>do</b> lie along one straight road.`
        : `${T(`${s1.val}\\neq${s2.val}`)}: the road would have to <b>bend</b> at the School. Moving the Library just 1 km breaks the straight line.`,
      run: async (c) => {
        dropTri(t); t = null;
        const r = roadPath(same ? [F, L] : [F, S, L]); hid(r); await appear(c, r, 600);
        await show(c, line(P, same ? `one straight road ${T(`\\left(m=${s1.val}\\right)`)}` : 'the road bends at the School', same ? 'u6l8-good u6l8-big' : 'u6l8-bad u6l8-big'));
        await done(c, P, same ? 'collinear ✓' : 'not collinear ✗', same);
      } }
    ];
  }
};

/* =============================== mount =============================== */
mountArcade();
mountFigures();
export const explainers = mountExplainers({ ruler: rulerEx, collinear, shots, threeStep, hinge, missing, road });

/* =============================== Stand Up Break! =============================== */
const SN = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['D', 'E', 'F'], ['J', 'K', 'L'], ['M', 'N', 'O']];
const suPt = (n, p) => `${n}(${p[0]},${p[1]})`;
/** three points: B = A + k1·(q, p), C = B + k2·(q, p) (+ a nudge to C's y when not collinear) */
function suThree(r, lo, hi, signs) {
  for (let i = 0; i < 300; i++) {
    const q = r.int(1, 3), p = r.int(1, 4) * (signs && r.chance(0.5) ? -1 : 1), k1 = r.int(1, 2), k2 = r.int(1, 2);
    const A = [r.int(lo, hi), r.int(lo, hi)], B = [A[0] + k1 * q, A[1] + k1 * p], C = [B[0] + k2 * q, B[1] + k2 * p];
    const isCol = r.chance(0.5); if (!isCol) C[1] += r.pick([-2, -1, 1, 2]);
    const all = [A, B, C].flat(); if (all.some((v) => v < lo - 2 || v > hi + 8)) continue;
    if (!isCol && C[1] === B[1]) continue;
    return { A, B, C, isCol };
  }
  return { A: [1, 1], B: [3, 5], C: [5, 9], col: true };
}
const suAns = (nm, A, B, C) => {
  const s1 = slopeOf(A, B), s2 = slopeOf(B, C), same = s1.val === s2.val;
  return [`m_{${nm[0]}${nm[1]}}=${s1.all}`, `m_{${nm[1]}${nm[2]}}=${s2.all}`, same ? `\\text{equal, shared } ${nm[1]}:\\ \\text{collinear}` : `${s1.val}\\neq${s2.val}:\\ \\text{not collinear}`];
};
standup('u6l8', {
  intro: 'At your whiteboard station: two slopes through the shared point, then compare.',
  levels: {
    BEG: (r) => { // positive coordinates, positive slopes
      const nm = r.pick(SN), { A, B, C } = suThree(r, 0, 4, false);
      return { text: 'Are these three points collinear? Find both slopes, then compare.', q: `${suPt(nm[0], A)},\\ ${suPt(nm[1], B)},\\ ${suPt(nm[2], C)}`, a: suAns(nm, A, B, C) };
    },
    PRG: (r) => { // negative coordinates and negative slopes
      const nm = r.pick(SN), { A, B, C } = suThree(r, -6, 1, true);
      return { text: 'Are these three points collinear? Use the three steps.', q: `${suPt(nm[0], A)},\\ ${suPt(nm[1], B)},\\ ${suPt(nm[2], C)}`, a: suAns(nm, A, B, C) };
    },
    MAS: (r) => { // collinear with a missing coordinate k
      const nm = r.pick(SN);
      for (let i = 0; i < 100; i++) {
        const q = r.int(1, 3), p = r.int(1, 4) * (r.chance(0.4) ? -1 : 1), k1 = r.int(1, 2), k2 = r.int(1, 3);
        const A = [r.int(-4, 4), r.int(-4, 4)], B = [A[0] + k1 * q, A[1] + k1 * p], C = [B[0] + k2 * q, B[1] + k2 * p];
        const s = slopeOf(A, B), run2 = C[0] - B[0], rise2 = C[1] - B[1];
        return { text: `The three points are collinear. Find <i>k</i>.`, q: `${suPt(nm[0], A)},\\ ${suPt(nm[1], B)},\\ ${nm[2]}(${C[0]},\\ k)`,
          a: [`m_{${nm[0]}${nm[1]}}=${s.all}`, `\\dfrac{k-${par(B[1])}}{${run2}}=${s.val}\\ \\Rightarrow\\ k-${par(B[1])}=${s.val === String(s.m) ? rise2 : `${s.val}\\times${run2}=${rise2}`}`, `k=${C[1]}`] };
      }
      return { text: 'The three points are collinear. Find <i>k</i>.', q: 'A(1,\\ 2),\\ B(3,\\ 6),\\ C(5,\\ k)', a: ['m_{AB}=2', 'k=10'] };
    }
  }
});
