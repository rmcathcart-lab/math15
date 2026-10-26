/* Math 15 · Unit 4 · Lesson 7 — Factoring ax² + bx + c (where a ≠ 1) (AN5)
 * Assignment 7 (u4_L07.tex, questions 1–14) and the Lesson 7 Extra Practice (u4_EP07.tex, questions 1–17).
 * Modelled on Math 10C u4l5. Every trinomial is built from its factors: Tri({ p, q, r, s, k, gv, v, w, e }) is
 * k·(gv-monomial)·(p vᵉ + q w)(r vᵉ + s w), gcd(p, q) = gcd(r, s) = 1, so the key is the generated factorization. The
 * decomposition pair is m = p·s and n = q·r and the grouping  p v(r v + s) + q(r v + s)  is the worked solution (the
 * booklet's six steps: ac, the pair, split, group, common binomial, check). Each part keeps the booklet question's
 * structure (sign pattern of b and c, which leading coefficient is 1, size of ac, a GCF first, a negative leading term,
 * two variables, x²-trinomials) and the booklet's own numbers are among the possible values. Math 15: smaller numbers
 * than 10C, more scaffolding (fill-in-the-steps parts, the decomposition written out one step at a time).
 * Classic wrong factorizations (both signs switched, constants in the wrong brackets, the pair written straight into the
 * brackets as if a = 1, a dropped common factor) are computed from the numbers and get targeted hints.
 * Levels (Math 15, conservative): BEG core decomposition with positive terms; EMG negative b or a composite a; PRG c < 0,
 * a GCF first, larger ac; ADV GCF with a variable / x²-trinomials / working backwards; MAS: every value of b (extra 15). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, PL = HW.poly, FX = HW.factor, nt = HW.nt;

  HW.addCodes({
    'u4l7-pairs-missing': 'Missed a factor pair of ac', 'u4l7-pair-not-ac': 'Listed a pair that does not multiply to ac', 'u4l7-pair-negative': 'Listed a negative pair (positive pairs asked)',
    'u4l7-split-order': 'Split terms in the wrong order for the given grouping', 'u4l7-nr-sum': 'Gave a + b instead of a − b', 'u4l7-nr-pair': 'Used the decomposition pair instead of a and b',
    'u4l7-back-sign': 'Missing factor: constant with the wrong sign', 'u4l7-back-swap': 'Missing factor: coefficient and constant swapped', 'u4l7-back-other': 'Gave the given factor or the trinomial',
    'u4l7-dims-swap': 'Length and width in each other’s boxes', 'u4l7-dims-sub': 'Substituted into the wrong bracket'
  });
  /* codes reused from Math 10C (same meaning; partial credit as decided there) */
  HW.addCodes({
    'ax-sign-swap': 'Signs of both constants switched', 'ax-const-swap': 'Constant terms in the wrong brackets', 'ax-pair-as-factors': 'Wrote the pair into the brackets as if a = 1',
    'ax-gcf-dropped': 'Dropped the common factor', 'ax-lost-negative': 'Lost the negative common factor', 'ax-no-y': 'Left out the second variable', 'ax-group-sign': 'Sign error taking out the second group’s factor',
    'ax-need-x': 'Box entries without the variable', 'ax-pair-signs': 'Pair with both signs wrong', 'ax-pair-sum': 'Pair has the right product, wrong sum',
    'ax-pair-product': 'Pair has the right sum, wrong product', 'ax-pair-product-sign': 'Pair product has the wrong sign', 'ax-pair-int': 'Pair not two integers',
    'ax-collected': 'Collected the middle terms', 'ax-sum-not-product': 'Added instead of multiplying', 'ax-ac-wrong': 'Wrong value of ac',
    'ax-missing-b': 'Missing some values of b', 'ax-extra-b': 'A value of b that does not work', 'ax-only-positive': 'Left out the negative values of b',
    'said-none': 'Said it can’t be factored (it can)', 'no-pair': 'Wrote factors for a trinomial that doesn’t factor', 'use-none': 'Retyped a trinomial that doesn’t factor',
    'dsq-square': 'Wrote a difference of squares as a perfect square (A − B)²', 'dims-perim': 'Gave half the perimeter (one length + one width)', 'perim-area': 'Gave the area instead of the perimeter',
    'u4l7-gcf-part': 'Divided only one term by the GCF'
  });
  HW.addPartial({ 'u4l7-gcf-part': 'b', 'u4l7-pairs-missing': 's', 'u4l7-pair-not-ac': 'n', 'u4l7-pair-negative': 'n', 'u4l7-split-order': 's', 'u4l7-nr-sum': 'n', 'u4l7-nr-pair': 'b',
    'u4l7-back-sign': 's', 'u4l7-back-swap': 'b', 'u4l7-back-other': 'n', 'u4l7-dims-swap': 's', 'u4l7-dims-sub': 'b' });

  /* ---------------- polynomial building blocks ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = b; b = a % b; a = x; } return a; }
  function vo(v, e, w, f) { var o = {}; if (v && e) o[v] = e; if (w && f) o[w] = (o[w] || 0) + f; return o; }
  function M(c, vars) { return PL.mono(c, vars || {}); }
  function N(c) { return PL.num(c); }
  function lin(p, q, v, w, e) { return PL.add(M(p, vo(v || 'x', e || 1)), w ? M(q, vo(w, 1)) : N(q)); }
  function tx(p, o) { return PL.tex(p, o); }
  function br(p) { return PL.btex(p); }
  function sg(n) { return n < 0 ? String(n) : '+' + n; }
  function pn(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function mulAll(list) { return list.reduce(function (acc, f) { return PL.mul(acc, f); }, N(1)); }
  function X(c, v, e) { return tx(M(c, vo(v || 'x', e || 1))); }

  /* a trinomial built from its factors */
  function Tri(o) {
    var v = o.v || 'x', w = o.w || null, e = o.e || 1, T = { p: o.p, q: o.q, r: o.r, s: o.s, v: v, w: w, e: e };
    T.L = function (a, b) { return lin(a, b, v, w, e); };
    T.F1 = T.L(o.p, o.q); T.F2 = T.L(o.r, o.s);
    T.inner = PL.mul(T.F1, T.F2);
    T.a = o.p * o.r; T.b = o.p * o.s + o.q * o.r; T.c = o.q * o.s; T.ac = T.a * T.c;
    T.m = o.p * o.s; T.n = o.q * o.r;
    T.gm = M(o.k || 1, o.gv || {}); T.hasG = !PL.eq(T.gm, N(1)); T.neg = (o.k || 1) < 0;
    T.full = PL.mul(T.gm, T.inner);
    T.tex = tx(T.full); T.innerTex = tx(T.inner);
    T.sq = PL.eq(T.F1, T.F2);
    T.list = T.sq ? (T.hasG ? [T.gm, { p: T.F1, k: 2 }] : [{ p: T.F1, k: 2 }]) : T.hasG ? [T.gm, T.F2, T.F1] : [T.F2, T.F1];
    T.key = FX.tex(T.list);
    return T;
  }
  function gpre(T) { var g = tx(T.gm); return g === '1' ? '' : g === '-1' ? '-' : g; }
  function midTerm(T, c) { return M(c, vo(T.v, T.e, T.w, 1)); }
  function splitTex(T) { return PL.seq([M(T.a, vo(T.v, 2 * T.e)), midTerm(T, T.m), midTerm(T, T.n), M(T.c, vo(T.w, 2))]); }
  function g1Of(T) { return M(T.p, vo(T.v, T.e)); }
  function g2Of(T) { return T.w ? M(T.q, vo(T.w, 1)) : N(T.q); }
  function groupTex(T) { var b2 = br(T.F2), g2t = tx(g2Of(T)); return tx(g1Of(T)) + b2 + (g2t.charAt(0) === '-' ? '' : '+') + g2t + b2; }
  function seg2(T) { return PL.seq([midTerm(T, T.n), M(T.c, vo(T.w, 2))]); }
  function altNeg(T) { // -(F2)(F1) with the minus put into one bracket, e.g. (4-x)(2x+3)
    var negF1 = T.q < 0 || T.s > 0;
    return negF1 ? br(T.F2) + '(' + tx(PL.neg(T.F1), { order: 'asc' }) + ')' : '(' + tx(PL.neg(T.F2), { order: 'asc' }) + ')' + br(T.F1);
  }
  function pairLine(T) {
    if (T.a === 1 && !T.w && T.e === 1) return 'Two integers with product ' + t(T.c) + ' and sum ' + t(T.b) + ': ' + t(T.m) + ' and ' + t(T.n) + '.';
    return t('a\\times c=' + T.a + '\\times ' + pn(T.c) + '=' + T.ac) + '; two integers with product ' + t(T.ac) + ' and sum ' + t(T.b) + ': ' + t(T.m) + ' and ' + t(T.n) + '.';
  }
  function checkLine(T) { return 'Check: ' + t(br(T.F2) + br(T.F1) + '=' + PL.seq([M(T.a, vo(T.v, 2 * T.e)), midTerm(T, T.n), midTerm(T, T.m), M(T.c, vo(T.w, 2))]) + '=' + T.innerTex) + ' ✓'; }
  function innerSteps(T) {
    var L = [];
    L.push((T.hasG ? 'For ' + t(T.innerTex) + ': ' : '') + pairLine(T));
    if (T.a === 1 && !T.w && T.e === 1) { L.push(t(T.innerTex + '=' + FX.tex([T.F2, T.F1]))); return L; }
    L.push('Split the middle term: ' + t(T.innerTex + '=' + splitTex(T)));
    L.push('Group and take out each GCF: ' + t('=' + groupTex(T)));
    L.push('Take out the common binomial: ' + t('=' + (T.sq ? br(T.F1) + br(T.F1) + '=' + br(T.F1) + '^{2}' : br(T.F2) + br(T.F1))));
    return L;
  }
  function solDecomp(T) {
    var L = [];
    if (T.hasG) L.push((T.neg ? 'The leading term is negative, so take out ' + (gpre(T) === '-' ? t('-1') : t(tx(T.gm))) : 'Take out the GCF ' + t(tx(T.gm)) + ' first') + ': ' + t(T.tex + '=' + gpre(T) + '(' + T.innerTex + ')') + '.');
    L = L.concat(innerSteps(T));
    if (!T.sq && !(T.a === 1 && !T.w)) L.push(checkLine(T));
    if (T.hasG) L.push('So ' + t(T.tex + '=' + T.key) + (T.neg && gpre(T) === '-' ? ' (or ' + t(altNeg(T)) + ')' : '') + '.');
    return L.join('<br>');
  }
  function hintsFor(T) {
    var h = [];
    if (T.hasG) h.push(T.neg ? 'The leading term is negative: take out ' + t(gpre(T) === '-' ? '-1' : tx(T.gm)) + ' first.' : 'Look for a GCF first — here it is ' + t(tx(T.gm)) + '.');
    if (T.a === 1 && !T.w && T.e === 1) h.push('For ' + t(T.innerTex) + ': find two integers with product ' + t(T.c) + ' and sum ' + t(T.b) + '.');
    else h.push('For ' + t(T.innerTex) + ': find two integers with product ' + t('a\\times c=' + T.ac) + ' and sum ' + t('b=' + T.b) + ', split the middle term with them, then group in pairs.');
    return h;
  }
  /* classic wrong factorizations, computed from the numbers */
  function stdWrongs(T) {
    var out = [], seen = [T.full], g = T.gm;
    function add(fs, code, hint) {
      var pr = mulAll(fs);
      if (PL.isZero(pr) || seen.some(function (x) { return PL.eq(x, pr); })) return;
      seen.push(pr); out.push({ is: pr, code: code, hint: hint(t(tx(pr))), tex: FX.tex(fs) });
    }
    add([g, T.L(T.p, -T.q), T.L(T.r, -T.s)], 'ax-sign-swap', function (P) { return 'Your factors multiply to ' + P + ': the middle term has the wrong sign. Change the sign of the constant term in <b>both</b> brackets.'; });
    add([g, T.L(T.p, T.s), T.L(T.r, T.q)], 'ax-const-swap', function (P) { return 'Your factors multiply to ' + P + '. The first and last terms are right but the middle term isn’t: the constant terms are in the wrong brackets. Check by expanding (FOIL).'; });
    if (T.a > 1 && T.e === 1) {
      add([g, lin(1, T.m, T.v, T.w), lin(1, T.n, T.v, T.w)], 'ax-pair-as-factors', function (P) { return 'Your factors multiply to ' + P + '. Writing the two integers straight into the brackets only works when ' + t('a=1') + '. Use them to <b>split the middle term</b>, then group.'; });
    }
    if (T.hasG) {
      add([T.F1, T.F2], T.neg && gpre(T) === '-' ? 'ax-lost-negative' : 'ax-gcf-dropped', function (P) {
        return T.neg && gpre(T) === '-' ? 'Your factors multiply to ' + P + ' — the opposite of the expression. You took out ' + t('-1') + ', so keep the minus sign in front.'
          : 'Don’t lose the GCF: ' + t(tx(T.gm)) + ' stays in front of the brackets.';
      });
    }
    if (T.w) add([g, lin(T.p, T.q, T.v), lin(T.r, T.s, T.v)], 'ax-no-y', function () { return 'Each bracket needs a ' + t(T.w) + '-term: the last term of the trinomial is ' + t(tx(M(T.c, vo(T.w, 2)))) + '.'; });
    return out;
  }
  function factorPart(T, o) {
    o = o || {};
    var W = stdWrongs(T).concat(o.wrong || []).filter(function (x) { return !PL.eq(PL.lift(x.is), T.full); });
    var p = B.factored(o.prompt || t(T.tex), T.list, { wrong: W }, o.sol || solDecomp(T), o.hints || hintsFor(T), o.text || 'factor ' + T.tex);
    p.bad = W.map(function (x) { return x.tex || tx(PL.lift(x.is)); }).concat(o.bad || []);
    p.good = [T.sq ? FX.tex(T.hasG ? [T.gm, T.F1, T.F1] : [T.F1, T.F1]) : FX.tex(T.hasG ? [T.gm, T.F1, T.F2] : [T.F1, T.F2])];
    if (T.neg && gpre(T) === '-') { var al = altNeg(T); p.good.push(al); p.answer = t(T.key) + ' or ' + t(al); }
    return p;
  }
  /* constrained random (p, q, r, s); the booklet's numbers are inside every range */
  function val(r, x) { return typeof x === 'number' ? x : Array.isArray(x) ? r.int(x[0], x[1]) : r.pick(x.of); }
  function pick(r, sp) {
    for (var i = 0; i < 2000; i++) {
      var o = { p: val(r, sp.p), q: val(r, sp.q), r: val(r, sp.r), s: val(r, sp.s) };
      if (!o.q || !o.s || o.p < 1 || o.r < 1 || gcd(o.p, o.q) !== 1 || gcd(o.r, o.s) !== 1) continue;
      o.a = o.p * o.r; o.b = o.p * o.s + o.q * o.r; o.c = o.q * o.s; o.ac = o.a * o.c; o.m = o.p * o.s; o.n = o.q * o.r;
      if ((o.a < 2 && !sp.monic) || !o.b) continue;
      if (o.p === o.r && o.q === o.s && !sp.square) continue;
      if (sp.test && !sp.test(o)) continue;
      return o;
    }
    return sp.book;
  }
  function tri(r, sp, extra) { var o = pick(r, sp); return Tri(Object.assign({ p: o.p, q: o.q, r: o.r, s: o.s }, extra || {})); }
  function npairs(n) { return Math.ceil(nt.numDivisors(Math.abs(n)) / 2); }
  function hasPair(ac, b) { var d = nt.divisors(Math.abs(ac)); for (var i = 0; i < d.length; i++) for (var sgn = -1; sgn <= 1; sgn += 2) { var x = sgn * d[i], y = ac / x; if (x + y === b) return [x, y]; } return null; }

  /* ---------------- answer readers and small checkers ---------------- */
  function readPoly(resp) {
    var a = K.read(resp == null ? '' : resp); if (a.res) return { res: a.res };
    var rr = PL.read(a.ast);
    if (!rr.ok) return { res: wrong(rr.why === 'not-poly' ? 'not-poly' : 'value', rr.why === 'not-poly' ? 'That isn’t a polynomial. Check your work.' : null) };
    return { p: rr.p, fi: PL.formIssue(a.ast) };
  }
  function readInt(resp) { var a = K.read(resp == null ? '' : resp); if (a.res) return { res: a.res }; if (!isFinite(a.val) || Math.abs(a.val - Math.round(a.val)) > 1e-9) return { bad: true }; return { v: Math.round(a.val) }; }
  function lab(res, label) { return res.hint && label ? { v: res.v, code: res.code, hint: '<b>' + label + ':</b> ' + res.hint } : res; }
  function constOf(p) { return PL.vars(p).length ? null : PL.constant(p)[0] / PL.constant(p)[1]; }
  function coefOf(p, v) { if (PL.count(p) !== 1) return null; var c = PL.coef(p, vo(v, 1)); return c[0] && c[1] === 1 && PL.count(PL.sub(p, M(c[0], vo(v, 1)))) === 0 ? c[0] : null; }
  function pbox(label, vars) { return { label: label, name: label.replace(/<[^>]*>|\\\(|\\\)/g, ''), mode: 'math', keys: 'poly', vars: vars || ['x'] }; }
  function nbox(label, after) { return { label: label, name: label.replace(/<[^>]*>|\\\(|\\\)/g, ''), after: after }; }
  function fieldsPart(prompt, fields, check, key, answer, sol, hints, text) { return { prompt: prompt, input: { type: 'fields', fields: fields }, check: check, key: key, answer: answer, solution: sol, hints: hints || [], text: text }; }
  /* a pair of integers, either order */
  function pairEval(x, y, m, n, ac, b) {
    if ((x === m && y === n) || (x === n && y === m)) return null;
    if (x * y === ac && x + y === -b) return wrong('ax-pair-signs', 'Those multiply to ' + t(ac) + ' but add to ' + t(-b) + '. Change the sign of <b>both</b> numbers.');
    if (x * y === ac) return wrong('ax-pair-sum', t(pn(x) + '\\times ' + pn(y) + '=' + ac) + ' ✓, but ' + t(pn(x) + '+' + pn(y) + '=' + (x + y)) + ', not ' + t(b) + '. Keep working through the factor pairs of ' + t(Math.abs(ac)) + '.');
    if (x + y === b) return wrong('ax-pair-product', 'They add to ' + t(b) + ' ✓, but ' + t(pn(x) + '\\times ' + pn(y) + '=' + (x * y)) + ', not ' + t(ac) + '.');
    if (x * y === -ac) return wrong('ax-pair-product-sign', 'Check the signs: the product must be ' + t(ac) + (ac < 0 ? ', which is negative, so the two numbers have opposite signs.' : ', which is positive, so the two numbers have the same sign.'));
    return wrong('value', 'The two numbers must multiply to ' + t(ac) + ' and add to ' + t(b) + '.');
  }
  function pairCheck(m, n, ac, b, labels, offset) {
    offset = offset || 0; labels = labels || ['First integer', 'Second integer'];
    return function (resp) {
      resp = resp || [];
      var A = readInt(resp[offset]), C = readInt(resp[offset + 1]);
      if (A.res) return lab(A.res, labels[0]); if (C.res) return lab(C.res, labels[1]);
      if (A.bad || C.bad) return wrong('ax-pair-int', 'Both boxes need an integer (a whole number, possibly negative).');
      return pairEval(A.v, C.v, m, n, ac, b) || ok();
    };
  }
  function signHint(ac, b) { return ac > 0 ? t('a\\times c') + ' is positive, so both integers have the same sign as ' + t('b') + ' (' + (b > 0 ? 'both positive' : 'both negative') + ').' : t('a\\times c') + ' is negative, so the integers have opposite signs; the one with the larger size takes the sign of ' + t('b') + '.'; }
  function pairList(ac, b) { // the factor pairs of ac with the signs that matter, and their sums
    var d = nt.divisors(Math.abs(ac)).filter(function (x) { return x * x <= Math.abs(ac); }), out = [];
    d.forEach(function (x) { var y = Math.abs(ac) / x; if (ac > 0) { var s = b < 0 ? -1 : 1; out.push([s * x, s * y]); } else { out.push(b >= 0 ? [-x, y] : [x, -y]); } });
    return out.map(function (pq) { return t(pn(pq[0]) + '\\times ' + pn(pq[1])) + ' → sum ' + t(pq[0] + pq[1]) + (pq[0] + pq[1] === b ? ' ✓' : ''); }).join('; ');
  }
  /* two polynomial boxes holding f1, f2 in either order */
  function twoPolyCheck(f1, f2, labels, diag) {
    return function (resp) {
      resp = resp || [];
      var A = readPoly(resp[0]), C = readPoly(resp[1]);
      if (A.res) return lab(A.res, labels[0]); if (C.res) return lab(C.res, labels[1]);
      if ((PL.eq(A.p, f1) && PL.eq(C.p, f2)) || (PL.eq(A.p, f2) && PL.eq(C.p, f1))) {
        if (A.fi) return lab(form(A.fi.code, A.fi.msg || 'Simplify it fully.'), labels[0]);
        if (C.fi) return lab(form(C.fi.code, C.fi.msg || 'Simplify it fully.'), labels[1]);
        return ok();
      }
      var h = diag ? diag(A.p, C.p) : null; if (h) return h;
      return wrong('value', null);
    };
  }
  /* the two split middle terms (either order) */
  function middleCheck(T, labels) {
    var v = T.v, mx = M(T.m, vo(v, 1)), nx = M(T.n, vo(v, 1)), BX = tx(M(T.b, vo(v, 1))), ACX = tx(M(T.ac, vo(v, 2)));
    return twoPolyCheck(mx, nx, labels, function (P1, P2) {
      var c0 = constOf(P1), c1 = constOf(P2);
      if (c0 != null && c1 != null && ((c0 === T.m && c1 === T.n) || (c0 === T.n && c1 === T.m))) return form('ax-need-x', 'Right numbers — but these are ' + t(v) + '-terms: write ' + t(tx(mx)) + ', not ' + t(T.m) + '.');
      var k0 = coefOf(P1, v), k1 = coefOf(P2, v);
      if ((k0 === T.b && (c1 === 0 || k1 == null)) || (k1 === T.b && (c0 === 0 || k0 == null))) return wrong('ax-collected', 'That is the whole middle term. Split ' + t(BX) + ' into <b>two</b> pieces using the pair of integers.');
      if (k0 != null && k1 != null) {
        var r = pairEval(k0, k1, T.m, T.n, T.ac, T.b);
        if (r && r.code === 'ax-pair-sum') return wrong('ax-pair-sum', 'Those multiply to ' + t(ACX) + ' ✓, but they add to ' + t(tx(M(k0 + k1, vo(v, 1)))) + ', not ' + t(BX) + '.');
        if (r && r.code === 'ax-pair-product') return wrong('ax-pair-product', 'They add to ' + t(BX) + ' ✓, but their coefficients multiply to ' + t(k0 * k1) + ', not ' + t('a\\times c=' + T.ac) + '.');
        if (r && r.code !== 'value') return r;
      }
      return wrong('value', 'The two pieces must add to ' + t(BX) + ', and their coefficients must multiply to ' + t('a\\times c=' + T.ac) + '.');
    });
  }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* ---------------- question makers ---------------- */
  /* Q1: a, b, c → a×c and the two integers */
  function acPairPart(T) {
    var lb = [t('a\\times c'), 'First integer', 'Second integer'], pc = pairCheck(T.m, T.n, T.ac, T.b, [lb[1], lb[2]], 1);
    var chk = function (resp) {
      resp = resp || [];
      var A = readInt(resp[0]); if (A.res) return lab(A.res, lb[0]);
      if (A.bad || A.v !== T.ac) {
        if (A.v === T.a + T.c) return wrong('ax-sum-not-product', '<b>' + lb[0] + ':</b> multiply, don’t add: ' + t(T.a + '\\times ' + pn(T.c)) + '.');
        if (A.v === T.a * T.b || A.v === T.b * T.c) return wrong('ax-ac-wrong', '<b>' + lb[0] + ':</b> use the first number ' + t('a') + ' and the last number ' + t('c') + ', not ' + t('b') + '.');
        if (A.v === -T.ac) return wrong('ax-ac-wrong', '<b>' + lb[0] + ':</b> check the sign: ' + t(T.a + '\\times ' + pn(T.c) + '=' + T.ac) + '.');
        return wrong('ax-ac-wrong', '<b>' + lb[0] + ':</b> multiply ' + t('a=' + T.a) + ' by ' + t('c=' + T.c) + '.');
      }
      return pc(resp);
    };
    var p = fieldsPart(t('a=' + T.a + ',\\quad b=' + T.b + ',\\quad c=' + T.c), [nbox(lb[0]), nbox(lb[1]), nbox(lb[2])], chk, [String(T.ac), String(T.m), String(T.n)],
      t('a\\times c=' + T.ac) + '; integers ' + t(T.m) + ' and ' + t(T.n),
      t('a\\times c=' + T.a + '\\times ' + pn(T.c) + '=' + T.ac) + '. ' + signHint(T.ac, T.b) + '<br>' + pairList(T.ac, T.b) + '<br>The integers are ' + t(T.m) + ' and ' + t(T.n) + ': ' + t(pn(T.m) + '\\times ' + pn(T.n) + '=' + T.ac) + ' and ' + t(pn(T.m) + '+' + pn(T.n) + '=' + T.b) + '.',
      ['Multiply ' + t('a') + ' by ' + t('c') + ' first. Then list the factor pairs of that number and look for the pair that adds to ' + t('b') + '.', signHint(T.ac, T.b)], 'ac and pair ' + T.a + ',' + T.b + ',' + T.c);
    p.bad = [[String(T.ac), String(-T.m), String(-T.n)]]; if (T.a + T.c !== T.ac) p.bad.push([String(T.a + T.c), String(T.m), String(T.n)]);
    return p;
  }
  /* Q2: fill in 3x² + __ + __ + 6 = __(x + 3) + 2(x + 3) = (x + 3)(__) */
  function fillPart2(T) {
    var mx = M(T.m, { x: 1 }), nx = M(T.n, { x: 1 }), g1 = g1Of(T), lb = ['Blank 1', 'Blank 2', 'Blank 3', 'Blank 4'];
    var shown = t(T.tex + '=' + tx(M(T.a, { x: 2 })) + '+\\boxed{1}+\\boxed{2}' + sg(T.c) + '=\\boxed{3}' + br(T.F2) + '+' + T.q + br(T.F2) + '=' + br(T.F2) + '\\big(\\boxed{4}\\big)');
    var mid = middleCheck(T, [lb[0], lb[1]]);
    var chk = function (resp) {
      resp = resp || [];
      var r0 = mid([resp[0], resp[1]]); if (r0.v !== 'correct') return r0;
      var A = readPoly(resp[0]); if (!PL.eq(A.p, mx)) return form('u4l7-split-order', 'Right pair! Now put them in the order the next line needs: ' + t(tx(M(T.a, { x: 2 })) + '+\\boxed{1}') + ' must have the common factor ' + t(br(T.F2)) + ', so blank 1 is ' + t(tx(mx)) + '.');
      var C = readPoly(resp[2]); if (C.res) return lab(C.res, lb[2]);
      if (!PL.eq(C.p, g1)) return wrong('value', '<b>' + lb[2] + ':</b> the GCF of ' + t(tx(M(T.a, { x: 2 })) + '+' + tx(mx)) + '. What times ' + t(br(T.F2)) + ' gives ' + t(tx(M(T.a, { x: 2 })) + '+' + tx(mx)) + '?');
      if (C.fi) return lab(form(C.fi.code, C.fi.msg || 'Simplify it.'), lb[2]);
      var D = readPoly(resp[3]); if (D.res) return lab(D.res, lb[3]);
      if (PL.eq(D.p, T.F2)) return wrong('value', '<b>' + lb[3] + ':</b> ' + t(br(T.F2)) + ' is already outside. The other bracket collects what is left: ' + t(tx(g1)) + ' and ' + t(T.q) + '.');
      if (!PL.eq(D.p, T.F1)) return wrong('value', '<b>' + lb[3] + ':</b> take ' + t(br(T.F2)) + ' out of both groups: what is left is ' + t(tx(g1)) + ' from the first and ' + t(T.q) + ' from the second.');
      if (D.fi) return lab(form(D.fi.code, D.fi.msg || 'Simplify it.'), lb[3]);
      return ok();
    };
    var p = fieldsPart('Fill in the missing steps to factor ' + t(T.tex) + ' by decomposition.<div class="fig">' + shown + '</div>', [pbox(lb[0]), pbox(lb[1]), pbox(lb[2]), pbox(lb[3])], chk,
      [tx(mx), tx(nx), tx(g1), tx(T.F1)], t(T.tex + '=' + splitTex(T) + '=' + groupTex(T) + '=' + br(T.F2) + br(T.F1)),
      pairLine(T) + '<br>' + t(T.tex + '=' + splitTex(T)) + '<br>' + t('=' + groupTex(T)) + '<br>' + t('=' + br(T.F2) + br(T.F1)) + '<br>' + checkLine(T),
      ['Blanks 1 and 2 split ' + t(tx(M(T.b, { x: 1 }))) + ' using two integers with product ' + t('a\\times c=' + T.ac) + ' and sum ' + t(T.b) + '.', 'Blank 3 is the GCF of the first two terms; blank 4 is what is left after taking ' + t(br(T.F2)) + ' out.'], 'fill in decomposition ' + T.tex);
    p.bad = [[tx(nx), tx(mx), tx(g1), tx(T.F1)], [tx(mx), tx(nx), tx(g1), tx(T.F2)], [String(T.m), String(T.n), tx(g1), tx(T.F1)]];
    return p;
  }
  /* Q5: 2x² − 7x + 3 = 2x² − 6x − x + 3 = 2x(x − 3) − 1(__) = (__)(__) */
  function fillPart5(T) {
    var g1 = g1Of(T), qs = T.q === -1 ? '-1' : String(T.q), lb = ['Bracket', 'First factor', 'Second factor'], wrongBr = T.L(T.r, -T.s);
    var shown = t(T.tex + '=' + splitTex(T) + '=' + tx(g1) + br(T.F2) + qs + '\\big(\\boxed{1}\\big)=\\big(\\boxed{2}\\big)\\big(\\boxed{3}\\big)');
    var two = twoPolyCheck(T.F1, T.F2, [lb[1], lb[2]], function (P1, P2) {
      if ((PL.eq(P1, T.F2) && PL.eq(P2, T.F2))) return wrong('value', 'Take the common binomial ' + t(br(T.F2)) + ' out <b>once</b>; the other bracket collects ' + t(tx(g1)) + ' and ' + t(T.q) + '.');
      if ((PL.eq(P1, T.F2) && PL.eq(P2, T.L(T.p, -T.q))) || (PL.eq(P2, T.F2) && PL.eq(P1, T.L(T.p, -T.q)))) return wrong('ax-group-sign', 'Check the sign in the second bracket: the second group’s common factor is ' + t(qs) + ', so the bracket is ' + t(br(T.F1)) + '.');
      return null;
    });
    var chk = function (resp) {
      resp = resp || [];
      var A = readPoly(resp[0]); if (A.res) return lab(A.res, lb[0]);
      if (PL.eq(A.p, wrongBr)) return wrong('ax-group-sign', '<b>' + lb[0] + ':</b> ' + t(qs + br(wrongBr) + '=' + tx(PL.mul(N(T.q), wrongBr))) + ', not ' + t(seg2(T)) + '. Dividing by a negative changes the sign of <b>both</b> terms.');
      if (!PL.eq(A.p, T.F2)) return wrong('value', '<b>' + lb[0] + ':</b> what times ' + t(qs) + ' gives ' + t(seg2(T)) + '? (It should match the first bracket.)');
      if (A.fi) return lab(form(A.fi.code, A.fi.msg || 'Simplify it.'), lb[0]);
      return two([resp[1], resp[2]]);
    };
    var p = fieldsPart('Fill in the missing steps to factor ' + t(T.tex) + ' by decomposition.<div class="fig">' + shown + '</div>', [pbox(lb[0]), pbox(lb[1]), pbox(lb[2])], chk,
      [tx(T.F2), tx(T.F2), tx(T.F1)], t(T.tex + '=' + groupTex(T) + '=' + br(T.F2) + br(T.F1)),
      pairLine(T) + '<br>' + t(T.tex + '=' + splitTex(T)) + '<br>' + t('=' + groupTex(T)) + ' — taking out ' + t(qs) + ' changes the signs: ' + t(seg2(T) + '=' + qs + br(T.F2)) + '.<br>' + t('=' + br(T.F2) + br(T.F1)) + '<br>' + checkLine(T),
      ['The second group is ' + t(seg2(T)) + '. Taking out ' + t(qs) + ' changes the sign of <b>both</b> terms — the bracket must match ' + t(br(T.F2)) + '.', 'Then take the common bracket ' + t(br(T.F2)) + ' out of both groups.'], 'fill in decomposition ' + T.tex);
    p.bad = [[tx(wrongBr), tx(T.F2), tx(T.F1)], [tx(T.F2), tx(T.F2), tx(T.L(T.p, -T.q))], [tx(T.F2), tx(T.F2), tx(T.F2)]];
    p.good = [[tx(T.F2), tx(T.F1), tx(T.F2)]];
    return p;
  }
  /* "one factor of k(x + u)(x − v)" multiple choice (booklet Q11) */
  function oneFactorMC(r) {
    var o = null;
    for (var i = 0; i < 300 && !o; i++) { var k = r.int(2, 5), u = r.int(2, 6), v = r.int(2, 6); if (u === v || gcd(u, v) !== 1 || Math.abs(k * (u - v)) > 12 || k * u * v > 72) continue; o = { k: k, u: u, v: v }; }
    o = o || { k: 4, u: 3, v: 2 };
    var T = Tri({ p: 1, q: o.u, r: 1, s: -o.v, k: o.k }), rightPlus = r.chance(0.5);
    var R = rightPlus ? lin(1, o.u) : lin(1, -o.v), D1 = rightPlus ? lin(1, -o.u) : lin(1, o.v), D2 = lin(o.v, o.u), D3 = lin(o.v, -o.u);
    var note = 'Take out the GCF ' + t(o.k) + ' first: ' + t(T.tex + '=' + o.k + '(' + T.innerTex + ')') + '.';
    return mcPart(r, 'One factor of ' + t(T.tex) + ' is', [
      { html: t(tx(R)), right: true },
      { html: t(tx(D1)), why: note + ' Then check the signs: the two integers must multiply to ' + t(T.c) + ' and add to ' + t(T.b) + '.' },
      { html: t(tx(D2)), why: note + ' The trinomial left in the bracket starts with ' + t('x^{2}') + ', so both factors start with ' + t('x') + '.' },
      { html: t(tx(D3)), why: note + ' The trinomial left in the bracket starts with ' + t('x^{2}') + ', so both factors start with ' + t('x') + '.' }],
      note + '<br>For ' + t(T.innerTex) + ': two integers with product ' + t(T.c) + ' and sum ' + t(T.b) + ' are ' + t(o.u) + ' and ' + t(-o.v) + '.<br>So ' + t(T.tex + '=' + o.k + br(T.F1) + br(T.F2)) + ', and ' + t(tx(R)) + ' is a factor.',
      ['Look for a GCF first, then factor the trinomial that is left.'], 'one factor of ' + T.tex);
  }
  /* "common factor of two trinomials" multiple choice (booklet Q12) */
  function commonFactorMC(r) {
    var o = null;
    for (var i = 0; i < 500 && !o; i++) {
      var c0 = r.pick([-4, -3, -2, -1, 1, 2, 3, 4]), p1 = r.int(2, 3), q1 = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), p2 = r.int(2, 4), q2 = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      if (gcd(p1, q1) !== 1 || gcd(p2, q2) !== 1 || p1 === p2) continue;
      var C = lin(1, c0), P1 = PL.mul(C, lin(p1, q1)), P2 = PL.mul(C, lin(p2, q2));
      if (!PL.coef(P1, { x: 1 })[0] || !PL.coef(P2, { x: 1 })[0]) continue;
      if (Math.abs(PL.constant(P1)[0]) > 20 || Math.abs(PL.constant(P2)[0]) > 20) continue;
      // the distractors must not be factors of the other polynomial: q1/p1 and q2/p2 are not integers, and -c0 is not a root
      if (c0 === q1 / p1 || c0 === q2 / p2 || -c0 === q1 / p1 || -c0 === q2 / p2) continue;
      o = { c0: c0, p1: p1, q1: q1, p2: p2, q2: q2 };
    }
    o = o || { c0: 2, p1: 2, q1: -3, p2: 3, q2: 2 };
    var C = lin(1, o.c0), A1 = lin(o.p1, o.q1), A2 = lin(o.p2, o.q2), T1 = Tri({ p: o.p1, q: o.q1, r: 1, s: o.c0 }), T2 = Tri({ p: o.p2, q: o.q2, r: 1, s: o.c0 });
    return mcPart(r, 'The polynomials ' + t(T1.tex) + ' and ' + t(T2.tex) + ' have in common a factor of', [
      { html: t(tx(C)), right: true },
      { html: t(tx(lin(1, -o.c0))), why: 'Factor both trinomials and check the signs: ' + t(T1.tex + '=' + br(C) + br(A1)) + '.' },
      { html: t(tx(A1)), why: 'That is a factor of ' + t(T1.tex) + ' only. Factor ' + t(T2.tex) + ' too.' },
      { html: t(tx(A2)), why: 'That is a factor of ' + t(T2.tex) + ' only. Factor ' + t(T1.tex) + ' too.' }],
      t(T1.tex) + ': ' + pairLine(T1) + ' ' + t(T1.tex + '=' + splitTex(T1) + '=' + groupTex(T1) + '=' + br(C) + br(A1)) + '.<br>' + t(T2.tex) + ': ' + pairLine(T2) + ' ' + t(T2.tex + '=' + splitTex(T2) + '=' + groupTex(T2) + '=' + br(C) + br(A2)) + '.<br>The bracket in both is ' + t(tx(C)) + '.',
      ['Factor each trinomial, then look for the bracket that appears in both.'], 'common factor');
  }
  /* list every positive factor pair of n (pairs input) */
  function pairsListPart(n, prompt) {
    var want = nt.divisors(n).filter(function (d) { return d * d <= n; }).map(function (d) { return [d, n / d]; });
    var chk = function (resp) {
      resp = (resp || []).filter(function (p) { return p && (String(p[0]).trim() || String(p[1]).trim()); });
      if (!resp.length) return form('empty', 'Type the first pair, then press <b>+ Add another pair</b> for the next one.');
      var got = [], seen = {};
      for (var i = 0; i < resp.length; i++) {
        var a = readInt(resp[i][0]), b = readInt(resp[i][1]);
        if (a.res || b.res || a.bad || b.bad) return form('incomplete', 'Each pair needs a whole number in both boxes.');
        if (a.v < 0 || b.v < 0) return wrong('u4l7-pair-negative', 'List only pairs of <b>positive</b> integers here.');
        if (a.v * b.v !== n) return wrong('u4l7-pair-not-ac', t(a.v + '\\times ' + b.v + '=' + a.v * b.v) + ', not ' + t(n) + '. Every pair must multiply to ' + t(n) + '.');
        var k = Math.min(a.v, b.v) + '|' + Math.max(a.v, b.v);
        if (seen[k]) return form('duplicate', 'You listed ' + t(Math.min(a.v, b.v) + '\\times ' + Math.max(a.v, b.v)) + ' twice (the order doesn’t matter). List each pair once.');
        seen[k] = 1; got.push(k);
      }
      var miss = want.filter(function (w) { return !seen[w[0] + '|' + w[1]]; });
      if (miss.length) return wrong('u4l7-pairs-missing', 'You have ' + got.length + ' of the ' + want.length + ' pairs. Test ' + t('1, 2, 3, \\ldots') + ' in order: if it divides ' + t(n) + ', its partner is ' + t(n + '\\div') + ' that number. Stop when the pairs meet.');
      return ok();
    };
    return { prompt: prompt, input: { type: 'pairs', start: 1 }, check: chk, key: want.map(function (w) { return [String(w[0]), String(w[1])]; }), bad: [want.slice(1).map(function (w) { return [String(w[0]), String(w[1])]; }), want.map(function (w) { return [String(w[0]), String(w[1] + 1)]; }), want.map(function (w) { return [String(-w[0]), String(-w[1])]; })],
      answer: want.map(function (w) { return t(w[0] + '\\times ' + w[1]); }).join(', '),
      solution: 'Test each whole number in order until the pairs meet (at ' + t('\\sqrt{' + n + '}\\approx ' + Math.round(Math.sqrt(n) * 10) / 10) + '): ' + want.map(function (w) { return t(w[0] + '\\times ' + w[1]); }).join(', ') + ' — ' + want.length + ' pairs.',
      hints: ['Start with ' + t('1\\times ' + n) + ', then try ' + t('2') + ', ' + t('3') + ', ' + t('4') + ', … — keep each one that divides ' + t(n) + ' evenly.'], text: 'factor pairs of ' + n };
  }
  /* missing binomial in (given)(□) = trinomial */
  function missingPart(T, givenFirst) {
    var known = givenFirst ? T.F1 : T.F2, want = givenFirst ? T.F2 : T.F1;
    var wc = PL.coef(want, { x: 1 })[0], w0 = PL.constant(want)[0], kc = PL.coef(known, { x: 1 })[0], k0 = PL.constant(known)[0];
    var wr = [{ is: lin(wc, -w0), code: 'u4l7-back-sign', hint: 'Expand to check: ' + t(br(known) + br(lin(wc, -w0)) + '=' + tx(PL.mul(known, lin(wc, -w0)))) + '. The constants must multiply to ' + t(T.c) + ' — check the sign.' },
      { is: known, code: 'u4l7-back-other', hint: 'That is the factor you were given. Find the <b>other</b> one.' }];
    if (Math.abs(w0) !== Math.abs(wc) && gcd(w0, wc) === 1) wr.push({ is: lin(Math.abs(w0), (w0 < 0 ? -1 : 1) * wc), code: 'u4l7-back-swap', hint: 'The coefficient and the constant are swapped. The first terms multiply to ' + t(tx(M(T.a, { x: 2 }))) + ' and the last terms to ' + t(T.c) + '.' });
    wr = wr.filter(function (x) { return !PL.eq(x.is, want); });
    var shown = givenFirst ? br(known) + '\\big(\\square\\big)' : '\\big(\\square\\big)' + br(known);
    var p = B.poly(t(shown + '=' + T.tex), want, { wrong: wr },
      'First terms: ' + t(X(kc) + '\\times\\square=' + tx(M(T.a, { x: 2 }))) + ', so the missing first term is ' + t(X(wc)) + '. Last terms: ' + t(pn(k0) + '\\times\\square=' + T.c) + ', so the missing constant is ' + t(w0) + '.<br>Check the middle term: ' + t(givenFirst ? br(T.F1) + br(T.F2) : br(T.F1) + br(T.F2)) + ' gives ' + t(X(T.m) + (T.n < 0 ? '' : '+') + X(T.n) + '=' + X(T.b)) + ' ✓<br>The missing binomial is ' + t(tx(want)) + '.',
      ['The first terms multiply to ' + t(tx(M(T.a, { x: 2 }))) + ' and the last terms multiply to ' + t(T.c) + '.', 'Then expand to check that the middle term comes out to ' + t(X(T.b)) + '.'], 'missing binomial ' + T.tex);
    p.bad = wr.map(function (x) { return tx(x.is); });
    return p;
  }
  /* "factor where possible" with a none key (extra Q11) */
  function noneField(vars) { return [{ name: 'Factored form', label: 'Factored form', mode: 'math', keys: 'poly', vars: vars, none: true, wide: true, placeholder: 'e.g. (2x - 3)(x + 4)' }]; }
  function noneVal(resp) { var v = String((resp || [])[0] || '').trim(); return /^\\(text|mathrm)\{\s*none\s*\}$/i.test(v) ? 'none' : v; }
  var NONE_EMPTY = 'Type the factored form, or press <b>none</b> if it can’t be factored over the integers.';
  function canPart(T, prompt) {
    var base = factorPart(T, { prompt: prompt }), chk = base.check;
    return { prompt: base.prompt, input: { type: 'fields', fields: noneField(['x']) }, key: [base.key], answer: base.answer, solution: base.solution, hints: base.hints, text: base.text,
      check: function (resp) {
        var v = noneVal(resp);
        if (!v) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(v)) return wrong('said-none', 'It <b>can</b> be factored: there is a pair of integers with product ' + t('a\\times c=' + T.ac) + ' and sum ' + t(T.b) + '. ' + signHint(T.ac, T.b));
        return chk(v);
      },
      good: base.good.map(function (g) { return [g]; }), bad: [['none']].concat(base.bad.map(function (b) { return [b]; })) };
  }
  function nonePart(a, b, c, prompt) {
    var T = PL.add(M(a, { x: 2 }), M(b, { x: 1 }), N(c)), ac = a * c;
    var d = nt.divisors(Math.abs(ac)).filter(function (x) { return x * x <= Math.abs(ac); });
    var sol = t('a\\times c=' + a + '\\times ' + pn(c) + '=' + ac) + ' and ' + t('b=' + b) + '. ' + signHint(ac, b) + '<br>' + pairList(ac, b) + '<br>No pair adds to ' + t(b) + ', so ' + t(tx(T)) + ' <b>cannot be factored</b> over the integers.';
    var near = d.map(function (x) { var y = Math.abs(ac) / x, s = ac > 0 ? (b < 0 ? -1 : 1) : 1; return ac > 0 ? [s * x, s * y] : [x, -y]; }).sort(function (u, v) { return Math.abs(u[0] + u[1] - b) - Math.abs(v[0] + v[1] - b); })[0];
    return { prompt: prompt, input: { type: 'fields', fields: noneField(['x']) }, key: ['none'], answer: 'It cannot be factored over the integers.', solution: sol,
      hints: ['Find ' + t('a\\times c') + ', then list every pair of integers with that product and add each pair. Is any sum equal to ' + t(b) + '?', 'If no pair works, the trinomial cannot be factored over the integers — press <b>none</b>.'], text: 'factor where possible ' + tx(T) + ' (none)',
      check: function (resp) {
        var s = noneVal(resp);
        if (!s) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(s)) return ok();
        var a2 = K.read(s); if (a2.res) return a2.res;
        var spl = FX.split(a2.ast); if (!spl.ok) return wrong('value', null);
        var S = spl.factors.reduce(function (acc, f) { return PL.mul(acc, PL.pow(f.p, f.k)); }, N(1));
        if (PL.eq(S, T)) return form('use-none', 'That is the trinomial itself. If no pair of integers works, press <b>none</b>.');
        return wrong('no-pair', 'Your factors multiply to ' + t(tx(S)) + ', not ' + t(tx(T)) + '. Test every pair of integers with product ' + t(ac) + ': does any pair add to ' + t(b) + '?');
      },
      bad: [['(' + tx(lin(1, near[0])) + ')(' + tx(lin(1, near[1])) + ')'], [tx(T)]] };
  }
  /* every value of b (extra Q15) */
  function allBPart(r, sp) {
    var o = null;
    for (var i = 0; i < 400 && !o; i++) { var a = r.int(2, 9), c = r.int(2, 9), ac = a * c, np = npairs(ac); if (ac < sp.lo || ac > sp.hi || np < sp.np[0] || np > sp.np[1] || (sp.test && !sp.test(a, c))) continue; o = { a: a, c: c }; }
    o = o || sp.book;
    var ac = o.a * o.c, ds = nt.divisors(ac).filter(function (d) { return d * d <= ac; }), bs = ds.map(function (d) { return d + ac / d; }).filter(function (x, i, arr) { return arr.indexOf(x) === i; }).sort(function (x, y) { return x - y; });
    var vals = []; bs.forEach(function (b) { vals.push(b, -b); });
    var p = K.P.valueSet(t(o.a + 'x^{2}+bx+' + o.c) + ' — find <b>every</b> integer value of ' + t('b') + ' that makes it factorable over the integers.', vals, { v: 'b', keyTex: bs.map(function (b) { return '\\pm' + b; }).join(',\\ '), diag: function (A, Tt) {
        var miss = Tt.filter(function (x) { return A.indexOf(x) < 0; }), extra = A.filter(function (x) { return Tt.indexOf(x) < 0; });
        if (extra.length) return { code: 'ax-extra-b', hint: t('b=' + extra[0]) + ' doesn’t work: no pair of integers with product ' + t(ac) + ' adds to ' + t(extra[0]) + '.' };
        if (miss.length && miss.every(function (x) { return x < 0; })) return { code: 'ax-only-positive', hint: 'Don’t forget the <b>negative</b> pairs: two negatives also multiply to ' + t(ac) + ', and they give the opposite sums.' };
        if (miss.length) return { code: 'ax-missing-b', hint: 'You’re missing ' + (miss.length === 1 ? 'a value' : miss.length + ' values') + '. Each factor pair of ' + t(ac) + ' gives a value of ' + t('b') + ' (and its opposite).' };
        return null;
      } },
      t('a\\times c=' + o.a + '\\times ' + o.c + '=' + ac) + '. Factor pairs of ' + t(ac) + ' and their sums: ' + ds.map(function (d) { return t(d + '\\times ' + ac / d + '\\to ' + (d + ac / d)); }).join('; ') + '.<br>Each pair also works with both signs reversed, which gives the opposite sum.<br>So ' + t('b=' + bs.map(function (b) { return '\\pm' + b; }).join(',\\ ')) + ' (' + vals.length + ' values).',
      ['List every factor pair of ' + t('a\\times c=' + ac) + '. Each pair’s sum is a possible ' + t('b') + '.', 'Two negative integers also multiply to ' + t(ac) + ' — they give the opposite sums.'], 'all b for ' + o.a + 'x^2+bx+' + o.c);
    p.good = [bs.map(function (b) { return '\\pm' + b; }).join(', '), vals.map(function (b) { return 'b=' + b; }).join(', ')];
    p.bad = [bs.join(', '), bs.slice(1).map(function (b) { return '\\pm' + b; }).join(', ')];
    return p;
  }
  /* length and width at a value of x */
  function dimsPart(T, x, prompt, unit) {
    var L1 = PL.at(T.F1, { x: x }), L2 = PL.at(T.F2, { x: x }), Lg = Math.max(L1, L2), Wd = Math.min(L1, L2), lb = ['Length', 'Width'];
    var wrongSub = [PL.at(T.F1, { x: -x }), PL.at(T.F2, { x: -x })];
    var chk = function (resp) {
      resp = resp || [];
      var A = readInt(resp[0]), C = readInt(resp[1]);
      if (A.res) return lab(A.res, lb[0]); if (C.res) return lab(C.res, lb[1]);
      if (A.bad || C.bad) return wrong('value', 'Both dimensions are whole numbers here.');
      if (A.v === Lg && C.v === Wd) return ok();
      if (A.v === Wd && C.v === Lg) return form('u4l7-dims-swap', 'Right numbers — the <b>length</b> is the longer side, so put ' + t(Lg) + ' first.');
      if (A.v === Lg || A.v === Wd || C.v === Lg || C.v === Wd) return wrong('value', 'One dimension is right. Substitute ' + t('x=' + x) + ' into each bracket: ' + t(br(T.F1)) + ' and ' + t(br(T.F2)) + '.');
      if (wrongSub.indexOf(A.v) >= 0 || wrongSub.indexOf(C.v) >= 0) return wrong('u4l7-dims-sub', 'Substitute ' + t('x=' + x) + ' (not ' + t(-x) + ') into each bracket.');
      return wrong('value', 'Substitute ' + t('x=' + x) + ' into each factor: ' + t(br(T.F1)) + ' and ' + t(br(T.F2)) + '.');
    };
    var p = fieldsPart(prompt, [nbox(lb[0], unit), nbox(lb[1], unit)], chk, [String(Lg), String(Wd)], 'length ' + t(Lg) + ' ' + unit + ', width ' + t(Wd) + ' ' + unit,
      'Substitute ' + t('x=' + x) + ' into each factor: ' + t(tx(T.F1).replace(/x/g, '(' + x + ')') + '=' + L1) + ' and ' + t(tx(T.F2).replace(/x/g, '(' + x + ')') + '=' + L2) + '.<br>Length ' + t(Lg) + ' ' + unit + ', width ' + t(Wd) + ' ' + unit + '. Check: ' + t(Lg + '\\times ' + Wd + '=' + Lg * Wd) + ' and ' + t(T.a + '(' + x + ')^{2}' + sg(T.b) + '(' + x + ')' + sg(T.c) + '=' + PL.at(T.full, { x: x })) + ' ✓',
      ['Substitute ' + t('x=' + x) + ' into each of your two factors.'], 'dimensions at x=' + x);
    p.bad = [[String(Wd), String(Lg)], [String(Lg * Wd), String(Wd)]];
    return p;
  }

  HW.defineLesson({
    id: 'u4l7', unit: 4, num: '7', title: 'Factoring ax² + bx + c (where a ≠ 1)', outcome: 'AN5',
    blurb: 'Decomposition: multiply a × c, find two integers with that product and sum b, split the middle term, group in pairs, and take out the common binomial.',
    questions: [
      { num: '1', section: 'Part A — Finding the Two Integers', stem: 'For each set of values, find ' + t('a\\times c') + ', then find two integers with that product and with sum ' + t('b') + '.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return acPairPart(tri(r, { p: [2, 5], q: [1, 3], r: 1, s: [1, 6], test: function (o) { return o.ac <= 40 && o.b <= 15; }, book: { p: 2, q: 1, r: 1, s: 4 } })); } },
        { id: '1b', level: 'BEG', make: function (r) { return acPairPart(tri(r, { p: [2, 5], q: [1, 3], r: 1, s: [1, 5], test: function (o) { return o.ac <= 36 && o.b <= 15; }, book: { p: 3, q: 1, r: 1, s: 2 } })); } },
        { id: '1c', level: 'EMG', make: function (r) { return acPairPart(tri(r, { p: [2, 5], q: [-3, -1], r: 1, s: [-6, -1], test: function (o) { return o.ac <= 40 && o.b >= -15; }, book: { p: 2, q: -1, r: 1, s: -3 } })); } },
        { id: '1d', level: 'EMG', make: function (r) { return acPairPart(tri(r, { p: [2, 5], q: [-5, 5], r: 1, s: [-5, 5], test: function (o) { return o.c < 0 && o.b > 0 && o.ac >= -40; }, book: { p: 4, q: -3, r: 1, s: 1 } })); } },
        { id: '1e', level: 'EMG', make: function (r) { return acPairPart(tri(r, { p: [2, 5], q: [-5, 5], r: 1, s: [-5, 5], test: function (o) { return o.c < 0 && o.b < 0 && o.ac >= -40; }, book: { p: 3, q: 1, r: 1, s: -2 } })); } },
        { id: '1f', level: 'BEG', make: function (r) { return acPairPart(tri(r, { p: [3, 7], q: [1, 5], r: 1, s: [1, 3], test: function (o) { return o.ac <= 45 && o.b <= 15; }, book: { p: 5, q: 3, r: 1, s: 1 } })); } }] },
      { num: '2', stem: '', parts: [
        { id: '2', level: 'BEG', make: function (r) { return fillPart2(tri(r, { p: [2, 5], q: [1, 5], r: 1, s: [1, 6], test: function (o) { return o.ac <= 40 && o.m !== o.n; }, book: { p: 3, q: 2, r: 1, s: 3 } })); } }] },
      { num: '3', section: 'Part B — Decomposition with Positive Coefficients', stem: 'Factor each trinomial using decomposition.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 5], r: 1, s: [1, 5], test: function (o) { return o.b <= 15 && o.c <= 15; }, book: { p: 2, q: 3, r: 1, s: 2 } })); } },
        { id: '3b', level: 'BEG', make: function (r) { return factorPart(tri(r, { p: [2, 5], q: [1, 5], r: 1, s: [1, 6], test: function (o) { return o.b <= 20 && o.c <= 20 && o.a >= 3; }, book: { p: 3, q: 2, r: 1, s: 4 } })); } },
        { id: '3c', level: 'BEG', make: function (r) { return factorPart(tri(r, { p: { of: [4, 6] }, q: [1, 5], r: 1, s: [1, 5], test: function (o) { return o.b <= 25 && o.c <= 20; }, book: { p: 4, q: 3, r: 1, s: 2 } })); } },
        { id: '3d', level: 'BEG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 7], r: 1, s: [1, 7], test: function (o) { return o.c >= 10 && o.c <= 35 && o.b <= 25; }, book: { p: 2, q: 3, r: 1, s: 5 } })); } }] },
      { num: '4', stem: 'Factor each trinomial using decomposition.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { return factorPart(tri(r, { p: { of: [5, 7] }, q: [1, 6], r: 1, s: [1, 6], test: function (o) { return o.b <= 30 && o.c <= 20; }, book: { p: 5, q: 2, r: 1, s: 3 } })); } },
        { id: '4b', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: [2, 4], q: [1, 7], r: [2, 4], s: [1, 7], test: function (o) { return o.a <= 12 && o.ac <= 60 && o.p !== o.r; }, book: { p: 3, q: 5, r: 2, s: 1 } })); } },
        { id: '4c', level: 'EMG', make: function (r) { var p = r.pick([2, 2, 3, 4]); return factorPart(tri(r, { p: p, q: [1, 9], r: p, s: [1, 9], test: function (o) { return o.ac <= 150 && o.b <= 40; }, book: { p: 2, q: 5, r: 2, s: 3 } })); } }] },
      { num: '5', section: 'Part C — Negative b and/or c', stem: '', parts: [
        { id: '5', level: 'EMG', make: function (r) { return fillPart5(tri(r, { p: [2, 5], q: [-5, -1], r: 1, s: [-6, -1], test: function (o) { return o.ac <= 40 && o.m !== o.n; }, book: { p: 2, q: -1, r: 1, s: -3 } })); } }] },
      { num: '6', stem: 'Factor each trinomial.', parts: [
        { id: '6a', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-5, -1], r: 1, s: [-7, -1], test: function (o) { return o.ac <= 30 && o.b >= -20; }, book: { p: 2, q: -1, r: 1, s: -5 } })); } },
        { id: '6b', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: { of: [3, 5] }, q: [-4, -1], r: 1, s: [-6, -1], test: function (o) { return o.ac <= 40 && o.b >= -25; }, book: { p: 3, q: -1, r: 1, s: -4 } })); } },
        { id: '6c', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: { of: [4, 6] }, q: [-7, -1], r: 1, s: [-7, -1], test: function (o) { return o.ac <= 120 && o.b >= -40 && o.q !== -1; }, book: { p: 4, q: -3, r: 1, s: -4 } })); } }] },
      { num: '7', stem: 'Factor each trinomial.', parts: [
        { id: '7a', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 4], q: [1, 9], r: 1, s: [-5, -1], test: function (o) { return o.b > 0 && o.ac >= -90; }, book: { p: 2, q: 5, r: 1, s: -1 } })); } },
        { id: '7b', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 5], q: [1, 7], r: 1, s: [-5, -1], test: function (o) { return o.b < 0 && o.ac >= -40; }, book: { p: 3, q: 4, r: 1, s: -2 } })); } },
        { id: '7c', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-7, -1], r: 1, s: [1, 5], test: function (o) { return o.b > 0 && o.ac >= -30; }, book: { p: 2, q: -3, r: 1, s: 2 } })); } },
        { id: '7d', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [3, 7], q: [1, 3], r: 1, s: [-5, -1], test: function (o) { return o.b < 0 && o.ac >= -40; }, book: { p: 5, q: 1, r: 1, s: -2 } })); } }] },
      { num: '8', section: 'Part D — GCF First, Then Decompose', stem: 'Factor completely. Remember to remove the GCF first.', parts: [
        { id: '8a', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: 1, q: [1, 5], r: 1, s: [1, 5], monic: true, test: function (o) { return o.q !== o.s && o.b <= 8; }, book: { p: 1, q: 1, r: 1, s: 3 } }, { k: r.int(2, 5) })); } },
        { id: '8b', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: 2, q: [-7, 7], r: 1, s: [-5, 5], test: function (o) { return o.c < 0 && o.b > 0 && o.ac >= -30; }, book: { p: 2, q: -5, r: 1, s: 3 } }, { k: r.int(2, 3) })); } },
        { id: '8c', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: 3, q: [-5, 5], r: 1, s: [-5, 5], test: function (o) { return o.c < 0 && o.b > 0 && o.ac >= -30; }, book: { p: 3, q: -1, r: 1, s: 2 } }, { k: r.int(2, 3) })); } },
        { id: '8d', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: 2, q: [-7, 7], r: 1, s: [-5, 5], test: function (o) { return o.c < 0 && o.b < 0 && o.ac >= -30; }, book: { p: 2, q: 3, r: 1, s: -2 } }, { k: r.pick([2, 3, 5]) })); } }] },
      { num: '9', stem: 'Factor completely. The GCF includes a variable.', parts: [
        { id: '9a', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 5], r: 1, s: [1, 4], test: function (o) { return o.b <= 15 && o.c <= 12; }, book: { p: 2, q: 3, r: 1, s: 1 } }, { k: r.int(2, 3), gv: { x: 1 } })); } },
        { id: '9b', level: 'ADV', make: function (r) { return factorPart(tri(r, { p: 2, q: [-7, 7], r: 1, s: [-5, 5], test: function (o) { return o.c < 0 && o.b < 0 && o.ac >= -30; }, book: { p: 2, q: -5, r: 1, s: 2 } }, { k: r.int(2, 3), gv: { x: 1 } })); } }] },
      { num: '10', section: 'Part E — Applications and Review', stem: function (sh) { return 'A rectangular garden bed has area ' + t('(' + sh.T.tex + ')\\ \\text{m}^{2}') + '.'; },
        shared: function (r) { return { T: tri(r, { p: [2, 5], q: [1, 7], r: 1, s: [1, 5], test: function (o) { return o.b <= 25 && o.c <= 20; }, book: { p: 3, q: 5, r: 1, s: 2 } }), x: r.int(2, 9) }; },
        parts: [
          { id: '10a', level: 'EMG', make: function (r, sh) { var p = factorPart(sh.T, { prompt: '(a) Factor the area to find binomials representing the length and width of the bed.' }); p.solution += '<br>The bed is ' + t(br(sh.T.F1)) + ' m by ' + t(br(sh.T.F2)) + ' m.'; return p; } },
          { id: '10b', level: 'EMG', make: function (r, sh) {
            var T = sh.T, x = sh.x; if (PL.at(T.F1, { x: x }) === PL.at(T.F2, { x: x })) x = x === 9 ? 8 : x + 1;
            return dimsPart(T, x, '(b) The area factors as ' + t(br(T.F2) + br(T.F1)) + '. If ' + t('x=' + x) + ', determine the length and width of the bed, in metres.', 'm');
          } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'EMG', make: function (r) { return oneFactorMC(r); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) { return commonFactorMC(r); } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var a = r.pick([1, 3, 5, 7, 9]), b = -r.pick([1, 3, 5, 7, 9]); if (a === -b) b = a === 1 ? -3 : -1;
          var T = Tri({ p: 2, q: a, r: 2, s: b }), ans = a - b;
          return B.nr('The factored form of ' + t(T.tex) + ' is ' + t('(2x+a)(2x+b)') + ', where ' + t('a') + ' and ' + t('b') + ' are integers with ' + t('a>b') + '. The value of ' + t('a-b') + ' is ________.', ans, function (v) {
            if (v === a + b || v === -(a + b)) return { code: 'u4l7-nr-sum', hint: 'That is ' + t('a+b') + '. Subtract: ' + t('a-b') + ', and ' + t('b') + ' is negative.' };
            if (v === Math.abs(T.m - T.n)) return { code: 'u4l7-nr-pair', hint: 'Those are the decomposition integers (' + t(T.m) + ' and ' + t(T.n) + '), not ' + t('a') + ' and ' + t('b') + '. Finish factoring and read ' + t('a') + ' and ' + t('b') + ' from the brackets.' };
            if (v === a * b || v === -a * b) return { code: 'value', hint: 'That is the product ' + t('ab') + '. The question asks for ' + t('a-b') + '.' };
            return null;
          }, pairLine(T) + '<br>' + t(T.tex + '=' + splitTex(T) + '=' + groupTex(T) + '=' + br(T.F2) + br(T.F1)) + '<br>So ' + t('a=' + a) + ' and ' + t('b=' + b) + ' (since ' + t('a>b') + '), and ' + t('a-b=' + a + '-' + pn(b) + '=' + ans) + '.',
          ['Factor by decomposition, then match your answer to ' + t('(2x+a)(2x+b)') + '.', 'Subtracting a negative number adds its size.'], 'NR a-b');
        } }] },
      { num: '14', stem: '<i>(Mixed Review)</i> Factor each expression completely, using whatever method applies.', parts: [
        { id: '14a', level: 'BEG', outcome: 'AN5', make: function (r) {
          var k = r.int(2, 7), p = r.int(2, 5), q = r.int(1, 9); if (gcd(p, q) !== 1) { p = 2; q = 5; k = 3; }
          var full = PL.scale(lin(p, q), k), key = [N(k), lin(p, q)];
          var pt = B.factored(t(tx(full)), key, { gcfOnly: true, wrong: [{ is: PL.scale(lin(p, q * k), k), code: 'u4l7-gcf-part', hint: 'Divide <b>each</b> term by the GCF ' + t(k) + ': ' + t(tx(M(k * p, { x: 1 })) + '\\div ' + k + '=' + X(p)) + ' and ' + t(k * q + '\\div ' + k + '=' + q) + '.' }] },
            'The GCF of ' + t(k * p + 'x') + ' and ' + t(k * q) + ' is ' + t(k) + ': ' + t(tx(full) + '=' + k + br(lin(p, q))) + '.', ['What is the greatest number that divides both terms?'], 'GCF ' + tx(full));
          pt.bad = [tx(full), FX.tex([lin(k * p, k * q)]), FX.tex([N(k), lin(p, k * q)])];
          return pt;
        } },
        { id: '14b', level: 'BEG', make: function (r) { return factorPart(tri(r, { p: 1, q: [1, 9], r: 1, s: [1, 9], monic: true, test: function (o) { return o.q < o.s && o.c >= 6 && o.c <= 40; }, book: { p: 1, q: 3, r: 1, s: 6 } })); } },
        { id: '14c', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: 1, q: [-9, 9], r: 1, s: [-9, 9], monic: true, test: function (o) { return o.c < 0 && o.b < 0 && o.c >= -40; }, book: { p: 1, q: 3, r: 1, s: -6 } })); } },
        { id: '14d', level: 'BEG', make: function (r) {
          var n = r.int(2, 13), v = r.pick(['x', 'x', 'y']), full = PL.add(M(1, vo(v, 2)), N(-n * n)), key = [lin(1, -n, v), lin(1, n, v)];
          var pt = B.factored(t(tx(full)), key, { wrong: [{ is: PL.mul(lin(1, -n, v), lin(1, -n, v)), code: 'dsq-square', hint: t('(' + v + '-' + n + ')^{2}') + ' has a middle term. A difference of squares factors as a <b>sum times a difference</b>: ' + t('(' + v + '-' + n + ')(' + v + '+' + n + ')') + '.' }] },
            'Difference of squares: ' + t(v + '^{2}-' + n * n + '=' + v + '^{2}-' + n + '^{2}=(' + v + '-' + n + ')(' + v + '+' + n + ')') + '.', ['Both terms are perfect squares, and they are subtracted.'], 'difference of squares ' + tx(full));
          pt.bad = ['(' + v + '-' + n + ')^{2}', '(' + v + '+' + n + ')^{2}'];
          return pt;
        } },
        { id: '14e', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 5], r: 1, s: [1, 5], test: function (o) { return o.b <= 15 && o.c <= 12 && o.a === 3 || (o.a === 2 && o.c <= 12 && o.b <= 15); }, book: { p: 3, q: 4, r: 1, s: 2 } })); } },
        { id: '14f', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 4], q: [-5, -1], r: [2, 5], s: [-5, -1], test: function (o) { return o.p !== o.r && o.ac <= 100; }, book: { p: 2, q: -3, r: 3, s: -2 } })); } }] }
    ],
    extra: [
      { num: '1', section: 'Part A — The Decomposition Search with Larger Numbers', stem: function (sh) { return 'Factor ' + t(sh.T.tex) + ' by decomposition, one step at a time — this is the whole method, written out once.'; },
        shared: function (r) { return { T: tri(r, { p: [2, 4], q: [1, 7], r: [2, 5], s: [1, 7], test: function (o) { return o.ac >= 60 && o.ac <= 150 && npairs(o.ac) >= 5 && o.b <= 40 && o.p !== o.r; }, book: { p: 2, q: 5, r: 4, s: 3 } }) }; },
        parts: [
          { id: 'e1a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var T = sh.T;
            return B.number('(a) Write the value of ' + t('a\\times c') + '.', T.ac, function (v) {
              if (v === T.a + T.c) return { code: 'ax-sum-not-product', hint: 'Multiply ' + t('a') + ' and ' + t('c') + ' — don’t add them.' };
              if (v === T.a * T.b || v === T.b * T.c) return { code: 'ax-ac-wrong', hint: t('a') + ' is the coefficient of ' + t('x^{2}') + ' and ' + t('c') + ' is the constant term.' };
              return null;
            }, t('a=' + T.a) + ' and ' + t('c=' + T.c) + ', so ' + t('a\\times c=' + T.a + '\\times ' + T.c + '=' + T.ac) + '.', ['Multiply the coefficient of ' + t('x^{2}') + ' by the constant term.'], 'ac of ' + T.tex);
          } },
          { id: 'e1b1', sub: 'b list', level: 'EMG', make: function (r, sh) { return pairsListPart(sh.T.ac, 'List every pair of positive integers whose product is ' + t(sh.T.ac) + '.'); } },
          { id: 'e1b2', sub: 'b pair', level: 'BEG', make: function (r, sh) {
            var T = sh.T, p = fieldsPart('Which pair has the sum ' + t('b=' + T.b) + '?', [nbox('First integer'), nbox('Second integer')], pairCheck(T.m, T.n, T.ac, T.b), [String(T.m), String(T.n)], t(T.m) + ' and ' + t(T.n),
              pairList(T.ac, T.b) + '<br>The pair is ' + t(T.m) + ' and ' + t(T.n) + '.', ['Add the two numbers in each pair from your list.'], 'pair with sum ' + T.b);
            p.bad = [[String(T.ac), '1'], [String(-T.m), String(-T.n)]];
            return p;
          } },
          { id: 'e1c', sub: 'c', level: 'BEG', make: function (r, sh) {
            var T = sh.T, lb = ['First middle term', 'Second middle term'];
            var p = fieldsPart('(c) Use the pair to split ' + t(X(T.b)) + ': ' + t(T.tex + '=' + tx(M(T.a, { x: 2 })) + '+\\square+\\square' + sg(T.c)) + '. What are the two middle terms?', [pbox(lb[0]), pbox(lb[1])], middleCheck(T, lb),
              [X(T.m), X(T.n)], t(splitTex(T)), t(T.tex + '=' + splitTex(T)) + ' (either order is fine: ' + t(X(T.m) + '+' + X(T.n) + '=' + X(T.b)) + ').', ['Each integer of the pair becomes an ' + t('x') + '-term.'], 'split ' + T.tex);
            p.bad = [[X(T.b), '0'], [String(T.m), String(T.n)]];
            return p;
          } },
          { id: 'e1d', sub: 'd', level: 'EMG', make: function (r, sh) {
            var T = sh.T, g1 = g1Of(T), g2 = g2Of(T), lb = ['First GCF', 'Second GCF'];
            var chk = function (resp) {
              resp = resp || [];
              var A = readPoly(resp[0]), C = readPoly(resp[1]);
              if (A.res) return lab(A.res, lb[0]); if (C.res) return lab(C.res, lb[1]);
              if (!PL.eq(A.p, g1)) return wrong('value', '<b>' + lb[0] + ':</b> the GCF of ' + t(tx(M(T.a, { x: 2 })) + ' and ' + X(T.m)) + '.');
              if (!PL.eq(C.p, g2)) return wrong('value', '<b>' + lb[1] + ':</b> the GCF of ' + t(X(T.n) + ' and ' + T.c) + '. What times ' + t(br(T.F2)) + ' gives ' + t(seg2(T)) + '?');
              return ok();
            };
            var p = fieldsPart('(d) Group the four terms into two pairs and take the GCF out of each pair: ' + t(splitTex(T) + '=\\square' + br(T.F2) + '+\\square' + br(T.F2)) + '.', [pbox(lb[0]), pbox(lb[1])], chk, [tx(g1), tx(g2)], t(groupTex(T)),
              t('(' + PL.seq([M(T.a, { x: 2 }), M(T.m, { x: 1 })]) + ')+(' + seg2(T) + ')=' + groupTex(T)), ['The GCF of the first two terms comes out of the first pair; the GCF of the last two comes out of the second pair. Both brackets should match.'], 'grouping ' + T.tex);
            p.bad = [[tx(g1), tx(M(T.n, { x: 1 }))], [String(T.p), tx(g2)]];
            return p;
          } },
          { id: 'e1e', sub: 'e', level: 'EMG', make: function (r, sh) { return factorPart(sh.T, { prompt: '(e) Factor out the common binomial: write ' + t(sh.T.tex) + ' in factored form.' }); } }] },
      { num: '2', stem: 'Factor by decomposition. With ' + t('a\\times c') + ' this large, list the factor pairs of ' + t('a\\times c') + ' in order so you do not miss one.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 7], r: [2, 4], s: [1, 7], test: function (o) { return o.p !== o.r && o.ac >= 36 && o.ac <= 120; }, book: { p: 2, q: 5, r: 3, s: 2 } })); } },
        { id: 'e2b', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 5], q: [1, 7], r: [2, 5], s: [1, 7], test: function (o) { return o.p !== o.r && o.ac >= 100 && o.ac <= 200; }, book: { p: 3, q: 4, r: 4, s: 3 } })); } }] },
      { num: '3', stem: 'Factor each trinomial by decomposition.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 7], r: [3, 5], s: [1, 9], test: function (o) { return o.ac >= 100 && o.ac <= 250 && o.b <= 40; }, book: { p: 2, q: 3, r: 5, s: 7 } })); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var p = r.pick([2, 3, 3, 4, 5]); return factorPart(tri(r, { p: p, q: [1, 9], r: p, s: [1, 9], test: function (o) { return o.ac >= 30 && o.ac <= 200; }, book: { p: 3, q: 2, r: 3, s: 5 } })); } },
        { id: 'e3c', level: 'EMG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 5], r: [4, 5], s: [1, 5], test: function (o) { return o.ac >= 60 && o.ac <= 150; }, book: { p: 3, q: 2, r: 5, s: 4 } })); } }] },
      { num: '4', section: 'Part B — Negative Coefficients and a Negative Leading Term', stem: 'Factor by decomposition. Watch the signs when you choose the two integers.', parts: [
        { id: 'e4a', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 5], q: [-7, -1], r: [2, 5], s: [-7, -1], test: function (o) { return o.p !== o.r && o.ac >= 60 && o.ac <= 200; }, book: { p: 3, q: -4, r: 4, s: -3 } })); } },
        { id: 'e4b', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 7], r: [3, 6], s: [-7, -1], test: function (o) { return o.b > 0 && o.b <= 12 && o.ac <= -40 && o.ac >= -250; }, book: { p: 2, q: 3, r: 4, s: -5 } })); } }] },
      { num: '5', stem: 'Factor each trinomial by decomposition.', parts: [
        { id: 'e5a', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-7, -1], r: [2, 5], s: [-5, -1], test: function (o) { return o.p !== o.r && o.ac >= 20 && o.ac <= 120; }, book: { p: 2, q: -5, r: 3, s: -1 } })); } },
        { id: 'e5b', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-7, -1], r: [4, 5], s: [1, 9], test: function (o) { return o.b < 0 && o.b >= -9 && o.ac <= -40; }, book: { p: 2, q: -3, r: 5, s: 7 } })); } },
        { id: 'e5c', level: 'PRG', make: function (r) { var p = r.pick([2, 3, 3, 4, 5]); return factorPart(tri(r, { p: p, q: [-9, -1], r: p, s: [1, 9], test: function (o) { return o.b < 0 && o.ac >= -200; }, book: { p: 3, q: -4, r: 3, s: 1 } })); } }] },
      { num: '6', stem: 'When ' + t('a') + ' is negative, factor out ' + t('-1') + ' <b>first</b>, then decompose the trinomial that is left. Leave the ' + t('-1') + ' in front of your final answer.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 5], r: 1, s: [-6, -1], test: function (o) { return o.b < 0 && o.ac >= -40; }, book: { p: 2, q: 3, r: 1, s: -4 } }, { k: -1 })); } },
        { id: 'e6b', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-5, -1], r: [2, 5], s: [1, 7], test: function (o) { return o.p !== o.r && o.b > 0 && o.b <= 9 && o.ac >= -120; }, book: { p: 2, q: -3, r: 3, s: 5 } }, { k: -1 })); } },
        { id: 'e6c', level: 'ADV', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-7, -1], r: [2, 3], s: [-7, -1], test: function (o) { return o.ac <= 100; }, book: { p: 2, q: -3, r: 2, s: -5 } }, { k: -1 })); } }] },
      { num: '7', section: 'Part C — GCF First, Two Variables, and Higher Powers', stem: 'Factor completely. Remove the GCF before you decompose — it makes ' + t('a\\times c') + ' much smaller.', parts: [
        { id: 'e7a', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 5], r: 1, s: [1, 5], test: function (o) { return o.b <= 15; }, book: { p: 2, q: 1, r: 1, s: 3 } }, { k: r.int(2, 3) })); } },
        { id: 'e7b', level: 'ADV', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-5, 5], r: [2, 4], s: [-5, 5], test: function (o) { return o.c < 0 && o.p !== o.r && o.ac >= -60; }, book: { p: 2, q: 1, r: 3, s: -2 } }, { k: r.pick([2, 2, 3]), gv: { x: 1 } })); } }] },
      { num: '8', stem: 'Factor completely.', parts: [
        { id: 'e8a', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [3, 4], q: [-7, -1], r: 1, s: [-5, -1], test: function (o) { return o.ac <= 60; }, book: { p: 4, q: -5, r: 1, s: -2 } }, { k: 5 })); } },
        { id: 'e8b', level: 'ADV', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-7, 7], r: [2, 4], s: [-7, 7], test: function (o) { return o.c < 0 && o.b > 0 && o.p !== o.r && o.ac >= -100; }, book: { p: 2, q: 5, r: 3, s: -2 } }, { k: r.pick([2, 3, 3]), gv: { x: 1 } })); } },
        { id: 'e8c', level: 'ADV', make: function (r) {
          var A = r.int(2, 5), Bq = r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]); if (gcd(A, Bq) !== 1) { A = 5; Bq = -2; }
          return factorPart(Tri({ p: A, q: Bq, r: A, s: Bq, k: r.int(2, 3) }));
        } }] },
      { num: '9', stem: 'These trinomials contain two variables. Decomposition works exactly the same way: use ' + t('a\\times c') + ' where ' + t('c') + ' is the coefficient of ' + t('y^{2}') + ', and carry a ' + t('y') + ' along with the second pair of terms.', parts: [
        { id: 'e9a', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 5], r: [2, 4], s: [-5, -1], test: function (o) { return o.p !== o.r && o.b > 0; }, book: { p: 2, q: 3, r: 3, s: -1 } }, { w: 'y' })); } },
        { id: 'e9b', level: 'PRG', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [-3, -1], r: [3, 5], s: [-5, -1], test: function (o) { return o.ac <= 60; }, book: { p: 2, q: -1, r: 5, s: -3 } }, { w: 'y' })); } },
        { id: 'e9c', level: 'ADV', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 7], r: [3, 5], s: [-7, -1], test: function (o) { return o.b > 0 && o.ac <= -60 && o.ac >= -250; }, book: { p: 2, q: 5, r: 4, s: -5 } }, { w: 'y' })); } }] },
      { num: '10', stem: '<b>Stretch.</b> Each expression below is a trinomial in ' + t('x^{2}') + ' rather than in ' + t('x') + '. Decompose it exactly as usual, treating ' + t('x^{2}') + ' the way you normally treat ' + t('x') + '.', parts: [
        { id: 'e10a', level: 'ADV', make: function (r) { return factorPart(tri(r, { p: [2, 3], q: [1, 7], r: [2, 4], s: [-7, -1], test: function (o) { return o.p !== o.r && o.b > 0 && notDos(o.r, o.s); }, book: { p: 2, q: 3, r: 3, s: -1 } }, { e: 2 })); } },
        { id: 'e10b', level: 'ADV', make: function (r) { var p = r.pick([2, 2, 3]); return factorPart(tri(r, { p: p, q: [-9, -1], r: p, s: [1, 9], test: function (o) { return o.b < 0 && notDos(o.p, o.q); }, book: { p: 2, q: -5, r: 2, s: 1 } }, { e: 2 })); } }] },
      { num: '11', section: 'Part D — Not Factorable, Error Analysis, and Working Backwards', stem: 'Two of these trinomials factor over the integers and two do not. Factor the ones that do; for the ones that do not, press <b>none</b>. (List every integer pair with product ' + t('a\\times c') + ' to be sure.)',
        shared: function (r) { return elevenShared(r); },
        parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
          return { id: 'e11' + L, level: 'PRG', make: function (r, sh) { var it = sh.items[i], pr = '(' + L + ') ' + t(it.tex); return it.T ? canPart(it.T, pr) : nonePart(it.a, it.b, it.c, pr); } };
        }) },
      { num: '12', stem: function (sh) { var T = sh.T; return '<b>Error analysis.</b> Jordan factored ' + t(T.tex) + '. He found ' + t('a\\times c=' + T.ac) + ' and the correct pair ' + t(T.m) + ' and ' + t(T.n) + ', then wrote ' + t(T.tex + '=' + splitTex(T) + '=' + sh.stuG) + ', and concluded that the expression cannot be factored because the two binomials are different.'; },
        shared: function (r) {
          var T = tri(r, { p: [2, 3], q: [-7, -1], r: [2, 4], s: [1, 7], test: function (o) { return o.p !== o.r && o.ac >= -150; }, book: { p: 2, q: -5, r: 3, s: 4 } });
          var bad = T.L(T.r, -T.s);
          return { T: T, bad: bad, stuG: tx(g1Of(T)) + br(T.F2) + tx(g2Of(T)) + br(bad) };
        },
        parts: [
          { id: 'e12a', level: 'PRG', make: function (r, sh) {
            var T = sh.T, g2 = tx(g2Of(T)), seg = seg2(T);
            return mcPart(r, '(a) Where exactly did Jordan go wrong?', [
              { html: 'In the second group: ' + t(seg + '=' + g2 + br(T.F2)) + ', not ' + t(g2 + br(sh.bad)) + '. Dividing ' + t(T.c) + ' by ' + t(g2) + ' gives ' + t(T.s) + ' — he didn’t change that sign.', right: true },
              { html: 'The pair ' + t(T.m) + ' and ' + t(T.n) + ' is wrong.', why: 'Check: ' + t(pn(T.m) + '\\times ' + pn(T.n) + '=' + T.ac) + ' and ' + t(pn(T.m) + '+' + pn(T.n) + '=' + T.b) + '. The pair is right.' },
              { html: 'In the first group: ' + t(PL.seq([M(T.a, { x: 2 }), M(T.m, { x: 1 })])) + ' should be ' + t(tx(g1Of(T)) + br(sh.bad)) + '.', why: 'Expand ' + t(tx(g1Of(T)) + br(T.F2)) + ': it gives ' + t(PL.seq([M(T.a, { x: 2 }), M(T.m, { x: 1 })])) + '. The first group is right.' },
              { html: 'Nowhere — the brackets are different, so it really can’t be factored.', why: 'When the pair is right, the two brackets <b>always</b> match. Expand ' + t(g2 + br(sh.bad)) + ' and compare it with ' + t(seg) + '.' }],
              t(g2 + br(sh.bad) + '=' + tx(PL.mul(g2Of(T), sh.bad))) + ', which is not ' + t(seg) + '. Taking out ' + t(g2) + ' changes the sign of <b>both</b> terms: ' + t(X(T.n) + '\\div' + pn(T.q) + '=' + X(T.r)) + ' and ' + t(pn(T.c) + '\\div' + pn(T.q) + '=' + T.s) + ', so ' + t(seg + '=' + g2 + br(T.F2)) + '.',
              ['Expand each of Jordan’s groups and compare them with the four terms.'], 'Jordan error');
          } },
          { id: 'e12b', level: 'PRG', make: function (r, sh) { var T = sh.T, p = factorPart(T, { prompt: '(b) Redo the grouping correctly and give the factored form of ' + t(T.tex) + '.' }); p.bad.push(FX.tex([T.F1, sh.bad])); return p; } }] },
      { num: '13', stem: function (sh) { return '<b>Error analysis.</b> Sam skipped the GCF step and factored ' + t(sh.T.tex) + ' straight into ' + t(sh.sam) + '. When she expanded to check, she got ' + t(sh.T.tex) + ' back, so she stopped.'; },
        shared: function (r) {
          var k = r.pick([2, 2, 3]), T = tri(r, { p: 1, q: [1, 5], r: [2, 3], s: [1, 5], test: function (o) { return o.b <= 12; }, book: { p: 1, q: 3, r: 2, s: 1 } }, { k: k });
          return { T: T, k: k, sam: '(' + tx(PL.scale(T.F1, k)) + ')' + br(T.F2) };
        },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r, sh) {
            var T = sh.T, k = sh.k, kF = tx(PL.scale(T.F1, k));
            return mcPart(r, '(a) Her check really does work. Why is her answer still not acceptable?', [
              { html: t('(' + kF + ')') + ' still has a common factor of ' + t(k) + ', so it is not factored <b>completely</b>.', right: true },
              { html: 'It expands to the wrong trinomial.', why: 'It doesn’t: ' + t(sh.sam + '=' + T.tex) + '. Look inside each bracket.' },
              { html: 'The brackets are in the wrong order.', why: 'The order of the factors doesn’t matter. Look inside each bracket.' },
              { html: 'Nothing is wrong — both brackets are binomials, so it is done.', why: 'A binomial can still have a common factor: ' + t(kF + '=' + k + br(T.F1)) + '.' }],
              t(kF + '=' + k + br(T.F1)) + ', so the answer still has a common factor inside a bracket. Expanding only shows the product is right, not that it is finished.', ['Is there a number that divides both terms of one of her brackets?'], 'Sam error');
          } },
          { id: 'e13b', level: 'PRG', make: function (r, sh) {
            var T = sh.T, p = factorPart(T, { prompt: '(b) Write ' + t(T.tex) + ' in fully factored form.' });
            p.solution = 'Finish Sam’s answer: ' + t(sh.sam + '=' + sh.k + br(T.F1) + br(T.F2)) + '.<br>The intended way, GCF first:<br>' + solDecomp(T) + '<br>Both ways give the same answer.';
            p.bad.push(sh.sam);
            return p;
          } }] },
      { num: '14', stem: '<b>Work backwards.</b> Find the missing binomial in each statement. You can reason from the first and last terms and then check the middle term.', parts: [
        { id: 'e14a', level: 'ADV', make: function (r) { return missingPart(tri(r, { p: [2, 3], q: [1, 5], r: [2, 4], s: [-5, -1], test: function (o) { return o.p !== o.r && o.b > 0; }, book: { p: 2, q: 3, r: 3, s: -4 } }), true); } },
        { id: 'e14b', level: 'ADV', make: function (r) { return missingPart(tri(r, { p: [2, 4], q: [-5, -1], r: [3, 5], s: [1, 7], test: function (o) { return o.p !== o.r && o.b > 0 && o.ac >= -250; }, book: { p: 3, q: -2, r: 5, s: 7 } }), true); } },
        { id: 'e14c', level: 'ADV', make: function (r) { return missingPart(tri(r, { p: [3, 5], q: [1, 5], r: 2, s: [-7, -1], test: function (o) { return o.b < 0 && o.ac >= -250; }, book: { p: 5, q: 3, r: 2, s: -7 } }), false); } }] },
      { num: '15', stem: '<b>Work backwards.</b> List the factor pairs of ' + t('a\\times c') + '; each pair’s sum is a possible ' + t('b') + ', and each pair also works with both signs reversed.', parts: [
        { id: 'e15a', level: 'MAS', make: function (r) { return allBPart(r, { lo: 24, hi: 72, np: [4, 5], book: { a: 4, c: 9 } }); } },
        { id: 'e15b', level: 'MAS', make: function (r) { return allBPart(r, { lo: 12, hi: 40, np: [3, 4], test: function (a, c) { return a !== c; }, book: { a: 6, c: 5 } }); } }] },
      { num: '16', section: 'Part E — Applications and a Closer Look', stem: function (sh) { return 'A rectangular patio has an area of ' + t('(' + sh.T.tex + ')\\ \\text{m}^{2}') + ', and both its length and its width can be written as binomials with integer coefficients.'; },
        shared: function (r) {
          var T = tri(r, { p: [2, 3], q: [1, 5], r: [3, 5], s: [-5, -1], test: function (o) { return o.p !== o.r && o.b > 0 && o.ac >= -100; }, book: { p: 2, q: 3, r: 5, s: -2 } }), x = 6;
          for (var i = 0; i < 20; i++) { var xx = r.int(3, 8); if (PL.at(T.F2, { x: xx }) > 0 && PL.at(T.F1, { x: xx }) !== PL.at(T.F2, { x: xx })) { x = xx; break; } }
          return { T: T, x: x };
        },
        parts: [
          { id: 'e16a', level: 'PRG', make: function (r, sh) { var p = factorPart(sh.T, { prompt: '(a) Factor the area to find expressions for the length and the width.' }); p.solution += '<br>The patio is ' + t(br(sh.T.F1)) + ' m by ' + t(br(sh.T.F2)) + ' m.'; return p; } },
          { id: 'e16b', level: 'EMG', make: function (r, sh) { return dimsPart(sh.T, sh.x, '(b) The area factors as ' + t(br(sh.T.F1) + br(sh.T.F2)) + '. Determine the length and the width when ' + t('x=' + sh.x) + '.', 'm'); } },
          { id: 'e16c', level: 'EMG', make: function (r, sh) {
            var T = sh.T, x = sh.x, L1 = PL.at(T.F1, { x: x }), L2 = PL.at(T.F2, { x: x }), P = 2 * (L1 + L2);
            var p = B.number('(c) Determine the perimeter of the patio when ' + t('x=' + x) + '.', P, function (v) {
              if (v === L1 + L2) return { code: 'dims-perim', hint: 'That is one length plus one width. The perimeter goes all the way around: ' + t('P=2(l+w)') + '.' };
              if (v === L1 * L2) return { code: 'perim-area', hint: 'That is the area. The perimeter is ' + t('2(l+w)') + '.' };
              return null;
            }, 'At ' + t('x=' + x) + ' the patio is ' + t(Math.max(L1, L2)) + ' m by ' + t(Math.min(L1, L2)) + ' m.<br>' + t('P=2(' + Math.max(L1, L2) + '+' + Math.min(L1, L2) + ')=' + P) + ' m.', ['Find the length and width first, then ' + t('P=2(l+w)') + '.'], 'patio perimeter', { after: t('\\text{ m}') });
            p.bad = [String(L1 + L2), String(L1 * L2)]; return p;
          } }] },
      { num: '17', stem: '<b>Two ways to see the same thing.</b>',
        shared: function (r) { var A = r.int(2, 6), Bq = -r.int(1, 7); if (gcd(A, Bq) !== 1) { A = 2; Bq = -3; } return { T: Tri({ p: A, q: Bq, r: A, s: Bq }) }; },
        parts: [
          { id: 'e17a', level: 'PRG', make: function (r, sh) { var T = sh.T; var p = factorPart(T, { prompt: '(a) Factor ' + t(T.tex) + ' using decomposition.' }); p.bad = p.bad.concat([FX.tex([T.L(T.p, -T.q), T.L(T.p, T.q)])]); return p; } },
          { id: 'e17b', level: 'EMG', make: function (r, sh) {
            var T = sh.T;
            return mcPart(r, '(b) ' + t(T.tex + '=' + br(T.F1) + br(T.F1)) + '. Why can it be written as the square of a single binomial?', [
              { html: 'Both factors are identical, so the product is ' + t(br(T.F1) + '^{2}') + ' — this happens when the two integers in the decomposition are equal (' + t(T.m) + ' and ' + t(T.n) + ').', right: true },
              { html: 'Because every trinomial with a positive last term is a square.', why: 'Not every one: ' + t('2x^{2}+7x+3=(2x+1)(x+3)') + ' has different factors.' },
              { html: 'Because the middle term is negative.', why: 'The sign of the middle term doesn’t decide it: ' + t('2x^{2}-7x+3=(2x-1)(x-3)') + '. Look at the two factors.' },
              { html: 'Because ' + t('a\\times c') + ' is negative.', why: 'Here ' + t('a\\times c=' + T.ac) + ' is positive. Look at the two factors.' }],
              'The decomposition pair is ' + t(T.m) + ' and ' + t(T.n) + ' — the same number twice — and the two brackets come out identical: ' + t(br(T.F1) + br(T.F1) + '=' + br(T.F1) + '^{2}') + '.', ['Compare the two brackets.'], 'why a square');
          } },
          { id: 'e17c1', sub: 'c i', level: 'PRG', make: function (r) {
            var A = r.int(2, 6), Bq = r.int(1, 7); if (gcd(A, Bq) !== 1) { A = 3; Bq = 5; }
            var T = Tri({ p: A, q: Bq, r: A, s: Bq }), p = factorPart(T, { prompt: 'A trinomial ' + t('ax^{2}+bx+c') + ' is a perfect square when ' + t('a') + ' and ' + t('c') + ' are perfect squares and ' + t('b=\\pm 2\\sqrt{a}\\sqrt{c}') + '. Use that test on ' + t(T.tex) + ', then write it in squared form.' });
            p.solution = t('a=' + T.a + '=' + A + '^{2}') + ' and ' + t('c=' + T.c + '=' + Bq + '^{2}') + ', and ' + t('2(' + A + ')(' + Bq + ')=' + T.b + '=b') + ', so it is a perfect square: ' + t(T.tex + '=' + T.key) + '.';
            p.bad.push('(' + tx(lin(A, -Bq)) + ')^{2}', '(' + tx(lin(A, -Bq)) + ')(' + tx(lin(A, Bq)) + ')');
            return p;
          } },
          { id: 'e17c2', sub: 'c ii', level: 'PRG', make: function (r) {
            var A = r.int(2, 6), Bq = -r.int(1, 7); if (gcd(A, Bq) !== 1) { A = 4; Bq = -3; }
            var T = Tri({ p: A, q: Bq, r: A, s: Bq }), p = factorPart(T, { prompt: 'Use the same test on ' + t(T.tex) + ', then write it in squared form.' });
            p.solution = t('a=' + T.a + '=' + A + '^{2}') + ' and ' + t('c=' + T.c + '=' + (-Bq) + '^{2}') + ', and ' + t('-2(' + A + ')(' + (-Bq) + ')=' + T.b + '=b') + ', so it is a perfect square: ' + t(T.tex + '=' + T.key) + '.';
            p.bad.push('(' + tx(lin(A, -Bq)) + ')^{2}', '(' + tx(lin(A, -Bq)) + ')(' + tx(lin(A, Bq)) + ')');
            return p;
          } }] }
    ]
  });

  /* ---------------- helpers used above ---------------- */
  function notDos(A, Bq) { // A x² + B is not a difference of squares (so it doesn't factor further)
    var sq = function (n) { var s = Math.round(Math.sqrt(n)); return s * s === n; };
    return !(Bq < 0 && sq(A) && sq(-Bq));
  }
  function elevenShared(r) {
    var F = [], Nn = [], used = {};
    var bookF = [{ p: 2, q: 1, r: 3, s: 4 }, { p: 2, q: -3, r: 4, s: -1 }];
    for (var i = 0; i < 400 && F.length < 2; i++) {
      var o = pick(r, { p: [2, 3], q: [-5, 5], r: [2, 4], s: [-5, 5], test: function (o) { return o.p !== o.r && o.c > 0 && o.ac <= 40 && Math.abs(o.b) <= 15; }, book: bookF[F.length] });
      var T = Tri(o); if (used[T.tex]) continue; used[T.tex] = 1; F.push({ tex: T.tex, T: T });
    }
    var bookN = [[4, 5, 3], [9, -6, 5]];
    for (i = 0; i < 3000 && Nn.length < 2; i++) {
      var a = r.int(2, 9), c = r.int(1, 9), b = r.int(2, 15) * (Nn.length ? -1 : 1);
      if (gcd(gcd(a, b), c) !== 1 || hasPair(a * c, b) || a * c > 50) continue;
      var tex = tx(PL.add(M(a, { x: 2 }), M(b, { x: 1 }), N(c))); if (used[tex]) continue; used[tex] = 1; Nn.push({ tex: tex, T: null, a: a, b: b, c: c });
    }
    while (Nn.length < 2) { var bn = bookN[Nn.length]; Nn.push({ tex: tx(PL.add(M(bn[0], { x: 2 }), M(bn[1], { x: 1 }), N(bn[2]))), T: null, a: bn[0], b: bn[1], c: bn[2] }); }
    while (F.length < 2) { var T2 = Tri(bookF[F.length]); F.push({ tex: T2.tex, T: T2 }); }
    return { items: r.shuffle([Nn[0], F[0], Nn[1], F[1]]) };
  }
})(window);
