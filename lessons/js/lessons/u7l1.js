/* Math 15 · Unit 7 · Lesson 1 — Review: Graphing Linear Equations from a Table of Values.
 * Warm-up (Which Rule Made This? three pattern cards, show the steps, plot A and B), the Example 1 sort, the example
 * graphs, a "tap a point: on the line or not?" card, and the explainers:
 *   linTest (graph each equation and drop it in the LINEAR / NON-LINEAR bin; Example 1 check),
 *   steps (the warm-up cards: same step each row = straight line, growing steps = curve),
 *   buildTable (every x goes into the equation in brackets; the table fills; Example 2 check),
 *   plotLine (table → points → ruler → whole line with arrows; Example 3 and 4 checks),
 *   fixIt (one point off the line: a sign slip, or x and y swapped when plotting),
 *   onLine (the point's coordinates drop into the equation: true or false; Example 5 checks),
 *   zoomOut (the warm-up's big one: a graph can't tell 90 from 92, substitution can).
 * Colours: x-values amber, y-values purple, lines blue, wrong / non-linear red, "on the line" green.
 * linTest and the sort come from the Math 10C u7l1 page. */
import {
  h, tex, add, box, place, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, appear, sleep, tween, anim,
  pairTex, svgEl, liveCtx, pulse, shake, drawIn, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const XC = COLORS.amber, YC = COLORS.purple, LINE = COLORS.blue, PTC = COLORS.teal, RED = COLORS.red, GRN = COLORS.green, INK = COLORS.ink;
const cX = (s) => `\\textcolor{${XC}}{${s}}`, cY = (s) => `\\textcolor{${YC}}{${s}}`, cR = (s) => `\\textcolor{${RED}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l1-panel ' + cls, title ? `<div class="u7l1-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u7l1-line ' + cls, html); p.appendChild(d); return d; };
const P2 = (x, y) => pairTex(x, y);

/* ---------- y = mx + b as TeX, substitution lines ---------- */
function eqTex(m, b) {
  let s = m === 0 ? '' : (m === 1 ? '' : m === -1 ? '-' : String(m)) + 'x';
  if (b !== 0 || !s) s += s ? `${b < 0 ? '-' : '+'}${Math.abs(b)}` : String(b);
  return 'y=' + s;
}
/** the right side with x substituted: 2(-2)-3, (-2)+3, 3+2, -(2)+5. wrap colours the value. */
function subTex(m, b, x, wrap = (s) => s) {
  const v = wrap(x), xs = m === 1 ? (x < 0 ? `(${v})` : v) : `(${v})`;
  let s = (m === 1 ? '' : m === -1 ? '-' : String(m)) + xs;
  if (b) s += `${b < 0 ? '-' : '+'}${Math.abs(b)}`;
  return s;
}
/** the middle step (the product worked out), or '' when there is nothing to show */
function midTex(m, b, x) {
  if (m === 1 || !b) return '';
  const p = m * x; return `${p}${b < 0 ? '-' : '+'}${Math.abs(b)}`;
}
/** y = 2(-2)-3 = -4-3 = -7 (the answer bold) */
function subLine(m, b, x, wrap) {
  const mid = midTex(m, b, x), y = m * x + b;
  return `y=${subTex(m, b, x, wrap)}${mid ? '=' + mid : ''}=\\boldsymbol{${y}}`;
}

/** a graph with equal x and y scales that fits in maxW × maxH (from the Math 15 u6l6 page) */
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
const BIG = { xmin: -6, xmax: 6, ymin: -8, ymax: 8, xlabels: 2, ylabels: 2 }; // the booklet's grid

/** position of el inside stage, in stage px (the stage may be scaled to fit beside the sidebar) */
function relPos(stage, el) {
  const s = stage.getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / (stage.offsetWidth || s.width) || 1;
  return [(r.left - s.left) / k, (r.top - s.top) / k, r.width / k, r.height / k];
}
/** a coloured number flies from one element to another, then the target appears */
async function fly(c, stage, html, fromEl, toEl, cls) {
  const [fx, fy, fw, fh] = relPos(stage, fromEl), [tx, ty, tw, th] = relPos(stage, toEl);
  const chip = add(stage, h('div', 'u7l1-fly ' + cls, html), 0, 0);
  const cw = chip.offsetWidth, ch = chip.offsetHeight;
  const x0 = fx + fw / 2 - cw / 2, y0 = fy + fh / 2 - ch / 2, x1 = tx + tw / 2 - cw / 2, y1 = ty + th / 2 - ch / 2;
  chip.style.left = x0 + 'px'; chip.style.top = y0 + 'px';
  await anim(c, chip, [{ transform: 'translate(0, 0) scale(1)' }, { transform: `translate(${(x1 - x0) / 2}px, ${(y1 - y0) / 2 - 40}px) scale(1.25)`, offset: 0.5 }, { transform: `translate(${x1 - x0}px, ${y1 - y0}px) scale(1)` }], 750);
  chip.remove(); toEl.style.opacity = 1;
}

/* =============================== warm-up: which rule made this? =============================== */
const CARDS = [{ k: 'A', ys: [2, 5, 8, 11, 14] }, { k: 'B', ys: [2, 3, 6, 11, 18] }, { k: 'C', ys: [8, 6, 4, 2, 0], q: 4 }];
function mountCards() {
  const host = document.getElementById('u7l1-cards'); if (!host) return;
  CARDS.forEach((cd) => {
    const card = h('div', 'u7l1-card');
    card.innerHTML = `<div class="u7l1-card-h"><span class="u7l1-ball">${cd.k}</span><i>pattern card</i></div>`;
    const tb = h('div', 'u7l1-ctab');
    tb.innerHTML = `<div class="u7l1-cth">${T('x')}</div><div class="u7l1-cth">${T('y')}</div><div></div>` +
      cd.ys.map((y, i) => `<div>${T(i)}</div><div>${cd.q === i ? `<span data-reveal="?"><b>${T(y)}</b></span>` : T(y)}</div><div class="u7l1-cd">${i ? `<span class="u7l1-step">${(y - cd.ys[i - 1] > 0 ? '+' : '−') + Math.abs(y - cd.ys[i - 1])}</span>` : ''}</div>`).join('');
    card.appendChild(tb); host.appendChild(card);
  });
  // the steps between rows (hidden until "Show the steps")
  let onS = false;
  const bS = document.getElementById('u7l1-wsteps');
  bS.addEventListener('click', () => { onS = !onS; host.classList.toggle('u7l1-steps-on', onS); bS.textContent = onS ? 'Hide the steps' : 'Show the steps'; });
  // plot A and B on one grid (an overlay on the cards, built on the first press so it gets the cards' real size)
  const ov = h('div', 'u7l1-wplot'); host.appendChild(ov); ov.style.display = 'none';
  let G, lnA, crB, pA, pB, lA, lB;
  const build = () => {
    const W = host.offsetWidth || 440, H = host.offsetHeight || 262;
    G = new Graph(ov, { width: W, height: H, xmin: 0, xmax: 5, ymin: 0, ymax: 20, ystep: 2, ylabels: 4, origin: true, fontSize: 15 });
    lnA = G.fn((x) => 3 * x + 2, { color: LINE, width: 3, from: 0, to: 4.6, dash: true });
    crB = G.fn((x) => x * x + 2, { color: RED, width: 3, from: 0, to: 4.2, dash: true });
    pA = CARDS[0].ys.map((y, x) => G.point(x, y, { color: LINE, r: 6 }));
    pB = CARDS[1].ys.map((y, x) => G.point(x, y, { color: RED, r: 6 }));
    lA = G.label(4.5, 9, '<b>A</b>: straight', { pos: 'c', cls: 'u7l1-wpl', color: LINE });
    lB = G.label(2.3, 15, '<b>B</b>: bends', { pos: 'c', cls: 'u7l1-wpl', color: RED });
  };
  let onP = false;
  const bP = document.getElementById('u7l1-wplot');
  bP.addEventListener('click', async () => {
    onP = !onP; bP.textContent = onP ? 'Back to the cards' : 'Plot A and B';
    ov.style.display = onP ? '' : 'none'; if (!onP) return;
    if (!G) build();
    const c = liveCtx(); [lnA, crB, lA, lB, ...pA, ...pB].forEach(hide);
    for (let i = 0; i < 5; i++) { await Promise.all([pop(c, pA[i], 260), pop(c, pB[i], 260)]); }
    lnA.style.opacity = crB.style.opacity = 1;
    await Promise.all([G.drawIn(lnA, 700, c), G.drawIn(crB, 700, c)]); await Promise.all([fadeIn(c, lA), fadeIn(c, lB)]);
  });
}

/* =============================== Example 1: sort tiles (from Math 10C u7l1) =============================== */
function mountSort() {
  const root = document.getElementById('u7l1-sort'); if (!root) return;
  const pool = root.querySelector('[data-bin="pool"]'), lin = root.querySelector('[data-bin="lin"]'), non = root.querySelector('[data-bin="non"]');
  const tiles = [...root.querySelectorAll('.u7l1-tile')];
  const order = (bin) => [...bin.children].sort((a, b) => a.dataset.k.localeCompare(b.dataset.k)).forEach((t) => bin.appendChild(t));
  tiles.forEach((t) => t.addEventListener('click', () => {
    const where = t.parentNode === pool ? lin : t.parentNode === lin ? non : pool;
    t.classList.remove('u7l1-ok', 'u7l1-no'); where.appendChild(t); order(where);
  }));
  document.getElementById('u7l1-sortchk').addEventListener('click', () => tiles.forEach((t) => {
    t.classList.remove('u7l1-ok', 'u7l1-no');
    if (t.parentNode === pool) return;
    const ok = (t.parentNode === lin) === (t.dataset.lin === '1'); t.classList.add(ok ? 'u7l1-ok' : 'u7l1-no');
  }));
  document.getElementById('u7l1-sortreset').addEventListener('click', () => { tiles.forEach((t) => { t.classList.remove('u7l1-ok', 'u7l1-no'); pool.appendChild(t); }); order(pool); });
}

/* =============================== static figures =============================== */
function mountFigures() {
  // Examples 3 and 4 (b): a grid to tap points on; the part's Answer draws the booklet's answer on the same grid
  [['u7l1-ex3g', 1, -1, 'y=x-1', [-3.6, 6], 'nw'], ['u7l1-ex4g', -2, 3, 'y=-2x+3', [-3.4, -5], 'c']].forEach(([id, m, b, eq, lp]) => {
    const el = document.getElementById(id); if (!el) return;
    const G = sqGraph(el, BIG, 400, 520, { g: { fontSize: 15, interactive: { snap: 1, color: 'blue' } } });
    const part = el.closest('.part'); let ans = null;
    const sync = () => {
      const on = part.classList.contains('shown');
      if (on && !ans) {
        ans = [G.line({ m, b }, { color: RED, width: 3.5 }), ...[-2, -1, 0, 1, 2].map((x) => G.point(x, m * x + b, { color: RED, r: 5.5 })), G.label(lp[0], lp[1], T(eq), { cls: 'bk-ptlab u7l1-glab', color: RED })];
      } else if (!on && ans) { G.remove(...ans); ans = null; }
    };
    new MutationObserver(sync).observe(part, { attributes: true, attributeFilter: ['class'] }); sync();
  });
}

/* =============================== try it: on the line or not? =============================== */
const TRY = [[1, -1], [-2, 3], [2, -3], [3, -4]]; // (not y = 3x + 2: the assignment asks for a point on it)
function mountTry() {
  const host = document.getElementById('u7l1-tryg'); if (!host) return;
  const G = sqGraph(host, BIG, 400, 530, { g: { fontSize: 15 } });
  G.el.setAttribute('data-tap', ''); G.el.classList.add('u7l1-tapg');
  const btns = document.getElementById('u7l1-trybtns'), ro = document.getElementById('u7l1-tryro');
  let cur = 0, ln = null, shown = false, dots = [], probe = null;
  const lineBtn = h('button', 'pill small u7l1-showln', 'Show the line'); lineBtn.type = 'button';
  const clr = h('button', 'pill small', 'Clear the dots'); clr.type = 'button';
  const eqBtns = TRY.map(([m, b], i) => { const bt = h('button', 'pill small u7l1-eqbtn', T(eqTex(m, b))); bt.type = 'button'; bt.onclick = () => pick(i); return bt; });
  const r1 = h('div', 'u7l1-tryrow'); eqBtns.forEach((b) => r1.appendChild(b));
  const r2 = h('div', 'u7l1-tryrow'); r2.append(lineBtn, clr);
  btns.append(r1, r2);
  const blank = () => { ro.innerHTML = `<div class="u7l1-ro-eq">${T(eqTex(...TRY[cur]))}</div><div class="u7l1-ro-hint">Tap a grid point to test it.</div>`; };
  const drawLine = () => { if (ln) G.remove(ln); ln = shown ? G.line({ m: TRY[cur][0], b: TRY[cur][1] }, { color: LINE, width: 3.5 }) : null; };
  const clearDots = () => { G.remove(...dots); dots = []; if (probe) { G.remove(probe); probe = null; } };
  function pick(i) { cur = i; eqBtns.forEach((b, j) => b.classList.toggle('on', j === i)); clearDots(); drawLine(); blank(); }
  lineBtn.onclick = () => { shown = !shown; lineBtn.textContent = shown ? 'Hide the line' : 'Show the line'; drawLine(); };
  clr.onclick = () => { clearDots(); blank(); };
  G.svg.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return; e.preventDefault();
    const [x0, y0] = G.fromEvent(e), x = Math.round(x0), y = Math.round(y0);
    if (!G.inside(x, y)) return;
    const [m, b] = TRY[cur], v = m * x + b, ok = v === y;
    if (probe) { G.remove(probe); probe = null; }
    dots.push(G.point(x, y, { color: ok ? GRN : RED, r: 7 }));
    if (!ok && G.inside(x, v)) probe = G.point(x, v, { color: LINE, r: 5, open: true });
    ro.innerHTML = `<div class="u7l1-ro-eq">${T(eqTex(m, b))}</div>
      <div class="u7l1-ro-l">Point ${T(`(${cX(x)},\\ ${cY(y)})`)}</div>
      <div class="u7l1-ro-l">${T(`${cY(y)}\\overset{?}{=}${subTex(m, b, x, cX)}`)}</div>
      <div class="u7l1-ro-l">${T(`${cY(y)}\\overset{?}{=}${v}`)}</div>
      <div class="u7l1-ro-v ${ok ? 'ok' : 'no'}">${ok ? '✓ True: the point is <b>on</b> the line' : `✗ False: <b>not</b> on the line.<span class="u7l1-ro-s">At ${T('x=' + x)}, the line is at ${T('y=' + v)}.</span>`}</div>`;
  });
  pick(0);
}

/* =============================== explainer: linear or not? (from Math 10C u7l1) =============================== */
const LT = {
  breaks: { label: 'Five ways to bend a line', items: [
    { k: T('x^2'), tex: `y=x^{${cR('2')}}`, f: (x) => x * x, lin: false, why: `${T('x')} is <b>squared</b>: the graph bends` },
    { k: T('\\sqrt{x}'), tex: `y=\\sqrt{${cR('x')}}`, f: (x) => Math.sqrt(x), from: 0, lin: false, why: `${T('x')} is <b>under a root</b>` },
    { k: T('\\tfrac{4}{x}'), tex: `y=\\dfrac{4}{${cR('x')}}`, f: (x) => 4 / x, breaks: [0], lin: false, why: `${T('x')} is <b>in a denominator</b>` },
    { k: T('2^x'), tex: `y=2^{${cR('x')}}`, f: (x) => 2 ** x, lin: false, why: `${T('x')} is an <b>exponent</b>` },
    { k: T('xy'), tex: `${cR('x')}y=4`, f: (x) => 4 / x, breaks: [0], lin: false, why: `${T('x')} is <b>times another variable</b>` },
    { k: T('2x-1'), tex: 'y=2x-1', f: (x) => 2 * x - 1, lin: true, why: `${T('x')} to the first power, times a number, plus a number` }] },
  ex1: { label: 'Example 1 check', ex: true, items: [
    { k: '(a)', tex: 'y=4x-1', f: (x) => 4 * x - 1, lin: true, why: `${T('x')} to the first power only` },
    { k: '(b)', tex: `y=x^{${cR('2')}}+2`, f: (x) => x * x + 2, lin: false, why: `${T('x')} is <b>squared</b>` },
    { k: '(c)', tex: 'y=-x+5', f: (x) => -x + 5, lin: true, why: `${T('x')} to the first power (${T('-x')} is ${T('-1')} times ${T('x')})` },
    { k: '(d)', tex: `y=x^{${cR('3')}}`, f: (x) => x ** 3, lin: false, why: `${T('x')} is <b>cubed</b>` },
    { k: '(e)', tex: 'y=6', f: () => 6, lin: true, why: `no ${T('x')} at all: every point has height 6, a <b>flat</b> line` },
    { k: '(f)', tex: `y=\\dfrac{2}{${cR('x')}}`, f: (x) => 2 / x, breaks: [0], lin: false, why: `${T('x')} is <b>in a denominator</b>` },
    { k: '(g)', tex: 'y=-3x', f: (x) => -3 * x, lin: true, why: `${T('x')} to the first power, times ${T('-3')}` },
    { k: '(h)', tex: `y=2^{${cR('x')}}`, f: (x) => 2 ** x, lin: false, why: `${T('x')} is an <b>exponent</b>` }] }
};
const linTest = {
  title: 'Is it a straight line?',
  height: 470,
  minW: 900,
  choices: Object.keys(LT).map((k) => ({ v: k, label: LT[k].label })),
  intro: 'Look at what happens to <b>x</b> in each equation, then check with the graph. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = LT[k], items = d.items;
    const P = panel(stage, 14, 14, 430, 440, d.ex ? 'Example 1' : 'What happens to x?');
    const eq = h('div', 'u7l1-lt-eq', '&nbsp;'); P.appendChild(eq);
    const why = h('div', 'u7l1-lt-why'); P.appendChild(why);
    const verdict = h('div', 'u7l1-verdict'); P.appendChild(verdict); hide(verdict);
    const bins = h('div', 'u7l1-bins'); P.appendChild(bins);
    bins.innerHTML = '<div class="u7l1-xbin u7l1-xbin-lin"><div class="u7l1-xbin-h">LINEAR</div><div class="u7l1-xbin-b"></div></div><div class="u7l1-xbin u7l1-xbin-non"><div class="u7l1-xbin-h">NON-LINEAR</div><div class="u7l1-xbin-b"></div></div>';
    const [bLin, bNon] = bins.querySelectorAll('.u7l1-xbin-b');
    const GW = Math.min(440, ex.W - 474);
    const G = new Graph(stage, { x: 460, y: 14, width: GW, height: 440, xmin: -5, xmax: 5, ymin: -10, ymax: 10, ystep: 2, xlabels: 1, ylabels: 2 });
    let cur = null;
    const steps = items.map((it) => ({
      cap: `${d.ex ? it.k + ' ' : ''}${T(it.tex.replace(/\\textcolor\{[^}]*\}\{([^}]*)\}/g, '$1'))}: ${it.why}. <b>${it.lin ? 'Linear' : 'Non-linear'}.</b>`,
      run: async (c) => {
        if (cur) G.remove(cur);
        eq.innerHTML = T(it.tex); await pop(c, eq, 300);
        why.innerHTML = it.why;
        cur = G.fn(it.f, { color: it.lin ? LINE : RED, width: 4.5, breaks: it.breaks, from: it.from });
        await G.drawIn(cur, 800, c);
        verdict.className = 'u7l1-verdict ' + (it.lin ? 'u7l1-v-lin' : 'u7l1-v-non');
        verdict.textContent = it.lin ? 'straight line: LINEAR' : 'curve: NON-LINEAR';
        await pop(c, verdict, 300);
        const chip = h('span', 'u7l1-xchip', it.k); (it.lin ? bLin : bNon).appendChild(chip); await pop(c, chip, 300);
      }
    }));
    const lins = items.filter((it) => it.lin);
    steps.push({
      cap: d.ex ? 'Sorted. LINEAR: (a), (c), (e), (g). NON-LINEAR: (b), (d), (f), (h). All four linear ones graph as <b>straight lines</b>.'
        : `Only ${T('x')} to the <b>first power</b>, times a number, plus a number, keeps the graph <b>straight</b>.`,
      run: async (c) => {
        if (cur) G.remove(cur); cur = null;
        hide(verdict); eq.innerHTML = d.ex ? 'the four linear ones' : T('y=2x-1'); why.innerHTML = `${T('x')} to the first power only`;
        for (const it of lins) await G.drawIn(G.fn(it.f, { color: LINE, width: 3.5 }), 400, c);
      }
    });
    return steps;
  }
};

/* =============================== explainer: same step, straight line =============================== */
const ST = {
  ab: { label: 'Warm-up cards A and B', win: { xmin: -1, xmax: 5, ymin: -2, ymax: 20, ystep: 2, ylabels: 4 },
    cards: [{ k: 'Card A', rule: 'y=3x+2', f: (x) => 3 * x + 2, lin: true, col: LINE }, { k: 'Card B', rule: 'y=x^2+2', f: (x) => x * x + 2, lin: false, col: RED }],
    end: `Same step every time ⇒ <b>straight line</b> (A). Steps that keep growing ⇒ a <b>curve</b> (B). B’s rule has ${T('x^2')}: it is the imposter.`,
    short: `Same step ⇒ <b>straight line</b> (A).<br>Growing steps ⇒ a <b>curve</b> (B): the imposter.` },
  c: { label: 'Card C and the spare rule', win: { xmin: -1, xmax: 5, ymin: -2, ymax: 12, ystep: 1, ylabels: 2 },
    cards: [{ k: 'Card C', rule: 'y=-2x+8', f: (x) => -2 * x + 8, lin: true, col: LINE }, { k: 'Spare rule', rule: 'y=2x+3', f: (x) => 2 * x + 3, lin: true, col: GRN }],
    end: `Both have a constant step, so both are straight. A <b>negative</b> step (${T('-2')}) makes the line go <b>down</b>. The step is the number in front of ${T('x')}: a first peek at <b>slope</b>.`,
    short: `Same step ⇒ <b>straight line</b>, both times.<br>Step ${T('-2')}: down. Step ${T('+2')}: up.` }
};
const steps = {
  title: 'Same step every time = straight line',
  height: 470,
  minW: 900,
  choices: Object.keys(ST).map((k) => ({ v: k, label: ST[k].label })),
  intro: 'Look at how much <b>y</b> changes from one row to the next. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = ST[k], xs = [0, 1, 2, 3, 4];
    const G = new Graph(stage, Object.assign({ x: 470, y: 14, width: ex.W - 484, height: 440, origin: true, fontSize: 16 }, d.win));
    const verdict = panel(stage, 14, 352, 440, 104, ''); hide(verdict);
    const S = [];
    d.cards.forEach((cd, i) => {
      const x0 = 14 + i * 228, ys = xs.map(cd.f);
      const head = add(stage, h('div', 'u7l1-sthead', `<b>${cd.k}</b>`), x0, 8); head.style.color = cd.col;
      const rule = add(stage, h('div', 'u7l1-strule', T(cd.rule)), x0, 316); hide(rule); rule.style.color = cd.col;
      const tb = new ValueTable(stage, { x: x0, y: 42, rows: xs.map((x, j) => [x, ys[j]]), tap: false, cellW: 64, cellH: 44, diffs: true, diffSpace: 74 });
      const diffs = ys.slice(1).map((y, j) => y - ys[j]);
      const same = diffs.every((v) => v === diffs[0]);
      const txt = same ? `${(diffs[0] > 0 ? '+' : '−') + Math.abs(diffs[0])} every time` : diffs.map((v) => '+' + v).join(', ');
      S.push({
        cap: `<b>${cd.k}:</b> ${T('x')} goes up by 1 each row, and ${T('y')} changes by <b>${txt}</b>${same ? '' : ': the step keeps <b>growing</b>'}.`,
        run: async (c) => { await tb.diffs(c, { color: same ? cd.col : RED }); }
      });
      S.push({
        cap: same ? `Plot ${cd.k}’s points: every step is right 1, ${diffs[0] > 0 ? 'up' : 'down'} ${Math.abs(diffs[0])}, so they <b>line up</b>. Its rule is ${T(cd.rule)}.`
          : `Plot ${cd.k}’s points: the steps get bigger, so the points <b>bend</b>. No straight line goes through them all. Its rule is ${T(cd.rule)}.`,
        run: async (c) => {
          const pts = xs.map((x, j) => G.point(x, ys[j], { color: cd.col, r: 6.5 }));
          for (const p of pts) await pop(c, p, 200);
          const cv = cd.lin ? G.line({ m: (ys[1] - ys[0]), b: ys[0] }, { color: cd.col, width: 3.5 }) : G.fn(cd.f, { color: cd.col, width: 3.5, dash: true, from: 0, to: 4.3 });
          await G.drawIn(cv, 700, c); await show(c, rule);
        }
      });
    });
    S.push({ cap: d.end, run: async (c) => { verdict.innerHTML = `<div class="u7l1-line">${d.short}</div>`; await show(c, verdict); } });
    return S;
  }
};

/* =============================== explainer: build a table of values =============================== */
const BT = {
  notes: { label: `${T('y=x+3')} (notes)`, m: 1, b: 3 },
  ex2: { label: 'Example 2 check', m: 2, b: -3 }
};
const buildTable = {
  title: 'Substitute each x, get its y',
  height: 430,
  minW: 900,
  choices: Object.keys(BT).map((k) => ({ v: k, label: BT[k].label })),
  intro: (k) => `Build a table of values for ${T(eqTex(BT[k].m, BT[k].b))}.`,
  make(stage, k, ex) {
    const { m, b } = BT[k], xs = [-2, -1, 0, 1, 2], ys = xs.map((x) => m * x + b);
    const eqb = add(stage, box(h('div', 'u7l1-eqbox', T(eqTex(m, b).replace('x', cX('x')))), 420, 70), 14, 10);
    const work = xs.map((x, i) => hide(add(stage, h('div', 'u7l1-work', T(`${cX('x=' + x)}:\\ \\ ${subLine(m, b, x, cX).replace(/\\boldsymbol\{([^}]*)\}/, (s, v) => cY('\\boldsymbol{' + v + '}'))}`)), 20, 100 + i * 62)));
    const tb = new ValueTable(stage, { x: 476, y: 14, layout: 'h', rows: xs.map((x, i) => [x, ys[i]]), hide: 1, tap: false, cellW: 72, cellH: 52, headW: 56 });
    tb.heads[0].style.color = XC; tb.heads[1].style.color = YC;
    const P = panel(stage, 476, 150, ex.W - 490, 266, 'Ordered pairs'); hide(P);
    const pairs = h('div', 'u7l1-pairs'); P.appendChild(pairs);
    const S = [{
      cap: `Every ${T('x')} in the equation is a <b>slot</b>. Each ${T('x')}-value goes into the slot <b>in brackets</b>.`,
      run: async (c) => { eqb.innerHTML = T(`y=${m === 1 ? '' : m === -1 ? '-' : m}(\\,${cX('\\square')}\\,)${b ? (b < 0 ? '-' : '+') + Math.abs(b) : ''}`); await pulse(c, eqb, 1.08); }
    }];
    xs.forEach((x, i) => {
      const mid = midTex(m, b, x);
      S.push({
        cap: `${T(cX('x=' + x))}: ${T('y=' + subTex(m, b, x, cX))}${mid ? ` ${T('=' + mid)}` : ''} ${T('=' + ys[i])}.${i === 0 && x < 0 ? ' The brackets keep the negative with the number.' : ''}`,
        run: async (c) => { tb.highlight(i, true); await show(c, work[i]); await tb.reveal(i, 1, c); await sleep(c, 150); tb.highlight(i, false); }
      });
    });
    S.push({
      cap: `Each column is an <b>ordered pair</b>: ${xs.map((x, i) => T(P2(x, ys[i]))).join(', ')}. Ready to plot.`,
      run: async (c) => { await show(c, P); for (let i = 0; i < xs.length; i++) await pop(c, add(pairs, h('span', 'u7l1-pr', T(`(${cX(xs[i])},\\ ${cY(ys[i])})`)), null), 220); }
    });
    return S;
  }
};

/* =============================== explainer: table → points → line =============================== */
const PL = {
  notes: { label: `${T('y=x+3')} (notes)`, m: 1, b: 3 },
  ex3: { label: 'Example 3 check', m: 1, b: -1 },
  ex4: { label: 'Example 4 check', m: -2, b: 3 }
};
const FLOW = ['Pick x-values', 'Substitute', 'Plot the pairs', 'Join and extend'];
const plotLine = {
  title: 'From a table to a line',
  height: 480,
  minW: 900,
  choices: Object.keys(PL).map((k) => ({ v: k, label: PL[k].label })),
  intro: (k) => `Graph ${T(eqTex(PL[k].m, PL[k].b))} in four steps.`,
  make(stage, k, ex) {
    const { m, b } = PL[k], xs = [-2, -1, 0, 1, 2], ys = xs.map((x) => m * x + b);
    const G = sqGraph(stage, BIG, 380, 466, { x: 10, y: 6, g: { fontSize: 15 } });
    const RX = 420;
    add(stage, h('div', 'u7l1-pleq', T(eqTex(m, b))), RX, 8);
    const tb = new ValueTable(stage, { x: RX, y: 58, layout: 'h', rows: xs.map((x, i) => [x, ys[i]]), hide: 1, tap: false, cellW: 68, cellH: 48, headW: 52 });
    tb.heads[0].style.color = XC; tb.heads[1].style.color = YC;
    const fl = add(stage, h('div', 'u7l1-flowl'), RX, 178);
    const fItems = FLOW.map((t, i) => { const d = h('div', 'u7l1-fli', `<span class="u7l1-f4n">${i + 1}</span>${t}`); fl.appendChild(d); return d; });
    const lit = (...ix) => fItems.forEach((d, i) => d.classList.toggle('on', ix.includes(i)));
    const note = add(stage, box(h('div', 'u7l1-plnote'), ex.W - RX - 14, 96), RX, 372); hide(note);
    // an extra lattice point on the line, off the table
    const xe = [4, -4, 3, -3, 5, -5].find((x) => Math.abs(m * x + b) <= 7), ye = m * xe + b;
    const pts = [];
    const plotOne = async (c, i, slow) => {
      const x = xs[i], y = ys[i]; tb.highlight(i, true);
      if (slow) {
        const a = x ? G.segment([0, 0], [x, 0], { color: XC, width: 5 }) : null, v = y ? G.segment([x, 0], [x, y], { color: YC, width: 5 }) : null;
        if (a) await G.drawIn(a, 450, c); if (v) await G.drawIn(v, 500, c);
        const p = G.point(x, y, { color: PTC, r: 7, coords: true, pos: x < 0 ? 'nw' : 'se', labelColor: 'ink' }); pts.push(p); await G.reveal(p, c);
        await sleep(c, 300); if (a) G.remove(a); if (v) G.remove(v);
      } else { const p = G.point(x, y, { color: PTC, r: 7 }); pts.push(p); await G.reveal(p, c); }
      tb.highlight(i, false);
    };
    const x0 = xs[0], y0 = ys[0];
    return [
      { cap: `<b>Steps 1 and 2.</b> Pick ${T('x=-2,\\ -1,\\ 0,\\ 1,\\ 2')} and substitute each one: ${T('y=' + ys.join(',\\ '))}.`,
        run: async (c) => { lit(0, 1); await tb.fill(c, { stagger: 120 }); } },
      { cap: `<b>Step 3.</b> The first column is ${T(P2(x0, y0))}: ${x0 < 0 ? 'left' : 'right'} ${Math.abs(x0)} along the ${T('x')}-axis, then ${y0 < 0 ? 'down' : 'up'} ${Math.abs(y0)}.`,
        run: async (c) => { lit(2); await plotOne(c, 0, true); } },
      { cap: `Plot the other columns the same way: ${xs.slice(1).map((x, i) => T(P2(x, ys[i + 1]))).join(', ')}.`,
        run: async (c) => { lit(2); for (let i = 1; i < 5; i++) await plotOne(c, i, false); } },
      { cap: `<b>Step 4.</b> The points <b>line up</b>. Lay a ruler along them and join them.`,
        run: async (c) => { lit(3); await G.drawIn(G.segment([xs[0], ys[0]], [xs[4], ys[4]], { color: LINE, width: 4 }), 700, c); } },
      { cap: `Don’t stop at the last point: extend the line to the <b>edges of the grid</b> in both directions, with arrows. The line keeps going.`,
        run: async (c) => { lit(3); await G.drawIn(G.line({ m, b }, { color: LINE, width: 4 }), 800, c); } },
      { cap: `Every point on the line fits the equation, not just the five: ${T(P2(xe, ye))} is on it, and ${T(`${ye}=${subTex(m, b, xe)}`)} ✓.`,
        run: async (c) => {
          const p = G.point(xe, ye, { color: GRN, r: 8, coords: true, pos: xe < 0 ? 'ne' : 'nw', labelColor: GRN }); await G.reveal(p, c);
          note.innerHTML = `<b>Check</b> ${T(P2(xe, ye))}: ${T(`${cY(ye)}\\overset{?}{=}${subTex(m, b, xe, cX)}=${ye}`)} ✓`; await show(c, note);
        } }
    ];
  }
};

/* =============================== explainer: one point off the line =============================== */
const FX = {
  sign: { label: 'A sign slip', m: -2, b: 3, i: 0, wrongY: -1 },
  swap: { label: 'A plotting slip', m: 2, b: -3, i: 1, swap: true }
};
const fixIt = {
  title: 'One point off the line? Check it again',
  height: 480,
  minW: 900,
  choices: Object.keys(FX).map((k) => ({ v: k, label: FX[k].label })),
  intro: (k) => `A student graphed ${T(eqTex(FX[k].m, FX[k].b))}. Something went wrong.`,
  make(stage, k, ex) {
    const d = FX[k], { m, b } = d, xs = [-2, -1, 0, 1, 2], ys = xs.map((x) => m * x + b), bad = d.i;
    const tys = ys.slice(); if (d.wrongY != null) tys[bad] = d.wrongY;           // what the student wrote in the table
    const plotted = xs.map((x, i) => [x, tys[i]]); if (d.swap) plotted[bad] = [ys[bad], xs[bad]]; // where the student plotted
    const G = sqGraph(stage, BIG, 380, 466, { x: 10, y: 6, g: { fontSize: 15 } });
    const RX = 420;
    add(stage, h('div', 'u7l1-pleq', `The student’s table for ${T(eqTex(m, b))}`), RX, 8);
    const tb = new ValueTable(stage, { x: RX, y: 54, layout: 'h', rows: xs.map((x, i) => [x, tys[i]]), tap: false, cellW: 68, cellH: 48, headW: 52 });
    tb.heads[0].style.color = XC; tb.heads[1].style.color = YC;
    const P = panel(stage, RX, 172, ex.W - RX - 14, 294, ''); hide(P);
    const [bx, by] = plotted[bad];
    const good = plotted.filter((p, i) => i !== bad);
    let badPt, ring;
    const S = [
      { cap: `Plot the five pairs from the table.`,
        run: async (c) => { for (let i = 0; i < 5; i++) { const p = G.point(plotted[i][0], plotted[i][1], { color: PTC, r: 7 }); if (i === bad) badPt = p; await pop(c, p, 220); } } },
      { cap: `Four points line up. ${T(P2(bx, by))} doesn’t. Points from a linear equation <b>always</b> line up, so that point has a mistake.`,
        run: async (c) => {
          const [a, z] = [good[0], good[good.length - 1]], mm = (z[1] - a[1]) / (z[0] - a[0]);
          await G.drawIn(G.line({ m: mm, b: a[1] - mm * a[0] }, { color: '#9aa0ab', width: 3, dash: true }), 600, c);
          badPt.querySelector('circle').setAttribute('fill', RED);
          ring = G.point(bx, by, { color: RED, r: 15, open: true }); ring.querySelector('circle').style.fill = 'none'; await pop(c, ring, 300);
        } }
    ];
    if (!d.swap) {
      const x = xs[bad], wrongP = -m * x;
      S.push({ cap: `Re-check the arithmetic for ${T('x=' + x)}: ${T(`${m}(${x})`)} is ${T('+' + m * x)}, not ${T(String(wrongP))}. A negative times a negative is <b>positive</b>.`,
        run: async (c) => {
          tb.highlight(bad, true);
          P.innerHTML = `<div class="u7l1-ph">Re-check ${T('x=' + x)}</div>
            <div class="u7l1-line u7l1-wrong">${T(`y=${m}(${x})+${b}=${wrongP}+${b}=${d.wrongY}`)} ✗</div>
            <div class="u7l1-line">${T(`${m}(${x})=${cR('+' + m * x)}`)}<span class="u7l1-soft"> (negative × negative)</span></div>
            <div class="u7l1-line u7l1-right">${T(`y=${subTex(m, b, x)}=${midTex(m, b, x)}=\\boldsymbol{${ys[bad]}}`)} ✓</div>`;
          await show(c, P);
        } });
      S.push({ cap: `Fix the table: ${T(`y=${ys[bad]}`)}. Move the point to ${T(P2(x, ys[bad]))}. Now all five line up: draw the line.`,
        run: async (c) => {
          await tb.set(bad, 1, ys[bad], c); tb.highlight(bad, false); G.remove(ring);
          badPt.querySelector('circle').setAttribute('fill', GRN); await G.move(c, badPt, x, ys[bad], 700);
          await G.drawIn(G.line({ m, b }, { color: LINE, width: 4 }), 800, c);
        } });
    } else {
      const x = xs[bad], y = ys[bad];
      S.push({ cap: `The table is right: ${T(P2(x, y))}. Re-check the <b>plotting</b>: across first by ${T('x')}, then up or down by ${T('y')}. The student swapped them and plotted ${T(P2(bx, by))}.`,
        run: async (c) => {
          tb.highlight(bad, true);
          P.innerHTML = `<div class="u7l1-ph">Re-check the plotting</div>
            <div class="u7l1-line">The pair is ${T(`(${cX(x)},\\ ${cY(y)})`)}.</div>
            <div class="u7l1-line u7l1-wrong">Plotted at ${T(P2(bx, by))} ✗</div>
            <div class="u7l1-line u7l1-right">${T('x')} first: ${x < 0 ? 'left' : 'right'} ${Math.abs(x)}, then ${y < 0 ? 'down' : 'up'} ${Math.abs(y)} ✓</div>`;
          await show(c, P);
          const a = G.segment([0, 0], [x, 0], { color: XC, width: 5 }), v = G.segment([x, 0], [x, y], { color: YC, width: 5 });
          await G.drawIn(a, 400, c); await G.drawIn(v, 500, c);
        } });
      S.push({ cap: `Move the point to ${T(P2(x, y))}. Now all five line up: draw the line.`,
        run: async (c) => {
          tb.highlight(bad, false); G.remove(ring); badPt.querySelector('circle').setAttribute('fill', GRN); await G.move(c, badPt, x, y, 800);
          await G.drawIn(G.line({ m, b }, { color: LINE, width: 4 }), 800, c);
        } });
    }
    return S;
  }
};

/* =============================== explainer: is the point on the line? =============================== */
const OL = {
  a: { label: 'Example 5 (a) check', m: 1, b: 2, p: [3, 5] },
  b: { label: '(b) check', m: 3, b: 4, p: [-2, 1] },
  c: { label: '(c) check', m: -2, b: -7, p: [-4, 1] }
};
const onLine = {
  title: 'Substitute both coordinates: true or false?',
  height: 470,
  minW: 900,
  choices: Object.keys(OL).map((k) => ({ v: k, label: OL[k].label })),
  intro: (k) => `Does ${T(P2(...OL[k].p))} lie on ${T(eqTex(OL[k].m, OL[k].b))}?`,
  make(stage, k, ex) {
    const { m, b, p: [px, py] } = OL[k], v = m * px + b, ok = v === py;
    const RX = 440, RW = ex.W - RX - 14;
    const ptab = add(stage, h('div', 'u7l1-olpt', `Point ${T('(')}<span class="u7l1-olx">${T(cX(px))}</span>${T(',\\ ')}<span class="u7l1-oly">${T(cY(py))}</span>${T(')')}`), 14, 14);
    const fromX = ptab.querySelector('.u7l1-olx'), fromY = ptab.querySelector('.u7l1-oly');
    const tags = add(stage, h('div', 'u7l1-oltags', `<span style="color:${XC}">${T('x=' + px)}</span><span style="color:${YC}">${T('y=' + py)}</span>`), 14, 76); hide(tags);
    // the equation, then the substituted line with two slots
    const eqL = add(stage, h('div', 'u7l1-oleq', T(eqTex(m, b).replace(/x/, cX('x')).replace(/^y/, cY('y')))), 14, 140);
    const xIn = m === 1 ? (px < 0 ? `(${cX(px)})` : cX(px)) : `(${cX(px)})`;
    const rhsHTML = (m === 1 ? '' : T(m === -1 ? '-' : String(m))) + (xIn.startsWith('(') ? T('(') : '') + `<span class="u7l1-slot">${T(cX(px))}</span>` + (xIn.startsWith('(') ? T(')') : '') + (b ? T(`{}${b < 0 ? '-' : '+'}${Math.abs(b)}`) : '');
    const subL = add(stage, h('div', 'u7l1-oleq', `<span class="u7l1-slot">${T(cY(py))}</span>${T('{}\\overset{?}{=}{}')}${rhsHTML}`), 14, 214); hide(subL);
    const [slotY, slotX] = subL.querySelectorAll('.u7l1-slot');
    const mid = midTex(m, b, px);
    const simL = add(stage, h('div', 'u7l1-oleq', T(`${cY(py)}\\overset{?}{=}${mid ? mid + '=' : ''}${v}`)), 14, 288); hide(simL);
    const verdict = add(stage, h('div', 'u7l1-olv ' + (ok ? 'ok' : 'no'), ok ? `${T(`${py}=${v}`)} ✓ <b>true</b>` : `${T(`${py}\\neq${v}`)} ✗ <b>false</b>`), 14, 362); hide(verdict);
    const st = stamp(stage, ok ? 'on the line' : 'not on the line', { ok, x: 330, y: 410, size: 'sm' }); hide(st);
    const G = sqGraph(stage, BIG, RW, 450, { x: RX, y: 12, center: true, g: { fontSize: 15 } });
    return [
      { cap: `In ${T(P2(px, py))}, the first number is ${T('x')} and the second is ${T('y')}: ${T(cX('x=' + px))} and ${T(cY('y=' + py))}.`,
        run: async (c) => { await show(c, tags); } },
      { cap: `Substitute <b>both</b>: ${T(cY(py))} goes where ${T('y')} is, and ${T(cX(px))} goes where ${T('x')} is.`,
        run: async (c) => { await show(c, subL); slotX.style.opacity = 0; slotY.style.opacity = 0; await fly(c, stage, T(cY(py)), fromY, slotY, 'u7l1-fly-y'); await fly(c, stage, T(cX(px)), fromX, slotX, 'u7l1-fly-x'); } },
      { cap: `Simplify the right side: ${T(`${subTex(m, b, px)}=${mid ? mid + '=' : ''}${v}`)}.`,
        run: async (c) => { await show(c, simL); } },
      { cap: ok ? `${T(`${py}=${v}`)} is <b>true</b>, so ${T(P2(px, py))} <b>lies on</b> the line.` : `${T(`${py}=${v}`)} is <b>false</b>, so ${T(P2(px, py))} is <b>not</b> on the line.`,
        run: async (c) => { await pop(c, verdict, 350); await stampIn(c, st); } },
      { cap: ok ? `The graph agrees: the point sits right on the line. (No graph was needed!)`
        : `The graph agrees: at ${T('x=' + px)} the line is at ${T(P2(px, v))}, ${Math.abs(py - v)} ${py > v ? 'below' : 'above'} the point. (No graph was needed!)`,
        run: async (c) => {
          await G.drawIn(G.line({ m, b }, { color: LINE, width: 4 }), 700, c);
          if (!ok) { const q = G.point(px, v, { color: LINE, r: 6, coords: true, pos: px < 0 ? 'w' : 'e', labelColor: LINE }); await G.reveal(q, c); await G.drawIn(G.segment([px, v], [px, py], { color: RED, width: 3, dash: true }), 400, c); }
          const p = G.point(px, py, { color: ok ? GRN : RED, r: 8, coords: true, pos: m > 0 ? 'nw' : 'ne', labelColor: ok ? GRN : RED }); await G.reveal(p, c);
        } }
    ];
  }
};

/* =============================== explainer: the big one, far away =============================== */
const zoomOut = {
  title: 'Far away: the graph can’t tell, substitution can',
  height: 470,
  minW: 900,
  intro: 'Card A’s rule is <b>y = 3x + 2</b>. Which far-away point is the fake? Press <b>Next</b>.',
  make(stage, k, ex) {
    const f = (x) => 3 * x + 2, far = [[10, 32], [20, 62], [30, 90]];
    const G = new Graph(stage, { x: 10, y: 6, width: 520, height: 458, xmin: 0, xmax: 6, ymin: 0, ymax: 22, ystep: 2, fontSize: 15 });
    const P = panel(stage, 548, 14, ex.W - 562, 442, `Substitute into ${T('y=3x+2')}`); hide(P);
    const rows = far.map(([x, y]) => { const ok = f(x) === y; const d = line(P, `${T(P2(x, y))}: ${T(`3(${cX(x)})+2=${f(x)}`)} ${ok ? '<b class="u7l1-okc">✓</b>' : `<b class="u7l1-badc">≠ ${y} ✗</b>`}`, 'u7l1-zrow'); return hide(d); });
    const fin = line(P, `<b>(30, 90) is the fake.</b> The real point is ${T('(30,\\ 92)')}.`, 'u7l1-zfin'); hide(fin);
    let fakes;
    return [
      { cap: `Card A’s points and its line, ${T('y=3x+2')}.`,
        run: async (c) => { for (let x = 0; x <= 4; x++) await pop(c, G.point(x, f(x), { color: PTC, r: 6 }), 160); await G.drawIn(G.line({ m: 3, b: 2 }, { color: LINE, width: 3.5 }), 600, c); } },
      { cap: `To reach ${T('x=30')}, zoom <b>way</b> out.`,
        run: (c) => G.setWindow({ xmin: 0, xmax: 35, ymin: 0, ymax: 110, xstep: 5, ystep: 10 }, c, 1100) },
      { cap: `Plot the three far-away points. <b>All three look like they are on the line!</b> A graph is too rough to tell.`,
        run: async (c) => { fakes = far.map(([x, y]) => G.point(x, y, { color: INK, r: 6.5, coords: true, pos: 'se', labelColor: 'ink' })); for (const p of fakes) await G.reveal(p, c); } },
      { cap: `No graph needed: substitute each ${T('x')} into ${T('y=3x+2')} and compare with the point’s ${T('y')}.`,
        run: async (c) => { await show(c, P); for (const r of rows) await show(c, r); } },
      { cap: `${T('3(30)+2=92')}, not ${T('90')}. Zoom in near ${T('x=30')}: the line passes through ${T('(30,\\ 92)')}, 2 units above the fake.`,
        run: async (c) => {
          await G.setWindow({ xmin: 27, xmax: 33, ymin: 85, ymax: 97, xstep: 1, ystep: 1 }, c, 1200);
          fakes[2].querySelector('circle').setAttribute('fill', RED); fakes[2].label.style.color = RED;
          const q = G.point(30, 92, { color: LINE, r: 6.5, coords: true, pos: 'nw', labelColor: LINE }); await G.reveal(q, c);
          await G.drawIn(G.segment([30, 90], [30, 92], { color: RED, width: 3, dash: true }), 400, c);
          await show(c, fin);
        } }
    ];
  }
};

/* =============================== mount =============================== */
mountCards();
mountSort();
mountFigures();
mountTry();
export const explainers = mountExplainers({ linTest, steps, buildTable, plotLine, fixIt, onLine, zoomOut });
export const _test = { eqTex, subLine, subTex, midTex };

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const XS = [-2, -1, 0, 1, 2];
  // lines the Lesson 1 assignment uses (tables, graphs, point tests, the sort): never a Stand Up question
  const ASG = new Set(['2,1', '1,2', '-3,2', '2,-4', '-1,5', '3,-2', '5,2', '-3,-3', '-4,0', '-1,-9', '3,1', '-1,2', '2,2', '-2,6', '4,-5', '3,2']);
  const asg = (m, b) => ASG.has(m + ',' + b);
  const tab = (xs, ys) => `\\begin{array}{|c|${xs.map(() => 'c').join('|')}|}\\hline x & ${xs.join(' & ')}\\\\ \\hline y & ${ys.map((y) => (y == null ? '\\phantom{-00}' : y)).join(' & ')}\\\\ \\hline\\end{array}`;
  const stepTxt = (ys) => ys.slice(1).map((y, i) => y - ys[i]).map((d) => '{' + (d >= 0 ? '+' : '') + d + '}').join(',\\ ');
  /** the blank table for the question: vertical, so it stays narrow on the small cards */
  const vtab = (xs) => `\\begin{array}{|c|c|}\\hline x & y\\\\ \\hline ${xs.map((x) => `${x} & \\phantom{-0}`).join('\\\\ \\hline ')}\\\\ \\hline\\end{array}`;
  // complete a table for y = mx + b (positive m)
  function table(r, neg) {
    let m, b; do { m = neg ? -r.int(1, 4) : r.int(1, 4); b = r.int(-6, 6); } while (asg(m, b));
    const ys = XS.map((x) => m * x + b);
    return { text: `Complete the table of values${neg ? ', then plot the points and join them with a straight line' : ''}.`, q: `${eqTex(m, b)}\\quad ${vtab(XS)}`,
      a: tab(XS, ys) };
  }
  // linear or not: complete the table, look at the steps
  function linOrNot(r) {
    const xs = r.pick([[-2, -1, 0, 1, 2], [0, 1, 2, 3, 4], [-1, 0, 1, 2, 3]]);
    if (r.chance(0.5)) {
      let c; do c = r.int(-5, 5); while (c === -3 || c === -4);
      const ys = xs.map((x) => x * x + c), eq = `y=x^2${c ? (c < 0 ? '-' : '+') + Math.abs(c) : ''}`;
      return { text: 'Complete the table. Does <i>y</i> change by the same step each time? Is the graph a straight line?', q: `${eq}\\quad ${vtab(xs)}`,
        a: [tab(xs, ys), `\\text{steps: } ${stepTxt(ys)}`, '\\text{not the same step: NOT a straight line (non-linear)}'] };
    }
    let m, b; do { m = r.pick([-4, -3, -2, 2, 3, 4, 5]); b = r.int(-7, 7); } while (asg(m, b));
    const ys = xs.map((x) => m * x + b);
    return { text: 'Complete the table. Does <i>y</i> change by the same step each time? Is the graph a straight line?', q: `${eqTex(m, b)}\\quad ${vtab(xs)}`,
      a: [tab(xs, ys), `\\text{steps: } ${stepTxt(ys)}`, `\\text{same step } (${m > 0 ? '+' : ''}${m})\\text{ every time: a straight line (linear)}`] };
  }
  standup('u7l1', {
    intro: 'At your whiteboard station: substitute each x in brackets, then fill in the table.',
    levels: {
      BEG: (r) => table(r, false),   // a table for y = mx + b, m positive
      PRG: (r) => table(r, true),    // negative m: watch the signs, then graph it
      MAS: linOrNot                  // complete the table and decide from the steps: linear or not?
    }
  });
})();
/* ============ end Stand Up Break! ============ */
