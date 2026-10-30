/* Math 15 · Unit 6 · Lesson 1 — Review: The Pythagorean Theorem.
 * Warm-up (Will It Fit? a moving box, a drawer and a car trunk: corner to corner is the hypotenuse), static figures,
 * and the explainers:
 *   nameSides (find the square corner → the legs touch it, the hypotenuse is across; a turned triangle and a "roof";
 *   Example 1 checks), squares (squares on the sides, counted: 9 + 16 = 25; Example 2(b)), whyAll (four triangles in
 *   a big square slide around: the gap c² becomes a² + b²), verify (a² + b² and c² side by side; a 5–6–8 triangle that
 *   only looks right), hypSteps (square, add, then square root, and the lengths compared; Example 3 and warm-up checks),
 *   simplify (the biggest perfect square: √80 = 4√5), missingLeg (the big square minus the known square leaves the
 *   missing square; Example 4 and the drawer), decide (find the right angle → hypotenuse or leg → add or subtract;
 *   Example 5 checks), ladder (a 17 ft ladder slides down a wall: always the hypotenuse).
 * Math History: Plimpton 322 (row 1: 119 and 169 → 120). Stand Up Break: hypotenuse → missing leg → word problems.
 * Colours (as in Math 10C u6): leg a / vertical / rise purple, leg b / horizontal / run amber, hypotenuse blue. */
import {
  h, tex, add, box, RightTriangle, Flowchart, stamp, stampIn, checkCard, mountExplainers, pop, fadeIn, appear, pulse,
  sleep, tween, anim, svgEl, rightMark, liveCtx
} from '../blocks.js';
import { standup } from '../standup.js';

const T = (s) => tex(s);
const LA = '#7b4fc4', LB = '#c27a0e', HC = '#1f5bd6', RED = '#c93a33', OK = '#12805a', INK = '#1c2230';
const nT = (n) => { const s = String(n); return Math.abs(n) >= 1000 && Number.isInteger(n) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s; }; // 16 900 → 16\,900
const nH = (n) => { const s = String(n); return Math.abs(n) >= 1000 && Number.isInteger(n) ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s; };
const lab = (host, x, y, html, cls = '') => { const d = h('div', 'u6l1-lab ' + cls, html); d.style.position = 'absolute'; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.translate = '-50% -50%'; host.appendChild(d); return d; };
const panel = (stage, x, y, w, hh, title) => add(stage, box(h('div', 'u6l1-panel', title ? `<div class="u6l1-ph">${title}</div>` : ''), w, hh), x, y);
const line = (p, html, cls = '') => { const d = h('div', 'u6l1-line ' + cls, html); p.appendChild(d); return d; };
const hide = (el) => { el.style.opacity = 0; return el; };
const show = (c, el, ms = 320) => fadeIn(c, el, ms);
const fullSvg = (stage, W, H) => { const s = svgEl('svg', { width: W, height: H, class: 'u6l1-svg' }); s.style.position = 'absolute'; s.style.left = '0px'; s.style.top = '0px'; stage.appendChild(s); return s; };
const growIn = (c, el, ms = 650) => anim(c, el, [{ opacity: 0, transform: 'scale(.25)' }, { opacity: 1, transform: 'scale(1)' }], ms);
const norm = (x, y) => { const L = Math.hypot(x, y) || 1; return [x / L, y / L]; };
/** √n in simplest form: [k, m] with n = k²·m */
function simpRad(n) { let k = 1; for (let d = 2; d * d <= n; d++) if (n % (d * d) === 0) k = d; return [k, n / (k * k)]; }
const radTex = (n) => { const [k, m] = simpRad(n); return m === 1 ? String(k) : (k === 1 ? '' : k) + `\\sqrt{${m}}`; };
const isSq = (n) => Number.isInteger(Math.sqrt(n));

/* ======================================================================================
 * Drawing helpers: a triangle fitted in a box; squares on the sides; real-life scenes
 * ====================================================================================== */
/** a triangle with vertices R (the right angle), P, Q in units (y up), fitted into bx = [x, y, w, h] of host.
 *  o: { labels: { RP, RQ, PQ } (HTML), pad, right (false: no square mark), svg (draw into this one) } */
function triangle(host, svg, pts, bx, o = {}) {
  const [X, Y, Wd, Hd] = bx, pad = o.pad ?? 40;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const sc = Math.min((Wd - 2 * pad) / (x1 - x0 || 1), (Hd - 2 * pad) / (y1 - y0 || 1));
  const ox = X + (Wd - (x1 - x0) * sc) / 2, oy = Y + (Hd - (y1 - y0) * sc) / 2;
  const px = (p) => [ox + (p[0] - x0) * sc, oy + (y1 - p[1]) * sc];
  const [R, P, Q] = pts.map(px), cen = [(R[0] + P[0] + Q[0]) / 3, (R[1] + P[1] + Q[1]) / 3];
  const fill = svgEl('polygon', { points: [R, P, Q].map((p) => p.join(',')).join(' '), fill: '#f4f6fb', stroke: 'none' }, svg);
  const side = (A, B) => svgEl('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: INK, 'stroke-width': 4, 'stroke-linecap': 'round', class: 'u6l1-side' }, svg);
  const sides = { RP: side(R, P), RQ: side(R, Q), PQ: side(P, Q) };
  const mark = o.right === false ? null : rightMark(svg, R, P, Q, 17, { color: INK, width: 2.2 });
  const out = (A, B, d) => { const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], [nx, ny] = norm(m[0] - cen[0], m[1] - cen[1]); return [m[0] + nx * d, m[1] + ny * d]; };
  const ends = { RP: [R, P], RQ: [R, Q], PQ: [P, Q] }, labs = {};
  /* put a label just outside side k, clear of it whatever its size */
  const seat = (k, el, gap = o.gap ?? 8) => {
    const [A, B] = ends[k], m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], [nx, ny] = norm(m[0] - cen[0], m[1] - cen[1]);
    const d = gap + Math.abs(nx) * el.offsetWidth / 2 + Math.abs(ny) * el.offsetHeight / 2;
    el.style.left = m[0] + nx * d + 'px'; el.style.top = m[1] + ny * d + 'px';
  };
  for (const k in ends) if (o.labels && o.labels[k] != null) { labs[k] = lab(host, 0, 0, o.labels[k], 'u6l1-slab'); seat(k, labs[k]); }
  return { fill, sides, mark, labs, px, R, P, Q, cen, seat, out: (k, d) => out(...ends[k], d), sc };
}
/** colour a side (and its label) */
const tint = (t, k, color) => { t.sides[k].setAttribute('stroke', color); if (t.labs[k]) t.labs[k].style.color = color; };

/** squares on the sides of a right triangle: leg a vertical (square to the left), leg b horizontal (square below),
 *  hypotenuse square outward. bx = [x, y, w, h]. o: { grid (unit squares), labels: { a, b, c } HTML } */
function sqFig(host, svg, a, b, bx, o = {}) {
  const [X, Y, Wd, Hd] = bx, c = Math.hypot(a, b);
  const sc = Math.min(Wd / (2 * a + b), Hd / (a + 2 * b));
  const ox = X + (Wd - (2 * a + b) * sc) / 2 + a * sc, oy = Y + (Hd - (a + 2 * b) * sc) / 2 + (a + b) * sc;
  const P = (x, y) => [ox + x * sc, oy - y * sc];
  const g = (cls) => { const e = svgEl('g', { class: cls }, svg); e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; return e; };
  const square = (pts, color) => { const e = g('u6l1-sqg'); svgEl('polygon', { points: pts.map((p) => P(...p).join(',')).join(' '), fill: color, 'fill-opacity': 0.14, stroke: color, 'stroke-width': 3, 'stroke-linejoin': 'round' }, e); return e; };
  const gridLines = (e, color, segs) => segs.forEach(([p, q]) => { const A = P(...p), B = P(...q); svgEl('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: color, 'stroke-opacity': 0.35, 'stroke-width': 1.2 }, e); });
  const sqA = square([[0, 0], [0, a], [-a, a], [-a, 0]], LA), sqB = square([[0, 0], [b, 0], [b, -b], [0, -b]], LB), sqC = square([[0, a], [b, 0], [b + a, b], [a, a + b]], HC);
  if (o.grid) {
    const sa = [], sb = [], scc = [];
    for (let i = 1; i < a; i++) sa.push([[-i, 0], [-i, a]], [[-a, i], [0, i]]);
    for (let i = 1; i < b; i++) sb.push([[i, 0], [i, -b]], [[0, -i], [b, -i]]);
    gridLines(sqA, LA, sa); gridLines(sqB, LB, sb);
    if (Number.isInteger(c)) {
      const n = [a / c, b / c], t = [b / c, -a / c]; // outward normal, and along the hypotenuse from (0, a)
      for (let i = 1; i < c; i++) {
        scc.push([[n[0] * i, a + n[1] * i], [b + n[0] * i, n[1] * i]]);
        scc.push([[t[0] * i, a + t[1] * i], [t[0] * i + n[0] * c, a + t[1] * i + n[1] * c]]);
      }
      gridLines(sqC, HC, scc);
    }
  }
  [sqA, sqB, sqC].forEach(hide);
  svgEl('polygon', { points: [P(0, 0), P(b, 0), P(0, a)].map((p) => p.join(',')).join(' '), fill: '#fff', stroke: 'none' }, svg);
  const sd = (p, q, color) => { const A = P(...p), B = P(...q); return svgEl('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg); };
  sd([0, 0], [0, a], LA); sd([0, 0], [b, 0], LB); sd([0, a], [b, 0], HC);
  rightMark(svg, P(0, 0), P(1, 0), P(0, 1), Math.min(16, sc * 0.45), { color: INK, width: 2 });
  const L = o.labels || {}, nc = norm(a, b);
  const labs = {
    a: L.a != null ? lab(host, P(0, a / 2)[0] + 18, P(0, a / 2)[1], L.a, 'u6l1-slab u6l1-in') : null,
    b: L.b != null ? lab(host, P(b / 2, 0)[0], P(b / 2, 0)[1] - 17, L.b, 'u6l1-slab u6l1-in') : null,
    c: L.c != null ? lab(host, P(b / 2, a / 2)[0] + nc[0] * 24, P(b / 2, a / 2)[1] - nc[1] * 24, L.c, 'u6l1-slab u6l1-in') : null
  };
  Object.entries(labs).forEach(([k, e]) => { if (e) e.style.color = { a: LA, b: LB, c: HC }[k]; });
  // an area label; in a small square only the last part (the number) fits
  const area = (x, y, html, color, side) => { const small = side * sc < 104; const e = hide(lab(host, ...P(x, y), small && o.short ? o.short(html) : html, 'u6l1-area' + (small ? ' u6l1-asm' : ''))); e.style.color = color; return e; };
  return { P, sc, sqA, sqB, sqC, labs, areaA: (html) => area(-a / 2, a / 2, html, LA, a), areaB: (html) => area(b / 2, -b / 2, html, LB, b), areaC: (html) => area((a + b) / 2, (a + b) / 2, html, HC, c) };
}

/** "5^2=25" (rendered) → just "25": the part after the last = sign, for a small square */
const SHORT = (html) => { const m = /data-tex="([^"]*)"/.exec(html) || /<annotation[^>]*>([^<]*)<\/annotation>/.exec(html); return m && m[1].includes('=') ? T(m[1].split('=').pop()) : html; };

/* real-life scenes: a right triangle with horizontal leg H and vertical leg V (units), right angle bottom-left ('bl') or
 * bottom-right ('br'), dressed up as a ladder, a field, a drawer or a car trunk. Labels { H, V, D } are HTML. */
const SCN = {
  ladder: { H: 8, V: 15, corner: 'bl', labels: { H: '8 ft', V: T('h'), D: '17 ft' }, unk: 'V' },
  field: { H: 8, V: 6, corner: 'br', labels: { H: '8 m', V: '6 m', D: T('d') }, unk: 'D' },
  drawer: { H: 60, V: 25, corner: 'bl', labels: { H: '60 cm', V: '?', D: '65 cm' }, unk: 'V' },
  trunk: { H: 120, V: 50, corner: 'bl', labels: { H: '120 cm', V: '50 cm', D: '?' }, unk: 'D' }
};
function scene(host, svg, kind, bx, o = {}) {
  const d = SCN[kind], { H, V } = d, [X, Y, Wd, Hd] = bx, br = d.corner === 'br';
  const m = { ladder: [1.6, 0.6, 1.2, 1.4], field: [0.9, 0.9, 0.9, 0.9], drawer: [7, 7, 12, 12], trunk: [16, 16, 22, 22] }[kind]; // margins l, r, b, t (units)
  const sc = Math.min((Wd - 70) / (H + m[0] + m[1]), (Hd - 50) / (V + m[2] + m[3]));
  const ox = X + (Wd - (H + m[0] + m[1]) * sc) / 2 + m[0] * sc, oy = Y + (Hd - (V + m[2] + m[3]) * sc) / 2 + (V + m[3]) * sc;
  const P = (x, y) => [ox + x * sc, oy - y * sc];
  const poly = (pts, attrs) => svgEl('polygon', Object.assign({ points: pts.map((p) => P(...p).join(',')).join(' ') }, attrs), svg);
  const seg = (p, q, attrs) => { const A = P(...p), B = P(...q); return svgEl('line', Object.assign({ x1: A[0], y1: A[1], x2: B[0], y2: B[1], 'stroke-linecap': 'round' }, attrs), svg); };
  const R = br ? [H, 0] : [0, 0], Hs = [[0, 0], [H, 0]], Vs = br ? [[H, 0], [H, V]] : [[0, 0], [0, V]], Ds = br ? [[0, 0], [H, V]] : [[0, V], [H, 0]];
  // decorations
  if (kind === 'ladder') {
    poly([[-1.1, 0], [0, 0], [0, V + 1.2], [-1.1, V + 1.2]], { fill: '#e9d8c4', stroke: '#9a7b5c', 'stroke-width': 1.5 });
    for (let y = 1; y < V + 1.2; y += 1) seg([-1.1, y], [0, y], { stroke: '#c9ad8e', 'stroke-width': 1.2 });
    seg([-1.4, 0], [H + 0.5, 0], { stroke: '#5d8a4a', 'stroke-width': 5 });
  } else if (kind === 'field') {
    poly([[0, 0], [H, 0], [H, V], [0, V]], { fill: '#e3f1da', stroke: '#6a9a55', 'stroke-width': 2.5 });
  } else if (kind === 'drawer') {
    poly([[-4, -6], [H + 4, -6], [H + 4, V + 4], [-4, V + 4]], { fill: '#e8eef8', stroke: '#9aa6bb', 'stroke-width': 1.5, rx: 6 });
    poly([[0, 0], [H, 0], [H, V], [0, V]], { fill: '#fff3d4', stroke: '#c88c14', 'stroke-width': 2.5 });
    poly([[-1, -5], [H + 1, -5], [H + 1, 0], [-1, 0]], { fill: '#9a6a2a' });
  } else if (kind === 'trunk') {
    poly([[-10, -12], [H + 10, -12], [H + 10, V + 18], [-10, V + 18]], { fill: '#eef0f4', stroke: INK, 'stroke-width': 2 });
    poly([[-10, -12], [-3, -12], [-3, -4], [-10, -4]], { fill: RED }); poly([[H + 3, -12], [H + 10, -12], [H + 10, -4], [H + 3, -4]], { fill: RED });
    poly([[0, 0], [H, 0], [H, V], [0, V]], { fill: '#fff3d4', stroke: '#c88c14', 'stroke-width': 2.5 });
  }
  // the triangle
  const sides = {
    H: seg(...Hs, { stroke: INK, 'stroke-width': 3.5 }),
    V: seg(...Vs, { stroke: INK, 'stroke-width': 3.5 }),
    D: seg(...Ds, { stroke: kind === 'ladder' || kind === 'drawer' ? '#8a5a22' : INK, 'stroke-width': kind === 'ladder' ? 7 : kind === 'drawer' ? 6 : 3.5, 'stroke-dasharray': kind === 'field' || kind === 'trunk' ? '9 6' : null })
  };
  if (kind === 'ladder') { // rungs
    const [p, q] = Ds, n = 12;
    for (let i = 1; i < n; i++) { const t = i / n, c0 = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; seg([c0[0] - 0.22, c0[1] - 0.12], [c0[0] + 0.22, c0[1] + 0.12], { stroke: '#8a5a22', 'stroke-width': 3 }); }
  }
  const RP = P(...R), mark = rightMark(svg, RP, P(br ? 0 : 1, 0), P(br ? H : 0, br ? 1 : 1), 15, { color: INK, width: 2.2 });
  const cen = P(H * (br ? 2 / 3 : 1 / 3), V / 3);
  const out = ([p, q], dd) => { const A = P(...p), B = P(...q), mm = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], [nx, ny] = norm(mm[0] - cen[0], mm[1] - cen[1]); return [mm[0] + nx * dd, mm[1] + ny * dd]; };
  const labs = {
    H: lab(host, ...out(Hs, kind === 'ladder' ? 26 : 22), d.labels.H, 'u6l1-slab'),
    V: lab(host, ...out(Vs, kind === 'ladder' ? -28 : 30), d.labels.V, 'u6l1-slab'),
    D: lab(host, ...out(Ds, -0.0001).map((v, i) => v + (i ? -1 : 1) * (kind === 'ladder' ? 24 : 0)), d.labels.D, 'u6l1-slab u6l1-dlab')
  };
  if (kind !== 'ladder') { const p = out(Ds, 1); labs.D.style.left = p[0] + 'px'; labs.D.style.top = p[1] + 'px'; }
  if (o.small) Object.values(labs).forEach((e) => e.classList.add('u6l1-sm'));
  return { sides, labs, mark, R: RP, d };
}

/* =============================== warm-up: Will It Fit? =============================== */
function mountWarm() {
  const host = document.getElementById('u6l1-wfig'); if (!host) return;
  const W = 584, H = 214;
  host.style.width = W + 'px'; host.style.height = H + 'px';
  const svg = svgEl('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}`, class: 'u6l1-wsvg' }); host.appendChild(svg);
  const txt = (x, y, s, cls, attrs = {}) => { const e = svgEl('text', Object.assign({ x, y, class: cls }, attrs), svg); e.textContent = s; return e; };
  const ball = (x, y, n) => { svgEl('circle', { cx: x, cy: y, r: 11, fill: INK }, svg); txt(x, y + 5, n, 'u6l1-wball', { 'text-anchor': 'middle' }); };
  const rm = (V, P, Q) => rightMark(svg, V, P, Q, 10, { color: INK, width: 1.8 });
  // ① moving box 80 × 60 cm, 1.6 px per cm
  const b0 = [30, 48], bw = 128, bh = 96;
  ball(16, 14, '1'); txt(32, 20, 'Moving box', 'u6l1-wt');
  svgEl('path', { d: `M${b0[0]} ${b0[1]} L${b0[0] + bw} ${b0[1]} L${b0[0] + bw - 9} ${b0[1] - 11} L${b0[0] + 9} ${b0[1] - 11} Z`, fill: '#f0d9a0', stroke: '#c88c14', 'stroke-width': 1.5 }, svg);
  svgEl('rect', { x: b0[0], y: b0[1], width: bw, height: bh, fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 2 }, svg);
  svgEl('polygon', { points: `${b0[0]},${b0[1] + bh} ${b0[0] + bw},${b0[1] + bh} ${b0[0] + bw},${b0[1]}`, fill: RED, 'fill-opacity': 0.08 }, svg);
  svgEl('line', { x1: b0[0], y1: b0[1] + bh, x2: b0[0] + bw, y2: b0[1], stroke: RED, 'stroke-width': 2.4, 'stroke-dasharray': '7 4' }, svg);
  rm([b0[0] + bw, b0[1] + bh], [b0[0], b0[1] + bh], [b0[0] + bw, b0[1]]);
  txt(b0[0] + bw / 2, b0[1] + bh + 19, '80 cm', 'u6l1-wd', { 'text-anchor': 'middle' });
  txt(b0[0] - 4, b0[1] + bh / 2 + 6, '60', 'u6l1-wd', { 'text-anchor': 'end' });
  const lx = b0[0] + bw / 2 - 16, ly = b0[1] + bh / 2 - 20;
  const dLab1 = txt(lx, ly, '100 cm', 'u6l1-wans', { 'text-anchor': 'middle', transform: `rotate(-36.87 ${lx} ${ly})` });
  // the umbrella, 95 cm = 152 px
  const um = svgEl('g', { class: 'u6l1-umb' }, svg), uL = 152;
  svgEl('line', { x1: 0, y1: 0, x2: uL, y2: 0, stroke: INK, 'stroke-width': 2.4 }, um);
  svgEl('path', { d: 'M0 0 a5 5 0 0 1 -5 5', stroke: INK, 'stroke-width': 2.4, fill: 'none' }, um);
  svgEl('path', { d: `M${uL * 0.28} 0 C${uL * 0.45} -6 ${uL * 0.8} -5 ${uL * 0.95} -1 L${uL * 0.95} 1 C${uL * 0.8} 5 ${uL * 0.45} 6 ${uL * 0.28} 0 Z`, fill: RED, stroke: '#a42d27', 'stroke-width': 1 }, um);
  const umStart = [b0[0] - 12, 180];
  const placeUm = (t) => { // t = 0: under the box; t = 1: on the 160 px diagonal, 4 px to spare at each end
    const ang = -36.87 * t, gap = (160 - uL) / 2, sx = b0[0] + gap * 0.8, sy = b0[1] + bh - gap * 0.6;
    um.setAttribute('transform', `translate(${umStart[0] + (sx - umStart[0]) * t} ${umStart[1] + (sy - umStart[1]) * t}) rotate(${ang})`);
  };
  placeUm(0);
  const umLab = txt(umStart[0] + uL / 2, 204, 'umbrella: 95 cm', 'u6l1-wd2', { 'text-anchor': 'middle' });
  // ② drawer 60 × 25 cm with a 65 cm stick, 2.2 px per cm
  const d0 = [222, 62], dw = 132, dh = 55;
  ball(206, 14, '2'); txt(222, 20, 'Drawer', 'u6l1-wt');
  svgEl('rect', { x: d0[0] - 6, y: d0[1] - 8, width: dw + 12, height: dh + 26, rx: 5, fill: '#e8eef8', stroke: '#9aa6bb', 'stroke-width': 1.2 }, svg);
  svgEl('rect', { x: d0[0], y: d0[1], width: dw, height: dh, fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 2 }, svg);
  svgEl('rect', { x: d0[0] - 3, y: d0[1] + dh, width: dw + 6, height: 8, fill: '#9a6a2a' }, svg);
  svgEl('ellipse', { cx: d0[0] + dw / 2, cy: d0[1] + dh + 13, rx: 9, ry: 3, fill: INK }, svg);
  rm([d0[0], d0[1] + dh], [d0[0] + dw, d0[1] + dh], [d0[0], d0[1]]);
  svgEl('line', { x1: d0[0] + 4, y1: d0[1] + 3, x2: d0[0] + dw - 4, y2: d0[1] + dh - 3, stroke: '#8a5a22', 'stroke-width': 6, 'stroke-linecap': 'round' }, svg);
  const sx2 = d0[0] + dw / 2 + 12, sy2 = d0[1] + dh / 2 - 9;
  txt(sx2, sy2, 'stick: 65 cm', 'u6l1-wd2', { 'text-anchor': 'middle', transform: `rotate(22.6 ${sx2} ${sy2})` });
  txt(d0[0] + dw / 2, d0[1] + dh + 36, '60 cm', 'u6l1-wd', { 'text-anchor': 'middle' });
  const q2 = txt(d0[0] - 11, d0[1] + dh / 2 + 9, '?', 'u6l1-wq', { 'text-anchor': 'end' });
  const a2 = txt(d0[0] - 9, d0[1] + dh / 2 + 6, '25', 'u6l1-wans', { 'text-anchor': 'end' });
  txt(d0[0] + dw / 2, d0[1] + dh + 56, 'fits exactly, corner to corner', 'u6l1-wi', { 'text-anchor': 'middle' });
  // ③ car trunk 120 × 50 cm, 1.2 px per cm
  const t0 = [420, 80], tw = 144, th = 60;
  ball(404, 14, '3'); txt(420, 20, 'Car trunk', 'u6l1-wt');
  svgEl('rect', { x: t0[0] - 13, y: t0[1] - 46, width: tw + 26, height: th + 68, rx: 16, fill: '#eef0f4', stroke: INK, 'stroke-width': 1.6 }, svg);
  svgEl('path', { d: `M${t0[0] + 6} ${t0[1] - 10} L${t0[0] + tw - 6} ${t0[1] - 10} L${t0[0] + tw - 18} ${t0[1] - 36} L${t0[0] + 18} ${t0[1] - 36} Z`, fill: '#cfdcf3', stroke: INK, 'stroke-width': 1.2 }, svg);
  svgEl('rect', { x: t0[0] - 11, y: t0[1] + th + 6, width: 11, height: 9, fill: RED }, svg); svgEl('rect', { x: t0[0] + tw, y: t0[1] + th + 6, width: 11, height: 9, fill: RED }, svg);
  svgEl('rect', { x: t0[0], y: t0[1], width: tw, height: th, fill: '#ffecb3', stroke: '#c88c14', 'stroke-width': 2 }, svg);
  rm([t0[0] + tw, t0[1] + th], [t0[0], t0[1] + th], [t0[0] + tw, t0[1]]);
  const diag3 = svgEl('line', { x1: t0[0], y1: t0[1] + th, x2: t0[0] + tw, y2: t0[1], stroke: RED, 'stroke-width': 2.4, 'stroke-dasharray': '7 4' }, svg);
  const q3 = txt(t0[0] + tw / 2 - 12, t0[1] + th / 2 - 2, '?', 'u6l1-wq', { 'text-anchor': 'middle' });
  txt(t0[0] + tw / 2, t0[1] + th + 40, '120 cm', 'u6l1-wd', { 'text-anchor': 'middle' });
  txt(t0[0] - 17, t0[1] + th / 2 + 6, '50', 'u6l1-wd', { 'text-anchor': 'end' });
  txt(t0[0] + tw / 2, t0[1] + th + 60, 'trunk floor, seen from above', 'u6l1-wi', { 'text-anchor': 'middle' });
  // the rod: lies along the 120 side, then swings onto the diagonal (130 cm = 156 px); walking the edges is 170
  const rod = svgEl('line', { x1: 0, y1: 0, x2: 0, y2: 0, stroke: '#2b55a0', 'stroke-width': 6, 'stroke-linecap': 'round', class: 'u6l1-rod' }, svg);
  const rodLab = txt(t0[0] + tw / 2, t0[1] + th - 10, '', 'u6l1-wans', { 'text-anchor': 'middle' });
  const edges = svgEl('path', { d: `M${t0[0]} ${t0[1] + th} L${t0[0] + tw} ${t0[1] + th} L${t0[0] + tw} ${t0[1]}`, fill: 'none', stroke: OK, 'stroke-width': 4, 'stroke-dasharray': '3 6', 'stroke-linecap': 'round' }, svg);
  const edgeLab = txt(t0[0] + tw + 10, t0[1] - 16, 'edges: 170', 'u6l1-wok', { 'text-anchor': 'end' });
  const placeRod = (ang) => {
    const L = 144 + 12 * (ang / 22.62), r = ang * Math.PI / 180;
    rod.setAttribute('x1', t0[0]); rod.setAttribute('y1', t0[1] + th); rod.setAttribute('x2', t0[0] + Math.cos(r) * L); rod.setAttribute('y2', t0[1] + th - Math.sin(r) * L);
  };
  [dLab1, a2, rod, rodLab, edges, edgeLab].forEach(hide);
  const ctx = liveCtx(), on = { 1: false, 2: false, 3: false };
  const btn = (n, fn) => { const b = document.getElementById('u6l1-w' + n); if (b) b.addEventListener('click', () => { on[n] = !on[n]; b.classList.toggle('on', on[n]); fn(on[n]); }); };
  btn(1, async (v) => {
    if (!v) { hide(dLab1); placeUm(0); umLab.style.opacity = 1; return; }
    umLab.style.opacity = 0; await appear(ctx, dLab1);
    await tween(ctx, 1100, (t) => placeUm(t));
  });
  btn(2, async (v) => { if (!v) { hide(a2); q2.style.opacity = 1; return; } q2.style.opacity = 0; await appear(ctx, a2); });
  btn(3, async (v) => {
    if (!v) { [rod, rodLab, edges, edgeLab].forEach(hide); q3.style.opacity = 1; diag3.style.opacity = 1; return; }
    q3.style.opacity = 0; diag3.style.opacity = 0.35;
    placeRod(0); rod.style.opacity = 1; rodLab.textContent = '120 cm lying straight'; rodLab.setAttribute('y', t0[1] + th - 10);
    await appear(ctx, rodLab); await sleep(ctx, 900);
    rodLab.style.opacity = 0;
    await tween(ctx, 1100, (t) => placeRod(22.62 * t));
    rodLab.textContent = '130 cm'; rodLab.setAttribute('y', t0[1] + th / 2 - 6); await appear(ctx, rodLab);
    await sleep(ctx, 500); edges.style.opacity = 1; await appear(ctx, edgeLab);
  });
}

/* =============================== static figures =============================== */
function stdTri(id, sides, base, rise, o = {}) {
  const e = document.getElementById(id); if (!e) return null;
  const R = new RightTriangle(e, Object.assign({ width: o.w || 290, height: o.h || 150, base, rise, right: 'bl', sides, pad: o.pad || 30 }, o.tri || {}));
  Object.values(R.vLabs).forEach((x) => x.remove());
  if (o.colors) for (const k in o.colors) { R.side(k).style.color = o.colors[k]; if (R.sideLabs[k]) R.sideLabs[k].style.color = o.colors[k]; }
  return R;
}
function sceneFig(id, kind, w = 330, hh = 230) {
  const e = document.getElementById(id); if (!e) return;
  const host = h('div', 'u6l1-scn'); box(host, w, hh); e.appendChild(host);
  const svg = svgEl('svg', { width: w, height: hh }, host);
  scene(host, svg, kind, [0, 0, w, hh], { small: true });
}
function mountStatics() {
  const thm = { a: LA, b: LB, c: HC };
  stdTri('u6l1-thmfig', { a: 'a', b: 'b', c: 'c' }, 4, 3, { w: 250, h: 180, colors: thm });
  const pf = stdTri('u6l1-partsfig', { a: '\\text{leg}', b: '\\text{leg}' }, 4, 3, { w: 300, h: 210, pad: 40, colors: thm, tri: { pad: 44 } });
  if (pf) { const g = pf.side('c'), d = 54; const e = pf.hlabel(g.mid[0] + g.out[0] * d, g.mid[1] + g.out[1] * d, T('\\text{hypotenuse}'), { cls: 'bk-tri-lab' }); e.style.color = HC; }
  stdTri('u6l1-ex1a', { a: '5', b: '12', c: '13' }, 12, 5);
  stdTri('u6l1-ex1b', { a: '8', b: '15', c: '17' }, 15, 8);
  stdTri('u6l1-ex1c', { a: '7', b: '24', c: '25' }, 24, 7);
  stdTri('u6l1-ex3a', { a: '9', b: '12', c: 'c' }, 12, 9, { w: 300, h: 170 });
  stdTri('u6l1-ex3b', { a: '4', b: '8', c: 'c' }, 8, 4, { w: 300, h: 170 });
  stdTri('u6l1-ex4a', { a: '5', b: 'b', c: '13' }, 12, 5, { w: 300, h: 150 });
  stdTri('u6l1-ex4b', { a: '7', b: 'b', c: '25' }, 24, 7, { w: 300, h: 150 });
  sceneFig('u6l1-ex5a', 'ladder', 300, 250);
  sceneFig('u6l1-ex5b', 'field', 330, 230);
}

/* ======================================================================================
 * Explainer 1: name the sides — find the square corner first
 * ====================================================================================== */
const rot = (p, q, th) => { const r = th * Math.PI / 180, u = [Math.cos(r), Math.sin(r)], v = [-Math.sin(r), Math.cos(r)]; return [[0, 0], [u[0] * p, u[1] * p], [v[0] * q, v[1] * q]]; };
const NS = {
  turned: { label: 'Demo: a turned triangle', pts: rot(8, 6, 28), L: [8, 6, 10] },
  roof: { label: 'Demo: a “roof”', pts: [[0, 0], [-3.6, -4.8], [6.4, -4.8]], L: [6, 8, 10], roof: true },
  ex1a: { label: '(a)', pts: [[0, 0], [0, 5], [12, 0]], L: [5, 12, 13], ex: 'a' },
  ex1b: { label: '(b)', pts: [[0, 0], [0, 8], [15, 0]], L: [8, 15, 17], ex: 'b' },
  ex1c: { label: '(c)', pts: [[0, 0], [0, 7], [24, 0]], L: [7, 24, 25], ex: 'c' }
};
const nameSides = {
  title: 'Find the square corner first',
  height: 400,
  minW: 900,
  choices: [{ v: 'turned', label: NS.turned.label }, { v: 'roof', label: NS.roof.label }, { sep: 'Example 1 check:' }, ...['ex1a', 'ex1b', 'ex1c'].map((k) => ({ v: k, label: NS[k].label }))],
  intro: (k) => (NS[k].ex ? `Example 1(${NS[k].ex}): Triangle ${NS[k].ex.toUpperCase()}. Which sides are the legs? Press <b>Next</b>.` : 'Which sides are the legs, and which is the hypotenuse? Press <b>Next</b>.'),
  make(stage, k, ex) {
    const d = NS[k], W = ex.W, H = ex.def.height, [p, q, hy] = d.L, svg = fullSvg(stage, W, H), GW = Math.round(W * 0.58);
    const t = triangle(stage, svg, d.pts, [0, 0, GW, H], { labels: { RP: T(String(p)), RQ: T(String(q)), PQ: T(String(hy)) }, pad: 92 });
    const ring = hide(svgEl('circle', { cx: t.R[0], cy: t.R[1], r: 30, fill: 'none', stroke: RED, 'stroke-width': 3.5, class: 'u6l1-ring' }, svg));
    const tag = (k2, v, word) => { const e = t.labs[k2]; e.innerHTML = `${T(String(v))} <span class="u6l1-tw">${word}</span>`; e.classList.add('u6l1-tag'); t.seat(k2, e); return e; };
    const P = panel(stage, GW + 16, 18, W - GW - 28, H - 36, 'Compare the lengths');
    const mx = hy, bw = W - GW - 28 - 28 - 112 - 20 - 50;
    const bar = (name, v, color) => { const r = hide(h('div', 'u6l1-bar', `<span class="u6l1-bn">${name}</span><i style="width:${(v / mx) * bw}px;background:${color}"></i><b style="color:${color}">${v}</b>`)); P.appendChild(r); return r; };
    const bars = [bar('leg', p, LA), bar('leg', q, LB), bar('hypotenuse', hy, HC)];
    const fin = hide(line(P, d.ex ? `Legs: <b>${Math.min(p, q)}</b> and <b>${Math.max(p, q)}</b><br>Hypotenuse: <b>${hy}</b>` : `The hypotenuse is the <b>longest</b> side.`, 'u6l1-boxed'));
    return [
      { cap: `<b>Step 1:</b> find the <b>square corner</b>. That little square marks the right angle, ${T('90^\\circ')}.`,
        run: async (c) => { await pop(c, ring, 420); await pulse(c, ring, 1.15); } },
      { cap: `<b>Step 2:</b> the two sides that <b>touch</b> the square corner are the <b>legs</b>: ${p} and ${q}.`,
        run: async (c) => { tint(t, 'RP', LA); tint(t, 'RQ', LB); await Promise.all([pop(c, tag('RP', p, 'leg')), pop(c, tag('RQ', q, 'leg'), 380, { delay: 150 })]); } },
      { cap: `<b>Step 3:</b> the side <b>across</b> from the square corner is the <b>hypotenuse</b>: ${hy}.${d.roof ? ' Here it lies <b>flat</b> along the bottom!' : ''}`,
        run: async (c) => { tint(t, 'PQ', HC); await pop(c, tag('PQ', hy, 'hypotenuse')); } },
      { cap: `<b>Check:</b> the hypotenuse is always the <b>longest</b> side. ${hy} is longer than ${p} and ${q} ✓`,
        run: async (c) => { for (const b of bars) await show(c, b); await pop(c, fin); } }
    ];
  }
};

/* ======================================================================================
 * Explainer 2: squares on the sides (count the little squares)
 * ====================================================================================== */
const squares = {
  title: 'Squares on the sides',
  height: 450,
  minW: 900,
  choices: [{ v: '3|4', label: '3–4–5 (the booklet’s)' }, { v: '5|12', label: '5–12–13' }, { sep: 'Example 2 check:' }, { v: '6|8', label: '(b) 6–8–10' }],
  intro: (v) => `A right triangle with legs <b>${v.split('|')[0]}</b> and <b>${v.split('|')[1]}</b>. Build a square on every side. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const [a, b] = v.split('|').map(Number), c = Math.hypot(a, b), W = ex.W, H = ex.def.height, svg = fullSvg(stage, W, H), FW = 520;
    const F = sqFig(stage, svg, a, b, [6, 6, FW, H - 12], { short: SHORT, grid: true, labels: { a: T(String(a)), b: T(String(b)), c: T(String(c)) } });
    const aA = F.areaA(T(`${a}^2=${a * a}`)), aB = F.areaB(T(`${b}^2=${b * b}`)), aC = F.areaC(T(`${c}^2=${c * c}`));
    const P = panel(stage, FW + 24, 16, W - FW - 36, H - 32, 'Add the areas');
    const L1 = hide(line(P, `<span class="u6l1-ca">${T(`a^2=${a}^2=${a * a}`)}</span>`)), L2 = hide(line(P, `<span class="u6l1-cb">${T(`b^2=${b}^2=${b * b}`)}</span>`));
    const L3 = hide(line(P, `<span class="u6l1-cc">${T(`c^2=${c}^2=${c * c}`)}</span>`)), L4 = hide(line(P, T(`${a * a}+${b * b}=${c * c}`), 'u6l1-big'));
    const L5 = hide(line(P, T('a^2+b^2=c^2'), 'u6l1-boxed'));
    return [
      { cap: `Build a square on each <b>leg</b>. Count the little squares: ${T(`${a}^2=${a * a}`)} and ${T(`${b}^2=${b * b}`)}.`,
        run: async (c2) => { await growIn(c2, F.sqA); await pop(c2, aA); await show(c2, L1); await growIn(c2, F.sqB); await pop(c2, aB); await show(c2, L2); } },
      { cap: `Now a square on the <b>hypotenuse</b>. It has ${T(`${c}^2=${c * c}`)} little squares.`,
        run: async (c2) => { await growIn(c2, F.sqC, 800); await pop(c2, aC); await show(c2, L3); } },
      { cap: `The two leg squares together: ${T(`${a * a}+${b * b}=${c * c}`)}. Exactly the same as the big square!`,
        run: async (c2) => { await Promise.all([pulse(c2, aA, 1.15), pulse(c2, aB, 1.15)]); await show(c2, L4); await pulse(c2, aC, 1.2); } },
      { cap: `That is the <b>Pythagorean theorem</b>: ${T('a^2+b^2=c^2')}. The squares on the legs add up to the square on the hypotenuse.`,
        run: (c2) => pop(c2, L5) }
    ];
  }
};

/* ======================================================================================
 * Explainer 3: why it works for every right triangle (four triangles slide around in a big square)
 * ====================================================================================== */
const whyAll = {
  title: 'Same big square, same four triangles',
  height: 440,
  minW: 900,
  choices: [{ v: '3|4', label: 'legs 3 and 4' }, { v: '2|5', label: 'legs 2 and 5' }, { v: '4|4', label: 'legs 4 and 4' }],
  intro: (v) => `Four copies of a right triangle with legs <b>${v.split('|')[0]}</b> and <b>${v.split('|')[1]}</b>, inside one big square. Press <b>Next</b>.`,
  make(stage, v, ex) {
    const [a, b] = v.split('|').map(Number), s = a + b, W = ex.W, H = ex.def.height, svg = fullSvg(stage, W, H), side = 384, sc = side / s, x0 = 52, y0 = 12;
    const P = (x, y) => [x0 + x * sc, y0 + (s - y) * sc], pts = (arr) => arr.map((p) => P(...p).join(',')).join(' ');
    svgEl('rect', { x: x0, y: y0, width: side, height: side, fill: '#fff', stroke: INK, 'stroke-width': 3 }, svg);
    // side marks: a then b along the bottom and up the left
    const tick = (x, y) => { const [px, py] = P(x, y); return svgEl('line', { x1: px, y1: py - 7, x2: px, y2: py + 7, stroke: INK, 'stroke-width': 2 }, svg); };
    tick(a, 0); { const [px, py] = P(0, b); svgEl('line', { x1: px - 7, y1: py, x2: px + 7, y2: py, stroke: INK, 'stroke-width': 2 }, svg); }
    lab(stage, ...P(a / 2, 0).map((q, i) => q + (i ? 20 : 0)), T('a'), 'u6l1-slab u6l1-ca'); lab(stage, ...P(a + b / 2, 0).map((q, i) => q + (i ? 20 : 0)), T('b'), 'u6l1-slab u6l1-cb');
    lab(stage, ...P(0, b / 2).map((q, i) => q - (i ? 0 : 20)), T('b'), 'u6l1-slab u6l1-cb'); lab(stage, ...P(0, b + a / 2).map((q, i) => q - (i ? 0 : 20)), T('a'), 'u6l1-slab u6l1-ca');
    // the gaps (behind the triangles)
    const gapC = hide(svgEl('polygon', { points: pts([[a, 0], [s, a], [b, s], [0, b]]), fill: HC, 'fill-opacity': 0.18, stroke: HC, 'stroke-width': 3 }, svg));
    const gapA = hide(svgEl('rect', { x: P(0, a)[0], y: P(0, a)[1], width: a * sc, height: a * sc, fill: LA, 'fill-opacity': 0.18, stroke: LA, 'stroke-width': 3 }, svg));
    const gapB = hide(svgEl('rect', { x: P(a, s)[0], y: P(a, s)[1], width: b * sc, height: b * sc, fill: LB, 'fill-opacity': 0.18, stroke: LB, 'stroke-width': 3 }, svg));
    const lC = hide(lab(stage, ...P(s / 2, s / 2), T('c^2'), 'u6l1-area')), lA = hide(lab(stage, ...P(a / 2, a / 2), T(`a^2=${a * a}`), 'u6l1-area')), lB = hide(lab(stage, ...P(a + b / 2, a + b / 2), T(`b^2=${b * b}`), 'u6l1-area'));
    lC.style.color = HC; lA.style.color = LA; lB.style.color = LB;
    if (a * sc < 100) lA.style.fontSize = '17px';
    // four triangles and where each one slides
    const TRI = [
      { p: [[0, 0], [a, 0], [0, b]], mv: [0, a] }, { p: [[a, 0], [s, 0], [s, a]], mv: [0, 0] },
      { p: [[s, a], [s, s], [b, s]], mv: [-b, 0] }, { p: [[b, s], [0, s], [0, b]], mv: [a, -b] }
    ];
    const outer = [], tris = TRI.map((t) => { const go = svgEl('g', {}, svg), g = hide(svgEl('g', { class: 'u6l1-tri' }, go)); outer.push(go); svgEl('polygon', { points: pts(t.p), fill: '#dfe6f3', stroke: INK, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g); return g; });
    const Pn = panel(stage, 480, 16, W - 492, H - 32, 'What stays the same?');
    const L = ['<b>Same</b> big square.', '<b>Same</b> four triangles.', `Empty space before: <b class="u6l1-cc">${T('c^2')}</b>`, `Empty space after: <b class="u6l1-ca">${T('a^2')}</b> + <b class="u6l1-cb">${T('b^2')}</b>`].map((s2) => hide(line(Pn, s2)));
    const fin = hide(line(Pn, `${T('a^2+b^2=c^2')}<div class="u6l1-sm">${T(`${a * a}+${b * b}=${a * a + b * b}`)}</div>`, 'u6l1-boxed'));
    const moveTri = (c, i) => { const [dx, dy] = TRI[i].mv; if (!dx && !dy) return Promise.resolve(); return tween(c, 900, (t) => outer[i].setAttribute('transform', `translate(${dx * sc * t} ${-dy * sc * t})`)); };
    return [
      { cap: `A big square with sides ${T('a+b')}: here ${T(`${a}+${b}=${s}`)}.`, run: (c) => pulse(c, svg.firstChild, 1.02) },
      { cap: 'Put four copies of the right triangle in its four corners.', run: async (c) => { for (const g of tris) await pop(c, g, 340); await show(c, L[0]); await show(c, L[1]); } },
      { cap: `The empty space in the middle is a square on the <b>hypotenuse</b>. Its area is ${T('c^2')}.`, run: async (c) => { await appear(c, gapC, 450); await pop(c, lC); await show(c, L[2]); } },
      { cap: 'Slide three of the triangles to new spots. Nothing is added and nothing is taken away.',
        run: async (c) => { await Promise.all([anim(c, gapC, [{ opacity: 1 }, { opacity: 0 }], 300), anim(c, lC, [{ opacity: 1 }, { opacity: 0 }], 300)]); gapC.style.opacity = 0; lC.style.opacity = 0; for (const i of [0, 2, 3]) await moveTri(c, i); } },
      { cap: `Now the empty space is <b>two</b> squares: one on leg ${T('a')} (${T(`${a * a}`)}) and one on leg ${T('b')} (${T(`${b * b}`)}).`,
        run: async (c) => { await appear(c, gapA, 400); await pop(c, lA); await appear(c, gapB, 400); await pop(c, lB); await show(c, L[3]); } },
      { cap: `Same big square, same four triangles, so the empty space must match: ${T('a^2+b^2=c^2')}. It works for <b>every</b> right triangle.`,
        run: (c) => pop(c, fin) }
    ];
  }
};

/* ======================================================================================
 * Explainer 4: verify — evaluate both sides separately (and a triangle that only looks right)
 * ====================================================================================== */
const VER = {
  ex2a: { label: '(a) 3, 4, 5', a: 3, b: 4, c: 5 }, ex2b: { label: '(b) 6, 8, 10', a: 6, b: 8, c: 10 },
  non: { label: 'Not right: 5, 6, 8', a: 5, b: 6, c: 8, non: true }
};
const verify = {
  title: 'Check both sides',
  height: 380,
  minW: 900,
  choices: [{ sep: 'Example 2 check:' }, { v: 'ex2a', label: VER.ex2a.label }, { v: 'ex2b', label: VER.ex2b.label }, { sep: 'Compare:' }, { v: 'non', label: VER.non.label }],
  intro: (k) => (VER[k].non ? 'A triangle with sides <b>5</b>, <b>6</b> and <b>8</b>. Is it a right triangle? Press <b>Next</b>.' : `Legs <b>${VER[k].a}</b> and <b>${VER[k].b}</b>, hypotenuse <b>${VER[k].c}</b>. Does ${T('a^2+b^2=c^2')} hold? Press <b>Next</b>.`),
  make(stage, k, ex) {
    const d = VER[k], { a, b, c } = d, W = ex.W, H = ex.def.height, svg = fullSvg(stage, W, H), GW = 380;
    // the triangle drawn to scale from its three sides: b along the bottom, a up from the left end, c across
    const x = (a * a + b * b - c * c) / (2 * b), y = Math.sqrt(a * a - x * x);
    const t = triangle(stage, svg, [[0, 0], [x, y], [b, 0]], [0, 10, GW, H - 20], { right: !d.non, labels: { RP: T(String(a)), RQ: T(String(b)), PQ: T(String(c)) }, pad: 48 });
    tint(t, 'RP', LA); tint(t, 'RQ', LB); tint(t, 'PQ', HC);
    let qm = null;
    if (d.non) { qm = hide(lab(stage, t.R[0] + 26, t.R[1] - 26, '?', 'u6l1-qm')); svgEl('path', { d: `M${t.R[0] + 22} ${t.R[1]} A22 22 0 0 0 ${t.R[0] + (t.P[0] - t.R[0]) * 22 / Math.hypot(t.P[0] - t.R[0], t.P[1] - t.R[1])} ${t.R[1] + (t.P[1] - t.R[1]) * 22 / Math.hypot(t.P[0] - t.R[0], t.P[1] - t.R[1])}`, fill: 'none', stroke: RED, 'stroke-width': 2.5 }, svg); }
    const ok = a * a + b * b === c * c;
    const card = checkCard(stage, { left: ['a^2+b^2', `${a}^2+${b}^2`, `${a * a}+${b * b}`, `${a * a + b * b}`], right: ['c^2', `${c}^2`, `${c * c}`], ok, hidden: true, x: GW + 30, y: 22, width: W - GW - 50, title: d.non ? 'Is it a right triangle?' : 'Verify' });
    const [r0, r1, r2, r3] = card.rows;
    return [
      { cap: d.non ? `Sides 5, 6 and 8. The bottom-left corner <b>looks</b> square… but is it? If it were, the longest side, 8, would be the hypotenuse.`
        : `The longest side, ${c}, is across from the square corner: it is the hypotenuse ${T('c')}. The legs are ${T(`a=${a}`)} and ${T(`b=${b}`)}.`,
        run: async (cx) => { if (qm) await pop(cx, qm); await Promise.all(r0.map((e) => show(cx, e))); } },
      { cap: `Left side: ${T(`a^2+b^2=${a}^2+${b}^2=${a * a}+${b * b}=${a * a + b * b}`)}.`,
        run: async (cx) => { for (const r of [r1, r2, r3]) { await show(cx, r[0]); await sleep(cx, 120); } } },
      { cap: `Right side, on its own: ${T(`c^2=${c}^2=${c * c}`)}.`,
        run: async (cx) => { for (const r of [r1, r3]) { await show(cx, r[2]); await sleep(cx, 120); } } },
      { cap: ok ? `Both sides are ${a * a + b * b}. They are equal, so the theorem holds ✓` : `${T(`${a * a + b * b}\\neq${c * c}`)}: the sides are <b>not</b> equal, so this is <b>not</b> a right triangle. The corner is a little more than ${T('90^\\circ')}.`,
        run: async (cx) => { await show(cx, r3[1]); await pop(cx, card.verdict); } }
    ];
  }
};

/* ======================================================================================
 * Explainer 5: finding the hypotenuse — square, add, then square root
 * ====================================================================================== */
const HYP = {
  demo: { label: 'Demo: legs 6 and 6', a: 6, b: 6 },
  ex3a: { label: '(a) legs 9 and 12', a: 9, b: 12 }, ex3b: { label: '(b) legs 4 and 8', a: 4, b: 8 },
  box: { label: 'Box ①: 60 and 80', a: 60, b: 80, u: 'cm' }, trunk: { label: 'Trunk ③: 50 and 120', a: 50, b: 120, u: 'cm' }
};
const hypSteps = {
  title: 'Square, add, then square root',
  height: 440,
  minW: 900,
  choices: [{ v: 'demo', label: HYP.demo.label }, { sep: 'Example 3 check:' }, { v: 'ex3a', label: HYP.ex3a.label }, { v: 'ex3b', label: HYP.ex3b.label }, { sep: 'Warm-up:' }, { v: 'box', label: HYP.box.label }, { v: 'trunk', label: HYP.trunk.label }],
  intro: (k) => `Legs <b>${HYP[k].a}</b> and <b>${HYP[k].b}</b>${HYP[k].u ? ' cm' : ''}. How long is the hypotenuse? Press <b>Next</b>.`,
  make(stage, k, ex) {
    const d = HYP[k], { a, b } = d, u = d.u ? `\\text{ ${d.u}}` : '', W = ex.W, H = ex.def.height, svg = fullSvg(stage, W, H), GW = 470;
    const c2 = a * a + b * b, perfect = isSq(c2), c = Math.sqrt(c2), [rk, rm] = simpRad(c2), dec = c.toFixed(2);
    const t = triangle(stage, svg, [[0, 0], [0, a], [b, 0]], [0, 0, GW, 290], { labels: { RP: T(String(a)), RQ: T(String(b)), PQ: T('c=\\ ?') }, pad: 44 });
    tint(t, 'RP', LA); tint(t, 'RQ', LB); tint(t, 'PQ', HC);
    // the lengths compared
    const B = add(stage, box(h('div', 'u6l1-bars'), GW - 20, 128), 10, 300);
    const mx = a + b, bw = GW - 250, longer = Math.max(a, b);
    const bar = (name, v, html, color) => { const r = hide(h('div', 'u6l1-bar', `<span class="u6l1-bn">${name}</span><i style="width:${(v / mx) * bw}px;background:${color}"></i><b style="color:${color}">${html}</b>`)); B.appendChild(r); return r; };
    const bars = [bar(a === b ? 'each leg' : 'longer leg', longer, nH(longer), a > b ? LA : LB), bar('hypotenuse', c, perfect ? nH(c) : '≈ ' + dec, HC), bar('leg + leg', a + b, nH(a + b), '#9aa0ab')];
    const P = panel(stage, GW + 16, 10, W - GW - 26, H - 20, 'The steps');
    const Ls = [
      line(P, T('c^2=a^2+b^2')),
      line(P, T(`c^2=${a}^2+${b}^2`)),
      line(P, T(`c^2=${nT(a * a)}+${nT(b * b)}`)),
      line(P, T(`c^2=${nT(c2)}`), 'u6l1-cc'),
      line(P, T(perfect ? `c=\\sqrt{${nT(c2)}}=${nT(c)}${u}` : `c=\\sqrt{${c2}}=\\sqrt{${rk * rk}\\times${rm}}`), 'u6l1-cc'),
      perfect ? null : line(P, T(`c=${rk}\\sqrt{${rm}}\\approx${dec}${u}`), 'u6l1-cc u6l1-big')
    ].filter(Boolean);
    Ls.forEach(hide);
    const cAns = perfect ? `${nT(c)}${u}` : `${rk}\\sqrt{${rm}}`;
    return [
      { cap: `The legs are ${a} and ${b}. The hypotenuse ${T('c')} is across from the right angle.`, run: (cx) => show(cx, Ls[0]) },
      { cap: `<b>Square</b> each leg: ${T(`${a}^2=${nT(a * a)}`)} and ${T(`${b}^2=${nT(b * b)}`)}.`, run: async (cx) => { await show(cx, Ls[1]); await show(cx, Ls[2]); } },
      { cap: `<b>Add</b> the squares first: ${T(`${nT(a * a)}+${nT(b * b)}=${nT(c2)}`)}. That is ${T('c^2')}, not ${T('c')} yet.`, run: (cx) => show(cx, Ls[3]) },
      { cap: perfect ? `<b>Then</b> square root: ${T(`c=\\sqrt{${nT(c2)}}=${nT(c)}`)}${d.u ? ' cm' : ''}.`
        : `<b>Then</b> square root: ${T(`c=\\sqrt{${c2}}`)}. ${c2} isn’t a perfect square, so simplify: ${T(`\\sqrt{${c2}}=\\sqrt{${rk * rk}\\times${rm}}=${rk}\\sqrt{${rm}}\\approx${dec}`)}.`,
        run: async (cx) => { for (const e of Ls.slice(4)) await show(cx, e); t.labs.PQ.innerHTML = T(`c=${cAns}`); t.seat('PQ', t.labs.PQ); await pop(cx, t.labs.PQ); } },
      { cap: `Check: ${perfect ? nT(c) : T(`${rk}\\sqrt{${rm}}\\approx${dec}`)} is longer than each leg, but shorter than ${T(`${a}+${b}=${nT(a + b)}`)}. The hypotenuse is the shortcut across.`,
        run: async (cx) => { for (const r of bars) await show(cx, r); } }
    ];
  }
};

/* ======================================================================================
 * Explainer 6: simplifying a square root (adapted from Math 10C u6l1)
 * ====================================================================================== */
const SR = { r80: { label: 'Example 3(b): √80', n: 80 }, r20: { label: '√20', n: 20 }, r50: { label: '√50', n: 50 } };
const simplify = {
  title: 'Find the biggest perfect square',
  height: 420,
  minW: 860,
  choices: Object.keys(SR).map((k) => ({ v: k, label: SR[k].label })),
  intro: 'Is there a perfect square hiding under the root? Press <b>Next</b>.',
  make(stage, key, ex) {
    const n = SR[key].n, [k, m] = simpRad(n), ks = [];
    for (let j = 2; j * j <= n; j++) ks.push(j);
    const fits = ks.filter((j) => n % (j * j) === 0), tw = 84, gap = 12, x0 = (ex.W - ks.length * (tw + gap) + gap) / 2, ty = 70;
    const head = lab(stage, ex.W / 2, 28, T(`\\sqrt{${n}}`), 'u6l1-big'); head.style.fontSize = '34px';
    const tiles = ks.map((j, i) => hide(add(stage, h('div', 'u6l1-tile', `<div class="u6l1-tn">${j * j}</div><div class="u6l1-ts">${T(`${j}^2`)}</div>`), x0 + i * (tw + gap), ty)));
    const qs = ks.map((j, i) => { const q = n / (j * j), ok = Number.isInteger(q); return hide(add(stage, h('div', 'u6l1-tq', `${n} ÷ ${j * j}<br>${ok ? '=' : '≈'} ${+q.toFixed(2)} <b class="${ok ? 'u6l1-cg' : 'u6l1-cr'}">${ok ? '✓' : '✗'}</b>`), x0 + i * (tw + gap) - 8, ty + tw + 6)); });
    const e1 = hide(lab(stage, ex.W / 2, 268, '', 'u6l1-steq')), e2 = hide(lab(stage, ex.W / 2, 328, '', 'u6l1-steq')), e3 = hide(lab(stage, ex.W / 2, 386, '', 'u6l1-steq'));
    const sq = Math.sqrt(n), fitWord = fits.length > 1 ? `Several fit (${fits.map((j) => j * j).join(' and ')}). Use the <b>biggest</b>` : `Only ${k * k} fits`;
    return [
      { cap: `Simplify ${T(`\\sqrt{${n}}`)}. Here are the perfect squares up to ${n}.`, run: async (c) => { for (const t of tiles) await pop(c, t, 220); } },
      { cap: `Divide ${n} by each one. A whole-number answer (✓) means that square goes into ${n} evenly.`,
        run: async (c) => { for (let i = 0; i < ks.length; i++) { tiles[i].classList.add(fits.includes(ks[i]) ? 'u6l1-yes' : 'u6l1-no'); await fadeIn(c, qs[i], 200); } } },
      { cap: `${fitWord}: ${T(`${n}=${k * k}\\times${m}`)}.`,
        run: async (c) => { tiles[ks.indexOf(k)].classList.add('u6l1-best'); await pulse(c, tiles[ks.indexOf(k)], 1.12); e1.innerHTML = T(`\\sqrt{${n}}=\\sqrt{${k * k}\\times${m}}`); await show(c, e1); } },
      { cap: `${T(`\\sqrt{${k * k}}=${k}`)} comes out front: ${T(`\\sqrt{${n}}=${k}\\sqrt{${m}}`)}. That is the exact answer.`,
        run: async (c) => { e2.innerHTML = T(`=\\sqrt{${k * k}}\\times\\sqrt{${m}}=\\boldsymbol{${k}\\sqrt{${m}}}`); await show(c, e2); } },
      { cap: `As a decimal (calculator): ${T(`\\sqrt{${n}}\\approx${sq.toFixed(4)}`)}, so ${T(`\\approx${sq.toFixed(2)}`)}. Round only at the end.`,
        run: async (c) => { e3.innerHTML = T(`\\approx${sq.toFixed(4)}\\ldots\\approx\\boldsymbol{${sq.toFixed(2)}}`); await show(c, e3); } }
    ];
  }
};

/* ======================================================================================
 * Explainer 7: a missing leg — the big square minus the known square
 * ====================================================================================== */
const ML = {
  ex4a: { label: '(a) 13 and 5', c: 13, k: 5, kv: true }, ex4b: { label: '(b) 25 and 7', c: 25, k: 7, kv: true },
  drawer: { label: 'Drawer ②: 65 and 60', c: 65, k: 60, kv: false, u: 'cm' }
};
const missingLeg = {
  title: 'Take the small square away from the big one',
  height: 450,
  minW: 900,
  choices: [{ sep: 'Example 4 check:' }, { v: 'ex4a', label: ML.ex4a.label }, { v: 'ex4b', label: ML.ex4b.label }, { sep: 'Warm-up:' }, { v: 'drawer', label: ML.drawer.label }],
  intro: (k) => `Hypotenuse <b>${ML[k].c}</b>, one leg <b>${ML[k].k}</b>${ML[k].u ? ' cm' : ''}. How long is the other leg? Press <b>Next</b>.`,
  make(stage, key, ex) {
    const d = ML[key], c = d.c, kn = d.k, m2 = c * c - kn * kn, m = Math.sqrt(m2), W = ex.W, H = ex.def.height, svg = fullSvg(stage, W, H), FW = 520;
    const u = d.u ? `\\text{ ${d.u}}` : '';
    // the known leg is vertical (a) for the examples, horizontal (b) for the drawer
    const a = d.kv ? kn : m, b = d.kv ? m : kn, kL = d.kv ? 'a' : 'b', mL = d.kv ? 'b' : 'a';
    const F = sqFig(stage, svg, a, b, [6, 6, FW, H - 12], { short: SHORT, grid: c <= 15, labels: { [kL]: T(String(kn)), [mL]: T(`${mL}=\\ ?`), c: T(String(c)) } });
    const sqK = d.kv ? F.sqA : F.sqB, sqM = d.kv ? F.sqB : F.sqA, areaK = d.kv ? F.areaA : F.areaB, areaM = d.kv ? F.areaB : F.areaA;
    const aC = F.areaC(T(`${c}^2=${nT(c * c)}`)), aK = areaK(T(`${kn}^2=${nT(kn * kn)}`)), aM = areaM(T('?')), aM2 = areaM(T(`${nT(m2)}`));
    const P = panel(stage, FW + 24, 16, W - FW - 36, H - 32, 'Subtract the squares');
    const Ls = [line(P, T(`${mL}^2=c^2-${kL}^2`)), line(P, T(`${mL}^2=${c}^2-${kn}^2`)), line(P, T(`${mL}^2=${nT(c * c)}-${nT(kn * kn)}=${nT(m2)}`)), line(P, T(`${mL}=\\sqrt{${nT(m2)}}=${m}${u}`), 'u6l1-boxed')];
    Ls.forEach(hide);
    const legLab = F.labs[mL];
    return [
      { cap: `The hypotenuse is ${c} (across from the square corner). The missing leg ${T(mL)} <b>touches</b> the corner.`, run: (cx) => show(cx, Ls[0]) },
      { cap: `The square on the <b>hypotenuse</b>: ${T(`${c}^2=${nT(c * c)}`)}.`, run: async (cx) => { await growIn(cx, F.sqC, 800); await pop(cx, aC); } },
      { cap: `The square on the known leg: ${T(`${kn}^2=${nT(kn * kn)}`)}.`, run: async (cx) => { await growIn(cx, sqK); await pop(cx, aK); await show(cx, Ls[1]); } },
      { cap: `The two leg squares together make ${nH(c * c)}. So the missing square is what’s left: ${T(`${nT(c * c)}-${nT(kn * kn)}=${nT(m2)}`)}.`,
        run: async (cx) => { await growIn(cx, sqM); await pop(cx, aM); await sleep(cx, 350); aM.style.opacity = 0; await pop(cx, aM2); await show(cx, Ls[2]); } },
      { cap: `So ${T(`${mL}=\\sqrt{${nT(m2)}}=${m}`)}${d.u ? ' cm' : ''}. A leg is shorter than the hypotenuse: ${m} &lt; ${c} ✓`,
        run: async (cx) => { legLab.innerHTML = T(`${mL}=${m}`); await pop(cx, legLab); await pop(cx, Ls[3]); } }
    ];
  }
};

/* ======================================================================================
 * Explainer 8: word problems — find the right angle, then hypotenuse or leg?
 * ====================================================================================== */
const DEC = {
  ex5a: { label: '(a) the ladder', kind: 'ladder', q: 'A 17 ft ladder, its foot 8 ft from the wall. How high up the wall does it reach?', corner: 'where the wall meets the ground', unk: T('h'), hyp: false,
    why: `${T('h')} runs up the wall and <b>touches</b> the corner, so ${T('h')} is a <b>leg</b>. The ladder, 17 ft, is the hypotenuse.`, calc: ['h^2=17^2-8^2', 'h^2=289-64=225', 'h=\\sqrt{225}=15\\text{ ft}'], ans: '15 ft', ansCap: `${T('h=\\sqrt{225}=15')}: the ladder reaches <b>15 ft</b> up the wall.` },
  ex5b: { label: '(b) the field', kind: 'field', q: 'A field 6 m wide and 8 m long. How long is the path from corner to corner?', corner: 'at the corner of the field', unk: T('d'), hyp: true,
    why: `The path ${T('d')} is <b>across</b> from the right angle, so it is the <b>hypotenuse</b>. Add the squares.`, calc: ['d^2=6^2+8^2', 'd^2=36+64=100', 'd=\\sqrt{100}=10\\text{ m}'], ans: '10 m', ansCap: `${T('d=\\sqrt{100}=10')}: the path is <b>10 m</b> long.` },
  drawer: { label: 'Drawer ②', kind: 'drawer', q: 'A 65 cm stick fits exactly corner to corner in a drawer 60 cm long. How wide is the drawer?', corner: 'at the drawer’s corner', unk: 'the width', hyp: false,
    why: 'The width <b>touches</b> the corner, so it is a <b>leg</b>. The stick, 65 cm, is across from the corner: the hypotenuse.', calc: ['x^2=65^2-60^2', 'x^2=4225-3600=625', 'x=\\sqrt{625}=25\\text{ cm}'], ans: '25 cm', ansCap: `${T('\\sqrt{625}=25')}: the drawer is <b>25 cm</b> wide.` },
  trunk: { label: 'Trunk ③', kind: 'trunk', q: 'A trunk floor 120 cm by 50 cm. What is the longest rod that lies flat on it?', corner: 'at the trunk’s corner', unk: 'the rod', hyp: true,
    why: 'The rod lies corner to corner, <b>across</b> from the right angle: it is the <b>hypotenuse</b>. Add the squares.', calc: ['d^2=120^2+50^2', 'd^2=14\\,400+2500=16\\,900', 'd=\\sqrt{16\\,900}=130\\text{ cm}'], ans: '130 cm', ansCap: `${T('\\sqrt{16\\,900}=130')}: the longest rod is <b>130 cm</b>.` }
};
const decide = {
  title: 'Hypotenuse or leg? Add or subtract?',
  height: 450,
  minW: 920,
  choices: [{ sep: 'Example 5 check:' }, { v: 'ex5a', label: DEC.ex5a.label }, { v: 'ex5b', label: DEC.ex5b.label }, { sep: 'Warm-up:' }, { v: 'drawer', label: DEC.drawer.label }, { v: 'trunk', label: DEC.trunk.label }],
  intro: (k) => DEC[k].q + ' Press <b>Next</b>.',
  make(stage, k, ex) {
    const d = DEC[k], W = ex.W, H = ex.def.height, svg = fullSvg(stage, W, H), SW = 360;
    const s = scene(stage, svg, d.kind, [0, 0, SW, H]);
    const ring = hide(svgEl('circle', { cx: s.R[0], cy: s.R[1], r: 26, fill: 'none', stroke: RED, 'stroke-width': 3.5 }, svg));
    const FW = W - SW - 10;
    const F = new Flowchart(stage, { x: SW + 10, y: 0, width: FW, height: 250,
      nodes: {
        start: { x: FW / 2, y: 30, w: 330, h: 50, html: '<b>1. Find the right angle</b>', cls: 'bk-round' },
        q: { x: FW / 2, y: 112, w: 420, h: 56, html: '<b>2. Is the unknown across from it?</b>', color: 'amber' },
        hyp: { x: FW / 4 + 8, y: 210, w: FW / 2 - 30, h: 66, html: '<b>Yes: the hypotenuse</b>add the squares, then √', color: HC },
        leg: { x: FW * 3 / 4 - 8, y: 210, w: FW / 2 - 30, h: 66, html: '<b>No: a leg</b>big² − small², then √', color: LA }
      },
      edges: [{ from: 'start', to: 'q' }, { from: 'q', to: 'hyp', label: 'yes', route: 'vhv' }, { from: 'q', to: 'leg', label: 'no', route: 'vhv' }] });
    const R = add(stage, box(h('div', 'u6l1-panel u6l1-res'), FW - 20, H - 268), SW + 20, 262);
    const Ls = d.calc.map((s2) => hide(line(R, T(s2)))); Ls[2].classList.add('u6l1-boxed');
    const unkSide = d.hyp ? 'D' : SCN[d.kind].unk, hypSide = 'D';
    return [
      { cap: `<b>1.</b> Find the right angle: ${d.corner}.`, run: async (c) => { await F.visit(c, 'start'); await pop(c, ring); await pulse(c, ring, 1.15); } },
      { cap: `<b>2.</b> ${d.why}`,
        run: async (c) => {
          s.sides[hypSide].setAttribute('stroke', HC); s.labs[hypSide].style.color = HC;
          if (!d.hyp) { s.sides[unkSide].setAttribute('stroke', LA); s.labs[unkSide].style.color = LA; }
          await F.go(c, 'start', 'q'); await F.visit(c, 'q'); await F.go(c, 'q', d.hyp ? 'hyp' : 'leg'); await F.visit(c, d.hyp ? 'hyp' : 'leg');
        } },
      { cap: d.hyp ? `<b>Add</b> the squares: ${T(d.calc[0])}, so ${T(d.calc[1])}.` : `<b>Subtract</b>, big square minus small: ${T(d.calc[0])}, so ${T(d.calc[1])}.`,
        run: async (c) => { await show(c, Ls[0]); await show(c, Ls[1]); } },
      { cap: d.ansCap, run: async (c) => { await pop(c, Ls[2]); s.labs[unkSide].innerHTML = d.ans; await pop(c, s.labs[unkSide]); } }
    ];
  }
};

/* ======================================================================================
 * Explainer 9: the sliding ladder — 17 ft is always the hypotenuse
 * ====================================================================================== */
const ladder = {
  title: 'The sliding ladder',
  height: 430,
  minW: 900,
  intro: 'A 17 ft ladder leans against a wall. Its foot is 8 ft from the wall. Press <b>Next</b>.',
  make(stage, v, ex) {
    const W = ex.W, H = ex.def.height, svg = fullSvg(stage, W, H), sc = 21, X0 = 70, Y0 = H - 40, L = 17;
    const P = (x, y) => [X0 + x * sc, Y0 - y * sc];
    svgEl('rect', { x: X0 - 26, y: Y0 - 17.6 * sc, width: 26, height: 17.6 * sc, fill: '#e9d8c4', stroke: '#9a7b5c', 'stroke-width': 1.5 }, svg);
    for (let y = 1; y < 17.6; y++) svgEl('line', { x1: X0 - 26, x2: X0, y1: Y0 - y * sc, y2: Y0 - y * sc, stroke: '#c9ad8e', 'stroke-width': 1.2 }, svg);
    svgEl('line', { x1: X0 - 34, x2: X0 + 17 * sc + 20, y1: Y0, y2: Y0, stroke: '#5d8a4a', 'stroke-width': 5 }, svg);
    rightMark(svg, P(0, 0), P(1, 0), P(0, 1), 15, { color: INK, width: 2.2 });
    const g = svgEl('g', {}, svg), ldr = svgEl('line', { stroke: '#8a5a22', 'stroke-width': 8, 'stroke-linecap': 'round' }, g), rungs = [];
    for (let i = 1; i < 14; i++) rungs.push(svgEl('line', { stroke: '#8a5a22', 'stroke-width': 3 }, g));
    const hLeg = svgEl('line', { stroke: LA, 'stroke-width': 4, 'stroke-dasharray': '8 5' }, svg), fLeg = svgEl('line', { stroke: LB, 'stroke-width': 4, 'stroke-dasharray': '8 5' }, svg);
    const lL = lab(stage, 0, 0, '17 ft', 'u6l1-slab'), lF = lab(stage, 0, 0, '', 'u6l1-slab'), lH = lab(stage, 0, 0, '', 'u6l1-slab');
    lL.style.color = HC; lF.style.color = LB; lH.style.color = LA;
    const place = (f) => {
      const hh = Math.sqrt(L * L - f * f), A = P(0, hh), B = P(f, 0);
      ldr.setAttribute('x1', A[0]); ldr.setAttribute('y1', A[1]); ldr.setAttribute('x2', B[0]); ldr.setAttribute('y2', B[1]);
      const [nx, ny] = norm(B[1] - A[1], -(B[0] - A[0]));
      rungs.forEach((r, i) => { const t = (i + 1) / 14, cx = A[0] + (B[0] - A[0]) * t, cy = A[1] + (B[1] - A[1]) * t; r.setAttribute('x1', cx - nx * 9); r.setAttribute('y1', cy - ny * 9); r.setAttribute('x2', cx + nx * 9); r.setAttribute('y2', cy + ny * 9); });
      hLeg.setAttribute('x1', X0 + 4); hLeg.setAttribute('y1', Y0); hLeg.setAttribute('x2', X0 + 4); hLeg.setAttribute('y2', A[1]);
      fLeg.setAttribute('x1', X0); fLeg.setAttribute('y1', Y0 + 14); fLeg.setAttribute('x2', B[0]); fLeg.setAttribute('y2', Y0 + 14);
      const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; lL.style.left = m[0] + 26 + 'px'; lL.style.top = m[1] - 20 + 'px';
      lF.style.left = (X0 + B[0]) / 2 + 'px'; lF.style.top = Y0 + 30 + 'px'; lF.innerHTML = `${+f.toFixed(1)} ft`;
      lH.style.left = X0 + 50 + 'px'; lH.style.top = (Y0 + A[1]) / 2 + 'px'; lH.innerHTML = `${Number.isInteger(hh) ? hh : '≈ ' + hh.toFixed(1)} ft`;
    };
    let f0 = 8; place(f0); hide(lH);
    const P2 = panel(stage, 520, 16, W - 532, H - 32, 'Measure it');
    const tb = h('div', 'u6l1-lt', '<div class="u6l1-lth">foot</div><div class="u6l1-lth">height</div><div class="u6l1-lth">foot² + height²</div>'); P2.appendChild(tb);
    const rows = [[8, '15', '64+225=289'], [12, '\\approx12.0', '144+145=289'], [15, '8', '225+64=289']].map(([f, hh, s]) => {
      const cells = [h('div', 'u6l1-ltn', T(String(f))), h('div', 'u6l1-ltn', T(hh)), h('div', 'u6l1-lts', T(s))]; cells.forEach((e) => { hide(e); tb.appendChild(e); }); return cells;
    });
    const fin = hide(line(P2, `Always ${T('17^2=289')}: the ladder is <b>always</b> the hypotenuse.`, 'u6l1-boxed'));
    const slide = (c, f1) => tween(c, 1300, (t) => place(f0 + (f1 - f0) * t)).then(() => { f0 = f1; place(f1); });
    const showRow = async (c, r) => { for (const e of r) await show(c, e, 260); };
    return [
      { cap: 'The wall, the ground and the ladder make a <b>right triangle</b>. The right angle is where the wall meets the ground.', run: (c) => pulse(c, hLeg, 1.02) },
      { cap: `The ladder is across from the right angle: it is the <b>hypotenuse</b>. Height ${T('=\\sqrt{17^2-8^2}=\\sqrt{225}=15')} ft.`, run: async (c) => { await pop(c, lH); await showRow(c, rows[0]); } },
      { cap: `Pull the foot out to 12 ft. The top slides down: ${T('\\sqrt{17^2-12^2}=\\sqrt{145}\\approx12.0')} ft.`, run: async (c) => { await slide(c, 12); await showRow(c, rows[1]); } },
      { cap: `Pull it out to 15 ft: ${T('\\sqrt{17^2-15^2}=\\sqrt{64}=8')} ft. The foot and the height have swapped!`, run: async (c) => { await slide(c, 15); await showRow(c, rows[2]); } },
      { cap: `Every time, foot² + height² = 289 = ${T('17^2')}. The ladder never changes length, so it is always the hypotenuse.`, run: async (c) => { for (const r of rows) pulse(c, r[2], 1.08); await pop(c, fin); } }
    ];
  }
};

/* ======================================================================================
 * Math History: Plimpton 322 (c. 1800 BCE) — row 1: 1 59 and 2 49 → 119 and 169 → the other side is 120
 * ====================================================================================== */
function plimpton() {
  const svg = document.getElementById('u6l1-hist'); if (!svg) return;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); Object.keys(attrs || {}).forEach((k) => e.setAttribute(k, attrs[k])); (parent || svg).appendChild(e); return e; };
  const txt = (s, attrs, parent) => { const e = mk('text', attrs, parent); e.textContent = s; return e; };
  const steps = [], when = (el, ms) => { steps.push({ el, t: ms }); return el; };
  // the tablet
  const defs = mk('defs'), rg = mk('linearGradient', { id: 'u6l1h-clay', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  mk('stop', { offset: '0%', 'stop-color': '#e6cfa6' }, rg); mk('stop', { offset: '100%', 'stop-color': '#c9a678' }, rg);
  mk('path', { d: 'M18 26 Q14 18 24 16 L262 12 Q276 12 276 26 L280 206 Q280 220 266 220 L30 222 Q16 222 16 208 Z', fill: 'url(#u6l1h-clay)', class: 'u6l1h-clay' });
  // cuneiform: a vertical wedge is 1, a corner wedge (chevron) is 10
  const one = (g, x, y, s) => { const w = mk('g', { class: 'u6l1h-wedge', transform: `translate(${x} ${y}) scale(${s})` }, g); mk('path', { d: 'M-3.6 -8 L3.6 -8 L0 -3.2 Z' }, w); mk('line', { x1: 0, y1: -4, x2: 0, y2: 8 }, w); };
  const ten = (g, x, y, s) => { const w = mk('g', { class: 'u6l1h-wedge', transform: `translate(${x} ${y}) scale(${s})` }, g); mk('path', { d: 'M5 -7 L-5 0 L5 7 L1.5 0 Z' }, w); };
  function cune(g, n, x, y, S) {
    let cx = x;
    [[Math.floor(n / 10), ten, 10], [n % 10, one, 7.5]].forEach(([k, f, dx]) => {
      if (!k) return;
      const rows = k <= 3 ? [k] : k === 4 ? [2, 2] : [Math.ceil(k / 2), Math.floor(k / 2)];
      const two = rows.length > 1, s = S * (two ? 0.62 : 1), step = dx * s;
      rows.forEach((m, r) => { for (let i = 0; i < m; i++) f(g, cx + step / 2 + i * step, y + (two ? (r ? 5.5 : -5.5) * S : 0), s); });
      cx += Math.max(...rows) * step + 2 * S;
    });
    return cx - x;
  }
  // rows 1–3 as written on the tablet (base-60 digits): short side | diagonal (row 2's diagonal, 3 12 01, is a scribe's slip)
  const ROWS = [[[1, 59], [2, 49]], [[56, 7], [3, 12, 1]], [[1, 16, 41], [1, 50, 49]]];
  when(mk('rect', { x: 26, y: 34, width: 244, height: 52, rx: 9, fill: '#b07a12', class: 'u6l1h-glow' }), 1500);
  txt('short side', { x: 88, y: 30, 'text-anchor': 'middle', class: 'u6l1h-cap' }); txt('diagonal', { x: 212, y: 30, 'text-anchor': 'middle', class: 'u6l1h-cap' });
  ROWS.forEach((r, i) => {
    const y = 60 + i * 58, g = when(mk('g', { class: 'u6l1h-g' }), 200 + i * 300);
    let x = 34; r[0].forEach((n) => { x += cune(g, n, x, y, 1.3) + 8; });
    x = 160; r[1].forEach((n) => { x += cune(g, n, x, y, 1.3) + 8; });
    if (i < 2) mk('line', { x1: 28, x2: 268, y1: y + 29, y2: y + 29, class: 'u6l1h-rule' }, g);
  });
  mk('line', { x1: 150, x2: 150, y1: 36, y2: 210, class: 'u6l1h-rule' });
  txt('Plimpton 322, rows 1–3 (redrawn)', { x: 148, y: 244, 'text-anchor': 'middle', class: 'u6l1h-cap' });
  // reading row 1
  const XR = 304;
  const r1 = when(mk('g', { class: 'u6l1h-g' }), 2300);
  txt('Row 1, in base 60:', { x: XR, y: 26, class: 'u6l1h-lab' }, r1);
  const r2 = when(mk('g', { class: 'u6l1h-g' }), 3100);
  txt('1 59 → 1 × 60 + 59 = 119', { x: XR, y: 54, class: 'u6l1h-term', fill: '#8a58c9' }, r2);
  const r3 = when(mk('g', { class: 'u6l1h-g' }), 4100);
  txt('2 49 → 2 × 60 + 49 = 169', { x: XR, y: 82, class: 'u6l1h-term', fill: '#1f5bd6' }, r3);
  // the triangle: short side 119 (up), long side 120 (across), diagonal 169
  const TX = 334, TY = 246, Wt = 108, Ht = 107.1;
  const tri = when(mk('g', { class: 'u6l1h-g' }), 5200);
  mk('path', { d: `M${TX} ${TY} L${TX} ${TY - Ht} L${TX + Wt} ${TY} Z`, fill: '#fffaf1', stroke: '#4a2c14', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, tri);
  mk('path', { d: `M${TX + 11} ${TY} L${TX + 11} ${TY - 11} L${TX} ${TY - 11}`, fill: 'none', stroke: '#4a2c14', 'stroke-width': 1.8 }, tri);
  txt('119', { x: TX - 7, y: TY - Ht / 2 + 6, 'text-anchor': 'end', class: 'u6l1h-term', fill: '#8a58c9' }, tri);
  txt('169', { x: TX + Wt / 2 + 8, y: TY - Ht / 2 - 6, class: 'u6l1h-term', fill: '#1f5bd6' }, tri);
  const q = when(mk('g', { class: 'u6l1h-g u6l1h-q' }), 5200);
  txt('?', { x: TX + Wt / 2, y: TY + 22, 'text-anchor': 'middle', class: 'u6l1h-term' }, q);
  const calc = when(mk('g', { class: 'u6l1h-g' }), 6600);
  txt('169² − 119²', { x: 530, y: 150, 'text-anchor': 'middle', class: 'u6l1h-sum' }, calc);
  txt('= 14 400', { x: 530, y: 176, 'text-anchor': 'middle', class: 'u6l1h-sum' }, calc);
  const calc2 = when(mk('g', { class: 'u6l1h-g' }), 8000);
  txt('√14 400 = 120', { x: 530, y: 208, 'text-anchor': 'middle', class: 'u6l1h-final' }, calc2);
  const ans = when(mk('g', { class: 'u6l1h-g' }), 8800);
  txt('120', { x: TX + Wt / 2, y: TY + 22, 'text-anchor': 'middle', class: 'u6l1h-final' }, ans);
  when(txt('Whole numbers, 3800 years ago!', { x: 304, y: 292, class: 'u6l1h-final u6l1h-g' }), 9800);
  const qHide = { el: q, t: 8800 };
  const END = 10600;
  let t0 = 0, raf = 0;
  const draw = (ms) => { steps.forEach((s) => s.el.classList.toggle('on', s.t <= ms)); if (ms >= qHide.t) q.classList.remove('on'); };
  function frame(now) { if (!t0) t0 = now; const ms = now - t0; draw(ms); if (ms < END) raf = requestAnimationFrame(frame); }
  function play() {
    cancelAnimationFrame(raf); t0 = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { draw(END); return; }
    draw(-1); raf = requestAnimationFrame(frame);
  }
  draw(-1);
  svg.addEventListener('click', play);
  const btn = svg.closest('.hist-anim') && svg.closest('.hist-anim').querySelector('.hist-play'); if (btn) btn.addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.5 });
    io.observe(svg);
  } else play();
}

mountWarm();
mountStatics();
plimpton();
export const explainers = mountExplainers({ nameSides, squares, whyAll, verify, hypSteps, simplify, missingLeg, decide, ladder });

/* ============ Stand Up Break! — right triangles at the whiteboards (lessons/js/standup.js) ============ */
// Pythagorean triples (legs a < b, hypotenuse c); the assignment's own triangles are left out of each level
const SU_TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [11, 60, 61]];
const suScaled = (r, maxC) => { const opts = []; SU_TRIPLES.forEach(([a, b, c]) => { for (let k = 1; k * c <= maxC; k++) opts.push([a * k, b * k, c * k]); }); return opts; };
const suKey = (...v) => v.join(',');
const SU_AVOID_HYP = new Set([suKey(6, 8), suKey(10, 24), suKey(3, 6), suKey(7, 24), suKey(5, 12), suKey(9, 12)]); // Q4–8, Q13, Q5
const SU_AVOID_LEG = new Set([suKey(10, 6), suKey(26, 24), suKey(20, 12), suKey(15, 9)]);                      // Q9, Q10, Q14, Q11
/** a small right triangle figure (SVG): legs labelled la (vertical) and lb (horizontal), hypotenuse lc */
function suTri(a, b, la, lb, lc) {
  const W = 300, H = 170, pad = 40, s = Math.min((W - 2 * pad - 30) / b, (H - 2 * pad + 10) / a), x0 = 60, y0 = H - 34, ink = '#1c2230';
  const P = (x, y) => [x0 + x * s, y0 - y * s];
  const [A, B, C] = [P(0, 0), P(b, 0), P(0, a)];
  let g = `<rect width="${W}" height="${H}" rx="10" fill="#fff"/><path d="M${A} L${B} L${C} Z" fill="#f4f6fb" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
  g += `<path d="M${A[0] + 12} ${A[1]} L${A[0] + 12} ${A[1] - 12} L${A[0]} ${A[1] - 12}" fill="none" stroke="${ink}" stroke-width="1.8"/>`;
  g += `<text x="${A[0] - 10}" y="${(A[1] + C[1]) / 2 + 7}" text-anchor="end" font-size="21" fill="${LA}">${la}</text>`;
  g += `<text x="${(A[0] + B[0]) / 2}" y="${A[1] + 25}" text-anchor="middle" font-size="21" fill="${LB}">${lb}</text>`;
  g += `<text x="${(B[0] + C[0]) / 2 + 12}" y="${(B[1] + C[1]) / 2 - 8}" font-size="21" fill="${HC}">${lc}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="right triangle" font-family="KaTeX_Main, 'Times New Roman', serif" font-style="italic">${g}</svg>`;
}
const SU_STORIES = [
  (r) => { const [foot, up, lad] = r.pick(suScaled(r, 30).filter(([a, , c]) => !SU_AVOID_LEG.has(suKey(c, a))));
    return { text: `A ${lad} m ladder leans against a wall. Its foot is ${foot} m from the wall. How high up the wall does it reach?`, a: [`\\text{ladder} = \\text{hypotenuse};\\ h \\text{ is a leg}`, `h^2=${lad}^2-${foot}^2=${nT(lad * lad)}-${nT(foot * foot)}=${nT(up * up)}`, `h=\\sqrt{${nT(up * up)}}=${up}\\text{ m}`] }; },
  (r) => { const [a, b, c] = r.pick(suScaled(r, 50)); return { text: `A rectangular park is ${a} m by ${b} m. How long is the straight path from one corner to the opposite corner?`, a: [`d^2=${a}^2+${b}^2=${nT(a * a)}+${nT(b * b)}=${nT(c * c)}`, `d=\\sqrt{${nT(c * c)}}=${c}\\text{ m}`] }; },
  (r) => { const w = r.pick([16, 32, 40, 48]), hh = w * 3 / 4, dd = w * 5 / 4; return { text: `A TV screen is ${w} inches wide and ${hh} inches tall. TVs are sold by their diagonal. What size is this TV?`, a: [`d^2=${w}^2+${hh}^2=${nT(w * w)}+${nT(hh * hh)}=${nT(dd * dd)}`, `d=\\sqrt{${nT(dd * dd)}}=${dd}\\text{ in}`] }; },
  (r) => { const [a, b, c] = r.pick([[5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25]]); return { text: `A kite string is ${c} m long. The kite is right above a point ${a} m away from the person flying it. How high is the kite?`, a: [`\\text{string} = \\text{hypotenuse}`, `h^2=${c}^2-${a}^2=${nT(c * c)}-${nT(a * a)}=${nT(b * b)}`, `h=\\sqrt{${nT(b * b)}}=${b}\\text{ m}`] }; },
  (r) => { const a = r.int(2, 9), b = r.int(a + 1, 12), s2 = a * a + b * b; if (isSq(s2)) return null; return { text: `A wheelchair ramp rises ${a} ft over a horizontal distance of ${b} ft. How long is the ramp, to one decimal place?`, a: [`L^2=${a}^2+${b}^2=${nT(a * a)}+${nT(b * b)}=${s2}`, `L=\\sqrt{${s2}}\\approx${Math.sqrt(s2).toFixed(1)}\\text{ ft}`] }; },
  (r) => { const w = r.int(3, 9), l = r.int(w + 2, 14), s2 = w * w + l * l; if (isSq(s2)) return null; return { text: `A rectangular gate is ${w} ft wide and ${l} ft tall. How long is a brace from corner to corner? Give the exact answer and a decimal to one place.`, a: [`d^2=${w}^2+${l}^2=${nT(w * w)}+${nT(l * l)}=${s2}`, `d=\\sqrt{${s2}}${simpRad(s2)[0] > 1 ? '=' + radTex(s2) : ''}\\approx${Math.sqrt(s2).toFixed(1)}\\text{ ft}`] }; }
];
standup('u6l1', {
  intro: 'At your whiteboard station: find the right angle, decide hypotenuse or leg, then add or subtract the squares.',
  levels: {
    BEG: (r) => { // a missing hypotenuse, whole-number answer
      const opts = suScaled(r, 50).filter(([a, b]) => !SU_AVOID_HYP.has(suKey(a, b)));
      const [a, b, c] = r.pick(opts);
      return { text: 'Find the length of the hypotenuse.', q: `\\text{legs } ${a} \\text{ and } ${b}`, fig: suTri(a, b, a, b, 'c'),
        a: [`c^2=${a}^2+${b}^2=${nT(a * a)}+${nT(b * b)}=${nT(c * c)}`, `c=\\sqrt{${nT(c * c)}}=${c}`] };
    },
    PRG: (r) => { // a missing leg (whole number), or a hypotenuse that needs a simplified radical
      if (r.chance(0.6)) {
        const opts = suScaled(r, 50).filter(([a, , c]) => !SU_AVOID_LEG.has(suKey(c, a))), [a, b, c] = r.pick(opts), swap = r.chance(0.5), kn = swap ? b : a, mi = swap ? a : b;
        if (SU_AVOID_LEG.has(suKey(c, kn))) return { text: 'Find the length of the missing leg.', q: `\\text{hypotenuse } 17,\\ \\text{one leg } 8`, fig: suTri(8, 15, 8, 'b', 17), a: ['b^2=17^2-8^2=289-64=225', 'b=\\sqrt{225}=15'] };
        return { text: 'Find the length of the missing leg.', q: `\\text{hypotenuse } ${c},\\ \\text{one leg } ${kn}`, fig: swap ? suTri(mi, kn, 'a', kn, c) : suTri(kn, mi, kn, 'b', c),
          a: [`${swap ? 'a' : 'b'}^2=${c}^2-${kn}^2=${nT(c * c)}-${nT(kn * kn)}=${nT(mi * mi)}`, `${swap ? 'a' : 'b'}=\\sqrt{${nT(mi * mi)}}=${mi}`] };
      }
      let a, b, s2;
      do { a = r.int(1, 7); b = r.int(a, 9); s2 = a * a + b * b; } while (isSq(s2) || simpRad(s2)[0] === 1 || (a === 3 && b === 6) || (a === 4 && b === 8));
      return { text: 'Find the hypotenuse. Give the exact answer as a simplified mixed radical, then a decimal to two places.', q: `\\text{legs } ${a} \\text{ and } ${b}`, fig: suTri(a, b, a, b, 'c'),
        a: [`c^2=${a}^2+${b}^2=${a * a}+${b * b}=${s2}`, `c=\\sqrt{${s2}}=\\sqrt{${simpRad(s2)[0] ** 2}\\times${simpRad(s2)[1]}}=${radTex(s2)}`, `c\\approx${Math.sqrt(s2).toFixed(2)}`] };
    },
    MAS: (r) => { // a word problem: decide hypotenuse or leg first
      let x = null; while (!x) x = r.pick(SU_STORIES)(r);
      return { q: '', text: x.text + ' <i>Sketch it first.</i>', a: x.a };
    }
  }
});
