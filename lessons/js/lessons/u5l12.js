/* Math 15 · Unit 5 · Lesson 12 — Unit Review: Relations and Functions.
 * Static figures (Relation Bingo card, quick-reference minis, the example graphs) and the explainers.
 * Colour code (whole page): x-axis things (inputs, domain, x-intercepts) amber; y-axis things (outputs, range,
 * y-intercepts) purple. Explainers reuse the unit's big pictures (Math 10C u5l9 and Math 15 u5l11): walks across
 * then up, four views, shadows, a calculator screen, the vertical line sweep, the machine forwards and backwards,
 * reading dots, and a story graph played with its scene. */
import {
  h, tex, add, box, Graph, ValueTable, MappingDiagram, stamp, stampIn, mountExplainers, pop, fadeIn, sleep, tween, linear,
  texNum, svgEl, anim, pulse, appear, COLORS
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const AMB = '#c27a0e', PUR = '#7b4fc4', INK = '#1e2d46', SKETCH = '#c93a33', TRACE = '#2f6fd0';
const tn = (v) => texNum(v);
const lerp = (a, b, t) => a + (b - a) * t;
const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u5l12-panel', title ? `<div class="u5l12-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u5l12-line ' + cls, html); p.appendChild(d); return d; };
const say = async (c, p, html, cls) => { const d = line(p, html, cls); await fadeIn(c, d); return d; };

/* =============================== Relation Bingo squares =============================== */
const SQ = {
  A: { kind: 'map', dom: [1, 2, 3], ran: [5, 8], pairs: [[1, 5], [2, 5], [3, 8]] },
  B: { kind: 'table', xs: [0, 2, 4, 6], ys: [5, 3, 1, -1] },
  C: { kind: 'graph', win: { xmin: -3, xmax: 5, ymin: -1, ymax: 7 }, seg: [[-2, 0], [4, 6]] },
  D: { kind: 'pairs', pairs: [[-2, 4], [0, 0], [2, 4]] },
  E: { kind: 'graph', win: { xmin: -1, xmax: 6, ymin: -1, ymax: 7 }, dots: [[1, 3], [2, 4], [3, 5], [4, 6]] },
  F: { kind: 'map', dom: [2, 4, 6], ran: [7], pairs: [[2, 7], [4, 7], [6, 7]] },
  G: { kind: 'table', xs: [2, 5, 7, 5], ys: [3, 1, 3, 6] },
  H: { kind: 'graph', win: { xmin: -1, xmax: 7, ymin: -1, ymax: 7 }, seg: [[0, 6], [6, 0]] },
  I: { kind: 'graph', win: { xmin: -1, xmax: 6, ymin: -1, ymax: 6 }, dots: [[1, 4], [3, 4], [5, 4]] }
};
const SQK = Object.keys(SQ);
function mapSVG(d, W, H) {
  const lx = W * 0.27, rx = W * 0.73, cy = H / 2, ry = H / 2 - 6, ex = Math.min(26, W * 0.15);
  const yAt = (list, i) => cy - ry + (i + 1) * (2 * ry) / (list.length + 1);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><defs><marker id="u5l12ah${W}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${SKETCH}"/></marker></defs>`;
  s += `<ellipse cx="${lx}" cy="${cy}" rx="${ex}" ry="${ry}" fill="#e8f0fc" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${rx}" cy="${cy}" rx="${ex}" ry="${ry * 0.8}" fill="#e8f0fc" stroke="${INK}" stroke-width="1.6"/>`;
  d.pairs.forEach(([a, b]) => { const y1 = yAt(d.dom, d.dom.indexOf(a)), y2 = yAt(d.ran, d.ran.indexOf(b)); s += `<line x1="${lx + 11}" y1="${y1}" x2="${rx - 13}" y2="${y2}" stroke="${SKETCH}" stroke-width="2.2" marker-end="url(#u5l12ah${W})"/>`; });
  d.dom.forEach((v, i) => { s += `<text x="${lx}" y="${yAt(d.dom, i) + 6}" text-anchor="middle" font-size="18" font-family="KaTeX_Main, serif" fill="${INK}">${v}</text>`; });
  d.ran.forEach((v, i) => { s += `<text x="${rx}" y="${yAt(d.ran, i) + 6}" text-anchor="middle" font-size="18" font-family="KaTeX_Main, serif" fill="${INK}">${v}</text>`; });
  return s + '</svg>';
}
/** draw one bingo square into host (w × h px); returns { el, G } */
function drawSquare(host, L, w, hh) {
  const d = SQ[L], el = h('div', 'u5l12-sqin');
  host.appendChild(el);
  let G = null;
  if (d.kind === 'map') el.innerHTML = mapSVG(d, w - 16, hh - 22);
  else if (d.kind === 'table') el.innerHTML = `<table class="u5l12-btab"><tr><th>${T('x')}</th>${d.xs.map((v, i) => `<td data-i="${i}">${T(tn(v))}</td>`).join('')}</tr><tr><th>${T('y')}</th>${d.ys.map((v, i) => `<td data-i="${i}">${T(tn(v))}</td>`).join('')}</tr></table>`;
  else if (d.kind === 'pairs') el.innerHTML = `<div class="u5l12-bpairs">${d.pairs.map(([x, y]) => T(`(${tn(x)},\\ ${tn(y)})`)).join('<br>')}</div>`;
  else {
    G = new Graph(el, Object.assign({ width: w - 12, height: hh - 16, xlabels: 2, ylabels: 2, fontSize: 13, xtitle: '', ytitle: '', pad: [24, 10, 20, 36] }, d.win));
    if (d.seg) { G.segment(d.seg[0], d.seg[1], { color: SKETCH, width: 3.5 }); d.seg.forEach((p) => G.point(p[0], p[1], { color: SKETCH, r: 4.5 })); }
    (d.dots || []).forEach((p) => G.point(p[0], p[1], { color: SKETCH, r: 5 }));
  }
  return { el, G };
}

/* =============================== static figures =============================== */
function mini(host, o) { return new Graph(host, Object.assign({ width: 150, height: 104, numbers: false, xtitle: '', ytitle: '', fontSize: 13, pad: 8 }, o)); }
function mountStatic() {
  const bg = document.getElementById('wu-bingo');
  if (bg) {
    const W = Math.floor(((bg.clientWidth || 580) - 16) / 3);
    SQK.forEach((L) => {
      const b = h('button', 'u5l12-sq'); b.type = 'button'; bg.appendChild(b);
      b.appendChild(h('span', 'u5l12-sql', L));
      drawSquare(b, L, W, 142);
      b.addEventListener('click', () => b.classList.toggle('marked'));
    });
  }
  document.querySelectorAll('[data-mini]').forEach((el) => {
    const k = el.dataset.mini;
    if (k === 'plane') {
      const G = mini(el, { xmin: -4, xmax: 4, ymin: -3, ymax: 3, grid: false });
      [['I', 2, 1.5], ['II', -2, 1.5], ['III', -2, -1.5], ['IV', 2, -1.5]].forEach(([s, x, y]) => G.label(x, y, s, { cls: 'u5l12-qd' }));
    } else if (k === 'views') {
      el.innerHTML = `<div class="u5l12-mv">${mapSVG({ dom: [1, 2], ran: [3, 5], pairs: [[1, 3], [2, 5]] }, 70, 64)}<div>${T('(1,\\ 3)')}<br>${T('(2,\\ 5)')}</div></div>`;
    } else if (k === 'int') {
      const G = mini(el, { xmin: -2, xmax: 4, ymin: -2, ymax: 4 });
      G.line([0, 2], [3, 0], { color: INK, width: 2.5 }); G.point(3, 0, { color: AMB, r: 5.5 }); G.point(0, 2, { color: PUR, r: 5.5 });
    } else if (k === 'dr') {
      const G = mini(el, { xmin: -2, xmax: 4, ymin: -2, ymax: 4 });
      G.segment([-1, 1], [3, 3], { closedA: true, closedB: true, color: INK, width: 2.5 });
      G.shadeX(-1, 3, { color: AMB }); G.shadeY(1, 3, { color: PUR });
    } else if (k === 'vlt') {
      const G = mini(el, { xmin: -2, xmax: 2, ymin: -1.5, ymax: 1.5, grid: false });
      G.fn((x) => Math.sqrt(Math.max(0, 1 - x * x)), { from: -1, to: 1, arrows: false, color: INK, width: 2.5, samples: 80 }); G.fn((x) => -Math.sqrt(Math.max(0, 1 - x * x)), { from: -1, to: 1, arrows: false, color: INK, width: 2.5, samples: 80 });
      G.vline(0.3, { color: 'red', width: 2 }); G.point(0.3, Math.sqrt(0.91), { color: 'red', r: 4.5 }); G.point(0.3, -Math.sqrt(0.91), { color: 'red', r: 4.5 });
    } else if (k === 'fn') {
      el.innerHTML = `<div class="u5l12-mfn"><span class="i">${T('3')}</span><span class="m">${T('f(x)=2x+1')}</span><span class="o">${T('7')}</span></div><div class="u5l12-mfn2">${T('f(3)=7')}</div>`;
    }
  });
  const g1 = document.getElementById('ex1-grid');
  if (g1) new Graph(g1, { width: 320, height: 320, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2, fontSize: 14 });
  const a1 = document.getElementById('ex1-ans');
  if (a1) { const G = new Graph(a1, { width: 300, height: 300, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 2, ylabels: 2, fontSize: 13 }); EX1B.forEach(([n, x, y, pos]) => G.point(x, y, { color: SKETCH, r: 6, label: T(`${n}(${x},\\ ${y})`), pos, tex: false })); }
  const m3 = document.getElementById('ex3-map');
  if (m3) new MappingDiagram(m3, { width: 330, height: 300, domain: [10, 20, 30, 40], range: [2, 4, 6, 8], pairs: [[10, 2], [20, 4], [30, 6], [40, 8]], titles: ['A', 'B'] });
  const g5 = document.getElementById('ex5-graph');
  if (g5) { const G = new Graph(g5, { width: 330, height: 330, xmin: -6, xmax: 4, ymin: -4, ymax: 7, xlabels: 2, ylabels: 2, fontSize: 14 }); G.segment([-5, -3], [3, 6], { closedA: true, closedB: true, color: 'blue', width: 3.5 }); }
  const s6 = document.getElementById('ex6-screen');
  if (s6) { const G = new Graph(s6, { theme: 'calc', width: 340, height: 230, xmin: -10, xmax: 10, ymin: -10, ymax: 10 }); G.fn((x) => -2 * x + 8); }
  const g7 = document.getElementById('ex7-graphs');
  if (g7) ['A', 'B', 'C'].forEach((L) => { const cell = h('div', 'u5l12-g7'); g7.appendChild(cell); cell.appendChild(h('b', 'u5l12-g7l', L)); const G = new Graph(cell, Object.assign({ width: 250, height: 200, pad: [16, 16, 16, 16] }, E7WIN)); E7[L].draw(G); });
  const g9 = document.getElementById('ex9-graph');
  if (g9) { const G = new Graph(g9, { width: 300, height: 360, xmin: -4, xmax: 3, ymin: -7, ymax: 5, xlabels: 1, ylabels: 2, fontSize: 14 }); DOTS9.forEach(([x, y]) => G.point(x, y, { color: INK, r: 6 })); }
  const g10 = document.getElementById('ex10-graph');
  if (g10) { const G = storyGraph(g10, cycAxes({ width: 420, height: 280 })); G.polyline(CYC, { color: 'blue', width: 4 }); }
  const ax10 = document.getElementById('ex10b-ax');
  if (ax10) storyGraph(ax10, { width: 420, height: 290, xmin: 0, xmax: 7.3, ymin: 0, ymax: 5.8, xstep: 0.5, ystep: 0.5, xt: 'time', yt: 'temperature', pad: [12, 20, 34, 44] });
  const an10 = document.getElementById('ex10b-ans');
  if (an10) { const G = storyGraph(an10, { width: 330, height: 210, xmin: 0, xmax: 10.6, ymin: 0, ymax: 10.4, grid: false, xt: 'time', yt: 'temperature', pad: [10, 18, 34, 44] }); G.fn(COFFEE, { from: 0.3, to: 10, color: SKETCH, width: 4, arrows: false, samples: 120 }); G.hline(2, { color: 'gray', width: 2 }); G.label(7.6, 2, 'room temperature', { pos: 'n', cls: 'u5l12-note' }); }
  const c2 = document.getElementById('ch2-graph');
  if (c2) { const G = new Graph(c2, CH2WIN({ width: 340, height: 380 })); G.fn(PARAB, { from: -2, to: 4, arrows: false, color: 'blue', width: 3.5 }); [-2, 4].forEach((x) => G.point(x, 0, { color: 'blue', r: 6 })); }
}

/* =============================== explainer: Relation Bingo =============================== */
const bingo = {
  title: 'Relation Bingo: play the calls',
  height: 470,
  minW: 900,
  choices: [{ v: 'calls', label: 'Calls 1–3' }, { v: 'big', label: 'The big one: call 4' }],
  intro: (k) => (k === 'calls' ? 'Each call fits <b>exactly one</b> square. Press <b>Next</b>.' : 'Call 4: “I am <b>NOT</b> a function.” Ana says top row, Ben says diagonal. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const SW = 178, SH = 148, GAP = 6, PW = ex.W - 3 * SW - 2 * GAP - 22;
    const cells = {};
    SQK.forEach((L, i) => {
      const x = 4 + (i % 3) * (SW + GAP), y = 4 + Math.floor(i / 3) * (SH + GAP);
      const el = add(stage, box(h('div', 'u5l12-sq st'), SW, SH), x, y); el.appendChild(h('span', 'u5l12-sql', L));
      const r = drawSquare(el, L, SW, SH - 8); cells[L] = Object.assign({ box: el, x, y }, r);
    });
    const P = panel(stage, ex.W - PW - 6, 4, PW, 460, 'calls');
    const mark = async (c, L, cls = 'marked') => { cells[L].box.classList.add(cls); if (cls === 'marked') await pulse(c, cells[L].box, 1.05); };
    const pre = k === 'big';
    if (pre) { ['B', 'C', 'E'].forEach((L) => cells[L].box.classList.add('marked')); line(P, '<b>Marked so far:</b> B, C, E', 'sm'); }
    if (!pre) {
      return [
        { cap: `Call 1: “My ${T('y')}-intercept is ${T('2')}.” Look for a point with ${T('x=0')} and ${T('y=2')}.`,
          run: async (c) => {
            await G0(c, cells.C.G, 0, 2); await mark(c, 'C');
            await say(c, P, `<b>1 → C.</b> The segment crosses the ${T('y')}-axis at ${T('(0,\\ 2)')}.`);
          } },
        { cap: `Call 2: “My domain is ${T('\\{1,2,3,4\\}')}.” Which square has the inputs 1, 2, 3 <b>and</b> 4?`,
          run: async (c) => {
            await mark(c, 'A', 'close'); await mark(c, 'E');
            await say(c, P, `<b>2 → E.</b> Dots at ${T('x=1,2,3,4')}. (A has ${T('\\{1,2,3\\}')}: close, but no 4.)`);
          } },
        { cap: `Call 3: “${T('f(4)=1')}.” Find the input ${T('4')} paired with the output ${T('1')}.`,
          run: async (c) => {
            cells.A.box.classList.remove('close');
            cells.B.el.querySelectorAll('td[data-i="2"]').forEach((td) => td.classList.add('hl'));
            await mark(c, 'B');
            await say(c, P, `<b>3 → B.</b> The table pairs ${T('x=4')} with ${T('y=1')}.`);
          } },
        { cap: 'Marked: B, C and E. No three in a line yet!',
          run: (c) => say(c, P, 'No bingo yet.', 'muted') }
      ];
    }
    let diag;
    return [
      { cap: 'Call 4: “I am <b>NOT</b> a function.” Look for <b>one input</b> with <b>two outputs</b>.', run: (c) => pulse(c, P, 1.02) },
      { cap: 'Square A: two arrows land on 5. That’s allowed! Each <b>input</b> still has one arrow, so A <b>is</b> a function. Ana’s bingo is a false alarm.',
        run: async (c) => {
          const s = stamp(cells.A.box, 'function', { ok: true, size: 'sm' }); s.classList.add('u5l12-sst'); await stampIn(c, s);
          await say(c, P, '<b>A</b>: many arrows <b>into</b> one output is fine. Function.');
        } },
      { cap: 'Square G: the input 5 appears <b>twice</b>, with outputs 1 and 6. One input, two outputs: <b>not a function</b>.',
        run: async (c) => {
          cells.G.el.querySelectorAll('td[data-i="1"], td[data-i="3"]').forEach((td) => td.classList.add('bad'));
          await mark(c, 'G');
          await say(c, P, `<b>4 → G.</b> ${T('(5,\\ 1)')} and ${T('(5,\\ 6)')}: one input, two outputs.`);
        } },
      { cap: 'C, E and G make a <b>diagonal</b>. <b>Ben</b> is right!',
        run: async (c) => {
          const a = cells.C, b = cells.G, x1 = a.x + SW / 2, y1 = a.y + SH / 2, x2 = b.x + SW / 2, y2 = b.y + SH / 2;
          diag = add(stage, h('div', 'u5l12-diag'), 0, 0);
          diag.innerHTML = `<svg width="${3 * SW + 20}" height="${3 * SH + 20}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c93a33" stroke-width="10" stroke-linecap="round" stroke-opacity=".55"/></svg>`;
          await appear(c, diag, 500);
          await say(c, P, '<b>BINGO for Ben</b>: C–E–G.', 'ok big');
        } }
    ];
  }
};
async function G0(c, G, x, y) { await G.reveal(G.point(x, y, { color: PUR, r: 7, label: T(`(${x},\\ ${y})`), pos: 'w' }), c); }

/* =============================== explainer: the Cartesian plane (Example 1) =============================== */
const EX1A = [['P', -6, 2, 'Quadrant II', '(-,+)'], ['Q', 4, -5, 'Quadrant IV', '(+,-)'], ['R', 0, 7, 'on the <i>y</i>-axis', 'x=0'], ['S', -3, -8, 'Quadrant III', '(-,-)']];
const EX1B = [['T', 3, 5, 'ne'], ['U', -4, 1, 'n'], ['V', -2, -6, 'e'], ['W', 5, -3, 'e']];
const QN = (x, y) => (x === 0 && y === 0 ? 'the origin' : x === 0 ? 'on the <i>y</i>-axis' : y === 0 ? 'on the <i>x</i>-axis' : x > 0 ? (y > 0 ? 'Quadrant I' : 'Quadrant IV') : (y > 0 ? 'Quadrant II' : 'Quadrant III'));
const plane = {
  title: 'Across first, then up or down',
  height: 470,
  minW: 900,
  choices: [{ v: 'a', label: 'Example 1(a) check' }, { v: 'b', label: 'Example 1(b) check' }],
  intro: (k) => (k === 'a' ? 'Which quadrant? Let the signs decide. Press <b>Next</b>.' : 'Plot four points: across first, then up or down. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const W = k === 'a' ? 9 : 7;
    const G = new Graph(stage, { x: 8, y: 6, width: 458, height: 458, xmin: -W, xmax: W, ymin: -W, ymax: W, xlabels: 2, ylabels: 2, fontSize: 15 });
    const P = panel(stage, 484, 6, ex.W - 494, 458, k === 'a' ? 'quadrant or axis' : 'plot it');
    const walk = async (c, nm, x, y, pos) => {
      if (x) await G.drawIn(G.segment([0, 0], [x, 0], { color: AMB, width: 4, ends: [null, 'arrow'] }), 500, c);
      if (y) await G.drawIn(G.segment([x, 0], [x, y], { color: PUR, width: 4, ends: [null, 'arrow'] }), 500, c);
      await G.reveal(G.point(x, y, { color: SKETCH, r: 7, label: T(`${nm}(${x},\\ ${y})`), pos }), c);
    };
    const steps = [];
    if (k === 'a') {
      steps.push({ cap: 'Four quadrants, numbered <b>counter-clockwise</b> from the top right. The <b>signs</b> of the coordinates tell you which one.',
        run: async (c) => { for (const [s, x, y] of [['I\\ (+,+)', 5, 5], ['II\\ (-,+)', -5, 5], ['III\\ (-,-)', -5, -5], ['IV\\ (+,-)', 5, -5]]) await fadeIn(c, G.label(x, y, T(`\\text{${s.split('\\')[0]}}\\ ${s.split('\\ ')[1]}`), { cls: 'u5l12-qlab' })); } });
      EX1A.forEach(([nm, x, y, q, sg]) => steps.push({
        cap: x === 0 ? `${T(`${nm}(0,\\ ${y})`)}: ${T('x=0')}, so don’t move across. Straight up ${y}. ${T(nm)} sits <b>on the ${T('y')}-axis</b>, not in a quadrant.`
          : `${T(`${nm}(${x},\\ ${y})`)}: ${x < 0 ? 'left' : 'right'} ${Math.abs(x)}, then ${y < 0 ? 'down' : 'up'} ${Math.abs(y)}. Signs ${T(sg)}: <b>${q}</b>.`,
        run: async (c) => { await walk(c, nm, x, y, x < 0 ? 'w' : 'e'); await say(c, P, `${T(`${nm}(${x},\\ ${y})`)} → <b>${q}</b>`); }
      }));
      return steps;
    }
    EX1B.forEach(([nm, x, y, pos]) => steps.push({
      cap: `${T(`${nm}(${x},\\ ${y})`)}: ${x < 0 ? 'left' : 'right'} ${Math.abs(x)}, then ${y < 0 ? 'down' : 'up'} ${Math.abs(y)}. <b>${QN(x, y)}</b>.`,
      run: async (c) => { await walk(c, nm, x, y, pos); await say(c, P, `${T(`${nm}(${x},\\ ${y})`)}: ${QN(x, y)}`); }
    }));
    steps.push({ cap: 'One point in each quadrant. Check: the <b>first</b> number always moves you <b>across</b>.', run: (c) => say(c, P, 'across first, then up/down', 'ok') });
    return steps;
  }
};

/* =============================== explainer: four views (Examples 2, 3, Challenge 3) =============================== */
const views = {
  title: 'One relation, four views',
  height: 470,
  minW: 900,
  choices: [{ v: 'ex2', label: 'Example 2 check: chairs' }, { v: 'ex3', label: 'Example 3 check: mapping' }, { v: 'ch3', label: 'Challenge 3 check: garden' }],
  intro: (k) => (k === 'ex2' ? 'Row 1 has 6 chairs; each row after has 5 more. Press <b>Next</b>.' : k === 'ex3' ? 'One relation as a mapping diagram, ordered pairs, a table and a graph. Press <b>Next</b>.' : 'Week 1 has 8 plants; 6 more are added every week. Press <b>Next</b>.'),
  make(stage, k, ex) {
    if (k === 'ex3') {
      const MD = new MappingDiagram(stage, { x: 4, y: 4, width: 300, height: 290, domain: [10, 20, 30, 40], range: [2, 4, 6, 8], pairs: [[10, 2], [20, 4], [30, 6], [40, 8]], titles: ['A', 'B'], arrows: false });
      const P = panel(stage, 314, 4, 230, 290, 'ordered pairs');
      const tb = new ValueTable(stage, { x: 10, y: 330, headers: ['A', 'B'], rows: [[10, 2], [20, 4], [30, 6], [40, 8]], layout: 'h', cellW: 74, cellH: 50, hide: () => true, tap: false });
      const G = new Graph(stage, { x: ex.W - 330, y: 26, width: 326, height: 438, xmin: 0, xmax: 45, ymin: 0, ymax: 9.5, xstep: 5, ystep: 1, xlabels: 10, ylabels: 2, xtitle: 'A', ytitle: 'B', fontSize: 15 });
      const pairs = [[10, 2], [20, 4], [30, 6], [40, 8]];
      return [
        { cap: 'Follow each arrow from set A to set B.', run: (c) => MD.drawArrows(c) },
        { cap: `Arrow by arrow, <b>input first</b>: ${T('(10,\\ 2),\\ (20,\\ 4),\\ (30,\\ 6),\\ (40,\\ 8)')}.`,
          run: async (c) => { for (const [a, b] of pairs) await say(c, P, T(`(${a},\\ ${b})`), 'big'); } },
        { cap: 'The same pairs in a <b>table</b>: inputs in one row, outputs in the other.', run: (c) => tb.fill(c, { col: 0 }).then(() => tb.fill(c, { col: 1 })) },
        { cap: 'And as a <b>graph</b>: four dots, one for each pair.', run: async (c) => { for (const [a, b] of pairs) await pop(c, G.point(a, b, { color: SKETCH, r: 7 }), 220); } },
        { cap: `Each output is ${T('\\tfrac15')} of its input. One relation, <b>four pictures</b>.`, run: (c) => say(c, P, `${T('B=\\tfrac15A')}`, 'ok big') }
      ];
    }
    const ch = k === 'ch3', n0 = ch ? 8 : 6, d = ch ? 6 : 5, N = ch ? 6 : 5, nm = ch ? 'P' : 'C', vr = ch ? 'n' : 'n';
    const rows = Array.from({ length: N }, (_, i) => [i + 1, n0 + d * i]);
    const tb = new ValueTable(stage, { x: 10, y: 8, headers: [ch ? '\\text{week } n' : '\\text{row } n', ch ? 'P(n)' : 'C'], rows, cellW: 110, cellH: 52, hide: (r, cc) => cc === 1 && r > 0, tap: false, diffs: true, diffSpace: 80 });
    const P = panel(stage, 320, 8, ex.W - 364 - 330, 452, '');
    const G = new Graph(stage, { x: ex.W - 364, y: 26, width: 360, height: 438, xmin: 0, xmax: N + 1.5, ymin: 0, ymax: ch ? 45 : 30, xstep: 1, ystep: 5, xlabels: 1, ylabels: ch ? 10 : 5, xtitle: 'n', ytitle: nm, fontSize: 15 });
    const steps = [
      { cap: ch ? 'Week 1 has 8 plants. Each week adds <b>6 more</b>: 8, 14, 20, …' : 'Row 1 has 6 chairs. Each row adds <b>5 more</b>: 6, 11, 16, …',
        run: (c) => tb.fill(c, { col: 1 }) },
      { cap: `The pattern grows by the <b>same amount</b>, ${T('+' + d)}, every step.`, run: (c) => tb.diffs(c, { col: 1 }) },
      { cap: `Each row of the table is an ordered pair ${T(`(n,\\ ${nm === 'P' ? 'P' : 'C'})`)}. Plot them: <b>separate dots</b>, because there is no ${ch ? 'week' : 'row'} 2.5.`,
        run: async (c) => { for (const [x, y] of rows) await pop(c, G.point(x, y, { color: SKETCH, r: 7 }), 200); } }
    ];
    if (!ch) {
      steps.push({ cap: `The row number ${T('n')} is the one you <b>choose</b>: <b>independent</b> (across). The chairs ${T('C')} <b>depend</b> on it: <b>dependent</b> (up).`,
        run: async (c) => { await say(c, P, `<b class="u5l12-am">independent:</b> ${T('n')}, the row`); await say(c, P, `<b class="u5l12-pu">dependent:</b> ${T('C')}, the chairs`); } });
      steps.push({ cap: `A rule: “row 0” would have ${T('6-5=1')} chair, and each row adds 5, so ${T('C=5n+1')}. Check row 5: ${T('5(5)+1=26')} ✓`,
        run: (c) => say(c, P, T('C=5n+1'), 'ok big') });
      return steps;
    }
    steps.push({ cap: `(a) Go back one week: ${T('8-6=2')} plants at “week 0”. Start at 2 and add 6 each week: ${T('P(n)=6n+2')}.`,
      run: async (c) => { await pop(c, G.point(0, 2, { color: 'gray', r: 6, label: T('(0,\\ 2)'), pos: 'e', open: true })); await say(c, P, T('P(n)=6n+2'), 'ok big'); await say(c, P, `${T('P(1)=6(1)+2=8')} ✓`); } });
    steps.push({ cap: `(b) ${T('P(6)=6(6)+2=38')} plants: the last row of the table. (d) The weeks start at 1 and count up: ${T('D=\\{1,\\ 2,\\ 3,\\ \\dots\\}')}.`,
      run: async (c) => { tb.highlight(5, true); await say(c, P, T('P(6)=38')); await say(c, P, T('D=\\{1,2,3,\\dots\\}'), 'dom'); } });
    return steps;
  }
};

/* =============================== explainer: intercepts (Example 4, Challenge 2(c)) =============================== */
const E4 = [[-1, -4], [0, -3], [1, -2], [2, -1], [3, 0], [4, 1]];
const PARAB = (x) => -x * x + 2 * x + 8;
const CH2WIN = (o) => Object.assign({ xmin: -4, xmax: 6, ymin: -3, ymax: 10, xlabels: 2, ylabels: 2, fontSize: 14 }, o);
const intercepts = {
  title: 'Intercepts: where the graph meets the axes',
  height: 460,
  minW: 900,
  choices: [{ v: 'ex4', label: 'Example 4 check' }, { v: 'ch2', label: 'Challenge 2(c) check' }],
  intro: (k) => (k === 'ex4' ? `${T('x')}-intercept: ${T('y=0')}. ${T('y')}-intercept: ${T('x=0')}. Press <b>Next</b>.` : 'Read the intercepts of the curve, then check them with its rule. Press <b>Next</b>.'),
  make(stage, k, ex) {
    if (k === 'ex4') {
      const tb = new ValueTable(stage, { x: 10, y: 8, headers: ['x', 'y'], rows: E4, cellW: 90, cellH: 52, tap: false });
      const P = panel(stage, 200, 8, ex.W - 470 - 210, 300, '');
      const G = new Graph(stage, { x: ex.W - 470, y: 26, width: 466, height: 432, xmin: -3, xmax: 6, ymin: -6, ymax: 3, xlabels: 1, ylabels: 1, fontSize: 15 });
      return [
        { cap: 'The table lists six points of the relation. Plot them.', run: async (c) => { for (const [x, y] of E4) await pop(c, G.point(x, y, { color: INK, r: 6 }), 160); } },
        { cap: `<b>${T('y')}-intercept:</b> every point on the ${T('y')}-axis has ${T('x=0')}. The row with ${T('x=0')} has ${T('y=-3')}.`,
          run: async (c) => { tb.highlight(1, true, 'u5l12-hlp'); await G.reveal(G.point(0, -3, { color: PUR, r: 9, label: T('(0,\\ -3)'), pos: 'w' }), c); await say(c, P, `${T('y')}-int: ${T('(0,\\ -3)')}`, 'ran'); } },
        { cap: `<b>${T('x')}-intercept:</b> every point on the ${T('x')}-axis has ${T('y=0')}. The row with ${T('y=0')} has ${T('x=3')}.`,
          run: async (c) => { tb.highlight(4, true, 'u5l12-hla'); await G.reveal(G.point(3, 0, { color: AMB, r: 9, label: T('(3,\\ 0)'), pos: 'nw' }), c); await say(c, P, `${T('x')}-int: ${T('(3,\\ 0)')}`, 'dom'); } },
        { cap: `Join the points: the line crosses the ${T('y')}-axis at ${T('(0,\\ -3)')} and the ${T('x')}-axis at ${T('(3,\\ 0)')}.`,
          run: (c) => G.drawIn(G.line([0, -3], [3, 0], { color: 'teal', width: 3 }), 900, c) }
      ];
    }
    const G = new Graph(stage, CH2WIN({ x: 8, y: 26, width: 420, height: 432 }));
    const P = panel(stage, 446, 4, ex.W - 456, 452, `the rule: ${T('y=-x^2+2x+8')}`);
    return [
      { cap: 'The curve from Challenge 2, from the solid dot at x = −2 to the solid dot at x = 4.', run: async (c) => { await G.drawIn(G.fn(PARAB, { from: -2, to: 4, arrows: false, color: 'blue', width: 3.5 }), 900, c); [-2, 4].forEach((x) => G.point(x, 0, { color: 'blue', r: 6 })); } },
      { cap: `<b>${T('y')}-intercept:</b> where it crosses the ${T('y')}-axis: ${T('(0,\\ 8)')}. Check: put ${T('x=0')} in the rule.`,
        run: async (c) => { await G.reveal(G.point(0, 8, { color: PUR, r: 8, label: T('(0,\\ 8)'), pos: 'nw' }), c); await say(c, P, `${T('x=0')}: ${T('y=-0+0+8=8')} ✓`, 'ran'); } },
      { cap: `<b>${T('x')}-intercepts:</b> it crosses the ${T('x')}-axis <b>twice</b>, at ${T('(-2,\\ 0)')} and ${T('(4,\\ 0)')}.`,
        run: async (c) => { await G.reveal(G.point(-2, 0, { color: AMB, r: 8, label: T('(-2,\\ 0)'), pos: 'nw' }), c); await G.reveal(G.point(4, 0, { color: AMB, r: 8, label: T('(4,\\ 0)'), pos: 'ne' }), c); } },
      { cap: `Check both with the rule: each gives ${T('y=0')}.`,
        run: async (c) => { await say(c, P, `${T('x=4')}: ${T('-16+8+8=0')} ✓`, 'dom'); await say(c, P, `${T('x=-2')}: ${T('-4-4+8=0')} ✓`, 'dom'); } }
    ];
  }
};

/* =============================== explainer: domain and range, the shadows (Example 5, Challenge 2(b)) =============================== */
const shadow = {
  title: 'Domain and range: squash it onto the axes',
  height: 460,
  minW: 900,
  choices: [{ v: 'a', label: 'Example 5(a) check' }, { v: 'b', label: 'Example 5(b) check' }, { v: 'ch2', label: 'Challenge 2(b) check' }],
  intro: (k) => (k === 'b' ? 'Four ordered pairs. List the inputs and outputs, each value <b>once</b>. Press <b>Next</b>.' : 'Domain: squash the graph down onto the x-axis. Range: squash it sideways onto the y-axis. Press <b>Next</b>.'),
  make(stage, k, ex) {
    if (k === 'b') {
      const PR = [[3, 7], [5, 2], [3, 9], [8, 2]];
      const G = new Graph(stage, { x: 8, y: 26, width: 440, height: 432, xmin: -1, xmax: 10, ymin: -1, ymax: 10, xlabels: 1, ylabels: 1, fontSize: 15 });
      const P = panel(stage, 466, 4, ex.W - 476, 452, 'set notation');
      return [
        { cap: `The relation ${T('(3,\\ 7),\\ (5,\\ 2),\\ (3,\\ 9),\\ (8,\\ 2)')}: four dots.`, run: async (c) => { for (const [x, y] of PR) await pop(c, G.point(x, y, { color: INK, r: 6, label: T(`(${x},\\ ${y})`), pos: 'ne' }), 200); } },
        { cap: `<b>Domain:</b> the ${T('x')}’s are ${T('3,\\ 5,\\ 3,\\ 8')}. The 3 appears twice: write it <b>once</b>.`,
          run: async (c) => { for (const [x] of PR) await pop(c, G.point(x, 0, { color: AMB, r: 7 }), 160); await say(c, P, `${T('x')}: ${T('3,\\ 5,\\ \\cancel{3},\\ 8')}`); await say(c, P, T('D=\\{3,\\ 5,\\ 8\\}'), 'dom big'); } },
        { cap: `<b>Range:</b> the ${T('y')}’s are ${T('7,\\ 2,\\ 9,\\ 2')}. Write 2 once, in order from smallest.`,
          run: async (c) => { for (const [, y] of PR) await pop(c, G.point(0, y, { color: PUR, r: 7 }), 160); await say(c, P, `${T('y')}: ${T('7,\\ 2,\\ 9,\\ \\cancel{2}')}`); await say(c, P, T('R=\\{2,\\ 7,\\ 9\\}'), 'ran big'); } },
        { cap: 'Separate dots, so both answers are <b>lists</b> in braces.', run: (c) => say(c, P, 'dots → lists in { }', 'sm') }
      ];
    }
    const seg = k === 'a';
    const G = seg ? new Graph(stage, { x: 8, y: 26, width: 440, height: 432, xmin: -7, xmax: 5, ymin: -5, ymax: 8, xlabels: 1, ylabels: 1, fontSize: 14 }) : new Graph(stage, CH2WIN({ x: 8, y: 26, width: 420, height: 432 }));
    const P = panel(stage, seg ? 466 : 446, 4, ex.W - (seg ? 476 : 456), 452, 'write it down');
    const dx = seg ? [-5, 3] : [-2, 4], dy = seg ? [-3, 6] : [0, 9];
    let sx;
    return [
      { cap: seg ? `A line segment from ${T('(-5,\\ -3)')} to ${T('(3,\\ 6)')}, closed dots at both ends.` : 'The curve from Challenge 2: from the solid dot at (−2, 0) to the solid dot at (4, 0), with its peak at (1, 9).',
        run: async (c) => {
          if (seg) { await G.drawIn(G.segment([-5, -3], [3, 6], { closedA: true, closedB: true, color: 'blue', width: 3.5 }), 900, c); await G.reveal(G.point(-5, -3, { color: 'blue', label: T('(-5,\\ -3)'), pos: 'se' }), c); await G.reveal(G.point(3, 6, { color: 'blue', label: T('(3,\\ 6)'), pos: 'w' }), c); }
          else { await G.drawIn(G.fn(PARAB, { from: -2, to: 4, arrows: false, color: 'blue', width: 3.5 }), 900, c); for (const x of [-2, 4]) await G.reveal(G.point(x, 0, { color: 'blue', r: 6, label: T(`(${x},\\ 0)`), pos: x < 0 ? 'nw' : 'ne' }), c, 200); await G.reveal(G.point(1, 9, { color: 'blue', label: T('(1,\\ 9)'), pos: 'ne' }), c); }
        } },
      { cap: `<b>Domain:</b> squash the graph straight down onto the ${T('x')}-axis. It covers ${seg ? 'from −5 to 3' : 'from −2 to 4'}.`,
        run: async (c) => { sx = G.shadeX(dx[0], dx[1], { band: true, color: AMB }); await G.drawIn(sx, 800, c); await say(c, P, seg ? T('D:\\ -5\\le x\\le 3') : T('D:\\ -2\\le x\\le 4'), 'dom big'); } },
      { cap: `<b>Range:</b> squash it sideways onto the ${T('y')}-axis. ${seg ? 'From −3 up to 6.' : 'From 0 (the two ends) up to 9 (the peak).'}`,
        run: async (c) => { G.remove(sx); G.shadeX(dx[0], dx[1], { color: AMB }); await G.drawIn(G.shadeY(dy[0], dy[1], { band: true, color: PUR }), 800, c); await say(c, P, seg ? T('R:\\ -3\\le y\\le 6') : T('R:\\ 0\\le y\\le 9'), 'ran big'); } },
      { cap: seg ? 'An unbroken segment, so we use <b>inequalities</b>, not a list. The closed dots mean the ends are included: ≤.' : 'The peak sets the top of the range, and the two end dots set the bottom. The solid dots mean the ends are included: ≤.',
        run: (c) => say(c, P, seg ? 'segment → inequalities' : 'solid dots → ≤', 'sm') }
    ];
  }
};

/* =============================== explainer: the calculator screen (Example 6) =============================== */
const LINE6 = (x) => -2 * x + 8;
const screen = {
  title: 'Diego’s calculator screen',
  height: 440,
  minW: 900,
  choices: [{ v: 'ab', label: 'Example 6(a)(b) check' }, { v: 'c', label: '6(c): does it ever end?' }],
  intro: (k) => (k === 'ab' ? `${T('y=-2x+8')} in the standard window. Press <b>Next</b>.` : 'Zoom out and see whether the line ever stops. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const G = new Graph(stage, { theme: 'calc', x: 8, y: 4, width: 560, height: 420, xmin: -10, xmax: 10, ymin: -10, ymax: 10 });
    const P = panel(stage, 590, 4, ex.W - 600, 430, '');
    P.appendChild(h('div', 'u5l12-y1', `${T('Y_1=-2X+8')}`));
    const win = h('div', 'u5l12-win', ''); P.appendChild(win);
    const setWin = (w) => { win.innerHTML = `<b>WINDOW</b><span>Xmin=${w.xmin}</span><span>Xmax=${w.xmax}</span><span>Ymin=${w.ymin}</span><span>Ymax=${w.ymax}</span>`; };
    setWin({ xmin: -10, xmax: 10, ymin: -10, ymax: 10 });
    if (k === 'ab') {
      let tr;
      return [
        { cap: `Diego types ${T('Y_1=-2X+8')} and presses GRAPH.`, run: (c) => G.drawIn(G.fn(LINE6), 900, c) },
        { cap: `(a) The <b>standard window</b>: ${T('x')} from −10 to 10, ${T('y')} from −10 to 10.`, run: (c) => pulse(c, win, 1.05) },
        { cap: `(b) Trace to ${T('x=0')}: the line crosses the ${T('y')}-axis at 8. The ${T('y')}-intercept is ${T('(0,\\ 8)')}.`,
          run: async (c) => { tr = G.traceMarker(LINE6, -3, { title: 'Y1=−2X+8' }); await tr.move(c, 0, 900); await say(c, P, `${T('y')}-int ${T('(0,\\ 8)')}`, 'ran'); } },
        { cap: `Move along to where the line meets the ${T('x')}-axis: ${T('x=4')}. The ${T('x')}-intercept is ${T('(4,\\ 0)')}.`,
          run: async (c) => { await tr.move(c, 4, 900); G.readout('Zero', { x: 4, y: 0 }); await say(c, P, `${T('x')}-int ${T('(4,\\ 0)')}`, 'dom'); } },
        { cap: `Check with algebra: ${T('y=-2(0)+8=8')} and ${T('0=-2x+8\\Rightarrow x=4')} ✓`, run: async (c) => { await say(c, P, T('y=-2(0)+8=8')); await say(c, P, T('0=-2x+8\\Rightarrow x=4'), 'ok'); } }
      ];
    }
    return [
      { cap: 'In the standard window the line runs off the <b>top</b> and the <b>bottom</b> of the screen.', run: (c) => G.drawIn(G.fn(LINE6), 900, c) },
      { cap: 'Zoom out: x and y from −50 to 50. Still no end!', run: async (c) => { setWin({ xmin: -50, xmax: 50, ymin: -50, ymax: 50 }); await G.setWindow({ xmin: -50, xmax: 50, ymin: -50, ymax: 50, xstep: 10, ystep: 10 }, c, 1200); } },
      { cap: 'Zoom out again: −500 to 500. It keeps going, with no endpoints.', run: async (c) => { setWin({ xmin: -500, xmax: 500, ymin: -500, ymax: 500 }); await G.setWindow({ xmin: -500, xmax: 500, ymin: -500, ymax: 500, xstep: 100, ystep: 100 }, c, 1200); } },
      { cap: '(c) The line never ends, left or right, up or down. <b>Domain: all real numbers. Range: all real numbers.</b>',
        run: async (c) => { await say(c, P, '<b class="u5l12-am">Domain:</b> all real numbers'); await say(c, P, '<b class="u5l12-pu">Range:</b> all real numbers'); } }
    ];
  }
};

/* =============================== explainer: the vertical line test (Example 7, Challenge 2(a)) =============================== */
const E7WIN = { xmin: -2.2, xmax: 2.2, ymin: -1.9, ymax: 2.1, xstep: 0.5, ystep: 0.5, grid: false, numbers: false };
const CIRC = []; for (let i = 0; i <= 80; i++) { const a = i / 80 * 2 * Math.PI; CIRC.push([1.5 * Math.cos(a), 0.1 + 1.5 * Math.sin(a)]); }
const E7 = {
  A: { name: 'Graph A: an arch', draw: (G, o = {}) => G.fn((x) => Math.sqrt(Math.max(0, 2.25 - x * x)), Object.assign({ from: -1.5, to: 1.5, arrows: false, color: 'ink', width: 3.5, samples: 160 }, o)), hits: (x) => (x >= -1.5 && x <= 1.5 ? [Math.sqrt(Math.max(0, 2.25 - x * x))] : []), fn: true }, // centred at the origin, (1.5, 0) to (−1.5, 0)
  B: { name: 'Graph B: a circle', draw: (G, o = {}) => G.polyline(CIRC, Object.assign({ closed: true, color: 'ink', width: 3.5 }, o)), hits: (x) => (Math.abs(x) <= 1.5 ? [0.1 + Math.sqrt(2.25 - x * x), 0.1 - Math.sqrt(2.25 - x * x)] : []), fn: false },
  C: { name: 'Graph C: a V', draw: (G, o = {}) => G.polyline([[-1.5, 1.6], [0, -0.2], [1.5, 1.6]], Object.assign({ color: 'ink', width: 3.5 }, o)), hits: (x) => (Math.abs(x) <= 1.5 ? [1.2 * Math.abs(x) - 0.2] : []), fn: true },
  P: { name: 'Challenge 2: the curve', draw: (G) => { const g = G.fn(PARAB, { from: -2, to: 4, arrows: false, color: 'blue', width: 3.5 }); [-2, 4].forEach((x) => G.point(x, 0, { color: 'blue', r: 6 })); return g; }, hits: (x) => (x >= -2 && x <= 4 ? [PARAB(x)] : []), fn: true, grid: true }
};
const vlt = {
  title: 'The vertical line test',
  height: 420,
  minW: 860,
  choices: Object.keys(E7).map((k) => ({ v: k, label: k === 'P' ? 'Challenge 2(a) check' : 'Example 7: ' + k })),
  intro: (k) => `${E7[k].name}. Is it a function? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = E7[k];
    const G = new Graph(stage, d.grid ? CH2WIN({ x: 8, y: 6, width: 440, height: 410 }) : Object.assign({ x: 8, y: 10, width: 440, height: 400 }, E7WIN));
    const P = panel(stage, 466, 10, ex.W - 476, 400, 'verdict');
    let res;
    return [
      { cap: `${d.name}.`, run: (c) => G.drawIn(d.draw(G), 1000, c) },
      { cap: 'Slide a <b>vertical line</b> across, left to right, and count how many times it meets the graph…',
        run: async (c) => { res = await G.vlineTest(c, { hits: d.hits, snap: d.grid ? 1 : 0.5 }); } },
      { cap: d.fn ? 'Every vertical line meets the graph <b>at most once</b>: each input has one output. <b>A function.</b>'
        : 'This vertical line meets the circle <b>twice</b>, at the top and at the bottom: one input, two outputs. <b>Not a function.</b>',
        run: async (c) => {
          if (res && res.fail) line(P, `one ${T('x')}, <b>two</b> points on the graph`, 'bad');
          else line(P, 'never more than one crossing', 'ok');
          const s = stamp(P, d.fn ? 'Function' : 'Not a function', { ok: d.fn, size: 'lg' }); s.style.alignSelf = 'center'; s.style.marginTop = '40px';
          await stampIn(c, s);
        } }
    ];
  }
};

/* =============================== explainer: forwards and backwards (Example 8, Challenges 1 and 3) =============================== */
const FB = {
  a: { label: 'Example 8(a): ' + T('g(6)'), nm: 'g', rule: 'g(x)=4x-9', m: 4, b: -9, dir: 'f', x: 6, xt: 'x', yt: 'y', line: true, win: { xmin: -1, xmax: 8, ymin: -12, ymax: 24, ystep: 2, xlabels: 1, ylabels: 4 } },
  b: { label: '8(b): ' + T('g(k)=7'), nm: 'g', v: 'k', rule: 'g(x)=4x-9', m: 4, b: -9, dir: 'b', y: 7, alg: ['4k-9=7', '4k=16', 'k=4'], xt: 'x', yt: 'y', line: true, win: { xmin: -1, xmax: 8, ymin: -12, ymax: 24, ystep: 2, xlabels: 1, ylabels: 4 } },
  c1: { label: 'Challenge 1(b): ' + T('C(p)=175'), nm: 'C', v: 'p', rule: 'C(p)=25+15p', m: 15, b: 25, dir: 'b', y: 175, alg: ['25+15p=175', '15p=150', 'p=10'], xt: 'p', yt: 'C', win: { xmin: 0, xmax: 12.5, ymin: 0, ymax: 220, xstep: 1, ystep: 20, xlabels: 2, ylabels: 40 } },
  c3: { label: 'Challenge 3(c): ' + T('P(n)=62'), nm: 'P', v: 'n', rule: 'P(n)=6n+2', m: 6, b: 2, dir: 'b', y: 62, alg: ['6n+2=62', '6n=60', 'n=10'], xt: 'n', yt: 'P', from: 1, win: { xmin: 0, xmax: 12.5, ymin: 0, ymax: 80, xstep: 1, ystep: 5, xlabels: 2, ylabels: 10 } }
};
const fwdBack = {
  title: 'Forwards and backwards through a function',
  height: 420,
  minW: 940,
  choices: Object.keys(FB).map((k) => ({ v: k, label: FB[k].label })),
  intro: (k) => (FB[k].dir === 'f' ? 'Forwards: the input is known, so substitute. Press <b>Next</b>.' : 'Backwards: the output is known, so undo the steps in reverse order. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = FB[k], f = (x) => d.m * x + d.b;
    const X = [8, 122, 216, 330, 424], cb = (cls, x, y) => add(stage, h('div', 'u5l12-cbox ' + cls, ''), x, y);
    const op = (txt, x, y, back) => add(stage, h('div', 'u5l12-cop' + (back ? ' back' : ''), txt), x, y + 4);
    const arr = (ch, x, y) => add(stage, h('div', 'u5l12-carr', ch), x, y + 10);
    const addTxt = d.b < 0 ? `−${-d.b}` : `+${d.b}`, undoTxt = d.b < 0 ? `+${-d.b}` : `−${d.b}`;
    const fwd = [], bk = [];
    add(stage, h('div', 'u5l12-crowlab', 'forwards: do'), 10, 12);
    fwd.push(cb('in', X[0], 36), arr('→', 96, 36), op('×' + d.m, X[1], 36), arr('→', 192, 36), cb('', X[2], 36), arr('→', 306, 36), op(addTxt, X[3], 36), arr('→', 400, 36), cb('out', X[4], 36));
    const [fIn, , , , fMid, , , , fOut] = fwd;
    const backRow = d.dir === 'b';
    if (backRow) {
      add(stage, h('div', 'u5l12-crowlab', 'backwards: undo'), 10, 120);
      bk.push(cb('in', X[0], 144), arr('←', 96, 144), op('÷' + d.m, X[1], 144, true), arr('←', 192, 144), cb('', X[2], 144), arr('←', 306, 144), op(undoTxt, X[3], 144, true), arr('←', 400, 144), cb('out', X[4], 144));
    }
    const [bIn, , bOp1, , bMid, , bOp2, , bOut] = bk;
    [...fwd, ...bk].forEach((e) => (e.style.opacity = 0));
    const P = panel(stage, 10, 232, 520, 178, 'Algebra');
    const G = new Graph(stage, Object.assign({ x: ex.W - 400, y: 6, width: 396, height: 408, xtitle: d.xt, ytitle: d.yt, fontSize: 14 }, d.win));
    const setBox = async (c, el, t) => { el.innerHTML = T(t); await pop(c, el); };
    const first = { cap: `${T(d.rule)} as a machine: <b>multiply by ${d.m}</b>, then <b>${d.b < 0 ? 'subtract ' + -d.b : 'add ' + d.b}</b>.` + (backRow ? ' Backwards, undo each step in <b>reverse</b> order.' : ''),
      run: async (c) => {
        for (const e of fwd) await fadeIn(c, e, 140); for (const e of bk) await fadeIn(c, e, 140);
        if (d.line) await G.drawIn(G.line({ m: d.m, b: d.b }, { color: 'teal' }), 700, c);
        else for (let n = d.from || 0; n <= 12; n++) G.point(n, f(n), { color: 'teal', r: 4.5 });
      } };
    if (d.dir === 'f') {
      const y = f(d.x), mid = d.m * d.x;
      return [first,
        { cap: `<b>Forwards:</b> the input is ${T(String(d.x))}.`, run: (c) => setBox(c, fIn, String(d.x)) },
        { cap: `Multiply by ${d.m}: ${T(`${d.x}\\times${d.m}=${mid}`)}.`, run: async (c) => { await pulse(c, fwd[2], 1.15); await setBox(c, fMid, String(mid)); } },
        { cap: `Subtract ${-d.b}: ${T(`${mid}-${-d.b}=${y}`)}. So ${T(`${d.nm}(${d.x})=${y}`)}.`, run: async (c) => { await pulse(c, fwd[6], 1.15); await setBox(c, fOut, String(y)); await say(c, P, T(`${d.nm}(${d.x})=${d.m}(${d.x})-${-d.b}=${mid}-${-d.b}=${y}`), 'big'); } },
        { cap: `On the graph: above ${T(`x=${d.x}`)} the line is at height ${T(String(y))}. The point ${T(`(${d.x},\\ ${y})`)}.`,
          run: async (c) => { await G.drawIn(G.polyline([[d.x, 0], [d.x, y], [0, y]], { color: 'blue', width: 3, dash: '7 6', ends: [null, 'arrow'] }), 900, c); await G.reveal(G.point(d.x, y, { color: 'ink', label: T(`(${d.x},\\ ${y})`), pos: 'se' }), c); } }
      ];
    }
    const yT = String(d.y), mid = d.y - d.b, xV = mid / d.m, xT = String(xV);
    return [first,
      { cap: `<b>Backwards:</b> this time the <b>output</b> is known, ${T(`${d.nm}(${d.v})=${yT}`)}. Start at the end.`, run: (c) => setBox(c, bOut, yT) },
      { cap: `Undo the <b>last</b> step first. Undo ${T(addTxt.replace('−', '-'))} ${d.b < 0 ? 'by adding' : 'by subtracting'} ${Math.abs(d.b)}: ${T(`${yT}${d.b < 0 ? '+' : '-'}${Math.abs(d.b)}=${mid}`)}.`, run: async (c) => { await pulse(c, bOp2, 1.15); await setBox(c, bMid, String(mid)); } },
      { cap: `Undo ${T('\\times' + d.m)} by dividing by ${d.m}: ${T(`${mid}\\div${d.m}=${xT}`)}. So ${T(`${d.v}=${xT}`)}.`, run: async (c) => { await pulse(c, bOp1, 1.15); await setBox(c, bIn, xT); } },
      { cap: `The algebra does the same undoing: set the rule equal to ${yT} and solve.`, run: async (c) => { for (const l of d.alg) await say(c, P, T(l)); } },
      { cap: `On the graph: across from ${T(yT)} on the ${T(d.yt)}-axis to the ${d.line ? 'line' : 'dots'}, then down to ${T(`${d.xt}=${xT}`)}.`,
        run: async (c) => { await G.drawIn(G.polyline([[0, d.y], [xV, d.y], [xV, 0]], { color: PUR, width: 3, dash: '7 6', ends: [null, 'arrow'] }), 900, c); await G.reveal(G.point(xV, d.y, { color: 'ink', r: 7, label: T(`(${xT},\\ ${yT})`), pos: 'nw' }), c); } }
    ];
  }
};

/* =============================== explainer: reading a graph and a model (Example 9) =============================== */
const DOTS9 = [[-3, 4], [-2, 2], [-1, 0], [0, -2], [1, -4], [2, -6]];
const readGraph = {
  title: 'Function values from a graph and a model',
  height: 460,
  minW: 860,
  choices: [{ v: 'a', label: 'Example 9(a) check' }, { v: 'b', label: 'Example 9(b) check' }],
  intro: (k) => (k === 'a' ? 'To find f(a): go to x = a, up or down to the dot, then across to the y-axis. Press <b>Next</b>.' : `${T('W(n)=10+8n')}: the cost of ${T('n')} dog walks. Press <b>Next</b>.`),
  make(stage, k, ex) {
    if (k === 'a') {
      const G = new Graph(stage, { x: 8, y: 6, width: 400, height: 450, xmin: -5, xmax: 4, ymin: -7, ymax: 5, xlabels: 1, ylabels: 1, fontSize: 15 });
      const P = panel(stage, 426, 6, ex.W - 436, 450, 'read it');
      const path = (c, pts, color) => G.drawIn(G.polyline(pts, { color, width: 3.5, dash: '7 6', ends: [null, 'arrow'] }), 900, c);
      return [
        { cap: 'The graph of ' + T('y=f(x)') + ' is six separate dots.', run: async (c) => { for (const [x, y] of DOTS9) await pop(c, G.point(x, y, { color: 'ink', r: 7 }), 200); } },
        { cap: `${T('f(-1)')}: go to ${T('x=-1')}. The dot is right there, <b>on the ${T('x')}-axis</b>: ${T('(-1,\\ 0)')}, so ${T('f(-1)=0')}.`,
          run: async (c) => { await G.reveal(G.point(-1, 0, { color: 'blue', r: 9, label: T('f(-1)=0'), pos: 'nw' }), c); await say(c, P, T('f(-1)=0')); } },
        { cap: `${T('f(2)')}: go to ${T('x=2')}, <b>down</b> to the dot, across to the ${T('y')}-axis: ${T('f(2)=-6')}.`,
          run: async (c) => { await path(c, [[2, 0], [2, -6], [0, -6]], 'red'); G.label(2, -6, T('f(2)=-6'), { pos: 'e', cls: 'bk-ptlab', color: 'red' }); await say(c, P, T('f(2)=-6')); } },
        { cap: `Add the two outputs: ${T('f(-1)+f(2)=0+(-6)=-6')}.`, run: (c) => say(c, P, T('f(-1)+f(2)=0+(-6)=-6'), 'ok big') }
      ];
    }
    const W = (n) => 10 + 8 * n;
    const G = new Graph(stage, { x: 8, y: 6, width: 440, height: 450, xmin: 0, xmax: 7.5, ymin: 0, ymax: 70, xstep: 1, ystep: 5, xlabels: 1, ylabels: 10, xtitle: 'n', ytitle: 'W', fontSize: 15 });
    const P = panel(stage, 466, 6, ex.W - 476, 450, 'work');
    return [
      { cap: `$10 to book, plus $8 per walk. Even 0 walks costs $10: the first dot is ${T('(0,\\ 10)')}.`, run: async (c) => { for (let n = 0; n <= 7; n++) await pop(c, G.point(n, W(n), { color: 'teal', r: 6 }), 140); await say(c, P, T('W(n)=10+8n'), 'big'); } },
      { cap: `${T('W(5)')}: substitute ${T('n=5')}. ${T('W(5)=10+8(5)=10+40=50')}.`,
        run: async (c) => { await G.drawIn(G.polyline([[5, 0], [5, 50], [0, 50]], { color: 'blue', width: 3, dash: '7 6', ends: [null, 'arrow'] }), 900, c); await say(c, P, T('W(5)=10+8(5)=50')); await say(c, P, 'Five walks cost <b>$50</b>.', 'ok'); } },
      { cap: `<b>Domain:</b> a number of walks is a whole number and can’t be negative (the graph is <b>dots</b>), so ${T('D=\\{0,\\ 1,\\ 2,\\ 3,\\ \\dots\\}')}.`,
        run: async (c) => { for (let n = 0; n <= 7; n++) await pop(c, G.point(n, 0, { color: AMB, r: 6 }), 100); await say(c, P, T('D=\\{0,\\ 1,\\ 2,\\ 3,\\ \\dots\\}'), 'dom big'); await say(c, P, `also written ${T('n\\ge 0')}, ${T('n')} a whole number`, 'sm'); } }
    ];
  }
};

/* =============================== explainer: real-world graphs (Example 10) =============================== */
function storyGraph(host, o) {
  const G = new Graph(host, Object.assign({ numbers: false, xtitle: '', ytitle: '', pad: [18, 26, o.xticks ? 62 : 40, o.yticks ? 70 : 44] }, o));
  const ax = G.axesHtml, w = G.win;
  (o.xticks || []).forEach(([v, s]) => { const [px, py] = G.toPx(v, w.ymin); svgEl('line', { class: 'bk-tick', x1: px, x2: px, y1: py - 4, y2: py + 4 }, G.layers.axes); if (s) G.hlabel(px, py, s, { pos: 's', gap: 6, cls: 'u5l12-tk', parent: ax }); });
  (o.yticks || []).forEach(([v, s]) => { const [px, py] = G.toPx(w.xmin, v); svgEl('line', { class: 'bk-tick', x1: px - 4, x2: px + 4, y1: py, y2: py }, G.layers.axes); G.hlabel(px, py, s, { pos: 'w', gap: 8, cls: 'u5l12-tk', parent: ax }); });
  const [x0, y1] = G.toPx(w.xmin, w.ymin), [x1, y0] = G.toPx(w.xmax, w.ymax);
  if (o.xt) G.hlabel((x0 + x1) / 2, G.H - 3, o.xt, { pos: 'n', gap: 0, cls: 'u5l12-axt', parent: ax });
  if (o.yt) G.hlabel(15, (y0 + y1) / 2, o.yt, { pos: 'c', cls: 'u5l12-axt u5l12-rot', parent: ax });
  return G;
}
const CYC = [[0, 0], [2, 15], [5, 15], [7, 0]];
const cycAxes = (o) => Object.assign({ xmin: 0, xmax: 7.6, ymin: 0, ymax: 17.5, xstep: 1, ystep: 2.5, xticks: [[0, '0'], [2, '2'], [5, '5'], [7, '7']], yticks: [[5, '5'], [10, '10'], [15, '15']], xt: 'time (minutes)', yt: 'speed (km/h)' }, o);
const COFFEE = (x) => (x < 5 ? 2 + 7 * ((5 - x) / 4.7) ** 2 : 2);
function yAtP(pts, x) { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; if (x <= b[0] + 1e-9) return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); } return pts[pts.length - 1][1]; }
const cycDist = (t) => { let s = 0; for (let i = 1; i < CYC.length; i++) { const a = CYC[i - 1], b = CYC[i]; if (t <= a[0]) break; const te = Math.min(t, b[0]); s += (te - a[0]) * (a[1] + yAtP(CYC, te)) / 2; } return s; };
function bikeScene(stage, x, y, W, H) {
  const sc = add(stage, box(h('div', 'u5l12-scene'), W, H), x, y), gy = H - 30, L = 60, R = 150, tot = cycDist(7), px = (s) => L + s / tot * (W - L - R);
  sc.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#eaf3fc"/><rect y="${gy}" width="${W}" height="${H - gy}" fill="#9cc96b"/>
    <rect y="${gy + 4}" width="${W}" height="20" fill="#7d8593"/><line x1="0" x2="${W}" y1="${gy + 14}" y2="${gy + 14}" stroke="#fff" stroke-width="2.5" stroke-dasharray="14 12"/>
    <g transform="translate(${W - 66} 62)"><path d="M-44 0A44 44 0 0 1 44 0" fill="#fff" stroke="${INK}" stroke-width="3"/><text x="0" y="-14" text-anchor="middle" font-size="14" font-weight="800" fill="${INK}">speed</text>
    <text class="u5l12-gv" x="0" y="22" text-anchor="middle" font-size="17" font-weight="800" fill="${COLORS.red}">0 km/h</text><line class="u5l12-needle" x1="0" y1="0" x2="-34" y2="0" stroke="${COLORS.red}" stroke-width="4" stroke-linecap="round"/><circle r="5" fill="${INK}"/></g>
    <g class="u5l12-bike"><circle cx="-13" cy="-10" r="10" fill="none" stroke="${INK}" stroke-width="2.6"/><circle cx="13" cy="-10" r="10" fill="none" stroke="${INK}" stroke-width="2.6"/>
    <path d="M-13 -10L-2 -24L13 -10M-2 -24L-4 -34M-8 -36H2M-2 -24H10L13 -10" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linejoin="round"/><circle cx="-2" cy="-50" r="7" fill="#fbe6b8" stroke="${INK}" stroke-width="2"/>
    <path d="M-4 -43L-4 -34L6 -30" stroke="#1f5bd6" stroke-width="6" stroke-linecap="round" fill="none"/></g></svg>`;
  const bike = sc.querySelector('.u5l12-bike'), needle = sc.querySelector('.u5l12-needle'), gv = sc.querySelector('.u5l12-gv');
  return (t, v) => { bike.setAttribute('transform', `translate(${px(cycDist(t))} ${gy + 16})`); const a = Math.PI * (1 - v / 20); needle.setAttribute('x2', 34 * Math.cos(a)); needle.setAttribute('y2', -34 * Math.sin(a)); gv.textContent = `${Math.round(v)} km/h`; };
}
function mugScene(stage, x, y, W, H) {
  const sc = add(stage, box(h('div', 'u5l12-scene'), W, H), x, y);
  sc.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#f3efe6"/><rect y="${H - 14}" width="${W}" height="14" fill="#c9a77c"/>
    <g transform="translate(${W / 2 - 90} 0)"><g class="u5l12-steam" stroke="#9aa3b2" stroke-width="3" fill="none" stroke-linecap="round"><path d="M-10 30Q-16 20 -10 10Q-4 0 -10 -8"/><path d="M8 30Q2 20 8 10Q14 0 8 -8"/></g>
    <path d="M-28 36H28V82Q28 90 20 90H-20Q-28 90 -28 82Z" fill="#fff" stroke="${INK}" stroke-width="2.6"/><rect x="-24" y="40" width="48" height="10" fill="#5b3a1f"/><path d="M28 48Q46 48 46 62Q46 76 28 76" fill="none" stroke="${INK}" stroke-width="2.6"/></g>
    <g transform="translate(${W / 2 + 60} 6)"><rect x="-8" y="0" width="16" height="72" rx="8" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cy="80" r="11" fill="${COLORS.red}" stroke="${INK}" stroke-width="2"/>
    <rect class="u5l12-merc" x="-4" y="70" width="8" height="10" fill="${COLORS.red}"/><line x1="-14" x2="14" y1="56" y2="56" stroke="${INK}" stroke-width="2" stroke-dasharray="4 3"/><text x="18" y="61" font-size="14" font-weight="700" fill="${INK}">room</text></g></svg>`;
  const merc = sc.querySelector('.u5l12-merc'), steam = sc.querySelector('.u5l12-steam');
  return (v) => { const t = Math.max(0, Math.min(1, v / 9)); const hh = 4 + t * 64; merc.setAttribute('y', 72 - hh); merc.setAttribute('height', hh + 8); steam.style.opacity = Math.max(0, (v - 2.2) / 6.8); };
}
const KC = { inc: COLORS.green, dec: COLORS.red, con: '#5d6574' }, KW = { inc: 'increasing', dec: 'decreasing', con: 'constant' };
const story = {
  title: 'Read the story, sketch the story',
  height: 470,
  minW: 900,
  choices: [{ v: 'a', label: 'Example 10(a) check' }, { v: 'b', label: 'Example 10(b) check' }],
  intro: (k) => (k === 'a' ? 'Ride along with the cyclist, one piece of the graph at a time. Press <b>Next</b>.' : 'Hot coffee cooling to room temperature: one phrase, one piece. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const SH = 120;
    if (k === 'a') {
      const set = bikeScene(stage, 4, 4, ex.W - 8, SH);
      const G = storyGraph(stage, cycAxes({ x: 4, y: SH + 10, width: ex.W - 8, height: 470 - SH - 14 }));
      const st = { x: 0 };
      const tr = G.curve(() => { const pts = [[0, 0]]; for (const p of CYC) { if (p[0] <= st.x) pts.push(p); else { pts.push([st.x, yAtP(CYC, st.x)]); break; } } return { subs: [pts.map((p) => G.toPx(p[0], p[1]))] }; }, { color: TRACE, width: 5 }, '', G.layers.data);
      const dot = G.point(0, 0, { color: INK, r: 7.5 });
      const go = (x) => { st.x = x; tr._bkDraw(); const v = yAtP(CYC, x); G.moveTo(dot, x, v); set(x, v); };
      go(0);
      const caps = ['<b>Minutes 0–2:</b> the graph <b>rises</b> from 0 to about 15 km/h. The cyclist starts from rest and <b>speeds up steadily</b>.',
        '<b>Minutes 2–5:</b> <b>flat</b> at about 15 km/h. The speed is <b>constant</b>: cruising. (Flat on a speed graph is not stopped!)',
        '<b>Minutes 5–7:</b> the graph <b>falls</b> back to 0. The cyclist <b>slows down steadily and stops</b>.'];
      return caps.map((cap, i) => ({
        cap,
        run: async (c) => {
          const a = CYC[i], b = CYC[i + 1], kk = b[1] > a[1] ? 'inc' : b[1] < a[1] ? 'dec' : 'con';
          await tween(c, 1800, (t) => go(lerp(a[0], b[0], t)), linear);
          const seg = G.segment(a, b, { color: KC[kk], width: 6 });
          await Promise.all([appear(c, seg, 300), fadeIn(c, G.label((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, KW[kk], { pos: kk === 'con' ? 's' : kk === 'inc' ? 'se' : 'sw', cls: 'u5l12-ktag ' + kk, gap: 10 }))]);
        }
      }));
    }
    const LW = 320, GX = LW + 10, GW = ex.W - GX - 4;
    const PH = [['Just poured: the coffee starts <b>hot</b>.', 'start high'], ['It cools <b>quickly</b> at first,', 'steep drop'], ['then more and more <b>slowly</b> as it nears room temperature,', 'flattening'], ['until it <b>reaches</b> room temperature and <b>stays there</b>.', 'flat']];
    const desc = add(stage, box(h('div', 'u5l12-desc', '<div class="u5l12-lead">Temperature of a cup of hot coffee:</div>'), LW, 462), 4, 4);
    const spans = PH.map(([t]) => { const s = h('div', 'u5l12-phase', t); desc.appendChild(s); return s; });
    const set = mugScene(stage, GX, 4, GW, 104);
    const G = storyGraph(stage, { x: GX, y: 112, width: GW, height: 470 - 116, xmin: 0, xmax: 10.6, ymin: 0, ymax: 10.4, grid: false, xt: 'time', yt: 'temperature', pad: [12, 22, 38, 50] });
    set(9);
    const piece = async (c, a, b) => { const el = G.fn(COFFEE, { from: a, to: b, color: SKETCH, width: 5, arrows: false, samples: 100 }); await Promise.all([G.drawIn(el, 1300, c, { easing: 'linear' }), tween(c, 1300, (t) => set(COFFEE(lerp(a, b, t))), linear)]); };
    const tagIt = async (c, i) => { spans.forEach((s, j) => s.classList.toggle('on', j === i)); const t = h('span', 'u5l12-ptag', PH[i][1]); spans[i].appendChild(t); await pop(c, t); };
    return [
      { cap: '“Just poured”: start <b>high</b> on the temperature axis.', run: async (c) => { await tagIt(c, 0); await G.reveal(G.point(0.3, COFFEE(0.3), { color: SKETCH, r: 7 }), c); } },
      { cap: '“Cools quickly at first”: <b>decreasing</b> and <b>steep</b>.', run: async (c) => { await tagIt(c, 1); await piece(c, 0.3, 2); } },
      { cap: '“More and more slowly”: still decreasing, but the curve gets <b>flatter</b>.', run: async (c) => { await tagIt(c, 2); await piece(c, 2, 5); } },
      { cap: '“Reaches room temperature and stays there”: a <b>flat</b> piece. It can’t cool any further.',
        run: async (c) => { await tagIt(c, 3); const rl = G.hline(2, { color: 'gray', width: 2.5 }); await G.drawIn(rl, 500, c); await G.drawIn(G.segment([5, 2], [10, 2], { color: SKETCH, width: 5 }), 900, c); await fadeIn(c, G.label(8.2, 2, 'room temperature', { pos: 'n', cls: 'u5l12-note' })); } }
    ];
  }
};

/* =============================== mount =============================== */
mountStatic();
export const explainers = mountExplainers({ bingo, plane, views, intercepts, shadow, screen, vlt, fwdBack, readGraph, story });

/* ============ Stand Up Break! — unit review: quadrants, f(a), domain and range, intercepts, working backwards, cost models (lessons/js/standup.js) ============ */
const sg = (v) => (v < 0 ? `-${-v}` : `+${v}`);
const lin = (m, b, v = 'x') => `${m === 1 ? '' : m === -1 ? '-' : m}${v}${b ? sg(b) : ''}`;
const quadOf = (x, y) => (x === 0 && y === 0 ? '\\text{the origin}' : x === 0 ? '\\text{on the } y\\text{-axis}' : y === 0 ? '\\text{on the } x\\text{-axis}' : x > 0 ? (y > 0 ? '\\text{Quadrant I}' : '\\text{Quadrant IV}') : (y > 0 ? '\\text{Quadrant II}' : '\\text{Quadrant III}'));
const nz = (r, a, b) => { let v; do { v = r.int(a, b); } while (v === 0); return v; };
const MODELS = [
  ['A bike rental charges', 'per hour', 'h', 'hours'], ['A plumber charges', 'per hour', 'h', 'hours'], ['A bowling alley charges', 'per game', 'g', 'games'],
  ['A climbing gym charges', 'per visit', 'v', 'visits'], ['A tutor charges', 'per lesson', 'n', 'lessons'], ['A car wash charges', 'per car', 'c', 'cars']
];
standup('u5l12', {
  intro: 'Unit review at your whiteboard station: every idea from Unit 5. Show your steps!',
  levels: {
    BEG: (r) => {
      if (r.chance(0.5)) { // quadrants
        const pt = () => (r.chance(0.25) ? (r.chance(0.5) ? [0, nz(r, -9, 9)] : [nz(r, -9, 9), 0]) : [nz(r, -9, 9), nz(r, -9, 9)]);
        const ps = [pt(), pt(), pt()];
        return { q: ps.map(([x, y], i) => `${'PQR'[i]}(${x},\\ ${y})`).join(',\\quad '), text: 'State the quadrant, or the axis, that contains each point.', a: ps.map(([x, y], i) => `${'PQR'[i]}:\\ ${quadOf(x, y)}`) };
      }
      const m = r.pick([2, 3, 4, 5, -2, -3]), b = nz(r, -12, 12), a = r.pick([-3, -2, -1, 2, 3, 4, 5, 6]), v = m * a + b;
      return { q: `f(x)=${lin(m, b)}`, text: `Determine ${T(`f(${a})`)}.`, a: [`f(${a})=${m}(${a})${sg(b)}`, `=${m * a}${sg(b)}`, `=${v}`] };
    },
    PRG: (r) => {
      if (r.chance(0.5)) { // domain and range of pairs, set notation
        for (;;) {
          const n = r.int(4, 5), P = [];
          for (let i = 0; i < n; i++) P.push([r.int(-4, 9), r.int(-4, 9)]);
          const xs = [...new Set(P.map((p) => p[0]))].sort((p, q) => p - q), ys = [...new Set(P.map((p) => p[1]))].sort((p, q) => p - q);
          if (xs.length === n && ys.length === n) continue; // want at least one repeat
          if (new Set(P.map((q) => q.join(','))).size < n) continue; // no repeated pair
          const fn = xs.length === n, pt = ([x, y]) => `(${x},\\ ${y})`;
          return { q: `\\begin{gathered}${P.slice(0, 3).map(pt).join(',\\ ')},\\\\ ${P.slice(3).map(pt).join(',\\ ')}\\end{gathered}`, text: 'State the domain and range, using set notation. Is the relation a function?',
            a: [`D=\\{${xs.join(',\\ ')}\\}`, `R=\\{${ys.join(',\\ ')}\\}`], atext: fn ? 'Function: every input has exactly one output.' : 'Not a function: one input has two different outputs.' };
        }
      }
      const m = r.pick([1, 2, -1, -2]), p = r.pick([-2, -1, 1, 2, 3, 4]), c = -m * p, xs = [-2, -1, 0, 1, 2, 3, 4, 5].filter((x) => x >= Math.min(p, 0) - 1).slice(0, 6);
      if (!xs.includes(p)) xs.push(p);
      xs.sort((u, v) => u - v);
      const tbl = `\\begin{array}{c|${'c'.repeat(xs.length)}}x&${xs.join('&')}\\\\\\hline y&${xs.map((x) => m * x + c).join('&')}\\end{array}`;
      return { q: tbl, text: 'The table shows points on a relation. State the ordered pair of the x-intercept and of the y-intercept.', a: [`x\\text{-intercept: }(${p},\\ 0)\\quad(y=0)`, `y\\text{-intercept: }(0,\\ ${c})\\quad(x=0)`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // backwards
        const m = r.pick([2, 3, 4, 5, 6, -2, -3]), b = nz(r, -15, 15), k = nz(r, -5, 9), v = m * k + b, a = r.pick([-2, -1, 3, 7]);
        return { q: `f(x)=${lin(m, b)}`, text: `(a) Determine ${T(`f(${a})`)}. (b) If ${T(`f(k)=${v}`)}, determine ${T('k')}.`,
          a: [`\\text{(a) } f(${a})=${m}(${a})${sg(b)}=${m * a + b}`, `\\text{(b) } ${lin(m, b, 'k')}=${v}`, `${m}k=${v - b}`, `k=${k}`] };
      }
      const [who, per, v, plural] = r.pick(MODELS), F = r.pick([5, 8, 10, 12, 15, 20, 25, 30]), rt = r.pick([3, 4, 6, 7, 8, 9, 12, 15]), a = r.int(2, 9), n = r.int(3, 12), tot = F + rt * n;
      return { q: `C(${v})=${F}+${rt}${v}`, text: `${who} a $${F} fee plus $${rt} ${per}. (a) Determine ${T(`C(${a})`)}. (b) If ${T(`C(${v})=${tot}`)}, how many ${plural}? (c) State a reasonable domain.`,
        a: [`\\text{(a) } C(${a})=${F}+${rt}(${a})=\\$${F + rt * a}`, `\\text{(b) } ${F}+${rt}${v}=${tot}\\ \\Rightarrow\\ ${rt}${v}=${tot - F}\\ \\Rightarrow\\ ${v}=${n}`, `\\text{(c) } ${v}\\ge 0\\text{ (whole numbers)}`] };
    }
  }
});
