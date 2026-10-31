/* Math 15 · Unit 7 · Lesson 10 — Unit Review: Equations of Lines.
 * The Line Dominoes warm-up (mini graphs on the tiles, fill the gap), the Example 1 and 3 tap-to-plot grids and answer
 * graphs, and the explainers:
 *   dominoes (every half turned into y = mx + b: the loop, link by link, and the big one's three candidates),
 *   table (Example 1: the table fills row by row, +3 each step, the points plot and the line is ruled),
 *   rearrange (isolate y: terms fly across the equals sign and change sign — Examples 2b, 7b),
 *   stepper (plot b, then step rise/run both ways — Examples 3, 4b, a fractional slope),
 *   solveB (slope and a point: the parallel family slides until it passes through the point, then the algebra —
 *   Examples 5a, 5b, Challenge 3b), twoPts (slope triangle, then b, then a check — Example 6, Challenge 2),
 *   general (to general form, and cover-up intercepts — Examples 7a, 7c, 8c), hv (y = k and x = k — Example 8),
 *   whichTool (★ what am I given? one flowchart for the unit, replaying the examples),
 *   parperp (Challenge 3: the slope of AB, a parallel line through P, a perpendicular line through Q, general form).
 * Colours: run amber, rise purple, lines blue; slope m blue, y-intercept b green, x-intercept magenta.
 * No calculator in this unit. Pieces adapted from Math 10C u7l7 and Math 15 u7l9 (same engine). */
import {
  h, tex, add, box, Graph, Flowchart, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, appear, tween, sleep,
  svgEl, place, drawIn, pulse, rightMark, liveCtx, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const RUN = COLORS.amber, RISE = COLORS.purple, LINE = COLORS.blue, BCOL = COLORS.green, INK = COLORS.ink, GRAY = COLORS.gray,
  RED = COLORS.red, XI = '#c0367a', TEAL = '#0f7f80', ORNG = '#d4600f';
const cM = (s) => `\\textcolor{${LINE}}{${s}}`, cB = (s) => `\\textcolor{${BCOL}}{${s}}`, cX = (s) => `\\textcolor{${XI}}{${s}}`;
const show = (c, el) => fadeIn(c, el, 320);
const hide = (el) => { if (el) el.style.opacity = 0; return el; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u7l10-panel ' + cls, title ? `<div class="u7l10-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u7l10-line ' + cls, html); p.appendChild(d); return d; };
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
/** a fraction n/d as TeX (simplified) */
const fr = (n, d = 1, tf = true) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? '-' : '') + `\\${tf ? 't' : 'd'}frac{${Math.abs(n)}}{${d}}`; };
const par = (v) => (v < 0 ? `(${v})` : String(v));
/** y = mx + b in TeX; m given as [n, d] */
const yEq = (m, b, o = {}) => {
  const [n, d] = m, mv = n / d, M = mv === 1 ? '' : mv === -1 ? '-' : fr(n, d), Bs = b === 0 ? '' : (b < 0 ? '-' : '+') + (o.col ? cB(Math.abs(b)) : Math.abs(b));
  if (mv === 0) return `${o.Y || 'y'}=${o.col ? cB(b) : b}`;
  return `${o.Y || 'y'}=${o.col && M !== '' && M !== '-' ? cM(M) : M}${o.X || 'x'}${Bs}`;
};
/** a stamp placed in a panel */
const stampP = async (c, host, text, ok = true, cls = 'u7l10-stampb') => { const s = stamp(host, text, { ok }); s.classList.add(cls); await stampIn(c, s); return s; };

/** slope triangle on a Graph from (x, y): run (amber) then rise (purple), with labels */
function tri(G, x, y, run, rise, o = {}) {
  const g = svgEl('g', { class: 'u7l10-tri' }, G.layers.data);
  const P = G.toPx(x, y), C = G.toPx(x + run, y), Q = G.toPx(x + run, y + rise);
  svgEl('path', { d: `M${P[0]} ${P[1]} L${C[0]} ${C[1]} L${Q[0]} ${Q[1]} Z`, fill: o.fill || LINE, 'fill-opacity': 0.1 }, g);
  const r = svgEl('path', { class: 'bk-stroke', d: `M${P[0]} ${P[1]} L${C[0]} ${C[1]}`, stroke: RUN, 'stroke-width': o.w || 4.5, 'stroke-linecap': 'round', fill: 'none' }, g);
  const s = svgEl('path', { class: 'bk-stroke', d: `M${C[0]} ${C[1]} L${Q[0]} ${Q[1]}`, stroke: RISE, 'stroke-width': o.w || 4.5, 'stroke-linecap': 'round', fill: 'none' }, g);
  let lr = null, ls = null;
  if (o.labels !== false) {
    lr = h('div', 'bk-lab u7l10-tlab u7l10-trun', o.runText || `run ${String(run).replace('-', '−')}`); G.html.appendChild(lr);
    ls = h('div', 'bk-lab u7l10-tlab u7l10-trise', o.riseText || `rise ${String(rise).replace('-', '−')}`); G.html.appendChild(ls);
    place(lr, (P[0] + C[0]) / 2, P[1], o.runSide || (rise >= 0 ? 's' : 'n'), 5);
    place(ls, C[0], (C[1] + Q[1]) / 2, o.riseSide || (run >= 0 ? 'e' : 'w'), 7);
    hide(lr); hide(ls);
  }
  return { g, async draw(c, ms = 380) { await drawIn(r, ms, c); if (lr) await fadeIn(c, lr, 200); await drawIn(s, ms, c); if (ls) await fadeIn(c, ls, 200); },
    remove() { g.remove(); if (lr) lr.remove(); if (ls) ls.remove(); }, fade() { g.style.opacity = 0.3; if (lr) lr.remove(); if (ls) ls.remove(); } };
}
/** fly an HTML token from src to dst (both elements on the stage) */
async function fly(c, stage, src, dst) {
  if (!c || c.fast || !src || !dst) return;
  const sc = stage.getBoundingClientRect().width / stage.offsetWidth || 1;
  const a = src.getBoundingClientRect(), b = dst.getBoundingClientRect();
  const dx = ((a.left + a.width / 2) - (b.left + b.width / 2)) / sc, dy = ((a.top + a.height / 2) - (b.top + b.height / 2)) / sc;
  await c.anim(dst, [{ transform: `translate(${dx}px, ${dy}px) scale(1.2)`, opacity: 0.5 }, { transform: 'none', opacity: 1 }], 700);
}

/* =============================== warm-up: Line Dominoes =============================== */
const MINI = {
  P: { seg: [[-0.5, -4], [3.5, 4]], pts: [[0, -3], [1, -1], [2, 1], [3, 3]] },
  R: { seg: [[-4, 3], [4, 3]], pts: [[-2, 3], [0, 3], [2, 3]] },
  T: { seg: [[-1, 4], [4, -1]], pts: [[0, 3], [1, 2], [2, 1], [3, 0]] },
  A2: { seg: [[-4, 3], [4, 3]], pts: [] }
};
const mini = (host, k, size = 132) => {
  const d = MINI[k], G = new Graph(host, { width: size, height: size, xmin: -4, xmax: 4, ymin: -4, ymax: 4, numbers: false, xtitle: '', ytitle: '', arrows: false, pad: 6 });
  G.segment(d.seg[0], d.seg[1], { color: RED, width: 3 }); d.pts.forEach((p) => G.point(p[0], p[1], { color: RED, r: 3.6 }));
  return G;
};
function mountWarm() {
  document.querySelectorAll('.u7l10-tile [data-mini]').forEach((el) => mini(el, el.dataset.mini));
  const gap = document.getElementById('u7l10-gap'), note = document.getElementById('u7l10-wnote');
  if (!gap) return;
  const orig = gap.innerHTML;
  const fill = document.getElementById('u7l10-wfill'), rs = document.getElementById('u7l10-wreset');
  if (fill) fill.onclick = () => {
    if (gap.classList.contains('u7l10-filled')) return;
    gap.classList.add('u7l10-filled'); fill.classList.add('on');
    gap.innerHTML = `<span class="u7l10-tl">A</span><div class="u7l10-half">${T('x-y-2=0')}</div><div class="u7l10-half">${T('(0,\\ 3)')}<br>and<br>${T('(4,\\ 3)')}</div>`;
    pop(liveCtx(), gap);
    if (note) note.innerHTML = '<b>Tile A</b> closes the loop: <span class="tex-i">y = x − 2</span> meets P, and <span class="tex-i">y = 3</span> meets R.';
  };
  if (rs) rs.onclick = () => { gap.classList.remove('u7l10-filled'); gap.innerHTML = orig; if (fill) fill.classList.remove('on'); if (note) note.innerHTML = 'Guess first (the big one), then fill the gap.'; };
}

/* =============================== static figures: Examples 1 and 3 =============================== */
const W1 = { xmin: -6, xmax: 6, ymin: -9, ymax: 9 }, W3 = { xmin: -6, xmax: 6, ymin: -10, ymax: 10 };
function mountFigures() {
  const tapG = (id, w, hh, win) => { const el = document.getElementById(id); if (el) new Graph(el, Object.assign({ width: w, height: hh, ylabels: 2, xlabels: 2, interactive: { snap: 1, max: 6, color: 'blue' } }, win)); };
  tapG('u7l10-ex1fig', 360, 500, W1); tapG('u7l10-ex3fig', 360, 540, W3);
  const a1 = document.getElementById('u7l10-ex1ans');
  if (a1) { const G = new Graph(a1, Object.assign({ width: 250, height: 340, ylabels: 2, xlabels: 2, fontSize: 14 }, W1)); G.line({ m: 3, b: -2 }, { color: RED, width: 3 }); [-2, -1, 0, 1, 2].forEach((x) => G.point(x, 3 * x - 2, { color: RED, r: 5 })); }
  const a3 = document.getElementById('u7l10-ex3ans');
  if (a3) { const G = new Graph(a3, Object.assign({ width: 250, height: 360, ylabels: 2, xlabels: 2, fontSize: 14 }, W3)); G.line({ m: -3, b: 4 }, { color: RED, width: 3 }); G.point(0, 4, { color: BCOL, r: 6 }); G.point(1, 1, { color: RED, r: 5 }); tri(G, 0, 4, 1, -3, { labels: false }); }
}

/* =============================== explainer 1: dominoes =============================== */
const tbl = (rows) => `<table class="u7l10-tt"><tr><th>${T('x')}</th><th>${T('y')}</th></tr>${rows.map((r) => `<tr><td>${T(String(r[0]))}</td><td>${T(String(r[1]))}</td></tr>`).join('')}</table>`;
const DOM = {
  loop: { label: 'The loop, link by link', links: [
    { L: { name: 'Q', html: T('y=2x+1'), w: [T('y=2x+1') + ' is already done'] }, R: { name: 'T', html: tbl([[0, 1], [1, 3], [2, 5]]), w: [T('2(0)+1=1') + ' ✓', T('2(1)+1=3') + ' ✓', T('2(2)+1=5') + ' ✓'] },
      ln: { m: 2, b: 1 }, ok: true, cap: `Start with <b>Q</b>: ${T('y=2x+1')}. Its partner is <b>T</b>’s table: each ${T('x')} in ${T('y=2x+1')} gives the ${T('y')} in the table. Same line.` },
    { L: { name: 'T', mini: 'T', w: [`crosses at ${T('(0,\\ 3)')}: ${T('b=3')}`, `down 1, right 1: ${T('m=-1')}`, T('y=-x+3')] }, R: { name: 'R', html: T('x+y-3=0'), w: [T('y=-x+3') + ' (move ' + T('x') + ' and ' + T('-3') + ')'] },
      ln: { m: -1, b: 3 }, ok: true, cap: `<b>T</b>’s graph: ${T('b=3')}, down 1 for every 1 right, so ${T('y=-x+3')}. <b>R</b>’s ${T('x+y-3=0')} rearranges to ${T('y=-x+3')}. Same line.` },
    { L: { name: 'R', mini: 'R', w: [`every point has ${T('y=3')}`, `horizontal: ${T('y=3')}`] }, R: { name: '?', html: '<b class="u7l10-q">?</b>', w: ['the missing tile must show ' + T('y=3')] },
      ln: { m: 0, b: 3 }, ok: null, cap: `<b>R</b>’s graph is flat at height 3: ${T('y=3')}. Nothing matches it yet, so the <b>missing tile</b> must show ${T('y=3')}.` },
    { L: { name: '?', html: '<b class="u7l10-q">?</b>', w: ['the missing tile must show ' + T('y=x-2')] }, R: { name: 'P', html: `through<br>${T('(5,\\ 3)')} and ${T('(1,\\ -1)')}`, w: [T('m=\\dfrac{3-(-1)}{5-1}=\\dfrac{4}{4}=1'), T('-1=1(1)+b\\ \\Rightarrow\\ b=-2'), T('y=x-2')] },
      ln: { m: 1, b: -2 }, ok: null, cap: `<b>P</b>’s two points: ${T('m=\\tfrac{4}{4}=1')}, then ${T('b=-2')}: ${T('y=x-2')}. No partner either, so the missing tile’s other half must be ${T('y=x-2')}.` },
    { L: { name: 'P', mini: 'P', w: [`crosses at ${T('(0,\\ -3)')}: ${T('b=-3')}`, `up 2, right 1: ${T('m=2')}`, T('y=2x-3')] }, R: { name: 'S', html: `slope ${T('2')} through ${T('(3,\\ 3)')}`, w: [T('3=2(3)+b'), T('b=-3'), T('y=2x-3')] },
      ln: { m: 2, b: -3 }, ok: true, cap: `<b>P</b>’s graph is ${T('y=2x-3')} (slope 2, like Q, but ${T('b=-3')}). <b>S</b>: ${T('3=2(3)+b')} gives ${T('b=-3')}. Same line.` },
    { L: { name: 'S', html: tbl([[-2, 0], [-2, 1], [-2, 2]]), w: [`${T('x')} is always ${T('-2')}`, `vertical: ${T('x=-2')}`] }, R: { name: 'Q', html: T('x+2=0'), w: [T('x+2=0\\ \\Rightarrow\\ x=-2')] },
      ln: { x: -2 }, ok: true, cap: `<b>S</b>’s table: ${T('x')} is stuck at ${T('-2')}, a vertical line ${T('x=-2')}. <b>Q</b>’s ${T('x+2=0')} is ${T('x=-2')}. The loop is back to Q!` }
  ] },
  big: { label: 'The big one: test A, B and C', links: [
    { L: { name: 'A', html: T('x-y-2=0'), w: [T('-y=-x+2'), T('y=x-2') + ' ✓'] }, R: { name: 'A', html: `${T('(0,\\ 3)')} and ${T('(4,\\ 3)')}`, w: [T('m=\\dfrac{3-3}{4-0}=0'), T('y=3') + ' ✓'] },
      ln: [{ m: 1, b: -2 }, { m: 0, b: 3 }], ok: true, cap: `The gap needs ${T('y=x-2')} and ${T('y=3')}. <b>A</b>: ${T('x-y-2=0')} is ${T('y=x-2')} ✓, and two points at height 3 make ${T('y=3')} ✓.` },
    { L: { name: 'B', html: T('y=x+2'), w: [T('b=2') + ', not ' + T('-2') + ' ✗'] }, R: { name: 'B', html: `slope ${T('0')}, ${T('b=3')}`, w: [T('y=3') + ' ✓'] },
      ln: [{ m: 1, b: 2 }, { m: 0, b: 3 }], ok: false, cap: `<b>B</b>: ${T('y=x+2')} has the right slope but the wrong ${T('b')}: it is parallel to ${T('y=x-2')}, not the same line ✗.` },
    { L: { name: 'C', html: T('y=x-2'), w: [T('y=x-2') + ' ✓'] }, R: { name: 'C', html: `slope ${T('3')} through ${T('(0,\\ 0)')}`, w: [T('y=3x') + ', not ' + T('y=3') + ' ✗'] },
      ln: [{ m: 1, b: -2 }, { m: 3, b: 0 }], ok: false, cap: `<b>C</b>: the left half is right, but “slope 3 through the origin” is ${T('y=3x')}, a steep line, not the flat ${T('y=3')} ✗. <b>A</b> is the only tile.` }
  ] }
};
const dominoes = {
  title: 'Same line, different disguise',
  height: 450,
  minW: 940,
  choices: Object.keys(DOM).map((k) => ({ v: k, label: DOM[k].label })),
  intro: 'Turn each half into y = mx + b (or x = k), then compare. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = DOM[k], cw = 255;
    const card = (x) => add(stage, box(h('div', 'u7l10-dhalf'), cw, 130), x, 14);
    const cL = card(14), cR = card(14 + cw);
    const wL = panel(stage, 14, 156, cw - 6, 280, ''), wR = panel(stage, 20 + cw, 156, cw - 6, 280, '');
    const G = new Graph(stage, { x: 2 * cw + 40, y: 14, width: ex.W - 2 * cw - 54, height: 422, xmin: -5, xmax: 5, ymin: -5, ymax: 5, ylabels: 1, xlabels: 1 });
    const fillCard = (el, s) => {
      el.innerHTML = `<span class="u7l10-dtl">${s.name}</span><div class="u7l10-dbody">${s.html || ''}</div>`;
      if (s.mini) mini(el.querySelector('.u7l10-dbody'), s.mini, 112);
    };
    let prev = [];
    const COLS = [LINE, '#1e8c50', ORNG, '#7b4fc4', RED, TEAL];
    return d.links.map((L, i) => ({
      cap: L.cap,
      run: async (c) => {
        prev.forEach((e) => (e.style.opacity = 0.18)); prev = [];
        fillCard(cL, L.L); fillCard(cR, L.R); wL.innerHTML = ''; wR.innerHTML = '';
        await Promise.all([pop(c, cL), pop(c, cR)]);
        for (const [w, s] of [[wL, L.L], [wR, L.R]]) for (const t of s.w) await show(c, line(w, t, 'u7l10-mline'));
        const lns = [].concat(L.ln);
        for (let j = 0; j < lns.length; j++) {
          const q = lns[j], colr = k === 'loop' ? COLS[i] : (L.ok === false && j === (L.L.w[0].includes('✗') ? 0 : 1) ? RED : LINE);
          const e = q.x != null ? G.line({ x: q.x }, { color: colr, width: 4 }) : G.line({ m: q.m, b: q.b }, { color: colr, width: 4 });
          await G.drawIn(e, 550, c); prev.push(e);
        }
        if (L.ok != null) { const s = stamp(cR, L.ok ? 'match' : 'no match', { ok: L.ok }); s.classList.add('u7l10-dstamp'); await stampIn(c, s); }
      }
    }));
  }
};

/* =============================== explainer 2: table of values =============================== */
const TB = {
  ex1: { label: 'Example 1 check: y = 3x − 2', m: 3, b: -2, xs: [-2, -1, 0, 1, 2], win: W1 },
  neg: { label: 'Try: y = −2x + 1', m: -2, b: 1, xs: [-2, -1, 0, 1, 2], win: W1 }
};
const table = {
  title: 'From a table of values to a line',
  height: 470,
  minW: 900,
  choices: Object.keys(TB).map((k) => ({ v: k, label: TB[k].label.replace('y = ', '') ? TB[k].label : TB[k].label })),
  intro: (k) => `Substitute each ${T('x')}, plot the points, rule the line. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = TB[k], f = (x) => d.m * x + d.b, eq = yEq([d.m, 1], d.b);
    const tb = new ValueTable(stage, { x: 14, y: 14, rows: d.xs.map((x) => [x, f(x)]), hide: 1, tap: false, cellW: 86, cellH: 50, diffs: true, diffSpace: 80 });
    const P = panel(stage, 14, 330, 300, 126, `${T(eq)}`);
    const G = new Graph(stage, Object.assign({ x: 330, y: 14, width: ex.W - 344, height: 442, ylabels: 2, xlabels: 1 }, d.win));
    const sub = (x) => `${T(`y=${d.m}${par(x)}${d.b < 0 ? '-' : '+'}${Math.abs(d.b)}=${f(x)}`)}`;
    const calc = line(P, '', 'u7l10-mline');
    return [
      { cap: `Substitute ${T(`x=${d.xs[0]}`)}: ${sub(d.xs[0])}. Brackets around negatives!`,
        run: async (c) => { tb.highlight(0, true); calc.innerHTML = sub(d.xs[0]); await show(c, calc); await tb.reveal(0, 1, c); } },
      { cap: `Do the same for the other ${T('x')}-values: ${d.xs.slice(1).map((x) => T(`${f(x)}`)).join(', ')}.`,
        run: async (c) => { tb.highlight(0, false); for (let r = 1; r < d.xs.length; r++) { tb.highlight(r, true); calc.innerHTML = sub(d.xs[r]); await tb.reveal(r, 1, c); await sleep(c, 200); tb.highlight(r, false); } } },
      { cap: `The ${T('y')}-values change by the <b>same amount</b> every step: ${T((d.m > 0 ? '+' : '') + d.m)}. That is the sign of a straight line (and it is the slope).`,
        run: async (c) => { await tb.diffs(c); } },
      { cap: `Plot each ordered pair: ${d.xs.map((x) => T(`(${x},\\ ${f(x)})`)).join(', ')}.`,
        run: async (c) => { for (const x of d.xs) { tb.highlight(d.xs.indexOf(x), true); await G.reveal(G.point(x, f(x), { color: RED, r: 7 }), c); tb.highlight(d.xs.indexOf(x), false); } } },
      { cap: `They line up. Rule <b>one straight line</b> through them, right across the grid (arrows at both ends).`,
        run: async (c) => { await G.drawIn(G.line({ m: d.m, b: d.b }, { color: LINE, width: 4 }), 800, c); await G.reveal(G.label(d.m > 0 ? 3.2 : -4.8, f(d.m > 0 ? 3.2 : -4.8) > 7 ? 6.5 : f(d.m > 0 ? 3.2 : -4.8), T(eq), { pos: d.m > 0 ? 'w' : 'e', cls: 'bk-ptlab u7l10-eqlab', color: LINE }), c); } }
    ];
  }
};

/* =============================== explainer 3: rearrange (isolate y) =============================== */
/* each line: tokens [tex, cls?]; moves: [fromIndex in previous line → index in this line] */
const RE = {
  ex2b: { label: 'Example 2(b) check: 4x + y = 9', m: [-4, 1], b: 9, lines: [
    { t: ['4x', '+', 'y', '=', '9'], hot: [0], cap: `Is ${T('4x+y=9')} solved for ${T('y')}? No: ${T('4x')} is on the same side as ${T('y')}.` },
    { t: ['y', '=', '-4x', '+', '9'], moves: [[0, 2]], note: `${T('-4x')} both sides`, cap: `Subtract ${T('4x')} from both sides: it moves across the equals sign and becomes ${T('-4x')}. Write the ${T('x')}-term first.` }],
    end: `Now it is ${T('y=mx+b')}: ${T(`m=${cM('-4')}`)}, ${T(`b=${cB('9')}`)}.` },
  ex7b: { label: 'Example 7(b) check: 3x − 2y − 8 = 0', m: [3, 2], b: -4, lines: [
    { t: ['3x', '-2y', '-8', '=', '0'], hot: [0, 2], cap: `${T('3x-2y-8=0')}: keep the ${T('y')}-term on the left and move the other two terms across.` },
    { t: ['-2y', '=', '-3x', '+8'], moves: [[0, 2], [2, 3]], note: `${T('-3x')} and ${T('+8')} both sides`, cap: `${T('3x')} becomes ${T('-3x')} and ${T('-8')} becomes ${T('+8')}: ${T('-2y=-3x+8')}.` },
    { t: ['y', '=', '\\tfrac{3}{2}x', '-4'], moves: [[0, 0], [2, 2], [3, 3]], note: `${T('\\div(-2)')} every term`, cap: `Divide <b>every</b> term by ${T('-2')}: ${T('\\tfrac{-3}{-2}=\\tfrac32')} and ${T('\\tfrac{8}{-2}=-4')}. So ${T('y=\\tfrac32x-4')}.` }],
    end: `Now ${T(`m=${cM('\\tfrac32')}`)} (up 3, right 2) and ${T(`b=${cB('-4')}`)}.` }
};
const rearrange = {
  title: 'Isolate y, then read m and b',
  height: 440,
  minW: 900,
  choices: Object.keys(RE).map((k) => ({ v: k, label: RE[k].label })),
  intro: 'Terms that cross the equals sign change sign. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = RE[k], W = ex.W, gw = 330;
    const box1 = panel(stage, 14, 14, W - gw - 42, 410, 'Isolate y', 'u7l10-big');
    const G = new Graph(stage, { x: W - gw - 14, y: 14, width: gw, height: 410, xmin: -6, xmax: 6, ymin: -8, ymax: 10, ylabels: 2, xlabels: 2 });
    const rows = [];
    const mkRow = (L) => {
      const r = h('div', 'u7l10-erow'); const toks = L.t.map((s) => { const sp = h('span', 'u7l10-etk', T(s)); r.appendChild(sp); return sp; });
      if (L.note) r.appendChild(h('span', 'u7l10-enote', L.note));
      box1.appendChild(r); rows.push({ r, toks }); return { r, toks };
    };
    const [n, dd] = d.m, mv = n / dd, f = (x) => mv * x + d.b;
    const steps = d.lines.map((L, i) => ({
      cap: L.cap,
      run: async (c) => {
        const { r, toks } = mkRow(L); await show(c, r);
        (L.hot || []).forEach((j) => toks[j].classList.add('u7l10-hot'));
        if (L.moves) { const pr = rows[rows.length - 2].toks; for (const [a, b] of L.moves) { toks[b].classList.add('u7l10-moved'); await fly(c, stage, pr[a], toks[b]); } }
      }
    }));
    steps.push({ cap: d.end + ' Check on the graph: start at the y-intercept and step the slope.',
      run: async (c) => {
        const last = rows[rows.length - 1].toks; last.forEach((t) => t.classList.remove('u7l10-moved'));
        const fin = h('div', 'u7l10-bigeq', T(yEq(d.m, d.b, { col: true }))); box1.appendChild(fin); await pop(c, fin);
        await G.reveal(G.point(0, d.b, { color: BCOL, r: 8 }), c);
        const t1 = tri(G, 0, d.b, dd, n, { labels: false }); await t1.draw(c, 300);
        await G.reveal(G.point(dd, d.b + n, { color: LINE, r: 6 }), c);
        await G.drawIn(G.line({ m: mv, b: d.b }, { color: LINE, width: 4 }), 600, c);
      } });
    return steps;
  }
};

/* =============================== explainer 4: the stepper (graph from m and b) =============================== */
const SP = {
  ex3: { label: 'Example 3 check: y = −3x + 4', m: [-3, 1], b: 4, win: W3, fw: 2, bw: 2 },
  ex4b: { label: 'Example 4(b): y = −¼x + 8', m: [-1, 4], b: 8, win: W3, fw: 1, bw: 1 },
  frac: { label: 'Try: y = ⅔x − 1', m: [2, 3], b: -1, win: W3, fw: 2, bw: 2 }
};
const stepper = {
  title: 'Plot b, then step the slope',
  height: 470,
  minW: 900,
  choices: Object.keys(SP).map((k) => ({ v: k, label: SP[k].label })),
  intro: (k) => `${T(yEq(SP[k].m, SP[k].b))}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SP[k], [n, dd] = d.m, mv = n / dd;
    const G = new Graph(stage, Object.assign({ x: 14, y: 14, width: 420, height: 442, ylabels: 2, xlabels: 2 }, d.win));
    const P = panel(stage, 450, 14, ex.W - 464, 442, 'Graph it', 'u7l10-big');
    const eq = h('div', 'u7l10-bigeq', T(yEq(d.m, d.b, { col: true }))); P.appendChild(eq);
    const rs = `\\dfrac{${n}}{${dd}}`;
    let x = 0, y = d.b, last = null;
    const stepF = async (c, s) => { if (last) last.fade(); last = tri(G, x, y, s * dd, s * n, { runText: `${s > 0 ? 'right' : 'left'} ${dd}`, riseText: `${(s * n) > 0 ? 'up' : 'down'} ${Math.abs(n)}` }); await last.draw(c, 300); x += s * dd; y += s * n; await G.reveal(G.point(x, y, { color: LINE, r: 6.5 }), c); };
    const x0 = 0;
    return [
      { cap: `Plot the ${T('y')}-intercept first: ${T(`b=${d.b}`)}, the point ${T(`(0,\\ ${d.b})`)} on the ${T('y')}-axis.`,
        run: async (c) => { await G.reveal(G.point(0, d.b, { color: BCOL, r: 9 }), c); await show(c, line(P, `start: ${T(`(0,\\ ${cB(d.b)})`)}`, 'u7l10-mline')); } },
      { cap: `Write the slope as a fraction: ${T(`m=${rs}=\\dfrac{\\text{rise}}{\\text{run}}`)}. ${n < 0 ? `The minus goes with the rise: <b>down</b> ${Math.abs(n)}.` : `<b>Up</b> ${n}.`} Run: <b>right</b> ${dd}.`,
        run: async (c) => { await show(c, line(P, T(`m=${cM(rs)}=\\dfrac{\\text{rise}}{\\text{run}}`), 'u7l10-mline')); await show(c, line(P, `${n < 0 ? 'down' : 'up'} ${Math.abs(n)}, right ${dd}`, 'u7l10-soft')); } },
      { cap: `From ${T(`(0,\\ ${d.b})`)}: right ${dd}, ${n < 0 ? 'down' : 'up'} ${Math.abs(n)}. That lands on ${T(`(${dd},\\ ${d.b + n})`)}.${d.fw > 1 ? ' Step again for a third point.' : ''}`,
        run: async (c) => { for (let i = 0; i < d.fw; i++) await stepF(c, 1); } },
      { cap: `Step <b>backwards</b> too: left ${dd}, ${n < 0 ? 'up' : 'down'} ${Math.abs(n)}. Both directions stay on the same line.`,
        run: async (c) => { x = x0; y = d.b; for (let i = 0; i < d.bw; i++) await stepF(c, -1); } },
      { cap: `Rule the line through the points, right across the grid. Check: ${mv < 0 ? 'it falls' : 'it rises'} from left to right, so the slope is ${mv < 0 ? 'negative' : 'positive'} ✓.`,
        run: async (c) => { if (last) last.fade(); await G.drawIn(G.line({ m: mv, b: d.b }, { color: LINE, width: 4 }), 700, c); await stampP(c, P, mv < 0 ? 'falls ✓' : 'rises ✓'); } }
    ];
  }
};

/* =============================== explainer 5: slope and a point → b =============================== */
const SB = {
  ex5a: { label: 'Example 5(a) check', m: 4, P: [3, 7] },
  ex5b: { label: 'Example 5(b) check', m: -2, P: [-1, 6] },
  ch3b: { label: 'Challenge 3(b) check', m: 2, P: [3, -1] }
};
const solveB = {
  title: 'Slope and a point: slide the line, then solve for b',
  height: 470,
  minW: 900,
  choices: Object.keys(SB).map((k) => ({ v: k, label: SB[k].label })),
  intro: (k) => `Slope ${T(String(SB[k].m))} through ${T(`(${SB[k].P[0]},\\ ${SB[k].P[1]})`)}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = SB[k], m = d.m, [px, py] = d.P, mx = m * px, b = py - mx;
    const G = new Graph(stage, { x: 14, y: 14, width: 420, height: 442, xmin: -6, xmax: 6, ymin: -10, ymax: 10, ylabels: 2, xlabels: 2 });
    const P = panel(stage, 450, 14, ex.W - 464, 442, 'Solve for b', 'u7l10-big');
    const st = { b: b + (b < 4 ? 8 : -8) };
    let fam = [], ln = null, bp = null;
    return [
      { cap: `Put the slope in: ${T(`y=${m}x+b`)}. We don’t know ${T('b')} yet: every line with slope ${T(String(m))} is a candidate. They are all parallel.`,
        run: async (c) => {
          await show(c, line(P, T(`y=${cM(m)}x+b`), 'u7l10-mline'));
          for (const bb of [-8, -4, 0, 4, 8]) { const e = G.line({ m, b: bb }, { color: GRAY, width: 2.5, dash: '7 6', arrows: false }); fam.push(e); await G.drawIn(e, 260, c); }
        } },
      { cap: `Only one of them passes through ${T(`(${px},\\ ${py})`)}. Slide the line up or down (change ${T('b')}) until it hits the point.`,
        run: async (c) => {
          await G.reveal(G.point(px, py, { color: RED, r: 8, label: T(`(${px},\\ ${py})`), pos: m > 0 ? 'nw' : 'ne' }), c);
          ln = G.curve(() => ({ subs: [[G.toPx(-6, -6 * m + st.b), G.toPx(6, 6 * m + st.b)]] }), { color: LINE, width: 4 }, 'u7l10-sl', G.layers.data);
          bp = G.point(0, st.b, { color: BCOL, r: 8 });
          const b0 = st.b; await tween(c, 1600, (t) => { st.b = b0 + (b - b0) * t; ln._bkDraw(); G.moveTo(bp, 0, st.b); });
          fam.forEach((e) => (e.style.opacity = 0.35));
        } },
      { cap: `Algebra finds that ${T('b')}: substitute the point, ${T(`x=${px}`)} and ${T(`y=${py}`)}: ${T(`${py}=${m}${par(px)}+b`)}.`,
        run: async (c) => { await show(c, line(P, T(`${cX(py)}=${m}${par(`\\textcolor{${XI}}{${px}}`).replace(/^\((.*)\)$/, '($1)')}+b`).replace('(', '('), 'u7l10-mline')); } },
      { cap: `Multiply: ${T(`${m}${par(px)}=${mx}`)}, so ${T(`${py}=${mx}+b`)}. ${mx >= 0 ? 'Subtract' : 'Add'} ${T(String(Math.abs(mx)))} on both sides: ${T(`b=${b}`)}.`,
        run: async (c) => { await show(c, line(P, T(`${py}=${mx}+b`), 'u7l10-mline')); await show(c, line(P, T(cB(`b=${b}`)), 'u7l10-mline')); } },
      { cap: `Rewrite with both numbers: ${T(yEq([m, 1], b))}. The slid line crosses the ${T('y')}-axis at ${T(String(b))} ✓.`,
        run: async (c) => {
          const e = h('div', 'u7l10-bigeq', T(yEq([m, 1], b, { col: true }))); P.appendChild(e); await pop(c, e);
          const l = G.label(0, b, T(cB(String(b))), { pos: m > 0 ? 'w' : 'e', cls: 'bk-ptlab u7l10-blab' }); await pop(c, l); await pulse(c, bp, 1.5);
        } }
    ];
  }
};

/* =============================== explainer 6: two points =============================== */
const TP = {
  ex6: { label: 'Example 6 check', A: [1, 4], B: [4, 13], X: 'x', Y: 'y', win: { xmin: -3, xmax: 6, ymin: -4, ymax: 16, xstep: 1, ystep: 1, ylabels: 2 }, unit: '' },
  ch2: { label: 'Challenge 2 check: the balloon', A: [3, 450], B: [7, 1050], X: 't', Y: 'A', win: { xmin: 0, xmax: 16, ymin: 0, ymax: 2400, xstep: 1, ystep: 100, ylabels: 300, xlabels: 2, xtitle: 't\\text{ (min)}', ytitle: 'A\\text{ (m)}', origin: true }, unit: 'm per minute', pred: 15 }
};
const twoPts = {
  title: 'Two points: slope first, then b',
  height: 470,
  minW: 900,
  choices: Object.keys(TP).map((k) => ({ v: k, label: TP[k].label })),
  intro: (k) => `Through ${T(`(${TP[k].A.join(',\\ ')})`)} and ${T(`(${TP[k].B.join(',\\ ')})`)}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = TP[k], [x1, y1] = d.A, [x2, y2] = d.B, run = x2 - x1, rise = y2 - y1, m = rise / run, b = y1 - m * x1, X = d.X, Y = d.Y;
    const G = new Graph(stage, Object.assign({ x: 14, y: 14, width: 430, height: 442, pad: [20, 20, 34, 52] }, d.win));
    const P = panel(stage, 460, 14, ex.W - 474, 442, 'Two steps', 'u7l10-big');
    const fmtN = (v) => (Math.abs(v) >= 1000 ? String(v).replace(/(\d)(\d{3})$/, '$1\\,$2') : String(v));
    const eqT = (col) => (b === 0 ? `${Y}=${col ? cM(m) : m}${X}` : `${Y}=${col ? cM(m) : m}${X}${b < 0 ? '-' : '+'}${col ? cB(Math.abs(b)) : Math.abs(b)}`);
    const steps = [
      { cap: `Plot the two points ${T(`(${x1},\\ ${fmtN(y1)})`)} and ${T(`(${x2},\\ ${fmtN(y2)})`)}.`,
        run: async (c) => { for (const [x, y] of [d.A, d.B]) await G.reveal(G.point(x, y, { color: RED, r: 7, label: T(`(${x},\\ ${fmtN(y)})`), pos: 'nw' }), c); } },
      { cap: `<b>Step 1:</b> the slope. Run ${T(`${x2}-${x1}=${run}`)}, rise ${T(`${fmtN(y2)}-${fmtN(y1)}=${fmtN(rise)}`)}. ${T(`m=\\dfrac{${fmtN(rise)}}{${run}}=${m}`)}.`,
        run: async (c) => { const t = tri(G, x1, y1, run, rise, { runText: `run ${run}`, riseText: `rise ${rise}` }); await t.draw(c, 400); await show(c, line(P, `<b>1</b> ${T(`m=\\dfrac{${fmtN(y2)}-${fmtN(y1)}}{${x2}-${x1}}=\\dfrac{${fmtN(rise)}}{${run}}=${cM(m)}`)}`, 'u7l10-mline')); } },
      { cap: `<b>Step 2:</b> substitute ${T(`m=${m}`)} and either point, say ${T(`(${x1},\\ ${fmtN(y1)})`)}: ${T(`${fmtN(y1)}=${m}(${x1})+b`)}, so ${T(`${fmtN(y1)}=${fmtN(m * x1)}+b`)} and ${T(`b=${b}`)}.`,
        run: async (c) => { await show(c, line(P, `<b>2</b> ${T(`${fmtN(y1)}=${m}(${x1})+b`)}`, 'u7l10-mline')); await show(c, line(P, T(`${fmtN(y1)}=${fmtN(m * x1)}+b\\ \\Rightarrow\\ ${cB('b=' + b)}`), 'u7l10-mline')); } },
      { cap: `So ${T(eqT(false))}. ${b === 0 ? 'Here b = 0: the line starts at the origin.' : ''} Draw it: it passes through both points.`,
        run: async (c) => {
          const e = h('div', 'u7l10-bigeq', T(eqT(true))); P.appendChild(e); await pop(c, e);
          await G.drawIn(G.line({ m, b }, { color: LINE, width: 4 }), 700, c); await G.reveal(G.point(0, b, { color: BCOL, r: 8 }), c);
        } },
      d.pred ? { cap: `The slope is the rate: <b>${m} ${d.unit}</b>. Predict ${T(`${X}=${d.pred}`)}: ${T(`${Y}=${m}(${d.pred})=${fmtN(m * d.pred)}`)} m.`,
        run: async (c) => { await show(c, line(P, `${T(`${Y}=${m}(${d.pred})=${fmtN(m * d.pred)}`)} m`, 'u7l10-mline u7l10-ok')); await G.reveal(G.point(d.pred, m * d.pred, { color: ORNG, r: 8, label: T(`(${d.pred},\\ ${fmtN(m * d.pred)})`), pos: 'w' }), c); } }
        : { cap: `Check with the <b>other</b> point: ${T(`${m}(${x2})${b < 0 ? '-' : '+'}${Math.abs(b)}=${y2}`)} ✓.`,
          run: async (c) => { await show(c, line(P, `check: ${T(`${m}(${x2})${b < 0 ? '-' : '+'}${Math.abs(b)}=${y2}`)} ✓`, 'u7l10-mline u7l10-ok')); await stampP(c, P, 'checked'); } }
    ];
    return steps;
  }
};

/* =============================== explainer 7: general form and the cover-up =============================== */
const GF = {
  ex7a: { label: 'Example 7(a) check: to general form', kind: 'to', m: 5, b: -2 },
  ex7c: { label: 'Example 7(c) check: 2x + 3y − 12 = 0', kind: 'cover', A: 2, B: 3, C: -12 },
  ex8c: { label: 'Example 8(c) check: 3x − y − 3 = 0', kind: 'cover', A: 3, B: -1, C: -3 }
};
const coefT = (a, v, first) => { const s = a < 0 ? '-' : first ? '' : '+', n = Math.abs(a) === 1 ? '' : Math.abs(a); return `${s}${n}${v}`; };
const general = {
  title: 'General form: convert it, cover it up',
  height: 450,
  minW: 900,
  choices: Object.keys(GF).map((k) => ({ v: k, label: GF[k].label })),
  intro: 'General form: integers, A positive, everything on one side, = 0. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = GF[k];
    const G = new Graph(stage, { x: ex.W - 374, y: 14, width: 360, height: 422, xmin: -4, xmax: 8, ymin: -6, ymax: 8, ylabels: 2, xlabels: 2 });
    const P = panel(stage, 14, 14, ex.W - 402, 422, d.kind === 'to' ? 'To general form' : 'Cover-up intercepts', 'u7l10-big');
    if (d.kind === 'to') {
      return [
        { cap: `Start with ${T('y=5x-2')}. General form needs <b>everything on one side</b> and ${T('=0')} on the other.`,
          run: async (c) => { await show(c, line(P, T('y=5x-2'), 'u7l10-mline')); await G.drawIn(G.line({ m: 5, b: -2 }, { color: LINE, width: 4 }), 600, c); } },
        { cap: `Move ${T('y')} to the right (subtract ${T('y')} from both sides), so the ${T('x')}-term stays positive: ${T('0=5x-y-2')}.`,
          run: async (c) => { const l = line(P, `${T('0=5x\\textcolor{' + ORNG + '}{-y}-2')} <span class="u7l10-enote">${T('-y')} both sides</span>`, 'u7l10-mline'); await show(c, l); } },
        { cap: `Flip it around: ${T('5x-y-2=0')}. Check: ${T('A=5')} is positive, and ${T('A')}, ${T('B')}, ${T('C')} are integers ✓.`,
          run: async (c) => { const e = h('div', 'u7l10-bigeq', T('5x-y-2=0')); P.appendChild(e); await pop(c, e); await show(c, line(P, `${T('A=5,\\ B=-1,\\ C=-2')} ✓`, 'u7l10-ok')); await stampP(c, P, 'general form'); } },
        { cap: `Same line, new outfit: the graph did not move. Any point that works in one form works in the other, e.g. ${T('(1,\\ 3)')}: ${T('5(1)-3-2=0')} ✓.`,
          run: async (c) => { await G.reveal(G.point(1, 3, { color: RED, r: 7, label: T('(1,\\ 3)'), pos: 'e' }), c); await show(c, line(P, `${T('(1,\\ 3)')}: ${T('5(1)-3-2=0')} ✓`, 'u7l10-mline')); } }
      ];
    }
    const { A, B, C } = d, xi = -C / A, yi = -C / B;
    const eqTok = () => { const r = h('div', 'u7l10-erow u7l10-cover'); [[coefT(A, 'x', true), 'x'], [coefT(B, 'y'), 'y'], [String(C < 0 ? C : '+' + C), 'c'], ['=0', 'z']].forEach(([s, kk]) => { const sp = h('span', 'u7l10-etk u7l10-ct-' + kk, T(s)); r.appendChild(sp); }); return r; };
    const r0 = eqTok(); P.appendChild(r0);
    const cover = async (c, kk) => { const sp = r0.querySelector('.u7l10-ct-' + kk); sp.classList.add('u7l10-covered'); await pulse(c, sp, 1.08); };
    const uncover = () => r0.querySelectorAll('.u7l10-covered').forEach((s) => s.classList.remove('u7l10-covered'));
    return [
      { cap: `${T(`${coefT(A, 'x', true)}${coefT(B, 'y')}${C}=0`)}. For the ${T('x')}-intercept, ${T('y=0')}: <b>cover up</b> the ${T('y')}-term.`,
        run: async (c) => { await cover(c, 'y'); } },
      { cap: `What is left: ${T(`${coefT(A, 'x', true)}${C}=0`)}, so ${T(`${coefT(A, 'x', true)}=${-C}`)} and ${T(`x=${xi}`)}. The ${T('x')}-intercept is ${T(`(${xi},\\ 0)`)}.`,
        run: async (c) => { await show(c, line(P, T(`${coefT(A, 'x', true)}${C}=0\\ \\Rightarrow\\ x=${cX(xi)}`), 'u7l10-mline')); await G.reveal(G.point(xi, 0, { color: XI, r: 8, label: T(`(${xi},\\ 0)`), pos: 'se' }), c); } },
      { cap: `For the ${T('y')}-intercept, ${T('x=0')}: cover up the ${T('x')}-term. ${T(`${coefT(B, 'y', true)}${C}=0`)}, so ${T(`y=${yi}`)}: the point ${T(`(0,\\ ${yi})`)}.`,
        run: async (c) => { uncover(); await cover(c, 'x'); await show(c, line(P, T(`${coefT(B, 'y', true)}${C}=0\\ \\Rightarrow\\ y=${cB(yi)}`), 'u7l10-mline')); await G.reveal(G.point(0, yi, { color: BCOL, r: 8, label: T(`(0,\\ ${yi})`), pos: yi > 0 ? 'ne' : 'w' }), c); } },
      { cap: `Two points are enough: join the intercepts and extend the line. This is the <b>two-intercept method</b>.`,
        run: async (c) => { uncover(); await G.drawIn(G.line([xi, 0], [0, yi], { color: LINE, width: 4 }), 700, c); await stampP(c, P, 'two intercepts'); } }
    ];
  }
};

/* =============================== explainer 8: horizontal and vertical =============================== */
const HV = {
  ex8a: { label: 'Example 8(a) check: y = 3', kind: 'h', k: 3, pts: [[-4, 3], [-1, 3], [2, 3], [5, 3]] },
  ex8b: { label: 'Example 8(b) check: x = −4', kind: 'v', k: -4, pts: [[-4, -3], [-4, 0], [-4, 2], [-4, 5]] }
};
const hv = {
  title: 'Horizontal y = k, vertical x = k',
  height: 440,
  minW: 860,
  choices: Object.keys(HV).map((k) => ({ v: k, label: HV[k].label })),
  intro: 'One of the coordinates is stuck. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = HV[k], H = d.kind === 'h', eq = H ? `y=${d.k}` : `x=${d.k}`;
    const G = new Graph(stage, { x: 14, y: 14, width: 420, height: 412, xmin: -6, xmax: 6, ymin: -6, ymax: 6 });
    const P = panel(stage, 450, 14, ex.W - 464, 412, T(eq), 'u7l10-big');
    const tb = h('table', 'u7l10-tt u7l10-tt2', `<tr><th>${T('x')}</th><th>${T('y')}</th></tr>`); P.appendChild(tb);
    return [
      { cap: `${T(eq)} says: ${H ? T('y') : T('x')} is <b>always</b> ${T(String(d.k))}, and ${H ? T('x') : T('y')} can be anything. Make a few points.`,
        run: async (c) => { for (const [x, y] of d.pts) { const r = h('tr', '', `<td>${T(String(x))}</td><td>${T(String(y))}</td>`); tb.appendChild(r); r.querySelector(H ? 'td:last-child' : 'td').classList.add('u7l10-stuck'); await pop(c, r, 200); await G.reveal(G.point(x, y, { color: RED, r: 7 }), c); } } },
      { cap: `They line up ${H ? '<b>across</b>: a horizontal line' : '<b>up and down</b>: a vertical line'} through ${H ? T(`(0,\\ ${d.k})`) : T(`(${d.k},\\ 0)`)}.`,
        run: async (c) => { await G.drawIn(H ? G.line({ m: 0, b: d.k }, { color: LINE, width: 4 }) : G.line({ x: d.k }, { color: LINE, width: 4 }), 700, c); await show(c, line(P, `<b>${H ? 'horizontal' : 'vertical'}</b>`, 'u7l10-mline')); } },
      { cap: H ? `Slope: between any two points the rise is ${T('0')}, so ${T('m=\\dfrac{0}{\\text{run}}=0')}.` : `Slope: between any two points the run is ${T('0')}, and we can’t divide by 0: the slope is <b>undefined</b>.`,
        run: async (c) => { const t = H ? tri(G, -4, 3, 6, 0.0001, { runText: 'run 6', riseText: 'rise 0', riseSide: 'n' }) : tri(G, -4, -3, 0.0001, 5, { runText: 'run 0', riseText: 'rise 5', runSide: 's' }); await t.draw(c, 400); await show(c, line(P, H ? T('m=0') : `${T('m')} undefined`, 'u7l10-mline')); await stampP(c, P, H ? 'slope 0' : 'undefined'); } }
    ];
  }
};

/* =============================== explainer 9: which method? =============================== */
const WT = {
  ex4a: { label: 'Example 4(a)', given: 'slope 6, y-intercept −3', path: ['start', 'mb', 'w1', 'ans'], lines: [`${T('m=6,\\ b=-3')}`, T('y=6x-3')] },
  ex5b: { label: 'Example 5(b)', given: 'slope −2 through (−1, 6)', path: ['start', 'mp', 'w2', 'ans'], lines: [T('y=-2x+b'), T('6=-2(-1)+b\\ \\Rightarrow\\ b=4'), T('y=-2x+4')] },
  ex6: { label: 'Example 6', given: 'through (1, 4) and (4, 13)', path: ['start', 'tp', 'w3', 'w2', 'ans'], lines: [T('m=\\dfrac{13-4}{4-1}=3'), T('4=3(1)+b\\ \\Rightarrow\\ b=1'), T('y=3x+1')] },
  ex2b: { label: 'Example 2(b)', given: 'the equation 4x + y = 9', path: ['start', 'gf', 'w4', 'ans'], lines: [T('4x+y=9'), T('y=-4x+9'), T('m=-4,\\ b=9')] },
  ch3c: { label: 'Challenge 3(c)', given: '⊥ to slope 2, through (−4, 5)', path: ['start', 'mp', 'w2', 'ans', 'gen'], pre: 'perpendicular: flip and change the sign, ', lines: [T('m=-\\tfrac{1}{2}'), T('5=-\\tfrac12(-4)+b\\ \\Rightarrow\\ b=3'), T('y=-\\tfrac12x+3\\ \\Rightarrow\\ x+2y-6=0')] }
};
const whichTool = {
  title: 'What am I given? One chart for the whole unit',
  height: 500,
  minW: 960,
  choices: Object.keys(WT).map((k) => ({ v: k, label: WT[k].label })),
  intro: (k) => `Given: <b>${WT[k].given}</b>. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = WT[k], W = ex.W, cx = W / 2, col4 = [0.13, 0.38, 0.62, 0.87].map((f) => f * W);
    const F = new Flowchart(stage, { x: 0, y: 4, width: W, height: 360,
      nodes: {
        start: { x: cx, y: 32, w: 330, h: 50, html: '<b>What am I given?</b>', cls: 'bk-round' },
        mb: { x: col4[0], y: 118, w: 205, h: 56, html: `<b>${T('m')} and ${T('b')}</b>`, color: 'blue' },
        mp: { x: col4[1], y: 118, w: 205, h: 56, html: `<b>${T('m')} and a point</b>`, color: 'blue' },
        tp: { x: col4[2], y: 118, w: 205, h: 56, html: '<b>two points</b>', color: 'blue' },
        gf: { x: col4[3], y: 118, w: 205, h: 56, html: '<b>another form</b>', color: 'blue' },
        w1: { x: col4[0], y: 214, w: 205, h: 70, html: `<b>write it</b>straight into ${T('y=mx+b')}`, color: 'green' },
        w3: { x: col4[2], y: 214, w: 205, h: 70, html: `<b>slope first</b>${T('m=\\tfrac{y_2-y_1}{x_2-x_1}')}`, color: 'purple' },
        w2: { x: col4[1], y: 214, w: 205, h: 70, html: '<b>substitute a point</b>solve for <i>b</i>', color: 'purple' },
        w4: { x: col4[3], y: 214, w: 205, h: 70, html: `<b>isolate ${T('y')}</b>then read ${T('m')}, ${T('b')}`, color: 'purple' },
        ans: { x: cx - 120, y: 316, w: 290, h: 52, html: `<b>${T('y=mx+b')}</b>`, cls: 'bk-round', color: 'green' },
        gen: { x: cx + 230, y: 316, w: 250, h: 52, html: `<b>general form</b> if asked`, cls: 'bk-dashed', color: 'amber' }
      },
      edges: [
        { from: 'start', to: 'mb', route: 'vhv' }, { from: 'start', to: 'mp', route: 'vhv' }, { from: 'start', to: 'tp', route: 'vhv' }, { from: 'start', to: 'gf', route: 'vhv' },
        { from: 'mb', to: 'w1' }, { from: 'mp', to: 'w2' }, { from: 'tp', to: 'w3' }, { from: 'gf', to: 'w4' }, { from: 'w3', to: 'w2', label: 'then' },
        { from: 'w1', to: 'ans', route: 'vh' }, { from: 'w2', to: 'ans' }, { from: 'w4', to: 'ans', route: 'vh' }, { from: 'ans', to: 'gen' }
      ] });
    const A = panel(stage, 14, 372, W - 28, 116, '', 'u7l10-wtp');
    const row = h('div', 'u7l10-wtrow'); A.appendChild(row);
    const steps = [{ cap: `Given: <b>${d.given}</b>. ${d.pre ? 'First the slope: ' + d.pre + 'so we have ' : 'That is '}<b>${{ mb: 'm and b', mp: 'm and a point', tp: 'two points', gf: 'another form' }[d.path[1]]}</b>.`,
      run: async (c) => { await F.light(c, d.path.slice(0, 2)); } }];
    const rest = d.path.slice(1);
    d.lines.forEach((L, i) => {
      const seg = i === 0 ? rest.slice(0, 2) : i === d.lines.length - 1 ? rest.slice(Math.min(i, rest.length - 2)) : rest.slice(i, i + 2);
      steps.push({ cap: L, run: async (c) => {
        for (let j = 1; j < seg.length; j++) { if (!F.edge(seg[j - 1], seg[j]).classList.contains('bk-lit')) await F.go(c, seg[j - 1], seg[j]); await F.visit(c, seg[j]); }
        const sp = h('span', 'u7l10-wtl', L); row.appendChild(sp); await pop(c, sp);
      } });
    });
    return steps;
  }
};

/* =============================== explainer 10: Challenge 3 (parallel and perpendicular) =============================== */
const parperp = {
  title: 'Challenge 3: a parallel line and a perpendicular line',
  height: 480,
  minW: 900,
  choices: [{ v: 'ch3', label: 'Challenge 3 check' }],
  intro: `${T('A(-2,\\ -3)')}, ${T('B(1,\\ 3)')}, ${T('P(3,\\ -1)')}, ${T('Q(-4,\\ 5)')}. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const G = new Graph(stage, { x: 14, y: 14, width: 450, height: 452, xmin: -7, xmax: 7, ymin: -8, ymax: 8, ylabels: 2, xlabels: 2 });
    const P = panel(stage, 480, 14, ex.W - 494, 452, 'Challenge 3', 'u7l10-big');
    let t1 = null;
    return [
      { cap: `(a) Plot ${T('A(-2,\\ -3)')} and ${T('B(1,\\ 3)')}. Run ${T('3')}, rise ${T('6')}: ${T('m_{AB}=\\dfrac{3-(-3)}{1-(-2)}=\\dfrac{6}{3}=2')}.`,
        run: async (c) => {
          for (const [n, x, y, pos] of [['A', -2, -3, 'se'], ['B', 1, 3, 'nw']]) await G.reveal(G.point(x, y, { color: INK, r: 7, label: T(n), pos }), c);
          await G.drawIn(G.segment([-2, -3], [1, 3], { color: INK, width: 4 }), 500, c);
          t1 = tri(G, -2, -3, 3, 6); await t1.draw(c, 350);
          await show(c, line(P, `(a) ${T(`m_{AB}=\\dfrac{6}{3}=${cM(2)}`)}`, 'u7l10-mline'));
        } },
      { cap: `(b) Parallel means the <b>same slope</b>, ${T('m=2')}. Through ${T('P(3,\\ -1)')}: ${T('-1=2(3)+b')}, so ${T('-1=6+b')} and ${T('b=-7')}. ${T('L_1:\\ y=2x-7')}.`,
        run: async (c) => {
          t1.fade();
          await G.reveal(G.point(3, -1, { color: '#1e8c50', r: 7, label: T('P'), pos: 'se' }), c);
          const t = tri(G, 3, -1, 1, 2, { labels: false }); await t.draw(c, 250);
          await G.drawIn(G.line({ m: 2, b: -7 }, { color: '#1e8c50', width: 4 }), 600, c);
          await G.reveal(G.point(0, -7, { color: BCOL, r: 7, label: T('-7'), pos: 'w' }), c);
          await show(c, line(P, `(b) ${T('-1=2(3)+b\\Rightarrow b=-7')}`, 'u7l10-mline')); await show(c, line(P, T('L_1:\\ y=2x-7'), 'u7l10-mline u7l10-ok'));
        } },
      { cap: `(c) Perpendicular: <b>flip it and change the sign</b>. ${T('2=\\tfrac21')} becomes ${T('-\\tfrac12')}: from ${T('Q(-4,\\ 5)')} go right 2, down 1.`,
        run: async (c) => {
          await G.reveal(G.point(-4, 5, { color: TEAL, r: 7, label: T('Q'), pos: 'nw' }), c);
          const t = tri(G, -4, 5, 2, -1, { labels: false }); await t.draw(c, 250);
          const ab = G.line({ m: 2, b: 1 }, { color: GRAY, width: 2.5, dash: '7 6', arrows: false }); await G.drawIn(ab, 400, c);
          await G.drawIn(G.line({ m: -0.5, b: 3 }, { color: TEAL, width: 4 }), 600, c);
          const V = G.toPx(0.8, 2.6), A1 = G.toPx(1.8, 4.6), B1 = G.toPx(2.8, 1.6);
          rightMark(G.layers.data, V, A1, B1, 14, { color: TEAL, width: 2.5 });
          await show(c, line(P, `(c) ${T('m=-\\tfrac12')} (flip, change sign)`, 'u7l10-mline'));
        } },
      { cap: `Substitute ${T('Q(-4,\\ 5)')}: ${T('5=-\\tfrac12(-4)+b')}, so ${T('5=2+b')} and ${T('b=3')}. ${T('y=-\\tfrac12x+3')}.`,
        run: async (c) => { await G.reveal(G.point(0, 3, { color: BCOL, r: 7, label: T('3'), pos: 'e' }), c); await show(c, line(P, T('5=-\\tfrac12(-4)+b\\Rightarrow b=3'), 'u7l10-mline')); await show(c, line(P, T('y=-\\tfrac12x+3'), 'u7l10-mline')); } },
      { cap: `General form: multiply every term by 2 to clear the fraction, ${T('2y=-x+6')}, then move everything left: ${T('x+2y-6=0')} (${T('A=1')} positive ✓).`,
        run: async (c) => { await show(c, line(P, T('\\times2:\\ 2y=-x+6'), 'u7l10-mline')); const e = h('div', 'u7l10-bigeq', T('L_2:\\ x+2y-6=0')); P.appendChild(e); await pop(c, e); } }
    ];
  }
};

/* =============================== mount =============================== */
mountWarm();
mountFigures();
export const explainers = mountExplainers({ dominoes, table, rearrange, stepper, solveB, twoPts, general, hv, whichTool, parperp });
export const _test = { DOM, TB, RE, SP, SB, TP, GF, HV, WT };

/* ===================== Stand Up Break! (whiteboard stations; ../standup.js) =====================
 * Beginning: m and b → the equation, or a quick rearrange (kx + y = c) → m and b.
 * Progressing: a slope and a point → the equation (substitute, solve for b).
 * Mastery: two points → the equation in slope–intercept and general form, or a parallel / perpendicular line through a point.
 * Integer answers for b (no calculator). */
const suF = (n, d = 1) => fr(n, d);
const suEq = (n, d, b) => yEq([n, d], b);
const suGen = (n, d, b) => { // y = (n/d)x + b → -n x + d y - d b = 0 tidy, A > 0
  let A = -n, B = d, C = -d * b; if (A < 0 || (A === 0 && B < 0)) { A = -A; B = -B; C = -C; }
  const g = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C)) || 1; A /= g; B /= g; C /= g;
  return `${A ? coefT(A, 'x', true) : ''}${B ? coefT(B, 'y', !A) : ''}${C ? (C < 0 ? C : '+' + C) : ''}=0`;
};
function suBeg(r) {
  if (r.chance(0.5)) {
    const fracM = r.chance(0.3), d = fracM ? r.pick([2, 3, 4, 5]) : 1; let n = r.int(1, 6) * r.sign(); if (fracM && gcd(Math.abs(n), d) !== 1) n = r.sign();
    const b = r.int(-9, 9);
    return { text: `Write the equation of the line with slope <span class="su-m"></span>and <i>y</i>-intercept shown below.`, q: `m=${suF(n, d)},\\quad b=${b}`, a: [suEq(n, d, b)] };
  }
  const k = r.int(2, 7) * r.sign(), c = r.int(-9, 9);
  return { text: 'Rearrange into slope–intercept form, then state <i>m</i> and <i>b</i>.', q: `${coefT(k, 'x', true)}+y=${c}`,
    a: [`y=${-k}x${c < 0 ? c : '+' + c}`.replace('+0', ''), `m=${-k},\\quad b=${c}`] };
}
function suPrg(r) {
  for (;;) {
    const m = r.int(1, 5) * r.sign(), x = r.int(-5, 5), b = r.int(-9, 9), y = m * x + b; if (x === 0 || Math.abs(y) > 20) continue;
    return { text: 'Determine the equation of the line, in the form <i>y</i> = <i>mx</i> + <i>b</i>.', q: `m=${m}\\ \\text{ through }(${x},\\ ${y})`,
      a: [`y=${m}x+b`, `${y}=${m}${par(x)}+b\\ \\Rightarrow\\ ${y}=${m * x}+b\\ \\Rightarrow\\ b=${b}`, suEq(m, 1, b)] };
  }
}
function suMas(r) {
  if (r.chance(0.5)) {
    for (;;) {
      const m = r.int(1, 4) * r.sign(), b = r.int(-8, 8), x1 = r.int(-4, 3), x2 = x1 + r.int(1, 4), y1 = m * x1 + b, y2 = m * x2 + b;
      if (Math.abs(y1) > 20 || Math.abs(y2) > 20) continue;
      return { text: 'Determine the equation of the line through the two points. Give it in slope–intercept form and in general form.', q: `(${x1},\\ ${y1})\\ \\text{ and }\\ (${x2},\\ ${y2})`,
        a: [`m=\\frac{${y2}-${par(y1)}}{${x2}-${par(x1)}}=\\frac{${y2 - y1}}{${x2 - x1}}=${m}`, `${y1}=${m}${par(x1)}+b\\ \\Rightarrow\\ b=${b}`, suEq(m, 1, b), suGen(m, 1, b)] };
    }
  }
  for (;;) {
    const n = r.int(1, 4) * r.sign(), d = r.pick([1, 1, 2, 3]), perp = r.chance(0.5);
    if (gcd(Math.abs(n), d) !== 1) continue;
    const [pn, pd] = perp ? (n < 0 ? [d, -n] : [-d, n]) : [n, d];   // the new slope pn/pd (pd > 0)
    const x = pd * r.int(-3, 3) || pd, b = r.int(-8, 8), y = pn * x / pd + b;
    if (Math.abs(y) > 20) continue;
    return { text: `Line <i>L</i> has slope <span class="su-m"></span>shown below. Determine the equation of the line ${perp ? '<b>perpendicular</b>' : '<b>parallel</b>'} to <i>L</i> through the point, in slope–intercept form.`,
      q: `m_L=${suF(n, d)},\\quad (${x},\\ ${y})`,
      a: [`m=${suF(pn, pd)}${perp ? '\\ \\text{(flip, change sign)}' : '\\ \\text{(same slope)}'}`, `${y}=${suF(pn, pd)}${par(x)}+b\\ \\Rightarrow\\ ${y}=${pn * x / pd}+b\\ \\Rightarrow\\ b=${b}`, suEq(pn, pd, b)] };
  }
}
standup('u7l10', {
  intro: 'At your whiteboard: find m, then find b. Check your answer with the point(s).',
  levels: {
    BEG: (r) => suBeg(r),   // m and b → equation, or rearrange kx + y = c
    PRG: (r) => suPrg(r),   // slope and a point → substitute, solve for b
    MAS: (r) => suMas(r)    // two points → both forms; or parallel / perpendicular through a point
  }
});
