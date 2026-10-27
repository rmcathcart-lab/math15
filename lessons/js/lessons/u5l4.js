/* Math 15 · Unit 5 · Lesson 4 — Where Graphs Meet the Axes: x- and y-Intercepts.
 * Reading intercepts from graphs, tables and real situations (no algebra: the Math 15 booklet reads them off).
 * Colour code: x-intercepts red, y-intercepts blue (as in Math 10C u5l3).
 * Explainers: axisZero (every point on an axis has a 0), readInt (follow the graph to the axis), meetAxes (a point rides
 * the graph; adapted from Math 10C u5l3), countMeet (miss, touch, cross), tableInt (look for the 0), story (start and end),
 * readGraph (up-and-across / across-and-down). Warm-up: Low Battery! (play the drain, race Jordan's phone). */
import {
  h, tex, add, box, Graph, ValueTable, stamp, stampIn, mountExplainers, pop, fadeIn, pulse, sleep, tween, liveCtx, pairTex, svgEl
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const XC = '#c93a33', YC = '#1f5bd6', LN = '#2b55a0', IV = '#c27a0e', DV = '#7b4fc4', GRN = '#12805a';
const n = (v) => String(v).replace('-', '−');
const pr = (x, y) => `(${x},\\ ${y})`;
const prX = (x) => `(${x},\\ \\textcolor{${XC}}{0})`;
const prY = (y) => `(\\textcolor{${YC}}{0},\\ ${y})`;
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u5l4-panel ' + cls, title ? `<div class="u5l4-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => p.appendChild(h('div', 'u5l4-line ' + cls, html));
const showLine = (c, p, html, cls) => { const d = line(p, html, cls); return fadeIn(c, d).then(() => d); };
/* a big (x, y) readout */
function readout(P) {
  const ro = P.appendChild(h('div', 'u5l4-ro', `<span class="u5l4-ro-p">(</span><b class="u5l4-ro-x">?</b><span class="u5l4-ro-p">,</span><b class="u5l4-ro-y">?</b><span class="u5l4-ro-p">)</span>`));
  const vx = ro.querySelector('.u5l4-ro-x'), vy = ro.querySelector('.u5l4-ro-y');
  const r1 = (v) => n(Math.abs(v) < 0.05 ? 0 : +v.toFixed(1));
  return {
    el: ro, vx, vy,
    set(x, y) { vx.textContent = r1(x); vy.textContent = r1(y); },
    hot(which) { vx.classList.toggle('hot', which === 'x'); vy.classList.toggle('hot', which === 'y'); }
  };
}

/* =====================================================================================
 * 1. axisZero — slide a point along each axis: one coordinate never changes from 0. */
const axisZero = {
  title: 'Every point on an axis has a zero',
  height: 450,
  minW: 860,
  intro: 'A point slides along each axis. Watch its coordinates. Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W;
    const G = new Graph(stage, { x: 10, y: 6, width: 436, height: 436, xmin: -5, xmax: 5, ymin: -5, ymax: 5 });
    const P = panel(stage, 470, 10, W - 484, 430, 'The moving point');
    const R = readout(P), notes = P.appendChild(h('div', 'u5l4-notes'));
    let dot;
    const slide = (c, a, b, ms) => tween(c, ms, (t) => { const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; G.moveTo(dot, x, y); R.set(x, y); });
    return [
      { cap: `A point slides along the <b class="u5l4-xt">${T('x')}-axis</b>. Watch the second coordinate.`,
        run: async (c) => {
          const ax = G.segment([-5, 0], [5, 0], { color: XC, width: 7 }); ax.style.opacity = 0.35; await G.drawIn(ax, 500, c);
          dot = G.point(-4, 0, { color: XC, r: 9 }); R.set(-4, 0); await pop(c, dot); R.hot('y');
          await slide(c, [-4, 0], [4.5, 0], 2200);
        } },
      { cap: `Wherever it goes on the ${T('x')}-axis, ${T('y=0')}. Every point there looks like ${T('(\\square,\\ 0)')}.`,
        run: async (c) => { for (const x of [-3, 1, 4]) await G.reveal(G.point(x, 0, { color: XC, r: 6, label: T(prX(x)), pos: x < 0 ? 'nw' : 'ne' }), c); await showLine(c, notes, `on the ${T('x')}-axis: ${T('(\\square,\\ \\textcolor{' + XC + '}{0})')}`, 'u5l4-cx'); } },
      { cap: `Now slide along the <b class="u5l4-yt">${T('y')}-axis</b>. Watch the first coordinate.`,
        run: async (c) => {
          const ay = G.segment([0, -5], [0, 5], { color: YC, width: 7 }); ay.style.opacity = 0.35; await G.drawIn(ay, 500, c);
          G.remove(dot); dot = G.point(0, -4, { color: YC, r: 9 }); R.set(0, -4); await pop(c, dot); R.hot('x');
          await slide(c, [0, -4], [0, 4.5], 2200);
        } },
      { cap: `On the ${T('y')}-axis, ${T('x=0')} every time. Every point there looks like ${T('(0,\\ \\square)')}.`,
        run: async (c) => { for (const y of [-2, 3]) await G.reveal(G.point(0, y, { color: YC, r: 6, label: T(prY(y)), pos: 'e' }), c); await showLine(c, notes, `on the ${T('y')}-axis: ${T('(\\textcolor{' + YC + '}{0},\\ \\square)')}`, 'u5l4-cy'); } },
      { cap: `A graph that crosses the ${T('x')}-axis has ${T('y=0')} there: the <b class="u5l4-xt">${T('x')}-intercept</b>. Where it crosses the ${T('y')}-axis, ${T('x=0')}: the <b class="u5l4-yt">${T('y')}-intercept</b>.`,
        run: async (c) => {
          G.remove(dot); R.hot(null); R.set(4, 0);
          await G.drawIn(G.fn((x) => -x + 4, { from: -1, to: 5.5, color: LN, width: 4 }), 800, c);
          await G.reveal(G.point(4, 0, { color: XC, r: 9 }), c); await G.reveal(G.point(0, 4, { color: YC, r: 9 }), c);
          await showLine(c, notes, `<b class="u5l4-xt">${T('x')}-intercept</b> ${T(prX(4))} &nbsp; <b class="u5l4-yt">${T('y')}-intercept</b> ${T(prY(4))}`);
        } }
    ];
  }
};

/* =====================================================================================
 * 2. readInt — follow the line to the axis, read the number, write the point with a 0 in the other spot. */
const RI = {
  rise: { label: 'A rising line', f: (x) => 2 * x + 4, from: -4.5, to: 1, win: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 }, x0: -2, y0: 4, start: -4.2, do: ['x', 'y'] },
  ex1: { label: 'Example 1', f: (x) => -1.5 * x + 3, from: -1, to: 2.8, win: { xmin: -1.5, xmax: 5.5, ymin: -1.5, ymax: 5.5 }, x0: 2, y0: 3, start: -1, do: ['x'] },
  ex2: { label: 'Example 2', f: (x) => 0.5 * x + 2, from: -2, to: 4, win: { xmin: -2.5, xmax: 4.5, ymin: -1.5, ymax: 6.5 }, x0: -4, y0: 2, start: 4, do: ['y'] }
};
const readInt = {
  title: 'Reading an intercept from a graph',
  height: 450,
  minW: 860,
  choices: [{ v: 'rise', label: RI.rise.label }, { sep: 'Example check:' }, { v: 'ex1', label: RI.ex1.label }, { v: 'ex2', label: RI.ex2.label }],
  intro: (k) => (k === 'ex1' ? 'Where does the line cross the <b>x-axis</b>? Press <b>Next</b>.' : k === 'ex2' ? 'Where does the line cross the <b>y-axis</b>? Press <b>Next</b>.' : 'Find both intercepts of this line. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = RI[k], W = ex.W;
    const G = new Graph(stage, Object.assign({ x: 10, y: 6, width: 436, height: 436 }, d.win));
    G.fn(d.f, { from: d.from, to: d.to, color: LN, width: 4 });
    const P = panel(stage, 470, 10, W - 484, 430, 'Intercepts');
    const steps = [];
    let finger = null;
    const ride = async (c, x1) => {
      if (!finger) { finger = G.point(d.start, d.f(d.start), { color: IV, r: 9 }); await pop(c, finger); }
      const x0 = finger.gx; await tween(c, 1400, (t) => { const x = x0 + (x1 - x0) * t; G.moveTo(finger, x, d.f(x)); });
    };
    d.do.forEach((ax) => {
      const isX = ax === 'x', v = isX ? d.x0 : d.y0, pt = isX ? [v, 0] : [0, v];
      steps.push({ cap: `Follow the line to the <b class="${isX ? 'u5l4-xt' : 'u5l4-yt'}">${T(ax)}-axis</b> and stop where it crosses.`,
        run: async (c) => { await ride(c, pt[0]); await pulse(c, finger, 1.5); } });
      steps.push({ cap: `Read the number on the ${T(ax)}-axis there: ${T(n(v))}.`,
        run: async (c) => {
          const tag = G.label(pt[0], pt[1], `<b>${n(v)}</b>`, { pos: isX ? (v < 0 ? 'nw' : 'ne') : (v < 0 ? 'se' : 'ne'), cls: 'u5l4-numtag', color: isX ? XC : YC, dx: isX ? 0 : 6 });
          await pop(c, tag);
        } });
      steps.push({ cap: `The point is <b>on the ${T(ax)}-axis</b>, so ${T(isX ? 'y=0' : 'x=0')}. The ${T(ax)}-intercept is ${T(isX ? prX(v) : prY(v))}.`,
        run: async (c) => { G.remove(finger); finger = null; await G.reveal(G.point(pt[0], pt[1], { color: isX ? XC : YC, r: 9 }), c); await showLine(c, P, `<b class="${isX ? 'u5l4-xt' : 'u5l4-yt'}">${T(ax)}-intercept:</b> ${T(isX ? prX(v) : prY(v))}`, 'u5l4-big'); } });
    });
    if (k === 'ex1') steps.push({ cap: `(b) The value of ${T('y')} at that point is ${T('0')}: every point on the ${T('x')}-axis has ${T('y=0')}.`, run: (c) => showLine(c, P, `(b) ${T('y=0')}`, 'u5l4-big') });
    if (k === 'ex2') steps.push({ cap: `(b) The value of ${T('x')} at that point is ${T('0')}: every point on the ${T('y')}-axis has ${T('x=0')}.`, run: (c) => showLine(c, P, `(b) ${T('x=0')}`, 'u5l4-big') });
    return steps;
  }
};

/* =====================================================================================
 * 3. meetAxes — a point rides along the graph; at each axis one coordinate becomes 0 (from Math 10C u5l3). */
const sec1 = (x) => -x + 4, ex3f = (x) => 4 * x * x / 9 - 4, para = (x) => x * x / 2 - 2;
const MEET = {
  sec1: { label: 'Section 1 line', f: sec1, a: -1.4, b: 5.4, win: { xmin: -2, xmax: 6, ymin: -2, ymax: 6 }, ev: [{ x: 0, ax: 'y', y: 4 }, { x: 4, ax: 'x', y: 0 }] },
  para: { label: 'A curve', f: para, a: -3.4, b: 3.4, win: { xmin: -4, xmax: 4, ymin: -4, ymax: 4 }, ev: [{ x: -2, ax: 'x', y: 0 }, { x: 0, ax: 'y', y: -2 }, { x: 2, ax: 'x', y: 0 }] },
  ex3: { label: 'Example 3', f: ex3f, a: -3, b: 3, win: { xmin: -4.5, xmax: 4.5, ymin: -5.5, ymax: 1.5 }, ev: [{ x: -3, ax: 'x', y: 0 }, { x: 0, ax: 'y', y: -4 }, { x: 3, ax: 'x', y: 0 }], ends: true }
};
const meetAxes = {
  title: 'Where a graph meets the axes',
  height: 450,
  minW: 860,
  choices: [{ v: 'sec1', label: MEET.sec1.label }, { v: 'para', label: MEET.para.label }, { sep: 'Example check:' }, { v: 'ex3', label: MEET.ex3.label }],
  intro: 'A point rides along the graph, showing its coordinates. Watch them each time it meets an axis. Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = MEET[k], W = ex.W;
    const G = new Graph(stage, Object.assign({ x: 10, y: 6, width: 436, height: 436 }, d.win));
    const P = panel(stage, 470, 10, W - 484, 430, 'The moving point');
    const R = readout(P), notes = P.appendChild(h('div', 'u5l4-notes'));
    let tr = null, x0 = d.a;
    const ride = (c, x1, ms = 1500) => { const a = x0; return tween(c, ms, (t) => { const x = a + (x1 - a) * t; G.moveTo(tr, x, d.f(x)); R.set(x, d.f(x)); }).then(() => { x0 = x1; }); };
    const nx = d.ev.filter((e) => e.ax === 'x').length;
    const steps = [{ cap: `Here is the graph. A point rides along it, and the panel shows its coordinates.`,
      run: async (c) => { await G.drawIn(G.fn(d.f, { from: d.a, to: d.b, color: LN, width: 4, arrows: !d.ends }), 900, c); tr = G.point(d.a, d.f(d.a), { color: IV, r: 9 }); R.set(d.a, d.f(d.a)); await pop(c, tr); } }];
    d.ev.forEach((e, i) => {
      const onX = e.ax === 'x';
      steps.push({
        cap: `${i ? 'Keep going.' : 'Slide along…'} It meets the <b class="${onX ? 'u5l4-xt' : 'u5l4-yt'}">${e.ax}-axis</b>: there ${T(onX ? 'y=0' : 'x=0')}. ${onX ? 'An' : 'The'} ${T(e.ax)}-intercept is ${T(onX ? prX(e.x) : prY(e.y))}.`,
        run: async (c) => {
          R.hot(null); await ride(c, e.x); R.set(e.x, e.y); R.hot(onX ? 'y' : 'x'); await pulse(c, R.el, 1.1);
          await G.reveal(G.point(e.x, e.y, { color: onX ? XC : YC, r: 8, label: T(pr(n(e.x), n(e.y))), pos: onX ? (e.x < 0 ? 'nw' : 'ne') : (e.y < 0 ? 'se' : 'ne') }), c);
          await showLine(c, notes, `${T(e.ax)}-intercept: ${T(pr(e.x, e.y))}`, onX ? 'u5l4-cx' : 'u5l4-cy');
        }
      });
    });
    steps.push({ cap: nx > 1 ? `This graph meets the ${T('x')}-axis <b>twice</b>, so it has <b>two</b> ${T('x')}-intercepts. List every one.` : `One ${T('x')}-intercept and one ${T('y')}-intercept. List every spot where the graph meets an axis.`,
      run: async (c) => { if (!d.ends) await ride(c, d.b, 700); R.hot(null); const s = stamp(notes, `${nx} x-intercept${nx > 1 ? 's' : ''}, 1 y-intercept`, { ok: true, size: 'sm', rotate: -3 }); s.style.alignSelf = 'flex-start'; s.style.marginTop = '8px'; await stampIn(c, s); } });
    return steps;
  }
};

/* =====================================================================================
 * 4. countMeet — slide a curve down: it misses, touches, then crosses the x-axis. */
const countMeet = {
  title: 'How many x-intercepts? Miss, touch, cross',
  height: 450,
  minW: 860,
  intro: 'Slide a curve down and count the times it meets the <b>x-axis</b>. Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, st = { k: 2 };
    const G = new Graph(stage, { x: 10, y: 6, width: 436, height: 436, xmin: -5, xmax: 5, ymin: -5, ymax: 5 });
    const P = panel(stage, 470, 10, W - 484, 430, 'x-intercepts');
    const curve = G.fn((x) => x * x / 2 + st.k, { color: LN, width: 4 });
    curve.style.opacity = 0;
    const pts = [];
    const slide = (c, to) => { const a = st.k; return tween(c, 1300, (t) => { st.k = a + (to - a) * t; curve._bkDraw(); }); };
    const mark = async (c, list) => { G.remove(...pts.splice(0)); for (const x of list) { const q = G.point(x, 0, { color: XC, r: 8, label: T(prX(x)), pos: x < 0 ? 'nw' : x > 0 ? 'ne' : 's' }); pts.push(q); await G.reveal(q, c); } };
    return [
      { cap: `This curve sits <b>above</b> the ${T('x')}-axis and never reaches it: <b>no</b> ${T('x')}-intercepts.`,
        run: async (c) => { await fadeIn(c, curve, 500); const l = await showLine(c, P, '<b>misses</b>: 0 x-intercepts'); void l; } },
      { cap: `Slide it down until it just <b>touches</b> the axis, at ${T('(0,\\ 0)')}. Touching counts: <b>one</b> ${T('x')}-intercept.`,
        run: async (c) => { await slide(c, 0); await mark(c, [0]); await showLine(c, P, `<b>touches</b>: 1 x-intercept ${T('(0,\\ 0)')}`); } },
      { cap: `Slide it further: now it <b>crosses</b> the axis twice, at ${T('(-2,\\ 0)')} and ${T('(2,\\ 0)')}. <b>Two</b> ${T('x')}-intercepts.`,
        run: async (c) => { G.remove(...pts.splice(0)); await slide(c, -2); await mark(c, [-2, 2]); await showLine(c, P, `<b>crosses twice</b>: 2 x-intercepts ${T('(-2,\\ 0)')}, ${T('(2,\\ 0)')}`); } },
      { cap: `0, 1 or 2 ${T('x')}-intercepts: count them on the graph and list <b>every one</b>. This curve has just one ${T('y')}-intercept, ${T('(0,\\ -2)')}.`,
        run: async (c) => { await G.reveal(G.point(0, -2, { color: YC, r: 8, label: T(prY(-2)), pos: 'se' }), c); const s = stamp(P, 'list every one', { ok: true }); s.style.alignSelf = 'center'; s.style.marginTop = '16px'; await stampIn(c, s); } }
    ];
  }
};

/* =====================================================================================
 * 5. tableInt — in a table, look for the 0: x = 0 gives the y-intercept, y = 0 gives the x-intercept. */
const TI = {
  phone: { label: 'Your phone (warm-up)', hx: 't', hy: 'b', xs: [0, 2, 4, 6, 8], ys: [80, 60, 40, 20, 0], win: { xmin: 0, xmax: 10, ymin: 0, ymax: 100, ystep: 10, ylabels: 20, xtitle: 't', ytitle: 'b' } },
  mixed: { label: 'Out of order', hx: 'x', hy: 'y', xs: [4, -1, 0, 3, 1], ys: [-1, 4, 3, 0, 2], win: { xmin: -2, xmax: 5, ymin: -2, ymax: 5 } },
  ex4: { label: 'Example 4', hx: 'x', hy: 'y', xs: [-3, -2, -1, 0, 1], ys: [-1, 0, 1, 2, 3], win: { xmin: -4, xmax: 2, ymin: -2, ymax: 4 } }
};
const tableInt = {
  title: 'Intercepts from a table: look for the 0',
  height: 450,
  minW: 860,
  choices: [{ v: 'phone', label: TI.phone.label }, { v: 'mixed', label: TI.mixed.label }, { sep: 'Example check:' }, { v: 'ex4', label: TI.ex4.label }],
  intro: 'No graph this time, just a table. Where are the intercepts? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = TI[k], W = ex.W, m = d.xs.length;
    const tb = new ValueTable(stage, { x: 14, y: 14, headers: [d.hx, d.hy], rows: d.xs.map((x, i) => [x, d.ys[i]]), layout: 'h', cellW: 76, cellH: 60, headW: 56, tap: false, cls: 'u5l4-tab' });
    const G = new Graph(stage, Object.assign({ x: W - 430, y: 8, width: 420, height: 434 }, d.win));
    const P = panel(stage, 14, 160, W - 470, 282, '', 'u5l4-notes2');
    const i0 = d.xs.indexOf(0), j0 = d.ys.indexOf(0);
    const hiCell = (r, c2, cls) => tb.cell(r, c2).classList.add(cls);
    return [
      { cap: `<b>${T('y')}-intercept:</b> it is on the side axis, so look for ${T(d.hx + '=0')} in the ${T(d.hx)} row. ${k === 'mixed' ? 'It is not the first column!' : ''}`,
        run: async (c) => { for (let i = 0; i <= i0; i++) { tb.highlight(i, true); await sleep(c, 220); if (i < i0) tb.highlight(i, false); } hiCell(i0, 0, 'u5l4-zero'); await pulse(c, tb.cell(i0, 0), 1.25); } },
      { cap: `That column pairs ${T(d.hx + '=0')} with ${T(d.hy + '=' + n(d.ys[i0]))}. The ${T('y')}-intercept is ${T(prY(d.ys[i0]))}.`,
        run: async (c) => { await showLine(c, P, `<b class="u5l4-yt">${T('y')}-intercept</b> (column with ${T(d.hx + '=0')}): ${T(prY(d.ys[i0]))}`, 'u5l4-big'); await G.reveal(G.point(0, d.ys[i0], { color: YC, r: 8, label: T(pr(0, d.ys[i0])), pos: 'e' }), c); tb.highlight(i0, false); } },
      { cap: `<b>${T('x')}-intercept:</b> it is on the bottom axis, so look for ${T(d.hy + '=0')} in the ${T(d.hy)} row.`,
        run: async (c) => { for (let i = 0; i <= j0; i++) { tb.highlight(i, true); await sleep(c, 220); if (i < j0) tb.highlight(i, false); } hiCell(j0, 1, 'u5l4-zero'); await pulse(c, tb.cell(j0, 1), 1.25); } },
      { cap: `That column pairs ${T(d.hx + '=' + n(d.xs[j0]))} with ${T(d.hy + '=0')}. The ${T('x')}-intercept is ${T(prX(d.xs[j0]))}.`,
        run: async (c) => { await showLine(c, P, `<b class="u5l4-xt">${T('x')}-intercept</b> (column with ${T(d.hy + '=0')}): ${T(prX(d.xs[j0]))}`, 'u5l4-big'); await G.reveal(G.point(d.xs[j0], 0, { color: XC, r: 8, label: T(pr(d.xs[j0], 0)), pos: 'ne' }), c); tb.highlight(j0, false); } },
      { cap: `Plot the rest of the table: the two intercept points are the ones sitting right <b>on the axes</b>.`,
        run: async (c) => { for (let i = 0; i < m; i++) { if (i === i0 || i === j0) continue; await G.reveal(G.point(d.xs[i], d.ys[i], { color: 'ink', r: 6 }), c, 200); } } }
    ];
  }
};

/* =====================================================================================
 * 6. story — in a real situation: the y-intercept is the start, the x-intercept is when it runs out. */
const ST = {
  phone: { label: 'Your phone (warm-up)', v0: 80, rate: 10, end: 8, unit: '%', what: 'battery', xw: 'hours', xt: 't\\ (\\text{h})', yt: 'b\\ (\\%)', win: { xmin: 0, xmax: 11, ymin: 0, ymax: 100, ystep: 10, ylabels: 20 },
    c0: `At ${T('t=0')} you haven’t texted yet. The graph starts on the side axis at ${T('(0,\\ 80)')}: the <b class="u5l4-yt">${T('y')}-intercept</b> is the <b>starting battery, 80%</b>.`,
    c1: 'Play it: the battery drops 10% every hour of texting.',
    c2: `The graph reaches the bottom axis at ${T('(8,\\ 0)')}: the <b class="u5l4-xt">${T('x')}-intercept</b>. The battery is 0%: <b>the phone dies after 8 hours</b>.`,
    sLab: 'start: 80%', eLab: 'dead' },
  ex5: { label: 'Example 5', v0: 40, rate: 5, end: 8, unit: '$', what: 'balance', xw: 'weeks', xt: 't\\ (\\text{weeks})', yt: 'B\\ (\\$)', win: { xmin: 0, xmax: 10, ymin: 0, ymax: 45, ystep: 5, ylabels: 5 },
    c0: `At ${T('t=0')} weeks nothing has been spent. The graph starts on the side axis at ${T('(0,\\ 40)')}: the <b class="u5l4-yt">${T('y')}-intercept</b> is the <b>starting balance, $40</b>.`,
    c1: 'Play it: Malik spends the same amount every week, $5.',
    c2: `The graph reaches the bottom axis at ${T('(8,\\ 0)')}: the <b class="u5l4-xt">${T('x')}-intercept</b>. The balance is $0: <b>the card is empty after 8 weeks</b>.`,
    sLab: 'start: $40', eLab: 'empty' }
};
const money = (d, v) => (d.unit === '$' ? '$' + Math.round(v) : Math.round(v) + '%');
const story = {
  title: 'What the intercepts mean',
  height: 450,
  minW: 880,
  choices: [{ v: 'phone', label: ST.phone.label }, { sep: 'Example check:' }, { v: 'ex5', label: ST.ex5.label }],
  intro: (k) => (k === 'ex5' ? 'Malik’s gift card: what do the two intercepts tell us? Press <b>Next</b>.' : 'Your phone from the warm-up: what do the two intercepts tell us? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = ST[k], W = ex.W, f = (t) => d.v0 - d.rate * t;
    // the object: a phone or a gift card, with its amount
    const obj = add(stage, box(h('div', 'u5l4-obj u5l4-obj-' + k), W - 480, 250), 14, 14);
    obj.innerHTML = k === 'ex5'
      ? `<div class="u5l4-card"><div class="u5l4-card-h">GIFT CARD</div><div class="u5l4-card-v">$40</div><div class="u5l4-card-c"><i></i><i></i><i></i></div></div><div class="u5l4-obj-t">week <b>0</b></div>`
      : `<div class="u5l4-bigph"><div class="u5l4-ph-bat"><i style="width:80%"></i></div><div class="u5l4-card-v">80%</div></div><div class="u5l4-obj-t">hour <b>0</b></div>`;
    const vEl = obj.querySelector('.u5l4-card-v'), tEl = obj.querySelector('.u5l4-obj-t b'), bar = obj.querySelector('.u5l4-ph-bat i');
    const setT = (t) => { const v = f(t); vEl.textContent = money(d, v); tEl.textContent = Math.round(t * 10) / 10; if (bar) bar.style.width = v + '%'; obj.classList.toggle('zero', v <= 0.01); };
    const G = new Graph(stage, Object.assign({ x: W - 450, y: 6, width: 440, height: 438, xtitle: d.xt, ytitle: d.yt }, d.win));
    const P = panel(stage, 14, 280, W - 480, 162, '', 'u5l4-notes2');
    const trace = { from: 0, to: 0.0001, color: LN, width: 4, arrows: false };
    let cur;
    return [
      { cap: d.c0, run: async (c) => { setT(0); await G.reveal(G.point(0, d.v0, { color: YC, r: 9, label: `<b>${d.sLab}</b>`, pos: 'e' }), c); await showLine(c, P, `<b class="u5l4-yt">${T('y')}-intercept</b> ${T(pr(0, d.v0))}: the <b>start</b>`); } },
      { cap: d.c1, run: async (c) => {
        cur = G.fn(f, trace); const tp = G.point(0, d.v0, { color: IV, r: 7 });
        await tween(c, 2600, (t) => { const tt = d.end * t; trace.to = Math.max(0.0001, tt); cur._bkDraw(); G.moveTo(tp, tt, f(tt)); setT(tt); }, (t) => t);
        G.remove(tp); setT(d.end);
      } },
      { cap: d.c2, run: async (c) => { setT(d.end); await G.reveal(G.point(d.end, 0, { color: XC, r: 9 }), c); await pop(c, G.label(d.end, 0, `<b>${d.eLab}</b>`, { pos: 'ne', dy: -26, cls: 'bk-ptlab', color: XC })); await showLine(c, P, `<b class="u5l4-xt">${T('x')}-intercept</b> ${T(pr(d.end, 0))}: the <b>end</b>, ${d.what} is 0`); } },
      { cap: `The story runs between the two intercepts: it <b>starts</b> on the side axis and <b>ends</b> on the bottom axis.`,
        run: async (c) => { const s = stamp(P, 'start → end', { ok: true, size: 'sm' }); s.style.alignSelf = 'flex-start'; s.style.marginTop = '6px'; await stampIn(c, s); } }
    ];
  }
};

/* =====================================================================================
 * 7. readGraph — up and across (output from an input), across and down (input from an output). */
const RG = {
  ph3: { label: 'Phone after 3 h', story: 'phone', dir: 'fwd', x: 3 },
  ph40: { label: 'Phone at 40%', story: 'phone', dir: 'back', y: 40 },
  ex5c: { label: 'Example 5(c)', story: 'ex5', dir: 'fwd', x: 4 },
  ex5d: { label: 'Example 5(d)', story: 'ex5', dir: 'back', y: 10 }
};
const readGraph = {
  title: 'Reading the graph: up and across, across and down',
  height: 450,
  minW: 860,
  choices: [{ sep: 'Try:' }, { v: 'ph3', label: RG.ph3.label }, { v: 'ph40', label: RG.ph40.label }, { sep: 'Example check:' }, { v: 'ex5c', label: RG.ex5c.label }, { v: 'ex5d', label: RG.ex5d.label }],
  value: 'ph3',
  intro: (k) => (RG[k].dir === 'fwd' ? 'We know the input. Find the output. Press <b>Next</b>.' : 'We know the output. Find the input. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const r = RG[k], d = ST[r.story], W = ex.W, f = (t) => d.v0 - d.rate * t;
    const G = new Graph(stage, Object.assign({ x: 10, y: 6, width: 470, height: 438, xtitle: d.xt, ytitle: d.yt }, d.win));
    G.segment([0, d.v0], [d.end, 0], { color: LN, width: 4 });
    const P = panel(stage, 500, 10, W - 514, 430, k.startsWith('ex') ? 'Example 5' : 'Your phone');
    const isF = r.dir === 'fwd', x = isF ? r.x : (d.v0 - r.y) / d.rate, y = isF ? f(r.x) : r.y;
    const xw = d.xw, unit = (v) => (d.unit === '$' ? '$' + v : v + '%');
    const a = isF ? G.segment([x, 0], [x, y], { color: IV, width: 3.5, dash: true }) : G.segment([0, y], [x, y], { color: DV, width: 3.5, dash: true });
    const b = isF ? G.segment([x, y], [0, y], { color: DV, width: 3.5, dash: true }) : G.segment([x, y], [x, 0], { color: IV, width: 3.5, dash: true });
    a.style.opacity = 0; b.style.opacity = 0;
    return [
      isF ? { cap: `Start at ${T('t=' + x)} on the bottom axis and go straight <b>up</b> to the line.`,
        run: async (c) => { await G.reveal(G.point(x, 0, { color: IV, r: 7 }), c); a.style.opacity = 1; await G.drawIn(a, 700, c); await G.reveal(G.point(x, y, { color: XC, r: 8 }), c); } }
        : { cap: `Start at ${unit(y)} on the side axis and go straight <b>across</b> to the line.`,
          run: async (c) => { await G.reveal(G.point(0, y, { color: DV, r: 7 }), c); a.style.opacity = 1; await G.drawIn(a, 700, c); await G.reveal(G.point(x, y, { color: XC, r: 8 }), c); } },
      isF ? { cap: `Now go <b>across</b> to the side axis and read: ${unit(y)}.`,
        run: async (c) => { b.style.opacity = 1; await G.drawIn(b, 700, c); await pop(c, G.label(0, y, `<b>${unit(y)}</b>`, { pos: 'e', cls: 'u5l4-numtag', color: DV, dx: 8, dy: -16 })); await showLine(c, P, `after ${x} ${xw}: <b>${unit(y)}</b>`, 'u5l4-big'); } }
        : { cap: `Now go <b>down</b> to the bottom axis and read: ${T('t=' + x)} ${xw}.`,
          run: async (c) => { b.style.opacity = 1; await G.drawIn(b, 700, c); await pop(c, G.label(x, 0, `<b>${x}</b>`, { pos: 'ne', cls: 'u5l4-numtag', color: IV, dy: -6 })); await showLine(c, P, `${unit(y)} after <b>${x} ${xw}</b>`, 'u5l4-big'); } },
      { cap: `Check with the rate: ${d.unit === '$' ? '$' + d.rate : d.rate + '%'} per ${xw.slice(0, -1)}. ${T(isF ? `${d.v0}-${x}(${d.rate})=${y}` : `${d.v0}-${x}(${d.rate})=${y}`)} ✓`,
        run: async (c) => { await showLine(c, P, `check: ${T(`${d.v0}-${x}(${d.rate})=${y}`)} ✓`); const s = stamp(P, 'graph = rate', { ok: true, size: 'sm' }); s.style.alignSelf = 'flex-start'; s.style.marginTop = '8px'; await stampIn(c, s); } }
    ];
  }
};

/* =====================================================================================
 * static figures on the cards */
function mountFigures() {
  const tag = (el, id) => { el.setAttribute('data-show', id); if (el.label) el.label.setAttribute('data-show', id); return el; };
  const s1 = document.getElementById('s1-fig');
  if (s1) { const G = new Graph(s1, { width: 300, height: 300, xmin: -1.5, xmax: 5.5, ymin: -1.5, ymax: 5.5 }); G.fn((x) => -x + 4, { from: -1, to: 5, color: LN, width: 3.5, arrows: false }); G.point(4, 0, { color: XC, r: 7, label: T('(4,\\ 0)'), pos: 'ne' }); }
  const e1 = document.getElementById('ex1-fig');
  if (e1) { const G = new Graph(e1, { width: 330, height: 330, xmin: -1.5, xmax: 5.5, ymin: -1.5, ymax: 5.5 }); G.fn((x) => -1.5 * x + 3, { from: -1, to: 2.8, color: 'ink', width: 3, arrows: false }); tag(G.point(2, 0, { color: 'red', r: 7, label: T('(2,\\ 0)'), pos: 'ne' }), 'ex1a'); }
  const e2 = document.getElementById('ex2-fig');
  if (e2) { const G = new Graph(e2, { width: 330, height: 360, xmin: -2.5, xmax: 4.5, ymin: -1.5, ymax: 6.5 }); G.fn((x) => 0.5 * x + 2, { from: -2, to: 4, color: 'ink', width: 3, arrows: false }); tag(G.point(0, 2, { color: 'red', r: 7, label: T('(0,\\ 2)'), pos: 'nw' }), 'ex2a'); }
  const e3 = document.getElementById('ex3-fig');
  if (e3) {
    const G = new Graph(e3, { width: 380, height: 300, xmin: -4.5, xmax: 4.5, ymin: -5.5, ymax: 1.5 }); G.fn(ex3f, { from: -3, to: 3, color: 'ink', width: 3, arrows: false });
    tag(G.point(-3, 0, { color: 'red', r: 7, label: T('(-3,\\ 0)'), pos: 'nw' }), 'ex3a'); tag(G.point(3, 0, { color: 'red', r: 7, label: T('(3,\\ 0)'), pos: 'ne' }), 'ex3a');
    tag(G.point(0, -4, { color: 'red', r: 7, label: T('(0,\\ -4)'), pos: 'se' }), 'ex3b');
  }
  const t4 = document.getElementById('ex4-tab');
  if (t4) {
    const tb = new ValueTable(t4, { headers: ['x', 'y'], rows: [[-3, -1], [-2, 0], [-1, 1], [0, 2], [1, 3]], layout: 'h', cellW: 66, cellH: 54, headW: 50, tap: false });
    tb.cells[3].forEach((e) => tag(e.appendChild(h('i', 'u5l4-ring u5l4-ring-y')), 'ex4a'));
    tb.cells[1].forEach((e) => tag(e.appendChild(h('i', 'u5l4-ring')), 'ex4b'));
  }
  const e5 = document.getElementById('ex5-fig');
  if (e5) {
    const G = new Graph(e5, { width: 400, height: 420, xmin: 0, xmax: 10, ymin: 0, ymax: 42.5, ystep: 5, ylabels: 5, xtitle: 't\\ (\\text{weeks})', ytitle: 'B\\ (\\$)' });
    G.segment([0, 40], [8, 0], { color: 'ink', width: 3 });
    tag(G.point(0, 40, { color: 'red', r: 7, label: T('(0,\\ 40)'), pos: 'e' }), 'ex5a'); tag(G.point(8, 0, { color: 'red', r: 7, label: T('(8,\\ 0)'), pos: 'ne' }), 'ex5b');
    [G.segment([4, 0], [4, 20], { color: 'red', width: 2.5, dash: true }), G.segment([4, 20], [0, 20], { color: 'red', width: 2.5, dash: true }), G.point(4, 20, { color: 'red', r: 6 })].forEach((e) => tag(e, 'ex5c'));
    [G.segment([0, 10], [6, 10], { color: 'red', width: 2.5, dash: true }), G.segment([6, 10], [6, 0], { color: 'red', width: 2.5, dash: true }), G.point(6, 10, { color: 'red', r: 6 })].forEach((e) => tag(e, 'ex5d'));
  }
  const sync = (p) => { const on = p.classList.contains('shown'); document.querySelectorAll(`[data-show="${p.dataset.part}"]`).forEach((e) => e.classList.toggle('u5l4-on', on)); };
  document.querySelectorAll('.part[data-part]').forEach((p) => { new MutationObserver(() => sync(p)).observe(p, { attributes: true, attributeFilter: ['class'] }); sync(p); });
}

/* =====================================================================================
 * warm-up: Low Battery! */
function mountWarm() {
  const host = document.getElementById('batt-graph'); if (!host) return;
  const G = new Graph(host, { width: 400, height: 320, xmin: 0, xmax: 10, ymin: 0, ymax: 100, ystep: 10, ylabels: 20, xtitle: '\\text{hours}', ytitle: '\\text{battery (\\%)}' });
  G.segment([0, 80], [8, 0], { color: XC, width: 4 });
  G.label(5.2, 46, '<b>your phone</b>', { pos: 'ne', cls: 'u5l4-wlab', color: XC });
  const you = (t) => Math.max(0, 80 - 10 * t), jo = (t) => Math.max(0, 100 - 20 * t);
  const pY = G.point(0, 80, { color: XC, r: 7 }), pJ = G.point(0, 100, { color: GRN, r: 7 }); pJ.style.opacity = 0;
  let jLine = null;
  const ph = (id) => { const e = document.getElementById(id); return e && { e, bar: e.querySelector('.u5l4-ph-bat i'), v: e.querySelector('.u5l4-ph-scr b') }; };
  const PY = ph('ph-you'), PJ = ph('ph-jo'), clock = document.getElementById('batt-t');
  const setPh = (P, v) => { if (!P) return; P.bar.style.width = v + '%'; P.v.textContent = Math.round(v) + '%'; P.e.classList.toggle('dead', v <= 0.01); P.e.classList.toggle('low', v > 0.01 && v <= 20); };
  const set = (t, race) => { G.moveTo(pY, Math.min(t, 8), you(t)); setPh(PY, you(t)); if (race) { G.moveTo(pJ, Math.min(t, 5), jo(t)); setPh(PJ, jo(t)); } if (clock) clock.textContent = (Math.round(t * 10) / 10).toFixed(1).replace('.0', ''); };
  setPh(PY, 80); setPh(PJ, 100);
  let busy = false;
  const run = async (race) => {
    if (busy) return; busy = true;
    if (race) { pJ.style.opacity = 1; if (!jLine) { jLine = G.segment([0, 100], [5, 0], { color: GRN, width: 4 }); G.label(0.9, 90, '<b>Jordan</b>', { pos: 'e', cls: 'u5l4-wlab', color: GRN }); } }
    set(0, race);
    try { await tween(liveCtx(), 5200, (t) => set(9 * t, race), (t) => t); } finally { busy = false; }
    if (race && !jLine.cross) jLine.cross = G.point(2, 60, { color: 'ink', r: 6, label: T('(2,\\ 60)'), pos: 'ne' });
  };
  const b1 = document.getElementById('batt-play'), b2 = document.getElementById('batt-race');
  if (b1) b1.addEventListener('click', () => run(false));
  if (b2) b2.addEventListener('click', () => run(true));
}

mountFigures();
mountWarm();
export const explainers = mountExplainers({ axisZero, readInt, meetAxes, countMeet, tableInt, story, readGraph });

/* ============ Stand Up Break! — read the intercepts (lessons/js/standup.js) ============ */
function suPlane(f, o = {}) { // a small coordinate plane −6…6 with a curve (SVG)
  const S = 320, lo = o.lo ?? -6, hi = o.hi ?? 6, u = S / (hi - lo + 1.2), ink = '#1c2230', px = (x) => (x - lo + 0.6) * u, py = (y) => S - (y - lo + 0.6) * u;
  let s = `<rect x="0" y="0" width="${S}" height="${S}" rx="10" fill="#fff"/>`;
  for (let k = lo; k <= hi; k++) s += `<path d="M${px(k)} ${py(lo - 0.3)}V${py(hi + 0.3)}M${px(lo - 0.3)} ${py(k)}H${px(hi + 0.3)}" stroke="#e7e2d8" stroke-width="1"/>`;
  s += `<path d="M${px(lo - 0.5)} ${py(0)}H${px(hi + 0.5)}M${px(0)} ${py(lo - 0.5)}V${py(hi + 0.5)}" stroke="${ink}" stroke-width="2"/>`;
  for (let k = lo; k <= hi; k += 2) if (k) { s += `<text x="${px(k)}" y="${py(0) + 17}" text-anchor="middle" font-size="14">${String(k).replace('-', '−')}</text><text x="${px(0) - 5}" y="${py(k) + 5}" text-anchor="end" font-size="14">${String(k).replace('-', '−')}</text>`; }
  s += `<text x="${px(hi + 0.5)}" y="${py(0) - 6}" font-style="italic" font-size="17">x</text><text x="${px(0) + 6}" y="${py(hi + 0.4)}" font-style="italic" font-size="17">y</text>`;
  const pts = []; for (let i = 0; i <= 160; i++) { const x = lo - 0.3 + (hi - lo + 0.6) * i / 160, y = f(x); if (y >= lo - 0.3 && y <= hi + 0.3) pts.push(`${px(x).toFixed(1)} ${py(y).toFixed(1)}`); }
  s += `<path d="M${pts.join('L')}" fill="none" stroke="#1f5aa8" stroke-width="3.2"/>`;
  return `<svg viewBox="0 0 ${S} ${S}" width="${S}" role="img" aria-label="graph" font-family="KaTeX_Main, 'Times New Roman', serif" fill="${ink}">${s}</svg>`;
}
const suTab = (X, Y, xs, ys) => `\\begin{array}{|c|${xs.map(() => 'c').join('|')}|}\\hline ${X} & ${xs.join(' & ')}\\\\ \\hline ${Y} & ${ys.join(' & ')}\\\\ \\hline\\end{array}`;
const SU_STORY = [ // [sentence, x word, y word, start, rate, start meaning, end meaning]
  ['A water tank holds 60 L and drains 5 L every minute.', 'minutes', 'water (L)', 60, 5, 'the tank starts with 60 L', 'the tank is empty after 12 minutes'],
  ['A candle 24 cm tall burns down 3 cm every hour.', 'hours', 'height (cm)', 24, 3, 'the candle starts 24 cm tall', 'the candle has burned away after 8 hours'],
  ['A bus pass has 30 rides; you use 2 rides every school day.', 'school days', 'rides left', 30, 2, 'the pass starts with 30 rides', 'the pass is used up after 15 days'],
  ['A gas tank holds 50 L; the car uses 10 L every hour of driving.', 'hours', 'gas (L)', 50, 10, 'the tank starts with 50 L', 'the tank is empty after 5 hours'],
  ['A bag holds 36 cookies; your family eats 4 every day.', 'days', 'cookies left', 36, 4, 'the bag starts with 36 cookies', 'the bag is empty after 9 days'],
  ['A snowman 90 cm tall melts 6 cm every hour.', 'hours', 'height (cm)', 90, 6, 'the snowman starts 90 cm tall', 'the snowman has melted after 15 hours'],
  ['A phone game starts with 45 lives and loses 3 every level.', 'levels', 'lives left', 45, 3, 'the game starts with 45 lives', 'no lives are left after 15 levels'],
  ['A $70 lunch card is charged $7 every school day.', 'school days', 'balance ($)', 70, 7, 'the card starts with $70', 'the card is empty after 10 days'],
  ['A pool holds 48 kL of water and drains 6 kL every hour.', 'hours', 'water (kL)', 48, 6, 'the pool starts with 48 kL', 'the pool is empty after 8 hours'],
  ['A hiker is 20 km from camp and walks back at 4 km/h.', 'hours', 'distance to camp (km)', 20, 4, 'the hiker starts 20 km from camp', 'the hiker reaches camp after 5 hours']
];
standup('u5l4', {
  intro: 'At your whiteboard station: find every intercept and write each one as an ordered pair.',
  levels: {
    BEG: (r) => { // a line on a grid: read both intercepts
      const a = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), b = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      return { q: '', text: 'State the <i>x</i>-intercept and the <i>y</i>-intercept of the line. Write each one as an ordered pair.', fig: suPlane((x) => b - b * x / a),
        a: [`x\\text{-intercept: } (${a},\\ 0)`, `y\\text{-intercept: } (0,\\ ${b})`] };
    },
    PRG: (r) => { // a table (sometimes out of order) or a curve with two x-intercepts
      if (r.chance(0.5)) {
        let p, q; do { p = -r.int(1, 4); q = r.int(1, 4); } while (Math.abs(p * q) > 6);
        const sg = r.pick([1, -1]), f = (x) => sg * (x - p) * (x - q);
        return { q: '', text: 'The curve meets the <i>x</i>-axis twice and the <i>y</i>-axis once. State all three intercepts.', fig: suPlane(f),
          a: [`x\\text{-intercepts: } (${p},\\ 0) \\text{ and } (${q},\\ 0)`, `y\\text{-intercept: } (0,\\ ${f(0)})`] };
      }
      const m = r.pick([-3, -2, -1, 1, 2, 3]), x0 = r.pick([-3, -2, -1, 1, 2, 3]), f = (x) => m * (x - x0);
      const lo = Math.min(0, x0), hi = Math.max(0, x0), pool = [];
      for (let x = lo - 3; x <= hi + 3; x++) if (x !== 0 && x !== x0) pool.push(x);
      let xs = [0, x0, ...r.shuffle(pool).filter((x) => x >= lo - 2 && x <= hi + 2).slice(0, 3)];
      const mixed = r.chance(0.4); xs = mixed ? r.shuffle(xs) : xs.sort((a, b) => a - b);
      return { text: `The table shows several points on a relation${mixed ? ', listed out of order' : ''}. State the <i>x</i>-intercept and the <i>y</i>-intercept.`, q: suTab('x', 'y', xs, xs.map(f)),
        a: [`y=0 \\text{ when } x=${x0}:\\quad x\\text{-intercept } (${x0},\\ 0)`, `x=0 \\text{ gives } y=${f(0)}:\\quad y\\text{-intercept } (0,\\ ${f(0)})`] };
    },
    MAS: (r) => { // a story: sketch, state both intercepts, and say what each one means
      const [s, xw, yw, v0, rate, m0, m1] = r.pick(SU_STORY), end = v0 / rate, t = r.int(1, end - 1);
      return { q: '', text: `${s} Let the input be the number of ${xw} and the output the ${yw}.<br>(a) State the <i>y</i>-intercept and what it means. (b) State the <i>x</i>-intercept and what it means. (c) How much is left after ${t} ${xw}?`,
        a: [`\\text{(a) } (0,\\ ${v0}):\\ \\text{${m0.replace(/\$/g, '\\$')}}`, `\\text{(b) } (${end},\\ 0):\\ \\text{${m1}}`, `\\text{(c) } ${v0}-${t}(${rate})=${v0 - t * rate}`] };
    }
  }
});
