/* Math 15 · Unit 2 · Lesson 5 — Zero Exponents (AN3)
 * Assignment 5 (u2_L05.tex, Questions 1–13) and the whole Lesson 5 Extra Practice (u2_EP05.tex, Questions 1–22).
 * Every part is a generator: same structure, idea and difficulty as the booklet (the booklet's numbers are among the
 * possible values), new numbers from the seed. Simplifications use the same expression-tree engine as Lessons 4 and 6
 * (key, worked solution and typical wrong answers all come from the tree); numerical answers use number boxes.
 * The traps this lesson is about get their own diagnoses: a zero exponent read as 0, x⁰ read as x, the 0 applied to
 * the coefficient too (5x⁰ read as (5x)⁰) or to the letter only ((5x)⁰ read as 5), −4⁰ read as (−4)⁰.
 * Conversions (no free-text explaining): "explain / why / justify" → multiple choice whose options are reasons;
 * "state the value of each" → number boxes; "which three equal 1, and the value of the other two" → a table;
 * "show that 8⁵ ÷ 8⁵ = 1" → fill-in steps; "which values must be excluded" → a number or a list of numbers.
 * Math 15 levels: LIM BEG EMG PRG ADV MAS. Mastery: Extra 22(b) (values that make a base zero). Outcome AN3 throughout. */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, ex = HW.ex, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'add-coef': 'Added the coefficients instead of multiplying', 'mult-exp': 'Multiplied exponents instead of adding (product law)',
    'div-exp': 'Divided exponents instead of subtracting (quotient law)', 'add-exp': 'Added exponents when dividing', 'sub-coef': 'Subtracted the coefficients instead of dividing',
    'coef-flip': 'Coefficient fraction upside down', 'hidden-one': 'Forgot a hidden exponent of 1', 'zero-as-zero': 'Treated a zero exponent (x⁰) as 0',
    'not-raised': 'Didn’t raise the coefficient to the power', 'coef-times-n': 'Multiplied the coefficient by the exponent',
    'add-power': 'Added the outside exponent instead of multiplying', 'top-only': 'Applied the outside exponent to only part of the bracket',
    'leftover-var': 'Kept a variable that cancels (x ÷ x = 1)', opposite: 'Treated a negative exponent as a negative sign (opposite instead of reciprocal)',
    'coef-side': 'Number on the wrong side of the fraction bar (moved one with no negative exponent, or left one that has one)',
    'zero-power': 'Took a zero exponent to give 0', 'zero-base': 'Took a⁰ to be a', 'zero-coef': 'Applied a zero exponent to the variable only, not the whole bracket',
    'neg-zero': 'Read −w⁰ as (−w)⁰', 'split-sum': 'Split a power over a sum',
    'u2l5-coef-zero': 'Applied a zero exponent to the coefficient too (5x⁰ read as (5x)⁰)', 'u2l5-neg-in': 'Read (−a)⁰ as −(a⁰)',
    'u2l5-no-divide': 'Working backwards: didn’t divide by the multiplier of n', 'u2l5-one-root': 'Gave only one of the two excluded values',
    'u2l5-not-excluded': 'Excluded a value that is allowed', 'u2l5-times': 'Gave the new amount instead of how many times larger'
  });
  HW.addPartial({ 'u2l5-coef-zero': 'b', 'u2l5-neg-in': 's', 'u2l5-no-divide': 'b', 'u2l5-one-root': 's', 'u2l5-not-excluded': 'n', 'u2l5-times': 's' });

  /* ======================= shared exponent engine (same in u2l4–u2l6) ======================= */
  function R(p, q) { return ex.norm(p, q == null ? 1 : q); }
  function rmul(a, b) { return R(a[0] * b[0], a[1] * b[1]); }
  function rinv(a) { return R(a[1], a[0]); }
  function rpow(a, n) { if (n < 0) { a = rinv(a); n = -n; } return R(Math.pow(a[0], n), Math.pow(a[1], n)); }
  function near(x, y) { return ex.eq(x, y, 1e-9); }
  function frTex(a) { return a[1] === 1 ? F(a[0]) : (a[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(a[0])) + '}{' + F(a[1]) + '}'; }
  function pickWhere(gen, test) { for (var i = 0; i < 800; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u2l5: no value found'); }
  function uniq(v, i, arr) { return arr.indexOf(v) === i; }
  /* monomials { c: [p, q], v: { x: e, … } } (insertion order = display order) */
  function M(c, v) { c = typeof c === 'number' ? [c, 1] : c; var o = {}; if (Array.isArray(v)) v.forEach(function (pe) { o[pe[0]] = (o[pe[0]] || 0) + pe[1]; }); else Object.keys(v || {}).forEach(function (k) { o[k] = v[k]; }); return { c: R(c[0], c[1]), v: o }; }
  function vt(x, e) { return e === 1 ? x : x + '^{' + e + '}'; }
  function cT(c) { return c[1] === 1 ? F(c[0]) : (c[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(c[0])) + '}{' + F(c[1]) + '}'; }
  function cP(c) { var s = cT(c); return c[0] < 0 || c[1] !== 1 ? '\\left(' + s + '\\right)' : s; }
  /* answer form: positive exponents, zero exponents dropped */
  function posTex(m) {
    var c = m.c, up = '', dn = '';
    if (c[0] === 0) return '0';
    Object.keys(m.v).forEach(function (x) { var e = m.v[x]; if (e > 0) up += vt(x, e); else if (e < 0) dn += vt(x, -e); });
    var top = (Math.abs(c[0]) === 1 && up ? '' : F(Math.abs(c[0]))) + up, bot = (c[1] === 1 ? '' : F(c[1])) + dn;
    return (c[0] < 0 ? '-' : '') + (bot ? '\\frac{' + top + '}{' + bot + '}' : top);
  }
  /* one line with negative exponents still showing (worked solutions) */
  function rawNeg(m) { var vs = Object.keys(m.v).filter(function (x) { return m.v[x] !== 0; }).map(function (x) { return vt(x, m.v[x]); }).join(''), c = m.c; if (vs && c[1] === 1 && Math.abs(c[0]) === 1) return (c[0] < 0 ? '-' : '') + vs; return cT(c) + vs; }
  function rawT(m, neg) { return neg ? rawNeg(m) : posTex(m); }
  /* a term as printed in a question (keeps x^0, writes 1x as x) */
  function qTex(m) { var vs = Object.keys(m.v).map(function (x) { return vt(x, m.v[x]); }).join(''), c = m.c; if (vs && c[1] === 1 && Math.abs(c[0]) === 1) return (c[0] < 0 ? '-' : '') + vs; return cT(c) + vs; }
  /* expression trees: monomial, bracket^n, product, quotient */
  function Mn(c, v) { return { t: 'm', m: M(c, v) }; }
  function Pw(a, n) { return { t: 'p', a: a, n: n }; }
  function Mul(xs, sep) { return { t: '*', xs: xs, sep: sep == null ? '\\times ' : sep }; }
  function Dv(a, b, s) { return { t: '/', a: a, b: b, s: s || 'frac' }; }
  function tex(n) {
    if (n.t === 'm') return qTex(n.m);
    if (n.t === 'p') {
      if (n.a.t === 'm' && !Object.keys(n.a.m.v).length && n.a.m.c[1] === 1 && n.a.m.c[0] > 0) return F(n.a.m.c[0]) + '^{' + n.n + '}';
      return (n.a.t === '/' && n.a.s === 'frac' ? '\\left(' + tex(n.a) + '\\right)' : '(' + tex(n.a) + ')') + '^{' + n.n + '}';
    }
    if (n.t === '*') return n.xs.map(function (x, i) { return (n.sep === '' && x.t === 'm' && i > 0 && !(x.m.c[0] === 1 && x.m.c[1] === 1)) || (x.t === '/' && x.s === 'div') ? '(' + tex(x) + ')' : tex(x); }).join(n.sep);
    if (n.s === 'pdiv') return '(' + tex(n.a) + ')\\div(' + tex(n.b) + ')';
    return n.s === 'div' ? tex(n.a) + '\\div ' + tex(n.b) : '\\dfrac{' + tex(n.a) + '}{' + tex(n.b) + '}';
  }
  function lettersOf(n, acc) { acc = acc || []; if (n.t === 'm') Object.keys(n.m.v).forEach(function (x) { if (acc.indexOf(x) < 0) acc.push(x); }); else if (n.t === 'p') lettersOf(n.a, acc); else if (n.t === '*') n.xs.forEach(function (x) { lettersOf(x, acc); }); else { lettersOf(n.a, acc); lettersOf(n.b, acc); } return acc; }
  /* evaluate; md switches on one misconception (for the typical wrong answers) */
  function powM(m, n, md) {
    md = md || {};
    var c = md.notRaised ? m.c : md.coefTimes && m.c[1] === 1 ? R(m.c[0] * n) : rpow(m.c, n), v = {};
    Object.keys(m.v).forEach(function (x) { v[x] = md.addPower && m.v[x] !== 0 ? m.v[x] + n : m.v[x] * n; });
    return { c: c, v: v };
  }
  function prod(ms, md) {
    md = md || {};
    var c = R(1), v = {};
    var big = ms.filter(function (m) { return !(m.c[0] === 1 && m.c[1] === 1); });
    if (md.addCoef && big.length > 1 && big.every(function (m) { return m.c[1] === 1; })) { var s = 0; big.forEach(function (m) { s += m.c[0]; }); c = R(s); }
    else ms.forEach(function (m) { c = rmul(c, m.c); });
    ms.forEach(function (m) { Object.keys(m.v).forEach(function (x) { if (v[x] == null) v[x] = m.v[x]; else v[x] = md.multExp ? v[x] * m.v[x] : v[x] + m.v[x]; }); });
    return { c: c, v: v };
  }
  function quo(a, b, md) {
    md = md || {};
    if (b.c[0] === 0) return null;
    var c = md.subCoef && a.c[1] === 1 && b.c[1] === 1 && !(b.c[0] === 1) ? R(a.c[0] - b.c[0]) : rmul(a.c, rinv(b.c));
    if (md.coefFlip) { if (c[0] === 0) return null; c = rinv(c); }
    var v = {}; Object.keys(a.v).forEach(function (x) { v[x] = a.v[x]; });
    Object.keys(b.v).forEach(function (x) { var e = b.v[x]; if (v[x] == null) v[x] = md.addExp ? e : -e; else v[x] = md.addExp ? v[x] + e : md.divExp && e > 1 && v[x] > e && v[x] % e === 0 ? v[x] / e : v[x] - e; });
    return { c: c, v: v };
  }
  function ev(n, md) {
    md = md || {};
    if (n.t === 'm') {
      if (!md.hidden && !md.zz) return n.m;
      var c = n.m.c, v = {}; Object.keys(n.m.v).forEach(function (x) { var e = n.m.v[x]; if (md.zz && e === 0) c = R(0); v[x] = md.hidden && e === 1 ? 0 : e; });
      return { c: c, v: v };
    }
    if (n.t === 'p') {
      if (n.n === 0 && md.zz) return M(0, {});
      if (md.topOnly && n.a.t === '/') { var tp = ev(n.a.a, md), bt = ev(n.a.b, md); return tp && bt ? quo(powM(tp, n.n, md), bt, md) : null; }
      var inner = ev(n.a, md); return inner ? powM(inner, n.n, md) : null;
    }
    if (n.t === '*') { var ms = n.xs.map(function (x) { return ev(x, md); }); return ms.every(Boolean) ? prod(ms, md) : null; }
    var A = ev(n.a, md), B = ev(n.b, md); return A && B ? quo(A, B, md) : null;
  }
  /* worked solution, one line per step */
  function vt0(x, e) { return e === 0 ? x + '^{0}=1' : vt(x, e); }
  function solve(n, L, o) {
    if (n.t === 'm') {
      var m = n.m, z = Object.keys(m.v).filter(function (x) { return m.v[x] === 0; });
      if (!z.length) return m;
      var v = {}; Object.keys(m.v).forEach(function (x) { if (m.v[x] !== 0) v[x] = m.v[x]; }); var m2 = { c: m.c, v: v };
      L.push('Zero exponent: ' + t(z.map(function (x) { return x + '^{0}'; }).join('=') + '=1') + ', so ' + t(qTex(m) + '=' + rawT(m2, true)) + '.');
      return m2;
    }
    if (n.t === 'p') {
      if (n.n === 0) { L.push('Zero exponent: ' + t(tex(n) + '=1') + ' (anything except ' + t('0') + ' to the power ' + t('0') + ' is ' + t('1') + ').'); return M(1, {}); }
      var inner = solve(n.a, L, o), res = powM(inner, n.n);
      var plainIn = n.a.t === 'm' && !Object.keys(n.a.m.v).some(function (x) { return n.a.m.v[x] === 0; });
      var shownIn = plainIn ? tex(n) : '\\left(' + rawT(inner, o.neg) + '\\right)^{' + n.n + '}';
      var negIn = Object.keys(inner.v).some(function (x) { return inner.v[x] < 0; });
      if ((negIn && !o.neg) || inner.c[1] !== 1) { L.push('Power law (raise the top and the bottom): ' + t(shownIn + '=' + rawT(res, o.neg)) + '.'); return res; }
      var parts = []; if (!(inner.c[0] === 1 && inner.c[1] === 1)) parts.push(cP(inner.c) + '^{' + n.n + '}');
      Object.keys(inner.v).forEach(function (x) { parts.push(x + '^{' + (inner.v[x] < 0 ? '(' + inner.v[x] + ')' : inner.v[x]) + '\\times ' + (n.n < 0 ? '(' + n.n + ')' : n.n) + '}'); });
      L.push('Power law: ' + t(shownIn + '=' + parts.join('') + '=' + rawT(res, o.neg)) + '.');
      return res;
    }
    if (n.t === '*') {
      var ms = n.xs.map(function (x) { return solve(x, L, o); }), pr = prod(ms), bits = [];
      var cs = ms.filter(function (m) { return !(m.c[0] === 1 && m.c[1] === 1); }).map(function (m) { return cP(m.c); });
      if (cs.length > 1) bits.push(t(cs.join('\\times ') + '=' + cT(pr.c)));
      Object.keys(pr.v).forEach(function (x) {
        var es = ms.filter(function (m) { return m.v[x] != null && m.v[x] !== 0; }).map(function (m) { return m.v[x]; });
        if (es.length > 1 && (o.neg || es.every(function (e) { return e > 0; }))) bits.push(t(x + '^{' + es.join('+').replace(/\+-/g, '-') + '}=' + vt0(x, pr.v[x])));
      });
      L.push('Product law: ' + t(ms.map(function (m) { return rawT(m, o.neg); }).join('\\times ') + '=' + rawT(pr, o.neg)) + (bits.length ? ' (' + bits.join(', ') + ')' : '') + '.');
      return pr;
    }
    var A = solve(n.a, L, o), B = solve(n.b, L, o), qq = quo(A, B), qb = [];
    if (!(B.c[0] === 1 && B.c[1] === 1)) qb.push(t(cT(A.c) + '\\div ' + cP(B.c) + '=' + cT(qq.c)));
    Object.keys(B.v).forEach(function (x) {
      var b = B.v[x]; if (!b) return; var a = A.v[x] || 0, d = a - b;
      if (!o.neg && (a < 0 || b < 0)) return;
      qb.push(t(x + '^{' + a + '-' + (b < 0 ? '(' + b + ')' : b) + '}=' + (d === 0 ? x + '^{0}=1' : d < 0 && !o.neg ? '\\frac{1}{' + vt(x, -d) + '}' : vt(x, d))));
    });
    L.push('Quotient law: ' + t('\\frac{' + rawT(A, o.neg) + '}{' + rawT(B, o.neg) + '}=' + rawT(qq, o.neg)) + (qb.length ? ' (' + qb.join(', ') + ')' : '') + '.');
    return qq;
  }
  function solText(tree, o) {
    o = o || {}; var L = [], res = solve(tree, L, o);
    if (o.neg && Object.keys(res.v).some(function (x) { return res.v[x] < 0; })) L.push('Positive exponents: ' + t(rawNeg(res) + '=' + posTex(res)) + '.');
    L.push('So ' + t(tex(tree) + '=' + posTex(res)) + '.');
    return L.join('<br>');
  }
  /* typed-answer helpers */
  function varsOf(ast) { var acc = {}; (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var') acc[x.n] = 1; ['a', 'b', 'n'].forEach(function (k) { if (x[k]) w(x[k]); }); })(ast); return Object.keys(acc); }
  function same(ast, tx) {
    var p = ex.parse(tx); if (!p.ok) return false;
    var vs = varsOf(ast).concat(varsOf(p.ast)).filter(uniq);
    return vs.length ? ex.equiv(ast, p.ast, vs, 6) : ex.eq(ex.value(ast), ex.value(p.ast));
  }
  function sameTex(a, b) { var p = ex.parse(a); return p.ok && same(p.ast, b); }
  var OPP = 'A negative exponent doesn’t make anything negative — it means <b>reciprocal</b>: ' + t('a^{-n}=\\frac{1}{a^{n}}') + ', not ' + t('-a^{n}') + '.';
  function cmp(an, m) {
    var keys = Object.keys(m.v).filter(function (k) { return m.v[k] !== 0; }); Object.keys(an.vars).forEach(function (k) { if (keys.indexOf(k) < 0) keys.push(k); });
    var sm = true, mixed = true, negd = 0;
    keys.forEach(function (k) { var x = m.v[k] || 0, y = an.vars[k] ? an.vars[k][0] / an.vars[k][1] : 0; if (y !== x) { sm = false; if (y === -x) negd++; else mixed = false; } });
    var tc = m.c, sc = an.coef;
    return { same: sm, negOnly: !sm && mixed && negd > 0, coefNeg: !!sc && sc[0] * tc[1] === -tc[0] * sc[1], coefRecip: !!sc && sc[0] * tc[0] === sc[1] * tc[1] };
  }
  function gdiag(m) {
    return function (an) {
      if (!an.coef || !m) return null;
      var c = cmp(an, m);
      if (c.coefNeg && c.negOnly) return { code: 'opposite', hint: OPP };
      if (c.same && c.coefRecip && !(Math.abs(m.c[0]) === 1 && m.c[1] === 1)) return { code: 'coef-side', hint: 'Your letters are right, but the number is on the wrong side of the fraction bar.' };
      return null;
    };
  }
  /* the typical wrong answers: the tree evaluated with one misconception switched on */
  function firstBr(n) {
    if (n.t === 'p' && n.n > 1) { var inner = ev(n.a, {}); if (inner && !(Math.abs(inner.c[0]) === 1 && inner.c[1] === 1)) return cP(inner.c) + '^{' + n.n + '}=' + cT(rpow(inner.c, n.n)); }
    var kids = n.t === 'p' ? [n.a] : n.t === '*' ? n.xs : n.t === '/' ? [n.a, n.b] : [];
    for (var i = 0; i < kids.length; i++) { var s = firstBr(kids[i]); if (s) return s; }
    return null;
  }
  var MODES = [
    ['zz', 'zero-as-zero', function () { return 'Anything (except ' + t('0') + ') to the power ' + t('0') + ' is ' + t('1') + ', not ' + t('0') + '.'; }],
    ['notRaised', 'not-raised', function (T) { var b = firstBr(T); return 'The coefficient inside the bracket gets the outside power too' + (b ? ': ' + t(b) : '') + '.'; }],
    ['coefTimes', 'coef-times-n', function (T) { var b = firstBr(T); return 'A power means repeated multiplication' + (b ? ': ' + t(b) : '') + ' — don’t multiply the coefficient by the exponent.'; }],
    ['addPower', 'add-power', function () { return 'Power of a power: <b>multiply</b> the exponents, ' + t('(x^{a})^{n}=x^{a\\times n}') + '. Don’t add them.'; }],
    ['topOnly', 'top-only', function () { return 'The outside power goes to the <b>whole</b> bracket — simplify inside first, then raise every factor that is left.'; }],
    ['multExp', 'mult-exp', function () { return 'Product law: when powers of the same base are multiplied, <b>add</b> the exponents — don’t multiply them.'; }],
    ['addExp', 'add-exp', function () { return 'When you divide powers of the same base, <b>subtract</b> the exponents (top minus bottom). Adding is for multiplying.'; }],
    ['divExp', 'div-exp', function () { return 'Quotient law: <b>subtract</b> the exponents — don’t divide them.'; }],
    ['subCoef', 'sub-coef', function () { return 'Divide the coefficients — don’t subtract them.'; }],
    ['coefFlip', 'coef-flip', function () { return 'Your coefficient is upside down: it is the top number divided by the bottom number.'; }],
    ['hidden', 'hidden-one', function () { return 'A letter with no exponent, like ' + t('x') + ', means ' + t('x^{1}') + ' — it still counts in the exponent.'; }],
    ['addCoef', 'add-coef', function () { return 'Coefficients are <b>multiplied</b>, not added.'; }]
  ];
  function chainWrongs(tree, res) {
    var ws = [];
    MODES.forEach(function (md) { var f = {}; f[md[0]] = 1; var m = ev(tree, f); if (m && isFinite(m.c[0] / m.c[1])) ws.push({ tex: posTex(m), code: md[1], hint: md[2](tree) }); });
    var z = Object.keys(res.v).filter(function (x) { return res.v[x] === 0; });
    if (z.length) { var v = {}; Object.keys(res.v).forEach(function (x) { v[x] = res.v[x] === 0 ? 1 : res.v[x]; }); ws.push({ tex: posTex({ c: res.c, v: v }), code: 'leftover-var', hint: 'The exponents of ' + t(z[0]) + ' on the top and the bottom are equal, so ' + t(z[0]) + ' cancels completely: ' + t(z[0] + '^{0}=1') + '.' }); }
    var sg = { c: R(-res.c[0], res.c[1]), v: res.v }; if (res.c[0] !== 0) ws.push({ tex: posTex(sg), code: 'sign', hint: 'Check the sign.' });
    return ws;
  }
  function cleanWrongs(ws, target) { var seen = {}, out = []; ws.forEach(function (w) { if (!w || seen[w.tex] || sameTex(w.tex, target)) return; seen[w.tex] = 1; out.push(w); }); return out; }
  /* an exponent-law answer for a monomial m (positive exponents). wrongs: [{tex, code, hint}] matched first */
  function X(prompt, m, wrongs, sol, hints, text, o) {
    o = o || {};
    var target = o.target || posTex(m), list = cleanWrongs(wrongs || [], target), gd = gdiag(m);
    var p = P.expo(prompt, target, { vars: o.vars, diag: function (an, ast) { for (var i = 0; i < list.length; i++) if (same(ast, list[i].tex)) return { code: list[i].code, hint: list[i].hint }; return gd(an, ast); } }, sol, hints, text);
    p.bad = list.map(function (w) { return w.tex; }).concat(o.bad || []);
    if (o.good) p.good = o.good;
    return p;
  }
  /* simplify a whole tree */
  function chain(tree, o) {
    o = o || {};
    var res = ev(tree, {}), shown = tex(tree);
    var ws = (o.wrongs || []).concat(chainWrongs(tree, res));
    return X(o.prompt || t(shown), res, ws, (o.pre ? o.pre + '<br>' : '') + solText(tree, o), o.hints || [HO, o.hint || HW_], o.text || shown, { vars: lettersOf(tree), bad: o.bad, good: o.good });
  }
  /* exact numeric value (integer or fraction) */
  function exactChk(fr, diag, o) {
    o = o || {}; var T = fr[0] / fr[1];
    var base = K.fraction(fr, { diag: function (val, ast) { var h = diag ? diag(val, ast) : null; if (h) return h; if (T !== 0 && Math.abs(T) !== 1 && near(val, -1 / T)) return { code: 'opposite', hint: OPP }; return null; } });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (near(a.val, T)) {
        var an = ex.analyze(a.ast);
        if (an.flags.negExp) return form('neg-exp', 'Right value — now ' + (o.pow ? 'write it with a positive exponent.' : 'evaluate it: rewrite the negative exponent as a reciprocal and work out the power.'));
        if (ex.shape(a.ast).pow) { if (o.pow) return ok(); return form('evaluate', 'Right value — now work out the power(s) and give a single number' + (fr[1] !== 1 ? ' or fraction' : '') + '.'); }
        if (Object.keys(ex.shape(a.ast).vars || {}).length) return form('zero-exp', 'Right value — the letters cancel out completely, so leave them out.');
      }
      return base(resp);
    };
  }
  function exP(prompt, fr, diag, sol, hints, text, o) {
    o = o || {}; fr = R(fr[0], fr[1]);
    var p = P.math(prompt, exactChk(fr, diag, o), o.key || frTex(fr), sol, hints, text, { keys: o.pow ? 'expo' : 'fraction', vars: o.vars, before: o.before });
    if (o.bad) p.bad = o.bad.filter(function (b) { var pp = ex.parse(b); return pp.ok && !near(ex.value(pp.ast), fr[0] / fr[1]); });
    if (o.good) p.good = o.good;
    return p;
  }
  /* "true, or false and the correct simplification": one multiple choice */
  function tfFix(r, lhs, good, shownRhs, falses, sol, hints, text) {
    var truth = sameTex(shownRhs, good), opts = [{ html: '<b>True</b>', right: truth, why: truth ? null : 'Simplify the left side step by step and compare it with ' + t(shownRhs) + '.' }];
    if (!truth) opts.push({ html: '<b>False</b> — the left side simplifies to ' + t(good), right: true });
    falses.filter(function (f) { return !sameTex(f.tex, good) && !sameTex(f.tex, shownRhs); }).filter(function (f, i, arr) { return arr.map(function (g) { return g.tex; }).indexOf(f.tex) === i; }).slice(0, truth ? 3 : 2).forEach(function (f) { opts.push({ html: '<b>False</b> — the left side simplifies to ' + t(f.tex), why: f.hint }); });
    var tf = opts.shift(), rest = r.shuffle(opts); rest.unshift(tf);
    return P.mc(r, 'True or false? If false, choose the correct simplification.<br>' + t(lhs + '=' + shownRhs), rest, sol, hints, text, true);
  }
  /* "write as a single power, then evaluate": two boxes */
  function bTex(b) { return b < 0 ? '(' + b + ')' : String(b); }
  function powChk(b, n, o) {
    o = o || {}; var V = Math.pow(b, n);
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var node = a.ast; while (node.t === 'paren') node = node.a;
      var B = null, N = null;
      if (node.t === 'pow') { var bb = node.a; while (bb.t === 'paren') bb = bb.a; var er = ex.rat(node.b); if (bb.t === 'num' && er && er[1] === 1) { B = bb.v; N = er[0]; } }
      else if (node.t === 'num') { B = node.v; N = 1; }
      if (ex.eq(a.val, V)) {
        if (B == null) return form('single-power', 'Right value — now write it as a <b>single power</b> of ' + t(b) + ' (one base, one exponent).');
        if (B !== b) return form('base', 'That’s the right value, but this box wants a single power of ' + t(b) + '. The value goes in the next box.');
        return ok();
      }
      if (B === b) { var h = o.exp ? o.exp(N) : null; if (h) return wrong(h.code, h.hint); return wrong('exp', 'Right base — check the exponent. Product law: add. Quotient law: subtract. Power of a power: multiply.'); }
      return wrong('value', null);
    };
  }
  function evalPart(prompt, b, n, o) {
    var V = Math.pow(b, n), pt = b + '^{' + n + '}';
    var p = P.fields(prompt, [{ name: 'Single power', label: 'Single power', mode: 'math', keys: 'expr', wide: true }, { name: 'Value', label: 'Value' }],
      [powChk(b, n, o), K.number(V, function (v) { if (v === b * n) return { code: 'coef-times-n', hint: t(pt) + ' means ' + t(b) + ' multiplied by itself ' + n + ' times, not ' + t(b + '\\times ' + n) + '.' }; return null; })],
      [pt, String(V)], t(pt + '=' + F(V)), o.sol, o.hints, o.text);
    p.bad = [[pt, String(b * n === V ? V + 1 : b * n)], [b + '^{' + (n + 1) + '}', String(V)]];
    p.good = [['(' + b + ')^{' + n + '}', F(V, true)]];
    return p;
  }

  /* ---------- hints and letters ---------- */
  var HO = 'Spot every factor raised to the power ' + t('0') + ' and replace it with ' + t('1') + ' first. Then finish with the product, quotient and power laws.';
  var HW_ = 'Power law: ' + t('(2x^{3})^{2}=2^{2}x^{3\\times 2}=4x^{6}') + ' — the coefficient is raised too.';
  var HZ = 'Zero exponent law: ' + t('a^{0}=1') + ' for any ' + t('a\\neq 0') + ' — not ' + t('0') + ', and not ' + t('a') + '.';
  var HWH = 'Check <b>what the exponent is attached to</b>: in ' + t('5x^{0}') + ' the ' + t('0') + ' sits on ' + t('x') + ' only, so it is ' + t('5\\times 1=5') + '; in ' + t('(5x)^{0}') + ' the brackets make the whole ' + t('5x') + ' the base, so it is ' + t('1') + '.';
  var HSG = 'Is the minus sign inside the brackets (part of the base) or in front (applied last)? ' + t('-4^{0}=-(4^{0})=-1') + ', but ' + t('(-4)^{0}=1') + '.';
  var ONE = ['x', 'x', 'a', 'b', 'm', 'y', 'p', 'n', 't', 'k', 'c', 'd', 'w', 'z', 'q', 'r', 's', 'h', 'g', 'u', 'v'];
  var PAIRS = [['x', 'y'], ['x', 'y'], ['a', 'b'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['r', 's'], ['c', 'd'], ['u', 'v'], ['x', 'z'], ['h', 'k']];
  function L1(r) { return r.pick(ONE); }
  function L2(r) { return r.pick(PAIRS); }
  function W(tex, code, hint) { return { tex: tex, code: code, hint: hint }; }
  /* evaluate a numerical expression: number box */
  function numP(prompt, val, diag, sol, hints, text, bad) {
    var p = P.number(prompt, val, diag, sol, hints, text);
    p.bad = (bad || []).filter(function (b) { return Number(b) !== val; }).map(String);
    return p;
  }
  function zdiag(extra) {
    return function (v) {
      var h = extra ? extra(v) : null; if (h) return h;
      if (v === 0) return { code: 'zero-power', hint: HZ };
      return null;
    };
  }
  /* true / false statement (10C pattern) */
  function tfP(r, lhs, good, badRhs, truth, expl, text) {
    var rhs = truth ? good : badRhs;
    return P.tf(r, t(lhs + '=' + rhs), truth, expl, expl + '<br>So ' + t(lhs + '=' + good) + (truth ? ': the statement is <b>true</b>.' : ', not ' + t(rhs) + ': the statement is <b>false</b>.'), [HWH], text);
  }
  function negDec(r) { return r.pick(['1', '1', '1', '\\tfrac{1}{2}', '\\tfrac{2}{3}', '\\tfrac{3}{4}', '0.5', '1.5', '2.5', '0.2', '3.6', '\\tfrac{5}{8}', '1.2', '4.5', '\\tfrac{7}{10}', '0.75', '\\tfrac{1}{3}', '6.4', '\\tfrac{9}{4}', '2.25', '0.1']); }
  function oddBase(r) { return r.pick(['1', '1', '1', '1', '\\tfrac{1}{2}', '\\tfrac{3}{4}', '0.5', '100', '1\\,000', '0.1', '\\tfrac{2}{5}', '250', '\\tfrac{7}{3}', '0.01', '1.1', '\\tfrac{1}{10}', '365', '2.5', '\\tfrac{5}{6}', '0.3', '999']); }

  HW.defineLesson({
    id: 'u2l5', unit: 2, num: '5', title: 'Zero Exponents', outcome: 'AN3',
    blurb: 'Any nonzero base to the power zero is 1 — for numbers, variables and whole brackets — and where the zero exponent is attached decides the answer.',
    questions: [
      /* ================= Part A ================= */
      { num: '1', section: 'Part A — Zero exponents with numbers', stem: 'Evaluate each power without a calculator.', parts: [
        { id: '1a', level: 'LIM', outcome: 'AN3', make: function (r) { var b = r.int(2, 30); return numP(t(b + '^{0}'), 1, zdiag(function (v) { return v === b ? { code: 'zero-base', hint: HZ } : null; }), t(b + '^{0}=1') + ': any nonzero number to the power ' + t('0') + ' is ' + t('1') + '. (Pattern: ' + t(b + '^{1}=' + b) + ', and dividing by ' + t(b) + ' once more gives ' + t(b + '^{0}=' + b + '\\div ' + b + '=1') + '.)', [HZ], b + '^0', ['0', b]); } },
        { id: '1b', level: 'LIM', outcome: 'AN3', make: function (r) { var b = r.pick([r.int(10, 30), r.int(31, 99), r.int(100, 250)]); return numP(t(F(b) + '^{0}'), 1, zdiag(function (v) { return v === b ? { code: 'zero-base', hint: HZ } : null; }), t(F(b) + '^{0}=1') + ' — however big the base, the power ' + t('0') + ' gives ' + t('1') + '.', [HZ], b + '^0', ['0', b]); } },
        { id: '1c', level: 'BEG', outcome: 'AN3', make: function (r) { var b = r.int(2, 30); return numP(t('(-' + b + ')^{0}'), 1, zdiag(function (v) { return v === -1 ? { code: 'u2l5-neg-in', hint: 'The brackets make ' + t('-' + b) + ' the base, and any nonzero base to the power ' + t('0') + ' is ' + t('1') + ' — positive.' } : v === -b ? { code: 'zero-base', hint: HZ } : null; }), 'The brackets make ' + t('-' + b) + ' the base: ' + t('(-' + b + ')^{0}=1') + '.', [HZ, HSG], '(-' + b + ')^0', ['-1', '0']); } },
        { id: '1d', level: 'BEG', outcome: 'AN3', make: function (r) { var d = negDec(r); return numP(t('\\left(-' + d + '\\right)^{0}'), 1, zdiag(function (v) { return v === -1 ? { code: 'u2l5-neg-in', hint: 'The whole bracket ' + t('-' + d) + ' is the base. Any nonzero base to the power ' + t('0') + ' is ' + t('1') + '.' } : null; }), 'The base is ' + t('-' + d) + ' (it is not zero), so ' + t('\\left(-' + d + '\\right)^{0}=1') + '.', [HZ, HSG], '(-' + d + ')^0', ['-1', '0']); } },
        { id: '1e', level: 'LIM', outcome: 'AN3', make: function (r) { var d = oddBase(r); return numP(t(/frac|\./.test(d) ? '\\left(' + d + '\\right)^{0}' : d + '^{0}'), 1, zdiag(), t((/frac|\./.test(d) ? '\\left(' + d + '\\right)' : d) + '^{0}=1') + ': every nonzero base works the same way' + (d === '1' ? ' — even ' + t('1') : '') + '.', [HZ], d + '^0', ['0']); } }] },
      { num: '2', stem: '', parts: [
        { id: '2', level: 'BEG', outcome: 'AN3', make: function (r) {
          var b = r.int(2, 12), n = r.int(2, 9);
          var p = P.fields('Use the Quotient Law to show that ' + t(b + '^{' + n + '}\\div ' + b + '^{' + n + '}=1') + ', and confirm this matches the value of ' + t(b + '^{0}') + '.', [
            { name: 'Exponent', label: 'Quotient Law', before: t(b + '^{' + n + '}\\div ' + b + '^{' + n + '}=' + b + '^{' + n + '-' + n + '}=' + b + '^{\\square}') + ', where ' + t('\\square='), placeholder: '' },
            { name: 'Itself', label: 'A number divided by itself', before: t(b + '^{' + n + '}\\div ' + b + '^{' + n + '}=') },
            { name: 'Zero power', label: 'So', before: t(b + '^{0}=') }],
            [K.number(0, function (v) { if (v === 1) return { code: 'div-exp', hint: 'Quotient law: <b>subtract</b> the exponents, ' + t(n + '-' + n) + '.' }; if (v === 2 * n) return { code: 'add-exp', hint: 'Dividing <b>subtracts</b> the exponents.' }; return null; }),
              K.number(1, function (v) { return v === 0 ? { code: 'zero-power', hint: 'Any nonzero number divided by itself is ' + t('1') + ', not ' + t('0') + '.' } : null; }),
              K.number(1, function (v) { return v === 0 ? { code: 'zero-power', hint: 'Both ways describe the same expression, so ' + t(b + '^{0}') + ' must equal the value in the box above.' } : v === b ? { code: 'zero-base', hint: HZ } : null; })],
            ['0', '1', '1'], t(b + '^{' + n + '}\\div ' + b + '^{' + n + '}=' + b + '^{0}') + ' and ' + t('=1') + ', so ' + t(b + '^{0}=1'),
            'Quotient Law: ' + t(b + '^{' + n + '}\\div ' + b + '^{' + n + '}=' + b + '^{' + n + '-' + n + '}=' + b + '^{0}') + '.<br>But any nonzero number divided by itself is ' + t('1') + '.<br>Both describe the same expression, so ' + t(b + '^{0}=1') + '.', ['Subtract the exponents for the first box. What is any number divided by itself?'], 'show b^n ÷ b^n = b^0 = 1');
          p.bad = [['1', '1', '1'], ['0', '0', '0'], ['0', '1', String(b)]];
          return p;
        } }] },
      { num: '3', stem: 'Evaluate without a calculator, applying the Zero Exponent Law where needed.', parts: [
        { id: '3a', level: 'BEG', outcome: 'AN3', make: function (r) { var b = r.int(2, 12), n = b <= 5 || b === 10 ? r.int(2, 3) : 2, V = Math.pow(b, n); return numP(t(b + '^{' + n + '}\\times ' + b + '^{0}'), V, zdiag(function (v) { return v === V * b ? { code: 'zero-base', hint: t(b + '^{0}=1') + ', not ' + t(b) + '. (Or add the exponents: ' + t(b + '^{' + n + '+0}=' + b + '^{' + n + '}') + '.)' } : v === b * n ? { code: 'coef-times-n', hint: t(b + '^{' + n + '}') + ' means ' + t(b) + ' multiplied by itself ' + n + ' times.' } : null; }), t(b + '^{' + n + '}\\times ' + b + '^{0}=' + V + '\\times 1=' + V) + '. (Or: ' + t(b + '^{' + n + '+0}=' + b + '^{' + n + '}=' + V) + '.)', [HZ], b + '^' + n + '×' + b + '^0', ['0', V * b]); } },
        { id: '3b', level: 'BEG', outcome: 'AN3', make: function (r) { var b = r.int(2, 12), n = b <= 3 ? r.int(2, 4) : b <= 5 || b === 10 ? r.int(2, 3) : 2, V = Math.pow(b, n); return numP(t(b + '^{0}\\times ' + b + '^{' + n + '}'), V, zdiag(function (v) { return v === V * b ? { code: 'zero-base', hint: t(b + '^{0}=1') + ', not ' + t(b) + '.' } : null; }), t(b + '^{0}\\times ' + b + '^{' + n + '}=1\\times ' + V + '=' + V) + '.', [HZ], b + '^0×' + b + '^' + n, ['0', V * b]); } },
        { id: '3c', level: 'BEG', outcome: 'AN3', make: function (r) { var b = r.pick([10, 10, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 20, 25, 100]), c = r.chance(0.6) ? b : r.int(2, 30); return numP(t(b + '^{0}\\times ' + c + '^{0}'), 1, zdiag(function (v) { return v === 2 ? { code: 'add-coef', hint: 'Each power is ' + t('1') + ', and they are <b>multiplied</b>: ' + t('1\\times 1=1') + '.' } : v === b * c ? { code: 'zero-base', hint: HZ } : null; }), t(b + '^{0}\\times ' + c + '^{0}=1\\times 1=1') + '.', [HZ], b + '^0×' + c + '^0', ['0', '2']); } },
        { id: '3d', level: 'BEG', outcome: 'AN3', make: function (r) { var b = r.int(2, 12), n = r.int(2, 9); return numP(t('\\dfrac{' + b + '^{' + n + '}}{' + b + '^{' + n + '}}'), 1, zdiag(function (v) { return v === b ? { code: 'zero-base', hint: HZ } : null; }), t('\\frac{' + b + '^{' + n + '}}{' + b + '^{' + n + '}}=' + b + '^{' + n + '-' + n + '}=' + b + '^{0}=1') + '. (A number divided by itself is ' + t('1') + '.)', [HZ], b + '^n/' + b + '^n', ['0', b]); } },
        { id: '3e', level: 'BEG', outcome: 'AN3', make: function (r) { var b = r.int(2, 5), m = r.int(2, 6), V = Math.pow(b, m); return numP(t('(' + b + '^{' + m + '})^{0}'), 1, zdiag(function (v) { return v === V ? { code: 'zero-base', hint: 'The whole bracket is raised to the power ' + t('0') + ', so the answer is ' + t('1') + '.' } : null; }), 'Power of a power: ' + t('(' + b + '^{' + m + '})^{0}=' + b + '^{' + m + '\\times 0}=' + b + '^{0}=1') + '. (Or: the bracket is a nonzero number to the power ' + t('0') + '.)', [HZ], '(' + b + '^' + m + ')^0', ['0', V]); } }] },
      { num: '4', stem: 'State whether each statement is true or false.', parts: [
        { id: '4a', level: 'LIM', outcome: 'AN3', make: function (r) { var l = L1(r), tr = r.chance(0.35); return tfP(r, l + '^{0}', '1', r.pick(['0', l]), tr, 'Any nonzero base to the power ' + t('0') + ' is ' + t('1') + ': ' + t(l + '^{0}=1') + '.', 'T/F x^0'); } },
        { id: '4b', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 12), tr = r.chance(0.6); return tfP(r, k + l + '^{0}', String(k), r.pick(['1', '0']), tr, 'The ' + t('0') + ' sits on ' + t(l) + ' only: ' + t(k + l + '^{0}=' + k + '\\times 1=' + k) + '.', 'T/F kx^0'); } },
        { id: '4c', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 12), tr = r.chance(0.35); return tfP(r, '(' + k + l + ')^{0}', '1', String(k), tr, 'The brackets make the whole product ' + t(k + l) + ' the base: ' + t('(' + k + l + ')^{0}=1') + '.', 'T/F (kx)^0'); } },
        { id: '4d', level: 'EMG', outcome: 'AN3', make: function (r) { var k = r.int(2, 12), tr = r.chance(0.6); return tfP(r, '-' + k + '^{0}', '-1', '1', tr, 'The exponent belongs to ' + t(k) + ' only; the minus sign is applied last: ' + t('-' + k + '^{0}=-(' + k + '^{0})=-1') + '.', 'T/F -k^0'); } },
        { id: '4e', level: 'BEG', outcome: 'AN3', make: function (r) { var k = r.int(2, 12), tr = r.chance(0.6); return tfP(r, '(-' + k + ')^{0}', '1', '-1', tr, 'The brackets make ' + t('-' + k) + ' the base, and any nonzero base to the power ' + t('0') + ' is ' + t('1') + '.', 'T/F (-k)^0'); } }] },
      { num: '5', stem: 'Evaluate without a calculator, watching carefully where the exponent applies.', parts: [
        { id: '5a', level: 'EMG', outcome: 'AN3', make: function (r) { var k = r.int(2, 30); return numP(t('-' + k + '^{0}'), -1, zdiag(function (v) { return v === 1 ? { code: 'neg-zero', hint: 'No brackets: the exponent is on ' + t(k) + ' only. ' + t('-' + k + '^{0}=-(' + k + '^{0})=-1') + '.' } : v === -k ? { code: 'zero-base', hint: HZ } : null; }), 'The exponent belongs to ' + t(k) + ' only: ' + t('-' + k + '^{0}=-(' + k + '^{0})=-1') + '.', [HSG], '-k^0', ['1', '0']); } },
        { id: '5b', level: 'BEG', outcome: 'AN3', make: function (r) { var k = r.int(2, 30); return numP(t('(-' + k + ')^{0}'), 1, zdiag(function (v) { return v === -1 ? { code: 'u2l5-neg-in', hint: 'The brackets make ' + t('-' + k) + ' the base: the answer is ' + t('1') + '.' } : null; }), 'The brackets make ' + t('-' + k) + ' the base: ' + t('(-' + k + ')^{0}=1') + '.', [HSG], '(-k)^0', ['-1', '0']); } },
        { id: '5c', level: 'EMG', outcome: 'AN3', make: function (r) { var a = r.int(2, 9), b = r.int(2, 9); return numP(t('-' + a + '\\times ' + b + '^{0}'), -a, zdiag(function (v) { return v === 1 || v === -1 ? { code: 'u2l5-coef-zero', hint: 'Only ' + t(b) + ' has the exponent ' + t('0') + ': ' + t(b + '^{0}=1') + ', then ' + t('-' + a + '\\times 1=-' + a) + '.' } : v === -a * b ? { code: 'zero-base', hint: HZ } : null; }), t(b + '^{0}=1') + ', so ' + t('-' + a + '\\times ' + b + '^{0}=-' + a + '\\times 1=-' + a) + '.', [HWH], '-a×b^0', ['-1', '1', '0', -a * b]); } },
        { id: '5d', level: 'EMG', outcome: 'AN3', make: function (r) { var a = r.int(2, 9), b = r.int(2, 9); return numP(t('(-' + a + '\\times ' + b + ')^{0}'), 1, zdiag(function (v) { return v === -a ? { code: 'zero-coef', hint: 'The brackets make the whole product the base, so the answer is ' + t('1') + '.' } : v === -1 ? { code: 'u2l5-neg-in', hint: 'The minus sign is inside the brackets, part of the base: the whole thing to the power ' + t('0') + ' is ' + t('1') + '.' } : v === -a * b ? { code: 'zero-base', hint: HZ } : null; }), 'The brackets make the whole product the base: ' + t('(-' + a + '\\times ' + b + ')^{0}=(-' + (a * b) + ')^{0}=1') + '.', [HWH], '(-a×b)^0', [-a, -1, 0]); } },
        { id: '5e', level: 'EMG', outcome: 'AN3', make: function (r) { var k = r.int(2, 9), n = r.int(2, 5), V = n % 2 ? -1 : 1; return numP(t('\\left[-(' + k + ')^{0}\\right]^{' + n + '}'), V, zdiag(function (v) { return v === -V ? { code: 'sign', hint: 'Inside: ' + t('-(' + k + ')^{0}=-1') + '. Then ' + t('(-1)^{' + n + '}') + ': ' + (n % 2 ? 'an odd power of ' + t('-1') + ' is ' + t('-1') : 'an even power of ' + t('-1') + ' is ' + t('1')) + '.' } : null; }), 'Inside the square brackets first: ' + t('(' + k + ')^{0}=1') + ', so ' + t('-(' + k + ')^{0}=-1') + '.<br>Then ' + t('(-1)^{' + n + '}=' + V) + ' (' + (n % 2 ? 'odd' : 'even') + ' power).', ['Work from the inside out: what is ' + t('(' + k + ')^{0}') + '?', HSG], '[-(k)^0]^n', [-V, 0]); } }] },
      /* ================= Part B ================= */
      { num: '6', section: 'Part B — Variables and combining the laws', stem: 'Simplify each expression.', parts: [
        { id: '6a', level: 'LIM', outcome: 'AN3', make: function (r) { var l = L1(r); return chain(Mn(1, [[l, 0]]), { wrongs: [W(l, 'zero-base', HZ)], hints: [HZ, 'What is any nonzero number to the power ' + t('0') + '?'], text: 'x^0' }); } },
        { id: '6b', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 15); return chain(Mn(k, [[l, 0]]), { wrongs: [W('1', 'u2l5-coef-zero', 'The ' + t('0') + ' sits on ' + t(l) + ' only, not on the ' + t(k) + ': ' + t(k + '\\times 1=' + k) + '.'), W(k + l, 'zero-base', HZ)], hints: [HWH, HZ], text: 'kx^0' }); } },
        { id: '6c', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 15); return chain(Pw(Mn(k, [[l, 1]]), 0), { wrongs: [W(String(k), 'zero-coef', 'The brackets make the whole product ' + t(k + l) + ' the base, so the answer is ' + t('1') + '.'), W(k + l, 'zero-base', HZ)], hints: [HWH, HZ], text: '(kx)^0' }); } },
        { id: '6d', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 15); return chain(Dv(Mn(k, []), Mn(1, [[l, 0]])), { wrongs: [W('\\frac{' + k + '}{' + l + '}', 'zero-base', HZ), W('1', 'u2l5-coef-zero', 'Only the bottom has the exponent ' + t('0') + ': ' + t(l + '^{0}=1') + ', and ' + t(k + '\\div 1=' + k) + '.'), W('\\frac{1}{' + k + '}', 'coef-flip', t('\\frac{' + k + '}{1}=' + k) + '.')], hints: [HZ, 'Replace ' + t(l + '^{0}') + ' with ' + t('1') + ' first.'], text: 'k/x^0' }); } },
        { id: '6e', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), p = r.int(2, 6); return chain(Pw(Mn(k, [[l, p]]), 0), { wrongs: [W(String(k), 'zero-coef', 'The whole bracket is the base, so the ' + t(k) + ' becomes ' + t('1') + ' too.'), W(k + vt(l, p), 'zero-base', HZ)], hints: [HWH, HZ], text: '(kx^p)^0' }); } }] },
      { num: '7', stem: 'Simplify each expression.', parts: [
        { id: '7a', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), n = r.int(2, 9); return chain(Mul([Mn(1, [[l, n]]), Mn(1, [[l, 0]])]), { wrongs: [W(vt(l, n + 1), 'zero-base', t(l + '^{0}=1') + ', not ' + t(l) + ': multiplying by ' + t('1') + ' changes nothing.')], hints: [HZ, 'Product law: ' + t(l + '^{' + n + '+0}') + '.'], text: 'x^n × x^0' }); } },
        { id: '7b', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), n = r.int(2, 9); return chain(Dv(Mn(1, [[l, n]]), Mn(1, [[l, n]])), { wrongs: [W('0', 'zero-as-zero', 'Anything (except ' + t('0') + ') divided by itself is ' + t('1') + ': ' + t(l + '^{' + n + '-' + n + '}=' + l + '^{0}=1') + '.')], hints: [HZ, 'Quotient law: ' + t(l + '^{' + n + '-' + n + '}') + '.'], text: 'y^n/y^n' }); } },
        { id: '7c', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), a = r.int(2, 9), b = r.int(2, 9), n = r.int(2, 6); return chain(Mul([Mn(a, [[l, 0]]), Mn(b, [[l, n]])]), { wrongs: [W(b + vt(l, n), 'u2l5-coef-zero', 'The ' + t('0') + ' is on ' + t(l) + ' only, so ' + t(a + l + '^{0}=' + a) + ' — the ' + t(a) + ' stays.'), W((a * b) + vt(l, n + 1), 'zero-base', HZ)], hints: [HWH, HZ], text: 'ka^0 × ca^n' }); } },
        { id: '7d', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 20), n = r.int(2, 9); return chain(Dv(Mn(k, [[l, n]]), Mn(1, [[l, n]])), { wrongs: [W('1', 'u2l5-coef-zero', 'Only the ' + t(vt(l, n)) + '’s cancel; the ' + t(k) + ' stays.')], hints: [HZ, 'Quotient law on ' + t(l) + ': ' + t(l + '^{' + n + '-' + n + '}=' + l + '^{0}') + '.'], text: 'kb^n/b^n' }); } }] },
      { num: '8', stem: 'Simplify each expression.', parts: [
        { id: '8a', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), c = r.int(2, 9), p = r.int(2, 5), q = r.int(2, 6); return chain(Mul([Pw(Mn(k, [[l, p]]), 0), Mn(c, [[l, q]])]), { wrongs: [W((k * c) + vt(l, q), 'zero-coef', 'The whole bracket ' + t('(' + k + vt(l, p) + ')') + ' is the base, so it becomes ' + t('1') + ' — the ' + t(k) + ' too.')], hints: [HO, HZ], text: '(kx^p)^0 × cx^q' }); } },
        { id: '8b', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), c = r.int(2, 9), p = r.int(2, 5), q = r.int(2, 6); return chain(Mul([Mn(c, [[l, q]]), Pw(Mn(k, [[l, p]]), 0)]), { wrongs: [W((k * c) + vt(l, q), 'zero-coef', 'The whole bracket ' + t('(' + k + vt(l, p) + ')') + ' is the base, so it becomes ' + t('1') + ' — the ' + t(k) + ' too.')], hints: [HO, HZ], text: 'cx^q × (kx^p)^0' }); } },
        { id: '8c', level: 'PRG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 12), c = r.int(2, 9), p = r.int(2, 5), q = r.int(2, 9); return chain(Dv(Mn(k, [[l, q]]), Mul([Pw(Mn(c, [[l, p]]), 0), Mn(1, [[l, q]])])), { wrongs: [W('\\frac{' + k + '}{' + c + '}', 'zero-coef', 'The bracket ' + t('(' + c + vt(l, p) + ')^{0}') + ' is ' + t('1') + ' — the ' + t(c) + ' too.')], hints: [HO, HZ], text: 'kd^q/((cd^p)^0 × d^q)' }); } },
        { id: '8d', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), n = k <= 5 ? r.pick([2, 2, 3]) : 2; return chain(Pw(Mn(k, [[l, 0]]), n), { wrongs: [W('1', 'u2l5-coef-zero', 'The ' + t('0') + ' is on ' + t(l) + ' only: inside the bracket ' + t(k + l + '^{0}=' + k) + '. Then ' + t(k + '^{' + n + '}') + '.')], hints: [HO, 'Simplify inside the bracket first.'], text: '(ke^0)^n' }); } }] },
      { num: '9', stem: 'Simplify, combining the Zero Exponent Law with the laws from Lessons 1–4.', parts: [
        { id: '9a', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.pick([2, 2, 3]), p = r.int(2, 4), q = r.int(1, 3); return chain(Mul([Pw(Mn(k, [[ls[0], p], [ls[1], 0]]), 2), Mn(1, [[ls[0], q]])]), { wrongs: [W(posTex(M(k * k, [[ls[0], 2 * p + q], [ls[1], 2]])), 'zero-base', HZ)], hints: [HO, HW_], text: '(kx^p y^0)^2 × x^q' }); } },
        { id: '9b', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.pick([2, 3, 3, 4]), p = r.int(2, 4), q = r.int(1, 2 * p - 1); return chain(Dv(Pw(Mn(k, [[ls[0], p], [ls[1], 0]]), 2), Mn(1, [[ls[0], q]])), { wrongs: [W(posTex(M(k * k, [[ls[0], 2 * p - q], [ls[1], 2]])), 'zero-base', HZ)], hints: [HO, HW_], text: '(ka^p b^0)^2 / a^q' }); } }] },
      { num: '10', stem: 'Simplify.', parts: [
        { id: '10', level: 'ADV', outcome: 'AN3', make: function (r) {
          var ls = L2(r), c = pickWhere(function () { return [r.pick([2, 3, 4]), r.int(2, 5), r.pick([2, 3, 4, 6, 8, 9, 12])]; }, function (c) { var top = c[0] * c[0] * c[1]; return top % c[2] === 0 && top / c[2] >= 2 && top / c[2] <= 12; });
          var p = r.int(2, 3), q = r.int(1, 2), s = r.int(2, 2 * p + q - 1);
          return chain(Dv(Mul([Pw(Mn(c[0], [[ls[0], p], [ls[1], 0]]), 2), Mn(c[1], [[ls[0], q]])]), Mn(c[2], [[ls[0], s]])), { hints: [HO, HW_], text: '(kx^p y^0)^2 × cx / dx^s' });
        } }] },
      /* ================= Part C ================= */
      { num: '11', section: 'Part C — Multiple choice and explanation', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', outcome: 'AN3', make: function (r) {
          var abc = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 12], 3), a = Math.max(abc[0], abc[1]), b = Math.min(abc[0], abc[1]), c = abc[2];
          var opts = [{ html: t('0'), why: HZ }, { html: t('1'), why: 'The top is ' + t('1+1') + ' — add before you divide.' }, { html: t('2'), right: true }, { html: t(a), why: 'Each power with exponent ' + t('0') + ' is ' + t('1') + ', not its base.' }];
          return P.mc(r, 'The value of ' + t('\\dfrac{' + a + '^{0}+' + b + '^{0}}{' + c + '^{0}}') + ' is', opts, t('\\frac{' + a + '^{0}+' + b + '^{0}}{' + c + '^{0}}=\\frac{1+1}{1}=2') + '.', [HZ], 'MC (a^0+b^0)/c^0', true);
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', outcome: 'AN3', make: function (r) {
          var l = L1(r), k = r.int(2, 12);
          var opts = [{ html: t(k + l + '^{0}'), right: true }, { html: t('(' + k + l + ')^{0}'), why: 'The brackets make all of ' + t(k + l) + ' the base, so this is ' + t('1') + '.' }, { html: t('0' + l + '^{' + k + '}'), why: 'Anything times ' + t('0') + ' is ' + t('0') + '.' }, { html: t(k + '^{0}' + l), why: t(k + '^{0}=1') + ', so this is just ' + t(l) + '.' }];
          return P.mc(r, 'Which expression is equal to ' + t(k) + ', assuming ' + t(l + '\\neq 0') + '?', opts, t(k + l + '^{0}=' + k + '\\times 1=' + k) + ': the ' + t('0') + ' is on ' + t(l) + ' only. The others: ' + t('(' + k + l + ')^{0}=1') + ', ' + t('0' + l + '^{' + k + '}=0') + ', ' + t(k + '^{0}' + l + '=' + l) + '.', [HWH], 'MC which equals k', true);
        } }] },
      { num: '13', stem: function (sh) { return '<i>(Explain)</i> Consider ' + t(sh.k + sh.l + '^{0}') + ' and ' + t('(' + sh.k + sh.l + ')^{0}') + ', assuming ' + t(sh.l + '\\neq 0') + '.'; },
        shared: function (r) { return { k: r.int(2, 15), l: r.pick(['y', 'y', 'x', 'a', 'm', 'n', 'p', 't', 'w']) }; },
        parts: [
          { id: '13a', level: 'BEG', outcome: 'AN3', make: function (r, sh) {
            var k = sh.k, l = sh.l;
            var p = P.fields('State the value of each.', [{ name: 'First', label: t(k + l + '^{0}'), before: t('=') }, { name: 'Second', label: t('(' + k + l + ')^{0}'), before: t('=') }],
              [K.number(k, function (v) { return v === 1 ? { code: 'u2l5-coef-zero', hint: 'The ' + t('0') + ' sits on ' + t(l) + ' only.' } : v === 0 ? { code: 'zero-power', hint: HZ } : null; }), K.number(1, function (v) { return v === k ? { code: 'zero-coef', hint: 'The brackets make the whole ' + t(k + l) + ' the base.' } : v === 0 ? { code: 'zero-power', hint: HZ } : null; })],
              [String(k), '1'], t(k + l + '^{0}=' + k) + ', ' + t('(' + k + l + ')^{0}=1'), t(k + l + '^{0}=' + k + '\\times ' + l + '^{0}=' + k + '\\times 1=' + k) + ' (exponent on ' + t(l) + ' only).<br>' + t('(' + k + l + ')^{0}=1') + ' (exponent on the whole product).', [HWH], 'values ky^0, (ky)^0');
            p.bad = [['1', String(k)], ['1', '1'], [String(k), String(k)]];
            return p;
          } },
          { id: '13b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var k = sh.k, l = sh.l;
            return P.mc(r, 'Which explains the difference?', [
              { html: 'In ' + t(k + l + '^{0}') + ' the exponent ' + t('0') + ' is on ' + t(l) + ' only; in ' + t('(' + k + l + ')^{0}') + ' the brackets put it on the whole product ' + t(k + l) + '.', right: true },
              { html: 'In ' + t(k + l + '^{0}') + ' the ' + t('0') + ' makes the whole term ' + t('0') + '; in ' + t('(' + k + l + ')^{0}') + ' the brackets protect it.', why: 'A zero exponent never makes anything ' + t('0') + ': ' + t(l + '^{0}=1') + '.' },
              { html: 'There is no difference: brackets don’t change anything when multiplying.', why: 'Brackets decide what the exponent is attached to — here that changes the answer.' },
              { html: 'In ' + t('(' + k + l + ')^{0}') + ' only the ' + t(l) + ' becomes ' + t('1') + ', so the answer is ' + t(k) + '.', why: 'With brackets, the whole product ' + t(k + l) + ' is the base, so all of it becomes ' + t('1') + '.' }],
              'An exponent applies only to the base it is written on. Without brackets that is ' + t(l) + ', so ' + t(k + l + '^{0}=' + k) + '. With brackets the base is ' + t(k + l) + ', so ' + t('(' + k + l + ')^{0}=1') + '.', [HWH], 'explain ky^0 vs (ky)^0');
          } }] }],

    extra: [
      /* ================= Extra A ================= */
      { num: '1', section: 'Part A — Where the zero exponent attaches', stem: function (sh) { return 'Simplify each expression, where ' + t(sh.l + '\\neq 0') + '.'; },
        shared: function (r) { return { l: r.pick(['x', 'x', 'a', 'm', 'y', 't', 'n', 'p', 'w', 'k']), k: r.int(2, 15) }; },
        parts: [
          { id: 'e1a', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return chain(Mn(sh.k, [[sh.l, 0]]), { wrongs: [W('1', 'u2l5-coef-zero', 'The ' + t('0') + ' sits on ' + t(sh.l) + ' only.')], hints: [HWH, HZ], text: 'kx^0' }); } },
          { id: 'e1b', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return chain(Pw(Mn(sh.k, [[sh.l, 1]]), 0), { wrongs: [W(String(sh.k), 'zero-coef', 'The brackets make the whole ' + t(sh.k + sh.l) + ' the base.')], hints: [HWH, HZ], text: '(kx)^0' }); } },
          { id: 'e1c', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return chain(Mul([Mn(sh.k, []), Mn(1, [[sh.l, 0]])]), { prompt: t(sh.k + '\\left(' + sh.l + '^{0}\\right)'), wrongs: [W('1', 'u2l5-coef-zero', 'The bracket holds only ' + t(sh.l + '^{0}') + ', which is ' + t('1') + '; the ' + t(sh.k) + ' is outside.')], hints: [HWH, HZ], text: 'k(x^0)' }); } },
          { id: 'e1d', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return chain(Mn(-sh.k, [[sh.l, 0]]), { wrongs: [W('-1', 'u2l5-coef-zero', 'The ' + t('0') + ' sits on ' + t(sh.l) + ' only.'), W('1', 'u2l5-coef-zero', 'The ' + t('0') + ' sits on ' + t(sh.l) + ' only, so the ' + t('-' + sh.k) + ' stays.')], hints: [HWH, HZ], text: '-kx^0' }); } },
          { id: 'e1e', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return chain(Pw(Mn(-sh.k, [[sh.l, 1]]), 0), { wrongs: [W('-1', 'u2l5-neg-in', 'The minus sign is inside the brackets: the whole ' + t('-' + sh.k + sh.l) + ' is the base.'), W(String(-sh.k), 'zero-coef', 'The brackets make the whole ' + t('-' + sh.k + sh.l) + ' the base.')], hints: [HWH, HSG], text: '(-kx)^0' }); } }] },
      { num: '2', stem: function (sh) { return 'Simplify each expression, where ' + t(sh.x + '\\neq 0') + ' and ' + t(sh.y + '\\neq 0') + '.'; },
        shared: function (r) { var ls = L2(r); return { x: ls[0], y: ls[1], k: r.int(2, 5), p: r.int(2, 4) }; },
        parts: [
          { id: 'e2a', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return chain(Pw(Mn(sh.k, [[sh.x, sh.p], [sh.y, 1]]), 0), { wrongs: [W(String(sh.k), 'zero-coef', 'The whole bracket is the base.')], hints: [HWH, HZ], text: '(kx^p y)^0' }); } },
          { id: 'e2b', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return chain(Mul([Mn(sh.k, []), Pw(Mn(1, [[sh.x, sh.p], [sh.y, 1]]), 0)]), { prompt: t(sh.k + '\\left(' + vt(sh.x, sh.p) + sh.y + '\\right)^{0}'), wrongs: [W('1', 'u2l5-coef-zero', 'The ' + t(sh.k) + ' is outside the bracket, so it stays.')], hints: [HWH, HZ], text: 'k(x^p y)^0' }); } },
          { id: 'e2c', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return chain(Mn(sh.k, [[sh.x, sh.p], [sh.y, 0]]), { wrongs: [W('1', 'u2l5-coef-zero', 'The ' + t('0') + ' sits on ' + t(sh.y) + ' only.'), W(String(sh.k), 'u2l5-coef-zero', 'Only ' + t(sh.y) + ' has the exponent ' + t('0') + '; ' + t(vt(sh.x, sh.p)) + ' stays.')], hints: [HWH, HZ], text: 'kx^p y^0' }); } },
          { id: 'e2d', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return chain(Mul([Mn(sh.k, [[sh.x, sh.p]]), Mn(1, [[sh.y, 0]])]), { prompt: t('\\left(' + sh.k + vt(sh.x, sh.p) + '\\right)' + sh.y + '^{0}'), wrongs: [W('1', 'u2l5-coef-zero', 'The ' + t('0') + ' sits on ' + t(sh.y) + ' only; the bracket has no exponent.')], hints: [HWH, HZ], text: '(kx^p)y^0' }); } },
          { id: 'e2e', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return chain(Mul([Pw(Mn(sh.k, [[sh.x, 1]]), 2), Mn(1, [[sh.y, 0]])]), { prompt: t('(' + sh.k + sh.x + ')^{2}' + sh.y + '^{0}'), wrongs: [W(sh.k + vt(sh.x, 2), 'not-raised', 'Square the ' + t(sh.k) + ' too: ' + t('(' + sh.k + sh.x + ')^{2}=' + sh.k * sh.k + vt(sh.x, 2)) + '.')], hints: [HWH, HW_], text: '(kx)^2 y^0' }); } }] },
      { num: '3', stem: 'Evaluate each expression. Watch whether the negative sign is inside or outside the base.',
        shared: function (r) { return { k: r.int(2, 25), n: r.int(2, 5), m: r.int(2, 5) }; },
        parts: [
          { id: 'e3a', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return numP(t('-' + sh.k + '^{0}'), -1, zdiag(function (v) { return v === 1 ? { code: 'neg-zero', hint: HSG } : null; }), t('-' + sh.k + '^{0}=-(' + sh.k + '^{0})=-1') + '.', [HSG], '-k^0', ['1', '0']); } },
          { id: 'e3b', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return numP(t('(-' + sh.k + ')^{0}'), 1, zdiag(function (v) { return v === -1 ? { code: 'u2l5-neg-in', hint: HSG } : null; }), t('(-' + sh.k + ')^{0}=1') + ': the base is ' + t('-' + sh.k) + '.', [HSG], '(-k)^0', ['-1', '0']); } },
          { id: 'e3c', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return numP(t('-(-' + sh.k + ')^{0}'), -1, zdiag(function (v) { return v === 1 ? { code: 'sign', hint: 'Work out ' + t('(-' + sh.k + ')^{0}=1') + ' first, then apply the minus sign in front.' } : null; }), t('(-' + sh.k + ')^{0}=1') + ', so ' + t('-(-' + sh.k + ')^{0}=-1') + '.', [HSG], '-(-k)^0', ['1', '0']); } },
          { id: 'e3d', level: 'EMG', outcome: 'AN3', make: function (r, sh) { var V = sh.n % 2 ? -1 : 1; return numP(t('\\left(-' + sh.k + '^{0}\\right)^{' + sh.n + '}'), V, zdiag(function (v) { return v === -V ? { code: 'sign', hint: 'Inside: ' + t('-' + sh.k + '^{0}=-1') + '. Then ' + t('(-1)^{' + sh.n + '}') + ' — is the power even or odd?' } : null; }), 'Inside: ' + t('-' + sh.k + '^{0}=-1') + '. Then ' + t('(-1)^{' + sh.n + '}=' + V) + '.', [HSG], '(-k^0)^n', [-V, 0]); } },
          { id: 'e3e', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return numP(t('-\\left(' + sh.k + '^{0}\\right)^{' + sh.m + '}'), -1, zdiag(function (v) { return v === 1 ? { code: 'sign', hint: 'The minus sign is outside everything: ' + t('(' + sh.k + '^{0})^{' + sh.m + '}=1^{' + sh.m + '}=1') + ', then the minus sign.' } : null; }), t('(' + sh.k + '^{0})^{' + sh.m + '}=1^{' + sh.m + '}=1') + ', so the answer is ' + t('-1') + '.', [HSG], '-(k^0)^m', ['1', '0']); } }] },
      { num: '4', stem: '', parts: [
        { id: 'e4', level: 'PRG', outcome: 'AN3', make: function (r) {
          var l = r.pick(['m', 'm', 'x', 'a', 'n', 'p', 'y', 't']), k = r.int(2, 15);
          var exps = [[k + l + '^{0}', String(k)], ['(' + k + l + ')^{0}', '1'], [k + '^{0}' + l + '^{0}', '1'], ['\\left(' + k + l + '^{0}\\right)^{0}', '1'], ['-(' + k + l + ')^{0}', '-1']];
          var rows = exps.map(function (e, i) { return { id: 'r' + i, html: t(e[0]) }; }), cols = [{ id: '1', html: t('1') }, { id: '-1', html: t('-1') }, { id: String(k), html: t(k) }, { id: '0', html: t('0') }], want = {};
          exps.forEach(function (e, i) { want['r' + i] = e[1]; });
          return P.grid('Exactly three of the five expressions ' + exps.map(function (e) { return t(e[0]); }).join(', ') + ' are equal to ' + t('1') + ' when ' + t(l + '\\neq 0') + '. Choose the value of each one.', rows, cols, want, { colHead: 'Value', why: function (row, got) {
              var i = Number(row.slice(1));
              if (got === '0') return { code: 'zero-power', hint: t(exps[i][0]) + ': ' + HZ };
              if (i === 0) return { code: 'u2l5-coef-zero', hint: t(exps[0][0]) + ': the ' + t('0') + ' sits on ' + t(l) + ' only.' };
              if (i === 1) return { code: 'zero-coef', hint: t(exps[1][0]) + ': the whole product is the base.' };
              if (i === 3) return { code: 'zero-base', hint: t(exps[3][0]) + ': inside, ' + t(k + l + '^{0}=' + k) + '; then ' + t(k + '^{0}=1') + '.' };
              if (i === 4) return { code: 'sign', hint: t(exps[4][0]) + ': the bracket is ' + t('1') + ', and the minus sign is outside.' };
              return { code: 'row', hint: t(exps[i][0]) + ': each factor to the power ' + t('0') + ' is ' + t('1') + '.' };
            } }, t(k + l + '^{0}=' + k) + ' (exponent on ' + t(l) + ' only); ' + t('(' + k + l + ')^{0}=1') + '; ' + t(k + '^{0}' + l + '^{0}=1\\times 1=1') + '; ' + t('\\left(' + k + l + '^{0}\\right)^{0}=' + k + '^{0}=1') + ' (the bracket simplifies to ' + t(k) + ' first); ' + t('-(' + k + l + ')^{0}=-1') + '.<br>The three equal to ' + t('1') + ': ' + t('(' + k + l + ')^{0}') + ', ' + t(k + '^{0}' + l + '^{0}') + ', ' + t('\\left(' + k + l + '^{0}\\right)^{0}') + '.', [HWH, HSG], 'which three equal 1');
        } }] },
      { num: '5', stem: function (sh) { return '<i>(Error analysis)</i> Asked to simplify ' + t(sh.k + sh.l + '^{0}') + ' for ' + t(sh.l + '\\neq 0') + ', a student wrote ' + t(sh.k + sh.l + '^{0}=0') + '.'; },
        shared: function (r) { return { k: r.int(2, 15), l: r.pick(['x', 'x', 'a', 'm', 'y', 'n', 'p']) }; },
        parts: [
          { id: 'e5a', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'What is the mistake?', [
              { html: 'The student treated ' + t(sh.l + '^{0}') + ' as ' + t('0') + '. A zero exponent gives ' + t('1') + ', and it is attached to ' + t(sh.l) + ' only.', right: true },
              { html: 'The student forgot that ' + t(sh.k + sh.l + '^{0}') + ' should be ' + t('1') + ', because the ' + t('0') + ' applies to the ' + t(sh.k) + ' too.', why: 'Without brackets the ' + t('0') + ' is on ' + t(sh.l) + ' only; the ' + t(sh.k) + ' is not raised to the power ' + t('0') + '.' },
              { html: 'There is no mistake: anything to the power ' + t('0') + ' is ' + t('0') + '.', why: HZ },
              { html: 'The student should have written ' + t(sh.k + sh.l) + ', because ' + t(sh.l + '^{0}=' + sh.l) + '.', why: t(sh.l + '^{0}=1') + ', not ' + t(sh.l) + '.' }],
              'The student read ' + t(sh.l + '^{0}') + ' as ' + t('0') + '. In fact ' + t(sh.l + '^{0}=1') + ' (for ' + t(sh.l + '\\neq 0') + '), and the ' + t('0') + ' sits on ' + t(sh.l) + ' only, so ' + t(sh.k + sh.l + '^{0}=' + sh.k + '\\times 1=' + sh.k) + '.', [HZ], 'error kx^0 = 0');
          } },
          { id: 'e5b', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return chain(Mn(sh.k, [[sh.l, 0]]), { prompt: 'Give the correct answer: ' + t(sh.k + sh.l + '^{0}=') + ' ?', wrongs: [W('1', 'u2l5-coef-zero', 'The ' + t('0') + ' sits on ' + t(sh.l) + ' only.')], hints: [HWH, HZ], text: 'correct kx^0' }); } }] },
      { num: '6', stem: function (sh) { return '<i>(Error analysis)</i> Asked to simplify ' + t('(' + sh.k + sh.l + ')^{0}') + ' for ' + t(sh.l + '\\neq 0') + ', a student wrote ' + t('(' + sh.k + sh.l + ')^{0}=' + sh.k) + '.'; },
        shared: function (r) { return { k: r.int(2, 15), l: r.pick(['x', 'x', 'a', 'm', 'y', 'n', 'p']) }; },
        parts: [
          { id: 'e6a', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'What is the mistake?', [
              { html: 'The brackets make the whole product ' + t(sh.k + sh.l) + ' the base, so all of it becomes ' + t('1') + ' — not just the ' + t(sh.l) + '.', right: true },
              { html: 'The student should have made the answer ' + t('0') + ', because the exponent is ' + t('0') + '.', why: HZ },
              { html: 'The student should have kept ' + t(sh.k + sh.l) + ', because a zero exponent changes nothing.', why: 'A zero exponent turns the base into ' + t('1') + '.' },
              { html: 'There is no mistake: the ' + t(sh.k) + ' is a coefficient, so it stays.', why: 'Inside brackets the ' + t(sh.k) + ' is part of the base, so it is raised to the power ' + t('0') + ' too.' }],
              'The exponent is outside the brackets, so the base is the whole product ' + t(sh.k + sh.l) + ': ' + t('(' + sh.k + sh.l + ')^{0}=1') + '. The student applied the ' + t('0') + ' to ' + t(sh.l) + ' only.', [HWH], 'error (kx)^0 = k');
          } },
          { id: 'e6b', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return chain(Pw(Mn(sh.k, [[sh.l, 1]]), 0), { prompt: 'Give the correct answer: ' + t('(' + sh.k + sh.l + ')^{0}=') + ' ?', wrongs: [W(String(sh.k), 'zero-coef', 'That’s the student’s answer — the whole bracket is the base.')], hints: [HWH, HZ], text: 'correct (kx)^0' }); } },
          { id: 'e6c', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'Which expression <b>does</b> simplify to ' + t(sh.k) + '?', [{ html: t(sh.k + sh.l + '^{0}'), right: true }, { html: t('(' + sh.k + sh.l + ')^{0}'), why: 'That is the original: it equals ' + t('1') + '.' }, { html: t(sh.k + '^{0}' + sh.l), why: t(sh.k + '^{0}=1') + ', so this is ' + t(sh.l) + '.' }, { html: t('(' + sh.k + '+' + sh.l + ')^{0}'), why: 'The whole bracket is the base: this is ' + t('1') + '.' }],
              t(sh.k + sh.l + '^{0}=' + sh.k + '\\times 1=' + sh.k) + ': without brackets, only ' + t(sh.l) + ' gets the exponent ' + t('0') + '.', [HWH], 'which expression is k');
          } }] },
      /* ================= Extra B ================= */
      { num: '7', section: 'Part B — Why a⁰ = 1: deriving and justifying', stem: function (sh) { return '<i>(Derive it.)</i> Let ' + t(sh.l + '\\neq 0') + ' and look at ' + t('\\dfrac{' + vt(sh.l, sh.n) + '}{' + vt(sh.l, sh.n) + '}') + '.'; },
        shared: function (r) { return { l: r.pick(['x', 'x', 'a', 'y', 'm', 'p', 't', 'n', 'k', 'w']), n: r.int(2, 9) }; },
        parts: [
          { id: 'e7a', level: 'BEG', outcome: 'AN3', make: function (r, sh) {
            var l = sh.l, n = sh.n;
            return { prompt: 'Simplify ' + t('\\dfrac{' + vt(l, n) + '}{' + vt(l, n) + '}') + ' using the Quotient Law, leaving your answer as a single power of ' + t(l) + '.', input: { type: 'math', keys: 'expo', vars: [l] }, key: l + '^{0}', answer: t(l + '^{0}'),
              check: function (resp) {
                var a = K.read(resp); if (a.res) return a.res;
                var node = a.ast; while (node.t === 'paren') node = node.a;
                if (node.t === 'pow' && node.a.t === 'var' && node.a.n === l) { var e = ex.rat(node.b); if (e && e[0] === 0) return ok(); if (e && e[0] === 2 * n && e[1] === 1) return wrong('add-exp', 'Dividing <b>subtracts</b> the exponents: ' + t(n + '-' + n) + '.'); if (e && e[0] === 1 && e[1] === 1) return wrong('div-exp', 'Quotient law: <b>subtract</b> the exponents, ' + t(n + '-' + n) + '.'); return wrong('exp', 'Quotient law: top exponent minus bottom exponent.'); }
                if (ex.eq(a.val, 1) || ex.eq(a.val, 0)) return form('single-power', 'This box wants the Quotient Law result as a single power of ' + t(l) + ' — write it as ' + t(l + '^{\\square}') + '.');
                return wrong('value', null);
              }, solution: t('\\frac{' + vt(l, n) + '}{' + vt(l, n) + '}=' + l + '^{' + n + '-' + n + '}=' + l + '^{0}') + '.', hints: ['Quotient law: same base, subtract the exponents.'], text: 'x^n/x^n as a power', bad: ['1', l + '^{' + 2 * n + '}', l] };
          } },
          { id: 'e7b', level: 'BEG', outcome: 'AN3', make: function (r, sh) {
            return numP('Now simplify ' + t('\\dfrac{' + vt(sh.l, sh.n) + '}{' + vt(sh.l, sh.n) + '}') + ' a second way, without any exponent law: what is a nonzero quantity divided by itself?', 1, zdiag(), 'Any nonzero quantity divided by itself is ' + t('1') + ', so ' + t('\\frac{' + vt(sh.l, sh.n) + '}{' + vt(sh.l, sh.n) + '}=1') + '.', ['Think of ' + t('\\frac{5}{5}') + ' or ' + t('\\frac{12}{12}') + '.'], 'x^n/x^n = 1', ['0']);
          } },
          { id: 'e7c', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var l = sh.l;
            return P.mc(r, 'Why do (a) and (b) together force ' + t(l + '^{0}=1') + '?', [
              { html: 'They are the same expression worked out two ways, and one expression can’t have two different values — so ' + t(l + '^{0}') + ' must equal ' + t('1') + '.', right: true },
              { html: 'Because ' + t(l + '^{0}') + ' means ' + t(l) + ' multiplied by itself zero times, which is ' + t('0') + '.', why: 'That would give ' + t('0') + ', but (b) shows the value is ' + t('1') + '.' },
              { html: 'Because the exponents ' + t(sh.n) + ' and ' + t(sh.n) + ' are equal, so the answer is the exponent divided by itself.', why: 'The argument compares the two results, (a) ' + t(l + '^{0}') + ' and (b) ' + t('1') + ', not the exponents.' },
              { html: 'It is just a rule to memorize; (a) and (b) don’t prove anything.', why: 'They do: both describe the same quantity, so their results are equal.' }],
              '(a) gives ' + t(l + '^{0}') + ' and (b) gives ' + t('1') + ' for the <b>same</b> expression ' + t('\\frac{' + vt(l, sh.n) + '}{' + vt(l, sh.n) + '}') + '. One quantity has one value, so ' + t(l + '^{0}=1') + '.', ['Both answers describe the same fraction.'], 'why x^0 = 1');
          } }] },
      { num: '8', stem: '<i>(Why the base must be non-zero.)</i>', parts: [
        { id: 'e8', level: 'PRG', outcome: 'AN3', make: function (r) {
          var n = r.int(2, 9);
          return P.mc(r, 'Repeat the argument of question 7 with the base ' + t('0') + ': ' + t('\\dfrac{0^{' + n + '}}{0^{' + n + '}}') + '. Which step fails, and what does it mean for ' + t('0^{0}') + '?', [
            { html: t('\\frac{0^{' + n + '}}{0^{' + n + '}}=\\frac{0}{0}') + ', and dividing by ' + t('0') + ' is undefined — so the “divided by itself is 1” step fails, and ' + t('0^{0}') + ' is left undefined.', right: true },
            { html: 'The Quotient Law step fails, because ' + t(n + '-' + n) + ' is not ' + t('0') + '.', why: t(n + '-' + n + '=0') + ' is fine. The problem is dividing by ' + t('0^{' + n + '}=0') + '.' },
            { html: 'Nothing fails: ' + t('\\frac{0}{0}=1') + ', so ' + t('0^{0}=1') + '.', why: t('\\frac{0}{0}') + ' is undefined — you can’t divide by ' + t('0') + '.' },
            { html: 'Nothing fails: ' + t('\\frac{0}{0}=0') + ', so ' + t('0^{0}=0') + '.', why: t('\\frac{0}{0}') + ' is undefined — you can’t divide by ' + t('0') + '.' }],
            'With base ' + t('0') + ': ' + t('\\frac{0^{' + n + '}}{0^{' + n + '}}=\\frac{0}{0}') + '. Division by ' + t('0') + ' is undefined, so the step “a nonzero quantity divided by itself is ' + t('1') + '” never applies. The argument that gave ' + t('a^{0}=1') + ' doesn’t work for ' + t('a=0') + ', so ' + t('0^{0}') + ' is left undefined.', ['What is ' + t('0^{' + n + '}') + '? Can you divide by it?'], 'why 0^0 undefined');
        } }] },
      { num: '9', stem: 'State whether each claim is <b>true</b> or <b>false</b>, with the reason (or a counterexample).', parts: [
        { id: 'e9a', level: 'PRG', outcome: 'AN3', make: function (r) {
          var l = r.pick(['x', 'x', 'a', 'n', 't', 'y', 'm', 'p']), k = r.int(1, 12), sgn = r.pick(['-', '-', '+']), z = sgn === '-' ? k : -k;
          return P.mc(r, 'Claim: any expression raised to the exponent ' + t('0') + ' is equal to ' + t('1') + ' — so ' + t('(' + l + sgn + k + ')^{0}=1') + ' for <b>every</b> value of ' + t(l) + '.', [
            { html: '<b>False</b> — at ' + t(l + '=' + z) + ' the base is ' + t('0') + ', and ' + t('0^{0}') + ' is undefined.', right: true },
            { html: '<b>True</b> — the zero exponent law has no exceptions.', why: 'It has one: the base must not be ' + t('0') + '. Try ' + t(l + '=' + z) + '.' },
            { html: '<b>False</b> — ' + t('(' + l + sgn + k + ')^{0}=' + l + '^{0}' + sgn + k + '^{0}') + ', which is ' + (sgn === '-' ? t('0') : t('2')) + '.', why: 'An exponent doesn’t split over ' + t(sgn) + '; the whole bracket is the base.' },
            { html: '<b>True</b> — ' + t('(' + l + sgn + k + ')^{0}') + ' is always ' + t('1') + ' because ' + t(k + '^{0}=1') + '.', why: 'The base is the whole bracket ' + t(l + sgn + k) + ', and it can be ' + t('0') + '.' }],
            'False. The law ' + t('a^{0}=1') + ' needs ' + t('a\\neq 0') + '. At ' + t(l + '=' + z) + ' the base ' + t(l + sgn + k) + ' is ' + t('0') + ', and ' + t('0^{0}') + ' is undefined.', ['When could the base be zero?'], 'claim any expression^0 = 1');
        } },
        { id: 'e9b', level: 'EMG', outcome: 'AN3', make: function (r) {
          var l = r.pick(ONE);
          return P.mc(r, 'Claim: ' + t(l + '^{0}=1') + ' for every real number ' + t(l) + '.', [
            { html: '<b>False</b> — it fails at ' + t(l + '=0') + ', because ' + t('0^{0}') + ' is undefined.', right: true },
            { html: '<b>True</b> — any number to the power ' + t('0') + ' is ' + t('1') + '.', why: 'Any <b>nonzero</b> number. What about ' + t(l + '=0') + '?' },
            { html: '<b>False</b> — it fails for negative ' + t(l) + ', because then ' + t(l + '^{0}=-1') + '.', why: 'A negative base to the power ' + t('0') + ' is still ' + t('1') + ', e.g. ' + t('(-3)^{0}=1') + '.' },
            { html: '<b>False</b> — ' + t(l + '^{0}=' + l) + ', not ' + t('1') + '.', why: HZ }],
            'False: ' + t(l + '^{0}=1') + ' only for ' + t(l + '\\neq 0') + '. At ' + t(l + '=0') + ' we get ' + t('0^{0}') + ', which is undefined. (Negative bases are fine: ' + t('(-3)^{0}=1') + '.)', ['Is there one value where the law doesn’t apply?'], 'claim x^0 = 1 for all x');
        } },
        { id: 'e9c', level: 'EMG', outcome: 'AN3', make: function (r) {
          var l = r.pick(ONE), v = r.int(2, 9);
          return P.mc(r, 'Claim: ' + t('-' + l + '^{0}=(-' + l + ')^{0}') + ' for every ' + t(l + '\\neq 0') + '.', [
            { html: '<b>False</b> — e.g. at ' + t(l + '=' + v) + ': ' + t('-' + l + '^{0}=-1') + ' but ' + t('(-' + l + ')^{0}=1') + '.', right: true },
            { html: '<b>True</b> — both equal ' + t('1') + '.', why: t('-' + l + '^{0}') + ' means ' + t('-(' + l + '^{0})=-1') + '.' },
            { html: '<b>True</b> — both equal ' + t('-1') + '.', why: 'The brackets make ' + t('-' + l) + ' the base: ' + t('(-' + l + ')^{0}=1') + '.' },
            { html: '<b>False</b> — ' + t('-' + l + '^{0}=0') + ' but ' + t('(-' + l + ')^{0}=1') + '.', why: t('-' + l + '^{0}=-1') + ', not ' + t('0') + '.' }],
            'False. Without brackets the exponent is on ' + t(l) + ' only: ' + t('-' + l + '^{0}=-1') + '. With brackets the base is ' + t('-' + l) + ': ' + t('(-' + l + ')^{0}=1') + '. Counterexample: ' + t(l + '=' + v) + ' gives ' + t('-1\\neq 1') + '.', [HSG], 'claim -x^0 = (-x)^0');
        } },
        { id: 'e9d', level: 'EMG', outcome: 'AN3', make: function (r) {
          var l = r.pick(ONE), n = r.int(2, 9);
          return P.mc(r, 'Claim: ' + t('\\left(' + l + '^{0}\\right)^{' + n + '}=\\left(' + l + '^{' + n + '}\\right)^{0}') + ' for every ' + t(l + '\\neq 0') + '.', [
            { html: '<b>True</b> — both sides equal ' + t('1') + ': ' + t('1^{' + n + '}=1') + ' and ' + t('(' + l + '^{' + n + '})^{0}=1') + '.', right: true },
            { html: '<b>False</b> — the left side is ' + t('1') + ' but the right side is ' + t(l + '^{' + n + '}') + '.', why: 'A whole bracket to the power ' + t('0') + ' is ' + t('1') + '.' },
            { html: '<b>False</b> — the left side is ' + t(n) + ' but the right side is ' + t('1') + '.', why: t('1^{' + n + '}=1') + ', not ' + t(n) + '.' },
            { html: '<b>False</b> — the left side is ' + t('0') + '.', why: t(l + '^{0}=1') + ', not ' + t('0') + '.' }],
            'True. Left: ' + t('(' + l + '^{0})^{' + n + '}=1^{' + n + '}=1') + '. Right: ' + t('(' + l + '^{' + n + '})^{0}=1') + '. (Or by the power-of-a-power law both are ' + t(l + '^{0}') + '.)', ['Work out each side separately.'], 'claim (x^0)^n = (x^n)^0');
        } },
        { id: 'e9e', level: 'EMG', outcome: 'AN3', make: function (r) {
          var three = r.chance(0.4), ls = r.sample(['a', 'b', 'c', 'm', 'n', 'p', 'q', 'x', 'y', 'z'], 3), n = three ? 3 : 2, terms = ls.slice(0, n).map(function (x) { return x + '^{0}'; }).join('+');
          return P.mc(r, 'Claim: if ' + ls.slice(0, n).map(function (x) { return t(x + '\\neq 0'); }).join(' and ') + ', then ' + t(terms + '=' + n) + '.', [
            { html: '<b>True</b> — each power is ' + t('1') + ', and ' + n + ' ones add to ' + t(n) + '.', right: true },
            { html: '<b>False</b> — the sum is ' + t('0') + '.', why: HZ },
            { html: '<b>False</b> — the sum is ' + t('1') + ', because the zero exponent applies to the whole sum.', why: 'There are no brackets around the sum: each term has its own exponent ' + t('0') + '.' },
            { html: '<b>False</b> — you can’t add powers with different bases.', why: 'You can once each one is a number: each is ' + t('1') + '.' }],
            'True. Each nonzero base to the power ' + t('0') + ' is ' + t('1') + ', so the sum is ' + t(Array(n + 1).join('1+').slice(0, -1) + '=' + n) + '.', [HZ], 'claim a^0+b^0 = 2');
        } },
        { id: 'e9f', level: 'EMG', outcome: 'AN3', make: function (r) {
          var l = r.pick(ONE), n = r.int(1, 9);
          return P.mc(r, 'Claim: if ' + t(l + '\\neq 0') + ', then ' + t(l + '^{0}=' + vt(l, n) + '\\div ' + vt(l, n)) + '.', [
            { html: '<b>True</b> — ' + t(vt(l, n) + '\\div ' + vt(l, n) + '=' + l + '^{' + n + '-' + n + '}=' + l + '^{0}') + ', the Quotient Law derivation.', right: true },
            { html: '<b>False</b> — ' + t(vt(l, n) + '\\div ' + vt(l, n) + '=' + l + '^{1}') + '.', why: 'Quotient law: <b>subtract</b> the exponents, ' + t(n + '-' + n + '=0') + '.' },
            { html: '<b>False</b> — ' + t(vt(l, n) + '\\div ' + vt(l, n) + '=0') + '.', why: 'A nonzero quantity divided by itself is ' + t('1') + '.' },
            { html: '<b>False</b> — the left side is ' + t('0') + ' and the right side is ' + t('1') + '.', why: HZ }],
            'True. ' + t(vt(l, n) + '\\div ' + vt(l, n) + '=' + l + '^{' + n + '-' + n + '}=' + l + '^{0}') + ' — and it also equals ' + t('1') + ', which is exactly why ' + t(l + '^{0}=1') + '.', ['Use the Quotient Law on the right side.'], 'claim x^0 = x^n ÷ x^n');
        } }] },
      { num: '10', stem: '<i>(Work backwards.)</i> Determine the missing value of ' + t('n') + ' in each case. Assume every variable is non-zero.', parts: [
        { id: 'e10a', level: 'EMG', outcome: 'AN3', make: function (r) { var l = r.pick(['x', 'x', 'a', 'y', 'm', 'b']), m = r.int(2, 12); return numP(t('\\dfrac{' + vt(l, m) + '}{' + l + '^{n}}=1'), m, function (v) { return v === 0 ? { code: 'zero-power', hint: 'The answer is ' + t('1=' + l + '^{0}') + ', so the exponents must cancel: ' + t(m + '-n=0') + '.' } : null; }, 'For the quotient to be ' + t('1=' + l + '^{0}') + ': ' + t(m + '-n=0') + ', so ' + t('n=' + m) + '. (Equal powers divide to ' + t('1') + '.)', ['When is a quotient of powers equal to ' + t('1') + '?'], 'x^m/x^n = 1', ['0', String(m + 1)]); } },
        { id: 'e10b', level: 'PRG', outcome: 'AN3', make: function (r) { var l = r.pick(['x', 'x', 'a', 'y', 'm', 'b']), a = r.int(2, 5), b = r.int(2, 5), m = a * b; return numP(t('\\dfrac{(' + vt(l, a) + ')^{' + b + '}}{' + l + '^{n}}=1'), m, function (v) { return v === a + b ? { code: 'add-power', hint: 'Power of a power: <b>multiply</b> the exponents, ' + t(a + '\\times ' + b) + '.' } : null; }, 'Top: ' + t('(' + vt(l, a) + ')^{' + b + '}=' + l + '^{' + m + '}') + '. For the quotient to be ' + t('1') + ', ' + t('n=' + m) + '.', ['Simplify the top first.'], '(x^a)^b/x^n = 1', [String(a + b)]); } },
        { id: 'e10c', level: 'ADV', outcome: 'AN3', make: function (r) { var l = r.pick(['x', 'x', 'a', 'y', 'm', 'b']), c = r.pick([2, 2, 3, 4]), n = r.int(2, 6), m = c * n; return numP(t('\\dfrac{' + l + '^{' + c + 'n}}{' + vt(l, m) + '}=1'), n, function (v) { return v === m ? { code: 'u2l5-no-divide', hint: 'The top exponent is ' + t(c + 'n') + ', so ' + t(c + 'n=' + m) + ' — divide by ' + t(c) + '.' } : v === m - c ? { code: 'u2l5-no-divide', hint: 'Solve ' + t(c + 'n=' + m) + ' by dividing by ' + t(c) + '.' } : null; }, 'For the quotient to be ' + t('1') + ', the exponents must match: ' + t(c + 'n=' + m) + ', so ' + t('n=' + n) + '.', ['The exponents on the top and the bottom must be equal.'], 'x^{cn}/x^m = 1', [String(m)]); } },
        { id: 'e10d', level: 'ADV', outcome: 'AN3', make: function (r) { var l = r.pick(['b', 'b', 'x', 'a', 'y', 'm']), d = r.int(2, 6), q = r.int(2, 6), A = d * q, m = r.int(2, 9); return numP(t('\\dfrac{' + A + l + '^{n}}{' + d + vt(l, m) + '}=' + q), m, function (v) { return v === 0 ? { code: 'zero-power', hint: 'The answer ' + t(q) + ' has no ' + t(l) + ', so ' + t(l) + ' must cancel: ' + t('n-' + m + '=0') + '.' } : v === q ? { code: 'value', hint: t(q) + ' is the coefficient (' + t(A + '\\div ' + d) + '). Now look at the exponents of ' + t(l) + '.' } : null; }, 'The coefficients already give ' + t(A + '\\div ' + d + '=' + q) + '. The answer has no ' + t(l) + ', so ' + t(l + '^{n-' + m + '}=' + l + '^{0}') + ': ' + t('n=' + m) + '.', ['The coefficients take care of the number. What must happen to ' + t(l) + '?'], 'Ab^n/db^m = q', ['0', String(q)]); } }] },
      /* ================= Extra C ================= */
      { num: '11', section: 'Part C — Zero exponents inside a chain', stem: 'Evaluate each expression. Assume every variable is non-zero.', parts: [
        { id: 'e11a', level: 'BEG', outcome: 'AN3', make: function (r) { var n = r.int(2, 5), bs = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], n), tx = bs.map(function (b) { return b + '^{0}'; }).join('+'); return numP(t(tx), n, zdiag(function (v) { return v === bs.reduce(function (s, b) { return s + b; }, 0) ? { code: 'zero-base', hint: HZ } : v === 1 ? { code: 'value', hint: 'Each term is ' + t('1') + '; add them all.' } : null; }), t(tx + '=' + Array(n + 1).join('1+').slice(0, -1) + '=' + n) + '.', [HZ], 'sum of b^0', ['0', '1']); } },
        { id: 'e11b', level: 'BEG', outcome: 'AN3', make: function (r) { var ls = L2(r), a = r.int(2, 9), b = r.int(2, 9), p = r.int(2, 5); return numP(t('\\left(' + a + vt(ls[0], p) + '\\right)^{0}+(' + b + ls[1] + ')^{0}'), 2, zdiag(function (v) { return v === a + b ? { code: 'zero-coef', hint: 'Each whole bracket is the base, so each is ' + t('1') + '.' } : v === 1 ? { code: 'value', hint: 'Each bracket is ' + t('1') + ', and there are two of them.' } : null; }), 'Each bracket is a nonzero base to the power ' + t('0') + ': ' + t('1+1=2') + '.', [HZ], '(ax^p)^0+(by)^0', ['0', '1', a + b]); } },
        { id: 'e11c', level: 'EMG', outcome: 'AN3', make: function (r) { var bs = r.sample([2, 3, 4, 5, 6, 7, 8, 9], 3), s1 = r.pick(['+', '-']), s2 = r.pick(['+', '-']), V = 1 + (s1 === '+' ? 1 : -1) + (s2 === '+' ? 1 : -1), tx = bs[0] + '^{0}' + s1 + bs[1] + '^{0}' + s2 + '(-' + bs[2] + ')^{0}'; return numP(t(tx), V, zdiag(function (v) { return v === V - (s2 === '+' ? 2 : -2) ? { code: 'u2l5-neg-in', hint: t('(-' + bs[2] + ')^{0}=1') + ': the brackets make ' + t('-' + bs[2]) + ' the base.' } : null; }), t(tx + '=1' + s1 + '1' + s2 + '1=' + V) + '.', [HZ, HSG], 'signed sum of b^0', [V + 2, 0].filter(function (x) { return x !== V; })); } },
        { id: 'e11d', level: 'EMG', outcome: 'AN3', make: function (r) { var b = r.int(2, 10), n = b <= 4 ? r.pick([2, 3]) : 2, V = 0, parts = []; for (var i = 0; i <= n; i++) { V += Math.pow(b, i); parts.push(b + '^{' + i + '}'); } if (r.chance(0.4)) parts.reverse(); return numP(t(parts.join('+')), V, zdiag(function (v) { return v === V - 1 ? { code: 'zero-power', hint: t(b + '^{0}=1') + ', not ' + t('0') + '.' } : v === V - 1 + b ? { code: 'zero-base', hint: t(b + '^{0}=1') + ', not ' + t(b) + '.' } : null; }), t(parts.join('+') + '=' + parts.map(function (x) { return F(Math.pow(b, Number(/\^\{(\d+)\}/.exec(x)[1]))); }).join('+') + '=' + V) + '.', [HZ], 'b^0+b^1+b^2', [V - 1, V - 1 + b]); } }] },
      { num: '12', stem: 'Simplify completely. Assume every variable is non-zero.', parts: [
        { id: 'e12a', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), c = r.int(2, 4), d = r.pick([2, 3, 4]), p = r.int(2, 5), q = r.int(2, 5); return chain(Dv(Mul([Pw(Mn(k, [[l, p]]), 0), Mn(c * d, [[l, q]])], '\\cdot '), Mn(d, [[l, q]])), { wrongs: [W(String(c * k), 'zero-coef', 'The bracket ' + t('(' + k + vt(l, p) + ')^{0}') + ' is ' + t('1') + ' — the ' + t(k) + ' too.')], hints: [HO, HZ], text: '(kx^p)^0·Ax^q/dx^q' }); } },
        { id: 'e12b', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), c = r.int(2, 4), d = r.pick([2, 3, 4]), p = r.int(2, 5), q = r.int(2, 5), s = r.int(1, q - 1); return chain(Dv(Mul([Pw(Mn(k, [[l, p]]), 0), Mn(c * d, [[l, q]])], '\\cdot '), Mn(d, [[l, s]])), { wrongs: [W(posTex(M(c * k, [[l, q - s]])), 'zero-coef', 'The bracket ' + t('(' + k + vt(l, p) + ')^{0}') + ' is ' + t('1') + ' — the ' + t(k) + ' too.')], hints: [HO, HZ], text: '(ka^p)^0·Aa^q/da^s' }); } },
        { id: 'e12c', level: 'PRG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 5), n = k <= 3 ? r.pick([2, 2, 3]) : 2, q = r.int(2, 6); return chain(Mul([Pw(Mn(k, [[l, 0]]), n), Mn(1, [[l, q]])]), { wrongs: [W(vt(l, q), 'u2l5-coef-zero', 'The ' + t('0') + ' is on ' + t(l) + ' only: inside, ' + t(k + l + '^{0}=' + k) + '.')], hints: [HO, 'Inside the bracket first: what is ' + t(k + l + '^{0}') + '?'], text: '(km^0)^n × m^q' }); } }] },
      { num: '13', stem: 'Each expression below collapses to a zero exponent. Simplify the numerator and denominator first, then finish. Assume every variable is non-zero.', parts: [
        { id: 'e13a', level: 'BEG', outcome: 'AN3', make: function (r) { var ls = L2(r), p = r.int(2, 9), q = r.int(2, 9); return chain(Dv(Mn(1, [[ls[0], p], [ls[1], q]]), Mn(1, [[ls[0], p], [ls[1], q]])), { wrongs: [W('0', 'zero-as-zero', 'A nonzero quantity divided by itself is ' + t('1') + '.')], hints: [HZ], text: 'x^p y^q / x^p y^q' }); } },
        { id: 'e13b', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.pick([2, 2, 3, 4, 5]), n = k <= 3 ? r.pick([2, 3]) : 2; return chain(Dv(Pw(Mn(k, [[l, 1]]), n), Mn(Math.pow(k, n), [[l, n]])), { wrongs: [W('0', 'zero-as-zero', 'Equal powers divide to ' + t('1') + '.')], hints: [HW_, HZ], text: '(kx)^n / k^n x^n' }); } },
        { id: 'e13c', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.pick([2, 3, 3, 4, 5]), p = r.int(2, 4); return chain(Dv(Pw(Mn(k, [[ls[0], p], [ls[1], 1]]), 2), Mn(k * k, [[ls[0], 2 * p], [ls[1], 2]])), { wrongs: [W('0', 'zero-as-zero', 'Equal powers divide to ' + t('1') + '.')], hints: [HW_, HZ], text: '(ka^p b)^2 / k²a^{2p}b^2' }); } }] },
      { num: '14', stem: 'Simplify completely. Assume every variable is non-zero.', parts: [
        { id: 'e14a', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.pick([2, 2, 3]), d = k === 2 ? r.pick([2, 4]) : r.pick([3, 9]), p = r.int(2, 3); return chain(Dv(Pw(Mn(k, [[ls[0], p], [ls[1], 0]]), 3), Mn(d, [[ls[0], 3 * p]])), { hints: [HO, HW_], text: '(kx^p y^0)^3 / dx^{3p}' }); } },
        { id: 'e14b', level: 'PRG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), c = r.pick([2, 2, 3]), d = c === 2 ? r.pick([2, 4]) : r.pick([3, 9]), p = r.int(2, 5), q = r.int(2, 3), s = r.int(1, 3 * q - 1); return chain(Dv(Mul([Pw(Mn(k, [[l, p]]), 0), Pw(Mn(c, [[l, q]]), 3)], ''), Mn(d, [[l, s]])), { hints: [HO, HW_], text: '(kc^p)^0(2c^q)^3/dc^s' }); } },
        { id: 'e14c', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r), d = r.int(2, 9), q = r.int(2, 5), p = r.int(2, 9); return chain(Dv(Mn(d * q, [[ls[0], p], [ls[1], 0]]), Mn(d, [[ls[0], p]])), { hints: [HO, HZ], text: 'Ap^n q^0/dp^n' }); } }] },
      { num: '15', stem: 'Simplify completely. Assume every variable is non-zero.', parts: [
        { id: 'e15a', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), a = r.int(2, 9), b = r.int(2, 9), c = r.int(2, 9), p = r.int(2, 4), q = r.int(2, 4); return numP(t('\\dfrac{\\left(' + a + vt(ls[0], p) + vt(ls[1], q) + '\\right)^{0}+(' + b + ls[0] + ')^{0}}{(' + c + ls[1] + ')^{0}}'), 2, zdiag(function (v) { return v === 1 ? { code: 'value', hint: 'The top is ' + t('1+1') + '.' } : null; }), 'Each bracket to the power ' + t('0') + ' is ' + t('1') + ': ' + t('\\frac{1+1}{1}=2') + '.', [HZ], '((..)^0+(..)^0)/(..)^0', ['1', '0']); } },
        { id: 'e15b', level: 'PRG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), c = r.int(2, 5), p = r.int(2, 5), n = c <= 3 ? r.pick([2, 2, 3]) : 2, V = Math.pow(1 + c, n); return numP(t('\\left[\\left(' + k + vt(l, p) + '\\right)^{0}+' + c + l + '^{0}\\right]^{' + n + '}'), V, zdiag(function (v) { return v === Math.pow(2, n) ? { code: 'u2l5-coef-zero', hint: 'In ' + t(c + l + '^{0}') + ' the ' + t('0') + ' is on ' + t(l) + ' only, so it is ' + t(c) + '.' } : v === 1 + Math.pow(c, n) ? { code: 'split-sum', hint: 'Add inside the bracket first, then raise the sum to the power ' + t(n) + '.' } : v === Math.pow(k + c, n) ? { code: 'zero-coef', hint: 'The whole bracket ' + t('(' + k + vt(l, p) + ')') + ' is the base, so it is ' + t('1') + '.' } : null; }), 'Inside: ' + t('(' + k + vt(l, p) + ')^{0}=1') + ' and ' + t(c + l + '^{0}=' + c) + ', so the bracket is ' + t('1+' + c + '=' + (1 + c)) + '.<br>Then ' + t((1 + c) + '^{' + n + '}=' + V) + '.', [HWH, 'Work out the inside of the square brackets completely before applying the outside power.'], '[(..)^0+cx^0]^n', [Math.pow(2, n), 1 + Math.pow(c, n)]); } }] },
      /* ================= Extra D ================= */
      { num: '16', section: 'Part D — Applications, reasoning, and stretch', stem: function (sh) { return 'A colony of bacteria is modelled by ' + t('P=' + F(sh.N) + '\\cdot ' + sh.b + '^{t}') + ', where ' + t('P') + ' is the population and ' + t('t') + ' is the time in ' + sh.u + ' since the colony was first measured.'; },
        shared: function (r) { var b = r.pick([2, 2, 3]); return { N: r.pick([200, 300, 400, 500, 500, 600, 800, 1000, 1200, 1500, 2500]), b: b, T: b === 2 ? r.int(2, 4) : r.int(2, 3), u: r.pick(['hours', 'hours', 'days']) }; },
        parts: [
          { id: 'e16a', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return numP('Determine ' + t('P') + ' when ' + t('t=0') + '.', sh.N, zdiag(function (v) { return v === sh.N * sh.b ? { code: 'zero-base', hint: t(sh.b + '^{0}=1') + ', not ' + t(sh.b) + '.' } : null; }), t('P=' + F(sh.N) + '\\cdot ' + sh.b + '^{0}=' + F(sh.N) + '\\times 1=' + F(sh.N)) + '.', [HZ], 'P at t=0', ['0', sh.N * sh.b]); } },
          { id: 'e16b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'Why does that value make sense for this situation?', [
              { html: t('t=0') + ' is the moment of the first measurement: no ' + (sh.b === 2 ? 'doubling' : 'tripling') + ' has happened yet, so ' + t('P') + ' should be the starting population, ' + t(F(sh.N)) + '.', right: true },
              { html: 'At ' + t('t=0') + ' there are no bacteria yet, so ' + t('P') + ' should be ' + t('0') + '.', why: 'At the first measurement the colony already exists — that is the starting population.' },
              { html: 'At ' + t('t=0') + ' the colony has already ' + (sh.b === 2 ? 'doubled' : 'tripled') + ' once.', why: 'No time has passed at ' + t('t=0') + ', so no growth has happened yet.' },
              { html: 'It doesn’t make sense: the model fails at ' + t('t=0') + ' because ' + t(sh.b + '^{0}') + ' is undefined.', why: t(sh.b + '^{0}=1') + ' is defined — only ' + t('0^{0}') + ' is undefined.' }],
              'At ' + t('t=0') + ' no time has passed, so the population is the starting value: ' + t(F(sh.N) + '\\cdot ' + sh.b + '^{0}=' + F(sh.N)) + '. The zero exponent gives exactly that.', ['What does ' + t('t=0') + ' mean in the story?'], 'why P(0) makes sense');
          } },
          { id: 'e16c', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var f = Math.pow(sh.b, sh.T), PT = sh.N * f;
            var p = P.fields('Determine ' + t('P') + ' when ' + t('t=' + sh.T) + ', and state how many times larger it is than the population at ' + t('t=0') + '.', [{ name: 'P', label: t('P') + ' at ' + t('t=' + sh.T), before: t('P=') }, { name: 'Times', label: 'How many times larger', after: ' times' }],
              [K.number(PT, function (v) { return v === sh.N * sh.b * sh.T ? { code: 'coef-times-n', hint: t(sh.b + '^{' + sh.T + '}') + ' means ' + t(sh.b) + ' multiplied by itself ' + sh.T + ' times.' } : null; }), K.number(f, function (v) { return v === PT ? { code: 'u2l5-times', hint: 'That’s the new population. Divide it by the starting population ' + t(F(sh.N)) + '.' } : v === sh.b * sh.T ? { code: 'coef-times-n', hint: t(sh.b + '^{' + sh.T + '}=' + f) + '.' } : null; })],
              [String(PT), String(f)], t('P=' + F(PT)) + ', ' + t(f) + ' times larger', t('P=' + F(sh.N) + '\\cdot ' + sh.b + '^{' + sh.T + '}=' + F(sh.N) + '\\times ' + f + '=' + F(PT)) + '.<br>' + t(F(PT) + '\\div ' + F(sh.N) + '=' + f) + ', so it is ' + t(f) + ' times the starting population (that is ' + t(sh.b + '^{' + sh.T + '}') + ').', ['Work out ' + t(sh.b + '^{' + sh.T + '}') + ' first.'], 'P at t and growth factor');
            p.bad = [[String(PT), String(PT)], [String(PT + 1), String(f)]];
            return p;
          } }] },
      { num: '17', stem: function (sh) { var tm = sh.sw ? [sh.b + '^{1}', sh.b + '^{0}'] : [sh.b + '^{0}', sh.b + '^{1}'], st = sh.sw ? [sh.b + '^{' + sh.n + '}', sh.b + '^{0}'] : [sh.b + '^{0}', sh.b + '^{' + sh.n + '}']; return 'Evaluate ' + t('\\left(' + tm.join('+') + '\\right)^{' + sh.n + '}') + '. A student claimed the answer was ' + t(st.join('+') + '=' + F(1 + Math.pow(sh.b, sh.n))) + ' by “raising each term to the power ' + sh.n + '.”'; },
        shared: function (r) { var b = r.int(2, 12); return { b: b, n: b <= 4 ? r.pick([2, 2, 3]) : 2, sw: r.chance(0.4) }; },
        parts: [
          { id: 'e17a', level: 'EMG', outcome: 'AN3', make: function (r, sh) { var V = Math.pow(1 + sh.b, sh.n); return numP('What is the correct value?', V, zdiag(function (v) { return v === 1 + Math.pow(sh.b, sh.n) ? { code: 'split-sum', hint: 'That’s the student’s answer. Add inside the bracket first: ' + t(sh.b + '^{0}+' + sh.b + '^{1}=1+' + sh.b + '=' + (1 + sh.b)) + '.' } : v === Math.pow(sh.b, sh.n) ? { code: 'zero-power', hint: t(sh.b + '^{0}=1') + ', not ' + t('0') + '.' } : null; }), t('\\left(' + sh.b + '^{0}+' + sh.b + '^{1}\\right)^{' + sh.n + '}=(1+' + sh.b + ')^{' + sh.n + '}=' + (1 + sh.b) + '^{' + sh.n + '}=' + F(V)) + '.', ['Inside the brackets first.'], '(b^0+b^1)^n', [1 + Math.pow(sh.b, sh.n)]); } },
          { id: 'e17b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'Why is the student’s method wrong?', [
              { html: 'The bracket holds a <b>sum</b>, not a product. The power-of-a-product law ' + t('(ab)^{n}=a^{n}b^{n}') + ' doesn’t apply to ' + t('(a+b)^{n}') + '.', right: true },
              { html: 'The student should have multiplied the exponents ' + t('0') + ' and ' + t('1') + ' by ' + t(sh.n) + ' and then added, which gives the same answer.', why: 'That is what the student did. It doesn’t work for a sum.' },
              { html: t(sh.b + '^{0}') + ' should be ' + t('0') + ', so the answer is ' + t(Math.pow(sh.b, sh.n)) + '.', why: HZ },
              { html: 'Nothing is wrong: exponents always distribute over brackets.', why: 'They distribute over a product, never over a sum. Check: ' + t(F(Math.pow(1 + sh.b, sh.n)) + '\\neq ' + F(1 + Math.pow(sh.b, sh.n))) + '.' }],
              'Exponents distribute over multiplication, not addition. ' + t('\\left(' + sh.b + '^{0}+' + sh.b + '^{1}\\right)^{' + sh.n + '}=' + (1 + sh.b) + '^{' + sh.n + '}=' + F(Math.pow(1 + sh.b, sh.n))) + ', and ' + t(F(Math.pow(1 + sh.b, sh.n)) + '\\neq ' + F(1 + Math.pow(sh.b, sh.n))) + '.', ['Is the bracket a product or a sum?'], 'why not split sum');
          } }] },
      { num: '18', stem: '<i>(Stretch)</i>', parts: [
        { id: 'e18', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.pick([2, 2, 3]), p = r.int(2, 5), q = r.int(2, 5); return chain(Dv(Mul([Pw(Mn(1, [[ls[0], p], [ls[1], q]]), 0), Pw(Mn(k, [[ls[0], 1], [ls[1], 1]]), 2)], ''), Mn(k * k, [[ls[0], 2], [ls[1], 2]])), { prompt: 'Simplify ' + t(tex(Dv(Mul([Pw(Mn(1, [[ls[0], p], [ls[1], q]]), 0), Pw(Mn(k, [[ls[0], 1], [ls[1], 1]]), 2)], ''), Mn(k * k, [[ls[0], 2], [ls[1], 2]])))) + ', where ' + t(ls[0] + '\\neq 0') + ' and ' + t(ls[1] + '\\neq 0') + ', and state the single number it equals.', hints: [HO, HW_], text: '(a^p b^q)^0(kab)^2/k²a²b²' }); } }] },
      { num: '19', stem: '<i>(Stretch)</i>', parts: [
        { id: 'e19', level: 'ADV', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.int(2, 9), c = r.pick([2, 2, 3]), p = r.int(2, 4), s = r.int(1, 4), q = s + r.int(1, 2); return chain(Pw(Dv(Mul([Pw(Mn(k, [[l, p]]), 0), Mn(c, [[l, q + s]])], '\\cdot '), Mn(1, [[l, s]])), 2), { hints: [HO, 'Simplify inside the big bracket completely, then square.'], text: '[(kx^p)^0·cx^{q+s}/x^s]^2' }); } }] },
      { num: '20', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e20', level: 'EMG', outcome: 'AN3', make: function (r) {
          var l = L1(r), k = r.int(2, 9), n = r.int(2, 8);
          return P.mc(r, 'If ' + t(l + '\\neq 0') + ', which expression does <b>not</b> equal ' + t('1') + '?', [{ html: t('(' + k + l + ')^{0}'), why: 'The whole product is the base: this is ' + t('1') + '.' }, { html: t('\\dfrac{' + vt(l, n) + '}{' + vt(l, n) + '}'), why: 'Equal powers divide to ' + t('1') + '.' }, { html: t(k + l + '^{0}'), right: true }, { html: t('\\left(' + l + '^{0}\\right)^{' + k + '}'), why: t('1^{' + k + '}=1') + '.' }],
            t(k + l + '^{0}=' + k + '\\times 1=' + k) + ', not ' + t('1') + '. The others are all ' + t('1') + '.', [HWH], 'MC which is not 1', true);
        } }] },
      { num: '21', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e21', level: 'EMG', outcome: 'AN3', make: function (r) {
          var l = L1(r), k = r.int(2, 9), c = r.int(2, 9), V = 1 + k;
          var vals = [1, k, V, 2 * k].filter(function (v, i, arr) { return arr.indexOf(v) === i; });
          while (vals.length < 4) vals.push(vals[vals.length - 1] + 1);
          var opts = vals.map(function (v) { return v === V ? { html: t(v), right: true } : { html: t(v), why: v === 2 * k ? 'Only ' + t(k + l + '^{0}') + ' keeps its ' + t(k) + '; ' + t('(' + k + l + ')^{0}=1') + '.' : v === 1 ? 'The top is ' + t('1+' + k) + '.' : 'Simplify each part: ' + t('(' + k + l + ')^{0}=1') + ', ' + t(k + l + '^{0}=' + k) + ', ' + t('(' + c + l + ')^{0}=1') + '.' }; });
          return P.mc(r, 'For ' + t(l + '\\neq 0') + ', the value of ' + t('\\dfrac{(' + k + l + ')^{0}+' + k + l + '^{0}}{(' + c + l + ')^{0}}') + ' is', opts, t('\\frac{(' + k + l + ')^{0}+' + k + l + '^{0}}{(' + c + l + ')^{0}}=\\frac{1+' + k + '}{1}=' + V) + '.', [HWH], 'MC ((kx)^0+kx^0)/(cx)^0');
        } }] },
      { num: '22', stem: '<i>(Stretch — reasoning about the base.)</i> Remember that ' + t('a^{0}=1') + ' only when ' + t('a\\neq 0') + '.', parts: [
        { id: 'e22a', level: 'ADV', outcome: 'AN3', make: function (r) {
          var l = r.pick(['x', 'x', 'a', 't', 'n']), k = r.int(1, 12), sgn = r.pick(['-', '-', '+']), z = sgn === '-' ? k : -k;
          return numP(t('(' + l + sgn + k + ')^{0}=1') + ' for every real value of ' + t(l) + ' except one. For which value of ' + t(l) + ' does the expression fail to have a meaning?', z, function (v) { return v === -z ? { code: 'sign', hint: 'Find the value that makes the base ' + t(l + sgn + k) + ' equal to ' + t('0') + '. Check yours: ' + t(v + sgn + k) + '.' } : v === 0 ? { code: 'u2l5-not-excluded', hint: 'At ' + t(l + '=0') + ' the base is ' + t(sgn === '-' ? '-' + k : String(k)) + ', which isn’t zero. Which value makes the <b>base</b> zero?' } : v === 1 ? { code: 'value', hint: 'Which value of ' + t(l) + ' makes the base ' + t(l + sgn + k) + ' equal to ' + t('0') + '?' } : null; },
            'The law needs the base to be nonzero. The base ' + t(l + sgn + k) + ' is ' + t('0') + ' when ' + t(l + '=' + z) + ', and then the expression is ' + t('0^{0}') + ', which is undefined. For every other value, ' + t('(' + l + sgn + k + ')^{0}=1') + '.', ['When is the base ' + t(l + sgn + k) + ' equal to ' + t('0') + '?'], 'excluded value (x-k)^0', [-z, 0]);
        } },
        { id: 'e22b', level: 'MAS', outcome: 'AN3', make: function (r) {
          var l = r.pick(['x', 'x', 'a', 't', 'n', 'y']), a = r.int(2, 9), a2 = a * a;
          return { prompt: t('(' + l + '^{2}-' + a2 + ')^{0}=1') + ' for every real ' + t(l) + ' except some values. Which values of ' + t(l) + ' must be excluded? List them all.', input: { type: 'list' }, key: [-a, a], answer: t(-a + ',\\ ' + a),
            check: function (resp) {
              if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
              var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + t(resp[i]) + ' more than once.'); seen[resp[i]] = 1; }
              var bad = resp.filter(function (v) { return v !== a && v !== -a; });
              if (bad.length) { var v = bad[0]; if (v === a2 || v === -a2) return wrong('u2l5-not-excluded', 'At ' + t(l + '=' + v) + ' the base is ' + t(v + '^{2}-' + a2) + ', not ' + t('0') + '. You need ' + t(l + '^{2}=' + a2) + '.'); return wrong('u2l5-not-excluded', 'At ' + t(l + '=' + v) + ' the base is ' + t(F(v * v - a2)) + ', not ' + t('0') + ', so that value is allowed.'); }
              if (resp.length < 2) return wrong('u2l5-one-root', 'There is another value: ' + t(l + '^{2}=' + a2) + ' has two solutions — a negative number squared is positive too.');
              return ok();
            }, solution: 'The base ' + t(l + '^{2}-' + a2) + ' must not be ' + t('0') + '. It is ' + t('0') + ' when ' + t(l + '^{2}=' + a2) + ', that is ' + t(l + '=' + a) + ' or ' + t(l + '=-' + a) + ' (both square to ' + t(a2) + '). Those two values must be excluded; for every other real ' + t(l) + ', ' + t('(' + l + '^{2}-' + a2 + ')^{0}=1') + '.',
            hints: ['Which values make the base ' + t(l + '^{2}-' + a2) + ' equal to ' + t('0') + '?', 'Which numbers square to ' + t(a2) + '? There are two.'], text: 'excluded values (x²-a²)^0', bad: [[a], [a2], [-a2, a2]] };
        } }] }
    ]
  });
})(window);
