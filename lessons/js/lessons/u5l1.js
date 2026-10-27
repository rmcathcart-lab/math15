/* Math 15 · Unit 5 · Lesson 1 — The Cartesian Plane and Plotting Points:
 * the Treasure Island warm-up (a map you can dig on), the static figures, the explainers, the Math History fly and the
 * Stand Up Break. Colours: "over" moves amber, "up or down" moves purple, plotted points blue/ink, answers red.
 * Quadrant tints: I green, II amber, III purple, IV blue. */
import {
  Graph, ValueTable, h, tex, add, box, pop, fadeIn, appear, sleep, tween, pairTex, texNum, svgEl,
  stamp, stampIn, mountExplainers, anim, pulse, COLORS, arrowHead, drawIn, liveCtx
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const C = COLORS;
const PT = (x, y) => T(pairTex(x, y));
const NPT = (n, x, y) => T(`${n}(${texNum(x)},\\ ${texNum(y)})`);
const mns = (n) => String(n).replace('-', '−');
const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u5l1-panel', title ? `<div class="u5l1-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u5l1-line' + (cls ? ' ' + cls : ''), html); p.appendChild(d); return d; };
const hide = (...els) => { els.forEach((e) => e && (e.style.opacity = 0)); return els[0]; };
const quadOf = (x, y) => (x === 0 || y === 0 ? 0 : x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3));
const ROMAN = ['', 'I', 'II', 'III', 'IV'];
const QCOL = [null, C.green, C.amber, C.purple, C.blue];
const where = (x, y) => {
  const q = quadOf(x, y); if (q) return `in <b>Quadrant ${ROMAN[q]}</b>`;
  if (x === 0 && y === 0) return 'at the <b>origin</b> (no quadrant)';
  return x === 0 ? `<b>on the ${T('y')}-axis</b> (no quadrant)` : `<b>on the ${T('x')}-axis</b> (no quadrant)`;
};
const OVER = (x) => (x > 0 ? `right ${x}` : x < 0 ? `left ${-x}` : 'no move over');
const UPDOWN = (y) => (y > 0 ? `up ${y}` : y < 0 ? `down ${-y}` : 'no move up or down');
const TH = (html) => ({ html: `<span class="u5l1-th">${html}</span>` });
const sgn = (v) => (v > 0 ? '+' : v < 0 ? '-' : '0');
const sword = (v) => (v > 0 ? 'positive' : v < 0 ? 'negative' : 'zero');
/** a plain grid like the booklet's: −n…n, numbers on every line (or none) */
const plainGrid = (host, o = {}) => new Graph(host, Object.assign({ width: 360, height: 360, xmin: -5.6, xmax: 5.6, ymin: -5.6, ymax: 5.6, xlabels: 1, ylabels: 1, fontSize: 14 }, o));
/** a quadrant tint rectangle on the background layer */
function tint(G, q, op = 0.1) {
  const w = G.win, a = q === 1 || q === 4 ? 0 : w.xmin, b = q === 1 || q === 4 ? w.xmax : 0, c = q < 3 ? 0 : w.ymin, d = q < 3 ? w.ymax : 0;
  const [x0, y0] = G.toPx(a, d), [x1, y1] = G.toPx(b, c);
  return svgEl('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: QCOL[q], 'fill-opacity': op }, G.layers.bg);
}
const qCentre = (G, q, s = 0.5) => { const w = G.win; return [(q === 1 || q === 4 ? w.xmax : w.xmin) * s, (q < 3 ? w.ymax : w.ymin) * s]; };

/* ================= Treasure Island warm-up ================= */
const D2R = Math.PI / 180;
const ISL = (t) => 6.6 + 0.3 * Math.sin((3 * t + 150) * D2R) + 0.2 * Math.cos(5 * t * D2R);
const onIsland = (x, y) => Math.hypot(x, y) <= ISL(Math.atan2(y, x) / D2R) - 0.2;
const LAND = { '4,2': 'the <b>lighthouse</b>', '-4,-2': 'the <b>palm tree</b>', '2,-4': 'the <b>cave</b>', '0,0': 'the <b>campfire</b>' };
const XS = [['A', 5, -3], ['B', 3, 5], ['C', -3, 5], ['D', -5, 3]];
const TRAP = { A: 'the numbers were <b>swapped</b>', B: 'the <b>negative was ignored</b>', D: 'went <b>5 left</b> first (swapped)' };
const moves = (x, y) => `<b class="u5l1-amb">${OVER(x)}</b>, then <b class="u5l1-pur">${UPDOWN(y)}</b>`;

/* small map icons, drawn in units of one grid square (y down) */
function icon(G, kind, x, y, parent) {
  const U = G.ux, [px, py] = G.toPx(x, y), g = svgEl('g', { transform: `translate(${px} ${py}) scale(${U})`, class: 'u5l1-ic' }, parent);
  const P = (pts, attrs) => svgEl('polygon', Object.assign({ points: pts.map((p) => p.join(',')).join(' ') }, attrs), g);
  const ink = '#1e2d46', lw = 0.035;
  if (kind === 'lighthouse') {
    P([[-0.28, 0.3], [0.28, 0.3], [0.18, -0.55], [-0.18, -0.55]], { fill: '#fff', stroke: ink, 'stroke-width': lw });
    P([[-0.25, 0.05], [0.25, 0.05], [0.23, -0.12], [-0.23, -0.12]], { fill: '#d23c32' });
    P([[-0.21, -0.28], [0.21, -0.28], [0.19, -0.42], [-0.19, -0.42]], { fill: '#d23c32' });
    svgEl('rect', { x: -0.15, y: -0.78, width: 0.3, height: 0.23, fill: '#f6c445', stroke: ink, 'stroke-width': lw }, g);
    P([[-0.2, -0.78], [0.2, -0.78], [0, -0.95]], { fill: ink });
    P([[0.15, -0.7], [0.9, -0.95], [0.9, -0.45]], { fill: '#fde68a', opacity: 0.75 });
    P([[-0.15, -0.7], [-0.9, -0.95], [-0.9, -0.45]], { fill: '#fde68a', opacity: 0.75 });
  } else if (kind === 'palm') {
    svgEl('path', { d: 'M0 0.3 Q0.05 -0.2 -0.08 -0.7', fill: 'none', stroke: '#7a4a1e', 'stroke-width': 0.1, 'stroke-linecap': 'round' }, g);
    [10, 55, 125, 170, 215, 325].forEach((a) => {
      const r = a * D2R, ex = -0.08 + 0.6 * Math.cos(r), ey = -0.7 - 0.6 * Math.sin(r);
      const nx = -Math.sin(r) * 0.14, ny = -Math.cos(r) * 0.14, mx = -0.08 + 0.3 * Math.cos(r), my = -0.7 - 0.3 * Math.sin(r);
      svgEl('path', { d: `M-0.08 -0.7 Q${mx + nx} ${my + ny} ${ex} ${ey} Q${mx - nx} ${my - ny} -0.08 -0.7Z`, fill: '#2f8a3a' }, g);
    });
    svgEl('circle', { cx: -0.02, cy: -0.62, r: 0.07, fill: '#6b3d17' }, g); svgEl('circle', { cx: -0.15, cy: -0.63, r: 0.07, fill: '#6b3d17' }, g);
  } else if (kind === 'cave') {
    svgEl('path', { d: 'M-0.62 0.3 C-0.55 -0.6 0.55 -0.6 0.62 0.3Z', fill: '#a3a8b0', stroke: ink, 'stroke-width': lw }, g);
    svgEl('path', { d: 'M-0.3 0.3 C-0.28 -0.22 0.28 -0.22 0.3 0.3Z', fill: ink }, g);
  } else if (kind === 'fire') {
    svgEl('path', { d: 'M-0.35 0.28L0.35 0.12M-0.35 0.12L0.35 0.28', stroke: '#7a4a1e', 'stroke-width': 0.12, 'stroke-linecap': 'round' }, g);
    svgEl('path', { d: 'M-0.24 0.15 C-0.3 -0.2 -0.05 -0.3 0 -0.62 C0.08 -0.3 0.32 -0.2 0.24 0.15Z', fill: '#f08a24', stroke: '#d23c32', 'stroke-width': lw }, g);
    svgEl('path', { d: 'M-0.1 0.12 C-0.14 -0.1 0 -0.15 0.02 -0.32 C0.06 -0.12 0.15 -0.08 0.1 0.12Z', fill: '#fbd34d' }, g);
  } else if (kind === 'ship') {
    P([[-0.7, 0], [0.7, 0], [0.5, 0.35], [-0.5, 0.35]], { fill: '#7a4a1e' });
    svgEl('line', { x1: 0, y1: 0, x2: 0, y2: -1.1, stroke: ink, 'stroke-width': 0.05 }, g);
    P([[0.05, -1], [0.6, -0.25], [0.05, -0.25]], { fill: '#fff', stroke: ink, 'stroke-width': 0.03 });
    svgEl('rect', { x: 0, y: -1.1, width: 0.3, height: 0.15, fill: ink }, g);
  } else if (kind === 'chest') {
    svgEl('rect', { x: -0.45, y: -0.25, width: 0.9, height: 0.55, rx: 0.06, fill: '#8a5a2b', stroke: ink, 'stroke-width': lw }, g);
    svgEl('path', { d: 'M-0.45 -0.25 Q0 -0.65 0.45 -0.25Z', fill: '#a8703a', stroke: ink, 'stroke-width': lw }, g);
    svgEl('rect', { x: -0.08, y: -0.2, width: 0.16, height: 0.2, fill: '#f6c445', stroke: ink, 'stroke-width': 0.025 }, g);
    [[-0.3, -0.5], [0.1, -0.62], [0.32, -0.45]].forEach(([a, b]) => svgEl('circle', { cx: a, cy: b, r: 0.08, fill: '#f6c445', stroke: '#b07a12', 'stroke-width': 0.02 }, g));
  }
  return g;
}

function mountMap() {
  const host = document.getElementById('tmap'); if (!host) return;
  const BW = Math.min(440, host.clientWidth || 440);
  const G = new Graph(host, { width: BW, height: BW, xmin: -7, xmax: 7, ymin: -7, ymax: 7, xlabels: 1, ylabels: 1, fontSize: 13, pad: [14, 16, 14, 14], xtitle: 'x', ytitle: 'y', cls: 'u5l1-sea' });
  // sea + island under the grid
  const isl = []; for (let t = 0; t < 360; t += 4) { const r = ISL(t); isl.push(G.toPx(r * Math.cos(t * D2R), r * Math.sin(t * D2R))); }
  svgEl('polygon', { class: 'u5l1-island', points: isl.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') }, G.layers.bg);
  const leaf = []; for (let t = 0; t < 360; t += 10) { const r = 1, rx = (2.1 + 0.5 * Math.sin(4 * t * D2R)) * r, ry = (1.4 + 0.3 * Math.cos(3 * t * D2R)) * r; leaf.push(G.toPx(rx * Math.cos(t * D2R) - 3.5, ry * Math.sin(t * D2R) - 4.6)); }
  svgEl('polygon', { class: 'u5l1-leaf', points: leaf.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ') }, G.layers.bg);
  const icons = svgEl('g', { class: 'u5l1-icons' }, G.layers.data);
  icon(G, 'lighthouse', 4, 2, icons); icon(G, 'palm', -4, -2, icons); icon(G, 'cave', 2, -4, icons); icon(G, 'fire', 0, 0, icons); icon(G, 'ship', -5.9, 5.95, icons);
  [[4, 2], [-4, -2], [2, -4], [0, 0]].forEach(([x, y]) => { const [px, py] = G.toPx(x, y); svgEl('circle', { cx: px, cy: py, r: 3.6, fill: '#1e2d46' }, icons); });
  G.label(4, 1.3, 'Lighthouse', { cls: 'u5l1-lm' }); G.label(-4, -2.75, 'Palm tree', { cls: 'u5l1-lm' });
  G.label(2, -4.75, 'Cave', { cls: 'u5l1-lm' }); G.label(1.3, 0.5, 'Campfire', { cls: 'u5l1-lm' });
  const xl = svgEl('g', { class: 'u5l1-xs' }, G.layers.top);
  XS.forEach(([n, x, y]) => {
    const [px, py] = G.toPx(x, y), d = G.ux * 0.26;
    svgEl('path', { d: `M${px - d} ${py - d}L${px + d} ${py + d}M${px - d} ${py + d}L${px + d} ${py - d}` }, xl);
    G.label(x + 0.72, y + 0.55, n, { cls: 'u5l1-xlab' });
  });
  const digL = svgEl('g', { class: 'u5l1-digs' }, G.layers.top), pathL = svgEl('g', { class: 'u5l1-route' }, G.layers.top);
  const logEl = document.getElementById('tm-log'), cntEl = document.getElementById('tm-count');
  const say = (html) => { logEl.innerHTML = html; logEl.animate([{ opacity: 0.25 }, { opacity: 1 }], 300); };
  let S = { mode: 'dig', secret: null, n: 0, busy: false, tok: 0 };
  const hole = (x, y, cls = '', txt = '') => {
    const [px, py] = G.toPx(x, y), g = svgEl('g', { class: 'u5l1-hole ' + cls }, digL);
    svgEl('ellipse', { cx: px, cy: py, rx: G.ux * (txt ? 0.4 : 0.3), ry: G.ux * (txt ? 0.4 : 0.2) }, g);
    if (txt) svgEl('text', { x: px, y: py + 5, 'text-anchor': 'middle' }, g).textContent = txt;
    g.animate([{ opacity: 0, transform: 'scale(2)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 350, easing: 'cubic-bezier(.2,1.3,.4,1)' });
    return g;
  };
  const chest = (x, y) => { const g = icon(G, 'chest', x, y + 0.1, digL); g.animate([{ opacity: 0 }, { opacity: 1 }], 400); return g; };
  function reset(mode) {
    digL.innerHTML = ''; pathL.innerHTML = ''; S = { mode, secret: null, n: 0, busy: false, tok: S.tok + 1 };
    cntEl.textContent = '';
    if (mode === 'hide') {
      do { S.secret = [Math.floor(Math.random() * 13) - 6, Math.floor(Math.random() * 13) - 6]; } while (!onIsland(...S.secret));
      cntEl.textContent = 'Guesses: 0 of 5';
      say('A secret spot is hidden somewhere on the island. Call out an <b>ordered pair</b>, then tap it. The map says which way to go.');
    } else say('Tap any spot on the map to dig there. The map tells you its address.');
  }
  function dig(x, y) {
    if (S.busy || Math.abs(x) > 6 || Math.abs(y) > 6) return;
    const k = x + ',' + y, addr = `${PT(x, y)}: ${moves(x, y)}. `;
    if (S.mode === 'hide') {
      if (!S.secret) return;
      S.n++; cntEl.textContent = `Guesses: ${S.n} of 5`;
      const [sx, sy] = S.secret;
      if (x === sx && y === sy) { chest(x, y); say(`${addr}<b class="u5l1-ok">Found it</b> in ${S.n} guess${S.n === 1 ? '' : 'es'}! It is ${where(x, y)}.`); S.secret = null; return; }
      hole(x, y, 'u5l1-guess', String(S.n));
      const go = []; if (sx !== x) go.push(`go <b>${sx > x ? 'right' : 'left'}</b>`); if (sy !== y) go.push(`go <b>${sy > y ? 'up' : 'down'}</b>`);
      const hint = (sx === x ? `the ${T('x')}-coordinate is right, so ` : sy === y ? `the ${T('y')}-coordinate is right, so ` : '') + go.join(' and ');
      if (S.n >= 5) { chest(sx, sy); say(`${PT(x, y)} is not it. Out of guesses: the spot was ${PT(sx, sy)}, ${where(sx, sy)}.`); S.secret = null; return; }
      say(`${PT(x, y)} is not it. From there, ${hint}.`);
      return;
    }
    const xm = XS.find((p) => p[1] === x && p[2] === y);
    if (xm && xm[0] === 'C') { chest(x, y); say(`${addr}<b class="u5l1-ok">TREASURE!</b> X marks spot C, ${where(x, y)}.`); return; }
    hole(x, y);
    if (xm) say(`${addr}<b class="u5l1-red">A trap!</b> That is X spot ${xm[0]}: ${TRAP[xm[0]]}.`);
    else if (LAND[k]) say(`${addr}You found ${LAND[k]}.`);
    else if (!onIsland(x, y)) say(`${addr}<b>Splash!</b> That spot is in the sea.`);
    else say(`${addr}Just sand. It is ${where(x, y)}.`);
  }
  async function note() {
    reset('dig'); S.busy = true; const tok = S.tok, c = liveCtx();
    const live = () => tok === S.tok;
    say(`The note says ${PT(-3, 5)}. Start at the <b>campfire</b>, the origin.`);
    const t = svgEl('circle', { class: 'u5l1-tok', r: 9 }, pathL);
    const put = (x, y) => { const [px, py] = G.toPx(x, y); t.setAttribute('cx', px); t.setAttribute('cy', py); };
    put(0, 0); await c.sleep(900); if (!live()) return;
    say(`First number, ${T('-3')}: go <b class="u5l1-amb">3 left</b>.`);
    const a = G.segment([0, 0], [-3, 0], { color: 'amber', width: 5, arrowB: true, layer: 'top' }); pathL.appendChild(a);
    await Promise.all([drawIn(a, 900, c), tween(c, 900, (u) => { put(-3 * u, 0); return live(); })]); if (!live()) return;
    say(`Second number, ${T('5')}: go <b class="u5l1-pur">5 up</b>.`);
    const b = G.segment([-3, 0], [-3, 5], { color: 'purple', width: 5, arrowB: true, layer: 'top' }); pathL.appendChild(b);
    await Promise.all([drawIn(b, 1000, c), tween(c, 1000, (u) => { put(-3, 5 * u); return live(); })]); if (!live()) return;
    t.remove(); chest(-3, 5);
    say(`<b class="u5l1-ok">X spot C</b> is the treasure: 3 left, then 5 up, in <b>Quadrant II</b>. A, B and D are the traps.`);
    S.busy = false;
  }
  G.svg.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return; e.preventDefault();
    const [x, y] = G.fromEvent(e); dig(Math.round(x), Math.round(y));
  });
  G.el.classList.add('bk-ix');
  document.querySelectorAll('[data-tm]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.tm;
    if (k === 'note') { note(); document.getElementById('tmap').scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    else if (k === 'hide') reset('hide'); else reset('dig');
  }));
  reset('dig');
}

/* ================= static figures ================= */
function mountFigures() {
  const plane = document.getElementById('fig-plane');
  if (plane) {
    const G = new Graph(plane, { width: 340, height: 340, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabels: 2, ylabels: 2, fontSize: 15 });
    [1, 2, 3, 4].forEach((q) => { tint(G, q, 0.1); const [cx, cy] = qCentre(G, q, 0.55); G.label(cx, cy, `<b>${ROMAN[q]}</b>`, { cls: 'u5l1-qnum', color: QCOL[q] }); });
    G.point(0, 0, { color: 'ink', r: 5.5 });
    G.label(0, 0, T('O(0,\\ 0)'), { pos: 'sw', gap: 4, cls: 'bk-ptlab' });
    G.label(4.2, 0, `${T('x')}-axis`, { pos: 's', cls: 'u5l1-axlab', dy: 22 });
    G.label(0, 4.3, `${T('y')}-axis`, { pos: 'w', cls: 'u5l1-axlab', dx: -24 });
  }
  const p23 = document.getElementById('fig-p23');
  if (p23) {
    const G = plainGrid(p23, { width: 330, height: 330 });
    G.segment([0, 0], [2, 0], { color: 'amber', width: 4.5, arrowB: true });
    G.segment([2, 0], [2, 3], { color: 'purple', width: 4.5, arrowB: true });
    G.point(2, 3, { label: T('P(2,\\ 3)'), pos: 'ne', color: 'red' });
    G.label(1, 0, 'over 2', { pos: 's', cls: 'u5l1-mvlab', color: 'amber', dy: 16 });
    G.label(2, 1.5, 'up 3', { pos: 'e', cls: 'u5l1-mvlab', color: 'purple' });
  }
  const e1 = document.getElementById('fig-ex1b');
  if (e1) {
    const G = plainGrid(e1, { width: 330, height: 330, numbers: false, xtitle: '', ytitle: '' });
    [1, 2, 3, 4].forEach((q) => { const [cx, cy] = qCentre(G, q, 0.5); G.label(cx, cy, `<b>${ROMAN[q]}</b>`, { cls: 'u5l1-qnum u5l1-ansdot', color: 'red' }); });
  }
  const e2 = document.getElementById('fig-ex2');
  if (e2) {
    const G = plainGrid(e2, { width: 380, height: 380 });
    [['A', 2, 4, 'ne'], ['B', -3, 1, 'nw'], ['C', -1, -4, 'sw'], ['D', 4, -2, 'se']].forEach(([n, x, y, pos]) =>
      G.point(x, y, { color: 'red', r: 6.5, cls: 'u5l1-ansdot', label: NPT(n, x, y), pos, labelCls: 'u5l1-ansdot' }));
  }
  const e3 = document.getElementById('fig-ex3');
  if (e3) {
    const G = plainGrid(e3, { width: 380, height: 380 });
    [['M', 2, 5, 'ne'], ['N', -5, 2, 'nw'], ['P', -2, -5, 'sw'], ['Q', 5, -1, 'se'], ['R', 0, 4, 'ne'], ['S', -3, 0, 'n']]
      .forEach(([n, x, y, pos]) => G.point(x, y, { label: T(n), pos, color: 'ink', r: 6 }));
  }
  const e5 = document.getElementById('fig-ex5');
  if (e5) {
    const G = plainGrid(e5, { width: 380, height: 380 });
    G.segment([-5, -5], [5, 5], { color: 'red', width: 2.5, dash: '7 6', cls: 'u5l1-ansdot' });
    [-4, -2, 0, 2, 4].forEach((v) => G.point(v, v, { color: 'red', r: 6.5, cls: 'u5l1-ansdot' }));
  }
}

/* ================= explainer: building the plane ================= */
const planeParts = {
  title: 'Building the Cartesian plane',
  height: 470,
  minW: 880,
  choices: [{ v: 'build', label: 'Build the plane' }, { v: 'ex1', label: 'Example 1 check' }],
  intro: (k) => (k === 'ex1' ? 'Fill in the blanks of Example 1 (a), then label the quadrants for (b). Press <b>Next</b>.'
    : 'Two number lines make a whole plane. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const G = new Graph(stage, { x: 14, y: 8, width: 450, height: 450, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabels: 1, ylabels: 1, fontSize: 14 });
    // split the axes into the x-axis parts and the y-axis parts so each can appear on its own
    const L = G.layers.axes, [, ay] = G.toPx(0, 0), gx = svgEl('g', {}, L), gy = svgEl('g', {}, L);
    [...L.children].forEach((el) => {
      if (el === gx || el === gy) return;
      let isX;
      if (el.tagName === 'line') isX = el.getAttribute('y1') === el.getAttribute('y2');
      else if (el.tagName === 'text') isX = el.getAttribute('text-anchor') === 'middle';
      else isX = Math.abs(parseFloat(el.getAttribute('points').split(/[ ,]/)[1]) - ay) < 1;
      (isX ? gx : gy).appendChild(el);
    });
    const [tx, ty] = [...G.axesHtml.children];
    const W = ex.W, Pn = panel(stage, 490, 14, W - 504, 444, k === 'ex1' ? 'Example 1' : 'The parts');
    const build = k === 'build';
    if (build) hide(gx, gy, G.layers.grid, tx, ty);
    const glow = (pts, color) => { const s = G.segment(pts[0], pts[1], { color, width: 9, opacity: 0.35 }); return s; };
    const quads = async (c) => {
      for (const q of [1, 2, 3, 4]) {
        const r = tint(G, q, 0.13), [cx, cy] = qCentre(G, q, 0.55), lab = G.label(cx, cy, `<b>${ROMAN[q]}</b>`, { cls: 'u5l1-qbig', color: QCOL[q] });
        hide(r, lab); await Promise.all([appear(c, r, 400), pop(c, lab, 380)]); await sleep(c, 120);
      }
      const R = 2.5 * G.ux, [ox, oy] = G.toPx(0, 0), pts = [];
      for (let i = 0; i <= 40; i++) { const t = (35 + 290 * i / 40) * D2R; pts.push([ox + R * Math.cos(t), oy - R * Math.sin(t)]); }
      const arc = svgEl('g', { class: 'bk-curve' }, G.layers.top); arc.style.color = C.red;
      svgEl('path', { class: 'bk-stroke', d: 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'), fill: 'none', stroke: C.red, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, arc);
      const a = pts[40], b = pts[38]; arrowHead(arc, a[0], a[1], a[0] - b[0], a[1] - b[1], { width: 3.5, color: C.red, cls: 'bk-end bk-end1' });
      await drawIn(arc, 1000, c);
    };
    if (build) {
      return [
        { cap: `Start with a number line going <b>across</b>: the horizontal <b>${T('x')}-axis</b>.`,
          run: async (c) => { await Promise.all([appear(c, gx, 600), fadeIn(c, tx)]); await fadeIn(c, line(Pn, `<b class="u5l1-amb">across:</b> the ${T('x')}-axis`)); } },
        { cap: `Add a number line going <b>up and down</b>: the vertical <b>${T('y')}-axis</b>. The axes are <b>perpendicular</b>: they meet at a right angle.`,
          run: async (c) => {
            await Promise.all([appear(c, gy, 600), fadeIn(c, ty)]);
            const [ox, oy] = G.toPx(0, 0), s = 14, m = svgEl('path', { d: `M${ox + s} ${oy}V${oy - s}H${ox}`, fill: 'none', stroke: C.red, 'stroke-width': 2.5 }, G.layers.top);
            await appear(c, m, 300); await fadeIn(c, line(Pn, `<b class="u5l1-pur">up and down:</b> the ${T('y')}-axis`));
          } },
        { cap: `They cross at the <b>origin</b>, ${T('O')}. Its coordinates are always ${PT(0, 0)}: zero across, zero up.`,
          run: async (c) => { const o = G.point(0, 0, { color: 'red', r: 7, label: T('O(0,\\ 0)'), pos: 'sw' }); await G.reveal(o, c); await fadeIn(c, line(Pn, `<b>the origin:</b> ${T('O(0,\\ 0)')}`)); } },
        { cap: `Grid lines through every number fill in the <b>Cartesian plane</b>.`, run: async (c) => { await appear(c, G.layers.grid, 700); await fadeIn(c, line(Pn, `<b>the Cartesian plane</b>`)); } },
        { cap: `The axes cut the plane into four <b>quadrants</b>: <b>I, II, III, IV</b>, starting at the <b>top right</b> and going <b>counter-clockwise</b>.`,
          run: async (c) => { await quads(c); await fadeIn(c, line(Pn, `<b>quadrants:</b> I → II → III → IV<br><span class="muted">counter-clockwise from the top right</span>`)); } }
      ];
    }
    const sent = add(Pn, h('div', 'u5l1-sent', `(a) The horizontal number line is the <span class="u5l1-sb" data-b="0"></span>-axis. The vertical number line is the <span class="u5l1-sb" data-b="1"></span>-axis. They cross at the <span class="u5l1-sb wide" data-b="2"></span>, with coordinates (<span class="u5l1-sb sm" data-b="3"></span>, <span class="u5l1-sb sm" data-b="4"></span>).`), null);
    const fill = async (c, i, html) => { const b = sent.querySelector(`[data-b="${i}"]`); b.innerHTML = html; await pop(c, b, 320); };
    return [
      { cap: `(a) The <b>horizontal</b> number line is the <b>${T('x')}-axis</b>.`,
        run: async (c) => { const s = glow([[-6, 0], [6, 0]], 'amber'); await G.drawIn(s, 700, c); await fill(c, 0, T('x')); } },
      { cap: `The <b>vertical</b> number line is the <b>${T('y')}-axis</b>.`,
        run: async (c) => { const s = glow([[0, -6], [0, 6]], 'purple'); await G.drawIn(s, 700, c); await fill(c, 1, T('y')); } },
      { cap: `They cross at the <b>origin</b>, whose coordinates are ${PT(0, 0)}.`,
        run: async (c) => { await G.reveal(G.point(0, 0, { color: 'red', r: 7, label: T('O(0,\\ 0)'), pos: 'sw' }), c); await fill(c, 2, 'origin'); await fill(c, 3, T('0')); await fill(c, 4, T('0')); } },
      { cap: `(b) Label the quadrants: <b>I</b> is the top right, then go <b>counter-clockwise</b>: <b>II</b> top left, <b>III</b> bottom left, <b>IV</b> bottom right.`,
        run: async (c) => { await quads(c); await fadeIn(c, line(Pn, `(b) I top right, II top left,<br>III bottom left, IV bottom right`, 'u5l1-hl')); } }
    ];
  }
};

/* ================= explainer: plotting a point ================= */
const PP = {
  p: { label: T('P(2,\\ 3)'), pts: [['P', 2, 3]] },
  swap: { label: T('(1,\\ 4)') + ' vs ' + T('(4,\\ 1)'), pts: [['', 1, 4], ['', 4, 1]] },
  neg: { label: T('(-3,\\ -2)'), pts: [['', -3, -2]] },
  ex2: { label: 'Example 2 check', pts: [['A', 2, 4], ['B', -3, 1], ['C', -1, -4], ['D', 4, -2]] }
};
const plotPoint = {
  title: 'Plotting a point: over first, then up or down',
  height: 480,
  minW: 860,
  choices: Object.keys(PP).map((k) => ({ v: k, label: PP[k].label })),
  intro: (k) => (k === 'ex2' ? 'Plot each point of Example 2 as two moves from the origin. Press <b>Next</b>.'
    : 'Start at the origin. The <b>first</b> number moves you <b>over</b> (left or right); the <b>second</b> moves you <b>up or down</b>. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = PP[k], G = new Graph(stage, { x: 14, y: 10, width: 460, height: 460, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabels: 1, ylabels: 1, fontSize: 15 });
    G.label(0, 0, T('O'), { pos: 'nw', gap: 3, cls: 'bk-ptlab' });
    const Pn = panel(stage, 500, 14, ex.W - 514, 452, k === 'ex2' ? 'Example 2' : 'Moves from the origin');
    if (k !== 'ex2') add(Pn, h('div', 'u5l1-rule', `${T('(x,\\ y)')}<br><b class="u5l1-amb">1st: over</b> · <b class="u5l1-pur">2nd: up or down</b>`), null);
    const tok = G.point(0, 0, { color: 'red', r: 9 }); hide(tok);
    let arrows = [];
    const moveX = async (c, p) => {
      const [, x, y] = p; G.remove(arrows); arrows = [];
      G.moveTo(tok, 0, 0); tok.style.opacity = 1;
      if (!x) return;
      const s = G.segment([0, 0], [x, 0], { color: 'amber', width: 5, arrowB: true }), lab = G.label(x / 2, 0, OVER(x), { pos: y >= 0 ? 's' : 'n', cls: 'u5l1-mvlab', color: 'amber', dy: y >= 0 ? 20 : -4 });
      arrows.push(s, lab); hide(lab);
      await Promise.all([G.drawIn(s, 800, c), G.move(c, tok, x, 0, 800)]); await fadeIn(c, lab, 250);
    };
    const moveY = async (c, p) => {
      const [, x, y] = p; if (!y) return;
      const s = G.segment([x, 0], [x, y], { color: 'purple', width: 5, arrowB: true }), lab = G.label(x, y / 2, UPDOWN(y), { pos: x >= 0 ? 'e' : 'w', cls: 'u5l1-mvlab', color: 'purple' });
      arrows.push(s, lab); hide(lab);
      await Promise.all([G.drawIn(s, 700, c), G.move(c, tok, x, y, 700)]); await fadeIn(c, lab, 250);
    };
    const plot = async (c, p, color = 'blue') => {
      const [n, x, y] = p, pt = G.point(x, y, { color, r: 7, label: n ? NPT(n, x, y) : PT(x, y), pos: x < 0 ? (y < 0 ? 'sw' : 'nw') : (y < 0 ? 'se' : 'ne'), labelColor: 'ink' });
      tok.style.opacity = 0; await G.reveal(pt, c);
    };
    if (k === 'ex2') {
      const steps = d.pts.map((p) => ({
        cap: `${NPT(p[0], p[1], p[2])}: <b>${OVER(p[1])}</b>, then <b>${UPDOWN(p[2])}</b>. It lands ${where(p[1], p[2])}.`,
        run: async (c) => { await moveX(c, p); await moveY(c, p); await plot(c, p, 'red'); await fadeIn(c, line(Pn, `${NPT(p[0], p[1], p[2])}: <b class="u5l1-amb">${OVER(p[1])}</b>, <b class="u5l1-pur">${UPDOWN(p[2])}</b>`)); }
      }));
      steps.push({ cap: `All four plotted. Check your grid: one point in <b>each</b> quadrant.`, run: async (c) => { G.remove(arrows); arrows = []; await fadeIn(c, line(Pn, `I: ${T('A')} · II: ${T('B')} · III: ${T('C')} · IV: ${T('D')}`, 'u5l1-hl')); } });
      return steps;
    }
    const steps = [];
    d.pts.forEach((p, i) => {
      const [, x, y] = p, col = i ? 'purple' : 'blue';
      steps.push({ cap: `${p[0] ? NPT(p[0], x, y) : PT(x, y)}: the <b>${T('x')}-coordinate</b> is ${T(texNum(x))}, so move <b>${OVER(x)}</b>.`, run: (c) => moveX(c, p) });
      steps.push({ cap: `The <b>${T('y')}-coordinate</b> is ${T(texNum(y))}, so move <b>${UPDOWN(y)}</b>.`, run: (c) => moveY(c, p) });
      steps.push({ cap: k === 'swap' && i ? `${PT(4, 1)} lands somewhere <b>different</b> from ${PT(1, 4)}. Swap the numbers and you get a new point: that is why it is an <b>ordered</b> pair.`
        : `Plot the point ${p[0] ? NPT(p[0], x, y) : PT(x, y)}. It is ${where(x, y)}.`,
      run: async (c) => { await plot(c, p, col); await fadeIn(c, line(Pn, `${p[0] ? NPT(p[0], x, y) : PT(x, y)}: <b class="u5l1-amb">${OVER(x)}</b>, <b class="u5l1-pur">${UPDOWN(y)}</b>`)); } });
    });
    return steps;
  }
};

/* ================= explainer: the treasure traps (order and signs) ================= */
const traps = {
  title: 'The treasure note: three traps',
  height: 470,
  minW: 860,
  intro: 'The note says <b>“Dig at (−3, 5).”</b> Watch the right way, then the three slips. Press <b>Next</b>.',
  make(stage, v, ex) {
    const G = new Graph(stage, { x: 14, y: 8, width: 450, height: 450, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabels: 1, ylabels: 1, fontSize: 14 });
    G.label(0, 0, T('O'), { pos: 'nw', gap: 3, cls: 'bk-ptlab' });
    const Pn = panel(stage, 490, 14, ex.W - 504, 444, 'Dig at (−3, 5)');
    const go = async (c, x, y, color, ms = 700) => {
      const a = G.segment([0, 0], [x, 0], { color, width: 4.5, arrowB: true, dash: color === 'red' ? '8 6' : null });
      await G.drawIn(a, ms, c);
      const b = G.segment([x, 0], [x, y], { color, width: 4.5, arrowB: true, dash: color === 'red' ? '8 6' : null });
      await G.drawIn(b, ms, c); return [a, b];
    };
    const xMark = async (c, n, x, y) => {
      const p = G.point(x, y, { color: 'red', r: 8, label: x < -4 ? `<b>${n}</b>` : `<b>${n}</b> ${PT(x, y)}`, pos: x < -4 ? 'n' : x > 4 ? (y < 0 ? 'sw' : 'nw') : x > 0 ? (y < 0 ? 'se' : 'ne') : 'nw', labelColor: 'red' });
      await G.reveal(p, c); return p;
    };
    let wrong = [];
    const dim = (els) => els.forEach((e) => { e.style.opacity = 0.25; });
    return [
      { cap: `First number, ${T('-3')}: go <b>over</b> 3 to the <b>left</b> (negative means left).`,
        run: async (c) => { const a = G.segment([0, 0], [-3, 0], { color: 'amber', width: 5, arrowB: true }); await G.drawIn(a, 800, c); await fadeIn(c, line(Pn, `<b class="u5l1-amb">−3:</b> 3 left`)); } },
      { cap: `Second number, ${T('5')}: go <b>5 up</b>. The treasure is at <b>C</b> ${PT(-3, 5)}, in Quadrant II.`,
        run: async (c) => {
          const b = G.segment([-3, 0], [-3, 5], { color: 'purple', width: 5, arrowB: true }); await G.drawIn(b, 800, c);
          await G.reveal(G.point(-3, 5, { color: 'green', r: 9, label: `<b>C</b> ${PT(-3, 5)}`, pos: 'ne', labelColor: 'green' }), c);
          await fadeIn(c, line(Pn, `<b class="u5l1-pur">5:</b> 5 up → <b class="u5l1-ok">C ✓</b>`));
        } },
      { cap: `<b>Trap A:</b> the numbers were <b>swapped</b>. ${PT(5, -3)} means 5 right, then 3 down: a different spot.`,
        run: async (c) => { wrong = await go(c, 5, -3, 'red'); const pA = await xMark(c, 'A', 5, -3); wrong.push(pA, pA.label); await fadeIn(c, line(Pn, `<b class="u5l1-red">A</b> ${PT(5, -3)}: swapped`)); } },
      { cap: `<b>Trap B:</b> the <b>negative was ignored</b>. ${PT(3, 5)} goes right instead of left.`,
        run: async (c) => { dim(wrong); wrong = await go(c, 3, 5, 'red'); const pB = await xMark(c, 'B', 3, 5); wrong.push(pB, pB.label); await fadeIn(c, line(Pn, `<b class="u5l1-red">B</b> ${PT(3, 5)}: lost the minus`)); } },
      { cap: `<b>Trap D:</b> ${PT(-5, 3)} went 5 left first. It is in the <b>same quadrant</b> as C, but a different spot: the <b>order</b> decides.`,
        run: async (c) => { dim(wrong); wrong = await go(c, -5, 3, 'red'); const pD = await xMark(c, 'D', -5, 3); wrong.push(pD, pD.label); await fadeIn(c, line(Pn, `<b class="u5l1-red">D</b> ${PT(-5, 3)}: swapped`)); } },
      { cap: `Same two numbers, four different spots. <b>Over first</b> (with its sign), <b>then up or down</b>.`,
        run: async (c) => { dim(wrong); const s = stamp(Pn, 'over first,<br>then up or down', { ok: true }); s.style.alignSelf = 'center'; s.style.textAlign = 'center'; s.style.marginTop = '10px'; await stampIn(c, s); } }
    ];
  }
};

/* ================= explainer: reading coordinates ================= */
const RP = {
  demo: { label: 'Read two points', pts: [['K', -4, 3], ['L', 3, -2]] },
  axis: { label: 'Points on an axis', pts: [['U', 4, 0], ['V', 0, -3]] },
  ex3: { label: 'Example 3 check', pts: [['M', 2, 5], ['N', -5, 2], ['P', -2, -5], ['Q', 5, -1], ['R', 0, 4], ['S', -3, 0]] }
};
const posFor = (x, y) => (x < 0 ? (y < 0 ? 'sw' : 'nw') : (y < 0 ? 'se' : 'ne'));
const readPoint = {
  title: 'Reading the coordinates of a point',
  height: 480,
  minW: 860,
  choices: Object.keys(RP).map((k) => ({ v: k, label: RP[k].label })),
  intro: (k) => (k === 'ex3' ? 'Read each labelled point of Example 3. Press <b>Next</b>.'
    : 'Plotting in reverse: first find how far <b>over</b> the point is, then how far <b>up or down</b>. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = RP[k], G = new Graph(stage, { x: 14, y: 10, width: 460, height: 460, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabels: 1, ylabels: 1, fontSize: 15 });
    G.label(0, 0, T('O'), { pos: 'nw', gap: 3, cls: 'bk-ptlab' });
    const Pn = panel(stage, 500, 14, ex.W - 514, 452, k === 'ex3' ? 'Example 3' : 'Read the point');
    const pts = {};
    d.pts.forEach(([n, x, y]) => { pts[n] = G.point(x, y, { color: 'ink', r: 7, label: T(n), pos: y === 0 ? (x < 0 ? 'nw' : 'ne') : x === 0 ? 'ne' : posFor(x, y) }); });
    let marks = [];
    const clear = () => { G.remove(marks); marks = []; };
    const readX = async (c, x, y) => {
      if (y) { const s = G.segment([x, y], [x, 0], { color: 'amber', width: 3, dash: '7 6', arrowB: true }); marks.push(s); await G.drawIn(s, 600, c); }
      const lab = x === 0 ? G.label(0, y, T('x=0'), { pos: 'w', cls: 'u5l1-rdlab', color: 'amber', gap: 12 })
        : G.label(x, 0, T(texNum(x)), { pos: y >= 0 ? 's' : 'n', cls: 'u5l1-rdlab', color: 'amber', gap: y >= 0 ? 18 : 10 });
      marks.push(lab); hide(lab); await pop(c, lab, 300);
    };
    const readY = async (c, x, y) => {
      if (x) { const s = G.segment([x, y], [0, y], { color: 'purple', width: 3, dash: '7 6', arrowB: true }); marks.push(s); await G.drawIn(s, 600, c); }
      const lab = y === 0 ? G.label(x, 0, T('y=0'), { pos: 's', cls: 'u5l1-rdlab', color: 'purple', gap: 50 })
        : G.label(0, y, T(texNum(y)), { pos: x > 0 ? 'w' : 'e', cls: 'u5l1-rdlab', color: 'purple', gap: 10, dy: x === 0 ? 16 : 0 });
      marks.push(lab); hide(lab); await pop(c, lab, 300);
    };
    const xWhy = (x, y) => (x === 0 ? `It is <b>on the ${T('y')}-axis</b>: no move over, so ${T('x=0')}.` : y === 0 ? `It sits <b>on the ${T('x')}-axis</b>, at ${T('x=' + texNum(x))}.` : `Straight ${y > 0 ? 'down' : 'up'} to the ${T('x')}-axis: ${T('x=' + texNum(x))}.`);
    const yWhy = (x, y) => (y === 0 ? `It is <b>on the ${T('x')}-axis</b>: no move up or down, so ${T('y=0')}.` : x === 0 ? `It sits on the ${T('y')}-axis, at ${T('y=' + texNum(y))}.` : `Straight across to the ${T('y')}-axis: ${T('y=' + texNum(y))}.`);
    if (k === 'ex3') {
      return d.pts.map(([n, x, y]) => ({
        cap: `${T(n)}: ${x === 0 ? `on the ${T('y')}-axis, so ${T('x=0')}` : `${T('x=' + texNum(x))} (${OVER(x)})`}; ${y === 0 ? `on the ${T('x')}-axis, so ${T('y=0')}` : `${T('y=' + texNum(y))} (${UPDOWN(y)})`}. ${NPT(n, x, y)}`,
        run: async (c) => { clear(); await pulse(c, pts[n], 1.6); await readX(c, x, y); await readY(c, x, y); await fadeIn(c, line(Pn, NPT(n, x, y))); }
      }));
    }
    const steps = [];
    d.pts.forEach(([n, x, y]) => {
      steps.push({ cap: `Point ${T(n)}. ${xWhy(x, y)}`, run: async (c) => { clear(); await pulse(c, pts[n], 1.6); await readX(c, x, y); } });
      steps.push({ cap: `${yWhy(x, y)} So the point is ${NPT(n, x, y)}.`, run: async (c) => { await readY(c, x, y); await fadeIn(c, line(Pn, `${NPT(n, x, y)}: ${where(x, y)}`)); } });
    });
    return steps;
  }
};

/* ================= explainer: the four quadrants ================= */
const quadrants = {
  title: 'The four quadrants and their signs',
  height: 470,
  minW: 900,
  intro: 'The axes cut the plane into four <b>quadrants</b>. Watch the signs in each one. Press <b>Next</b>.',
  make(stage, k, ex) {
    const G = new Graph(stage, { x: 14, y: 10, width: 450, height: 450, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabels: 2, ylabels: 2, fontSize: 15 });
    G.label(0, 0, T('O'), { pos: 'sw', gap: 3, cls: 'bk-ptlab' });
    const PL = { 1: ['top right', 'right', 'up'], 2: ['top left', 'left', 'up'], 3: ['bottom left', 'left', 'down'], 4: ['bottom right', 'right', 'down'] };
    const SG = { 1: ['+', '+'], 2: ['-', '+'], 3: ['-', '-'], 4: ['+', '-'] };
    const word = (s) => (s === '+' ? 'positive' : 'negative');
    const tb = new ValueTable(stage, { x: 500, y: 20, headers: [TH('Quadrant'), TH(T('x')), TH(T('y'))],
      rows: [1, 2, 3, 4].map((q) => [{ html: '<b>' + ROMAN[q] + '</b>' }, { html: word(SG[q][0]) }, { html: word(SG[q][1]) }]),
      hide: (r, c) => c > 0, tap: false, cellW: Math.min(130, (ex.W - 520) / 3), cellH: 56, cls: 'u5l1-qvt' });
    const note = add(stage, box(h('div', 'u5l1-qnote'), ex.W - 514, 120), 500, 330);
    const say = (c, html) => { note.innerHTML = html; return fadeIn(c, note, 300); };
    const shade = async (c, q) => {
      const r = tint(G, q, 0.14), [cx, cy] = qCentre(G, q, 0.5), lab = G.label(cx, cy + 0.6, `<b>${ROMAN[q]}</b>`, { cls: 'u5l1-qbig', color: QCOL[q] });
      const sg = G.label(cx, cy - 0.8, T(`(${SG[q][0]},\\ ${SG[q][1]})`), { cls: 'u5l1-qsign', color: QCOL[q] });
      hide(r, lab, sg);
      await Promise.all([appear(c, r, 500), pop(c, lab, 420)]); await fadeIn(c, sg, 300);
      await tb.reveal(q - 1, 1, c); await tb.reveal(q - 1, 2, c);
    };
    const steps = [1, 2, 3, 4].map((q) => ({
      cap: `<b>Quadrant ${ROMAN[q]}</b> is the <b>${PL[q][0]}</b>: ${PL[q][1]} and ${PL[q][2]}, so ${T('x')} is <b>${word(SG[q][0])}</b> and ${T('y')} is <b>${word(SG[q][1])}</b>.`,
      run: (c) => shade(c, q)
    }));
    steps.push({ cap: `The axes are <b>borders</b>, not regions. A point <b>on an axis</b>, like ${PT(0, 3)} or ${PT(-4, 0)}, is in <b>no quadrant</b>.`,
      run: async (c) => {
        const a = G.point(0, 3, { coords: true, pos: 'e', color: 'red' }), b = G.point(-4, 0, { coords: true, pos: 'n', color: 'red' });
        await G.reveal(a, c); await G.reveal(b, c); await say(c, `A coordinate of <b>0</b> puts the point <b>on an axis</b>: no quadrant.`);
      } });
    return steps;
  }
};

/* ================= explainer: read the signs ================= */
const SS = {
  try: { label: 'Try four points', pts: [[-2, 6], [7, -3], [-5, -5], [0, 4]] },
  ex4: { label: 'Example 4 check', pts: [[5, 3], [-4, 2], [-3, -5], [6, -1], [0, -7], [-8, 0]] }
};
const signSort = {
  title: 'Read the signs, find the quadrant',
  height: 460,
  minW: 900,
  choices: Object.keys(SS).map((k) => ({ v: k, label: SS[k].label })),
  intro: (k) => (k === 'ex4' ? 'Example 4: no plotting needed, just the two signs. Press <b>Next</b> for each point.'
    : 'Look at each number on its own: <b>positive</b>, <b>negative</b> or <b>zero</b>? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const W = ex.W, list = SS[k].pts, gw = 410;
    const G = new Graph(stage, { x: W - gw - 10, y: 16, width: gw, height: 410, xmin: -9, xmax: 9, ymin: -9, ymax: 9, xlabels: 3, ylabels: 3, fontSize: 14 });
    const qr = {}, ql = {};
    [1, 2, 3, 4].forEach((q) => { qr[q] = tint(G, q, 0.04); const [cx, cy] = qCentre(G, q, 0.84); ql[q] = G.label(cx, cy, `<b>${ROMAN[q]}</b>`, { cls: 'u5l1-qmid', color: QCOL[q] }); });
    const lw = W - gw - 40;
    const card = add(stage, box(h('div', 'u5l1-scard'), lw, 250), 14, 16);
    card.innerHTML = `<div class="u5l1-sp"><span class="u5l1-par">(</span><span class="u5l1-sx" data-x></span><span class="u5l1-par">,</span><span class="u5l1-sy" data-y></span><span class="u5l1-par">)</span></div>
      <div class="u5l1-srow"><div class="u5l1-schip amb" data-sx></div><div class="u5l1-schip pur" data-sy></div></div><div class="u5l1-sres" data-r></div>`;
    const ex_ = card.querySelector('[data-x]'), ey = card.querySelector('[data-y]'), sx = card.querySelector('[data-sx]'), sy = card.querySelector('[data-sy]'), res = card.querySelector('[data-r]');
    const log = add(stage, box(h('div', 'u5l1-slog'), lw, 150), 14, 286);
    const dir = (v, axis) => (axis === 'x' ? (v > 0 ? 'right' : v < 0 ? 'left' : 'no move') : (v > 0 ? 'up' : v < 0 ? 'down' : 'no move'));
    let cur = [];
    const steps = list.map(([x, y]) => {
      const q = quadOf(x, y), on = q ? `<b>Quadrant ${ROMAN[q]}</b>` : x === 0 ? `<b>on the ${T('y')}-axis</b>` : `<b>on the ${T('x')}-axis</b>`;
      return {
        cap: `${PT(x, y)}: ${T('x')} is <b>${sword(x)}</b>${x ? ` (${dir(x, 'x')})` : ''} and ${T('y')} is <b>${sword(y)}</b>${y ? ` (${dir(y, 'y')})` : ''}. ` + (q ? `${T(`(${sgn(x)},\\ ${sgn(y)})`)} is ${on}.` : `A zero puts it ${on}.`),
        run: async (c) => {
          [1, 2, 3, 4].forEach((qq) => { qr[qq].setAttribute('fill-opacity', 0.04); ql[qq].classList.remove('on'); });
          cur.forEach((e) => { e.style.opacity = 0.35; });
          ex_.innerHTML = T(texNum(x)); ey.innerHTML = T(texNum(y)); sx.innerHTML = ''; sy.innerHTML = ''; res.innerHTML = '';
          await pop(c, card.firstElementChild, 300);
          sx.innerHTML = `${T(sgn(x) === '0' ? '0' : sgn(x))} <small>${sword(x)}</small>`; await pop(c, sx, 300);
          sy.innerHTML = `${T(sgn(y) === '0' ? '0' : sgn(y))} <small>${sword(y)}</small>`; await pop(c, sy, 300);
          res.innerHTML = q ? `→ ${on}` : `→ ${on}<br><small>no quadrant</small>`; await fadeIn(c, res, 300);
          if (q) { qr[q].setAttribute('fill-opacity', 0.2); ql[q].classList.add('on'); }
          const p = G.point(x, y, { color: q ? QCOL[q] : 'red', r: 7, coords: true, pos: x === 0 ? 'e' : (x < 0 && x > -6) || x > 4 ? (y < 0 ? 'sw' : 'nw') : (y < 0 ? 'se' : 'ne'), labelColor: 'ink' });
          await G.reveal(p, c); cur.push(p, p.label);
          await fadeIn(c, add(log, h('span', 'u5l1-stag', `${PT(x, y)} ${q ? ROMAN[q] : x === 0 ? T('y') + '-axis' : T('x') + '-axis'}`), null), 250);
        }
      };
    });
    steps.push({ cap: `Signs decide it: I ${T('(+,+)')}, II ${T('(-,+)')}, III ${T('(-,-)')}, IV ${T('(+,-)')}. A <b>zero</b> means an axis.`,
      run: async (c) => { [1, 2, 3, 4].forEach((qq) => { qr[qq].setAttribute('fill-opacity', 0.12); ql[qq].classList.add('on'); }); cur.forEach((e) => { e.style.opacity = 1; }); await sleep(c, 300); } });
    return steps;
  }
};

/* ================= explainer: patterns in several points ================= */
const PAT = {
  ex5: { label: 'Example 5 check', pts: [[-4, -4], [-2, -2], [0, 0], [2, 2], [4, 4]] },
  fall: { label: 'Another pattern', pts: [[-2, 4], [-1, 2], [0, 0], [1, -2], [2, -4]] },
  row: { label: 'Same y-coordinate', pts: [[-5, 3], [-2, 3], [1, 3], [4, 3]] },
  col: { label: 'Same x-coordinate', pts: [[-2, 5], [-2, 2], [-2, -1], [-2, -4]] }
};
const pattern = {
  title: 'Plot several points: what pattern do you see?',
  height: 480,
  minW: 900,
  choices: Object.keys(PAT).map((k) => ({ v: k, label: PAT[k].label })),
  intro: (k) => (k === 'ex5' ? 'Example 5: plot the five points, then look at how they are arranged. Press <b>Next</b>.'
    : 'Plot the points, then look for the pattern. Press <b>Next</b>.'),
  make(stage, k, ex) {
    const P = PAT[k].pts, G = new Graph(stage, { x: 14, y: 10, width: 460, height: 460, xmin: -6, xmax: 6, ymin: -6, ymax: 6, xlabels: 1, ylabels: 1, fontSize: 14 });
    const tb = new ValueTable(stage, { x: 496, y: 14, headers: ['x', 'y'], rows: P, tap: false, cellW: 70, cellH: 46 });
    const Pn = panel(stage, 660, 14, ex.W - 674, 452, 'What do you notice?');
    const pts = [];
    const plotAll = async (c) => {
      for (let i = 0; i < P.length; i++) {
        tb.highlight(i, true); const p = G.point(P[i][0], P[i][1], { color: 'blue', r: 7.5 }); pts.push(p); await G.reveal(p, c); await sleep(c, 140); tb.highlight(i, false);
      }
    };
    const shadeQ = async (c, qs) => { for (const q of qs) { const r = tint(G, q, 0.15), [cx, cy] = [q === 1 || q === 4 ? 5 : -5, q < 3 ? 1.2 : -1.2], l = G.label(cx, cy, `<b>${ROMAN[q]}</b>`, { cls: 'u5l1-qbig', color: QCOL[q] }); hide(r, l); await Promise.all([appear(c, r, 400), pop(c, l, 360)]); } };
    const steps = [{ cap: `Each row of the table is an ordered pair. Plot them one at a time.`, run: plotAll }];
    if (k === 'ex5') {
      steps.push({ cap: `They all lie on <b>one straight line</b> through the origin, rising to the right.`,
        run: async (c) => { await G.drawIn(G.segment([-5.5, -5.5], [5.5, 5.5], { color: 'gray', width: 3, dash: true }), 900, c); await fadeIn(c, line(Pn, '<b>a straight line</b> through the origin')); } });
      steps.push({ cap: `In every pair the two numbers are <b>equal</b> (${T('y=x')}): each point is the same distance right as it is up, or left as it is down.`,
        run: async (c) => {
          tb.highlightCol(0, true); tb.highlightCol(1, true);
          for (const [a, b] of [[0, 2], [2, 4]]) {
            const s1 = G.segment([a, a], [b, a], { color: 'amber', width: 4.5, arrowB: true }), s2 = G.segment([b, a], [b, b], { color: 'purple', width: 4.5, arrowB: true });
            await G.drawIn(s1, 450, c); await G.drawIn(s2, 450, c);
          }
          await fadeIn(c, line(Pn, `${T('x')} and ${T('y')} are <b>equal</b>: 2 right, 2 up`));
        } });
      steps.push({ cap: `<b>Example 5 (c):</b> ${PT(2, 2)} and ${PT(4, 4)} are in <b>Quadrant I</b>; ${PT(-2, -2)} and ${PT(-4, -4)} are in <b>Quadrant III</b>. The origin is in no quadrant.`,
        run: async (c) => { tb.highlightCol(0, false); tb.highlightCol(1, false); await shadeQ(c, [1, 3]); await fadeIn(c, line(Pn, '<b>Quadrants I and III</b><br><span class="muted">the origin: no quadrant</span>', 'u5l1-hl')); } });
    } else if (k === 'fall') {
      steps.push({ cap: `They lie on <b>one straight line</b> through the origin, but this one <b>falls</b> to the right.`,
        run: async (c) => { await G.drawIn(G.segment([-2.8, 5.6], [2.8, -5.6], { color: 'gray', width: 3, dash: true }), 900, c); await fadeIn(c, line(Pn, '<b>a straight line</b>, falling')); } });
      steps.push({ cap: `Each step of <b>1 right</b> goes <b>2 down</b>.`,
        run: async (c) => {
          for (let a = -2; a < 2; a++) {
            const b = -2 * a, s1 = G.segment([a, b], [a + 1, b], { color: 'amber', width: 4, arrowB: true }), s2 = G.segment([a + 1, b], [a + 1, b - 2], { color: 'purple', width: 4, arrowB: true });
            await G.drawIn(s1, 300, c); await G.drawIn(s2, 300, c);
          }
          await fadeIn(c, line(Pn, '1 right, 2 down, every time'));
        } });
      steps.push({ cap: `Other than the origin, the points are in <b>Quadrants II and IV</b>.`, run: async (c) => { await shadeQ(c, [2, 4]); await fadeIn(c, line(Pn, '<b>Quadrants II and IV</b>', 'u5l1-hl')); } });
    } else if (k === 'row') {
      steps.push({ cap: `Every point has the <b>same ${T('y')}-coordinate</b>, ${T('y=3')}: they line up in a <b>horizontal row</b>, 3 units above the ${T('x')}-axis.`,
        run: async (c) => { tb.highlightCol(1, true); await G.drawIn(G.segment([-6, 3], [6, 3], { color: 'purple', width: 3, dash: true }), 900, c); await fadeIn(c, line(Pn, `same ${T('y')} → a <b>horizontal</b> row`)); } });
      steps.push({ cap: `Left of the ${T('y')}-axis they are in <b>Quadrant II</b>; right of it, <b>Quadrant I</b>.`, run: async (c) => { tb.highlightCol(1, false); await shadeQ(c, [2, 1]); await fadeIn(c, line(Pn, '<b>Quadrants II and I</b>', 'u5l1-hl')); } });
    } else {
      steps.push({ cap: `Every point has the <b>same ${T('x')}-coordinate</b>, ${T('x=-2')}: they line up in a <b>vertical column</b>, 2 units left of the ${T('y')}-axis.`,
        run: async (c) => { tb.highlightCol(0, true); await G.drawIn(G.segment([-2, 6], [-2, -6], { color: 'amber', width: 3, dash: true }), 900, c); await fadeIn(c, line(Pn, `same ${T('x')} → a <b>vertical</b> column`)); } });
      steps.push({ cap: `Above the ${T('x')}-axis they are in <b>Quadrant II</b>; below it, <b>Quadrant III</b>.`, run: async (c) => { tb.highlightCol(0, false); await shadeQ(c, [2, 3]); await fadeIn(c, line(Pn, '<b>Quadrants II and III</b>', 'u5l1-hl')); } });
    }
    return steps;
  }
};

/* ================= mount ================= */
mountMap();
mountFigures();
export const explainers = mountExplainers({ planeParts, plotPoint, traps, readPoint, quadrants, signSort, pattern });

/* ---------- Math History (the brown box): Descartes' fly (a legend) ----------
 * A fly wanders over a tiled ceiling. At each stop, dashed lines measure how many tiles it is from the left wall (x) and
 * from the bottom wall (y), and the ordered pair appears: (3, 4), then (10, 5), then (7, 2). (Same animation as Math 10C 5.1.) */
(function flyOnCeiling() {
  const svg = document.getElementById('fly-anim'); if (!svg) return;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  const TL = 30, GX = 52, GY = 24, NX = 11, NY = 7;
  const X = (x) => GX + x * TL, Y = (y) => GY + (NY - y) * TL;
  mk('rect', { x: GX, y: GY, width: NX * TL, height: NY * TL, class: 'u5l1h-ceil' });
  for (let i = 1; i < NX; i++) mk('line', { x1: X(i), x2: X(i), y1: GY, y2: Y(0), class: 'u5l1h-grid' });
  for (let j = 1; j < NY; j++) mk('line', { x1: GX, x2: X(NX), y1: Y(j), y2: Y(j), class: 'u5l1h-grid' });
  mk('rect', { x: GX - 9, y: GY, width: 9, height: NY * TL + 9, class: 'u5l1h-wall' });
  mk('rect', { x: GX - 9, y: Y(0), width: NX * TL + 9, height: 9, class: 'u5l1h-wall' });
  for (let i = 1; i <= NX; i++) txt(String(i), { x: X(i), y: Y(0) + 25, 'text-anchor': 'middle', class: 'u5l1h-num' });
  for (let j = 1; j <= NY; j++) txt(String(j), { x: GX - 15, y: Y(j) + 4.5, 'text-anchor': 'end', class: 'u5l1h-num' });
  txt('bottom wall', { x: X(NX / 2), y: 290, 'text-anchor': 'middle', class: 'u5l1h-wl' });
  txt('left wall', { x: 0, y: 0, 'text-anchor': 'middle', class: 'u5l1h-wl', transform: `translate(14 ${Y(NY / 2)}) rotate(-90)` });
  const trail = mk('polyline', { class: 'u5l1h-trail', points: '' });
  const mx = mk('line', { class: 'u5l1h-mx' }), my = mk('line', { class: 'u5l1h-my' });
  const lx = txt('', { 'text-anchor': 'middle', class: 'u5l1h-lx' }), ly = txt('', { class: 'u5l1h-ly' });
  const RX = 420;
  txt('THE FLY IS AT', { x: RX, y: 64, class: 'u5l1h-cap' });
  const pair = txt('', { x: RX, y: 112, class: 'u5l1h-pair' });
  const p0 = mk('tspan', {}, pair), px = mk('tspan', { class: 'u5l1h-cx' }, pair), p1 = mk('tspan', {}, pair), py = mk('tspan', { class: 'u5l1h-cy' }, pair), p2 = mk('tspan', {}, pair);
  p0.textContent = '('; p1.textContent = ', '; p2.textContent = ')';
  const rx = txt('', { x: RX, y: 146, class: 'u5l1h-rx' }), ry = txt('', { x: RX, y: 168, class: 'u5l1h-ry' });
  const hint = txt('over first, then up', { x: RX, y: 204, class: 'u5l1h-hint' });
  const fly = mk('g', { class: 'u5l1h-fly' });
  const body = mk('g', {}, fly);
  mk('ellipse', { cx: -3, cy: -6, rx: 4.5, ry: 9, transform: 'rotate(-28 -3 -6)', class: 'u5l1h-wing' }, body);
  mk('ellipse', { cx: -3, cy: 6, rx: 4.5, ry: 9, transform: 'rotate(28 -3 6)', class: 'u5l1h-wing' }, body);
  mk('ellipse', { cx: -2, cy: 0, rx: 9, ry: 5, fill: '#3d2817' }, body);
  mk('circle', { cx: 8, cy: 0, r: 4.2, fill: '#2b1b0e' }, body);
  mk('circle', { cx: 9.5, cy: -2.6, r: 1.6, fill: '#c0392b' }, body); mk('circle', { cx: 9.5, cy: 2.6, r: 1.6, fill: '#c0392b' }, body);
  const LEGS = [
    [[5.5, 7.3], [6.6, 6.1], [4.4, 5.6], [3.4, 4.9], [3, 4]],
    [[3, 4], [4.6, 2.3], [7.6, 2.9], [8.9, 4.4], [10, 5]],
    [[10, 5], [9.4, 6.4], [6.6, 5.6], [5.6, 3.4], [7, 2]],
  ];
  const STOPS = LEGS.map((l) => l[l.length - 1]);
  const cr = (a0, a1, a2, a3, t) => { const t2 = t * t, t3 = t2 * t; return 0.5 * ((2 * a1) + (-a0 + a2) * t + (2 * a0 - 5 * a1 + 4 * a2 - a3) * t2 + (-a0 + 3 * a1 - 3 * a2 + a3) * t3); };
  const along = (pts, u) => {
    const n = pts.length - 1, s = Math.min(n - 1e-9, u * n), i = Math.floor(s), t = s - i;
    const P = (k) => pts[Math.max(0, Math.min(n, k))];
    return [0, 1].map((c) => cr(P(i - 1)[c], P(i)[c], P(i + 1)[c], P(i + 2)[c], t));
  };
  const FLY = 1900, STAY = 2300, END = LEGS.length * (FLY + STAY);
  let ang = 200;
  const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
  function draw(ms) {
    const leg = Math.min(LEGS.length - 1, Math.floor(ms / (FLY + STAY))), into = ms - leg * (FLY + STAY);
    const moving = into < FLY && ms < END, u = moving ? ease(into / FLY) : 1;
    const [x, y] = along(LEGS[leg], u);
    if (moving) { const [x2, y2] = along(LEGS[leg], Math.min(1, u + 0.02)); if (Math.hypot(x2 - x, y2 - y) > 1e-4) ang = (Math.atan2(-(y2 - y), x2 - x) * 180) / Math.PI; }
    fly.setAttribute('transform', `translate(${X(x).toFixed(1)} ${Y(y).toFixed(1)}) rotate(${ang.toFixed(1)}) scale(1.25)`);
    fly.classList.toggle('moving', moving);
    const pts = []; for (let k = 0; k <= 40; k++) { const v = (k / 40) * u; const [a, b] = along(LEGS[leg], v); pts.push(`${X(a).toFixed(1)},${Y(b).toFixed(1)}`); }
    trail.setAttribute('points', pts.join(' '));
    const [sx, sy] = STOPS[leg], g = moving ? 0 : Math.min(1, (into - FLY) / 600), show = !moving && into - FLY > 650;
    mx.setAttribute('x1', X(sx)); mx.setAttribute('y1', Y(sy)); mx.setAttribute('x2', X(sx) - (X(sx) - GX) * g); mx.setAttribute('y2', Y(sy));
    my.setAttribute('x1', X(sx)); my.setAttribute('y1', Y(sy)); my.setAttribute('x2', X(sx)); my.setAttribute('y2', Y(sy) + (Y(0) - Y(sy)) * g);
    mx.style.opacity = my.style.opacity = moving ? 0 : 1;
    lx.textContent = String(sx); lx.setAttribute('x', (X(sx) + GX) / 2); lx.setAttribute('y', Y(sy) - 8);
    ly.textContent = String(sy); ly.setAttribute('x', X(sx) + 8); ly.setAttribute('y', (Y(sy) + Y(0)) / 2 + 5);
    [lx, ly].forEach((e) => e.classList.toggle('on', show));
    px.textContent = String(sx); py.textContent = String(sy);
    [pair, rx, ry, hint].forEach((e) => e.classList.toggle('on', show));
    rx.textContent = `${sx} from the left wall`; ry.textContent = `${sy} from the bottom wall`;
  }
  let t0 = 0, raf = 0;
  function frame(now) { if (!t0) t0 = now; const ms = now - t0; draw(ms); if (ms < END) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); t0 = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(END); return; }
    raf = requestAnimationFrame(frame);
  }
  draw(0);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
})();

/* ============ Stand Up Break! — read and plot points, quadrants (lessons/js/standup.js) ============ */
/* a coordinate grid drawn from the generated numbers (big labels for the projector) */
const SU_INK = '#1c2230', SU_GRID = '#d3d8df', SU_C = '#1f5aa8';
const suF = (v) => +v.toFixed(1);
function suPlane(n, draw, label) { // grid −n…n, numbers on every line
  const u = Math.floor(330 / (2 * n)), p = 18, W = 2 * n * u + 2 * p;
  const X = (x) => suF(p + (x + n) * u), Y = (y) => suF(p + (n - y) * u);
  let s = `<rect x="0" y="0" width="${W}" height="${W}" rx="10" fill="#fff"/>`;
  for (let k = -n; k <= n; k++) s += `<line x1="${X(k)}" y1="${Y(-n)}" x2="${X(k)}" y2="${Y(n)}" stroke="${SU_GRID}"/><line x1="${X(-n)}" y1="${Y(k)}" x2="${X(n)}" y2="${Y(k)}" stroke="${SU_GRID}"/>`;
  s += `<g stroke="${SU_INK}" stroke-width="2" fill="${SU_INK}"><line x1="${X(-n)}" y1="${Y(0)}" x2="${X(n)}" y2="${Y(0)}"/><line x1="${X(0)}" y1="${Y(-n)}" x2="${X(0)}" y2="${Y(n)}"/>` +
    `<path d="M${X(n) + 2} ${Y(0)}l-9 -5v10z M${X(0)} ${Y(n) - 2}l-5 9h10z" stroke="none"/></g>`;
  const halo = 'paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"';
  for (let k = -n + 1; k < n; k++) if (k) {
    s += `<text x="${X(k)}" y="${Y(0) + 19}" text-anchor="middle" font-size="16" ${halo}>${String(k).replace('-', '−')}</text>`;
    s += `<text x="${X(0) - 6}" y="${Y(k) + 6}" text-anchor="end" font-size="16" ${halo}>${String(k).replace('-', '−')}</text>`;
  }
  s += draw(X, Y);
  return `<svg viewBox="0 0 ${W} ${W}" width="${W}" role="img" aria-label="${label || 'grid'}" font-family="KaTeX_Main, 'Times New Roman', serif" fill="${SU_INK}">${s}</svg>`;
}
const suDot = (X, Y, x, y, name) => {
  const dx = x < 0 ? -9 : 9, dy = y < 0 ? 22 : -9, anchor = x < 0 ? 'end' : 'start';
  return `<circle cx="${X(x)}" cy="${Y(y)}" r="6" fill="${SU_C}" stroke="#fff" stroke-width="2"/>` +
    (name ? `<text x="${suF(X(x) + dx)}" y="${suF(Y(y) + dy)}" text-anchor="${anchor}" font-size="22" font-style="italic" font-weight="700" fill="${SU_C}" paint-order="stroke" stroke="#fff" stroke-width="5" stroke-linejoin="round">${name}</text>` : '');
};
const suP = (x, y) => `(${x},\\ ${y})`;
const suWhere = (x, y) => { const q = quadOf(x, y); return q ? `\\text{Quadrant ${ROMAN[q]}}` : x === 0 && y === 0 ? '\\text{origin}' : x === 0 ? 'y\\text{-axis}' : 'x\\text{-axis}'; };
const SU_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W'];
/** k distinct points in −n…n (not the origin); opts: nonzero coordinates only, at most one on an axis, one per quadrant first */
function suPoints(r, k, n, o = {}) {
  const pts = [], key = (p) => p.join(','), seen = new Set(['0,0']);
  const qs = r.shuffle([1, 2, 3, 4]);
  let axis = o.axis || 0;
  while (pts.length < k) {
    let x, y;
    if (axis > 0) { axis--; const v = r.int(1, n) * r.sign(); [x, y] = r.chance(0.5) ? [0, v] : [v, 0]; }
    else { const q = qs[pts.length % 4]; x = r.int(1, n) * (q === 1 || q === 4 ? 1 : -1); y = r.int(1, n) * (q < 3 ? 1 : -1); }
    if (seen.has(key([x, y])) || seen.has(key([y, x]))) continue; // no swapped twins: the order should matter, not confuse
    seen.add(key([x, y])); pts.push([x, y]);
  }
  return r.shuffle(pts);
}
standup('u5l1', {
  intro: 'Grab a marker and draw a quick grid at your whiteboard station. Over first, then up or down.',
  levels: {
    BEG: (r) => { // read three points, one per quadrant
      const pts = suPoints(r, 3, 5), names = r.shuffle(SU_NAMES).slice(0, 3).sort();
      return { q: '', text: `State the coordinates of points ${names[0]}, ${names[1]} and ${names[2]}.`,
        fig: suPlane(6, (X, Y) => pts.map((p, i) => suDot(X, Y, p[0], p[1], names[i])).join(''), 'points to read'),
        a: pts.map((p, i) => `${names[i]}${suP(p[0], p[1])}`).join(',\\quad ') };
    },
    PRG: (r) => { // read four points, one on an axis, and name the quadrant or axis
      const pts = suPoints(r, 4, 5, { axis: 1 }), names = r.shuffle(SU_NAMES).slice(0, 4).sort();
      return { q: '', text: `State the coordinates of points ${names.slice(0, 3).join(', ')} and ${names[3]}, and the quadrant each is in (or the axis it is on).`,
        fig: suPlane(6, (X, Y) => pts.map((p, i) => suDot(X, Y, p[0], p[1], names[i])).join(''), 'points to read'),
        a: pts.map((p, i) => `${names[i]}${suP(p[0], p[1])}:\\ ${suWhere(p[0], p[1])}`) };
    },
    MAS: (r) => {
      if (r.chance(0.5)) { // the fourth corner of a rectangle
        let x1, x2, y1, y2;
        do { x1 = r.int(-6, 5); x2 = r.int(x1 + 2, 6); y1 = r.int(-6, 5); y2 = r.int(y1 + 2, 6); } while (x1 * x2 >= 0 && y1 * y2 >= 0);
        const corners = [[x1, y1], [x2, y1], [x2, y2], [x1, y2]], miss = r.int(0, 3), given = r.shuffle(corners.filter((_, i) => i !== miss)), m = corners[miss];
        return { q: '', text: `Three corners of a rectangle are ${given.map((p) => T(suP(p[0], p[1]))).join(', ')}. Plot them. What are the coordinates of the fourth corner? Which quadrant is it in (or which axis is it on)?`,
          a: [`\\text{Fourth corner: }${suP(m[0], m[1])}`, suWhere(m[0], m[1]), `\\text{(it shares an } x \\text{ with one corner and a } y \\text{ with another)}`] };
      }
      // signs only: no plotting
      const pts = suPoints(r, 4, 9, { axis: r.chance(0.5) ? 1 : 0 }), q = r.int(1, 4), sx = q === 1 || q === 4 ? 1 : -1, sy = q < 3 ? 1 : -1;
      return { q: pts.map((p) => suP(p[0], p[1])).join(',\\quad '), text: `Without plotting, say which quadrant each point is in, or which axis it is on. Then make up a point of your own in <b>Quadrant ${ROMAN[q]}</b>.`,
        a: [...pts.map((p) => `${suP(p[0], p[1])}:\\ (${sgn(p[0])},\\ ${sgn(p[1])})\\ \\Rightarrow\\ ${suWhere(p[0], p[1])}`), `\\text{Quadrant ${ROMAN[q]} is } (${sgn(sx)},\\ ${sgn(sy)})\\text{, e.g. } ${suP(sx * r.int(1, 9), sy * r.int(1, 9))}`] };
    }
  }
});
