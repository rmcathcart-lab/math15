/* Math 15 · Unit 3 · Lesson 5 — Multiplying a Binomial by a Trinomial.
 * The Combo Counter warm-up, the explainers on this page and the Stand Up Break.
 * handshake and grid are adapted from Math 10C 3.4 (same engine). Colours (every Unit 3 page): x² teal, x amber,
 * 1 slate blue, x³ purple; FOIL letters F red, O blue, I green, L amber. */
import { h, fmt, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s);
const tn = (n) => (n < 0 ? '-' : '') + fmt(Math.abs(n)).replace(/ /g, '\\,'); // a number in LaTeX: 2\,829

/* ---------------- polynomial helpers (one variable) ----------------
 * a term is [coefficient, exponent]; a polynomial is a list of terms in WRITTEN order. */
const DEG = ['#2f5fa8', '#b86e00', '#0f7a74', '#7b4fc4']; // 1 slate-blue · x amber · x² teal · x³ purple
const degCol = (e) => DEG[Math.min(e, DEG.length - 1)];
const DEGBG = ['#e6eefa', '#fff1d6', '#dff2ef', '#eee6fa'];
const degBg = (e) => DEGBG[Math.min(e, DEGBG.length - 1)];
const DEGNAME = ['numbers', 'x terms', 'x² terms', 'x³ terms'];
function body(c, e, v = 'x') { const a = Math.abs(c); return (e === 0 ? String(a) : a === 1 ? '' : String(a)) + (e === 0 ? '' : e === 1 ? v : `${v}^{${e}}`); }
function termT([c, e], first, o = {}) {
  const s = c < 0 ? '-' : first ? '' : '+', b = body(c, e);
  return o.col ? `${s}\\textcolor{${degCol(e)}}{${b}}` : s + b;
}
const polyT = (ts, o = {}) => (ts.length ? ts.map((t, i) => termT(t, i === 0, o)).join('') : '0');
const par = (ts, o) => (ts.length > 1 ? `(${polyT(ts, o)})` : polyT(ts, o));
const mulT = (a, b) => [a[0] * b[0], a[1] + b[1]];
function collect(ts) {
  const m = new Map(); ts.forEach(([c, e]) => m.set(e, (m.get(e) || 0) + c));
  return [...m].filter(([, c]) => c !== 0).sort((x, y) => y[0] - x[0]).map(([e, c]) => [c, e]);
}
const partials = (A, B) => A.flatMap((a) => B.map((b) => mulT(a, b)));
const polyMul = (A, B) => collect(partials(A, B));
const facT = (t) => (t[0] < 0 ? `(${termT(t, true)})` : termT(t, true));
const prodT = (a, b) => `${facT(a)}${a[0] < 0 || b[0] < 0 ? '' : '\\cdot '}${facT(b)}`;
/* group like terms (by degree, highest first): 2x^3+(6x^2+x^2)+(8x+3x)+4 */
function groupedT(ts, o = {}) {
  const degs = [...new Set(ts.map((t) => t[1]))].sort((a, b) => b - a);
  return degs.map((d, i) => {
    const g = ts.filter((t) => t[1] === d);
    if (g.length === 1) return termT(g[0], i === 0, o);
    return (i ? '+' : '') + '(' + polyT(g, o) + ')';
  }).join('');
}
/* "6x^2+x^2=7x^2 and 8x+3x=11x" for a caption */
function collectSentence(ts) {
  const degs = [...new Set(ts.map((t) => t[1]))].sort((a, b) => b - a);
  const parts = degs.map((d) => { const g = ts.filter((t) => t[1] === d); if (g.length < 2) return null; const s = g.reduce((x, t) => x + t[0], 0); return T(`${polyT(g)}=${s === 0 ? '0' : termT([s, d], true)}`); }).filter(Boolean);
  return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0] || '';
}
function drawLine(c, ln, ms = 420, o = {}) {
  const len = Math.hypot(ln.x2.baseVal.value - ln.x1.baseVal.value, ln.y2.baseVal.value - ln.y1.baseVal.value) + 2;
  ln.style.strokeDasharray = len; ln.style.strokeDashoffset = len; ln.style.opacity = 1;
  return c.anim(ln, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], ms, o);
}
function shrinkToFit(el, max) {
  const w = el.scrollWidth; if (!max || w <= max) return;
  el.style.fontSize = Math.floor(parseFloat(getComputedStyle(el).fontSize) * max / w * 10) / 10 + 'px';
}
function stagePos(stage, el) { // element box in stage coordinates (the stage may be scaled)
  const sr = stage.getBoundingClientRect(), k = sr.width / stage.offsetWidth || 1, r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2 - sr.left) / k, y: (r.top + r.height / 2 - sr.top) / k, l: (r.left - sr.left) / k, t: (r.top - sr.top) / k, r: (r.right - sr.left) / k, b: (r.bottom - sr.top) / k };
}
const fadeOut = (c, el, ms = 300) => c.anim(el, [{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], ms);
const glow = (c, el, col = '194,122,14') => c.anim(el, [{ boxShadow: `0 0 0 0 rgba(${col},0)` }, { boxShadow: `0 0 0 7px rgba(${col},.45)`, offset: 0.4 }, { boxShadow: `0 0 0 0 rgba(${col},0)` }], 900);
/* a written line of LaTeX on the stage */
const line = (stage, src, x, y, cls = '') => { const e = add(stage, h('div', 'u3l5-ln ' + cls, K(src)), x, y); hide(e); return e; };

/* =====================================================================
   1. Recall: FOIL arrows (and a special product)
   ===================================================================== */
const FL = [['F', 'First', 0, 0, 1, '#c93a33'], ['O', 'Outside', 0, 1, 1, '#2f5fa8'], ['I', 'Inside', 1, 0, -1, '#12805a'], ['L', 'Last', 1, 1, -1, '#b86e00']];
const RC = {
  n1: { A: [[1, 1], [3, 0]], B: [[1, 1], [4, 0]] },
  n2: { A: [[1, 1], [5, 0]], B: [[1, 1], [-5, 0]], dos: true },
  e1a: { A: [[1, 1], [2, 0]], B: [[1, 1], [6, 0]] },
  e1b: { A: [[1, 1], [7, 0]], B: [[1, 1], [-7, 0]], dos: true }
};
function arcPath(svg, a, b, up, col, letter, stage) {
  const x1 = a.x, x2 = b.x, y1 = up ? a.t - 4 : a.b + 4, y2 = up ? b.t - 4 : b.b + 4, dx = Math.abs(x2 - x1);
  const peak = up ? Math.min(y1, y2) - (28 + dx * 0.3) : Math.max(y1, y2) + (28 + dx * 0.3);
  const cy = 2 * peak - (y1 + y2) / 2, mx = (x1 + x2) / 2;
  const p = svgEl('path', { d: `M${x1} ${y1} Q${mx} ${cy} ${x2} ${y2}`, fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' });
  const ang = Math.atan2(y2 - cy, x2 - mx), s = 11;
  const head = svgEl('polygon', { points: `${x2},${y2} ${x2 - s * Math.cos(ang - 0.45)},${y2 - s * Math.sin(ang - 0.45)} ${x2 - s * Math.cos(ang + 0.45)},${y2 - s * Math.sin(ang + 0.45)}`, fill: col });
  svg.append(p, head);
  const tag = add(stage, h('div', 'u3l5-ftag c', letter), mx, peak); tag.style.color = col; tag.style.borderColor = col;
  hide(head, tag); p.style.opacity = 0;
  return {
    async draw(c) {
      const len = p.getTotalLength() + 2; p.style.strokeDasharray = len; p.style.strokeDashoffset = len; p.style.opacity = 1;
      await c.anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], 480);
      await Promise.all([c.pop(head, 200), c.pop(tag, 300)]);
    }
  };
}
const recall = {
  title: 'FOIL: four arrows, four products',
  height: 410,
  minW: 860,
  value: 'n1',
  choices: [{ v: 'n1', label: tex('(x+3)(x+4)') }, { v: 'n2', label: tex('(x+5)(x-5)') }, { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' }],
  intro: (k) => { const d = RC[k]; return `Expand ${T(`${par(d.A)}${par(d.B)}`)} with <b>FOIL</b>: First, Outside, Inside, Last. Each bracket has exactly <b>two</b> terms.`; },
  make(stage, key, ex) {
    const W = ex.W, d = RC[key], { A, B } = d;
    const fac = (P, n) => P.map((t, k) => (k === 0 ? `\\htmlClass{u3l5-r${n}${k}}{${termT(t, true)}}` : `${t[0] < 0 ? '-' : '+'}\\htmlClass{u3l5-r${n}${k}}{${body(t[0], t[1])}}`)).join('');
    const svg = svgEl('svg', { width: W, height: 410, class: 'u3l5-arcs' }); at(svg, 0, 0); stage.appendChild(svg);
    const head = add(stage, h('div', 'u3l5-rhead c', K(`(${fac(A, 'a')})(${fac(B, 'b')})`)), 250, 196);
    const term = (n, k) => head.querySelector(`.u3l5-r${n}${k}`);
    const prods = FL.map(([, , i, j]) => mulT(A[i], B[j]));
    const bx = 520, bw = W - bx - 20;
    const boxes = FL.map(([L, word, i, j, , col], n) => {
      const e = add(stage, h('div', 'u3l5-fbox', `<i style="background:${col}">${L}</i><span class="u3l5-fw">${word}</span>${K(`${prodT(A[i], B[j])}=${termT(prods[n], true, { col: true })}`)}`), bx, 24 + n * 66);
      e.style.width = bw + 'px'; hide(e); return e;
    });
    const fin = collect(prods);
    const midIs = prods.slice(1, 3);
    const L1 = line(stage, `=${prods.map((p, n) => (n === 1 || n === 2 ? `\\htmlClass{u3l5-mid}{${termT(p, n === 0, { col: true })}}` : termT(p, n === 0, { col: true }))).join('')}`, bx, 300);
    const L2 = line(stage, `=\\boldsymbol{${polyT(fin)}}`, bx + 14, 356, 'u3l5-res');
    const arcs = [];
    const steps = FL.map(([L, word, i, j, up, col], n) => ({
      cap: `<b>${L}</b>${word.slice(1)}: ${T(`${prodT(A[i], B[j])}=${termT(prods[n], true)}`)}.` + (n === 1 ? ' Outside = the two <b>end</b> terms.' : n === 2 ? ' Inside = the two <b>middle</b> terms.' : '') + (prods[n][0] < 0 ? ' One factor is negative, so the product is <b>negative</b>.' : ''),
      run: async (c) => {
        if (!arcs[n]) arcs[n] = arcPath(svg, stagePos(stage, term('a', i)), stagePos(stage, term('b', j)), up > 0, col, L, stage);
        await arcs[n].draw(c);
        await c.fadeIn(boxes[n], 320);
      }
    }));
    const sum = midIs[0][0] + midIs[1][0];
    steps.push({
      cap: `Add the four products. The <b>Outside</b> and <b>Inside</b> products are like terms: ${T(`${polyT(midIs)}=${sum ? termT([sum, 1], true) : '0'}`)}${sum ? '' : ': they <b>cancel</b>'}.`,
      run: async (c) => { await c.fadeIn(L1, 380); L1.querySelectorAll('.u3l5-mid').forEach((e) => e.classList.add('lit')); await c.sleep(300); }
    }, {
      cap: `So ${T(`${par(A)}${par(B)}=${polyT(fin)}`)}.` + (d.dos ? ` That’s the <b>difference of squares</b> pattern: ${T(`a^2-b^2`)} with ${T('a=x')}, ${T(`b=${-B[1][0]}`)}. The pattern gets there in <b>one</b> step.` : ` Two terms times two terms: <b>4</b> products. With <b>three</b> terms in a bracket, FOIL runs out of letters. That’s today.`),
      run: (c) => c.pop(L2, 420)
    });
    return steps;
  }
};

/* =====================================================================
   2. From 23 × 123 to (2x + 3)(x² + 2x + 3): place value
   ===================================================================== */
const PV = {
  n23: { A: [[2, 1], [3, 0]], B: [[1, 2], [2, 1], [3, 0]], jordan: true },
  n13: { A: [[1, 1], [3, 0]], B: [[1, 2], [2, 1], [3, 0]] }
};
const at10 = ([c, e]) => c * 10 ** e;
const place = {
  title: 'Same grid, numbers or algebra',
  height: 452,
  minW: 900,
  value: 'n23',
  choices: [{ v: 'n23', label: '23 × 123 (the warm-up)' }, { v: 'n13', label: '13 × 123' }],
  intro: (k) => { const d = PV[k], a = d.A.reduce((s, t) => s + at10(t), 0), b = d.B.reduce((s, t) => s + at10(t), 0); return `Multiply ${a} × ${b} with a grid, the warm-up way. Then turn every 10 into an ${T('x')}.`; },
  make(stage, key, ex) {
    const W = ex.W, d = PV[key], { A, B } = d, m = A.length, n = B.length;
    const a = A.reduce((s, t) => s + at10(t), 0), b = B.reduce((s, t) => s + at10(t), 0);
    const lw = 96, cw = 140, rh = 112, hh = 64, x0 = 22, y0 = 82;
    const gw = lw + n * cw, gh = hh + m * rh;
    const headN = add(stage, h('div', 'u3l5-phead', K(`${a}\\times${b}`)), x0, 18);
    const headA = add(stage, h('div', 'u3l5-phead', K(`${par(A)}${par(B)}`)), x0, 18); hide(headA);
    const frame = add(stage, h('div', 'u3l5-gframe'), x0, y0); frame.style.width = gw + 'px'; frame.style.height = gh + 'px';
    add(stage, h('div', 'u3l5-gx c', '×'), x0 + lw / 2, y0 + hh / 2);
    const cx = (j) => x0 + lw + j * cw + cw / 2, cy = (i) => y0 + hh + i * rh + rh / 2;
    const lab = (src, x, y, cls = '') => add(stage, h('div', 'u3l5-glab c ' + cls, K(src)), x, y);
    const colN = B.map((t, j) => lab(tn(at10(t)), cx(j), y0 + hh / 2, 'num')), rowN = A.map((t, i) => lab(tn(at10(t)), x0 + lw / 2, cy(i), 'num'));
    const colA = B.map((t, j) => lab(termT(t, true), cx(j), y0 + hh / 2)), rowA = A.map((t, i) => lab(termT(t, true), x0 + lw / 2, cy(i)));
    hide(...colN, ...rowN, ...colA, ...rowA);
    const cells = A.map((r, i) => B.map((s, j) => {
      const p = mulT(r, s), bg = add(stage, h('div', 'u3l5-gcell'), x0 + lw + j * cw + 4, y0 + hh + i * rh + 4); bg.style.width = (cw - 8) + 'px'; bg.style.height = (rh - 8) + 'px';
      const nt = add(stage, h('div', 'u3l5-gt c num', K(tn(at10(p)))), cx(j), cy(i)), atx = add(stage, h('div', 'u3l5-gt c', K(termT(p, true, { col: true }))), cx(j), cy(i));
      hide(nt, atx); return { p, bg, nt, atx, i, j };
    }));
    const flat = cells.flat(), vals = flat.map((cl) => at10(cl.p)), total = a * b;
    const res = polyMul(A, B), all = flat.map((cl) => cl.p);
    const px = x0 + gw + 30, pw = W - px - 14;
    const panel = add(stage, h('div', 'u3l5-ppanel'), px, y0); panel.style.width = pw + 'px';
    const row = (src, note, cls = '') => { const e = h('div', 'u3l5-prow ' + cls, `<span class="u3l5-pk">${note}</span>${K(src)}`); panel.appendChild(e); hide(e); return e; };
    const r1 = row(`${a}=${A.map((t) => tn(at10(t))).join('+')},\\quad ${b}=${B.map((t) => tn(at10(t))).join('+')}`, 'split by place value');
    const r2 = row(`${vals.map(tn).join('+')}=\\boldsymbol{${tn(total)}}`, 'add all six boxes');
    const r3 = row(`${polyT(all, { col: true })}`, 'the same six, with x');
    const r4 = row(`=\\boldsymbol{${polyT(res)}}`, 'collect like terms', 'key');
    const r5 = row(`${res.map((t) => tn(at10(t))).join('+')}=${tn(total)}\\ \\checkmark`, 'back to numbers');
    [r1, r2, r3, r4, r5].forEach((r) => shrinkToFit(r, pw - 24));
    const likes = [...new Set(all.map((t) => t[1]))].filter((e) => all.filter((t) => t[1] === e).length > 1).sort((p, q) => q - p);
    const numPairs = likes.map((e) => flat.filter((cl) => cl.p[1] === e).map((cl) => tn(at10(cl.p))).join('+')).map((s) => T(s)).join(' and ');
    const rowCap = (i) => `${i ? 'Bottom' : 'Top'} row: ${B.map((s) => T(`${tn(at10(A[i]))}\\times${tn(at10(s))}=${tn(at10(mulT(A[i], s)))}`)).join(', ')}.`;
    const fillRow = (c, i) => Promise.all(cells[i].map((cl, q) => c.pop(cl.nt, 340, { delay: q * 220 })));
    const steps = [{
      cap: `Split each number by place value: ${T(`${a}=${A.map((t) => tn(at10(t))).join('+')}`)} and ${T(`${b}=${B.map((t) => tn(at10(t))).join('+')}`)}. That’s ${m} rows and ${n} columns.`,
      run: (c) => Promise.all([...colN.map((e, q) => c.pop(e, 320, { delay: q * 120 })), ...rowN.map((e, q) => c.pop(e, 320, { delay: 360 + q * 120 })), c.fadeIn(r1, 380, { delay: 300 })])
    }, { cap: rowCap(0), run: (c) => fillRow(c, 0) }, { cap: rowCap(1), run: (c) => fillRow(c, 1) }, {
      cap: `Add <b>all six</b> boxes: ${T(`${tn(a)}\\times${tn(b)}=${tn(total)}`)}.` + (d.jordan ? ` Jordan used only ${T('2\\,000')} and ${T('9')}, two of the six boxes.` : ''),
      run: (c) => c.fadeIn(r2, 380)
    }, {
      cap: `Now call ${T('10')} ${T('x')}. Then ${T('100=x^2')}, ${T('20=2x')}, and ${T('10=x')}. So ${T(`${b}`)} becomes ${T(polyT(B))} and ${T(`${a}`)} becomes ${T(polyT(A))}.`,
      run: (c) => Promise.all([fadeOut(c, headN, 250), c.fadeIn(headA, 380, { delay: 200 }), ...colN.concat(rowN).map((e) => fadeOut(c, e, 250)), ...colA.concat(rowA).map((e, q) => c.pop(e, 320, { delay: 250 + q * 80 }))])
    }, {
      cap: `Every box is still <b>row × column</b>: ${flat.map((cl) => T(`${prodT(A[cl.i], B[cl.j])}=${termT(cl.p, true)}`)).join(', ')}. The <b>same six</b> partial products.`,
      run: async (c) => {
        await Promise.all(flat.map((cl, q) => Promise.all([fadeOut(c, cl.nt, 250), c.pop(cl.atx, 340, { delay: 200 + q * 110 })])));
        flat.forEach((cl) => { cl.bg.style.background = degBg(cl.p[1]); });
        await c.fadeIn(r3, 380);
      }
    }, {
      cap: `Collect like terms: ${collectSentence(all)}. Those are the same boxes you added in the number grid (${numPairs}). Put ${T('x=10')} back in: ${T(tn(total))} ✓.`,
      run: async (c) => {
        const lk = flat.filter((cl) => likes.includes(cl.p[1]));
        await Promise.all(lk.map((cl) => glow(c, cl.bg, '15,122,116')));
        await c.pop(r4, 400); await c.fadeIn(r5, 380);
      }
    }];
    return steps;
  }
};

/* =====================================================================
   2a. Shake hands: every term × every term (from Math 10C 3.4)
   ===================================================================== */
const HS = {
  n22: { A: [[1, 1], [2, 0]], B: [[1, 1], [5, 0]] },
  n23: { A: [[1, 1], [3, 0]], B: [[1, 2], [5, 1], [2, 0]] },
  foil: { A: [[1, 1], [3, 0]], B: [[1, 2], [2, 1], [4, 0]], foil: true },
  ex2: { A: [[1, 1], [2, 0]], B: [[1, 2], [4, 1], [5, 0]] }
};
const HANDS = ['#c93a33', '#2f5fa8'];
const NAMES = { 1: 'monomial', 2: 'binomial', 3: 'trinomial' };
const handshake = {
  title: 'Every term shakes hands with every term',
  height: 432,
  minW: 940,
  value: 'n23',
  choices: [{ v: 'n22', label: '2 × 2' }, { v: 'n23', label: '2 × 3' }, { v: 'foil', label: 'Why FOIL fails' }, { sep: 'Example 2 check:' }, { v: 'ex2', label: tex('(x+2)(x^2+4x+5)') }],
  intro: (k) => { const d = HS[k]; return d.foil ? `Try FOIL on ${T(`${par(d.A)}${par(d.B)}`)}: First, Outer, Inner, Last. Does it catch every product?` : `${T(`${par(d.A)}${par(d.B)}`)}: a ${NAMES[d.A.length]} times a ${NAMES[d.B.length]}. Every term on the left shakes hands with <b>every</b> term on the right.`; },
  make(stage, key, ex) {
    const W = ex.W, H = 432, d = HS[key], { A, B } = d, m = A.length, n = B.length;
    const xL = 104, xR = 360, bw = 104, yc = 222, gap = 88;
    const yOf = (i, k) => yc + (i - (k - 1) / 2) * gap;
    add(stage, h('div', 'u3l5-hs-head c', K(`${par(A)}${par(B)}`)), W / 2, 34);
    add(stage, h('div', 'u3l5-hs-colh c', `${m} terms`), xL, yOf(0, Math.max(m, n)) - 52 + (Math.max(m, n) - m) * gap / 2);
    add(stage, h('div', 'u3l5-hs-colh c', `${n} terms`), xR, yOf(0, Math.max(m, n)) - 52 + (Math.max(m, n) - n) * gap / 2);
    const svg = svgEl('svg', { width: W, height: H, class: 'u3l5-hs-svg' }); at(svg, 0, 0); stage.appendChild(svg);
    const Lb = A.map((t, i) => { const e = add(stage, h('div', 'u3l5-hs-p c', K(termT(t, true))), xL, yOf(i, m)); e.style.borderColor = HANDS[i]; e.style.width = bw + 'px'; return e; });
    const Rb = B.map((t, j) => { const e = add(stage, h('div', 'u3l5-hs-p c', K(termT(t, true))), xR, yOf(j, n)); e.style.width = bw + 'px'; return e; });
    const lines = A.map((_, i) => B.map((_, j) => {
      const ln = svgEl('line', { x1: xL + bw / 2, y1: yOf(i, m), x2: xR - bw / 2, y2: yOf(j, n), stroke: HANDS[i], 'stroke-width': 4, 'stroke-linecap': 'round' });
      ln.style.opacity = 0; svg.appendChild(ln); return ln;
    }));
    const px = 440, pw = W - px - 10, colW = pw / m;
    add(stage, h('div', 'u3l5-hs-ph', 'Partial products'), px, 64);
    const chips = A.map((a, i) => B.map((b, j) => {
      const p = mulT(a, b);
      const e = add(stage, h('div', 'u3l5-hs-chip', `<i style="background:${HANDS[i]}">${i * n + j + 1}</i>${K(`${prodT(a, b)}=\\textcolor{${degCol(p[1])}}{${termT(p, true)}}`)}`), px + i * colW, 100 + j * 50);
      e.style.width = (colW - 6) + 'px'; hide(e); return e;
    }));
    const all = partials(A, B), res = collect(all), mn = m * n;
    const count = add(stage, h('div', 'u3l5-hs-count', `${m} × ${n} = <b>${mn}</b> partial products`), px, 100 + n * 50 + 6); hide(count);
    const fin = add(stage, h('div', 'u3l5-hs-fin c', K(`=${polyT(all, { col: true })}=\\boldsymbol{${polyT(res)}}`)), W / 2, H - 34); hide(fin);
    const showProducts = (c, i, js) => Promise.all(js.map((j, q) => Promise.all([drawLine(c, lines[i][j], 380, { delay: q * 330 }), c.fadeIn(chips[i][j], 320, { delay: q * 330 + 250 })])));
    const steps = [];
    if (d.foil) {
      const FO = [[0, 0, 'F', 0.45], [0, n - 1, 'O', 0.8], [1, 0, 'I', 0.8], [1, n - 1, 'L', 0.45]];
      const tags = FO.map(([i, j, t, f]) => { const x1 = xL + bw / 2, y1 = yOf(i, m), x2 = xR - bw / 2, y2 = yOf(j, n); const e = add(stage, h('div', 'u3l5-hs-tag c', t), x1 + (x2 - x1) * f, y1 + (y2 - y1) * f); e.style.color = HANDS[i]; hide(e); return e; });
      steps.push({
        cap: `<b>FOIL</b>: First ${T(prodT(A[0], B[0]))}, Outer ${T(prodT(A[0], B[n - 1]))}, Inner ${T(prodT(A[1], B[0]))}, Last ${T(prodT(A[1], B[n - 1]))}. That’s only <b>4</b> products.`,
        run: (c) => Promise.all(FO.map(([i, j], q) => Promise.all([drawLine(c, lines[i][j], 380, { delay: q * 380 }), c.fadeIn(chips[i][j], 300, { delay: q * 380 + 250 }), c.pop(tags[q], 300, { delay: q * 380 + 200 })])))
      }, {
        cap: `Nobody shook hands with ${T(termT(B[1], true))}! FOIL was made for <b>2 × 2</b>. A binomial times a trinomial needs ${T('2\\times3=6')} products, so FOIL <b>misses two</b>.`,
        run: async (c) => { Rb[1].classList.add('lonely'); await c.shake(Rb[1]); }
      }, {
        cap: `Add the two missing handshakes: ${T(`${prodT(A[0], B[1])}=${termT(mulT(A[0], B[1]), true)}`)} and ${T(`${prodT(A[1], B[1])}=${termT(mulT(A[1], B[1]), true)}`)}. Now <b>every</b> term has met <b>every</b> term.`,
        run: async (c) => { Rb[1].classList.remove('lonely'); await Promise.all([0, 1].map((i, q) => Promise.all([drawLine(c, lines[i][1], 380, { delay: q * 380 }), c.fadeIn(chips[i][1], 300, { delay: q * 380 + 250 })]))); }
      });
    } else {
      A.forEach((a, i) => steps.push({
        cap: `${T(termT(a, true))} shakes hands with <b>every</b> term: ${B.map((b) => T(`${prodT(a, b)}=${termT(mulT(a, b), true)}`)).join(', ')}.`,
        run: (c) => { Lb[i].classList.add('on'); return showProducts(c, i, B.map((_, j) => j)); }
      }));
    }
    steps.push({
      cap: mn === 4 ? `${T('2\\times2=4')} partial products: <b>F</b>irst, <b>O</b>uter, <b>I</b>nner, <b>L</b>ast. That’s <b>FOIL</b>.`
        : `A ${m}-term times a ${n}-term polynomial: ${T(`${m}\\times${n}=${mn}`)} partial products <b>before</b> any like terms are collected.`,
      run: (c) => c.pop(count, 400)
    }, {
      cap: `Add all ${mn} and <b>collect like terms</b> (same colour)${collectSentence(all) ? ': ' + collectSentence(all) : ''}.`,
      run: (c) => c.fadeIn(fin, 450)
    });
    return steps;
  }
};

/* =====================================================================
   2b. The grid (and 4. the signs): rows × columns, then like terms along the diagonals
   ===================================================================== */
const GRID = {
  n1: { A: [[1, 1], [4, 0]], B: [[1, 2], [3, 1], [5, 0]] },
  ex2: { A: [[1, 1], [2, 0]], B: [[1, 2], [4, 1], [5, 0]] },
  e3a: { A: [[2, 1], [1, 0]], B: [[1, 2], [3, 1], [4, 0]] },
  e3b: { A: [[3, 1], [4, 0]], B: [[1, 2], [2, 1], [1, 0]] },
  s1: { A: [[1, 1], [-2, 0]], B: [[1, 2], [-4, 1], [1, 0]] },
  e4a: { A: [[1, 1], [-3, 0]], B: [[1, 2], [2, 1], [-5, 0]] },
  e4b: { A: [[2, 1], [-1, 0]], B: [[1, 2], [-3, 1], [4, 0]] }
};
const sgn = (t) => (t[0] < 0 ? '-' : '+');
function gridMake(stage, d, ex, signs) {
  const W = ex.W, { A, B } = d, m = A.length, n = B.length;
  const lw = 110, cw = 150, rh = signs ? 112 : 104, hh = 64, x0 = 22, y0 = 74;
  const gw = lw + n * cw, gh = hh + m * rh;
  add(stage, h('div', 'u3l5-gr-head', K(`${par(A)}${par(B)}`)), x0, 14);
  const frame = add(stage, h('div', 'u3l5-gframe'), x0, y0); frame.style.width = gw + 'px'; frame.style.height = gh + 'px';
  add(stage, h('div', 'u3l5-gx c', '×'), x0 + lw / 2, y0 + hh / 2);
  const cx = (j) => x0 + lw + j * cw + cw / 2, cy = (i) => y0 + hh + i * rh + rh / 2;
  const badge = (t) => (signs ? `<b class="u3l5-sb ${t[0] < 0 ? 'neg' : 'pos'}">${t[0] < 0 ? '−' : '+'}</b>` : '');
  const labT = (t) => (signs ? body(t[0], t[1]) : termT(t, true)); // with sign badges, the badge carries the sign
  const colL = B.map((b, j) => add(stage, h('div', 'u3l5-glab c', badge(b) + K(labT(b))), cx(j), y0 + hh / 2));
  const rowL = A.map((a, i) => add(stage, h('div', 'u3l5-glab c', badge(a) + K(labT(a))), x0 + lw / 2, cy(i)));
  const cells = A.map((a, i) => B.map((b, j) => {
    const p = mulT(a, b);
    const bg = add(stage, h('div', 'u3l5-gcell'), x0 + lw + j * cw + 4, y0 + hh + i * rh + 4); bg.style.width = (cw - 8) + 'px'; bg.style.height = (rh - 8) + 'px';
    return { p, i, j, bg };
  }));
  const svg = svgEl('svg', { width: W, height: ex.def.height, class: 'u3l5-gr-svg' }); at(svg, 0, 0); stage.appendChild(svg);
  const flat = cells.flat();
  flat.forEach((cl) => {
    cl.t = add(stage, h('div', 'u3l5-gt c', K(termT(cl.p, true))), cx(cl.j), cy(cl.i) + (signs ? 10 : 0)); hide(cl.t);
    if (signs) { cl.s = add(stage, h('div', 'u3l5-gs c ' + (cl.p[0] < 0 ? 'neg' : 'pos'), K(`(${sgn(A[cl.i])})(${sgn(B[cl.j])})=${sgn(cl.p)}`)), cx(cl.j), cy(cl.i) - 30); hide(cl.s); }
  });
  const degs = [...new Set(flat.map((cl) => cl.p[1]))].sort((a, b) => b - a);
  const groups = degs.map((e) => ({ e, cl: flat.filter((cl) => cl.p[1] === e) }));
  const strips = groups.filter((g) => g.cl.length > 1).map((g) => {
    const pts = g.cl.map((cl) => [cx(cl.j), cy(cl.i) + (signs ? 10 : 0)]).sort((p, q) => p[0] - q[0]);
    const ln = svgEl('polyline', { points: pts.map((p) => p.join(',')).join(' '), stroke: degCol(g.e), 'stroke-width': 44, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', 'stroke-opacity': 0.22 });
    ln.style.opacity = 0; svg.insertBefore(ln, svg.firstChild); return ln;
  });
  const pxx = x0 + gw + 30, pw = W - pxx - 16;
  const panel = add(stage, h('div', 'u3l5-gr-panel'), pxx, y0); panel.style.width = pw + 'px';
  panel.innerHTML = '<div class="u3l5-gr-ph">Add each colour</div>';
  const rows = groups.map((g) => {
    const sumC = g.cl.reduce((s, cl) => s + cl.p[0], 0);
    const src = g.cl.length > 1 ? `${polyT(g.cl.map((cl) => cl.p))}=${sumC === 0 ? '0' : termT([sumC, g.e], true)}` : termT(g.cl[0].p, true);
    const r = h('div', 'u3l5-gr-row', K(`\\textcolor{${degCol(g.e)}}{${src}}`)); panel.appendChild(r); hide(r); return r;
  });
  const res = polyMul(A, B);
  const fin = add(stage, h('div', 'u3l5-gr-fin c', K(`${par(A)}${par(B)}=\\boldsymbol{${polyT(res)}}`)), W / 2, ex.def.height - 34); hide(fin);
  const steps = A.map((a, i) => ({
    cap: `<b>Row ${i + 1}:</b> ${T(termT(a, true))} times each column. ${B.map((b) => T(`${prodT(a, b)}=${termT(mulT(a, b), true)}`)).join(', &nbsp;')}.` + (signs ? (a[0] < 0 ? ' A <b>negative</b> row: every sign is worked out on its own.' : ' Positive row: each product keeps the column’s sign.') : ''),
    run: async (c) => {
      rowL.forEach((r, q) => r.classList.toggle('hl', q === i));
      for (let j = 0; j < n; j++) {
        colL.forEach((cL, q) => cL.classList.toggle('hl', q === j));
        if (signs) await c.pop(cells[i][j].s, 300);
        await c.pop(cells[i][j].t, 340);
        await c.sleep(100);
      }
      colL.forEach((cL) => cL.classList.remove('hl'));
    }
  }));
  if (signs) {
    const nn = flat.filter((cl) => A[cl.i][0] < 0 && B[cl.j][0] < 0);
    if (nn.length) steps.push({
      cap: `Look at ${nn.length > 1 ? 'the cells' : 'the cell'} where <b>both</b> terms are negative: ${nn.map((cl) => T(`${prodT(A[cl.i], B[cl.j])}=${termT(cl.p, true)}`)).join(', ')}. Negative × negative is <b>positive</b>, even though both brackets show a minus.`,
      run: async (c) => { rowL.forEach((r) => r.classList.remove('hl')); await Promise.all(nn.map((cl) => glow(c, cl.bg, '18,128,90'))); nn.forEach((cl) => cl.bg.classList.add('pp')); }
    });
  }
  steps.push({
    cap: `${m} × ${n} = <b>${m * n}</b> cells. Now colour the <b>like terms</b> (same power of ${T('x')}). They line up along the <b>diagonals</b>.`,
    run: async (c) => {
      rowL.forEach((r) => r.classList.remove('hl'));
      flat.forEach((cl) => { cl.t.style.color = degCol(cl.p[1]); cl.bg.style.background = degBg(cl.p[1]); });
      await Promise.all(strips.map((s, q) => c.anim(s, [{ opacity: 0 }, { opacity: 1 }], 450, { delay: q * 200 })));
    }
  }, {
    cap: `Add each colour: ${collectSentence(flat.map((cl) => cl.p))}. So ${T(`${par(A)}${par(B)}=${polyT(res)}`)}.`,
    run: async (c) => { for (let q = 0; q < rows.length; q++) await c.fadeIn(rows[q], 300, { from: 'translateX(-8px)' }); await c.pop(fin, 420); }
  });
  return steps;
}
const grid = {
  title: 'The grid: six cells, then collect',
  height: 450,
  minW: 900,
  value: 'n1',
  choices: [{ v: 'n1', label: tex('(x+4)(x^2+3x+5)') }, { sep: 'Example 2 check:' }, { v: 'ex2', label: '(i)' }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }],
  intro: (k) => { const d = GRID[k]; return `Expand ${T(`${par(d.A)}${par(d.B)}`)} with a grid. The binomial labels the <b>rows</b>, the trinomial the <b>columns</b>. Each cell = row × column.`; },
  make: (stage, key, ex) => gridMake(stage, GRID[key], ex, false)
};
const signs = {
  title: 'Signs first, then the numbers',
  height: 480,
  minW: 900,
  value: 's1',
  choices: [{ v: 's1', label: tex('(x-2)(x^2-4x+1)') }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }],
  intro: (k) => { const d = GRID[k]; return `Expand ${T(`${par(d.A)}${par(d.B)}`)}. Every term carries its <b>own sign</b> (the badge). Find the sign of each cell first, then the number.`; },
  make: (stage, key, ex) => gridMake(stage, GRID[key], ex, true)
};

/* =====================================================================
   2c. The systematic list (booklet Example 2(ii))
   ===================================================================== */
const LS = {
  n1: { A: [[1, 1], [3, 0]], B: [[1, 2], [1, 1], [4, 0]] },
  ex2: { A: [[1, 1], [2, 0]], B: [[1, 2], [4, 1], [5, 0]] },
  e3a: { A: [[2, 1], [1, 0]], B: [[1, 2], [3, 1], [4, 0]] },
  e3b: { A: [[3, 1], [4, 0]], B: [[1, 2], [2, 1], [1, 0]] }
};
const list = {
  title: 'A list: each binomial term times the whole trinomial',
  height: 470,
  minW: 860,
  value: 'n1',
  choices: [{ v: 'n1', label: tex('(x+3)(x^2+x+4)') }, { sep: 'Example 2 check:' }, { v: 'ex2', label: '(ii)' }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }],
  intro: (k) => { const d = LS[k]; return `Expand ${T(`${par(d.A)}${par(d.B)}`)} as a <b>list</b>. The first term of the binomial multiplies all three terms, then the second term does.`; },
  make(stage, key, ex) {
    const W = ex.W, d = LS[key], { A, B } = d;
    add(stage, h('div', 'u3l5-ls-head c', K(`${par(A)}${par(B)}`)), W / 2, 30);
    const dist = A.map((a, i) => `\\textcolor{${HANDS[i]}}{${termT(a, i === 0)}${par(B)}}`).join('');
    const L0 = add(stage, h('div', 'u3l5-ls-dist c', K(`=${dist}`)), W / 2, 86); hide(L0);
    const colW = 330, gx = (W - 2 * colW - 30) / 2;
    const prods = A.map((a, i) => B.map((b, j) => {
      const p = mulT(a, b);
      const e = add(stage, h('div', 'u3l5-ls-p', `<i style="background:${HANDS[i]}">${i * B.length + j + 1}</i>${K(`${prodT(a, b)}=\\textcolor{${degCol(p[1])}}{${termT(p, true)}}`)}`), gx + i * (colW + 30), 134 + j * 50);
      e.style.width = colW + 'px'; e.style.borderColor = HANDS[i]; hide(e); return { e, p };
    }));
    const all = partials(A, B), res = collect(all);
    const L1 = line(stage, `=${polyT(all, { col: true })}`, 60, 296);
    const L2 = line(stage, `=${groupedT(all, { col: true })}`, 60, 348);
    const L3 = line(stage, `=\\boldsymbol{${polyT(res)}}`, 60, 404, 'u3l5-res');
    [L1, L2, L3].forEach((e) => shrinkToFit(e, W - 80));
    return [{
      cap: `Distribute: ${T(termT(A[0], true))} multiplies the <b>whole</b> trinomial, then ${T(termT(A[1], true))} does too.`,
      run: (c) => c.fadeIn(L0, 400)
    }, ...A.map((a, i) => ({
      cap: `${T(termT(a, true))} times each term: ${B.map((b) => T(`${prodT(a, b)}=${termT(mulT(a, b), true)}`)).join(', ')}.`,
      run: (c) => Promise.all(prods[i].map((x, q) => c.fadeIn(x.e, 320, { delay: q * 260, from: 'translateX(-10px)' })))
    })), {
      cap: `That’s all <b>six</b> products. Write them in one line.`,
      run: (c) => c.fadeIn(L1, 400)
    }, {
      cap: `Group the <b>like terms</b>: same colour, same power of ${T('x')}.`,
      run: (c) => c.fadeIn(L2, 400)
    }, {
      cap: `Collect: ${collectSentence(all)}. So ${T(`${par(A)}${par(B)}=${polyT(res)}`)}, the same as the grid gives.`,
      run: (c) => c.pop(L3, 420)
    }];
  }
};

/* =====================================================================
   3. Sort the six partial products into bins by power
   ===================================================================== */
const SO = {
  n1: { A: [[1, 1], [6, 0]], B: [[1, 2], [2, 1], [1, 0]] },
  e3a: { A: [[2, 1], [1, 0]], B: [[1, 2], [3, 1], [4, 0]] },
  e3b: { A: [[3, 1], [4, 0]], B: [[1, 2], [2, 1], [1, 0]] }
};
const sort = {
  title: 'Sort the six products by power',
  height: 470,
  minW: 860,
  value: 'n1',
  choices: [{ v: 'n1', label: tex('(x+6)(x^2+2x+1)') }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }],
  intro: (k) => { const d = SO[k]; return `Expand ${T(`${par(d.A)}${par(d.B)}`)}. First write all six partial products, then sort them by their power of ${T('x')}.`; },
  make(stage, key, ex) {
    const W = ex.W, d = SO[key], { A, B } = d, all = partials(A, B), res = collect(all);
    add(stage, h('div', 'u3l5-so-head', K(`${par(A)}${par(B)}=`)), 24, 18);
    const lab = add(stage, h('div', 'u3l5-so-lab', 'the six partial products'), 24, 70); hide(lab);
    const cw = (W - 48) / 6;
    const chips = all.map((p, q) => { const e = add(stage, h('div', 'u3l5-so-chip c', K(termT(p, true))), 24 + q * cw + cw / 2, 112); e.style.borderColor = degCol(p[1]); e.style.color = degCol(p[1]); hide(e); return e; });
    const degs = [3, 2, 1, 0], bw = (W - 48 - 3 * 14) / 4;
    const bins = degs.map((e, q) => {
      const x = 24 + q * (bw + 14), b = add(stage, h('div', 'u3l5-so-bin'), x, 168); b.style.width = bw + 'px'; b.style.borderColor = degCol(e); b.style.background = degBg(e);
      b.innerHTML = `<div class="u3l5-so-bh" style="color:${degCol(e)}">${K(e === 0 ? '\\text{number}' : e === 1 ? 'x' : `x^{${e}}`)}</div>`;
      return { x, e, b };
    });
    const sums = bins.map((bn) => {
      const g = all.filter((t) => t[1] === bn.e), s = g.reduce((a, t) => a + t[0], 0);
      const e = add(stage, h('div', 'u3l5-so-sum c', K(g.length > 1 ? `${polyT(g)}=\\boldsymbol{${termT([s, bn.e], true)}}` : `\\boldsymbol{${termT([s, bn.e], true)}}`)), bn.x + bw / 2, 342); e.style.color = degCol(bn.e); hide(e); shrinkToFit(e, bw - 8); return e;
    });
    const fin = add(stage, h('div', 'u3l5-so-fin c', K(`${par(A)}${par(B)}=\\boldsymbol{${polyT(res, { col: true })}}`)), W / 2, 410); hide(fin);
    const coef = add(stage, h('div', 'u3l5-so-coef c', K(res.map((t, i) => `${'abcd'[3 - t[1]]}=${t[0]}`).join(',\\ \\ '))), W / 2, 450); hide(coef);
    const cnt = {}; const target = all.map((p) => { const k = cnt[p[1]] = (cnt[p[1]] || 0) + 1; const bn = bins.find((b) => b.e === p[1]); return [bn.x + bw / 2, 240 + (k - 1) * 50]; });
    return [{
      cap: `Every term times every term: ${all.map((p) => T(termT(p, true))).join(', ')}. Six partial products.`,
      run: (c) => Promise.all([c.fadeIn(lab, 300), ...chips.map((e, q) => c.pop(e, 330, { delay: q * 140 }))])
    }, {
      cap: `Sort them by power: <b>one</b> ${T('x^3')} term, <b>two</b> ${T('x^2')} terms, <b>two</b> ${T('x')} terms and <b>one</b> number.`,
      run: (c) => Promise.all(chips.map((e, q) => c.anim(e, [{ left: e.style.left, top: e.style.top }, { left: target[q][0] + 'px', top: target[q][1] + 'px' }], 700, { delay: q * 110, easing: 'cubic-bezier(.5,0,.3,1)' })))
    }, {
      cap: `Combine each pair of like terms: ${collectSentence(all)}.`,
      run: (c) => Promise.all(sums.map((e, q) => c.pop(e, 380, { delay: q * 160 })))
    }, {
      cap: `Write the result from the highest power down: ${T(polyT(res))}. It has the form ${T('ax^3+bx^2+cx+d')}.`,
      run: async (c) => { await c.pop(fin, 420); await c.fadeIn(coef, 350); }
    }];
  }
};

/* =====================================================================
   5. A product combined with another polynomial
   ===================================================================== */
const CB = {
  n1: { A: [[1, 1], [1, 0]], B: [[1, 2], [2, 1], [2, 0]], s: -1, O: [[1, 2], [1, 1], [1, 0]] },
  e5a: { A: [[1, 1], [4, 0]], B: [[1, 2], [-2, 1], [3, 0]], s: -1, O: [[1, 2], [5, 1], [-6, 0]] },
  e5b: { A: [[2, 1], [-3, 0]], B: [[1, 2], [1, 1], [-4, 0]], s: 1, O: [[3, 2], [-2, 1], [5, 0]] }
};
const cbQ = (d) => `${par(d.A)}${par(d.B)}${d.s < 0 ? '-' : '+'}${par(d.O)}`;
const combo = {
  title: 'Expand the product first, then combine',
  height: 470,
  minW: 900,
  value: 'n1',
  choices: [{ v: 'n1', label: tex('(x+1)(x^2+2x+2)-(x^2+x+1)') }, { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }, { v: 'e5b', label: '(b)' }],
  intro: (k) => `Simplify ${T(cbQ(CB[k]))}. Step 1: expand the product <b>completely</b>. Step 2: the sign in front of the bracket. Step 3: collect.`,
  make(stage, key, ex) {
    const W = ex.W, d = CB[key], { A, B, O, s } = d;
    const all = partials(A, B), P = collect(all), O2 = O.map(([c, e]) => [c * s, e]), every = P.concat(O2), res = collect(every);
    add(stage, h('div', 'u3l5-cb-head c', K(cbQ(d))), W / 2, 30);
    const tag = (t) => `<span class="u3l5-cb-k">${t}</span>`;
    const r1 = add(stage, h('div', 'u3l5-cb-row', tag('Step 1') + K(`${par(A)}${par(B)}=${polyT(all, { col: true })}`)), 30, 76); hide(r1);
    const r2 = add(stage, h('div', 'u3l5-cb-row', tag('collect') + K(`=${polyT(P, { col: true })}`)), 30, 136); hide(r2);
    const r3 = add(stage, h('div', 'u3l5-cb-row', tag('Step 2')), 30, 196); hide(r3);
    const left = h('span', 'u3l5-cb-sg', K(`${s < 0 ? '-' : '+'}${par(O, { col: true })}`)), arr = h('span', 'u3l5-cb-arr', '→');
    const right = h('span', 'u3l5-cb-t' + (s < 0 ? ' flip' : ''), K(polyT(O2, { col: true }).replace(/^(?=[^-])/, '+')));
    r3.append(left, arr, right); hide(arr, right);
    const r4 = add(stage, h('div', 'u3l5-cb-row', tag('Step 3') + K(`${polyT(P, { col: true })}${polyT(O2, { col: true }).replace(/^(?=[^-])/, '+')}`)), 30, 256); hide(r4);
    const r5 = add(stage, h('div', 'u3l5-cb-row', tag('group') + K(`=${groupedT(every, { col: true })}`)), 30, 316); hide(r5);
    const r6 = add(stage, h('div', 'u3l5-cb-row res', tag('answer') + K(`=\\boldsymbol{${polyT(res)}}`)), 30, 380); hide(r6);
    [r1, r2, r4, r5].forEach((e) => shrinkToFit(e, W - 50));
    return [{
      cap: `<b>Step 1:</b> expand the product. Every term times every term: <b>six</b> partial products.`,
      run: (c) => c.fadeIn(r1, 400)
    }, {
      cap: `Collect the product’s like terms: ${collectSentence(all)}. The product is ${T(polyT(P))}.`,
      run: (c) => c.fadeIn(r2, 400)
    }, s < 0 ? {
      cap: `<b>Step 2:</b> a <b>minus</b> sign in front of the bracket flips <b>every</b> term inside: ${T(`-${par(O)}=${polyT(O2)}`)}.`,
      run: async (c) => {
        await c.fadeIn(r3, 350);
        await Promise.all([c.fadeIn(arr, 300, { from: 'translateX(-8px)' }), c.anim(right, [{ opacity: 0, transform: 'rotateX(90deg)' }, { opacity: 1, transform: 'rotateX(0)' }], 500, { delay: 250 })]);
      }
    } : {
      cap: `<b>Step 2:</b> a <b>plus</b> sign in front changes nothing. Every term keeps its sign: ${T(`+${par(O)}=${polyT(O2).replace(/^(?=[^-])/, '+')}`)}.`,
      run: async (c) => { await c.fadeIn(r3, 350); await Promise.all([c.fadeIn(arr, 300, { from: 'translateX(-8px)' }), c.fadeIn(right, 400, { delay: 250 })]); }
    }, {
      cap: `<b>Step 3:</b> write the product and the other polynomial together, then group the <b>like terms</b> (same colour).`,
      run: async (c) => { await c.fadeIn(r4, 380); await c.fadeIn(r5, 380); }
    }, {
      cap: `Collect: ${collectSentence(every)}. So ${T(`${cbQ(d)}=${polyT(res)}`)}.`,
      run: (c) => c.pop(r6, 420)
    }];
  }
};

/* =====================================================================
   Warm-up: the Combo Counter (menu grid + 23 × 123 grid)
   ===================================================================== */
const ICON = {
  burger: '<path d="M10 22a20 13 0 0 1 40 0z" fill="#e1a550" stroke="#784128" stroke-width="1.4"/><path d="M8 25q4-4 8 0t8 0t8 0t8 0t8 0" fill="none" stroke="#50a046" stroke-width="3.4" stroke-linecap="round"/><rect x="9" y="27" width="42" height="7" rx="3" fill="#784128"/><rect x="11" y="35" width="38" height="6" rx="3" fill="#e1a550" stroke="#784128" stroke-width="1.2"/><circle cx="22" cy="15" r="1.2" fill="#ffecb3"/><circle cx="30" cy="12" r="1.2" fill="#ffecb3"/><circle cx="38" cy="15" r="1.2" fill="#ffecb3"/>',
  taco: '<circle cx="15" cy="23" r="4.5" fill="#50a046"/><circle cx="24" cy="20" r="5" fill="#50a046"/><circle cx="34" cy="21" r="4.5" fill="#50a046"/><circle cx="43" cy="23" r="4.5" fill="#50a046"/><circle cx="20" cy="22" r="2.6" fill="#d23c32"/><circle cx="38" cy="21" r="2.6" fill="#d23c32"/><path d="M8 25a22 15 0 0 0 44 0z" fill="#f7da8f" stroke="#c88c14" stroke-width="1.8"/>',
  hotdog: '<rect x="6" y="20" width="48" height="9" rx="4.5" fill="#b4462d"/><path d="M10 24q4-4 8 0t8 0t8 0t8 0t8 0" fill="none" stroke="#f2c200" stroke-width="2.4"/><path d="M8 27a22 9 0 0 0 44 0z" fill="#e1a550" stroke="#784128" stroke-width="1.4"/>',
  fries: '<g fill="#f3cf7a" stroke="#c88c14" stroke-width=".8"><rect x="18" y="6" width="4" height="20"/><rect x="23" y="3" width="4" height="23"/><rect x="28" y="5" width="4" height="21"/><rect x="33" y="2" width="4" height="24"/><rect x="38" y="8" width="4" height="18"/></g><path d="M15 18h30l-4 22H19z" fill="#d23c32" stroke="#a42c24" stroke-width="1.2"/>',
  salad: '<circle cx="18" cy="22" r="6" fill="#50a046"/><circle cx="27" cy="18" r="7" fill="#66b85a"/><circle cx="37" cy="19" r="6.5" fill="#50a046"/><circle cx="44" cy="23" r="5" fill="#66b85a"/><circle cx="30" cy="20" r="2.6" fill="#d23c32"/><circle cx="21" cy="19" r="2.2" fill="#d23c32"/><path d="M8 25a22 15 0 0 0 44 0z" fill="#6e96d2" stroke="#3e5f94" stroke-width="1.4"/>',
  soup: '<g fill="none" stroke="#8a93a6" stroke-width="2" stroke-linecap="round"><path d="M22 20q-4-5 0-9t0-9"/><path d="M30 20q-4-5 0-9t0-9"/><path d="M38 20q-4-5 0-9t0-9"/></g><path d="M8 25a22 15 0 0 0 44 0z" fill="#6e96d2" stroke="#3e5f94" stroke-width="1.4"/><ellipse cx="30" cy="25" rx="21.5" ry="3" fill="#e0a24a"/>'
};
const ico = (k) => `<svg class="u3l5-ico" viewBox="0 0 60 44" aria-hidden="true">${ICON[k]}</svg>`;
function mountWarmup() {
  const host = document.getElementById('u3l5-wu'); if (!host) return;
  const sides = [['fries', 'Fries'], ['salad', 'Salad'], ['soup', 'Soup']], mains = [['burger', 'Burger'], ['taco', 'Taco'], ['hotdog', 'Hot dog']];
  const cell = (mi, si) => (mi === 0 && si === 0 ? `<td class="given">${mains[mi][1]}<br>+ ${sides[si][1]}</td>` : `<td><span data-reveal>${mains[mi][1]}<br>+ ${sides[si][1]}</span></td>`);
  const menu = `<div class="u3l5-mg"><div class="u3l5-wh">Mains × Sides</div><table class="u3l5-menu">
      <tr><th></th>${sides.map(([k, n]) => `<th>${ico(k)}<span>${n}</span></th>`).join('')}</tr>
      ${mains.map(([k, n], mi) => `<tr class="${mi === 2 ? 'u3l5-hd' : ''}"><th>${ico(k)}<span>${n}</span></th>${sides.map((_, si) => cell(mi, si)).join('')}</tr>`).join('')}
    </table><div class="u3l5-mctl"><button class="pill small" type="button" id="u3l5-hot">+ Hot dog</button><span class="u3l5-mcount" id="u3l5-mcount"></span></div></div>`;
  const nums = [[2000, 400, 60], [300, 60, 9]];
  const numg = `<div class="u3l5-ng"><div class="u3l5-wh">${K('23\\times123')} the same way</div><div class="u3l5-wsub">${K('23=20+3')} &nbsp;&nbsp; ${K('123=100+20+3')}</div><table class="u3l5-num">
      <tr><th>×</th><th>100</th><th>20</th><th>3</th></tr>
      ${[20, 3].map((r, i) => `<tr><th>${r}</th>${nums[i].map((v, j) => ((i === 0 && j === 0) || (i === 1 && j === 2) ? `<td class="given">${fmt(v)}</td>` : `<td><span data-reveal>${fmt(v)}</span></td>`)).join('')}</tr>`).join('')}
    </table></div>`;
  host.innerHTML = menu + numg;
  const hot = host.querySelector('#u3l5-hot'), cnt = host.querySelector('#u3l5-mcount');
  const upd = () => { const on = host.classList.contains('hot'); cnt.innerHTML = `${on ? 3 : 2} mains × 3 sides = <span data-reveal>${on ? 9 : 6}</span> combos`; hot.textContent = on ? '− Hot dog' : '+ Hot dog'; };
  hot.addEventListener('click', async () => { host.classList.toggle('hot'); upd(); try { (await import('../blocks.js')).wireBlocks(cnt); } catch (e) { /* the count still shows */ } });
  upd();
}

/* ============ wiring ============ */
function mountAll() {
  const defs = { recall, place, handshake, grid, list, sort, signs, combo };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}
mountWarmup(); mountAll();

/* ============ Stand Up Break! (lessons/js/standup.js) — a tiny polynomial kit for the whiteboard questions ============
 * A polynomial is { key: coefficient }, the key naming the variables and their exponents ('x2'; '' for a constant).
 * A written expression keeps its terms in a list of one-term polynomials, so the answer can show the partial products. */
const suKey = (e) => Object.keys(e).filter((v) => e[v]).sort().map((v) => v + e[v]).join('');
const suExp = (k) => { const e = {}; k.replace(/([a-z])(\d+)/g, (_, v, n) => { e[v] = +n; }); return e; };
const suM = (c, v, n = 1) => (c ? { [suKey(v ? { [v]: n } : {})]: c } : {});
const suAdd = (...ps) => { const o = {}; ps.forEach((p) => { for (const k in p) { o[k] = (o[k] || 0) + p[k]; if (!o[k]) delete o[k]; } }); return o; };
const suMul = (...ps) => ps.reduce((a, b) => {
  const o = {};
  for (const i in a) for (const j in b) { const e = suExp(i), f = suExp(j); for (const v in f) e[v] = (e[v] || 0) + f[v]; const k = suKey(e); o[k] = (o[k] || 0) + a[i] * b[j]; if (!o[k]) delete o[k]; }
  return o;
}, { '': 1 });
const suDeg = (k) => Object.values(suExp(k)).reduce((s, n) => s + n, 0);
const suKeys = (p) => Object.keys(p).sort((a, b) => suDeg(b) - suDeg(a));
const suMono = (k) => Object.entries(suExp(k)).map(([v, n]) => v + (n > 1 ? '^{' + n + '}' : '')).join('');
const suTerm = (c, k, first) => { const m = suMono(k), a = Math.abs(c); return (c < 0 ? '-' : first ? '' : '+') + (a === 1 && m ? '' : a) + m; };
const suTex = (p) => suKeys(p).map((k, i) => suTerm(p[k], k, i === 0)).join('') || '0';
const suOne = (p) => { const k = Object.keys(p)[0]; return [p[k], k]; };
const suSeq = (list, cont) => list.filter((p) => Object.keys(p).length).map((p, i) => { const [c, k] = suOne(p); return suTerm(c, k, i === 0 && !cont); }).join('') || '0';
const suPar = (list) => '(' + suSeq(list) + ')';
const suP = (list) => suAdd(...list);
const suParts = (A, B) => A.flatMap((a) => B.map((b) => suMul(a, b)));
const suL = (v, a, b) => [suM(a, v), suM(b)];
const suTri = (v, a, b, c) => [suM(a, v, 2), suM(b, v), suM(c)];
const suNz = (r, lo, hi) => { let v = 0; while (!v) v = r.int(lo, hi); return v; };
/* (A)(B): the six partial products, then collected */
function suHands(A, B) {
  const parts = suParts(A, B), res = suP(parts);
  return { q: suPar(A) + suPar(B), parts, res, a: ['=' + suSeq(parts), '=' + suTex(res)] };
}

standup('u3l5', {
  intro: 'Expand and simplify at your whiteboard station. Six partial products first, then collect the like terms.',
  levels: {
    /* (x + a)(x² + bx + c) or (2x + a)(…), all positive */
    BEG: (r) => { const v = r.pick(['x', 'x', 'x', 'a', 'n', 'y']); return suHands(suL(v, r.pick([1, 1, 1, 2]), r.int(1, 6)), suTri(v, 1, r.int(1, 5), r.int(1, 6))); },
    /* negative terms somewhere: check the sign of every partial product */
    PRG: (r) => {
      const v = r.pick(['x', 'x', 'x', 'm', 'y']);
      for (;;) {
        const m = r.pick([1, 1, 2, 3]), a = suNz(r, -6, 6), b = suNz(r, -5, 5), c = suNz(r, -6, 6);
        if (a > 0 && b > 0 && c > 0) continue;
        const s = suHands(suL(v, m, a), suTri(v, 1, b, c));
        if (Object.keys(s.res).length < 3) continue;
        return s;
      }
    },
    /* the product, then add or subtract another trinomial */
    MAS: (r) => {
      const v = r.pick(['x', 'x', 'x', 'n']);
      for (;;) {
        const A = suL(v, r.pick([1, 1, 2]), suNz(r, -5, 5)), B = suTri(v, 1, suNz(r, -4, 4), suNz(r, -5, 5)), sg = r.pick([1, -1]);
        const O = suTri(v, r.int(1, 3), suNz(r, -6, 6), suNz(r, -7, 7));
        const parts = suParts(A, B), P = suP(parts), O2 = suMul(suM(sg), suP(O)), res = suAdd(P, O2);
        if (Object.keys(res).length < 3 || Object.keys(P).length < 4) continue;
        return {
          q: suPar(A) + suPar(B) + (sg < 0 ? '-' : '+') + suPar(O),
          a: ['\\text{product: }' + suPar(A) + suPar(B) + '=' + suSeq(parts) + '=' + suTex(P),
            (sg < 0 ? '\\text{minus flips every sign: }' : '\\text{plus keeps every sign: }') + suTex(O2),
            '=' + suTex(res)]
        };
      }
    }
  }
});
