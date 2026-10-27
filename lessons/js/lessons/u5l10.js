/* Math 15 · Unit 5 · Lesson 10 — Function Notation: Graphs, Conversions, and Real-World Models.
 * The hiking-trail warm-up, the static figures and seven explainers, plus the Stand Up Break.
 * Adapted from Math 10C u5l7 (swap, reading forwards/backwards, the candle scene, the limits of a model).
 * Colour code (same as Lesson 9): the function's NAME purple, the INPUT blue, the OUTPUT amber; the graph teal. */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, appear, pulse, sleep, tween,
  svgEl, liveCtx
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
/* KaTeX allowing \htmlClass (to colour parts of an expression) */
const K = (src) => {
  try { return window.katex.renderToString(String(src), { throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src); }
};

/* ---------------- small helpers ---------------- */
const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u5l10-panel', title ? `<div class="u5l10-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u5l10-line' + (cls ? ' ' + cls : ''), html); p.appendChild(d); return d; };
const lineIn = (c, p, html, cls) => fadeIn(c, line(p, html, cls));
const dash = (G, a, b, color = 'slate', w = 2.6) => G.segment(a, b, { color, width: w, dash: '7 6' });
const pill = (G, x, y, html, color, pos) => G.label(x, y, html, { pos, cls: 'bk-pill u5l10-gpill', color, gap: 6 });
/** forwards: from (a, 0) up/down to (a, y), then across to the vertical axis */
async function readFwd(c, G, a, y, o = {}) {
  const color = o.color || 'blue', ax = G.axisX(), ay = G.axisY(), out = [];
  out.push(G.point(a, ay, { color, r: 6 })); await pop(c, out[0]);
  if (Math.abs(y - ay) > 1e-9) { const s = dash(G, [a, ay], [a, y], color); out.push(s); await G.drawIn(s, 550, c); }
  const p = G.point(a, y, { color, r: 7.5 }); out.push(p); await pop(c, p);
  if (Math.abs(a - ax) > 1e-9 && Math.abs(y - ay) > 1e-9) { const s = dash(G, [a, y], [ax, y], color); out.push(s); await G.drawIn(s, 550, c); }
  if (o.yLab) { const l = pill(G, ax, y, o.yLab, color, o.yPos || 'w'); out.push(l); await pop(c, l); }
  return out;
}
/** backwards: from (0, b) across to (x, b) for each x, then down/up to the horizontal axis */
async function readBack(c, G, b, xs, o = {}) {
  const color = o.color || 'amber', ax = G.axisX(), ay = G.axisY(), out = [];
  const s0 = G.point(ax, b, { color, r: 6 }); out.push(s0); await pop(c, s0);
  if (o.full) { const hl = G.hline(b, { color, width: 2.2, dash: '4 7' }); out.push(hl); await G.drawIn(hl, 700, c); }
  for (const x of xs) {
    if (!o.full) { const s = dash(G, [ax, b], [x, b], color); out.push(s); await G.drawIn(s, 500, c); }
    const p = G.point(x, b, { color, r: 7.5 }); out.push(p); await pop(c, p);
    if (Math.abs(b - ay) > 1e-9) { const s = dash(G, [x, b], [x, ay], color); out.push(s); await G.drawIn(s, 450, c); }
    if (o.xLab) { const l = pill(G, x, ay, o.xLab(x), color, o.xPos || (b > ay ? 's' : 'n')); out.push(l); await pop(c, l); }
  }
  return out;
}
const say = (stage, x, y, w, html) => { const d = add(stage, h('div', 'u5l10-say', html), x, y); if (w) d.style.width = w + 'px'; d.style.opacity = 0; return d; };
const sayIn = (c, d) => fadeIn(c, d, 380);

/* ---------------- the hiking trail (warm-up, pointLink, readGraph) ---------------- */
const TR = [[0, 200], [2, 400], [4, 200], [5, 100], [7, 500], [8, 400]];
const trAt = (d) => { for (let i = 0; i < TR.length - 1; i++) { const [a, p] = TR[i], [b, q] = TR[i + 1]; if (d >= a - 1e-9 && d <= b + 1e-9) return p + (q - p) * (d - a) / (b - a); } return null; };
const trSolve = (v) => { const xs = []; for (let i = 0; i < TR.length - 1; i++) { const [a, p] = TR[i], [b, q] = TR[i + 1]; if ((v - p) * (v - q) <= 0 && p !== q) { const x = a + (v - p) * (b - a) / (q - p); if (!xs.some((u) => Math.abs(u - x) < 1e-9)) xs.push(x); } } return xs.sort((u, w) => u - w); };
const PLACES = { 0: 'trailhead', 2: 'lookout', 5: 'lake', 7: 'summit', 8: 'end' };
const TRWIN = { xmin: 0, xmax: 8, ymin: 0, ymax: 600, ystep: 100, xtitle: 'd\\text{ (km)}', ytitle: 'h\\text{ (m)}' };
function drawTrail(G, o = {}) {
  G.polyline([...TR, [8, 0], [0, 0]], { closed: true, fill: '#dcefcf', fillOpacity: 1, color: '#dcefcf', width: 1 });
  const L = G.polyline(TR, { color: o.color || '#8a5a2b', width: 4.2 });
  if (o.labels !== false) {
    G.label(0, 200, 'Trailhead', { pos: 'ne', cls: 'bk-ptlab u5l10-place' });
    G.label(2, 400, 'Lookout', { pos: 'n', cls: 'bk-ptlab u5l10-place' });
    G.label(5, 100, 'Lake', { pos: 'e', cls: 'bk-ptlab u5l10-place u5l10-lake' });
    G.label(7, 500, 'Summit', { pos: 'n', cls: 'bk-ptlab u5l10-place' });
    G.label(8, 400, 'End', { pos: 'sw', cls: 'bk-ptlab u5l10-place' });
  }
  return L;
}

/* ============================================================================================================
 * Warm-up: walk the hiker along the trail; show h(d) = 300
 * ============================================================================================================ */
function mountWarm() {
  const host = document.getElementById('u5l10-trail'); if (!host) return;
  const G = new Graph(host, Object.assign({ width: 640, height: 268, fontSize: 15, ylabels: 100, pad: [14, 16, 30, 52] }, TRWIN));
  drawTrail(G);
  const hiker = G.point(0, 200, { color: 'red', r: 9 });
  const read = document.getElementById('u5l10-wread');
  let d = 0;
  const show = () => {
    const v = trAt(d), pl = PLACES[d];
    G.moveTo(hiker, d, v);
    read.innerHTML = K(`h(\\htmlClass{u5l10-cin}{${d}})=\\htmlClass{u5l10-cout}{${Math.round(v)}}`) + `<span class="u5l10-wsub">${d} km walked, ${Math.round(v)} m high${pl ? ': the ' + pl : ''}</span>`;
  };
  document.querySelectorAll('[data-walk]').forEach((b) => b.addEventListener('click', () => { d = Math.max(0, Math.min(8, d + Number(b.dataset.walk))); show(); }));
  show();
  let extra = null;
  const btn = document.querySelector('[data-h300]');
  if (btn) btn.addEventListener('click', async () => {
    if (extra) { G.remove(...extra); extra = null; btn.textContent = 'Show it on the trail'; return; }
    btn.textContent = 'Hide it'; extra = [];
    const c = liveCtx(), hl = G.hline(300, { color: 'amber', width: 2.4, dash: '5 6' }); extra.push(hl); await G.drawIn(hl, 600, c);
    for (const x of trSolve(300)) { const p = G.point(x, 300, { color: 'amber', r: 8 }); extra.push(p); await pop(c, p); const l = pill(G, x, 0, T(String(x)), 'amber', 'n'); extra.push(l); }
  });
}

/* ============================================================================================================
 * Static figures
 * ============================================================================================================ */
const EX1 = { xmin: -5, xmax: 5, ymin: -3, ymax: 7, ytitle: 'f(x)' };
const CAWIN = { xmin: 0, xmax: 11, ymin: 0, ymax: 22, ystep: 2, ylabels: 4, xlabels: 2, xtitle: 't', ytitle: 'h(t)' };
function mountFigures() {
  const $ = (id) => document.getElementById(id);
  if ($('u5l10-g-ex1')) { const G = new Graph($('u5l10-g-ex1'), Object.assign({ width: 340, height: 340 }, EX1)); G.segment([-4, -2], [4, 6], { color: 'ink', width: 3.6, ends: ['closed', 'closed'] }); }
  if ($('u5l10-g-ex5')) new Graph($('u5l10-g-ex5'), Object.assign({ width: 330, height: 410 }, CAWIN));
  if ($('u5l10-a-ex5')) {
    const G = new Graph($('u5l10-a-ex5'), Object.assign({ width: 230, height: 260, fontSize: 14 }, CAWIN));
    G.segment([0, 20], [10, 0], { color: 'red', width: 3, ends: ['closed', 'closed'] });
    G.label(0, 20, T('(0,\\ 20)'), { pos: 'ne', color: 'red', cls: 'bk-ptlab' }); G.label(10, 0, T('(10,\\ 0)'), { pos: 'n', color: 'red', cls: 'bk-ptlab', gap: 12 });
  }
}

/* ============================================================================================================
 * 1. pointLink — every f(a) = b is a point (a, b)
 * ============================================================================================================ */
const PL = { f: T('f(x)=3x+1'), trail: 'Warm-up trail: ' + T('h(7)=500') };
const pointLink = {
  title: 'Every f(a) = b is a point (a, b)',
  height: 440,
  minW: 860,
  choices: Object.keys(PL).map((k) => ({ v: k, label: PL[k] })),
  intro: (k) => (k === 'f' ? `Evaluate ${T('f(x)=3x+1')}, then plot each answer. Press <b>Next</b>.` : 'The trail graph has no formula, but it is still a function. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const W = ex.W, GW = 430;
    const P = panel(stage, 10, 10, W - GW - 34, 420, k === 'f' ? 'Evaluate' : 'Read the graph');
    if (k === 'f') {
      const G = new Graph(stage, { x: W - GW - 12, y: 8, width: GW, height: 424, xmin: -3, xmax: 4, ymin: -4, ymax: 12, ylabels: 2, ytitle: 'f(x)' });
      const f = (x) => 3 * x + 1;
      const one = async (c, a, pos) => { await lineIn(c, P, `${T(`f(${a})=3(${a})+1=${f(a)}`)} &nbsp;→&nbsp; ${T(`(${a},\\ ${f(a)})`)}`); await G.reveal(G.point(a, f(a), { color: 'blue', r: 7, coords: true, pos }), c); };
      return [
        { cap: `Evaluate: ${T('f(2)=3(2)+1=7')}.`, run: (c) => lineIn(c, P, `${T('f(2)=3(2)+1=7')}`, 'u5l10-big') },
        { cap: `${T('f(2)=7')} means: input ${T('2')}, output ${T('7')}. Go ${T('2')} across and ${T('7')} up: the point ${T('(2,\\ 7)')}.`,
          run: async (c) => { await readFwd(c, G, 2, 7, { color: 'blue', yLab: T('7') }); G.label(2, 7, T('(2,\\ 7)'), { pos: 'e', color: 'blue', cls: 'bk-ptlab' }); } },
        { cap: `Two more: ${T('f(0)=1')} gives ${T('(0,\\ 1)')} and ${T('f(-1)=-2')} gives ${T('(-1,\\ -2)')}.`,
          run: async (c) => { await one(c, 0, 'e'); await one(c, -1, 'w'); } },
        { cap: `All the points lie on one line: the graph of ${T('f')}. The graph holds <b>every</b> answer ${T('f(a)')}, so we can read values straight off it.`,
          run: async (c) => { await G.drawIn(G.fn(f, { color: 'ink', width: 3 }), 900, c); await lineIn(c, P, 'The graph is a picture of every answer.', 'u5l10-note'); } }
      ];
    }
    const G = new Graph(stage, Object.assign({ x: W - GW - 12, y: 8, width: GW, height: 424, ylabels: 100, fontSize: 15 }, TRWIN));
    drawTrail(G, { labels: false });
    const pt = async (c, d, v, pos, txt) => { await G.reveal(G.point(d, v, { color: 'blue', r: 7, label: T(`(${d},\\ ${v})`), pos }), c); await lineIn(c, P, `${T(`h(${d})=${v}`)} &nbsp;→&nbsp; ${T(`(${d},\\ ${v})`)}<div class="u5l10-small">${txt}</div>`); };
    return [
      { cap: `${T('h(7)=500')}: input ${T('7')} km, output ${T('500')} m. It is the point ${T('(7,\\ 500)')}: the summit.`, run: (c) => pt(c, 7, 500, 'nw', 'after 7 km, 500 m high') },
      { cap: `${T('h(0)=200')} is the point ${T('(0,\\ 200)')}: the trailhead.`, run: (c) => pt(c, 0, 200, 'e', 'at the start, 200 m high') },
      { cap: `${T('h(5)=100')} is the point ${T('(5,\\ 100)')}: the lake.`, run: (c) => pt(c, 5, 100, 'se', 'after 5 km, 100 m high') },
      { cap: 'No formula this time: the <b>graph itself</b> is the rule. Every input still has exactly one output.', run: (c) => lineIn(c, P, 'Each distance has one height: a function.', 'u5l10-note') }
    ];
  }
};

/* ============================================================================================================
 * 2. readGraph — Example 1 forwards and backwards, and the trail's "big one"
 * ============================================================================================================ */
const RG = { a: 'Example 1(a) check', b: 'Example 1(b) check', trail: 'Warm-up: the big one' };
const readGraph = {
  title: 'Reading a graph forwards and backwards',
  height: 460,
  minW: 860,
  choices: Object.keys(RG).map((k) => ({ v: k, label: RG[k] })),
  intro: (k) => ({ a: `Find ${T('f(-3)')}, ${T('f(0)')} and ${T('f(2)')}: the <b>input</b> is given.`, b: `Find ${T('x')} when ${T('f(x)=-2')}, ${T('3')} and ${T('6')}: the <b>output</b> is given.`, trail: `The trail: ${T('h(2)')}, then ${T('h(d)=300')}.` }[k] + ' Press <b>Next</b>.'),
  make(stage, k, ex) {
    const W = ex.W, GW = 520;
    const P = panel(stage, GW + 26, 10, W - GW - 36, 440, k === 'b' ? 'Backwards' : k === 'a' ? 'Forwards' : 'Both ways');
    if (k === 'trail') {
      const G = new Graph(stage, Object.assign({ x: 10, y: 8, width: GW, height: 444, ylabels: 100, fontSize: 15 }, TRWIN));
      drawTrail(G); let cur = [];
      return [
        { cap: `<b>Forwards</b>: ${T('h(2)')}. Start at ${T('2')} on the horizontal axis, up to the trail, across: ${T('h(2)=400')}.`,
          run: async (c) => { cur = await readFwd(c, G, 2, 400, { color: 'blue', yLab: T('400') }); await lineIn(c, P, `${T('h(2)=400')}: one answer`, 'u5l10-cin'); } },
        { cap: `<b>Backwards</b>: ${T('h(d)=300')}. Start at ${T('300')} on the vertical axis and go <b>all the way</b> across. Stop at every crossing.`,
          run: async (c) => { G.remove(...cur); cur = await readBack(c, G, 300, trSolve(300), { full: true, xLab: (x) => T(String(x)) }); } },
        { cap: `Three crossings: ${T('d=1')}, ${T('d=3')} and ${T('d=6')}. The bench could be in <b>3 places</b>.`,
          run: (c) => lineIn(c, P, `${T('h(d)=300')}: ${T('d=1,\\ 3,\\ 6')}`, 'u5l10-cout') },
        { cap: `Exactly once? Only at the very bottom, ${T('100')} m (the lake), and the very top, ${T('500')} m (the summit).`,
          run: async (c) => { G.remove(...cur); for (const v of [100, 500]) await readBack(c, G, v, trSolve(v), { full: true, color: 'green', xLab: (x) => T(String(x)) }); await lineIn(c, P, `${T('h(d)=100')}: ${T('d=5')} &nbsp; ${T('h(d)=500')}: ${T('d=7')}`, 'u5l10-cok'); } }
      ];
    }
    const G = new Graph(stage, Object.assign({ x: 10, y: 8, width: GW, height: 444, fontSize: 17 }, EX1));
    const L = G.segment([-4, -2], [4, 6], { color: 'ink', width: 3.6, ends: ['closed', 'closed'] });
    if (k === 'a') {
      let cur = [];
      return [
        { cap: `i) ${T('f(-3)')}: the input is ${T('-3')}. From ${T('x=-3')} go <b>down</b> to the line, then across: ${T('f(-3)=-1')}.`,
          run: async (c) => { cur = await readFwd(c, G, -3, -1, { color: 'blue', yLab: T('-1'), yPos: 'e' }); await lineIn(c, P, `i) ${T('f(-3)=-1')}`, 'u5l10-cin'); } },
        { cap: `ii) ${T('f(0)')}: ${T('x=0')} <b>is</b> the vertical axis. The line crosses it at ${T('2')}, so ${T('f(0)=2')}.`,
          run: async (c) => { const p = G.point(0, 2, { color: 'blue', r: 7.5 }); await pop(c, p); await pop(c, pill(G, 0, 2, T('2'), 'blue', 'w')); await lineIn(c, P, `ii) ${T('f(0)=2')}`, 'u5l10-cin'); } },
        { cap: `iii) ${T('f(2)')}: from ${T('x=2')} go <b>up</b> to the line, then across: ${T('f(2)=4')}.`,
          run: async (c) => { await readFwd(c, G, 2, 4, { color: 'blue', yLab: T('4') }); await lineIn(c, P, `iii) ${T('f(2)=4')}`, 'u5l10-cin'); } },
        { cap: `The line’s rule is ${T('f(x)=x+2')}. Check: ${T('-3+2=-1')}, ${T('0+2=2')}, ${T('2+2=4')} ✓`,
          run: async (c) => { G.label(-1.5, 4.6, T('f(x)=x+2'), { pos: 'w', color: 'ink', cls: 'bk-ptlab' }); await lineIn(c, P, `rule ${T('f(x)=x+2')} ✓`, 'u5l10-note'); } }
      ];
    }
    const back = (b, x, word) => ({ cap: `${word}) ${T(`f(x)=${b}`)}: the output is ${T(String(b))}. Start at ${T(String(b))} on the vertical axis, across to the line, then ${b < 0 ? 'up' : 'down'}: ${T(`x=${x}`)}.`,
      run: async (c) => { await readBack(c, G, b, [x], { xLab: () => T(String(x)), xPos: b < 0 ? 'n' : 's' }); await lineIn(c, P, `${word}) ${T(`f(x)=${b}`)} → ${T(`x=${x}`)}`, 'u5l10-cout'); } });
    return [back(-2, -4, 'i'), back(3, 1, 'ii'), back(6, 4, 'iii'),
      { cap: `${T('f(x)=-2')} and ${T('f(x)=6')} are the two <b>ends</b> of the line. A slanted line meets each height only <b>once</b>, so each answer is single.`,
        run: async (c) => { await pulse(c, L, 1.02); await lineIn(c, P, 'one crossing each time', 'u5l10-note'); } }];
  }
};

/* ============================================================================================================
 * 3. swap — the same rule in two notations (Example 2)
 * ============================================================================================================ */
const SW = {
  a1: { label: 'Example 2(a) i', dir: 'f2y', name: 'f', v: 'x', rhs: '4x-3', fn: (x) => 4 * x - 3, win: { xmin: -3, xmax: 4, ymin: -12, ymax: 14, ystep: 2, ylabels: 4 } },
  a2: { label: 'Example 2(a) ii', dir: 'f2y', name: 'g', v: 't', rhs: 't+6', fn: (t) => t + 6, win: { xmin: -8, xmax: 4, ymin: -4, ymax: 10, xlabels: 2, ylabels: 2 } },
  b1: { label: 'Example 2(b) i', dir: 'y2f', name: 'f', v: 'x', rhs: '5x+2', fn: (x) => 5 * x + 2, win: { xmin: -3, xmax: 3, ymin: -12, ymax: 16, ystep: 2, ylabels: 4 } },
  b2: { label: 'Example 2(b) ii', dir: 'y2f', name: 'f', v: 'x', rhs: '9-x', fn: (x) => 9 - x, win: { xmin: -3, xmax: 12, ymin: -4, ymax: 12, xlabels: 2, ylabels: 2 } }
};
const swap = {
  title: 'One rule, two notations',
  height: 420,
  minW: 860,
  choices: Object.keys(SW).map((k) => ({ v: k, label: SW[k].label })),
  intro: (k) => (SW[k].dir === 'f2y' ? `Rewrite ${T(SW[k].name + '(' + SW[k].v + ')=' + SW[k].rhs)} in ${T('x')}-${T('y')} notation. Press <b>Next</b>.` : `Rewrite ${T('y=' + SW[k].rhs)} in function notation. Press <b>Next</b>.`),
  make(stage, k, ex) {
    const d = SW[k], v = d.v, iv = `\\htmlClass{u5l10-iv}{${v}}`, rhsK = d.rhs.split(v).join(iv);
    const fLHS = `\\htmlClass{u5l10-tg u5l10-nm}{${d.name}}(\\htmlClass{u5l10-tg u5l10-in}{${v}})`, yLHS = '\\htmlClass{u5l10-tg u5l10-out}{y}';
    const fT = `${d.name}(${v})`;
    const [l1, l2] = d.dir === 'f2y' ? [fLHS, 'y'] : [yLHS, `${d.name}(${iv})`];
    const wrap = add(stage, h('div', 'u5l10-sw'), 0, 0); box(wrap, ex.W - 400, 420);
    const row = (y, lhs) => {
      const r = add(wrap, h('div', 'u5l10-row'), 26, y);
      const a = h('div', 'u5l10-lhs', K(lhs)), e = h('div', 'u5l10-eqs', K('=')), b = h('div', 'u5l10-rhs', K(rhsK));
      r.append(a, e, b); return { r, a, e, b };
    };
    const R1 = row(40, l1), R2 = row(196, l2);
    [R2.a, R2.e, R2.b].forEach((e) => (e.style.opacity = 0));
    wrap.querySelectorAll('.u5l10-nm').forEach((e) => (e.dataset.tag = 'name'));
    wrap.querySelectorAll('.u5l10-in').forEach((e) => (e.dataset.tag = 'input'));
    wrap.querySelectorAll('.u5l10-out').forEach((e) => (e.dataset.tag = 'output'));
    add(wrap, h('div', 'u5l10-ntag', d.dir === 'f2y' ? 'function notation' : 'x-y notation'), 26, 6);
    const tag2 = add(wrap, h('div', 'u5l10-ntag', d.dir === 'f2y' ? 'x-y notation' : 'function notation'), 26, 162); tag2.style.opacity = 0;
    const arrow = add(wrap, h('div', 'u5l10-repl', `replace ${T(d.dir === 'f2y' ? fT : 'y')} with ${T(d.dir === 'f2y' ? 'y' : fT)} ↓`), 26, 124); arrow.style.opacity = 0;
    const legend = add(wrap, h('div', 'u5l10-leg', `<div class="u5l10-cin">⟷ horizontal axis: the input ${T(v)}</div><div class="u5l10-cout">↕ vertical axis: the output ${T(fT)}, or ${T('y')}</div>`), 26, 300); legend.style.opacity = 0;
    const G = new Graph(stage, Object.assign({ x: ex.W - 392, y: 22, width: 380, height: 380, xtitle: v, ytitle: fT, fontSize: 15 }, d.win));
    return [
      { cap: d.dir === 'f2y' ? `${T(fT + '=' + d.rhs)} is in <b>function notation</b>: ${T(d.name)} is the <b>name</b> and ${T(v)}, in the brackets, is the <b>input</b>.`
        : `${T('y=' + d.rhs)} is in <b>${T('x')}-${T('y')} notation</b>: ${T('y')} is the <b>output</b>.`,
        run: async (c) => { wrap.classList.add('u5l10-tags'); await pulse(c, R1.a, 1.12); } },
      { cap: d.dir === 'f2y' ? `To write it with ${T('y')}, replace the name and its brackets, ${T(fT)}, with ${T('y')}.`
        : `To write it in function notation, replace ${T('y')} with a name and brackets holding the input: ${T(fT)}.`,
        run: async (c) => { wrap.classList.remove('u5l10-tags'); await c.anim(R1.a, [{ opacity: 1 }, { opacity: 0.35 }], 300); await fadeIn(c, arrow); await appear(c, tag2); await pop(c, R2.a); } },
      { cap: 'Copy the right side <b>exactly</b>. The rule hasn’t changed, only how it is written.',
        run: async (c) => { await Promise.all([R2.e, R2.b].map((e) => c.anim(e, [{ opacity: 0, transform: 'translateY(-156px)' }, { opacity: 1, transform: 'none' }], 700))); } },
      { cap: v !== 'x' ? `The input stays ${T(v)}: we get ${T('y=' + d.rhs)}, with variables ${T(v)} and ${T('y')}.` : (d.dir === 'y2f' && k === 'b2' ? `Any name works: ${T('g(x)=9-x')} or ${T('h(x)=9-x')} is just as good.` : `The input is still ${T('x')} on both lines.`),
        run: async (c) => { wrap.classList.add('u5l10-hot'); await Promise.all([R1.b, R2.b].map((e) => pulse(c, e, 1.06))); } },
      { cap: `Same rule, same graph: inputs (${T(v)}) run along the <b>horizontal</b> axis, outputs (${T(fT)} or ${T('y')}) up the <b>vertical</b> axis.`,
        run: async (c) => {
          const xa = G.segment([G.win.xmin, G.axisY()], [G.win.xmax, G.axisY()], { color: 'blue', width: 6, opacity: 0.45 });
          const ya = G.segment([G.axisX(), G.win.ymin], [G.axisX(), G.win.ymax], { color: 'amber', width: 6, opacity: 0.5 });
          await Promise.all([G.drawIn(xa, 600, c), G.drawIn(ya, 600, c)]);
          await G.drawIn(G.fn(d.fn, { color: 'ink' }), 900, c);
          await fadeIn(c, legend);
        } }
    ];
  }
};

/* ============================================================================================================
 * 4. tableFill — Example 3 (h(x) = 3x + 3) and Example 4 (E(n) = 8n): fill the table, read it both ways
 * ============================================================================================================ */
const TF = {
  h: { label: 'Example 3 check', name: 'h', v: 'x', rule: 'h(x)=3x+3', f: (x) => 3 * x + 3, sub: (x) => `3(${x})+3`, xs: [0, 1, 2, 3, 4, 5], step: 3,
    win: { xmin: 0, xmax: 6, ymin: 0, ymax: 20, ystep: 2, ylabels: 4, ytitle: 'h(x)' } },
  E: { label: 'Example 4(a)–(c) check', name: 'E', v: 'n', rule: 'E(n)=8n', f: (n) => 8 * n, sub: (n) => `8(${n})`, xs: [1, 2, 3, 4, 5], step: 8,
    win: { xmin: 0, xmax: 8, ymin: 0, ymax: 64, ystep: 8, ylabels: 16, xtitle: 'n', ytitle: 'E(n)' } }
};
const tableFill = {
  title: 'A table in function notation',
  height: 460,
  minW: 900,
  choices: Object.keys(TF).map((k) => ({ v: k, label: TF[k].label })),
  intro: (k) => `Fill the table for ${T(TF[k].rule)}, then read it both ways. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = TF[k], W = ex.W, n = d.name, v = d.v, GW = 320;
    add(stage, h('div', 'u5l10-rule', K(d.rule)), 20, 10);
    const subL = add(stage, h('div', 'u5l10-msub', ''), 20, 66);
    const tb = new ValueTable(stage, { x: 20, y: 124, headers: [v, `${n}(${v})`], rows: d.xs.map((x) => [x, d.f(x)]), hide: 1, tap: false, layout: 'h', cellW: 64, cellH: 58, headW: 80, diffs: true, diffSpace: 64 });
    const note = say(stage, 20, 330, W - GW - 50, ''); note.classList.add('u5l10-tnote');
    const G = new Graph(stage, Object.assign({ x: W - GW - 10, y: 8, width: GW, height: 444, xtitle: v, fontSize: 15 }, d.win));
    const x0 = d.xs[0], last = d.xs[d.xs.length - 1];
    const sub = (x) => `${n}(${x})=${d.sub(x)}=${d.f(x)}`;
    const plot = (c, x) => G.reveal(G.point(x, d.f(x), { color: 'blue', r: 6.5 }), c, 220);
    const steps = [
      { cap: `Put ${T(v + '=' + x0)} into the rule: ${T(sub(x0))}.`,
        run: async (c) => { subL.innerHTML = K(sub(x0)); await fadeIn(c, subL); await tb.reveal(0, 1, c); await plot(c, x0); } },
      { cap: `Do the same for each input, up to ${T(sub(last))}. Each column is a point ${T(`(${v},\\ ${n}(${v}))`)}.`,
        run: async (c) => { for (let i = 1; i < d.xs.length; i++) { subL.innerHTML = K(sub(d.xs[i])); await tb.reveal(i, 1, c); await plot(c, d.xs[i]); } } },
      { cap: `Each step of 1 in ${T(v)} adds ${T(String(d.step))} to the output.`, run: (c) => tb.diffs(c, { col: 1 }) }
    ];
    if (k === 'h') return steps.concat([
      { cap: `(b) ${T('h(4)')}: find ${T('4')} in the <b>top</b> row and read the bottom row: ${T('h(4)=15')}.`,
        run: async (c) => { tb.highlight(4, true); note.innerHTML = `<span class="u5l10-cin">input ${T('4')}</span> → <span class="u5l10-cout">output ${T('15')}</span>: ${T('h(4)=15')}`; await sayIn(c, note); await readFwd(c, G, 4, 15, { color: 'blue', yLab: T('15') }); } },
      { cap: `(c) ${T('h(x)=15')}: search the <b>bottom</b> row for ${T('15')}. It sits under ${T('x=4')}. The same fact, read the other way.`,
        run: async (c) => { await pulse(c, tb.cell(4, 1), 1.2); await fadeIn(c, line(note, `${T('h(x)=15')} → ${T('x=4')}`, 'u5l10-cout')); } }
    ]);
    return steps.concat([
      { cap: `(b) ${T('E(6)')} isn’t in the table. Add a column: ${T('E(6)=8(6)=48')}. Walking 6 dogs earns $48.`,
        run: async (c) => { tb.addRow([6, 48], c); await tb.reveal(5, 1, c); await plot(c, 6); note.innerHTML = `${T('E(6)=48')}: 6 dogs earn <b>$48</b>`; await sayIn(c, note); } },
      { cap: `(c) $56 is an <b>output</b>. One more ${T('+8')}: ${T('48+8=56')} at ${T('n=7')}. With algebra: ${T('8n=56')}, so ${T('n=56\\div8=7')} dogs.`,
        run: async (c) => { tb.addRow([7, 56], c); await tb.reveal(6, 1, c); tb.highlight(6, true); await plot(c, 7); await fadeIn(c, line(note, `${T('E(n)=56')} → ${T('n=7')} dogs`, 'u5l10-cout')); await readBack(c, G, 56, [7], { xLab: () => T('7') }); } }
    ]);
  }
};

/* ============================================================================================================
 * 5. dogs — Example 4 on the graph: dots, a value in words, working backwards, and a whole-number domain
 * ============================================================================================================ */
const PAW = '<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="26" rx="9" ry="8" fill="#7a4a26"/><ellipse cx="9" cy="16" rx="4" ry="5" fill="#7a4a26"/><ellipse cx="16" cy="9" rx="4" ry="5" fill="#7a4a26"/><ellipse cx="24" cy="9" rx="4" ry="5" fill="#7a4a26"/><ellipse cx="31" cy="16" rx="4" ry="5" fill="#7a4a26"/></svg>';
const DG = { b: '(b) check: ' + T('E(6)'), c: '(c) check: $56', d: '(d) check: domain' };
const dogs = {
  title: 'Walking dogs: dots, not a line',
  height: 440,
  minW: 900,
  choices: Object.keys(DG).map((k) => ({ v: k, label: DG[k] })),
  intro: (k) => ({ b: `What does ${T('E(6)')} mean?`, c: 'How many dogs for $56?', d: 'Which inputs make sense?' }[k] + ' Press <b>Next</b>.'),
  make(stage, k, ex) {
    const W = ex.W, GW = 470;
    const G = new Graph(stage, { x: W - GW - 10, y: 8, width: GW, height: 424, xmin: 0, xmax: 9, ymin: 0, ymax: 72, ystep: 8, ylabels: 16, xtitle: 'n', ytitle: 'E(n)', fontSize: 15 });
    const P = panel(stage, 10, 10, W - GW - 40, 420, 'Jasmine’s day');
    const pen = h('div', 'u5l10-pen'); P.appendChild(pen);
    const paws = []; for (let i = 0; i < 8; i++) { const e = h('div', 'u5l10-paw', PAW); pen.appendChild(e); e.style.opacity = 0; paws.push(e); }
    const jar = line(P, '', 'u5l10-jar');
    const setDogs = async (c, m) => { for (let i = 0; i < 8; i++) { if (i < m && paws[i].style.opacity !== '1') await pop(c, paws[i], 200); else if (i >= m) paws[i].style.opacity = 0; } jar.innerHTML = `${m} dog${m === 1 ? '' : 's'} → ${T(`E(${m})=8(${m})=${8 * m}`)}`; };
    const dots = (c, ns, color = 'gray') => Promise.all(ns.map((m, i) => G.reveal(G.point(m, 8 * m, { color, r: 6 }), c, 200 + i * 40)));
    const first = { cap: `From the table: ${T('(1,\\ 8)')}, ${T('(2,\\ 16)')}, … ${T('(5,\\ 40)')}. Each dog adds ${T('\\$8')}.`, run: (c) => dots(c, [1, 2, 3, 4, 5]) };
    if (k === 'b') return [first,
      { cap: `${T('E(6)=8(6)=48')}. Up from ${T('n=6')}, across to ${T('48')}.`,
        run: async (c) => { await setDogs(c, 6); await readFwd(c, G, 6, 48, { color: 'blue', yLab: T('48') }); } },
      { cap: 'In words, with units: <b>walking 6 dogs earns Jasmine $48</b>.', run: (c) => lineIn(c, P, 'Walking <b class="u5l10-cin">6 dogs</b> earns <b class="u5l10-cout">$48</b>.', 'u5l10-big') }];
    if (k === 'c') return [first,
      { cap: `$56 is an <b>output</b>. Start at ${T('56')} on the vertical axis, across to the pattern, then down: ${T('n=7')}.`,
        run: async (c) => { await dots(c, [6, 7], 'gray'); await readBack(c, G, 56, [7], { xLab: () => T('7') }); } },
      { cap: `Check with algebra: ${T('8n=56')}, so ${T('n=56\\div8=7')}. Jasmine walked <b>7 dogs</b>.`,
        run: async (c) => { await setDogs(c, 7); await lineIn(c, P, `${T('8n=56')} → ${T('n=7')} dogs ✓`, 'u5l10-cout'); } }];
    return [first,
      { cap: `She can walk ${T('0,\\ 1,\\ 2,')} … up to ${T('8')} dogs in a day. Add the dots for ${T('0,\\ 6,\\ 7,\\ 8')}.`,
        run: async (c) => { await dots(c, [0, 6, 7, 8], 'blue'); await setDogs(c, 8); } },
      { cap: `What about between the dots? ${T('E(2.5)=20')}, but <b>2.5 dogs</b> makes no sense. So the dots are <b>not joined</b>.`,
        run: async (c) => { const p = G.point(2.5, 20, { color: 'red', r: 7, open: true }); await pop(c, p); const [px, py] = G.toPx(2.5, 20); await stampIn(c, stamp(stage, '✗ 2.5 dogs?', { ok: false, x: W - GW - 10 + px + 12, y: 8 + py - 52, size: 'sm' })); } },
      { cap: `<b>Domain</b>: the inputs that make sense, a list of whole numbers: ${T('D=\\{0,\\ 1,\\ 2,\\ 3,\\ 4,\\ 5,\\ 6,\\ 7,\\ 8\\}')}.`,
        run: async (c) => { await Promise.all([0, 1, 2, 3, 4, 5, 6, 7, 8].map((m, i) => pop(c, G.point(m, 0, { color: 'blue', r: 6 }), 260, { delay: i * 50 }))); await lineIn(c, P, `${T('D=\\{0,\\ 1,\\ 2,\\ \\ldots,\\ 8\\}')}`, 'u5l10-cin'); } }];
  }
};

/* ============================================================================================================
 * Candle scene (Example 5): a candle beside the graph of h(t) = 20 − 2t, drawn to the graph's height scale
 * ============================================================================================================ */
const hFn = (t) => 20 - 2 * t;
function candleScene(stage, ex, win) {
  const G = new Graph(stage, Object.assign({ x: 236, y: 8, width: ex.W - 246, height: 444, xtitle: 't\\text{ (min)}', ytitle: 'h(t)\\text{ (cm)}', fontSize: 16 }, win));
  const base = 8 + G.toPx(0, 0)[1], uy = G.uy, cx = 120;
  add(stage, box(h('div', 'u5l10-plate'), 120, 10), cx - 60, base);
  const wax = add(stage, h('div', 'u5l10-wax'), cx - 26, 0), wick = add(stage, h('div', 'u5l10-wick'), cx - 1.5, 0), flame = add(stage, h('div', 'u5l10-flame'), cx - 11, 0);
  const clock = add(stage, h('div', 'u5l10-read'), 14, 2);
  const ruler = add(stage, h('div', 'u5l10-ruler'), 34, base - 20 * uy); box(ruler, 22, 20 * uy);
  for (let k = 0; k <= 20; k += 4) add(ruler, h('div', 'u5l10-rt', String(k)), 0, 20 * uy - k * uy);
  const st = { t: 0 };
  const set = (t) => {
    st.t = t; const hh = Math.max(0, hFn(t));
    box(wax, 52, hh * uy); wax.style.top = base - hh * uy + 'px';
    wick.style.top = base - hh * uy - 10 + 'px'; box(wick, 3, 10);
    flame.style.top = base - hh * uy - 40 + 'px'; flame.style.opacity = hh > 0 ? 1 : 0; wick.style.opacity = hh > 0 ? 1 : 0;
    clock.innerHTML = `${T('t=' + (Math.round(t * 10) / 10))} min &nbsp; ${T('h=' + (Math.round(hh * 10) / 10))} cm`;
  };
  set(0);
  const burn = (c, to, ms = 1400) => { const a = st.t; return tween(c, ms, (u) => set(a + (to - a) * u)); };
  return { G, set, burn, st };
}
const CA = { a: '(a) check', b: '(b)(c) check', d: '(d) check', e: '(e) check' };
const candle = {
  title: 'Example 5 check: a burning candle',
  height: 460,
  minW: 860,
  choices: Object.keys(CA).map((k) => ({ v: k, label: CA[k] })),
  intro: (k) => ({ a: 'Sketch the graph of ' + T('h(t)=20-2t') + '.', b: 'Find and explain ' + T('h(3)') + '.', d: 'What does ' + T('h(0)') + ' tell us?', e: 'When does the candle burn out?' }[k] + ' Press <b>Next</b>.'),
  make(stage, k, ex) {
    const S = candleScene(stage, ex, Object.assign({}, CAWIN, { ymax: 24 })), G = S.G;
    const cx0 = 236 + 0.5 * (ex.W - 246), card = say(stage, cx0, 22, ex.W - cx0 - 14, '');
    const seg = () => G.segment([0, 20], [10, 0], { color: 'ink', width: 3.6, ends: ['closed', 'closed'] });
    if (k === 'a') return [
      { cap: `Start: ${T('h(0)=20-2(0)=20')}. Plot ${T('(0,\\ 20)')}: the candle is 20 cm tall when it is lit.`,
        run: async (c) => { await pop(c, G.point(0, 20, { color: 'blue', r: 7, label: T('(0,\\ 20)'), pos: 'ne' })); } },
      { cap: `Burn-out: ${T('h(10)=20-2(10)=0')}. Plot ${T('(10,\\ 0)')}.`,
        run: async (c) => { await pop(c, G.point(10, 0, { color: 'blue', r: 7, label: T('(10,\\ 0)'), pos: 'n' })); } },
      { cap: 'Join them: the height drops 2 cm every minute, so the graph is a straight line from start to burn-out.',
        run: async (c) => { await Promise.all([G.drawIn(seg(), 2600, c), S.burn(c, 10, 2600)]); } }
    ];
    seg();
    if (k === 'b') return [
      { cap: `${T('h(3)')} asks: how tall is the candle after ${T('3')} minutes? Run the clock to ${T('t=3')}…`,
        run: async (c) => { const tr = G.point(0, 20, { color: 'blue', r: 7 }); await pop(c, tr); await Promise.all([S.burn(c, 3, 1500), G.move(c, tr, 3, 14, 1500)]); } },
      { cap: `${T('h(3)=20-2(3)=20-6=14')}. On the graph: up from ${T('t=3')}, across to ${T('14')}.`,
        run: (c) => readFwd(c, G, 3, 14, { color: 'blue', yLab: T('14') }) },
      { cap: '(c) In words: <b>3 minutes after the candle is lit, it is 14 cm tall.</b>',
        run: async (c) => { card.innerHTML = `${T('h(3)=14')}<br><span class="u5l10-cin">input: time, <b>3 min</b></span><br><span class="u5l10-cout">output: height, <b>14 cm</b></span>`; await sayIn(c, card); } }
    ];
    if (k === 'd') return [
      { cap: `${T('h(0)=20-2(0)=20')}: the output when the input is ${T('0')}, where the graph meets the <b>vertical axis</b>.`,
        run: async (c) => { await pop(c, G.point(0, 20, { color: 'amber', r: 8 })); await pop(c, pill(G, 0, 20, T('20'), 'amber', 'e')); } },
      { cap: `At ${T('t=0')} nothing has burned yet, so ${T('20')} cm is the candle’s <b>original height</b>.`,
        run: async (c) => { card.innerHTML = `${T('h(0)=20')}<br>the height <b>before</b> any burning: <b>20 cm</b>`; await sayIn(c, card); } }
    ];
    return [
      { cap: `Burned out means the height is ${T('0')}: ${T('h(t)=0')}. That is an <b>output</b>, so work backwards…`,
        run: async (c) => { await S.burn(c, 10, 2400); await pop(c, G.point(10, 0, { color: 'amber', r: 8 })); await pop(c, pill(G, 10, 0, T('10'), 'amber', 'n')); } },
      { cap: `With algebra: ${T('0=20-2t')}, so ${T('2t=20')} and ${T('t=10')}. The candle is gone after <b>10 minutes</b>.`,
        run: async (c) => { card.innerHTML = `${T('0=20-2t')}<br>${T('2t=20')}<br>${T('t=10')} minutes`; await sayIn(c, card); } }
    ];
  }
};
const limits = {
  title: 'Where does the model stop?',
  height: 460,
  minW: 940,
  intro: `The rule ${T('h(t)=20-2t')} accepts any number. The candle doesn’t. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const S = candleScene(stage, ex, { xmin: -3, xmax: 13, ymin: -6, ymax: 26, ystep: 2, ylabels: 4, xlabels: 2 }), G = S.G;
    const cx0 = 236 + 0.52 * (ex.W - 246), card = say(stage, cx0, 18, ex.W - cx0 - 14, '');
    let full;
    return [
      { cap: `As a rule, ${T('h(t)=20-2t')} works for <b>every</b> number ${T('t')}: its graph is a whole line.`,
        run: async (c) => { full = G.line([0, 20], [10, 0], { color: 'ink' }); await G.drawIn(full, 900, c); } },
      { cap: `${T('h(12)=20-2(12)=-4')}. A height of ${T('-4')} cm is impossible: after ${T('t=10')} the candle is gone.`,
        run: async (c) => { const s = G.segment([10, 0], [13, -6], { color: 'red', width: 6, opacity: 0.45 }); await G.drawIn(s, 500, c); await pop(c, G.point(12, -4, { color: 'red', r: 7, label: T('(12,\\ -4)'), pos: 'w' })); const [px, py] = G.toPx(9.2, 9); await stampIn(c, stamp(stage, '✗ impossible', { ok: false, x: 236 + px, y: 8 + py, size: 'sm' })); } },
      { cap: `${T('h(-2)=24')}? A time <b>before</b> the candle is lit isn’t part of the story either.`,
        run: async (c) => { const s = G.segment([-3, 26], [0, 20], { color: 'red', width: 6, opacity: 0.45 }); await G.drawIn(s, 500, c); await pop(c, G.point(-2, 24, { color: 'red', r: 7, label: T('(-2,\\ 24)'), pos: 'e' })); } },
      { cap: `Keep only the part that makes sense: from ${T('(0,\\ 20)')} (just lit) to ${T('(10,\\ 0)')} (burned out), both ends included.`,
        run: async (c) => { await c.anim(full, [{ opacity: 1 }, { opacity: 0.25 }], 400); await G.drawIn(G.segment([0, 20], [10, 0], { color: 'ink', width: 5, ends: ['closed', 'closed'] }), 900, c); } },
      { cap: `<b>Domain</b>: the segment’s shadow on the ${T('t')}-axis. <b>Range</b>: its shadow on the ${T('h')}-axis.`,
        run: async (c) => {
          await G.drawIn(G.shadeX(0, 10, { color: 'blue' }), 600, c); await G.drawIn(G.shadeY(0, 20, { color: 'amber' }), 600, c);
          card.innerHTML = `<span class="u5l10-cin"><b>Domain</b> ${T('0\\le t\\le 10')} (minutes)</span><br><span class="u5l10-cout"><b>Range</b> ${T('0\\le h(t)\\le 20')} (cm)</span>`;
          await sayIn(c, card);
        } }
    ];
  }
};

/* ============ wiring ============ */
mountWarm();
mountFigures();
export const explainers = mountExplainers({ pointLink, readGraph, swap, tableFill, dogs, candle, limits });

/* ============ Stand Up Break! — read a graph both ways; tables in function notation; models in words ============ */
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
  s += `<text x="${X(o.x1) - 4}" y="${Y(ax) - 9}" text-anchor="end" font-style="italic" font-size="22" ${halo}>${o.xl || 'x'}</text>` +
    `<text x="${X(ay) + 9}" y="${Y(o.y1) + 15}" font-style="italic" font-size="22" ${halo}>${o.yl || 'y'}</text>`;
  s += draw(X, Y, u);
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${label || 'graph'}" font-family="KaTeX_Main, 'Times New Roman', serif" font-size="21" fill="${SU_INK}">${s}</svg>`;
}
function suArrowHead(X, Y, x, y, dx, dy) {
  const px = dx * (X(1) - X(0)), py = dy * (Y(1) - Y(0)), L = Math.hypot(px, py) || 1, ux = px / L, uy = py / L, tx = X(x), ty = Y(y);
  const bx = tx - 14 * ux, by = ty - 14 * uy;
  return `<path d="M${suF(tx)} ${suF(ty)}L${suF(bx - 6.5 * uy)} ${suF(by + 6.5 * ux)}L${suF(bx + 6.5 * uy)} ${suF(by - 6.5 * ux)}Z" fill="${SU_C}"/>`;
}
const suPath = (X, Y, pts) => `<polyline points="${pts.map(([x, y]) => X(x) + ',' + Y(y)).join(' ')}" fill="none" stroke="${SU_C}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>`;
const suHt = (F, v) => `<i>${F}</i>(${v === 'x' ? '<i>x</i>' : String(v).replace('-', '−')})`;
function suT(terms) { // [[coef, 'x'], [const, '']] → LaTeX with signs
  let s = '';
  terms.forEach(([k, v]) => { if (k === 0) return; const a = Math.abs(k), body = (a === 1 && v ? '' : a) + v; s += (k < 0 ? '-' : s ? '+' : '') + body; });
  return s || '0';
}
const SU_MOD = [ // fee + rate × input; input whole numbers
  { F: 'C', v: 'h', setup: (f, r) => `A bike rental costs a $${f} fee plus $${r} per hour. The cost, in dollars, of renting for <i>h</i> hours is`, fee: [5, 12], rate: [3, 9], said: (n, V) => `renting a bike for ${n} hours costs $${V}`, out: (V) => `the rental cost $${V}`, unit: 'hours' },
  { F: 'T', v: 'n', setup: (f, r) => `Concert tickets cost $${r} each, plus a $${f} booking fee. The total cost, in dollars, of <i>n</i> tickets is`, fee: [4, 10], rate: [15, 30], said: (n, V) => `${n} tickets cost $${V} in total`, out: (V) => `the bill was $${V}`, unit: 'tickets' },
  { F: 'H', v: 'w', setup: (f, r) => `A plant is ${f} cm tall and grows ${r} cm each week. Its height, in centimetres, after <i>w</i> weeks is`, fee: [3, 15], rate: [2, 5], said: (n, V) => `after ${n} weeks the plant is ${V} cm tall`, out: (V) => `the plant is ${V} cm tall`, unit: 'weeks' },
  { F: 'E', v: 'n', setup: (f, r) => `Sam earns $${r} for each lawn he mows, plus a $${f} weekly allowance. His earnings, in dollars, for a week with <i>n</i> lawns are`, fee: [10, 25], rate: [12, 20], said: (n, V) => `mowing ${n} lawns in a week earns Sam $${V}`, out: (V) => `Sam earned $${V}`, unit: 'lawns' }
];
standup('u5l10', {
  intro: 'At your whiteboard station: f(a) starts on the horizontal axis; f(x) = b starts on the vertical axis. Answer models in words, with units.',
  levels: {
    BEG: (r) => { // a line: one forwards reading, one backwards reading
      const F = r.pick(['f', 'g', 'h', 'k']), [dx, dy] = r.pick([[1, 1], [1, -1], [1, 2], [1, -2], [2, 1], [2, -1]]);
      const x0 = r.int(-2, 2), y0 = r.int(-2, 2), f = (x) => y0 + dy * (x - x0) / dx;
      let a, b, xb; do { a = x0 + dx * r.int(-3, 3); b = y0 + dy * r.int(-3, 3); xb = x0 + dx * (b - y0) / dy; } while (Math.abs(f(a)) > 6 || Math.abs(a) > 6 || Math.abs(xb) > 6 || Math.abs(b) > 6 || a === xb || b === f(a));
      const end = (s) => { let t = 0; while (Math.abs(x0 + s * (t + 0.05) * dx) <= 6.6 && Math.abs(y0 + s * (t + 0.05) * dy) <= 6.6) t += 0.05; return [x0 + s * t * dx, y0 + s * t * dy]; };
      const A = end(-1), B = end(1);
      return { q: '', text: `The graph of <i>y</i> = ${suHt(F, 'x')} is shown. Find ${suHt(F, a)}. Then find <i>x</i> if ${suHt(F, 'x')} = ${suNum(b)}.`,
        fig: suPlane({ x0: -7, x1: 7, y0: -7, y1: 7 }, (X, Y) => suPath(X, Y, [A, B]) + suArrowHead(X, Y, A[0], A[1], -dx, -dy) + suArrowHead(X, Y, B[0], B[1], dx, dy), 'graph of a line'),
        a: [`${F}(${a})=${f(a)}\\quad \\text{(up or down from } x=${a}\\text{)}`, `${F}(x)=${b}:\\ x=${xb}\\quad \\text{(across from } ${b}\\text{)}`] };
    },
    PRG: (r) => { // a table in function notation, read both ways (sometimes after converting from y =)
      const F = r.pick(['f', 'g', 'h', 'p']), m = r.int(2, 6) * r.pick([1, 1, -1]), b = r.int(-6, 9), xs = [0, 1, 2, 3, 4], ys = xs.map((x) => m * x + b);
      const j = r.int(1, 4), rule = suT([[m, 'x'], [b, '']]), conv = r.chance(0.4);
      const tab = `\\begin{array}{c|ccccc}x&${xs.join('&')}\\\\\\hline ${F}(x)&${ys.join('&')}\\end{array}`;
      return { q: conv ? `y=${rule}` : `${F}(x)=${rule}`,
        text: (conv ? `Write the equation in function notation, named <i>${F}</i>. Then complete` : 'Complete') + ` a table of values for <i>x</i> = 0, 1, 2, 3, 4. Then find <i>x</i> if ${suHt(F, 'x')} = ${suNum(ys[j])}.`,
        a: (conv ? [`${F}(x)=${rule}`] : []).concat([tab, `${F}(x)=${ys[j]}\\ \\text{ under }\\ x=${j}`]) };
    },
    MAS: (r) => { // a model: evaluate and explain, then work backwards
      const s = r.pick(SU_MOD), f = r.int(s.fee[0], s.fee[1]), rt = r.int(s.rate[0], s.rate[1]), n = r.int(2, 9);
      let m; do { m = r.int(3, 12); } while (m === n);
      const V = rt * n + f, Vm = rt * m + f, rule = `${s.F}(${s.v})=${suT([[rt, s.v], [f, '']])}`;
      return { q: rule, text: `${s.setup(f, rt)} shown below. (a) Evaluate ${suHt(s.F, n)} and explain what it means. (b) How many ${s.unit} if ${s.out(Vm)}?`,
        atext: `(a) ${s.said(n, V).replace(/^./, (ch) => ch.toUpperCase())}. (b) <b>${m} ${s.unit}</b>.`,
        a: [`${s.F}(${n})=${rt}(${n})+${f}=${V}`, `${rt}${s.v}+${f}=${Vm}\\ \\Rightarrow\\ ${rt}${s.v}=${Vm - f}\\ \\Rightarrow\\ ${s.v}=${m}`] };
    }
  }
});
