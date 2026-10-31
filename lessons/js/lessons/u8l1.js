/* Math 15 · Unit 8 · Lesson 1 — What Is a System of Linear Equations? Solving by Graphing.
 * (The Math 10C twin is u8/l1; dragLab, readGraph and the Stand Up Break helpers are adapted from it.)
 * Warm-up "Two Mystery Numbers" (two clue tables, a graph with a sticky note over the crossing), the example grids (the
 * answer lines appear on the same grid when the part is shown), and the explainers:
 *   pairs     (Section 1: each equation's table of pairs, plotted; the one pair in both tables is where the lines cross;
 *              the warm-up's two clues, with the "6 is in both rows" trap),
 *   dragLab   (drag a point around the grid with a live ✓/✗ for each equation; only the crossing gets ✓ ✓),
 *   readGraph (Example 1: drop to the axes, x first, check in both; the swapped pair (4, 1) passes one check only),
 *   byHand    (the four steps: rewrite, graph from b and the slope, find the crossing, state it and check; Examples 2, 3, 5;
 *              mounted three times, starting on Example 2, 3 and 5),
 *   rearrange (Step 1: get y alone by subtracting the x-term from each side, then put the x-term first; Examples 3(a),
 *              5(a), the warm-up's clue, and a −y one),
 *   check     (Section 4: the pair's numbers fly into both equations; ✓/✗ for each; Examples 4(a), 4(b), the warm-up's
 *              "(2, 8)?"),
 *   oops      (when the check fails: a rise/run mix-up and a sign slip on b, caught by the check and fixed).
 * Colours (as in the 10C twin): line / equation 1 blue, line / equation 2 amber, the solution purple. */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, pulse, shake,
  pairTex, texNum, svgEl, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(String(s));
const BLUE = COLORS.blue, AMB = COLORS.amber, PUR = COLORS.purple, RED = COLORS.red, INK = COLORS.ink;
const k1 = (s) => `\\textcolor{${BLUE}}{${s}}`, k2 = (s) => `\\textcolor{${AMB}}{${s}}`, kp = (s) => `\\textcolor{${PUR}}{${s}}`;
const kc = (col) => (col === AMB ? k2 : col === PUR ? kp : k1);
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u8l1-panel ' + cls, title ? `<div class="u8l1-ph">${title}</div>` : ''), w, hh), x, y);
const line = (P, html, cls = '') => { const d = h('div', 'u8l1-line ' + cls, html); P.appendChild(d); return d; };
const show = (c, el) => fadeIn(c, el, 320);
const say = async (c, P, html, cls) => { const d = line(P, html, cls); await show(c, d); return d; };
const pt = (x, y) => pairTex(x, y);
const hideAll = (...els) => els.flat().forEach((e) => { if (e) e.style.opacity = 0; });
const put = (el, html) => { if (el._h !== html) { el._h = html; el.innerHTML = html; } };
const pm = (s) => String(s).replace(/-/g, '−');

/* ---------------- equations: the value of each side, and the substitution as TeX (from the 10C twin) ---------------- */
const wrap = (v, first) => (v < 0 && !first ? `(${texNum(v)})` : texNum(v));
/** the term k·v as TeX ("2(3)", "+(−4)", "−3") */
function term(k, v, first) {
  const a = Math.abs(k), sign = k < 0 ? '-' : first ? '' : '+';
  if (a === 1) return sign + wrap(v, first && k > 0);
  return sign + texNum(a) + `(${texNum(v)})`;
}
/** a·x + b·y = c (y has coefficient ±1 in this lesson) */
function STD(a, b, c, t) {
  return { tex: t, a, b, c, L: (x, y) => a * x + b * y, R: () => c, Ls: (x, y) => term(a, x, true) + term(b, y, false), Rs: null,
    f: (x) => (c - a * x) / b, m: -a / b, bb: c / b };
}
/** y = m·x + b */
function YF(m, b, t) {
  const tail = (x) => term(m, x, true) + (b ? (b < 0 ? '-' : '+') + texNum(Math.abs(b)) : '');
  return { tex: t, m, b, bb: b, L: (x, y) => y, R: (x) => m * x + b, Ls: null, Rs: tail, f: (x) => m * x + b };
}
/** substitute (x, y): { ok, tex } with each worked side under a brace */
function chk(eq, x, y) {
  const lv = eq.L(x, y), rv = eq.R(x, y), ok = Math.abs(lv - rv) < 1e-9;
  const side = (s, v) => (s ? `\\underbrace{${s}}_{\\textstyle ${texNum(v)}}` : texNum(v));
  return { ok, tex: `${side(eq.Ls && eq.Ls(x, y), lv)}${ok ? '=' : '\\neq '}${side(eq.Rs && eq.Rs(x, y), rv)}` };
}
const eqLine = (G, eq, o) => G.line([0, eq.f(0)], [1, eq.f(1)], o);
const mark = (ok) => (ok ? '<b class="u8l1-ok">✓</b>' : '<b class="u8l1-no">✗</b>');
/** the booklet's short check: "2-3=-1 ✓" (y = mx + b: the right side worked out) or "2+1=3 ✓" (ax + by = c: the left side) */
function flat(eq, x, y) {
  if (eq.Rs) {
    const rv = eq.R(x), ok = Math.abs(rv - y) < 1e-9, mid = Math.abs(eq.m) !== 1 && eq.b ? '=' + texNum(eq.m * x) + (eq.b < 0 ? '-' : '+') + texNum(Math.abs(eq.b)) : '';
    return { ok, tex: `${eq.Rs(x)}${mid}=${texNum(rv)}${ok ? '' : '\\neq ' + texNum(y)}` };
  }
  const lv = eq.L(x, y), ok = Math.abs(lv - eq.c) < 1e-9;
  return { ok, tex: `${eq.Ls(x, y)}=${texNum(lv)}${ok ? '' : '\\neq ' + texNum(eq.c)}` };
}
/** a one-line check row for a panel: "y=x-3:  2-3=-1  ✓" */
function flatRow(P, eq, x, y, col) {
  const r = flat(eq, x, y);
  return line(P, `<span class="u8l1-fkeq">${T(kc(col)(eq.tex))}:</span><span class="u8l1-fksub">${T(r.tex)}</span>${mark(r.ok)}`, 'u8l1-fk');
}
const okStamp = async (c, P, text, ok = true) => { const s = stamp(P, text, { ok }); s.classList.add('u8l1-pstamp'); await stampIn(c, s); return s; };

/** "up 2, right 1" for a whole-number slope */
const stepWords = (m) => `${m < 0 ? 'down' : 'up'} ${Math.abs(m)}, right 1`;
/** plot y = m x + b the way the booklet says it: the y-intercept, then (rise, then run) steps, then the whole line */
async function plotLine(G, c, m, b, color, o = {}) {
  const n = o.steps == null ? 2 : o.steps, run = o.run || 1, rise = m * run, keep = [];
  const P0 = G.point(0, b, { color, r: 7 }); await pop(c, P0, 300); keep.push(P0);
  let x = 0, y = b; const tmp = [];
  for (let i = 0; i < n; i++) {
    const s1 = G.segment([x, y], [x, y + rise], { color, width: 3, dash: true }); await G.drawIn(s1, 260, c);
    if (i === 0 && o.tags !== false) { const t = G.label(x, y + rise / 2, T(texNum(rise)), { pos: o.tagPos || 'w', cls: 'bk-ptlab u8l1-steplab', color }); await fadeIn(c, t, 200); tmp.push(t); }
    const s2 = G.segment([x, y + rise], [x + run, y + rise], { color, width: 3, dash: true }); await G.drawIn(s2, 260, c);
    if (i === 0 && o.tags !== false) { const t = G.label(x + run / 2, y + rise, T('+' + run), { pos: rise < 0 ? 's' : 'n', cls: 'bk-ptlab u8l1-steplab', color }); await fadeIn(c, t, 200); tmp.push(t); }
    x += run; y += rise; tmp.push(s1, s2);
    const p = G.point(x, y, { color, r: 6 }); await pop(c, p, 200); keep.push(p);
  }
  const L = G.line({ m, b }, { color, width: 4, dash: o.dash });
  G.layers.data.insertBefore(L, G.layers.data.firstChild);
  await G.drawIn(L, 650, c);
  G.remove(...tmp);
  let lab = null;
  if (o.label) { lab = G.label(o.label[0], o.label[1], T(o.label[3]), { cls: 'bk-ptlab u8l1-glab', color, pos: o.label[2] || 'e' }); await fadeIn(c, lab); }
  return { L, pts: keep, lab };
}

/* =============================== warm-up: the clue graph and its sticky note =============================== */
function mountWarm() {
  const host = document.getElementById('u8l1-wgraph'); if (!host) return;
  const G = new Graph(host, { width: 340, height: 340, xmin: 0, xmax: 10.6, ymin: 0, ymax: 10.6, xlabels: 2, ylabels: 2, origin: true,
    xtitle: '', ytitle: '', fontSize: 16, pad: [12, 12, 50, 56] });
  G.segment([0, 10], [10, 0], { color: RED, width: 4.5 });
  G.segment([0, 4], [6, 10], { color: BLUE, width: 4.5 });
  G.label(8.1, 3.2, 'Clue 1', { cls: 'u8l1-wlab', color: RED, pos: 'c' });
  G.label(2.0, 3.9, 'Clue 2', { cls: 'u8l1-wlab', color: BLUE, pos: 'c' });
  const tx = h('div', 'u8l1-axt u8l1-axx', 'smaller number'), ty = h('div', 'u8l1-axt u8l1-axy', 'bigger number');
  host.appendChild(tx); host.appendChild(ty);
  const S = G.point(3, 7, { color: PUR, r: 9 }), SL = G.label(3, 7, T(kp('(3,\\ 7)')), { cls: 'bk-ptlab u8l1-glab', pos: 'e', gap: 12 });
  const note = h('button', 'u8l1-sticky', '<span>?</span>'); note.type = 'button'; note.title = 'Lift the sticky note';
  G.el.appendChild(note);   // above the SVG (the html overlay lets taps through)
  const [px, py] = G.toPx(3, 7); note.style.left = px + 'px'; note.style.top = py + 'px';
  const set = (up) => { host.classList.toggle('u8l1-lifted', up); S.style.opacity = SL.style.opacity = up ? 1 : 0; };
  set(false);
  note.addEventListener('click', () => set(!host.classList.contains('u8l1-lifted')));
}

/* =============================== static figures: Example 1, the one-line figure, the example grids =============================== */
const GRID = { width: 420, height: 420, xmin: -6.6, xmax: 6.6, ymin: -6.6, ymax: 6.6, xlabels: 2, ylabels: 2, fontSize: 16 };
const EXG = {
  ex2: { lines: [{ m: 1, b: -3, col: BLUE, lab: [-1, -4, 'nw', 'y=x-3'] }, { m: -2, b: 3, col: AMB, lab: [-1, 5, 'w', 'y=-2x+3'] }], pt: [2, -1], pos: 'e' },
  ex3: { lines: [{ m: -2, b: 1, col: BLUE, lab: [-2, 5, 'w', 'y=-2x+1'] }, { m: 1, b: -5, col: AMB, lab: [4, -1, 'se', 'y=x-5'] }], pt: [2, -3], pos: 'e' },
  ex5: { lines: [{ m: -1, b: 3, col: BLUE, lab: [-1, 4, 'sw', 'y=-x+3'] }, { m: 2, b: -3, col: AMB, lab: [-1, -5, 'w', 'y=2x-3'] }], pt: [2, 1], pos: 'e' }
};
function mountStatics() {
  // Example 1: the finished graph
  const e1 = document.getElementById('u8l1-ex1fig');
  if (e1) {
    const G = new Graph(e1, Object.assign({}, GRID, { width: 380, height: 380 }));
    G.line({ m: 2, b: 2 }, { color: BLUE, width: 4 }); G.line({ m: -1, b: 5 }, { color: AMB, width: 4 });
    G.label(-3, -4, T('y=2x+2'), { cls: 'bk-ptlab u8l1-glab', color: BLUE, pos: 'w' });
    G.label(2.6, 2.4, T('y=-x+5'), { cls: 'bk-ptlab u8l1-glab', color: AMB, pos: 'ne' });
  }
  // Section 3: graphing one line from y = mx + b
  const one = document.getElementById('u8l1-onefig');
  if (one) {
    const G = new Graph(one, { width: 250, height: 300, xmin: -2.5, xmax: 4.5, ymin: -3.5, ymax: 5.5, xlabels: 2, ylabels: 2, fontSize: 15 });
    G.line({ m: -2, b: 3 }, { color: INK, width: 3.5 });
    [[0, 3, 0, 1], [1, 1, 1, -1]].forEach(([x, y]) => {
      G.segment([x, y], [x, y - 2], { color: BLUE, width: 3.5, ends: [null, 'arrow'] });
      G.segment([x, y - 2], [x + 1, y - 2], { color: BLUE, width: 3.5, ends: [null, 'arrow'] });
    });
    [[0, 3], [1, 1], [2, -1]].forEach(([x, y]) => G.point(x, y, { color: INK }));
    G.label(0, 2, T('-2'), { pos: 'w', cls: 'bk-ptlab', color: BLUE });
    G.label(0.5, 1, T('+1'), { pos: 's', cls: 'bk-ptlab', color: BLUE });
    G.label(1.1, 3.6, T('y=-2x+3'), { pos: 'e', cls: 'bk-ptlab' });
  }
  // the example grids: blank until the part's answer is shown, then the answer lines appear on the same grid
  document.querySelectorAll('[data-u8l1-grid]').forEach((host) => {
    const d = EXG[host.dataset.u8l1Grid]; if (!d) return;
    const G = new Graph(host, GRID), ans = [];
    d.lines.forEach((L) => {
      ans.push(G.line({ m: L.m, b: L.b }, { color: L.col, width: 4 }));
      ans.push(G.label(L.lab[0], L.lab[1], T(L.lab[3]), { cls: 'bk-ptlab u8l1-glab', color: L.col, pos: L.lab[2] }));
    });
    ans.push(G.point(d.pt[0], d.pt[1], { color: PUR, r: 7.5 }));
    ans.push(G.label(d.pt[0], d.pt[1], T(kp(pt(...d.pt))), { cls: 'bk-ptlab u8l1-glab', pos: d.pos, gap: 10 }));
    const part = host.closest('.part');
    const sync = () => { const on = part.classList.contains('shown'); ans.forEach((e) => { e.style.display = on ? '' : 'none'; }); };
    new MutationObserver(sync).observe(part, { attributes: true, attributeFilter: ['class'] }); sync();
  });
}

/* =============================== pairs: many pairs each, one pair for both =============================== */
const PR = {
  s1: { label: 'Section 1', e1: YF(1, 2, 'y=x+2'), e2: YF(-1, 6, 'y=-x+6'), xs: [0, 1, 2, 3, 4], sol: [2, 4], hd: ['x', 'y'],
    win: { xmin: -1.6, xmax: 8.6, ymin: -1.6, ymax: 8.6 }, l1: [5, 7, 'se'], l2: [-0.9, 7.3, 'e'] },
  wu: { label: 'Warm-up: the two clues', e1: STD(1, 1, 10, 'x+y=10'), e2: YF(1, 4, 'y=x+4'), xs: [1, 2, 3, 4], sol: [3, 7], hd: ['x', 'y'],
    names: ['Clue 1: add to 10', 'Clue 2: 4 more'], win: { xmin: 0, xmax: 10.6, ymin: 0, ymax: 10.6, origin: true }, l1: [8, 2, 'ne'], l2: [5.4, 9.4, 'w'] }
};
const pairs = {
  title: 'Many pairs for each equation, one pair for both',
  height: 470,
  minW: 900,
  choices: [{ v: 's1', label: PR.s1.label + ': ' + T('y=x+2,\\ y=-x+6') }, { v: 'wu', label: PR.wu.label }],
  ask: (k) => (k === 's1' ? `Which pair makes ${T(k1('y=x+2'))} and ${T(k2('y=-x+6'))} true at the same time?`
    : `The warm-up riddle. ${T('x')} = smaller number, ${T('y')} = bigger number. Clue 1: ${T(k1('x+y=10'))}. Clue 2: ${T(k2('y=x+4'))}.`),
  make(stage, k, ex) {
    const d = PR[k], W = ex.W, [sx, sy] = d.sol, si = d.xs.indexOf(sx);
    const G = new Graph(stage, Object.assign({ x: W - 462, y: 10, width: 450, height: 450, xlabels: 2, ylabels: 2 }, d.win));
    const cw = 80, ch = d.xs.length > 4 ? 42 : 46, tw = cw * 2;
    const mk = (eq, i) => {
      const col = i ? AMB : BLUE, x0 = 24 + i * (tw + 34);
      const hd = add(stage, box(h('div', 'u8l1-thd', d.names ? `<small>${d.names[i]}</small>${T(kc(col)(eq.tex))}` : T(kc(col)(eq.tex))), tw + 30, 52), x0 - 15, 6);
      const tb = new ValueTable(stage, { x: x0, y: 62, headers: d.hd, rows: d.xs.map((x) => [x, eq.f(x)]), hide: 1, tap: false, cellW: cw, cellH: ch, cls: 'u8l1-vt u8l1-vt' + (i + 1) });
      return { hd, tb, col, eq };
    };
    const A = mk(d.e1, 0), B = mk(d.e2, 1);
    const P = panel(stage, 10, 62 + ch * (d.xs.length + 1) + 14, 2 * tw + 52, 470 - (62 + ch * (d.xs.length + 1) + 14) - 10, '', 'u8l1-pp');
    const fill = async (c, S) => {
      for (let i = 0; i < d.xs.length; i++) { await S.tb.reveal(i, 1, c); await pop(c, G.point(d.xs[i], S.eq.f(d.xs[i]), { color: S.col, r: 7 }), 200); }
    };
    let ring = null;
    const steps = [
      { cap: `${T(k1(d.e1.tex))}: pick an ${T('x')}, work out ${T('y')}. Every row is a pair that makes it <b>true</b>.`, run: (c) => fill(c, A) },
      { cap: `${T(k2(d.e2.tex))} has its <b>own</b> list of pairs.`, run: (c) => fill(c, B) }
    ];
    if (k === 'wu') {
      steps.push({ cap: `Careful: ${T('6')} is in both ${T('y')}-columns, but with <b>different partners</b>: ${T('(4,\\ 6)')} and ${T('(2,\\ 6)')}. Different pairs, different points.`,
        run: async (c) => {
          const a = A.tb.cell(3, 1), b = B.tb.cell(1, 1); a.classList.add('u8l1-trap'); b.classList.add('u8l1-trap');
          await shake(c, a); await shake(c, b);
          const p1 = G.label(4, 6, '✗', { cls: 'u8l1-xmark', pos: 'c' }), p2 = G.label(2, 6, '✗', { cls: 'u8l1-xmark', pos: 'c' });
          await fadeIn(c, p1); await fadeIn(c, p2);
        } });
    }
    steps.push(
      { cap: `Only <b>one pair</b> is in both tables: ${T(kp(pt(sx, sy)))}.`, run: async (c) => {
        A.tb.highlight(si, true, 'u8l1-hlp'); B.tb.highlight(si, true, 'u8l1-hlp');
        ring = svgEl('circle', { class: 'u8l1-ring', r: 16 }, G.layers.top); const [px, py] = G.toPx(sx, sy); ring.setAttribute('cx', px); ring.setAttribute('cy', py);
        await pop(c, ring, 360);
      } },
      { cap: `Check it in both: ${T(flat(d.e1, sx, sy).tex)} ✓ and ${T(flat(d.e2, sx, sy).tex)} ✓. It makes <b>both</b> true: the <b>solution to the system</b>.`,
        run: async (c) => { await show(c, flatRow(P, d.e1, sx, sy, BLUE)); await show(c, flatRow(P, d.e2, sx, sy, AMB)); } },
      { cap: `Each table’s points line up into a <b>line</b>. The lines <b>cross</b> at ${T(kp(pt(sx, sy)))}: the pair that is in both tables.`, run: async (c) => {
        for (const [eq, col, l] of [[d.e1, BLUE, d.l1], [d.e2, AMB, d.l2]]) {
          const L = eqLine(G, eq, { color: col, width: 4 }); G.layers.data.insertBefore(L, G.layers.data.firstChild); await G.drawIn(L, 700, c);
          await fadeIn(c, G.label(l[0], l[1], T(eq.tex), { pos: l[2], cls: 'bk-ptlab u8l1-glab', color: col }));
        }
        const S = G.point(sx, sy, { color: PUR, r: 9 }); await G.reveal(S, c);
        await fadeIn(c, G.label(sx, sy, T(kp(pt(sx, sy))), { pos: k === 'wu' ? 'w' : 'e', cls: 'bk-ptlab u8l1-glab', gap: 14 }));
        await pulse(c, S, 1.5);
      } });
    return steps;
  }
};

/* =============================== dragLab: drag the point, ✓/✗ for each equation =============================== */
const DL = {
  s1: { label: 'Section 1: ' + T('y=x+2,\\ y=-x+6'), e1: YF(1, 2, 'y=x+2'), e2: YF(-1, 6, 'y=-x+6'), win: { xmin: -2.5, xmax: 8.5, ymin: -2.5, ymax: 8.5 },
    start: [6, 6], tour: [[1, 3], [4, 2], [2, 4]], l1: [4, 6, 'se'], l2: [-1.4, 7.4, 'e'] },
  ex1: { label: 'Example 1 check', e1: YF(2, 2, 'y=2x+2'), e2: YF(-1, 5, 'y=-x+5'), win: { xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2 },
    start: [4, -3], tour: [[0, 2], [3, 2], [1, 4]], l1: [-3, -4, 'w'], l2: [3.4, 1.6, 'ne'] },
  ex5: { label: 'Example 5 check', e1: STD(1, 1, 3, 'x+y=3'), e2: YF(2, -3, 'y=2x-3'), win: { xmin: -6.5, xmax: 6.5, ymin: -6.5, ymax: 6.5, xlabels: 2, ylabels: 2 },
    start: [-3, -4], tour: [[0, 3], [3, 3], [2, 1]], l1: [-1, 4, 'sw'], l2: [-1, -5, 'w'] }
};
const dragLab = {
  title: 'Drag the point: ✓ or ✗ for each equation',
  height: 480,
  minW: 900,
  choices: [{ v: 's1', label: DL.s1.label }, { sep: 'Check' }, { v: 'ex1', label: DL.ex1.label }, { v: 'ex5', label: DL.ex5.label }],
  ask: (k) => `Which point is on <b>both</b> ${T(k1(DL[k].e1.tex))} and ${T(k2(DL[k].e2.tex))}? Drag the point, or press <b>Next</b> for a tour.`,
  make(stage, k, ex) {
    const d = DL[k], w = d.win;
    const G = new Graph(stage, Object.assign({ x: 12, y: 14, width: 452, height: 452 }, w));
    G.el.classList.add('u8l1-drag'); G.el.setAttribute('data-tap', '');
    eqLine(G, d.e1, { color: BLUE, width: 4 }); eqLine(G, d.e2, { color: AMB, width: 4 });
    G.label(d.l1[0], d.l1[1], T(d.e1.tex), { pos: d.l1[2], cls: 'bk-ptlab u8l1-glab', color: BLUE });
    G.label(d.l2[0], d.l2[1], T(d.e2.tex), { pos: d.l2[2], cls: 'bk-ptlab u8l1-glab', color: AMB });
    const P = panel(stage, 486, 14, ex.W - 500, 452, 'Is the point on each line?', 'u8l1-dp');
    const ro = line(P, '', 'u8l1-dro');
    const rows = [d.e1, d.e2].map((eq, i) => {
      const r = h('div', 'u8l1-drow ' + (i ? 'u8l1-drow2' : 'u8l1-drow1'), `<div class="u8l1-dh">${T(eq.tex)}</div><div class="u8l1-dsub"></div><div class="u8l1-dmk"></div>`);
      P.appendChild(r); return { r, sub: r.querySelector('.u8l1-dsub'), mk: r.querySelector('.u8l1-dmk'), eq };
    });
    const verdict = line(P, '', 'u8l1-dverd');
    const halo = svgEl('circle', { class: 'u8l1-halo', r: 17 }, G.layers.top);
    const dot = G.point(d.start[0], d.start[1], { color: INK, r: 10, cls: 'u8l1-dragpt' });
    G.track(halo, () => { const [px, py] = G.toPx(dot.gx, dot.gy); halo.setAttribute('cx', px); halo.setAttribute('cy', py); });
    const upd = () => {
      const x = dot.gx, y = dot.gy, a = chk(d.e1, x, y), b = chk(d.e2, x, y);
      put(ro, T(pt(x, y))); halo._bkDraw();
      [a, b].forEach((r, i) => { put(rows[i].sub, T(r.tex)); put(rows[i].mk, mark(r.ok)); rows[i].r.classList.toggle('u8l1-good', r.ok); rows[i].r.classList.toggle('u8l1-bad', !r.ok); });
      const col = a.ok && b.ok ? PUR : a.ok ? BLUE : b.ok ? AMB : INK;
      dot.querySelector('circle').setAttribute('fill', col); halo.setAttribute('stroke', col); halo.style.opacity = a.ok && b.ok ? 1 : 0;
      verdict.className = 'u8l1-line u8l1-dverd ' + (a.ok && b.ok ? 'u8l1-win' : '');
      put(verdict, a.ok && b.ok ? '✓ ✓ On <b>both</b> lines: the solution!' : a.ok || b.ok ? 'On one line only: <b>not</b> the solution' : 'On neither line');
    };
    upd();
    // dragging (finger and Pencil): snap to whole numbers inside the window
    const lo = [Math.ceil(w.xmin), Math.ceil(w.ymin)], hi = [Math.floor(w.xmax), Math.floor(w.ymax)];
    const snapTo = (e) => { const [x, y] = G.fromEvent(e); return [Math.max(lo[0], Math.min(hi[0], Math.round(x))), Math.max(lo[1], Math.min(hi[1], Math.round(y)))]; };
    let drag = false;
    const go = (e) => { const [x, y] = snapTo(e); if (x !== dot.gx || y !== dot.gy) { G.moveTo(dot, x, y); upd(); } };
    G.svg.addEventListener('pointerdown', (e) => { if (e.button > 0) return; e.preventDefault(); drag = true; try { G.svg.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } go(e); });
    G.svg.addEventListener('pointermove', (e) => { if (drag) go(e); });
    const up = () => { drag = false; }; G.svg.addEventListener('pointerup', up); G.svg.addEventListener('pointercancel', up);
    const capFor = (x, y) => {
      const a = chk(d.e1, x, y).ok, b = chk(d.e2, x, y).ok, p = T(pt(x, y));
      return a && b ? `${p}: ✓ for ${T(k1(d.e1.tex))} <b>and</b> ✓ for ${T(k2(d.e2.tex))}. On <b>both</b> lines: the <b>solution</b> to the system.`
        : a ? `${p}: ✓ for ${T(k1(d.e1.tex))}, but ✗ for ${T(k2(d.e2.tex))}. On the blue line only.`
          : b ? `${p}: ✗ for ${T(k1(d.e1.tex))}, but ✓ for ${T(k2(d.e2.tex))}. On the amber line only.`
            : `${p}: ✗ and ✗. On neither line.`;
    };
    const steps = d.tour.map(([x, y]) => ({ cap: capFor(x, y), run: async (c) => { await G.move(c, dot, x, y, 700); upd(); await pulse(c, P, 1.015); } }));
    steps.push({ cap: `Your turn: drag the point anywhere. <b>Only one point</b> gets ✓ ✓: the point where the lines cross.`, run: (c) => pulse(c, dot, 1.5) });
    return steps;
  }
};

/* =============================== readGraph: Example 1 =============================== */
const E1 = { e1: YF(2, 2, 'y=2x+2'), e2: YF(-1, 5, 'y=-x+5'), sol: [1, 4] };
const readGraph = {
  title: 'Read the crossing point, then check it',
  height: 470,
  minW: 900,
  choices: [{ v: 'ex1', label: 'Example 1 check' }, { v: 'swap', label: 'The slip: ' + T('(4,\\ 1)') + '?' }],
  ask: (k) => (k === 'ex1' ? `Example 1: the system ${T(k1('y=2x+2'))} and ${T(k2('y=-x+5'))} is graphed. State the solution.`
    : `Someone wrote the answer to Example 1 as ${T('(4,\\ 1)')}. Is that the solution?`),
  make(stage, k, ex) {
    const G = new Graph(stage, Object.assign({}, GRID, { x: 14, y: 14, width: 442, height: 442 }));
    eqLine(G, E1.e1, { color: BLUE, width: 4 }); eqLine(G, E1.e2, { color: AMB, width: 4 });
    G.label(-3, -4, T('y=2x+2'), { pos: 'w', cls: 'bk-ptlab u8l1-glab', color: BLUE }); G.label(2.6, 2.4, T('y=-x+5'), { pos: 'ne', cls: 'bk-ptlab u8l1-glab', color: AMB });
    const P = panel(stage, 486, 14, ex.W - 500, 442, k === 'ex1' ? 'Read it' : 'Check the swapped pair');
    const [sx, sy] = E1.sol;
    if (k === 'ex1') {
      let S;
      return [
        { cap: `The lines cross <b>here</b>.`, run: async (c) => { S = G.point(sx, sy, { color: PUR, r: 9 }); await G.reveal(S, c); await pulse(c, S, 1.5); } },
        { cap: `Straight down to the ${T('x')}-axis: ${T('x=1')}.`, run: async (c) => {
          await G.drawIn(G.segment([sx, sy], [sx, 0], { color: PUR, width: 3, dash: true }), 500, c);
          await fadeIn(c, G.label(sx, 0, T('1'), { pos: 's', cls: 'bk-ptlab u8l1-axlab', color: PUR, gap: 4 })); await say(c, P, `${T('x=1')} <span class="u8l1-sm">(1 right)</span>`, 'u8l1-big');
        } },
        { cap: `Straight across to the ${T('y')}-axis: ${T('y=4')}.`, run: async (c) => {
          await G.drawIn(G.segment([sx, sy], [0, sy], { color: PUR, width: 3, dash: true }), 500, c);
          await fadeIn(c, G.label(0, sy, T('4'), { pos: 'w', cls: 'bk-ptlab u8l1-axlab', color: PUR, gap: 4 })); await say(c, P, `${T('y=4')} <span class="u8l1-sm">(4 up)</span>`, 'u8l1-big');
        } },
        { cap: `Write it as an ordered pair, <b>${T('x')} first</b>: ${T('(1,\\ 4)')}.`, run: async (c) => { await say(c, P, T(kp('(1,\\ 4)')), 'u8l1-huge'); await fadeIn(c, G.label(sx, sy, T(kp('(1,\\ 4)')), { pos: 'e', cls: 'bk-ptlab u8l1-glab', gap: 12 })); } },
        { cap: `Check in ${T(k1('y=2x+2'))}: ${T('2(1)+2=4')} ✓`, run: (c) => show(c, flatRow(P, E1.e1, sx, sy, BLUE)) },
        { cap: `Check in ${T(k2('y=-x+5'))}: ${T('-1+5=4')} ✓. On <b>both</b> lines, so ${T('(1,\\ 4)')} is the solution.`,
          run: async (c) => { await show(c, flatRow(P, E1.e2, sx, sy, AMB)); await okStamp(c, P, 'Solution (1, 4)'); } }
      ];
    }
    let Q, QL;
    return [
      { cap: `A common slip: the numbers <b>swapped</b>. Plot ${T('(4,\\ 1)')}: 4 right, 1 up.`, run: async (c) => {
        Q = G.point(4, 1, { color: INK, r: 9 }); await G.reveal(Q, c); QL = G.label(4, 1, T('(4,\\ 1)'), { pos: 'se', cls: 'bk-ptlab u8l1-glab', gap: 10 }); await fadeIn(c, QL);
      } },
      { cap: `Check in ${T(k1('y=2x+2'))}: ${T('2(4)+2=10')}, not ${T('1')}. ✗`, run: (c) => show(c, flatRow(P, E1.e1, 4, 1, BLUE)) },
      { cap: `Check in ${T(k2('y=-x+5'))}: ${T('-4+5=1')} ✓. It passes <b>one</b> check, but not both: ${T('(4,\\ 1)')} is on the amber line only.`, run: async (c) => {
        await show(c, flatRow(P, E1.e2, 4, 1, AMB)); await okStamp(c, P, 'Not the solution', false);
      } },
      { cap: `Swap back, ${T('x')} first: ${T('(1,\\ 4)')} is where the lines cross. ✓ ✓`, run: async (c) => {
        P.querySelectorAll('.u8l1-fk, .bk-stamp').forEach((e) => e.remove()); QL.style.opacity = 0;
        await G.move(c, Q, sx, sy, 900); Q.querySelector('circle').setAttribute('fill', PUR);
        await fadeIn(c, G.label(sx, sy, T(kp('(1,\\ 4)')), { pos: 'e', cls: 'bk-ptlab u8l1-glab', gap: 12 }));
        await say(c, P, `${T(kp('(1,\\ 4)'))}`, 'u8l1-big'); await show(c, flatRow(P, E1.e1, sx, sy, BLUE)); await show(c, flatRow(P, E1.e2, sx, sy, AMB));
      } }
    ];
  }
};

/* =============================== byHand: the four steps (Examples 2, 3, 5) =============================== */
const BH = {
  ex2: { label: 'Example 2', e1: YF(1, -3, 'y=x-3'), e2: YF(-2, 3, 'y=-2x+3'), sol: [2, -1],
    l1: [-1, -4, 'nw'], l2: [-1, 5, 'w'], sp: 'e' },
  ex3: { label: 'Example 3', e1: STD(2, 1, 1, '2x+y=1'), r1: { tex: 'y=-2x+1', how: `subtract ${T('2x')} from each side` }, e2: YF(1, -5, 'y=x-5'), sol: [2, -3],
    l1: [-2, 5, 'w'], l2: [4, -1, 'se'], sp: 'e' },
  ex5: { label: 'Example 5', e1: STD(1, 1, 3, 'x+y=3'), r1: { tex: 'y=-x+3', how: `subtract ${T('x')} from each side` }, e2: YF(2, -3, 'y=2x-3'), sol: [2, 1],
    l1: [-1, 4, 'sw'], l2: [-1, -5, 'w'], sp: 'e', orig: true }
};
const STEPS4 = ['Rewrite as ' + T('y=mx+b'), 'Graph both lines', 'Find where they cross', 'State ' + T('(x,\\ y)') + ', then check'];
function byHandDef(first) {
  return {
    title: 'Solve by graphing: the four steps',
    height: 480,
    minW: 900,
    value: first,
    choices: Object.keys(BH).map((k) => ({ v: k, label: BH[k].label + ' check' })),
    ask: (k) => `${BH[k].label}: solve the system ${T(k1(BH[k].e1.tex))} and ${T(k2(BH[k].e2.tex))} by graphing.`,
    make(stage, k, ex) {
      const d = BH[k], [sx, sy] = d.sol;
      const G = new Graph(stage, Object.assign({}, GRID, { x: 12, y: 14, width: 452, height: 452 }));
      const P = panel(stage, 486, 14, ex.W - 500, 452, '', 'u8l1-bp');
      const list = h('div', 'u8l1-slist', STEPS4.map((s, i) => `<div><b class="n">${i + 1}</b>${s}</div>`).join('')); P.appendChild(list);
      const rows = [...list.children];
      const on = (i) => rows.forEach((r, j) => { r.classList.toggle('u8l1-on', j === i); r.classList.toggle('u8l1-done', j < i); });
      const m1 = d.e1.m, b1 = d.e1.bb, m2 = d.e2.m, b2 = d.e2.bb;
      const t1 = d.r1 ? d.r1.tex : d.e1.tex;
      const steps = [
        { cap: d.r1 ? `<b>Step 1:</b> ${T(k1(d.e1.tex))} is not in ${T('y=mx+b')} form yet: ${d.r1.how}. ${T(k1(d.r1.tex))}.`
          : `<b>Step 1:</b> both equations are already in ${T('y=mx+b')} form. Nothing to rewrite.`,
        run: async (c) => {
          on(0);
          if (d.r1) { await say(c, P, `${T(k1(d.e1.tex + '\\ \\Rightarrow\\ ' + d.r1.tex))}`, 'u8l1-wk'); }
          else await say(c, P, `${T(k1(d.e1.tex))} and ${T(k2(d.e2.tex))} ✓`, 'u8l1-wk');
        } },
        { cap: `<b>Step 2:</b> ${T(k1(t1))}: start at ${T(pt(0, b1))}, then ${stepWords(m1)}. Draw the line.`, run: async (c) => {
          on(1); await say(c, P, `${T(k1(t1))}: ${T('b=' + texNum(b1))}, ${stepWords(m1)}`, 'u8l1-wk2');
          await plotLine(G, c, m1, b1, BLUE, { label: [...d.l1, k1(t1)], tagPos: m1 < 0 ? 'w' : 'e' });
        } },
        { cap: `${T(k2(d.e2.tex))}: start at ${T(pt(0, b2))}, then ${stepWords(m2)}. Draw the line.`, run: async (c) => {
          await say(c, P, `${T(k2(d.e2.tex))}: ${T('b=' + texNum(b2))}, ${stepWords(m2)}`, 'u8l1-wk2');
          await plotLine(G, c, m2, b2, AMB, { label: [...d.l2, k2(d.e2.tex)], tagPos: m2 < 0 ? 'w' : 'e' });
        } },
        { cap: `<b>Step 3:</b> the lines cross at ${T(kp(pt(sx, sy)))}. (Both lines reach it after two slope steps.)`, run: async (c) => {
          on(2); const S = G.point(sx, sy, { color: PUR, r: 9 }); await G.reveal(S, c);
          await fadeIn(c, G.label(sx, sy, T(kp(pt(sx, sy))), { pos: d.sp, cls: 'bk-ptlab u8l1-glab', gap: 12 })); await pulse(c, S, 1.5);
        } },
        { cap: `<b>Step 4:</b> the solution is ${T(kp(pt(sx, sy)))}. Check it in both ${d.r1 ? '<b>original</b> ' : ''}equations: ✓ and ✓.`, run: async (c) => {
          on(3); await say(c, P, `Solution: ${T(kp(pt(sx, sy)))}`, 'u8l1-big');
          await show(c, flatRow(P, d.e1, sx, sy, BLUE)); await show(c, flatRow(P, d.e2, sx, sy, AMB));
          on(4); await okStamp(c, P, `Solution ${pm(`(${sx}, ${sy})`)}`);
        } }
      ];
      return steps;
    }
  };
}
const byHand = byHandDef('ex2'), byHand3 = byHandDef('ex3'), byHand5 = byHandDef('ex5');

/* =============================== rearrange: Step 1, get y alone =============================== */
const RE = {
  ex3: { label: 'Example 3 (a)', ask: `Example 3 (a): rewrite ${T('2x+y=1')} in slope-intercept form.`, start: '2x+y=1', t: '2x', tN: '-2x',
    sub: `2x\\textcolor{${RED}}{-2x}+y=1\\textcolor{${RED}}{-2x}`, cancel: `\\cancel{2x}\\,\\cancel{\\textcolor{${RED}}{-2x}}+y=1\\textcolor{${RED}}{-2x}`,
    lhs: 'y={}', A: '1', B: '{}-2x', B2: '-2x', A2: '{}+1', m: -2, b: 1, win: { xmin: -3.5, xmax: 4.5, ymin: -4.5, ymax: 4.5 } },
  ex5: { label: 'Example 5 (a)', ask: `Example 5 (a): rewrite ${T('x+y=3')} in slope-intercept form.`, start: 'x+y=3', t: 'x', tN: '-x',
    sub: `x\\textcolor{${RED}}{-x}+y=3\\textcolor{${RED}}{-x}`, cancel: `\\cancel{x}\\,\\cancel{\\textcolor{${RED}}{-x}}+y=3\\textcolor{${RED}}{-x}`,
    lhs: 'y={}', A: '3', B: '{}-x', B2: '-x', A2: '{}+3', m: -1, b: 3, win: { xmin: -2.5, xmax: 5.5, ymin: -2.5, ymax: 5.5 } },
  wu: { label: 'Warm-up: Clue 1', ask: `Warm-up Clue 1, “they add to 10”: rewrite ${T('x+y=10')} in slope-intercept form.`, start: 'x+y=10', t: 'x', tN: '-x',
    sub: `x\\textcolor{${RED}}{-x}+y=10\\textcolor{${RED}}{-x}`, cancel: `\\cancel{x}\\,\\cancel{\\textcolor{${RED}}{-x}}+y=10\\textcolor{${RED}}{-x}`,
    lhs: 'y={}', A: '10', B: '{}-x', B2: '-x', A2: '{}+10', m: -1, b: 10, win: { xmin: -1.5, xmax: 11.5, ymin: -1.5, ymax: 11.5, xlabels: 2, ylabels: 2 } },
  neg: { label: 'With ' + T('-y') + ': ' + T('2x-y=4'), ask: `What if the ${T('y')} has a minus sign? Rewrite ${T('2x-y=4')} in slope-intercept form.`, start: '2x-y=4', t: '2x', tN: '-2x',
    sub: `2x\\textcolor{${RED}}{-2x}-y=4\\textcolor{${RED}}{-2x}`, cancel: `\\cancel{2x}\\,\\cancel{\\textcolor{${RED}}{-2x}}-y=4\\textcolor{${RED}}{-2x}`,
    lhs: '-y={}', A: '4', B: '{}-2x', B2: '-2x', A2: '{}+4', flip: 'y=2x-4', m: 2, b: -4, win: { xmin: -2.5, xmax: 5.5, ymin: -5.5, ymax: 3.5 } }
};
const rearrange = {
  title: 'Step 1: get y alone',
  height: 470,
  minW: 900,
  choices: [{ v: 'ex3', label: RE.ex3.label }, { v: 'ex5', label: RE.ex5.label }, { v: 'wu', label: RE.wu.label }, { sep: 'Watch out' }, { v: 'neg', label: RE.neg.label }],
  ask: (k) => RE[k].ask,
  make(stage, k, ex) {
    const d = RE[k], W = ex.W, LW = W - 400;
    const G = new Graph(stage, Object.assign({ x: W - 384, y: 40, width: 372, height: 372, xlabels: 1, ylabels: 1, fontSize: 15 }, d.win));
    const col = add(stage, box(h('div', 'u8l1-rcol'), LW - 20, 456), 10, 6);
    const row = (html, note = '') => { const r = h('div', 'u8l1-rrow', `<div class="u8l1-rmath">${html}</div><div class="u8l1-rnote">${note}</div>`); col.appendChild(r); r.style.opacity = 0; return r; };
    const r1 = row(T(d.start), 'the equation');
    const r2 = row(T(d.sub), `subtract ${T(d.t)} from <b>each</b> side`);
    // the reorder row: tokens that can move
    const tok = (s, cls = '') => `<span class="u8l1-tok ${cls}">${T(s)}</span>`;
    const r3 = row(`${tok(d.lhs)}${tok(d.A, 'u8l1-tA')}${tok(d.B, 'u8l1-tB')}`, `${T(d.t + '-' + d.t + '=0')}: gone from the left`);
    const r4 = row(`${tok(d.lhs)}${tok(d.B2, 'u8l1-tB')}${tok(d.A2, 'u8l1-tA')}`, `<b>${T('x')}-term first</b>, keeping its sign`);
    const r5 = d.flip ? row(T(d.flip), `change <b>every</b> sign to get ${T('y')}, not ${T('-y')}`) : null;
    const fin = d.flip || d.lhs + d.B2 + d.A2;
    const tags = add(stage, box(h('div', 'u8l1-rtags', `<span class="u8l1-rtm">slope ${T('m=' + d.m)}</span><span class="u8l1-rtb">${T('y')}-intercept ${T('b=' + d.b)}</span>`), LW - 20, 40), 10, 418);
    tags.style.opacity = 0;
    const steps = [
      { cap: `The goal: ${T('y')} <b>by itself</b> on the left. Right now ${T(d.t)} is on the same side as ${T('y')}.`, run: async (c) => { await show(c, r1); r1.querySelector('.u8l1-rmath').classList.add('u8l1-hlx'); } },
      { cap: `To undo ${T('+' + d.t)}, <b>subtract ${T(d.t)} from each side</b>. Both sides change the same way, so the equation stays true.`, run: (c) => show(c, r2) },
      { cap: `${T(d.t + '-' + d.t + '=0')}: on the left, they cancel. What is left: ${T(d.lhs + d.A + d.B)}.`, run: async (c) => {
        r2.querySelector('.u8l1-rmath').innerHTML = T(d.cancel); await sleep(c, 250); await show(c, r3);
      } },
      { cap: `Write the ${T('x')}-term first, the way ${T('y=mx+b')} does. The minus sign <b>moves with</b> its term: ${T(d.lhs + d.B2 + d.A2)}.`, run: async (c) => {
        r4.style.opacity = 1;
        // FLIP: each token starts where it sits in the row above, then slides into place
        const s = ex.scale || 1;
        const pairsOf = [['.u8l1-tA', '.u8l1-tA'], ['.u8l1-tB', '.u8l1-tB']];
        const anims = pairsOf.map(([a, b]) => {
          const from = r3.querySelector(a).getBoundingClientRect(), el = r4.querySelector(b), to = el.getBoundingClientRect();
          const dx = (from.left - to.left) / s, dy = (from.top - to.top) / s;
          return c.anim(el, [{ transform: `translate(${dx}px, ${dy}px)`, opacity: 0.5 }, { transform: 'none', opacity: 1 }], 900);
        });
        await Promise.all(anims);
      } }
    ];
    if (d.flip) steps.push({ cap: `This says ${T('-y')}, not ${T('y')}. Multiply <b>every</b> term by ${T('-1')} (change every sign): ${T(d.flip)}.`, run: (c) => show(c, r5) });
    steps.push({ cap: `Now it is in ${T('y=mx+b')} form: slope ${T('m=' + d.m)}, ${T('y')}-intercept ${T('b=' + d.b)}. Ready to graph.`, run: async (c) => {
      const last = (r5 || r4).querySelector('.u8l1-rmath'); last.classList.add('u8l1-fin');
      await show(c, tags);
      await plotLine(G, c, d.m, d.b, BLUE, { steps: k === 'wu' ? 1 : 2, tagPos: d.m < 0 ? 'w' : 'e' });
      const w = G.win, ly = d.m < 0 ? w.ymax - 0.2 : w.ymin + 0.2;   // the corner the line keeps away from
      await fadeIn(c, G.label(w.xmax - 0.2, ly, T(k1(fin.replace(/\{\}/g, ''))), { pos: d.m < 0 ? 'sw' : 'nw', cls: 'bk-ptlab u8l1-glab' }));
    } });
    return steps;
  }
};

/* =============================== check: substitute into both =============================== */
const CK = {
  a: { label: 'Example 4 (a)', p: [3, 1], e1: YF(2, -5, 'y=2x-5'), e2: YF(-1, 4, 'y=-x+4'), win: { xmin: -2.5, xmax: 6.5, ymin: -5.5, ymax: 6.5 },
    parts: [['@y', '=2', '@x', '-5'], ['@y', '=-', '@x', '+4']], l1: [0.8, -4.8, 'se'], l2: [-1.6, 5.6, 'e'], pp: 'w' },
  b: { label: 'Example 4 (b)', p: [2, 3], e1: YF(3, -4, 'y=3x-4'), e2: YF(-2, 9, 'y=-2x+9'), win: { xmin: -1.5, xmax: 5.5, ymin: -3.5, ymax: 9.5 },
    parts: [['@y', '=3', '@x', '-4'], ['@y', '=-2', '@x', '+9']], l1: [0.4, -2.8, 'e'], l2: [4.25, 0.5, 'w'], pp: 'w' },
  wu: { label: 'Warm-up: is it ' + T('(2,\\ 8)') + '?', p: [2, 8], e1: STD(1, 1, 10, 'x+y=10'), e2: YF(1, 4, 'y=x+4'), win: { xmin: 0, xmax: 10.6, ymin: 0, ymax: 10.6, origin: true, xlabels: 2, ylabels: 2 },
    parts: [['@x', '+', '@y', '=10'], ['@y', '=', '@x', '+4']], l1: [8, 2, 'ne'], l2: [5.4, 9.4, 'w'], pp: 'ne', maya: true }
};
const check = {
  title: 'Check a solution: substitute into both equations',
  height: 480,
  minW: 900,
  choices: [{ v: 'a', label: CK.a.label }, { v: 'b', label: CK.b.label }, { sep: 'Warm-up' }, { v: 'wu', label: CK.wu.label }],
  ask: (k) => (CK[k].maya ? `Maya says the warm-up numbers are 2 and 8. Is ${T('(2,\\ 8)')} the solution to ${T(k1('x+y=10'))} and ${T(k2('y=x+4'))}?`
    : `${CK[k].label}: is ${T(pt(...CK[k].p))} the solution to ${T(k1(CK[k].e1.tex))} and ${T(k2(CK[k].e2.tex))}?`),
  make(stage, k, ex) {
    const d = CK[k], W = ex.W, [px, py] = d.p, LW = W - 430;
    const G = new Graph(stage, Object.assign({ x: W - 418, y: 34, width: 406, height: 406, xlabels: 1, ylabels: 1, fontSize: 15 }, d.win));
    eqLine(G, d.e1, { color: BLUE, width: 4 }); eqLine(G, d.e2, { color: AMB, width: 4 });
    G.label(d.l1[0], d.l1[1], T(d.e1.tex), { pos: d.l1[2], cls: 'bk-ptlab u8l1-glab', color: BLUE });
    G.label(d.l2[0], d.l2[1], T(d.e2.tex), { pos: d.l2[2], cls: 'bk-ptlab u8l1-glab', color: AMB });
    // the pair, with its x and y as separate tiles
    const pair = add(stage, h('div', 'u8l1-pair', `${T('(')}<span class="u8l1-pv u8l1-pvx">${T(px)}<small>${T('x')}</small></span>${T(',')}<span class="u8l1-pv u8l1-pvy">${T(py)}<small>${T('y')}</small></span>${T(')')}`), LW / 2, 8);
    pair.style.translate = '-50% 0'; pair.style.opacity = 0;
    // one row per equation: the equation with slots for x and y, then the worked check
    const mkRow = (eq, parts, col, y0) => {
      const r = add(stage, box(h('div', 'u8l1-crow u8l1-crow' + (col === AMB ? 2 : 1)), LW - 20, 150), 10, y0);
      const ln = h('div', 'u8l1-cslots');
      parts.forEach((p, i) => {
        if (p[0] === '@') { const v = p[1], s = h('span', 'u8l1-slot', T(v)); s.dataset.v = v; s.dataset.i = i; ln.appendChild(s); } else ln.appendChild(h('span', 'u8l1-cfix', T(/^[+-]/.test(p) && i > 0 ? '{}' + p + (p.length === 1 ? '{}' : '') : p)));
      });
      r.appendChild(h('div', 'u8l1-ctag', T(kc(col)(eq.tex)))); r.appendChild(ln);
      const res = h('div', 'u8l1-cres'); r.appendChild(res); r.style.opacity = 0;
      return { r, ln, res, eq, col, parts };
    };
    const R1 = mkRow(d.e1, d.parts[0], BLUE, 98), R2 = mkRow(d.e2, d.parts[1], AMB, 262);
    const PT = G.point(px, py, { color: INK, r: 8.5 }); PT.style.opacity = 0;
    const PL = G.label(px, py, T(pt(px, py)), { pos: d.pp, cls: 'bk-ptlab u8l1-glab', gap: 10 }); PL.style.opacity = 0;
    const valOf = (v) => (v === 'x' ? px : py);
    /** the number shown in a slot: brackets after a coefficient or a minus sign, or for a negative number */
    const slotText = (R, s) => {
      const i = +s.dataset.i, prev = i > 0 ? R.parts[i - 1] : '', val = valOf(s.dataset.v);
      const br = /[0-9-]$/.test(prev) || (val < 0 && /[+]$/.test(prev));
      return br ? `(${val})` : String(val);
    };
    const sub = async (c, R) => {
      await show(c, R.r);
      const s = ex.scale || 1, src = { x: pair.querySelector('.u8l1-pvx'), y: pair.querySelector('.u8l1-pvy') };
      const flies = [...R.ln.querySelectorAll('.u8l1-slot')].map(async (slot) => {
        const v = slot.dataset.v, from = src[v].getBoundingClientRect(), to = slot.getBoundingClientRect();
        slot.innerHTML = T(kp(slotText(R, slot))); slot.classList.add('u8l1-filled');
        const to2 = slot.getBoundingClientRect();
        const dx = (from.left + from.width / 2 - (to2.left + to2.width / 2)) / s, dy = (from.top - to2.top) / s;
        void to;
        await c.anim(slot, [{ transform: `translate(${dx}px, ${dy}px) scale(1.2)`, opacity: 0.6 }, { transform: 'none', opacity: 1 }], 800);
      });
      await Promise.all(flies);
    };
    const res = async (c, R) => {
      const w = workOf(R.eq);
      R.res.innerHTML = `${T(w.work)}<span class="u8l1-cmp">${w.cmp}</span>${mark(w.ok)}`; R.r.classList.add(w.ok ? 'u8l1-good' : 'u8l1-bad');
      return w.ok;
      await show(c, R.res);
    };
    /** the worked side ("2(3)-5=6-5=1") and how it compares with the other side */
    const workOf = (eq) => {
      const std = !eq.Rs, v = std ? eq.L(px, py) : eq.R(px), want = std ? eq.c : py, ok = Math.abs(v - want) < 1e-9;
      const work = (std ? eq.Ls(px, py) : eq.Rs(px)) + (!std && Math.abs(eq.m) !== 1 && eq.b ? '=' + texNum(eq.m * px) + (eq.b < 0 ? '-' : '+') + Math.abs(eq.b) : '') + '=' + texNum(v);
      const tgt = std ? 'the right side, ' + T(texNum(want)) : T('y=' + texNum(want));
      const cmp = ok ? `matches ${tgt}` : `but ${std ? 'the right side is ' + T(texNum(want)) : T('y=' + texNum(want))}`;
      return { work, cmp, ok, tgt };
    };
    const W1 = workOf(d.e1), W2 = workOf(d.e2), o1 = W1.ok, o2 = W2.ok, both = o1 && o2;
    const said = (w) => (w.ok ? `${T(w.work)}, which matches ${w.tgt}: ✓ true` : `${T(w.work)}, ${w.cmp}: ✗ false`);
    const verdict = add(stage, h('div', 'u8l1-cverd ' + (both ? 'u8l1-cv-ok' : 'u8l1-cv-no'),
      both ? `✓ ✓ Both true: ${T(pt(px, py))} <b>is</b> the solution.` : `${T(pt(px, py))} is <b>not</b> the solution.`), LW / 2, 428);
    verdict.style.translate = '-50% 0'; verdict.style.opacity = 0;
    const onWhich = both ? 'on <b>both</b> lines' : o1 ? 'on the blue line only' : o2 ? 'on the amber line only' : 'on <b>neither</b> line';
    return [
      { cap: `The ordered pair ${T(pt(px, py))} means ${T('x=' + px)} and ${T('y=' + py)}.`, run: async (c) => { await pop(c, pair, 420); PT.style.opacity = 1; await pop(c, PT, 300); await fadeIn(c, PL); } },
      { cap: `Substitute into ${T(k1(d.e1.tex))}: ${T(px)} goes in for ${T('x')}, ${T(py)} goes in for ${T('y')}.`, run: (c) => sub(c, R1) },
      { cap: `Work it out: ${said(W1)}.`, run: (c) => res(c, R1) },
      { cap: `Now ${T(k2(d.e2.tex))}: substitute the <b>same</b> numbers.`, run: (c) => sub(c, R2) },
      { cap: `${said(W2)}.${!o1 && !o2 ? ' (One ✗ was already enough to say no.)' : ''}`, run: (c) => res(c, R2) },
      { cap: both ? `Both true ✓ ✓: ${T(pt(px, py))} <b>is</b> the solution. On the graph it sits ${onWhich}: the crossing.`
        : `${o1 || o2 ? 'One is true, one is false' : 'Neither is true'}: ${T(pt(px, py))} is <b>not</b> the solution. On the graph it sits ${onWhich}.${d.maya ? ' (It fits Clue 1 only.)' : ''}`,
      run: async (c) => {
        PT.querySelector('circle').setAttribute('fill', both ? PUR : o1 ? BLUE : o2 ? AMB : INK);
        await pulse(c, PT, 1.6); await pop(c, verdict, 420);
        if (!both) { const [xx, yy] = G.toPx(px, py); const ring = svgEl('circle', { class: 'u8l1-ring u8l1-ring-no', r: 16, cx: xx, cy: yy }, G.layers.top); await pop(c, ring, 300); }
      } }
    ];
  }
};

/* =============================== oops: when the check fails =============================== */
const OO = {
  swap: { label: 'Rise and run mixed up', e1: YF(1, 1, 'y=x+1'), e2: YF(-2, 7, 'y=-2x+7'), wrong: { m: -0.5, b: 7, run: 2, say: 'down 1, right 2' }, read: [4, 5], sol: [2, 3],
    win: { xmin: -1.5, xmax: 8.5, ymin: -1.5, ymax: 8.5 }, l1: [5.5, 6.5, 'se'], l2: [3.2, 1, 'ne'],
    slip: `The slope ${T('-2')} means ${T('\\dfrac{-2}{1}')}: <b>down 2, right 1</b>. Going “down 1, right 2” drew a slope of ${T('-\\tfrac12')}.` },
  sign: { label: 'Sign slip on ' + T('b'), e1: YF(2, -1, 'y=2x-1'), e2: YF(-1, 5, 'y=-x+5'), wrong: { m: 2, b: 1, run: 1, say: 'start at (0, 1), up 2, right 1' }, read: [1, 4], sol: [2, 3],
    win: { xmin: -3.5, xmax: 6.5, ymin: -3.5, ymax: 6.5 }, l1: [3.1, 5.2, 'e'], l2: [4.6, 0.4, 'ne'], first: 2,
    slip: `${T('y=2x-1')} has ${T('b=-1')}: the line starts at ${T('(0,\\ -1)')}, <b>below</b> the origin, not at ${T('(0,\\ 1)')}.` }
};
const oops = {
  title: 'When the check fails: find the slip',
  height: 480,
  minW: 900,
  choices: Object.keys(OO).map((k) => ({ v: k, label: OO[k].label })),
  ask: (k) => `Solve the system ${T(k1(OO[k].e1.tex))} and ${T(k2(OO[k].e2.tex))} by graphing.`,
  make(stage, k, ex) {
    const d = OO[k], [rx, ry] = d.read, [sx, sy] = d.sol, W = ex.W;
    const G = new Graph(stage, Object.assign({ x: 12, y: 14, width: 452, height: 452 }, d.win));
    const P = panel(stage, 486, 14, W - 500, 452, '', 'u8l1-op');
    const good = d.first === 2 ? 'e2' : 'e1', bad = good === 'e1' ? 'e2' : 'e1';   // which line gets drawn wrong
    const gEq = d[good], bEq = d[bad], gCol = good === 'e1' ? BLUE : AMB, bCol = bad === 'e1' ? BLUE : AMB;
    const gLab = good === 'e1' ? d.l1 : d.l2, bLab = bad === 'e1' ? d.l1 : d.l2;
    let wrong, R, RL;
    const steps = [
      { cap: `Graph ${T(kc(gCol)(gEq.tex))}: start at ${T(pt(0, gEq.b))}, then ${stepWords(gEq.m)}.`, run: async (c) => {
        await say(c, P, `${T(kc(gCol)(gEq.tex))} ✓`, 'u8l1-wk2'); await plotLine(G, c, gEq.m, gEq.b, gCol, { label: [...gLab, kc(gCol)(gEq.tex)], tagPos: gEq.m < 0 ? 'w' : 'e' });
      } },
      { cap: `Graph ${T(kc(bCol)(bEq.tex))}… but a slip: ${d.wrong.say}.`, run: async (c) => {
        await say(c, P, `${T(kc(bCol)(bEq.tex))}: ${d.wrong.say}`, 'u8l1-wk2');
        wrong = await plotLine(G, c, d.wrong.m, d.wrong.b, bCol, { run: d.wrong.run, steps: 2, tagPos: 'e', dash: '12 9' });
      } },
      { cap: `The lines seem to cross at about ${T(pt(rx, ry))}. Is that the solution? <b>Check it.</b>`, run: async (c) => {
        R = G.point(rx, ry, { color: INK, r: 9 }); await G.reveal(R, c); RL = G.label(rx, ry, T(pt(rx, ry)), { pos: 'e', cls: 'bk-ptlab u8l1-glab', gap: 12 }); await fadeIn(c, RL);
        await say(c, P, `Read: ${T(pt(rx, ry))}?`, 'u8l1-big');
      } },
      { cap: `${T(kc(gCol)(gEq.tex))}: ${T(flat(gEq, rx, ry).tex)}${flat(gEq, rx, ry).ok ? ' ✓' : ' ✗'}`, run: (c) => show(c, flatRow(P, gEq, rx, ry, gCol)) },
      { cap: `${T(kc(bCol)(bEq.tex))}: ${T(flat(bEq, rx, ry).tex)} ✗. The check <b>failed</b>: something went wrong on the graph!`, run: async (c) => {
        await show(c, flatRow(P, bEq, rx, ry, bCol)); await shake(c, R); await okStamp(c, P, 'Not the solution', false);
      } },
      { cap: `Find the slip. ${d.slip} Redraw it.`, run: async (c) => {
        P.querySelectorAll('.bk-stamp').forEach((e) => e.remove());
        await c.anim(wrong.L, [{ opacity: 1 }, { opacity: 0 }], 500); G.remove(wrong.L, ...wrong.pts); R.style.opacity = 0; RL.style.opacity = 0;
        await plotLine(G, c, bEq.m, bEq.b, bCol, { label: [...bLab, kc(bCol)(bEq.tex)], tagPos: bEq.m < 0 ? 'w' : 'e' });
      } },
      { cap: `New crossing: ${T(kp(pt(sx, sy)))}. Check: ${T(flat(d.e1, sx, sy).tex)} ✓ and ${T(flat(d.e2, sx, sy).tex)} ✓. <b>Now</b> it is confirmed.`, run: async (c) => {
        const S = G.point(sx, sy, { color: PUR, r: 9 }); await G.reveal(S, c); await fadeIn(c, G.label(sx, sy, T(kp(pt(sx, sy))), { pos: 'w', cls: 'bk-ptlab u8l1-glab', gap: 12 }));
        P.querySelectorAll('.u8l1-fk').forEach((e) => e.classList.add('u8l1-old'));
        await say(c, P, `Solution: ${T(kp(pt(sx, sy)))}`, 'u8l1-big');
        await show(c, flatRow(P, d.e1, sx, sy, BLUE)); await show(c, flatRow(P, d.e2, sx, sy, AMB));
      } }
    ];
    return steps;
  }
};

/* =============================== mount =============================== */
mountWarm();
mountStatics();
export const explainers = mountExplainers({ pairs, dragLab, readGraph, byHand, byHand3, byHand5, rearrange, check, oops });
export const _test = { STD, YF, chk, PR, DL, E1, BH, RE, CK, OO };

/* ============ Stand Up Break! — systems by graphing (lessons/js/standup.js) ============
 * Every system is built from its solution, so the lines cross on grid points, inside a −6…6 grid like the booklet's.
 * A line is { A, B, C }: Ax + By = C. Beginning: is this pair the solution? (check in both); Progressing: graph two
 * y = mx + b lines (whole-number slopes) and state the crossing; Mastery: rewrite one equation first (ax ± y = c), then
 * graph, state and check in both original equations. Answers show the work and a small answer graph. */
{
  const BL = COLORS.blue, AM = COLORS.amber, PU = COLORS.purple;
  const tm = (k, v, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && v ? '' : Math.abs(k)) + v);
  const P2 = (x, y) => `(${x},\\ ${y})`;
  const cT = (col, s) => `\\textcolor{${col}}{${s}}`;
  const mb = (m, b) => ({ A: -m, B: 1, C: b });                    // y = mx + b  →  −mx + y = b
  const gen = (l) => tm(l.A, 'x', true) + tm(l.B, 'y', !l.A) + '=' + l.C;
  const siT = (m, b) => 'y=' + (tm(m, 'x', true) + (b ? (b < 0 ? '-' : '+') + Math.abs(b) : '') || '0');
  const kk = (c, v, first) => (c === 1 ? (first ? '' : '+') : c === -1 ? '-' : (c > 0 && !first ? '+' : '') + c) + `(${v})`;
  /** the check of (x, y) in y = mx + b: "2(3)-5=1 ✓" or "3(2)-4=2\neq3 ✗" */
  function chkSI(m, b, x, y) {
    const v = m * x + b, e = kk(m, x, true) + (b ? (b < 0 ? '-' : '+') + Math.abs(b) : '');
    return v === y ? `${e}=${v}\\ \\checkmark` : `${e}=${v}\\neq${y}\\ \\times`;
  }
  /** the check of (x, y) in Ax + By = C */
  function chkG(l, x, y) {
    const v = l.A * x + l.B * y, e = kk(l.A, x, true) + kk(l.B, y, false);
    return v === l.C ? `${e}=${v}\\ \\checkmark` : `${e}=${v}\\neq${l.C}\\ \\times`;
  }
  /* a small answer graph: the two lines, the crossing point, and (optionally) a test point */
  function graph(lines, P, w, Q) {
    const S = 200, pad = 14, sx = S / (w.x1 - w.x0), sy = S / (w.y1 - w.y0);
    const X = (x) => +(pad + (x - w.x0) * sx).toFixed(1), Y = (y) => +(pad + (w.y1 - y) * sy).toFixed(1);
    let g = '';
    for (let x = w.x0; x <= w.x1; x++) g += `<line x1="${X(x)}" y1="${Y(w.y0)}" x2="${X(x)}" y2="${Y(w.y1)}" stroke="${x === 0 ? '#3a4254' : '#d5d9e0'}" stroke-width="${x === 0 ? 1.4 : 0.7}"/>`;
    for (let y = w.y0; y <= w.y1; y++) g += `<line x1="${X(w.x0)}" y1="${Y(y)}" x2="${X(w.x1)}" y2="${Y(y)}" stroke="${y === 0 ? '#3a4254' : '#d5d9e0'}" stroke-width="${y === 0 ? 1.4 : 0.7}"/>`;
    const tick = (x, y, s, anchor) => `<text x="${x}" y="${y}" font-size="9.5" fill="#5b6273" text-anchor="${anchor}">${s}</text>`;
    for (let x = Math.ceil(w.x0 / w.lab) * w.lab; x <= w.x1; x += w.lab) if (x) g += tick(X(x), Y(0) + 11, String(x).replace('-', '−'), 'middle');
    for (let y = Math.ceil(w.y0 / w.lab) * w.lab; y <= w.y1; y += w.lab) if (y) g += tick(X(0) - 3, Y(y) + 3, String(y).replace('-', '−'), 'end');
    lines.forEach(({ l, col }) => {
      const c = [];
      [w.x0, w.x1].forEach((x) => c.push([x, (l.C - l.A * x) / l.B]));
      if (l.A) [w.y0, w.y1].forEach((y) => c.push([(l.C - l.B * y) / l.A, y]));
      const inn = c.filter(([x, y]) => x >= w.x0 - 1e-9 && x <= w.x1 + 1e-9 && y >= w.y0 - 1e-9 && y <= w.y1 + 1e-9);
      let best = null, bd = -1;
      inn.forEach((p) => inn.forEach((q) => { const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (dd > bd) { bd = dd; best = [p, q]; } }));
      if (best) g += `<line x1="${X(best[0][0])}" y1="${Y(best[0][1])}" x2="${X(best[1][0])}" y2="${Y(best[1][1])}" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;
    });
    g += `<circle cx="${X(P[0])}" cy="${Y(P[1])}" r="4.6" fill="${PU}" stroke="#fff" stroke-width="1.5"/>`;
    if (Q && (Q[0] !== P[0] || Q[1] !== P[1])) g += `<circle cx="${X(Q[0])}" cy="${Y(Q[1])}" r="5" fill="none" stroke="#1c2230" stroke-width="2"/>`;
    const Wd = S + 2 * pad;
    return `<svg viewBox="0 0 ${Wd} ${Wd}" width="${Wd}" height="${Wd}" style="max-width:100%;height:auto;display:block;margin:4px auto" role="img" aria-label="The two lines cross at (${P[0]}, ${P[1]})">${g}</svg>`;
  }
  const W6 = { x0: -6, x1: 6, y0: -6, y1: 6, lab: 2 };
  const half = (e, col) => { const i = e.indexOf('='); return cT(col, e.slice(0, i)) + '&' + cT(col, e.slice(i)); };
  const sysT = (a, b) => `\\begin{aligned}${half(a, BL)}\\\\${half(b, AM)}\\end{aligned}`;
  const SL = [1, 2, 3, -1, -2, -3];
  /** two different whole-number slopes and intercepts (|b| ≤ 6) through (x0, y0) */
  function twoLines(r, xr, yr) {
    for (;;) {
      const m1 = r.pick(SL), m2 = r.pick(SL), x0 = r.int(...xr), y0 = r.int(...yr);
      if (m1 === m2) continue;
      const b1 = y0 - m1 * x0, b2 = y0 - m2 * x0;
      if (b1 === b2 || Math.abs(b1) > 6 || Math.abs(b2) > 6) continue;
      return { m1, b1, m2, b2, x0, y0 };
    }
  }
  const stepT = (m) => `\\text{${m < 0 ? 'down' : 'up'} ${Math.abs(m)}, right 1}`;

  /* Beginning: is the given pair the solution? (both equations y = mx + b) */
  function beg(r) {
    for (;;) {
      const { m1, b1, m2, b2, x0, y0 } = twoLines(r, [-3, 4], [-4, 5]);
      const kind = r.pick(['yes', 'yes', 'one', 'one', 'none']);
      let Q = [x0, y0];
      if (kind === 'one') { const [m, b] = r.chance(0.5) ? [m1, b1] : [m2, b2], dx = r.pick([-2, -1, 1, 2]); Q = [x0 + dx, m * (x0 + dx) + b]; }
      if (kind === 'none') Q = r.chance(0.5) ? [y0, x0] : [x0 + r.pick([-1, 1]), y0 + r.pick([-2, -1, 1, 2])];
      const on1 = m1 * Q[0] + b1 === Q[1], on2 = m2 * Q[0] + b2 === Q[1];
      if (Math.abs(Q[0]) > 6 || Math.abs(Q[1]) > 6 || (kind === 'none' && (on1 || on2))) continue;
      const e1 = siT(m1, b1), e2 = siT(m2, b2), yes = on1 && on2;
      return { text: 'Is the ordered pair the solution to the system? Show the substitution into <b>both</b> equations.', q: `${P2(...Q)}\\qquad ${sysT(e1, e2)}`,
        a: [`${cT(BL, e1)}:\\ \\ ${chkSI(m1, b1, Q[0], Q[1])}`, `${cT(AM, e2)}:\\ \\ ${chkSI(m2, b2, Q[0], Q[1])}`,
          yes ? `\\text{Both are true: } ${cT(PU, P2(...Q))}\\text{ is the solution.}` : `\\text{${on1 || on2 ? 'Only one is true' : 'Neither is true'}: } ${P2(...Q)}\\text{ is not the solution.}`],
        atext: (yes ? '' : `The lines really cross at <b>(${x0}, ${y0})</b> (purple); the given point is circled.`) + graph([{ l: mb(m1, b1), col: BL }, { l: mb(m2, b2), col: AM }], [x0, y0], W6, Q) };
    }
  }
  /* Progressing: graph two y = mx + b lines and state the crossing */
  function prg(r) {
    const { m1, b1, m2, b2, x0, y0 } = twoLines(r, [-3, 4], [-4, 4]);
    const e1 = siT(m1, b1), e2 = siT(m2, b2);
    return { text: 'Solve the system by graphing both lines by hand. State the solution as an ordered pair, then check it in both equations.', q: sysT(e1, e2),
      a: [`${cT(BL, `\\text{start at }${P2(0, b1)},\\ ${stepT(m1)}`)}`, `${cT(AM, `\\text{start at }${P2(0, b2)},\\ ${stepT(m2)}`)}`,
        `\\text{The lines cross at } ${cT(PU, P2(x0, y0))}`, `${chkSI(m1, b1, x0, y0)}\\qquad ${chkSI(m2, b2, x0, y0)}`],
      atext: graph([{ l: mb(m1, b1), col: BL }, { l: mb(m2, b2), col: AM }], [x0, y0], W6) };
  }
  /* Mastery: one equation is ax + y = c or ax − y = c; rewrite it, graph both, state, check in both originals */
  function mas(r) {
    for (;;) {
      const { m1, b1, m2, b2, x0, y0 } = twoLines(r, [-3, 4], [-4, 4]);
      const B = r.pick([1, 1, -1]);                     // the y-coefficient of the rewritten equation
      let l1 = { A: -m1 * B, B, C: b1 * B };            // B(y − m1 x) = B b1
      if (l1.A < 0) l1 = { A: -l1.A, B: -l1.B, C: -l1.C + 0 };   // x-term positive, like the booklet's 2x + y = 1, x − y = 3
      if (l1.A === 0) continue;
      const e1 = gen(l1), e2 = siT(m2, b2), r1 = siT(m1, b1);
      const how = l1.B === 1 ? `\\text{subtract }${tm(l1.A, 'x', true)}\\text{ from each side}` : `\\text{subtract }${tm(l1.A, 'x', true)}\\text{, then change every sign}`;
      const [first, second] = r.chance(0.5) ? [[e1, BL], [e2, AM]] : [[e2, BL], [e1, AM]];
      const swap = first[0] === e2;
      const L1 = { l: l1, col: swap ? AM : BL }, L2 = { l: mb(m2, b2), col: swap ? BL : AM };
      const rew = `${cT(L1.col, `${e1}\\ \\Rightarrow\\ ${r1}`)}\\quad(${how})`;
      return { text: 'Solve the system by graphing. Rewrite in slope-intercept form first, then check your solution in <b>both original</b> equations.',
        q: `\\begin{aligned}${half(first[0], first[1])}\\\\${half(second[0], second[1])}\\end{aligned}`,
        a: [rew, `\\text{The lines cross at } ${cT(PU, P2(x0, y0))}`, `${chkG(l1, x0, y0)}\\qquad ${chkSI(m2, b2, x0, y0)}`],
        atext: graph([L1, L2], [x0, y0], W6) };
    }
  }
  standup('u8l1', {
    intro: 'Grab a marker. Draw a grid on your whiteboard, graph both lines by hand, find where they cross, then check in both equations.',
    levels: { BEG: beg, PRG: prg, MAS: mas }
  });
}
