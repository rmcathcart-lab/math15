/* Math 15 · Unit 4 · Lesson 8 — Choosing a Factoring Strategy (AN5)
 * Assignment 8 (u4_L08.tex, questions 1–15) and the Lesson 8 Extra Practice (u4_EP08.tex, questions 1–16).
 * Modelled on Math 10C u4l7. Every expression is built from its factors (tri / dos below: k·(aX + uY)(bX + vY) and
 * k·(A² − B²), with "again" for a second difference of squares), so keys, classic wrong answers and worked solutions
 * come from the same numbers. Each part keeps the booklet question's structure (which checklist step applies, signs,
 * letters, a GCF first, perfect squares, x² blocks) and the booklet's own numbers are among the possible values.
 * "Name the method" items are chip selections (one part per expression) or grids; "factor, or say it is prime" items use
 * one poly box with a none key (typing "prime" is accepted too). The checklist names are the booklet's: GCF, difference
 * of squares, perfect square trinomial, trinomial a = 1 (inspection), trinomial a ≠ 1 (decomposition), prime.
 * Levels (Math 15): BEG one named method; EMG a sign twist or a ≠ 1; PRG GCF first then a second method; ADV three
 * stages / reasoning / prime-building; MAS three stages with x⁵ (extra 3c) and the four-linear-factor quartic (extra 16a). */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, P = HW.poly, FA = HW.factor;

  /* codes reused from Math 10C (same meaning) */
  HW.addCodes({
    'swap-signs': 'Factor pair with both signs switched', 'pair-place': 'Numbers in the wrong brackets (middle term off)',
    'gcf-missing': 'Dropped the common factor', 'drop-var': 'Left the second variable out of the brackets',
    'dos-square': 'Wrote a difference of squares as a square', 'sum-squares': 'Factored a sum of squares as a difference',
    'sum-as-square': 'Wrote a sum of squares as a square', 'pst-as-dos': 'Wrote a perfect square as a difference of squares',
    'said-none': 'Said it does not factor (it does)', 'not-none': 'Factored something that does not factor', 'none-hint': 'Rewrote an expression that does not factor',
    'not-finished': 'Accepted an answer that is not factored completely', 'gcf-not-greatest': 'A common factor, but not the greatest', 'row': 'A row of the table wrong',
    'k-half': 'Middle coefficient not doubled', 'nr-sign': 'Sign slip in the numerical response'
  });
  HW.addCodes({
    'u4l8-gcf-missed': 'Method: missed the GCF step', 'u4l8-gcf-extra': 'Method: chose GCF when there is no common factor', 'u4l8-pst-missed': 'Method: missed the perfect square trinomial',
    'u4l8-method': 'Method: wrong method for the shape', 'u4l8-one-method': 'Method: only one of the two methods', 'u4l8-not-prime': 'Built an expression that factors (not prime)',
    'u4l8-not-squares': 'Built terms that are not both perfect squares', 'u4l8-b-works': 'Chose a b that makes it factor', 'u4l8-expand': 'Expansion slip (working backwards)',
    'u4l8-dims': 'One of the three dimensions wrong', 'u4l8-whole-area': 'Gave the sheet’s area (hole not subtracted)'
  });
  HW.addPartial({ 'u4l8-gcf-missed': 'b', 'u4l8-gcf-extra': 'b', 'u4l8-pst-missed': 'b', 'u4l8-method': 'n', 'u4l8-one-method': 'b', 'u4l8-not-prime': 'n', 'u4l8-not-squares': 'n',
    'u4l8-b-works': 'n', 'u4l8-expand': 's', 'u4l8-dims': 's', 'u4l8-whole-area': 'b' });

  /* ---------------- small helpers ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function M(c, v) { var o = {}; if (typeof v === 'string') { if (v) o[v] = 1; } else if (v) o = v; return P.mono(c, o); }
  function N(c) { return P.num(c); }
  function S() { return P.add.apply(null, arguments); }
  function tx(p) { return P.tex(p); }
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

  HW.defineLesson({
    id: 'u4l8', unit: 4, num: '8', title: 'Choosing a Factoring Strategy', outcome: 'AN5',
    blurb: 'The factoring checklist: take out the GCF first, count the terms that are left, then check whether any factor can be factored again.',
    questions: [
      { num: '1', section: 'Part A — Naming the Strategy', stem: 'Name the method (or methods, in order) you would use to factor each expression. You do <b>not</b> need to factor.', parts: [
        { id: '1a', level: 'BEG', make: function (r) { return methodSelect(mkDos(r, [1, 1, 1, 2, 3])); } },
        { id: '1b', level: 'BEG', make: function (r) { return methodSelect(mkInsp(r)); } },
        { id: '1c', level: 'BEG', make: function (r) { return methodSelect(mkGcfOnly(r)); } },
        { id: '1d', level: 'BEG', make: function (r) { return methodSelect(mkDec(r)); } },
        { id: '1e', level: 'BEG', make: function (r) { return methodSelect(mkPst(r)); } },
        { id: '1f', level: 'EMG', make: function (r) { return methodSelect(mkGcfDos(r)); } }] },
      { num: '2', section: 'Part B — One Method at a Time', stem: 'Factor completely (GCF only).', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var k = r.int(2, 9), q = r.int(1, 9) * r.pick([1, 1, 1, 2]), p = 1; if (gcd(p, q) !== 1) q = 1; return fac(gcfOnly(M(k, 'x'), S(M(p, 'x'), N(q)))); } },
        { id: '2b', level: 'EMG', make: function (r) { var pq = coprime(r, 2, 5, 1, 7, function (p, q) { return p !== q; }) || [2, 3], k = r.int(2, 5); return fac(gcfOnly(M(k, { x: 2 }), S(M(pq[0], 'x'), N(-pq[1])))); } },
        { id: '2c', level: 'EMG', make: function (r) { var pq = coprime(r, 2, 5, 1, 7, function (p, q) { return p !== q; }) || [2, 3], k = r.int(2, 6), w = r.pick(['y', 'y', 'z']); return fac(gcfOnly(M(k, 'x'), S(M(pq[0], w), N(-pq[1])))); } }] },
      { num: '3', stem: 'Factor completely (difference of squares).', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return fac(dos({ A: V(LV(r)), B: N(r.int(2, 13)) })); } },
        { id: '3b', level: 'BEG', make: function (r) { var ab = coprime(r, 2, 5, 3, 11, function (a, b) { return a !== b; }) || [2, 5]; return fac(dos({ A: M(ab[0], 'x'), B: N(ab[1]) })); } },
        { id: '3c', level: 'EMG', make: function (r) { var a = r.int(2, 12); return fac(dos({ A: M(a, LV(r)), B: N(1) })); } }] },
      { num: '4', stem: 'Factor completely (trinomial, leading coefficient ' + t('1') + ').', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var uv = monic(r, { u: [1, 9], v: [1, 9], test: function (u, v) { return u * v <= 40 && u > v; }, book: [7, 2] }); return fac(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: '4b', level: 'EMG', make: function (r) { var uv = monic(r, { u: [-9, -1], v: [1, 9], test: function (u, v) { return u + v < 0 && u * v >= -40; }, book: [-7, 3] }); return fac(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: '4c', level: 'EMG', make: function (r) { var uv = monic(r, { u: [-9, -1], v: [-9, -1], test: function (u, v) { return u * v >= 10 && u * v <= 45; }, book: [-5, -6] }); return fac(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '5', section: 'Part C — Remove the GCF First', stem: 'Factor completely. (Hint: remove the GCF first.)', parts: [
        { id: '5a', level: 'PRG', make: function (r) { var uv = monic(r, { u: [1, 8], v: [1, 8], test: function (u, v) { return u * v <= 24 && u > v; }, book: [6, 2] }); return fac(tri({ k: r.int(2, 5), a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: '5b', level: 'PRG', make: function (r) { var uv = monic(r, { u: [-8, -1], v: [1, 8], test: function (u, v) { return u + v < 0 && u * v >= -36; }, book: [-4, 3] }); return fac(tri({ k: r.int(2, 5), a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: '5c', level: 'PRG', make: function (r) { var uv = monic(r, { u: [1, 6], v: [1, 6], test: function (u, v) { return u * v <= 20 && u < v; }, book: [2, 3] }); return fac(tri({ k: r.pick([2, 3, 4, 5, 6]), a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '6', stem: 'Factor completely. (Hint: this will take two steps.)', parts: [
        { id: '6a', level: 'PRG', make: function (r) { return fac(dos({ k: r.pick([2, 3, 5, 6]), A: X, B: N(r.int(2, 7)) })); } },
        { id: '6b', level: 'PRG', make: function (r) { return fac(dos({ k: r.pick([2, 3, 4]), A: X, B: N(r.int(3, 9)) })); } },
        { id: '6c', level: 'PRG', make: function (r) { return fac(dos({ k: r.pick([5, 6, 7]), A: X, B: N(r.int(2, 8)) })); } }] },
      { num: '7', section: 'Part D — Perfect Squares and Harder Trinomials', stem: 'Factor completely (perfect square trinomials).', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var n = r.int(1, 12); return fac(tri({ X: V(LV(r)), a: 1, u: n, b: 1, v: n })); } },
        { id: '7b', level: 'EMG', make: function (r) { var n = -r.int(2, 12); return fac(tri({ X: V(LV(r)), a: 1, u: n, b: 1, v: n })); } },
        { id: '7c', level: 'EMG', make: function (r) { var ab = coprime(r, 2, 5, 1, 9, function (a, b) { return a !== b; }) || [2, 3]; return fac(tri({ a: ab[0], u: ab[1], b: ab[0], v: ab[1] })); } }] },
      { num: '8', stem: 'Factor completely (trinomial, leading coefficient not ' + t('1') + ').', parts: [
        { id: '8a', level: 'EMG', make: function (r) { return fac(tri(decPick(r, { a: [2, 3], u: [1, 7], b: 1, v: [1, 7], test: function (o) { return o.Bm <= 20 && o.C <= 21; }, book: { a: 2, u: 1, b: 1, v: 5 } }))); } },
        { id: '8b', level: 'PRG', make: function (r) { return fac(tri(decPick(r, { a: [2, 5], u: [-7, -1], b: 1, v: [-5, -1], test: function (o) { return o.C <= 30; }, book: { a: 3, u: -4, b: 1, v: -2 } }))); } },
        { id: '8c', level: 'PRG', make: function (r) { return fac(tri(decPick(r, { a: [2, 3], u: [-7, 7], b: 1, v: [-5, 5], test: function (o) { return o.C < 0 && o.Bm > 0 && o.C >= -30; }, book: { a: 2, u: -5, b: 1, v: 3 } }))); } }] },
      { num: '9', section: 'Part E — Mixed Practice and Applications', stem: 'Factor completely. Use the checklist to decide which method applies each time.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { return fac(dos({ A: V(LV(r)), B: N(r.int(4, 15)) })); } },
        { id: '9b', level: 'PRG', make: function (r) { var uv = monic(r, { u: [1, 8], v: [1, 8], test: function (u, v) { return u * v <= 30 && u > v; }, book: [5, 4] }); return fac(tri({ k: r.int(2, 4), a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: '9c', level: 'EMG', make: function (r) { var n = r.pick([-1, 1, 1]) * r.int(3, 12); return fac(tri({ a: 1, u: n, b: 1, v: n })); } },
        { id: '9d', level: 'PRG', make: function (r) { return fac(dos({ k: r.int(2, 6), A: X, B: N(r.int(2, 7)) })); } },
        { id: '9e', level: 'EMG', make: function (r) { var uv = monic(r, { u: [-9, -1], v: [1, 9], test: function (u, v) { return u + v < 0 && u * v >= -45; }, book: [-5, 3] }); return fac(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: '9f', level: 'PRG', make: function (r) { return fac(tri(decPick(r, { a: [3, 5], u: [-5, 5], b: 1, v: [-5, 5], test: function (o) { return o.C < 0 && o.Bm > 0 && o.C >= -30; }, book: { a: 5, u: -2, b: 1, v: 3 } }))); } }] },
      { num: '10', stem: 'Factor completely.', parts: [
        { id: '10a', level: 'PRG', make: function (r) { var uv = monic(r, { u: [-6, -1], v: [1, 6], test: function (u, v) { return u + v < 0; }, book: [-3, 2] }); return fac(tri({ k: r.int(2, 6), a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: '10b', level: 'PRG', make: function (r) { var uv = monic(r, { u: [1, 6], v: [1, 6], test: function (u, v) { return u < v; }, book: [3, 4] }); return fac(tri({ k: r.pick([3, 4, 5, 6, 7]), a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '11', stem: function (sh) { return 'A rectangular picture frame has area ' + t('(' + sh.T.tex + ')') + ' square inches.'; },
        shared: function (r) { var uv = monic(r, { u: [3, 9], v: [-7, -2], test: function (u, v) { return u + v > 0; }, book: [8, -5] }); return { u: uv[0], v: uv[1], T: tri({ a: 1, u: uv[0], b: 1, v: uv[1] }), x: r.int(2 - uv[1], 15) }; },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) { return fac(sh.T, { prompt: '(a) Factor the area to find binomials for the length and width.' }); } },
          { id: '11b', level: 'BEG', make: function (r, sh) {
            var Wd = S(X, N(sh.v)), Lg = S(X, N(sh.u));
            var p = B.poly('(b) If the width is ' + t(tx(Wd)) + ', state the length.', Lg, { wrong: [{ is: Wd, code: 'value', hint: 'That is the width. The length is the <b>other</b> factor.' }, { is: sh.T.expr, code: 'value', hint: 'That is the area. The length is the factor that multiplies with ' + t(pz(Wd)) + ' to give the area.' }, { is: S(X, N(-sh.u)), code: 'sign', hint: 'Check the sign: ' + t(pz(Wd) + pz(S(X, N(-sh.u)))) + ' does not give the area.' }] },
              t(sh.T.tex + '=' + pz(Lg) + pz(Wd)) + ', so the length is ' + t(tx(Lg)) + ' inches.', ['Area = length × width. Which factor is left?'], 'frame length');
            p.bad = [tx(Wd), tx(sh.T.expr)];
            return p;
          } },
          { id: '11c', level: 'EMG', make: function (r, sh) { return dims2(sh, sh.x); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var k = r.int(2, 7), n = r.int(2, 6), pr = dos({ k: k, A: X, B: N(n) });
          return mcPart(r, t(pr.tex) + ' is completely factored as', [
            { html: t(pr.keyTex), right: true },
            { html: t(k + '(x^{2}-' + n * n + ')'), why: 'Step 3 of the checklist: ' + t('x^{2}-' + n * n) + ' is still a difference of squares, so this is not finished.' },
            { html: t('(' + k + 'x-' + k * n + ')(x+' + n + ')'), why: 'It multiplies out correctly, but ' + t(k + 'x-' + k * n) + ' still has a common factor of ' + t(k) + ' — take the GCF out first.' },
            { html: t('x(' + k + 'x-' + k * n * n / 1 + ')'), why: 'Expand it: ' + t('x(' + k + 'x-' + k * n * n + ')=' + k + 'x^{2}-' + k * n * n + 'x') + ' — the last term would have an ' + t('x') + '. The GCF is ' + t(k) + ', not ' + t('x') + '.' }],
            pr.sol, ['Take out the GCF, then check whether the bracket can be factored again.'], 'completely factored ' + plain(pr.tex));
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var a = r.pick([1, 1, 1, 4, 9]), ra = Math.round(Math.sqrt(a)), n = a === 1 ? r.int(3, 15) : r.int(1, 9); if (gcd(ra, n) !== 1) n = 1; if (a === 1 && n < 3) n = 8;
          var kk = 2 * ra * n;
          return B.nr('If ' + t((a === 1 ? '' : a) + 'x^{2}+kx+' + n * n) + ' is a perfect square trinomial and ' + t('k>0') + ', then the value of ' + t('k') + ' is ________.', kk, function (v) {
            if (v === ra * n) return { code: 'k-half', hint: 'The middle term is <b>twice</b> the product of the square roots: ' + t('2\\times' + (a === 1 ? '' : ra + '\\times') + n) + '.' };
            if (v === n * n || v === a + n * n) return { code: 'value', hint: 'Use the square roots: ' + t(n * n + '=' + n + '^{2}') + (a === 1 ? '' : ' and ' + t(a + '=' + ra + '^{2}')) + '.' };
            return null;
          }, t((a === 1 ? '' : a) + 'x^{2}+kx+' + n * n + '=(' + (ra === 1 ? '' : ra) + 'x+' + n + ')^{2}') + ', and ' + t('(' + (ra === 1 ? '' : ra) + 'x+' + n + ')^{2}=' + (a === 1 ? '' : a) + 'x^{2}+' + kk + 'x+' + n * n) + ', so ' + t('k=2\\times' + (ra === 1 ? '' : ra + '\\times') + n + '=' + kk) + '.',
          ['The first and last terms are the squares of ' + t((ra === 1 ? '' : ra) + 'x') + ' and ' + t(n) + '. The middle term is twice their product.'], 'NR k for perfect square');
        } }] },
      { num: '14', stem: 'Factor completely.', parts: [
        { id: '14', level: 'PRG', make: function (r) { var uv = monic(r, { u: [1, 6], v: [1, 6], test: function (u, v) { return u < v && u * v <= 18; }, book: [2, 3] }); return fac(tri({ k: r.pick([4, 5, 6, 8, 9, 10]), a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '15', stem: 'Factor completely.', parts: [
        { id: '15', level: 'PRG', make: function (r) { var k = r.int(2, 5), n = r.int(1, 6); return fac(dos({ k: M(k, 'x'), A: X, B: N(n) })); } }] }
    ],
    extra: [
      { num: '1', section: 'Part A — Name the Strategy, Then Factor', stem: function (sh) { return 'Run the checklist from the top every time: <b>(1)</b> GCF first, <b>(2)</b> count the terms that are left, <b>(3)</b> check whether any factor can still be factored again.<br>' + sh.items.map(function (it, i) { return '(' + 'abcdef'.charAt(i) + ') ' + t(it.tex); }).join('&emsp; '); },
        shared: function (r) { return { items: e1Items(r) }; },
        parts: [{ id: 'e1s', sub: 'strategy', level: 'EMG', make: function (r, sh) { return gridOf(sh.items, 'Name the strategy for each expression.'); } }].concat('abcdef'.split('').map(function (L, i) {
          return { id: 'e1' + L, sub: L, level: ['PRG', 'EMG', 'EMG', 'PRG', 'PRG', 'ADV'][i], make: function (r, sh) { return itemPart(sh.items[i], '(' + L + ') Factor completely, or press <b>none</b> if it is prime: ' + t(sh.items[i].tex)); } };
        })) },
      { num: '2', stem: function (sh) { return 'Name the strategy, then factor completely.<br>' + sh.items.map(function (it, i) { return '(' + 'abcdef'.charAt(i) + ') ' + t(it.tex); }).join('&emsp; '); },
        shared: function (r) { return { items: e2Items(r) }; },
        parts: [{ id: 'e2s', sub: 'strategy', level: 'EMG', make: function (r, sh) { return gridOf(sh.items, 'Name the strategy for each expression.'); } }].concat('abcdef'.split('').map(function (L, i) {
          return { id: 'e2' + L, sub: L, level: ['PRG', 'BEG', 'EMG', 'PRG', 'EMG', 'PRG'][i], make: function (r, sh) { return itemPart(sh.items[i], '(' + L + ') Factor completely, or press <b>none</b> if it is prime: ' + t(sh.items[i].tex)); } };
        })) },
      { num: '3', section: 'Part B — Two Stages and Three Stages', stem: 'Factor completely. Each of these takes more than one step — after each step, ask of every factor: <i>can this one be factored again?</i>', parts: [
        { id: 'e3a', level: 'ADV', make: function (r) { var n = r.pick([1, 2, 3]), k = n === 3 ? r.pick([2, 3]) : r.int(2, 6), v = r.pick(['x', 'x', 'y']), A2 = {}; A2[v] = 2; return fac(dos({ k: k, A: M(1, A2), B: N(n * n), again: true })); } },
        { id: 'e3b', level: 'PRG', make: function (r) { var uv = monic(r, { u: [1, 7], v: [-6, -1], test: function (u, v) { return u + v > 0 && u * v >= -24; }, book: [5, -3] }); return fac(tri({ k: M(r.int(2, 6), 'x'), a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: 'e3c', level: 'MAS', make: function (r) { var g = r.pick([1, 1, 2, 3, 4, 5]), n = r.pick([1, 1, 2]), v = LV(r), A2 = {}; A2[v] = 2; return fac(dos({ k: M(g, v), A: M(1, A2), B: N(n * n), again: true })); } },
        { id: 'e3d', level: 'PRG', make: function (r) { var uv = monic(r, { u: [-6, -1], v: [1, 6], test: function (u, v) { return u + v < 0; }, book: [-3, 2] }); return fac(tri({ k: M(r.int(2, 5), 'x'), a: 1, u: uv[0], b: 1, v: uv[1] })); } }] },
      { num: '4', stem: 'Factor completely.', parts: [
        { id: 'e4a', level: 'PRG', make: function (r) { var n = r.int(1, 6); return fac(tri({ k: M(r.int(2, 5), 'x'), a: 1, u: n, b: 1, v: n })); } },
        { id: 'e4b', level: 'ADV', make: function (r) { var ab = coprime(r, 2, 5, 1, 7, function (a, b) { return a !== b; }) || [3, 2]; return fac(dos({ k: M(r.int(2, 3), 'x'), A: M(ab[0], 'x'), B: N(ab[1]) })); } },
        { id: 'e4c', level: 'ADV', make: function (r) { var n = r.int(1, 5), v = LV(r), A2 = {}; A2[v] = 2; return fac(dos({ A: M(1, A2), B: N(n * n), again: true })); } },
        { id: 'e4d', level: 'ADV', make: function (r) { return fac(tri(Object.assign({ k: M(r.int(2, 4), 'x') }, decPick(r, { a: 2, u: [-5, 5], b: 1, v: [-5, 5], test: function (o) { return o.Bm < 0 && Math.abs(o.C) <= 12; }, book: { a: 2, u: 1, b: 1, v: -2 } })))); } }] },
      { num: '5', section: 'Part C — Prime Polynomials, Impostors, and Unfinished Work', stem: 'A polynomial is <b>prime</b> when no method on the checklist applies — most often a <b>sum</b> of squares, or a trinomial whose factor pairs never give the middle term. Factor completely, or press <b>none</b> if it is prime.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { var n = r.int(2, 12); return sumSqPart(1, n, null, LV(r)); } },
        { id: 'e5b', level: 'BEG', make: function (r) { return fnone(dos({ A: V(LV(r)), B: N(r.int(2, 12)) })); } },
        { id: 'e5c', level: 'EMG', make: function (r) { var bc = primeMonic(r, { b: [2, 9], c: [2, 12], book: [5, 7] }); return primeTriPart(bc[0], bc[1]); } },
        { id: 'e5d', level: 'BEG', make: function (r) { var uv = monic(r, { u: [1, 8], v: [-8, -1], test: function (u, v) { return u + v > 0; }, book: [3, -2] }); return fnone(tri({ a: 1, u: uv[0], b: 1, v: uv[1] })); } },
        { id: 'e5e', level: 'EMG', make: function (r) { var ab = coprime(r, 2, 5, 1, 9, function (a, b) { return a !== b; }) || [2, 3]; return sumSqPart(ab[0], ab[1]); } },
        { id: 'e5f', level: 'PRG', make: function (r) { var k = r.int(2, 7), n = r.int(1, 4); return fnone(gcfOnly(N(k), S(M(1, { x: 2 }), N(n * n))), { sol: 'Step 1: the GCF is ' + t(k) + ': ' + t(tx(P.mul(N(k), S(M(1, { x: 2 }), N(n * n)))) + '=' + k + '(x^{2}+' + n * n + ')') + '.<br>Step 2: ' + t('x^{2}+' + n * n) + ' is a <b>sum</b> of squares — prime. So ' + t(k + '(x^{2}+' + n * n + ')') + ' is the complete answer (not “prime”: the GCF did come out).' }); } }] },
      { num: '6', stem: 'Each student below made a different mistake. Identify it, then give the correct factorization.', shared: function (r) { return { dev: devShared(r), n: r.int(2, 12), v: LV(r) }; }, parts: [
        { id: 'e6a1', sub: 'a error', level: 'EMG', make: function (r, sh) { var s = sh.dev; return mcPart(r, 'Dev wrote ' + t(s.pr.tex + '=' + s.k + '(x^{2}-' + s.n * s.n + ')') + ' and stopped. What is his mistake?', [
            { html: 'He stopped one step early: ' + t('x^{2}-' + s.n * s.n) + ' is still a difference of squares.', right: true },
            { html: 'The GCF should be ' + t(s.k * s.n * s.n) + ', not ' + t(s.k) + '.', why: t(s.k * s.n * s.n) + ' does not divide ' + t(s.k + 'x^{2}') + '. His GCF is right — look at the bracket.' },
            { html: 'He should not have taken out a GCF first.', why: 'Taking out the GCF first is step 1 of the checklist — that part is right. Look at the bracket.' },
            { html: 'Nothing — ' + t(s.k + '(x^{2}-' + s.n * s.n + ')') + ' is factored completely.', why: 'Step 3: can any factor be factored again? ' + t('x^{2}-' + s.n * s.n + '=x^{2}-' + s.n + '^{2}') + '.' }],
            'Step 3 of the checklist: ' + t('x^{2}-' + s.n * s.n) + ' is a difference of squares, so ' + t(s.pr.tex + '=' + s.pr.keyTex) + '.', ['Check every factor he wrote: can any of them be factored again?'], 'Dev error'); } },
        { id: 'e6a2', sub: 'a fix', level: 'PRG', make: function (r, sh) { var s = sh.dev, p = fac(s.pr, { prompt: 'Give the correct factorization of ' + t(s.pr.tex) + '.' }); p.bad.push(s.k + '(x^{2}-' + s.n * s.n + ')'); return p; } },
        { id: 'e6b1', sub: 'b error', level: 'EMG', make: function (r, sh) { var n = sh.n, v = sh.v; return mcPart(r, 'Mira wrote ' + t(v + '^{2}+' + n * n + '=(' + v + '+' + n + ')(' + v + '-' + n + ')') + '. What is her mistake?', [
            { html: 'She used the difference-of-squares pattern on a <b>sum</b>: ' + t('(' + v + '+' + n + ')(' + v + '-' + n + ')=' + v + '^{2}-' + n * n) + '.', right: true },
            { html: 'The brackets should both be ' + t('(' + v + '+' + n + ')') + '.', why: 'Expand ' + t('(' + v + '+' + n + ')^{2}') + ': it has a middle term ' + t(2 * n + v) + '.' },
            { html: 'She forgot to take out a GCF.', why: 'There is no common factor here. Expand her answer and compare.' },
            { html: 'Nothing — it is correct.', why: 'Expand it: ' + t('(' + v + '+' + n + ')(' + v + '-' + n + ')=' + v + '^{2}-' + n * n) + ', not ' + t(v + '^{2}+' + n * n) + '.' }],
            'Expanding her answer gives ' + t(v + '^{2}-' + n * n) + ', not ' + t(v + '^{2}+' + n * n) + '. A sum of squares matches no pattern on the checklist: ' + t(v + '^{2}+' + n * n) + ' is prime.', ['Expand her answer.'], 'Mira error'); } },
        { id: 'e6b2', sub: 'b fix', level: 'EMG', make: function (r, sh) { var n = sh.n, v = sh.v; return sumSqPart(1, n, 'Mira’s expression was ' + t(v + '^{2}+' + n * n) + '. Give its correct factorization, or press <b>none</b> if it is prime.', v); } }] },
      { num: '7', stem: 'Identify the mistake, then give the correct factorization.', shared: function (r) { return { jonah: jonahShared(r), priya: priyaShared(r) }; }, parts: [
        { id: 'e7a1', sub: 'a error', level: 'EMG', make: function (r, sh) { var s = sh.jonah; return mcPart(r, 'Jonah wrote ' + t(s.pr.tex + '=' + s.stu) + ' and said he was finished. What is his mistake?', [
            { html: 'He never removed the GCF, so a common factor of ' + t(s.k) + ' is still inside ' + t('(' + s.kb + ')') + '.', right: true },
            { html: 'His brackets multiply to the wrong trinomial.', why: 'Expand it: it does give ' + t(s.pr.tex) + '. Look inside the brackets.' },
            { html: 'The brackets are in the wrong order.', why: 'The order of the factors doesn’t matter. Look inside the brackets.' },
            { html: 'Nothing — it is factored completely.', why: t(s.kb + '=' + s.k + '(' + s.b1 + ')') + ' — one bracket still has a common factor.' }],
            t(s.kb + '=' + s.k + '(' + s.b1 + ')') + ': the GCF should have come out first. ' + s.pr.sol, ['Does either bracket still have a common factor?'], 'Jonah error'); } },
        { id: 'e7a2', sub: 'a fix', level: 'PRG', make: function (r, sh) { var s = sh.jonah, p = fac(s.pr, { prompt: 'Give the correct factorization of ' + t(s.pr.tex) + '.' }); p.bad.push(s.stu); return p; } },
        { id: 'e7b1', sub: 'b error', level: 'EMG', make: function (r, sh) { var s = sh.priya; return mcPart(r, 'Priya wrote ' + t(s.pr.tex + '=' + s.stu) + ' and said it was completely factored. What is her mistake?', [
            { html: 'She stopped too early: ' + t(s.dif) + ' is another difference of squares.', right: true },
            { html: t(s.sum) + ' should also be factored as a difference of squares.', why: t(s.sum) + ' is a <b>sum</b> of squares — it is prime.' },
            { html: 'The first step is wrong: ' + t(s.pr.tex) + ' is not a difference of squares.', why: t(s.pr.tex + '=' + pz(s.A) + '^{2}-' + s.n * s.n + '^{2}') + ' — the first step is right.' },
            { html: 'Nothing — it is completely factored.', why: 'Step 3: can any factor be factored again? Look at ' + t(s.dif) + '.' }],
            s.pr.sol, ['Check each of her factors: can it be factored again?'], 'Priya error'); } },
        { id: 'e7b2', sub: 'b fix', level: 'ADV', make: function (r, sh) { var s = sh.priya, p = fac(s.pr, { prompt: 'Give the correct factorization of ' + t(s.pr.tex) + '.' }); p.bad.push(s.stu); return p; } }] },
      { num: '8', section: 'Part D — Sorting and Building', stem: '', parts: [
        { id: 'e8', level: 'PRG', make: function (r) { return sortPart(r); } }] },
      { num: '9', stem: '<b>Work backwards.</b> Build the expression that was factored by multiplying the factors out. Write it in descending order with no brackets left.', shared: function (r) { return { A: buildA(r), B: buildB(r) }; }, parts: [
        { id: 'e9a1', sub: 'a build', level: 'PRG', make: function (r, sh) { var s = sh.A; return buildPart(s, '(a) Build a three-term expression whose complete factorization is ' + t(s.pr.keyTex) + '.'); } },
        { id: 'e9a2', sub: 'a methods', level: 'PRG', make: function (r, sh) { var s = sh.A; return methodSelect(s.pr, 'Which two methods, in order, would a student need to get from ' + t(s.pr.tex) + ' back to ' + t(s.pr.keyTex) + '?'); } },
        { id: 'e9b1', sub: 'b build', level: 'PRG', make: function (r, sh) { var s = sh.B; return buildPart(s, '(b) Build a two-term expression whose complete factorization is ' + t(s.pr.keyTex) + '.'); } },
        { id: 'e9b2', sub: 'b methods', level: 'PRG', make: function (r, sh) { var s = sh.B; return methodSelect(s.pr, 'Which two methods, in order, are needed to get from ' + t(s.pr.tex) + ' back to ' + t(s.pr.keyTex) + '?'); } }] },
      { num: '10', stem: '<b>Build a prime one.</b> Each part asks for an expression that the checklist runs all the way through without ever factoring.', parts: [
        { id: 'e10a', sub: 'a', level: 'ADV', make: function () { return primeSumPart(); } },
        { id: 'e10a2', sub: 'a why', level: 'EMG', make: function (r) { var n = r.int(2, 12), v = r.pick(['x', 'x', 'y']), q = n * n, E = v + '^{2}+' + q; return mcPart(r, 'Why does the difference-of-squares pattern not reach an expression like ' + t(E) + '?', [
            { html: 'The pattern ' + t('a^{2}-b^{2}') + ' needs a <b>subtraction</b> between the two squares; a sum of squares matches no pattern on the checklist.', right: true },
            { html: 'Because ' + t(q) + ' is not a perfect square.', why: t(q + '=' + n + '^{2}') + ' is a perfect square. Look at the sign between the terms.' },
            { html: 'Because it needs a GCF first.', why: 'There is no common factor here. Look at the sign between the terms.' },
            { html: 'It does: ' + t(E + '=(' + v + '+' + n + ')(' + v + '-' + n + ')') + '.', why: 'Expand ' + t('(' + v + '+' + n + ')(' + v + '-' + n + ')') + ': it gives ' + t(v + '^{2}-' + q) + '.' }],
            t('(' + v + '+' + n + ')(' + v + '-' + n + ')=' + v + '^{2}-' + q) + ' and ' + t('(' + v + '+' + n + ')^{2}=' + v + '^{2}+' + 2 * n + v + '+' + q) + ' — neither is ' + t(E) + '. The difference-of-squares pattern needs a minus sign between the squares.', ['Expand ' + t('(' + v + '+' + n + ')(' + v + '-' + n + ')') + '.'], 'why sum of squares is prime'); } },
        { id: 'e10b', sub: 'b', level: 'ADV', make: function (r) { return primeBPart(r); } }] },
      { num: '11', section: 'Part E — Applications and Stretch', stem: function (sh) { return 'A rectangular box has volume ' + t('(' + sh.pr.tex + ')') + ' cubic centimetres.'; },
        shared: function (r) { var k = r.pick([2, 2, 3, 4, 5]), n = r.int(1, 5); return { k: k, n: n, pr: dos({ k: M(k, 'x'), A: X, B: N(n) }), x: r.int(n + 1, n + 5) }; },
        parts: [
          { id: 'e11a', level: 'PRG', make: function (r, sh) { var p = fac(sh.pr, { prompt: '(a) Factor the volume completely to find three possible dimensions.' }); p.solution += '<br>The dimensions are ' + t(sh.k + 'x') + ', ' + t('x-' + sh.n) + ' and ' + t('x+' + sh.n) + '.'; return p; } },
          { id: 'e11b', level: 'PRG', make: function (r, sh) {
            var k = sh.k, n = sh.n, big = k === 2 ? 'x>' + n : 'x>' + (n / (k - 1) === Math.round(n / (k - 1)) ? n / (k - 1) : '\\frac{' + n + '}{' + (k - 1) + '}');
            return mcPart(r, '(b) For ' + t('x>' + n) + ', which dimension is the largest?', [
              { html: t(k + 'x') + ', because ' + t(k + 'x>x+' + n) + ' exactly when ' + t(big) + ' (and ' + t('x-' + n) + ' is always the smallest).', right: true },
              { html: t('x+' + n) + ', because it has a plus sign.', why: 'Compare ' + t(k + 'x') + ' with ' + t('x+' + n) + ' for a value like ' + t('x=' + (n + 5)) + ': ' + t(k * (n + 5)) + ' and ' + t(2 * n + 5) + '.' },
              { html: t('x-' + n) + ', because it is listed first.', why: t('x-' + n) + ' is smaller than ' + t('x+' + n) + ' for every ' + t('x') + '.' },
              { html: 'They are all equal.', why: 'Try ' + t('x=' + (n + 5)) + ': the dimensions are ' + t(k * (n + 5)) + ', ' + t(5) + ' and ' + t(2 * n + 5) + '.' }],
              'Compare ' + t(k + 'x') + ' with ' + t('x+' + n) + ': ' + t(k + 'x>x+' + n) + ' when ' + t((k - 1 === 1 ? '' : k - 1) + 'x>' + n) + ', i.e. ' + t(big) + ' — true for every ' + t('x>' + n) + '. And ' + t('x-' + n + '<x+' + n) + ' always, so ' + t(k + 'x') + ' is the largest.', ['Pick a value of ' + t('x') + ' bigger than ' + t(n) + ' and compare the three dimensions.'], 'largest dimension');
          } },
          { id: 'e11c', level: 'EMG', make: function (r, sh) { return dims3(sh); } }] },
      { num: '12', stem: function (sh) { return 'A storage bin has volume ' + t('(' + sh.pr.tex + ')') + ' cubic inches.'; },
        shared: function (r) { var uv = monic(r, { u: [1, 6], v: [1, 6], test: function (u, v) { return u < v && u * v <= 20; }, book: [2, 3] }); return { pr: tri({ k: M(r.int(2, 5), 'x'), a: 1, u: uv[0], b: 1, v: uv[1] }), uv: uv }; },
        parts: [
          { id: 'e12a', level: 'PRG', make: function (r, sh) { return fac(sh.pr, { prompt: '(a) Factor the volume completely.' }); } },
          { id: 'e12b', level: 'BEG', make: function (r, sh) {
            var pr = sh.pr, d = [pr.k, pr.f1, pr.f2], lb = ['Dimension 1', 'Dimension 2', 'Dimension 3'];
            var chk = function (resp) {
              resp = resp || []; var got = [];
              for (var i = 0; i < 3; i++) { var a = K.read(resp[i] == null ? '' : resp[i]); if (a.res) return { v: a.res.v, code: a.res.code, hint: '<b>' + lb[i] + ':</b> ' + a.res.hint }; var rd = P.read(a.ast); if (!rd.ok) return wrong('value', null); got.push(rd.p); }
              var used = [false, false, false], miss = 0;
              got.forEach(function (g) { var j = d.findIndex(function (x, i) { return !used[i] && P.eq(x, g); }); if (j >= 0) used[j] = true; else miss++; });
              if (!miss) return ok();
              return wrong('u4l8-dims', miss === 1 ? 'Two dimensions are right. The three dimensions are the three factors of the complete factorization.' : 'The three dimensions are the three factors of ' + t(pr.keyTex) + '.');
            };
            var p = B.fields('(b) State the three dimensions (any order).', lb.map(function (l) { return { name: l, label: l, mode: 'math', keys: 'poly', vars: ['x'] }; }), [chk, function () { return ok(); }, function () { return ok(); }], d.map(tx), t(tx(pr.k)) + ', ' + t(tx(pr.f1)) + ', ' + t(tx(pr.f2)),
              'Volume = length × width × height, and ' + t(pr.tex + '=' + pr.keyTex) + ', so the dimensions are ' + t(tx(pr.k)) + ', ' + t(tx(pr.f1)) + ' and ' + t(tx(pr.f2)) + ' inches.', ['Use the three factors from part (a).'], 'three dimensions');
            p.check = chk; p.bad = [[tx(pr.k), tx(pr.f1), tx(pr.inner)], [tx(pr.k), tx(pr.f1), tx(S(X, N(-sh.uv[1])))]]; p.good = [[tx(pr.f2), tx(pr.k), tx(pr.f1)]];
            return p;
          } },
          { id: 'e12c', level: 'EMG', make: function (r, sh) { var g = tx(sh.pr.k); return mcPart(r, '(c) Why can ' + t('x') + ' not be ' + t('0') + ' or a negative number here?', [
            { html: 'A dimension must be positive; ' + t('x=0') + ' makes ' + t(g + '=0') + ' and any ' + t('x<0') + ' makes ' + t(g) + ' negative, so no bin exists.', right: true },
            { html: 'Because the volume formula only works for whole numbers.', why: 'The formula works for any number. Think about what each dimension must be.' },
            { html: 'Because ' + t(tx(sh.pr.f1)) + ' would be zero.', why: 'At ' + t('x=0') + ', ' + t(tx(sh.pr.f1) + '=' + sh.uv[0]) + ', not zero. Look at the factor ' + t(g) + '.' },
            { html: 'Because ' + t('x') + ' must be bigger than ' + t('100') + '.', why: 'Any positive ' + t('x') + ' gives positive dimensions here.' }],
            'Each dimension is a length, so it must be positive. ' + t(g) + ' is ' + t('0') + ' when ' + t('x=0') + ' and negative when ' + t('x<0') + ', so ' + t('x') + ' must be positive.', ['Look at each dimension when ' + t('x=0') + '.'], 'why x > 0'); } }] },
      { num: '13', stem: function (sh) { return 'A square sheet of metal has side length ' + t(sh.a + 'x') + ' centimetres. A square hole of side length ' + t(sh.h) + ' centimetres is cut out of the middle.'; },
        shared: function (r) { var o = null; for (var i = 0; i < 200 && !o; i++) { var a = r.int(2, 5), h = r.int(4, 24); if (h % a === 0 && h / a <= 8) o = { a: a, h: h }; } o = o || { a: 3, h: 12 }; var g = o.a * o.a, q = o.h / o.a; o.x = r.int(q + 1, q + 6); o.pr = dos({ k: g, A: X, B: N(q) }); o.q = q; return o; },
        parts: [
          { id: 'e13a1', sub: 'a area', level: 'EMG', make: function (r, sh) {
            var A = S(M(sh.a * sh.a, { x: 2 }), N(-sh.h * sh.h));
            var p = B.poly('(a) Write an expression for the remaining area.', A, { wrong: [{ is: M(sh.a * sh.a, { x: 2 }), code: 'u4l8-whole-area', hint: 'That is the whole sheet. Subtract the area of the hole.' }, { is: S(M(sh.a, { x: 2 }), N(-sh.h * sh.h)), code: 'exponent', hint: 'Square the whole side: ' + t('(' + sh.a + 'x)^{2}=' + sh.a * sh.a + 'x^{2}') + '.' }, { is: S(M(sh.a * sh.a, { x: 2 }), N(-sh.h)), code: 'value', hint: 'The hole is a square: its area is ' + t(sh.h + '^{2}') + '.' }] },
              'Remaining area = sheet − hole ' + t('=(' + sh.a + 'x)^{2}-' + sh.h + '^{2}=' + tx(A)) + ' cm².', ['Area of a square = side². Subtract the hole from the sheet.'], 'remaining area');
            p.bad = [tx(M(sh.a * sh.a, { x: 2 })), tx(S(M(sh.a, { x: 2 }), N(-sh.h * sh.h)))];
            return p;
          } },
          { id: 'e13a2', sub: 'a factor', level: 'PRG', make: function (r, sh) { var p = fac(sh.pr, { prompt: 'Factor ' + t(sh.pr.tex) + ' completely.' }); p.bad.push('(' + sh.a + 'x-' + sh.h + ')(' + sh.a + 'x+' + sh.h + ')'); return p; } },
          { id: 'e13b', level: 'EMG', make: function (r, sh) {
            var g = sh.a * sh.a, q = sh.q, x = sh.x, v = g * (x - q) * (x + q);
            var p = B.number('(b) Determine the remaining area when ' + t('x=' + x) + ', using your factored form.', v, function (y) {
              if (y === g * x * x) return { code: 'u4l8-whole-area', hint: 'That is the whole sheet. Use the factored form ' + t(sh.pr.keyTex) + '.' };
              if (y === (x - q) * (x + q)) return { code: 'gcf-missing', hint: 'Don’t forget the GCF ' + t(g) + ' in front.' };
              return null;
            }, t(sh.pr.keyTex.replace(/x/g, '(' + x + ')') + '=' + g + '(' + (x - q) + ')(' + (x + q) + ')=' + v) + ' cm². (Check: ' + t(g + '(' + x + ')^{2}-' + sh.h * sh.h + '=' + (g * x * x) + '-' + sh.h * sh.h + '=' + v) + '.)',
            ['Substitute ' + t('x=' + x) + ' into each factor and multiply.'], 'remaining area at x', { after: t('\\text{ cm}^{2}') });
            p.bad = [String(g * x * x), String((x - q) * (x + q))]; return p;
          } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e14', level: 'EMG', make: function (r) {
          var n = r.pick([1, 2, 3, 2]), lead = r.pick([1, 1, 1, 4]); if (lead === 4 && n % 2 === 0) n = r.pick([1, 3]); var k = r.int(2, 7);
          var A = M(lead, { x: 2 }), pr = dos({ k: k, A: A, B: N(n * n), again: true }), U = msqrt(A), q = n * n;
          var ut = tx(U), at = tx(A);
          return mcPart(r, t(pr.tex) + ' is completely factored as', [
            { html: t(pr.keyTex), right: true },
            { html: t(k + '(' + at + '-' + q + ')(' + at + '+' + q + ')'), why: 'Step 3: ' + t(at + '-' + q) + ' is still a difference of squares.' },
            { html: t('(' + tx(P.scale(A, k)) + '-' + k * q + ')(' + at + '+' + q + ')'), why: 'It multiplies out correctly, but the first bracket still has a common factor of ' + t(k) + ', and it can be factored again.' },
            { html: t(k + '(' + at + '-' + q + ')^{2}'), why: 'A difference of squares is a sum times a difference, not a square: ' + t('(' + at + '-' + q + ')^{2}') + ' has a middle term.' }],
            pr.sol, ['Take out the GCF, then factor the difference of squares — and check whether a bracket can be factored again.'], 'completely factored ' + plain(pr.tex));
        } }] },
      { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e15', level: 'PRG', make: function (r) {
          var ab = coprime(r, 2, 5, 1, 9, function (a, b) { return a !== b; }) || [2, 5], a = ab[0], c = ab[1], kk = 2 * a * c;
          return B.nr('If ' + t(a * a + 'x^{2}+kx+' + c * c) + ' is a perfect square trinomial and ' + t('k>0') + ', then the value of ' + t('k') + ' is ________.', kk, function (v) {
            if (v === a * c) return { code: 'k-half', hint: 'The middle term is <b>twice</b> the product of the square roots: ' + t('2\\times' + a + '\\times' + c) + '.' };
            if (v === 2 * a * a * c * c || v === a * a * c * c) return { code: 'value', hint: 'Use the square <b>roots</b> of ' + t(a * a) + ' and ' + t(c * c) + ': ' + t(a) + ' and ' + t(c) + '.' };
            return null;
          }, t(a * a + 'x^{2}=(' + a + 'x)^{2}') + ' and ' + t(c * c + '=' + c + '^{2}') + ', so ' + t(a * a + 'x^{2}+kx+' + c * c + '=(' + a + 'x+' + c + ')^{2}=' + a * a + 'x^{2}+' + kk + 'x+' + c * c) + ', and ' + t('k=2\\times' + a + '\\times' + c + '=' + kk) + '.',
          ['The first and last terms are the squares of ' + t(a + 'x') + ' and ' + t(c) + '. The middle term is twice their product.'], 'NR k for perfect square');
        } }] },
      { num: '16', stem: '<b>Stretch — four linear factors.</b> A quartic such as ' + t('x^{4}-13x^{2}+36') + ' is a trinomial in disguise: treat ' + t('x^{2}') + ' as the variable, factor it as you would ' + t('n^{2}-13n+36') + ', and then run step 3 on each factor you get.', parts: [
        { id: 'e16a', level: 'MAS', make: function (r) { var pq = twoSq(r, [1, 4]); return quartic(pq[0], pq[1], r.pick(['x', 'x', 'y'])); } },
        { id: 'e16b', level: 'ADV', make: function (r) { var pq = twoSq(r, [1, 3], true); return quartic(pq[0], pq[1], r.pick(['x', 'x', 'y', 'a'])); } }] }
    ]
  });

  /* ---------------- part makers used above ---------------- */
  function dims2(sh, x) {
    var L = x + sh.u, Wd = x + sh.v, lb = ['Length', 'Width'];
    var chk = function (resp) {
      resp = resp || [];
      var a = K.read(resp[0] == null ? '' : resp[0]), b = K.read(resp[1] == null ? '' : resp[1]);
      if (a.res) return { v: a.res.v, code: a.res.code, hint: '<b>Length:</b> ' + a.res.hint }; if (b.res) return { v: b.res.v, code: b.res.code, hint: '<b>Width:</b> ' + b.res.hint };
      if (a.val === L && b.val === Wd) return ok();
      if (a.val === Wd && b.val === L) return form('u4l7-dims-swap', 'Right numbers — the length is the longer side, so put ' + t(L) + ' first.');
      if (a.val === L || b.val === Wd) return wrong('u4l8-dims', 'One is right. Substitute ' + t('x=' + x) + ' into ' + t('x+' + sh.u) + ' and ' + t('x' + sh.v) + '.');
      return wrong('value', 'Substitute ' + t('x=' + x) + ' into each factor: ' + t('x+' + sh.u) + ' and ' + t('x' + sh.v) + '.');
    };
    HW.addCodes({ 'u4l7-dims-swap': 'Length and width in each other’s boxes' });
    var p = B.fields('(c) If ' + t('x=' + x) + ', determine the actual length and width, in inches.', lb.map(function (l) { return { name: l, label: l, after: 'in.' }; }), [chk, function () { return ok(); }], [String(L), String(Wd)], 'length ' + t(L) + ' in., width ' + t(Wd) + ' in.',
      'Length ' + t('x+' + sh.u + '=' + x + '+' + sh.u + '=' + L) + ' in., width ' + t('x' + sh.v + '=' + x + sh.v + '=' + Wd) + ' in. (Check: ' + t(L + '\\times' + Wd + '=' + L * Wd) + ' and ' + t(x + '^{2}+' + (sh.u + sh.v) + '(' + x + ')' + sh.u * sh.v + '=' + (x * x + (sh.u + sh.v) * x + sh.u * sh.v)) + ' ✓)',
      ['Substitute ' + t('x=' + x) + ' into each factor.'], 'frame dimensions at x');
    p.check = chk; p.bad = [[String(Wd), String(L)]]; if (Wd !== 1) p.bad.push([String(L * Wd), String(Wd)]);
    return p;
  }
  function dims3(sh) {
    var x = sh.x, k = sh.k, n = sh.n, d = [k * x, x - n, x + n], vol = k * x * x * x - k * n * n * x, lb = ['Dimension 1', 'Dimension 2', 'Dimension 3'];
    var chk = function (resp) {
      resp = resp || []; var got = [];
      for (var i = 0; i < 3; i++) { var a = K.read(resp[i] == null ? '' : resp[i]); if (a.res) return { v: a.res.v, code: a.res.code, hint: '<b>' + lb[i] + ':</b> ' + a.res.hint }; got.push(a.val); }
      var used = [false, false, false], miss = 0;
      got.forEach(function (g) { var j = d.findIndex(function (v, i) { return !used[i] && v === g; }); if (j >= 0) used[j] = true; else miss++; });
      if (!miss) return ok();
      if (miss === 1) return wrong('u4l8-dims', 'Two are right. Substitute ' + t('x=' + x) + ' into each of ' + t(k + 'x') + ', ' + t('x-' + n) + ' and ' + t('x+' + n) + '.');
      return wrong('value', 'Substitute ' + t('x=' + x) + ' into each of the three factors.');
    };
    var p = B.fields('(c) Determine the three dimensions when ' + t('x=' + x) + ' (any order).', lb.map(function (l) { return { name: l, label: l, after: 'cm' }; }), [chk, function () { return ok(); }, function () { return ok(); }], d.map(String), t(d[0]) + ', ' + t(d[1]) + ' and ' + t(d[2]) + ' cm',
      t(k + 'x=' + d[0]) + ', ' + t('x-' + n + '=' + d[1]) + ', ' + t('x+' + n + '=' + d[2]) + '. Check: ' + t(d[0] + '\\times' + d[1] + '\\times' + d[2] + '=' + d[0] * d[1] * d[2]) + ' and ' + t(k + '(' + x + ')^{3}-' + k * n * n + '(' + x + ')=' + vol) + ' ✓',
      ['Substitute ' + t('x=' + x) + ' into each factor from part (a).'], 'box dimensions at x');
    p.check = chk; p.bad = [[String(d[0]), String(d[1]), String(x)], [String(x), String(d[1]), String(d[2])]]; p.good = [[String(d[2]), String(d[0]), String(d[1])]];
    return p;
  }
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
  function itemPart(it, prompt) {
    if (it.prime) return it.kind === 'sum' ? sumSqPart(it.a, it.n, prompt) : primeTriPart(it.b, it.c);
    return fnone(it.pr, { prompt: prompt });
  }
  function gridOf(items, prompt) {
    var rows = items.map(function (it, i) { var L = 'abcdef'.charAt(i); return { id: L, html: '(' + L + ') ' + t(it.tex), m: it.prime ? ['prime'] : methodsOf(it.pr).filter(function (m, j, arr) { return arr.indexOf(m) === j; }), nudge: it.nudge }; });
    var sol = rows.map(function (rw, i) { var it = items[i]; return rw.html + ': ' + (it.prime ? '<b>prime</b> — ' + (it.kind === 'sum' ? 'a sum of squares' : 'no factor pair works') : '<b>' + methodText(rw.m) + '</b>' + (it.twice ? ' (twice)' : '')); }).join('<br>');
    var p = methodGrid(prompt, rows, sol, 'name strategies');
    p.bad = [rows.reduce(function (o, rw) { o[rw.id] = rw.m.indexOf('gcf') >= 0 ? rw.m.filter(function (m) { return m !== 'gcf'; }) : rw.m; return o; }, {})];
    if (!rows.some(function (rw) { return rw.m.indexOf('gcf') >= 0; })) p.bad = [rows.reduce(function (o, rw) { o[rw.id] = ['prime']; return o; }, {})];
    return p;
  }
  /* E1: 8x²−18, x²+4, 4x²+12x+9, 3x³−27x, 6x²−x−15, x⁴−16 */
  function e1Items(r) {
    var it = [];
    var ab = coprime(r, 2, 3, 1, 5, function (a, b) { return a !== b; }) || [2, 3], k1 = r.int(2, 3); it.push({ tex: null, pr: dos({ k: k1, A: M(ab[0], 'x'), B: N(ab[1]) }) });
    var n2 = r.int(1, 6); it.push({ prime: true, kind: 'sum', a: 1, n: n2, tex: tx(S(M(1, { x: 2 }), N(n2 * n2))), nudge: 'two perfect squares with a <b>plus</b> sign between them.' });
    var pq = coprime(r, 2, 5, 1, 7, function (a, b) { return a !== b; }) || [2, 3]; it.push({ pr: tri({ a: pq[0], u: pq[1], b: pq[0], v: pq[1] }) });
    var n4 = r.int(1, 5); it.push({ pr: dos({ k: M(r.int(2, 5), 'x'), A: X, B: N(n4) }) });
    it.push({ pr: tri(decPick(r, { a: [2, 3], u: [1, 5], b: [3, 5], v: [-7, -1], test: function (o) { return o.Bm < 0 && o.Bm >= -5 && o.C >= -30 && o.a !== o.b; }, book: { a: 2, u: 3, b: 3, v: -5 } })) });
    var n6 = r.pick([1, 2, 3]); it.push({ pr: dos({ A: M(1, { x: 2 }), B: N(n6 * n6), again: true }), twice: true });
    it.forEach(function (x) { if (!x.tex) x.tex = x.pr.tex; });
    return it;
  }
  /* E2: 50−2x², x²−x−12, 9x²+25, 12x²−27, x²−20x+100, 7x³+14x²−21x */
  function e2Items(r) {
    var it = [];
    var n1 = r.int(2, 6), k1 = r.int(2, 3); it.push({ pr: dos({ k: k1, A: N(n1), B: X, order: 'asc' }) });
    var uv = monic(r, { u: [-6, -1], v: [1, 6], test: function (u, v) { return u + v === -1 || u + v === -2 || u + v === 1; }, book: [-4, 3] }); it.push({ pr: tri({ a: 1, u: uv[0], b: 1, v: uv[1] }) });
    var ab = coprime(r, 2, 5, 1, 7, function (a, b) { return a !== b; }) || [3, 5]; it.push({ prime: true, kind: 'sum', a: ab[0], n: ab[1], tex: tx(S(M(ab[0] * ab[0], { x: 2 }), N(ab[1] * ab[1]))), nudge: 'two perfect squares with a <b>plus</b> sign between them.' });
    var cd = coprime(r, 2, 4, 1, 5, function (a, b) { return a !== b; }) || [2, 3]; it.push({ pr: dos({ k: r.int(2, 3), A: M(cd[0], 'x'), B: N(cd[1]) }) });
    var n5 = -r.int(4, 12); it.push({ pr: tri({ a: 1, u: n5, b: 1, v: n5 }) });
    var uv6 = monic(r, { u: [1, 5], v: [-5, -1], test: function (u, v) { return u + v > 0; }, book: [3, -1] }); it.push({ pr: tri({ k: M(r.int(2, 7), 'x'), a: 1, u: uv6[0], b: 1, v: uv6[1] }) });
    it.forEach(function (x) { if (!x.tex) x.tex = x.pr.tex; });
    return it;
  }
  function devShared(r) { var k = r.pick([2, 3, 4, 5]), n = r.int(2, 6); return { k: k, n: n, pr: dos({ k: k, A: X, B: N(n) }) }; }
  function jonahShared(r) {
    var k = r.pick([2, 2, 3, 4]), uv = monic(r, { u: [1, 6], v: [1, 6], test: function (u, v) { return u < v && u * v <= 20; }, book: [2, 3] }), pr = tri({ k: k, a: 1, u: uv[0], b: 1, v: uv[1] });
    var kb = tx(S(M(k, 'x'), N(k * uv[0]))), b1 = tx(S(X, N(uv[0])));
    return { k: k, pr: pr, kb: kb, b1: b1, stu: '(' + kb + ')(' + tx(S(X, N(uv[1]))) + ')' };
  }
  function priyaShared(r) { var v = LV(r), lead = r.pick([1, 1, 1, 16]), n = lead === 16 ? r.pick([1, 3]) : r.pick([1, 2, 3]), A2 = {}; A2[v] = 2; var A = M(lead, A2), pr = dos({ A: A, B: N(n * n), again: true }); return { n: n, A: A, pr: pr, dif: tx(S(A, N(-n * n))), sum: tx(S(A, N(n * n))), stu: '(' + tx(S(A, N(-n * n))) + ')(' + tx(S(A, N(n * n))) + ')' }; }
  /* E8: sort eight expressions into the table by the first method */
  function sortPart(r) {
    var cats = [{ id: 'gcf', html: 'GCF only' }, { id: 'gcf2', html: 'GCF, then more' }, { id: 'dos', html: 'diff. of squares' }, { id: 'pst', html: 'perfect square' }, { id: 'insp', html: t('a=1') }, { id: 'dec', html: t('a\\neq1') }, { id: 'prime', html: 'prime' }];
    var n1 = r.int(4, 9), k2 = r.int(2, 6), q2 = r.int(1, 7), n3 = r.int(4, 9), uv = monic(r, { u: [-8, -2], v: [2, 7], test: function (u, v) { return u + v < 0 && u * v >= -40; }, book: [-7, 5] });
    var dd = decPick(r, { a: 2, u: [-3, -1], b: 1, v: [1, 5], test: function (o) { return o.Bm > 0; }, book: { a: 2, u: -1, b: 1, v: 3 } });
    var k5 = r.int(2, 5), n5 = r.int(2, 4), n7 = r.int(3, 6), k8 = r.int(2, 5), n8 = r.int(1, 3);
    if (q2 % k2 === 0) q2 = 1;
    var items = [
      { pr: dos({ A: X, B: N(n1) }), c: 'dos' },
      { pr: gcfOnly(M(k2, 'x'), S(X, N(q2))), c: 'gcf' },
      { pr: tri({ a: 1, u: n3, b: 1, v: n3 }), c: 'pst' },
      { pr: tri(dd), c: 'dec' },
      { pr: dos({ k: k5, A: X, B: N(n5) }), c: 'gcf2' },
      { pr: tri({ a: 1, u: uv[0], b: 1, v: uv[1] }), c: 'insp' },
      { tex: tx(S(M(1, { x: 2 }), N(n7 * n7))), c: 'prime' },
      { pr: dos({ k: M(k8, 'x'), A: X, B: N(n8) }), c: 'gcf2' }];
    items.forEach(function (it) { if (!it.tex) it.tex = it.pr.tex; });
    var order = r.shuffle(items.map(function (x, i) { return i; }));
    var rows = order.map(function (i, j) { return { id: 'r' + j, html: '<span style="white-space:nowrap">' + t(items[i].tex) + '</span>' }; }), want = {};
    order.forEach(function (i, j) { want['r' + j] = items[i].c; });
    var p = B.grid('Sort the eight expressions into the table by the <b>first</b> method you would use. Every column gets at least one expression, and exactly one column gets two.<div class="w-help"><b>GCF only</b> = GCF and nothing after it · <b>GCF, then more</b> = GCF, then another method · ' + t('a=1') + ' / ' + t('a\\neq1') + ' = trinomial by inspection / decomposition · <b>prime</b> = no method applies.</div>', rows, cats.map(function (c) { return { id: c.id, html: c.html }; }), want, {
      why: function (id, got) {
        var it = items[order[Number(id.slice(1))]];
        if (it.c === 'gcf2' && got === 'dos') return { code: 'u4l8-gcf-missed', hint: t(it.tex) + ' looks like a difference of squares, but every term shares a common factor — the GCF always comes out first.' };
        if (it.c === 'gcf' && got === 'gcf2') return { code: 'row', hint: 'After the GCF comes out of ' + t(it.tex) + ', can the bracket be factored again?' };
        if (it.c === 'prime') return { code: 'row', hint: t(it.tex) + ' is a <b>sum</b> of squares.' };
        return { code: 'row', hint: 'Look at ' + t(it.tex) + ' again: GCF? Then count the terms.' };
      } },
      items.map(function (it) { return t(it.tex) + ': <b>' + cats.filter(function (c) { return c.id === it.c; })[0].html + '</b>' + (it.pr ? ' — ' + t(it.pr.keyTex) : ' — a sum of squares'); }).join('<br>') + '<br>Watch the two in “GCF, then another method”: they look like a difference of squares, but the GCF always comes out first.',
      ['Step 1 for every row: is there a GCF? Only then count the terms.'], 'sort by first method');
    p.bad = [order.reduce(function (o, i, j) { o['r' + j] = items[i].c === 'gcf2' ? 'dos' : items[i].c; return o; }, {})];
    return p;
  }
  function buildA(r) { var uv = monic(r, { u: [1, 6], v: [-5, -1], test: function (u, v) { return u + v !== 0; }, book: [4, -1] }); return { pr: tri({ k: M(r.int(2, 5), 'x'), a: 1, u: uv[0], b: 1, v: uv[1] }) }; }
  function buildB(r) { return { pr: dos({ k: M(r.int(2, 5), 'x'), A: X, B: N(r.int(2, 7)) }) }; }
  function buildPart(s, prompt) {
    var pr = s.pr, E = pr.expr, ki = P.mul(pr.k, pr.f1 || P.sub(pr.A, pr.B)), wrongs = [];
    var noK = pr.inner, half = P.mul(pr.k, pr.f1 || S(pr.A, P.neg(pr.B)));
    wrongs.push({ is: noK, code: 'gcf-missing', hint: 'Multiply by the GCF ' + t(tx(pr.k)) + ' too.' });
    if (pr.f1) wrongs.push({ is: P.mul(pr.k, P.mul(pr.f1, S(X, N(-P.constant(pr.f2)[0])))), code: 'u4l8-expand', hint: 'Check the signs when you expand the two brackets.' });
    var p = B.poly(prompt, E, { wrong: wrongs.filter(function (w) { return !P.eq(w.is, E); }), order: 'desc' },
      pr.f1 ? 'First the brackets: ' + t(pz(pr.f1) + pz(pr.f2) + '=' + tx(pr.inner)) + '. Then multiply by ' + t(tx(pr.k)) + ': ' + t(tx(pr.k) + '(' + tx(pr.inner) + ')=' + tx(E)) + '.'
        : 'Sum × difference: ' + t('(x-' + P.constant(pr.B)[0] + ')(x+' + P.constant(pr.B)[0] + ')=' + tx(pr.inner)) + '. Then multiply by ' + t(tx(pr.k)) + ': ' + t(tx(E)) + '.',
      ['Multiply the brackets first, then multiply every term by ' + t(tx(pr.k)) + '.'], 'build from ' + pr.keyTex);
    p.bad = [tx(noK)];
    return p;
  }
  function primeSumPart() {
    var chk = function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var rd = P.read(a.ast); if (!rd.ok) return wrong('value', 'Write a polynomial with two terms, like ' + t('x^{2}+36') + '.');
      var ts = P.terms(rd.p);
      if (ts.length !== 2) return wrong('u4l8-not-squares', 'Write an expression with exactly <b>two</b> terms.');
      var sqTerm = function (T) { var c = T.c[0] / T.c[1]; return T.c[1] === 1 && isSq(c) && Object.keys(T.v).every(function (x) { return T.v[x] % 2 === 0; }); };
      if (ts.some(function (T) { return T.c[0] < 0; })) {
        if (ts.every(function (T) { var c = Math.abs(T.c[0]); return isSq(c) && Object.keys(T.v).every(function (x) { return T.v[x] % 2 === 0; }); })) return wrong('u4l8-not-prime', 'A minus sign between two squares makes a <b>difference</b> of squares — that one factors.');
        return wrong('u4l8-not-squares', 'Both terms must be perfect squares (positive, with even exponents).');
      }
      if (!ts.every(sqTerm)) return wrong('u4l8-not-squares', 'Both terms must be perfect squares, like ' + t('x^{2}') + ', ' + t('4x^{2}') + ' or ' + t('9') + '.');
      if (!ts.some(function (T) { return Object.keys(T.v).length; })) return wrong('u4l8-not-squares', 'Use a variable in one of the terms, like ' + t('x^{2}+36') + '.');
      if (gcd(ts[0].c[0], ts[1].c[0]) > 1) return wrong('u4l8-not-prime', 'Both terms share the factor ' + t(gcd(ts[0].c[0], ts[1].c[0])) + ', so a GCF comes out — choose squares with no common factor.');
      var v0 = Object.keys(ts[0].v), v1 = Object.keys(ts[1].v);
      if (v0.length && v1.length) { var common = v0.filter(function (x) { return v1.indexOf(x) >= 0; }); if (common.length) return wrong('u4l8-not-prime', 'Both terms contain ' + t(common[0]) + ', so a GCF comes out.'); }
      return ok();
    };
    return { prompt: '(a) Write a two-term expression in which both terms are perfect squares but the expression is still prime.', input: { type: 'math', keys: 'poly', vars: ['x'], placeholder: 'e.g. x^2 + ...' }, check: chk, key: 'x^{2}+36',
      answer: 'Any sum of two squares with no common factor, e.g. ' + t('x^{2}+36') + ', ' + t('4x^{2}+9') + ' or ' + t('9x^{2}+1') + '.',
      solution: 'A <b>sum</b> of two squares, such as ' + t('x^{2}+36') + ' (or ' + t('4x^{2}+9') + ', ' + t('9x^{2}+1') + '). The pattern ' + t('a^{2}-b^{2}') + ' needs a subtraction between the squares, a sum of squares matches no pattern on the checklist, and with no common factor the GCF step does nothing — so it is prime.',
      hints: ['A difference of squares always factors. What if the sign between the squares is a plus?', 'Make sure the two terms have no common factor (or the GCF would come out).'], text: 'build a prime sum of squares',
      bad: ['x^{2}-36', '4x^{2}+16', 'x^{2}+6', '2x^{2}+9'], good: ['4x^{2}+9', '9+x^{2}', '25x^{2}+1'] };
  }
  function primeBPart(r) {
    var c = r.pick([10, 10, 6, 8, 12, 14, 15, 18, 20, 21, 22, 24, 26, 28, 30, 33, 34, 35, 38, 39, 40]), ps = pairs(c), sums = ps.map(function (p) { return p[0] + p[1]; });
    var key = Math.min.apply(null, sums) - 1; while (key > 0 && sums.indexOf(key) >= 0) key--;
    if (c === 10) key = 6;
    var chk = function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (!isFinite(a.val) || Math.abs(a.val - Math.round(a.val)) > 1e-9) return wrong('value', t('b') + ' must be an integer.');
      var b = Math.round(a.val), hit = ps.filter(function (p) { return p[0] + p[1] === Math.abs(b); })[0];
      if (hit) return wrong('u4l8-b-works', 'With ' + t('b=' + b) + ' the pair ' + t((b < 0 ? -hit[0] : hit[0]) + '\\times ' + nn(b < 0 ? -hit[1] : hit[1])) + ' works, so ' + t('x^{2}' + (b < 0 ? '' : '+') + b + 'x+' + c) + ' factors. Choose a ' + t('b') + ' that no factor pair of ' + t(c) + ' adds to.');
      return ok();
    };
    var pl = ps.map(function (p) { return t(p[0] + '\\times ' + p[1]); }).join(', '), sl = sums.map(function (x) { return t('\\pm' + x); }).join(', ');
    return { prompt: '(b) Choose an integer ' + t('b') + ' so that ' + t('x^{2}+bx+' + c) + ' is prime.', input: { type: 'number', before: t('b='), placeholder: 'b' }, check: chk, key: String(key),
      answer: 'Any integer except ' + sl + ', e.g. ' + t('b=' + key) + '.',
      solution: 'The factor pairs of ' + t(c) + ' are ' + pl + ' (and their negatives), with sums ' + sl + '. Any other ' + t('b') + ' works — for example ' + t('b=' + key) + ': no pair adds to ' + t(key) + ', so ' + t('x^{2}+' + (key === 1 ? '' : key) + 'x+' + c) + ' is prime.',
      hints: ['List the factor pairs of ' + t(c) + ' and their sums. Those values of ' + t('b') + ' make it factor.'], text: 'prime x^2+bx+' + c,
      bad: sums.map(String).concat(sums.map(function (x) { return String(-x); })), good: [String(-key), String(key === 0 ? 0 : 0)] };
  }
  function twoSq(r, rng, small) { for (var i = 0; i < 100; i++) { var p = r.int(rng[0], rng[1]), q = r.int(p + 1, small ? 5 : 7); if (p !== q) return [p, q]; } return [2, 3]; }
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
})(window);
