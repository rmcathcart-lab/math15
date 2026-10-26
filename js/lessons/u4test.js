/* Math 15 · Unit 4 Test (AN5) — Factoring Polynomial Expressions, built the way the Math 10C Unit 4 Test was built
 * (BEG / PRG / MAS boxes, mostly typed answers, factored keys built from the generated factors so they always expand to
 * the question, `bad` answers with u4t- codes, worked solutions with a check by expanding) but pitched at Math 15 and
 * NOT based on the Math 15 multiple-choice paper tests. 75 minutes, no calculator; 17 questions / 32 parts.
 *
 * How each box is pitched (numbers come from Ryan's Math 15 Lessons 1–10, assignments, extra practice and exit slips —
 * those numbers are possible values):
 *   Beginning  — each lesson's core skill as first taught, one step, small numbers: GCF of two monomials (8x², 12x³),
 *                remove a GCF from a binomial, x²+bx+c with c > 0 (both signs of b), x² − 49, the three-part test for a
 *                perfect square trinomial + factor x² ± 2qx + q², check a factoring by expanding (FOIL) and decide,
 *                the zero product property on an already-factored equation, and which method to use first (Lesson 8).
 *   Progressing — the typical assignment question: x²+bx+c with c < 0, a GCF with two variables, a negative GCF,
 *                GCF then a trinomial, 4x² − 81, (2x − 5)²-type perfect squares, decomposition with a = 2 or 3 (one
 *                step-by-step, one plain with negative b and/or c), solve x² + 3x = 10 and x² − 6x = 0 / x² − 36 = 0.
 *   Mastery    — Math 15's hardest assignment/extra-practice items, clearly easier than the 10C Mastery box: two-stage
 *                factoring (3x³ − 12x, 2x² + 20x + 50), find the error (Lesson 10 #24, Jamal/Priya) and correct it,
 *                find all k so x² + kx + c factors (c with only two factor pairs) and so a trinomial is a perfect square,
 *                solve 2x² + 5x − 3 = 0 and 3x² = 12x, and a garden-bed area (Lesson 7 #10) factored into side lengths
 *                and then used for a perimeter.
 * Coverage: L1 Q1, Q5 · L2 Q1b, Q9 · L3 Q2 · L4 Q8, Q14, Q15a · L5 Q3, Q10b, Q13a · L6 Q4, Q10c, Q13b, Q15b ·
 *           L7 Q11, Q17 · L8 Q7, Q10a, Q13 · L9 Q6, Q12, Q16 (solving is new: the 10C test has none).
 * Conversions to online: "explain the error" → checkable steps (expand the student’s answer, the pair that works) plus
 * the corrected factorization; "is it a perfect square trinomial?" → a yes/no table; "name the method" → a table;
 * "multiply to check" → the expansion, then correct / not correct; solving answers → a list of values in any order;
 * "find all k" → a list of values. A factored-form box that just gets the question typed back earns nothing (not the
 * 2/3 "right value, wrong form" credit). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = HW.poly, FX = HW.factor, F = HW.fmt;

  HW.addCodes({
    'u4t-gcf-high': 'GCF used the highest power, not the lowest', 'u4t-neg-gcf': 'Took out a positive GCF when a negative one was asked',
    'u4t-neg-signs': 'Negative GCF: signs in the bracket not all changed', 'u4t-same-sign': 'Same signs used when the constant is negative',
    'u4t-pair-sum': 'Integers with the right product but the wrong sum', 'u4t-pair-product': 'Integers with the right sum but the wrong product',
    'u4t-dos-square': 'Wrote a difference of squares as a perfect square', 'u4t-pst-dos': 'Wrote a perfect square trinomial as a difference of squares',
    'u4t-no-root': 'Used a square instead of its square root in a bracket', 'u4t-split': 'Middle term not split with the pair',
    'u4t-group': 'A group not factored to match the other', 'u4t-pair-as-factors': 'Wrote the pair into the brackets as if a = 1',
    'u4t-no-divide': 'Used ax ± m, ax ± n without dividing out a', 'u4t-kept-error': 'Repeated the student’s error',
    'u4t-expand-orig': 'Wrote the original instead of expanding the student’s answer', 'u4t-k-c-sign': 'Used the factor pairs for the wrong sign of c',
    'u4t-k-one': 'Gave only one value of k', 'u4t-k-pos': 'Gave only the positive values of k',
    'u4t-not-zero': 'Set the factors equal to the other side instead of 0', 'u4t-lost-zero': 'Divided by x and lost the solution x = 0',
    'u4t-zp-no-divide': 'Factor ax + b = 0 not solved (forgot to divide by a)', 'u4t-zp-const': 'Gave the constant factor as a solution',
    'u4t-one-side': 'Only one side length right', 'u4t-area-not-perim': 'Found the area instead of the perimeter', 'u4t-half-perim': 'Added length and width only (half the perimeter)'
  });
  HW.addPartial({
    'u4t-gcf-high': 'b', 'u4t-neg-signs': 'b', 'u4t-same-sign': 'b', 'u4t-pair-sum': 'b', 'u4t-pair-product': 'b',
    'u4t-dos-square': 'n', 'u4t-pst-dos': 'n', 'u4t-no-root': 'b', 'u4t-split': 'b', 'u4t-group': 'b', 'u4t-pair-as-factors': 'n', 'u4t-no-divide': 'n',
    'u4t-kept-error': 'n', 'u4t-expand-orig': 'n', 'u4t-k-c-sign': 'b', 'u4t-k-one': 'b', 'u4t-k-pos': 'b',
    'u4t-not-zero': 'n', 'u4t-lost-zero': 'b', 'u4t-zp-no-divide': 's', 'u4t-zp-const': 's',
    'u4t-one-side': 'b', 'u4t-area-not-perim': 'n', 'u4t-half-perim': 's'
  });
  /* labels for shared codes this file uses (their partial-credit decisions are already in js/partial.js); kept if a lesson file set them */
  (function (o) { Object.keys(o).forEach(function (k) { if (!HW.CODES[k]) { var x = {}; x[k] = o[k]; HW.addCodes(x); } }); })({
    'gcf-dropped': 'Dropped the common factor', 'gcf-sign': 'Wrong sign on the GCF', 'gcf-not-greatest': 'A common factor, but not the greatest',
    'sign-swap': 'Signs in the wrong brackets (pair by product only)', 'pst-sign': 'Perfect square with the wrong sign in the bracket',
    'not-doubled': 'Middle term of a perfect square not doubled', 'ax-sign-swap': 'Signs of both constants switched',
    'ax-const-swap': 'Constant terms in the wrong brackets', 'ax-gcf-dropped': 'Dropped the common factor', 'ax-ac-wrong': 'Wrong value of ac'
  });

  /* ---------------- polynomial helpers ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function pick(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u4test: no valid numbers'); }
  function M(c, v, e) { var o = {}; if (v) o[v] = e == null ? 1 : e; return P.mono(c, o); }   // c·v^e
  function MM(c, vs) { return P.mono(c, vs); }                                                 // c·x^a·y^b
  function N(c) { return P.num(c); }
  function sum(arr) { return P.add.apply(null, arr); }
  function seq(arr) { return P.seq(arr); }
  function br(arr) { return '(' + seq(arr) + ')'; }
  function tx(p) { return P.tex(p); }
  function lin(a, v, b) { return [M(a, v), N(b)]; }             // a v + b, as terms
  function pv(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function plain(s) { return String(s).replace(/\\left|\\right|\\,|\\ /g, '').replace(/\\times/g, '×').replace(/[{}\\]/g, ''); }

  /* a factored form built from term arrays: pre = monomial in front (or null), brs = [terms] or { terms, k } */
  function FT(pre, brs) {
    var list = [], tex = '';
    if (pre) { list.push(pre); var s = tx(pre); tex = s === '1' ? '' : s === '-1' ? '-' : s; }
    brs.forEach(function (b) {
      var terms = Array.isArray(b) ? b : b.terms, k = Array.isArray(b) ? 1 : (b.k || 1), p = sum(terms);
      list.push(k > 1 ? { p: p, k: k } : p); tex += '(' + seq(terms) + ')' + (k > 1 ? '^{' + k + '}' : '');
    });
    return { list: list, tex: tex, poly: FX.product(list) };
  }
  function prodOf(x) { return Array.isArray(x) ? FX.product(x) : x && x.list ? x.poly : P.lift(x); }
  function wtex(x) { return x && x.tex ? x.tex : Array.isArray(x) ? FX.tex(x) : tx(x); }
  function cleanW(T, ws) {
    var out = [];
    (ws || []).forEach(function (w) { if (!w || !w.is) return; var p = prodOf(w.is); if (P.eq(p, T) || out.some(function (o) { return P.eq(o.is, p); })) return; out.push({ is: p, code: w.code, hint: w.hint, tex: w.tex || wtex(w.is) }); });
    return out;
  }
  /* the question typed back (not a product at all) shows no factoring: wrong, not the 2/3 "form" nudge */
  function noProduct(chk) { return function (resp) { var res = chk(resp); return res && res.v === 'form' && res.code === 'not-factored' ? wrong('not-factored', res.hint) : res; }; }
  /* "factor (completely)" part; wrongs: [{ is: FT | list | poly, code, hint }] (any equal to the target are dropped) */
  function fac(prompt, Ft, wrongs, sol, hints, text, o) {
    o = o || {}; var ws = cleanW(Ft.poly, wrongs);
    var part = KP.factored(prompt, Ft.list, { wrong: ws.map(function (w) { return { is: w.is, code: w.code, hint: w.hint }; }), keyTex: Ft.tex, gcfOnly: o.gcfOnly, vars: o.vars, before: o.before, after: o.after }, sol, hints, text);
    part.check = noProduct(part.check);
    part.bad = ws.map(function (w) { return w.tex; }).concat([tx(Ft.poly)]).concat(o.bad || []);
    return part;
  }
  function facCheck(Ft, wrongs, o) { o = o || {}; return noProduct(K.factored(Ft.list, { wrong: cleanW(Ft.poly, wrongs).map(function (w) { return { is: w.is, code: w.code, hint: w.hint }; }), gcfOnly: o.gcfOnly })); }
  function polyCheck(T, wrongs) { return K.poly(T, { wrong: cleanW(T, wrongs).map(function (w) { return { is: w.is, code: w.code, hint: w.hint }; }) }); }
  function polyPart(prompt, T, wrongs, sol, hints, text, o) {
    o = o || {}; var ws = cleanW(T, wrongs);
    var p = KP.poly(prompt, T, { wrong: ws.map(function (w) { return { is: w.is, code: w.code, hint: w.hint }; }), vars: o.vars, before: o.before }, sol, hints, text);
    p.bad = ws.map(function (w) { return tx(w.is); }).concat(o.bad || []);
    return p;
  }
  function numBox(label, o) { o = o || {}; return { label: label, name: o.name || label.replace(/<[^>]*>|\\\(|\\\)|:$/g, ''), before: o.before, after: o.after }; }
  function polyBox(label, vars, o) { o = o || {}; return { label: label, name: o.name || label.replace(/<[^>]*>|\\\(|\\\)|:$/g, ''), mode: 'math', keys: 'poly', vars: vars || ['x'], wide: o.wide !== false, before: o.before, after: o.after, placeholder: o.ph }; }
  /* several boxes checked together (checks[i](value, all) → result); reports the first wrong box, else the first form issue */
  function boxes(prompt, fields, checks, keys, answer, sol, hints, text, bad, good) {
    var labels = fields.map(function (f) { return f.name || f.label; });
    return { prompt: prompt, input: { type: 'fields', fields: fields }, key: keys, answer: answer, solution: sol, hints: hints || [], text: text, bad: bad || [], good: good || [],
      check: function (resp) {
        resp = resp || []; var firstForm = null, firstWrong = null;
        for (var i = 0; i < checks.length; i++) {
          var r = checks[i](resp[i] == null ? '' : resp[i], resp); if (r.v === 'correct') continue;
          var out = { v: r.v, code: r.code, hint: '<b>' + labels[i] + ':</b> ' + (r.hint || 'Check this one again.') };
          if (r.v === 'form') { if (!firstForm) firstForm = out; } else if (!firstWrong) firstWrong = out;
        }
        return firstWrong || firstForm || ok();
      } };
  }
  function blank(v) { return v == null || !String(v).trim(); }
  /* two integer boxes in either order: want = [m, n] */
  function pairCheck(want, prod, total, diag) {
    return function (a, b) {
      if (blank(a) || blank(b)) return form('empty', 'Fill in both integers.');
      var pa = HW.parse.number(String(a).replace(/^\s*\+/, '')), pb = HW.parse.number(String(b).replace(/^\s*\+/, ''));
      if (!pa.ok || !pb.ok) return form('notnumber', 'Type an integer in each box.');
      var x = pa.value, y = pb.value;
      if ((x === want[0] && y === want[1]) || (x === want[1] && y === want[0])) return ok();
      var h = diag ? diag(x, y) : null; if (h) return wrong(h.code, h.hint);
      if (x * y === prod && x + y !== total) return wrong('u4t-pair-sum', t(x + '\\times ' + pv(y) + '=' + prod) + ' is right, but ' + t(x + '+' + pv(y) + '=' + (x + y)) + ', not ' + t(total) + '.');
      if (x + y === total && x * y !== prod) return wrong('u4t-pair-product', 'They add to ' + t(total) + ', but ' + t(x + '\\times ' + pv(y) + '=' + x * y) + ', not ' + t(prod) + '.');
      return wrong('value', 'The two integers must multiply to ' + t(prod) + ' and add to ' + t(total) + '.');
    };
  }
  function readPoly(s) { var a = K.read(s); if (a.res) return { res: a.res }; var r = P.read(a.ast); if (!r.ok) return { res: wrong('not-poly', 'That isn’t a polynomial.') }; return { p: r.p, ast: a.ast }; }
  function coefOf(m) { return Math.abs(P.sorted(m)[0].c[0]); }
  /* the monomial factors of a typed answer multiply to a negative number? (for "remove a negative GCF") */
  function monoSign(resp) {
    var a = K.read(resp); if (a.res) return 0;
    var sp = FX.split(a.ast); if (!sp.ok) return 0;
    var s = 1; sp.factors.forEach(function (f) { if (P.count(f.p) === 1) { var c = P.terms(f.p)[0].c; if (c[0] < 0 && f.k % 2) s = -s; } });
    return s;
  }
  /* "solve" part: a list of values in any order */
  function solvePart(prompt, values, diag, sol, hints, text, bad) {
    var p = KP.valueSet(prompt, values, { v: 'x', diag: diag }, sol, hints, text);
    p.bad = bad || [];
    return p;
  }
  function has(A, x) { return A.some(function (y) { return Math.abs(x - y) < 1e-9; }); }
  function sameSet(A, B) { return A.length === B.length && A.every(function (x) { return has(B, x); }) && B.every(function (x) { return has(A, x); }); }
  function xs(vals) { return vals.map(function (v) { return 'x=' + v; }).join(',\\ '); }
  function fracTex(a, b) { var g = gcd(a, b), A = a / g, B = b / g; return B === 1 ? String(A) : (A < 0 ? '-' : '') + '\\frac{' + Math.abs(A) + '}{' + B + '}'; }

  /* ---------------- ax² + bx + c built from its factors (as in Lesson 7) ---------------- */
  function vo(v, e) { var o = {}; if (v && e) o[v] = e; return o; }
  function tlin(p, q, v) { return P.add(MM(p, vo(v || 'x', 1)), N(q)); }
  function mulAll(list) { return list.reduce(function (acc, f) { return P.mul(acc, f); }, N(1)); }
  function Tri(o) {
    var v = o.v || 'x', T = { p: o.p, q: o.q, r: o.r, s: o.s, v: v };
    T.F1 = tlin(o.p, o.q, v); T.F2 = tlin(o.r, o.s, v);
    T.inner = P.mul(T.F1, T.F2);
    T.a = o.p * o.r; T.b = o.p * o.s + o.q * o.r; T.c = o.q * o.s; T.ac = T.a * T.c;
    T.m = o.p * o.s; T.n = o.q * o.r;
    T.full = T.inner; T.tex = tx(T.full); T.innerTex = tx(T.inner);
    T.list = [T.F2, T.F1]; T.key = FX.tex(T.list);
    return T;
  }
  function splitTex(T) { var v = T.v; return P.seq([MM(T.a, vo(v, 2)), MM(T.m, vo(v, 1)), MM(T.n, vo(v, 1)), N(T.c)]); }
  function groupTex(T) {
    var g1 = MM(T.p, vo(T.v, 1)), g2 = N(T.q), b2 = P.btex(T.F2), g2t = tx(g2);
    return tx(g1) + b2 + (g2t.charAt(0) === '-' ? '' : '+') + g2t + b2;
  }
  function solDecomp(T) {
    var L = [];
    L.push(t('ac=' + T.a + '\\times ' + pv(T.c) + '=' + T.ac) + '; the pair with product ' + t(T.ac) + ' and sum ' + t(T.b) + ' is ' + t(T.m) + ' and ' + t(T.n) + '.');
    L.push(t(T.innerTex + '=' + splitTex(T)));
    L.push(t('=' + groupTex(T)));
    L.push(t('=' + P.btex(T.F2) + P.btex(T.F1)));
    L.push('Check: expanding ' + t(T.key) + ' gives ' + t(T.tex) + ' ✓');
    return L.join('<br>');
  }
  function stdWrongs(T) {
    var out = [], seen = [T.full], v = T.v;
    function add(fs, code, hint) {
      var pr = mulAll(fs);
      if (P.isZero(pr) || seen.some(function (x) { return P.eq(x, pr); })) return;
      seen.push(pr); out.push({ is: pr, code: code, hint: hint(t(tx(pr))), tex: FX.tex(fs) });
    }
    add([tlin(T.p, -T.q, v), tlin(T.r, -T.s, v)], 'ax-sign-swap', function (Pt) { return 'Your factors multiply to ' + Pt + ': the middle term has the wrong sign. Change the sign of the constant term in <b>both</b> brackets.'; });
    add([tlin(T.p, T.s, v), tlin(T.r, T.q, v)], 'ax-const-swap', function (Pt) { return 'Your factors multiply to ' + Pt + '. The first and last terms are right but the middle term isn’t: the constant terms are in the wrong brackets.'; });
    add([tlin(1, T.m, v), tlin(1, T.n, v)], 'u4t-pair-as-factors', function (Pt) { return 'Your factors multiply to ' + Pt + '. Writing the pair straight into the brackets only works when ' + t('a=1') + '. Use the pair to <b>split the middle term</b>, then group.'; });
    add([tlin(T.a, T.m, v), tlin(T.a, T.n, v)], 'u4t-no-divide', function (Pt) { return 'Your factors multiply to ' + Pt + ', which is ' + t(T.a) + ' times too big. Split the middle term with the pair and group instead.'; });
    return out;
  }
  function triPart(T, o) {
    o = o || {};
    var W = stdWrongs(T).filter(function (x) { return !P.eq(x.is, T.full); });
    var p = KP.factored(o.prompt || t(T.tex), T.list, { wrong: W.map(function (x) { return { is: x.is, code: x.code, hint: x.hint }; }) }, solDecomp(T),
      ['Find two integers with product ' + t('ac=' + T.ac) + ' and sum ' + t('b=' + T.b) + '.', 'Split the middle term with them, take a common factor out of each pair, then take out the common bracket.'], o.text || 'factor ' + plain(T.tex));
    p.check = noProduct(p.check);
    p.bad = W.map(function (x) { return x.tex; }).concat([T.tex]);
    return p;
  }
  function triPick(r, gen, test) { return pick(gen, function (o) { return o.q && o.s && gcd(o.p, o.q) === 1 && gcd(o.r, o.s) === 1 && test(o); }); }

  /* the three-part test, as a sentence */
  function pstWhy(a, b, c, v) {
    var ra = Math.round(Math.sqrt(a)), rc = c > 0 ? Math.round(Math.sqrt(c)) : NaN;
    var A = (ra === 1 ? '' : ra) + v, first = t(tx(M(a, v, 2)) + '=(' + A + ')^{2}');
    if (c <= 0) return 'the last term ' + t(c) + ' is negative, so it is not a perfect square';
    if (rc * rc !== c) return t(c) + ' is not a perfect square';
    if (Math.abs(b) !== 2 * ra * rc) return first + ' and ' + t(c + '=' + rc + '^{2}') + ', but the middle term should be ' + t('2(' + A + ')(' + rc + ')=' + 2 * ra * rc + v) + ', not ' + t(Math.abs(b) + v);
    return first + ', ' + t(c + '=' + rc + '^{2}') + ', and ' + t('2(' + A + ')(' + rc + ')=' + 2 * ra * rc + v) + ' matches the middle term';
  }

  HW.defineTest({
    id: 'u4test', unit: 4, title: 'Unit 4 Test', outcome: 'AN5', calc: false,
    blurb: 'The Unit 4 outcomes-based test: AN5 (greatest common factors, x²+bx+c, differences of squares, perfect square trinomials, ax²+bx+c by decomposition, choosing a strategy, and solving equations by factoring), at the BEG, PRG and MAS levels.',
    questions: [
      /* ======================= Beginning ======================= */
      { num: '1', outcome: 'AN5', stem: 'Greatest common factors.', parts: [
        { id: '1a', outcome: 'AN5', level: 'BEG', make: function (r) {
          var v = r.pick(['x', 'x', 'y', 'a', 'm']);
          var z = pick(function () { return { g: r.int(2, 6), a: r.int(1, 4), b: r.int(2, 5), e1: r.int(1, 4), e2: r.int(2, 5) }; }, function (z) { return z.a < z.b && gcd(z.a, z.b) === 1 && z.e1 < z.e2 && z.g * z.b <= 30; });
          var c1 = z.g * z.a, c2 = z.g * z.b, G = M(z.g, v, z.e1), T1 = tx(M(c1, v, z.e1)), T2 = tx(M(c2, v, z.e2));
          var small = z.g % 2 === 0 && z.g > 2 ? 2 : 1;
          return polyPart('State the greatest common factor (GCF) of ' + t(T1) + ' and ' + t(T2) + '.', G,
            [{ is: M(z.g, v, z.e2), code: 'u4t-gcf-high', hint: 'The GCF can only use what <b>both</b> terms have: ' + t(T1) + ' has only ' + t(v + '^{' + z.e1 + '}') + ', so use the <b>lowest</b> power.' },
              { is: M(small, v, z.e1), code: 'gcf-not-greatest', hint: 'That divides both terms, but it isn’t the <b>greatest</b>: what is the GCF of ' + t(c1) + ' and ' + t(c2) + '?' },
              { is: N(z.g), code: 'gcf-not-greatest', hint: 'Both terms also contain ' + t(v + '^{' + z.e1 + '}') + ' — it belongs in the GCF too.' }],
            'Numbers: the GCF of ' + t(c1) + ' and ' + t(c2) + ' is ' + t(z.g) + '. Letters: the lowest power of ' + t(v) + ' in both is ' + t(v + '^{' + z.e1 + '}') + '.<br>So the GCF is ' + t(tx(G)) + '.',
            ['Find the greatest number that divides both ' + t(c1) + ' and ' + t(c2) + '.', 'Use the lowest power of ' + t(v) + ' that appears in both terms.'], 'GCF ' + plain(T1) + ', ' + plain(T2), { vars: [v], bad: [tx(M(z.g * z.a * z.b, v, z.e1))] });
        } },
        { id: '1b', outcome: 'AN5', level: 'BEG', make: function (r) {
          var v = r.pick(['x', 'x', 'y', 'a', 'm']);
          var z = pick(function () { return { g: r.int(2, 6), a: r.int(1, 5), b: r.int(1, 5), e: r.int(0, 3), s: r.pick([1, -1]) }; }, function (z) { return gcd(z.a, z.b) === 1 && (z.a > 1 || z.b > 1) && z.a !== z.b && z.g * Math.max(z.a, z.b) <= 30; });
          var G = M(z.g, v, z.e), Ft = FT(G, [[M(z.a, v), N(z.s * z.b)]]), poly = tx(Ft.poly);
          var hi = M(z.g * z.a, v, z.e + 1), lo = M(z.s * z.g * z.b, v, z.e);
          return fac('Factor by removing the GCF: ' + t(poly), Ft, [{ is: FT(G, [[M(z.a, v), N(-z.s * z.b)]]), code: 'sign', hint: 'Check the sign in the bracket: expand your answer and compare it with ' + t(poly) + '.' }],
            'The GCF of ' + t(z.g * z.a) + ' and ' + t(z.g * z.b) + ' is ' + t(z.g) + (z.e ? ', and both terms contain ' + t(tx(M(1, v, z.e))) : '') + ', so the GCF is ' + t(tx(G)) + '.<br>Divide each term by it: ' + t(tx(hi) + '\\div ' + tx(G) + '=' + tx(M(z.a, v))) + ', ' + t(tx(lo) + '\\div ' + tx(G) + '=' + (z.s * z.b)) + '.<br>' + t(poly + '=' + Ft.tex) + '<br>Check: ' + t(Ft.tex + '=' + poly) + ' ✓',
            ['Find the greatest common factor of the numbers' + (z.e ? ', and the lowest power of ' + t(v) + ' in both terms' : '') + '.', 'Divide each term by the GCF to get the bracket.'], 'GCF ' + plain(poly),
            { gcfOnly: true, vars: [v] });
        } }] },
      { num: '2', outcome: 'AN5', stem: 'Factor.', parts: [
        { id: '2a', outcome: 'AN5', level: 'BEG', make: function (r) {
          var z = pick(function () { return { m: r.int(1, 6), n: r.int(2, 9) }; }, function (z) { return z.m < z.n && z.m * z.n <= 40 && z.m * z.n >= 6; });
          var Ft = FT(null, [lin(1, 'x', z.m), lin(1, 'x', z.n)]), poly = tx(Ft.poly), b = z.m + z.n, c = z.m * z.n;
          return fac(t(poly), Ft, [{ is: FT(null, [lin(1, 'x', 1), lin(1, 'x', c)]), code: 'u4t-pair-sum', hint: 'Your numbers multiply to ' + t(c) + ' but add to ' + t(1 + c) + '. Find the pair that adds to ' + t(b) + '.' },
            { is: FT(null, [lin(1, 'x', z.m + 1), lin(1, 'x', z.n - 1)]), code: 'u4t-pair-product', hint: 'Your numbers add to ' + t(b) + ' but multiply to ' + t((z.m + 1) * (z.n - 1)) + ', not ' + t(c) + '.' }],
            'Find two integers with product ' + t(c) + ' and sum ' + t(b) + ': ' + t(z.m + '\\times ' + z.n + '=' + c) + ' and ' + t(z.m + '+' + z.n + '=' + b) + '.<br>' + t(poly + '=' + Ft.tex) + '<br>Check: ' + t(Ft.tex + '=' + seq([M(1, 'x', 2), M(z.n, 'x'), M(z.m, 'x'), N(c)]) + '=' + poly) + ' ✓',
            ['Find two integers that multiply to ' + t(c) + ' and add to ' + t(b) + '.', 'Both are positive, because the middle term and the last term are both positive.'], 'factor ' + plain(poly));
        } },
        { id: '2b', outcome: 'AN5', level: 'BEG', make: function (r) {
          var z = pick(function () { return { m: r.int(1, 6), n: r.int(3, 9) }; }, function (z) { return z.m < z.n && z.m * z.n <= 42 && z.m * z.n >= 6; });
          var Ft = FT(null, [lin(1, 'x', -z.m), lin(1, 'x', -z.n)]), poly = tx(Ft.poly), b = -(z.m + z.n), c = z.m * z.n;
          return fac(t(poly), Ft, [{ is: FT(null, [lin(1, 'x', z.m), lin(1, 'x', z.n)]), code: 'sign', hint: 'Your factors give ' + t('+' + (z.m + z.n) + 'x') + '. The middle term is negative and the last term is positive, so <b>both</b> integers are negative.' },
            { is: FT(null, [lin(1, 'x', -1), lin(1, 'x', -c)]), code: 'u4t-pair-sum', hint: 'Your numbers multiply to ' + t(c) + ' but add to ' + t(-1 - c) + '. Find the pair that adds to ' + t(b) + '.' }],
            'Find two integers with product ' + t(c) + ' and sum ' + t(b) + '. The product is positive and the sum is negative, so both are negative: ' + t('(' + (-z.m) + ')(' + (-z.n) + ')=' + c) + ' and ' + t(-z.m + '+(' + (-z.n) + ')=' + b) + '.<br>' + t(poly + '=' + Ft.tex),
            ['Find two integers that multiply to ' + t(c) + ' and add to ' + t(b) + '.', 'A positive product with a negative sum: both integers are negative.'], 'factor ' + plain(poly));
        } }] },
      { num: '3', outcome: 'AN5', stem: 'Factor the difference of squares.', parts: [
        { id: '3', outcome: 'AN5', level: 'BEG', make: function (r) {
          var v = r.pick(['x', 'x', 'y', 'm', 'a', 't', 'p']), n = r.int(3, 12), Ft = FT(null, [lin(1, v, -n), lin(1, v, n)]), poly = tx(Ft.poly);
          return fac(t(poly), Ft, [{ is: FT(null, [{ terms: lin(1, v, -n), k: 2 }]), code: 'u4t-dos-square', hint: t('(' + v + '-' + n + ')^{2}') + ' has a middle term. A difference of squares factors into one ' + t('-') + ' bracket and one ' + t('+') + ' bracket.' },
            { is: FT(null, [lin(1, v, -n * n), lin(1, v, n * n)]), code: 'u4t-no-root', hint: 'Use the square <b>root</b> of ' + t(n * n) + ' in each bracket.' },
            { is: FT(null, [{ terms: lin(1, v, n), k: 2 }]), code: 'u4t-dos-square', hint: t('(' + v + '+' + n + ')^{2}') + ' has a middle term and a ' + t('+' + n * n) + '. A difference of squares is ' + t('(A-B)(A+B)') + '.' }],
            t(poly + '=' + v + '^{2}-' + n + '^{2}') + ', a difference of squares, so ' + t(poly + '=' + Ft.tex) + '.<br>Check: ' + t(Ft.tex + '=' + v + '^{2}+' + n + v + '-' + n + v + '-' + n * n + '=' + poly) + ' ✓',
            ['Both terms are perfect squares and they are subtracted: ' + t('A^{2}-B^{2}=(A-B)(A+B)') + '.', 'What number squared gives ' + t(n * n) + '?'], 'factor ' + plain(poly));
        } }] },
      { num: '4', outcome: 'AN5', stem: 'A perfect square trinomial passes the three-part test: the first term is a perfect square, the last term is a perfect square, and the middle term is ' + t('2\\times\\sqrt{\\text{first}}\\times\\sqrt{\\text{last}}') + '.', parts: [
        { id: '4a', outcome: 'AN5', level: 'BEG', make: function (r) {
          var used = {}, rows = [];
          var add = function (a, b, c, yes) { var p = P.add(M(a, 'x', 2), M(b, 'x'), N(c)), s = tx(p); if (used[s]) return false; used[s] = 1; rows.push({ tex: s, yes: yes, why: pstWhy(a, b, c, 'x') }); return true; };
          var q1 = r.int(2, 9); add(1, r.pick([1, -1]) * 2 * q1, q1 * q1, true);
          pick(function () { return { m: r.int(1, 9), n: r.int(2, 9) }; }, function (z) { var c = z.m * z.n, rc = Math.round(Math.sqrt(c)); return z.m < z.n && rc * rc !== c && z.m + z.n <= 15 && add(1, z.m + z.n, c, false); });
          pick(function () { return r.int(3, 9); }, function (q) { return q !== q1 && add(1, r.pick([1, -1]) * q, q * q, false); });
          if (r.chance(0.5)) pick(function () { return { p: r.pick([2, 3]), q: r.int(1, 5) }; }, function (z) { return gcd(z.p, z.q) === 1 && add(z.p * z.p, r.pick([1, -1]) * 2 * z.p * z.q, z.q * z.q, true); });
          else pick(function () { return r.int(2, 7); }, function (q) { return add(1, 2 * q, -q * q, false); });
          rows = r.shuffle(rows);
          var R = rows.map(function (x, i) { return { id: 'abcd'[i], html: t(x.tex), label: 'abcd'[i] }; }), want = {}, by = {};
          rows.forEach(function (x, i) { want['abcd'[i]] = x.yes ? 'yes' : 'no'; by['abcd'[i]] = x; });
          var p = KP.grid('Is each trinomial a perfect square trinomial?', R, [{ id: 'yes', html: 'Yes', label: 'yes' }, { id: 'no', html: 'No', label: 'no' }], want,
            { why: function (id) { return { code: 'row', hint: 'Check ' + t(by[id].tex) + ' with the three-part test: is the last term a perfect square, and is the middle term twice the product of the square roots?' }; }, rowHead: 'Trinomial' },
            rows.map(function (x) { return t(x.tex) + ': <b>' + (x.yes ? 'yes' : 'no') + '</b> — ' + x.why + '.'; }).join('<br>'),
            ['Check all three parts for each one: first term a square, last term a square (and positive), middle term ' + t('2AB') + '.'], 'which are PSTs');
          var flip = {}; Object.keys(want).forEach(function (k) { flip[k] = want[k]; }); var k0 = Object.keys(flip).filter(function (k) { return !by[k].yes; })[0]; flip[k0] = 'yes';
          var allYes = {}; Object.keys(want).forEach(function (k) { allYes[k] = 'yes'; });
          p.bad = [flip, allYes];
          return p;
        } },
        { id: '4b', outcome: 'AN5', level: 'BEG', make: function (r) {
          var v = r.pick(['x', 'x', 'y', 'a', 'm']), q = r.int(2, 9), sgn = r.pick([1, -1]), Ft = FT(null, [{ terms: lin(1, v, sgn * q), k: 2 }]), poly = tx(Ft.poly);
          return fac('Factor the perfect square trinomial ' + t(poly) + '.', Ft, [{ is: FT(null, [{ terms: lin(1, v, -sgn * q), k: 2 }]), code: 'pst-sign', hint: 'The middle term is ' + (sgn < 0 ? 'negative' : 'positive') + ', so the bracket is ' + t(v + (sgn < 0 ? '-' : '+') + q) + '.' },
            { is: FT(null, [lin(1, v, -q), lin(1, v, q)]), code: 'u4t-pst-dos', hint: 'That gives ' + t(v + '^{2}-' + q * q) + ' — no middle term. A perfect square trinomial is ' + t('(A\\pm B)^{2}') + '.' },
            { is: FT(null, [{ terms: lin(1, v, sgn * q * q), k: 2 }]), code: 'u4t-no-root', hint: 'Use the square <b>root</b> of ' + t(q * q) + ' in the bracket.' }],
            t(v + '^{2}=(' + v + ')^{2}') + ', ' + t(q * q + '=' + q + '^{2}') + ', and ' + t('2(' + v + ')(' + q + ')=' + 2 * q + v) + ' matches the middle term, so it is ' + t('(A' + (sgn < 0 ? '-' : '+') + 'B)^{2}') + ' with ' + t('A=' + v) + ', ' + t('B=' + q) + ':<br>' + t(poly + '=' + Ft.tex) + '<br>(' + t(Ft.tex.replace(/\^\{2\}$/, '') + Ft.tex.replace(/\^\{2\}$/, '')) + ' is also right.)',
            ['Take the square root of the first term and of the last term.', 'The sign in the bracket is the sign of the middle term.'], 'factor ' + plain(poly), { bad: ['(' + v + (sgn < 0 ? '+' : '-') + q + ')(' + v + (sgn < 0 ? '+' : '-') + q + ')'] });
        } }] },
      { num: '5', outcome: 'AN5',
        shared: function (r) {
          var z = pick(function () { return { u: r.int(2, 9), w: -r.int(1, 8) }; }, function (z) { return z.u + z.w !== 0 && Math.abs(z.u * z.w) <= 48; });
          z.ok = r.chance(0.5); z.b = z.u + z.w; z.c = z.u * z.w; z.swap = r.chance(0.5);
          z.claim = z.swap ? FT(null, [lin(1, 'x', z.w), lin(1, 'x', z.u)]) : FT(null, [lin(1, 'x', z.u), lin(1, 'x', z.w)]);
          z.poly = seq([M(1, 'x', 2), M(z.ok ? z.b : -z.b, 'x'), N(z.c)]);
          z.name = r.pick(['Jordan', 'Kiara', 'Owen', 'Maya', 'Tyler', 'Ava']);
          return z;
        },
        stem: function (z) { return z.name + ' factored ' + t(z.poly) + ' as ' + t(z.claim.tex) + '. Multiply to check whether the factoring is correct.'; },
        parts: [
          { id: '5a', sub: 'a', outcome: 'AN5', level: 'BEG', make: function (r, z) {
            var e = z.claim.poly, f = z.claim.tex, A = z.swap ? z.w : z.u, B = z.swap ? z.u : z.w;
            return polyPart('Multiply out ' + t(f) + ' and simplify.', e, [{ is: P.add(M(1, 'x', 2), N(z.c)), code: 'missing-term', hint: 'You multiplied only the first terms and the last terms. Multiply every term of the first bracket by every term of the second (FOIL), then collect the ' + t('x') + '-terms.' }],
              t(f + '=x^{2}' + (B < 0 ? '' : '+') + B + 'x' + (A < 0 ? '' : '+') + A + 'x' + (A * B < 0 ? '' : '+') + A * B + '=' + tx(e)),
              ['Multiply each term of the first bracket by each term of the second (FOIL).', 'Collect the two ' + t('x') + '-terms.'], 'expand ' + plain(f), { before: t(f + '=') });
          } },
          { id: '5b', sub: 'b', outcome: 'AN5', level: 'BEG', make: function (r, z) {
            var e = tx(z.claim.poly), f = z.claim.tex;
            var p = KP.mc(r, 'So is ' + z.name + '’s factoring correct?', [
              { html: '<b>Correct</b>', right: z.ok, why: z.ok ? null : 'Your expansion ' + t(f + '=' + e) + ' doesn’t match ' + t(z.poly) + ': the middle terms have opposite signs.' },
              { html: '<b>Not correct</b>', right: !z.ok, why: z.ok ? 'The expansion ' + t(f + '=' + e) + ' matches ' + t(z.poly) + ' term for term.' : null }],
              t(f + '=' + e) + (z.ok ? ', which matches ' + t(z.poly) + ': <b>correct</b>.' : ', but the question has ' + t(z.poly) + ' (the middle term’s sign is different): <b>not correct</b>. The right factoring is ' + t(FT(null, [lin(1, 'x', -z.u), lin(1, 'x', -z.w)]).tex) + '.'),
              ['Compare your expansion with the trinomial, term by term.'], 'check verdict', true);
            p.input.columns = 2;
            return p;
          } }] },
      { num: '6', outcome: 'AN5', stem: 'Use the zero product property: if ' + t('A\\times B=0') + ', then ' + t('A=0') + ' or ' + t('B=0') + '.', parts: [
        { id: '6', outcome: 'AN5', level: 'BEG', make: function (r) {
          var kind = r.pick(['two', 'two', 'x']), c = kind === 'x' ? r.pick([1, 2, 3, 4, 5]) : r.pick([1, 1, 1, 2, 3, 4, 5, 6]);
          var z = pick(function () { return { p: r.int(1, 12) * r.pick([1, -1]), q: r.int(1, 12) * r.pick([1, -1]) }; }, function (z) { return z.p !== z.q && z.p + z.q !== 0; });
          var pre = c === 1 ? '' : String(c), eq, roots, facs;
          if (kind === 'x') { eq = pre + 'x' + br(lin(1, 'x', z.p)) + '=0'; roots = [0, -z.p]; facs = [t('x=0'), t(seq(lin(1, 'x', z.p)) + '=0') + ', so ' + t('x=' + (-z.p))]; }
          else { eq = pre + br(lin(1, 'x', z.p)) + br(lin(1, 'x', z.q)) + '=0'; roots = [-z.p, -z.q]; facs = [t(seq(lin(1, 'x', z.p)) + '=0') + ', so ' + t('x=' + (-z.p)), t(seq(lin(1, 'x', z.q)) + '=0') + ', so ' + t('x=' + (-z.q))]; }
          return solvePart('Solve ' + t(eq) + '. Type every solution, like ' + t('x=1,\\ x=2') + '.', roots,
            function (A, T) {
              if (c !== 1 && has(A, c) && sameSet(A.filter(function (x) { return Math.abs(x - c) > 1e-9; }), T)) return { code: 'u4t-zp-const', hint: 'The factor ' + t(c) + ' is never 0, so it gives no solution. Only the factors with ' + t('x') + ' in them can be 0.' };
              if (kind === 'x' && !has(A, 0) && sameSet(A, [-z.p])) return { code: 'u4t-lost-zero', hint: t('x') + ' itself is a factor: ' + t('x=0') + ' makes the product 0 too.' };
              return null;
            },
            (c !== 1 ? 'The factor ' + t(c) + ' can’t be 0. ' : '') + 'Set each factor with ' + t('x') + ' equal to ' + t('0') + ':<br>' + facs.join('<br>') + '<br>So ' + t(xs(roots)) + '.',
            ['A product is 0 only when one of its factors is 0.', 'Set each bracket equal to 0 and solve: ' + t('x+5=0') + ' gives ' + t('x=-5') + '.'], 'solve ' + plain(eq),
            [roots.map(function (x) { return -x; }).join(', '), String(roots[1])].concat(c !== 1 && !has(roots, c) ? [roots.concat([c]).join(', ')] : []));
        } }] },
      { num: '7', outcome: 'AN5', stem: 'Look at each expression before you start factoring it.', parts: [
        { id: '7', outcome: 'AN5', level: 'BEG', make: function (r) {
          var gA = pick(function () { return { g: r.int(2, 9), h: r.int(2, 9), s: r.pick([1, -1]), q: r.int(2, 6), dos: r.chance(0.5) }; }, function (z) { return z.g !== z.h && (!z.dos || (z.g <= 5 && z.g !== z.q * z.q)); });
          var Aitem = gA.dos ? { kind: 'A', tex: seq([M(gA.g, 'x', 2), N(-gA.g * gA.q * gA.q)]), why: 'both terms share ' + t(gA.g) + ': take out the common factor first (then ' + t('x^{2}-' + gA.q * gA.q) + ' is a difference of squares)' }
            : { kind: 'A', tex: seq([M(gA.g, 'x', 2), M(gA.s * gA.g * gA.h, 'x')]), why: 'both terms share ' + t(gA.g + 'x') + ': take out the common factor' };
          var q = r.int(3, 10), dv = r.pick(['dos1', 'dos2', 'dos3']), B;
          if (dv === 'dos1') B = { kind: 'B', tex: 'x^{2}-' + q * q, why: t('x^{2}-' + q * q + '=x^{2}-' + q + '^{2}') + ' is a difference of squares' };
          else if (dv === 'dos2') B = { kind: 'B', tex: q * q + '-y^{2}', why: t(q * q + '-y^{2}=' + q + '^{2}-y^{2}') + ' is a difference of squares' };
          else { var pp = pick(function () { return { p: r.pick([2, 3]), q: r.int(1, 7) }; }, function (z) { return gcd(z.p, z.q) === 1; }); B = { kind: 'B', tex: pp.p * pp.p + 'x^{2}-' + pp.q * pp.q, why: t(pp.p * pp.p + 'x^{2}-' + pp.q * pp.q + '=(' + pp.p + 'x)^{2}-' + pp.q + '^{2}') + ' is a difference of squares' }; }
          var ins = pick(function () { return { m: r.int(1, 9), n: r.int(1, 7), sI: r.pick([1, -1]), sJ: r.pick([1, -1]) }; }, function (z) { return z.m !== z.n && z.m * z.n <= 40 && z.sI * z.m + z.sJ * z.n !== 0; });
          var de = pick(function () { return { a: r.pick([2, 3, 5]), p: r.int(1, 4) * r.pick([1, -1]), q: r.int(1, 5) * r.pick([1, -1]) }; }, function (z) { return gcd(z.a, z.p) === 1 && z.a * z.q + z.p !== 0; });
          var items = [Aitem, B,
            { kind: 'C', tex: tx(P.mul(sum(lin(1, 'x', ins.sI * ins.m)), sum(lin(1, 'x', ins.sJ * ins.n)))), why: 'it has the form ' + t('x^{2}+bx+c') + ' (no common factor, not a perfect square): find two integers with product ' + t('c') + ' and sum ' + t('b') },
            { kind: 'D', tex: tx(P.mul(sum(lin(de.a, 'x', de.p)), sum(lin(1, 'x', de.q)))), why: 'the leading coefficient is not 1 and there is no common factor: decomposition' }];
          items = r.shuffle(items);
          var rows = items.map(function (x, i) { return { id: 'abcd'[i], html: t(x.tex), label: 'abcd'[i] }; }), want = {}, by = {};
          items.forEach(function (x, i) { want['abcd'[i]] = x.kind; by['abcd'[i]] = x; });
          var cols = [{ id: 'A', html: '<b>A</b> common factor (GCF)', label: 'A' }, { id: 'B', html: '<b>B</b> difference of squares', label: 'B' }, { id: 'C', html: '<b>C</b> sum–product (' + t('a=1') + ')', label: 'C' }, { id: 'D', html: '<b>D</b> decomposition (' + t('a\\ne 1') + ')', label: 'D' }];
          var p = KP.grid('Choose the method you should use <b>first</b> for each expression. (You do not need to factor.)', rows, cols, want, { why: function (id) { return { code: 'row', hint: 'Check ' + t(by[id].tex) + ': ' + by[id].why + '.' }; }, rowHead: 'Expression' },
            items.map(function (x) { return t(x.tex) + ': <b>' + x.kind + '</b> — ' + x.why + '.'; }).join('<br>'),
            ['Always look for a common factor first. Then count the terms: two terms with a minus → difference of squares; three terms → sum–product (if ' + t('a=1') + ') or decomposition.'], 'method first');
          var sw = {}; Object.keys(want).forEach(function (k) { sw[k] = want[k]; }); var k0 = Object.keys(sw)[0], k1 = Object.keys(sw)[1], tmp = sw[k0]; sw[k0] = sw[k1]; sw[k1] = tmp;
          p.bad = [sw];
          return p;
        } }] },

      /* ======================= Progressing ======================= */
      { num: '8', outcome: 'AN5', stem: 'Factor. (The last term is negative.)', parts: ['a', 'b'].map(function (w) {
        return { id: '8' + w, outcome: 'AN5', level: 'PRG', make: function (r) {
          var z = pick(function () { return { M: r.int(3, 10), n: r.int(1, 7) }; }, function (z) { return z.M - z.n >= 1 && z.M * z.n <= 60 && z.M * z.n >= 6; });
          var s = w === 'a' ? 1 : -1, A = s * z.M, B = -s * z.n, b = A + B, c = A * B;
          var Ft = FT(null, [lin(1, 'x', A), lin(1, 'x', B)]), poly = tx(Ft.poly);
          return fac(t(poly), Ft, [{ is: FT(null, [lin(1, 'x', -A), lin(1, 'x', -B)]), code: 'sign-swap', hint: 'Your pair multiplies to ' + t(c) + ' but adds to ' + t(-b) + ', not ' + t(b) + '. The larger number takes the sign of the middle term.' },
            { is: FT(null, [lin(1, 'x', z.M), lin(1, 'x', z.n)]), code: 'u4t-same-sign', hint: 'A negative last term means the two integers have <b>opposite</b> signs: your brackets multiply to a positive constant.' },
            { is: FT(null, [lin(1, 'x', -z.M), lin(1, 'x', -z.n)]), code: 'u4t-same-sign', hint: 'A negative last term means the two integers have <b>opposite</b> signs: your brackets multiply to a positive constant.' }],
            'Find two integers with product ' + t(c) + ' and sum ' + t(b) + '. The product is negative, so one is negative; the larger one takes the sign of ' + t(b + 'x') + ': ' + t(A + '\\times ' + pv(B) + '=' + c) + ' and ' + t(A + '+' + pv(B) + '=' + b) + '.<br>' + t(poly + '=' + Ft.tex) + '<br>Check: ' + t(Ft.tex + '=' + seq([M(1, 'x', 2), M(B, 'x'), M(A, 'x'), N(c)]) + '=' + poly) + ' ✓',
            ['Find two integers that multiply to ' + t(c) + ' and add to ' + t(b) + '.', 'The product is negative, so the integers have opposite signs.'], 'factor ' + plain(poly));
        } }; }) },
      { num: '9', outcome: 'AN5', stem: 'Factor by removing the greatest common factor.', parts: [
        { id: '9a', outcome: 'AN5', level: 'PRG', make: function (r) {
          var L = r.pick([['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]), u = L[0], v = L[1];
          var pat = r.pick([[[2, 1], [1, 2]], [[2, 2], [1, 3]], [[3, 1], [2, 2]], [[2, 1], [1, 1]], [[1, 2], [2, 2]]]);
          var z = pick(function () { return { g: r.int(2, 6), a: r.int(1, 5), b: r.int(1, 5), s: r.pick([1, -1]) }; }, function (z) { return gcd(z.a, z.b) === 1 && z.a !== z.b && z.g * Math.max(z.a, z.b) <= 30; });
          var e1 = pat[0], e2 = pat[1], mu = Math.min(e1[0], e2[0]), mv = Math.min(e1[1], e2[1]);
          var mono = function (c, e, f) { var o = {}; if (e) o[u] = e; if (f) o[v] = f; return MM(c, o); };
          var G = mono(z.g, mu, mv), b1 = mono(z.a, e1[0] - mu, e1[1] - mv), b2 = mono(z.s * z.b, e2[0] - mu, e2[1] - mv);
          var Ft = FT(G, [[b1, b2]]), poly = tx(Ft.poly), T1 = mono(z.g * z.a, e1[0], e1[1]), T2 = mono(z.s * z.g * z.b, e2[0], e2[1]);
          return fac('Factor by removing the GCF: ' + t(poly), Ft, [{ is: FT(G, [[b1, P.neg(b2)]]), code: 'sign', hint: 'Check the sign in the bracket: expand your answer and compare it with ' + t(poly) + '.' }],
            'Numbers: the GCF of ' + t(z.g * z.a) + ' and ' + t(z.g * z.b) + ' is ' + t(z.g) + '. Letters: the lowest power of ' + t(u) + ' is ' + t(tx(mono(1, mu, 0))) + ' and of ' + t(v) + ' is ' + t(tx(mono(1, 0, mv))) + '. So the GCF is ' + t(tx(G)) + '.<br>' + t(tx(T1) + '\\div ' + tx(G) + '=' + tx(b1)) + ', ' + t(tx(T2) + '\\div ' + tx(G) + '=' + tx(b2)) + '.<br>' + t(poly + '=' + Ft.tex),
            ['The GCF takes the greatest common factor of the numbers and the lowest power of <b>each</b> letter.', 'Divide each term by the GCF to get the bracket.'], 'GCF ' + plain(poly), { gcfOnly: true, vars: [u, v] });
        } },
        { id: '9b', outcome: 'AN5', level: 'PRG', make: function (r) {
          var v = r.pick(['x', 'x', 'y', 'a', 'm']);
          var z = pick(function () { return { g: r.int(2, 6), p: r.int(1, 6) * r.pick([1, -1]), q: r.int(1, 6) * r.pick([1, -1]) }; }, function (z) { return Math.abs(z.p) !== Math.abs(z.q) && z.g * Math.max(Math.abs(z.p), Math.abs(z.q)) <= 30; });
          var G = N(-z.g), inner = [M(1, v, 2), M(z.p, v), N(z.q)], Ft = FT(G, [inner]), poly = tx(Ft.poly);
          var kept = FT(G, [[M(1, v, 2), M(-z.p, v), N(-z.q)]]);
          var p = fac('Factor by removing a <b>negative</b> GCF: ' + t(poly), Ft, [{ is: kept, code: 'u4t-neg-signs', hint: 'Dividing by a <b>negative</b> changes the sign of <b>every</b> term. Expand your answer: only the first term matches.' },
            { is: FT(G, [[M(1, v, 2), M(z.p, v), N(-z.q)]]), code: 'u4t-neg-signs', hint: 'Check the last term in the bracket: ' + t(pv(-z.g * z.q) + '\\div(-' + z.g + ')=' + z.q) + '.' },
            { is: FT(G, [[M(1, v, 2), M(-z.p, v), N(z.q)]]), code: 'u4t-neg-signs', hint: 'Check the middle term in the bracket: ' + t(tx(M(-z.g * z.p, v)) + '\\div(-' + z.g + ')=' + tx(M(z.p, v))) + '.' }],
            'The leading term is negative, so take out ' + t(-z.g) + '. Dividing by a negative changes every sign:<br>' + t(tx(M(-z.g, v, 2)) + '\\div(-' + z.g + ')=' + v + '^{2}') + ', ' + t(tx(M(-z.g * z.p, v)) + '\\div(-' + z.g + ')=' + tx(M(z.p, v))) + ', ' + t(pv(-z.g * z.q) + '\\div(-' + z.g + ')=' + z.q) + '<br>' + t(poly + '=' + Ft.tex) + '<br>Check: ' + t(Ft.tex + '=' + poly) + ' ✓',
            ['The GCF is ' + t(z.g) + '; make it negative.', 'Dividing by a negative changes the sign of every term in the bracket.'], 'negative GCF ' + plain(poly), { gcfOnly: true, vars: [v], bad: [z.g + br([M(-1, v, 2), M(-z.p, v), N(-z.q)])] });
          var chk = p.check;
          p.check = function (resp) { var res = chk(resp); if (res.v === 'correct' && monoSign(resp) > 0) return form('u4t-neg-gcf', 'Right value — now take out the <b>negative</b> common factor, ' + t(-z.g) + ', as the question asks, so the bracket starts with ' + t(v + '^{2}') + '.'); return res; };
          return p;
        } }] },
      { num: '10', outcome: 'AN5', stem: 'Factor completely.', parts: [
        { id: '10a', outcome: 'AN5', level: 'PRG', make: function (r) {
          var z = pick(function () { return { k: r.int(2, 5), m: r.int(1, 7) * r.pick([1, -1]), n: r.int(1, 7) * r.pick([1, -1]) }; }, function (z) { return z.m !== z.n && z.m + z.n !== 0 && Math.abs(z.m * z.n) >= 2; });
          var Ft = FT(N(z.k), [lin(1, 'x', z.m), lin(1, 'x', z.n)]), poly = tx(Ft.poly), b = z.m + z.n, c = z.m * z.n, inner = seq([M(1, 'x', 2), M(b, 'x'), N(c)]);
          return fac(t(poly), Ft, [{ is: FT(null, [lin(1, 'x', z.m), lin(1, 'x', z.n)]), code: 'gcf-dropped', hint: 'Don’t lose the common factor ' + t(z.k) + ': it stays in front of the brackets.' },
            { is: FT(N(z.k), [lin(1, 'x', -z.m), lin(1, 'x', -z.n)]), code: 'sign-swap', hint: 'Your pair adds to ' + t(-b) + ' instead of ' + t(b) + '. Swap the signs.' }],
            'GCF ' + t('=' + z.k) + ': ' + t(poly + '=' + z.k + '(' + inner + ')') + '<br>Then two integers with product ' + t(c) + ' and sum ' + t(b) + ': ' + t(z.m + '\\text{ and }' + z.n) + '.<br>' + t('=' + Ft.tex) + '<br>Check: ' + t(Ft.tex + '=' + z.k + '(' + inner + ')=' + poly) + ' ✓',
            ['Take out the common factor first.', 'Then factor the trinomial in the bracket.'], 'factor ' + plain(poly), { bad: [z.k + '(' + inner + ')'] });
        } },
        { id: '10b', outcome: 'AN5', level: 'PRG', make: function (r) {
          var v = r.pick(['x', 'x', 'y', 'a', 'm']), z = pick(function () { return { p: r.int(2, 5), q: r.int(1, 9) }; }, function (z) { return gcd(z.p, z.q) === 1; });
          var Ft = FT(null, [lin(z.p, v, -z.q), lin(z.p, v, z.q)]), poly = tx(Ft.poly);
          return fac(t(poly), Ft, [{ is: FT(null, [{ terms: lin(z.p, v, -z.q), k: 2 }]), code: 'u4t-dos-square', hint: 'A difference of squares factors into one ' + t('-') + ' bracket and one ' + t('+') + ' bracket.' },
            { is: FT(null, [lin(z.p * z.p, v, -z.q), lin(z.p * z.p, v, z.q)]), code: 'u4t-no-root', hint: t(z.p * z.p + v + '^{2}=(' + z.p + v + ')^{2}') + ': the bracket uses the square root, ' + t(z.p + v) + '.' },
            { is: FT(null, [lin(z.p, v, -z.q * z.q), lin(z.p, v, z.q * z.q)]), code: 'u4t-no-root', hint: 'Use the square root of ' + t(z.q * z.q) + ' in each bracket.' }],
            t(poly + '=(' + z.p + v + ')^{2}-' + z.q + '^{2}') + ', so ' + t(poly + '=' + Ft.tex) + '<br>Check: ' + t(Ft.tex + '=' + z.p * z.p + v + '^{2}+' + z.p * z.q + v + '-' + z.p * z.q + v + '-' + z.q * z.q + '=' + poly) + ' ✓',
            ['Write each term as a square: ' + t(z.p * z.p + v + '^{2}=(\\ ?\\ )^{2}') + '.', 'Then use ' + t('A^{2}-B^{2}=(A-B)(A+B)') + '.'], 'factor ' + plain(poly));
        } },
        { id: '10c', outcome: 'AN5', level: 'PRG', make: function (r) {
          var z = pick(function () { return { p: r.pick([2, 3]), q: r.int(1, 9), s: r.pick([1, -1]) }; }, function (z) { return gcd(z.p, z.q) === 1; });
          var A = lin(z.p, 'x', z.s * z.q), Ft = FT(null, [{ terms: A, k: 2 }]), poly = tx(Ft.poly), mid = 2 * z.p * z.q;
          return fac(t(poly), Ft, [{ is: FT(null, [{ terms: lin(z.p, 'x', -z.s * z.q), k: 2 }]), code: 'pst-sign', hint: 'The middle term is ' + (z.s < 0 ? 'negative' : 'positive') + ', so the sign in the bracket is ' + t(z.s < 0 ? '-' : '+') + '.' },
            { is: FT(null, [lin(z.p, 'x', -z.q), lin(z.p, 'x', z.q)]), code: 'u4t-pst-dos', hint: 'That gives ' + t(z.p * z.p + 'x^{2}-' + z.q * z.q) + ' — no middle term. This trinomial is a perfect square.' },
            { is: FT(null, [{ terms: lin(z.p * z.p, 'x', z.s * z.q), k: 2 }]), code: 'u4t-no-root', hint: t(z.p * z.p + 'x^{2}=(' + z.p + 'x)^{2}') + ': the bracket uses ' + t(z.p + 'x') + '.' }],
            'Three-part test: ' + t(z.p * z.p + 'x^{2}=(' + z.p + 'x)^{2}') + ', ' + t(z.q * z.q + '=' + z.q + '^{2}') + ', and ' + t('2(' + z.p + 'x)(' + z.q + ')=' + mid + 'x') + ' matches the middle term: a perfect square trinomial.<br>' + t(poly + '=' + Ft.tex) + '<br>Check: ' + t(Ft.tex + '=' + poly) + ' ✓',
            ['Are the first and last terms perfect squares? Is the middle term twice the product of their square roots?', 'The sign in the bracket is the sign of the middle term.'], 'factor ' + plain(poly));
        } }] },
      { num: '11', outcome: 'AN5', stem: 'Factoring ' + t('ax^{2}+bx+c') + ' by decomposition.', parts: [
        { id: '11a', outcome: 'AN5', level: 'PRG', make: function (r) {
          var z = pick(function () { return { a: r.pick([2, 3]), p: r.int(1, 3), q: r.int(1, 6) }; }, function (z) { return gcd(z.a, z.p) === 1 && z.a * z.q + z.p <= 25 && z.a * z.q !== z.p && !(z.p === 1 && z.q === 1); });
          var a = z.a, p = z.p, q = z.q, b = a * q + p, c = p * q, ac = a * c, m = a * q, n = p;
          var poly = seq([M(a, 'x', 2), M(b, 'x'), N(c)]), Ft = FT(null, [lin(a, 'x', p), lin(1, 'x', q)]);
          var g1 = FT(M(1, 'x'), [lin(a, 'x', p)]), g2 = FT(N(q), [lin(a, 'x', p)]), g1b = FT(M(a, 'x'), [lin(1, 'x', q)]), g2b = FT(N(p), [lin(1, 'x', q)]);
          var order = function (all) { var x = readPoly(all[3]); return x.p && P.eq(x.p, M(m, 'x')) ? 'm' : 'n'; };
          var pc = pairCheck([m, n], ac, b);
          var termChk = function (i) { return function (v, all) {
            var x = readPoly(all[3]), y = readPoly(all[4]);
            if (x.res && i === 3) return x.res; if (y.res && i === 4) return y.res;
            var okSet = x.p && y.p && ((P.eq(x.p, M(m, 'x')) && P.eq(y.p, M(n, 'x'))) || (P.eq(x.p, M(n, 'x')) && P.eq(y.p, M(m, 'x'))));
            if (okSet) return ok();
            if (i === 4) return ok(); // reported once, on the first box
            return wrong('u4t-split', 'Split ' + t(b + 'x') + ' into two ' + t('x') + '-terms using your two integers: ' + t('\\square x+\\square x') + '.');
          }; };
          var grpChk = function (i) { return function (v, all) {
            var mf = order(all) === 'm', G = i === 5 ? (mf ? g1b : g1) : (mf ? g2b : g2);
            var res = facCheck(G, [], {})(v);
            if (res.v !== 'correct' && res.v !== 'form' && res.code === 'value') return wrong('u4t-group', 'This group should be ' + t(tx(G.poly)) + ' written as a common factor times ' + t(mf ? '(x+' + q + ')' : '(' + seq(lin(a, 'x', p)) + ')') + '.');
            if (res.v === 'wrong' && res.code === 'not-factored') return wrong('u4t-group', 'Take a common factor out of this pair: write it as (common factor)(bracket).');
            return res;
          }; };
          var pp = boxes('Factor ' + t(poly) + ' by decomposition. Fill in each step.',
            [numBox('', { before: t('a\\times c='), name: 'ac' }), numBox('Two integers with product ' + t('ac') + ' and sum ' + t(b) + ':', { name: 'First integer' }), numBox('and', { name: 'Second integer' }),
              polyBox('Split the middle term:', ['x'], { before: t(a + 'x^{2}+'), wide: false, name: 'First x-term', ph: 'an x-term' }), polyBox('', ['x'], { before: t('+'), after: t('+' + c), wide: false, name: 'Second x-term', ph: 'an x-term' }),
              polyBox('Common factor from each pair:', ['x'], { before: t('='), after: t('+'), name: 'First group', ph: 'e.g. 2x(x + 3)' }), polyBox('', ['x'], { before: t('\\phantom{=}'), name: 'Second group', ph: 'e.g. 5(x + 3)' }), polyBox('Factored:', ['x'], { before: t('='), name: 'Factored form', ph: 'e.g. (x + 3)(2x + 5)' })],
            [K.number(ac, function (v) { if (v === a + c) return { code: 'ax-ac-wrong', hint: t('a\\times c') + ' means ' + t(a + '\\times ' + c) + ', not ' + t(a + '+' + c) + '.' }; if (v === b) return { code: 'ax-ac-wrong', hint: 'That is ' + t('b') + '. Multiply ' + t('a\\times c=' + a + '\\times ' + c) + '.' }; return null; }),
              function (v, all) { return pc(all[1], all[2]); }, function () { return ok(); }, termChk(3), termChk(4), grpChk(5), grpChk(6),
              facCheck(Ft, [{ is: FT(null, [lin(1, 'x', m), lin(1, 'x', n)]), code: 'u4t-pair-as-factors', hint: 'Writing the pair straight into brackets only works when ' + t('a=1') + '. Take out the common bracket from your two groups.' }])],
            [String(ac), String(n), String(m), tx(M(n, 'x')), tx(M(m, 'x')), g1.tex, q === 1 ? '(' + seq(lin(a, 'x', p)) + ')' : g2.tex, Ft.tex],
            t('ac=' + ac) + '; ' + t(n) + ' and ' + t(m) + '; ' + t(poly + '=' + a + 'x^{2}+' + tx(M(n, 'x')) + '+' + tx(M(m, 'x')) + '+' + c + '=' + g1.tex + '+' + g2.tex + '=' + Ft.tex),
            t('a\\times c=' + a + '\\times ' + c + '=' + ac) + '. Two integers with product ' + t(ac) + ' and sum ' + t(b) + ': ' + t(n) + ' and ' + t(m) + '.<br>' + t(poly + '=' + a + 'x^{2}+' + tx(M(n, 'x')) + '+' + tx(M(m, 'x')) + '+' + c) + '<br>' + t('=' + g1.tex + '+' + g2.tex) + '<br>' + t('=' + Ft.tex) +
              '<br>(The other order works too: ' + t(a + 'x^{2}+' + tx(M(m, 'x')) + '+' + tx(M(n, 'x')) + '+' + c + '=' + g1b.tex + '+' + g2b.tex + '=(x+' + q + ')(' + seq(lin(a, 'x', p)) + ')') + '.)<br>Check: ' + t(Ft.tex + '=' + poly) + ' ✓',
            ['Multiply ' + t('a') + ' and ' + t('c') + ', then find two integers with that product and sum ' + t(b) + '.', 'Split the middle term with them, take a common factor out of each pair, then take out the common bracket.'], 'decomposition steps ' + plain(poly));
          pp.bad = (a + c !== ac ? [[String(a + c)].concat(pp.key.slice(1))] : []).concat([[String(ac), String(-n), String(-m)].concat(pp.key.slice(3)), pp.key.slice(0, 7).concat(['(x+' + m + ')(x+' + n + ')'])]);
          pp.good = [[String(ac), String(m), String(n), tx(M(m, 'x')), tx(M(n, 'x')), g1b.tex, p === 1 ? '(x+' + q + ')' : g2b.tex, '(x+' + q + ')(' + seq(lin(a, 'x', p)) + ')']];
          return pp;
        } },
        { id: '11b', outcome: 'AN5', level: 'PRG', make: function (r) {
          var z = triPick(r, function () { return { p: r.pick([2, 3]), q: r.int(1, 7) * r.pick([1, -1]), r: 1, s: r.int(1, 6) * r.pick([1, -1]) }; },
            function (o) { var b = o.p * o.s + o.q, c = o.q * o.s; return b !== 0 && (b < 0 || c < 0) && Math.abs(o.p * c) <= 60 && Math.abs(b) <= 15 && o.p * o.s !== o.q; });
          return triPart(Tri(z), { prompt: 'Factor ' + t(Tri(z).tex) + ' by decomposition.' });
        } }] },
      { num: '12', outcome: 'AN5', stem: 'Solve by factoring. Type every solution, like ' + t('x=1,\\ x=2') + '.', parts: [
        { id: '12a', outcome: 'AN5', level: 'PRG', make: function (r) {
          var z = pick(function () { return { m: r.int(1, 9), n: r.int(1, 9) }; }, function (z) { return z.m !== z.n && z.m * z.n >= 4 && z.m * z.n <= 45; });
          var b = z.n - z.m, c = z.m * z.n, lhs = seq([M(1, 'x', 2), M(b, 'x')]), eq = lhs + '=' + c, Ft = FT(null, [lin(1, 'x', -z.m), lin(1, 'x', z.n)]);
          return solvePart('Solve ' + t(eq) + '.', [z.m, -z.n],
            function (A) { if (sameSet(A, [c, c - b]) || (has(A, c) && A.length <= 2 && !has(A, z.m))) return { code: 'u4t-not-zero', hint: 'The zero product property only works when the product is <b>0</b>. Move ' + t(c) + ' to the left side first: ' + t(lhs + '-' + c + '=0') + '.' }; return null; },
            'Make one side 0: ' + t(lhs + '-' + c + '=0') + '.<br>Factor: two integers with product ' + t(-c) + ' and sum ' + t(b) + ' are ' + t(-z.m) + ' and ' + t(z.n) + ', so ' + t(Ft.tex + '=0') + '.<br>' + t('x-' + z.m + '=0') + ' or ' + t('x+' + z.n + '=0') + ', so ' + t(xs([z.m, -z.n])) + '.<br>Check: ' + t(z.m + '^{2}' + (b < 0 ? '' : '+') + (b === 1 ? '' : b === -1 ? '-' : b) + '(' + z.m + ')=' + c) + ' ✓',
            ['Move everything to one side so the other side is 0.', 'Factor, then set each factor equal to 0.'], 'solve ' + plain(eq), [z.m * -1 + ', ' + z.n, String(z.m), c + ', ' + (c - b)]);
        } },
        { id: '12b', outcome: 'AN5', level: 'PRG', make: function (r) {
          var kind = r.pick(['gcf', 'dos']), eq, roots, sol, bad;
          if (kind === 'gcf') {
            var k = r.int(2, 12) * r.pick([1, -1]); eq = seq([M(1, 'x', 2), M(k, 'x')]) + '=0'; roots = [0, -k];
            sol = 'Take out the common factor ' + t('x') + ': ' + t('x' + br(lin(1, 'x', k)) + '=0') + '.<br>' + t('x=0') + ' or ' + t(seq(lin(1, 'x', k)) + '=0') + ', so ' + t(xs(roots)) + '.<br>(Dividing both sides by ' + t('x') + ' would lose ' + t('x=0') + '.)';
            bad = [String(-k), '0, ' + k];
          } else {
            var n = r.int(2, 12); eq = 'x^{2}-' + n * n + '=0'; roots = [n, -n];
            sol = 'Difference of squares: ' + t('(x-' + n + ')(x+' + n + ')=0') + '.<br>' + t('x-' + n + '=0') + ' or ' + t('x+' + n + '=0') + ', so ' + t(xs(roots)) + ' (also written ' + t('x=\\pm ' + n) + ').';
            bad = [String(n), n * n + ', ' + (-n * n)];
          }
          return solvePart('Solve ' + t(eq) + '.', roots,
            function (A) { if (kind === 'gcf' && !has(A, 0) && sameSet(A, [roots[1]])) return { code: 'u4t-lost-zero', hint: 'Don’t divide by ' + t('x') + ' — that loses a solution. Factor out ' + t('x') + ' instead: ' + t('x=0') + ' is a solution too.' }; if (kind === 'dos' && sameSet(A, [roots[0] * roots[0], -roots[0] * roots[0]])) return { code: 'u4t-no-root', hint: 'Use the square <b>root</b>: ' + t('x^{2}=' + roots[0] * roots[0]) + ' when ' + t('x=\pm ' + roots[0]) + '.' }; return null; },
            sol, [kind === 'gcf' ? 'Take out the common factor, then set each factor equal to 0.' : 'Factor the difference of squares, then set each factor equal to 0.', 'There are two solutions.'], 'solve ' + plain(eq), bad);
        } }] },

      /* ======================= Mastery ======================= */
      { num: '13', outcome: 'AN5', stem: 'Factor completely. Each one needs two steps.', parts: [
        { id: '13a', outcome: 'AN5', level: 'MAS', make: function (r) {
          var v = r.pick(['x', 'x', 'x', 'a', 'm', 'y']), z = pick(function () { return { k: r.int(2, 5), q: r.int(2, 6) }; }, function (z) { return z.k * z.q * z.q <= 100 && z.k !== z.q * z.q; });
          var G = M(z.k, v), Ft = FT(G, [lin(1, v, -z.q), lin(1, v, z.q)]), poly = tx(Ft.poly);
          return fac(t(poly), Ft, [{ is: FT(N(z.k), [lin(1, v, -z.q), lin(1, v, z.q)]), code: 'gcf-dropped', hint: 'Both terms have ' + t(v) + ': the common factor is ' + t(z.k + v) + ', and it stays in front.' },
            { is: FT(G, [{ terms: lin(1, v, -z.q), k: 2 }]), code: 'u4t-dos-square', hint: t(v + '^{2}-' + z.q * z.q) + ' is a difference of squares: ' + t('(' + v + '-' + z.q + ')(' + v + '+' + z.q + ')') + '.' },
            { is: FT(null, [lin(1, v, -z.q), lin(1, v, z.q)]), code: 'gcf-dropped', hint: 'Don’t lose the common factor ' + t(z.k + v) + '.' }],
            'Step 1, GCF: ' + t(z.k + v) + '. ' + t(poly + '=' + z.k + v + '(' + v + '^{2}-' + z.q * z.q + ')') + '<br>Step 2, the bracket is a difference of squares: ' + t(v + '^{2}-' + z.q * z.q + '=(' + v + '-' + z.q + ')(' + v + '+' + z.q + ')') + '.<br>' + t(poly + '=' + Ft.tex),
            ['Take out the common factor (number and ' + t(v) + ') first.', 'Then check the bracket: is it a difference of squares?'], 'factor ' + plain(poly), { bad: [z.k + v + '(' + v + '^{2}-' + z.q * z.q + ')'] });
        } },
        { id: '13b', outcome: 'AN5', level: 'MAS', make: function (r) {
          var z = pick(function () { return { k: r.int(2, 5), q: r.int(1, 7), s: r.pick([1, -1]), gx: r.chance(0.3) }; }, function (z) { return z.k * z.q * z.q <= 250 && z.k * z.q * 2 <= 60; });
          var G = z.gx ? M(z.k, 'x') : N(z.k), A = lin(1, 'x', z.s * z.q), Ft = FT(G, [{ terms: A, k: 2 }]), poly = tx(Ft.poly), g = tx(G);
          var inner = seq([M(1, 'x', 2), M(2 * z.s * z.q, 'x'), N(z.q * z.q)]);
          return fac(t(poly), Ft, [{ is: FT(null, [{ terms: A, k: 2 }]), code: 'gcf-dropped', hint: 'Don’t lose the common factor ' + t(g) + ': it stays in front.' },
            { is: FT(G, [{ terms: lin(1, 'x', -z.s * z.q), k: 2 }]), code: 'pst-sign', hint: 'The middle term is ' + (z.s < 0 ? 'negative' : 'positive') + ', so the bracket is ' + t('x' + (z.s < 0 ? '-' : '+') + z.q) + '.' },
            { is: FT(G, [lin(1, 'x', -z.q), lin(1, 'x', z.q)]), code: 'u4t-pst-dos', hint: 'That has no middle term. The bracket ' + t(inner) + ' is a perfect square trinomial.' },
            z.gx ? { is: FT(N(z.k), [{ terms: A, k: 2 }]), code: 'gcf-dropped', hint: 'Every term has an ' + t('x') + ': the common factor is ' + t(z.k + 'x') + '.' } : null],
            'Step 1, GCF: ' + t(g) + '. ' + t(poly + '=' + g + '(' + inner + ')') + '<br>Step 2, the bracket passes the three-part test: ' + t('x^{2}=(x)^{2}') + ', ' + t(z.q * z.q + '=' + z.q + '^{2}') + ', ' + t('2(x)(' + z.q + ')=' + 2 * z.q + 'x') + '.<br>' + t(poly + '=' + Ft.tex),
            ['Take out the common factor first.', 'Then test the bracket: is it a perfect square trinomial?'], 'factor ' + plain(poly), { bad: [g + '(' + inner + ')'] });
        } }] },
      { num: '14', outcome: 'AN5',
        shared: function (r) {
          var z = pick(function () { return { M: r.int(5, 12), n: r.int(2, 9), s: r.pick([1, -1]) }; }, function (z) { return z.M - z.n >= 2 && z.M * z.n <= 72; });
          z.kind = r.pick(['swap', 'same']); z.name = r.pick(['Jamal', 'Priya', 'Liam', 'Nadia', 'Ethan', 'Sara']);
          z.A = z.s * z.M; z.B = -z.s * z.n; z.b = z.A + z.B; z.c = z.A * z.B;
          z.poly = seq([M(1, 'x', 2), M(z.b, 'x'), N(z.c)]);
          z.Ft = FT(null, [lin(1, 'x', z.A), lin(1, 'x', z.B)]);
          z.stu = z.kind === 'swap' ? FT(null, [lin(1, 'x', -z.B), lin(1, 'x', -z.A)]) : FT(null, [lin(1, 'x', z.n), lin(1, 'x', z.M)]);
          z.stuInts = z.kind === 'swap' ? [-z.A, -z.B] : [z.M, z.n];
          return z;
        },
        stem: function (z) { return z.name + ' factored ' + t(z.poly) + ' as ' + t(z.stu.tex) + '. The answer has an error.'; },
        parts: [
          { id: '14a', sub: 'a', outcome: 'AN5', level: 'MAS', make: function (r, z) {
            var E = z.stu.poly, pc = pairCheck([z.A, z.B], z.c, z.b, function (x, y) { if ((x === z.stuInts[0] && y === z.stuInts[1]) || (x === z.stuInts[1] && y === z.stuInts[0])) return { code: 'u4t-kept-error', hint: 'Those are ' + z.name + '’s integers: they ' + (z.kind === 'swap' ? 'add to ' + t(-z.b) + ', not ' + t(z.b) : 'multiply to ' + t(-z.c) + ', not ' + t(z.c)) + '.' }; return null; });
            var why = z.kind === 'swap' ? 'the middle term has the wrong sign: the integers multiply to ' + t(z.c) + ' but add to ' + t(-z.b) + ', not ' + t(z.b) + '. The larger number must take the sign of the middle term.'
              : 'the last term has the wrong sign: both integers are positive, so they multiply to ' + t(-z.c) + ', not ' + t(z.c) + '. A negative last term needs integers with opposite signs.';
            return boxes('Expand ' + z.name + '’s answer to find the error. Then give the two integers that do work.',
              [polyBox('Expanded:', ['x'], { before: t(z.stu.tex + '='), ph: 'the expanded answer' }), numBox('Two integers with product ' + t(z.c) + ' and sum ' + t(z.b) + ':', { name: 'First integer' }), numBox('and', { name: 'Second integer' })],
              [polyCheck(E, [{ is: z.Ft.poly, code: 'u4t-expand-orig', hint: 'That is the original expression. Multiply out ' + z.name + '’s answer, ' + t(z.stu.tex) + ', with FOIL.' }]),
                function (v, all) { return pc(all[1], all[2]); }, function () { return ok(); }],
              [tx(E), String(z.A), String(z.B)], t(z.stu.tex + '=' + tx(E)) + '; ' + t(z.A) + ' and ' + t(z.B),
              t(z.stu.tex + '=' + tx(E)) + ', not ' + t(z.poly) + ': ' + why + '<br>Use ' + t(z.A) + ' and ' + t(z.B) + ': ' + t(z.A + '\\times ' + pv(z.B) + '=' + z.c) + ' and ' + t(z.A + '+' + pv(z.B) + '=' + z.b) + ' ✓',
              ['Expand with FOIL and compare each term with ' + t(z.poly) + '.', 'You need product ' + t(z.c) + ' and sum ' + t(z.b) + '.'], 'error: expand ' + plain(z.stu.tex),
              [[z.poly, String(z.A), String(z.B)], [tx(E), String(z.stuInts[0]), String(z.stuInts[1])], [tx(E), String(-z.A), String(-z.B)]], [[tx(E), String(z.B), String(z.A)], [tx(E), '+' + Math.max(z.A, z.B), String(Math.min(z.A, z.B))]]);
          } },
          { id: '14b', sub: 'b', outcome: 'AN5', level: 'MAS', make: function (r, z) {
            return fac('Write the correct factored form of ' + t(z.poly) + '.', z.Ft, [{ is: z.stu, code: 'u4t-kept-error', hint: 'That is ' + z.name + '’s answer — it expands to ' + t(tx(z.stu.poly)) + '.' },
              { is: FT(null, [lin(1, 'x', -z.A), lin(1, 'x', -z.B)]), code: 'sign-swap', hint: 'Your pair adds to ' + t(-z.b) + ' instead of ' + t(z.b) + '. Swap the signs.' }],
              t(z.A + '\\times ' + pv(z.B) + '=' + z.c) + ' and ' + t(z.A + '+' + pv(z.B) + '=' + z.b) + ':<br>' + t(z.poly + '=' + z.Ft.tex) + '<br>Check: ' + t(z.Ft.tex + '=' + seq([M(1, 'x', 2), M(z.B, 'x'), M(z.A, 'x'), N(z.c)]) + '=' + z.poly) + ' ✓',
              ['Keep the numbers ' + t(z.M) + ' and ' + t(z.n) + ', but give them signs so the product is ' + t(z.c) + ' and the sum is ' + t(z.b) + '.'], 'fix ' + plain(z.poly));
          } }] },
      { num: '15', outcome: 'AN5', stem: 'Find <b>all</b> the values that work. List them, separated by commas.', parts: [
        { id: '15a', outcome: 'AN5', level: 'MAS', make: function (r) {
          var C = r.pick([6, 8, 10, 14, 15, 21, 22, 26, 27, 33, 34, 35]), sc = r.pick([1, -1]), c = sc * C, pairs = [], ks = [], other = [];
          for (var d = 1; d * d < C; d++) if (C % d === 0) pairs.push([d, C / d]);
          pairs.forEach(function (q) { var s1 = sc > 0 ? q[0] + q[1] : q[1] - q[0], s2 = sc > 0 ? q[1] - q[0] : q[0] + q[1]; ks.push(s1, -s1); other.push(s2, -s2); });
          ks.sort(function (a, b) { return a - b; });
          var shown = 'x^{2}+kx' + (c < 0 ? '' : '+') + c;
          var lines = pairs.map(function (q) { return sc > 0 ? t(q[0] + '\\times ' + q[1]) + ': sum ' + t(q[0] + q[1]) + '; ' + t('(-' + q[0] + ')(-' + q[1] + ')') + ': sum ' + t(-q[0] - q[1]) : t(q[0] + '\\times(-' + q[1] + ')') + ': sum ' + t(q[0] - q[1]) + '; ' + t('(-' + q[0] + ')\\times ' + q[1]) + ': sum ' + t(q[1] - q[0]); });
          var p = KP.valueSet('Find all the integer values of ' + t('k') + ' so that ' + t(shown) + ' can be factored.', ks, { v: 'k', keyTex: ks.map(function (k) { return 'k=' + k; }).join(',\\ '),
            diag: function (A, T) {
              var miss = T.filter(function (x) { return !has(A, x); }), extra = A.filter(function (x) { return !has(T, x); });
              if (A.length && A.every(function (x) { return has(other, x); })) return { code: 'u4t-k-c-sign', hint: 'Those integers multiply to ' + t(-c) + '. Here the last term is ' + t(c) + (c < 0 ? ', so one integer of each pair is negative.' : ', so both integers have the same sign.') };
              if (A.length === 1 && has(T, A[0])) return { code: 'u4t-k-one', hint: 'That one works, but there are more: use <b>every</b> factor pair of ' + t(C) + ', with both sign choices.' };
              if (!extra.length && miss.length && A.every(function (x) { return x > 0; }) && miss.every(function (x) { return x < 0; })) return { code: 'u4t-k-pos', hint: 'Those all work — but making both integers negative' + (c < 0 ? ' (or swapping which one is negative)' : '') + ' gives the negative values of ' + t('k') + ' too.' };
              if (!extra.length && miss.length) return { code: 'sol-missing', hint: 'Those all work, but some are missing. List <b>every</b> factor pair of ' + t(C) + ' (including ' + t('1') + ' and ' + t(C) + '), with both sign choices.' };
              if (extra.length) return { code: 'sol-extra', hint: t('k=' + extra[0]) + ' doesn’t work: no two integers with product ' + t(c) + ' add to ' + t(extra[0]) + '.' };
              return null;
            } },
            'We need two integers with product ' + t(c) + ' and sum ' + t('k') + '. Factor pairs of ' + t(C) + ': ' + pairs.map(function (q) { return t(q[0] + '\\times ' + q[1]); }).join(', ') + '.<br>' + lines.join('<br>') + '<br>So ' + t('k=' + ks.join(',\\ ')) + ' (' + ks.length + ' values).',
            ['Write ' + t(shown + '=(x+m)(x+n)') + ': then ' + t('mn=' + c) + ' and ' + t('m+n=k') + '.', 'List every factor pair of ' + t(C) + ' and use each with both sign choices.'], 'all k: x²+kx' + (c < 0 ? '' : '+') + c);
          p.bad = [ks.filter(function (k) { return k > 0; }).join(', '), other.join(', '), String(ks[ks.length - 1])];
          return p;
        } },
        { id: '15b', outcome: 'AN5', level: 'MAS', make: function (r) {
          var v = r.pick(['x', 'x', 'y', 'a', 'm']), z = pick(function () { return { p: r.pick([1, 1, 2, 3]), q: r.int(2, 9) }; }, function (z) { return gcd(z.p, z.q) === 1 && z.p * z.q <= 24; });
          var p = z.p, q = z.q, k = 2 * p * q, A = (p === 1 ? '' : p) + v, first = p === 1 ? v + '^{2}' : p * p + v + '^{2}';
          var pr = KP.valueSet('Find all the values of ' + t('k') + ' so that ' + t(first + '+k' + v + '+' + q * q) + ' is a perfect square trinomial.', [k, -k], { v: 'k', keyTex: 'k=' + k + ',\\ k=-' + k,
            diag: function (A0) {
              if (A0.length === 1 && Math.abs(A0[0]) === k) return { code: 'u4t-k-one', hint: 'That one works — but ' + t('(' + A + (A0[0] > 0 ? '-' : '+') + q + ')^{2}') + ' is a perfect square too. There is another value.' };
              if (A0.some(function (x) { return Math.abs(x) === p * q; })) return { code: 'not-doubled', hint: 'The middle term of ' + t('(A+B)^{2}') + ' is ' + t('2AB') + ' — don’t forget the ' + t('2') + '.' };
              if (A0.some(function (x) { return Math.abs(x) === 2 * p * p * q * q || Math.abs(x) === 2 * q * q || Math.abs(x) === p * p * q * q; })) return { code: 'u4t-no-root', hint: 'Use the square roots of the first and last terms, ' + t(A) + ' and ' + t(q) + ', not the terms themselves.' };
              return null;
            } },
            t(first + '=(' + A + ')^{2}') + ' and ' + t(q * q + '=' + q + '^{2}') + '. The middle term must be ' + t('\\pm 2(' + A + ')(' + q + ')=\\pm ' + k + v) + '.<br>' + t('k=' + k) + ' gives ' + t('(' + A + '+' + q + ')^{2}') + ', and ' + t('k=-' + k) + ' gives ' + t('(' + A + '-' + q + ')^{2}') + '.',
            ['Find the square roots of the first and last terms: ' + t('A') + ' and ' + t('B') + '.', 'The middle term is ' + t('+2AB') + ' or ' + t('-2AB') + '.'], 'all k: PST ' + plain(first) + '+k' + v + '+' + q * q);
          pr.bad = [String(k), k + ', ' + (-p * q), p * q + ', ' + (-p * q)];
          return pr;
        } }] },
      { num: '16', outcome: 'AN5', stem: 'Solve by factoring. Type every solution, like ' + t('x=1,\\ x=2') + '. Fractions are fine.', parts: [
        { id: '16a', outcome: 'AN5', level: 'MAS', make: function (r) {
          var z = pick(function () { return { p: r.pick([2, 3]), u: r.int(1, 5) * r.pick([1, -1]), v: r.int(1, 6) * r.pick([1, -1]) }; }, function (z) { return gcd(z.p, z.u) === 1 && z.p * z.v - z.u !== 0 && Math.abs(z.p * z.u * z.v) <= 60; });
          var p = z.p, u = z.u, v = z.v, F1 = lin(p, 'x', -u), F2 = lin(1, 'x', v), Ft = FT(null, [F1, F2]), poly = tx(Ft.poly), b = p * v - u, c = -u * v, ac = p * c;
          var m = p * v, n = -u, root = fracTex(u, p);
          var grp = tx(M(p, 'x')) + br(lin(1, 'x', v)) + (n < 0 ? '' : '+') + n + br(lin(1, 'x', v));
          return solvePart('Solve ' + t(poly + '=0') + '.', [[u, p], -v],
            function (A) {
              if (sameSet(A, [u, -v])) return { code: 'u4t-zp-no-divide', hint: 'From ' + t(seq(F1) + '=0') + ': ' + t(p + 'x=' + u) + ', so divide by ' + t(p) + '.' };
              if (sameSet(A, [-m, -n])) return { code: 'u4t-pair-as-factors', hint: 'Those come from writing the pair ' + t(m) + ' and ' + t(n) + ' straight into brackets, which only works when ' + t('a=1') + '. Split the middle term and group.' };
              return null;
            },
            t('ac=' + p + '\\times ' + pv(c) + '=' + ac) + '; the pair with product ' + t(ac) + ' and sum ' + t(b) + ' is ' + t(m) + ' and ' + t(n) + '.<br>' + t(poly + '=' + seq([M(p, 'x', 2), M(m, 'x'), M(n, 'x'), N(c)]) + '=' + grp + '=' + Ft.tex) + '<br>So ' + t(Ft.tex + '=0') + ': ' + t(seq(F1) + '=0') + ' gives ' + t('x=' + root) + ', and ' + t(seq(F2) + '=0') + ' gives ' + t('x=' + (-v)) + '.<br>Check ' + t('x=' + (-v)) + ': ' + t(p + '(' + (-v) + ')^{2}' + (b < 0 ? '' : '+') + (b === 1 ? '' : b === -1 ? '-' : b) + '(' + (-v) + ')' + (c < 0 ? '' : '+') + c + '=' + (p * v * v - b * v + c)) + ' ✓',
            ['Factor by decomposition first (' + t('ac=' + ac) + ').', 'Set each factor equal to 0. The bracket ' + t(seq(F1)) + ' gives a fraction.'], 'solve ' + plain(poly) + '=0', [u + ', ' + (-v), (-u) + '/' + p + ', ' + v, String(-v)]);
        } },
        { id: '16b', outcome: 'AN5', level: 'MAS', make: function (r) {
          var z = pick(function () { return { k: r.int(2, 5), m: r.int(1, 9) * r.pick([1, 1, -1]) }; }, function (z) { return Math.abs(z.k * z.m) >= 4 && Math.abs(z.k * z.m) <= 45; });
          var k = z.k, m = z.m, eq = tx(M(k, 'x', 2)) + '=' + tx(M(k * m, 'x'));
          return solvePart('Solve ' + t(eq) + '.', [0, m],
            function (A) {
              if (sameSet(A, [m])) return { code: 'u4t-lost-zero', hint: 'Dividing both sides by ' + t('x') + ' loses a solution. Move everything to one side and factor out the GCF instead.' };
              if (sameSet(A, [0, k * m])) return { code: 'u4t-zp-no-divide', hint: 'Check the second factor: ' + t(k + 'x' + (m < 0 ? '+' : '-') + Math.abs(k * m) + '=0') + ' gives ' + t('x=' + m) + ' (divide by ' + t(k) + ').' };
              return null;
            },
            'Make one side 0: ' + t(tx(M(k, 'x', 2)) + (m < 0 ? '+' : '-') + tx(M(Math.abs(k * m), 'x')) + '=0') + '.<br>Take out the GCF ' + t(k + 'x') + ': ' + t(k + 'x' + br(lin(1, 'x', -m)) + '=0') + '.<br>' + t(k + 'x=0') + ' gives ' + t('x=0') + '; ' + t(seq(lin(1, 'x', -m)) + '=0') + ' gives ' + t('x=' + m) + '.<br>So ' + t(xs([0, m])) + '. (Don’t divide by ' + t('x') + ' — that loses ' + t('x=0') + '.)',
            ['Move everything to one side so the other side is 0. Do not divide by ' + t('x') + '.', 'Take out the GCF, then set each factor equal to 0.'], 'solve ' + plain(eq), [String(m), '0, ' + k * m, '0, ' + (-m)]);
        } }] },
      { num: '17', outcome: 'AN5',
        shared: function (r) {
          var z = pick(function () { return { p: r.pick([2, 3]), q: r.int(1, 7), s: r.int(1, 6), x: r.int(2, 6) }; }, function (z) { return gcd(z.p, z.q) === 1 && z.p * z.s !== z.q && z.p * z.q * z.s <= 70; });
          z.F1 = sum(lin(z.p, 'x', z.q)); z.F2 = sum(lin(1, 'x', z.s)); z.area = P.mul(z.F1, z.F2);
          z.what = r.pick([{ w: 'rectangular garden bed', u: 'm' }, { w: 'rectangular patio', u: 'm' }, { w: 'rectangular poster', u: 'dm' }, { w: 'rectangular rug', u: 'm' }]);
          return z;
        },
        stem: function (z) { return 'A ' + z.what.w + ' has area ' + t('(' + tx(z.area) + ')') + ' ' + z.what.u + t('^{2}') + '.'; },
        parts: [
          { id: '17a', sub: 'a', outcome: 'AN5', level: 'MAS', make: function (r, z) {
            var T = Tri({ p: z.p, q: z.q, r: 1, s: z.s }), s1 = tx(z.F1), s2 = tx(z.F2);
            var pa1 = sum(lin(1, 'x', T.m)), pa2 = sum(lin(1, 'x', T.n));
            var chk = function (v, all) {
              var a = readPoly(all[0]), b = readPoly(all[1]);
              if (a.res) return a.res; if (b.res) return b.res;
              if ((P.eq(a.p, z.F1) && P.eq(b.p, z.F2)) || (P.eq(a.p, z.F2) && P.eq(b.p, z.F1))) return ok();
              if ((P.eq(a.p, pa1) && P.eq(b.p, pa2)) || (P.eq(a.p, pa2) && P.eq(b.p, pa1))) return wrong('u4t-pair-as-factors', 'Writing the pair ' + t(T.m) + ' and ' + t(T.n) + ' straight into brackets only works when ' + t('a=1') + '. Split the middle term and group.');
              if (P.eq(P.mul(a.p, b.p), z.area) && P.degree(a.p) === 1 && P.degree(b.p) === 1) return wrong('sign-all', 'Those multiply to the area, but a length can’t be negative: write each side with a positive ' + t('x') + '-term and positive number.');
              if (P.eq(P.mul(a.p, b.p), z.area)) return wrong('not-factored', 'Factor the area into <b>two binomials</b>: each side length is one of them.');
              if ([a.p, b.p].some(function (x) { return P.eq(x, z.F1) || P.eq(x, z.F2); })) return wrong('u4t-one-side', 'One side is right. The other side times it must give the area — check it by expanding.');
              return wrong('value', 'Factor the area: the two sides multiply to ' + t(tx(z.area)) + '.');
            };
            return boxes('Factor the area to find expressions for the two side lengths.', [polyBox('Side length:', ['x'], { wide: false, after: z.what.u, name: 'First side', ph: 'e.g. 2x + 5' }), polyBox('Other side length:', ['x'], { wide: false, after: z.what.u, name: 'Other side', ph: 'e.g. x + 3' })],
              [chk, function () { return ok(); }], [s1, s2], t(s1) + ' ' + z.what.u + ' and ' + t(s2) + ' ' + z.what.u,
              'Factor ' + t(tx(z.area)) + ' by decomposition:<br>' + solDecomp(T) + '<br>So the sides are ' + t(s1) + ' ' + z.what.u + ' and ' + t(s2) + ' ' + z.what.u + '.',
              ['Area of a rectangle = length × width, so factor the area.', 'Use decomposition: ' + t('ac=' + T.ac) + ', sum ' + t(T.b) + '.'], 'area sides ' + plain(tx(z.area)),
              [[tx(pa1), tx(pa2)], [s1, tx(sum(lin(1, 'x', z.s + 1)))], [tx(z.area), '1']], [[s2, s1]]);
          } },
          { id: '17b', sub: 'b', outcome: 'AN5', level: 'MAS', make: function (r, z) {
            var L = z.p * z.x + z.q, W = z.x + z.s, per = 2 * (L + W), area = L * W;
            return KP.number('If ' + t('x=' + z.x) + ', find the <b>perimeter</b> of the ' + z.what.w + '.', per, function (v) {
              if (v === area) return { code: 'u4t-area-not-perim', hint: 'That is the area (' + t(L + '\\times ' + W) + '). The perimeter is the distance around: ' + t('2(\\text{length}+\\text{width})') + '.' };
              if (v === L + W) return { code: 'u4t-half-perim', hint: 'That is one length plus one width — a rectangle has two of each.' };
              return null;
            }, 'Substitute ' + t('x=' + z.x) + ' into the sides: ' + t(tx(z.F1) + '=' + z.p + '(' + z.x + ')+' + z.q + '=' + L) + ' ' + z.what.u + ' and ' + t(tx(z.F2) + '=' + z.x + '+' + z.s + '=' + W) + ' ' + z.what.u + '.<br>Perimeter ' + t('=2(' + L + '+' + W + ')=' + per) + ' ' + z.what.u + '.<br>(Check: the area is ' + t(L + '\\times ' + W + '=' + area) + ', and ' + t(tx(z.area)) + ' at ' + t('x=' + z.x) + ' is also ' + t(area) + ' ✓)',
              ['Substitute ' + t('x=' + z.x) + ' into each side length from part (a).', 'Perimeter ' + t('=2(\\text{length}+\\text{width})') + '.'], 'perimeter x=' + z.x, { after: z.what.u });
          } }] }
    ]
  });
})(window);
