/* Math 15 · Unit 4 · Lesson 6 — Factoring Perfect Square Trinomials (AN5)
 * Assignment 6, questions 1–14 (u4_L06.tex) and the Lesson 6 Extra Practice (u4_EP06.tex).
 * Built on the Math 10C practice: the perfect-square helpers, blanks and wrong-answer codes of 10C Unit 4 Lesson 6
 * (pst, pstWrongs, blankPart: pst-sign, pst-dos, no-root, not-doubled, no-var, not-squared, half-root, …) and the
 * x² + bx + c helpers of 10C Unit 4 Lesson 3 (spec, pairDiag) for the trinomials that turn out NOT to be perfect squares.
 * Every part is a generator that keeps the booklet question's structure (sum or difference case, a leading coefficient,
 * two variables, a GCF first, a near miss that fails the three-part test) and changes the numbers; the booklet's numbers
 * are among the possible values. "Is it a perfect square trinomial?" decisions are choice tables, followed by the
 * factoring. Levels (calibrated for Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = HW.poly, FX = HW.factor;

  HW.addCodes({
    'pst-sign': 'Perfect square with the wrong sign in the bracket', 'pst-dos': 'Wrote a perfect square trinomial as a difference of squares',
    'no-root': 'Used a term instead of its square root', 'not-doubled': 'Middle term not doubled', 'no-var': 'Left the variable off the term', 'not-squared': 'Didn’t square the root',
    'not-halved': 'Didn’t halve the middle coefficient', 'half-root': 'Ignored the coefficient of the other square', 'has-var': 'Put a variable on a constant term', 'neg-square': 'Gave a negative perfect square',
    'sign-given': 'Typed the sign that was already printed', 'pst-half': 'Middle term is half of what a perfect square needs', 'gcf-lost': 'Lost the common factor taken out first',
    'pair-sum': 'Pair with the right product but the wrong sum', 'pair-product': 'Pair with the right sum but the wrong product', 'pair-signs': 'Pair with the wrong signs',
    'swap-bc': 'Numbers multiply to b and add to c (roles swapped)', 'gcf-dropped': 'Dropped the common factor', 'said-none': 'Said it can’t be factored (it can)',
    'no-pair': 'Wrote factors for a trinomial that doesn’t factor', 'use-none': 'Retyped a trinomial that doesn’t factor', 'sq-no-middle': 'Perfect square written without its middle term',
    'lw-swap': 'Length and width swapped', 'fl-only': 'Expanded with only First and Last', 'dsq-sign': 'Sum × difference: wrong sign on the last term',
    'u4l6-pst-split': 'Wrote a perfect square trinomial as two different brackets', 'u4l6-not-pst': 'Treated a trinomial that fails the test as a perfect square',
    'u4l6-is-pst': 'Said a perfect square trinomial fails the test', 'u4l6-one-k': 'Gave only one of the two middle terms', 'u4l6-side-area': 'Gave the area instead of the side (or the side instead of the perimeter)',
    'u4l6-perim': 'Perimeter not 4 × side', 'u4l6-lead-sign': 'Lost the negative leading coefficient'
  });
  HW.addPartial({ 'u4l6-pst-split': 'b', 'u4l6-not-pst': 'n', 'u4l6-is-pst': 'n', 'u4l6-one-k': 's', 'u4l6-side-area': 'b', 'u4l6-perim': 'b', 'u4l6-lead-sign': 's' });

  /* ---------------- small helpers ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
  function isq(n) { if (n < 0) return null; var r = Math.round(Math.sqrt(n)); return r * r === n ? r : null; }
  function isSq(n) { return isq(n) != null; }
  function pickWhere(gen, test) { for (var i = 0; i < 5000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u4l6: pickWhere failed'); }
  function V(x, e) { var o = {}; o[x] = e == null ? 1 : e; return o; }
  function M(c, v, e) { if (typeof v === 'string') v = V(v, e); return P.mono(c, v || {}); }
  function N(c) { return P.num(c); }
  function S() { return P.add.apply(null, arguments); }
  function tx(p) { return P.tex(p); }
  function seq(a) { return P.seq(a); }
  function sg(n) { return n < 0 ? '-' + (-n) : '+' + n; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function plain(s) { return String(s).replace(/\\left|\\right/g, '').replace(/\\underline\{\\hspace\{[^}]*\}\}/g, '__').replace(/\\[a-z]+/g, '').replace(/[{}]/g, ''); }
  function lead(p) { return P.sorted(p)[0]; }
  function sgnOf(p) { var T = lead(p); return T && T.c[0] < 0 ? -1 : 1; }
  function absM(p) { return sgnOf(p) < 0 ? P.neg(p) : p; }
  function coefOf(m) { return lead(m).c; }
  function varsOf(m) { return lead(m).v; }
  function letters(p) { var vs = P.vars(p); return vs.length ? vs : ['x']; }
  var BL = '\\underline{\\hspace{1.6em}}';

  /* ---------------- perfect square trinomials (A + B)², B carrying the sign ---------------- */
  function pst(A, B, G) {
    A = P.lift(A); B = P.lift(B); G = G ? P.lift(G) : null;
    var A2 = P.mul(A, A), B2 = P.mul(B, B), mid = P.scale(P.mul(A, B), 2), neg = sgnOf(B) < 0, Bp = absM(B);
    var baseTex = tx(A) + (neg ? '-' : '+') + tx(Bp), T = S(A2, mid, B2), full = G ? P.mul(G, T) : T, gpre = G ? (tx(G) === '-1' ? '-' : tx(G)) : '';
    var list = (G ? [G] : []).concat([{ p: S(A, B), k: 2 }]);
    return { A: A, B: B, Bp: Bp, A2: A2, B2: B2, mid: mid, neg: neg, T: T, G: G, full: full, expr: G ? tx(full) : seq([A2, mid, B2]), base: S(A, B), baseTex: baseTex,
      list: list, gpre: gpre, key: gpre + '(' + baseTex + ')^{2}' };
  }
  function pstLine(o) {
    return t('\\sqrt{' + tx(o.A2) + '}=' + tx(o.A)) + ', ' + t('\\sqrt{' + tx(o.B2) + '}=' + tx(o.Bp)) + ', ' + t('2(' + tx(o.A) + ')(' + tx(o.Bp) + ')=' + tx(P.scale(P.mul(o.A, o.Bp), 2))) + ' ✓' + (o.neg ? ' (the middle term is negative, so the bracket has a minus sign)' : '');
  }
  function pstSol(o, extra) {
    var pre = o.G ? 'Take out the GCF ' + t(tx(o.G)) + ' first: ' + t(o.expr + '=' + tx(o.G) + '(' + seq([o.A2, o.mid, o.B2]) + ')') + '.<br>' : '';
    return pre + pstLine(o) + '<br>' + t(o.expr + '=' + o.key) + (extra || '');
  }
  function sqCoefMono(m) { var c = coefOf(m), v = varsOf(m); return P.mono([c[0] * c[0] * (c[0] < 0 ? -1 : 1), c[1] * c[1]], v); }
  function pstWrongs(o) {
    var G = o.G || N(1), out = [
      { is: P.mul(G, P.pow(S(o.A, P.neg(o.B)), 2)), code: 'pst-sign', hint: 'Expand your answer: its middle term is ' + t(tx(P.mul(G, P.neg(o.mid)))) + '. The sign inside the bracket must match the sign of the middle term.' },
      { is: P.mul(G, S(o.A, o.B), S(o.A, P.neg(o.B))), code: 'pst-dos', hint: 'That’s a sum times a difference — it multiplies to ' + t(tx(P.mul(G, P.sub(o.A2, o.B2)))) + ', with no middle term. A perfect square trinomial is a bracket times <b>itself</b>.' }];
    var ca = coefOf(o.A); if (Math.abs(ca[0]) !== 1 || ca[1] !== 1) out.push({ is: P.mul(G, P.pow(S(sqCoefMono(o.A), o.B), 2)), code: 'no-root', hint: 'Use the square <b>root</b> of the first term: ' + t('\\sqrt{' + tx(o.A2) + '}=' + tx(o.A)) + '.' });
    var cb = coefOf(o.Bp); if (Math.abs(cb[0]) !== 1 || cb[1] !== 1) out.push({ is: P.mul(G, P.pow(S(o.A, sqCoefMono(o.B)), 2)), code: 'no-root', hint: 'Use the square <b>root</b> of the last term: ' + t('\\sqrt{' + tx(o.B2) + '}=' + tx(o.Bp)) + '.' });
    if (o.G) {
      out.push({ is: P.pow(S(o.A, o.B), 2), code: 'gcf-lost', hint: 'Your bracket is right, but the common factor ' + t(tx(o.G)) + ' you took out has gone missing — it stays in front.' });
    }
    return out.filter(function (w) { return !P.eq(w.is, o.full); });
  }
  var H_PST = ['Run the three-part test: is the first term a perfect square? Is the last term a perfect square? Is the middle term twice the product of the two square roots?', 'If all three hold, the trinomial is ' + t('(\\sqrt{\\text{first}}\\pm\\sqrt{\\text{last}})^{2}') + ', with the sign of the middle term.'];
  var H_PSTG = ['Take out the greatest common factor first, then run the three-part test on the trinomial left in the bracket.', 'The bracket is ' + t('(\\sqrt{\\text{first}}\\pm\\sqrt{\\text{last}})^{2}') + ', with the sign of the middle term; keep the GCF in front.'];
  function pstPart(prompt, o, x) {
    x = x || {};
    var p = KP.factored(prompt || t(o.expr), o.list, { wrong: pstWrongs(o).concat(x.wrong || []), keyTex: o.key, vars: letters(o.full) }, x.sol || pstSol(o, x.solExtra), x.hints || (o.G ? H_PSTG : H_PST), x.text || 'factor PST ' + plain(o.expr));
    var G = o.gpre;
    p.good = [G + '(' + o.baseTex + ')(' + o.baseTex + ')'].concat(x.good || []);
    p.bad = [G + '(' + tx(o.A) + (o.neg ? '+' : '-') + tx(o.Bp) + ')^{2}', G + '(' + tx(o.A) + '-' + tx(o.Bp) + ')(' + tx(o.A) + '+' + tx(o.Bp) + ')'];
    if (o.G) p.bad.push('(' + o.baseTex + ')^{2}');
    return p;
  }

  /* ---------------- x² + bx + c that is NOT a perfect square: two integers with product c and sum b ---------------- */
  function bin(u, n, w) { return P.add(u, P.scale(w || P.num(1), n)); }
  function signHint(b, c) {
    if (c > 0) return b > 0 ? 'The product is positive and the sum is positive, so <b>both</b> integers are positive.' : 'The product is positive but the sum is negative, so <b>both</b> integers are negative.';
    return 'The product is negative, so one integer is positive and one is negative; the larger one has the same sign as the sum, ' + t(b) + '.';
  }
  function spec(o) {
    var u = M(1, o.v || 'x'), G = o.G || N(1);
    var A = bin(u, o.p), Bq = bin(u, o.q), inner = P.mul(A, Bq), full = P.mul(G, inner), g1 = P.eq(G, N(1));
    var list = (g1 ? [] : [G]).concat([A, Bq]);
    return { u: u, G: G, g1: g1, p: o.p, q: o.q, b: o.p + o.q, c: o.p * o.q, A: A, B: Bq, inner: inner, full: full, list: list, key: FX.tex(list), gtex: tx(G) };
  }
  function coefRel(Sp, m) { var tm = P.terms(m)[0], c = P.coef(Sp, tm.v); return (c[0] * tm.c[1]) / (c[1] * tm.c[0]); }
  function pairDiag(s) {
    var m2 = P.mul(s.G, P.pow(s.u, 2)), m1 = P.mul(s.G, s.u), m0 = s.G, b = s.b, c = s.c;
    return function (Sp) {
      var Lc = coefRel(Sp, m2), Mc = coefRel(Sp, m1), Cc = coefRel(Sp, m0);
      if (Lc !== 1 || Mc % 1 || Cc % 1) return null;
      if (!P.eq(Sp, P.add(m2, P.scale(m1, Mc), P.scale(m0, Cc)))) return null;
      var pre = 'Your factors multiply to ' + t(tx(Sp)) + ', not ' + t(tx(s.full)) + '. ';
      if (isSq(c) && Cc === c && (Mc === 2 * isq(c) || Mc === -2 * isq(c))) return { code: 'u4l6-not-pst', hint: pre + 'This trinomial <b>fails</b> the three-part test: the middle term would have to be ' + t('\\pm' + 2 * isq(c) + tx(s.u)) + '. Use the sum-product method: two integers with product ' + t(c) + ' and sum ' + t(b) + '.' };
      if (Cc === c && Mc === -b) return { code: 'pair-signs', hint: pre + 'The signs are backwards. ' + signHint(b, c) };
      if (Mc === c && Cc === b && b !== c) return { code: 'swap-bc', hint: pre + 'The two numbers must <b>multiply to the constant</b> ' + t(c) + ' and <b>add to the middle coefficient</b> ' + t(b) + '.' };
      if (Cc === c) return { code: 'pair-sum', hint: pre + 'Your numbers multiply to ' + t(c) + ' ✓ but add to ' + t(Mc) + ', not ' + t(b) + '. Try another factor pair of ' + t(Math.abs(c)) + '.' };
      if (Mc === b) return { code: 'pair-product', hint: pre + 'Your numbers add to ' + t(b) + ' ✓ but multiply to ' + t(Cc) + ', not ' + t(c) + '.' };
      if (Cc === -c) return { code: 'pair-signs', hint: pre + 'Your numbers multiply to ' + t(Cc) + ', not ' + t(c) + '. ' + signHint(b, c) };
      return null;
    };
  }
  function triPart(s, opt) {
    opt = opt || {};
    var lines = [];
    if (opt.note) lines.push(opt.note);
    if (!s.g1) lines.push('Take out the common factor ' + t(s.gtex) + ' first: ' + t(tx(s.full) + '=' + s.gtex + '(' + tx(s.inner) + ')') + '.');
    lines.push('Two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + ': ' + t(sg(s.p)) + ' and ' + t(sg(s.q)) + '.');
    lines.push(t(tx(s.full) + '=' + s.key));
    var ws = [];
    if (!s.g1) ws.push({ is: s.inner, code: 'gcf-dropped', hint: 'Your brackets are right, but the common factor ' + t(s.gtex) + ' is missing.' });
    if (isSq(Math.abs(s.c)) && s.c > 0) { var h = isq(s.c); [h, -h].forEach(function (z) { var w = P.mul(s.G, P.pow(bin(s.u, z), 2)); if (!P.eq(w, s.full)) ws.push({ is: w, code: 'u4l6-not-pst', hint: 'The ends are perfect squares, but this trinomial <b>fails</b> the middle-term test (' + t('2(' + tx(s.u) + ')(' + h + ')=' + 2 * h + tx(s.u)) + '). Use the sum-product method instead.' }); }); }
    var p = KP.factored(opt.prompt || t(tx(s.full)), s.list, { wrong: ws, diag: pairDiag(s), keyTex: s.key, vars: letters(s.full) }, lines.join('<br>'),
      opt.hints || ['Run the three-part test first. If it fails, look for two integers with product ' + t(s.c) + ' and sum ' + t(s.b) + '.', signHint(s.b, s.c)], opt.text || 'factor ' + tx(s.full));
    var pre = s.g1 ? '' : s.gtex;
    p.good = [pre + '(' + tx(s.B) + ')(' + tx(s.A) + ')'];
    p.bad = [pre + '(' + tx(bin(s.u, -s.p)) + ')(' + tx(bin(s.u, -s.q)) + ')'].filter(function (b) { return P.eq(FX.product(b), s.full) === false; });
    return p;
  }
  /* any factoring part, inside one box with a none key ("factor completely if it factors at all") */
  function noneField(vars) { return [{ name: 'Factored form', label: 'Factored form', mode: 'math', keys: 'poly', vars: vars, none: true, wide: true, placeholder: 'e.g. (3x - 5)^2' }]; }
  function noneVal(resp) { var v = String((resp || [])[0] || '').trim(); return /^\\(text|mathrm)\{\s*none\s*\}$/i.test(v) ? 'none' : v; }
  var NONE_EMPTY = 'Type the factored form, or press <b>none</b> if it can’t be factored over the integers.';
  function inNone(base, T) {
    var chk = base.check;
    return { prompt: base.prompt, input: { type: 'fields', fields: noneField(letters(T)) }, key: [base.key], answer: base.answer, solution: base.solution, hints: base.hints, text: base.text,
      check: function (resp) { var v = noneVal(resp); if (!v) return form('empty', NONE_EMPTY); if (/^none$/i.test(v)) return wrong('said-none', 'It <b>can</b> be factored. Run the test again; if it isn’t a perfect square, look for a common factor and two integers with the right product and sum.'); return chk(v); },
      good: (base.good || []).map(function (g) { return [g]; }), bad: [['none']].concat((base.bad || []).map(function (b) { return [b]; })) };
  }
  function nonePart(T, sol, hints, text) {
    return { prompt: t(tx(T)), input: { type: 'fields', fields: noneField(letters(T)) }, key: ['none'], answer: 'It cannot be factored over the integers.', solution: sol, hints: hints, text: text,
      check: function (resp) {
        var s = noneVal(resp); if (!s) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(s)) return ok();
        var a = K.read(s); if (a.res) return a.res;
        var spl = FX.split(a.ast); if (!spl.ok) return wrong('value', null);
        var Sp = spl.factors.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, N(1));
        if (P.eq(Sp, T)) return form('use-none', 'That is the expression itself. If it can’t be factored, press <b>none</b>.');
        return wrong('no-pair', 'Your factors multiply to ' + t(tx(Sp)) + ', not ' + t(tx(T)) + '. Check the three-part test, and whether any factoring method works at all.');
      },
      bad: [[tx(T)]] };
  }

  /* ---------------- one missing term ---------------- */
  function termChk(T, ws, o) {
    o = o || {}; T = P.lift(T);
    var base = K.poly(T, { wrong: (ws || []).filter(function (w) { return !P.eq(P.lift(w.is), T); }) });
    return function (resp) {
      var r = typeof resp === 'string' && resp.trim() ? P.read(resp) : { ok: false };
      if (r.ok && P.eq(r.p, P.neg(T))) return o.signGiven ? form('sign-given', 'The ' + t(o.signGiven) + ' sign in front of the blank is already printed — type just the term that goes in the blank, without a sign.')
        : wrong('neg-square', 'A perfect square term is never negative — the missing term must be positive.');
      return base(resp);
    };
  }
  function blankPart(prompt, T, ws, o, sol, hints, text) {
    o = o || {}; T = P.lift(T);
    var p = KP.math(prompt, termChk(T, ws, o), tx(T), sol, hints, text, { keys: 'poly', vars: o.vars || letters(S(T, M(1, 'x'))) });
    p.bad = (ws || []).filter(function (w) { return !P.eq(P.lift(w.is), T); }).map(function (w) { return tx(P.lift(w.is)); });
    return p;
  }
  function midWrongs(o, v) {
    var ab = P.mul(o.A, o.Bp), ws = [{ is: ab, code: 'not-doubled', hint: 'The middle term is <b>twice</b> the product of the square roots: ' + t('2(' + tx(o.A) + ')(' + tx(o.Bp) + ')') + '.' }];
    var c = P.terms(P.scale(ab, 2))[0].c; ws.push({ is: N(c), code: 'no-var', hint: 'The middle term needs the variable: ' + t('2(' + tx(o.A) + ')(' + tx(o.Bp) + ')') + ' has ' + t(v) + ' in it.' });
    var ca = coefOf(o.A); if (Math.abs(ca[0]) !== 1) ws.push({ is: P.scale(P.mul(sqCoefMono(o.A), o.Bp), 2), code: 'no-root', hint: 'Use the square <b>root</b> of the first term: ' + t('\\sqrt{' + tx(o.A2) + '}=' + tx(o.A)) + '.' });
    var cb = coefOf(o.Bp); if (Math.abs(cb[0]) !== 1) ws.push({ is: P.scale(P.mul(o.A, sqCoefMono(o.Bp)), 2), code: 'no-root', hint: 'Use the square <b>root</b> of the last term: ' + t('\\sqrt{' + tx(o.B2) + '}=' + tx(o.Bp)) + '.' });
    return ws;
  }
  /* two middle terms ±2AB, in either box */
  function twoMidPart(prompt, o, sol, text) {
    var m = absM(o.mid), want = [m, P.neg(m)], cA = K.poly(want[0]), cB = K.poly(want[1]);
    var p = KP.fields(prompt, [{ name: 'Middle term 1', label: 'One answer:', mode: 'math', keys: 'poly', vars: letters(o.T), wide: true, placeholder: 'e.g. 12x' }, { name: 'Middle term 2', label: 'The other:', mode: 'math', keys: 'poly', vars: letters(o.T), wide: true, placeholder: 'e.g. 12x' }],
      [], [tx(want[0]), tx(want[1])], t(tx(want[0])) + ' or ' + t(tx(want[1])), sol, ['The middle term is ' + t('\\pm 2\\sqrt{\\text{first}}\\sqrt{\\text{last}}') + ': it can be positive <b>or</b> negative.', 'One gives ' + t('(\\ldots+\\ldots)^{2}') + ', the other ' + t('(\\ldots-\\ldots)^{2}') + '.'], text);
    p.check = function (resp) {
      resp = resp || []; var a = String(resp[0] || '').trim(), b = String(resp[1] || '').trim();
      if (!a || !b) return form('empty', 'Fill in both boxes: there are two middle terms that work.');
      var a0 = cA(a), b1 = cB(b), b0 = cB(a), a1 = cA(b);
      if ((a0.v === 'correct' && b1.v === 'correct') || (b0.v === 'correct' && a1.v === 'correct')) return ok();
      if ((a0.v === 'correct' && a1.v === 'correct') || (b0.v === 'correct' && b1.v === 'correct')) return wrong('u4l6-one-k', 'You have the same middle term twice. The other one has the opposite sign.');
      var one = a0.v === 'correct' || b0.v === 'correct' || a1.v === 'correct' || b1.v === 'correct';
      if (one) return wrong('u4l6-one-k', 'One of them is right. The other middle term has the opposite sign: ' + t('\\pm') + '.');
      var ws = midWrongs(o, P.vars(o.T)[0] || 'x');
      for (var i = 0; i < ws.length; i++) { var w = K.poly(P.lift(ws[i].is)); if (w(a).v === 'correct' || w(b).v === 'correct' || K.poly(P.neg(P.lift(ws[i].is)))(a).v === 'correct') return wrong(ws[i].code, ws[i].hint); }
      return wrong('value', 'The middle term must be ' + t('\\pm 2\\sqrt{\\text{first}}\\sqrt{\\text{last}}') + '.');
    };
    p.good = [[tx(want[1]), tx(want[0])]]; p.bad = [[tx(want[0]), tx(want[0])], [tx(P.mul(o.A, o.Bp)), tx(P.neg(P.mul(o.A, o.Bp)))]];
    return p;
  }
  function box(label, vars, name) { return { name: name || label.replace(/<[^>]*>|\\\(|\\\)/g, ''), label: label, mode: 'math', keys: 'poly', vars: vars, wide: true }; }
  function nbox(label, name, after) { return { name: name || label.replace(/<[^>]*>|\\\(|\\\)/g, ''), label: label, after: after }; }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return KP.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  /* decide table: rows [{tex, w, note}], cols */
  function decideGrid(prompt, rows, cols, text, hints) {
    var L = 'abcdef', want = {};
    var gr = rows.map(function (x, i) { want[L[i]] = x.w; return { id: L[i], html: '(' + L[i] + ')&nbsp; ' + t(x.tex) }; });
    return KP.grid(prompt, gr, cols, want, { why: function (id) { var x = rows[L.indexOf(id)]; return { code: 'row', hint: '(' + id + ') ' + (x.w === 'y' ? 'passes all three parts of the test — check the middle term again: ' + x.note : 'fails the test: ' + x.note) }; } },
      rows.map(function (x, i) { return '(' + L[i] + ') ' + t(x.tex) + ': ' + x.note; }).join('<br>'), hints || H_PST, text);
  }
  var PST_COLS = [{ id: 'y', html: 'Perfect square trinomial' }, { id: 'n', html: 'Not' }];
  function yesRow(o) { return { tex: o.expr, w: 'y', note: pstLine(o) + ' — yes, ' + t(o.key) + '.', o: o }; }
  function noRow(T, why) { return { tex: tx(T), w: 'n', note: why }; }
  /* a monic trinomial that fails the test: kind 'c' (c not a square), 'mid' (ends square, middle wrong), 'neg' (c < 0) */
  function failTri(r, kind, v) {
    v = v || 'x';
    if (kind === 'neg') { var o = pickWhere(function () { return { p: r.int(2, 8), q: r.int(1, 6) }; }, function (o) { return o.p !== o.q; }), sgn = r.chance(0.5) ? 1 : -1; return spec({ v: v, p: sgn * o.p, q: -sgn * o.q }); }
    if (kind === 'mid') { var h = r.int(2, 6), pr = pickWhere(function () { return r.int(1, h - 1); }, function (d) { return (h * h) % d === 0; }); var sg2 = r.chance(0.6) ? 1 : -1; return spec({ v: v, p: sg2 * pr, q: sg2 * h * h / pr }); }
    var g = pickWhere(function () { return { p: r.int(1, 7), q: r.int(2, 12) }; }, function (o) { return o.p < o.q && !isSq(o.p * o.q); }), s2 = r.chance(0.6) ? 1 : -1;
    return spec({ v: v, p: s2 * g.p, q: s2 * g.q });
  }
  function failNote(s) {
    var c = s.c, v = tx(s.u);
    if (c < 0) return 'the last term ' + t(c) + ' is negative, so it is not a perfect square — not a PST; ' + t(tx(s.full) + '=' + s.key) + '.';
    if (!isSq(c)) return t(c) + ' is not a perfect square — not a PST; ' + t(tx(s.full) + '=' + s.key) + '.';
    return 'the ends are perfect squares, but ' + t('2(' + v + ')(' + isq(c) + ')=' + 2 * isq(c) + v + '\\neq ' + Math.abs(s.b) + v) + ' — not a PST; ' + t(tx(s.full) + '=' + s.key) + '.';
  }

  HW.defineLesson({
    id: 'u4l6', unit: 4, num: '6', title: 'Factoring Perfect Square Trinomials', outcome: 'AN5',
    blurb: 'a² ± 2ab + b² = (a ± b)²: run the three-part test, then take the square roots and use the sign of the middle term. If the test fails, use the sum-product method.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Recognizing Perfect Square Trinomials', stem: 'Use the three-part test to decide whether each trinomial is a perfect square trinomial.', parts: [
        { id: '1', level: 'BEG', make: function (r) {
          var ea = r.int(2, 5), a = pst(M(1, 'x'), N(r.int(2, 9))), c = pst(M(1, 'x'), N(-r.int(3, 10))), e = pst(M(ea, 'x'), N((ea % 3 ? r.pick([1, 1, 3]) : 1) * (r.chance(0.7) ? 1 : -1)));
          if (P.eq(e.T, a.T) || P.eq(e.T, c.T)) e = pst(M(2, 'x'), N(1));
          var b = failTri(r, 'c'), d = { k: r.int(2, 6) }, f = failTri(r, 'mid');
          var dT = S(M(1, 'x', 2), M(2 * d.k, 'x'), N(-d.k * d.k + (r.chance(0.5) ? 0 : d.k * d.k - 1)));
          var dC = P.constant(dT)[0];
          var rows = [yesRow(a), noRow(b.full, failNote(b)), yesRow(c), noRow(dT, 'the last term ' + t(dC) + ' is negative, so it is not a perfect square — not a PST.'), yesRow(e), noRow(f.full, failNote(f))];
          return decideGrid('Run the test on each one.', r.shuffle(rows), PST_COLS, 'which are PSTs');
        } }] },
      { num: '2', stem: 'Fill in each blank so that the trinomial is a perfect square trinomial.', parts: [
        { id: '2a', level: 'BEG', make: function (r) {
          var k = r.int(3, 12), v = r.pick(['x', 'x', 'y', 'a', 'm', 't']), o = pst(M(1, v), N(k));
          return blankPart(t(v + '^{2}+' + BL + '+' + k * k), o.mid, midWrongs(o, v), { signGiven: '+' }, t('\\sqrt{' + k * k + '}=' + k) + ', so the middle term is ' + t('2(' + v + ')(' + k + ')=' + 2 * k + v) + '.<br>' + t(o.expr + '=' + o.key), ['The middle term of a perfect square trinomial is twice the product of the square roots of the first and last terms.'], 'blank: x^2 + __ + ' + k * k);
        } },
        { id: '2b', level: 'BEG', make: function (r) {
          var k = r.int(3, 13), v = r.pick(['x', 'x', 'y', 'a', 'm', 't']), o = pst(M(1, v), N(-k));
          return blankPart(t(v + '^{2}-' + BL + '+' + k * k), M(2 * k, v), midWrongs(pst(M(1, v), N(k)), v), { signGiven: '-' }, t('\\sqrt{' + k * k + '}=' + k) + ', so the middle term is ' + t('2(' + v + ')(' + k + ')=' + 2 * k + v) + ' (the minus sign is already printed).<br>' + t(o.expr + '=' + o.key), ['The middle term of a perfect square trinomial is twice the product of the square roots of the first and last terms.'], 'blank: x^2 - __ + ' + k * k);
        } },
        { id: '2c', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 9) }; }, function (g) { return g.a !== g.b && gcd(g.a, g.b) === 1; }), o = pst(M(g.a, 'x'), N(g.b));
          return blankPart(t(g.a * g.a + 'x^{2}+' + BL + '+' + g.b * g.b), o.mid, midWrongs(o, 'x'), { signGiven: '+' }, t('\\sqrt{' + g.a * g.a + 'x^{2}}=' + g.a + 'x') + ', ' + t('\\sqrt{' + g.b * g.b + '}=' + g.b) + ', so the middle term is ' + t('2(' + g.a + 'x)(' + g.b + ')=' + tx(o.mid)) + '.<br>' + t(o.expr + '=' + o.key), ['Take the square root of the first term (coefficient and variable) and of the last term, multiply them, then double.'], 'blank: ax^2 + __ + c');
        } },
        { id: '2d', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 9) }; }, function (g) { return g.a !== g.b && gcd(g.a, g.b) === 1; }), a = g.a, b = g.b, o = pst(M(a, 'x'), N(b));
          return blankPart(t(a * a + 'x^{2}+' + 2 * a * b + 'x+' + BL), N(b * b), [{ is: N(b), code: 'not-squared', hint: t(b) + ' is the square <b>root</b> of the last term. The last term itself is its square.' }, { is: N(a * a * b * b), code: 'half-root', hint: 'The middle term is ' + t('2(' + a + 'x)(k)') + ', not ' + t('2(x)(k)') + ': divide ' + t(2 * a * b + 'x') + ' by ' + t('2(' + a + 'x)') + ' to find ' + t('k') + '.' },
            { is: N(4 * b * b), code: 'not-halved', hint: 'Remember the <b>2</b> in “twice the product”: ' + t(2 * a * b + 'x=2(' + a + 'x)k') + '.' }, { is: M(b * b, 'x', 2), code: 'has-var', hint: 'The last term here is a constant — the ' + t('x^{2}') + ' is already in the first term.' }, { is: N(2 * a * b), code: 'value', hint: 'The last term is the square of a number ' + t('k') + ' with ' + t('2(' + a + 'x)(k)=' + 2 * a * b + 'x') + '.' }],
            {}, t('\\sqrt{' + a * a + 'x^{2}}=' + a + 'x') + '; we need ' + t(2 * a * b + 'x=2(' + a + 'x)k=' + 2 * a + 'xk') + ', so ' + t('k=' + b) + ' and the last term is ' + t('k^{2}=' + b * b) + '.<br>' + t(o.expr + '=' + o.key),
            ['Call the square root of the last term ' + t('k') + '. The middle term must be ' + t('2(' + a + 'x)(k)') + ' — solve for ' + t('k') + ', then square it.'], 'blank: ax^2 + bx + __');
        } }] },

      /* ---------- Part B ---------- */
      { num: '3', section: 'Part B — Factoring the Two Cases', stem: 'Factor each perfect square trinomial (sum case).', parts: [
        { id: '3a', level: 'BEG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'y', 'a', 'm'])), N(r.int(4, 11)))); } },
        { id: '3b', level: 'BEG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'm', 't', 'y', 'a', 'n'])), N(r.int(10, 14)))); } },
        { id: '3c', level: 'BEG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'y', 'a', 'm', 'n', 'p', 'k'])), N(r.int(1, 3)))); } },
        { id: '3d', level: 'BEG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'y', 'a', 'k'])), N(r.int(14, 20)))); } }] },
      { num: '4', stem: 'Factor each perfect square trinomial (difference case).', parts: [
        { id: '4a', level: 'BEG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'y', 'a', 'm'])), N(-r.int(4, 11)))); } },
        { id: '4b', level: 'BEG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'm', 't', 'y', 'a', 'n'])), N(-r.int(10, 14)))); } },
        { id: '4c', level: 'BEG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'y', 'a', 'm', 'n', 'p', 'k'])), N(-r.int(1, 3)))); } },
        { id: '4d', level: 'BEG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'y', 'a', 'k'])), N(-r.int(14, 20)))); } }] },
      { num: '5', parts: [
        { id: '5', level: 'EMG', make: function (r) {
          var k = r.int(3, 9), b = 2 * k, c = k * k, c2 = c - 1, v = r.pick(['x', 'x', 'y', 'a']);
          return mc(r, 'Using the three-part test, why is ' + t(v + '^{2}+' + b + v + '+' + c) + ' a perfect square trinomial but ' + t(v + '^{2}+' + b + v + '+' + c2) + ' is not?', [
            { html: t(c + '=' + k + '^{2}') + ' and ' + t('2(' + v + ')(' + k + ')=' + b + v) + ', so the first passes all three parts. In the second, ' + t(c2) + ' is not a perfect square, so it fails (it still factors, as ' + t('(' + v + '+' + (k - 1) + ')(' + v + '+' + (k + 1) + ')') + ').', right: true },
            { html: 'The second one can’t be factored at all.', why: 'It factors: ' + t('(' + v + '+' + (k - 1) + ')(' + v + '+' + (k + 1) + ')') + '. It just isn’t a perfect square.' },
            { html: 'The middle term of the second one is wrong.', why: 'Both have the same middle term ' + t(b + v) + '. Look at the last terms: is ' + t(c2) + ' a perfect square?' },
            { html: 'Both are perfect square trinomials.', why: 'Is ' + t(c2) + ' a perfect square? ' + t((k - 1) + '^{2}=' + (k - 1) * (k - 1)) + ' and ' + t(k + '^{2}=' + c) + '.' }],
            'First: ' + t('\\sqrt{' + v + '^{2}}=' + v) + ', ' + t('\\sqrt{' + c + '}=' + k) + ', ' + t('2(' + v + ')(' + k + ')=' + b + v) + ' ✓ — ' + t('(' + v + '+' + k + ')^{2}') + '.<br>Second: ' + t(c2) + ' is not a perfect square, so the test fails. It still factors by sum and product: ' + t('(' + v + '+' + (k - 1) + ')(' + v + '+' + (k + 1) + ')') + '.',
            ['Check each part of the test for both trinomials.'], 'PST vs near miss');
        } }] },

      /* ---------- Part C ---------- */
      { num: '6', section: 'Part C — Choosing a Method',
        shared: function (r) { return { a: failTri(r, 'c'), b: pickWhere(function () { return r.int(4, 12); }, function () { return true; }), c: failTri(r, 'c'), d: r.int(4, 12) }; },
        stem: function (sh) { return 'Decide whether each is a perfect square trinomial, then factor it completely, using the shortcut if it applies or the sum-product method if it does not.<br>' + rows6(sh).map(function (x, i) { return '(' + 'abcd'[i] + ') ' + t(x.tex); }).join(', &nbsp;') + '.'; },
        parts: [
          { id: '6dec', sub: 'decide', level: 'BEG', make: function (r, sh) { return decideGrid('Which are perfect square trinomials?', rows6(sh), PST_COLS, 'PST? (4 rows)'); } },
          { id: '6a', sub: 'a', level: 'BEG', make: function (r, sh) { return triPart(sh.a, { prompt: 'Factor (a) ' + t(tx(sh.a.full)) + '.', note: failNote(sh.a) }); } },
          { id: '6b', sub: 'b', level: 'BEG', make: function (r, sh) { var o = pst(M(1, 'x'), N(sh.b)); return pstPart('Factor (b) ' + t(o.expr) + '.', o); } },
          { id: '6c', sub: 'c', level: 'BEG', make: function (r, sh) { return triPart(sh.c, { prompt: 'Factor (c) ' + t(tx(sh.c.full)) + '.', note: failNote(sh.c) }); } },
          { id: '6d', sub: 'd', level: 'BEG', make: function (r, sh) { var o = pst(M(1, 'x'), N(-sh.d)); return pstPart('Factor (d) ' + t(o.expr) + '.', o); } }] },
      { num: '7',
        shared: function (r) {
          var a = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (g) { return gcd(g.a, g.b) === 1; });
          var c = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 9) }; }, function (g) { return gcd(g.a, g.b) === 1 && (g.a !== a.a || g.b !== a.b); });
          return { a: a, b: failTri(r, 'neg'), c: c, d: failTri(r, 'neg') };
        },
        stem: function (sh) { return 'Decide whether each is a perfect square trinomial, then factor it completely.<br>' + rows7(sh).map(function (x, i) { return '(' + 'abcd'[i] + ') ' + t(x.tex); }).join(', &nbsp;') + '.'; },
        parts: [
          { id: '7dec', sub: 'decide', level: 'BEG', make: function (r, sh) { return decideGrid('Which are perfect square trinomials?', rows7(sh), PST_COLS, 'PST? (4 rows)'); } },
          { id: '7a', sub: 'a', level: 'EMG', make: function (r, sh) { var o = pst(M(sh.a.a, 'x'), N(sh.a.b)); return pstPart('Factor (a) ' + t(o.expr) + '.', o); } },
          { id: '7b', sub: 'b', level: 'BEG', make: function (r, sh) { return triPart(sh.b, { prompt: 'Factor (b) ' + t(tx(sh.b.full)) + '.', note: failNote(sh.b) }); } },
          { id: '7c', sub: 'c', level: 'EMG', make: function (r, sh) { var o = pst(M(sh.c.a, 'x'), N(-sh.c.b)); return pstPart('Factor (c) ' + t(o.expr) + '.', o); } },
          { id: '7d', sub: 'd', level: 'BEG', make: function (r, sh) { return triPart(sh.d, { prompt: 'Factor (d) ' + t(tx(sh.d.full)) + '.', note: failNote(sh.d) }); } }] },
      { num: '8', stem: 'Factor completely by first removing the greatest common factor.', parts: [
        { id: '8a', level: 'PRG', make: function (r) { return pstPart(null, pst(M(1, 'x'), N(r.int(2, 7)), N(r.pick([2, 3, 4, 5])))); } },
        { id: '8b', level: 'PRG', make: function (r) { return pstPart(null, pst(M(1, 'x'), N(-r.int(2, 8)), N(r.pick([2, 3, 4, 5])))); } },
        { id: '8c', level: 'PRG', make: function (r) { var g = r.pick([2, 3, 5, 6]); return pstPart(null, pst(M(1, r.pick(['x', 'x', 'a', 'm'])), N(r.int(3, 7) * (r.chance(0.7) ? 1 : -1)), N(g))); } }] },

      /* ---------- Part D ---------- */
      { num: '9', section: 'Part D — Application and Review',
        shared: function (r) { return { k: r.int(3, 15), x: r.int(2, 12), v: r.pick(['x', 'x', 'y', 't']) }; },
        stem: function (sh) { return 'A square garden has area ' + t('(' + pst(M(1, sh.v), N(sh.k)).expr + ')') + ' m².'; },
        parts: [
          { id: '9a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var v = sh.v, o = pst(M(1, v), N(sh.k)), side = o.base;
            var p = KP.poly('Write an expression for the side length of the garden.', side, { wrong: [{ is: N(sh.k), code: 'no-var', hint: 'The side is a whole bracket: ' + t('\\sqrt{' + v + '^{2}}=' + v) + ' and ' + t('\\sqrt{' + sh.k * sh.k + '}=' + sh.k) + '.' }, { is: M(1, v), code: 'no-var', hint: 'Add the square root of the last term too.' }, { is: S(M(1, v), N(2 * sh.k)), code: 'not-halved', hint: 'Use the square root of the last term, ' + t(sh.k) + '.' }] },
              'The area of a square is (side)². ' + pstLine(o) + ', so ' + t(o.expr + '=' + o.key) + ' and the side is ' + t('(' + o.baseTex + ')') + ' m.', ['Factor the area as a perfect square: area = (side)².'], 'garden side');
            p.bad = [String(sh.k), v + '+' + 2 * sh.k];
            return p;
          } },
          { id: '9b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var X = sh.x, k = sh.k, side = X + k, A = side * side;
            var v = sh.v;
            var p = KP.fields('If ' + t(v + '=' + X) + ', find the numerical area and the numerical side length of the garden.', [nbox('Area', 'Area', 'm²'), nbox('Side length', 'Side length', 'm')],
              [K.number(A, function (v) { return v === side ? { code: 'u4l6-side-area', hint: 'That is the side length. The area is the side squared.' } : null; }), K.number(side, function (v) { return v === A ? { code: 'u4l6-side-area', hint: 'That is the area. The side is ' + t(v + '+' + k) + '.' } : null; })],
              [String(A), String(side)], 'Area ' + t(A) + ' m², side ' + t(side) + ' m',
              'Side ' + t('=' + v + '+' + k + '=' + X + '+' + k + '=' + side) + ' m. Area ' + t('=' + side + '^{2}=' + A) + ' m² (check: ' + t(X + '^{2}+' + 2 * k + '(' + X + ')+' + k * k + '=' + A) + ' ✓).',
              ['Find the side first from your answer to (a), then square it for the area.'], 'garden at x');
            p.bad = [[String(side), String(A)]];
            return p;
          } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var k1 = r.int(5, 12), k2 = r.int(2, 6), nm = r.int(3, 7), g = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5) }; }, function (g) { return gcd(g.a, g.b) === 1; });
          var Cc = pickWhere(function () { return nm * nm + r.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]); }, function (v) { return v > 0 && !isSq(v); });
          var A = pst(M(1, 'x'), N(k1)), Bp = pst(M(1, 'x'), N(-k2)), D = pst(M(g.a, 'x'), N(g.b)), Ct = S(M(1, 'x', 2), M(2 * nm, 'x'), N(Cc));
          var yes = function (o) { return 'That one passes: ' + pstLine(o) + ', so it is ' + t(o.key) + '.'; };
          return mc(r, 'Which of the following is <b>not</b> a perfect square trinomial?', [
            { html: t(tx(Ct)), right: true }, { html: t(A.expr), why: yes(A) }, { html: t(Bp.expr), why: yes(Bp) }, { html: t(D.expr), why: yes(D) }],
            t(tx(Ct)) + ': ' + t(Cc) + ' is not a perfect square (and ' + t('2(x)(\\sqrt{' + Cc + '})') + ' is not ' + t(2 * nm + 'x') + '), so it fails the test. The other three pass all three parts.',
            ['Check each option: is the last term a perfect square, and is the middle term twice the product of the roots?'], 'MC not a PST');
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var k = r.int(5, 15), h = pickWhere(function () { return r.int(1, k - 1); }, function (v) { return (k * k) % v === 0; }), v = r.pick(['x', 'x', 'y', 'a']);
          var e = v + '^{2}-' + 2 * k + v + '+' + k * k;
          return mc(r, 'The trinomial ' + t(e) + ' factors as', [
            { html: t('(' + v + '-' + k + ')^{2}'), right: true },
            { html: t('(' + v + '+' + k + ')^{2}'), why: 'Expand it: the middle term would be ' + t('+' + 2 * k + v) + '. The bracket takes the sign of the middle term.' },
            { html: t('(' + v + '-' + k + ')(' + v + '+' + k + ')'), why: 'That is a difference of squares: it multiplies to ' + t(v + '^{2}-' + k * k) + ', with no middle term.' },
            { html: t('(' + v + '-' + h + ')(' + v + '-' + (k * k / h) + ')'), why: 'Those multiply to ' + t(k * k) + ' but add to ' + t(-(h + k * k / h)) + ', not ' + t(-2 * k) + '.' }],
            t('\\sqrt{' + v + '^{2}}=' + v) + ', ' + t('\\sqrt{' + k * k + '}=' + k) + ', ' + t('2(' + v + ')(' + k + ')=' + 2 * k + v) + ' ✓ and the middle term is negative, so ' + t(e + '=(' + v + '-' + k + ')^{2}') + '.',
            ['Run the three-part test; the bracket takes the sign of the middle term.'], 'MC factor PST');
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 9) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a * g.a !== g.b; }), o = pst(M(g.a, 'x'), N(g.b));
          return mc(r, 'One factor of ' + t(o.expr) + ' is', [
            { html: t(o.baseTex), right: true },
            { html: t(g.a * g.a + 'x+' + g.b), why: 'Use the square <b>root</b> of the first term: ' + t('\\sqrt{' + g.a * g.a + 'x^{2}}=' + g.a + 'x') + '.' },
            { html: t(g.a + 'x+' + g.b * g.b), why: 'Use the square <b>root</b> of the last term: ' + t('\\sqrt{' + g.b * g.b + '}=' + g.b) + '.' },
            { html: t('x+' + g.b), why: t('\\sqrt{' + g.a * g.a + 'x^{2}}=' + g.a + 'x') + ', not ' + t('x') + '.' }],
            pstLine(o) + ', so ' + t(o.expr + '=' + o.key) + '. The factor is ' + t(o.baseTex) + '.', ['Take the square root of the first term and of the last term.'], 'MC one factor of PST');
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 11) }; }, function (g) { return g.a !== g.b && gcd(g.a, g.b) === 1; }), a = g.a, b = g.b, K2 = 2 * a * b;
          return KP.nr('The trinomial ' + t(a * a + 'x^{2}+Kx+' + b * b) + ' is a perfect square trinomial, where ' + t('K') + ' is positive. The value of ' + t('K') + ' is ________.', K2, function (v) {
            if (v === a * b) return { code: 'not-doubled', hint: 'The middle term is <b>twice</b> the product of the square roots.' };
            if (v === 2 * a * a * b || v === 2 * a * b * b || v === 2 * a * a * b * b) return { code: 'no-root', hint: 'Use the square <b>roots</b>: ' + t('\\sqrt{' + a * a + 'x^{2}}=' + a + 'x') + ' and ' + t('\\sqrt{' + b * b + '}=' + b) + '.' };
            return null;
          }, t('\\sqrt{' + a * a + 'x^{2}}=' + a + 'x') + ', ' + t('\\sqrt{' + b * b + '}=' + b) + ', so the middle term is ' + t('2(' + a + 'x)(' + b + ')=' + K2 + 'x') + ' and ' + t('K=' + K2) + '.', ['The middle term is ' + t('2\\sqrt{\\text{first}}\\sqrt{\\text{last}}') + '.'], 'NR K for PST');
        } }] },
      { num: '14', stem: 'Factor completely.', parts: [
        { id: '14', level: 'MAS', make: function (r) { var g = r.pick([2, 3, 3, 4, 5]); return pstPart(null, pst(M(1, 'x'), N(r.int(2, 7) * (r.chance(0.7) ? 1 : -1)), M(g, 'x'))); } }] }
    ],

    extra: [
      { num: '1', section: 'Extra practice A — Leading Coefficients and Two Variables', stem: 'Factor each perfect square trinomial. Take the square root of the <b>whole</b> first term, coefficient included.', parts: [1, -1, 1, -1].map(function (sgn, i) {
        return { id: 'e1' + 'abcd'[i], level: 'EMG', make: function (r) { var g = pickWhere(function () { return { a: r.int(2, 7), b: r.int(1, 9) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; }); return pstPart(null, pst(M(g.a, 'x'), N(sgn * g.b))); } };
      }) },
      { num: '2', stem: 'Factor each perfect square trinomial. Check by confirming that the middle term equals ' + t('2\\times\\sqrt{\\text{first}}\\times\\sqrt{\\text{last}}') + '.', parts: [1, -1, 1, -1].map(function (sgn, i) {
        return { id: 'e2' + 'abcd'[i], level: 'EMG', make: function (r) { var g = pickWhere(function () { return { a: r.int(2, 9), b: r.int(1, 9) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b && g.a * g.b >= 6; }); return pstPart(null, pst(M(g.a, 'x'), N(sgn * g.b))); } };
      }) },
      { num: '3', stem: 'Each trinomial has <b>two</b> variables. The first and last terms are squares, and the middle term is twice the product of their roots.', parts: [-1, 1, -1].map(function (sgn, i) {
        return { id: 'e3' + 'abc'[i], level: 'PRG', make: function (r) { var g = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 7) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; }), v = r.pick([['a', 'b'], ['m', 'n'], ['p', 'q'], ['x', 'y']]); return pstPart(null, pst(M(g.a, v[0]), M(sgn * g.b, v[1]))); } };
      }) },

      { num: '4', section: 'Extra practice B — The Recognition Test', stem: 'Two perfect squares at the ends are <b>not</b> enough: the middle term must be exactly ' + t('2\\sqrt{\\text{first}}\\sqrt{\\text{last}}') + '. If the trinomial is a perfect square trinomial, type its factored form. If it is not, type the middle term it <b>would</b> need.', parts: [true, false, true, false].map(function (yes, i) {
        return { id: 'e4' + 'abcd'[i], level: 'EMG', make: function (r) { return testPart(r, yes, i % 2 === 0 ? (i === 0 ? 1 : -1) : 1); } };
      }) },
      { num: '5',
        shared: function (r) {
          var b = pickWhere(function () { return { a: r.int(2, 7), b: r.int(1, 5) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; });
          var c = pickWhere(function () { return { g: r.pick([4, 9]), p: r.int(1, 4), q: r.int(2, 6) }; }, function (o) { return o.p < o.q && !isSq(o.p * o.q); });
          var d = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 6) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; });
          return { a: failTri(r, 'mid'), b: b, c: c, d: d };
        },
        stem: function (sh) { return 'For each one: is it a perfect square trinomial, and if not, which part of the test fails? Then factor completely if the expression factors at all.<br>' + rows5(sh).map(function (x, i) { return '(' + 'abcd'[i] + ') ' + t(x.tex); }).join(', &nbsp;') + '.'; },
        parts: [
          { id: 'e5dec', sub: 'decide', level: 'EMG', make: function (r, sh) { return decideGrid('Which part of the test fails?', rows5(sh), [{ id: 'y', html: 'none — it is a PST' }, { id: 'ends', html: 'an end term isn’t a perfect square' }, { id: 'mid', html: 'the middle term is wrong' }], 'which part fails'); } },
          { id: 'e5a', sub: 'a', level: 'BEG', make: function (r, sh) { return inNone(triPart(sh.a, { prompt: 'Factor (a) ' + t(tx(sh.a.full)) + ' completely, or press <b>none</b>.', note: failNote(sh.a) }), sh.a.full); } },
          { id: 'e5b', sub: 'b', level: 'EMG', make: function (r, sh) { var o = pst(M(sh.b.a, 'x'), N(-sh.b.b)); return inNone(pstPart('Factor (b) ' + t(o.expr) + ' completely, or press <b>none</b>.', o), o.T); } },
          { id: 'e5c', sub: 'c', level: 'PRG', make: function (r, sh) { var s = spec({ G: N(sh.c.g), p: sh.c.p, q: sh.c.q }); return inNone(triPart(s, { prompt: 'Factor (c) ' + t(tx(s.full)) + ' completely, or press <b>none</b>.', note: t(sh.c.g * sh.c.p * sh.c.q) + ' is not a perfect square, so it is not a PST; but every term has the common factor ' + t(sh.c.g) + '.' }), s.full); } },
          { id: 'e5d', sub: 'd', level: 'EMG', make: function (r, sh) {
            var a = sh.d.a, b = sh.d.b, T = S(M(a * a, 'a', 2), M(a * b, { a: 1, b: 1 }), M(b * b, 'b', 2));
            var p = nonePart(T, t('\\sqrt{' + a * a + 'a^{2}}=' + a + 'a') + ', ' + t('\\sqrt{' + b * b + 'b^{2}}=' + b + 'b') + ', so a perfect square would need the middle term ' + t('2(' + a + 'a)(' + b + 'b)=' + 2 * a * b + 'ab') + ', not ' + t(a * b + 'ab') + '. It has no common factor and no pair of brackets multiplies to it, so it <b>does not factor</b> over the integers.',
              ['Run the test: what middle term would a perfect square need?', 'If it isn’t a perfect square and there is no common factor, check whether it factors at all.'], 'none: ' + plain(tx(T)));
            p.prompt = 'Factor (d) ' + t(tx(T)) + ' completely, or press <b>none</b>.';
            p.bad.push(['(' + a + 'a+' + b + 'b)^{2}']);
            return p;
          } }] },
      { num: '6', shared: function (r) { return { k: r.int(2, 12), v: r.pick(['x', 'x', 'y', 'a']) }; },
        stem: function (sh) { return 'Dmitri factored ' + t(sh.v + '^{2}+' + 2 * sh.k + sh.v + '+' + sh.k * sh.k) + ' as ' + t('(' + sh.v + '+' + sh.k + ')(' + sh.v + '-' + sh.k + ')') + '.'; },
        parts: [
          { id: 'e6a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var k = sh.k, v = sh.v, T = P.sub(M(1, v, 2), N(k * k));
            var p = KP.poly('Multiply his answer out.', T, { wrong: [{ is: S(M(1, v, 2), N(k * k)), code: 'dsq-sign', hint: 'The last terms are ' + t('+' + k) + ' and ' + t('-' + k) + ': their product is <b>negative</b>.' }] },
              t('(' + v + '+' + k + ')(' + v + '-' + k + ')=' + v + '^{2}-' + k + v + '+' + k + v + '-' + k * k + '=' + v + '^{2}-' + k * k) + ' — not the original trinomial.', ['Use FOIL; the middle terms cancel.'], 'expand Dmitri');
            p.bad = [v + '^2+' + k * k];
            return p;
          } },
          { id: 'e6b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var k = sh.k, v = sh.v;
            return mc(r, 'Which pattern did Dmitri confuse it with?', [
              { html: 'The <b>difference of squares</b> ' + t('a^{2}-b^{2}=(a-b)(a+b)') + ', which has no middle term. ' + t(v + '^{2}+' + 2 * k + v + '+' + k * k) + ' has a middle term, so it is a bracket times itself.', right: true },
              { html: 'The sum-product method.', why: 'The sum-product method would give two numbers with product ' + t(k * k) + ' and sum ' + t(2 * k) + ': ' + t(k) + ' and ' + t(k) + ' — the correct answer. His brackets come from a different pattern.' },
              { html: 'Removing a common factor.', why: 'There is no common factor here. Look at the shape of his answer: a plus bracket times a minus bracket.' },
              { html: 'None — his answer is right.', why: 'Expand it: you get ' + t(v + '^{2}-' + k * k) + '.' }],
              'His brackets ' + t('(a+b)(a-b)') + ' are the difference-of-squares pattern, which multiplies to ' + t(v + '^{2}-' + k * k) + '. A trinomial with middle term ' + t('2(' + v + ')(' + k + ')') + ' is a perfect square: ' + t('(' + v + '+' + k + ')^{2}') + '.',
              ['Which pattern gives a plus bracket times a minus bracket?'], 'confused with DoS');
          } },
          { id: 'e6c', sub: 'c', level: 'BEG', make: function (r, sh) { var o = pst(M(1, sh.v), N(sh.k)); return pstPart('Give the correct factorization of ' + t(o.expr) + '.', o); } }] },
      { num: '7', shared: function (r) { var h = r.int(3, 8), p = pickWhere(function () { return r.int(1, h - 1); }, function (v) { return (h * h) % v === 0; }); return { h: h, p: p, q: h * h / p, v: r.pick(['x', 'x', 'y', 'a', 'm']) }; },
        stem: function (sh) { return 'Hana says ' + t(sh.v + '^{2}+' + (sh.p + sh.q) + sh.v + '+' + sh.h * sh.h) + ' must be a perfect square trinomial “because ' + t(sh.h * sh.h) + ' is a perfect square.”'; },
        parts: [
          { id: 'e7a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var h = sh.h, b = sh.p + sh.q;
            return mc(r, 'Why does her reasoning fail the three-part test?', [
              { html: 'A perfect square last term is only one of three conditions. The middle term would have to be ' + t('2(x)(' + h + ')=' + 2 * h + 'x') + ', and ' + t(b + 'x\\neq ' + 2 * h + 'x') + '.', right: true },
              { html: t(h * h) + ' is not really a perfect square.', why: t(h * h + '=' + h + '^{2}') + ' is a perfect square. Check the middle term.' },
              { html: 'The first term ' + t('x^{2}') + ' isn’t a perfect square.', why: t('x^{2}=(x)^{2}') + ' is a perfect square. Check the middle term.' },
              { html: 'Her reasoning is fine — it is a perfect square trinomial.', why: 'Expand ' + t('(x+' + h + ')^{2}=x^{2}+' + 2 * h + 'x+' + h * h) + ': the middle term isn’t ' + t(b + 'x') + '.' }],
              'The test needs <b>all three</b>: ' + t('x^{2}') + ' ✓, ' + t(h * h + '=' + h + '^{2}') + ' ✓, but the middle term must be ' + t('2(x)(' + h + ')=' + 2 * h + 'x') + ' and it is ' + t(b + 'x') + ' ✗.',
              ['Check the third part of the test.'], 'Hana fails test');
          } },
          { id: 'e7b', sub: 'b', level: 'BEG', make: function (r, sh) { var s = spec({ v: sh.v, p: sh.p, q: sh.q }); return triPart(s, { prompt: 'Factor ' + t(tx(s.full)) + ' correctly.', note: failNote(s) }); } }] },

      { num: '8', section: 'Extra practice C — Common Factor First', stem: 'A trinomial can hide a perfect square behind a common factor: ' + t('2x^{2}+12x+18=2(x^{2}+6x+9)=2(x+3)^{2}') + '. Factor completely: remove the GCF first, then factor what is left.', parts: [
        { id: 'e8a', level: 'PRG', make: function (r) { return pstPart(null, pst(M(1, 'x'), N(r.int(2, 8)), N(r.pick([2, 3, 5])))); } },
        { id: 'e8b', level: 'PRG', make: function (r) { return pstPart(null, pst(M(1, 'x'), N(-r.int(2, 7)), M(r.pick([2, 3, 4, 5]), 'x'))); } },
        { id: 'e8c', level: 'PRG', make: function (r) { return pstPart(null, pst(M(1, 'x'), N(-r.int(3, 9)), N(r.pick([5, 2, 3, 6])))); } },
        { id: 'e8d', level: 'PRG', make: function (r) { return pstPart(null, pst(M(1, r.pick(['x', 'x', 'a', 'm'])), N(r.int(2, 8)), N(r.pick([4, 4, 2, 3, 7])))); } }] },
      { num: '9', stem: 'Factor completely. In these the leftover trinomial still has a leading coefficient.', parts: [
        { id: 'e9a', level: 'MAS', make: function (r) { var g = pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 5) }; }, function (g) { return gcd(g.a, g.b) === 1; }); return pstPart(null, pst(M(g.a, 'x'), N(g.b * (r.chance(0.7) ? 1 : -1)), M(r.pick([3, 2, 5]), 'x'))); } },
        { id: 'e9b', level: 'ADV', make: function (r) { var v = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n']]); return pstPart(null, pst(M(1, v[0]), M(-r.int(2, 6), v[1]), N(r.pick([2, 3, 5])))); } },
        { id: 'e9c', level: 'ADV', make: function (r) { var g = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 4) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; }); return pstPart(null, pst(M(g.a, 'x'), N(g.b), N(r.pick([2, 3])))); } }] },

      { num: '10', section: 'Extra practice D — Filling in the Missing Piece', stem: 'Replace each ' + t('\\square') + ' so the result is a perfect square trinomial.', parts: [
        { id: 'e10a', level: 'BEG', make: function (r) {
          var k = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'a', 'm', 't']), o = pst(M(1, v), N(k));
          return fillPart(t(v + '^{2}+' + 2 * k + v + '+\\square'), N(k * k), [{ is: N(k), code: 'not-halved', hint: 'Halve the middle coefficient, then <b>square</b> it: ' + t('(' + 2 * k + '\\div 2)^{2}') + '.' }, { is: N(2 * k), code: 'not-halved', hint: 'Halve the middle coefficient, then square it.' }, { is: N(4 * k * k), code: 'not-halved', hint: 'Halve ' + t(2 * k) + ' first, then square.' }], o,
            'Half of ' + t(2 * k) + ' is ' + t(k) + ', and ' + t(k + '^{2}=' + k * k) + '. ' + t(o.expr + '=' + o.key), 'x^2 + bx + □');
        } },
        { id: 'e10b', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 6), b: r.int(1, 9) }; }, function (g) { return gcd(g.a, g.b) === 1; }), a = g.a, b = g.b, o = pst(M(a, 'x'), N(-b));
          return fillPart(t('\\square x^{2}-' + 2 * a * b + 'x+' + b * b), N(a * a), [{ is: N(a), code: 'not-squared', hint: t(a) + ' is the square root; the coefficient is its square.' }, { is: N(2 * a), code: 'not-squared', hint: 'The square root of the first term is ' + t(a + 'x') + ' (since ' + t('2(' + a + 'x)(' + b + ')=' + 2 * a * b + 'x') + '); the coefficient is ' + t(a + '^{2}') + '.' }], o,
            t('\\sqrt{' + b * b + '}=' + b) + '; the middle term ' + t(2 * a * b + 'x=2(\\square\\text{root})(' + b + ')') + ' gives the root ' + t(a + 'x') + ', so the coefficient is ' + t(a + '^{2}=' + a * a) + '. ' + t(o.expr + '=' + o.key), '□x^2 - bx + c');
        } },
        { id: 'e10c', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 9) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; }), a = g.a, b = g.b, o = pst(M(a, 'x'), N(b));
          return twoMidPart('Fill in ' + t(a * a + 'x^{2}+\\square+' + b * b) + '. There are <b>two</b> correct answers — give both.', o,
            t('\\sqrt{' + a * a + 'x^{2}}=' + a + 'x') + ', ' + t('\\sqrt{' + b * b + '}=' + b) + ', so the middle term is ' + t('\\pm 2(' + a + 'x)(' + b + ')=\\pm ' + 2 * a * b + 'x') + ':<br>' + t(o.expr + '=' + o.key) + ' or ' + t(pst(M(a, 'x'), N(-b)).expr + '=' + pst(M(a, 'x'), N(-b)).key) + '.', 'two middle terms');
        } }] },
      { num: '11', stem: 'Replace each ' + t('\\square') + ' so the result is a perfect square trinomial.', parts: [
        { id: 'e11a', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 9) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; }), a = g.a, b = g.b, o = pst(M(a, 'x'), N(b));
          return twoMidPart('Fill in ' + t(a * a + 'x^{2}+\\square+' + b * b) + ' — again two answers.', o, t('\\pm 2(' + a + 'x)(' + b + ')=\\pm ' + 2 * a * b + 'x') + ': ' + t(o.key) + ' or ' + t(pst(M(a, 'x'), N(-b)).key) + '.', 'two middle terms (b)');
        } },
        { id: 'e11b', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 6), b: r.int(2, 9) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; }), a = g.a, b = g.b, o = pst(M(a, 'x'), N(-b));
          return fillPart(t(a * a + 'x^{2}-' + 2 * a * b + 'x+\\square'), N(b * b), [{ is: N(b), code: 'not-squared', hint: t(b) + ' is the square root of the last term. The term is its square.' }, { is: N(a * a * b * b), code: 'half-root', hint: 'Divide the middle term by ' + t('2(' + a + 'x)') + ' to find the root, then square it.' }, { is: N(4 * b * b), code: 'not-halved', hint: 'Remember the <b>2</b> in “twice the product”.' }], o,
            t(2 * a * b + 'x=2(' + a + 'x)(k)') + ' gives ' + t('k=' + b) + ', so the last term is ' + t(b * b) + '. ' + t(o.expr + '=' + o.key), 'ax^2 - bx + □');
        } },
        { id: 'e11c', level: 'BEG', make: function (r) {
          var k = r.int(3, 15), v = r.pick(['x', 'x', 'y', 'a', 'm', 't']), o = pst(M(1, v), N(-k));
          return fillPart(t(v + '^{2}-\\square+' + k * k), M(2 * k, v), midWrongs(pst(M(1, v), N(k)), v), o, t('2(' + v + ')(' + k + ')=' + 2 * k + v) + ' (the minus sign is printed). ' + t(o.expr + '=' + o.key), 'x^2 - □ + c', '-', [v]);
        } },
        { id: 'e11d', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 5), b: r.int(2, 6) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; }), a = g.a, b = g.b, L = r.pick([['a', 'b'], ['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q']]), u = L[0], w = L[1], o = pst(M(a, u), M(b, w));
          return fillPart(t('\\square+' + tx(o.mid) + '+' + tx(o.B2)), M(a * a, u, 2), [{ is: M(a, u), code: 'not-squared', hint: t(a + u) + ' is the square root; the first term is its square.' }, { is: N(a * a), code: 'no-var', hint: 'The first term needs ' + t(u + '^{2}') + '.' }, { is: M(a * a * b * b, u, 2), code: 'half-root', hint: 'Divide the middle term by ' + t('2(' + b + w + ')') + ' to find the root.' }], o,
            t(tx(o.mid) + '=2(\\text{root})(' + b + w + ')') + ' gives the root ' + t(a + u) + ', so the first term is ' + t(a * a + u + '^{2}') + '. ' + t(o.expr + '=' + o.key), '□ + mid + c', null, [u, w]);
        } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e12', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 11) }; }, function (g) { return g.a !== g.b && gcd(g.a, g.b) === 1; }), a = g.a, b = g.b, K2 = 2 * a * b;
          return KP.nr('The trinomial ' + t(a * a + 'x^{2}+Kx+' + b * b) + ' is a perfect square trinomial, where ' + t('K') + ' is positive. The value of ' + t('K') + ' is ________.', K2, function (v) {
            if (v === a * b) return { code: 'not-doubled', hint: 'The middle term is <b>twice</b> the product of the square roots.' };
            if (v === 2 * a * a * b || v === 2 * a * b * b) return { code: 'no-root', hint: 'Use the square <b>roots</b>: ' + t(a + 'x') + ' and ' + t(b) + '.' };
            return null;
          }, t('K=2(' + a + ')(' + b + ')=' + K2) + ': ' + t(a * a + 'x^{2}+' + K2 + 'x+' + b * b + '=(' + a + 'x+' + b + ')^{2}') + '.', ['The middle term is ' + t('2\\sqrt{\\text{first}}\\sqrt{\\text{last}}') + '.'], 'NR K');
        } }] },
      { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e13', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 7), b: r.int(1, 4), c: r.int(2, 4), d: r.int(1, 3), e: r.int(2, 9), f: r.int(2, 4), h: r.int(2, 5) }; }, function (g) { return gcd(g.a, g.b) === 1 && gcd(g.c, g.d) === 1 && gcd(g.f, g.h) === 1 && g.f !== g.h; });
          var A = pst(M(g.a, 'x'), N(g.b)), Bo = pst(M(g.c, 'x'), N(g.d)), D = pst(M(1, 'x'), N(-g.e)), C = S(M(g.f * g.f, 'x', 2), M(g.f * g.h, 'x'), N(g.h * g.h));
          var yes = function (o) { return 'That one passes: ' + pstLine(o) + '.'; };
          return mc(r, 'Which trinomial is <b>not</b> a perfect square trinomial?', [{ html: t(tx(C)), right: true }, { html: t(A.expr), why: yes(A) }, { html: t(Bo.expr), why: yes(Bo) }, { html: t(D.expr), why: yes(D) }],
            t(tx(C)) + ': the ends are ' + t('(' + g.f + 'x)^{2}') + ' and ' + t(g.h + '^{2}') + ', so the middle term would have to be ' + t('2(' + g.f + 'x)(' + g.h + ')=' + 2 * g.f * g.h + 'x') + ', not ' + t(g.f * g.h + 'x') + '.', ['Check the middle term of each one.'], 'MC not PST (middle)');
        } }] },

      { num: '14', section: 'Extra practice E — Structure, Geometry, and Reasoning', shared: function (r) { return { k: r.int(2, 12), v: r.pick(['x', 'x', 'y', 'a']) }; },
        stem: function (sh) { return 'The same two terms, ' + t(sh.v) + ' and ' + t(sh.k) + ', build two very different expressions: ' + t(sh.v + '^{2}-' + sh.k * sh.k) + ' and ' + t(sh.v + '^{2}-' + 2 * sh.k + sh.v + '+' + sh.k * sh.k) + '.'; },
        parts: [
          { id: 'e14a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var v = sh.v, k = sh.k, X = M(1, v), d1 = [S(X, N(-k)), S(X, N(k))], o = pst(X, N(-k));
            var c1 = K.factored(d1, { wrong: [{ is: [{ p: S(X, N(-k)), k: 2 }], code: 'pst-dos', hint: t('(' + v + '-' + k + ')^{2}') + ' has a middle term; ' + t(v + '^{2}-' + k * k) + ' has none. Use one minus and one plus bracket.' }] }), c2 = K.factored(o.list, { wrong: pstWrongs(o) });
            var p = KP.fields('Factor both.', [box(t(v + '^{2}-' + k * k + '='), [v], 'Difference of squares'), box(t(o.expr + '='), [v], 'Trinomial')], [c1, c2],
              ['(' + v + '-' + k + ')(' + v + '+' + k + ')', o.key], t(v + '^{2}-' + k * k + '=(' + v + '-' + k + ')(' + v + '+' + k + ')') + ' and ' + t(o.expr + '=' + o.key),
              t(v + '^{2}-' + k * k + '=' + v + '^{2}-' + k + '^{2}=(' + v + '-' + k + ')(' + v + '+' + k + ')') + '<br>' + pstLine(o) + ', so ' + t(o.expr + '=' + o.key) + '.', ['The first has no middle term; the second has one.'], 'DoS vs PST');
            p.bad = [[o.key, '(' + v + '-' + k + ')(' + v + '+' + k + ')']];
            return p;
          } },
          { id: 'e14b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var v = sh.v, k = sh.k;
            return mc(r, 'What does the presence of the middle term tell you about which pattern to use?', [
              { html: 'No middle term (two squares subtracted) → difference of squares, a sum times a difference. A middle term of ' + t('2(' + v + ')(' + k + ')') + ' → the same bracket used twice: a perfect square trinomial.', right: true },
              { html: 'Nothing: both always factor the same way.', why: 'Their factorizations differ: ' + t('(' + v + '-' + k + ')(' + v + '+' + k + ')') + ' and ' + t('(' + v + '-' + k + ')^{2}') + '.' },
              { html: 'A middle term means you must use a difference of squares.', why: 'A difference of squares has <b>no</b> middle term — the middle terms cancel.' },
              { html: 'A middle term means the expression can’t be factored.', why: t(v + '^{2}-' + 2 * k + v + '+' + k * k + '=(' + v + '-' + k + ')^{2}') + ' factors.' }],
              t('(' + v + '-' + k + ')(' + v + '+' + k + ')') + ': the inside and outside products cancel, so there is no middle term. ' + t('(' + v + '-' + k + ')(' + v + '-' + k + ')') + ': they add to ' + t('-' + 2 * k + v) + '. So: middle term present → test for a perfect square; absent → look for a difference of squares.',
              ['Expand both answers and compare the middle terms.'], 'middle term tells pattern');
          } }] },
      { num: '15', shared: function (r) { return { k: r.int(2, 12), x: r.int(1, 10), v: r.pick(['x', 'x', 'y', 'a', 't']) }; },
        stem: function (sh) { return 'A square has area ' + t('(' + pst(M(1, sh.v), N(sh.k)).expr + ')') + ' cm².'; },
        parts: [
          { id: 'e15a', sub: 'a', level: 'EMG', make: function (r, sh) { return sidePerimPart(pst(M(1, sh.v), N(sh.k)), 'cm', sh.v); } },
          { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, sh) { return sidePerimNum(pst(M(1, sh.v), N(sh.k)), sh.x, 'cm', sh.v); } }] },
      { num: '16', shared: function (r) { return { g: pickWhere(function () { return { a: r.int(2, 4), b: r.int(1, 7) }; }, function (g) { return gcd(g.a, g.b) === 1; }), x: r.int(1, 8), v: r.pick(['x', 'x', 'y', 'a', 't']) }; },
        stem: function (sh) { return 'A square tile has area ' + t('(' + pst(M(sh.g.a, sh.v), N(sh.g.b)).expr + ')') + ' mm².'; },
        parts: [
          { id: 'e16a', sub: 'a', level: 'PRG', make: function (r, sh) { return sidePerimPart(pst(M(sh.g.a, sh.v), N(sh.g.b)), 'mm', sh.v); } },
          { id: 'e16b', sub: 'b', level: 'EMG', make: function (r, sh) { return sidePerimNum(pst(M(sh.g.a, sh.v), N(sh.g.b)), sh.x, 'mm', sh.v); } }] },
      { num: '17', stem: '<b>Reasoning.</b> Use the three-part test to justify each answer.', parts: [
        { id: 'e17a', sub: 'a', level: 'EMG', make: function (r) {
          var k = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'a']);
          return mc(r, 'Why must the constant term of a perfect square trinomial (like ' + t(pst(M(1, v), N(-k)).expr) + ') always be positive?', [
            { html: 'It is the square of the second root, ' + t('(\\pm' + k + ')^{2}=' + k * k) + ', and squaring any number never gives a negative result.', right: true },
            { html: 'Because the middle term is negative.', why: 'The middle term can be either sign; the constant is still ' + t('+' + k * k) + '. It is a square.' },
            { html: 'Because the first term is positive.', why: 'The constant comes from the second root squared, not from the first term.' },
            { html: 'It doesn’t have to be: ' + t(v + '^{2}-' + 2 * k + v + '-' + k * k) + ' is also a perfect square.', why: 'Expand ' + t('(' + v + '-' + k + ')^{2}') + ': the last term is ' + t('(-' + k + ')(-' + k + ')=+' + k * k) + '.' }],
            'In ' + t('(a\\pm b)^{2}=a^{2}\\pm 2ab+b^{2}') + ' the constant is ' + t('b^{2}') + ', a square, so it is never negative: ' + t('(-' + k + ')^{2}=+' + k * k) + '.', ['Expand ' + t('(' + v + '-' + k + ')^{2}') + '.'], 'constant always positive');
        } },
        { id: 'e17b', sub: 'b', level: 'EMG', make: function (r) {
          var k = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'a']), o = pst(M(1, v), N(-k));
          return mc(r, 'Can the middle term of a perfect square trinomial be negative? What does that change? (Think of ' + t(o.expr) + '.)', [
            { html: 'Yes. A negative middle term means the binomial being squared is a <b>difference</b>: ' + t(o.expr + '=' + o.key) + '. Only the sign inside the bracket changes.', right: true },
            { html: 'No: a negative middle term means it isn’t a perfect square.', why: 'Test ' + t(o.expr) + ': ' + pstLine(o) + '.' },
            { html: 'Yes, and then the constant term becomes negative too.', why: 'The constant is a square, so it stays positive: ' + t('(-' + k + ')^{2}=+' + k * k) + '.' },
            { html: 'Yes, and then it factors as ' + t('(' + v + '-' + k + ')(' + v + '+' + k + ')') + '.', why: 'That multiplies to ' + t(v + '^{2}-' + k * k) + ' — no middle term.' }],
            pstLine(o) + ', so ' + t(o.expr + '=' + o.key) + '. The minus sign moves into the bracket; the constant stays positive.', ['Expand ' + t(o.key) + '.'], 'negative middle term');
        } },
        { id: 'e17c', sub: 'c', level: 'ADV', make: function (r) {
          var k = r.int(2, 9), v = r.pick(['x', 'x', 'y', 'a']), o = pst(M(1, v), N(-k), N(-1));
          return pstPart('Can the <b>first</b> term be negative? Factor ' + t(o.expr) + ' completely.', o, { sol: 'A negative leading term just means ' + t('-1') + ' is a common factor:<br>' + t(o.expr + '=-(' + seq([o.A2, o.mid, o.B2]) + ')') + '<br>' + pstLine(o) + ', so ' + t(o.expr + '=' + o.key) + '.',
            wrong: [{ is: P.pow(o.base, 2), code: 'u4l6-lead-sign', hint: 'Your bracket is right, but the ' + t('-1') + ' you took out has gone missing — your answer starts with ' + t('+' + v + '^{2}') + '.' }],
            hints: ['Take out ' + t('-1') + ' first so the bracket starts with ' + t('+' + v + '^{2}') + '. Watch every sign.', 'Then run the three-part test on the bracket.'], good: ['-(' + k + '-' + v + ')^{2}'] });
        } }] },
      { num: '18', section: 'Extra practice F — Stretch', stem: '<b>Stretch.</b> Treat the bracket as a single object: with ' + t('u=(x+1)') + ', ' + t('(x+1)^{2}+6(x+1)+9') + ' becomes ' + t('u^{2}+6u+9=(u+3)^{2}') + ', so it is ' + t('(x+1+3)^{2}=(x+4)^{2}') + '. Factor each one and simplify the bracket.', parts: [
        { id: 'e18a', level: 'ADV', make: function (r) { return blockPart(r.int(1, 6), r.int(2, 6)); } },
        { id: 'e18b', level: 'ADV', make: function (r) { return blockPart(r.int(1, 6), -r.int(2, 7)); } }] }
    ]
  });

  /* ---------------- helpers used above (hoisted) ---------------- */
  function rows6(sh) { var b = pst(M(1, 'x'), N(sh.b)), d = pst(M(1, 'x'), N(-sh.d)); return [noRow(sh.a.full, failNote(sh.a)), yesRow(b), noRow(sh.c.full, failNote(sh.c)), yesRow(d)]; }
  function rows7(sh) { var a = pst(M(sh.a.a, 'x'), N(sh.a.b)), c = pst(M(sh.c.a, 'x'), N(-sh.c.b)); return [yesRow(a), noRow(sh.b.full, failNote(sh.b)), yesRow(c), noRow(sh.d.full, failNote(sh.d))]; }
  function rows5(sh) {
    var b = pst(M(sh.b.a, 'x'), N(-sh.b.b)), cs = spec({ G: N(sh.c.g), p: sh.c.p, q: sh.c.q }), a = sh.d.a, bb = sh.d.b, dT = S(M(a * a, 'a', 2), M(a * bb, { a: 1, b: 1 }), M(bb * bb, 'b', 2));
    return [{ tex: tx(sh.a.full), w: 'mid', note: failNote(sh.a) }, { tex: b.expr, w: 'y', note: pstLine(b) + ' — a PST, ' + t(b.key) + '.' },
      { tex: tx(cs.full), w: 'ends', note: t(sh.c.g * sh.c.p * sh.c.q) + ' is not a perfect square; take out ' + t(sh.c.g) + ': ' + t(cs.key) + '.' },
      { tex: tx(dT), w: 'mid', note: 'the ends are ' + t('(' + a + 'a)^{2}') + ' and ' + t('(' + bb + 'b)^{2}') + ', so the middle would have to be ' + t(2 * a * bb + 'ab') + '; it does not factor.' }];
  }
  /* PST or not: factored form, or the middle term it would need */
  function testPart(r, yes, sgn) {
    var g = pickWhere(function () { return { a: r.int(2, 7), b: r.int(1, 7) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; }), o = pst(M(g.a, 'x'), N(sgn * g.b));
    var shown = yes ? o.T : S(o.A2, P.scale(o.mid, [1, 2]), o.B2), shownTex = tx(shown), need = absM(o.mid);
    var fac = K.factored(o.list, { wrong: pstWrongs(o) }), midChk = K.poly(need), midNeg = K.poly(P.neg(need));
    var sol = (yes ? pstLine(o) + ' — it <b>is</b> a perfect square trinomial: ' + t(shownTex + '=' + o.key) + '.' : t('\\sqrt{' + tx(o.A2) + '}=' + tx(o.A)) + ', ' + t('\\sqrt{' + tx(o.B2) + '}=' + tx(o.Bp)) + ', so the middle term would have to be ' + t('2(' + tx(o.A) + ')(' + tx(o.Bp) + ')=' + tx(need)) + ', not ' + t(tx(P.scale(need, [1, 2]))) + '. It is <b>not</b> a perfect square trinomial; it would need ' + t(tx(need)) + '.');
    return { prompt: t(shownTex), input: { type: 'math', keys: 'poly', vars: ['x'], placeholder: 'e.g. (3x + 2)^2, or 12x' }, key: yes ? o.key : tx(need), answer: yes ? t(o.key) : 'Not a PST; it would need ' + t(tx(need)) + '.', solution: sol,
      hints: ['Take the square roots of the first and last terms; the middle term must be twice their product.', 'If it matches, write ' + t('(\\sqrt{\\text{first}}\\pm\\sqrt{\\text{last}})^{2}') + '; if not, type ' + t('2\\sqrt{\\text{first}}\\sqrt{\\text{last}}') + '.'], text: 'PST test ' + plain(shownTex),
      check: function (resp) {
        var a = K.read(resp); if (a.res) return a.res;
        var sp = FX.split(a.ast), isFac = sp.ok && sp.factors.length && sp.factors.some(function (f) { return P.count(f.p) > 1; });
        if (yes) {
          if (isFac) return fac(resp);
          if (midChk(resp).v === 'correct') return wrong('u4l6-is-pst', 'Check the middle term again: ' + t('2(' + tx(o.A) + ')(' + tx(o.Bp) + ')=' + tx(need)) + ' — it <b>matches</b>, so this one is a perfect square trinomial. Type its factored form.');
          return wrong('value', 'This one passes the test — type its factored form ' + t('(\\ldots)^{2}') + '.');
        }
        if (isFac) return wrong('u4l6-not-pst', 'This one is <b>not</b> a perfect square trinomial: ' + t('2(' + tx(o.A) + ')(' + tx(o.Bp) + ')=' + tx(need)) + ', not ' + t(tx(P.scale(need, [1, 2]))) + '. Type the middle term it would need.');
        if (midChk(resp).v === 'correct' || midNeg(resp).v === 'correct') return ok();
        var ws = midWrongs(o, 'x');
        for (var i = 0; i < ws.length; i++) { var w = K.poly(P.lift(ws[i].is)); if (w(resp).v === 'correct') return wrong(ws[i].code, ws[i].hint); }
        return wrong('value', 'The middle term it would need is ' + t('2\\times\\sqrt{\\text{first}}\\times\\sqrt{\\text{last}}') + '.');
      },
      good: yes ? ['(' + o.baseTex + ')(' + o.baseTex + ')'] : [tx(P.neg(need))], bad: yes ? [tx(need), '(' + tx(o.A) + (o.neg ? '+' : '-') + tx(o.Bp) + ')^{2}'] : ['(' + o.baseTex + ')^{2}', tx(P.scale(need, [1, 2]))] };
  }
  /* fill a □ with the missing term (any position) */
  function fillPart(prompt, T, ws, o, sol, text, signGiven, vars) {
    var p = blankPart(prompt, T, ws, { signGiven: signGiven, vars: vars }, sol + '', ['Take the square roots of the terms you know, then use “middle term = twice the product of the roots”.'], text);
    p.prompt = prompt + ' &nbsp;What goes in the ' + t('\\square') + '?';
    return p;
  }
  function sidePerimPart(o, unit, v) {
    var side = o.base, per = P.scale(side, 4);
    var cS = K.poly(side, { wrong: [{ is: per, code: 'u4l6-side-area', hint: 'That is the perimeter. The side is the bracket that is squared.' }] }), cP = K.poly(per, { wrong: [{ is: side, code: 'u4l6-perim', hint: 'The perimeter of a square is ' + t('4\\times') + ' the side.' }, { is: P.scale(side, 2), code: 'u4l6-perim', hint: 'A square has <b>four</b> equal sides: perimeter ' + t('=4\\times') + ' side.' }] });
    var p = KP.fields('Determine an expression for the side length and an expression for the perimeter.', [box('Side length (' + unit + '):', [v], 'Side'), box('Perimeter (' + unit + '):', [v], 'Perimeter')], [cS, cP],
      [tx(side), tx(per)], 'Side ' + t('(' + tx(side) + ')') + ' ' + unit + ', perimeter ' + t('(' + tx(per) + ')') + ' ' + unit,
      pstLine(o) + ', so the area is ' + t(o.key) + ' and the side is ' + t('(' + tx(side) + ')') + ' ' + unit + '.<br>Perimeter ' + t('=4(' + tx(side) + ')=' + tx(per)) + ' ' + unit + '.',
      ['Area = side², so factor the area as a perfect square.', 'Perimeter of a square = 4 × side.'], 'side & perimeter');
    p.bad = [[tx(per), tx(side)], [tx(side), tx(P.scale(side, 2))]];
    return p;
  }
  function sidePerimNum(o, X, unit, v) {
    var env = {}; env[v] = X;
    var s = P.at(o.base, env), per = 4 * s, A = s * s;
    var p = KP.fields('Find the side length and the perimeter when ' + t(v + '=' + X) + '.', [nbox('Side length', 'Side', unit), nbox('Perimeter', 'Perimeter', unit)],
      [K.number(s, function (v) { return v === A ? { code: 'u4l6-side-area', hint: 'That is the area. The side is ' + t(o.baseTex) + ' at ' + t(v + '=' + X) + '.' } : null; }), K.number(per, function (v) { return v === 2 * s ? { code: 'u4l6-perim', hint: 'Four sides: ' + t('4\\times ' + s) + '.' } : v === A ? { code: 'u4l6-side-area', hint: 'That is the area, not the perimeter.' } : null; })],
      [String(s), String(per)], 'Side ' + t(s) + ' ' + unit + ', perimeter ' + t(per) + ' ' + unit,
      'Side ' + t('=' + o.baseTex.replace(new RegExp(v, 'g'), '(' + X + ')') + '=' + s) + ' ' + unit + '; perimeter ' + t('=4\\times ' + s + '=' + per) + ' ' + unit + ' (area ' + t(s + '^{2}=' + A) + ').',
      ['Substitute into the side expression, then multiply by 4.'], 'side & perimeter at x');
    p.bad = [[String(A), String(per)], [String(s), String(2 * s)]];
    return p;
  }
  /* (x + p)² + 2q(x + p) + q² = (x + p + q)² */
  function blockPart(pp, q) {
    var X = M(1, 'x'), u = S(X, N(pp)), res = S(X, N(pp + q)), e = '(x+' + pp + ')^{2}' + (q < 0 ? '-' : '+') + Math.abs(2 * q) + '(x+' + pp + ')+' + q * q, T = P.pow(res, 2);
    var p = KP.factored(t(e), [{ p: res, k: 2 }], { keyTex: '(' + tx(res) + ')^{2}', wrong: [
      { is: [{ p: S(X, N(pp - q)), k: 2 }], code: 'pst-sign', hint: 'Check the sign: with ' + t('u=x+' + pp) + ' it is ' + t('u^{2}' + (q < 0 ? '-' : '+') + Math.abs(2 * q) + 'u+' + q * q + '=(u' + sg(q) + ')^{2}') + '.' },
      { is: [{ p: S(X, N(q)), k: 2 }], code: 'minus-bracket', hint: 'Put the whole block back: ' + t('u=x+' + pp) + ', so ' + t('(u' + sg(q) + ')^{2}=(x+' + pp + sg(q) + ')^{2}') + '.' }] },
      'Let ' + t('u=x+' + pp) + ': ' + t('u^{2}' + (q < 0 ? '-' : '+') + Math.abs(2 * q) + 'u+' + q * q + '=(u' + sg(q) + ')^{2}') + ' (check: ' + t('2(u)(' + Math.abs(q) + ')=' + Math.abs(2 * q) + 'u') + ').<br>Put the block back: ' + t('(x+' + pp + sg(q) + ')^{2}=(' + tx(res) + ')^{2}') + '.<br>Check by expanding the original: ' + t('x^{2}+' + 2 * pp + 'x+' + pp * pp + (q < 0 ? '-' : '+') + Math.abs(2 * q) + 'x' + sg(2 * q * pp) + '+' + q * q + '=' + tx(T)) + ' ✓',
      ['Let ' + t('u=x+' + pp) + ' and factor the trinomial in ' + t('u') + ' as a perfect square.', 'Then replace ' + t('u') + ' by ' + t('x+' + pp) + ' and simplify inside the bracket.'], 'block PST');
    p.bad = ['(' + tx(S(X, N(pp - q))) + ')^{2}', '(' + tx(S(X, N(q))) + ')^{2}'].filter(function (b) { return !P.eq(FX.product(b), T); });
    p.good = ['(' + tx(res) + ')(' + tx(res) + ')'];
    return p;
  }
  HW.addCodes({ 'minus-bracket': 'Minus sign not applied to every term of the block' });
})(window);
