/* Math 15 · Unit 4 (Factoring Polynomial Expressions, AN5) — exit slips for Lessons 1–10 (u4l1x … u4l10x), written in test mode.
 * Each slip is Ryan's own Math 15 exit slip for that lesson (his older exit-slip app, Versions A and B), turned into
 * generators: the same questions, skills and levels (his tags), with his Version A and B numbers among the possible values.
 * Every part has a key built from the generated factors, a worked solution, hints, and `bad` answers with u4x- codes.
 * Where his slip had only Beginning/Progressing questions, one short Mastery question was added at Math 15 difficulty
 * (working backwards, a whole family of answers, or one extra factoring step), so "highest level right" separates students.
 * Factored answers are checked with K.factored (js/factor.js): equal but not factored completely is a 'form' nudge.
 * Solving answers (Lessons 9 and 10) take the solutions in any order (K.P.valueSet, js/relfn.js). No calculator. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, P = HW.poly, FX = HW.factor, ex = HW.ex, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'u4x-gcf-high': 'GCF: used the higher power of a variable', 'u4x-gcf-nocoef': 'GCF: left out the number', 'u4x-gcf-novar': 'GCF: left out the variable',
    'u4x-gcf-small': 'A common factor, but not the greatest', 'u4x-gcf-lcm': 'Gave a common multiple instead of a common factor', 'u4x-gcf-exp': 'Used the other term’s exponent instead of the GCF’s',
    'u4x-exp-kept': 'Divided the coefficients but not the variables', 'u4x-not-divided': 'Did not divide a term by the GCF', 'u4x-bracket-sign': 'Sign slip inside the bracket',
    'u4x-lost-term': 'Lost a term of the bracket', 'u4x-neg-gcf': 'Took out a positive factor when a negative one was asked', 'u4x-neg-signs': 'Negative GCF: signs in the bracket not all changed',
    'u4x-neg-front': 'Negative GCF in front but the bracket’s signs not changed', 'u4x-drop-one': 'Dropped the 1 left by a term equal to the GCF',
    'u4x-gcf-dropped': 'Dropped the common factor', 'u4x-gcf-part': 'Took out only part of the GCF',
    'u4x-pair-sum': 'Pair with the right product but the wrong sum', 'u4x-pair-product': 'Pair with the right sum but the wrong product', 'u4x-pair-signs': 'Pair with the wrong signs',
    'u4x-swap-bc': 'Numbers multiply to b and add to c (roles swapped)', 'u4x-lead-ignored': 'Ignored the common factor in front of x²',
    'u4x-not-b': 'Listed a value of b that does not work', 'u4x-neg-b': 'Listed negative values of b as well', 'u4x-missing-b': 'Missed some values of b', 'u4x-b-factors': 'Listed the factors of c instead of their sums',
    'u4x-dos-square': 'Wrote a difference of squares as a perfect square', 'u4x-no-root': 'Used a square instead of its square root', 'u4x-dropped-coef': 'Dropped the coefficient of x²',
    'u4x-pst-sign': 'Perfect square with the wrong sign in the bracket', 'u4x-pst-dos': 'Wrote a perfect square trinomial as a difference of squares',
    'u4x-mid-half': 'Middle term: forgot to double the product of the roots', 'u4x-mid-square': 'Middle term: used the last term instead of its root', 'u4x-k-noa': 'Middle term: left out the root of the first term',
    'u4x-sign-swap': 'Signs of both constants switched', 'u4x-const-swap': 'Constant terms in the wrong brackets', 'u4x-pair-as-factors': 'Wrote the decomposition pair into the brackets (as if a = 1)',
    'u4x-split-into': 'Wrote the split numbers straight into the brackets', 'u4x-not-complete': 'Left a common factor inside a bracket (not factored completely)',
    'u4x-not-zero': 'Set each factor equal to the right side instead of 0', 'u4x-rhs-zero': 'Solved as if the right side were 0', 'u4x-no-divide': 'Did not divide by the coefficient of x',
    'u4x-div-flip': 'Divided the wrong way', 'u4x-split-roots': 'Gave the decomposition numbers as the solutions', 'u4x-coef-root': 'Took a solution from the coefficient', 'u4x-no-sqrt': 'Did not take the square root'
  });
  HW.addPartial({
    'u4x-gcf-high': 'b', 'u4x-gcf-nocoef': 's', 'u4x-gcf-novar': 's', 'u4x-gcf-small': 'b', 'u4x-gcf-lcm': 'n', 'u4x-gcf-exp': 'n',
    'u4x-exp-kept': 'b', 'u4x-not-divided': 'b', 'u4x-bracket-sign': 's', 'u4x-lost-term': 'b', 'u4x-neg-signs': 'b', 'u4x-neg-front': 'b', 'u4x-drop-one': 's',
    'u4x-gcf-dropped': 's', 'u4x-gcf-part': 'b', 'u4x-pair-sum': 'n', 'u4x-pair-product': 'n', 'u4x-pair-signs': 's', 'u4x-swap-bc': 'n', 'u4x-lead-ignored': 'n',
    'u4x-not-b': 'n', 'u4x-missing-b': 'b', 'u4x-b-factors': 'n', 'u4x-dos-square': 'n', 'u4x-no-root': 'b', 'u4x-dropped-coef': 'b', 'u4x-pst-sign': 'b', 'u4x-pst-dos': 'n',
    'u4x-mid-half': 'b', 'u4x-mid-square': 'n', 'u4x-k-noa': 'b', 'u4x-sign-swap': 'b', 'u4x-const-swap': 'b', 'u4x-pair-as-factors': 'n', 'u4x-split-into': 'n', 'u4x-not-complete': 'n',
    'u4x-not-zero': 'n', 'u4x-rhs-zero': 'n', 'u4x-no-divide': 'b', 'u4x-div-flip': 'b', 'u4x-split-roots': 'n', 'u4x-coef-root': 'n', 'u4x-no-sqrt': 'b'
  });

  /* ---------------- small tools ---------------- */
  function pickWhere(gen, test) { for (var i = 0; i < 3000; i++) { var o = gen(); if (o && test(o)) return o; } throw new Error('u4 exits: no instance found'); }
  function nz(r, lo, hi) { return (r.chance(0.5) ? -1 : 1) * r.int(lo, hi); }
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function V(v, e) { var o = {}; o[v] = e || 1; return P.mono(1, o); }
  function Mo(c, vars) { return P.mono(c, vars || {}); }
  function T(c, v, e) { if (!e) return P.num(c); var o = {}; o[v] = e; return P.mono(c, o); }
  function bin(u, n, w) { return P.add(u, P.scale(w || P.num(1), n)); }
  function lin(a, b, v) { return P.add(T(a, v, 1), P.num(b)); }
  function tx(p) { return P.tex(p); }
  function br(p) { return '(' + tx(p) + ')'; }
  var gcd = ex.gcd;
  function posPairs(n) { n = Math.abs(n); var o = []; for (var u = 1; u * u <= n; u++) if (n % u === 0) o.push([u, n / u]); return o; }
  function prodOf(list) { return FX.product(list); }
  function varsOf(p) { var vs = P.vars(p); return vs.length ? vs : ['x']; }
  function isSq(n) { var s = Math.round(Math.sqrt(n)); return n >= 0 && s * s === n; }
  function numChk(ans, alts) { return K.number(ans, function (v) { for (var i = 0; i < alts.length; i++) if (alts[i] && v === alts[i].v && v !== ans) return { code: alts[i].code, hint: alts[i].hint }; return null; }); }
  function badRows(key, i, vals) { var out = []; vals.forEach(function (v) { if (v == null || String(v) === String(key[i])) return; var row = key.slice(); row[i] = String(v); out.push(row); }); return out; }
  function nbox(label, extra) { return Object.assign({ label: label, name: label.replace(/\\\(|\\\)|<[^>]+>/g, '').replace(/:$/, '') }, extra || {}); }
  function triTex(v, b, c) { return v + '^{2}' + (b === 0 ? '' : (b === 1 ? '+' : b === -1 ? '-' : sg(b)) + v) + (c === 0 ? '' : sg(c)); }
  function sameSet(A, B) { if (A.length !== B.length) return false; var a = A.slice().sort(function (x, y) { return x - y; }), b = B.slice().sort(function (x, y) { return x - y; }); return a.every(function (x, i) { return Math.abs(x - b[i]) < 1e-9; }); }
  function hasVal(A, x) { return A.some(function (y) { return Math.abs(x - y) < 1e-9; }); }
  var NAMES = ['Jordan', 'Priya', 'Maya', 'Liam', 'Ava', 'Noah', 'Sofia', 'Ethan', 'Zoe', 'Owen'];

  /* wrongs: [{ is: factor list | polynomial, code, hint }] — those equal to the target (or to each other) are dropped; bad = their LaTeX */
  function wfilter(target, ws) {
    var seen = [prodOf(target)], W = [], bad = [];
    (ws || []).forEach(function (w) {
      if (!w || !w.is) return;
      var p = Array.isArray(w.is) ? prodOf(w.is) : P.lift(w.is);
      if (seen.some(function (s) { return P.eq(s, p); })) return;
      seen.push(p); W.push({ is: w.is, code: w.code, hint: w.hint }); bad.push(Array.isArray(w.is) ? FX.tex(w.is) : tx(p));
    });
    return { W: W, bad: bad };
  }
  /* an answer that isn't a product at all (e.g. the expression typed back) shows no factoring: wrong, not the 2/3 "form" nudge */
  function noProduct(chk) { return function (resp) { var res = chk(resp); return res && res.v === 'form' && res.code === 'not-factored' ? wrong('not-factored', res.hint) : res; }; }
  /* a "factor (completely)" part; target = list of factors */
  function fpart(prompt, target, ws, sol, hints, text, opt) {
    opt = opt || {};
    var f = wfilter(target, ws), keyTex = opt.keyTex || FX.tex(target);
    var part = KP.factored(prompt, target, Object.assign({}, opt, { wrong: f.W, keyTex: keyTex, vars: opt.vars || varsOf(prodOf(target)) }), sol, hints, text);
    part.check = noProduct(part.check);
    part.bad = f.bad.concat(opt.bad || []);
    return part;
  }
  /* the monomial factors of a typed answer multiply to a negative number? (for "take out a negative common factor") */
  function monoSign(resp) {
    var a = K.read(resp); if (a.res) return 0;
    var sp = FX.split(a.ast); if (!sp.ok) return 0;
    var s = 1; sp.factors.forEach(function (f) { if (P.count(f.p) === 1) { var c = P.terms(f.p)[0].c; if (c[0] < 0 && f.k % 2) s = -s; } });
    return s;
  }
  function negOnly(part, G) {
    var chk = part.check;
    part.check = function (resp) { var res = chk(resp); if (res.v === 'correct' && monoSign(resp) > 0) return form('u4x-neg-gcf', 'Right value — but the question asks for a <b>negative</b> common factor: take out ' + t(tx(G)) + '.'); return res; };
    return part;
  }

  /* ---------------- monic trinomials, built from their factors ----------------
   * o = { v: 'x', G: common factor (polynomial), p, q } → G(v + p)(v + q) */
  function spec(o) {
    var u = V(o.v || 'x'), G = o.G || P.num(1);
    var A = bin(u, o.p), Bq = bin(u, o.q), inner = P.mul(A, Bq), full = P.mul(G, inner), g1 = P.eq(G, P.num(1));
    var list = o.p === o.q ? [{ p: A, k: 2 }] : [A, Bq];
    if (!g1) list = [G].concat(list);
    var gt = tx(G);
    return { v: o.v || 'x', u: u, G: G, g1: g1, p: o.p, q: o.q, b: o.p + o.q, c: o.p * o.q, A: A, B: Bq, inner: inner, full: full, list: list, key: FX.tex(list), gtex: gt, gpre: gt === '-1' ? '-' : gt };
  }
  function signHint(b, c) {
    if (c > 0) return b > 0 ? 'The product is positive and the sum is positive, so <b>both</b> integers are positive.' : 'The product is positive but the sum is negative, so <b>both</b> integers are negative.';
    return 'The product is negative, so one integer is positive and one is negative. The one further from ' + t('0') + ' has the same sign as the sum, ' + t(b) + '.';
  }
  function coefRel(S, m) { var tm = P.terms(m)[0], c = P.coef(S, tm.v); return (c[0] * tm.c[1]) / (c[1] * tm.c[0]); }
  function pairDiag(s) {
    var m2 = P.mul(s.G, P.pow(s.u, 2)), m1 = P.mul(s.G, s.u), m0 = s.G;
    var b = s.b, c = s.c, inside = s.g1 ? '' : ' (inside the bracket)';
    return function (S) {
      var L = coefRel(S, m2), M = coefRel(S, m1), C = coefRel(S, m0);
      if (L !== 1 || M % 1 || C % 1) return null;
      if (!P.eq(S, P.add(m2, P.scale(m1, M), P.scale(m0, C)))) return null;
      var pre = 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(s.full)) + '. ';
      if (C === c && M === -b) return { code: 'u4x-pair-signs', hint: pre + 'Your numbers multiply to ' + t(c) + ' but add to ' + t(-b) + ', not ' + t(b) + ': the signs are backwards. ' + signHint(b, c) };
      if (M === c && C === b && b !== c) return { code: 'u4x-swap-bc', hint: pre + 'Your numbers multiply to ' + t(b) + ' and add to ' + t(c) + ' — the wrong way round. They must <b>multiply to the last term</b> and <b>add to the middle coefficient</b>' + inside + '.' };
      if (C === c) return { code: 'u4x-pair-sum', hint: pre + 'Your numbers multiply to ' + t(c) + ' ✓ but add to ' + t(M) + ', not ' + t(b) + '. Try another factor pair of ' + t(Math.abs(c)) + '.' };
      if (M === b && C === -c) return { code: 'u4x-pair-signs', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(-c) + ', not ' + t(c) + '. ' + (c > 0 ? 'A positive product needs two numbers with the <b>same</b> sign.' : 'A negative product needs one positive and one negative number.') };
      if (M === b) return { code: 'u4x-pair-product', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(C) + ', not ' + t(c) + '. The last terms of the brackets must multiply to the last term' + inside + '.' };
      if (C === -c) return { code: 'u4x-pair-signs', hint: pre + 'Your numbers multiply to ' + t(C) + ', not ' + t(c) + '. ' + signHint(b, c) };
      return null;
    };
  }
  function stdWrongs(s) {
    var out = [];
    if (!s.g1) out.push({ is: s.inner, code: 'u4x-gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(s.gtex) + ' is missing. Multiply your answer out: you get ' + t(tx(s.inner)) + ', not ' + t(tx(s.full)) + '.' });
    out.push({ is: [s.G, bin(s.u, -s.p), bin(s.u, -s.q)], code: 'u4x-pair-signs', hint: 'Every sign in your brackets is backwards. ' + signHint(s.b, s.c) });
    return out;
  }
  function solFac(s) {
    var out = [];
    if (!s.g1) out.push('Take out the common factor ' + t(s.gtex) + ' first: ' + t(tx(s.full) + '=' + s.gpre + '(' + tx(s.inner) + ')') + '.');
    out.push('Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(s.p) + ' and ' + t(s.q) + '.');
    out.push(t(tx(s.full) + '=' + s.key));
    out.push('Check: ' + t(s.key.replace(/^[^(]*/, '')) + ' expands to ' + t(tx(s.inner)) + ' ✓');
    return out.join('<br>');
  }
  function hintsFac(s) {
    var pair = 'Look for two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + '.';
    if (!s.g1) return ['Every term has a common factor of ' + t(s.gtex) + '. Take it out first, then factor the trinomial left in the bracket.', pair + ' ' + signHint(s.b, s.c)];
    return [pair, signHint(s.b, s.c)];
  }
  function monicPart(prompt, s, extra, text) {
    var bad = [], c = s.c, b = s.b, pre = s.g1 ? [] : [s.G];
    var other = posPairs(c).map(function (pq) { return c > 0 ? (b > 0 ? pq : [-pq[0], -pq[1]]) : (b > 0 ? [pq[1], -pq[0]] : [-pq[1], pq[0]]); }).filter(function (pq) { return pq[0] + pq[1] !== b; })[0];
    if (other) bad.push(FX.tex(pre.concat([bin(s.u, other[0]), bin(s.u, other[1])]))); // right product, wrong sum
    if (b - 1 !== 0 && (b - 1) !== s.p && (b - 1) !== s.q) bad.push(FX.tex(pre.concat([bin(s.u, b - 1), bin(s.u, 1)]))); // right sum, wrong product
    return fpart(prompt, s.list, stdWrongs(s).concat(extra || []), solFac(s), hintsFac(s), text || 'factor ' + tx(s.full), { diag: pairDiag(s), keyTex: s.key, bad: bad });
  }

  /* ---------------- ax² + bx + c from (px + q)(rx + s) ---------------- */
  function axSpec(p, q, r, s, v) {
    v = v || 'x';
    var A = lin(p, q, v), B = lin(r, s, v), full = P.mul(A, B), a = p * r, c = q * s, b = p * s + q * r;
    return { p: p, q: q, r: r, s: s, v: v, A: A, B: B, full: full, a: a, b: b, c: c, ac: a * c, m: p * s, n: q * r, list: [A, B] };
  }
  /* written p v (r v + s) + q (r v + s) */
  function grp(o) { return (o.p === 1 ? '' : o.p) + o.v + '(' + tx(o.B) + ')' + sg(o.q) + '(' + tx(o.B) + ')'; }
  function axSol(o, pre) {
    var v = o.v, exp4 = [T(o.a, v, 2), T(o.m, v, 1), T(o.n, v, 1), P.num(o.c)];
    var lo = Math.min(o.m, o.n), hi = Math.max(o.m, o.n);
    return (pre || '') + t('ac=' + par(o.a) + '\\times ' + par(o.c) + '=' + o.ac) + '. Two integers with product ' + t(o.ac) + ' and sum ' + t(o.b) + ': ' + t(lo) + ' and ' + t(hi) + '.' +
      '<br>Split the middle term and group in pairs: ' + t(P.seq(exp4)) + '<br>' + t('=' + grp(o)) + '<br>' + t('=' + br(o.A) + br(o.B));
  }
  function axWrongs(o) {
    var out = [];
    out.push({ is: [lin(o.p, -o.q, o.v), lin(o.r, -o.s, o.v)], code: 'u4x-sign-swap', hint: 'Your brackets give a middle term with the wrong sign. Expand your answer to check: the outside and inside products must add to ' + t(tx(T(o.b, o.v, 1))) + '.' });
    out.push({ is: [lin(o.p, o.s, o.v), lin(o.r, o.q, o.v)], code: 'u4x-const-swap', hint: 'The first and last terms are right, but the numbers are in the wrong brackets: the outside and inside products don’t add to the middle term. Expand to check.' });
    out.push({ is: [lin(1, o.m, o.v), lin(1, o.n, o.v)], code: 'u4x-pair-as-factors', hint: 'The decomposition numbers don’t go straight into the brackets when ' + t('a\\ne 1') + '. Use them to split the middle term, then group in pairs.' });
    out.push({ is: [lin(o.a, o.m, o.v), lin(1, o.n, o.v)], code: 'u4x-split-into', hint: 'You wrote the split numbers straight into the brackets. After splitting the middle term, <b>group in pairs</b> and take out the common bracket. Expand your answer to check.' });
    out.push({ is: [lin(o.a, o.n, o.v), lin(1, o.m, o.v)], code: 'u4x-split-into', hint: 'You wrote the split numbers straight into the brackets. After splitting the middle term, <b>group in pairs</b> and take out the common bracket. Expand your answer to check.' });
    return out;
  }
  function axHints(o) { return ['Find ' + t('a\\times c=' + o.ac) + ', then two integers with product ' + t(o.ac) + ' and sum ' + t(o.b) + '. ' + signHint(o.b, o.ac), 'Split the middle term with those two integers, group in pairs, and take out the common bracket. Expand to check.']; }

  /* ---------------- area model figure (Lesson 1) ---------------- */
  function svgMono(c, v, e) { return (c === 1 ? '' : c) + '<tspan font-style="italic">' + v + '</tspan>' + (e === 2 ? '²' : e === 3 ? '³' : ''); }
  function areaSvg(h, l1, l2, i1, i2, total) {
    var f = 'font-family="KaTeX_Main,\'Times New Roman\',serif"';
    var s = '<rect x="46" y="36" width="130" height="84" fill="#e3ecf8" stroke="#1e2d46" stroke-width="2"/>' +
      '<rect x="176" y="36" width="84" height="84" fill="#fbe3e1" stroke="#1e2d46" stroke-width="2"/>' +
      '<text x="111" y="85" ' + f + ' font-size="20" text-anchor="middle" fill="#1e2d46">' + i1 + '</text>' +
      '<text x="218" y="85" ' + f + ' font-size="20" text-anchor="middle" fill="#1e2d46">' + i2 + '</text>' +
      '<text x="38" y="84" ' + f + ' font-size="19" text-anchor="end" fill="#c0392b" font-weight="bold">' + h + '</text>' +
      '<text x="111" y="26" ' + f + ' font-size="19" text-anchor="middle" fill="#2b55a0" font-weight="bold">' + l1 + '</text>' +
      '<text x="218" y="26" ' + f + ' font-size="19" text-anchor="middle" fill="#2b55a0" font-weight="bold">' + l2 + '</text>' +
      '<text x="153" y="144" ' + f + ' font-size="15" text-anchor="middle" fill="#1e2d46">Total area: ' + total + '</text>';
    return '<svg class="fig-svg" viewBox="0 0 280 152" style="max-width:300px" role="img" aria-label="area model: a rectangle split into two parts">' + s + '</svg>';
  }

  /* ======================= Lesson 1: multiplying and factoring, the GCF ======================= */
  function l1q1(r) { // GCF of two monomials (Ryan: 8x², 12x³ · 6y³, 9y⁵)
    var v = r.pick(['x', 'x', 'y', 'a', 'm']), s = pickWhere(function () { return { g: r.int(2, 6), m1: r.int(2, 5), m2: r.int(2, 5), e1: r.int(1, 5), e2: r.int(1, 5) }; },
      function (s) { return s.m1 !== s.m2 && gcd(s.m1, s.m2) === 1 && s.e1 !== s.e2 && s.g * Math.max(s.m1, s.m2) <= 30; });
    var lo = Math.min(s.e1, s.e2), hi = Math.max(s.e1, s.e2), A = T(s.g * s.m1, v, s.e1), B = T(s.g * s.m2, v, s.e2), G = T(s.g, v, lo), sp = HW.nt.smallestPrimeFactor(s.g);
    var ws = [{ is: T(s.g, v, hi), code: 'u4x-gcf-high', hint: 'The GCF can only use what <b>both</b> terms have. One term has only ' + t(tx(V(v, lo))) + ', so use the <b>lowest</b> power.' },
      { is: P.num(s.g), code: 'u4x-gcf-novar', hint: 'Both terms also contain ' + t(tx(V(v, lo))) + ', so it belongs in the GCF too.' },
      { is: V(v, lo), code: 'u4x-gcf-nocoef', hint: 'The numbers ' + t(s.g * s.m1) + ' and ' + t(s.g * s.m2) + ' have a common factor too: include the greatest one.' },
      { is: T(s.g * s.m1 * s.m2, v, hi), code: 'u4x-gcf-lcm', hint: 'That is something both terms divide <b>into</b> (a common multiple). The GCF is the biggest thing that divides into both.' }];
    if (sp < s.g) ws.push({ is: T(s.g / sp, v, lo), code: 'u4x-gcf-small', hint: 'That divides both terms, but a bigger number does too: the GCF of ' + t(s.g * s.m1) + ' and ' + t(s.g * s.m2) + ' is ' + t(s.g) + '.' });
    if (lo > 1) ws.push({ is: T(s.g, v, lo - 1), code: 'u4x-gcf-small', hint: 'That divides both terms, but both terms have at least ' + t(tx(V(v, lo))) + ', so the GCF can include that power.' });
    var seen = [G], W = [];
    ws.forEach(function (w) { if (seen.some(function (q) { return P.eq(q, w.is); })) return; seen.push(w.is); W.push(w); });
    var fa = function (n, e) { var f = []; HW.nt.factor(n).forEach(function (pe) { for (var i = 0; i < pe[1]; i++) f.push(pe[0]); }); for (var j = 0; j < e; j++) f.push(v); return f.join('\\times '); };
    var part = KP.poly('State the greatest common factor (GCF) of ' + t(tx(A)) + ' and ' + t(tx(B)) + '.', G, { wrong: W },
      t(tx(A) + '=' + fa(s.g * s.m1, s.e1)) + '<br>' + t(tx(B) + '=' + fa(s.g * s.m2, s.e2)) + '<br>Numbers: the GCF of ' + t(s.g * s.m1) + ' and ' + t(s.g * s.m2) + ' is ' + t(s.g) + '. Letters: both terms have at least ' + t(tx(V(v, lo))) + ' (the <b>lower</b> power).<br>GCF ' + t('=' + tx(G)),
      ['Find the GCF of the numbers first.', 'For the variable, use the <b>lower</b> exponent: the GCF can only use what both terms have.'], 'GCF of two monomials');
    part.bad = W.map(function (w) { return tx(w.is); });
    return part;
  }
  function l1q2(r) { // area model (Ryan: 6x²+10x, height 2x · 8x²+12x, height 4x)
    var v = 'x', s = pickWhere(function () { return { g: r.int(2, 5), a: r.int(2, 5), b: r.int(1, 7) }; }, function (s) { return s.a !== s.b && gcd(s.a, s.b) === 1 && s.g * s.a <= 20 && s.g * s.b <= 30; });
    var G = T(s.g, v, 1), Br = lin(s.a, s.b, v), full = P.mul(G, Br), ft = tx(full), t1 = T(s.g * s.a, v, 2), t2 = T(s.g * s.b, v, 1);
    var svgQ = areaSvg(svgMono(s.g, v, 1), '?', '?', svgMono(s.g * s.a, v, 2), svgMono(s.g * s.b, v, 1), svgMono(s.g * s.a, v, 2) + ' + ' + svgMono(s.g * s.b, v, 1));
    var svgA = areaSvg(svgMono(s.g, v, 1), svgMono(s.a, v, 1), String(s.b), svgMono(s.g * s.a, v, 2), svgMono(s.g * s.b, v, 1), svgMono(s.g * s.a, v, 2) + ' + ' + svgMono(s.g * s.b, v, 1));
    return fpart('The area model shows ' + t(ft) + '. Its height is the GCF, ' + t(tx(G)) + '.<div class="fig">' + svgQ + '</div>Find each missing length, then write ' + t(ft) + ' in factored form.', [G, Br],
      [{ is: [G, P.add(T(s.a, v, 2), T(s.b, v, 1))], code: 'u4x-exp-kept', hint: 'You divided the numbers but not the variables: ' + t(tx(t1) + '\\div ' + tx(G) + '=' + tx(T(s.a, v, 1))) + '. Multiply your answer out to check.' },
        { is: [G, lin(s.a, s.g * s.b, v)], code: 'u4x-not-divided', hint: 'The second length is ' + t(tx(t2) + '\\div ' + tx(G)) + '. Divide <b>each</b> term by the GCF.' },
        { is: [Br], code: 'u4x-gcf-dropped', hint: 'Your bracket holds the two lengths, but the height ' + t(tx(G)) + ' is missing: area = height × length.' }],
      'Each missing length is that part’s area divided by the height:<br>' + t(tx(t1) + '\\div ' + tx(G) + '=' + tx(T(s.a, v, 1))) + ' and ' + t(tx(t2) + '\\div ' + tx(G) + '=' + s.b) + '.<div class="fig">' + svgA + '</div>So ' + t(ft + '=' + tx(G) + '(' + tx(Br) + ')') + '.<br>Check: ' + t(tx(G) + '(' + tx(Br) + ')=' + ft) + ' ✓',
      ['Each missing length is (area of that part) ÷ (height).', 'Factored form: height × (sum of the lengths), like ' + t('2x(3x+5)') + '.'], 'area model: remove the GCF');
  }
  function l1q3(r) { // expand to check (Ryan: 9x+6 as 3(3x+3) · 8x+12 as 4(2x+12))
    var s = pickWhere(function () { return { g: r.int(2, 5), a: r.int(2, 6), b: r.int(1, 7), kind: r.pick(['nodiv', 'slip', 'slip', 'right']) }; }, function (s) { return gcd(s.a, s.b) === 1 && s.a !== s.b && s.g * s.a <= 20 && s.g * s.b <= 30; });
    var who = r.pick(NAMES), g = s.g, a = s.a, b = s.b, x = 'x', orig = (g * a) + x + '+' + g * b;
    var st = s.kind === 'right' ? b : s.kind === 'nodiv' ? g * b : (b === 1 || r.chance(0.6) ? b + 1 : b - 1);
    var S = g + '(' + a + x + '+' + st + ')', Sexp = g * a + x + '+' + g * st, good = g + '(' + a + x + '+' + b + ')', right = st === b;
    var cand = [{ f: g + '(' + a + x + '+' + g * b + ')', st: g * b, why: 'That bracket still has ' + t(g * b) + ', the original last term: it was never divided by ' + t(g) + '. Expanding it gives ' + t(g * a + x + '+' + g * g * b) + '.' },
      { f: g + '(' + x + '+' + b + ')', st: 'x', why: t(g + '(x+' + b + ')') + ' expands to ' + t(g + 'x+' + g * b) + ': the first term was divided by ' + t(g * a) + ' instead of by the GCF ' + t(g) + '.' },
      { f: g + '(' + a + x + '+' + (g * b - g) + ')', st: g * b - g, why: 'That subtracts the GCF from the last term instead of dividing: ' + t(g + '(' + a + x + '+' + (g * b - g) + ')') + ' expands to ' + t(g * a + x + '+' + (g * g * b - g * g)) + '.' },
      { f: g + '(' + a + x + '+' + (b + 2) + ')', st: b + 2, why: 'Expand it: ' + t(g + '(' + a + x + '+' + (b + 2) + ')=' + g * a + x + '+' + g * (b + 2)) + ', not ' + t(orig) + '.' }]
      .filter(function (c, i, all) { return c.st !== st && c.st !== b && (c.st === 'x' || c.st > 0) && all.findIndex(function (d) { return d.st === c.st; }) === i; });
    var opts = [{ html: '<b>Correct:</b> ' + t(S) + ' expands to ' + t(orig) + '.', right: right, why: right ? null : 'Expand it: ' + t(S + '=' + Sexp) + ', not ' + t(orig) + '.', code: 'said-correct' }];
    if (!right) opts.push({ html: '<b>Incorrect:</b> ' + t(S + '=' + Sexp) + '. The correct form is ' + t(good) + '.', right: true });
    cand.slice(0, 4 - opts.length).forEach(function (c, i) { opts.push({ html: '<b>Incorrect:</b> ' + (right ? '' : t(S + '=' + Sexp) + '. ') + (right ? 'the' : 'The') + ' correct form is ' + t(c.f) + '.', right: false, why: c.why, code: 'form' + i }); });
    return KP.mc(r, who + ' factored ' + t(orig) + ' as ' + t(S) + '. Expand ' + (/a|e|i|o|u/i.test(who.charAt(who.length - 1)) ? 'her' : 'his') + ' answer to check it. Which statement is true?', opts,
      'Expand: ' + t(S + '=' + Sexp) + (right ? ' ✓, which matches ' + t(orig) + ', so ' + who + ' is right.' : t('\\ne ' + orig) + ', so ' + who + ' is wrong.') + '<br>The GCF of ' + t(g * a + x) + ' and ' + t(g * b) + ' is ' + t(g) + ': ' + t(orig + '=' + good) + '.<br>Check: ' + t(good + '=' + orig) + ' ✓',
      ['Multiply ' + t(g) + ' by <b>each</b> term in the bracket and compare with ' + t(orig) + '.', 'The bracket should hold each term divided by the GCF.'], 'expand to check a factoring');
  }
  function l1q4(r) { // working backwards: the exponents from the GCF (added Mastery question)
    var vs = r.pick([['x', 'y'], ['a', 'b'], ['p', 'q']]), x = vs[0], y = vs[1];
    var s = pickWhere(function () { return { g: r.int(2, 6), m1: r.int(2, 5), m2: r.int(2, 5), k1: r.int(1, 3), k2: r.int(1, 3), e1: r.int(2, 5), e2: r.int(2, 5) }; },
      function (s) { return s.m1 !== s.m2 && gcd(s.m1, s.m2) === 1 && s.g * Math.max(s.m1, s.m2) <= 30 && s.e2 > s.k1 && s.e1 > s.k2; });
    var term1 = s.g * s.m1 + x + '^{m}' + y + (s.e1 > 1 ? '^{' + s.e1 + '}' : ''), term2 = s.g * s.m2 + x + '^{' + s.e2 + '}' + y + '^{n}';
    var og = {}; og[x] = s.k1; og[y] = s.k2; var G = tx(Mo(s.g, og));
    var key = [String(s.k1), String(s.k2)];
    var pt = KP.fields('The greatest common factor of ' + t(term1) + ' and ' + t(term2) + ' is ' + t(G) + '. Find the whole numbers ' + t('m') + ' and ' + t('n') + '.',
      [nbox(t('m=')), nbox(t('n='))],
      [numChk(s.k1, [{ v: s.e2, code: 'u4x-gcf-exp', hint: 'The GCF uses the <b>lower</b> power of ' + t(x) + '. The second term has ' + t(x + '^{' + s.e2 + '}') + ', but the GCF has only ' + t(tx(V(x, s.k1))) + ', so the lower power must come from the first term.' }]),
        numChk(s.k2, [{ v: s.e1, code: 'u4x-gcf-exp', hint: 'The GCF uses the <b>lower</b> power of ' + t(y) + '. The first term has ' + t(tx(V(y, s.e1))) + ', but the GCF has only ' + t(tx(V(y, s.k2))) + ', so the lower power must come from the second term.' }])],
      key, t('m=' + s.k1) + ', ' + t('n=' + s.k2),
      'The GCF takes the <b>lower</b> power of each letter.<br>The second term has ' + t(x + '^{' + s.e2 + '}') + ' but the GCF has only ' + t(tx(V(x, s.k1))) + ', so the first term supplies the lower power: ' + t('m=' + s.k1) + '.<br>The first term has ' + t(tx(V(y, s.e1))) + ' but the GCF has only ' + t(tx(V(y, s.k2))) + ', so ' + t('n=' + s.k2) + '.<br>Check: the GCF of ' + t(s.g * s.m1 + tx(Mo(1, (function () { var o = {}; o[x] = s.k1; o[y] = s.e1; return o; })()))) + ' and ' + t(s.g * s.m2 + tx(Mo(1, (function () { var o = {}; o[x] = s.e2; o[y] = s.k2; return o; })()))) + ' is ' + t(G) + ' ✓',
      ['The GCF uses the <b>lowest</b> power of each letter. Which term must have the lower power of ' + t(x) + '?', 'Compare each known exponent with the exponent in the GCF.'], 'GCF backwards: find the exponents');
    pt.bad = badRows(key, 0, [s.e2]).concat(badRows(key, 1, [s.e1]));
    return pt;
  }

  /* ======================= Lesson 2: removing the GCF ======================= */
  function l2q1(r) { // Ryan: 12x³−18x² · 15x⁴−10x³
    var v = r.pick(['x', 'x', 'x', 'a', 'y']), s = pickWhere(function () { return { g: r.int(2, 6), a: r.int(2, 5), b: r.int(2, 5), e: r.int(1, 3), sign: r.chance(0.7) ? -1 : 1 }; },
      function (s) { return s.a !== s.b && gcd(s.a, s.b) === 1 && s.g * Math.max(s.a, s.b) <= 30; });
    var G = T(s.g, v, s.e), Br = lin(s.a, s.sign * s.b, v), full = P.mul(G, Br), ft = tx(full);
    return fpart('Factor by removing the GCF: ' + t(ft), [G, Br],
      [{ is: [G, P.add(T(s.a, v, s.e + 1), T(s.sign * s.b, v, s.e))], code: 'u4x-exp-kept', hint: 'You divided the numbers but not the variables. Dividing ' + t(tx(V(v, s.e + 1))) + ' by ' + t(tx(V(v, s.e))) + ' leaves ' + t(v) + '. Expand your answer to check.' },
        { is: [G, lin(s.a, -s.sign * s.b, v)], code: 'u4x-bracket-sign', hint: 'Each term keeps its sign when you divide by a positive GCF.' },
        { is: [G, T(s.a, v, 1)], code: 'u4x-lost-term', hint: 'The bracket needs one term for <b>each</b> term of the polynomial: two terms in, two terms out.' }],
      'The GCF of ' + t(s.g * s.a) + ' and ' + t(s.g * s.b) + ' is ' + t(s.g) + ', and the lowest power of ' + t(v) + ' is ' + t(tx(V(v, s.e))) + ', so the GCF is ' + t(tx(G)) + '.<br>' + t(tx(T(s.g * s.a, v, s.e + 1)) + '\\div ' + tx(G) + '=' + tx(T(s.a, v, 1))) + ' and ' + t(tx(T(s.g * s.b, v, s.e)) + '\\div ' + tx(G) + '=' + s.b) + '.<br>' + t(ft + '=' + tx(G) + '(' + tx(Br) + ')') + '<br>Check: expanding gives ' + t(ft) + ' ✓',
      ['The GCF is the GCF of the numbers times the <b>lowest</b> power of ' + t(v) + '.', 'Divide <b>each</b> term by the GCF to get the bracket.'], 'remove a GCF with a variable');
  }
  function l2q2(r) { // negative GCF with a leftover 1 (Ryan: −9x³+6x²−3x · −8x³+12x²−4x)
    var v = 'x', s = pickWhere(function () { return { g: r.int(2, 5), a: r.int(2, 5), b: nz(r, 1, 5) }; }, function (s) { var D = s.b * s.b - 4 * s.a; return Math.abs(s.b) !== s.a && !(D >= 0 && isSq(D)); }); // the bracket doesn't factor again
    var G = T(-s.g, v, 1), Br = P.add(T(s.a, v, 2), T(s.b, v, 1), P.num(1)), full = P.mul(G, Br), ft = tx(full);
    var part = fpart('The leading term is negative, so factor out a <b>negative</b> GCF: ' + t(ft), [G, Br],
      [{ is: [G, P.add(T(s.a, v, 2), T(-s.b, v, 1), P.num(-1))], code: 'u4x-neg-signs', hint: 'Dividing by a <b>negative</b> changes the sign of <b>every</b> term. Check the signs of the last two terms in your bracket.' },
        { is: [G, P.add(T(-s.a, v, 2), T(-s.b, v, 1), P.num(-1))], code: 'u4x-neg-front', hint: 'You wrote ' + t(tx(G)) + ' in front but kept the original signs in the bracket. Dividing by a negative changes every sign — expand your answer to check.' },
        { is: [G, P.add(T(s.a, v, 2), T(s.b, v, 1))], code: 'u4x-drop-one', hint: 'One term equals the GCF itself: dividing it by the GCF leaves ' + t('1') + ', which must stay in the bracket.' }],
      'GCF ' + t('=' + tx(G)) + ' (negative, because the leading term is negative).<br>' + t(tx(T(-s.g * s.a, v, 3)) + '\\div(' + tx(G) + ')=' + tx(T(s.a, v, 2))) + ', ' + t(tx(T(-s.g * s.b, v, 2)) + '\\div(' + tx(G) + ')=' + tx(T(s.b, v, 1))) + ', ' + t(tx(G) + '\\div(' + tx(G) + ')=1') + '.<br>' + t(ft + '=' + tx(G) + '(' + tx(Br) + ')'),
      ['The GCF is negative here. Dividing by a negative changes the sign of every term.', 'The term equal to the GCF leaves ' + t('1') + ' in the bracket.'], 'negative GCF, leftover 1');
    return negOnly(part, G);
  }
  function l2q3(r) { // added Mastery: a negative GCF with two variables and a leftover 1
    var vs = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n']]), u = vs[0], w = vs[1];
    var s = pickWhere(function () { return { g: r.int(2, 5), i: r.pick([1, 1, 2]), j: r.pick([1, 1, 2]), p: r.int(2, 5), q: nz(r, 2, 5) }; }, function (s) { return Math.abs(s.p) !== Math.abs(s.q) && !(s.i === 2 && s.j === 2); });
    var og = {}; og[u] = s.i; og[w] = s.j;
    var G = Mo(-s.g, og), Br = P.add(T(s.p, u, 1), T(s.q, w, 1), P.num(1)), full = P.mul(G, Br), shown = P.seq(P.sorted(full).map(function (x) { return P.mono(x.c, x.v); }));
    var part = fpart('Factor out a <b>negative</b> GCF: ' + t(shown), [G, Br],
      [{ is: [G, P.add(T(s.p, u, 1), T(-s.q, w, 1), P.num(-1))], code: 'u4x-neg-signs', hint: 'Dividing by a <b>negative</b> changes the sign of <b>every</b> term — check the signs of the last two terms in your bracket.' },
        { is: [G, P.add(T(s.p, u, 1), T(s.q, w, 1))], code: 'u4x-drop-one', hint: 'One term equals the GCF itself: dividing it by the GCF leaves ' + t('1') + ', which must stay in the bracket.' },
        { is: [G, P.add(T(-s.p, u, 1), T(-s.q, w, 1), P.num(-1))], code: 'u4x-neg-front', hint: 'You took out a negative factor, so the signs inside the bracket change. Expand your answer to check.' },
        { is: [P.num(-s.g), P.mul(Mo(1, og), Br)], code: 'u4x-gcf-part', hint: 'Every term also has ' + t(tx(Mo(1, og))) + ': take the letters out too.' }],
      'Numbers: the GCF of the coefficients is ' + t(s.g) + '. Letters: every term has at least ' + t(tx(Mo(1, og))) + '. Make it negative: GCF ' + t('=' + tx(G)) + '.<br>Divide each term by ' + t(tx(G)) + ' — every sign changes, and the term equal to the GCF leaves ' + t('1') + ':<br>' + t(shown + '=' + tx(G) + '(' + tx(Br) + ')') + '<br>Check: expanding gives back ' + t(shown) + ' ✓',
      ['The GCF is the greatest number and the lowest power of each letter in every term. Make it negative.', 'Dividing by a negative changes every sign; a term equal to the GCF leaves ' + t('1') + '.'], 'negative GCF in two variables');
    return negOnly(part, G);
  }

  /* ======================= Lesson 3: x² + bx + c, c positive ======================= */
  function samePair(r, lo, hi, negP, maxC) {
    return pickWhere(function () { var neg = r.chance(negP) ? -1 : 1; return { p: neg * r.int(lo, hi), q: neg * r.int(lo, hi) }; }, function (o) { return o.p !== o.q && o.p * o.q <= maxC; });
  }
  function l3q1(r) { // Ryan: x²−11x+24 · x²−13x+36
    var pq = samePair(r, 1, 9, 0.7, 60), s = spec({ v: 'x', p: Math.min(pq.p, pq.q), q: Math.max(pq.p, pq.q) });
    return monicPart('Factor: ' + t(tx(s.full)), s, [], 'factor x² + bx + c, c > 0');
  }
  function l3q2(r) { // Ryan: 2x²+14x+24 · 2x²+16x+30
    var k = r.pick([2, 2, 3, 4]), pq = samePair(r, 1, 7, 0.25, 30), s = spec({ v: 'x', p: Math.min(pq.p, pq.q), q: Math.max(pq.p, pq.q), G: P.num(k) });
    var lead = P.add(T(1, 'x', 2), T(k * s.b, 'x', 1), P.num(k * s.c));
    return monicPart('Factor completely. (Remove the common factor first.) ' + t(tx(s.full)), s,
      [{ is: lead, code: 'u4x-lead-ignored', hint: 'Your brackets multiply to ' + t(tx(lead)) + ': the ' + t(k) + ' in front of ' + t('x^{2}') + ' is gone. Take out the common factor ' + t(k) + ' first, then factor what is left.' }], 'GCF, then x² + bx + c');
  }
  function l3q3(r) { // added Mastery: every positive b (Ryan's lesson: "the smallest positive b for x²+bx+24")
    var c = r.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 44, 45, 48, 50, 52, 54, 56, 63, 64, 75]); // 3 to 5 factor pairs
    var pairs = posPairs(c), sums = pairs.map(function (pq) { return pq[0] + pq[1]; }).sort(function (x, y) { return x - y; }), divs = [];
    pairs.forEach(function (pq) { divs.push(pq[0]); if (pq[1] !== pq[0]) divs.push(pq[1]); }); divs.sort(function (x, y) { return x - y; });
    var expr = 'x^{2}+bx+' + c;
    return { prompt: 'List <b>every positive</b> integer ' + t('b') + ' for which ' + t(expr) + ' can be factored.', input: { type: 'list' }, key: sums, answer: t(sums.join(',\\ ')),
      check: function (resp) {
        if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
        resp = resp.map(Number); if (resp.some(function (x) { return !Number.isInteger(x); })) return wrong('u4x-not-b', 'Each value of ' + t('b') + ' is a whole number.');
        var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + t(resp[i]) + ' more than once.'); seen[resp[i]] = 1; }
        var srt = resp.slice().sort(function (x, y) { return x - y; }), pos = srt.filter(function (x) { return x > 0; });
        if (pos.length < srt.length) return pos.join() === sums.join() ? form('u4x-neg-b', 'Your positive values are all right — the question asks for <b>positive</b> values of ' + t('b') + ' only, so leave out the others.') : wrong('u4x-not-b', 'The question asks for <b>positive</b> values of ' + t('b') + ' only. Each factor pair of ' + t(c) + ' gives one value: its sum.');
        if (srt.join() === divs.join() && divs.join() !== sums.join()) return wrong('u4x-b-factors', 'Those are the factors of ' + t(c) + '. Each value of ' + t('b') + ' is the <b>sum</b> of a factor pair, like ' + t(pairs[0][0] + '+' + pairs[0][1] + '=' + (pairs[0][0] + pairs[0][1])) + '.');
        var bad = resp.filter(function (x) { return sums.indexOf(x) < 0; });
        if (bad.length) return wrong('u4x-not-b', 'For ' + t('b=' + bad[0]) + ' no two integers multiply to ' + t(c) + ' and add to ' + t(bad[0]) + ', so ' + t('x^{2}+' + bad[0] + 'x+' + c) + ' doesn’t factor.');
        if (resp.length < sums.length) return wrong('u4x-missing-b', 'You have ' + resp.length + ' of the ' + sums.length + ' values. Go through every factor pair of ' + t(c) + ': ' + t('1\\times ' + c) + ', ' + t('2\\times ?') + ', …');
        return ok();
      },
      solution: 'We need two integers with product ' + t(c) + ' and sum ' + t('b') + '. For a positive ' + t('b') + ', both integers are positive. List every factor pair of ' + t(c) + ':<br>' +
        pairs.map(function (pq) { return t(pq[0] + '\\times ' + pq[1]) + ' → ' + t('b=' + (pq[0] + pq[1])); }).join(',&nbsp; ') + '.<br>So ' + t('b=' + sums.join(',\\ ')) + '. (For example, ' + t('b=' + (pairs[0][0] + pairs[0][1])) + ' gives ' + t('x^{2}+' + (pairs[0][0] + pairs[0][1]) + 'x+' + c + '=' + FX.tex(pairs[0][0] === pairs[0][1] ? [{ p: lin(1, pairs[0][0], 'x'), k: 2 }] : [lin(1, pairs[0][0], 'x'), lin(1, pairs[0][1], 'x')])) + '.)',
      hints: ['The trinomial factors when two integers multiply to ' + t(c) + ' and add to ' + t('b') + '.', 'Each factor pair of ' + t(c) + ' gives one value of ' + t('b') + ': its sum. Start with ' + t('1\\times ' + c) + '.'], text: 'all positive b for x²+bx+' + c,
      bad: [divs.join() !== sums.join() ? divs : sums.slice(1), sums.slice(1), sums.concat([sums[sums.length - 1] + 1]), sums.concat(sums.map(function (x) { return -x; })).filter(function (x, i) { return i !== 0; })] };
  }

  /* ======================= Lesson 4: x² + bx + c, c negative ======================= */
  function oppPair(r, lo, hi, maxC) {
    return pickWhere(function () { return { p: nz(r, lo, hi), q: nz(r, lo, hi) }; }, function (o) { return o.p * o.q < 0 && Math.abs(o.p) !== Math.abs(o.q) && Math.abs(o.p * o.q) <= maxC; });
  }
  function l4q1(r) { // Ryan: x²−5x−36 · x²−4x−21
    var pq = oppPair(r, 1, 12, 60), s = spec({ v: 'x', p: Math.min(pq.p, pq.q), q: Math.max(pq.p, pq.q) });
    return monicPart('Factor: ' + t(tx(s.full)), s, [{ is: [P.add(V('x'), P.num(-s.p)), P.add(V('x'), P.num(s.q))], code: 'u4x-pair-signs', hint: 'The product is negative, so the brackets have <b>opposite</b> signs. ' + signHint(s.b, s.c) }], 'factor x² + bx + c, c < 0');
  }
  function l4q2(r) { // Ryan: 3x²−6x−45 · 2x²−2x−24
    var k = r.int(2, 5), pq = oppPair(r, 1, 7, 30), s = spec({ v: 'x', p: Math.min(pq.p, pq.q), q: Math.max(pq.p, pq.q), G: P.num(k) });
    return monicPart('Factor completely: ' + t(tx(s.full)), s, [], 'GCF, then x² + bx + c, c < 0');
  }
  function l4q3(r) { // prime trinomial (Ryan: x²+4x−15 · x²+3x−8); his Mastery tag kept
    var B = r.int(1, 6), b = (r.chance(0.6) ? 1 : -1) * B, fac = [], pr = [];
    for (var n = 1; n * (n + B) <= 50; n++) fac.push(n * (n + B));
    for (var c = 6; c <= 40; c++) if (fac.indexOf(c) < 0 && posPairs(c).length > 1) pr.push(c); // composite, but no factor pair differs by B
    var cs = r.shuffle(fac.filter(function (x) { return x >= 4; })), c1 = cs[0], c2 = cs[1], cp = r.pick(pr);
    var pairOf = function (c) { for (var n = 1; n * (n + B) <= c; n++) if (n * (n + B) === c) return [n, n + B]; return null; };
    var why = function (bb, c) { var nm = pairOf(c), big = bb > 0 ? nm[1] : -nm[1], small = bb > 0 ? -nm[0] : nm[0]; return t(big) + ' and ' + t(small) + ' multiply to ' + t(-c) + ' and add to ' + t(bb) + ', so ' + t(triTex('x', bb, -c) + '=' + FX.tex([lin(1, big, 'x'), lin(1, small, 'x')])) + '.'; };
    var opts = [{ html: t(triTex('x', b, -c1)), right: false, why: why(b, c1), code: 'fac1' }, { html: t(triTex('x', -b, -c1)), right: false, why: why(-b, c1), code: 'fac2' },
      { html: t(triTex('x', b, -c2)), right: false, why: why(b, c2), code: 'fac3' }, { html: t(triTex('x', b, -cp)), right: true }];
    var pp = posPairs(cp), sums = []; pp.forEach(function (q) { sums.push(q[1] - q[0]); sums.push(q[0] - q[1]); });
    return KP.mc(r, 'Which trinomial is <b>prime</b> (cannot be factored over the integers)?', opts,
      'Pairs for ' + t(-cp) + ' (one positive, one negative): ' + pp.map(function (q) { return t(q[0] + '\\times ' + q[1]); }).join(', ') + '. With opposite signs the possible sums are ' + t(sums.join(',\\ ')) + '. None is ' + t(b) + ', so ' + t(triTex('x', b, -cp)) + ' is prime.<br>Each of the others factors, e.g. ' + why(b, c1),
      ['A trinomial is prime when no two integers have the right product <b>and</b> the right sum.', 'For each option, list the factor pairs of the last term and check whether one pair (with opposite signs) adds to the middle coefficient.'], 'which trinomial is prime');
  }

  /* ======================= Lesson 5: difference of squares ======================= */
  function l5q1(r) { // Ryan: 4x²−81 · 9x²−64
    var s = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 10) }; }, function (s) { return gcd(s.a, s.b) === 1 && s.a !== s.b; });
    var AX = T(s.a, 'x', 1), full = P.sub(P.mul(AX, AX), P.num(s.b * s.b)), Am = bin(AX, -s.b), Ap = bin(AX, s.b);
    return fpart('Factor: ' + t(tx(full)), [Am, Ap],
      [{ is: [{ p: Am, k: 2 }], code: 'u4x-dos-square', hint: t('(' + tx(Am) + ')^{2}') + ' has a middle term. A difference of squares factors as a <b>difference times a sum</b>: ' + t('a^{2}-b^{2}=(a-b)(a+b)') + '.' },
        { is: [{ p: Ap, k: 2 }], code: 'u4x-dos-square', hint: 'A difference of squares factors as a <b>difference times a sum</b>: ' + t('a^{2}-b^{2}=(a-b)(a+b)') + '.' },
        { is: [lin(s.a * s.a, -s.b, 'x'), lin(s.a * s.a, s.b, 'x')], code: 'u4x-no-root', hint: 'Use the square root of ' + t(s.a * s.a + 'x^{2}') + ', which is ' + t(s.a + 'x') + '.' },
        { is: [lin(1, -s.b, 'x'), lin(1, s.b, 'x')], code: 'u4x-dropped-coef', hint: 'Your brackets multiply to ' + t('x^{2}-' + s.b * s.b) + ': the ' + t(s.a * s.a) + ' in front of ' + t('x^{2}') + ' is lost. The square root of ' + t(s.a * s.a + 'x^{2}') + ' is ' + t(s.a + 'x') + '.' }],
      t('\\sqrt{' + s.a * s.a + 'x^{2}}=' + s.a + 'x') + ' and ' + t('\\sqrt{' + s.b * s.b + '}=' + s.b) + ', so ' + t(tx(full) + '=(' + tx(Am) + ')(' + tx(Ap) + ')') + '.<br>Check: ' + t(s.a * s.a + 'x^{2}+' + s.a * s.b + 'x-' + s.a * s.b + 'x-' + s.b * s.b + '=' + tx(full)) + ' ✓',
      ['Write each term as a square: ' + t(s.a * s.a + 'x^{2}=(' + s.a + 'x)^{2}') + '.', t('a^{2}-b^{2}=(a-b)(a+b)') + '.'], 'difference of squares a²x² − b²');
  }
  function l5q2(r) { // Ryan: 3x²−75 · 2x²−98
    var s = pickWhere(function () { return { k: r.int(2, 5), n: r.int(2, 9) }; }, function (s) { return s.k * s.n * s.n <= 250; });
    var X = V('x'), Am = bin(X, -s.n), Ap = bin(X, s.n), full = P.scale(P.mul(Am, Ap), s.k);
    return fpart('Factor completely: ' + t(tx(full)), [P.num(s.k), Am, Ap],
      [{ is: [Am, Ap], code: 'u4x-gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(s.k) + ' is missing. Multiply your answer out: you get ' + t('x^{2}-' + s.n * s.n) + '.' },
        { is: [P.num(s.k), { p: Am, k: 2 }], code: 'u4x-dos-square', hint: 'After taking out ' + t(s.k) + ', the bracket is a difference of squares: a <b>difference times a sum</b>.' },
        { is: [P.num(s.k), bin(X, -s.n * s.n), bin(X, s.n * s.n)], code: 'u4x-no-root', hint: 'Use the square root: ' + t(s.n * s.n + '=' + s.n + '^{2}') + '.' }],
      'GCF first: ' + t(tx(full) + '=' + s.k + '(x^{2}-' + s.n * s.n + ')') + '.<br>Then ' + t('x^{2}-' + s.n * s.n + '=(x-' + s.n + ')(x+' + s.n + ')') + ', so ' + t(tx(full) + '=' + s.k + '(x-' + s.n + ')(x+' + s.n + ')') + '.',
      ['Take out the common factor ' + t(s.k) + ' first.', 'Then the bracket is ' + t('a^{2}-b^{2}=(a-b)(a+b)') + '.'], 'GCF, then difference of squares');
  }
  function l5q3(r) { // Ryan: which binomial cannot be factored as a difference of squares
    var s = pickWhere(function () { return { n1: r.int(2, 9), n2: r.int(2, 9), m: r.int(2, 9), a: r.int(2, 4), b: r.int(1, 5), same: r.chance(0.5) }; },
      function (s) { if (s.same) s.n2 = s.n1; return gcd(s.a, s.b) === 1 && s.a !== s.b && s.m !== s.n1 && (s.same || s.n2 !== s.n1); });
    var opts = [{ html: t('x^{2}-' + s.n1 * s.n1), right: false, why: t(s.n1 * s.n1 + '=' + s.n1 + '^{2}') + ', so ' + t('x^{2}-' + s.n1 * s.n1 + '=(x-' + s.n1 + ')(x+' + s.n1 + ')') + '.', code: 'dos1' },
      { html: t('x^{2}+' + s.n2 * s.n2), right: true },
      { html: t(s.a * s.a + 'x^{2}-' + s.b * s.b), right: false, why: t(s.a * s.a + 'x^{2}=(' + s.a + 'x)^{2}') + ' and ' + t(s.b * s.b + '=' + s.b + '^{2}') + ', so it is ' + t('(' + s.a + 'x-' + s.b + ')(' + s.a + 'x+' + s.b + ')') + '.', code: 'dos2' },
      { html: t(s.m * s.m + '-x^{2}'), right: false, why: 'The order doesn’t matter: ' + t(s.m * s.m + '-x^{2}=(' + s.m + '-x)(' + s.m + '+x)') + '.', code: 'dos3' }];
    return KP.mc(r, 'Which binomial <b>cannot</b> be factored as a difference of squares?', opts,
      t('x^{2}+' + s.n2 * s.n2) + ' is a <b>sum</b> of squares, which cannot be factored over the integers. The other three are subtractions of two perfect squares:<br>' + t('x^{2}-' + s.n1 * s.n1 + '=(x-' + s.n1 + ')(x+' + s.n1 + ')') + ', ' + t(s.a * s.a + 'x^{2}-' + s.b * s.b + '=(' + s.a + 'x-' + s.b + ')(' + s.a + 'x+' + s.b + ')') + ', ' + t(s.m * s.m + '-x^{2}=(' + s.m + '-x)(' + s.m + '+x)') + '.',
      ['A difference of squares needs two perfect squares with a <b>minus</b> sign between them.'], 'not a difference of squares');
  }
  function l5q4(r) { // added Mastery: GCF, then a difference of squares with a ≠ 1 (lesson Q7/Q14 level)
    var s = pickWhere(function () { return { k: r.int(2, 5), a: r.int(2, 3), b: r.int(1, 7) }; }, function (s) { return gcd(s.a, s.b) === 1 && s.k * s.b * s.b <= 150; });
    var AX = T(s.a, 'x', 1), Am = bin(AX, -s.b), Ap = bin(AX, s.b), D = P.mul(Am, Ap), full = P.scale(D, s.k);
    return fpart('Factor completely: ' + t(tx(full)), [P.num(s.k), Am, Ap],
      [{ is: [Am, Ap], code: 'u4x-gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(s.k) + ' is missing. Multiply your answer out to check.' },
        { is: [P.num(s.k), { p: Am, k: 2 }], code: 'u4x-dos-square', hint: 'After taking out ' + t(s.k) + ', the bracket is a difference of squares: a <b>difference times a sum</b>.' },
        { is: [P.num(s.k), lin(s.a * s.a, -s.b, 'x'), lin(s.a * s.a, s.b, 'x')], code: 'u4x-no-root', hint: 'Use the square root of ' + t(s.a * s.a + 'x^{2}') + ', which is ' + t(s.a + 'x') + '.' },
        { is: [P.num(s.k), lin(1, -s.b, 'x'), lin(1, s.b, 'x')], code: 'u4x-dropped-coef', hint: 'The square root of ' + t(s.a * s.a + 'x^{2}') + ' is ' + t(s.a + 'x') + ', not ' + t('x') + '.' }],
      'GCF first: ' + t(tx(full) + '=' + s.k + '(' + tx(D) + ')') + '.<br>The bracket is a difference of squares: ' + t('(' + s.a + 'x)^{2}-' + s.b + '^{2}') + '.<br>' + t('=' + s.k + '(' + tx(Am) + ')(' + tx(Ap) + ')'),
      ['Look for a common factor first: ' + t(tx(full)) + ' is not a difference of squares as written.', 'After the GCF, write each term in the bracket as a square: ' + t('a^{2}-b^{2}=(a-b)(a+b)') + '.'], 'GCF, then a²x² − b²');
  }

  /* ======================= Lesson 6: perfect square trinomials ======================= */
  function l6q1(r) { // Ryan: which is a perfect square trinomial (three-part test)
    var s = pickWhere(function () { return { n: r.int(2, 9), m: r.int(3, 8), k: r.int(2, 6), j: r.int(3, 8), sgn: r.chance(0.7) ? 1 : -1, dj: r.chance(0.5) }; },
      function (s) { var d = s.dj ? s.j : 2 * s.j + 2; return s.k !== s.n && s.j !== s.n && d !== 2 * s.n && 2 * s.m !== 2 * s.k && d !== 2 * s.m && d !== 2 * s.k && s.j * s.j !== s.n * s.n; });
    var d = s.dj ? s.j : 2 * s.j + 2, sg1 = s.sgn;
    var opts = [{ html: t(triTex('x', sg1 * 2 * s.m, s.m * s.m - 1)), right: false, why: t(s.m * s.m - 1) + ' is not a perfect square, so this is not a perfect square trinomial.', code: 'pst1' },
      { html: t(triTex('x', sg1 * 2 * s.n, s.n * s.n)), right: true },
      { html: t(triTex('x', sg1 * 2 * s.k, -s.k * s.k)), right: false, why: 'The last term is <b>negative</b>; a perfect square trinomial ends in ' + t('+b^{2}') + '.', code: 'pst2' },
      { html: t(triTex('x', sg1 * d, s.j * s.j)), right: false, why: 'The roots are ' + t('x') + ' and ' + t(s.j) + ', so the middle term would have to be ' + t('2(x)(' + s.j + ')=' + 2 * s.j + 'x') + ', not ' + t(d + 'x') + '.', code: 'pst3' }];
    return KP.mc(r, 'Use the three-part test. Which is a <b>perfect square trinomial</b>?', opts,
      'Three-part test: the first and last terms are perfect squares, and the middle term is ' + t('2\\times') + ' the product of their roots.<br>For ' + t(triTex('x', sg1 * 2 * s.n, s.n * s.n)) + ': roots ' + t('x') + ' and ' + t(s.n) + ', and ' + t('2(x)(' + s.n + ')=' + 2 * s.n + 'x') + ' ✓. So it is ' + t('(x' + (sg1 > 0 ? '+' : '-') + s.n + ')^{2}') + '.',
      ['Check all three parts: is the first term a square? Is the last term a square (and positive)? Is the middle term twice the product of the roots?'], 'recognize a perfect square trinomial');
  }
  function l6q2(r) { // Ryan: 4x²−20x+25 · 9x²−12x+4
    var s = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 9), sgn: r.chance(0.65) ? -1 : 1 }; }, function (s) { return gcd(s.a, s.b) === 1 && s.a !== s.b; });
    var AX = T(s.a, 'x', 1), A = bin(AX, s.sgn * s.b), full = P.mul(A, A), ft = tx(full);
    return fpart('Factor: ' + t(ft), [{ p: A, k: 2 }],
      [{ is: [{ p: bin(AX, -s.sgn * s.b), k: 2 }], code: 'u4x-pst-sign', hint: 'The middle term is ' + (s.sgn < 0 ? '<b>negative</b>' : '<b>positive</b>') + ', so the sign in the bracket is ' + (s.sgn < 0 ? t('-') : t('+')) + '.' },
        { is: [bin(AX, -s.b), bin(AX, s.b)], code: 'u4x-pst-dos', hint: 'That multiplies to ' + t(s.a * s.a + 'x^{2}-' + s.b * s.b) + ' — no middle term. A perfect square trinomial is the <b>same</b> bracket twice.' },
        { is: [{ p: lin(s.a * s.a, s.sgn * s.b, 'x'), k: 2 }], code: 'u4x-no-root', hint: 'Use the square root of ' + t(s.a * s.a + 'x^{2}') + ', which is ' + t(s.a + 'x') + '.' }],
      t('\\sqrt{' + s.a * s.a + 'x^{2}}=' + s.a + 'x') + ', ' + t('\\sqrt{' + s.b * s.b + '}=' + s.b) + ', and ' + t('2(' + s.a + 'x)(' + s.b + ')=' + 2 * s.a * s.b + 'x') + ' matches the middle term.<br>The middle term is ' + (s.sgn < 0 ? 'negative' : 'positive') + ', so ' + t(ft + '=(' + tx(A) + ')^{2}') + '.',
      ['Find the square roots of the first and last terms. Is the middle term twice their product?', 'The sign of the middle term is the sign in the bracket.'], 'factor a perfect square trinomial');
  }
  function l6q3(r) { // Ryan: x²−kx+81 is a perfect square, k positive (Mastery)
    var s = pickWhere(function () { return { a: r.pick([1, 1, 1, 4, 9]), n: r.int(3, 12), minus: r.chance(0.5) }; }, function (s) { var ra = Math.round(Math.sqrt(s.a)); return gcd(ra, s.n) === 1 && (s.a === 1 || s.n <= 9); });
    var ra = Math.round(Math.sqrt(s.a)), k = 2 * ra * s.n, lead = (s.a === 1 ? '' : s.a) + 'x^{2}', expr = lead + (s.minus ? '-' : '+') + 'kx+' + s.n * s.n;
    var alts = [{ v: ra * s.n, code: 'u4x-mid-half', hint: 'Remember to <b>double</b>: the middle term is ' + t('2\\times') + ' the product of the roots.' }, { v: 2 * s.n * s.n, code: 'u4x-mid-square', hint: 'Use the square <b>root</b> of ' + t(s.n * s.n) + ', which is ' + t(s.n) + '.' }, { v: s.n * s.n, code: 'u4x-mid-square', hint: 'The middle term comes from the square <b>root</b> of the last term: ' + t('2\\times(\\text{root})\\times(\\text{root})') + '.' }];
    if (s.a > 1) alts.push({ v: 2 * s.n, code: 'u4x-k-noa', hint: 'The root of ' + t(lead) + ' is ' + t(ra + 'x') + ', not ' + t('x') + '.' });
    var p = KP.number(t(expr) + ' is a perfect square trinomial, and ' + t('k') + ' is positive. What is the value of ' + t('k') + '?', k, function (v) { for (var i = 0; i < alts.length; i++) if (v === alts[i].v && v !== k) return { code: alts[i].code, hint: alts[i].hint }; if (v === -k) return { code: 'u4x-pst-sign', hint: t('k') + ' is positive: the minus sign is already written in front of it.' }; return null; },
      'Roots: ' + t((s.a === 1 ? 'x' : ra + 'x')) + ' and ' + t(s.n) + '. The middle term is ' + t('2(' + (s.a === 1 ? 'x' : ra + 'x') + ')(' + s.n + ')=' + k + 'x') + ', so ' + t('k=' + k) + '.<br>' + t(lead + (s.minus ? '-' : '+') + k + 'x+' + s.n * s.n + '=(' + (s.a === 1 ? 'x' : ra + 'x') + (s.minus ? '-' : '+') + s.n + ')^{2}'),
      ['Find the square roots of the first and last terms.', 'The middle term of a perfect square is ' + t('2\\times') + ' the product of those roots.'], 'missing middle coefficient of a perfect square');
    p.bad = alts.map(function (a) { return String(a.v); }).filter(function (v) { return v !== String(k); });
    return p;
  }

  /* ======================= Lesson 7: ax² + bx + c by decomposition ======================= */
  function axPos(r) { return pickWhere(function () { var a = r.pick([2, 3]); return axSpec(1, r.int(1, 7), a, r.int(1, 7), 'x'); }, function (o) { return gcd(o.r, o.s) === 1 && o.q * o.r !== o.s && o.b <= 25 && o.m !== o.n; }); }
  function axNeg(r) { return pickWhere(function () { var a = r.pick([2, 3]); return axSpec(1, nz(r, 1, 6), a, nz(r, 1, 7), 'x'); }, function (o) { return o.c < 0 && o.b !== 0 && gcd(o.r, Math.abs(o.s)) === 1 && Math.abs(o.b) <= 15 && o.m !== o.n; }); }
  function axPart(prompt, o, text) { return fpart(prompt + t(tx(o.full)), o.list, axWrongs(o), axSol(o) + '<br>Check: ' + t(br(o.A) + br(o.B)) + ' expands to ' + t(tx(o.full)) + ' ✓', axHints(o), text); }
  function l7q1(r) { return axPart('Factor by decomposition: ', axPos(r), 'decomposition, all positive'); } // Ryan: 2x²+11x+12 · 3x²+10x+8
  function l7q2(r) { return axPart('Factor by decomposition: ', axNeg(r), 'decomposition, c < 0'); } // Ryan: 2x²−5x−3 · 2x²−3x−5
  function l7q3(r) { // added Mastery: GCF first, then decomposition (lesson Part D)
    var k = r.pick([2, 2, 3]), o = r.chance(0.5) ? axPos(r) : axNeg(r);
    while (Math.abs(k * o.b) > 40 || k * o.a * k > 60) o = axNeg(r);
    var full = P.scale(o.full, k), K0 = P.num(k);
    return fpart('Factor completely: ' + t(tx(full)), [K0].concat(o.list),
      [{ is: o.list, code: 'u4x-gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(k) + ' is missing. Multiply your answer out to check.' }].concat(axWrongs(o).map(function (w) { return { is: [K0].concat(w.is), code: w.code, hint: w.hint }; })),
      'GCF first: ' + t(tx(full) + '=' + k + '(' + tx(o.full) + ')') + '.<br>Then decompose the bracket: ' + axSol(o) + '<br>So ' + t(tx(full) + '=' + FX.tex([K0].concat(o.list))) + '.',
      ['Every term has a common factor of ' + t(k) + '. Take it out first.', 'The trinomial left has ' + t('a\\ne 1') + ': find two integers with product ' + t('ac') + ' and sum ' + t('b') + ', split, and group.'], 'GCF, then decomposition');
  }

  /* ======================= Lesson 8: choosing a factoring strategy ======================= */
  function l8q1(r) { // Ryan: which methods, in order, factor 5x²−45 completely
    var k = r.int(2, 6), dos = r.chance(0.5), expr, sol, opts;
    if (dos) {
      var n = pickWhere(function () { return r.int(2, 9); }, function (n) { return k * n * n <= 200; });
      expr = k + 'x^{2}-' + k * n * n;
      opts = [{ html: 'Difference of squares only', right: false, why: t(k + 'x^{2}') + ' and ' + t(k * n * n) + ' are not perfect squares as written: take out the GCF first.', code: 'dos-only' },
        { html: 'GCF only', right: false, why: 'After the GCF, ' + t('x^{2}-' + n * n) + ' still factors: it is a difference of squares.', code: 'gcf-only' },
        { html: 'GCF, then difference of squares', right: true },
        { html: 'GCF, then decomposition', right: false, why: 'After the GCF there are only <b>two</b> terms left; decomposition is for trinomials.', code: 'gcf-decomp' }];
      sol = 'GCF ' + t(k) + ': ' + t(expr + '=' + k + '(x^{2}-' + n * n + ')') + '. Two terms left, both perfect squares with a minus: ' + t(k + '(x-' + n + ')(x+' + n + ')') + '.';
    } else {
      var pq = pickWhere(function () { return { p: nz(r, 1, 6), q: nz(r, 1, 6) }; }, function (o) { return o.p !== o.q && o.p + o.q !== 0 && Math.abs(k * o.p * o.q) <= 90 && Math.abs(k * (o.p + o.q)) <= 40; });
      var s = spec({ v: 'x', p: Math.min(pq.p, pq.q), q: Math.max(pq.p, pq.q), G: P.num(k) });
      expr = tx(s.full);
      opts = [{ html: 'Trinomial ' + t('(a=1)') + ' only', right: false, why: 'The leading coefficient is ' + t(k) + ', not ' + t('1') + ': take out the GCF first.', code: 'tri-only' },
        { html: 'GCF only', right: false, why: 'After the GCF, ' + t(tx(s.inner)) + ' still factors.', code: 'gcf-only' },
        { html: 'GCF, then trinomial ' + t('(a=1)'), right: true },
        { html: 'GCF, then difference of squares', right: false, why: 'After the GCF there are <b>three</b> terms left; a difference of squares has two.', code: 'gcf-dos' }];
      sol = 'GCF ' + t(k) + ': ' + t(expr + '=' + k + '(' + tx(s.inner) + ')') + '. Three terms left with ' + t('a=1') + ': product ' + t(s.c) + ', sum ' + t(s.b) + ' gives ' + t(s.key) + '.';
    }
    return KP.mc(r, 'Which methods, in order, factor ' + t(expr) + ' completely?', opts, sol,
      ['Checklist step 1: is there a GCF? Step 2: count the terms that are left.', 'Step 3: can anything be factored again?'], 'choose the methods');
  }
  function l8q2(r) { // Ryan: 2x²+20x+50 · 3x²−18x+27
    var s = pickWhere(function () { return { k: r.int(2, 5), n: nz(r, 2, 7) }; }, function (s) { return s.k * s.n * s.n <= 200; });
    var X = V('x'), A = bin(X, s.n), K0 = P.num(s.k), full = P.scale(P.mul(A, A), s.k), ft = tx(full), inner = tx(P.mul(A, A));
    return fpart('Factor completely: ' + t(ft), [K0, { p: A, k: 2 }],
      [{ is: [{ p: A, k: 2 }], code: 'u4x-gcf-dropped', hint: 'Your bracket is right, but the common factor ' + t(s.k) + ' is missing.' },
        { is: [K0, bin(X, -Math.abs(s.n)), bin(X, Math.abs(s.n))], code: 'u4x-pst-dos', hint: 'That multiplies to ' + t(s.k + '(x^{2}-' + s.n * s.n + ')') + ' — no middle term. ' + t(inner) + ' is a perfect square trinomial: the same bracket twice.' },
        { is: [K0, { p: bin(X, -s.n), k: 2 }], code: 'u4x-pst-sign', hint: 'The middle term is ' + (s.n < 0 ? 'negative' : 'positive') + ', so the sign in the bracket is ' + (s.n < 0 ? t('-') : t('+')) + '.' }],
      'GCF ' + t(s.k) + ': ' + t(ft + '=' + s.k + '(' + inner + ')') + '.<br>Roots ' + t('x') + ' and ' + t(Math.abs(s.n)) + ', and ' + t('2(x)(' + Math.abs(s.n) + ')=' + 2 * Math.abs(s.n) + 'x') + ' ✓, so the bracket is a perfect square: ' + t(ft + '=' + s.k + '(' + tx(A) + ')^{2}') + '.',
      ['Take out the GCF first.', 'Is what is left a perfect square trinomial? Check the three parts.'], 'GCF, then perfect square');
  }
  function l8q3(r) { // Ryan: 3x³−12x · 2x³−18x
    var s = pickWhere(function () { return { k: r.int(2, 6), n: r.int(2, 7) }; }, function (s) { return s.k * s.n * s.n <= 150; });
    var X = V('x'), G = T(s.k, 'x', 1), Am = bin(X, -s.n), Ap = bin(X, s.n), full = P.mul(G, Am, Ap), ft = tx(full);
    return fpart('Factor completely: ' + t(ft), [G, Am, Ap],
      [{ is: [G, { p: Am, k: 2 }], code: 'u4x-dos-square', hint: 'A difference of squares is a <b>difference times a sum</b>, not a square.' },
        { is: [G, bin(X, -s.n * s.n), bin(X, s.n * s.n)], code: 'u4x-no-root', hint: 'Use the square root: ' + t(s.n * s.n + '=' + s.n + '^{2}') + '.' },
        { is: [Am, Ap], code: 'u4x-gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(tx(G)) + ' is missing.' },
        { is: [P.num(s.k), Am, Ap], code: 'u4x-gcf-part', hint: 'Every term also has an ' + t('x') + ': the GCF is ' + t(tx(G)) + '.' }],
      'GCF ' + t(tx(G)) + ': ' + t(ft + '=' + tx(G) + '(x^{2}-' + s.n * s.n + ')') + '.<br>Two terms left, both squares with a minus: ' + t('=' + tx(G) + '(x-' + s.n + ')(x+' + s.n + ')') + '.',
      ['The GCF includes an ' + t('x') + '.', 'After the GCF, check the bracket: two squares with a minus between them?'], 'GCF with x, then difference of squares');
  }
  function l8q4(r) { // added Mastery: find the error (a common factor left inside a bracket) and factor completely
    var who = r.pick(NAMES), j, fullP, samLHS, sam, target, why, sol;
    if (r.chance(0.5)) { // j²x² − j²n² as (jx − jn)(jx + jn)
      var s = pickWhere(function () { return { j: r.pick([2, 3]), n: r.int(2, 6) }; }, function (s) { return s.j * s.j * s.n * s.n <= 150 && s.n !== s.j; });
      j = s.j; var X = V('x'); fullP = P.scale(P.sub(P.mul(X, X), P.num(s.n * s.n)), j * j);
      sam = '(' + j + 'x-' + j * s.n + ')(' + j + 'x+' + j * s.n + ')'; target = [P.num(j * j), bin(X, -s.n), bin(X, s.n)];
      why = 'Each bracket of ' + t(sam) + ' still has a common factor of ' + t(j) + '.';
      sol = 'Expanding ' + t(sam) + ' does give ' + t(tx(fullP)) + ', but each bracket still has a common factor of ' + t(j) + '. Take the GCF out first:<br>' + t(tx(fullP) + '=' + j * j + '(x^{2}-' + s.n * s.n + ')=' + FX.tex(target)) + '.<br>(Same thing from ' + who + '’s answer: ' + t(sam + '=' + j + '(x-' + s.n + ')\\cdot ' + j + '(x+' + s.n + ')=' + FX.tex(target)) + '.)';
    } else { // k x² + k b x + k c as (kx + kp)(x + q)
      var k = r.pick([2, 3]), pq = pickWhere(function () { return { p: nz(r, 1, 6), q: nz(r, 1, 6) }; }, function (o) { return o.p !== o.q && o.p + o.q !== 0 && Math.abs(k * o.p * o.q) <= 60; });
      var sp = spec({ v: 'x', p: pq.p, q: pq.q, G: P.num(k) });
      j = k; fullP = sp.full; target = sp.list;
      sam = '(' + tx(lin(k, k * pq.p, 'x')) + ')(' + tx(lin(1, pq.q, 'x')) + ')';
      why = 'The bracket ' + t('(' + tx(lin(k, k * pq.p, 'x')) + ')') + ' still has a common factor of ' + t(k) + '.';
      sol = 'Expanding ' + t(sam) + ' does give ' + t(tx(fullP)) + ', but ' + t('(' + tx(lin(k, k * pq.p, 'x')) + ')') + ' still has a common factor of ' + t(k) + '. Take the GCF out first:<br>' + t(tx(fullP) + '=' + k + '(' + tx(sp.inner) + ')=' + sp.key) + '.';
    }
    samLHS = tx(fullP);
    var part = fpart(who + ' factored ' + t(samLHS) + ' as ' + t(sam) + '. The brackets multiply back to ' + t(samLHS) + ', but the answer is marked “not factored completely.” Factor ' + t(samLHS) + ' completely.', target,
      [{ is: target.slice(1), code: 'u4x-gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(tx(target[0])) + ' is missing. Multiply your answer out to check.' }],
      sol, ['Checklist step 1: take out the GCF <b>first</b>. What do all the terms of ' + t(samLHS) + ' have in common?', 'Then factor what is left, and check that no bracket has a common factor.'], 'find the error: GCF first');
    var chk = part.check;
    part.check = function (resp) { var res = chk(resp); if (res.v === 'form' && res.code === 'gcf-inside') return wrong('u4x-not-complete', why.replace(t(sam), 'your answer') + ' That is ' + who + '’s mistake: take the common factor out in front.'); return res; };
    part.bad = part.bad.concat([sam]);
    void j;
    return part;
  }

  /* ======================= Lesson 9: solving equations by factoring ======================= */
  function l9q1(r) { // Ryan: x²+3x=10 · x²+2x=15
    var s = pickWhere(function () { return { r1: nz(r, 1, 9), r2: nz(r, 1, 9), opp: r.chance(0.75) }; }, function (s) { return s.r1 !== s.r2 && s.r1 + s.r2 !== 0 && (s.opp ? s.r1 * s.r2 < 0 : s.r1 * s.r2 > 0) && Math.abs(s.r1 * s.r2) <= 40; });
    var B = -(s.r1 + s.r2), C = -s.r1 * s.r2, lhs = triTex('x', B, 0), eq = lhs + '=' + C, sp = spec({ v: 'x', p: -Math.min(s.r1, s.r2), q: -Math.max(s.r1, s.r2) });
    var notZero = [C, C - B], rhsZero = [0, -B];
    var p = KP.valueSet('Solve by factoring: ' + t(eq) + '<br>Type both solutions, like ' + t('x=1,\\ x=2') + '.', [s.r1, s.r2], { v: 'x', diag: function (A) {
      if (sameSet(A, notZero) || (A.length === 1 && hasVal(notZero, A[0]))) return { code: 'u4x-not-zero', hint: 'The Zero Product Property only works when the product equals <b>0</b>. Move ' + t(C) + ' to the left side first: ' + t(tx(sp.full) + '=0') + '.' };
      if (sameSet(A, rhsZero)) return { code: 'u4x-rhs-zero', hint: 'The right side is ' + t(C) + ', not ' + t('0') + '. Rearrange first so one side is ' + t('0') + '.' };
      return null; } },
      'Rearrange so one side is ' + t('0') + ': ' + t(tx(sp.full) + '=0') + '.<br>Factor: ' + t(sp.key + '=0') + '.<br>Zero Product Property: ' + t('x' + sg(sp.p) + '=0') + ' or ' + t('x' + sg(sp.q) + '=0') + ', so ' + t('x=' + -sp.p) + ' or ' + t('x=' + -sp.q) + '.<br>Check: ' + t('(' + -sp.p + ')^{2}' + (B ? sg(B) + '(' + -sp.p + ')' : '') + '=' + C) + ' ✓',
      ['Move every term to one side so the equation equals ' + t('0') + ', then factor.', 'Set each factor equal to ' + t('0') + ' and solve.'], 'solve x² + bx = c');
    p.bad = ['x=' + C + ', x=' + (C - B), 'x=0, x=' + -B, 'x=' + -s.r1 + ', x=' + -s.r2, 'x=' + s.r1];
    return p;
  }
  function l9q2(r) { // Ryan: 2x²+5x−3=0 · 3x²+5x−2=0 (Mastery)
    var o = pickWhere(function () { var a = r.pick([2, 3]); return axSpec(a, nz(r, 1, 5), 1, nz(r, 1, 6), 'x'); }, function (o) { return gcd(o.p, Math.abs(o.q)) === 1 && o.b !== 0 && Math.abs(o.b) <= 15 && o.q !== o.p * o.s; });
    var a = o.p, m = -o.q, n = -o.s, eq = tx(o.full) + '=0', fr = ex.texRat(ex.norm(m, a));
    var p = KP.valueSet('Solve by factoring: ' + t(eq) + '<br>Type both solutions. Fractions are fine.', [[m, a], n], { v: 'x', diag: function (A) {
      if (hasVal(A, m) && hasVal(A, n)) return { code: 'u4x-no-divide', hint: 'From ' + t(tx(o.A) + '=0') + ': ' + t(a + 'x=' + m) + ', so divide by ' + t(a) + ': ' + t('x=' + fr) + '.' };
      if (hasVal(A, a / m) && hasVal(A, n)) return { code: 'u4x-div-flip', hint: 'From ' + t(a + 'x=' + m) + ', ' + t('x=' + m + '\\div ' + a) + ' — divide by the coefficient of ' + t('x') + '.' };
      if (hasVal(A, o.m) && hasVal(A, o.n) || hasVal(A, -o.m) && hasVal(A, -o.n)) return { code: 'u4x-split-roots', hint: 'Those are the numbers used to split the middle term. Finish factoring, then set each factor equal to ' + t('0') + '.' };
      return null; } },
      t('ac=' + a + '\\times ' + par(o.c) + '=' + o.ac) + ': ' + t(Math.min(o.m, o.n)) + ' and ' + t(Math.max(o.m, o.n)) + ' (product ' + t(o.ac) + ', sum ' + t(o.b) + ').<br>' + t(P.seq([T(o.a, 'x', 2), T(o.m, 'x', 1), T(o.n, 'x', 1), P.num(o.c)]) + '=' + grp(o) + '=' + br(o.A) + br(o.B) + '=0') + '<br>' + t(tx(o.A) + '=0') + ' gives ' + t('x=' + fr) + '; ' + t(tx(o.B) + '=0') + ' gives ' + t('x=' + n) + '.',
      ['Factor the left side by decomposition first: two integers with product ' + t('ac') + ' and sum ' + t('b') + '.', 'Set each factor equal to ' + t('0') + '. For ' + t(tx(o.A) + '=0') + ', divide by ' + t(a) + ' at the end.'], 'solve ax² + bx + c = 0');
    p.bad = ['x=' + m + ', x=' + n, 'x=' + a + '/' + m + ', x=' + n, 'x=' + o.m + ', x=' + o.n, 'x=' + (-m) + '/' + a + ', x=' + (-n)].filter(function (b) { return !/x=0\b/.test(b); });
    return p;
  }

  /* ======================= Lesson 10: unit review ======================= */
  function l10q1(r) { // Ryan: 4x³−4x²−24x · 3x³+3x²−36x
    var k = r.int(2, 5), pq = oppPair(r, 1, 6, 30), s = spec({ v: 'x', p: Math.min(pq.p, pq.q), q: Math.max(pq.p, pq.q), G: T(k, 'x', 1) });
    return monicPart('Factor completely: ' + t(tx(s.full)), s,
      [{ is: [P.num(k), s.A, s.B], code: 'u4x-gcf-part', hint: 'Every term also has an ' + t('x') + ': the GCF is ' + t(s.gtex) + '.' }], 'review: GCF with x, then x² + bx + c');
  }
  function l10q2(r) { return axPart('Factor by decomposition: ', axNeg(r), 'review: decomposition'); } // Ryan: 3x²−x−10 · 2x²+x−15
  function l10q3(r) { // Ryan: 3x²=12x · 2x²=10x
    var s = pickWhere(function () { return { a: r.int(2, 6), n: nz(r, 2, 9) }; }, function (s) { return Math.abs(s.a * s.n) <= 48 && Math.abs(s.n) !== s.a; });
    var eq = s.a + 'x^{2}=' + (s.a * s.n) + 'x', G = T(s.a, 'x', 1);
    var p = KP.valueSet('Solve by factoring: ' + t(eq) + '<br>Type every solution, like ' + t('x=1,\\ x=2') + '.', [0, s.n], { v: 'x', diag: function (A) {
      if (A.length === 1 && Math.abs(A[0] - s.n) < 1e-9) return { code: 'sol-missing', hint: 'Dividing both sides by ' + t('x') + ' loses a solution. Move everything to one side and factor: ' + t(tx(P.add(T(s.a, 'x', 2), T(-s.a * s.n, 'x', 1))) + '=0') + '.' };
      if (hasVal(A, s.a) || hasVal(A, -s.a)) return { code: 'u4x-coef-root', hint: 'The common factor ' + t(tx(G)) + ' gives ' + t(tx(G) + '=0') + ', so ' + t('x=0') + ' — the ' + t(s.a) + ' is not a solution.' };
      return null; } },
      'Move everything to one side: ' + t(tx(P.add(T(s.a, 'x', 2), T(-s.a * s.n, 'x', 1))) + '=0') + '.<br>GCF: ' + t(tx(G) + '(' + tx(lin(1, -s.n, 'x')) + ')=0') + '.<br>' + t(tx(G) + '=0') + ' gives ' + t('x=0') + '; ' + t(tx(lin(1, -s.n, 'x')) + '=0') + ' gives ' + t('x=' + s.n) + '.',
      ['Don’t divide by ' + t('x') + ' — move every term to one side so it equals ' + t('0') + '.', 'Take out the GCF and set each factor equal to ' + t('0') + '.'], 'solve ax² = bx');
    p.bad = ['x=' + s.n, 'x=0, x=' + -s.n, 'x=' + -s.a + ', x=' + s.n];
    return p;
  }
  function l10q4(r) { // added Mastery: 16x² = 49 (the review's Part F)
    var s = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (s) { return gcd(s.a, s.b) === 1; });
    var a = s.a, b = s.b, eq = a * a + 'x^{2}=' + b * b, fr = ex.texRat(ex.norm(b, a));
    var p = KP.valueSet('Solve by factoring: ' + t(eq) + '<br>Type every solution. Fractions are fine.', [[b, a], [-b, a]], { v: 'x', diag: function (A) {
      if (sameSet(A, [b * b / (a * a), -b * b / (a * a)])) return { code: 'u4x-no-sqrt', hint: 'Factor ' + t(a * a + 'x^{2}-' + b * b) + ' as a difference of squares: the brackets use the square <b>roots</b>, ' + t(a + 'x') + ' and ' + t(b) + '.' };
      if (sameSet(A, [a / b, -a / b])) return { code: 'u4x-div-flip', hint: 'From ' + t(a + 'x=' + b) + ', ' + t('x=' + b + '\\div ' + a) + ' — divide by the coefficient of ' + t('x') + '.' };
      if (sameSet(A, [b, -b])) return { code: 'u4x-no-divide', hint: 'From ' + t(a + 'x-' + b + '=0') + ': ' + t(a + 'x=' + b) + ', so divide by ' + t(a) + '.' };
      if (sameSet(A, [b / (a * a), -b / (a * a)])) return { code: 'u4x-no-root', hint: 'The square root of ' + t(a * a + 'x^{2}') + ' is ' + t(a + 'x') + ', so the brackets are ' + t('(' + a + 'x-' + b + ')(' + a + 'x+' + b + ')') + '.' };
      return null; } },
      'Rearrange: ' + t(a * a + 'x^{2}-' + b * b + '=0') + '. This is a difference of squares: ' + t('(' + a + 'x-' + b + ')(' + a + 'x+' + b + ')=0') + '.<br>' + t(a + 'x-' + b + '=0') + ' gives ' + t('x=' + fr) + '; ' + t(a + 'x+' + b + '=0') + ' gives ' + t('x=-' + fr) + '.',
      ['Move ' + t(b * b) + ' to the left side so the equation equals ' + t('0') + '. What kind of binomial is left?', 'Set each factor equal to ' + t('0') + ' and solve (divide by ' + t(a) + ').'], 'solve a²x² = b²');
    p.bad = ['x=' + b + '/' + a, 'x=' + b * b + '/' + a * a + ', x=-' + b * b + '/' + a * a, 'x=' + b + ', x=-' + b, 'x=' + a + '/' + b + ', x=-' + a + '/' + b];
    return p;
  }

  /* ======================= the exit slips ======================= */
  function Q(num, stem, level, make) { return { num: String(num), outcome: 'AN5', stem: stem, parts: [{ id: String(num), outcome: 'AN5', level: level, make: make }] }; }
  HW.defineExit({ lesson: 'u4l1', calc: false, outcome: 'AN5',
    blurb: 'The GCF of two monomials, an area model for removing the GCF, checking a factoring by expanding, and a GCF worked backwards.',
    questions: [Q(1, 'Greatest common factor.', 'BEG', l1q1), Q(2, 'An area model.', 'BEG', l1q2), Q(3, 'Check by expanding.', 'PRG', l1q3), Q(4, 'Working backwards.', 'MAS', l1q4)] });

  HW.defineExit({ lesson: 'u4l2', calc: false, outcome: 'AN5',
    blurb: 'Removing a GCF that includes a variable, a negative GCF with a leftover 1, and a negative GCF in two variables.',
    questions: [Q(1, 'Remove the GCF.', 'BEG', l2q1), Q(2, 'A negative GCF.', 'PRG', l2q2), Q(3, 'Two variables.', 'MAS', l2q3)] });

  HW.defineExit({ lesson: 'u4l3', calc: false, outcome: 'AN5',
    blurb: 'Factoring x² + bx + c with c positive, a GCF first, and every positive b that makes x² + bx + c factorable.',
    questions: [Q(1, 'Factor.', 'BEG', l3q1), Q(2, 'Common factor first.', 'PRG', l3q2), Q(3, 'Every value of b.', 'MAS', l3q3)] });

  HW.defineExit({ lesson: 'u4l4', calc: false, outcome: 'AN5',
    blurb: 'Factoring x² + bx + c with c negative, a GCF first, and recognizing a prime trinomial.',
    questions: [Q(1, 'Factor.', 'BEG', l4q1), Q(2, 'Factor completely.', 'PRG', l4q2), Q(3, 'Prime trinomials.', 'MAS', l4q3)] });

  HW.defineExit({ lesson: 'u4l5', calc: false, outcome: 'AN5',
    blurb: 'Differences of squares, a GCF first, recognizing a sum of squares, and a GCF before a²x² − b².',
    questions: [Q(1, 'Factor.', 'BEG', l5q1), Q(2, 'Factor completely.', 'PRG', l5q2), Q(3, 'Difference of squares?', 'PRG', l5q3), Q(4, 'Factor completely.', 'MAS', l5q4)] });

  HW.defineExit({ lesson: 'u4l6', calc: false, outcome: 'AN5',
    blurb: 'The three-part test, factoring a perfect square trinomial, and the missing middle coefficient.',
    questions: [Q(1, 'The three-part test.', 'BEG', l6q1), Q(2, 'Factor.', 'PRG', l6q2), Q(3, 'The missing coefficient.', 'MAS', l6q3)] });

  HW.defineExit({ lesson: 'u4l7', calc: false, outcome: 'AN5',
    blurb: 'Decomposition with positive coefficients and with c negative, and a GCF before decomposition.',
    questions: [Q(1, 'Decomposition.', 'PRG', l7q1), Q(2, 'Decomposition.', 'PRG', l7q2), Q(3, 'Factor completely.', 'MAS', l7q3)] });

  HW.defineExit({ lesson: 'u4l8', calc: false, outcome: 'AN5',
    blurb: 'Choosing the methods in order, a GCF then a perfect square, a GCF with x then a difference of squares, and an answer not factored completely.',
    questions: [Q(1, 'Choose the methods.', 'BEG', l8q1), Q(2, 'Factor completely.', 'PRG', l8q2), Q(3, 'Factor completely.', 'PRG', l8q3), Q(4, 'Find the error.', 'MAS', l8q4)] });

  HW.defineExit({ lesson: 'u4l9', calc: false, outcome: 'AN5',
    blurb: 'Solving x² + bx = c by rearranging and factoring, and solving ax² + bx + c = 0 by decomposition.',
    questions: [Q(1, 'Solve.', 'PRG', l9q1), Q(2, 'Solve.', 'MAS', l9q2)] });

  HW.defineExit({ lesson: 'u4l10', calc: false, outcome: 'AN5',
    blurb: 'Unit review: a GCF with x then a trinomial, decomposition, solving ax² = bx, and solving a²x² = b².',
    questions: [Q(1, 'Factor completely.', 'PRG', l10q1), Q(2, 'Factor by decomposition.', 'PRG', l10q2), Q(3, 'Solve.', 'PRG', l10q3), Q(4, 'Solve.', 'MAS', l10q4)] });
})(window);
