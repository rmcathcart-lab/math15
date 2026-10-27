/* Math 15 · Unit 5 · Lesson 8 — Introducing Functions: The Vertical Line Test (RF2).
 * Built from Math 10C u5l5 (whyVertical, the ordered-pair sort, the sweeps, the Stand Up Break figures), following the
 * Math 15 booklet. Warm-up "The Laser Scanner": six graphs and one laser the class slides (or sweeps) across them all,
 * with the hit count under each graph; the big one's three eraser jobs are drawn from the booklet.
 * Explainers:
 *   arrows      — Example 1 check: count the arrows leaving each student (A favourite subject, B clubs; A flipped)
 *   pairsCheck  — Example 2 check: list the x-values, sort the pairs, then see it on a graph
 *   whyVertical — a vertical line is one input; a horizontal line is one output (allowed to repeat)
 *   vlt         — the booklet's line and circle, and the Example 3 check (the V, the sideways parabola)
 *   families    — shapes that always pass and always fail
 *   classify    — Example 4 check: four sweeps, then the two ordered pairs from graph R
 *   context     — Example 5 check (temperature over a day) and birth month → students */
import {
  h, tex, add, box, Graph, MappingDiagram, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  pulse, anim, pairTex, texNum, svgEl, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u5l8-panel ' + cls, title ? `<div class="u5l8-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u5l8-line ' + cls, html); p.appendChild(d); return d; };
const chip = (html, cls = '') => h('span', 'u5l8-pr ' + cls, html);
const fadeOut = (c, el, ms = 350) => anim(c, el, [{ opacity: 1 }, { opacity: 0 }], ms);
const INK = '#24407a';

/* ---------------- curves ---------------- */
/* TikZ "smooth" through points (cubic Béziers; pgf's plot tension → 0.13875, as in the 10C lesson) */
function smoothPts(P, closed, n = 40) {
  const k = 0.13875, m = P.length, out = [], at = (i) => (closed ? P[(i + m) % m] : P[Math.max(0, Math.min(m - 1, i))]);
  for (let i = 0; i < (closed ? m : m - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = [p1[0] + k * (p2[0] - p0[0]), p1[1] + k * (p2[1] - p0[1])], c2 = [p2[0] - k * (p3[0] - p1[0]), p2[1] - k * (p3[1] - p1[1])];
    for (let j = 0; j < n; j++) { const t = j / n, u = 1 - t; out.push([0, 1].map((d) => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); }
  }
  if (!closed) out.push(P[m - 1].slice());
  return out;
}
/* every y where a polyline crosses the vertical line at x */
const crossX = (pts, x, closed = true) => { const ys = [], n = pts.length; for (let i = 0; i < (closed ? n : n - 1); i++) { const a = pts[i], b = pts[(i + 1) % n]; if ((a[0] - x) * (b[0] - x) < 0 || (a[0] === x && b[0] !== x)) ys.push(a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])); } return ys; };
const ellipsePts = (a, b, n = 160) => Array.from({ length: n }, (_, i) => [a * Math.cos(2 * Math.PI * i / n), b * Math.sin(2 * Math.PI * i / n)]);
const BLOB_S = smoothPts([[-2, -1], [-1.1, 1.6], [0.4, 1.1], [1.7, -0.2], [0.9, -1.8], [-0.8, -1.2]], true);
const TEMP = smoothPts([[0, 1], [4, -2], [8, 2], [12, 10], [16, 14], [20, 8], [24, 3]], false);
const sideways = (a, c, y0, y1) => Array.from({ length: 81 }, (_, i) => { const y = y0 + (y1 - y0) * i / 80; return [a * y * y + c, y]; });
const sideHits = (a, c, ymax) => (x) => { const q = (x - c) / a; if (q < 0) return []; const y = Math.sqrt(q); return y > ymax + 1e-9 ? [] : y < 1e-9 ? [0] : [y, -y]; };

/* =============================== warm-up: the laser scanner =============================== */
const ZIG = [[-3, -2], [-1.5, 2], [0, -1], [1.5, 2], [3, -2]];
const zig = (x) => { for (let i = 0; i < ZIG.length - 1; i++) { const a = ZIG[i], b = ZIG[i + 1]; if (x >= a[0] && x <= b[0]) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return null; };
const WG = {
  A: { draw: (G) => G.segment([-3, -1], [3, 2], { color: INK }), hits: (x) => (Math.abs(x) <= 3 ? [0.5 * x + 0.5] : []), pass: true },
  B: { draw: (G) => G.polyline(ellipsePts(2.2, 2.2), { closed: true, color: INK }), hits: (x) => (Math.abs(x) <= 2.2 ? [Math.sqrt(4.84 - x * x), -Math.sqrt(4.84 - x * x)] : []), pass: false },
  C: { draw: (G) => G.fn((x) => 1.6 * Math.sin(2 * Math.PI * x / 3), { from: -3, to: 3, arrows: false, color: INK }), hits: (x) => (Math.abs(x) <= 3 ? [1.6 * Math.sin(2 * Math.PI * x / 3)] : []), pass: true },
  D: { draw: (G) => G.polyline(sideways(0.6, -2.5, -2.7, 2.7), { color: INK }), hits: sideHits(0.6, -2.5, 2.7), pass: false },
  E: { draw: (G) => G.polyline(ZIG, { color: INK }), hits: (x) => { const y = zig(x); return y == null ? [] : [y]; }, pass: true },
  F: { draw: (G) => G.segment([1.5, -2.8], [1.5, 2.8], { color: INK }), hits: () => [], pass: false, vert: 1.5 }
};
function mountWarm() {
  const host = document.getElementById('wu'); if (!host) return;
  const cards = [...host.querySelectorAll('.u5l8-gc')].map((card) => {
    const k = card.dataset.g, fig = card.querySelector('.u5l8-gfig'), W = fig.clientWidth || 190;
    const G = new Graph(fig, { width: W, height: Math.round(W * 0.62), xmin: -3.4, xmax: 3.4, ymin: -3.2, ymax: 3.2, numbers: false, xtitle: '', ytitle: '', arrows: false, pad: 6 });
    const curve = WG[k].draw(G);
    const laser = G.vline(1, { color: COLORS.red, dash: false, width: 3 });
    const dots = svgEl('g', {}, G.layers.top);
    return { k, G, card, curve, laser, dots, out: card.querySelector('.u5l8-hits') };
  });
  const inp = host.querySelector('#laser'), xo = host.querySelector('#laserX');
  const set = (x) => {
    xo.textContent = 'x = ' + String(+x.toFixed(2)).replace('-', '−');
    cards.forEach((o) => {
      const g = WG[o.k]; o.laser.set(x); o.dots.innerHTML = '';
      const all = g.vert != null && Math.abs(x - g.vert) < 0.03, ys = g.hits(x);
      ys.forEach((y) => { const [px, py] = o.G.toPx(x, y); svgEl('circle', { cx: px, cy: py, r: 6, fill: COLORS.red, stroke: '#fff', 'stroke-width': 2 }, o.dots); });
      o.curve.style.color = all ? COLORS.red : ''; o.curve.querySelector('.bk-stroke').setAttribute('stroke', all ? COLORS.red : INK);
      const n = all ? Infinity : ys.length;
      o.out.textContent = all ? 'every point!' : n === 1 ? '1 hit' : n + ' hits';
      o.out.className = 'u5l8-hits' + (n >= 2 ? ' bad' : n === 1 ? ' one' : '');
    });
  };
  inp.addEventListener('input', () => set(Number(inp.value)));
  let busy = false;
  host.querySelector('#sweep').addEventListener('click', () => {
    if (busy) return; busy = true; const t0 = performance.now(), ms = 4200;
    const tick = (now) => { const t = Math.min(1, (now - t0) / ms), x = -3.3 + 6.6 * t; inp.value = x; set(x); if (t < 1) requestAnimationFrame(tick); else busy = false; };
    requestAnimationFrame(tick);
  });
  set(1);
  // Q2's answer marks each graph PASS or FAIL
  cards.forEach((o) => { const b = o.card.querySelector('.u5l8-pf'); b.textContent = WG[o.k].pass ? 'PASS' : 'FAIL'; b.classList.add(WG[o.k].pass ? 'ok' : 'no'); });
  const q2 = host.querySelector('#wq2'), wrap = host.querySelector('#wcards');
  if (q2) { const f = () => wrap.classList.toggle('u5l8-on', q2.classList.contains('shown')); new MutationObserver(f).observe(q2, { attributes: true, attributeFilter: ['class'] }); f(); }
  // the big one: the three eraser jobs (dashed: erased; solid: kept)
  const ARCS = { X: [-90, 90], Y: [0, 180], Z: [115, 425] };
  host.querySelectorAll('[data-arc]').forEach((el) => {
    const [a0, a1] = ARCS[el.dataset.arc], S = 66, c = S / 2, r = 23, svg = svgEl('svg', { width: S, height: S, viewBox: `0 0 ${S} ${S}` }, el);
    for (let i = 0; i <= 6; i++) { const p = 6 + i * 9; svgEl('line', { x1: p, x2: p, y1: 6, y2: S - 6, stroke: '#e3e0d6' }, svg); svgEl('line', { y1: p, y2: p, x1: 6, x2: S - 6, stroke: '#e3e0d6' }, svg); }
    svgEl('circle', { cx: c, cy: c, r, fill: 'none', stroke: '#a8adb7', 'stroke-width': 2, 'stroke-dasharray': '4 3' }, svg);
    const P = (a) => [c + r * Math.cos(a * Math.PI / 180), c - r * Math.sin(a * Math.PI / 180)], [x0, y0] = P(a0), [x1, y1] = P(a1);
    svgEl('path', { d: `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${x1} ${y1}`, fill: 'none', stroke: INK, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, svg);
  });
}

/* =============================== static figures =============================== */
const STUDENTS = ['Ana', 'Ben', 'Cho', 'Dev'];
const MAPS = {
  A: { range: ['Math', 'Sci', 'Art'], pairs: [['Ana', 'Math'], ['Ben', 'Sci'], ['Cho', 'Art'], ['Dev', 'Math']], titles: ['Student', 'Subject'] },
  B: { range: ['Chess', 'Track', 'Choir'], pairs: [['Ana', 'Chess'], ['Ana', 'Track'], ['Ben', 'Choir'], ['Cho', 'Chess'], ['Dev', 'Track']], titles: ['Student', 'Club'] }
};
const VLT = {
  line: { name: 'The line', win: { xmin: -4, xmax: 4, ymin: -4, ymax: 5 }, draw: (G, o = {}) => G.segment([-3, -2], [3, 4], { color: INK, ...o }), hits: (x) => (Math.abs(x) <= 3 ? [x + 1] : []), at: 1, ys: [2] },
  circle: { name: 'The circle', win: { xmin: -4, xmax: 4, ymin: -4, ymax: 4 }, draw: (G, o = {}) => G.polyline(ellipsePts(2.5, 2.5), { closed: true, color: INK, ...o }), hits: (x) => (Math.abs(x) <= 2.5 ? [Math.sqrt(6.25 - x * x), -Math.sqrt(6.25 - x * x)] : []), at: 0, ys: [2.5, -2.5] },
  v: { name: 'Example 3(a) check', win: { xmin: -3.4, xmax: 3.4, ymin: -2.4, ymax: 3.4 }, draw: (G, o = {}) => G.polyline([[-3, 2], [0, -1], [3, 2]], { color: INK, ...o }), hits: (x) => (Math.abs(x) <= 3 ? [Math.abs(x) - 1] : []), at: [-2, 0, 2] },
  side: { name: 'Example 3(b) check', win: { xmin: -3.4, xmax: 2.4, ymin: -3.4, ymax: 3.4 }, draw: (G, o = {}) => G.polyline(sideways(0.4, -2, -3, 3), { color: INK, ...o }), hits: sideHits(0.4, -2, 3), at: -0.4, ys: [2, -2] }
};
const EX4 = {
  P: { draw: (G, o = {}) => G.fn((x) => -0.3 * x * x + 2, { from: -2.5, to: 2.5, arrows: false, color: INK, ...o }), hits: (x) => (Math.abs(x) <= 2.5 ? [-0.3 * x * x + 2] : []), yes: true },
  Q: { draw: (G, o = {}) => G.segment([-3.2, 1.5], [3.2, 1.5], { color: INK, ...o }), hits: (x) => (Math.abs(x) <= 3.2 ? [1.5] : []), yes: true },
  R: { draw: (G, o = {}) => G.polyline(ellipsePts(2.6, 1.3), { closed: true, color: INK, ...o }), hits: (x) => { if (Math.abs(x) > 2.6) return []; const y = 1.3 * Math.sqrt(1 - (x / 2.6) ** 2); return [y, -y]; }, yes: false },
  S: { draw: (G, o = {}) => G.polyline(BLOB_S, { closed: true, color: INK, ...o }), hits: (x) => crossX(BLOB_S, x), yes: false }
};
const ex4Graph = (host, o) => new Graph(host, { width: 200, height: 200, xmin: -3.4, xmax: 3.4, ymin: -3.4, ymax: 3.4, fontSize: 14, ...o });
function tempGraph(host, o = {}) {
  const G = new Graph(host, { width: 420, height: 340, xmin: 0, xmax: 24, ymin: -6, ymax: 16, xstep: 2, ystep: 2, xlabels: 4, ylabels: 4, xtitle: 't\\text{ (h)}', ytitle: 'T\\ (^\\circ\\text{C})', fontSize: 15, ...o });
  return G;
}
function mountFigures() {
  const F = {
    mapA: (el) => new MappingDiagram(el, { width: 380, height: 220, domain: STUDENTS, range: MAPS.A.range, pairs: MAPS.A.pairs, titles: MAPS.A.titles, tex: false, color: COLORS.ink }),
    mapB: (el) => new MappingDiagram(el, { width: 380, height: 220, domain: STUDENTS, range: MAPS.B.range, pairs: MAPS.B.pairs, titles: MAPS.B.titles, tex: false, color: COLORS.ink }),
    vltLine: (el) => { const G = new Graph(el, { width: 270, height: 300, ...VLT.line.win, fontSize: 14 }); VLT.line.draw(G); G.vline(1, { color: COLORS.red }); G.point(1, 2, { color: 'red', r: 6 }); G.label(1, -3.6, T('x=1'), { pos: 'e', color: COLORS.red, cls: 'bk-ptlab' }); },
    vltCircle: (el) => { const G = new Graph(el, { width: 270, height: 270, ...VLT.circle.win, fontSize: 14 }); VLT.circle.draw(G); G.vline(0, { color: COLORS.red }); [2.5, -2.5].forEach((y) => G.point(0, y, { color: 'red', r: 6 })); G.label(0, -3.6, T('x=0'), { pos: 'e', color: COLORS.red, cls: 'bk-ptlab' }); },
    ex3a: (el) => { const G = new Graph(el, { width: 300, height: 256, ...VLT.v.win, fontSize: 14 }); VLT.v.draw(G); },
    ex3b: (el) => { const G = new Graph(el, { width: 256, height: 300, ...VLT.side.win, fontSize: 14 }); VLT.side.draw(G); },
    P: (el) => EX4.P.draw(ex4Graph(el)), Q: (el) => EX4.Q.draw(ex4Graph(el)), R: (el) => EX4.R.draw(ex4Graph(el)), S: (el) => EX4.S.draw(ex4Graph(el)),
    temp: (el) => { const G = tempGraph(el); G.polyline(TEMP, { color: INK }); }
  };
  document.querySelectorAll('[data-fig]').forEach((el) => { const f = F[el.dataset.fig]; if (f && !el.dataset.done) { el.dataset.done = '1'; f(el); } });
}

/* =============================== explainer 1: count the arrows leaving =============================== */
const ARR = {
  A: { label: 'Example 1 check: Diagram A', ...MAPS.A, dom: STUDENTS },
  B: { label: 'Example 1 check: Diagram B', ...MAPS.B, dom: STUDENTS },
  flip: { label: 'Flip A: subject → student', dom: ['Math', 'Sci', 'Art'], range: STUDENTS, pairs: [['Math', 'Ana'], ['Math', 'Dev'], ['Sci', 'Ben'], ['Art', 'Cho']], titles: ['Subject', 'Student'] }
};
const arrows = {
  title: 'Count the arrows leaving each input',
  height: 450,
  minW: 940,
  choices: Object.keys(ARR).map((k) => ({ v: k, label: ARR[k].label })),
  intro: 'Draw the arrows, then count the ones <b>leaving</b> each input. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ARR[k], W = ex.W;
    const M = new MappingDiagram(stage, { x: 10, y: 8, width: 470, height: 432, domain: d.dom, range: d.range, pairs: d.pairs, titles: d.titles, tex: false, arrows: false, color: COLORS.red });
    const P = panel(stage, 500, 8, W - 510, 432, 'Arrows leaving');
    const cnt = {}; d.pairs.forEach((p) => (cnt[p[0]] = (cnt[p[0]] || 0) + 1));
    const bad = d.dom.filter((x) => cnt[x] > 1), shared = d.range.filter((y) => d.pairs.filter((p) => p[1] === y).length > 1);
    const ok = !bad.length, outs = (x) => d.pairs.filter((p) => p[0] === x).map((p) => p[1]);
    const rows = d.dom.map((x) => { const r = line(P, `<b>${x}</b>: <span class="u5l8-n">${cnt[x] || 0}</span>`, 'u5l8-cnt'); r.style.opacity = 0; return r; });
    const sharedTxt = shared.map((y) => `${y} (${d.pairs.filter((p) => p[1] === y).map((p) => p[0]).join(' and ')})`).join(', ');
    return [
      { cap: `Draw one arrow for each pair, from the ${d.titles[0].toLowerCase()} to the ${d.titles[1].toLowerCase()}.`, run: (c) => M.drawArrows(c, { stagger: 80 }) },
      { cap: ok ? 'Count the arrows <b>leaving</b> each input: exactly <b>one</b> each.' : `Count the arrows <b>leaving</b> each input. ${bad[0]} has <b>${cnt[bad[0]]}</b>: ${outs(bad[0]).join(' and ')}.`,
        run: async (c) => {
          for (let i = 0; i < d.dom.length; i++) { const x = d.dom[i]; rows[i].style.opacity = 1; if (cnt[x] > 1) rows[i].classList.add('bad'); else { rows[i].classList.add('good'); M.highlight('d', x, true, 'u5l8-good'); } await pop(c, rows[i], 240); }
          if (!ok) await M.oneToMany(c);
        } },
      { cap: shared.length ? `${sharedTxt} ${shared.length > 1 ? 'receive' : 'receives'} two arrows. Arrows coming <b>in</b> never matter.` : 'Each output receives one arrow here, but that doesn’t decide it. Only the arrows <b>leaving</b> an input count.',
        run: async (c) => {
          for (const y of shared) { M.highlight('r', y); await pulse(c, M.item('r', y), 1.15); }
          if (shared.length) await fadeIn(c, line(P, `Arrows <b>into</b> ${shared.join(', ')}: fine`, 'fine'));
          else { for (const x of bad) await pulse(c, M.item('d', x), 1.25, 600); await fadeIn(c, line(P, `The arrows <b>leaving</b> ${bad.join(', ')} decide it.`, 'no')); }
        } },
      { cap: ok ? '<b>A function</b>: every input has exactly one output.' : `<b>Not a function</b>: ${bad[0]}, one input, has two different outputs.` + (k === 'flip' ? ' Flipping the arrows changed the answer!' : ''),
        run: (c) => stampIn(c, stamp(P, ok ? 'Function' : 'Not a function', { ok, x: (W - 510) / 2, y: 380, size: 'lg', rotate: -4 })) }
    ];
  }
};

/* =============================== explainer 2: Example 2 check — the x-values =============================== */
const E2 = {
  a: { label: '(a)', pairs: [[1, 4], [2, 7], [3, 4], [5, 9]], win: { xmin: 0, xmax: 6, ymin: 0, ymax: 10, ylabels: 2 } },
  b: { label: '(b)', pairs: [[2, 6], [3, 8], [2, 11], [4, 8]], win: { xmin: 0, xmax: 5, ymin: 0, ymax: 12, ylabels: 2 } },
  c: { label: '(c) the table', pairs: [[-1, 5], [0, 5], [1, 5], [-1, 5]], win: { xmin: -3, xmax: 3, ymin: 0, ymax: 7 } }
};
const pairsCheck = {
  title: 'Example 2 check: look at the x-values',
  height: 456,
  minW: 940,
  value: 'a',
  choices: [{ sep: 'Example 2 check:' }, ...Object.keys(E2).map((k) => ({ v: k, label: E2[k].label }))],
  intro: (k) => (k === 'c' ? 'A table: each column is one ordered pair.' : 'A list of ordered pairs.') + ' Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = E2[k], pairs = d.pairs, W = ex.W, lw = 560, pw = W - lw - 30;
    const P = panel(stage, lw + 20, 8, pw, 440, 'The test');
    add(stage, h('div', 'u5l8-rowlab', k === 'c' ? 'From the table' : 'As given'), 14, 10);
    const bot = add(stage, h('div', 'u5l8-rowlab', 'Sorted by x'), 14, 104); bot.style.opacity = 0;
    const cw = 120, X0 = 14;
    pairs.forEach((p, i) => add(stage, chip(T(pairTex(p[0], p[1]))), X0 + i * cw, 40));
    const sorted = pairs.map((p, i) => [p, i]).sort((u, v) => u[0][0] - v[0][0] || u[1] - v[1]);
    const moved = sorted.map(([p], j) => { const e = add(stage, chip(T(pairTex(p[0], p[1]))), X0 + j * cw, 134); e.style.opacity = 0; return e; });
    const G = new Graph(stage, { x: 14, y: 196, width: lw - 20, height: 252, ...d.win, fontSize: 15 }); G.el.style.opacity = 0;
    const xs = pairs.map((p) => p[0]), rep = (x) => xs.filter((v) => v === x).length > 1;
    const diffOut = (x) => new Set(pairs.filter((p) => p[0] === x).map((p) => p[1])).size > 1;
    const badX = xs.find((x) => rep(x) && diffOut(x)), sameX = xs.find((x) => rep(x) && !diffOut(x)), bad = badX != null;
    const outs = pairs.map((p) => p[1]), dupY = outs.find((y, i) => outs.indexOf(y) !== i && !(sameX != null && pairs[i][0] === sameX));
    const L1 = line(P, `${T('x')}-values: ${xs.map((x) => T(x)).join(', ')}`); L1.style.opacity = 0;
    return [
      { cap: `The inputs are the ${T('x')}-values (the first numbers). List them: ${xs.map((x) => T(x)).join(', ')}.`, run: (c) => fadeIn(c, L1) },
      { cap: `Sort the pairs by ${T('x')}, so a repeated input sits side by side.`,
        run: async (c) => { await fadeIn(c, bot); for (let j = 0; j < sorted.length; j++) { const i = sorted[j][1], dx = (i - j) * cw; await anim(c, moved[j], [{ opacity: 0, transform: `translate(${dx}px, -94px)` }, { opacity: 1, transform: 'none' }], 420); } } },
      { cap: bad ? `${T(badX)} appears <b>twice</b>, with outputs ${T(pairs.filter((p) => p[0] === badX).map((p) => p[1]).join('\\text{ and }'))}. One input, two different outputs.`
        : sameX != null ? `${T(sameX)} appears twice, but <b>both</b> times the output is ${T(pairs.find((p) => p[0] === sameX)[1])}: the <b>same pair</b> listed twice. That is fine.`
          : `The ${T('x')}-values are <b>all different</b>.` + (dupY != null ? ` The output ${T(dupY)} repeats, and that doesn’t matter.` : ''),
        run: async (c) => {
          sorted.forEach(([p], j) => moved[j].classList.add(p[0] === badX ? 'bad' : p[0] === sameX ? 'fine' : p[1] === dupY ? 'fine' : 'good'));
          await Promise.all(moved.map((e) => pop(c, e, 300)));
          await fadeIn(c, line(P, bad ? `${T(badX)} has two outputs ✗` : 'no input has two outputs ✓', bad ? 'no' : 'ok'));
          if (sameX != null) await fadeIn(c, line(P, `${T(pairTex(sameX, 5))} twice: the same point`, 'fine'));
          else if (dupY != null) await fadeIn(c, line(P, `repeated output ${T(dupY)}: fine`, 'fine'));
        } },
      { cap: bad ? `On a graph, the two pairs are <b>stacked</b> on the vertical line ${T('x=' + badX)}.` : sameX != null ? `On a graph, the two copies of ${T(pairTex(sameX, 5))} are the <b>same dot</b>: the vertical line ${T('x=' + sameX)} meets one point.` : 'On a graph, every vertical line meets <b>at most one</b> dot.',
        run: async (c) => {
          await appear(c, G.el, 300);
          for (const p of pairs) await G.reveal(G.point(p[0], p[1], { color: 'ink', r: 7 }), c, 200);
          const x0 = bad ? badX : sameX;
          if (x0 != null) { const v = G.vline(x0, { color: bad ? 'red' : 'green', dash: false, width: 3 }); await G.drawIn(v, 600, c); }
          else await G.vlineTest(c, { points: pairs, ms: 1600 });
        } },
      { cap: bad ? `Part ${d.label.slice(0, 3)} is <b>not a function</b>.` : `Part ${d.label.slice(0, 3)} <b>is a function</b>.`,
        run: (c) => stampIn(c, stamp(P, bad ? 'Not a function' : 'Function', { ok: !bad, x: pw / 2, y: 384, size: 'lg', rotate: -4 })) }
    ];
  }
};

/* =============================== explainer 3: why a vertical line? (from 10C) =============================== */
const WV = {
  s1: { label: 'Set 1', pts: [[-4, -1], [-2, 3], [1, -2], [1, 4], [3, 4], [5, 1]] },
  s2: { label: 'Set 2', pts: [[-4, -1], [-2, 3], [1, 4], [3, 4], [5, 1]] }
};
const whyVertical = {
  title: 'Why a vertical line?',
  height: 460,
  minW: 900,
  choices: Object.keys(WV).map((k) => ({ v: k, label: WV[k].label + ': ' + WV[k].pts.map((p) => T(pairTex(p[0], p[1]).replace(/\\ /g, ''))).join(', ') })),
  intro: 'A vertical line is every point with the <b>same input</b>. Watch which ordered pairs it catches. Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W, d = WV[k], pts = d.pts, two = pts.filter((p) => p[0] === 1).length > 1;
    const G = new Graph(stage, { x: 10, y: 10, width: 440, height: 440, xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
    const P = panel(stage, 470, 10, W - 480, 440, 'Ordered pairs');
    const lst = h('div', 'u5l8-plist'); P.appendChild(lst);
    const chips = pts.map((p) => { const e = chip(T(pairTex(p[0], p[1]))); e.style.opacity = 0.3; lst.appendChild(e); return e; });
    const note = h('div', 'u5l8-note', ''); P.appendChild(note);
    const dots = [];
    let tr;
    const on1 = pts.map((p, i) => (p[0] === 1 ? i : -1)).filter((i) => i >= 0), on4 = pts.map((p, i) => (p[1] === 4 ? i : -1)).filter((i) => i >= 0);
    const L = (ps) => ps.map((i) => T(pairTex(pts[i][0], pts[i][1]))).join(' and ');
    return [
      { cap: 'Plot the ordered pairs.', run: async (c) => { for (let i = 0; i < pts.length; i++) { chips[i].style.opacity = 1; const p = G.point(pts[i][0], pts[i][1], { color: 'teal', r: 7.5 }); dots.push(p); await G.reveal(p, c, 240); } } },
      { cap: `Here is the vertical line ${T('x=1')}. Every point on it has ${T('x')}-value ${T('1')}: the whole line is the <b>input 1</b>.`,
        run: async (c) => {
          const vl = G.vline(1, { color: 'blue', dash: false, width: 3 }); await G.drawIn(vl, 600, c);
          G.label(1, 5.4, T('x=1'), { pos: 'e', cls: 'bk-pill', color: 'blue' });
          tr = G.point(1, -5, { color: 'blue', r: 6, label: T(pairTex(1, -5)), pos: 'e' });
          let last = -5;
          await tween(c, 1600, (t) => { const y = -5 + 10 * t, yi = Math.round(y); G.moveTo(tr, 1, y); if (yi !== last) { last = yi; tr.label.innerHTML = T(pairTex(1, yi)); } });
          G.remove(tr);
        } },
      { cap: two ? `It passes through ${L(on1)}: the input ${T('1')} has <b>two outputs</b>.` : `It passes through only ${L(on1)}: the input ${T('1')} has <b>one output</b>.`,
        run: async (c) => { for (const i of on1) { chips[i].classList.add(two ? 'bad' : 'good'); dots[i].querySelector('circle').setAttribute('fill', two ? COLORS.red : COLORS.green); await pop(c, dots[i], 320); } note.innerHTML = two ? 'Same input, different outputs.' : 'Only one pair has input 1.'; await fadeIn(c, note); } },
      { cap: `A <b>horizontal</b> line is every point with the same <b>output</b>. ${T('y=4')} passes through ${L(on4)}: two inputs share the output 4. That is <b>allowed</b>.`,
        run: async (c) => { const hl = G.hline(4, { color: 'amber', dash: true, width: 3 }); await G.drawIn(hl, 600, c); G.label(-5.6, 4, T('y=4'), { pos: 'n', cls: 'bk-pill', color: 'amber' }); for (const i of on4) if (!(two && pts[i][0] === 1)) chips[i].classList.add('fine'); } },
      { cap: 'So only vertical lines matter. Sweep one across the whole graph…', run: async (c) => { await G.vlineTest(c, { points: pts, ms: 2400 }); } },
      { cap: two ? `…it catches two dots at ${T('x=1')}. <b>Not a function.</b>` : '…it never catches more than one dot. <b>A function</b>, even though two dots share a row.',
        run: (c) => stampIn(c, stamp(P, two ? 'Not a function' : 'Function', { ok: !two, x: (W - 480) / 2, y: 392, size: 'lg', rotate: -4 })) }
    ];
  }
};

/* =============================== explainer 4: sweep the vertical line =============================== */
const vlt = {
  title: 'The vertical line test',
  height: 460,
  minW: 900,
  value: 'line',
  choices: [{ v: 'line', label: VLT.line.name }, { v: 'circle', label: VLT.circle.name }, { sep: 'Example 3 check:' }, { v: 'v', label: '(a) the V' }, { v: 'side', label: '(b) the sideways curve' }],
  intro: 'Slide a vertical line across the graph and count the crossings. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = VLT[k], W = ex.W, sx = d.win.xmax - d.win.xmin, sy = d.win.ymax - d.win.ymin, u = Math.min(440 / sx, 440 / sy);
    const G = new Graph(stage, { x: 10 + Math.round((440 - sx * u) / 2), y: 10, width: Math.round(sx * u), height: Math.round(sy * u), ...d.win });
    const P = panel(stage, 470, 10, W - 480, 440, 'Crossings');
    const fail = !!d.ys && d.ys.length > 1;
    let res;
    const steps = [
      { cap: k === 'line' ? 'A straight, slanted line.' : k === 'circle' ? 'A circle.' : k === 'v' ? 'Example 3(a): a V shape.' : 'Example 3(b): a parabola lying on its side.', run: (c) => G.drawIn(d.draw(G), 900, c) },
      { cap: 'Slide a vertical line from left to right. Does it ever cross the graph <b>twice</b>?', run: async (c) => { res = await G.vlineTest(c, { hits: d.hits, ms: 2600 }); } }
    ];
    if (fail) {
      steps.push({ cap: `It crosses <b>twice</b>. Stop at ${T('x=' + texNum(d.at))}: the line meets the graph at ${T(pairTex(d.at, d.ys[0]))} and ${T(pairTex(d.at, d.ys[1]))}.`,
        run: async (c) => {
          res.dots.innerHTML = ''; const x1 = res.line.gx; await tween(c, 900, (t) => { res.line.set(x1 + (d.at - x1) * t); });
          for (const y of d.ys) await G.reveal(G.point(d.at, y, { color: 'red', r: 8, coords: true, pos: y > 0 ? 'ne' : 'se' }), c, 320);
          await fadeIn(c, line(P, `${T(pairTex(d.at, d.ys[0]))} and ${T(pairTex(d.at, d.ys[1]))}`, 'no'));
          await fadeIn(c, line(P, 'one input, two outputs ✗', 'no'));
        } });
    } else {
      const ats = [].concat(d.at);
      steps.push({ cap: k === 'v' ? `Every vertical line crosses <b>once</b>: on each arm of the V, and right at the corner ${T(pairTex(0, -1))}.` : `Every vertical line crosses <b>at most once</b>. At ${T('x=1')} it meets the line once, at ${T(pairTex(1, 2))}.`,
        run: async (c) => {
          G.remove(res.line, res.dots);
          for (const x of ats) { const ys = d.hits(x); await G.drawIn(G.vline(x, { color: 'green', width: 2.5 }), 400, c); for (const y of ys) await G.reveal(G.point(x, y, { color: 'green', r: 7, coords: k === 'line', pos: 'se' }), c, 260); await fadeIn(c, line(P, `${T('x=' + x)}: one crossing, ${T(pairTex(x, ys[0]))}`, 'ok')); }
        } });
    }
    steps.push({ cap: fail ? '<b>Not a function.</b>' + (k === 'side' ? ' Every sideways parabola fails for the same reason.' : ' Circles always fail.') : '<b>A function.</b>',
      run: (c) => stampIn(c, stamp(P, fail ? 'Not a function' : 'Function', { ok: !fail, x: (W - 480) / 2, y: 384, size: 'lg', rotate: -4 })) });
    return steps;
  }
};

/* =============================== explainer 5: shapes that always pass / always fail =============================== */
const FAM = [
  { name: 'slanted line', draw: (G) => G.line({ m: 0.8, b: -0.5 }, { color: INK, arrows: false }), hits: (x) => [0.8 * x - 0.5], pass: true },
  { name: 'horizontal line', draw: (G) => G.line({ m: 0, b: 1 }, { color: INK, arrows: false }), hits: () => [1], pass: true },
  { name: 'circle', draw: (G) => G.polyline(ellipsePts(2.6, 2.6), { closed: true, color: INK }), hits: (x) => (Math.abs(x) <= 2.6 ? [Math.sqrt(6.76 - x * x), -Math.sqrt(6.76 - x * x)] : []), pass: false },
  { name: 'ellipse', draw: (G) => G.polyline(ellipsePts(3, 1.6), { closed: true, color: INK }), hits: (x) => { if (Math.abs(x) > 3) return []; const y = 1.6 * Math.sqrt(1 - (x / 3) ** 2); return [y, -y]; }, pass: false },
  { name: 'parabola, up', draw: (G) => G.fn((x) => 0.5 * x * x - 2, { color: INK, arrows: false }), hits: (x) => [0.5 * x * x - 2], pass: true },
  { name: 'parabola, down', draw: (G) => G.fn((x) => -0.6 * x * x + 2.5, { color: INK, arrows: false }), hits: (x) => [-0.6 * x * x + 2.5], pass: true },
  { name: 'sideways parabola', draw: (G) => G.polyline(sideways(0.5, -2.5, -3.2, 3.2), { color: INK }), hits: sideHits(0.5, -2.5, 3.2), pass: false },
  { name: 'vertical line', draw: (G) => G.segment([2, -3.4], [2, 3.4], { color: INK }), hits: (x) => (Math.abs(x - 2) < 0.02 ? [-2.5, -1, 0.5, 2] : []), pass: false }
];
const families = {
  title: 'Shapes that always pass, shapes that always fail',
  height: 470,
  minW: 960,
  intro: 'Eight shapes, two at a time. Sweep a vertical line across each. Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, cw = Math.floor((W - 20 - 3 * 12) / 4), gh = 186;
    const G = FAM.map((f, i) => {
      const x = 10 + (i % 4) * (cw + 12), y = 6 + Math.floor(i / 4) * (gh + 46);
      add(stage, box(h('div', 'u5l8-famh', f.name), cw, null), x, y);
      const g = new Graph(stage, { x, y: y + 28, width: cw, height: gh, xmin: -4, xmax: 4, ymin: -3.4, ymax: 3.4, numbers: false, xtitle: '', ytitle: '', arrows: false, pad: 6 });
      g.el.style.opacity = 0.25; return g;
    });
    const pairs = [[0, 1, 'Lines that are not vertical <b>pass</b>: a vertical line meets them once.'], [4, 5, 'Parabolas opening <b>up</b> or <b>down</b> <b>pass</b>.'], [2, 3, 'Circles and ellipses <b>fail</b>: a vertical line through the middle crosses twice.'], [6, 7, 'Sideways parabolas <b>fail</b>. A vertical line on top of a vertical line hits <b>every point</b>: it fails too.']];
    return pairs.map(([a, b, cap]) => ({
      cap,
      run: async (c) => {
        await Promise.all([a, b].map(async (i) => {
          const g = G[i], f = FAM[i]; g.el.style.opacity = 1; await g.drawIn(f.draw(g), 600, c);
          await g.vlineTest(c, { hits: f.hits, ms: 1800, minGap: 20 });
          await stampIn(c, stamp(g.el, f.pass ? 'Pass' : 'Fail', { ok: f.pass, x: cw - 46, y: 30, size: 'sm', rotate: -6 }));
        }));
      }
    }));
  }
};

/* =============================== explainer 6: Example 4 check =============================== */
const classify = {
  title: 'Example 4 check: sweep each graph',
  height: 380,
  minW: 960,
  intro: 'Run the vertical line test on P, Q, R and S. Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, gw = Math.floor((W - 20 - 3 * 12) / 4), ks = ['P', 'Q', 'R', 'S'];
    const G = ks.map((k, i) => { const x = 10 + i * (gw + 12); add(stage, box(h('div', 'u5l8-famh big', k), gw, null), x, 4); const g = ex4Graph(stage, { x, y: 34, width: gw, height: gw }); EX4[k].draw(g); return g; });
    const P = panel(stage, 10, gw + 46, W - 20, 380 - gw - 52, '', 'u5l8-notes');
    let rR;
    const steps = ks.map((k, i) => ({
      cap: { P: 'P, a parabola opening down: every vertical line crosses once. <b>Yes</b>.', Q: 'Q, a horizontal line: one ' + T('y') + ' for each ' + T('x') + '. <b>Yes</b>.', R: 'R, an ellipse: a vertical line through the middle cuts it twice. <b>No</b>.', S: 'S, a closed loop: it fails as well. <b>No</b>.' }[k],
      run: async (c) => { const r = await G[i].vlineTest(c, { hits: EX4[k].hits, ms: 1800 }); if (k === 'R') rR = r; await stampIn(c, stamp(G[i].el, EX4[k].yes ? 'Yes' : 'No', { ok: EX4[k].yes, x: gw - 40, y: 26, size: 'sm', rotate: -6 })); }
    }));
    steps.push({ cap: `From R: move the line to ${T('x=0')}. It meets the ellipse at ${T('(0,\\ 1.3)')} and ${T('(0,\\ -1.3)')}: same ${T('x')}, two different ${T('y')}-values.`,
      run: async (c) => {
        const g = G[2]; rR.dots.innerHTML = ''; const x1 = rR.line.gx; await tween(c, 800, (t) => rR.line.set(x1 * (1 - t)));
        for (const y of [1.3, -1.3]) await g.reveal(g.point(0, y, { color: 'red', r: 6 }), c, 260);
        await fadeIn(c, line(P, `Graph R: ${T('(0,\\ 1.3)')} and ${T('(0,\\ -1.3)')}. One input, two outputs: <b>not a function</b>.`, 'no'));
      } });
    return steps;
  }
};

/* =============================== explainer 7: functions in context =============================== */
const MONTH = { dom: ['Sep', 'Oct', 'Nov'], range: ['Ava', 'Ben', 'Cleo', 'Dev', 'Eli'], pairs: [['Sep', 'Ava'], ['Sep', 'Cleo'], ['Oct', 'Ben'], ['Nov', 'Dev'], ['Nov', 'Eli']] };
const context = {
  title: 'Functions in real life',
  height: 460,
  minW: 940,
  choices: [{ v: 'temp', label: 'Example 5 check: temperature' }, { v: 'month', label: 'Birth month → students' }],
  intro: (k) => (k === 'temp' ? 'Temperature over one day, from midnight.' : 'Pair each birth month with the students born in it.') + ' Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W, P = panel(stage, 470, 8, W - 480, 444, k === 'temp' ? 'One instant, one reading' : 'Inputs and outputs');
    if (k === 'temp') {
      const G = tempGraph(stage, { x: 10, y: 20, width: 444, height: 380 });
      const hits = (x) => crossX(TEMP, x, false);
      let res;
      return [
        { cap: `Temperature ${T('T')} (°C) over one day. The input is the time ${T('t')} (hours after midnight).`, run: (c) => G.drawIn(G.polyline(TEMP, { color: INK }), 1200, c) },
        { cap: 'Slide a vertical line across the day. It never crosses twice: the graph never doubles back.', run: async (c) => { res = await G.vlineTest(c, { hits, ms: 2600 }); await fadeIn(c, line(P, 'every vertical line: one crossing ✓', 'ok')); } },
        { cap: `At ${T('t=16')} h, the line meets the curve once: ${T('T=14')} °C.`,
          run: async (c) => { G.remove(res.line, res.dots); await G.drawIn(G.vline(16, { color: 'blue', width: 3, dash: false }), 500, c); await G.reveal(G.point(16, 14, { color: 'blue', r: 8, label: T('(16,\\ 14)'), pos: 'ne' }), c); await fadeIn(c, line(P, `${T('t=16')}: only ${T('T=14')}`)); } },
        { cap: 'At one instant the thermometer shows <b>one</b> reading. It can’t be 10 °C and 14 °C at the same moment. <b>A function.</b>',
          run: async (c) => { await fadeIn(c, line(P, 'A thermometer can’t show two readings at once.')); await stampIn(c, stamp(P, 'Function', { ok: true, x: (W - 480) / 2, y: 384, size: 'lg', rotate: -4 })); } }
      ];
    }
    const M = new MappingDiagram(stage, { x: 10, y: 8, width: 444, height: 444, domain: MONTH.dom, range: MONTH.range, pairs: MONTH.pairs, titles: ['Birth month', 'Student'], tex: false, arrows: false, color: COLORS.red });
    const M2 = new MappingDiagram(stage, { x: 10, y: 8, width: 444, height: 444, domain: MONTH.range, range: MONTH.dom, pairs: MONTH.pairs.map((p) => [p[1], p[0]]), titles: ['Student', 'Birth month'], tex: false, arrows: false, color: COLORS.red });
    M2.el.style.opacity = 0;
    return [
      { cap: 'Draw an arrow from each month to every student born in it.', run: (c) => M.drawArrows(c, { stagger: 80 }) },
      { cap: 'September has <b>two</b> arrows leaving it (Ava and Cleo), and so does November. One input, several outputs: <b>not a function</b>.',
        run: async (c) => { await M.oneToMany(c); await fadeIn(c, line(P, 'month → students: <b>not a function</b>', 'no')); await stampIn(c, stamp(P, 'Not a function', { ok: false, x: (W - 480) / 2, y: 150, size: 'lg', rotate: -4 })); } },
      { cap: 'Flip it: student → birth month. Each student was born in exactly <b>one</b> month: one arrow leaves each student.',
        run: async (c) => { await fadeOut(c, M.el); await appear(c, M2.el); await M2.drawArrows(c, { stagger: 70 }); MONTH.range.forEach((s) => M2.highlight('d', s, true, 'u5l8-good')); } },
      { cap: 'Two students share September: arrows coming <b>in</b> don’t matter. Student → month <b>is a function</b>.',
        run: async (c) => { await fadeIn(c, line(P, 'student → month: <b>a function</b>', 'ok')); await stampIn(c, stamp(P, 'Function', { ok: true, x: (W - 480) / 2, y: 384, size: 'lg', rotate: -4 })); } }
    ];
  }
};

/* =============================== mount =============================== */
mountFigures();
mountWarm();
mountExplainers({ arrows, pairsCheck, whyVertical, vlt, families, classify, context });

/* ============ Stand Up Break! — function or not? (figures from the 10C lesson; lessons/js/standup.js) ============ */
const SU_INK = '#1c2230', SU_GRID = '#d3d8df', SU_C = '#1f5aa8';
const suF = (v) => +v.toFixed(1);
const suNum = (v) => String(v).replace('-', '−');
function suPlane(o, draw, label) { // o: { x0, x1, y0, y1, lab }; draw(X, Y, u) → SVG
  const u = o.u || Math.max(18, Math.min(32, Math.floor(340 / Math.max(o.x1 - o.x0, o.y1 - o.y0)))), p = 16, lab = o.lab || 2;
  const W = (o.x1 - o.x0) * u + 2 * p, H = (o.y1 - o.y0) * u + 2 * p;
  const X = (x) => suF(p + (x - o.x0) * u), Y = (y) => suF(p + (o.y1 - y) * u);
  const ax = Math.min(Math.max(0, o.y0), o.y1), ay = Math.min(Math.max(0, o.x0), o.x1);
  let s = `<rect x="0" y="0" width="${W}" height="${H}" rx="10" fill="#fff"/>`;
  for (let x = Math.ceil(o.x0); x <= o.x1; x++) s += `<line x1="${X(x)}" y1="${Y(o.y0)}" x2="${X(x)}" y2="${Y(o.y1)}" stroke="${SU_GRID}" stroke-width="1"/>`;
  for (let y = Math.ceil(o.y0); y <= o.y1; y++) s += `<line x1="${X(o.x0)}" y1="${Y(y)}" x2="${X(o.x1)}" y2="${Y(y)}" stroke="${SU_GRID}" stroke-width="1"/>`;
  s += `<g stroke="${SU_INK}" stroke-width="2" fill="${SU_INK}"><line x1="${X(o.x0)}" y1="${Y(ax)}" x2="${X(o.x1)}" y2="${Y(ax)}"/><line x1="${X(ay)}" y1="${Y(o.y0)}" x2="${X(ay)}" y2="${Y(o.y1)}"/>` +
    `<path d="M${X(o.x1)} ${Y(ax)}l-9 -5v10z M${X(ay)} ${Y(o.y1)}l-5 9h10z" stroke="none"/></g>`;
  const halo = 'paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"';
  for (let x = Math.ceil(o.x0 / lab) * lab; x < o.x1; x += lab) if (x !== ay && x > o.x0) s += `<text x="${X(x)}" y="${Y(ax) + 23}" text-anchor="middle" ${halo}>${suNum(x)}</text>`;
  for (let y = Math.ceil(o.y0 / lab) * lab; y < o.y1; y += lab) if (y !== ax && y > o.y0) s += `<text x="${X(ay) - 7}" y="${Y(y) + 7}" text-anchor="end" ${halo}>${suNum(y)}</text>`;
  s += `<text x="${X(o.x1) - 4}" y="${Y(ax) - 9}" text-anchor="end" font-style="italic" font-size="22" ${halo}>x</text>` +
    `<text x="${X(ay) + 9}" y="${Y(o.y1) + 15}" font-style="italic" font-size="22" ${halo}>y</text>`;
  s += draw(X, Y, u);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${label || 'graph'}" font-family="KaTeX_Main, 'Times New Roman', serif" font-size="21" fill="${SU_INK}">${s}</svg>`;
}
const suDot = (X, Y, x, y) => `<circle cx="${X(x)}" cy="${Y(y)}" r="5.5" fill="${SU_C}" stroke="${SU_C}" stroke-width="2.6"/>`;
function suArrowHead(X, Y, x, y, dx, dy) {
  const px = dx * (X(1) - X(0)), py = dy * (Y(1) - Y(0)), L = Math.hypot(px, py) || 1, ux = px / L, uy = py / L, tx = X(x), ty = Y(y);
  const bx = tx - 14 * ux, by = ty - 14 * uy;
  return `<path d="M${suF(tx)} ${suF(ty)}L${suF(bx - 6.5 * uy)} ${suF(by + 6.5 * ux)}L${suF(bx + 6.5 * uy)} ${suF(by - 6.5 * ux)}Z" fill="${SU_C}"/>`;
}
const suPath = (X, Y, pts) => `<polyline points="${pts.map(([x, y]) => X(x) + ',' + Y(y)).join(' ')}" fill="none" stroke="${SU_C}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>`;
function suArrowFig(L, R, links, nl, nr) { // mapping diagram: values L (left oval), R (right oval); links [i, j]
  const n = Math.max(L.length, R.length), gap = 46, H = 70 + gap * n, cy = 46 + gap * n / 2, xl = 95, xr = 315, ink = '#1c2230', c = '#1f5aa8';
  const yAt = (k, m) => cy + (k - (m - 1) / 2) * gap;
  let s = `<rect x="0" y="0" width="410" height="${H}" rx="10" fill="#fff"/>`;
  [[xl, L, nl], [xr, R, nr]].forEach(([x, vals, nm]) => {
    s += `<ellipse cx="${x}" cy="${cy}" rx="58" ry="${gap * n / 2 + 16}" fill="#f3efe7" stroke="${ink}" stroke-width="2"/>`;
    s += `<text x="${x}" y="24" text-anchor="middle" font-style="italic" font-size="24">${nm}</text>`;
    vals.forEach((v, k) => { s += `<text x="${x}" y="${yAt(k, vals.length) + 8}" text-anchor="middle" font-size="23">${String(v).replace('-', '−')}</text>`; });
  });
  links.forEach(([i, j]) => {
    const x1 = xl + 30, y1 = yAt(i, L.length), x2 = xr - 30, y2 = yAt(j, R.length);
    const L2 = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L2, uy = (y2 - y1) / L2, bx = x2 - 13 * ux, by = y2 - 13 * uy;
    s += `<line x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}" stroke="${c}" stroke-width="2.6"/><path d="M${x2} ${y2}L${(bx - 6 * uy).toFixed(1)} ${(by + 6 * ux).toFixed(1)}L${(bx + 6 * uy).toFixed(1)} ${(by - 6 * ux).toFixed(1)}Z" fill="${c}"/>`;
  });
  return `<svg viewBox="0 0 410 ${H}" width="410" role="img" aria-label="mapping diagram" font-family="KaTeX_Main, 'Times New Roman', serif" fill="${ink}">${s}</svg>`;
}
function suCurve(X, Y, pts, arrows) {
  let s = suPath(X, Y, pts);
  if (arrows) { const n = pts.length - 1, a = pts[0], b = pts[3], c = pts[n], d = pts[n - 3]; s += suArrowHead(X, Y, a[0], a[1], a[0] - b[0], a[1] - b[1]) + suArrowHead(X, Y, c[0], c[1], c[0] - d[0], c[1] - d[1]); }
  return s;
}
function suSample(f, t0, t1, keep) { const out = []; let started = false; for (let t = t0; t <= t1 + 1e-9; t += 0.05) { const p = f(t); if (keep(p)) { out.push(p); started = true; } else if (started) break; } return out; }
const suIn = (p) => Math.abs(p[0]) <= 5.6 && Math.abs(p[1]) <= 5.6;
const suP = (x, y) => `(${x},\\ ${y})`;
standup('u5l8', {
  intro: 'Decide at your whiteboard station: is the relation a function? Justify it: name an input with two outputs, or explain why there isn’t one.',
  levels: {
    BEG: (r) => { // a list of ordered pairs (Example 2)
      const n = r.int(4, 5), xs = r.shuffle([...Array(13)].map((_, i) => i - 3)).slice(0, n), ys = xs.map(() => r.int(0, 12)), isF = r.chance(0.5);
      let pairs = xs.map((x, i) => [x, ys[i]]), j = -1, y2 = 0;
      if (isF) { if (r.chance(0.6)) pairs[r.int(1, n - 1)][1] = pairs[0][1]; } // a repeated output is fine
      else { j = r.int(0, n - 1); do { y2 = r.int(0, 12); } while (y2 === pairs[j][1]); pairs.splice(r.int(0, n), 0, [xs[j], y2]); pairs = pairs.slice(); }
      const outs = pairs.map((p) => p[1]), rep = outs.find((y, i) => outs.indexOf(y) !== i);
      return { text: 'Is this relation a function? Justify your answer.', q: pairs.map((p) => suP(p[0], p[1])).join(',\\ '),
        a: isF ? ['\\text{No } x\\text{-value repeats: each input has one output}', rep != null ? `\\text{(the output ${rep} repeats: that is allowed)}` : '', '\\textbf{Function}'].filter(Boolean)
          : [`\\text{The input } {${xs[j]}} \\text{ has two outputs: } ${suP(xs[j], ys[j])},\\ ${suP(xs[j], y2)}`, '\\textbf{Not a function}'] };
    },
    PRG: (r) => { // a mapping diagram (Example 1) or points on a grid
      const isF = r.chance(0.5);
      if (r.chance(0.5)) {
        const nl = r.int(3, 4), nr = r.int(2, nl), pool = r.shuffle([...Array(16)].map((_, i) => i - 3)), Lv = pool.slice(0, nl).sort((a, b) => a - b), Rv = pool.slice(nl, nl + nr).sort((a, b) => a - b);
        let links, j = -1;
        do { links = Lv.map((_, i) => [i, r.int(0, nr - 1)]); if (!isF) { j = r.int(0, nl - 1); links.push([j, (links[j][1] + r.int(1, nr - 1)) % nr]); } }
        while (Rv.some((_, k) => !links.some((l) => l[1] === k)));
        const two = links.filter((l) => l[0] === j).map((l) => Rv[l[1]]).sort((a, b) => a - b);
        return { q: '', text: 'Is this relation a function? Count the arrows leaving each input.', fig: suArrowFig(Lv, Rv, links, 'x', 'y'),
          a: isF ? ['\\text{Each input has exactly one arrow leaving it}', '\\textbf{Function}'] : [`${Lv[j]} \\text{ has two arrows: to } {${two[0]}} \\text{ and } {${two[1]}}`, '\\textbf{Not a function}'] };
      }
      const n = r.int(5, 6), xs = r.shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, n), pts = xs.map((x) => [x, r.int(-5, 5)]);
      let j = -1, y2 = 0;
      if (!isF) { j = r.int(0, n - 1); do { y2 = r.int(-5, 5); } while (Math.abs(y2 - pts[j][1]) < 2); pts.push([xs[j], y2]); }
      return { q: '', text: 'Is the relation graphed below a function? Use the vertical line test.',
        fig: suPlane({ x0: -6, x1: 6, y0: -6, y1: 6 }, (X, Y) => pts.map((p) => suDot(X, Y, p[0], p[1])).join(''), 'separate points'),
        a: isF ? ['\\text{Every vertical line meets at most one point}', '\\textbf{Function}'] : [`\\text{The line } x=${xs[j]} \\text{ meets } ${suP(xs[j], Math.max(y2, pts[j][1]))} \\text{ and } ${suP(xs[j], Math.min(y2, pts[j][1]))}`, '\\textbf{Not a function}'] };
    },
    MAS: (r) => { // a curve: if it isn't a function, two ordered pairs that prove it (Example 4)
      const kind = r.pick(['circle', 'circle', 'side', 'side', 'para', 'para', 'line', 'vee']), h = r.int(-2, 2), k = r.int(-2, 2);
      const text = 'Is the relation graphed below a function? If it is not, write two ordered pairs from the graph that prove it.';
      const grid = (draw) => suPlane({ x0: -6, x1: 6, y0: -6, y1: 6 }, draw, 'graph of a relation');
      const yes = ['\\text{Every vertical line crosses at most once}', '\\textbf{Function}'];
      if (kind === 'circle') {
        const rr = r.int(2, 3), pts = [];
        for (let t = 0; t <= 2 * Math.PI + 1e-9; t += Math.PI / 60) pts.push([h + rr * Math.cos(t), k + rr * Math.sin(t)]);
        return { q: '', text, fig: grid((X, Y) => suPath(X, Y, pts)), a: [`\\text{The line } x=${h} \\text{ crosses twice: } ${suP(h, k + rr)},\\ ${suP(h, k - rr)}`, '\\textbf{Not a function}'] };
      }
      if (kind === 'side') {
        const a = r.sign(), f = (t) => [h + a * (t - k) ** 2, t], xd = h + a;
        const pts = suSample(f, k - 6, k + 6, suIn);
        return { q: '', text, fig: grid((X, Y) => suCurve(X, Y, pts, true)), a: [`\\text{The line } x=${xd} \\text{ crosses twice: } ${suP(xd, k + 1)},\\ ${suP(xd, k - 1)}`, '\\textbf{Not a function}'] };
      }
      const a = r.pick([1, -1, 0.5, -0.5]), m = r.pick([-2, -1, -0.5, 0.5, 1, 2]);
      const f = kind === 'para' ? (t) => [t, k + a * (t - h) ** 2] : kind === 'vee' ? (t) => [t, k + 2 * a * Math.abs(t - h)] : (t) => [t, k + m * (t - h)];
      const pts = suSample(f, -6, 6, suIn);
      return { q: '', text, fig: grid((X, Y) => suCurve(X, Y, pts, true)), a: yes };
    }
  }
});
