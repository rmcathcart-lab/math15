/* Math 15 · Unit 4 · Lesson 10 — Unit Review: Factoring (AN5)
 * Assignment 10 (u4_L10.tex, questions 1–24) and the Lesson 10 Extra Practice (u4_EP10.tex, questions 1–24).
 * Modelled on Math 10C u4l8. The helpers below are this lesson's own copies of the Lesson 8 factoring builders
 * (tri / dos / gcfOnly: every expression built from its factors, with classic wrong factorizations) and of the
 * Lesson 9 equation builders (Eq: k·∏(a x + b) = 0 shown factored, expanded, rearranged or as a product equal to a
 * number; solutions typed in any order with K.P.valueSet). Every part keeps the booklet question's structure and the
 * booklet's own numbers are among the possible values. Written-response and "explain" items are multiple choice,
 * chip selections or grids; "factor or say it is prime" items use one poly box with a none key.
 * Levels (Math 15): BEG one named method; EMG signs / a ≠ 1 / a zero root; PRG GCF first then a second method,
 * fraction roots; ADV three stages, expand-then-solve, negative GCF with decomposition, working backwards;
 * MAS every value of b or c (extra 16b, 17), an equation from a fraction root (extra 15b), x⁶ − 1 (extra 24). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, P = HW.poly, FA = HW.factor, ex = HW.ex, nt = HW.nt;

  /* codes reused from Math 10C and Lessons 7–9 (same meanings) */
  HW.addCodes({
    'swap-signs': 'Factor pair with both signs switched', 'pair-place': 'Numbers in the wrong brackets (middle term off)',
    'gcf-missing': 'Dropped the common factor', 'drop-var': 'Left the second variable out of the brackets',
    'dos-square': 'Wrote a difference of squares as a square', 'sum-squares': 'Factored a sum of squares as a difference',
    'sum-as-square': 'Wrote a sum of squares as a square', 'pst-as-dos': 'Wrote a perfect square as a difference of squares',
    'said-none': 'Said it does not factor (it does)', 'not-none': 'Factored something that does not factor', 'none-hint': 'Rewrote an expression that does not factor',
    'not-finished': 'Accepted an answer that is not factored completely', 'gcf-not-greatest': 'A common factor, but not the greatest', 'row': 'A row of the table wrong',
    'k-half': 'Middle coefficient not doubled', 'sol-sign-one': 'One solution has the wrong sign', 'sol-flip': 'Solved ax + b = 0 upside down',
    'ax-missing-b': 'Missing some values of b', 'ax-extra-b': 'A value of b that does not work', 'ax-only-positive': 'Left out the negative values of b',
    'dims-perim': 'Gave half the perimeter (one length + one width)', 'perim-area': 'Gave the area instead of the perimeter',
    'u4l8-gcf-missed': 'Method: missed the GCF step', 'u4l8-gcf-extra': 'Method: chose GCF when there is no common factor', 'u4l8-pst-missed': 'Method: missed the perfect square trinomial',
    'u4l8-method': 'Method: wrong method for the shape', 'u4l8-one-method': 'Method: only one of the two methods',
    'u4l9-no-divide': 'Solved ax + b = 0 as x = −b (did not divide by a)', 'u4l9-lost-zero': 'Lost the root x = 0 (divided by x)', 'u4l9-constant-root': 'Took a root from the constant factor',
    'u4l9-not-zero': 'Split a product that is not equal to 0', 'u4l9-not-rearranged': 'Factored without making one side 0', 'u4l9-pick': 'Wrong choice of root in context',
    'u4l9-eq-root-sign': 'Equation from roots: factor signs wrong', 'u4l9-eq-not-int': 'Equation from roots: fraction coefficients left', 'u4l9-check': 'Check by substitution: wrong values chosen', 'u4l9-dims': 'Dimensions wrong or in the wrong boxes'
  });
  HW.addCodes({
    'u4l10-common': 'Equation from roots: common factor not removed', 'u4l10-missing-c': 'Missing some values of c', 'u4l10-extra-c': 'A value of c that does not work',
    'u4l10-pairs': 'Integer pairs wrong or missing', 'u4l10-sub': 'Substitution slip', 'u4l10-perim': 'Perimeter not 2(l + w)'
  });
  HW.addPartial({ 'u4l10-common': 's', 'u4l10-missing-c': 's', 'u4l10-extra-c': 's', 'u4l10-pairs': 'b', 'u4l10-sub': 's', 'u4l10-perim': 'b' });

  /* ---------------- small helpers ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function M(c, v) { var o = {}; if (typeof v === 'string') { if (v) o[v] = 1; } else if (v) o = v; return P.mono(c, o); }
  function N(c) { return P.num(c); }
  function S() { return P.add.apply(null, arguments); }
  function tx(p, o) { return P.tex(p, o); }
  function lift(k) { return k == null ? N(1) : typeof k === 'number' ? N(k) : P.lift(k); }
  function isOne(p) { return P.eq(p, N(1)); }
  function lead(p) { var ts = P.sorted(p); return ts.length ? ts[0].c[0] / ts[0].c[1] : 0; }
  function msqrt(m) { var T = P.terms(m)[0], v = {}; Object.keys(T.v).forEach(function (x) { v[x] = T.v[x] / 2; }); return P.mono(Math.round(Math.sqrt(T.c[0] / T.c[1])), v); }
  function sqx(m) { var s = tx(m); return /^(\d+|[a-z])$/.test(s) ? s : '(' + s + ')'; }
  function pz(m) { return '(' + tx(m) + ')'; }
  function kpre(k) { var s = tx(k); return s === '1' ? '' : s === '-1' ? '-' : s; }
  function plain(s) { return String(s).replace(/\\left|\\right|\\,/g, '').replace(/[{}]/g, ''); }
  function lst(list) { return FA.tex(list); }
  function nn(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function hasPair(prod, sum) { var m = Math.abs(prod); if (!m) return true; for (var d = 1; d <= m; d++) if (m % d === 0) { var e = prod / d; if (d + e === sum || -d - e === sum) return true; } return false; }
  function pairs(n) { var out = [], m = Math.abs(n); for (var d = 1; d * d <= m; d++) if (m % d === 0) { if (n > 0) out.push([d, m / d]); else { out.push([d, -m / d]); if (d * d !== m) out.push([-d, m / d]); } } return out; }
  function noPairText(prod, sum) {
    var ps = pairs(prod), list = ps.map(function (p) { return t(p[0] + '\\times ' + nn(p[1])); }), sums = ps.map(function (p) { return t(p[0] + p[1]); });
    var and = function (a) { return a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; };
    return 'Product ' + t(prod) + ', sum ' + t(sum) + ': the factor ' + (ps.length === 1 ? 'pair is ' : 'pairs are ') + and(list) + (ps.length === 1 ? ', with sum ' : ', with sums ') + and(sums) +
      (prod > 0 ? ' (the negative ' + (ps.length === 1 ? 'pair gives the opposite sum' : 'pairs give the opposite sums') + ')' : '') + '. None adds to ' + t(sum) + '.';
  }
  function isSq(n) { var s = Math.round(Math.sqrt(Math.abs(n))); return n >= 0 && s * s === n; }
  var X = M(1, 'x');
  function V(n) { return M(1, n); }
  function LV(r) { return r.pick(['x', 'x', 'x', 'y', 'a', 'm']); }
  function mcPart(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }

  /* ---------------- problems built from their factors ---------------- */
  /* trinomial k·(aX + uY)(bX + vY); X a monomial (x or a block like x²), Y = 1 by default */
  function tri(o) {
    var Xm = o.X || X, Y = o.Y || N(1), k = lift(o.k), a = o.a, u = o.u, b = o.b, v = o.v;
    var f1 = S(P.scale(Xm, a), P.scale(Y, u)), f2 = S(P.scale(Xm, b), P.scale(Y, v));
    var inner = P.mul(f1, f2), expr = P.mul(k, inner), hasK = !isOne(k);
    var A = a * b, Bm = a * v + b * u, C = u * v, pst = a === b && u === v;
    var XX = P.pow(Xm, 2), XY = P.mul(Xm, Y), YY = P.pow(Y, 2);
    var list = (hasK ? [k] : []).concat(pst ? [{ p: f1, k: 2 }] : [f1, f2]);
    var tex = o.tex || tx(expr), keyTex = lst(list);
    var blk = P.degree(Xm) > 1 ? tx(Xm) : null, twoVar = P.vars(Y).length > 0;
    var L = [];
    if (hasK) L.push('<b>Step 1 — GCF:</b> every term is divisible by ' + t(tx(k)) + '. ' + t(tx(expr) + '=' + kpre(k) + '(' + tx(inner) + ')'));
    var split = P.seq([P.scale(XX, A), P.scale(XY, a * v), P.scale(XY, b * u), P.scale(YY, C)]);
    if (pst) {
      var aX = P.scale(Xm, Math.abs(a)), uY = P.scale(Y, Math.abs(u));
      L.push('<b>' + (hasK ? 'Step 2 — t' : 'T') + 'hree terms: perfect square trinomial.</b> ' + t(tx(P.scale(XX, A)) + '=' + sqx(aX) + '^{2}') + ', ' + t(tx(P.scale(YY, C)) + '=' + sqx(uY) + '^{2}') + ' and the middle term is ' +
        t(tx(P.scale(XY, Bm)) + '=' + (Bm < 0 ? '-' : '') + '2' + pz(aX) + pz(uY)) + '.');
    } else if (A === 1) {
      L.push('<b>' + (hasK ? 'Step 2 — t' : 'T') + 'hree terms, ' + t('a=1') + ': inspection.</b>' + (blk ? ' Treat ' + t(blk) + ' as one block.' : '') + ' Two integers with product ' + t(C) + ' and sum ' + t(Bm) + ': ' + t(u) + ' and ' + t(v) + '.');
    } else {
      L.push('<b>' + (hasK ? 'Step 2 — t' : 'T') + 'hree terms, ' + t('a\\neq 1') + ': decomposition.</b>' + (blk ? ' Treat ' + t(blk) + ' as one block.' : '') + ' ' + t('a\\times c=' + A + '\\times ' + nn(C) + '=' + A * C) + '; product ' + t(A * C) + ', sum ' + t(Bm) + ': ' + t(a * v) + ' and ' + t(b * u) + '.');
      var aXs = P.scale(Xm, a), uYs = P.scale(Y, u), ft = tx(f2);
      L.push(t(split + '=' + tx(aXs) + '(' + ft + ')' + (lead(uYs) > 0 ? '+' : '') + tx(uYs) + '(' + ft + ')' + '=' + lst([f2, f1])));
    }
    L.push('So ' + t(tex + '=' + keyTex) + '.');
    var W = [], pre = hasK ? [k] : [];
    var s1 = S(P.scale(Xm, a), P.scale(Y, -u)), s2 = S(P.scale(Xm, b), P.scale(Y, -v));
    if (!pst) W.push({ is: pre.concat([s1, s2]), code: 'swap-signs', hint: A === 1 ? 'Close — your two numbers multiply to ' + t(C) + ' but add to ' + t(-Bm) + ', not ' + t(Bm) + '. Switch the sign of both numbers.'
      : 'Close — the first and last terms are right, but your middle term comes out as ' + t(tx(P.scale(XY, -Bm))) + '. Switch the signs in both brackets.' });
    else W.push({ is: pre.concat([{ p: s1, k: 2 }]), code: 'swap-signs', hint: 'Check the sign inside the bracket: the middle term is ' + t(tx(P.scale(XY, Bm))) + ', so the bracket is ' + t(pz(f1)) + '.' });
    if (a !== b) W.push({ is: pre.concat([S(P.scale(Xm, a), P.scale(Y, v)), S(P.scale(Xm, b), P.scale(Y, u))]), code: 'pair-place',
      hint: 'The first and last terms are right, but the middle term isn’t. Decompose: split the middle term with two numbers that multiply to ' + t('a\\times c=' + A * C) + ' and add to ' + t(Bm) + '.' });
    if (hasK) W.push({ is: pst ? [{ p: f1, k: 2 }] : [f1, f2], code: 'gcf-missing', hint: 'Your brackets are right, but you dropped the GCF ' + t(tx(k)) + ' that you took out first. Keep it in front of the brackets.' });
    if (twoVar) W.push({ is: pre.concat([S(P.scale(Xm, a), N(u)), S(P.scale(Xm, b), N(v))]), code: 'drop-var', hint: 'Each bracket needs ' + t(tx(Y)) + ' in its second term — the last term of the trinomial is ' + t(tx(P.scale(YY, C))) + '.' });
    if (pst) W.push({ is: pre.concat([f1, S(P.scale(Xm, a), P.scale(Y, -u))]), code: 'pst-as-dos', hint: 'A sum times a difference gives a <b>difference of squares</b> — it has no middle term. This trinomial is a perfect square: the same binomial twice.' });
    var H = [];
    if (hasK) H.push('Checklist step 1: every term shares a common factor. Take out ' + t(tx(k)) + ' first.');
    if (pst) H.push('Are the first and last terms perfect squares? Is the middle term twice the product of their square roots?');
    else if (A === 1) H.push('Find two integers that multiply to ' + t(C) + ' and add to ' + t(Bm) + '.' + (blk ? ' Treat ' + t(blk) + ' as one block.' : ''));
    else H.push('Decomposition: find two integers that multiply to ' + t('a\\times c=' + A * C) + ' and add to ' + t(Bm) + ', split the middle term, then group.');
    return { expr: expr, inner: inner, k: k, hasK: hasK, f1: f1, f2: f2, tex: tex, list: list, keyTex: keyTex, sol: L.join('<br>'), wrongs: W, hints: H, text: 'factor ' + plain(tex),
      A: A, Bm: Bm, C: C, pst: pst, method: pst ? 'pst' : A === 1 ? 'insp' : 'dec' };
  }
  /* difference of squares k·(A² − B²); o.again: A and B are squares too, so A − B factors again; o.order 'asc' writes it constant first */
  function dos(o) {
    var k = lift(o.k), A = o.A, Bq = o.B, hasK = !isOne(k), pre = hasK ? [k] : [];
    var inner = P.sub(P.pow(A, 2), P.pow(Bq, 2)), expr = P.mul(k, inner), mi = P.sub(A, Bq), pl = P.add(A, Bq);
    var U, Vv, list;
    if (o.again) { U = msqrt(A); Vv = msqrt(Bq); list = pre.concat([P.sub(U, Vv), P.add(U, Vv), pl]); } else list = pre.concat([mi, pl]);
    var tex = o.tex || P.tex(expr, { order: o.order }), innerTex = P.tex(inner, { order: o.order });
    var sm = function (a, b) { return '(' + P.seq([a, P.neg(b)]) + ')'; }, sp = function (a, b) { return '(' + P.seq([a, b]) + ')'; };
    var keyTex = kpre(k) + (o.again ? sm(U, Vv) + sp(U, Vv) + sp(A, Bq) : sm(A, Bq) + sp(A, Bq));
    var L = [];
    if (hasK) L.push('<b>Step 1 — GCF:</b> every term is divisible by ' + t(tx(k)) + '. ' + t(tex + '=' + kpre(k) + '(' + innerTex + ')'));
    var aa = A, bb = Bq;
    L.push('<b>' + (hasK ? 'Step 2 — t' : 'T') + 'wo terms: difference of squares.</b> ' + t(innerTex + '=' + sqx(aa) + '^{2}-' + sqx(bb) + '^{2}') + '' + (o.order === 'asc' ? '' : '') + ', so ' + t(innerTex + '=' + sm(aa, bb) + sp(aa, bb)) + '.');
    if (o.again) {
      L.push('<b>Step 3 — check every factor:</b> ' + t(P.seq([A, P.neg(Bq)])) + ' is still a difference of squares, ' + t(sqx(U) + '^{2}-' + sqx(Vv) + '^{2}=' + sm(U, Vv) + sp(U, Vv)) + '; ' + t(P.seq([A, Bq])) + ' is a <b>sum</b> of squares, which is prime.');
    }
    L.push('So ' + t(tex + '=' + keyTex) + '.');
    var W = [];
    W.push({ is: pre.concat([{ p: mi, k: 2 }]), code: 'dos-square', hint: 'A difference of squares factors into a <b>sum times a difference</b>, ' + t('a^{2}-b^{2}=(a-b)(a+b)') + '. A square like ' + t('(a-b)^{2}') + ' would have a middle term.' });
    W.push({ is: pre.concat([{ p: pl, k: 2 }]), code: 'dos-square', hint: 'A difference of squares factors into a <b>sum times a difference</b>, ' + t('a^{2}-b^{2}=(a-b)(a+b)') + '. A square like ' + t('(a+b)^{2}') + ' would have a middle term.' });
    if (hasK) W.push({ is: o.again ? [P.sub(U, Vv), P.add(U, Vv), pl] : [mi, pl], code: 'gcf-missing', hint: 'Your brackets are right, but you dropped the GCF ' + t(tx(k)) + ' that you took out first. Keep it in front of the brackets.' });
    if (o.again) {
      W.push({ is: pre.concat([P.sub(U, Vv), P.add(U, Vv), { p: P.add(U, Vv), k: 2 }]), code: 'sum-as-square', hint: t(P.seq([A, Bq])) + ' is a <b>sum</b> of squares — it is prime. ' + t('(' + P.seq([U, Vv]) + ')^{2}') + ' would have a middle term.' });
      W.push({ is: pre.concat([P.sub(U, Vv), P.add(U, Vv), P.sub(U, Vv), P.add(U, Vv)]), code: 'sum-squares', hint: 'Only ' + t(P.seq([A, P.neg(Bq)])) + ' is a difference of squares. ' + t(P.seq([A, Bq])) + ' is a <b>sum</b> of squares and is prime.' });
    }
    var H = [];
    if (hasK) H.push('Checklist step 1: take out the GCF ' + t(tx(k)) + ' first.');
    H.push('Two perfect squares with a minus sign between them: ' + t('a^{2}-b^{2}=(a-b)(a+b)') + '.' + (o.again ? ' Then check every bracket: can it be factored again?' : ''));
    return { expr: expr, inner: inner, k: k, hasK: hasK, tex: tex, list: list, keyTex: keyTex, sol: L.join('<br>'), wrongs: W, hints: H.slice(0, 2), text: 'factor ' + plain(tex), method: 'dos', A: A, B: Bq };
  }
  /* GCF only: g·(inner), the inner polynomial does not factor */
  function gcfOnly(g, inner, tex) {
    var expr = P.mul(g, inner), list = [g, inner], keyTex = lst(list), te = tex || tx(expr);
    var terms = P.terms(expr).map(function (T) { var o = {}; o[T.key] = T; return o; });
    var L = ['<b>GCF:</b> the greatest factor every term shares is ' + t(tx(g)) + '. Divide each term by it: ' + terms.map(function (T) { return t(tx(T) + '\\div ' + sqx(g) + '=' + tx(P.terms(P.mul(T, N(1)))[0] ? divMono(T, g) : N(0))); }).join(', ') + '.', 'So ' + t(te + '=' + keyTex) + '.'];
    var W = [];
    var gt = P.terms(g)[0], gnum = Math.abs(gt.c[0]), gv = gt.v, hasV = Object.keys(gv).length;
    if (hasV && gnum > 1) W.push({ is: [N(gt.c[0]), P.mul(inner, P.mono(1, gv))], code: 'gcf-not-greatest', hint: 'A common factor, but not the <b>greatest</b>: every term also shares ' + t(tx(P.mono(1, gv))) + '.' });
    for (var d = 2; d < gnum; d++) if (gnum % d === 0) { W.push({ is: [P.mono(d, gv), P.scale(inner, gnum / d)], code: 'gcf-not-greatest', hint: 'A common factor, but not the <b>greatest</b>: the bracket still has a common factor of ' + t(gnum / d) + '.' }); break; }
    var ts = P.sorted(inner); if (ts.length === 2) { var one = {}; one[ts[1].key] = ts[1]; W.push({ is: [g, P.sub(inner, P.scale(one, 2))], code: 'sign', hint: 'Check the sign of the last term in your bracket — multiply back to check.' }); }
    return { expr: expr, inner: inner, k: g, hasK: true, tex: te, list: list, keyTex: keyTex, sol: L.join('<br>'), wrongs: W, hints: ['Find the greatest number that divides every coefficient, and the lowest power of each variable that is in every term.'], text: 'factor ' + plain(te), method: 'gcf' };
  }
  function divMono(T, g) { var a = P.terms(T)[0], b = P.terms(g)[0], v = {}; Object.keys(a.v).forEach(function (x) { var e = a.v[x] - (b.v[x] || 0); if (e) v[x] = e; }); return P.mono([a.c[0] * b.c[1], a.c[1] * b.c[0]], v); }

  /* a "factor completely" part from a problem */
  function fac(pr, o) {
    o = o || {};
    var T = pr.expr, seen = [], ws = [];
    pr.wrongs.concat(o.wrong || []).forEach(function (w) {
      if (!w) return; var p = FA.product(w.is);
      if (P.eq(p, T) || seen.some(function (q) { return P.eq(q, p); })) return;
      seen.push(p); ws.push({ is: w.is, code: w.code, hint: w.hint });
    });
    var part = B.factored(o.prompt || t(pr.tex), pr.list, { wrong: ws, keyTex: pr.keyTex }, o.sol || pr.sol, o.hints || pr.hints, o.text || pr.text);
    part.bad = ws.map(function (w) { return lst(w.is); }).concat(o.bad || []);
    part.good = [lst(pr.list.slice().reverse()), lst(pr.list)];
    return part;
  }
  /* "factor completely, or press none (prime)": pr = problem (it factors) or null with o.expr (it is prime) */
  function polyBox(vars) { return { name: 'Factored form', label: 'Factored form', mode: 'math', keys: 'poly', vars: vars, none: true, wide: true, placeholder: 'e.g. 3x(x - 4)(x + 2)' }; }
  function noneVal(s) { var v = String(s == null ? '' : s).trim(), m = /^\\(?:text|mathrm)\{\s*([a-z ]+)\s*\}$/i.exec(v); if (m) v = m[1]; return /^(none|prime)$/i.test(v.replace(/\s/g, '')) ? 'none' : String(s == null ? '' : s); }
  function fnone(pr, o) {
    o = o || {};
    var T = pr ? pr.expr : o.expr, vars = P.vars(T), chk, key, answer, ws = [];
    if (pr) {
      ws = pr.wrongs.concat(o.wrong || []).filter(function (w) { return w && !P.eq(FA.product(w.is), T); });
      var base = K.factored(pr.list, { wrong: ws });
      chk = function (s) { s = noneVal(s); if (!String(s).trim()) return form('empty', 'Type the factored form, or press <b>none</b> if it is prime.'); if (s === 'none') return wrong('said-none', 'It does factor. ' + (o.why || pr.hints[pr.hints.length - 1])); return base(s); };
      key = pr.keyTex; answer = t(pr.tex + '=' + pr.keyTex);
    } else {
      chk = function (s) {
        s = noneVal(s);
        if (!String(s).trim()) return form('empty', 'Type the factored form, or press <b>none</b> if it is prime.');
        if (s === 'none') return ok();
        var a = K.read(s); if (a.res) return a.res;
        var sp = FA.split(a.ast); if (!sp.ok) return wrong('value', null);
        var Sx = sp.factors.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, N(1));
        if (P.eq(Sx, T)) return form('none-hint', 'That’s the expression again. If no method on the checklist works, it is prime — press <b>none</b>.');
        return wrong('not-none', 'Your factors multiply to ' + t(tx(Sx)) + ', not ' + t(tx(T)) + '. ' + (o.whyNot || 'Check whether any method really works — if none does, press <b>none</b>.'));
      };
      key = 'none'; answer = 'Prime (does not factor over the integers)';
    }
    var p = B.fields(o.prompt || t(pr ? pr.tex : o.tex), [polyBox(vars.length ? vars : ['x'])], [chk], [key], answer, o.sol || pr.sol, o.hints || (pr ? pr.hints : []), o.text || (pr ? pr.text : 'factor or prime: ' + plain(o.tex)));
    p.bad = pr ? [['none']].concat(ws.map(function (w) { return [lst(w.is)]; })) : (o.bad || []).map(function (b) { return [b]; });
    p.good = pr ? [[lst(pr.list.slice().reverse())]] : [['prime']];
    return p;
  }

  /* ---------------- naming the method ---------------- */
  var MNAME = { gcf: 'GCF', dos: 'Difference of squares', pst: 'Perfect square trinomial', insp: 'Trinomial, ' + t('a=1') + ' (inspection)', dec: 'Trinomial, ' + t('a\\neq 1') + ' (decomposition)', prime: 'Prime (no method applies)' };
  var MORDER = ['gcf', 'dos', 'pst', 'insp', 'dec'];
  function methodsOf(pr) { var m = []; if (pr.hasK && pr.method !== 'gcf') m.push('gcf'); m.push(pr.method === 'gcf' ? 'gcf' : pr.method); return m; }
  function methodText(ms) { return ms.map(function (m) { return MNAME[m].replace(/<[^>]*>/g, ''); }).join(', then '); }
  function methodWhy(pr) {
    var inner = pr.hasK && pr.method !== 'gcf' ? pr.inner : pr.expr, it = tx(inner), cnt = P.count(inner), L = [];
    if (pr.method === 'gcf') return 'Step 1: every term shares ' + t(tx(pr.k)) + ', so take out the GCF: ' + t(pr.tex + '=' + pr.keyTex) + '. What is left, ' + t(pz(pr.inner)) + ', cannot be factored — so the GCF is the only method.';
    if (pr.hasK) L.push('Step 1: every term shares ' + t(tx(pr.k)) + ' — take out the GCF first, leaving ' + t(it) + '.');
    else L.push('Step 1: there is no common factor (other than 1).');
    if (pr.method === 'dos') L.push('Step 2: ' + (cnt === 2 ? 'two terms' : '') + ', both perfect squares, with a minus sign between them — <b>difference of squares</b>.');
    if (pr.method === 'pst') L.push('Step 2: three terms; the first and last are perfect squares and the middle is twice the product of their roots — <b>perfect square trinomial</b>.');
    if (pr.method === 'insp') L.push('Step 2: three terms, not a perfect square, leading coefficient ' + t('1') + ' — <b>inspection</b>.');
    if (pr.method === 'dec') L.push('Step 2: three terms, not a perfect square, leading coefficient ' + t(pr.A) + ' — <b>decomposition</b>.');
    return L.join('<br>') + '<br>(For the record: ' + t(pr.tex + '=' + pr.keyTex) + '.)';
  }
  function methodSelect(pr, prompt) {
    var want = methodsOf(pr);
    var chk = function (resp) {
      resp = resp || [];
      if (!resp.length) return form('empty', 'Tap the method (or methods) you would use.');
      var has = function (m) { return resp.indexOf(m) >= 0; }, extra = resp.filter(function (m) { return want.indexOf(m) < 0; }), miss = want.filter(function (m) { return !has(m); });
      if (!extra.length && !miss.length) return ok();
      if (miss.indexOf('gcf') >= 0 && !extra.length) return wrong('u4l8-gcf-missed', 'Checklist step 1 comes first: every term of ' + t(pr.tex) + ' shares the factor ' + t(tx(pr.k)) + '.');
      if (miss.indexOf('gcf') >= 0 && miss.length === 1) return wrong('u4l8-gcf-missed', 'Step 1 first: every term shares the factor ' + t(tx(pr.k)) + '. Take it out before you look at the shape.');
      if (extra.indexOf('gcf') >= 0 && extra.length === 1 && !miss.length) return wrong('u4l8-gcf-extra', 'There is no common factor here (other than 1) — skip step 1 and go straight to the shape.');
      if (want.indexOf('pst') >= 0 && has('insp') && !has('pst')) return wrong('u4l8-pst-missed', 'Inspection would work, but the checklist asks you to spot a <b>perfect square trinomial</b> first: are the first and last terms perfect squares?');
      if (want.length === 2 && miss.length === 1 && !extra.length) return wrong('u4l8-one-method', 'Right so far — but after the GCF comes out, what is left can still be factored. Which method does that need?');
      var m = want[want.length - 1];
      return wrong('u4l8-method', { dos: 'Count the terms: two perfect squares with a minus sign between them.', pst: 'Three terms: are the first and last perfect squares, with the middle twice their roots multiplied?', insp: 'Three terms with leading coefficient ' + t('1') + '.', dec: 'Three terms, and the leading coefficient is not ' + t('1') + '.', gcf: 'Look at what every term shares — and check whether what is left can be factored at all.' }[m]);
    };
    return { prompt: prompt || t(pr.tex), input: { type: 'select', options: MORDER.map(function (m) { return { value: m, html: MNAME[m] }; }), help: 'Tap every method you would use (GCF counts as a method). You do not need to factor.' },
      check: chk, key: want, answer: methodText(want), solution: methodWhy(pr), hints: ['Run the checklist: (1) is there a GCF? (2) count the terms that are left — 2 terms: difference of squares? 3 terms: perfect square, otherwise ' + t('a=1') + ' or ' + t('a\\neq 1') + '.'], text: 'name the method ' + plain(pr.tex),
      bad: [want.length > 1 ? want.slice(1) : want[0] === 'gcf' ? ['dos'] : ['gcf'].concat(want)] };
  }
  /* method grid: rows [{ id, html, m: [methods] }] */
  var GCOL = [{ id: 'gcf', html: 'GCF' }, { id: 'dos', html: 'diff. of<br>squares' }, { id: 'pst', html: 'perfect<br>square' }, { id: 'insp', html: t('a=1') }, { id: 'dec', html: t('a\\neq1') }, { id: 'prime', html: 'prime' }];
  function methodGrid(prompt, rows, sol, text) {
    var want = {}; rows.forEach(function (rw) { want[rw.id] = rw.m; });
    return B.grid(prompt + '<div class="w-help"><b>GCF</b> · <b>difference of squares</b> · <b>perfect square</b> trinomial · trinomial ' + t('a=1') + ' (inspection) · trinomial ' + t('a\\neq1') + ' (decomposition) · <b>prime</b> = no method applies. Tick every method a row needs.</div>',
      rows.map(function (rw) { return { id: rw.id, html: rw.html }; }), GCOL, want, {
        why: function (id, got) {
          var rw = rows.filter(function (x) { return x.id === id; })[0]; got = got || [];
          if (rw.m.indexOf('gcf') >= 0 && got.indexOf('gcf') < 0) return { code: 'u4l8-gcf-missed', hint: 'Look at ' + rw.html + ' again: every term shares a common factor — step 1 comes first.' };
          if (rw.m.indexOf('gcf') < 0 && got.indexOf('gcf') >= 0) return { code: 'u4l8-gcf-extra', hint: 'Look at ' + rw.html + ' again: it has no common factor (other than 1).' };
          return { code: 'row', hint: 'Look at ' + rw.html + ' again: ' + (rw.nudge || 'count the terms that are left after any GCF.') };
        } }, sol, ['Run the checklist on each row: (1) GCF? (2) count the terms that are left. A sum of squares, or a trinomial with no working pair, is prime.'], text);
  }

  /* ---------------- generators ---------------- */
  function val(r, x) { return typeof x === 'number' ? x : Array.isArray(x) ? r.int(x[0], x[1]) : r.pick(x.of); }
  function coprime(r, a, b, c, d, test) { for (var i = 0; i < 300; i++) { var p = r.int(a, b), q = r.int(c, d); if (gcd(p, q) === 1 && (!test || test(p, q))) return [p, q]; } return null; }
  function monic(r, sp) { // (x + u)(x + v) with constraints
    for (var i = 0; i < 500; i++) { var u = r.int(sp.u[0], sp.u[1]), v = r.int(sp.v[0], sp.v[1]); if (!u || !v || u + v === 0 || u === v) continue; if (sp.test && !sp.test(u, v)) continue; return [u, v]; }
    return sp.book;
  }
  function decPick(r, sp) { // (a x + u)(b x + v), primitive brackets
    for (var i = 0; i < 800; i++) {
      var a = val(r, sp.a), u = val(r, sp.u), b = val(r, sp.b), v = val(r, sp.v);
      if (!u || !v || gcd(a, u) !== 1 || gcd(b, v) !== 1 || a * b < 2 || (a === b && u === v) || a * v + b * u === 0) continue;
      if (sp.test && !sp.test({ a: a, u: u, b: b, v: v, A: a * b, Bm: a * v + b * u, C: u * v })) continue;
      return { a: a, u: u, b: b, v: v };
    }
    return sp.book;
  }
  function primeMonic(r, sp) { // x² + bx + c with no integer pair
    for (var i = 0; i < 800; i++) { var b = r.int(sp.b[0], sp.b[1]), c = r.int(sp.c[0], sp.c[1]); if (!b || !c || hasPair(c, b)) continue; if (sp.test && !sp.test(b, c)) continue; return [b, c]; }
    return sp.book;
  }

  /* Q1 / E1 expression makers (shared shapes) */
  function mkDos(r, lead) { var n = r.int(2, 12), aa = r.pick(lead || [1]); if (gcd(aa, n) !== 1) aa = 1; return dos({ A: M(aa, 'x'), B: N(n) }); }
  function mkInsp(r) { var uv = monic(r, { u: [1, 9], v: [1, 9], test: function (u, v) { return u * v <= 40; }, book: [2, 3] }); return tri({ a: 1, u: uv[0], b: 1, v: uv[1] }); }
  function mkGcfOnly(r) { var k = r.int(2, 6), p = r.int(1, 3), q = r.int(1, 9); if (gcd(p, q) !== 1) { p = 1; } return gcfOnly(M(k, 'x'), S(M(p, 'x'), N(q))); }
  function mkDec(r) { var o = decPick(r, { a: [2, 3], u: [1, 5], b: 1, v: [1, 5], test: function (o) { return o.Bm <= 15; }, book: { a: 2, u: 1, b: 1, v: 3 } }); return tri(o); }
  function mkPst(r) { var n = r.int(2, 12), s = r.pick([1, 1, -1]); return tri({ a: 1, u: s * n, b: 1, v: s * n }); }
  function mkGcfDos(r) { var k = r.int(2, 7), n = r.int(2, 6); return dos({ k: k, A: X, B: N(n) }); }
  function sumSqPart(a, n, prompt, v) {
    v = v || 'x'; var vv = {}; vv[v] = 2;
    var A = S(M(a * a, vv), N(n * n)), ax = a === 1 ? v : a + v;
    return fnone(null, { expr: A, tex: tx(A), prompt: prompt, bad: ['(' + ax + '+' + n + ')(' + ax + '-' + n + ')', '(' + ax + '+' + n + ')^{2}'],
      whyNot: 'A <b>sum</b> of squares matches no pattern on the checklist.',
      sol: t(tx(A) + '=(' + ax + ')^{2}+' + n + '^{2}') + ' is a <b>sum</b> of squares. There is no GCF, ' + t('(' + ax + '+' + n + ')(' + ax + '-' + n + ')=' + tx(S(M(a * a, vv), N(-n * n)))) + ' and ' + t('(' + ax + '+' + n + ')^{2}') + ' has a middle term — so it is <b>prime</b>.',
      hints: ['Is it a <b>difference</b> of squares, or a sum?', 'A sum of squares cannot be factored over the integers — press <b>none</b>.'], text: 'factor or prime: ' + tx(A) });
  }
  function primeTriPart(b, c) {
    var A = S(M(1, { x: 2 }), M(b, 'x'), N(c)), p0 = pairs(c)[0];
    return fnone(null, { expr: A, tex: tx(A), bad: ['(x+' + p0[0] + ')(x+' + p0[1] + ')'], whyNot: 'No two integers multiply to ' + t(c) + ' and add to ' + t(b) + '.',
      sol: 'No GCF; three terms, not a perfect square, ' + t('a=1') + ': try inspection. ' + noPairText(c, b) + ' So ' + t(tx(A)) + ' is <b>prime</b>.',
      hints: ['List the factor pairs of ' + t(c) + ' and add each pair.', 'If no pair adds to ' + t(b) + ', it is prime — press <b>none</b>.'], text: 'factor or prime: ' + tx(A) });
  }
  function quartic(p, q, v) {
    v = v || 'x'; var X = V(v), x2 = {}, x4 = {}; x2[v] = 2; x4[v] = 4;
    var P2 = p * p, Q2 = q * q, expr = S(M(1, x4), M(-(P2 + Q2), x2), N(P2 * Q2));
    var list = [S(X, N(-p)), S(X, N(p)), S(X, N(-q)), S(X, N(q))], tex = tx(expr), keyTex = lst(list);
    var W = [{ is: [S(M(1, x2), N(-P2)), S(M(1, x2), N(-Q2))], code: 'not-finished', hint: 'Right first pass — now step 3: ' + t(v + '^{2}-' + P2) + ' and ' + t(v + '^{2}-' + Q2) + ' are both differences of squares.' },
      { is: [S(M(1, x2), N(P2)), S(M(1, x2), N(Q2))], code: 'swap-signs', hint: 'Check the signs: the pair must add to ' + t(-(P2 + Q2)) + ', so both numbers are negative.' },
      { is: [{ p: S(X, N(-p)), k: 2 }, { p: S(X, N(-q)), k: 2 }], code: 'dos-square', hint: 'A difference of squares is a sum times a difference, not a square.' }];
    var part = B.factored(t(tex), list, { wrong: W },
      'Let ' + t('n=' + v + '^{2}') + ': ' + t('n^{2}-' + (P2 + Q2) + 'n+' + P2 * Q2) + '. Product ' + t(P2 * Q2) + ', sum ' + t(-(P2 + Q2)) + ': ' + t(-P2) + ' and ' + t(-Q2) + ', so ' + t(tex + '=(' + v + '^{2}-' + P2 + ')(' + v + '^{2}-' + Q2 + ')') + '.<br>Step 3: both brackets are differences of squares: ' + t(v + '^{2}-' + P2 + '=(' + v + '-' + p + ')(' + v + '+' + p + ')') + ' and ' + t(v + '^{2}-' + Q2 + '=(' + v + '-' + q + ')(' + v + '+' + q + ')') + '.<br>So ' + t(tex + '=' + keyTex) + '.',
      ['Treat ' + t(v + '^{2}') + ' as one variable: find two integers with product ' + t(P2 * Q2) + ' and sum ' + t(-(P2 + Q2)) + '.', 'Then check each bracket: is it a difference of squares?'], 'quartic ' + tex);
    part.bad = ['(' + v + '^{2}-' + P2 + ')(' + v + '^{2}-' + Q2 + ')', '(' + v + '^{2}+' + P2 + ')(' + v + '^{2}+' + Q2 + ')'];
    return part;
  }
  function rt(a, b) { return ex.norm(-b, a); }                  // root of a x + b
  function rv(r) { return r[0] / r[1]; }
  function rtex(r) { return ex.texRat(r); }
  function uniqR(list) { var out = []; list.forEach(function (x) { if (!out.some(function (y) { return y[0] === x[0] && y[1] === x[1]; })) out.push(x); }); return out; }

  /* An equation built from its factors: k·∏(a v + b) = 0, displayed as o.show:
   *   'factored'  k(a v + b)(…) = 0          'expanded'  P = 0
   *   'rhs'       P + R = R (o.R a polynomial; terms move across)
   *   'prod'      (given factors) = c         (o.Q: list of [a, b]; P = Q − c) */
  function Eq(o) {
    var v = o.v || 'x', V = M(1, v), k = o.k == null ? 1 : o.k;
    var lin = function (f) { return S(M(f[0], v), N(f[1])); };
    var Pp = o.fs.reduce(function (acc, f) { return P.mul(acc, lin(f)); }, N(k)), E = { v: v, k: k, fs: o.fs, P: Pp };
    E.roots = uniqR(o.fs.map(function (f) { return rt(f[0], f[1]); }));
    E.vals = E.roots.map(function (r) { return r[1] === 1 ? r[0] : r; });
    E.ptex = tx(Pp); E.ftex = (k === 1 ? '' : k === -1 ? '-' : String(k)) + o.fs.map(function (f) { var s = tx(lin(f)); return s === v ? v : '(' + s + ')'; }).join('').replace(/^(\d*)\(([a-z])\)/, '$1$2');
    if (o.fs.some(function (f) { return f[1] === 0; })) { // write the bare variable factor first, e.g. 3x(x+5)
      var bare = o.fs.filter(function (f) { return f[1] === 0; }), rest = o.fs.filter(function (f) { return f[1] !== 0; });
      E.ftex = (k === 1 ? '' : k === -1 ? '-' : String(k)) + bare.map(function (f) { return f[0] === 1 ? v : f[0] + v; }).join('') + rest.map(function (f) { return '(' + tx(lin(f)) + ')'; }).join('');
    }
    if (o.sq) E.ftex = (k === 1 ? '' : String(k)) + '(' + tx(lin(o.fs[0])) + ')^{2}';
    var show = o.show || 'expanded';
    if (show === 'factored') { E.lhs = o.ftexShow || E.ftex; E.rhs = '0'; }
    else if (show === 'expanded') { E.lhs = E.ptex; E.rhs = '0'; }
    else if (show === 'rhs') { E.R = o.R; E.lhs = o.lhsTex || tx(S(Pp, o.R)); E.rhs = o.rhsTex || tx(o.R); }
    else if (show === 'prod') { E.Q = o.Q; E.c = o.c; E.qtex = o.Q.map(function (f) { var s = tx(lin(f)); return s === v ? v : '(' + s + ')'; }).join('').replace(/^\(([a-z])\)/, '$1'); if (o.qsq) E.qtex = '(' + tx(lin(o.Q[0])) + ')^{2}'; E.lhs = E.qtex; E.rhs = String(o.c); }
    E.show = show; E.tex = E.lhs + '=' + E.rhs; E.lin = lin;
    return E;
  }
  function rootsTex(E) { return E.roots.map(function (r) { return E.v + '=' + rtex(r); }).join(',\\ '); }
  function solveLines(E, o) {
    o = o || {}; var L = [], v = E.v;
    if (E.show === 'prod') {
      var Qp = E.Q.reduce(function (acc, f) { return P.mul(acc, E.lin(f)); }, N(1));
      L.push('The product equals ' + t(E.c) + ', not ' + t('0') + ', so expand first: ' + t(E.qtex + '=' + tx(Qp)) + ', so ' + t(tx(Qp) + '=' + E.c) + '.');
      L.push('Make one side zero: ' + t(E.ptex + '=0') + '.');
    } else if (E.show === 'rhs') {
      L.push('Move every term to one side: ' + t(E.lhs + '=' + E.rhs) + ' becomes ' + t(E.ptex + '=0') + '.');
    }
    if (E.show !== 'factored') L.push('Factor' + (o.how ? ' (' + o.how + ')' : '') + ': ' + t(E.ftex + '=0') + '.');
    if (E.k !== 1) L.push('The constant ' + t(E.k) + ' is never ' + t('0') + ', so it gives no solution.');
    var parts = [];
    E.fs.forEach(function (f, i) {
      if (E.fs.slice(0, i).some(function (g) { return g[0] === f[0] && g[1] === f[1]; })) return;
      var s = tx(E.lin(f)), r = rt(f[0], f[1]);
      if (f[1] === 0) parts.push(t((f[0] === 1 ? v : f[0] + v) + '=0') + ' gives ' + t(v + '=0'));
      else if (f[0] === 1) parts.push(t(s + '=0') + ' gives ' + t(v + '=' + rtex(r)));
      else parts.push(t(s + '=0') + ' gives ' + t(f[0] + v + '=' + (-f[1])) + ', so ' + t(v + '=' + rtex(r)));
    });
    L.push('Zero product property: ' + parts.join('; ') + '.');
    if (E.sq) L.push('Both factors are the same, so there is only one solution (a double root).');
    L.push('Solutions: ' + t(rootsTex(E)) + '.');
    return L;
  }
  /* wrong-answer sets for the diagnoses */
  function diagFor(E) {
    var T = E.roots.map(rv), near = function (x, y) { return Math.abs(x - y) < 1e-9; };
    var setEq = function (A, B2) { return A.length === B2.length && A.every(function (x) { return B2.some(function (y) { return near(x, y); }); }); };
    var noDiv = uniqR(E.fs.map(function (f) { return f[1] === 0 ? [0, 1] : [-f[1], 1]; })).map(rv);
    var flip = uniqR(E.fs.map(function (f) { return f[1] === 0 ? [0, 1] : ex.norm(-f[0], f[1]); })).map(rv);
    var lostZero = T.filter(function (x) { return !near(x, 0); });
    return function (A) {
      if (E.fs.some(function (f) { return f[0] !== 1 && f[1] !== 0; }) && setEq(A, noDiv)) return { code: 'u4l9-no-divide', hint: 'Finish each small equation: for ' + t(E.fs.filter(function (f) { return f[0] !== 1 && f[1] !== 0; }).map(function (f) { return tx(E.lin(f)) + '=0'; })[0]) + ', move the constant <b>and</b> divide by the coefficient of ' + t(E.v) + '.' };
      if (E.fs.some(function (f) { return f[0] !== 1 && f[1] !== 0; }) && setEq(A, flip)) return { code: 'sol-flip', hint: 'Check your fractions: if ' + t('2' + E.v + '=3') + ' then ' + t(E.v + '=\\frac{3}{2}') + ' — divide by the coefficient of ' + t(E.v) + '.' };
      if (T.some(function (x) { return near(x, 0); }) && lostZero.length && setEq(A, lostZero)) return { code: 'u4l9-lost-zero', hint: 'You are missing a solution. The factor ' + t(E.v) + ' on its own gives ' + t(E.v + '=0') + ' — never divide both sides by ' + t(E.v) + '.' };
      if (E.k !== 1 && A.some(function (x) { return near(Math.abs(x), Math.abs(E.k)); }) && !T.some(function (x) { return near(Math.abs(x), Math.abs(E.k)); })) return { code: 'u4l9-constant-root', hint: 'The constant ' + t(E.k) + ' in front can never equal ' + t('0') + ', so it gives no solution. Only the factors containing ' + t(E.v) + ' do.' };
      if (A.length === T.length && T.length >= 2) {
        var wrongSign = A.filter(function (x) { return !T.some(function (y) { return near(x, y); }); });
        if (wrongSign.length === 1 && T.some(function (y) { return near(-wrongSign[0], y); }) && !A.some(function (x) { return near(x, -wrongSign[0]); })) return { code: 'sol-sign-one', hint: 'One solution has the wrong sign: if ' + t(E.v + '-3=0') + ' then ' + t(E.v + '=3') + ', and if ' + t(E.v + '+3=0') + ' then ' + t(E.v + '=-3') + '.' };
      }
      if (E.notZero && setEq(A, E.notZero)) return { code: 'u4l9-not-zero', hint: 'The zero product property only works when the product equals ' + t('0') + '. Expand, move ' + t(E.c) + ' across so one side is ' + t('0') + ', then factor again.' };
      if (E.unrearranged && setEq(A, E.unrearranged)) return { code: 'u4l9-not-rearranged', hint: 'Move every term to one side first, so the equation equals ' + t('0') + ' — then factor.' };
      return null;
    };
  }
  function solvePart(E, o) {
    o = o || {};
    var p = K.P.valueSet(o.prompt || t(E.tex), E.vals, { v: E.v, diag: diagFor(E) }, o.sol || solveLines(E, o).join('<br>'), o.hints || hintsFor(E, o), o.text || 'solve ' + E.tex);
    var bad = [], T = E.roots, key = T.map(rv).sort().join('|');
    var add = function (rs) { rs = uniqR(rs); if (rs.map(rv).sort().join('|') !== key) bad.push(rs.map(function (x) { return E.v + '=' + rtex(x); }).join(', ')); };
    if (T.length > 1) add([T[0]]); // one solution only
    add(T.map(function (x) { return [-x[0], x[1]]; }));
    if (E.fs.some(function (f) { return f[0] !== 1 && f[1] !== 0; })) add(E.fs.map(function (f) { return [f[1] === 0 ? 0 : -f[1], 1]; }));
    if (E.notZero) add(E.notZero.map(function (x) { return ex.norm(Math.round(x * 2), 2); }));
    if (T.some(function (x) { return x[0] === 0; }) && T.length > 1) add(T.filter(function (x) { return x[0] !== 0; }));
    if (E.k !== 1 && E.k > 0) add(T.concat([[E.k, 1]]));
    p.bad = bad;
    p.good = [T.map(function (r) { return rtex(r); }).reverse().join(', '), T.map(function (r) { return E.v + '=' + rtex(r); }).join('\\text{ or }')];
    return p;
  }
  function hintsFor(E, o) {
    var h = [];
    if (E.show === 'prod') h.push('The product is ' + t(E.c) + ', not ' + t('0') + '. Expand the left side and move ' + t(E.c) + ' across first.');
    else if (E.show === 'rhs') h.push('Move every term to the left side so the right side is ' + t('0') + '.');
    else if (E.show === 'expanded') h.push('Factor the left side completely' + (o && o.how ? ' (' + o.how + ')' : '') + '.');
    h.push('Set each factor that contains ' + t(E.v) + ' equal to ' + t('0') + ' and solve.');
    return h.slice(0, 2);
  }
  /* "which of these values satisfy the original equation?" (check by substitution) */
  function checkPart(r, E, prompt) {
    var cands = E.roots.slice();
    E.roots.forEach(function (x) { var n = [-x[0], x[1]]; if (!cands.some(function (y) { return y[0] === n[0] && y[1] === n[1]; })) cands.push(n); });
    if (cands.length < 4) { var extra = [E.roots[0][0] + E.roots[0][1], E.roots[0][1]]; extra = ex.norm(extra[0], extra[1]); if (!cands.some(function (y) { return y[0] === extra[0] && y[1] === extra[1]; })) cands.push(extra); }
    var shuffled = r.shuffle(cands), key = E.roots.map(rtex);
    var lhsAt = function (x) { return evalTex(E, x); };
    var lines = cands.map(function (x) { var good = E.roots.some(function (y) { return y[0] === x[0] && y[1] === x[1]; }); return t(E.v + '=' + rtex(x)) + ': ' + lhsAt(x) + (good ? ' ✓' : ' ✗'); });
    var chk = K.selectSet(key, function (extra, miss) {
      if (extra.length) return { code: 'u4l9-check', hint: 'Substitute ' + t(E.v + '=' + extra[0]) + ' into the <b>original</b> equation: ' + lhsAt(texToRat(extra[0])) + '.' };
      return { code: 'u4l9-check', hint: 'One of the values you left out also works — substitute it into the original equation.' };
    });
    return { prompt: prompt || 'Check by substitution: which of these values satisfy ' + t(E.tex) + '? Tap every one that works.', input: { type: 'select', options: shuffled.map(function (x) { return { value: rtex(x), html: t(E.v + '=' + rtex(x)) }; }), help: 'Substitute each value into the <b>original</b> equation. Tap every one that makes it true.' },
      check: chk, key: key, answer: t(key.map(function (s) { return E.v + '=' + s; }).join(',\\ ')), solution: 'Substitute each value into the original equation:<br>' + lines.join('<br>'),
      hints: ['Substitute each value into the left side and compare it with the right side, ' + t(E.rhs) + '.'], text: 'check ' + E.tex, bad: [cands.filter(function (x) { return !E.roots.some(function (y) { return y[0] === x[0] && y[1] === x[1]; }); }).map(rtex), [key[0]]] };
  }
  function texToRat(s) { var m = /^(-?)\\frac\{(\d+)\}\{(\d+)\}$/.exec(s); if (m) return [(m[1] ? -1 : 1) * Number(m[2]), Number(m[3])]; return [Number(s), 1]; }
  /* the original equation with a value substituted: "(4)^2 − 2(4) = 16 − 8 = 8 = 8 ✓" (integers only; fractions shown as a value) */
  function evalTex(E, x) {
    var xv = rv(x), lhsP = E.show === 'prod' ? E.Q.reduce(function (acc, f) { return P.mul(acc, E.lin(f)); }, N(1)) : E.show === 'rhs' ? S(E.P, E.R) : E.P;
    var rhsV = E.show === 'prod' ? E.c : E.show === 'rhs' ? P.at(E.R, valEnv(E, xv)) : 0, lhsV = P.at(lhsP, valEnv(E, xv));
    var shown = rtex(x), sub = function (s) { return s.replace(new RegExp(E.v, 'g'), '(' + shown + ')'); };
    var L = E.show === 'prod' ? sub(E.qtex) : sub(E.lhs), R = E.show === 'rhs' ? sub(E.rhs) : E.rhs;
    var lv = Math.round(lhsV * 1e9) / 1e9, rvv = Math.round(rhsV * 1e9) / 1e9;
    return t(L + '=' + fmtNum(lv)) + (E.show === 'rhs' && /[a-z]/.test(E.rhs) ? ' and ' + t(R + '=' + fmtNum(rvv)) : '') + (Math.abs(lv - rvv) < 1e-9 ? ' — equal' : ' — not ' + t(fmtNum(rvv)));
  }
  function valEnv(E, xv) { var o = {}; o[E.v] = xv; return o; }
  function fmtNum(x) { if (Math.abs(x - Math.round(x)) < 1e-9) return String(Math.round(x)); for (var q = 2; q <= 64; q++) { var p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return ex.texRat(ex.norm(Math.round(p), q)); } return String(x); }

  function two(r, lo, hi, test) { for (var i = 0; i < 400; i++) { var a = r.int(lo[0], lo[1]), b = r.int(hi[0], hi[1]); if (a && b && a !== b && (!test || test(a, b))) return [a, b]; } return null; }
  function monicEq(r, sp, extra) { var ab = two(r, sp.a, sp.b, sp.test) || sp.book; return Eq(Object.assign({ fs: [[1, -ab[0]], [1, -ab[1]]] }, extra || {})); } // roots ab[0], ab[1]
  function decEq(r, sp, extra) { // (a x + b)(c x + d): primitive brackets, at least one a ≠ 1
    for (var i = 0; i < 800; i++) {
      var a = val(r, sp.a), b = val(r, sp.b), c = val(r, sp.c), d = val(r, sp.d);
      if (!b || !d || gcd(a, b) !== 1 || gcd(c, d) !== 1 || (a === c && b === d) || a * d + b * c === 0) continue;
      if (sp.test && !sp.test({ a: a, b: b, c: c, d: d, A: a * c, Bm: a * d + b * c, C: b * d })) continue;
      return Eq(Object.assign({ fs: [[a, b], [c, d]] }, extra || {}));
    }
    return Eq(Object.assign({ fs: sp.book }, extra || {}));
  }
  function moveRight(E, which) { // which: 'c' (constant across), 'bc' (x term and constant across), 'x' (x-term across)
    var ts = P.terms(E.P), R = N(0);
    ts.forEach(function (T) { var deg = Object.keys(T.v).reduce(function (s, x) { return s + T.v[x]; }, 0); var o = {}; o[T.key] = T; if ((which === 'c' && deg === 0) || (which === 'bc' && deg <= 1) || (which === 'x' && deg === 1)) R = P.sub(R, o); });
    return R;
  }
  function rhsEq(E, which) { var R = moveRight(E, which); var F = Eq({ fs: E.fs, k: E.k, v: E.v, show: 'rhs', R: R, sq: E.sq }); F.sq = E.sq; F.unrearranged = null; return F; }

  function sqEq(n, v) { var E = Eq({ v: v, fs: [[1, n], [1, n]], sq: true }); E.sq = true; return E; }
  function quarticSol(p, q, v) {
    v = v || 'x'; var P2 = p * p, Q2 = q * q;
    return 'Treat ' + t(v + '^{2}') + ' as one variable: two integers with product ' + t(P2 * Q2) + ' and sum ' + t(-(P2 + Q2)) + ' are ' + t(-P2) + ' and ' + t(-Q2) + ', so ' + t('(' + v + '^{2}-' + P2 + ')(' + v + '^{2}-' + Q2 + ')=0') + '.<br>Each bracket is a difference of squares: ' + t('(' + v + '-' + p + ')(' + v + '+' + p + ')(' + v + '-' + q + ')(' + v + '+' + q + ')=0') + '.<br>Solutions: ' + t(v + '=\\pm' + p + ',\\ ' + v + '=\\pm' + q) + '.';
  }
  /* a product equal to a number: (x + q1)(x + q2) = c whose rearranged form factors nicely */
  function prodEq(r, sp) {
    for (var i = 0; i < 2000; i++) {
      var q1, q2, c;
      if (sp.mono) { q1 = 0; q2 = r.int(-9, 9); } else if (sp.sq) { q1 = q2 = r.int(-6, 6); } else { q1 = r.int(-9, 9); q2 = r.int(-9, 9); }
      if (!sp.mono && !sp.sq && (!q1 || !q2 || q1 === q2)) continue; if (sp.mono && !q2) continue;
      c = sp.sq ? r.pick([4, 9, 16, 25, 36, 49, 64]) : r.int(2, 30) * (r.chance(0.8) ? 1 : -1);
      var B1 = q1 + q2, C1 = q1 * q2 - c, disc = B1 * B1 - 4 * C1; if (disc <= 0) continue;
      var s = Math.round(Math.sqrt(disc)); if (s * s !== disc || (B1 + s) % 2) continue;
      var r1 = (-B1 + s) / 2, r2 = (-B1 - s) / 2; if (!r1 || !r2 || r1 === r2 || Math.abs(r1) > 15 || Math.abs(r2) > 15) continue;
      // the student's "split" values must not both be roots, and the original factors must not already vanish at the roots
      var E = Eq({ fs: [[1, -r1], [1, -r2]], show: 'prod', Q: [[1, q1], [1, q2]], c: c, qsq: sp.sq });
      E.notZero = uniqR([[c - q1, 1], [c - q2, 1]]).map(rv);
      return E;
    }
    var b = sp.book, q1b = b.q[0], q2b = b.q[1], cb = b.c, B1b = q1b + q2b, C1b = q1b * q2b - cb, sb = Math.round(Math.sqrt(B1b * B1b - 4 * C1b));
    var Eb = Eq({ fs: [[1, -(-B1b + sb) / 2], [1, -(-B1b - sb) / 2]], show: 'prod', Q: [[1, q1b], [1, q2b]], c: cb, qsq: sp.sq }); Eb.notZero = uniqR([[cb - q1b, 1], [cb - q2b, 1]]).map(rv); return Eb;
  }
  /* (2x + 1)(x − 3) = −6 style: a non-monic product whose rearranged form factors nicely */
  function twoNums(a, b, labels, prompt, sol, rejectVals) {
    var chk = function (resp) {
      resp = resp || [];
      var A = K.read(resp[0] == null ? '' : resp[0]), C = K.read(resp[1] == null ? '' : resp[1]);
      if (A.res) return { v: A.res.v, code: A.res.code, hint: '<b>' + labels[0] + ':</b> ' + A.res.hint }; if (C.res) return { v: C.res.v, code: C.res.code, hint: '<b>' + labels[1] + ':</b> ' + C.res.hint };
      if (A.val === a && C.val === b) return ok();
      if (A.val === b && C.val === a) return form('u4l9-dims', 'Right numbers — check which box each one goes in.');
      if ((rejectVals || []).some(function (x) { return Math.abs(A.val - x) < 1e-9 || Math.abs(C.val - x) < 1e-9; })) return wrong('u4l9-pick', 'You used the root that has to be rejected (it is negative). Use the positive root.');
      return wrong('u4l9-dims', 'Use the positive root, then work out the other quantity from it.');
    };
    var p = B.fields(prompt, labels.map(function (l) { return { name: l, label: l }; }), [chk, function () { return ok(); }], [String(a), String(b)], labels[0] + ' ' + t(a) + ', ' + labels[1].toLowerCase() + ' ' + t(b), sol, ['Reject the root that doesn’t make sense here, then use the other one.'], 'two values');
    p.check = chk; p.bad = [[String(rejectVals[0]), String(rejectVals[1])]];
    return p;
  }
  /* build a quadratic equation from its roots; any non-zero integer multiple is accepted */
  function buildEqPart(fs, rootsTex) {
    var E = Eq({ fs: fs }), T = E.P, tex = E.ptex;
    var wrongSign = fs.reduce(function (acc, f) { return P.mul(acc, S(M(f[0], 'x'), N(-f[1]))); }, N(1));
    var chk = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/=\s*0\s*$/, '');
      var a = K.read(s); if (a.res) return a.res;
      var rd = P.read(a.ast); if (!rd.ok) return wrong('value', null);
      var S2 = rd.p, ts = P.terms(T), lead = P.lead(T, 'x'), sl = P.lead(S2, 'x');
      if (!sl[0]) return wrong('value', null);
      var ratio = [sl[0] * lead[1], sl[1] * lead[0]], scaled = P.scale(T, ratio);
      if (P.eq(scaled, S2)) {
        if (P.terms(S2).some(function (x) { return x.c[1] !== 1; })) return wrong('u4l9-eq-not-int', 'Right roots — now clear the fractions: multiply every term by the denominator so all the coefficients are integers.');
        var fi = P.formIssue(a.ast); if (fi) return form(fi.code, fi.msg || 'Expand it fully (no brackets).');
        return ok();
      }
      if (P.eq(P.scale(wrongSign, ratio), S2)) return wrong('u4l9-eq-root-sign', 'Your equation has roots with the opposite signs. A root ' + t('x=r') + ' gives the factor ' + t('(x-r)') + ': the sign changes.');
      return wrong('value', 'Write a factor for each root, multiply them, and expand. Check: substitute each root — it should give ' + t('0') + '.');
    };
    var facTex = fs.map(function (f) { return f[1] === 0 ? (f[0] === 1 ? 'x' : f[0] + 'x') : '(' + tx(S(M(f[0], 'x'), N(f[1]))) + ')'; }).join('');
    return { prompt: rootsTex + ': build the equation.', input: { type: 'math', keys: 'poly', vars: ['x'], after: t('=0'), placeholder: 'e.g. x^2 - 2x - 15' }, check: chk, key: tex, answer: t(tex + '=0') + ' (or any non-zero integer multiple of it)',
      solution: 'Each root gives a factor: ' + fs.map(function (f) { var r = rt(f[0], f[1]); return t('x=' + rtex(r)) + ' → ' + t(f[1] === 0 ? 'x' : '(' + tx(S(M(f[0], 'x'), N(f[1]))) + ')'); }).join(', ') + (fs.some(function (f) { return f[0] !== 1; }) ? ' (the factor ' + t('(' + tx(S(M(fs[0][0], 'x'), N(fs[0][1]))) + ')') + ' clears the fraction)' : '') + '.<br>' + t(facTex + '=0') + ', so ' + t(tex + '=0') + '.',
      hints: ['If ' + t('x=r') + ' is a root, ' + t('(x-r)') + ' is a factor. For a fraction root like ' + t('x=\\frac{1}{2}') + ', use ' + t('(2x-1)') + '.', 'Multiply the factors and expand.'], text: 'equation from ' + rootsTex,
      bad: (P.eq(wrongSign, T) ? [] : [tx(wrongSign)]).concat([facTex]), good: [tx(P.scale(T, 2)), tex + '=0', tx(P.scale(T, -1))] };
  }

  /* ---------------- Lesson 10 makers ---------------- */
  function itemPart(it, prompt) {
    if (it.prime) return it.kind === 'sum' ? sumSqPart(it.a, it.n, prompt) : primeTri2(it, prompt);
    return fnone(it.pr, { prompt: prompt });
  }
  function primeTri2(it, prompt) { // a x² + b x + c with no pair (a may be > 1)
    var A = S(M(it.a, { x: 2 }), M(it.b, 'x'), N(it.c)), ac = it.a * it.c;
    return fnone(null, { expr: A, tex: tx(A), prompt: prompt, bad: [tx(A)], whyNot: 'No two integers multiply to ' + t(ac) + ' and add to ' + t(it.b) + '.',
      sol: 'No GCF; three terms, not a perfect square' + (it.a === 1 ? ', ' + t('a=1') + ': inspection. ' : ': decomposition, ' + t('a\\times c=' + ac) + '. ') + noPairText(ac, it.b) + ' So ' + t(tx(A)) + ' is <b>prime</b>.',
      hints: ['List the factor pairs of ' + t(ac) + ' and add each pair.', 'If no pair adds to ' + t(it.b) + ', it is prime — press <b>none</b>.'], text: 'factor or prime: ' + tx(A) });
  }
  function gridOf(items, prompt) {
    var rows = items.map(function (it, i) { var L = 'abcdef'.charAt(i); return { id: L, html: '(' + L + ') ' + t(it.tex), m: it.prime ? ['prime'] : methodsOf(it.pr).filter(function (m, j, arr) { return arr.indexOf(m) === j; }), nudge: it.nudge }; });
    var sol = rows.map(function (rw, i) { var it = items[i]; return rw.html + ': ' + (it.prime ? '<b>prime</b> — ' + (it.kind === 'sum' ? 'a sum of squares' : 'no factor pair works') : '<b>' + methodText(rw.m) + '</b> — ' + t(it.pr.keyTex)); }).join('<br>');
    var p = methodGrid(prompt, rows, sol, 'name strategies');
    p.bad = [rows.reduce(function (o, rw) { o[rw.id] = rw.m.indexOf('gcf') >= 0 && rw.m.length > 1 ? rw.m.filter(function (m) { return m !== 'gcf'; }) : rw.m[0] === 'prime' ? ['insp'] : rw.m; return o; }, {})];
    return p;
  }
  function allBPart(r, sp) {
    var o = null;
    for (var i = 0; i < 400 && !o; i++) { var a = r.int(2, 7), c = r.int(2, 9), ac = a * c, np = Math.ceil(nt.numDivisors(ac) / 2); if (gcd(a, c) !== 1 || ac < sp.lo || ac > sp.hi || np < sp.np[0] || np > sp.np[1]) continue; o = { a: a, c: c }; }
    o = o || sp.book;
    var ac = o.a * o.c, ds = nt.divisors(ac).filter(function (d) { return d * d <= ac; }), bs = ds.map(function (d) { return d + ac / d; }).filter(function (x, i, arr) { return arr.indexOf(x) === i; }).sort(function (x, y) { return x - y; });
    var vals = []; bs.forEach(function (b) { vals.push(b, -b); });
    var p = K.P.valueSet('Determine <b>every</b> integer value of ' + t('b') + ' for which ' + t(o.a + 'x^{2}+bx+' + o.c) + ' can be factored over the integers.', vals, { v: 'b', keyTex: bs.map(function (b) { return '\\pm' + b; }).join(',\\ '), diag: function (A, Tt) {
        var miss = Tt.filter(function (x) { return A.indexOf(x) < 0; }), extra = A.filter(function (x) { return Tt.indexOf(x) < 0; });
        if (extra.length) return { code: 'ax-extra-b', hint: t('b=' + extra[0]) + ' doesn’t work: no pair of integers with product ' + t(ac) + ' adds to ' + t(extra[0]) + '.' };
        if (miss.length && miss.every(function (x) { return x < 0; })) return { code: 'ax-only-positive', hint: 'Don’t forget the <b>negative</b> pairs: two negatives also multiply to ' + t(ac) + ', and they give the opposite sums.' };
        if (miss.length) return { code: 'ax-missing-b', hint: 'You’re missing ' + (miss.length === 1 ? 'a value' : miss.length + ' values') + '. Each factor pair of ' + t(ac) + ' gives a value of ' + t('b') + ' (and its opposite).' };
        return null;
      } },
      t('a\\times c=' + o.a + '\\times ' + o.c + '=' + ac) + '. Factor pairs of ' + t(ac) + ' and their sums: ' + ds.map(function (d) { return t(d + '\\times ' + ac / d + '\\to ' + (d + ac / d)); }).join('; ') + '. Each pair also works with both signs reversed (the opposite sum).<br>So ' + t('b=' + bs.map(function (b) { return '\\pm' + b; }).join(',\\ ')) + ': ' +
        bs.map(function (b) { var T = decFor(o.a, b, o.c); return T ? t(o.a + 'x^{2}+' + b + 'x+' + o.c + '=' + T) : ''; }).filter(Boolean).join(', ') + ', and the same with every sign of ' + t('b') + ' and of the constants reversed.<br>The list is complete because every factorization comes from a factor pair of ' + t(ac) + ', and there are no others.',
      ['List every factor pair of ' + t('a\\times c=' + ac) + '. Each pair’s sum is a possible ' + t('b') + '.', 'Two negative integers also multiply to ' + t(ac) + ' — they give the opposite sums.'], 'all b for ' + o.a + 'x^2+bx+' + o.c);
    p.good = [bs.map(function (b) { return '\\pm' + b; }).join(', '), vals.map(function (b) { return 'b=' + b; }).join(', ')];
    p.bad = [bs.join(', '), bs.slice(1).map(function (b) { return '\\pm' + b; }).join(', ')];
    return p;
  }
  function decFor(a, b, c) { // factored form of a x² + b x + c (integers), via HW.factor on a found pair
    for (var p = 1; p <= a; p++) if (a % p === 0) { var q = a / p; for (var u = -Math.abs(c); u <= Math.abs(c); u++) if (u && c % u === 0) { var v = c / u; if (p * v + q * u === b) return lst([S(M(p, 'x'), N(u)), S(M(q, 'x'), N(v))]); } }
    return null;
  }
  function allCPart(r) {
    var b = r.pick([6, 8, 10, 10, 12, 14, 16]), v = LV(r), cs = [];
    for (var m = 1; m <= b / 2; m++) cs.push(m * (b - m));
    var p = K.P.valueSet('(b) List <b>every</b> natural number ' + t('c') + ' for which ' + t(v + '^{2}+' + b + v + '+c') + ' factors over the integers.', cs, { v: 'c', keyTex: cs.join(',\\ '), diag: function (A, Tt) {
        var miss = Tt.filter(function (x) { return A.indexOf(x) < 0; }), extra = A.filter(function (x) { return Tt.indexOf(x) < 0; });
        if (extra.length) return { code: 'u4l10-extra-c', hint: t('c=' + extra[0]) + ' doesn’t work: no two natural numbers that add to ' + t(b) + ' multiply to ' + t(extra[0]) + '.' };
        if (miss.length) return { code: 'u4l10-missing-c', hint: 'You’re missing ' + (miss.length === 1 ? 'a value' : miss.length + ' values') + '. Go through every pair of natural numbers that add to ' + t(b) + ': ' + t('1+' + (b - 1)) + ', ' + t('2+' + (b - 2)) + ', …' };
        return null;
      } },
      'For ' + t('(' + v + '+m)(' + v + '+n)') + ' we need ' + t('m+n=' + b) + ' and ' + t('mn=c') + ', with ' + t('c') + ' a natural number (so ' + t('m') + ' and ' + t('n') + ' are positive). The pairs: ' + cs.map(function (c, i) { return t((i + 1) + '+' + (b - i - 1) + '\\to ' + c); }).join('; ') + '.<br>So ' + t('c=' + cs.join(',\\ ')) + '.',
      ['The two numbers in the factors must add to ' + t(b) + '. List the pairs ' + t('1+' + (b - 1)) + ', ' + t('2+' + (b - 2)) + ', … and multiply each pair.'], 'all c for x^2+' + b + 'x+c');
    p.good = [cs.slice().reverse().join(', ')]; p.bad = [cs.slice(1).join(', '), cs.concat([b * b]).join(', ')];
    p.b = b; p.v = v;
    return p;
  }
  /* EP4: six expressions from the same two numbers A², B² */
  function ep4Items(r) {
    var A = 2, Bq = 5;
    for (var i = 0; i < 200; i++) { var a = r.int(2, 5), b = r.int(1, 9); if (gcd(a, b) !== 1 || a === b) continue; if (hasPair(a * a * b * b, b)) continue; A = a; Bq = b; break; }
    var A2 = A * A, B2 = Bq * Bq, it = [];
    it.push({ pr: dos({ A: M(A, 'x'), B: N(Bq) }) });
    it.push({ prime: true, kind: 'sum', a: A, n: Bq, tex: tx(S(M(A2, { x: 2 }), N(B2))), nudge: 'two perfect squares with a <b>plus</b> sign between them.' });
    it.push({ pr: tri({ a: A, u: -Bq, b: A, v: -Bq }) });
    it.push({ pr: tri({ a: A, u: Bq, b: A, v: Bq }) });
    it.push({ pr: tri({ a: A2, u: Bq, b: 1, v: Bq }) });
    it.push({ prime: true, kind: 'tri', a: A2, b: Bq, c: B2, tex: tx(S(M(A2, { x: 2 }), M(Bq, 'x'), N(B2))), nudge: 'try every factor pair of ' + t('a\\times c=' + A2 * B2) + ' — does any add to ' + t(Bq) + '?' });
    it.forEach(function (x) { if (!x.tex) x.tex = x.pr.tex; });
    return it;
  }
  /* EP5: 7x²−63, x²−7x−18, 9x²−30x+25, x²+13x+36, 5x²+3x, x²+4x+6 */
  function ep5Items(r) {
    var it = [], k = r.int(2, 7), n = r.int(2, 6);
    it.push({ pr: dos({ k: k, A: X, B: N(n) }) });
    var uv = monic(r, { u: [-9, -2], v: [1, 5], test: function (u, v) { return u + v < 0; }, book: [-9, 2] }); it.push({ pr: tri({ a: 1, u: uv[0], b: 1, v: uv[1] }) });
    var ab = coprime(r, 2, 5, 1, 7, function (a, b) { return a !== b; }) || [3, 5]; it.push({ pr: tri({ a: ab[0], u: -ab[1], b: ab[0], v: -ab[1] }) });
    var uv2 = monic(r, { u: [1, 9], v: [1, 9], test: function (u, v) { return u < v && u * v >= 12 && u * v <= 54; }, book: [4, 9] }); it.push({ pr: tri({ a: 1, u: uv2[0], b: 1, v: uv2[1] }) });
    var g = r.int(2, 9), q = r.int(1, 9); if (gcd(g, q) !== 1) q = 1; it.push({ pr: gcfOnly(X, S(M(g, 'x'), N(q))) });
    var bc = primeMonic(r, { b: [2, 8], c: [2, 12], book: [4, 6] }); it.push({ prime: true, kind: 'tri', a: 1, b: bc[0], c: bc[1], tex: tx(S(M(1, { x: 2 }), M(bc[0], 'x'), N(bc[1]))) });
    it.forEach(function (x) { if (!x.tex) x.tex = x.pr.tex; });
    return it;
  }
  function trSq(a, b, extraConst) { return tri({ a: a, u: b, b: a, v: b }); }
  /* a product equal to its own constant: (x + q1)(x + q2) = q1·q2 → x(x + q1 + q2) = 0 */
  function zeroConstEq(r) {
    var q1 = r.int(1, 8), q2 = r.int(1, 9); if (q1 === q2) q2 = q1 + 1;
    var E = Eq({ fs: [[1, 0], [1, q1 + q2]], show: 'prod', Q: [[1, q1], [1, q2]], c: q1 * q2 }); E.notZero = [q1 * q2 - q1, q1 * q2 - q2]; return E;
  }
  function sqEqDisguised(r) { // 2x(x − n) = x² − n² ⇒ (x − n)² = 0
    var n = r.int(2, 9), v = LV(r), v2 = {}; v2[v] = 2;
    var E = Eq({ v: v, fs: [[1, -n], [1, -n]], sq: true, show: 'rhs', R: S(M(1, v2), N(-n * n)), lhsTex: '2' + v + '(' + v + '-' + n + ')', rhsTex: v + '^{2}-' + n * n }); E.sq = true; return E;
  }
  function pythag(r) {
    var T = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15], [12, 16, 20], [9, 40, 41], [20, 21, 29], [12, 35, 37], [15, 20, 25], [10, 24, 26], [15, 36, 39], [16, 30, 34], [21, 28, 35], [24, 32, 40], [18, 24, 30], [5, 12, 13], [30, 40, 50], [14, 48, 50], [24, 45, 51], [20, 48, 52], [27, 36, 45]]);
    var a = T[0], p = T[1] - a, q = T[2] - a, other = 2 * (q - p) - a;
    var E = Eq({ fs: [[1, -a], [1, -other]] });
    return { a: a, p: p, q: q, other: other, sides: T, E: E };
  }
  function buildPrim(fs, rootsTex) { // build an equation from roots: integer coefficients, no common factor
    var p = buildEqPart(fs, rootsTex), base = p.check, E = Eq({ fs: fs }), T = E.P;
    p.check = function (resp) {
      var r = base(resp); if (r.v !== 'correct') return r;
      var s = String(resp == null ? '' : resp).replace(/=\s*0\s*$/, ''), a = K.read(s), rd = P.read(a.ast);
      var lc = P.lead(rd.p, 'x'), lt = P.lead(T, 'x');
      if (Math.abs(lc[0] * lt[1]) !== Math.abs(lt[0] * lc[1])) return form('u4l10-common', 'Right roots — but the equation should have <b>no common factor</b>: divide every term by the GCF.');
      return ok();
    };
    p.good = [p.key, tx(P.scale(T, -1))]; p.bad = (p.bad || []).concat([tx(P.scale(T, 2))]);
    p.answer = t(p.key + '=0');
    return p;
  }

  HW.defineLesson({
    id: 'u4l10', unit: 4, num: '10', title: 'Unit Review: Factoring', outcome: 'AN5',
    blurb: 'Unit 4 review: GCF, x² + bx + c, difference of squares, perfect squares, decomposition, choosing a strategy, and solving equations by factoring.',
    questions: [
      { num: '1', section: 'Part A — Removing a Greatest Common Factor', stem: 'Factor each expression completely.', parts: [
        { id: '1', level: 'BEG', make: function (r) { var k = r.int(2, 9), pq = coprime(r, 2, 5, 1, 9, function (p, q) { return p !== q; }) || [2, 3]; return fac(gcfOnly(M(k, 'x'), S(M(pq[0], 'x'), N(-pq[1])))); } }] },
      { num: '2', stem: 'Factor each expression completely.', parts: [
        { id: '2', level: 'ADV', make: function (r) { var o = decPick(r, { a: [2, 3], u: [-5, -1], b: 1, v: [-5, -1], test: function (o) { return o.C <= 15; }, book: { a: 2, u: -3, b: 1, v: -1 } }); return fac(tri(Object.assign({ k: M(-r.int(2, 5), 'x') }, o))); } }] },
      { num: '3', stem: 'Factor each expression completely.', parts: [
        { id: '3', level: 'EMG', make: function (r) {
          var c = r.int(2, 9), ea = r.int(1, 2), eb = r.int(1, 2), pq = coprime(r, 2, 5, 1, 5, function (p, q) { return p !== q; }) || [3, 2];
          var g = M(c, { x: ea + 1, y: eb + 1 }), inner = S(M(pq[0], 'y'), M(-pq[1], 'x')), T1 = P.mul(g, M(pq[0], 'y')), T2 = P.mul(g, M(-pq[1], 'x'));
          return fac(gcfOnly(g, inner, P.seq([T1, T2])));
        } }] },
      { num: '4', section: 'Part B — Trinomials x² + bx + c', stem: 'Factor each trinomial. (Questions 4–5 have ' + t('c') + ' positive; questions 6–7 have ' + t('c') + ' negative.)', parts: [
        { id: '4', level: 'BEG', make: function (r) { var uv = monic(r, { u: [2, 12], v: [2, 12], test: function (u, v) { return u < v && u * v >= 20 && u * v <= 99; }, book: [5, 9] }); return fac(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '5', stem: 'Factor each trinomial.', parts: [
        { id: '5', level: 'EMG', make: function (r) { var uv = monic(r, { u: [-12, -2], v: [-12, -2], test: function (u, v) { return u < v && u * v >= 20 && u * v <= 99; }, book: [-9, -7] }); return fac(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '6', stem: 'Factor each trinomial.', parts: [
        { id: '6', level: 'EMG', make: function (r) { var uv = monic(r, { u: [4, 12], v: [-12, -2], test: function (u, v) { return u + v > 0 && u * v <= -20 && u * v >= -99; }, book: [10, -7] }); return fac(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '7', stem: 'Factor each trinomial.', parts: [
        { id: '7', level: 'EMG', make: function (r) { var uv = monic(r, { u: [4, 12], v: [-12, -2], test: function (u, v) { return u + v > 0 && u + v <= 3 && u * v <= -20; }, book: [9, -7] }); return fac(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '8', section: 'Part C — Difference of Squares and Perfect Square Trinomials', stem: 'Factor each expression.', parts: [
        { id: '8', level: 'BEG', make: function (r) { return fac(dos({ A: V(LV(r)), B: N(r.int(10, 15)) })); } }] },
      { num: '9', stem: 'Factor each expression.', parts: [
        { id: '9', level: 'BEG', make: function (r) { var ab = coprime(r, 2, 6, 1, 9, function (a, b) { return a !== b; }) || [5, 4]; return fac(dos({ A: M(ab[0], 'x'), B: N(ab[1]) })); } }] },
      { num: '10', stem: 'Factor each expression.', parts: [
        { id: '10', level: 'EMG', make: function (r) { var n = r.int(11, 20) * r.pick([1, 1, -1]); return fac(tri({ X: V(r.pick(['x', 'x', 'y'])), a: 1, u: n, b: 1, v: n })); } }] },
      { num: '11', stem: 'Factor each expression.', parts: [
        { id: '11', level: 'EMG', make: function (r) { var ab = coprime(r, 2, 5, 1, 9, function (a, b) { return a !== b; }) || [3, 7]; return fac(tri({ a: ab[0], u: -ab[1], b: ab[0], v: -ab[1] })); } }] },
      { num: '12', section: 'Part D — Decomposition (a ≠ 1)', stem: 'Factor each trinomial using decomposition.', parts: [
        { id: '12', level: 'EMG', make: function (r) { return fac(tri(decPick(r, { a: [2, 5], u: [1, 5], b: 1, v: [1, 5], test: function (o) { return o.Bm <= 25 && o.a * o.b >= 3; }, book: { a: 4, u: 1, b: 1, v: 3 } }))); } }] },
      { num: '13', stem: 'Factor each trinomial using decomposition.', parts: [
        { id: '13', level: 'PRG', make: function (r) { return fac(tri(decPick(r, { a: [2, 5], u: [-7, -1], b: 1, v: [-5, -1], test: function (o) { return o.C <= 30 && o.Bm >= -25; }, book: { a: 5, u: -4, b: 1, v: -2 } }))); } }] },
      { num: '14', stem: 'Factor each trinomial using decomposition.', parts: [
        { id: '14', level: 'PRG', make: function (r) { return fac(tri(decPick(r, { a: [2, 4], u: [-7, 7], b: [2, 3], v: [-7, 7], test: function (o) { return o.a !== o.b && o.C < 0 && o.Bm > 0 && o.C >= -42; }, book: { a: 3, u: -4, b: 2, v: 5 } }))); } }] },
      { num: '15', section: 'Part E — Choosing a Strategy', stem: 'Factor each expression completely. Remember to look for a GCF first.', parts: [
        { id: '15', level: 'PRG', make: function (r) { return fac(dos({ k: M(r.int(2, 6), 'x'), A: X, B: N(r.int(1, 5)) })); } }] },
      { num: '16', stem: 'Factor each expression completely.', parts: [
        { id: '16', level: 'PRG', make: function (r) { var n = r.int(1, 6) * r.pick([1, 1, -1]); return fac(tri({ k: r.int(2, 5), a: 1, u: n, b: 1, v: n })); } }] },
      { num: '17', stem: 'Factor each expression completely.', parts: [
        { id: '17', level: 'PRG', make: function (r) { var uv = monic(r, { u: [2, 9], v: [-6, -1], test: function (u, v) { return u + v > 0 && u * v >= -48; }, book: [8, -3] }); return fac(tri({ k: M(r.int(2, 5), 'x'), a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '18', stem: 'Factor each expression completely.', parts: [
        { id: '18', level: 'PRG', make: function (r) { return fac(dos({ k: r.int(2, 5), A: X, B: N(r.int(4, 9)) })); } }] },
      { num: '19', section: 'Part F — Solving Equations by Factoring', stem: 'Solve each equation by factoring.', parts: [
        { id: '19', level: 'EMG', make: function (r) { return solvePart(monicEq(r, { a: [-15, -2], b: [2, 9], test: function (a, b) { return a + b < 0 && a * b >= -60; }, book: [-13, 4] })); } }] },
      { num: '20', stem: 'Solve each equation by factoring.', parts: [
        { id: '20', level: 'PRG', make: function (r) { return solvePart(decEq(r, { a: 2, b: [1, 9], c: 1, d: [-9, -1], test: function (o) { return o.Bm < 0 && o.C >= -45; }, book: [[2, 3], [1, -4]] }), { how: 'decomposition' }); } }] },
      { num: '21', stem: 'Solve each equation by factoring.', parts: [
        { id: '21', level: 'PRG', make: function (r) { var ab = coprime(r, 2, 6, 1, 11, function (a, b) { return a !== b; }) || [4, 7]; return solvePart(rhsEq(Eq({ fs: [[ab[0], -ab[1]], [ab[0], ab[1]]] }), 'c'), { how: 'difference of squares' }); } }] },
      { num: '22', stem: 'Solve each equation by factoring.', parts: [
        { id: '22', level: 'EMG', make: function (r) { return solvePart(rhsEq(monicEq(r, { a: [-12, -1], b: [1, 6], test: function (a, b) { return a + b < 0 && a * b >= -40; }, book: [-9, 2] }), 'c')); } }] },
      { num: '23', section: 'Part G — Numerical Response and Written Response', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '23', level: 'PRG', make: function (r) {
          var a = r.int(2, 9), b = r.int(1, 9), pr = dos({ k: M(a, 'x'), A: X, B: N(b) }), ans = a + 2 * b;
          return B.nr('When ' + t(pr.tex) + ' is factored completely, it can be written in the form ' + t('ax(x-b)(x+c)') + ', where ' + t('a') + ', ' + t('b') + ' and ' + t('c') + ' are positive integers. The value of ' + t('a+b+c') + ' is ________.', ans, function (v) {
            if (v === a + b * b + b * b || v === a + b * b) return { code: 'value', hint: t('b') + ' and ' + t('c') + ' are the square roots, not the squares: ' + t('x^{2}-' + b * b + '=(x-' + b + ')(x+' + b + ')') + '.' };
            if (v === 2 * b || v === a * b * b) return { code: 'value', hint: 'Include ' + t('a') + ', the number in the GCF ' + t(a + 'x') + '.' };
            return null;
          }, pr.sol + '<br>So ' + t('a=' + a + ',\\ b=' + b + ',\\ c=' + b) + ' and ' + t('a+b+c=' + ans) + '.', ['Take out the GCF ' + t(a + 'x') + ' first, then factor the difference of squares.'], 'NR a+b+c');
        } }] },
      { num: '24', stem: function (sh) { return '<i>(Written Response)</i> Two students, Jamal and Priya, attempt to factor ' + t(sh.T.tex) + '. Each student’s work contains exactly one mathematical error.<div class="fig"><table class="vtab"><tr><th>Jamal</th><th>Priya</th></tr><tr><td>' + t(sh.T.tex) + '</td><td>' + t(sh.T.tex) + '</td></tr><tr><td>Factors of ' + t(sh.C) + ' differing by ' + t(sh.D) + ': ' + t(sh.P1) + ' and ' + t(sh.Q1) + '.</td><td>Factors of ' + t(sh.C) + ' differing by ' + t(sh.D) + ': ' + t(sh.P1) + ' and ' + t(sh.Q1) + '.</td></tr><tr><td>' + t(sh.jam) + '</td><td>' + t(sh.pri) + '</td></tr></table></div>'; },
        shared: function (r) {
          var o = null; for (var i = 0; i < 300 && !o; i++) { var p1 = r.int(4, 12), q1 = r.int(4, 9); if (p1 > q1 && p1 - q1 <= 7) o = { p1: p1, q1: q1 }; } o = o || { p1: 11, q1: 6 };
          var T = tri({ a: 1, u: o.p1, b: 1, v: -o.q1 });
          return { T: T, P1: o.p1, Q1: o.q1, C: o.p1 * o.q1, D: o.p1 - o.q1, jam: '(x+' + o.q1 + ')(x-' + o.p1 + ')', pri: '(x+' + o.p1 + ')(x+' + o.q1 + ')' };
        },
        parts: [
          { id: '24a', level: 'EMG', make: function (r, sh) {
            var p = sh.P1, q = sh.Q1;
            return mcPart(r, '(a) What error did Jamal make?', [
              { html: 'He found the right numbers but put the signs on the wrong ones: ' + t(sh.jam) + ' gives ' + t('-' + sh.D + 'x') + '. Since ' + t('b=+' + sh.D) + ', the larger number must be positive: ' + t('+' + p) + ' and ' + t('-' + q) + '.', right: true },
              { html: 'He chose the wrong pair of factors of ' + t(sh.C) + '.', why: t(p) + ' and ' + t(q) + ' are the right numbers. Expand his answer and look at the middle term.' },
              { html: 'Both of his signs should be positive.', why: 'Then the last term would be ' + t('+' + sh.C) + ', not ' + t('-' + sh.C) + '.' },
              { html: 'He made no error.', why: 'Expand: ' + t(sh.jam + '=x^{2}-' + sh.D + 'x-' + sh.C) + ', not ' + t(sh.T.tex) + '.' }],
              'Expanding Jamal’s answer: ' + t(sh.jam + '=x^{2}-' + sh.D + 'x-' + sh.C) + ' — the middle term has the wrong sign. With ' + t('c<0') + ' the signs differ, and the larger number takes the sign of ' + t('b') + ': ' + t('+' + p) + ' and ' + t('-' + q) + '.', ['Expand Jamal’s answer and compare it with the trinomial.'], 'Jamal error');
          } },
          { id: '24b', level: 'EMG', make: function (r, sh) {
            return mcPart(r, '(b) What error did Priya make?', [
              { html: 'She made both signs positive, so her factors multiply to ' + t('+' + sh.C) + ', not ' + t('-' + sh.C) + '. Because ' + t('c') + ' is negative, one number must be negative.', right: true },
              { html: 'She chose the wrong pair of factors of ' + t(sh.C) + '.', why: 'The numbers are right. Expand her answer and look at the last term.' },
              { html: 'She should have used ' + t(sh.Q1) + ' and ' + t(-sh.P1) + '.', why: 'That would give the middle term ' + t(-sh.D + 'x') + '. Look at the sign of the last term in her answer.' },
              { html: 'She made no error.', why: 'Expand: ' + t(sh.pri + '=x^{2}+' + (sh.P1 + sh.Q1) + 'x+' + sh.C) + ', not ' + t(sh.T.tex) + '.' }],
              'Expanding Priya’s answer: ' + t(sh.pri + '=x^{2}+' + (sh.P1 + sh.Q1) + 'x+' + sh.C) + '. The product of the last terms is ' + t('+' + sh.C) + ', but the trinomial has ' + t('-' + sh.C) + ': the numbers need opposite signs.', ['Expand Priya’s answer and look at the last term.'], 'Priya error');
          } },
          { id: '24c', level: 'EMG', make: function (r, sh) { var p = fac(sh.T, { prompt: '(c) Determine the correct factored form of ' + t(sh.T.tex) + '.' }); p.bad.push(sh.jam, sh.pri); return p; } },
          { id: '24d', level: 'BEG', make: function (r, sh) {
            var v = 9 + 3 * sh.D - sh.C, f1 = 3 + sh.P1, f2 = 3 - sh.Q1;
            var p = B.number('(d) Verify your factoring: substitute ' + t('x=3') + ' into both the original expression and your factored form. What value do both give?', v, function (y) {
              if (y === f1 || y === f2) return { code: 'u4l10-sub', hint: 'That is the value of one bracket. Multiply the two brackets’ values.' };
              if (y === 9 - 3 * sh.D - sh.C) return { code: 'u4l10-sub', hint: 'Check the sign of the middle term: it is ' + t('+' + sh.D + 'x') + '.' };
              return null;
            }, 'Original: ' + t('(3)^{2}+' + sh.D + '(3)-' + sh.C + '=9+' + 3 * sh.D + '-' + sh.C + '=' + v) + '.<br>Factored: ' + t('(3+' + sh.P1 + ')(3-' + sh.Q1 + ')=(' + f1 + ')(' + f2 + ')=' + v) + ' ✓',
            ['Square first, then multiply and add. For the factored form, work out each bracket and multiply.'], 'verify at x=3');
            p.bad = [String(f1), String(9 - 3 * sh.D - sh.C)]; return p;
          } }] }
    ],
    extra: [
      { num: '1', section: 'Part A — Factor Completely: More Than One Stage', stem: 'Every expression in this part needs <b>two or three</b> steps. Remove the GCF first, then keep checking each bracket you write. Factor completely.', parts: [
        { id: 'e1a', level: 'ADV', make: function (r) { var n = r.pick([1, 2, 3]), k = r.int(2, 6), v = r.pick(['x', 'x', 'y']), A2 = {}; A2[v] = 2; if (n === 3) k = r.pick([2, 3]); return fac(dos({ k: k, A: M(1, A2), B: N(n * n), again: true })); } },
        { id: 'e1b', level: 'PRG', make: function (r) { return fac(dos({ k: M(r.int(2, 7), 'x'), A: X, B: N(r.int(2, 6)) })); } },
        { id: 'e1c', level: 'PRG', make: function (r) { var uv = monic(r, { u: [1, 6], v: [1, 6], test: function (u, v) { return u < v && u * v <= 24; }, book: [2, 3] }); return fac(tri({ k: M(r.int(2, 6), 'x'), a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: 'e1d', level: 'PRG', make: function (r) { return fac(dos({ k: M(r.int(2, 9), 'x'), A: X, B: N(r.int(2, 7)) })); } }] },
      { num: '2', stem: 'Factor completely. In each one the GCF hides a difference of squares, a perfect square trinomial, or a trinomial with ' + t('a=1') + '.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) { var ab = coprime(r, 2, 5, 1, 7, function (a, b) { return a !== b; }) || [3, 2]; return fac(dos({ k: M(r.int(2, 3), 'x'), A: M(ab[0], 'x'), B: N(ab[1]) })); } },
        { id: 'e2b', level: 'ADV', make: function (r) { var n = r.pick([1, 2, 3]), k = r.int(2, 6), v = r.pick(['x', 'x', 'y', 'a']), A2 = {}; A2[v] = 2; return fac(dos({ k: k, A: M(1, A2), B: N(n * n), again: true })); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var uv = monic(r, { u: [1, 7], v: [1, 7], test: function (u, v) { return u < v && u * v <= 24; }, book: [2, 5] }); return fac(tri({ k: M(r.int(2, 5), 'x'), a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: 'e2d', level: 'PRG', make: function (r) { var n = -r.int(1, 7); return fac(tri({ k: M(r.int(2, 6), 'x'), a: 1, u: n, b: 1, v: n })); } }] },
      { num: '3', stem: 'Factor completely. After the GCF comes out, each of these still has ' + t('a\\neq1') + ' (or a perfect square), so finish with decomposition. In part (d), factor out a <b>negative</b> GCF.', parts: [
        { id: 'e3a', level: 'PRG', make: function (r) { return fac(tri(Object.assign({ k: r.int(2, 3) }, decPick(r, { a: [2, 3], u: [-5, 5], b: [3, 4], v: [-5, 5], test: function (o) { return o.a !== o.b && o.C < 0 && o.Bm !== 0 && Math.abs(o.Bm) <= 7; }, book: { a: 2, u: -1, b: 3, v: 2 } })))); } },
        { id: 'e3b', level: 'ADV', make: function (r) { return fac(tri(Object.assign({ k: X }, decPick(r, { a: [3, 6], u: [-7, -1], b: [2, 3], v: [1, 5], test: function (o) { return o.a !== o.b && o.Bm < 0 && o.Bm >= -10; }, book: { a: 4, u: -3, b: 2, v: 1 } })))); } },
        { id: 'e3c', level: 'ADV', make: function (r) { return fac(tri(Object.assign({ k: M(r.int(2, 4), 'x') }, decPick(r, { a: 2, u: [-3, 3], b: 1, v: [-4, 4], test: function (o) { return o.C < 0 && o.Bm > 0; }, book: { a: 2, u: -1, b: 1, v: 2 } })))); } },
        { id: 'e3d', level: 'ADV', make: function (r) { var n = -r.int(2, 9); return fac(tri({ k: -r.int(2, 4), a: 1, u: n, b: 1, v: n })); } }] },
      { num: '4', section: 'Part B — Recognising the Structure', stem: function (sh) { return 'The six expressions below are built from the same few numbers, but each has a different structure. Two of the six are <b>prime</b>.<br>' + sh.items.map(function (it, i) { return '(' + 'abcdef'.charAt(i) + ') ' + t(it.tex); }).join('&emsp; '); },
        shared: function (r) { return { items: ep4Items(r) }; },
        parts: [{ id: 'e4s', sub: 'strategy', level: 'PRG', make: function (r, sh) { return gridOf(sh.items, 'Name the strategy for each expression.'); } }].concat('abcdef'.split('').map(function (L, i) {
          return { id: 'e4' + L, sub: L, level: ['BEG', 'EMG', 'EMG', 'EMG', 'PRG', 'PRG'][i], make: function (r, sh) { return itemPart(sh.items[i], '(' + L + ') Factor, or press <b>none</b> if it is prime: ' + t(sh.items[i].tex)); } };
        })) },
      { num: '5', stem: function (sh) { return 'Name the strategy, then factor completely. One of these is prime.<br>' + sh.items.map(function (it, i) { return '(' + 'abcdef'.charAt(i) + ') ' + t(it.tex); }).join('&emsp; '); },
        shared: function (r) { return { items: ep5Items(r) }; },
        parts: [{ id: 'e5s', sub: 'strategy', level: 'EMG', make: function (r, sh) { return gridOf(sh.items, 'Name the strategy for each expression.'); } }].concat('abcdef'.split('').map(function (L, i) {
          return { id: 'e5' + L, sub: L, level: ['PRG', 'EMG', 'EMG', 'BEG', 'BEG', 'EMG'][i], make: function (r, sh) { return itemPart(sh.items[i], '(' + L + ') Factor completely, or press <b>none</b> if it is prime: ' + t(sh.items[i].tex)); } };
        })) },
      { num: '6', stem: 'Each expression below <i>looks</i> like a perfect square trinomial. Decide whether it really is one. If it is, write it as a square; if it is not, factor it completely by another method.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) { var n = r.int(3, 12); return fac(tri({ X: V(LV(r)), a: 1, u: n, b: 1, v: n })); } },
        { id: 'e6b', level: 'EMG', make: function (r) { var n = r.int(3, 12); return fac(tri({ X: V(LV(r)), a: 1, u: n - 1, b: 1, v: n + 1 })); } },
        { id: 'e6c', level: 'EMG', make: function (r) { var ab = coprime(r, 2, 5, 1, 9, function (a, b) { return a !== b; }) || [3, 4]; return fac(tri({ a: ab[0], u: -ab[1], b: ab[0], v: -ab[1] })); } },
        { id: 'e6d', level: 'ADV', make: function (r) {
          var o = null; for (var i = 0; i < 200 && !o; i++) { var a = r.int(2, 5), b = r.int(2, 12); if (gcd(a, b) !== 1) continue; var g1 = gcd(a, b + 1), g2 = gcd(a, b - 1); if (g1 * g2 === 1) continue; o = { a: a, b: b, g1: g1, g2: g2 }; } o = o || { a: 3, b: 4, g1: 1, g2: 3 };
          return fac(tri({ k: o.g1 * o.g2, a: o.a / o.g1, u: -(o.b + 1) / o.g1, b: o.a / o.g2, v: -(o.b - 1) / o.g2 }));
        } }] },
      { num: '7', section: 'Part C — Solving Equations', stem: 'Not one of these equations is ready to solve as written. Rearrange so that one side is ' + t('0') + ', factor completely, then apply the zero product property.', parts: [
        { id: 'e7a', level: 'ADV', make: function (r) { return solvePart(prodEq(r, { book: { q: [4, -1], c: 6 } })); } },
        { id: 'e7b', level: 'PRG', make: function (r) { return solvePart(rhsEq(decEq(r, { a: [2, 4], b: [-5, 5], c: [2, 4], d: [-5, 5], test: function (o) { return o.a !== o.c && o.C < 0 && o.Bm < 0 && o.Bm >= -7 && Math.abs(o.b) !== o.a && Math.abs(o.d) !== o.c; }, book: [[3, -2], [2, 1]] }), 'bc'), { how: 'decomposition' }); } }] },
      { num: '8', stem: 'Solve. Each of these is a <b>cubic</b>, so expect three roots.', parts: [
        { id: 'e8a', level: 'PRG', make: function (r) { var n = r.int(1, 7); return solvePart(rhsEq(Eq({ v: LV(r), fs: [[1, 0], [1, -n], [1, n]] }), 'x'), { how: 'GCF, then difference of squares' }); } },
        { id: 'e8b', level: 'ADV', make: function (r) { var uv = two(r, [1, 6], [-6, -1], function (a, b) { return a + b !== 0 && a * b >= -24; }) || [2, -3]; return solvePart(rhsEq(Eq({ k: r.int(2, 3), fs: [[1, 0], [1, -uv[0]], [1, -uv[1]]] }), 'x'), { how: 'GCF, then inspection' }); } }] },
      { num: '9', stem: 'Solve. One of these has only a single solution.', parts: [
        { id: 'e9a', level: 'PRG', make: function (r) { var n = r.int(2, 7), k = r.int(2, 5), E = Eq({ k: k, fs: [[1, -n], [1, -n]], sq: true }); E.sq = true; var F = rhsEq(E, 'x'); F.sq = true; return solvePart(F, { how: 'GCF, then perfect square trinomial' }); } },
        { id: 'e9b', level: 'PRG', make: function (r) { return solvePart(prodEq(r, { mono: true, book: { q: [0, 5], c: 14 } })); } }] },
      { num: '10', stem: 'Solve.', parts: [
        { id: 'e10a', level: 'ADV', make: function (r) { return solvePart(zeroConstEq(r)); } },
        { id: 'e10b', level: 'ADV', make: function (r) { var E = sqEqDisguised(r); return solvePart(E); } }] },
      { num: '11', section: 'Part D — Reasoning and Error Analysis', stem: function (sh) { return 'Both binomials below use the numbers ' + t(sh.v + '^{2}') + ' and ' + t(sh.n * sh.n) + '.'; },
        shared: function (r) { var n = r.int(2, 12), bc = primeMonic(r, { b: [2, 8], c: [2, 12], book: [4, 6] }); return { n: n, b: bc[0], c: bc[1], v: LV(r) }; },
        parts: [
          { id: 'e11a1', sub: 'a factor', level: 'BEG', make: function (r, sh) { return fac(dos({ A: V(sh.v), B: N(sh.n) }), { prompt: '(a) Factor ' + t(sh.v + '^{2}-' + sh.n * sh.n) + '.' }); } },
          { id: 'e11a2', sub: 'a why', level: 'EMG', make: function (r, sh) {
            var q = sh.n * sh.n, v = sh.v;
            return mcPart(r, 'Why can ' + t(v + '^{2}+' + q) + ' not be factored over the integers? (If ' + t(v + '^{2}+' + q + '=(' + v + '+p)(' + v + '+q)') + ', what would ' + t('p+q') + ' and ' + t('pq') + ' have to be?)', [
              { html: 'We would need ' + t('p+q=0') + ' and ' + t('pq=' + q) + '. But ' + t('p+q=0') + ' means ' + t('q=-p') + ', so ' + t('pq=-p^{2}') + ', which is never positive. No integers work.', right: true },
              { html: 'Because ' + t(q) + ' is not a perfect square.', why: t(q + '=' + sh.n + '^{2}') + ' is a perfect square. Think about the sum ' + t('p+q') + ' — there is no ' + t(v) + '-term.' },
              { html: 'It can: ' + t(v + '^{2}+' + q + '=(' + v + '+' + sh.n + ')^{2}') + '.', why: 'Expand ' + t('(' + v + '+' + sh.n + ')^{2}') + ': it has a middle term ' + t(2 * sh.n + v) + '.' },
              { html: 'It can: ' + t(v + '^{2}+' + q + '=(' + v + '+' + sh.n + ')(' + v + '-' + sh.n + ')') + '.', why: 'Expand: ' + t('(' + v + '+' + sh.n + ')(' + v + '-' + sh.n + ')=' + v + '^{2}-' + q) + '.' }],
              'With no ' + t(v) + '-term, ' + t('p+q=0') + ', so ' + t('q=-p') + ' and ' + t('pq=-p^{2}\\le 0') + ' — it can never equal ' + t(q) + '. A sum of squares is prime.', ['There is no ' + t(v) + '-term, so ' + t('p+q=0') + '. What does that force ' + t('pq') + ' to be?'], 'why sum of squares prime');
          } },
          { id: 'e11b', level: 'EMG', make: function (r, sh) { return itemPart({ prime: true, kind: 'tri', a: 1, b: sh.b, c: sh.c }, '(b) Use the same reasoning on ' + t('x^{2}+' + sh.b + 'x+' + sh.c) + ': factor it, or press <b>none</b> if it is prime.'); } }] },
      { num: '12', stem: 'A quadratic equation usually has two different solutions, but sometimes it has only one — a <b>repeated root</b>.', parts: [
        { id: 'e12a1', sub: 'a solve', level: 'EMG', make: function (r) { var n = r.int(2, 12) * r.pick([1, -1]); return solvePart(sqEq(-n, LV(r)), { how: 'perfect square trinomial' }); } },
        { id: 'e12a2', sub: 'a count', level: 'BEG', make: function (r) { var n = r.int(2, 25), E = sqEq(-n); var p = B.number('How many <b>different</b> roots does ' + t(E.ptex + '=0') + ' have?', 1, function (v) { return v === 2 ? { code: 'value', hint: 'Factor it: ' + t('(x-' + n + ')(x-' + n + ')') + '. Both factors give the same value.' } : null; }, t(E.ptex + '=(x-' + n + ')^{2}') + ': the same factor appears twice, so both give ' + t('x=' + n) + ' — one different root (a repeated root).', ['Factor it and look at the two factors.'], 'count roots'); p.bad = ['2', '0']; return p; } },
        { id: 'e12b', level: 'EMG', make: function (r) { return mcPart(r, '(b) Complete the sentence: a quadratic has a repeated root exactly when its factored form is …', [
            { html: '… a perfect square — both factors are identical, like ' + t('a(px+q)^{2}') + '.', right: true },
            { html: '… a difference of squares.', why: t('(x-3)(x+3)=0') + ' has two roots, ' + t('3') + ' and ' + t('-3') + '.' },
            { html: '… missing a constant term.', why: t('x(x-5)=0') + ' has two roots, ' + t('0') + ' and ' + t('5') + '.' },
            { html: '… a product with a GCF in front.', why: t('2(x-1)(x-4)=0') + ' has two roots. The GCF doesn’t give a root at all.' }],
            'A repeated root happens when the same factor appears twice: ' + t('a(px+q)^{2}=0') + ' gives only ' + t('x=-\\frac{q}{p}') + '.', ['When do both factors give the same value?'], 'repeated root sentence'); } },
        { id: 'e12c', level: 'EMG', make: function (r) {
          var n = r.int(3, 8), A = tri({ a: 1, u: -n, b: 1, v: -n }), Bt = tri({ a: 1, u: -(n - 1), b: 1, v: -(n + 1) }), ab = coprime(r, 2, 4, 1, 7, function (a, b) { return a !== b; }) || [2, 3], C = tri({ a: ab[0], u: ab[1], b: ab[0], v: ab[1] });
          var opts = [{ value: 'a', html: t(A.tex) }, { value: 'b', html: t(Bt.tex) }, { value: 'c', html: t(C.tex) }];
          return { prompt: '(c) Which of these give equations (expression ' + t('=0') + ') with a repeated root? Tap every one.', input: { type: 'select', options: opts }, check: K.selectSet(['a', 'c'], function (extra, miss) { return { code: 'u4l9-check', hint: extra.length ? t(Bt.tex + '=' + Bt.keyTex) + ': two <b>different</b> factors, so two different roots.' : 'Check each one: is it a perfect square trinomial?' }; }),
            key: ['a', 'c'], answer: t(A.tex) + ' and ' + t(C.tex), solution: t(A.tex + '=' + A.keyTex) + ' — repeated root ' + t('x=' + n) + '.<br>' + t(Bt.tex + '=' + Bt.keyTex) + ' — two different roots.<br>' + t(C.tex + '=' + C.keyTex) + ' — repeated root ' + t('x=' + rtex(ex.norm(-ab[1], ab[0]))) + '.',
            hints: ['Factor each one. A perfect square gives a repeated root.'], text: 'which have a repeated root', bad: [['a'], ['a', 'b', 'c']] };
        } }] },
      { num: '13', stem: 'When an expression is factored completely and one of the factors is simply ' + t('x') + ', the equation (expression) ' + t('=0') + ' always has ' + t('x=0') + ' as one of its roots.', parts: [
        { id: 'e13a1', sub: 'a why', level: 'EMG', make: function (r) { return mcPart(r, '(a) Why is that true?', [
            { html: 'By the zero product property: if ' + t('x\\cdot(\\text{rest})=0') + ', then ' + t('x=0') + ' or ' + t('\\text{rest}=0') + ' — and ' + t('x=0') + ' makes the factor ' + t('x') + ' zero.', right: true },
            { html: 'Because every polynomial has ' + t('x=0') + ' as a root.', why: t('x^{2}-9=0') + ' has roots ' + t('\\pm3') + ', not ' + t('0') + '.' },
            { html: 'Because you can always divide both sides by ' + t('x') + '.', why: 'Dividing by ' + t('x') + ' throws the root ' + t('x=0') + ' away. Think about the zero product property.' },
            { html: 'Because the constant term is ' + t('0') + ' only when ' + t('x') + ' is negative.', why: 'Think about the zero product property: what makes the product zero?' }],
            'A product is zero when one factor is zero. The factor ' + t('x') + ' is zero exactly when ' + t('x=0') + ', so ' + t('x=0') + ' is always a root.', ['Use the zero product property on ' + t('x\\cdot(\\text{rest})=0') + '.'], 'why x=0'); } },
        { id: 'e13a2', sub: 'a root', level: 'BEG', make: function (r) {
          var uv = two(r, [1, 6], [-6, -1], function (a, b) { return a + b !== 0; }) || [2, -3], E = Eq({ k: r.int(2, 4), fs: [[1, 0], [1, -uv[0]], [1, -uv[1]]] });
          var p = B.number('Without doing any more work, state one root of ' + t(E.ptex + '=0') + ' that comes from the common factor ' + t('x') + '.', 0, function (v) { return v === uv[0] || v === uv[1] ? { code: 'value', hint: 'That is a root, but it comes from the trinomial. Which root comes from the factor ' + t('x') + '?' } : null; },
            'Every term has a factor ' + t('x') + ', so ' + t('x=0') + ' is a root (' + t(E.ftex + '=0') + ').', ['Which value makes the factor ' + t('x') + ' zero?'], 'root from x', { before: t('x=') });
          p.bad = [String(uv[0])]; return p;
        } },
        { id: 'e13b', level: 'EMG', make: function (r) { var pq = coprime(r, 2, 9, 1, 9, function (a, b) { return a !== b && b % a !== 0; }) || [5, 3]; return solvePart(Eq({ fs: [[1, 0], [pq[0], pq[1]]] }), { prompt: '(b) Solve ' + t(tx(S(M(pq[0], { x: 2 }), M(pq[1], 'x'))) + '=0') + '. (One root comes from the GCF ' + t('x') + ', the other from the second factor.)', how: 'GCF' }); } }] },
      { num: '14', stem: 'Two students made exactly <b>one</b> mistake each. Find the step where each went wrong and give the correct final answer.',
        shared: function (r) { var k = r.int(2, 8), n = r.pick([1, 2, 3]), m = r.int(2, 25); return { k: k, n: n, m: m, pr: dos({ k: k, A: M(1, { x: 2 }), B: N(n * n), again: true }) }; },
        parts: [
          { id: 'e14a1', sub: 'a step', level: 'EMG', make: function (r, sh) {
            var n2 = sh.n * sh.n, n4 = n2 * n2;
            return mcPart(r, 'Rowan was asked to factor ' + t(sh.pr.tex) + ' completely.<br>Step 1: ' + t(sh.pr.tex + '=' + sh.k + '(x^{4}-' + n4 + ')') + '<br>Step 2: ' + t('=' + sh.k + '(x^{2}-' + n2 + ')(x^{2}+' + n2 + ')') + '<br>Step 3: “This is factored completely.”<br>Which step is wrong?', [
              { html: 'Step 3 — ' + t('x^{2}-' + n2) + ' is still a difference of squares, so he stopped too early.', right: true },
              { html: 'Step 1 — the GCF is wrong.', why: 'Every term is divisible by ' + t(sh.k) + ', and nothing more. Step 1 is right.' },
              { html: 'Step 2 — ' + t('x^{4}-' + n4) + ' is not a difference of squares.', why: t('x^{4}-' + n4 + '=(x^{2})^{2}-' + n2 + '^{2}') + ' — Step 2 is right.' },
              { html: 'Step 3 — ' + t('x^{2}+' + n2) + ' should also be factored.', why: t('x^{2}+' + n2) + ' is a sum of squares — prime. Look at the other bracket.' }],
              sh.pr.sol, ['Check every bracket in Step 2: can it be factored again?'], 'Rowan error');
          } },
          { id: 'e14a2', sub: 'a fix', level: 'ADV', make: function (r, sh) { var n2 = sh.n * sh.n, p = fac(sh.pr, { prompt: 'Give the complete factorization of ' + t(sh.pr.tex) + '.' }); p.bad.push(sh.k + '(x^{2}-' + n2 + ')(x^{2}+' + n2 + ')'); return p; } },
          { id: 'e14b1', sub: 'b step', level: 'EMG', make: function (r, sh) {
            return mcPart(r, 'Maya was asked to solve ' + t('x^{2}=' + sh.m + 'x') + '.<br>Step 1: ' + t('x^{2}=' + sh.m + 'x') + '<br>Step 2: divide both sides by ' + t('x') + '<br>Step 3: ' + t('x=' + sh.m) + '<br>Which step is wrong, and what did she lose?', [
              { html: 'Step 2 — dividing by ' + t('x') + ' is only allowed if ' + t('x\\neq0') + ', so it throws away the root ' + t('x=0') + '.', right: true },
              { html: 'Step 3 — it should be ' + t('x=-' + sh.m) + '.', why: 'Substitute ' + t('x=' + sh.m) + ': ' + t(sh.m * sh.m + '=' + sh.m * sh.m) + ' ✓. Her answer is a solution; she lost another one.' },
              { html: 'Step 1 — she copied the equation wrong.', why: 'Step 1 is the given equation. Look at Step 2.' },
              { html: 'No step is wrong; ' + t('x=' + sh.m) + ' is the only solution.', why: 'Substitute ' + t('x=0') + ': ' + t('0=0') + ' ✓ — that is a solution too.' }],
              'Dividing by ' + t('x') + ' assumes ' + t('x\\neq0') + ' and loses the root ' + t('x=0') + '. Instead: ' + t('x^{2}-' + sh.m + 'x=0') + ', ' + t('x(x-' + sh.m + ')=0') + ', so ' + t('x=0') + ' or ' + t('x=' + sh.m) + '.', ['Substitute ' + t('x=0') + ' into the original equation.'], 'Maya error');
          } },
          { id: 'e14b2', sub: 'b fix', level: 'EMG', make: function (r, sh) { return solvePart(rhsEq(Eq({ fs: [[1, 0], [1, -sh.m]] }), 'x'), { prompt: 'Give <b>all</b> the solutions of ' + t('x^{2}=' + sh.m + 'x') + '.' }); } }] },
      { num: '15', section: 'Part E — Working Backwards', stem: 'Build an equation, in the form (polynomial) ' + t('=0') + ' with integer coefficients and no common factor, whose roots are exactly the numbers given. Expand your answer.', parts: [
        { id: 'e15a', level: 'ADV', make: function (r) { var ab = two(r, [1, 9], [-9, -1], function (a, b) { return a + b !== 0; }) || [3, -5]; return buildPrim([[1, -ab[0]], [1, -ab[1]]], 'roots ' + t('x=' + ab[0]) + ' and ' + t('x=' + ab[1])); } },
        { id: 'e15b', level: 'MAS', make: function (r) { var pq = coprime(r, 2, 4, 1, 5, function (q, p) { return p % q !== 0; }) || [2, 1], b = r.int(1, 7) * r.pick([1, -1]), s = r.pick([1, -1]); return buildPrim([[pq[0], -s * pq[1]], [1, -b]], 'roots ' + t('x=' + rtex(ex.norm(s * pq[1], pq[0]))) + ' and ' + t('x=' + b)); } },
        { id: 'e15c', level: 'ADV', make: function (r) { var a = r.int(2, 12) * r.pick([1, 1, -1]); return buildPrim([[1, 0], [1, -a]], 'roots ' + t('x=0') + ' and ' + t('x=' + a)); } }] },
      { num: '16', stem: 'Missing coefficients.', shared: function (r) { var o = allCPartShared(r); return o; },
        parts: [
          { id: 'e16a', level: 'PRG', make: function (r) {
            var n = r.int(2, 12), v = LV(r), q = n * n;
            var p = K.P.valueSet('(a) Determine <b>both</b> values of ' + t('k') + ' that make ' + t(v + '^{2}+k' + v + '+' + q) + ' a perfect square trinomial.', [2 * n, -2 * n], { v: 'k', diag: function (A) { if (A.some(function (x) { return Math.abs(x) === n; })) return { code: 'k-half', hint: 'The middle coefficient is <b>twice</b> the product of the square roots: ' + t('2\\times' + n) + '.' }; return null; } },
              t(q + '=' + n + '^{2}') + ', so the square is ' + t('(' + v + '+' + n + ')^{2}') + ' or ' + t('(' + v + '-' + n + ')^{2}') + ': the middle term is ' + t('\\pm2(1)(' + n + ')' + v + '=\\pm' + 2 * n + v) + '.<br>' + t('k=' + 2 * n) + ' gives ' + t('(' + v + '+' + n + ')^{2}') + '; ' + t('k=-' + 2 * n) + ' gives ' + t('(' + v + '-' + n + ')^{2}') + '.',
              ['The middle coefficient of a perfect square is ' + t('\\pm2\\times') + ' (the square roots of the first and last coefficients).'], 'k for perfect square');
            p.bad = ['k=' + 2 * n, 'k=' + n + ', k=-' + n]; return p;
          } },
          { id: 'e16b', level: 'MAS', make: function (r, sh) { return sh.partB; } },
          { id: 'e16c', level: 'EMG', make: function (r, sh) {
            var b = sh.b, v = sh.v, c = b * b / 4;
            var p = B.number('(c) Which value of ' + t('c') + ' from part (b) gives a perfect square trinomial?', c, function (y) { return y === b ? { code: 'k-half', hint: 'Half of ' + t(b) + ' is ' + t(b / 2) + '; the constant is its <b>square</b>.' } : null; },
              t(v + '^{2}+' + b + v + '+' + c + '=(' + v + '+' + b / 2 + ')^{2}') + ': the pair is ' + t(b / 2 + '+' + b / 2) + ', so ' + t('c=' + b / 2 + '^{2}=' + c) + '.', ['A perfect square comes from the pair of equal numbers that add to ' + t(b) + '.'], 'perfect square c');
            p.bad = [String(b / 2), String(b)]; return p;
          } }] },
      { num: '17', stem: '', parts: [
        { id: 'e17', level: 'MAS', make: function (r) { return allBPart(r, { lo: 6, hi: 45, np: [2, 3], book: { a: 2, c: 3 } }); } }] },
      { num: '18', section: 'Part F — Applications', stem: function (sh) { return 'The area of a rectangle is ' + t('(' + sh.T.tex + ')\\ \\text{cm}^{2}') + '.'; },
        shared: function (r) { var o = decPick(r, { a: [2, 3], u: [1, 5], b: 1, v: [1, 5], test: function (o) { return o.Bm <= 15; }, book: { a: 2, u: 1, b: 1, v: 3 } }); var T = tri(o), x = r.int(2, 6); if (P.at(T.f1, { x: x }) === P.at(T.f2, { x: x })) x = x === 6 ? 5 : x + 1; return { o: o, T: T, x: x }; },
        parts: [
          { id: 'e18a', level: 'EMG', make: function (r, sh) { var p = fac(sh.T, { prompt: '(a) Determine expressions for the length and the width (factor the area).' }); p.solution += '<br>The sides are ' + t(pz(sh.T.f1)) + ' cm and ' + t(pz(sh.T.f2)) + ' cm.'; return p; } },
          { id: 'e18b', level: 'PRG', make: function (r, sh) {
            var T = sh.T, Per = P.scale(S(T.f1, T.f2), 2), half = S(T.f1, T.f2);
            var p = B.poly('(b) Determine a simplified expression for the perimeter.', Per, { wrong: [{ is: half, code: 'dims-perim', hint: 'That is one length plus one width. The perimeter goes all the way around: ' + t('P=2(l+w)') + '.' }, { is: T.expr, code: 'perim-area', hint: 'That is the area. The perimeter is ' + t('2(l+w)') + '.' }] },
              t('P=2\\big[' + pz(T.f1) + '+' + pz(T.f2) + '\\big]=2(' + tx(half) + ')=' + tx(Per)) + ' cm.', ['Perimeter ' + t('=2(l+w)') + ' with the two factors from part (a).'], 'perimeter', { after: t('\\text{ cm}') });
            p.bad = [tx(half)]; return p;
          } },
          { id: 'e18c', level: 'EMG', make: function (r, sh) {
            var T = sh.T, x = sh.x, a = P.at(T.f1, { x: x }), b = P.at(T.f2, { x: x }), L = Math.max(a, b), W = Math.min(a, b), Pm = 2 * (a + b), A = a * b, lb = ['Length', 'Width', 'Perimeter', 'Area'];
            var chk = function (resp) {
              resp = resp || []; var v = [];
              for (var i = 0; i < 4; i++) { var rd = K.read(resp[i] == null ? '' : resp[i]); if (rd.res) return { v: rd.res.v, code: rd.res.code, hint: '<b>' + lb[i] + ':</b> ' + rd.res.hint }; v.push(rd.val); }
              if (!((v[0] === L && v[1] === W) || (v[0] === W && v[1] === L))) return wrong('u4l9-dims', '<b>Length and width:</b> substitute ' + t('x=' + x) + ' into each factor.');
              if (v[0] === W && v[1] === L && L !== W) return form('u4l9-dims', 'Right numbers — the length is the longer side.');
              if (v[2] !== Pm) return wrong(v[2] === a + b ? 'dims-perim' : 'u4l10-perim', '<b>Perimeter:</b> ' + t('P=2(l+w)') + '.');
              if (v[3] !== A) return wrong(v[3] === Pm ? 'perim-area' : 'value', '<b>Area:</b> ' + t('A=lw') + '.');
              return ok();
            };
            var p = B.fields('(c) Determine the actual dimensions, perimeter and area when ' + t('x=' + x) + '.', lb.map(function (l, i) { return { name: l, label: l, after: i === 3 ? t('\\text{cm}^{2}') : 'cm' }; }), [chk, function () { return ok(); }, function () { return ok(); }, function () { return ok(); }], [String(L), String(W), String(Pm), String(A)],
              'length ' + t(L) + ' cm, width ' + t(W) + ' cm, perimeter ' + t(Pm) + ' cm, area ' + t(A) + ' cm²',
              t(tx(T.f1) + '=' + a) + ' and ' + t(tx(T.f2) + '=' + b) + ' at ' + t('x=' + x) + '. Perimeter ' + t('2(' + a + '+' + b + ')=' + Pm) + ' cm; area ' + t(a + '\\times' + b + '=' + A) + ' cm² (and ' + t(T.tex.replace(/x/g, '(' + x + ')') + '=' + P.at(T.expr, { x: x })) + ' ✓).',
              ['Substitute ' + t('x=' + x) + ' into each factor first.'], 'rectangle at x');
            p.check = chk; p.bad = [[String(L), String(W), String(a + b), String(A)], [String(L), String(W), String(Pm), String(Pm)]]; return p;
          } }] },
      { num: '19', stem: function (sh) { return 'The volume of a rectangular box is ' + t('(' + sh.T.tex + ')\\ \\text{cm}^{3}') + '.'; },
        shared: function (r) { var uv = monic(r, { u: [1, 8], v: [1, 8], test: function (u, v) { return u < v; }, book: [2, 4] }); return { uv: uv, T: tri({ k: X, a: 1, u: uv[0], b: 1, v: uv[1] }), x: r.int(2, 6) }; },
        parts: [
          { id: 'e19a', level: 'PRG', make: function (r, sh) { var p = fac(sh.T, { prompt: '(a) Factor the volume completely to find expressions for the three dimensions.' }); p.solution += '<br>The dimensions are ' + t('x') + ', ' + t(pz(sh.T.f1)) + ' and ' + t(pz(sh.T.f2)) + ' cm.'; return p; } },
          { id: 'e19b', level: 'EMG', make: function (r, sh) {
            var x = sh.x, d = [x, x + sh.uv[0], x + sh.uv[1]], vol = d[0] * d[1] * d[2], lb = ['Dimension 1', 'Dimension 2', 'Dimension 3'];
            var chk = function (resp) {
              resp = resp || []; var got = [];
              for (var i = 0; i < 3; i++) { var a = K.read(resp[i] == null ? '' : resp[i]); if (a.res) return { v: a.res.v, code: a.res.code, hint: '<b>' + lb[i] + ':</b> ' + a.res.hint }; got.push(a.val); }
              var used = [false, false, false], miss = 0;
              got.forEach(function (g) { var j = d.findIndex(function (v, i) { return !used[i] && v === g; }); if (j >= 0) used[j] = true; else miss++; });
              return miss ? wrong('u4l9-dims', 'Substitute ' + t('x=' + x) + ' into each of the three factors.') : ok();
            };
            var p = B.fields('(b) Determine the three dimensions when ' + t('x=' + x) + ' (any order).', lb.map(function (l) { return { name: l, label: l, after: 'cm' }; }), [chk, function () { return ok(); }, function () { return ok(); }], d.map(String), d.map(function (v) { return t(v); }).join(', ') + ' cm',
              t('x=' + x) + ', ' + t('x+' + sh.uv[0] + '=' + d[1]) + ', ' + t('x+' + sh.uv[1] + '=' + d[2]) + '. Check: ' + t(d.join('\\times') + '=' + vol) + ' and ' + t(sh.T.tex.replace(/x/g, '(' + x + ')') + '=' + P.at(sh.T.expr, { x: x })) + ' ✓',
              ['Substitute ' + t('x=' + x) + ' into each factor from part (a).'], 'box at x');
            p.check = chk; p.bad = [[String(d[0]), String(d[1]), String(x + sh.uv[0] + sh.uv[1])]]; p.good = [[String(d[2]), String(d[0]), String(d[1])]];
            return p;
          } },
          { id: 'e19c', level: 'EMG', make: function (r, sh) { return mcPart(r, '(c) Why must ' + t('x') + ' be greater than ' + t('0') + ' for this box to exist?', [
              { html: 'One dimension is ' + t('x') + ' itself; if ' + t('x\\le0') + ' that dimension would be zero or negative, and a length must be positive.', right: true },
              { html: 'Because the volume formula only works for whole numbers.', why: 'It works for any number. Look at the dimension ' + t('x') + '.' },
              { html: 'Because ' + t(tx(sh.T.f1)) + ' would be negative for every ' + t('x<5') + '.', why: 'At ' + t('x=1') + ', ' + t(tx(sh.T.f1) + '=' + (1 + sh.uv[0])) + ' — positive. Look at the dimension ' + t('x') + '.' },
              { html: 'There is no reason — ' + t('x') + ' can be any number.', why: 'At ' + t('x=0') + ' one dimension is ' + t('0') + ': there is no box.' }],
              'The dimensions are ' + t('x') + ', ' + t(pz(sh.T.f1)) + ' and ' + t(pz(sh.T.f2)) + '. Lengths must be positive, and the dimension ' + t('x') + ' is positive only when ' + t('x>0') + '.', ['Look at each dimension when ' + t('x=0') + '.'], 'why x>0'); } }] },
      { num: '20', stem: 'Consecutive-integer problems.',
        shared: function (r) { var n = r.int(4, 25), m = r.int(2, 24) * 2; return { n: n, m: m } ; },
        parts: [
          { id: 'e20a1', sub: 'a solve', level: 'PRG', make: function (r, sh) { var n = sh.n, E = Eq({ v: 'n', fs: [[1, -n], [1, n + 1]], show: 'rhs', R: N(n * (n + 1)), lhsTex: 'n(n+1)', rhsTex: String(n * (n + 1)) }); return solvePart(E, { prompt: '(a) The product of two consecutive positive integers is ' + t(n * (n + 1)) + '. With the smaller one ' + t('n') + ': ' + t('n(n+1)=' + n * (n + 1)) + '. Solve it by factoring (give both roots).' }); } },
          { id: 'e20a2', sub: 'a integers', level: 'EMG', make: function (r, sh) { return twoNums(sh.n, sh.n + 1, ['Smaller integer', 'Larger integer'], 'Reject the root that doesn’t fit, then give the two integers.', 'Reject ' + t('n=' + (-sh.n - 1)) + ': the integers must be positive. So the integers are ' + t(sh.n) + ' and ' + t(sh.n + 1) + '.', [-sh.n - 1, -sh.n]); } },
          { id: 'e20b1', sub: 'b solve', level: 'ADV', make: function (r, sh) { var m = sh.m, E = Eq({ v: 'n', fs: [[1, -m], [1, m + 2]], show: 'rhs', R: N(m * (m + 2)), lhsTex: 'n(n+2)', rhsTex: String(m * (m + 2)) }); return solvePart(E, { prompt: '(b) The product of two consecutive <b>even</b> integers is ' + t(m * (m + 2)) + '. With the smaller one ' + t('n') + ': ' + t('n(n+2)=' + m * (m + 2)) + '. Solve it by factoring (give both roots).' }); } },
          { id: 'e20b2', sub: 'b pairs', level: 'ADV', make: function (r, sh) {
            var m = sh.m, want = [[m, m + 2], [-m - 2, -m]];
            var chk = function (resp) {
              resp = (resp || []).filter(function (p) { return p && (String(p[0]).trim() || String(p[1]).trim()); });
              if (!resp.length) return form('empty', 'Type the first pair, then press <b>+ Add another pair</b>.');
              var got = [];
              for (var i = 0; i < resp.length; i++) { var a = K.read(resp[i][0]), b = K.read(resp[i][1]); if (a.res || b.res) return form('incomplete', 'Each pair needs a number in both boxes.'); got.push([Math.min(a.val, b.val), Math.max(a.val, b.val)]); }
              var hit = want.filter(function (w) { return got.some(function (g) { return g[0] === w[0] && g[1] === w[1]; }); }).length;
              if (hit === 2 && got.length === 2) return ok();
              if (hit === 1 && got.length === 1) return wrong('u4l10-pairs', 'That pair works. There is another one: the question doesn’t say the integers are positive — use the other root too.');
              return wrong('u4l10-pairs', 'Each root ' + t('n') + ' gives the pair ' + t('n') + ' and ' + t('n+2') + '. Check that each pair multiplies to ' + t(m * (m + 2)) + '.');
            };
            return { prompt: 'Give <b>both</b> pairs of consecutive even integers that work (smaller number first).', input: { type: 'pairs', start: 1 }, check: chk, key: want.map(function (w) { return [String(w[0]), String(w[1])]; }),
              answer: t(m + '\\text{ and }' + (m + 2)) + ', or ' + t((-m - 2) + '\\text{ and }' + (-m)), solution: 'The roots are ' + t('n=' + m) + ' and ' + t('n=' + (-m - 2)) + '. Both are even, so both work: ' + t(m + '\\times' + (m + 2) + '=' + m * (m + 2)) + ' and ' + t('(' + (-m - 2) + ')\\times(' + (-m) + ')=' + m * (m + 2)) + '.',
              hints: ['Use each root as the smaller integer ' + t('n') + '; the larger is ' + t('n+2') + '.'], text: 'both even pairs', bad: [[[String(m), String(m + 2)]], [[String(m), String(m + 2)], [String(-m), String(-m - 2 + 4)]]] };
          } }] },
      { num: '21', stem: function (sh) { var o = sh.o; return 'The legs of a right triangle measure ' + t('x') + ' cm and ' + t('(x+' + o.p + ')') + ' cm, and the hypotenuse measures ' + t('(x+' + o.q + ')') + ' cm.'; },
        shared: function (r) { return { o: pythag(r) }; },
        parts: [
          { id: 'e21a', level: 'ADV', make: function (r, sh) {
            var o = sh.o, E = o.E;
            return solvePart(E, { prompt: '(a) Use the Pythagorean theorem to write an equation, simplify it to a quadratic, and solve it by factoring (give both roots).', sol: t('x^{2}+(x+' + o.p + ')^{2}=(x+' + o.q + ')^{2}') + '<br>' + t('x^{2}+x^{2}+' + 2 * o.p + 'x+' + o.p * o.p + '=x^{2}+' + 2 * o.q + 'x+' + o.q * o.q) + '<br>' + t(E.ptex + '=0') + '<br>' + t('(x-' + o.a + ')(x+' + (-o.other) + ')=0') + ', so ' + t('x=' + o.a) + ' or ' + t('x=' + o.other) + '.',
              hints: ['Write ' + t('a^{2}+b^{2}=c^{2}') + ' with the three sides, expand each square, and collect everything on one side.'] });
          } },
          { id: 'e21b', level: 'EMG', make: function (r, sh) {
            var o = sh.o, s = o.sides, lb = ['Shorter leg', 'Longer leg', 'Hypotenuse'];
            var chk = function (resp) {
              resp = resp || []; var v = [];
              for (var i = 0; i < 3; i++) { var a = K.read(resp[i] == null ? '' : resp[i]); if (a.res) return { v: a.res.v, code: a.res.code, hint: '<b>' + lb[i] + ':</b> ' + a.res.hint }; v.push(a.val); }
              if (v[0] === s[0] && v[1] === s[1] && v[2] === s[2]) return ok();
              if (v.some(function (y) { return y <= 0; })) return wrong('u4l9-pick', 'A side can’t be zero or negative — reject the negative root and use ' + t('x=' + o.a) + '.');
              return wrong('u4l9-dims', 'Use ' + t('x=' + o.a) + ': the sides are ' + t('x') + ', ' + t('x+' + o.p) + ' and ' + t('x+' + o.q) + '.');
            };
            var p = B.fields('(b) Reject the impossible root and state the three side lengths.', lb.map(function (l) { return { name: l, label: l, after: 'cm' }; }), [chk, function () { return ok(); }, function () { return ok(); }], s.map(String), s.map(function (v) { return t(v); }).join(', ') + ' cm',
              'Reject ' + t('x=' + o.other) + ': a length can’t be negative. With ' + t('x=' + o.a) + ': ' + t(s[0]) + ', ' + t(s[1]) + ' and ' + t(s[2]) + ' cm (' + t(s[0] + '^{2}+' + s[1] + '^{2}=' + (s[0] * s[0] + s[1] * s[1]) + '=' + s[2] + '^{2}') + ' ✓).', ['Use the positive root.'], 'triangle sides');
            p.check = chk; p.bad = [[String(o.other), String(o.other + o.p), String(o.other + o.q)]]; return p;
          } }] },
      { num: '22', section: 'Part G — Challenge', stem: 'Factor completely. Treat ' + t('x^{2}') + ' as the variable and factor the trinomial first; then look hard at each bracket. The answer is a product of <b>four</b> linear factors.', parts: [
        { id: 'e22', level: 'ADV', make: function (r) { var pq = twoSq9(r, [1, 3], 6); return quartic(pq[0], pq[1], r.pick(['x', 'x', 'y'])); } }] },
      { num: '23', stem: 'Solve. Factor completely first, then use the zero product property.', parts: [
        { id: 'e23', level: 'ADV', make: function (r) { var pq = twoSq9(r, [1, 3], 6), v = r.pick(['x', 'x', 'y']); return solvePart(Eq({ v: v, fs: [[1, -pq[0]], [1, pq[0]], [1, -pq[1]], [1, pq[1]]] }), { how: 'a trinomial in ' + t(v + '^{2}') + ', then difference of squares twice', sol: quarticSol(pq[0], pq[1], v) + '<br>A fourth-degree polynomial can have up to four linear factors, and each one gives a root.' }); } }] },
      { num: '24', stem: 'Factor completely over the integers. <i>Hint:</i> ' + t('x^{6}=(x^{3})^{2}') + ', so begin with a difference of squares; then use ' + t('a^{3}-b^{3}=(a-b)(a^{2}+ab+b^{2})') + ' and ' + t('a^{3}+b^{3}=(a+b)(a^{2}-ab+b^{2})') + ' on the two brackets.', parts: [
        { id: 'e24', level: 'MAS', make: function (r) {
          var n = r.pick([1, 1, 2]), k = r.pick([1, 1, 2, 3]), v = r.pick(['x', 'x', 'y', 'a', 'm']), x1 = V(v), x2 = {}; x2[v] = 2;
          var list = (k > 1 ? [N(k)] : []).concat([S(x1, N(-n)), S(x1, N(n)), S(M(1, x2), M(n, v), N(n * n)), S(M(1, x2), M(-n, v), N(n * n))]);
          var expr = FA.product(list), x3m = S(M(1, (function () { var o = {}; o[v] = 3; return o; })()), N(-n * n * n)), x3p = S(M(1, (function () { var o = {}; o[v] = 3; return o; })()), N(n * n * n));
          var p = B.factored(t(tx(expr)), list, { wrong: [{ is: (k > 1 ? [N(k)] : []).concat([x3m, x3p]), code: 'not-finished', hint: 'Right first step — now factor the difference and the sum of cubes.' }] },
            (k > 1 ? 'GCF ' + t(k) + ' first. ' : '') + t(tx(P.scale(expr, [1, k])) + '=(' + v + '^{3})^{2}-' + (n * n * n) + '^{2}=(' + tx(x3m) + ')(' + tx(x3p) + ')') + '.<br>' + t(tx(x3m) + '=(' + tx(list[k > 1 ? 1 : 0]) + ')(' + tx(list[k > 1 ? 3 : 2]) + ')') + ' and ' + t(tx(x3p) + '=(' + tx(list[k > 1 ? 2 : 1]) + ')(' + tx(list[k > 1 ? 4 : 3]) + ')') + '.<br>Neither quadratic factors over the integers, so ' + t(tx(expr) + '=' + lst(list)) + '.',
            ['Start with a difference of squares: ' + t('(' + v + '^{3})^{2}-' + (n * n * n) + '^{2}') + '.', 'Then use the difference and sum of cubes on the two brackets.'], 'x^6 - n^6');
          p.bad = [lst((k > 1 ? [N(k)] : []).concat([x3m, x3p]))];
          return p;
        } }] }
    ]
  });
  function twoSq9(r, rng, hi) { for (var i = 0; i < 100; i++) { var p = r.int(rng[0], rng[1]), q = r.int(p + 1, hi); if (p !== q) return [p, q]; } return [2, 3]; }
  function allCPartShared(r) { var p = allCPart(r); return { partB: p, b: p.b, v: p.v }; }
})(window);
