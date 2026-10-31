/* Math 15 · Unit 7 · Lesson 8 — Graphing Horizontal Lines, Vertical Lines, and Any Form.
 * Warm-up "Tic-Tac-Toe on a Grid": the # board is x = 4, x = 7, y = 3, y = 6; X's winning move; four cards to test.
 * Example grids (tap to plot) with answer figures; a drag-the-point widget (one point, a horizontal and a vertical line).
 * Explainers:
 *   pinnedH  (y = k: table with y pinned, plot, join, slide a point; rise 0 → slope 0; Example 1 checks)
 *   pinnedV  (x = k: the same with x pinned; run 0 → slope undefined; Example 2 checks)
 *   mixup    (the classic error: x = 3 drawn flat through 3 on the y-axis; which coordinate is held fixed?)
 *   sorter   (horizontal, vertical or neither? Example 3 check, and the warm-up cards in disguise)
 *   flow     (which form? three questions → strategy; Example 4 and the walkthrough)
 *   graphAny (graph it by its strategy: y = k / x = k, (0, b) + slope, two intercepts; Example 4 checks)
 *   graphMix (the same, form not announced; Example 5 checks)
 * Built from Math 10C u7l5 (flow, step, cover) and Math 15 u6l7 (flatWall), cut to the Math 15 booklet
 * (no slope–point form). Colours: horizontal blue, vertical red, other lines ink/blue, run amber, rise purple,
 * y-intercept green, x-intercept magenta. */
import {
  h, tex, add, box, Graph, ValueTable, Flowchart, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween,
  pairTex, texNum, liveCtx, pulse, shake, anim, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const HZ = '#1f5bd6', VT = '#c93a33', RUN = COLORS.amber, RISE = COLORS.purple, YI = COLORS.green, XI = '#b8327a',
  INK = COLORS.ink, LINE = '#1f5bd6', BOARD = '#a0700f';
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
const red = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
const fr = (n, d = 1, big = true) => { const [a, b] = red(n, d); if (b === 1) return String(a); return (a < 0 ? '-' : '') + `\\${big ? 'd' : 't'}frac{${Math.abs(a)}}{${b}}`; };
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l8-panel ' + cls, title ? `<div class="u7l8-ph">${title}</div>` : ''), w, hh), x, y);
const pl = (P, html, cls = '') => { const d = h('div', 'u7l8-pl ' + cls, html); P.appendChild(d); return d; };
const pls = async (c, P, html, cls) => { const d = pl(P, html, cls); await show(c, d); return d; };
/** TeX of a sum of terms [[coef, var]…] (zeros dropped) */
function lin(terms) {
  let s = '';
  terms.forEach(([a, v]) => { if (!a) return; const m = Math.abs(a); s += (s ? (a < 0 ? '-' : '+') : (a < 0 ? '-' : '')) + (m === 1 && v ? '' : m) + v; });
  return s || '0';
}
const gfTex = (A, B, C) => lin([[A, 'x'], [B, 'y'], [C, '']]) + '=0';
const siTex = (m, b) => 'y=' + (m[1] === 1 ? lin([[m[0], 'x'], [b, '']]) : (m[0] < 0 ? '-' : '') + `\\tfrac{${Math.abs(m[0])}}{${m[1]}}x` + (b ? (b < 0 ? '-' : '+') + Math.abs(b) : ''));
const grid = (host, o) => new Graph(host, Object.assign({ width: 420, height: 420, xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2, fontSize: 16 }, o));
/** the line in the colour of its kind */
const lineOf = (G, d, o = {}) => (d.kind === 'v' ? G.line({ x: d.k }, Object.assign({ color: VT, width: 4.5 }, o))
  : d.kind === 'h' ? G.line({ m: 0, b: d.k }, Object.assign({ color: HZ, width: 4.5 }, o)) : G.line({ m: d.m[0] / d.m[1], b: d.b }, Object.assign({ color: INK, width: 4 }, o)));

/* slope staircase from (x, y): run leg (amber) then rise leg (purple), then a point ("right 1, up 2") */
async function stepSlope(c, G, x, y, rise, run, o = {}) {
  const ms = o.ms ?? 300;
  const a = G.segment([x, y], [x + run, y], { color: RUN, width: 4.5 }); await G.drawIn(a, ms, c);
  const b = G.segment([x + run, y], [x + run, y + rise], { color: RISE, width: 4.5 }); await G.drawIn(b, ms, c);
  if (o.labels) {
    const la = G.label(x + run / 2, y, (run > 0 ? 'right ' : 'left ') + Math.abs(run), { pos: rise > 0 ? 's' : 'n', cls: 'bk-ptlab u7l8-legl u7l8-legu', gap: 6 });
    const lb = G.label(x + run, y + rise / 2, (rise > 0 ? 'up ' : 'down ') + Math.abs(rise), { pos: run > 0 ? 'e' : 'w', cls: 'bk-ptlab u7l8-legl u7l8-legr', gap: 6 });
    await Promise.all([fadeIn(c, la, 200), fadeIn(c, lb, 200)]);
  }
  const p = G.point(x + run, y + rise, { color: o.color || LINE, r: 7, coords: o.coords, pos: o.pos || 'se' }); await G.reveal(p, c, 240);
}

/* =============================== warm-up: tic-tac-toe on a grid =============================== */
const CARDS = [
  { t: 'y-6=0', ok: true, line: 'S', how: 'add 6: ' + T('y=6') },
  { t: '2x=14', ok: true, line: 'Q', how: '÷2: ' + T('x=7') },
  { t: 'x+y=7', ok: false, how: 'both letters: slanted' },
  { t: '3=y', ok: true, line: 'R', how: T('y=3') }
];
function mountBoard() {
  const host = document.getElementById('u7l8-board'); if (!host) return;
  const G = new Graph(host, { width: 500, height: 440, xmin: 0, xmax: 10.9, ymin: 0, ymax: 9.9, xlabels: 1, ylabels: 1, origin: true, fontSize: 15, arrows: true });
  const L = {
    P: G.segment([4, 0.15], [4, 8.85], { color: BOARD, width: 8 }), Q: G.segment([7, 0.15], [7, 8.85], { color: BOARD, width: 8 }),
    R: G.segment([1.15, 3], [9.85, 3], { color: BOARD, width: 8 }), S: G.segment([1.15, 6], [9.85, 6], { color: BOARD, width: 8 })
  };
  [['P', 4, 9.4], ['Q', 7, 9.4], ['R', 10.45, 3], ['S', 10.45, 6]].forEach(([k, x, y]) => G.label(x, y, k, { cls: 'u7l8-blab' }));
  const X = (x, y, col = '#d23c32') => [G.segment([x - 0.8, y - 0.8], [x + 0.8, y + 0.8], { color: col, width: 7 }), G.segment([x - 0.8, y + 0.8], [x + 0.8, y - 0.8], { color: col, width: 7 })];
  const O = (x, y) => G.polyline(Array.from({ length: 41 }, (_, i) => [x + 0.9 * Math.cos(i * Math.PI / 20), y + 0.9 * Math.sin(i * Math.PI / 20)]), { color: '#2c4a8c', width: 6 });
  X(2.5, 7.5); X(5.5, 4.5); O(5.5, 7.5); O(2.5, 1.5);
  let extra = [];
  const clear = () => { G.remove(extra); extra = []; Object.values(L).forEach((s) => s.classList.remove('u7l8-glow')); document.querySelectorAll('.u7l8-card').forEach((b) => b.classList.remove('ok', 'no')); };
  document.getElementById('u7l8-xwin').addEventListener('click', async () => {
    if (extra.some((e) => e.xwin)) return;
    const c = liveCtx(), xs = X(8.5, 1.5, '#d23c32'); xs.forEach((s) => { s.xwin = true; extra.push(s); });
    const d = G.segment([1.3, 8.7], [9.7, 0.3], { color: '#12805a', width: 4, dash: true }); d.xwin = true; extra.push(d); await G.drawIn(d, 700, c);
  });
  document.getElementById('u7l8-wreset').addEventListener('click', clear);
  const cards = document.getElementById('u7l8-cards');
  CARDS.forEach((cd) => {
    const b = h('button', 'u7l8-card', `<span class="u7l8-ce">${T(cd.t)}</span><span class="u7l8-cvd"></span>`); b.type = 'button'; cards.appendChild(b);
    b.addEventListener('click', async () => {
      const c = liveCtx();
      b.classList.add(cd.ok ? 'ok' : 'no'); b.querySelector(".u7l8-cvd").innerHTML = (cd.ok ? '✓ ' : '✗ ') + cd.how;
      if (cd.ok) { L[cd.line].classList.add('u7l8-glow'); await pulse(c, L[cd.line], 1.02); } else if (!extra.some((e) => e.slant)) {
        const s = G.segment([0, 7], [7, 0], { color: '#c93a33', width: 4, dash: true }); s.slant = true; extra.push(s); await G.drawIn(s, 700, c);
      }
    });
  });
}

/* =============================== figures: example grids, answer figures, section 3 =============================== */
const AF = {
  '1a': { kind: 'h', k: 4, pts: [[-4, 4], [0, 4], [3, 4]] }, '1b': { kind: 'h', k: -3, pts: [[-5, -3], [0, -3], [4, -3]] },
  '2a': { kind: 'v', k: 2, pts: [[2, -4], [2, 0], [2, 3]] }, '2b': { kind: 'v', k: -5, pts: [[-5, -3], [-5, 0], [-5, 4]] },
  '4a': { kind: 'n', m: [2, 1], b: -1, pts: [[0, -1], [1, 1]] }, '4b': { kind: 'n', m: [-2, 1], b: 4, pts: [[2, 0], [0, 4]] }, '4c': { kind: 'v', k: -3, pts: [[-3, 0]] },
  '5a': { kind: 'n', m: [-1, 1], b: 3, pts: [[0, 3], [1, 2]] }, '5b': { kind: 'h', k: 5, pts: [[0, 5]] }, '5c': { kind: 'v', k: -4, pts: [[-4, 0]] },
  '5d': { kind: 'n', m: [2, 1], b: -2, pts: [[1, 0], [0, -2]] }
};
function mountFigures() {
  document.querySelectorAll('[data-grid]').forEach((el) => {
    const s = el.dataset.grid === 's' ? 260 : 300;
    grid(el, { width: s, height: s, fontSize: 13, interactive: { snap: 1, color: 'blue' } });
  });
  document.querySelectorAll('[data-afig]').forEach((el) => {
    const d = AF[el.dataset.afig]; if (!d) return;
    const G = grid(el, { width: 210, height: 210, fontSize: 11, xlabels: 2, ylabels: 2 });
    lineOf(G, d, { width: 3.5 }); (d.pts || []).forEach((p) => G.point(p[0], p[1], { color: d.kind === 'v' ? VT : d.kind === 'h' ? HZ : INK, r: 5 }));
  });
  const ap = document.getElementById('u7l8-apartfig');
  if (ap) {
    const G = grid(ap, { width: 270, height: 270, xmin: -5.5, xmax: 5.5, ymin: -5.5, ymax: 5.5, fontSize: 13 });
    G.line({ m: 0, b: 3 }, { color: HZ, width: 4 }); G.line({ x: 3 }, { color: VT, width: 4 });
    G.label(-3.6, 3, T('y=3'), { pos: 'n', cls: 'bk-ptlab u7l8-eqlab u7l8-ch' }); G.label(3, -3.8, T('x=3'), { pos: 'e', cls: 'bk-ptlab u7l8-eqlab u7l8-cv' });
  }
}

/* =============================== widget: one point, two lines =============================== */
function mountCross() {
  const host = document.getElementById('u7l8-crossfig'); if (!host) return;
  const G = grid(host, { width: 400, height: 400, fontSize: 14 });
  G.el.setAttribute('data-tap', ''); G.el.classList.add('bk-ix');
  let P = [3, 2], hl = null, vl = null, extra = [], showPts = false;
  const pt = G.point(P[0], P[1], { color: '#f2b134', r: 11 });
  const draw = () => {
    G.remove(hl, vl, extra); extra = [];
    hl = G.line({ m: 0, b: P[1] }, { color: HZ, width: 4 }); vl = G.line({ x: P[0] }, { color: VT, width: 4 });
    G.moveTo(pt, P[0], P[1]); pt.parentNode.appendChild(pt);
    document.getElementById('u7l8-xp').innerHTML = T(pairTex(P[0], P[1]));
    document.getElementById('u7l8-xh').innerHTML = T('y=' + P[1]);
    document.getElementById('u7l8-xv').innerHTML = T('x=' + P[0]);
    if (showPts) {
      const xs = [-5, -1, 4].filter((x) => x !== P[0]).slice(0, 2), ys = [-4, 1, 5].filter((y) => y !== P[1]).slice(0, 2);
      xs.forEach((x) => extra.push(G.point(x, P[1], { color: HZ, r: 6, coords: true, pos: P[1] > 4 ? 's' : 'n' })));
      ys.forEach((y) => extra.push(G.point(P[0], y, { color: VT, r: 6, coords: true, pos: P[0] > 3 ? 'w' : 'e' })));
    }
  };
  let drag = false;
  const set = (e) => { const [x, y] = G.fromEvent(e), nx = Math.max(-6, Math.min(6, Math.round(x))), ny = Math.max(-6, Math.min(6, Math.round(y))); if (nx !== P[0] || ny !== P[1]) { P = [nx, ny]; draw(); } };
  G.svg.addEventListener('pointerdown', (e) => { e.preventDefault(); drag = true; try { G.svg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } set(e); });
  G.svg.addEventListener('pointermove', (e) => { if (drag) set(e); });
  const up = () => { drag = false; }; G.svg.addEventListener('pointerup', up); G.svg.addEventListener('pointercancel', up);
  document.getElementById('u7l8-xpts').addEventListener('click', () => { showPts = !showPts; draw(); });
  const SPOTS = [[0, 4], [-3, 0], [0, 0], [3, 2]]; let si = 0;
  document.getElementById('u7l8-xaxes').addEventListener('click', () => { P = SPOTS[si % SPOTS.length].slice(); si++; draw(); });
  draw();
}

/* =============================== explainers 1 + 2: y = k and x = k =============================== */
const PIN = {
  h1a: { label: 'Example 1(a) check', hz: true, k: 4, free: [-4, 0, 3] },
  h1b: { label: 'Example 1(b) check', hz: true, k: -3, free: [-5, 0, 4] },
  v2a: { label: 'Example 2(a) check', hz: false, k: 2, free: [-4, 0, 3] },
  v2b: { label: 'Example 2(b) check', hz: false, k: -5, free: [-3, 0, 4] }
};
function pinDef(keys, title, intro) {
  return {
    title, height: 450, minW: 900, intro,
    choices: keys.map((k) => ({ v: k, label: PIN[k].label })),
    make(stage, key, ex) {
      const d = PIN[key], hz = d.hz, k = d.k, W = ex.W, col = hz ? HZ : VT;
      const pin = hz ? 'y' : 'x', fre = hz ? 'x' : 'y', eq = `${pin}=${k}`;
      const G = grid(stage, { x: 14, y: 14, width: 420, height: 420 });
      const P = panel(stage, 454, 14, W - 468, 420, hz ? 'Horizontal line' : 'Vertical line');
      pl(P, T(eq), 'u7l8-big');
      const tbHost = h('div', 'u7l8-tbhost'); P.appendChild(tbHost);
      const pts = d.free.map((v) => (hz ? [v, k] : [k, v]));
      const tb = new ValueTable(tbHost, { headers: ['x', 'y'], rows: pts, layout: 'h', cellW: 74, cellH: 48, hide: hz ? 1 : 0, tap: false });
      hide(tbHost);
      const [A, B] = [pts[0], pts[2]], run = B[0] - A[0], rise = B[1] - A[1];
      const ptList = pts.map((p) => T(pairTex(p[0], p[1]))).join(', ');
      let line = null, mv = null;
      return [
        { cap: `${T(eq)}: there is no ${T(fre)} in it. So ${T(pin)} is <b>pinned</b> at ${T(String(k))}, and ${T(fre)} can be anything.`,
          run: async (c) => { await show(c, tbHost); tb.highlightCol(hz ? 1 : 0, true); } },
        { cap: `Fill the table: ${T(`${pin}=${k}`)} every time, whatever ${T(fre)} is.`,
          run: async (c) => { await tb.fill(c, { col: hz ? 1 : 0 }); } },
        { cap: `Plot the points: ${ptList}.`,
          run: async (c) => { for (const p of pts) await G.reveal(G.point(p[0], p[1], { color: col, r: 7, coords: true, pos: hz ? (k > 4 ? 'n' : 's') : (k > 3 ? 'nw' : 'ne') }), c, 260); } },
        { cap: `Join them: a <b>${hz ? 'horizontal' : 'vertical'}</b> line through ${T(hz ? pairTex(0, k) : pairTex(k, 0))}. Slide along it: ${T(fre)} changes, ${T(pin)} stays ${T(String(k))}.`,
          run: async (c) => {
            line = G.line(hz ? { m: 0, b: k } : { x: k }, { color: col, width: 4.5 }); await G.drawIn(line, 700, c);
            const lb = G.label(hz ? 5.2 : k, hz ? k : 5.6, T(eq), { pos: hz ? (k > 4 ? 's' : 'n') : (k > 3 ? 'w' : 'e'), cls: 'bk-ptlab u7l8-eqlab', color: col }); await pop(c, lb);
            mv = G.point(hz ? -6 : k, hz ? k : -6, { color: '#f2b134', r: 10 });
            const ro = pl(P, '', 'u7l8-ro'); await show(c, ro);
            await tween(c, 1600, (t) => { const v = -6 + 12 * t, x = hz ? v : k, y = hz ? k : v; G.moveTo(mv, x, y); ro.innerHTML = `${T(pairTex(hz ? texNum(Math.round(v * 10) / 10) : k, hz ? k : texNum(Math.round(v * 10) / 10)))}: ${T(pin)} is still ${T(String(k))}`; });
          } },
        { cap: hz ? `<b>Slope:</b> from ${T(pairTex(...A))} to ${T(pairTex(...B))}, the <b>rise</b> is ${T(`${k}-(${k})=0`)}. ${T(`m=\\dfrac{0}{${run}}=0`)}. Every horizontal line has slope ${T('0')}.`
          : `<b>Slope:</b> from ${T(pairTex(...A))} to ${T(pairTex(...B))}, the <b>run</b> is ${T(`${k}-(${k})=0`)}. ${T(`m=\\dfrac{${rise}}{0}`)} can’t be done: the slope is <b>undefined</b>.`,
        run: async (c) => {
          if (mv) G.remove(mv);
          const s = hz ? G.segment(A, B, { color: RUN, width: 6 }) : G.segment(A, B, { color: RISE, width: 6 }); await G.drawIn(s, 600, c);
          const M = pts[1], lb = hz ? G.label((A[0] + M[0]) / 2, k, `run ${run}, rise 0`, { pos: k > 4 ? 's' : 'n', cls: 'bk-ptlab u7l8-legl u7l8-legu', gap: 10 })
            : G.label(k, (A[1] + M[1]) / 2, `rise ${rise}, run 0`, { pos: k > 3 ? 'w' : 'e', cls: 'bk-ptlab u7l8-legl u7l8-legr', gap: 10 });
          await pop(c, lb);
          const res = pl(P, hz ? `slope ${T('=\\dfrac{0}{' + run + '}=0')}` : `slope ${T('=\\dfrac{' + rise + '}{0}')}: <b>undefined</b>`, 'u7l8-res ' + (hz ? 'u7l8-resh' : 'u7l8-resv'));
          await pop(c, res);
        } }
      ];
    }
  };
}
const pinnedH = pinDef(['h1a', 'h1b'], 'Horizontal: y is pinned', 'A line with no <b>x</b> in its equation. Press <b>Next</b>.');
const pinnedV = pinDef(['v2a', 'v2b'], 'Vertical: x is pinned', 'A line with no <b>y</b> in its equation. Press <b>Next</b>.');

/* =============================== explainer 3: the classic mix-up =============================== */
const MX = {
  x3: { label: T('x=3') + ': the classic error', vert: true, k: 3, test: [-2, 3], pts: [[3, -4], [3, 0], [3, 2]], st: [-4, 1.5] },
  y3: { label: T('y=3'), vert: false, k: 3, test: [3, -2], pts: [[-5, 3], [0, 3], [5, 3]], st: [4.6, 4.6] },
  xm: { label: T('x=-2'), vert: true, k: -2, test: [3, -2], pts: [[-2, -4], [-2, 1], [-2, 4]], st: [4, -3.8] }
};
const mixup = {
  title: 'Which coordinate is held fixed?',
  height: 450, minW: 900,
  choices: Object.keys(MX).map((k) => ({ v: k, label: MX[k].label })),
  intro: 'Find the number on an axis, and draw a line through it… but which way? Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = MX[key], W = ex.W, k = d.k, v = d.vert, eq = (v ? 'x' : 'y') + '=' + k;
    const G = grid(stage, { x: 14, y: 14, width: 420, height: 420 });
    const P = panel(stage, 454, 14, W - 468, 420, 'Which way?');
    pl(P, T(eq), 'u7l8-big');
    const [tx, ty] = d.test, wrongTx = v ? 'x' : 'y', tv = v ? tx : ty;
    let wrong = null;
    return [
      { cap: `<b>The classic error:</b> find ${T(String(k))} on the <b>${v ? 'y' : 'x'}-axis</b> and draw a ${v ? 'flat' : 'vertical'} line through it.`,
        run: async (c) => {
          await pop(c, G.point(v ? 0 : k, v ? k : 0, { color: INK, r: 7 }));
          wrong = v ? G.line({ m: 0, b: k }, { color: '#9aa0ab', width: 4, dash: true }) : G.line({ x: k }, { color: '#9aa0ab', width: 4, dash: true }); await G.drawIn(wrong, 700, c);
          await pls(c, P, `${v ? 'flat' : 'vertical'} line through ${T(v ? pairTex(0, k) : pairTex(k, 0))}?`, 'u7l8-soft');
        } },
      { cap: `Test a point on that line, ${T(pairTex(tx, ty))}: its ${T(wrongTx)} is ${T(String(tv))}, not ${T(String(k))}. ${T(`${wrongTx}=${k}`)} is <b>false</b> there, so that is the wrong line.`,
        run: async (c) => {
          const p = G.point(tx, ty, { color: VT, r: 7, coords: true, pos: v ? 'n' : 'e' }); await pop(c, p);
          await pls(c, P, `${T(pairTex(tx, ty))}: ${T(`${wrongTx}=${tv}\\ne${k}`)} <b class="u7l8-no">✗</b>`);
          const [sx, sy] = G.toPx(...d.st), s = stamp(stage, 'Wrong way!', { ok: false, x: 14 + sx, y: 14 + sy, size: 'sm' }); await stampIn(c, s);
        } },
      { cap: `Ask: <b>which coordinate is held fixed?</b> The equation says ${T(eq)}, so every point has ${T(wrongTx + '=' + k)}: ${d.pts.map((p) => T(pairTex(...p))).join(', ')}.`,
        run: async (c) => { for (const p of d.pts) await G.reveal(G.point(p[0], p[1], { color: v ? VT : HZ, r: 7, coords: true, pos: v ? (k > 3 ? 'w' : 'e') : 'n' }), c, 240); await pls(c, P, `${T(wrongTx)} fixed at ${T(String(k))}, ${T(v ? 'y' : 'x')} roams`); } },
      { cap: `Join them: ${T(eq)} is <b>${v ? 'vertical' : 'horizontal'}</b>, through ${T(v ? pairTex(k, 0) : pairTex(0, k))} on the <b>${v ? 'x' : 'y'}-axis</b>. Both lines go through a ${T(String(k))}, but on different axes.`,
        run: async (c) => {
          wrong.style.opacity = 0.35;
          await G.drawIn(v ? G.line({ x: k }, { color: VT, width: 4.5 }) : G.line({ m: 0, b: k }, { color: HZ, width: 4.5 }), 800, c);
          await pls(c, P, `${T(eq)}: <b>${v ? 'vertical' : 'horizontal'}</b>, slope ${v ? 'undefined' : T('0')}`, v ? 'u7l8-res u7l8-resv' : 'u7l8-res u7l8-resh');
        } }
    ];
  }
};

/* =============================== explainer 4: horizontal, vertical or neither? =============================== */
const SO = {
  ex3: { label: 'Example 3 check', win: { xmin: -8.5, xmax: 8.5, ymin: -8.5, ymax: 8.5, xlabels: 2, ylabels: 2 }, rows: [
    { t: 'y=-2', kind: 'h', k: -2, pt: [0, -2], why: `no ${T('x')}: ${T('y')} is pinned` },
    { t: 'x=7', kind: 'v', k: 7, pt: [7, 0], why: `no ${T('y')}: ${T('x')} is pinned` },
    { t: 'y=4x-1', kind: 'n', m: [4, 1], b: -1, why: 'both letters; slope ' + T('4') },
    { t: 'x=0', kind: 'v', k: 0, pt: [0, 5], why: `it <b>is</b> the ${T('y')}-axis` }] },
  wu: { label: 'Warm-up cards', win: { xmin: -1.5, xmax: 9.5, ymin: -1.5, ymax: 9.5, xlabels: 1, ylabels: 1 }, rows: [
    { t: 'y-6=0', kind: 'h', k: 6, pt: [0, 6], why: `add 6: ${T('y=6')}` },
    { t: '2x=14', kind: 'v', k: 7, pt: [7, 0], why: `divide by 2: ${T('x=7')}` },
    { t: 'x+y=7', kind: 'n', m: [-1, 1], b: 7, why: `both letters: ${T('y=-x+7')}` },
    { t: '3=y', kind: 'h', k: 3, pt: [0, 3], why: `just ${T('y=3')}` }] }
};
const KW = { h: '<b class="u7l8-ch">Horizontal</b>', v: '<b class="u7l8-cv">Vertical</b>', n: '<b>Neither</b>' };
const sorter = {
  title: 'Horizontal, vertical, or neither?',
  height: 450, minW: 900,
  choices: Object.keys(SO).map((k) => ({ v: k, label: SO[k].label })),
  intro: 'Look for the missing letter. Press <b>Next</b>.',
  make(stage, key, ex) {
    const d = SO[key], W = ex.W;
    const G = grid(stage, Object.assign({ x: 14, y: 14, width: 420, height: 420, fontSize: 14 }, d.win));
    const P = panel(stage, 454, 14, W - 468, 420, 'Sort them');
    const rows = d.rows.map((r) => { const e = h('div', 'u7l8-srow', `<span class="u7l8-se">${T(r.t)}</span><span class="u7l8-sk"></span><span class="u7l8-sp"></span>`); P.appendChild(e); return e; });
    const steps = d.rows.map((r, i) => ({
      cap: `${'abcd'[i] ? `(${'abcd'[i]}) ` : ''}${T(r.t)}: ${r.why}. ${KW[r.kind]}${r.pt ? `, through ${T(pairTex(...r.pt))}` : ''}.`,
      run: async (c) => {
        rows.forEach((e) => e.classList.remove('on')); rows[i].classList.add('on');
        rows[i].querySelector('.u7l8-sk').innerHTML = KW[r.kind];
        rows[i].querySelector('.u7l8-sp').innerHTML = r.pt ? T(pairTex(...r.pt)) : '—';
        await pop(c, rows[i].querySelector('.u7l8-sk'));
        await G.drawIn(lineOf(G, r, { width: r.kind === 'n' ? 3.5 : 4.5 }), 700, c);
        if (r.pt) await pop(c, G.point(r.pt[0], r.pt[1], { color: r.kind === 'v' ? VT : HZ, r: 7, coords: true, pos: r.kind === 'v' ? (r.pt[0] > 3 ? 'w' : 'e') : 'n' }));
      }
    }));
    steps.push({ cap: `The <b>missing letter</b> tells you: no ${T('x')} → horizontal, no ${T('y')} → vertical, both letters → a slanted line.`,
      run: async (c) => { rows.forEach((e) => e.classList.remove('on')); await pulse(c, P, 1.02); } });
    return steps;
  }
};

/* =============================== explainer 5: which strategy? =============================== */
const FN = {
  start: { x: 470, y: 34, w: 400, h: 50, html: '<b>Read the equation. Which form is it?</b>', cls: 'bk-round' },
  q1: { x: 150, y: 140, w: 250, h: 70, html: `<b>(1) ${T('y=k')} or ${T('x=k')}</b>only one letter`, color: HZ },
  q2: { x: 470, y: 140, w: 250, h: 70, html: `<b>(2) ${T('y=mx+b')}</b>solved for ${T('y')}`, color: YI },
  q3: { x: 790, y: 140, w: 250, h: 70, html: `<b>(3) ${T('Ax+By+C=0')}</b>everything on one side`, color: XI },
  a1: { x: 150, y: 270, w: 290, h: 92, html: `<b>Graph it directly</b>${T('y=k')}: horizontal<br>${T('x=k')}: vertical` },
  a2: { x: 470, y: 270, w: 290, h: 92, html: `<b>Plot ${T('(0,b)')}</b>then count the slope:<br>rise over run` },
  a3: { x: 790, y: 270, w: 290, h: 92, html: `<b>Two intercepts</b>${T('y=0')} gives the x-intercept,<br>${T('x=0')} gives the y-intercept` }
};
const FE = [
  { from: 'start', to: 'q1', route: 'vhv' }, { from: 'start', to: 'q2' }, { from: 'start', to: 'q3', route: 'vhv' },
  { from: 'q1', to: 'a1' }, { from: 'q2', to: 'a2' }, { from: 'q3', to: 'a3' }
];
const FP = {
  a: { eq: 'y=2x-1', label: `Ex 4(a) ${T('y=2x-1')}`, path: ['start', 'q2', 'a2'],
    caps: [`${T('y=2x-1')}: which form is it?`, `Already solved for ${T('y')}: <b>strategy (2)</b>, ${T('y=mx+b')} with ${T('m=2')} and ${T('b=-1')}.`, `Plot ${T('(0,-1)')}, then right 1, up 2 to ${T('(1,1)')}. Join the points.`] },
  b: { eq: '4x+2y-8=0', label: `Ex 4(b) ${T('4x+2y-8=0')}`, path: ['start', 'q3', 'a3'],
    caps: [`${T('4x+2y-8=0')}: which form is it?`, `Every term on one side, ${T('=0')}: <b>strategy (3)</b>, general form.`, `${T('y=0')}: ${T('4x-8=0')}, ${T('x=2')}. ${T('x=0')}: ${T('2y-8=0')}, ${T('y=4')}. Join ${T('(2,0)')} and ${T('(0,4)')}.`] },
  c: { eq: 'x=-3', label: `Ex 4(c) ${T('x=-3')}`, path: ['start', 'q1', 'a1'],
    caps: [`${T('x=-3')}: which form is it?`, `Only one letter, ${T('x')}: <b>strategy (1)</b>. ${T('x')} is pinned at ${T('-3')}.`, `A vertical line through ${T('(-3,0)')}. No table, no calculation.`] },
  w: { eq: '2x+y-4=0', label: `Walkthrough ${T('2x+y-4=0')}`, path: ['start', 'q3', 'a3'],
    caps: [`${T('2x+y-4=0')}: which form is it?`, `General form: <b>strategy (3)</b>.`, `${T('y=0')}: ${T('2x-4=0')}, ${T('x=2')}. ${T('x=0')}: ${T('y-4=0')}, ${T('y=4')}. Join ${T('(2,0)')} and ${T('(0,4)')}.`] }
};
const flow = {
  title: 'Which strategy? Read the form first',
  height: 330, side: false, minW: 940,
  choices: Object.keys(FP).map((k) => ({ v: k, label: FP[k].label })),
  intro: (k) => `Follow the chart for ${T(FP[k].eq)}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = FP[k], F = new Flowchart(stage, { x: Math.max(0, (ex.W - 940) / 2), y: 2, width: 940, height: 326, nodes: FN, edges: FE });
    add(stage, h('div', 'u7l8-fceq', T(d.eq)), 12, 10);
    return d.path.map((id, i) => ({ cap: d.caps[i], run: async (c) => { if (i) await F.go(c, d.path[i - 1], id); await F.visit(c, id); } }));
  }
};

/* =============================== explainers 6 + 7: graph it =============================== */
const GA = {
  a4: { label: 'Example 4(a) check', eq: 'y=2x-1', form: 'si', m: [2, 1], b: -1, fwd: 2, back: 2 },
  b4: { label: 'Example 4(b) check', eq: '4x+2y-8=0', form: 'gf', A: 4, B: 2, C: -8 },
  c4: { label: 'Example 4(c) check', eq: 'x=-3', form: 'v', k: -3 },
  w: { label: 'Walkthrough ' + T('2x+y-4=0'), eq: '2x+y-4=0', form: 'gf', A: 2, B: 1, C: -4 },
  a5: { label: 'Example 5(a) check', eq: 'y=-x+3', form: 'si', m: [-1, 1], b: 3, fwd: 3, back: 2 },
  b5: { label: 'Example 5(b) check', eq: 'y=5', form: 'h', k: 5 },
  c5: { label: 'Example 5(c) check', eq: 'x=-4', form: 'v', k: -4 },
  d5: { label: 'Example 5(d) check', eq: '2x-y-2=0', form: 'gf', A: 2, B: -1, C: -2 }
};
const STRAT = { h: 1, v: 1, si: 2, gf: 3 };
function graphDef(keys, title, intro) {
  return {
    title, height: 450, minW: 900, intro,
    choices: keys.map((k) => ({ v: k, label: GA[k].label })),
    make(stage, key, ex) {
      const d = GA[key], W = ex.W, G = grid(stage, { x: 14, y: 14, width: 420, height: 420 });
      const P = panel(stage, 454, 14, W - 468, 420, '');
      pl(P, T(d.eq), 'u7l8-big');
      const sr = h('div', 'u7l8-strip', [1, 2, 3].map((n) => `<span class="u7l8-sb" data-n="${n}">(${n}) ${n === 1 ? T('y=k') + ' / ' + T('x=k') : n === 2 ? T('y=mx+b') : T('Ax+By+C=0')}</span>`).join('')); P.appendChild(sr);
      const sn = STRAT[d.form];
      const formWords = { h: `only the letter ${T('y')}: <b>strategy (1)</b>, ${T('y=k')}`, v: `only the letter ${T('x')}: <b>strategy (1)</b>, ${T('x=k')}`,
        si: `solved for ${T('y')}: <b>strategy (2)</b>, ${T('y=mx+b')}`, gf: `every term on one side: <b>strategy (3)</b>, two intercepts` }[d.form];
      const steps = [{ cap: `Read the form first. ${T(d.eq)} has ${formWords}.`, run: async (c) => { const b = sr.querySelector(`[data-n="${sn}"]`); b.classList.add('on'); await pulse(c, b, 1.08); } }];
      if (d.form === 'h' || d.form === 'v') {
        const hz = d.form === 'h', k = d.k, p0 = hz ? [0, k] : [k, 0];
        steps.push({ cap: `${hz ? 'No ' + T('x') + ': ' + T('y') : 'No ' + T('y') + ': ' + T('x')} is pinned at ${T(String(k))}. Plot ${T(pairTex(...p0))} on the ${hz ? 'y' : 'x'}-axis.`,
          run: async (c) => { await G.reveal(G.point(p0[0], p0[1], { color: hz ? HZ : VT, r: 8, coords: true, pos: hz ? 'ne' : 'se' }), c); await pls(c, P, `${T(hz ? 'y' : 'x')} pinned at ${T(String(k))}: plot ${T(pairTex(...p0))}`); } });
        steps.push({ cap: `Rule a <b>${hz ? 'horizontal' : 'vertical'}</b> line through it. Slope ${hz ? T('0') : '<b>undefined</b>'}. No table needed.`,
          run: async (c) => { await G.drawIn(G.line(hz ? { m: 0, b: k } : { x: k }, { color: hz ? HZ : VT, width: 4.5 }), 800, c); await pls(c, P, `${hz ? 'horizontal' : 'vertical'}, slope ${hz ? T('0') : 'undefined'}`, hz ? 'u7l8-res u7l8-resh' : 'u7l8-res u7l8-resv'); } });
      } else if (d.form === 'si') {
        const [r, u] = d.m, b = d.b, pts = []; for (let i = 1; i <= d.fwd; i++) pts.push([i * u, b + i * r]);
        const bp = []; for (let i = 1; i <= d.back; i++) bp.push([-i * u, b - i * r]);
        const dir = (ri, ru) => `${ru > 0 ? 'right' : 'left'} ${Math.abs(ru)}, ${ri > 0 ? 'up' : 'down'} ${Math.abs(ri)}`;
        steps.push({ cap: `${T('b=' + b)}: plot the y-intercept ${T(pairTex(0, b))}.`,
          run: async (c) => { await G.reveal(G.point(0, b, { color: YI, r: 8, coords: true, pos: 'w' }), c); await pls(c, P, `${T('b=' + b)}: start at ${T(pairTex(0, b))}`); } });
        steps.push({ cap: `${T('m=' + fr(r, u))}${u === 1 ? ` ${T(`=\\dfrac{${r}}{1}`)}` : ''}: ${dir(r, u)} to ${T(pairTex(...pts[0]))}.${pts.length > 1 ? ` Again: ${pts.slice(1).map((p) => T(pairTex(...p))).join(', ')}.` : ''}`,
          run: async (c) => { await pls(c, P, `${T('m=' + fr(r, u))}: <b>${dir(r, u)}</b>`); for (let i = 0; i < pts.length; i++) await stepSlope(c, G, i * u, b + i * r, r, u, { labels: i === 0, coords: i === 0, pos: r > 0 ? 'nw' : 'ne' }); } });
        steps.push({ cap: `Step <b>backwards</b> too (${dir(-r, -u)}): ${bp.map((p) => T(pairTex(...p))).join(', ')}. Then join the points with a ruler.`,
          run: async (c) => {
            for (let i = 0; i < bp.length; i++) await stepSlope(c, G, -i * u, b - i * r, -r, -u, {});
            await G.drawIn(G.line([0, b], [u, b + r], { color: LINE, width: 4.5 }), 800, c);
          } });
      } else {
        const { A, B, C } = d, xi = -C / A, yi = -C / B;
        const xs = [lin([[A, 'x'], [C, '']]) + '=0', ...(A !== 1 ? [lin([[A, 'x']]) + '=' + (-C)] : []), 'x=' + texNum(xi)];
        const ys = [lin([[B, 'y'], [C, '']]) + '=0', ...(B !== 1 ? [lin([[B, 'y']]) + '=' + (-C)] : []), 'y=' + texNum(yi)];
        steps.push({ cap: `<b>x-intercept:</b> put ${T('y=0')}. ${T(xs.join(',\\ '))}. Plot ${T(pairTex(xi, 0))}.`,
          run: async (c) => { await pls(c, P, `${T('y=0')}: ${T(xs.join('\\ \\Rightarrow\\ '))}`); await G.reveal(G.point(xi, 0, { color: XI, r: 8, coords: true, pos: yi > 0 ? 'ne' : 'se' }), c); } });
        steps.push({ cap: `<b>y-intercept:</b> put ${T('x=0')}. ${T(ys.join(',\\ '))}. Plot ${T(pairTex(0, yi))}.`,
          run: async (c) => { await pls(c, P, `${T('x=0')}: ${T(ys.join('\\ \\Rightarrow\\ '))}`); await G.reveal(G.point(0, yi, { color: YI, r: 8, coords: true, pos: xi > 0 ? 'w' : 'e' }), c); } });
        steps.push({ cap: `Two points fix the line: <b>join the intercepts</b> with a ruler and extend it both ways.`,
          run: async (c) => { await G.drawIn(G.line([xi, 0], [0, yi], { color: LINE, width: 4.5 }), 800, c); } });
      }
      return steps;
    }
  };
}
const graphAny = graphDef(['a4', 'b4', 'c4', 'w'], 'Read the form, then graph', 'Pick the route from the form, then plot. Press <b>Next</b>.');
const graphMix = graphDef(['a5', 'b5', 'c5', 'd5'], 'Example 5: the form is not announced', 'Read the equation first, then take the cheapest route. Press <b>Next</b>.');

/* ============ Stand Up Break! (whiteboard stations) ============ */
(() => {
  const C = { ink: '#1c2230', grid: '#cdd3dc', num: '#3a4254', h: HZ, v: VT, l: '#1f5bd6', yi: '#12805a', xi: '#b8327a' };
  /** a small answer grid (−7…7) with lines [{ h: k } | { v: k } | { m, b }] and points [{ p, c }] */
  function suGrid(o) {
    const x0 = -7, x1 = 7, u = 17, m = 18, W = (x1 - x0) * u + 2 * m;
    const X = (x) => m + (x - x0) * u, Y = (y) => m + (x1 - y) * u, f = (v) => Math.round(v * 10) / 10;
    let s = `<svg viewBox="0 0 ${W} ${W}" width="${W}" height="${W}" xmlns="http://www.w3.org/2000/svg" font-family="system-ui, sans-serif" role="img" aria-label="answer graph" style="max-width:100%;height:auto;display:block;margin:6px auto 2px">`;
    s += `<rect x="${X(x0)}" y="${Y(x1)}" width="${(x1 - x0) * u}" height="${(x1 - x0) * u}" fill="#fff"/>`;
    for (let i = x0; i <= x1; i++) s += `<line x1="${X(i)}" y1="${Y(x0)}" x2="${X(i)}" y2="${Y(x1)}" stroke="${C.grid}"/><line x1="${X(x0)}" y1="${Y(i)}" x2="${X(x1)}" y2="${Y(i)}" stroke="${C.grid}"/>`;
    s += `<line x1="${X(x0)}" y1="${Y(0)}" x2="${X(x1)}" y2="${Y(0)}" stroke="${C.ink}" stroke-width="2"/><line x1="${X(0)}" y1="${Y(x0)}" x2="${X(0)}" y2="${Y(x1)}" stroke="${C.ink}" stroke-width="2"/>`;
    const halo = 'paint-order="stroke" stroke="#fff" stroke-width="3" stroke-linejoin="round"';
    for (let i = -6; i <= 6; i += 2) if (i) s += `<text x="${X(i)}" y="${Y(0) + 13}" font-size="11" text-anchor="middle" fill="${C.num}" ${halo}>${i < 0 ? '−' + -i : i}</text><text x="${X(0) - 4}" y="${Y(i) + 4}" font-size="11" text-anchor="end" fill="${C.num}" ${halo}>${i < 0 ? '−' + -i : i}</text>`;
    (o.lines || []).forEach((L) => {
      let a, b, col = C.l;
      if (L.h != null) { a = [x0, L.h]; b = [x1, L.h]; col = C.h; } else if (L.v != null) { a = [L.v, x0]; b = [L.v, x1]; col = C.v; } else {
        const ys = (x) => L.m * x + L.b, lo = Math.max(x0, L.m ? Math.min((x0 - L.b) / L.m, (x1 - L.b) / L.m) : x0), hi = Math.min(x1, L.m ? Math.max((x0 - L.b) / L.m, (x1 - L.b) / L.m) : x1);
        a = [lo, ys(lo)]; b = [hi, ys(hi)];
      }
      s += `<line x1="${f(X(a[0]))}" y1="${f(Y(a[1]))}" x2="${f(X(b[0]))}" y2="${f(Y(b[1]))}" stroke="${col}" stroke-width="3.5" stroke-linecap="round"/>`;
    });
    (o.pts || []).forEach((p) => { s += `<circle cx="${X(p.p[0])}" cy="${Y(p.p[1])}" r="5" fill="${p.c || C.ink}" stroke="#fff" stroke-width="1.5"/>`; });
    return s + '</svg>';
  }
  const nz = (r, a, b) => { for (;;) { const v = r.int(a, b) * r.sign(); if (v) return v; } };
  const TXT = 'Graph the line. Which strategy did you use?';
  function hv(r, disguise) {
    const hz = r.chance(0.5), k = r.int(-6, 6), L = hz ? 'y' : 'x', p = hz ? [0, k] : [k, 0];
    let q = `${L}=${k}`, pre = [];
    if (disguise) {
      const kind = r.int(0, 2), a = r.int(2, 4), c = nz(r, 1, 6);
      if (kind === 0 && k) { q = `${L}${k < 0 ? '+' : '-'}${Math.abs(k)}=0`; pre = [`\\text{${k < 0 ? 'subtract' : 'add'} } ${Math.abs(k)}:\\quad ${L}=${k}`]; }
      else if (kind === 1) { q = `${a}${L}=${a * k}`; pre = [`\\div${a}:\\quad ${L}=${k}`]; }
      else { q = `${L}${c < 0 ? '-' : '+'}${Math.abs(c)}=${k + c}`; pre = [`\\text{${c < 0 ? 'add' : 'subtract'} } ${Math.abs(c)}:\\quad ${L}=${k}`]; }
    }
    return { text: disguise ? 'Unmask it, then graph the line. Horizontal or vertical? State its slope.' : 'Graph the line. Horizontal or vertical? State its slope and one point on it.', q,
      atext: suGrid({ lines: [hz ? { h: k } : { v: k }], pts: [{ p, c: hz ? C.h : C.v }] }),
      a: pre.concat([(hz ? '\\text{no } x\\text{, so } y \\text{ is pinned} \\Rightarrow \\text{horizontal}' : '\\text{no } y\\text{, so } x \\text{ is pinned} \\Rightarrow \\text{vertical}'),
        `\\text{through } (${p[0]},\\ ${p[1]}),\\qquad \\text{slope } ${hz ? '0' : '\\text{undefined}'}`]) };
  }
  const SL = [[1, 1], [2, 1], [3, 1], [-1, 1], [-2, 1], [-3, 1], [1, 2], [-1, 2], [3, 2], [-3, 2], [2, 3], [-2, 3], [1, 3], [-1, 3]];
  function si(r) {
    const [ri, ru] = r.pick(SL), b = r.int(-4, 4);
    const m = ri / ru, p1 = [ru, b + ri];
    return { text: TXT, q: siTex([ri, ru], b), atext: suGrid({ lines: [{ m, b }], pts: [{ p: [0, b], c: C.yi }, { p: p1 }] }),
      a: ['\\text{strategy (2): } y=mx+b', `\\text{plot } (0,\\ ${b}),\\ \\text{then right } ${ru},\\ \\text{${ri > 0 ? 'up' : 'down'} } ${Math.abs(ri)} \\text{ to } (${p1[0]},\\ ${p1[1]})`] };
  }
  function twoInt(r) {
    for (;;) {
      const a = nz(r, 1, 6), c = nz(r, 1, 6), g = gcd(a, c);
      let A = c / g, B = a / g, Cc = -a * c / g; if (A < 0) { A = -A; B = -B; Cc = -Cc; }
      if (Math.abs(A) === 1 && Math.abs(B) === 1 && r.chance(0.6)) continue;
      return { text: 'Graph the line using the two-intercept method.', q: gfTex(A, B, Cc), atext: suGrid({ lines: [{ m: -c / a, b: c }], pts: [{ p: [a, 0], c: C.xi }, { p: [0, c], c: C.yi }] }),
        a: [`y=0:\\quad ${lin([[A, 'x'], [Cc, '']])}=0\\ \\Rightarrow\\ x=${a}`, `x=0:\\quad ${lin([[B, 'y'], [Cc, '']])}=0\\ \\Rightarrow\\ y=${c}`, `\\text{join } (${a},\\ 0) \\text{ and } (0,\\ ${c})`] };
    }
  }
  standup('u7l8', {
    intro: 'Draw a grid on your whiteboard. Read the form first, then graph the line.',
    levels: {
      BEG: (r) => hv(r, false),                                                     // y = k or x = k
      PRG: (r) => (r.chance(0.6) ? si(r) : hv(r, true)),                             // y = mx + b, or a disguised y = k / x = k
      MAS: (r) => (r.chance(0.6) ? twoInt(r) : r.chance(0.5) ? si(r) : hv(r, true))  // general form by intercepts, or any form
    }
  });
})();
/* ============ end Stand Up Break! ============ */

/* =============================== mount =============================== */
mountBoard();
mountFigures();
mountCross();
export const explainers = mountExplainers({ pinnedH, pinnedV, mixup, sorter, flow, graphAny, graphMix });
export const _test = { GA, PIN, SO, AF };
