/* Math 15 · Unit 4 · Lesson 4 — Factoring Trinomials x² + bx + c, Part 2: c Negative.
 * Explainers (four sign choices, zero pairs: why the bigger number wins, inspection with c < 0, catch the error, the
 * factor-pair table, prime trinomials, common factor first), the secret-number-pairs warm-up, and the Stand Up Break.
 * Built on Math 15 u4l4 / Math 10C u4l4 (search panel, signs table, inspection, error check). */
import { h, fmt, Explainer } from '../explain.js';
import { tex } from '../tex.js';
import { standup } from '../standup.js';
import { NumberLine } from '../blocks.js';

const at = (el, x, y) => { el.style.left = x + 'px'; el.style.top = y + 'px'; return el; };
const add = (stage, el, x, y) => { stage.appendChild(at(el, x, y)); return el; };
const hide = (...els) => els.forEach((e) => { if (e) e.style.opacity = 0; });
const box = (el, w, hh) => { el.style.width = w + 'px'; el.style.height = hh + 'px'; return el; };
const svgEl = (tag, attrs = {}) => { const e = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };

/* KaTeX allowing \htmlClass, so parts of a line can be revealed one at a time */
const K = (src, display) => {
  try { return window.katex.renderToString(String(src), { displayMode: !!display, throwOnError: false, strict: 'ignore', trust: true, output: 'html' }); }
  catch (e) { return tex(src, display); }
};
const T = (s) => tex(s);
const spans = (root, cls) => [...root.querySelectorAll('.' + cls)];
const showSpans = (c, els, ms = 320, delay = 0) => Promise.all(els.map((e) => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], ms, { delay })));
const pulse = (c, el, s = 1.1) => c.anim(el, [{ transform: 'scale(1)' }, { transform: `scale(${s})` }, { transform: 'scale(1)' }], 460);
function stampIn(c, el) { return c.anim(el, [{ opacity: 0, transform: 'scale(1.9) rotate(-14deg)' }, { opacity: 1, transform: 'scale(1) rotate(-6deg)' }], 420, { easing: 'cubic-bezier(.2,1.4,.4,1)' }); }

const TEAL = '#13807a', AMB = '#c27a0e', PUR = '#7b4fc4', BLU = '#2f6fd0', RED = '#c93a33';
const FOILC = [TEAL, AMB, PUR, BLU];
const tc = (col, s) => `\\textcolor{${col}}{${s}}`;
const mns = (n) => String(n).replace('-', '−'); // a real minus sign in plain text

/* ============ polynomial helpers: a term is { c: coefficient, v: { x: 2, y: 1 } } ============ */
function parseTerm(s) {
  const m = String(s).replace(/\s+/g, '').match(/^([+-]?)(\d*)((?:[a-z](?:\^\d+)?)*)$/);
  if (!m) throw new Error('bad term ' + s);
  const v = {};
  (m[3].match(/[a-z](?:\^\d+)?/g) || []).forEach((p) => { const k = p[0], e = p.length > 1 ? parseInt(p.slice(2), 10) : 1; v[k] = (v[k] || 0) + e; });
  return { c: (m[1] === '-' ? -1 : 1) * (m[2] === '' ? 1 : parseInt(m[2], 10)), v };
}
const parsePoly = (s) => String(s).replace(/\s+/g, '').match(/[+-]?[^+-]+/g).map(parseTerm);
const mulT = (a, b) => { const v = { ...a.v }; for (const k in b.v) v[k] = (v[k] || 0) + b.v[k]; return { c: a.c * b.c, v }; };
const keyT = (t) => Object.keys(t.v).sort().map((k) => k + t.v[k]).join('');
const degT = (t) => Object.values(t.v).reduce((s, e) => s + e, 0);
const numT = (n) => fmt(n).replace(/ /g, '\\,');
function bodyT(t) {
  const a = Math.abs(t.c), vs = Object.keys(t.v).sort().map((k) => (t.v[k] === 1 ? k : `${k}^{${t.v[k]}}`)).join('');
  return vs ? (a === 1 ? '' : numT(a)) + vs : numT(a);
}
const termT = (t, first) => (t.c < 0 ? '-' : first ? '' : '+') + bodyT(t);
const polyT = (list) => (list.length ? list.map((t, i) => termT(t, i === 0)).join('') : '0');
function collect(list) {
  const m = new Map();
  list.forEach((t) => { const k = keyT(t); if (m.has(k)) m.get(k).c += t.c; else m.set(k, { c: t.c, v: { ...t.v } }); });
  return [...m.values()].map((t, i) => ({ t, i })).filter((o) => o.t.c !== 0).sort((a, b) => degT(b.t) - degT(a.t) || a.i - b.i).map((o) => o.t);
}
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function gcfT(terms) {
  let g = 0; terms.forEach((t) => (g = gcd(g, Math.abs(t.c))));
  const v = {}; Object.keys(terms[0].v).forEach((k) => { if (terms.every((t) => t.v[k])) v[k] = Math.min(...terms.map((t) => t.v[k])); });
  return { c: g, v };
}
function divT(t, g) { const v = { ...t.v }; for (const k in g.v) { v[k] -= g.v[k]; if (!v[k]) delete v[k]; } return { c: t.c / g.c, v }; }
const evalT = (list, val) => list.reduce((s, t) => s + t.c * Math.pow(val, degT(t)), 0);
const par = (n) => (n < 0 ? `(${n})` : String(n)); // a number written for adding or multiplying: (−3)
const sgn = (n) => (n < 0 ? String(n) : '+' + n);
/* x + 5, x − 3 */
const binT = (v, n, w = '') => (n === 0 ? v : `${v}${n < 0 ? '-' : '+'}${Math.abs(n) === 1 && w ? '' : Math.abs(n)}${w}`);
/* x² + bx + c */
const triT = (b, c, v = 'x', w = '') => polyT([{ c: 1, v: { [v]: 2 } }, { c: b, v: w ? { [v]: 1, [w]: 1 } : { [v]: 1 } }, { c, v: w ? { [w]: 2 } : {} }].filter((t) => t.c));
/* the booklet writes the pair smaller-first when c > 0 */
const ordered = (m, n, c) => (c < 0 ? [n, m] : [m, n]);

/* every factor pair of |c|, signed by the signs rule, with its sum. m is the one nearer 0. */
function searchRows(b, c) {
  const A = Math.abs(c), out = [], sb = b < 0 ? -1 : 1;
  for (let s = 1; s * s <= A; s++) if (A % s === 0) {
    const l = A / s, m = c > 0 ? sb * s : -sb * s, n = sb * l;
    out.push({ s, l, m, n, sum: m + n, ok: m + n === b });
  }
  return out;
}
const sumT = (r) => `${r.m}+${par(r.n)}=${r.sum}`;

/* ============ shared explainer pieces ============ */
/* the factor-pair search: one row per factor pair, lighting up the pair whose sum matches */
function searchPanel(stage, x, y, w, b, c, o) {
  const rows = searchRows(b, c);
  const wrap = add(stage, box(h('div', 'u4l4-sp'), w, 0), x, y); wrap.style.height = 'auto';
  wrap.innerHTML = `<div class="u4l4-sph">${o.title}</div>`;
  const els = rows.map((r) => { const e = h('div', 'u4l4-sr' + (o.cls ? ' ' + o.cls : ''), o.row(r) + `<span class="u4l4-srm">${r.ok ? '✓' : '✗'}</span>`); wrap.appendChild(e); hide(e); return e; });
  hide(wrap);
  return {
    rows, els, wrap, hit: rows.find((r) => r.ok) || null,
    async run(c) {
      if (wrap.style.opacity !== '1') await c.fadeIn(wrap, 260);
      for (let i = 0; i < rows.length; i++) {
        await c.fadeIn(els[i], 280, { from: 'translateX(-12px)' });
        els[i].classList.add(rows[i].ok ? 'hit' : 'miss');
        if (rows[i].ok) await c.pop(els[i].lastChild, 380); else await c.sleep(170);
      }
    }
  };
}
const rowPlain = (r) => `<span class="u4l4-srp">${K(`${r.s}\\times${numT(r.l)}`)}</span><span class="u4l4-sri">${K(`${r.m},\\ ${r.n}`)}</span><span class="u4l4-srs">${K(sumT(r))}</span>`;
const rowPos = (r) => `<span class="u4l4-srp">${K(`${r.s}\\times${numT(r.l)}`)}</span><span class="u4l4-srs">${K(sumT(r))}</span>`;

/* the full signs table, small, with the cell for this trinomial lighting up */
function signsMini(stage, x, y) {
  const e = add(stage, h('div', 'u4l4-sg'), x, y);
  e.innerHTML = `<div class="u4l4-sgc hd"></div><div class="u4l4-sgc hd">${K('b')} positive</div><div class="u4l4-sgc hd">${K('b')} negative</div>
    <div class="u4l4-sgc hd">${K('c')} positive</div><div class="u4l4-sgc" data-k="pp"><div>both <b>+</b></div></div><div class="u4l4-sgc" data-k="pn"><div>both <b>−</b></div></div>
    <div class="u4l4-sgc hd">${K('c')} negative</div><div class="u4l4-sgc" data-k="np"><div>opposite;<br>bigger one <b>+</b></div></div><div class="u4l4-sgc" data-k="nn"><div>opposite;<br>bigger one <b>−</b></div></div>`;
  hide(e);
  return {
    el: e,
    async light(c, b, cc) {
      await c.fadeIn(e, 260);
      const cell = e.querySelector(`[data-k=${(cc > 0 ? 'p' : 'n') + (b >= 0 ? 'p' : 'n')}]`);
      cell.classList.add('on'); e.classList.add('lit');
      await pulse(c, cell, 1.08);
    }
  };
}
function signsCap(b, c) {
  if (c > 0) return `${T(`c=${c}`)} is <b>positive</b>, so the two numbers have the <b>same sign</b>, the sign of ${T('b')}.`;
  return `${T(`c=${c}`)} is <b>negative</b>, so the two numbers have <b>opposite signs</b>. ${T(`b=${b}`)} is ${b > 0 ? 'positive' : 'negative'}, so the <b>bigger</b> one is <b>${b > 0 ? 'positive' : 'negative'}</b>.`;
}

/* ============ 1. Same pair, four sign choices (c negative) ============ */
const SF = { p3: [3, 6, 1], m3: [3, 6, -1], a: [2, 11, 1], b: [2, 11, -1] };
const signs4 = {
  title: 'Same pair, four sign choices', height: 486,
  minW: 940,
  choices: [{ v: 'p3', label: tex('x^2+3x-18') }, { v: 'm3', label: tex('x^2-3x-18') }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  intro: (k) => { const [s, l, sb] = SF[k]; return `Factor ${T(triT(sb * (l - s), -s * l))}. The numbers ${s} and ${l} multiply to ${s * l}. But which signs give a product of ${T(String(-s * l))}?`; },
  make(stage, key, ex) {
    const W = ex.W, [s, l, sb] = SF[key], b = sb * (l - s), c = -s * l, P = triT(b, c);
    add(stage, h('div', 'u4l4-iq', 'Factor'), 24, 12);
    add(stage, h('div', 'u4l4-ie', K(P)), 24, 34);
    const need = add(stage, h('div', 'u4l4-need wide', `Need: product ${K(String(c))} &nbsp; sum ${K(String(b))}`), W - 24 - 380, 30); hide(need);
    const opts = [[s, l], [-s, -l], [s, -l], [-s, l]];
    const gap = 16, cw = (W - 48 - 3 * gap) / 4, cy = 108;
    const cards = opts.map(([u, v], i) => {
      const e = add(stage, box(h('div', 'u4l4-sfc'), cw, 172), 24 + i * (cw + gap), cy);
      e.innerHTML = `<div class="u4l4-sfh">${K(`${sgn(u)},\\ ${sgn(v)}`)}</div>
        <div class="u4l4-sfr pr"><div class="u4l4-sfl">product</div><div>${K(`(${sgn(u)})(${sgn(v)})=${sgn(u * v)}`)}</div></div>
        <div class="u4l4-sfr sm"><div class="u4l4-sfl">sum</div><div>${K(`${u}+${par(v)}=${u + v}`)}</div></div><div class="u4l4-sfm"></div>`;
      hide(e, e.querySelector('.pr'), e.querySelector('.sm'));
      return { e, u, v, prod: u * v, sum: u + v };
    });
    const win = cards.find((k) => k.prod === c && k.sum === b), lose = cards.find((k) => k.prod === c && k !== win);
    const big = Math.abs(win.u) > Math.abs(win.v) ? win.u : win.v, small = big === win.u ? win.v : win.u;
    const NL = new NumberLine(stage, { x: 24, y: 300, width: W - 48, height: 100, min: -12, max: 12 }); NL.el.style.opacity = 0;
    const [f1, f2] = ordered(small, big, c);
    const res = add(stage, h('div', 'u4l4-ie u4l4-fac', K(`${P}=(${binT('x', f1)})(${binT('x', f2)})`)), 24, 410); hide(res);
    const rule = add(stage, h('div', 'u4l4-rulep', `${T('c')} negative: <b>opposite signs</b>,<br>the bigger one has the sign of ${T('b')}`), 0, 404); rule.style.left = 'auto'; rule.style.right = '24px'; hide(rule);
    const mark = (k, ok, txt) => { const m = k.e.querySelector('.u4l4-sfm'); m.textContent = txt; k.e.classList.add(ok ? 'hit' : 'out'); return m; };
    const dir = (n) => (n < 0 ? 'left' : 'right');
    return [{
      cap: `We need two numbers with <b>product</b> ${T(String(c))} and <b>sum</b> ${T(String(b))}. The pair ${s} and ${l} multiplies to ${s * l}. There are <b>four</b> ways to give them signs.`,
      run: (cx) => Promise.all([cx.fadeIn(need, 300), ...cards.map((k, i) => cx.fadeIn(k.e, 320, { delay: 150 + i * 120 }))])
    }, {
      cap: `Multiply each pair. <b>Same signs</b> give ${T(`+${s * l}`)}: wrong product, so cross those two out. <b>Opposite signs</b> give ${T(String(c))} ✓.`,
      run: async (cx) => {
        await Promise.all(cards.map((k, i) => cx.fadeIn(k.e.querySelector('.pr'), 300, { delay: i * 150 })));
        await Promise.all(cards.filter((k) => k.prod !== c).map((k) => cx.pop(mark(k, false, '✗'), 300)));
      }
    }, {
      cap: `${T('c')} is negative, so the signs are <b>opposite</b>. Now add the two pairs that are left: ${T(`${s}+(${-l})=${s - l}`)} and ${T(`${-s}+${l}=${l - s}`)}.`,
      run: (cx) => Promise.all(cards.filter((k) => k.prod === c).map((k, i) => cx.fadeIn(k.e.querySelector('.sm'), 300, { delay: i * 200 })))
    }, {
      cap: `Only ${T(`${big}`)} and ${T(`${small}`)} add to ${T(String(b))}. On a number line: move ${Math.abs(big)} ${dir(big)}, then ${Math.abs(small)} back ${dir(small)}. The <b>bigger</b> move wins, so the sum has <b>its</b> sign.`,
      run: async (cx) => {
        await Promise.all([cx.pop(mark(win, true, '✓'), 360), cx.pop(mark(lose, false, '✗'), 360)]);
        await cx.anim(NL.el, [{ opacity: 0 }, { opacity: 1 }], 300);
        await NL.hop(cx, 0, big, { label: mns(sgn(big)), color: 'purple', height: 40 });
        await NL.hop(cx, big, b, { label: mns(sgn(small)), color: 'purple', height: 18 });
        NL.point(b, { color: 'green' });
      }
    }, {
      cap: `So ${T(`${P}=(${binT('x', f1)})(${binT('x', f2)})`)}. The bigger number, ${T(String(Math.abs(big)))}, takes the sign of ${T('b')}.`,
      run: (cx) => Promise.all([cx.fadeIn(res, 380), cx.fadeIn(rule, 380, { delay: 200 })])
    }];
  }
};

/* ============ 1. Zero pairs: why the bigger number wins ============ */
const ZP = { a: [11, -2], b: [-11, 2], p: [6, -3], m: [-6, 3] };
const zeroPairs = {
  title: 'Zero pairs: why the bigger number wins', height: 420,
  minW: 900,
  choices: [{ v: 'p', label: tex('6+(-3)') }, { v: 'm', label: tex('-6+3') }, { sep: 'Example 1 check:' }, { v: 'a', label: '(a)' }, { v: 'b', label: '(b)' }],
  intro: (k) => { const [u, v] = ZP[k]; return `Add ${T(`${u}+${par(v)}`)} with counters. A yellow counter is ${T('+1')}, a blue counter is ${T('-1')}.`; },
  make(stage, key, ex) {
    const W = ex.W, [u, v] = ZP[key], pos = Math.max(u, v), neg = Math.min(u, v), np = pos, nn = -neg, sum = u + v;
    const big = Math.abs(u) > Math.abs(v) ? u : v, small = big === u ? v : u, b = sum, c = u * v;
    const P = triT(b, c), [f1, f2] = ordered(small, big, c);
    add(stage, h('div', 'u4l4-iq', 'Add'), 24, 12);
    const q = add(stage, h('div', 'u4l4-ie', K(`${u}+${par(v)}\\htmlClass{u4l4-za}{{}=${sum}}`)), 24, 34);
    const qa = spans(q, 'u4l4-za'); hide(...qa);
    const S = 60, G = 10, x0 = 150, yP = 100, yN = 180;
    const labP = add(stage, h('div', 'u4l4-zl p', `${np} × ${T('+1')}`), 24, yP + 12), labN = add(stage, h('div', 'u4l4-zl n', `${nn} × ${T('-1')}`), 24, yN + 12); hide(labP, labN);
    const cP = [], cN = [];
    for (let i = 0; i < np; i++) { const e = add(stage, box(h('div', 'u4l4-ctr p', '+'), S, S), x0 + i * (S + G), yP); hide(e); cP.push(e); }
    for (let i = 0; i < nn; i++) { const e = add(stage, box(h('div', 'u4l4-ctr n', '−'), S, S), x0 + i * (S + G), yN); hide(e); cN.push(e); }
    const k = Math.min(np, nn), boxes = [];
    for (let i = 0; i < k; i++) { const e = add(stage, box(h('div', 'u4l4-zb', '<div>0</div>'), S + 8, 2 * S + 30), x0 + i * (S + G) - 4, yP - 4); hide(e); boxes.push(e); }
    const left = (np > nn ? cP : cN).slice(k), cancelled = [...cP.slice(0, k), ...cN.slice(0, k)];
    const res = add(stage, h('div', 'u4l4-zres', `${Math.abs(sum)} ${sum > 0 ? 'yellow' : 'blue'} counter${Math.abs(sum) === 1 ? '' : 's'} left: ${K(`${u}+${par(v)}=${sum}`)}`), x0, 286); hide(res);
    const tri = add(stage, h('div', 'u4l4-ztri', `In ${K(P)}: product ${K(String(c))}, sum ${K(String(b))}, so ${K(`${P}=(${binT('x', f1)})(${binT('x', f2)})`)}`), 24, 350); hide(tri);
    return [{
      cap: `Lay out ${np} yellow counters (${T(`+${np}`)}) and ${nn} blue counters (${T(`-${nn}`)}).`,
      run: (cx) => Promise.all([cx.fadeIn(labP, 250), cx.fadeIn(labN, 250, { delay: 150 }), ...cP.map((e, i) => cx.pop(e, 300, { delay: i * 50 })), ...cN.map((e, i) => cx.pop(e, 300, { delay: 200 + i * 50 }))])
    }, {
      cap: `Match each blue counter with a yellow one. ${T('(+1)+(-1)=0')}: each pair is a <b>zero pair</b>, so it cancels. That makes ${k} zero pair${k === 1 ? '' : 's'}.`,
      run: async (cx) => {
        await Promise.all(boxes.map((e, i) => cx.pop(e, 320, { delay: i * 90 })));
        await Promise.all(cancelled.map((e) => cx.anim(e, [{ opacity: 1 }, { opacity: 0.15 }], 450, { delay: 150 })));
      }
    }, {
      cap: `${Math.abs(sum)} ${sum > 0 ? 'yellow' : 'blue'} counters are left, so ${T(`${u}+${par(v)}=${sum}`)}. There were more ${big > 0 ? 'yellow' : 'blue'} counters, so the sum is <b>${big > 0 ? 'positive' : 'negative'}</b>: the <b>bigger</b> number wins.`,
      run: async (cx) => { left.forEach((e) => e.classList.add('win')); await Promise.all([...left.map((e) => pulse(cx, e, 1.12)), cx.fadeIn(res, 350), showSpans(cx, qa, 300)]); }
    }, {
      cap: `That is the rule for factoring with ${T('c')} negative: the bigger number takes the sign of ${T('b')}. ${T(`${P}=(${binT('x', f1)})(${binT('x', f2)})`)}.`,
      run: (cx) => cx.fadeIn(tri, 380)
    }];
  }
};

/* ============ 1 & 4. Factoring by inspection: (common factor,) signs, pair, check ============ */
const IN = {
  p3: 'x^2+3x-18', a2: 'x^2+2x-24', b2: 'x^2-10x-24', c2: 'n^2+n-30', d2: 'n^2-n-30',
  g: '2x^2+10x-48', a5: '2x^2+4x-30', b5: '3x^2-6x-45', c5: '2x^3+2x^2-24x'
};
function analyse(e) {
  const terms = parsePoly(e), g = gcfT(terms), hasG = g.c !== 1 || Object.keys(g.v).length > 0, q = terms.map((t) => divT(t, g));
  const v = Object.keys(q[0].v).find((k) => q[0].v[k] === 2);
  return { terms, g, hasG, q, v, b: q[1].c, c: q[2].c, gT: hasG ? bodyT(g) : '' };
}
function makeInspect(title, choices, o = {}) {
  const askG = o.gcf !== false, dy = askG ? 0 : -84;
  return {
    title, height: 520 + dy, choices, minW: 940,
    intro: (k) => askG ? `Factor ${T(IN[k])} completely: common factor first, then the pair, then check.` : `Factor ${T(IN[k])}: find the pair, write the brackets, then check.`,
    make(stage, key, ex) {
      const W = ex.W, A = analyse(IN[key]), { terms, hasG, q, v, b, c, gT } = A;
      const rows = searchRows(b, c), hit = rows.find((r) => r.ok);
      const inner = polyT(q), full = polyT(terms);
      const fac = (n) => `(${binT(v, n)})`;
      const [f1, f2] = ordered(hit.m, hit.n, c);
      const ansT = gT + fac(f1) + fac(f2);
      const one = { c: 1, v: { [v]: 1 } }, k1 = { c: f1, v: {} }, k2 = { c: f2, v: {} };
      const prods = [mulT(one, one), mulT(one, k2), mulT(k1, one), mulT(k1, k2)];
      add(stage, h('div', 'u4l4-iq', askG ? 'Factor completely' : 'Factor'), 24, 12);
      const qa = add(stage, h('div', 'u4l4-ie', K(`${full}\\htmlClass{u4l4-ia}{{}=${ansT}}`)), 24, 36);
      const qaS = spans(qa, 'u4l4-ia'); hide(...qaS);
      const gEls = [];
      let gLine = null, gNote = null;
      if (askG && hasG) {
        terms.forEach((t, i) => { const e = add(stage, h('div', 'u4l4-gc', `<div>${K(termT(t, true))}</div><div class="dv">${K(`\\div ${gT}`)}</div><div class="qt">${K(termT(q[i], true))}</div>`), 24 + i * 150, 96); hide(e); gEls.push(e); });
        gLine = add(stage, h('div', 'u4l4-gl', K(`=${gT}(${inner})`)), 490, 118); hide(gLine);
      } else if (askG) {
        gNote = add(stage, h('div', 'u4l4-gn', `Common factor? ${terms.map((t) => T(termT(t, true))).join(', ')} share no factor except 1, so there is <b>nothing to take out</b>.`), 24, 110); hide(gNote);
      }
      const tgt = add(stage, h('div', 'u4l4-need', `Need: product ${K(String(c))} &nbsp; sum ${K(String(b))}`), 24, 192 + dy); hide(tgt);
      const sg = signsMini(stage, 24, 252 + dy);
      const sp = searchPanel(stage, 352, 192 + dy, W - 352 - 18, b, c, { title: `Pairs that multiply to ${fmt(Math.abs(c))} → signed → add`, row: rowPlain, cls: rows.length > 4 ? 'xs' : 'sm' });
      const ck1 = add(stage, h('div', 'u4l4-ck', `<b>Check:</b> ${K(`${fac(f1)}${fac(f2)}=${polyT(prods)}=${polyT(collect(prods))}`)}${hasG ? '' : ' <span class="ok">✓</span>'}`), 24, 440 + dy);
      const ck2 = hasG ? add(stage, h('div', 'u4l4-ck', `${K(`${gT}(${polyT(collect(prods))})=${full}`)} <span class="ok">✓</span>`), 106, 478 + dy) : null;
      hide(ck1, ck2);
      const tri = triT(b, c, v);
      const steps = [];
      if (askG) steps.push({
        cap: hasG ? `<b>Common factor first.</b> Every term can be divided by ${T(gT)}: divide each one and write ${T(gT)} out front. ${T(`${full}=${gT}(${inner})`)}.`
          : `<b>Common factor first?</b> ${terms.map((t) => T(termT(t, true))).join(', ')} have no common factor except 1, so go straight to the pair.`,
        run: (c2) => hasG ? Promise.all([...gEls.map((e, i) => c2.fadeIn(e, 320, { delay: i * 160 })), c2.fadeIn(gLine, 380, { delay: 600 })]) : c2.fadeIn(gNote, 350)
      });
      steps.push({
        cap: `${hasG ? `Inside the bracket: ${T(tri)}. ` : ''}We need <b>product</b> ${T(String(c))} and <b>sum</b> ${T(String(b))}. ` + signsCap(b, c),
        run: (c2) => Promise.all([c2.fadeIn(tgt, 300), sg.light(c2, b, c)])
      }, {
        cap: `List the pairs that multiply to ${fmt(Math.abs(c))}. Give the bigger one the sign of ${T('b')}, the smaller one the other sign, and add: ${T(sumT(hit))} ✓.`,
        run: (c2) => sp.run(c2)
      }, {
        cap: `${T(`${hit.n}`)} and ${T(`${hit.m}`)} go into the brackets: ${T(`${tri}=${fac(f1)}${fac(f2)}`)}.${hasG ? ` Keep the common factor in front: ${T(`${full}=${ansT}`)}.` : ''}`,
        run: (c2) => showSpans(c2, qaS, 420)
      }, {
        cap: `<b>Check by expanding.</b> ${T(`${fac(f1)}${fac(f2)}=${polyT(collect(prods))}`)}${hasG ? `, and ${T(`${gT}(${polyT(collect(prods))})=${full}`)}` : ''} ✓`,
        run: (c2) => Promise.all([c2.fadeIn(ck1, 380), ck2 ? c2.fadeIn(ck2, 380, { delay: 250 }) : null])
      });
      return steps;
    }
  };
}
const inspectN = makeInspect('Factoring with c negative', [{ v: 'p3', label: tex(IN.p3) }, { sep: 'Example 2 check:' }, ...['a2', 'b2', 'c2', 'd2'].map((k) => ({ v: k, label: '(' + k[0] + ')' }))], { gcf: false });
const gcfFirst = makeInspect('Common factor first, then the pair', [{ v: 'g', label: tex(IN.g) }, { sep: 'Example 5 check:' }, ...['a5', 'b5', 'c5'].map((k) => ({ v: k, label: '(' + k[0] + ')' }))]);

/* ============ 1. Check by expanding: is the minus on the right number? ============ */
const EC = {
  ok: { o: 'x^2-3x-18', f: [-6, 3], why: `Every term matches, and both sides give the same number at ${T('x=2')}. This factoring is <b>correct</b>.` },
  e1: { o: 'x^2+3x-18', f: [-6, 3], fix: '(x+6)(x-3)', why: `<b>Minus on the wrong number:</b> ${T('(-6)(3)=-18')} ✓, but ${T('-6+3=-3')}, not ${T('+3')}. The bigger number takes the sign of ${T('b')}. Fix: ${T('(x+6)(x-3)')}.` },
  e2: { o: 'x^2+5x-24', f: [-8, 3], fix: '(x+8)(x-3)', why: `<b>Minus on the wrong number:</b> ${T('(-8)(3)=-24')} ✓, but ${T('-8+3=-5')}, not ${T('+5')}. Fix: ${T('(x+8)(x-3)')}.` },
  e3: { o: 'x^2+x-42', f: [-7, 6], fix: '(x+7)(x-6)', why: `<b>Minus on the wrong number:</b> ${T('-7+6=-1')}, not ${T('+1')}. Swap the signs: ${T('7+(-6)=1')}. Fix: ${T('(x+7)(x-6)')}.` }
};
const errorCheck = {
  title: 'Check by expanding: catch the error',
  height: 456,
  minW: 940,
  choices: [{ v: 'ok', label: tex('(x-6)(x+3)') }, { sep: 'Find the error:' }, { v: 'e1', label: tex('x^2+3x-18') }, { v: 'e2', label: tex('x^2+5x-24') }, { v: 'e3', label: tex('x^2+x-42') }],
  intro: (k) => { const d = EC[k]; return `Someone wrote ${T(`${d.o}=${'(' + binT('x', d.f[0]) + ')(' + binT('x', d.f[1]) + ')'}`)}. Is it right? Don’t trust it: <b>expand it and compare</b>.`; },
  make(stage, key) {
    const d = EC[key], O = parsePoly(d.o), [m, n] = d.f, claim = `(${binT('x', m)})(${binT('x', n)})`;
    const one = { c: 1, v: { x: 1 } }, km = { c: m, v: {} }, kn = { c: n, v: {} };
    const prods = [mulT(one, one), mulT(one, kn), mulT(km, one), mulT(km, kn)], col = collect(prods);
    add(stage, h('div', 'u4l4-iq', 'Claim'), 24, 12);
    add(stage, h('div', 'u4l4-ie', K(`${d.o}\\overset{?}{=}${claim}`)), 24, 34);
    const l1 = add(stage, h('div', 'u4l4-el', K(`${claim}=` + prods.map((t, i) => `\\htmlClass{u4l4-c${i}}{${tc(FOILC[i], termT(t, i === 0))}}`).join(''))), 24, 100);
    const cs = [0, 1, 2, 3].map((i) => spans(l1, 'u4l4-c' + i)); hide(...cs.flat());
    const l2 = add(stage, h('div', 'u4l4-el', K(`\\phantom{${claim}}=${polyT(col)}`)), 24, 150); hide(l2);
    const cmp = add(stage, h('div', 'u4l4-cmp'), 24, 212); hide(cmp);
    const byDeg = (list, dd) => list.find((t) => degT(t) === dd);
    const marks = [];
    cmp.innerHTML = `<div class="u4l4-cmh">original</div>${[2, 1, 0].map((dd) => `<div class="u4l4-cmt">${K(byDeg(O, dd) ? termT(byDeg(O, dd), dd === 2) : '0')}</div>`).join('')}
      <div class="u4l4-cmh">expanded</div>${[2, 1, 0].map((dd) => `<div class="u4l4-cmt">${K(byDeg(col, dd) ? termT(byDeg(col, dd), dd === 2) : '0')}</div>`).join('')}
      <div></div>${[2, 1, 0].map((dd) => { const a = byDeg(O, dd), b2 = byDeg(col, dd), ok = (a ? a.c : 0) === (b2 ? b2.c : 0); return `<div class="u4l4-cmm ${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'}</div>`; }).join('')}`;
    cmp.querySelectorAll('.u4l4-cmm').forEach((e) => { hide(e); marks.push(e); });
    const same = marks.every((e) => e.classList.contains('ok'));
    const stamp = add(stage, h('div', 'u4l4-vst ' + (same ? 'ok' : 'no'), same ? 'equal ✓' : 'not equal ✗'), 600, 236); hide(stamp);
    const v1 = evalT(O, 2), v2 = (2 + m) * (2 + n);
    const sub = add(stage, h('div', 'u4l4-sub', `<b>At ${T('x=2')}:</b> ${K(`${d.o.replace(/x/g, '(2)')}=${v1}`)} &nbsp;&nbsp; ${K(`(2${sgn(m)})(2${sgn(n)})=${v2}`)} <span class="${v1 === v2 ? 'ok' : 'red'}">${v1 === v2 ? '✓ same' : '✗ different'}</span>`), 24, 342); hide(sub);
    const why = add(stage, h('div', 'u4l4-why ' + (same ? 'ok' : ''), d.fix ? `Fix: ${K(`${d.o}=${d.fix}`)}` : `${K(`${d.o}=${claim}`)} ✓`), 24, 392); hide(why);
    return [{
      cap: `Expand the right side with FOIL: ${T('x\\cdot x')}, ${T(`x\\cdot${par(n)}`)}, ${T(`${par(m)}\\cdot x`)}, ${T(`${par(m)}\\cdot${par(n)}`)}.`,
      run: (c) => Promise.all(cs.map((s, i) => showSpans(c, s, 300, i * 260)))
    }, {
      cap: `Collect the like terms: ${T(`${claim}=${polyT(col)}`)}.`,
      run: (c) => c.fadeIn(l2, 380)
    }, {
      cap: same ? `Compare term by term with ${T(d.o)}: every term matches. The two sides are <b>equal</b>.` : `Compare term by term with ${T(d.o)}. The middle terms don’t match, so the factoring is <b>wrong</b>.`,
      run: async (c) => { await c.fadeIn(cmp, 300); for (const e of marks) await c.pop(e, 300); await stampIn(c, stamp); }
    }, {
      cap: `A quick second check: put ${T('x=2')} into both sides. ${v1 === v2 ? `Both give ${v1}.` : `${v1} and ${v2} are different numbers, so the two sides can’t be equal.`}`,
      run: (c) => c.fadeIn(sub, 380)
    }, {
      cap: d.why,
      run: (c) => c.fadeIn(why, 380)
    }];
  }
};

/* ============ 2 & 3. The factor-pair table: both sums for every pair (and prime trinomials) ============ */
const LD = { m2: [-2, -24], p5: [5, -24], a3: [5, -36], b3: [-5, -36], p1: [1, -24], p20: [3, -20], a4: [4, -15], b4: [4, -12] };
function makeLadder(title, choices) {
  return {
    title, height: 486, choices, minW: 940,
    intro: (k) => { const [b, c] = LD[k]; return `Factor ${T(triT(b, c))}, or show that it is prime. List <b>every</b> factor pair of ${-c}, with the sum both ways.`; },
    make(stage, key, ex) {
      const W = ex.W, [b, c] = LD[key], A = -c, P = triT(b, c);
      const pairs = []; for (let s = 1; s * s <= A; s++) if (A % s === 0) pairs.push([s, A / s]);
      let hit = null;
      pairs.forEach(([s, l], i) => { if (l - s === b) hit = { i, col: 0, big: l, small: -s }; else if (s - l === b) hit = { i, col: 1, big: -l, small: s }; });
      add(stage, h('div', 'u4l4-iq', 'Factor, or show it is prime'), 24, 12);
      const qa = add(stage, h('div', 'u4l4-ie', K(`${P}\\htmlClass{u4l4-ia}{{}=${hit ? `(${binT('x', hit.big)})(${binT('x', hit.small)})` : '\\ ?'}}`)), 24, 34);
      const qaS = spans(qa, 'u4l4-ia'); hide(...qaS);
      const need = add(stage, h('div', 'u4l4-need wide', `Need: product ${K(String(c))} &nbsp; sum ${K(String(b))}`), W - 24 - 380, 30); hide(need);
      const cols = [180, 140, 250, 250], tx = 24, ty = 102, rh = 46, tw = cols.reduce((a, b2) => a + b2, 0);
      const cx = (j) => tx + cols.slice(0, j).reduce((a, b2) => a + b2, 0);
      const head = add(stage, box(h('div', 'u4l4-lth'), tw, 40), tx, ty);
      head.innerHTML = ['Factor pair', 'Product', `Sum (larger ${T('+')})`, `Sum (larger ${T('-')})`].map((t, j) => `<div style="width:${cols[j]}px"><div>${t}</div></div>`).join('');
      hide(head);
      const rows = pairs.map(([s, l], i) => {
        const y = ty + 40 + i * rh;
        const bg = add(stage, box(h('div', 'u4l4-ltr'), tw, rh), tx, y); hide(bg);
        const cell = (j, html) => { const e = add(stage, box(h('div', 'u4l4-ltc'), cols[j], rh), cx(j), y); e.innerHTML = html; hide(e); return e; };
        return { bg, pair: cell(0, K(`${s},\\ ${l}`)), prod: cell(1, K(String(c))), s1: cell(2, K(`${l}-${s}=${l - s}`)), s2: cell(3, K(`${s}-${l}=${s - l}`)) };
      });
      const after = ty + 40 + pairs.length * rh + 18;
      const res = hit ? add(stage, h('div', 'u4l4-ie u4l4-fac', K(`${P}=(${binT('x', hit.big)})(${binT('x', hit.small)})`)), 24, after) : null;
      const ck = hit ? add(stage, h('div', 'u4l4-ck', `<b>Check:</b> ${K(`(${binT('x', hit.big)})(${binT('x', hit.small)})=x^2${sgn(hit.small)}x${sgn(hit.big)}x${sgn(c)}=${P}`)} <span class="ok">✓</span>`), 24, after + 50) : null;
      const stamp = hit ? null : add(stage, h('div', 'u4l4-stamp', 'prime<small>cannot be factored over the integers</small>'), W - 24 - 330, after + 16);
      hide(res, ck, stamp);
      const hitCell = hit ? rows[hit.i][hit.col ? 's2' : 's1'] : null;
      const sums = pairs.map(([s, l]) => l - s);
      const steps = [{
        cap: `We need <b>product</b> ${T(String(c))} and <b>sum</b> ${T(String(b))}. ${T('c')} is negative, so one number is positive and the other is negative.`,
        run: (c2) => Promise.all([c2.fadeIn(need, 300), c2.fadeIn(head, 300, { delay: 150 })])
      }, {
        cap: `List <b>every</b> factor pair of ${A} in order, starting from 1: ${pairs.map(([s, l]) => `${s} and ${l}`).join(', ')}. With opposite signs, each product is ${T(String(c))}.`,
        run: (c2) => Promise.all(rows.flatMap((r, i) => [c2.fadeIn(r.bg, 250, { delay: i * 140 }), c2.fadeIn(r.pair, 250, { delay: i * 140 }), c2.fadeIn(r.prod, 250, { delay: 60 + i * 140 })]))
      }, {
        cap: `Fill in both sums for every row: the larger number positive, then the larger number negative. The sums are ${sums.map((x) => `${mns(x)} and ${mns(-x)}`).join('; ')}.`,
        run: (c2) => Promise.all(rows.flatMap((r, i) => [c2.fadeIn(r.s1, 260, { delay: i * 160 }), c2.fadeIn(r.s2, 260, { delay: 80 + i * 160 })]))
      }];
      if (hit) {
        steps.push({
          cap: `Look for ${T(String(b))}: it is in the ${T(`${pairs[hit.i][0]},\\ ${pairs[hit.i][1]}`)} row, with the larger number <b>${hit.col ? 'negative' : 'positive'}</b>. The numbers are ${T(String(hit.big))} and ${T(String(hit.small))}.`,
          run: async (c2) => {
            rows.forEach((r, i) => { if (i !== hit.i) r.bg.classList.add('dim'); });
            [...rows.flatMap((r) => [r.s1, r.s2])].forEach((e) => { if (e !== hitCell) e.classList.add('dim'); });
            hitCell.classList.add('hit'); await pulse(c2, hitCell, 1.12);
          }
        }, {
          cap: `So ${T(`${P}=(${binT('x', hit.big)})(${binT('x', hit.small)})`)}. <b>Check by expanding:</b> the middle terms ${T(`${hit.small}x+${par(hit.big)}x=${b}x`)} ✓`,
          run: (c2) => Promise.all([showSpans(c2, qaS, 300), c2.fadeIn(res, 380), c2.fadeIn(ck, 380, { delay: 200 })])
        });
      } else {
        steps.push({
          cap: `Look for ${T(String(b))} in the sum columns. It is <b>not there</b>: the only possible sums are ${[...new Set(sums.flatMap((x) => [x, -x]))].sort((a, b2) => b2 - a).join(', ').replace(/-/g, '−')}. Every pair has been checked.`,
          run: async (c2) => { rows.forEach((r) => [r.s1, r.s2].forEach((e) => e.classList.add('miss'))); await Promise.all(rows.map((r) => c2.shake(r.bg))); }
        }, {
          cap: `So ${T(P)} is <b>prime</b>: it cannot be factored over the integers. That is a complete answer, not a mistake.`,
          run: async (c2) => { await showSpans(c2, qaS, 300); await stampIn(c2, stamp); }
        });
      }
      return steps;
    }
  };
}
const ladder = makeLadder('The factor-pair table', [{ v: 'm2', label: tex('x^2-2x-24') }, { v: 'p5', label: tex('x^2+5x-24') }, { sep: 'Example 3 check:' }, { v: 'a3', label: '(a)' }, { v: 'b3', label: '(b)' }]);
const ladderP = makeLadder('Every pair checked: factor it, or call it prime', [{ v: 'p1', label: tex('x^2+x-24') }, { v: 'p20', label: tex('x^2+3x-20') }, { sep: 'Example 4 check:' }, { v: 'a4', label: '(a)' }, { v: 'b4', label: '(b)' }]);

/* ============ warm-up: secret number pairs ============ */
function mountWarm() {
  const host = document.getElementById('wu');
  if (!host) return;
  const rowP = host.querySelector('.u4l4-brow.pos'), rowN = host.querySelector('.u4l4-brow.neg'), out = host.querySelector('#readout');
  const picked = [];
  const cards = [];
  for (let i = 1; i <= 12; i++) [[rowP, i], [rowN, -i]].forEach(([row, v]) => {
    const b = h('button', 'u4l4-card ' + (v > 0 ? 'p' : 'n'), mns(v)); b.type = 'button'; b.dataset.v = v; row.appendChild(b); cards.push(b);
    b.addEventListener('click', () => {
      const k = picked.indexOf(b);
      if (k >= 0) picked.splice(k, 1); else { picked.push(b); if (picked.length > 2) picked.shift(); }
      cards.forEach((e) => e.classList.toggle('on', picked.includes(e)));
      if (picked.length < 2) { out.innerHTML = picked.length ? `<b>${mns(picked[0].dataset.v)}</b> and …` : '<span class="muted">Pick two cards…</span>'; return; }
      const [a, c] = picked.map((e) => Number(e.dataset.v));
      out.innerHTML = `${K(`${par(a)}\\times${par(c)}=${a * c}`)} &nbsp;&nbsp;·&nbsp;&nbsp; ${K(`${a}+${par(c)}=${a + c}`)}`;
    });
  });
  const fds = [...host.querySelectorAll('.u4l4-fd')], rungs = [...host.querySelectorAll('.u4l4-rung')];
  fds.forEach((b) => b.addEventListener('click', () => b.classList.toggle('open')));
  rungs.forEach((b) => b.addEventListener('click', () => b.classList.add('open')));
  const watch = (el, cls, fn) => { if (!el) return; new MutationObserver(() => fn(el.classList.contains(cls))).observe(el, { attributes: true, attributeFilter: ['class'] }); };
  watch(host.querySelector('#wq3'), 'shown', (on) => { if (on) { fds.forEach((b) => b.classList.add('open')); rungs.forEach((b) => b.classList.add('open', 'show')); } });
  watch(host.querySelector('#wpoll'), 'revealed', (on) => { if (on) rungs.forEach((b) => b.classList.add('open')); });
}

/* ============ wiring ============ */
function mountExplainers() {
  const defs = { signs4, zeroPairs, inspectN, errorCheck, ladder, ladderP, gcfFirst };
  document.querySelectorAll('[data-explainer]').forEach((el) => new Explainer(el, defs[el.dataset.explainer]));
}

/* ============ Stand Up Break! — factor x² + bx + c with c < 0 at the whiteboards ============ */
function trin(a, b, c, v) { // a·v² + b·v + c as LaTeX
  const t = (k, s, first) => (k === 0 ? '' : (k < 0 ? '-' : first ? '' : '+') + (Math.abs(k) === 1 && s ? '' : Math.abs(k)) + s);
  return (t(a, v + '^2', true) + t(b, v) + t(c, '')) || '0';
}
const lin = (v, p) => '(' + v + (p < 0 ? '-' : '+') + Math.abs(p) + ')';
const sumProd = (b, c, p, q) => '\\text{product } {' + c + '},\\ \\text{sum } {' + b + '}:\\quad {' + p + '} \\text{ and } {' + q + '}';
function oppPair(r, lo, hi) { // [bigger with its sign, smaller with the other sign]; never equal sizes (b ≠ 0)
  for (;;) {
    const s = r.int(lo, hi), l = r.int(lo, hi);
    if (s === l) continue;
    const big = Math.max(s, l) * r.sign(), small = -Math.sign(big) * Math.min(s, l);
    return [big, small];
  }
}
function plainN(r, v, lo, hi) { // v² + bv + c = (v + big)(v + small), c < 0
  const [p, q] = oppPair(r, lo, hi), b = p + q, c = p * q, Q = trin(1, b, c, v);
  return { q: Q, a: [sumProd(b, c, p, q), Q + '=' + lin(v, p) + lin(v, q)] };
}
function primeQ(r, v) { // x² + bx + c with c < 0 and no pair adding to b
  for (;;) {
    const c = -r.pick([6, 10, 14, 15, 20, 21, 22, 24, 26, 28, 30, 33, 35, 40]), A = -c, prs = [];
    for (let s = 1; s * s <= A; s++) if (A % s === 0) prs.push([s, A / s]);
    const ok = new Set(prs.flatMap(([s, l]) => [l - s, s - l]));
    const b = r.int(1, 9) * r.sign();
    if (ok.has(b)) continue;
    const Q = trin(1, b, c, v);
    return { q: Q, a: ['\\text{pairs of } ' + A + ':\\ ' + prs.map(([s, l]) => s + ',' + l + '\\ (\\pm' + (l - s) + ')').join(';\\ '), '\\text{no pair adds to } ' + b + ':\\ \\text{prime}'] };
  }
}
standup('u4l4', {
  intro: 'Factor the trinomial at your whiteboard station. Check by expanding before you call it done.',
  levels: {
    BEG: (r) => plainN(r, 'x', 1, 9),                                       // c negative, small numbers
    PRG: (r) => plainN(r, r.pick(['x', 'x', 'x', 'n', 'm', 'a']), 1, 12),    // c negative, bigger numbers
    MAS: (r) => {
      const v = r.pick(['x', 'x', 'y', 'k']), text = 'Factor completely, or write <b>prime</b>.';
      const roll = r.int(0, 99) / 100;
      if (roll < 0.25) return Object.assign(primeQ(r, v), { text });
      if (roll < 0.4) return Object.assign(plainN(r, v, 4, 15), { text });   // bigger numbers: more pairs to search
      const k = r.pick([2, 3, 4, 5]), withV = r.chance(0.3), [p, q] = oppPair(r, 1, 8), b = p + q, c = p * q;
      const term = (co, pw, first) => (co === 0 ? '' : (co < 0 ? '-' : first ? '' : '+') + (Math.abs(co) === 1 && pw ? '' : Math.abs(co)) + pw);
      const Q = withV ? term(k, v + '^3', true) + term(k * b, v + '^2') + term(k * c, v) : trin(k, k * b, k * c, v);
      const g = k + (withV ? v : '');
      return { text, q: Q, a: ['\\text{GCF } ' + g + ':\\quad ' + g + '(' + trin(1, b, c, v) + ')', sumProd(b, c, p, q), Q + '=' + g + lin(v, p) + lin(v, q)] };
    }
  }
});

mountWarm(); mountExplainers();
