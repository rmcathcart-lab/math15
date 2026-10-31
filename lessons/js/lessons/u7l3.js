/* Math 15 · Unit 7 · Lesson 3 — Graphing a Line Using Slope–Intercept Form.
 * Warm-up (Frog Hops: two frogs hop across a lily-pond grid; ruler through the landings), static example grids and
 * answer figures, a "make your own line" builder, and the explainers:
 *   frogLine (the frogs are lines: the start is b, the hop is m; ruler → y = 2/3 x + 1 and y = −1/2 x + 8),
 *   readMB (spot m and b in the equation with braces, fill a table: whole numbers, signs and hidden 1s, fractions;
 *     Example 1(a) check), start (why (0, b): the y-axis is x = 0, so y = b with no work; Example 1 check),
 *   overOne (a whole-number slope over 1, then right by the run and up by the rise; Example 2 check),
 *   stepGraph (all three steps, forward and backward hops, ruler, a check point; Example 3 and 4 checks),
 *   traps (rise/run swapped, b on the x-axis, sign of b dropped: each caught by checking a point),
 *   negStep (a negative slope steps down; mirror of the positive line; Example 5(a) check),
 *   fracStep (step right by the denominator: one square at a time lands between grid lines; Example 5(b) check).
 * Colours: m and lines blue, b / y-intercept green, run amber, rise purple; mistakes red. Pieces from Math 10C u7l1. */
import {
  h, tex, add, box, Graph, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  pairTex, texNum, svgEl, liveCtx, pulse, place, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RUN = COLORS.amber, RISE = COLORS.purple, LINE = COLORS.blue, BC = COLORS.green, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const FROG_G = '#2ea043', FROG_B = '#1f6fd6';
const cR = (s) => `\\textcolor{${RISE}}{${s}}`, cU = (s) => `\\textcolor{${RUN}}{${s}}`;
const cM = (s) => `\\textcolor{${LINE}}{${s}}`, cB = (s) => `\\textcolor{${BC}}{${s}}`, cX = (s) => `\\textcolor{${RED}}{${s}}`;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const red = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
/** TeX of a reduced fraction (sign in front), whole numbers plain */
const fr = (n, d, big) => { const [a, b] = red(n, d); if (b === 1) return String(a); return (a < 0 ? '-' : '') + `\\${big ? 'd' : 't'}frac{${Math.abs(a)}}{${b}}`; };
/** y = mx + b as TeX, m blue and b green (each with its sign); m = [n, d] */
function eqTex(m, b, o = {}) {
  const col = o.color !== false, C1 = col ? cM : (s) => s, C2 = col ? cB : (s) => s;
  const [mn, md] = red(m[0], m[1]), mv = mn / md;
  let s = '';
  if (mn !== 0) {
    const mag = md === 1 ? (Math.abs(mn) === 1 ? '' : String(Math.abs(mn))) : `\\${o.big ? 'd' : 't'}frac{${Math.abs(mn)}}{${md}}`;
    s = (mag || mv < 0 ? C1((mv < 0 ? '-' : '') + mag) : '') + 'x';
  }
  if (b !== 0 || !s) {
    if (!s) s = C2(String(b));
    else s += b < 0 ? `\\mathbin{${C2('-')}}${C2(String(-b))}` : `+${C2(String(b))}`;
  }
  return `y=${s}`;
}
const n = (v) => texNum(v).replace('-', '−');
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l3-panel ' + cls, title ? `<div class="u7l3-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u7l3-line ' + cls, html); p.appendChild(d); return d; };
/** "right 3, up 2" in words, run amber and rise purple */
const dirW = (run, rise) => `${run > 0 ? 'right' : 'left'} ${T(cU(String(Math.abs(run))))}, ${rise > 0 ? 'up' : 'down'} ${T(cR(String(Math.abs(rise))))}`;
/** m as rise / run with colours: 3 → 3/1, −2 → −2/1 */
const rrTex = (rise, run) => `\\dfrac{${cR(String(rise))}}{${cU(String(run))}}`;
const grid = (host, o = {}) => new Graph(host, Object.assign({ x: 14, y: 14, width: 470, height: 470, xmin: -8.5, xmax: 8.5, ymin: -8.5, ymax: 8.5, xlabels: 2, ylabels: 2 }, o));

/* ---------------------------------------------------------------------------------------------------------------
 * Slope triangle on a Graph (from Math 10C u7l1): run leg (amber) from (x, y) across, then rise leg (purple).
 * ------------------------------------------------------------------------------------------------------------- */
class SlopeTri {
  constructor(G, s, o = {}) {
    this.G = G; this.s = Object.assign({}, s); this.o = o;
    const L = o.layer || G.layers.data, w = o.w || 5;
    this.g = svgEl('g', { class: 'u7l3-tri' }, L);
    this.fill = svgEl('path', { fill: o.fill || LINE, 'fill-opacity': o.fillOp ?? 0.08, stroke: 'none' }, this.g);
    this.runP = svgEl('path', { class: 'bk-stroke', stroke: o.color || RUN, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.riseP = svgEl('path', { class: 'bk-stroke', stroke: o.color || RISE, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.lRun = o.labels === false ? null : h('div', 'bk-lab u7l3-tlab u7l3-trun');
    this.lRise = o.labels === false ? null : h('div', 'bk-lab u7l3-tlab u7l3-trise');
    if (this.lRun) G.html.append(this.lRun, this.lRise);
    G.track(this.g, () => this.draw());
  }
  draw() {
    const G = this.G, { x, y, run, rise } = this.s;
    const P = G.toPx(x, y), C = G.toPx(x + run, y), Q = G.toPx(x + run, y + rise);
    const d = (a, b) => `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    this.fill.setAttribute('d', `M${P[0]} ${P[1]} L${C[0]} ${C[1]} L${Q[0]} ${Q[1]} Z`);
    this.runP.setAttribute('d', d(P, C)); this.riseP.setAttribute('d', d(C, Q));
    if (!this.lRun) return;
    this.lRun.innerHTML = `<b>${run > 0 ? 'right' : 'left'}</b> ${n(Math.abs(run))}`;
    this.lRise.innerHTML = `<b>${rise > 0 ? 'up' : 'down'}</b> ${n(Math.abs(rise))}`;
    if (this.o.wrong) { this.lRun.classList.add('u7l3-tlab-x'); this.lRise.classList.add('u7l3-tlab-x'); }
    place(this.lRun, (P[0] + C[0]) / 2, P[1], this.o.runSide || (rise >= 0 ? 's' : 'n'), 6);
    place(this.lRise, C[0], (C[1] + Q[1]) / 2, this.o.riseSide || (run >= 0 ? 'e' : 'w'), 8);
  }
  async drawIn(c, ms = 450) {
    const [lr, ls] = [this.lRun, this.lRise]; this.fill.style.opacity = 0; hide(lr); hide(ls);
    await drawIn(this.runP, ms, c); if (lr) await fadeIn(c, lr, 200);
    await drawIn(this.riseP, ms, c); if (ls) await fadeIn(c, ls, 200);
    await appear(c, this.fill, 220);
  }
  remove() { this.G.remove(this.g); if (this.lRun) { this.lRun.remove(); this.lRise.remove(); } }
  /** keep the legs, faded, and drop the labels (so the next triangle's labels have room) */
  quiet() { this.g.style.opacity = 0.4; if (this.lRun) { this.lRun.remove(); this.lRise.remove(); this.lRun = this.lRise = null; } }
}

/** the green y-intercept dot with its label */
const bPoint = (G, b, o = {}) => G.point(0, b, { color: BC, r: 8.5, label: T(pairTex(0, b)), pos: o.pos || 'w', labelCls: 'u7l3-bint' });
/** a hop from `from`: triangle, then the landing dot; returns { tri, pt } */
async function hop(c, G, from, run, rise, o = {}) {
  const t = new SlopeTri(G, { x: from[0], y: from[1], run, rise }, o);
  await t.drawIn(c, o.ms || 380);
  const pt = G.point(from[0] + run, from[1] + rise, { color: o.ptColor || INK, r: 7, label: o.label ? T(pairTex(from[0] + run, from[1] + rise)) : null, pos: o.pos || 'e', labelCls: 'u7l3-plab' });
  await G.reveal(pt, c);
  return { tri: t, pt };
}

/* ====================================================================================================
 * Warm-up: Frog Hops. Pads A(2,7) B(3,3) C(4,4) D(4,6) E(5,5) F(6,5) G(8,4) H(9,7); Green (0,1) up 2 right 3;
 * Blue (0,8) down 1 right 2.
 * ==================================================================================================== */
const PADS = { A: [2, 7], B: [3, 3], C: [4, 4], D: [4, 6], E: [5, 5], F: [6, 5], G: [8, 4], H: [9, 7] };
const padAt = (x, y) => Object.keys(PADS).find((k) => PADS[k][0] === x && PADS[k][1] === y) || null;
function drawPad(G, x, y, parent) {
  const [px, py] = G.toPx(x, y), r = 17, a = 0.36;
  const d = `M${px} ${py} L${(px + r * Math.cos(a)).toFixed(1)} ${(py - r * Math.sin(a)).toFixed(1)} A${r} ${r * 0.86} 0 1 0 ${(px + r * Math.cos(a)).toFixed(1)} ${(py + r * Math.sin(a)).toFixed(1)} Z`;
  return svgEl('path', { d, fill: '#46963c', stroke: '#1f4a1a', 'stroke-width': 1.4, class: 'u7l3-pad' }, parent);
}
function drawFrog(parent, color) {
  const g = svgEl('g', { class: 'u7l3-frog' }, parent);
  svgEl('ellipse', { cx: 0, cy: 2, rx: 15, ry: 11, fill: color, stroke: '#1d2630', 'stroke-width': 1.4 }, g);
  for (const s of [-1, 1]) {
    svgEl('circle', { cx: 7 * s, cy: -9, r: 5.5, fill: color, stroke: '#1d2630', 'stroke-width': 1.3 }, g);
    svgEl('circle', { cx: 7 * s, cy: -9, r: 3, fill: '#fff' }, g);
    svgEl('circle', { cx: 7 * s + 0.8, cy: -8.6, r: 1.5, fill: '#111' }, g);
  }
  svgEl('path', { d: 'M-6 3 Q0 8 6 3', fill: 'none', stroke: '#1d2630', 'stroke-width': 1.4, 'stroke-linecap': 'round' }, g);
  return g;
}
function setFrog(G, f, x, y, lift = 0) { const [px, py] = G.toPx(x, y); f.setAttribute('transform', `translate(${px.toFixed(1)} ${(py - 10 - lift).toFixed(1)})`); }
/** a hop along an arc (graph coords), leaving a dashed trail */
async function frogHop(c, G, f, from, to, color, o = {}) {
  const [ax, ay] = G.toPx(from[0], from[1]), [bx, by] = G.toPx(to[0], to[1]), lift = o.lift ?? 46;
  const mx = (ax + bx) / 2, my = Math.min(ay, by) - lift * 1.6;
  const trail = svgEl('path', { d: `M${ax} ${ay - 4} Q${mx} ${my} ${bx} ${by - 4}`, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round', opacity: 0.85 }, o.trailLayer || G.layers.data);
  hide(trail);
  await tween(c, o.ms || 620, (t) => {
    const x = from[0] + (to[0] - from[0]) * t, y = from[1] + (to[1] - from[1]) * t;
    setFrog(G, f, x, y, lift * 4 * t * (1 - t));
  });
  trail.style.opacity = 0.85;
  return trail;
}
function mountPond() {
  const host = document.getElementById('u7l3-pond'); if (!host) return;
  const G = new Graph(host, { width: 600, height: 470, xmin: 0, xmax: 10.4, ymin: 0, ymax: 9.4, xlabels: 1, ylabels: 1, origin: true, fontSize: 16 });
  const [x0, y0] = G.toPx(0, 9.4), [x1, y1] = G.toPx(10.4, 0);
  svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: '#dbeefa', opacity: 0.75 }, G.layers.bg);
  const padL = svgEl('g', {}, G.layers.data), trailL = svgEl('g', {}, G.layers.data), rulerL = svgEl('g', {}, G.layers.data), frogL = svgEl('g', {}, G.layers.top);
  drawPad(G, 0, 1, padL); drawPad(G, 0, 8, padL);
  const padEl = {}, tags = {};
  for (const k in PADS) {
    padEl[k] = drawPad(G, PADS[k][0], PADS[k][1], padL);
    tags[k] = G.label(PADS[k][0], PADS[k][1], k, { pos: 'ne', cls: 'u7l3-padtag', gap: 6 });
  }
  G.label(0, 1, 'Green', { pos: 'e', cls: 'u7l3-frogname u7l3-fn-g', gap: 22 });
  G.label(0, 8, 'Blue', { pos: 'e', cls: 'u7l3-frogname u7l3-fn-b', gap: 22 });
  const fg = drawFrog(frogL, FROG_G), fb = drawFrog(frogL, FROG_B);
  const st = { g: [0, 1], b: [0, 8], busy: false, ruler: false };
  const note = h('div', 'u7l3-pondnote'); host.style.position = 'relative'; host.appendChild(note); hide(note);
  const say = (s) => { note.innerHTML = s; note.style.opacity = s ? 1 : 0; };
  const reset = () => {
    st.g = [0, 1]; st.b = [0, 8]; setFrog(G, fg, 0, 1); setFrog(G, fb, 0, 8);
    trailL.innerHTML = ''; rulerL.innerHTML = ''; st.ruler = false; say('');
    for (const k in PADS) { padEl[k].classList.remove('u7l3-pad-g', 'u7l3-pad-b'); tags[k].classList.remove('u7l3-tag-on'); }
    bG.disabled = bB.disabled = false;
  };
  const bG = document.getElementById('u7l3-hopG'), bB = document.getElementById('u7l3-hopB');
  const go = async (who) => {
    if (st.busy) return; st.busy = true;
    const c = liveCtx(), cur = st[who], [run, rise] = who === 'g' ? [3, 2] : [2, -1], to = [cur[0] + run, cur[1] + rise];
    const col = who === 'g' ? FROG_G : FROG_B, f = who === 'g' ? fg : fb;
    if (to[0] > 10.4 || to[1] > 9.4) { say(`${who === 'g' ? 'Green' : 'Blue'}’s next hop leaves the pond!`); (who === 'g' ? bG : bB).disabled = true; st.busy = false; return; }
    await frogHop(c, G, f, cur, to, col, { trailLayer: trailL });
    st[who] = to;
    const k = padAt(to[0], to[1]);
    if (k) { padEl[k].classList.add(who === 'g' ? 'u7l3-pad-g' : 'u7l3-pad-b'); tags[k].classList.add('u7l3-tag-on'); say(`${who === 'g' ? 'Green' : 'Blue'} lands on <b>pad ${k}</b> ${T(pairTex(to[0], to[1]))}`); }
    else say(`${T(pairTex(to[0], to[1]))}: no pad here. <b>Splash!</b>`);
    st.busy = false;
  };
  bG.addEventListener('click', () => go('g'));
  bB.addEventListener('click', () => go('b'));
  document.getElementById('u7l3-ruler').addEventListener('click', async () => {
    if (st.ruler || st.busy) return; st.ruler = true; st.busy = true;
    const c = liveCtx();
    const lg = G.line({ m: 2 / 3, b: 1 }, { color: FROG_G, width: 3.5, dash: true, layer: 'data' }), lb = G.line({ m: -0.5, b: 8 }, { color: FROG_B, width: 3.5, dash: true });
    rulerL.append(lg, lb);
    await G.drawIn(lg, 700, c); await G.drawIn(lb, 700, c);
    say(`Each frog’s landings lie on <b>one straight line</b>.`);
    st.busy = false;
  });
  document.getElementById('u7l3-wreset').addEventListener('click', () => { if (!st.busy) reset(); });
  reset();
}

/* ====================================================================================================
 * Static figures: example grids and answer graphs
 * ==================================================================================================== */
function mountFigures() {
  const mk = (id, big, o = {}) => {
    const el = document.getElementById(id); if (!el) return null;
    const L = big ? 8.5 : 6.5, W = o.w || (big ? 380 : 340);
    return new Graph(el, { width: W, height: W, xmin: -L, xmax: L, ymin: -L, ymax: L, xlabels: 2, ylabels: 2, fontSize: 14 });
  };
  mk('u7l3-ex1fig', false);
  const g2 = mk('u7l3-ex2fig', false); if (g2) g2.point(0, 1, { color: INK, r: 6, label: T('(0,1)'), pos: 'nw', labelCls: 'u7l3-plab' });
  mk('u7l3-ex3fig', true); mk('u7l3-ex4fig', true);
  mk('u7l3-ex5afig', true, { w: 400 }); mk('u7l3-ex5bfig', true, { w: 400 });
  // answers
  const a1 = mk('u7l3-ex1ans', false, { w: 300 }); if (a1) bPoint(a1, 5);
  const a2 = mk('u7l3-ex2ans', false, { w: 300 });
  if (a2) { a2.point(0, 1, { color: BC, r: 7, label: T('(0,1)'), pos: 'w', labelCls: 'u7l3-bint' }); new SlopeTri(a2, { x: 0, y: 1, run: 1, rise: 3 }, { w: 4 }); a2.point(1, 4, { color: INK, r: 6.5, label: T('(1,4)'), pos: 'e', labelCls: 'u7l3-plab' }); }
  const ans = (id, m, b, run, rise, pos) => {
    const g = mk(id, true, { w: 340 }); if (!g) return;
    g.line({ m: rise / run, b }, { color: LINE, width: 3.5 });
    new SlopeTri(g, { x: 0, y: b, run, rise }, { w: 4, labels: false });
    bPoint(g, b, { pos: pos[0] });
    g.point(run, b + rise, { color: INK, r: 6.5, label: T(pairTex(run, b + rise)), pos: pos[1], labelCls: 'u7l3-plab' });
  };
  ans('u7l3-ex3ans', 2, -4, 1, 2, ['w', 'e']);
  ans('u7l3-ex4ans', 4, -3, 1, 4, ['w', 'e']);
  ans('u7l3-ex5aans', -2, 4, 1, -2, ['w', 'e']);
  ans('u7l3-ex5bans', [2, 3], -3, 3, 2, ['w', 'se']);
}

/* ====================================================================================================
 * Make your own line: rise, run, start → graph it
 * ==================================================================================================== */
function mountBuilder() {
  const host = document.getElementById('u7l3-build'); if (!host) return;
  const st = { rise: 2, run: 3, b: -1, busy: false };
  const ctl = h('div', 'u7l3-bctl'), fig = h('div', 'u7l3-bfig');
  host.append(ctl, fig);
  const G = new Graph(fig, { width: 440, height: 440, xmin: -8.5, xmax: 8.5, ymin: -8.5, ymax: 8.5, xlabels: 2, ylabels: 2, fontSize: 15 });
  const row = (key, label, cls, lo, hi) => {
    const r = h('div', 'u7l3-brow ' + cls, `<div class="u7l3-blab">${label}</div>`);
    const minus = h('button', 'u7l3-bstep', '−'), val = h('div', 'u7l3-bval'), plus = h('button', 'u7l3-bstep', '+');
    minus.type = plus.type = 'button';
    const set = (v) => { if (v < lo || v > hi) return; st[key] = v; paint(); };
    minus.addEventListener('click', () => !st.busy && set(st[key] - 1));
    plus.addEventListener('click', () => !st.busy && set(st[key] + 1));
    r.append(minus, val, plus); ctl.appendChild(r); return val;
  };
  const vRise = row('rise', 'rise', 'u7l3-br-rise', -6, 6), vRun = row('run', 'run', 'u7l3-br-run', 1, 6), vB = row('b', 'start <i>b</i>', 'u7l3-br-b', -6, 6);
  const eq = h('div', 'u7l3-beq'), how = h('div', 'u7l3-bhow');
  const btns = h('div', 'u7l3-bbtns'), goB = h('button', 'pill', 'Graph it'), clr = h('button', 'pill', 'Clear');
  goB.type = clr.type = 'button'; btns.append(goB, clr);
  ctl.append(eq, how, btns);
  function paint() {
    vRise.innerHTML = T(cR(String(st.rise))); vRun.innerHTML = T(cU(String(st.run))); vB.innerHTML = T(cB(String(st.b)));
    const m = [st.rise, st.run], [a, b] = red(st.rise, st.run);
    eq.innerHTML = T(`m=${rrTex(st.rise, st.run)}${a !== st.rise || b !== st.run ? '=' + fr(st.rise, st.run, true) : ''}`) + '<br>' + T(eqTex(m, st.b, { big: true }));
    how.innerHTML = `Start at ${T(cB(pairTex(0, st.b)))}, then ${st.rise === 0 ? `right ${T(cU(String(st.run)))} (flat: rise 0)` : dirW(st.run, st.rise)}.`;
    G.clear();
  }
  goB.addEventListener('click', async () => {
    if (st.busy) return; st.busy = true; G.clear();
    const c = liveCtx(), { rise, run, b } = st;
    await G.reveal(bPoint(G, b), c);
    let p = [0, b], k = 0;
    const tris = [];
    while (k < 6 && Math.abs(p[0] + run) <= 8 && Math.abs(p[1] + rise) <= 8) {
      tris.forEach((t) => t.quiet());
      const r = await hop(c, G, p, run, rise); tris.push(r.tri); p = [p[0] + run, p[1] + rise]; k++;
    }
    p = [0, b]; k = 0;
    while (k < 6 && Math.abs(p[0] - run) <= 8 && Math.abs(p[1] - rise) <= 8) {
      tris.forEach((t) => t.quiet());
      const r = await hop(c, G, p, -run, -rise); tris.push(r.tri); p = [p[0] - run, p[1] - rise]; k++;
    }
    tris.forEach((t) => t.quiet());
    await G.drawIn(G.line({ m: rise / run, b }, { color: LINE, width: 4 }), 700, c);
    st.busy = false;
  });
  clr.addEventListener('click', () => { if (!st.busy) G.clear(); });
  paint();
}

/* =============================== explainer: the frogs are lines =============================== */
const FL = {
  green: { label: 'Green frog', color: FROG_G, b: 1, run: 3, rise: 2, hops: 3 },
  blue: { label: 'Blue frog', color: FROG_B, b: 8, run: 2, rise: -1, hops: 4 }
};
const frogLine = {
  title: 'The frogs are lines',
  height: 470,
  minW: 860,
  choices: Object.keys(FL).map((k) => ({ v: k, label: FL[k].label })),
  intro: 'Where a frog <b>starts</b> and how it <b>hops</b>: two numbers that draw a whole line. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FL[k], name = k === 'green' ? 'Green' : 'Blue';
    const G = new Graph(stage, { x: 14, y: 10, width: 500, height: 450, xmin: 0, xmax: 10.4, ymin: 0, ymax: 9.4, xlabels: 1, ylabels: 1, origin: true, fontSize: 15 });
    const [x0, y0] = G.toPx(0, 9.4), [x1, y1] = G.toPx(10.4, 0);
    svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: '#dbeefa', opacity: 0.6 }, G.layers.bg);
    const frogL = svgEl('g', {}, G.layers.top), f = drawFrog(frogL, d.color);
    setFrog(G, f, 0, d.b);
    const PX = 530, P = panel(stage, PX, 10, ex.W - PX - 14, 450, `${name} frog`);
    const rows = h('div', 'u7l3-ro'); P.appendChild(rows);
    rows.innerHTML = `<div class="u7l3-ro-r u7l3-ro-b"><span class="u7l3-ro-k">start</span><b>?</b></div><div class="u7l3-ro-r u7l3-ro-m"><span class="u7l3-ro-k">hop</span><b>?</b></div>`;
    const [vB, vM] = rows.querySelectorAll('b');
    const eqb = h('div', 'u7l3-eqbox'); P.appendChild(eqb); hide(eqb);
    const rule = h('div', 'u7l3-rulebox', `<b>start</b> → ${T(cB('b'))}, the ${T('y')}-intercept<br><b>hop</b> → ${T(cM('m'))}, the slope`); P.appendChild(rule); hide(rule);
    const m = [d.rise, d.run], [mn, md] = red(d.rise, d.run), pts = [];
    for (let i = 1; i <= d.hops; i++) pts.push([d.run * i, d.b + d.rise * i]);
    const mT = `\\dfrac{${cR(String(d.rise))}}{${cU(String(d.run))}}${mn !== d.rise ? '' : ''}`;
    return [
      { cap: `${name} starts at height ${T(cB(String(d.b)))} on the ${T('y')}-axis: the point ${T(cB(pairTex(0, d.b)))}. That start is ${T(cB('b=' + d.b))}.`,
        run: async (c) => { await G.reveal(G.point(0, d.b, { color: BC, r: 8.5 }), c); vB.innerHTML = T(cB(`b=${d.b}`)); await pulse(c, vB.parentNode, 1.05); } },
      { cap: `Each hop: ${dirW(d.run, d.rise)}. As a fraction, ${T(`\\dfrac{\\text{rise}}{\\text{run}}=${mT}`)}${d.rise < 0 ? ' (down is negative)' : ''}. That hop is the slope ${T(cM('m=' + fr(d.rise, d.run)))}.`,
        run: async (c) => {
          const t = new SlopeTri(G, { x: 0, y: d.b, run: d.run, rise: d.rise }, { fillOp: 0.06 }); await t.drawIn(c, 380);
          await frogHop(c, G, f, [0, d.b], pts[0], d.color, { ms: 520 }); await G.reveal(G.point(pts[0][0], pts[0][1], { color: INK, r: 6 }), c);
          vM.innerHTML = T(cM(`m=${mT}`)); await pulse(c, vM.parentNode, 1.05);
        } },
      { cap: `Same hop, again and again: ${pts.slice(1).map((p) => T(pairTex(p[0], p[1]))).join(', ')}.`,
        run: async (c) => {
          for (let i = 1; i < pts.length; i++) { await frogHop(c, G, f, pts[i - 1], pts[i], d.color, { ms: 480 }); await G.reveal(G.point(pts[i][0], pts[i][1], { color: INK, r: 6 }), c); }
        } },
      { cap: `Lay a ruler through the landings: they make <b>one straight line</b>, ${T(eqTex(m, d.b))}.`,
        run: async (c) => { await G.drawIn(G.line({ m: mn / md, b: d.b }, { color: LINE, width: 4 }), 800, c); eqb.innerHTML = T(eqTex(m, d.b, { big: true })); await show(c, eqb); } },
      { cap: `The start is ${T(cB('b'))} and the hop is ${T(cM('m'))}. That is <b>slope–intercept form</b>: ${T(`y=${cM('m')}x+${cB('b')}`)}.`,
        run: (c) => show(c, rule) }
    ];
  }
};

/* =============================== explainer: spot m and b =============================== */
/* each entry: eq (plain), mBrace / bBrace (the equation with the part braced), m, b, and caption notes */
const ub = (s, lab, col) => `\\textcolor{${col}}{\\underbrace{${s}}_{${lab}}}`;
const RM = {
  whole: { label: 'Whole numbers', rows: [
    { eq: 'y=4x+7', mB: `y=${ub('4', 'm', LINE)}x+7`, bB: `y=${ub('4', 'm', LINE)}x+${ub('7', 'b', BC)}`, m: '4', b: 7 },
    { eq: 'y=2x+5', mB: `y=${ub('2', 'm', LINE)}x+5`, bB: `y=${ub('2', 'm', LINE)}x+${ub('5', 'b', BC)}`, m: '2', b: 5, ex: 'Example 1(a)' },
    { eq: 'y=3x-2', mB: `y=${ub('3', 'm', LINE)}x-2`, bB: `y=${ub('3', 'm', LINE)}x${ub('-2', 'b', BC)}`, m: '3', b: -2, bNote: 'The minus sign comes with it' }] },
  signs: { label: 'Signs and hidden 1s', rows: [
    { eq: 'y=-3x+2', mB: `y=${ub('-3', 'm', LINE)}x+2`, bB: `y=${ub('-3', 'm', LINE)}x+${ub('2', 'b', BC)}`, m: '-3', b: 2, mNote: 'the minus sign in front of 3 comes with it' },
    { eq: 'y=x-6', mB: `y=${ub('\\textcolor{#9aa0ab}{1}', 'm', LINE)}x-6`, bB: `y=${ub('\\textcolor{#9aa0ab}{1}', 'm', LINE)}x${ub('-6', 'b', BC)}`, m: '1', b: -6, mNote: 'no number in front of ' + T('x') + ' means a hidden 1' },
    { eq: 'y=-x+5', mB: `y=${ub('-\\textcolor{#9aa0ab}{1}', 'm', LINE)}x+5`, bB: `y=${ub('-\\textcolor{#9aa0ab}{1}', 'm', LINE)}x+${ub('5', 'b', BC)}`, m: '-1', b: 5, mNote: T('-x') + ' means ' + T('-1x') }] },
  frac: { label: 'Fractions', rows: [
    { eq: 'y=\\tfrac{2}{3}x-3', mB: `y=${ub('\\dfrac{2}{3}', 'm', LINE)}x-3`, bB: `y=${ub('\\dfrac{2}{3}', 'm', LINE)}x${ub('-3', 'b', BC)}`, m: '\\dfrac{2}{3}', b: -3, mNote: 'a fraction in front of ' + T('x') + ' is fine', ex: 'Example 5(b)' },
    { eq: 'y=-\\tfrac{3}{4}x+2', mB: `y=${ub('-\\dfrac{3}{4}', 'm', LINE)}x+2`, bB: `y=${ub('-\\dfrac{3}{4}', 'm', LINE)}x+${ub('2', 'b', BC)}`, m: '-\\dfrac{3}{4}', b: 2 },
    { eq: 'y=\\tfrac{1}{4}x+5', mB: `y=${ub('\\dfrac{1}{4}', 'm', LINE)}x+5`, bB: `y=${ub('\\dfrac{1}{4}', 'm', LINE)}x+${ub('5', 'b', BC)}`, m: '\\dfrac{1}{4}', b: 5 }] }
};
const readMB = {
  title: 'Spot m and b',
  height: 430,
  choices: Object.keys(RM).map((k) => ({ v: k, label: RM[k].label })),
  intro: '<b>m</b> is the number in front of <b>x</b>; <b>b</b> is the number on its own. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RM[k];
    const eqb = add(stage, box(h('div', 'u7l3-eqbox u7l3-mbeq'), ex.W - 28, 128), 14, 10);
    const tbl = add(stage, box(h('div', 'u7l3-mbtab'), ex.W - 28, null), 14, 152);
    tbl.innerHTML = `<div class="u7l3-mbr u7l3-mbh"><div>equation</div><div class="u7l3-cm">slope <i>m</i></div><div class="u7l3-cb"><i>y</i>-intercept <i>b</i></div><div>start point</div></div>`;
    const cells = d.rows.map((r) => {
      const row = h('div', 'u7l3-mbr', `<div>${T(r.eq)}</div><div class="u7l3-mbm"></div><div class="u7l3-mbb"></div><div class="u7l3-mbp"></div>`);
      tbl.appendChild(row); hide(row);
      return { row, m: row.querySelector('.u7l3-mbm'), b: row.querySelector('.u7l3-mbb'), p: row.querySelector('.u7l3-mbp') };
    });
    const steps = [];
    d.rows.forEach((r, i) => {
      const pre = r.ex ? `<b>${r.ex} check.</b> ` : '';
      steps.push({ cap: `${pre}${T(r.eq)}: ${r.mNote ? r.mNote + ', so the slope is' : 'the number in front of ' + T('x') + ' is the slope:'} ${T(cM('m=' + r.m))}.`,
        run: async (c) => { eqb.innerHTML = T(r.mB); await show(c, eqb); cells[i].row.style.opacity = 1; cells[i].m.innerHTML = T(cM(r.m)); await pop(c, cells[i].m); } });
      steps.push({ cap: `${r.bNote ? r.bNote + ': ' : 'The number on its own is the y-intercept: '}${T(cB('b=' + r.b))}. The line starts at ${T(cB(pairTex(0, r.b)))}.`,
        run: async (c) => { eqb.innerHTML = T(r.bB); cells[i].b.innerHTML = T(cB(String(r.b))); await pop(c, cells[i].b); cells[i].p.innerHTML = T(cB(pairTex(0, r.b))); await pop(c, cells[i].p); } });
    });
    steps.push({ cap: `Read ${T(cM('m'))} and ${T(cB('b'))} <b>with their signs</b>, and you know the hop and the start.`, run: (c) => pulse(c, tbl, 1.02) });
    return steps;
  }
};

/* =============================== explainer: Step 1, start at (0, b) =============================== */
const ST = {
  ex1: { label: 'Example 1 check', m: 2, b: 5, other: -1 },
  neg: { label: T('y=3x-4'), m: 3, b: -4, other: 1 }
};
const start = {
  title: 'Step 1: why start at (0, b)?',
  height: 470,
  minW: 820,
  choices: Object.keys(ST).map((k) => ({ v: k, label: ST[k].label })),
  intro: 'Every point on the <b>y-axis</b> has <b>x = 0</b>. Watch what that does to the equation. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ST[k], m = [d.m, 1], b = d.b, ox = d.other, oy = d.m * ox + b;
    const G = grid(stage, { width: 450, height: 450, xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, y: 10 });
    const PX = 486, P = panel(stage, PX, 10, ex.W - PX - 14, 450, k === 'ex1' ? 'Example 1' : 'Step 1');
    const eqb = h('div', 'u7l3-eqbox', T(eqTex(m, b, { big: true }))); P.appendChild(eqb);
    const alg = h('div', 'u7l3-alg'); P.appendChild(alg);
    const sgn = b < 0 ? '-' : '+';
    const band = () => { const g = svgEl('g', {}, G.layers.bg), [ax] = G.toPx(0, 0), [, ya] = G.toPx(0, G.win.ymax), [, yb] = G.toPx(0, G.win.ymin); svgEl('rect', { x: ax - 10, y: ya, width: 20, height: yb - ya, fill: BC, 'fill-opacity': 0.2 }, g); return g; };
    let bandEl = null;
    return [
      { cap: `${T(eqTex(m, b))}. Where does this line cross the ${T('y')}-axis?`, run: (c) => pulse(c, eqb, 1.05) },
      { cap: `Every point on the ${T('y')}-axis has ${T('x=0')}.`,
        run: async (c) => { bandEl = band(); await appear(c, bandEl, 350); for (const y of [-4, 2, 5].filter((v) => v !== b)) { const l = G.label(0, y, T(pairTex(0, y)), { pos: 'e', cls: 'u7l3-ghost', gap: 12 }); await pop(c, l, 220); } } },
      { cap: `Put ${T('x=0')} into the equation: ${T(`y=${d.m}(${cB('0')})${sgn}${Math.abs(b)}=${cB(String(b))}`)}. You get <b>${T('b')} itself</b>!`,
        run: async (c) => { await show(c, line(alg, T(`y=${d.m}(\\textcolor{${BC}}{0})${sgn}${Math.abs(b)}`))); await show(c, line(alg, T(`y=0${sgn}${Math.abs(b)}=${cB(String(b))}`))); } },
      { cap: `Plot ${T(cB(pairTex(0, b)))}: ${b > 0 ? 'up' : 'down'} ${Math.abs(b)} on the ${T('y')}-axis. Step 1 done, <b>no calculation</b> needed.`,
        run: async (c) => { G.html.querySelectorAll('.u7l3-ghost').forEach((e) => e.remove()); await G.reveal(bPoint(G, b, { pos: b > 0 ? 'e' : 'e' }), c); await show(c, line(alg, `Step 1: plot ${T(cB(pairTex(0, b)))}`, 'u7l3-done')); } },
      { cap: `Any other point takes work: ${T(`x=${ox}`)} gives ${T(`y=${d.m}(${ox})${sgn}${Math.abs(b)}=${oy}`)}. The ${T('y')}-intercept is free, so start there.`,
        run: async (c) => { await show(c, line(alg, `${T(`x=${ox}`)}: ${T(`y=${d.m}(${ox})${sgn}${Math.abs(b)}=${oy}`)}`, 'u7l3-soft')); await G.reveal(G.point(ox, oy, { color: GRAY, r: 6, label: T(pairTex(ox, oy)), pos: ox < 0 ? 'w' : 'e', labelCls: 'u7l3-plab u7l3-grayl' }), c); } }
    ];
  }
};

/* =============================== explainer: whole-number slope over 1 =============================== */
const OO = {
  ex2: { label: 'Example 2 check', m: 3, b: 1 },
  two: { label: T('y=2x-3'), m: 2, b: -3 },
  five: { label: T('y=5x-4'), m: 5, b: -4 }
};
const overOne = {
  title: 'Step 2: put the whole number over 1',
  height: 470,
  minW: 820,
  choices: Object.keys(OO).map((k) => ({ v: k, label: OO[k].label })),
  intro: 'A slope like 3 has no fraction bar yet. Give it one. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = OO[k], b = d.b, M = d.m, to = [1, b + M];
    const G = grid(stage, { width: 450, height: 450, xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, y: 10 });
    const PX = 486, P = panel(stage, PX, 10, ex.W - PX - 14, 450, k === 'ex2' ? 'Example 2' : 'Step 2');
    const eqb = h('div', 'u7l3-eqbox', T(eqTex([M, 1], b, { big: true }))); P.appendChild(eqb);
    const alg = h('div', 'u7l3-alg u7l3-alg-big'); P.appendChild(alg);
    const L1 = line(alg, T(`m=${cM(String(M))}`)), L2 = line(alg, T(`${M}=\\dfrac{${M}}{1}`)), L3 = line(alg, T(`\\dfrac{\\text{rise}}{\\text{run}}=${rrTex(M, 1)}`)), L4 = line(alg, `right ${T(cU('1'))}, up ${T(cR(String(M)))}`, 'u7l3-words');
    [L1, L2, L3, L4].forEach(hide);
    const L5 = line(alg, '', 'u7l3-soft'); hide(L5);
    let tri = null;
    return [
      { cap: `${T(eqTex([M, 1], b))}: Step 1 first. Plot ${T(cB(pairTex(0, b)))}.`,
        run: async (c) => { await G.reveal(bPoint(G, b), c); await show(c, L1); } },
      { cap: `The slope is ${T(cM('m=' + M))}. Any whole number is itself <b>over 1</b>: ${T(`${M}=\\dfrac{${M}}{1}`)}.`, run: (c) => show(c, L2) },
      { cap: `The top is the <b class="u7l3-c-rise">rise</b> and the bottom is the <b class="u7l3-c-run">run</b>: rise ${T(cR(String(M)))}, run ${T(cU('1'))}.`, run: (c) => show(c, L3) },
      { cap: `From ${T(cB(pairTex(0, b)))}, go <b>right</b> ${T(cU('1'))} (the run)…`,
        run: async (c) => { await show(c, L4); const t = new SlopeTri(G, { x: 0, y: b, run: 1, rise: M }, { fillOp: 0.06 }); t.riseP.style.opacity = 0; await t.drawIn(c, 420); t.lRise.style.opacity = 0; tri = t; } },
      { cap: `…then <b>up</b> ${T(cR(String(M)))} (the rise). You land on ${T(pairTex(to[0], to[1]))}: the second point.`,
        run: async (c) => {
          const t = tri; if (t) { t.riseP.style.opacity = 1; await drawIn(t.riseP, 420, c); t.lRise.style.opacity = 1; await pop(c, t.lRise, 200); }
          await G.reveal(G.point(to[0], to[1], { color: INK, r: 7, label: T(pairTex(to[0], to[1])), pos: 'e', labelCls: 'u7l3-plab' }), c);
        } },
      { cap: `Check with the equation: ${T(`y=${M}(1)${b < 0 ? '-' : '+'}${Math.abs(b)}=${to[1]}`)} ✓. Two points: enough for a line.`,
        run: async (c) => { L5.innerHTML = `Check: ${T(`${M}(1)${b < 0 ? '-' : '+'}${Math.abs(b)}=${to[1]}`)} ✓`; await show(c, L5); await G.drawIn(G.line({ m: M, b }, { color: LINE, width: 3, dash: true }), 700, c); } }
    ];
  }
};

/* =============================== explainer: all three steps (star) =============================== */
const SG = {
  ex3: { label: 'Example 3 check', m: [2, 1], b: -4, check: 3 },
  ex4: { label: 'Example 4 check', m: [4, 1], b: -3, compare: { m: 2, b: -4, name: 'Example 3' } },
  one: { label: T('y=x+3'), m: [1, 1], b: 3, hidden: true }
};
/** forward hops (up to two, staying in a ±8 window) and one backward hop */
function hopsFor(rise, run, b, L = 8) {
  const out = []; let p = [0, b];
  for (let i = 0; i < 2; i++) { const q = [p[0] + run, p[1] + rise]; if (Math.abs(q[0]) > L || Math.abs(q[1]) > L) break; out.push({ from: p, run, rise }); p = q; }
  const q = [-run, b - rise]; if (Math.abs(q[0]) <= L && Math.abs(q[1]) <= L) out.push({ from: [0, b], run: -run, rise: -rise, back: true });
  return out;
}
/** the shared "three steps" walk on a ±8 grid, with a panel: read, Step 1, hops, Step 3, then extra steps */
function threeSteps(stage, ex, d, o = {}) {
  const [rise, run] = d.m, b = d.b, mv = rise / run;
  const G = grid(stage, { y: 10, width: 460, height: 460 });
  const PX = 494, P = panel(stage, PX, 10, ex.W - PX - 14, 460, o.title || 'Graph it');
  const eqb = h('div', 'u7l3-eqbox', T(eqTex(d.m, b, { big: true }))); P.appendChild(eqb);
  const ro = h('div', 'u7l3-ro'); P.appendChild(ro);
  ro.innerHTML = `<div class="u7l3-ro-r u7l3-ro-b"><span class="u7l3-ro-k">start</span><b>?</b></div><div class="u7l3-ro-r u7l3-ro-m"><span class="u7l3-ro-k">step</span><b>?</b></div>`;
  const [vB, vM] = ro.querySelectorAll('b');
  const lst = h('div', 'u7l3-plist'); P.appendChild(lst);
  const addPt = (p) => { const s = h('span', 'u7l3-xchip', T(pairTex(p[0], p[1]))); lst.appendChild(s); return s; };
  const tris = [], hops = hopsFor(rise, run, b);
  const mWord = run === 1 ? (d.hidden ? T(cM(`m=1=\\tfrac{1}{1}`)) : T(cM(`m=${rise}=\\tfrac{${rise}}{1}`))) : T(cM('m=' + fr(rise, run)));
  const steps = [
    { cap: `${T(eqTex(d.m, b))}: ${d.hidden ? 'no number in front of ' + T('x') + ' means 1, so ' : ''}${mWord} and ${T(cB('b=' + b))}.`,
      run: async (c) => { vB.innerHTML = T(cB(pairTex(0, b))); vM.innerHTML = T(rrTex(rise, run)); await pulse(c, ro, 1.04); } },
    { cap: `<b>Step 1:</b> plot the ${T('y')}-intercept ${T(cB(pairTex(0, b)))}.`,
      run: async (c) => { await G.reveal(bPoint(G, b), c); await pop(c, addPt([0, b])); } }
  ];
  hops.forEach((hp, i) => {
    const to = [hp.from[0] + hp.run, hp.from[1] + hp.rise];
    const cap = hp.back ? `The same step <b>backwards</b> also works: ${dirW(hp.run, hp.rise)} from ${T(pairTex(0, b))}, to ${T(pairTex(to[0], to[1]))}.`
      : i === 0 ? `<b>Step 2:</b> ${dirW(hp.run, hp.rise)}, to ${T(pairTex(to[0], to[1]))}.`
        : `Again from there: ${dirW(hp.run, hp.rise)}, to ${T(pairTex(to[0], to[1]))}. More points make the ruler line more accurate.`;
    steps.push({ cap, run: async (c) => {
      tris.forEach((q) => q.quiet());
      const r = await hop(c, G, hp.from, hp.run, hp.rise); tris.push(r.tri); await pop(c, addPt(to));
    } });
  });
  steps.push({ cap: `<b>Step 3:</b> rule a straight line through the points and extend it across the grid <b>both ways</b>: the graph of ${T(eqTex(d.m, b))}.`,
    run: async (c) => { tris.forEach((q) => q.quiet()); await G.drawIn(G.line({ m: mv, b }, { color: LINE, width: 4.5 }), 800, c); } });
  return { G, P, steps, mv };
}
const stepGraph = {
  title: 'All three steps: start, step, join',
  height: 480,
  minW: 860,
  choices: Object.keys(SG).map((k) => ({ v: k, label: SG[k].label })),
  intro: '<b>b</b> says where to start; <b>m</b> says how to step. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SG[k], { G, P, steps } = threeSteps(stage, ex, d, { title: k === 'one' ? 'Graph it' : SG[k].label.replace(' check', '') });
    const [rise, run] = d.m, b = d.b;
    if (d.check != null) {
      const x = d.check, y = (rise / run) * x + b;
      steps.push({ cap: `Check a third point: at ${T('x=' + x)}, ${T(`y=${rise}(${x})${b < 0 ? '-' : '+'}${Math.abs(b)}=${y}`)}. Does the line pass through ${T(pairTex(x, y))}? Yes ✓`,
        run: async (c) => { await G.reveal(G.point(x, y, { color: BC, r: 7.5, label: T(pairTex(x, y)) + ' ✓', pos: 'e', labelCls: 'u7l3-plab u7l3-okl' }), c); } });
    } else if (d.compare) {
      steps.push({ cap: `Compare with ${d.compare.name}, ${T(eqTex([d.compare.m, 1], d.compare.b, { color: false }))} (gray): this line is <b>steeper</b>, because ${T(`${rise}>${d.compare.m}`)}.`,
        run: async (c) => { await G.drawIn(G.line({ m: d.compare.m, b: d.compare.b }, { color: GRAY, width: 3.5, dash: true }), 700, c); G.label(5.6, 7, d.compare.name, { pos: 'e', cls: 'u7l3-plab u7l3-grayl', gap: 10 }); } });
    }
    steps.push({ cap: 'Three steps every time: <b>start</b> at the y-intercept, <b>step</b> the slope, <b>join</b> with a ruler.',
      run: async (c) => { const r = h('div', 'u7l3-rulebox', `<b>1.</b> Plot ${T(cB('(0,\\,b)'))}<br><b>2.</b> Step ${T(`\\tfrac{${cR('\\text{rise}')}}{${cU('\\text{run}')}}`)}<br><b>3.</b> Join and extend`); P.appendChild(r); await pop(c, r); } });
    return steps;
  }
};

/* =============================== explainer: three ways it goes wrong =============================== */
const TR = {
  swap: { label: 'Rise and run swapped', start: [0, -4], run: 2, rise: 1, wrongM: 0.5, wrongB: -4, chk: [2, -3],
    why: `they went right ${T(cU('2'))}, up ${T(cR('1'))}. But ${T('\\tfrac{2}{1}')} means rise ${T(cR('2'))}: <b>up 2, right 1</b>` },
  xaxis: { label: 'b plotted on the x-axis', start: [-4, 0], run: 1, rise: 2, wrongM: 2, wrongB: 8, chk: [-4, 0],
    why: `they plotted ${T('(-4,0)')} on the ${T('x')}-axis. The ${T('y')}-intercept is on the ${T('y')}-axis, where ${T('x=0')}: ${T(cB('(0,-4)'))}` },
  sign: { label: 'The minus sign on b dropped', start: [0, 4], run: 1, rise: 2, wrongM: 2, wrongB: 4, chk: [0, 4],
    why: `they started at ${T('(0,4)')}. But ${T('b=-4')}: the minus sign comes with it, so start <b>down</b> at ${T(cB('(0,-4)'))}` }
};
const traps = {
  title: 'Catch the mistake with a check point',
  height: 480,
  minW: 860,
  choices: Object.keys(TR).map((k) => ({ v: k, label: TR[k].label })),
  intro: 'A student graphed <b>y = 2x − 4</b> (Example 3). Something slipped. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TR[k], m = [2, 1], b = -4;
    const G = grid(stage, { y: 10, width: 460, height: 460 });
    const PX = 494, P = panel(stage, PX, 10, ex.W - PX - 14, 460, 'Graph ' + T('y=2x-4'));
    const eqb = h('div', 'u7l3-eqbox', T(eqTex(m, b, { big: true }))); P.appendChild(eqb);
    const alg = h('div', 'u7l3-alg'); P.appendChild(alg);
    const [cx, cy] = d.chk, cyEq = 2 * cx - 4;
    let wrong = [], ring = null;
    const sx = ex.W - 90;
    return [
      { cap: `Here is the student’s graph of ${T(eqTex(m, b))}, in red. It looks like a fine straight line…`,
        run: async (c) => {
          const p = G.point(d.start[0], d.start[1], { color: RED, r: 7.5 }); await G.reveal(p, c);
          const t = new SlopeTri(G, { x: d.start[0], y: d.start[1], run: d.run, rise: d.rise }, { fill: RED, fillOp: 0.05, wrong: true }); await t.drawIn(c, 360);
          const q = G.point(d.start[0] + d.run, d.start[1] + d.rise, { color: RED, r: 6.5 }); await G.reveal(q, c);
          const L = G.line({ m: d.wrongM, b: d.wrongB }, { color: RED, width: 4 }); await G.drawIn(L, 700, c);
          wrong = [p, t, q, L];
        } },
      { cap: `<b>Check a point</b> from the drawing: ${T(pairTex(cx, cy))}. Put ${T('x=' + cx)} into the equation: ${T(`y=2(${cx})-4=${cyEq}`)}, not ${T(String(cy))} ✗.`,
        run: async (c) => {
          ring = G.point(cx, cy, { color: RED, r: 11, open: true }); await G.reveal(ring, c);
          await show(c, line(alg, `Check ${T(pairTex(cx, cy))}: ${T(`2(${cx})-4=${cyEq}\\ne ${cy}`)}`, 'u7l3-bad'));
          const s = stamp(stage, '✗', { ok: false, x: sx, y: 300, size: 'lg' }); await stampIn(c, s);
        } },
      { cap: `What slipped: ${d.why}.`, run: (c) => show(c, line(alg, `<b>Fix:</b> start ${T(cB('(0,-4)'))}, then right ${T(cU('1'))}, up ${T(cR('2'))}`)) },
      { cap: `Fixed (blue): ${T(cB('(0,-4)'))} → ${T('(1,-2)')}. Check ${T('(1,-2)')}: ${T('2(1)-4=-2')} ✓.`,
        run: async (c) => {
          wrong.forEach((e) => { if (e.quiet) { e.quiet(); e.g.style.opacity = 0.22; } else e.style.opacity = 0.25; }); if (ring) ring.style.opacity = 0;
          stage.querySelectorAll('.bk-stamp').forEach((s) => s.remove());
          await G.reveal(bPoint(G, b), c); await hop(c, G, [0, -4], 1, 2, { label: true, pos: 'e' });
          await G.drawIn(G.line({ m: 2, b: -4 }, { color: LINE, width: 4.5 }), 700, c);
          await show(c, line(alg, `Check ${T('(1,-2)')}: ${T('2(1)-4=-2')} ✓`, 'u7l3-good'));
          const s = stamp(stage, '✓', { ok: true, x: sx, y: 360, size: 'lg' }); await stampIn(c, s);
        } }
    ];
  }
};

/* =============================== explainer: negative slopes =============================== */
const NG = {
  ex5a: { label: 'Example 5(a) check', m: [-2, 1], b: 4, mirror: true },
  c2: { label: T('y=-3x+5'), m: [-3, 1], b: 5 }
};
const negStep = {
  title: 'A negative slope steps down',
  height: 480,
  minW: 860,
  choices: Object.keys(NG).map((k) => ({ v: k, label: NG[k].label })),
  intro: 'Same three steps. The minus sign rides on the <b>rise</b>, so the step goes <b>down</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = NG[k], { G, P, steps } = threeSteps(stage, ex, d, { title: k === 'ex5a' ? 'Example 5(a)' : 'Graph it' });
    const [rise] = d.m, b = d.b;
    steps[0].cap = `${T(eqTex(d.m, b))}: ${T(cM(`m=${rise}=\\tfrac{${rise}}{1}`))}, a <b>negative</b> rise, and ${T(cB('b=' + b))}.`;
    if (d.mirror) {
      steps.push({ cap: `Compare ${T(eqTex([-rise, 1], b, { color: false }))} (gray): same start, but up ${-rise} instead of down. A positive slope <b>rises</b>; a negative slope <b>falls</b> from left to right.`,
        run: async (c) => { await G.drawIn(G.line({ m: -rise, b }, { color: GRAY, width: 3.5, dash: true }), 700, c); G.label(2, -rise * 2 + b, T(eqTex([-rise, 1], b, { color: false })), { pos: 'e', cls: 'u7l3-plab u7l3-grayl', gap: 12 }); } });
    } else {
      steps.push({ cap: `Read it left to right: the line goes <b>downhill</b>. That is what a negative slope looks like.`,
        run: async (c) => { const a = G.label(3.2, -1, 'downhill ↘', { pos: 'e', cls: 'u7l3-plab u7l3-redl', gap: 6 }); await pop(c, a); } });
    }
    return steps;
  }
};

/* =============================== explainer: fractional slopes =============================== */
const FS = {
  ex5b: { label: 'Example 5(b) check', m: [2, 3], b: -3 },
  c2: { label: T('y=-\\tfrac{3}{4}x+2'), m: [-3, 4], b: 2 }
};
const fracStep = {
  title: 'Step right by the bottom number',
  height: 480,
  minW: 860,
  choices: Object.keys(FS).map((k) => ({ v: k, label: FS[k].label })),
  intro: 'A fraction slope is already rise over run. No converting. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FS[k], [rise, run] = d.m, b = d.b, mv = rise / run;
    const { G, P, steps } = threeSteps(stage, ex, d, { title: k === 'ex5b' ? 'Example 5(b)' : 'Graph it' });
    const ana = h('div', 'u7l3-fana', `<div class="u7l3-fana-f">${T(`\\dfrac{${cR(String(rise))}}{${cU(String(run))}}`)}</div><div class="u7l3-fana-t"><div class="u7l3-c-rise"><b>top</b> = rise: ${rise > 0 ? 'up' : 'down'} ${Math.abs(rise)}</div><div class="u7l3-c-run"><b>bottom</b> = run: right ${run}</div></div>`);
    P.appendChild(ana); hide(ana);
    const ins = [1, 2].map((x) => [x, b + mv * x]);
    const mixed = (v) => { const s = v < 0 ? '-' : '', a = Math.abs(v), w = Math.floor(a + 1e-9), f = Math.round((a - w) * run); const [fn, fd] = red(f, run); return s + (w ? w : '') + (f ? `\\tfrac{${fn}}{${fd}}` : ''); };
    const r0 = steps[0].run; steps[0].run = async (c) => { await r0(c); await show(c, ana); };
    steps[0].cap = `${T(eqTex(d.m, b))}: ${T(cM(`m=${rrTex(rise, run)}`))}. Top = <b class="u7l3-c-rise">rise</b> ${T(cR(String(rise)))}, bottom = <b class="u7l3-c-run">run</b> ${T(cU(String(run)))}. And ${T(cB('b=' + b))}.`;
    // insert "why not 1 square at a time?" after Step 1
    const ghosts = [];
    steps.splice(2, 0, { cap: `Why not step right just 1? Then you go ${rise > 0 ? 'up' : 'down'} only ${T(`\\tfrac{${Math.abs(rise)}}{${run}}`)} of a square: ${ins.map((p) => T(pairTex(p[0], mixed(p[1])))).join(' and ')} land <b>between</b> grid lines. Hard to plot!`,
      run: async (c) => { for (const p of ins) { const g = G.point(p[0], p[1], { color: RED, r: 7, open: true, label: '?', pos: rise > 0 ? 'nw' : 'sw', labelCls: 'u7l3-plab u7l3-redl' }); ghosts.push(g); await G.reveal(g, c); } } });
    steps[3].cap = `So step the whole fraction: ${dirW(run, rise)} lands on ${T(pairTex(run, b + rise))}, right on a grid corner.`;
    const oldRun = steps[3].run;
    steps[3].run = async (c) => { ghosts.forEach((g) => { g.style.opacity = 0.35; if (g.label) g.label.style.opacity = 0; }); await oldRun(c); };
    steps.push({ cap: `The line passes through the in-between spots too. But grid corners are what you can plot <b>exactly</b>: step right by the <b>denominator</b> ${T(cU(String(run)))}.`,
      run: async (c) => { ghosts.forEach((g) => { g.style.opacity = 1; }); await pulse(c, P, 1.02); } });
    return steps;
  }
};

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * Graph a line from y = mx + b with a positive whole-number slope (Section 4 is where this sits).
 * BEG: state m and b and the first two points; PRG: graph it (b any sign, hidden 1, written y = b + mx);
 * MAS: graph it and check a third point with the equation. Answers carry a small graph. */
const suTerm = (c, v, first) => (c === 0 ? '' : (c < 0 ? '-' : first ? '' : '+') + (Math.abs(c) === 1 && v ? '' : Math.abs(c)) + v);
const suSI = (m, b) => 'y=' + (suTerm(m, 'x', true) + suTerm(b, '', false) || '0');
const suMinus = (s) => String(s).replace(/-/g, '−');
function suGraph(m, b, pts, w = 290) {
  const x0 = -6, x1 = 6, y0 = -8, y1 = 8, u = 22, P = 14, fs = 15, INKC = '#1c2230';
  const W = (x1 - x0) * u + 2 * P, H = (y1 - y0) * u + 2 * P, X = (x) => P + (x - x0) * u, Y = (y) => P + (y1 - y) * u;
  const L = (a, b2, c, d, st) => `<line x1="${X(a)}" y1="${Y(b2)}" x2="${X(c)}" y2="${Y(d)}" ${st}/>`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${w}" height="${Math.round(w * H / W)}" style="max-width:100%;height:auto;display:block;margin:8px auto 2px" font-family="system-ui,-apple-system,sans-serif" role="img" aria-label="answer graph"><rect width="${W}" height="${H}" rx="8" fill="#fff"/>`;
  for (let i = x0; i <= x1; i++) s += L(i, y0, i, y1, `stroke="${i % 2 ? '#e6e9ef' : '#d2d7e0'}" stroke-width="1"`);
  for (let j = y0; j <= y1; j++) s += L(x0, j, x1, j, `stroke="${j % 2 ? '#e6e9ef' : '#d2d7e0'}" stroke-width="1"`);
  s += L(x0, 0, x1, 0, `stroke="${INKC}" stroke-width="2"`) + L(0, y0, 0, y1, `stroke="${INKC}" stroke-width="2"`);
  for (let i = x0 + 2; i < x1; i += 2) if (i) s += `<text x="${X(i)}" y="${Y(0) + fs + 2}" font-size="${fs}" text-anchor="middle" fill="#3a4254">${suMinus(i)}</text>`;
  for (let j = y0 + 2; j < y1; j += 2) if (j) s += `<text x="${X(0) - 5}" y="${Y(j) + 5}" font-size="${fs}" text-anchor="end" fill="#3a4254">${suMinus(j)}</text>`;
  // the line, clipped to the window
  const xa = Math.max(x0, (y0 - b) / m), xb = Math.min(x1, (y1 - b) / m), lo = Math.min(xa, xb), hi = Math.max(xa, xb);
  s += `<line x1="${X(lo)}" y1="${Y(m * lo + b)}" x2="${X(hi)}" y2="${Y(m * hi + b)}" stroke="#1f5bd6" stroke-width="3.5" stroke-linecap="round"/>`;
  pts.forEach(([x, y, col], i) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="${col || (i ? INKC : '#12805a')}" stroke="#fff" stroke-width="2"/>`; });
  return s + '</svg>';
}
function suPick(r, ms, bs) {
  for (;;) { const m = r.pick(ms), b = r.pick(bs); if (Math.abs(b + m) <= 7) return [m, b]; }
}
const SU_M = [1, 2, 3, 4, 5], SU_B = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
standup('u7l3', {
  intro: 'Graph it at your whiteboard: start at (0, b), step the slope, then join with a straight line.',
  levels: {
    BEG: (r) => { // state m, b, the start point and the second point
      const [m, b] = suPick(r, [2, 3, 4, 5], SU_B);
      return { text: 'State <i>m</i> and <i>b</i>. Then give the <b>start point</b> and the <b>second point</b> you get by stepping the slope once.',
        q: suSI(m, b), a: [`m=${m}=\\dfrac{${m}}{1},\\qquad b=${b}`, `\\text{start: }(0,\\ ${b})`, `\\text{right }1,\\ \\text{up }${m}:\\ (1,\\ ${b + m})`] };
    },
    PRG: (r) => { // graph it; some hidden 1s and some written y = b + mx
      const [m, b] = suPick(r, SU_M, SU_B), form = r.int(0, 2), q = form === 2 ? 'y=' + b + suTerm(m, 'x', false) : suSI(m, b);
      return { text: 'Graph the line using the slope and the <i>y</i>-intercept.', q,
        a: [(form === 2 ? '\\text{reorder: }' + suSI(m, b) + ',\\quad ' : '') + `m=${m}=\\dfrac{${m}}{1},\\quad b=${b}`, `(0,\\ ${b})\\ \\to\\ \\text{right }1,\\ \\text{up }${m}\\ \\to\\ (1,\\ ${b + m})`],
        atext: suGraph(m, b, [[0, b], [1, b + m]]) };
    },
    MAS: (r) => { // graph it, then check a third point with the equation
      const [m, b] = suPick(r, [2, 3, 4], SU_B), back = r.chance(0.5);
      const x = back ? -1 : 2, y = m * x + b;
      if (Math.abs(y) > 8) return { text: 'Graph the line. Then use the equation to <b>check</b> that a third point on your line fits.', q: suSI(m, b),
        a: [`(0,\\ ${b})\\ \\to\\ (1,\\ ${b + m})`, `\\text{check }x=1:\\ y=${m}(1)${b < 0 ? '-' : '+'}${Math.abs(b)}=${b + m}\\ \\checkmark`], atext: suGraph(m, b, [[0, b], [1, b + m]]) };
      return { text: `Graph the line. Then use the equation to <b>check</b> the point on your line at <i>x</i> = ${suMinus(x)}.`, q: suSI(m, b),
        a: [`(0,\\ ${b})\\ \\to\\ (1,\\ ${b + m})`, back ? `\\text{step back: left }1,\\ \\text{down }${m}\\ \\to\\ (-1,\\ ${y})` : `\\text{step again: }(2,\\ ${y})`,
          `\\text{check: }y=${m}(${x})${b < 0 ? '-' : '+'}${Math.abs(b)}=${y}\\ \\checkmark`], atext: suGraph(m, b, [[0, b], [1, b + m], [x, y]]) };
    }
  }
});

/* =============================== mount =============================== */
mountPond();
mountFigures();
mountBuilder();
export const explainers = mountExplainers({ frogLine, readMB, start, overOne, stepGraph, traps, negStep, fracStep });
export const _test = { eqTex, fr, FL, RM, ST, OO, SG, TR, NG, FS };
