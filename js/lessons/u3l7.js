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
    'minus-first': 'Subtracted a bracket but changed only its first sign', 'minus-ignored': 'Added a product that is subtracted', 'no-change': 'Added instead of subtracting (no signs changed)',
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
  var LETTERS2 = [['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['c', 'd'], ['s', 't'], ['u', 'v'], ['h', 'k']];

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
        W.push({ is: Y.add(T, Y.scale(rest, 2)), code: 'minus-first', hint: 'A minus sign in front of ' + t(it.p.tex) + ' changes the sign of <b>every</b> term of its expansion: ' + t('-\\left(' + tx(it.p.val) + '\\right)=' + tx(Y.neg(it.p.val))) + '.' });
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
      sol = (lines.length ? 'Expand each product:<br>' + lines.join('<br>') + '<br>' : '') + 'Put the pieces together: ' + t(tex + '=' + together) +
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
    extra: []
  });
})(window);
