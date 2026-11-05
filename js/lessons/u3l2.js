/* Math 15 · Unit 3 · Lesson 2 — Multiplying a Monomial by a Polynomial (AN4)
 * Assignment 2 (u3_L02.tex, Questions 1–15) and the Lesson 2 Extra Practice (u3_EP02.tex, Questions 1–17).
 * Every part is a generator that keeps the booklet question's structure (signs, which factor is negative, whether the
 * monomial has a variable, how many brackets) and changes the numbers; the booklet's own numbers are among the possible
 * values unless noted. Keys are built with HW.poly (js/poly.js) from the generated numbers. Built like the Math 10C
 * Unit 3 Lesson 2 practice (expandMono / monoWrongs / twoProducts, the same wrong-answer codes and hints), at the
 * Math 15 pitch: small whole-number coefficients, no calculator.
 * Conversions: "identify the error and give the correct simplification" → multiple choice (which error?) plus the
 * corrected expansion; "explain" / "who is right" → multiple choice whose options are reasons; "evaluate both and state
 * both values" → labelled number boxes; several answers → labelled boxes.
 * Changed from the booklet: Assignment 15 asks for a × b of −4x(x + 2) + 3x(x − 5) (a = −1, b = −23, a × b = 23) and its
 * relatives, because the booklet's −4x(x − 2) + 3x(x + 5) gives a × b = −23, a negative numerical response.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 17(b) (x(x + a)(x + b): distribute twice). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, PL = HW.poly, t = K.t;

  HW.addCodes({
    'first-only': 'Multiplied only the first term in the bracket', 'neg-first': 'Negative monomial: sign applied to the first term only', 'var-first': 'Variable of the monomial only on the first term',
    'add-coef': 'Added coefficients instead of multiplying', 'mult-exp': 'Multiplied exponents (should add)', 'outside-in': 'Multiplied a term that is outside the bracket',
    'subtract-first': 'Subtracted before multiplying (order of operations)', 'kept-error': 'Repeated the error being corrected', 'inner-sign': 'Sign error with nested brackets',
    'fl-only': 'Expanded with only First and Last', 'u3l2-hidden1': 'Forgot the hidden exponent 1 when multiplying', 'u3l2-drop-var': 'Dropped the variable from a product',
    'u3l2-perimeter': 'Found the perimeter instead of the area', 'u3l2-frac': 'Fraction coefficient: multiplied by the numerator only', 'u3l2-asked-other': 'Combined the coefficients the wrong way',
    'u3l2-box': 'Working backwards: the missing factor doesn’t give the product', 'u3l2-box-exp': 'Working backwards: didn’t subtract the exponents', 'u3l2-subs': 'Substitution slip',
    'u3l2-cut-added': 'Added the cut-out area instead of subtracting it', 'u3l2-whole': 'Used the whole rectangle (nothing removed)', 'u3l2-half': 'Perimeter: added only one length and one width'
  });
  HW.addPartial({ 'u3l2-hidden1': 's', 'u3l2-drop-var': 'b', 'u3l2-perimeter': 'n', 'u3l2-frac': 'b', 'u3l2-asked-other': 'n', 'u3l2-box': 'n', 'u3l2-box-exp': 'b', 'u3l2-subs': 's',
    'u3l2-cut-added': 'b', 'u3l2-whole': 'n', 'u3l2-half': 'b' });

  /* ---------- polynomial helpers ---------- */
  function xm(c, e, v) { var o = {}; o[v || 'x'] = e == null ? 1 : e; return PL.mono(c, o); } // c·x^e
  function M(c, vars) { return PL.mono(c, vars || {}); }
  function N(c) { return PL.num(c); }
  var add = PL.add, mul = PL.mul, sub = PL.sub, neg = PL.neg;
  function tx(p) { return PL.tex(p); }
  function seq(list) { return PL.seq(list); }
  function br(list) { return '(' + seq(list) + ')'; }
  function sumOf(list) { return add.apply(null, list); }
  function termsOf(p) { return PL.sorted(p).map(function (q) { return M(q.c, q.v); }); }
  /* a factor written inside a product line: (−3), (3x), (x+2) — brackets when it is negative or has several terms */
  function pf(p) { var s = tx(p); return PL.count(p) > 1 || s.charAt(0) === '-' ? '(' + s + ')' : s; }
  function coefOf(m) { var ts = PL.terms(m); return ts.length ? ts[0].c[0] / ts[0].c[1] : 0; }
  function pickWhere(gen, test) { for (var i = 0; i < 2000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('pickWhere failed'); }
  function plain(s) { return String(s).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '($1)/($2)').replace(/\\[a-z]+/g, ' ').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim(); }
  var PH = 'e.g. 3x^2 - 5x + 4';
  /* m written in front of a bracket: −x, 3x, −2 … (1 and −1 shown as "" and "−") */
  function mTex(m) { var s = tx(m); return s === '1' ? '' : s === '-1' ? '-' : s; }
  /* the sign + monomial that follows another product: "+3x", "−2", "−x" */
  function mNext(m) { var s = tx(m); if (s === '1') return '+'; if (s === '-1') return '-'; return s.charAt(0) === '-' ? s : '+' + s; }

  /* polynomial answer: drops classic wrong answers that coincide with the key (or with each other), tests them as bad answers */
  function pp(prompt, target, ws, sol, hints, text, opt) {
    opt = opt || {};
    var seen = [target], W = [];
    (ws || []).forEach(function (w) { if (!w || !w.is) return; var p = PL.lift(w.is); if (seen.some(function (s) { return PL.eq(s, p); })) return; seen.push(p); W.push({ is: p, code: w.code, hint: w.hint }); });
    var o = Object.assign({}, opt, { wrong: W });
    var part = KP.poly(prompt, target, o, sol, hints, text);
    part.bad = W.map(function (w) { return tx(w.is); });
    if (PL.count(target) > 1) part.good = [PL.tex(target, { order: 'asc' })];
    part.input.placeholder = PH;
    return part;
  }
  /* classic wrong answers for a monomial times a bracket */
  function monoWrongs(m, terms) {
    var out = [], prods = terms.map(function (q) { return mul(m, q); }), c = coefOf(m), cr = PL.terms(m)[0].c;
    if (terms.length > 1) {
      out.push({ is: sumOf([prods[0]].concat(terms.slice(1))), code: 'first-only', hint: 'Multiply <b>every</b> term in the bracket by ' + t(tx(m)) + ', not just the first one.' });
      if (c < 0) out.push({ is: sumOf([prods[0]].concat(terms.slice(1).map(function (q) { return mul(neg(m), q); }))), code: 'neg-first', hint: 'The negative sign is part of ' + t(tx(m)) + ', so it multiplies <b>every</b> term in the bracket. Check the signs after the first term.' });
      if (PL.vars(m).length) out.push({ is: sumOf([prods[0]].concat(terms.slice(1).map(function (q) { return mul(N(cr), q); }))), code: 'var-first', hint: 'The variable part of ' + t(tx(m)) + ' multiplies every term in the bracket too, not just the first one.' });
    }
    return out;
  }
  /* m(t1+t2+…) written out term by term */
  function distSol(m, terms, lead) {
    var prods = terms.map(function (q) { return mul(m, q); }), res = sumOf(prods);
    var l1 = terms.map(function (q, i) { var s = pf(m) + '(' + tx(q) + ')'; return i ? '+' + s : s; }).join(''), l2 = seq(prods), s = l1 + '=' + l2;
    if (tx(res) !== l2) s += '=' + tx(res);
    return (lead || 'Multiply ' + t(tx(m)) + ' by <b>each</b> term in the bracket (one product per term):') + '<br>' + t(s);
  }
  var HM = ['Multiply the monomial by <b>each</b> term in the bracket: multiply the coefficients and <b>add</b> the exponents of matching letters.', 'Watch the signs: a negative times a negative is positive.'];
  function expandMono(m, terms, opt) {
    opt = opt || {};
    var T = mul(m, sumOf(terms)), prodTex = opt.prodTex || mTex(m) + br(terms);
    return pp((opt.pre || '') + t(prodTex), T, monoWrongs(m, terms).concat(opt.wrong || []), distSol(m, terms), opt.hints || HM, 'expand ' + prodTex);
  }
  /* m1(…) ± m2(…) */
  function twoProducts(m1, t1, m2, t2, opt) {
    opt = opt || {};
    var P1 = mul(m1, sumOf(t1)), P2 = mul(m2, sumOf(t2)), T = add(P1, P2);
    var prodTex = mTex(m1) + br(t1) + mNext(m2) + br(t2);
    var ws = monoWrongs(m2, t2).map(function (w) { return { is: add(P1, w.is), code: w.code, hint: w.hint }; }).concat(monoWrongs(m1, t1).slice(0, 1).map(function (w) { return { is: add(w.is, P2), code: w.code, hint: w.hint }; }));
    var p1 = t1.map(function (q) { return mul(m1, q); }), p2 = t2.map(function (q) { return mul(m2, q); });
    return pp(t(prodTex), T, ws.concat(opt.wrong || []), 'One bracket at a time:<br>' + t(mTex(m1) + br(t1) + '=' + seq(p1)) + '<br>' + t(mTex(m2) + br(t2) + '=' + seq(p2)) + '<br>Add the two results and collect like terms:<br>' + t(seq(p1.concat(p2)) + '=' + tx(T)),
      ['Expand each product separately — the sign in front belongs to the monomial and multiplies every term in its bracket.', 'Then collect like terms: same letters with the same exponents.'], 'expand ' + prodTex);
  }
  /* "expand and simplify" with a loose term outside the bracket: m(terms) + extra (extra is a monomial, ext first or last) */
  function outsidePart(m, terms, extra, first, opt) {
    opt = opt || {};
    var P1 = mul(m, sumOf(terms)), T = add(P1, extra), ex = tx(extra);
    var prodTex = first ? ex + mNext(m) + br(terms) : mTex(m) + br(terms) + (ex.charAt(0) === '-' ? ex : '+' + ex);
    var ws = monoWrongs(m, terms).map(function (w) { return { is: add(w.is, extra), code: w.code, hint: w.hint }; });
    ws.push({ is: mul(m, add(sumOf(terms), extra)), code: 'outside-in', hint: t(ex) + ' is <b>outside</b> the bracket, so it isn’t multiplied by ' + t(tx(m)) + '.' });
    var prods = terms.map(function (q) { return mul(m, q); }), line = first ? [extra].concat(prods) : prods.concat([extra]);
    return pp(t(prodTex), T, ws.concat(opt.wrong || []), 'Distribute first, then collect like terms:<br>' + t(prodTex + '=' + seq(line) + '=' + tx(T)),
      ['Distribute first: multiply ' + t(tx(m)) + ' by each term in the bracket. The term outside the bracket isn’t multiplied.', 'Then collect like terms.'], 'expand ' + prodTex);
  }

  /* ---------- drawings ---------- */
  function svgLabel(s) { return String(s).replace(/\^\{?(\d)\}?/g, function (m, d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(+d); }).replace(/-/g, ' − ').replace(/\+/g, ' + ').replace(/^ − /, '−').replace(/([a-z])/g, '<tspan font-style="italic">$1</tspan>'); }
  function svgText(x, y, s, anchor) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '" font-size="16" font-family="serif" fill="currentColor">' + svgLabel(s) + '</text>'; }
  function rectSvg(len, wid) {
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 320 160" width="100%" style="max-width:320px" role="img" aria-label="rectangle ' + len + ' by ' + wid + '">' +
      '<rect x="40" y="25" width="200" height="100" fill="rgba(110,150,200,0.15)" stroke="currentColor" stroke-width="2"/>' +
      svgText(140, 148, len) + svgText(248, 80, wid, 'start') + '</svg></div>';
  }
  function cutSvg(L, Wd, l, w) { // large L by Wd, small l by w cut from the top-left corner (dashed)
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 340 200" width="100%" style="max-width:340px" role="img" aria-label="rectangle ' + L + ' by ' + Wd + ' with a ' + l + ' by ' + w + ' rectangle cut out">' +
      '<rect x="40" y="25" width="220" height="140" fill="rgba(110,150,200,0.18)" stroke="currentColor" stroke-width="2"/>' +
      '<rect x="40" y="25" width="100" height="60" fill="var(--bg, #fff)" stroke="currentColor" stroke-width="1.6" stroke-dasharray="6 4"/>' +
      svgText(150, 188, L) + svgText(268, 100, Wd, 'start') + svgText(90, 18, l) + svgText(148, 60, w, 'start') + '</svg></div>';
  }

  /* ---------- question makers ---------- */
  /* Q1: monomial × monomial */
  function monoProd(c1, e1, c2, e2) {
    var a = xm(c1, e1), b = xm(c2, e2), T = mul(a, b), prodTex = tx(a) + '\\times ' + pf(b);
    var ws = [{ is: xm(c1 + c2, e1 + e2), code: 'add-coef', hint: 'In a product the coefficients <b>multiply</b>: ' + t(c1 + '\\times ' + (c2 < 0 ? '(' + c2 + ')' : c2) + '=' + c1 * c2) + '.' }];
    if (e1 * e2 !== e1 + e2) ws.push({ is: xm(c1 * c2, e1 * e2), code: 'mult-exp', hint: 'The exponents <b>add</b> when you multiply powers of the same letter (Product Law): ' + t('x^{' + e1 + '}\\cdot x^{' + e2 + '}=x^{' + (e1 + e2) + '}') + '.' });
    if (e1 === 1 || e2 === 1) ws.push({ is: xm(c1 * c2, e1 + e2 - 1), code: 'u3l2-hidden1', hint: t('x') + ' means ' + t('x^{1}') + ': count that exponent ' + t('1') + ' when you add.' });
    return pp(t(prodTex), T, ws, 'Multiply the coefficients and <b>add</b> the exponents:<br>' + t(prodTex + '=(' + c1 + '\\times ' + (c2 < 0 ? '(' + c2 + ')' : c2) + ')(x^{' + e1 + '}\\cdot x^{' + e2 + '})=' + tx(T)),
      ['Multiply the numbers in front, then add the exponents (' + t('x^{a}\\cdot x^{b}=x^{a+b}') + ').', 'Signs as usual: a negative times a negative is positive.'], 'monomial product ' + prodTex);
  }
  /* Q7: find the error */
  function q7Shared(r) {
    var k = r.int(2, 5), m = r.int(2, 4), c = r.int(2, 7), pq = r.pick([[2, 3], [3, 2], [2, 4], [4, 2], [3, 3]]), A = r.int(2, 7), a = r.int(3, 7), cc = r.int(1, a - 1), b = r.int(1, 6);
    if (r.chance(0.15)) { k = 3; m = 2; c = 5; pq = [2, 3]; A = 4; a = 4; cc = 3; b = 2; }
    var p = pq[0], q = pq[1];
    var A1 = { lhs: tx(xm(k)) + br([xm(m), N(c)]), T: add(xm(k * m, 2), xm(k * c)), given: add(xm(k * m), N(k * c)), k: k, m: m, c: c };
    A1.shown = A1.lhs + '=' + tx(A1.given);
    var B1 = { lhs: 'x^{' + p + '}' + br([xm(1, q), xm(-A)]), T: add(xm(1, p + q), xm(-A, p + 1)), given: add(xm(1, p * q), xm(-A, p + 1)), p: p, q: q, A: A };
    B1.shown = B1.lhs + '=' + tx(B1.given);
    var C1 = { lhs: a + br([xm(1), N(-b)]) + '-' + cc + br([xm(1), N(-b)]), T: add(xm(a - cc), N(-(a - cc) * b)), a: a, c: cc, b: b };
    C1.line = seq([xm(a), N(-a * b), xm(-cc), N(-cc * b)]); C1.given = add(xm(a - cc), N(-(a + cc) * b)); C1.shown = C1.lhs + '=' + C1.line + '=' + tx(C1.given);
    return { a: A1, b: B1, c: C1 };
  }
  function q7Err(r, sh, w) {
    var o = sh[w], pre = 'A student wrote ' + t(o.shown) + '.<br>Which statement describes the error?', opts, sol;
    if (w === 'a') {
      opts = [{ html: 'The ' + t('x') + ' of ' + t(o.k + 'x') + ' was left out of both products: ' + t(o.k + 'x\\cdot ' + o.m + 'x=' + o.k * o.m + 'x^{2}') + ' and ' + t(o.k + 'x\\cdot ' + o.c + '=' + o.k * o.c + 'x') + '.', right: true },
        { html: 'The coefficients should have been added: ' + t((o.k + o.m) + 'x') + '.', why: 'In a product, coefficients <b>multiply</b>: ' + t(o.k + '\\times ' + o.m + '=' + o.k * o.m) + '. That part was right.' },
        { html: 'Only the second term is wrong: it should be ' + t(o.k * o.c + 'x') + '.', why: 'That one is wrong, but so is the first: what is ' + t('x\\cdot x') + '?' },
        { html: 'There is no error.', why: 'Substitute ' + t('x=1') + ' into both sides: do they agree?' }];
      sol = 'Each product must keep the ' + t('x') + ' from ' + t(o.k + 'x') + ': ' + t(o.k + 'x\\cdot ' + o.m + 'x=' + o.k * o.m + 'x^{2}') + ' (exponents add) and ' + t(o.k + 'x\\cdot ' + o.c + '=' + o.k * o.c + 'x') + '. The student multiplied only the numbers.';
    } else if (w === 'b') {
      opts = [{ html: t('x^{' + o.p + '}\\cdot x^{' + o.q + '}') + ' is ' + t('x^{' + (o.p + o.q) + '}') + ', not ' + t('x^{' + o.p * o.q + '}') + ': exponents <b>add</b> when you multiply powers.', right: true },
        { html: 'The second term should be ' + t('-' + o.A + 'x^{' + o.p + '}') + '.', why: t('x^{' + o.p + '}\\cdot(-' + o.A + 'x)=-' + o.A + 'x^{' + (o.p + 1) + '}') + ' — that term is right (' + t('x') + ' means ' + t('x^{1}') + ').' },
        { html: 'The second term should be ' + t('-' + o.A + 'x^{' + o.p + '}') + ' and the first ' + t('x^{' + o.q + '}') + ': ' + t('x^{' + o.p + '}') + ' only multiplies numbers.', why: t('x^{' + o.p + '}') + ' multiplies each whole term, letters included.' },
        { html: 'There is no error.', why: 'Check the first term: what is ' + t('x^{' + o.p + '}\\cdot x^{' + o.q + '}') + '?' }];
      sol = t('x^{' + o.p + '}\\cdot x^{' + o.q + '}=x^{' + o.p + '+' + o.q + '}=x^{' + (o.p + o.q) + '}') + '. The student multiplied the exponents instead of adding them. The second term ' + t('-' + o.A + 'x^{' + (o.p + 1) + '}') + ' is right.';
    } else {
      opts = [{ html: 'Sign error: ' + t('-' + o.c + '(x-' + o.b + ')') + ' is ' + t('-' + o.c + 'x+' + o.c * o.b) + ', not ' + t('-' + o.c + 'x-' + o.c * o.b) + '.', right: true },
        { html: 'The ' + t('x') + '-terms should be ' + t((o.a + o.c) + 'x') + ', not ' + t((o.a - o.c === 1 ? '' : o.a - o.c) + 'x') + '.', why: t(o.a + 'x-' + o.c + 'x=' + (o.a - o.c) + 'x') + ' is right. Look at the constant terms.' },
        { html: t(o.a + '(x-' + o.b + ')') + ' should be ' + t(o.a + 'x-' + o.b) + '.', why: 'No — the ' + t(o.a) + ' multiplies both terms, so ' + t(o.a + 'x-' + o.a * o.b) + ' is right.' },
        { html: 'There is no error.', why: 'Check the second bracket: what is ' + t('(-' + o.c + ')(-' + o.b + ')') + '?' }];
      sol = 'Distributing ' + t('-' + o.c) + ' over ' + t('(x-' + o.b + ')') + ' gives ' + t('-' + o.c + 'x+' + o.c * o.b) + ', because ' + t('(-' + o.c + ')(-' + o.b + ')=+' + o.c * o.b) + '. The student wrote ' + t('-' + o.c * o.b) + '.';
    }
    return KP.mc(r, pre, opts, sol, ['Redo each product yourself and compare it with the student’s line.'], 'find the error (' + w + ')');
  }
  function q7Fix(sh, w) {
    var o = sh[w], ws, sol;
    if (w === 'a') { ws = [{ is: o.given, code: 'kept-error', hint: 'That’s the student’s answer. Keep the ' + t('x') + ' in both products: ' + t('x\\cdot x=x^{2}') + '.' }, { is: add(xm(o.k * o.m, 2), N(o.k * o.c)), code: 'u3l2-drop-var', hint: 'Nearly — ' + t(o.k + 'x\\cdot ' + o.c) + ' keeps its ' + t('x') + ': ' + t(o.k * o.c + 'x') + '.' }]; sol = t(o.lhs + '=' + o.k + 'x(' + o.m + 'x)+' + o.k + 'x(' + o.c + ')=' + tx(o.T)); }
    else if (w === 'b') { ws = [{ is: o.given, code: 'mult-exp', hint: 'That’s the student’s answer. When you multiply powers, <b>add</b> the exponents.' }]; sol = t(o.lhs + '=x^{' + o.p + '}\\cdot x^{' + o.q + '}-' + o.A + 'x^{' + o.p + '}\\cdot x=' + tx(o.T)); }
    else { ws = [{ is: o.given, code: 'kept-error', hint: 'That’s the student’s answer. Check the sign of ' + t('(-' + o.c + ')(-' + o.b + ')') + '.' }]; sol = t(o.lhs + '=' + seq([xm(o.a), N(-o.a * o.b), xm(-o.c), N(o.c * o.b)]) + '=' + tx(o.T)); }
    return pp('Give the correct simplification of ' + t(o.lhs) + '.', o.T, ws, sol, ['Multiply the monomial by each term: coefficients multiply, exponents add.', 'A negative times a negative is positive.'], 'correct: ' + o.lhs);
  }
  /* Q10: MC — which is equivalent to −k x(x − c) */
  function q10(r) {
    var k = r.int(2, 6), c = r.int(2, 9); if (k === c) c++;
    if (r.chance(0.15)) { k = 4; c = 5; }
    var T = mul(xm(-k), add(xm(1), N(-c)));
    var opts = [[-1, 1], [-1, -1], [1, -1], [1, 1]].map(function (s) {
      var p = add(xm(s[0] * k, 2), xm(s[1] * k * c)), right = PL.eq(p, T);
      return { html: t(tx(p)), right: right, why: right ? null : s[0] > 0 ? 'Check the first term: ' + t('(-' + k + 'x)(x)=-' + k + 'x^{2}') + '.' : 'Check the second term: ' + t('(-' + k + 'x)(-' + c + ')=+' + k * c + 'x') + ' — a negative times a negative.' };
    });
    return KP.mc(r, 'Which expression is equivalent to ' + t('-' + k + 'x(x-' + c + ')') + '?', opts, t('(-' + k + 'x)(x)=-' + k + 'x^{2}') + ' and ' + t('(-' + k + 'x)(-' + c + ')=+' + k * c + 'x') + ', so ' + t('-' + k + 'x(x-' + c + ')=' + tx(T)) + '.',
      ['Multiply ' + t('-' + k + 'x') + ' by each term, sign included.'], 'MC -kx(x-c)', true);
  }
  /* Q11: which expansion is incorrect */
  function q11(r) {
    var a = r.int(2, 4), b = r.int(2, 5), c = r.int(2, 7), d = r.int(2, 6), e = r.int(2, 5), f = r.int(2, 6), g = r.int(2, 9), err = r.int(0, 3);
    if (r.chance(0.15)) { a = 2; b = 3; c = 4; d = 5; e = 3; f = 3; g = 9; err = 3; }
    var S = [{ m: xm(a), ts: [xm(b), N(c)], bad: function (pr) { return seq([pr[0], N(a * c)]); }, why: 'the ' + t('x') + ' of ' + t(a + 'x') + ' was left out of the second product' },
      { m: N(-d), ts: [xm(1), N(-e)], bad: function (pr) { return seq([pr[0], neg(pr[1])]); }, why: 'a <b>sign error</b>: ' + t('(-' + d + ')(-' + e + ')=+' + d * e) },
      { m: xm(-f), ts: [xm(1), N(2)], bad: function (pr) { return seq([pr[0], neg(pr[1])]); }, why: 'a <b>sign error</b>: ' + t('(-' + f + 'x)(2)=-' + 2 * f + 'x') },
      { m: xm(1), ts: [xm(1), N(-g)], bad: function () { return seq([xm(1, 2), N(-g * g)]); }, why: t('x\\cdot(-' + g + ')=-' + g + 'x') + ', not ' + t('-' + g * g) }];
    S.forEach(function (s) { s.prods = s.ts.map(function (q) { return mul(s.m, q); }); s.okTex = seq(s.prods); s.lhs = mTex(s.m) + br(s.ts); s.check = s.ts.map(function (q) { return t(pf(s.m) + '(' + tx(q) + ')=' + tx(mul(s.m, q))); }).join(' and '); });
    var opts = S.map(function (s, j) { return { html: t(s.lhs + '=' + (j === err ? s.bad(s.prods) : s.okTex)), right: j === err, why: j === err ? null : 'Check it: ' + s.check + ' — this expansion is correct.' }; });
    var bd = S[err];
    return KP.mc(r, 'Which expansion below is <b>incorrect</b>?', opts, 'Check each one by distributing. The incorrect one has ' + bd.why + ': ' + t(bd.lhs + '=' + bd.okTex) + '.', ['Distribute each monomial yourself, sign included, and compare.'], 'which expansion is wrong (MC)', true);
  }
  /* missing factor (working backwards): m·F = T, ask for F (or m) */
  function missPart(prompt, ans, product, other, ws, sol, hints, text) {
    var c = K.poly(ans, { wrong: ws, diag: function (S) { return { code: 'u3l2-box', hint: 'Check by expanding: ' + t(pf(other) + pf(S) + '=' + tx(mul(other, S))) + ', not ' + t(tx(product)) + '.' }; } });
    var p = KP.math(prompt, c, tx(ans), sol, hints, text, { keys: 'poly', vars: PL.vars(product), placeholder: PH });
    p.bad = (ws || []).map(function (w) { return tx(w.is); }).concat([tx(neg(ans))]);
    return p;
  }
  function divTerms(T, m) { return termsOf(T).map(function (q) { var a = PL.terms(q)[0], b = PL.terms(m)[0], v = {}; Object.keys(a.v).forEach(function (k) { v[k] = (a.v[k] || 0) - (b.v[k] || 0); }); return M([a.c[0] * b.c[1], a.c[1] * b.c[0]], v); }); }

  /* ======================== EXTRA PRACTICE ======================== */
  var EXTRA = [
    { num: '1', section: 'Extra practice A — Negative Monomials and Two Variables', stem: 'Expand. Watch every sign — a negative monomial flips the sign of <b>each</b> term inside the brackets.', parts: [
      { id: 'e1a', level: 'EMG', make: function (r) { var k = r.int(2, 4), a = r.int(2, 4), b = r.int(2, 5), c = r.int(2, 6); if (r.chance(0.15)) { k = 3; a = 2; b = 4; c = 5; } return expandMono(xm(-k, 2), [xm(a, 2), xm(-b), N(c)]); } },
      { id: 'e1b', level: 'EMG', make: function (r) { var k = r.int(2, 6), b = r.int(2, 5), c = r.int(1, 4); if (r.chance(0.15)) { k = 5; b = 3; c = 2; } return expandMono(xm(-k), [xm(1, 2), xm(-b), N(-c)]); } },
      { id: 'e1c', level: 'EMG', make: function (r) { var e = r.int(2, 3), a = r.int(2, 5), c = r.int(2, 9); if (r.chance(0.15)) { e = 3; a = 4; c = 7; } return expandMono(xm(-1, e), [xm(a, 2), xm(1), N(-c)]); } }] },
    { num: '2', stem: 'Expand. Two variables change nothing: multiply the coefficients, then add the exponents on each letter <b>separately</b>.', parts: [
      { id: 'e2a', level: 'EMG', make: function (r) { var k = r.int(2, 5), a = r.int(2, 4), b = r.int(1, 3); if (r.chance(0.15)) { k = 4; a = 3; b = 2; } return expandMono(M(k, { x: 1, y: 1 }), [M(a, { x: 2 }), M(-b, { x: 1, y: 1 }), M(1, { y: 2 })]); } },
      { id: 'e2b', level: 'EMG', make: function (r) { var k = r.int(2, 3), a = r.int(2, 5), b = r.int(2, 4), c = r.int(2, 5); if (r.chance(0.15)) { k = 2; a = 5; b = 3; c = 4; } return expandMono(M(-k, { a: 1, b: 1 }), [M(a, { a: 2 }), M(-b, { a: 1, b: 1 }), M(c, { b: 2 })]); } },
      { id: 'e2c', level: 'EMG', make: function (r) { var k = r.int(2, 4), a = r.int(2, 3), c = r.int(2, 6); if (r.chance(0.15)) { k = 3; a = 2; c = 6; } return expandMono(M(k, { m: 2, n: 1 }), [M(a, { m: 1, n: 1 }), M(-1, { n: 2 }), N(c)]); } }] },
    { num: '3', stem: 'Expand. Each monomial has a fraction as its coefficient, but the rule is unchanged: multiply the fraction by every coefficient inside.', parts: [
      { id: 'e3a', level: 'EMG', make: function (r) { var a = r.int(1, 4) * 2, b = r.int(1, 3) * 2, c = r.int(1, 5) * 2; if (r.chance(0.15)) { a = 6; b = 4; c = 10; } return fracPart(M([1, 2], { x: 1 }), [xm(a, 2), xm(-b), N(c)]); } },
      { id: 'e3b', level: 'PRG', make: function (r) { var a = r.int(1, 3) * 3, b = r.int(1, 3) * 3, c = r.int(1, 3) * 3; if (r.chance(0.15)) { a = 6; b = 9; c = 3; } return fracPart(M([-2, 3], { a: 2 }), [xm(-a, 2, 'a'), xm(b, 1, 'a'), N(c)]); } },
      { id: 'e3c', level: 'EMG', make: function (r) { var a = r.int(1, 3) * 4, b = r.int(1, 4) * 4 * (r.chance(0.3) ? -1 : 1), c = r.pick([4, 4, 8]); if (r.chance(0.15)) { a = 8; b = 12; c = 4; } return fracPart(M([1, 4], { x: 1 }), [xm(a, 2), xm(b), N(-c)]); } }] },
    { num: '4', section: 'Extra practice B — Distribute, Then Collect', stem: 'Two brackets means two separate distributions. Expand the first completely and write it down before you touch the second — then collect like terms.<br>For example ' + t('3x(x-2)+4x(2x+1)=3x^{2}-6x+8x^{2}+4x=11x^{2}-2x') + '.<br>Expand and simplify.', parts: [
      { id: 'e4a', level: 'EMG', make: function (r) { var a = r.int(2, 4), b = r.int(1, 3), c = r.int(2, 5), d = r.int(2, 5); if (r.chance(0.15)) { a = 2; b = 1; c = 5; d = 4; } return twoProducts(xm(a), [xm(3), N(b)], xm(c), [xm(1), N(-d)]); } },
      { id: 'e4b', level: 'EMG', make: function (r) { var a = r.int(2, 4), b = r.int(1, 4), c = r.int(2, 5), d = r.int(1, 3); if (r.chance(0.15)) { a = 3; b = 2; c = 4; d = 1; } return twoProducts(xm(a, 1, 'a'), [xm(1, 1, 'a'), N(-b)], xm(-c, 1, 'a'), [xm(2, 1, 'a'), N(d)]); } },
      { id: 'e4c', level: 'PRG', make: function (r) { var a = r.int(2, 5), b = r.int(1, 4), c = r.int(2, 4), d = r.int(2, 6); if (r.chance(0.15)) { a = 4; b = 3; c = 3; d = 5; } return twoProducts(xm(-a, 1, 'y'), [xm(2, 1, 'y'), N(-b)], xm(-c, 1, 'y'), [xm(1, 1, 'y'), N(d)]); } }] },
    { num: '5', stem: 'Expand and simplify. These produce cubic terms, so keep your like terms lined up by degree.', parts: [
      { id: 'e5a', level: 'EMG', make: function (r) { var a = r.int(2, 6), b = r.int(1, 3), c = r.int(2, 4), d = r.int(2, 5); if (r.chance(0.15)) { a = 5; b = 2; c = 3; d = 4; } return twoProducts(xm(a), [xm(1, 2), xm(-b)], xm(c, 2), [xm(1), N(d)]); } },
      { id: 'e5b', level: 'PRG', make: function (r) { var a = r.int(2, 3), b = r.int(1, 4), c = r.int(2, 5), d = r.int(2, 6); if (r.chance(0.15)) { a = 2; b = 3; c = 4; d = 5; } return twoProducts(xm(-a), [xm(1, 2), xm(b), N(-1)], xm(-1), [xm(c, 2), xm(-d)]); } },
      { id: 'e5c', level: 'EMG', make: function (r) { var a = r.int(2, 7), b = r.int(1, 4), c = r.int(2, 9); if (r.chance(0.15)) { a = 6; b = 3; c = 8; } return twoProducts(xm(a, 1, 't'), [xm(2, 1, 't'), N(-b)], xm(-1, 1, 't'), [xm(1, 1, 't'), N(-c)]); } }] },
    { num: '6', stem: '<b>Nested brackets.</b> Simplify <b>inside</b> the square brackets first, then distribute the monomial across what is left.', parts: [
      { id: 'e6a', level: 'EMG', make: function (r) { var k = r.int(2, 4), a = r.int(2, 5), b = r.int(1, 6); if (r.chance(0.15)) { k = 2; a = 3; b = 4; } return nestPart(xm(k), xm(a), -1, [xm(1), N(b)]); } },
      { id: 'e6b', level: 'PRG', make: function (r) { var k = r.int(2, 4), a = r.int(1, 3), c = r.int(a + 1, a + 3), b = r.int(1, 6); if (r.chance(0.15)) { k = 3; a = 2; c = 4; b = 5; } return nestPart(xm(-k, 1, 'a'), xm(a, 1, 'a'), -1, [xm(c, 1, 'a'), N(-b)]); } },
      { id: 'e6c', level: 'PRG', make: function (r) { var k = r.int(2, 5), m = r.int(2, 3), b = r.int(1, 4); if (r.chance(0.15)) { k = 5; m = 2; b = 3; } return nestPart(xm(k), xm(1), m, [xm(1), N(-b)]); } }] },
    { num: '7', stem: 'Simplify inside the square brackets first, then distribute.', parts: [
      { id: 'e7a', level: 'PRG', make: function (r) {
        var k = r.int(2, 4), p = r.int(2, 3), a = r.int(1, 4), q = r.int(p + 1, p + 2), b = r.int(1, 3);
        if (r.chance(0.15)) { k = 4; p = 2; a = 3; q = 3; b = 1; }
        var inner = sub(mul(N(p), add(xm(1), N(a))), mul(N(q), add(xm(1), N(-b)))), T = mul(xm(k), inner);
        var prodTex = tx(xm(k)) + '\\left[' + p + br([xm(1), N(a)]) + '-' + q + br([xm(1), N(-b)]) + '\\right]';
        var wrongInner = add(mul(N(p), add(xm(1), N(a))), xm(-q), N(-q * b));
        return pp(t(prodTex), T, [{ is: mul(xm(k), wrongInner), code: 'inner-sign', hint: 'Inside the bracket, ' + t('-' + q + '(x-' + b + ')=-' + q + 'x+' + q * b) + ': a negative times a negative is positive.' }].concat(monoWrongs(xm(k), termsOf(inner))),
          'Inside first: ' + t(p + br([xm(1), N(a)]) + '-' + q + br([xm(1), N(-b)]) + '=' + seq([xm(p), N(p * a), xm(-q), N(q * b)]) + '=' + tx(inner)) + '.<br>' + distSol(xm(k), termsOf(inner), 'Then distribute ' + t(tx(xm(k))) + ':'),
          ['Simplify the square bracket first: expand both small brackets and collect.', 'Then multiply ' + t(tx(xm(k))) + ' by each term that is left.'], 'nested ' + prodTex);
      } },
      { id: 'e7b', level: 'PRG', make: function (r) {
        var k = r.int(2, 4), q = r.int(2, 3), b = r.int(1, 4);
        if (r.chance(0.15)) { k = 2; q = 3; b = 2; }
        var inner = sub(xm(1, 1, 'y'), mul(N(q), add(xm(1, 1, 'y'), N(b)))), m = xm(-k, 1, 'y'), T = mul(m, inner);
        var prodTex = tx(m) + '\\left[y-' + q + br([xm(1, 1, 'y'), N(b)]) + '\\right]';
        return pp(t(prodTex), T, [{ is: mul(m, add(xm(1 - q, 1, 'y'), N(q * b))), code: 'inner-sign', hint: 'Inside the bracket, ' + t('-' + q + '(y+' + b + ')=-' + q + 'y-' + q * b) + '.' }].concat(monoWrongs(m, termsOf(inner))),
          'Inside first: ' + t('y-' + q + br([xm(1, 1, 'y'), N(b)]) + '=' + seq([xm(1, 1, 'y'), xm(-q, 1, 'y'), N(-q * b)]) + '=' + tx(inner)) + '.<br>' + distSol(m, termsOf(inner), 'Then distribute ' + t(tx(m)) + ':'),
          ['Simplify the square bracket first.', 'Then multiply ' + t(tx(m)) + ' by each term — a negative times a negative is positive.'], 'nested ' + prodTex);
      } }] },
    { num: '8', section: 'Extra practice C — Finding Errors, Working Backwards, and Checking', stem: 'Each student below made exactly one mistake.', shared: function (r) {
        var a = r.int(2, 5), b = r.int(2, 5), c = r.int(1, 6), k = r.int(2, 4), m = r.int(2, 5), n = r.int(2, 9);
        if (r.chance(0.15)) { a = 4; b = 3; c = 2; k = 2; m = 3; n = 5; }
        return { a: { m: xm(a), ts: [xm(1, 2), xm(-b), N(c)], who: 'Priya' }, b: { m: xm(-k), ts: [xm(m), N(-n)], who: 'Devon' } };
      },
      parts: [
        { id: 'e8aerr', sub: 'a mistake', level: 'EMG', make: function (r, sh) { return e8Err(r, sh.a, 'first'); } },
        { id: 'e8a', sub: 'a correct', level: 'BEG', make: function (r, sh) { return e8Fix(sh.a, 'first'); } },
        { id: 'e8berr', sub: 'b mistake', level: 'EMG', make: function (r, sh) { return e8Err(r, sh.b, 'sign'); } },
        { id: 'e8b', sub: 'b correct', level: 'BEG', make: function (r, sh) { return e8Fix(sh.b, 'sign'); } }] },
    { num: '9', stem: '<b>Work backwards.</b> Find what belongs in each box.', parts: [
      { id: 'e9a', level: 'PRG', make: function (r) {
        var k = r.int(2, 5), a = r.int(2, 5), b = r.int(1, 9); if (r.chance(0.15)) { k = 3; a = 2; b = 5; }
        var m = xm(k), F = add(xm(a), N(-b)), T = mul(m, F);
        return missPart(t('\\square' + br(termsOf(F)) + '=' + tx(T)), m, T, F, [{ is: N(k), code: 'u3l2-drop-var', hint: 'Check: ' + t(k + br(termsOf(F)) + '=' + tx(mul(N(k), F))) + '. The product has ' + t('x^{2}') + ', so the box needs an ' + t('x') + ' too.' }],
          'First terms: ' + t('\\square\\cdot ' + a + 'x=' + tx(mul(m, xm(a)))) + ', so ' + t('\\square=' + tx(m)) + '.<br>Check: ' + t(tx(m) + br(termsOf(F)) + '=' + tx(T)) + ' ✓', ['What times ' + t(a + 'x') + ' gives ' + t(tx(mul(m, xm(a)))) + '? Divide the coefficients and subtract the exponents.'], 'box monomial');
      } },
      { id: 'e9b', level: 'ADV', make: function (r) {
        var k = r.int(2, 4), a = r.int(2, 5), b = r.int(1, 4); if (r.chance(0.15)) { k = 3; a = 4; b = 3; }
        var m = xm(k), F = add(xm(a, 2), xm(-b)), T = mul(m, F);
        return missPart(t(tx(m) + '(\\square)=' + tx(T)), F, T, m, [{ is: add(xm(a, 3), xm(-b, 2)), code: 'u3l2-box-exp', hint: 'You divided the coefficients but kept the exponents. Dividing by ' + t('x') + ' also <b>lowers each exponent by 1</b>.' }],
          'Divide each term of the product by ' + t(tx(m)) + ': ' + termsOf(T).map(function (q, i) { return t(tx(q) + '\\div ' + tx(m) + '=' + tx(divTerms(T, m)[i])); }).join(', ') + '.<br>So the box is ' + t(tx(F)) + '. Check: ' + t(tx(m) + '(' + tx(F) + ')=' + tx(T)) + ' ✓', ['Each term of the product is ' + t(tx(m)) + ' times a term of the box: divide the coefficients and subtract the exponents.'], 'box binomial');
      } },
      { id: 'e9c', level: 'ADV', make: function (r) {
        var k = r.int(2, 3), a = r.int(2, 5), b = r.int(1, 4), c = r.int(2, 6); if (r.chance(0.15)) { k = 2; a = 4; b = 3; c = 5; }
        var m = xm(-k, 2), F = add(xm(a, 2), xm(-b), N(c)), T = mul(m, F);
        return missPart(t(tx(m) + '(\\square)=' + tx(T)), F, T, m, [{ is: neg(F), code: 'sign-all', hint: 'Dividing by a <b>negative</b> monomial changes every sign: ' + t(tx(termsOf(T)[0]) + '\\div(' + tx(m) + ')=' + tx(divTerms(T, m)[0])) + '.' }],
          'Divide each term by ' + t(tx(m)) + ' (signs change, exponents drop by ' + t('2') + '): ' + termsOf(T).map(function (q, i) { return t(tx(q) + '\\div(' + tx(m) + ')=' + tx(divTerms(T, m)[i])); }).join(', ') + '.<br>So the box is ' + t(tx(F)) + '. Check: ' + t(tx(m) + '(' + tx(F) + ')=' + tx(T)) + ' ✓', ['Divide each term of the product by ' + t(tx(m)) + ': divide the coefficients (sign included) and subtract the exponents.'], 'box trinomial');
      } }] },
    { num: '10', stem: 'Find the missing factor. Ask yourself what the first term of the bracket had to be multiplied by.', parts: [
      { id: 'e10a', level: 'ADV', make: function (r) {
        var k = r.int(2, 6), b = r.int(2, 6); if (r.chance(0.15)) { k = 5; b = 3; }
        var m = xm(-k), F = add(xm(1), N(b)), T = mul(m, F);
        return missPart(t('\\square' + br(termsOf(F)) + '=' + tx(T)), m, T, F, [{ is: xm(k), code: 'sign-all', hint: 'Check: ' + t(k + 'x' + br(termsOf(F)) + '=' + tx(mul(xm(k), F))) + '. The product’s terms are negative, so the monomial is negative.' }, { is: N(-k), code: 'u3l2-drop-var', hint: 'The product has ' + t('x^{2}') + ', so the box needs an ' + t('x') + '.' }],
          t('\\square\\cdot x=' + tx(termsOf(T)[0])) + ', so ' + t('\\square=' + tx(m)) + '. Check: ' + t(tx(m) + br(termsOf(F)) + '=' + tx(T)) + ' ✓', ['What times ' + t('x') + ' gives ' + t(tx(termsOf(T)[0])) + '? Then check the second term.'], 'box negative monomial');
      } },
      { id: 'e10b', level: 'ADV', make: function (r) {
        var k = r.int(2, 5), a = r.int(2, 4), b = r.int(1, 3); if (r.chance(0.15)) { k = 4; a = 3; b = 2; }
        var m = M(k, { a: 1, b: 1 }), F = add(xm(a, 1, 'a'), xm(-b, 1, 'b')), T = mul(m, F);
        return missPart(t(tx(m) + '(\\square)=' + tx(T)), F, T, m, [{ is: mul(F, M(1, { a: 1, b: 1 })), code: 'u3l2-box-exp', hint: 'You divided the coefficients but kept the letters. Dividing by ' + t('ab') + ' lowers the exponent of ' + t('a') + ' and of ' + t('b') + ' by 1.' }],
          'Divide each term by ' + t(tx(m)) + ': ' + termsOf(T).map(function (q, i) { return t(tx(q) + '\\div ' + tx(m) + '=' + tx(divTerms(T, m)[i])); }).join(', ') + '.<br>So the missing factor is ' + t(tx(F)) + '. Check: ' + t(tx(m) + '(' + tx(F) + ')=' + tx(T)) + ' ✓', ['Divide each term by ' + t(tx(m)) + ': coefficients divide, and each letter’s exponent drops by ' + t('1') + '.'], 'box two variables');
      } }] },
    { num: '11', stem: function (sh) { return '<b>Substitution check.</b> Consider ' + t(tx(sh.m) + br(sh.ts)) + '.'; },
      shared: function (r) { var k = r.int(2, 4), b = r.int(1, 3), c = r.int(2, 5), v = r.int(2, 3); if (r.chance(0.15)) { k = 3; b = 2; c = 4; v = 3; } return { m: xm(k), ts: [xm(1, 2), xm(-b), N(c)], v: v }; },
      parts: [
        { id: 'e11a', level: 'EMG', make: function (r, sh) { var p = expandMono(sh.m, sh.ts); p.prompt = 'Expand ' + t(tx(sh.m) + br(sh.ts)) + '.'; return p; } },
        { id: 'e11b', level: 'EMG', make: function (r, sh) { return subsPart(sh, true); } }] },
    { num: '12', stem: function (sh) { return '<b>Substitution check.</b> Consider ' + t(tx(sh.m) + br(sh.ts)) + '.'; },
      shared: function (r) { var k = r.int(2, 3), b = r.int(1, 4), c = r.int(1, 3), v = r.pick([-2, -2, -1, -3]); if (r.chance(0.15)) { k = 2; b = 3; c = 1; v = -2; } return { m: xm(-k), ts: [xm(1, 2), xm(b), N(-c)], v: v }; },
      parts: [
        { id: 'e12a', level: 'EMG', make: function (r, sh) { var p = expandMono(sh.m, sh.ts); p.prompt = 'Expand ' + t(tx(sh.m) + br(sh.ts)) + '.'; return p; } },
        { id: 'e12b', level: 'EMG', make: function (r, sh) { return subsPart(sh, false); } }] },
    { num: '13', section: 'Extra practice D — Applications, Reasoning, and Stretch', stem: function (sh) { return 'A rectangle has width ' + t(tx(sh.w)) + ' and length ' + t(br(sh.L)) + ' (in cm).' + rectSvg(plain(seq(sh.L)), plain(tx(sh.w))); },
      shared: function (r) { var k = r.int(2, 4), a = r.int(2, 5), b = r.int(1, 6), v = r.int(3, 6); if (r.chance(0.15)) { k = 2; a = 3; b = 4; v = 5; } return { w: xm(k), L: [xm(a), N(b)], v: v }; },
      parts: [
        { id: 'e13a', level: 'BEG', make: function (r, sh) {
          var A = mul(sh.w, sumOf(sh.L)), P = add(mul(N(2), sh.w), mul(N(2), sumOf(sh.L)));
          var p = pp('(a) Write a simplified expression for its area.', A, monoWrongs(sh.w, sh.L).concat([{ is: P, code: 'u3l2-perimeter', hint: 'That’s the perimeter. Area = length × width.' }]), distSol(sh.w, sh.L, 'Area = width × length:'), ['Area of a rectangle = length × width. Distribute.'], 'rectangle area', { after: t('\\text{ cm}^{2}') });
          return p;
        } },
        { id: 'e13b', level: 'EMG', make: function (r, sh) {
          var A = mul(sh.w, sumOf(sh.L)), P = add(mul(N(2), sh.w), mul(N(2), sumOf(sh.L)));
          return pp('(b) Write a simplified expression for its perimeter.', P, [{ is: A, code: 'u3l2-perimeter', hint: 'That’s the area. The perimeter is the distance around: add all four sides.' }, { is: add(sh.w, sumOf(sh.L)), code: 'u3l2-half', hint: 'That’s one width and one length. A rectangle has <b>two</b> of each.' }],
            'Perimeter = ' + t('2(\\text{width})+2(\\text{length})=2(' + tx(sh.w) + ')+2' + br(sh.L) + '=' + seq([mul(N(2), sh.w), mul(N(2), sh.L[0]), mul(N(2), sh.L[1])]) + '=' + tx(P)), ['Add all four sides: two widths and two lengths.'], 'rectangle perimeter', { after: t('\\text{ cm}') });
        } },
        { id: 'e13c', level: 'EMG', make: function (r, sh) {
          var A = mul(sh.w, sumOf(sh.L)), v = sh.v, val = PL.at(A, { x: v }), w = PL.at(sh.w, { x: v }), l = PL.at(sumOf(sh.L), { x: v }), c2 = PL.coef(A, { x: 2 })[0], c1 = PL.coef(A, { x: 1 })[0];
          return KP.number('(c) Determine the area when ' + t('x=' + v) + '.', val, function (x) { return x === c2 * 2 * v + c1 * v ? { code: 'u3l2-subs', hint: t('x^{2}') + ' at ' + t('x=' + v) + ' is ' + t(v * v) + ', not ' + t(2 * v) + '.' } : x === 2 * (w + l) ? { code: 'u3l2-perimeter', hint: 'That’s the perimeter. Use the area.' } : null; },
            'Width ' + t(w) + ' cm, length ' + t(l) + ' cm, so the area is ' + t(w + '\\times ' + l + '=' + val) + ' ' + t('\\text{cm}^{2}') + '. (Or ' + t(tx(A).replace(/x/g, '(' + v + ')') + '=' + val) + '.)', ['Substitute into your area expression, or find the width and length first and multiply.'], 'area at x=' + v, { after: t('\\text{cm}^{2}') });
        } }] },
    { num: '14', stem: function (sh) { return 'A large rectangle measures ' + t(tx(sh.A)) + ' by ' + t(br(sh.B)) + '. A smaller rectangle measuring ' + t(tx(sh.a)) + ' by ' + t(br(sh.b)) + ' is cut out of it.' + cutSvg(plain(tx(sh.A)), plain(seq(sh.B)), plain(tx(sh.a)), plain(seq(sh.b))); },
      shared: function (r) { var p = r.int(3, 6), q = r.int(2, 5), s = r.int(1, 4), k = r.int(1, p - 1), c = r.int(1, 2), d = r.int(1, 4), v = r.int(2, 5); if (r.chance(0.15)) { p = 5; q = 4; s = 3; k = 2; c = 1; d = 1; v = 4; } return { A: xm(p), B: [xm(q), N(s)], a: xm(k), b: [xm(c), N(d)], v: v }; },
      parts: [
        { id: 'e14a', level: 'PRG', make: function (r, sh) {
          var big = mul(sh.A, sumOf(sh.B)), small = mul(sh.a, sumOf(sh.b)), T = sub(big, small);
          return pp('Write a simplified expression for the area of the <b>remaining</b> region.', T, [{ is: add(big, small), code: 'u3l2-cut-added', hint: 'The small rectangle is <b>cut out</b>: subtract its area.' }, { is: big, code: 'u3l2-whole', hint: 'That’s the whole large rectangle. Subtract the piece that was cut out.' }, { is: add(big, neg(termsOf(small)[0]), termsOf(small)[1]), code: 'sub-first', hint: 'Subtract the <b>whole</b> small area: put it in brackets so both of its terms change sign.' }],
            'Remaining = large − small:<br>' + t(tx(sh.A) + br(sh.B) + '-' + tx(sh.a) + br(sh.b) + '=(' + tx(big) + ')-(' + tx(small) + ')=' + seq(termsOf(big).concat(termsOf(small).map(neg))) + '=' + tx(T)),
            ['Find the area of each rectangle (distribute), then subtract the small one from the large one.', 'Put the small area in brackets when you subtract it.'], 'remaining area');
        } },
        { id: 'e14b', level: 'EMG', make: function (r, sh) {
          var big = mul(sh.A, sumOf(sh.B)), small = mul(sh.a, sumOf(sh.b)), T = sub(big, small), v = sh.v, val = PL.at(T, { x: v }), bv = PL.at(big, { x: v }), sv = PL.at(small, { x: v });
          return KP.number('Find the remaining area when ' + t('x=' + v) + '.', val, function (x) { return x === bv + sv ? { code: 'u3l2-cut-added', hint: 'Subtract the cut-out area, don’t add it.' } : x === bv ? { code: 'u3l2-whole', hint: 'That’s the whole large rectangle. Subtract the cut-out piece.' } : null; },
            'Large: ' + t(PL.at(sh.A, { x: v }) + '\\times ' + PL.at(sumOf(sh.B), { x: v }) + '=' + bv) + '; small: ' + t(PL.at(sh.a, { x: v }) + '\\times ' + PL.at(sumOf(sh.b), { x: v }) + '=' + sv) + '; remaining ' + t(bv + '-' + sv + '=' + val) + '. (Your expression gives the same: ' + t(tx(T).replace(/x/g, '(' + v + ')') + '=' + val) + '.)', ['Substitute into your expression from the previous part.'], 'remaining area at x=' + v);
        } }] },
    { num: '15', stem: function (sh) { return '<b>Reasoning.</b> A monomial of degree ' + t(sh.m) + ' is multiplied by a trinomial of degree ' + t(sh.n) + '.'; },
      shared: function (r) { var m = r.int(1, 4), n = r.int(2, 5); if (r.chance(0.2)) { m = 2; n = 3; } if (m * n === m + n) n = 3; return { m: m, n: n }; },
      parts: [
        { id: 'e15a', level: 'EMG', make: function (r, sh) {
          var d = sh.m + sh.n;
          return KP.mc(r, '(a) What is the degree of the product? (Answer without expanding.)', [
            { html: t(d) + ': multiplying adds exponents, so the highest-degree term of the trinomial times the monomial has degree ' + t(sh.n + '+' + sh.m + '=' + d) + '.', right: true },
            { html: t(sh.m * sh.n) + ': the degrees multiply.', why: 'When you multiply powers, the exponents <b>add</b>: ' + t('x^{' + sh.m + '}\\cdot x^{' + sh.n + '}=x^{' + d + '}') + '.' },
            { html: t(sh.n) + ': a product keeps the degree of the larger factor.', why: 'Every term is multiplied by the monomial, which raises each degree by ' + t(sh.m) + '.' },
            { html: 'It can’t be known without expanding.', why: 'Only the highest-degree term matters: (monomial) × (highest term).' }],
            'The highest-degree term of the product comes from the monomial times the trinomial’s highest-degree term: exponents add, ' + t(sh.m + '+' + sh.n + '=' + d) + '. (Example: ' + t('x^{' + sh.m + '}(x^{' + sh.n + '}+x+1)') + ' has leading term ' + t('x^{' + d + '}') + '.)', ['Which term of the product has the highest degree? How do exponents combine when you multiply?'], 'degree of product');
        } },
        { id: 'e15b', level: 'EMG', make: function (r) {
          return KP.mc(r, '(b) How many terms will the product have, before any collecting?', [
            { html: t('3') + ': the distributive property gives one product for each term in the brackets.', right: true },
            { html: t('4') + ': the monomial’s term is added to the three products.', why: 'The monomial isn’t added — it multiplies each of the three terms.' },
            { html: t('6') + ': each term is multiplied twice.', why: 'There is only one term outside the bracket, so each term inside is multiplied once.' },
            { html: t('1') + ': multiplying makes one term.', why: 'Distributing over a sum gives a sum: one product for each term in the brackets.' }],
            'Distributing one term over three terms gives exactly three products, e.g. ' + t('2x(x^{2}+3x-4)=2x^{3}+6x^{2}-8x') + '.', ['Count the arrows from the monomial to the terms in the brackets.'], 'number of terms');
        } }] },
    { num: '16', stem: '<b>Reasoning.</b> Nia claims that a monomial times a trinomial <b>always</b> gives a trinomial. Jae claims the answer could end up with fewer than three terms once like terms are collected.', parts: [
      { id: 'e16', level: 'PRG', make: function (r) {
        return KP.mc(r, 'Who is right?', [
          { html: 'Nia: the three terms of a (simplified) trinomial have different variable parts, and multiplying them all by the <b>same</b> monomial keeps them different, so there is nothing to collect.', right: true },
          { html: 'Jae: after distributing, some of the products are usually like terms that combine.', why: 'Try one: ' + t('2x(x^{2}+3x-4)=2x^{3}+6x^{2}-8x') + '. The same monomial raises every exponent by the same amount, so different terms stay different.' },
          { html: 'Jae: a negative monomial can make two of the terms cancel.', why: 'A negative monomial changes every sign, but terms can only cancel if they are like terms — and they never are here.' },
          { html: 'Neither: the product always has four terms.', why: 'One monomial times three terms gives three products.' }],
          'Nia is right (for a non-zero monomial and a simplified trinomial). The trinomial’s terms have different variable parts; multiplying each by the same monomial adds the same exponents to each, so the three products still have different variable parts and none can be collected.', ['Pick an example and try it. Can two of the products ever be like terms?'], 'Nia or Jae');
      } }] },
    { num: '17', stem: '<b>Stretch.</b>', parts: [
      { id: 'e17a', level: 'ADV', make: function (r) {
        var k = r.int(2, 3), a = r.int(2, 4), b = r.int(2, 5); if (r.chance(0.15)) { k = 2; a = 3; b = 4; }
        return expandMono(M(-k, { x: 2, y: 1 }), [M(a, { x: 1, y: 2 }), M(-b, { x: 2, y: 1 }), M(1, { y: 3 })], { pre: '(a) Expand ' });
      } },
      { id: 'e17b', level: 'MAS', make: function (r) {
        var a, b, k = r.pick([1, 1, 1, 2]);
        do { a = r.int(1, 4); b = r.int(1, 5) * (r.chance(0.3) ? -1 : 1); } while (a === b);
        if (r.chance(0.15)) { a = 1; b = 2; k = 1; }
        var m = xm(k), F1 = add(xm(1), N(a)), F2 = add(xm(1), N(b)), Q = mul(m, F1), T = mul(Q, F2);
        var prod = tx(m) + br(termsOf(F1)) + br(termsOf(F2));
        var ws = [{ is: mul(m, add(xm(1, 2), N(a * b))), code: 'fl-only', hint: 'Check ' + t(br(termsOf(F1)) + br(termsOf(F2))) + ': it needs all four products (First, Outside, Inside, Last), not just First and Last.' },
          { is: add(mul(Q, xm(1)), N(b)), code: 'first-only', hint: 'Multiply <b>every</b> term of ' + t(tx(Q)) + ' by <b>both</b> terms of ' + t(br(termsOf(F2))) + '.' },
          { is: add(mul(m, F1), mul(m, F2)), code: 'u3l2-asked-other', hint: 'The three factors are <b>multiplied</b>, not added. Multiply the first two, then multiply that result by the third.' }];
        var pieces = termsOf(Q).map(function (q) { return mul(q, F2); });
        return pp('(b) Expand and simplify ' + t(prod) + ' by distributing <b>twice</b>: multiply the first two factors together, then multiply that result by the third.', T, ws,
          'First: ' + t(tx(m) + br(termsOf(F1)) + '=' + tx(Q)) + '.<br>Then multiply each term of ' + t(tx(Q)) + ' by ' + t(br(termsOf(F2))) + ':<br>' + t(termsOf(Q).map(function (q, i) { var s = tx(q); return (i && s.charAt(0) !== '-' ? '+' : '') + s + br(termsOf(F2)); }).join('') + '=' + seq(pieces.reduce(function (acc, pc) { return acc.concat(termsOf(pc)); }, [])) + '=' + tx(T)),
          ['Multiply the first two factors: distribute ' + t(tx(m)) + '.', 'Then multiply each term of that result by both terms of ' + t(br(termsOf(F2))) + ' and collect like terms.'], 'three factors ' + prod);
      } }] }
  ];

  /* EP3: fraction coefficient */
  function fracPart(m, terms) {
    var T = mul(m, sumOf(terms)), num = PL.terms(m)[0].c[0], vm = PL.terms(m)[0].v, numOnly = mul(M(num, vm), sumOf(terms));
    return pp(t(tx(m) + br(terms)), T, monoWrongs(m, terms).concat([{ is: numOnly, code: 'u3l2-frac', hint: 'Multiply by the whole fraction ' + t(K.ratTex(PL.terms(m)[0].c)) + ': multiply by the numerator <b>and divide by the denominator</b>.' }]),
      distSol(m, terms), ['Multiply each coefficient inside by the fraction — e.g. ' + t('\\frac{1}{2}\\times 6=3') + ' — and add the exponents.', 'Every coefficient inside is a multiple of the denominator, so the answers are whole numbers.'], 'expand fraction monomial');
  }
  /* EP6: m[ A ± k(B) ] (op −1: A − (B); op = k > 1: A + k(B)) */
  function nestPart(m, A, op, Bt) {
    var Bp = sumOf(Bt), inner = op < 0 ? sub(A, Bp) : add(A, mul(N(op), Bp)), T = mul(m, inner);
    var inTex = tx(A) + (op < 0 ? '-' : '+' + op) + br(Bt), prodTex = tx(m) + '\\left[' + inTex + '\\right]';
    var wrongInner = op < 0 ? add(A, neg(Bt[0]), Bt[1]) : add(A, mul(N(op), Bt[0]), Bt[1]);
    var ws = [{ is: mul(m, wrongInner), code: op < 0 ? 'inner-sign' : 'first-only', hint: op < 0 ? 'Inside the bracket, the minus changes the sign of <b>both</b> terms of ' + t(br(Bt)) + '.' : 'Inside the bracket, ' + t(op) + ' multiplies <b>both</b> terms of ' + t(br(Bt)) + '.' }].concat(monoWrongs(m, termsOf(inner)));
    return pp(t(prodTex), T, ws, 'Inside first: ' + t(inTex + '=' + seq([A].concat(op < 0 ? Bt.map(neg) : Bt.map(function (q) { return mul(N(op), q); }))) + '=' + tx(inner)) + '.<br>' + distSol(m, termsOf(inner), 'Then distribute ' + t(tx(m)) + ':'),
      ['Simplify inside the square bracket first.', 'Then multiply ' + t(tx(m)) + ' by each term that is left.'], 'nested ' + prodTex);
  }
  /* EP8 */
  function e8Err(r, o, kind) {
    var T = mul(o.m, sumOf(o.ts)), prods = o.ts.map(function (q) { return mul(o.m, q); });
    var shown = o.who + ' wrote ' + t(tx(o.m) + br(o.ts) + '=' + seq(kind === 'first' ? [prods[0]].concat(o.ts.slice(1)) : [prods[0], neg(prods[1])])) + '.<br>What is the mistake?';
    var opts = kind === 'first' ? [
      { html: 'Only the first term in the bracket was multiplied by ' + t(tx(o.m)) + '; the other terms were copied down unchanged.', right: true },
      { html: 'The exponent of the first term is wrong.', why: t(tx(o.m) + '\\cdot x^{2}=' + tx(prods[0])) + ' is right. Look at the other terms.' },
      { html: 'The signs of the last two terms should be changed.', why: 'Multiplying by a <b>positive</b> monomial keeps every sign. The problem is something else.' },
      { html: 'There is no mistake.', why: 'Substitute ' + t('x=1') + ' into both sides: do they agree?' }] : [
      { html: 'Sign error in the second term: ' + t('(' + tx(o.m) + ')(' + tx(o.ts[1]) + ')=+' + tx(neg(prods[1])).replace(/^-/, '')) + ', because a negative times a negative is positive.', right: true },
      { html: 'The first term should be positive.', why: t('(' + tx(o.m) + ')(' + tx(o.ts[0]) + ')=' + tx(prods[0])) + ': a negative times a positive is negative. That term is right.' },
      { html: 'The ' + t('x') + ' should not be in the second term.', why: t(tx(o.m)) + ' has an ' + t('x') + ', so ' + t('x') + ' belongs in every product.' },
      { html: 'There is no mistake.', why: 'Check the second product: what is ' + t('(' + tx(o.m) + ')(' + tx(o.ts[1]) + ')') + '?' }];
    return KP.mc(r, shown, opts, kind === 'first' ? 'Every term in the bracket must be multiplied by ' + t(tx(o.m)) + ': ' + t(tx(o.m) + br(o.ts) + '=' + tx(T)) + '.' : 'The second product is ' + t('(' + tx(o.m) + ')(' + tx(o.ts[1]) + ')=' + tx(prods[1])) + ' (negative × negative = positive). The student kept the negative sign.',
      ['Redo each product yourself and compare.'], 'EP find the error ' + kind);
  }
  function e8Fix(o, kind) {
    var T = mul(o.m, sumOf(o.ts)), prods = o.ts.map(function (q) { return mul(o.m, q); });
    var given = kind === 'first' ? sumOf([prods[0]].concat(o.ts.slice(1))) : sumOf([prods[0], neg(prods[1])]);
    var p = expandMono(o.m, o.ts, { wrong: [{ is: given, code: 'kept-error', hint: 'That’s ' + o.who + '’s answer. ' + (kind === 'first' ? 'Multiply <b>every</b> term by ' + t(tx(o.m)) + '.' : 'Check the sign of the second product.') }] });
    p.prompt = 'Give the correct expansion of ' + t(tx(o.m) + br(o.ts)) + '.';
    return p;
  }
  /* EP11 / EP12: evaluate both forms */
  function subsPart(sh, pos) {
    var v = sh.v, env = { x: v }, m = PL.at(sh.m, env), inner = PL.at(sumOf(sh.ts), env), T = mul(sh.m, sumOf(sh.ts)), val = PL.at(T, env), flip = PL.at(T, { x: -v });
    var diag = function (x) { return x === flip && flip !== val ? { code: 'u3l2-subs', hint: 'Substitute ' + t('(' + v + ')') + ' in brackets: ' + t('(' + v + ')^{2}=' + v * v) + ' and ' + t('(' + v + ')^{3}=' + v * v * v) + '.' } : null; };
    return KP.fields('Evaluate <b>both</b> the original expression and your expansion at ' + t('x=' + v) + '.', [{ name: 'Original', label: 'Original' }, { name: 'Expanded', label: 'Expanded' }], [K.number(val, diag), K.number(val, diag)], [String(val), String(val)], t(val) + ' and ' + t(val) + ' — they agree',
      'Original: ' + t(pf(N(m)) + '\\times(' + seq(sh.ts).replace(/x/g, '(' + v + ')') + ')=' + pf(N(m)) + '\\times ' + pf(N(inner)) + '=' + val) + '.<br>Expanded: ' + t(tx(T).replace(/x/g, '(' + v + ')') + '=' + val) + '.<br>They agree, so the expansion checks out' + (pos ? '' : ' (if they didn’t, the expansion would have an error to find)') + '.',
      ['Original: work out the bracket first, then multiply by the monomial’s value.', 'Use brackets around ' + t(v) + ' when you substitute.'], 'check at x=' + v);
  }

  HW.defineLesson({
    id: 'u3l2', unit: 3, num: '2', title: 'Multiplying a Monomial by a Polynomial', outcome: 'AN4',
    blurb: 'Distributing one term across two or three, then collecting like terms without losing a sign.',
    questions: [
      /* ================= Part A ================= */
      { num: '1', section: 'Part A — Monomials and Binomials', stem: 'Multiply the monomials.', parts: [
        { id: '1a', level: 'LIM', make: function (r) { var a = r.int(2, 6), b = r.int(2, 5), e = r.int(2, 4), f = r.int(2, 5); if (a === 2 && b === 2) b = 3; if (r.chance(0.15)) { a = 3; b = 4; e = 2; f = 3; } return monoProd(a, e, b, f); } },
        { id: '1b', level: 'BEG', make: function (r) { var a = r.int(2, 5), b = r.int(2, 7), f = r.int(2, 5); if (r.chance(0.15)) { a = 2; b = 6; f = 4; } return monoProd(-a, 1, b, f); } },
        { id: '1c', level: 'LIM', make: function (r) { var a = r.int(2, 9), e = r.int(2, 5), f = r.int(2, 4); if (r.chance(0.15)) { a = 5; e = 3; f = 2; } return monoProd(a, e, 1, f); } },
        { id: '1d', level: 'BEG', make: function (r) { var a = r.int(2, 5), b = r.int(2, 5), e = r.int(2, 4), f = r.int(2, 6); if (r.chance(0.15)) { a = 4; b = 3; e = 2; f = 5; } return monoProd(-a, e, -b, f); } }] },
      { num: '2', stem: 'Use the distributive property to expand.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { var a = r.int(2, 9), b = r.int(1, 9); return expandMono(N(a), [xm(1), N(b)]); } },
        { id: '2b', level: 'LIM', make: function (r) { var a = r.int(2, 9), b = r.int(1, 9); return expandMono(N(a), [xm(1), N(-b)]); } },
        { id: '2c', level: 'BEG', make: function (r) { var a = r.int(2, 9), b = r.int(1, 9); return expandMono(N(-a), [xm(1), N(b)]); } },
        { id: '2d', level: 'BEG', make: function (r) { var a = r.int(2, 9), b = r.int(1, 9); return expandMono(N(-a), [xm(1), N(-b)]); } }] },
      { num: '3', stem: 'Expand.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var a = r.int(2, 9), b = r.int(1, 9); return expandMono(xm(a), [xm(1), N(b)]); } },
        { id: '3b', level: 'BEG', make: function (r) { var a = r.int(2, 9), b = r.int(1, 9); return expandMono(xm(a), [xm(1), N(-b)]); } },
        { id: '3c', level: 'BEG', make: function (r) { var a = r.int(2, 9), b = r.int(1, 9); return expandMono(xm(-a), [xm(1), N(b)]); } },
        { id: '3d', level: 'EMG', make: function (r) { var b = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'a', 'm']); return expandMono(xm(-1, 1, v), [xm(1, 1, v), N(-b)], { hints: [t('-x') + ' means ' + t('-1x') + ': multiply it by each term in the bracket.', 'A negative times a negative is positive.'] }); } }] },
      /* ================= Part B ================= */
      { num: '4', section: 'Part B — Trinomials and Collecting Like Terms', stem: 'Expand.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var a = r.int(2, 6), b = r.int(1, 6), c = r.int(1, 9); return expandMono(N(a), [xm(1, 2), xm(b), N(c)]); } },
        { id: '4b', level: 'BEG', make: function (r) { var a = r.int(2, 6), b = r.int(1, 6), c = r.int(1, 9); return expandMono(N(-a), [xm(1, 2), xm(-b), N(c)]); } },
        { id: '4c', level: 'BEG', make: function (r) { var a = r.int(2, 5), b = r.int(1, 6), c = r.int(1, 5); return expandMono(xm(a), [xm(1, 2), xm(b), N(-c)]); } },
        { id: '4d', level: 'EMG', make: function (r) { var a = r.int(2, 6), b = r.int(1, 4), c = r.int(1, 6); return expandMono(xm(-a), [xm(1, 2), xm(-b), N(c)]); } }] },
      { num: '5', stem: 'Expand and simplify.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var a = r.int(2, 6), b = r.int(1, 9), c = r.int(1, 9); return outsidePart(N(a), [xm(1), N(b)], xm(c), false); } },
        { id: '5b', level: 'BEG', make: function (r) { var a = r.int(2, 6), b = r.int(1, 9), c = r.int(1, 9); return outsidePart(N(a), [xm(1), N(-b)], xm(c), true); } },
        { id: '5c', level: 'BEG', make: function (r) { var a = r.int(3, 9), b = r.int(1, 6), c = r.int(1, a - 1); return outsidePart(N(a), [xm(1), N(-b)], xm(-c), false); } },
        { id: '5d', level: 'EMG', make: function (r) {
          var c = r.int(2, 9), a = r.int(2, 6), b = r.int(1, 9); if (c === a) c++;
          if (r.chance(0.15)) { c = 4; a = 3; b = 5; }
          return outsidePart(N(-a), [xm(1), N(b)], N(c), true, { wrong: [{ is: mul(N(c - a), add(xm(1), N(b))), code: 'subtract-first', hint: 'Multiplication comes before subtraction: expand ' + t('-' + a + '(x+' + b + ')') + ' first, then combine with ' + t(c) + '. You can’t do ' + t(c + '-' + a) + ' first.' }] });
        } }] },
      { num: '6', stem: 'Expand and simplify.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var a = r.int(2, 5), b = r.int(1, 9), c = r.int(1, 9); return outsidePart(xm(a), [xm(1), N(b)], xm(c), false); } },
        { id: '6b', level: 'EMG', make: function (r) { var a = r.int(2, 5), b = r.int(1, 9), c = r.int(1, 9); return outsidePart(xm(a), [xm(1), N(-b)], xm(-c), false); } },
        { id: '6c', level: 'EMG', make: function (r) { var b = r.int(2, 9), c = r.int(2, 5), d = r.int(1, 9); if (b === c) b++; return twoProducts(xm(1), [xm(1), N(b)], N(-c), [xm(1), N(d)]); } },
        { id: '6d', level: 'EMG', make: function (r) { var a = r.int(2, 5), b = r.int(1, 9), c = r.int(1, 9); if (a === c) c++; return twoProducts(N(a), [xm(1), N(-b)], xm(1), [xm(1), N(c)]); } }] },
      { num: '7', stem: 'Identify the error in each simplification below and give the correct simplification.', shared: function (r) { return q7Shared(r); }, parts: [
        { id: '7aerr', sub: 'a error', level: 'EMG', make: function (r, sh) { return q7Err(r, sh, 'a'); } },
        { id: '7a', sub: 'a fix', level: 'BEG', make: function (r, sh) { return q7Fix(sh, 'a'); } },
        { id: '7berr', sub: 'b error', level: 'EMG', make: function (r, sh) { return q7Err(r, sh, 'b'); } },
        { id: '7b', sub: 'b fix', level: 'BEG', make: function (r, sh) { return q7Fix(sh, 'b'); } },
        { id: '7cerr', sub: 'c error', level: 'EMG', make: function (r, sh) { return q7Err(r, sh, 'c'); } },
        { id: '7c', sub: 'c fix', level: 'EMG', make: function (r, sh) { return q7Fix(sh, 'c'); } }] },
      /* ================= Part C ================= */
      { num: '8', section: 'Part C — Two Distributions and Applications', stem: 'Expand and simplify.', parts: [
        { id: '8a', level: 'EMG', make: function (r) { var a = r.int(2, 5), b = r.int(1, 6), c = r.int(2, 5), d = r.int(1, 9); if (r.chance(0.15)) { a = 3; b = 4; c = 2; d = 5; } return twoProducts(xm(-a), [xm(1), N(b)], N(-c), [xm(1), N(-d)]); } },
        { id: '8b', level: 'PRG', make: function (r) { var a = r.int(2, 4), b = r.int(1, 6), c = r.int(2, 6), d = r.int(1, 6); if (a === c) c++; if (r.chance(0.15)) { a = 2; b = 3; c = 5; d = 1; } return twoProducts(xm(-a), [xm(1), N(-b)], xm(-c), [xm(1), N(d)]); } },
        { id: '8c', level: 'EMG', make: function (r) { var a = r.int(2, 5), p = r.int(2, 3), b = r.int(1, 4), c = r.int(2, 4), d = r.int(1, 5); if (r.chance(0.15)) { a = 4; p = 2; b = 1; c = 3; d = 2; } return twoProducts(xm(a), [xm(p), N(-b)], xm(-c), [xm(1), N(-d)]); } },
        { id: '8d', level: 'PRG', make: function (r) { var b = r.int(1, 9), c = r.int(2, 5), d = r.int(1, 6); if (r.chance(0.15)) { b = 6; c = 2; d = 3; } return twoProducts(xm(-1), [xm(1), N(b)], xm(c), [xm(1), N(-d)]); } }] },
      { num: '9', stem: function (sh) { return 'A rectangle has width ' + t(tx(sh.w)) + ' and length ' + t(br(sh.L)) + '.' + rectSvg(plain(seq(sh.L)), plain(tx(sh.w))); },
        shared: function (r) { var k = r.int(2, 6), c = r.int(2, 9); if (r.chance(0.15)) { k = 3; c = 8; } return { w: xm(k), L: [xm(1), N(c)] }; },
        parts: [
          { id: '9', level: 'BEG', make: function (r, sh) {
            var A = mul(sh.w, sumOf(sh.L)), P = add(mul(N(2), sh.w), mul(N(2), sumOf(sh.L)));
            return pp('Write a simplified expression for its area.', A, monoWrongs(sh.w, sh.L).concat([{ is: P, code: 'u3l2-perimeter', hint: 'That’s the perimeter. Area = length × width.' }, { is: add(sh.w, sumOf(sh.L)), code: 'u3l2-asked-other', hint: 'Area = length × width: <b>multiply</b> the two sides.' }]),
              distSol(sh.w, sh.L, 'Area = width × length:'), ['Area of a rectangle = length × width. Multiply ' + t(tx(sh.w)) + ' by each term of the length.'], 'rectangle area');
          } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'BEG', make: function (r) { return q10(r); } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) { return q11(r); } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '12', level: 'PRG', make: function (r) {
          var o = pickWhere(function () { return { p: r.int(2, 4), b: r.int(1, 6), q: r.int(1, 3), d: r.int(1, 6) }; }, function (o) { return o.p > o.q && o.p * o.b + o.q * o.d > 0; });
          if (r.chance(0.15)) o = { p: 2, b: 3, q: 1, d: 4 };
          var A = mul(xm(o.p), add(xm(1), N(o.b))), Bm = mul(xm(-o.q), add(xm(1), N(-o.d))), T = add(A, Bm), a = PL.coef(T, { x: 2 })[0], b = PL.coef(T, { x: 1 })[0], ans = a + b;
          var sl = add(A, xm(-o.q, 2), xm(-o.q * o.d)), slip = PL.coef(sl, { x: 2 })[0] + PL.coef(sl, { x: 1 })[0];
          var ex = tx(xm(o.p)) + br([xm(1), N(o.b)]) + mNext(xm(-o.q)) + br([xm(1), N(-o.d)]);
          return KP.nr('The expression ' + t(ex) + ' can be written in the form ' + t('ax^{2}+bx') + '. The value of ' + t('a+b') + ' is ________.', ans, function (v) {
            if (v === slip && slip !== ans) return { code: 'neg-first', hint: 'Check the second product: ' + t('(' + tx(xm(-o.q)) + ')(-' + o.d + ')=+' + o.q * o.d + 'x') + '.' };
            if (v === a * b && a * b !== ans) return { code: 'u3l2-asked-other', hint: 'That is ' + t('a\\times b') + '. The question asks for ' + t('a+b') + '.' };
            return null;
          }, 'Expand: ' + t(tx(A)) + ' and ' + t(tx(Bm)) + '. Collect: ' + t(tx(T)) + ', so ' + t('a=' + a) + ' and ' + t('b=' + b) + '.<br>' + t('a+b=' + a + '+' + (b < 0 ? '(' + b + ')' : b) + '=' + ans) + '.',
          ['Expand both products, collect like terms, then read off ' + t('a') + ' (the ' + t('x^{2}') + ' coefficient) and ' + t('b') + ' (the ' + t('x') + ' coefficient).'], 'NR a+b');
        } }] },
      { num: '13', stem: 'Expand and simplify.', parts: [
        { id: '13a', level: 'EMG', make: function (r) { var a = r.int(3, 6), b = r.int(1, 5), c = r.int(1, a - 1), d = r.int(1, 5); if (r.chance(0.15)) { a = 5; b = 2; c = 3; d = 1; } return twoProducts(xm(a), [xm(1), N(b)], xm(-c), [xm(1), N(-d)]); } },
        { id: '13b', level: 'EMG', make: function (r) { var a = r.int(2, 4), p = r.int(2, 4), b = r.int(1, 6), c = r.int(2, 6), d = r.int(1, 5); if (r.chance(0.15)) { a = 2; p = 3; b = 4; c = 5; d = 2; } return twoProducts(xm(-a), [xm(p), N(-b)], N(c), [xm(1), N(d)]); } }] },
      { num: '14', stem: 'Expand and simplify.', parts: [
        { id: '14', level: 'PRG', make: function (r) { var a = r.int(2, 4), p = r.int(2, 3), b = r.int(1, 3), c = r.int(2, 4), d = r.int(2, 6); if (r.chance(0.15)) { a = 3; p = 2; b = 1; c = 2; d = 5; } return twoProducts(xm(-a), [xm(p), N(b)], xm(-c), [xm(1), N(-d)]); } }] },
      { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '15', level: 'PRG', make: function (r) {
          var o = pickWhere(function () {
            var pos = r.chance(0.5), p = r.int(2, 5), q = r.int(1, 4), s = r.int(1, 5), u = r.int(1, 6);
            return pos ? { m1: -p, s1: -s, m2: p + q, s2: u } : { m1: -(q + r.int(1, 3)), s1: s, m2: q, s2: -u };
          }, function (o) {
            var T = add(mul(xm(o.m1), add(xm(1), N(o.s1))), mul(xm(o.m2), add(xm(1), N(o.s2)))), a = PL.coef(T, { x: 2 })[0], b = PL.coef(T, { x: 1 })[0];
            return a && b && a * b > 0 && a * b <= 200 && o.m1 !== -o.m2;
          });
          if (r.chance(0.15)) o = { m1: -4, s1: 2, m2: 3, s2: -5 };
          var A = mul(xm(o.m1), add(xm(1), N(o.s1))), Bm = mul(xm(o.m2), add(xm(1), N(o.s2))), T = add(A, Bm), a = PL.coef(T, { x: 2 })[0], b = PL.coef(T, { x: 1 })[0], ans = a * b;
          var ex = tx(xm(o.m1)) + br([xm(1), N(o.s1)]) + mNext(xm(o.m2)) + br([xm(1), N(o.s2)]);
          var slipA = add(xm(o.m1, 2), xm(-o.m1 * o.s1)), slT = add(slipA, Bm), slip = PL.coef(slT, { x: 2 })[0] * PL.coef(slT, { x: 1 })[0];
          return KP.nr('The expression ' + t(ex) + ' can be written in the form ' + t('ax^{2}+bx') + '. The value of ' + t('a\\times b') + ' is ________.', ans, function (v) {
            if (v === a + b && a + b !== ans) return { code: 'u3l2-asked-other', hint: 'That is ' + t('a+b') + '. The question asks for ' + t('a\\times b') + '.' };
            if (v === -ans) return { code: 'sign', hint: 'Check the signs of ' + t('a') + ' and ' + t('b') + ': ' + t('a=' + a) + ', and ' + t('b') + ' has the same sign.' };
            if (v === slip && slip !== ans) return { code: 'neg-first', hint: 'Check the first product: the negative monomial multiplies <b>both</b> terms, ' + t('(' + tx(xm(o.m1)) + ')(' + o.s1 + ')=' + tx(xm(o.m1 * o.s1))) + '.' };
            return null;
          }, 'Expand: ' + t(tx(A)) + ' and ' + t(tx(Bm)) + '. Collect: ' + t(tx(T)) + ', so ' + t('a=' + a) + ' and ' + t('b=' + b) + '.<br>' + t('a\\times b=(' + a + ')(' + b + ')=' + ans) + '.',
          ['Expand both products and collect like terms.', 'Then ' + t('a') + ' is the coefficient of ' + t('x^{2}') + ' and ' + t('b') + ' the coefficient of ' + t('x') + ', signs included.'], 'NR a×b');
        } }] }
    ],
    extra: EXTRA
  });
})(window);
