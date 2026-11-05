/* Math 15 · Unit 1 · Lesson 5 — Perfect Squares, Perfect Cubes, and Estimating Roots.
 * Warm-up (The Photo Wall: build square walls of photos; 50 and 200 photos don't fit), the n / n² and n / n³ tables
 * (tap to reveal), the Example 3(c) tap-to-plot number line, and the explainers:
 *   tiles   (n tiles make a k × k square, so √n = k; 12 tiles don't; read the root off the table — Example 1 check),
 *   cubes   (k layers of k × k small cubes make a k × k × k cube, so ∛n = k; 64 is both — Example 2 check),
 *   trap    (a² < n < b² on a line of perfect squares, squashed down onto the roots: a < √n < b, and which is nearer),
 *   zoom    (the gap a² … b² is 2a + 1 steps; n is d of them in; drop straight down onto the tenths — one decimal),
 *   round   (estimate, key it into the TI-30XIIS, keep the place asked for, the next digit decides — Example 4 check),
 *   garden  (side of a square from its area, edge of a cube from its volume: trap, estimate, calculator, check — Ex 5).
 * Ideas and pictures adapted from the Math 10C twin (u1l3 tiles and boxes, u1l5 tiles-then-number-line and cubes). */
import { h, tex, fmt, svgEl, ValueTable, NumberLine, liveCtx, mountExplainers, COLORS } from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgLayer = (stage, w, hh) => add(stage, svgEl('svg', { class: 'u1l5-svg', width: w, height: hh }), 0, 0);
const AMB = COLORS.amber, BLUE = COLORS.blue, RED = COLORS.red, INK = COLORS.ink, TEAL = '#13807a';
const isqrt = (n) => Math.floor(Math.sqrt(n) + 1e-9);
const icbrt = (n) => { let r = Math.round(Math.cbrt(n)); while (r ** 3 > n) r--; while ((r + 1) ** 3 <= n) r++; return r; };
const disp = (x) => String(Number(x.toPrecision(10)));                 // what the TI-30XIIS shows (10 digits)
const dots = (x, d) => (Math.floor(x * 10 ** d) / 10 ** d).toFixed(d) + '\\ldots';  // 6.32455\ldots
const rnd = (x, d) => (Math.round(x * 10 ** d + 1e-9) / 10 ** d).toFixed(d);
const tn = (n) => fmt(n).replace(/ /g, '\\,');                      // 1 000 → 1\,000 in LaTeX
const line = (host, html, cls = '') => { const d = h('div', 'u1l5-ln ' + cls, html); host.appendChild(d); d.style.opacity = 0; return d; };
const panel = (stage, x, y, w) => { const p = add(stage, h('div', 'u1l5-panel'), x, y); p.style.width = w + 'px'; return p; };

/* a hop arc between two x positions above (or below) a line at y, with a label */
function hopPath(svg, x1, x2, y, hh, color, below) {
  const s = below ? 1 : -1, p = svgEl('path', { d: `M${x1} ${y + s * 4} Q${(x1 + x2) / 2} ${y + s * (hh * 2)} ${x2} ${y + s * 4}`, fill: 'none', stroke: color, 'stroke-width': 3, 'stroke-linecap': 'round' }, svg);
  return p;
}
const drawIn = (c, el, ms = 500, o = {}) => {
  const len = (el.getTotalLength && el.getTotalLength()) || 300;
  el.style.strokeDasharray = len; el.style.strokeDashoffset = len; el.style.opacity = 1;
  return c.anim(el, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms, o).then(() => { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; });
};

/* ---------- isometric boxes of small cubes (front corner P, unit u; nx wide, ny deep, nz tall) ---------- */
function isoBox(svg, P, u, nx, ny, nz, cls) {
  const cs = Math.cos(Math.PI / 6), R = [cs * u, -0.5 * u], L = [-cs * u, -0.5 * u], U = [0, -u];
  const pt = (a, b, c) => [P[0] + a * R[0] + b * L[0] + c * U[0], P[1] + a * R[1] + b * L[1] + c * U[1]];
  const g = svgEl('g', { class: 'u1l5-iso ' + (cls || '') }, svg);
  const poly = (pts, c) => svgEl('polygon', { points: pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '), class: c }, g);
  const ln = (p, q) => svgEl('line', { x1: p[0].toFixed(1), y1: p[1].toFixed(1), x2: q[0].toFixed(1), y2: q[1].toFixed(1), class: 'gl' }, g);
  poly([pt(0, 0, 0), pt(0, ny, 0), pt(0, ny, nz), pt(0, 0, nz)], 'fl');
  poly([pt(0, 0, 0), pt(nx, 0, 0), pt(nx, 0, nz), pt(0, 0, nz)], 'fr');
  poly([pt(0, 0, nz), pt(0, ny, nz), pt(nx, ny, nz), pt(nx, 0, nz)], 'ft');
  if (u >= 7) {
    for (let i = 1; i < nx; i++) { ln(pt(i, 0, 0), pt(i, 0, nz)); ln(pt(i, 0, nz), pt(i, ny, nz)); }
    for (let j = 1; j < ny; j++) { ln(pt(0, j, 0), pt(0, j, nz)); ln(pt(0, j, nz), pt(nx, j, nz)); }
    for (let k = 1; k < nz; k++) { ln(pt(0, ny, k), pt(0, 0, k)); ln(pt(0, 0, k), pt(nx, 0, k)); }
  }
  return g;
}

/* ---------- a little n / n² (or n³) table on a stage, with one column highlighted ---------- */
function miniTable(stage, x, y, k, pow, lo, hi) {
  const t = add(stage, h('div', 'u1l5-mt'), x, y);
  const cols = []; for (let v = lo; v <= hi; v++) cols.push(v);
  t.innerHTML = `<div class="u1l5-mt-h">${T('n')}</div>` + cols.map((v) => `<div class="u1l5-mt-c${v === k ? ' on' : ''}">${v}</div>`).join('') +
    `<div class="u1l5-mt-h">${T(pow === 2 ? 'n^2' : 'n^3')}</div>` + cols.map((v) => `<div class="u1l5-mt-c b${v === k ? ' on' : ''}">${fmt(v ** pow)}</div>`).join('');
  t.style.gridTemplateColumns = `56px repeat(${cols.length}, 64px)`;
  return t;
}

/* ============ 1. n tiles → a k × k square ============ */
const tiles = {
  title: 'A perfect square is tiles that make a square',
  height: 380,
  minW: 860,
  choices: [{ sep: 'Demo:' }, 25, 196, { v: 12, label: '12 (not a square)' }, { v: 20, label: '20 (not a square)' }, { sep: 'Example 1 check:' }, 16, 81, 1, 121, 49, 144],
  custom: [1, 225],
  intro: (n) => `Here are <b>${n}</b> square tiles. Can they make one solid square?`,
  make(stage, n, ex) {
    const W = ex.W, k = isqrt(n), perfect = k * k === n, K = perfect ? k : k + 1, e = n - k * k;
    const box = 300, ts = Math.min(56, box / K), sz = ts * 0.88, ox = 52, oy = 34;
    const cols0 = Math.ceil(Math.sqrt(n * 1.6)), s0 = Math.min(26, (box + 20) / cols0);
    const tl = [];
    for (let i = 0; i < n; i++) {
      const t = h('div', 'u1l5-tile'), r = Math.round(((Math.sin(i * 12.9898) * 43758.5453) % 1) * 30 - 15);
      const x = ox - 10 + (i % cols0) * s0 * 1.05 + ((i * 7) % 5) - 2, y = oy + 30 + Math.floor(i / cols0) * s0 * 1.05 + ((i * 3) % 5) - 2;
      t.style.width = t.style.height = sz + 'px'; t._t = `translate(${x}px, ${y}px) rotate(${r}deg)`; t.style.transform = t._t; t.style.opacity = 0;
      stage.appendChild(t); tl.push(t);
    }
    const target = (i) => { if (i < k * k) return [i % k, Math.floor(i / k)]; const j = i - k * k; return j < k ? [k, j] : [j - k, k]; };
    const ghost = add(stage, h('div', 'u1l5-ghost'), ox - 3, oy - 3); ghost.style.width = ghost.style.height = K * ts + 3 + 'px'; hide(ghost);
    const dimT = add(stage, h('div', 'u1l5-dim c', String(k)), ox + (k * ts) / 2, oy - 18), dimL = add(stage, h('div', 'u1l5-dim c', String(k)), ox - 22, oy + (k * ts) / 2);
    hide(dimT, dimL);
    const P = panel(stage, 420, 18, W - 440);
    const l0 = line(P, `<b>${n}</b> tile${n > 1 ? 's' : ''}`, 'big');
    const l1 = line(P, perfect ? T(`${k}\\times${k}=${n}`) : T(`${k}\\times${k}=${k * k}`) + ` <span class="u1l5-red">+ ${e} left over</span>`);
    const l2 = line(P, perfect ? T(`\\sqrt{${n}}=${k}`) : `${T(`${K}\\times${K}=${K * K}`)} <span class="muted">too many</span>`, perfect ? 'ok big' : '');
    const mach = line(P, perfect ? `<div>${T(`${k}\\;\\xrightarrow{\\ \\text{times itself}\\ }\\;${n}`)}</div><div>${T(`${n}\\;\\xrightarrow{\\ \\text{square root}\\ }\\;${k}`)}</div>` : '', 'u1l5-mach');
    const lo = Math.max(1, Math.min(k - 2, 11)), mt = perfect ? miniTable(stage, 420, 262, k, 2, lo, lo + 4) : null; hide(mt);
    const arrange = (c) => Promise.all(tl.map((t, i) => {
      const [cx, cy] = target(i), to = `translate(${ox + cx * ts}px, ${oy + cy * ts}px) rotate(0deg)`, from = t._t; t._t = to;
      t.classList.add(i < k * k ? 'good' : 'xtra');
      return c.anim(t, [{ transform: from, opacity: 1 }, { transform: to, opacity: 1 }], 700, { delay: Math.min(i * 5, 300) });
    }));
    const steps = [{
      cap: `Here ${n > 1 ? 'are' : 'is'} <b>${n}</b> square tile${n > 1 ? 's' : ''}. Can ${n > 1 ? 'they' : 'it'} make one solid square, with nothing left over?`,
      run: (c) => Promise.all([c.fadeIn(l0, 300), ...tl.map((t, i) => c.anim(t, [{ opacity: 0 }, { opacity: 1 }], 250, { delay: Math.min(i * 6, 500) }))])
    }];
    if (perfect) {
      steps.push({
        cap: n === 1 ? `Yes: one tile is a <b>1 × 1</b> square. 1 × 1 = 1, so 1 is a <b>perfect square</b>.` : `Yes! They make a <b>${k} × ${k}</b> square. ${k} × ${k} = ${n}, so ${n} is a <b>perfect square</b>.`,
        run: (c) => Promise.all([arrange(c), c.fadeIn(dimT, 300, { delay: 600 }), c.fadeIn(dimL, 300, { delay: 600 }), c.fadeIn(l1, 300, { delay: 500 })])
      }, {
        cap: `The <b>square root</b> goes backwards, from the number of tiles to the side: ${T(`\\sqrt{${n}}=${k}`)}.`,
        run: (c) => Promise.all([c.fadeIn(l2, 300), c.fadeIn(mach, 400, { delay: 200 }), c.pop(dimT, 400), c.pop(dimL, 400)])
      }, {
        cap: `On the table: find <b>${n}</b> in the bottom row. The number right above it is the square root, <b>${k}</b>.`,
        run: (c) => c.fadeIn(mt, 400)
      });
    } else {
      steps.push({
        cap: `The biggest square uses <b>${k * k}</b> tiles (${k} × ${k}), with <b>${e}</b> left over. A ${K} × ${K} square would need ${K * K} tiles: too many.`,
        run: (c) => Promise.all([arrange(c), c.fadeIn(dimT, 300, { delay: 600 }), c.fadeIn(dimL, 300, { delay: 600 }), c.fadeIn(l1, 300, { delay: 500 }), c.fadeIn(ghost, 300, { delay: 700 }), c.fadeIn(l2, 300, { delay: 800 })])
      }, {
        cap: `So <b>${n} is not a perfect square</b>, and ${T(`\\sqrt{${n}}`)} is not a whole number. It is between <b>${k}</b> and <b>${K}</b>. Section 3 shows how to estimate it.`,
        run: (c) => { mach.innerHTML = `<div>${T(`${k}<\\sqrt{${n}}<${K}`)}</div>`; return c.fadeIn(mach, 400); }
      });
    }
    return steps;
  }
};

/* ============ 2. k layers of k × k cubes → a k × k × k cube ============ */
const cubes = {
  title: 'A perfect cube is small cubes that stack into one big cube',
  height: 400,
  minW: 860,
  choices: [{ sep: 'Example 2 check:' }, 8, 27, 125, 1, { v: 64, label: '64 (both!)' }],
  intro: (n) => `Can <b>${fmt(n)}</b> small cubes stack into one solid cube?`,
  make(stage, n, ex) {
    const W = ex.W, k = icbrt(n), u = Math.min(64, 165 / k), cs = Math.cos(Math.PI / 6);
    const P = [44 + cs * k * u, 26 + 2 * k * u], svg = svgLayer(stage, 400, 400);
    const layers = Array.from({ length: k }, (_, j) => isoBox(svg, [P[0], P[1] - j * u], u, k, k, 1, 'pos'));
    hide(...layers);
    const dim = add(stage, h('div', 'u1l5-dim c', `${k} × ${k} × ${k}`), P[0], P[1] + 22); hide(dim);
    const Pn = panel(stage, 410, 18, W - 430);
    const l0 = line(Pn, k === 1 ? T('1\\times1\\times1=1') : `one layer: ${T(`${k}\\times${k}=${k * k}`)}`);
    const l1 = k > 1 ? line(Pn, `${k} layers: ${T(`${k}\\times${k}\\times${k}=${tn(n)}`)}`) : null;
    const l2 = line(Pn, T(`\\sqrt[3]{${tn(n)}}=${k}`), 'ok big');
    const mach = line(Pn, `<div>${T(`${k}\\;\\xrightarrow{\\ \\text{times itself 3 times}\\ }\\;${tn(n)}`)}</div><div>${T(`${tn(n)}\\;\\xrightarrow{\\ \\text{cube root}\\ }\\;${k}`)}</div>`, 'u1l5-mach');
    const lo = Math.max(1, Math.min(k - 2, 6)), mt = miniTable(stage, 410, 270, k, 3, lo, lo + 4); hide(mt);
    const steps = [];
    if (k === 1) {
      steps.push({ cap: 'One small cube is already a <b>1 × 1 × 1</b> cube: 1 × 1 × 1 = 1. So 1 is a <b>perfect cube</b>.', run: (c) => Promise.all([c.pop(layers[0], 400), c.fadeIn(dim, 300), c.fadeIn(l0, 300)]) });
    } else {
      steps.push({
        cap: `Start with one layer: a <b>${k} × ${k}</b> square of ${k * k} small cubes.`,
        run: (c) => Promise.all([c.anim(layers[0], [{ opacity: 0, transform: 'translateY(-30px)' }, { opacity: 1, transform: 'none' }], 500), c.fadeIn(l0, 300)])
      }, {
        cap: `Stack <b>${k} layers</b>: ${k} × ${k} × ${k} = ${fmt(n)}. The ${fmt(n)} small cubes make one solid cube, so ${fmt(n)} is a <b>perfect cube</b>.`,
        run: (c) => Promise.all([...layers.slice(1).map((g, j) => c.anim(g, [{ opacity: 0, transform: 'translateY(-50px)' }, { opacity: 1, transform: 'none' }], 450, { delay: j * Math.min(260, 1800 / k) })), c.fadeIn(dim, 300, { delay: 400 }), c.fadeIn(l1, 300, { delay: 300 })])
      });
    }
    steps.push({
      cap: `The <b>cube root</b> goes backwards, from the number of small cubes to the edge: ${T(`\\sqrt[3]{${tn(n)}}=${k}`)}.`,
      run: (c) => Promise.all([c.fadeIn(l2, 300), c.fadeIn(mach, 400, { delay: 200 }), c.pop(dim, 400)])
    }, {
      cap: `On the table: find <b>${fmt(n)}</b> in the bottom row. The number right above it is the cube root, <b>${k}</b>.`,
      run: (c) => c.fadeIn(mt, 400)
    });
    if (n === 64) {
      const flat = add(stage, h('div', 'u1l5-flat'), W - 168, 236); hide(flat);
      flat.innerHTML = `<div class="u1l5-flat-g"></div><div class="u1l5-flat-c">${T('8\\times8=64')}</div>`;
      const g = flat.firstChild; for (let i = 0; i < 64; i++) g.appendChild(h('i'));
      steps.push({
        cap: `Lay the same 64 cubes flat and they make an <b>8 × 8</b> square too. So 64 is <b>both</b>: ${T('\\sqrt{64}=8')} and ${T('\\sqrt[3]{64}=4')}.`,
        run: (c) => { mt.style.opacity = 0.25; return c.anim(flat, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], 500); }
      });
    }
    return steps;
  }
};

/* ============ 3. Trap √n between two whole numbers ============ */
function trapGeom(n, W) {
  const a = isqrt(n), b = a + 1, rlo = Math.max(0, a - 1), rhi = a + 2, lo = rlo * rlo, hi = rhi * rhi;
  const x0 = 175, x1 = W - 60, X = (v) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0), XR = (r) => x0 + ((r - rlo) / (rhi - rlo)) * (x1 - x0);
  return { a, b, rlo, rhi, lo, hi, x0, x1, X, XR, d1: n - a * a, d2: b * b - n };
}
function axis(svg, x0, x1, y) {
  svgEl('line', { x1: x0 - 22, x2: x1 + 22, y1: y, y2: y, class: 'u1l5-ax' }, svg);
  svgEl('path', { d: `M${x1 + 32} ${y} l-13 -7 v14 z`, class: 'u1l5-axh' }, svg);
  svgEl('path', { d: `M${x0 - 32} ${y} l13 -7 v14 z`, class: 'u1l5-axh' }, svg);
}
const trap = {
  title: 'Trap the square root between two whole numbers',
  height: 400,
  minW: 860,
  choices: [{ sep: 'Notes:' }, { v: 40, label: T('\\sqrt{40}') }, { v: 46, label: T('\\sqrt{46}') }, { v: 90, label: T('\\sqrt{90}') }, { v: 130, label: T('\\sqrt{130}') },
    { sep: 'Example 3 check:' }, { v: 27, label: T('\\sqrt{27}') }, { v: 95, label: T('\\sqrt{95}') }, { sep: 'Example 4(c):' }, { v: 60, label: T('\\sqrt{60}') }],
  custom: [2, 224],
  intro: (n) => `Which two whole numbers is ${T(`\\sqrt{${n}}`)} between? Which one is it closer to?`,
  make(stage, n, ex) {
    const W = ex.W, G = trapGeom(n, W), { a, b, X, XR, x0, x1, d1, d2 } = G, yT = 128, yB = 300;
    const svg = svgLayer(stage, W, 400);
    const tagT = add(stage, h('div', 'u1l5-tag', 'numbers'), 14, yT - 10), tagB = add(stage, h('div', 'u1l5-tag', 'square roots'), 14, yB - 10);
    const gT = svgEl('g', {}, svg); axis(gT, x0, x1, yT);
    const px = (x1 - x0) / (G.hi - G.lo);
    if (px >= 6) for (let v = G.lo; v <= G.hi; v++) svgEl('line', { x1: X(v), x2: X(v), y1: yT - 5, y2: yT + 5, class: 'u1l5-tk sm' }, gT);
    const sqLabs = [];
    for (let r = G.rlo; r <= G.rhi; r++) {
      svgEl('line', { x1: X(r * r), x2: X(r * r), y1: yT - 11, y2: yT + 11, class: 'u1l5-tk' }, gT);
      sqLabs.push(add(stage, h('div', 'u1l5-sq c' + (r === a || r === b ? ' key' : ''), String(r * r)), X(r * r), yT + 30));
    }
    const mk = add(stage, h('div', 'u1l5-nmk c', `<b>${n}</b>`), X(n), yT - 46), mkDot = add(stage, h('div', 'u1l5-ndot c'), X(n), yT);
    const gB = svgEl('g', {}, svg); axis(gB, x0, x1, yB);
    const rtLabs = [];
    for (let r = G.rlo; r <= G.rhi; r++) {
      svgEl('line', { x1: XR(r), x2: XR(r), y1: yB - 11, y2: yB + 11, class: 'u1l5-tk' }, gB);
      rtLabs.push(add(stage, h('div', 'u1l5-rt c' + (r === a || r === b ? ' key' : ''), String(r)), XR(r), yB + 30));
    }
    const conn = []; for (let r = G.rlo; r <= G.rhi; r++) conn.push(svgEl('line', { x1: X(r * r), y1: yT + 46, x2: XR(r), y2: yB - 16, class: 'u1l5-conn' + (r === a || r === b ? ' key' : '') }, svg));
    const band = svgEl('rect', { x: XR(a), y: yB - 9, width: XR(b) - XR(a), height: 18, rx: 9, class: 'u1l5-band' }, svg);
    const bandLab = add(stage, h('div', 'u1l5-bandlab c', T(`\\sqrt{${n}}\\text{ is in here}`)), (XR(a) + XR(b)) / 2, yB - 34);
    const h1 = hopPath(svg, X(a * a), X(n), yT, Math.min(40, 14 + (X(n) - X(a * a)) * 0.3), AMB), h2 = hopPath(svg, X(n), X(b * b), yT, Math.min(40, 14 + (X(b * b) - X(n)) * 0.3), BLUE, true);
    const h1l = add(stage, h('div', 'u1l5-hl c amb', `${d1} past`), (X(a * a) + X(n)) / 2, yT - 70), h2l = add(stage, h('div', 'u1l5-hl c blu', `${d2} short`), (X(n) + X(b * b)) / 2, yT + 58);
    const near = d1 < d2 ? a : b, f = d1 / (2 * a + 1), est = a + f;
    const ptr = add(stage, h('div', 'u1l5-ptr c', `${T(`\\sqrt{${n}}`)}<br><span>closer to ${near}</span>`), XR(est), yB - 60), ptrDot = add(stage, h('div', 'u1l5-ndot c amb'), XR(est), yB);
    const res = add(stage, h('div', 'u1l5-res'), 150, 352);
    hide(gB, ...rtLabs, ...conn, band, bandLab, h1, h2, h1l, h2l, ptr, ptrDot, res, mk, mkDot, gT, ...sqLabs, tagT, tagB);
    const showTop = (c) => Promise.all([c.fadeIn(gT, 300), c.fadeIn(tagT, 300), ...sqLabs.map((e, i) => c.fadeIn(e, 300, { delay: 100 + i * 80 })), c.pop(mk, 400, { delay: 450 }), c.pop(mkDot, 400, { delay: 450 })]);
    const a2 = a * a, b2 = b * b;
    if (d1 === 0) return [
      { cap: `<b>${n}</b> is right on a perfect square: ${a} × ${a} = ${n}.`, run: (c) => showTop(c) },
      { cap: `So ${T(`\\sqrt{${n}}=${a}`)} exactly. No trapping needed!`, run: (c) => { res.innerHTML = T(`\\sqrt{${n}}=${a}`); return Promise.all([c.fadeIn(gB, 300), c.fadeIn(tagB, 300), ...rtLabs.map((e) => c.fadeIn(e, 300)), ...conn.map((e) => c.fadeIn(e, 300)), c.fadeIn(res, 300)]); } }
    ];
    return [{
      cap: `Where does <b>${n}</b> sit on the line of numbers? Between the perfect squares <b>${a2}</b> and <b>${b2}</b>: ${T(`${a2}<${n}<${b2}`)}.`,
      run: async (c) => { res.innerHTML = T(`${a2}<${n}<${b2}`); await showTop(c); await c.fadeIn(res, 300); }
    }, {
      cap: `Take the square root of each: ${T(`\\sqrt{${a2}}=${a}`)} and ${T(`\\sqrt{${b2}}=${b}`)}. So ${T(`${a}<\\sqrt{${n}}<${b}`)}: trapped between <b>${a}</b> and <b>${b}</b>.`,
      run: async (c) => {
        res.innerHTML = `${T(`${a2}<${n}<${b2}`)} &nbsp;so&nbsp; ${T(`${a}<\\sqrt{${n}}<${b}`)}`;
        await Promise.all([c.fadeIn(gB, 300), c.fadeIn(tagB, 300), ...rtLabs.map((e, i) => c.fadeIn(e, 300, { delay: i * 80 })), ...conn.map((e, i) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 400, { delay: 200 + i * 80 }))]);
        await Promise.all([c.anim(band, [{ opacity: 0 }, { opacity: 1 }], 400), c.fadeIn(bandLab, 400)]);
      }
    }, {
      cap: `Which one is it closer to? Look at the <b>numbers</b>: ${n} is <b>${d1}</b> past ${a2}, but <b>${d2}</b> short of ${b2}.`,
      run: (c) => Promise.all([drawIn(c, h1, 500), drawIn(c, h2, 500, { delay: 300 }), c.fadeIn(h1l, 300, { delay: 400 }), c.fadeIn(h2l, 300, { delay: 700 })])
    }, {
      cap: `${d1} ${d1 < d2 ? '&lt;' : '&gt;'} ${d2}, so ${n} is nearer <b>${near * near}</b>, and ${T(`\\sqrt{${n}}`)} is <b>closer to ${near}</b>.`,
      run: (c) => { res.innerHTML = `${T(`${a}<\\sqrt{${n}}<${b}`)}, &nbsp;closer to <b>${near}</b>`; return Promise.all([c.anim(bandLab, [{ opacity: 1 }, { opacity: 0 }], 250), c.pop(ptr, 420, { delay: 100 }), c.pop(ptrDot, 420, { delay: 100 }), c.fadeIn(res, 300)]); }
    }];
  }
};

/* ============ 3. One decimal place: zoom in on the gap ============ */
const zoom = {
  title: 'One decimal place: zoom in on the gap',
  height: 410,
  minW: 860,
  choices: [{ sep: 'Notes:' }, { v: 40, label: T('\\sqrt{40}') }, { v: 46, label: T('\\sqrt{46}') }, { v: 90, label: T('\\sqrt{90}') }, { v: 130, label: T('\\sqrt{130}') },
    { sep: 'Example 3 check:' }, { v: 27, label: T('\\sqrt{27}') }, { v: 95, label: T('\\sqrt{95}') }, { sep: 'Example 4(c):' }, { v: 60, label: T('\\sqrt{60}') }],
  custom: [2, 224],
  intro: (n) => `Estimate ${T(`\\sqrt{${n}}`)} to <b>one decimal place</b>, without a calculator.`,
  make(stage, n, ex) {
    const W = ex.W, a = isqrt(n), b = a + 1, a2 = a * a, b2 = b * b, g = b2 - a2, d = n - a2;
    if (d === 0) {
      const r = add(stage, h('div', 'u1l5-res big', T(`\\sqrt{${n}}=${a}`)), 150, 160); hide(r);
      return [{ cap: `${n} is a perfect square (${a} × ${a}), so ${T(`\\sqrt{${n}}=${a}`)} exactly. Pick a number that is not a perfect square.`, run: (c) => c.fadeIn(r, 300) }];
    }
    const x0 = 175, x1 = W - 80, cw = (x1 - x0) / g, yT = 112, yB = 292, svg = svgLayer(stage, W, 410);
    const tagT = add(stage, h('div', 'u1l5-tag', 'numbers'), 14, yT + 4), tagB = add(stage, h('div', 'u1l5-tag', 'square roots'), 14, yB - 10);
    const cells = [];
    for (let i = 0; i < g; i++) cells.push(svgEl('rect', { x: x0 + i * cw + 1.5, y: yT, width: cw - 3, height: 30, rx: Math.min(6, cw / 4), class: 'u1l5-cell' }, svg));
    const la = add(stage, h('div', 'u1l5-sq c key', String(a2)), x0, yT + 52), lb = add(stage, h('div', 'u1l5-sq c key', String(b2)), x1, yT + 52);
    const glab = add(stage, h('div', 'u1l5-glab', `gap: ${b2} − ${a2} = <b>${g}</b> steps`), x0 - 4, 18);
    const xn = x0 + d * cw, nmk = add(stage, h('div', 'u1l5-nmk c', `<b>${n}</b>`), xn, yT - 30), nline = svgEl('line', { x1: xn, x2: xn, y1: yT - 14, y2: yT + 40, class: 'u1l5-nline' }, svg);
    const dlab = add(stage, h('div', 'u1l5-hl c amb', `${d} of ${g}`), x0 + (d * cw) / 2, yT + 54);
    const gB = svgEl('g', {}, svg); axis(gB, x0, x1, yB);
    const tenths = [];
    for (let i = 0; i <= 10; i++) {
      const x = x0 + (i / 10) * (x1 - x0);
      svgEl('line', { x1: x, x2: x, y1: yB - (i % 10 ? 7 : 12), y2: yB + (i % 10 ? 7 : 12), class: 'u1l5-tk' + (i % 10 ? ' sm' : '') }, gB);
      tenths.push(add(stage, h('div', 'u1l5-rt c' + (i % 10 ? ' sm' : ' key'), i % 10 ? (a + i / 10).toFixed(1) : String(a + i / 10)), x, yB + 30));
    }
    const ends = [svgEl('line', { x1: x0, x2: x0, y1: yT + 70, y2: yB - 16, class: 'u1l5-conn key' }, svg), svgEl('line', { x1: x1, x2: x1, y1: yT + 70, y2: yB - 16, class: 'u1l5-conn key' }, svg)];
    const f = d / g, f1 = rnd(f, 1), est = rnd(a + f, 1), drop = svgEl('line', { x1: xn, x2: xn, y1: yT + 40, y2: yB - 8, class: 'u1l5-drop' }, svg);
    const eMk = add(stage, h('div', 'u1l5-est c', `≈ ${est}`), xn, yB - 44), eTri = add(stage, h('div', 'u1l5-tri c'), xn, yB - 18);
    const root = Math.sqrt(n), xr = x0 + (root - a) * (x1 - x0), cDot = add(stage, h('div', 'u1l5-cdot c'), xr, yB), cLab = add(stage, h('div', 'u1l5-clab c', `calculator: ${T(`\\sqrt{${n}}=${dots(root, 4)}`)}`), Math.min(W - 170, Math.max(290, xr)), yB + 70);
    const res = add(stage, h('div', 'u1l5-res'), W - 30, 14); res.style.translate = '-100% 0';
    hide(tagT, tagB, ...cells, la, lb, glab, nmk, nline, dlab, gB, ...tenths, ...ends, drop, eMk, eTri, cDot, cLab, res);
    const same = rnd(root, 1) === est;
    return [{
      cap: `Zoom in on the gap from ${a2} to ${b2}. It is ${b2} − ${a2} = <b>${g} steps</b> long.`,
      run: (c) => Promise.all([c.fadeIn(tagT, 300), c.fadeIn(la, 300), c.fadeIn(lb, 300), c.fadeIn(glab, 300, { delay: 300 }), ...cells.map((e, i) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 200, { delay: i * Math.min(60, 900 / g) }))])
    }, {
      cap: `${n} is <b>${d}</b> step${d > 1 ? 's' : ''} into the gap: ${d} out of ${g}.`,
      run: (c) => { cells.slice(0, d).forEach((e) => e.classList.add('on')); return Promise.all([c.pop(nmk, 400), c.anim(nline, [{ opacity: 0 }, { opacity: 1 }], 300), c.fadeIn(dlab, 300, { delay: 200 }), ...cells.slice(0, d).map((e, i) => c.pop(e, 260, { delay: i * 40 }))]); }
    }, {
      cap: `Line up the square roots underneath: <b>${a}</b> under ${a2}, <b>${b}</b> under ${b2}, and the tenths in between.`,
      run: (c) => Promise.all([c.fadeIn(gB, 300), c.fadeIn(tagB, 300), ...tenths.map((e, i) => c.fadeIn(e, 260, { delay: i * 50 })), ...ends.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 400))])
    }, {
      cap: `${d} out of ${g} is about <b>${f1}</b> of the way (${d} ÷ ${g} ≈ ${rnd(f, 2)}). Drop straight down: ${T(`\\sqrt{${n}}\\approx${est}`)}.`,
      run: async (c) => { res.innerHTML = `${T(`\\sqrt{${n}}\\approx${a}+${f1}=${est}`)}`; await drawIn(c, drop, 500); await Promise.all([c.pop(eMk, 400), c.pop(eTri, 400), c.fadeIn(res, 300)]); }
    }, {
      cap: `Calculator check: ${T(`\\sqrt{${n}}=${dots(root, 4)}`)}, which is ${rnd(root, 1)} to one decimal place. ${same ? 'The estimate is <b>spot on</b>.' : 'Very close: the estimate was <b>reasonable</b>.'}`,
      run: (c) => Promise.all([c.pop(cDot, 400), c.fadeIn(cLab, 400, { delay: 200 })])
    }];
  }
};

/* ============ 4. The calculator, then round ============ */
const PLACE = { 1: 'tenth', 2: 'hundredth' };
const round = {
  title: 'Estimate, key it in, then round',
  height: 320,
  minW: 860,
  choices: [{ sep: 'Notes:' }, { v: '40|2', label: `${T('\\sqrt{40}')} hundredth` }, { v: '46|2', label: `${T('\\sqrt{46}')} hundredth` }, { v: '150|1', label: `${T('\\sqrt{150}')} tenth` },
    { sep: 'Example 4 check:' }, { v: '27|2', label: `${T('\\sqrt{27}')} hundredth` }, { v: '95|2', label: `${T('\\sqrt{95}')} hundredth` }, { v: '60|1', label: `${T('\\sqrt{60}')} tenth` }],
  intro: (v) => { const [n, p] = v.split('|'); return `Evaluate ${T(`\\sqrt{${n}}`)} to the nearest <b>${PLACE[p]}</b>. Estimate first!`; },
  make(stage, v, ex) {
    const W = ex.W, [ns, ps] = v.split('|'), n = +ns, p = +ps, a = isqrt(n), b = a + 1, d = n - a * a, g = 2 * a + 1, est = rnd(a + d / g, 1);
    const x = Math.sqrt(n), shown = disp(x), res = rnd(x, p), [ip, fp] = shown.split('.'), next = +fp[p], up = next >= 5;
    const lcd = add(stage, h('div', 'u1l5-lcd'), 30, 24);
    lcd.innerHTML = `<div class="u1l5-lcd-in">√(${n}</div><div class="u1l5-lcd-out">${ip}.${[...fp].map((ch, i) => `<span class="u1l5-dg" data-i="${i}">${ch}</span>`).join('')}</div>`;
    const keys = add(stage, h('div', 'u1l5-keys'), 30, 172);
    const rbig = add(stage, h('div', 'u1l5-rbig'), 30, 228);
    keys.innerHTML = ['2nd', 'x²', ...String(n).split(''), 'ENTER'].map((k) => `<kbd>${k}</kbd>`).join('');
    const out = lcd.querySelector('.u1l5-lcd-out'), dg = [...lcd.querySelectorAll('.u1l5-dg')];
    hide(lcd, keys, rbig);
    const P = panel(stage, 500, 20, W - 520);
    const l0 = line(P, `<span class="u1l5-k">estimate</span> ${T(`${a * a}<${n}<${b * b}`)}, about <b>${est}</b>`);
    const l1 = line(P, `<span class="u1l5-k">screen</span> <b>${shown}</b>`);
    const l2 = line(P, `<span class="u1l5-k">${PLACE[p]}</span> keep ${p} place${p > 1 ? 's' : ''} · next digit <b class="u1l5-amb">${next}</b>`);
    const l3 = line(P, `${T(`\\sqrt{${n}}=${dots(x, p + 3)}\\approx`)} <b class="u1l5-ok">${res}</b>`, 'big');
    const l4 = line(P, `${res} vs. ${est}: close <b class="u1l5-ok">✓</b>`);
    const zero = res.endsWith('0') && p === 2;
    return [{
      cap: `<b>Estimate first.</b> ${T(`${a * a}<${n}<${b * b}`)}, so ${T(`\\sqrt{${n}}`)} is between ${a} and ${b}, about <b>${est}</b>.`,
      run: (c) => c.fadeIn(l0, 300)
    }, {
      cap: `Key it in: <b>2nd x²</b> (that’s ${T('\\sqrt{\\phantom{x}}')}), then ${n}, then <b>ENTER</b>. The screen shows <b>${shown}</b>.`,
      run: async (c) => {
        await Promise.all([c.fadeIn(lcd, 300), c.fadeIn(keys, 300)]);
        out.style.opacity = 0;
        for (const k of keys.children) { k.classList.add('on'); await c.anim(k, [{ transform: 'scale(1.18)' }, { transform: 'scale(1)' }], 220); }
        await Promise.all([c.fadeIn(out, 300), c.fadeIn(l1, 300)]);
      }
    }, {
      cap: `Nearest <b>${PLACE[p]}</b>: keep <b>${p}</b> decimal place${p > 1 ? 's' : ''}. The <b>next</b> digit, ${next}, decides which way to round.`,
      run: (c) => { dg.forEach((e, i) => e.classList.add(i < p ? 'keep' : i === p ? 'next' : 'dim')); return Promise.all([c.pop(dg[p], 400), c.fadeIn(l2, 300)]); }
    }, {
      cap: up ? `${next} is 5 or more, so round <b>up</b>: ${T(`\\sqrt{${n}}\\approx${res}`)}.${zero ? ' Keep the 0 on the end: it shows the answer is to the hundredth.' : ''}`
        : `${next} is less than 5, so the kept digits stay as they are: ${T(`\\sqrt{${n}}\\approx${res}`)}.`,
      run: (c) => { rbig.innerHTML = `${T(`\\sqrt{${n}}\\approx`)} <b>${res}</b>`; return Promise.all([c.fadeIn(l3, 300), c.pop(rbig, 420)]); }
    }, {
      cap: `Compare: ${res} is close to our estimate of ${est} <b>✓</b>. If the calculator gives something far from your estimate, you keyed something in wrong.`,
      run: (c) => c.fadeIn(l4, 300)
    }];
  }
};

/* ============ 5. Side of a square from its area, edge of a cube from its volume ============ */
const garden = {
  title: 'Side from area, edge from volume',
  height: 400,
  minW: 860,
  choices: [{ v: 'sq|20', label: 'square, 20 m²' }, { v: 'cu|50', label: 'cube, 50 cm³' }, { v: 'sq|49', label: 'square, 49 m²' },
    { sep: 'Example 5 check:' }, { v: 'sq|55', label: 'garden, 55 m²' }, { v: 'cu|90', label: 'crate, 90 cm³' }],
  intro: (v) => { const [m, s] = v.split('|'); return m === 'sq' ? `A square has an area of <b>${s} m²</b>. How long is each side?` : `A cube has a volume of <b>${s} cm³</b>. How long is each edge?`; },
  make(stage, v, ex) {
    const W = ex.W, [m, s] = v.split('|'), A = +s, sq = m === 'sq', k = sq ? 2 : 3, unit = sq ? 'm' : 'cm';
    const a = sq ? isqrt(A) : icbrt(A), b = a + 1, lo = a ** k, hi = b ** k, d1 = A - lo, d2 = hi - A, perfect = d1 === 0;
    const x = sq ? Math.sqrt(A) : Math.cbrt(A), res = rnd(x, 2), near = d1 < d2 ? a : b;
    const R = sq ? `\\sqrt{${A}}` : `\\sqrt[3]{${A}}`, sym = sq ? 's' : 'e';
    const svg = svgLayer(stage, 420, 400);
    const pic = [];
    if (sq) {
      const u = 300 / (perfect ? a : b), S = x * u, ox = 60, oy = 24;
      pic.push(svgEl('rect', { x: ox, y: oy, width: S, height: S, class: 'u1l5-gsq' }, svg));
      const gg = svgEl('g', { class: 'u1l5-ggrid' }, svg);
      for (let i = 0; i <= a; i++) { svgEl('line', { x1: ox + i * u, x2: ox + i * u, y1: oy, y2: oy + a * u }, gg); svgEl('line', { x1: ox, x2: ox + a * u, y1: oy + i * u, y2: oy + i * u }, gg); }
      pic.push(gg);
      if (!perfect) { const gh = svgEl('rect', { x: ox, y: oy, width: b * u, height: b * u, class: 'u1l5-gghost' }, svg); pic.push(gh); }
      const lab = add(stage, h('div', 'u1l5-garea c', `Area<br><b>${A} m²</b>`), ox + S / 2, oy + S / 2); pic.push(lab);
      const sl = add(stage, h('div', 'u1l5-gside c', `${sym} = ?`), ox + S / 2, oy + (perfect ? S : b * u) + 24); pic.push(sl);
      pic.sl = sl;
    } else {
      const u = 140 / (perfect ? a : b), cs = Math.cos(Math.PI / 6), P = [70 + cs * b * u, 22 + 2 * b * u];
      if (!perfect) pic.push(isoBox(svg, P, u, b, b, b, 'ghost'));
      pic.push(isoBox(svg, P, u, a, a, a, 'pos'));
      const lab = add(stage, h('div', 'u1l5-garea', `Volume<br><b>${A} cm³</b>`), P[0] + cs * b * u + 14, 22); pic.push(lab);
      const sl = add(stage, h('div', 'u1l5-gside c', `${sym} = ?`), P[0], P[1] + 24); pic.push(sl);
      if (!perfect) { const gl = add(stage, h('div', 'u1l5-glegend'), 20, 366); gl.innerHTML = `<span class="u1l5-sw pos"></span>${a} × ${a} × ${a} = ${lo} &nbsp; <span class="u1l5-sw gh"></span>${b} × ${b} × ${b} = ${hi}`; pic.push(gl); }
      pic.sl = sl;
    }
    hide(...pic);
    const P = panel(stage, 450, 18, W - 470);
    const l0 = line(P, sq ? `${T('A=s\\times s')}, so ${T(`s=${R}`)}` : `${T('V=e\\times e\\times e')}, so ${T(`e=${R}`)}`);
    const l1 = line(P, perfect ? `${T(`${a}${sq ? `\\times${a}` : `\\times${a}\\times${a}`}=${A}`)}: a perfect ${sq ? 'square' : 'cube'}` : `${T(`${lo}<${A}<${hi}`)}, so ${T(`${a}<${sym}<${b}`)}`);
    const l2 = line(P, perfect ? `${T(`${sym}=${R}=${a}`)} ${unit} exactly` : `${A} is ${d1} past ${lo}, ${d2} short of ${hi}: ${T(`${sym}\\approx${near}`)} ${unit}`);
    const l3 = line(P, `calculator: ${T(`${R}=${dots(x, 5)}`)}`);
    const l4 = line(P, `${T(`${sym}\\approx`)} <b class="u1l5-ok">${res} ${unit}</b>`, 'big');
    const chk = sq ? res * res : res ** 3, l5 = line(P, `check: ${T(`${res}${sq ? '^2' : '^3'}=${dots(chk, sq ? 2 : 1)}\\approx${A}`)} ✓`);
    const showPic = (c) => Promise.all(pic.map((e, i) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], 400, { delay: i * 100 })));
    const keysTxt = sq ? `<b>2nd x²</b> ${A} <b>ENTER</b>` : `<b>3 2nd ^</b> ${A} <b>ENTER</b>`;
    if (perfect) return [
      { cap: sq ? `Area = side × side, so the side is ${T(`s=${R}`)}.` : `Volume = edge × edge × edge, so the edge is ${T(`e=${R}`)}.`, run: (c) => Promise.all([showPic(c), c.fadeIn(l0, 300)]) },
      { cap: `${A} is a perfect ${sq ? 'square' : 'cube'}: ${sq ? `${a} × ${a}` : `${a} × ${a} × ${a}`} = ${A}. So ${T(`${sym}=${a}`)} ${unit} exactly. No calculator needed!`, run: (c) => { pic.sl.innerHTML = `${sym} = <b>${a} ${unit}</b>`; return Promise.all([c.fadeIn(l1, 300), c.fadeIn(l2, 300, { delay: 200 }), c.pop(pic.sl, 400)]); } }
    ];
    return [{
      cap: sq ? `Area = side × side, so the side is ${T(`s=${R}`)}. ${A} is not a perfect square, so estimate first.` : `Volume = edge × edge × edge, so the edge is ${T(`e=${R}`)}. ${A} is not a perfect cube, so estimate first.`,
      run: (c) => Promise.all([showPic(c), c.fadeIn(l0, 300)])
    }, {
      cap: `Trap it with perfect ${sq ? 'squares' : 'cubes'}: ${T(`${lo}<${A}<${hi}`)}, so ${T(`${a}<${sym}<${b}`)}. ${sq ? `The ${a} × ${a} grid fits inside; the dashed ${b} × ${b} square is too big.` : `The ${a}-cube fits inside; the dashed ${b}-cube is too big.`}`,
      run: (c) => c.fadeIn(l1, 300)
    }, {
      cap: `${A} is ${d1} past ${lo} but ${d2} short of ${hi}, so to the nearest whole number, ${T(`${sym}\\approx${near}`)} ${unit}.`,
      run: (c) => { pic.sl.innerHTML = `${sym} ≈ ${near} ${unit}`; return Promise.all([c.fadeIn(l2, 300), c.pop(pic.sl, 400)]); }
    }, {
      cap: `Calculator: ${keysTxt} gives ${disp(x)}. To the nearest hundredth, ${T(`${sym}\\approx${res}`)} ${unit}.`,
      run: (c) => { pic.sl.innerHTML = `${sym} ≈ <b>${res} ${unit}</b>`; return Promise.all([c.fadeIn(l3, 300), c.fadeIn(l4, 300, { delay: 200 }), c.pop(pic.sl, 400)]); }
    }, {
      cap: `Check: ${sq ? `${res} × ${res}` : `${res} × ${res} × ${res}`} = ${dots(chk, sq ? 2 : 1).replace('\\ldots', '…')}, very close to ${A} ✓. And ${res} is close to our estimate of ${near}.`,
      run: (c) => c.fadeIn(l5, 300)
    }];
  }
};

/* ============ warm-up: the photo wall ============ */
function photo(g, x, y, s, k, extra) {
  const f = svgEl('g', { class: 'u1l5-ph' + (extra ? ' extra' : '') }, g);
  svgEl('rect', { x: x + 1, y: y + 1, width: s - 2, height: s - 2, rx: Math.min(3, s / 8), class: 'fr' }, f);
  if (s < 13) { svgEl('rect', { x: x + 3, y: y + 3, width: s - 6, height: s - 6, class: 'in' + k }, f); return f; }
  const i = s * 0.16, w = s - 2 * i;
  svgEl('rect', { x: x + i, y: y + i, width: w, height: w, class: 'in' + k }, f);
  if (k === 0) { svgEl('circle', { cx: x + i + w * 0.72, cy: y + i + w * 0.28, r: w * 0.11, class: 'sun' }, f); svgEl('path', { d: `M${x + i} ${y + i + w} L${x + i + w * 0.36} ${y + i + w * 0.42} L${x + i + w * 0.62} ${y + i + w} Z`, class: 'mt' }, f); }
  else if (k === 1) { svgEl('circle', { cx: x + i + w / 2, cy: y + i + w * 0.4, r: w * 0.16, class: 'pp' }, f); svgEl('path', { d: `M${x + i + w * 0.22} ${y + i + w} A ${w * 0.28} ${w * 0.3} 0 0 1 ${x + i + w * 0.78} ${y + i + w} Z`, class: 'pp' }, f); }
  else { svgEl('path', { d: `M${x + i + w * 0.22} ${y + i + w * 0.78} L${x + i + w / 2} ${y + i + w * 0.14} L${x + i + w * 0.78} ${y + i + w * 0.78} Z`, class: 'tr' }, f); svgEl('rect', { x: x + i + w * 0.44, y: y + i + w * 0.78, width: w * 0.12, height: w * 0.22, class: 'tk' }, f); }
  return f;
}
function mountWall() {
  const host = document.getElementById('u1l5-wall'); if (!host) return;
  const lab = document.getElementById('u1l5-wlab'), Wd = 560, Hd = 262;
  const svg = svgEl('svg', { width: Wd, height: Hd, viewBox: `0 0 ${Wd} ${Hd}`, class: 'u1l5-wsvg' }); host.appendChild(svg);
  const big = h('div', 'u1l5-wbig'); host.appendChild(big);
  let n = 4;
  function draw(mode) {
    svg.innerHTML = '';
    const photos = mode || n * n, k = isqrt(photos), extra = photos - k * k, K = extra ? k + 1 : k;
    const s = Math.min(46, (Hd - 12) / K), ox = 8, oy = 6, g = svgEl('g', {}, svg);
    for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) photo(g, ox + i * s, oy + j * s, s, (i + 2 * j) % 3);
    for (let e = 0; e < extra; e++) { const [cx, cy] = e < k ? [k, e] : [e - k, k]; photo(g, ox + cx * s, oy + cy * s, s, e % 3, true); }
    if (extra) svgEl('rect', { x: ox - 2, y: oy - 2, width: K * s + 4, height: K * s + 4, rx: 6, class: 'u1l5-wghost' }, svg);
    if (!mode) { lab.innerHTML = `${n} × ${n} wall`; big.innerHTML = `<b>${n * n}</b> photo${n > 1 ? 's' : ''}<span>${T(`${n}\\times${n}=${n * n}`)}</span>`; }
    else { lab.innerHTML = `${mode} photos`; big.innerHTML = `<b>${mode}</b> photos<span>${k} × ${k} = ${k * k}, <b class="u1l5-red">${extra} left over</b></span><span class="muted">${K} × ${K} needs ${K * K}</span>`; }
    big.style.left = (ox + K * s + 30) + 'px';
    svg.animate([{ opacity: 0.4 }, { opacity: 1 }], 250);
  }
  document.querySelectorAll('[data-u1l5-w]').forEach((b) => b.addEventListener('click', () => {
    const v = b.dataset.u1l5W;
    if (v === '-1' || v === '+1') { n = Math.max(1, Math.min(15, n + (+v))); draw(0); } else draw(+v);
  }));
  draw(0);
  // the board's number line: 34 … 66, the walls 36, 49, 64, and 50 photos
  const lh = document.getElementById('u1l5-wline'); if (!lh) return;
  const LW = 560, LH = 96, lo = 34, hi = 66, X = (v) => 26 + ((v - lo) / (hi - lo)) * (LW - 52), y = 52;
  const ls = svgEl('svg', { width: LW, height: LH, viewBox: `0 0 ${LW} ${LH}` }, lh);
  svgEl('line', { x1: 12, x2: LW - 12, y1: y, y2: y, class: 'u1l5-ax' }, ls); svgEl('path', { d: `M${LW - 4} ${y} l-12 -7 v14 z`, class: 'u1l5-axh' }, ls);
  for (let v = lo; v <= hi; v++) svgEl('line', { x1: X(v), x2: X(v), y1: y - 5, y2: y + 5, class: 'u1l5-tk sm' }, ls);
  [[36, 6], [49, 7], [64, 8]].forEach(([v, s]) => {
    svgEl('line', { x1: X(v), x2: X(v), y1: y - 11, y2: y + 11, class: 'u1l5-tk' }, ls);
    const t = svgEl('text', { x: X(v), y: y + 32, 'text-anchor': 'middle', class: 'u1l5-wl-n' }, ls); t.textContent = v;
    const p = h('div', 'u1l5-wl-pill c', `${s} × ${s} wall`); p.style.left = X(v) + 'px'; p.style.top = '16px'; lh.appendChild(p);
  });
  svgEl('circle', { cx: X(50), cy: y, r: 7, class: 'u1l5-wl-dot' }, ls);
  const r = h('div', 'u1l5-wl-50', '← 50 photos'); r.style.left = (X(50) + 12) + 'px'; r.style.top = (y + 10) + 'px'; lh.appendChild(r);
}

/* ============ the tables, the small figures and the Example 3(c) plot ============ */
function mountStatics() {
  const sqH = document.getElementById('u1l5-sqtab'), cuH = document.getElementById('u1l5-cutab'), tabs = {};
  if (sqH) tabs.sq = new ValueTable(sqH, { headers: ['n', 'n^2'], rows: Array.from({ length: 15 }, (_, i) => [i + 1, (i + 1) ** 2]), layout: 'h', cellW: 56, cellH: 46, hide: 1, cls: 'u1l5-vt' });
  if (cuH) tabs.cu = new ValueTable(cuH, { headers: ['n', 'n^3'], rows: Array.from({ length: 10 }, (_, i) => [i + 1, (i + 1) ** 3]), layout: 'h', cellW: 76, cellH: 46, hide: 1, cls: 'u1l5-vt' });
  document.querySelectorAll('[data-u1l5-fill]').forEach((b) => b.addEventListener('click', () => { const t = tabs[b.dataset.u1l5Fill]; if (t) t.fill(liveCtx(), { stagger: 40 }); }));
  const f40 = document.getElementById('u1l5-fig40');
  if (f40) { const N = new NumberLine(f40, { width: 360, height: 92, min: 5.6, max: 7.4, step: 1, minor: 0.1 }); N.point(6.32, { color: 'blue', label: '\\sqrt{40}\\approx6.3', tex: true }); }
  const ph = document.getElementById('u1l5-plot27');
  if (ph) {
    const N = new NumberLine(ph, { width: 300, height: 92, min: 4.8, max: 6.2, step: 1, minor: 0.1 });
    let pt = null; N.el.setAttribute('data-tap', ''); N.el.style.cursor = 'pointer';
    N.el.addEventListener('click', (e) => {
      const r = N.el.getBoundingClientRect(), k = r.width / (N.W || 300), v = Math.round(N.fromPx((e.clientX - r.left) / k) * 10) / 10;
      if (v < 4.8 || v > 6.2) return; if (pt) pt.remove(); if (pt && pt.label) pt.label.remove();
      pt = N.point(v, { color: 'amber', label: v.toFixed(1) });
    });
  }
  const pa = document.getElementById('u1l5-plot27a');
  if (pa) { const N = new NumberLine(pa, { width: 300, height: 92, min: 4.8, max: 6.2, step: 1, minor: 0.1 }); N.point(5.2, { color: 'red', label: '\\sqrt{27}\\approx5.2', tex: true }); }
}

mountWall();
mountStatics();
export const explainers = mountExplainers({ tiles, cubes, trap, zoom, round, garden });

/* ============ Stand Up Break! — roots in your head, trap it, one decimal (lessons/js/standup.js) ============ */
const suLab = (i) => '\\text{(' + 'abc'[i] + ')}\\ ';
const suGrid = (items) => items.map((x, j) => suLab(j) + '{' + x + '}').join('\\qquad ');
const SKIP = new Set([27, 95, 60, 40, 55, 30, 70, 110, 18, 85, 50, 48, 58, 45, 68]); // Examples 3–5 and Assignment 5 numbers
function suNon(r, lo, hi) { for (;;) { const n = r.int(lo, hi), a = isqrt(n); if (a * a !== n && !SKIP.has(n)) return n; } }
function suTrap(n) {
  const a = isqrt(n), b = a + 1, d1 = n - a * a, d2 = b * b - n;
  return [`${a * a}<${n}<${b * b},\\ \\text{so}\\ ${a}<\\sqrt{${n}}<${b}`, `${d1}\\text{ past, }${d2}\\text{ short: closer to }${d1 < d2 ? a : b}`];
}
standup('u1l5', {
  intro: 'Use the perfect-square list: trap the number between two perfect squares, then see which one it is nearer to.',
  levels: {
    BEG: (r) => { // Examples 1–2: roots of perfect squares and cubes, in your head
      // leave out the Assignment 5 roots (Q1: 3, 6, 10, 2, 13, 8; Q2: the cubes of 6–10)
      const ASQ = new Set([2, 3, 6, 8, 10, 13]);
      let p, q, c; do { p = r.int(4, 15); q = r.int(4, 15); c = r.int(2, 5); } while (p === q || ASQ.has(p) || ASQ.has(q));
      return { text: 'Evaluate each root in your head.', q: suGrid([`\\sqrt{${p * p}}`, `\\sqrt{${q * q}}`, `\\sqrt[3]{${tn(c ** 3)}}`]),
        a: [`\\text{(a)}\\ ${p}\\times${p}=${p * p},\\ \\text{so}\\ \\sqrt{${p * p}}=${p}`, `\\text{(b)}\\ ${q}\\times${q}=${q * q},\\ \\text{so}\\ \\sqrt{${q * q}}=${q}`, `\\text{(c)}\\ ${c}\\times${c}\\times${c}=${tn(c ** 3)},\\ \\text{so}\\ \\sqrt[3]{${tn(c ** 3)}}=${c}`] };
    },
    PRG: (r) => { // Example 3: two whole numbers, and which is closer
      let m, n; do { m = suNon(r, 5, 99); n = suNon(r, 100, 220); } while (m === n);
      return { text: 'State the two whole numbers each root lies between, and which one it is <b>closer to</b>.', q: `\\text{(a)}\\ \\sqrt{${m}}\\qquad\\qquad\\text{(b)}\\ \\sqrt{${n}}`,
        a: ['\\text{(a)}\\ ' + suTrap(m)[0], '\\phantom{\\text{(a)}\\ }' + suTrap(m)[1], '\\text{(b)}\\ ' + suTrap(n)[0], '\\phantom{\\text{(b)}\\ }' + suTrap(n)[1]] };
    },
    MAS: (r) => { // a one-decimal estimate by hand, sometimes as the side of a square
      for (;;) {
        const n = suNon(r, 10, 220), a = isqrt(n), g = 2 * a + 1, d = n - a * a, est = rnd(a + d / g, 1);
        if (rnd(Math.sqrt(n), 1) !== est) continue; // keep the ones where the hand estimate matches the calculator's tenth
        const steps = [`${a * a}<${n}<${(a + 1) ** 2},\\ \\text{so}\\ ${a}<\\sqrt{${n}}<${a + 1}`, `${n}\\text{ is }${d}\\text{ of the }${g}\\text{ steps from }${a * a}\\text{ to }${(a + 1) ** 2}\\ (${d}\\div${g}\\approx${rnd(d / g, 1)})`];
        if (r.chance(0.5)) return { text: `Without a calculator, estimate ${T(`\\sqrt{${n}}`)} to <b>one decimal place</b>.`, q: `\\sqrt{${n}}\\approx\\ ?`, a: steps.concat([`\\sqrt{${n}}\\approx${est}\\quad(\\text{calculator: }${dots(Math.sqrt(n), 3)})`]) };
        const what = r.pick([['square patio', 'm'], ['square poster', 'dm'], ['square quilt', 'ft'], ['square sandbox', 'm'], ['square tile', 'cm']]);
        return { text: `A ${what[0]} has an area of <b>${n} ${what[1]}²</b>. Without a calculator, estimate its side length to <b>one decimal place</b>.`, q: `s=\\sqrt{${n}}\\approx\\ ?`,
          a: steps.concat([`s\\approx${est}\\text{ ${what[1]}}\\quad(\\text{calculator: }${dots(Math.sqrt(n), 3)})`]) };
      }
    }
  }
});
