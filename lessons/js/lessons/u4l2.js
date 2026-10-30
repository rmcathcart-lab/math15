/* Math 15 · Unit 4 · Lesson 2 — Common Factors: Finding and Removing the GCF.
 * The "Party Bag Puzzle" warm-up, the explainers and the Stand Up Break on this page.
 * The find/divide/write/check explainer, the lowest-power table and the error finder are adapted from Math 10C 4.1. */
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

const BLU = '#2b55a0', AMB = '#c27a0e', PUR = '#7b4fc4', GRN = '#12805a', RED = '#c93a33';
const PCOL = [BLU, AMB, PUR, GRN];
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;

/* ============ terms: { n, v: { x: 2 } } (whole-number coefficients) ============ */
const gcdI = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const clean = (t) => { const v = {}; Object.keys(t.v).forEach((k) => { if (t.v[k]) v[k] = t.v[k]; }); return { n: t.n, v }; };
function parseTerm(s) {
  const m = String(s).replace(/\s+/g, '').match(/^([+-]?)(\d+)?((?:[a-z](?:\^\d+)?)*)$/);
  if (!m) throw new Error('bad term ' + s);
  let n = m[2] ? +m[2] : 1; if (m[1] === '-') n = -n;
  const v = {};
  (m[3].match(/[a-z](?:\^\d+)?/g) || []).forEach((p) => { const k = p[0], e = p.includes('^') ? +p.split('^')[1] : 1; v[k] = (v[k] || 0) + e; });
  return clean({ n, v });
}
const parsePoly = (s) => String(s).replace(/\s+/g, '').match(/[+-]?[^+-]+/g).map(parseTerm);
const varT = (v) => Object.keys(v).map((k) => k + (v[k] > 1 ? `^{${v[k]}}` : '')).join('');
function bodyT(t) { const vs = varT(t.v), an = Math.abs(t.n); return (an === 1 && vs ? '' : String(an)) + vs; }
const termT = (t, first) => (t.n < 0 ? '-' : first ? '' : '+') + bodyT(t);
const polyT = (list) => list.map((t, i) => termT(t, i === 0)).join('');
const fT = (t) => (t.n < 0 ? `(${termT(t, true)})` : termT(t, true));
function mulT(a, b) { const v = { ...a.v }; for (const k in b.v) v[k] = (v[k] || 0) + b.v[k]; return clean({ n: a.n * b.n, v }); }
function divT(a, g) { const v = { ...a.v }; for (const k in g.v) v[k] = (v[k] || 0) - g.v[k]; return clean({ n: a.n / g.n, v }); }
const isOne = (t) => t.n === 1 && !Object.keys(t.v).length;
/* GCF of a polynomial's terms: negative when the leading coefficient is negative (the convention in this unit) */
function gcfOf(list, mode = 'poly') {
  const g = list.reduce((a, t) => gcdI(a, t.n), 0) || 1, v = {};
  Object.keys(list[0].v).forEach((k) => { const e = Math.min(...list.map((t) => t.v[k] || 0)); if (e) v[k] = e; });
  return { n: mode === 'poly' && list[0].n < 0 ? -g : g, v };
}

/* ============ drawing helpers ============ */
function stagePos(stage, el) {
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, l: (r.left - sr.left) / k, t: (r.top - sr.top) / k, r: (r.right - sr.left) / k, b: (r.bottom - sr.top) / k };
}
function arcLayer(stage) { const s = svgEl('svg', { class: 'u4l2-arcs' }); stage.appendChild(s); return s; }
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
async function fly(c, stage, html, from, to, cls, ms = 650) {
  const e = add(stage, h('div', 'u4l2-fly c ' + (cls || ''), html), from.x, from.y);
  if (c.fast) { e.remove(); return; }
  try { await c.anim(e, [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${to.x - from.x}px, ${to.y - from.y}px) scale(1.04)` }], ms); }
  finally { e.remove(); }
}
const listAnd = (a) => (a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/* ============ 1. Removing the GCF is packing identical bags (algebra tiles) ============ */
const BG = { n: '10x+15', a: '6x+8', b: '12y-9', c: '10a+25', d: '14b-21' };
const bags = {
  title: 'Removing the GCF: pack the tiles into identical bags',
  height: 440,
  minW: 780,
  choices: [{ v: 'n', label: tex(BG.n) }, { sep: 'Example 1 check:' }, ...['a', 'b', 'c', 'd'].map((k) => ({ v: k, label: `(${k})` }))],
  intro: (k) => `Show ${T(BG[k])} with algebra tiles, then pack <b>all</b> the tiles into <b>identical bags</b>, with nothing left over.`,
  make(stage, key, ex) {
    const W = ex.W, P = parsePoly(BG[key]), vx = Object.keys(P[0].v)[0], kx = P[0].n, m = P[1].n, am = Math.abs(m), neg = m < 0;
    const g = gcdI(kx, m), qx = kx / g, qm = m / g, aq = Math.abs(qm);
    const XW = 62, XH = 16, U = 16, GP = 4;
    // the pile: x-tiles in rows of up to 7, unit tiles in a block beside them
    const xCols = Math.min(7, kx), uCols = Math.ceil(Math.sqrt(am * 1.6)), xRows = Math.ceil(kx / xCols), uRows = Math.ceil(am / uCols);
    const pileW = xCols * (XW + GP) + 40 + uCols * (U + GP), px0 = Math.max(20, (W - pileW) / 2), py0 = 46;
    const ux0 = px0 + xCols * (XW + GP) + 40;
    const pileL = add(stage, h('div', 'u4l2-plab', 'the tiles'), 22, 18);
    const lab1 = add(stage, h('div', 'u4l2-pcount', `${kx} ${K(vx)}-tiles`), px0, py0 + xRows * (XH + GP) + 6);
    const lab2 = add(stage, h('div', 'u4l2-pcount' + (neg ? ' red' : ''), `${am} ${neg ? 'negative ' : ''}unit tiles`), ux0, py0 + uRows * (U + GP) + 6);
    const tiles = [];
    for (let i = 0; i < kx; i++) { const t = add(stage, box(h('div', 'u4l2-tile kx', `<i>${K(vx)}</i>`), XW, XH), px0 + (i % xCols) * (XW + GP), py0 + Math.floor(i / xCols) * (XH + GP)); t.kind = 'x'; t.idx = i; tiles.push(t); }
    for (let i = 0; i < am; i++) { const t = add(stage, box(h('div', 'u4l2-tile ku' + (neg ? ' neg' : ''), neg ? '−' : ''), U, U), ux0 + (i % uCols) * (U + GP), py0 + Math.floor(i / uCols) * (U + GP)); t.kind = 'u'; t.idx = i; tiles.push(t); }
    tiles.forEach((t) => (t.style.transformOrigin = '0 0')); hide(...tiles, lab1, lab2);
    // the bags
    const bw = Math.min(104, (W - 40) / g - 12), bh = qx * (XH + GP) + Math.ceil(aq / 3) * (U + GP) + 30, by = 178;
    const bx = (j) => (W - g * (bw + 12) + 12) / 2 + j * (bw + 12);
    const bagEls = Array.from({ length: g }, (_, j) => { const b = add(stage, box(h('div', 'u4l2-bag'), bw, bh), bx(j), by); hide(b); return b; });
    const bagLabs = Array.from({ length: g }, (_, j) => { const e = add(stage, h('div', 'u4l2-blab c', K(polyT([{ n: qx, v: { [vx]: 1 } }, { n: qm, v: {} }]))), bx(j) + bw / 2, by + bh + 20); hide(e); return e; });
    const bagsL = add(stage, h('div', 'u4l2-plab', `${WORD[g] || g} bags`), 22, by - 26); hide(bagsL);
    const xw2 = Math.min(XW, bw - 16);
    const slot = (t) => {
      const j = t.idx % g, r = Math.floor(t.idx / g);
      if (t.kind === 'x') return [bx(j) + (bw - xw2) / 2, by + 12 + r * (XH + GP), xw2 / XW];
      const ucol = Math.min(3, aq), x0 = bx(j) + (bw - ucol * (U + GP) + GP) / 2;
      return [x0 + (r % 3) * (U + GP), by + 12 + qx * (XH + GP) + 4 + Math.floor(r / 3) * (U + GP), 1];
    };
    const resT = `${g}(${polyT([{ n: qx, v: { [vx]: 1 } }, { n: qm, v: {} }])})`, pT = polyT(P);
    const eq = add(stage, h('div', 'u4l2-beq c', K(`${pT}=\\boldsymbol{${resT}}`)), W / 2, by + bh + 64); hide(eq);
    const chk = add(stage, h('div', 'u4l2-bchk c', `check: ${K(`${g}\\cdot ${qx === 1 ? vx : qx + vx}=${kx}${vx}`)}, ${K(`${g}\\cdot ${fT({ n: qm, v: {} })}=${m}`)} ✓`), W / 2, by + bh + 104); hide(chk);
    const qW = qx === 1 ? `one ${T(vx)}-tile` : `${WORD[qx] || qx} ${T(vx)}-tiles`, uW = `${WORD[aq] || aq} ${neg ? 'negative ' : ''}unit tile${aq > 1 ? 's' : ''}`;
    void pileL;
    return [{
      cap: `${T(pT)} as tiles: <b>${kx}</b> ${T(vx)}-tiles and <b>${am}</b> ${neg ? '<b>negative</b> (red) ' : ''}unit tiles.`,
      run: (c) => Promise.all([...tiles.map((t, i) => c.pop(t, 260, { delay: Math.min(i * 22, 500) })), c.fadeIn(lab1, 300, { delay: 300 }), c.fadeIn(lab2, 300, { delay: 400 })])
    }, {
      cap: `How many identical bags? The number must divide <b>both</b> ${kx} and ${am}. The most is <b>${g}</b>, the <b>GCF</b> of ${kx} and ${am}.`,
      run: (c) => Promise.all([c.fadeIn(bagsL, 300), ...bagEls.map((b, j) => c.pop(b, 360, { delay: j * 90 }))])
    }, {
      cap: `Deal the tiles out, one bag at a time. Each bag gets ${qW} and ${uW}. Nothing is left over.`,
      run: (c) => Promise.all(tiles.map((t, i) => {
        const [x, y, s] = slot(t), x0 = parseFloat(t.style.left), y0 = parseFloat(t.style.top);
        return c.anim(t, [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${x - x0}px, ${y - y0}px) scaleX(${s})` }], 700, { delay: Math.min(i * 30, 900) }).then(() => { t.style.transformOrigin = '0 0'; });
      })).then(() => Promise.all([c.anim(lab1, [{ opacity: 1 }, { opacity: 0 }], 250), c.anim(lab2, [{ opacity: 1 }, { opacity: 0 }], 250)]))
    }, {
      cap: `One bag holds ${T(polyT([{ n: qx, v: { [vx]: 1 } }, { n: qm, v: {} }]))}. So ${T(`${pT}=${resT}`)}: the <b>GCF</b> out front (the number of bags), and <b>one bag</b> in the bracket.`,
      run: (c) => Promise.all([...bagLabs.map((e, j) => c.pop(e, 340, { delay: j * 80 })), c.fadeIn(eq, 400, { delay: 300 })])
    }, {
      cap: `<b>Check by expanding:</b> empty all ${g} bags back out. ${T(`${g}\\cdot ${qx === 1 ? vx : qx + vx}=${kx}${vx}`)} and ${T(`${g}\\cdot ${fT({ n: qm, v: {} })}=${m}`)}: the original ${T(pT)} ✓`,
      run: (c) => c.fadeIn(chk, 400)
    }];
  }
};

/* the check by distributing: GCF(q1 + q2 + …) = the original terms, with an arrow from the GCF to each bracket term
   (Ryan, 2026-10-30: show the check as re-distributing, not as a rectangle) */
function distCheck(stage, x, y, maxW, g, Q, P) {
  const gT = termT(g, true);
  const src = `\\htmlClass{u4l2-dg}{${gT}}\\htmlClass{u4l2-db}{(}` + Q.map((q, i) => (i === 0 ? `\\htmlClass{u4l2-dq0}{${termT(q, true)}}` : `\\mathbin{\\htmlClass{u4l2-dq${i}}{${q.n < 0 ? '-' : '+'}}}\\htmlClass{u4l2-dq${i}}{${bodyT(q)}}`)).join('') +
    '\\htmlClass{u4l2-db}{)}\\htmlClass{u4l2-de}{\\;=\\;}' + P.map((t, i) => `\\htmlClass{u4l2-dp${i}}{${tc(PCOL[i % 4], termT(t, i === 0))}}`).join('') + '\\htmlClass{u4l2-dk}{\\;\\checkmark}';
  const row = add(stage, h('div', 'u4l2-pc u4l2-dist', K(src)), x, y); row.style.translate = '0 -50%'; fit(row, maxW);
  const S = (cls) => spans(row, cls);
  const head = [...S('u4l2-dg'), ...S('u4l2-db'), ...Q.flatMap((q, i) => S('u4l2-dq' + i))];
  [...head, ...S('u4l2-de'), ...P.flatMap((t, i) => S('u4l2-dp' + i)), ...S('u4l2-dk')].forEach((e) => hide(e));
  const svg = arcLayer(stage);
  return {
    async run(c) {
      await showSpans(c, head, 300);
      await showSpans(c, S('u4l2-de'), 250);
      const a = stagePos(stage, S('u4l2-dg')[0]);
      for (let i = 0; i < Q.length; i++) {
        const qs = S('u4l2-dq' + i); qs.forEach((e) => (e.style.color = PCOL[i % 4]));
        const b = stagePos(stage, qs[qs.length - 1]), dx = Math.abs(b.x - a.x);
        await arrow(svg, a.x, a.t - 2, b.x, b.t - 2, Math.min(62, 30 + dx * 0.22), PCOL[i % 4]).draw(c, 420);
        await showSpans(c, S('u4l2-dp' + i), 320);
      }
      await showSpans(c, S('u4l2-dk'), 300);
    }
  };
}

/* ============ 2 & 5. Find the GCF, divide every term, write, check ============ */
const PO = {
  n2: '6x^2+12x+18', a2: '3x^2+6x+9', b2: '10a^2-15a-25', c2: '8y^2+12y-4',
  n5: '-4x^2+10x', a5: '-6x^3-15x^2', b5: '-8a^3+12a^2-4a', c5: '-10x^2y-15xy^2'
};
function makePull(title, choices) {
  return {
    title, height: 430, choices,
    intro: (k) => `Factor ${T(polyT(parsePoly(PO[k])))} by removing the <b>greatest common factor</b>. Then check.`,
    make(stage, key, ex) {
      const W = ex.W, P = parsePoly(PO[key]), n = P.length, g = gcfOf(P), gT = termT(g, true), Q = P.map((t) => divT(t, g));
      const pT = polyT(P), qT = polyT(Q), factT = `${gT}(${qT})`;
      const lx = 22, x0 = 170, colW = (W - x0 - 14) / n, cx = (i) => x0 + colW * (i + 0.5);
      const yA = 40, yB = 122, yC = 206, yD = 282;
      const lab = (y, t) => { const e = add(stage, h('div', 'u4l2-plab', t), lx, y); e.style.translate = '0 -50%'; return e; };
      lab(yA, 'terms'); const lC = lab(yC, 'write'), lD = lab(yD + 50, 'check'); hide(lC, lD);
      const tA = P.map((t, i) => add(stage, h('div', 'u4l2-pt c', K(termT(t, i === 0))), cx(i), yA));
      const gBox = add(stage, h('div', 'u4l2-gbox' + (g.n < 0 ? ' neg' : ''), `<div class="u4l2-gbh">÷ GCF</div><div class="u4l2-gbv">${K(gT)}</div>`), lx, yB + 6); gBox.style.translate = '0 -50%'; hide(gBox);
      const tB = P.map((t, i) => { const e = add(stage, h('div', 'u4l2-pf c', K(`\\dfrac{${termT(t, true)}}{${gT}}\\htmlClass{u4l2-qe}{=}\\htmlClass{u4l2-qv}{${termT(Q[i], true)}}`)), cx(i), yB); fit(e, colW - 12); hide(e); return e; });
      const qe = tB.map((e) => [...spans(e, 'u4l2-qe'), ...spans(e, 'u4l2-qv')]); qe.flat().forEach((e) => hide(e));
      const cSrc = `\\htmlClass{u4l2-ce}{${pT}=}\\,\\htmlClass{u4l2-tg}{${gT}}\\htmlClass{u4l2-cb}{(}` + Q.map((q, i) => (i === 0 ? `\\htmlClass{u4l2-tq0}{${termT(q, true)}}` : `\\mathbin{\\htmlClass{u4l2-tq${i}}{${q.n < 0 ? '-' : '+'}}}\\htmlClass{u4l2-tq${i}}{${bodyT(q)}}`)).join('') + '\\htmlClass{u4l2-cb}{)}';
      const rowC = add(stage, h('div', 'u4l2-pc', K(cSrc)), x0 - 6, yC); rowC.style.translate = '0 -50%'; fit(rowC, W - x0 - 20);
      const cParts = { e: spans(rowC, 'u4l2-ce'), g: spans(rowC, 'u4l2-tg'), b: spans(rowC, 'u4l2-cb'), q: Q.map((q, i) => spans(rowC, 'u4l2-tq' + i)) };
      [...cParts.e, ...cParts.g, ...cParts.b, ...cParts.q.flat()].forEach((e) => hide(e));
      const stamp = add(stage, h('div', 'u4l2-stamp ok', 'FACTORED<small>completely ✓</small>'), W - 20, yD + 18); stamp.style.translate = '-100% 0'; hide(stamp);
      const dist = distCheck(stage, x0 - 6, yD + 50, W - x0 - 250, g, Q, P); // the check: distribute the GCF back over the bracket
      const negG = g.n < 0, ones = Q.some(isOne) || Q.some((q) => q.n === -1 && !Object.keys(q.v).length);
      const coefs = P.map((t) => Math.abs(t.n)), cg = Math.abs(g.n);
      const vlist = Object.keys(g.v).map((k) => T(g.v[k] > 1 ? `${k}^{${g.v[k]}}` : k));
      const missing = Object.keys(P[0].v).filter((k) => !g.v[k]);
      return [{
        cap: `<b>Find the GCF.</b> Numbers: the GCF of ${listAnd(coefs.map(String))} is ${cg}. ` + (vlist.length ? `Every term has ${listAnd(vlist)} (lowest power).` : missing.length ? `Not every term has ${listAnd(missing.map(T))}, so no letter comes out.` : '') + (negG ? ` The <b>first term is negative</b>, so take out a <b>negative</b> GCF: ${T(gT)}.` : ` GCF ${T('=' + gT)}.`),
        run: (c) => Promise.all([c.pop(gBox, 420), ...tA.map((e) => pulse(c, e, 1.08))])
      }, {
        cap: `<b>Divide every term</b> by ${T(gT)}: ${listAnd(P.map((t, i) => T(`${termT(t, true)}\\div ${fT(g)}=${termT(Q[i], true)}`)))}.` + (negG ? ' Dividing by a negative <b>flips every sign</b>.' : ''),
        run: async (c) => {
          await Promise.all(tB.map((e, i) => c.fadeIn(e, 350, { delay: i * 120 })));
          await Promise.all(qe.map((ss, i) => showSpans(c, ss, 320, 150 + i * 260)));
        }
      }, {
        cap: `<b>Write</b> the GCF <b>out front</b> and the answers <b>in the bracket</b>: ${T(`${pT}=${factT}`)}.` + (ones ? ` A term that equals the GCF leaves a <b>1</b>: keep it!` : ''),
        run: async (c) => {
          await Promise.all([c.fadeIn(lC, 250), showSpans(c, [...cParts.e, ...cParts.b], 300)]);
          await fly(c, stage, K(gT), stagePos(stage, gBox.lastChild), stagePos(stage, cParts.g[0]), 'u4l2-flyg', 600);
          cParts.g.forEach((e) => (e.style.opacity = 1));
          await Promise.all(Q.map(async (q, i) => {
            await c.sleep(i * 150);
            await fly(c, stage, K(termT(q, i === 0)), stagePos(stage, spans(tB[i], 'u4l2-qv')[0]), stagePos(stage, cParts.q[i][cParts.q[i].length - 1]), 'u4l2-flyq', 600);
            cParts.q[i].forEach((e) => (e.style.opacity = 1));
          }));
          cParts.q.flat().forEach((e) => (e.style.opacity = 1));
        }
      }, {
        cap: `<b>Check by distributing:</b> multiply ${T(gT)} by <b>each</b> term in the bracket. ${listAnd(Q.map((q, i) => T(`${fT(g)}\\cdot ${fT(q)}=${termT(P[i], true)}`)))}. Those are the original terms ✓`,
        run: async (c) => { await c.fadeIn(lD, 250); await dist.run(c); }
      }, {
        cap: `<b>Factored completely?</b> The terms left in the bracket, ${T(qT)}, have no common factor except 1 ✓` + (negG ? ` And the bracket starts with a <b>positive</b> term.` : ''),
        run: (c) => stampIn(c, stamp)
      }];
    }
  };
}
const pullT = makePull('Find the GCF, divide every term, write, check', [{ v: 'n2', label: tex(PO.n2) }, { sep: 'Example 2 check:' }, { v: 'a2', label: '(a)' }, { v: 'b2', label: '(b)' }, { v: 'c2', label: '(c)' }]);
const pullN = makePull('A negative GCF with a variable', [{ v: 'n5', label: tex(PO.n5) }, { sep: 'Example 5 check:' }, { v: 'a5', label: '(a)' }, { v: 'b5', label: '(b)' }, { v: 'c5', label: '(c)' }]);
pullN.minW = 800; // (b) has three wide terms side by side

/* ============ 3. The GCF of the terms: GCF of the numbers, lowest power of each letter ============ */
const LO = { d: ['12x^2', '18x'], a: ['8x^3', '12x^2'], b: ['12a^2b', '18ab^2'], c: ['4x^3', '8x^2', '12x'], e2: ['3x^2', '6x', '9'] };
const lowest = {
  title: 'Which letters come out? The lowest power of each',
  height: 360,
  minW: 760,
  choices: [{ v: 'd', label: tex('12x^2,\\ 18x') }, { v: 'e2', label: tex('3x^2+6x+9') }, { sep: 'Example 3 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  intro: (k) => `Find the GCF of ${listAnd(LO[k].map((s) => T(s)))}, one piece at a time.`,
  make(stage, key, ex) {
    const W = ex.W, terms = LO[key].map(parseTerm), nr = terms.length;
    const vars = [...new Set(terms.flatMap((t) => Object.keys(t.v)))].sort();
    const cw = 40, lw = 160;
    let x = lw;
    const blocks = [{ kind: 'num', x, w: 104 }]; x += 116;
    vars.forEach((k) => { const mx = Math.max(...terms.map((t) => t.v[k] || 0)); const w = Math.max(mx * cw, 64) + 22; blocks.push({ kind: 'var', k, x, w, mx }); x += w + 12; });
    const off = Math.max(0, (W - x - 20) / 2); blocks.forEach((b) => (b.x += off));
    const rowY = (i) => 86 + i * 52, lineY = rowY(nr) - 20, resY = lineY + 36;
    blocks.forEach((b) => { b.bg = add(stage, box(h('div', 'u4l2-blk2'), b.w, resY + 26 - 56), b.x, 56); add(stage, h('div', 'u4l2-lh c', b.kind === 'num' ? 'number' : K(b.k)), b.x + b.w / 2, 36); });
    terms.forEach((t, i) => { const e = add(stage, h('div', 'u4l2-llab', K(termT(t, true))), 22 + off, rowY(i)); e.style.translate = '0 -50%'; });
    const cells = terms.map((t, i) => blocks.map((b) => {
      const y = rowY(i);
      if (b.kind === 'num') return [add(stage, h('div', 'u4l2-lv c', String(Math.abs(t.n))), b.x + b.w / 2, y)];
      const e = t.v[b.k] || 0;
      if (!e) return [add(stage, h('div', 'u4l2-lnone c', 'none'), b.x + 11 + Math.max(64, b.mx * cw) / 2 + 4, y)];
      return Array.from({ length: e }, (_, j) => add(stage, box(h('div', 'u4l2-lc c', K(b.k)), cw - 6, cw - 6), b.x + 11 + cw * (j + 0.5), y));
    }));
    cells.flat(2).forEach((e) => hide(e));
    const line = add(stage, box(h('div', 'u4l2-sep'), x - lw + 4, 0), lw - 2 + off, lineY); hide(line);
    const gl = add(stage, h('div', 'u4l2-llab g', 'GCF'), 22 + off, resY); gl.style.translate = '0 -50%'; hide(gl);
    const gcf = gcfOf(terms, 'set'), gcfT = termT(gcf, true), g = gcf.n;
    const res = blocks.map((b) => {
      let html;
      if (b.kind === 'num') html = String(g);
      else { const m = Math.min(...terms.map((t) => t.v[b.k] || 0)); b.min = m; html = m ? K(m > 1 ? `${b.k}^{${m}}` : b.k) : '—'; }
      const e = add(stage, h('div', 'u4l2-lres c' + (b.kind === 'var' && !b.min ? ' none' : ''), html), b.x + b.w / 2, resY); hide(e); return e;
    });
    const fin = add(stage, h('div', 'u4l2-cres', K(`\\text{GCF}=\\boldsymbol{${gcfT}}`)), 22 + off, resY + 32); hide(fin);
    const steps = [{
      cap: `One term per row. Split each into its <b>number</b> and its <b>letters</b>, written out as repeated factors.`,
      run: (c) => Promise.all([c.fadeIn(line, 300), c.fadeIn(gl, 300), ...cells.flatMap((row, i) => row.flat().map((e, j) => c.pop(e, 300, { delay: i * 160 + j * 30 })))])
    }, {
      cap: `<b>The numbers:</b> the GCF of ${listAnd(terms.map((t) => String(Math.abs(t.n))))} is ${g}.`,
      run: (c) => { blocks[0].bg.classList.add('on'); return c.pop(res[0], 380); }
    }];
    blocks.forEach((b, bIdx) => {
      if (b.kind !== 'var') return;
      const es = terms.map((t) => t.v[b.k] || 0), m = Math.min(...es), missing = terms.filter((t) => !t.v[b.k]);
      steps.push({
        cap: m ? `${T(b.k)}: the powers are ${listAnd(es.map((e) => T(e > 1 ? `${b.k}^{${e}}` : b.k)))}. Every term has at least ${T(m > 1 ? `${b.k}^{${m}}` : b.k)}: take the <b>lowest</b> power.`
          : `${T(b.k)} is <b>missing</b> from ${listAnd(missing.map((t) => T(termT(t, true))))}, so it isn’t in every term. Leave ${T(b.k)} out of the GCF.`,
        run: async (c) => {
          b.bg.classList.add('on');
          const cut = add(stage, box(h('div', 'u4l2-cut'), 0, rowY(nr - 1) + 24 - (rowY(0) - 24)), b.x + 11 + cw * m - (m ? 1 : 6), rowY(0) - 24);
          await c.anim(cut, [{ opacity: 0, transform: 'scaleY(0)' }, { opacity: 1, transform: 'scaleY(1)' }], 400);
          const exs = []; cells.forEach((row) => row[bIdx].forEach((e, j) => { if (j >= m && e.classList.contains('u4l2-lc')) exs.push(e); }));
          await Promise.all([...exs.map((e) => c.anim(e, [{ opacity: 1 }, { opacity: 0.25 }], 350)), c.pop(res[bIdx], 380, { delay: 150 })]);
        }
      });
    });
    steps.push({ cap: `Put the pieces together: GCF ${T('=' + gcfT)}.`, run: (c) => Promise.all([c.fadeIn(fin, 400), ...res.map((e) => pulse(c, e, 1.15))]) });
    return steps;
  }
};

/* ============ 3. Dividing by the GCF: cancel the matching factors ============ */
const CN = { a: '8x^3+12x^2', b: '12a^2b+18ab^2', c: '4x^3+8x^2+12x' };
const cancel = {
  title: 'Dividing by the GCF: cancel what matches',
  height: 400,
  minW: 760,
  choices: [{ sep: 'Example 3 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  value: 'a',
  intro: (k) => `Divide each term of ${T(polyT(parsePoly(CN[k])))} by the GCF, ${T(termT(gcfOf(parsePoly(CN[k])), true))}, by cancelling factors.`,
  make(stage, key, ex) {
    const W = ex.W, P = parsePoly(CN[key]), n = P.length, g = gcfOf(P), gT = termT(g, true), Q = P.map((t) => divT(t, g));
    const colW = (W - 30) / n, cx = (i) => 15 + colW * (i + 0.5);
    const yT = 40, yN = 120, yD = 186, yR = 262;
    // a term as a row of factor chips: the GCF's number, the rest of the number, then each letter written out
    const chipsOf = (num, vars, mark) => { const out = []; num.forEach((v) => out.push({ k: String(v), cls: 'num' })); Object.keys(vars).sort().forEach((k) => { for (let j = 0; j < vars[k]; j++) out.push({ k, cls: 'var' }); }); if (mark) out.forEach((o, i) => (o.i = i)); return out; };
    const cols = P.map((t, i) => {
      const q = Q[i], gn = g.n, qn = q.n;
      const top = chipsOf(qn === 1 ? [gn] : [gn, qn], t.v), bot = chipsOf([gn], g.v);
      // which top chips cancel: the GCF number, and as many of each letter as the GCF has
      const used = {}; top.forEach((o, j) => { if (j === 0) o.cancel = true; else if (o.cls === 'var') { used[o.k] = (used[o.k] || 0) + 1; o.cancel = used[o.k] <= (g.v[o.k] || 0); } });
      bot.forEach((o) => (o.cancel = true));
      return { t, q, top, bot };
    });
    const cs = 34, gap = 4;
    const rowEl = (list, y, x) => { const w = list.length * (cs + gap) - gap, x0 = x - w / 2; return list.map((o, j) => { const e = add(stage, box(h('div', 'u4l2-fc2 c ' + o.cls, o.cls === 'var' ? K(o.k) : o.k), cs, cs), x0 + j * (cs + gap) + cs / 2, y); hide(e); o.el = e; return e; }); };
    const heads = P.map((t, i) => add(stage, h('div', 'u4l2-ch c', K(`\\dfrac{${termT(t, true)}}{${gT}}`)), cx(i), yT));
    hide(...heads);
    const bars = cols.map((col, i) => { const w = Math.max(col.top.length, col.bot.length) * (cs + gap) + 10; const b = add(stage, box(h('div', 'u4l2-fbar'), w, 0), cx(i) - w / 2, (yN + yD) / 2); hide(b); return b; });
    cols.forEach((col, i) => { rowEl(col.top, yN, cx(i)); rowEl(col.bot, yD, cx(i)); });
    const resEls = cols.map((col, i) => { const e = add(stage, h('div', 'u4l2-cres2 c', K(`=${termT(col.q, true)}`)), cx(i), yR); hide(e); return e; });
    const fin = add(stage, h('div', 'u4l2-cfin c', K(`${polyT(P)}=\\boldsymbol{${gT}(${polyT(Q)})}`)), W / 2, yR + 76); hide(fin);
    const exp = (list) => list.map((o) => o.k).join('\\cdot ');
    return [{
      cap: `The GCF is ${T(gT)}. Write each term <b>over</b> the GCF.`,
      run: (c) => Promise.all(heads.map((e, i) => c.pop(e, 380, { delay: i * 120 })))
    }, {
      cap: `Write the tops and bottoms as <b>factors</b>: ${listAnd(cols.map((col) => T(`\\dfrac{${exp(col.top)}}{${exp(col.bot)}}`)))}.`,
      run: (c) => Promise.all([...bars.map((b) => c.fadeIn(b, 300)), ...cols.flatMap((col, i) => [...col.top, ...col.bot].map((o, j) => c.pop(o.el, 260, { delay: i * 150 + j * 30 })))])
    }, {
      cap: `<b>Cancel</b> each factor on the bottom with a matching factor on top. A factor divided by itself is 1.`,
      run: (c) => Promise.all(cols.flatMap((col) => [...col.top, ...col.bot].filter((o) => o.cancel).map((o, j) => { o.el.classList.add('x'); return c.anim(o.el, [{ opacity: 1 }, { opacity: 0.35 }], 350, { delay: j * 60 }); })))
    }, {
      cap: `What’s left on top is the answer: ${listAnd(cols.map((col) => T(`${termT(col.t, true)}\\div ${gT}=${termT(col.q, true)}`)))}.` + (Q.some(isOne) ? ' When everything cancels, a <b>1</b> is left.' : ''),
      run: (c) => Promise.all(resEls.map((e, i) => c.pop(e, 360, { delay: i * 150 })))
    }, {
      cap: `So ${T(`${polyT(P)}=${gT}(${polyT(Q)})`)}. Check: ${listAnd(Q.map((q, i) => T(`${gT}\\cdot ${fT(q)}=${termT(P[i], true)}`)))} ✓`,
      run: (c) => c.fadeIn(fin, 400)
    }];
  }
};

/* ============ 4. A negative GCF flips every sign ============ */
const NG = { a: '-4x-12', b: '-5a+15', c: '-3x^2+9x-6' };
const flipSigns = {
  title: 'Take out a negative: every sign flips',
  height: 470,
  minW: 760,
  choices: [{ v: 'a', label: tex(NG.a) }, { sep: 'Example 4 check:' }, { v: 'b', label: '(b)' }, { v: 'c', label: '(c)' }],
  intro: (k) => `${T(polyT(parsePoly(NG[k])))} starts with a <b>negative</b> term. Factor it so the bracket starts with a <b>positive</b> term.`,
  make(stage, key, ex) {
    const W = ex.W, P = parsePoly(NG[key]), n = P.length, g = gcfOf(P), gT = termT(g, true), Q = P.map((t) => divT(t, g)), pT = polyT(P), qT = polyT(Q);
    const lx = 22, x0 = 170, colW = (W - x0 - 14) / n, cx = (i) => x0 + colW * (i + 0.5);
    const yA = 40, yB = 122, yS = 182, yC = 244, yD = 364, yE = 430;
    const lab = (y, t) => { const e = add(stage, h('div', 'u4l2-plab', t), lx, y); e.style.translate = '0 -50%'; return e; };
    lab(yA, 'terms'); const lC = lab(yC, 'write'), lD = lab(yD, 'check'); hide(lC, lD);
    const tA = P.map((t, i) => add(stage, h('div', 'u4l2-pt c', K(termT(t, i === 0))), cx(i), yA));
    const gBox = add(stage, h('div', 'u4l2-gbox neg', `<div class="u4l2-gbh">÷ GCF</div><div class="u4l2-gbv">${K(gT)}</div>`), lx, yB + 6); gBox.style.translate = '0 -50%'; hide(gBox);
    // each term over the negative GCF; the two signs being divided are red, the answer amber
    const sgnT = (t) => (t.n < 0 ? '\\htmlClass{u4l2-sg}{-}' : '');
    const tB = P.map((t, i) => { const e = add(stage, h('div', 'u4l2-pf c', K(`\\dfrac{${sgnT(t)}${bodyT(t)}}{\\htmlClass{u4l2-sg}{-}${fT({ n: -g.n, v: g.v })}}\\htmlClass{u4l2-qe}{=}\\htmlClass{u4l2-qv}{${termT(Q[i], true)}}`)), cx(i), yB); fit(e, colW - 12); hide(e); return e; });
    const qe = tB.map((e) => [...spans(e, 'u4l2-qe'), ...spans(e, 'u4l2-qv')]); qe.flat().forEach((e) => hide(e));
    // the sign rule used for each term, right under it
    const S = (t) => (t.n < 0 ? '-' : '+');
    const chips = P.map((t, i) => { const e = add(stage, h('div', 'u4l2-sgn c ' + (Q[i].n < 0 ? 'neg' : 'pos'), K(`(${S(t)})\\div(\\htmlClass{u4l2-sg}{-})=\\htmlClass{u4l2-sr}{(${S(Q[i])})}`)), cx(i), yS); fit(e, colW - 12); hide(e); return e; });
    const cSrc = `\\htmlClass{u4l2-ce}{${pT}=}\\,\\htmlClass{u4l2-tg}{${gT}}\\htmlClass{u4l2-cb}{(}` + Q.map((q, i) => (i === 0 ? `\\htmlClass{u4l2-tq0}{${termT(q, true)}}` : `\\mathbin{\\htmlClass{u4l2-tq${i}}{${q.n < 0 ? '-' : '+'}}}\\htmlClass{u4l2-tq${i}}{${bodyT(q)}}`)).join('') + '\\htmlClass{u4l2-cb}{)}';
    const rowC = add(stage, h('div', 'u4l2-pc', K(cSrc)), x0 - 6, yC); rowC.style.translate = '0 -50%'; fit(rowC, W - x0 - 20);
    const cParts = { e: spans(rowC, 'u4l2-ce'), g: spans(rowC, 'u4l2-tg'), b: spans(rowC, 'u4l2-cb'), q: Q.map((q, i) => spans(rowC, 'u4l2-tq' + i)) };
    [...cParts.e, ...cParts.g, ...cParts.b, ...cParts.q.flat()].forEach((e) => hide(e));
    const dist = distCheck(stage, x0 - 6, yD, W - x0 - 20, g, Q, P);
    const pg = { n: -g.n, v: g.v }, Qp = P.map((t) => divT(t, pg));
    const alt = add(stage, h('div', 'u4l2-alt c', `<span class="u4l2-altx">not the convention:</span> ${K(`${termT(pg, true)}(${polyT(Qp)})`)} <span class="u4l2-altx">bracket starts with a minus</span>`), W / 2, yE); hide(alt);
    return [{
      cap: `The first term, ${T(termT(P[0], true))}, is <b>negative</b>. The GCF of the numbers is ${Math.abs(g.n)}, so take out <b>${T(gT)}</b> instead of ${T(String(Math.abs(g.n)))}.`,
      run: (c) => Promise.all([c.pop(gBox, 420), ...tA.map((e) => pulse(c, e, 1.08))])
    }, {
      cap: `<b>Divide every term</b> by ${T(gT)}: ${listAnd(P.map((t, i) => T(`${termT(t, true)}\\div ${fT(g)}=${termT(Q[i], true)}`)))}. Watch the signs: dividing by a negative <b>flips every sign</b>.`,
      run: async (c) => {
        await Promise.all(tB.map((e, i) => c.fadeIn(e, 350, { delay: i * 120 })));
        for (let i = 0; i < n; i++) {
          await c.fadeIn(chips[i], 300);
          await showSpans(c, qe[i], 320);
        }
      }
    }, {
      cap: `<b>Write</b> ${T(gT)} <b>out front</b> and the answers <b>in the bracket</b>: ${T(`${pT}=${gT}(${qT})`)}. The bracket starts with a <b>positive</b> term ✓`,
      run: async (c) => {
        await Promise.all([c.fadeIn(lC, 250), showSpans(c, [...cParts.e, ...cParts.b], 300)]);
        await fly(c, stage, K(gT), stagePos(stage, gBox.lastChild), stagePos(stage, cParts.g[0]), 'u4l2-flyg', 600);
        cParts.g.forEach((e) => (e.style.opacity = 1));
        await Promise.all(Q.map(async (q, i) => {
          await c.sleep(i * 150);
          await fly(c, stage, K(termT(q, i === 0)), stagePos(stage, spans(tB[i], 'u4l2-qv')[0]), stagePos(stage, cParts.q[i][cParts.q[i].length - 1]), 'u4l2-flyq', 600);
          cParts.q[i].forEach((e) => (e.style.opacity = 1));
        }));
        cParts.q.flat().forEach((e) => (e.style.opacity = 1));
      }
    }, {
      cap: `<b>Check by distributing:</b> multiply ${T(gT)} by <b>each</b> term in the bracket. ${listAnd(Q.map((q, i) => T(`${fT(g)}\\cdot ${fT(q)}=${termT(P[i], true)}`)))}` + (Q.some((q) => q.n < 0) ? '. A negative times a negative is positive ✓' : '. Those are the original terms ✓'),
      run: async (c) => { await c.fadeIn(lD, 250); await dist.run(c); }
    }, {
      cap: `Why not take out ${T(termT(pg, true))}? ${T(`${termT(pg, true)}(${polyT(Qp)})`)} also expands back, but the bracket starts with a minus. In this unit we take out the <b>negative</b>.`,
      run: (c) => c.fadeIn(alt, 400)
    }];
  }
};

/* ============ 5. Find the error: check by expanding ============ */
const FE = {
  A: { who: 'Ava', poly: '20x^3+30x^2', g: '10x', br: '2x^2+3x', kind: 'nc' },
  B: { who: 'Ben', poly: '-5x+10', g: '-5', br: 'x+2', kind: 'sign' },
  C: { who: 'Cole', poly: '6x^2+9x+3', g: '3', br: '2x^2+3x', kind: 'one' },
  D: { who: 'Dina', poly: '10x^3-5x', g: '5x', br: '2x^3-1', kind: 'exp' }
};
const findErr = {
  title: 'Find the error: check by expanding',
  height: 410,
  minW: 860,
  choices: Object.keys(FE).map((k) => ({ v: k, label: FE[k].who })),
  intro: (k) => { const d = FE[k]; return `${d.who} says ${T(`${polyT(parsePoly(d.poly))}=${d.g}(${polyT(parsePoly(d.br))})`)}. Is it right?`; },
  make(stage, key, ex) {
    const W = ex.W, d = FE[key], P = parsePoly(d.poly), g = parseTerm(d.g), Bq = parsePoly(d.br), prods = Bq.map((q) => mulT(g, q));
    const pT = polyT(P), gT = termT(g, true);
    add(stage, h('div', 'u4l2-who', `${d.who}’s factoring`), 30, 18);
    const claimSrc = `${pT}=\\htmlClass{u4l2-fg}{${gT}}(` + Bq.map((q, i) => `\\htmlClass{u4l2-fb${i}}{${termT(q, i === 0)}}`).join('') + ')';
    const claim = add(stage, h('div', 'u4l2-claim', K(claimSrc)), 30, 112); claim.style.translate = '0 -50%';
    const svg = arcLayer(stage);
    const expL = add(stage, h('div', 'u4l2-plab', 'expands to'), 30, 196); expL.style.translate = '0 -50%';
    const expSrc = '\\htmlClass{u4l2-feq}{=}' + prods.map((p, i) => `\\htmlClass{u4l2-fp${i}}{${tc(PCOL[i], termT(p, i === 0))}}`).join('');
    const exp = add(stage, h('div', 'u4l2-claim sm', K(expSrc)), 170, 196); exp.style.translate = '0 -50%';
    const pSpans = prods.map((p, i) => spans(exp, 'u4l2-fp' + i)), feq = spans(exp, 'u4l2-feq'); hide(expL, ...feq, ...pSpans.flat());
    const same = polyT(prods) === pT;
    const verd = add(stage, h('div', 'u4l2-verd ' + (same ? 'ok' : 'no'), same ? `✓ matches ${K(pT)}` : `✗ should be ${K(pT)}`), 170, 246); verd.style.translate = '0 -50%'; hide(verd);
    const STAMP = { nc: 'NOT THE GREATEST', sign: 'SIGN ERROR', one: 'MISSING 1', exp: 'EXPONENT ERROR' };
    const stamp = add(stage, h('div', 'u4l2-stamp no', STAMP[d.kind] + '<small>' + (d.kind === 'nc' ? 'not factored completely' : 'doesn’t expand back') + '</small>'), W - 26, 168); stamp.style.translate = '-100% 0'; hide(stamp);
    const fg = gcfOf(P), fB = P.map((t) => divT(t, fg)), fixT = `${termT(fg, true)}(${polyT(fB)})`;
    const fixL = add(stage, h('div', 'u4l2-plab ok', 'correct'), 30, 330); fixL.style.translate = '0 -50%';
    const fixE = add(stage, h('div', 'u4l2-claim sm ok', K(`${pT}=\\boldsymbol{${fixT}}`)), 170, 330); fixE.style.translate = '0 -50%';
    const fixC = add(stage, h('div', 'u4l2-fixc', 'check: ' + K(fB.map((q) => `${fT(fg)}\\cdot ${fT(q)}=${termT(mulT(fg, q), true)}`).join(',\\ \\ ')) + ' ✓'), 170, 376); fixC.style.translate = '0 -50%';
    hide(fixL, fixE, fixC);
    const why = {
      nc: `It expands back to ${T(pT)} ✓, so it isn’t <b>wrong</b>… but look in the bracket: ${T('2x^2')} and ${T('3x')} still share an ${T('x')}. ${T('10x')} isn’t the <b>greatest</b> common factor: use the lowest power, ${T('x^2')}.`,
      sign: `It expands to ${T(polyT(prods))}, not ${T(pT)} ✗. ${T('10\\div(-5)=-2')}: dividing by a negative flips <b>every</b> sign, and ${d.who} only flipped the first one.`,
      one: `It expands to just ${T(polyT(prods))} ✗. Where did the ${T('+3')} go? ${T('3\\div3=1')}: when a term <b>is</b> the GCF, it leaves a <b>1</b> in the bracket.`,
      exp: `It expands to ${T(polyT(prods))}, not ${T(pT)} ✗. ${T('10x^3\\div5x=2x^2')}: one ${T('x')} comes out, so the power goes <b>down by one</b>. ${d.who} forgot to divide the ${T('x^3')}.`
    }[d.kind];
    return [{
      cap: `<b>Check by expanding:</b> multiply ${T(gT)} by <b>each</b> term in the bracket.`,
      run: async (c) => {
        const gEl = spans(claim, 'u4l2-fg')[0], a = stagePos(stage, gEl);
        await Promise.all([c.fadeIn(expL, 250), showSpans(c, feq, 250)]);
        for (let i = 0; i < Bq.length; i++) {
          const b = stagePos(stage, spans(claim, 'u4l2-fb' + i)[0]), dx = Math.abs(b.x - a.x);
          spans(claim, 'u4l2-fb' + i).forEach((e) => (e.style.color = PCOL[i]));
          await arrow(svg, a.x, a.t - 2, b.x, b.t - 2, Math.min(64, 30 + dx * 0.25), PCOL[i]).draw(c, 420);
          await showSpans(c, pSpans[i], 320);
        }
        await c.fadeIn(verd, 350);
      }
    }, {
      cap: why,
      run: async (c) => {
        if (d.kind === 'nc') Bq.forEach((q, i) => spans(claim, 'u4l2-fb' + i).forEach((e) => e.classList.add('u4l2-hl')));
        else pSpans.forEach((ss, i) => { if (termT(prods[i], true) !== termT(P[i], true)) ss.forEach((e) => e.classList.add('u4l2-bad')); });
        const jobs = [stampIn(c, stamp)];
        if (d.kind === 'one') { const gh = add(stage, h('div', 'u4l2-ghost', K(termT(P[P.length - 1], false)) + ' ?'), 170 + exp.offsetWidth + 16, 196); gh.style.translate = '0 -50%'; jobs.push(c.pop(gh, 380)); }
        await Promise.all(jobs);
      }
    }, {
      cap: `Fixed: ${T(`${pT}=${fixT}`)}. It expands back to ${T(pT)}, and nothing common is left in ${T(polyT(fB))} ✓`,
      run: (c) => Promise.all([c.fadeIn(fixL, 300), c.fadeIn(fixE, 400), c.fadeIn(fixC, 400, { delay: 300 })])
    }];
  }
};

/* ============ warm-up: The Party Bag Puzzle ============ */
function mountParty() {
  const host = document.getElementById('u4l2-party'); if (!host) return;
  const VW = 640, VH = 228;
  host.innerHTML = `<svg viewBox="0 0 ${VW} ${VH}" class="u4l2-psvg"><g class="u4l2-pg"></g></svg>
    <div class="u4l2-pctl no-ink"><span class="u4l2-pcl">Bags:</span>${Array.from({ length: 12 }, (_, i) => `<button class="chip" type="button" data-bags="${i + 1}">${i + 1}</button>`).join('')}
      <button class="chip u4l2-bal" type="button" data-balloons>+ 25 balloons</button></div>
    <div class="u4l2-pread" aria-live="polite"></div>`;
  const gEl = host.querySelector('.u4l2-pg'), read = host.querySelector('.u4l2-pread'), balBtn = host.querySelector('[data-balloons]');
  let nb = 0, balloons = false;
  const candy = (x, y, r = 5) => `<circle class="u4l2-cd" cx="${x}" cy="${y}" r="${r}"/>`;
  const star = (x, y, r = 6) => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p += `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)} `; } return `<polygon class="u4l2-st" points="${p}"/>`; };
  const balloon = (x, y, r = 5) => `<ellipse class="u4l2-bl" cx="${x}" cy="${y - 1}" rx="${r * 0.85}" ry="${r}"/><path class="u4l2-blt" d="M${x} ${y + r - 1}l-1.5 4"/>`;
  const KIND = [{ n: 24, name: 'candies', one: 'candy', draw: candy, cols: 6 }, { n: 36, name: 'stickers', one: 'sticker', draw: star, cols: 6 }, { n: 25, name: 'balloons', one: 'balloon', draw: balloon, cols: 5 }];
  function draw() {
    host.querySelectorAll('[data-bags]').forEach((b) => b.classList.toggle('on', +b.dataset.bags === nb));
    balBtn.classList.toggle('on', balloons);
    const kinds = KIND.slice(0, balloons ? 3 : 2);
    let out = '';
    // the piles across the top (what is still unpacked)
    const per = kinds.map((k) => (nb ? Math.floor(k.n / nb) : 0)), left = kinds.map((k, i) => (nb ? k.n - per[i] * nb : k.n));
    const trayW = 150, tx0 = (VW - kinds.length * (trayW + 14) + 14) / 2;
    kinds.forEach((k, i) => {
      const x0 = tx0 + i * (trayW + 14), sp = 14, cols = k.cols, rws = Math.ceil(k.n / cols), gx = x0 + (trayW - cols * sp) / 2 + sp / 2;
      out += `<rect class="u4l2-tray${nb && left[i] ? ' bad' : ''}" x="${x0}" y="4" width="${trayW}" height="96" rx="10"/>`;
      for (let j = 0; j < k.n; j++) { const gone = nb && j >= left[i]; out += `<g class="${gone ? 'u4l2-gone' : left[i] && nb ? 'u4l2-left' : ''}">${k.draw(gx + (j % cols) * sp, 14 + Math.floor(j / cols) * sp + (rws < 6 ? (6 - rws) * 7 : 0))}</g>`; }
      out += `<text class="u4l2-ptx${nb && left[i] ? ' no' : ''}" x="${x0 + trayW / 2}" y="${118}">${nb ? (left[i] ? `${left[i]} ${left[i] > 1 ? k.name : k.one} left over` : `all ${k.n} ${k.name} packed`) : `${k.n} ${k.name}`}</text>`;
    });
    // the bags
    if (nb) {
      const bw = Math.min(64, (VW - 20) / nb - 6), bx0 = (VW - nb * (bw + 6) + 6) / 2, by = 132, bh = 90;
      for (let j = 0; j < nb; j++) {
        const x = bx0 + j * (bw + 6);
        out += `<path class="u4l2-bagp" d="M${x + 4} ${by + 12} h${bw - 8} l4 ${bh - 14} q0 2 -2 2 h${-(bw - 4)} q-2 0 -2 -2 z"/><path class="u4l2-bagh" d="M${x + bw * 0.32} ${by + 12} q${bw * 0.18} -16 ${bw * 0.36} 0"/>`;
        kinds.forEach((k, i) => { const y = by + 32 + i * 22; out += `<g>${k.draw(x + bw * 0.3, y, 6)}</g><text class="u4l2-btx" x="${x + bw * 0.62}" y="${y + 6}">${per[i]}</text>`; });
      }
    }
    if (!nb) out += `<text class="u4l2-ptx big" x="${VW / 2}" y="182">How many identical bags?</text>`;
    gEl.innerHTML = out;
    if (!nb) { read.innerHTML = `Pick a number of <b>bags</b>. Every bag must get the <b>same</b> things, and nothing can be left over.`; return; }
    const ok = left.every((v) => !v);
    read.innerHTML = `<b>${nb} ${nb > 1 ? 'bags' : 'bag'}:</b> ` + kinds.map((k, i) => (left[i] ? `${k.n} ${k.name} ÷ ${nb} → <b class="red">${left[i]} left over ✗</b>` : `${k.n} ÷ ${nb} = <b>${per[i]}</b> ${k.name} each ✓`)).join(' · ') + (ok ? ` <b class="ok">It works!</b>` : '');
  }
  host.querySelectorAll('[data-bags]').forEach((b) => b.addEventListener('click', () => { nb = +b.dataset.bags; draw(); }));
  balBtn.addEventListener('click', () => { balloons = !balloons; draw(); });
  draw();
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { bags, pullT, lowest, cancel, flipSigns, pullN, findErr };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountParty(); mountExplainers();

/* ============ Stand Up Break! — remove the GCF at the whiteboards ============ */
{
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const VS = (v) => Object.keys(v).sort().filter((k) => v[k]).map((k) => (v[k] === 1 ? k : k + '^{' + v[k] + '}')).join('');
  const TM = (c, v, first) => { const s = VS(v), a = Math.abs(c); return (c < 0 ? '-' : first ? '' : '+') + (a === 1 && s ? '' : a) + s; };
  const P = (ts) => ts.map(([c, v], i) => TM(c, v, i === 0)).join('');
  const X = (a, b) => { const v = { ...a[1] }; for (const k in b[1]) v[k] = (v[k] || 0) + b[1][k]; return [a[0] * b[0], v]; };
  // assignment 2 questions stay off the whiteboards
  const HW = new Set(['4x+6', '10y-15', '9a+12', '21b-14', '5x+5', '16m-24', '9x+15', '8a-20', '2x^{2}+6x+8', '5a^{2}-10a+20', '9y^{2}+3y-12', '6m^{2}-12m-18',
    '6x^{3}+9x^{2}', '10a^{4}-15a^{3}', '8y^{3}+4y^{2}', '12x^{3}-18x^{2}', '5m^{3}+15m^{2}', '4x^{3}+8x^{2}+16x', '-3x-9', '-6a+18', '-5y-20', '-8m+12',
    '-2x^{2}+6x-4', '-3a^{2}-9a+12', '-5y^{2}+10y+15', '-4x^{3}-8x^{2}', '-6a^{3}+9a^{2}', '-6m^{3}+12m^{2}-18m', '8x^{2}+12x', '-5a^{2}-15a', '6x^{3}-9x^{2}', '-4y^{3}+8y^{2}-12y', '6x^{2}+9x', '-6x-15', '-8x^{2}-12x', '-12x^{3}+18x^{2}']);
  function q(G, br) { // G times a bracket with nothing common left in it
    const terms = br.map((t) => X(G, t)), Q = P(terms);
    if (HW.has(Q)) return null;
    const L = Object.keys(G[1]).filter((k) => G[1][k]).sort();
    const low = L.length ? '\\text{ and }' + L.map((k) => VS({ [k]: G[1][k] })).join('') : '';
    const sign = G[0] < 0 ? '\\text{first term negative: take out } ' + TM(G[0], G[1], true) : '\\text{GCF}=' + TM(G[0], G[1], true);
    const a = [sign, Q + '=' + TM(G[0], G[1], true) + '(' + P(br) + ')'];
    if (L.length || G[0] < 0) a.unshift('\\text{numbers: GCF}=' + Math.abs(G[0]) + low.replace('\\text{ and }', ';\\ \\text{letters: }'));
    return { q: Q, a };
  }
  const tries = (f) => { for (let i = 0; i < 50; i++) { const r = f(); if (r) return r; } return f(); };
  standup('u4l2', {
    intro: 'Factor by removing the GCF. Check by expanding before you call it done.',
    levels: {
      BEG: (r) => tries(() => { // a number GCF from a binomial: 6x + 8 = 2(3x + 4)
        const v = r.pick(['x', 'x', 'a', 'y', 'm', 'b']), g = r.int(2, 9); let m, n; do { m = r.int(1, 6); n = r.int(1, 9); } while (gcd(m, n) !== 1);
        return q([g, {}], [[m, { [v]: 1 }], [r.chance(0.4) ? -n : n, {}]]);
      }),
      PRG: (r) => tries(() => { // a trinomial with a number GCF, or a binomial with a variable GCF
        const v = r.pick(['x', 'x', 'a', 'y', 'm']), g = r.int(2, 8);
        if (r.chance(0.5)) {
          let a, b, c; do { a = r.int(1, 4); b = r.int(1, 6) * r.sign(); c = r.int(1, 7) * r.sign(); } while (gcd(gcd(a, b), c) !== 1);
          return q([g, {}], [[a, { [v]: 2 }], [b, { [v]: 1 }], [c, {}]]);
        }
        const e = r.int(1, 2); let a, b; do { a = r.int(1, 5); b = r.int(1, 7); } while (gcd(a, b) !== 1);
        return q([g, { [v]: e }], [[a, { [v]: 1 }], [r.chance(0.3) ? -b : b, {}]]);
      }),
      MAS: (r) => tries(() => { // a negative GCF, often with a variable (or two letters)
        const g = r.int(2, 7), kind = r.int(0, 2);
        if (kind === 0) { // −g(x² ± bx ± c)
          const v = r.pick(['x', 'a', 'y']); let b, c; do { b = r.int(1, 5) * r.sign(); c = r.int(1, 6) * r.sign(); } while (gcd(b, c) === 0);
          return q([-g, {}], [[1, { [v]: 2 }], [b, { [v]: 1 }], [c, {}]]);
        }
        if (kind === 1) { // −g x^e (a x + b)
          const v = r.pick(['x', 'a', 'm']), e = r.int(1, 2); let a, b; do { a = r.int(1, 4); b = r.int(1, 7); } while (gcd(a, b) !== 1);
          return q([-g, { [v]: e }], [[a, { [v]: 1 }], [r.sign() * b, {}]]);
        }
        const L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]); let a, b; do { a = r.int(1, 5); b = r.int(1, 5); } while (gcd(a, b) !== 1);
        return q([-g, { [L[0]]: 1, [L[1]]: 1 }], [[a, { [L[0]]: 1 }], [r.sign() * b, { [L[1]]: 1 }]]);
      })
    }
  });
}
