/* Math 15 · Unit 7 · Lesson 6 — Writing the Equation of a Line Given Two Points.
 * Warm-up (Candle Clues: just lit ?, Photo 1, Photo 2, all gone ?; rewind to "just lit" and burn to the end), and the explainers:
 *   stages / stages1 … stages4 (STAR: two points → slope triangle and the slope formula → substitute one point → b → the line →
 *          check with the other point; a three-stage tracker; chips: the walkthrough, the warm-up candle, every booklet example),
 *   either (use point A or point B: both substitutions, and both walks back to the y-axis, land on the same b),
 *   travel (rise and run as trips on two number lines: subtracting a negative is adding),
 *   flow (a flowchart of the three stages with "does the other point fit?" — and a slip caught by the check),
 *   reduce (a fraction slope: the slope triangle splits into smaller copies, lowest terms, then substitute and solve for b),
 *   sunflower (Example 5: a seedling grows; two readings → 3 cm per day → rewind to day 0 → 1 cm → day 15).
 * Colours: slope blue, the points red (A) and dark orange (B), b green, run amber, rise purple.
 * Math 15 always uses the substitute-and-solve-for-b method (no slope–point form). */
import {
  h, tex, add, box, Graph, NumberLine, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, pulse,
  texNum, svgEl, liveCtx, place, drawIn, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const MC = COLORS.blue, AC = COLORS.red, BPC = '#b0590e', BC = COLORS.green, RUN = COLORS.amber, RISE = COLORS.purple, INK = COLORS.ink, GRAY = COLORS.gray;
const tc = (c) => (s) => `\\textcolor{${c}}{${s}}`;
const cM = tc(MC), cA = tc(AC), cBp = tc(BPC), cB = tc(BC), cU = tc(RUN), cR = tc(RISE);
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/* ---- tiny rational arithmetic: { n, d } with d > 0, lowest terms ---- */
const Q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return { n: n / g + 0, d: d / g }; };
const qv = (q) => q.n / q.d;
const qMul = (a, b) => Q(a.n * b.n, a.d * b.d);
const qSub = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
const qAbs = (a) => Q(Math.abs(a.n), a.d);
const qT = (q) => (q.d === 1 ? String(q.n) : (q.n < 0 ? '-' : '') + `\\tfrac{${Math.abs(q.n)}}{${q.d}}`);
const coef = (q) => (q.d === 1 && q.n === 1 ? '' : q.d === 1 && q.n === -1 ? '-' : qT(q));
const sgnT = (q) => (q.n < 0 ? '-' : '+') + qT(qAbs(q));
const eqT = (m, b, xv = 'x', yv = 'y') => `${yv}=${coef(m)}${xv}` + (b.n === 0 ? '' : sgnT(b));
const par = (v) => (v < 0 ? `(${v})` : String(v));
const pt = (P) => `(${P[0]},${P[1]})`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l6-panel ' + cls, title ? `<div class="u7l6-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u7l6-line ' + cls, html); p.appendChild(d); return d; };
const answerBox = async (c, P, html) => { const r = h('div', 'u7l6-ansbox', `<span class="u7l6-tick">✓</span> ${html}`); P.appendChild(r); await pop(c, r, 450); return r; };
const D = (s) => s.replace(/\\tfrac/g, '\\dfrac');

/** the whole two-point problem, worked out up front (captions are computed before their step runs). A is the point substituted. */
function work2(A, B, xv = 'x', yv = 'y') {
  const rise = B[1] - A[1], run = B[0] - A[0], m = Q(rise, run), prod = qMul(m, Q(A[0])), b = qSub(Q(A[1]), prod), pv = qv(prod);
  const raw = `\\dfrac{${rise}}{${run}}`, reduced = m.d === 1 || !(m.d === run && m.n === rise);   // 6/3 = 2, 5/1 = 5, −3/6 = −1/2
  const prodB = qMul(m, Q(B[0]));
  return {
    A, B, rise, run, m, prod, b, xv, yv,
    riseT: `${B[1]}-${par(A[1])}`, runT: `${B[0]}-${par(A[0])}`,
    slope: `m=\\dfrac{${B[1]}-${par(A[1])}}{${B[0]}-${par(A[0])}}=${raw}` + (reduced ? `=${D(qT(m))}` : ''),
    slopeShort: `m=${raw}` + (reduced ? `=${qT(m)}` : ''),
    tmpl: `${yv}=${coef(m)}${xv}+b`,
    sub: `${A[1]}=${qT(m)}(${A[0]})+b`,
    mult: `${A[1]}=${qT(prod)}+b`,
    solve: `b=${A[1]}${pv > 0 ? '-' + qT(prod) : '+' + qT(qAbs(prod))}=${qT(b)}`,
    undoWord: pv > 0 ? `subtract ${T(qT(prod))} from both sides` : pv < 0 ? `add ${T(qT(qAbs(prod)))} to both sides` : `nothing to move`,
    final: eqT(m, b, xv, yv),
    check: `${qT(m)}(${B[0]})${sgnT(b)}=${qT(prodB)}${sgnT(b)}=${B[1]}`
  };
}

/** a graph with equal x and y scales that fits in maxW × maxH (from the u6l6 page). o: { x, y, center, g } */
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
/** a square-scaled graph when d.sq, else one filling the box */
const mkGraph = (stage, d, x, y, w, hh, g) => (d.sq ? sqGraph(stage, d.win, w, hh, { x, y, center: true, g })
  : new Graph(stage, Object.assign({ x, y, width: w, height: hh }, d.win, g)));

/** slope triangle from A to B: run (amber) along A's level, then rise (purple) up/down to B, with labels */
async function slopeTri(c, G, A, B, o = {}) {
  const run = B[0] - A[0], rise = B[1] - A[1], C = [B[0], A[1]];
  await G.drawIn(G.segment(A, C, { color: RUN, width: 5 }), o.ms || 450, c);
  await pop(c, G.label((A[0] + B[0]) / 2, A[1], `<b>run</b> ${texNum(run).replace('-', '−')}`, { pos: rise > 0 ? 's' : 'n', cls: 'u7l6-tlab u7l6-trun', gap: 6 }));
  await G.drawIn(G.segment(C, B, { color: RISE, width: 5 }), o.ms || 450, c);
  await pop(c, G.label(B[0], (A[1] + B[1]) / 2, `<b>rise</b> ${texNum(rise).replace('-', '−')}`, { pos: run > 0 ? 'e' : 'w', cls: 'u7l6-tlab u7l6-trise', gap: 6 }));
}

/* =============================== warm-up: candle clues =============================== */
function mountCandles() {
  const host = document.getElementById('u7l6-candles'); if (!host) return;
  const W = 600, H = 330, base = 248, per = 7.5, X = [78, 218, 358, 498];
  const wrap = h('div', 'u7l6-cwrap'); box(wrap, W, H); host.appendChild(wrap);
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, wrap);
  const html = h('div', 'bk-html'); wrap.appendChild(html);
  const lab = (x, y, s, pos, cls) => { const d = h('div', 'bk-lab ' + cls, s); html.appendChild(d); return place(d, x, y, pos, 4); };
  svgEl('line', { x1: 20, x2: W - 20, y1: base, y2: base, stroke: '#a8771a', 'stroke-width': 2.5 }, svg);
  const names = [['Just lit', '0 hours'], ['Photo 1', 'after 2 hours'], ['Photo 2', 'after 5 hours'], ['All gone!', 'after ? hours']];
  const subs = names.map(([a, s], i) => { lab(X[i], base + 22, `<b>${a}</b>`, 'c', 'u7l6-cname'); return lab(X[i], base + 46, s, 'c', 'u7l6-csub' + (i === 3 ? ' u7l6-cred' : '')); });
  /** a candle drawn at x with height hcm; returns { set(hcm) } */
  function candle(x) {
    const g = svgEl('g', {}, svg), wax = svgEl('rect', { x: x - 24, width: 48, rx: 3, fill: '#fff2c4', stroke: '#c79a2b', 'stroke-width': 2 }, g);
    const wick = svgEl('line', { x1: x, x2: x, stroke: INK, 'stroke-width': 2.5 }, g);
    const fl = svgEl('path', { fill: '#f6a623', stroke: '#d2581e', 'stroke-width': 1.5 }, g);
    const arr = svgEl('line', { x1: x + 38, x2: x + 38, y2: base, stroke: AC, 'stroke-width': 2 }, g);
    const tag = lab(x + 44, 0, '', 'e', 'u7l6-ctag');
    const set = (hc) => {
      const top = base - hc * per;
      wax.setAttribute('y', top); wax.setAttribute('height', Math.max(0, hc * per));
      wick.setAttribute('y1', top); wick.setAttribute('y2', top - 9);
      fl.setAttribute('d', `M${x} ${top - 30} C${x + 9} ${top - 18} ${x + 8} ${top - 10} ${x} ${top - 8} C${x - 8} ${top - 10} ${x - 9} ${top - 18} ${x} ${top - 30} Z`);
      arr.setAttribute('y1', top); tag.innerHTML = `${Math.round(hc)} cm`; place(tag, x + 42, (top + base) / 2, 'e', 2);
      const vis = hc > 0.05 ? '' : 'none'; [wax, wick, fl, arr].forEach((e) => (e.style.display = vis)); tag.style.display = hc >= 0.5 ? '' : 'none';
    };
    return { g, set, tag };
  }
  const myst = (x) => {
    const g = svgEl('g', {}, svg);
    svgEl('rect', { x: x - 34, y: base - 190, width: 68, height: 186, rx: 8, fill: 'none', stroke: AC, 'stroke-width': 2, 'stroke-dasharray': '7 5' }, g);
    const t = svgEl('text', { x, y: base - 82, 'text-anchor': 'middle', 'font-size': 48, 'font-weight': 800, fill: AC }, g); t.textContent = '?';
    return g;
  };
  const puddle = svgEl('g', {}, svg);
  svgEl('ellipse', { cx: X[3], cy: base - 4, rx: 40, ry: 8, fill: '#fff2c4', stroke: '#c79a2b', 'stroke-width': 1.5 }, puddle);
  [0, 12, -12].forEach((dx, i) => svgEl('path', { d: `M${X[3] + dx} ${base - 16 - i * 4} c6 -8 -6 -14 0 -24`, fill: 'none', stroke: GRAY, 'stroke-width': 2 }, puddle));
  const c0 = candle(X[0]), c1 = candle(X[1]), c2 = candle(X[2]), c3 = candle(X[3]);
  const m0 = myst(X[0]);
  c1.set(20); c2.set(14);
  const reset = () => { c0.set(0); m0.style.display = ''; c3.set(0); puddle.style.display = ''; subs[3].innerHTML = 'after ? hours'; subs[0].innerHTML = '0 hours'; };
  reset();
  let gen = 0;
  const btn = (id, f) => { const b = document.getElementById(id); if (b) b.addEventListener('click', f); };
  btn('u7l6-lit', async () => {
    const my = ++gen, c = liveCtx(); m0.style.display = 'none';
    await tween(c, 1100, (k) => { if (my !== gen) return false; const hc = 20 + 4 * k; c0.set(hc); subs[0].innerHTML = `rewind ${Math.round(2 * k * 10) / 10} h`; });
    if (my === gen) subs[0].innerHTML = '0 hours';
  });
  btn('u7l6-gone', async () => {
    const my = ++gen, c = liveCtx(); puddle.style.display = 'none';
    await tween(c, 2200, (k) => { if (my !== gen) return false; const t = 5 + 7 * k; c3.set(24 - 2 * t); subs[3].innerHTML = `after ${t.toFixed(1).replace('.0', '')} hours`; });
    if (my === gen) { c3.set(0); puddle.style.display = ''; subs[3].innerHTML = '<b>after 12 hours</b>'; }
  });
  btn('u7l6-creset', () => { gen++; reset(); });
}

/* =============================== STAR explainer: three stages =============================== */
const ST = {
  walk: { label: 'Walkthrough: ' + T('(1,3),\\ (4,9)'), A: [1, 3], B: [4, 9], win: { xmin: -2, xmax: 6, ymin: -2, ymax: 10 }, sq: true },
  candle: { label: 'Warm-up: the candle', A: [2, 20], B: [5, 14], xv: 't', yv: 'h', win: { xmin: 0, xmax: 13, ymin: 0, ymax: 26, ystep: 2 }, xl: 1, yl: 4 },
  e1: { label: 'Example 1 check', A: [2, 5], B: [5, 14], win: { xmin: -2, xmax: 7, ymin: -3, ymax: 16 }, yl: 2 },
  e2: { label: 'Example 2 check', A: [-1, 4], B: [3, -8], win: { xmin: -3, xmax: 5, ymin: -10, ymax: 6 }, yl: 2 },
  e3: { label: 'Example 3 check', A: [-4, -6], B: [2, 6], win: { xmin: -6, xmax: 4, ymin: -8, ymax: 8 }, yl: 2 },
  e4: { label: 'Example 4 check', A: [-2, 5], B: [4, 2], win: { xmin: -4, xmax: 6, ymin: -1, ymax: 7 }, sq: true }
};
const STAGES = ['Slope', 'Find <b>b</b>', 'Write it'];
const stagesDef = (keys) => ({
  title: 'Slope first, then b, then write it',
  height: 490,
  minW: 940,
  capH: 96,
  choices: keys.map((k) => ({ v: k, label: ST[k].label })),
  intro: 'Two points, no slope. Three stages get us to the equation. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ST[k], H = ex.def.height, xv = d.xv || 'x', yv = d.yv || 'y', wk = work2(d.A, d.B, xv, yv), [A, B] = [d.A, d.B], bv = qv(wk.b);
    const G = mkGraph(stage, d, 10, 10, 440, H - 20, { xlabels: d.xl || 1, ylabels: d.yl || 1, xtitle: xv, ytitle: yv, origin: d.win.xmin === 0 && d.win.ymin === 0 });
    const Pn = panel(stage, 470, 10, ex.W - 484, H - 20, '', 'u7l6-swork');
    const trk = h('div', 'u7l6-trk', STAGES.map((s, i) => `<div class="u7l6-tk"><span>${i + 1}</span>${s}</div>`).join('')); Pn.appendChild(trk);
    const tks = [...trk.children];
    const setStage = (i) => tks.forEach((t, j) => { t.classList.toggle('on', j === i); t.classList.toggle('done', j < i); });
    const L = (src, cls = '') => line(Pn, T(src), 'u7l6-sline ' + cls);
    const posA = B[1] > A[1] ? 'nw' : 'sw', posB = posA;
    return [
      { cap: `Two points: ${T(cA(pt(A)))} and ${T(cBp(pt(B)))}. No slope is given, so we find it first.`,
        run: async (c) => {
          setStage(-1);
          await pop(c, G.point(A[0], A[1], { color: AC, r: 8, label: T(cA(pt(A))), pos: posA }));
          await pop(c, G.point(B[0], B[1], { color: BPC, r: 8, label: T(cBp(pt(B))), pos: posB }));
        } },
      { cap: `<b>Stage 1: the slope.</b> <b class="u7l6-c-rise">Rise</b> ${T(`${wk.riseT}=${wk.rise}`)}, <b class="u7l6-c-run">run</b> ${T(`${wk.runT}=${wk.run}`)}. So ${T(wk.slopeShort)}.`,
        run: async (c) => { setStage(0); await slopeTri(c, G, A, B); await show(c, line(Pn, T(D(wk.slope)), 'u7l6-sline u7l6-tall')); } },
      { cap: `<b>Stage 2: find b.</b> Substitute ${T(`m=${qT(wk.m)}`)} and one point, ${T(cA(pt(A)))}: ${T(wk.sub)}, so ${T(wk.mult)}.`,
        run: async (c) => { setStage(1); await show(c, L(D(`${wk.sub}\\ \\Rightarrow\\ ${wk.mult}`))); } },
      { cap: `Solve for ${T('b')}: ${wk.undoWord}. ${T(wk.solve)}.`,
        run: async (c) => {
          await show(c, L(cB(wk.solve)));
          if (G.inside(0, bv)) await pop(c, G.point(0, bv, { color: BC, r: 7.5, label: T(cB(`(0,${qT(wk.b)})`)), pos: d.win.xmin === 0 || wk.m.n < 0 ? 'ne' : 'nw' }));
        } },
      { cap: `<b>Stage 3: write it.</b> ${T(`m=${qT(wk.m)}`)} and ${T(`b=${qT(wk.b)}`)}: ${T('\\boldsymbol{' + wk.final + '}')}.`,
        run: async (c) => {
          setStage(2);
          const Ln = G.line({ m: qv(wk.m), b: bv }, { color: MC, width: 3.5 }); Ln.style.opacity = 0.8; await G.drawIn(Ln, 600, c);
          await pop(c, L(D(wk.final), 'u7l6-final'), 420);
        } },
      { cap: `<b>Check with the other point</b> ${T(cBp(pt(B)))}: ${T(wk.check)} ✓ Both points fit.`,
        run: async (c) => {
          setStage(3);
          await show(c, line(Pn, `Check ${T(cBp(pt(B)))}: ${T(wk.check)} ✓`, 'u7l6-chk'));
          await stampIn(c, stamp(stage, '✓', { ok: true, x: ex.W - 84, y: H - 104, size: 'lg' }));
        } }
    ];
  }
});
const stages = stagesDef(['walk', 'candle']);
const stages1 = stagesDef(['e1']);
const stages2 = stagesDef(['e2']);
const stages3 = stagesDef(['e3']);
const stages4 = stagesDef(['e4']);

/* =============================== explainer: either point works =============================== */
const EI = {
  walk: { label: 'Walkthrough: ' + T('(1,3),\\ (4,9)'), A: [1, 3], B: [4, 9], win: { xmin: -2, xmax: 6, ymin: -2, ymax: 10 }, sq: true },
  candle: { label: 'Warm-up: the candle', A: [2, 20], B: [5, 14], xv: 't', yv: 'h', win: { xmin: 0, xmax: 8, ymin: 0, ymax: 26, ystep: 2 }, xl: 1, yl: 4 },
  neg: { label: 'Try: ' + T('(-2,-5),\\ (3,5)'), A: [-2, -5], B: [3, 5], win: { xmin: -4, xmax: 5, ymin: -7, ymax: 7 }, yl: 2 }
};
const either = {
  title: 'Use either point: the same b',
  height: 480,
  minW: 940,
  capH: 96,
  choices: Object.keys(EI).map((k) => ({ v: k, label: EI[k].label })),
  intro: 'Solve for <b>b</b> twice, once with each point. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = EI[k], H = ex.def.height, xv = d.xv || 'x', yv = d.yv || 'y', [A, B] = [d.A, d.B];
    const wA = work2(A, B, xv, yv), wB = work2(B, A, xv, yv), m = qv(wA.m), b = qv(wA.b);
    const G = mkGraph(stage, d, 10, 10, 440, H - 20, { xlabels: d.xl || 1, ylabels: d.yl || 1, xtitle: xv, ytitle: yv, origin: d.win.xmin === 0 && d.win.ymin === 0 });
    const w = (ex.W - 498) / 2;
    const PA = panel(stage, 470, 10, w, H - 120, `Use ${T(cA(pt(A)))}`, 'u7l6-ecol');
    const PB = panel(stage, 484 + w, 10, w, H - 120, `Use ${T(cBp(pt(B)))}`, 'u7l6-ecol');
    const res = add(stage, box(h('div', 'u7l6-eres'), ex.W - 484, 90), 470, H - 100); hide(res);
    const walk = async (c, P, col) => {   // unit steps toward x = 0: across 1, then change y by the slope
      const pts = [P.slice()]; let [x, y] = P;
      while (x !== 0) { const dx = x > 0 ? -1 : 1; x += dx; pts.push([x, y]); y += dx * m; pts.push([x, y]); }
      const s = G.polyline(pts, { color: col, width: 3.5 }); await G.drawIn(s, Math.min(1600, 260 * Math.abs(P[0])), c);
    };
    const nA = Math.abs(A[0]), nB = Math.abs(B[0]);
    return [
      { cap: `Both points are on the line with slope ${T(`m=${qT(wA.m)}`)}. Which one should we substitute?`,
        run: async (c) => {
          const Ln = G.line({ m, b }, { color: MC, width: 3 }); Ln.style.opacity = 0.35; await G.drawIn(Ln, 500, c);
          await pop(c, G.point(A[0], A[1], { color: AC, r: 8, label: T(cA(pt(A))), pos: 'se' }));
          await pop(c, G.point(B[0], B[1], { color: BPC, r: 8, label: T(cBp(pt(B))), pos: 'se' }));
        } },
      { cap: `Use ${T(cA(pt(A)))}: ${T(wA.sub)}, so ${T(wA.mult)} and ${T(cB(`b=${qT(wA.b)}`))}. On the graph: ${nA} step${nA > 1 ? 's' : ''} back to the ${T(yv)}-axis.`,
        run: async (c) => {
          for (const s of [wA.sub, wA.mult, cB(`b=${qT(wA.b)}`)]) await show(c, line(PA, T(s), 'u7l6-eline'));
          await walk(c, A, AC);
        } },
      { cap: `Use ${T(cBp(pt(B)))} instead: ${T(wB.sub)}, so ${T(wB.mult)} and ${T(cB(`b=${qT(wB.b)}`))}. ${nB} step${nB > 1 ? 's' : ''} back from this point.`,
        run: async (c) => {
          for (const s of [wB.sub, wB.mult, cB(`b=${qT(wB.b)}`)]) await show(c, line(PB, T(s), 'u7l6-eline'));
          await walk(c, B, BPC);
        } },
      { cap: `Both land on ${T(cB(`(0,${qT(wA.b)})`))}: the <b>same</b> ${T('b')}, the same line ${T('\\boldsymbol{' + wA.final + '}')}. Pick the point with the friendlier numbers.`,
        run: async (c) => {
          await pop(c, G.point(0, b, { color: BC, r: 9, label: T(cB(`(0,${qT(wA.b)})`)), pos: m > 0 ? 'nw' : 'ne' }));
          res.innerHTML = `<span>${T(cB(`b=${qT(wA.b)}`))} either way</span><span class="u7l6-efin">${T(wA.final)}</span>`; await show(c, res);
        } }
    ];
  }
};

/* =============================== explainer: rise and run as trips on number lines =============================== */
const TR = {
  d1: { label: T('(-3,2)') + ' to ' + T('(1,-6)'), A: [-3, 2], B: [1, -6] },
  d2: { label: T('(-2,-7)') + ' to ' + T('(3,3)'), A: [-2, -7], B: [3, 3] }
};
const travel = {
  title: 'Rise and run are trips: from the first point to the second',
  height: 470,
  minW: 920,
  capH: 96,
  choices: Object.keys(TR).map((k) => ({ v: k, label: TR[k].label })),
  intro: 'The rise is the trip in <b>y</b>, the run is the trip in <b>x</b>. Always from the first point to the second. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TR[k], [A, B] = [d.A, d.B], wk = work2(A, B), W = ex.W;
    const top = add(stage, box(h('div', 'u7l6-trtop'), W - 28, 64), 14, 8);
    top.innerHTML = `${T(cA(`(x_1,y_1)=${pt(A)}`))}<span class="u7l6-trto">→</span>${T(cBp(`(x_2,y_2)=${pt(B)}`))}`;
    const ys = [A[1], B[1]], xs = [A[0], B[0]];
    const rng = (vs) => [Math.min(...vs, 0) - 2, Math.max(...vs, 0) + 2];
    const [ylo, yhi] = rng(ys), [xlo, xhi] = rng(xs);
    const tagY = add(stage, h('div', 'u7l6-nltag u7l6-c-rise', '<b>y</b>-values'), 14, 158);
    const NY = new NumberLine(stage, { x: 120, y: 80, width: W - 134, height: 130, axisY: 92, min: ylo, max: yhi, step: 1, labelStep: yhi - ylo > 22 ? 2 : 1 });
    const tagX = add(stage, h('div', 'u7l6-nltag u7l6-c-run', '<b>x</b>-values'), 14, 298);
    const NX = new NumberLine(stage, { x: 120, y: 220, width: W - 134, height: 130, axisY: 92, min: xlo, max: xhi, step: 1, labelStep: xhi - xlo > 22 ? 2 : 1 });
    void tagY; void tagX;
    const res = add(stage, box(h('div', 'u7l6-trres'), W - 28, 92), 14, 366); hide(res);
    const words = (v) => `${v > 0 ? 'up' : 'down'} ${Math.abs(v)}`;
    const subNote = (a, b2) => (a < 0 ? `${T(`${b2}-(${a})=${b2}+${-a}=${b2 - a}`)}: subtracting a negative is adding.` : `${T(`${b2}-${a}=${b2 - a}`)}.`);
    return [
      { cap: `<b class="u7l6-c-rise">Rise</b> ${T('=y_2-y_1')}: the trip from ${T(cA(String(A[1])))} to ${T(cBp(String(B[1])))} goes <b>${words(wk.rise)}</b>. ${subNote(A[1], B[1])}`,
        run: async (c) => {
          await pop(c, NY.point(A[1], { color: AC, label: T(cA(`y_1=${A[1]}`)), pos: B[1] > A[1] ? 'nw' : 'ne' }));
          await pop(c, NY.point(B[1], { color: BPC, label: T(cBp(`y_2=${B[1]}`)), pos: B[1] > A[1] ? 'ne' : 'nw' }));
          await NY.hop(c, A[1], B[1], { label: `<b>${wk.rise > 0 ? '+' : '−'}${Math.abs(wk.rise)}</b>`, color: RISE });
        } },
      { cap: `<b class="u7l6-c-run">Run</b> ${T('=x_2-x_1')}: the trip from ${T(cA(String(A[0])))} to ${T(cBp(String(B[0])))} goes <b>right ${Math.abs(wk.run)}</b>. ${subNote(A[0], B[0])}`,
        run: async (c) => {
          await pop(c, NX.point(A[0], { color: AC, label: T(cA(`x_1=${A[0]}`)), pos: 'nw' }));
          await pop(c, NX.point(B[0], { color: BPC, label: T(cBp(`x_2=${B[0]}`)), pos: 'ne' }));
          await NX.hop(c, A[0], B[0], { label: `<b>+${wk.run}</b>`, color: RUN });
        } },
      { cap: `Rise over run: ${T(wk.slope.replace(/\\dfrac/g, '\\tfrac'))}. ${wk.rise < 0 ? 'Down while going right: a <b>negative</b> slope.' : 'Up while going right: a <b>positive</b> slope.'}`,
        run: async (c) => { res.innerHTML = T(D(wk.slope)); await show(c, res); } }
    ];
  }
};

/* =============================== explainer: the three stages as a flowchart =============================== */
const FL = {
  e2: { label: 'Example 2 check', A: [-1, 4], B: [3, -8] },
  e3: { label: 'Example 3 check', A: [-4, -6], B: [2, 6] },
  slip: { label: 'A slip, caught by the check', A: [-1, 4], B: [3, -8], slip: true }
};
const flow = {
  title: 'Which stage am I in?',
  height: 470,
  minW: 960,
  capH: 96,
  choices: Object.keys(FL).map((k) => ({ v: k, label: FL[k].label })),
  intro: 'Follow the stages, and finish by checking the point you did <b>not</b> use. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FL[k], [A, B] = [d.A, d.B], wk = work2(A, B), FW = 600, H = ex.def.height;
    const F = new Flowchart(stage, { x: 10, y: 6, width: FW, height: H - 12,
      nodes: {
        pts: { x: 330, y: 34, w: 280, h: 48, html: '<b>Two points</b>', cls: 'bk-round' },
        s1: { x: 330, y: 120, w: 380, h: 60, html: '<b>Stage 1: the slope</b>rise ÷ run', color: 'purple' },
        s2: { x: 330, y: 210, w: 380, h: 60, html: '<b>Stage 2: find b</b>one point into y = mx + b', color: 'blue' },
        s3: { x: 330, y: 300, w: 380, h: 60, html: '<b>Stage 3: write it</b>y = mx + b', color: 'green' },
        chk: { x: 330, y: 400, w: 240, h: 60, html: '<b>Check</b>does the other point fit?', color: 'amber' },
        ok: { x: 540, y: 400, w: 100, h: 52, html: '<b>✓ Done</b>', color: 'green', cls: 'bk-round' },
        fix: { x: 75, y: 400, w: 120, h: 60, html: '<b>✗ Slip!</b>go back', color: 'red', cls: 'bk-round' }
      },
      edges: [{ from: 'pts', to: 's1' }, { from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 'chk' },
        { from: 'chk', to: 'ok', label: 'yes' }, { from: 'chk', to: 'fix', label: 'no' }, { from: 'fix', to: 's1', pts: [[75, 370], [75, 120], [140, 120]] }] });
    const Pn = panel(stage, FW + 24, 10, ex.W - FW - 38, H - 20, 'The work');
    const add1 = (c, html, cls = '') => show(c, line(Pn, html, 'u7l6-fline ' + cls));
    const steps = [
      { cap: `Two points: ${T(cA(pt(A)))} and ${T(cBp(pt(B)))}.`,
        run: async (c) => { await F.visit(c, 'pts'); await add1(c, `${T(cA(pt(A)))}, ${T(cBp(pt(B)))}`); } }
    ];
    if (d.slip) {
      const runBad = B[0] - Math.abs(A[0]), mBad = Q(wk.rise, runBad), bad = (() => { const prod = qMul(mBad, Q(A[0])); return { m: mBad, prod, b: qSub(Q(A[1]), prod) }; })();
      const badEq = eqT(bad.m, bad.b), badChk = qv(bad.m) * B[0] + qv(bad.b);
      steps.push(
        { cap: `Stage 1, with a slip: the bottom is written ${T(`${B[0]}-${Math.abs(A[0])}=${runBad}`)}. The brackets were dropped! ${T(`m=\\tfrac{${wk.rise}}{${runBad}}=${qT(mBad)}`)}.`,
          run: async (c) => { await F.go(c, 'pts', 's1'); await add1(c, T(`m=\\dfrac{${wk.riseT}}{${B[0]}-${Math.abs(A[0])}}=${qT(mBad)}`), 'u7l6-tall u7l6-badc'); } },
        { cap: `Stage 2: ${T(`${A[1]}=${qT(mBad)}(${A[0]})+b`)}, so ${T(`${A[1]}=${qT(bad.prod)}+b`)} and ${T(`b=${qT(bad.b)}`)}.`,
          run: async (c) => { await F.go(c, 's1', 's2'); await add1(c, T(`${A[1]}=${qT(bad.prod)}+b\\Rightarrow b=${qT(bad.b)}`)); } },
        { cap: `Stage 3: ${T(badEq)}.`,
          run: async (c) => { await F.go(c, 's2', 's3'); await add1(c, T(badEq)); } },
        { cap: `Check with ${T(cBp(pt(B)))}: ${T(`${qT(mBad)}(${B[0]})${sgnT(bad.b)}=${badChk}`)}, <b>not</b> ${T(String(B[1]))} ✗ Something slipped.`,
          run: async (c) => { await F.go(c, 's3', 'chk'); await add1(c, `Check: ${T(`${badChk}\\neq ${B[1]}`)} ✗`, 'u7l6-badc'); } },
        { cap: `Go back to Stage 1. The run is ${T(`${B[0]}-(${A[0]})=${B[0]}+${-A[0]}=${wk.run}`)}, so ${T(wk.slopeShort)}.`,
          run: async (c) => { await F.go(c, 'chk', 'fix'); F.fade(); await F.go(c, 'fix', 's1'); await add1(c, T(D(wk.slope)), 'u7l6-tall u7l6-okc'); } },
        { cap: `Redo Stages 2 and 3: ${T(wk.sub)}, ${T(wk.solve)}, so ${T(wk.final)}. Check: ${T(wk.check)} ✓`,
          run: async (c) => { await F.light(c, ['s1', 's2', 's3', 'chk', 'ok']); await add1(c, `${T(wk.final)} ✓`, 'u7l6-okc u7l6-big'); } }
      );
      return steps;
    }
    steps.push(
      { cap: `<b>Stage 1:</b> ${T(wk.slope.replace(/\\dfrac/g, '\\tfrac'))}.`,
        run: async (c) => { await F.go(c, 'pts', 's1'); await add1(c, T(D(wk.slope)), 'u7l6-tall'); } },
      { cap: `<b>Stage 2:</b> use ${T(cA(pt(A)))}: ${T(wk.sub)}, so ${T(wk.mult)} and ${T(wk.solve)}.`,
        run: async (c) => { await F.go(c, 's1', 's2'); await add1(c, T(`${wk.mult}\\Rightarrow ${wk.solve}`)); } },
      { cap: `<b>Stage 3:</b> ${T('\\boldsymbol{' + wk.final + '}')}.`,
        run: async (c) => { await F.go(c, 's2', 's3'); await add1(c, T(wk.final), 'u7l6-big'); } },
      { cap: `<b>Check</b> with the other point ${T(cBp(pt(B)))}: ${T(wk.check)} ✓`,
        run: async (c) => { await F.go(c, 's3', 'chk'); await add1(c, `Check: ${T(wk.check)} ✓`, 'u7l6-okc'); } },
      { cap: `It fits, so we’re done: ${T('\\boldsymbol{' + wk.final + '}')}.`,
        run: async (c) => { await F.go(c, 'chk', 'ok'); await answerBox(c, Pn, T(wk.final)); } }
    );
    return steps;
  }
};

/* =============================== explainer: a fraction slope (split the triangle) =============================== */
const RD = {
  d1: { label: T('(-3,-1)') + ' and ' + T('(3,3)'), A: [-3, -1], B: [3, 3], win: { xmin: -5, xmax: 5, ymin: -3, ymax: 5 } },
  d2: { label: T('(-4,6)') + ' and ' + T('(4,0)'), A: [-4, 6], B: [4, 0], win: { xmin: -6, xmax: 6, ymin: -2, ymax: 8 } }
};
const reduce = {
  title: 'A fraction slope: reduce it, keep it exact',
  height: 480,
  minW: 940,
  capH: 96,
  choices: Object.keys(RD).map((k) => ({ v: k, label: RD[k].label })),
  intro: 'When rise ÷ run doesn’t come out whole, the slope is a fraction. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RD[k], [A, B] = [d.A, d.B], wk = work2(A, B), H = ex.def.height, g = gcd(wk.rise, wk.run), r = wk.rise / g, u = wk.run / g;
    const G = sqGraph(stage, d.win, 460, H - 20, { x: 10, y: 10, center: true, g: { xlabels: 1, ylabels: 1 } });
    const Pn = panel(stage, 490, 10, ex.W - 504, H - 20, 'The algebra');
    return [
      { cap: `Two points: ${T(cA(pt(A)))} and ${T(cBp(pt(B)))}.`,
        run: async (c) => {
          await pop(c, G.point(A[0], A[1], { color: AC, r: 8, label: T(cA(pt(A))), pos: wk.rise > 0 ? 'nw' : 'sw' }));
          await pop(c, G.point(B[0], B[1], { color: BPC, r: 8, label: T(cBp(pt(B))), pos: wk.rise > 0 ? 'nw' : 'sw' }));
        } },
      { cap: `Rise ${T(String(wk.rise))}, run ${T(String(wk.run))}: ${T(`m=\\tfrac{${wk.rise}}{${wk.run}}`)}. That doesn’t come out to a whole number.`,
        run: async (c) => { await slopeTri(c, G, A, B); await show(c, line(Pn, T(`m=\\dfrac{${wk.riseT}}{${wk.runT}}=\\dfrac{${wk.rise}}{${wk.run}}`), 'u7l6-tall')); } },
      { cap: `Both ${Math.abs(wk.rise)} and ${wk.run} divide by ${g}: the triangle splits into <b>${g} smaller steps</b>, each ${r > 0 ? 'up' : 'down'} ${Math.abs(r)} and across ${u}. In lowest terms ${T(`m=${qT(wk.m)}`)}.`,
        run: async (c) => {
          for (let i = 0; i < g; i++) {
            const P0 = [A[0] + i * u, A[1] + i * r];
            await G.drawIn(G.polyline([P0, [P0[0], P0[1] + r], [P0[0] + u, P0[1] + r]], { color: BC, width: 3.5 }), 380, c);   // the small steps sit on the other side of the line
          }
          await show(c, line(Pn, T(`\\dfrac{${wk.rise}}{${wk.run}}=\\dfrac{${wk.rise}\\div${g}}{${wk.run}\\div${g}}=${D(qT(wk.m))}`), 'u7l6-tall'));
        } },
      { cap: `Keep it as a fraction: ${T(`m=${qT(wk.m)}`)}, not the decimal ${T(texNum(qv(wk.m)).replace(/(\.\d\d)\d+/, '$1…'))}.`,
        run: async (c) => { await show(c, line(Pn, `<span class="u7l6-keep">${T(`m=${D(qT(wk.m))}`)}</span> ✓&ensp;<s class="u7l6-badc">${texNum(qv(wk.m)).replace('-', '−')}</s>`)); } },
      { cap: `Substitute ${T(cA(pt(A)))}: ${T(wk.sub)}. ${T(`${qT(wk.m)}(${A[0]})=${qT(wk.prod)}`)} (divide by the bottom, times the top). So ${T(wk.mult)} and ${T(wk.solve)}.`,
        run: async (c) => { await show(c, line(Pn, T(D(`${wk.sub}\\Rightarrow ${wk.mult}`)), 'u7l6-tall')); await show(c, line(Pn, T(cB(wk.solve)))); } },
      { cap: `The equation: ${T('\\boldsymbol{' + wk.final + '}')}. Check with ${T(cBp(pt(B)))}: ${T(wk.check)} ✓`,
        run: async (c) => {
          const Ln = G.line({ m: qv(wk.m), b: qv(wk.b) }, { color: MC, width: 3.5 }); Ln.style.opacity = 0.8; await G.drawIn(Ln, 600, c);
          await pop(c, G.point(0, qv(wk.b), { color: BC, r: 7.5, label: T(cB(`(0,${qT(wk.b)})`)), pos: wk.m.n > 0 ? 'nw' : 'ne' }));
          await answerBox(c, Pn, T(D(wk.final)));
        } }
    ];
  }
};

/* =============================== explainer: the sunflower (Example 5) =============================== */
const sunflower = {
  title: 'Example 5: a sunflower grows 3 cm a day',
  height: 480,
  minW: 980,
  capH: 96,
  choices: [{ v: 'e5', label: 'Example 5 check' }],
  intro: 'Two readings: <b>10 cm on day 3</b> and <b>25 cm on day 8</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const H = ex.def.height, SW = 220, gy = H - 74, topY = 40, hy = (hh) => gy - (gy - topY) * hh / 50, PX = 120;
    const pot = add(stage, box(h('div', 'u7l6-garden'), SW, H - 20), 10, 10);
    const svg = svgEl('svg', { width: SW, height: H - 20, viewBox: `0 0 ${SW} ${H - 20}` }, pot);
    const html = h('div', 'bk-html'); pot.appendChild(html);
    svgEl('rect', { x: 0, y: 0, width: SW, height: H - 20, rx: 14, fill: '#e3f1fb' }, svg);
    svgEl('rect', { x: 0, y: gy, width: SW, height: H - 20 - gy, fill: '#a5774a' }, svg);
    svgEl('line', { x1: 40, x2: 40, y1: hy(0), y2: hy(50), stroke: INK, 'stroke-width': 3 }, svg);
    const lab = (x, y, s, pos, cls) => { const d = h('div', 'bk-lab ' + cls, s); html.appendChild(d); return place(d, x, y, pos, 4); };
    for (let v = 0; v <= 50; v += 10) { svgEl('line', { x1: 33, x2: 47, y1: hy(v), y2: hy(v), stroke: INK, 'stroke-width': 2.5 }, svg); lab(30, hy(v), String(v), 'w', 'u7l6-sknum'); }
    lab(40, hy(50) - 6, 'cm', 'n', 'u7l6-sknum');
    const stem = svgEl('line', { x1: PX, x2: PX, y1: gy, stroke: '#3f8a2f', 'stroke-width': 6, 'stroke-linecap': 'round' }, svg);
    const leaf = svgEl('path', { fill: '#5fae45' }, svg);
    const head = svgEl('g', {}, svg);
    for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; svgEl('ellipse', { cx: 13 * Math.cos(a), cy: 13 * Math.sin(a), rx: 9, ry: 4.5, fill: '#f7c531', transform: `rotate(${i * 30} ${13 * Math.cos(a)} ${13 * Math.sin(a)})` }, head); }
    svgEl('circle', { r: 9, fill: '#6b3e17' }, head);
    const guide = svgEl('line', { x1: 47, stroke: AC, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    const day = lab(SW / 2, gy + 30, '', 'c', 'u7l6-clock');
    const hl = lab(PX + 26, 0, '', 'e', 'u7l6-skh');
    const set = (dd) => {
      const hh = 3 * dd + 1, py = hy(hh), sc = Math.max(0.35, Math.min(1, hh / 12));
      stem.setAttribute('y2', py); guide.setAttribute('x2', PX - 14 * sc); guide.setAttribute('y1', py); guide.setAttribute('y2', py);
      head.setAttribute('transform', `translate(${PX} ${py}) scale(${sc})`);
      const ly = gy - (gy - py) * 0.45; leaf.setAttribute('d', hh > 4 ? `M${PX} ${ly} q22 -18 34 -4 q-16 12 -34 4 Z` : '');
      day.innerHTML = `day ${Math.round(dd * 10) / 10}`; hl.innerHTML = `${Math.round(hh)} cm`; place(hl, PX + 24, py, 'e', 4);
    };
    set(3);
    const grow = (c, d0, d1, ms) => tween(c, ms, (u) => set(d0 + (d1 - d0) * u));
    const GW = 390;
    const G = new Graph(stage, { x: SW + 24, y: 10, width: GW, height: H - 20, xmin: 0, xmax: 16, ymin: 0, ymax: 50, xstep: 1, ystep: 5, xlabels: 2, ylabels: 10, xtitle: 'd', ytitle: 'h', origin: true });
    const Pn = panel(stage, SW + GW + 38, 10, ex.W - SW - GW - 52, H - 20, 'The algebra');
    return [
      { cap: `Day 3: ${T('10')} cm. Day 8: ${T('25')} cm. Two points: ${T(cA('(3,\\ 10)'))} and ${T(cBp('(8,\\ 25)'))}. Time goes first.`,
        run: async (c) => {
          await pop(c, G.point(3, 10, { color: AC, r: 7.5, label: T(cA('(3,\\ 10)')), pos: 'nw' }));
          await grow(c, 3, 8, 1200);
          await pop(c, G.point(8, 25, { color: BPC, r: 7.5, label: T(cBp('(8,\\ 25)')), pos: 'nw' }));
          await show(c, line(Pn, `${T(cA('(3,\\ 10)'))}, ${T(cBp('(8,\\ 25)'))}`));
        } },
      { cap: `<b>Stage 1:</b> ${T('m=\\tfrac{25-10}{8-3}=\\tfrac{15}{5}=3')}. It grows ${T('15')} cm in ${T('5')} days: <b>3 cm per day</b>.`,
        run: async (c) => { await slopeTri(c, G, [3, 10], [8, 25]); await show(c, line(Pn, T('m=\\dfrac{25-10}{8-3}=\\dfrac{15}{5}=3'), 'u7l6-tall')); } },
      { cap: `<b>Stage 2:</b> use ${T(cA('(3,\\ 10)'))}: ${T('10=3(3)+b')}, so ${T('10=9+b')} and ${T(cB('b=1'))}. Rewind to day 0: it was ${T('1')} cm tall.`,
        run: async (c) => {
          await show(c, line(Pn, T('10=3(3)+b\\Rightarrow 10=9+b')));
          await show(c, line(Pn, T(cB('b=10-9=1'))));
          await grow(c, 8, 0, 1500);
          await pop(c, G.point(0, 1, { color: BC, r: 8, label: T(cB('(0,\\ 1)')), pos: 'ne' }));
        } },
      { cap: `<b>Stage 3:</b> ${T('\\boldsymbol{h=3d+1}')}. Check with ${T(cBp('(8,\\ 25)'))}: ${T('3(8)+1=25')} ✓`,
        run: async (c) => {
          await G.drawIn(G.line({ m: 3, b: 1 }, { color: MC, width: 3.5 }), 600, c);
          await show(c, line(Pn, T('\\boldsymbol{h=3d+1}'), 'u7l6-big'));
        } },
      { cap: `(b) The slope ${T('3')} is the <b>growth rate</b>: 3 cm taller each day. The ${T('h')}-intercept ${T('1')} is the height on <b>day 0</b>, when it was planted.`,
        run: async (c) => { await show(c, line(Pn, `(b) slope: <b>3 cm/day</b><br>${T('b')}: <b>1 cm</b> on day 0`, 'u7l6-sm')); } },
      { cap: `(c) Day 15: ${T('h=3(15)+1=45+1=46')}. About <b>46 cm</b> tall.`,
        run: async (c) => {
          await grow(c, 0, 15, 1700);
          await G.drawIn(G.guides(15, 46), 400, c);
          await pop(c, G.point(15, 46, { color: INK, r: 7.5, label: T('(15,\\ 46)'), pos: 'sw' }));
          await answerBox(c, Pn, `(c) ${T('46')} cm`);
        } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  // the assignment's own point pairs: never ask these (homework would be given away)
  const HWP = [[[1, 2], [4, 11]], [[0, 5], [3, -1]], [[-2, -3], [2, 5]], [[-5, 7], [0, -3]], [[1, 4], [3, 10]], [[2, 1], [5, 13]], [[0, -2], [4, 10]],
    [[-1, 6], [2, -3]], [[-3, -8], [3, 4]], [[-4, 9], [4, -7]], [[2, 3], [5, 15]], [[-3, 10], [1, -2]], [[-6, -4], [0, 8]], [[-6, 1], [2, 5]],
    [[0, 7], [6, 3]], [[-5, -9], [5, 3]], [[-4, 5], [2, 2]], [[0, -6], [3, 0]], [[0, 9], [4, 1]], [[3, 7], [6, 19]], [[-2, 8], [2, 0]],
    [[1, -3], [4, 9]], [[0, -5], [3, 7]], [[-8, -19], [4, 17]], [[2, 15], [5, 33]], [[1, 42], [6, 72]], [[2, 40], [5, 100]]];
  const HW = new Set(HWP.flatMap(([a, b]) => [pt(a) + pt(b), pt(b) + pt(a)]));
  const TXT = 'Determine the equation of the line through the two points, in the form <i>y</i> = <i>mx</i> + <i>b</i>.';
  const ans = (wk) => [D(wk.slope), `${wk.sub}\\ \\Rightarrow\\ ${wk.mult}`, wk.solve, wk.final];
  const ask = (A, B) => `${pt(A)}\\ \\text{ and }\\ ${pt(B)}`;
  // slope a whole number; first-quadrant points
  function basic(r) {
    for (;;) {
      const m = r.int(1, 5), k = r.int(1, 4), A = [r.int(1, 5), r.int(1, 9)], B = [A[0] + k, A[1] + m * k];
      if (B[1] > 30 || A[1] - m * A[0] === 0 || HW.has(pt(A) + pt(B))) continue;
      return { text: TXT, q: ask(A, B), a: ans(work2(A, B)) };
    }
  }
  // negatives: a negative slope and/or negative coordinates
  function negs(r) {
    for (;;) {
      const m = r.int(1, 5) * r.sign(), k = r.int(1, 5), A = [r.int(-6, 4), r.int(-9, 9)], B = [A[0] + k, A[1] + m * k];
      const all = [...A, ...B]; if (!all.some((v) => v < 0) || A[0] === 0 || B[0] === 0 || Math.abs(B[1]) > 20 || A[1] - m * A[0] === 0) continue;
      if (HW.has(pt(A) + pt(B))) continue;
      const P = r.chance(0.5) ? [A, B] : [B, A];   // sometimes the second point is to the left
      return { text: TXT + ' Use brackets for the negatives.', q: ask(P[0], P[1]), a: ans(work2(P[0], P[1])) };
    }
  }
  // a fraction slope (b still whole), or a story with two readings
  function frac(r) {
    for (;;) {
      const q = r.pick([2, 3, 4]), p = r.int(1, q - 1) * r.sign(); if (gcd(p, q) !== 1) continue;
      const k = r.pick([2, 2, 3]), x1 = q * r.int(-2, 1), b = r.int(-5, 6), A = [x1, p / q * x1 + b], B = [x1 + q * k, A[1] + p * k];
      if (x1 === 0 || B[0] === 0 || HW.has(pt(A) + pt(B)) || Math.abs(B[1]) > 15 || Math.abs(A[1]) > 15) continue;
      return { text: TXT + ' Keep the slope as a fraction in lowest terms.', q: ask(A, B), a: ans(work2(A, B)) };
    }
  }
  const STORIES = [
    (a, b, t1, t2) => ({ text: `A puppy grows at a steady rate. It weighs <b>${a} kg</b> at <b>${t1} weeks</b> old and <b>${b} kg</b> at <b>${t2} weeks</b> old. Let <i>w</i> be its mass (kg) at age <i>t</i> weeks. Write an equation for <i>w</i>. What do the slope and <i>b</i> mean?`, xv: 't', yv: 'w', unit: 'kg', per: 'week' }),
    (a, b, t1, t2) => ({ text: `A bathtub fills at a steady rate. After <b>${t1} min</b> it holds <b>${a} L</b>; after <b>${t2} min</b> it holds <b>${b} L</b>. Let <i>V</i> be the volume (L) after <i>t</i> minutes. Write an equation for <i>V</i>. What do the slope and <i>b</i> mean?`, xv: 't', yv: 'V', unit: 'L', per: 'minute' }),
    (a, b, t1, t2) => ({ text: `A candle burns at a steady rate. After <b>${t1} h</b> it is <b>${a} cm</b> tall; after <b>${t2} h</b> it is <b>${b} cm</b> tall. Let <i>h</i> be its height (cm) after <i>t</i> hours. Write an equation for <i>h</i>. What do the slope and <i>b</i> mean?`, xv: 't', yv: 'h', unit: 'cm', per: 'hour', down: true })
  ];
  function story(r) {
    for (;;) {
      const i = r.int(0, STORIES.length - 1), down = i === 2, rate = down ? r.pick([2, 3, 4]) : r.pick([2, 3, 4, 5, 10]), start = down ? r.int(20, 36) : r.int(1, 30);
      const t1 = r.int(1, 4), t2 = t1 + r.int(2, 5), f = (t) => (down ? start - rate * t : start + rate * t), a = f(t1), b = f(t2);
      if (b <= 0) continue;
      const s = STORIES[i](a, b, t1, t2), wk = work2([t1, a], [t2, b], s.xv, s.yv);
      return { text: s.text, q: '', a: ans(wk),
        atext: `Slope <b>${qv(wk.m)}</b>: it ${down ? 'loses' : 'gains'} ${Math.abs(qv(wk.m))} ${s.unit} each ${s.per}. <i>b</i> = <b>${qv(wk.b)}</b>: the ${s.unit === 'cm' ? 'height' : s.unit === 'kg' ? 'mass' : 'volume'} at time 0.` };
    }
  }
  standup('u7l6', {
    intro: 'At your whiteboard station: Stage 1 the slope, Stage 2 solve for b, Stage 3 write it. Then check with the other point!',
    levels: {
      BEG: basic,                                                // (2, 5) and (5, 14) → m = 3 → y = 3x − 1
      PRG: negs,                                                 // negative slopes and coordinates, in brackets
      MAS: (r) => (r.chance(0.55) ? frac(r) : story(r))          // a fraction slope, or two readings in a story
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountCandles();
export const explainers = mountExplainers({ stages, either, stages1, travel, flow, stages2, stages3, reduce, stages4, sunflower });
export const _test = { ST, EI, TR, FL, RD, work2, eqT };
