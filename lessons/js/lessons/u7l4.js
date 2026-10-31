/* Math 15 · Unit 7 · Lesson 4 — Writing the Equation of a Line Given Slope and y-Intercept.
 * Warm-up (Name That Line: four lines on a grid, tap a name to light it up and count its slope from the y-axis dot),
 * the Example 3 figure, and the explainers:
 *   sub (substitute m and b into the boxes of y = [m]x + [b], then tidy: +(−7), 1x, +0; Example 1 and 2(b) checks),
 *   pointB (a point with x = 0 is the y-intercept; (−4, 0) is not; Example 2(a) check),
 *   fromGraph (b where the line crosses, a second lattice point, count rise/run, substitute, check; Example 3 checks),
 *   twoNumbers (same b different m, same m different b, zeros: it takes both numbers to name a line),
 *   fromTable (x up by 1, the change in y is m, the y beside x = 0 is b, plotted beside; Example 4 checks),
 *   story (Jaden's savings as bars: start $60, +$12 a week, the tops line up, B = 12w + 60, week 9; Example 5 check),
 *   where (a flowchart: numbers, graph, table or story → find m and b → substitute).
 * Colours: m and lines blue, b / y-intercept green, run amber, rise purple; mistakes red. */
import {
  h, tex, add, box, Graph, ValueTable, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween,
  pairTex, texNum, svgEl, liveCtx, pulse, place, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RUN = COLORS.amber, RISE = COLORS.purple, LINE = COLORS.blue, BC = COLORS.green, RED = COLORS.red, INK = COLORS.ink, GRAY = COLORS.gray;
const cR = (s) => `\\textcolor{${RISE}}{${s}}`, cU = (s) => `\\textcolor{${RUN}}{${s}}`;
const cM = (s) => `\\textcolor{${LINE}}{${s}}`, cB = (s) => `\\textcolor{${BC}}{${s}}`, cX = (s) => `\\textcolor{${RED}}{${s}}`;
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const red = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const fr = (n, d, big) => { const [a, b] = red(n, d); if (b === 1) return String(a); return (a < 0 ? '-' : '') + `\\${big ? 'd' : 't'}frac{${Math.abs(a)}}{${b}}`; };
/** y = mx + b as TeX, m blue and b green (each with its sign); m = [n, d]; o.y / o.x rename the variables */
function eqTex(m, b, o = {}) {
  const col = o.color !== false, C1 = col ? cM : (s) => s, C2 = col ? cB : (s) => s;
  const [mn, md] = red(m[0], m[1]), mv = mn / md, X = o.x || 'x';
  let s = '';
  if (mn !== 0) {
    const mag = md === 1 ? (Math.abs(mn) === 1 ? '' : String(Math.abs(mn))) : `\\${o.big ? 'd' : 't'}frac{${Math.abs(mn)}}{${md}}`;
    s = (mag || mv < 0 ? C1((mv < 0 ? '-' : '') + mag) : '') + X;
  }
  if (b !== 0 || !s) {
    if (!s) s = C2(String(b));
    else s += b < 0 ? `\\mathbin{${C2('-')}}${C2(String(-b))}` : `+${C2(String(b))}`;
  }
  return `${o.y || 'y'}=${s}`;
}
const n = (v) => texNum(v).replace('-', '−');
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l4-panel ' + cls, title ? `<div class="u7l4-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u7l4-line ' + cls, html); p.appendChild(d); return d; };
const dirW = (run, rise) => `${run > 0 ? 'right' : 'left'} ${T(cU(String(Math.abs(run))))}, ${rise > 0 ? 'up' : 'down'} ${T(cR(String(Math.abs(rise))))}`;
const grid = (host, o = {}) => new Graph(host, Object.assign({ x: 14, y: 10, width: 450, height: 450, xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2 }, o));

/* Slope triangle on a Graph (from Math 10C u7l1): run leg (amber) across, then rise leg (purple). */
class SlopeTri {
  constructor(G, s, o = {}) {
    this.G = G; this.s = Object.assign({}, s); this.o = o;
    const L = o.layer || G.layers.data, w = o.w || 5;
    this.g = svgEl('g', { class: 'u7l4-tri' }, L);
    this.fill = svgEl('path', { fill: o.fill || LINE, 'fill-opacity': o.fillOp ?? 0.08, stroke: 'none' }, this.g);
    this.runP = svgEl('path', { class: 'bk-stroke', stroke: RUN, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.riseP = svgEl('path', { class: 'bk-stroke', stroke: RISE, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, this.g);
    this.lRun = o.labels === false ? null : h('div', 'bk-lab u7l4-tlab u7l4-trun');
    this.lRise = o.labels === false ? null : h('div', 'bk-lab u7l4-tlab u7l4-trise');
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
    const word = this.o.words !== false;
    this.lRun.innerHTML = word ? `<b>${run > 0 ? 'right' : 'left'}</b> ${n(Math.abs(run))}` : `<b>run</b> ${n(run)}`;
    this.lRise.innerHTML = word ? `<b>${rise > 0 ? 'up' : 'down'}</b> ${n(Math.abs(rise))}` : `<b>rise</b> ${n(rise)}`;
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
}
const bPoint = (G, b, o = {}) => G.point(0, b, { color: BC, r: 8.5, label: o.label === false ? null : T(pairTex(0, b)), pos: o.pos || 'w', labelCls: 'u7l4-bint' });

/* ====================================================================================================
 * Warm-up: Name That Line — Red y = x + 2, Blue y = −x + 2, Green y = 2x, Purple y = x/2 − 4
 * ==================================================================================================== */
const WL = [
  { k: 'Red', col: '#d72d28', m: [1, 1], b: 2, tag: [4, 6, 'n'] },
  { k: 'Blue', col: '#1e64d2', m: [-1, 1], b: 2, tag: [-4, 6, 'n'] },
  { k: 'Green', col: '#14913c', m: [2, 1], b: 0, tag: [-3, -6, 's'] },
  { k: 'Purple', col: '#873caf', m: [1, 2], b: -4, tag: [6, -1, 'e'] }
];
function mountWarm() {
  const host = document.getElementById('u7l4-wfig'), bar = document.getElementById('u7l4-wbtns'); if (!host || !bar) return;
  const G = new Graph(host, { width: 470, height: 470, xmin: -6.8, xmax: 6.8, ymin: -6.8, ymax: 6.8, xlabels: 2, ylabels: 2, fontSize: 16 });
  const els = {};
  WL.forEach((L) => {
    const ln = G.line({ m: L.m[0] / L.m[1], b: L.b }, { color: L.col, width: 4.5 });
    const tg = G.label(L.tag[0], L.tag[1], L.k, { pos: L.tag[2], cls: 'u7l4-wtag', gap: 6 }); tg.style.background = L.col;
    els[L.k] = { ln, tg, extra: [] };
  });
  [2, 0, -4].forEach((b) => G.point(0, b, { color: INK, r: 8, open: true }));
  let busy = false;
  const clearExtra = () => WL.forEach((L) => { els[L.k].extra.forEach((e) => (e.remove ? e.remove() : G.remove(e))); els[L.k].extra = []; });
  const focus = async (k) => {
    if (busy) return; busy = true; clearExtra();
    bar.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
    WL.forEach((L) => { const on = !k || L.k === k; els[L.k].ln.style.opacity = on ? 1 : 0.15; els[L.k].tg.style.opacity = on ? 1 : 0.3; });
    if (k) {
      const L = WL.find((q) => q.k === k), c = liveCtx();
      const t = new SlopeTri(G, { x: 0, y: L.b, run: L.m[1], rise: L.m[0] }, { fill: L.col, fillOp: 0.12 });
      els[k].extra.push(t); await t.drawIn(c, 380);
    }
    busy = false;
  };
  WL.forEach((L) => { const b = h('button', 'pill u7l4-wbtn', L.k); b.type = 'button'; b.dataset.k = L.k; b.style.setProperty('--wc', L.col); b.addEventListener('click', () => focus(L.k)); bar.appendChild(b); });
  const all = h('button', 'pill', 'All lines'); all.type = 'button'; all.addEventListener('click', () => focus(null)); bar.appendChild(all);
}

/* ====================================================================================================
 * Example 3 figure: p: y = 2x − 4 (blue), q: y = −x/2 + 3 (red)
 * ==================================================================================================== */
function mountFigures() {
  const el = document.getElementById('u7l4-ex3fig'); if (!el) return;
  const G = new Graph(el, { width: 380, height: 380, xmin: -8.5, xmax: 8.5, ymin: -8.5, ymax: 8.5, xlabels: 2, ylabels: 2, fontSize: 14 });
  G.line({ m: 2, b: -4 }, { color: LINE, width: 3.5 }); G.line({ m: -0.5, b: 3 }, { color: RED, width: 3.5 });
  G.label(5.6, 7.2, T('p'), { pos: 'e', cls: 'u7l4-lname', color: LINE, gap: 8 });
  G.label(-7.6, 6.8, T('q'), { pos: 'n', cls: 'u7l4-lname', color: RED, gap: 8 });
}

/* =============================== explainer: substitute into the boxes =============================== */
/* a problem: given (HTML), m and b (TeX), the raw substitution, and an optional tidy line with its reason */
const SB = {
  ex1a: { label: 'Example 1(a) check', probs: [{ given: `slope ${T('5')} and ${T('y')}-intercept ${T('2')}`, m: '5', b: '2', raw: 'y=5x+2' }] },
  ex1b: { label: 'Example 1(b) check', probs: [{ given: `slope ${T('-2')} and ${T('y')}-intercept ${T('-7')}`, m: '-2', b: '-7', raw: 'y=-2x+(-7)', tidy: 'y=-2x-7', why: `${T('+(-7)')} is the same as ${T('-7')}` }] },
  ex2b: { label: 'Example 2(b) check', probs: [{ given: `${T('y')}-intercept ${T('9')} and slope ${T('-\\tfrac{3}{4}')}`, m: '-\\tfrac{3}{4}', b: '9', raw: 'y=-\\tfrac{3}{4}x+9', first: 'b' }] },
  tidy: { label: 'Tidy-ups: 1s and 0s', probs: [
    { given: `slope ${T('1')} and ${T('y')}-intercept ${T('4')}`, m: '1', b: '4', raw: 'y=1x+4', tidy: 'y=x+4', why: `${T('1x')} is just ${T('x')}` },
    { given: `slope ${T('4')} and ${T('y')}-intercept ${T('0')}`, m: '4', b: '0', raw: 'y=4x+0', tidy: 'y=4x', why: `adding ${T('0')} changes nothing, so drop it` },
    { given: `slope ${T('-1')} and ${T('y')}-intercept ${T('-3')}`, m: '-1', b: '-3', raw: 'y=-1x+(-3)', tidy: 'y=-x-3', why: `${T('-1x')} is ${T('-x')}, and ${T('+(-3)')} is ${T('-3')}` }] }
};
const slotEq = (m, b) => `y=${m == null ? '\\boxed{\\phantom{0}\\,?\\,\\phantom{0}}' : cM(`\\boxed{\\,${m}\\,}`)}\\,x+${b == null ? '\\boxed{\\phantom{0}\\,?\\,\\phantom{0}}' : cB(`\\boxed{\\,${b}\\,}`)}`;
const sub = {
  title: 'Substitute, then tidy',
  height: 400,
  choices: Object.keys(SB).map((k) => ({ v: k, label: SB[k].label })),
  intro: 'Two boxes: the <b>slope</b> goes in front of <b>x</b>, the <b>y-intercept</b> goes on its own. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SB[k], W = ex.W;
    const giv = add(stage, box(h('div', 'u7l4-given'), W - 28, 64), 14, 10);
    const tpl = add(stage, box(h('div', 'u7l4-tpl'), W - 28, 110), 14, 86);
    const res = add(stage, box(h('div', 'u7l4-res'), W - 28, 70), 14, 206);
    const done = add(stage, box(h('div', 'u7l4-done'), W - 28, 100), 14, 288);
    const steps = [];
    d.probs.forEach((p, i) => {
      const fresh = (c) => { giv.innerHTML = `<span class="u7l4-gk">Given</span><span>${p.given}</span>`; tpl.innerHTML = T(slotEq(null, null)); res.innerHTML = ''; return show(c, giv); };
      const fillM = async (c) => { tpl.innerHTML = T(slotEq(p.m, null)); await pulse(c, tpl, 1.04); };
      const fillB = async (c) => { tpl.innerHTML = T(slotEq(p.m, p.b)); await pulse(c, tpl, 1.04); };
      if (p.first === 'b') {
        steps.push({ cap: `${p.given}. The ${T('y')}-intercept comes first in the sentence, but it still goes <b>on its own</b>: ${T(cB('b=' + p.b))}.`,
          run: async (c) => { await fresh(c); tpl.innerHTML = T(slotEq(null, p.b)); await pulse(c, tpl, 1.04); } });
        steps.push({ cap: `The slope still goes <b>in front of</b> ${T('x')}: ${T(cM('m=' + p.m))}.`, run: async (c) => { tpl.innerHTML = T(slotEq(p.m, p.b)); await pulse(c, tpl, 1.04); } });
      } else {
        steps.push({ cap: `${p.given}. The slope goes <b>in front of</b> ${T('x')}: ${T(cM('m=' + p.m))}.`, run: async (c) => { await fresh(c); await fillM(c); } });
        steps.push({ cap: `The ${T('y')}-intercept goes <b>on its own</b>: ${T(cB('b=' + p.b))}.`, run: (c) => fillB(c) });
      }
      const addChip = async (c) => { const chip = h('span', 'u7l4-dchip', T(p.tidy || p.raw) + ' ✓'); done.appendChild(chip); await pop(c, chip); };
      steps.push({ cap: p.tidy ? `Drop the boxes: ${T(p.raw)}. It needs tidying: ${p.why}.` : `Drop the boxes: ${T('\\boldsymbol{' + p.raw + '}')}. Done: nothing to calculate.`,
        run: async (c) => { res.innerHTML = p.tidy ? T(p.raw) : T('\\boldsymbol{' + p.raw + '}') + ' ✓'; await show(c, res); if (!p.tidy) await addChip(c); } });
      if (p.tidy) steps.push({ cap: `Tidy: ${T('\\boldsymbol{' + p.tidy + '}')}.${i === d.probs.length - 1 ? '' : ' Next one!'}`,
        run: async (c) => { res.innerHTML = `${T(p.raw)} <span class="u7l4-arrow">→</span> ${T('\\boldsymbol{' + p.tidy + '}')} ✓`; await pulse(c, res, 1.05); await addChip(c); } });
    });
    return steps;
  }
};

/* =============================== explainer: a point on the y-axis is b =============================== */
const PB = {
  ex2a: { label: 'Example 2(a) check', pt: [0, -4], m: [1, 3] },
  trap: { label: 'Careful: (−4, 0)', pt: [-4, 0], m: [1, 3] }
};
const pointB = {
  title: 'Is this point the y-intercept?',
  height: 470,
  minW: 820,
  choices: Object.keys(PB).map((k) => ({ v: k, label: PB[k].label })),
  intro: 'A line has slope <b>⅓</b> and passes through a point. Can we read <b>b</b> straight off the point? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = PB[k], [px, py] = d.pt, [rise, run] = d.m, mv = rise / run, bTrue = py - mv * px;
    const G = grid(stage);
    const PX = 486, P = panel(stage, PX, 10, ex.W - PX - 14, 450, k === 'ex2a' ? 'Example 2(a)' : 'Careful!');
    const giv = h('div', 'u7l4-eqbox u7l4-small', `slope ${T('\\tfrac{1}{3}')}, through ${T(pairTex(px, py))}`); P.appendChild(giv);
    const alg = h('div', 'u7l4-alg'); P.appendChild(alg);
    const band = (axis, color) => {
      const g = svgEl('g', {}, G.layers.bg), [ax, ay] = G.toPx(0, 0), [x0, y0] = G.toPx(G.win.xmin, G.win.ymax), [x1, y1] = G.toPx(G.win.xmax, G.win.ymin);
      if (axis === 'y') svgEl('rect', { x: ax - 10, y: y0, width: 20, height: y1 - y0, fill: color, 'fill-opacity': 0.2 }, g);
      else svgEl('rect', { x: x0, y: ay - 10, width: x1 - x0, height: 20, fill: color, 'fill-opacity': 0.2 }, g);
      return g;
    };
    if (k === 'ex2a') {
      const pts = [[3, -3], [6, -2]];
      return [
        { cap: `Plot the point ${T(pairTex(px, py))}.`, run: (c) => G.reveal(G.point(px, py, { color: INK, r: 8, label: T(pairTex(px, py)), pos: 'w', labelCls: 'u7l4-plab' }), c) },
        { cap: `Look at its ${T('x')}-coordinate: ${T('0')}. Every point with ${T('x=0')} sits on the ${T('y')}-axis.`,
          run: async (c) => { await appear(c, band('y', BC), 350); await show(c, line(alg, `${T('x=0')}: on the ${T('y')}-axis`)); } },
        { cap: `So this point <b>is</b> where the line crosses the ${T('y')}-axis: ${T(cB('b=-4'))}. Only the number ${T('-4')} goes into the equation.`,
          run: async (c) => { await G.reveal(bPoint(G, -4, { label: false }), c); await show(c, line(alg, `${T(cB('b=-4'))}, ${T(cM('m=\\tfrac{1}{3}'))}`)); } },
        { cap: `Check it with the slope: from ${T('(0,-4)')}, right ${T(cU('3'))}, up ${T(cR('1'))}, again and again.`,
          run: async (c) => { let f = [0, -4]; for (const p of pts) { const t = new SlopeTri(G, { x: f[0], y: f[1], run: 3, rise: 1 }, { fillOp: 0.06 }); await t.drawIn(c, 320); await G.reveal(G.point(p[0], p[1], { color: INK, r: 6 }), c); f = p; } await G.drawIn(G.line({ m: mv, b: -4 }, { color: LINE, width: 4 }), 700, c); } },
        { cap: `Substitute: ${T('\\boldsymbol{y=\\tfrac{1}{3}x-4}')}.`, run: async (c) => { const e = line(alg, T(eqTex(d.m, -4, { big: true })), 'u7l4-big'); await show(c, e); } }
      ];
    }
    return [
      { cap: `Plot the point ${T(pairTex(px, py))}.`, run: (c) => G.reveal(G.point(px, py, { color: RED, r: 8, label: T(pairTex(px, py)), pos: 'nw', labelCls: 'u7l4-plab u7l4-redl' }), c) },
      { cap: `Its ${T('x')}-coordinate is ${T('-4')}, not ${T('0')}. The zero is the ${T('y')}: this point is on the ${T('x')}-axis, <b>not</b> the ${T('y')}-axis.`,
        run: async (c) => { await appear(c, band('x', RED), 350); await show(c, line(alg, `${T('y=0')}: on the ${T('x')}-axis ✗`, 'u7l4-bad')); } },
      { cap: `Draw the line with slope ${T('\\tfrac{1}{3}')} through it. Where does it cross the ${T('y')}-axis?`,
        run: async (c) => { await G.drawIn(G.line({ m: mv, b: bTrue }, { color: LINE, width: 4 }), 800, c); } },
      { cap: `It crosses at ${T('1\\tfrac{1}{3}')}, not at ${T('-4')}. So ${T('b\\ne -4')}: only a point with ${T('x=0')} hands you ${T('b')}.`,
        run: async (c) => { await G.reveal(G.point(0, bTrue, { color: BC, r: 8, open: true }), c); await show(c, line(alg, `crosses at ${T(cB('1\\tfrac{1}{3}'))}, so ${T('b\\ne-4')}`)); await show(c, line(alg, `(Finding ${T('b')} from a point like this is Lesson 5.)`, 'u7l4-soft')); } }
    ];
  }
};

/* =============================== explainer: read m and b off a graph =============================== */
const FG = {
  p: { label: 'Example 3: line p', m: [2, 1], b: -4, chk: [3, 2], second: [2, 0], col: LINE, name: 'p' },
  q: { label: 'Example 3: line q', m: [-1, 2], b: 3, chk: [4, 1], second: [2, 2], miss: 1, col: RED, name: 'q' },
  c: { label: 'A new line', m: [2, 3], b: -2, chk: [6, 2], second: [3, 0], miss: 1, col: COLORS.teal, name: '' }
};
const fromGraph = {
  title: 'Read b, count m, write the equation',
  height: 480,
  minW: 860,
  choices: Object.keys(FG).map((k) => ({ v: k, label: FG[k].label })),
  intro: '<b>b</b>: where the line crosses the y-axis. <b>m</b>: rise over run between two lattice points. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = FG[k], [rise, run] = d.m, b = d.b, mv = rise / run, [sx, sy] = d.second, nm = d.name ? `line ${T(d.name)}` : 'the line';
    const G = grid(stage, { width: 460, height: 460, xmin: -8.5, xmax: 8.5, ymin: -8.5, ymax: 8.5 });
    G.line({ m: mv, b }, { color: d.col, width: 4.5 });
    const PX = 494, P = panel(stage, PX, 10, ex.W - PX - 14, 460, d.name ? 'Example 3, line ' + d.name : 'Name this line');
    const ro = h('div', 'u7l4-ro'); P.appendChild(ro);
    ro.innerHTML = `<div class="u7l4-ro-r u7l4-ro-b"><span class="u7l4-ro-k">b</span><b>?</b></div><div class="u7l4-ro-r u7l4-ro-m"><span class="u7l4-ro-k">m</span><b>?</b></div>`;
    const [vB, vM] = ro.querySelectorAll('b');
    const eqb = h('div', 'u7l4-eqbox'); P.appendChild(eqb); eqb.innerHTML = T('y=\\ ?');
    const alg = h('div', 'u7l4-alg'); P.appendChild(alg);
    const mid = d.miss ? [d.miss, b + mv * d.miss] : null;
    let missPt = null;
    const steps = [
      { cap: `Where does ${nm} cross the ${T('y')}-axis? At ${T(cB(pairTex(0, b)))}, so ${T(cB('b=' + b))}.`,
        run: async (c) => { await G.reveal(bPoint(G, b), c); vB.innerHTML = T(cB(String(b))); await pulse(c, vB.parentNode, 1.06); } }
    ];
    if (mid) steps.push({ cap: `Now a second point. Careful: at ${T('x=' + d.miss)}, the line passes <b>between</b> grid lines (${T('y=' + fr(Math.round(mid[1] * run), run))}). Not a lattice point, so skip it.`,
      run: async (c) => { missPt = G.point(mid[0], mid[1], { color: RED, r: 8, open: true, label: '✗', pos: 'ne', labelCls: 'u7l4-plab u7l4-redl' }); await G.reveal(missPt, c); } });
    steps.push({ cap: `${mid ? 'Keep going along the line to a grid corner' : 'Now a second <b>lattice point</b>: a grid corner'} the line passes exactly through: ${T(pairTex(sx, sy))}.`,
      run: async (c) => { await G.reveal(G.point(sx, sy, { color: INK, r: 7.5, label: T(pairTex(sx, sy)), pos: rise > 0 ? 'e' : 'ne', labelCls: 'u7l4-plab' }), c); } });
    steps.push({ cap: `Count from ${T(pairTex(0, b))} to ${T(pairTex(sx, sy))}: ${dirW(sx, sy - b)}. ${T(`m=\\dfrac{\\text{rise}}{\\text{run}}=\\dfrac{${cR(String(sy - b))}}{${cU(String(sx))}}=${cM(fr(sy - b, sx))}`)}.`,
      run: async (c) => { if (missPt) { missPt.style.opacity = 0.25; if (missPt.label) missPt.label.style.opacity = 0; } const t = new SlopeTri(G, { x: 0, y: b, run: sx, rise: sy - b }, { fillOp: 0.08 }); await t.drawIn(c, 420); vM.innerHTML = T(cM(fr(rise, run, true))); await pulse(c, vM.parentNode, 1.06); } });
    steps.push({ cap: `Substitute ${T(cM('m=' + fr(rise, run)))} and ${T(cB('b=' + b))}: ${T(eqTex(d.m, b))}.`,
      run: async (c) => { eqb.innerHTML = T(eqTex(d.m, b, { big: true })); await pulse(c, eqb, 1.06); } });
    const [cx, cy] = d.chk;
    steps.push({ cap: `Check another lattice point, ${T(pairTex(cx, cy))}: ${T(`${fr(rise, run)}(${cx})${b < 0 ? '-' : '+'}${Math.abs(b)}=${cy}`)} ✓.`,
      run: async (c) => { await G.reveal(G.point(cx, cy, { color: BC, r: 7, label: '✓', pos: 'e', labelCls: 'u7l4-plab u7l4-okl' }), c); await show(c, line(alg, `Check ${T(pairTex(cx, cy))}: ${T(`${fr(rise, run)}(${cx})${b < 0 ? '-' : '+'}${Math.abs(b)}=${cy}`)} ✓`, 'u7l4-good')); } });
    return steps;
  }
};

/* =============================== explainer: it takes both numbers =============================== */
const TN = {
  sameB: { label: 'Same b, different m', lines: [{ m: [1, 1], b: 2, col: '#d72d28', at: 3.5 }, { m: [-1, 1], b: 2, col: '#1e64d2', at: -3.5 }],
    caps: ['Red from the warm-up crosses at ' + T('(0,2)') + ' and rises: ' + T('m=1') + '.', 'Blue crosses at the <b>same</b> point but falls: ' + T('m=-1') + '.'],
    end: `Same ${T(cB('b'))}, different lines: ${T(cB('b'))} alone doesn’t name a line.` },
  sameM: { label: 'Same m, different b', lines: [{ m: [1, 1], b: 2, col: '#d72d28', at: 3.5 }, { m: [1, 1], b: -4, col: COLORS.teal, at: 5.2 }],
    caps: ['Red: ' + T('y=x+2') + '.', 'A line with the <b>same</b> slope that crosses at ' + T('-4') + ': ' + T('y=x-4') + '. Same tilt, slid down.'],
    end: `Same ${T(cM('m'))}: the lines are <b>parallel</b>. ${T(cM('m'))} alone doesn’t name a line either.` },
  zeros: { label: 'When m or b is 0', lines: [{ m: [2, 1], b: 0, col: '#14913c', at: 2.6 }, { m: [0, 1], b: 3, col: '#873caf', at: -4.5 }],
    caps: [T('m=2,\\ b=0') + ': ' + T('y=2x+0') + ' is just ' + T('y=2x') + '. It passes through the origin.', T('m=0,\\ b=3') + ': ' + T('y=0x+3') + ' is just ' + T('y=3') + '. Slope 0: flat.'],
    end: `A zero still counts as one of the two numbers: it just disappears when you tidy.` }
};
const twoNumbers = {
  title: 'One line needs both numbers',
  height: 470,
  minW: 820,
  choices: Object.keys(TN).map((k) => ({ v: k, label: TN[k].label })),
  intro: 'Change one number at a time and watch the line. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TN[k];
    const G = grid(stage);
    const PX = 486, P = panel(stage, PX, 10, ex.W - PX - 14, 450, TN[k].label);
    const steps = d.lines.map((L, i) => ({ cap: d.caps[i],
      run: async (c) => {
        await G.reveal(G.point(0, L.b, { color: BC, r: 7.5 }), c);
        await G.drawIn(G.line({ m: L.m[0] / L.m[1], b: L.b }, { color: L.col, width: 4.5 }), 700, c);
        const y = (L.m[0] / L.m[1]) * L.at + L.b;
        const lb = G.label(L.at, y, T(eqTex(L.m, L.b, { color: false })), { pos: L.m[0] >= 0 ? 'se' : 'sw', cls: 'u7l4-plab u7l4-eqlab', color: L.col, gap: 8 }); await pop(c, lb);
        const card = h('div', 'u7l4-tncard', `${T(cM('m=' + fr(L.m[0], L.m[1])))}, ${T(cB('b=' + L.b))} <span class="u7l4-arrow">→</span> ${T(eqTex(L.m, L.b, { color: false }))}`);
        card.style.borderColor = L.col; P.appendChild(card); await show(c, card);
      } }));
    steps.push({ cap: d.end, run: async (c) => { const r = h('div', 'u7l4-rulebox', `A line is pinned down by <b>both</b> numbers: ${T(cM('m'))} (the tilt) and ${T(cB('b'))} (the crossing).`); P.appendChild(r); await pop(c, r); } });
    return steps;
  }
};

/* =============================== explainer: read m and b from a table =============================== */
const TB = {
  ex4a: { label: 'Example 4(a) check', xs: [0, 1, 2, 3], m: 3, b: 4 },
  ex4b: { label: 'Example 4(b) check', xs: [0, 1, 2, 3], m: -2, b: 10 },
  mid: { label: T('x=0') + ' in the middle', xs: [-2, -1, 0, 1, 2], m: 2, b: 1 }
};
const fromTable = {
  title: 'Read m and b from a table',
  height: 480,
  minW: 900,
  choices: Object.keys(TB).map((k) => ({ v: k, label: TB[k].label })),
  intro: 'The <b>change in y</b> is the slope; the <b>y beside x = 0</b> is the y-intercept. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TB[k], rows = d.xs.map((x) => [x, d.m * x + d.b]), ys = rows.map((r) => r[1]), i0 = d.xs.indexOf(0), last = rows[rows.length - 1];
    const tb = new ValueTable(stage, { x: 14, y: 30, rows, layout: 'h', cellW: 84, cellH: 62, diffs: true, diffSpace: 72, tap: false, cls: 'u7l4-vt' });
    // +1 labels above the x row
    const ups = rows.slice(1).map((r, i) => { const a = tb.cell(i, 0), b2 = tb.cell(i + 1, 0); const l = h('div', 'u7l4-xup', '+1'); add(stage, l, 14 + (a.offsetLeft + b2.offsetLeft + b2.offsetWidth) / 2, 10); l.style.translate = '-50% 0'; hide(l); return l; });
    const info = add(stage, box(h('div', 'u7l4-tinfo'), 500, 220), 14, 252);
    const lo = Math.min(0, ...ys), hi = Math.max(0, ...ys), span = hi - lo, ystep = span > 12 ? 2 : 1;
    const G = new Graph(stage, { x: ex.W - 14 - 350, y: 10, width: 350, height: 460, xmin: Math.min(-1, d.xs[0] - 1) - 0.5, xmax: Math.max(...d.xs) + 1.5, ymin: lo - 1.5, ymax: hi + 1.5, xlabels: 1, ylabels: ystep * 2, ystep, fontSize: 14 });
    const mt = d.m > 0 ? `+${d.m}` : String(d.m);
    const steps = [
      { cap: `Plot the table: the points line up. Now read the two numbers from the table itself.`,
        run: async (c) => { for (const r of rows) await G.reveal(G.point(r[0], r[1], { color: INK, r: 6 }), c); } },
      { cap: `First check the ${T('x')}-row: it goes up by ${T('1')} each time.`,
        run: async (c) => { for (const l of ups) await pop(c, l, 220); ups.forEach((l) => (l.style.opacity = 1)); } },
      { cap: `Now the ${T('y')}-row: ${rows.slice(1).map(() => T(cM(mt))).join(', ')}. The change in ${T('y')} for each ${T('1')} in ${T('x')} is the slope: ${T(cM('m=' + d.m))}.`,
        run: async (c) => { await tb.diffs(c, { color: LINE }); const l = line(info, `${d.m > 0 ? 'up' : 'down'} ${Math.abs(d.m)} each time: ${T(cM('m=' + d.m))}`); await show(c, l);
          const t = new SlopeTri(G, { x: rows[0][0], y: rows[0][1], run: 1, rise: d.m }, { labels: false, fillOp: 0.1 }); await t.drawIn(c, 300); } },
      { cap: `Find ${T('x=0')}. The ${T('y')} beside it is the ${T('y')}-intercept: ${T(cB('b=' + d.b))}.`,
        run: async (c) => { tb.cell(i0, 0).classList.add('u7l4-hl0'); tb.cell(i0, 1).classList.add('u7l4-hl0'); await pulse(c, tb.cell(i0, 1), 1.15); await show(c, line(info, `at ${T('x=0')}, ${T('y=' + d.b)}: ${T(cB('b=' + d.b))}`)); await G.reveal(bPoint(G, d.b, { label: false }), c); } },
      { cap: `Substitute: ${T(eqTex([d.m, 1], d.b))}.`,
        run: async (c) => { await show(c, line(info, T(eqTex([d.m, 1], d.b, { big: true })), 'u7l4-big')); await G.drawIn(G.line({ m: d.m, b: d.b }, { color: LINE, width: 3.5 }), 600, c); } },
      { cap: `Check the last column: ${T(`x=${last[0]}\\Rightarrow ${d.m}(${last[0]})${d.b < 0 ? '-' : '+'}${Math.abs(d.b)}=${last[1]}`)} ✓, the same as the table.`,
        run: async (c) => { await show(c, line(info, `Check: ${T(`${d.m}(${last[0]})${d.b < 0 ? '-' : '+'}${Math.abs(d.b)}=${last[1]}`)} ✓`, 'u7l4-good')); } }
    ];
    return steps;
  }
};

/* =============================== explainer: a story (Example 5) =============================== */
const SY = {
  ex5: { label: 'Example 5 check', start: 60, rate: 12, ask: 9, yv: 'B', xv: 'w', unit: 'week', money: true, ymax: 200, ystep: 20, ylab: 40,
    startW: 'Jaden starts with <b>$60</b>', rateW: 'He adds <b>$12 every week</b>', yt: 'B', xt: 'w', askW: 'after 9 weeks' },
  bat: { label: 'A phone battery', start: 90, rate: -5, ask: 6, yv: 'P', xv: 't', unit: 'hour', money: false, ymax: 100, ystep: 10, ylab: 20,
    startW: 'A phone starts at <b>90%</b> charge', rateW: 'It loses <b>5% every hour</b>', yt: 'P', xt: 't', askW: 'After 6 hours' }
};
const story = {
  title: 'Start + rate = y = mx + b',
  height: 480,
  minW: 860,
  choices: Object.keys(SY).map((k) => ({ v: k, label: SY[k].label })),
  intro: 'The <b>start</b> is b. The <b>rate</b> is m. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = SY[k], f = (x) => d.rate * x + d.start, v = (y) => (d.money ? '\\$' + y : y + '\\%');
    const G = new Graph(stage, { x: 14, y: 10, width: 470, height: 460, xmin: 0, xmax: 10.5, ymin: 0, ymax: d.ymax + d.ystep / 2, ystep: d.ystep, ylabels: d.ylab, xlabels: 1, xtitle: d.xt, ytitle: d.yt, fontSize: 14 });
    const PX = 500, P = panel(stage, PX, 10, ex.W - PX - 14, 460, k === 'ex5' ? 'Example 5' : 'A phone battery');
    const alg = h('div', 'u7l4-alg'); P.appendChild(alg);
    const bar = (w, col, op = 0.75) => { const x0 = w - 0.32, x1 = w + 0.32; return G.polyline([[x0, 0], [x0, f(w)], [x1, f(w)], [x1, 0]], { closed: true, fill: col, fillOpacity: op, color: col, width: 1.5 }); };
    const eq = eqTex([d.rate, 1], d.start, { y: d.yv, x: d.xv });
    const A = d.ask, FA = f(A);
    return [
      { cap: `${d.startW}: that is the value at ${T(d.xv + '=0')}, before any time passes. Start = ${T(cB('b=' + d.start))}.`,
        run: async (c) => { await G.drawIn(G.segment([0, 0], [0, d.start], { color: BC, width: 12 }), 500, c); const l = G.label(0, d.start, T(cB(v(d.start))), { pos: 'nw', cls: 'u7l4-plab u7l4-startl', gap: 8 }); await pop(c, l); await show(c, line(alg, `start: ${T(cB('b=' + d.start))}`)); } },
      { cap: `${d.rateW}: each ${d.unit} the bar ${d.rate > 0 ? 'grows' : 'shrinks'} by ${T(String(Math.abs(d.rate)))}. Rate = ${T(cM('m=' + d.rate))} per ${d.unit}.`,
        run: async (c) => { for (let w = 1; w <= 3; w++) { await appear(c, bar(w, LINE, 0.55), 300); const l = G.label(w, f(w), T(cR((d.rate > 0 ? '+' : '') + d.rate)), { pos: 'n', cls: 'u7l4-plab', gap: 6 }); await pop(c, l, 220); } await show(c, line(alg, `rate: ${T(cM('m=' + d.rate))} per ${d.unit}`)); } },
      { cap: `Keep going: the tops of the bars line up in a straight line.`,
        run: async (c) => { for (let w = 4; w <= 10; w++) await appear(c, bar(w, LINE, 0.35), 120); await G.drawIn(G.line([0, d.start], [1, f(1)], { color: LINE, width: 3.5, arrows: false }), 600, c); } },
      { cap: `Substitute: ${T(eq)}. Same form as ${T('y=mx+b')}, with ${T(d.yv)} for ${T('y')} and ${T(d.xv)} for ${T('x')}.`,
        run: async (c) => { await show(c, line(alg, T(eqTex([d.rate, 1], d.start, { y: d.yv, x: d.xv, big: true })), 'u7l4-big')); } },
      { cap: `${k === 'ex5' ? 'Example 5(b): ' + d.askW.toLowerCase() : d.askW}, put ${T(`${d.xv}=${A}`)} in: ${T(`${d.yv}=${d.rate}(${A})+${d.start}=${d.rate * A}+${d.start}=${FA}`)}. That's ${T(v(FA))}.`,
        run: async (c) => { const g = G.vline(A, { color: RUN }); await G.drawIn(g, 400, c); await G.reveal(G.point(A, FA, { color: INK, r: 8, label: T(v(FA)), pos: 'ne', labelCls: 'u7l4-plab' }), c);
          await show(c, line(alg, T(`${d.yv}=${d.rate}(${A})+${d.start}`))); await show(c, line(alg, T(`\\phantom{${d.yv}}=${d.rate * A}+${d.start}=\\boldsymbol{${FA}}`))); } }
    ];
  }
};

/* =============================== explainer: where are m and b hiding? =============================== */
const WH = {
  num: { label: 'Given as numbers', node: 'num', ex: `Example 2(a): slope ${T('\\tfrac{1}{3}')} through ${T('(0,-4)')} → ${T(cM('m=\\tfrac{1}{3}'))}, ${T(cB('b=-4'))} → ${T('y=\\tfrac{1}{3}x-4')}` },
  graph: { label: 'On a graph', node: 'graph', ex: `Example 3, line ${T('q')}: crosses at ${T('3')}, down 1 right 2 → ${T(cM('m=-\\tfrac{1}{2}'))}, ${T(cB('b=3'))} → ${T('y=-\\tfrac{1}{2}x+3')}` },
  table: { label: 'In a table', node: 'table', ex: `Example 4(b): ${T('y')} drops 2 each row, ${T('y=10')} at ${T('x=0')} → ${T(cM('m=-2'))}, ${T(cB('b=10'))} → ${T('y=-2x+10')}` },
  story: { label: 'In a story', node: 'story', ex: `Example 5: starts at $60, +$12 a week → ${T(cM('m=12'))}, ${T(cB('b=60'))} → ${T('B=12w+60')}` }
};
const where = {
  title: 'Where are m and b hiding?',
  height: 470,
  choices: Object.keys(WH).map((k) => ({ v: k, label: WH[k].label })),
  intro: 'Wherever they hide, the last step is the same: <b>substitute</b>. Press <b>Next</b>.',
  make(stage, k, ex) {
    const W = ex.W, cw = (W - 40) / 4;
    const xs = [0, 1, 2, 3].map((i) => 14 + cw / 2 + i * (cw + 4));
    const F = new Flowchart(stage, { x: 0, y: 4, width: W, height: 360,
      nodes: {
        start: { x: W / 2, y: 36, w: 360, h: 54, html: '<b>Where are m and b?</b>', cls: 'bk-round' },
        num: { x: xs[0], y: 168, w: cw - 10, h: 120, html: `<b>Given as numbers</b>${T('m')}: the slope<br>${T('b')}: the ${T('y')}-intercept, or the point ${T('(0,b)')}`, color: 'blue' },
        graph: { x: xs[1], y: 168, w: cw - 10, h: 120, html: `<b>On a graph</b>${T('b')}: where it crosses the ${T('y')}-axis<br>${T('m')}: count rise/run between lattice points`, color: 'purple' },
        table: { x: xs[2], y: 168, w: cw - 10, h: 120, html: `<b>In a table</b>${T('b')}: the ${T('y')} beside ${T('x=0')}<br>${T('m')}: the change in ${T('y')} (when ${T('x')} goes up 1)`, color: 'amber' },
        story: { x: xs[3], y: 168, w: cw - 10, h: 120, html: `<b>In a story</b>${T('b')}: the starting amount<br>${T('m')}: the rate per time period`, color: 'green' },
        end: { x: W / 2, y: 316, w: 420, h: 60, html: `<b>Substitute</b>${T('y=mx+b')}, then tidy`, cls: 'bk-round' }
      },
      edges: ['num', 'graph', 'table', 'story'].flatMap((id) => [{ from: 'start', to: id, route: 'vhv' }, { from: id, to: 'end', route: 'vhv' }]) });
    void F;
    const exb = add(stage, box(h('div', 'u7l4-whex'), W - 28, 84), 14, 374); hide(exb);
    const d = WH[k];
    return [
      { cap: `Ask first: where are the two numbers? Here they are <b>${d.label.toLowerCase()}</b>.`, run: (c) => F.light(c, ['start', d.node]) },
      { cap: `Find ${T(cM('m'))} and ${T(cB('b'))}, then substitute: ${d.ex}.`, run: async (c) => { await F.go(c, d.node, 'end'); await F.visit(c, 'end'); exb.innerHTML = d.ex; await show(c, exb); } }
    ];
  }
};

/* =============================== Stand Up Break! (whiteboard stations; ../standup.js) ===============================
 * BEG: write y = mx + b from a given slope and y-intercept (a value or a point (0, b), either order, tidy-ups);
 * PRG: from a table of values (x up by 1; x = 0 first or in the middle); MAS: from a graph (two lattice points marked)
 * or a story (start + rate, then use it). */
const suG = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const suQ = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const g = suG(p, q); return [p / g, q / g]; };
const suN = (p, q = 1) => { const [a, b] = suQ(p, q); return b === 1 ? String(a) : (a < 0 ? '-' : '') + '\\frac{' + Math.abs(a) + '}{' + b + '}'; };
function suSI(p, q, b, Y = 'y', X = 'x') {
  const [a, d] = suQ(p, q); let s = '';
  if (a !== 0) s = (a < 0 ? '-' : '') + (d === 1 ? (Math.abs(a) === 1 ? '' : String(Math.abs(a))) : '\\frac{' + Math.abs(a) + '}{' + d + '}') + X;
  if (b !== 0 || !s) s += (s ? (b < 0 ? '-' : '+') + Math.abs(b) : String(b));
  return Y + '=' + s;
}
const suMinus = (s) => String(s).replace(/-/g, '−');
function suFig(p, q, b, pts) {
  const L = 6, u = 26, P = 16, fs = 15, INKC = '#1c2230', W = 2 * L * u + 2 * P, X = (x) => P + (x + L) * u, Y = (y) => P + (L - y) * u;
  const Ln = (a, b2, c, d, st) => `<line x1="${X(a)}" y1="${Y(b2)}" x2="${X(c)}" y2="${Y(d)}" ${st}/>`;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${W}" width="300" height="300" style="max-width:100%;height:auto" font-family="system-ui,-apple-system,sans-serif" role="img" aria-label="coordinate grid"><rect width="${W}" height="${W}" rx="8" fill="#fff"/>`;
  for (let i = -L; i <= L; i++) { const st = `stroke="${i % 2 ? '#e6e9ef' : '#d2d7e0'}" stroke-width="1"`; s += Ln(i, -L, i, L, st) + Ln(-L, i, L, i, st); }
  s += Ln(-L, 0, L, 0, `stroke="${INKC}" stroke-width="2"`) + Ln(0, -L, 0, L, `stroke="${INKC}" stroke-width="2"`);
  for (let i = -L + 2; i < L; i += 2) if (i) s += `<text x="${X(i)}" y="${Y(0) + fs + 2}" font-size="${fs}" text-anchor="middle" fill="#3a4254">${suMinus(i)}</text><text x="${X(0) - 5}" y="${Y(i) + 5}" font-size="${fs}" text-anchor="end" fill="#3a4254">${suMinus(i)}</text>`;
  const m = p / q, E = L - 0.15, cand = [[-E, b - m * E], [E, b + m * E], [(E - b) / m, E], [(-E - b) / m, -E]].filter(([x, y]) => Math.abs(x) <= E + 1e-9 && Math.abs(y) <= E + 1e-9);
  cand.sort((a, b2) => a[0] - b2[0]); const A = cand[0], B = cand[cand.length - 1];
  s += `<line x1="${X(A[0])}" y1="${Y(A[1])}" x2="${X(B[0])}" y2="${Y(B[1])}" stroke="#1f5bd6" stroke-width="3.5" stroke-linecap="round"/>`;
  pts.forEach(([x, y]) => { s += `<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="${INKC}" stroke="#fff" stroke-width="2"/>`; });
  return s + '</svg>';
}
const SU_STORY = [
  (r) => { const s = r.int(2, 6), k = r.int(2, 4), t = r.int(3, 9); return { txt: `A taxi charges a <b>$${s}</b> flat fee plus <b>$${k}</b> per kilometre. Write an equation for the cost <i>C</i> after <i>d</i> km, then find the cost of a ${t} km ride.`, m: k, b: s, Y: 'C', X: 'd', t, unit: '\\text{ dollars}' }; },
  (r) => { const s = r.int(3, 9), k = r.int(2, 4), t = r.int(4, 10); return { txt: `A plant is <b>${s} cm</b> tall and grows <b>${k} cm</b> every week. Write an equation for its height <i>H</i> after <i>w</i> weeks, then find its height after ${t} weeks.`, m: k, b: s, Y: 'H', X: 'w', t, unit: '\\text{ cm}' }; },
  (r) => { const s = r.pick([40, 50, 60]), k = r.pick([2, 3, 4, 5]), t = r.int(3, 8); return { txt: `A bus card starts with <b>$${s}</b>. Each ride takes off <b>$${k}</b>. Write an equation for the amount <i>A</i> left after <i>n</i> rides, then find the amount after ${t} rides.`, m: -k, b: s, Y: 'A', X: 'n', t, unit: '\\text{ dollars}' }; },
  (r) => { const s = r.pick([20, 25, 30, 35]), k = r.int(5, 9), t = r.int(2, 6); return { txt: `A phone plan costs <b>$${s}</b> a month plus <b>$${k}</b> for each GB of data. Write an equation for the monthly cost <i>C</i> for <i>g</i> GB, then find the cost for ${t} GB.`, m: k, b: s, Y: 'C', X: 'g', t, unit: '\\text{ dollars}' }; }
];
standup('u7l4', {
  intro: 'Find m and b, then substitute into y = mx + b. Write the tidy equation on your whiteboard.',
  levels: {
    BEG: (r) => { // given m and b (or (0, b)), any order
      const frac = r.chance(0.3), q = frac ? r.pick([2, 3, 4, 5]) : 1, p = frac ? r.int(1, q - 1 || 1) * r.sign() : r.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7]);
      const [pp, qq] = suQ(p, q), b = r.chance(0.12) ? 0 : r.int(-9, 9), asPt = r.chance(0.35), bFirst = r.chance(0.35);
      const mT = suN(pp, qq), P0 = '\\((0,\\ ' + b + ')\\)', M0 = '\\(' + mT + '\\)', B0 = '\\(' + b + '\\)';
      const text = 'Write the equation of the line ' + (asPt ? (bFirst ? 'through ' + P0 + ' with slope ' + M0 : 'with slope ' + M0 + ', passing through ' + P0)
        : (bFirst ? 'with <i>y</i>-intercept ' + B0 + ' and slope ' + M0 : 'with slope ' + M0 + ' and <i>y</i>-intercept ' + B0)) + '.';
      return { text: text.replace(/\\\((.*?)\\\)/g, (m0, t) => tex(t)), q: '', a: [`m=${mT},\\quad b=${b}`, '\\boldsymbol{' + suSI(pp, qq, b) + '}'] };
    },
    PRG: (r) => { // a table
      for (;;) {
        const m = r.pick([-5, -4, -3, -2, 2, 3, 4, 5]), b = r.int(-8, 12), x0 = r.chance(0.6) ? 0 : r.pick([-1, -2]), xs = [0, 1, 2, 3].map((i) => x0 + i);
        if (b === 0) continue;
        const ys = xs.map((x) => m * x + b);
        const tab = '\\begin{array}{|c|' + 'c|'.repeat(xs.length) + '}\\hline x&' + xs.join('&') + '\\\\\\hline y&' + ys.join('&') + '\\\\\\hline\\end{array}';
        return { text: 'Determine the equation of the line represented by the table.', q: tab,
          a: [`\\text{change in }y:\\ ${m > 0 ? '+' : ''}${m}\\ \\Rightarrow\\ m=${m}`, `\\text{at }x=0,\\ y=${b}:\\ b=${b}`, '\\boldsymbol{' + suSI(m, 1, b) + '}'] };
      }
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // a graph
        for (;;) {
          const q = r.pick([1, 1, 2, 3]), p = r.pick([1, 2, 3]) * r.sign(), b = r.int(-4, 4);
          if (q > 1 && suG(p, q) !== 1) continue;
          const B = [q, b + p]; if (Math.abs(B[1]) > 5) continue;
          return { text: 'The line passes through the two marked lattice points. Write its equation.', q: '', fig: suFig(p, q, b, [[0, b], B]),
            a: [`b=${b}\\ \\text{(crosses at }(0,\\ ${b}))`, `(0,\\ ${b})\\to(${B[0]},\\ ${B[1]}):\\ m=\\frac{${p}}{${q}}${q === 1 ? '=' + p : ''}`, '\\boldsymbol{' + suSI(p, q, b) + '}'] };
        }
      }
      const s = r.pick(SU_STORY)(r), val = s.m * s.t + s.b;
      return { text: s.txt, q: '', a: [`b=${s.b}\\ (\\text{start}),\\quad m=${s.m}\\ (\\text{rate})`, '\\boldsymbol{' + suSI(s.m, 1, s.b, s.Y, s.X) + '}', `${s.Y}=${s.m}(${s.t})+${s.b}=${val}${s.unit}`] };
    }
  }
});

/* =============================== mount =============================== */
mountWarm();
mountFigures();
export const explainers = mountExplainers({ sub, pointB, fromGraph, twoNumbers, fromTable, story, where });
export const _test = { eqTex, SB, PB, FG, TN, TB, SY, WH };
