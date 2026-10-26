/* Math 15 · Unit 4 · Lesson 5 — Factoring the Difference of Squares (AN5)
 * Assignment 5, questions 1–14 (u4_L05.tex) and the Lesson 5 Extra Practice (u4_EP05.tex).
 * Built on the Math 10C Unit 4 Lesson 4 practice: the same spec S(a, b, R, k) (a² − b², or a⁴ − b⁴ for two passes,
 * or a sum of squares when R = 0, with a common factor k), the same checkers, worked solutions and wrong-answer codes.
 * Every part is a generator that keeps the booklet question's structure (which term comes first, a coefficient, one or
 * two letters, a GCF to take out first, a sum of squares that stops, one or two passes) and changes the numbers; the
 * booklet's numbers are among the possible values. "Where possible" parts use one box with a <b>none</b> key; the
 * "is it a difference of squares, and if not why not" items use a choice table (yes / no: a sum / no: not a perfect
 * square) followed by the factoring. Levels (calibrated for Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, KP = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;
  var P = HW.poly, FX = HW.factor, F = HW.fmt;

  HW.addCodes({
    'dsq-square': 'Wrote a difference of squares as a perfect square (A − B)²', 'no-root': 'Used a square instead of its square root in a bracket',
    'rev-order': 'Brackets give B² − A² (squares taken in the wrong order)', 'lost-gcf': 'Dropped the common factor', 'gcf-one': 'Divided only one term by the common factor',
    'sum-sq': 'Tried to factor a sum of squares', 'sum-bracket': 'Wrong plus bracket in a repeated difference of squares', 'same-factor': 'Repeated the given factor',
    'dsq-sign': 'Sum × difference: wrong sign on the last term', 'square-middle': 'Squared a binomial without the middle term', 'middle-once': 'Middle term of a square not doubled',
    'lw-swap': 'Length and width swapped', 'perim-half': 'Used L + W for the perimeter instead of 2(L + W)', 'added-sq': 'Added the squares instead of subtracting',
    'd-not-squared': 'Didn’t square the distance from the middle number', 'minus-bracket': 'Subtracted a bracket without changing every sign', 'simplify-br': 'Brackets not simplified', 'said-none': 'Said it can’t be factored (it can)', 'use-none': 'Retyped a trinomial that doesn’t factor',
    'u4l5-sq-none': 'Said a perfect square isn’t one', 'u4l5-sq-fake': 'Gave a whole-number square root for a number that isn’t a perfect square',
    'u4l5-half': 'Halved the number instead of taking its square root', 'u4l5-gave-root': 'Gave the square root where the square was needed',
    'u4l5-sq-missing': 'Missed some perfect squares', 'u4l5-ab-squares': 'Gave a² + b² instead of a + b'
  });
  HW.addPartial({ 'u4l5-sq-none': 'n', 'u4l5-sq-fake': 'n', 'u4l5-half': 'n', 'u4l5-gave-root': 'b', 'u4l5-sq-missing': 's', 'u4l5-ab-squares': 'n' });

  /* ---------------- small helpers ---------------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t2 = a % b; a = b; b = t2; } return a; }
  function pickWhere(gen, test) { for (var i = 0; i < 4000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u4l5: pickWhere failed'); }
  function N(c) { return P.num(c); }
  /* monomial c·(letters), e.g. L(4, 'x') = 4x, L(1, 'xy') = xy, L(1, 'x', 2) = x² */
  function L(c, s, e) { var o = {}; (s || '').split('').forEach(function (ch) { o[ch] = (o[ch] || 0) + (e || 1); }); return P.mono(c, o); }
  function tx(p) { return P.tex(p); }
  function sq(A) { return P.pow(A, 2); }
  function plain(s) { return String(s).replace(/\\left|\\right/g, '').replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2').replace(/\\,/g, '').replace(/[{}]/g, ''); }
  function isNum(X) { return !P.vars(X).length; }
  function isSq(n) { if (n < 0) return false; var s = Math.round(Math.sqrt(n)); return s * s === n; }
  /* how X² is written: x^{2}, 9^{2}, (4x)^{2}, (xy)^{2}, (x^{2})^{2} */
  function sqTex(X) {
    var ts = P.terms(X);
    if (ts.length === 1) {
      var T = ts[0], vs = Object.keys(T.v), c = T.c;
      if (c[1] === 1 && ((c[0] === 1 && vs.length === 1 && T.v[vs[0]] === 1) || (!vs.length && c[0] > 0))) return tx(X) + '^{2}';
    }
    return '\\left(' + tx(X) + '\\right)^{2}';
  }
  function br(list) { return '(' + P.seq(list) + ')'; }
  function dosTex(A, B) { return br([A, P.neg(B)]) + br([A, B]); }
  function dosTexR(A, B) { return br([A, B]) + br([A, P.neg(B)]); }
  function asSquares(A, B, exprTex, plus) { var s = sqTex(A) + (plus ? '+' : '-') + sqTex(B); return s === exprTex ? '' : s; }
  function notes(list) {
    var out = list.map(function (X) { var a = tx(sq(X)), b = sqTex(X); return a === b ? null : t(a + '=' + b); }).filter(Boolean);
    return out.length ? 'Both terms are perfect squares: ' + out.join(' and ') + '.<br>' : '';
  }
  var IDENT = t('a^{2}-b^{2}=(a-b)(a+b)');
  var H_DOS = ['Check that both terms are perfect squares and that they are <b>subtracted</b>, then use ' + IDENT + '.', 'Write each term as a square first, e.g. ' + t('16x^{2}=(4x)^{2}') + ' and ' + t('81=9^{2}') + '. One bracket gets a minus sign, the other a plus sign.'];
  var H_GCF = ['Take out the greatest common factor first; what is left in the bracket should be a difference (or sum) of squares.', 'Then factor the bracket with ' + IDENT + ' and keep the common factor in front. A sum of squares does not factor.'];
  var H_MULTI = ['Use ' + IDENT + ', then look at every bracket: the minus bracket may be a difference of squares again.', 'The plus brackets are sums of squares — they never factor. Stop when no bracket is a difference of squares.'];

  /* ---------------- factored-answer parts ---------------- */
  function cleanW(T, ws) {
    var out = [];
    (ws || []).forEach(function (w) {
      if (!w || !w.is) return; var p = FX.product(w.is);
      if (P.eq(p, T) || out.some(function (o) { return P.eq(FX.product(o.is), p); })) return;
      out.push(w);
    });
    return out;
  }
  function wTex(is) { return typeof is === 'string' ? is : FX.tex(is); }
  function factPart(prompt, target, ws, sol, hints, text, o) {
    o = o || {};
    var T = FX.product(target), W = cleanW(T, ws);
    var p = KP.factored(prompt, target, { wrong: W, keyTex: o.keyTex, vars: o.vars }, sol, hints, text);
    if (o.wrap) p.check = o.wrap(p.check, T);
    p.bad = W.map(function (w) { return wTex(w.is); }).concat(o.bad || []);
    p.good = o.good || [];
    return p;
  }
  /* brackets must be simplified: (x+3-4)(x+3+4) → nudge */
  function simpBr(check) {
    return function (resp) {
      var r = check(resp); if (r.v !== 'correct') return r;
      var a = K.read(resp), sp = FX.split(a.ast);
      if (sp.ok && sp.factors.some(function (f) { return f.ast && P.formIssue(f.ast); })) return form('simplify-br', 'Right — now <b>simplify inside each bracket</b> (collect the like terms) so each bracket is as short as possible.');
      return r;
    };
  }

  /* s = { a, b, R, k }: k·(a^E − b^E) with E = 2^R (R = 1 one pass, 2 two passes, 3 three passes), or k·(a² + b²) when R = 0. */
  function E2(R) { return Math.pow(2, Math.max(R, 1)); }
  function innerOf(s) { var E = E2(s.R); return s.R === 0 ? P.add(sq(s.a), sq(s.b)) : P.sub(P.pow(s.a, E), P.pow(s.b, E)); }
  function innerTex(s) { var E = E2(s.R); return s.R === 0 ? P.seq([sq(s.a), sq(s.b)]) : P.seq([P.pow(s.a, E), P.neg(P.pow(s.b, E))]); }
  function exprTexOf(s) {
    if (!s.k) return innerTex(s);
    var E = E2(s.R);
    return s.R === 0 ? P.seq([P.mul(s.k, sq(s.a)), P.mul(s.k, sq(s.b))]) : P.seq([P.mul(s.k, P.pow(s.a, E)), P.neg(P.mul(s.k, P.pow(s.b, E)))]);
  }
  function plusBrackets(a, b, R, from) { var s = ''; for (var j = from; j < R; j++) { var e = Math.pow(2, j); s += br([P.pow(a, e), P.pow(b, e)]); } return s; }
  function targetOf(s) {
    var kt = s.k ? tx(s.k) : '';
    if (s.R === 0) return kt + '(' + innerTex(s) + ')';
    return kt + dosTex(s.a, s.b) + plusBrackets(s.a, s.b, s.R, 1);
  }
  function factorsOf(s, kOn) {
    var out = s.k && kOn !== false ? [s.k] : [];
    if (s.R === 0) return out.concat([innerOf(s)]);
    out.push(P.sub(s.a, s.b), P.add(s.a, s.b));
    for (var j = 1; j < s.R; j++) { var e = Math.pow(2, j); out.push(P.add(P.pow(s.a, e), P.pow(s.b, e))); }
    return out;
  }
  function unrooted(X) {
    var ts = P.terms(X); if (ts.length !== 1) return null;
    var T = ts[0], c = T.c;
    if (c[1] !== 1 || Math.abs(c[0]) === 1) return null;
    return P.mono(c[0] * c[0], T.v);
  }
  function wrongsOf(s) {
    var a = s.a, b = s.b, k = s.k, pre = k ? [k] : [], kt = k ? tx(k) : '', ws = [];
    var rest = factorsOf(s).slice(pre.length + 2);
    if (s.R === 0) {
      ws.push({ is: pre.concat([P.sub(a, b), P.add(a, b)]), code: 'sum-sq', hint: 'Those brackets multiply to ' + t((kt ? kt + '(' : '') + P.seq([sq(a), P.neg(sq(b))]) + (kt ? ')' : '')) + ' — a <b>difference</b>. The bracket ' + t(innerTex(s)) + ' is a <b>sum</b> of squares, and a sum of squares never factors: stop once the common factor is out.' });
      ws.push({ is: pre.concat([{ p: P.add(a, b), k: 2 }]), code: 'sum-sq', hint: t('(' + P.seq([a, b]) + ')^{2}=' + tx(sq(P.add(a, b)))) + ' has a middle term. ' + t(innerTex(s)) + ' is a sum of squares: it doesn’t factor, so stop once the common factor is out.' });
      return ws;
    }
    var D = P.sub(a, b), S = P.add(a, b);
    var sqHint = function (X, xt) { return 'A squared bracket has a middle term: ' + t('(' + xt + ')^{2}=' + tx(sq(X))) + '. A difference of squares needs one <b>minus</b> bracket and one <b>plus</b> bracket, so the middle terms cancel.'; };
    ws.push({ is: pre.concat([{ p: D, k: 2 }], rest), code: 'dsq-square', hint: sqHint(D, P.seq([a, P.neg(b)])) });
    ws.push({ is: pre.concat([{ p: S, k: 2 }], rest), code: 'dsq-square', hint: sqHint(S, P.seq([a, b])) });
    ws.push({ is: pre.concat([P.sub(b, a), P.add(b, a)], rest), code: 'rev-order', hint: 'Your factors multiply to the <b>opposite</b> of the question (the squares are subtracted the other way round). The first term of each bracket is the square root of the <b>first</b> term, ' + t(tx(P.pow(a, E2(s.R)))) + '.' });
    if (s.R === 1) {
      [[a, 0], [b, 1]].forEach(function (pr) {
        var X = pr[0], X2 = isNum(X) ? (P.eq(sq(X), X) ? null : sq(X)) : unrooted(X); if (!X2) return;
        var A2 = pr[1] ? a : X2, B2 = pr[1] ? X2 : b;
        ws.push({ is: pre.concat([P.sub(A2, B2), P.add(A2, B2)]), code: 'no-root', hint: 'Use the square <b>roots</b> in the brackets: ' + t(tx(sq(X)) + '=' + sqTex(X)) + ', so the bracket term is ' + t(tx(X)) + ', not ' + t(tx(X2)) + '.' });
      });
    }
    if (s.R >= 2) {
      var e = Math.pow(2, s.R - 1), lastTex = '(' + P.seq([P.pow(a, e), P.pow(b, e)]) + ')';
      var fs = factorsOf(s), wrongLast = fs.slice(0, fs.length - 1).concat([P.sub(P.pow(a, e / 2), P.pow(b, e / 2)), P.add(P.pow(a, e / 2), P.pow(b, e / 2))]);
      ws.push({ is: wrongLast, code: 'sum-sq', hint: t(lastTex) + ' is a <b>sum</b> of squares — it does not factor. (Brackets like ' + t(br([P.pow(a, e / 2), P.neg(P.pow(b, e / 2))]) + br([P.pow(a, e / 2), P.pow(b, e / 2)])) + ' multiply to a <b>difference</b>.)' });
      if (isNum(b) && !P.eq(sq(b), b) && s.R === 2) ws.push({ is: pre.concat([D, S, P.add(sq(a), b)]), code: 'sum-bracket', hint: 'Check the plus bracket from the first pass: ' + t(tx(P.pow(b, 4)) + '=' + sqTex(sq(b))) + ', so it is ' + t(lastTex) + '.' });
    }
    if (k) {
      ws.push({ is: factorsOf(s, false), code: 'lost-gcf', hint: 'Your brackets are right, but the common factor ' + t(kt) + ' has gone missing. It stays in front of the brackets.' });
      if (isNum(k)) {
        var kv = P.constant(k)[0], E = E2(s.R);
        ws.push({ is: [k, P.sub(P.pow(a, E), P.scale(P.pow(b, E), kv))], code: 'gcf-one', hint: 'When you take out ' + t(kt) + ', divide <b>every</b> term by it: ' + t(tx(P.mul(k, P.pow(b, E))) + '\\div ' + kt + '=' + tx(P.pow(b, E))) + '.' });
      }
    }
    return ws;
  }
  function roundsLines(s, pre, exprTex) {
    var a = s.a, b = s.b, R = s.R, lines = [], first = innerTex(s);
    var E = Math.pow(2, R - 1), lead = sqTex(P.pow(a, E)) + '-' + sqTex(P.pow(b, E));
    var open = pre ? '\\left[' : '', close = pre ? '\\right]' : '';
    if (lead !== first && lead !== exprTex) lines.push('=' + pre + open + lead + close);
    for (var j = R - 1; j >= 0; j--) {
      var e = Math.pow(2, j);
      lines.push('=' + pre + br([P.pow(a, e), P.neg(P.pow(b, e))]) + br([P.pow(a, e), P.pow(b, e)]) + plusBrackets(a, b, R, j + 1));
    }
    return lines;
  }
  function solOf(s, exprTex, noNotes) {
    var kt = s.k ? tx(s.k) : '', inner = innerTex(s), out = '';
    if (s.k) out += 'Take out the GCF ' + t(kt) + ' first:<br>' + t(exprTex + '=' + kt + '(' + inner + ')') + '<br>';
    if (s.R === 0) return out + t(inner) + ' is a <b>sum</b> of squares (' + t(sqTex(s.a) + '+' + sqTex(s.b)) + '), so it does not factor. Final answer: ' + t(targetOf(s)) + '.';
    if (!s.k && s.R === 1 && !noNotes) out += notes([s.a, s.b]);
    var lines = roundsLines(s, kt, exprTex);
    if (s.R === 1) return out + t((s.k ? '' : exprTex) + lines.join(''));
    out += t((s.k ? '' : exprTex) + lines[0]);
    for (var i = 1; i < lines.length; i++) out += '<br>' + t(lines[i]);
    return out + '<br>Each pass the <b>minus</b> bracket is a difference of squares again; the <b>plus</b> brackets are sums of squares and stop.';
  }
  function fxPart(s, o) {
    o = o || {};
    var exprTex = o.exprTex || exprTexOf(s), target = targetOf(s);
    var good = [];
    if (s.R >= 1) { var kt = s.k ? tx(s.k) : ''; good.push(kt + dosTexR(s.a, s.b) + plusBrackets(s.a, s.b, s.R, 1)); }
    var hints = o.hints || (s.k ? H_GCF : s.R >= 2 ? H_MULTI : H_DOS);
    return factPart(o.prompt || t(exprTex), target, wrongsOf(s).concat(o.wrong || []), (o.solPre || '') + solOf(s, exprTex, o.noNotes) + (o.solPost || ''), hints, o.text || 'factor ' + plain(exprTex),
      { good: good.concat(o.good || []), bad: o.bad, wrap: o.wrap, keyTex: o.keyTex });
  }
  function S(a, b, R, k) { return { a: a, b: b, R: R == null ? 1 : R, k: k || null }; }

  /* ---------------- "factor where possible": one box with a none key ---------------- */
  function noneField(vars) { return [{ name: 'Factored form', label: 'Factored form', mode: 'math', keys: 'poly', vars: vars, none: true, wide: true, placeholder: 'e.g. (3x - 5)(3x + 5)' }]; }
  function noneVal(resp) { var v = String((resp || [])[0] || '').trim(); return /^\\(text|mathrm)\{\s*none\s*\}$/i.test(v) ? 'none' : v; }
  var NONE_EMPTY = 'Type the factored form, or press <b>none</b> if it can’t be factored over the integers.';
  function varsOfS(s) { var vs = P.vars(P.add(sq(s.a), sq(s.b), s.k || N(0))); return vs.length ? vs : ['x']; }
  function canDos(s, o) {
    var base = fxPart(s, o), chk = base.check;
    return { prompt: base.prompt, input: { type: 'fields', fields: noneField(varsOfS(s)) }, key: [base.key], answer: base.answer, solution: base.solution, hints: base.hints, text: base.text,
      check: function (resp) {
        var v = noneVal(resp);
        if (!v) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(v)) return wrong('said-none', 'It <b>can</b> be factored: both terms are perfect squares (' + t(sqTex(s.a)) + ' and ' + t(sqTex(s.b)) + ') and they are <b>subtracted</b>.');
        return chk(v);
      },
      good: base.good.map(function (g) { return [g]; }), bad: [['none']].concat(base.bad.map(function (b) { return [b]; })) };
  }
  /* a sum of squares A² + B²: the answer is none */
  function noneSum(A, B) {
    var T = P.add(sq(A), sq(B)), e = P.seq([sq(A), sq(B)]), vs = P.vars(T);
    return { prompt: t(e), input: { type: 'fields', fields: noneField(vs.length ? vs : ['x']) }, key: ['none'], answer: 'It cannot be factored over the integers: it is a <b>sum</b> of squares.',
      solution: t(e + '=' + sqTex(A) + '+' + sqTex(B)) + ' is a <b>sum</b> of squares, not a difference. The pattern ' + IDENT + ' needs a minus sign, and ' + t(dosTex(A, B)) + ' multiplies to ' + t(P.seq([sq(A), P.neg(sq(B))])) + '. So it <b>cannot be factored</b> over the integers.',
      hints: ['Is it a <b>difference</b> or a <b>sum</b>?', 'A sum of squares can’t be factored over the integers — press <b>none</b>.'], text: 'where possible ' + plain(e) + ' (sum)',
      check: function (resp) {
        var s = noneVal(resp);
        if (!s) return form('empty', NONE_EMPTY);
        if (/^none$/i.test(s)) return ok();
        var a = K.read(s); if (a.res) return a.res;
        var spl = FX.split(a.ast); if (!spl.ok) return wrong('value', null);
        var Sp = spl.factors.reduce(function (acc, f) { return P.mul(acc, P.pow(f.p, f.k)); }, P.num(1));
        if (P.eq(Sp, T)) return form('use-none', 'That is the expression itself. If it can’t be factored, press <b>none</b>.');
        return wrong('sum-sq', 'Your factors multiply to ' + t(tx(Sp)) + ', not ' + t(e) + '. ' + t(e) + ' is a <b>sum</b> of squares, and a sum of squares never factors over the integers.');
      },
      bad: [[dosTex(A, B)], ['(' + P.seq([A, B]) + ')^{2}']] };
  }

  /* ---------------- other part makers ---------------- */
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return KP.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function missingPart(A, B, givenMinus) {
    var expr = P.seq([sq(A), P.neg(sq(B))]), D = P.sub(A, B), Sm = P.add(A, B), given = givenMinus ? D : Sm, want = givenMinus ? Sm : D;
    var ws = [{ is: given, code: 'same-factor', hint: 'That’s the factor you were given. The two factors of a difference of squares have <b>opposite</b> signs, so the middle terms cancel — ' + t('(' + tx(given) + ')(' + tx(given) + ')=' + tx(sq(given))) + '.' }];
    if (isNum(B) && !P.eq(sq(B), B)) { var B2 = sq(B); ws.push({ is: givenMinus ? P.add(A, B2) : P.sub(A, B2), code: 'no-root', hint: 'Use the square <b>root</b>: ' + t(tx(B2) + '=' + sqTex(B)) + ', so the number in the bracket is ' + t(tx(B)) + ', not ' + t(tx(B2)) + '.' }); }
    var sqs = asSquares(A, B, expr), AB = P.mul(A, B);
    var prods = givenMinus ? [sq(A), AB, P.neg(AB), P.neg(sq(B))] : [sq(A), P.neg(AB), AB, P.neg(sq(B))];
    var sol = t(expr + '=' + (sqs ? sqs + '=' : '') + '(' + tx(given) + ')(' + tx(want) + ')') + ', so the missing factor is ' + t('(' + tx(want) + ')') + '.<br>Check: ' + t('(' + tx(given) + ')(' + tx(want) + ')=' + P.seq(prods) + '=' + expr) + ' ✓';
    var p = KP.poly(t(expr + '=(' + tx(given) + ')\\left(\\underline{\\hspace{2.6em}}\\right)'), want, { wrong: ws }, sol,
      ['The two factors of ' + t('a^{2}-b^{2}') + ' are ' + t('a-b') + ' and ' + t('a+b') + ': the same two terms, opposite signs.', 'Check by multiplying: the middle terms must cancel.'], 'missing factor ' + plain(expr));
    p.good = ['(' + tx(want) + ')', P.seq([givenMinus ? B : P.neg(B), A])];
    p.bad = ws.map(function (w) { return tx(w.is); });
    return p;
  }
  function pbox(label, vars, name) { return { name: name || label.replace(/<[^>]*>|\\\(|\\\)/g, ''), label: label, mode: 'math', keys: 'poly', vars: vars, wide: true }; }
  function nbox(label, name) { return { name: name || label.replace(/<[^>]*>|\\\(|\\\)/g, ''), label: label }; }
  /* two poly boxes: length (larger) and width */
  function lwCheck(Lp, Wp, area) {
    var cl = K.poly(Lp), cw = K.poly(Wp), both = K.fields([cl, cw], { labels: ['Length', 'Width'] });
    return function (resp) {
      resp = resp || []; var a = resp[0] == null ? '' : resp[0], b = resp[1] == null ? '' : resp[1];
      if (cl(a).v === 'correct' && cw(b).v === 'correct') return ok();
      if (cl(b).v === 'correct' && cw(a).v === 'correct') return form('lw-swap', 'Those are the two right factors, but the <b>length</b> is the longer side: ' + t(tx(Lp)) + ' is greater than ' + t(tx(Wp)) + '.');
      var ra = P.read(a), rb = P.read(b);
      if (a && b && ra.ok && rb.ok && !P.eq(P.mul(ra.p, rb.p), area)) return wrong('value', 'Length × width must equal the area: your two expressions multiply to ' + t(tx(P.mul(ra.p, rb.p))) + ', not ' + t(tx(area)) + '. Factor the area as a difference of squares.');
      return both(resp);
    };
  }
  function productPart(n, d) {
    var a = n - d, b = n + d, ans = n * n - d * d;
    return KP.number('Evaluate ' + t(a + '\\times ' + b) + ' the same way.', ans, function (v) {
      if (v === n * n + d * d) return { code: 'added-sq', hint: t('(' + n + '-' + d + ')(' + n + '+' + d + ')=' + n + '^{2}-' + d + '^{2}') + ': <b>subtract</b> the square.' };
      if (v === n * n - d) return { code: 'd-not-squared', hint: 'Square the ' + t(d) + ' too: ' + t(d + '^{2}=' + d * d) + '.' };
      if (v === n * n) return { code: 'd-not-squared', hint: 'Don’t forget to subtract ' + t(d + '^{2}') + '.' };
      return null;
    }, t(a) + ' and ' + t(b) + ' are both ' + t(d) + ' away from ' + t(n) + ':<br>' + t(a + '\\times ' + b + '=(' + n + '-' + d + ')(' + n + '+' + d + ')=' + n + '^{2}-' + d + '^{2}') + '<br>' + t('=' + F(n * n) + '-' + d * d + '=' + F(ans)),
      ['Find the number halfway between ' + t(a) + ' and ' + t(b) + ', and how far each is from it.', 'Then use ' + t('(n-d)(n+d)=n^{2}-d^{2}') + '.'], a + '×' + b + ' by difference of squares');
  }
  function squaresPart(a, b) {
    var ans = (a - b) * (a + b);
    return KP.number(t(a + '^{2}-' + b + '^{2}'), ans, function (v) {
      if (v === (a - b) * (a - b)) return { code: 'dsq-square', hint: t('a^{2}-b^{2}=(a-b)(a+b)') + ': multiply the difference by the <b>sum</b>.' };
      if (v === (a - b) + (a + b)) return { code: 'value', hint: t('(a-b)') + ' and ' + t('(a+b)') + ' are <b>multiplied</b>.' };
      if (v === (a + b) * (a + b)) return { code: 'dsq-square', hint: t('a^{2}-b^{2}=(a-b)(a+b)') + ': multiply the <b>difference</b> by the sum.' };
      return null;
    }, t(a + '^{2}-' + b + '^{2}=(' + a + '-' + b + ')(' + a + '+' + b + ')=' + (a - b) + '\\times ' + F(a + b) + '=' + F(ans)),
      ['Use ' + t('a^{2}-b^{2}=(a-b)(a+b)') + ': find the difference and the sum of the two numbers.'], plain(a + '^2-' + b + '^2'));
  }
  /* is n a perfect square? the root, or none */
  function rootPart(n) {
    var sqn = isSq(n), r = Math.round(Math.sqrt(n)), lo = Math.floor(Math.sqrt(n)), hi = lo + 1;
    return { prompt: 'Is ' + t(n) + ' a perfect square? If it is, type its square root. If it isn’t, press <b>none</b>.', input: { type: 'fields', fields: [{ name: 'Square root', label: t('\\sqrt{' + n + '}='), mode: 'math', keys: 'product', none: true, placeholder: 'a whole number, or none' }] },
      key: [sqn ? String(r) : 'none'], answer: sqn ? t(n + '=' + r + '^{2}') + ', so it is a perfect square with square root ' + t(r) + '.' : t(n) + ' is not a perfect square.',
      check: function (resp) {
        var v = noneVal(resp);
        if (!v) return form('empty', 'Type the square root, or press <b>none</b>.');
        if (/^none$/i.test(v)) return sqn ? wrong('u4l5-sq-none', t(n) + ' <b>is</b> a perfect square: which whole number times itself gives ' + t(n) + '?') : ok();
        var pn = HW.parse.number(v); if (!pn.ok) return form('notnumber', 'Type a whole number, or press <b>none</b>.');
        var x = pn.value;
        if (sqn && Math.abs(x) === r) return ok();
        if (!sqn) return wrong('u4l5-sq-fake', t(x + '\\times ' + x + '=' + x * x) + ', not ' + t(n) + '. ' + t(n) + ' is between ' + t(lo + '^{2}=' + lo * lo) + ' and ' + t(hi + '^{2}=' + hi * hi) + ', so no whole number squares to it — press <b>none</b>.');
        if (x * 2 === n) return wrong('u4l5-half', 'That is half of ' + t(n) + '. The square root is the number that, <b>multiplied by itself</b>, gives ' + t(n) + '.');
        return wrong('value', t(x + '\\times ' + x + '=' + x * x) + ', not ' + t(n) + '.');
      },
      solution: sqn ? t(r + '\\times ' + r + '=' + n) + ', so ' + t(n) + ' is a perfect square and ' + t('\\sqrt{' + n + '}=' + r) + '.' : t(lo + '^{2}=' + lo * lo) + ' and ' + t(hi + '^{2}=' + hi * hi) + ', and ' + t(n) + ' is in between, so it is <b>not</b> a perfect square.',
      hints: ['Know the squares: ' + t('1,4,9,16,25,36,49,64,81,100,121,144,169,196,225') + '.'], text: 'perfect square? ' + n,
      bad: [[sqn ? 'none' : String(lo)], [String(n / 2)]].filter(function (b) { return !(sqn && Math.abs(+b[0]) === r); }) };
  }
  /* a table: is each expression a difference of squares? */
  var DOS_COLS = { yes: 'yes', gcf: 'yes, after a GCF', sum: 'no: a sum', notsq: 'no: not both squares' };
  function dosGrid(prompt, rows, colIds, text) {
    var want = {}, cols = colIds.map(function (c) { return { id: c, html: DOS_COLS[c] }; });
    rows.forEach(function (x) { want[x.id] = x.kind; });
    var why = { yes: 'it is a difference and both terms are perfect squares', gcf: 'neither term is a perfect square as written, but after taking out the GCF the bracket is a difference of squares', sum: 'it is a <b>sum</b> (plus sign), not a difference', notsq: 'a term is not a perfect square (a number that isn’t a square, or an odd exponent)' };
    return KP.grid(prompt, rows.map(function (x) { return { id: x.id, html: '(' + x.id + ') ' + t(x.tex) }; }), cols, want,
      { why: function (id) { var x = rows.filter(function (y) { return y.id === id; })[0]; return { code: 'row', hint: '(' + id + ') ' + t(x.tex) + ': ' + x.note }; } },
      rows.map(function (x) { return '(' + x.id + ') ' + t(x.tex) + ': ' + DOS_COLS[x.kind] + ' — ' + why[x.kind] + '. ' + x.note; }).join('<br>'),
      ['Check two things: is it a <b>difference</b> (subtraction)? Is each term a <b>perfect square</b> (square number, even exponents)?', 'If neither term is a perfect square, look for a common factor first.'], text);
  }

  HW.defineLesson({
    id: 'u4l5', unit: 4, num: '5', title: 'Factoring the Difference of Squares', outcome: 'AN5',
    blurb: 'a² − b² = (a − b)(a + b): take the square root of each term, one bracket minus and one plus. Remove a GCF first, and know why a sum of squares never factors.',
    questions: [
      /* ---------- Part A ---------- */
      { num: '1', section: 'Part A — Recognizing and Factoring', stem: 'Complete each equation by determining the missing factor.', parts: [
        { id: '1a', level: 'LIM', make: function (r) { return missingPart(L(1, r.pick(['y', 'y', 'x', 'm', 't', 'k'])), N(r.int(2, 12)), true); } },
        { id: '1b', level: 'LIM', make: function (r) { return missingPart(L(1, r.pick(['h', 'h', 'x', 'a', 'p', 'w'])), N(r.int(11, 15)), false); } },
        { id: '1c', level: 'BEG', make: function (r) { var v = r.pick([['p', 'q'], ['p', 'q'], ['r', 's'], ['a', 'b'], ['x', 'y'], ['m', 'n'], ['c', 'd'], ['u', 'v'], ['g', 'h'], ['j', 'k'], ['s', 't']]); return missingPart(L(1, v[0]), L(1, v[1]), r.chance(0.7)); } }] },
      { num: '2', stem: 'Factor each difference of squares.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { return fxPart(S(L(1, r.pick(['x', 'x', 'y', 'a', 'm'])), N(r.int(3, 12)))); } },
        { id: '2b', level: 'BEG', make: function (r) { return fxPart(S(L(1, r.pick(['x', 'x', 'k', 'p', 'w'])), N(r.int(2, 9)))); } },
        { id: '2c', level: 'BEG', make: function (r) { var n = r.int(11, 19), v = r.pick(['x', 'x', 'y', 'a', 'm']); return fxPart(S(L(1, v), N(n)), { exprTex: v + '^{2}-' + n + '^{2}', noNotes: true }); } },
        { id: '2d', level: 'BEG', make: function (r) { var n = r.pick([20, 30, 40, 50, 60, 70, 80, 90]), v = r.pick(['x', 'x', 'y', 't']); return fxPart(S(L(1, v), N(n)), { exprTex: v + '^{2}-' + F(n * n), noNotes: true, solPre: t(F(n * n) + '=' + n + '^{2}') + '.<br>' }); } }] },
      { num: '3', parts: [
        { id: '3', level: 'EMG', make: function (r) {
          var k = r.int(2, 12), k2 = k * k, v = r.pick(['x', 'x', 'y', 'a', 'm']);
          return mc(r, 'Why does ' + t(v + '^{2}-' + k2) + ' factor as ' + t('(' + v + '-' + k + ')(' + v + '+' + k + ')') + ' but ' + t(v + '^{2}+' + k2) + ' cannot be factored this way?', [
            { html: t(k2 + '=' + k + '^{2}') + ', so ' + t(v + '^{2}-' + k2) + ' is a <b>difference</b> of squares. ' + t(v + '^{2}+' + k2) + ' is a <b>sum</b> of squares: ' + t('(' + v + '-' + k + ')(' + v + '+' + k + ')') + ' always gives a minus sign, so a sum can’t be factored over the integers.', right: true },
            { html: t(k2) + ' is not a perfect square, so only the difference works.', why: t(k2 + '=' + k + '^{2}') + ' <b>is</b> a perfect square. The difference between the two is the sign.' },
            { html: t(v + '^{2}+' + k2 + '=(' + v + '+' + k + ')^{2}') + ', so it does factor, just differently.', why: 'Expand ' + t('(' + v + '+' + k + ')^{2}=' + v + '^{2}+' + 2 * k + v + '+' + k2) + ' — it has a middle term, so it isn’t ' + t(v + '^{2}+' + k2) + '.' },
            { html: 'Both factor; ' + t(v + '^{2}+' + k2 + '=(' + v + '+' + k + ')(' + v + '-' + k + ')') + ' too.', why: 'Expand ' + t('(' + v + '+' + k + ')(' + v + '-' + k + ')') + ': it is ' + t(v + '^{2}-' + k2) + ', with a minus sign.' }],
            t('(' + v + '-' + k + ')(' + v + '+' + k + ')=' + v + '^{2}-' + k + v + '+' + k + v + '-' + k2 + '=' + v + '^{2}-' + k2) + ': the middle terms cancel and the last term is always <b>negative</b>. So the pattern only works for a difference. ' + t(v + '^{2}+' + k2) + ' is a sum of squares and cannot be factored over the integers.',
            ['Expand ' + t('(' + v + '-' + k + ')(' + v + '+' + k + ')') + '. What sign does the last term have?'], 'why sum of squares doesn’t factor');
        } }] },
      { num: '4', stem: 'Factor where possible. If an expression can’t be factored over the integers, press <b>none</b>.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var v = r.pick([['a', 'b'], ['a', 'b'], ['p', 'q'], ['x', 'y'], ['m', 'n'], ['s', 't'], ['c', 'd'], ['u', 'v'], ['r', 's'], ['g', 'h'], ['j', 'k'], ['e', 'f'], ['w', 'z'], ['k', 'm'], ['h', 'k'], ['a', 'c'], ['b', 'c'], ['x', 'z'], ['y', 'z'], ['p', 'r'], ['m', 'p'], ['d', 'e']]); return canDos(S(L(1, v[0]), L(1, v[1]))); } },
        { id: '4b', level: 'BEG', make: function (r) { return canDos(S(L(1, r.pick(['g', 'g', 'x', 'k', 'w', 'h'])), N(r.int(2, 12)))); } },
        { id: '4c', level: 'EMG', make: function (r) { return canDos(S(N(r.pick([1, 1, 1, 2, 3, 4, 5, 6])), L(1, r.pick(['k', 'k', 'x', 'y', 'n'])))); } },
        { id: '4d', level: 'EMG', make: function (r) { var v = r.pick([['n', 'm'], ['n', 'm'], ['x', 'y'], ['a', 'b'], ['p', 'q']]); return canDos(S(L(1, v[0]), L(r.int(2, 9), v[1]))); } },
        { id: '4e', level: 'BEG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 9), d: r.int(2, 12) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return canDos(S(L(g.c, r.pick(['x', 'x', 'a', 'y'])), N(g.d))); } },
        { id: '4f', level: 'PRG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 9), d: r.int(2, 9) }; }, function (g) { return gcd(g.c, g.d) === 1; }), v = r.pick([['a', 'b'], ['a', 'b'], ['x', 'y'], ['m', 'n']]); return canDos(S(L(g.c, v[0]), L(g.d, v[1]))); } },
        { id: '4g', level: 'EMG', make: function (r) { var g = pickWhere(function () { return { c: r.int(1, 7), d: r.int(1, 5) }; }, function (g) { return gcd(g.c, g.d) === 1 && g.c * g.d > 1; }), v = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n']]); return noneSum(L(g.c, v[0]), L(g.d, v[1])); } },
        { id: '4h', level: 'PRG', make: function (r) { var g = pickWhere(function () { return { c: r.int(5, 12), d: r.int(6, 13) }; }, function (g) { return gcd(g.c, g.d) === 1; }), v = r.pick([['c', 'd'], ['c', 'd'], ['x', 'y'], ['p', 'q']]); return canDos(S(L(g.c, v[0]), L(g.d, v[1]))); } }] },

      /* ---------- Part B ---------- */
      { num: '5', section: 'Part B — Common Factors, Perfect Squares and Two Variables',
        stem: function (sh) { return 'The surface of a rectangular garden has area ' + t(tx(sh.area)) + ' square metres.'; },
        shared: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 8), b: r.int(1, 6), p: r.int(2, 15) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b && (g.a * g.p) % (3 * g.b) === 0 && 4 * g.a * g.p <= 320; });
          g.q = g.a * g.p / (3 * g.b); g.per = 4 * g.a * g.p; g.Lv = g.a * g.p + g.b * g.q; g.Wv = g.a * g.p - g.b * g.q;
          g.Lp = P.add(L(g.a, 'p'), L(g.b, 'q')); g.Wp = P.sub(L(g.a, 'p'), L(g.b, 'q')); g.area = P.mul(g.Lp, g.Wp);
          return g;
        },
        parts: [
          { id: '5a', level: 'EMG', make: function (r, sh) {
            var A = L(sh.a, 'p'), Bq = L(sh.b, 'q'), at = tx(sh.area);
            var p = KP.fields('Write expressions for the length and width of the garden.', [pbox('Length (m):', ['p', 'q'], 'Length'), pbox('Width (m):', ['p', 'q'], 'Width')],
              [], [tx(sh.Lp), tx(sh.Wp)], 'Length ' + t('=(' + tx(sh.Lp) + ')') + ' m, width ' + t('=(' + tx(sh.Wp) + ')') + ' m',
              'Area = length × width, so factor the area: ' + t(at + '=' + sqTex(A) + '-' + sqTex(Bq) + '=' + dosTex(A, Bq)) + '.<br>The longer side is the length: ' + t('L=(' + tx(sh.Lp) + ')') + ' m and ' + t('W=(' + tx(sh.Wp) + ')') + ' m.',
              ['Area = length × width. Factor the area as a difference of squares.', 'The factor with the plus sign is the longer side (the length).'], 'garden dimensions from ' + plain(at));
            p.check = lwCheck(sh.Lp, sh.Wp, sh.area);
            p.bad = [[tx(sh.Wp), tx(sh.Lp)], [tx(P.add(L(sh.a * sh.a, 'p'), L(sh.b * sh.b, 'q'))), tx(P.sub(L(sh.a * sh.a, 'p'), L(sh.b * sh.b, 'q')))]];
            return p;
          } },
          { id: '5b', level: 'PRG', make: function (r, sh) {
            var a = sh.a, per = sh.per;
            return KP.number('The length and width are ' + t('(' + tx(sh.Lp) + ')') + ' m and ' + t('(' + tx(sh.Wp) + ')') + ' m. If the perimeter is ' + t(per) + ' metres, form an equation in ' + t('p') + ' and ' + t('q') + ' and solve for ' + t('p') + '.', sh.p, function (v) {
              if (v === per / (2 * a)) return { code: 'perim-half', hint: 'The perimeter goes around <b>all four</b> sides: ' + t('P=2(L+W)') + ', not ' + t('L+W') + '.' };
              if (v === per / a) return { code: 'perim-half', hint: 'Add the length and width first — the ' + t('q') + ' terms cancel — then double: ' + t('2\\left[(' + tx(sh.Lp) + ')+(' + tx(sh.Wp) + ')\\right]') + '.' };
              return null;
            }, t('P=2(L+W)=2\\left[(' + tx(sh.Lp) + ')+(' + tx(sh.Wp) + ')\\right]=2(' + 2 * a + 'p)=' + 4 * a + 'p') + ' — the ' + t('q') + ' terms cancel.<br>' + t(4 * a + 'p=' + per) + ', so ' + t('p=' + per + '\\div ' + 4 * a + '=' + sh.p) + '.',
              ['Perimeter = ' + t('2(L+W)') + '. Use the expressions for the length and width.', 'When you add the length and width, the ' + t('q') + ' terms cancel.'], 'garden perimeter ' + per + ' → p', { before: t('p=') });
          } },
          { id: '5c', level: 'ADV', make: function (r, sh) {
            var a = sh.a, b = sh.b, p0 = sh.p;
            var nL = K.number(sh.Lv), nW = K.number(sh.Wv), both = K.fields([nL, nW], { labels: ['Length', 'Width'] });
            var part = KP.fields('The length and width are ' + t('(' + tx(sh.Lp) + ')') + ' m and ' + t('(' + tx(sh.Wp) + ')') + ' m, and a perimeter of ' + t(sh.per) + ' m gives ' + t('p=' + p0) + '. Determine the length and width if the length is twice the width.', [nbox('Length (m):', 'Length'), nbox('Width (m):', 'Width')],
              [], [String(sh.Lv), String(sh.Wv)], 'Length ' + t(sh.Lv) + ' m, width ' + t(sh.Wv) + ' m',
              '“Length is twice the width”: ' + t(tx(sh.Lp) + '=2(' + tx(sh.Wp) + ')=' + tx(P.scale(sh.Wp, 2))) + ', so ' + t(3 * b + 'q=' + a + 'p') + '.<br>With ' + t('p=' + p0) + ': ' + t(3 * b + 'q=' + a * p0) + ', so ' + t('q=' + sh.q) + '.<br>Length ' + t('=' + a + '(' + p0 + ')+' + b + '(' + sh.q + ')=' + sh.Lv) + ' m, width ' + t('=' + a + '(' + p0 + ')-' + b + '(' + sh.q + ')=' + sh.Wv) + ' m.<br>Check: ' + t(sh.Lv + '=2\\times ' + sh.Wv) + ' ✓ and ' + t('2(' + sh.Lv + '+' + sh.Wv + ')=' + sh.per) + ' ✓',
              ['Write “length = 2 × width” with the expressions, and solve for ' + t('q') + ' using ' + t('p=' + p0) + '.', 'Then substitute ' + t('p') + ' and ' + t('q') + ' into the length and width.'], 'garden: length twice width');
            part.check = function (resp) {
              resp = resp || [];
              if (String(resp[0] == null ? '' : resp[0]).trim() === '' || String(resp[1] == null ? '' : resp[1]).trim() === '') return both(resp);
              if (Number(resp[0]) === sh.Wv && Number(resp[1]) === sh.Lv) return form('lw-swap', 'Those are the right two numbers, but the length is the longer side.');
              if (Number(resp[0]) !== sh.Lv && Number(resp[0]) === 2 * Number(resp[1])) return wrong('value', 'Your length is twice your width, but check the perimeter: it must still be ' + t(sh.per) + ' m. Set ' + t('(' + tx(sh.Lp) + ')=2(' + tx(sh.Wp) + ')') + ' and solve for ' + t('q') + ' using ' + t('p=' + p0) + '.');
              return both(resp);
            };
            part.bad = [[String(sh.Wv), String(sh.Lv)]];
            return part;
          } }] },
      { num: '6', stem: 'Factor by first removing the GCF.', parts: [
        { id: '6a', level: 'PRG', make: function (r) { return fxPart(S(L(1, 'x'), N(r.int(2, 6)), 1, N(r.pick([2, 3, 4, 4, 5, 6, 7])))); } },
        { id: '6b', level: 'PRG', make: function (r) { return fxPart(S(L(1, r.pick(['a', 'a', 'x', 'm'])), N(r.int(2, 7)), 1, N(r.pick([2, 2, 3, 5, 6, 7])))); } },
        { id: '6c', level: 'PRG', make: function (r) { var v = r.pick([['t', 's'], ['t', 's'], ['x', 'y'], ['a', 'b']]); return fxPart(S(L(1, v[0]), L(r.int(2, 5), v[1]), 0, N(r.pick([2, 3, 5, 6, 6, 7])))); } },
        { id: '6d', level: 'PRG', make: function (r) { var v = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]); return fxPart(S(L(1, v[0]), L(1, v[1]), 1, N(r.pick([2, 3, 5, 5, 6, 7, 10])))); } }] },
      { num: '7', stem: 'Factor completely.', parts: [
        { id: '7a', level: 'PRG', make: function (r) { var k = r.pick([3, 3, 2, 5, 6, 7]); return fxPart(S(L(1, r.pick(['xy', 'xy', 'ab', 'mn'])), N(r.int(2, 6)), 1, N(k))); } },
        { id: '7b', level: 'PRG', make: function (r) { var v = r.pick(['m', 'm', 'x', 'a', 'y']); return fxPart(S(L(1, v), N(r.int(2, 6)), 1, L(r.pick([2, 2, 3, 5]), v))); } },
        { id: '7c', level: 'PRG', make: function (r) { var v = r.pick(['pq', 'pq', 'xy', 'ab']); return fxPart(S(N(r.int(2, 5)), L(1, v), 1, N(r.pick([5, 5, 2, 3, 6]))), { solPost: '<br>Keep the squares in the question’s order (number first), so the signs come out right.' }); } }] },
      { num: '8', stem: 'State whether each number is a perfect square. If it is, give its square root.', parts: [0, 1, 2, 3, 4, 5].map(function (i) {
        return { id: '8' + 'abcdef'[i], level: 'LIM', outcome: '', make: function (r) {
          var sqWanted = r.chance(i % 2 ? 0.7 : 0.3), lo = [10, 30, 60, 90, 120, 150][i], hi = lo + 80;
          var n = sqWanted ? Math.pow(r.int(Math.ceil(Math.sqrt(lo)), Math.floor(Math.sqrt(hi))), 2) : pickWhere(function () { return r.int(lo, hi); }, function (v) { return !isSq(v); });
          return rootPart(n);
        } };
      }) },
      { num: '9', stem: 'Factor completely.', parts: [
        { id: '9a', level: 'EMG', make: function (r) { return fxPart(S(L(1, r.pick(['xy', 'xy', 'ab', 'mn', 'pq'])), N(r.int(2, 12)))); } },
        { id: '9b', level: 'EMG', make: function (r) { var v = r.pick([['a', 'bc'], ['a', 'bc'], ['x', 'yz'], ['m', 'np'], ['p', 'qr'], ['c', 'ab'], ['z', 'xy'], ['k', 'mn'], ['d', 'ef']]); return fxPart(S(L(1, v[0]), L(r.pick([1, 1, 2, 3, 4, 5]), v[1]))); } },
        { id: '9c', level: 'EMG', make: function (r) { var v = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]); return fxPart(S(L(1, v[0], 2), L(r.pick([1, 1, 2, 3, 4, 5, 6, 7]), v[1]))); } },
        { id: '9d', level: 'PRG', make: function (r) { return fxPart(S(L(r.int(2, 9), r.pick(['mn', 'mn', 'xy', 'ab'])), N(1))); } }] },

      /* ---------- Part C ---------- */
      { num: '10', section: 'Part C — Extensions', stem: 'The pattern can multiply certain numbers mentally: ' + t('19\\times 21=(20-1)(20+1)=20^{2}-1^{2}=400-1=399') + '.', parts: [
        { id: '10ai', sub: 'a i', level: 'EMG', make: function (r) { return productPart(10 * r.int(3, 9), r.int(1, 3)); } },
        { id: '10aii', sub: 'a ii', level: 'EMG', make: function (r) { return productPart(10 * r.int(4, 9), r.pick([1, 1, 2, 4, 5])); } },
        { id: '10b', sub: 'b', level: 'EMG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(21, 88), d: r.pick([3, 5, 7, 9]) }; }, function (g) { return g.a % 10 !== 0 && (g.a + g.d) % 10 !== 0 && g.a + g.d < 99; });
          var a = g.a, b = g.a + g.d, mid = (a + b) / 2, hd = g.d / 2;
          return mc(r, 'Explain why this process cannot be used, in the same simple way, for ' + t(a + '\\times ' + b) + '.', [
            { html: 'The number halfway between them is ' + t(String(mid)) + ', which is not a whole number, so they can’t be written as the same whole number ' + t('\\pm') + ' the same amount.', right: true },
            { html: t(a) + ' and ' + t(b) + ' are not close enough to a multiple of ' + t('10') + '.', why: 'The middle number doesn’t have to be a multiple of ' + t('10') + ': ' + t('23\\times 27=25^{2}-2^{2}') + ' works. What matters is whether there is a <b>whole-number</b> middle.' },
            { html: 'The method only works for numbers less than ' + t('20') + '.', why: 'Size doesn’t matter: ' + t('98\\times 102=100^{2}-2^{2}') + ' works fine.' },
            { html: t(String(mid) + '^{2}-' + String(hd) + '^{2}') + ' is not equal to ' + t(a + '\\times ' + b) + '.', why: 'It <b>is</b> equal (' + t(String(mid) + '^{2}-' + String(hd) + '^{2}=' + F(a * b)) + '). The trouble is that these are decimals — no longer a quick mental shortcut.' }],
            'The trick needs both numbers written as (middle number) ± (the same amount). The middle number is their average, ' + t('\\frac{' + a + '+' + b + '}{2}=' + mid) + ', which is not a whole number (their difference ' + t(g.d) + ' is odd). So ' + t(a + '\\times ' + b) + ' is not a difference of two whole-number squares.',
            ['Find the number exactly halfway between ' + t(a) + ' and ' + t(b) + '.'], 'why ' + a + '×' + b + ' fails');
        } }] },
      { num: '11', stem: function (sh) { return 'Decide whether each expression is a difference of squares: ' + rowsQ11(sh).map(function (x) { return '(' + x.id + ') ' + t(x.tex); }).join(', &nbsp;') + '.'; },
        shared: function (r) {
          return { a: r.int(2, 12), b: pickWhere(function () { return r.int(2, 12); }, function () { return true; }), c: pickWhere(function () { return { m: r.int(2, 7), k: r.int(10, 60) }; }, function (o) { return !isSq(o.k); }),
            d: r.int(2, 12), e: pickWhere(function () { return { m: r.int(2, 6), n: r.int(2, 7) }; }, function (o) { return gcd(o.m, o.n) === 1; }), v: r.pick(['x', 'x', 'y', 'a']) };
        },
        parts: [
          { id: '11', sub: 'decide', level: 'EMG', make: function (r, sh) { return dosGrid('For each one, is it a difference of squares? If not, why not?', rowsQ11(sh), ['yes', 'sum', 'notsq'], 'is it a DoS? (5 rows)'); } },
          { id: '11a', sub: 'a', level: 'BEG', make: function (r, sh) { return fxPart(S(L(1, sh.v), N(sh.a)), { prompt: 'Factor (a) ' + t(sh.v + '^{2}-' + sh.a * sh.a) + '.' }); } },
          { id: '11d', sub: 'd', level: 'EMG', make: function (r, sh) { return fxPart(S(N(sh.d), L(1, sh.v)), { prompt: 'Factor (d) ' + t(sh.d * sh.d + '-' + sh.v + '^{2}') + '.' }); } },
          { id: '11e', sub: 'e', level: 'PRG', make: function (r, sh) { var A = L(sh.e.m, 'x'), Bv = L(sh.e.n, 'y', 2); return fxPart(S(A, Bv), { prompt: 'Factor (e) ' + t(P.seq([sq(A), P.neg(sq(Bv))])) + '.' }); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 7), b: r.int(2, 9) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a * g.a !== g.b && g.b * g.b !== g.a; });
          var a = g.a, b = g.b, A = L(a, 'x'), sgn = r.pick([1, 1, -1]), e = P.seq([L(a * a, 'x', 2), N(-b * b)]);
          var right = P.add(A, N(sgn * b)), other = P.add(A, N(-sgn * b));
          return mc(r, 'One factor of ' + t(e) + ' is', [
            { html: t(tx(P.add(A, N(sgn * b * b)))), why: 'The bracket uses the square <b>root</b> of ' + t(b * b) + ', which is ' + t(b) + ', not ' + t(b * b) + '.' },
            { html: t(tx(P.add(L(a * a, 'x'), N(sgn * b)))), why: 'Take the square root of ' + t(a * a + 'x^{2}') + ' too: it is ' + t(a + 'x') + '.' },
            { html: t(tx(right)), right: true },
            { html: t(tx(P.add(L(1, 'x'), N(sgn * b)))), why: t(a * a + 'x^{2}=(' + a + 'x)^{2}') + ', so each bracket starts with ' + t(a + 'x') + ', not ' + t('x') + '.' }],
            t(e + '=(' + a + 'x)^{2}-' + b + '^{2}=(' + a + 'x-' + b + ')(' + a + 'x+' + b + ')') + '. The only two factors are ' + t(tx(P.sub(A, N(b)))) + ' and ' + t(tx(P.add(A, N(b)))) + ', so the answer is ' + t(tx(right)) + '. (' + t(tx(other)) + ' is the other one.)',
            ['Write both terms as squares first.'], 'one factor of ' + plain(e));
        } }] },
      { num: '13', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'PRG', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 9), b: r.int(2, 9) }; }, function (g) { return g.a !== g.b; });
          var a = g.a, b = g.b, plus = r.chance(0.75), f = P.seq([L(a, 'x'), L(plus ? b : -b, 'y')]), ans = a + b;
          return KP.nr(t(f) + ' is a factor of the binomial ' + t('a^{2}x^{2}-b^{2}y^{2}') + ', where ' + t('a') + ' and ' + t('b') + ' are positive. The value of ' + t('a+b') + ' is ____.', ans, function (v) {
            if (v === a * a + b * b) return { code: 'u4l5-ab-squares', hint: t('a') + ' and ' + t('b') + ' are the numbers in the factor (the square roots), not their squares. Add ' + t('a') + ' and ' + t('b') + '.' };
            if (v === a * b) return { code: 'value', hint: 'The question asks for ' + t('a+b') + ' — add them.' };
            return null;
          }, t('a^{2}x^{2}-b^{2}y^{2}=(ax)^{2}-(by)^{2}=(ax-by)(ax+by)') + '. Matching ' + t(f) + ' with ' + t(plus ? 'ax+by' : 'ax-by') + ' gives ' + t('a=' + a) + ' and ' + t('b=' + b) + '.<br>' + t('a+b=' + a + '+' + b + '=' + ans) + '.',
            ['Factor ' + t('a^{2}x^{2}-b^{2}y^{2}') + ' as a difference of squares, then match it with the given factor.'], 'NR: ' + plain(f) + ' factor → a+b');
        } }] },
      { num: '14', stem: 'Factor completely.', parts: [
        { id: '14', level: 'MAS', make: function (r) {
          var g = pickWhere(function () { return { a: r.int(2, 5), b: r.int(1, 5), k: r.pick([3, 3, 2, 5, 6]) }; }, function (g) { return gcd(g.a, g.b) === 1 && g.a !== g.b; });
          return fxPart(S(L(g.a, 'x'), L(g.b, 'y'), 1, L(g.k, 'x')));
        } }] }
    ],

    extra: [
      { num: '1', section: 'Extra practice A — Leading Coefficients and Two Variables', stem: 'Factor each difference of squares. Take the square root of <b>both</b> the coefficient and the variable part.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 12), d: r.int(2, 12) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return fxPart(S(L(g.c, r.pick(['x', 'x', 'a', 'y'])), N(g.d))); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var g = pickWhere(function () { return { c: r.int(5, 12), d: r.int(2, 5) }; }, function (g) { return gcd(g.c, g.d) === 1; }), v = r.pick([['a', 'b'], ['a', 'b'], ['x', 'y'], ['m', 'n']]); return fxPart(S(L(g.c, v[0]), L(g.d, v[1]))); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 7), d: r.int(8, 12) }; }, function (g) { return gcd(g.c, g.d) === 1; }), v = r.pick([['m', 'n'], ['m', 'n'], ['x', 'y'], ['p', 'q']]); return fxPart(S(L(g.c, v[0]), L(g.d, v[1]))); } },
        { id: 'e1d', level: 'EMG', make: function (r) { var g = pickWhere(function () { return { c: r.int(10, 15), d: r.int(10, 15) }; }, function (g) { return gcd(g.c, g.d) === 1; }), v = r.pick([['p', 'q'], ['p', 'q'], ['x', 'y'], ['a', 'b']]); return fxPart(S(L(g.c, v[0]), L(g.d, v[1]))); } }] },
      { num: '2', stem: 'Factor each difference of squares. Watch for the ones written with the constant first.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 12), d: r.int(2, 9) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return fxPart(S(N(g.c), L(g.d, r.pick(['y', 'y', 'x', 'm'])))); } },
        { id: 'e2b', level: 'BEG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 9), d: r.int(10, 15) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return fxPart(S(L(g.c, r.pick(['x', 'x', 'a', 'y'])), N(g.d))); } },
        { id: 'e2c', level: 'EMG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 5), d: r.int(9, 15) }; }, function (g) { return gcd(g.c, g.d) === 1; }), v = r.pick([['a', 'b'], ['a', 'b'], ['x', 'y'], ['m', 'n']]); return fxPart(S(L(g.c, v[0]), L(g.d, v[1]))); } },
        { id: 'e2d', level: 'EMG', make: function (r) { return fxPart(S(N(1), L(r.int(5, 15), r.pick(['t', 't', 'x', 'k', 'n'])))); } }] },
      { num: '3', stem: 'Factor each difference of squares. Every exponent here is even, so every term is a perfect square.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 9), d: r.int(2, 9) }; }, function (g) { return gcd(g.c, g.d) === 1 && !(isSq(g.c) && isSq(g.d)); }); return fxPart(S(L(g.c, r.pick(['x', 'x', 'a', 'y']), 2), N(g.d))); } },
        { id: 'e3b', level: 'PRG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 9), d: r.int(2, 7) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return fxPart(S(L(g.c, 'm', 3), L(g.d, 'n'))); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 12), d: r.int(2, 6) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return fxPart(S(L(g.c, 'ab'), L(g.d, 'c', 2))); } }] },

      { num: '4', section: 'Extra practice B — Higher Powers: Factoring Twice',
        shared: function (r) { return { n: r.int(1, 5), v: r.pick(['x', 'y', 'a', 'm']) }; },
        stem: function (sh) { return 'Some binomials are a difference of squares <b>twice</b>. Work through ' + t(sh.v + '^{4}-' + Math.pow(sh.n, 4)) + ' one stage at a time.'; },
        parts: [
          { id: 'e4a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var X = L(1, sh.v), n = sh.n, one = [P.sub(sq(X), N(n * n)), P.add(sq(X), N(n * n))], full = S(X, N(n), 2), fullChk = K.factored(targetOf(full));
            var p = factPart('Write ' + t(sh.v + '^{4}') + ' and ' + t(Math.pow(n, 4)) + ' each as a square, then factor <b>once</b>.', one, [
              { is: [{ p: P.sub(sq(X), N(n * n)), k: 2 }], code: 'dsq-square', hint: 'A difference of squares needs one <b>minus</b> bracket and one <b>plus</b> bracket.' },
              { is: [P.sub(sq(X), N(n)), P.add(sq(X), N(n))], code: 'no-root', hint: 'Check the number: ' + t(Math.pow(n, 4) + '=' + n * n + '^{2}') + ', so the brackets hold ' + t(n * n) + '.' }],
              t(sh.v + '^{4}=(' + sh.v + '^{2})^{2}') + ' and ' + t(Math.pow(n, 4) + '=' + n * n + '^{2}') + ', so<br>' + t(sh.v + '^{4}-' + Math.pow(n, 4) + '=(' + sh.v + '^{2}-' + n * n + ')(' + sh.v + '^{2}+' + n * n + ')') + '.',
              ['An even power is a square: ' + t(sh.v + '^{4}=(' + sh.v + '^{2})^{2}') + '.', 'Then use ' + IDENT + ' with ' + t('a=' + sh.v + '^{2}') + '.'], 'one pass of x^4 - n^4');
            var base = p.check;
            p.check = function (resp) { var r1 = fullChk(resp); if (r1.v === 'correct') return ok(); return base(resp); };
            p.good = [targetOf(full)];
            return p;
          } },
          { id: 'e4b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var v = sh.v, m = sh.n * sh.n;
            return mc(r, 'Which of your two brackets, ' + t('(' + v + '^{2}-' + m + ')') + ' and ' + t('(' + v + '^{2}+' + m + ')') + ', can be factored again?', [
              { html: t(v + '^{2}-' + m) + ': it is a difference of squares. ' + t(v + '^{2}+' + m) + ' is a sum of squares, so it stops.', right: true },
              { html: t(v + '^{2}+' + m) + ': a plus sign can always be split up.', why: 'A <b>sum</b> of squares never factors over the integers: ' + t('(' + v + '-' + sh.n + ')(' + v + '+' + sh.n + ')=' + v + '^{2}-' + m) + ', with a minus sign.' },
              { html: 'Both of them.', why: 'Only one is a difference. ' + t(v + '^{2}+' + m) + ' is a sum of squares.' },
              { html: 'Neither: one pass is always enough.', why: t(v + '^{2}-' + m + '=' + v + '^{2}-' + sh.n + '^{2}') + ' is still a difference of squares.' }],
              t(v + '^{2}-' + m + '=' + v + '^{2}-' + sh.n + '^{2}=(' + v + '-' + sh.n + ')(' + v + '+' + sh.n + ')') + ' factors again. ' + t(v + '^{2}+' + m) + ' is a <b>sum</b> of squares and cannot be factored over the integers.',
              ['Which bracket has a minus sign between two perfect squares?'], 'which bracket factors again');
          } },
          { id: 'e4c', sub: 'c', level: 'PRG', make: function (r, sh) { return fxPart(S(L(1, sh.v), N(sh.n), 2), { prompt: 'Write the complete factorization of ' + t(sh.v + '^{4}-' + Math.pow(sh.n, 4)) + '.' }); } }] },
      { num: '5', stem: 'Factor completely. Each of these needs more than one pass.', parts: [
        { id: 'e5a', level: 'PRG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 3), d: r.int(1, 3) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return fxPart(S(L(g.c, r.pick(['x', 'x', 'a', 'y', 'm', 'n', 'p', 't', 'k'])), N(g.d), 2)); } },
        { id: 'e5b', level: 'PRG', make: function (r) { return fxPart(S(L(1, r.pick(['x', 'y', 'a', 'm', 'n', 'k', 't', 'p', 'w', 'b', 'c', 'd', 'g', 'h', 'q', 'r', 's', 'u', 'v', 'z'])), N(1), 2)); } },
        { id: 'e5c', level: 'PRG', make: function (r) { var v = r.pick([['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q'], ['c', 'd'], ['s', 't'], ['u', 'v'], ['g', 'h'], ['j', 'k'], ['r', 's']]); return fxPart(S(L(1, v[0]), L(r.pick([1, 1, 2]), v[1]), 2)); } },
        { id: 'e5d', level: 'ADV', make: function (r) { var g = pickWhere(function () { return { c: r.int(1, 3), d: r.int(1, 3) }; }, function (g) { return gcd(g.c, g.d) === 1 && g.c * g.d > 1; }), v = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]); return fxPart(S(L(g.c, v[0]), L(g.d, v[1]), 2)); } }] },
      { num: '6', stem: 'Factor completely. Decide for each factor you write whether it can go further.', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) { return fxPart(S(L(1, r.pick(['m', 'm', 'x', 'a', 'y', 'n'])), N(r.int(2, 5)), 2)); } },
        { id: 'e6b', level: 'ADV', make: function (r) { return fxPart(S(N(r.int(2, 4)), L(1, r.pick(['x', 'x', 'y', 'a', 'm', 'n', 't', 'p', 'k', 'w', 'b'])), 2)); } }] },

      { num: '7', section: 'Extra practice C — Common Factor First', stem: 'None of these is a difference of squares as written. Remove the greatest common factor first, then factor completely.', parts: [
        { id: 'e7a', level: 'PRG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 5), d: r.int(1, 7), k: r.pick([2, 2, 3, 5]) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return fxPart(S(L(g.c, 'x'), N(g.d), 1, N(g.k))); } },
        { id: 'e7b', level: 'PRG', make: function (r) { var v = r.pick(['x', 'x', 'a', 'm', 'y']); return fxPart(S(L(1, v), N(r.int(2, 9)), 1, L(1, v))); } },
        { id: 'e7c', level: 'PRG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 4), d: r.int(1, 5), k: r.pick([3, 3, 2, 5]) }; }, function (g) { return gcd(g.c, g.d) === 1; }), v = r.pick(['a', 'a', 'x', 'm']); return fxPart(S(L(g.c, v), N(g.d), 1, L(g.k, v))); } },
        { id: 'e7d', level: 'PRG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 7), d: r.int(1, 5), k: r.pick([2, 2, 3, 5]) }; }, function (g) { return gcd(g.c, g.d) === 1; }), v = r.pick([['m', 'n'], ['m', 'n'], ['x', 'y'], ['a', 'b']]); return fxPart(S(L(g.c, v[0]), L(g.d, v[1]), 1, N(g.k))); } }] },
      { num: '8', stem: 'Factor completely. These need a GCF <b>and</b> two passes of the difference of squares.', parts: [
        { id: 'e8a', level: 'ADV', make: function (r) { return fxPart(S(L(1, r.pick(['x', 'x', 'a', 'y'])), N(r.int(1, 3)), 2, N(r.pick([2, 2, 3, 4, 5])))); } },
        { id: 'e8b', level: 'ADV', make: function (r) { var v = r.pick(['x', 'x', 'a', 'm', 'y']); return fxPart(S(L(1, v), N(r.pick([1, 1, 2])), 2, L(r.pick([3, 3, 2, 5]), v))); } },
        { id: 'e8c', level: 'MAS', make: function (r) { var v = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q'], ['s', 't'], ['c', 'd']]), c = r.pick([2, 2, 2, 3]), k = c === 3 ? 2 : r.pick([5, 5, 2, 3, 6]); return fxPart(S(L(1, v[0]), L(c, v[1]), 2, N(k))); } }] },

      { num: '9', section: 'Extra practice D — Is It a Difference of Squares?',
        shared: function (r) {
          var g = { a: r.int(2, 9), k: pickWhere(function () { return r.int(2, 30); }, function (v) { return !isSq(v); }), m: r.int(2, 5),
            d: pickWhere(function () { return { c: r.int(2, 7), e: r.int(2, 9) }; }, function (o) { return gcd(o.c, o.e) === 1; }),
            s: pickWhere(function () { return { c: r.int(2, 5), e: r.int(2, 6) }; }, function (o) { return gcd(o.c, o.e) === 1; }),
            f: pickWhere(function () { return { k: r.pick([2, 3, 5, 6, 7]), c: r.int(2, 5), e: r.int(2, 5) }; }, function (o) { return gcd(o.c, o.e) === 1; }) };
          g.order = r.shuffle([0, 1, 2, 3, 4, 5]);
          return g;
        },
        stem: function (sh) { return 'Decide whether each expression can be factored using the difference of squares: ' + rowsE9(sh).map(function (x) { return '(' + x.id + ') ' + t(x.tex); }).join(', &nbsp;') + '.'; },
        parts: [
          { id: 'e9', sub: 'decide', level: 'EMG', make: function (r, sh) { return dosGrid('For each one: can it be factored with the difference of squares? If not, which condition fails — subtraction, or both terms perfect squares?', rowsE9(sh), ['yes', 'gcf', 'sum', 'notsq'], 'is it a DoS? (6 rows)'); } },
          { id: 'e9f', sub: 'factor', level: 'PRG', make: function (r, sh) {
            var R = rowsE9(sh).filter(function (x) { return x.s; });
            var p = KP.fields('Factor completely the two that can be factored.', R.map(function (x) { return pbox('(' + x.id + ') ' + t(x.tex + '='), ['x'], '(' + x.id + ')'); }),
              R.map(function (x) { return fxPart(x.s).check; }), R.map(function (x) { return targetOf(x.s); }), R.map(function (x) { return t(x.tex + '=' + targetOf(x.s)); }).join('<br>'),
              R.map(function (x) { return '(' + x.id + ') ' + solOf(x.s, x.tex); }).join('<br>'),
              ['One of them needs its GCF taken out first.'], 'factor the DoS rows');
            p.bad = [R.map(function (x) { return dosTex(x.s.a, x.s.b); })];
            return p;
          } }] },
      { num: '10', shared: function (r) { return { n: r.int(2, 12), v: r.pick(['x', 'x', 'y', 'a']) }; },
        stem: function (sh) { return '<i>(Error analysis)</i> A student writes ' + t(sh.v + '^{2}-' + sh.n * sh.n + '=(' + sh.v + '-' + sh.n + ')^{2}') + '.'; },
        parts: [
          { id: 'e10a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var n = sh.n, X = L(1, sh.v), T = sq(P.sub(X, N(n)));
            var p = KP.poly('Expand ' + t('(' + sh.v + '-' + n + ')^{2}') + ' to show this is wrong.', T, { wrong: [
              { is: P.sub(sq(X), N(n * n)), code: 'square-middle', hint: t('(' + sh.v + '-' + n + ')^{2}') + ' means ' + t('(' + sh.v + '-' + n + ')(' + sh.v + '-' + n + ')') + ': four products, including two middle terms.' },
              { is: P.add(sq(X), N(n * n)), code: 'square-middle', hint: 'Don’t forget the middle terms: ' + t('(' + sh.v + '-' + n + ')(' + sh.v + '-' + n + ')') + ' has an outside and an inside product.' },
              { is: P.add(sq(X), L(-n, sh.v), N(n * n)), code: 'middle-once', hint: 'There are <b>two</b> middle products, ' + t('-' + n + sh.v) + ' and ' + t('-' + n + sh.v) + ': add them.' }] },
              t('(' + sh.v + '-' + n + ')^{2}=(' + sh.v + '-' + n + ')(' + sh.v + '-' + n + ')=' + sh.v + '^{2}-' + n + sh.v + '-' + n + sh.v + '+' + n * n + '=' + tx(T)) + ', which is not ' + t(sh.v + '^{2}-' + n * n) + '.',
              ['Write the square as two equal brackets and use FOIL.'], 'expand (x-n)^2');
            p.bad = [sh.v + '^2-' + n * n];
            return p;
          } },
          { id: 'e10b', sub: 'b', level: 'BEG', make: function (r, sh) { return fxPart(S(L(1, sh.v), N(sh.n)), { prompt: 'Give the correct factorization of ' + t(sh.v + '^{2}-' + sh.n * sh.n) + '.' }); } }] },
      { num: '11', shared: function (r) { return { n: r.int(2, 12), v: r.pick(['x', 'x', 'y', 'a']) }; },
        stem: function (sh) { return '<i>(Error analysis)</i> Another student claims ' + t(sh.v + '^{2}+' + sh.n * sh.n + '=(' + sh.v + '+' + sh.n + ')(' + sh.v + '-' + sh.n + ')') + '.'; },
        parts: [
          { id: 'e11a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var n = sh.n, X = L(1, sh.v), T = P.sub(sq(X), N(n * n));
            var p = KP.poly('Expand the right side. What does it actually equal?', T, { wrong: [{ is: P.add(sq(X), N(n * n)), code: 'dsq-sign', hint: 'The last terms are ' + t('+' + n) + ' and ' + t('-' + n) + ': their product is <b>negative</b>.' }] },
              t('(' + sh.v + '+' + n + ')(' + sh.v + '-' + n + ')=' + sh.v + '^{2}-' + n + sh.v + '+' + n + sh.v + '-' + n * n + '=' + tx(T)) + ', not ' + t(sh.v + '^{2}+' + n * n) + '.', ['Use FOIL; the middle terms cancel.'], 'expand (x+n)(x-n)');
            p.bad = [sh.v + '^2+' + n * n];
            return p;
          } },
          { id: 'e11b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var n = sh.n, v = sh.v;
            return mc(r, 'So what does ' + t(v + '^{2}+' + n * n) + ' factor to?', [
              { html: 'It cannot be factored over the integers: it is a <b>sum</b> of squares, so it is already in simplest form.', right: true },
              { html: t('(' + v + '+' + n + ')^{2}'), why: t('(' + v + '+' + n + ')^{2}=' + v + '^{2}+' + 2 * n + v + '+' + n * n) + ' has a middle term.' },
              { html: t('(' + v + '-' + n + ')(' + v + '-' + n + ')'), why: 'That is ' + t('(' + v + '-' + n + ')^{2}=' + v + '^{2}-' + 2 * n + v + '+' + n * n) + ' — a middle term again.' },
              { html: t('(' + v + '+' + n + ')(' + v + '+' + n + ')') + ' with the middle term removed', why: 'You can’t remove a term from a product. A sum of squares has no factorization over the integers.' }],
              t(v + '^{2}+' + n * n) + ' is a <b>sum</b> of squares. Two brackets ' + t('(' + v + '+p)(' + v + '+q)') + ' would need ' + t('p+q=0') + ' and ' + t('pq=' + n * n) + ', but ' + t('q=-p') + ' gives ' + t('pq=-p^{2}') + ', never positive. So it does not factor.',
              ['Is it a sum or a difference?'], 'what x^2 + n^2 factors to');
          } }] },
      { num: '12', shared: function (r) { return { k: r.pick([4, 4, 2, 3, 5]), n: r.int(2, 3), v: r.pick(['x', 'x', 'a', 'y']) }; },
        stem: function (sh) { var k = sh.k, n = sh.n, v = sh.v; return 'Devin factors ' + t(k + v + '^{4}-' + k * Math.pow(n, 4)) + ' like this: ' + t(k + v + '^{4}-' + k * Math.pow(n, 4) + '=' + k + '(' + v + '^{4}-' + Math.pow(n, 4) + ')=' + k + '(' + v + '^{2}-' + n * n + ')(' + v + '^{2}+' + n * n + ')') + ', and stops.'; },
        parts: [
          { id: 'e12a', sub: 'a', level: 'EMG', make: function (r, sh) {
            var n = sh.n, v = sh.v, m = n * n;
            return mc(r, 'Has he factored <b>completely</b>?', [
              { html: 'No: ' + t(v + '^{2}-' + m) + ' is still a difference of squares, ' + t('(' + v + '-' + n + ')(' + v + '+' + n + ')') + '.', right: true },
              { html: 'Yes: he took out the GCF and used the difference of squares.', why: 'Look at every bracket: ' + t(v + '^{2}-' + m + '=' + v + '^{2}-' + n + '^{2}') + ' factors again.' },
              { html: 'No: ' + t(v + '^{2}+' + m) + ' still factors as ' + t('(' + v + '+' + n + ')^{2}') + '.', why: t('(' + v + '+' + n + ')^{2}') + ' has a middle term. ' + t(v + '^{2}+' + m) + ' is a sum of squares and stops.' },
              { html: 'No: the GCF should be ' + t(sh.k * m) + '.', why: t(sh.k * m) + ' doesn’t divide ' + t(sh.k + v + '^{4}') + '. The GCF is fine; one bracket can still be factored.' }],
              'Check every bracket. ' + t(v + '^{2}-' + m + '=(' + v + '-' + n + ')(' + v + '+' + n + ')') + ' still factors; ' + t(v + '^{2}+' + m) + ' is a sum of squares and stops.',
              ['Look at each bracket: is any of them a difference of squares?'], 'did Devin finish?');
          } },
          { id: 'e12b', sub: 'b', level: 'PRG', make: function (r, sh) { return fxPart(S(L(1, sh.v), N(sh.n), 2, N(sh.k)), { prompt: 'Finish the job: factor ' + t(sh.k + sh.v + '^{4}-' + sh.k * Math.pow(sh.n, 4)) + ' completely.' }); } }] },

      { num: '13', section: 'Extra practice E — Working Backwards and Mental Arithmetic', stem: 'Determine the missing expression in each equation.', parts: [
        { id: 'e13a', level: 'BEG', make: function (r) { var g = pickWhere(function () { return { c: r.int(2, 9), d: r.int(2, 11) }; }, function (g) { return gcd(g.c, g.d) === 1; }); return missingPart(L(g.c, 'x'), N(g.d), true); } },
        { id: 'e13b', level: 'BEG', make: function (r) {
          var v = r.pick(['y', 'y', 'x', 'a', 'm']), n = r.int(3, 12), c = r.pick([1, 1, 2, 3]), A = L(c, v), T = sq(A);
          var p = KP.poly(t('\\underline{\\hspace{2.6em}}-' + n * n + '=(' + tx(A) + '-' + n + ')(' + tx(A) + '+' + n + ')'), T, { wrong: [{ is: A, code: 'u4l5-gave-root', hint: t(tx(A)) + ' is the square <b>root</b>. The missing term is its square: ' + t('(' + tx(A) + ')^{2}') + '.' }] },
            'The brackets are ' + t('(a-b)(a+b)') + ' with ' + t('a=' + tx(A)) + ' and ' + t('b=' + n) + ', so the left side is ' + t('a^{2}-b^{2}') + ': the missing term is ' + t(sqTex(A) + '=' + tx(T)) + '.',
            ['The brackets are ' + t('(a-b)(a+b)') + '. What is ' + t('a') + '? The missing term is ' + t('a^{2}') + '.'], 'missing first square');
          p.bad = [tx(A), tx(P.scale(A, 2))];
          return p;
        } },
        { id: 'e13c', level: 'BEG', make: function (r) {
          var c = r.int(2, 6), n = pickWhere(function () { return r.int(3, 13); }, function (v) { return gcd(v, c) === 1; }), v = r.pick(['a', 'a', 'x', 'y']);
          return KP.number(t(c * c + v + '^{2}-\\underline{\\hspace{2.6em}}=(' + c + v + '-' + n + ')(' + c + v + '+' + n + ')'), n * n, function (x) {
            if (x === n) return { code: 'u4l5-gave-root', hint: t(n) + ' is the square <b>root</b> in the brackets. The missing term is ' + t(n + '^{2}') + '.' };
            if (x === 2 * n) return { code: 'u4l5-half', hint: t(n + '^{2}') + ' means ' + t(n + '\\times ' + n) + ', not ' + t(n + '\\times 2') + '.' };
            return null;
          }, 'The brackets are ' + t('(a-b)(a+b)') + ' with ' + t('b=' + n) + ', so the missing term is ' + t('b^{2}=' + n + '^{2}=' + n * n) + '.', ['The missing term is the square of the number in the brackets.'], 'missing second square');
        } }] },
      { num: '14', shared: function (r) { return { n: r.int(2, 12) }; },
        stem: function (sh) { return 'In the equation ' + t('\\square^{2}-' + sh.n * sh.n + '=(\\square-' + sh.n + ')(\\square+' + sh.n + ')') + ', the same expression fills every box. What goes in the boxes if the left side is …'; },
        parts: [
          { id: 'e14a', level: 'EMG', make: function (r, sh) { var c = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'a']); return boxPart(L(c, v), sh.n); } },
          { id: 'e14b', level: 'EMG', make: function (r, sh) { var e = r.pick([2, 2, 3]), v = r.pick(['x', 'x', 'y', 'm']); return boxPart(L(1, v, e), sh.n); } },
          { id: 'e14c', level: 'EMG', make: function (r, sh) { var c = r.int(2, 12), v = r.pick(['ab', 'ab', 'xy', 'mn']); return boxPart(L(c, v), sh.n); } }] },
      { num: '15', shared: function (r) { return { a: r.int(2, 7), N: r.pick([50, 100, 100, 150]), v: r.pick(['x', 'x', 'y', 'm']), k: 0 }; },
        stem: function (sh) { return 'Consider the binomial ' + t(sh.a * sh.a + sh.v + '^{2}-c') + ', where ' + t('c') + ' is a natural number.'; },
        parts: [
          { id: 'e15a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var want = []; for (var i = 1; i * i <= sh.N; i++) want.push(i * i);
            return { prompt: 'List every value of ' + t('c') + ' from ' + t('1') + ' to ' + t(sh.N) + ' that makes ' + t(sh.a * sh.a + sh.v + '^{2}-c') + ' a difference of squares with integer factors.', input: { type: 'list' }, key: want.slice(), answer: t(want.join(',\\ ')),
              check: function (resp) {
                if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
                var seen = {}; for (var j = 0; j < resp.length; j++) { if (seen[resp[j]]) return form('duplicate', 'You listed ' + t(resp[j]) + ' more than once.'); seen[resp[j]] = 1; }
                var bad = resp.filter(function (v) { return want.indexOf(v) < 0; });
                if (bad.length) return bad[0] > sh.N || bad[0] < 1 ? wrong('value', t(bad[0]) + ' is outside ' + t('1') + ' to ' + t(sh.N) + '.') : wrong('u4l5-sq-fake', t(bad[0]) + ' is not a perfect square, so ' + t('\\sqrt{' + bad[0] + '}') + ' is not a whole number.');
                if (resp.length < want.length) return wrong('u4l5-sq-missing', 'You have ' + resp.length + ' of the ' + want.length + ' values. ' + t('c') + ' must be a perfect square: ' + t('1^{2},\\ 2^{2},\\ 3^{2},\\ \\ldots') + ' up to ' + t(sh.N) + (want.indexOf(1) >= 0 && resp.indexOf(1) < 0 ? ' — and ' + t('1=1^{2}') + ' counts too.' : '.'));
                return ok();
              },
              solution: t(sh.a * sh.a + sh.v + '^{2}=(' + sh.a + sh.v + ')^{2}') + ' is already a perfect square, so ' + t('c') + ' must be a perfect square too: ' + t(want.map(function (c, j) { return (j + 1) + '^{2}=' + c; }).join(',\\ ')) + '.',
              hints: [t('c') + ' must be a perfect square.', 'List ' + t('1^{2}, 2^{2}, 3^{2}, \\ldots') + ' until you pass ' + t(sh.N) + '.'], text: 'all c ≤ ' + sh.N, bad: [want.slice(1), want.concat([2])] };
          } },
          { id: 'e15b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var c = pickWhere(function () { return r.int(5, 60); }, function (v) { return !isSq(v); }), lo = Math.floor(Math.sqrt(c));
            return mc(r, 'Explain why ' + t('c=' + c) + ' is not on your list.', [
              { html: t(c) + ' is not a perfect square, so ' + t('\\sqrt{' + c + '}') + ' is not a whole number and the factors would not have integer terms.', right: true },
              { html: t(c) + ' is too large.', why: 'Larger perfect squares such as ' + t((lo + 1) * (lo + 1)) + ' work. The problem is that ' + t(c) + ' isn’t a perfect square.' },
              { html: t(c) + ' does not divide ' + t(sh.a * sh.a) + '.', why: 'No dividing is needed: ' + t(sh.a * sh.a + sh.v + '^{2}-' + (lo + 1) * (lo + 1)) + ' factors. What matters is whether ' + t('c') + ' is a perfect square.' },
              { html: 'Because ' + t(sh.a * sh.a + sh.v + '^{2}-' + c) + ' is a sum.', why: 'It has a minus sign, so it is a difference. The second term just isn’t a perfect square.' }],
              t(lo + '^{2}=' + lo * lo) + ' and ' + t((lo + 1) + '^{2}=' + (lo + 1) * (lo + 1)) + ', so ' + t(c) + ' is not a perfect square: ' + t('\\sqrt{' + c + '}') + ' isn’t a whole number, and the brackets would not have integer terms.',
              ['Is ' + t(c) + ' a perfect square?'], 'why c not a square');
          } },
          { id: 'e15c', sub: 'c', level: 'BEG', make: function (r, sh) { var m = pickWhere(function () { return r.int(2, Math.floor(Math.sqrt(sh.N))); }, function (v) { return gcd(v, sh.a) === 1; }); return fxPart(S(L(sh.a, sh.v), N(m)), { prompt: 'Factor the case ' + t('c=' + m * m) + ': ' + t(sh.a * sh.a + sh.v + '^{2}-' + m * m) + '.' }); } }] },
      { num: '16', stem: 'The pattern also works on plain numbers: ' + t('83^{2}-17^{2}=(83-17)(83+17)=66\\times 100=6600') + '. Evaluate each <b>without a calculator</b>, using the factored form.', parts: [
        { id: 'e16a', level: 'EMG', make: function (r) { var a = r.pick([55, 60, 65, 70, 75, 80, 85, 90, 95]); return squaresPart(a, r.chance(0.6) ? 100 - a : 5 * r.int(1, a / 5 - 2)); } },
        { id: 'e16b', level: 'EMG', make: function (r) { var m = r.pick([100, 100, 50, 200, 1000, 500, 300, 60, 40]), d = r.int(1, 4); return squaresPart(m + d, m - d); } },
        { id: 'e16c', level: 'EMG', make: function (r) { var g = pickWhere(function () { return [50 * r.int(2, 8), 50 * r.int(1, 6)]; }, function (g) { return g[0] > g[1]; }); return squaresPart(g[0], g[1]); } },
        { id: 'e16d', level: 'EMG', make: function (r) { var n = r.int(1000, 2100); return squaresPart(n + 1, n); } }] },
      { num: '17', shared: function (r) { return { d: r.pick([1, 1, 1, 2, 3, 4, 5]), v: r.pick(['n', 'n', 'm', 'k', 't', 'p']), M: r.int(101, 999) }; },
        stem: function (sh) { return 'Use the pattern on ' + t(sh.v + '^{2}-(' + sh.v + '-' + sh.d + ')^{2}') + ', the difference between the squares of two whole numbers that differ by ' + t(sh.d) + '.'; },
        parts: [
          { id: 'e17a', sub: 'a', level: 'PRG', make: function (r, sh) {
            var v = sh.v, d = sh.d, X = L(1, v), T = P.mul(N(d), P.sub(L(2, v), N(d))), Tex = tx(T);
            var p = KP.poly('Factor it as a difference of squares and simplify. What does it equal?', T, { expanded: false, wrong: [
              { is: N(d * d), code: 'minus-bracket', hint: 'Check the first bracket: ' + t(v + '-(' + v + '-' + d + ')') + '. Subtracting a bracket changes the sign of <b>every</b> term: it is ' + t(d) + '.' },
              { is: P.mul(N(d), P.add(L(2, v), N(d))), code: 'minus-bracket', hint: 'Check the second bracket: ' + t(v + '+(' + v + '-' + d + ')=2' + v + '-' + d) + '.' }] },
              t(v + '^{2}-(' + v + '-' + d + ')^{2}=\\big[' + v + '-(' + v + '-' + d + ')\\big]\\big[' + v + '+(' + v + '-' + d + ')\\big]=(' + d + ')(2' + v + '-' + d + ')=' + Tex) + '.' + (d === 1 ? ' It is always the odd number ' + t('2' + v + '-1') + '.' : ''),
              ['Use ' + t('a^{2}-b^{2}=(a-b)(a+b)') + ' with ' + t('a=' + v) + ' and ' + t('b=' + v + '-' + d) + '.', 'Subtracting a bracket changes every sign inside it.'], 'n^2-(n-d)^2');
            p.good = [d === 1 ? '2' + v + '-1' : d + '(2' + v + '-' + d + ')'];
            p.bad = [N(d * d), P.sub(L(2, v), N(d * d))].filter(function (x) { return !P.eq(x, T); }).map(tx);
            return p;
          } },
          { id: 'e17b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var M = sh.M, d = sh.d, ans = d * (2 * M - d);
            return KP.number('Use your result to state ' + t(M + '^{2}-' + (M - d) + '^{2}') + ' instantly.', ans, function (v) {
              if (v === d * (2 * M + d)) return { code: 'minus-bracket', hint: 'Use ' + t(d + '(2' + sh.v + '-' + d + ')') + ' with ' + t(sh.v + '=' + M) + '.' };
              if (v === 2 * M - d && d > 1) return { code: 'value', hint: 'Don’t forget the factor ' + t(d) + '.' };
              return null;
            }, 'With ' + t(sh.v + '=' + M) + ': ' + t(M + '^{2}-' + (M - d) + '^{2}=' + d + '(2\\times ' + M + '-' + d + ')=' + F(ans)) + '.', ['Substitute ' + t(sh.v + '=' + M) + ' into your answer to (a).'], 'M^2-(M-d)^2');
          } }] },

      { num: '18', section: 'Extra practice F — Geometry, Reasoning, and Stretch',
        shared: function (r) { var a = r.int(8, 20); return { a: a, b: r.int(2, a - 3) }; },
        stem: 'A square sheet of metal has side length ' + t('a') + '. A smaller square of side length ' + t('b') + ' is cut from one corner and discarded.' + sheetSvg(),
        parts: [
          { id: 'e18a', sub: 'a', level: 'BEG', make: function (r, sh) {
            var p = factPart('Write an expression for the area of the remaining metal, in factored form. (Check it with ' + t('a=' + sh.a) + ', ' + t('b=' + sh.b) + ' in part (c).)', '(a-b)(a+b)', [
              { is: [{ p: P.parse('a-b'), k: 2 }], code: 'dsq-square', hint: 'Area left = big square − small square = ' + t('a^{2}-b^{2}') + '. That isn’t ' + t('(a-b)^{2}') + ', which has a middle term.' },
              { is: 'a^{2}+b^{2}', code: 'added-sq', hint: 'The small square is <b>removed</b>: subtract its area.' }],
              'Area left ' + t('=a^{2}-b^{2}') + ' (big square minus the small one) ' + t('=(a-b)(a+b)') + '.', ['Area of the big square minus the area of the small square.', 'Then factor it as a difference of squares.'], 'sheet area factored', { good: ['(a+b)(a-b)'] });
            return p;
          } },
          { id: 'e18b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var a = sh.a, b = sh.b, d = a - b;
            return mc(r, 'Cut the remaining L-shape into two rectangles with one straight cut. With ' + t('a=' + a) + ' and ' + t('b=' + b) + ', which two rectangles do you get?', [
              { html: t(a + '\\times ' + d) + ' and ' + t(b + '\\times ' + d), right: true },
              { html: t(a + '\\times ' + b) + ' and ' + t(d + '\\times ' + d), why: 'Those don’t fit together into the L-shape: their areas add to ' + t(a * b + d * d) + ', not ' + t(a * a - b * b) + '.' },
              { html: t(a + '\\times ' + d) + ' and ' + t(a + '\\times ' + b), why: 'The second piece sits beside the cut corner, so one of its sides is ' + t('b') + ' and the other is ' + t('a-b=' + d) + '.' },
              { html: t((a + b) + '\\times ' + d) + ' and ' + t(b + '\\times ' + b), why: 'The ' + t(b + '\\times ' + b) + ' square is the piece that was cut away.' }],
              'One cut along the edge of the missing corner gives an ' + t(a + '\\times ' + d) + ' rectangle (' + t('a') + ' by ' + t('a-b') + ') and a ' + t(b + '\\times ' + d) + ' rectangle (' + t('b') + ' by ' + t('a-b') + ').<br>' + t(a + '(' + d + ')+' + b + '(' + d + ')=(' + d + ')(' + (a + b) + ')=' + (a * a - b * b)) + ', and in general ' + t('a(a-b)+b(a-b)=(a-b)(a+b)') + '.',
              ['Sketch the L-shape and cut it along one edge of the missing square.'], 'two rectangles');
          } },
          { id: 'e18c', sub: 'c', level: 'BEG', make: function (r, sh) {
            var a = sh.a, b = sh.b, A = a * a - b * b;
            var p = KP.fields('Check your formula when ' + t('a=' + a) + ' cm and ' + t('b=' + b) + ' cm by computing both forms.', [nbox(t('a^{2}-b^{2}='), 'a² − b²'), nbox(t('(a-b)(a+b)='), '(a − b)(a + b)')],
              [K.number(A, function (v) { return v === a * a + b * b ? { code: 'added-sq', hint: 'Subtract the squares.' } : v === (a - b) * (a - b) ? { code: 'dsq-square', hint: t('a^{2}-b^{2}') + ' is not ' + t('(a-b)^{2}') + '.' } : null; }), K.number(A)],
              [String(A), String(A)], t(A) + ' cm² both ways', t(a + '^{2}-' + b + '^{2}=' + a * a + '-' + b * b + '=' + A) + ' and ' + t('(' + a + '-' + b + ')(' + a + '+' + b + ')=' + (a - b) + '\\times ' + (a + b) + '=' + A) + ' — they agree.',
              ['Substitute into each form.'], 'check sheet formula');
            p.bad = [[String(a * a + b * b), String(A)]];
            return p;
          } }] },
      { num: '19', parts: [
        { id: 'e19', level: 'EMG', make: function (r) {
          var n = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'a']), m = n * n;
          return mc(r, 'Why can a <b>sum</b> of squares such as ' + t(v + '^{2}+' + m) + ' never be factored into two binomials ' + t('(' + v + '+p)(' + v + '+q)') + ' with integers ' + t('p') + ' and ' + t('q') + '?', [
            { html: 'Expanding gives ' + t('p+q=0') + ' and ' + t('pq=' + m) + '. From ' + t('p+q=0') + ', ' + t('q=-p') + ', so ' + t('pq=-p^{2}') + ', which is never positive. No integers can do both.', right: true },
            { html: 'Because ' + t(m) + ' is not a perfect square.', why: t(m + '=' + n + '^{2}') + ' is a perfect square. The trouble is the plus sign.' },
            { html: 'Because ' + t('p') + ' and ' + t('q') + ' would have to be fractions.', why: 'Fractions don’t help either: ' + t('pq=-p^{2}') + ' is never positive for any number ' + t('p') + '.' },
            { html: 'It can: ' + t('p=' + n) + ' and ' + t('q=' + n) + '.', why: t('(' + v + '+' + n + ')(' + v + '+' + n + ')=' + v + '^{2}+' + 2 * n + v + '+' + m) + ' — there is a middle term, so ' + t('p+q') + ' isn’t ' + t('0') + '.' }],
            t('(' + v + '+p)(' + v + '+q)=' + v + '^{2}+(p+q)' + v + '+pq') + '. To match ' + t(v + '^{2}+' + m) + ' we need ' + t('p+q=0') + ' and ' + t('pq=' + m) + '. Then ' + t('q=-p') + ' and ' + t('pq=-p^{2}\\le 0') + ', so ' + t('pq=' + m) + ' is impossible.',
            ['Expand ' + t('(' + v + '+p)(' + v + '+q)') + ' and match the coefficients.'], 'why a sum of squares never factors');
        } }] },
      { num: '20', section: 'Extra practice G — Stretch', stem: '<b>Stretch.</b> A whole bracket can play the role of ' + t('a') + ' in ' + t('a^{2}-b^{2}') + '. For example, ' + t('(x+1)^{2}-9') + ' has ' + t('a=(x+1)') + ' and ' + t('b=3') + ', so it factors as ' + t('\\big((x+1)-3\\big)\\big((x+1)+3\\big)') + '. Factor completely and simplify each bracket.', parts: [
        { id: 'e20a', level: 'ADV', make: function (r) { var g = pickWhere(function () { return { p: r.int(1, 7), n: r.int(2, 8) }; }, function (g) { return g.p !== g.n; }); return bracketPart(P.add(L(1, r.pick(['x', 'x', 'y', 'a'])), N(g.p)), N(g.n)); } },
        { id: 'e20b', level: 'ADV', make: function (r) { var g = pickWhere(function () { return { k: r.pick([2, 2, 3]), p: r.int(1, 7), n: r.int(2, 6) }; }, function (g) { return gcd(g.k, g.p) === 1 && g.p !== g.n && (g.p + g.n) % g.k !== 0 && Math.abs(g.p - g.n) % g.k !== 0; }); return bracketPart(P.sub(L(g.k, 'y'), N(g.p)), N(g.n)); } },
        { id: 'e20c', level: 'ADV', make: function (r) { return twoSquaresPart(r.int(1, 9), r.pick(['x', 'x', 'y', 'a'])); } }] },
      { num: '21', shared: function (r) { var two = r.chance(0.25); return { two: two, v: two ? r.pick([['a', 'b'], ['x', 'y'], ['m', 'n'], ['p', 'q'], ['s', 't']]) : r.pick(['x', 'y', 'a', 'm', 'n', 'p', 't', 'k']), n: r.pick([1, 1, 2]) }; },
        stem: function (sh) { return '<b>Stretch.</b> Factor ' + t(exprTexOf(spec21(sh))) + ' completely over the integers.'; },
        parts: [
          { id: 'e21a', sub: 'a', level: 'ADV', make: function (r, sh) { return fxPart(spec21(sh)); } },
          { id: 'e21b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var s = spec21(sh), e = exprTexOf(s);
            return mc(r, 'How many passes of the difference of squares does ' + t(e) + ' take, and what stops the process?', [
              { html: '<b>Three</b> passes; it stops because every bracket left is either a binomial like ' + t(tx(P.sub(s.a, s.b))) + ' that is not a difference of squares, or a <b>sum</b> of squares.', right: true },
              { html: '<b>Two</b> passes; ' + t(tx(P.add(sq(s.a), sq(s.b)))) + ' is a difference of squares but you can stop.', why: t(tx(P.add(sq(s.a), sq(s.b)))) + ' is a <b>sum</b> of squares. Count again: ' + t(tx(P.sub(P.pow(s.a, 8), P.pow(s.b, 8)))) + ' → ' + t(tx(P.sub(P.pow(s.a, 4), P.pow(s.b, 4)))) + ' → ' + t(tx(P.sub(sq(s.a), sq(s.b)))) + ' → done: three passes.' },
              { html: '<b>Four</b> passes; the last pass factors ' + t(tx(P.add(P.pow(s.a, 4), P.pow(s.b, 4)))) + '.', why: 'A sum of squares never factors over the integers.' },
              { html: 'It never stops: there is always another difference of squares.', why: 'Once the minus bracket is ' + t(tx(P.sub(s.a, s.b))) + ', it can’t be factored again.' }],
              solOf(s, e) + '<br>Three passes. Every plus bracket is a sum of squares, and the last minus bracket ' + t(tx(P.sub(s.a, s.b))) + ' is not a difference of squares.',
              ['Count how many times you used ' + IDENT + '.'], 'passes for x^8 - 1');
          } }] }
    ]
  });

  /* ---------------- helpers used above (hoisted) ---------------- */
  function rowsQ11(sh) {
    var v = sh.v;
    return [{ id: 'a', tex: v + '^{2}-' + sh.a * sh.a, kind: 'yes', note: t(v + '^{2}-' + sh.a + '^{2}') + '.' },
      { id: 'b', tex: v + '^{2}+' + sh.b * sh.b, kind: 'sum', note: 'A sum of squares does not factor over the integers.' },
      { id: 'c', tex: sh.c.m * sh.c.m + 'y^{2}-' + sh.c.k, kind: 'notsq', note: t(sh.c.k) + ' is not a perfect square.' },
      { id: 'd', tex: sh.d * sh.d + '-' + v + '^{2}', kind: 'yes', note: t(sh.d + '^{2}-' + v + '^{2}') + ' (number first).' },
      { id: 'e', tex: P.seq([sq(L(sh.e.m, 'x')), P.neg(sq(L(sh.e.n, 'y', 2)))]), kind: 'yes', note: t(sqTex(L(sh.e.m, 'x')) + '-' + sqTex(L(sh.e.n, 'y', 2))) + '.' }];
  }
  function rowsE9(sh) {
    var X = L(1, 'x'), dA = L(sh.d.c, 'x'), dB = N(sh.d.e), fA = L(sh.f.c, 'x'), fB = N(sh.f.e);
    var all = [
      { tex: 'x^{2}+' + sh.a * sh.a, kind: 'sum', note: 'There is no subtraction.' },
      { tex: 'x^{2}-' + sh.k, kind: 'notsq', note: t(sh.k) + ' is not a perfect square.' },
      { tex: 'x^{3}-' + Math.pow(sh.m, 3), kind: 'notsq', note: t('x^{3}') + ' and ' + t(Math.pow(sh.m, 3)) + ' are cubes, not squares (an odd exponent is never a perfect square).' },
      { tex: P.seq([sq(dA), P.neg(sq(dB))]), kind: 'yes', note: t(sqTex(dA) + '-' + sqTex(dB)) + '.', s: S(dA, dB) },
      { tex: P.seq([L(sh.s.c * sh.s.c, 'x', 2), L(sh.s.e * sh.s.e, 'y', 2)]), kind: 'sum', note: 'There is no subtraction.' },
      { tex: P.seq([P.scale(sq(fA), sh.f.k), P.neg(P.scale(sq(fB), sh.f.k))]), kind: 'gcf', note: 'Take out ' + t(sh.f.k) + ': ' + t(sh.f.k + '(' + P.seq([sq(fA), P.neg(sq(fB))]) + ')') + '.', s: S(fA, fB, 1, N(sh.f.k)) }];
    return sh.order.map(function (j, i) { var o = all[j]; return { id: 'abcdef'[i], tex: o.tex, kind: o.kind, note: o.note, s: o.s }; });
  }
  function spec21(sh) { return sh.two ? S(L(1, sh.v[0]), L(1, sh.v[1]), 3) : S(L(1, sh.v), N(sh.n), 3); }
  /* □² − n² = (□ − n)(□ + n): the box is A */
  function boxPart(A, n) {
    var lhs = P.seq([sq(A), N(-n * n)]), vs = P.vars(A);
    var p = KP.poly('… ' + t(lhs) + '?', A, { wrong: [{ is: sq(A), code: 'no-root', hint: 'The box is squared on the left: ' + t('\\square^{2}=' + tx(sq(A))) + '. So the box is the square <b>root</b> of ' + t(tx(sq(A))) + '.' }] },
      t(tx(sq(A)) + '=' + sqTex(A)) + ', so the box is ' + t(tx(A)) + ': ' + t(lhs + '=(' + tx(A) + '-' + n + ')(' + tx(A) + '+' + n + ')') + '.',
      ['What, squared, gives ' + t(tx(sq(A))) + '? Take the square root of the number and halve each exponent.'], 'box for ' + plain(lhs));
    p.bad = [tx(sq(A))];
    return p;
  }
  /* (x + p)² − (x − p)² = (2p)(2x) = 4px */
  function twoSquaresPart(p, v) {
    var e = '(' + v + '+' + p + ')^{2}-(' + v + '-' + p + ')^{2}', ans = P.mono(4 * p, (function () { var o = {}; o[v] = 1; return o; })());
    var part = KP.factored(t(e), [ans], { keyTex: tx(ans), wrong: [
      { is: P.mul(N(-4 * p), L(1, v)), code: 'minus-bracket', hint: 'Check the signs: ' + t('(' + v + '+' + p + ')-(' + v + '-' + p + ')=' + 2 * p) + '. Subtracting a bracket changes every sign.' },
      { is: N(4 * p * p), code: 'minus-bracket', hint: 'Check the second bracket: ' + t('(' + v + '+' + p + ')+(' + v + '-' + p + ')=2' + v) + '.' }] },
      t(e + '=\\big[(' + v + '+' + p + ')-(' + v + '-' + p + ')\\big]\\big[(' + v + '+' + p + ')+(' + v + '-' + p + ')\\big]') + '<br>' + t('=(' + 2 * p + ')(2' + v + ')=' + tx(ans)),
      ['Use ' + t('a^{2}-b^{2}=(a-b)(a+b)') + ' with ' + t('a=' + v + '+' + p) + ' and ' + t('b=' + v + '-' + p) + '.', 'Subtracting the bracket ' + t('(' + v + '-' + p + ')') + ' changes both of its signs.'], 'two squares of binomials');
    part.good = ['(' + 2 * p + ')(2' + v + ')', 2 * p + '\\times 2' + v];
    part.bad = [String(4 * p * p), '0'];
    return part;
  }
  /* a² − b² where a is a binomial: simplify each bracket, then take out any common factor */
  function bkGs(A, B) { return [Math.abs(FX.content(P.sub(A, B)).c[0]), Math.abs(FX.content(P.add(A, B)).c[0])]; }
  function sqLabel(X) { return P.count(X) > 1 ? '(' + tx(X) + ')^{2}' : tx(sq(X)); }
  function bracketPart(A, B) {
    var D = P.sub(A, B), Sm = P.add(A, B), gs = bkGs(A, B), kAbs = gs[0] * gs[1];
    var aw = function (X) { return P.count(X) > 1 ? '(' + tx(X) + ')' : tx(X); };
    var e = sqLabel(A) + '-' + sqLabel(B);
    var fD = P.scale(D, [1, gs[0]]), fS = P.scale(Sm, [1, gs[1]]);
    var tD = tx(fD), tS = tx(fS);
    var target = (kAbs > 1 ? String(kAbs) : '') + '(' + tD + ')(' + tS + ')';
    var lines = t(e + '=\\left[' + aw(A) + '-' + aw(B) + '\\right]\\left[' + aw(A) + '+' + aw(B) + '\\right]') + '<br>' + t('=(' + tx(D) + ')(' + tx(Sm) + ')');
    if (kAbs > 1) lines += '<br>A common factor appears: ' + [[D, gs[0], fD], [Sm, gs[1], fS]].filter(function (z) { return z[1] > 1; }).map(function (z) { return t(tx(z[0]) + '=' + z[1] + '(' + tx(z[2]) + ')'); }).join(' and ') + ', so it is ' + t(target) + '.';
    var ws = [];
    if (kAbs > 1) ws.push({ is: [fD, fS], code: 'lost-gcf', hint: 'Your brackets are right, but the common factor ' + t(String(kAbs)) + ' has gone missing — it stays in front.' });
    ws.push({ is: [{ p: D, k: 2 }], code: 'dsq-square', hint: 'Use ' + t('(a-b)(a+b)') + ' with ' + t('a=' + tx(A)) + ' and ' + t('b=' + tx(B)) + ': one minus bracket and one plus bracket.' });
    if (isNum(B) && !P.eq(sq(B), B)) { var B2 = sq(B); ws.push({ is: [P.sub(A, B2), P.add(A, B2)], code: 'no-root', hint: 'Use the square <b>root</b>: ' + t(tx(B2) + '=' + sqTex(B)) + ', so ' + t('b=' + tx(B)) + '.' }); }
    ws.push({ is: [P.sub(B, A), P.add(B, A)], code: 'rev-order', hint: 'Your factors multiply to the opposite. In ' + t('a^{2}-b^{2}') + ', ' + t('a') + ' is the root of the <b>first</b> square, ' + t(tx(A)) + '.' });
    var raw = '(' + P.seq([A, P.neg(B)]) + ')(' + P.seq([A, B]) + ')';
    return factPart(t(e), target, ws, lines, ['Let ' + t('a=' + tx(A)) + ' and ' + t('b=' + tx(B)) + ', and use ' + t('(a-b)(a+b)') + ' with square brackets around each.', 'Simplify each bracket, then take out any common factor.'], 'factor ' + plain(e),
      { wrap: function (c) { return simpBr(c); }, bad: raw === '(' + tD + ')(' + tS + ')' ? [] : [raw], good: [(kAbs > 1 ? String(kAbs) : '') + '(' + tS + ')(' + tD + ')'] });
  }
  function sheetSvg() {
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 200 205" style="max-width:220px" role="img" aria-label="a square of side a with a small square of side b cut from one corner" font-size="15" font-family="KaTeX_Main,\'Times New Roman\',serif"><g transform="translate(25 25)">' +
      '<path d="M0 0 H95 V45 H140 V140 H0 Z" transform="translate(0 0) scale(1 1)" fill="#9aa3ad" fill-opacity="0.45" stroke="currentColor" stroke-width="2"/>' +
      '<rect x="95" y="0" width="45" height="45" fill="none" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/>' +
      '<text x="117" y="27" text-anchor="middle" fill="currentColor" font-size="11">cut</text>' +
      '<line x1="0" y1="152" x2="140" y2="152" stroke="currentColor" stroke-width="1.2"/><text x="70" y="168" text-anchor="middle" fill="currentColor" font-style="italic">a</text>' +
      '<line x1="95" y1="-10" x2="140" y2="-10" stroke="currentColor" stroke-width="1.2"/><text x="117" y="-14" text-anchor="middle" fill="currentColor" font-style="italic">b</text>' +
      '</g></svg></div>';
  }
})(window);
