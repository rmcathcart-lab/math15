/* Math 15 · Unit 6 · Lesson 6 — Rise Over Run: The Slope of a Line Segment.
 * Warm-up (Which Slide Is Scariest? four playground slides drawn to scale, then slide E), static figures, a drag-the-points
 * slope triangle, and the explainers:
 *   stairs (a staircase: one step's rise and run, a ruler along the corners, the whole staircase has the same slope),
 *   slides (the warm-up slides lined up at one foot: tallest isn't steepest; rise ÷ run on a number line),
 *   count (count up to the other point's height, then right; Example 1 and 2 checks),
 *   flip (rise on top: 3/4 lands on B, 4/3 is a steeper line that misses it),
 *   formula (counting becomes subtracting: y2 − y1 over x2 − x1, same order; Example 3 and 4 checks),
 *   split (lowest terms: the slope triangle splits into smaller copies with the same slope),
 *   grade (Example 5: a long, gentle trail, 45/300 = 3/20, a 15% grade).
 * Colours: run amber, rise purple, segments blue. Slope triangle and counting pieces from the Math 10C u6l2 page. */
import {
  h, tex, add, box, Graph, NumberLine, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  pairTex, texNum, svgEl, liveCtx, pulse, place, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RUN = COLORS.amber, RISE = COLORS.purple, SEG = COLORS.blue, INK = COLORS.ink, RED = COLORS.red, GRN = COLORS.green;
const cR = (s) => `\\textcolor{${RISE}}{${s}}`, cU = (s) => `\\textcolor{${RUN}}{${s}}`;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const red = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
/** TeX of a reduced fraction, whole numbers plain */
const fr = (n, d, big = true) => { const [a, b] = red(n, d); if (b === 1) return String(a); return (a < 0 ? '-' : '') + `\\${big ? 'd' : 't'}frac{${Math.abs(a)}}{${b}}`; };
const rawFr = (r, u) => `\\dfrac{${cR(texNum(r))}}{${cU(texNum(u))}}`;
/** rise/run, then = reduced when it reduces */
const slopeTex = (r, u) => { const [a, b] = red(r, u); return a === r && b === u ? rawFr(r, u) : `${rawFr(r, u)}=${fr(r, u)}`; };
const par = (v) => (v < 0 ? `(${texNum(v)})` : texNum(v));
const n = (v) => texNum(v).replace('-', '−');
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u6l6-panel ' + cls, title ? `<div class="u6l6-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l6-line ' + cls, html); p.appendChild(d); return d; };
const answerBox = async (c, P, html) => { const r = h('div', 'u6l6-ansbox', `<span class="u6l6-tick">✓</span> ${html}`); P.appendChild(r); await pop(c, r, 450); return r; };
const P2 = (x, y) => pairTex(x, y);

/** a graph with equal x and y scales that fits in maxW × maxH. o: { x, y, center, g (extra Graph options), pad } */
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

/* ---------------------------------------------------------------------------------------------------------------
 * Slope triangle on a Graph (from the 10C u6l2 page): rise leg (purple) up from (x, y), then run leg (amber) across to
 * the other point — or run first with o.runFirst. s = { x, y, run, rise }. Labels sit outside the triangle.
 * ------------------------------------------------------------------------------------------------------------- */
class SlopeTri {
  constructor(G, s, o = {}) {
    this.G = G; this.s = Object.assign({}, s); this.o = o;
    const L = o.layer || G.layers.data, w = o.w || 5;
    this.g = svgEl('g', { class: 'u6l6-tri' }, L);
    this.fill = svgEl('path', { fill: o.fill || SEG, 'fill-opacity': o.fillOp ?? 0.1, stroke: 'none' }, this.g);
    this.mark = svgEl('path', { fill: 'none', stroke: INK, 'stroke-width': 1.6 }, this.g);
    this.runP = svgEl('path', { class: 'bk-stroke', stroke: RUN, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.riseP = svgEl('path', { class: 'bk-stroke', stroke: RISE, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.lRun = o.labels === false ? null : h('div', 'bk-lab u6l6-tlab u6l6-trun');
    this.lRise = o.labels === false ? null : h('div', 'bk-lab u6l6-tlab u6l6-trise');
    if (this.lRun) G.html.append(this.lRun, this.lRise);
    G.track(this.g, () => this.draw());
  }
  text(kind, v) { const f = kind === 'run' ? this.o.runText : this.o.riseText; return f ? f(v) : `<b>${kind}</b> ${n(+v.toFixed(2))}`; }
  draw() {
    const G = this.G, { x, y, run, rise } = this.s, rf = !this.o.runFirst;
    // rise first: P → (x, y + rise) → Q ; run first: P → (x + run, y) → Q
    const P = G.toPx(x, y), C = rf ? G.toPx(x, y + rise) : G.toPx(x + run, y), Q = G.toPx(x + run, y + rise);
    const d = (a, b) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    this.fill.setAttribute('d', `M${P[0]} ${P[1]} L${C[0]} ${C[1]} L${Q[0]} ${Q[1]} Z`);
    if (rf) { this.riseP.setAttribute('d', d(P, C)); this.runP.setAttribute('d', d(C, Q)); } else { this.runP.setAttribute('d', d(P, C)); this.riseP.setAttribute('d', d(C, Q)); }
    this.runP.style.display = Math.abs(run) < 1e-9 ? 'none' : ''; this.riseP.style.display = Math.abs(rise) < 1e-9 ? 'none' : '';
    const k = 11, A = rf ? P : Q, B = rf ? Q : P; // the corner's neighbours
    const ux = Math.sign(B[0] - C[0]) || 1, uy = Math.sign(A[1] - C[1]) || 1;
    this.mark.setAttribute('d', Math.abs(C[0] - B[0]) > 2 * k && Math.abs(A[1] - C[1]) > 2 * k ? `M${C[0] + ux * k} ${C[1]} L${C[0] + ux * k} ${C[1] + uy * k} L${C[0]} ${C[1] + uy * k}` : '');
    if (!this.lRun) return;
    this.lRun.innerHTML = this.text('run', run); this.lRise.innerHTML = this.text('rise', rise);
    const gap = this.o.gap ?? 6;
    if (rf) { place(this.lRise, P[0], (P[1] + C[1]) / 2, this.o.riseSide || 'w', gap + 2); place(this.lRun, (C[0] + Q[0]) / 2, C[1], this.o.runSide || 'n', gap); }
    else { place(this.lRun, (P[0] + C[0]) / 2, P[1], this.o.runSide || 's', gap); place(this.lRise, C[0], (C[1] + Q[1]) / 2, this.o.riseSide || 'e', gap + 2); }
  }
  set(s) { Object.assign(this.s, s); this.draw(); return this; }
  to(c, s, ms = 900) { const a = Object.assign({}, this.s); return tween(c, ms, (t) => { const o = {}; for (const k in s) o[k] = a[k] + (s[k] - a[k]) * t; this.set(o); }); }
  async drawIn(c, ms = 500) {
    const first = this.o.runFirst ? [this.runP, this.lRun] : [this.riseP, this.lRise], second = this.o.runFirst ? [this.riseP, this.lRise] : [this.runP, this.lRun];
    this.fill.style.opacity = 0; hide(this.lRun); hide(this.lRise);
    await drawIn(first[0], ms, c); if (first[1]) await fadeIn(c, first[1], 220);
    await drawIn(second[0], ms, c); if (second[1]) await fadeIn(c, second[1], 220);
    await appear(c, this.fill, 250);
  }
  remove() { this.G.remove(this.g); this.lRun && this.lRun.remove(); this.lRise && this.lRise.remove(); }
}

/** count a leg square by square: from (x, y) along axis 'x' or 'y' for v units (signed); unit pieces + count bubbles */
async function countLeg(c, G, x, y, axis, v, o = {}) {
  const els = [], s = Math.sign(v), N = Math.abs(v), color = axis === 'x' ? RUN : RISE, ms = o.ms || 260;
  for (let k = 0; k < N; k++) {
    const a = axis === 'x' ? [x + s * k, y] : [x, y + s * k], b = axis === 'x' ? [x + s * (k + 1), y] : [x, y + s * (k + 1)];
    const seg = G.segment(a, b, { color, width: 5.5 }); els.push(seg);
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const bub = G.label(mid[0], mid[1], String(k + 1), { pos: o.side || (axis === 'x' ? 'n' : 'w'), cls: 'u6l6-bub ' + (axis === 'x' ? 'u6l6-bub-run' : 'u6l6-bub-rise'), gap: 6 });
    els.push(bub); hide(bub);
    await drawIn(seg, ms, c); await pop(c, bub, 200); bub.style.opacity = 1;
  }
  return els;
}

/* =============================== warm-up: which slide is scariest? =============================== */
const SLIDES = [{ k: 'A', run: 8, rise: 4, col: '#1f5bd6' }, { k: 'B', run: 4, rise: 3, col: '#e8a01e' }, { k: 'C', run: 5, rise: 2, col: '#2f9e44' }, { k: 'D', run: 5, rise: 3, col: '#9a4fc4' }];
const SLIDE_E = { k: 'E', run: 20, rise: 6, col: '#c93a33' };
/** a playground slide drawn to scale (u px per metre) with its foot at (x0, y0) px; returns { g, lab } */
function drawSlide(svg, html, x0, y0, s, u, o = {}) {
  const g = svgEl('g', { class: 'u6l6-slide' }, svg), w = s.run * u, hh = s.rise * u;
  svgEl('rect', { x: x0, y: y0 - hh, width: w, height: hh, fill: '#e8f0fc' }, g);
  for (let i = 0; i <= s.run; i++) svgEl('line', { x1: x0 + i * u, y1: y0 - hh, x2: x0 + i * u, y2: y0, stroke: '#c6cedb', 'stroke-width': 1 }, g);
  for (let j = 0; j <= s.rise; j++) svgEl('line', { x1: x0, y1: y0 - j * u, x2: x0 + w, y2: y0 - j * u, stroke: '#c6cedb', 'stroke-width': 1 }, g);
  svgEl('path', { d: `M${x0} ${y0} L${x0 + w} ${y0 - hh} L${x0 + w} ${y0} Z`, fill: s.col, 'fill-opacity': 0.16 }, g);
  const lw = Math.max(6, u * 0.4);
  svgEl('path', { d: `M${x0 + w} ${y0} V${y0 - hh - u * 0.55} M${x0 + w + lw} ${y0} V${y0 - hh - u * 0.55}`, stroke: INK, 'stroke-width': 2.2 }, g);
  for (let k = 0.5; k <= s.rise + 1e-9; k += 0.5) svgEl('path', { d: `M${x0 + w} ${y0 - k * u} h${lw}`, stroke: INK, 'stroke-width': 1.4 }, g);
  svgEl('line', { x1: x0, y1: y0, x2: x0 + w, y2: y0 - hh, stroke: s.col, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  svgEl('line', { x1: x0 - 8, y1: y0, x2: x0 + w + lw + 14, y2: y0, stroke: '#2d6a2f', 'stroke-width': 2.4 }, g);
  const L = (x, y, html2, pos, cls) => { const d = h('div', 'bk-lab ' + cls, html2); html.appendChild(d); place(d, x, y, pos, 4); return d; };
  const sm = o.small ? ' u6l6-ssm' : '';
  const badge = L(x0 + 4, y0 - hh - 4, s.k, 'ne', 'u6l6-sbadge' + sm); badge.style.background = INK;
  const runL = L(x0 + w / 2, y0 + 2, `${s.run} m`, 's', 'u6l6-srun' + sm);
  const riseL = L(x0 + w - 3, y0 - hh * 0.36, `↑${s.rise} m`, 'w', 'u6l6-srise' + sm);
  const div = L(x0 + w * 0.42, y0 - hh * 0.62 - 6, T(`${s.rise}\\div${s.run}=${texNum(s.rise / s.run)}`), 'nw', 'u6l6-sdiv' + sm); div.style.color = s.col; hide(div);
  return { g, els: [badge, runL, riseL, div], div };
}
function mountSlides() {
  const host = document.getElementById('u6l6-slides'); if (!host) return;
  const W = Math.min(980, host.clientWidth || 980), u = 31, base = 4.8 * u, H = base + 44;
  const wrap = h('div', 'u6l6-swrap'); box(wrap, W, H); host.appendChild(wrap);
  const view = (slides, uu, gap, small) => {
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u6l6-sview' }, wrap), html = h('div', 'bk-html u6l6-sview'); wrap.appendChild(html);
    const tot = slides.reduce((t, s) => t + s.run * uu, 0) + gap * uu * (slides.length - 1);
    let x = (W - tot) / 2 - 8; const divs = [];
    slides.forEach((s) => { const r = drawSlide(svg, html, x, base, s, uu, { small }); divs.push(r.div); x += s.run * uu + gap * uu; });
    return { svg, html, divs };
  };
  const v1 = view(SLIDES, u, 1.6, false), v2 = view([...SLIDES, SLIDE_E], 18.5, 1.3, true);
  v2.svg.style.opacity = 0; v2.html.style.opacity = 0;
  const note = h('div', 'bk-lab u6l6-snote', 'All drawn to the same scale: every square is 1 m.'); v1.html.appendChild(note); place(note, W / 2, base + 26, 's', 2);
  const note2 = h('div', 'bk-lab u6l6-snote', 'Slide E joins the line-up, all five to one (smaller) scale.'); v2.html.appendChild(note2); place(note2, W / 2, base + 26, 's', 2);
  const ctx = liveCtx(); let dOn = false, eOn = false;
  const divs = [...v1.divs, ...v2.divs];
  document.getElementById('u6l6-wdiv').addEventListener('click', async () => {
    dOn = !dOn; for (const d of (eOn ? v2 : v1).divs) { if (dOn) await pop(ctx, d, 300); else d.style.opacity = 0; }
    for (const d of (eOn ? v1 : v2).divs) d.style.opacity = dOn ? 1 : 0;
  });
  document.getElementById('u6l6-we').addEventListener('click', async () => {
    eOn = !eOn; const [a, b] = eOn ? [v1, v2] : [v2, v1];
    await Promise.all([a.svg, a.html].map((e) => ctx.anim(e, [{ opacity: 1 }, { opacity: 0 }], 350)));
    a.svg.style.opacity = 0; a.html.style.opacity = 0;
    await Promise.all([b.svg, b.html].map((e) => ctx.anim(e, [{ opacity: 0 }, { opacity: 1 }], 450)));
    b.svg.style.opacity = 1; b.html.style.opacity = 1;
  });
  void divs;
}

/* =============================== static figures =============================== */
function grid(id, win, o = {}) {
  const host = document.getElementById(id); if (!host) return null;
  return new Graph(host, Object.assign({ width: o.w || 330, height: o.h || 330, xlabels: 2, ylabels: 2 }, win, o.g || {}));
}
const ptLab = (G, x, y, name, pos) => G.point(x, y, { color: INK, r: 6, label: T(name), pos });
function mountFigures() {
  // staircase (section 1)
  const st = document.getElementById('u6l6-stairfig');
  if (st) {
    const W = 230, H = 210, s = 52, x0 = 24, y0 = 186;
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, st), hh = h('div', 'bk-html'); st.style.position = 'relative'; st.appendChild(hh);
    let d = `M${x0} ${y0}`; for (let i = 0; i < 3; i++) d += ` h${s} v${-s}`;
    svgEl('path', { d: d + ` V${y0} Z`, fill: '#efe7d6' }, svg);
    svgEl('path', { d, fill: 'none', stroke: INK, 'stroke-width': 3.5, 'stroke-linejoin': 'round' }, svg);
    svgEl('line', { x1: x0, y1: y0, x2: x0 + 3 * s, y2: y0 - 3 * s, stroke: SEG, 'stroke-width': 3, 'stroke-dasharray': '8 6' }, svg);
    svgEl('path', { d: `M${x0 + s + 8} ${y0 - 4} V${y0 - s + 4}`, stroke: RISE, 'stroke-width': 3 }, svg);
    svgEl('path', { d: `M${x0 + 4} ${y0 + 10} H${x0 + s - 4}`, stroke: RUN, 'stroke-width': 3 }, svg);
    const L = (x, y, t, pos, cls) => { const e = h('div', 'bk-lab ' + cls, t); hh.appendChild(e); place(e, x, y, pos, 3); };
    L(x0 + s + 12, y0 - s / 2, 'rise', 'e', 'u6l6-trise u6l6-tlab'); L(x0 + s / 2, y0 + 12, 'run', 's', 'u6l6-trun u6l6-tlab');
  }
  let G = grid('u6l6-ex1fig', { xmin: -1, xmax: 7, ymin: -1, ymax: 7 }, { w: 320, h: 320 });
  if (G) { G.segment([1, 1], [5, 4], { color: SEG, width: 4 }); ptLab(G, 1, 1, 'A', 'se'); ptLab(G, 5, 4, 'B', 'nw'); }
  G = grid('u6l6-ex1ans', { xmin: -1, xmax: 7, ymin: -1, ymax: 7 }, { w: 240, h: 240, g: { fontSize: 14 } });
  if (G) {
    G.segment([1, 1], [5, 4], { color: SEG, width: 3.5 }); new SlopeTri(G, { x: 1, y: 1, run: 4, rise: 3 }, { w: 3.5, riseText: () => 'rise 3', runText: () => 'run 4' });
    ptLab(G, 1, 1, 'A', 'se'); ptLab(G, 5, 4, 'B', 'e');
  }
  G = grid('u6l6-ex2fig', { xmin: -1, xmax: 7, ymin: -1, ymax: 7 }, { w: 320, h: 320 });
  if (G) { G.segment([0, 1], [3, 4], { color: SEG, width: 4 }); G.segment([1, 0], [2, 5], { color: SEG, width: 4 }); ptLab(G, 0, 1, 'C', 'w'); ptLab(G, 3, 4, 'D', 'ne'); ptLab(G, 1, 0, 'E', 's'); ptLab(G, 2, 5, 'F', 'n'); }
  G = grid('u6l6-ex2ans', { xmin: -1, xmax: 7, ymin: -1, ymax: 7 }, { w: 240, h: 240, g: { fontSize: 14 } });
  if (G) {
    G.segment([0, 1], [3, 4], { color: SEG, width: 3.5 }); G.segment([1, 0], [2, 5], { color: SEG, width: 3.5 });
    new SlopeTri(G, { x: 0, y: 1, run: 3, rise: 3 }, { w: 3, runFirst: true, riseText: () => '3', runText: () => '3' });
    new SlopeTri(G, { x: 1, y: 0, run: 1, rise: 5 }, { w: 3, riseText: () => '5', runText: () => '1' });
    ptLab(G, 0, 1, 'C', 'w'); ptLab(G, 3, 4, 'D', 'ne'); ptLab(G, 1, 0, 'E', 's'); ptLab(G, 2, 5, 'F', 'n');
  }
  G = grid('u6l6-ex3fig', { xmin: -1, xmax: 6, ymin: -1, ymax: 9 }, { w: 230, h: 320 });
  if (G) { ptLab(G, 1, 2, 'P', 'se'); ptLab(G, 4, 8, 'Q', 'nw'); }
  G = grid('u6l6-ex4fig', { xmin: -6, xmax: 6, ymin: -6, ymax: 6 }, { w: 300, h: 300 });
  if (G) { G.segment([-3, -4], [3, 0], { color: SEG, width: 4 }); ptLab(G, -3, -4, 'R', 'sw'); ptLab(G, 3, 0, 'S', 'ne'); }
  // Example 5: the trail, to scale
  const tf = document.getElementById('u6l6-ex5fig');
  if (tf) {
    const W = 640, H = 150, x0 = 40, y0 = 110, k = 1.8; // 1.8 px per metre
    const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, tf), hh = h('div', 'bk-html'); tf.style.position = 'relative'; tf.appendChild(hh);
    svgEl('path', { d: `M${x0} ${y0} L${x0 + 300 * k} ${y0 - 45 * k} L${x0 + 300 * k} ${y0} Z`, fill: '#e9f2e1' }, svg);
    svgEl('line', { x1: x0, y1: y0, x2: x0 + 300 * k, y2: y0 - 45 * k, stroke: SEG, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
    svgEl('path', { d: `M${x0} ${y0} H${x0 + 300 * k} V${y0 - 45 * k}`, fill: 'none', stroke: INK, 'stroke-width': 2, 'stroke-dasharray': '6 5' }, svg);
    for (const [x, y] of [[x0, y0], [x0 + 300 * k, y0 - 45 * k]]) svgEl('circle', { cx: x, cy: y, r: 5.5, fill: INK }, svg);
    const L = (x, y, t, pos, cls = '') => { const e = h('div', 'bk-lab bk-ptlab ' + cls, t); hh.appendChild(e); place(e, x, y, pos, 6); };
    L(x0, y0, `trailhead ${T('(0,\\ 0)')}`, 's'); L(x0 + 300 * k, y0 - 45 * k, `lookout ${T('(300,\\ 45)')}`, 'n');
    L(x0 + 150 * k, y0, 'run = 300 m', 's', 'u6l6-trun'); L(x0 + 300 * k, y0 - 22 * k, 'rise = 45 m', 'e', 'u6l6-trise');
  }
}

/* =============================== drag the points =============================== */
function mountDrag() {
  const host = document.getElementById('u6l6-dragfig'), ro = document.getElementById('u6l6-ro'); if (!host || !ro) return;
  const G = new Graph(host, { width: 430, height: 390, xmin: 0, xmax: 10, ymin: 0, ymax: 9, origin: true });
  G.el.setAttribute('data-tap', ''); G.el.classList.add('bk-ix');
  const st = { P: [1, 1], Q: [5, 4] };
  const seg = G.segment(st.P, st.Q, { color: SEG, width: 4.5 });
  const tri = new SlopeTri(G, { x: 1, y: 1, run: 4, rise: 3 }, {});
  const hp = G.point(...st.P, { color: INK, r: 10, label: T('P'), pos: 'se' }), hq = G.point(...st.Q, { color: INK, r: 10, label: T('Q'), pos: 'nw' });
  [hp, hq].forEach((p) => { p.style.cursor = 'grab'; });
  const upd = () => {
    const [x1, y1] = st.P, [x2, y2] = st.Q, rise = y2 - y1, run = x2 - x1;
    G.remove(segRef.s); segRef.s = G.segment(st.P, st.Q, { color: SEG, width: 4.5 });
    G.moveTo(hp, x1, y1); G.moveTo(hq, x2, y2);
    tri.set({ x: x1, y: y1, run, rise });
    const [a, b] = red(rise, run);
    ro.innerHTML = `<div class="u6l6-ro-r u6l6-ro-rise"><span class="u6l6-ro-k">rise</span><b>${rise}</b></div><div class="u6l6-ro-r u6l6-ro-run"><span class="u6l6-ro-k">run</span><b>${run}</b></div>`
      + `<div class="u6l6-ro-m">${T(`m=${slopeTex(rise, run)}`)}</div><div class="u6l6-ro-w">climbs <b>${a}</b> for every <b>${b}</b> to the right</div>`;
  };
  const segRef = { s: seg };
  let drag = null;
  G.svg.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return; e.preventDefault();
    const [px, py] = G.pxOf(e), d = (p) => { const q = G.toPx(...st[p]); return Math.hypot(q[0] - px, q[1] - py); };
    const k = d('P') < d('Q') ? 'P' : 'Q'; if (d(k) > 34) return;
    drag = k; try { G.svg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  G.svg.addEventListener('pointermove', (e) => {
    if (!drag) return; const [x, y] = G.fromEvent(e);
    let nx = Math.max(0, Math.min(10, Math.round(x))), ny = Math.max(0, Math.min(9, Math.round(y)));
    // keep Q up and to the right of P: every segment in this lesson climbs to the right
    if (drag === 'Q') { nx = Math.max(nx, st.P[0] + 1); ny = Math.max(ny, st.P[1] + 1); } else { nx = Math.min(nx, st.Q[0] - 1); ny = Math.min(ny, st.Q[1] - 1); }
    if (nx !== st[drag][0] || ny !== st[drag][1]) { st[drag] = [nx, ny]; upd(); }
  });
  const up = () => { drag = null; };
  G.svg.addEventListener('pointerup', up); G.svg.addEventListener('pointercancel', up);
  document.querySelectorAll('[data-preset]').forEach((b) => b.addEventListener('click', () => { const v = b.dataset.preset.split(',').map(Number); st.P = [v[0], v[1]]; st.Q = [v[2], v[3]]; upd(); }));
  upd();
}

/* ======================================================================================
 * Explainer: the staircase
 * ====================================================================================== */
const STAIR = {
  one: { label: 'Steps: 1 up, 1 across', r: 1, u: 1, n: 5 },
  steep: { label: 'Steep steps: 2 up, 1 across', r: 2, u: 1, n: 4 },
  gentle: { label: 'Gentle steps: 1 up, 2 across', r: 1, u: 2, n: 4 }
};
const stairs = {
  title: 'A staircase: up a little, across a little',
  height: 460,
  minW: 900,
  choices: Object.keys(STAIR).map((k) => ({ v: k, label: STAIR[k].label })),
  intro: 'Every step of a staircase goes up and across. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = STAIR[k], H = ex.def.height, R = d.r * d.n, U = d.u * d.n;
    const G = sqGraph(stage, { xmin: -0.5, xmax: 9.5, ymin: -0.5, ymax: 9 }, 480, H - 20, { x: 10, y: 10, center: true, g: { numbers: false, axes: false } });
    const P = panel(stage, G.W + 30, 10, ex.W - G.W - 44, H - 20, 'Slope of the staircase');
    const pts = [[0, 0]]; for (let i = 0; i < d.n; i++) { const [x, y] = pts[pts.length - 1]; pts.push([x + d.u, y], [x + d.u, y + d.r]); }
    const x0 = 0.5, y0 = 0.5, S = (p) => [p[0] + x0, p[1] + y0];
    let one;
    return [
      { cap: `A staircase. Each step goes <b class="u6l6-crise">up ${d.r}</b> and <b class="u6l6-crun">across ${d.u}</b>.`,
        run: async (c) => {
          const fill = G.polyline([...pts.map(S), S([U, 0])], { closed: true, color: '#c9b48a', fill: '#efe7d6', fillOpacity: 1, width: 0.1 }); await appear(c, fill);
          const edge = G.polyline(pts.map(S), { color: INK, width: 4 }); await G.drawIn(edge, 1100, c);
        } },
      { cap: `Look at one step: the <b class="u6l6-crise">rise</b> is ${d.r} (up) and the <b class="u6l6-crun">run</b> is ${d.u} (across).`,
        run: async (c) => {
          one = new SlopeTri(G, { x: x0, y: y0, run: d.u, rise: d.r }, { runFirst: true, w: 6, runSide: 's', riseSide: 'e', fillOp: 0.18 });
          await one.drawIn(c, 450);
          await show(c, line(P, `one step: <b class="u6l6-crise">rise ${d.r}</b>, <b class="u6l6-crun">run ${d.u}</b>`));
        } },
      { cap: `Lay a ruler along the front corners of the steps: it makes a <b>straight line</b>. How steep is it?`,
        run: async (c) => { await G.drawIn(G.segment(S([0, 0]), S([U, R]), { color: SEG, width: 4, dash: '10 7' }), 900, c); } },
      { cap: `Slope compares the up with the across: ${T(`m=\\dfrac{\\text{rise}}{\\text{run}}=${slopeTex(d.r, d.u)}`)}.`,
        run: async (c) => { await show(c, line(P, T(`m=\\dfrac{\\text{rise}}{\\text{run}}=${slopeTex(d.r, d.u)}`), 'u6l6-big')); } },
      { cap: `The whole staircase: rise ${T(String(R))}, run ${T(String(U))}. ${T(`\\dfrac{${R}}{${U}}=${fr(R, U)}`)}, the <b>same</b> slope as one step.`,
        run: async (c) => {
          const all = new SlopeTri(G, { x: x0, y: y0, run: U, rise: R }, { runFirst: true, w: 4, fill: RISE, fillOp: 0.05, runSide: 's', riseSide: 'e', riseText: (v) => `<b>rise</b> ${v}`, runText: (v) => `<b>run</b> ${v}` });
          one.remove(); await all.drawIn(c, 600);
          await show(c, line(P, `whole staircase: ${T(`\\dfrac{${cR(R)}}{${cU(U)}}=${fr(R, U)}`)}`, 'u6l6-big'));
        } },
      { cap: d.r > d.u ? 'A big rise for a small run: a <b>steep</b> staircase and a <b>big</b> slope.' : d.r < d.u ? 'A small rise for a big run: a <b>gentle</b> staircase and a <b>small</b> slope.' : 'Rise and run the same: slope 1. Try the steep and the gentle steps too.',
        run: async (c) => { await answerBox(c, P, d.r > d.u ? `steep: slope <b>${d.r / d.u}</b>` : d.r < d.u ? `gentle: slope ${T(fr(d.r, d.u))}` : 'slope <b>1</b>'); } }
    ];
  }
};

/* ======================================================================================
 * Explainer: the warm-up slides, lined up at the same foot
 * ====================================================================================== */
const slides = {
  title: 'Tallest isn’t steepest: compare rise with run',
  height: 470,
  minW: 920,
  intro: 'All five slides, feet together, to the same scale. Press <b>Next</b>.',
  make(stage, k, ex) {
    const all = [...SLIDES, SLIDE_E], W = ex.W;
    const G = sqGraph(stage, { xmin: 0, xmax: 21, ymin: 0, ymax: 7 }, W - 40, 240, { x: 20, y: 16, center: true, g: { xlabels: 2, ylabels: 2 } });
    const NL = new NumberLine(stage, { x: 40, y: 290, width: W - 80, height: 120, axisY: 66, min: 0, max: 1, step: 0.1, labels: [0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => ({ v, html: T(texNum(v)) })) });
    const tag = h('div', 'u6l6-nltag', `${T('\\text{rise}\\div\\text{run}')}`); add(stage, tag, 40, 270);
    hide(NL.el); hide(tag);
    const steps = [{ cap: 'Line them up with their feet together. Each chute is a line segment from the foot to the top of the ladder.',
      run: async (c) => { await appear(c, NL.el); await appear(c, tag); } }];
    all.forEach((s) => {
      const v = s.rise / s.run;
      steps.push({ cap: `Slide <b>${s.k}</b>: ${s.rise} m up, ${s.run} m across. ${T(`\\dfrac{${s.rise}}{${s.run}}=${texNum(v)}`)}.${s.k === 'E' ? ' The tallest slide, but the <b>flattest</b> line!' : ''}`,
        run: async (c) => {
          const ln = G.segment([0, 0], [s.run, s.rise], { color: s.col, width: 4.5 }); await G.drawIn(ln, 600, c);
          const lb = G.label(s.run, s.rise, `<b>${s.k}</b>`, { pos: 'ne', cls: 'u6l6-slab', color: s.col, gap: 3 }); await pop(c, lb);
          const p = NL.point(v, { color: s.col, r: 9 }); await pop(c, p);
          await pop(c, NL.mark(v, `<b style="color:${s.col}">${s.k}</b>`, { pos: 'n' }));
        } });
    });
    steps.push({ cap: 'Steepest to gentlest: <b>B</b> (0.75), <b>D</b> (0.6), <b>A</b> (0.5), <b>C</b> (0.4), <b>E</b> (0.3). The steeper the line, the bigger <b>rise ÷ run</b>. That number is the <b>slope</b>.',
      run: async (c) => { const r = h('div', 'u6l6-rank', 'steepest <b>B</b> → <b>D</b> → <b>A</b> → <b>C</b> → <b>E</b> gentlest'); add(stage, r, 40, 420); await pop(c, r); } });
    return steps;
  }
};

/* ======================================================================================
 * Explainer: count up, then right
 * ====================================================================================== */
const CNT = {
  ex1: { label: 'Example 1 check', A: ['A', 1, 1], B: ['B', 5, 4] },
  cd: { label: `Example 2: ${T('CD')}`, A: ['C', 0, 1], B: ['D', 3, 4] },
  ef: { label: `Example 2: ${T('EF')}`, A: ['E', 1, 0], B: ['F', 2, 5] },
  demo: { label: `Demo: ${T('(-2,\\ -1)')} to ${T('(4,\\ 3)')}`, A: ['P', -2, -1], B: ['Q', 4, 3] }
};
const count = {
  title: 'Count up, then count right',
  height: 470,
  minW: 900,
  choices: Object.keys(CNT).map((k) => ({ v: k, label: CNT[k].label })),
  intro: 'Start at the lower point. Count squares <b>up</b> to the other point’s height, then <b>right</b> to the other point. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CNT[k], [nA, ax, ay] = d.A, [nB, bx, by] = d.B, rise = by - ay, run = bx - ax, H = ex.def.height;
    const win = k === 'demo' ? { xmin: -4, xmax: 6, ymin: -3, ymax: 6 } : { xmin: -1, xmax: 7, ymin: -1, ymax: 7 };
    const G = sqGraph(stage, win, 470, H - 20, { x: 10, y: 10, center: true });
    const P = panel(stage, G.W + 30, 10, ex.W - G.W - 44, H - 20, `From ${T(nA)} to ${T(nB)}`);
    const rr = h('div', 'u6l6-ro', `<div class="u6l6-ro-r u6l6-ro-rise"><span class="u6l6-ro-k">rise</span><b>?</b></div><div class="u6l6-ro-r u6l6-ro-run"><span class="u6l6-ro-k">run</span><b>?</b></div>`);
    P.appendChild(rr); const [vRise, vRun] = rr.querySelectorAll('b');
    let pieces = [];
    return [
      { cap: `Segment ${T(nA + nB)} from ${T(nA + P2(ax, ay))} to ${T(nB + P2(bx, by))}. Start at the lower point, ${T(nA)}.`,
        run: async (c) => {
          await G.drawIn(G.segment([ax, ay], [bx, by], { color: SEG, width: 4.5 }), 600, c);
          await G.reveal(G.point(ax, ay, { color: INK, r: 7, label: T(nA + P2(ax, ay)), pos: 'se' }), c);
          await G.reveal(G.point(bx, by, { color: INK, r: 7, label: T(nB + P2(bx, by)), pos: 'e', gap: 10 }), c);
        } },
      { cap: `<b>Rise:</b> count squares <b>up</b> from ${T(nA)} until you are level with ${T(nB)}: <b>${rise}</b>.`,
        run: async (c) => { pieces = pieces.concat(await countLeg(c, G, ax, ay, 'y', rise, { side: ax === 0 ? 'e' : 'w', ms: rise > 4 ? 180 : 260 })); vRise.innerHTML = T(cR(rise)); await pulse(c, vRise.parentNode, 1.08); } },
      { cap: `<b>Run:</b> now count squares <b>right</b> until you reach ${T(nB)}: <b>${run}</b>.`,
        run: async (c) => { pieces = pieces.concat(await countLeg(c, G, ax, by, 'x', run, { side: 'n' })); vRun.innerHTML = T(cU(run)); await pulse(c, vRun.parentNode, 1.08); } },
      { cap: `Rise on top, run on the bottom: ${T(`m=\\dfrac{\\text{rise}}{\\text{run}}=${slopeTex(rise, run)}`)}${red(rise, run)[1] !== run ? ', in lowest terms' : ''}.`,
        run: async (c) => { await show(c, line(P, T(`m=\\dfrac{\\text{rise}}{\\text{run}}=${slopeTex(rise, run)}`), 'u6l6-big')); } },
      { cap: `The segment rises <b>${red(rise, run)[0]}</b> for every <b>${red(rise, run)[1]}</b> to the right.${k === 'ef' ? ' Big rise, small run: a steep segment and a big slope.' : ''}`,
        run: async (c) => { const [a, b] = red(rise, run); await answerBox(c, P, `up <b>${a}</b> for every <b>${b}</b> right`); } }
    ];
  }
};

/* ======================================================================================
 * Explainer: rise on top — the flipped fraction is a different line
 * ====================================================================================== */
const FL = {
  ex1: { label: 'Example 1 numbers', A: ['A', 1, 1], B: ['B', 5, 4], win: { xmin: -1, xmax: 8, ymin: -1, ymax: 7 } },
  ex4: { label: 'Example 4 numbers', A: ['R', -3, -4], B: ['S', 3, 0], win: { xmin: -5, xmax: 5, ymin: -5, ymax: 4 } }
};
const flip = {
  title: 'Rise on top: the flipped fraction misses',
  height: 470,
  minW: 900,
  choices: Object.keys(FL).map((k) => ({ v: k, label: FL[k].label })),
  intro: 'Two students wrote the slope two ways. Which one really reaches the other point? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FL[k], [nA, ax, ay] = d.A, [nB, bx, by] = d.B, rise = by - ay, run = bx - ax, H = ex.def.height;
    const G = sqGraph(stage, d.win, 470, H - 20, { x: 10, y: 10, center: true });
    const P = panel(stage, G.W + 30, 10, ex.W - G.W - 44, H - 20, 'Which fraction is right?');
    const ok = line(P, '', 'u6l6-try'), bad = line(P, '', 'u6l6-try'); hide(ok); hide(bad);
    return [
      { cap: `From ${T(nA + P2(ax, ay))} to ${T(nB + P2(bx, by))}: up <b>${rise}</b>, right <b>${run}</b>.`,
        run: async (c) => {
          await G.reveal(G.point(ax, ay, { color: INK, r: 7, label: T(nA), pos: 'se' }), c);
          await G.reveal(G.point(bx, by, { color: INK, r: 7, label: T(nB), pos: 'n' }), c);
        } },
      { cap: `${T(`\\dfrac{\\text{rise}}{\\text{run}}=\\dfrac{${rise}}{${run}}`)}: from ${T(nA)} go right ${run} and up ${rise}. We land on ${T(nB)} ✓`,
        run: async (c) => {
          const t = new SlopeTri(G, { x: ax, y: ay, run, rise }, { fill: GRN, fillOp: 0.12, runFirst: true }); await t.drawIn(c, 450);
          await G.drawIn(G.segment([ax, ay], [bx, by], { color: GRN, width: 4.5 }), 500, c);
          ok.innerHTML = `${T(`\\dfrac{${cR(rise)}}{${cU(run)}}`)}&ensp;rise on top: lands on ${T(nB)} <b class="u6l6-okc">✓</b>`; await show(c, ok);
        } },
      { cap: `Flipped, ${T(`\\dfrac{${run}}{${rise}}`)} means up ${run}, right ${rise}. That lands on ${T(P2(ax + rise, ay + run))}, not ${T(nB)} ✗`,
        run: async (c) => {
          const t = new SlopeTri(G, { x: ax, y: ay, run: rise, rise: run }, { fill: RED, fillOp: 0.1, riseSide: 'w', runSide: 'n' }); await t.drawIn(c, 450);
          await G.drawIn(G.segment([ax, ay], [ax + rise, ay + run], { color: RED, width: 4.5, dash: '9 6' }), 500, c);
          await G.reveal(G.point(ax + rise, ay + run, { color: RED, r: 7, label: T(P2(ax + rise, ay + run)), pos: 'n', labelColor: RED }), c);
          bad.innerHTML = `${T(`\\dfrac{${run}}{${rise}}`)}&ensp;flipped: misses ${T(nB)} <b class="u6l6-badc">✗</b>`; await show(c, bad);
        } },
      { cap: `The flipped line is much <b>steeper</b>: ${T(`\\dfrac{${run}}{${rise}}`)} is bigger than ${T(`\\dfrac{${rise}}{${run}}`)}. <b>Rise on top, run on the bottom.</b>`,
        run: async (c) => { await answerBox(c, P, `${T(`m=\\dfrac{\\text{rise}}{\\text{run}}=${slopeTex(rise, run)}`)}`); } }
    ];
  }
};

/* ======================================================================================
 * Explainer: counting becomes subtracting — the slope formula
 * ====================================================================================== */
const FM = {
  ex3: { label: 'Example 3 check', A: ['P', 1, 2], B: ['Q', 4, 8], win: { xmin: -1, xmax: 7, ymin: -1, ymax: 9 } },
  ex4: { label: 'Example 4 check', A: ['R', -3, -4], B: ['S', 3, 0], win: { xmin: -5, xmax: 5, ymin: -6, ymax: 3 } }
};
const formula = {
  title: 'Counting becomes subtracting: the slope formula',
  height: 480,
  minW: 920,
  capH: 96,
  choices: Object.keys(FM).map((k) => ({ v: k, label: FM[k].label })),
  intro: 'No grid to count on? Subtract the coordinates instead. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FM[k], [nA, ax, ay] = d.A, [nB, bx, by] = d.B, rise = by - ay, run = bx - ax, H = ex.def.height;
    const G = sqGraph(stage, d.win, 420, H - 20, { x: 10, y: 10, center: true });
    const P = panel(stage, G.W + 30, 10, ex.W - G.W - 44, H - 20, '');
    const riseT = `y_2-y_1=${texNum(by)}-${par(ay)}`, runT = `x_2-x_1=${texNum(bx)}-${par(ax)}`;
    const mT = `m=\\dfrac{${cR(`${texNum(by)}-${par(ay)}`)}}{${cU(`${texNum(bx)}-${par(ax)}`)}}=${slopeTex(rise, run)}`;
    const rev = `\\dfrac{${texNum(ay)}-${par(by)}}{${texNum(ax)}-${par(bx)}}=\\dfrac{${texNum(-rise)}}{${texNum(-run)}}=${fr(rise, run)}`;
    const mix = `\\dfrac{${texNum(by)}-${par(ay)}}{${texNum(ax)}-${par(bx)}}=\\dfrac{${texNum(rise)}}{${texNum(-run)}}=${fr(rise, -run)}`;
    return [
      { cap: `Name the points: ${T(`${nA}${P2(ax, ay)}=(x_1,\\ y_1)`)} and ${T(`${nB}${P2(bx, by)}=(x_2,\\ y_2)`)}.`,
        run: async (c) => {
          await G.reveal(G.point(ax, ay, { color: INK, r: 7, label: T(`${nA}(x_1,\\ y_1)`), pos: 'se' }), c);
          await G.reveal(G.point(bx, by, { color: INK, r: 7, label: T(`${nB}(x_2,\\ y_2)`), pos: 'nw' }), c);
          await G.drawIn(G.segment([ax, ay], [bx, by], { color: SEG, width: 4.5 }), 500, c);
          await show(c, line(P, `${T(`${nA}${P2(ax, ay)}=(x_1,\\ y_1)`)}<br>${T(`${nB}${P2(bx, by)}=(x_2,\\ y_2)`)}`));
        } },
      { cap: `The <b class="u6l6-crise">rise</b> is the change in ${T('y')}: ${T(`${riseT}=${rise}`)}. Count it on the grid: the same ${rise}.`,
        run: async (c) => {
          const t = G.segment([bx, ay], [bx, by], { color: RISE, width: 5 }); await G.drawIn(t, 500, c);
          await pop(c, G.label(bx, (ay + by) / 2, `<b>rise</b> ${rise}`, { pos: 'e', cls: 'u6l6-tlab u6l6-trise', gap: 6 }));
          await show(c, line(P, T(cR(`\\text{rise}=${riseT}=${rise}`))));
        } },
      { cap: `The <b class="u6l6-crun">run</b> is the change in ${T('x')}: ${T(`${runT}=${run}`)}.`,
        run: async (c) => {
          const t = G.segment([ax, ay], [bx, ay], { color: RUN, width: 5 }); await G.drawIn(t, 500, c);
          await pop(c, G.label((ax + bx) / 2, ay, `<b>run</b> ${run}`, { pos: 's', cls: 'u6l6-tlab u6l6-trun', gap: 6 }));
          await show(c, line(P, T(cU(`\\text{run}=${runT}=${run}`))));
        } },
      { cap: `Rise over run: ${T(`m=\\dfrac{y_2-y_1}{x_2-x_1}=${slopeTex(rise, run)}`)}.`,
        run: async (c) => { await show(c, line(P, T(mT), 'u6l6-big')); } },
      { cap: `Start with ${T(nB)} instead? Both subtractions flip: ${T(rev)}. A negative over a negative is positive: the <b>same</b> slope ✓`,
        run: async (c) => { await show(c, line(P, `${T(nB)} first: ${T(rev)} <b class="u6l6-okc">✓</b>`, 'u6l6-sm')); } },
      { cap: `But <b>mixing</b> the order (top from ${T(nA)}, bottom from ${T(nB)}) gives ${T(mix)}: the wrong sign ✗ Keep the same order top and bottom.`,
        run: async (c) => {
          await show(c, line(P, `mixed order: ${T(mix)} <b class="u6l6-badc">✗</b>`, 'u6l6-sm'));
          await answerBox(c, P, `${T(`m=${fr(rise, run)}`)}`);
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: lowest terms — the triangle splits into smaller copies
 * ====================================================================================== */
const SP = {
  ex3: { label: 'Example 3: 6 over 3', A: [1, 2], rise: 6, run: 3, win: { xmin: -1, xmax: 7, ymin: -1, ymax: 9 } },
  ex4: { label: 'Example 4: 4 over 6', A: [-3, -4], rise: 4, run: 6, win: { xmin: -5, xmax: 5, ymin: -5, ymax: 2 } },
  demo: { label: 'Demo: 6 over 9', A: [0, 0], rise: 6, run: 9, win: { xmin: -1, xmax: 10, ymin: -1, ymax: 7 } }
};
const split = {
  title: 'Lowest terms: smaller triangles, same slope',
  height: 470,
  minW: 900,
  choices: Object.keys(SP).map((k) => ({ v: k, label: SP[k].label })),
  intro: 'One big slope triangle. What happens if we cut it into equal pieces? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SP[k], [ax, ay] = d.A, R = d.rise, U = d.run, g = gcd(R, U), r = R / g, u = U / g, H = ex.def.height;
    const G = sqGraph(stage, d.win, 470, H - 20, { x: 10, y: 10, center: true });
    const P = panel(stage, G.W + 30, 10, ex.W - G.W - 44, H - 20, 'The slope triangle');
    let big; const small = [];
    return [
      { cap: `The whole segment: rise ${T(cR(R))}, run ${T(cU(U))}. ${T(`m=\\dfrac{${cR(R)}}{${cU(U)}}`)}.`,
        run: async (c) => {
          await G.drawIn(G.segment([ax, ay], [ax + U, ay + R], { color: SEG, width: 4.5 }), 600, c);
          big = new SlopeTri(G, { x: ax, y: ay, run: U, rise: R }, { runFirst: true, fillOp: 0.08 }); await big.drawIn(c, 450);
          await show(c, line(P, T(`m=\\dfrac{${cR(R)}}{${cU(U)}}`), 'u6l6-big'));
        } },
      { cap: `Both ${R} and ${U} can be divided by <b>${g}</b>. Cut the segment into <b>${g}</b> equal pieces: ${g} small triangles.`,
        run: async (c) => {
          big.g.style.opacity = 0.3; big.lRun.style.opacity = 0.3; big.lRise.style.opacity = 0.3;
          for (let i = 0; i < g; i++) {
            const t = new SlopeTri(G, { x: ax + i * u, y: ay + i * r, run: u, rise: r }, { runFirst: true, w: 4, fill: GRN, fillOp: 0.16, runSide: 's', riseSide: 'e', runText: (v) => String(v), riseText: (v) => String(v) });
            small.push(t); await t.drawIn(c, 260);
          }
        } },
      { cap: `Each small triangle: rise ${T(cR(r))}, run ${T(cU(u))}. The same shape, just smaller.`,
        run: async (c) => { for (const t of small) await pulse(c, t.g, 1.04); await show(c, line(P, `each small one: ${T(`\\dfrac{${cR(r)}}{${cU(u)}}`)}`)); } },
      { cap: `${T(`\\dfrac{${R}}{${U}}=\\dfrac{${R}\\div${g}}{${U}\\div${g}}=${fr(R, U)}`)}. Lowest terms tells the <b>smallest step</b>: up ${r} for every ${u} to the right.`,
        run: async (c) => {
          await show(c, line(P, T(`\\dfrac{${R}}{${U}}=\\dfrac{${R}\\div${g}}{${U}\\div${g}}=${fr(R, U)}`), 'u6l6-big'));
          await answerBox(c, P, `up <b>${r}</b> for every <b>${u}</b> right`);
        } }
    ];
  }
};

/* ======================================================================================
 * Explainer: slope in the real world — a trail and its grade
 * ====================================================================================== */
const GR = {
  ex5: { label: 'Example 5 check', U: 300, R: 45, a: 'trailhead', b: 'lookout', steps: [5, 3], xl: 50 },
  drive: { label: 'Demo: a steep driveway', U: 16, R: 2, a: 'street', b: 'garage', steps: [2], xl: 2 }
};
const grade = {
  title: 'A trail, a slope and a grade',
  height: 470,
  minW: 920,
  capH: 96,
  choices: Object.keys(GR).map((k) => ({ v: k, label: GR[k].label })),
  intro: 'Real slopes are drawn to scale here: most roads and trails are much flatter than they feel. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = GR[k], U = d.U, R = d.R, g = gcd(R, U), r = R / g, u = U / g, H = ex.def.height, W = ex.W;
    const win = { xmin: 0, xmax: U * 1.06, ymin: 0, ymax: Math.max(R * 1.6, U * 0.18) };
    const G = sqGraph(stage, win, W - 40, 230, { x: 20, y: 6, center: true, g: { xlabels: d.xl, ylabels: d.xl, xstep: d.xl, ystep: d.xl } });
    const P = panel(stage, 20, 248, W - 40, H - 256, '');
    const chain = []; let cur = R, cu = U; for (const s of d.steps) { chain.push(`\\dfrac{${cur}\\div${s}}{${cu}\\div${s}}=\\dfrac{${cur / s}}{${cu / s}}`); cur /= s; cu /= s; }
    const pct = +(100 * R / U).toFixed(1);
    return [
      { cap: `The ${d.a} at ${T('(0,\\ 0)')} and the ${d.b} at ${T(P2(U, R))}, in metres, drawn to scale.`,
        run: async (c) => {
          await G.reveal(G.point(0, 0, { color: INK, r: 6, label: d.a, pos: 'ne' }), c);
          await G.drawIn(G.segment([0, 0], [U, R], { color: SEG, width: 4.5 }), 900, c);
          await G.reveal(G.point(U, R, { color: INK, r: 6, label: `${d.b} ${T(P2(U, R))}`, pos: 'nw' }), c);
        } },
      { cap: `Rise: ${T(`${R}-0=${R}`)} m. Run: ${T(`${U}-0=${U}`)} m. So ${T(`m=\\dfrac{${cR(R)}}{${cU(U)}}`)}.`,
        run: async (c) => {
          const t = new SlopeTri(G, { x: 0, y: 0, run: U, rise: R }, { runFirst: true, w: 4, runText: () => `run ${U} m`, riseText: () => `rise ${R} m`, riseSide: 'w', runSide: 's' }); await t.drawIn(c, 600);
          await show(c, line(P, T(`m=\\dfrac{y_2-y_1}{x_2-x_1}=\\dfrac{${cR(`${R}-0`)}}{${cU(`${U}-0`)}}=\\dfrac{${cR(R)}}{${cU(U)}}`), 'u6l6-big'));
        } },
      { cap: `Reduce: ${chain.map((s) => T(s)).join(', then ')}. In lowest terms, ${T(`m=${fr(R, U)}`)}.`,
        run: async (c) => { await show(c, line(P, T(`\\dfrac{${R}}{${U}}=${chain.map((s) => s.split('=')[1]).join('=')}`), 'u6l6-big')); } },
      { cap: `${T(fr(R, U))} means <b>${r} m up for every ${u} m across</b>: ${g} small steps of ${u} across and ${r} up make the whole trip.`,
        run: async (c) => {
          for (let i = 0; i < g; i++) {
            const t = G.polyline([[i * u, i * r], [(i + 1) * u, i * r], [(i + 1) * u, (i + 1) * r]], { color: GRN, width: 2.5 });
            await G.drawIn(t, g > 6 ? 90 : 300, c);
          }
        } },
      { cap: `As a percent: ${T(`${r}\\div${u}=${texNum(R / U)}=${pct}\\%`)}. That is the <b>grade</b>, the way road signs show slope.`,
        run: async (c) => { await answerBox(c, P, `${T(`m=${fr(R, U)}`)}, a <b>${pct}%</b> grade`); } }
    ];
  }
};

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const pr = (v) => (v < 0 ? '(' + v + ')' : String(v));
  const P = (nm, p) => nm + '(' + p[0] + ',\\ ' + p[1] + ')';
  const NAMES = [['A', 'B'], ['C', 'D'], ['P', 'Q'], ['R', 'S'], ['E', 'F'], ['J', 'K'], ['G', 'H'], ['M', 'N']];
  const frS = (a, b) => { const [p, q] = red(a, b); return q === 1 ? String(p) : '\\dfrac{' + p + '}{' + q + '}'; };
  const slopeS = (a, b) => { const [p, q] = red(a, b); return '\\dfrac{' + a + '}{' + b + '}' + (p === a && q === b ? '' : '=' + frS(a, b)); };
  const C = { ink: '#1c2230', grid: '#cdd3dc', num: '#3a4254', blue: '#1f5bd6' };
  function gridSVG(x0, x1, y0, y1, A, B, nA, nB) {
    const u = 30, m = 26, W = (x1 - x0) * u + 2 * m, H = (y1 - y0) * u + 2 * m, X = (x) => m + (x - x0) * u, Y = (y) => m + (y1 - y) * u;
    let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif" role="img" aria-label="segment ${nA}${nB}">`;
    s += `<rect x="${X(x0)}" y="${Y(y1)}" width="${(x1 - x0) * u}" height="${(y1 - y0) * u}" fill="#fff"/>`;
    for (let x = x0; x <= x1; x++) s += `<line x1="${X(x)}" y1="${Y(y0)}" x2="${X(x)}" y2="${Y(y1)}" stroke="${C.grid}"/>`;
    for (let y = y0; y <= y1; y++) s += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="${C.grid}"/>`;
    if (y0 <= 0 && y1 >= 0) s += `<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="${C.ink}" stroke-width="2"/>`;
    if (x0 <= 0 && x1 >= 0) s += `<line x1="${X(0)}" y1="${Y(y0)}" x2="${X(0)}" y2="${Y(y1)}" stroke="${C.ink}" stroke-width="2"/>`;
    const halo = 'paint-order="stroke" stroke="#fff" stroke-width="4"';
    for (let x = x0 + 1; x < x1; x++) if (x && x % 2 === 0) s += `<text x="${X(x)}" y="${Y(0) + 17}" font-size="14" font-weight="600" fill="${C.num}" text-anchor="middle" ${halo}>${x < 0 ? '−' + -x : x}</text>`;
    for (let y = y0 + 1; y < y1; y++) if (y && y % 2 === 0) s += `<text x="${X(0) - 6}" y="${Y(y) + 5}" font-size="14" font-weight="600" fill="${C.num}" text-anchor="end" ${halo}>${y < 0 ? '−' + -y : y}</text>`;
    s += `<line x1="${X(A[0])}" y1="${Y(A[1])}" x2="${X(B[0])}" y2="${Y(B[1])}" stroke="${C.blue}" stroke-width="3.5" stroke-linecap="round"/>`;
    for (const [p, t, dx, dy] of [[A, nA, 14, 16], [B, nB, -14, -8]]) s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="5.5" fill="${C.ink}"/><text x="${X(p[0]) + dx}" y="${Y(p[1]) + dy}" font-size="19" font-weight="700" fill="${C.ink}" text-anchor="middle" ${halo}>${t}</text>`;
    return s + '</svg>';
  }
  // count rise and run off a grid (climbing to the right)
  function onGrid(r) {
    for (;;) {
      const rise = r.int(1, 6), run = r.int(1, 6), A = [r.int(-5, 3), r.int(-5, 2)], B = [A[0] + run, A[1] + rise];
      if (B[0] > 6 || B[1] > 6 || rise === run && r.chance(0.6)) continue;
      const [nA, nB] = r.pick(NAMES);
      return { text: `Count the rise and the run from <i>${nA}</i> to <i>${nB}</i>. Write the slope of <i>${nA}${nB}</i> in lowest terms.`, q: '',
        fig: gridSVG(-6, 7, -6, 7, A, B, nA, nB),
        a: ['\\text{rise}=' + rise + ',\\quad \\text{run}=' + run, 'm=' + slopeS(rise, run)] };
    }
  }
  // the slope formula (positive coordinates, or with negatives)
  function formula(r, neg) {
    for (;;) {
      const run = r.int(1, 9), rise = r.int(1, 9), A = neg ? [r.int(-9, 3), r.int(-9, 3)] : [r.int(0, 8), r.int(0, 8)], B = [A[0] + run, A[1] + rise];
      if (neg && ![...A, ...B].some((v) => v < 0)) continue;
      if (gcd(rise, run) === 1 && r.chance(0.5)) continue; // most answers reduce
      const [nA, nB] = r.pick(NAMES);
      return { text: 'Use the slope formula. Give the slope in lowest terms.', q: P(nA, A) + '\\qquad ' + P(nB, B),
        a: ['m=\\dfrac{y_2-y_1}{x_2-x_1}=\\dfrac{' + B[1] + '-' + pr(A[1]) + '}{' + B[0] + '-' + pr(A[0]) + '}', '=' + slopeS(rise, run)] };
    }
  }
  const CTX = [
    (a, b) => `A ramp rises ${a} cm over a horizontal distance of ${b} cm.`,
    (a, b) => `A road climbs ${a} m over a horizontal distance of ${b} m.`,
    (a, b) => `A roof rises ${a} ft over a run of ${b} ft.`,
    (a, b) => `A bike trail goes from (0, 0) to (${b}, ${a}) on a map where each unit is 1 m.`
  ];
  // real-world slope with bigger numbers that reduce
  function world(r) {
    const k = r.pick([5, 10, 20, 25, 50]), p = r.int(1, 4), q = r.int(p + 1, 12), [a, b] = red(p, q), rise = a * k, run = b * k;
    if (rise >= run) return world(r);
    const f = r.pick(CTX);
    return { text: f(rise, run) + ' Find the slope in lowest terms, and say it in words.', q: '',
      a: ['m=\\dfrac{\\text{rise}}{\\text{run}}=' + slopeS(rise, run), '\\text{up } ' + a + '\\text{ for every } ' + b + '\\text{ across}'] };
  }
  standup('u6l6', {
    intro: 'At your whiteboard station: rise on top, run on the bottom, and reduce at the end.',
    levels: {
      BEG: onGrid,                                                         // count rise and run off a grid
      PRG: (r) => formula(r, r.chance(0.5)),                              // the slope formula, sometimes with negatives
      MAS: (r) => (r.chance(0.5) ? formula(r, true) : world(r))           // negatives, or a real-world slope with big numbers
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountSlides();
mountFigures();
mountDrag();
export const explainers = mountExplainers({ stairs, slides, count, flip, formula, split, grade });
export const _test = { STAIR, CNT, FL, FM, SP, GR, SLIDES, red, fr };
