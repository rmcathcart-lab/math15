/* Math 15 · Unit 3 · Lesson 2 — Multiplying a Monomial by a Polynomial.
 * (The Math 10C twin is u3/l2; the area model, the distributing arrows, the polynomial helpers and the mini area models
 * in the answers are adapted from it.) Warm-up "Beat the Calculator" (split a rectangle into friendly pieces) and the explainers:
 *   monoMul   (Section 1: regroup, multiply the numbers, count the x's: the Product Law; Example 1)
 *   areaRect  (Section 2: a rectangle split into two pieces; the warm-up 7(x + 3); Example 2)
 *   distA     (Section 2: arrows from the monomial to each term; signs travel with their term)
 *   areaGrid  (Section 3: one cell per term, three terms in → three out; Example 3)
 *   distB     (Section 4: distribute, then collect like terms; Example 4)
 *   mistakes  (Section 4: spot the mistake: product law, a lost sign, a skipped term, the second bracket)
 *   distC     (Section 5: two brackets with a negative monomial, one at a time; Example 5)
 * Colours: the pieces of an area model take the Unit 3 term colours in order (teal, amber, purple); negative pieces are hatched. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const box = (el, w, hh) => { el.style.width = w + 'px'; el.style.height = hh + 'px'; return el; };
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s);
const TEAL = '#13807a', AMB = '#c27a0e', PUR = '#7b4fc4', BLU = '#2f6fd0', RED = '#c93a33', NAVY = '#2b55a0';
const PCOL = [TEAL, AMB, PUR, BLU];
const LIKE = ['#c2417a', '#2f6fd0', '#c27a0e', '#7b4fc4'];
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/* ============ polynomial helpers: a term is { c: coefficient, v: { x: 2 } } ============ */
function parseTerm(s) {
  const m = String(s).replace(/\s+/g, '').match(/^([+-]?)(\d*)((?:[a-z](?:\^\d+)?)*)$/);
  if (!m) throw new Error('bad term ' + s);
  const v = {};
  (m[3].match(/[a-z](?:\^\d+)?/g) || []).forEach((p) => { const k = p[0], e = p.length > 1 ? parseInt(p.slice(2), 10) : 1; v[k] = (v[k] || 0) + e; });
  return { c: (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : parseInt(m[2], 10)), v };
}
const parsePoly = (s) => String(s).replace(/\s+/g, '').match(/[+-]?[^+-]+/g).map(parseTerm);
const isConst = (t) => !Object.keys(t.v).length;
const mulT = (a, b) => { const v = { ...a.v }; for (const k in b.v) v[k] = (v[k] || 0) + b.v[k]; return { c: a.c * b.c, v }; };
const keyT = (t) => Object.keys(t.v).sort().map((k) => k + t.v[k]).join('');
const degT = (t) => Object.values(t.v).reduce((s, e) => s + e, 0);
function bodyT(t) { const a = Math.abs(t.c), vs = Object.keys(t.v).sort().map((k) => (t.v[k] === 1 ? k : `${k}^{${t.v[k]}}`)).join(''); return vs ? (a === 1 ? '' : a) + vs : String(a); }
const termT = (t, first) => (t.c < 0 ? '-' : first ? '' : '+') + bodyT(t);
const polyT = (list) => (list.length ? list.map((t, i) => termT(t, i === 0)).join('') : '0');
const ctT = (t, first, col) => (first ? tc(col, termT(t, true)) : (t.c < 0 ? '-' : '+') + tc(col, bodyT(t)));
const fT = (t) => (t.c < 0 ? `(${termT(t, true)})` : termT(t, true)); // a factor written for multiplying: (−3), 2x
function collect(list) {
  const m = new Map();
  list.forEach((t) => { const k = keyT(t); if (m.has(k)) m.get(k).c += t.c; else m.set(k, { c: t.c, v: { ...t.v } }); });
  return [...m.values()].map((t, i) => ({ t, i })).filter((o) => o.t.c !== 0).sort((a, b) => degT(b.t) - degT(a.t) || a.i - b.i).map((o) => o.t);
}
function likeGroups(list) { const m = new Map(); list.forEach((t, i) => { const k = keyT(t); if (!m.has(k)) m.set(k, []); m.get(k).push(i); }); return [...m.values()].filter((g) => g.length > 1); }
function expNote(a, b) { // "x^2·x^3 = x^{2+3} = x^5" when two factors share a letter
  const ks = Object.keys(a.v).filter((k) => b.v[k]);
  if (!ks.length) return '';
  return ' Exponents add: ' + ks.map((k) => T(`${k}^{${a.v[k]}}\\cdot ${k}^{${b.v[k]}}=${k}^{${a.v[k]}+${b.v[k]}}=${k}^{${a.v[k] + b.v[k]}}`)).join(', ') + '.';
}
function signNote(a, b) {
  if (a.c < 0 && b.c < 0) return ' Negative × negative is <b>positive</b>.';
  if (a.c < 0 || b.c < 0) return ' Negative × positive is <b>negative</b>.';
  return '';
}
const prodCap = (a, b) => T(`${fT(a)}\\cdot ${fT(b)}=${termT(mulT(a, b), true)}`);

/* ============ drawing helpers ============ */
function stagePos(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, l: (r.left - sr.left) / k, t: (r.top - sr.top) / k, r: (r.right - sr.left) / k, b: (r.bottom - sr.top) / k };
}
function arcLayer(stage) { const s = svgEl('svg', { class: 'u3l2-arcs' }); stage.appendChild(s); return s; }
function arrow(svg, x1, y1, x2, y2, lift, col) {
  const cx = (x1 + x2) / 2, cy = Math.min(y1, y2) - lift;
  const p = svgEl('path', { d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, fill: 'none', stroke: col, 'stroke-width': 3.4, 'stroke-linecap': 'round' });
  const ang = Math.atan2(y2 - cy, x2 - cx), L = 13, wd = 0.46;
  const hd = svgEl('polygon', { points: [[x2, y2], [x2 - L * Math.cos(ang - wd), y2 - L * Math.sin(ang - wd)], [x2 - L * Math.cos(ang + wd), y2 - L * Math.sin(ang + wd)]].map((q) => q.join(',')).join(' '), fill: col });
  svg.append(p, hd);
  const len = p.getTotalLength() || 1;
  p.style.strokeDasharray = len; p.style.strokeDashoffset = len; hd.style.opacity = 0;
  return {
    async draw(c, ms = 520) { await c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms); await c.anim(hd, [{ opacity: 0 }, { opacity: 1 }], 140); },
    dim(c) { return Promise.all([p, hd].map((e) => c.anim(e, [{ opacity: e.style.opacity || 1 }, { opacity: 0.22 }], 250))); }
  };
}
const pulse = (c, el, s = 1.12) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);
const showSpans = (c, els, ms = 320) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms)));
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }
function wline(stage, src, x, y, cls = '') { return add(stage, h('div', 'u3l2-wl ' + cls, K(src)), x, y); }
function lenOf(t) { // a (roughly) to-scale area model: letter terms long, number terms short
  const a = Math.abs(t.c);
  if (!isConst(t)) return Math.min(280, 200 + 30 * (a - 1));
  return Math.max(70, Math.min(150, 36 + 20 * a));
}

/* ============ 1. Monomial × monomial: regroup, multiply the numbers, count the x's ============ */
const MM = {
  d1: [[3, 4], [2, 1]], d2: [[-5, 1], [3, 2]],
  a: [[2, 3], [5, 2]], b: [[-3, 1], [4, 4]], c: [[6, 2], [1, 1]], d: [[-2, 3], [-5, 4]]
};
const mono = (c, e) => ({ c, v: { x: e } });
const mmQ = (k) => { const [a, b] = MM[k].map(([c, e]) => mono(c, e)); return `${termT(a, true)}\\times ${fT(b)}`; };
const monoMul = {
  title: 'Multiply the numbers, add the exponents',
  height: 372,
  minW: 820,
  value: 'd1',
  choices: [{ v: 'd1', label: tex(mmQ('d1')) }, { v: 'd2', label: tex(mmQ('d2')) }, { sep: 'Example 1 check:' }, ...'abcd'.split('').map((k) => ({ v: k, label: '(' + k + ')' }))],
  intro: (k) => `Multiply ${T(mmQ(k))}.`,
  make(stage, key, ex) {
    const W = ex.W, [A, B] = MM[key].map(([c, e]) => mono(c, e)), P = mulT(A, B), ea = A.v.x, eb = B.v.x;
    const cA = A.c, cB = B.c, cP = P.c;
    const cT = (c) => (c < 0 ? `(${c})` : String(c));
    const q = `\\htmlClass{u3l2-mc}{${A.c === -1 ? '-' : A.c === 1 ? '' : A.c}}\\htmlClass{u3l2-mv}{x${ea > 1 ? `^{${ea}}` : ''}}\\times ${B.c < 0 ? '(' : ''}\\htmlClass{u3l2-mc}{${B.c === -1 ? '-' : B.c === 1 ? '' : B.c}}\\htmlClass{u3l2-mv}{x${eb > 1 ? `^{${eb}}` : ''}}${B.c < 0 ? ')' : ''}`;
    const row0 = add(stage, h('div', 'u3l2-mm0 c', K(q)), W / 2, 44);
    const L1 = `=\\htmlClass{u3l2-mcol}{(${cT(cA)}\\times ${cT(cB)})}\\htmlClass{u3l2-mvol}{(x^{${ea}}\\cdot x^{${eb}})}`;
    const row1 = add(stage, h('div', 'u3l2-mm1', K(L1)), 70, 116);
    const pc = row1.querySelector('.u3l2-mcol'), pv = row1.querySelector('.u3l2-mvol'); hide(pc, pv);
    hide(row1);
    // the x's written out, in two groups
    const xs = [], xw = 46, gap = 30, tot = (ea + eb) * xw + gap, x0 = Math.max(60, (W - tot) / 2 - 120);
    for (let i = 0; i < ea + eb; i++) { const e = add(stage, h('div', 'u3l2-mx c' + (i < ea ? '' : ' b'), K('x')), x0 + i * xw + (i >= ea ? gap : 0) + xw / 2, 214); hide(e); xs.push(e); }
    const brA = add(stage, h('div', 'u3l2-mbr c', K(`x^{${ea}}`)), x0 + ea * xw / 2, 258); hide(brA);
    const brB = add(stage, h('div', 'u3l2-mbr c b', K(`x^{${eb}}`)), x0 + ea * xw + gap + eb * xw / 2, 258); hide(brB);
    const cnt = add(stage, h('div', 'u3l2-mcnt', `<b>${ea + eb}</b> factors of ${K('x')}`), x0 + tot + 24, 196); hide(cnt);
    const ncard = add(stage, h('div', 'u3l2-mcard amb', `<small>numbers multiply</small>${K(`${cT(cA)}\\times ${cT(cB)}=${cP}`)}`), W - 250, 92); hide(ncard);
    const vcard = add(stage, h('div', 'u3l2-mcard blu', `<small>exponents add</small>${K(`${ea}+${eb}=${ea + eb}`)}`), x0 + tot + 24, 238); hide(vcard);
    const res = add(stage, h('div', 'u3l2-mres c', K(`${mmQ(key)}=${termT(P, true)}`)), W / 2, 330); hide(res);
    const sgn = cA < 0 && cB < 0 ? ' Negative × negative is <b>positive</b>.' : cA < 0 || cB < 0 ? ' One negative: the answer is <b>negative</b>.' : '';
    return [{
      cap: `Multiplying works in any order, so <b>regroup</b>: the numbers together, the letters together.${(cA === 1 || cB === 1) ? ` (A bare ${T('x')} has coefficient ${T('1')}.)` : ''}`,
      run: async (c) => { await c.fadeIn(row1, 300); await Promise.all([c.fadeIn(pc, 350), c.fadeIn(pv, 350, { delay: 200 })]); }
    }, {
      cap: `<b>Numbers multiply:</b> ${T(`${cT(cA)}\\times ${cT(cB)}=${cP}`)}.${sgn}`,
      run: (c) => c.pop(ncard, 380)
    }, {
      cap: `<b>Letters:</b> ${T(`x^{${ea}}`)} is ${WORD[ea]} ${T('x')}’s multiplied${ea === 1 ? ` (${T('x')} means ${T('x^1')})` : ''}, and ${T(`x^{${eb}}`)} is ${WORD[eb]} more. Count them: ${T(`${ea}+${eb}=${ea + eb}`)}. Same base, so <b>add the exponents</b> (the Product Law).`,
      run: async (c) => {
        await Promise.all([...xs.map((e, i) => c.pop(e, 300, { delay: i * 70 })), c.fadeIn(brA, 300, { delay: 200 }), c.fadeIn(brB, 300, { delay: 300 })]);
        await Promise.all([c.fadeIn(cnt, 300), c.pop(vcard, 380, { delay: 150 })]);
      }
    }, {
      cap: `Put them together: ${T(`${mmQ(key)}=${termT(P, true)}`)}. Don’t add the numbers, and don’t multiply the exponents.`,
      run: async (c) => { await c.pop(res, 420); row0.classList.add('done'); }
    }];
  }
};

/* ============ 2. Area model: monomial × binomial (a rectangle split into two pieces) ============ */
const AMD = {
  w: { m: '7', p: 'x+3' }, w2: { m: '2x', p: 'x+4' },
  a: { m: '4', p: 'x+7' }, b: { m: '-3', p: 'x-5' }, c: { m: '2x', p: 'x+6' }, d: { m: '-5x', p: 'x-3' }
};
const areaRect = {
  title: 'Split the rectangle, add the pieces',
  height: 340,
  minW: 940,
  choices: [{ v: 'w', label: tex('7(x+3)') }, { v: 'w2', label: tex('2x(x+4)') }, { sep: 'Example 2 check:' }, ...'abcd'.split('').map((k) => ({ v: k, label: '(' + k + ')' }))],
  intro: (k) => `Expand ${T(`${AMD[k].m}(${AMD[k].p})`)} with an <b>area model</b>.`,
  make(stage, key, ex) {
    const W = ex.W, d = AMD[key], m = parseTerm(d.m), P = parsePoly(d.p), prods = P.map((t) => mulT(m, t));
    const mT = termT(m, true), pT = polyT(P), orig = `${mT}(${pT})`, res = polyT(prods);
    let ws = P.map(lenOf), hh = Math.max(84, Math.min(210, Math.round(lenOf(m) * 0.8)));
    const sc = Math.min(1.35, 420 / (ws[0] + ws[1]), 230 / hh); ws = ws.map((w) => Math.round(w * sc)); hh = Math.round(hh * sc);
    const Wt = ws[0] + ws[1], rx = 120, ry = Math.round(60 + (236 - hh) / 2), offs = [0, ws[0]];
    const fills = P.map((t, k) => { const f = add(stage, box(h('div', 'u3l2-fill' + (prods[k].c < 0 ? ' neg' : '')), ws[k], hh), rx + offs[k], ry); f.style.setProperty('--pc', PCOL[k]); hide(f); return f; });
    const rect = add(stage, box(h('div', 'u3l2-rect'), Wt, hh), rx, ry); hide(rect);
    const divl = add(stage, box(h('div', 'u3l2-divl'), 0, hh), rx + ws[0], ry); hide(divl);
    const side = add(stage, h('div', 'u3l2-lab c', K(mT)), rx - 34, ry + hh / 2); hide(side);
    const dimAll = add(stage, box(h('div', 'u3l2-dim'), Wt, 0), rx, ry - 12); hide(dimAll);
    const topAll = add(stage, h('div', 'u3l2-lab c', K(pT)), rx + Wt / 2, ry - 36); hide(topAll);
    const dims = P.map((t, k) => { const e = add(stage, box(h('div', 'u3l2-dim'), ws[k] - 6, 0), rx + offs[k] + 3, ry - 12); hide(e); return e; });
    const tops = P.map((t, k) => { const e = add(stage, h('div', 'u3l2-lab c', K(termT(t, true))), rx + offs[k] + ws[k] / 2, ry - 36); e.style.color = PCOL[k]; hide(e); return e; });
    const ctr = add(stage, h('div', 'u3l2-ctr c', K(`\\text{area}=${mT}(${pT})`)), rx + Wt / 2, ry + hh / 2); hide(ctr);
    const plabs = prods.map((p, k) => { const e = add(stage, h('div', 'u3l2-plab c', K(termT(p, true))), rx + offs[k] + ws[k] / 2, ry + hh / 2); e.style.color = p.c < 0 ? RED : PCOL[k]; hide(e); return e; });
    const px = rx + Wt + 64, lh = 56; let ly = 52;
    wline(stage, orig, px, ly); ly += lh;
    const half = (k) => `${fT(m)}\\cdot ${fT(P[k])}`;
    const Lp = wline(stage, `\\htmlClass{u3l2-h0}{=${half(0)}}\\mathbin{\\htmlClass{u3l2-h1}{+}}\\htmlClass{u3l2-h1}{${half(1)}}`, px, ly); ly += lh;
    const h0 = spans(Lp, 'u3l2-h0'), h1 = spans(Lp, 'u3l2-h1'); hide(...h0, ...h1);
    const Lf = wline(stage, `=${prods.map((p, k) => ctT(p, k === 0, p.c < 0 ? RED : PCOL[k])).join('')}`, px, ly, 'u3l2-ans'); hide(Lf);
    const negs = [m, ...P].filter((t) => t.c < 0).map((t) => T(termT(t, true)));
    const steps = [{
      cap: `A rectangle ${T(mT)} tall and ${T(pT)} wide has area ${T(orig)}.` + (negs.length ? ` (With ${negs.join(' and ')} it’s a <b>bookkeeping</b> picture: a negative is a signed entry, not a real length.)` : ''),
      run: (c) => Promise.all([c.fadeIn(rect, 400), c.pop(side, 380, { delay: 200 }), c.fadeIn(dimAll, 300, { delay: 300 }), c.fadeIn(topAll, 350, { delay: 350 }), c.fadeIn(ctr, 400, { delay: 500 })])
    }, {
      cap: `Split the width into its two terms, ${T(termT(P[0], true))} and ${T(termT(P[1], true))}. Now there are <b>two</b> smaller rectangles.`,
      run: (c) => Promise.all([c.anim(divl, [{ opacity: 1, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1)' }], 450), c.anim(ctr, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(topAll, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(dimAll, [{ opacity: 1 }, { opacity: 0 }], 250), ...tops.map((e, k) => c.pop(e, 380, { delay: 250 + k * 120 })), ...dims.map((e, k) => c.fadeIn(e, 300, { delay: 250 + k * 120 }))])
    }];
    P.forEach((t, k) => {
      const p = prods[k];
      steps.push({
        cap: `${k ? 'Right' : 'Left'} piece: ${T(mT)} by ${T(termT(t, true))}. Its area is ${prodCap(m, t)}.` + expNote(m, t) + (p.c < 0 ? ' A negative entry gives a <b>negative</b> piece.' : m.c < 0 && t.c < 0 ? ' Two negatives give a <b>positive</b> piece.' : ''),
        run: (c) => Promise.all([c.anim(fills[k], [{ opacity: 0 }, { opacity: 1 }], 400), c.pop(plabs[k], 420, { delay: 150 }), showSpans(c, k ? h1 : h0, 350)])
      });
    });
    steps.push({
      cap: `Add the pieces: ${T(`${orig}=${res}`)}.${key === 'w' ? ` Put ${T('x=100')} back: ${T('700+21=721=7\\times103')} ✓, the warm-up!` : ''}`,
      run: (c) => Promise.all([c.fadeIn(Lf, 400), ...plabs.map((e) => pulse(c, e, 1.15))])
    });
    return steps;
  }
};

/* ============ 2–5. Distributing: arrows from the monomial to every term ============ */
const DS = {
  s1: { g: [{ m: '3x', p: 'x+4' }] }, s2: { g: [{ m: '-5', p: 'x-2' }] }, s3: { g: [{ m: '6', p: 'x-2' }] },
  b1: { g: [{ m: '2x', p: 'x+5' }, { t: '3x' }] }, b2: { g: [{ m: '3', p: 'x+4' }, { t: '-2x' }] },
  e4a: { g: [{ m: '3x', p: 'x+2' }, { t: '4x' }] }, e4b: { g: [{ m: '5', p: 'x-3' }, { t: '-2x' }] }, e4c: { g: [{ m: '4x', p: 'x-1' }, { m: '3', p: 'x+2' }] }, e4d: { g: [{ m: '2x', p: '3x+1' }, { t: '-5x' }] },
  c1: { g: [{ m: '-2x', p: 'x+3' }, { m: '-4', p: 'x-1' }] },
  e5a: { g: [{ m: '-4x', p: '2x-3' }, { m: '-3', p: 'x-5' }] }, e5b: { g: [{ m: '-x', p: 'x+8' }, { m: '-2x', p: '3x-1' }] }
};
function dsExprT(groups) {
  let s = '';
  groups.forEach((g, gi) => {
    if (g.t) { const t = parseTerm(g.t); s += (gi ? (t.c < 0 ? '-' : '+') : t.c < 0 ? '-' : '') + `\\htmlClass{u3l2-g${gi}c}{${bodyT(t)}}`; return; }
    const m = parseTerm(g.m), P = parsePoly(g.p), unit = Math.abs(m.c) === 1 && isConst(m);
    const inner = P.map((t, k) => (k === 0 ? `\\htmlClass{u3l2-g${gi}t${k}}{${termT(t, true)}}` : `${t.c < 0 ? '-' : '+'}\\htmlClass{u3l2-g${gi}t${k}}{${bodyT(t)}}`)).join('');
    const sg = m.c < 0 ? '-' : '+';
    if (gi === 0) s += unit ? (m.c < 0 ? `\\htmlClass{u3l2-g${gi}m}{-}` : '') : `\\htmlClass{u3l2-g${gi}m}{${termT(m, true)}}`;
    else s += unit ? `\\mathbin{\\htmlClass{u3l2-g${gi}m}{${sg}}}` : `\\mathbin{\\htmlClass{u3l2-g${gi}m}{${sg}}}\\htmlClass{u3l2-g${gi}m}{${bodyT(m)}}`;
    s += `(${inner})`;
  });
  return s;
}
const dsPlain = (k) => dsExprT(DS[k].g).replace(/\\htmlClass\{[^}]*\}/g, '');
function makeDist(title, choices, first, height = 360) {
  return {
    title, height, choices, value: first, minW: 820,
    intro: (k) => `Expand${DS[k].g.length > 1 ? ' and simplify' : ''} ${T(dsPlain(k))}.`,
    make(stage, key) {
      const groups = DS[key].g, two = groups.filter((g) => !g.t).length > 1;
      const svg = arcLayer(stage);
      const row0 = add(stage, h('div', 'u3l2-ds0', K(dsExprT(groups))), 44, 96);
      const chunks = [];
      groups.forEach((g, gi) => {
        if (g.t) { chunks.push({ t: parseTerm(g.t), gi, k: -1 }); return; }
        const m = parseTerm(g.m);
        parsePoly(g.p).forEach((t, k) => chunks.push({ t: mulT(m, t), gi, k, a: m, b: t }));
      });
      const r1T = `\\htmlClass{u3l2-req}{=}` + chunks.map((ch, i) => (i === 0 ? `\\htmlClass{u3l2-r${i}}{${termT(ch.t, true)}}` : `\\mathbin{\\htmlClass{u3l2-r${i}}{${ch.t.c < 0 ? '-' : '+'}}}\\htmlClass{u3l2-r${i}}{${bodyT(ch.t)}}`)).join('');
      const row1 = add(stage, h('div', 'u3l2-ds1', K(r1T)), 44, 196);
      const rEls = chunks.map((ch, i) => spans(row1, 'u3l2-r' + i)), req = spans(row1, 'u3l2-req');
      hide(...req, ...rEls.flat());
      const fin = collect(chunks.map((ch) => ch.t)), likes = likeGroups(chunks.map((ch) => ch.t));
      const row2 = add(stage, h('div', 'u3l2-ds1 u3l2-ans', K('=' + polyT(fin))), 44, 276); hide(row2);
      const steps = [];
      const arrs = [];
      groups.forEach((g, gi) => {
        if (g.t) {
          const i = chunks.findIndex((ch) => ch.gi === gi);
          steps.push({
            cap: `The ${T(termT(chunks[i].t, true))} isn’t attached to a bracket, so it comes down <b>as it is</b>, sign and all.`,
            run: async (c) => { await Promise.all(arrs.map((a) => a.dim(c))); spans(row0, `u3l2-g${gi}c`).forEach((e) => e.classList.add('u3l2-hot')); if (!req[0].style.opacity || req[0].style.opacity === '0') showSpans(c, req); return showSpans(c, rEls[i]); }
          });
          return;
        }
        const m = parseTerm(g.m), P = parsePoly(g.p), unit = Math.abs(m.c) === 1 && isConst(m);
        P.forEach((t, k) => {
          const i = chunks.findIndex((ch) => ch.gi === gi && ch.k === k), col = PCOL[k % PCOL.length], prod = chunks[i].t;
          let cap = '';
          if (k === 0) cap += two ? `${gi ? '<b>Second bracket</b>' : '<b>First bracket</b>'}: distribute the ${T(termT(m, true))} to <b>every</b> term inside. ` : `Distribute the ${T(termT(m, true))} to <b>every</b> term in the bracket. `;
          cap += prodCap(m, t) + '.';
          cap += expNote(m, t) || '';
          if (!(unit && m.c < 0)) cap += signNote(m, t); else cap += t.c < 0 ? ' The sign flips to <b>+</b>.' : ' The sign flips to <b>−</b>.';
          steps.push({
            cap,
            run: async (c) => {
              if (k === 0) { await Promise.all(arrs.map((a) => a.dim(c))); spans(row0, `u3l2-g${gi}m`).forEach((e) => e.classList.add('u3l2-hot')); }
              const mEl = spans(row0, `u3l2-g${gi}m`).pop(), tEl = spans(row0, `u3l2-g${gi}t${k}`)[0];
              const a = stagePos(stage, mEl), b = stagePos(stage, tEl), dx = Math.abs(b.x - a.x);
              const ar = arrow(svg, a.x, a.t - 2, b.x, b.t - 2, Math.min(80, 30 + dx * 0.28), col); arrs.push(ar);
              tEl.style.color = col;
              if (!req[0].style.opacity || req[0].style.opacity === '0') showSpans(c, req);
              await ar.draw(c, 480);
              rEls[i].forEach((e) => (e.style.color = col));
              await showSpans(c, rEls[i], 350);
            }
          });
        });
      });
      if (likes.length) {
        const parts = likes.map((g) => T(`${g.map((i, j) => termT(chunks[i].t, j === 0)).join('')}=${termT(collect(g.map((i) => chunks[i].t))[0] || { c: 0, v: {} }, true)}`));
        const alone = chunks.map((ch, i) => i).filter((i) => !likes.some((g) => g.includes(i)));
        steps.push({
          cap: `<b>Then collect like terms</b> (same colour): ${parts.join(' and ')}.` + (alone.length ? ` ${alone.map((i) => T(termT(chunks[i].t, true))).join(' and ')} ${alone.length > 1 ? 'have' : 'has'} no partner. ` : ' ') + `Answer: ${T(polyT(fin))}.`,
          run: async (c) => {
            await Promise.all(arrs.map((a) => a.dim(c)));
            chunks.forEach((ch, i) => { const g = likes.findIndex((gg) => gg.includes(i)); rEls[i].forEach((e) => { e.style.color = g < 0 ? '#9aa0ab' : LIKE[g]; }); if (g >= 0) rEls[i][rEls[i].length - 1].classList.add('u3l2-likeu'); });
            await c.fadeIn(row2, 420, { delay: 150 });
          }
        });
      } else {
        steps.push({
          cap: `${chunks.length === 3 ? 'Three terms in, three terms out. ' : ''}No like terms to collect, so that’s the answer: ${T(dsPlain(key) + '=' + polyT(fin))}.`,
          run: async (c) => { await Promise.all(arrs.map((a) => a.dim(c))); row1.classList.add('u3l2-ans'); await pulse(c, row1, 1.05); }
        });
      }
      return steps;
    }
  };
}
const distA = makeDist('Signs travel with their term', [{ v: 's1', label: tex(dsPlain('s1')) }, { v: 's2', label: tex(dsPlain('s2')) }, { sep: 'Warm-up:' }, { v: 's3', label: tex(dsPlain('s3')) }], 's1', 300);
const distB = makeDist('Distribute first, then collect', [{ v: 'b1', label: tex(dsPlain('b1')) }, { v: 'b2', label: tex(dsPlain('b2')) }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }, { v: 'e4c', label: '(c)' }, { v: 'e4d', label: '(d)' }], 'b1');
const distC = makeDist('One bracket at a time', [{ v: 'c1', label: tex(dsPlain('c1')) }, { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }, { v: 'e5b', label: '(b)' }], 'c1');

/* ============ 3. The area grid: one cell per term in the bracket ============ */
const AG = {
  w: { m: '4', p: 'x^2+2x+3' }, n: { m: '2x', p: 'x^2+3x-4' },
  a: { m: '3', p: 'x^2+2x-1' }, b: { m: '-4', p: '2x^2-x+5' }, c: { m: '5x', p: 'x^2-3x+2' }, d: { m: '-2x', p: '3x^2+x-6' }
};
const areaGrid = {
  title: 'Three terms in, three terms out',
  height: 392,
  minW: 820,
  value: 'n',
  choices: [{ v: 'n', label: tex('2x(x^2+3x-4)') }, { sep: 'Warm-up:' }, { v: 'w', label: tex('4(x^2+2x+3)') }, { sep: 'Example 3 check:' }, ...'abcd'.split('').map((k) => ({ v: k, label: '(' + k + ')' }))],
  intro: (k) => `Expand ${T(`${AG[k].m}(${AG[k].p})`)}.`,
  make(stage, key, ex) {
    const W = ex.W, d = AG[key], m = parseTerm(d.m), P = parsePoly(d.p), prods = P.map((t) => mulT(m, t)), n = P.length;
    const hw = 100, cw = 190, hh0 = 58, ch = 112, GW = hw + cw * n, gx = Math.round((W - GW) / 2), gy = 70;
    const gt = add(stage, h('div', 'u3l2-gt c', 'area model'), gx + GW / 2, gy - 22);
    const gg = (x, y, w, hgt, cls, html) => add(stage, box(h('div', 'u3l2-gg ' + cls, html), w, hgt), x, y);
    gg(gx, gy, hw, hh0, 'hd x', K('\\times'));
    const heads = P.map((t, k) => { const e = gg(gx + hw + k * cw, gy, cw, hh0, 'hd', `<span>${K(termT(t, true))}</span>`); e.style.color = PCOL[k]; return e; });
    const side = gg(gx, gy + hh0, hw, ch, 'hd', `<span>${K(termT(m, true))}</span>`);
    const cells = prods.map((p, k) => { const e = gg(gx + hw + k * cw, gy + hh0, cw, ch, 'in' + (p.c < 0 ? ' neg' : ''), `<span>${K(termT(p, true))}</span>`); e.style.setProperty('--pc', PCOL[k]); e.firstChild.style.opacity = 0; return e; });
    void gt;
    const ly = gy + hh0 + ch + 56;
    const line = add(stage, h('div', 'u3l2-ds1', K(`${termT(m, true)}(${polyT(P)})=` + prods.map((p, k) => `\\htmlClass{u3l2-q${k}}{${k ? (p.c < 0 ? '-' : '+') : ''}${tc(p.c < 0 ? RED : PCOL[k], k ? bodyT(p) : termT(p, true))}}`).join(''))), gx, ly);
    const qEls = prods.map((p, k) => spans(line, 'u3l2-q' + k)); hide(...qEls.flat());
    const tally = add(stage, h('div', 'u3l2-tally'), gx + GW - 4, ly + 56); tally.style.translate = '-100% -50%'; tally.innerHTML = `<b>${n}</b> terms in the bracket → <b>${n}</b> terms in the answer`; hide(tally);
    const steps = [{
      cap: `Make a grid: ${T(termT(m, true))} down the side, and <b>one column for each term</b> in the bracket: ${P.map((t) => T(termT(t, true))).join(', ')}. Each cell will hold one product.`,
      run: (c) => Promise.all([pulse(c, side, 1.08), ...heads.map((e, i) => pulse(c, e, 1.08).then(() => c.sleep(i * 60)))])
    }];
    P.forEach((t, k) => {
      const p = prods[k];
      steps.push({
        cap: `Cell ${k + 1}: ${prodCap(m, t)}.` + expNote(m, t) + signNote(m, t),
        run: async (c) => {
          heads[k].classList.add('on'); cells[k].classList.add('on');
          await Promise.all([c.anim(cells[k].firstChild, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], 380), showSpans(c, qEls[k], 350)]);
        }
      });
    });
    steps.push({
      cap: `${WORD[n][0].toUpperCase() + WORD[n].slice(1)} terms in, ${WORD[n]} terms out: ${T(`${termT(m, true)}(${polyT(P)})=${polyT(prods)}`)}. None of them are like terms, so that’s the answer.${key === 'w' ? ` Put ${T('x=10')} back: ${T('4\\times123=400+80+12=492')} ✓.` : ''}`,
      run: async (c) => { await c.fadeIn(tally, 350); line.classList.add('u3l2-ansl'); await pulse(c, line, 1.05); }
    });
    return steps;
  }
};

/* ============ 4. Spot the mistake ============ */
const MS = {
  m1: { q: '4x^2\\times3x^4', who: 'Ava', work: ['=\\htmlClass{u3l2-bad}{12x^{8}}'], why: `The exponents were <b>multiplied</b> (${T('2\\times4')}). Same base: <b>add</b> them, ${T('2+4=6')}.`, right: ['=(4\\times3)(x^{2}\\cdot x^{4})', '=12x^{6}'], tag: 'Product Law' },
  m2: { q: '-5(x-2)', who: 'Ben', work: ['=-5x\\htmlClass{u3l2-bad}{-10}'], why: `The second product lost its sign: ${T('(-5)(-2)=+10')}. Negative × negative is positive.`, right: ['=(-5)(x)+(-5)(-2)', '=-5x+10'], tag: 'a lost sign' },
  m3: { q: '3x(x^2-2x+4)', who: 'Cam', work: ['=3x^{3}-6x^{2}\\htmlClass{u3l2-bad}{+4}'], why: `The ${T('4')} was never multiplied. Three terms in the bracket means <b>three products</b>: ${T('3x\\cdot4=12x')}.`, right: ['=3x\\cdot x^{2}+3x(-2x)+3x\\cdot4', '=3x^{3}-6x^{2}+12x'], tag: 'a skipped term' },
  m4: { q: '3x(x+2)-5(x-1)', who: 'Dev', work: ['=3x^{2}+6x-5x\\htmlClass{u3l2-bad}{-5}', '=3x^{2}+x-5'], why: `The ${T('-5')} reaches <b>both</b> terms of the second bracket: ${T('(-5)(-1)=+5')}, not ${T('-5')}.`, right: ['=3x^{2}+6x-5x+5', '=3x^{2}+x+5'], tag: 'the second bracket' }
};
const mistakes = {
  title: 'Spot the mistake',
  height: 360,
  minW: 860,
  value: 'm1',
  choices: Object.keys(MS).map((k) => ({ v: k, label: MS[k].tag })),
  intro: (k) => `${MS[k].who} simplified ${T(MS[k].q)}. Is it right?`,
  make(stage, key, ex) {
    const W = ex.W, d = MS[key], cw = (W - 60) / 2;
    add(stage, h('div', 'u3l2-msq c', K(d.q)), W / 2, 40);
    const card = (x, cls, head, lines) => { const e = add(stage, h('div', 'u3l2-mscard ' + cls, `<div class="u3l2-msh">${head}</div>` + lines.map((l) => `<div class="u3l2-msl">${K(l)}</div>`).join('')), x, 86); e.style.width = cw + 'px'; return e; };
    const A = card(20, '', `${d.who}’s work`, [d.q, ...d.work]);
    const B = card(40 + cw, 'good', 'Corrected', [d.q, ...d.right]); hide(B);
    const bad = A.querySelector('.u3l2-bad'); const why = add(stage, h('div', 'u3l2-mswhy', d.why), 20, 268); why.style.width = cw + 'px'; hide(why);
    const st1 = add(stage, h('div', 'u3l2-stamp no c', '✗'), 20 + cw - 20, 96); hide(st1);
    const st2 = add(stage, h('div', 'u3l2-stamp ok c', '✓'), 40 + 2 * cw - 20, 96); hide(st2);
    return [{
      cap: `Here is ${d.who}’s work. Before you look ahead: is it right? If not, <b>where</b> is the mistake?`,
      run: (c) => pulse(c, A, 1.03)
    }, {
      cap: `Found it. ${d.why}`,
      run: async (c) => { bad.classList.add('on'); await Promise.all([c.fadeIn(why, 350), stampIn(c, st1)]); }
    }, {
      cap: `The corrected work: ${T(d.q + d.right[d.right.length - 1])}.`,
      run: async (c) => { await c.fadeIn(B, 400, { from: 'translateX(12px)' }); await stampIn(c, st2); }
    }];
  }
};

/* ============ static figures: mini area models in the answers ============ */
function mountFigures() {
  document.querySelectorAll('.u3l2-mini').forEach((el) => {
    const m = parseTerm(el.dataset.side), P = el.dataset.top.split(',').map(parseTerm);
    el.innerHTML = `<div class="u3l2-mside">${K(termT(m, true))}</div><div class="u3l2-mbody"><div class="u3l2-mtop">${P.map((t) => `<span class="${isConst(t) ? 'k' : 'v'}">${K(termT(t, true))}</span>`).join('')}</div><div class="u3l2-mrow">${P.map((t) => { const p = mulT(m, t); return `<span class="${isConst(t) ? 'k' : 'v'}${p.c < 0 ? ' neg' : ''}">${K(termT(p, true))}</span>`; }).join('')}</div></div>`;
  });
}

/* ============ warm-up: beat the calculator ============ */
function mountCalc() {
  const host = document.getElementById('u3l2-bc'); if (!host) return;
  const st = { fill: false, x: false };
  host.innerHTML = `<div class="u3l2-bcg">
      <div class="u3l2-bcfig"><div class="u3l2-bctop"><span class="w1" data-l="a100"></span><span class="w2 red" data-l="a3"></span></div>
        <div class="u3l2-bcmid"><span class="u3l2-bcs" data-l="a7"></span><div class="u3l2-bcbox"><div class="w1 big" data-l="aBig"></div><div class="w2 sm" data-l="aSm"></div></div></div>
        <div class="u3l2-bcbr"></div><div class="u3l2-bcbl" data-l="aTot"></div></div>
      <div class="u3l2-bcfig"><div class="u3l2-bctop"><span class="w1" data-l="b98"></span><span class="w2 red" data-l="b2"></span></div>
        <div class="u3l2-bcmid"><span class="u3l2-bcs" data-l="b6"></span><div class="u3l2-bcbox"><div class="w1 big" data-l="bBig"></div><div class="w2 sm cut" data-l="bSm"></div></div></div>
        <div class="u3l2-bcbr"></div><div class="u3l2-bcbl" data-l="bTot"></div></div>
    </div>
    <div class="u3l2-bcctl no-ink"><button class="pill small" type="button" data-b="fill">Fill in the pieces</button><button class="pill small" type="button" data-b="x">Cover the 100 with ${K('x')}</button><button class="exb" type="button" data-b="reset" title="Start over" aria-label="Start over"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg></button></div>
    <div class="u3l2-bcread" aria-live="polite"></div>`;
  const L = (k) => host.querySelector(`[data-l=${k}]`), read = host.querySelector('.u3l2-bcread');
  const render = () => {
    const x = st.x, f = st.fill || st.x;
    L('a100').innerHTML = x ? K('x') : '100'; L('a3').innerHTML = '3'; L('a7').innerHTML = '7';
    L('b98').innerHTML = x ? K('x-2') : '98'; L('b2').innerHTML = '2'; L('b6').innerHTML = '6';
    L('aBig').innerHTML = x ? K('7x') : f ? K('7\\times100=700') : K('7\\times100=\\ ?');
    L('aSm').innerHTML = f ? K('21') : '?';
    L('bBig').innerHTML = x ? K('6x-12') : f ? K('600-12=588') : K('6\\times98=\\ ?');
    L('bSm').innerHTML = f ? K('12') : '<small>cut off</small>';
    L('aTot').innerHTML = x ? K('7(x+3)') : K('7\\times103');
    L('bTot').innerHTML = x ? `whole strip: ${K('6x')}` : `whole strip: ${K('6\\times100')}`;
    host.querySelectorAll('[data-b=fill],[data-b=x]').forEach((b) => b.classList.toggle('on', st[b.dataset.b]));
    read.innerHTML = x ? `${K('7(x+3)=7x+21')} &nbsp; and &nbsp; ${K('6(x-2)=6x-12')}` : f ? `${K('700+21=721')} &nbsp; and &nbsp; ${K('600-12=588')}` : 'Split each rectangle into friendly pieces.';
    host.classList.toggle('xmode', x);
  };
  host.querySelectorAll('[data-b]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.b; if (k === 'reset') { st.fill = st.x = false; } else st[k] = !st[k];
    render();
  }));
  render();
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { monoMul, areaRect, distA, areaGrid, distB, mistakes, distC };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountFigures(); mountCalc(); mountExplainers();

/* ============ Stand Up Break! (lessons/js/standup.js) — monomials times polynomials, at the whiteboards ============ */
(() => {
  const nz = (r, lo, hi) => { let v = 0; while (!v) v = r.int(lo, hi); return v; };
  const mt = (c, v, e) => ({ c, v: e ? { [v]: e } : {} });
  /* m·(list): the products written out, then the answer */
  const dist = (m, P) => {
    const prods = P.map((t) => mulT(m, t));
    return { q: `${m.c === -1 && isConst(m) ? '-' : termT(m, true)}(${polyT(P)})`, a: ['=' + P.map((t, i) => (i ? '+' : '') + `${fT(m)}\\cdot ${fT(t)}`).join(''), '=' + polyT(prods)] };
  };
  standup('u3l2', {
    intro: 'Expand at your whiteboard station. Multiply the outside term by every term inside, and keep each sign.',
    levels: {
      /* a monomial times a monomial, or a number times a binomial (Examples 1 and 2 (a), (b)) */
      BEG: (r) => {
        const v = r.pick(['x', 'x', 'x', 'y', 'a', 'n']);
        if (r.chance(0.5)) {
          const a = mt(nz(r, -6, 7), v, r.int(1, 4)), b = mt(nz(r, -6, 7), v, r.int(1, 5));
          if (a.c === 1 && b.c === 1) b.c = r.int(2, 5);
          const p = mulT(a, b), ca = a.c < 0 ? `(${a.c})` : a.c, cb = b.c < 0 ? `(${b.c})` : b.c;
          return { q: `${termT(a, true)}\\times ${fT(b)}`, a: [`=(${ca}\\times ${cb})\\,${v}^{${a.v[v]}+${b.v[v]}}`, '=' + termT(p, true)] };
        }
        return dist(mt(nz(r, -9, 9), v, 0), [mt(1, v, 1), mt(nz(r, -9, 9), v, 0)]);
      },
      /* a monomial with a variable times a binomial, signs mixed (Example 2 (c), (d)) */
      PRG: (r) => {
        const v = r.pick(['x', 'x', 'x', 'y', 'a', 'm']);
        for (;;) {
          const m = mt(nz(r, -6, 6), v, 1), P = [mt(r.int(1, 5), v, 1), mt(nz(r, -9, 9), v, 0)];
          if (m.c > 0 && P[1].c > 0) continue;
          return dist(m, P);
        }
      },
      /* a monomial times a trinomial (Example 3), often negative */
      MAS: (r) => {
        const v = r.pick(['x', 'x', 'x', 'y', 'a', 'n']);
        for (;;) {
          const m = r.chance(0.3) ? mt(nz(r, -6, 6), v, 0) : mt(nz(r, -6, 5), v, 1);
          const P = [mt(r.int(1, 4), v, 2), mt(nz(r, -7, 7), v, 1), mt(nz(r, -9, 9), v, 0)];
          if (m.c > 0 && P[1].c > 0 && P[2].c > 0) continue;
          if (Math.abs(m.c) === 1 && isConst(m)) continue;
          return dist(m, P);
        }
      }
    }
  });
})();
