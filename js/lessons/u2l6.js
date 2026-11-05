/* Math 15 · Unit 2 · Lesson 6 — Negative Exponents (AN3)
 * Assignment 6 (u2_L06.tex, Questions 1–13) and the whole Lesson 6 Extra Practice (u2_EP06.tex, Questions 1–22).
 * Every part is a generator: same structure, idea and difficulty as the booklet (the booklet's numbers are among the
 * possible values), new numbers from the seed. Simplifications use the same expression-tree engine as Lessons 4 and 5
 * (key, worked solution and typical wrong answers all come from the tree, with negative exponents shown in the working
 * and moved across the fraction bar at the end); exact values use the fraction box. Answers are in the booklet's final
 * form: positive exponents only; a correct value with a negative exponent left in is a "form" nudge.
 * Diagnoses for this lesson's traps: a negative exponent read as a negative sign (opposite instead of reciprocal), base
 * times exponent (6⁻² = −12), the coefficient moved across the bar, −3⁻² read as (−3)⁻², a fraction not flipped.
 * Conversions (no free-text explaining): "explain the mistake / what went wrong / conclusion" → multiple choice whose
 * options are reasons; "true or false, if false correct it" → one multiple choice (True, or False with the correct
 * right side); "show / substitute / check" → number and expression boxes; "all possible values" → a list of numbers;
 * "arrange from least to greatest" → an ordering (equal values may go in either order).
 * Math 15 levels: LIM BEG EMG PRG ADV MAS. Mastery: Extra 22(a) (all solutions of x⁻² = 1/9). Outcome AN3 throughout. */
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
    'neg-base': 'Applied the exponent to the minus sign (−aⁿ read as (−a)ⁿ)', 'even-neg': 'Kept a negative sign under an even power', 'odd-neg': 'Dropped the negative sign under an odd power',
    'zero-power': 'Took a zero exponent to give 0', 'sign-exp': 'Sign slip when combining exponents', 'no-flip': 'Raised the fraction to the power without flipping it',
    'no-power': 'Flipped the fraction but didn’t raise it to the power', 'one-exp': 'Forgot that a bare base has exponent 1', 'base-times-exp': 'Multiplied the base by the exponent',
    'flip-back': 'Didn’t move the negative power up from the denominator', 'split-sum': 'Split a power over a sum', 'not-flipped': 'Didn’t take the reciprocal',
    'u2l6-pos-sign': 'Wrong sign for the unknown exponent (gave n instead of −n)', 'u2l6-one-root': 'Gave only one of the two solutions',
    'u2l6-not-root': 'Listed a value that is not a solution', 'u2l6-unflipped-den': 'Made the exponent positive but left the factor on the same side'
  });
  HW.addPartial({ 'u2l6-pos-sign': 'b', 'u2l6-one-root': 's', 'u2l6-not-root': 'n', 'u2l6-unflipped-den': 'b' });

  /* ======================= shared exponent engine (same in u2l4–u2l6) ======================= */
  function R(p, q) { return ex.norm(p, q == null ? 1 : q); }
  function rmul(a, b) { return R(a[0] * b[0], a[1] * b[1]); }
  function rinv(a) { return R(a[1], a[0]); }
  function rpow(a, n) { if (n < 0) { a = rinv(a); n = -n; } return R(Math.pow(a[0], n), Math.pow(a[1], n)); }
  function near(x, y) { return ex.eq(x, y, 1e-9); }
  function frTex(a) { return a[1] === 1 ? F(a[0]) : (a[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(a[0])) + '}{' + F(a[1]) + '}'; }
  function pickWhere(gen, test) { for (var i = 0; i < 800; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u2l6: no value found'); }
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
  var HN = 'A negative exponent means <b>reciprocal</b>: ' + t('a^{-n}=\\frac{1}{a^{n}}') + ' and ' + t('\\frac{1}{a^{-n}}=a^{n}') + '. It never makes the value negative.';
  var HM = 'Move each factor with a negative exponent to the other side of the fraction bar and make its exponent positive. Everything else stays where it is.';
  var HONLY = 'An exponent belongs only to the base it touches: in ' + t('6x^{-3}') + ' the ' + t('-3') + ' is on ' + t('x') + ' only, so the ' + t('6') + ' stays on top; in ' + t('(2x)^{-3}') + ' it is on the ' + t('2') + ' and the ' + t('x') + '.';
  var HL = 'Use the product, quotient and power laws as usual (negative exponents follow the same rules), then move every factor with a negative exponent across the fraction bar.';
  var HS = 'Decide the sign first: is the minus sign inside the bracket (part of the base) or in front (applied last)? A negative base to an even power is positive, to an odd power negative.';
  var HE = 'Rewrite with a positive exponent first, then work out the power and write the reciprocal.';
  var HF = 'A fraction to a negative power: flip it and make the exponent positive, ' + t('\\left(\\frac{a}{b}\\right)^{-n}=\\left(\\frac{b}{a}\\right)^{n}') + '.';
  var HW_ = 'Power law: every factor in the bracket gets the outside power, and the exponents multiply — watch the signs: ' + t('(x^{-2})^{-3}=x^{6}') + '.';
  var HO = HL;
  var ONE = ['x', 'x', 'a', 'b', 'm', 'y', 'p', 'n', 't', 'k', 'c', 'd', 'w', 'z', 'q', 'r', 's', 'h', 'g', 'u', 'v'];
  var PAIRS = [['x', 'y'], ['x', 'y'], ['a', 'b'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['r', 's'], ['c', 'd'], ['u', 'v'], ['x', 'z'], ['h', 'k']];
  function L1(r) { return r.pick(ONE); }
  function L2(r) { return r.pick(PAIRS); }
  function W(tex, code, hint) { return { tex: tex, code: code, hint: hint }; }
  function nchain(tree, o) { o = o || {}; o.neg = true; if (!o.hints) o.hints = [HL, o.hint || HM]; return chain(tree, o); }
  /* x^{-n} (or a mono) → positive exponents */
  function negVar(r, x, n) {
    return X(t(vt(x, -n)), M(1, [[x, -n]]), [W('-' + vt(x, n), 'opposite', HN), W(vt(x, n), 'not-flipped', 'Make the exponent positive <b>and</b> take the reciprocal: ' + t(vt(x, -n) + '=\\frac{1}{' + vt(x, n) + '}') + '.')], t(vt(x, -n) + '=\\frac{1}{' + vt(x, n) + '}') + ': a negative exponent means the reciprocal of the positive power.', [HN, 'Write it as ' + t('1') + ' over the power with the positive exponent.'], x + '^-' + n);
  }
  /* -b^{-n}, (-b)^{-n}: kind 'neg-out' | 'neg-in' (10C pattern) */
  function signPowPart(b, n, kind) {
    var val = kind === 'neg-out' ? R(-1, Math.pow(b, n)) : R(n % 2 ? -1 : 1, Math.pow(b, n));
    var tx = kind === 'neg-out' ? '-' + b + '^{-' + n + '}' : '(-' + b + ')^{-' + n + '}', bn = F(Math.pow(b, n));
    var sol = kind === 'neg-out' ? 'The exponent is on ' + t(b) + ' only; the minus sign is applied last: ' + t(tx + '=-\\frac{1}{' + b + '^{' + n + '}}=' + frTex(val)) + '.'
      : 'The exponent is on the whole base ' + t('-' + b) + ': ' + t(tx + '=\\frac{1}{(-' + b + ')^{' + n + '}}=' + (n % 2 ? '\\frac{1}{-' + bn + '}=' : '\\frac{1}{' + bn + '}=') + frTex(val)) + ' (' + (n % 2 ? 'odd power: stays negative' : 'even power: positive') + ').';
    return exP(t(tx), val, function (v) {
      if (near(v, -val[0] / val[1])) {
        if (kind === 'neg-out') return { code: 'neg-base', hint: 'The exponent belongs to ' + t(b) + ' only — there are no brackets around ' + t('-' + b) + '. Work out ' + t(b + '^{-' + n + '}') + ', then put the minus sign in front.' };
        return { code: n % 2 ? 'odd-neg' : 'even-neg', hint: 'The brackets make ' + t('-' + b) + ' the base. ' + (n % 2 ? 'An odd power of a negative number is negative.' : 'An even power of a negative number is positive.') };
      }
      if (near(Math.abs(v), Math.pow(b, n))) return { code: 'opposite', hint: HN };
      if (near(v, -b * n) || near(v, b * n)) return { code: 'base-times-exp', hint: t(b + '^{' + n + '}') + ' means ' + t(b) + ' multiplied by itself ' + n + ' times — and the negative exponent means reciprocal.' };
      return null;
    }, sol, [HS, HN], 'evaluate ' + tx, { bad: [frTex(R(-val[0], val[1])), String(-Math.pow(b, n) * (val[0] < 0 ? -1 : 1))] });
  }
  /* (±p/q)^{-n} evaluated */
  function fracBasePart(p, q, n, neg) {
    var b = R(neg ? -p : p, q), ans = rpow(b, -n), bt = '\\left(' + (neg ? '-' : '') + '\\dfrac{' + p + '}{' + q + '}\\right)^{-' + n + '}';
    var flipT = (neg ? '-' : '') + (p === 1 ? String(q) : '\\frac{' + q + '}{' + p + '}');
    return exP(t(bt), ans, function (v) {
      if (n > 1 && near(v, rpow(b, n)[0] / rpow(b, n)[1])) return { code: 'no-flip', hint: 'You raised the fraction to the power ' + t(n) + ' but didn’t flip it. The negative exponent means: flip the fraction, then use the positive exponent.' };
      if (n > 1 && near(v, rinv(b)[0] / rinv(b)[1])) return { code: 'no-power', hint: 'Good flip — now raise the flipped fraction to the power ' + t(n) + '.' };
      if (n === 1 && near(v, b[0] / b[1])) return { code: 'not-flipped', hint: 'The power ' + t('-1') + ' flips the fraction.' };
      if (neg && near(v, -ans[0] / ans[1])) return { code: n % 2 ? 'odd-neg' : 'even-neg', hint: n % 2 ? 'The base is negative and the power is odd, so the answer stays negative.' : 'The base is negative and the power is even, so the answer is positive.' };
      return null;
    }, t(bt + '=\\left(' + flipT + '\\right)^{' + n + '}=' + frTex(ans)), [HF, 'Flip first, then raise the top and the bottom to the power ' + t(n) + '.'], 'evaluate (' + (neg ? '-' : '') + p + '/' + q + ')^-' + n, { bad: [frTex(rpow(b, n)), frTex(rinv(b))].filter(function (s) { return n > 1 || s !== frTex(rinv(b)); }) });
  }
  /* true / false statement (10C pattern) */
  function tfP(r, lhs, good, badRhs, truth, expl, text) {
    var rhs = truth ? good : badRhs;
    return P.tf(r, t(lhs + '=' + rhs), truth, expl, expl + '<br>So ' + t(lhs + '=' + good) + (truth ? ': the statement is <b>true</b>.' : ', not ' + t(rhs) + ': the statement is <b>false</b>.'), [HONLY, HN], text);
  }
  /* "b^{-n} with a positive exponent": a power with no negative exponent, equal to 1/b^n */
  function posPowChk(b, n) {
    var V = 1 / Math.pow(b, n);
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (near(a.val, V)) {
        var an = ex.analyze(a.ast);
        if (an.flags.negExp) return form('neg-exp', 'Right value — but this box wants the power with a <b>positive</b> exponent: ' + t('\\frac{1}{' + b + '^{\\square}}') + '.');
        if (!ex.shape(a.ast).pow && n > 1) return form('single-power', 'Right value — but this box wants the form with a positive exponent, like ' + t('\\frac{1}{' + b + '^{\\square}}') + '. The value goes in the next box.');
        return ok();
      }
      if (near(a.val, -Math.pow(b, n)) || near(a.val, -1 / V)) return wrong('opposite', HN);
      if (near(a.val, Math.pow(b, n))) return wrong('not-flipped', 'Make the exponent positive <b>and</b> take the reciprocal: ' + t('\\frac{1}{' + b + '^{' + n + '}}') + '.');
      return wrong('value', null);
    };
  }
  function evalNeg(b, n) {
    var bn = Math.pow(b, n), fr = R(1, bn);
    var p = P.fields(t(b + '^{-' + n + '}'), [{ name: 'Positive exponent', label: 'Positive exponent', mode: 'math', keys: 'expo', before: t(b + '^{-' + n + '}=') }, { name: 'Value', label: 'Value', mode: 'math', keys: 'fraction', before: t('=') }],
      [posPowChk(b, n), exactChk(fr, function (v) { if (near(v, -b * n)) return { code: 'base-times-exp', hint: 'A negative exponent doesn’t multiply: ' + t(b + '^{-' + n + '}=\\frac{1}{' + b + '^{' + n + '}}') + '.' }; if (near(v, bn)) return { code: 'not-flipped', hint: 'Take the reciprocal: ' + t('\\frac{1}{' + F(bn) + '}') + '.' }; if (near(v, 1 / (b * n))) return { code: 'base-times-exp', hint: t(b + '^{' + n + '}') + ' means ' + t(b) + ' multiplied by itself ' + n + ' times, not ' + t(b + '\\times ' + n) + '.' }; return null; })],
      ['\\frac{1}{' + b + '^{' + n + '}}', frTex(fr)], t(b + '^{-' + n + '}=\\frac{1}{' + b + '^{' + n + '}}=' + frTex(fr)),
      t(b + '^{-' + n + '}=\\frac{1}{' + b + '^{' + n + '}}') + ' (reciprocal of the positive power)' + (n > 1 ? ', and ' + t(b + '^{' + n + '}=' + F(bn)) : '') + ', so the value is ' + t(frTex(fr)) + '.', [HN, HE], b + '^-' + n + ' two steps');
    p.bad = [['-' + b + '^{' + n + '}', String(-bn)], ['\\frac{1}{' + b + '^{' + n + '}}', String(-b * n)], ['\\frac{1}{' + b + '^{' + n + '}}', String(bn)]];
    p.good = [['\\frac{1}{' + b + '^' + n + '}', '1/' + bn]];
    return p;
  }
  /* an ordering where equal values may sit in either order */
  function orderPart(r, prompt, items, sol, hints, text, why) {
    var sorted = items.slice().sort(function (a, b) { return a.v - b.v; });
    var p = P.order(r, prompt, sorted, { why: why }, sol, hints, text);
    var byId = {}; items.forEach(function (x) { byId[x.id] = x; });
    p.check = function (resp) {
      if (!resp || resp.length < items.length) return form('incomplete', 'Tap every item to place it in order (' + (resp ? resp.length : 0) + ' of ' + items.length + ' placed).');
      for (var j = 0; j + 1 < resp.length; j++) {
        var x = byId[resp[j]], y = byId[resp[j + 1]];
        if (x.v > y.v + 1e-12) { var h = why ? why(x, y) : null; return wrong(h && h.code || 'order', (h && h.hint) || t(x.tex) + ' and ' + t(y.tex) + ' are in the wrong order. Write each one as a fraction and compare again.'); }
      }
      return ok();
    };
    p.bad = [sorted.map(function (x) { return x.id; }).reverse()];
    return p;
  }
  /* no-calculator powers b^n (n >= 2) with b^n <= 1000, for picking varied numbers */
  function powPool(test) { var out = []; for (var b = 2; b <= 31; b++) for (var n = 2; Math.pow(b, n) <= 1024; n++) if (!test || test(b, n)) out.push([b, n]); return out; }
  var TENS = [[10, 1], [10, 2], [10, 2], [10, 3], [10, 3], [10, 4], [10, 5], [10, 6], [100, 1], [100, 2], [100, 3], [1000, 1], [1000, 2], [20, 2], [20, 3], [30, 2], [40, 2], [50, 2], [60, 2], [70, 2], [80, 2], [90, 2], [200, 2]];
  function vOf(tx) { return ex.value(ex.parse(tx.replace(/\\tfrac/g, '\\frac')).ast); }

  HW.defineLesson({
    id: 'u2l6', unit: 2, num: '6', title: 'Negative Exponents', outcome: 'AN3',
    blurb: 'Past zero the pattern continues: a negative exponent means the reciprocal of the positive power — for numbers, variables, coefficients and the quotient law.',
    questions: [
      /* ================= Part A ================= */
      { num: '1', section: 'Part A — The negative exponent rule', stem: 'Write each power with a positive exponent. (Do not evaluate.)', parts: [
        { id: '1a', level: 'LIM', outcome: 'AN3', make: function (r) { return negVar(r, r.pick(['x', 'x', 'a', 'b', 'm', 'n', 'p', 't', 'w', 'z']), r.int(2, 9)); } },
        { id: '1b', level: 'LIM', outcome: 'AN3', make: function (r) { return negVar(r, r.pick(['y', 'y', 'c', 'd', 'h', 'k', 'q', 'r', 's', 'g']), r.int(2, 12)); } },
        { id: '1c', level: 'LIM', outcome: 'AN3', make: function (r) { return negVar(r, L1(r), 1); } },
        { id: '1d', level: 'BEG', outcome: 'AN3', make: function (r) {
          var bs = r.sample(['c', 'a', 'b', 'x', 'y', 'm', 'p', 't', 'w', 'z'], 1)[0], e = r.pick(['k', 'n', 'm', 'r', 'p', 'q', 'a', 's']); if (e === bs) e = 'k';
          return X(t(bs + '^{-' + e + '}'), M(1, {}), [W('-' + bs + '^{' + e + '}', 'opposite', HN), W(bs + '^{' + e + '}', 'not-flipped', 'Make the exponent positive <b>and</b> take the reciprocal.')], t(bs + '^{-' + e + '}=\\frac{1}{' + bs + '^{' + e + '}}') + ': the rule works the same with a letter exponent.', [HN, 'Same rule: ' + t('a^{-n}=\\frac{1}{a^{n}}') + '.'], bs + '^-' + e, { target: '\\frac{1}{' + bs + '^{' + e + '}}', vars: [bs, e] });
        } }] },
      { num: '2', stem: 'Write each power with a positive exponent, then evaluate without a calculator.', parts: [
        { id: '2a', level: 'BEG', outcome: 'AN3', make: function (r) { var c = r.chance(0.4) ? [2, r.int(2, 6)] : r.pick(powPool(function (b) { return b <= 5; })); return evalNeg(c[0], c[1]); } },
        { id: '2b', level: 'BEG', outcome: 'AN3', make: function (r) { return evalNeg(r.int(2, 30), 1); } },
        { id: '2c', level: 'BEG', outcome: 'AN3', make: function (r) { var c = r.pick(powPool(function (b, n) { return b >= 3 && b <= 12 && Math.pow(b, n) <= 1000; })); return evalNeg(c[0], c[1]); } },
        { id: '2d', level: 'BEG', outcome: 'AN3', make: function (r) { var c = r.pick(TENS); return evalNeg(c[0], c[1]); } }] },
      { num: '3', stem: 'Simplify each expression so the exponent is positive.', parts: [
        { id: '3a', level: 'BEG', outcome: 'AN3', make: function (r) { var c = r.pick(powPool(function (b, n) { return Math.pow(b, n) <= 1000 && (n <= 3 || b === 2); })), b = c[0], n = c[1], v = Math.pow(b, n); return exP(t('\\dfrac{1}{' + b + '^{-' + n + '}}'), [v, 1], function (x) { if (near(x, 1 / v)) return { code: 'flip-back', hint: 'The negative power is in the <b>denominator</b>, so it moves up: ' + t('\\frac{1}{a^{-n}}=a^{n}') + '.' }; return null; }, t('\\frac{1}{' + b + '^{-' + n + '}}=' + b + '^{' + n + '}') + ' (' + t('=' + F(v)) + '). Either form is fine.', [HN, 'Reverse rule: ' + t('\\frac{1}{a^{-n}}=a^{n}') + '.'], '1/' + b + '^-' + n, { pow: true, key: b + '^{' + n + '}', good: [F(v, true)], bad: ['\\frac{1}{' + v + '}', '\\frac{1}{' + b + '^{' + n + '}}', String(-v)] }); } },
        { id: '3b', level: 'BEG', outcome: 'AN3', make: function (r) { var b = r.int(2, 30); return exP(t('\\dfrac{1}{' + b + '^{-1}}'), [b, 1], function (x) { if (near(x, 1 / b)) return { code: 'flip-back', hint: 'The negative power is in the <b>denominator</b>, so it moves up.' }; return null; }, t('\\frac{1}{' + b + '^{-1}}=' + b + '^{1}=' + b) + '.', [HN, 'Reverse rule: ' + t('\\frac{1}{a^{-n}}=a^{n}') + '.'], '1/' + b + '^-1', { pow: true, bad: ['\\frac{1}{' + b + '}', String(-b)] }); } },
        { id: '3c', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), n = r.int(2, 9); return X(t('\\dfrac{1}{' + vt(x, -n) + '}'), M(1, [[x, n]]), [W('\\frac{1}{' + vt(x, n) + '}', 'u2l6-unflipped-den', 'The factor has to change sides too: ' + t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '.'), W('-' + vt(x, n), 'opposite', HN)], 'The power with the negative exponent is in the denominator, so it moves up and the exponent becomes positive: ' + t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '.', [HN, HM], '1/' + x + '^-' + n); } },
        { id: '3d', level: 'BEG', outcome: 'AN3', make: function (r) { var x = r.pick(['y', 'y', 'b', 'k', 'q', 'r', 's']), n = r.int(2, 12); return X(t('\\dfrac{1}{' + vt(x, -n) + '}'), M(1, [[x, n]]), [W('\\frac{1}{' + vt(x, n) + '}', 'u2l6-unflipped-den', 'The factor has to change sides too: ' + t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '.'), W('-' + vt(x, n), 'opposite', HN)], t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + ': a negative power downstairs moves up and turns positive.', [HN, HM], '1/' + x + '^-' + n); } }] },
      { num: '4', stem: 'Evaluate without a calculator.', parts: [
        { id: '4a', level: 'BEG', outcome: 'AN3', make: function (r) { return evalVal(r.int(2, 31), 2); } },
        { id: '4b', level: 'BEG', outcome: 'AN3', make: function (r) { var c = r.chance(0.4) ? [2, r.int(3, 6)] : r.pick(powPool(function (b, n) { return n >= 3 && Math.pow(b, n) <= 1000; })); return evalVal(c[0], c[1]); } },
        { id: '4c', level: 'LIM', outcome: 'AN3', make: function (r) { return evalVal(r.int(2, 30), 1); } },
        { id: '4d', level: 'EMG', outcome: 'AN3', make: function (r) { var c = r.pick(powPool(function (b, n) { return n >= 3 && b >= 3 && Math.pow(b, n) <= 1000; })); return evalVal(c[0], c[1]); } }] },
      { num: '5', stem: 'State whether each statement is True or False.', parts: [
        { id: '5a', level: 'EMG', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.int(2, 9), n = r.int(2, 9); return tfP(r, k + x + '^{-' + n + '}', '\\dfrac{' + k + '}{' + vt(x, n) + '}', '\\dfrac{1}{' + k + vt(x, n) + '}', r.chance(0.4), 'The ' + t('-' + n) + ' is on ' + t(x) + ' only, so only ' + t(vt(x, -n)) + ' moves down; the ' + t(k) + ' stays on top.', 'T/F kx^-n = 1/(kx^n)'); } },
        { id: '5b', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.int(2, 9), n = r.int(2, 9); return tfP(r, k + x + '^{-' + n + '}', '\\dfrac{' + k + '}{' + vt(x, n) + '}', r.pick(['\\dfrac{1}{' + k + vt(x, n) + '}', '-' + k + vt(x, n)]), r.chance(0.6), 'Only ' + t(vt(x, -n)) + ' has a negative exponent, so only it moves: ' + t(k + x + '^{-' + n + '}=\\frac{' + k + '}{' + vt(x, n) + '}') + '.', 'T/F ky^-n = k/y^n'); } },
        { id: '5c', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), n = r.int(2, 9); return tfP(r, '\\dfrac{1}{' + vt(x, -n) + '}', vt(x, n), r.pick(['\\dfrac{1}{' + vt(x, n) + '}', '-' + vt(x, n)]), r.chance(0.6), 'A negative power in the denominator moves up and turns positive: ' + t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '.', 'T/F 1/a^-n = a^n'); } },
        { id: '5d', level: 'EMG', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.int(2, 9), n = r.int(1, 4); return tfP(r, '\\dfrac{' + k + '}{' + vt(x, -n) + '}', k + vt(x, n), r.pick(['\\dfrac{' + k + '}{' + vt(x, n) + '}', '\\dfrac{1}{' + k + vt(x, n) + '}']), r.chance(0.6), t(vt(x, -n)) + ' is in the denominator with a negative exponent, so it moves up; the ' + t(k) + ' stays on top.', 'T/F k/b^-n = kb^n'); } },
        { id: '5e', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), n = r.pick([1, 1, 1, 2, 3]); return tfP(r, vt(x, -n), '\\dfrac{1}{' + vt(x, n) + '}', '-' + vt(x, n), r.chance(0.35), 'A negative exponent means reciprocal, not a negative value: ' + t(vt(x, -n) + '=\\frac{1}{' + vt(x, n) + '}') + '.', 'T/F x^-1 = -x'); } }] },
      /* ================= Part B ================= */
      { num: '6', section: 'Part B — Coefficients, the quotient law and applications', stem: 'Simplify each expression, writing the answer with a positive exponent.', parts: [
        { id: '6a', level: 'EMG', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.int(2, 12), n = r.int(2, 9); return coefNeg(k, x, n, false); } },
        { id: '6b', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.int(2, 12); return coefNeg(k, x, 1, false); } },
        { id: '6c', level: 'EMG', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.int(2, 12), n = r.int(2, 9); return coefNeg(k, x, n, true); } },
        { id: '6d', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.int(2, 20), n = r.int(2, 9); return coefNeg(k, x, n, true); } }] },
      { num: '7', stem: 'Evaluate without a calculator. Be careful where the negative sign is attached.', parts: [
        { id: '7a', level: 'EMG', outcome: 'AN3', make: function (r) { var b = r.int(2, 15); return signPowPart(b, b <= 3 ? r.pick([2, 2, 4]) : 2, 'neg-in'); } },
        { id: '7b', level: 'EMG', outcome: 'AN3', make: function (r) { var b = r.int(2, 15); return signPowPart(b, b <= 3 ? r.pick([2, 2, 4]) : 2, 'neg-out'); } },
        { id: '7c', level: 'EMG', outcome: 'AN3', make: function (r) { var b = r.int(2, 10); return signPowPart(b, b === 2 ? r.pick([3, 3, 5, 7, 9]) : b === 3 ? r.pick([3, 3, 5]) : 3, 'neg-in'); } },
        { id: '7d', level: 'EMG', outcome: 'AN3', make: function (r) { var b = r.int(2, 10); return signPowPart(b, b === 2 ? r.pick([3, 3, 5, 7, 9]) : b === 3 ? r.pick([3, 3, 5]) : 3, 'neg-out'); } }] },
      { num: '8', stem: 'Simplify using the quotient law, then write the answer with a positive exponent.', parts: [
        { id: '8a', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), a = r.int(2, 6), d = r.int(2, 6); return nchain(Dv(Mn(1, [[x, a]]), Mn(1, [[x, a + d]]), 'div'), { text: 'x^a ÷ x^b, a<b' }); } },
        { id: '8b', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), a = r.int(2, 6), d = r.int(2, 6); return nchain(Dv(Mn(1, [[x, a]]), Mn(1, [[x, a + d]]), 'div'), { text: 'a^m ÷ a^n, m<n' }); } },
        { id: '8c', level: 'EMG', outcome: 'AN3', make: function (r) { var x = L1(r), d = r.int(3, 9); return nchain(Dv(Mn(1, [[x, 1]]), Mn(1, [[x, d]]), 'div'), { hint: 'A letter with no exponent is ' + t(x + '^{1}') + '.', text: 'm ÷ m^n' }); } },
        { id: '8d', level: 'BEG', outcome: 'AN3', make: function (r) { var x = L1(r), a = r.int(2, 8), d = r.int(2, 8); return nchain(Dv(Mn(1, [[x, a]]), Mn(1, [[x, a + d]]), 'div'), { text: 'y^m ÷ y^n, m<n' }); } }] },
      { num: '9', stem: 'Simplify using the quotient law, then write the answer with a positive exponent.', parts: [
        { id: '9a', level: 'EMG', outcome: 'AN3', make: function (r) { return coefQuot(r, false); } },
        { id: '9b', level: 'EMG', outcome: 'AN3', make: function (r) { return coefQuot(r, false); } },
        { id: '9c', level: 'EMG', outcome: 'AN3', make: function (r) { return coefQuot(r, true); } },
        { id: '9d', level: 'EMG', outcome: 'AN3', make: function (r) { return coefQuot(r, false); } }] },
      { num: '10', stem: 'Simplify each expression, writing the answer with a positive exponent.', parts: [
        { id: '10a', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), d = r.int(2, 6), q = r.int(2, 6), p = r.int(1, 4); return nchain(Dv(Mn(d * q, [[ls[0], p], [ls[1], r.int(3, 6)]]), Mn(d, [[ls[0], p + r.int(2, 5)], [ls[1], 1]]), 'pdiv'), { text: 'Aa^p b^q ÷ da^r b' }); } },
        { id: '10b', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), d = r.int(2, 8), q = r.int(2, 6), p = r.int(1, 4); return nchain(Dv(Mn(d * q, [[ls[0], p], [ls[1], 1]]), Mn(d, [[ls[0], p + r.int(1, 4)], [ls[1], r.int(2, 5)]]), 'pdiv'), { text: 'Ax^p y ÷ dx^r y^s' }); } }] },
      { num: '11', stem: function (sh) { return 'A student simplified ' + t(sh.b + '^{-' + sh.n + '}') + ' and wrote ' + t(sh.b + '^{-' + sh.n + '}=-' + (sh.b * sh.n)) + '.'; },
        shared: function (r) { var b = r.int(2, 12); return { b: b, n: b <= 5 ? r.pick([2, 2, 3]) : 2 }; },
        parts: [
          { id: '11a', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var b = sh.b, n = sh.n;
            return P.mc(r, 'What mistake did the student make?', [
              { html: 'They multiplied the base by the exponent (' + t(b + '\\times(-' + n + ')') + '). A negative exponent means <b>reciprocal</b>: ' + t(b + '^{-' + n + '}=\\frac{1}{' + b + '^{' + n + '}}') + '.', right: true },
              { html: 'They forgot to make the answer negative twice, so it should be ' + t(b * n) + '.', why: 'The value isn’t negative at all — and a power never means base × exponent.' },
              { html: 'Nothing: a negative exponent gives a negative answer.', why: HN },
              { html: 'They should have added the base and the exponent: ' + t(b + '+(-' + n + ')=' + (b - n)) + '.', why: 'A power is repeated multiplication; the negative exponent then means reciprocal.' }],
              'The student treated the power as ' + t('\\text{base}\\times\\text{exponent}') + ' and turned the negative exponent into a negative answer. A negative exponent means reciprocal: ' + t(b + '^{-' + n + '}=\\frac{1}{' + b + '^{' + n + '}}=' + frTex(R(1, Math.pow(b, n)))) + '.', [HN], 'error b^-n = -bn');
          } },
          { id: '11b', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return evalVal(sh.b, sh.n, 'State the correct value of ' + t(sh.b + '^{-' + sh.n + '}') + '.'); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', outcome: 'AN3', make: function (r) {
          var b = r.int(2, 10), n = b === 2 ? r.int(2, 5) : b === 3 ? r.int(2, 3) : 2, bn = Math.pow(b, n), V = R(bn + 1, bn);
          var opts = [{ html: t(frTex(V)), right: true }, { html: t('\\frac{1}{' + bn + '}'), why: t(b + '^{0}=1') + ', not ' + t('0') + ' — add it on.' }, { html: t(frTex(R(1 - bn, 1))), why: HN }, { html: t('0'), why: 'Both terms are positive: ' + t(b + '^{-' + n + '}=\\frac{1}{' + bn + '}') + ' and ' + t(b + '^{0}=1') + '.' }];
          return P.mc(r, 'The value of ' + t(b + '^{-' + n + '}+' + b + '^{0}') + ' is', opts, t(b + '^{-' + n + '}+' + b + '^{0}=\\frac{1}{' + bn + '}+1=\\frac{1}{' + bn + '}+\\frac{' + bn + '}{' + bn + '}=' + frTex(V)) + '.', [HN, 'What is ' + t(b + '^{0}') + '?'], 'MC b^-n + b^0');
        } }] },
      { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '13', level: 'EMG', outcome: 'AN3', make: function (r) {
          var x = L1(r), k = r.int(2, 12), n = r.int(2, 9);
          var opts = [{ html: t(k + vt(x, n)), right: true }, { html: t('\\dfrac{' + k + '}{' + vt(x, n) + '}'), why: 'The factor must change sides as its exponent turns positive.' }, { html: t('\\dfrac{' + vt(x, n) + '}{' + k + '}'), why: 'Only ' + t(vt(x, -n)) + ' has a negative exponent; the ' + t(k) + ' stays on top.' }, { html: t('-' + k + vt(x, n)), why: HN }];
          return P.mc(r, 'Which of the following is equivalent to ' + t('\\dfrac{' + k + '}{' + vt(x, -n) + '}') + '?', opts, t(vt(x, -n)) + ' is in the denominator with a negative exponent, so it moves up: ' + t('\\frac{' + k + '}{' + vt(x, -n) + '}=' + k + vt(x, n)) + '.', [HM], 'MC k/x^-n');
        } }] }],

    extra: [
      /* ================= Extra A ================= */
      { num: '1', section: 'Part A — Where the negative attaches', stem: function (sh) { return 'Simplify each expression (positive exponents, ' + t(sh.x + '\\neq 0') + '). Two of the five are equal.'; },
        shared: function (r) { var k = r.int(2, 5); return { x: r.pick(['x', 'x', 'a', 'm', 'y', 't', 'p']), k: k, n: k <= 3 ? r.int(2, 4) : r.int(2, 3) }; },
        parts: [
          { id: 'e1a', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return coefNeg(sh.k, sh.x, sh.n, false); } },
          { id: 'e1b', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return nchain(Pw(Mn(sh.k, [[sh.x, 1]]), -sh.n), { wrongs: [W('\\frac{' + sh.k + '}{' + vt(sh.x, sh.n) + '}', 'not-raised', 'The bracket makes ' + t(sh.k) + ' part of the base: ' + t(sh.k + '^{-' + sh.n + '}=\\frac{1}{' + Math.pow(sh.k, sh.n) + '}') + ' too.'), W('\\frac{1}{' + sh.k + vt(sh.x, sh.n) + '}', 'not-raised', 'Raise the ' + t(sh.k) + ' to the power ' + t(sh.n) + ' as well: ' + t(sh.k + '^{' + sh.n + '}=' + Math.pow(sh.k, sh.n)) + '.')], hint: HONLY, text: '(kx)^-n' }); } },
          { id: 'e1c', level: 'LIM', outcome: 'AN3', make: function (r, sh) { return nchain(Mn(-sh.k, [[sh.x, sh.n]]), { wrongs: [W('-\\frac{' + sh.k + '}{' + vt(sh.x, sh.n) + '}', 'opposite', 'There is no negative <b>exponent</b> here — the minus is a sign in front, so nothing moves.'), W('\\frac{1}{' + sh.k + vt(sh.x, sh.n) + '}', 'opposite', 'There is no negative exponent here: ' + t('-' + sh.k + vt(sh.x, sh.n)) + ' is already simplified.')], hints: ['A minus <b>sign</b> in front is not a negative <b>exponent</b>. Is there anything to move?', HONLY], text: '-kx^n (already simple)' }); } },
          { id: 'e1d', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return nchain(Pw(Mn(sh.k, [[sh.x, 1]]), sh.n), { hint: HONLY, text: '(kx)^n' }); } },
          { id: 'e1e', level: 'BEG', outcome: 'AN3', make: function (r, sh) { return nchain(Mul([Mn(sh.k, []), Mn(1, [[sh.x, -sh.n]])]), { prompt: t(sh.k + '\\left(' + vt(sh.x, -sh.n) + '\\right)'), wrongs: [W('\\frac{1}{' + sh.k + vt(sh.x, sh.n) + '}', 'coef-side', 'The bracket holds only ' + t(vt(sh.x, -sh.n)) + '; the ' + t(sh.k) + ' has no negative exponent, so it stays on top.')], hint: HONLY, text: 'k(x^-n)' }); } },
          { id: 'e1f', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var k = sh.k, x = sh.x, n = sh.n, ex_ = ['(a) ' + t(k + vt(x, -n)), '(b) ' + t('(' + k + x + ')^{-' + n + '}'), '(c) ' + t('-' + k + vt(x, n)), '(d) ' + t('(' + k + x + ')^{' + n + '}'), '(e) ' + t(k + '\\left(' + vt(x, -n) + '\\right)')];
            return P.mc(r, 'Which two of ' + ex_.join(', ') + ' are equal?', [{ html: '(a) and (e)', right: true }, { html: '(a) and (b)', why: 'In (b) the bracket makes ' + t(k) + ' part of the base too: ' + t('\\frac{1}{' + Math.pow(k, n) + vt(x, n) + '}') + ', but (a) is ' + t('\\frac{' + k + '}{' + vt(x, n) + '}') + '.' }, { html: '(c) and (d)', why: '(c) is negative and (d) is positive.' }, { html: '(b) and (d)', why: '(b) is the reciprocal of (d), not equal to it.' }],
              '(a) ' + t(k + vt(x, -n) + '=\\frac{' + k + '}{' + vt(x, n) + '}') + ' and (e) ' + t(k + '\\left(' + vt(x, -n) + '\\right)=\\frac{' + k + '}{' + vt(x, n) + '}') + ' are equal: brackets around ' + t(vt(x, -n)) + ' alone change nothing.', [HONLY], 'which two are equal');
          } }] },
      { num: '2', stem: 'Evaluate each expression as an exact fraction. Watch the brackets.',
        shared: function (r) { var ab = pickWhere(function () { return [r.int(2, 9), r.int(2, 9)]; }, function (v) { return v[0] !== v[1] && v[0] * v[1] <= 20; }); return { a: ab[0], b: ab[1] }; },
        parts: [
          { id: 'e2a', level: 'EMG', outcome: 'AN3', make: function (r, sh) { var a = sh.a, b = sh.b, V = R(a, b * b); return exP(t(a + '\\cdot ' + b + '^{-2}'), V, function (v) { if (near(v, 1 / (a * a * b * b))) return { code: 'not-raised', hint: 'The exponent is on ' + t(b) + ' only; the ' + t(a) + ' stays on top: ' + t(a + '\\times\\frac{1}{' + b * b + '}') + '.' }; if (near(v, 1 / (a * b * b))) return { code: 'coef-side', hint: 'The ' + t(a) + ' has no negative exponent, so it stays on top.' }; return null; }, t(a + '\\cdot ' + b + '^{-2}=' + a + '\\times\\frac{1}{' + b * b + '}=' + frTex(V)) + '.', [HONLY, HE], 'a·b^-2', { bad: ['\\frac{1}{' + a * a * b * b + '}', '\\frac{1}{' + a * b * b + '}'] }); } },
          { id: 'e2b', level: 'PRG', outcome: 'AN3', make: function (r, sh) { var a = sh.a, b = sh.b, ab = a * b, V = R(1, ab * ab); return exP(t('(' + a + '\\cdot ' + b + ')^{-2}'), V, function (v) { if (near(v, a / (b * b))) return { code: 'not-raised', hint: 'The bracket makes the whole product ' + t(a + '\\cdot ' + b + '=' + ab) + ' the base.' }; return null; }, t('(' + a + '\\cdot ' + b + ')^{-2}=' + ab + '^{-2}=\\frac{1}{' + ab + '^{2}}=' + frTex(V)) + '.', [HONLY, HE], '(a·b)^-2', { bad: [frTex(R(a, b * b)), String(-ab * ab)] }); } },
          { id: 'e2c', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return signPowPart(sh.b, 2, 'neg-out'); } },
          { id: 'e2d', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return signPowPart(sh.b, 2, 'neg-in'); } },
          { id: 'e2e', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return fracBasePart(1, sh.b, 2); } }] },
      { num: '3', stem: 'True or false? If false, choose the correct right side (positive exponents).',
        shared: function (r) { return { x: r.pick(['x', 'x', 'a', 'm', 'y', 'n', 'p']), k: r.int(2, 9), b: r.int(2, 9), pq: r.pick([[2, 5], [2, 5], [3, 4], [2, 3], [3, 5], [4, 7], [5, 8], [3, 7], [2, 9]]) }; },
        parts: [
          { id: 'e3a', level: 'BEG', outcome: 'AN3', make: function (r, sh) { var k = sh.k, x = sh.x; return tfFix(r, '(' + k + x + ')^{-2}', '\\frac{1}{' + k * k + vt(x, 2) + '}', r.chance(0.55) ? '\\frac{1}{' + k * k + vt(x, 2) + '}' : '\\frac{' + k + '}{' + vt(x, 2) + '}', [W('\\frac{' + k + '}{' + vt(x, 2) + '}', 'not-raised', 'The bracket makes ' + t(k) + ' part of the base.'), W('\\frac{1}{' + k + vt(x, 2) + '}', 'not-raised', 'Square the ' + t(k) + ' too.'), W('-' + k * k + vt(x, 2), 'opposite', HN)], t('(' + k + x + ')^{-2}=\\frac{1}{(' + k + x + ')^{2}}=\\frac{1}{' + k * k + vt(x, 2) + '}') + ': the bracket makes ' + t(k + x) + ' the base.', [HONLY], 'T/F (kx)^-2'); } },
          { id: 'e3b', level: 'EMG', outcome: 'AN3', make: function (r, sh) { var k = sh.k, x = sh.x; return tfFix(r, k + x + '^{-2}', '\\frac{' + k + '}{' + vt(x, 2) + '}', r.chance(0.35) ? '\\frac{' + k + '}{' + vt(x, 2) + '}' : '\\frac{1}{' + k * k + vt(x, 2) + '}', [W('\\frac{1}{' + k * k + vt(x, 2) + '}', 'not-raised', 'Without brackets the ' + t(k) + ' is a coefficient, not part of the base.'), W('\\frac{1}{' + k + vt(x, 2) + '}', 'coef-side', 'The ' + t(k) + ' has no negative exponent, so it stays on top.'), W('-' + k + vt(x, 2), 'opposite', HN)], t(k + x + '^{-2}=\\frac{' + k + '}{' + vt(x, 2) + '}') + ': the ' + t(k) + ' is a coefficient, not part of the base.', [HONLY], 'T/F kx^-2'); } },
          { id: 'e3c', level: 'BEG', outcome: 'AN3', make: function (r, sh) { var b = sh.b; return tfFix(r, '(-' + b + ')^{-2}', '\\frac{1}{' + b * b + '}', r.chance(0.55) ? '\\frac{1}{' + b * b + '}' : '-\\frac{1}{' + b * b + '}', [W('-\\frac{1}{' + b * b + '}', 'even-neg', 'The brackets make ' + t('-' + b) + ' the base; an even power is positive.'), W(String(b * b), 'not-flipped', 'The negative exponent means reciprocal.'), W(String(-b * b), 'opposite', HN)], t('(-' + b + ')^{-2}=\\frac{1}{(-' + b + ')^{2}}=\\frac{1}{' + b * b + '}') + ' (even power: positive).', [HS], 'T/F (-b)^-2'); } },
          { id: 'e3d', level: 'EMG', outcome: 'AN3', make: function (r, sh) { var b = sh.b; return tfFix(r, '-' + b + '^{-2}', '-\\frac{1}{' + b * b + '}', r.chance(0.35) ? '-\\frac{1}{' + b * b + '}' : '\\frac{1}{' + b * b + '}', [W('\\frac{1}{' + b * b + '}', 'neg-base', 'No brackets: the exponent is on ' + t(b) + ' only, and the minus sign is applied last.'), W(String(-b * b), 'not-flipped', 'The negative exponent means reciprocal.'), W(String(b * b), 'opposite', HN)], t('-' + b + '^{-2}=-\\frac{1}{' + b + '^{2}}=-\\frac{1}{' + b * b + '}') + ': the exponent is on ' + t(b) + ' only.', [HS], 'T/F -b^-2'); } },
          { id: 'e3e', level: 'BEG', outcome: 'AN3', make: function (r, sh) { var p = sh.pq[0], q = sh.pq[1]; return tfFix(r, '\\left(\\frac{' + p + '}{' + q + '}\\right)^{-1}', '\\frac{' + q + '}{' + p + '}', r.chance(0.6) ? '\\frac{' + q + '}{' + p + '}' : '-\\frac{' + p + '}{' + q + '}', [W('-\\frac{' + p + '}{' + q + '}', 'opposite', HN), W('\\frac{' + p + '}{' + q + '}', 'not-flipped', 'The power ' + t('-1') + ' flips the fraction.'), W('-\\frac{' + q + '}{' + p + '}', 'opposite', 'Flip it, but don’t make it negative.')], t('\\left(\\frac{' + p + '}{' + q + '}\\right)^{-1}=\\frac{' + q + '}{' + p + '}') + ': the power ' + t('-1') + ' takes the reciprocal.', [HF], 'T/F (p/q)^-1'); } }] },
      { num: '4', stem: 'Evaluate without a calculator. Give exact fractions, not decimals.', parts: [
        { id: 'e4a', level: 'BEG', outcome: 'AN3', make: function (r) { return evalVal(r.int(2, 25), 2); } },
        { id: 'e4b', level: 'EMG', outcome: 'AN3', make: function (r) { var b = r.int(2, 10); return signPowPart(b, b === 2 ? r.pick([3, 5, 7]) : 3, 'neg-in'); } },
        { id: 'e4c', level: 'EMG', outcome: 'AN3', make: function (r) { var q = r.int(2, 12); return fracBasePart(1, q, q <= 4 ? r.pick([2, 3]) : 2); } },
        { id: 'e4d', level: 'BEG', outcome: 'AN3', make: function (r) { var c = r.pick(TENS); return evalVal(c[0], c[1]); } },
        { id: 'e4e', level: 'EMG', outcome: 'AN3', make: function (r) { var n = r.int(2, 11), V = n % 2 ? -1 : 1, tx = '(-1)^{-' + n + '}'; return exP(t(tx), [V, 1], function (v) { if (near(v, -V)) return { code: n % 2 ? 'odd-neg' : 'even-neg', hint: t('(-1)^{' + n + '}') + ' — is ' + t(n) + ' even or odd? And the reciprocal of ' + t('\\pm 1') + ' is itself.' }; if (near(v, -n) || near(v, n)) return { code: 'base-times-exp', hint: 'A power is repeated multiplication, not ' + t('-1\\times(-' + n + ')') + '.' }; return null; }, t(tx + '=\\frac{1}{(-1)^{' + n + '}}=\\frac{1}{' + V + '}=' + V) + ' (' + (n % 2 ? 'odd' : 'even') + ' power).', [HS, HN], '(-1)^-n', { bad: [String(-V), String(n)] }); } }] },
      /* ================= Extra B ================= */
      { num: '5', section: 'Part B — Moving factors across the fraction bar', stem: 'A <b>factor</b> with a negative exponent may be moved to the other side of the fraction bar, and its exponent turns positive when it lands. Rewrite each expression using positive exponents only.', parts: [
        { id: 'e5a', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.int(2, 9); return nchain(Dv(Mn(k, [[ls[0], -r.int(2, 6)]]), Mn(1, [[ls[1], -r.int(2, 6)]])), { text: 'kx^-a / y^-b' }); } },
        { id: 'e5b', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r); return nchain(Dv(Mn(1, [[ls[0], -r.int(2, 7)]]), Mn(1, [[ls[1], r.int(2, 6)]])), { text: 'a^-m / b^n' }); } },
        { id: 'e5c', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r); return nchain(Dv(Mn(1, [[ls[0], r.int(2, 6)]]), Mn(1, [[ls[1], -r.int(2, 7)]])), { text: 'm^a / n^-b' }); } }] },
      { num: '6', stem: 'Simplify each expression, leaving your answer with positive exponents.', parts: [
        { id: 'e6a', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), ab = pickWhere(function () { return [r.int(2, 9), r.int(2, 9)]; }, function (x) { return x[0] !== x[1] && ex.gcd(x[0], x[1]) === 1; }); return nchain(Dv(Mn(ab[0], [[ls[0], -r.int(2, 5)]]), Mn(ab[1], [[ls[1], -r.int(1, 3)]])), { text: 'ap^-m / bq^-n' }); } },
        { id: 'e6b', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), d = r.int(2, 6), q = r.int(2, 4); return nchain(Dv(Mn(d * q, [[ls[0], -r.int(1, 4)], [ls[1], r.int(2, 6)]]), Mn(d, [[ls[0], r.int(2, 5)], [ls[1], -r.int(1, 3)]])), { text: 'Ac^-a d^b / dc^c d^-e' }); } },
        { id: 'e6c', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), a = r.int(2, 5), b = a + r.int(2, 5), c = r.int(1, 5), d = r.int(2, 6); return nchain(Dv(Mn(1, [[ls[0], -a], [ls[1], c]]), Mn(1, [[ls[0], -b], [ls[1], -d]])), { text: 'x^-a y^c / x^-b y^-d' }); } }] },
      { num: '7', stem: 'Simplify each expression, leaving your answer with positive exponents. Where the <b>numbers</b> carry negative exponents too, move them the same way.', parts: [
        { id: 'e7a', level: 'PRG', outcome: 'AN3', make: function (r) { var x = L1(r), ab = pickWhere(function () { return [r.int(2, 5), r.int(2, 4)]; }, function (v) { return v[0] !== v[1] && ex.gcd(v[0], v[1] * v[1]) === 1; }), p = r.int(1, 4), q = p + r.int(1, 4); return nchain(Dv(Mul([Pw(Mn(ab[0], []), -1), Mn(1, [[x, p]])], ''), Mul([Pw(Mn(ab[1], []), -2), Mn(1, [[x, q]])], '')), { text: 'a^-1 x^p / b^-2 x^q' }); } },
        { id: 'e7b', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), cd = r.pick([[6, 9], [6, 9], [4, 6], [10, 15], [6, 4], [8, 12], [9, 6], [12, 18]]); return nchain(Dv(Mn(cd[0], [[ls[0], -r.int(1, 3)], [ls[1], -r.int(1, 4)]]), Mn(cd[1], [[ls[0], -r.int(4, 6)], [ls[1], r.int(1, 3)]])), { text: 'cm^-a n^-b / dm^-c n^d' }); } },
        { id: 'e7c', level: 'PRG', outcome: 'AN3', make: function (r) { var x = L1(r), b = r.int(2, 5), a = r.int(2, 6), c = a + r.int(1, 4); return nchain(Dv(Mul([Pw(Mn(-b, []), -2), Mn(1, [[x, -a]])], ''), Mn(1, [[x, -c]])), { text: '(-b)^-2 t^-a / t^-c' }); } }] },
      { num: '8', stem: function (sh) { return 'A student writes ' + t(vt(sh.x, -sh.n) + '=-' + vt(sh.x, sh.n)) + '.'; },
        shared: function (r) { return { x: r.pick(['x', 'x', 'a', 'm', 'y', 't']), n: r.int(2, 4), v: r.pick([2, 2, 3]) }; },
        parts: [
          { id: 'e8a', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var x = sh.x, n = sh.n;
            return P.mc(r, 'What has the student confused?', [
              { html: 'They turned the negative <b>exponent</b> into a negative <b>sign</b>. A negative exponent means reciprocal: ' + t(vt(x, -n) + '=\\frac{1}{' + vt(x, n) + '}') + '.', right: true },
              { html: 'They forgot to flip the sign of the exponent twice; the answer should be ' + t(vt(x, n)) + '.', why: t(vt(x, n)) + ' is not equal to ' + t(vt(x, -n)) + ' either — the reciprocal is missing.' },
              { html: 'Nothing — a negative exponent makes the value negative.', why: HN },
              { html: 'They should have written ' + t('-\\frac{1}{' + vt(x, n) + '}') + '.', why: 'The reciprocal is right, but nothing becomes negative.' }],
              'A negative exponent means reciprocal, not a negative value: ' + t(vt(x, -n) + '=\\frac{1}{' + vt(x, n) + '}') + '.', [HN], 'x^-n = -x^n confusion');
          } },
          { id: 'e8b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var x = sh.x, n = sh.n, v = sh.v, vn = Math.pow(v, n);
            var p = P.fields('Give the correct form, then substitute ' + t(x + '=' + v) + ' into the student’s answer and into yours to show they are not equal.', [
              { name: 'Correct form', label: 'Correct form', mode: 'math', keys: 'expo', vars: [x], before: t(vt(x, -n) + '=') }, { name: 'Student', label: 'Student’s at ' + t(x + '=' + v), mode: 'math', keys: 'fraction', before: t('-' + vt(x, n) + '=') }, { name: 'Yours', label: 'Yours at ' + t(x + '=' + v), mode: 'math', keys: 'fraction', before: t('=') }],
              [K.expo('\\frac{1}{' + vt(x, n) + '}', { diag: function (an, ast) { return same(ast, '-' + vt(x, n)) ? { code: 'opposite', hint: 'That’s the student’s answer. ' + HN } : null; } }), exactChk([-vn, 1], function (val) { return near(val, vn) ? { code: 'sign', hint: 'The student’s answer has a minus sign in front: ' + t('-' + v + '^{' + n + '}=-' + vn) + '.' } : null; }), exactChk([1, vn], function (val) { return near(val, -vn) ? { code: 'opposite', hint: 'That’s the student’s value. Yours is the reciprocal: ' + t('\\frac{1}{' + v + '^{' + n + '}}') + '.' } : null; })],
              ['\\frac{1}{' + vt(x, n) + '}', String(-vn), '\\frac{1}{' + vn + '}'], t(vt(x, -n) + '=\\frac{1}{' + vt(x, n) + '}') + '; student ' + t(-vn) + ', yours ' + t('\\frac{1}{' + vn + '}'),
              'Correct: ' + t(vt(x, -n) + '=\\frac{1}{' + vt(x, n) + '}') + '.<br>At ' + t(x + '=' + v) + ': the student’s ' + t('-' + v + '^{' + n + '}=-' + vn) + ', but ' + t('\\frac{1}{' + v + '^{' + n + '}}=\\frac{1}{' + vn + '}') + '. Since ' + t('-' + vn + '\\neq\\frac{1}{' + vn + '}') + ', the student’s form is wrong.', [HN], 'x^-n check by substitution');
            p.bad = [['-' + vt(x, n), String(-vn), String(-vn)], ['\\frac{1}{' + vt(x, n) + '}', String(vn), '\\frac{1}{' + vn + '}']];
            return p;
          } }] },
      { num: '9', stem: function (sh) { return 'A student writes ' + t('\\dfrac{1}{' + vt(sh.x, -sh.n) + '}=\\dfrac{1}{' + vt(sh.x, sh.n) + '}') + '.'; },
        shared: function (r) { return { x: r.pick(['x', 'x', 'a', 'm', 'y', 't', 'k']), n: r.int(2, 4), v: r.pick([3, 3, 2]) }; },
        parts: [
          { id: 'e9a', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var x = sh.x, n = sh.n;
            return P.mc(r, 'What went wrong?', [
              { html: 'They made the exponent positive but left the factor in the denominator. It must also change level: ' + t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '.', right: true },
              { html: 'They should have made the answer negative: ' + t('-\\frac{1}{' + vt(x, n) + '}') + '.', why: 'A negative exponent never makes the value negative.' },
              { html: 'Nothing — ' + t('\\frac{1}{' + vt(x, -n) + '}') + ' and ' + t('\\frac{1}{' + vt(x, n) + '}') + ' are equal.', why: 'Try ' + t(x + '=' + sh.v) + ': they give different values.' },
              { html: 'They should have kept the negative exponent: the expression is already simplified.', why: 'The answer must have positive exponents — and it must still equal the original.' }],
              'A factor with a negative exponent changes <b>level</b> (moves across the fraction bar) as its exponent turns positive. So ' + t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '.', [HM], '1/x^-n error');
          } },
          { id: 'e9b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var x = sh.x, n = sh.n, v = sh.v, vn = Math.pow(v, n);
            var p = P.fields('Give the correct form, and check it by substituting ' + t(x + '=' + sh.v) + ' into the original expression.', [
              { name: 'Correct form', label: 'Correct form', mode: 'math', keys: 'expo', vars: [x], before: t('\\dfrac{1}{' + vt(x, -n) + '}=') }, { name: 'Check', label: 'Original at ' + t(x + '=' + v), mode: 'math', keys: 'fraction', before: t('\\dfrac{1}{' + v + '^{-' + n + '}}=') }],
              [K.expo(vt(x, n), { diag: function (an, ast) { return same(ast, '\\frac{1}{' + vt(x, n) + '}') ? { code: 'u2l6-unflipped-den', hint: 'That’s the student’s answer: the factor has to move up too.' } : null; } }), exactChk([vn, 1], function (val) { return near(val, 1 / vn) ? { code: 'flip-back', hint: t(v + '^{-' + n + '}=\\frac{1}{' + vn + '}') + ', and ' + t('1\\div\\frac{1}{' + vn + '}=' + vn) + '.' } : null; })],
              [vt(x, n), String(vn)], t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '; at ' + t(x + '=' + v) + ' both give ' + t(vn),
              t('\\frac{1}{' + vt(x, -n) + '}=' + vt(x, n)) + '.<br>Check at ' + t(x + '=' + v) + ': ' + t(v + '^{-' + n + '}=\\frac{1}{' + vn + '}') + ', so ' + t('\\frac{1}{' + v + '^{-' + n + '}}=1\\div\\frac{1}{' + vn + '}=' + vn) + ', and ' + t(v + '^{' + n + '}=' + vn) + ' ✓', [HM, 'Dividing by a fraction: multiply by its reciprocal.'], '1/x^-n corrected and checked');
            p.bad = [['\\frac{1}{' + vt(x, n) + '}', String(vn)], [vt(x, n), '\\frac{1}{' + vn + '}']];
            return p;
          } }] },
      /* ================= Extra C ================= */
      { num: '10', section: 'Part C — A negative exponent on a fraction', stem: 'If the whole base is a fraction, the negative exponent flips it: take the reciprocal of the fraction, then raise it to the positive exponent. Evaluate each expression as an exact fraction or whole number.', parts: [
        { id: 'e10a', level: 'EMG', outcome: 'AN3', make: function (r) { var pq = pickWhere(function () { return [r.int(2, 6), r.int(3, 7)]; }, function (v) { return v[0] < v[1] && ex.gcd(v[0], v[1]) === 1; }); return fracBasePart(pq[0], pq[1], 2); } },
        { id: 'e10b', level: 'BEG', outcome: 'AN3', make: function (r) { var pq = pickWhere(function () { return [r.int(2, 9), r.int(2, 11)]; }, function (v) { return v[0] !== v[1] && ex.gcd(v[0], v[1]) === 1; }); return fracBasePart(pq[0], pq[1], 1); } },
        { id: 'e10c', level: 'BEG', outcome: 'AN3', make: function (r) { var c = r.chance(0.35) ? [2, r.int(3, 6)] : r.pick(powPool(function (b, n) { return Math.pow(b, n) <= 1000 && b <= 12; })); return fracBasePart(1, c[0], c[1]); } },
        { id: 'e10d', level: 'PRG', outcome: 'AN3', make: function (r) { var pq = pickWhere(function () { return [r.int(1, 4), r.int(2, 7)]; }, function (v) { return v[0] < v[1] && ex.gcd(v[0], v[1]) === 1; }), n = Math.pow(pq[1], 3) <= 343 && r.chance(0.75) ? 3 : 1; return fracBasePart(pq[0], pq[1], n, true); } }] },
      { num: '11', stem: 'Rewrite each expression with positive exponents.', parts: [
        { id: 'e11a', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r), n = r.int(2, 5); return fracPow(Dv(Mn(1, [[ls[0], 1]]), Mn(1, [[ls[1], 1]])), n); } },
        { id: 'e11b', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.int(2, 5), q = r.int(2, 3); return fracPow(Dv(Mn(k, [[ls[0], 1]]), Mn(1, [[ls[1], q]])), 2); } },
        { id: 'e11c', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.int(2, 9), p = r.int(2, 4); return fracPow(Dv(Mn(k, [[ls[0], p]]), Mn(1, [[ls[1], 1]])), 1); } }] },
      { num: '12', stem: function (sh) { return '<b>Justify the flip.</b> Start from ' + t('\\left(\\dfrac{' + sh.a + '}{' + sh.b + '}\\right)^{-' + sh.n + '}') + ': apply the negative exponent rule first, then the power of a quotient law, then simplify the complex fraction.'; },
        shared: function (r) { var ls = L2(r); return { a: ls[0], b: ls[1], n: r.int(2, 5) }; },
        parts: [
          { id: 'e12a', level: 'PRG', outcome: 'AN3', make: function (r, sh) {
            var a = sh.a, b = sh.b, n = sh.n, q = '\\frac{' + vt(a, n) + '}{' + vt(b, n) + '}', f = '\\frac{' + vt(b, n) + '}{' + vt(a, n) + '}';
            function powQ(target, msg) { return function (resp) { var a1 = K.read(resp); if (a1.res) return a1.res; var st = ex.parse(target).ast; if (!ex.equiv(a1.ast, st, [a, b], 6)) { if (ex.equiv(a1.ast, ex.parse(target === q ? f : q).ast, [a, b], 6)) return wrong('no-flip', msg); if (ex.equiv(a1.ast, ex.parse('\\frac{' + a + '}{' + b + '}').ast, [a, b], 6) || ex.equiv(a1.ast, ex.parse('\\frac{' + b + '}{' + a + '}').ast, [a, b], 6)) return wrong('no-power', 'Raise the top and the bottom to the power ' + t(n) + '.'); return wrong('value', null); } if (/\\left\(|\(/.test(String(resp)) && ex.analyze(a1.ast).flags.nested) return form('brackets', 'Right value — now apply the power to the top and to the bottom separately.'); if (ex.analyze(a1.ast).flags.negExp) return form('neg-exp', 'Right value — write it with positive exponents.'); return ok(); }; }
            var p = P.fields('Fill in each step.', [
              { name: 'Power of a quotient', label: 'Power of a quotient law', mode: 'math', keys: 'expo', vars: [a, b], before: t('\\left(\\frac{' + a + '}{' + b + '}\\right)^{-' + n + '}=\\frac{1}{\\left(\\frac{' + a + '}{' + b + '}\\right)^{' + n + '}}=\\frac{1}{\\ \\square\\ }') + ', where ' + t('\\square=') },
              { name: 'Simplified', label: 'Simplify the complex fraction', mode: 'math', keys: 'expo', vars: [a, b], before: t('\\frac{1}{' + q + '}=') }],
              [powQ(q, 'This step only raises the top and the bottom to the power ' + t(n) + ' — no flip yet.'), powQ(f, 'Dividing ' + t('1') + ' by a fraction gives its <b>reciprocal</b>.')],
              [q, f], t('\\frac{1}{(' + a + '/' + b + ')^{' + n + '}}=\\frac{1}{' + q + '}=' + f),
              t('\\left(\\frac{' + a + '}{' + b + '}\\right)^{-' + n + '}=\\frac{1}{\\left(\\frac{' + a + '}{' + b + '}\\right)^{' + n + '}}') + ' (negative exponent rule)<br>' + t('=\\frac{1}{' + q + '}') + ' (power of a quotient)<br>' + t('=1\\times ' + f + '=' + f) + ' (dividing by a fraction multiplies by its reciprocal).', ['Power of a quotient: ' + t('\\left(\\frac{a}{b}\\right)^{n}=\\frac{a^{n}}{b^{n}}') + '.', t('1\\div\\frac{p}{q}=\\frac{q}{p}') + '.'], 'justify the flip');
            p.bad = [[f, f], [q, q]];
            return p;
          } },
          { id: 'e12b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'State the general result for ' + t('\\left(\\dfrac{a}{b}\\right)^{-n}') + '.', [{ html: t('\\left(\\dfrac{a}{b}\\right)^{-n}=\\dfrac{b^{n}}{a^{n}}'), right: true }, { html: t('\\left(\\dfrac{a}{b}\\right)^{-n}=-\\dfrac{a^{n}}{b^{n}}'), why: HN }, { html: t('\\left(\\dfrac{a}{b}\\right)^{-n}=\\dfrac{a^{-n}}{b^{n}}'), why: 'The power goes to the top <b>and</b> the bottom.' }, { html: t('\\left(\\dfrac{a}{b}\\right)^{-n}=\\dfrac{b}{a^{n}}'), why: 'After flipping, both the top and the bottom are raised to the power ' + t('n') + '.' }],
              'Exactly as in (a): ' + t('\\left(\\frac{a}{b}\\right)^{-n}=\\frac{1}{a^{n}/b^{n}}=\\frac{b^{n}}{a^{n}}=\\left(\\frac{b}{a}\\right)^{n}') + ' — flip the fraction and make the exponent positive.', [HF], 'general flip rule');
          } }] },
      /* ================= Extra D ================= */
      { num: '13', section: 'Part D — Deriving the rule and working backwards', stem: function (sh) { return '<b>Where the rule comes from.</b> Simplify ' + t('\\dfrac{' + vt(sh.x, sh.a) + '}{' + vt(sh.x, sh.b) + '}') + ' in two different ways.'; },
        shared: function (r) { var a = r.int(2, 5); return { x: r.pick(['x', 'x', 'a', 'y', 'm', 't']), a: a, b: a + r.int(2, 4) }; },
        parts: [
          { id: 'e13a', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var x = sh.x, a = sh.a, b = sh.b, d = b - a;
            var p = P.fields('Fill in the two exponents.', [{ name: 'Quotient law', label: 'Quotient law', before: t('\\frac{' + vt(x, a) + '}{' + vt(x, b) + '}=' + x + '^{' + a + '-' + b + '}=' + x + '^{\\square}') + ', where ' + t('\\square=') }, { name: 'Cancelling', label: 'Writing out and cancelling', before: t('\\frac{' + vt(x, a) + '}{' + vt(x, b) + '}=\\frac{1}{' + x + '^{\\square}}') + ', where ' + t('\\square=') }],
              [K.number(-d, function (v) { return v === d ? { code: 'sign-exp', hint: 'Top minus bottom: ' + t(a + '-' + b) + ' is negative.' } : v === a + b ? { code: 'add-exp', hint: 'Dividing <b>subtracts</b>.' } : null; }), K.number(d, function (v) { return v === -d ? { code: 'sign-exp', hint: 'After cancelling, ' + t(d) + ' factors of ' + t(x) + ' are left in the denominator — a positive count.' } : null; })],
              [String(-d), String(d)], t(x + '^{' + (-d) + '}') + ' and ' + t('\\frac{1}{' + vt(x, d) + '}'),
              'Quotient law: ' + t(x + '^{' + a + '-' + b + '}=' + x + '^{' + (-d) + '}') + '.<br>Cancelling: ' + t('\\frac{' + Array(a + 1).join(x + '\\cdot ').slice(0, -6) + '}{' + Array(b + 1).join(x + '\\cdot ').slice(0, -6) + '}=\\frac{1}{' + vt(x, d) + '}') + ' (' + t(a) + ' factors cancel, ' + t(d) + ' are left below).', ['Write out each power as repeated factors and cancel pairs.'], 'derive x^-n two ways');
            p.bad = [[String(d), String(d)], [String(-d), String(-d)]];
            return p;
          } },
          { id: 'e13b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var x = sh.x, d = sh.b - sh.a;
            return P.mc(r, 'Set the two results equal. What have you just proved?', [{ html: t(x + '^{-' + d + '}=\\dfrac{1}{' + vt(x, d) + '}') + ' — the negative exponent rule.', right: true }, { html: t(x + '^{-' + d + '}=-' + vt(x, d)) + '.', why: 'Both results describe the same positive quantity; nothing became negative.' }, { html: t(x + '^{-' + d + '}=0') + ', because the powers cancel.', why: 'Cancelling leaves ' + t('\\frac{1}{' + vt(x, d) + '}') + ', not ' + t('0') + '.' }, { html: 'Nothing: the two methods give different answers.', why: 'They are two ways of simplifying the same expression, so they must agree.' }],
              'Both methods simplify the same expression, so ' + t(x + '^{-' + d + '}=\\frac{1}{' + vt(x, d) + '}') + ' — which is exactly the negative exponent rule.', [HN], 'what was proved');
          } }] },
      { num: '14', stem: 'Determine the value of the unknown exponent in each equation.', parts: [
        { id: 'e14a', level: 'PRG', outcome: 'AN3', make: function (r) { var b = r.pick([2, 2, 3]), n = b === 2 ? r.int(2, 9) : r.int(2, 6); return unknownExp(b + '^{n}', '\\frac{1}{' + Math.pow(b, n) + '}', -n, b, n); } },
        { id: 'e14b', level: 'PRG', outcome: 'AN3', make: function (r) { var c = r.pick(powPool(function (b, n) { return b >= 4 && b <= 12 && Math.pow(b, n) <= 1000; })), b = c[0], n = c[1]; return unknownExp(b + '^{n}', '\\frac{1}{' + Math.pow(b, n) + '}', -n, b, n); } },
        { id: 'e14c', level: 'EMG', outcome: 'AN3', make: function (r) { var x = r.pick(['x', 'x', 'y', 'm', 'b', 't']), n = r.int(2, 12); return P.number('Find ' + t('a') + ': ' + t(x + '^{-a}=\\dfrac{1}{' + vt(x, n) + '}'), n, function (v) { return v === -n ? { code: 'u2l6-pos-sign', hint: 'The exponent is already written as ' + t('-a') + '. ' + t('-a=-' + n) + ', so ' + t('a') + ' is positive.' } : null; }, t('\\frac{1}{' + vt(x, n) + '}=' + x + '^{-' + n + '}') + ', so ' + t('-a=-' + n) + ' and ' + t('a=' + n) + '.', [HN], 'x^-a = 1/x^n'); } },
        { id: 'e14d', level: 'PRG', outcome: 'AN3', make: function (r) { var n = r.int(1, 6), dec = '0.' + Array(n).join('0') + '1'; return unknownExp('10^{n}', dec, -n, 10, n); } }] },
      { num: '15', stem: 'Determine the value of the unknown exponent in each equation.', parts: [
        { id: 'e15a', level: 'PRG', outcome: 'AN3', make: function (r) { var c = r.pick(powPool(function (b, n) { return b <= 5 && Math.pow(b, n) <= 1000; })), b = c[0], n = c[1]; return unknownExp(b + '^{n}', '\\frac{1}{' + Math.pow(b, n) + '}', -n, b, n); } },
        { id: 'e15b', level: 'ADV', outcome: 'AN3', make: function (r) { var q = r.pick([2, 2, 3, 4, 5]), n = q === 2 ? r.int(2, 6) : q === 3 ? r.int(2, 4) : r.int(2, 3), V = Math.pow(q, n); return P.number('Find ' + t('n') + ': ' + t('\\left(\\dfrac{1}{' + q + '}\\right)^{n}=' + F(V)), -n, function (v) { return v === n ? { code: 'u2l6-pos-sign', hint: t('\\left(\\frac{1}{' + q + '}\\right)^{' + n + '}=\\frac{1}{' + F(V) + '}') + ', not ' + t(F(V)) + '. You need the fraction flipped.' } : null; }, t(F(V) + '=' + q + '^{' + n + '}=\\left(\\frac{1}{' + q + '}\\right)^{-' + n + '}') + ' (a negative exponent flips the fraction), so ' + t('n=-' + n) + '.', [HF, 'Write ' + t(F(V)) + ' as a power of ' + t(q) + ' first.'], '(1/q)^n = q^m'); } },
        { id: 'e15c', level: 'PRG', outcome: 'AN3', make: function (r) { var c = r.pick(powPool(function (b, n) { return b >= 4 && b <= 15 && Math.pow(b, n) <= 1000; })), b = c[0], n = c[1]; return unknownExp(b + '^{n}', '\\frac{1}{' + Math.pow(b, n) + '}', -n, b, n); } },
        { id: 'e15d', level: 'ADV', outcome: 'AN3', make: function (r) { var x = r.pick(['x', 'x', 'a', 'y', 'm']), a = r.int(2, 7), c = r.int(1, 5), n = -(a + c); return P.number('Find ' + t('n') + ': ' + t(vt(x, a) + '\\cdot ' + x + '^{n}=\\dfrac{1}{' + vt(x, c) + '}'), n, function (v) { return v === -c ? { code: 'one-exp', hint: 'The ' + t(vt(x, a)) + ' is multiplied in too: ' + t(a + '+n=-' + c) + '.' } : v === c - a ? { code: 'sign-exp', hint: t('\\frac{1}{' + vt(x, c) + '}=' + x + '^{-' + c + '}') + ', so ' + t(a + '+n=-' + c) + '.' } : v === a + c ? { code: 'u2l6-pos-sign', hint: 'Check the sign: ' + t(a + '+n=-' + c) + '.' } : null; }, t('\\frac{1}{' + vt(x, c) + '}=' + x + '^{-' + c + '}') + '. Product law: ' + t(x + '^{' + a + '+n}=' + x + '^{-' + c + '}') + ', so ' + t(a + '+n=-' + c) + ' and ' + t('n=' + n) + '.', [HN, 'Write the right side as a single power of ' + t(x) + ', then match the exponents.'], 'x^a·x^n = 1/x^c'); } }] },
      { num: '16', stem: 'Without a calculator, arrange the following from <b>least to greatest</b>. (Write each one as an exact fraction first.)', parts: [
        { id: 'e16', level: 'PRG', outcome: 'AN3', make: function (r) {
          var items = pickWhere(function () {
            var nb = r.pick([2, 3]), neg = { tex: '(-' + nb + ')^{-' + (nb === 2 ? 3 : r.pick([1, 3])) + '}' }, big = { tex: '\\left(\\tfrac{1}{' + r.int(2, 4) + '}\\right)^{-1}' };
            var pool = ['2^{-3}', '3^{-2}', '5^{-1}', '2^{-2}', '4^{-1}', '3^{-1}', '6^{-1}', '7^{-1}', '2^{-4}', '10^{-1}', '4^{-2}', '9^{-1}', '8^{-1}'], pick = r.sample(pool, 3).map(function (x) { return { tex: x }; });
            var all = [neg, big].concat(pick); all.forEach(function (x, i) { x.v = vOf(x.tex); x.id = 'o' + i; }); return all;
          }, function (all) { var vs = all.map(function (x) { return x.v; }).sort(); return vs.every(function (v, i) { return !i || Math.abs(v - vs[i - 1]) > 1e-9; }); });
          var sorted = items.slice().sort(function (a, b) { return a.v - b.v; });
          return orderPart(r, 'Arrange from least to greatest: ' + items.map(function (x) { return t(x.tex); }).join(', ') + '.', items, sorted.map(function (x) { return t(x.tex + '=' + frTex(R(Math.round(x.v * 720720), 720720))); }).join(', ') + '.<br>So ' + t(sorted.map(function (x) { return x.tex; }).join('<')) + '.', [HN, 'A negative base to an odd power is negative — it is the smallest. A fraction to the power ' + t('-1') + ' flips to a whole number.'], 'order negative powers', function (x, y) { return { code: 'order', hint: t(x.tex + '=' + frTex(R(Math.round(x.v * 720720), 720720))) + ' is bigger than ' + t(y.tex + '=' + frTex(R(Math.round(y.v * 720720), 720720))) + '. Write each as a fraction before comparing.' }; });
        } }] },
      { num: '17', stem: 'Without a calculator, arrange the following from <b>least to greatest</b>. Exactly two of them are equal.',
        shared: function (r) {
          var p = r.pick([2, 2, 3]), pairA = p + '^{-2}', pairB = (p * p) + '^{-1}';
          var pool = (p === 2 ? ['8^{-1}', '3^{-1}', '16^{-1}', '2^{-3}', '5^{-1}', '2^{-1}', '32^{-1}'] : ['8^{-1}', '2^{-2}', '27^{-1}', '2^{-1}', '5^{-1}', '4^{-1}', '3^{-3}']).filter(function (x) { return Math.abs(vOf(x) - 1 / (p * p)) > 1e-9; });
          var others = pickWhere(function () { return r.sample(pool, 3); }, function (s) { var vs = s.map(vOf); return vs.every(function (v, i) { return vs.indexOf(v) === i; }); });
          var big = '\\left(\\tfrac{1}{' + r.pick([3, 2, 4]) + '}\\right)^{-1}';
          var items = [pairA, pairB, big].concat(others).map(function (x, i) { return { id: 'q' + i, tex: x, v: vOf(x) }; });
          return { p: p, items: items, A: pairA, B: pairB };
        },
        parts: [
          { id: 'e17a', level: 'PRG', outcome: 'AN3', make: function (r, sh) {
            var sorted = sh.items.slice().sort(function (a, b) { return a.v - b.v; });
            return orderPart(r, 'Arrange from least to greatest: ' + sh.items.map(function (x) { return t(x.tex); }).join(', ') + '. (The two equal ones may go in either order.)', sh.items.map(function (x) { return { id: x.id, tex: x.tex, v: x.v }; }), sorted.map(function (x) { return t(x.tex + '=' + frTex(R(Math.round(x.v * 720720), 720720))); }).join(', ') + '.<br>So ' + t(sorted.map(function (x) { return x.tex; }).join('\\le ')) + '.', [HN, 'Write each one as a fraction. With the same top, the bigger the bottom, the smaller the fraction.'], 'order with a tie');
          } },
          { id: 'e17b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var p = sh.p, others = sh.items.filter(function (x) { return x.tex !== sh.A && x.tex !== sh.B; });
            return P.mc(r, 'Which two of ' + sh.items.map(function (x) { return t(x.tex); }).join(', ') + ' are equal, and why?', [
              { html: t(sh.A) + ' and ' + t(sh.B) + ', because ' + t(p + '^{2}=' + p * p) + ', so both are ' + t('\\frac{1}{' + p * p + '}') + '.', right: true },
              { html: t(others[0].tex) + ' and ' + t(others[1].tex) + ', because both have a negative exponent.', why: 'Work each out: ' + t(others[0].tex + '=' + frTex(R(Math.round(others[0].v * 720720), 720720))) + ' and ' + t(others[1].tex + '=' + frTex(R(Math.round(others[1].v * 720720), 720720))) + '.' },
              { html: t(sh.A) + ' and ' + t(sh.B) + ', because ' + t('-2=-1\\times 2') + '.', why: 'The reason is the value: both equal ' + t('\\frac{1}{' + p * p + '}') + ' because ' + t(p + '^{2}=' + p * p) + '.' },
              { html: 'None of them are equal; different bases always give different values.', why: 'Different bases can give the same value: ' + t(p + '^{2}=' + p * p) + '.' }],
              t(sh.A + '=\\frac{1}{' + p + '^{2}}=\\frac{1}{' + p * p + '}') + ' and ' + t(sh.B + '=\\frac{1}{' + p * p + '}') + ': equal, because ' + t(p + '^{2}=' + p * p) + '.', [HN], 'which two equal');
          } }] },
      /* ================= Extra E ================= */
      { num: '18', section: 'Part E — Stretch', stem: 'Simplify, leaving your answer with positive exponents. Work from the inside out: the bracket first, then the division.', parts: [
        { id: 'e18', level: 'ADV', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.pick([2, 2, 3]), a = r.int(1, 3), n = r.int(2, 3), c = r.int(2, 5); if (k === 3) n = 2; return nchain(Dv(Pw(Mn(k, [[x, -a]]), -n), Mn(1, [[x, -c]])), { text: '(kx^-a)^-n / x^-c' }); } }] },
      { num: '19', stem: 'Simplify each expression, leaving your answer with positive exponents.', parts: [
        { id: 'e19a', level: 'ADV', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.int(2, 5); return nchain(Pw(Dv(Mn(k, [[ls[0], -r.int(1, 2)]]), Mn(1, [[ls[1], r.int(1, 3)]])), -2), { text: '(ka^-1/b^2)^-2' }); } },
        { id: 'e19b', level: 'ADV', outcome: 'AN3', make: function (r) { var ls = L2(r), a = r.int(2, 4), b = r.int(2, 3); return nchain(Dv(Pw(Mn(1, [[ls[0], -a], [ls[1], 1]]), -2), Pw(Mn(1, [[ls[0], 1], [ls[1], -b]]), r.int(2, 3))), { text: '(x^-a y)^-2/(xy^-b)^3' }); } },
        { id: 'e19c', level: 'ADV', outcome: 'AN3', make: function (r) { var x = L1(r), k = r.int(2, 9); return nchain(Pw(Dv(Mn(k, [[x, -r.int(1, 4)]]), Mn(1, [[x, r.int(2, 6)]])), -1), { text: '(km^-a/m^b)^-1' }); } }] },
      { num: '20', stem: 'Evaluate each expression as an exact fraction.', parts: [
        { id: 'e20a', level: 'PRG', outcome: 'AN3', make: function (r) { var b = r.pick([2, 2, 3, 4, 5]), k = b === 2 ? r.int(3, 5) : b === 3 ? r.int(3, 4) : 3, terms = [], V = R(0); for (var i = 1; i <= k; i++) { terms.push(b + '^{-' + i + '}'); V = R(V[0] * Math.pow(b, i) + V[1], V[1] * Math.pow(b, i)); } return sumPart(terms, V, b); } },
        { id: 'e20b', level: 'PRG', outcome: 'AN3', make: function (r) { var b = r.int(3, 12), V = R(b + 1, b * b); return sumPart([b + '^{-1}', b + '^{-2}'], V, b); } },
        { id: 'e20c', level: 'ADV', outcome: 'AN3', make: function (r) {
          var ab = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (v) { return v[0] < v[1]; }), a = ab[0], b = ab[1], S = R(a + b, a * b), V = rinv(S);
          return exP(t('\\left(' + a + '^{-1}+' + b + '^{-1}\\right)^{-1}'), V, function (v) { if (near(v, a + b)) return { code: 'split-sum', hint: 'The outside ' + t('-1') + ' can’t be applied to each term. Add the fractions inside first: ' + t('\\frac{1}{' + a + '}+\\frac{1}{' + b + '}') + '.' }; if (near(v, S[0] / S[1])) return { code: 'not-flipped', hint: 'That’s the bracket. Now apply the outside ' + t('-1') + ': flip it.' }; return null; },
            'Inside first: ' + t(a + '^{-1}+' + b + '^{-1}=\\frac{1}{' + a + '}+\\frac{1}{' + b + '}=\\frac{' + b + '}{' + a * b + '}+\\frac{' + a + '}{' + a * b + '}=' + frTex(S)) + '.<br>Then flip: ' + t('\\left(' + frTex(S) + '\\right)^{-1}=' + frTex(V)) + '.', ['Finish the addition inside the bracket before the outside exponent.', 'Common denominator: ' + t(a * b) + '.'], '(a^-1+b^-1)^-1', { bad: [String(a + b), frTex(S)] });
        } }] },
      { num: '21', stem: function (sh) { return 'Is it true that ' + t('(a+b)^{-1}=a^{-1}+b^{-1}') + '? Test it with ' + t('a=' + sh.a) + ' and ' + t('b=' + sh.b) + '.'; },
        shared: function (r) { var ab = pickWhere(function () { return [r.int(2, 6), r.int(2, 7)]; }, function (v) { return v[0] < v[1]; }); return { a: ab[0], b: ab[1] }; },
        parts: [
          { id: 'e21a', level: 'PRG', outcome: 'AN3', make: function (r, sh) {
            var a = sh.a, b = sh.b, Lv = R(1, a + b), Rv = R(a + b, a * b);
            var p = P.fields('Find the exact value of both sides.', [{ name: 'Left', label: 'Left side', mode: 'math', keys: 'fraction', before: t('(' + a + '+' + b + ')^{-1}=') }, { name: 'Right', label: 'Right side', mode: 'math', keys: 'fraction', before: t(a + '^{-1}+' + b + '^{-1}=') }],
              [exactChk(Lv, function (v) { return near(v, Rv[0] / Rv[1]) ? { code: 'split-sum', hint: 'Add first: ' + t(a + '+' + b + '=' + (a + b)) + ', then take the reciprocal.' } : null; }), exactChk(Rv, function (v) { return near(v, 1 / (a + b)) ? { code: 'split-sum', hint: 'Work out each term: ' + t('\\frac{1}{' + a + '}+\\frac{1}{' + b + '}') + '.' } : near(v, 2 / (a + b)) ? { code: 'value', hint: 'To add fractions, use a common denominator: ' + t(a * b) + '.' } : null; })],
              [frTex(Lv), frTex(Rv)], 'Left ' + t(frTex(Lv)) + ', right ' + t(frTex(Rv)),
              'Left: ' + t('(' + a + '+' + b + ')^{-1}=' + (a + b) + '^{-1}=' + frTex(Lv)) + '.<br>Right: ' + t('\\frac{1}{' + a + '}+\\frac{1}{' + b + '}=\\frac{' + b + '+' + a + '}{' + a * b + '}=' + frTex(Rv)) + '.', ['Left: add inside the bracket first. Right: work out each power, then add the fractions.'], 'test (a+b)^-1');
            p.bad = [[frTex(Rv), frTex(Rv)], [frTex(Lv), frTex(Lv)]];
            return p;
          } },
          { id: 'e21b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'What is your conclusion?', [{ html: 'Not true: the two sides are different, so an exponent can’t be distributed over a <b>sum</b>.', right: true }, { html: 'True: the power ' + t('-1') + ' always distributes over brackets.', why: 'Your two values are different — one counterexample is enough to show it is false.' }, { html: 'True for these numbers only.', why: 'The two sides came out different, so it is not true even for these numbers.' }, { html: 'Not true, because negative exponents only work on single numbers.', why: 'They work on any nonzero base — including a sum. The issue is splitting the power over the ' + t('+') + '.' }],
              t('(' + sh.a + '+' + sh.b + ')^{-1}=' + frTex(R(1, sh.a + sh.b))) + ' but ' + t(sh.a + '^{-1}+' + sh.b + '^{-1}=' + frTex(R(sh.a + sh.b, sh.a * sh.b))) + '. They differ, so ' + t('(a+b)^{-1}\\neq a^{-1}+b^{-1}') + ' in general: exponents don’t distribute over a sum.', ['Compare your two values.'], '(a+b)^-1 conclusion');
          } }] },
      { num: '22', stem: function (sh) { return 'If ' + t(sh.x + '^{-2}=\\dfrac{1}{' + sh.v * sh.v + '}') + ':'; },
        shared: function (r) { return { x: r.pick(['x', 'x', 'a', 'y', 'm', 't']), v: r.int(2, 9), w: r.int(2, 4) }; },
        parts: [
          { id: 'e22a', level: 'MAS', outcome: 'AN3', make: function (r, sh) {
            var x = sh.x, v = sh.v, v2 = v * v;
            return { prompt: 'Determine <b>all</b> possible values of ' + t(x) + '.', input: { type: 'list' }, key: [-v, v], answer: t(-v + ',\\ ' + v),
              check: function (resp) {
                if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
                var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + t(resp[i]) + ' more than once.'); seen[resp[i]] = 1; }
                var bad = resp.filter(function (u) { return u !== v && u !== -v; });
                if (bad.length) { var u = bad[0]; if (u === -2 || u === 2) return wrong('u2l6-not-root', 'The ' + t('-2') + ' is the exponent, not the answer. ' + t(x + '^{-2}=\\frac{1}{' + x + '^{2}}') + ', so ' + t(x + '^{2}=' + v2) + '.'); if (u === v2 || u === -v2) return wrong('u2l6-not-root', 'You need ' + t(x + '^{2}=' + v2) + ', so ' + t(x) + ' is a number that <b>squares</b> to ' + t(v2) + '.'); return wrong('u2l6-not-root', 'Check: ' + t('(' + u + ')^{-2}=\\frac{1}{' + F(u * u) + '}') + ', not ' + t('\\frac{1}{' + v2 + '}') + '.'); }
                if (resp.length < 2) return wrong('u2l6-one-root', 'There is another value: a negative number squared is positive too.');
                return ok();
              }, solution: t(x + '^{-2}=\\frac{1}{' + x + '^{2}}=\\frac{1}{' + v2 + '}') + ', so ' + t(x + '^{2}=' + v2) + '. Both ' + t(x + '=' + v) + ' and ' + t(x + '=-' + v) + ' work, because ' + t('(-' + v + ')^{2}=' + v2) + ' too.',
              hints: ['Rewrite ' + t(x + '^{-2}') + ' with a positive exponent: ' + t('\\frac{1}{' + x + '^{2}}=\\frac{1}{' + v2 + '}') + ', so ' + t(x + '^{2}=') + '?', 'Which numbers square to ' + t(v2) + '? There are two.'], text: 'all x with x^-2 = 1/v²', bad: [[v], [v2], [-v2, v2]] };
          } },
          { id: 'e22b', level: 'PRG', outcome: 'AN3', make: function (r, sh) {
            var x = sh.x, w = sh.w, w3 = w * w * w;
            return P.mc(r, 'Why is there more than one answer here, but only one answer when ' + t(x + '^{-3}=\\dfrac{1}{' + w3 + '}') + '?', [
              { html: 'An <b>even</b> power erases the sign, so ' + t(x) + ' and ' + t('-' + x) + ' both work; an <b>odd</b> power keeps the sign, so only ' + t(x + '=' + w) + ' works (' + t('(-' + w + ')^{3}=-' + w3) + ').', right: true },
              { html: 'Negative exponents always give two answers, but cubes don’t allow negatives.', why: 'The number of answers comes from even vs odd powers: ' + t('(-' + w + ')^{3}=-' + w3) + ', so ' + t('-' + w) + ' fails for the cube.' },
              { html: 'There is only one answer in both cases; the negative values never work.', why: 'Check ' + t('(-' + sh.v + ')^{-2}=\\frac{1}{' + sh.v * sh.v + '}') + ' — it works.' },
              { html: 'The cube has two answers too: ' + t(w) + ' and ' + t('-' + w) + '.', why: t('(-' + w + ')^{-3}=\\frac{1}{(-' + w + ')^{3}}=-\\frac{1}{' + w3 + '}') + ' — wrong sign.' }],
              'For ' + t(x + '^{-2}') + ': ' + t(x + '^{2}=' + sh.v * sh.v) + ' has two solutions, ' + t('\\pm' + sh.v) + ', because an even power erases the sign. For ' + t(x + '^{-3}=\\frac{1}{' + w3 + '}') + ': ' + t(x + '^{3}=' + w3) + ', and an odd power keeps the sign, so only ' + t(x + '=' + w) + ' works.', ['Try the negative value in each equation.'], 'even vs odd power solutions');
          } }] }
    ]
  });

  /* ---------- part makers used above ---------- */
  function evalVal(b, n, prompt) {
    var bn = Math.pow(b, n), V = R(1, bn), tx = b + '^{-' + n + '}';
    return exP(prompt || t(tx), V, function (v) {
      if (near(v, -bn)) return { code: 'opposite', hint: HN };
      if (near(v, -b * n) || near(v, b * n)) return { code: 'base-times-exp', hint: 'A power isn’t base × exponent, and a negative exponent means reciprocal: ' + t(tx + '=\\frac{1}{' + b + '^{' + n + '}}') + '.' };
      if (near(v, bn)) return { code: 'not-flipped', hint: 'Take the reciprocal: ' + t('\\frac{1}{' + F(bn) + '}') + '.' };
      if (near(v, 1 / (b * n)) && b * n !== bn) return { code: 'base-times-exp', hint: t(b + '^{' + n + '}') + ' means ' + t(b) + ' multiplied by itself ' + n + ' times.' };
      return null;
    }, t(tx + '=\\frac{1}{' + b + '^{' + n + '}}=' + frTex(V)) + '.', [HN, HE], 'evaluate ' + tx, { bad: [String(-bn), String(-b * n), String(bn)] });
  }
  function coefNeg(k, x, n, inDen) {
    var m = inDen ? M(k, [[x, n]]) : M(k, [[x, -n]]), shown = inDen ? '\\dfrac{' + k + '}{' + vt(x, -n) + '}' : k + vt(x, -n);
    var ws = inDen ? [W('\\frac{' + k + '}{' + vt(x, n) + '}', 'u2l6-unflipped-den', 'The factor has to change sides as its exponent turns positive: ' + t(vt(x, -n)) + ' moves up.'), W('\\frac{' + vt(x, n) + '}{' + k + '}', 'coef-side', 'Only ' + t(vt(x, -n)) + ' moves; the ' + t(k) + ' stays on top.'), W('-' + k + vt(x, n), 'opposite', HN)]
      : [W('\\frac{1}{' + k + vt(x, n) + '}', 'coef-side', 'The ' + t('-' + n) + ' is on ' + t(x) + ' only, so the ' + t(k) + ' stays on top.'), W('-' + k + vt(x, n), 'opposite', HN), W(k + vt(x, n), 'not-flipped', 'Make the exponent positive <b>and</b> move ' + t(x) + ' below the bar.')];
    return X(t(shown), m, ws, inDen ? t(vt(x, -n)) + ' is in the denominator with a negative exponent, so it moves up and turns positive; the ' + t(k) + ' stays on top: ' + t(shown + '=' + posTex(m)) + '.' : 'The exponent ' + t('-' + n) + ' belongs to ' + t(x) + ' only, so ' + t(vt(x, -n)) + ' moves down and the ' + t(k) + ' stays on top: ' + t(shown + '=' + posTex(m)) + '.', [HONLY, HM], inDen ? 'k/x^-n' : 'kx^-n');
  }
  function coefQuot(r, one) {
    var x = L1(r), d = r.int(2, 6), q = r.int(2, 5), a = one ? 1 : r.int(2, 4), b = a + r.int(3, 7);
    return nchain(Dv(Mn(d * q, [[x, a]]), Mn(d, [[x, b]]), 'pdiv'), { hint: 'Divide the coefficients, subtract the exponents, then move the negative power below the bar.', text: 'Ax^a ÷ dx^b' });
  }
  function fracPow(inner, n) {
    var tree = Pw(inner, -n), innerV = ev(inner), noFlip = powM(innerV, n);
    return nchain(tree, { wrongs: [W(posTex(noFlip), 'no-flip', 'You raised the fraction to the power ' + t(n) + ' but didn’t flip it. The negative exponent flips the fraction first.'), W(posTex(rinvM(innerV)), 'no-power', 'Good flip — now raise the top and the bottom to the power ' + t(n) + '.')], hint: HF, text: '(a/b)^-n' });
  }
  function rinvM(m) { var v = {}; Object.keys(m.v).forEach(function (x) { v[x] = -m.v[x]; }); return { c: rinv(m.c), v: v }; }
  function unknownExp(lhs, rhs, n, b, m) {
    return P.number('Find ' + t('n') + ': ' + t(lhs + '=' + (/frac/.test(rhs) ? rhs.replace('\\frac', '\\dfrac') : rhs)), n, function (v) {
      if (v === -n) return { code: 'u2l6-pos-sign', hint: t(b + '^{' + m + '}=' + F(Math.pow(b, m))) + ', but the right side is its <b>reciprocal</b> — that needs a negative exponent.' };
      if (v === -Math.pow(b, m)) return { code: 'opposite', hint: 'The exponent is the small number: ' + t(rhs + '=\\frac{1}{' + b + '^{' + m + '}}=' + b + '^{\\square}') + '.' };
      return null;
    }, t(rhs + '=\\frac{1}{' + b + '^{' + m + '}}=' + b + '^{-' + m + '}') + ', so ' + t('n=' + n) + '.', [HN, 'Write the right side as ' + t('1') + ' over a power of ' + t(b) + ' first.'], b + '^n = 1/' + b + '^' + m);
  }
  function sumPart(terms, V, b) {
    var tx = terms.join('+'), fr = terms.map(function (x) { var m = /\^\{-(\d+)\}/.exec(x); return '\\frac{1}{' + Math.pow(b, Number(m[1])) + '}'; });
    return exP(t(tx), V, function (v) { if (near(v, -V[0] / V[1])) return { code: 'opposite', hint: HN }; return null; }, t(tx + '=' + fr.join('+') + '=' + frTex(V)) + ' (common denominator ' + t(V[1]) + ').', [HN, 'Write each term as a fraction, then add with a common denominator.'], 'sum of b^-n', { bad: [frTex(R(-V[0], V[1]))] });
  }
})(window);
