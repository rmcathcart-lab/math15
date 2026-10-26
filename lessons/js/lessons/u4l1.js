/* Math 15 · Unit 4 · Lesson 1 — Multiplying and Factoring: The Reverse Relationship.
 * The explainers, the "How Many Rectangles?" warm-up, the factor-tree pair and the Stand Up Break on this page.
 * Several explainers are adapted from Math 10C 4.1 (same engine): twoWay, columns, lowest, tileRect, pull. */
import { h, Explainer, primeFactors, FactorTree } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const box = (el, w, hh) => { el.style.width = w + 'px'; el.style.height = hh + 'px'; return el; };

/* KaTeX allowing \htmlClass (pieces of an expression that light up or fly one at a time) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s); // inline math in captions

const BLU = '#2b55a0', AMB = '#c27a0e', PUR = '#7b4fc4', GRN = '#12805a';
const PCOL = [BLU, AMB, PUR, GRN];
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;

/* ============ terms: { n, d, v: { x: 2, y: 1 } } (whole numbers here; d stays 1) ============ */
const gcdI = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
function norm(t) {
  const g = gcdI(t.n, t.d) || 1, v = {};
  Object.keys(t.v).forEach((k) => { if (t.v[k]) v[k] = t.v[k]; });
  return { n: t.n / g, d: t.d / g, v };
}
function parseTerm(s) {
  const m = String(s).replace(/\s+/g, '').match(/^([+-]?)(\d+(?:\/\d+)?)?((?:[a-z](?:\^\d+)?)*)$/);
  if (!m) throw new Error('bad term ' + s);
  let n = 1, d = 1;
  if (m[2]) { const [p, q] = m[2].split('/'); n = +p; d = q ? +q : 1; }
  if (m[1] === '-') n = -n;
  const v = {};
  (m[3].match(/[a-z](?:\^\d+)?/g) || []).forEach((p) => { const k = p[0], e = p.includes('^') ? +p.split('^')[1] : 1; v[k] = (v[k] || 0) + e; });
  return norm({ n, d, v });
}
const parsePoly = (s) => String(s).replace(/\s+/g, '').match(/[+-]?[^+-]+/g).map(parseTerm);
const varT = (v) => Object.keys(v).map((k) => k + (v[k] > 1 ? `^{${v[k]}}` : '')).join('');
function bodyT(t) { const vs = varT(t.v), an = Math.abs(t.n); return (an === 1 && vs ? '' : String(an)) + vs; }
const termT = (t, first) => (t.n < 0 ? '-' : first ? '' : '+') + bodyT(t);
const polyT = (list) => list.map((t, i) => termT(t, i === 0)).join('');
const fT = (t) => (t.n < 0 ? `(${termT(t, true)})` : termT(t, true)); // a factor written for multiplying: (−3), 2x
function mulT(a, b) { const v = { ...a.v }; for (const k in b.v) v[k] = (v[k] || 0) + b.v[k]; return norm({ n: a.n * b.n, d: a.d * b.d, v }); }
function divT(a, g) {
  let n = a.n * g.d, d = a.d * g.n; if (d < 0) { n = -n; d = -d; }
  const v = { ...a.v }; for (const k in g.v) v[k] = (v[k] || 0) - g.v[k];
  return norm({ n, d, v });
}
const keyT = (t) => Object.keys(t.v).sort().map((k) => k + t.v[k]).join('');
const degT = (t) => Object.values(t.v).reduce((s, e) => s + e, 0);
function collect(list) { // combine like terms; highest degree first, ties in order of appearance
  const m = new Map();
  list.forEach((t) => { const k = keyT(t); if (m.has(k)) { const o = m.get(k); o.n = o.n * t.d + t.n * o.d; o.d *= t.d; } else m.set(k, { n: t.n, d: t.d, v: { ...t.v } }); });
  return [...m.values()].map((t, i) => ({ t: norm(t), i })).filter((o) => o.t.n !== 0).sort((a, b) => degT(b.t) - degT(a.t) || a.i - b.i).map((o) => o.t);
}
/* GCF of whole-number monomials (all positive in this lesson). Variables keep the first term's order. */
function gcfOf(list) {
  const g = list.reduce((a, t) => gcdI(a, t.n), 0) || 1;
  const v = {};
  Object.keys(list[0].v).forEach((k) => { const e = Math.min(...list.map((t) => t.v[k] || 0)); if (e) v[k] = e; });
  return { n: g, d: 1, v };
}
const splitProd = (s) => { const i = s.indexOf('('); return { g: parseTerm(s.slice(0, i)), br: parsePoly(s.slice(i + 1, -1)) }; };

/* ============ drawing helpers ============ */
function stagePos(stage, el) { // an element's box in stage coordinates (the stage may be scaled to fit)
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, l: (r.left - sr.left) / k, t: (r.top - sr.top) / k, r: (r.right - sr.left) / k, b: (r.bottom - sr.top) / k };
}
function arcLayer(stage) { const s = svgEl('svg', { class: 'u4l1-arcs' }); stage.appendChild(s); return s; }
/* an arrow that draws itself from (x1,y1) to (x2,y2), bulging up (lift > 0) or down (lift < 0) */
function arrow(svg, x1, y1, x2, y2, lift, col) {
  const cx = (x1 + x2) / 2, cy = (lift > 0 ? Math.min(y1, y2) : Math.max(y1, y2)) - lift;
  const p = svgEl('path', { d: `M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`, fill: 'none', stroke: col, 'stroke-width': 3.4, 'stroke-linecap': 'round' });
  const ang = Math.atan2(y2 - cy, x2 - cx), L = 13, wd = 0.46;
  const pts = [[x2, y2], [x2 - L * Math.cos(ang - wd), y2 - L * Math.sin(ang - wd)], [x2 - L * Math.cos(ang + wd), y2 - L * Math.sin(ang + wd)]];
  const hd = svgEl('polygon', { points: pts.map((q) => q.join(',')).join(' '), fill: col });
  svg.append(p, hd);
  const len = p.getTotalLength() || 1;
  p.style.strokeDasharray = len; p.style.strokeDashoffset = len; hd.style.opacity = 0;
  return { async draw(c, ms = 480) { await c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms); await c.anim(hd, [{ opacity: 0 }, { opacity: 1 }], 140); } };
}
const pulse = (c, el, s = 1.12) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);
const showSpans = (c, els, ms = 320, delay = 0) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms, { delay })));
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }
function fit(el, maxW) { const w = el.offsetWidth; if (w > maxW) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * maxW / w).toFixed(1) + 'px'; return el; }
/* fly a copy of `html` from one stage point to another, then remove it */
async function fly(c, stage, html, from, to, cls, ms = 650) {
  const e = add(stage, h('div', 'u4l1-fly c ' + (cls || ''), html), from.x, from.y);
  if (c.fast) { e.remove(); return; }
  try { await c.anim(e, [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(1.04)` }], ms); }
  finally { e.remove(); }
}
const listAnd = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);

/* ============ 1. One rectangle, two directions (area model) ============ */
const TW = { a: '4(x+3)', b: '2(x+5)', c: 'x(x+7)', w: '6(x+3)' };
const twoWay = {
  title: 'Expanding and factoring: one rectangle, two directions',
  height: 344,
  minW: 820, // the two 300 px form boxes need room for the arrows between them
  choices: [{ v: 'a', label: tex(TW.a) }, { v: 'b', label: tex(TW.b) }, { v: 'c', label: tex(TW.c) }, { sep: 'Warm-up:' }, { v: 'w', label: tex(TW.w) }],
  intro: (k) => `${T(TW[k])} is a <b>product</b>: the area of a rectangle whose sides are the factors. Watch it expand, then run backwards.`,
  make(stage, key, ex) {
    const W = ex.W, { g, br } = splitProd(TW[key]), A = br, B = [g], prodT = TW[key];
    const cells = A.map((a) => mulT(g, a)), resT = polyT(collect(cells));
    const bw = 300, bh = 92;
    const form = (x, lab) => { const e = add(stage, box(h('div', 'u4l1-form'), bw, bh), x, 18); e.innerHTML = `<div class="u4l1-fh">${lab}</div><div class="u4l1-fx"></div>`; return e; };
    const L = form(22, 'factored form · a product'), R = form(W - bw - 22, 'expanded form · a sum of terms');
    const Lx = L.lastChild, Rx = R.lastChild;
    Lx.innerHTML = K(prodT); hide(L, R); Rx.innerHTML = K(resT);
    const svg = arcLayer(stage), ax0 = 22 + bw + 18, ax1 = W - bw - 22 - 18;
    const straight = (x1, x2, y, col) => {
      const p = svgEl('path', { d: `M${x1} ${y}L${x2} ${y}`, stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' });
      const s = Math.sign(x2 - x1), hd = svgEl('polygon', { points: `${x2},${y} ${x2 - s * 15},${y - 9} ${x2 - s * 15},${y + 9}`, fill: col });
      svg.append(p, hd); const len = Math.abs(x2 - x1); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; hd.style.opacity = 0;
      return { draw: async (c) => { await c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 520); await c.anim(hd, [{ opacity: 0 }, { opacity: 1 }], 140); } };
    };
    const up = straight(ax0, ax1, 50, BLU), dn = straight(ax1, ax0, 86, AMB);
    const upL = add(stage, h('div', 'u4l1-arl c', 'expand'), (ax0 + ax1) / 2, 30), dnL = add(stage, h('div', 'u4l1-arl c amb', 'factor'), (ax0 + ax1) / 2, 108);
    upL.style.color = BLU; dnL.style.color = AMB; hide(upL, dnL);
    // the area model: one row (the common factor) by one column per bracket term
    const hw = 92, cw = 184, hh0 = 54, ch = 100, GW = hw + cw * A.length, gx = Math.round((W - GW) / 2), gy = 170;
    const gt = add(stage, h('div', 'u4l1-gt c', 'area model'), gx + GW / 2, gy - 18); hide(gt);
    const gg = (x, y, w, hh, cls, html) => { const e = add(stage, box(h('div', 'u4l1-gg ' + cls, html), w, hh), x, y); hide(e); return e; };
    const corner = gg(gx, gy, hw, hh0, 'hd x', K('\\times'));
    const heads = A.map((t, k) => gg(gx + hw + k * cw, gy, cw, hh0, 'hd', `<span>${K(termT(t, true))}</span>`));
    const side = gg(gx, gy + hh0, hw, ch, 'hd', `<span>${K(termT(g, true))}</span>`);
    const gc = cells.map((p, k) => { const e = gg(gx + hw + k * cw, gy + hh0, cw, ch, 'in' + (p.n < 0 ? ' neg' : ''), `<span>${K(termT(p, true))}</span>`); e.style.setProperty('--pc', PCOL[k % 4]); e.firstChild.style.opacity = 0; return e; });
    const hdrs = [...heads, side], hdrHTML = hdrs.map((e) => e.innerHTML);
    const gT = termT(g, true);
    return [{
      cap: `Start with the product ${T(prodT)}. As an <b>area model</b>, it’s a rectangle ${T(gT)} tall and ${T(polyT(A))} wide.`,
      run: (c) => Promise.all([c.fadeIn(L, 400), c.fadeIn(gt, 300, { delay: 150 }), c.fadeIn(corner, 300, { delay: 150 }), ...hdrs.map((e, i) => c.pop(e, 360, { delay: 200 + i * 90 })), ...gc.map((e) => c.fadeIn(e, 300, { delay: 300 }))])
    }, {
      cap: `<b>Expand:</b> multiply the side by <b>each</b> term on top. ${listAnd(cells.map((p, i) => T(`${fT(g)}\\cdot ${fT(A[i])}=${termT(p, true)}`)))}.`,
      run: (c) => Promise.all(gc.map((e, i) => Promise.all([c.anim(e.firstChild, [{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], 380, { delay: i * 260 }), c.sleep(i * 260).then(() => e.classList.add('on'))])))
    }, {
      cap: `So ${T(`${prodT}=${resT}`)}. Expanding turned a <b>product</b> into a <b>sum of terms</b>.`,
      run: (c) => Promise.all([up.draw(c), c.fadeIn(upL, 300), c.fadeIn(R, 450, { delay: 350 })])
    }, {
      cap: `<b>Factoring runs it backwards.</b> Suppose you’re only given ${T(resT)}. The pieces are known, but the <b>sides are hidden</b>. What were they?`,
      run: async (c) => {
        Lx.innerHTML = '<span class="u4l1-q">?</span>'; L.classList.add('blank');
        hdrs.forEach((e) => { e.innerHTML = '<span class="u4l1-q">?</span>'; });
        await Promise.all([pulse(c, R, 1.05), ...hdrs.map((e) => c.pop(e, 320))]);
      }
    }, {
      cap: `Both pieces share the side ${T(gT)}: it’s a <b>common factor</b>. Find the sides and you’ve factored: ${T(`${resT}=${prodT}`)}.` + (key === 'w' ? ' That’s the warm-up’s 12 and 18 tiles, stretched!' : ''),
      run: async (c) => {
        hdrs.forEach((e, i) => { e.innerHTML = hdrHTML[i]; e.classList.add('found'); });
        Lx.innerHTML = K(prodT); L.classList.remove('blank'); L.classList.add('found');
        await Promise.all([dn.draw(c), c.fadeIn(dnL, 300), ...hdrs.map((e, i) => c.pop(e, 360, { delay: i * 90 })), c.pop(Lx, 420, { delay: 250 })]);
      }
    }];
  }
};

/* ============ 1. Read the fact backwards (Example 1) ============ */
const FL = { d: '4(x+3)', a: '3(x+4)', b: '8(y-1)', c: 'x(x+9)', e: '4x(x-5)' };
const flip = {
  title: 'Read the multiplying fact backwards',
  height: 400,
  choices: [{ v: 'd', label: tex(FL.d) }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'e', label: '(d)' }],
  intro: (k) => `Use the multiplying fact for ${T(FL[k])} to write a <b>factoring</b> fact.`,
  make(stage, key, ex) {
    const W = ex.W, { g, br } = splitProd(FL[key]), prods = br.map((q) => mulT(g, q)), resT = polyT(collect(prods)), gT = termT(g, true), brT = polyT(br), prodT = FL[key];
    const mid = W / 2, eqY = 92;
    const head1 = add(stage, h('div', 'u4l1-flh c', 'multiplying fact'), mid, 30), head2 = add(stage, h('div', 'u4l1-flh c amb', 'factoring fact'), mid, 30); hide(head2);
    const Lf = add(stage, h('div', 'u4l1-fle', K(prodT)), 0, eqY), Rf = add(stage, h('div', 'u4l1-fle', K(resT)), 0, eqY), eq = add(stage, h('div', 'u4l1-fle c', K('=')), mid, eqY);
    const Ll = add(stage, h('div', 'u4l1-fll', 'product of factors'), 0, eqY + 46), Rl = add(stage, h('div', 'u4l1-fll', 'sum of terms'), 0, eqY + 46);
    [Lf, Rf].forEach((e) => (e.style.translate = '0 -50%')); eq.style.translate = '-50% -50%';
    const lw = Lf.offsetWidth, rw = Rf.offsetWidth, gap = 34;
    at(Lf, mid - gap - lw, eqY); at(Rf, mid + gap, eqY);
    const llw = Ll.offsetWidth, rlw = Rl.offsetWidth;
    at(Ll, mid - gap - lw / 2 - llw / 2, eqY + 46); at(Rl, mid + gap + rw / 2 - rlw / 2, eqY + 46);
    hide(Lf, Rf, eq, Ll, Rl);
    // after the swap the sum sits on the left and the product on the right
    const dR = (mid - gap - rw) - (mid + gap), dL = (mid + gap) - (mid - gap - lw);
    // the booklet's blanks
    const tY = 230;
    const blank = (inner, cls) => `<span class="u4l1-blk ${cls}"><span class="u4l1-bv">${inner}</span></span>`;
    const brHTML = br.map((q, i) => `<span class="u4l1-bt u4l1-bt${i}">${K(termT(q, i === 0))}</span>`).join('');
    const tpl = add(stage, h('div', 'u4l1-tpl', `<span class="u4l1-tlab">so</span>${K(resT + '=')}${blank(`<span class="u4l1-bg">${K(gT)}</span>`, 'g')}${K('(')}${blank(brHTML, 'b')}${K(')')}`), 0, tY);
    tpl.style.translate = '0 -50%'; at(tpl, mid - tpl.offsetWidth / 2, tY); hide(tpl);
    const vals = spans(tpl, 'u4l1-bv'); hide(...vals);
    const svg = arcLayer(stage);
    const chkY = 330;
    const chk = add(stage, h('div', 'u4l1-chk c', '<span class="u4l1-tlab">check</span>' + prods.map((p, i) => `<span class="u4l1-chp">${K(tc(PCOL[i], `${fT(g)}\\cdot ${fT(br[i])}=${termT(p, true)}`))}</span>`).join('') + '<span class="u4l1-chok">✓</span>'), mid, chkY);
    const chps = spans(chk, 'u4l1-chp'), chok = spans(chk, 'u4l1-chok'); hide(...chps, ...chok);
    const chkLab = chk.querySelector('.u4l1-tlab'); hide(chkLab);
    return [{
      cap: `A <b>multiplying</b> fact: ${T(`${prodT}=${resT}`)}. The left side is a <b>product of factors</b>; the right side is a <b>sum of terms</b>.`,
      run: (c) => Promise.all([c.fadeIn(Lf, 400), c.fadeIn(eq, 300, { delay: 200 }), c.fadeIn(Rf, 400, { delay: 350 }), c.fadeIn(Ll, 300, { delay: 600 }), c.fadeIn(Rl, 300, { delay: 700 })])
    }, {
      cap: `<b>Read it backwards:</b> swap the two sides. ${T(`${resT}=${prodT}`)} starts with the <b>terms</b> and ends with the <b>factors</b>. That’s a <b>factoring</b> fact.`,
      run: (c) => Promise.all([
        c.anim(Lf, [{ transform: 'translateX(0)' }, { transform: `translateX(${dL}px) translateY(-34px)`, offset: 0.5 }, { transform: `translateX(${dL}px)` }], 900),
        c.anim(Ll, [{ transform: 'translateX(0)' }, { transform: `translateX(${dL}px)` }], 900),
        c.anim(Rf, [{ transform: 'translateX(0)' }, { transform: `translateX(${dR}px) translateY(34px)`, offset: 0.5 }, { transform: `translateX(${dR}px)` }], 900),
        c.anim(Rl, [{ transform: 'translateX(0)' }, { transform: `translateX(${dR}px)` }], 900),
        c.anim(head1, [{ opacity: 1 }, { opacity: 0 }], 300), c.anim(head2, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: 600 })])
    }, {
      cap: `Fill the blanks: the factor out front is ${T(gT)}, and the bracket holds ${T(brT)}.`,
      run: async (c) => { await c.fadeIn(tpl, 350); await c.pop(vals[0], 380); await c.pop(vals[1], 380); }
    }, {
      cap: `<b>Check by expanding:</b> ${listAnd(prods.map((p, i) => T(`${fT(g)}\\cdot ${fT(br[i])}=${termT(p, true)}`)))}. That’s ${T(resT)} again ✓`,
      run: async (c) => {
        const gEl = tpl.querySelector('.u4l1-bg'), a = stagePos(stage, gEl);
        await c.fadeIn(chkLab, 200);
        for (let i = 0; i < br.length; i++) {
          const tEl = tpl.querySelector('.u4l1-bt' + i), b = stagePos(stage, tEl);
          tEl.style.color = PCOL[i];
          await arrow(svg, a.x, a.t - 2, b.x, b.t - 2, Math.min(56, 26 + Math.abs(b.x - a.x) * 0.3), PCOL[i]).draw(c, 420);
          await c.pop(chps[i], 340);
        }
        await c.pop(chok[0], 340);
      }
    }];
  }
};

/* ============ 2–3. Line up the prime factors (why the GCF works) ============ */
const CO = { n0: ['12', '18'], a2: ['10', '15'], b2: ['8', '20'], c2: ['9', '24'], d2: ['16', '28'], m0: ['6x^3', '9x^2'], a3: ['4a^2', '10a'], b3: ['12x^2y', '8xy^2'], c3: ['15m^3n^2', '25m^2n'], d3: ['9p^2q^2', '6pq^3'] };
function factorList(t) {
  const out = [];
  if (Math.abs(t.n) > 1) primeFactors(Math.abs(t.n)).forEach((p) => out.push(String(p)));
  Object.keys(t.v).sort().forEach((k) => { for (let i = 0; i < t.v[k]; i++) out.push(k); });
  return out;
}
function makeColumns(title, choices) {
  return {
    title, height: 372, choices,
    intro: (k) => `Find the GCF of ${listAnd(CO[k].map((s) => T(termT(parseTerm(s), true))))} by taking each one apart into <b>prime factors</b>.`,
    make(stage, key, ex) {
      const W = ex.W, terms = CO[key].map(parseTerm), lists = terms.map(factorList), nr = terms.length;
      const keys = [...new Set(lists.flat())].sort((p, q) => { const r = (s) => (/\d/.test(s) ? 1 : 2); return r(p) - r(q) || (r(p) === 1 ? +p - +q : p < q ? -1 : 1); });
      const cols = []; keys.forEach((k) => { const mx = Math.max(...lists.map((l) => l.filter((x) => x === k).length)); for (let j = 0; j < mx; j++) cols.push({ k, j }); });
      const x0 = 200, cw = Math.min(62, (W - x0 - 18) / cols.length), cs = Math.min(50, cw - 6), cx = (i) => x0 + cw * (i + 0.5);
      const rowY = (i) => 40 + i * 66, sepY = rowY(nr) - 22, gY = sepY + 48;
      const full = cols.map((col) => lists.every((l) => l.filter((x) => x === col.k).length > col.j));
      const bands = cols.map((col, i) => { if (!full[i]) return null; const b = add(stage, box(h('div', 'u4l1-band'), cw - 2, gY + 30 - (rowY(0) - 30)), cx(i) - (cw - 2) / 2, rowY(0) - 30); hide(b); return b; });
      terms.forEach((t, i) => { const e = add(stage, h('div', 'u4l1-clab', K(termT(t, true)) + `<span>${K('=')}</span>`), 22, rowY(i)); e.style.translate = '0 -50%'; e.style.width = (x0 - 30) + 'px'; });
      const chip = (k, x, y, cls = '') => add(stage, box(h('div', 'u4l1-fc c ' + cls + (/\d/.test(k) ? ' num' : ' var'), /\d/.test(k) ? k : K(k)), cs, cs), x, y);
      const placed = lists.map((l, r) => { const seen = {}; return l.map((k, j) => { const occ = seen[k] = (seen[k] || 0) + 1; const ci = cols.findIndex((c2) => c2.k === k && c2.j === occ - 1); const e = chip(k, cx(j), rowY(r)); hide(e); return { e, ci, j }; }); });
      const slots = []; lists.forEach((l, r) => cols.forEach((col, i) => { if (l.filter((x) => x === col.k).length <= col.j) { const s = add(stage, box(h('div', 'u4l1-slot c'), cs, cs), cx(i), rowY(r)); hide(s); slots.push(s); } }));
      const sep = add(stage, box(h('div', 'u4l1-sep'), W - 44, 0), 22, sepY); hide(sep);
      const gLab = add(stage, h('div', 'u4l1-clab g', 'GCF'), 22, gY); gLab.style.translate = '0 -50%'; hide(gLab);
      const commonIdx = cols.map((c2, i) => i).filter((i) => full[i]);
      const gcf = gcfOf(terms), gcfT = termT(gcf, true);
      const prodT = commonIdx.map((i) => cols[i].k).join('\\times ');
      const resEl = add(stage, h('div', 'u4l1-cres', K(`\\text{GCF}=${commonIdx.length > 1 ? prodT + '=' : ''}\\boldsymbol{${gcfT}}`)), 22, gY + 52); hide(resEl);
      const gChips = commonIdx.map((i) => { const e = chip(cols[i].k, cx(i), gY, 'common'); hide(e); return e; });
      const isNum = terms.every((t) => !Object.keys(t.v).length);
      const written = terms.map((t, i) => T(`${termT(t, true)}=${lists[i].join('\\times ')}`));
      const nShared = (k) => commonIdx.filter((i) => cols[i].k === k).length;
      const sharedWords = [...new Set(commonIdx.map((i) => cols[i].k))].map((k) => { const n = nShared(k), w = ['', 'one', 'two', 'three', 'four'][n] || n; return `${w} ${T(k)}${n > 1 ? '’s' : ''}`; });
      return [{
        cap: nr === 2 && cols.length <= 10 ? `Write each as a product of <b>prime factors</b>: ${written.join(' and ')}.` : `Write each as a product of <b>prime factors</b>. Letters count as factors too: ${T('x^3=x\\times x\\times x')}.`,
        run: (c) => Promise.all(placed.flatMap((row, r) => row.map(({ e }, j) => c.pop(e, 320, { delay: r * 200 + j * 45 }))))
      }, {
        cap: `<b>Line them up:</b> matching factors go in the <b>same column</b>. An empty slot means that ${isNum ? 'number' : 'monomial'} doesn’t have that factor.`,
        run: (c) => Promise.all([...placed.flatMap((row) => row.map(({ e, ci, j }) => c.anim(e, [{ transform: 'translateX(0)' }, { transform: `translateX(${cx(ci) - cx(j)}px)` }], 650, { delay: 40 }))), ...slots.map((s) => c.fadeIn(s, 300, { delay: 600 }))])
      }, {
        cap: `A column with a factor in <b>every</b> row is <b>shared</b>: ${listAnd(sharedWords)}.`,
        run: async (c) => {
          await Promise.all(bands.filter(Boolean).map((b, i) => c.fadeIn(b, 350, { delay: i * 60 })));
          placed.flat().forEach(({ e, ci }) => { if (full[ci]) e.classList.add('common'); });
          await Promise.all(placed.flat().filter(({ ci }) => !full[ci]).map(({ e }) => c.anim(e, [{ opacity: 1 }, { opacity: 0.32 }], 350)));
        }
      }, {
        cap: `Multiply the shared factors: GCF ${T(`=${commonIdx.length > 1 ? prodT + '=' : ''}${gcfT}`)}.` + (key === 'n0' ? ' That’s the warm-up’s <b>tallest height</b>: 6!' : key === 'm0' ? ' One 3 and two x’s.' : ''),
        run: async (c) => {
          await Promise.all([c.fadeIn(sep, 300), c.fadeIn(gLab, 300)]);
          await Promise.all(commonIdx.map((i, q) => c.anim(gChips[q], [{ opacity: 0, transform: `translateY(${rowY(nr - 1) - gY}px)` }, { opacity: 1, transform: 'none' }], 600, { delay: q * 90 })));
          await c.fadeIn(resEl, 400);
        }
      }];
    }
  };
}
const columnsN = makeColumns('Line up the prime factors', [{ v: 'n0', label: '12 and 18' }, { sep: 'Example 2 check:' }, { v: 'a2', label: '(a)' }, { v: 'b2', label: '(b)' }, { v: 'c2', label: '(c)' }, { v: 'd2', label: '(d)' }]);
const columnsM = makeColumns('Letters are factors too', [{ v: 'm0', label: tex('6x^3,\\ 9x^2') }, { sep: 'Example 3 check:' }, { v: 'a3', label: '(a)' }, { v: 'b3', label: '(b)' }, { v: 'c3', label: '(c)' }, { v: 'd3', label: '(d)' }]);

/* ============ 3. The shortcut: GCF of the numbers, lowest power of each letter ============ */
const LO = { m0: ['6x^3', '9x^2'], a: ['4a^2', '10a'], b: ['12x^2y', '8xy^2'], c: ['15m^3n^2', '25m^2n'], d: ['9p^2q^2', '6pq^3'] };
const lowest = {
  title: 'The shortcut: GCF of the numbers, lowest power of each letter',
  height: 312,
  minW: 760,
  choices: [{ v: 'm0', label: tex('6x^3,\\ 9x^2') }, { sep: 'Example 3 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }, { v: 'd', label: '(d)' }],
  intro: (k) => `Find the GCF of ${listAnd(LO[k].map((s) => T(s)))} by inspection, one piece at a time.`,
  make(stage, key, ex) {
    const W = ex.W, terms = LO[key].map(parseTerm), nr = terms.length;
    const vars = [...new Set(terms.flatMap((t) => Object.keys(t.v)))].sort();
    const cw = 40, lw = 190;
    let x = lw;
    const blocks = [];
    blocks.push({ kind: 'num', x, w: 104 }); x += 116;
    vars.forEach((k) => { const mx = Math.max(...terms.map((t) => t.v[k] || 0)); const w = Math.max(mx * cw, 64) + 22; blocks.push({ kind: 'var', k, x, w, mx }); x += w + 12; });
    const off = Math.max(0, (W - x - 20) / 2); blocks.forEach((b) => (b.x += off));
    const rowY = (i) => 86 + i * 56, lineY = rowY(nr) - 22, resY = lineY + 38;
    blocks.forEach((b) => { b.bg = add(stage, box(h('div', 'u4l1-blk2'), b.w, resY + 28 - 54), b.x, 54); add(stage, h('div', 'u4l1-lh c', b.kind === 'num' ? 'number' : K(b.k)), b.x + b.w / 2, 34); });
    terms.forEach((t, i) => { const e = add(stage, h('div', 'u4l1-llab', K(termT(t, true))), 22 + off, rowY(i)); e.style.translate = '0 -50%'; });
    const cells = terms.map((t, i) => blocks.map((b) => {
      const y = rowY(i);
      if (b.kind === 'num') return [add(stage, h('div', 'u4l1-lv c', String(Math.abs(t.n))), b.x + b.w / 2, y)];
      const e = t.v[b.k] || 0;
      if (!e) return [add(stage, h('div', 'u4l1-lnone c', 'none'), b.x + 11 + Math.max(64, b.mx * cw) / 2 + 4, y)];
      return Array.from({ length: e }, (_, j) => add(stage, box(h('div', 'u4l1-lc c', K(b.k)), cw - 6, cw - 6), b.x + 11 + cw * (j + 0.5), y));
    }));
    cells.flat(2).forEach((e) => hide(e));
    const line = add(stage, box(h('div', 'u4l1-sep'), x - lw + 4, 0), lw - 2 + off, lineY); hide(line);
    const gl = add(stage, h('div', 'u4l1-llab g', 'GCF'), 22 + off, resY); gl.style.translate = '0 -50%'; hide(gl);
    const gcf = gcfOf(terms), gcfT = termT(gcf, true), g = gcf.n;
    const res = blocks.map((b) => {
      let html;
      if (b.kind === 'num') html = String(g);
      else { const m = Math.min(...terms.map((t) => t.v[b.k] || 0)); b.min = m; html = m ? K(m > 1 ? `${b.k}^{${m}}` : b.k) : '—'; }
      const e = add(stage, h('div', 'u4l1-lres c' + ((b.kind === 'var' && !b.min) || (b.kind === 'num' && g === 1) ? ' none' : ''), html), b.x + b.w / 2, resY); hide(e); return e;
    });
    const fin = add(stage, h('div', 'u4l1-cres', K(`\\text{GCF}=\\boldsymbol{${gcfT}}`)), 22 + off, resY + 34); hide(fin);
    const steps = [{
      cap: `One monomial per row. Split each into its <b>number</b> and its <b>letters</b>, written out as repeated factors so the powers are easy to compare.`,
      run: (c) => Promise.all([c.fadeIn(line, 300), c.fadeIn(gl, 300), ...cells.flatMap((row, i) => row.flat().map((e, j) => c.pop(e, 300, { delay: i * 160 + j * 30 })))])
    }];
    const nums = terms.map((t) => Math.abs(t.n));
    steps.push({
      cap: `<b>The numbers:</b> the GCF of ${listAnd(nums.map(String))} is ${g}.` + (g === 1 ? ' A GCF of 1 isn’t written in front.' : ''),
      run: (c) => { blocks[0].bg.classList.add('on'); return c.pop(res[0], 380); }
    });
    blocks.forEach((b, bIdx) => {
      if (b.kind !== 'var') return;
      const es = terms.map((t) => t.v[b.k] || 0), m = Math.min(...es);
      steps.push({
        cap: `${T(b.k)}: the powers are ${listAnd(es.map((e) => T(e > 1 ? `${b.k}^{${e}}` : b.k)))}. Both terms have at least ${T(m > 1 ? `${b.k}^{${m}}` : b.k)}: take the <b>lowest</b> power.`,
        run: async (c) => {
          b.bg.classList.add('on');
          const cut = add(stage, box(h('div', 'u4l1-cut'), 0, rowY(nr - 1) + 26 - (rowY(0) - 26)), b.x + 11 + cw * m - 1, rowY(0) - 26);
          await c.anim(cut, [{ opacity: 0, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1)' }], 400);
          const exs = []; cells.forEach((row) => row[bIdx].forEach((e, j) => { if (j >= m && e.classList.contains('u4l1-lc')) exs.push(e); }));
          await Promise.all([...exs.map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0.25 }], 350)), c.pop(res[bIdx], 380, { delay: 150 })]);
        }
      });
    });
    steps.push({
      cap: `Put the pieces together: GCF ${T('=' + gcfT)}.`,
      run: (c) => Promise.all([c.fadeIn(fin, 400), ...res.map((e) => pulse(c, e, 1.15))])
    });
    return steps;
  }
};

/* ============ 4. Check by expanding (Example 4) ============ */
const CK = {
  d1: { poly: '3x+9', g: '3', br: 'x+3' }, d2: { poly: '4x+8', g: '4', br: 'x+3' },
  a: { poly: '4x+12', g: '4', br: 'x+3' }, b: { poly: '5x+15', g: '5', br: 'x+2' }, c: { poly: '3x^2+6x', g: '3x', br: 'x+2' }, d: { poly: '8x+10', g: '2', br: '4x+6' }
};
const checkIt = {
  title: 'Is it correct? Expand it and compare',
  height: 400,
  minW: 760,
  choices: [{ v: 'd1', label: tex('3(x+3)') }, { v: 'd2', label: tex('4x+8\\overset{?}{=}4(x+3)') }, { sep: 'Example 4 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => { const d = CK[k]; return `Is ${T(`${polyT(parsePoly(d.poly))}=${d.g}(${d.br})`)} correct? Expand the right side and compare.`; },
  make(stage, key, ex) {
    const W = ex.W, d = CK[key], P = parsePoly(d.poly), g = parseTerm(d.g), Bq = parsePoly(d.br), prods = Bq.map((q) => mulT(g, q));
    const pT = polyT(P), gT = termT(g, true), expT = polyT(collect(prods));
    add(stage, h('div', 'u4l1-who', 'the claim'), 30, 18);
    const claimSrc = `\\htmlClass{u4l1-fo}{${pT}}\\overset{?}{=}\\htmlClass{u4l1-fg}{${gT}}(` + Bq.map((q, i) => `\\htmlClass{u4l1-fb${i}}{${termT(q, i === 0)}}`).join('') + ')';
    const claim = add(stage, h('div', 'u4l1-claim', K(claimSrc)), 30, 104); claim.style.translate = '0 -50%';
    const svg = arcLayer(stage);
    const expL = add(stage, h('div', 'u4l1-plab', 'expands to'), 30, 192); expL.style.translate = '0 -50%';
    const expSrc = prods.map((p, i) => `\\htmlClass{u4l1-fp${i}}{${tc(PCOL[i], termT(p, i === 0))}}`).join('');
    const exp = add(stage, h('div', 'u4l1-claim sm', K(expSrc)), 170, 192); exp.style.translate = '0 -50%';
    const pSpans = prods.map((p, i) => spans(exp, 'u4l1-fp' + i)); hide(expL, ...pSpans.flat());
    const same = expT === polyT(collect(P));
    const bad = prods.map((p, i) => termT(p, true) !== termT(P[i], true));
    const verd = add(stage, h('div', 'u4l1-verd ' + (same ? 'ok' : 'no'), same ? `✓ matches ${K(pT)}` : `✗ the original is ${K(pT)}`), 170, 244); verd.style.translate = '0 -50%'; hide(verd);
    const stamp = add(stage, h('div', 'u4l1-stamp ' + (same ? 'ok' : 'no'), same ? 'CORRECT<small>it expands back ✓</small>' : 'INCORRECT<small>doesn’t expand back</small>'), W - 26, 164); stamp.style.translate = '-100% 0'; hide(stamp);
    const Q = P.map((t) => divT(t, g)), fixT = `${gT}(${polyT(Q)})`;
    const fixL = add(stage, h('div', 'u4l1-plab ok', 'correct form'), 30, 318); fixL.style.translate = '0 -50%';
    const fixE = add(stage, h('div', 'u4l1-claim sm ok', K(`${pT}=\\boldsymbol{${fixT}}`)), 170, 318); fixE.style.translate = '0 -50%';
    const fixC = add(stage, h('div', 'u4l1-fixc', 'check: ' + K(Q.map((q, i) => `${fT(g)}\\cdot ${fT(q)}=${termT(P[i], true)}`).join(',\\ \\ ')) + ' ✓'), 170, 366); fixC.style.translate = '0 -50%';
    hide(fixL, fixE, fixC);
    const bi = bad.findIndex(Boolean);
    const steps = [{
      cap: `<b>Expand:</b> multiply ${T(gT)} by <b>each</b> term in the bracket. ${listAnd(prods.map((p, i) => T(`${fT(g)}\\cdot ${fT(Bq[i])}=${termT(p, true)}`)))}.`,
      run: async (c) => {
        const gEl = spans(claim, 'u4l1-fg')[0], a = stagePos(stage, gEl);
        await c.fadeIn(expL, 250);
        for (let i = 0; i < Bq.length; i++) {
          const b = stagePos(stage, spans(claim, 'u4l1-fb' + i)[0]), dx = Math.abs(b.x - a.x);
          spans(claim, 'u4l1-fb' + i).forEach((e) => (e.style.color = PCOL[i]));
          await arrow(svg, a.x, a.t - 2, b.x, b.t - 2, Math.min(60, 28 + dx * 0.25), PCOL[i]).draw(c, 420);
          await showSpans(c, pSpans[i], 320);
        }
      }
    }, {
      cap: same ? `${T(expT)} is <b>exactly</b> the original ${T(pT)}. The factoring is <b>correct</b> ✓`
        : `${T(expT)} is <b>not</b> the original ${T(pT)}: ${T(termT(prods[bi], true))} should be ${T(termT(P[bi], true))}. The factoring is <b>incorrect</b>.`,
      run: async (c) => {
        await c.fadeIn(verd, 300);
        if (same) spans(claim, 'u4l1-fo').forEach((e) => e.classList.add('u4l1-okhl'));
        else pSpans.forEach((ss, i) => { if (bad[i]) ss.forEach((e) => e.classList.add('u4l1-bad')); });
        await stampIn(c, stamp);
      }
    }];
    if (!same) steps.push({
      cap: `Fix it: divide <b>each</b> term by ${T(gT)}. ${listAnd(P.map((t, i) => T(`${termT(t, true)}\\div ${fT(g)}=${termT(Q[i], true)}`)))}, so ${T(`${pT}=${fixT}`)} ✓`,
      run: (c) => Promise.all([c.fadeIn(fixL, 300), c.fadeIn(fixE, 400), c.fadeIn(fixC, 400, { delay: 300 })])
    });
    return steps;
  }
};

/* ============ 5. Tiles into a rectangle: the tallest side is the GCF ============ */
const TR = { s: { a: 2, b: 10, q: false }, n: { a: 6, b: 18, q: false }, a: { a: 4, b: 8, q: false }, b: { a: 9, b: 12, q: false }, c: { a: 6, b: 8, q: true } };
const trPoly = (d) => (d.q ? `${d.a}x^2+${d.b}x` : `${d.a}x+${d.b}`);
const tileRect = {
  title: 'Factoring with tiles: build a rectangle',
  height: 450,
  minW: 900,
  choices: [{ v: 's', label: tex(trPoly(TR.s)) }, { v: 'n', label: tex(trPoly(TR.n)) }, { sep: 'Example 5 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  intro: (k) => { const d = TR[k]; return `Here are the tiles for ${T(trPoly(d))}: ${d.a} ${T(d.q ? 'x^2' : 'x')}-tiles and ${d.b} ${d.q ? T('x') + '-tiles' : 'unit tiles'}. <b>Factoring</b> means arranging them into one <b>rectangle</b>: its side lengths are the factors.`; },
  make(stage, key, ex) {
    const W = ex.W, d = TR[key], G = 3;
    const pw = 236, ax = 24, aw = W - pw - 60, ay = 70, ah = 290;
    // tile sizes: the one-long-row rectangle has to fit across the work area
    const kU = d.q ? 0.27 : 0.26, room = aw - 70 - G * (d.a + d.b);
    const X = Math.max(40, Math.min(d.q ? 64 : 100, Math.floor(room / (d.a + kU * d.b)))), U = Math.max(11, Math.round(X * kU));
    const bw = X, bh = d.q ? X : U, sw = U, sh = d.q ? X : U, rowH = d.q ? X : U;
    const bigK = d.q ? 'k2' : 'k1', smK = d.q ? 'k1' : 'k0';
    const panel = add(stage, h('div', 'u4l1-rt', '<div class="u4l1-rth">Rows tried</div>'), W - pw - 18, 16);
    box(panel, pw, 404 - 16); const list = h('div', 'u4l1-rtl'); panel.appendChild(list); const sum = h('div', 'u4l1-rts'); panel.appendChild(sum);
    const tiles = [];
    const mk = (big, i) => {
      const t = h('div', `u4l1-tile ${big ? bigK : smK} pos`); box(t, big ? bw : sw, big ? bh : sh); t.big = big;
      const n = big ? d.a : d.b, w1 = big ? bw : sw, sp = Math.min(w1 + (big ? 26 : 22), (aw - 20) / n), rowW = n * sp;
      const x = ax + (aw - rowW) / 2 + i * sp + ((i * 7) % 5) - 2;
      const y = (big ? ay + 6 : ay + bh + 50) + ((i * 13) % 9) - 4, r = Math.round(Math.abs((Math.sin((i + (big ? 0 : 50)) * 12.9898) * 43758.5453) % 1) * 22 - 11);
      t._t = `translate(${x}px, ${y}px) rotate(${r}deg)`; t.style.transform = t._t; stage.appendChild(t); tiles.push(t);
    };
    for (let i = 0; i < d.a; i++) mk(true, i);
    for (let i = 0; i < d.b; i++) mk(false, i);
    const sideL = add(stage, h('div', 'u4l1-tl'), 0, 0), topL = add(stage, h('div', 'u4l1-tl c'), 0, 0), leftL = add(stage, h('div', 'u4l1-tl red c'), 0, 0);
    const outline = add(stage, h('div', 'u4l1-trect'), 0, 0);
    hide(sideL, topL, leftL, outline);
    const sideT = (r) => (r === 1 ? (d.q ? 'x' : '1') : d.q ? `${r}x` : String(r));
    const widT = (r) => polyT([{ n: d.a / r, d: 1, v: { x: 1 } }, { n: d.b / r, d: 1, v: {} }].map(norm));
    async function arrange(c, r) {
      const nb = Math.floor(d.a / r), ns = Math.floor(d.b / r), lb = d.a - nb * r, ls = d.b - ns * r;
      const rw = nb * (bw + G) + ns * (sw + G) - G, rh = r * (rowH + G) - G, extra = lb || ls ? 30 + Math.max(lb ? bw : 0, ls ? (Math.ceil(ls / Math.max(1, Math.floor(rh / (sh + G)))) * (sw + G)) : 0) : 0;
      const x0 = ax + (aw - rw - extra) / 2 + 30, y0 = ay + (ah - rh) / 2 + 16;
      let bi = 0, si = 0, lbi = 0, lsi = 0;
      const jobs = tiles.map((t, i) => {
        let x, y, left = false;
        if (t.big) { if (bi < nb * r) { const row = Math.floor(bi / nb), k = bi % nb; x = x0 + k * (bw + G); y = y0 + row * (rowH + G); } else { left = true; x = x0 + rw + 30; y = y0 + lbi * (bh + G); lbi++; } bi++; }
        else { if (si < ns * r) { const row = Math.floor(si / ns), k = si % ns; x = x0 + nb * (bw + G) + k * (sw + G); y = y0 + row * (rowH + G); } else { left = true; const per = Math.max(1, Math.floor((rh + G) / (sh + G))); x = x0 + rw + 30 + (lb ? bw + 12 : 0) + Math.floor(lsi / per) * (sw + G); y = y0 + (lsi % per) * (sh + G); lsi++; } si++; }
        const to = `translate(${x}px, ${y}px) rotate(0deg)`, from = t._t; t._t = to;
        t.classList.toggle('left', left);
        return c.anim(t, [{ transform: from }, { transform: to }], 620, { delay: Math.min(i * 14, 280) });
      });
      const ok = !lb && !ls;
      outline.classList.remove('final');
      at(box(outline, rw + 12, rh + 12), x0 - 6, y0 - 6);
      if (ok) {
        sideL.innerHTML = K(sideT(r)); at(sideL, x0 - 16, y0 + rh / 2); sideL.style.translate = '-100% -50%';
        topL.innerHTML = K(widT(r)); at(topL, x0 + rw / 2, y0 - 30);
      } else { leftL.innerHTML = 'left over'; at(leftL, x0 + rw + 30 + (extra - 30) / 2, y0 + rh + 22); }
      sideL.classList.remove('ok'); topL.classList.remove('ok');
      await Promise.all([...jobs,
        c.anim(sideL, [{ opacity: sideL.style.opacity || 0 }, { opacity: ok ? 1 : 0 }], 300, { delay: 420 }),
        c.anim(topL, [{ opacity: topL.style.opacity || 0 }, { opacity: ok ? 1 : 0 }], 300, { delay: 420 }),
        c.anim(outline, [{ opacity: outline.style.opacity || 0 }, { opacity: ok ? 1 : 0 }], 300, { delay: 480 }),
        c.anim(leftL, [{ opacity: leftL.style.opacity || 0 }, { opacity: ok ? 0 : 1 }], 300, { delay: 450 })]);
    }
    const g = gcdI(d.a, d.b), poly = trPoly(d), bigN = d.q ? T('x^2') + '-tiles' : T('x') + '-tiles', smN = d.q ? T('x') + '-tiles' : 'unit tiles';
    const steps = [];
    for (let r = 1; r <= g; r++) {
      const okA = d.a % r === 0, okB = d.b % r === 0, ok = okA && okB, rr = r;
      steps.push({
        cap: r === 1 ? `<b>One long row:</b> a rectangle ${T(sideT(1))} tall and ${T(widT(1))} wide. True, but can the tiles stack into <b>more equal rows</b>?`
          : ok ? `<b>${r} equal rows</b> of ${T(widT(r))} ✓. The rectangle is ${T(sideT(r))} tall: ${T(`${poly}=${sideT(r)}(${widT(r)})`)}.` + (r < g ? ' Keep going: can we make even more rows?' : '')
            : `<b>${r} equal rows?</b> ${listAnd([!okA ? `the ${d.a} ${bigN}` : '', !okB ? `the ${d.b} ${smN}` : ''].filter(Boolean)).replace(/^the/, 'The')} don’t split into ${r} equal rows: <b class="red">left over</b> ✗.`,
        run: async (c) => {
          const row = h('div', 'u4l1-rtr ' + (ok ? 'ok' : 'no'), ok ? `${rr} ${rr > 1 ? 'rows' : 'row'} ${K(rr === 1 ? widT(1) : `${sideT(rr)}(${widT(rr)})`)} <span>✓</span>` : `${rr} rows <span>✗</span>`);
          list.appendChild(row);
          await Promise.all([arrange(c, rr), c.fadeIn(row, 300, { delay: 350 })]);
        }
      });
    }
    const gT = sideT(g), fact = `${gT}(${widT(g)})`;
    const fin = add(stage, h('div', 'u4l1-tfin c', K(`${poly}=\\boldsymbol{${fact}}`)), ax + aw / 2 + 10, 412); hide(fin);
    steps.push({
      cap: `The number of equal rows must divide <b>both</b> ${d.a} and ${d.b}, so the most is ${g}, the GCF of ${d.a} and ${d.b}. ` + (d.q ? `Each row is ${T('x')} tall, so the tallest side is ${T(gT)}. ` : `The tallest side is ${T(gT)}. `) + `${T(`${poly}=${fact}`)}.`,
      run: async (c) => {
        sum.innerHTML = `<div class="u4l1-rth">Tallest side</div><div class="u4l1-rtg">GCF ${K('=' + gT)}</div>`;
        outline.classList.add('final'); sideL.classList.add('ok');
        await Promise.all([c.fadeIn(sum, 400), pulse(c, sideL, 1.25), c.fadeIn(fin, 450, { delay: 200 })]);
      }
    });
    return steps;
  }
};

/* ============ 5. Find the GCF, divide, write, verify ============ */
const PO = { n: '6x+18', a: '4x+8', b: '9x+12', c: '6x^2+8x' };
const pull = {
  title: 'Find the GCF, divide, write, verify',
  height: 400,
  choices: [{ v: 'n', label: tex(PO.n) }, { sep: 'Example 5 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  intro: (k) => `Factor ${T(PO[k])} by removing the <b>greatest common factor</b>, then check.`,
  make(stage, key, ex) {
    const W = ex.W, P = parsePoly(PO[key]), n = P.length, g = gcfOf(P), gT = termT(g, true), Q = P.map((t) => divT(t, g));
    const pT = polyT(P), qT = polyT(Q), factT = `${gT}(${qT})`;
    const lx = 22, x0 = 182, colW = (W - x0 - 14) / n, cx = (i) => x0 + colW * (i + 0.5);
    const yA = 40, yB = 120, yC = 200, yD = 272;
    const lab = (y, t) => { const e = add(stage, h('div', 'u4l1-plab', t), lx, y); e.style.translate = '0 -50%'; return e; };
    lab(yA, 'terms'); const lC = lab(yC, 'write'), lD = lab(yD + 52, 'verify'); hide(lC, lD);
    const tA = P.map((t, i) => add(stage, h('div', 'u4l1-pt c', K(termT(t, i === 0))), cx(i), yA));
    const gBox = add(stage, h('div', 'u4l1-gbox', `<div class="u4l1-gbh">÷ GCF</div><div class="u4l1-gbv">${K(gT)}</div>`), lx, yB + 6); gBox.style.translate = '0 -50%'; hide(gBox);
    const tB = P.map((t, i) => { const e = add(stage, h('div', 'u4l1-pf c', K(`\\dfrac{${termT(t, true)}}{${gT}}\\htmlClass{u4l1-qe}{=}\\htmlClass{u4l1-qv}{${termT(Q[i], true)}}`)), cx(i), yB); fit(e, colW - 14); hide(e); return e; });
    const qe = tB.map((e) => [...spans(e, 'u4l1-qe'), ...spans(e, 'u4l1-qv')]); qe.flat().forEach((e) => hide(e));
    const cSrc = `\\htmlClass{u4l1-ce}{${pT}=}\\,\\htmlClass{u4l1-tg}{${gT}}\\htmlClass{u4l1-cb}{(}` + Q.map((q, i) => (i === 0 ? `\\htmlClass{u4l1-tq0}{${termT(q, true)}}` : `\\mathbin{\\htmlClass{u4l1-tq${i}}{${q.n < 0 ? '-' : '+'}}}\\htmlClass{u4l1-tq${i}}{${bodyT(q)}}`)).join('') + '\\htmlClass{u4l1-cb}{)}';
    const rowC = add(stage, h('div', 'u4l1-pc', K(cSrc)), x0 - 6, yC); rowC.style.translate = '0 -50%'; fit(rowC, W - x0 - 20);
    const cParts = { e: spans(rowC, 'u4l1-ce'), g: spans(rowC, 'u4l1-tg'), b: spans(rowC, 'u4l1-cb'), q: Q.map((q, i) => spans(rowC, 'u4l1-tq' + i)) };
    [...cParts.e, ...cParts.g, ...cParts.b, ...cParts.q.flat()].forEach((e) => hide(e));
    const stamp = add(stage, h('div', 'u4l1-stamp ok', 'FACTORED<small>completely ✓</small>'), W - 22, yD + 8); stamp.style.translate = '-100% 0'; hide(stamp);
    // the check: a rectangle whose side is the GCF and whose pieces are the original terms
    const pw = Math.min(200, (W - x0 - 230) / n), rx = x0 + 36, ry = yD + 22, rh2 = 82;
    const side = add(stage, h('div', 'u4l1-rsd', K(gT)), rx - 10, ry + rh2 / 2); side.style.translate = '-100% -50%'; hide(side);
    const pieces = P.map((t, i) => {
      const e = add(stage, box(h('div', 'u4l1-rp', `<span>${K(termT(t, true))}</span>`), pw, rh2), rx + i * pw, ry); e.style.setProperty('--pc', PCOL[i % 4]);
      const w = add(stage, h('div', 'u4l1-rw c', K(termT(Q[i], true))), rx + i * pw + pw / 2, ry - 16); w.style.color = PCOL[i % 4];
      hide(e, w); return { e, w };
    });
    pieces.forEach(({ e }) => fit(e.firstChild, pw - 14));
    const coefs = P.map((t) => Math.abs(t.n)), cg = g.n;
    const vlist = Object.keys(g.v).map((k) => T(g.v[k] > 1 ? `${k}^{${g.v[k]}}` : k));
    const big = coefs.slice().sort((a, b) => a - b)[0];
    return [{
      cap: `<b>1. Find the GCF.</b> The biggest number that divides ${listAnd(coefs.map(String))} is ${cg}.` + (vlist.length ? ` Every term has ${listAnd(vlist)}, so GCF ${T('=' + gT)}.` : ` No letter is in <b>every</b> term, so GCF ${T('=' + gT)}.`) + (big !== cg && big % cg === 0 && coefs.some((v) => v % big) ? ` (Not ${big}: it doesn’t divide ${coefs.find((v) => v % big)}.)` : ''),
      run: (c) => Promise.all([c.pop(gBox, 420), ...tA.map((e) => pulse(c, e, 1.08))])
    }, {
      cap: `<b>2. Divide</b> <b>every</b> term by ${T(gT)}: ${listAnd(P.map((t, i) => T(`${termT(t, true)}\\div ${fT(g)}=${termT(Q[i], true)}`)))}.`,
      run: async (c) => {
        await Promise.all(tB.map((e, i) => c.fadeIn(e, 350, { delay: i * 120 })));
        await Promise.all(qe.map((ss, i) => showSpans(c, ss, 320, 150 + i * 260)));
      }
    }, {
      cap: `<b>3. Write</b> the GCF <b>out front</b> and the answers <b>in the bracket</b>: ${T(`${pT}=${factT}`)}.`,
      run: async (c) => {
        await Promise.all([c.fadeIn(lC, 250), showSpans(c, [...cParts.e, ...cParts.b], 300)]);
        await fly(c, stage, K(gT), stagePos(stage, gBox.lastChild), stagePos(stage, cParts.g[0]), 'u4l1-flyg', 600);
        cParts.g.forEach((e) => (e.style.opacity = 1));
        await Promise.all(Q.map(async (q, i) => {
          await c.sleep(i * 150);
          await fly(c, stage, K(termT(q, i === 0)), stagePos(stage, spans(tB[i], 'u4l1-qv')[0]), stagePos(stage, cParts.q[i][cParts.q[i].length - 1]), 'u4l1-flyq', 600);
          cParts.q[i].forEach((e) => (e.style.opacity = 1));
        }));
        cParts.q.flat().forEach((e) => (e.style.opacity = 1));
      }
    }, {
      cap: `<b>4. Verify by expanding:</b> the GCF is the <b>side</b> of a rectangle; each bracket term is a <b>width</b>. ${listAnd(Q.map((q, i) => T(`${fT(g)}\\cdot ${fT(q)}=${termT(P[i], true)}`)))} ✓`,
      run: (c) => Promise.all([c.fadeIn(lD, 250), c.pop(side, 380), ...pieces.map(({ e, w }, i) => Promise.all([c.anim(e, [{ opacity: 0, transform: 'scaleX(.2)' }, { opacity: 1, transform: 'none' }], 420, { delay: 150 + i * 200 }), c.pop(w, 340, { delay: 300 + i * 200 })]))])
    }, {
      cap: `<b>Factored completely?</b> ${listAnd(Q.map((q) => T(termT(q, true))))} have no common factor except 1, so nothing more comes out ✓`,
      run: (c) => stampIn(c, stamp)
    }];
  }
};

/* ============ warm-up: How Many Rectangles? ============ */
function mountRects() {
  const host = document.getElementById('u4l1-rects'); if (!host) return;
  const VW = 640, VH = 236;
  host.innerHTML = `<svg viewBox="0 0 ${VW} ${VH}" class="u4l1-rsvg"><g class="u4l1-rg"></g></svg>
    <div class="u4l1-rctl no-ink"><span class="u4l1-rcl">Tiles:</span>${['12', '18', '24', '36', '60', '97', '100', 'both'].map((s) => `<button class="chip" type="button" data-pile="${s}">${s === 'both' ? '12 and 18' : s}</button>`).join('')}</div>
    <div class="u4l1-rctl no-ink"><span class="u4l1-rcl">Rows:</span>${Array.from({ length: 10 }, (_, i) => `<button class="chip" type="button" data-rows="${i + 1}">${i + 1}</button>`).join('')}</div>
    <div class="u4l1-rread" aria-live="polite"></div>`;
  const gEl = host.querySelector('.u4l1-rg'), read = host.querySelector('.u4l1-rread');
  let pile = '12', rows = 0;
  const found = {};
  const sq = (x, y, s, cls, i) => `<rect class="u4l1-rtile ${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(s - 2).toFixed(1)}" height="${(s - 2).toFixed(1)}" rx="${Math.min(4, s / 8).toFixed(1)}" style="animation-delay:${Math.min(i * 12, 500)}ms"/>`;
  // n tiles in r equal rows (+ leftovers) drawn in a box (x, y, w, hh); returns the svg
  function build(n, r, bx, by, bw, bh, tag) {
    const per = Math.floor(n / r), left = n - per * r, cols = Math.max(per, 1) + (left ? 1 : 0), rws = Math.max(r, left ? 1 : 0);
    const s = Math.min(40, (bw - (left ? 14 : 0)) / cols, (bh - 30) / rws);
    const W2 = per * s + (left ? 14 + s : 0), H2 = r * s, x0 = bx + (bw - W2) / 2, y0 = by + (bh - 30 - H2) / 2 + 4;
    let out = '', i = 0;
    for (let j = 0; j < r; j++) for (let k = 0; k < per; k++) out += sq(x0 + k * s, y0 + j * s, s, '', i++);
    for (let j = 0; j < left; j++) out += sq(x0 + per * s + 14, y0 + j * s, s, 'left', i++);
    if (per) out += `<rect class="u4l1-rout${left ? '' : ' ok'}" x="${(x0 - 4).toFixed(1)}" y="${(y0 - 4).toFixed(1)}" width="${(per * s + 6).toFixed(1)}" height="${(H2 + 6).toFixed(1)}" rx="5"/>`;
    out += `<text class="u4l1-rtx${left ? ' no' : ' ok'}" x="${bx + bw / 2}" y="${by + bh - 6}">${tag}</text>`;
    return out;
  }
  // a loose, tumbled pile
  function loose(n, bx, by, bw, bh) {
    const cols = Math.ceil(Math.sqrt(n * bw / bh)), rws = Math.ceil(n / cols), s = Math.min(44, bw / (cols * 1.45 + 1), bh / (rws * 1.45 + 1)), st = s * 1.45;
    let out = '';
    for (let i = 0; i < n; i++) {
      const k = i % cols, j = Math.floor(i / cols), rr = Math.sin(i * 12.9898) * 43758.5453, rot = Math.round((rr - Math.floor(rr)) * 50 - 25);
      const x = bx + (bw - cols * st) / 2 + k * st + ((i * 7) % 9) - 4, y = by + (bh - rws * st) / 2 + j * st + ((i * 13) % 11) - 5;
      out += `<g transform="rotate(${rot})" style="transform-box: fill-box; transform-origin: center"><rect class="u4l1-rtile" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(s - 3).toFixed(1)}" height="${(s - 3).toFixed(1)}" rx="3" style="animation-delay:${Math.min(i * 10, 400)}ms"/></g>`;
    }
    return out;
  }
  const word = (n, r) => { const per = Math.floor(n / r), left = n - per * r; return left ? `${r} rows of ${per}, <b class="red">${left} left over ✗</b>` : `<b class="ok">${r} rows of ${per} ✓</b>`; };
  function draw() {
    host.querySelectorAll('[data-pile]').forEach((b) => b.classList.toggle('on', b.dataset.pile === pile));
    host.querySelectorAll('[data-rows]').forEach((b) => b.classList.toggle('on', +b.dataset.rows === rows));
    if (pile === 'both') {
      if (!rows) { gEl.innerHTML = loose(12, 10, 10, 290, 210) + loose(18, 340, 10, 290, 210); read.innerHTML = 'Two piles: <b>12</b> and <b>18</b>. Pick a number of <b>rows</b> for both.'; return; }
      gEl.innerHTML = build(12, rows, 10, 4, 300, VH - 4, '12 tiles') + build(18, rows, 330, 4, 300, VH - 4, '18 tiles');
      const ok = 12 % rows === 0 && 18 % rows === 0;
      read.innerHTML = `Same height, <b>${rows} ${rows > 1 ? 'rows' : 'row'}</b>. 12: ${word(12, rows)}. 18: ${word(18, rows)}.` + (ok ? ' <b class="ok">Both work!</b>' : '');
      return;
    }
    const n = +pile;
    if (!rows) { gEl.innerHTML = loose(n, 20, 10, VW - 40, VH - 20); read.innerHTML = `<b>${n}</b> loose tiles. Pick a number of <b>rows</b> to build with. (3 rows of 4 is the same rectangle as 4 rows of 3.)`; return; }
    gEl.innerHTML = build(n, rows, 10, 6, VW - 20, VH - 6, `${n} tiles in ${rows} ${rows > 1 ? 'rows' : 'row'}`);
    const per = Math.floor(n / rows), left = n - per * rows;
    let msg = `${word(n, rows)}.`;
    if (!left) {
      const a = Math.min(rows, per), b = Math.max(rows, per), list = (found[n] = found[n] || []);
      if (!list.includes(a)) list.push(a);
      msg += rows > per ? ` That’s the ${per} × ${rows} rectangle turned.` : ` A ${rows} × ${per} rectangle.`;
      void b;
    }
    const list = (found[n] || []).slice().sort((p, q) => p - q);
    if (list.length) msg += ` <span class="u4l1-rfound">Found for ${n}: ${list.map((a) => `${a} × ${n / a}`).join(', ')}</span>`;
    read.innerHTML = msg;
  }
  host.querySelectorAll('[data-pile]').forEach((b) => b.addEventListener('click', () => { pile = b.dataset.pile; rows = 0; draw(); }));
  host.querySelectorAll('[data-rows]').forEach((b) => b.addEventListener('click', () => { rows = +b.dataset.rows; draw(); }));
  draw();
}

/* ============ section 2: a pair of factor trees to split by hand ============ */
function mountTrees() {
  const host = document.getElementById('u4l1-trees'); if (!host) return;
  const pairs = [[12, 18], [10, 15], [8, 20], [9, 24], [16, 28]];
  const ctl = h('div', 'u4l1-tctl no-ink', '<span class="u4l1-rcl">Numbers:</span>' + pairs.map((p, i) => `<button class="chip" type="button" data-tp="${i}">${p[0]} and ${p[1]}</button>`).join(''));
  const row = h('div', 'u4l1-trow'), hosts = [h('div', 'u4l1-tree'), h('div', 'u4l1-tree')];
  row.append(...hosts); host.append(ctl, row);
  const trees = hosts.map((el, i) => new FactorTree(el, { n: pairs[0][i], style: 'plain', maxSlot: 70 }));
  ctl.querySelectorAll('[data-tp]').forEach((b) => b.addEventListener('click', () => {
    const p = pairs[+b.dataset.tp]; trees.forEach((t, i) => t.setN(p[i]));
    ctl.querySelectorAll('[data-tp]').forEach((x) => x.classList.toggle('on', x === b));
  }));
  ctl.querySelector('[data-tp]').classList.add('on');
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { twoWay, flip, columnsN, columnsM, lowest, checkIt, tileRect, pull };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}

mountRects(); mountTrees(); mountExplainers();

/* ============ Stand Up Break! — GCFs and checking a factoring at the whiteboards ============ */
{
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const pf = (n) => primeFactors(n).join('\\times ');
  const VS = (v) => Object.keys(v).sort().filter((k) => v[k]).map((k) => (v[k] === 1 ? k : k + '^{' + v[k] + '}')).join('');
  const MON = (c, v) => (c === 1 && VS(v) ? '' : String(c)) + VS(v);
  // assignment 1 items stay off the whiteboards
  const HW = new Set(['8,12', '15,20', '9,21', '14,35', '16,24', '18,27', '10,15', '8,20', '9,24', '16,28', '12,18']);
  standup('u4l1', {
    intro: 'Work at your whiteboard station. Show your work, and check each other’s answers.',
    levels: {
      BEG: (r) => { // the GCF of two numbers, from prime factorizations
        let a, b;
        do { const g = r.int(2, 9); let m, n; do { m = r.int(1, 7); n = r.int(2, 9); } while (gcd(m, n) !== 1 || m === n); a = g * Math.min(m, n); b = g * Math.max(m, n); } while (b > 72 || a < 4 || primeFactors(a).length < 2 || HW.has(a + ',' + b));
        const g = gcd(a, b), pa = primeFactors(a), pb = primeFactors(b), sh = []; const rest = pb.slice();
        pa.forEach((p) => { const i = rest.indexOf(p); if (i >= 0) { sh.push(p); rest.splice(i, 1); } });
        return { text: 'Find the GCF. Write the prime factorization of each number first.', q: `${a},\\quad ${b}`,
          a: [`${a}=${pf(a)}`, `${b}=${pf(b)}`, `\\text{shared: } ${sh.join('\\times ')}\\quad\\Rightarrow\\quad\\text{GCF}=${g}`] };
      },
      PRG: (r) => { // the GCF of two monomials, by inspection
        const L = r.pick([['x'], ['a'], ['m'], ['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]), g = r.int(2, 7);
        let m, n; do { m = r.int(1, 6); n = r.int(1, 6); } while (gcd(m, n) !== 1 || (m === 1 && n === 1));
        let G, A, B;
        do { G = {}; A = {}; B = {}; L.forEach((k) => { G[k] = r.int(1, 2); const e = r.int(0, 2); if (r.chance(0.5)) { A[k] = G[k] + e; B[k] = G[k]; } else { A[k] = G[k]; B[k] = G[k] + e; } }); } while (VS(A) === VS(B));
        const tA = MON(g * m, A), tB = MON(g * n, B);
        const low = L.map((k) => VS({ [k]: G[k] })).join(',\\ ');
        return { text: 'Find the greatest common factor of the monomials.', q: `${tA},\\quad ${tB}`,
          a: [`\\text{numbers: GCF}(${g * m},\\,${g * n})=${g}`, `\\text{lowest powers: } ${low}`, `\\text{GCF}=${MON(g, G)}`] };
      },
      MAS: (r) => { // is the factoring correct? expand to check, and fix it if it isn't
        const v = r.pick(['x', 'x', 'a', 'y']), withV = r.chance(0.35), g = r.int(2, 8);
        let p, q; do { p = r.int(1, 5); q = r.int(1, 9); } while (gcd(p, q) !== 1);
        const G = withV ? MON(g, { [v]: 1 }) : String(g), first = MON(p, { [v]: 1 }), firstX = withV ? MON(g * p, { [v]: 2 }) : MON(g * p, { [v]: 1 });
        const lastX = withV ? MON(g * q, { [v]: 1 }) : String(g * q), last = withV ? MON(q, { [v]: 0 }) : String(q);
        const orig = `${firstX}+${lastX}`, right = `${G}(${first}+${last})`;
        if (r.chance(0.4)) return { text: 'Is the factoring correct? Expand to check. If it isn’t, write the correct factored form.', q: `${orig}=${right}`, a: [`${right}=${orig}`, `\\text{Same as the original: correct } \\checkmark`] };
        let w; do { w = r.int(1, 9); } while (w === q);
        const wrong = `${G}(${first}+${w})`, wExp = `${firstX}+${withV ? MON(g * w, { [v]: 1 }) : g * w}`;
        return { text: 'Is the factoring correct? Expand to check. If it isn’t, write the correct factored form.', q: `${orig}=${wrong}`,
          a: [`${wrong}=${wExp}\\neq ${orig}`, `\\text{Incorrect. } ${lastX}\\div ${G}=${last}`, `${orig}=${right}`] };
      }
    }
  });
}
