/* Math 15 · Unit 4 · Lesson 7 — Factoring ax² + bx + c (where a ≠ 1), by decomposition.
 * Explainers: why sum-product needs a = 1, the trinomial as a wrapped chocolate bar (area box), the six steps side by side
 * with the bar, the FOIL check, which order / wrong pair, the signs of the pair, negatives side by side, GCF first.
 * Plus the warm-up (The Great Chocolate Split) and the Stand Up Break. Area-box code adapted from Math 10C u4l5. */
import { h, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const box = (el, w, hh) => { el.style.width = w + 'px'; el.style.height = hh + 'px'; return el; };
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
/* KaTeX allowing \htmlClass (pieces of a line that light up) */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(String(s));
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
const showSpans = (c, els, ms = 340) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms)));
const pulse = (c, el, s = 1.1, ms = 480) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], ms);
const fadeOut = (c, el, ms = 300) => c.anim(el, [{ opacity: el.style.opacity === '' ? 1 : +el.style.opacity }, { opacity: 0 }], ms);
const on = (c, el, delay = 0) => c.sleep(delay).then(() => el.classList.add('on'));

const BLU = '#2b55a0', AMB = '#c27a0e', PUR = '#7b4fc4', RED = '#c93a33', OK = '#12805a', MAG = '#c2417a', TEAL = '#13807a';
const ROWC = [BLU, PUR], COLC = MAG;
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;

/* ============ algebra: monomials and trinomials as LaTeX ============ */
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
/* c·v^i as LaTeX; first = no leading "+" */
function mono(c, v, i, first = true) {
  const vars = i && v ? v + (i > 1 ? `^{${i}}` : '') : '', a = Math.abs(c);
  const body = vars ? (a === 1 ? '' : String(a)) + vars : String(a);
  return (c < 0 ? '-' : first ? '' : '+') + body;
}
const paren = (n) => (String(n).startsWith('-') ? `(${n})` : String(n));
const lin = (p, q, v = 'x') => mono(p, v, 1) + mono(q, v, 0, false);
const triT = (a, b, c, v = 'x') => mono(a, v, 2) + mono(b, v, 1, false) + mono(c, v, 0, false);
function findPair(P, b) { const A = Math.abs(P); for (let m = -A; m <= A; m++) if (m && P % m === 0 && m + P / m === b) return [m, P / m]; return null; }
/* Everything about one trinomial ax² + bx + c split as ax² + m·x + n·x + c (m top-right, n bottom-left of the bar).
 * Row 1's label is gcd(a, m)·x; the columns are what's left; row 2 is whatever makes both columns work. */
function solve(d) {
  const v = d.v || 'x', { a, b, c } = d;
  const [m, n] = d.pair || findPair(a * c, b);
  const g1 = gcd(a, m), r1 = g1, c1 = a / g1, c2 = m / g1, r2 = (n * g1) / a;
  const S = {
    v, a, b, c, ac: a * c, m, n, r1, r2, c1, c2,
    TL: mono(a, v, 2), TR: mono(m, v, 1), BL: mono(n, v, 1), BR: mono(c, v, 0),
    tri: triT(a, b, c, v), bx: mono(b, v, 1),
    colB: lin(c1, c2, v), rowB: lin(r1, r2, v),
    r1T: mono(r1, v, 1), r2T: mono(r2, v, 0, false), r2P: mono(r2, v, 0),
    c1T: mono(c1, v, 1), c2T: mono(c2, v, 0, false), c2P: mono(c2, v, 0)
  };
  S.sgn = (k) => mono([a, m, n, c][k], v, [2, 1, 1, 0][k], false); // a cell written as a later term
  S.cells = [S.TL, S.TR, S.BL, S.BR];
  S.split = S.TL + S.sgn(1) + S.sgn(2) + S.sgn(3);
  S.foil = S.TL + S.sgn(2) + S.sgn(1) + S.sgn(3); // (colB)(rowB) expanded in FOIL order: First, Outside, Inside, Last
  return S;
}
/* the second group's factor, written the way the booklet does: +1(x+3), −1(x−4), −2(2x+5) */
const grp2 = (S) => (Math.abs(S.r2) === 1 ? (S.r2 < 0 ? '-1' : '+1') : S.r2T);
const signNote = (S) => (S.ac > 0 ? `${T('ac')} is positive, so both have the <b>same sign</b>${S.b < 0 ? ' (both negative, since ' + T('b') + ' is negative)' : ''}.` : `${T('ac')} is negative, so the signs are <b>opposite</b>; the bigger one takes the sign of ${T('b')}.`);

/* ============ the trinomial as a chocolate bar (an area box) drawn in a stage ============ */
function drawBox(stage, S, bx, by, cw, ch, o = {}) {
  const pos = [[0, 0], [1, 0], [0, 1], [1, 1]], kinds = ['milk', 'dark', 'dark', 'milk'];
  const cells = pos.map(([i, j], k) => add(stage, box(h('div', 'u4l7-cell ' + kinds[k]), cw + 2, ch + 2), bx + i * cw, by + j * ch));
  const frame = add(stage, box(h('div', 'u4l7-cell u4l7-frame'), 2 * cw + 2, 2 * ch + 2), bx, by); void frame;
  const labs = pos.map(([i, j], k) => { const e = add(stage, h('div', 'u4l7-cl c ' + kinds[k] + (o.small ? ' sm' : ''), K(S.cells[k])), bx + i * cw + cw / 2 + 1, by + j * ch + ch / 2 + 1); hide(e); return e; });
  const qms = [1, 2].map((k) => { const [i, j] = pos[k]; const e = add(stage, h('div', 'u4l7-cl c dark u4l7-qm', '?'), bx + i * cw + cw / 2 + 1, by + j * ch + ch / 2 + 1); hide(e); return e; });
  const rowL = [S.r1T, S.r2T].map((t, j) => { const e = add(stage, h('div', 'u4l7-lab r', K(t)), bx - 12, by + j * ch + ch / 2); e.style.color = ROWC[j]; hide(e); return e; });
  const colL = [S.c1T, S.c2T].map((t, i) => { const e = add(stage, h('div', 'u4l7-lab c', K(t)), bx + i * cw + cw / 2, by - 25); e.style.color = COLC; hide(e); return e; });
  const rowHi = [0, 1].map((j) => { const e = add(stage, box(h('div', 'u4l7-hi'), 2 * cw + 12, ch + 10), bx - 5, by + j * ch - 4); e.style.setProperty('--pc', ROWC[j]); hide(e); return e; });
  const colHi = [0, 1].map((i) => { const e = add(stage, box(h('div', 'u4l7-hi'), cw + 10, 2 * ch + 12), bx + i * cw - 4, by - 5); e.style.setProperty('--pc', COLC); hide(e); return e; });
  const fill = (c, k, delay = 0) => Promise.all([on(c, cells[k], delay), c.pop(labs[k], 380, { delay }), (k === 1 || k === 2) && qms[k - 1].style.opacity === '1' ? fadeOut(c, qms[k - 1], 200) : null]);
  const wrap = (c) => Promise.all([on(c, cells[1]), on(c, cells[2]), c.pop(qms[0], 340), c.pop(qms[1], 340, { delay: 120 })]);
  const flashAll = async (c) => { for (let k = 0; k < 4; k++) await Promise.all([pulse(c, labs[k], 1.18, 340), pulse(c, rowL[pos[k][1]], 1.15, 340), pulse(c, colL[pos[k][0]], 1.15, 340)]); };
  return { cells, labs, qms, rowL, colL, rowHi, colHi, fill, wrap, flashAll };
}
const wline = (stage, html, x, y, cls = '') => add(stage, h('div', 'u4l7-wl ' + cls, html), x, y);
/* factor pairs of ac with the signs the rule gives, bigger number first (as the booklet writes them) */
function signedPairs(P, b) {
  const out = [], A = Math.abs(P), sb = b < 0 ? -1 : 1;
  for (let d = 1; d * d <= A; d++) if (A % d === 0) {
    const e = A / d;
    if (P > 0) out.push([sb * e, sb * d]);
    else out.push([sb * e, -sb * d]);
  }
  return out.map(([m, n]) => ({ m, n, ok: m + n === b }));
}

/* ============ 1. Why sum-product is not enough ============ */
const WN = {
  m: { a: 2, b: 7, c: 3, f: [1, 3, 2, 1] },     // (x+3)(2x+1)
  p: { a: 2, b: 5, c: 3, f: [1, 1, 2, 3] },     // (x+1)(2x+3)
  y: { a: 6, b: 11, c: 4, f: [2, 1, 3, 4] }     // (2x+1)(3x+4)
};
const whyNot = {
  title: 'Why the old rule breaks when a ≠ 1',
  height: 430,
  choices: [{ v: 'm', label: tex('2x^2+7x+3') }, { v: 'p', label: tex('2x^2+5x+3') }, { v: 'y', label: tex('6x^2+11x+4') }],
  intro: (k) => `Can the sum-product method from Lessons 3 and 4 factor ${T(triT(WN[k].a, WN[k].b, WN[k].c))}? Let’s find out.`,
  make(stage, key, ex) {
    const W = ex.W, d = WN[key], { a, b, c } = d, [p, q, R, S] = d.f, tri = triT(a, b, c);
    const O = p * S, I = q * R, fac = `(${lin(p, q)})(${lin(R, S)})`;
    // left: binomials that start with x
    add(stage, h('div', 'u4l7-ptag', 'Binomials that start with plain x'), 24, 14);
    const G = [[2, 5], [1, 3], [-4, 6]].map(([u, w], i) => {
      const src = `(x${mono(u, '', 0, false)})(x${mono(w, '', 0, false)})=\\htmlClass{u4l7-x2}{x^2}${mono(u + w, 'x', 1, false)}${mono(u * w, '', 0, false)}`;
      const e = wline(stage, K(src), 24, 48 + i * 50); hide(e); return e;
    });
    const note = add(stage, h('div', 'u4l7-card u4l7-red', `${K('x\\cdot x=x^2')} every time, so ${K('a=1')}`), 24, 206); hide(note);
    add(stage, box(h('div', 'u4l7-vsep'), 0, 236), 452, 14);
    // right: the old way on this trinomial
    add(stage, h('div', 'u4l7-ptag', 'The old way'), 476, 14);
    const hd = wline(stage, `${K(tri)}: product ${K('c=' + c)}, sum ${K('b=' + b)}?`, 476, 48, 'sm'); hide(hd);
    const prs = []; for (let u = 1; u * u <= c; u++) if (c % u === 0) prs.push([u, c / u]);
    const rows = prs.map(([u, w], i) => { const e = wline(stage, `${K(`${u}\\times${w}=${c}`)}, &nbsp;sum ${K(`${u}+${w}=${u + w}`)} <b class="red">✗</b>`, 496, 92 + i * 40, 'sm'); hide(e); return e; });
    const stuck = add(stage, h('div', 'u4l7-stamp no', 'No pair works!'), 600, 112 + prs.length * 40); hide(stuck);
    // bottom: it does factor
    const L1 = wline(stage, `It does factor: ${K(`${fac}=${mono(a, 'x', 2)}\\htmlClass{u4l7-mid}{${mono(O, 'x', 1, false)}}\\htmlClass{u4l7-mid}{${mono(I, 'x', 1, false)}}${mono(c, '', 0, false)}`)}`, 24, 276); hide(L1);
    const card = add(stage, h('div', 'u4l7-card u4l7-big', `The middle pieces: ${K(`${O}\\times${I}=${O * I}`)} and ${K(`${a}\\times${c}=${a * c}`)}, so their <b>product is ${K('a\\times c')}</b>. And ${K(`${O}+${I}=${b}`)}: their <b>sum is ${K('b')}</b>.`), 24, 336); card.style.width = (W - 48) + 'px'; hide(card);
    return [{
      cap: `Multiply binomials that both start with a plain ${T('x')}. Watch the <b>first term</b> each time.`,
      run: (cc) => Promise.all(G.map((e, i) => cc.fadeIn(e, 380, { delay: i * 220 })))
    }, {
      cap: `${T('x\\cdot x=x^2')} every time, so the leading coefficient is always <b>1</b>. The sum-product method was built for these.`,
      run: async (cc) => { G.forEach((e) => spans(e, 'u4l7-x2').forEach((s) => s.classList.add('on'))); await cc.pop(note, 380); }
    }, {
      cap: `Now try ${T(tri)} the old way: two integers with product ${T(c)} and sum ${T(b)}.`,
      run: (cc) => Promise.all([cc.fadeIn(hd, 350), ...rows.map((e, i) => cc.fadeIn(e, 300, { delay: 300 + i * 200 }))])
    }, {
      cap: `No pair works ✗. The ${T(mono(a, 'x', 2))} can’t come from ${T('x\\cdot x')}, so the old rule breaks.`,
      run: (cc) => cc.pop(stuck, 420)
    }, {
      cap: `Yet ${T(tri)} <b>does</b> factor: ${T(fac)}. Expand it, but <b>don’t</b> collect the middle terms yet.`,
      run: (cc) => cc.fadeIn(L1, 400)
    }, {
      cap: `The middle pieces multiply to ${T(O * I)}, which is ${T(`a\\times c`)}, and add to ${T(b)}. New rule: <b>product ${T('ac')}, sum ${T('b')}</b>.`,
      run: async (cc) => { spans(L1, 'u4l7-mid').forEach((s) => s.classList.add('on')); await cc.fadeIn(card, 400); }
    }];
  }
};

/* ============ 2. The wrapped chocolate bar (area box) ============ */
const CB = {
  m: { a: 2, b: 7, c: 3, pair: [6, 1] },
  p: { a: 2, b: 5, c: 3, pair: [3, 2] },
  y: { a: 6, b: 11, c: 4, pair: [8, 3] }
};
const chocBar = {
  title: 'Unwrap the trinomial',
  height: 440,
  choices: [{ v: 'm', label: tex('2x^2+7x+3') }, { v: 'p', label: tex('2x^2+5x+3') }, { sep: 'Warm-up “your turn”:' }, { v: 'y', label: tex('6x^2+11x+4') }],
  intro: (k) => `Treat ${T(solve(CB[k]).tri)} like Bar C: the corners are known, the middle is wrapped.`,
  make(stage, key, ex) {
    const W = ex.W, S = solve(CB[key]), bx = 118, by = 96, cw = 166, ch = 104;
    const B = drawBox(stage, S, bx, by, cw, ch);
    add(stage, h('div', 'u4l7-wl c', K(S.tri)), bx + cw, by + 2 * ch + 40);
    const px = 506, pw = W - px - 16, acx = mono(S.ac, S.v, 2);
    const tgt = add(stage, h('div', 'u4l7-card', `Dark pieces: <b>product</b> ${K(`(${S.TL})(${S.BR})=${acx}`)}, <b>sum</b> ${K(S.bx)}`), px, 20); tgt.style.width = pw + 'px'; hide(tgt);
    const pl = signedPairs(S.ac, S.b);
    const grid = add(stage, h('div', 'u4l7-chips'), px, 106); grid.style.width = pw + 'px';
    const chips = pl.map((pp) => { const e = h('div', 'u4l7-pc', `${K(`${pp.m}\\times${paren(pp.n)}`)}<small>sum ${K(String(pp.m + pp.n))}${pp.ok ? ' ✓' : ''}</small>`); grid.appendChild(e); hide(e); return e; });
    const found = wline(stage, `Dark pieces: ${K(S.TR)} and ${K(S.BL)}`, px, 108, 'sm'); hide(found);
    const R1 = wline(stage, `<b style="color:${BLU}">Row 1:</b> ${K(S.TL)} and ${K(S.TR)} share ${K(S.r1T)}`, px, 164, 'sm'); hide(R1);
    const R2 = wline(stage, `<b style="color:${COLC}">Columns:</b> ${K(`${S.TL}\\div ${S.r1T}=${S.c1T}`)}, ${K(`${S.TR}\\div ${S.r1T}=${S.c2P}`)}`, px, 208, 'sm'); hide(R2);
    const R3 = wline(stage, `<b style="color:${PUR}">Row 2:</b> ${K(`${S.BL}\\div ${S.c1T}=${S.r2P}`)}, ${K(`${S.BR}\\div ${paren(S.c2P)}=${S.r2P}`)} ✓`, px, 252, 'sm'); hide(R3);
    const R4 = wline(stage, K(`${S.tri}=(${tc(COLC, S.colB)})(${tc(BLU, S.r1T)}${tc(PUR, S.r2T)})`), px, 312, 'u4l7-ans'); hide(R4);
    const R5 = wline(stage, `Each <b>row</b> of the bar is one <b>pair</b> when we group: ${K(`${S.r1T}(${S.colB})${grp2(S)}(${S.colB})`)}`, px, 372, 'sm u4l7-wrapw'); R5.style.width = pw + 'px'; hide(R5);
    return [{
      cap: `Wrap ${T(S.tri)} like Bar C. The <b>milk</b> corners are ${T(S.TL)} and ${T(S.BR)}. The two <b>dark</b> pieces are hidden inside ${T(S.bx)}.`,
      run: (c) => Promise.all([B.fill(c, 0), B.fill(c, 3, 200), B.wrap(c)])
    }, {
      cap: `Like the warm-up: dark × dark = milk × milk ${T(`=(${S.TL})(${S.BR})=${acx}`)}. And the two dark pieces <b>add</b> to ${T(S.bx)}.`,
      run: (c) => c.fadeIn(tgt, 400)
    }, {
      cap: `Find the pair: the factor pairs of ${T(S.ac)} and their sums. Only ${T(S.m)} and ${T(S.n)} add to ${T(S.b)}.`,
      run: async (c) => { await Promise.all(chips.map((e, i) => c.fadeIn(e, 280, { delay: i * 130 }))); pl.forEach((pp, i) => chips[i].classList.add(pp.ok ? 'ok' : 'dim')); await pulse(c, chips[pl.findIndex((pp) => pp.ok)], 1.08); }
    }, {
      cap: `Unwrap the bar: the dark pieces are ${T(S.TR)} and ${T(S.BL)}.`,
      run: (c) => Promise.all([fadeOut(c, grid, 300), c.fadeIn(found, 350, { delay: 250 }), B.fill(c, 1, 250), B.fill(c, 2, 400)])
    }, {
      cap: `<b>Row 1:</b> ${T(S.TL)} and ${T(S.TR)} share ${T(S.r1T)}. Divide it out: ${T(S.c1T)} and ${T(S.c2P)} are the <b>column</b> labels.`,
      run: (c) => Promise.all([c.fadeIn(B.rowHi[0], 300), c.pop(B.rowL[0], 380, { delay: 150 }), c.fadeIn(R1, 350, { delay: 200 }), ...B.colL.map((e, i) => c.pop(e, 380, { delay: 450 + i * 150 })), c.fadeIn(R2, 350, { delay: 550 })])
    }, {
      cap: `<b>Row 2</b> must fit the same columns: ${T(`${S.BL}\\div ${S.c1T}=${S.r2P}`)}. It works for the last piece too: ${T(`${S.r2P}\\times${paren(S.c2P)}=${S.BR}`)} ✓`,
      run: (c) => Promise.all([fadeOut(c, B.rowHi[0], 250), c.fadeIn(B.rowHi[1], 300), c.pop(B.rowL[1], 380, { delay: 150 }), c.fadeIn(R3, 350, { delay: 200 })])
    }, {
      cap: `The sides of the bar are the factors: ${T(`${S.tri}=(${S.colB})(${S.rowB})`)}. Each piece is side × top, so it checks ✓`,
      run: async (c) => { await Promise.all([fadeOut(c, B.rowHi[1], 250), c.fadeIn(R4, 400)]); await B.flashAll(c); await c.fadeIn(R5, 350); }
    }];
  }
};

/* ============ 2, 4, 5. The six steps beside the bar ============ */
const BD = {
  m: { a: 2, b: 7, c: 3, pair: [6, 1] },
  e1a: { a: 3, b: 10, c: 3, pair: [9, 1] },
  e1b: { a: 2, b: 9, c: 4, pair: [8, 1] },
  e2a: { a: 2, b: 11, c: 5, pair: [10, 1] },
  e2b: { a: 3, b: 13, c: 4, pair: [12, 1] },
  e2c: { a: 4, b: 12, c: 5, pair: [10, 2] },
  n1: { a: 2, b: -5, c: 3, pair: [-3, -2] },
  n2: { a: 3, b: 5, c: -2, pair: [6, -1] },
  e3a: { a: 2, b: -9, c: 4, pair: [-8, -1] },
  e3b: { a: 3, b: -11, c: 6, pair: [-9, -2] },
  e4a: { a: 2, b: 7, c: -4, pair: [8, -1] },
  e4b: { a: 3, b: -4, c: -4, pair: [-6, 2] },
  e4c: { a: 4, b: -4, c: -3, pair: [-6, 2] },
  g1: { pre: { src: '4x^2+10x-6', g: '2', k: 2 }, a: 2, b: 5, c: -3, pair: [6, -1] },
  g2: { pre: { src: '6x^2+15x+9', g: '3', k: 3 }, a: 2, b: 5, c: 3, pair: [3, 2] },
  e5a: { pre: { src: '6x^2+3x-30', g: '3', k: 3 }, a: 2, b: 1, c: -10, pair: [5, -4] },
  e5b: { pre: { src: '4x^3-2x^2-30x', g: '2x', cubic: true }, a: 2, b: -1, c: -15, pair: [-6, 5] }
};
function makeBD(title, choices, o = {}) {
  return {
    title, height: 500, choices, minW: 900,
    intro: (k) => { const d = BD[k]; return `Factor ${T(d.pre ? d.pre.src : solve(d).tri)}: the six steps on the right, the bar on the left.`; },
    make(stage, key, ex) {
      const W = ex.W, d = BD[key], S = solve(d), H = 500, pre = d.pre, g = pre ? pre.g : '';
      const bx = 112, by = 92, cw = 148, ch = 84, rx = 470;
      add(stage, h('div', 'u4l7-ptag', 'The bar'), 24, 16);
      add(stage, h('div', 'u4l7-ptag', 'Decomposition'), rx, 16);
      add(stage, box(h('div', 'u4l7-vsep'), 0, H - 96), 446, 16);
      const B = drawBox(stage, S, bx, by, cw, ch);
      const lac = wline(stage, K(`a\\times c=${S.a}\\times${paren(S.c)}=${S.ac}`), 30, by + 2 * ch + 30, 'sm'); hide(lac);
      const lpair = wline(stage, `Pair: ${K(String(S.m))} and ${K(String(S.n))}`, 30, by + 2 * ch + 72, 'sm'); hide(lpair);
      const lpair2 = wline(stage, `<small style="margin:0">${K(`${S.m}\\times${paren(S.n)}=${S.ac}`)} ✓ &nbsp; ${K(`${S.m}+${paren(S.n)}=${S.b}`)} ✓</small>`, 30, by + 2 * ch + 110, 'sm'); hide(lpair2);
      // the written work on the right
      const L = [];
      if (pre) L.push(['P1', K(`${pre.src}=${g}(${S.tri})`)]);
      L.push(['T', `${K(S.tri)}<small>${K(`a=${S.a},\\ b=${S.b},\\ c=${S.c}`)}</small>`]);
      L.push(['S', K(`=${S.TL}${tc(AMB, S.sgn(1))}${tc(AMB, S.sgn(2))}${S.sgn(3)}`)]);
      L.push(['G', K(`=\\htmlClass{u4l7-g1}{${tc(BLU, S.r1T)}(${tc(COLC, S.colB)})}\\htmlClass{u4l7-g2}{${tc(PUR, grp2(S))}(${tc(COLC, S.colB)})}`)]);
      L.push(['F', K(`=(${tc(COLC, S.colB)})(${tc(BLU, S.r1T)}${tc(PUR, S.r2T)})`)]);
      if (pre) L.push(['FIN', K(`${pre.src}=${g}(${S.colB})(${S.rowB})`)]);
      const lh = Math.min(52, Math.floor((H - 132) / L.length)), E = {};
      L.forEach(([k, html], i) => { E[k] = wline(stage, html, rx, 50 + i * lh, (k === 'F' && !pre) || k === 'FIN' ? 'u4l7-ans' : ''); hide(E[k]); });
      const g1 = spans(E.G, 'u4l7-g1'), g2 = spans(E.G, 'u4l7-g2'); hide(...g1, ...g2);
      const prod = `(${S.colB})(${S.rowB})`;
      const chk = wline(stage, K(pre ? `\\text{Check: }${g}${prod}=${g}(${S.foil})=${pre.src}\\ \\checkmark` : `\\text{Check: }${prod}=${S.foil}=${S.tri}\\ \\checkmark`), 24, H - 54, 'sm'); hide(chk);
      const steps = [];
      if (pre) {
        steps.push(pre.cubic
          ? { cap: `<b>GCF first:</b> every term has a ${T(2)} and an ${T('x')}. ${T(`${pre.src}=${g}(${S.tri})`)}. What’s left is a trinomial: decompose it.`, run: (c) => c.fadeIn(E.P1, 400) }
          : { cap: `<b>GCF first:</b> every term is a multiple of ${g}, so ${T(`${pre.src}=${g}(${S.tri})`)}. Now ${T('ac')} is just ${T(S.ac)} instead of ${T(S.ac * pre.k * pre.k)}.`, run: (c) => c.fadeIn(E.P1, 400) });
      }
      steps.push({
        cap: `<b>Step 1:</b> multiply ${T(`a\\times c=${S.a}\\times${paren(S.c)}=${S.ac}`)}. In the bar, ${T(S.TL)} and ${T(S.BR)} are the <b>milk</b> corners.`,
        run: (c) => Promise.all([c.fadeIn(E.T, 400), B.fill(c, 0, 150), B.fill(c, 3, 300), c.fadeIn(lac, 400, { delay: 400 })])
      }, {
        cap: `<b>Step 2:</b> find two integers with product ${T(S.ac)} and sum ${T(S.b)}.` + (o.signs ? ` ${signNote(S)}` : '') + ` They are ${T(S.m)} and ${T(S.n)}.`,
        run: (c) => Promise.all([c.pop(lpair, 380), c.fadeIn(lpair2, 400, { delay: 200 })])
      }, {
        cap: `<b>Step 3: split</b> ${T(S.bx)} into ${T(S.TR)} and ${T(S.BL)}. Now there are <b>four terms</b>. In the bar, they are the two <b>dark</b> pieces.`,
        run: (c) => Promise.all([B.fill(c, 1), B.fill(c, 2, 150), c.fadeIn(E.S, 400, { delay: 200 })])
      }, {
        cap: `<b>Step 4: group</b> in pairs. The first pair shares ${T(S.r1T)}: ${T(`${S.TL}${S.sgn(1)}=${S.r1T}(${S.colB})`)}. That’s <b>row 1</b> of the bar.`,
        run: (c) => Promise.all([c.fadeIn(B.rowHi[0], 300), c.pop(B.rowL[0], 380, { delay: 150 }), ...B.colL.map((e, i) => c.pop(e, 380, { delay: 400 + i * 140 })), c.fadeIn(E.G, 10), showSpans(c, g1, 400)])
      }, {
        cap: `The second pair must leave the <b>same bracket</b> ${T(`(${S.colB})`)}, so take out ${T(S.r2P)}${S.r2 < 0 ? ', a <b>negative</b>' : ''}: ${T(`${S.BL}${S.sgn(3)}=${grp2(S).replace(/^\+/, '')}(${S.colB})`)}. That’s <b>row 2</b>.`,
        run: (c) => Promise.all([fadeOut(c, B.rowHi[0], 250), c.fadeIn(B.rowHi[1], 300), c.pop(B.rowL[1], 380, { delay: 150 }), showSpans(c, g2, 400)])
      }, {
        cap: `<b>Step 5:</b> both pairs share ${T(`(${S.colB})`)}. Factor it out: ${T(`${S.tri}=(${S.colB})(${S.rowB})`)}.`,
        run: (c) => Promise.all([fadeOut(c, B.rowHi[1], 250), ...B.colHi.map((e) => c.fadeIn(e, 300)), c.fadeIn(E.F, 400, { delay: 250 })])
      });
      if (pre) {
        steps.push({
          cap: `Put the GCF back in front: ${T(`${pre.src}=${g}(${S.colB})(${S.rowB})`)}. No bracket factors any further, so it’s <b>finished</b>.`,
          run: (c) => Promise.all([...B.colHi.map((e) => fadeOut(c, e, 250)), c.fadeIn(E.FIN, 400)])
        });
      }
      steps.push({
        cap: `<b>Step 6: check with FOIL.</b> ${T(`${g}${prod}=${pre ? g + '(' + S.foil + ')' : S.foil}`)}, which gives back ${T(pre ? pre.src : S.tri)} ✓`,
        run: async (c) => { await Promise.all(B.colHi.map((e) => (e.style.opacity === '1' ? fadeOut(c, e, 250) : null))); await Promise.all([c.fadeIn(chk, 400), B.flashAll(c)]); }
      });
      void W;
      return steps;
    }
  };
}
const decomp6 = makeBD('The six steps, beside the bar', [{ v: 'm', label: tex('2x^2+7x+3') }, { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' }, { sep: 'Example 2 check:' }, { v: 'e2a', label: '(a)' }, { v: 'e2b', label: '(b)' }, { v: 'e2c', label: '(c)' }]);
const signDecomp = makeBD('Negative signs, step by step', [{ v: 'n1', label: tex('2x^2-5x+3') }, { v: 'n2', label: tex('3x^2+5x-2') }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }, { v: 'e4c', label: '(c)' }], { signs: true });
const gcfFirst = makeBD('GCF first, then the six steps', [{ v: 'g1', label: tex('4x^2+10x-6') }, { v: 'g2', label: tex('6x^2+15x+9') }, { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }, { v: 'e5b', label: '(b)' }]);

/* ============ Step 6: the FOIL check ============ */
const FO = {
  m: [1, 3, 2, 1], e1a: [1, 3, 3, 1], e1b: [1, 4, 2, 1], e3a: [1, -4, 2, -1], e4b: [1, -2, 3, 2], e4c: [2, -3, 2, 1]
};
const foilCheck = {
  title: 'Check by expanding: FOIL',
  height: 350,
  choices: [{ v: 'm', label: tex('(x+3)(2x+1)') }, { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { sep: 'Example 4 check:' }, { v: 'e4b', label: '(b)' }, { v: 'e4c', label: '(c)' }],
  intro: (k) => { const [p, q, R, S] = FO[k]; return `Expand ${T(`(${lin(p, q)})(${lin(R, S)})`)} to check it. Every term in the first bracket meets every term in the second.`; },
  make(stage, key, ex) {
    const W = ex.W, [p, q, R, S] = FO[key];
    const a = p * R, b = p * S + q * R, c = q * S, tri = triT(a, b, c);
    const terms = [mono(p, 'x', 1), mono(q, '', 0, false), mono(R, 'x', 1), mono(S, '', 0, false)];
    const tw = 72, pw = 26, total = 4 * pw + 4 * tw, X0 = Math.round((W - total) / 2), Y = 150;
    const xs = []; let x = X0;
    const put = (html, w, cls = '') => { const e = add(stage, box(h('div', 'u4l7-ft ' + cls, html), w, 56), x, Y - 28); x += w; return e; };
    put(K('('), pw, 'pr'); xs.push(x + tw / 2); const t0 = put(K(terms[0]), tw); xs.push(x + tw / 2); const t1 = put(K(terms[1]), tw); put(K(')'), pw, 'pr');
    put(K('('), pw, 'pr'); xs.push(x + tw / 2); const t2 = put(K(terms[2]), tw); xs.push(x + tw / 2); const t3 = put(K(terms[3]), tw); put(K(')'), pw, 'pr');
    const T4 = [t0, t1, t2, t3]; void T4;
    const svg = svgEl('svg', { class: 'u4l7-diag' }); stage.appendChild(svg);
    const COL = { F: BLU, O: AMB, I: PUR, L: TEAL };
    const arc = (i, j, up, hgt, col) => {
      const y0 = up ? Y - 32 : Y + 32, yc = up ? y0 - hgt : y0 + hgt, x1 = xs[i], x2 = xs[j];
      const path = svgEl('path', { d: `M${x1} ${y0} Q${(x1 + x2) / 2} ${yc} ${x2} ${y0}`, fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round' });
      svg.appendChild(path); const len = path.getTotalLength ? path.getTotalLength() || 400 : 400; path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
      return { path, len, mx: (x1 + x2) / 2, my: up ? (y0 + yc) / 2 - 4 : (y0 + yc) / 2 + 4 };
    };
    const A = { F: arc(0, 2, true, 56, COL.F), O: arc(0, 3, true, 128, COL.O), I: arc(1, 2, false, 56, COL.I), L: arc(1, 3, false, 128, COL.L) };
    const tags = {}; Object.keys(A).forEach((k) => { const e = add(stage, h('div', 'u4l7-ftag', k), A[k].mx, A[k].my + (A[k].my < Y ? -4 : 4)); e.style.background = COL[k]; hide(e); tags[k] = e; });
    const prods = { F: [p * R, 2], O: [p * S, 1], I: [q * R, 1], L: [q * S, 0] };
    const words = { F: 'First', O: 'Outside', I: 'Inside', L: 'Last' };
    const pairOf = { F: [0, 2], O: [0, 3], I: [1, 2], L: [1, 3] };
    const strip = (s) => s.replace(/^\+/, '');
    const slotY = 268, sw = 128, sx0 = Math.round((W - 4 * sw - 330) / 2);
    const slots = {}; ['F', 'O', 'I', 'L'].forEach((k, i) => {
      const [cf, pw2] = prods[k];
      const e = add(stage, h('div', 'u4l7-slot', `<span class="u4l7-slt" style="color:${COL[k]}">${k}</span>${K(mono(cf, 'x', pw2, i === 0))}`), sx0 + i * sw, slotY); e.style.width = sw + 'px'; hide(e); slots[k] = e;
    });
    const res = add(stage, h('div', 'u4l7-wl u4l7-ans u4l7-fres', K(`=${tri}\\ \\checkmark`)), sx0 + 4 * sw + 10, slotY + 28); hide(res);
    const draw = (cc, k) => cc.anim(A[k].path, [{ strokeDashoffset: A[k].len }, { strokeDashoffset: 0 }], 550);
    const stepK = (k) => {
      const [i, j] = pairOf[k], [cf, pw2] = prods[k];
      return {
        cap: `<b style="color:${COL[k]}">${k}: ${words[k]}</b> terms. ${T(`${paren(strip(terms[i]))}\\cdot ${paren(strip(terms[j]))}=${mono(cf, 'x', pw2)}`)}`,
        run: (cc) => Promise.all([draw(cc, k), cc.pop(tags[k], 320, { delay: 300 }), cc.fadeIn(slots[k], 380, { delay: 450 })])
      };
    };
    return [stepK('F'), stepK('O'), stepK('I'), stepK('L'), {
      cap: `Collect the middle terms: ${T(`${mono(p * S, 'x', 1)}${mono(q * R, 'x', 1, false)}=${mono(b, 'x', 1)}`)}. We get ${T(tri)}, the trinomial we started with ✓`,
      run: (cc) => Promise.all([pulse(cc, slots.O, 1.12), pulse(cc, slots.I, 1.12), cc.fadeIn(res, 400, { delay: 300 })])
    }];
  }
};

/* ============ 3. Which order? A wrong pair? ============ */
const WO = {
  m: { a: 2, b: 7, c: 3, good: [6, 1], wrong: [3, 4] },
  p: { a: 2, b: 5, c: 3, good: [3, 2], wrong: [1, 4] },
  e2c: { a: 4, b: 12, c: 5, good: [10, 2], wrong: [6, 6] }
};
function grouping(a, m, n, c) {
  const g1 = gcd(a, m), g2 = gcd(n, c) * (n < 0 ? -1 : 1);
  const br1 = lin(a / g1, m / g1), br2 = lin(n / g2, c / g2);
  const f1 = mono(g1, 'x', 1), f2 = Math.abs(g2) === 1 ? (g2 < 0 ? '-1' : '+1') : mono(g2, '', 0, false);
  return { four: mono(a, 'x', 2) + mono(m, 'x', 1, false) + mono(n, 'x', 1, false) + mono(c, '', 0, false), grp: `${f1}(${br1})${f2}(${br2})`, match: br1 === br2, br: br1, br2, other: lin(g1, g2) };
}
const whichOrder = {
  title: 'Which order? What if the pair is wrong?',
  height: 440,
  choices: [{ v: 'm', label: tex('2x^2+7x+3') }, { v: 'p', label: tex('2x^2+5x+3') }, { sep: 'Example 2 check:' }, { v: 'e2c', label: '(c)' }],
  intro: (k) => `Three ways to split the middle of ${T(triT(WO[k].a, WO[k].b, WO[k].c))}. Which ones work?`,
  make(stage, key, ex) {
    const W = ex.W, d = WO[key], { a, b, c } = d, tri = triT(a, b, c), ac = a * c;
    const [m, n] = d.good, [u, w] = d.wrong;
    const G = [grouping(a, m, n, c), grouping(a, n, m, c), grouping(a, u, w, c)];
    const heads = [`Split as ${K(`${mono(m, 'x', 1)}${mono(n, 'x', 1, false)}`)}`, `Swap the order: ${K(`${mono(n, 'x', 1)}${mono(m, 'x', 1, false)}`)}`, `Wrong pair: ${K(`${mono(u, 'x', 1)}${mono(w, 'x', 1, false)}`)}`];
    const P = G.map((g, i) => {
      const y = 10 + i * 142;
      const pan = add(stage, box(h('div', 'u4l7-panel' + (i === 2 ? ' bad' : '')), W - 40, 128), 20, y); hide(pan);
      const hd = add(stage, h('div', 'u4l7-phead', heads[i]), 40, y + 10); hide(hd);
      const l1 = wline(stage, K(`${tri}=${g.four}`), 40, y + 42); hide(l1);
      const l2 = wline(stage, K(`=${g.grp}`), 40, y + 84); hide(l2);
      const l3 = wline(stage, g.match ? K(`=(${g.br})(${g.other})`) : `<span class="red">${K(`(${g.br})`)} and ${K(`(${g.br2})`)} are different</span>`, 450, y + 84, g.match ? 'u4l7-ans' : 'sm'); hide(l3);
      const st = add(stage, h('div', 'u4l7-stamp ' + (g.match ? 'ok' : 'no'), g.match ? 'brackets match ✓' : 'no match ✗'), W - 250, y + 46); hide(st);
      return { pan, hd, l1, l2, l3, st };
    });
    const show = (cc, k, parts) => Promise.all(parts.map((p2, i) => cc.fadeIn(P[k][p2], 350, { delay: i * 220 })));
    return [{
      cap: `The right pair: product ${T(ac)}, sum ${T(b)} gives ${T(m)} and ${T(n)}. Split, then group in pairs.`,
      run: (cc) => show(cc, 0, ['pan', 'hd', 'l1', 'l2'])
    }, {
      cap: `Both pairs leave ${T(`(${G[0].br})`)}, so factor it out: ${T(`(${G[0].br})(${G[0].other})`)}.`,
      run: (cc) => Promise.all([show(cc, 0, ['l3']), cc.pop(P[0].st, 380, { delay: 300 })])
    }, {
      cap: `Now write the split the other way round: ${T(`${mono(n, 'x', 1)}${mono(m, 'x', 1, false)}`)}. Different GCFs come out of each pair…`,
      run: (cc) => show(cc, 1, ['pan', 'hd', 'l1', 'l2'])
    }, {
      cap: `…but the brackets still match, and we get the <b>same two factors</b> in the other order ✓ Either order works.`,
      run: (cc) => Promise.all([show(cc, 1, ['l3']), cc.pop(P[1].st, 380, { delay: 300 })])
    }, {
      cap: `A wrong pair: ${T(u)} and ${T(w)} also add to ${T(b)}, but ${T(`${u}\\times${w}=${u * w}`)}, not ${T(ac)}. Split and group anyway…`,
      run: (cc) => show(cc, 2, ['pan', 'hd', 'l1', 'l2'])
    }, {
      cap: `…the brackets <b>don’t match</b>, so we’re stuck ✗ The pair must <b>multiply to ${T('ac')}</b> and <b>add to ${T('b')}</b>.`,
      run: (cc) => Promise.all([show(cc, 2, ['l3']), cc.pop(P[2].st, 380, { delay: 300 })])
    }];
  }
};

/* ============ 4. The signs of the pair ============ */
const SP = {
  n1: { a: 2, b: -5, c: 3 }, n2: { a: 3, b: 5, c: -2 }, n3: { a: 2, b: -1, c: -3 },
  e3a: { a: 2, b: -9, c: 4 }, e3b: { a: 3, b: -11, c: 6 },
  e4a: { a: 2, b: 7, c: -4 }, e4b: { a: 3, b: -4, c: -4 }, e4c: { a: 4, b: -4, c: -3 }
};
const signPairs = {
  title: 'Choosing the signs of the pair',
  height: 370,
  choices: [{ v: 'n1', label: tex('2x^2-5x+3') }, { v: 'n2', label: tex('3x^2+5x-2') }, { v: 'n3', label: tex('2x^2-x-3') }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }, { v: 'e4c', label: '(c)' }],
  intro: (k) => `Find the two integers for ${T(triT(SP[k].a, SP[k].b, SP[k].c))}. Let the signs of ${T('ac')} and ${T('b')} do half the work.`,
  make(stage, key, ex) {
    const W = ex.W, { a, b, c } = SP[key], ac = a * c, tri = triT(a, b, c), pos = ac > 0, bneg = b < 0;
    const hd = wline(stage, `${K(tri)}<small>${K(`a=${a},\\ b=${b},\\ c=${c}`)}</small>`, 24, 14); void hd;
    const l1 = wline(stage, K(`a\\times c=${a}\\times${paren(c)}=${ac}`), 24, 62, 'sm'); hide(l1);
    const r1 = add(stage, h('div', 'u4l7-rule', `<div class="rh">${K('ac')} positive</div>Same signs. Both negative if ${K('b')} is negative.`), 24, 112); r1.style.width = '400px';
    const r2 = add(stage, h('div', 'u4l7-rule amber', `<div class="rh">${K('ac')} negative</div>Opposite signs. The bigger one takes the sign of ${K('b')}.`), 24, 212); r2.style.width = '400px';
    hide(r1, r2);
    const dec = wline(stage, pos ? `So: <b>both ${bneg ? 'negative' : 'positive'}</b>` : `So: the <b>bigger</b> one is <b>${bneg ? 'negative' : 'positive'}</b>`, 24, 318, 'sm u4l7-dec'); hide(dec);
    const px = 486, list = signedPairs(ac, b);
    const th = add(stage, h('div', 'u4l7-th', `<span>pair</span><span>sum</span><span></span>`), px + 4, 66); hide(th);
    const rows = list.map((pp, i) => { const e = add(stage, h('div', 'u4l7-row', `<span>${K(`${pp.m},\\ ${pp.n}`)}</span><span>${K(`${pp.m}+${paren(pp.n)}=${pp.m + pp.n}`)}</span><span class="mk">${pp.ok ? '✓' : ''}</span>`), px, 94 + i * 40); e.style.width = '440px'; hide(e); return e; });
    const okp = list.find((pp) => pp.ok);
    const fin = wline(stage, `The pair: ${K(String(okp.m))} and ${K(String(okp.n))}`, px, 110 + list.length * 40, 'u4l7-ans'); hide(fin);
    void W;
    return [{
      cap: `<b>Step 1:</b> ${T(`a\\times c=${a}\\times${paren(c)}=${ac}`)}.`,
      run: (cc) => cc.fadeIn(l1, 400)
    }, {
      cap: pos ? `${T(ac)} is <b>positive</b>, so the two integers have the <b>same sign</b>.` : `${T(ac)} is <b>negative</b>, so the two integers have <b>opposite signs</b>.`,
      run: async (cc) => { await Promise.all([cc.fadeIn(r1, 300), cc.fadeIn(r2, 300)]); (pos ? r2 : r1).classList.add('dim'); (pos ? r1 : r2).classList.add('lit'); }
    }, {
      cap: pos ? `${T(`b=${b}`)} is ${bneg ? 'negative' : 'positive'}, so <b>both</b> integers are ${bneg ? 'negative' : 'positive'}.` : `${T(`b=${b}`)} is ${bneg ? 'negative' : 'positive'}, so the <b>bigger</b> integer is ${bneg ? 'negative' : 'positive'} and the smaller one is ${bneg ? 'positive' : 'negative'}.`,
      run: (cc) => cc.fadeIn(dec, 400)
    }, {
      cap: `List the factor pairs of ${T(Math.abs(ac))} with those signs (bigger number first) and add each pair.`,
      run: (cc) => Promise.all([cc.fadeIn(th, 300), ...rows.map((e, i) => cc.fadeIn(e, 280, { delay: 200 + i * 180, from: 'translateX(-10px)' }))])
    }, {
      cap: `Only ${T(okp.m)} and ${T(okp.n)} add to ${T(b)} ✓ Their product is ${T(`${okp.m}\\times${paren(okp.n)}=${ac}`)} ✓`,
      run: async (cc) => { list.forEach((pp, i) => rows[i].classList.add(pp.ok ? 'ok' : 'dim')); await Promise.all([pulse(cc, rows[list.indexOf(okp)], 1.05), cc.pop(fin, 380, { delay: 200 })]); }
    }];
  }
};

/* ============ warm-up: The Great Chocolate Split ============ */
function barHTML(rows, cols, s, g, o = {}) {
  const [r1, r2] = rows, [c1, c2] = cols;
  const pieces = [[0, 0, r1, c1, 'milk'], [1, 0, r1, c2, 'dark'], [0, 1, r2, c1, 'dark'], [1, 1, r2, c2, 'milk']];
  let html = '';
  pieces.forEach(([i, j, r, c, kind], k) => {
    if (!r || !c) return;
    const x = i ? c1 * s + g : 0, y = j ? r1 * s + g : 0;
    html += `<button type="button" class="u4l7-pc2 ${kind}${o.open ? ' open' : ''}" data-k="${k}" style="left:${x}px;top:${y}px;width:${c * s}px;height:${r * s}px;--s:${s}px"><span class="u4l7-cnt">${r * c}</span></button>`;
  });
  return { html, w: (c1 + c2) * s + (c1 && c2 ? g : 0), h: (r1 + r2) * s + (r1 && r2 ? g : 0) };
}
function mountWarm() {
  const S = 25, G = 7;
  const put = (id, rows, cols) => { const el = document.getElementById(id); if (!el) return; const b = barHTML(rows, cols, S, G); el.innerHTML = b.html; el.style.width = b.w + 'px'; el.style.height = b.h + 'px'; };
  put('u4l7-barA', [2, 3], [4, 2]);
  put('u4l7-barB', [1, 3], [2, 5]);
  const C = document.getElementById('u4l7-barC');
  if (C) {
    const w = 7 * S + G, hh = 5 * S + G;
    C.style.width = w + 'px'; C.style.height = hh + 'px';
    C.innerHTML = `<div class="u4l7-wrap"><div class="u4l7-wrapv"></div><div class="u4l7-wraph"></div><div class="u4l7-band">still wrapped</div>
      <span class="u4l7-dot milk" style="left:25%;top:25%">2</span><span class="u4l7-dot dark" style="left:75%;top:25%">?</span>
      <span class="u4l7-dot dark" style="left:25%;top:75%">?</span><span class="u4l7-dot milk" style="left:75%;top:75%">3</span></div>`;
  }
  // tap a piece: show / hide its count
  document.querySelectorAll('.u4l7-bars').forEach((host) => host.addEventListener('click', (e) => { const p = e.target.closest('.u4l7-pc2'); if (p) p.classList.toggle('open'); }));
  // Q1 / Q2 answers also open the counts of Bar A / Bar B
  const qs = document.querySelectorAll('[data-ink=warm] .u4l7-wqs .bk-wq');
  const openBar = (id, onOff) => document.querySelectorAll(`#${id} .u4l7-pc2`).forEach((p) => p.classList.toggle('open', onOff));
  qs.forEach((q, i) => {
    const b = q.querySelector('[data-bk-toggle]'); if (!b) return;
    b.addEventListener('click', () => setTimeout(() => { const sh = q.classList.contains('shown'); if (i === 0) openBar('u4l7-barA', sh); if (i === 1) { openBar('u4l7-barA', sh || qs[0].classList.contains('shown')); openBar('u4l7-barB', sh); } }, 0));
  });
  // Snap it yourself
  const SB = { A: { R: 5, C: 6, r: 2, c: 4 }, C: { R: 3, C: 4, r: 2, c: 1 }, Y: { R: 3, C: 7, r: 2, c: 3 } };
  let cur = 'A';
  const st = JSON.parse(JSON.stringify(SB));
  const host = document.getElementById('u4l7-snapbar'), out = document.querySelector('.u4l7-snap-out');
  const render = () => {
    if (!host) return;
    const d = st[cur], s = 30, g = 8, b = barHTML([d.r, d.R - d.r], [d.c, d.C - d.c], s, g, { open: true });
    host.innerHTML = b.html; host.style.width = b.w + 'px'; host.style.height = b.h + 'px';
    const tl = d.r * d.c, tr = d.r * (d.C - d.c), bl = (d.R - d.r) * d.c, br = (d.R - d.r) * (d.C - d.c);
    out.innerHTML = `<div>milk × milk ${K(`=${tl}\\times${br}=${tl * br}`)}</div><div>dark × dark ${K(`=${tr}\\times${bl}=${tr * bl}`)}</div>` +
      `<div class="u4l7-snap-v ok">Same ✓ &nbsp;<span class="muted">dark + dark ${K(`=${tr}+${bl}=${tr + bl}`)}</span></div>`;
  };
  document.querySelectorAll('[data-bar]').forEach((b) => b.addEventListener('click', () => { cur = b.dataset.bar; st[cur] = { ...SB[cur] }; document.querySelectorAll('[data-bar]').forEach((x) => x.classList.toggle('on', x === b)); render(); }));
  document.querySelectorAll('[data-snap]').forEach((b) => b.addEventListener('click', () => {
    const d = st[cur], k = b.dataset.snap;
    if (k === 'r-' && d.r > 1) d.r--; if (k === 'r+' && d.r < d.R - 1) d.r++;
    if (k === 'c-' && d.c > 1) d.c--; if (k === 'c+' && d.c < d.C - 1) d.c++;
    render();
  }));
  render();
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { whyNot, chocBar, decomp6, foilCheck, whichOrder, signPairs, signDecomp, gcfFirst };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}

mountWarm(); mountExplainers();

/* ============ Stand Up Break! — factor ax² + bx + c by decomposition at the whiteboards ============ */
{
  const VS = (v) => Object.keys(v || {}).sort().filter((k) => v[k]).map((k) => (v[k] === 1 ? k : k + '^{' + v[k] + '}')).join('');
  const TM = (c, v, first) => { const s = VS(v), a = Math.abs(c); return c === 0 ? '' : (c < 0 ? '-' : first ? '' : '+') + (a === 1 && s ? '' : a) + s; };
  const P = (ts) => { let o = ''; ts.forEach(([c, v]) => { if (c) o += TM(c, v, o === ''); }); return o || '0'; };
  const B = (ts) => '(' + P(ts) + ')';
  const V = (s, e = 1) => ({ [s]: e });
  /* (pv + q)(Rv + S), nothing common in either bracket, a = pR > 1, b ≠ 0 */
  function pick(r, o) {
    for (;;) {
      const p = r.int(o.p[0], o.p[1]), R = r.int(o.R[0], o.R[1]), q = r.int(1, o.n) * (o.neg ? r.sign() : 1), S = r.int(1, o.n) * (o.neg ? r.sign() : 1);
      const a = p * R, b = p * S + q * R, c = q * S;
      if (a < 2 || b === 0 || gcd(p, q) !== 1 || gcd(R, S) !== 1 || Math.abs(a * c) > o.ac) continue;
      if (o.neg && q > 0 && S > 0) continue;
      if (o.one && p !== 1 && R !== 1) continue;
      return { p, q, R, S, a, b, c };
    }
  }
  /* the worked answer: ac, the pair, the four terms grouped, the factors, the check */
  function decomp(t, v) {
    const { p, q, R, S, a, b, c } = t, m = p * S, n = q * R, x = V(v), x2 = V(v, 2);
    const tri = P([[a, x2], [b, x], [c, {}]]), sec = B([[R, x], [S, {}]]), oth = B([[p, x], [q, {}]]);
    return [
      'a\\times c=' + a + '\\times' + (c < 0 ? '(' + c + ')' : c) + '=' + a * c + ';\\ \\text{pair } ' + m + ',\\ ' + n,
      tri + '=' + P([[a, x2], [m, x], [n, x], [c, {}]]),
      '=' + TM(p, x, true) + sec + (q < 0 ? '-' : '+') + Math.abs(q) + sec + '=' + sec + oth
    ];
  }
  const tri = (t, v) => P([[t.a, V(v, 2)], [t.b, V(v)], [t.c, {}]]);
  const LET = ['x', 'x', 'x', 'x', 'n', 'y', 'm'];
  standup('u4l7', {
    intro: 'Factor by decomposition: find two integers with product ac and sum b, split the middle term, group in pairs, and factor out the common binomial. Check by expanding (FOIL).',
    levels: {
      BEG: (r) => { // 2x² + 7x + 3 = (x + 3)(2x + 1): all positive, one bracket starts with x
        const v = r.pick(LET), t = pick(r, { p: [1, 3], R: [1, 4], n: 5, ac: 40, one: true });
        return { q: tri(t, v), a: decomp(t, v) };
      },
      PRG: (r) => { // 2x² − 9x + 4 = (x − 4)(2x − 1), 2x² + 7x − 4 = (x + 4)(2x − 1): a negative b or c
        const v = r.pick(LET), t = pick(r, { p: [1, 3], R: [2, 4], n: 5, ac: 40, neg: true, one: true });
        return { q: tri(t, v), a: decomp(t, v) };
      },
      MAS: (r) => { // 4x² − 4x − 3 = (2x − 3)(2x + 1): both brackets start with a number bigger than 1
        const v = r.pick(LET), t = pick(r, { p: [2, 3], R: [2, 4], n: 5, ac: 60, neg: r.chance(0.7) });
        return { q: tri(t, v), a: decomp(t, v) };
      }
    }
  });
}
