/* Math 15 · Unit 2 · Lesson 4 — Combining Exponent Laws (AN3)
 * Assignment 4 (u2_L04.tex, Questions 1–14) and the whole Lesson 4 Extra Practice (u2_EP04.tex, Questions 1–17).
 * Every part is a generator: same structure, idea and difficulty as the booklet (the booklet's numbers are among the
 * possible values), new numbers from the seed. Expressions are built as small trees (monomial, bracket to a power,
 * product, quotient) so the key, the worked solution and the typical wrong answers all follow from the question:
 * each wrong answer is the same tree evaluated with one misconception switched on (coefficient not raised, exponents
 * added in a power of a power, multiplied in the product law, added in the quotient law, coefficients subtracted,
 * a hidden exponent of 1 ignored, only the top of a bracketed fraction raised, a cancelled letter kept, …).
 * Conversions (no free-text explaining): "compare / why / which route" → multiple choice whose options are reasons;
 * "true or false, if false correct it" → one multiple choice (True, or False with the correct simplification);
 * "find the error" → multiple choice naming the step and the slip, then the correct form; "say which variable
 * cancels" → a letter box beside the simplified expression; substitution checks → number boxes.
 * Math 15 levels: LIM BEG EMG PRG ADV MAS. Mastery: Extra 11(b) and 12(a) (working backwards). Outcome AN3 throughout. */
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
    'u2l4-which-var': 'Named the wrong letter as the one that cancels', 'u2l4-no-divide': 'Working backwards: didn’t undo the power (divide by it)',
    'u2l4-undo-sign': 'Working backwards: undid the quotient law the wrong way', 'u2l4-gave-coef': 'Working backwards: gave the coefficient instead of the exponent',
    'u2l4-mult-div': 'Missing factor: multiplied instead of dividing', 'u2l4-sub-value': 'Substitution: value worked out wrongly'
  });
  HW.addPartial({ 'u2l4-which-var': 's', 'u2l4-no-divide': 'b', 'u2l4-undo-sign': 'b', 'u2l4-gave-coef': 'n', 'u2l4-mult-div': 'n', 'u2l4-sub-value': 's' });

  /* ======================= shared exponent engine (same in u2l4–u2l6) ======================= */
  function R(p, q) { return ex.norm(p, q == null ? 1 : q); }
  function rmul(a, b) { return R(a[0] * b[0], a[1] * b[1]); }
  function rinv(a) { return R(a[1], a[0]); }
  function rpow(a, n) { if (n < 0) { a = rinv(a); n = -n; } return R(Math.pow(a[0], n), Math.pow(a[1], n)); }
  function near(x, y) { return ex.eq(x, y, 1e-9); }
  function frTex(a) { return a[1] === 1 ? F(a[0]) : (a[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(a[0])) + '}{' + F(a[1]) + '}'; }
  function pickWhere(gen, test) { for (var i = 0; i < 800; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u2l4: no value found'); }
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
      if (plainNum(n)) return F(n.a.m.c[0]) + '^{' + n.n + '}';
      return (n.a.t === '/' && n.a.s === 'frac' ? '\\left(' + tex(n.a) + '\\right)' : '(' + tex(n.a) + ')') + '^{' + n.n + '}';
    }
    if (n.t === '*') return n.xs.map(function (x, i) { return (n.sep === '' && x.t === 'm' && i > 0 && !(x.m.c[0] === 1 && x.m.c[1] === 1)) || (x.t === '/' && x.s === 'div') ? '(' + tex(x) + ')' : tex(x); }).join(n.sep);
    if (n.s === 'pdiv') return '(' + tex(n.a) + ')\\div(' + tex(n.b) + ')';
    return n.s === 'div' ? tex(n.a) + '\\div ' + tex(n.b) : '\\dfrac{' + tex(n.a) + '}{' + tex(n.b) + '}';
  }
  function plainNum(n) { return n.t === 'p' && n.a.t === 'm' && !Object.keys(n.a.m.v).length && n.a.m.c[1] === 1 && n.a.m.c[0] > 0; }
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
      if (n.n < 0 && n.a.t === '/' && o.neg) {
        var fa = ev(n.a.a), fb = ev(n.a.b), noNeg = function (m) { return Object.keys(m.v).every(function (x) { return m.v[x] >= 0; }); };
        if (noNeg(fa) && noNeg(fb)) {
          var m2 = -n.n, flipT = '\\left(\\frac{' + qTex(fb) + '}{' + qTex(fa) + '}\\right)^{' + m2 + '}', fr = powM(quo(fb, fa), m2);
          L.push('Negative exponent on a fraction: flip it and make the exponent positive, ' + t(tex(n) + '=' + flipT) + '.');
          L.push('Power law (raise the top and the bottom): ' + t(flipT + '=\\frac{' + posTex(powM(fb, m2)) + '}{' + posTex(powM(fa, m2)) + '}' + (sameTex(posTex(fr), '\\frac{' + posTex(powM(fb, m2)) + '}{' + posTex(powM(fa, m2)) + '}') && posTex(fr) === '\\frac{' + posTex(powM(fb, m2)) + '}{' + posTex(powM(fa, m2)) + '}' ? '' : '=' + posTex(fr))) + '.');
          return fr;
        }
      }
      var inner = solve(n.a, L, o), res = powM(inner, n.n);
      if (!Object.keys(inner.v).length) { L.push((n.n < 0 ? 'Negative exponent (reciprocal): ' : 'Power: ') + t((plainNum(n) ? tex(n) : '\\left(' + cT(inner.c) + '\\right)^{' + n.n + '}') + '=' + (n.n < -1 ? '\\frac{1}{' + cP(inner.c) + '^{' + (-n.n) + '}}=' : '') + cT(res.c)) + '.'); return res; }
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
    if (o.neg && Object.keys(res.v).some(function (x) { return res.v[x] < 0; }) && L[L.length - 1].indexOf('=' + posTex(res) + '\\)') < 0) L.push('Positive exponents: ' + t(rawNeg(res) + '=' + posTex(res)) + '.');
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

  /* ---------- common hints and letters ---------- */
  var HO = 'Work the checklist: (1) clear each bracket — the outside power goes to the coefficient <b>and</b> every letter; (2) combine matching bases — add exponents when multiplying, subtract when dividing; (3) multiply or divide the coefficients.';
  var HW_ = 'Power law: ' + t('(2x^{3})^{2}=2^{2}x^{3\\times 2}=4x^{6}') + ' — the coefficient is raised too.';
  var HIN = 'A bracket with a fraction inside: simplify <b>inside</b> first (divide the coefficients, subtract the exponents), then apply the outside power to what is left.';
  var HTWO = 'Treat each letter separately: combine the ' + t('x') + '’s with the ' + t('x') + '’s and the ' + t('y') + '’s with the ' + t('y') + '’s.';
  var ONE = ['x', 'x', 'a', 'b', 'm', 'y', 'p', 'n', 't', 'k', 'c', 'd', 'w', 'z'];
  var PAIRS = [['x', 'y'], ['x', 'y'], ['a', 'b'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['r', 's'], ['c', 'd'], ['u', 'v'], ['x', 'z'], ['h', 'k']];
  function L1(r) { return r.pick(ONE); }
  function L2(r) { return r.pick(PAIRS); }

  HW.defineLesson({
    id: 'u2l4', unit: 2, num: '4', title: 'Combining Exponent Laws', outcome: 'AN3',
    blurb: 'Two and three exponent laws in one expression: clear the brackets, combine matching bases, then the coefficients.',
    questions: [
      /* ================= Part A ================= */
      { num: '1', section: 'Part A — Warm-up and two-law combinations', stem: 'Simplify each expression using just <b>one</b> law (a quick warm-up review).', parts: [
        { id: '1a', level: 'LIM', outcome: 'AN3', make: function (r) { var l = L1(r); return chain(Mul([Mn(1, [[l, r.int(2, 6)]]), Mn(1, [[l, r.int(2, 6)]])]), { hint: 'Product law: same base, multiply → <b>add</b> the exponents.', text: 'product law warm-up' }); } },
        { id: '1b', level: 'LIM', outcome: 'AN3', make: function (r) { var l = L1(r), m = r.int(6, 10); return chain(Dv(Mn(1, [[l, m]]), Mn(1, [[l, r.int(2, m - 2)]]), 'div'), { hint: 'Quotient law: same base, divide → <b>subtract</b> the exponents.', text: 'quotient law warm-up' }); } },
        { id: '1c', level: 'LIM', outcome: 'AN3', make: function (r) { var l = L1(r); return chain(Pw(Mn(1, [[l, r.int(2, 5)]]), r.int(2, 4)), { hint: 'Power of a power: <b>multiply</b> the exponents.', text: 'power of a power warm-up' }); } },
        { id: '1d', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.pick([2, 2, 3, 4, 5]), n = k === 2 ? r.int(2, 4) : k === 3 ? r.int(2, 3) : 2; return chain(Pw(Mn(k, [[l, 1]]), n), { hint: 'Power of a product: both the ' + t(k) + ' and the ' + t(l) + ' are raised to the power ' + t(n) + '.', text: 'power of a product warm-up' }); } }] },
      { num: '2', stem: 'Simplify. Apply the power law first, then the product law.', parts: [
        { id: '2a', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.pick([2, 2, 3]), n = k === 2 ? r.pick([2, 2, 3]) : 2; return chain(Mul([Pw(Mn(k, [[l, r.int(2, 4)]]), n), Mn(1, [[l, r.int(2, 5)]])]), { text: '(kx^p)^n × x^q' }); } },
        { id: '2b', level: 'BEG', outcome: 'AN3', make: function (r) { var l = L1(r); return chain(Mul([Pw(Mn(r.pick([2, 3, 3]), [[l, r.int(2, 4)]]), 2), Mn(r.int(2, 4), [[l, r.int(2, 5)]])]), { text: '(ka^p)^2 × ca^q' }); } }] },
      { num: '3', stem: 'Simplify. Apply the power law first, then the quotient law.', parts: [
        { id: '3a', level: 'BEG', outcome: 'AN3', make: function (r) {
          var l = L1(r), kd = r.pick([[4, 2], [4, 2], [2, 2], [3, 3], [4, 8], [5, 5], [6, 4], [6, 9], [6, 3], [3, 9]]), p = r.int(2, 4), q = r.int(1, 2 * p - 1);
          return chain(Dv(Pw(Mn(kd[0], [[l, p]]), 2), Mn(kd[1], [[l, q]])), { text: '(kx^p)^2 / dx^q' });
        } },
        { id: '3b', level: 'BEG', outcome: 'AN3', make: function (r) {
          var l = L1(r), n = r.pick([3, 4, 4]), d = r.pick([2, 4]), p = r.int(2, 3), q = r.int(2, n * p - 1);
          return chain(Dv(Pw(Mn(2, [[l, p]]), n), Mn(d, [[l, q]])), { text: '(2b^p)^n / db^q' });
        } }] },
      { num: '4', stem: 'Simplify. Each expression has two variable bases.', parts: [
        { id: '4a', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r); return chain(Mul([Pw(Mn(1, [[ls[0], r.int(2, 3)], [ls[1], 1]]), r.int(2, 3)), Mn(1, [[ls[0], r.int(2, 4)], [ls[1], r.int(1, 3)]])]), { hint: HTWO, text: '(a^p b)^n × a^r b^s' }); } },
        { id: '4b', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r); return chain(Mul([Pw(Mn(1, [[ls[0], 1], [ls[1], r.int(2, 3)]]), r.int(2, 3)), Mn(1, [[ls[0], r.int(2, 4)], [ls[1], 1]])]), { hint: HTWO, text: '(xy^q)^n × x^r y' }); } }] },
      { num: '5', stem: 'Simplify.', parts: [
        { id: '5a', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.int(2, 4), p = r.int(2, 3); return chain(Dv(Pw(Mn(k, [[ls[0], p], [ls[1], 1]]), 2), Mn(1, [[ls[0], r.int(1, 2 * p - 1)], [ls[1], 1]])), { hint: HTWO, text: '(kx^p y)^2 / x^r y' }); } },
        { id: '5b', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r), k = r.int(2, 5), p = r.int(2, 3), q = r.int(2, 3); return chain(Dv(Pw(Mn(k, [[ls[0], p], [ls[1], q]]), 2), Mn(k, [[ls[0], r.int(1, 2 * p - 1)], [ls[1], r.int(1, 2 * q - 1)]])), { hint: HTWO, text: '(ka^p b^q)^2 / ka^r b^s' }); } }] },
      /* ================= Part B ================= */
      { num: '6', section: 'Part B — Two brackets and three-step simplification', stem: 'Simplify. There are two brackets to clear before you combine bases.', parts: [
        { id: '6a', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r); return chain(Mul([Pw(Mn(r.int(2, 3), [[l, r.int(2, 4)]]), 2), Pw(Mn(r.int(2, 3), [[l, 1]]), 2)]), { text: '(k1x^p)^2 × (k2x)^2' }); } },
        { id: '6b', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r); return chain(Mul([Pw(Mn(1, [[ls[0], r.int(2, 3)], [ls[1], 1]]), r.int(2, 3)), Pw(Mn(1, [[ls[0], 1], [ls[1], r.int(2, 3)]]), r.int(2, 3))]), { hint: HTWO, text: '(a^p b)^m × (ab^q)^n' }); } }] },
      { num: '7', stem: 'Simplify. These combine all three steps of the checklist.', parts: [
        { id: '7a', level: 'PRG', outcome: 'AN3', make: function (r) {
          var l = L1(r), c = r.pick([[2, 3, 2], [2, 3, 4], [2, 3, 4], [3, 2, 3], [3, 2, 9], [2, 2, 2]]), p = r.int(2, 3), q = r.int(2, 4), top = c[1] * p + q, s = r.int(2, top - 1);
          return chain(Dv(Mul([Pw(Mn(c[0], [[l, p]]), c[1]), Mn(1, [[l, q]])]), Mn(c[2], [[l, s]])), { text: '(kx^p)^n × x^q / dx^r' });
        } },
        { id: '7b', level: 'PRG', outcome: 'AN3', make: function (r) {
          var ls = L2(r), k = r.pick([3, 3, 2]), d = r.pick([k * k, k * k, k]), p = r.int(2, 3), s = r.int(2, 4), ra = r.int(2, 2 * p), ub = r.int(1, 1 + s);
          return chain(Dv(Mul([Pw(Mn(k, [[ls[0], p], [ls[1], 1]]), 2), Mn(1, [[ls[0], 1], [ls[1], s]])]), Mn(d, [[ls[0], ra], [ls[1], ub]])), { hint: HTWO, text: '(ka^p b)^2 × ab^s / da^r b^u' });
        } }] },
      { num: '8', stem: 'Simplify. Simplify inside the brackets first, then apply the outer power.', parts: [
        { id: '8a', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), c = r.int(2, 4), B = r.int(2, 3), q = r.int(1, 3), p = q + r.int(1, 3); return chain(Pw(Dv(Mn(c * B, [[l, p]]), Mn(B, [[l, q]])), 2), { hint: HIN, text: '(Ax^p/Bx^q)^2' }); } },
        { id: '8b', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r), c = r.pick([2, 3, 3]), B = r.int(2, 4), ra = r.int(1, 3), pa = ra + r.int(2, 4), sb = 1, qb = sb + r.int(1, 2); return chain(Pw(Dv(Mn(c * B, [[ls[0], pa], [ls[1], qb]]), Mn(B, [[ls[0], ra], [ls[1], sb]])), 2), { hint: HIN, text: '(Aa^p b^q / Ba^r b)^2' }); } }] },
      { num: '9', stem: 'Simplify. Simplify inside the brackets, apply the outer power, then multiply once more.', parts: [
        { id: '9a', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), c = r.pick([2, 3, 3]), B = r.int(2, 3); return chain(Mul([Pw(Dv(Mn(c * B, [[ls[0], r.int(2, 4)], [ls[1], 2]]), Mn(B, [[ls[0], 1], [ls[1], 1]])), 2), Mn(1, [[ls[0], r.int(2, 3)]])]), { hint: HIN, text: '(Ax^p y^2/Bxy)^2 × x^r' }); } },
        { id: '9b', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), c = r.pick([2, 2, 3]), B = r.int(2, 3); return chain(Mul([Pw(Dv(Mn(c * B, [[ls[0], r.int(2, 3)], [ls[1], 1]]), Mn(B, [[ls[0], 1], [ls[1], 1]])), 3), Mn(1, [[ls[1], r.int(2, 4)]])]), { hint: HIN, text: '(Aa^p b/Bab)^3 × b^r' }); } }] },
      /* ================= Part C ================= */
      { num: '10', section: 'Part C — Mixed practice', stem: 'Simplify.', parts: [
        { id: '10', level: 'PRG', outcome: 'AN3', make: function (r) { var ls = L2(r), k1 = r.pick([2, 3, 3]), k2 = r.pick([2, 2, 3]), n2 = k2 === 2 ? r.pick([2, 3, 3]) : 2; return chain(Mul([Pw(Mn(k1, [[ls[0], r.int(2, 3)], [ls[1], r.int(2, 3)]]), 2), Pw(Mn(k2, [[ls[0], 1], [ls[1], 1]]), n2)]), { hint: HTWO, text: '(k1x^p y^q)^2 × (k2xy)^n' }); } }] },
      { num: '11', stem: 'Simplify.', parts: [
        { id: '11', level: 'PRG', outcome: 'AN3', make: function (r) {
          var ls = L2(r), k = r.int(2, 5), p = r.int(3, 4), q = r.int(2, 3), ra = r.int(2, 2 * p - 1), sb = r.int(2 * q - 1, 2 * q), ua = r.int(1, 3), wb = r.int(1, 2);
          return chain(Mul([Dv(Pw(Mn(k, [[ls[0], p], [ls[1], q]]), 2), Mn(k * k, [[ls[0], ra], [ls[1], sb]])), Mn(1, [[ls[0], ua], [ls[1], wb]])]), { hint: HTWO, text: '(ka^p b^q)^2 / k²a^r b^s × a^u b^w' });
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', outcome: 'AN3', make: function (r) {
          var l = L1(r), k = r.pick([2, 2, 3]), p = r.int(2, 3), n = 3, kn = Math.pow(k, n), e = n * p + 1, shown = '(' + k + vt(l, p) + ')^{' + n + '}\\times ' + l;
          var opts = [{ html: t(kn + vt(l, e)), right: true },
            { html: t(k + vt(l, e)), why: 'The ' + t(k) + ' is inside the bracket, so it is cubed too: ' + t(k + '^{3}=' + kn) + '.' },
            { html: t(kn + vt(l, n * p)), why: 'Don’t lose the last ' + t(l) + ': it is ' + t(l + '^{1}') + ', so it adds ' + t('1') + ' to the exponent.' },
            { html: t((k * n) + vt(l, e)), why: t(k + '^{3}') + ' means ' + t(k + '\\times ' + k + '\\times ' + k + '=' + kn) + ', not ' + t(k + '\\times 3') + '.' }];
          return P.mc(r, 'The simplified form of ' + t(shown) + ' is', opts, 'Power law: ' + t('(' + k + vt(l, p) + ')^{3}=' + k + '^{3}' + l + '^{' + p + '\\times 3}=' + kn + vt(l, n * p)) + '.<br>Product law: ' + t(kn + vt(l, n * p) + '\\times ' + l + '^{1}=' + kn + l + '^{' + (n * p) + '+1}=' + kn + vt(l, e)) + '.', [HO], 'MC (kx^p)^3 × x');
        } }] },
      { num: '13', stem: '<i>(Evaluate)</i>', parts: [
        { id: '13', level: 'EMG', outcome: 'AN3', make: function (r) {
          var c = pickWhere(function () { var b = r.pick([2, 2, 2, 3, 3, 5]), a1 = r.int(2, 5), a2 = r.int(2, 5), d = r.int(1, b === 2 ? 3 : 2), n = r.pick([2, 2, 3]); return [b, a1, a2, a1 + a2 - d, n, d]; }, function (c) { return c[3] >= 2 && Math.pow(c[0], c[5] * c[4]) <= 729; });
          var b = c[0], a1 = c[1], a2 = c[2], s = c[3], n = c[4], d = c[5], e = d * n, shown = '\\left(\\dfrac{' + b + '^{' + a1 + '}\\times ' + b + '^{' + a2 + '}}{' + b + '^{' + s + '}}\\right)^{' + n + '}';
          return evalPart('Simplify ' + t(shown) + ' to a single power, then evaluate it as a single number.', b, e, {
            exp: function (N) { if (N === d + n) return { code: 'add-power', hint: 'Power of a power: <b>multiply</b> ' + t(d) + ' by ' + t(n) + '.' }; if (N === (a1 + a2 + s) * n) return { code: 'add-exp', hint: 'Dividing by ' + t(b + '^{' + s + '}') + ' <b>subtracts</b> ' + t(s) + '.' }; if (N === (a1 * a2 - s) * n) return { code: 'mult-exp', hint: 'Product law: <b>add</b> the exponents on top.' }; return null; },
            sol: 'Inside: ' + t(b + '^{' + a1 + '+' + a2 + '-' + s + '}=' + b + '^{' + d + '}') + '.<br>Outer power: ' + t('(' + b + '^{' + d + '})^{' + n + '}=' + b + '^{' + d + '\\times ' + n + '}=' + b + '^{' + e + '}=' + F(Math.pow(b, e))) + '.',
            hints: ['Simplify inside the bracket first (add the exponents on top, subtract the bottom one), then multiply by the outside exponent.'], text: 'evaluate (b^m b^n / b^s)^k' });
        } }] },
      { num: '14', stem: '<i>(Challenge)</i> Simplify.', parts: [
        { id: '14', level: 'ADV', outcome: 'AN3', make: function (r) {
          var ls = L2(r), c = pickWhere(function () { return [r.pick([2, 3, 3]), r.int(2, 4), r.int(2, 9)]; }, function (c) { var top = c[0] * c[0] * c[1]; return top % c[2] === 0 && top / c[2] >= 2 && top / c[2] <= 12 && c[2] !== c[0] * c[0] && c[2] !== c[1]; });
          var p = r.int(2, 3), q = r.int(2, 3), ra = r.int(2, 2 * p), sb = r.int(1, 2 + q - 1);
          return chain(Dv(Mul([Pw(Mn(c[0], [[ls[0], p], [ls[1], 1]]), 2), Mn(c[1], [[ls[0], 1], [ls[1], q]])], ''), Mn(c[2], [[ls[0], ra], [ls[1], sb]])), { hint: HTWO, text: '(ka^p b)^2(ca b^q)/(da^r b^s)' });
        } }] }],

    extra: [
      /* ================= Extra A ================= */
      { num: '1', section: 'Part A — Long chains: three or more laws in one expression', stem: 'Each expression needs the power law <b>twice</b> before anything else can be combined. Clear both brackets, then finish.', parts: [
        { id: 'e1a', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r); return chain(Mul([Pw(Mn(r.pick([2, 3]), [[l, r.int(2, 4)]]), 2), Pw(Mn(r.pick([2, 3]), [[l, r.int(2, 3)]]), 3)]), { text: '(k1x^p)^2 × (k2x^q)^3' }); } },
        { id: 'e1b', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r); return chain(Mul([Pw(Mn(1, [[ls[0], r.int(2, 3)], [ls[1], r.int(2, 4)]]), 2), Pw(Mn(1, [[ls[0], r.int(2, 4)], [ls[1], 1]]), 3)]), { hint: HTWO, text: '(a^p b^q)^2 × (a^r b)^3' }); } },
        { id: 'e1c', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r); return chain(Mul([Pw(Mn(r.pick([2, 3]), [[l, r.int(2, 3)]]), 3), Pw(Mn(r.pick([2, 3]), [[l, r.int(2, 4)]]), 2)]), { text: '(k1m^p)^3 × (k2m^q)^2' }); } }] },
      { num: '2', stem: 'Clear the bracket, multiply the top together, then divide. Three laws each.', parts: [
        { id: 'e2a', level: 'PRG', outcome: 'AN3', make: function (r) {
          var ls = L2(r), d = r.pick([2, 4, 4]), p = r.int(2, 3), q = r.int(2, 3), ra = r.int(2, 3 * p + q - 1), sb = r.int(1, 2);
          return chain(Dv(Mul([Pw(Mn(2, [[ls[0], p], [ls[1], 1]]), 3), Mn(1, [[ls[0], q]])]), Mn(d, [[ls[0], ra], [ls[1], sb]])), { hint: HTWO, text: '(2x^p y)^3 × x^q / dx^r y^s' });
        } },
        { id: 'e2b', level: 'PRG', outcome: 'AN3', make: function (r) {
          var ls = L2(r), c = pickWhere(function () { return [r.pick([2, 3, 3]), r.int(2, 3), r.pick([2, 3, 4, 6, 9])]; }, function (c) { var top = c[0] * c[0] * c[1]; return top % c[2] === 0 && top / c[2] >= 2 && top / c[2] <= 9; });
          var p = r.int(2, 3), q = r.int(2, 4), ra = r.int(2, 2 * p), sb = r.int(2, 1 + q);
          return chain(Dv(Mul([Pw(Mn(c[0], [[ls[0], p], [ls[1], 1]]), 2), Mn(c[1], [[ls[0], 1], [ls[1], q]])], ''), Mn(c[2], [[ls[0], ra], [ls[1], sb]])), { hint: HTWO, text: '(ka^p b)^2(ca b^q)/(da^r b^s)' });
        } }] },
      { num: '3', stem: 'Here the numerator <b>and</b> the denominator are each bracketed. Raise <b>both</b> coefficients before you divide anything.',
        shared: function (r) { var c = r.pick([[2, 3, 4, 2], [2, 3, 4, 2], [2, 3, 2, 2], [4, 2, 2, 3], [3, 3, 9, 2], [2, 3, 3, 2], [3, 2, 2, 3], [2, 3, 8, 2], [2, 4, 4, 3], [3, 2, 3, 3]]), s = c[1] === 4 || c[3] === 4 ? 1 : r.pick([1, 1, 2]); return { l: L1(r), k1: c[0], m: c[1], k2: c[2], n: c[3], p: c[3] * s, q: c[1] * s }; },
        parts: [
          { id: 'e3a', level: 'PRG', outcome: 'AN3', make: function (r, sh) { return chain(Dv(Pw(Mn(sh.k1, [[sh.l, sh.p]]), sh.m), Pw(Mn(sh.k2, [[sh.l, sh.q]]), sh.n)), { text: '(k1x^p)^m/(k2x^q)^n, letter cancels' }); } },
          { id: 'e3b', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return chain(Dv(Pw(Mn(sh.k2, [[sh.l, sh.q]]), sh.n), Pw(Mn(sh.k1, [[sh.l, sh.p]]), sh.m)), { text: '(k2x^q)^n/(k1x^p)^m, letter cancels' }); } },
          { id: 'e3c', level: 'PRG', outcome: 'AN3', make: function (r) {
            var ls = L2(r), k = r.pick([2, 2, 3]), p = r.int(2, 3), q = r.int(2, 3), ra = r.int(1, 2), sb = r.int(1, 2);
            return chain(Dv(Pw(Mn(k, [[ls[0], p], [ls[1], q]]), 4), Pw(Mn(k * k, [[ls[0], ra], [ls[1], sb]]), 2)), { hint: HTWO, text: '(ka^p b^q)^4/(k²a^r b^s)^2' });
          } },
          { id: 'e3d', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var A = rpow(R(sh.k1), sh.m), B = rpow(R(sh.k2), sh.n), va = rmul(A, rinv(B));
            return P.mc(r, 'Compare your answers to (a) ' + t(tex(Dv(Pw(Mn(sh.k1, [[sh.l, sh.p]]), sh.m), Pw(Mn(sh.k2, [[sh.l, sh.q]]), sh.n)))) + ' and (b) ' + t(tex(Dv(Pw(Mn(sh.k2, [[sh.l, sh.q]]), sh.n), Pw(Mn(sh.k1, [[sh.l, sh.p]]), sh.m)))) + '. What do you notice, and why does it happen?', [
              { html: 'They are <b>reciprocals</b> of each other, because expression (b) is expression (a) turned upside down.', right: true },
              { html: 'They are <b>equal</b>, because both use the same numbers and letters.', why: 'Same pieces, but in (b) the top and bottom have swapped places. Dividing the other way round gives the reciprocal.' },
              { html: 'They are <b>opposites</b> (one is the negative of the other), because the division is the other way round.', why: 'Dividing the other way round flips the fraction; it doesn’t change the sign. Both answers are positive.' },
              { html: 'They can’t be compared, because the letter is still in one of them.', why: 'In both, ' + t(sh.l) + ' cancels completely: ' + t(vt(sh.l, sh.p * sh.m) + '\\div ' + vt(sh.l, sh.q * sh.n) + '=' + sh.l + '^{0}=1') + '.' }],
              '(a) gives ' + t(frTex(va)) + ' and (b) gives ' + t(frTex(rinv(va))) + ': they are reciprocals. Expression (b) is (a) upside down (numerator and denominator swapped), so its value is ' + t('1') + ' divided by the value of (a).', ['Look at where each bracket sits in (a) and in (b).'], 'compare reciprocal answers');
          } }] },
      { num: '4', stem: 'In each of these, <b>one of the two variables cancels completely</b>. Say which one, and give the simplified expression.', parts: [
        { id: 'e4a', level: 'EMG', outcome: 'AN3', make: function (r) { return cancelPart(r, 2, r.pick([2, 2, 3, 4])); } },
        { id: 'e4b', level: 'EMG', outcome: 'AN3', make: function (r) { return cancelPart(r, 2, r.pick([3, 3, 2, 5])); } },
        { id: 'e4c', level: 'EMG', outcome: 'AN3', make: function (r) { return cancelPart(r, 3, r.pick([2, 2, 3])); } }] },
      { num: '5', stem: 'Simplify. Each one mixes a bracket with both a multiplication and a division.', parts: [
        { id: 'e5a', level: 'PRG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.pick([2, 2, 3]), p = r.int(3, 4), q = r.int(2, 3), s = r.int(1, 2); return chain(Dv(Pw(Mn(k, [[l, p]]), 3), Mul([Pw(Mn(k, [[l, q]]), 2), Mn(1, [[l, s]])])), { text: '(kx^p)^3 / ((kx^q)^2 × x^s)' }); } },
        { id: 'e5b', level: 'PRG', outcome: 'AN3', make: function (r) {
          var ls = L2(r), c = pickWhere(function () { return [r.pick([2, 2, 3]), r.int(2, 5), r.pick([2, 3, 4, 6, 8])]; }, function (c) { var top = Math.pow(c[0], 3) * c[1]; return top % c[2] === 0 && top / c[2] >= 2 && top / c[2] <= 12; });
          var p = r.int(2, 3), q = r.int(2, 3), ra = r.int(2, 3 * p), sb = r.int(1, 3 + q - 1);
          return chain(Mul([Pw(Mn(c[0], [[ls[0], p], [ls[1], 1]]), 3), Dv(Mn(c[1], [[ls[0], 1], [ls[1], q]]), Mn(c[2], [[ls[0], ra], [ls[1], sb]]))]), { hint: HTWO, text: '(ka^p b)^3 × ca b^q / da^r b^s' });
        } }] },
      /* ================= Extra B ================= */
      { num: '6', section: 'Part B — Order, checking, and error analysis', stem: function (sh) { return '<b>Does the order matter?</b> Consider ' + t(tex(sh.T)) + '.'; },
        shared: function (r) { var ls = L2(r), c = r.pick([3, 3, 2]), B = r.pick([4, 4, 2, 3]), ra = r.int(1, 3), pa = ra + r.int(2, 3), sb = 1, qb = r.int(2, 3); return { ls: ls, c: c, B: B, A: c * B, T: Pw(Dv(Mn(c * B, [[ls[0], pa], [ls[1], qb]]), Mn(B, [[ls[0], ra], [ls[1], sb]])), 2), top: M(c * B, [[ls[0], pa], [ls[1], qb]]), bot: M(B, [[ls[0], ra], [ls[1], sb]]) }; },
        parts: [
          { id: 'e6a', level: 'EMG', outcome: 'AN3', make: function (r, sh) { return chain(sh.T, { prompt: 'Simplify <b>inside</b> the bracket first, then apply the outer power.', hint: HIN, text: 'inside first' }); } },
          { id: 'e6b', level: 'PRG', outcome: 'AN3', make: function (r, sh) {
            var T2 = powM(sh.top, 2), B2 = powM(sh.bot, 2), res = quo(T2, B2), vs = sh.ls;
            var nr = cleanWrongs([{ tex: posTex({ c: sh.top.c, v: T2.v }), code: 'not-raised', hint: 'Square the coefficient too: ' + t(sh.A + '^{2}=' + sh.A * sh.A) + '.' }, { tex: posTex(powM(sh.top, 2, { addPower: 1 })), code: 'add-power', hint: 'Squaring <b>doubles</b> each exponent.' }], posTex(T2));
            var nb = cleanWrongs([{ tex: posTex({ c: sh.bot.c, v: B2.v }), code: 'not-raised', hint: 'Square the coefficient too: ' + t(sh.B + '^{2}=' + sh.B * sh.B) + '.' }, { tex: posTex(powM(sh.bot, 2, { addPower: 1 })), code: 'add-power', hint: 'Squaring <b>doubles</b> each exponent.' }], posTex(B2));
            function dchk(target, list) { return K.expo(target, { diag: function (an, ast) { for (var i = 0; i < list.length; i++) if (same(ast, list[i].tex)) return { code: list[i].code, hint: list[i].hint }; return null; } }); }
            var ansW = cleanWrongs(chainWrongs(sh.T, res), posTex(res));
            var p = P.fields('Now <b>square the numerator and the denominator first</b>, then divide.', [
              { name: 'Numerator squared', label: 'Numerator squared', before: t('(' + qTex(sh.top) + ')^{2}='), mode: 'math', keys: 'expo', vars: vs },
              { name: 'Denominator squared', label: 'Denominator squared', before: t('(' + qTex(sh.bot) + ')^{2}='), mode: 'math', keys: 'expo', vars: vs },
              { name: 'Answer', label: 'Then divide', mode: 'math', keys: 'expo', vars: vs }],
              [dchk(posTex(T2), nr), dchk(posTex(B2), nb), dchk(posTex(res), ansW)], [posTex(T2), posTex(B2), posTex(res)],
              t('(' + qTex(sh.top) + ')^{2}=' + posTex(T2)) + ', ' + t('(' + qTex(sh.bot) + ')^{2}=' + posTex(B2)) + ', answer ' + t(posTex(res)),
              'Square each part: ' + t('(' + qTex(sh.top) + ')^{2}=' + posTex(T2)) + ' and ' + t('(' + qTex(sh.bot) + ')^{2}=' + posTex(B2)) + '.<br>Divide: ' + t('\\frac{' + posTex(T2) + '}{' + posTex(B2) + '}=' + posTex(res)) + ' — the same answer as (a).', [HW_, 'Every factor in the numerator is squared — the coefficient too. Then divide the coefficients and subtract the exponents.'], 'square top and bottom first');
            p.bad = [[posTex({ c: sh.top.c, v: T2.v }), posTex(B2), posTex(res)], [posTex(T2), posTex(B2), posTex({ c: R(sh.c), v: res.v })]];
            return p;
          } },
          { id: 'e6c', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'Compare the two answers. Which route was less work, and why?', [
              { html: 'Both routes give the same answer; simplifying <b>inside first</b> is less work because the numbers stay small (' + t(sh.c) + ' instead of ' + t(sh.A * sh.A) + ' and ' + t(sh.B * sh.B) + ') and only one coefficient is squared.', right: true },
              { html: 'Both routes give the same answer; squaring <b>first</b> is less work because there is no division to do inside the bracket.', why: 'Squaring first still needs a division at the end — with much bigger numbers (' + t(sh.A * sh.A + '\\div ' + sh.B * sh.B) + ').' },
              { html: 'The two routes give <b>different</b> answers, so only the inside-first route is correct.', why: 'Check your two answers again: they should be identical. Both routes follow the exponent laws.' },
              { html: 'The two routes give <b>different</b> answers, so only the square-first route is correct.', why: 'Check your two answers again: they should be identical. Both routes follow the exponent laws.' }],
              'Both routes give the same answer. Simplifying inside first keeps the numbers small (' + t(sh.A + '\\div ' + sh.B + '=' + sh.c) + ', then ' + t(sh.c + '^{2}=' + sh.c * sh.c) + ') instead of ' + t(sh.A + '^{2}=' + sh.A * sh.A) + ' and ' + t(sh.B + '^{2}=' + sh.B * sh.B) + ', and only one coefficient has to be squared.', ['Look at the sizes of the numbers you worked with in (a) and in (b).'], 'which route is less work');
          } }] },
      { num: '7', stem: function (sh) { return '<b>Error analysis.</b> Bree simplified ' + t(sh.shown) + ' and wrote the work below. Exactly one step is wrong.<br>' + t('\\text{Step 1: }' + sh.s1 + '\\qquad\\text{Step 2: }' + sh.s2 + '\\qquad\\text{Step 3: }' + sh.s3); },
        shared: function (r) {
          var l = L1(r), k2 = r.pick([2, 3, 3]), k1 = k2 * r.pick([2, 2, 3]), p = r.int(3, 4), q = r.int(2, 3), rr = r.int(2, 3), kind = r.pick([1, 1, 2, 3]);
          var A = k1 * k1, B = k2 * k2, e1 = 2 * p, e2 = 2 * rr, sum = e1 + q, shown = '\\dfrac{(' + k1 + vt(l, p) + ')^{2}\\times ' + vt(l, q) + '}{(' + k2 + vt(l, rr) + ')^{2}}';
          var s1, s2, s3;
          if (kind === 1) { s1 = '\\dfrac{' + A + vt(l, e1) + '\\times ' + vt(l, q) + '}{' + k2 + vt(l, e2) + '}'; s2 = '\\dfrac{' + A + vt(l, sum) + '}{' + k2 + vt(l, e2) + '}'; s3 = (A / k2) + vt(l, sum - e2); }
          else if (kind === 2) { s1 = '\\dfrac{' + A + vt(l, e1) + '\\times ' + vt(l, q) + '}{' + B + vt(l, e2) + '}'; s2 = '\\dfrac{' + A + vt(l, e1 * q) + '}{' + B + vt(l, e2) + '}'; s3 = (A / B) + vt(l, e1 * q - e2); }
          else { s1 = '\\dfrac{' + A + vt(l, e1) + '\\times ' + vt(l, q) + '}{' + B + vt(l, e2) + '}'; s2 = '\\dfrac{' + A + vt(l, sum) + '}{' + B + vt(l, e2) + '}'; s3 = (A / B) + vt(l, sum + e2); }
          return { l: l, k1: k1, k2: k2, p: p, q: q, rr: rr, kind: kind, shown: shown, s1: s1, s2: s2, s3: s3, A: A, B: B, e1: e1, e2: e2, sum: sum };
        },
        parts: [
          { id: 'e7a', level: 'PRG', outcome: 'AN3', make: function (r, sh) {
            var l = sh.l, o1 = { html: '<b>Step 1</b>: she squared the ' + t(sh.k1) + ' on top but not the ' + t(sh.k2) + ' on the bottom — ' + t('(' + sh.k2 + vt(l, sh.rr) + ')^{2}=' + sh.B + vt(l, sh.e2)) + '.', right: sh.kind === 1, why: 'Look at the denominator in Step 1 again: is it ' + t('(' + sh.k2 + vt(l, sh.rr) + ')^{2}') + '?' };
            var o2 = { html: '<b>Step 2</b>: she multiplied the exponents ' + t(sh.e1 + '\\times ' + sh.q) + ' instead of adding them.', right: sh.kind === 2, why: 'Check Step 2: ' + t(vt(l, sh.e1) + '\\times ' + vt(l, sh.q) + '=' + l + '^{' + sh.e1 + '+' + sh.q + '}=' + vt(l, sh.sum)) + '. Compare with what she wrote.' };
            var o3 = { html: '<b>Step 3</b>: she added the exponents ' + t(sh.sum + '+' + sh.e2) + ' instead of subtracting them.', right: sh.kind === 3, why: 'Check Step 3: dividing powers <b>subtracts</b> the exponents. Compare with what she wrote.' };
            var o4 = { html: 'No step is wrong — her final answer is correct.', why: 'Exactly one step is wrong. Redo each step yourself and compare.' };
            var why = sh.kind === 1 ? 'Step 1 is the first wrong step: the outside power squares <b>every</b> factor in the bracket, so ' + t('(' + sh.k2 + vt(l, sh.rr) + ')^{2}=' + sh.B + vt(l, sh.e2)) + ', not ' + t(sh.k2 + vt(l, sh.e2)) + '.'
              : sh.kind === 2 ? 'Steps 1 is right. Step 2 is the first wrong step: multiplying powers <b>adds</b> the exponents, ' + t(vt(l, sh.e1) + '\\times ' + vt(l, sh.q) + '=' + vt(l, sh.sum)) + '.'
                : 'Steps 1 and 2 are right. Step 3 is wrong: dividing powers <b>subtracts</b> the exponents, ' + t(l + '^{' + sh.sum + '-' + sh.e2 + '}=' + vt(l, sh.sum - sh.e2)) + '.';
            return P.mc(r, 'Which step is the <b>first</b> incorrect step, and what did she do wrong?', [o1, o2, o3, o4], why, ['Redo the question yourself one step at a time and compare each line with Bree’s.'], 'Bree error analysis', true);
          } },
          { id: 'e7b', level: 'PRG', outcome: 'AN3', make: function (r, sh) {
            var l = sh.l, T = Dv(Mul([Pw(Mn(sh.k1, [[l, sh.p]]), 2), Mn(1, [[l, sh.q]])]), Pw(Mn(sh.k2, [[l, sh.rr]]), 2));
            return chain(T, { prompt: 'Give the correct simplified form of ' + t(sh.shown) + '.', text: 'Bree corrected' });
          } }] },
      { num: '8', stem: '<b>The substitution check.</b> If two expressions are really equal, then substituting the same number into each must give the same value. Simplify each expression, then substitute the given value into the <i>original</i> and into your <i>simplified</i> form to confirm they agree.', parts: [
        { id: 'e8a', level: 'PRG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.pick([2, 2, 3]), p = k === 3 ? 2 : r.pick([2, 3]), q = r.int(1, 2), s = r.int(2 * p + q - 3, 2 * p + q - 1); return subsPart(Dv(Mul([Pw(Mn(k, [[l, p]]), 2), Mn(1, [[l, q]])]), Mn(k * k, [[l, s]])), l, 2); } },
        { id: 'e8b', level: 'PRG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.pick([2, 3, 3]), p = r.int(2, 3), s = r.int(2 * p - 3, 2 * p - 1); return subsPart(Dv(Pw(Mn(k, [[l, p]]), 2), Mn(k * k, [[l, s]])), l, 2); } }] },
      { num: '9', stem: '', parts: [
        { id: 'e9', level: 'PRG', outcome: 'AN3', make: function (r) {
          var l = L1(r), k = 2, p = r.pick([1, 2, 2]), s = r.int(1, 3 * p - 1), T = Dv(Pw(Mn(k, [[l, p]]), 3), Mn(k, [[l, s]])), res = ev(T), ali = 3 * p - s;
          var orig = Math.pow(k * Math.pow(2, p), 3) / (k * Math.pow(2, s)), aliV = Math.pow(2, ali);
          var ws = cleanWrongs(chainWrongs(T, res), posTex(res));
          var p2 = P.fields('Ali claims that ' + t(tex(T) + '=' + vt(l, ali)) + '. Use the substitution check with ' + t(l + '=2') + ' to show that his answer cannot be right, then give the correct simplified form.', [
            { name: 'Original', label: 'Original at ' + t(l + '=2'), before: t(tex(T) + '=') }, { name: 'Ali', label: 'Ali’s answer at ' + t(l + '=2'), before: t(vt(l, ali) + '=') }, { name: 'Correct form', label: 'Correct simplified form', mode: 'math', keys: 'expo', vars: [l] }],
            [K.number(orig, function (v) { if (v === aliV) return { code: 'u2l4-sub-value', hint: 'That’s the value of Ali’s answer. Put ' + t(l + '=2') + ' into the <b>original</b> expression: ' + t('(' + k + '\\times 2^{' + p + '})^{3}') + ' on top.' }; return null; }), K.number(aliV), K.expo(posTex(res), { diag: function (an, ast) { for (var i = 0; i < ws.length; i++) if (same(ast, ws[i].tex)) return { code: ws[i].code, hint: ws[i].hint }; return null; } })],
            [String(orig), String(aliV), posTex(res)], 'Original ' + t('=' + F(orig)) + ', Ali’s ' + t('=' + F(aliV)) + '; correct form ' + t(posTex(res)),
            'At ' + t(l + '=2') + ': top ' + t('(' + k + '\\times ' + Math.pow(2, p) + ')^{3}=' + (k * Math.pow(2, p)) + '^{3}=' + F(Math.pow(k * Math.pow(2, p), 3))) + ', bottom ' + t(k + '\\times ' + Math.pow(2, s) + '=' + k * Math.pow(2, s)) + ', so the original is ' + t(F(orig)) + '. Ali’s ' + t(vt(l, ali)) + ' gives ' + t('2^{' + ali + '}=' + F(aliV)) + '.<br>' + t(F(orig) + '\\neq ' + F(aliV)) + ', so his answer is wrong (he forgot the coefficients).<br>' + solText(T) + '<br>Check: ' + t(posTex(res)) + ' at ' + t(l + '=2') + ' is ' + t(F(orig)) + ' ✓',
            ['Work out the original at ' + t(l + '=2') + ' carefully: the inside of the bracket first, then cube it.', HW_], 'Ali substitution check');
          p2.bad = [[String(aliV), String(aliV), vt(l, ali)], [String(orig), String(aliV), vt(l, ali)]];
          return p2;
        } }] },
      { num: '10', stem: 'True or false? If false, give the correct simplification.', parts: [
        { id: 'e10a', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.pick([2, 2, 3]), p = r.int(2, 4), q = r.int(1, 2 * p - 1); return tfPart(r, Dv(Pw(Mn(k, [[l, p]]), 2), Mn(k, [[l, q]])), r.chance(0.3)); } },
        { id: 'e10b', level: 'EMG', outcome: 'AN3', make: function (r) { var ls = L2(r); return tfPart(r, Mul([Pw(Mn(1, [[ls[0], r.int(2, 3)], [ls[1], 1]]), r.int(2, 3)), Pw(Mn(1, [[ls[0], 1], [ls[1], r.int(2, 3)]]), 2)], ''), r.chance(0.7)); } },
        { id: 'e10c', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), c = r.int(2, 3), B = r.int(2, 4), q = r.int(1, 3); return tfPart(r, Pw(Dv(Mn(c * B, [[l, q + r.int(1, 3)]]), Mn(B, [[l, q]])), 2), r.chance(0.7)); } },
        { id: 'e10d', level: 'EMG', outcome: 'AN3', make: function (r) { var l = L1(r), k = r.pick([2, 3]), c = r.pick([2, 2, 3]), q = r.int(2, 3), p = q + r.int(1, 2); return tfPart(r, Dv(Pw(Mn(c * k, [[l, p]]), 2), Pw(Mn(k, [[l, q]]), 2)), r.chance(0.3)); } }] },
      /* ================= Extra C ================= */
      { num: '11', section: 'Part C — Working backwards, applications, and stretch', stem: 'Find the missing number in each. Match the coefficients <b>and</b> the exponents.', parts: [
        { id: 'e11a', level: 'ADV', outcome: 'AN3', make: function (r) {
          var l = 'x', k = r.pick([2, 2, 3]), n = 3, a = r.int(2, 4), q = r.int(2, 3 * a - 1), e = n * a - q, kn = Math.pow(k, n);
          return P.number('Find ' + t('a') + ': ' + t('\\dfrac{(' + k + l + '^{a})^{' + n + '}}{' + vt(l, q) + '}=' + kn + vt(l, e)), a, function (v) {
            if (v === e + q) return { code: 'u2l4-no-divide', hint: 'The power law <b>multiplied</b> the exponent ' + t('a') + ' by ' + t(n) + '. So ' + t(n + 'a=' + (e + q)) + ' — divide by ' + t(n) + '.' };
            if (n * v === e - q || v * n - q === -e) return { code: 'u2l4-undo-sign', hint: 'After the bracket the top has ' + t(l + '^{' + n + 'a}') + '. Dividing by ' + t(vt(l, q)) + ' gives ' + t(l + '^{' + n + 'a-' + q + '}') + ', so ' + t(n + 'a-' + q + '=' + e) + '.' };
            if (v === e) return { code: 'u2l4-no-divide', hint: t(e) + ' is the exponent of the answer, not ' + t('a') + '. Work backwards through the quotient law and the power law.' };
            return null;
          }, 'Clear the bracket: ' + t('(' + k + l + '^{a})^{' + n + '}=' + kn + l + '^{' + n + 'a}') + '. Divide: ' + t(kn + l + '^{' + n + 'a-' + q + '}') + '.<br>Match the exponents: ' + t(n + 'a-' + q + '=' + e) + ', so ' + t(n + 'a=' + (e + q)) + ' and ' + t('a=' + a) + '.<br>Check: ' + t('(' + k + vt(l, a) + ')^{' + n + '}\\div ' + vt(l, q) + '=' + kn + vt(l, n * a) + '\\div ' + vt(l, q) + '=' + kn + vt(l, e)) + ' ✓', ['Simplify the left side with ' + t('a') + ' still in it. What must its exponent equal?', 'Undo the steps in reverse: add back the ' + t(q) + ', then divide by ' + t(n) + '.'], 'find a in (kx^a)^n/x^q');
        } },
        { id: 'e11b', level: 'MAS', outcome: 'AN3', make: function (r) {
          var l = 'x', k = r.pick([2, 3, 3, 4, 5]), n = k <= 3 ? r.pick([2, 2, 3]) : 2, p = r.int(2, 3), q = r.int(1, n * p - 1), e = n * p - q, kn = Math.pow(k, n);
          return P.number('Find ' + t('n') + ': ' + t('\\dfrac{(' + k + vt(l, p) + ')^{n}}{' + vt(l, q) + '}=' + kn + vt(l, e)), n, function (v) {
            if (v === kn) return { code: 'u2l4-gave-coef', hint: t(kn) + ' is the coefficient. ' + t(n === 2 ? k + '\\times ' + k : k + '\\times ' + k + '\\times ' + k) + '... how many ' + t(k) + '’s multiply to ' + t(kn) + '?' };
            if (v === e || v === e + q) return { code: 'u2l4-no-divide', hint: 'The exponent of ' + t(l) + ' on top is ' + t(p + 'n') + '. So ' + t(p + 'n-' + q + '=' + e) + ' — solve for ' + t('n') + '.' };
            return null;
          }, 'Clear the bracket: ' + t('(' + k + vt(l, p) + ')^{n}=' + k + '^{n}' + l + '^{' + p + 'n}') + ', so the left side is ' + t(k + '^{n}' + l + '^{' + p + 'n-' + q + '}') + '.<br>Coefficients: ' + t(k + '^{n}=' + kn) + ', so ' + t('n=' + n) + '. Exponents agree: ' + t(p + '\\times ' + n + '-' + q + '=' + e) + ' ✓', ['The power ' + t('n') + ' acts on the ' + t(k) + ' too. Which power of ' + t(k) + ' is ' + t(kn) + '?', 'Check your ' + t('n') + ' with the exponent of ' + t(l) + ' as well.'], 'find n in (kx^p)^n/x^q');
        } },
        { id: 'e11c', level: 'ADV', outcome: 'AN3', make: function (r) {
          var l = 'x', c = r.pick([2, 2, 3]), p = r.int(2, 4), k = r.int(2, 7), q = r.int(2, 5), C = c * c * k, e = 2 * p + q;
          return P.number('Find ' + t('k') + ': ' + t('(' + c + vt(l, p) + ')^{2}\\times k' + vt(l, q) + '=' + C + vt(l, e)), k, function (v) {
            if (v === C / c && C % c === 0) return { code: 'not-raised', hint: 'Square the ' + t(c) + ' first: ' + t('(' + c + vt(l, p) + ')^{2}=' + (c * c) + vt(l, 2 * p)) + '. Then ' + t(c * c + 'k=' + C) + '.' };
            if (v === C - c * c) return { code: 'add-coef', hint: 'Coefficients <b>multiply</b>: ' + t(c * c + '\\times k=' + C) + '.' };
            return null;
          }, 'Clear the bracket: ' + t('(' + c + vt(l, p) + ')^{2}=' + (c * c) + vt(l, 2 * p)) + '. Multiply: ' + t((c * c) + 'k' + vt(l, e)) + '.<br>Match the coefficients: ' + t((c * c) + 'k=' + C) + ', so ' + t('k=' + k) + '. (The exponents already match: ' + t(2 * p + '+' + q + '=' + e) + '.)', ['Simplify the left side with ' + t('k') + ' still in it, then match the numbers in front.'], 'find k in (cx^p)^2 × kx^q');
        } }] },
      { num: '12', stem: 'Find the missing <b>expression</b> (the one that belongs in the ' + t('\\square') + ') that makes each statement true.', parts: [
        { id: 'e12a', level: 'MAS', outcome: 'AN3', make: function (r) {
          var ls = L2(r), a = ls[0], b = ls[1], k = r.pick([2, 3, 3, 4]), p = r.int(2, 3), q = r.int(1, 2), K2 = k * k, c = r.pick([1].concat([2, 3, 4, 6, 8].filter(function (d) { return K2 % d === 0 && d < K2; })).concat([k]));
          var res = M(c, [[a, r.int(1, 2 * p - 1)], [b, r.int(1, 2 * q)]]), top = powM(M(k, [[a, p], [b, q]]), 2), box = quo(top, res), cleanBox = { c: box.c, v: {} };
          Object.keys(box.v).forEach(function (x) { if (box.v[x]) cleanBox.v[x] = box.v[x]; });
          var shown = '\\dfrac{(' + qTex(M(k, [[a, p], [b, q]])) + ')^{2}}{\\square}=' + posTex(res);
          var ws = [{ tex: posTex(prod([top, res])), code: 'u2l4-mult-div', hint: 'The box divides the top, so it is the top <b>divided by</b> the answer, not multiplied.' },
            { tex: posTex(quo({ c: R(k), v: top.v }, res)), code: 'not-raised', hint: 'Square the bracket fully first: ' + t('(' + qTex(M(k, [[a, p], [b, q]])) + ')^{2}=' + posTex(top)) + '.' },
            { tex: posTex(quo(res, top)), code: 'coef-flip', hint: 'Upside down: the box is ' + t('\\frac{\\text{top}}{\\text{answer}}') + ', since ' + t('\\frac{\\text{top}}{\\square}=\\text{answer}') + '.' }];
          return X(t(shown), cleanBox, ws, 'Clear the bracket: ' + t('(' + qTex(M(k, [[a, p], [b, q]])) + ')^{2}=' + posTex(top)) + '.<br>Since ' + t('\\frac{' + posTex(top) + '}{\\square}=' + posTex(res)) + ', the box is ' + t('\\frac{' + posTex(top) + '}{' + posTex(res) + '}=' + posTex(cleanBox)) + '.<br>Check: ' + t('\\frac{' + posTex(top) + '}{' + posTex(cleanBox) + '}=' + posTex(res)) + ' ✓', ['If ' + t('\\frac{A}{\\square}=B') + ', then ' + t('\\square=\\frac{A}{B}') + '. Clear the bracket first.', 'Divide the coefficients, then subtract the exponents letter by letter.'], 'missing denominator', { vars: [a, b] });
        } },
        { id: 'e12b', level: 'ADV', outcome: 'AN3', make: function (r) {
          var l = L1(r), k = r.pick([2, 2, 3]), p = r.int(2, 3), n = k === 2 ? 3 : 2, kn = Math.pow(k, n), c = r.int(2, 5), q = r.int(2, 6), box = M(c, [[l, q]]), br = powM(M(k, [[l, p]]), n), rhs = prod([box, br]);
          var ws = [{ tex: posTex(quo(rhs, M(k, [[l, p * n]]))), code: 'not-raised', hint: 'Clear the bracket fully: ' + t('(' + k + vt(l, p) + ')^{' + n + '}=' + posTex(br)) + '.' },
            { tex: posTex(quo(rhs, M(kn, [[l, p + n]]))), code: 'add-power', hint: 'Power of a power: <b>multiply</b> ' + t(p + '\\times ' + n) + '.' },
            { tex: posTex(prod([rhs, br])), code: 'u2l4-mult-div', hint: 'The box is multiplied by the bracket, so divide the answer by the bracket to find it.' }];
          return X(t('\\square\\times(' + k + vt(l, p) + ')^{' + n + '}=' + posTex(rhs)), box, ws, 'Clear the bracket: ' + t('(' + k + vt(l, p) + ')^{' + n + '}=' + posTex(br)) + '.<br>Then ' + t('\\square=\\frac{' + posTex(rhs) + '}{' + posTex(br) + '}=' + posTex(box)) + '.<br>Check: ' + t(posTex(box) + '\\times ' + posTex(br) + '=' + posTex(rhs)) + ' ✓', ['If ' + t('\\square\\times A=B') + ', then ' + t('\\square=\\frac{B}{A}') + '.'], 'missing factor', { vars: [l] });
        } }] },
      { num: '13', stem: function (sh) { return '<b>Two cubes.</b> A large cube has edge length ' + t(qTex(sh.E)) + ' and a small cube has edge length ' + t(qTex(sh.e)) + ' (same units, ' + t(sh.l + '>0') + ').'; },
        shared: function (r) { var l = r.pick(['x', 'x', 'a', 's', 'm', 't', 'k', 'b', 'n', 'p', 'w', 'y']), c = pickWhere(function () { return [r.pick([2, 2, 3, 4, 6, 8, 9]), r.pick([1, 1, 2, 3, 4]), r.pick([2, 3, 4])]; }, function (c) { return c[0] % c[1] === 0 && c[0] / c[1] >= 2 && c[0] / c[1] <= 3 && Math.pow(c[0] / c[1] * c[2], 3) <= 729; }); return { l: l, E: M(c[0], [[l, 2]]), e: M(c[1], [[l, 1]]), xv: c[2] }; },
        parts: [
          { id: 'e13a', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            var V = powM(sh.E, 3), v = powM(sh.e, 3), vs = [sh.l];
            var wl = [{ tex: posTex({ c: sh.E.c, v: V.v }), code: 'not-raised', hint: 'Cube the coefficient too: ' + t('(' + qTex(sh.E) + ')^{3}=' + posTex(V)) + '.' }, { tex: posTex(powM(sh.E, 3, { addPower: 1 })), code: 'add-power', hint: 'Power of a power: <b>multiply</b> the exponents.' }];
            function dchk(target, list) { list = cleanWrongs(list, target); return K.expo(target, { diag: function (an, ast) { for (var i = 0; i < list.length; i++) if (same(ast, list[i].tex)) return { code: list[i].code, hint: list[i].hint }; return null; } }); }
            var p = P.fields('Write a simplified expression for each volume. (Volume of a cube = edge' + t('^{3}') + '.)', [{ name: 'Large', label: 'Large cube', mode: 'math', keys: 'expo', vars: vs, before: t('V=') }, { name: 'Small', label: 'Small cube', mode: 'math', keys: 'expo', vars: vs, before: t('V=') }],
              [dchk(posTex(V), wl), dchk(posTex(v), [{ tex: posTex({ c: sh.e.c, v: v.v }), code: 'not-raised', hint: 'Cube the coefficient too.' }])], [posTex(V), posTex(v)], 'Large ' + t(posTex(V)) + ', small ' + t(posTex(v)),
              'Large: ' + t('(' + qTex(sh.E) + ')^{3}=' + cP(sh.E.c) + '^{3}' + sh.l + '^{2\\times 3}=' + posTex(V)) + '.<br>Small: ' + t('(' + qTex(sh.e) + ')^{3}=' + posTex(v)) + '.', [HW_], 'cube volumes');
            p.bad = [[posTex({ c: sh.E.c, v: V.v }), posTex(v)]];
            return p;
          } },
          { id: 'e13b', level: 'PRG', outcome: 'AN3', make: function (r, sh) { return chain(Dv(Pw(Mn(sh.E.c, sh.E.v), 3), Pw(Mn(sh.e.c, sh.e.v), 3)), { prompt: 'Write the ratio of the large volume to the small volume, simplified.', text: 'ratio of cube volumes' }); } },
          { id: 'e13c', level: 'PRG', outcome: 'AN3', make: function (r, sh) {
            var ratio = quo(powM(sh.E, 3), powM(sh.e, 3)), k = ratio.c[0], N = k * Math.pow(sh.xv, 3);
            return P.number('If ' + t(sh.l + '=' + sh.xv) + ', how many small cubes have the same total volume as one large cube?', N, function (v) {
              if (v === k * sh.xv * 3) return { code: 'coef-times-n', hint: t(sh.xv + '^{3}') + ' means ' + t(sh.xv + '\\times ' + sh.xv + '\\times ' + sh.xv) + '.' };
              if (v === k * sh.xv) return { code: 'exp', hint: 'Use your ratio from (b): the exponent of ' + t(sh.l) + ' matters.' };
              if (v === Math.pow(k * sh.xv, 3)) return { code: 'not-raised', hint: 'Only ' + t(sh.l) + ' is cubed in ' + t(posTex(ratio)) + ', not the ' + t(k) + '.' };
              return null;
            }, 'Use the ratio from (b): ' + t(posTex(ratio)) + '. At ' + t(sh.l + '=' + sh.xv) + ': ' + t(k + '\\times ' + sh.xv + '^{3}=' + k + '\\times ' + Math.pow(sh.xv, 3) + '=' + F(N)) + '.<br>So ' + t(F(N)) + ' small cubes fill the same volume as one large cube.', ['The ratio large ÷ small tells you how many small cubes fit in the large one.'], 'how many small cubes');
          } }] },
      { num: '14', stem: '', parts: [
        { id: 'e14', level: 'ADV', outcome: 'AN3', make: function (r) {
          var ls = L2(r), kd = r.pick([[4, 8], [4, 8], [3, 3], [2, 2], [4, 2], [6, 9], [6, 12], [3, 9], [5, 5]]), p = r.int(2, 3), q = r.int(2, 3), ra = r.int(1, 2 * p - 1), sb = r.int(1, 2 * q - 1);
          var A = powM(M(kd[0], [[ls[0], p], [ls[1], q]]), 2), W = M(kd[1], [[ls[0], ra], [ls[1], sb]]), Lm = quo(A, W);
          var aTex = '(' + qTex(M(kd[0], [[ls[0], p], [ls[1], q]])) + ')^{2}';
          var ws = cleanWrongs(chainWrongs(Dv(Pw(Mn(kd[0], [[ls[0], p], [ls[1], q]]), 2), Mn(W.c, W.v)), Lm).concat([{ tex: posTex(prod([A, W])), code: 'u2l4-mult-div', hint: 'Area = length × width, so length = area <b>÷</b> width.' }]), posTex(Lm));
          var wd = function (an, ast) { for (var i = 0; i < ws.length; i++) if (same(ast, ws[i].tex)) return { code: ws[i].code, hint: ws[i].hint }; return null; };
          var p2 = P.fields('A rectangle has area ' + t(aTex) + ' and width ' + t(qTex(W)) + '. Determine a simplified expression for its length, then check your answer by multiplying the length by the width.', [
            { name: 'Length', label: 'Length', mode: 'math', keys: 'expo', vars: ls, before: t('\\ell=') }, { name: 'Check', label: 'Length × width', mode: 'math', keys: 'expo', vars: ls, before: t('\\ell\\times ' + qTex(W) + '=') }],
            [K.expo(posTex(Lm), { diag: wd }), K.expo(posTex(A), { diag: function (an, ast) { return same(ast, posTex({ c: R(kd[0]), v: A.v })) ? { code: 'not-raised', hint: 'The check should give the area, ' + t(aTex + '=' + posTex(A)) + ' — the coefficient squared too.' } : null; } })],
            [posTex(Lm), posTex(A)], 'Length ' + t(posTex(Lm)) + '; check ' + t(posTex(Lm) + '\\times ' + qTex(W) + '=' + posTex(A)),
            'Area: ' + t(aTex + '=' + posTex(A)) + '.<br>Length = area ÷ width: ' + t('\\frac{' + posTex(A) + '}{' + qTex(W) + '}=' + posTex(Lm)) + '.<br>Check: ' + t(posTex(Lm) + '\\times ' + qTex(W) + '=' + posTex(A)) + ', which is the area ✓', ['Length = area ÷ width. Clear the bracket in the area first.', 'For the check, multiply coefficients and add exponents — you should get the area back.'], 'rectangle length from area');
          p2.bad = [[posTex(prod([A, W])), posTex(A)], [posTex(Lm), posTex({ c: R(kd[0]), v: A.v })]];
          return p2;
        } }] },
      { num: '15', stem: '<b>Stretch.</b> Simplify. Handle the inside of the bracket, then the outer power, then the extra factor.', parts: [
        { id: 'e15a', level: 'ADV', outcome: 'AN3', make: function (r) {
          var ls = L2(r), x = ls[0], y = ls[1], k = r.pick([3, 3, 2, 4]), c = r.pick([2, 2, 3]), p = r.int(2, 3), q = r.int(2, 3), u = r.int(1, 2), v = r.int(1, 2 * (q - 1) - 1);
          return chain(Mul([Pw(Dv(Mn(k, [[x, p], [y, q]]), Mn(k * c, [[x, 1], [y, 1]])), 2), Dv(Mn(c * c, [[x, u]]), Mn(1, [[y, v]]))], '\\cdot '), { hint: HIN + ' The inside simplifies to a fraction, ' + t('\\frac{1}{' + c + '}') + ' of something.', text: '(kx^p y^q / kc xy)^2 · c²x/y^v' });
        } },
        { id: 'e15b', level: 'ADV', outcome: 'AN3', make: function (r) {
          var ls = L2(r), a = ls[0], b = ls[1], k = r.pick([4, 4, 3, 2]), c = r.pick([2, 2, 3]), p = r.int(2, 3), s = r.int(3, 4), w = r.int(1, 2 * p - 3);
          return chain(Mul([Pw(Dv(Mn(k, [[a, p + 1], [b, 1]]), Mn(k * c, [[a, 1], [b, 2]])), 2), Dv(Mn(c * c, [[b, s]]), Mn(1, [[a, w]]))]), { hint: HIN + ' Here a letter ends up in the denominator inside the bracket.', text: '(ka^{p+1}b / kc ab^2)^2 × c²b^s/a^w' });
        } }] },
      { num: '16', stem: '<b>Stretch (numbers only).</b> Simplify each to a single power, then evaluate it as a whole number.', parts: [
        { id: 'e16a', level: 'PRG', outcome: 'AN3', make: function (r) {
          var c = pickWhere(function () { var b = r.pick([2, 2, 3]), a1 = r.int(2, 5), a2 = r.int(2, 4), d = r.int(1, 2), n = r.pick([2, 3]), m = r.int(1, 3); return [b, a1, a2, a1 + a2 - d, n, m, d]; }, function (c) { return c[3] >= 2 && Math.pow(c[0], c[6] * c[4] + c[5]) <= 729 && c[6] * c[4] + c[5] >= 3; });
          var b = c[0], a1 = c[1], a2 = c[2], s = c[3], n = c[4], m = c[5], d = c[6], e = d * n + m;
          return evalPart(t('\\left(\\dfrac{' + b + '^{' + a1 + '}\\times ' + b + '^{' + a2 + '}}{' + b + '^{' + s + '}}\\right)^{' + n + '}\\times ' + b + '^{' + m + '}'), b, e, {
            exp: function (N) { if (N === (d + n) + m) return { code: 'add-power', hint: 'Power of a power: <b>multiply</b> ' + t(d + '\\times ' + n) + '.' }; if (N === d * n * m) return { code: 'mult-exp', hint: 'The last step is a product: <b>add</b> ' + t(m) + '.' }; return null; },
            sol: 'Inside: ' + t(b + '^{' + a1 + '+' + a2 + '-' + s + '}=' + b + '^{' + d + '}') + '. Power: ' + t('(' + b + '^{' + d + '})^{' + n + '}=' + b + '^{' + d * n + '}') + '. Product: ' + t(b + '^{' + d * n + '+' + m + '}=' + b + '^{' + e + '}=' + F(Math.pow(b, e))) + '.',
            hints: ['Inside the bracket first, then the outer power, then the extra factor.'], text: 'numbers-only chain a' });
        } },
        { id: 'e16b', level: 'PRG', outcome: 'AN3', make: function (r) {
          var c = pickWhere(function () { var b = r.pick([3, 3, 2, 5]), p = r.int(2, 3), q = r.int(2, 4), m = r.int(2, 5), s = r.int(2, 3), u = r.int(2, 3); return [b, p, q, m, s, u, p * q + m - s * u]; }, function (c) { return c[6] >= 2 && Math.pow(c[0], c[6]) <= 729; });
          var b = c[0], p = c[1], q = c[2], m = c[3], s = c[4], u = c[5], e = c[6];
          return evalPart(t('\\dfrac{(' + b + '^{' + p + '})^{' + q + '}\\times ' + b + '^{' + m + '}}{(' + b + '^{' + s + '})^{' + u + '}}'), b, e, {
            exp: function (N) { if (N === p + q + m - s - u) return { code: 'add-power', hint: 'Power of a power: <b>multiply</b> the exponents, ' + t(p + '\\times ' + q) + ' and ' + t(s + '\\times ' + u) + '.' }; if (N === p * q + m + s * u) return { code: 'add-exp', hint: 'The bottom divides: <b>subtract</b> its exponent.' }; return null; },
            sol: 'Brackets: ' + t('(' + b + '^{' + p + '})^{' + q + '}=' + b + '^{' + p * q + '}') + ' and ' + t('(' + b + '^{' + s + '})^{' + u + '}=' + b + '^{' + s * u + '}') + '.<br>' + t(b + '^{' + p * q + '+' + m + '-' + s * u + '}=' + b + '^{' + e + '}=' + F(Math.pow(b, e))) + '.',
            hints: ['Clear both brackets first (multiply the exponents), then add on top and subtract the bottom.'], text: 'numbers-only chain b' });
        } }] },
      { num: '17', stem: function (sh) { return '<b>Challenge.</b> Consider ' + t(tex(sh.T)) + '.'; },
        shared: function (r) {
          var ls = L2(r), c = pickWhere(function () { return [r.pick([2, 2, 3]), r.pick([2, 3, 3]), r.pick([2, 3, 4, 6, 6])]; }, function (c) { var top = Math.pow(c[0], 3) * c[1] * c[1], bot = c[2] * c[2]; return top % bot === 0 && top / bot >= 2 && top / bot <= 6 && c[2] !== c[0]; });
          var a = r.int(2, 3), b2 = r.int(2, 3), x2 = r.int(1, 3), y2 = r.int(1, 2);
          return { ls: ls, T: Dv(Mul([Pw(Mn(c[0], [[ls[0], a], [ls[1], 1]]), 3), Pw(Mn(c[1], [[ls[0], 1], [ls[1], b2]]), 2)], ''), Pw(Mn(c[2], [[ls[0], x2], [ls[1], y2]]), 2)), c: c };
        },
        parts: [
          { id: 'e17a', level: 'ADV', outcome: 'AN3', make: function (r, sh) { return chain(sh.T, { prompt: 'Simplify.', hint: 'Clear all three brackets first, then multiply the top, then divide.', text: 'three-bracket challenge' }); } },
          { id: 'e17b', level: 'EMG', outcome: 'AN3', make: function (r, sh) {
            return P.mc(r, 'Why would it be a poor idea to multiply out the numerator <b>before</b> clearing any of the brackets?', [
              { html: 'You would build big coefficients and long exponents before any cancelling; clearing the brackets first keeps every number small and lets matching bases divide out right away.', right: true },
              { html: 'It would give a different (wrong) answer, because the exponent laws only work in one order.', why: 'Done correctly, any order gives the same answer. The issue is how much work it is.' },
              { html: 'You can’t multiply two brackets that have different powers, so it is impossible.', why: 'It is possible (each bracket is just a number times powers); it is only a lot more work.' },
              { html: 'Brackets must always be cleared last.', why: 'It’s the other way round: the checklist clears brackets <b>first</b>.' }],
              'Any correct order gives the same answer, but clearing the brackets first is the efficient route: the numbers stay small and the powers of each letter can be combined and cancelled immediately.', ['Think about how big the numbers would get.'], 'why clear brackets first');
          } }] },
    ]
  });

  /* ---------- part makers used above ---------- */
  function cancelPart(r, n, k) {
    var ls = L2(r), x = ls[0], y = ls[1], p = r.int(2, 3), q = n === 2 ? r.int(1, 4) : r.int(1, 2), kn = Math.pow(k, n), ra = r.int(1, n * p - 1);
    var T = Dv(Pw(Mn(k, [[x, p], [y, q]]), n), Mn(kn, [[x, ra], [y, n * q]])), res = ev(T), ws = cleanWrongs(chainWrongs(T, res), posTex(res));
    var p2 = P.fields(t(tex(T)), [{ name: 'Letter', label: 'Which letter cancels?', mode: 'text', placeholder: 'letter' }, { name: 'Simplified', label: 'Simplified', mode: 'math', keys: 'expo', vars: ls }],
      [function (resp) { var s = String(resp || '').replace(/[\s$\\()]/g, '').toLowerCase(); if (!s) return form('empty', 'Type the letter that cancels.'); if (s === y) return ok(); if (s === x) return wrong('u2l4-which-var', 'Look at the exponents of ' + t(x) + ': top ' + t(n * p) + ', bottom ' + t(ra) + ' — they don’t match, so ' + t(x) + ' stays.'); return form('letter', 'Type just one letter: ' + t(x) + ' or ' + t(y) + '.'); },
        K.expo(posTex(res), { diag: function (an, ast) { for (var i = 0; i < ws.length; i++) if (same(ast, ws[i].tex)) return { code: ws[i].code, hint: ws[i].hint }; return null; } })],
      [y, posTex(res)], t(y) + ' cancels; ' + t(tex(T) + '=' + posTex(res)), solText(T) + '<br>The ' + t(y) + '’s cancel: ' + t(vt(y, n * q) + '\\div ' + vt(y, n * q) + '=' + y + '^{0}=1') + '.', [HW_, 'After clearing the bracket, compare the exponents of each letter on the top and the bottom.'], 'which letter cancels');
    p2.bad = [[x, posTex(res)], [y, posTex({ c: res.c, v: (function () { var v = {}; v[x] = res.v[x]; v[y] = 1; return v; })() })]];
    p2.good = [['\\(' + y + '\\)', posTex(res)]];
    return p2;
  }
  function subsPart(T, x, xv) {
    var res = ev(T), V = Math.pow(xv, res.v[x] || 0) * res.c[0] / res.c[1], ws = cleanWrongs(chainWrongs(T, res), posTex(res));
    var wd = function (an, ast) { for (var i = 0; i < ws.length; i++) if (same(ast, ws[i].tex)) return { code: ws[i].code, hint: ws[i].hint }; return null; };
    var p = P.fields(t(tex(T)) + ', substituting ' + t(x + '=' + xv), [{ name: 'Simplified', label: 'Simplified', mode: 'math', keys: 'expo', vars: [x] }, { name: 'Original', label: 'Original at ' + t(x + '=' + xv), before: t('=') }, { name: 'Simplified value', label: 'Simplified at ' + t(x + '=' + xv), before: t('=') }],
      [K.expo(posTex(res), { diag: wd }), K.number(V, function () { return { code: 'u2l4-sub-value', hint: 'Work the original out in order: inside the bracket, then the power, then multiply and divide. (If your simplified form is right, the two values must agree.)' }; }), K.number(V)],
      [posTex(res), String(V), String(V)], t(tex(T) + '=' + posTex(res)) + '; both values ' + t(F(V)),
      solText(T) + '<br>Check at ' + t(x + '=' + xv) + ': the original gives ' + t(F(V)) + ' and ' + t(posTex(res)) + ' gives ' + t(F(V)) + '. They agree ✓', [HO, 'Substitute ' + t(x + '=' + xv) + ' into the original exactly as written: work out the bracket first.'], 'substitution check');
    p.bad = [[posTex(res), String(V + 1), String(V)]];
    return p;
  }
  function tfPart(r, T, wantTrue) {
    var res = ev(T), good = posTex(res), ws = cleanWrongs(chainWrongs(T, res), good);
    var shown = wantTrue || !ws.length ? good : ws[0].tex;
    return tfFix(r, tex(T), good, shown, ws.slice(shown === good ? 0 : 1), solText(T) + (shown === good ? '<br>The statement is <b>true</b>.' : '<br>The statement is <b>false</b>: the right side should be ' + t(good) + '.'), [HO], 'T/F with correction');
  }
})(window);
