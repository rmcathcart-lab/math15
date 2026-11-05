/* Math 15 · Unit 3 · Lesson 7 — Unit Review: Polynomial Operations (AN4)
 * Assignment 7 (u3_L07.tex, questions 1–22: Parts A–F by skill, Part G numerical and written response) and the
 * Lesson 7 Extra Practice (u3_EP07.tex, questions 1–23). Modelled on Math 10C u3l6 (the review twin), with the expansion
 * builders and wrong-answer diagnoses of 10C u3l1–u3l5 (Math 15 pitch: small whole-number coefficients, no calculator).
 * Every part is a generator: it keeps the booklet question's structure (signs, which bracket carries the coefficient,
 * which product is subtracted, the booklet's term order) and the booklet's own numbers are among the possible values.
 * Expressions are built from "pieces" (monomial × bracket, FOIL, square, sum × difference, binomial × trinomial, a plain
 * bracket); combo() adds them with their signs, computes the key with HW.poly and turns each piece's classic wrong
 * values (first term only, no middle term, middle term not doubled, only First and Last, …) and the subtraction slips
 * (only the first sign changed, product added) into diagnosed wrong answers for K.poly.
 * Written-response and "explain" items are multiple choice whose options are reasons, fields (values, dimensions,
 * a and b) or an example built in boxes; "verify by substituting" asks for the value(s).
 * Levels (Math 15): BEG one skill as first taught; EMG negatives, coefficients, a bracket subtracted, a pattern by name;
 * PRG two or three skills in one expression, set up from words; ADV three factors with a twist, solving after
 * expanding, working backwards to a factor; MAS working backwards to both factors (extra 15a) and the hidden
 * difference of squares (extra 23a). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, Y = HW.poly, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* codes from Math 10C Unit 3 (same meanings; registered here only when Math 15 has no label for them yet) */
  HW.addCodes({
    'one-middle': 'FOIL: one of the two middle products missing', 'last-sign': 'Wrong sign on the product of the last terms',
    'neg-first': 'Negative monomial: sign applied to the first term only', 'var-first': 'Variable of the monomial only on the first term',
    'sq-not-doubled': 'Middle term of a square not doubled', 'sq-middle-sign': 'Wrong sign on the middle term of a square', 'sq-as-sd': 'Treated a square as sum × difference',
    'coef-not-squared': 'Coefficient not squared', 'sd-middle': 'Stray middle term in sum × difference', 'sd-plus': 'Sum × difference gave a² + b²', 'sd-as-square': 'Treated sum × difference as a square',
    'k-in-square': 'Number in front put inside the square', 'k-first': 'Number in front multiplied into only one term', 'k-forgot': 'Forgot the number in front', 'k-both': 'Number in front multiplied into both brackets',
    'sub-first': 'Subtracted a bracket but changed only its first sign', 'minus-ignored': 'Added a product that is subtracted', 'no-change': 'Added instead of subtracting (no signs changed)',
    'foil-only': 'Only 4 partial products (FOIL) — missed the trinomial’s middle term', 'second-partial': 'Second term of the binomial multiplied by only part of the trinomial',
    'q-not-mult': 'Second term not multiplied through the trinomial', 'unlike-combined': 'Combined unlike terms', 'cube-each': 'Cubed each term: (a+b)³ = a³+b³',
    'two-dims': 'Multiplied only two of the three dimensions', 'face-area': 'Gave the area of one face, not the volume', 'box-dims': 'Box dimensions L − x instead of L − 2x',
    'no-height': 'Forgot the height of the box', 'only-a': 'Gave a (or b) instead of a + b', 'whole-only': 'Used the whole rectangle (no piece removed)',
    'not-subtracted': 'Didn’t subtract the missing piece', 'no-group-middle': 'Squared the grouped binomial without its middle term', 'not-sq': 'Did not square (or take the square root)',
    'gave-a': 'Gave a instead of b', 'dims-perim': 'Gave half the perimeter (one length + one width)'
  });
  /* this lesson's own codes */
  HW.addCodes({
    'u3l7-add-exp': 'Added the exponents when collecting like terms', 'u3l7-sub-val': 'Check by substitution: the value of a wrong expansion',
    'u3l7-path-one': 'Path: added its width to one side only', 'u3l7-path-total': 'Path: gave the total area (garden not subtracted)',
    'u3l7-pair-sign': 'Missing numbers: both signs switched', 'u3l7-pair-product': 'Missing numbers: product right, sum wrong', 'u3l7-ex-degree': 'Example: a binomial that isn’t degree 1',
    'u3l7-ex-sum': 'Example: the sum still has degree 1', 'u3l7-ex-zero': 'Example: the sum is 0 (no degree)', 'u3l7-ab-pick': 'Mental product: a and b not the middle and the gap',
    'u3l7-solve-sign': 'Solving: sign slip in the last step', 'u3l7-diff-sign': 'Difference of two areas: subtracted the wrong way'
  });
  HW.addPartial({
    'sq-as-sd': 'b', 'sd-as-square': 'b', 'unlike-combined': 'b', 'cube-each': 'b', 'face-area': 'b', 'no-group-middle': 's', 'not-sq': 's', 'gave-a': 's',
    'u3l7-add-exp': 'b', 'u3l7-sub-val': 'b', 'u3l7-path-one': 's', 'u3l7-path-total': 's', 'u3l7-pair-sign': 's', 'u3l7-pair-product': 'b',
    'u3l7-ex-degree': 'b', 'u3l7-ex-sum': 'n', 'u3l7-ex-zero': 's', 'u3l7-ab-pick': 'b', 'u3l7-solve-sign': 's', 'u3l7-diff-sign': 's'
  });

  /* ---------------- polynomial helpers ---------------- */
  function M(c, v, e) { var o = {}; if (v) o[v] = e == null ? 1 : e; return Y.mono(c, o); } // c·v^e
  function MV(c, vs) { return Y.mono(c, vs); }                                              // c·x^a·y^b
  function N(c) { return Y.num(c); }
  function S(list) { return Y.add.apply(null, list); }
  function lin(a, b, v) { return Y.add(M(a, v || 'x'), N(b)); }
  function tx(p, o) { return Y.tex(p, o); }
  function seq(list) { return Y.seq(list); }
  function br(list) { return (list.length > 2 ? '\\left(' : '(') + seq(list) + (list.length > 2 ? '\\right)' : ')'); }
  function termsOf(p) { return Y.sorted(p).map(function (q) { return Y.mono(q.c, q.v); }); }
  function firstTerm(p) { var ts = Y.sorted(p); return Y.mono(ts[0].c, ts[0].v); }
  function cf(m) { var ts = Y.terms(m); return ts.length ? ts[0].c[0] / ts[0].c[1] : 0; }
  function co(p, v, e) { var o = {}; if (e) o[v || 'x'] = e; var c = Y.coef(p, o); return c[0] / c[1]; }
  function pf(p) { var s = tx(p); return Y.count(p) > 1 || s.charAt(0) === '-' ? '(' + s + ')' : s; }  // a factor in a product line
  function pfs(p) { var s = tx(p); return /^([a-z]|\d+)$/.test(s) ? s : '(' + s + ')'; }               // a base under a square
  function dot(a, b) { return pf(a) + pf(b); }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function sgn(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var q = a % b; a = b; b = q; } return a; }
  function nz(r, a, b) { var v = 0; while (v === 0) v = r.int(a, b); return v; }
  function pickWhere(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u3l7: pickWhere failed'); }
  function sqv(m) { var tt = Y.terms(m)[0], v = {}; Object.keys(tt.v).forEach(function (k) { v[k] = 2 * tt.v[k]; }); return Y.mono([Math.abs(tt.c[0]), tt.c[1]], v); } // coefficient kept, letters squared
  function at(p, x) { return Y.at(p, { x: x }); }
  function numDiag(list) { return function (x) { for (var i = 0; i < list.length; i++) if (list[i][0] === x) return { code: list[i][1], hint: list[i][2] }; return null; }; }
  function numDiagClean(ans, list) { return numDiag(list.filter(function (d) { return d[0] !== ans && isFinite(d[0]); })); }
  function o2(v, e) { var o = {}; o[v] = e; return o; }
  function o11(u, w) { var o = {}; o[u] = 1; o[w] = 1; return o; }
  var F = HW.fmt;
  var LETTERS2 = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['c', 'd'], ['s', 't'], ['u', 'v'], ['h', 'k'], ['r', 's'], ['x', 'z'], ['a', 'c'], ['w', 'z']];
  var LETTERS1 = ['x', 'x', 'x', 'a', 'm', 'n', 'y', 't'];

  /* like terms, one group per line, as in the booklet's worked solutions */
  function groupsTex(list) {
    var by = {}, vs = {}, keys = [];
    list.forEach(function (p) { Y.terms(p).forEach(function (q) { if (!by[q.key]) { by[q.key] = []; vs[q.key] = q.v; keys.push(q.key); } by[q.key].push(q.c[0] / q.c[1]); }); });
    var dummy = {}; keys.forEach(function (k) { dummy[k] = { c: [1, 1], v: vs[k] }; });
    return Y.sorted(dummy).map(function (d) {
      var k = d.key, cs = by[k], s = cs.reduce(function (a, c) { return a + c; }, 0), lab = k ? Y.monoTex(vs[k]) : '\\text{numbers}';
      var body = cs.map(function (c, i) { return i && c >= 0 ? '+' + c : String(c); }).join('');
      return t(lab + ':\\ ' + (cs.length > 1 ? body + '=' + s : body));
    }).join(';&nbsp; ');
  }

  /* ---------------- pieces: one product (or bracket) of an expression ----------------
   * { tex, val (its value, sign not included), wr: [{ p: a wrong value of val, code, hint }], sol (HTML) } */
  function pMono(m, terms) {
    var val = Y.mul(m, S(terms)), prods = terms.map(function (q) { return Y.mul(m, q); }), c = cf(m), wr = [], mt = tx(m);
    var mtex = mt === '1' ? '' : mt === '-1' ? '-' : mt;
    if (terms.length > 1) {
      wr.push({ p: S([prods[0]].concat(terms.slice(1))), code: 'first-only', hint: 'Multiply <b>every</b> term in the bracket by ' + t(mt) + ', not just the first one.' });
      if (c < 0) wr.push({ p: S([prods[0]].concat(terms.slice(1).map(function (q) { return Y.mul(Y.neg(m), q); }))), code: 'neg-first', hint: 'The negative sign belongs to ' + t(mt) + ', so it multiplies <b>every</b> term in the bracket — a negative times a negative is positive.' });
      if (Y.vars(m).length) wr.push({ p: S([prods[0]].concat(terms.slice(1).map(function (q) { return Y.mul(N(c), q); }))), code: 'var-first', hint: 'The variable in ' + t(mt) + ' multiplies every term in the bracket too, not just the first one.' });
    }
    var l1 = terms.map(function (q, i) { var s = pf(m) + pf(q); return i ? '+' + s : s; }).join(''), l2 = seq(prods);
    return { tex: mtex + br(terms), val: val, wr: wr, sol: t(mtex + br(terms) + '=' + l1 + '=' + l2 + (l2 !== tx(val) ? '=' + tx(val) : '')) };
  }
  function foilOf(A, B, C, D) { var f = { F: Y.mul(A, C), O: Y.mul(A, D), I: Y.mul(B, C), L: Y.mul(B, D) }; f.res = S([f.F, f.O, f.I, f.L]); return f; }
  function pFoil(A, B, C, D) {
    var f = foilOf(A, B, C, D), tex = br([A, B]) + br([C, D]), bothNeg = cf(B) < 0 && cf(D) < 0;
    var wr = [
      { p: S([f.F, f.L]), code: 'fl-only', hint: 'You multiplied only the <b>First</b> terms and the <b>Last</b> terms. Two binomials give <b>four</b> products — the Outer and Inner products make the middle term.' },
      { p: S([f.F, f.O, f.L]), code: 'one-middle', hint: 'You have only one of the two middle products. Find both the Outer product ' + t(dot(A, D)) + ' and the Inner product ' + t(dot(B, C)) + '.' },
      { p: S([f.F, f.I, f.L]), code: 'one-middle', hint: 'You have only one of the two middle products. Find both the Outer product ' + t(dot(A, D)) + ' and the Inner product ' + t(dot(B, C)) + '.' },
      { p: S([f.F, f.O, f.I, Y.neg(f.L)]), code: 'last-sign', hint: 'Check the sign of the last term: ' + t(dot(B, D)) + '.' + (bothNeg ? ' A negative times a negative is <b>positive</b>.' : '') }];
    var s4 = seq([f.F, f.O, f.I, f.L]);
    return { tex: tex, val: f.res, wr: wr, sol: 'F: ' + t(dot(A, C) + '=' + tx(f.F)) + ', &nbsp;O: ' + t(dot(A, D) + '=' + tx(f.O)) + ', &nbsp;I: ' + t(dot(B, C) + '=' + tx(f.I)) + ', &nbsp;L: ' + t(dot(B, D) + '=' + tx(f.L)) + '<br>' + t(tex + '=' + s4 + (s4 !== tx(f.res) ? '=' + tx(f.res) : '')) };
  }
  /* k(A + B)² */
  function pSq(A, B, k) {
    k = k || 1;
    var A2 = Y.pow(A, 2), B2 = Y.pow(B, 2), AB = Y.mul(A, B), inner = S([A2, Y.scale(AB, 2), B2]), val = Y.scale(inner, k), wr = [];
    var sqT = br([A, B]) + '^{2}', tex = (k === 1 ? '' : k) + sqT, SQ = t('(a\\pm b)^{2}=a^{2}\\pm 2ab+b^{2}');
    function add(p, code, hint) { wr.push({ p: Y.scale(p, k), code: code, hint: hint }); }
    add(S([A2, B2]), 'sq-no-middle', 'Squaring a binomial always gives a <b>middle term</b>: ' + t(sqT) + ' means ' + t(br([A, B]) + br([A, B])) + '. Use ' + SQ + '.');
    add(S([A2, AB, B2]), 'sq-not-doubled', 'Check the middle term: it is <b>twice</b> the product of the two terms, ' + t('2ab') + ' — the Outer and Inner products are equal, and you need both.');
    add(S([A2, Y.scale(AB, -2), B2]), 'sq-middle-sign', 'Check the <b>sign of the middle term</b>: ' + t('2ab') + ' with the signs as written — ' + (cf(AB) < 0 ? 'one term is negative, so the middle term is negative.' : 'both terms are positive, so the middle term is positive.'));
    add(Y.sub(A2, B2), 'sq-as-sd', t(sqT) + ' is a <b>square</b> — the same binomial times itself — not a sum times a difference. It has a middle term.');
    if (Math.abs(cf(A)) !== 1) add(S([sqv(A), Y.scale(AB, 2), B2]), 'coef-not-squared', 'Square the <b>whole</b> first term, coefficient and all: ' + t(pfs(A) + '^{2}=' + tx(A2)) + '.');
    if (Math.abs(cf(B)) !== 1 && Y.vars(B).length) add(S([A2, Y.scale(AB, 2), sqv(B)]), 'coef-not-squared', 'Square the <b>whole</b> second term, coefficient and all: ' + t(pfs(B) + '^{2}=' + tx(B2)) + '.');
    if (k !== 1) {
      wr.push({ p: Y.scale(inner, k * k), code: 'k-in-square', hint: 'Square the bracket <b>first</b>, then multiply by ' + t(k) + '. Putting the ' + t(k) + ' inside the bracket before squaring multiplies by ' + t(k + '^{2}=' + k * k) + ' instead.' });
      wr.push({ p: S([Y.scale(A2, k), Y.scale(AB, 2), B2]), code: 'k-first', hint: 'Multiply <b>every</b> term of ' + t(tx(inner)) + ' by ' + t(k) + ', not just the first one.' });
      wr.push({ p: inner, code: 'k-forgot', hint: 'Don’t forget the ' + t(k) + ' in front: expand the square, then multiply every term by ' + t(k) + '.' });
    }
    var line = t(sqT + '=' + pfs(A) + '^{2}+2' + dot(A, B) + '+' + pfs(B) + '^{2}=' + tx(inner));
    if (k !== 1) line += '<br>' + t(k + '\\left(' + tx(inner) + '\\right)=' + tx(val));
    return { tex: tex, val: val, wr: wr, sol: line, inner: inner };
  }
  /* k(A + B)(A − B), written in the order given by `swap` */
  function pSd(A, B, k, swap) {
    k = k || 1;
    var A2 = Y.pow(A, 2), B2 = Y.pow(B, 2), AB = Y.mul(A, B), inner = Y.sub(A2, B2), val = Y.scale(inner, k), wr = [];
    var p1 = br([A, B]), p2 = br([A, Y.neg(B)]), sdT = swap ? p2 + p1 : p1 + p2, tex = (k === 1 ? '' : k) + sdT, SD = t('(a+b)(a-b)=a^{2}-b^{2}');
    function add(p, code, hint) { wr.push({ p: Y.scale(p, k), code: code, hint: hint }); }
    add(S([A2, B2]), 'sd-plus', t(sdT) + ' is a sum times a difference, so the answer is a <b>difference</b> of squares: the last terms have opposite signs, so their product is negative. ' + SD + '.');
    add(S([A2, Y.scale(AB, 2), Y.neg(B2)]), 'sd-middle', 'In ' + t(sdT) + ' the Outer and Inner products are opposites, so they <b>cancel</b>: there is no middle term. ' + SD + '.');
    add(S([A2, Y.scale(AB, -2), Y.neg(B2)]), 'sd-middle', 'In ' + t(sdT) + ' the Outer and Inner products are opposites, so they <b>cancel</b>: there is no middle term. ' + SD + '.');
    add(S([A2, Y.scale(AB, 2), B2]), 'sd-as-square', 'The two brackets are not the same: one has ' + t('+') + ', the other ' + t('-') + '. That is a sum times a difference, ' + SD + ' — no middle term.');
    if (Math.abs(cf(A)) !== 1) add(Y.sub(sqv(A), B2), 'coef-not-squared', 'Square the <b>whole</b> first term, coefficient and all: ' + t(pfs(A) + '^{2}=' + tx(A2)) + '.');
    if (Math.abs(cf(B)) !== 1 && Y.vars(B).length) add(Y.sub(A2, sqv(B)), 'coef-not-squared', 'Square the <b>whole</b> second term, coefficient and all: ' + t(pfs(B) + '^{2}=' + tx(B2)) + '.');
    if (k !== 1) {
      wr.push({ p: Y.scale(inner, k * k), code: 'k-both', hint: 'The ' + t(k) + ' multiplies the product <b>once</b>. Multiplying it into both brackets multiplies by ' + t(k * k) + '.' });
      wr.push({ p: inner, code: 'k-forgot', hint: 'Don’t forget the ' + t(k) + ' in front: multiply every term of ' + t(tx(inner)) + ' by it.' });
      wr.push({ p: S([Y.scale(A2, k), Y.neg(B2)]), code: 'k-first', hint: 'Multiply <b>every</b> term of ' + t(tx(inner)) + ' by ' + t(k) + ', not just the first one.' });
    }
    var Bp = cf(B) < 0 ? Y.neg(B) : B, line = t(sdT + '=' + pfs(A) + '^{2}-' + pfs(Bp) + '^{2}=' + tx(inner));
    if (k !== 1) line += '<br>' + t(k + '\\left(' + tx(inner) + '\\right)=' + tx(val));
    return { tex: tex, val: val, wr: wr, sol: line, inner: inner };
  }
  /* (b0 + b1)(t0 + t1 + t2) */
  function pBT(Bn, Tr) {
    var val = Y.mul(S(Bn), S(Tr)), r0 = Tr.map(function (q) { return Y.mul(Bn[0], q); }), r1 = Tr.map(function (q) { return Y.mul(Bn[1], q); }), T = S(Tr), wr = [];
    wr.push({ p: S([r0[0], r1[2]]), code: 'fl-only', hint: 'Each term of the binomial multiplies <b>every</b> term of the trinomial — six products in all, not just first × first and last × last.' });
    wr.push({ p: S([r0[0], r0[2], r1[0], r1[2]]), code: 'foil-only', hint: 'A trinomial has <b>three</b> terms, so there are six products. You left out the products with the middle term ' + t(tx(Tr[1])) + '.' });
    wr.push({ p: S([Y.mul(Bn[0], T), Bn[1]]), code: 'q-not-mult', hint: 'The ' + t(tx(Bn[1])) + ' must multiply each term of the trinomial too: ' + t(pf(Bn[1]) + br(Tr)) + '.' });
    wr.push({ p: S([Y.mul(Bn[0], T), r1[0]]), code: 'second-partial', hint: 'Multiply ' + t(tx(Bn[1])) + ' by <b>all three</b> terms of the trinomial, not just the first.' });
    wr.push({ p: S([Y.mul(Bn[0], T), Y.neg(Y.mul(Bn[1], T))]), code: 'sign', hint: 'Watch the signs when you multiply by ' + t(tx(Bn[1])) + ': ' + t(pf(Bn[1]) + br(Tr) + '=' + seq(r1)) + '.' });
    var tex = br(Bn) + br(Tr), l1 = tx(Bn[0]) + br(Tr) + (cf(Bn[1]) < 0 ? '' : '+') + tx(Bn[1]) + br(Tr), l2 = seq(r0.concat(r1));
    return { tex: tex, val: val, wr: wr, sol: t(tex + '=' + l1) + '<br>' + t('=' + l2) + '<br>Collect like terms: ' + t('=' + tx(val)) };
  }
  /* a plain bracket (added or subtracted as it is) */
  function pBr(terms) { return { tex: br(terms), val: S(terms), wr: [], sol: '' }; }

  /* add pieces with their signs: list = [{ s: +1|-1, p: piece }] */
  function combo(list) {
    var T = N(0), tex = '';
    list.forEach(function (it, i) { T = Y.add(T, Y.scale(it.p.val, it.s)); tex += (it.s < 0 ? '-' : i && it.p.tex.charAt(0) !== '-' ? '+' : '') + it.p.tex; });
    var W = [];
    list.forEach(function (it) {
      it.p.wr.forEach(function (w) { W.push({ is: Y.add(T, Y.scale(Y.sub(w.p, it.p.val), it.s)), code: w.code, hint: w.hint }); });
      if (it.s < 0 && Y.count(it.p.val) > 1) {
        var rest = Y.sub(it.p.val, firstTerm(it.p.val));
        W.push({ is: Y.add(T, Y.scale(rest, 2)), code: 'sub-first', hint: 'A minus sign in front of ' + t(it.p.tex) + ' changes the sign of <b>every</b> term of its expansion: ' + t('-\\left(' + tx(it.p.val) + '\\right)=' + tx(Y.neg(it.p.val))) + '.' });
        W.push({ is: Y.add(T, Y.scale(it.p.val, 2)), code: 'minus-ignored', hint: t(it.p.tex) + ' is <b>subtracted</b>: put its expansion in brackets and change the sign of every term.' });
      }
    });
    var sol;
    if (list.length === 1 && list[0].s > 0) sol = list[0].p.sol;
    else {
      var lines = list.filter(function (it) { return it.p.sol; }).map(function (it) { return it.p.sol; });
      var together = list.map(function (it, i) { var v = tx(it.p.val), one = Y.count(it.p.val) === 1 && v.charAt(0) !== '-'; return (it.s < 0 ? '-' : i ? '+' : '') + (one && it.s > 0 ? v : '\\left(' + v + '\\right)'); }).join('');
      var flat = []; list.forEach(function (it) { flat = flat.concat(termsOf(Y.scale(it.p.val, it.s))); });
      var anySub = list.some(function (it) { return it.s < 0 && Y.count(it.p.val) > 1; });
      sol = (lines.length ? 'Expand each product:<br>' + lines.join('<br>') + '<br>Put the pieces together: ' + t(tex + '=' + together) : t(tex)) +
        (anySub ? '<br>Change the sign of <b>every</b> term in a subtracted bracket: ' : '<br>Remove the brackets: ') + t('=' + seq(flat)) +
        '<br>Collect like terms: ' + groupsTex(flat) + '<br>' + t('=' + tx(T));
    }
    return { tex: tex, T: T, wr: W, sol: sol };
  }
  var HCOMBO = ['Expand each product on its own and keep each result in brackets. Then collect like terms.', 'A minus sign in front of a product changes the sign of <b>every</b> term of its expansion.'];

  /* a polynomial-answer part: classic wrong answers that print the same as the key (or each other) are dropped */
  function pp(prompt, target, wrs, sol, hints, text, opt) {
    opt = opt || {};
    var seen = [target], W = [];
    (wrs || []).forEach(function (w) { if (!w || !w.is) return; var p = Y.lift(w.is); if (seen.some(function (s) { return Y.eq(s, p); })) return; seen.push(p); W.push({ is: p, code: w.code, hint: w.hint }); });
    var part = KP.poly(prompt, target, Object.assign({}, opt, { wrong: W }), sol, hints, text);
    part.bad = W.map(function (w) { return tx(w.is); });
    if (Y.count(target) > 1 && !opt.order) part.good = [tx(target, { order: 'asc' })];
    return part;
  }
  function comboPart(prompt, list, hints, text, opt) { var c = combo(list); return pp(prompt + t(c.tex), c.T, c.wr.concat((opt && opt.wrong) || []), c.sol, hints || HCOMBO, text || 'expand ' + c.tex, opt); }
  function polyChk(target, wrs) {
    var seen = [Y.lift(target)], W = [];
    (wrs || []).forEach(function (w) { if (!w || !w.is) return; var p = Y.lift(w.is); if (seen.some(function (s) { return Y.eq(s, p); })) return; seen.push(p); W.push({ is: p, code: w.code, hint: w.hint }); });
    return K.poly(target, { wrong: W });
  }
  function pbox(label, vars, extra) { return Object.assign({ label: label, name: label.replace(/<[^>]*>|\\\(|\\\)/g, ''), mode: 'math', keys: 'poly', vars: vars || ['x'] }, extra || {}); }
  function nbox(label, extra) { return Object.assign({ label: label, name: label.replace(/<[^>]*>|\\\(|\\\)/g, '') }, extra || {}); }
  function readPoly(resp) {
    var a = K.read(resp); if (a.res) return { res: a.res };
    var rr = Y.read(a.ast);
    if (!rr.ok) return { res: wrong(rr.why === 'not-poly' ? 'not-poly' : 'value', rr.why === 'not-poly' ? 'That isn’t a polynomial. Check your work.' : null) };
    return { p: rr.p, ast: a.ast, fi: Y.formIssue(a.ast) };
  }
  function lab(res, label) { return res.hint && label ? { v: res.v, code: res.code, hint: '<b>' + label + ':</b> ' + res.hint } : res; }
  /* two boxes holding f1 and f2 in either order */
  function pairCheck(f1, f2, labels, diag) {
    return function (resp) {
      resp = resp || [];
      var a = readPoly(resp[0] == null ? '' : resp[0]); if (a.res) return lab(a.res, labels[0]);
      var b = readPoly(resp[1] == null ? '' : resp[1]); if (b.res) return lab(b.res, labels[1]);
      if ((Y.eq(a.p, f1) && Y.eq(b.p, f2)) || (Y.eq(a.p, f2) && Y.eq(b.p, f1))) {
        if (a.fi) return lab(form(a.fi.code, a.fi.msg || 'Simplify it fully.'), labels[0]);
        if (b.fi) return lab(form(b.fi.code, b.fi.msg || 'Simplify it fully.'), labels[1]);
        return ok();
      }
      var h = diag ? diag(a.p, b.p) : null;
      return h ? wrong(h.code, h.hint) : wrong('value', null);
    };
  }
  /* the missing factor S in given × S = target (want = the true S) — 10C factorCheck */
  function factorCheck(given, want, target) {
    return function (resp) {
      var a = readPoly(resp); if (a.res) return a.res;
      var Sx = a.p;
      if (Y.eq(Y.mul(given, Sx), target)) { if (a.fi) return form(a.fi.code, a.fi.msg || 'Simplify it fully.'); return ok(); }
      if (Y.eq(Sx, Y.neg(want))) return wrong('sign-all', 'Every sign is the opposite of what it should be. Divide the first terms (and the constants) with their signs.');
      if (Y.degree(Sx) !== Y.degree(want) || co(Sx, 'x', 1) !== co(want, 'x', 1)) return wrong('factor-degree', 'Check the first term: it must multiply ' + t(tx(firstTerm(given))) + ' to give ' + t(tx(firstTerm(target))) + '.');
      if (co(Sx, 'x', 0) !== co(want, 'x', 0)) return wrong('factor-const', 'Check the constant term: it must multiply ' + t(co(given, 'x', 0)) + ' to give ' + t(co(target, 'x', 0)) + '.');
      return wrong('factor-middle', 'Expand ' + t(pf(given) + '\\left(' + tx(Sx) + '\\right)') + ' and compare it with ' + t(tx(target)) + '.');
    };
  }
  function mc(r, prompt, opts, sol, hints, text, keep) { return KP.mc(r, prompt, opts, sol, hints, text, keep); }
  function valuesTex(p, v) { // the terms of p with x replaced by (v)
    return Y.sorted(p).map(function (T1, i) { var e = T1.v.x || 0, c = T1.c[0]; return (c < 0 ? '-' : i ? '+' : '') + (e && Math.abs(c) === 1 ? '' : Math.abs(c)) + (e ? par(v) + (e > 1 ? '^{' + e + '}' : '') : ''); }).join('');
  }

  /* ---------------- figures (canvas kit of 10C u3l5) ---------------- */
  var INK = '#1c2230', SH = '#d3d8df', SH2 = '#e9ecf0', GR = '#8a93a3';
  function f1(n) { return Math.round(n * 10) / 10; }
  function ptsStr(arr) { return arr.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' '); }
  function svgLab(s) {
    var out = '';
    String(s).split(/(\\text\{[^}]*\})/).forEach(function (seg) {
      var m = /^\\text\{([^}]*)\}$/.exec(seg);
      if (m) { out += HW.esc(m[1]); return; }
      seg = seg.replace(/\\left|\\right/g, '').replace(/\\,/g, '').replace(/\\ /g, ' ');
      for (var i = 0; i < seg.length; i++) {
        var c = seg[i];
        if (c === '^') { var mm = /^\^\{([^}]*)\}/.exec(seg.slice(i)) || /^\^(.)/.exec(seg.slice(i)); out += '<tspan dy="-6" font-size="11">' + HW.esc(mm[1]) + '</tspan><tspan dy="6"> </tspan>'; i += mm[0].length - 1; continue; }
        if (/[a-z]/i.test(c)) { out += '<tspan font-style="italic">' + c + '</tspan>'; continue; }
        if ((c === '-' || c === '+') && i > 0 && seg[i - 1] !== '(') { out += ' ' + (c === '-' ? '−' : '+') + ' '; continue; }
        if (c === '-') { out += '−'; continue; }
        out += HW.esc(c);
      }
    });
    return out;
  }
  function textEl(x, y, s, o) {
    o = o || {};
    var px = o.rot ? x + 5 : x, py = o.rot ? y : y + 5;
    return '<text x="' + f1(px) + '" y="' + f1(py) + '" text-anchor="' + (o.anchor || 'middle') + '"' + (o.rot ? ' transform="rotate(-90 ' + f1(px) + ' ' + f1(py) + ')"' : '') + (o.size ? ' font-size="' + o.size + '"' : '') + '>' + svgLab(s) + '</text>';
  }
  function lineEl(x1, y1, x2, y2, o) { o = o || {}; return '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" stroke="' + (o.stroke || INK) + '" stroke-width="' + (o.w || 1.3) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>'; }
  function arrowEl(x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L, h = 6, w = 3;
    function head(x, y, sx, sy) { return '<polygon points="' + ptsStr([[x, y], [x - sx * h - sy * w, y - sy * h + sx * w], [x - sx * h + sy * w, y - sy * h - sx * w]]) + '" fill="' + INK + '"/>'; }
    return lineEl(x1, y1, x2, y2, { w: 1.1 }) + head(x2, y2, ux, uy) + head(x1, y1, -ux, -uy);
  }
  function canvas(Wu, Hu, o) {
    o = o || {};
    var pw = o.pw || 230, ph = o.ph || 165, m = o.m || [28, 34, 30, 34], s = Math.min(pw / Wu, ph / Hu), parts = [], c = { s: s, m: m };
    c.X = function (x) { return m[3] + x * s; };
    c.Y = function (y) { return m[0] + (Hu - y) * s; };
    c.w = m[3] + Wu * s + m[1]; c.h = m[0] + Hu * s + m[2];
    c.add = function (str) { parts.push(str); return c; };
    c.poly = function (pts, fill, o2) { o2 = o2 || {}; return c.add('<polygon points="' + ptsStr(pts.map(function (p) { return [c.X(p[0]), c.Y(p[1])]; })) + '" fill="' + (fill || 'none') + '" stroke="' + (o2.stroke || INK) + '" stroke-width="' + (o2.w || 2) + '"' + (o2.dash ? ' stroke-dasharray="' + o2.dash + '"' : '') + ' stroke-linejoin="round"/>'); };
    c.rect = function (x, y, w, h, fill, o2) { return c.poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], fill, o2); };
    c.line = function (x1, y1, x2, y2, o2) { return c.add(lineEl(c.X(x1), c.Y(y1), c.X(x2), c.Y(y2), o2)); };
    c.dash = function (x1, y1, x2, y2) { return c.line(x1, y1, x2, y2, { stroke: GR, dash: '5 4', w: 1.4 }); };
    c.text = function (x, y, str, o2) { return c.add(textEl(c.X(x), c.Y(y), str, o2)); };
    c.ptext = function (px, py, str, o2) { return c.add(textEl(px, py, str, o2)); };
    c.hlab = function (x1, x2, y, str, side) { return c.ptext((c.X(x1) + c.X(x2)) / 2, c.Y(y) + (side === 'above' ? -13 : 15), str); };
    c.vlab = function (y1, y2, x, str, side) { return c.ptext(c.X(x) + (side === 'left' ? -14 : 14), (c.Y(y1) + c.Y(y2)) / 2, str, { rot: true }); };
    c.svg = function (label, maxw) {
      return '<svg class="fig-svg" viewBox="0 0 ' + f1(c.w) + ' ' + f1(c.h) + '" width="100%" style="max-width:' + Math.round(Math.min(maxw || 400, c.w * 1.25)) + 'px" role="img" aria-label="' + HW.esc(label || 'figure') + '" font-family="KaTeX_Main, \'Times New Roman\', Times, serif" font-size="16" fill="' + INK + '">' + parts.join('') + '</svg>';
    };
    return c;
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  /* rectangle W × H (units) labelled along the bottom and the left */
  function figRect(W, H, bottom, left, label, inside) {
    var c = canvas(W, H, { pw: 200, ph: 110, m: [10, 18, 30, 34] });
    c.rect(0, 0, W, H, SH2); c.hlab(0, W, 0, bottom, 'below'); c.vlab(0, H, 0, left, 'left');
    if (inside) c.text(W / 2, H / 2, inside);
    return c.svg(label || 'rectangle', 300);
  }
  /* rectangular prism: front face len × ht, depth dp drawn as an oblique offset */
  function figPrism(len, ht, dp, ll, lh, ld, label) {
    var dx = dp * 0.55, dy = dp * 0.45, c = canvas(len + dx, ht + dy, { pw: 220, ph: 140, m: [12, 58, 30, 34] });
    c.dash(0, 0, dx, dy); c.dash(dx, dy, len + dx, dy); c.dash(dx, dy, dx, ht + dy);
    c.rect(0, 0, len, ht, SH2);
    c.poly([[len, 0], [len + dx, dy], [len + dx, ht + dy], [len, ht]], SH);
    c.poly([[0, ht], [len, ht], [len + dx, ht + dy], [dx, ht + dy]], '#f3f5f7');
    c.hlab(0, len, 0, ll, 'below'); c.vlab(0, ht, 0, lh, 'left');
    c.ptext(c.X(len + dx / 2) + 8, c.Y(dy / 2) + 2, ld, { anchor: 'start' });
    return c.svg(label || 'rectangular prism', 340);
  }
  /* square poster (side P units) with a square of side s cut from the top-left corner */
  function figPoster(P, s, lp, ls) {
    var c = canvas(P, P, { pw: 170, ph: 170, m: [28, 34, 30, 34] });
    c.poly([[0, 0], [P, 0], [P, P], [s, P], [s, P - s], [0, P - s]], SH);
    c.rect(0, P - s, s, s, 'none', { stroke: GR, dash: '5 4', w: 1.3 });
    c.hlab(0, P, 0, lp, 'below'); c.vlab(0, P, P, lp, 'right');
    c.hlab(0, s, P, ls, 'above'); c.vlab(P - s, P, 0, ls, 'left');
    c.text(s / 2, P - s / 2, '\\text{cut}', { size: 13 });
    return c.svg('square poster with a square cut from one corner', 300);
  }
  /* garden with a uniform path around it: the path is shaded */
  function figPath(gw, gh, w, lw, lh, lpath) {
    var OW = gw + 2 * w, OH = gh + 2 * w, c = canvas(OW, OH, { pw: 240, ph: 160, m: [10, 10, 10, 10] });
    c.add('<path d="M' + f1(c.X(0)) + ' ' + f1(c.Y(0)) + 'H' + f1(c.X(OW)) + 'V' + f1(c.Y(OH)) + 'H' + f1(c.X(0)) + 'Z M' + f1(c.X(w)) + ' ' + f1(c.Y(w)) + 'H' + f1(c.X(w + gw)) + 'V' + f1(c.Y(w + gh)) + 'H' + f1(c.X(w)) + 'Z" fill="' + SH + '" fill-rule="evenodd"/>');
    c.rect(0, 0, OW, OH, 'none'); c.rect(w, w, gw, gh, 'none');
    var top = c.Y(w + gh), bot = c.Y(w), lft = c.X(w), rgt = c.X(w + gw);
    c.add(arrowEl(lft + 2, top + 12, rgt - 2, top + 12)); c.ptext((lft + rgt) / 2, top + 28, lw);
    c.add(arrowEl(lft + 12, top + 34, lft + 12, bot - 2)); c.ptext(lft + 28, (top + 34 + bot) / 2 + 4, lh, { rot: true });
    c.ptext((lft + rgt) / 2 + 20, (top + bot) / 2 + 20, '\\text{garden}', { size: 14 });
    var yA = c.Y(OH * 0.55), xL = c.X(0); c.add(arrowEl(xL + 1, yA, lft - 1, yA)); c.ptext((xL + lft) / 2, yA - 9, lpath, { size: 13 });
    return c.svg('rectangular garden with a path around it', 380);
  }
  /* cardboard sheet L × W with squares of side x cut from the corners */
  function figNet(L, Wd) {
    var x0 = 50, y0 = 20, w = 250, h = Math.round(250 * Wd / L), cc = 30, s = '';
    s += '<svg class="fig-svg" viewBox="0 0 360 ' + (h + 92) + '" width="100%" style="max-width:400px" role="img" aria-label="sheet of cardboard with a square cut from each corner" font-family="KaTeX_Main, \'Times New Roman\', Times, serif" font-size="15" fill="' + INK + '">';
    [[x0, y0], [x0 + w - cc, y0], [x0, y0 + h - cc], [x0 + w - cc, y0 + h - cc]].forEach(function (q) { s += '<rect x="' + q[0] + '" y="' + q[1] + '" width="' + cc + '" height="' + cc + '" fill="' + SH + '" stroke="' + GR + '" stroke-width="1"/>'; });
    s += '<path d="M' + (x0 + cc) + ' ' + y0 + ' H' + (x0 + w - cc) + ' V' + (y0 + cc) + ' H' + (x0 + w) + ' V' + (y0 + h - cc) + ' H' + (x0 + w - cc) + ' V' + (y0 + h) + ' H' + (x0 + cc) + ' V' + (y0 + h - cc) + ' H' + x0 + ' V' + (y0 + cc) + ' H' + (x0 + cc) + ' Z" fill="none" stroke="' + INK + '" stroke-width="2"/>';
    s += '<rect x="' + (x0 + cc) + '" y="' + (y0 + cc) + '" width="' + (w - 2 * cc) + '" height="' + (h - 2 * cc) + '" fill="none" stroke="' + INK + '" stroke-width="1.2" stroke-dasharray="6 4"/>';
    s += textEl(x0 + w / 2, y0 + h + 17, L + '\\text{ cm}') + textEl(x0 - 14, y0 + h / 2, Wd + '\\text{ cm}', { rot: true }) + textEl(x0 + cc / 2, y0 + cc / 2, 'x', { size: 14 }) + textEl(x0 + w - cc / 2, y0 + h - cc / 2, 'x', { size: 14 });
    s += textEl(180, y0 + h + 47, '\\text{shaded squares are cut out; fold up along the dashed lines}', { size: 12 });
    return s + '</svg>';
  }
  function sideBySide(svgs) { return '<div style="display:flex;flex-wrap:wrap;align-items:flex-end;gap:6px 18px;max-width:460px">' + svgs.map(function (s) { return '<div style="flex:1 1 150px;min-width:130px;max-width:220px">' + s + '</div>'; }).join('') + '</div>'; }

  /* ---------------- assignment generators ---------------- */
  /* Q1: a x² + b x + c + d x² + e x + f */
  function likeQ1(r) {
    var s = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9), c: -r.int(1, 9), d: -r.int(1, 8), e: -r.int(1, 8), f: r.int(2, 12) }; },
      function (s) { return s.a + s.d > 0 && s.b + s.e !== 0 && s.c + s.f !== 0 && s.a + s.d !== s.b + s.e; });
    if (r.chance(0.1)) s = { a: 4, b: 9, c: -6, d: -2, e: -3, f: 10 };
    return s;
  }
  /* Q15: which pattern? (7 − 2x)(7 + 2x) in the booklet */
  function patQ15(r) {
    var kind = r.pick(['sd', 'sd', 'sd', 'sdx', 'sqm', 'sqp', 'none']), a = r.int(2, 9), b = r.int(2, 5), c;
    if (a === b) a++;
    do { c = r.int(2, 9); } while (c === a);
    if (kind === 'sd' && r.chance(0.12)) { a = 7; b = 2; }
    var A = N(a), Bx = M(b, 'x'), Bm = M(-b, 'x'), f1v, f2v, tex, P;
    if (kind === 'sd') { f1v = [A, Bm]; f2v = [A, Bx]; }
    else if (kind === 'sdx') { f1v = [A, Bx]; f2v = [A, Bm]; }
    else if (kind === 'sqm') { f1v = [A, Bm]; f2v = [A, Bm]; }
    else if (kind === 'sqp') { f1v = [A, Bx]; f2v = [A, Bx]; }
    else { f1v = [A, Bm]; f2v = [N(c), Bx]; }
    tex = br(f1v) + br(f2v);
    P = kind === 'sd' || kind === 'sdx' ? pSd(A, kind === 'sd' ? Bm : Bx, 1, false) : kind === 'none' ? pFoil(f1v[0], f1v[1], f2v[0], f2v[1]) : pSq(A, kind === 'sqm' ? Bm : Bx);
    P.tex = tex;
    return { kind: kind === 'sdx' ? 'sd' : kind, a: a, b: b, c: c, tex: tex, P: P };
  }
  /* Q22: k(x − p)² + q·x, Malik puts k inside the square, Sana does not double the middle term */
  function malikSana(r) {
    var s = pickWhere(function () { return { k: r.int(2, 5), p: r.int(1, 5), q: r.int(1, 9), sq: r.pick([-1, -1, 1]), d: r.pick([2, 3]) }; },
      function (s) { return -2 * s.k * s.p + s.sq * s.q !== 0 && s.q !== 2 * s.k * s.p && s.k * s.p !== s.q; });
    if (r.chance(0.12)) s = { k: 4, p: 2, q: 3, sq: -1, d: 3 };
    var k = s.k, p = s.p, Q = M(s.sq * s.q, 'x'), qt = (s.sq < 0 ? '-' : '+') + (s.q === 1 ? '' : s.q) + 'x';
    s.expr = k + '(x-' + p + ')^{2}' + qt;
    s.correct = Y.add(Y.scale(Y.pow(lin(1, -p), 2), k), Q);
    s.malik = Y.add(Y.pow(lin(k, -k * p), 2), Q);
    s.sana = Y.add(Y.scale(S([M(1, 'x', 2), M(-p, 'x'), N(p * p)]), k), Q);
    s.mLines = [s.expr, '(' + k + 'x-' + k * p + ')^{2}' + qt, seq([M(k * k, 'x', 2), M(-2 * k * k * p, 'x'), N(k * k * p * p)]) + qt, tx(s.malik)];
    s.sLines = [s.expr, k + '\\left(x^{2}-' + (p === 1 ? '' : p) + 'x+' + p * p + '\\right)' + qt, seq([M(k, 'x', 2), M(-k * p, 'x'), N(k * p * p)]) + qt, tx(s.sana)];
    s.v = p + s.d; s.val = at(s.correct, s.v); s.mVal = at(s.malik, s.v); s.sVal = at(s.sana, s.v);
    s.Q = Q; s.qt = qt;
    return s;
  }
  function workTable(heads, cols) {
    var rows = '';
    for (var i = 0; i < cols[0].length; i++) rows += '<tr>' + cols.map(function (c) { return '<td>' + t(c[i]) + '</td>'; }).join('') + '</tr>';
    return '<div class="fig" style="overflow-x:auto"><table class="vtab"><tr>' + heads.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' + rows + '</table></div>';
  }

  /* ---------------- extra-practice generators ---------------- */
  /* EP11: a x(x + b) − (x − c)(x + d); Priya changes only the first sign of the subtracted bracket */
  function priya(r) {
    var s = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 5), c: r.int(1, 4), d: r.int(2, 8) }; },
      function (s) { return s.d > s.c && s.a * s.b - s.d + s.c !== 0 && s.a * s.b + s.d - s.c !== 0; });
    if (r.chance(0.12)) s = { a: 4, b: 3, c: 2, d: 5 };
    var A = pMono(M(s.a, 'x'), [M(1, 'x'), N(s.b)]), Pr = Y.mul(lin(1, -s.c), lin(1, s.d));
    s.expr = s.a + 'x(x+' + s.b + ')-(x-' + s.c + ')(x+' + s.d + ')';
    s.prod = Pr; s.A = A.val;
    s.step2 = tx(A.val) + '-\\left(' + tx(Pr) + '\\right)';
    s.step3 = seq(termsOf(A.val).concat([M(-1, 'x', 2), M(s.d - s.c, 'x'), N(-s.c * s.d)]));
    s.wrongRes = S([A.val, M(-1, 'x', 2), M(s.d - s.c, 'x'), N(-s.c * s.d)]);
    s.correct = Y.sub(A.val, Pr);
    s.list = [{ s: 1, p: A }, { s: -1, p: pFoil(M(1, 'x'), N(-s.c), M(1, 'x'), N(s.d)) }];
    s.x0 = s.c; s.val = at(s.correct, s.x0); s.wVal = at(s.wrongRes, s.x0);
    return s;
  }

  HW.defineLesson({
    id: 'u3l7', unit: 3, num: '7', title: 'Unit Review: Polynomial Operations', outcome: 'AN4',
    blurb: 'Every skill in the unit, mixed: collect like terms, add and subtract, distribute, FOIL, the special products, binomial × trinomial, and area and volume.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Like Terms, Adding and Subtracting', stem: 'Simplify by collecting like terms.', parts: [
        { id: '1', level: 'BEG', make: function (r) {
          var s = likeQ1(r), list = [M(s.a, 'x', 2), M(s.b, 'x'), N(s.c), M(s.d, 'x', 2), M(s.e, 'x'), N(s.f)], T = S(list);
          return pp(t(seq(list)), T, [
            { is: S([M(s.a + s.d, 'x', 4), M(s.b + s.e, 'x', 2), N(s.c + s.f)]), code: 'u3l7-add-exp', hint: 'When you collect like terms, add the <b>coefficients</b> only — the exponents stay the same: ' + t(seq([M(s.a, 'x', 2), M(s.d, 'x', 2)]) + '=' + tx(M(s.a + s.d, 'x', 2))) + '.' },
            { is: S([M(s.a + s.d + s.b + s.e, 'x', 2), N(s.c + s.f)]), code: 'unlike-combined', hint: 'Only <b>like</b> terms combine: ' + t('x^{2}') + '-terms with ' + t('x^{2}') + '-terms, ' + t('x') + '-terms with ' + t('x') + '-terms, numbers with numbers.' }],
            'Group the like terms: ' + groupsTex(list) + '<br>' + t('=' + tx(T)),
            ['Group the ' + t('x^{2}') + '-terms, the ' + t('x') + '-terms and the numbers. Each term keeps the sign in front of it.', 'Add the coefficients; the exponents don’t change.'], 'collect like terms');
        } }] },
      { num: '2', stem: 'Simplify.', parts: [
        { id: '2', level: 'BEG', make: function (r) {
          var L = r.pick(LETTERS2.slice(1)), u = L[0], w = L[1];
          var s = pickWhere(function () { return { a: r.int(4, 9), b: -r.int(2, 7), c: -r.int(1, 8), d: r.int(2, 9), e: nz(r, -9, 9) }; }, function (s) { return s.a + s.c > 0 && s.b + s.d > 0 && s.a + s.c !== s.b + s.d; });
          if (r.chance(0.12)) { u = 'm'; w = 'n'; s = { a: 7, b: -4, c: -3, d: 9, e: -2 }; }
          var list = [M(s.a, u), M(s.b, w), M(s.c, u), M(s.d, w), N(s.e)], T = S(list);
          return pp(t(seq(list)), T, [
            { is: S([MV(s.a + s.b + s.c + s.d, (function () { var o = {}; o[u] = 1; o[w] = 1; return o; })()), N(s.e)]), code: 'unlike-combined', hint: t(u) + '-terms and ' + t(w) + '-terms are <b>unlike</b>: they can’t be combined. Collect the ' + t(u) + '-terms and the ' + t(w) + '-terms separately.' },
            { is: S([M(s.a + s.c, u), M(s.b + s.d, w)]), code: 'missing-term', hint: 'Don’t lose the number ' + t(s.e) + ': it has no like term, so it stays in the answer.' }],
            'Group the like terms: ' + groupsTex(list) + '<br>' + t('=' + tx(T)),
            ['Collect the ' + t(u) + '-terms, then the ' + t(w) + '-terms. A number on its own has no like term.'], 'collect like terms (two letters)', { vars: [u, w] });
        } }] },
      { num: '3', stem: 'Add.', parts: [
        { id: '3', level: 'BEG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(2, 8), b: -r.int(1, 6), c: r.int(1, 9), d: r.int(1, 7), e: r.int(2, 9), f: -r.int(2, 12) }; }, function (s) { return s.b + s.e !== 0 && s.c + s.f !== 0; });
          if (r.chance(0.12)) s = { a: 5, b: -2, c: 6, d: 3, e: 7, f: -9 };
          var A = [M(s.a, 'x', 2), M(s.b, 'x'), N(s.c)], B = [M(s.d, 'x', 2), M(s.e, 'x'), N(s.f)], c = combo([{ s: 1, p: pBr(A) }, { s: 1, p: pBr(B) }]);
          return pp(t(c.tex), c.T, [{ is: S([M(s.a + s.d, 'x', 4), M(s.b + s.e, 'x', 2), N(s.c + s.f)]), code: 'u3l7-add-exp', hint: 'Adding like terms adds the <b>coefficients</b>; the exponents stay the same: ' + t(s.a + 'x^{2}+' + s.d + 'x^{2}=' + (s.a + s.d) + 'x^{2}') + '.' }],
            c.sol, ['Remove the brackets (adding changes no signs), then collect like terms.'], 'add trinomials');
        } }] },
      { num: '4', stem: 'Subtract.', parts: [
        { id: '4', level: 'EMG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(3, 9), b: r.int(1, 7), c: -r.int(1, 9), d: r.int(1, 6), e: -r.int(1, 8), f: r.int(2, 9) }; }, function (s) { return s.a - s.d !== 0 && s.b - s.e !== 0 && s.c - s.f !== 0; });
          if (r.chance(0.12)) s = { a: 8, b: 3, c: -5, d: 2, e: -6, f: 9 };
          var A = [M(s.a, 'x', 2), M(s.b, 'x'), N(s.c)], B = [M(s.d, 'x', 2), M(s.e, 'x'), N(s.f)], c = combo([{ s: 1, p: pBr(A) }, { s: -1, p: pBr(B) }]);
          return pp(t(c.tex), c.T, c.wr.map(function (w) { return w.code === 'minus-ignored' ? { is: w.is, code: 'no-change', hint: 'You added the brackets. Subtracting means changing the sign of <b>every</b> term in the second bracket, then adding.' } : w; }),
            c.sol, ['Subtracting a bracket = adding its opposite: change the sign of <b>every</b> term in the second bracket.', 'Then collect like terms.'], 'subtract trinomials');
        } }] },
      /* ---------- Part B ---------- */
      { num: '5', section: 'Part B — Multiplying a Monomial by a Polynomial', stem: 'Multiply.', parts: [
        { id: '5', level: 'BEG', make: function (r) {
          var s = pickWhere(function () { return { a: -r.int(2, 6), p: r.int(1, 4), b: r.int(2, 6), q: r.int(2, 4) }; }, function (s) { return s.p * s.q !== s.p + s.q && s.a + s.b !== 0 && (s.p > 1 || s.q > 1); });
          if (r.chance(0.12)) s = { a: -5, p: 3, b: 4, q: 2 };
          var A = M(s.a, 'x', s.p), B = M(s.b, 'x', s.q), T = Y.mul(A, B);
          return pp(t(tx(A) + '\\times ' + tx(B)), T, [
            { is: M(s.a * s.b, 'x', s.p * s.q), code: 'mult-exp', hint: 'Multiplying powers of the same base: <b>add</b> the exponents (' + t('x^{' + s.p + '}\\cdot x^{' + s.q + '}=x^{' + (s.p + s.q) + '}') + '), don’t multiply them.' },
            { is: M(s.a + s.b, 'x', s.p + s.q), code: 'add-coef', hint: '<b>Multiply</b> the coefficients: ' + t(par(s.a) + '\\times ' + s.b) + '.' }],
            t('(' + s.a + '\\times ' + s.b + ')x^{' + s.p + '+' + s.q + '}=' + tx(T)),
            ['Multiply the coefficients (watch the sign), then add the exponents of ' + t('x') + '.'], 'monomial × monomial');
        } }] },
      { num: '6', stem: 'Expand.', parts: [
        { id: '6', level: 'BEG', make: function (r) {
          var a = r.int(2, 6), b = r.int(1, 5), c = nz(r, -9, 9);
          if (r.chance(0.12)) { a = 3; b = 2; c = -7; }
          return comboPart('', [{ s: 1, p: pMono(M(a, 'x'), [M(b, 'x'), N(c)]) }], ['Multiply ' + t(a + 'x') + ' by <b>each</b> term in the bracket: multiply the coefficients, add the exponents.'], 'expand ax(bx + c)');
        } }] },
      { num: '7', stem: 'Expand.', parts: [
        { id: '7', level: 'EMG', make: function (r) {
          var a = r.int(2, 6), b = nz(r, -6, 6), c = nz(r, -9, 9);
          if (r.chance(0.12)) { a = 4; b = 3; c = -2; }
          return comboPart('', [{ s: 1, p: pMono(M(-a, 'x'), [M(1, 'x', 2), M(b, 'x'), N(c)]) }], ['Multiply ' + t('-' + a + 'x') + ' by <b>each</b> of the three terms.', 'The negative sign goes with the monomial: it changes the sign of every term.'], 'expand −ax(trinomial)');
        } }] },
      { num: '8', stem: 'Expand and simplify.', parts: [
        { id: '8', level: 'PRG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(3, 7), b: nz(r, -6, 6), c: r.int(2, 5), d: nz(r, -6, 6) }; }, function (s) { return s.a !== s.c && s.a * s.b - s.c * s.d !== 0; });
          if (r.chance(0.12)) s = { a: 5, b: 4, c: 3, d: -2 };
          return comboPart('', [{ s: 1, p: pMono(M(s.a, 'x'), [M(1, 'x'), N(s.b)]) }, { s: 1, p: pMono(M(-s.c, 'x'), [M(1, 'x'), N(s.d)]) }], ['Distribute each monomial over its own bracket. The second monomial is ' + t('-' + s.c + 'x') + ' — its sign multiplies both terms.', 'Then collect the ' + t('x^{2}') + '-terms and the ' + t('x') + '-terms.'], 'ax(x+b) − cx(x+d)');
        } }] },
      /* ---------- Part C ---------- */
      { num: '9', section: 'Part C — Multiplying Two Binomials', stem: 'Expand using FOIL.', parts: [
        { id: '9', level: 'BEG', make: function (r) {
          var p = r.int(2, 9), q = -r.int(1, 9); if (p + q === 0) q--;
          if (r.chance(0.12)) { p = 6; q = -4; }
          return comboPart('', [{ s: 1, p: pFoil(M(1, 'x'), N(p), M(1, 'x'), N(q)) }], ['First, Outer, Inner, Last — four products. Then collect the two ' + t('x') + '-terms.'], 'FOIL (x+p)(x−q)');
        } }] },
      { num: '10', stem: 'Expand.', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(2, 4), b: -r.int(1, 7), c: r.int(2, 4), d: r.int(1, 7) }; }, function (s) { return s.a * s.d + s.b * s.c !== 0 && gcd(s.a, -s.b) === 1 && gcd(s.c, s.d) === 1; });
          if (r.chance(0.12)) s = { a: 2, b: -5, c: 3, d: 2 };
          return comboPart('', [{ s: 1, p: pFoil(M(s.a, 'x'), N(s.b), M(s.c, 'x'), N(s.d)) }], ['First, Outer, Inner, Last: multiply the coefficients and keep each sign.', 'Collect the Outer and Inner products into one ' + t('x') + '-term.'], 'FOIL (ax−b)(cx+d)');
        } }] },
      { num: '11', stem: 'Expand and simplify.', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(1, 6), b: r.int(2, 9), c: -r.int(1, 6), d: r.int(2, 8) }; }, function (s) { return s.a !== s.b && s.c + s.d !== 0 && s.a * s.b + s.c * s.d !== 0; });
          if (r.chance(0.12)) s = { a: 3, b: 8, c: -2, d: 5 };
          return comboPart('', [{ s: 1, p: pFoil(M(1, 'x'), N(s.a), M(1, 'x'), N(s.b)) }, { s: 1, p: pFoil(M(1, 'x'), N(s.c), M(1, 'x'), N(s.d)) }], ['FOIL each product separately, then add the two results and collect like terms.'], 'sum of two binomial products');
        } }] },
      /* ---------- Part D ---------- */
      { num: '12', section: 'Part D — Special Products', stem: 'Expand using the difference of squares pattern.', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var a = r.int(2, 9), b = r.int(1, 9); if (r.chance(0.12)) { a = 6; b = 1; }
          var P = pSd(M(a, 'x'), N(b), 1, r.chance(0.3));
          return pp(t(P.tex), P.val, combo([{ s: 1, p: P }]).wr, P.sol, ['Use ' + t('(a+b)(a-b)=a^{2}-b^{2}') + ' with ' + t('a=' + a + 'x') + ' and ' + t('b=' + b) + '.', 'Square the <b>whole</b> first term: ' + t('(' + a + 'x)^{2}=' + a * a + 'x^{2}') + '.'], 'difference of squares');
        } }] },
      { num: '13', stem: 'Expand using the perfect square trinomial pattern.', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          var b = r.int(2, 12), v = r.pick(['x', 'x', 'x', 'a', 'm', 'n', 'y', 't']); if (r.chance(0.12)) { b = 9; v = 'x'; }
          var P = pSq(M(1, v), N(b));
          return pp(t(P.tex), P.val, combo([{ s: 1, p: P }]).wr, P.sol, ['Use ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + ' with ' + t('a=' + v) + ' and ' + t('b=' + b) + '.', 'The middle term is <b>twice</b> ' + t(v + '\\cdot ' + b) + '.'], 'perfect square (x+b)²');
        } }] },
      { num: '14', stem: 'Expand.', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var ab = pickWhere(function () { return [r.int(2, 5), r.int(1, 9)]; }, function (q) { return gcd(q[0], q[1]) === 1; }), a = ab[0], b = ab[1]; if (r.chance(0.12)) { a = 3; b = 5; }
          var P = pSq(M(a, 'x'), N(-b));
          return pp(t(P.tex), P.val, combo([{ s: 1, p: P }]).wr, P.sol, ['Use ' + t('(a-b)^{2}=a^{2}-2ab+b^{2}') + ' with ' + t('a=' + a + 'x') + ' and ' + t('b=' + b) + '.', 'Square the whole first term, ' + t('(' + a + 'x)^{2}') + ', and double the middle product.'], 'perfect square (ax−b)²');
        } }] },
      { num: '15', stem: function (sh) { return 'Identify which pattern applies, then expand: ' + t(sh.tex); },
        shared: function (r) { return patQ15(r); },
        parts: [
          { id: '15a', sub: 'pattern', level: 'BEG', make: function (r, sh) {
            var names = { sd: 'Difference of squares, ' + t('(a+b)(a-b)'), sqp: 'Perfect square (sum), ' + t('(a+b)^{2}'), sqm: 'Perfect square (difference), ' + t('(a-b)^{2}'), none: 'Neither pattern — just use FOIL' };
            var why = {
              sd: 'Look for the <b>same two terms</b>, once added and once subtracted: that is a difference of squares.',
              sqp: 'A perfect square is the <b>same binomial twice</b>. Are both brackets exactly the same?',
              sqm: 'A perfect square is the <b>same binomial twice</b>. Are both brackets exactly the same?',
              none: 'Compare the brackets term by term: ' + (sh.kind === 'none' ? '' : 'they use the same two terms, so a pattern applies.')
            };
            if (sh.kind === 'none') { why.sd = 'The brackets don’t have the same first term (' + t(sh.a) + ' and ' + t(sh.c) + '), so it isn’t ' + t('(a+b)(a-b)') + '.'; why.sqp = why.sqm = 'The two brackets are different, so it isn’t a square.'; }
            if (sh.kind === 'sqp' || sh.kind === 'sqm') why.sd = 'For a difference of squares, one bracket must have ' + t('+') + ' and the other ' + t('-') + '. Here both brackets are the same.';
            if (sh.kind === 'sqp') why.sqm = 'Look at the sign inside the brackets: it is ' + t('+') + '.';
            if (sh.kind === 'sqm') why.sqp = 'Look at the sign inside the brackets: it is ' + t('-') + '.';
            var opts = ['sd', 'sqp', 'sqm', 'none'].map(function (k) { return { html: names[k], right: k === sh.kind, why: k === sh.kind ? null : why[k], code: 'pat-' + k }; });
            var sol = sh.kind === 'sd' ? 'The two brackets have the same two terms, ' + t(sh.a) + ' and ' + t(sh.b + 'x') + ', once added and once subtracted: a <b>difference of squares</b>.'
              : sh.kind === 'none' ? 'The brackets have different first terms (' + t(sh.a) + ' and ' + t(sh.c) + '), so no pattern applies: <b>FOIL</b> it.'
                : 'Both brackets are the same binomial, so the product is that binomial squared: a <b>perfect square</b> (' + (sh.kind === 'sqp' ? 'sum' : 'difference') + ').';
            return mc(r, 'Which pattern applies to ' + t(sh.tex) + '?', opts, sol, ['Same two terms with opposite signs → difference of squares. Same binomial twice → perfect square. Otherwise, FOIL.'], 'which pattern (' + sh.kind + ')', true);
          } },
          { id: '15b', sub: 'expand', level: 'EMG', make: function (r, sh) {
            var P = sh.P, keyTex = sh.kind === 'sd' ? seq([N(sh.a * sh.a), M(-sh.b * sh.b, 'x', 2)]) : null;
            var part = pp('Expand ' + t(sh.tex) + '.', P.val, combo([{ s: 1, p: P }]).wr, P.sol, [sh.kind === 'none' ? 'No pattern: First, Outer, Inner, Last.' : sh.kind === 'sd' ? 'Square the first term, square the second, subtract: ' + t(sh.a + '^{2}-(' + sh.b + 'x)^{2}') + '.' : 'Square, double the product, square: ' + t('a^{2}\\pm 2ab+b^{2}') + '.'], 'expand ' + sh.tex, keyTex ? { keyTex: keyTex } : {});
            return part;
          } }] },
      /* ---------- Part E ---------- */
      { num: '16', section: 'Part E — Multiplying a Binomial by a Trinomial', stem: 'Expand.', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var s = pickWhere(function () { return { p: r.int(1, 6), q: -r.int(1, 6), w: r.int(2, 9) }; }, function (s) { var R = Y.mul(lin(1, s.p), S([M(1, 'x', 2), M(s.q, 'x'), N(s.w)])); return Y.count(R) === 4 && s.p !== -s.q; });
          if (r.chance(0.12)) s = { p: 4, q: -3, w: 5 };
          return comboPart('', [{ s: 1, p: pBT([M(1, 'x'), N(s.p)], [M(1, 'x', 2), M(s.q, 'x'), N(s.w)]) }], ['Multiply ' + t('x') + ' by each term of the trinomial, then ' + t(s.p) + ' by each term — six products.', 'Then collect the ' + t('x^{2}') + '-terms and the ' + t('x') + '-terms.'], 'binomial × trinomial');
        } }] },
      { num: '17', stem: 'Expand.', parts: [
        { id: '17', level: 'EMG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(2, 3), b: r.int(1, 4), q: r.int(1, 6), w: -r.int(1, 6) }; }, function (s) { var R = Y.mul(lin(s.a, -s.b), S([M(1, 'x', 2), M(s.q, 'x'), N(s.w)])); return Y.count(R) === 4 && gcd(s.a, s.b) === 1; });
          if (r.chance(0.12)) s = { a: 2, b: 1, q: 4, w: -3 };
          return comboPart('', [{ s: 1, p: pBT([M(s.a, 'x'), N(-s.b)], [M(1, 'x', 2), M(s.q, 'x'), N(s.w)]) }], ['Multiply ' + t(s.a + 'x') + ' by each term of the trinomial, then ' + t('-' + s.b) + ' by each term — six products.', 'Watch the signs in the second row: a negative times a negative is positive.'], 'binomial × trinomial (a ≠ 1)');
        } }] },
      /* ---------- Part F ---------- */
      { num: '18', section: 'Part F — Area and Volume Applications', stem: '', parts: [
        { id: '18', level: 'BEG', make: function (r) {
          var p = r.int(4, 12), q = r.int(1, p - 1); if (r.chance(0.12)) { p = 9; q = 5; }
          var P = pFoil(M(1, 'x'), N(p), M(1, 'x'), N(q)), L = lin(1, p), W = lin(1, q);
          return pp('A rectangular playing field has length ' + t('(' + tx(L) + ')') + ' m and width ' + t('(' + tx(W) + ')') + ' m.' + figRect(1.6 + p / 10, 1 + q / 10, tx(L), tx(W), 'rectangular field') + 'Write a simplified expression for its area.', P.val,
            combo([{ s: 1, p: P }]).wr.concat([{ is: lin(4, 2 * (p + q)), code: 'perimeter', hint: 'That is the perimeter. The <b>area</b> is length × width.' }]),
            'Area = length × width ' + t('=' + P.tex) + '<br>' + P.sol + ' m' + t('^{2}'), ['Area of a rectangle = length × width. Multiply the two binomials (FOIL).'], 'area of a rectangle', { after: t('\\text{m}^{2}') });
        } }] },
      { num: '19', stem: '', parts: [
        { id: '19', level: 'EMG', make: function (r) {
          var p = r.int(1, 9), sg = r.chance(0.75) ? 1 : -1, h = r.chance(0.7) ? 1 : 2; if (r.chance(0.12)) { p = 3; sg = 1; h = 1; }
          var Bse = lin(1, sg * p), H = M(h, 'x'), face = Y.pow(Bse, 2), V = Y.mul(face, H), ht = tx(H);
          return pp('A storage bin shaped like a rectangular prism has a square base of side length ' + t('(' + tx(Bse) + ')') + ' cm and height ' + t(ht) + ' cm.' + figPrism(2.2, 1.6, 2.2, tx(Bse), ht, tx(Bse), 'prism with a square base') + 'Write a simplified expression for its volume.', V, [
            { is: face, code: 'face-area', hint: 'That is the area of the base. Volume = (area of the base) × height, so multiply by the height ' + t(ht) + ' too.' },
            { is: Y.mul(S([M(1, 'x', 2), N(p * p)]), H), code: 'sq-no-middle', hint: t('(' + tx(Bse) + ')^{2}') + ' has a middle term: ' + t('(' + tx(Bse) + ')^{2}=' + tx(face)) + '.' },
            { is: Y.mul(Bse, H), code: 'two-dims', hint: 'A prism has three dimensions: length, width <b>and</b> height. The base is a square, so it is ' + t('(' + tx(Bse) + ')(' + tx(Bse) + ')') + '.' },
            { is: Y.add(face, H), code: 'value', hint: 'Volume = (area of the base) <b>×</b> height — multiply, don’t add.' },
            { is: Y.mul(face, M(1, 'x')), code: 'value', hint: 'Multiply by the whole height, ' + t(ht) + '.' }],
            'Volume = length × width × height ' + t('=(' + tx(Bse) + ')^{2}\\cdot ' + ht) + '<br>' + t('(' + tx(Bse) + ')^{2}=' + tx(face)) + '<br>' + t(ht + '\\left(' + tx(face) + '\\right)=' + tx(V)) + ' cm' + t('^{3}'),
            ['Volume = length × width × height. The base is a square, so length and width are both ' + t('(' + tx(Bse) + ')') + '.', 'Square the binomial first, then multiply every term by ' + t(ht) + '.'], 'volume with square base', { after: t('\\text{cm}^{3}') });
        } }] },
      { num: '20', stem: '', parts: [
        { id: '20', level: 'PRG', make: function (r) {
          var p = r.int(2, 12), a = r.chance(0.7) ? 1 : 2; if (r.chance(0.12)) { p = 6; a = 1; }
          var side = lin(a, p), st = tx(side), Big = Y.pow(side, 2), Rm = Y.sub(Big, M(1, 'x', 2));
          return pp('A square poster of side length ' + t('(' + st + ')') + ' cm has a smaller square of side length ' + t('x') + ' cm cut from one corner.' + figPoster(1.8 + p / 10, 1.2 / a, st, 'x') + 'Write a simplified expression for the remaining area.', Rm, [
            { is: Y.sub(S([M(a * a, 'x', 2), N(p * p)]), M(1, 'x', 2)), code: 'sq-no-middle', hint: t('(' + st + ')^{2}') + ' is not ' + t(tx(S([M(a * a, 'x', 2), N(p * p)]))) + ': a square of a binomial has a middle term, ' + t(tx(M(2 * a * p, 'x'))) + '.' },
            { is: Big, code: 'whole-only', hint: 'That is the area of the whole poster. Subtract the square that was cut out.' },
            { is: Y.add(Big, M(1, 'x', 2)), code: 'not-subtracted', hint: 'The cut-out square is <b>removed</b>: subtract its area, ' + t('x^{2}') + '.' }],
            'Remaining area = poster − cut-out square<br>' + t('(' + st + ')^{2}-x^{2}=' + tx(Big) + '-x^{2}=' + tx(Rm)) + ' cm' + t('^{2}'),
            ['Remaining area = (area of the poster) − (area of the cut-out square).', 'Expand ' + t('(' + st + ')^{2}') + ' with its middle term, then subtract ' + t('x^{2}') + '.'], 'square minus corner square', { after: t('\\text{cm}^{2}') });
        } }] },
      /* ---------- Part G ---------- */
      { num: '21', section: 'Part G — Test-Style Questions', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '21', level: 'PRG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 6), k: r.int(2, 4), c: r.int(1, 6), d: r.int(1, 5) }; }, function (s) {
            var A = s.a - s.k, B = s.a * s.b + s.k * s.c, C = -s.k * s.d, sum = A + B + C; return A > 0 && sum > 0 && sum < 1000 && s.a !== s.k;
          });
          if (r.chance(0.12)) s = { a: 3, b: 5, k: 2, c: 4, d: 1 };
          var P1 = pMono(M(s.a, 'x'), [M(1, 'x'), N(s.b)]), P2 = pMono(N(-s.k), [M(1, 'x', 2), M(-s.c, 'x'), N(s.d)]), c = combo([{ s: 1, p: P1 }, { s: 1, p: P2 }]);
          var A = s.a - s.k, B = s.a * s.b + s.k * s.c, C = -s.k * s.d, ans = A + B + C;
          var wrongs = [[A - (2 * s.k * s.c) + 2 * s.k * s.d, 'neg-first', 'The ' + t('-' + s.k) + ' multiplies <b>every</b> term in the bracket: ' + t('-' + s.k + '\\left(' + seq([M(1, 'x', 2), M(-s.c, 'x'), N(s.d)]) + '\\right)=' + tx(P2.val)) + '.'],
            [s.a - s.k + s.a * s.b - s.c + s.d, 'k-first', 'Multiply the ' + t(s.k) + ' into <b>all three</b> terms of the bracket.'],
            [A, 'only-a', 'That is ' + t('a') + '. The question asks for ' + t('a+b+c') + '.'], [B, 'only-a', 'That is ' + t('b') + '. The question asks for ' + t('a+b+c') + '.']];
          return KP.nr('The expression ' + t(c.tex) + ' can be written in the form ' + t('ax^{2}+bx+c') + '. The value of ' + t('a+b+c') + ' is ________.', ans, numDiagClean(ans, wrongs),
            c.sol + '<br>So ' + t('a=' + A) + ', ' + t('b=' + B) + ', ' + t('c=' + C) + ' and ' + t('a+b+c=' + A + (B < 0 ? '' : '+') + B + (C < 0 ? '' : '+') + C + '=' + ans) + '.',
            ['Expand both products, collect like terms, then read off ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' (with their signs).'], 'NR a+b+c');
        } }] },
      { num: '22', stem: function (sh) { return '<i>(Written Response)</i> Malik and Sana each attempt to expand and simplify ' + t(sh.expr) + '. Their work is shown below, and each student’s work contains exactly one mathematical error.' + workTable(['Malik', 'Sana'], [sh.mLines, sh.sLines]); },
        shared: function (r) { return malikSana(r); },
        parts: [
          { id: '22a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var k = sh.k, p = sh.p;
            return mc(r, '(a) What error did Malik make?', [
              { html: 'He multiplied the ' + t(k) + ' into the bracket <b>before</b> squaring. The square comes first (order of operations): writing ' + t('(' + k + 'x-' + k * p + ')^{2}') + ' multiplies by ' + t(k + '^{2}=' + k * k) + ' instead of ' + t(k) + '.', right: true },
              { html: 'He expanded ' + t('(' + k + 'x-' + k * p + ')^{2}') + ' incorrectly.', why: 'Check it: ' + t('(' + k + 'x)^{2}-2(' + k + 'x)(' + k * p + ')+' + k * p + '^{2}=' + seq([M(k * k, 'x', 2), M(-2 * k * k * p, 'x'), N(k * k * p * p)])) + ' — that line is right. The mistake is earlier.', code: 'm-expand' },
              { html: 'He left out the middle term when he squared.', why: 'His third line has the middle term ' + t(tx(M(-2 * k * k * p, 'x'))) + '. Look at his second line.', code: 'm-middle' },
              { html: 'He collected the ' + t('x') + '-terms incorrectly.', why: t(tx(M(-2 * k * k * p, 'x')) + sh.qt + '=' + tx(M(-2 * k * k * p + co(sh.Q, 'x', 1), 'x'))) + ' — that step is right. Look at his second line.', code: 'm-collect' }],
              'Malik’s second line, ' + t('(' + k + 'x-' + k * p + ')^{2}') + ', squares the ' + t(k) + ' as well. ' + t(k + '(x-' + p + ')^{2}') + ' means: square ' + t('(x-' + p + ')') + ' first, then multiply by ' + t(k) + '. Every term of his answer is ' + t(k) + ' times too big (apart from ' + t(sh.qt.replace(/^\+/, '')) + ').',
              ['Compare Malik’s second line with the first. What does ' + t(k + '(x-' + p + ')^{2}') + ' mean, in order of operations?'], 'Malik error');
          } },
          { id: '22b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var k = sh.k, p = sh.p;
            return mc(r, '(b) What error did Sana make?', [
              { html: 'She expanded ' + t('(x-' + p + ')^{2}') + ' as ' + t('x^{2}-' + (p === 1 ? '' : p) + 'x+' + p * p) + '. The middle term must be <b>doubled</b>: ' + t('(x-' + p + ')^{2}=x^{2}-' + 2 * p + 'x+' + p * p) + '.', right: true },
              { html: 'She multiplied the ' + t(k) + ' into the bracket before squaring.', why: 'She kept the ' + t(k) + ' outside until the bracket was expanded — that is correct. Check her bracket against ' + t('(a-b)^{2}=a^{2}-2ab+b^{2}') + '.', code: 's-k' },
              { html: 'The last term of her bracket should be ' + t(-p * p) + ', not ' + t('+' + p * p) + '.', why: t('(-' + p + ')^{2}=+' + p * p) + ': a square is never negative. Look at the middle term.', code: 's-last' },
              { html: 'She multiplied the ' + t(k) + ' into only the first term of the bracket.', why: 'Her third line multiplies all three terms by ' + t(k) + '. Look at the middle term of her bracket.', code: 's-k-first' }],
              'Sana’s second line has ' + t('x^{2}-' + (p === 1 ? '' : p) + 'x+' + p * p) + ': the Outer and Inner products of ' + t('(x-' + p + ')(x-' + p + ')') + ' are both ' + t('-' + (p === 1 ? '' : p) + 'x') + ', so the middle term is ' + t('-' + 2 * p + 'x') + '.',
              ['Expand ' + t('(x-' + p + ')(x-' + p + ')') + ' with FOIL and compare it with Sana’s bracket.'], 'Sana error');
          } },
          { id: '22c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var k = sh.k, p = sh.p, sq = Y.pow(lin(1, -p), 2);
            return pp('(c) Determine the correct expansion of ' + t(sh.expr) + '.', sh.correct, [
              { is: sh.malik, code: 'k-in-square', hint: 'That is Malik’s answer. Square the bracket first, then multiply by ' + t(k) + '.' },
              { is: sh.sana, code: 'sq-not-doubled', hint: 'That is Sana’s answer. The middle term of ' + t('(x-' + p + ')^{2}') + ' is doubled.' },
              { is: Y.add(Y.scale(S([M(1, 'x', 2), N(p * p)]), k), sh.Q), code: 'sq-no-middle', hint: t('(x-' + p + ')^{2}') + ' has a middle term: ' + t(tx(sq)) + '.' },
              { is: Y.add(S([M(k, 'x', 2), M(-2 * p, 'x'), N(p * p)]), sh.Q), code: 'k-first', hint: 'Multiply <b>every</b> term of ' + t(tx(sq)) + ' by ' + t(k) + '.' }],
              t('(x-' + p + ')^{2}=x^{2}-' + 2 * p + 'x+' + p * p) + ' (square first)<br>' + t(k + '\\left(' + tx(sq) + '\\right)' + sh.qt + '=' + seq([M(k, 'x', 2), M(-2 * k * p, 'x'), N(k * p * p)]) + sh.qt) + '<br>' + t('=' + tx(sh.correct)),
              ['Square the bracket first (with its middle term), then multiply every term by ' + t(k) + ', then collect the ' + t('x') + '-terms.'], 'correct expansion');
          } },
          { id: '22d', sub: 'd', level: 'BEG', make: function (r, sh) {
            var v = sh.v, k = sh.k, p = sh.p, fl = [nbox('Original'), nbox('Expansion')];
            fl[0].label = 'value of ' + t(sh.expr); fl[1].label = 'value of your expansion';
            var d = [[sh.mVal, 'u3l7-sub-val', 'That is the value of Malik’s answer. Substitute into the correct expansion.'], [sh.sVal, 'u3l7-sub-val', 'That is the value of Sana’s answer. Substitute into the correct expansion.']];
            var p0 = KP.fields('(d) Verify your expansion by substituting ' + t('x=' + v) + ' into both the original expression and your expansion.', fl,
              [K.number(sh.val, numDiagClean(sh.val, [[k * (v - p) * (v - p), 'value', 'Include the ' + t(sh.qt.replace(/^\+/, '')) + ' term: ' + t(sh.qt.replace(/x$/, '(' + v + ')')) + '.'], [k * k * (v - p) * (v - p) + at(sh.Q, v), 'k-in-square', 'Square ' + t('(' + v + '-' + p + ')') + ' first, then multiply by ' + t(k) + '.']])), K.number(sh.val, numDiagClean(sh.val, d))],
              [String(sh.val), String(sh.val)], 'both ' + t(sh.val),
              'Original: ' + t(k + '(' + v + '-' + p + ')^{2}' + sh.qt.replace(/x$/, '(' + v + ')') + '=' + k + '(' + (v - p) * (v - p) + ')' + (at(sh.Q, v) < 0 ? '' : '+') + at(sh.Q, v) + '=' + sh.val) + '.<br>Expansion: ' + t(valuesTex(sh.correct, v) + '=' + sh.val) + '.<br>Both give ' + t(sh.val) + ', so the expansion checks out. (Malik’s answer gives ' + t(sh.mVal) + ' and Sana’s gives ' + t(sh.sVal) + '.)',
              ['Replace every ' + t('x') + ' with ' + t(v) + '. In the original, work out the bracket first, square it, then multiply by ' + t(k) + '.'], 'verify at x = ' + v);
            p0.bad = [[String(sh.val), String(sh.mVal)], [String(sh.val), String(sh.sVal)]];
            return p0;
          } }] }
    ],
    extra: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Multi-Step Simplification', stem: 'Expand each product, then collect like terms. Work one product at a time and keep the brackets until you have distributed the sign in front of them.', parts: [
        { id: 'e1a', level: 'PRG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 5), c: r.int(1, 6), d: r.int(1, 5), e: r.int(1, 5) }; }, function (s) { return s.c !== s.d && -s.a * s.b + s.c - s.d + 2 * s.e !== 0; });
          if (r.chance(0.12)) s = { a: 3, b: 2, c: 4, d: 1, e: 3 };
          return comboPart('', [{ s: 1, p: pMono(M(s.a, 'x'), [M(1, 'x'), N(-s.b)]) }, { s: 1, p: pFoil(M(1, 'x'), N(s.c), M(1, 'x'), N(-s.d)) }, { s: -1, p: pSq(M(1, 'x'), N(-s.e)) }], null, 'ax(x−b)+(x+c)(x−d)−(x−e)²');
        } },
        { id: 'e1b', level: 'PRG', make: function (r) {
          var s = pickWhere(function () { var o = { a: r.int(2, 6), b: r.int(1, 5), c: r.int(2, 3), d: r.int(1, 5), e: r.int(1, 7) }; o.f = o.a * o.b - (o.c * o.e - o.d); return o; },
            function (s) { return s.f >= 2 && s.f <= 6 && s.a - s.c + s.f !== 0 && gcd(s.c, s.d) === 1; });
          if (r.chance(0.12)) s = { a: 5, b: 3, c: 2, d: 1, e: 6, f: 4 };
          var part = comboPart('', [{ s: 1, p: pMono(M(s.a, 'x'), [M(1, 'x'), N(s.b)]) }, { s: -1, p: pFoil(M(s.c, 'x'), N(-s.d), M(1, 'x'), N(s.e)) }, { s: 1, p: pMono(N(s.f), [M(1, 'x', 2), M(-1, 'x')]) }], null, 'ax(x+b)−(cx−d)(x+e)+f(x²−x)');
          part.solution += '<br>The ' + t('x') + '-terms cancel completely.';
          return part;
        } }] },
      { num: '2', stem: 'Expand and simplify. One part of each question uses a special-product pattern.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(1, 6), d: r.int(1, 6) }; }, function (s) { return -s.a * s.c + s.b - 2 * s.d !== 0 && gcd(s.a, s.b) === 1; });
          if (r.chance(0.12)) s = { a: 3, b: 2, c: 5, d: 4 };
          return comboPart('', [{ s: 1, p: pFoil(M(s.a, 'x'), N(s.b), M(1, 'x'), N(-s.c)) }, { s: -1, p: pSq(M(1, 'x'), N(s.d)) }], null, '(ax+b)(x−c)−(x+d)²');
        } },
        { id: 'e2b', level: 'PRG', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 9), c: r.int(1, 6), d: r.int(2, 9) }; }, function (s) { return s.c !== s.d && s.c * s.d !== s.b * s.b && s.a * s.a !== 1 && gcd(s.a, s.b) === 1; });
          if (r.chance(0.12)) s = { a: 2, b: 7, c: 3, d: 8 };
          return comboPart('', [{ s: 1, p: pSd(M(s.a, 'x'), N(-s.b), 1, false) }, { s: -1, p: pFoil(M(1, 'x'), N(-s.c), M(1, 'x'), N(s.d)) }], null, '(ax−b)(ax+b)−(x−c)(x+d)');
        } }] },
      { num: '3', stem: 'Each expression is a product of <b>three</b> factors. Multiply two of them first — choosing the pair that forms a special product makes the work much shorter — then multiply the result by the remaining factor.', parts: [
        { id: 'e3a', level: 'PRG', make: function (r) {
          var s = pickWhere(function () { return { k: r.int(2, 4), a: r.int(1, 5), b: r.int(1, 5) }; }, function (s) { return s.a !== s.b; });
          if (r.chance(0.12)) s = { k: 2, a: 3, b: 1 };
          var D = S([M(1, 'x', 2), N(-s.a * s.a)]), kD = Y.scale(D, s.k), B = lin(1, s.b), T = Y.mul(kD, B), tex = s.k + '(x+' + s.a + ')(x-' + s.a + ')(x+' + s.b + ')';
          return pp(t(tex), T, [
            { is: Y.mul(S([M(1, 'x', 2), N(s.a * s.a)]), B, N(s.k)), code: 'sd-plus', hint: t('(x+' + s.a + ')(x-' + s.a + ')=x^{2}-' + s.a * s.a) + ': a sum times a difference gives a <b>difference</b> of squares.' },
            { is: Y.mul(D, B), code: 'k-forgot', hint: 'Don’t forget the ' + t(s.k) + ' in front: it multiplies the whole product.' },
            { is: Y.mul(D, B, N(s.k * s.k)), code: 'k-both', hint: 'The ' + t(s.k) + ' multiplies the product <b>once</b>, not once for each bracket.' },
            { is: S([M(s.k, 'x', 3), N(-s.k * s.a * s.a * s.b)]), code: 'fl-only', hint: 'Multiply <b>every</b> term of ' + t(s.k + 'x^{2}-' + s.k * s.a * s.a) + ' by <b>every</b> term of ' + t('(x+' + s.b + ')') + ' — four products.' }],
            'The pair ' + t('(x+' + s.a + ')(x-' + s.a + ')') + ' is a sum times a difference: ' + t('x^{2}-' + s.a * s.a) + '.<br>' + t(s.k + '\\left(x^{2}-' + s.a * s.a + '\\right)=' + tx(kD)) + '<br>' + t('\\left(' + tx(kD) + '\\right)(x+' + s.b + ')=' + seq([Y.mul(kD, M(1, 'x')), Y.mul(kD, N(s.b))].reduce(function (a, p) { return a.concat(termsOf(p)); }, [])) + '=' + tx(T)),
            ['Multiply ' + t('(x+' + s.a + ')(x-' + s.a + ')') + ' first — a difference of squares. Then multiply by ' + t(s.k) + ', then by ' + t('(x+' + s.b + ')') + '.'], 'k(x+a)(x−a)(x+b)');
        } },
        { id: 'e3b', level: 'PRG', make: function (r) {
          var ab = pickWhere(function () { return [r.int(2, 5), r.int(1, 5)]; }, function (q) { return gcd(q[0], q[1]) === 1; }), a = ab[0], b = ab[1], v = r.pick(LETTERS1); if (r.chance(0.12)) { a = 2; b = 1; v = 'x'; }
          var D = S([M(a * a, v, 2), N(-b * b)]), T = Y.mul(M(-1, v), D), bt0 = b === 1 ? '1' : String(b);
          return pp(t('-' + v + '(' + a + v + '-' + bt0 + ')(' + a + v + '+' + bt0 + ')'), T, [
            { is: Y.mul(M(-1, v), S([M(a * a, v, 2), N(b * b)])), code: 'sd-plus', hint: 'A sum times a difference gives a <b>difference</b> of squares: ' + t('(' + a + v + ')^{2}-' + bt0 + '^{2}=' + tx(D)) + '.' },
            { is: S([M(-a * a, v, 3), M(-b * b, v)]), code: 'neg-first', hint: 'The ' + t('-' + v) + ' multiplies <b>both</b> terms of ' + t(tx(D)) + ': ' + t('-' + v + '\\cdot(-' + b * b + ')=+' + (b * b === 1 ? '' : b * b) + v) + '.' },
            { is: Y.mul(M(-1, v), S([M(a, v, 2), N(-b * b)])), code: 'coef-not-squared', hint: 'Square the whole first term: ' + t('(' + a + v + ')^{2}=' + a * a + v + '^{2}') + '.' }],
            'Sum times difference first: ' + t('(' + a + v + '-' + bt0 + ')(' + a + v + '+' + bt0 + ')=' + tx(D)) + '<br>' + t('-' + v + '\\left(' + tx(D) + '\\right)=' + tx(T)),
            ['Multiply the two binomials first (a difference of squares), then multiply both terms by ' + t('-' + v) + '.'], '−x(ax−b)(ax+b)');
        } }] },
      { num: '4', stem: 'A cube of a binomial is just a square followed by one more multiplication.',
        shared: function (r) { var k = r.int(2, 7), m = r.int(1, 6), v = r.pick(LETTERS1); if (r.chance(0.12)) { k = 2; m = 1; v = 'x'; } return { k: k, m: m, v: v }; },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) { var P = pSq(M(1, sh.v), N(sh.k)); return pp('(a) Expand ' + t(P.tex) + '.', P.val, combo([{ s: 1, p: P }]).wr, P.sol, ['Use ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.'], 'square (x+k)²'); } },
          { id: 'e4b', level: 'EMG', make: function (r, sh) {
            var k = sh.k, v = sh.v, B = lin(1, k, v), Sq = Y.pow(B, 2), C = Y.pow(B, 3), bt0 = '(' + v + '+' + k + ')';
            return pp('(b) Multiply your answer from (a) by ' + t(bt0) + ' to obtain ' + t(bt0 + '^{3}') + '.', C, [
              { is: S([M(1, v, 3), N(k * k * k)]), code: 'cube-each', hint: 'You can’t cube each term separately: ' + t(bt0 + '^{3}') + ' is ' + t(bt0 + bt0 + bt0) + '.' },
              { is: Y.mul(S([M(1, v, 2), N(k * k)]), B), code: 'sq-no-middle', hint: 'Use the square from (a) with its middle term: ' + t(tx(Sq)) + '.' },
              { is: S([Y.mul(Sq, M(1, v)), N(k)]), code: 'q-not-mult', hint: 'The ' + t(k) + ' in ' + t(bt0) + ' multiplies every term of ' + t(tx(Sq)) + ' too.' }],
              t(bt0 + '\\left(' + tx(Sq) + '\\right)=' + seq(termsOf(Y.mul(Sq, M(1, v))).concat(termsOf(Y.mul(Sq, N(k))))) + '=' + tx(C)),
              ['Multiply ' + t(v) + ' by each term of ' + t(tx(Sq)) + ', then ' + t(k) + ' by each term — six products. Then collect.'], 'cube (x+k)³');
          } },
          { id: 'e4c', level: 'PRG', make: function (r, sh) {
            var m = sh.m, v = sh.v, B = lin(1, -m, v), Sq = Y.pow(B, 2), C = Y.pow(B, 3), bt0 = '(' + v + '-' + m + ')';
            return pp('(c) Use the same two-step method to expand ' + t(bt0 + '^{3}') + '.', C, [
              { is: S([M(1, v, 3), N(-m * m * m)]), code: 'cube-each', hint: 'You can’t cube each term separately. Square first: ' + t(bt0 + '^{2}=' + tx(Sq)) + ', then multiply by ' + t(bt0) + '.' },
              { is: Y.mul(S([M(1, v, 2), N(m * m)]), B), code: 'sq-no-middle', hint: 'Square first, with the middle term: ' + t(bt0 + '^{2}=' + tx(Sq)) + '.' },
              { is: Y.mul(Sq, lin(1, m, v)), code: 'sign', hint: 'The third factor is ' + t(bt0) + ': multiply by ' + t('-' + m) + ', not ' + t('+' + m) + '.' }],
              'Step 1: ' + t(bt0 + '^{2}=' + tx(Sq)) + '<br>Step 2: ' + t(bt0 + '\\left(' + tx(Sq) + '\\right)=' + seq(termsOf(Y.mul(Sq, M(1, v))).concat(termsOf(Y.mul(Sq, N(-m))))) + '=' + tx(C)),
              ['Square first: ' + t(bt0 + '^{2}') + '. Then multiply every term by ' + t(v) + ' and by ' + t('-' + m) + '.', 'The signs alternate in the answer: ' + t('+,\\ -,\\ +,\\ -') + '.'], 'cube (x−m)³');
          } }] },
      { num: '5', stem: 'Expand and simplify. Notice that the first term is a binomial times a trinomial and the second is a monomial times a perfect square.', parts: [
        { id: 'e5', level: 'ADV', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(2, 3), e: nz(r, -3, 3), b: r.int(1, 5), c: r.int(1, 6), d: r.int(2, 6) }; }, function (s) {
            var R = Y.sub(Y.mul(lin(s.a, s.e), S([M(1, 'x', 2), M(-s.b, 'x'), N(s.c)])), Y.mul(M(1, 'x'), Y.pow(lin(1, -s.d), 2))); return Y.count(R) === 4;
          });
          if (r.chance(0.12)) s = { a: 2, e: 1, b: 3, c: 4, d: 5 };
          var sqd = Y.pow(lin(1, -s.d), 2), P2 = { tex: 'x(x-' + s.d + ')^{2}', val: Y.mul(M(1, 'x'), sqd), sol: t('(x-' + s.d + ')^{2}=' + tx(sqd)) + ', so ' + t('x(x-' + s.d + ')^{2}=x\\left(' + tx(sqd) + '\\right)=' + tx(Y.mul(M(1, 'x'), sqd))),
            wr: [{ p: Y.mul(M(1, 'x'), S([M(1, 'x', 2), N(s.d * s.d)])), code: 'sq-no-middle', hint: 'Square first, with the middle term: ' + t('(x-' + s.d + ')^{2}=' + tx(sqd)) + '.' },
              { p: Y.pow(lin(1, -s.d), 2), code: 'k-forgot', hint: 'Multiply the square by the ' + t('x') + ' in front.' },
              { p: Y.pow(Y.mul(M(1, 'x'), lin(1, -s.d)), 2), code: 'k-in-square', hint: 'Square the bracket first, then multiply by ' + t('x') + '. Putting ' + t('x') + ' inside before squaring makes it ' + t('x^{2}') + '.' }] };
          return comboPart('', [{ s: 1, p: pBT([M(s.a, 'x'), N(s.e)], [M(1, 'x', 2), M(-s.b, 'x'), N(s.c)]) }, { s: -1, p: P2 }], ['Do the two products separately: six products for the binomial × trinomial; square, then multiply by ' + t('x') + ' for the second.', 'Subtract the <b>whole</b> second result: change every sign.'], 'binomial×trinomial − x(x−d)²');
        } }] },
      /* ---------- Part B ---------- */
      { num: '6', section: 'Part B — Special Products and Patterns', stem: 'Expand using the appropriate pattern. Be careful about what plays the role of ' + t('a') + ' and what plays the role of ' + t('b') + '.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) {
          var L = r.pick(LETTERS2), ab = pickWhere(function () { return [r.int(2, 5), r.int(1, 5)]; }, function (q) { return gcd(q[0], q[1]) === 1 && q[0] !== q[1]; });
          if (r.chance(0.12)) { L = ['x', 'y']; ab = [3, 2]; }
          var P = pSq(M(ab[0], L[0]), M(ab[1], L[1]));
          return pp(t(P.tex), P.val, combo([{ s: 1, p: P }]).wr, P.sol, ['Here ' + t('a=' + ab[0] + L[0]) + ' and ' + t('b=' + (ab[1] === 1 ? '' : ab[1]) + L[1]) + '. Use ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.', 'Square each whole term, coefficient and all.'], '(au+bw)²', { vars: L });
        } },
        { id: 'e6b', level: 'EMG', make: function (r) {
          var L = r.pick(LETTERS2), ab = pickWhere(function () { return [r.int(2, 6), r.int(1, 6)]; }, function (q) { return gcd(q[0], q[1]) === 1 && q[0] !== q[1]; });
          if (r.chance(0.12)) { L = ['a', 'b']; ab = [5, 4]; }
          var P = pSd(M(ab[0], L[0]), M(-ab[1], L[1]), 1, false);
          return pp(t(P.tex), P.val, combo([{ s: 1, p: P }]).wr, P.sol, ['A sum times a difference: ' + t('(a-b)(a+b)=a^{2}-b^{2}') + ' with ' + t('a=' + ab[0] + L[0]) + ', ' + t('b=' + (ab[1] === 1 ? '' : ab[1]) + L[1]) + '.'], '(au−bw)(au+bw)', { vars: L });
        } },
        { id: 'e6c', level: 'EMG', make: function (r) {
          var k = r.int(2, 9), v = r.pick(['x', 'x', 'y', 'a', 'm']), sw = r.chance(0.3); if (r.chance(0.12)) { k = 3; v = 'x'; sw = false; }
          var P = pSd(M(1, v, 2), N(k), 1, sw);
          return pp(t(P.tex), P.val, combo([{ s: 1, p: P }]).wr, P.sol, ['The first term is ' + t(v + '^{2}') + ' itself, so ' + t('a=' + v + '^{2}') + ' and ' + t('a^{2}=(' + v + '^{2})^{2}=' + v + '^{4}') + '.'], '(x²+k)(x²−k)');
        } }] },
      { num: '7', stem: 'Work backwards from the pattern to find the missing terms.', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) {
          var k = r.int(2, 12), v = r.pick(LETTERS1); if (r.chance(0.12)) { k = 7; v = 'x'; }
          var p = KP.number('Find the missing number: ' + t('\\left(' + v + '+\\square\\right)^{2}=' + v + '^{2}+' + 2 * k + v + '+' + k * k), k, numDiagClean(k, [[2 * k, 'cs-half', 'That is the middle coefficient, ' + t('2ab') + '. The missing number is <b>half</b> of it.'], [k * k, 'not-sq', 'That is the last term, ' + t('b^{2}') + '. The missing number is its <b>square root</b>.']]),
            t('(' + v + '+b)^{2}=' + v + '^{2}+2b' + v + '+b^{2}') + ': the last term is ' + t(k * k + '=' + k + '^{2}') + ' and the middle term ' + t(2 * k + v + '=2(' + v + ')(' + k + ')') + ' agrees, so the missing number is ' + t(k) + '.',
            ['The last term of a perfect square is ' + t('b^{2}') + '. What number squared gives ' + t(k * k) + '?', 'Check with the middle term: it should be ' + t('2\\cdot b\\cdot ' + v) + '.'], 'missing b in (x+b)²', { before: t('\\square=') });
          p.bad = [String(2 * k), String(k * k)]; return p;
        } },
        { id: 'e7b', level: 'PRG', make: function (r) {
          var ab = pickWhere(function () { return [r.int(2, 5), r.int(1, 7)]; }, function (q) { return gcd(q[0], q[1]) === 1; }), a = ab[0], b = ab[1], v = r.pick(LETTERS1); if (r.chance(0.12)) { a = 3; b = 4; v = 'x'; }
          var p = KP.number('Find the missing number: ' + t('\\left(' + a + v + '-\\square\\right)^{2}=' + a * a + v + '^{2}-' + 2 * a * b + v + '+' + b * b), b, numDiagClean(b, [[b * b, 'not-sq', 'That is the last term. The missing number is its <b>square root</b>.'], [2 * a * b, 'cs-half', 'That is the middle coefficient, ' + t('2ab') + '.'], [a * b, 'cs-half', t('2ab=' + 2 * a * b + v) + ' with ' + t('a=' + a + v) + ', so ' + t('b=' + 2 * a * b + '\\div(2\\cdot' + a + ')') + '.'], [-b, 'sign', 'The bracket already shows the minus sign: type the number that goes in the box.']]),
            'The last term is ' + t(b * b + '=' + b + '^{2}') + ', so the missing number is ' + t(b) + '. Check the middle term: ' + t('-2(' + a + v + ')(' + b + ')=-' + 2 * a * b + v) + ' ✓',
            ['The last term is ' + t('b^{2}') + '. Take its square root, then check the middle term ' + t('-2(' + a + v + ')(b)') + '.'], 'missing b in (ax−b)²', { before: t('\\square=') });
          p.bad = [String(b * b), String(2 * a * b)].filter(function (x) { return +x !== b; }); return p;
        } },
        { id: 'e7c', level: 'PRG', make: function (r) {
          var a = r.int(2, 9), m = r.int(1, 9); if (r.chance(0.12)) { a = 4; m = 5; }
          var want = M(a, 'x');
          var chk = function (resp) {
            var A = readPoly(resp); if (A.res) return A.res;
            if (Y.eq(A.p, want) || Y.eq(A.p, Y.neg(want))) return A.fi ? form(A.fi.code, A.fi.msg || 'Simplify it.') : ok();
            if (Y.eq(A.p, M(a * a, 'x', 2)) || Y.eq(A.p, M(a * a, 'x'))) return wrong('not-sq', 'The square of the blank is ' + t(a * a + 'x^{2}') + ', so the blank is its <b>square root</b>: what squared gives ' + t(a * a + 'x^{2}') + '?');
            if (Y.eq(A.p, N(a)) || Y.eq(A.p, M(1, 'x'))) return wrong('value', 'The blank squared must be the whole first term, ' + t(a * a + 'x^{2}') + ' — include both the number and the ' + t('x') + '.');
            if (Y.eq(A.p, M(a, 'x', 2))) return wrong('exp', t('(' + a + 'x^{2})^{2}=' + a * a + 'x^{4}') + '. The blank is ' + t('\\sqrt{' + a * a + 'x^{2}}') + '.');
            return wrong('value', 'Expand ' + t('(\\square+' + m + ')(\\square-' + m + ')=\\square^{2}-' + m * m) + ', so ' + t('\\square^{2}') + ' must be ' + t(a * a + 'x^{2}') + '.');
          };
          var p = KP.math('Find the term that goes in <b>both</b> blanks: ' + t('\\left(\\square+' + m + '\\right)\\left(\\square-' + m + '\\right)=' + a * a + 'x^{2}-' + m * m), chk, a + 'x',
            'A sum times a difference: ' + t('(\\square+' + m + ')(\\square-' + m + ')=\\square^{2}-' + m * m) + '. So ' + t('\\square^{2}=' + a * a + 'x^{2}') + ' and ' + t('\\square=' + a + 'x') + ' (since ' + t('(' + a + 'x)^{2}=' + a * a + 'x^{2}') + ').',
            ['The product is ' + t('\\square^{2}-' + m + '^{2}') + '. What squared gives ' + t(a * a + 'x^{2}') + '?'], 'missing a in (a+m)(a−m)', { keys: 'poly', vars: ['x'], before: t('\\square=') });
          p.bad = [a * a + 'x^{2}', String(a), a + 'x^{2}']; p.good = ['-' + a + 'x'];
          return p;
        } }] },
      { num: '8', stem: 'Patterns are not only for algebra — they make some arithmetic easy enough to do in your head.',
        shared: function (r) {
          var k = r.pick([1, 1, 1, 2, 3]), form2 = r.chance(0.7) ? 'plus' : 'minus', v = r.pick(['n', 'n', 'n', 'm', 't', 'a']), Nn = r.int(2, 9) * 10 + r.pick([0, 0, 0, r.int(1, 9)]);
          if (r.chance(0.12)) { k = 1; form2 = 'plus'; v = 'n'; Nn = 50; }
          var a = r.int(2, 10) * 10, b = r.int(1, 5); if (r.chance(0.12)) { a = 100; b = 2; }
          return { k: k, form: form2, v: v, N: Nn, a: a, b: b };
        },
        parts: [
          { id: 'e8a1', sub: 'a expand', level: 'EMG', make: function (r, sh) {
            var k = sh.k, v = sh.v, plus = sh.form === 'plus', L = plus ? Y.sub(Y.pow(lin(1, k, v), 2), M(1, v, 2)) : Y.sub(M(1, v, 2), Y.pow(lin(1, -k, v), 2));
            var lhs = plus ? '(' + v + '+' + k + ')^{2}-' + v + '^{2}' : v + '^{2}-(' + v + '-' + k + ')^{2}', sq = plus ? Y.pow(lin(1, k, v), 2) : Y.pow(lin(1, -k, v), 2);
            return pp('(a) Expand and simplify the left side of ' + t(lhs + '=' + tx(L)) + ' to show that it is true for every number ' + t(v) + '. (Type the simplified left side.)', L, [
              { is: plus ? N(k * k) : N(-k * k), code: 'sq-no-middle', hint: 'The square has a middle term: ' + t((plus ? '(' + v + '+' + k + ')^{2}' : '(' + v + '-' + k + ')^{2}') + '=' + tx(sq)) + '.' },
              { is: plus ? Y.sub(sq, N(0)) : Y.add(M(2, v, 2), Y.neg(sq)).length ? null : null, code: 'value' },
              { is: plus ? null : S([M(-2 * k, v), N(k * k)]), code: 'sub-first', hint: 'Subtract the <b>whole</b> square: ' + t('-\\left(' + tx(sq) + '\\right)=' + tx(Y.neg(sq))) + '.' }],
              t(lhs + '=' + (plus ? '\\left(' + tx(sq) + '\\right)-' + v + '^{2}' : v + '^{2}-\\left(' + tx(sq) + '\\right)') + '=' + tx(L)),
              ['Expand the square with its middle term, then subtract.'], 'expand (n+k)²−n²', { vars: [v] });
          } },
          { id: 'e8a2', sub: 'a evaluate', level: 'EMG', make: function (r, sh) {
            var k = sh.k, n = sh.N, plus = sh.form === 'plus', val = plus ? 2 * k * n + k * k : 2 * k * n - k * k;
            var exprN = plus ? (n + k) + '^{2}-' + n + '^{2}' : n + '^{2}-' + (n - k) + '^{2}', rule = plus ? '2' + (k === 1 ? '' : k) + sh.v + '+' + k * k : 2 * k + sh.v + '-' + k * k;
            var p = KP.number('Use the result ' + t((plus ? '(' + sh.v + '+' + k + ')^{2}-' + sh.v + '^{2}' : sh.v + '^{2}-(' + sh.v + '-' + k + ')^{2}') + '=' + (plus ? tx(lin(2 * k, k * k, sh.v)) : tx(lin(2 * k, -k * k, sh.v)))) + ' to evaluate ' + t(exprN) + ' without a calculator.', val,
              numDiagClean(val, [[2 * k * n, 'missing-term', 'Include the constant term ' + t((plus ? '+' : '-') + k * k) + '.'], [k * k, 'sq-no-middle', 'That leaves out the middle term ' + t('2\\cdot' + k + '\\cdot' + sh.v) + '.'], [plus ? 2 * k * (n + k) + k * k : 2 * k * (n - k) - k * k, 'value', 'Use ' + t(sh.v + '=' + n) + ' (the number that is <b>not</b> ' + (plus ? 'increased' : 'decreased') + ').']]),
              'With ' + t(sh.v + '=' + n) + ': ' + t(exprN + '=' + (plus ? 2 * k + '(' + n + ')+' + k * k : 2 * k + '(' + n + ')-' + k * k) + '=' + val) + '.',
              ['Match ' + t(exprN) + ' with the left side: what is ' + t(sh.v) + '? Then work out ' + t(rule) + '.'], 'evaluate with the pattern');
            p.bad = [String(2 * k * n), String(k * k)]; return p;
          } },
          { id: 'e8b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var a = sh.a, b = sh.b, P1 = a + b, P2 = a - b, val = a * a - b * b, fl = [nbox('a', { label: t('a') }), nbox('b', { label: t('b') }), nbox('Product', { label: t(P1 + '\\times ' + P2 + '=') })];
            var chk = function (resp) {
              resp = resp || [];
              var A = HW.parse.number(resp[0] == null ? '' : resp[0]), Bv = HW.parse.number(resp[1] == null ? '' : resp[1]), Cv = HW.parse.number(resp[2] == null ? '' : resp[2]);
              if (!A.ok || !Bv.ok || !Cv.ok) return form('empty', 'Fill in all three boxes with numbers.');
              if (A.value !== a || Math.abs(Bv.value) !== b) {
                if (A.value === P1 && Bv.value === P2 || A.value === P2 && Bv.value === P1) return wrong('u3l7-ab-pick', t('a') + ' and ' + t('b') + ' are not the two numbers being multiplied. Write ' + t(P1 + '=a+b') + ' and ' + t(P2 + '=a-b') + ': ' + t('a') + ' is the number halfway between, and ' + t('b') + ' is the distance to each.');
                return wrong('u3l7-ab-pick', t('a') + ' is the number halfway between ' + t(P1) + ' and ' + t(P2) + ', and ' + t('b') + ' is how far each one is from it.');
              }
              if (Cv.value === val) return ok();
              if (Cv.value === a * a + b * b) return wrong('sd-plus', t('(a+b)(a-b)=a^{2}-b^{2}') + ': <b>subtract</b> ' + t(b + '^{2}') + '.');
              if (Cv.value === a * a - b || Cv.value === a * a - 2 * b) return wrong('not-sq', 'Square ' + t('b') + ': ' + t(b + '^{2}=' + b * b) + '.');
              return wrong('value', t(a + '^{2}-' + b + '^{2}=' + a * a + '-' + b * b) + '.');
            };
            var p = KP.fields('(b) Use ' + t('(a+b)(a-b)=a^{2}-b^{2}') + ' to evaluate ' + t(P1 + '\\times ' + P2) + ' mentally. State what you chose for ' + t('a') + ' and for ' + t('b') + ', and the product.', fl, [], [String(a), String(b), String(val)], t('a=' + a) + ', ' + t('b=' + b) + ', ' + t(P1 + '\\times ' + P2 + '=' + F(val)),
              t(P1 + '=' + a + '+' + b) + ' and ' + t(P2 + '=' + a + '-' + b) + ', so ' + t('a=' + a) + ' and ' + t('b=' + b) + '.<br>' + t(P1 + '\\times ' + P2 + '=' + a + '^{2}-' + b + '^{2}=' + F(a * a) + '-' + b * b + '=' + F(val)) + '.',
              ['Write ' + t(P1) + ' and ' + t(P2) + ' as the same number plus and minus a small number.'], 'mental product (a+b)(a−b)');
            p.check = chk; p.bad = [[String(P1), String(P2), String(val)], [String(a), String(b), String(a * a + b * b)]];
            return p;
          } }] },
      { num: '9', stem: 'Multiply each binomial by the trinomial beside it. Six products, then collect — and watch how much collapses.',
        shared: function (r) {
          var L = r.pick(LETTERS2), rev = r.chance(0.3); if (r.chance(0.12)) { L = ['x', 'y']; rev = false; }
          var u = L[0], w = L[1], sq = function (z) { return z + '^{2}'; };
          var ta = rev ? sq(w) + '-' + u + w + '+' + sq(u) : sq(u) + '-' + u + w + '+' + sq(w), tb = rev ? sq(w) + '+' + u + w + '+' + sq(u) : sq(u) + '+' + u + w + '+' + sq(w);
          return { u: u, w: w, rev: rev, A: '(' + u + '+' + w + ')\\left(' + ta + '\\right)', B: '(' + u + '-' + w + ')\\left(' + tb + '\\right)', k: r.int(2, 5), sg: r.pick([1, 1, -1]), v: r.pick(['x', 'x', 'y', 'a']) };
        },
        parts: [
          { id: 'e9a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var u = M(1, sh.u), w = M(1, sh.w), Tr = sh.rev ? [MV(1, o2(sh.w, 2)), MV(-1, o11(sh.u, sh.w)), MV(1, o2(sh.u, 2))] : [MV(1, o2(sh.u, 2)), MV(-1, o11(sh.u, sh.w)), MV(1, o2(sh.w, 2))];
            var P = pBT([u, w], Tr), part = comboPart('(a) Expand ', [{ s: 1, p: P }], ['Multiply ' + t(sh.u) + ' by each term of the trinomial, then ' + t(sh.w) + ' by each term. Watch for terms that cancel.'], 'sum of cubes', { vars: [sh.u, sh.w] });
            part.solution += '<br>The four middle terms cancel in pairs.';
            return part;
          } },
          { id: 'e9a2', sub: 'a pattern', level: 'EMG', make: function (r, sh) {
            var u = sh.u, w = sh.w;
            return mc(r, 'What pattern do you notice in (a), ' + t(sh.A) + '?', [
              { html: 'The four middle products cancel in pairs, leaving only two terms: a <b>sum of cubes</b>, ' + t(u + '^{3}+' + w + '^{3}') + '.', right: true },
              { html: 'Nothing cancels: there are six different terms.', why: 'Look again: ' + t('-' + u + '^{2}' + w) + ' and ' + t('+' + u + '^{2}' + w) + ' are like terms and cancel; so do ' + t('+' + u + w + '^{2}') + ' and ' + t('-' + u + w + '^{2}') + '.', code: 'p-none' },
              { html: 'It is a difference of squares, ' + t(u + '^{2}-' + w + '^{2}') + '.', why: 'A binomial (degree 1) times a trinomial (degree 2) has degree ' + t(3) + ': the answer has cubes.', code: 'p-dos' },
              { html: 'The answer is ' + t('(' + u + '+' + w + ')^{3}') + '.', why: t('(' + u + '+' + w + ')^{3}') + ' has four terms with ' + t(3 + u + '^{2}' + w) + ' and ' + t(3 + u + w + '^{2}') + '. Here those terms cancel.', code: 'p-cube' }],
              t('(' + u + '+' + w + ')(' + u + '^{2}-' + u + w + '+' + w + '^{2}) = ' + u + '^{3}-' + u + '^{2}' + w + '+' + u + w + '^{2}+' + u + '^{2}' + w + '-' + u + w + '^{2}+' + w + '^{3}=' + u + '^{3}+' + w + '^{3}') + ': the middle products cancel in pairs, leaving a sum of cubes.',
              ['Which of the six products are like terms with opposite signs?'], 'sum of cubes pattern');
          } },
          { id: 'e9b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var u = M(1, sh.u), w = M(-1, sh.w), Tr = sh.rev ? [MV(1, o2(sh.w, 2)), MV(1, o11(sh.u, sh.w)), MV(1, o2(sh.u, 2))] : [MV(1, o2(sh.u, 2)), MV(1, o11(sh.u, sh.w)), MV(1, o2(sh.w, 2))];
            return comboPart('(b) Expand ', [{ s: 1, p: pBT([u, w], Tr) }], ['Multiply ' + t(sh.u) + ' by each term, then ' + t('-' + sh.w) + ' by each term. Watch the signs.'], 'difference of cubes', { vars: [sh.u, sh.w] });
          } },
          { id: 'e9b2', sub: 'b compare', level: 'EMG', make: function (r, sh) {
            var u = sh.u, w = sh.w;
            return mc(r, 'How does the result of (b), ' + t(sh.B) + ', compare with (a)?', [
              { html: 'Same structure — the middle products cancel again — but the sign of ' + t(w + '^{3}') + ' is reversed: (b) gives the <b>difference of cubes</b> ' + t(u + '^{3}-' + w + '^{3}') + '.', right: true },
              { html: 'It is exactly the same answer as (a).', why: 'The last product is ' + t('(-' + w + ')(' + w + '^{2})=-' + w + '^{3}') + ', so the sign changes.', code: 'c-same' },
              { html: 'In (b) nothing cancels, so there are six terms.', why: 'The middle products cancel in pairs again: ' + t(u + '^{2}' + w) + ' with ' + t('-' + u + '^{2}' + w) + ', ' + t(u + w + '^{2}') + ' with ' + t('-' + u + w + '^{2}') + '.', code: 'c-none' },
              { html: 'Both signs change: (b) is ' + t('-' + u + '^{3}-' + w + '^{3}') + '.', why: 'The first product is ' + t(u + '\\cdot ' + u + '^{2}=+' + u + '^{3}') + ' — it is still positive.', code: 'c-both' }],
              '(a) gives ' + t(u + '^{3}+' + w + '^{3}') + ' and (b) gives ' + t(u + '^{3}-' + w + '^{3}') + ': in both, the four middle products cancel; only the sign of ' + t(w + '^{3}') + ' differs.',
              ['Compare the last product in each: ' + t(w + '\\cdot ' + w + '^{2}') + ' and ' + t('(-' + w + ')\\cdot ' + w + '^{2}') + '.'], 'compare cubes');
          } },
          { id: 'e9c', sub: 'c', level: 'EMG', make: function (r, sh) {
            var k = sh.k, s = sh.sg, v = sh.v, T = S([M(1, v, 3), N(s * k * k * k)]), tex = '(' + v + (s > 0 ? '+' : '-') + k + ')\\left(' + v + '^{2}' + (s > 0 ? '-' : '+') + k + v + '+' + k * k + '\\right)';
            return pp('(c) Use the pattern from (a) and (b) to write the expansion of ' + t(tex) + ' in one step.', T, [
              { is: S([M(1, v, 3), N(s * k * k)]), code: 'not-sq', hint: 'The last term is ' + t(k + '\\cdot ' + k * k + '=' + k + '^{3}') + ', not ' + t(k * k) + '.' },
              { is: S([M(1, v, 3), N(s * 3 * k)]), code: 'value', hint: t(k + '^{3}=' + k + '\\times ' + k + '\\times ' + k) + ', not ' + t('3\\times ' + k) + '.' },
              { is: S([M(1, v, 3), N(-s * k * k * k)]), code: 'sign', hint: 'Look at the sign in the binomial: the last term is ' + t('(' + (s > 0 ? '' : '-') + k + ')(' + k * k + ')') + '.' }],
              'It matches ' + (s > 0 ? t('(a+b)(a^{2}-ab+b^{2})=a^{3}+b^{3}') : t('(a-b)(a^{2}+ab+b^{2})=a^{3}-b^{3}')) + ' with ' + t('a=' + v) + ' and ' + t('b=' + k) + ', so the answer is ' + t(v + '^{3}' + (s > 0 ? '+' : '-') + k + '^{3}=' + tx(T)) + '.',
              ['Match it with the pattern: ' + t('a=' + v) + ', ' + t('b=' + k) + '. Only the cubes are left.'], 'sum/difference of cubes in one step', { vars: [v] });
          } }] },
      /* ---------- Part C ---------- */
      { num: '10', section: 'Part C — Reasoning and Error Analysis', stem: '<b>Degree reasoning.</b> The <b>degree</b> of a polynomial in one variable is the largest exponent on the variable once the expression is fully simplified.',
        shared: function (r) { return pickWhere(function () { return { p: r.int(1, 6), q: r.int(1, 6), w: r.int(2, 9) }; }, function (s) { var R = Y.mul(lin(1, s.p), S([M(1, 'x', 2), M(-s.q, 'x'), N(s.w)])); return Y.count(R) === 4 && s.p !== s.q; }); },
        parts: [
          { id: 'e10a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var Bn = lin(1, sh.p), Tr = S([M(1, 'x', 2), M(-sh.q, 'x'), N(sh.w)]), R = Y.mul(Bn, Tr), ex = '(x+' + sh.p + ')\\left(' + tx(Tr) + '\\right)';
            var fl = [nbox('Degree', { label: 'degree of the product' }), nbox('Products', { label: 'products formed before collecting' }), nbox('Terms', { label: 'terms left after collecting (usually)' })];
            return KP.fields('(a) A binomial of degree ' + t(1) + ' is multiplied by a trinomial of degree ' + t(2) + ', for example ' + t(ex) + '.', fl,
              [K.number(3, numDiag([[2, 'deg-wrong', 'The highest term is ' + t('x\\cdot x^{2}=x^{3}') + ': exponents <b>add</b> when you multiply.'], [1, 'deg-wrong', 'The highest term is ' + t('x\\cdot x^{2}=x^{3}') + '.']])),
                K.number(6, numDiag([[5, 'value', 'Each of the ' + t(2) + ' terms multiplies each of the ' + t(3) + ' terms: ' + t('2\\times 3') + '.'], [4, 'foil-only', 'That is FOIL for two binomials. Here each of ' + t(2) + ' terms meets each of ' + t(3) + ' terms.']])),
                K.number(4, numDiag([[6, 'cancel-missed', 'Like terms collect: the two ' + t('x^{2}') + '-terms and the two ' + t('x') + '-terms each combine.'], [3, 'value', 'Count the terms of ' + t(tx(R)) + '.']]))],
              ['3', '6', '4'], 'degree ' + t(3) + ', ' + t(6) + ' products, ' + t(4) + ' terms',
              t(ex + '=' + seq(termsOf(Y.mul(M(1, 'x'), Tr)).concat(termsOf(Y.mul(N(sh.p), Tr)))) + '=' + tx(R)) + '<br>Degree ' + t('1+2=3') + ' (from ' + t('x\\cdot x^{2}') + '); ' + t('2\\times 3=6') + ' products; the ' + t('x^{2}') + '-terms and the ' + t('x') + '-terms collect, leaving ' + t(4) + ' terms.',
              ['Multiply the highest terms to find the degree. Each term of the binomial meets each term of the trinomial once.'], 'degree and count of products');
          } },
          { id: 'e10b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var Tr = S([M(1, 'x', 2), M(-sh.q, 'x'), N(sh.w)]), sum = Y.add(lin(1, sh.p), Tr);
            return mc(r, '(b) What is the degree of the <b>sum</b> ' + t('(x+' + sh.p + ')+\\left(' + tx(Tr) + '\\right)') + ', and why do adding and multiplying affect the degree so differently?', [
              { html: 'Degree ' + t(2) + ': adding only combines like terms, so it can’t make a higher power — the sum keeps the larger degree. Multiplying <b>adds</b> exponents, so the product has degree ' + t('1+2=3') + '.', right: true },
              { html: 'Degree ' + t(3) + ': degrees add, whether you add or multiply.', why: 'Add them: ' + t(tx(sum)) + '. The highest power is still ' + t('x^{2}') + '.', code: 'b-3' },
              { html: 'Degree ' + t(1) + ': the sum has the degree of the smaller polynomial.', why: 'The ' + t('x^{2}') + '-term of the trinomial is still there in the sum: ' + t(tx(sum)) + '.', code: 'b-1' },
              { html: 'Degree ' + t(2) + ', because when you add, the degrees multiply: ' + t('1\\times 2=2') + '.', why: 'The answer ' + t(2) + ' is right, but not the reason: adding never multiplies degrees. It just keeps the highest power present.', code: 'b-2why' }],
              t('(x+' + sh.p + ')+\\left(' + tx(Tr) + '\\right)=' + tx(sum)) + ' has degree ' + t(2) + '. Adding combines like terms (same exponent), so no new power appears. Multiplying adds exponents, ' + t('x\\cdot x^{2}=x^{3}') + ', so the product has degree ' + t(3) + '.',
              ['Add the two polynomials. What is the highest power of ' + t('x') + '?'], 'degree of a sum');
          } },
          { id: 'e10c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var K0 = r.int(2, 12), v = r.pick(LETTERS1), a = r.int(1, 5), c1 = nz(r, -9, 9); if (c1 === K0) c1++;
            if (r.chance(0.12)) { K0 = 8; v = 'x'; a = 1; c1 = 3; }
            var A = lin(a, c1, v), B = lin(-a, K0 - c1, v);
            var chk = function (resp) {
              resp = resp || [];
              var P1 = readPoly(resp[0] == null ? '' : resp[0]); if (P1.res) return lab(P1.res, 'First binomial');
              var P2 = readPoly(resp[1] == null ? '' : resp[1]); if (P2.res) return lab(P2.res, 'Second binomial');
              if (P1.fi) return lab(form(P1.fi.code, P1.fi.msg || 'Write it simplified.'), 'First binomial');
              if (P2.fi) return lab(form(P2.fi.code, P2.fi.msg || 'Write it simplified.'), 'Second binomial');
              var isLin = function (p) { return Y.count(p) === 2 && Y.degree(p) === 1 && Y.vars(p).length === 1 && Y.vars(p)[0] === v; };
              if (!isLin(P1.p)) return wrong('u3l7-ex-degree', '<b>First binomial:</b> it must be a binomial of degree ' + t(1) + ' in ' + t(v) + ' — one ' + t(v) + '-term and one number, like ' + t('3' + v + '-2') + '.');
              if (!isLin(P2.p)) return wrong('u3l7-ex-degree', '<b>Second binomial:</b> it must be a binomial of degree ' + t(1) + ' in ' + t(v) + ' — one ' + t(v) + '-term and one number, like ' + t('3' + v + '-2') + '.');
              var Sm = Y.add(P1.p, P2.p);
              if (Y.isZero(Sm)) return wrong('u3l7-ex-zero', 'Their sum is ' + t(0) + '. Keep the ' + t(v) + '-terms opposite, but choose numbers that add to ' + t(K0) + '.');
              if (Y.degree(Sm) >= 1) return wrong('u3l7-ex-sum', 'Their sum is ' + t(tx(Sm)) + ', which still has degree ' + t(1) + '. Make the ' + t(v) + '-terms <b>opposites</b> so they cancel.');
              if (!Y.eq(Sm, N(K0))) return wrong('value', 'Good — the ' + t(v) + '-terms cancel, so the sum has degree ' + t(0) + '. But it is ' + t(tx(Sm)) + ', not ' + t(K0) + ': adjust the numbers.');
              return ok();
            };
            var p = KP.fields('(c) Can the sum of two binomials of degree ' + t(1) + ' have a degree <b>lower</b> than ' + t(1) + '? Show it: give two binomials of degree ' + t(1) + ' in ' + t(v) + ' whose sum is the number ' + t(K0) + '.', [pbox('First binomial', [v]), pbox('Second binomial', [v])], [], [tx(A), tx(B)], t(tx(A)) + ' and ' + t(tx(B)) + ' (answers vary)',
              'Yes — if the ' + t(v) + '-terms are opposites, they cancel. For example ' + t('(' + tx(A) + ')+(' + tx(B) + ')=' + K0) + ', a number, which has degree ' + t(0) + '.',
              ['What happens when you add ' + t('3' + v) + ' and ' + t('-3' + v) + '? Then choose the two numbers so they add to ' + t(K0) + '.'], 'example: sum of degree 0');
            p.check = chk; p.good = [[v + '+' + (K0 + 1), '-1-' + v], [tx(lin(5, K0 + 3, v)), tx(lin(-5, -3, v))]];
            p.bad = [[v + '+3', v + '+5'], [v + '+3', '-' + v + '-3'], [v + '^2+3', '-' + v + '^2+' + (K0 - 3)], [v + '+1', '-' + v + '+' + (K0 + 1)]];
            return p;
          } }] },
      { num: '11', stem: function (sh) { return '<b>Error analysis.</b> Priya simplified the expression below. Exactly <b>one</b> step contains an error.' + workTable(['Step', 'Priya’s work'], [['1', '2', '3', '4'], [sh.expr, sh.step2, sh.step3, tx(sh.wrongRes)]]); },
        shared: function (r) { return priya(r); },
        parts: [
          { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, sh) {
            return mc(r, '(a) Which is the first step that is wrong?', [
              { html: 'Step 2', why: 'Check it: ' + t(sh.a + 'x(x+' + sh.b + ')=' + tx(sh.A)) + ' and ' + t('(x-' + sh.c + ')(x+' + sh.d + ')=' + tx(sh.prod)) + ' — Step 2 is right, and the bracket is kept.', code: 'step2' },
              { html: 'Step 3', right: true },
              { html: 'Step 4', why: 'Step 4 collects the terms of Step 3 correctly. The error is earlier.', code: 'step4' },
              { html: 'No step is wrong.', why: 'Substitute ' + t('x=' + sh.x0) + ': the original gives ' + t(sh.val) + ' but Step 4 gives ' + t(sh.wVal) + '.', code: 'step0' }],
              'Step 3 removes the bracket after a minus sign but changes only the sign of ' + t('x^{2}') + '.', ['Check each step against the one before it. Look closely where a bracket is removed.'], 'Priya: which step', true);
          } },
          { id: 'e11b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var pr = sh.prod, d = sh.d - sh.c, cd = sh.c * sh.d;
            return mc(r, '(b) Describe the error.', [
              { html: 'The minus sign in front of the bracket must change the sign of <b>all three</b> terms. Priya changed only ' + t('x^{2}') + ': she should have written ' + t('-' + (d === 1 ? '' : d) + 'x+' + cd) + ', not ' + t('+' + (d === 1 ? '' : d) + 'x-' + cd) + '.', right: true },
              { html: 'She multiplied ' + t('(x-' + sh.c + ')(x+' + sh.d + ')') + ' incorrectly.', why: t('(x-' + sh.c + ')(x+' + sh.d + ')=' + tx(pr)) + ' — that product is right.', code: 'e-foil' },
              { html: 'She should have added the bracket instead of subtracting it.', why: 'The expression subtracts the product. The mistake is how she removed the bracket.', code: 'e-add' },
              { html: 'She collected the ' + t('x') + '-terms incorrectly in the last step.', why: 'Step 4 adds the terms of Step 3 correctly. The problem is in Step 3 itself.', code: 'e-collect' }],
              t('-\\left(' + tx(pr) + '\\right)=' + tx(Y.neg(pr))) + ': every sign changes. Priya wrote ' + t(seq([M(-1, 'x', 2), M(d, 'x'), N(-cd)])) + '.',
              ['What does a minus sign in front of a bracket do to each term inside?'], 'Priya: describe the error');
          } },
          { id: 'e11c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var c = combo(sh.list);
            return pp('(c) Give the correct simplified expression for ' + t(sh.expr) + '.', c.T, c.wr.concat([{ is: sh.wrongRes, code: 'sub-first', hint: 'That is Priya’s answer. Change the sign of <b>every</b> term in the subtracted bracket.' }]), c.sol, HCOMBO, 'Priya corrected');
          } },
          { id: 'e11d', sub: 'd', level: 'BEG', make: function (r, sh) {
            var x0 = sh.x0, fl = [nbox('Original', { label: 'value of the original expression' }), nbox('Simplified', { label: 'value of your simplified expression' })];
            var p = KP.fields('(d) Verify your answer by substituting ' + t('x=' + x0) + ' into both the original expression and your simplified expression.', fl,
              [K.number(sh.val), K.number(sh.val, numDiagClean(sh.val, [[sh.wVal, 'u3l7-sub-val', 'That is the value of Priya’s answer. Substitute into your corrected expression.']]))], [String(sh.val), String(sh.val)], 'both ' + t(sh.val),
              'Original: ' + t(sh.a + '(' + x0 + ')(' + x0 + '+' + sh.b + ')-(' + x0 + '-' + sh.c + ')(' + x0 + '+' + sh.d + ')=' + sh.a * x0 * (x0 + sh.b) + '-(0)(' + (x0 + sh.d) + ')=' + sh.val) + '.<br>Simplified: ' + t(valuesTex(sh.correct, x0) + '=' + sh.val) + ' ✓ (Priya’s answer gives ' + t(sh.wVal) + '.)',
              ['Replace every ' + t('x') + ' with ' + t(x0) + '. Brackets first.'], 'verify Priya');
            p.bad = [[String(sh.val), String(sh.wVal)]]; return p;
          } }] },
      { num: '12', stem: 'Simplify each expression, then <b>check your answer</b> by substituting ' + t('x=-1') + ' into both the original expression and your simplified version. Both must give the same value.',
        shared: function (r) {
          var A = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5), c: r.int(1, 3), d: r.int(2, 7) }; }, function (s) { return s.a !== 1 && -s.a * s.b - (s.d - s.c) !== 0 && s.c !== s.d; });
          var B = pickWhere(function () { return { p: r.int(2, 4), q: r.int(1, 5), rr: r.int(1, 3) }; }, function (s) { return s.p * s.rr !== 2 * s.q && gcd(s.p, s.q) === 1; });
          if (r.chance(0.12)) { A = { a: 2, b: 3, c: 1, d: 6 }; B = { p: 3, q: 2, rr: 1 }; }
          return { A: A, B: B };
        },
        parts: [
          { id: 'e12a', sub: 'a', level: 'PRG', make: function (r, sh) { var s = sh.A; return comboPart('(a) Simplify ', [{ s: 1, p: pMono(M(s.a, 'x'), [M(1, 'x'), N(-s.b)]) }, { s: -1, p: pFoil(M(1, 'x'), N(-s.c), M(1, 'x'), N(s.d)) }], null, 'ax(x−b)−(x−c)(x+d)'); } },
          { id: 'e12a2', sub: 'a check', level: 'BEG', make: function (r, sh) {
            var s = sh.A, c = combo([{ s: 1, p: pMono(M(s.a, 'x'), [M(1, 'x'), N(-s.b)]) }, { s: -1, p: pFoil(M(1, 'x'), N(-s.c), M(1, 'x'), N(s.d)) }]), v = at(c.T, -1), w1 = at(c.wr.filter(function (w) { return w.code === 'sub-first'; })[0].is, -1);
            var p = KP.number('Check (a): substitute ' + t('x=-1') + ' into ' + t(c.tex) + ' and into your simplified expression. What value do both give?', v, numDiagClean(v, [[w1, 'u3l7-sub-val', 'That value comes from changing only the first sign of the subtracted product. Check your simplified expression.'], [s.a * (1 + s.b) - (1 + s.c) * (s.d - 1), 'sign', 'Watch the signs: ' + t('(-1-' + s.c + ')(-1+' + s.d + ')=(' + (-1 - s.c) + ')(' + (s.d - 1) + ')=' + (-1 - s.c) * (s.d - 1)) + ', and you subtract it.']]),
              'Original: ' + t(s.a + '(-1)(-1-' + s.b + ')-(-1-' + s.c + ')(-1+' + s.d + ')=' + s.a * (1 + s.b) + '-(' + (-(1 + s.c) * (s.d - 1)) + ')=' + v) + '.<br>Simplified: ' + t(valuesTex(c.T, -1) + '=' + v) + ' ✓',
              ['Replace every ' + t('x') + ' with ' + t('(-1)') + '. Work out each bracket first.'], 'check at x = −1');
            p.bad = [String(w1)]; return p;
          } },
          { id: 'e12b', sub: 'b', level: 'PRG', make: function (r, sh) { var s = sh.B; return comboPart('(b) Simplify ', [{ s: 1, p: pSq(M(s.p, 'x'), N(-s.q)) }, { s: 1, p: pMono(M(-s.p * s.p, 'x'), [M(1, 'x'), N(-s.rr)]) }], null, '(px−q)²−p²x(x−r)'); } },
          { id: 'e12b2', sub: 'b check', level: 'BEG', make: function (r, sh) {
            var s = sh.B, c = combo([{ s: 1, p: pSq(M(s.p, 'x'), N(-s.q)) }, { s: 1, p: pMono(M(-s.p * s.p, 'x'), [M(1, 'x'), N(-s.rr)]) }]), v = at(c.T, -1);
            var p = KP.number('Check (b): substitute ' + t('x=-1') + ' into ' + t(c.tex) + ' and into your simplified expression. What value do both give?', v, numDiagClean(v, [[(s.p + s.q) * (s.p + s.q), 'value', 'Include the second product: ' + t('-' + s.p * s.p + '(-1)(-1-' + s.rr + ')') + '.'], [s.p * s.p + s.q * s.q - s.p * s.p * (1 + s.rr), 'sq-no-middle', 'Square the whole bracket: ' + t('(' + s.p + '(-1)-' + s.q + ')^{2}=(' + (-s.p - s.q) + ')^{2}') + '.']]),
              'Original: ' + t('(' + s.p + '(-1)-' + s.q + ')^{2}-' + s.p * s.p + '(-1)(-1-' + s.rr + ')=(' + (-s.p - s.q) + ')^{2}-' + s.p * s.p * (1 + s.rr) + '=' + v) + '.<br>Simplified: ' + t(valuesTex(c.T, -1) + '=' + v) + ' ✓',
              ['Replace every ' + t('x') + ' with ' + t('(-1)') + '. Work out the bracket, then square it.'], 'check at x = −1');
            p.bad = [String((s.p + s.q) * (s.p + s.q))]; return p;
          } }] },
      { num: '13', stem: function (sh) { return 'A very common error is to write ' + t('(' + sh.v + '+' + sh.k + ')^{2}=' + sh.v + '^{2}+' + sh.k * sh.k) + '.'; },
        shared: function (r) { var k = r.int(2, 9), m = r.int(2, 9), v = r.pick(LETTERS1); if (r.chance(0.12)) { k = 4; m = 3; v = 'x'; } return { k: k, m: m, v: v }; },
        parts: [
          { id: 'e13a', sub: 'a expand', level: 'BEG', make: function (r, sh) { var k = sh.k, v = sh.v, P = pSq(M(1, v), N(k)); return pp('(a) Expand ' + t(P.tex) + ' correctly.', P.val, combo([{ s: 1, p: P }]).wr, P.sol + '<br>' + t('(' + v + '+' + k + ')(' + v + '+' + k + ')=' + v + '^{2}+' + k + v + '+' + k + v + '+' + k * k), ['Write it as ' + t('(' + v + '+' + k + ')(' + v + '+' + k + ')') + ' and use FOIL.'], 'expand (x+k)²'); } },
          { id: 'e13a2', sub: 'a why', level: 'EMG', make: function (r, sh) {
            var k = sh.k, v = sh.v, B = '(' + v + '+' + k + ')';
            return mc(r, 'What does squaring ' + t(B) + ' actually do to the two terms?', [
              { html: 'It multiplies the whole bracket by itself, ' + t(B + B) + ', which makes two middle products ' + t(k + v) + ' and ' + t(k + v) + ' — you can’t square the terms separately.', right: true },
              { html: 'It squares each term separately, so the error is only in the arithmetic.', why: 'Test ' + t(v + '=1') + ': ' + t('(1+' + k + ')^{2}=' + (1 + k) * (1 + k)) + ' but ' + t('1+' + k * k + '=' + (1 + k * k)) + '. Squaring each term misses the middle products.', code: 'w-each' },
              { html: 'It doubles each term: ' + t('2' + v + '+' + 2 * k) + '.', why: 'Squaring is multiplying by itself, not by ' + t(2) + '.', code: 'w-double' },
              { html: 'It squares the ' + t(v) + ' only; the ' + t(k) + ' stays as it is.', why: 'The whole bracket is squared: every term meets every term.', code: 'w-xonly' }],
              t(B + '^{2}=' + B + B + '=' + v + '^{2}+' + k + v + '+' + k + v + '+' + k * k + '=' + v + '^{2}+' + 2 * k + v + '+' + k * k) + '. The two middle products make the term ' + t(2 * k + v) + ' that the error leaves out.',
              ['Write the square as a product of two brackets and FOIL it.'], 'what squaring does');
          } },
          { id: 'e13b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var k = sh.k, v = sh.v;
            var p = KP.number('(b) Find every value of ' + t(v) + ' for which ' + t('(' + v + '+' + k + ')^{2}=' + v + '^{2}+' + k * k) + ' is actually true.', 0, numDiag([[k, 'value', 'Substitute it: ' + t('(' + k + '+' + k + ')^{2}=' + 4 * k * k) + ' but ' + t(k + '^{2}+' + k * k + '=' + 2 * k * k) + '. Expand the left side and solve.'], [-k, 'value', 'Substitute it: ' + t('(' + -k + '+' + k + ')^{2}=0') + ' but ' + t('(' + -k + ')^{2}+' + k * k + '=' + 2 * k * k) + '. Expand the left side and solve.'], [2 * k, 'value', 'Expand: ' + t(v + '^{2}+' + 2 * k + v + '+' + k * k + '=' + v + '^{2}+' + k * k) + '. What is left?']]),
              t(v + '^{2}+' + 2 * k + v + '+' + k * k + '=' + v + '^{2}+' + k * k) + '<br>Subtract ' + t(v + '^{2}') + ' and ' + t(k * k) + ' from both sides: ' + t(2 * k + v + '=0') + ', so ' + t(v + '=0') + '. It is true <b>only</b> for ' + t(v + '=0') + '.',
              ['Expand the left side, then subtract ' + t(v + '^{2}+' + k * k) + ' from both sides.'], 'when is (x+k)² = x²+k²', { before: t(v + '=') });
            p.bad = [String(k), String(-k)]; return p;
          } },
          { id: 'e13c', sub: 'c', level: 'EMG', make: function (r, sh) {
            var m = sh.m, v = sh.v;
            return mc(r, '(c) By contrast, is there any value of ' + t(v) + ' for which ' + t('(' + v + '+' + m + ')(' + v + '-' + m + ')=' + v + '^{2}-' + m * m) + ' is false?', [
              { html: 'No. ' + t('(' + v + '+' + m + ')(' + v + '-' + m + ')') + ' expands to <b>exactly</b> ' + t(v + '^{2}-' + m * m) + ', so the two sides agree for every value of ' + t(v) + ' — it is an identity.', right: true },
              { html: 'Yes, it is false for ' + t(v + '=0') + '.', why: 'At ' + t(v + '=0') + ': ' + t('(' + m + ')(-' + m + ')=-' + m * m) + ' and ' + t('0-' + m * m + '=-' + m * m) + ' — true.', code: 'c-zero' },
              { html: 'Yes, it is false whenever ' + t(v) + ' is negative.', why: 'Try ' + t(v + '=-1') + ': ' + t('(' + (m - 1) + ')(' + (-1 - m) + ')=' + (m - 1) * (-1 - m)) + ' and ' + t('1-' + m * m + '=' + (1 - m * m)) + ' — true.', code: 'c-neg' },
              { html: 'Yes, like the error in (a), it is true for only one value of ' + t(v) + '.', why: 'Expand the left side: the middle terms cancel and you get ' + t(v + '^{2}-' + m * m) + ' exactly.', code: 'c-one' }],
              t('(' + v + '+' + m + ')(' + v + '-' + m + ')=' + v + '^{2}-' + m + v + '+' + m + v + '-' + m * m + '=' + v + '^{2}-' + m * m) + ' for every ' + t(v) + ': an identity, not an equation to solve.',
              ['Expand the left side. Does it match the right side exactly?'], 'identity');
          } }] },
      /* ---------- Part D ---------- */
      { num: '14', section: 'Part D — Working Backwards and Solving', stem: 'Each rectangle below has a known area and one known side. Work backwards to find the missing side, then check by multiplying.',
        shared: function (r) {
          var A = pickWhere(function () { return { a: r.int(2, 3), b: r.int(1, 5), c: r.int(2, 4), d: r.int(1, 5) }; }, function (s) { return s.b * s.c - s.a * s.d !== 0 && gcd(s.a, s.b) === 1 && gcd(s.c, s.d) === 1 && s.a !== s.c; });
          var p = r.int(2, 9), q = pickWhere(function () { return r.int(1, 8); }, function (v) { return v !== p; });
          if (r.chance(0.12)) { A = { a: 2, b: 3, c: 3, d: 1 }; p = 6; q = 5; }
          return { A: A, p: p, q: q };
        },
        parts: [
          { id: 'e14a', sub: 'a', level: 'ADV', make: function (r, sh) {
            var s = sh.A, Wd = lin(s.a, s.b), Ln = lin(s.c, -s.d), Ar = Y.mul(Wd, Ln);
            var p = KP.math('(a) The area is ' + t(tx(Ar)) + ' and the width is ' + t('(' + tx(Wd) + ')') + '. Determine the length.', factorCheck(Wd, Ln, Ar), tx(Ln),
              'Length × ' + t('(' + tx(Wd) + ')') + ' must give ' + t(tx(Ar)) + '.<br>First terms: ' + t(s.a + 'x\\times ? =' + s.a * s.c + 'x^{2}') + ', so ' + t('?=' + s.c + 'x') + '. Last terms: ' + t(s.b + '\\times ? =' + (-s.b * s.d)) + ', so ' + t('?=' + (-s.d)) + '.<br>Length ' + t('=' + tx(Ln)) + '. Check: ' + t('(' + tx(Wd) + ')(' + tx(Ln) + ')=' + seq([M(s.a * s.c, 'x', 2), M(-s.a * s.d, 'x'), M(s.b * s.c, 'x'), N(-s.b * s.d)]) + '=' + tx(Ar)) + ' ✓',
              ['Length × width = area. What times ' + t(s.a + 'x') + ' gives ' + t(s.a * s.c + 'x^{2}') + '? What times ' + t(s.b) + ' gives ' + t(-s.b * s.d) + '?', 'Then multiply to check the middle term.'], 'missing length', { keys: 'poly', vars: ['x'] });
            p.bad = [tx(Y.neg(Ln)), tx(lin(s.c, s.d))]; return p;
          } },
          { id: 'e14b', sub: 'b width', level: 'PRG', make: function (r, sh) {
            var Ln = lin(1, sh.p), Wd = lin(1, sh.q), Ar = Y.mul(Ln, Wd);
            var p = KP.math('(b) The area is ' + t(tx(Ar)) + ' and the length is ' + t('(' + tx(Ln) + ')') + '. Determine the width.', factorCheck(Ln, Wd, Ar), tx(Wd),
              'Two numbers multiply to ' + t(sh.p * sh.q) + ': one is ' + t(sh.p) + ', so the other is ' + t(sh.q) + '. Width ' + t('=' + tx(Wd)) + '. Check: ' + t('(' + tx(Ln) + ')(' + tx(Wd) + ')=x^{2}+' + sh.q + 'x+' + sh.p + 'x+' + sh.p * sh.q + '=' + tx(Ar)) + ' ✓',
              ['Width = ' + t('(x+?)') + ', where ' + t(sh.p + '\\times ?=' + sh.p * sh.q) + '. Check the middle term by multiplying.'], 'missing width', { keys: 'poly', vars: ['x'] });
            p.bad = [tx(lin(1, sh.p * sh.q)), tx(lin(1, -sh.q))]; return p;
          } },
          { id: 'e14c', sub: 'b perimeter', level: 'PRG', make: function (r, sh) {
            var Ln = lin(1, sh.p), Wd = lin(1, sh.q), Pm = lin(4, 2 * (sh.p + sh.q));
            return pp('Write a simplified expression for the perimeter of the rectangle in (b) (area ' + t(tx(Y.mul(Ln, Wd))) + ', length ' + t('(' + tx(Ln) + ')') + ').', Pm, [
              { is: lin(2, sh.p + sh.q), code: 'dims-perim', hint: 'That is one length plus one width — half the perimeter. A rectangle has <b>two</b> lengths and <b>two</b> widths.' },
              { is: Y.mul(Ln, Wd), code: 'perim-area', hint: 'That is the area. The perimeter is the distance around: ' + t('2l+2w') + '.' },
              { is: lin(4, sh.p + sh.q), code: 'k-first', hint: 'Double the numbers too: ' + t('2(x+' + sh.p + ')=2x+' + 2 * sh.p) + '.' }],
              t('P=2(x+' + sh.p + ')+2(x+' + sh.q + ')=2x+' + 2 * sh.p + '+2x+' + 2 * sh.q + '=' + tx(Pm)),
              ['Perimeter ' + t('=2(\\text{length})+2(\\text{width})') + '. Use the width from (b).'], 'perimeter');
          } }] },
      { num: '15', stem: 'Find the missing numbers. In each case, expand the left side first and match it to the right side term by term.', parts: [
        { id: 'e15a', sub: 'a', level: 'MAS', make: function (r) {
          var s = pickWhere(function () { return { a: r.int(1, 7), b: -r.int(1, 9) }; }, function (s) { return s.a + s.b !== 0 && s.a * s.b !== s.a + s.b; });
          if (r.chance(0.12)) s = { a: 3, b: -5 };
          var a = s.a, b = s.b, T = S([M(1, 'x', 2), M(a + b, 'x'), N(a * b)]), fl = [nbox('a', { label: t('a') }), nbox('b', { label: t('b') })];
          var chk = function (resp) {
            resp = resp || [];
            var A = HW.parse.number(resp[0] == null ? '' : resp[0]), Bv = HW.parse.number(resp[1] == null ? '' : resp[1]);
            if (!A.ok || !Bv.ok) return form('empty', 'Type a number in each box.');
            var u = A.value, v = Bv.value;
            if ((u === a && v === b) || (u === b && v === a)) return ok();
            if ((u === -a && v === -b) || (u === -b && v === -a)) return wrong('u3l7-pair-sign', 'Expand ' + t('(x' + sgn(u) + ')(x' + sgn(v) + ')') + ': the middle term is ' + t(tx(M(u + v, 'x'))) + ', not ' + t(tx(M(a + b, 'x'))) + '. Switch both signs.');
            if (u * v === a * b) return wrong('u3l7-pair-product', 'Their product is ' + t(a * b) + ' ✓, but they must also <b>add</b> to ' + t(a + b) + ' (the ' + t('x') + '-coefficient).');
            if (u + v === a + b) return wrong('value', 'They add to ' + t(a + b) + ' ✓, but they must also <b>multiply</b> to ' + t(a * b) + '.');
            return wrong('value', t('(x+a)(x+b)=x^{2}+(a+b)x+ab') + ', so ' + t('a+b=' + (a + b)) + ' and ' + t('ab=' + a * b) + '.');
          };
          var p = KP.fields('(a) Find ' + t('a') + ' and ' + t('b') + ' so that ' + t('(x+a)(x+b)=' + tx(T)) + '.', fl, [], [String(a), String(b)], t('a=' + a) + ' and ' + t('b=' + b) + ' (in either order)',
            t('(x+a)(x+b)=x^{2}+(a+b)x+ab') + '. Match: ' + t('a+b=' + (a + b)) + ' and ' + t('ab=' + a * b) + '.<br>The numbers ' + t(a) + ' and ' + t(b) + ' work: ' + t(a + '+(' + b + ')=' + (a + b)) + ' and ' + t(a + '\\times(' + b + ')=' + a * b) + '. Check: ' + t('(x+' + a + ')(x' + sgn(b) + ')=' + tx(T)) + ' ✓',
            ['Expand ' + t('(x+a)(x+b)') + ': the ' + t('x') + '-coefficient is ' + t('a+b') + ' and the constant is ' + t('ab') + '.', 'List the pairs of numbers that multiply to ' + t(a * b) + ', and find the pair that adds to ' + t(a + b) + '.'], 'find a and b');
          p.check = chk; p.good = [[String(b), String(a)]]; p.bad = [[String(-a), String(-b)], [String(a), String(-b)]].filter(function (x) { return !((+x[0] === a && +x[1] === b) || (+x[0] === b && +x[1] === a)); });
          return p;
        } },
        { id: 'e15b', sub: 'b', level: 'PRG', make: function (r) {
          var pk = pickWhere(function () { return [r.int(2, 4), r.int(1, 7)]; }, function (q) { return gcd(q[0], q[1]) === 1; }), p0 = pk[0], k = pk[1] * (r.chance(0.25) ? -1 : 1); if (r.chance(0.12)) { p0 = 2; k = 5; }
          var T = Y.pow(lin(p0, k), 2);
          var p = KP.number('(b) Find ' + t('k') + ' so that ' + t('(' + p0 + 'x+k)^{2}=' + tx(T)) + '.', k, numDiagClean(k, [[2 * p0 * k, 'cs-half', 'That is the middle coefficient. The middle term is ' + t('2(' + p0 + 'x)(k)=' + 2 * p0 + 'kx') + ', so divide by ' + t(2 * p0) + '.'], [k * k, 'not-sq', 'That is the last term, ' + t('k^{2}') + '. Take its square root.'], [-k, 'sign', 'Check the sign with the middle term: ' + t(2 * p0 + 'k=' + 2 * p0 * k) + '.'], [p0 * k, 'cs-half', 'The middle term is <b>twice</b> ' + t(p0 + 'x\\cdot k') + ': ' + t(2 * p0 + 'k=' + 2 * p0 * k) + '.']]),
            t('(' + p0 + 'x+k)^{2}=' + p0 * p0 + 'x^{2}+' + 2 * p0 + 'kx+k^{2}') + '. Match the middle terms: ' + t(2 * p0 + 'k=' + 2 * p0 * k) + ', so ' + t('k=' + k) + '. Check the last term: ' + t('(' + k + ')^{2}=' + k * k) + ' ✓',
            ['Expand the left side and match the middle terms (the last term alone can’t tell you the sign of ' + t('k') + ').'], 'find k in (px+k)²', { before: t('k=') });
          p.bad = [String(2 * p0 * k), String(k * k), String(-k)].filter(function (x) { return +x !== k; }); return p;
        } },
        { id: 'e15c', sub: 'c', level: 'PRG', make: function (r) {
          var p0 = r.int(2, 5), m = r.int(2, 9); if (p0 === m) m++; if (r.chance(0.12)) { p0 = 3; m = 8; }
          var chk = function (resp) {
            var q = HW.parse.number(resp); if (!q.ok) return form('empty', 'Type a number.');
            if (Math.abs(q.value) === m) return ok();
            if (Math.abs(q.value) === m * m) return wrong('not-sq', t('m^{2}=' + m * m) + ', so ' + t('m') + ' is its square root.');
            if (Math.abs(q.value) === p0 * p0 * m || Math.abs(q.value) === p0 * m) return wrong('value', t('(' + p0 + 'x+m)(' + p0 + 'x-m)=' + p0 * p0 + 'x^{2}-m^{2}') + ': match ' + t('m^{2}=' + m * m) + '.');
            return wrong('value', 'Expand: ' + t('(' + p0 + 'x+m)(' + p0 + 'x-m)=' + p0 * p0 + 'x^{2}-m^{2}') + '. What squared gives ' + t(m * m) + '?');
          };
          var p = KP.math('(c) Find ' + t('m') + ' so that ' + t('(' + p0 + 'x+m)(' + p0 + 'x-m)=' + p0 * p0 + 'x^{2}-' + m * m) + '.', chk, String(m),
            t('(' + p0 + 'x+m)(' + p0 + 'x-m)=' + p0 * p0 + 'x^{2}-m^{2}') + ', so ' + t('m^{2}=' + m * m) + ' and ' + t('m=' + m) + ' (or ' + t('m=-' + m) + ': both give ' + t(p0 * p0 + 'x^{2}-' + m * m) + ').',
            ['A sum times a difference: ' + t('(a+b)(a-b)=a^{2}-b^{2}') + '. What squared gives ' + t(m * m) + '?'], 'find m in sum × difference', { keys: 'expr', before: t('m=') });
          p.input.type = 'number'; delete p.input.keys; p.good = [String(-m)]; p.bad = [String(m * m)]; return p;
        } }] },
      { num: '16', stem: 'Solve each equation. Expand <b>both</b> sides first — the ' + t('x^{2}') + ' terms will disappear, leaving a linear equation.',
        shared: function (r) {
          var A = pickWhere(function () { return { p: r.int(1, 7), q: r.int(1, 7), u: r.int(1, 6), w: r.int(1, 6) }; }, function (s) { var den = (s.p - s.q) - (s.u + s.w), num = s.u * s.w + s.p * s.q; return den !== 0 && num % den === 0 && num / den !== 0 && Math.abs(num / den) <= 20 && s.u !== s.w; });
          var B = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 6), c: r.int(1, 5), d: r.int(1, 6) }; }, function (s) { var den = s.a * s.b - s.a * s.d + s.c; return den !== 0 && (s.c * s.d) % den === 0 && s.c * s.d / den !== 0 && Math.abs(s.c * s.d / den) <= 20; });
          var C = pickWhere(function () { return { p: r.int(1, 8), q: r.int(2, 12) }; }, function (s) { return s.p < s.q && (s.p + s.q) % 2 === 0; });
          if (r.chance(0.12)) { A = { p: 5, q: 2, u: 1, w: 3 }; B = { a: 2, b: 3, c: 1, d: 4 }; C = { p: 2, q: 6 }; }
          return { A: A, B: B, C: C };
        },
        parts: [
          { id: 'e16a', sub: 'a', level: 'ADV', make: function (r, sh) {
            var s = sh.A, L = Y.mul(lin(1, s.p), lin(1, -s.q)), R = Y.mul(lin(1, s.u), lin(1, s.w)), den = (s.p - s.q) - (s.u + s.w), x = (s.u * s.w + s.p * s.q) / den;
            var p = KP.number('(a) Solve ' + t('(x+' + s.p + ')(x-' + s.q + ')=(x+' + s.u + ')(x+' + s.w + ')') + '.', x, numDiagClean(x, [[-x, 'u3l7-solve-sign', 'Check the sign in your last step. Substitute your answer into both sides.'], [(s.u * s.w - s.p * s.q) / den, 'last-sign', 'Check the constant on the left: ' + t('(' + s.p + ')(-' + s.q + ')=-' + s.p * s.q) + '.']]),
              'Left: ' + t(tx(L)) + '. Right: ' + t(tx(R)) + '.<br>' + t(tx(L) + '=' + tx(R)) + '<br>Subtract ' + t('x^{2}') + ' from both sides: ' + t(tx(Y.sub(L, M(1, 'x', 2))) + '=' + tx(Y.sub(R, M(1, 'x', 2)))) + '<br>' + t(tx(M(den, 'x')) + '=' + (s.u * s.w + s.p * s.q)) + ', so ' + t('x=' + x) + '.',
              ['FOIL both sides. The ' + t('x^{2}') + ' terms cancel; collect the ' + t('x') + '-terms on one side and the numbers on the other.'], 'solve after expanding', { before: t('x=') });
            p.bad = [String(-x)]; return p;
          } },
          { id: 'e16b', sub: 'b', level: 'ADV', make: function (r, sh) {
            var s = sh.B, L = Y.mul(M(s.a, 'x'), lin(1, s.b)), R = Y.mul(lin(s.a, -s.c), lin(1, s.d)), den = s.a * s.b - s.a * s.d + s.c, x = -s.c * s.d / den;
            var p = KP.number('(b) Solve ' + t(s.a + 'x(x+' + s.b + ')=(' + s.a + 'x-' + s.c + ')(x+' + s.d + ')') + '.', x, numDiagClean(x, [[-x, 'u3l7-solve-sign', 'Check the sign in your last step. Substitute your answer into both sides.']]),
              'Left: ' + t(tx(L)) + '. Right: ' + t(tx(R)) + '.<br>Subtract ' + t(s.a + 'x^{2}') + ' from both sides: ' + t(tx(Y.sub(L, M(s.a, 'x', 2))) + '=' + tx(Y.sub(R, M(s.a, 'x', 2)))) + '<br>' + t(tx(M(den, 'x')) + '=' + (-s.c * s.d)) + ', so ' + t('x=' + x) + '.',
              ['Distribute on the left, FOIL on the right. The ' + t('x^{2}') + ' terms cancel.'], 'solve after expanding (b)', { before: t('x=') });
            p.bad = [String(-x)]; return p;
          } },
          { id: 'e16c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var p = sh.C.p, q = sh.C.q, m = (p + q) / 2;
            return mc(r, '(c) Solve ' + t('(x+' + p + ')(x+' + q + ')=(x+' + m + ')^{2}') + '.', [
              { html: 'No solution: both sides expand to ' + t('x^{2}+' + (p + q) + 'x') + ' plus a number, so the ' + t('x') + '-terms cancel as well, leaving ' + t(p * q + '=' + m * m) + ', which is never true.', right: true },
              { html: t('x=0'), why: 'Substitute ' + t('x=0') + ': ' + t(p * q) + ' on the left, ' + t(m * m) + ' on the right.', code: 'n-zero' },
              { html: 'Every value of ' + t('x') + ' works, because both sides have ' + t('x^{2}+' + (p + q) + 'x') + '.', why: 'The numbers differ: ' + t(p * q) + ' and ' + t(m * m) + '. So the two sides are <b>never</b> equal.', code: 'n-all' },
              { html: 'No solution, because the ' + t('x^{2}') + ' terms cancel.', why: 'The ' + t('x^{2}') + ' terms cancel in (a) and (b) too, and those have solutions. Here the ' + t('x') + '-terms cancel as well.', code: 'n-x2' }],
              'Left: ' + t('x^{2}+' + (p + q) + 'x+' + p * q) + '. Right: ' + t('x^{2}+' + 2 * m + 'x+' + m * m) + '.<br>Subtract ' + t('x^{2}+' + (p + q) + 'x') + ' from both sides: ' + t(p * q + '=' + m * m) + ' — false. There is <b>no solution</b>.',
              ['Expand both sides and subtract the ' + t('x^{2}') + ' terms. What is left?'], 'no solution');
          } }] },
      /* ---------- Part E ---------- */
      { num: '17', section: 'Part E — Applications', stem: function (sh) { return '<b>Open-top box.</b> A rectangular sheet of cardboard measures ' + t(sh.L) + ' cm by ' + t(sh.W) + ' cm. A square of side length ' + t('x') + ' cm is cut from each of the four corners, and the flaps are folded up to form an open-top box.' + figNet(sh.L, sh.W); },
        shared: function (r) {
          var s = pickWhere(function () { return { L: 2 * r.int(10, 18), W: 2 * r.int(6, 12), x: r.int(2, 5) }; }, function (s) { return s.W < s.L && s.W - 2 * s.x >= 4; });
          if (r.chance(0.12)) s = { L: 30, W: 20, x: 4 };
          return s;
        },
        parts: [
          { id: 'e17a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var Ln = lin(-2, sh.L), Wd = lin(-2, sh.W), X = M(1, 'x');
            var chk = function (resp) {
              resp = resp || [];
              var a = readPoly(resp[0] == null ? '' : resp[0]); if (a.res) return lab(a.res, 'Length');
              var b = readPoly(resp[1] == null ? '' : resp[1]); if (b.res) return lab(b.res, 'Width');
              var c = readPoly(resp[2] == null ? '' : resp[2]); if (c.res) return lab(c.res, 'Height');
              var lw = (Y.eq(a.p, Ln) && Y.eq(b.p, Wd)) || (Y.eq(a.p, Wd) && Y.eq(b.p, Ln));
              if (lw && Y.eq(c.p, X)) { var fi = a.fi || b.fi || c.fi; return fi ? form(fi.code, fi.msg || 'Simplify it.') : ok(); }
              if ([a.p, b.p].some(function (p) { return Y.eq(p, lin(-1, sh.L)) || Y.eq(p, lin(-1, sh.W)); })) return wrong('box-dims', 'A square is cut from <b>both</b> ends of each side, so each side loses ' + t('2x') + ': ' + t(sh.L + '-2x') + ' and ' + t(sh.W + '-2x') + '.');
              if (!Y.eq(c.p, X)) return wrong('no-height', 'When the flaps fold up, the height of the box is the side of the cut square.');
              return wrong('value', 'The length and the width are what is left of each side of the sheet after the two corner squares are cut off.');
            };
            var p = KP.fields('(a) Write an expression for the length, the width and the height of the finished box.', [pbox('Length'), pbox('Width'), pbox('Height')], [], [tx(Ln, { order: 'asc' }), tx(Wd, { order: 'asc' }), 'x'],
              'length ' + t(sh.L + '-2x') + ', width ' + t(sh.W + '-2x') + ', height ' + t('x'),
              'A square of side ' + t('x') + ' comes off <b>both</b> ends of each side: length ' + t(sh.L + '-2x') + ', width ' + t(sh.W + '-2x') + '. The flaps fold up to a height of ' + t('x') + '.',
              ['How much is cut off the ' + t(sh.L) + ' cm side? There is a corner square at each end.'], 'box dimensions');
            p.check = chk; p.good = [[tx(Wd), tx(Ln), 'x']]; p.bad = [[tx(lin(-1, sh.L)), tx(lin(-1, sh.W)), 'x'], [tx(Ln), tx(Wd), '2x']];
            return p;
          } },
          { id: 'e17b', sub: 'b', level: 'ADV', make: function (r, sh) {
            var Ln = lin(-2, sh.L), Wd = lin(-2, sh.W), base = Y.mul(Ln, Wd), V = Y.mul(base, M(1, 'x'));
            return pp('(b) Write a fully expanded and simplified expression for the volume of the box.', V, [
              { is: base, code: 'no-height', hint: 'That is the area of the base. Multiply by the height ' + t('x') + ' too.' },
              { is: Y.mul(lin(-1, sh.L), lin(-1, sh.W), M(1, 'x')), code: 'box-dims', hint: 'Each side loses ' + t('2x') + ' (a square at each end): ' + t(sh.L + '-2x') + ' and ' + t(sh.W + '-2x') + '.' },
              { is: Y.mul(S([N(sh.L * sh.W), M(4, 'x', 2)]), M(1, 'x')), code: 'fl-only', hint: 'FOIL the two brackets — four products, including the Outer and Inner products ' + t('-' + 2 * sh.W + 'x') + ' and ' + t('-' + 2 * sh.L + 'x') + '.' }],
              t('V=x(' + sh.L + '-2x)(' + sh.W + '-2x)') + '<br>' + t('(' + sh.L + '-2x)(' + sh.W + '-2x)=' + sh.L * sh.W + '-' + 2 * sh.L + 'x-' + 2 * sh.W + 'x+4x^{2}=' + tx(base)) + '<br>' + t('x\\left(' + tx(base) + '\\right)=' + tx(V)) + ' cm' + t('^{3}'),
              ['Volume = length × width × height. FOIL the length and width first, then multiply every term by ' + t('x') + '.'], 'open box volume', { after: t('\\text{cm}^{3}') });
          } },
          { id: 'e17c', sub: 'c', level: 'BEG', make: function (r, sh) {
            var x = sh.x, l = sh.L - 2 * x, w = sh.W - 2 * x, V = x * l * w, Vp = Y.mul(lin(-2, sh.L), lin(-2, sh.W), M(1, 'x'));
            var p = KP.number('(c) Determine the volume when ' + t('x=' + x) + ' cm.', V, numDiagClean(V, [[x * (sh.L - x) * (sh.W - x), 'box-dims', 'Each side loses ' + t('2x=' + 2 * x) + ' cm: ' + t(sh.L + '-' + 2 * x + '=' + l) + '.'], [l * w, 'no-height', 'That is the area of the base. Multiply by the height ' + t(x) + '.']]),
              'Using the expansion: ' + t(valuesTex(Vp, x) + '=' + V) + ' cm' + t('^{3}') + '.<br>Directly: ' + t(x + '\\times' + l + '\\times' + w + '=' + V) + ' cm' + t('^{3}') + ' ✓',
              ['Substitute into your expansion, or multiply the three dimensions: ' + t(sh.L + '-2(' + x + ')') + ', ' + t(sh.W + '-2(' + x + ')') + ' and ' + t(x) + '.'], 'box volume at x', { after: t('\\text{cm}^{3}') });
            p.bad = [String(l * w)]; return p;
          } }] },
      { num: '18', stem: function (sh) { return '<b>Path around a garden.</b> A rectangular garden measures ' + t('(x+' + sh.p + ')') + ' m by ' + t('(x+' + sh.q + ')') + ' m. A uniform path ' + t(sh.w) + ' m wide is laid all the way around the outside of the garden.' + figPath(2 + sh.p / 5, 1.3 + sh.q / 5, 0.45, 'x+' + sh.p, 'x+' + sh.q, sh.w + '\\text{ m}'); },
        shared: function (r) { var s = pickWhere(function () { return { p: r.int(3, 9), q: r.int(1, 7), w: r.int(1, 3) }; }, function (s) { return s.p > s.q; }); if (r.chance(0.12)) s = { p: 5, q: 3, w: 2 }; return s; },
        parts: [
          { id: 'e18a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var O1 = lin(1, sh.p + 2 * sh.w), O2 = lin(1, sh.q + 2 * sh.w);
            var p = KP.fields('(a) Write expressions for the outer length and outer width of the garden-plus-path region.', [pbox('Outer length'), pbox('Outer width')], [], [tx(O1), tx(O2)], t(tx(O1)) + ' m and ' + t(tx(O2)) + ' m',
              'The path adds ' + t(sh.w) + ' m at <b>both</b> ends of each dimension: ' + t('x+' + sh.p + '+2(' + sh.w + ')=' + tx(O1)) + ' and ' + t('x+' + sh.q + '+2(' + sh.w + ')=' + tx(O2)) + '.',
              ['The path is on <b>both</b> sides of the garden, so each dimension grows by ' + t('2\\times' + sh.w) + '.'], 'outer dimensions');
            p.check = pairCheck(O1, O2, ['Outer length', 'Outer width'], function (A, B) {
              if ([A, B].some(function (q) { return Y.eq(q, lin(1, sh.p + sh.w)) || Y.eq(q, lin(1, sh.q + sh.w)); })) return { code: 'u3l7-path-one', hint: 'The path is on <b>both</b> ends of each side: add ' + t(sh.w) + ' twice.' };
              return null;
            });
            p.good = [[tx(O2), tx(O1)]]; p.bad = [[tx(lin(1, sh.p + sh.w)), tx(lin(1, sh.q + sh.w))]];
            return p;
          } },
          { id: 'e18b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var P = pFoil(M(1, 'x'), N(sh.p + 2 * sh.w), M(1, 'x'), N(sh.q + 2 * sh.w));
            return pp('(b) Write a simplified expression for the total area of the garden-plus-path region.', P.val, combo([{ s: 1, p: P }]).wr.concat([{ is: Y.mul(lin(1, sh.p + sh.w), lin(1, sh.q + sh.w)), code: 'u3l7-path-one', hint: 'The outer length is ' + t('x+' + (sh.p + 2 * sh.w)) + ': the path adds ' + t(sh.w) + ' m at <b>both</b> ends.' }]),
              'Total area ' + t('=' + P.tex) + '<br>' + P.sol + ' m' + t('^{2}'), ['Area = (outer length) × (outer width). FOIL.'], 'total area', { after: t('\\text{m}^{2}') });
          } },
          { id: 'e18c', sub: 'c', level: 'PRG', make: function (r, sh) {
            var Tot = Y.mul(lin(1, sh.p + 2 * sh.w), lin(1, sh.q + 2 * sh.w)), G = Y.mul(lin(1, sh.p), lin(1, sh.q)), Pa = Y.sub(Tot, G);
            return pp('(c) Write a simplified expression for the area of the path alone.', Pa, [
              { is: Tot, code: 'u3l7-path-total', hint: 'That is the area of the garden <b>and</b> the path. Subtract the garden’s area.' },
              { is: Y.add(Tot, G), code: 'minus-ignored', hint: 'Path = (total) − (garden): subtract the garden’s area.' },
              { is: Y.add(Tot, Y.neg(firstTerm(G)), Y.sub(G, firstTerm(G))), code: 'sub-first', hint: 'Subtract the <b>whole</b> garden area: ' + t('-\\left(' + tx(G) + '\\right)=' + tx(Y.neg(G))) + '.' },
              { is: Y.sub(Y.mul(lin(1, sh.p + sh.w), lin(1, sh.q + sh.w)), G), code: 'u3l7-path-one', hint: 'The outer dimensions add ' + t(sh.w) + ' m at <b>both</b> ends of each side.' }],
              'Garden: ' + t('(x+' + sh.p + ')(x+' + sh.q + ')=' + tx(G)) + '<br>Path ' + t('=\\left(' + tx(Tot) + '\\right)-\\left(' + tx(G) + '\\right)=' + tx(Pa)) + ' m' + t('^{2}'),
              ['Area of the path = (total area) − (area of the garden).', 'Subtract the whole garden area: change every sign.'], 'path area', { after: t('\\text{m}^{2}') });
          } },
          { id: 'e18d', sub: 'c degree', level: 'EMG', make: function (r, sh) {
            return mc(r, 'What is the degree of the path’s area, and why is that reasonable?', [
              { html: 'Degree ' + t(1) + ': the ' + t('x^{2}') + ' terms cancel. The path is a thin border of fixed width, so its area grows with the <b>perimeter</b> of the garden (like ' + t('x') + '), not with its area (like ' + t('x^{2}') + ').', right: true },
              { html: 'Degree ' + t(2) + ': an area always has degree ' + t(2) + '.', why: 'Subtract: the ' + t('x^{2}') + ' terms cancel. An area can have any degree — a border of fixed width grows like the perimeter.', code: 'd-2' },
              { html: 'Degree ' + t(0) + ': the path’s area doesn’t change with ' + t('x') + '.', why: 'A bigger garden needs a longer path: the area has an ' + t('x') + '-term.', code: 'd-0' },
              { html: 'Degree ' + t(1) + ', because the path is ' + t(sh.w) + ' m wide.', why: 'The degree is right, but the width alone doesn’t explain it: think about how the path grows as the garden grows.', code: 'd-why' }],
              'The ' + t('x^{2}') + ' terms cancel, so the path’s area has degree ' + t(1) + ': it grows in proportion to the garden’s perimeter.',
              ['Look at your answer to (c): what is the highest power of ' + t('x') + '?'], 'degree of path area');
          } }] },
      { num: '19', stem: function (sh) { return '<b>Comparing two areas.</b> Rectangle A has length ' + t('(x+' + sh.a + ')') + ' cm and width ' + t('(x+' + sh.b + ')') + ' cm. Rectangle B is a square with side length ' + t('(x+' + sh.m + ')') + ' cm.' + sideBySide([figRect(1.4 + sh.a / 8, 0.9 + sh.b / 8, 'x+' + sh.a, 'x+' + sh.b, 'rectangle A', '\\text{A}'), figRect(1.2 + sh.m / 8, 1.2 + sh.m / 8, 'x+' + sh.m, 'x+' + sh.m, 'square B', '\\text{B}')]); },
        shared: function (r) { var s = pickWhere(function () { return { a: r.int(3, 12), b: r.int(1, 9) }; }, function (s) { return s.a > s.b + 1 && (s.a + s.b) % 2 === 0; }); if (r.chance(0.12)) s = { a: 7, b: 1 }; s.m = (s.a + s.b) / 2; s.D = s.m * s.m - s.a * s.b; return s; },
        parts: [
          { id: 'e19a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var A = Y.mul(lin(1, sh.a), lin(1, sh.b)), B = Y.pow(lin(1, sh.m), 2);
            return KP.fields('(a) Write a simplified expression for the area of each figure.', [pbox('Area of A', ['x'], { after: t('\\text{cm}^{2}') }), pbox('Area of B', ['x'], { after: t('\\text{cm}^{2}') })],
              [polyChk(A, [{ is: S([M(1, 'x', 2), N(sh.a * sh.b)]), code: 'fl-only', hint: 'Include the Outer and Inner products: ' + t((sh.a + sh.b) + 'x') + '.' }]), polyChk(B, [{ is: S([M(1, 'x', 2), N(sh.m * sh.m)]), code: 'sq-no-middle', hint: 'A square of a binomial has a middle term: ' + t(2 * sh.m + 'x') + '.' }])],
              [tx(A), tx(B)], 'A: ' + t(tx(A)) + ' cm' + t('^{2}') + ', B: ' + t(tx(B)) + ' cm' + t('^{2}'),
              'A: ' + t('(x+' + sh.a + ')(x+' + sh.b + ')=' + tx(A)) + '<br>B: ' + t('(x+' + sh.m + ')^{2}=' + tx(B)),
              ['FOIL for A; the perfect square pattern for B.'], 'areas A and B');
          } },
          { id: 'e19b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var D = sh.D, ab = sh.a * sh.b, m2 = sh.m * sh.m;
            return mc(r, '(b) Subtract to determine which figure has the greater area, and by how much.', [
              { html: 'Square B, by ' + t(D) + ' cm' + t('^{2}'), right: true },
              { html: 'Rectangle A, by ' + t(D) + ' cm' + t('^{2}'), why: t('B-A=' + m2 + '-' + ab + '=+' + D) + ': the positive difference means <b>B</b> is greater.', code: 'b-A' },
              { html: 'Square B, by ' + t(m2 + ab) + ' cm' + t('^{2}'), why: 'Subtract the constants: ' + t(m2 + '-' + ab) + '.', code: 'b-add' },
              { html: 'They have equal areas, because both have ' + t('x^{2}+' + (sh.a + sh.b) + 'x') + '.', why: 'The ' + t('x^{2}') + '- and ' + t('x') + '-terms match, but the constants ' + t(ab) + ' and ' + t(m2) + ' don’t.', code: 'b-eq' }],
              t('\\left(x^{2}+' + 2 * sh.m + 'x+' + m2 + '\\right)-\\left(x^{2}+' + (sh.a + sh.b) + 'x+' + ab + '\\right)=' + D) + ', so the square B is greater by ' + t(D) + ' cm' + t('^{2}') + '.',
              ['Subtract area A from area B. The ' + t('x^{2}') + '- and ' + t('x') + '-terms cancel.'], 'which is greater');
          } },
          { id: 'e19c', sub: 'c', level: 'EMG', make: function (r, sh) {
            var D = sh.D, A1 = (1 + sh.a) * (1 + sh.b), B1 = (1 + sh.m) * (1 + sh.m), A10 = (10 + sh.a) * (10 + sh.b), B10 = (10 + sh.m) * (10 + sh.m);
            return mc(r, '(c) Your answer to (b) contains no ' + t('x') + ' at all. What does that tell you about the two figures?', [
              { html: 'Whatever the value of ' + t('x') + ', the square B is bigger than A by exactly ' + t(D) + ' cm' + t('^{2}') + '. (At ' + t('x=1') + ': ' + t(A1) + ' and ' + t(B1) + '; at ' + t('x=10') + ': ' + t(A10) + ' and ' + t(B10) + '.)', right: true },
              { html: 'The difference is ' + t(D) + ' cm' + t('^{2}') + ' only when ' + t('x=0') + '.', why: 'Test ' + t('x=10') + ': ' + t(B10 + '-' + A10 + '=' + D) + '. The difference never depends on ' + t('x') + '.', code: 'c-x0' },
              { html: 'The difference grows as ' + t('x') + ' grows.', why: 'Test ' + t('x=1') + ' and ' + t('x=10') + ': ' + t(B1 + '-' + A1 + '=' + D) + ' and ' + t(B10 + '-' + A10 + '=' + D) + ' — the same.', code: 'c-grow' },
              { html: 'For large values of ' + t('x') + ' the two areas become equal.', why: 'The difference is always ' + t(D) + ', however large ' + t('x') + ' is.', code: 'c-large' }],
              'The difference ' + t(D) + ' has no ' + t('x') + ', so it is the same for every ' + t('x') + '. Check: ' + t('x=1') + ' gives ' + t(B1 + '-' + A1 + '=' + D) + '; ' + t('x=10') + ' gives ' + t(B10 + '-' + A10 + '=' + D) + ' ✓',
              ['Try ' + t('x=1') + ' and ' + t('x=10') + ' in both areas and compare.'], 'difference is constant');
          } }] },
      { num: '20', stem: '<b>Volume.</b> Write a fully expanded expression for each volume, then evaluate it at the given value and confirm your answer by multiplying the dimensions directly.',
        shared: function (r) {
          var A = pickWhere(function () { return { p: r.int(1, 4), q: r.int(2, 3), s: r.int(1, 5), v: r.int(3, 6) }; }, function (s) { return gcd(s.q, s.s) === 1 && s.q * s.v - s.s >= 2 && Y.count(Y.mul(Y.pow(lin(1, s.p), 2), lin(s.q, -s.s))) === 4; });
          var k = r.int(1, 6), v = k + r.int(1, 5), ord = r.pick([[0, 1, 2], [0, 1, 2], [1, 2, 0], [2, 0, 1], [1, 0, 2]]);
          if (r.chance(0.12)) { A = { p: 1, q: 2, s: 3, v: 5 }; k = 2; v = 6; ord = [0, 1, 2]; }
          return { A: A, k: k, v: v, ord: ord };
        },
        parts: [
          { id: 'e20a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var s = sh.A, Sq = Y.pow(lin(1, s.p), 2), H = lin(s.q, -s.s), V = Y.mul(Sq, H);
            return pp('(a) A prism has a square base of side length ' + t('(x+' + s.p + ')') + ' cm and height ' + t('(' + tx(H) + ')') + ' cm.' + figPrism(2, 2.2, 2, 'x+' + s.p, tx(H), 'x+' + s.p, 'prism with a square base') + 'Write a fully expanded expression for its volume.', V, [
              { is: Y.mul(S([M(1, 'x', 2), N(s.p * s.p)]), H), code: 'sq-no-middle', hint: 'Square the base side with its middle term: ' + t('(x+' + s.p + ')^{2}=' + tx(Sq)) + '.' },
              { is: Y.mul(lin(1, s.p), H), code: 'two-dims', hint: 'The base is a square: length <b>and</b> width are both ' + t('(x+' + s.p + ')') + '.' },
              { is: S([Y.mul(Sq, M(s.q, 'x')), N(-s.s)]), code: 'q-not-mult', hint: 'The ' + t('-' + s.s) + ' multiplies every term of ' + t(tx(Sq)) + '.' }],
              t('V=(x+' + s.p + ')^{2}(' + tx(H) + ')') + '<br>' + t('(x+' + s.p + ')^{2}=' + tx(Sq)) + '<br>' + t('\\left(' + tx(Sq) + '\\right)(' + tx(H) + ')=' + seq(termsOf(Y.mul(Sq, M(s.q, 'x'))).concat(termsOf(Y.mul(Sq, N(-s.s))))) + '=' + tx(V)) + ' cm' + t('^{3}'),
              ['Volume = (side)² × height. Square first, then multiply by the height.'], 'volume (x+p)²(qx−s)', { after: t('\\text{cm}^{3}') });
          } },
          { id: 'e20a2', sub: 'a value', level: 'BEG', make: function (r, sh) {
            var s = sh.A, V = Y.mul(Y.pow(lin(1, s.p), 2), lin(s.q, -s.s)), v = s.v, side = v + s.p, h = s.q * v - s.s, val = side * side * h;
            var p = KP.number('Evaluate the volume in (a), ' + t('V=(x+' + s.p + ')^{2}(' + tx(lin(s.q, -s.s)) + ')') + ', at ' + t('x=' + v) + '.', val, numDiagClean(val, [[side * h, 'two-dims', 'The base is ' + t(side) + ' by ' + t(side) + ': multiply by ' + t(side) + ' twice.'], [side * side, 'face-area', 'That is the area of the base. Multiply by the height ' + t(h) + '.']]),
              'Expansion: ' + t(valuesTex(V, v) + '=' + val) + ' cm' + t('^{3}') + '.<br>Directly: side ' + t(v + '+' + s.p + '=' + side) + ', height ' + t(s.q + '(' + v + ')-' + s.s + '=' + h) + ': ' + t(side + '^{2}\\times' + h + '=' + val) + ' cm' + t('^{3}') + ' ✓',
              ['Substitute ' + t('x=' + v) + ' into your expansion, or work out each dimension and multiply.'], 'volume value', { after: t('\\text{cm}^{3}') });
            p.bad = [String(side * side)]; return p;
          } },
          { id: 'e20b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var k = sh.k, V = Y.mul(M(1, 'x'), S([M(1, 'x', 2), N(-k * k)]));
            var dims = ['x', '(x+' + k + ')', '(x-' + k + ')'], dd = sh.ord.map(function (i) { return dims[i]; });
            return pp('(b) A rectangular prism has dimensions ' + t(dd[0]) + ' cm, ' + t(dd[1]) + ' cm and ' + t(dd[2]) + ' cm.' + figPrism(2.2, 1.5, 1.6, 'x+' + k, 'x', 'x-' + k, 'rectangular prism') + 'Write a fully expanded expression for its volume.', V, [
              { is: Y.mul(M(1, 'x'), S([M(1, 'x', 2), N(k * k)])), code: 'sd-plus', hint: t('(x+' + k + ')(x-' + k + ')=x^{2}-' + k * k) + ': a sum times a difference gives a <b>difference</b>.' },
              { is: S([M(1, 'x', 2), N(-k * k)]), code: 'two-dims', hint: 'Multiply all three dimensions: the ' + t('x') + ' as well.' },
              { is: S([M(1, 'x', 3), N(-k * k)]), code: 'first-only', hint: 'Multiply <b>both</b> terms of ' + t('x^{2}-' + k * k) + ' by ' + t('x') + '.' }],
              t('(x+' + k + ')(x-' + k + ')=x^{2}-' + k * k) + ' (sum × difference)<br>' + t('V=x\\left(x^{2}-' + k * k + '\\right)=' + tx(V)) + ' cm' + t('^{3}'),
              ['Multiply the sum × difference pair first, then multiply by ' + t('x') + '.'], 'volume x(x+k)(x−k)', { after: t('\\text{cm}^{3}') });
          } },
          { id: 'e20b2', sub: 'b value', level: 'BEG', make: function (r, sh) {
            var k = sh.k, v = sh.v, val = v * (v + k) * (v - k);
            var p = KP.number('Evaluate the volume in (b), ' + t('V=x(x+' + k + ')(x-' + k + ')') + ', at ' + t('x=' + v) + '.', val, numDiagClean(val, [[v * (v * v + k * k), 'sd-plus', t('x^{2}-' + k * k) + ' at ' + t('x=' + v) + ' is ' + t(v * v + '-' + k * k) + '.'], [(v + k) * (v - k), 'two-dims', 'Multiply by the third dimension, ' + t(v) + ', too.']]),
              'Expansion: ' + t(v + '^{3}-' + k * k + '(' + v + ')=' + v * v * v + '-' + k * k * v + '=' + val) + ' cm' + t('^{3}') + '.<br>Directly: ' + t(v + '\\times' + (v + k) + '\\times' + (v - k) + '=' + val) + ' cm' + t('^{3}') + ' ✓',
              ['Substitute ' + t('x=' + v) + ' into your expansion, or multiply ' + t(v) + ', ' + t(v + k) + ' and ' + t(v - k) + '.'], 'volume value (b)', { after: t('\\text{cm}^{3}') });
            p.bad = [String((v + k) * (v - k))]; return p;
          } }] },
      /* ---------- Part F ---------- */
      { num: '21', section: 'Part F — Challenge', stem: function (sh) { return '<b>Grouping.</b> A trinomial in brackets can sometimes be treated as a binomial in disguise. For example, ' + t('(' + sh.u + '+' + sh.w + '+' + sh.k + ')^{2}') + ' can be written as ' + t('\\big[(' + sh.u + '+' + sh.w + ')+' + sh.k + '\\big]^{2}') + ', a perfect square whose “first term” is the whole quantity ' + t('(' + sh.u + '+' + sh.w + ')') + '.'; },
        shared: function (r) { var L = r.pick(LETTERS2), k = r.int(2, 6), j = r.int(2, 7); if (r.chance(0.12)) { L = ['x', 'y']; k = 2; j = 3; } return { u: L[0], w: L[1], k: k, j: j }; },
        parts: [
          { id: 'e21a', sub: 'a', level: 'ADV', make: function (r, sh) {
            var U = M(1, sh.u), W = M(1, sh.w), G = Y.add(U, W), G2 = Y.pow(G, 2), k = sh.k, T = S([G2, Y.scale(G, 2 * k), N(k * k)]);
            return pp('(a) Expand ' + t('(' + sh.u + '+' + sh.w + '+' + k + ')^{2}') + ' using this grouping, then finish by expanding ' + t('(' + sh.u + '+' + sh.w + ')^{2}') + '.', T, [
              { is: S([M(1, sh.u, 2), M(1, sh.w, 2), Y.scale(G, 2 * k), N(k * k)]), code: 'sq-no-middle', hint: t('(' + sh.u + '+' + sh.w + ')^{2}') + ' has a middle term too: ' + t(tx(G2)) + '.' },
              { is: S([G2, N(k * k)]), code: 'no-group-middle', hint: 'The grouped square has a middle term: ' + t('2(' + sh.u + '+' + sh.w + ')(' + k + ')=' + tx(Y.scale(G, 2 * k))) + '.' },
              { is: S([G2, Y.scale(G, k), N(k * k)]), code: 'sq-not-doubled', hint: 'Double the middle product: ' + t('2(' + sh.u + '+' + sh.w + ')(' + k + ')') + '.' },
              { is: S([M(1, sh.u, 2), M(1, sh.w, 2), N(k * k)]), code: 'sq-no-middle', hint: 'Squaring each term separately misses every cross product. Use the grouping.' }],
              t('\\big[(' + sh.u + '+' + sh.w + ')+' + k + '\\big]^{2}=(' + sh.u + '+' + sh.w + ')^{2}+2(' + sh.u + '+' + sh.w + ')(' + k + ')+' + k + '^{2}') + '<br>' + t('=' + tx(G2) + '+' + tx(Y.scale(G, 2 * k)) + '+' + k * k),
              ['Let ' + t('a=(' + sh.u + '+' + sh.w + ')') + ' and ' + t('b=' + k) + ' in ' + t('(a+b)^{2}=a^{2}+2ab+b^{2}') + '.', 'Then expand ' + t('a^{2}=(' + sh.u + '+' + sh.w + ')^{2}') + ' and ' + t('2ab') + '.'], 'grouped square', { vars: [sh.u, sh.w] });
          } },
          { id: 'e21b', sub: 'b', level: 'ADV', make: function (r, sh) {
            var G = Y.add(M(1, sh.u), M(1, sh.w)), G2 = Y.pow(G, 2), j = sh.j, T = Y.sub(G2, N(j * j));
            return pp('(b) Use the same idea with the difference of squares to expand ' + t('(' + sh.u + '+' + sh.w + '+' + j + ')(' + sh.u + '+' + sh.w + '-' + j + ')') + '.', T, [
              { is: Y.add(G2, N(j * j)), code: 'sd-plus', hint: 'A sum times a difference gives a <b>difference</b> of squares: ' + t('-' + j + '^{2}') + '.' },
              { is: S([M(1, sh.u, 2), M(1, sh.w, 2), N(-j * j)]), code: 'sq-no-middle', hint: t('(' + sh.u + '+' + sh.w + ')^{2}') + ' has a middle term: ' + t(tx(G2)) + '.' },
              { is: S([G2, Y.scale(G, 2 * j), N(-j * j)]), code: 'sd-middle', hint: 'In a sum times a difference the middle products cancel: no ' + t('(' + sh.u + '+' + sh.w + ')') + '-terms.' }],
              t('\\big[(' + sh.u + '+' + sh.w + ')+' + j + '\\big]\\big[(' + sh.u + '+' + sh.w + ')-' + j + '\\big]=(' + sh.u + '+' + sh.w + ')^{2}-' + j + '^{2}=' + tx(T)),
              ['Let ' + t('a=(' + sh.u + '+' + sh.w + ')') + ' and ' + t('b=' + j) + ' in ' + t('(a+b)(a-b)=a^{2}-b^{2}') + '.'], 'grouped difference of squares', { vars: [sh.u, sh.w] });
          } }] },
      { num: '22', stem: '<b>Three factors.</b>',
        shared: function (r) { var s = pickWhere(function () { return { a: r.int(1, 5), b: r.int(2, 6), c: r.int(3, 8), v: r.int(3, 9) }; }, function (s) { return s.a < s.b && s.b < s.c; }); if (r.chance(0.12)) s = { a: 1, b: 2, c: 3, v: 7 }; return s; },
        parts: [
          { id: 'e22a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var A = lin(1, sh.a), B = lin(1, sh.b), C = lin(1, sh.c), AB = Y.mul(A, B), T = Y.mul(AB, C);
            return pp('Expand ' + t('(x+' + sh.a + ')(x+' + sh.b + ')(x+' + sh.c + ')') + ' completely.', T, [
              { is: S([M(1, 'x', 3), N(sh.a * sh.b * sh.c)]), code: 'fl-only', hint: 'Multiply two of the brackets first (four products), then multiply every term of that result by the third bracket.' },
              { is: S([Y.mul(AB, M(1, 'x')), N(sh.c)]), code: 'q-not-mult', hint: 'The ' + t(sh.c) + ' must multiply every term of ' + t(tx(AB)) + ' too.' },
              { is: Y.mul(S([M(1, 'x', 2), N(sh.a * sh.b)]), C), code: 'fl-only', hint: 'FOIL the first two brackets completely: ' + t('(x+' + sh.a + ')(x+' + sh.b + ')=' + tx(AB)) + '.' }],
              t('(x+' + sh.a + ')(x+' + sh.b + ')=' + tx(AB)) + '<br>' + t('\\left(' + tx(AB) + '\\right)(x+' + sh.c + ')=' + seq(termsOf(Y.mul(AB, M(1, 'x'))).concat(termsOf(Y.mul(AB, N(sh.c))))) + '=' + tx(T)),
              ['FOIL the first two brackets, then multiply the trinomial by ' + t('(x+' + sh.c + ')') + ' — six products.'], 'three binomials');
          } },
          { id: 'e22b', sub: 'b', level: 'BEG', make: function (r, sh) {
            var v = sh.v, T = Y.mul(lin(1, sh.a), lin(1, sh.b), lin(1, sh.c)), val = (v + sh.a) * (v + sh.b) * (v + sh.c);
            var p = KP.number('Evaluate your expansion of ' + t('(x+' + sh.a + ')(x+' + sh.b + ')(x+' + sh.c + ')') + ' at ' + t('x=' + v) + ', and check it by substituting ' + t('x=' + v) + ' into the original three factors and multiplying. What value do both give?', val, numDiagClean(val, [[v * v * v + sh.a * sh.b * sh.c, 'fl-only', 'That is ' + t('x^{3}+' + sh.a * sh.b * sh.c) + ' — the expansion is missing terms. Multiply the three factors directly to check.']]),
              'Expansion: ' + t(valuesTex(T, v) + '=' + val) + '.<br>Factors: ' + t((v + sh.a) + '\\times' + (v + sh.b) + '\\times' + (v + sh.c) + '=' + val) + ' ✓',
              ['Work out each bracket at ' + t('x=' + v) + ' and multiply the three numbers.'], 'three factors check');
            p.bad = [String(v * v * v + sh.a * sh.b * sh.c)]; return p;
          } }] },
      { num: '23', stem: function (sh) { return '<b>A hidden difference of squares.</b> The product ' + t('\\left(' + sh.T1 + '\\right)\\left(' + sh.T2 + '\\right)') + ' looks like a trinomial times a trinomial, but regrouping each bracket as ' + t('\\left(x^{2}+' + sh.m + '\\right)\\pm ' + sh.kx) + ' turns it into a difference of squares.'; },
        shared: function (r) {
          var s = pickWhere(function () { return { k: r.int(1, 4), m: r.int(1, 7) }; }, function (s) { return 2 * s.m !== s.k * s.k; });
          if (r.chance(0.12)) s = { k: 1, m: 1 };
          s.kx = s.k === 1 ? 'x' : s.k + 'x'; s.T1 = 'x^{2}+' + s.kx + '+' + s.m; s.T2 = 'x^{2}-' + s.kx + '+' + s.m;
          return s;
        },
        parts: [
          { id: 'e23a', sub: 'a', level: 'MAS', make: function (r, sh) {
            var k = sh.k, m = sh.m, G = S([M(1, 'x', 2), N(m)]), G2 = Y.pow(G, 2), T = Y.sub(G2, M(k * k, 'x', 2));
            return pp('(a) Expand the product using this regrouping. You will need ' + t('\\left(x^{2}+' + m + '\\right)^{2}') + ' along the way.', T, [
              { is: Y.add(G2, M(k * k, 'x', 2)), code: 'sd-plus', hint: 'It is a <b>difference</b> of squares: ' + t('\\left[(x^{2}+' + m + ')+' + sh.kx + '\\right]\\left[(x^{2}+' + m + ')-' + sh.kx + '\\right]=(x^{2}+' + m + ')^{2}-(' + sh.kx + ')^{2}') + '.' },
              { is: Y.sub(S([M(1, 'x', 4), N(m * m)]), M(k * k, 'x', 2)), code: 'sq-no-middle', hint: t('\\left(x^{2}+' + m + '\\right)^{2}') + ' has a middle term: ' + t(tx(G2)) + '.' },
              { is: Y.sub(G2, M(k, 'x', 2)), code: 'coef-not-squared', hint: 'Square the whole term: ' + t('(' + sh.kx + ')^{2}=' + (k * k === 1 ? '' : k * k) + 'x^{2}') + '.' },
              { is: Y.sub(G2, M(k * k, 'x')), code: 'exp', hint: t('(' + sh.kx + ')^{2}') + ' has ' + t('x^{2}') + ', not ' + t('x') + '.' }],
              t('\\left[(x^{2}+' + m + ')+' + sh.kx + '\\right]\\left[(x^{2}+' + m + ')-' + sh.kx + '\\right]=(x^{2}+' + m + ')^{2}-(' + sh.kx + ')^{2}') + '<br>' + t('(x^{2}+' + m + ')^{2}=' + tx(G2)) + '<br>' + t('=' + tx(G2) + '-' + (k * k === 1 ? '' : k * k) + 'x^{2}=' + tx(T)),
              ['Let ' + t('a=x^{2}+' + m) + ' and ' + t('b=' + sh.kx) + '. Then the product is ' + t('(a+b)(a-b)=a^{2}-b^{2}') + '.', 'Expand ' + t('a^{2}=(x^{2}+' + m + ')^{2}') + ' with its middle term, then subtract ' + t('b^{2}') + ' and collect.'], 'hidden difference of squares');
          } },
          { id: 'e23b', sub: 'b', level: 'PRG', make: function (r, sh) {
            return mc(r, '(b) Why does the final answer contain no ' + t('x^{3}') + ' term and no ' + t('x') + ' term?', [
              { html: 'The regrouping makes it a difference of squares, which has no middle term: the cross products ' + t('+' + sh.kx + '(x^{2}+' + sh.m + ')') + ' and ' + t('-' + sh.kx + '(x^{2}+' + sh.m + ')') + ' cancel, and they are the only source of ' + t('x^{3}') + ' and ' + t('x') + ' terms.', right: true },
              { html: 'Because the two trinomials have no ' + t('x^{3}') + ' term to begin with.', why: 'Multiplying can create an ' + t('x^{3}') + ' term (' + t('x^{2}\\cdot x') + '). They appear, then cancel.', code: 'h-start' },
              { html: 'Because ' + t('x^{3}') + ' and ' + t('x') + ' terms always cancel when you multiply two trinomials.', why: 'Try ' + t('(x^{2}+x+1)(x^{2}+x+1)') + ': it has ' + t('2x^{3}') + '. Here they cancel only because the middle signs are opposite.', code: 'h-always' },
              { html: 'Because the constant terms ' + t(sh.m) + ' and ' + t(sh.m) + ' are equal.', why: 'Equal constants help the grouping, but the cancelling comes from the opposite signs on the ' + t(sh.kx) + ' terms.', code: 'h-const' }],
              'With ' + t('a=x^{2}+' + sh.m) + ' and ' + t('b=' + sh.kx) + ', ' + t('(a+b)(a-b)=a^{2}-ab+ab-b^{2}') + ': the cross products ' + t('\\pm ab=\\pm ' + sh.kx + '(x^{2}+' + sh.m + ')') + ' cancel. They are the only products with an odd power of ' + t('x') + '.',
              ['Which products would give ' + t('x^{3}') + ' or ' + t('x') + '? Look at their signs.'], 'why no odd powers');
          } }] }
    ]
  });
})(window);
