/* Math 15 · Unit 5 · Lesson 2 — Growing Patterns and Types of Variables:
 * the Toothpick Street warm-up (a street you can build), the tile figures, the explainers and the Stand Up Break.
 * Colour code: independent variable amber (#c27a0e), dependent variable purple (#7b4fc4); the new part of a growing
 * pattern amber, the first piece teal-blue. */
import {
  Graph, ValueTable, h, tex, add, box, pop, fadeIn, appear, sleep, tween, svgEl, stamp, stampIn, mountExplainers,
  anim, pulse, COLORS, liveCtx, linear
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const C = COLORS;
const IV = '#c27a0e', DV = '#7b4fc4', FIRST = '#2b55a0';
const ivB = (s) => `<b class="u5l2-ivt">${s}</b>`;
const dvB = (s) => `<b class="u5l2-dvt">${s}</b>`;
const hide = (...els) => { els.forEach((e) => e && (e.style.opacity = 0)); return els[0]; };
const panel = (stage, x, y, w, hh, title, cls = '') => add(stage, box(h('div', 'u5l2-panel ' + cls, title ? `<div class="u5l2-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u5l2-line' + (cls ? ' ' + cls : ''), html); p.appendChild(d); return d; };
const TH = (html) => ({ html: `<span class="u5l2-th">${html}</span>` });

/* ================= toothpicks ================= */
const WOOD = '#e3b25e', WOOD2 = '#a8741f', HEAD = '#c93a33';
/** one toothpick from (x1, y1) to (x2, y2) */
function pick(parent, x1, y1, x2, y2, color) {
  const g = svgEl('g', { class: 'u5l2-pick' }, parent), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, m = 3.5;
  const a = [x1 + ux * m, y1 + uy * m], b = [x2 - ux * m, y2 - uy * m];
  g.edge = svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: WOOD2, 'stroke-width': 7, 'stroke-linecap': 'round' }, g);
  g.body = svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: color || WOOD, 'stroke-width': 4.2, 'stroke-linecap': 'round' }, g);
  svgEl('circle', { cx: b[0], cy: b[1], r: 3.6, fill: HEAD }, g);
  return g;
}
const paint = (picks, color) => [].concat(picks).forEach((p) => p.body.setAttribute('stroke', color));
/** a street of n houses (side L, bottom-left corner x0, y0). Returns { first, houses: [[5 picks]…], all } */
function street(parent, n, x0, y0, L) {
  const g = svgEl('g', { class: 'u5l2-streetg' }, parent), houses = [], hh = L * 0.866;
  for (let i = 0; i < n; i++) {
    const a = x0 + i * L, b = a + L, m = a + L / 2;
    houses.push([pick(g, a, y0, b, y0), pick(g, a, y0 - L, b, y0 - L), pick(g, b, y0, b, y0 - L), pick(g, a, y0 - L, m, y0 - L - hh), pick(g, m, y0 - L - hh, b, y0 - L)]);
  }
  const first = pick(g, x0, y0, x0, y0 - L);
  return { g, first, houses, all: [first, ...houses.flat()] };
}
const sticks = (s) => 5 * s + 1;

/* ================= warm-up: build Toothpick Street ================= */
function mountStreet() {
  const host = document.getElementById('st-svg'); if (!host) return;
  const W = Math.max(520, host.clientWidth || 560), H = 118, L = 50, MAX = 8;
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u5l2-stsvgel' }, host);
  const nEl = document.getElementById('st-n'), cEl = document.getElementById('st-count');
  // table of values (tap the ? cells) and the mini grid
  const tab = document.getElementById('st-tab');
  tab.innerHTML = `<table class="u5l2-tbl u5l2-wtbl"><tr><th>Stage</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>
    <tr><th>Toothpicks</th><td>6</td><td>11</td><td>16</td><td><span data-reveal="?">21</span></td><td><span data-reveal="?">26</span></td></tr>
    <tr class="u5l2-addrow"><th>Added</th><td></td><td><span data-reveal="+?">+5</span></td><td><span data-reveal="+?">+5</span></td><td><span data-reveal="+?">+5</span></td><td><span data-reveal="+?">+5</span></td></tr></table>`;
  const gh = document.getElementById('st-graph');
  const G = new Graph(gh, { width: 210, height: 200, xmin: 0, xmax: 6, ymin: 0, ymax: 30, ystep: 5, ylabels: 10, xtitle: '', ytitle: '', fontSize: 14, pad: [26, 16, 30, 34] });
  G.label(0, 30, 'Toothpicks', { pos: 'ne', cls: 'u5l2-gtitle', gap: 4, dx: 4, clip: false });
  G.label(6, 0, 'Stage', { pos: 'nw', cls: 'u5l2-gtitle', gap: 4, clip: false });
  const dots = [1, 2, 3, 4, 5].map((s) => G.point(s, sticks(s), { color: HEAD, r: 5.5 }));
  let st = 3, tok = 0;
  const draw = async (s, grow) => {
    const my = ++tok, c = liveCtx();
    svg.innerHTML = '';
    const x0 = Math.max(12, (W - s * L) / 2), S = street(svg, s, x0, H - 8, L);
    nEl.textContent = s; cEl.innerHTML = `<b>${sticks(s)}</b> toothpicks`;
    dots.forEach((d, i) => { d.style.opacity = i < Math.min(s, 5) ? 1 : 0; });
    if (grow && s > 1) {
      const nw = S.houses[s - 1]; paint(nw, IV); nw.forEach((p) => { p.style.opacity = 0; });
      for (const p of nw) { if (my !== tok) return; p.style.opacity = 1; await pop(c, p, 260); }
      cEl.innerHTML = `<b>${sticks(s)}</b> toothpicks <span class="u5l2-amb">(+5)</span>`;
    }
  };
  document.querySelectorAll('[data-st]').forEach((b) => b.addEventListener('click', () => {
    const up = b.dataset.st === '+'; const n = Math.max(1, Math.min(MAX, st + (up ? 1 : -1)));
    if (n === st) return; st = n; draw(st, up);
  }));
  draw(st, false);
}

/* ================= tiles ================= */
/** Figure n of the tile pattern: n columns of 2 tiles; returns { g, cols: [[top, bottom]…] } */
function tiles(parent, n, x0, y0, u, o = {}) {
  const g = svgEl('g', { class: 'u5l2-tiles' }, parent), cols = [];
  for (let i = 0; i < n; i++) {
    const col = [0, 1].map((j) => svgEl('rect', { x: x0 + i * u, y: y0 + j * u, width: u, height: u, rx: 2, class: 'u5l2-tile' + (o.red ? ' red' : '') }, g));
    cols.push(col);
  }
  return { g, cols };
}
function tileFigs(host, figs, u, o = {}) {
  const gap = u * 1.6, pad = 10; let W = pad;
  const xs = figs.map((n) => { const x = W; W += n * u + gap; return x; }); W = W - gap + pad;
  const H = 2 * u + 42, svg = svgEl('svg', { class: 'u5l2-tsvg', width: W, height: H, viewBox: `0 0 ${W} ${H}` }, host);
  figs.forEach((n, i) => { tiles(svg, n, xs[i], 8, u, o); const t = svgEl('text', { x: xs[i] + n * u / 2, y: 2 * u + 34, 'text-anchor': 'middle', class: 'u5l2-tcap' + (o.red ? ' red' : '') }, svg); t.textContent = 'Figure ' + n; });
  return svg;
}

/* ================= static figures ================= */
function mountFigures() {
  const f1 = document.getElementById('fig-tiles'); if (f1) tileFigs(f1, [1, 2, 3], 38);
  const f2 = document.getElementById('fig-tiles45'); if (f2) tileFigs(f2, [4, 5], 26, { red: true });
  const e4 = document.getElementById('fig-ex4');
  if (e4) {
    const G = new Graph(e4, { width: 360, height: 400, xmin: 0, xmax: 6.6, ymin: 0, ymax: 15, ystep: 2, ylabels: 2, xtitle: 'n', ytitle: 'T', fontSize: 16, pad: [24, 24, 34, 42] });
    G.segment([0.5, 1], [6.4, 12.8], { color: 'red', width: 2.5, dash: '7 6', cls: 'u5l2-ansdot' });
    [1, 2, 3, 4, 5, 6].forEach((n) => G.point(n, 2 * n, { color: 'red', r: 6.5, cls: 'u5l2-ansdot' }));
  }
  const e5 = document.getElementById('fig-ex5');
  if (e5) {
    const G = new Graph(e5, { width: 360, height: 430, xmin: 0, xmax: 5.6, ymin: 0, ymax: 25, ystep: 1, ylabels: 3, xtitle: 'n', ytitle: 'B', fontSize: 16, pad: [24, 24, 34, 42] });
    G.segment([0.5, 3], [5.4, 22.6], { color: 'red', width: 2.5, dash: '7 6', cls: 'u5l2-ansdot' });
    [1, 2, 3, 4, 5].forEach((n) => G.point(n, 4 * n + 1, { color: 'red', r: 6.5, cls: 'u5l2-ansdot' }));
  }
}

/* ================= explainer: counting the toothpicks in groups ================= */
const streetCount = {
  title: 'Counting toothpicks in groups',
  height: 400,
  minW: 900,
  choices: [{ v: 4, label: 'Stage 4' }, { v: 100, label: 'The big one: Stage 100' }],
  intro: (v) => (v === 100 ? 'Stage <b>100</b>: far too many to count one by one. Count them in <b>groups</b>. Press <b>Next</b>.'
    : 'Stage <b>4</b>: four houses. Don’t count one by one: count in <b>groups</b>. Press <b>Next</b>.'),
  make(stage, v, ex) {
    const W = ex.W, big = v === 100, L = big ? 64 : 84, y0 = 220;
    const svg = add(stage, svgEl('svg', { width: W, height: 260, viewBox: `0 0 ${W} 260` }), 0, 0);
    // big: houses 1–4, a gap with dots, house 100 (drawn as one street of 5 with the 5th moved right)
    const shown = big ? 5 : 4, gapX = big ? 90 : 0, x0 = (W - shown * L - gapX) / 2;
    const S = street(svg, shown, x0, y0, L);
    if (big) {
      S.houses[4].forEach((p) => p.setAttribute('transform', `translate(${gapX} 0)`));
      const dt = svgEl('text', { x: x0 + 4 * L + gapX / 2, y: y0 - L / 2, 'text-anchor': 'middle', class: 'u5l2-dots' }, svg); dt.textContent = '…';
    }
    const head = add(stage, h('div', 'u5l2-mhead', big ? `Stage 100 · <b>100</b> houses · toothpicks = ?` : `Stage 4 · <b>4</b> houses · toothpicks = ?`), 20, 8);
    const one = add(stage, h('div', 'u5l2-onelab', '1'), x0 - 34, y0 - L / 2 - 16); hide(one);
    const labs = S.houses.map((hs, i) => { const d = add(stage, h('div', 'u5l2-grplab', '5'), x0 + i * L + L / 2 + (big && i === 4 ? gapX : 0), y0 + 8); d.style.translate = '-50% 0'; return hide(d); });
    const hn = big ? S.houses.map((_, i) => { const d = add(stage, h('div', 'u5l2-hnum', i === 4 ? '#100' : '#' + (i + 1)), x0 + i * L + L / 2 + (i === 4 ? gapX : 0), y0 - L - L * 0.866 - 30); d.style.translate = '-50% 0'; return d; }) : [];
    void hn;
    const eq = add(stage, box(h('div', 'u5l2-eqrow'), W - 40, 90), 20, 296);
    const put = (html, cls = '') => { const d = h('div', 'u5l2-eq ' + cls, html); eq.appendChild(d); hide(d); return d; };
    const n = v, tot = sticks(n);
    const groups = async (c) => {
      const cols = [IV, DV];
      for (let i = 0; i < S.houses.length; i++) { paint(S.houses[i], cols[i % 2]); if (!c.fast) await Promise.all(S.houses[i].map((p) => pop(c, p, 260))); await fadeIn(c, labs[i], 200); await sleep(c, 120); }
    };
    if (!big) {
      const e1 = put(T(`1+\\textcolor{${IV}}{5}\\times4`), 'eqbig'), e2 = put(T('=1+20')), e3 = put(T(`=\\boldsymbol{${tot}}`), 'eqans');
      return [
        { cap: `Start with the <b>1</b> wall on the far left.`, run: async (c) => { paint(S.first, FIRST); await pulse(c, S.first, 1.25); await pop(c, one); } },
        { cap: `Each house then adds a <b>group of 5</b>: a floor, a ceiling, a right wall and two roof pieces. It borrows its left wall from the house before.`, run: groups },
        { cap: `So Stage 4 uses <b>1</b> plus <b>5 for every house</b>: ${T('1+5\\times4=1+20=21')} toothpicks.`, run: async (c) => { await fadeIn(c, e1); await fadeIn(c, e2); await fadeIn(c, e3); head.innerHTML = `Stage 4 · <b>4</b> houses · toothpicks = <b>21</b>`; await pulse(c, head, 1.06); } },
        { cap: `The table agrees: 6, 11, 16, <b>21</b>. Each stage adds the <b>same amount</b>, 5. That is a <b>growing pattern</b>.`,
          run: async (c) => { const s = stamp(eq, '+5 every stage', { ok: true, size: 'sm' }); await stampIn(c, s); } }
      ];
    }
    const e1 = put(T(`1+\\textcolor{${IV}}{5}\\times100`), 'eqbig'), e2 = put(T('=1+500')), e3 = put(T('=\\boldsymbol{501}'), 'eqans');
    return [
      { cap: `Again, start with the <b>1</b> wall on the far left.`, run: async (c) => { paint(S.first, FIRST); await pulse(c, S.first, 1.25); await pop(c, one); } },
      { cap: `Every house adds a group of <b>5</b>. 100 houses means 100 groups of 5.`, run: groups },
      { cap: `${T('1+5\\times100=1+500=501')} toothpicks. The answer to the big one is <b>B</b>.`, run: async (c) => { await fadeIn(c, e1); await fadeIn(c, e2); await fadeIn(c, e3); head.innerHTML = `Stage 100 · <b>100</b> houses · toothpicks = <b>501</b>`; await pulse(c, head, 1.06); } },
      { cap: `Why not 600? That counts <b>6</b> per house, but each house <b>shares</b> a wall with its neighbour. And 500 forgets the very first wall.`,
        run: async (c) => { const s = stamp(eq, '✓ B: 501', { ok: true, size: 'sm' }); await stampIn(c, s); } }
    ];
  }
};

/* ================= explainer: the tile pattern grows ================= */
const growTiles = {
  title: 'The tile pattern grows by one column',
  height: 400,
  minW: 900,
  intro: 'Example 1 check. Figure 1 is one column of <b>2 tiles</b>. Watch what each new figure adds. Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, u = 30, gap = 34, ns = [1, 2, 3, 4, 5, 6];
    const tot = ns.reduce((a, n) => a + n * u, 0) + gap * 5; let x = (W - tot) / 2;
    const svg = add(stage, svgEl('svg', { width: W, height: 130, viewBox: `0 0 ${W} 130` }), 0, 14);
    const figs = ns.map((n) => {
      const f = tiles(svg, n, x, 14, u), t = svgEl('text', { x: x + n * u / 2, y: 14 + 2 * u + 30, 'text-anchor': 'middle', class: 'u5l2-tcap' }, svg);
      t.textContent = 'Figure ' + n; f.cap = t; x += n * u + gap; hide(f.g, t); return f;
    });
    const tw = 230 + 6 * 76;
    const tb = new ValueTable(stage, { x: (W - tw) / 2, y: 168, layout: 'h', headers: [TH('Figure number, ' + T('n')), TH('Tiles, ' + T('T'))],
      rows: ns.map((n) => [n, 2 * n]), hide: 1, tap: false, cellW: 76, cellH: 52, headW: 230, diffs: true, diffSpace: 70 });
    const show = async (c, k) => {
      const f = figs[k - 1], nw = f.cols[k - 1];
      if (k > 1) nw.forEach((r) => r.classList.add('new'));
      f.g.style.opacity = 1; hide(...f.cols.flat(), f.cap);
      await Promise.all([fadeIn(c, f.cap, 300), ...f.cols.slice(0, k - 1).flat().map((r) => appear(c, r, 300))]);
      for (const r of nw) { await pop(c, r, 280); await sleep(c, 80); }
      await tb.reveal(k - 1, 1, c);
    };
    return [
      { cap: `<b>Figure 1:</b> one column of 2 tiles. <b>2</b> tiles.`, run: (c) => show(c, 1) },
      { cap: `<b>Figure 2:</b> Figure 1 plus <b>one new column</b> (amber): ${T('2+2=4')} tiles.`, run: (c) => show(c, 2) },
      { cap: `<b>Figure 3:</b> one more column again: ${T('4+2=6')} tiles.`, run: (c) => show(c, 3) },
      { cap: `<b>Example 1 (a) check:</b> Figures 4 and 5 each add one more column: <b>8</b> and <b>10</b> tiles.`, run: async (c) => { await show(c, 4); await show(c, 5); } },
      { cap: `<b>(b)</b> Figure 6 has 6 columns of 2: ${T('6\\times2=12')} tiles.`, run: (c) => show(c, 6) },
      { cap: `<b>(c)</b> Each new figure adds one column of 2 tiles, so the count goes up by <b>2</b> every time: a <b>constant amount</b>.`, run: (c) => tb.diffs(c, { col: 1 }) }
    ];
  }
};

/* ================= explainer: a table of values and its differences ================= */
const TD = {
  ex2: { label: 'Example 2 check', hn: 'Figure number, ' + T('n'), hv: 'Tiles, ' + T('T'), a: 2, d: 2, n: 6, ext: 10, unit: 'tiles', thing: 'Figure' },
  ex5: { label: 'Example 5 (a) and (b) check', hn: 'Bed number, ' + T('n'), hv: 'Boards, ' + T('B'), a: 5, d: 4, n: 5, unit: 'boards', thing: 'Bed' },
  street: { label: 'Toothpick Street', hn: 'Stage', hv: 'Toothpicks', a: 6, d: 5, n: 5, unit: 'toothpicks', thing: 'Stage' }
};
const tableDiffs = {
  title: 'Fill the table, then find the constant amount',
  height: 330,
  minW: 900,
  choices: Object.keys(TD).map((k) => ({ v: k, label: TD[k].label })),
  intro: (k) => `Start with the first value, then add the same amount each time. Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = TD[k], W = ex.W, f = (n) => d.a + d.d * (n - 1), cw = 66, hw = 200;
    const cols = d.ext || d.n, tw = hw + cols * cw;
    const tb = new ValueTable(stage, { x: Math.max(10, (W - tw) / 2), y: 40, layout: 'h', headers: [TH(d.hn), TH(d.hv)],
      rows: Array.from({ length: d.n }, (_, i) => [i + 1, f(i + 1)]), hide: (r, c) => c === 1 && r > 0, tap: false, cellW: cw, cellH: 58, headW: hw, diffs: true, diffSpace: 70, cls: 'u5l2-bigtab' });
    const note = add(stage, box(h('div', 'u5l2-note'), W - 40, 80), 20, 240);
    const say = (c, html) => { note.innerHTML = html; return fadeIn(c, note, 300); };
    const steps = [
      { cap: `${d.thing} 1 has <b>${d.a}</b> ${d.unit}.`, run: async (c) => { tb.highlight(0, true); await sleep(c, 300); tb.highlight(0, false); } },
      { cap: `Each new ${d.thing.toLowerCase()} adds <b>${d.d}</b>: ${Array.from({ length: d.n }, (_, i) => f(i + 1)).join(', ')}.`, run: (c) => tb.fill(c, { col: 1 }) },
      { cap: `The <b>difference</b> between neighbours is always <b>+${d.d}</b>: the pattern grows by a <b>constant amount</b>.`, run: async (c) => { await tb.diffs(c, { col: 1 }); await say(c, k === 'ex5' ? `<b>(b)</b> It starts at <b>5 boards</b> and adds <b>4 more</b> for every extra bed.` : `Starts at <b>${d.a}</b>, adds <b>${d.d}</b> each time.`); } }
    ];
    if (d.ext) {
      steps.push({ cap: `<b>(c)</b> Keep going past Figure ${d.n}: ${Array.from({ length: d.ext - d.n }, (_, i) => f(d.n + i + 1)).join(', ')}. Figure ${d.ext} has <b>${f(d.ext)}</b> ${d.unit}.`,
        run: async (c) => {
          tb.clearDiffs();
          for (let n = d.n + 1; n <= d.ext; n++) await tb.addRow([n, f(n)], c);
          await tb.fill(c, { col: 1 }); await tb.diffs(c, { col: 1, ms: 200, stagger: 40 });
          tb.highlight(d.ext - 1, true); await say(c, `Figure ${d.ext}: <b>${f(d.ext)}</b> ${d.unit} (${d.ext} columns of 2).`);
        } });
    }
    return steps;
  }
};

/* ================= explainer: cause and effect (adapted from Math 10C 5.2) ================= */
const ICONS = {
  book: '<rect x="14" y="8" width="36" height="48" rx="3" fill="#7b9fd6" stroke="#1e2d46" stroke-width="3"/><path d="M20 8v48" stroke="#1e2d46" stroke-width="2.5"/><path d="M27 20h16M27 28h16" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
  coin: '<circle cx="32" cy="32" r="22" fill="#f6c445" stroke="#b07a12" stroke-width="3"/><circle cx="32" cy="32" r="15" fill="none" stroke="#b07a12" stroke-width="2"/><text x="32" y="40" text-anchor="middle" font-size="22" font-weight="800" fill="#7a4a1e">$</text>',
  house: '<path d="M12 30L32 12L52 30" fill="none" stroke="#a8741f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 30v24h32V30" fill="none" stroke="#a8741f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 30h32" stroke="#a8741f" stroke-width="5" stroke-linecap="round"/><text x="32" y="50" text-anchor="middle" font-size="15" font-weight="800" fill="#1e2d46">#</text>',
  picks: '<g stroke-linecap="round"><path d="M10 50L54 14" stroke="#a8741f" stroke-width="7"/><path d="M10 50L54 14" stroke="#e3b25e" stroke-width="4"/><path d="M10 34L54 34" stroke="#a8741f" stroke-width="7"/><path d="M10 34L54 34" stroke="#e3b25e" stroke-width="4"/><path d="M14 16L50 52" stroke="#a8741f" stroke-width="7"/><path d="M14 16L50 52" stroke="#e3b25e" stroke-width="4"/></g><circle cx="54" cy="14" r="4" fill="#c93a33"/><circle cx="54" cy="34" r="4" fill="#c93a33"/><circle cx="50" cy="52" r="4" fill="#c93a33"/>',
  fig: '<rect x="8" y="16" width="48" height="32" rx="4" fill="#fff" stroke="#1e2d46" stroke-width="3"/><text x="32" y="39" text-anchor="middle" font-size="17" font-weight="800" fill="#1e2d46">Fig n</text>',
  tiles: '<g fill="#bcd3f2" stroke="#1e2d46" stroke-width="2.5"><rect x="6" y="18" width="14" height="14"/><rect x="6" y="32" width="14" height="14"/><rect x="20" y="18" width="14" height="14"/><rect x="20" y="32" width="14" height="14"/><rect x="34" y="18" width="14" height="14"/><rect x="34" y="32" width="14" height="14"/></g>'
};
const icon = (k, s = 64) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true">${ICONS[k]}</svg>`;
const CE = {
  books: { label: 'Notebooks at $2 each', A: { n: 'total cost ($)', s: 'the total cost', ic: 'coin', ax: 'total cost' }, B: { n: 'number of notebooks', s: 'the number of notebooks', ic: 'book', ax: 'notebooks' }, dep: 'A',
    tests: [['Does the total cost depend on the number of notebooks?', true, 'Yes: more notebooks cost more.'], ['Does the number of notebooks depend on the total cost?', false, 'No: you decide how many to buy.']] },
  street: { label: 'Toothpick Street', A: { n: 'stage number', s: 'the stage number', ic: 'house', ax: 'stage' }, B: { n: 'number of toothpicks', s: 'the number of toothpicks', ic: 'picks', ax: 'toothpicks' }, dep: 'B',
    tests: [['Does the stage depend on the number of toothpicks?', false, 'No: you choose which stage to build.'], ['Does the number of toothpicks depend on the stage?', true, 'Yes: a bigger stage needs more toothpicks.']] },
  tiles: { label: 'The tiles: n and T', A: { n: `number of tiles, ${T('T')}`, s: `the number of tiles ${T('T')}`, ic: 'tiles', ax: 'tiles, T' }, B: { n: `figure number, ${T('n')}`, s: `the figure number ${T('n')}`, ic: 'fig', ax: 'figure, n' }, dep: 'A',
    tests: [['Does the number of tiles depend on the figure number?', true, 'Yes: Figure 6 has more tiles than Figure 2.'], ['Does the figure number depend on the number of tiles?', false, 'No: you pick the figure to look at.']] }
};
const causeEffect = {
  title: 'Which one depends on the other?',
  height: 424,
  minW: 900,
  choices: Object.keys(CE).map((k) => ({ v: k, label: CE[k].label })),
  intro: 'Two quantities that change together. Which one <b>depends on</b> the other? Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = CE[k], W = ex.W, cw = 220, chh = 172, xA = 18, xB = 330, yC = 44;
    const card = (q, x) => {
      const el = add(stage, box(h('div', 'u5l2-qcard', `<div class="u5l2-qic">${icon(q.ic, 72)}</div><div class="u5l2-qname">${q.n}</div><div class="u5l2-meter"><i class="u5l2-mfill"></i><i class="u5l2-mknob"></i></div>`), cw, chh), x, yC);
      el.style.opacity = 0; return el;
    };
    const cA = card(d.A, xA), cB = card(d.B, xB);
    const dep = d.dep === 'A' ? cA : cB, ind = d.dep === 'A' ? cB : cA, swap = d.dep === 'A';
    const fdep = (u) => 0.12 + 0.8 * u;
    const setM = (el, v) => { el.querySelector('.u5l2-mfill').style.width = (v * 100).toFixed(1) + '%'; el.querySelector('.u5l2-mknob').style.left = (v * 100).toFixed(1) + '%'; };
    const u0 = 0.1; setM(ind, u0); setM(dep, fdep(u0));
    dep.classList.add('u5l2-q-dep'); ind.classList.add('u5l2-q-ind');
    const arr = add(stage, h('div', 'u5l2-ce-arrow', `<svg viewBox="0 0 80 40" width="80" height="40"><path d="M4 20H62" stroke="${FIRST}" stroke-width="5" stroke-linecap="round"/><path d="M76 20L60 10V30Z" fill="${FIRST}"/></svg><b>decides</b>`), xA + cw + 6, yC + 52); arr.style.opacity = 0;
    const P = panel(stage, 18, 226, 532, 190, 'Test it both ways', 'u5l2-tests');
    const gx = Math.max(W - 400, 566), indQ = d.dep === 'A' ? d.B : d.A, depQ = d.dep === 'A' ? d.A : d.B;
    const G = new Graph(stage, { x: gx, y: 12, width: Math.min(386, W - gx - 12), height: 400, xmin: 0, xmax: 10, ymin: 0, ymax: 10, grid: false, numbers: false, xtitle: `\\textcolor{${IV}}{\\text{${indQ.ax}}}`, ytitle: `\\textcolor{${DV}}{\\text{${depQ.ax}}}` });
    G.el.style.opacity = 0;
    const X = (u) => 1 + 8 * (u - 0.1) / 0.8, Y = (u) => 10 * fdep(u);
    const dots = [];
    const testLine = (t) => { const row = line(P, `<span class="u5l2-tq">${t[0]}</span><span class="u5l2-tw">${t[2]}</span>`, 'u5l2-test'); const s = stamp(row, t[1] ? '✓' : '✗', { ok: t[1], size: 'sm', rotate: -4 }); s.classList.add('u5l2-tst'); return { row, s }; };
    const indName = indQ.s, depName = depQ.s;
    return [
      { cap: `Two quantities that change together: <b>${d.A.s}</b> and <b>${d.B.s}</b>.`,
        run: async (c) => { await Promise.all([pop(c, cA), pop(c, cB, 380, { delay: 120 })]); } },
      { cap: `Test it one way: ${d.tests[0][0]} ${d.tests[0][2]}`,
        run: async (c) => { const t = testLine(d.tests[0]); await fadeIn(c, t.row); await stampIn(c, t.s); } },
      { cap: `Now the other way: ${d.tests[1][0]} ${d.tests[1][2]}`,
        run: async (c) => { const t = testLine(d.tests[1]); await fadeIn(c, t.row); await stampIn(c, t.s); } },
      { cap: `So ${dvB(depName)} is the ${dvB('dependent variable')} (it results), and ${ivB(indName)} is the ${ivB('independent variable')} (you choose it).` + (swap ? ' The one you choose goes <b>first</b>: swap them.' : ''),
        run: async (c) => {
          if (swap) await Promise.all([anim(c, cA, [{ transform: 'translateX(0px)' }, { transform: `translateX(${xB - xA}px)` }], 700), anim(c, cB, [{ transform: 'translateX(0px)' }, { transform: `translateX(${xA - xB}px)` }], 700)]);
          ind.classList.add('on'); dep.classList.add('on');
          const ti = add(stage, box(h('div', 'u5l2-role u5l2-role-i', 'independent · you choose'), cw, 30), xA, 8), td = add(stage, box(h('div', 'u5l2-role u5l2-role-d', 'dependent · it results'), cw, 30), xB, 8);
          await Promise.all([fadeIn(c, ti), fadeIn(c, td)]);
          await fadeIn(c, arr, 350, { from: 'translateX(-16px)' });
        } },
      { cap: `Change the one you choose and the other follows. On a graph the <b>independent</b> variable goes on the <b>horizontal</b> axis and the dependent on the <b>vertical</b> axis.`,
        run: async (c) => {
          await fadeIn(c, G.el);
          await tween(c, 2400, (t) => {
            const u = u0 + 0.8 * t; setM(ind, u); setM(dep, fdep(u));
            const k2 = Math.floor(t * 5 + 1e-9);
            while (dots.length < Math.min(5, k2 + 1)) { const v = u0 + 0.8 * dots.length / 4; dots.push(G.point(X(v), Y(v), { color: FIRST, r: 7 })); }
          }, linear);
        } }
    ];
  }
};

/* ================= explainer: "based on" — sort the variables ================= */
const SV = {
  ex3: { label: 'Example 3 check', items: [
    ['(a)', 'The temperature of an oven while it preheats', 'the number of minutes since it was turned on', 'time in minutes', 'oven temperature'],
    ['(b)', 'The distance a cyclist has travelled', 'the number of hours cycling at a steady speed', 'hours cycling', 'distance travelled'],
    ['(c)', 'The height remaining on a candle', 'the number of hours it has been burning', 'hours burning', 'candle height'],
    ['(d)', 'The total cost of a taxi ride', 'the number of kilometres travelled', 'kilometres travelled', 'total cost']] },
  try: { label: 'Try three more', items: [
    ['', 'The cost of a pizza', 'the number of toppings', 'number of toppings', 'cost of the pizza'],
    ['', 'The height of a sunflower', 'the number of weeks since it was planted', 'weeks since planting', 'sunflower height'],
    ['', 'A phone’s battery level', 'the number of minutes it has been charging', 'minutes charging', 'battery level']] }
};
const sortVars = {
  title: 'Independent or dependent? Look for “based on”',
  height: 450,
  minW: 900,
  choices: Object.keys(SV).map((k) => ({ v: k, label: SV[k].label })),
  intro: (k) => (k === 'ex3' ? 'Example 3: read each sentence. Which quantity do you <b>choose</b>? Press <b>Next</b>.'
    : 'Read each sentence. Guess first: which one do you <b>choose</b>? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const W = ex.W, items = SV[k].items;
    const sent = add(stage, box(h('div', 'u5l2-sent'), W - 40, 104), 20, 8);
    const bw = (W - 60) / 2, by = 128, bh = 314;
    const bins = [['Independent', 'you choose it · first row · x-axis', 'u5l2-binI', 20], ['Dependent', 'it results · second row · y-axis', 'u5l2-binD', 40 + bw]].map(([t, s, cls, x]) =>
      add(stage, box(h('div', 'u5l2-bin ' + cls, `<div class="u5l2-binh"><b>${t}</b> <span>${s}</span></div>`), bw, bh), x, by));
    const steps = [];
    items.forEach(([tag, depS, indS, ind, dep]) => {
      steps.push({ cap: `${tag ? '<b>' + tag + '</b> ' : ''}${depS}, based on ${indS}. Which one do you <b>choose</b>?`,
        run: async (c) => { sent.innerHTML = `${tag ? `<b>${tag}</b> ` : ''}<span class="u5l2-sd">${depS}</span>, <b class="u5l2-bo">based on</b> <span class="u5l2-si">${indS}</span>.`; await fadeIn(c, sent, 350); } });
      steps.push({ cap: `After “based on” comes ${ivB(ind)}: the <b>independent</b> variable. It decides ${dvB(dep)}, the <b>dependent</b> variable.`,
        run: async (c) => {
          sent.classList.add('on'); await sleep(c, 250);
          const a = add(bins[0], h('div', 'u5l2-chip i', `${tag ? tag + ' ' : ''}${ind}`), null), b = add(bins[1], h('div', 'u5l2-chip d', `${tag ? tag + ' ' : ''}${dep}`), null);
          await pop(c, a, 320); await pop(c, b, 320); sent.classList.remove('on');
        } });
    });
    steps.push({ cap: `The quantity after “based on” is the one that changes first: the <b>independent</b> variable. The other one <b>depends</b> on it.`,
      run: async (c) => { await Promise.all(bins.map((b) => pulse(c, b, 1.02))); } });
    return steps;
  }
};

/* ================= explainer: table → points on a grid ================= */
const PTB = {
  ex4: { label: 'Example 4 check', hn: 'n', hv: 'T', pts: [1, 2, 3, 4, 5, 6].map((n) => [n, 2 * n]), win: { xmax: 7, ymax: 14, ystep: 2, ylabels: 2 }, d: 2, line: true },
  ex5: { label: 'Example 5 (c) and (d) check', hn: 'n', hv: 'B', pts: [1, 2, 3, 4, 5].map((n) => [n, 4 * n + 1]), win: { xmax: 6, ymax: 24, ystep: 1, ylabels: 3 }, d: 4, line: true },
  curve: { label: 'Not a constant amount', hn: 'n', hv: 'D', pts: [[1, 1], [2, 3], [3, 6], [4, 10], [5, 15]], win: { xmax: 6, ymax: 16, ystep: 1, ylabels: 2 }, line: false }
};
const plotTable = {
  title: 'Each column is an ordered pair',
  height: 470,
  minW: 900,
  choices: Object.keys(PTB).map((k) => ({ v: k, label: PTB[k].label })),
  intro: (k) => (k === 'curve' ? 'A pattern that adds <b>1, then 2, then 3</b>… Does it line up too? Press <b>Next</b>.'
    : 'Turn each column of the table into a point: the top number across, the bottom number up. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = PTB[k], W = ex.W, P = d.pts;
    const G = new Graph(stage, Object.assign({ x: 10, y: 6, width: 440, height: 458, xmin: 0, ymin: 0, xtitle: d.hn, ytitle: d.hv, fontSize: 16 }, d.win));
    const tb = new ValueTable(stage, { x: 476, y: 14, layout: 'h', headers: [d.hn, d.hv], rows: P, tap: false, cellW: 60, cellH: 50, headW: 54, diffs: k === 'curve', diffSpace: 60 });
    const Pn = panel(stage, 476, 196, W - 490, 262, k === 'curve' ? 'Does it line up?' : 'Ordered pairs');
    const pairs = add(Pn, h('div', 'u5l2-pairs'), null);
    const pts = [];
    const plotOne = async (c, i, slow) => {
      const [x, y] = P[i]; tb.highlight(i, true);
      if (slow) {
        const a = G.segment([0, 0], [x, 0], { color: IV, width: 4.5, arrowB: true }), b = G.segment([x, 0], [x, y], { color: DV, width: 4.5, arrowB: true });
        await G.drawIn(a, 400, c); await G.drawIn(b, 500, c);
        const p = G.point(x, y, { color: 'blue', r: 7.5, coords: true, pos: 'nw', labelColor: 'ink' }); pts.push(p); await G.reveal(p, c);
        await sleep(c, 400); G.remove(a, b);
      } else { const p = G.point(x, y, { color: 'blue', r: 7.5 }); pts.push(p); await G.reveal(p, c); }
      await fadeIn(c, add(pairs, h('span', 'u5l2-pr', T(`(${x},\\ ${y})`)), null), 200); tb.highlight(i, false);
    };
    const steps = [
      { cap: `The first column, ${T(`${d.hn}=${P[0][0]}`)} and ${T(`${d.hv}=${P[0][1]}`)}, is the ordered pair ${T(`(${P[0][0]},\\ ${P[0][1]})`)}: over <b>${P[0][0]}</b>, up <b>${P[0][1]}</b>.`, run: (c) => plotOne(c, 0, true) },
      { cap: `Plot the other columns the same way: ${P.slice(1).map((p) => T(`(${p[0]},\\ ${p[1]})`)).join(', ')}.`, run: async (c) => { for (let i = 1; i < P.length; i++) await plotOne(c, i, false); } }
    ];
    if (d.line) {
      const [x1, y1] = P[0], [x2, y2] = P[P.length - 1], m = d.d;
      steps.push({ cap: `Every step of <b>1 to the right</b> goes <b>${m} up</b>, because the table grows by ${m} each time.`,
        run: async (c) => {
          for (let i = 0; i < P.length - 1; i++) {
            const a = G.segment(P[i], [P[i + 1][0], P[i][1]], { color: IV, width: 4 }), b = G.segment([P[i + 1][0], P[i][1]], P[i + 1], { color: DV, width: 4, arrowB: true });
            await G.drawIn(a, 220, c); await G.drawIn(b, 260, c);
          }
          await fadeIn(c, line(Pn, `1 right, <b>${m} up</b> each time`, 'u5l2-hl'));
        } });
      steps.push({ cap: `So the points <b>line up</b> in a straight row. ${k === 'ex4' ? 'Example 4 (b): yes.' : 'Example 5 (d): yes.'} The dots are not joined: there is no Figure 2½.`,
        run: async (c) => {
          const dx = 0.6, s = G.segment([x1 - dx, y1 - m * dx], [x2 + dx, y2 + m * dx], { color: 'gray', width: 3, dash: true }); await G.drawIn(s, 900, c);
          const st = stamp(Pn, 'they line up', { ok: true, size: 'sm' }); st.style.alignSelf = 'center'; await stampIn(c, st);
        } });
    } else {
      steps.push({ cap: `The table adds <b>2, 3, 4, 5</b>: a different amount each time. That is <b>not</b> a constant amount.`, run: (c) => tb.diffs(c, { col: 1 }) });
      steps.push({ cap: `The points bend upward: they do <b>not</b> line up. Only a pattern that grows by a <b>constant amount</b> makes points in a straight row.`,
        run: async (c) => {
          const s = G.segment([1, 1], [5, 15], { color: 'gray', width: 3, dash: true }); await G.drawIn(s, 700, c);
          const st = stamp(Pn, '✗ not a straight row', { ok: false, size: 'sm' }); st.style.alignSelf = 'center'; await stampIn(c, st);
        } });
    }
    return steps;
  }
};

/* ================= mount ================= */
mountStreet();
mountFigures();
export const explainers = mountExplainers({ streetCount, growTiles, tableDiffs, causeEffect, sortVars, plotTable });

/* ============ Stand Up Break! — growing patterns, tables, independent and dependent (lessons/js/standup.js) ============ */
const SU_THINGS = [['tiles', 'Figure'], ['dots', 'Figure'], ['toothpicks', 'Stage'], ['blocks', 'Stage'], ['beads', 'Step'], ['chairs', 'Row'], ['stickers', 'Page'], ['cups', 'Stack']];
const suRow = (label, vals) => `\\text{${label}} & ${vals.join(' & ')}`;
const suTable = (h1, h2, xs, ys) => `\\begin{array}{|l|${xs.map(() => 'c').join('|')}|}\\hline ${suRow(h1, xs)}\\\\ \\hline ${suRow(h2, ys)}\\\\ \\hline\\end{array}`;
const SU_SIT = [ // [what you choose, what results, the story, the question for N, the answer for N]
  ['number of games bowled', 'total cost (\\$)', (a, d) => `A bowling alley charges <b>$${a - d}</b> for shoes plus <b>$${d}</b> for each game.`, (N) => `the total cost of ${N} games`, (N, v) => `${N}\\text{ games: } \\$${v}`],
  ['number of weeks', 'money saved (\\$)', (a, d) => `Kai has <b>$${a}</b> saved after week 1 and adds <b>$${d}</b> every week.`, (N) => `how much Kai has saved after ${N} weeks`, (N, v) => `${N}\\text{ weeks: } \\$${v}`],
  ['number of tables', 'number of seats', (a, d) => `One table seats <b>${a}</b> people. Each extra table pushed onto the end adds <b>${d}</b> more seats.`, (N) => `the number of seats at ${N} tables`, (N, v) => `${N}\\text{ tables: } ${v}\\text{ seats}`],
  ['number of hours', 'height of the tower (cm)', (a, d) => `A Lego tower is <b>${a} cm</b> tall after hour 1 and grows <b>${d} cm</b> every hour.`, (N) => `the height after ${N} hours`, (N, v) => `${N}\\text{ hours: } ${v}\\text{ cm}`]
];
standup('u5l2', {
  intro: 'Make a table at your whiteboard station. Find the constant amount first, then keep going.',
  levels: {
    BEG: (r) => { // complete a table from words
      const [thing, fig] = r.pick(SU_THINGS), a = r.int(2, 9), d = r.int(2, 6), f = (n) => a + d * (n - 1);
      return { q: '', text: `${fig} 1 has <b>${a}</b> ${thing}. Each new ${fig.toLowerCase()} has <b>${d}</b> more ${thing}. Make a table of values for ${fig}s 1 to 5. How many ${thing} are in ${fig} 5?`,
        a: [suTable(fig, thing, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5].map(f)), `\\text{${fig} 5 has } ${f(5)} \\text{ ${thing}}`] };
    },
    PRG: (r) => { // find the constant amount from a table and extend it
      const [thing, fig] = r.pick(SU_THINGS), a = r.int(1, 12), d = r.int(2, 9), N = r.int(7, 12), f = (n) => a + d * (n - 1);
      return { q: suTable(fig, thing, [1, 2, 3, 4], [1, 2, 3, 4].map(f)), text: `How many ${thing} are added each time? Describe the pattern in words, then continue it to find ${fig} ${N}.`,
        a: [`+${d} \\text{ each time: starts at } ${a} \\text{ and adds } ${d}`, `${Array.from({ length: N - 4 }, (_, i) => f(i + 5)).join(',\\ ')}`, `\\text{${fig} ${N}: } ${f(N)}`] };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // which figure has exactly V?
        const [thing, fig] = r.pick(SU_THINGS), a = r.int(2, 10), d = r.int(3, 8), K = r.int(8, 15), f = (n) => a + d * (n - 1), V = f(K);
        return { q: suTable(fig, thing, [1, 2, 3], [1, 2, 3].map(f)), text: `Which ${fig.toLowerCase()} has exactly <b>${V}</b> ${thing}?`,
          a: [`+${d} \\text{ each time}`, `${V}-${a}=${V - a},\\quad ${V - a}\\div${d}=${K - 1}\\text{ more steps}`, `\\text{${fig} } 1+${K - 1}=${K}`] };
      }
      const [ind, dep, say, ask, ans] = r.pick(SU_SIT), d = r.int(2, 6), a = d + r.int(3, 9), f = (n) => a + d * (n - 1), N = r.int(6, 10);
      return { q: '', text: `${say(a, d)} Name the <b>independent</b> and <b>dependent</b> variables. Make a table for 1 to 5, then find ${ask(N)}.`,
        a: [`\\text{Independent: ${ind}};\\ \\text{dependent: ${dep}}`, suTable(ind.replace('number of ', ''), dep, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5].map(f)), ans(N, f(N))] };
    }
  }
});
