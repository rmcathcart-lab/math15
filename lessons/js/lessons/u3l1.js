/* Math 15 · Unit 3 · Lesson 1 — Like Terms, and Adding/Subtracting Polynomials.
 * (The Math 10C twin is u3/l1; the naming machine, the like-term families, the algebra tiles, the tile mat and the
 * add/subtract-with-tiles engine are adapted from it.) Warm-up "The Fruit Puzzle" and the explainers:
 *   anatomy    (Section 1: cut into terms, each term's coefficient and degree, the polynomial's degree; Example 1)
 *   nameMachine(Section 1: count the terms → monomial / binomial / trinomial / polynomial; Example 1 (e))
 *   sortLike   (Section 2: sort terms into families of like terms; Example 2)
 *   collect    (Section 3: one family at a time, add the coefficients; Example 3)
 *   addH       (Section 4: drop the brackets, collect; Example 4 (a), (b); the warm-up baskets)
 *   addTiles   (Section 4: algebra tiles, gather, zero pairs, count)
 *   vertAdd    (Section 4: line up like terms in columns, add down; Example 4 (c))
 *   flipAll    (Section 5: the minus reaches every term, the flip-one-sign mistake, a check at x = 1; Example 5 (a), (b))
 *   subTiles   (Section 5: flip every tile, then add)
 *   vertSub    (Section 5: flip the bottom row, add down; Example 5 (c))
 * Algebra tiles follow the Unit 3 legend: SHADED = positive, UNSHADED (outline only) = negative; x² teal, x amber,
 * 1 slate blue (the same as Math 10C Unit 3 and Math 15 Unit 4). */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s);
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;
const px = (e, p) => parseFloat(e.style[p]) || 0;
const plural = (n, w, ws) => n + ' ' + (n === 1 ? w : ws || w + 's');
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const word = (n) => WORD[n] || String(n);
const Word = (n) => { const w = word(n); return w[0].toUpperCase() + w.slice(1); };
const RED = '#c93a33', OK = '#12805a';

function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.8) rotate(-12deg)' }, { opacity: 1, transform: 'scale(1) rotate(-5deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }
const pulse = (c, el, s = 1.12) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);

/* an element's box in stage coordinates (the lesson may be scaled to fit the screen) */
function stagePos(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, l: (r.left - sr.left) / k, t: (r.top - sr.top) / k, r: (r.right - sr.left) / k, b: (r.bottom - sr.top) / k };
}
/* a copy of `html` flies from one element to another inside the stage */
async function fly(c, stage, from, to, html, o = {}) {
  if (c.fast || !from || !to) return;
  c.check();
  const a = stagePos(stage, from), b = stagePos(stage, to);
  const g = add(stage, h('div', 'u3l1-fly c', html), a.x, a.y); if (o.fs) g.style.fontSize = o.fs + 'px';
  g.style.opacity = 0;
  try {
    await c.anim(g, [{ opacity: 1, transform: 'translate(0,0) scale(1.05)' }, { opacity: 1, transform: `translate(${(b.x - a.x) / 2}px, ${(b.y - a.y) / 2 - 30}px) scale(1.15)`, offset: 0.5 }, { opacity: 0.85, transform: `translate(${b.x - a.x}px, ${b.y - a.y}px) scale(.9)` }], o.ms || 700, { delay: o.delay || 0 });
  } finally { g.remove(); }
}
/* an arrow that draws itself from (x1,y1) to (x2,y2), bulging up by `lift` */
function arcLayer(stage) { const s = svgEl('svg', { class: 'u3l1-arcs' }); stage.appendChild(s); return s; }
function arrow(svg, x1, y1, x2, y2, lift, col) {
  const cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - lift;
  const p = svgEl('path', { d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, fill: 'none', stroke: col, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, svg);
  const ang = Math.atan2(y2 - cy, x2 - cx), L = 13, wd = 0.46;
  const hd = svgEl('polygon', { points: [[x2, y2], [x2 - L * Math.cos(ang - wd), y2 - L * Math.sin(ang - wd)], [x2 - L * Math.cos(ang + wd), y2 - L * Math.sin(ang + wd)]].map((q) => q.join(',')).join(' '), fill: col }, svg);
  const len = p.getTotalLength() || 1;
  p.style.strokeDasharray = len; p.style.strokeDashoffset = len; hd.style.opacity = 0;
  return {
    async draw(c, ms = 480) { await c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms); await c.anim(hd, [{ opacity: 0 }, { opacity: 1 }], 140); },
    dim(c) { return Promise.all([p, hd].map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0.25 }], 250))); }
  };
}

/* ============ general terms: { c: coefficient, v: { x: 2, y: 1 } } ============ */
function parseTerm(s) {
  const m = String(s).replace(/\s+/g, '').match(/^([+-]?)(\d*)((?:[a-z](?:\^\d+)?)*)$/);
  if (!m) throw new Error('bad term ' + s);
  const v = {};
  (m[3].match(/[a-z](?:\^\d+)?/g) || []).forEach((p) => { const k = p[0], e = p.length > 1 ? parseInt(p.slice(2), 10) : 1; v[k] = (v[k] || 0) + e; });
  return { c: (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : parseInt(m[2], 10)), v };
}
const parsePoly = (s) => String(s).replace(/\s+/g, '').match(/[+-]?[^+-]+/g).map(parseTerm);
const keyT = (t) => Object.keys(t.v).sort().map((k) => k + t.v[k]).join('');
const degT = (t) => Object.values(t.v).reduce((s, e) => s + e, 0);
function bodyT(t) { const a = Math.abs(t.c), vs = Object.keys(t.v).sort().map((k) => (t.v[k] === 1 ? k : `${k}^{${t.v[k]}}`)).join(''); return vs ? (a === 1 ? '' : a) + vs : String(a); }
const gTermT = (t, first) => (t.c < 0 ? '-' : first ? '' : '+') + bodyT(t);
const gPolyT = (list) => (list.length ? list.map((t, i) => gTermT(t, i === 0)).join('') : '0');
const negG = (P) => P.map((t) => ({ c: -t.c, v: { ...t.v } }));
function collectG(list) { // combine like terms; highest degree first, ties in order of appearance
  const m = new Map();
  list.forEach((t) => { const k = keyT(t); if (m.has(k)) m.get(k).c += t.c; else m.set(k, { c: t.c, v: { ...t.v } }); });
  return [...m.values()].map((t, i) => ({ t, i })).filter((o) => o.t.c !== 0).sort((a, b) => degT(b.t) - degT(a.t) || a.i - b.i).map((o) => o.t);
}
const at1 = (P) => P.reduce((s, t) => s + t.c, 0); // value when every variable is 1
const sumWords = (P) => P.map((t, i) => (t.c < 0 ? '-' : i ? '+' : '') + Math.abs(t.c)).join('');

/* ======================================================================
 * Algebra tiles (adapted from Math 10C 3.1)
 * ====================================================================== */
const TX = 70, TU = 20, TG = 6;
const KINDS = ['x2', 'x', '1'];
const KCOL = { x2: '#0d6a64', x: '#a3610a', 1: '#3558a0' };
const KT = { x2: 'x^2', x: 'x', 1: '1' };
const KNAMES = (k, n) => (k === '1' ? (n === 1 ? 'unit tile' : 'unit tiles') : T(KT[k]) + (n === 1 ? '-tile' : '-tiles'));

function tdim(k, s = 1) { return k === 'x2' ? [TX * s, TX * s] : k === 'x' ? [TU * s, TX * s] : [TU * s, TU * s]; }
function tileLabel(k) { return k === 'x2' ? '<i>x</i><sup>2</sup>' : k === 'x' ? '<i>x</i>' : '1'; }
function tile(k, sg, s = 1, lab = true, tag = 'div') {
  const e = h(tag, `u3l1t u3l1t-${k === '1' ? 'u' : k} ${sg > 0 ? 'pos' : 'neg'}`);
  const [w, ht] = tdim(k, s); e.style.width = w + 'px'; e.style.height = ht + 'px';
  e.style.fontSize = (k === 'x2' ? 25 : k === 'x' ? 18 : 12) * Math.max(s, 0.75) + 'px';
  if (lab) e.innerHTML = '<span class="u3l1t-l">' + tileLabel(k) + '</span>';
  e._k = k; e._s = sg; return e;
}
function flipTile(e) { e._s = -e._s; e.classList.toggle('pos', e._s > 0); e.classList.toggle('neg', e._s < 0); }
function termT(c, k, first, col) {
  const a = Math.abs(c); let body = k === '1' ? String(a) : (a === 1 ? '' : a) + KT[k];
  if (col) body = tc(KCOL[k], body);
  return (c < 0 ? '-' : first ? '' : '+') + body;
}
function polyT(P, col) { const out = []; KINDS.forEach((k) => { const c = P[k] || 0; if (c) out.push(termT(c, k, !out.length, col)); }); return out.length ? out.join('') : '0'; }
const negP = (P) => { const r = {}; for (const k in P) r[k] = -P[k]; return r; };
const sumP = (A, B) => { const r = {}; KINDS.forEach((k) => { const v = (A[k] || 0) + (B[k] || 0); if (v) r[k] = v; }); return r; };

/* the mat: one zone per kind of tile; shaded tiles ABOVE the middle line, unshaded BELOW it, so zero pairs line up */
function matLayout(counts, W, o = {}) {
  const kinds = o.kinds || KINDS.filter((k) => counts[k] && counts[k].p + counts[k].n > 0);
  const pad = 14, ZG = 22, margin = o.margin == null ? 30 : o.margin;
  const colsOf = (k) => Math.max(o.minCols || 1, counts[k] ? Math.max(counts[k].p, counts[k].n) : 0);
  const width = (s) => kinds.reduce((t, k) => { const n = colsOf(k); return t + n * tdim(k, s)[0] + (n - 1) * TG * s + 2 * pad; }, 0) + ZG * (kinds.length - 1);
  let s = o.s || 1;
  for (let i = 0; i < 6; i++) { const w = width(s); if (w > W - margin) s *= (W - margin) / w; }
  let x = (W - width(s)) / 2; const zones = {};
  kinds.forEach((k) => { const n = colsOf(k), tw = tdim(k, s)[0], w = n * tw + (n - 1) * TG * s; zones[k] = { k, x, w: w + 2 * pad, x0: x + pad, step: tw + TG * s }; x += w + 2 * pad + ZG; });
  const gap = o.gap || 22, my = o.my;
  return {
    s, kinds, zones, my, gap, top: my - gap / 2 - TX * s, bot: my + gap / 2 + TX * s,
    pos(k, sg, i) { const z = zones[k], th = tdim(k, s)[1]; return { x: z.x0 + i * z.step, y: sg > 0 ? my - gap / 2 - th : my + gap / 2 }; }
  };
}
function zoneFrame(stage, L, k) {
  const z = L.zones[k], y = L.top - 38;
  const e = add(stage, h('div', 'u3l1-zone', `<div class="u3l1-zh">${K(tc(KCOL[k], KT[k]))}-tiles</div><i class="u3l1-zm"></i><b class="u3l1-zp">+</b><b class="u3l1-zn">−</b>`), z.x, y);
  e.style.width = z.w + 'px'; e.style.height = (L.bot - L.top + 50) + 'px';
  e.querySelector('.u3l1-zm').style.top = (L.my - y) + 'px';
  e.style.setProperty('--zc', KCOL[k]);
  return e;
}
async function cancelPairs(c, stage, L, P, N, k) {
  const m = Math.min(P.length, N.length), [tw, th] = tdim(k, L.s), cy = L.my - th / 2;
  const zs = [];
  for (let i = 0; i < m; i++) { const z = add(stage, h('div', 'u3l1-zero c', '0'), px(P[i], 'left') + tw / 2, L.my); hide(z); zs.push(z); }
  await Promise.all(Array.from({ length: m }, async (_, i) => {
    const a = P[i], b = N[i];
    await c.sleep(i * 170);
    await Promise.all([c.anim(a, [{ top: a.style.top }, { top: cy + 'px' }], 420), c.anim(b, [{ top: b.style.top }, { top: cy + 'px' }], 420)]);
    const gone = [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.25)' }];
    await Promise.all([c.anim(a, gone, 380), c.anim(b, gone, 380), c.anim(zs[i], [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1.25)', offset: 0.45 }, { opacity: 0, transform: 'scale(1)' }], 760)]);
  }));
  for (let i = 0; i < m; i++) { P[i].style.display = N[i].style.display = 'none'; zs[i].remove(); }
  const rest = P.length > m ? P.slice(m) : N.slice(m), sg = P.length > m ? 1 : -1;
  await Promise.all(rest.map((e, j) => c.anim(e, [{ left: e.style.left }, { left: L.pos(k, sg, j).x + 'px' }], 420, { delay: 80 })));
}
function tileRow(stage, groups, x0, base, s, o = {}) {
  const GG = o.gg || 30, out = []; let x = x0;
  groups.forEach(([k, n]) => {
    const [tw, th] = tdim(k, s), els = [], gx = x;
    for (let i = 0; i < Math.abs(n); i++) { const e = add(stage, tile(k, Math.sign(n), s, o.lab !== false), x, base - th); els.push(e); x += tw + TG * s; }
    x += GG - TG * s; out.push({ k, n, els, x: gx, w: x - GG - gx });
  });
  return out;
}
const rowWidth = (groups, s, GG = 30) => groups.reduce((t, [k, n], i) => t + (i ? GG : 0) + Math.abs(n) * (tdim(k, s)[0] + TG * s) - TG * s, 0);
const groupsOf = (P) => KINDS.filter((k) => P[k]).map((k) => [k, P[k]]);

/* ============ 4–5. Add with tiles / subtract by flipping (shared engine) ============ */
const COMB = {
  a1: { A: { x2: 2, x: 3, 1: -1 }, B: { x2: 1, x: -5, 1: 4 }, op: 1 },
  a2: { A: { x: 4, 1: -3 }, B: { x: 2, 1: 5 }, op: 1 },
  e4a: { A: { x2: 2, x: 3, 1: -5 }, B: { x2: 4, x: -1, 1: 7 }, op: 1 },
  s1: { A: { x: 3, 1: 2 }, B: { x: 1, 1: -4 }, op: -1 },
  s2: { A: { x2: 1, x: 3, 1: -2 }, B: { x2: 2, x: 1, 1: -5 }, op: -1 },
  e5a: { A: { x2: 6, x: 4, 1: -3 }, B: { x2: 2, x: 7, 1: -5 }, op: -1 }
};
const qT = (d, col) => `(${polyT(d.A, col)})${d.op < 0 ? '-' : '+'}(${polyT(d.B, col)})`;
function combineMake(stage, d, W) {
  const sub = d.op < 0, A = d.A, B = d.B, Bf = sub ? negP(B) : B, R = sumP(A, Bf);
  const kinds = KINDS.filter((k) => A[k] || B[k]);
  const counts = {}; kinds.forEach((k) => { counts[k] = { p: 0, n: 0 }; [A[k] || 0, Bf[k] || 0].forEach((v) => { if (v > 0) counts[k].p += v; else counts[k].n -= v; }); });
  const LX = 236, GG = 24, top0 = 106, bandGap = 50;
  let s = Math.min(1, (W - LX - 24) / rowWidth(groupsOf(A), 1, GG), (W - LX - 24) / rowWidth(groupsOf(B), 1, GG));
  const geo = (s) => { const yA = top0 + TX * s, yB = yA + bandGap + TX * s; return { yA, yB, my: (top0 + yB) / 2 }; };
  let G = geo(s), L = matLayout(counts, W, { my: G.my, s, kinds });
  if (L.s < s) { s = L.s; G = geo(s); L = matLayout(counts, W, { my: G.my, s, kinds }); }
  add(stage, h('div', 'u3l1-head c', K(qT(d, true))), W / 2, 38);
  const frames = {}; kinds.forEach((k) => { frames[k] = zoneFrame(stage, L, k); hide(frames[k]); });
  const labA = add(stage, h('div', 'u3l1-blab', K(polyT(A, true))), 22, G.yA - TX * s / 2);
  const labB = add(stage, h('div', 'u3l1-blab', K(`${sub ? '-' : '+'}(${polyT(B, true)})`)), 22, G.yB - TX * s / 2);
  const rowA = tileRow(stage, groupsOf(A), LX, G.yA, s, { gg: GG }), rowB = tileRow(stage, groupsOf(B), LX, G.yB, s, { gg: GG });
  const tA = rowA.flatMap((g) => g.els), tB = rowB.flatMap((g) => g.els), all = [...tA, ...tB];
  hide(...all);
  const tallies = {}; kinds.forEach((k) => { const z = L.zones[k]; tallies[k] = add(stage, h('div', 'u3l1-tally c', K(R[k] ? termT(R[k], k, true, true) : '0')), z.x + z.w / 2, L.bot + 34); hide(tallies[k]); });
  const res = add(stage, h('div', 'u3l1-res c', K(`=${polyT(R, true)}`)), W / 2, L.bot + 90); hide(res);
  const P = {}, N = {};
  const assign = () => { kinds.forEach((k) => { P[k] = []; N[k] = []; }); all.forEach((e) => { (e._s > 0 ? P : N)[e._k].push(e); }); };
  const steps = [{
    cap: `Model each polynomial: ${T(polyT(A))} on top, ${T(polyT(B))} below. <b>Shaded</b> tiles are positive; <b>unshaded</b> tiles are negative.`,
    run: (c) => Promise.all(all.map((e, i) => c.pop(e, 320, { delay: i * 35 })))
  }];
  if (sub) steps.push({
    cap: `Subtracting is <b>adding the opposite</b>, so <b>flip every tile</b> of the second polynomial: shaded ↔ unshaded. ${T(`-(${polyT(B)})`)} becomes ${T(`+(${polyT(Bf)})`)}.`,
    run: async (c) => {
      await Promise.all(tB.map(async (e, i) => {
        await c.anim(e, [{ transform: 'perspective(400px) rotateY(0deg)' }, { transform: 'perspective(400px) rotateY(90deg)' }], 230, { delay: i * 55, easing: 'ease-in' });
        flipTile(e);
        await c.anim(e, [{ transform: 'perspective(400px) rotateY(-90deg)' }, { transform: 'perspective(400px) rotateY(0deg)' }], 230, { easing: 'ease-out' });
      }));
      labB.innerHTML = K(`+(${polyT(Bf, true)})`);
      await c.anim(labB, [{ transform: 'translateY(-50%) scale(1)' }, { transform: 'translateY(-50%) scale(1.15)' }, { transform: 'translateY(-50%) scale(1)' }], 380);
    }
  });
  steps.push({
    cap: `<b>Gather like tiles</b>: same shape, same group. Shaded tiles go <b>above</b> the line and unshaded tiles <b>below</b> it, so any zero pairs line up.`,
    run: async (c) => {
      assign();
      const moves = [];
      kinds.forEach((k) => { P[k].forEach((e, i) => moves.push([e, L.pos(k, 1, i)])); N[k].forEach((e, i) => moves.push([e, L.pos(k, -1, i)])); });
      await Promise.all([c.anim(labA, [{ opacity: 1 }, { opacity: 0 }], 300), c.anim(labB, [{ opacity: 1 }, { opacity: 0 }], 300),
        ...kinds.map((k) => c.fadeIn(frames[k], 400, { from: 'none' })),
        ...moves.map(([e, p], i) => c.anim(e, [{ left: e.style.left, top: e.style.top }, { left: p.x + 'px', top: p.y + 'px' }], 800, { delay: 200 + i * 22 }))]);
    }
  });
  const pairK = kinds.filter((k) => counts[k].p && counts[k].n);
  if (!pairK.length) steps.push({
    cap: `Look for <b>zero pairs</b>: a shaded and an unshaded tile of the <b>same shape</b>. There are none here, so nothing cancels.`,
    run: (c) => Promise.all(kinds.map((k) => c.anim(frames[k], [{ transform: 'scale(1)' }, { transform: 'scale(1.03)' }, { transform: 'scale(1)' }], 400)))
  });
  pairK.forEach((k) => {
    const m = Math.min(counts[k].p, counts[k].n), kt = KT[k];
    steps.push({
      cap: `<b>${m === 1 ? 'One zero pair' : Word(m) + ' zero pairs'}</b> in the ${KNAMES(k, 2)}: a shaded tile and an unshaded tile add to zero, ${T(`${kt}+(-${kt})=0`)}. Take them away.`,
      run: (c) => { assign(); return cancelPairs(c, stage, L, P[k], N[k], k); }
    });
  });
  const leftTxt = kinds.map((k) => { const v = R[k] || 0, a = Math.abs(v); return v ? `${word(a)} ${v > 0 ? 'shaded' : 'unshaded'} ${KNAMES(k, a)} → ${T(termT(v, k, true))}` : `no ${KNAMES(k, 2)} → ${T('0')}`; });
  steps.push({
    cap: `<b>Count what’s left:</b> ${leftTxt.join('; ')}. So ${T(qT(d) + '=' + polyT(R))}.`,
    run: async (c) => { await Promise.all(kinds.map((k, i) => c.pop(tallies[k], 380, { delay: i * 160 }))); await c.pop(res, 450); }
  });
  return steps;
}
const addTiles = {
  title: 'Add with tiles: gather, cancel, count',
  height: 418,
  minW: 820,
  choices: [{ v: 'a2', label: tex(qT(COMB.a2)) }, { v: 'a1', label: tex(qT(COMB.a1)) }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }],
  intro: (k) => `Add ${T(qT(COMB[k]))} with algebra tiles.`,
  make(stage, key, ex) { return combineMake(stage, COMB[key], ex.W); }
};
const subTiles = {
  title: 'Subtract by flipping: add the opposite',
  height: 418,
  minW: 820,
  choices: [{ v: 's1', label: tex(qT(COMB.s1)) }, { v: 's2', label: tex(qT(COMB.s2)) }, { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }],
  intro: (k) => `Subtract ${T(qT(COMB[k]))} with algebra tiles.`,
  make(stage, key, ex) { return combineMake(stage, COMB[key], ex.W); }
};

/* ============ 1. Anatomy of a polynomial: terms, coefficients, degrees ============ */
const AN = {
  n1: [{ t: '3x^2', c: '3', v: [['x', 2]] }, { t: '-7x', c: '-7', v: [['x', 1]] }, { t: '+5', c: '5', v: [] }],
  n2: [{ t: '6xy', c: '6', v: [['x', 1], ['y', 1]] }, { t: '-x', c: '-1', v: [['x', 1]], hid: true }, { t: '+9', c: '9', v: [] }],
  e1: [{ t: '4x^3', c: '4', v: [['x', 3]] }, { t: '-5x^2', c: '-5', v: [['x', 2]] }, { t: '+2x', c: '2', v: [['x', 1]] }, { t: '-9', c: '-9', v: [] }]
};
const NAMES = ['', 'monomial', 'binomial', 'trinomial'];
const nameOf = (n) => NAMES[n] || 'polynomial';
const anQ = (k) => AN[k].map((t) => t.t).join('');
const bare = (t) => t.replace(/^\+/, '');
const anatomy = {
  title: 'Take a polynomial apart, term by term',
  height: 402,
  minW: 760,
  value: 'n1',
  choices: [{ v: 'n1', label: tex(anQ('n1')) }, { v: 'n2', label: tex(anQ('n2')) }, { sep: 'Example 1 check:' }, { v: 'e1', label: tex(anQ('e1')) }],
  intro: (k) => `Name every piece of ${T(anQ(k))}.`,
  make(stage, key, ex) {
    const W = ex.W, d = AN[key], n = d.length, cw = Math.min(230, (W - 40) / n), x0 = (W - cw * n) / 2;
    const degs = d.map((t) => t.v.reduce((s, [, e]) => s + e, 0)), top = Math.max(...degs);
    const LBL = add(stage, h('div', 'u3l1-anl'), 10, 0);
    LBL.innerHTML = '<div style="top:126px">coefficient</div><div style="top:176px">exponents</div><div style="top:274px">degree</div>';
    hide(LBL);
    // the polynomial written as one line first; each term is a box that can slide to its own column
    const boxes = d.map((t, i) => add(stage, h('div', 'u3l1-anbox c', K(i ? '{}' + t.t : t.t)), 0, 50));
    { const ws = boxes.map((b) => b.offsetWidth - 20), tot = ws.reduce((a, b) => a + b, 0); let x = (W - tot) / 2; boxes.forEach((b, i) => { b.style.left = (x + ws[i] / 2) + 'px'; x += ws[i]; }); }
    const cols = d.map((t, i) => {
      const cx = x0 + cw * (i + 0.5);
      const coef = add(stage, h('div', 'u3l1-ancoef c', K(t.c) + (t.hid ? `<small>${K(bare(t.t))} means ${K(t.c === '-1' ? '-1' + bare(t.t).slice(1) : '1' + bare(t.t))}</small>` : !t.v.length ? '<small>itself</small>' : '')), cx, 126);
      const list = add(stage, h('div', 'u3l1-dglist u3l1-antop'), cx, 160);
      list.innerHTML = t.v.length ? t.v.map(([v, e]) => `<div>${K(v)}<i class="ar">→</i><b>${e}</b>${e === 1 ? '<em>hidden 1</em>' : ''}</div>`).join('') : '<div class="muted">no variable</div>';
      if (t.v.length > 1) list.innerHTML += `<div class="u3l1-ansum">${K(t.v.map(([, e]) => e).join('+') + '=' + degs[i])}</div>`;
      const badge = add(stage, h('div', 'u3l1-dgb c', String(degs[i])), cx, 274);
      hide(coef, list, badge); return { cx, coef, list, badge, box: boxes[i] };
    });
    const cst = d.find((t) => !t.v.length);
    const spec = add(stage, h('div', 'u3l1-spec'), 30, 316); spec.style.width = (W - 60) + 'px';
    spec.innerHTML = [['Terms', `${n} → <b>${nameOf(n)}</b>`], ['Degree', `<b>${top}</b> <span class="muted">(the highest)</span>`], ['Constant term', cst ? K(bare(cst.t)) : 'none']].map(([a, b]) => `<div><i class="k">${a}</i>${b}</div>`).join('');
    hide(spec);
    const steps = [{
      cap: `Cut it into <b>terms</b> at every ${T('+')} and ${T('-')} sign: ${plural(n, 'term')}. <b>Each term keeps the sign in front of it</b>${d.some((t) => t.t[0] === '-') ? `, so ${d.filter((t) => t.t[0] === '-').map((t) => T(t.t)).join(' and ')} ${d.filter((t) => t.t[0] === '-').length > 1 ? 'are negative terms' : 'is a negative term'}` : ''}.`,
      run: async (c) => {
        await Promise.all(cols.map((x, i) => { x.box.classList.add('on'); x.box.innerHTML = K(bare(d[i].t)); if (d[i].t[0] === '-') x.box.classList.add('neg'); return c.anim(x.box, [{ left: x.box.style.left }, { left: x.cx + 'px' }], 600, { delay: i * 60 }); }));
        await c.fadeIn(LBL, 300, { from: 'none' });
      }
    }];
    d.forEach((t, i) => {
      const x = cols[i], b = bare(t.t);
      let cap;
      if (!t.v.length) cap = `${T(b)} has no variable: it’s the <b>constant term</b>. Its coefficient is just ${T(b)} itself, and its degree is <b>0</b>.`;
      else {
        cap = `${T(b)}: the <b>coefficient</b> is ${T(t.c)}${t.hid ? ` (no number is written, so it’s ${T(t.c)}: ${T(b)} means ${T(t.c === '-1' ? '-1' + b.slice(1) : '1' + b)})` : ''}. `;
        cap += t.v.length > 1 ? `Its <b>degree</b> is the sum of its exponents: ${T(t.v.map(([, e]) => e).join('+') + '=' + degs[i])}.` : `Its <b>degree</b> is ${degs[i]}${t.v[0][1] === 1 ? ` (${T(t.v[0][0])} means ${T(t.v[0][0] + '^1')})` : ''}.`;
      }
      steps.push({
        cap,
        run: async (c) => { x.box.classList.add('hot'); await c.pop(x.coef, 360); await c.fadeIn(x.list, 300); await c.pop(x.badge, 360); x.box.classList.remove('hot'); }
      });
    });
    steps.push({
      cap: `The polynomial’s degree is its <b>highest</b> term degree: <b>${top}</b>. Don’t add them all up! With ${plural(n, 'term')} it’s ${n < 4 ? `a <b>${nameOf(n)}</b>` : 'simply called a <b>polynomial</b>'}.${cst ? ` Constant term: ${T(bare(cst.t))}.` : ''}`,
      run: async (c) => {
        cols.forEach((x, i) => x.badge.classList.add(degs[i] === top ? 'top' : 'low'));
        await Promise.all([...cols.filter((x, i) => degs[i] === top).map((x) => c.anim(x.badge, [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], 450)), c.fadeIn(spec, 400, { delay: 300 })]);
      }
    });
    return steps;
  }
};

/* ============ 1. The naming machine (count the terms) ============ */
const NM = {
  set1: [
    { t: ['5y'] }, { t: ['y', '-6'] }, { t: ['y^2', '+y', '-6'] },
    { t: ['6xy'], note: `${T('6xy')} is <b>one</b> term: everything is multiplied, with no ${T('+')} or ${T('-')} inside.` },
    { t: ['-3x^2'], note: `The ${T('-')} in front belongs to the term (there’s nothing before it to cut from).` },
    { t: ['x^3', '-2x^2', '+x', '-5'], note: 'Four or more terms: no special name, it’s just a <b>polynomial</b>.' }
  ],
  e1: [{ t: ['4x^3', '-5x^2', '+2x', '-9'], note: 'Mono, bi and tri name 1, 2 and 3 terms; with four terms it is simply a <b>polynomial</b>.' }]
};
const nameMachine = {
  title: 'The naming machine: cut at every + and −',
  height: 456,
  minW: 760,
  value: 'set1',
  choices: [{ v: 'set1', label: 'Six polynomials' }, { sep: 'Example 1 check:' }, { v: 'e1', label: '(e)' }],
  intro: (k) => (k === 'e1' ? `Name ${T(NM.e1[0].t.join(''))} by its number of terms.` : 'Name each polynomial by its number of terms.'),
  make(stage, key, ex) {
    const W = ex.W, list = NM[key];
    const belt = add(stage, h('div', 'u3l1-belt'), 20, 34); belt.style.width = (W - 40) + 'px';
    const BN = 4, gap = 14, bw = (W - 40 - gap * (BN - 1)) / BN, by = 186;
    const bins = ['Monomial', 'Binomial', 'Trinomial', 'Polynomial'].map((nm, i) => {
      const b = add(stage, h('div', 'u3l1-nbin', `<div class="u3l1-nbin-h"><b>${nm}</b><i>${i < 3 ? plural(i + 1, 'term') : '4 or more terms'}</i></div><div class="u3l1-nbin-c"></div>`), 20 + i * (bw + gap), by);
      b.style.width = bw + 'px'; return { b, c: b.querySelector('.u3l1-nbin-c') };
    });
    let cur = [];
    return list.map((it) => {
      const n = it.t.length, bi = Math.min(n, 4) - 1;
      return {
        cap: `${T(it.t.join(''))}: ${n > 1 ? `cut at ${plural(n - 1, 'sign')} → <b>${plural(n, 'term')}</b>` : '<b>no cuts</b> → <b>1 term</b>'}, so it’s a <b>${nameOf(n)}</b>. ${it.note || ''}`,
        run: async (c) => {
          cur.forEach((e) => e.remove()); cur = [];
          const pieces = it.t.map((t) => { const e = add(stage, h('div', 'u3l1-piece c', K(t)), 0, 100); hide(e); cur.push(e); return e; });
          const ws = pieces.map((e) => e.offsetWidth), tot = ws.reduce((a, b) => a + b, 0);
          let x = (W - tot) / 2; pieces.forEach((e, i) => { e.style.left = (x + ws[i] / 2) + 'px'; x += ws[i]; });
          await Promise.all(pieces.map((e) => c.anim(e, [{ opacity: 0, transform: 'translateX(-60px)' }, { opacity: 1, transform: 'none' }], 450)));
          if (n > 1) {
            const cuts = pieces.slice(1).map((e) => { const cut = add(stage, h('div', 'u3l1-cut', '<span>✂</span>'), px(e, 'left') - e.offsetWidth / 2 - 2, 58); hide(cut); cur.push(cut); return cut; });
            await Promise.all(cuts.map((e, i) => c.anim(e, [{ opacity: 0, transform: 'translateY(-20px)' }, { opacity: 1, transform: 'none' }], 300, { delay: i * 160 })));
            const spread = 38, mid = (n - 1) / 2;
            await Promise.all([...pieces.map((e, i) => c.anim(e, [{ left: e.style.left }, { left: (px(e, 'left') + (i - mid) * spread) + 'px' }], 420)),
              ...cuts.map((e, i) => c.anim(e, [{ left: e.style.left }, { left: (px(e, 'left') + (i + 0.5 - mid) * spread) + 'px' }], 420))]);
          }
          const nums = pieces.map((e, i) => { const b = add(stage, h('div', 'u3l1-cnt c', String(i + 1)), px(e, 'left'), 56); hide(b); cur.push(b); return b; });
          for (const b of nums) await c.pop(b, 260);
          const chip = h('div', 'u3l1-nchip', K(it.t.join('')));
          bins[bi].c.appendChild(chip); hide(chip);
          { const maxW = bins[bi].b.clientWidth - 14; if (chip.offsetWidth > maxW) chip.style.fontSize = Math.floor(21 * maxW / chip.offsetWidth) + 'px'; }
          bins.forEach((b, i) => b.b.classList.toggle('on', i === bi));
          await fly(c, stage, pieces[Math.floor((n - 1) / 2)], chip, K(it.t.join('')), { fs: 28, ms: 650 });
          await c.pop(chip, 360);
        }
      };
    });
  }
};

/* ============ 2–4. Like terms: sort into families, then collect one family at a time ============ */
const FT = { x2: 'x^2', x: 'x', 1: '', y2: 'y^2', y: 'y', a: 'a', b: 'b', xy: 'xy', fa: 'a', fo: 'o', fb: 'b' };
const FIX = { x2: '#0d6a64', y2: '#0d6a64', x: '#a3610a', 1: '#3558a0', y: '#7b4fc4', a: '#a3610a', b: '#7b4fc4', xy: '#7b4fc4', fa: '#c93a33', fo: '#d06a0c', fb: '#9a7a06' };
const FHEAD = { 1: 'numbers', fa: 'apples', fo: 'oranges', fb: 'bananas' };
const LT = {
  fruit: { groups: [{ s: 1, t: [[1, 'fo'], [1, 'fa'], [3, 'fb'], [1, 'fa'], [1, 'fo'], [1, 'fa']] }], fams: ['fa', 'fo', 'fb'] },
  s1: { list: true, groups: [{ s: 1, t: [[3, 'x2'], [2, 'y'], [-1, 'x'], [6, '1'], [-5, 'x2'], [4, 'x'], [1, 'y'], [-1, '1']] }], fams: ['x2', 'x', 'y', '1'] },
  e2: { list: true, groups: [{ s: 1, t: [[-1, 'x'], [7, 'x'], [5, 'x2'], [9, '1'], [4, 'y'], [2, 'x2'], [-3, 'y'], [-6, '1'], [1, 'x']] }], fams: ['x', 'x2', 'y', '1'] },
  c1: { groups: [{ s: 1, t: [[3, 'x2'], [5, 'x'], [-2, 'x2'], [1, 'x']] }], fams: ['x2', 'x'] },
  e3a: { groups: [{ s: 1, t: [[6, 'x'], [4, '1'], [-2, 'x'], [9, '1']] }], fams: ['x', '1'] },
  e3b: { groups: [{ s: 1, t: [[5, 'y2'], [-3, 'y'], [2, 'y2'], [8, 'y'], [-1, '1']] }], fams: ['y2', 'y', '1'] },
  e3c: { groups: [{ s: 1, t: [[7, 'a'], [-3, 'b'], [2, 'a'], [5, 'b'], [-4, '1']] }], fams: ['a', 'b', '1'] },
  e3d: { groups: [{ s: 1, t: [[9, 'x2'], [-4, 'x'], [3, '1'], [-5, 'x2'], [6, 'x'], [-7, '1']] }], fams: ['x2', 'x', '1'] },
  h1: { groups: [{ s: 1, br: true, t: [[3, 'x2'], [5, 'x'], [-2, '1']] }, { s: 1, br: true, t: [[1, 'x2'], [-4, 'x'], [6, '1']] }], fams: ['x2', 'x', '1'] },
  bask: { groups: [{ s: 1, br: true, t: [[3, 'fa'], [2, 'fo'], [3, 'fb']] }, { s: 1, br: true, t: [[1, 'fa'], [4, 'fb']] }], fams: ['fa', 'fo', 'fb'] },
  e4a: { groups: [{ s: 1, br: true, t: [[2, 'x2'], [3, 'x'], [-5, '1']] }, { s: 1, br: true, t: [[4, 'x2'], [-1, 'x'], [7, '1']] }], fams: ['x2', 'x', '1'] },
  e4b: { groups: [{ s: 1, br: true, t: [[5, 'a'], [-3, 'b'], [2, '1']] }, { s: 1, br: true, t: [[-2, 'a'], [6, 'b'], [-9, '1']] }], fams: ['a', 'b', '1'] }
};
const ftT = (c, f, first, col) => { const a = Math.abs(c); let b = f === '1' ? String(a) : (a === 1 ? '' : a) + FT[f]; if (col) b = tc(col, b); return (c < 0 ? '-' : first ? '' : '+') + b; };
const ltQ = (d) => (d.list ? d.groups[0].t.map(([c, f]) => ftT(c, f, true)).join(',\\ \\ ')
  : d.groups.map((g, gi) => (gi ? (g.s < 0 ? '-' : '+') : '') + (g.br ? '(' : '') + g.t.map(([c, f], i) => ftT(c, f, i === 0 && (gi === 0 || g.br))).join('') + (g.br ? ')' : '')).join(''));
const ltSum = (d) => { const S = {}; d.groups.forEach((g) => g.t.forEach(([c, f]) => (S[f] = (S[f] || 0) + g.s * c))); return S; };
const ltRes = (d) => { const S = ltSum(d), out = []; d.fams.forEach((f) => { if (S[f]) out.push(ftT(S[f], f, !out.length)); }); return out.length ? out.join('') : '0'; };
const famName = (f) => (FHEAD[f] ? FHEAD[f].trim() : T(FT[f]));
function familiesMake(stage, key, ex, sortOnly) {
  const W = ex.W, d = LT[key], S = ltSum(d), colOf = (f) => FIX[f];
  const row = add(stage, h('div', 'u3l1-ltrow c'), W / 2, 46);
  const terms = [], ops = [];
  const span = (html, cls) => { const e = h('span', cls, html); row.appendChild(e); return e; };
  d.groups.forEach((g, gi) => {
    if (gi) ops.push(span(K(g.s < 0 ? '{}-{}' : '{}+{}'), 'u3l1-ltop'));
    if (g.br) ops.push(span(K('('), 'u3l1-ltop'));
    g.t.forEach(([c, f], i) => {
      if (d.list && i) span(K(','), 'u3l1-ltop u3l1-comma');
      const first = d.list || (i === 0 && (gi === 0 || g.br));
      terms.push({ el: span(K((first ? '' : '{}') + ftT(c, f, first)), 'u3l1-ltt'), c, f, g, first, gi });
    });
    if (g.br) ops.push(span(K(')'), 'u3l1-ltop'));
  });
  if (row.offsetWidth > W - 16) row.style.fontSize = Math.floor(32 * (W - 16) / row.offsetWidth) + 'px';
  const NF = d.fams.length, gap = 16, bw = Math.min(250, (W - 40 - gap * (NF - 1)) / NF), bx = (W - (bw * NF + gap * (NF - 1))) / 2;
  const bins = d.fams.map((f, i) => {
    const terms_ = terms.filter((t) => t.f === f);
    const b = add(stage, h('div', 'u3l1-bin' + (sortOnly ? ' sort' : '')), bx + i * (bw + gap), 112); b.style.width = bw + 'px'; b.style.setProperty('--fc', colOf(f));
    b.innerHTML = `<div class="u3l1-bin-h">${FHEAD[f] ? FHEAD[f] : K(FT[f]) + '-terms'}</div><div class="u3l1-bin-l"></div><div class="u3l1-bin-s"></div>`;
    hide(b); return { f, b, terms: terms_, l: b.querySelector('.u3l1-bin-l'), s: b.querySelector('.u3l1-bin-s') };
  });
  const res = sortOnly ? null : add(stage, h('div', 'u3l1-res c', K('=' + ltRes(d))), W / 2, 394); hide(res);
  const steps = [];
  const brs = d.groups.some((g) => g.br), minus = d.groups.some((g) => g.s < 0);
  if (brs) steps.push({
    cap: minus ? `Remove the brackets. A <b>minus</b> in front of a bracket <b>changes the sign of every term inside</b>.`
      : `Adding: <b>drop the brackets</b>. A ${T('+')} in front of a bracket changes no signs, so every term comes out exactly as it is.`,
    run: async (c) => {
      const before = terms.map((t) => stagePos(stage, t.el).l);
      ops.forEach((o) => (o.style.display = 'none'));
      terms.forEach((t) => {
        if (t.g.s < 0) { t.c = -t.c; t.el.classList.add('flip'); }
        const first = t.gi === 0 && t.first;
        t.el.innerHTML = K((first ? '' : '{}') + ftT(t.c, t.f, first)); t.first = first;
      });
      const after = terms.map((t) => stagePos(stage, t.el).l);
      await Promise.all(terms.map((t, i) => c.anim(t.el, [{ transform: `translateX(${before[i] - after[i]}px)` }, { transform: 'none' }], 520)));
    }
  });
  const nf = d.fams.length;
  steps.push({
    cap: `Colour each term by its <b>family</b>: ${d.fams.map(famName).join(', ')}. Like terms have <b>the same variable with the same exponent</b>${key === 'e2' || key === 's1' ? `, so ${T('x')} and ${T('x^2')} are <b>different</b> families` : ''}.`,
    run: async (c) => {
      terms.forEach((t) => { t.el.classList.add('fam'); t.el.style.setProperty('--fc', colOf(t.f)); });
      await Promise.all([...terms.map((t, i) => c.anim(t.el, [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], 320, { delay: i * 60 })), ...bins.map((b, i) => c.fadeIn(b.b, 350, { delay: 200 + i * 90 }))]);
    }
  });
  bins.forEach((b) => {
    const sum = S[b.f] || 0, list = b.terms.map((t, i) => ftT(t.g.s * t.c, t.f, i === 0)).join(''); // signs after the brackets come off
    const one = b.terms.length === 1, nm = b.f === '1' ? '<b>Numbers:</b>' : FHEAD[b.f] ? `<b>${FHEAD[b.f][0].toUpperCase() + FHEAD[b.f].slice(1)} (${T(FT[b.f])}):</b>` : `<b>${T(FT[b.f])}-terms:</b>`;
    const coefs = b.terms.map((t, i) => { const v = t.g.s * t.c; return (v < 0 ? '-' : i ? '+' : '') + Math.abs(v); }).join('');
    let cap;
    if (sortOnly) cap = `${nm} ${b.terms.map((t) => T(ftT(t.c, t.f, true))).join(', ')}${b.f === 'x' && b.terms.some((t) => Math.abs(t.c) === 1) ? `. A bare ${T('x')} is ${T('1x')}, and ${T('-x')} is ${T('-1x')}` : ''}${b.f === 'x2' ? `. Not like the ${T('x')}-terms: the exponent is 2, not 1` : b.f === '1' ? '. No variable at all' : ''}.`;
    else cap = one ? `${nm} only one term, ${T(list)}, so it stays as it is.`
      : sum ? `${nm} add the coefficients, ${T(`${coefs}=${sum}`)}. Keep the variable part: ${T(`${list}=${ftT(sum, b.f, true)}`)}.`
        : `${nm} ${T(`${list}=0`)}. They <b>cancel</b>, so there’s no ${b.f === '1' ? 'constant' : T(FT[b.f])} term in the answer.`;
    if (b.f === '1' && !sortOnly && !one && sum) cap = `${nm} ${T(`${list}=${sum}`)}.`;
    steps.push({
      cap,
      run: async (c) => {
        bins.forEach((x) => x.b.classList.toggle('on', x === b));
        b.l.innerHTML = K(b.terms.map((t, i) => (sortOnly ? (i ? ',\\ ' : '') + ftT(t.c, t.f, true, colOf(t.f)) : ftT(t.c, t.f, i === 0, colOf(t.f)))).join(''));
        const lw = b.l.firstElementChild ? b.l.firstElementChild.offsetWidth : 0; if (lw > bw - 14) b.l.style.fontSize = Math.floor(25 * (bw - 14) / lw) + 'px';
        hide(b.l, b.s);
        await Promise.all(b.terms.map((t, i) => fly(c, stage, t.el, b.l, K(ftT(t.c, t.f, false, colOf(t.f))), { fs: 30, delay: i * 140 })));
        b.terms.forEach((t) => t.el.classList.add('used'));
        await c.fadeIn(b.l, 250);
        if (sortOnly) return;
        b.s.innerHTML = K('=' + (sum ? ftT(sum, b.f, true) : '0')); if (!sum) b.b.classList.add('zero');
        await c.pop(b.s, 400);
      }
    });
  });
  if (sortOnly) steps.push({
    cap: `${Word(nf)} families of like terms. ${key === 'e2' ? 'Every term has a home, and no family mixes different exponents or letters.' : `Only terms in the same family can be combined. Next: how to <b>collect</b> them.`}`,
    run: (c) => { bins.forEach((x) => x.b.classList.remove('on')); return Promise.all(bins.map((b, i) => c.anim(b.b, [{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], 380, { delay: i * 100 }))); }
  });
  else steps.push({
    cap: `Put the families back together${d.fams.some((f) => !S[f]) ? ' (a family that cancelled to 0 disappears)' : ''}: ${T(ltRes(d))}.${key === 'fruit' ? ' Three apples, two oranges and three bananas: <b>you can’t add apples and oranges</b>, so it stays like that.' : key === 'e3c' ? ` ${T('a')} and ${T('b')} stay separate.` : ''}`,
    run: async (c) => { bins.forEach((x) => x.b.classList.remove('on')); await Promise.all([...bins.filter((b) => S[b.f]).map((b, i) => fly(c, stage, b.s, res, b.s.innerHTML, { fs: 30, delay: i * 120 })), c.pop(res, 450, { delay: 450 })]); }
  });
  return steps;
}
const sortLike = {
  title: 'Sort the terms into families of like terms',
  height: 300,
  minW: 780,
  value: 's1',
  choices: [{ v: 's1', label: 'Eight terms' }, { sep: 'Example 2 check:' }, { v: 'e2', label: 'the nine terms' }],
  intro: (k) => `Sort into like terms: ${T(ltQ(LT[k]))}.`,
  make(stage, key, ex) { return familiesMake(stage, key, ex, true); }
};
const collect = {
  title: 'Collect like terms: one family at a time',
  height: 446,
  minW: 780,
  value: 'c1',
  choices: [{ v: 'fruit', label: 'Warm-up fruit' }, { v: 'c1', label: tex(ltQ(LT.c1)) }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }, { v: 'e3c', label: '(c)' }, { v: 'e3d', label: '(d)' }],
  intro: (k) => `Simplify ${T(ltQ(LT[k]))}.`,
  make(stage, key, ex) { return familiesMake(stage, key, ex, false); }
};
const addH = {
  title: 'Adding: drop the brackets, then collect',
  height: 446,
  minW: 780,
  value: 'h1',
  choices: [{ v: 'h1', label: tex(ltQ(LT.h1)) }, { v: 'bask', label: 'Warm-up baskets' }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }],
  intro: (k) => `Add ${T(ltQ(LT[k]))}.`,
  make(stage, key, ex) { return familiesMake(stage, key, ex, false); }
};

/* ============ 4–5. The vertical method: like terms in columns ============ */
const VT = {
  a1: { A: { x2: 3, x: 5, 1: -2 }, B: { x2: 1, x: -4, 1: 6 }, op: 1 },
  a2: { A: { x2: 2, x: -1, 1: 4 }, B: { x2: 1, x: 3, 1: -9 }, op: 1 },
  e4c: { A: { x2: 4, x: -2, 1: 6 }, B: { x2: 3, x: 5, 1: -1 }, op: 1 },
  s1: { A: { x2: 5, x: 3, 1: -4 }, B: { x2: 2, x: -6, 1: 7 }, op: -1 },
  s2: { A: { x2: 4, x: 1, 1: -3 }, B: { x2: 1, x: -2, 1: -5 }, op: -1 },
  e5c: { A: { x2: 7, x: -3, 1: 5 }, B: { x2: 3, x: 2, 1: -8 }, op: -1 }
};
function verticalMake(stage, key, ex) {
  const W = ex.W, d = VT[key], sub = d.op < 0, Bf = sub ? negP(d.B) : d.B, R = sumP(d.A, Bf);
  const cw = 150, opw = 60, gx = Math.max(10, Math.round((W - (opw + 3 * cw + 270)) / 2)), cx = (i) => gx + opw + cw * (i + 0.5);
  const y1 = 92, y2 = 162, yL = 200, y3 = 244;
  const strips = KINDS.map((k, i) => { const e = add(stage, h('div', 'u3l1-vstrip'), cx(i) - cw / 2 + 6, 40); e.style.width = (cw - 12) + 'px'; e.style.height = '252px'; e.style.setProperty('--fc', KCOL[k]); e.innerHTML = `<div class="u3l1-vsh">${k === '1' ? 'numbers' : K(KT[k]) + '-terms'}</div>`; hide(e); return e; });
  const cell = (s, i, y, cls = '') => add(stage, h('div', 'u3l1-vcell c ' + cls, K(s)), cx(i), y);
  const rowA = KINDS.map((k, i) => cell(termT(d.A[k], k, i === 0), i, y1));
  const rowB = KINDS.map((k, i) => cell(termT(d.B[k], k, i === 0), i, y2));
  const op = add(stage, h('div', 'u3l1-vcell c u3l1-vop', K(sub ? '-' : '+')), gx + opw / 2 - 6, y2);
  const brL = add(stage, h('div', 'u3l1-vcell c u3l1-vbr', K('(')), cx(0) - 50, y2), brR = add(stage, h('div', 'u3l1-vcell c u3l1-vbr', K(')')), cx(2) + 50, y2);
  const line = add(stage, h('div', 'u3l1-vline'), gx, yL); line.style.width = (opw + 3 * cw) + 'px';
  const rowR = KINDS.map((k, i) => { const e = cell(R[k] ? termT(R[k], k, i === 0 || !KINDS.slice(0, i).some((kk) => R[kk])) : '0', i, y3, 'u3l1-vres'); hide(e); return e; });
  const notes = KINDS.map((k, i) => { const a = d.A[k], b = Bf[k], e = add(stage, h('div', 'u3l1-vnote c', K(`${a}${b < 0 ? '-' : '+'}${Math.abs(b)}=${a + b}`)), cx(i), 312); hide(e); return e; });
  const ansT = polyT(R), side = add(stage, h('div', 'u3l1-vans', `<small>answer</small>${K(ansT)}`), cx(2) + cw / 2 + 34, y3 - 30); hide(side);
  const steps = [{
    cap: `Write the second polynomial under the first so <b>like terms sit in the same column</b>: ${T('x^2')} under ${T('x^2')}, ${T('x')} under ${T('x')}, numbers under numbers.`,
    run: (c) => Promise.all(strips.map((e, i) => c.fadeIn(e, 350, { delay: i * 120, from: 'none' })))
  }];
  if (sub) steps.push({
    cap: `Subtracting means <b>adding the opposite</b>: change the sign of <b>every</b> term in the bottom row, and the ${T('-')} becomes ${T('+')}. ${T(`-(${polyT(d.B)})`)} becomes ${T(polyT(Bf))}.`,
    run: async (c) => {
      await Promise.all([c.anim(brL, [{ opacity: 1 }, { opacity: 0 }], 300), c.anim(brR, [{ opacity: 1 }, { opacity: 0 }], 300)]);
      op.innerHTML = K('+'); op.classList.add('flip');
      rowB.forEach((e, i) => { e.innerHTML = K(termT(Bf[KINDS[i]], KINDS[i], i === 0)); e.classList.add('flip'); });
      await Promise.all([op, ...rowB].map((e, i) => c.anim(e, [{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0)' }], 360, { delay: i * 90 })));
    }
  });
  KINDS.forEach((k, i) => {
    const a = d.A[k], b = Bf[k], r = a + b;
    steps.push({
      cap: `${k === '1' ? '<b>Numbers:</b>' : `<b>${T(KT[k])} column:</b>`} ${T(`${termT(a, k, true)}${termT(b, k, false)}=${r ? termT(r, k, true) : '0'}`)}${k !== '1' ? ` (add the coefficients, ${T(`${a}${b < 0 ? '-' : '+'}${Math.abs(b)}=${r}`)}; keep the ${T(KT[k])})` : ''}.`,
      run: async (c) => { strips.forEach((s, j) => s.classList.toggle('on', j === i)); await c.fadeIn(notes[i], 280); await c.pop(rowR[i], 380); }
    });
  });
  steps.push({
    cap: `Read the answer along the bottom: ${T(`${qT(d)}=${ansT}`)}.`,
    run: async (c) => { strips.forEach((s) => s.classList.remove('on')); await Promise.all([...rowR.map((e) => pulse(c, e, 1.1)), c.fadeIn(side, 400, { from: 'translateX(-10px)' })]); }
  });
  return steps;
}
const vertAdd = {
  title: 'The vertical method: add down each column',
  height: 350,
  minW: 800,
  choices: [{ v: 'a1', label: tex(qT(VT.a1)) }, { v: 'a2', label: tex(qT(VT.a2)) }, { sep: 'Example 4 check:' }, { v: 'e4c', label: '(c)' }],
  intro: (k) => `Add ${T(qT(VT[k]))} in columns.`,
  make: verticalMake
};
const vertSub = {
  title: 'Subtracting vertically: flip the bottom row, then add',
  height: 350,
  minW: 800,
  choices: [{ v: 's1', label: tex(qT(VT.s1)) }, { v: 's2', label: tex(qT(VT.s2)) }, { sep: 'Example 5 check:' }, { v: 'e5c', label: '(c)' }],
  intro: (k) => `Subtract ${T(qT(VT[k]))} in columns.`,
  make: verticalMake
};

/* ============ 5. The minus reaches every term (and the flip-one-sign mistake) ============ */
const FL = {
  n: { A: '5x^2+3x-4', B: '2x^2-6x+7', v: 'x' },
  e5a: { A: '6x^2+4x-3', B: '2x^2+7x-5', v: 'x' },
  e5b: { A: '4y^2-5y+2', B: '-3y^2+2y-6', v: 'y' }
};
const FCOLS = ['#13807a', '#c27a0e', '#7b4fc4'];
const flipAll = {
  title: 'The minus sign reaches every term',
  height: 430,
  minW: 900,
  value: 'n',
  choices: [{ v: 'n', label: tex(`(${FL.n.A})-(${FL.n.B})`) }, { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }, { v: 'e5b', label: '(b)' }],
  intro: (k) => `Subtract ${T(`(${FL[k].A})-(${FL[k].B})`)}.`,
  make(stage, key, ex) {
    const W = ex.W, d = FL[key], A = parsePoly(d.A), B = parsePoly(d.B), Bf = negG(B), v = d.v;
    const res = collectG([...A, ...Bf]);
    const wrongB = B.map((t, i) => (i === 0 ? { c: -t.c, v: t.v } : t)), wrong = collectG([...A, ...wrongB]);
    const svg = arcLayer(stage);
    const q = `(${gPolyT(A)})\\mathbin{\\htmlClass{u3l1-fm}{-}}(` + B.map((t, k) => (k ? `\\mathbin{\\htmlClass{u3l1-fs${k}}{${t.c < 0 ? '-' : '+'}}}` : '') + `\\htmlClass{u3l1-fb${k}}{${k ? bodyT(t) : gTermT(t, true)}}`).join('') + ')';
    const row0 = add(stage, h('div', 'u3l1-fl0', K(q)), 36, 92);
    const r1 = `\\htmlClass{u3l1-r1a}{=${gPolyT(A)}}` + Bf.map((t, k) => `\\htmlClass{u3l1-r1b${k}}{${gTermT(t, false)}}`).join('');
    const row1 = add(stage, h('div', 'u3l1-fl1', K(r1)), 36, 176);
    const r1a = row1.querySelector('.u3l1-r1a'), r1b = B.map((t, k) => row1.querySelector('.u3l1-r1b' + k));
    hide(r1a, ...r1b);
    const row2 = add(stage, h('div', 'u3l1-fl1 u3l1-ok', K('=' + gPolyT(res))), 36, 240); hide(row2);
    // the mistake, on the right
    const wx = Math.max(560, W - 380);
    const wbox = add(stage, h('div', 'u3l1-wrong'), wx, 150); wbox.style.width = (W - wx - 20) + 'px';
    wbox.innerHTML = `<div class="u3l1-wh">Flipping only the first sign ✗</div><div class="u3l1-wl">${K(gPolyT(A) + gPolyT(wrongB).replace(/^(?=[^-])/, '+'))}</div><div class="u3l1-wl">${K('=' + gPolyT(wrong))}</div>`;
    hide(wbox);
    // the check at v = 1
    const aV = at1(A), bV = at1(B), rV = at1(res), wV = at1(wrong);
    const ck = (x, wdt, head, lines, cls) => { const e = add(stage, h('div', 'u3l1-ck ' + cls, `<div class="u3l1-ckh">${head}</div>${lines.map((l) => `<div>${K(l)}</div>`).join('')}`), x, 312); e.style.width = wdt + 'px'; hide(e); return e; };
    const cw3 = (W - 72) / 3;
    const c0 = ck(24, cw3, 'The question', [`(${sumWords(A)})-(${sumWords(B)})`, `=${aV}-${bV < 0 ? `(${bV})` : bV}=${aV - bV}`], '');
    const c1 = ck(36 + cw3, cw3, 'Our answer ✓', [sumWords(res), `=${rV}`], 'good');
    const c2 = ck(48 + 2 * cw3, cw3, 'Flip-one-sign answer ✗', [sumWords(wrong), `=${wV}`], 'bad');
    const minusEl = row0.querySelector('.u3l1-fm');
    const flipped = Bf.map((t) => T(gTermT(t, true))).join(', ');
    const steps = [{
      cap: `The ${T('-')} in front of the bracket belongs to the <b>whole</b> bracket: it subtracts <b>every</b> term inside, not just the first one.`,
      run: async (c) => {
        minusEl.classList.add('u3l1-hot');
        const a = stagePos(stage, minusEl);
        for (let k = 0; k < B.length; k++) {
          const b = stagePos(stage, row0.querySelector('.u3l1-fb' + k));
          const ar = arrow(svg, a.x, a.t - 2, b.x, b.t - 2, 30 + 16 * k, FCOLS[k]); await ar.draw(c, 380);
        }
      }
    }, {
      cap: `Step 1: <b>change the sign of each term</b> in the second bracket (add the opposite): ${T(`-(${gPolyT(B)})`)} becomes ${flipped}.`,
      run: async (c) => {
        await c.fadeIn(r1a, 300);
        for (let k = 0; k < B.length; k++) { r1b[k].style.color = RED; await c.pop(r1b[k], 340); }
      }
    }, {
      cap: `Step 2: <b>collect like terms</b>: ${T(gPolyT(res))}.`,
      run: (c) => c.fadeIn(row2, 400)
    }, {
      cap: `<b>Watch out:</b> the most common mistake is flipping only the <b>first</b> sign. That gives ${T(gPolyT(wrong))}, which is <b>wrong</b>.`,
      run: (c) => c.fadeIn(wbox, 400, { from: 'translateX(12px)' })
    }, {
      cap: `Which one is right? Try ${T(v + '=1')}: every ${T(v)} and ${T(v + '^2')} becomes 1, so each term is just its coefficient. The question gives <b>${aV - bV}</b>, our answer gives <b>${rV}</b> ✓, the mistake gives <b>${wV}</b> ✗.`,
      run: async (c) => { await c.fadeIn(c0, 350); await c.fadeIn(c1, 350); await c.fadeIn(c2, 350); }
    }];
    return steps;
  }
};

/* ======================================================================
 * Static figures: the tile legend
 * ====================================================================== */
function renderLegend() {
  const leg = document.getElementById('u3l1-legend'); if (!leg) return;
  const items = [['x2', 'x^2', 'x', 'x'], ['x', 'x', 'x', '1'], ['1', '1', '1', '1']];
  leg.innerHTML = items.map(([k, v, hgt, wid]) => {
    const pos = tile(k, 1, 1, true).outerHTML, neg = tile(k, -1, 1, true).outerHTML;
    return `<div class="u3l1-lg"><div class="u3l1-lg-h">${K(tc(KCOL[k], k === '1' ? '1' : KT[k]))}${k === '1' ? '-tile (unit tile)' : '-tile'}</div>
      <div class="u3l1-lg-row"><div class="u3l1-lg-t"><div class="u3l1-dim"><span class="dw">${K(wid)}</span><span class="dh">${K(hgt)}</span>${pos}</div><div class="u3l1-lg-v">${K('=' + v)}</div><small>shaded</small></div>
      <div class="u3l1-lg-t"><div class="u3l1-dim">${neg}</div><div class="u3l1-lg-v">${K('=-' + v)}</div><small>unshaded</small></div></div>
      <div class="u3l1-lg-why">${k === 'x2' ? `${K('x')} by ${K('x')}: area ${K('x^2')}` : k === 'x' ? `${K('x')} by ${K('1')}: area ${K('x')}` : `${K('1')} by ${K('1')}: area ${K('1')}`}</div></div>`;
  }).join('');
}

/* ======================================================================
 * The tile mat (try it): add tiles, tap one to remove it, cancel zero pairs, flip
 * ====================================================================== */
function mountMat() {
  const box = document.getElementById('u3l1-mat'); if (!box) return;
  const btns = [['x2', 1], ['x', 1], ['1', 1], ['x2', -1], ['x', -1], ['1', -1]];
  box.innerHTML = `<div class="u3l1m-ctl no-ink">
      <div class="u3l1m-add">${btns.map(([k, s]) => `<button class="u3l1m-b ${s > 0 ? 'pos' : 'neg'}" type="button" data-k="${k}" data-s="${s}" title="Add ${s > 0 ? 'a shaded' : 'an unshaded'} ${k === '1' ? 'unit' : k === 'x2' ? 'x²' : 'x'}-tile"><span class="u3l1m-ic">${tile(k, s, 0.34, false).outerHTML}</span>${K((s > 0 ? '+' : '-') + KT[k])}</button>`).join('')}</div>
      <div class="u3l1m-acts"><button class="pill small" type="button" data-a="pairs">Cancel zero pairs</button><button class="pill small" type="button" data-a="flip">Flip all</button><button class="pill small" type="button" data-a="sample">Example 4(a)</button><button class="exb" type="button" data-a="clear" title="Clear the mat" aria-label="Clear the mat"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg></button></div>
    </div>
    <div class="u3l1m-mat"></div>
    <div class="u3l1m-read" aria-live="polite"></div>`;
  const mat = box.querySelector('.u3l1m-mat'), read = box.querySelector('.u3l1m-read');
  const MAX = 9;
  let tiles = [];
  let busy = false;
  const W = () => mat.clientWidth || 900;
  let frames = {};
  function layout(animate = true) {
    const counts = {}; KINDS.forEach((k) => (counts[k] = { p: tiles.filter((t) => t.k === k && t.s > 0).length, n: tiles.filter((t) => t.k === k && t.s < 0).length }));
    const L = matLayout(counts, W(), { my: 168, kinds: KINDS, minCols: 3, margin: 24 });
    if (!frames.x2 || frames._s !== L.s || frames._w !== JSON.stringify(KINDS.map((k) => L.zones[k].w))) {
      Object.values(frames).forEach((f) => f && f.remove && f.remove());
      frames = {}; KINDS.forEach((k) => { frames[k] = zoneFrame(mat, L, k); mat.prepend(frames[k]); });
      frames._s = L.s; frames._w = JSON.stringify(KINDS.map((k) => L.zones[k].w));
    }
    KINDS.forEach((k) => {
      [1, -1].forEach((sg) => tiles.filter((t) => t.k === k && t.s === sg).forEach((t, i) => {
        const p = L.pos(k, sg, i), [w, ht] = tdim(k, L.s);
        t.el.style.transition = animate ? 'left .35s, top .35s, width .35s, height .35s' : 'none';
        t.el.style.width = w + 'px'; t.el.style.height = ht + 'px'; t.el.style.fontSize = (k === 'x2' ? 25 : k === 'x' ? 18 : 12) * Math.max(L.s, 0.75) + 'px';
        at(t.el, p.x, p.y);
      }));
    });
    const P = {}; KINDS.forEach((k) => (P[k] = counts[k].p - counts[k].n));
    const pairs = KINDS.reduce((s, k) => s + Math.min(counts[k].p, counts[k].n), 0);
    read.innerHTML = tiles.length ? `On the mat: ${K(polyT(P, true))}${pairs ? ` <span class="u3l1m-pairs">${plural(pairs, 'zero pair')} still on the mat (worth 0)</span>` : ''}` : '<span class="muted">The mat is empty. Add tiles with the buttons; tap a tile to take it away.</span>';
    box.querySelector('[data-a=pairs]').disabled = !pairs;
    return L;
  }
  function addTile(k, s, animate = true) {
    if (tiles.filter((t) => t.k === k && t.s === s).length >= MAX) return;
    const el = tile(k, s, 1, true, 'button'); el.type = 'button'; el.title = 'Tap to remove';
    const t = { el, k, s }; tiles.push(t); mat.appendChild(el);
    el.addEventListener('click', () => { if (busy) return; tiles = tiles.filter((x) => x !== t); el.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.3)' }], 220).onfinish = () => el.remove(); layout(); });
    layout(animate);
    if (animate) el.animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], 260);
  }
  box.querySelectorAll('.u3l1m-b').forEach((b) => b.addEventListener('click', () => { if (!busy) addTile(b.dataset.k, Number(b.dataset.s)); }));
  box.querySelector('[data-a=clear]').addEventListener('click', () => { if (busy) return; tiles.forEach((t) => t.el.remove()); tiles = []; layout(); });
  box.querySelector('[data-a=sample]').addEventListener('click', () => {
    if (busy) return; tiles.forEach((t) => t.el.remove()); tiles = [];
    [['x2', 1, 2], ['x', 1, 3], ['1', -1, 5], ['x2', 1, 4], ['x', -1, 1], ['1', 1, 7]].forEach(([k, s, n]) => { for (let i = 0; i < n; i++) addTile(k, s, false); });
    layout(false);
  });
  box.querySelector('[data-a=flip]').addEventListener('click', () => {
    if (busy || !tiles.length) return; busy = true;
    tiles.forEach((t, i) => {
      const a = t.el.animate([{ transform: 'perspective(400px) rotateY(0)' }, { transform: 'perspective(400px) rotateY(90deg)' }], { duration: 200, delay: i * 25, fill: 'forwards' });
      a.onfinish = () => { t.s = -t.s; t.el.classList.toggle('pos', t.s > 0); t.el.classList.toggle('neg', t.s < 0); t.el.animate([{ transform: 'perspective(400px) rotateY(-90deg)' }, { transform: 'perspective(400px) rotateY(0)' }], 200); a.cancel(); };
    });
    setTimeout(() => { layout(); busy = false; }, 260 + tiles.length * 25);
  });
  box.querySelector('[data-a=pairs]').addEventListener('click', async () => {
    if (busy) return; busy = true;
    const L = layout(false);
    const jobs = [];
    KINDS.forEach((k) => {
      const P = tiles.filter((t) => t.k === k && t.s > 0), N = tiles.filter((t) => t.k === k && t.s < 0), m = Math.min(P.length, N.length), th = tdim(k, L.s)[1];
      for (let i = 0; i < m; i++) {
        const a = P[i], b = N[i];
        jobs.push(new Promise((r) => setTimeout(r, i * 140)).then(() => {
          const cy = L.my - th / 2;
          [a, b].forEach((t) => { t.el.style.transition = 'top .35s'; t.el.style.top = cy + 'px'; });
          return new Promise((r) => setTimeout(r, 380)).then(() => Promise.all([a, b].map((t) => t.el.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.25)' }], 320).finished))).then(() => { [a, b].forEach((t) => { t.el.remove(); }); tiles = tiles.filter((t) => t !== a && t !== b); });
        }));
      }
    });
    await Promise.all(jobs); busy = false; layout();
  });
  new ResizeObserver(() => layout(false)).observe(mat);
  layout(false);
}

/* ======================================================================
 * Warm-up: The Fruit Puzzle (fruit drawn after the booklet's TikZ icons)
 * ====================================================================== */
const APPLE = '<path d="M0 -.42C.3 -.72 .8 -.55 .72 0C.66 .5 .3 .78 0 .62C-.3 .78 -.66 .5 -.72 0C-.8 -.55 -.3 -.72 0 -.42Z" fill="#d62828" stroke="#801818" stroke-width=".05"/><ellipse cx="-.38" cy="-.12" rx=".1" ry=".2" fill="#fff" opacity=".45"/><path d="M0 -.42L.07 -.78" stroke="#6e4623" stroke-width=".08" stroke-linecap="round"/><path d="M.07 -.68C.25 -.95 .55 -.9 .62 -.8C.45 -.6 .2 -.58 .07 -.68Z" fill="#3c963c" stroke="#245a24" stroke-width=".035"/>';
const ORANGE = '<circle cx="0" cy=".05" r=".7" fill="#fa961e" stroke="#a3610f" stroke-width=".05"/>' + [[0.3, 0.3], [-0.25, 0.4], [0.1, -0.15], [-0.4, -0.05], [0.4, -0.2], [0, 0.55], [-0.05, 0.15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".035" fill="#bb700f"/>`).join('') + '<ellipse cx="-.35" cy="-.25" rx=".12" ry=".18" fill="#fff" opacity=".4"/><circle cx="0" cy="-.64" r=".07" fill="#6e4623"/><path d="M0 -.66C-.15 -.95 -.45 -.92 -.55 -.82C-.4 -.62 -.15 -.6 0 -.66Z" fill="#3c963c" stroke="#245a24" stroke-width=".035"/>';
const banana = (r) => `<g transform="rotate(${-r}) scale(.92)"><path d="M0 0C.5 .3 .55 .9 .3 1.25C.3 .85 .2 .35 -.1 .08Z" fill="#fcd73c" stroke="#a87410" stroke-width=".045"/><circle cx=".3" cy="1.25" r=".05" fill="#6e4623"/></g>`;
const BUNCH = (rs, dx = 0) => `<g transform="translate(${-0.15 + dx} -.62)">${rs.map(banana).join('')}<rect x="-.12" y="-.18" width=".22" height=".26" rx=".03" fill="#6e4623"/></g>`;
const FRUIT = { a: APPLE, o: ORANGE, b4: BUNCH([-52, -27, -2, 23]), b3: BUNCH([-40, -15, 10], 0.16) };
const fruitSVG = (k) => `<svg viewBox="-.95 -1 1.9 2" class="u3l1-fr" aria-hidden="true">${FRUIT[k]}</svg>`;
function mountFruit() {
  const host = document.getElementById('u3l1-fruit'); if (!host) return;
  const rows = [[['a', 'a', 'a'], '30'], [['a', 'b4', 'b4'], '26'], [['b4', 'o', 'o'], '20']];
  const last = ['o', 'a', 'b3', 'a', 'o', 'a'];
  host.innerHTML = rows.map(([fs, v]) => `<div class="u3l1-frow">${fs.map((f, i) => (i ? '<span class="u3l1-fop">+</span>' : '') + `<span class="u3l1-fslot">${fruitSVG(f)}</span>`).join('')}<span class="u3l1-feq">= ${v}</span></div>`).join('')
    + `<div class="u3l1-frow u3l1-flast" id="u3l1-flast"></div>
    <div class="u3l1-fctl no-ink"><button class="pill small" type="button" data-f="sort">Slide like fruit together</button><button class="exb" type="button" data-f="reset" title="Start over" aria-label="Start over"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg></button><span class="u3l1-fread" aria-live="polite"></span></div>`;
  const row = host.querySelector('#u3l1-flast'), read = host.querySelector('.u3l1-fread');
  const SL = 64, OPW = 24, step = SL + OPW;
  const els = last.map((f) => { const e = h('span', 'u3l1-fslot u3l1-fmv', fruitSVG(f)); e._f = f; row.appendChild(e); return e; });
  const ops = last.slice(1).map((_, i) => { const e = h('span', 'u3l1-fop u3l1-fmv', '+'); at(e, SL + i * step, 0); row.appendChild(e); return e; });
  const eq = h('span', 'u3l1-feq u3l1-fmv', '='); at(eq, last.length * step - OPW + 6, 0); row.appendChild(eq);
  const qb = h('span', 'u3l1-fq u3l1-fmv', '?'); at(qb, last.length * step + 20, 0); row.appendChild(qb);
  const place = (order) => order.forEach((e, j) => at(e, j * step, 0));
  const ORDER = { a: 0, o: 1, b3: 2 };
  place(els);
  let sorted = false;
  const render = () => { host.classList.toggle('sorted', sorted); read.innerHTML = sorted ? `Same fruit side by side: ${K('a+a+a+o+o+3b=3a+2o+3b')}` : ''; };
  host.querySelector('[data-f=sort]').addEventListener('click', () => { sorted = true; place([...els].sort((p, q) => ORDER[p._f] - ORDER[q._f])); render(); });
  host.querySelector('[data-f=reset]').addEventListener('click', () => { sorted = false; place(els); render(); });
  render();
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { anatomy, nameMachine, sortLike, collect, addH, addTiles, vertAdd, flipAll, subTiles, vertSub };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}

renderLegend(); mountFruit(); mountMat(); mountExplainers();

/* ============ Stand Up Break! (lessons/js/standup.js) — a tiny polynomial kit for the whiteboard questions ============
 * A polynomial is { key: coefficient }, the key naming the variables and their exponents ('x2'; '' for a constant). */
(() => {
  const suKey = (e) => Object.keys(e).filter((v) => e[v]).sort().map((v) => v + e[v]).join('');
  const suExp = (k) => { const e = {}; k.replace(/([a-z])(\d+)/g, (_, v, n) => { e[v] = +n; }); return e; };
  const suM = (c, v, n = 1) => (c ? { [suKey(v ? { [v]: n } : {})]: c } : {});
  const suAdd = (...ps) => { const o = {}; ps.forEach((p) => { for (const k in p) { o[k] = (o[k] || 0) + p[k]; if (!o[k]) delete o[k]; } }); return o; };
  const suDeg = (k) => Object.values(suExp(k)).reduce((s, n) => s + n, 0);
  const suOrd = (a, b) => { const d = suDeg(b) - suDeg(a); if (d) return d; return a < b ? -1 : a > b ? 1 : 0; };
  const suMono = (k) => Object.entries(suExp(k)).map(([v, n]) => v + (n > 1 ? '^{' + n + '}' : '')).join('');
  const suTerm = (c, k, first) => { const m = suMono(k), a = Math.abs(c); return (c < 0 ? '-' : first ? '' : '+') + (a === 1 && m ? '' : a) + m; };
  const suTex = (p) => Object.keys(p).sort(suOrd).map((k, i) => suTerm(p[k], k, i === 0)).join('') || '0';
  const suOne = (p) => { const k = Object.keys(p)[0]; return [p[k], k]; };
  const suSeq = (list, cont) => list.filter((p) => Object.keys(p).length).map((p, i) => { const [c, k] = suOne(p); return suTerm(c, k, i === 0 && !cont); }).join('') || '0';
  const suNz = (r, lo, hi) => { let v = 0; while (!v) v = r.int(lo, hi); return v; };
  /* the terms, grouped family by family: (5x^2+2x^2)+(-3x+8x)-1 */
  const suGroup = (list) => {
    const keys = [...new Set(list.map((p) => suOne(p)[1]))].sort(suOrd);
    return keys.map((k, gi) => {
      const fam = list.filter((p) => suOne(p)[1] === k);
      if (fam.length === 1) { const [c] = suOne(fam[0]); return suTerm(c, k, gi === 0); }
      return (gi ? '+' : '') + '(' + suSeq(fam) + ')';
    }).join('');
  };
  /* a polynomial in v: terms with exponents from `exps`, nonzero coefficients */
  const poly = (r, v, exps, lo = -9, hi = 9) => exps.map((e) => suM(suNz(r, lo, hi), v, e));
  const pv = () => ['x', 'x', 'x', 'y', 'a', 'm', 'n'];
  standup('u3l1', {
    intro: 'Simplify at your whiteboard station. Sort the terms into families first: same letter, same exponent.',
    levels: {
      /* collect like terms in one variable (Example 3 (a), (b), (d)) */
      BEG: (r) => {
        const v = r.pick(pv());
        for (;;) {
          const pat = r.pick([[1, 0, 1, 0], [2, 1, 2, 1, 0], [1, 0, 1, 0, 0], [2, 1, 0, 2, 1, 0], [2, 1, 2, 1], [2, 2, 1, 0, 1]]);
          const list = r.shuffle(poly(r, v, pat));
          if (list.length > 3 && suOne(list[0])[1] === suOne(list[1])[1] && r.chance(0.7)) continue;
          const res = suAdd(...list);
          if (Object.keys(res).length < 2) continue;
          return { q: suSeq(list), a: ['=' + suGroup(list), '=' + suTex(res)] };
        }
      },
      /* add two polynomials, horizontal method (Example 4 (a), (b)); sometimes two letters */
      PRG: (r) => {
        for (;;) {
          let A, B;
          if (r.chance(0.3)) {
            const [u, w] = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']]);
            A = [suM(r.int(1, 9), u), suM(suNz(r, -9, 9), w), suM(suNz(r, -9, 9))];
            B = [suM(suNz(r, -9, 9), u), suM(suNz(r, -9, 9), w), suM(suNz(r, -9, 9))];
          } else {
            const v = r.pick(pv());
            A = poly(r, v, [2, 1, 0]); A[0] = suM(r.int(1, 9), v, 2);
            B = poly(r, v, r.pick([[2, 1, 0], [2, 1, 0], [1, 0], [2, 0]]));
          }
          const res = suAdd(...A, ...B);
          if (Object.keys(res).length < 2) continue;
          return { q: '(' + suSeq(A) + ')+(' + suSeq(B) + ')', a: ['=' + suSeq(A) + suSeq(B, true), '=' + suTex(res)] };
        }
      },
      /* three polynomials added, or a perimeter (adding the sides) */
      MAS: (r) => {
        const v = r.pick(['x', 'x', 'y', 'a', 'n']);
        for (;;) {
          if (r.chance(0.45)) {
            const n = r.pick([3, 3, 4]), sides = Array.from({ length: n }, () => [suM(r.int(1, 6), v), suM(suNz(r, -8, 9))]);
            const all = sides.flat(), res = suAdd(...all);
            const kx = suOne(suM(1, v))[1];
            if (!res[kx] || res[kx] < 1 || (res[''] || 0) === 0) continue;
            const shape = n === 3 ? 'triangle' : 'four-sided field';
            return {
              text: `A ${shape} has sides ${sides.slice(0, -1).map((s) => tex('(' + suSeq(s) + ')')).join(', ')} and ${tex('(' + suSeq(sides[n - 1]) + ')')} metres long. Write and simplify an expression for its <b>perimeter</b>.`,
              q: '',
              a: ['P=' + sides.map((s) => '(' + suSeq(s) + ')').join('+'), '=' + suTex(res) + '\\text{ m}']
            };
          }
          const A = poly(r, v, [2, 1, 0]), B = poly(r, v, r.pick([[1, 0], [2, 1]])), C = poly(r, v, r.pick([[2, 0], [2, 1, 0], [1, 0]]));
          A[0] = suM(r.int(1, 9), v, 2);
          const res = suAdd(...A, ...B, ...C);
          if (Object.keys(res).length < 2) continue;
          return { q: '(' + suSeq(A) + ')+(' + suSeq(B) + ')+(' + suSeq(C) + ')', a: ['=' + suSeq(A) + suSeq(B, true) + suSeq(C, true), '=' + suTex(res)] };
        }
      }
    }
  });
})();
