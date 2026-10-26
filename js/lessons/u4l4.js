/* Math 15 · Unit 4 · Lesson 4 — Factoring Trinomials x² + bx + c, Part 2: c Negative (AN5)
 * Assignment 4, questions 1–15 (u4_L04.tex) and the Lesson 4 Extra Practice (u4_EP04.tex).
 * Built on the Math 10C Unit 4 Lesson 3 practice: the same helpers, checkers, diagnoses and wrong-answer codes.
 * Every part is a generator that keeps the booklet question's structure (which number is bigger, the sign of b, a
 * common factor to take out first, a second variable, a trinomial that is prime) and changes the numbers; the booklet's
 * own numbers are among the possible values. Each trinomial is built from its factors (`spec`), so the key is the
 * factorization it was made from. "Factor where possible" / "prime or not" parts use one box with a <b>none</b> key.
 * Levels (calibrated for Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, P = HW.poly, FX = HW.factor;

  HW.addCodes({
    'pair-sum': 'Pair with the right product but the wrong sum', 'pair-product': 'Pair with the right sum but the wrong product',
    'pair-signs': 'Pair with the wrong signs', 'swap-bc': 'Numbers multiply to b and add to c (roles swapped)',
    'gcf-dropped': 'Dropped the common factor', 'gcf-part': 'Took out only part of the GCF', 'y-missing': 'Second variable missing from a bracket',
    'said-none': 'Said it can’t be factored (it can)', 'no-pair': 'Wrote factors for a trinomial that doesn’t factor', 'use-none': 'Retyped a trinomial that doesn’t factor',
    'sign-in-blank': 'Typed a sign the bracket already shows', 'gave-sum': 'Gave the sum instead of the missing number', 'gave-product': 'Gave the product instead of the missing number',
    'whole-bracket': 'Typed only the number, not the whole bracket', 'swap-dims': 'Length and width swapped', 'not-subst': 'Substitution slip',
    'not-smallest': 'Correct kind, but not the smallest', 'gave-c': 'Gave c instead of b', 'no-negatives': 'Forgot the negative values', 'not-b': 'Listed a value that isn’t a pair sum',
    'missing-b': 'Missed some values of b', 'sum-squares': 'Factored a sum of squares', 'fl-only': 'Expanded with only First and Last',
    'c-extra': 'Listed a c that doesn’t factor (or is out of range)', 'c-missing': 'Missed some values of c',
    'u4l4-size-sum': 'Added the sizes of an opposite-sign pair (c < 0, so they subtract)', 'u4l4-b-zero': 'Gave b = 0 (not positive)',
    'sq-no-middle': 'Perfect square written without its middle term', 'u4l4-pair-missing': 'Missed some factor pairs', 'u4l4-pair-wrong': 'Listed a pair that doesn’t multiply to the number', 'u4l4-dim-zero': 'Gave the x that makes a dimension 0'
  });
  HW.addPartial({ 'u4l4-size-sum': 'n', 'u4l4-b-zero': 'n', 'u4l4-pair-missing': 's', 'u4l4-pair-wrong': 'n', 'u4l4-dim-zero': 's' });

  /* ---------------- small tools ---------------- */
  function pickWhere(gen, test) { for (var i = 0; i < 800; i++) { var o = gen(); if (test(o)) return o; } throw new Error('u4l4: no instance found'); }
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function V(v, e) { var o = {}; o[v] = e || 1; return P.mono(1, o); }
  function bin(u, n, w) { return P.add(u, P.scale(w || P.num(1), n)); }
  function tx(p) { return P.tex(p); }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function factorable(b, c) { return isSq(b * b - 4 * c); }
  function posPairs(n) { n = Math.abs(n); var o = []; for (var u = 1; u * u <= n; u++) if (n % u === 0) o.push([u, n / u]); return o; }
  function pairsTex(n) { return posPairs(n).map(function (pq) { return pq[0] + '\\times ' + pq[1]; }).join(',\\ \\ '); }
  function signedPairs(c) { var o = []; posPairs(c).forEach(function (pq) { if (c > 0) { o.push([pq[0], pq[1]]); o.push([-pq[0], -pq[1]]); } else { o.push([pq[1], -pq[0]]); o.push([-pq[1], pq[0]]); } }); return o; }
  function triTex(v, b, c) { return tx(P.add(V(v, 2), P.scale(V(v), b), P.num(c))); }
  function varsOf(p) { var vs = P.vars(p); return vs.length ? vs : ['x']; }
  function signHint(b, c) {
    if (c > 0) return b > 0 ? 'The product is positive and the sum is positive, so <b>both</b> integers are positive.' : 'The product is positive but the sum is negative, so <b>both</b> integers are negative.';
    if (b === 0) return 'The product is negative, so one integer is positive and one is negative; a sum of ' + t('0') + ' means they are the same size.';
    return 'The product is negative, so one integer is positive and one is negative. The <b>larger</b> one (further from ' + t('0') + ') has the same sign as the sum, ' + t(b) + '.';
  }
  /* a pair of sizes [big, small] for a trinomial with c < 0, by kind (each kind has 20+ versions and the booklet's numbers) */
  var KIND = {
    one: function (r) { var s = r.int(1, 3); return [r.int(s + 2, 11), s]; },
    close: function (r) { return pickWhere(function () { var s = r.int(2, 7); return [s + r.int(1, 4), s]; }, function (o) { return o[0] * o[1] <= 60; }); },
    mid: function (r) { return pickWhere(function () { var s = r.int(2, 5); return [r.int(s + 2, 10), s]; }, function (o) { return o[0] * o[1] <= 50; }); },
    big: function (r) { return pickWhere(function () { return [r.int(8, 12), r.int(2, 5)]; }, function (o) { return o[0] * o[1] <= 60; }); },
    two: function (r) { var s = r.int(2, 3); return [r.int(s + 1, 13), s]; },
    mix: function (r) { return pickWhere(function () { var s = r.int(2, 4); return [r.int(s + 3, 12), s]; }, function (o) { return o[0] * o[1] <= 48; }); }
  };
  /* a trinomial x² + bx + c with c < 0 that does not factor */
  function primeNeg(r, bmax, cmin, cmax) { return pickWhere(function () { return { b: r.int(1, bmax || 6) * (r.chance(0.75) ? 1 : -1), c: -r.int(cmin || 5, cmax || 24) }; }, function (o) { return !factorable(o.b, o.c); }); }

  /* ---------------- a factorable trinomial, built from its factors ----------------
   * o = { v: 'x', e: 1 (power of the letter), y: second letter, G: common factor (polynomial), p, q }
   * full = G · (u + p·w)(u + q·w), where u = v^e and w = y (or 1). */
  function spec(o) {
    var u = o.u || V(o.v || 'x', o.e || 1), w = o.y ? V(o.y) : null, G = o.G || P.num(1);
    var A = bin(u, o.p, w), Bq = bin(u, o.q, w), inner = P.mul(A, Bq), full = P.mul(G, inner), g1 = P.eq(G, P.num(1));
    var list = o.p === o.q ? [{ p: A, k: 2 }] : [A, Bq];
    if (!g1) list = [G].concat(list);
    var gt = tx(G);
    return { u: u, w: w, G: G, g1: g1, p: o.p, q: o.q, b: o.p + o.q, c: o.p * o.q, A: A, B: Bq, inner: inner, full: full, list: list, key: FX.tex(list),
      gtex: gt, gpre: gt === '-1' ? '-' : gt };
  }
  function coefRel(S, m) { var tm = P.terms(m)[0], c = P.coef(S, tm.v); return (c[0] * tm.c[1]) / (c[1] * tm.c[0]); }
  /* reads the student's two numbers from the product of their factors and says what is off */
  function pairDiag(s) {
    var m2 = P.mul(s.G, P.pow(s.u, 2)), m1 = P.mul(s.G, s.u, s.w || 1), m0 = P.mul(s.G, s.w ? P.pow(s.w, 2) : 1);
    var b = s.b, c = s.c, inside = s.g1 ? '' : ' (inside the bracket)';
    return function (S) {
      var L = coefRel(S, m2), M = coefRel(S, m1), C = coefRel(S, m0);
      if (L !== 1 || M % 1 || C % 1) return null;
      if (!P.eq(S, P.add(m2, P.scale(m1, M), P.scale(m0, C)))) return null;
      var pre = 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(s.full)) + '. ';
      if (C === c && M === -b) return { code: 'pair-signs', hint: pre + 'Your numbers multiply to ' + t(c) + ' but add to ' + t(-b) + ', not ' + t(b) + ': the signs are backwards. ' + signHint(b, c) };
      if (M === c && C === b && b !== c) return { code: 'swap-bc', hint: pre + 'Your numbers multiply to ' + t(b) + ' and add to ' + t(c) + ' — the wrong way round. They must <b>multiply to the constant</b> ' + t(c) + ' and <b>add to the middle coefficient</b> ' + t(b) + inside + '.' };
      if (C === c) return { code: 'pair-sum', hint: pre + 'Your numbers multiply to ' + t(c) + ' ✓ but add to ' + t(M) + ', not ' + t(b) + '. Try another factor pair of ' + t(Math.abs(c)) + '.' };
      if (M === b && C === -c) return { code: 'pair-signs', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(-c) + ', not ' + t(c) + '. ' + (c > 0 ? 'A positive product needs two numbers with the <b>same</b> sign.' : 'A negative product needs one positive and one negative number.') };
      if (M === b) return { code: 'pair-product', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(C) + ', not ' + t(c) + '. The last terms of the brackets must multiply to the constant term' + inside + '.' };
      if (C === -c && M === -b) return { code: 'pair-signs', hint: pre + 'Every sign in your brackets is backwards. The numbers must multiply to ' + t(c) + ' and add to ' + t(b) + '.' };
      if (C === -c) return { code: 'pair-signs', hint: pre + 'Your numbers multiply to ' + t(C) + ', not ' + t(c) + '. ' + (c > 0 ? 'A positive product needs two numbers with the <b>same</b> sign.' : 'A negative product needs one positive and one negative number.') + ' Then choose the pair that adds to ' + t(b) + '.' };
      return null;
    };
  }
  /* classic wrong factorizations: dropped / partial GCF, a missing second variable */
  function stdWrongs(s) {
    var out = [];
    if (!s.g1) {
      out.push({ is: s.inner, code: 'gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(s.gtex) + ' is missing. Multiply your answer out: you get ' + t(tx(s.inner)) + ', not ' + t(tx(s.full)) + '.' });
      var gt = P.terms(s.G)[0], gv = Object.keys(gt.v).length, gn = gt.c[0] / gt.c[1];
      if (gv && Math.abs(gn) !== 1) {
        out.push({ is: P.mul(P.num(gn), s.inner), code: 'gcf-part', hint: 'Take out the <b>whole</b> common factor: every term also has a factor of ' + t(P.monoTex(gt.v)) + '. The GCF is ' + t(s.gtex) + '.' });
        out.push({ is: P.mul(P.mono(gn < 0 ? -1 : 1, gt.v), s.inner), code: 'gcf-part', hint: 'Take out the <b>whole</b> common factor: every coefficient is also divisible by ' + t(Math.abs(gn)) + '. The GCF is ' + t(s.gtex) + '.' });
      } else if (gv) out.push({ is: P.mul(P.num(gn), s.inner), code: 'gcf-part', hint: 'Take out the <b>whole</b> common factor: every term also has a factor of ' + t(P.monoTex(gt.v)) + '. The GCF is ' + t(s.gtex) + '.' });
    }
    if (s.w) {
      var yh = 'Each bracket needs its own ' + t(tx(s.w)) + ': the last term ' + t(tx(P.mul(P.num(s.c), P.pow(s.w, 2)))) + ' comes from multiplying the two last terms, so each must supply one ' + t(tx(s.w)) + '.';
      out.push({ is: P.mul(s.G, bin(s.u, s.p), bin(s.u, s.q, s.w)), code: 'y-missing', hint: yh });
      out.push({ is: P.mul(s.G, bin(s.u, s.p, s.w), bin(s.u, s.q)), code: 'y-missing', hint: yh });
      out.push({ is: P.mul(s.G, bin(s.u, s.p), bin(s.u, s.q)), code: 'y-missing', hint: 'Don’t leave out ' + t(tx(s.w)) + ': factor it like ' + t(tx(P.mul(bin(s.u, s.p), bin(s.u, s.q)))) + ', then put ' + t(tx(s.w)) + ' with the second term of each bracket.' });
    }
    return out.filter(function (w) { return !P.eq(w.is, s.full); });
  }
  function foilTex(s) {
    var w = s.w || P.num(1);
    return P.seq([P.pow(s.u, 2), P.mul(s.u, w, P.num(s.q)), P.mul(s.u, w, P.num(s.p)), P.mul(P.pow(w, 2), P.num(s.c))].filter(function (x) { return P.count(x); }));
  }
  function solFac(s, opt) {
    opt = opt || {};
    var out = [], ride = s.w ? ' The ' + t(tx(s.w)) + ' rides along with the second term of each bracket.' : '';
    if (!s.g1) out.push('Take out the common factor ' + t(s.gtex) + ' first: ' + t(tx(s.full) + '=' + s.gpre + '(' + tx(s.inner) + ')') + '.');
    if (P.degree(s.u) > 1 && !s.w) out.push('Think of it as a trinomial in ' + t(tx(s.u)) + ': ' + t('(' + tx(s.u) + ')^{2}=' + tx(P.pow(s.u, 2))) + '.');
    out.push('Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(s.p)) + ' and ' + t(sg(s.q)) + '.' + ride);
    out.push(t(tx(s.full) + '=' + s.key));
    if (opt.check) out.push('Check: ' + t('(' + tx(s.A) + ')(' + tx(s.B) + ')=' + foilTex(s) + '=' + tx(s.inner)) + ' ✓');
    return out.join('<br>');
  }
  function hintsFac(s) {
    var pair = 'Look for two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + '.';
    if (!s.g1) return ['Every term has a common factor of ' + t(s.gtex) + '. Take it out first, then factor the trinomial left in the bracket.', pair + ' ' + signHint(s.b, s.c)];
    if (s.w) return [pair + ' ' + signHint(s.b, s.c), 'Each bracket has the form ' + t('(' + tx(s.u) + '+\\square ' + tx(s.w) + ')') + '.'];
    return [pair, signHint(s.b, s.c)];
  }
  /* "factor (completely)" part */
  function facPart(s, opt) {
    opt = opt || {};
    var prompt = opt.prompt || t(tx(s.full));
    var part = B.factored(prompt, s.list, { wrong: stdWrongs(s).concat(opt.wrong || []), diag: pairDiag(s), keyTex: s.key, vars: varsOf(s.full) },
      opt.sol || solFac(s, opt), opt.hints || hintsFac(s), opt.text || 'factor ' + tx(s.full));
    var A = '(' + tx(s.A) + ')', Bt = '(' + tx(s.B) + ')', pre = s.g1 ? '' : s.gpre;
    part.good = [pre + Bt + A];
    if (s.p === s.q) part.good.push(pre + A + A);
    var flip = P.mul(s.G, bin(s.u, -s.p, s.w), bin(s.u, -s.q, s.w)), bad = [];
    if (!P.eq(flip, s.full)) bad.push(pre + '(' + tx(bin(s.u, -s.p, s.w)) + ')(' + tx(bin(s.u, -s.q, s.w)) + ')');
    if (!s.g1) bad.push(A + Bt);
    part.bad = bad.concat(opt.bad || []);
    return part;
  }

  /* ---------------- "factor where possible": one box with a none key ---------------- */
  function noneField(vars) { return [{ name: 'Factored form', label: 'Factored form', mode: 'math', keys: 'poly', vars: vars, none: true, wide: true, placeholder: 'e.g. (x - 4)(x + 2)' }]; }
  function noneVal(resp) { var v = String((resp || [])[0] || '').trim(); return /^\\(text|mathrm)\{\s*none\s*\}$/i.test(v) ? 'none' : v; }
  var NONE_EMPTY = 'Type the factored form, or press <b>none</b> if it can’t be factored over the integers.';
  function canPart(s, opt) {
    var base = facPart(s, opt), chk = base.check;
    return { prompt: base.prompt, input: { type: 'fields', fields: noneField(varsOf(s.full)) }, key: [base.key], answer: base.answer, solution: base.solution, hints: base.hints, text: base.text,
      check: function (resp) {
        var v = noneVal(resp);
        if (!v) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(v)) return wrong('said-none', 'It <b>can</b> be factored: there is a pair of integers with product ' + t(s.c) + ' and sum ' + t(s.b) + '. Go through the factor pairs of ' + t(Math.abs(s.c)) + ' again. ' + signHint(s.b, s.c));
        return chk(v);
      },
      good: base.good.map(function (g) { return [g]; }), bad: [['none']].concat(base.bad.map(function (b) { return [b]; })) };
  }
  function nonePart(v, b, c, opt) {
    opt = opt || {};
    var T = P.add(V(v, 2), P.scale(V(v), b), P.num(c)), sp = signedPairs(c);
    var sol = 'Need two integers with product ' + t(c) + ' and sum ' + t(b) + '.<br>Pairs with product ' + t(c) + ': ' + sp.map(function (pq) { return t(pq[0] + '\\ \\&\\ ' + pq[1]) + ' (sum ' + t(pq[0] + pq[1]) + ')'; }).join(', ') + '.<br>No pair has sum ' + t(b) + ', so ' + t(tx(T)) + ' <b>cannot be factored</b> over the integers — it is <b>prime</b>.';
    var near = sp.slice().sort(function (x, y) { return Math.abs(x[0] + x[1] - b) - Math.abs(y[0] + y[1] - b); })[0];
    return { prompt: opt.prompt || t(tx(T)), input: { type: 'fields', fields: noneField([v]) }, key: ['none'], answer: 'It cannot be factored over the integers (it is prime).', solution: sol,
      hints: ['List every pair of integers with product ' + t(c) + ' and add each pair (both sign arrangements). Is any sum equal to ' + t(b) + '?', 'If no pair works, the trinomial is prime — press <b>none</b>.'], text: opt.text || 'factor where possible ' + tx(T) + ' (none)',
      check: function (resp) {
        var s = noneVal(resp);
        if (!s) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(s)) return ok();
        var a = K.read(s); if (a.res) return a.res;
        var spl = FX.split(a.ast); if (!spl.ok) return wrong('value', null);
        var S = spl.factors.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, P.num(1));
        if (P.eq(S, T)) return form('use-none', 'That is the trinomial itself. If no pair of integers works, press <b>none</b>.');
        return wrong('no-pair', 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(T)) + '. Test every pair of integers with product ' + t(c) + ': does any pair add to ' + t(b) + '?');
      },
      bad: [['(' + tx(bin(V(v), near[0])) + ')(' + tx(bin(V(v), near[1])) + ')'], [tx(T)]] };
  }

  /* ---------------- two integers with a given sum and product ---------------- */
  function pairSol(p, q) {
    var s = p + q, c = p * q;
    return signHint(s, c) + '<br>Factor pairs of ' + t(Math.abs(c)) + ': ' + t(pairsTex(c)) + '.<br>' + t(sg(p)) + ' and ' + t(sg(q)) + ': product ' + t(par(p) + '\\times ' + par(q) + '=' + c) + ', sum ' + t(par(p) + '+' + par(q) + '=' + s) + ' ✓';
  }
  function pairCheck(p, q) {
    var s = p + q, c = p * q;
    return function (resp) {
      resp = resp || [];
      var A = HW.parse.number(resp[0] == null ? '' : resp[0]), Bn = HW.parse.number(resp[1] == null ? '' : resp[1]);
      if (!A.ok || !Bn.ok) return form('empty', 'Enter one integer in each box.');
      var x = A.value, y = Bn.value;
      if ((x === p && y === q) || (x === q && y === p)) return ok();
      var both = 'Yours: ' + t(par(x) + '\\times ' + par(y) + '=' + x * y) + ' and ' + t(par(x) + '+' + par(y) + '=' + (x + y)) + '. ';
      if (x * y === c && x + y === -s) return wrong('pair-signs', both + 'Right product, but the sum must be ' + t(s) + ', not ' + t(-s) + '. ' + signHint(s, c));
      if (x * y === c) return wrong('pair-sum', both + 'The product is right ✓ but the sum must be ' + t(s) + '. Try another factor pair of ' + t(Math.abs(c)) + '.');
      if (x + y === s && x * y === -c) return wrong('pair-signs', both + 'The sum is right ✓ but the product must be ' + t(c) + '. ' + (c > 0 ? 'A positive product needs two numbers with the same sign.' : 'A negative product needs one positive and one negative number.'));
      if (x + y === s) return wrong('pair-product', both + 'The sum is right ✓ but the product must be ' + t(c) + '. Start from the factor pairs of ' + t(Math.abs(c)) + ' instead.');
      if ((Math.abs(x) === Math.abs(p) && Math.abs(y) === Math.abs(q)) || (Math.abs(x) === Math.abs(q) && Math.abs(y) === Math.abs(p))) return wrong('pair-signs', both + 'Right sizes — now fix the signs. ' + signHint(s, c));
      return wrong('value', both + 'Find two integers that multiply to ' + t(c) + ' and add to ' + t(s) + '.');
    };
  }
  function pairPart(p, q, opt) {
    opt = opt || {};
    var s = p + q, c = p * q, lab = ['Integer 1', 'Integer 2'];
    var hi = Math.abs(p) >= Math.abs(q) ? p : q, lo = hi === p ? q : p;
    return { prompt: opt.prompt || 'Sum ' + t(s) + ', product ' + t(c) + '.', input: { type: 'fields', fields: [{ name: lab[0], label: lab[0] }, { name: lab[1], label: lab[1] }] },
      check: pairCheck(p, q), key: [String(hi), String(lo)], answer: t(hi + ',\\ ' + lo), solution: opt.sol || pairSol(p, q),
      hints: ['List the factor pairs of ' + t(Math.abs(c)) + '. With one number negative, the sum is the <b>difference</b> of the two sizes.', signHint(s, c)], text: opt.text || 'pair: sum ' + s + ', product ' + c,
      good: [[String(lo), String(hi)]], bad: [[String(-hi), String(-lo)], [String(Math.abs(hi)), String(Math.abs(lo))]].filter(function (b) { var x = +b[0], y = +b[1]; return !((x === p && y === q) || (x === q && y === p)); }) };
  }

  /* ---------------- two polynomial / number answers in either order ---------------- */
  function numField(label, after) { return { name: label, label: label, after: after }; }

  /* ---------------- blanks in a factored form ---------------- */
  function blankNumPart(s, given, missing, bracketSign, prompt, text) {
    // s: spec; given/missing: the two integers (missing is what the blank completes); bracketSign: +1 for (x + _), -1 for (x − _)
    var want = Math.abs(missing), full = facPart(s), v = tx(s.u);
    return { prompt: prompt, input: { type: 'number', before: 'Blank =' }, key: String(want), answer: t(want) + ', so ' + t(s.key),
      check: function (resp) {
        var pn = HW.parse.number(resp);
        if (!pn.ok) return form(pn.code === 'empty' ? 'empty' : 'notnumber', pn.code === 'empty' ? 'Type your answer first.' : 'Enter a single number.');
        var e = pn.value, n = bracketSign * e;
        if (n === missing) return ok();
        if (bracketSign < 0 && e === missing) return form('sign-in-blank', 'The bracket already shows the minus sign, so type just the number: ' + t('(' + v + '-3)') + ' means the integer ' + t('-3') + '.');
        if (e === s.b || e === -s.b) return wrong('gave-sum', t(Math.abs(s.b)) + ' comes from the middle term — it is the <b>sum</b>. The blank holds the number that pairs with ' + t(sg(given)) + ': together they multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '.');
        if (e === s.c || e === -s.c) return wrong('gave-product', t(Math.abs(s.c)) + ' is the <b>product</b> of the two numbers. Which number times ' + t(par(given)) + ' gives ' + t(s.c) + '?');
        return full.check('(' + tx(bin(s.u, given)) + ')(' + tx(bin(s.u, n)) + ')');
      },
      solution: 'Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(given)) + ' and ' + t(sg(missing)) + '.<br>The bracket shows the sign already, so the blank is ' + t(want) + ': ' + t(tx(s.full) + '=' + s.key) + '.',
      hints: ['The two numbers in the brackets multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '. One of them is ' + t(sg(given)) + '.', 'What times ' + t(par(given)) + ' gives ' + t(s.c) + '?'], text: text,
      bad: [String(Math.abs(s.b)), String(-want)].filter(function (b) { return +b !== want; }) };
  }
  /* two blanks in brackets that already show their signs: signs = [+1|-1, +1|-1]; s.p goes in the first bracket */
  function blankSignedPart(s, signs, prompt, text) {
    var full = facPart(s), v = tx(s.u), w1 = Math.abs(s.p), w2 = Math.abs(s.q), lab = ['First blank', 'Second blank'];
    return { prompt: prompt, input: { type: 'fields', fields: [{ name: lab[0], label: lab[0] }, { name: lab[1], label: lab[1] }] }, key: [String(w1), String(w2)],
      answer: t(w1) + ' and ' + t(w2) + ', so ' + t(s.key),
      check: function (resp) {
        resp = resp || [];
        var A = HW.parse.number(resp[0] == null ? '' : resp[0]), Bn = HW.parse.number(resp[1] == null ? '' : resp[1]);
        if (!A.ok || !Bn.ok) return form('empty', 'Enter one number in each blank.');
        var x = signs[0] * A.value, y = signs[1] * Bn.value;
        if (x === s.p && y === s.q) return ok();
        if ((A.value < 0 && signs[0] < 0) || (Bn.value < 0 && signs[1] < 0)) if (Math.abs(A.value) === w1 && Math.abs(Bn.value) === w2) return form('sign-in-blank', 'The brackets already show the signs, so type just the numbers: ' + t('(' + v + '-3)') + ' means the integer ' + t('-3') + '.');
        if (A.value === Math.abs(s.b) || Bn.value === Math.abs(s.b)) if (A.value * Bn.value !== Math.abs(s.c)) return wrong('gave-sum', t(Math.abs(s.b)) + ' is the <b>sum</b> (the middle coefficient), not one of the numbers. The two numbers multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '.');
        return full.check('(' + tx(bin(s.u, x)) + ')(' + tx(bin(s.u, y)) + ')');
      },
      solution: 'Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(s.p)) + ' and ' + t(sg(s.q)) + '. ' + signHint(s.b, s.c) + '<br>The brackets already carry the signs, so the blanks are ' + t(w1) + ' and ' + t(w2) + ': ' + t(tx(s.full) + '=' + s.key),
      hints: ['The two numbers multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '.', 'Which bracket has the plus sign? The larger number goes there when the sum is ' + (s.b > 0 ? 'positive' : 'negative') + '… check the signs shown.'], text: text,
      bad: [[String(w2), String(w1)], [String(Math.abs(s.b)), String(Math.abs(s.c))]].filter(function (b) { return !(+b[0] === w1 && +b[1] === w2); }) };
  }
  function blankBinPart(s, given, missing, prompt, text) {
    var full = facPart(s), v = tx(s.u), Mb = bin(s.u, missing), vs = varsOf(s.full);
    var p = B.math(prompt, function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (!/[a-z]/i.test(String(resp))) return form('whole-bracket', 'Write the whole bracket, e.g. ' + t(v + '+4') + ' — not just the number.');
      return full.check('(' + tx(bin(s.u, given)) + ')(' + String(resp) + ')');
    }, tx(Mb), 'Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(given)) + ' and ' + t(sg(missing)) + '.<br>So the missing factor is ' + t('(' + tx(Mb) + ')') + ' and ' + t(tx(s.full) + '=' + s.key) + '.',
    ['The numbers in the two brackets multiply to ' + t(s.c) + ' and add to ' + t(s.b) + '.', 'One of them is ' + t(sg(given)) + '. Which number goes with it?'], text, { keys: 'poly', vars: vs, before: t('(' + tx(bin(s.u, given)) + ')') });
    p.good = ['(' + tx(Mb) + ')', missing + '+' + v];
    p.bad = [tx(bin(s.u, -missing)), String(Math.abs(missing))];
    return p;
  }

  /* ---------------- sums of the factor pairs (table) ---------------- */
  function sumTablePart(N, b, text) {
    var pr = posPairs(N);
    var fields = pr.map(function (pq) { return { name: pq[0] + ' & ' + pq[1], label: t(pq[0] + ',\\ ' + pq[1]), before: 'sum =' }; });
    var checks = pr.map(function (pq) {
      var want = pq[1] - pq[0];
      return K.number(want, function (v) {
        if (v === pq[0] + pq[1]) return { code: 'u4l4-size-sum', hint: 'The product is ' + t(-N) + ', so one number is negative: ' + t('+' + pq[1] + '+(-' + pq[0] + ')=' + want) + '. With opposite signs the sizes <b>subtract</b>.' };
        if (v === -want && want) return { code: 'sign', hint: 'In this column the <b>larger</b> number, ' + t(pq[1]) + ', is the positive one: ' + t(pq[1] + '+(-' + pq[0] + ')=' + want) + '.' };
        if (v === N || v === -N) return { code: 'gave-product', hint: t(-N) + ' is the product. Add the two numbers instead: ' + t('+' + pq[1]) + ' and ' + t('-' + pq[0]) + '.' };
        return null;
      });
    });
    var rows = pr.map(function (pq) { return '<tr><td>' + t(pq[0] + ',\\ ' + pq[1]) + '</td><td>' + t(-N) + '</td><td>' + t('+' + pq[1] + '+(-' + pq[0] + ')=' + (pq[1] - pq[0])) + '</td><td>' + t('-' + pq[1] + '+' + pq[0] + '=' + (pq[0] - pq[1])) + '</td></tr>'; }).join('');
    var tbl = '<table class="tbl"><tr><th>Pair</th><th>Product</th><th>Sum (larger ' + t('+') + ')</th><th>Sum (larger ' + t('-') + ')</th></tr>' + rows + '</table>';
    return B.fields('Complete the table. For each factor pair of ' + t(N) + ', make the product ' + t(-N) + ' by making one number negative, and give the sum when the <b>larger</b> number is positive. (With the larger number negative, the sum is just the opposite.)',
      fields, checks, pr.map(function (pq) { return String(pq[1] - pq[0]); }), pr.map(function (pq) { return t(pq[0] + ',\\ ' + pq[1]) + ': ' + t(pq[1] - pq[0]); }).join('<br>'),
      tbl + 'The row with sum ' + t(Math.abs(b)) + ' (or ' + t(-Math.abs(b)) + ') gives the factors.',
      ['One number in each pair is negative, so the sum is the larger size minus the smaller size.', 'For ' + t(pr[0][0] + ',\\ ' + pr[0][1]) + ': ' + t('+' + pr[0][1] + '+(-' + pr[0][0] + ')') + '.'], text);
  }

  /* ---------------- lists of values of b ---------------- */
  function bListPart(prompt, want, N, text, sol, hints) {
    return { prompt: prompt, input: { type: 'list' }, key: want.slice(), answer: t(want.join(',\\ ')),
      check: function (resp) {
        if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
        var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + t(resp[i]) + ' more than once.'); seen[resp[i]] = 1; }
        var bad = resp.filter(function (v) { return want.indexOf(v) < 0; });
        if (bad.length) {
          var x = bad[0], sums = posPairs(N).map(function (pq) { return pq[0] + pq[1]; });
          if (x === 0) return wrong('u4l4-b-zero', t('b=0') + ' isn’t positive. Only list positive values.');
          if (sums.indexOf(x) >= 0) return wrong('u4l4-size-sum', t(x) + ' is the sum of two <b>positive</b> factors of ' + t(N) + ', but their product is ' + t('+' + N) + '. The constant is ' + t(-N) + ', so one number is negative and the sum is the <b>difference</b> of the sizes.');
          if (x === N) return wrong('gave-c', t(N) + ' is the size of the constant. ' + t('b') + ' is the <b>sum</b> of the two integers.');
          return wrong('not-b', t(x) + ' isn’t a possible sum: no two integers with product ' + t(-N) + ' add to ' + t(x) + '.');
        }
        if (resp.length < want.length) return wrong('missing-b', 'You have ' + resp.length + ' of the ' + want.length + ' values. Go through every factor pair of ' + t(N) + ' in order: ' + t('1\\times ' + N) + ', ' + t('2\\times ?') + ', …');
        return ok();
      },
      solution: sol, hints: hints, text: text, bad: [want.slice(1), [N - 1, N + 1]] };
  }

  /* ================= Lesson ================= */
  HW.defineLesson({
    id: 'u4l4', unit: 4, num: '4', title: 'Factoring Trinomials x² + bx + c, Part 2: c Negative', outcome: 'AN5',
    blurb: 'When c is negative the two integers have opposite signs, and the larger one takes the sign of b. List factor pairs systematically, spot prime trinomials, and take out a common factor first.',
    questions: [
      /* ---------------- Part A ---------------- */
      { num: '1', section: 'Part A — Building the Opposite-Sign Pattern', stem: 'Find two integers with the given sum and the given product.',
        shared: function (r) {
          var gen = function () { return pickWhere(function () { var m = r.int(3, 10); return [m, r.int(2, m - 1)]; }, function (o) { return o[0] * o[1] <= 40; }); };
          var a = gen(), c = pickWhere(gen, function (o) { return o[0] * o[1] !== a[0] * a[1]; });
          return { a: a, c: c };
        },
        parts: [
          { id: '1a', level: 'LIM', make: function (r, sh) { return pairPart(sh.a[0], -sh.a[1]); } },
          { id: '1b', level: 'LIM', make: function (r, sh) { return pairPart(-sh.a[0], sh.a[1]); } },
          { id: '1c', level: 'BEG', make: function (r, sh) { return pairPart(-sh.c[0], sh.c[1]); } },
          { id: '1d', level: 'BEG', make: function (r, sh) { return pairPart(sh.c[0], -sh.c[1]); } },
          { id: '1e', level: 'BEG', make: function (r) { var k = r.int(5, 15), sgn = r.chance(0.6) ? -1 : 1; return pairPart(sgn * k, -sgn); } },
          { id: '1f', level: 'BEG', make: function (r) { var o = KIND.mix(r); return pairPart(o[0], -o[1]); } }] },
      { num: '2', stem: 'Complete the following.',
        shared: function (r) {
          var gen = function () { return pickWhere(function () { var m = r.int(3, 10); return [m, r.int(1, m - 1)]; }, function (o) { return o[0] * o[1] <= 40 && o[0] * o[1] >= 6; }); };
          return { a: gen(), c: gen(), e: gen() };
        },
        parts: [
          { id: '2a', level: 'LIM', make: function (r, sh) {
            var m = sh.a[0], n = sh.a[1], s = spec({ p: m, q: -n });
            return blankNumPart(s, m, -n, -1, t(tx(s.full) + '=(x+' + m + ')(x-\\underline{\\quad\\;})'), 'fill blank (x+a)(x-_)');
          } },
          { id: '2b', level: 'LIM', make: function (r, sh) {
            var m = sh.a[0], n = sh.a[1], s = spec({ p: -m, q: n });
            return blankNumPart(s, n, -m, -1, t(tx(s.full) + '=(x-\\underline{\\quad\\;})(x+' + n + ')'), 'fill blank (x-_)(x+a)');
          } },
          { id: '2c', level: 'BEG', make: function (r, sh) {
            var m = sh.c[0], n = sh.c[1], s = spec({ v: 'n', p: m, q: -n });
            return blankSignedPart(s, [1, -1], t(tx(s.full) + '=(n+\\underline{\\quad\\;})(n-\\underline{\\quad\\;})'), 'fill blanks (n+_)(n-_)');
          } },
          { id: '2d', level: 'BEG', make: function (r, sh) {
            var m = sh.c[0], n = sh.c[1], s = spec({ v: 'n', p: -m, q: n });
            return blankSignedPart(s, [-1, 1], t(tx(s.full) + '=(n-\\underline{\\quad\\;})(n+\\underline{\\quad\\;})'), 'fill blanks (n-_)(n+_)');
          } },
          { id: '2e', level: 'BEG', make: function (r, sh) {
            var m = sh.e[0], n = sh.e[1], s = spec({ v: 'y', p: m, q: -n });
            return blankBinPart(s, m, -n, t(tx(s.full) + '=(y+' + m + ')(\\underline{\\qquad})'), 'missing factor (y+a)(__)');
          } },
          { id: '2f', level: 'BEG', make: function (r, sh) {
            var m = sh.e[0], n = sh.e[1], s = spec({ v: 'y', p: -m, q: n });
            return blankBinPart(s, -m, n, t(tx(s.full) + '=(y-' + m + ')(\\underline{\\qquad})'), 'missing factor (y-a)(__)');
          } }] },

      /* ---------------- Part B ---------------- */
      { num: '3', section: 'Part B — Factoring with c Negative', stem: 'Factor each trinomial.', parts: ['one', 'close', 'mid', 'big', 'two', 'mix'].map(function (k, i) {
        return { id: '3' + 'abcdef'[i], level: 'BEG', make: function (r) { var o = KIND[k](r); return facPart(spec({ p: o[0], q: -o[1] }), { check: i === 0 }); } };
      }) },
      { num: '4', stem: 'Factor each trinomial.', parts: ['one', 'close', 'mid', 'big', 'two', 'mix'].map(function (k, i) {
        return { id: '4' + 'abcdef'[i], level: 'BEG', make: function (r) { var o = KIND[k](r); return facPart(spec({ p: -o[0], q: o[1] })); } };
      }) },
      { num: '5', stem: 'Factor where possible. If a trinomial can’t be factored over the integers, press <b>none</b>.',
        shared: function (r) { return { cd: KIND.mid(r) }; },
        parts: [
          { id: '5a', level: 'BEG', make: function (r) { var o = KIND.close(r); return canPart(spec({ p: o[0], q: -o[1] })); } },
          { id: '5b', level: 'BEG', make: function (r) { var o = KIND.one(r); return canPart(spec({ p: -o[0], q: o[1] })); } },
          { id: '5c', level: 'BEG', make: function (r, sh) { return canPart(spec({ p: sh.cd[0], q: -sh.cd[1] })); } },
          { id: '5d', level: 'BEG', make: function (r, sh) { return canPart(spec({ p: -sh.cd[0], q: sh.cd[1] })); } },
          { id: '5e', level: 'BEG', make: function (r) { var o = KIND.one(r); return canPart(spec({ p: o[0], q: -o[1] })); } },
          { id: '5f', level: 'EMG', make: function (r) { var o = primeNeg(r, 5, 6, 24); return nonePart('x', o.b, o.c); } },
          { id: '5g', level: 'BEG', make: function (r) { var o = KIND.mid(r); return canPart(spec({ p: -o[0], q: o[1] })); } },
          { id: '5h', level: 'BEG', make: function (r) { var o = KIND.big(r); return canPart(spec({ p: o[0], q: -o[1] })); } }] },

      /* ---------------- Part C ---------------- */
      { num: '6', section: 'Part C — Systematic Lists, Primes, and Common Factors',
        shared: function (r) { var N = r.pick([24, 30, 36, 40, 42, 48, 54, 56, 60, 72]), pr = r.pick(posPairs(N).filter(function (pq) { return pq[0] > 1 && pq[1] - pq[0] >= 2; })); return { N: N, u: pr[0], v: pr[1] }; },
        stem: function (sh) { var b = sh.v - sh.u; return 'First list every factor pair of ' + t(sh.N) + ' and its sums (as in Example 3). Then use your table to factor (a) ' + t(triTex('x', b, -sh.N)) + ' and (b) ' + t(triTex('x', -b, -sh.N)) + '.'; },
        parts: [
          { id: '6t', sub: 'table', level: 'BEG', make: function (r, sh) { return sumTablePart(sh.N, sh.v - sh.u, 'sum table for ' + sh.N); } },
          { id: '6a', sub: 'a', level: 'BEG', make: function (r, sh) { return facPart(spec({ p: sh.v, q: -sh.u }), { prompt: 'Factor ' + t(triTex('x', sh.v - sh.u, -sh.N)) + '.' }); } },
          { id: '6b', sub: 'b', level: 'BEG', make: function (r, sh) { return facPart(spec({ p: -sh.v, q: sh.u }), { prompt: 'Factor ' + t(triTex('x', sh.u - sh.v, -sh.N)) + '.' }); } }] },
      { num: '7', stem: 'Decide whether each trinomial can be factored over the integers. If it can, factor it. If it cannot (it is <b>prime</b>), press <b>none</b>.', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var o = primeNeg(r, 6, 5, 20); return nonePart('x', Math.abs(o.b), o.c); } },
        { id: '7b', level: 'BEG', make: function (r) { var o = KIND.one(r); return canPart(spec({ p: o[0], q: -o[1] })); } },
        { id: '7c', level: 'EMG', make: function (r) { var o = primeNeg(r, 6, 7, 24); return nonePart('x', Math.abs(o.b), o.c); } },
        { id: '7d', level: 'BEG', make: function (r) { var o = KIND.two(r); return canPart(spec({ p: o[0], q: -o[1] })); } }] },
      { num: '8', stem: 'Factor completely. Remember to remove any common factor first.', parts: [
        { id: '8a', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 4, 5]), o = pickWhere(function () { return KIND.close(r); }, function (o) { return g * o[0] * o[1] <= 100; }); return facPart(spec({ G: P.num(g), p: o[0], q: -o[1] })); } },
        { id: '8b', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 4, 5]), o = pickWhere(function () { return KIND.close(r); }, function (o) { return g * o[0] * o[1] <= 100; }); return facPart(spec({ G: P.num(g), p: -o[0], q: o[1] })); } },
        { id: '8c', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 5, 6]), o = pickWhere(function () { return KIND.two(r); }, function (o) { return g * o[0] * o[1] <= 100; }); return facPart(spec({ G: P.num(g), p: o[0], q: -o[1] })); } },
        { id: '8d', level: 'PRG', make: function (r) { var o = KIND.mid(r); return facPart(spec({ G: V('x'), p: o[0], q: -o[1] })); } },
        { id: '8e', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 4]), o = pickWhere(function () { return KIND.mid(r); }, function (o) { return g * o[0] * o[1] <= 100; }); return facPart(spec({ G: P.mono(g, { x: 1 }), p: -o[0], q: o[1] })); } }] },

      /* ---------------- Part D ---------------- */
      { num: '9', section: 'Part D — Applications and Mixed Review',
        shared: function (r) { return pickWhere(function () { var q = r.int(2, 6), p = r.int(q + 2, 12); return { p: p, q: q, x: r.int(q + 2, q + 10) }; }, function (o) { return o.p * o.q <= 60; }); },
        stem: function (sh) { return 'A rectangular garden has an area of ' + t(triTex('x', sh.p - sh.q, -sh.p * sh.q)) + ' square metres.'; },
        parts: [
          { id: '9a', level: 'BEG', make: function (r, sh) {
            var s = spec({ p: sh.p, q: -sh.q }), f = facPart(s, { prompt: 'Factor ' + t(tx(s.full)) + ' to find binomials representing the length and width of the garden.', text: 'garden factor' });
            f.solution += '<br>So the garden is ' + t('(' + tx(s.A) + ')') + ' m long and ' + t('(' + tx(s.B) + ')') + ' m wide.';
            return f;
          } },
          { id: '9b', level: 'EMG', make: function (r, sh) {
            var x = sh.x, L = x + sh.p, W = x - sh.q, area = L * W;
            return { prompt: 'If ' + t('x=' + x) + ', determine the length and width of the garden.', input: { type: 'fields', fields: [numField('Length', 'm'), numField('Width', 'm')] },
              key: [String(L), String(W)], answer: 'Length ' + t(L + '\\text{ m}') + ', width ' + t(W + '\\text{ m}'),
              check: function (resp) {
                resp = resp || [];
                var a = HW.parse.number(resp[0] == null ? '' : resp[0]), b = HW.parse.number(resp[1] == null ? '' : resp[1]);
                if (!a.ok || !b.ok) return form('empty', 'Enter a number in each box.');
                if (a.value === L && b.value === W) return ok();
                if (a.value === W && b.value === L) return form('swap-dims', 'Right numbers — the length is the longer side, so swap them.');
                if (b.value === x + sh.q) return wrong('not-subst', 'Check the width: it is ' + t('x-' + sh.q) + ', so ' + t(x + '-' + sh.q + '=' + W) + '.');
                if (a.value === sh.p || (b.value === sh.q && W !== sh.q) || b.value === -sh.q) return wrong('not-subst', 'Substitute ' + t('x=' + x) + ' into each binomial: ' + t('x+' + sh.p) + ' becomes ' + t(x + '+' + sh.p) + '.');
                if (a.value * b.value === area) return wrong('value', 'Those multiply to the right area, ' + t(area) + ', but they aren’t the binomials evaluated at ' + t('x=' + x) + '. Substitute into each factor.');
                return K.fields([K.number(L), K.number(W)], { labels: ['Length', 'Width'] })(resp);
              },
              solution: 'Length ' + t('=x+' + sh.p + '=' + x + '+' + sh.p + '=' + L) + ' m, width ' + t('=x-' + sh.q + '=' + x + '-' + sh.q + '=' + W) + ' m.<br>Check: ' + t(L + '\\times ' + W + '=' + area) + ' and ' + t(x + '^{2}+' + (sh.p - sh.q) + '(' + x + ')-' + sh.p * sh.q + '=' + area) + ' ✓',
              hints: ['Use your factors from part (a): substitute ' + t('x=' + x) + ' into each one.'], text: 'garden dimensions at x', bad: [[String(W), String(L)], [String(L), String(x + sh.q)]] };
          } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var k = r.pick([2, 3, 4, 5]), o = pickWhere(function () { return [r.int(4, 9), r.int(2, 7)]; }, function (o) { return o[0] > o[1] && o[0] * o[1] <= 40; }), m = o[0], n = o[1], s = spec({ G: P.num(k), p: -m, q: n });
          var fh = 'Factor completely: ' + t(tx(s.full) + '=' + s.key) + '. That one <b>is</b> a factor.';
          return B.mc(r, 'Which of the following is <b>not</b> a factor of ' + t(tx(s.full)) + '?', [
            { html: t('x-' + n), right: true }, { html: t('x-' + m), why: fh }, { html: t('x+' + n), why: fh }, { html: t(k), why: 'The common factor ' + t(k) + ' is a factor: ' + t(tx(s.full) + '=' + s.key) + '.' }],
            'Common factor ' + t(k) + ': ' + t(k + '(' + tx(s.inner) + ')') + '. Product ' + t(s.c) + ', sum ' + t(s.b) + ': ' + t(-m) + ' and ' + t('+' + n) + '.<br>' + t(tx(s.full) + '=' + s.key) + '. The factors are ' + t(k) + ', ' + t('x-' + m) + ' and ' + t('x+' + n) + '; ' + t('x-' + n) + ' is not one of them.',
            ['Factor completely first: take out the common factor, then factor the trinomial.'], 'MC not a factor');
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return { k: r.int(3, 8), a: r.int(1, 7), b: r.int(1, 7), c: r.int(1, 7) }; }, function (o) { return o.a !== o.k && o.b !== o.k && o.c !== o.k && o.a !== o.b && o.k * Math.max(o.a, o.b, o.c) <= 48; });
          var k = o.k, v = r.pick(['x', 'x', 'a', 'm', 'n', 'y']), A = spec({ v: v, p: -k, q: o.a }), Bs = spec({ v: v, p: -k, q: o.b }), C = spec({ v: v, p: -k, q: -o.c }), D = spec({ v: v, p: k, q: -o.a });
          function has(sx) { return t(tx(sx.full) + '=' + sx.key) + ' — that one does have ' + t('(' + v + '-' + k + ')') + '.'; }
          return B.mc(r, 'For which trinomial is ' + t('(' + v + '-' + k + ')') + ' <b>not</b> a factor?', [
            { html: t(tx(D.full)), right: true }, { html: t(tx(A.full)), why: has(A) }, { html: t(tx(Bs.full)), why: has(Bs) }, { html: t(tx(C.full)), why: has(C) }],
            'Factor each: ' + t(tx(A.full) + '=' + A.key) + ', ' + t(tx(Bs.full) + '=' + Bs.key) + ', ' + t(tx(C.full) + '=' + C.key) + ', but ' + t(tx(D.full) + '=' + D.key) + ' — it has ' + t('(' + v + '+' + k + ')') + ', not ' + t('(' + v + '-' + k + ')') + '.',
            ['If ' + t('(' + v + '-' + k + ')') + ' is a factor, one of the two integers is ' + t(-k) + '. For each trinomial: what does ' + t(-k) + ' pair with to make the constant, and does that pair add to the middle coefficient?'], 'MC which lacks (x-k)');
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '12', level: 'ADV', make: function (r) {
          var c = r.pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 44, 45, 48, 50, 54, 56, 60, 63, 64, 66, 70, 72, 80]), pr = posPairs(c);
          var diffs = pr.map(function (pq) { return pq[1] - pq[0]; }).filter(function (d) { return d > 0; }), ans = Math.min.apply(null, diffs), sums = pr.map(function (pq) { return pq[0] + pq[1]; });
          return B.nr('The smallest <b>positive</b> value of ' + t('b') + ' for which ' + t('x^{2}+bx-' + c) + ' can be factored over the integers is ________.', ans, function (v) {
            if (v === 0) return { code: 'u4l4-b-zero', hint: t('b=0') + ' is not positive. Which pair gives the smallest sum that is <b>more</b> than ' + t('0') + '?' };
            if (diffs.indexOf(v) >= 0) return { code: 'not-smallest', hint: 'That value of ' + t('b') + ' works, but it isn’t the smallest. Which factor pair of ' + t(c) + ' has its two numbers closest together?' };
            if (sums.indexOf(v) >= 0) return { code: 'u4l4-size-sum', hint: 'The constant is ' + t(-c) + ', so one number is negative and the sum is the <b>difference</b> of the sizes, not their total.' };
            if (v === c) return { code: 'gave-c', hint: t(c) + ' is the size of the constant. ' + t('b') + ' is the <b>sum</b> of a pair of integers whose product is ' + t(-c) + '.' };
            return null;
          }, 'We need ' + t('b=p+q') + ' with ' + t('pq=-' + c) + ': one number positive, one negative, so ' + t('b') + ' is the difference of the sizes (larger positive for ' + t('b>0') + ').<br>' + pr.map(function (pq) { return t(pq[1] + '\\ \\&\\ -' + pq[0]) + ' (sum ' + t(pq[1] - pq[0]) + ')'; }).join(', ') + '.<br>The smallest positive sum is <b>' + ans + '</b>, from the pair closest together.',
          ['List every factor pair of ' + t(c) + '. With opposite signs, the sum is the bigger number minus the smaller one.', 'The pair whose numbers are closest together gives the smallest sum.'], 'NR smallest positive b');
        } }] },
      { num: '13', parts: [
        { id: '13', level: 'MAS', make: function (r) {
          var c = r.pick([10, 12, 14, 15, 18, 20, 21, 22, 24, 26, 27, 28, 30, 32, 33, 35, 36, 40, 42, 44]), pr = posPairs(c);
          var want = pr.map(function (pq) { return pq[1] - pq[0]; }).filter(function (d) { return d > 0; }).sort(function (a, b) { return a - b; });
          return bListPart('List all <b>positive</b> values of ' + t('b') + ' for which ' + t('x^{2}+bx-' + c) + ' can be factored over the integers.', want, c, 'all positive b for x^2+bx-' + c,
            'We need two integers with product ' + t(-c) + ' and sum ' + t('b>0') + ': the larger one positive, the smaller one negative.<br>' + pr.map(function (pq) { var d = pq[1] - pq[0]; return t(pq[1] + '\\ \\&\\ -' + pq[0]) + ' → ' + t('b=' + d) + (d ? ': ' + t('(x+' + pq[1] + ')(x-' + pq[0] + ')') : ' (not positive)'); }).join('<br>') + '<br>So ' + t('b=' + want.join(',\\ ')) + '.',
            ['Every factor pair of ' + t(c) + ' gives one value: make the larger number positive and the smaller one negative, then add.', 'Start with ' + t('1\\times ' + c) + ' and work up until the pairs meet.']);
        } }] },
      { num: '14', stem: 'Factor where possible. If a trinomial can’t be factored over the integers, press <b>none</b>.',
        shared: function (r) { return { ab: KIND.mix(r), cd: KIND.mid(r) }; },
        parts: [
          { id: '14a', level: 'BEG', make: function (r, sh) { return canPart(spec({ v: 'm', p: sh.ab[0], q: -sh.ab[1] })); } },
          { id: '14b', level: 'BEG', make: function (r, sh) { return canPart(spec({ v: 'm', p: -sh.ab[0], q: sh.ab[1] })); } },
          { id: '14c', level: 'BEG', make: function (r, sh) { return canPart(spec({ v: 'k', p: sh.cd[0], q: -sh.cd[1] })); } },
          { id: '14d', level: 'BEG', make: function (r, sh) { return canPart(spec({ v: 'k', p: -sh.cd[0], q: sh.cd[1] })); } },
          { id: '14e', level: 'EMG', make: function (r) { var o = primeNeg(r, 3, 6, 24); return nonePart('p', o.b, o.c); } },
          { id: '14f', level: 'BEG', make: function (r) { var o = KIND.mix(r); return canPart(spec({ v: 'p', p: o[0], q: -o[1] })); } }] },
      { num: '15', stem: 'Factor completely.', parts: [
        { id: '15a', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 4, 5]), o = pickWhere(function () { return KIND.mid(r); }, function (o) { return g * o[0] * o[1] <= 100; }); return facPart(spec({ G: P.num(g), p: o[0], q: -o[1] })); } },
        { id: '15b', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 4, 5, 6]), o = pickWhere(function () { return KIND.close(r); }, function (o) { return g * o[0] * o[1] <= 120; }); return facPart(spec({ G: P.mono(g, { x: 1 }), p: -o[0], q: o[1] })); } }] }
    ],

    extra: [
      { num: '1', section: 'Extra practice A — Bigger Constants, Same Rule', stem: 'Factor each trinomial. The constants are larger, so list the factor pairs of ' + t('c') + ' in order rather than guessing.', parts: [-1, 1, -1, 1].map(function (sgn, i) {
        return { id: 'e1' + 'abcd'[i], level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return [r.int(6, 16), r.int(2, 8)]; }, function (o) { var c = o[0] * o[1]; return o[0] > o[1] + 1 && c >= 30 && c <= 72 && posPairs(c).length >= 4; });
          return facPart(spec({ p: -sgn * o[0], q: sgn * o[1] }));
        } };
      }) },
      { num: '2', stem: 'Factor each trinomial.', parts: [-1, 1, -1, 1].map(function (sgn, i) {
        return { id: 'e2' + 'abcd'[i], level: 'EMG', make: function (r) {
          var o = pickWhere(function () { return [r.int(7, 16), r.int(3, 9)]; }, function (o) { var c = o[0] * o[1]; return o[0] > o[1] && c >= 50 && c <= 96; });
          return facPart(spec({ p: -sgn * o[0], q: sgn * o[1] }));
        } };
      }) },
      { num: '3',
        shared: function (r) {
          return pickWhere(function () { var N = r.pick([40, 48, 60, 72, 80]), pr = r.shuffle(posPairs(N).filter(function (pq) { return pq[1] - pq[0] >= 2; })); return { N: N, a: pr[0], c: pr[1] }; }, function (o) { return o.a && o.c; });
        },
        stem: function (sh) { return 'All three trinomials below use factor pairs of ' + t(sh.N) + ': (a) ' + t(triTex('x', sh.a[1] - sh.a[0], -sh.N)) + ', (b) ' + t(triTex('x', sh.a[0] - sh.a[1], -sh.N)) + ', (c) ' + t(triTex('x', sh.c[0] - sh.c[1], -sh.N)) + '.'; },
        parts: [
          { id: 'e3a', level: 'EMG', make: function (r, sh) { return facPart(spec({ p: sh.a[1], q: -sh.a[0] }), { prompt: 'Factor (a).' + ' ' + t(triTex('x', sh.a[1] - sh.a[0], -sh.N)) }); } },
          { id: 'e3b', level: 'EMG', make: function (r, sh) { return facPart(spec({ p: -sh.a[1], q: sh.a[0] }), { prompt: 'Factor (b).' + ' ' + t(triTex('x', sh.a[0] - sh.a[1], -sh.N)) }); } },
          { id: 'e3c', level: 'EMG', make: function (r, sh) { return facPart(spec({ p: -sh.c[1], q: sh.c[0] }), { prompt: 'Factor (c).' + ' ' + t(triTex('x', sh.c[0] - sh.c[1], -sh.N)) }); } },
          { id: 'e3d', sub: 'd', level: 'BEG', make: function (r, sh) {
            return B.mc(r, 'Which two parts use the <b>same</b> pair of numbers with the signs swapped?', [
              { html: '(a) and (b)', right: true },
              { html: '(a) and (c)', why: '(a) uses ' + t(sh.a[1]) + ' and ' + t(sh.a[0]) + ', but (c) uses ' + t(sh.c[1]) + ' and ' + t(sh.c[0]) + '.' },
              { html: '(b) and (c)', why: '(b) uses ' + t(sh.a[1]) + ' and ' + t(sh.a[0]) + ', but (c) uses ' + t(sh.c[1]) + ' and ' + t(sh.c[0]) + '.' },
              { html: 'None of them', why: 'Compare your answers to (a) and (b): the same two numbers appear in both.' }],
              '(a) ' + t('(x+' + sh.a[1] + ')(x-' + sh.a[0] + ')') + ' and (b) ' + t('(x-' + sh.a[1] + ')(x+' + sh.a[0] + ')') + ' both use ' + t(sh.a[1]) + ' and ' + t(sh.a[0]) + ', with the signs swapped because ' + t('b') + ' changed sign. (c) uses ' + t(sh.c[1]) + ' and ' + t(sh.c[0]) + '.',
              ['Compare the middle coefficients: which two are opposites?'], 'same pair swapped');
          } }] },
      { num: '4', section: 'Extra practice B — Deciding the Signs Before You Factor',
        shared: function (r) {
          return pickWhere(function () { var N = r.pick([12, 18, 20, 24, 28, 30, 40]), pr = r.shuffle(posPairs(N).filter(function (pq) { return pq[0] !== pq[1]; })); return { N: N, p1: pr[0], p2: pr[1] }; }, function (o) { return o.p1 && o.p2; });
        },
        stem: function (sh) { return 'Four trinomials: ' + rowsE4(sh).map(function (x, i) { return '(' + 'abcd'[i] + ') ' + t(tx(x.full)); }).join(', &nbsp;') + '.'; },
        parts: [
          { id: 'e4s', sub: 'signs', level: 'BEG', make: function (r, sh) {
            var R = rowsE4(sh), want = {};
            R.forEach(function (x, i) { want['abcd'[i]] = x.c > 0 ? (x.b > 0 ? 'pp' : 'nn') : (x.b > 0 ? 'op' : 'on'); });
            return B.grid('For each trinomial, do the two integers have the <b>same sign</b> or <b>opposite signs</b>? (Use the signs of ' + t('b') + ' and ' + t('c') + '.)', R.map(function (x, i) { return { id: 'abcd'[i], html: '(' + 'abcd'[i] + ') ' + t(tx(x.full)) }; }),
              [{ id: 'pp', html: 'same, both +' }, { id: 'nn', html: 'same, both −' }, { id: 'op', html: 'opposite, larger +' }, { id: 'on', html: 'opposite, larger −' }], want,
              { why: function (id) { var x = R['abcd'.indexOf(id)]; return { code: 'row', hint: '(' + id + '): ' + signHint(x.b, x.c) }; } },
              R.map(function (x, i) { return '(' + 'abcd'[i] + ') ' + t('c' + (x.c > 0 ? '>' : '<') + '0') + ', ' + t('b' + (x.b > 0 ? '>' : '<') + '0') + ': ' + (x.c > 0 ? 'same sign (the product is positive), both ' + (x.b > 0 ? 'positive' : 'negative') : 'opposite signs (the product is negative), the larger one ' + (x.b > 0 ? 'positive' : 'negative')) + '.'; }).join('<br>'),
              ['If ' + t('c>0') + ' the integers have the same sign — the sign of ' + t('b') + '. If ' + t('c<0') + ' the signs are opposite and the larger one has the sign of ' + t('b') + '.'], 'sign pattern table');
          } },
          { id: 'e4f', sub: 'factor', level: 'EMG', make: function (r, sh) {
            var S = rowsE4(sh);
            var p = B.fields('Now factor each one.', S.map(function (s, i) { return { name: '(' + 'abcd'[i] + ')', label: t(tx(s.full) + '='), mode: 'math', keys: 'poly', vars: ['x'], wide: true }; }),
              S.map(function (s) { return facPart(s).check; }), S.map(function (s) { return s.key; }), S.map(function (s) { return t(tx(s.full) + '=' + s.key); }).join('<br>'),
              S.map(function (s) { return t(sg(s.p)) + ' and ' + t(sg(s.q)) + ': product ' + t(s.c) + ', sum ' + t(s.b) + ', so ' + t(tx(s.full) + '=' + s.key); }).join('<br>'),
              ['Use the sign pattern you found: it tells you which number gets the minus sign.'], 'sign pattern factored');
            p.bad = [S.map(function (s) { return '(' + tx(bin(V('x'), -s.p)) + ')(' + tx(bin(V('x'), -s.q)) + ')'; })];
            return p;
          } }] },
      { num: '5', stem: function (sh) { return 'These are mixed: some have ' + t('c>0') + ' and some have ' + t('c<0') + '. One of them is a perfect square trinomial. ' + rowsE5(sh).map(function (x, i) { return '(' + 'abcd'[i] + ') ' + t(tx(x.full)); }).join(', &nbsp;') + '.'; },
        shared: function (r) {
          return pickWhere(function () {
            var n = r.pick([4, 6, 6, 8, 10]), N = n * n, pr = r.shuffle(posPairs(N).filter(function (pq) { return pq[0] !== pq[1] && (pq[0] > 1 || N === 16) && pq[0] + pq[1] <= 34; }));
            return { n: n, N: N, a: pr[0], d: pr[1], sq: r.chance(0.5) ? -1 : 1 };
          }, function (o) { return o.a && o.d; });
        },
        parts: [0, 1, 2, 3].map(function (i) {
          return { id: 'e5' + 'abcd'[i], level: i === 2 ? 'EMG' : 'BEG', make: function (r, sh) {
            var s = rowsE5(sh)[i], opt = { prompt: 'Factor (' + 'abcd'[i] + ') ' + t(tx(s.full)) + '.' };
            if (i === 2) opt.wrong = [{ is: P.add(V('x', 2), P.num(sh.N)), code: 'sq-no-middle', hint: 'A perfect square ' + t(s.key) + ' has a middle term. Find two integers with product ' + t(sh.N) + ' and sum ' + t(s.b) + '.' }];
            return facPart(s, opt);
          } };
        }) },
      { num: '6', stem: 'Factor completely. Remove the greatest common factor first, then factor what is left.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 4]), o = pickWhere(function () { return KIND.close(r); }, function (o) { return g * o[0] * o[1] <= 100; }); return facPart(spec({ G: P.num(g), p: -o[0], q: o[1] })); } },
        { id: 'e6b', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 5]), o = pickWhere(function () { return KIND.close(r); }, function (o) { return g * o[0] * o[1] <= 100; }); return facPart(spec({ G: P.num(g), p: o[0], q: -o[1] })); } },
        { id: 'e6c', level: 'PRG', make: function (r) { var o = KIND.big(r); return facPart(spec({ G: V('x'), p: -o[0], q: o[1] })); } }] },
      { num: '7', stem: '<b>Two variables.</b> For ' + t('x^{2}+bxy+cy^{2}') + ' you still need two integers with product ' + t('c') + ' and sum ' + t('b') + ', and each one is attached to a ' + t('y') + '. Factor each expression.', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) { var o = KIND.mid(r); return facPart(spec({ y: 'y', p: -o[0], q: o[1] }), { check: true }); } },
        { id: 'e7b', level: 'EMG', make: function (r) { var o = KIND.mid(r); return facPart(spec({ y: 'y', p: o[0], q: -o[1] }), { check: true }); } },
        { id: 'e7c', level: 'PRG', make: function (r) { var n = r.int(3, 9), d = r.int(1, 2), L = r.pick([['a', 'b'], ['a', 'b'], ['m', 'n'], ['p', 'q']]); return facPart(spec({ v: L[0], y: L[1], p: -(n + d), q: n }), { check: true }); } }] },

      { num: '8', section: 'Extra practice C — Prime Trinomials, Errors, and Working Backwards', stem: 'Show that each trinomial is <b>prime</b> over the integers: list every sum that a pair of integers with the right product can have (both sign arrangements). None of them will match ' + t('b') + '.', parts: [
        { id: 'e8a', level: 'EMG', make: function (r) { var o = primeNeg(r, 8, 10, 30); return primeSumsPart(Math.abs(o.b), o.c); } },
        { id: 'e8b', level: 'EMG', make: function (r) { var o = primeNeg(r, 6, 8, 24); return primeSumsPart(-Math.abs(o.b), o.c); } }] },
      { num: '9', stem: 'Factor where possible. If a trinomial is prime, press <b>none</b>.', parts: [
        { id: 'e9a', level: 'BEG', make: function (r) { var o = KIND.big(r); return canPart(spec({ p: o[0], q: -o[1] })); } },
        { id: 'e9b', level: 'BEG', make: function (r) { var o = KIND.close(r); return canPart(spec({ p: -o[0], q: o[1] })); } },
        { id: 'e9c', level: 'EMG', make: function (r) { var o = primeNeg(r, 6, 10, 30); return nonePart('x', Math.abs(o.b), o.c); } },
        { id: 'e9d', level: 'BEG', make: function (r) { var o = pickWhere(function () { return [r.int(9, 16), r.int(2, 4)]; }, function (o) { return o[0] * o[1] <= 52; }); return canPart(spec({ p: -o[0], q: o[1] })); } }] },
      { num: '10', shared: function (r) { var n = r.int(2, 6); return { m: r.int(n + 1, n + 4), n: n }; },
        stem: function (sh) { return '<b>Error analysis.</b> Devon factors ' + t(triTex('x', sh.n - sh.m, -sh.m * sh.n)) + ' and writes ' + t('(x+' + sh.m + ')(x-' + sh.n + ')') + ', saying “' + t(sh.m + '\\times(-' + sh.n + ')=-' + sh.m * sh.n) + ', so the product checks out.”'; },
        parts: [
          { id: 'e10a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var S = spec({ p: sh.m, q: -sh.n });
            return B.poly('Expand Devon’s answer.', S.inner, { wrong: [{ is: P.add(V('x', 2), P.num(S.c)), code: 'fl-only', hint: 'You have only the First and Last products. Add the Outer and Inner products for the middle term.' }] },
              t('(x+' + sh.m + ')(x-' + sh.n + ')=' + foilTex(S) + '=' + tx(S.inner)) + '. The constant is right, but the middle term is ' + t(tx(P.scale(V('x'), S.b))) + ', not ' + t(tx(P.scale(V('x'), -S.b))) + '.',
              ['Use FOIL: First, Outer, Inner, Last.'], 'expand Devon');
          } },
          { id: 'e10b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var b = sh.n - sh.m;
            return B.mc(r, 'Which condition did Devon forget to check?', [
              { html: 'The <b>sum</b>: ' + t(sh.m + '+(-' + sh.n + ')=' + (sh.m - sh.n)) + ', but it must be ' + t(b) + '.', right: true },
              { html: 'The <b>product</b>: the numbers must multiply to ' + t(b) + '.', why: 'The product must be the constant term, ' + t(-sh.m * sh.n) + ' — and Devon’s product is right. Check the other condition.' },
              { html: 'That both numbers must be negative.', why: 'A negative constant needs one positive and one negative number, and Devon has that. The problem is which one is negative.' },
              { html: 'Nothing — his answer is correct.', why: 'Expand it: the middle term comes out as ' + t((sh.m - sh.n) + 'x') + ', not ' + t(b + 'x') + '.' }],
              'Devon checked only the product. The sum ' + t(sh.m + '+(-' + sh.n + ')=' + (sh.m - sh.n)) + ' should be ' + t(b) + '. The larger number must carry the sign of ' + t('b') + ', so the ' + t(sh.m) + ' is negative.',
              ['The pair must match <b>two</b> things: the product and the sum.'], 'Devon forgot the sum');
          } },
          { id: 'e10c', sub: 'c', level: 'BEG', make: function (r, sh) { var s = spec({ p: -sh.m, q: sh.n }); return facPart(s, { prompt: 'Give the correct factorization of ' + t(tx(s.full)) + '.', check: true }); } }] },
      { num: '11', shared: function (r) { return pickWhere(function () { var n = r.int(2, 6); return { m: r.int(n + 2, 10), n: n }; }, function (o) { return o.m * o.n <= 54; }); },
        stem: function (sh) { return '<b>Error analysis.</b> Jae factors ' + t(triTex('x', sh.m - sh.n, -sh.m * sh.n)) + ' as ' + t('(x-' + sh.m + ')(x+' + sh.n + ')') + ', reasoning that ' + t(sh.m) + ' and ' + t(sh.n) + ' multiply to ' + t(sh.m * sh.n) + ' and the signs must be opposite. Both statements are true, yet the answer is wrong.'; },
        parts: [
          { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var b = sh.m - sh.n;
            return B.mc(r, 'What rule decides <b>which</b> number gets the minus sign?', [
              { html: 'The number with the <b>larger</b> size takes the sign of ' + t('b') + '. Here ' + t('b=' + b) + ' is positive, so ' + t(sh.m) + ' is positive and ' + t(sh.n) + ' is negative.', right: true },
              { html: 'The smaller number always gets the minus sign.', why: 'Not always: in ' + t(triTex('x', -b, -sh.m * sh.n)) + ' the <b>larger</b> number is negative. It depends on the sign of ' + t('b') + '.' },
              { html: 'The larger number always gets the minus sign.', why: 'Then the sum would be negative, but ' + t('b=' + b) + ' is positive.' },
              { html: 'It doesn’t matter which one is negative.', why: 'Expand Jae’s answer: it gives ' + t(triTex('x', -b, -sh.m * sh.n)) + ' — the middle term has the wrong sign.' }],
              'The sum ' + t('b') + ' takes the sign of the larger number. ' + t('b=' + b + '>0') + ', so ' + t(sh.m) + ' is positive: ' + t('+' + sh.m + '+(-' + sh.n + ')=' + b) + ' ✓. Jae’s answer expands to ' + t(triTex('x', -b, -sh.m * sh.n)) + '.',
              ['Expand Jae’s answer and compare the middle term.'], 'Jae sign rule');
          } },
          { id: 'e11b', sub: 'b', level: 'BEG', make: function (r, sh) { var s = spec({ p: sh.m, q: -sh.n }); return facPart(s, { prompt: 'Factor ' + t(tx(s.full)) + ' correctly.' }); } }] },
      { num: '12', shared: function (r) { return { c: r.pick([12, 18, 20, 24, 28, 30, 32, 40, 42, 44, 45, 48, 50, 52, 54, 56, 60, 63, 66, 70, 72]) }; },
        stem: function (sh) { return '<b>Work backwards.</b> Consider ' + t('x^{2}+bx-' + sh.c) + ', where ' + t('b') + ' is an integer.'; },
        parts: [
          { id: 'e12a', sub: 'a', level: 'LIM', make: function (r, sh) { return factorPairsPart(sh.c); } },
          { id: 'e12b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var c = sh.c, pr = posPairs(c), want = pr.map(function (pq) { return pq[1] - pq[0]; }).sort(function (a, b) { return a - b; });
            return bListPart('List every <b>positive</b> integer ' + t('b') + ' that makes the trinomial factorable.', want, c, 'positive b for x^2+bx-' + c,
              'Each factor pair gives one positive ' + t('b') + ': the larger number positive, the smaller negative.<br>' + pr.map(function (pq) { return t(pq[1] + '\\ \\&\\ -' + pq[0]) + ' → ' + t(pq[1] - pq[0]); }).join(', ') + '.',
              ['Use your factor pairs from (a). With one number negative, the sum is the larger minus the smaller.']);
          } },
          { id: 'e12c', sub: 'c', level: 'ADV', make: function (r, sh) {
            var c = sh.c, pr = posPairs(c), pos = pr.map(function (pq) { return pq[1] - pq[0]; }).sort(function (a, b) { return a - b; }), all = [];
            pos.forEach(function (d) { all.push(d); all.push(-d); });
            var p = B.valueSet('List <b>all</b> integers ' + t('b') + ' that work (positive and negative).', all, { v: 'b', keyTex: pos.map(function (d) { return '\\pm' + d; }).join(',\\ '),
              diag: function (A, T) {
                var miss = T.filter(function (x) { return A.indexOf(x) < 0; }), extra = A.filter(function (x) { return T.indexOf(x) < 0; });
                if (!extra.length && miss.length && miss.every(function (x) { return x < 0; })) return { code: 'no-negatives', hint: 'Every positive value has a negative partner: make the <b>larger</b> number negative instead, e.g. ' + t('-' + pr[0][1] + '+' + pr[0][0] + '=' + (pr[0][0] - pr[0][1])) + '.' };
                if (extra.length && pr.some(function (pq) { return Math.abs(extra[0]) === pq[0] + pq[1]; })) return { code: 'u4l4-size-sum', hint: t(extra[0]) + ' needs two numbers with the same sign, but the product ' + t(-c) + ' is negative. The sums are differences of the sizes.' };
                if (extra.length) return { code: 'not-b', hint: t(extra[0]) + ' isn’t the sum of two integers with product ' + t(-c) + '.' };
                return null;
              } },
              'Each pair can be signed two ways: larger positive (sum ' + t('+d') + ') or larger negative (sum ' + t('-d') + ').<br>' + pr.map(function (pq) { return t(pq[0] + ',\\ ' + pq[1]) + ' → ' + t('b=\\pm' + (pq[1] - pq[0])); }).join(', ') + '.<br>So ' + t('b=' + pos.map(function (d) { return '\\pm' + d; }).join(',\\ ')) + '.',
              ['Swapping which number is negative changes the sign of the sum.', 'You can type ' + t('\\pm') + ' or list each value.'], 'all b for x^2+bx-' + c);
            p.bad = [pos.join(', '), pos.map(function (d) { return '\\pm' + d; }).slice(1).join(', ')];
            return p;
          } },
          { id: 'e12d', sub: 'd', level: 'EMG', make: function (r, sh) {
            var c = sh.c, pq = posPairs(c)[1] || posPairs(c)[0];
            return B.mc(r, 'What pattern connects your two lists?', [
              { html: 'Every value of ' + t('b') + ' has an opposite partner: swapping which number of a pair is negative changes the sign of the sum (for example ' + t(pq[1] + '+(-' + pq[0] + ')=' + (pq[1] - pq[0])) + ' and ' + t('-' + pq[1] + '+' + pq[0] + '=' + (pq[0] - pq[1])) + ').', right: true },
              { html: 'The negative values come from negative factor pairs that the positive list missed.', why: 'There are no new pairs: the same factor pairs of ' + t(c) + ' are used, just with the minus sign on the other number.' },
              { html: 'The negative values are the products of the pairs.', why: 'Every product is ' + t(-c) + '. ' + t('b') + ' is always a sum.' },
              { html: 'There is no pattern; the lists are unrelated.', why: 'Compare them: each positive value appears again with a minus sign.' }],
              'For each factor pair, making the larger number positive gives ' + t('b=+d') + '; making it negative gives ' + t('b=-d') + '. So the values come in ' + t('\\pm') + ' pairs.',
              ['Take one pair and sign it both ways.'], 'pattern of ± b');
          } }] },
      { num: '13', stem: 'Determine the missing number in each statement.', parts: [
        { id: 'e13a', level: 'BEG', make: function (r) { var o = KIND.close(r), s = spec({ p: o[0], q: -o[1] }); return blankNumPart(s, o[0], -o[1], -1, t('(x+' + o[0] + ')(x-\\underline{\\quad\\;})=' + tx(s.full)), 'missing number (x+a)(x-_)'); } },
        { id: 'e13b', level: 'BEG', make: function (r) { var o = KIND.big(r), s = spec({ p: -o[0], q: o[1] }); return blankNumPart(s, o[1], -o[0], -1, t('(x-\\underline{\\quad\\;})(x+' + o[1] + ')=' + tx(s.full)), 'missing number (x-_)(x+a)'); } },
        { id: 'e13c', level: 'BEG', make: function (r) { var o = KIND.mix(r), s = spec({ p: o[1], q: -o[0] }); return blankNumPart(s, o[1], -o[0], -1, t('(x+' + o[1] + ')(x-\\underline{\\quad\\;})=' + tx(s.full)), 'missing number (x+small)(x-_)'); } },
        { id: 'e13d', level: 'BEG', make: function (r) {
          var o = KIND.big(r), s = spec({ p: o[0], q: -o[1] }), b = s.b;
          return B.number(t('x^{2}+\\underline{\\quad\\;}\\,x-' + (-s.c) + '=(x+' + o[0] + ')(x-' + o[1] + ')'), b, function (v) {
            if (v === -b) return { code: 'sign', hint: 'Check the sign: ' + t('+' + o[0] + '+(-' + o[1] + ')') + '.' };
            if (v === o[0] + o[1]) return { code: 'u4l4-size-sum', hint: 'One number is negative: the middle coefficient is ' + t(o[0] + '+(-' + o[1] + ')') + ', not ' + t(o[0] + '+' + o[1]) + '.' };
            if (v === s.c || v === -s.c) return { code: 'gave-product', hint: 'The product gives the constant term. The middle coefficient is the <b>sum</b> of the two numbers.' };
            return null;
          }, 'The middle coefficient is the sum of the two numbers: ' + t(o[0] + '+(-' + o[1] + ')=' + b) + '.<br>Check: ' + t('(x+' + o[0] + ')(x-' + o[1] + ')=' + foilTex(s) + '=' + tx(s.full)) + ' ✓', ['Expand the right side, or add the two numbers in the brackets.'], 'missing b from factors');
        } }] },
      { num: '14', parts: [
        { id: 'e14', level: 'MAS', make: function (r) { return negCPart(r); } }] },

      { num: '15', section: 'Extra practice D — Comparing, Applying, and Reasoning',
        shared: function (r) { return pickWhere(function () { var n = r.int(2, 6); return { m: r.int(n + 2, 10), n: n }; }, function (o) { return o.m * o.n <= 50; }); },
        stem: function (sh) { return 'Compare ' + t(triTex('x', sh.m - sh.n, -sh.m * sh.n)) + ' and ' + t(triTex('x', sh.n - sh.m, -sh.m * sh.n)) + '.'; },
        parts: [
          { id: 'e15a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var S = [spec({ p: sh.m, q: -sh.n }), spec({ p: -sh.m, q: sh.n })];
            var p = B.fields('Factor both.', S.map(function (s, i) { return { name: i ? 'Second' : 'First', label: t(tx(s.full) + '='), mode: 'math', keys: 'poly', vars: ['x'], wide: true }; }),
              S.map(function (s) { return facPart(s).check; }), S.map(function (s) { return s.key; }), S.map(function (s) { return t(tx(s.full) + '=' + s.key); }).join('<br>'),
              S.map(function (s) { return t(sg(s.p)) + ' and ' + t(sg(s.q)) + ': product ' + t(s.c) + ', sum ' + t(s.b) + ', so ' + t(tx(s.full) + '=' + s.key); }).join('<br>'),
              ['Both use the same two sizes, ' + t(sh.m) + ' and ' + t(sh.n) + '.'], 'factor both');
            p.bad = [[S[1].key, S[0].key]];
            return p;
          } },
          { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, sh) {
            return B.mc(r, 'What changed between the two answers, and what stayed the same?', [
              { html: 'The numbers ' + t(sh.m) + ' and ' + t(sh.n) + ' and the product ' + t(-sh.m * sh.n) + ' stayed the same; only the signs swapped, because ' + t('b') + ' changed sign and the larger number follows the sign of ' + t('b') + '.', right: true },
              { html: 'The numbers changed to a different factor pair of ' + t(sh.m * sh.n) + '.', why: 'Look at both answers: they use the same two sizes, ' + t(sh.m) + ' and ' + t(sh.n) + '.' },
              { html: 'Nothing changed: both trinomials have the same factored form.', why: 'Expand them: the middle terms are opposites, so the factored forms differ.' },
              { html: 'Only the order of the brackets changed.', why: 'The order of the brackets doesn’t change the product. The signs inside the brackets changed.' }],
              t(triTex('x', sh.m - sh.n, -sh.m * sh.n) + '=(x+' + sh.m + ')(x-' + sh.n + ')') + ' and ' + t(triTex('x', sh.n - sh.m, -sh.m * sh.n) + '=(x-' + sh.m + ')(x+' + sh.n + ')') + '. Same numbers, same product; the signs swapped because the larger number always follows the sign of ' + t('b') + '.',
              ['Write the two answers one above the other.'], 'what changed');
          } }] },
      { num: '16', shared: function (r) { return pickWhere(function () { var q = r.int(2, 7), p = r.int(q + 2, 12); return { p: p, q: q, x: r.int(q + 3, q + 9) }; }, function (o) { return o.p * o.q <= 60; }); },
        stem: function (sh) { return 'A rectangle has an area of ' + t(triTex('x', sh.p - sh.q, -sh.p * sh.q)) + ' square metres, where ' + t('x') + ' is measured in metres.'; },
        parts: [
          { id: 'e16a', sub: 'a', level: 'BEG', make: function (r, sh) { var s = spec({ p: sh.p, q: -sh.q }); return facPart(s, { prompt: 'Factor to find binomial expressions for the length and the width.', text: 'rectangle factor' }); } },
          { id: 'e16b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var x = sh.x, L = x + sh.p, W = x - sh.q, A = L * W;
            var p = B.fields('Determine the length and width when ' + t('x=' + x) + ', and the area.', [numField('Length', 'm'), numField('Width', 'm'), numField('Area', 'm²')],
              [K.number(L, function (v) { return v === sh.p ? { code: 'not-subst', hint: 'Substitute ' + t('x=' + x) + ' into ' + t('x+' + sh.p) + '.' } : null; }),
                K.number(W, function (v) { return v === x + sh.q ? { code: 'not-subst', hint: 'The width is ' + t('x-' + sh.q) + ': ' + t(x + '-' + sh.q) + '.' } : null; }),
                K.number(A)], [String(L), String(W), String(A)], 'Length ' + t(L) + ' m, width ' + t(W) + ' m, area ' + t(A) + ' m²',
              'Length ' + t(x + '+' + sh.p + '=' + L) + ' m, width ' + t(x + '-' + sh.q + '=' + W) + ' m.<br>Area ' + t(L + '\\times ' + W + '=' + A) + ' m², and ' + t(x + '^{2}+' + (sh.p - sh.q) + '(' + x + ')-' + sh.p * sh.q + '=' + A) + ' ✓',
              ['Substitute ' + t('x=' + x) + ' into each factor, then multiply.'], 'rectangle at x');
            p.bad = [[String(W), String(L), String(A)]];
            return p;
          } },
          { id: 'e16c', sub: 'c', level: 'EMG', make: function (r, sh) {
            return B.mc(r, 'Why must ' + t('x') + ' be greater than ' + t(sh.q) + ' for this to describe a real rectangle?', [
              { html: 'If ' + t('x\\le ' + sh.q) + ', the width ' + t('x-' + sh.q) + ' is zero or negative, and a side length must be positive.', right: true },
              { html: 'If ' + t('x\\le ' + sh.q) + ', the length ' + t('x+' + sh.p) + ' is negative.', why: 'Try ' + t('x=' + sh.q) + ': the length is ' + t(sh.q + sh.p) + ', which is positive. Look at the other side.' },
              { html: 'Because ' + t(sh.q) + ' is a factor of ' + t(sh.p * sh.q) + '.', why: 'Being a factor doesn’t limit ' + t('x') + '. Think about the side lengths.' },
              { html: 'Because the area must be bigger than ' + t(sh.q) + '.', why: 'The limit comes from the width ' + t('x-' + sh.q) + ', which must be positive.' }],
              'The width is ' + t('x-' + sh.q) + '. For ' + t('x\\le ' + sh.q) + ' it is ' + t('0') + ' or negative, which is impossible for a side length. Only ' + t('x>' + sh.q) + ' makes both dimensions positive.',
              ['Which dimension can become zero or negative?'], 'why x > q');
          } }] },
      { num: '17', shared: function (r) { return pickWhere(function () { var n = r.int(2, 7); return { m: r.int(n + 1, n + 5), n: n }; }, function (o) { return o.m * o.n <= 60; }); },
        stem: function (sh) { return 'A rectangular prism has a volume of ' + t(tx(spec({ G: V('x'), p: sh.m, q: -sh.n }).full)) + ' cubic centimetres.'; },
        parts: [
          { id: 'e17a', sub: 'a', level: 'PRG', make: function (r, sh) { var s = spec({ G: V('x'), p: sh.m, q: -sh.n }); var f = facPart(s, { prompt: 'Factor completely to find three expressions for the dimensions.' }); f.solution += '<br>The dimensions are ' + t('x') + ', ' + t(tx(s.A)) + ' and ' + t(tx(s.B)) + ' cm.'; return f; } },
          { id: 'e17b', sub: 'b', level: 'PRG', make: function (r, sh) {
            var n = sh.n;
            return B.number('State the smallest integer value of ' + t('x') + ' for which all three dimensions are positive.', n + 1, function (v) {
              if (v === n) return { code: 'u4l4-dim-zero', hint: 'At ' + t('x=' + n) + ' the dimension ' + t('x-' + n) + ' is ' + t('0') + ' — a box can’t have a side of length ' + t('0') + '.' };
              if (v === 1 || v === 0) return { code: 'value', hint: 'Check every dimension: ' + t('x-' + n) + ' must be positive too.' };
              return null;
            }, 'The dimensions are ' + t('x') + ', ' + t('x+' + sh.m) + ' and ' + t('x-' + n) + '. The smallest one is ' + t('x-' + n) + ', which is positive only when ' + t('x>' + n) + '. At ' + t('x=' + n) + ' it would be ' + t('0') + ', so the smallest integer is ' + t('x=' + (n + 1)) + '.',
            ['Which dimension is smallest? Make it bigger than ' + t('0') + '.'], 'smallest x for prism');
          } }] },
      { num: '18', shared: function (r) { return pickWhere(function () { var n = r.int(2, 6); return { m: r.int(n + 1, 9), n: n, s: r.chance(0.5) ? 1 : -1 }; }, function (o) { return o.m * o.n <= 45; }); },
        stem: function (sh) { return '<b>Reasoning.</b> Suppose ' + t('x^{2}+bx+c') + ' factors as ' + t('(x+p)(x+q)') + ' and ' + t('c<0') + ' — for example ' + t(triTex('x', sh.s * (sh.m - sh.n), -sh.m * sh.n)) + '.'; },
        parts: [
          { id: 'e18a', sub: 'a', level: 'EMG', make: function (r, sh) {
            return B.mc(r, 'Why must ' + t('p') + ' and ' + t('q') + ' have opposite signs?', [
              { html: t('pq=c') + ' is negative, and a product of two integers is negative only when one is positive and the other is negative.', right: true },
              { html: 'Because ' + t('b') + ' is negative.', why: t('b') + ' can be positive: ' + t(triTex('x', sh.m - sh.n, -sh.m * sh.n) + '=(x+' + sh.m + ')(x-' + sh.n + ')') + '. The reason is the product ' + t('pq=c') + '.' },
              { html: 'Because two negatives always make a negative.', why: t('(-' + sh.m + ')(-' + sh.n + ')=+' + sh.m * sh.n) + '. Two negatives make a positive.' },
              { html: 'They don’t have to: two positive numbers can multiply to a negative number.', why: 'Two positive numbers always have a positive product.' }],
              t('pq=c<0') + '. Two positives give a positive product and two negatives give a positive product, so the only way to get a negative product is one positive and one negative number.',
              ['Think about the signs of a product.'], 'why opposite signs');
          } },
          { id: 'e18b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var b = sh.s * (sh.m - sh.n);
            return B.mc(r, 'Once you know the two numbers, how do you decide which one gets the minus sign?', [
              { html: 'The number with the larger size gets the sign of ' + t('b') + ' (it controls the sum); the smaller one gets the opposite sign.', right: true },
              { html: 'The first number always gets the minus sign.', why: 'Order doesn’t matter in a product. In ' + t(triTex('x', b, -sh.m * sh.n)) + ' the sum ' + t(b) + ' decides it.' },
              { html: 'The smaller number always gets the minus sign.', why: 'Only when ' + t('b>0') + '. If ' + t('b<0') + ' the larger number is negative.' },
              { html: 'The number with the larger size gets the sign of ' + t('c') + '.', why: t('c') + ' is always negative here, but ' + t('b') + ' can be positive. The sum ' + t('b') + ' decides.' }],
              'The sum ' + t('p+q=b') + ' has the sign of whichever number is further from ' + t('0') + '. Example: ' + t(triTex('x', b, -sh.m * sh.n)) + ' needs ' + (b > 0 ? t('+' + sh.m) + ' and ' + t('-' + sh.n) : t('-' + sh.m) + ' and ' + t('+' + sh.n)) + ' (sum ' + t(b) + ').',
              ['Test the rule on the example.'], 'which gets the minus');
          } }] },
      { num: '19', stem: '<b>Reasoning.</b>', parts: [
        { id: 'e19', level: 'EMG', make: function (r) {
          var n = r.int(2, 12), k = r.int(1, 6);
          return B.mc(r, 'Can a trinomial with ' + t('c<0') + ', such as ' + t(triTex('x', k, -n * n)) + ', ever be a perfect square trinomial ' + t('(x+p)^{2}') + ' or ' + t('(x-p)^{2}') + '?', [
            { html: '<b>No</b>: ' + t('(x\\pm p)^{2}=x^{2}\\pm 2px+p^{2}') + ', and ' + t('p^{2}') + ' is never negative, so ' + t('c') + ' can’t be negative.', right: true },
            { html: '<b>Yes</b>: ' + t('(x-' + n + ')^{2}=x^{2}-' + 2 * n + 'x-' + n * n) + '.', why: 'Expand ' + t('(x-' + n + ')^{2}=(x-' + n + ')(x-' + n + ')') + ': the last term is ' + t('(-' + n + ')(-' + n + ')=+' + n * n) + '.' },
            { html: '<b>Yes</b>, when ' + t('c') + ' is a perfect square like ' + t(-n * n) + '.', why: t(-n * n) + ' is not a square of an integer: any integer squared is positive (or zero).' },
            { html: 'Only when ' + t('b=0') + '.', why: t('x^{2}-' + n * n + '=(x-' + n + ')(x+' + n + ')') + ' — two different brackets, not a square.' }],
            'A perfect square ' + t('(x\\pm p)^{2}') + ' multiplies the same number by itself, so its constant ' + t('p^{2}') + ' is positive. (Also: a square needs the two numbers to be equal, but with ' + t('c<0') + ' they have opposite signs.)',
            ['Expand ' + t('(x-p)^{2}') + ' and look at the sign of the constant term.'], 'c<0 not a perfect square');
        } }] },
      { num: '20', section: 'Extra practice E — Stretch', stem: '<b>Stretch.</b> A trinomial like ' + t('x^{4}-5x^{2}-36') + ' can be factored by treating ' + t('x^{2}') + ' as the variable: two integers with product ' + t('-36') + ' and sum ' + t('-5') + ' give ' + t('(x^{2}-9)(x^{2}+4)') + '. The first bracket is a difference of squares, so the complete factorization is ' + t('(x-3)(x+3)(x^{2}+4)') + '; ' + t('x^{2}+4') + ' does not factor further. Factor each expression as completely as possible.', parts: [
        { id: 'e20a', level: 'MAS', make: function (r) { var o = pickWhere(function () { return [r.int(1, 4), r.int(2, 5)]; }, function (o) { return o[0] < o[1]; }); return dsqPart(-o[0], -o[1], r.pick(['x', 'x', 'a', 'y'])); } },
        { id: 'e20b', level: 'ADV', make: function (r) { var o = pickWhere(function () { return [r.int(2, 9), r.int(2, 8)]; }, function (o) { return !isSq(o[1]) && o[0] !== o[1] && o[0] * o[1] <= 50; }); return facPart(spec({ e: 2, p: o[0], q: -o[1] })); } },
        { id: 'e20c', level: 'ADV', make: function (r) {
          var o = pickWhere(function () { return [r.int(3, 10), r.int(2, 6)]; }, function (o) { return !isSq(o[0]) && o[0] > o[1] && o[0] * o[1] <= 50; }), s = spec({ e: 2, p: -o[0], q: o[1] }), wr = [];
          if (isSq(o[1])) { var h = Math.round(Math.sqrt(o[1])); wr.push({ is: P.mul(bin(V('x', 2), -o[0]), bin(V('x'), -h), bin(V('x'), h)), code: 'sum-squares', hint: t('x^{2}+' + o[1]) + ' is a <b>sum</b> of squares — it doesn’t factor. ' + t('(x-' + h + ')(x+' + h + ')=x^{2}-' + o[1]) + '.' }); }
          return facPart(s, { wrong: wr });
        } }] }
    ]
  });

  /* ---------------- helpers used above (hoisted) ---------------- */
  function rowsE4(sh) { var a = sh.p1, c = sh.p2; return [spec({ p: -a[1], q: -a[0] }), spec({ p: -a[1], q: a[0] }), spec({ p: c[0], q: c[1] }), spec({ p: c[1], q: -c[0] })]; }
  function rowsE5(sh) { return [spec({ p: sh.a[0], q: sh.a[1] }), spec({ p: -sh.a[1], q: sh.a[0] }), spec({ p: sh.sq * sh.n, q: sh.sq * sh.n }), spec({ p: sh.d[1], q: -sh.d[0] })]; }
  /* "show it is prime": every sum a pair with product c (< 0) can have */
  function primeSumsPart(b, c) {
    var N = -c, pr = posPairs(N), pos = pr.map(function (pq) { return pq[1] - pq[0]; }), all = [];
    pos.forEach(function (d) { all.push(d); if (d) all.push(-d); });
    var sumsT = pos.map(function (d) { return d ? '\\pm' + d : '0'; }).join(',\\ ');
    var p = B.valueSet('Show that ' + t(triTex('x', b, c)) + ' is prime: list every sum that two integers with product ' + t(c) + ' can have.', all, { v: 'b', keyTex: sumsT,
      diag: function (A, T) {
        var miss = T.filter(function (x) { return A.indexOf(x) < 0; }), extra = A.filter(function (x) { return T.indexOf(x) < 0; });
        if (extra.length && pr.some(function (pq) { return Math.abs(extra[0]) === pq[0] + pq[1]; })) return { code: 'u4l4-size-sum', hint: 'The product ' + t(c) + ' is negative, so one number is negative: the sum is the <b>difference</b> of the sizes, e.g. ' + t(pr[0][1] + '+(-' + pr[0][0] + ')=' + (pr[0][1] - pr[0][0])) + '.' };
        if (!extra.length && miss.length && miss.every(function (x) { return x < 0; })) return { code: 'no-negatives', hint: 'Each pair can be signed two ways. Make the <b>larger</b> number negative too: that gives the negative sums.' };
        if (!extra.length && miss.length) return { code: 'missing-b', hint: 'Go through every factor pair of ' + t(N) + ' in order: ' + t(pairsTex(N)) + '.' };
        return null;
      } },
      'Factor pairs of ' + t(N) + ': ' + t(pairsTex(N)) + '. With opposite signs each pair gives a sum of ' + t('\\pm') + '(larger − smaller):<br>' + pr.map(function (pq) { return t(pq[0] + ',\\ ' + pq[1]) + ' → ' + t((pq[1] - pq[0] ? '\\pm' : '') + (pq[1] - pq[0])); }).join(', ') + '.<br>None of these is ' + t(b) + ', so ' + t(triTex('x', b, c)) + ' cannot be factored over the integers: it is <b>prime</b>.',
      ['List the factor pairs of ' + t(N) + '. One number in each pair is negative, so each pair gives two sums: ' + t('+') + '(larger − smaller) and ' + t('-') + '(larger − smaller).', 'You can type ' + t('\\pm') + ' or list each value.'], 'prime: sums for c=' + c);
    p.bad = [pos.join(', '), pr.map(function (pq) { return '\\pm' + (pq[0] + pq[1]); }).join(', ')];
    return p;
  }
  /* every factor pair of N (pairs input) */
  function factorPairsPart(N) {
    var want = posPairs(N);
    return { prompt: 'List every factor pair of ' + t(N) + '.', input: { type: 'pairs', start: 1 }, key: want.map(function (p) { return [String(p[0]), String(p[1])]; }),
      answer: want.map(function (p) { return t(p[0] + '\\times ' + p[1]); }).join(', '), text: 'factor pairs of ' + N,
      check: function (resp) {
        if (!resp || !resp.length) return form('empty', 'Write your first pair in the boxes.');
        var got = [];
        for (var i = 0; i < resp.length; i++) {
          var a = Number(resp[i][0]), b = Number(resp[i][1]);
          if (resp[i][0] === '' || resp[i][1] === '' || !isFinite(a) || !isFinite(b) || a <= 0 || b <= 0 || a % 1 || b % 1) return form('blank', 'Each pair needs two whole numbers.');
          got.push(a < b ? [a, b] : [b, a]);
        }
        var keys = got.map(function (p) { return p[0] + ',' + p[1]; });
        for (i = 0; i < keys.length; i++) if (keys.indexOf(keys[i]) !== i) return form('dup', 'You listed ' + t(got[i][0] + '\\times ' + got[i][1]) + ' twice (the same pair in the other order counts once).');
        for (i = 0; i < got.length; i++) if (got[i][0] * got[i][1] !== N) return wrong('u4l4-pair-wrong', t(got[i][0] + '\\times ' + got[i][1] + '=' + got[i][0] * got[i][1]) + ', not ' + t(N) + '.');
        if (got.length < want.length) return wrong('u4l4-pair-missing', 'Every pair you have works, but there ' + (want.length - got.length === 1 ? 'is one more' : 'are ' + (want.length - got.length) + ' more') + '. Try ' + t('1, 2, 3, \\ldots') + ' in order until the pairs meet.');
        return ok();
      },
      solution: 'Try ' + t('1, 2, 3, \\ldots') + ' in order: ' + t(pairsTex(N)) + '. The next divisor would repeat a pair, so that is all of them.', hints: ['Start with ' + t('1\\times ' + N) + ', then try ' + t('2') + ', ' + t('3') + ', … in order.'],
      bad: [want.slice(1).map(function (p) { return [String(p[0]), String(p[1])]; }), [['2', String(N)]]] };
  }
  /* Mastery: every negative c (above a bound) for which x² + bx + c factors */
  function negCPart(r) {
    var o = pickWhere(function () { var b = r.int(1, 7), Nn = r.pick([20, 25, 30]), list = []; for (var m = -1; ; m--) { var c = m * (b - m); if (c <= -Nn) break; list.push([m, b - m, c]); } return { b: b, N: Nn, list: list }; }, function (o) { return o.list.length >= 2 && o.list.length <= 5; });
    var b = o.b, Nn = o.N, vals = o.list.map(function (q) { return q[2]; }), last = o.list.length ? o.list[o.list.length - 1][0] - 1 : -1;
    var trin = 'x^{2}+' + (b === 1 ? '' : b) + 'x+c';
    var rows = o.list.map(function (q) { return t(q[0] + '+' + q[1] + '=' + b) + ', ' + t('c=(' + q[0] + ')(' + q[1] + ')=' + q[2]) + ': ' + t(trin.replace('+c', String(q[2])) + '=(x' + sg(q[0]) + ')(x' + sg(q[1]) + ')'); });
    var p = B.valueSet('Find every <b>negative</b> integer ' + t('c') + ' greater than ' + t(-Nn) + ' for which ' + t(trin) + ' can be factored over the integers.', vals, { v: 'c', keyTex: vals.map(function (c) { return 'c=' + c; }).join(',\\ '),
      diag: function (A, T) {
        var extra = A.filter(function (x) { return T.indexOf(x) < 0; }), miss = T.filter(function (x) { return A.indexOf(x) < 0; });
        if (extra.length) { var e = extra[0]; return { code: 'c-extra', hint: e >= 0 ? t('c') + ' must be negative.' : e <= -Nn ? t('c=' + e) + ' is not greater than ' + t(-Nn) + '.' : 'No two integers with sum ' + t(b) + ' have product ' + t(e) + ', so ' + t(trin.replace('+c', String(e))) + ' does not factor.' }; }
        return { code: 'c-missing', hint: 'You have ' + (T.length - miss.length) + ' of the ' + T.length + ' values. If one integer is ' + t('m') + ', the other is ' + t(b + '-m') + '. Try ' + t('m=-1,-2,-3,\\ldots') + ' and stop when the product reaches ' + t(-Nn) + '.' };
      } },
      'If the two integers add to ' + t(b) + ', one is ' + t('m') + ' and the other is ' + t(b + '-m') + '. For ' + t('c<0') + ' one of them is negative, so try ' + t('m=-1,-2,-3,\\ldots') + ':<br>' + rows.join('<br>') + '<br>Next, ' + t('m=' + last) + ' gives ' + t('c=' + last * (b - last)) + ', which is not greater than ' + t(-Nn) + '. So ' + t('c=' + vals.join(',\\ ')) + '.',
      ['If the two integers add to ' + t(b) + ', one of them is ' + t('m') + ' and the other is ' + t(b + '-m') + '. Their product is ' + t('c') + '.', 'For a negative ' + t('c') + ', try ' + t('m=-1') + ', then ' + t('-2') + ', ' + t('-3') + ', … until the product passes ' + t(-Nn) + '.'], 'negative c for x^2+' + b + 'x+c');
    p.good = [vals.join(', ')];
    p.bad = [vals.slice(1).join(', '), vals.concat([last * (b - last)]).join(', ')];
    return p;
  }
  function dsqPart(h, k, v) { // (v² + h·|h|)(v² + k·|k|): a negative argument means v² − n², which splits again
    var X = V(v), a = h < 0 ? -h * h : h * h, b = k < 0 ? -k * k : k * k, s = spec({ v: v, e: 2, p: a, q: b }), list = [];
    [h, k].forEach(function (z) { if (z < 0) { list.push(bin(X, z)); list.push(bin(X, -z)); } else list.push(P.add(V(v, 2), P.num(z * z))); });
    s.list = list; s.key = FX.tex(list);
    var steps = [h, k].map(function (z) { return z < 0 ? t(v + '^{2}-' + z * z + '=(' + v + '-' + (-z) + ')(' + v + '+' + (-z) + ')') : t(v + '^{2}+' + z * z) + ' does not factor (sum of squares)'; }).join('; ');
    var sol = 'In terms of ' + t(v + '^{2}') + ': ' + t(sg(a)) + ' and ' + t(sg(b)) + ' (product ' + t(s.c) + ', sum ' + t(s.b) + '), so ' + t(tx(s.full) + '=' + FX.tex([s.A, s.B])) + '.<br>Then each bracket is a difference of squares: ' + steps + '.<br>' + t(tx(s.full) + '=' + s.key);
    var p = facPart(s, { sol: sol, hints: ['First treat it as a trinomial in ' + t(v + '^{2}') + ': two numbers with product ' + t(s.c) + ' and sum ' + t(s.b) + '.', 'Then check each bracket: ' + t(v + '^{2}-n^{2}=(' + v + '-n)(' + v + '+n)') + ' factors again.'] });
    p.good = [FX.tex(list.slice().reverse())]; p.bad = [FX.tex([s.A, s.B])];
    return p;
  }
})(window);
