/* Math 15 · Unit 4 · Lesson 7 — Factoring ax² + bx + c (where a ≠ 1), by decomposition.
 * Reworked 2026-11-10 (Ryan: the lesson was too long and the chocolate-bar proofs confused students): one explainer
 * engine that only shows the written steps — the list of pairs for Steps 1–2 on the left, the working for Steps 3–5 on
 * the right, the check underneath — used three times (all positive, negative signs, GCF first). Plus the Stand Up Break. */
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
const wline = (stage, html, x, y, cls = '') => add(stage, h('div', 'u4l7-wl ' + cls, html), x, y);

/* ============ the six steps, written out ============ */
const BD = {
  m: { a: 2, b: 7, c: 3, pair: [6, 1] },
  e1a: { a: 3, b: 10, c: 3, pair: [9, 1] },
  e1b: { a: 2, b: 9, c: 10, pair: [4, 5] },
  e2a: { a: 2, b: 11, c: 12, pair: [8, 3] },
  e2b: { a: 3, b: 17, c: 10, pair: [15, 2] },
  e2c: { a: 4, b: 12, c: 5, pair: [10, 2] },
  n1: { a: 2, b: -5, c: 3, pair: [-3, -2] },
  n2: { a: 3, b: 5, c: -2, pair: [6, -1] },
  e3a: { a: 2, b: -9, c: 4, pair: [-8, -1] },
  e3b: { a: 3, b: -11, c: 6, pair: [-9, -2] },
  e4a: { a: 2, b: 5, c: -12, pair: [8, -3] },
  e4b: { a: 3, b: -4, c: -4, pair: [-6, 2] },
  e4c: { a: 6, b: -5, c: -6, pair: [-9, 4] },
  g1: { pre: { src: '4x^2+10x-6', g: '2', k: 2 }, a: 2, b: 5, c: -3, pair: [6, -1] },
  g2: { pre: { src: '6x^2+15x+9', g: '3', k: 3 }, a: 2, b: 5, c: 3, pair: [3, 2] },
  e5a: { pre: { src: '6x^2+3x-30', g: '3', k: 3 }, a: 2, b: 1, c: -10, pair: [5, -4] },
  e5b: { pre: { src: '4x^3-2x^2-30x', g: '2x', cubic: true }, a: 2, b: -1, c: -15, pair: [-6, 5] }
};
/* the pairs that multiply to ac, with the signs the sign rule gives, smaller size first (1 × 10, 2 × 5), as Ryan lists them */
function pairList(P, b) {
  const out = [], A = Math.abs(P), sb = b < 0 ? -1 : 1;
  for (let d = 1; d * d <= A; d++) if (A % d === 0) {
    const e = A / d, m = P > 0 ? sb * d : -sb * d, n = sb * e;
    out.push({ m, n, ok: m + n === b });
  }
  return out;
}
/* Ryan's X: ac on top, b underneath, the two numbers on the sides */
function drawX(stage, cx, cy, S) {
  const r = 66, svg = svgEl('svg', { class: 'u4l7-xs' }); stage.appendChild(svg);
  const ln = (x1, y1, x2, y2) => { const e = svgEl('line', { x1, y1, x2, y2, stroke: BLU, 'stroke-width': 5, 'stroke-linecap': 'round' }); svg.appendChild(e); return e; };
  ln(cx - r, cy - r, cx + r, cy + r); ln(cx + r, cy - r, cx - r, cy + r);
  const put = (cls, html, x, y) => { const e = add(stage, h('div', 'u4l7-xv ' + cls, html), x, y); hide(e); return e; };
  const X = {
    svg,
    la: put('lab', K('ac'), cx, cy - r - 16), lb: put('lab', K('b'), cx, cy + r + 18),
    top: put('', K(String(S.ac)), cx, cy - 40), bot: put('', K(String(S.b)), cx, cy + 42),
    L: put('side', K(String(S.lo)), cx - 54, cy), R: put('side', K(String(S.hi)), cx + 54, cy)
  };
  hide(svg);
  return X;
}
function makeSteps(title, choices, o = {}) {
  const H = o.pre ? 526 : 480;
  return {
    title, height: H, choices, minW: 900,
    intro: (k) => { const d = BD[k]; return `Factor ${T(d.pre ? d.pre.src : solve(d).tri)}, one step at a time.`; },
    make(stage, key) {
      const d = BD[key], S = solve(d), pre = d.pre, g = pre ? pre.g : '', oy = o.pre ? 46 : 0;
      const lx = 24, rx = 486, sn = (n, x, y) => { const e = add(stage, h('div', 'u4l7-sn', n), x, y); hide(e); return e; };
      add(stage, box(h('div', 'u4l7-vsep'), 0, H - 84 - oy), 462, 16 + oy);
      const list = pairList(S.ac, S.b), okp = list.find((pp) => pp.ok); S.lo = okp.m; S.hi = okp.n;
      // GCF first (section 5): the first line, across the top
      const P1 = pre ? wline(stage, `<span class="u4l7-gtag">GCF first</span>${K(`${pre.src}=${g}(${S.tri})`)}`, lx, 14) : null; if (P1) hide(P1);
      // the standard form above the trinomial: where a, b and c come from
      const bT = mono(S.b, S.v, 1, false), cT = mono(S.c, S.v, 0, false);
      const grid = add(stage, h('div', 'u4l7-std',
        `<span class="f">${K(tc(BLU, 'a') + 'x^2')}</span><span class="f">${K('+' + tc(TEAL, 'b') + 'x')}</span><span class="f">${K('+' + tc(BLU, 'c'))}</span>` +
        `<span class="t">${K(S.TL)}</span><span class="t">${K(bT)}</span><span class="t">${K(cT)}</span>`), lx + 44, 12 + oy);
      const stdF = [...grid.querySelectorAll('.f')], triT2 = [...grid.querySelectorAll('.t')]; hide(...stdF); if (pre) hide(...triT2);
      const abc = wline(stage, K(`${tc(BLU, 'a=' + S.a)},\\ \\ ${tc(TEAL, 'b=' + S.b)},\\ \\ ${tc(BLU, 'c=' + S.c)}`), lx + 216, 58 + oy, 'u4l7-abc'); hide(abc);
      const n1 = sn('1', lx, 116 + oy), lac = wline(stage, K(`${tc(BLU, 'a')}\\times ${tc(BLU, 'c')}=${S.a}\\times${paren(S.c)}=${S.ac}`), lx + 44, 112 + oy); hide(lac);
      const n2 = sn('2', lx, 168 + oy), want = wline(stage, `multiply to <b>${K(String(S.ac))}</b>, add to <b>${K(String(S.b))}</b>`, lx + 44, 166 + oy, 'sm'); hide(want);
      const X = drawX(stage, lx + 128, 312 + oy, S);
      const rh = list.length > 4 ? 31 : 38, ly = 312 + oy - (list.length * rh) / 2;
      const rows = list.map((pp, i) => { const e = add(stage, h('div', 'u4l7-pr', K(`${pp.m}\\times${paren(pp.n)}`)), lx + 262, ly + i * rh); e.style.height = (rh - 4) + 'px'; hide(e); return e; });
      // right: the written work, one numbered line per step
      const L = [];
      L.push(['S', '3', K(`${S.TL}${tc(AMB, S.sgn(1))}${tc(AMB, S.sgn(2))}${S.sgn(3)}`)]);
      L.push(['G', '4', K(`=\\htmlClass{u4l7-g1}{${S.r1T}${tc(COLC, '(' + S.colB + ')')}}\\htmlClass{u4l7-g2}{${grp2(S)}${tc(COLC, '(' + S.colB + ')')}}`)]);
      L.push(['F', '5', K(`=${tc(COLC, '(' + S.colB + ')')}(${S.rowB})`)]);
      if (pre) L.push(['FIN', '', K(`\\text{Answer: }${g}(${S.colB})(${S.rowB})`)]);
      const E = {}, N = {};
      L.forEach(([k, n, html], i) => {
        const y = 28 + oy + i * 76;
        if (n) N[k] = sn(n, rx, y + 4);
        E[k] = wline(stage, html, rx + 44, y, (k === 'F' && !pre) || k === 'FIN' ? 'u4l7-ans' : ''); hide(E[k]);
      });
      const g1 = spans(E.G, 'u4l7-g1'), g2 = spans(E.G, 'u4l7-g2'); hide(...g1, ...g2);
      const prod = `(${S.colB})(${S.rowB})`;
      const n6 = sn('6', lx, H - 50);
      const chk = wline(stage, K(pre ? `\\text{Check: }${g}${prod}=${g}(${S.foil})=${pre.src}\\ \\checkmark` : `\\text{Check: }${prod}=${S.foil}=${S.tri}\\ \\checkmark`), lx + 44, H - 52, 'sm'); hide(chk);
      const first2 = `${S.TL}${S.sgn(1)}`, last2 = `${S.BL}${S.sgn(3)}`, f2 = grp2(S).replace(/^\+/, '');
      const steps = [];
      if (pre) {
        steps.push({
          cap: (pre.cubic ? `<b>GCF first:</b> every term has a ${T(2)} and an ${T('x')}.` : `<b>GCF first:</b> every term is a multiple of ${g}.`) + ` ${T(`${pre.src}=${g}(${S.tri})`)}. Now factor the trinomial in the bracket.`,
          run: (c) => Promise.all([c.fadeIn(P1, 400), ...triT2.map((e) => c.fadeIn(e, 400, { delay: 350 }))])
        });
      }
      steps.push({
        cap: `<b>Step 1: multiply ${T('a\\times c')}.</b> Line the trinomial up with ${T('ax^2+bx+c')}: ${T('a=' + S.a)} and ${T('c=' + S.c)}, so ${T(`a\\times c=${S.a}\\times${paren(S.c)}=${S.ac}`)}.`,
        run: (c) => Promise.all([...stdF.map((e, i) => c.fadeIn(e, 350, { delay: i * 120 })), c.fadeIn(abc, 350, { delay: 450 }), c.pop(n1, 320, { delay: 700 }), c.fadeIn(lac, 400, { delay: 800 })])
      }, {
        cap: `<b>Step 2: find two numbers.</b> Draw the X: ${T('ac=' + S.ac)} goes on top, ${T('b=' + S.b)} goes underneath. The two numbers <b>multiply to ${T(S.ac)}</b> and <b>add to ${T(S.b)}</b>.`,
        run: (c) => Promise.all([c.pop(n2, 320), c.fadeIn(want, 350, { delay: 100 }), c.fadeIn(X.svg, 350, { delay: 250 }), c.fadeIn(X.la, 300, { delay: 450 }), c.pop(X.top, 340, { delay: 500 }), c.fadeIn(X.lb, 300, { delay: 700 }), c.pop(X.bot, 340, { delay: 750 })])
      }, {
        cap: `List the pairs that multiply to ${T(S.ac)}.` + (o.signs ? ` ${signNote(S)}` : ''),
        run: (c) => Promise.all(rows.map((e, i) => c.fadeIn(e, 280, { delay: i * 170, from: 'translateX(-10px)' })))
      }, {
        cap: `Which pair adds to ${T(S.b)}? ${T(`${okp.m}+${paren(okp.n)}=${S.b}`)} ✓ Circle it. The two numbers are ${T(okp.m)} and ${T(okp.n)}.`,
        run: async (c) => { list.forEach((pp, i) => rows[i].classList.add(pp.ok ? 'ok' : 'dim')); await pulse(c, rows[list.indexOf(okp)], 1.08); await Promise.all([c.pop(X.L, 360), c.pop(X.R, 360, { delay: 150 })]); }
      }, {
        cap: `<b>Step 3: split the middle term.</b> Write ${T(S.bx)} as ${T(`${S.TR}${S.sgn(2)}`)}. Nothing else changes. Now there are <b>four terms</b>.`,
        run: (c) => Promise.all([c.pop(N.S, 320), c.fadeIn(E.S, 400, { delay: 150 })])
      }, {
        cap: `<b>Step 4: group in pairs.</b> The <b>first two</b> terms, ${T(first2)}, have a GCF of ${T(S.r1T)}: ${T(`${first2}=${S.r1T}(${S.colB})`)}.`,
        run: (c) => Promise.all([c.pop(N.G, 320), c.fadeIn(E.G, 10), showSpans(c, g1, 400)])
      }, {
        cap: `Now the <b>last two</b> terms, ${T(last2)}. Take out ${T(S.r2P)}${S.r2 < 0 ? ', a <b>negative</b>,' : ''} so the bracket <b>matches</b>: ${T(`${last2}=${f2}(${S.colB})`)}.`,
        run: (c) => showSpans(c, g2, 400)
      }, {
        cap: `<b>Step 5: factor out the bracket.</b> Both parts have ${T(`(${S.colB})`)}, so it is their GCF. What’s left, ${T(S.r1T)} and ${T(S.r2T)}, makes the other bracket: ${T(`(${S.colB})(${S.rowB})`)}.`,
        run: (c) => Promise.all([c.pop(N.F, 320), c.fadeIn(E.F, 400, { delay: 150 })])
      });
      if (pre) steps.push({ cap: `Put the GCF back in front: ${T(`${pre.src}=${g}(${S.colB})(${S.rowB})`)}.`, run: (c) => c.fadeIn(E.FIN, 400) });
      steps.push({
        cap: `<b>Step 6: check by expanding.</b> ${T(`${g}${prod}=${pre ? g + '(' + S.foil + ')' : S.foil}`)}, which gives back ${T(pre ? pre.src : S.tri)} ✓`,
        run: (c) => Promise.all([c.pop(n6, 320), c.fadeIn(chk, 400, { delay: 150 })])
      });
      return steps;
    }
  };
}
const steps = makeSteps('The six steps', [{ v: 'm', label: tex('2x^2+7x+3') }, { sep: 'Example 1 check:' }, { v: 'e1a', label: '(a)' }, { v: 'e1b', label: '(b)' }, { sep: 'Example 2 check:' }, { v: 'e2a', label: '(a)' }, { v: 'e2b', label: '(b)' }, { v: 'e2c', label: '(c)' }]);
const signs = makeSteps('The six steps with negative signs', [{ v: 'n1', label: tex('2x^2-5x+3') }, { v: 'n2', label: tex('3x^2+5x-2') }, { sep: 'Example 3 check:' }, { v: 'e3a', label: '(a)' }, { v: 'e3b', label: '(b)' }, { sep: 'Example 4 check:' }, { v: 'e4a', label: '(a)' }, { v: 'e4b', label: '(b)' }, { v: 'e4c', label: '(c)' }], { signs: true });
const gcfFirst = makeSteps('GCF first, then the six steps', [{ v: 'g1', label: tex('4x^2+10x-6') }, { v: 'g2', label: tex('6x^2+15x+9') }, { sep: 'Example 5 check:' }, { v: 'e5a', label: '(a)' }, { v: 'e5b', label: '(b)' }], { signs: true, pre: true });

/* ============ why Step 5 works: the bracket is one thing, like a letter ============ */
const W5 = { m: 'm', n: 'e3a', k: 'e4b', w: 'e2c' };
const grpT = (S) => `${S.r1T}(${S.colB})${grp2(S)}(${S.colB})`;
const whyFive = {
  title: 'Why Step 5 works',
  height: 400,
  choices: Object.keys(W5).map((v) => ({ v, label: tex(grpT(solve(BD[W5[v]]))) })),
  intro: (k) => `How can a whole bracket be the GCF of ${T(grpT(solve(BD[W5[k]])))}?`,
  make(stage, key, ex) {
    const W = ex.W, S = solve(BD[W5[key]]), g2 = grp2(S), br = `(${S.colB})`, rest = `(${S.rowB})`;
    const coef2 = g2.replace(/^[+-]/, ''), sg = g2[0];
    const tile = (inner, cls) => `<span class="u4l7-tile ${cls}">${K(inner)}</span>`;
    const yT = (cls) => tile('y', cls), bT = (cls) => tile(br, cls);
    const mid = Math.round(W / 2);
    // top: with a letter
    add(stage, h('div', 'u4l7-ptag', 'With a letter (you know this one)'), 24, 16);
    const A1 = wline(stage, `${K(S.r1T)}${yT('')}${K(sg)}${K(coef2)}${yT('')}`, 60, 46, 'u4l7-w5'); hide(A1);
    const A2 = wline(stage, `${K('=')}${yT('')}${K(rest)}`, mid + 70, 46, 'u4l7-w5'); hide(A2);
    add(stage, box(h('div', 'u4l7-hsep'), W - 48, 0), 24, 128);
    // bottom: with a bracket
    add(stage, h('div', 'u4l7-ptag', 'With a bracket (Step 4’s line)'), 24, 146);
    const B1 = wline(stage, `${K(S.r1T)}${bT('b')}${K(sg)}${K(coef2)}${bT('b')}`, 60, 178, 'u4l7-w5'); hide(B1);
    const B2 = wline(stage, `${K('=')}${bT('b')}${K(rest)}`, mid + 70, 178, 'u4l7-w5'); hide(B2);
    const note = add(stage, h('div', 'u4l7-w5n', `The bracket ${K(br)} is <b>one thing</b>, just like the letter ${K('y')}. Whatever both terms share comes out the front.`), 60, 268); note.style.width = (W - 120) + 'px'; hide(note);
    const chk = wline(stage, K(`\\text{Check: }${tc(COLC, br)}\\cdot ${S.r1T}=${S.r1T}${br}\\qquad ${tc(COLC, br)}\\cdot ${paren(S.r2P)}=${g2.replace(/^\+/, '')}${br}\\ \\checkmark`), 60, 344, 'sm'); hide(chk);
    const tiles = (el) => [...el.querySelectorAll('.u4l7-tile')];
    const cover = (els, yes) => els.forEach((e) => e.classList.toggle('cov', yes));
    return [{
      cap: `Start with one you already know: ${T(`${S.r1T}y${sg}${coef2}y`)}. Both terms have a ${T('y')}.`,
      run: async (c) => { await c.fadeIn(A1, 400); await Promise.all(tiles(A1).map((e) => pulse(c, e, 1.15))); }
    }, {
      cap: `So ${T('y')} is the GCF. Take it out the front; what’s left, ${T(S.r1T)} and ${T(S.r2T)}, goes in a bracket: ${T(`y${rest}`)}.`,
      run: (c) => c.fadeIn(A2, 400)
    }, {
      cap: `Now Step 4’s line: ${T(grpT(S))}. Both terms have ${T(br)}.`,
      run: async (c) => { await c.fadeIn(B1, 400); await Promise.all(tiles(B1).map((e) => pulse(c, e, 1.1))); }
    }, {
      cap: `<b>Cover the bracket.</b> It is just one thing sitting in both terms, exactly where the ${T('y')} was.`,
      run: async (c) => { cover(tiles(B1), true); await Promise.all([...tiles(B1), ...tiles(A1)].map((e) => pulse(c, e, 1.12))); }
    }, {
      cap: `So take it out the front the same way. What’s left, ${T(S.r1T)} and ${T(S.r2T)}, goes in a bracket.`,
      run: (c) => { cover(tiles(B2), true); return c.fadeIn(B2, 400); }
    }, {
      cap: `<b>Uncover it:</b> ${T(`${grpT(S)}=${br}${rest}`)}. The bracket ${T(br)} was the GCF.`,
      run: async (c) => { cover([...tiles(B1), ...tiles(B2)], false); await Promise.all([pulse(c, B2, 1.05), c.fadeIn(note, 400, { delay: 200 })]); }
    }, {
      cap: `Check it by multiplying back: ${T(br)} times ${T(S.r1T)}, and ${T(br)} times ${T(S.r2P)}, gives Step 4’s line again ✓`,
      run: (c) => c.fadeIn(chk, 400)
    }];
  }
};

/* ============ wiring ============ */
{
  const defs = { steps, whyFive, signs, gcfFirst };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}

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
