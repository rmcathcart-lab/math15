/* Math 15 · Unit 2 · Lesson 1 — Powers, Exponent Vocabulary & the Product Law (AN3)
 * Assignment 1 (u2_L01.tex, Questions 1–13) and the Lesson 1 Extra Practice (u2_EP01.tex, Questions 1–19).
 * Every part is a generator that keeps the booklet question's idea and difficulty and changes the numbers and letters
 * (the booklet's own numbers are among the possible values where practical). Helpers and checkers are copied from the
 * Math 10C Unit 2 Lesson 1 file (exprEq, powerEq, repMul, singlePow, K.expo diagnosis tables).
 * Conversions: "explain" → multiple choice whose options are reasons (or the values that show it); "name the mistake and
 * correct it" → a multiple-choice diagnosis plus the corrected answer; "can it be written as a single power?" → a
 * yes/no table; "write a number as a power in every way" → tap every power that equals it; "find two pairs" → the
 * pairs input. No calculator: the bases are small. Changed from the booklet (no calculator): Extra 16 tests
 * 2ᵃ × 3ᵇ = 6ᵃ⁺ᵇ with small exponents instead of 2³ × 3⁴ = 6⁷ (6⁷ = 279 936).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 19(b) (compare 2³⁰ and 3²⁰ by regrouping into equal blocks). */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, ex = HW.ex, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    fence: 'Applied the exponent to the wrong base (−aⁿ vs (−a)ⁿ)', swapped: 'Swapped base and exponent', 'part-base': 'Took only part of the base',
    'coef-exp': 'Gave the exponent as the coefficient', 'coef-zero': 'Said the coefficient is 0', 'coef-sign': 'Dropped the negative sign',
    'exp-left': 'Left an exponent (not written as repeated multiplication)', 'not-repeated': 'Right value, base not shown repeated', added: 'Repeated addition instead of multiplication',
    count: 'Wrong number of factors', 'times-exp': 'Multiplied base by exponent', 'off-one': 'One factor too many or too few',
    'mult-exp': 'Multiplied exponents (should add)', 'no-one': 'Forgot the invisible exponent 1', base: 'Changed the base', 'single-power': 'Not written as a single power',
    'pair-fails': 'A pair that doesn’t work', 'one-pair': 'Only one pair', 'not-whole': 'Not a whole number', 'coef-added': 'Added coefficients instead of multiplying',
    'as-power': 'Not written as a power', 'law-added': 'Added exponents where the law multiplies or subtracts', subtracted: 'Subtracted instead of dividing', multiplied: 'Multiplied instead of dividing',
    'u2l1-doubled': 'Product law: doubled the power instead of adding exponents', 'u2l1-one-side': 'Volume: used the base side once (base area is side × side)',
    'u2l1-mixed-base': 'Used the product law on different bases ((−a)ⁿ and aⁿ)', 'u2l1-not-rewritten': 'Didn’t rewrite both powers with the same base',
    'u2l1-mult-base': 'Multiplied the bases (the base stays the same)', 'u2l1-k-coef': 'Missing coefficient: subtracted or divided the wrong way',
    'u2l1-sub-first': 'Substituted the value into the original incorrectly', 'u2l1-power-list': 'Chose a power that isn’t equal to the number', 'u2l1-power-missing': 'Missed a way to write the number as a power',
    'u2l1-sum-wrong': 'Missing exponent: added instead of subtracting', 'u2l1-coef-squared': 'Squared the coefficient outside the brackets',
    'u2l1-coef-not-squared': 'Didn’t square the coefficient inside the brackets', 'u2l1-face': 'Cube: face area and volume mixed up'
  });
  HW.addPartial({ 'u2l1-doubled': 'b', 'u2l1-one-side': 'b', 'u2l1-mixed-base': 'n', 'u2l1-not-rewritten': 'b', 'u2l1-mult-base': 'n', 'u2l1-k-coef': 'b',
    'u2l1-sub-first': 's', 'u2l1-power-list': 'b', 'u2l1-power-missing': 's', 'u2l1-sum-wrong': 'b', 'u2l1-coef-squared': 'b', 'u2l1-coef-not-squared': 'b', 'u2l1-face': 'b' });

  /* ---------- small helpers ---------- */
  var LET = 'abcdhkmnpqrstuvwxyz'.split('');
  function lets(r, k) { return r.sample(LET, k); }
  function pw(b, e) { return b + '^{' + e + '}'; }
  function par(s) { return '\\left(' + s + '\\right)'; }
  function fr(p, q) { return '\\frac{' + p + '}{' + q + '}'; }
  function rep(f, n, sep) { var a = []; for (var i = 0; i < n; i++) a.push(f); return a.join(sep == null ? '\\times ' : sep); }
  function px(s) { var p = ex.parse(s); if (!p.ok) throw new Error('bad TeX ' + s + ' (' + p.code + ')'); return p.ast; }
  function varsOf(a, acc) { (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var') acc[x.n] = 1; ['a', 'b', 'n'].forEach(function (k) { if (x[k]) w(x[k]); }); })(a); return acc; }
  function same(a, b) { var vs = Object.keys(varsOf(b, varsOf(a, {}))); if (!vs.length) return ex.eq(ex.value(a), ex.value(b)); return ex.equiv(a, b, vs, 6); }
  function strip(a) { while (a && a.t === 'paren') a = a.a; return a; }
  function pickWhere(gen, test) { for (var i = 0; i < 2000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u2l1: pickWhere failed'); }
  function signed(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function vt(v, e) { return e === 1 ? v : pw(v, e); }
  function cT(c, s) { return s ? (c === 1 ? '' : c === -1 ? '-' : String(c)) + s : String(c); }
  /* monomial: c and [[letter, exponent], ...] -> TeX */
  function mT(c, ps) { return cT(c, ps.filter(function (p) { return p[1] !== 0; }).map(function (p) { return vt(p[0], p[1]); }).join('')); }
  function plain(s) { return String(s).replace(/\\left|\\right/g, '').replace(/\\times/g, '×').replace(/\\cdot/g, '·').replace(/\\[a-z]+/g, '').replace(/[{}]/g, '').replace(/\s+/g, ''); }

  /* ---------- checkers ---------- */
  function exprEq(tgt, diags) {
    var T = px(tgt), D = (diags || []).filter(function (d) { return !same(px(d[0]), T); });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (same(a.ast, T)) return ok();
      for (var i = 0; i < D.length; i++) if (same(a.ast, px(D[i][0]))) return wrong(D[i][1], D[i][2]);
      return wrong('value', null);
    };
  }
  function leafOf(x) { return x.t === 'num' ? String(x.v) : x.n; }
  function leaves(ast) {
    var st = { num: [], den: [], sign: 1, bad: null };
    (function w(x, inv) {
      var N = inv ? st.den : st.num;
      if (x.t === 'paren') return w(x.a, inv);
      if (x.t === 'mul') { w(x.a, inv); w(x.b, inv); return; }
      if (x.t === 'div') { w(x.a, inv); w(x.b, !inv); return; }
      if (x.t === 'neg') { var y = strip(x.a); if (y.t === 'num' || y.t === 'var') { N.push('-' + leafOf(y)); return; } st.sign = -st.sign; w(x.a, inv); return; }
      if (x.t === 'num' || x.t === 'var') { N.push(leafOf(x)); return; }
      if (!st.bad) st.bad = x.t;
    })(ast, false);
    st.key = st.sign + '|' + st.num.slice().sort().join(',') + '|' + st.den.slice().sort().join(',');
    st.count = st.num.length + st.den.length;
    return st;
  }
  /* repeated multiplication: the same factors as the target (any order), no exponents left */
  function repMul(tgt, baseTex, n, diags) {
    var T = px(tgt), TL = leaves(T), D = (diags || []).filter(function (d) { return !same(px(d[0]), T); });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var L = leaves(a.ast);
      if (same(a.ast, T)) {
        if (L.bad === 'pow') return form('exp-left', 'Right value — but the question asks for <b>repeated multiplication</b>: write every factor out, with no exponents.');
        if (!L.bad && L.key === TL.key) return ok();
        return form('not-repeated', 'Right value — now show the repeated multiplication: the base ' + t(baseTex) + ' is written ' + n + ' times.');
      }
      if (L.bad === 'add' || L.bad === 'sub') return wrong('added', 'An exponent means repeated <b>multiplication</b>, not repeated addition. Use ' + t('\\times') + ' between the factors.');
      for (var i = 0; i < D.length; i++) if (same(a.ast, px(D[i][0]))) return wrong(D[i][1], D[i][2]);
      if (!L.bad && L.count !== TL.count) return wrong('count', 'Count your factors: the exponent ' + t(n) + ' says the base ' + t(baseTex) + ' is used as a factor ' + n + ' times.');
      return wrong('value', null);
    };
  }
  /* one base with one exponent, equal to bv^e (numeric). rows: [[wrongExponent, code, hint]] */
  function singlePow(bv, e, rows, signHint) {
    var V = Math.pow(bv, e);
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var top = strip(a.ast), neg = false;
      if (top.t === 'neg') { neg = true; top = strip(top.a); }
      if (ex.eq(a.val, V)) return top.t === 'pow' ? ok() : form('single-power', 'Right value — but this box wants a <b>single power</b>: one base with one exponent, like ' + t('a^{n}') + '.');
      if (top.t === 'pow' && !neg) {
        var b = ex.value(top.a), x = ex.value(top.b);
        if (ex.eq(b, bv)) { for (var i = 0; i < (rows || []).length; i++) if (ex.eq(x, rows[i][0])) return wrong(rows[i][1], rows[i][2]); return wrong('exp', 'Keep the base ' + t(signed(bv)) + ' and check the exponent: multiplying powers of the same base <b>adds</b> the exponents.'); }
        if (!ex.eq(Math.abs(b), Math.abs(bv)) && ex.eq(x, e)) return wrong('u2l1-mult-base', 'The exponent is right, but the base changed. The Product Law keeps the base the same — never multiply the bases.');
      }
      if (ex.eq(a.val, -V)) return wrong('sign', signHint || 'Check the sign.');
      return wrong('value', null);
    };
  }
  function dg(rows) { return function (an) { for (var i = 0; i < rows.length; i++) if (rows[i][0](an)) return { code: rows[i][1], hint: rows[i][2] }; return null; }; }
  function eIs(v, n) { return function (an) { var e = an.vars && an.vars[v]; return !!e && e[1] === 1 && e[0] === n; }; }
  function cIs(n) { return function (an) { return !!an.coef && an.coef[0] === n * an.coef[1]; }; }
  function both(f, g) { return function (an) { return f(an) && g(an); }; }

  /* ---------- part makers ---------- */
  function expoPart(prompt, tgt, diagRows, sol, hints, text, extra) {
    var p = P.expo(prompt, tgt, diagRows && diagRows.length ? { diag: dg(diagRows) } : {}, sol, hints, text);
    if (extra) Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
    return p;
  }
  function numPart(prompt, ans, diag, sol, hints, text, extra) {
    var p = P.number(prompt, ans, function (v) { var rows = diag || []; for (var i = 0; i < rows.length; i++) if (rows[i][0] !== ans && Math.abs(v - rows[i][0]) < 1e-9) return { code: rows[i][1], hint: rows[i][2] }; return null; }, sol, hints, text);
    if (extra) Object.keys(extra).forEach(function (k) { p[k] = k === 'input' ? Object.assign(p.input, extra[k]) : extra[k]; });
    return p;
  }
  function numCk(ans, rows) { return K.number(ans, function (v) { for (var i = 0; i < rows.length; i++) if (rows[i][0] !== ans && Math.abs(v - rows[i][0]) < 1e-9) return { code: rows[i][1], hint: rows[i][2] }; return null; }); }
  function mc(r, prompt, opts, sol, hints, text, keep) { return P.mc(r, prompt, opts, sol, hints, text, keep); }
  function fld(name, label, math, vars) { var f = { name: name, label: label }; if (math) { f.mode = 'math'; f.keys = 'expo'; f.vars = vars || []; } return f; }

  /* base and exponent */
  function baseExpPart(powTex, baseTex, expTex, vars, bDiag, eDiag, sol, text) {
    var fl = [fld('Base', 'base:', true, vars), fld('Exponent', 'exponent:', true, vars)];
    return P.fields(t(powTex), fl, [exprEq(baseTex, bDiag), exprEq(expTex, eDiag)], [baseTex, expTex], 'base ' + t(baseTex) + ', exponent ' + t(expTex), sol,
      ['The <b>base</b> is the factor being repeated — everything inside the brackets, if there are brackets. The <b>exponent</b> is the small raised number or letter.'], text);
  }
  /* coefficient, base and exponent */
  function cbePart(exprTex, coef, base, expo, vars, D, sol, text) {
    var fl = [fld('Coefficient', 'coefficient:', true, vars), fld('Base', 'base:', true, vars), fld('Exponent', 'exponent:', true, vars)];
    return P.fields(t(exprTex), fl, [exprEq(coef, (D.coef || []).concat([['0', 'coef-zero', 'If no number is written in front, the coefficient is understood to be ' + t('1') + '.']])), exprEq(base, D.base), exprEq(expo, D.exp)],
      [coef, base, expo], 'coefficient ' + t(coef) + ', base ' + t(base) + ', exponent ' + t(expo), sol,
      ['The <b>coefficient</b> is the number multiplying the power (a lone minus sign means ' + t('-1') + ', nothing at all means ' + t('1') + '). The brackets decide what the <b>base</b> is. No exponent written means the exponent is ' + t('1') + '.'], text);
  }
  /* repeated multiplication */
  function repPart(exprTex, tgt, baseTex, n, diags, sol, text) {
    var vs = Object.keys(varsOf(px(tgt), {})).sort();
    var p = P.math(t(exprTex), repMul(tgt, baseTex, n, diags), tgt, sol, ['The exponent tells how many times the base is written as a factor, with ' + t('\\times') + ' between the factors.'], text, { keys: 'expo', vars: vs });
    p.bad = [exprTex]; return p;
  }
  /* −kᵉ or (−k)ᵉ */
  function negPart(kind, k, e) {
    var tex = kind === 'out' ? '-' + pw(k, e) : pw(par('-' + k), e), val = kind === 'out' ? -Math.pow(k, e) : Math.pow(-k, e), other = kind === 'out' ? Math.pow(-k, e) : -Math.pow(k, e);
    var rows = [[other, 'fence', kind === 'out' ? 'No brackets: the exponent applies only to ' + t(k) + '. Work out ' + t(pw(k, e)) + ' first, then put the minus sign in front.' : 'The brackets make ' + t('-' + k) + ' the base, so multiply ' + t('(-' + k + ')') + ' by itself ' + e + ' times.'],
      [-val, 'sign', e % 2 ? 'An odd number of negative factors gives a negative product.' : 'Check the sign.'], [-k * e, 'times-exp', 'The exponent isn’t a multiplier: ' + t(pw(k, e)) + ' means ' + t(rep(k, e)) + '.'], [k * e, 'times-exp', 'The exponent isn’t a multiplier: ' + t(pw(k, e)) + ' means ' + t(rep(k, e)) + '.']];
    var sol = kind === 'out' ? 'No brackets, so only ' + t(k) + ' is the base: ' + t(tex + '=-\\left(' + rep(k, e) + '\\right)=' + F(val)) + '.'
      : 'The brackets make ' + t('-' + k) + ' the base: ' + t(tex + '=' + rep('(-' + k + ')', e, '') + '=' + F(val)) + (e % 2 ? ' (an odd number of negative factors: negative).' : ' (an even number of negative factors: positive).');
    return numPart(t(tex), val, rows, sol, ['Brackets decide the base. In ' + t('-a^{n}') + ' only ' + t('a') + ' is raised to the power; in ' + t('(-a)^{n}') + ' the base is ' + t('-a') + '.'], plain(tex));
  }
  /* evaluate bⁿ */
  function evalPow(b, n) {
    var v = Math.pow(b, n);
    return numPart(t(pw(b, n)), v, [[b * n, 'times-exp', 'The exponent isn’t a multiplier: ' + t(pw(b, n)) + ' means ' + t(b) + ' multiplied by itself ' + n + ' times.'], [Math.pow(b, n - 1), 'off-one', 'Count again: you need ' + n + ' factors of ' + t(b) + '.'], [Math.pow(b, n + 1), 'off-one', 'Count again: you need ' + n + ' factors of ' + t(b) + '.'], [Math.pow(n, b), 'swapped', 'That is ' + t(pw(n, b)) + ': the base and the exponent are swapped.']],
      t(pw(b, n) + '=' + rep(b, n) + '=' + F(v)) + '.', ['Multiply ' + t(b) + ' by itself ' + n + ' times.'], b + '^' + n);
  }
  /* simplify with the product law, then evaluate */
  function lawEval(promptTex, bv, bTex, e, val, rows, sol, hints, text) {
    var fl = [fld('Single power', 'single power:', true), fld('Value', 'value:', true)];
    var vd = rows.map(function (rw) { return [Math.pow(bv, rw[0]), rw[1], rw[2]]; });
    var vchk = K.value(val, { only: 'integer', diag: function (v) { for (var i = 0; i < vd.length; i++) if (!ex.eq(vd[i][0], val) && ex.eq(v, vd[i][0])) return { code: vd[i][1], hint: vd[i][2] }; return null; } });
    return P.fields(t(promptTex), fl, [singlePow(bv, e, rows), vchk], [pw(bTex, e), String(val)], t(pw(bTex, e) + '=' + F(val)), sol, hints, text);
  }
  /* product of monomials. facs: [[c, [[v, e], ...]], ...]; opt.br: bracket each factor; opt.sep */
  function prodMono(facs, opt) {
    opt = opt || {};
    var C = 1, E = {}, order = [], cs = [], terms = {};
    facs.forEach(function (f) { C *= f[0]; cs.push(f[0]); f[1].forEach(function (p) { if (!(p[0] in E)) { E[p[0]] = 0; order.push(p[0]); terms[p[0]] = []; } E[p[0]] += p[1]; terms[p[0]].push(p[1]); }); });
    order.sort();
    var res = mT(C, order.map(function (v) { return [v, E[v]]; }));
    var tex = opt.br ? facs.map(function (f) { return par(mT(f[0], f[1])); }).join('') : facs.map(function (f) { return mT(f[0], f[1]); }).join(opt.sep || '\\times ');
    var rows = [], sumC = cs.reduce(function (a, b) { return a + b; }, 0);
    if (cs.length > 1 && cs.some(function (c) { return c !== 1; }) && sumC !== C) rows.push([cIs(sumC), 'coef-added', 'Coefficients <b>multiply</b>: ' + t(cs.map(signed).join('\\times ') + '=' + C) + '. Only the exponents are added.']);
    order.forEach(function (v) {
      var es = terms[v], prod = es.reduce(function (a, b) { return a * b; }, 1);
      if (es.length > 1 && prod !== E[v]) rows.push([eIs(v, prod), 'mult-exp', 'Product Law: when you multiply powers of ' + t(v) + ', <b>add</b> the exponents.']);
      if (es.length > 1 && es.indexOf(1) >= 0 && E[v] - 1 !== prod) rows.push([eIs(v, E[v] - 1), 'no-one', 'A letter written with no exponent, like ' + t(v) + ', has the exponent ' + t(1) + ': ' + t(v + '=' + pw(v, 1)) + '. Count it too.']);
    });
    var coefStep = cs.length > 1 && cs.some(function (c) { return c !== 1; }) ? '(' + cs.map(signed).join('\\times ') + ')' : '';
    var expStep = order.map(function (v) { return terms[v].length > 1 ? pw(v, terms[v].join('+')) : vt(v, E[v]); }).join('');
    var sol = (coefStep ? 'Multiply the coefficients and add the exponents of each letter: ' : 'Product Law — keep the base, add the exponents: ') + t(tex + '=' + coefStep + expStep + '=' + res) + '.';
    return { tex: tex, res: res, rows: rows, sol: sol, C: C, E: E, order: order };
  }
  function prodPart(facs, opt, hints, text) {
    var m = prodMono(facs, opt);
    return expoPart(t(m.tex), m.res, m.rows, m.sol, hints || ['Multiply the numbers in front; for each letter, add the exponents (a letter with no exponent has exponent ' + t(1) + ').'], text || plain(m.tex));
  }
  function sumTo(r, S, k, lo) { // k whole numbers ≥ lo adding to S
    return pickWhere(function () { var a = []; for (var i = 0; i < k - 1; i++) a.push(r.int(lo, S)); a.push(S - a.reduce(function (x, y) { return x + y; }, 0)); return a; }, function (a) { return a.every(function (x) { return x >= lo; }); });
  }

  var LAW = { prod: 'Product Law: keep the base and add the exponents' };
  /* pools of powers for "evaluate" (value ≤ ~4100, no calculator) */
  var HIGH = [[2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10], [2, 11], [2, 12], [3, 4], [3, 5], [3, 6], [3, 7], [4, 4], [4, 5], [4, 6], [5, 4], [5, 5], [6, 4], [7, 4], [8, 4]];
  var SQ = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30].map(function (k) { return [k, 2]; });
  var CUBE = [[2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [2, 5], [3, 5], [2, 7], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4]];
  var TENS = [[10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [20, 2], [20, 3], [30, 2], [30, 3], [40, 2], [40, 3], [50, 2], [50, 3], [60, 2], [70, 2], [80, 2], [90, 2], [100, 2], [100, 3]];
  var ODDP = [[2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [10, 3], [11, 3], [12, 3], [2, 5], [3, 5], [4, 5], [5, 5], [2, 7], [2, 9], [10, 5], [20, 3], [30, 3]];
  var EVENP = [[2, 4], [2, 6], [2, 8], [2, 10], [3, 4], [3, 6], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [10, 6], [20, 4], [3, 8], [2, 12], [4, 6], [30, 4], [10, 8]];
  var SQN = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 30];

  /* ---------- extra 14: write a number as a power in every way ---------- */
  function powsOf(N) { var out = []; for (var b = 2; b * b <= N; b++) { var v = b, e = 1; while (v < N) { v *= b; e++; } if (v === N) out.push([b, e]); } return out; }
  function everyWay(r, N) {
    var T = powsOf(N), D = [];
    T.forEach(function (p) { if (N % p[0] === 0 && N / p[0] >= 2 && N / p[0] !== p[1]) D.push([p[0], N / p[0], 'times']); });
    for (var b = 2; b <= 12; b++) if (N % b === 0 && N / b >= 2 && N / b <= 60 && !T.some(function (p) { return p[0] === b; })) D.push([b, N / b, 'times']);
    T.forEach(function (p) { D.push([p[0], p[1] + 1, 'off']); if (p[1] > 2) D.push([p[0], p[1] - 1, 'off']); D.push([p[1], p[0], 'swap']); });
    D.push([N, 1, 'one']);
    var seen = {}; T.forEach(function (p) { seen[p[0] + '^' + p[1]] = 1; });
    D = r.shuffle(D.filter(function (d) { var k = d[0] + '^' + d[1]; if (seen[k] || Math.pow(d[0], d[1]) === N) return false; seen[k] = 1; return true; }));
    var D2 = D.filter(function (d) { return d[2] === 'one'; }).concat(D.filter(function (d) { return d[2] !== 'one'; }).slice(0, Math.max(3, 6 - T.length)));
    var all = r.shuffle(T.map(function (p) { return { b: p[0], e: p[1], right: true }; }).concat(D2.map(function (d) { return { b: d[0], e: d[1], why: d[2] }; })));
    var want = T.map(function (p) { return pw(p[0], p[1]); });
    var listT = T.map(function (p) { return t(pw(p[0], p[1])); }).join(', ');
    return { prompt: 'Tap <b>every</b> way to write ' + t(F(N)) + ' as a power with a whole-number base and an exponent greater than ' + t(1) + '.', input: { type: 'select', options: all.map(function (o) { return { value: pw(o.b, o.e), html: t(pw(o.b, o.e)) }; }) },
      check: K.selectSet(want, function (extra, missing) {
        if (extra.length) { var x = extra[0], o = all.filter(function (q) { return pw(q.b, q.e) === x; })[0];
          if (o && o.why === 'one') return { code: 'u2l1-power-list', hint: 'The exponent must be greater than ' + t(1) + '.' };
          if (o && o.why === 'times') return { code: 'times-exp', hint: t(pw(o.b, o.e)) + ' means ' + t(o.b) + ' multiplied by itself ' + o.e + ' times, not ' + t(o.b + '\\times ' + o.e) + '. It is much bigger than ' + t(F(N)) + '.' };
          return { code: 'u2l1-power-list', hint: 'Check ' + t(x) + ' by multiplying it out — it isn’t ' + t(F(N)) + '.' }; }
        return { code: 'u2l1-power-missing', hint: 'Those are right, but there ' + (missing.length === 1 ? 'is another way' : 'are other ways') + '. Try each small base: is ' + t(F(N)) + ' a power of ' + t(2) + '? of ' + t(3) + '? of ' + t(4) + '? …' };
      }),
      key: want, answer: listT, text: 'every power = ' + N,
      solution: t(F(N) + '=' + T.map(function (p) { return pw(p[0], p[1]); }).join('=')) + (T.length === 1 ? ' — that is the only way (the exponent must be greater than ' + t(1) + ').' : '. ') + (T.length > 1 ? 'Each one is the same repeated multiplication grouped differently, e.g. ' + t(pw(T[T.length - 1][0], T[T.length - 1][1]) + '=' + rep(T[T.length - 1][0], T[T.length - 1][1])) + '.' : ''),
      hints: ['Try small bases first: divide by the base again and again until you reach ' + t(1) + ', and count the divisions.'], bad: [want.slice(0, -1).length ? want.slice(0, -1) : [pw(N, 1)]] };
  }

  HW.defineLesson({
    id: 'u2l1', unit: 2, num: '1', title: 'Powers, Exponent Vocabulary & the Product Law', outcome: 'AN3',
    blurb: 'Base and exponent, writing powers as repeated multiplication, evaluating powers (−3² vs (−3)²), and the Product Law: keep the base, add the exponents.',
    questions: [
      /* ===================== Part A ===================== */
      { num: '1', section: 'Part A — Vocabulary and Evaluating', stem: 'State the base and the exponent in each power.', parts: [
        { id: '1a', level: 'LIM', make: function (r) {
          var k = r.int(2, 12), n = r.pick([2, 3, 4, 5, 6, 7, 8].filter(function (x) { return x !== k; }));
          return baseExpPart(pw(k, n), String(k), String(n), [], [[String(n), 'swapped', 'That’s the exponent. The base is the big number on the bottom.']], [[String(k), 'swapped', 'That’s the base. The exponent is the small raised number.']],
            'The base is the factor being repeated: ' + t(k) + '. The exponent is ' + t(n) + ': ' + t(pw(k, n) + '=' + rep(k, n)) + '.', 'base/exponent ' + k + '^' + n);
        } },
        { id: '1b', level: 'LIM', make: function (r) {
          var v = r.pick(LET), n = r.int(2, 12);
          return baseExpPart(pw(v, n), v, String(n), [v], [[String(n), 'swapped', 'That’s the exponent. The base is the letter.']], [[v, 'swapped', 'That’s the base. The exponent is the small raised number.']], 'Base ' + t(v) + ' (the factor being repeated), exponent ' + t(n) + ' (how many times it is used).', 'base/exponent ' + v + '^' + n);
        } },
        { id: '1c', level: 'LIM', make: function (r) {
          var k = r.int(2, 9), v = r.pick(LET);
          return baseExpPart(pw(k, v), String(k), v, [v], [[v, 'swapped', 'The letter is the exponent here. The base is the number being repeated.']], [[String(k), 'swapped', 'That’s the base. The exponent is the raised letter.']],
            'An exponent can be a letter. The base is ' + t(k) + ' and the exponent is ' + t(v) + '.', 'base/exponent ' + k + '^' + v);
        } },
        { id: '1d', level: 'BEG', make: function (r) {
          var v = r.pick(LET), n = r.pick([3, 5, 7, 9]);
          return baseExpPart(pw(par('-' + v), n), '-' + v, String(n), [v], [[v, 'fence', 'The brackets put the minus sign inside, so it is part of the base.']], null,
            'The brackets hold ' + t('-' + v) + ', so the base is ' + t('-' + v) + ' and the exponent is ' + t(n) + ': ' + t(pw(par('-' + v), n) + '=' + rep('(-' + v + ')', n, '')) + '.', 'base/exponent (-' + v + ')^' + n);
        } },
        { id: '1e', level: 'LIM', make: function (r) {
          var k = r.int(2, 15), n = r.pick([2, 2, 3]);
          return baseExpPart(pw(k, n), String(k), String(n), [], [[String(n), 'swapped', 'That’s the exponent. The base is the big number on the bottom.']], [[String(k), 'swapped', 'That’s the base. The exponent is the small raised number.']],
            'Base ' + t(k) + ', exponent ' + t(n) + ': ' + t(pw(k, n) + '=' + rep(k, n)) + '.', 'base/exponent ' + k + '^' + n);
        } }] },
      { num: '2', stem: 'Write each power as a repeated multiplication.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { var k = r.int(2, 9), n = r.int(3, 5); return repPart(pw(k, n), rep(k, n), String(k), n, [[String(k * n), 'times-exp', 'The exponent isn’t a multiplier. Write ' + t(k) + ' as a factor ' + n + ' times.']], t(pw(k, n) + '=' + rep(k, n)) + ' — the base ' + t(k) + ' is used ' + n + ' times.', 'repeated mult ' + k + '^' + n); } },
        { id: '2b', level: 'LIM', make: function (r) { var v = r.pick(LET), n = r.int(3, 6); return repPart(pw(v, n), rep(v, n), v, n, [[n + v, 'times-exp', 'The exponent isn’t a multiplier: ' + t(pw(v, n)) + ' is ' + t(v) + ' times itself, ' + n + ' factors.']], t(pw(v, n) + '=' + rep(v, n)) + ' — the base ' + t(v) + ' is used ' + n + ' times.', 'repeated mult ' + v + '^' + n); } },
        { id: '2c', level: 'BEG', make: function (r) { var k = r.int(2, 9), n = r.pick([3, 4, 5]);
          return repPart(pw(par('-' + k), n), rep('(-' + k + ')', n), '-' + k, n, [['-' + pw(k, n), 'fence', 'The bracket holds ' + t('-' + k) + ', so the negative is part of every factor.'], [rep(k, n), 'fence', 'The bracket holds ' + t('-' + k) + ': every factor is ' + t('(-' + k + ')') + '.']],
            'The brackets make ' + t('-' + k) + ' the base: ' + t(pw(par('-' + k), n) + '=' + rep('(-' + k + ')', n)) + '.', 'repeated mult (-' + k + ')^' + n); } },
        { id: '2d', level: 'LIM', make: function (r) { var v = r.pick(LET), n = r.int(5, 8); return repPart(pw(v, n), rep(v, n), v, n, null, t(pw(v, n) + '=' + rep(v, n)) + ' — ' + n + ' factors of ' + t(v) + '.', 'repeated mult ' + v + '^' + n); } }] },
      { num: '3', stem: 'Evaluate each power.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var p = r.pick(HIGH); return evalPow(p[0], p[1]); } },
        { id: '3b', level: 'LIM', make: function (r) { var p = r.pick(SQ); return evalPow(p[0], p[1]); } },
        { id: '3c', level: 'BEG', make: function (r) { var p = r.pick(HIGH); return evalPow(p[0], p[1]); } },
        { id: '3d', level: 'BEG', make: function (r) { var p = r.pick(CUBE); return evalPow(p[0], p[1]); } },
        { id: '3e', level: 'LIM', make: function (r) { var p = r.pick(TENS); return evalPow(p[0], p[1]); } },
        { id: '3f', level: 'BEG', make: function (r) { var p = r.pick(HIGH); return evalPow(p[0], p[1]); } }] },
      { num: '4', stem: 'Evaluate without a calculator. Pay close attention to the brackets.',
        shared: function (r) { return { k: r.pick(SQN), o: r.pick(ODDP), e: r.pick(EVENP) }; },
        parts: [
          { id: '4a', level: 'EMG', make: function (r, s) { return negPart('out', s.k, 2); } },
          { id: '4b', level: 'BEG', make: function (r, s) { return negPart('in', s.k, 2); } },
          { id: '4c', level: 'EMG', make: function (r, s) { return negPart('out', s.o[0], s.o[1]); } },
          { id: '4d', level: 'BEG', make: function (r, s) { return negPart('in', s.o[0], s.o[1]); } },
          { id: '4e', level: 'EMG', make: function (r, s) { return negPart('out', s.e[0], s.e[1]); } },
          { id: '4f', level: 'BEG', make: function (r, s) { return negPart('in', s.e[0], s.e[1]); } }] },
      { num: '5', stem: function (sh) { return 'Explain why ' + t('-' + pw(sh.k, 2)) + ' and ' + t(pw(par('-' + sh.k), 2)) + ' are not equal.'; },
        shared: function (r) { return { k: r.pick(SQN) }; },
        parts: [
          { id: '5a', level: 'BEG', make: function (r, s) {
            var k = s.k, K2 = k * k, fl = [fld('First', t('-' + pw(k, 2) + '=')), fld('Second', t(pw(par('-' + k), 2) + '='))];
            return P.fields('First evaluate both.', fl, [numCk(-K2, [[K2, 'fence', 'No brackets: the exponent applies only to ' + t(k) + '. Square ' + t(k) + ', then put the minus sign in front.'], [-2 * k, 'times-exp', 'Squaring means ' + t(k + '\\times ' + k) + ', not ' + t('2\\times ' + k) + '.']]),
              numCk(K2, [[-K2, 'fence', 'The brackets make ' + t('-' + k) + ' the base: ' + t('(-' + k + ')(-' + k + ')') + ', and negative × negative is positive.'], [2 * k, 'times-exp', 'Squaring means ' + t(k + '\\times ' + k) + '.']])],
              [String(-K2), String(K2)], t('-' + pw(k, 2) + '=' + (-K2)) + ', ' + t(pw(par('-' + k), 2) + '=' + K2), t('-' + pw(k, 2) + '=-(' + k + '\\times ' + k + ')=' + (-K2)) + ' but ' + t(pw(par('-' + k), 2) + '=(-' + k + ')(-' + k + ')=' + K2) + '.',
              ['Which number is the base in each one? Only the base is multiplied by itself.'], '-' + k + '^2 vs (-' + k + ')^2');
          } },
          { id: '5b', level: 'EMG', make: function (r, s) {
            var k = s.k;
            return mc(r, 'Which statement explains the difference?', [
              { html: 'In ' + t('-' + pw(k, 2)) + ' there are no brackets, so only ' + t(k) + ' is squared and the minus sign stays: ' + t('-' + k * k) + '. In ' + t(pw(par('-' + k), 2)) + ' the brackets make ' + t('-' + k) + ' the base, and ' + t('(-' + k + ')(-' + k + ')=' + k * k) + '.', right: true },
              { html: 'They are equal — both are ' + t(k * k) + ' because a square is never negative.', why: 'Evaluate ' + t('-' + pw(k, 2)) + ' carefully: the minus sign is outside, so it is never squared.' },
              { html: 'In ' + t('-' + pw(k, 2)) + ' the minus sign is squared too, so it is positive.', why: 'With no brackets the exponent belongs only to ' + t(k) + '.' },
              { html: 'The exponent ' + t(2) + ' doubles the number, so ' + t('-' + pw(k, 2) + '=-' + 2 * k) + '.', why: 'An exponent of ' + t(2) + ' means multiply the base by itself, not by ' + t(2) + '.' }],
              'Brackets decide the base. ' + t('-' + pw(k, 2) + '=-(' + k + '\\times ' + k + ')=-' + k * k) + ', but ' + t(pw(par('-' + k), 2) + '=(-' + k + ')(-' + k + ')=' + k * k) + '.', ['Write each one as a repeated multiplication.'], 'why -' + k + '^2 differs');
          } }] },
      { num: '6', stem: 'Evaluate each algebraic power for the given value of the variable.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var v = r.pick(LET), a = r.int(2, 12); return subPart(v, 2, a); } },
        { id: '6b', level: 'BEG', make: function (r) { var v = r.pick(LET), a = r.int(2, 6); return subPart(v, 3, a); } },
        { id: '6c', level: 'EMG', make: function (r) { var v = r.pick(LET), a = -r.int(2, 12); return subPart(v, 2, a); } },
        { id: '6d', level: 'EMG', make: function (r) { var v = r.pick(LET), p = r.pick([[-1, 4], [-1, 2], [-1, 6], [-1, 8], [-1, 10], [-2, 4], [-3, 4], [-2, 6]]); return subPart(v, p[1], p[0]); } },
        { id: '6e', level: 'EMG', make: function (r) { var v = r.pick(LET), p = r.pick([[-3, 3], [-2, 3], [-4, 3], [-5, 3], [-1, 3], [-1, 5], [-2, 5], [-1, 7]]); return subPart(v, p[1], p[0]); } }] },

      /* ===================== Part B ===================== */
      { num: '7', section: 'Part B — The Product Law', stem: function (sh) { return 'Expand ' + t(pw(sh.b, sh.m) + '\\times ' + pw(sh.b, sh.n)) + ' into repeated multiplication, count the total factors of ' + t(sh.b) + ', rewrite as a single power, then evaluate it.'; },
        shared: function (r) { var x = pickWhere(function () { return [r.int(2, 5), r.int(2, 4), r.int(2, 4)]; }, function (x) { return Math.pow(x[0], x[1] + x[2]) <= 4100 && x[1] + x[2] >= 4; }); if (r.chance(0.2)) x = [4, 2, 3]; return { b: x[0], m: x[1], n: x[2] }; },
        parts: [
          { id: '7', level: 'BEG', make: function (r, s) {
            var b = s.b, m = s.m, n = s.n, e = m + n, v = Math.pow(b, e), fl = [fld('Repeated multiplication', 'repeated multiplication:', true), fld('Single power', 'single power:', true), fld('Value', 'value:', true)];
            return P.fields('Fill in all three.', fl, [repMul(rep(b, e), String(b), e, [[rep(b, m * n), 'mult-exp', 'Write out ' + m + ' factors, then ' + n + ' more — the blocks are put side by side, not multiplied.']]),
              singlePow(b, e, [[m * n, 'mult-exp', 'Count the factors: ' + m + ' and then ' + n + ' more is ' + t(m + '+' + n) + '.']]), K.value(v, { only: 'integer', diag: function (x) { return x === Math.pow(b, m * n) ? { code: 'mult-exp', hint: 'Add the exponents: ' + t(m + '+' + n + '=' + e) + '.' } : x === b * e ? { code: 'times-exp', hint: t(pw(b, e)) + ' is ' + t(b) + ' multiplied by itself ' + e + ' times.' } : null; } })],
              [rep(b, e), pw(b, e), String(v)], t(rep(b, e) + '=' + pw(b, e) + '=' + F(v)),
              t(pw(b, m) + '\\times ' + pw(b, n) + '=(' + rep(b, m) + ')\\times(' + rep(b, n) + ')') + ': ' + t(m + '+' + n + '=' + e) + ' factors of ' + t(b) + ', so it is ' + t(pw(b, e) + '=' + F(v)) + '.',
              ['Write ' + t(pw(b, m)) + ' as ' + m + ' factors and ' + t(pw(b, n)) + ' as ' + n + ' factors, side by side. How many factors altogether?'], b + '^' + m + ' x ' + b + '^' + n + ' expanded');
          } }] },
      { num: '8', stem: 'Use the Product Law to simplify, then evaluate.', parts: [
        { id: '8a', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 5), r.int(1, 4), r.int(2, 4)]; }, function (x) { return x[1] * x[2] !== x[1] + x[2] && Math.pow(x[0], x[1] + x[2]) <= 4100 && x[1] + x[2] >= 3 && !(x[0] === 3 && x[1] * x[2] === 8); }); return prodEval([x[0], x[0]], [x[1], x[2]]); } },
        { id: '8b', level: 'EMG', make: function (r) { var x = pickWhere(function () { var b = r.int(3, 10), m = r.int(2, 5); return r.chance(0.5) ? [b, m, 1] : [b, 1, m]; }, function (x) { var v = Math.pow(x[0], x[1] + x[2]); return v >= 27 && v <= 1024 && !(x[0] === 6 && x[1] + x[2] === 4); }); /* 6³ × 6 is Lesson Example 4(b) */ if (r.chance(0.15)) x = [6, 2, 1]; return prodEval([x[0], x[0]], [x[1], x[2]], { bare1: true }); } },
        { id: '8c', level: 'EMG', make: function (r) { var b = r.pick([2, 2, 3]), x = pickWhere(function () { return r.shuffle([r.int(2, 5), 1, r.int(2, 4)]); }, function (x) { var e = x[0] + x[1] + x[2]; return b === 2 ? e <= 11 && e >= 5 : e <= 7; }); return prodEval([b, b, b], x); } },
        { id: '8d', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.pick([2, 3, 4, 5, 7, 9]), r.int(2, 5), r.int(2, 5)]; }, function (x) { var v = Math.pow(x[0], x[1] + x[2]); return (x[1] * x[2] !== x[1] + x[2] || x[0] === 5) && v <= 1024 && !(x[0] === 3 && x[1] * x[2] === 8); }); /* 3² × 3⁴ is Lesson Example 4(a) */ if (r.chance(0.15)) x = [5, 2, 2]; return prodEval([x[0], x[0]], [x[1], x[2]]); } },
        { id: '8e', level: 'BEG', make: function (r) { var m = r.int(1, 5), n = pickWhere(function () { return r.int(1, 5); }, function (n) { return n * m !== n + m; }); return prodEval([10, 10], [m, n]); } }] },
      { num: '9', stem: 'Use the Product Law to simplify.', parts: [
        { id: '9a', level: 'BEG', make: function (r) { var v = r.pick(LET), x = pickWhere(function () { return [r.int(2, 9), r.int(2, 9)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; }); return prodPart([[1, [[v, x[0]]]], [1, [[v, x[1]]]]]); } },
        { id: '9b', level: 'EMG', make: function (r) { var v = r.pick(LET), m = r.int(2, 12); return prodPart([[1, [[v, m]]], [1, [[v, 1]]]]); } },
        { id: '9c', level: 'BEG', make: function (r) { var v = r.pick(LET), x = [r.int(2, 6), r.int(2, 6), r.int(2, 6)]; return prodPart([[1, [[v, x[0]]]], [1, [[v, x[1]]]], [1, [[v, x[2]]]]]); } },
        { id: '9d', level: 'EMG', make: function (r) { var v = r.pick(LET), m = r.int(3, 12), p = prodPart([[1, [[v, m]]], [1, [[v, m]]]], null, ['Two equal powers multiplied: how many factors of ' + t(v) + ' are there altogether?']);
          return withDiag(p, pw(v, 2 * m), [[both(cIs(2), eIs(v, m)), 'u2l1-doubled', 'That would be ' + t(pw(v, m) + '+' + pw(v, m)) + ' (adding). Here the powers are <b>multiplied</b>: add the exponents.']]); } },
        { id: '9e', level: 'EMG', make: function (r) { var v = r.pick(LET), n = r.int(2, 12); return prodPart([[1, [[v, 1]]], [1, [[v, n]]]]); } }] },
      { num: '10', stem: 'Use the Product Law to simplify each expression involving coefficients.', parts: [
        { id: '10a', level: 'BEG', make: function (r) { var v = r.pick(LET), c = pickWhere(function () { return [r.int(2, 9), r.int(2, 9)]; }, function (c) { return c[0] * c[1] !== c[0] + c[1]; }), e = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (e) { return e[0] * e[1] !== e[0] + e[1]; }); return prodPart([[c[0], [[v, e[0]]]], [c[1], [[v, e[1]]]]]); } },
        { id: '10b', level: 'EMG', make: function (r) { var v = r.pick(LET), c = r.int(2, 9), e = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (e) { return e[0] * e[1] !== e[0] + e[1]; });
          return prodPart([[c, [[v, e[0]]]], [1, [[v, e[1]]]]]); } },
        { id: '10c', level: 'EMG', make: function (r) { var v = r.pick(LET), c = pickWhere(function () { return [r.int(2, 9), r.int(2, 9)]; }, function (c) { return c[0] * c[1] !== c[0] + c[1]; }); return prodPart([[c[0], [[v, 1]]], [c[1], [[v, r.int(2, 8)]]]]); } },
        { id: '10d', level: 'BEG', make: function (r) { var v = r.pick(LET), c = pickWhere(function () { return [r.int(2, 9), r.int(2, 6)]; }, function (c) { return c[0] * c[1] !== c[0] + c[1]; }), e = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (e) { return e[0] * e[1] !== e[0] + e[1]; }); return prodPart([[c[0], [[v, e[0]]]], [c[1], [[v, e[1]]]]]); } },
        { id: '10e', level: 'EMG', make: function (r) { var v = r.pick(LET), c = r.int(2, 9), e = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (e) { return e[0] * e[1] !== e[0] + e[1]; });
          var p = prodPart([[c, [[v, e[0]]]], [1, [[v, e[1]]]]]); return withDiag(p, c + pw(v, e[0] + e[1]), [[cIs(c + 1), 'coef-added', 'The second factor has coefficient ' + t(1) + ', and coefficients multiply: ' + t(c + '\\times 1=' + c) + '.']]); } }] },
      { num: '11', stem: 'Find the value of ' + t('x') + ' that makes each statement true.', parts: [
        { id: '11a', level: 'PRG', make: function (r) { var a = r.int(2, 9), x = r.int(2, 9); return missExp('a', [String(a), 'x'], a + x, x, a); } },
        { id: '11b', level: 'PRG', make: function (r) { var a = r.int(2, 9), x = r.int(2, 9); return missExp('b', ['x', String(a)], a + x, x, a); } },
        { id: '11c', level: 'PRG', make: function (r) { var a = r.int(2, 9), x = r.int(2, 9); return missExp('c', [String(a), 'x'], a + x, x, a); } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var x = pickWhere(function () { return [r.int(2, 7), r.int(2, 6)]; }, function (x) { var s = x[0] + x[1], p = x[0] * x[1], d = Math.abs(x[0] - x[1]); return x[0] !== x[1] && p !== s && d !== s && d !== p && d >= 1; }), m = x[0], n = x[1], v = r.pick(['m', 'm', 'x', 'y', 'a', 'k']);
          return mc(r, 'Which of the following is equivalent to ' + t(pw(v, m) + '\\times ' + pw(v, n)) + '?', [
            { html: t(pw(v, m + n)), right: true },
            { html: t(pw(v, m * n)), why: 'That multiplies the exponents. When powers of the same base are multiplied, <b>add</b> the exponents.' },
            { html: t(vt(v, Math.abs(m - n))), why: 'That subtracts the exponents. Multiplying powers <b>adds</b> them.' },
            { html: t('2' + pw(v, m + n)), why: 'The exponent is right, but nothing doubles: ' + t(pw(v, m) + '\\times ' + pw(v, n)) + ' has coefficient ' + t('1\\times 1=1') + '.' }],
            LAW.prod + ': ' + t(pw(v, m) + '\\times ' + pw(v, n) + '=' + pw(v, m + '+' + n) + '=' + pw(v, m + n)) + '.', ['Write out the factors: how many ' + t(v) + 's altogether?'], v + '^' + m + ' x ' + v + '^' + n + ' MC');
        } }] },
      { num: '13', stem: function (sh) { return 'A rectangular prism has a square base with side length ' + t(pw('x', sh.a)) + ' and a height of ' + t(pw('x', sh.b)) + '. Write an expression for its volume as a single power of ' + t('x') + '.'; },
        shared: function (r) { var x = pickWhere(function () { return [r.int(2, 5), r.int(2, 8)]; }, function (x) { return x[0] !== x[1]; }); if (r.chance(0.2)) x = [2, 3]; return { a: x[0], b: x[1] }; },
        parts: [
          { id: '13', level: 'ADV', make: function (r, s) {
            var a = s.a, b = s.b, E = 2 * a + b;
            return expoPart('Volume ' + t('V='), pw('x', E), [[eIs('x', a + b), 'u2l1-one-side', 'The base is a <b>square</b>: its area is side × side, ' + t(pw('x', a) + '\\times ' + pw('x', a)) + '. Then multiply by the height.'], [eIs('x', a * a * b), 'mult-exp', 'Product Law: <b>add</b> the exponents of the three factors.'], [eIs('x', a * b), 'mult-exp', 'Product Law: <b>add</b> the exponents.'], [eIs('x', 2 * a), 'count', 'That is the area of the base. Multiply by the height too.']],
              'Volume = area of base × height = ' + t(pw('x', a) + '\\times ' + pw('x', a) + '\\times ' + pw('x', b) + '=' + pw('x', a + '+' + a + '+' + b) + '=' + pw('x', E)) + '.',
              ['Volume of a prism = (area of the base) × height, and the area of a square is side × side.'], 'prism x^' + a + ' x^' + b, { bad: [pw('x', a + b)] });
          } }] }
    ],

    /* =============================== EXTRA PRACTICE =============================== */
    extra: [
      { num: '1', section: 'Part A — Vocabulary, Brackets and Negative Bases', stem: 'For each expression, state the <b>coefficient</b>, the <b>base</b> and the <b>exponent</b>. Read the brackets carefully — they decide what the base actually is.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { var c = r.int(2, 9), v = r.pick(LET), e = r.pick([2, 3, 4, 5, 6, 7].filter(function (x) { return x !== c; }));
          return cbePart('-' + c + pw(v, e), '-' + c, v, String(e), [v], { coef: [[String(c), 'coef-sign', 'Include the sign: the coefficient is ' + t('-' + c) + '.'], [String(e), 'coef-exp', 'That’s the exponent.']], base: [['-' + c + v, 'part-base', 'Only ' + t(v) + ' carries the exponent. The ' + t('-' + c) + ' is the coefficient.']] },
            'No brackets, so only ' + t(v) + ' is raised to the power: ' + t('-' + c + pw(v, e) + '=(-' + c + ')\\times ' + pw(v, e)) + '. Coefficient ' + t('-' + c) + ', base ' + t(v) + ', exponent ' + t(e) + '.', 'cbe -' + c + v + '^' + e); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var c = r.int(2, 9), v = r.pick(LET), e = r.pick([2, 3, 4, 5, 6].filter(function (x) { return x !== c; })), B = '-' + c + v;
          return cbePart(pw(par(B), e), '1', B, String(e), [v], { coef: [['-' + c, 'part-base', 'The ' + t('-' + c) + ' is inside the brackets — it is part of the base. Nothing multiplies the bracket, so the coefficient is the understood ' + t('1') + '.'], ['-1', 'coef-sign', 'The minus sign is inside the brackets, so it belongs to the base.']], base: [[v, 'part-base', 'The brackets hold all of ' + t(B) + '.'], [c + v, 'fence', 'The minus sign is inside the brackets, so it is part of the base.']] },
            'The brackets hold ' + t(B) + ', so the whole of ' + t(B) + ' is the base: coefficient ' + t('1') + ' (understood), base ' + t(B) + ', exponent ' + t(e) + '.', 'cbe (' + B + ')^' + e); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var c = r.int(2, 12), v = r.pick(LET);
          return cbePart(c + v, String(c), v, '1', [v], { exp: [['0', 'no-one', 'A letter written alone is used once: ' + t(v + '=' + pw(v, 1)) + '.'], [String(c), 'coef-exp', 'That’s the coefficient.']], coef: [['1', 'coef-exp', 'The ' + t(c) + ' multiplies ' + t(v) + ', so it is the coefficient.']] },
            t(c + v + '=' + c + '\\times ' + pw(v, 1)) + ': coefficient ' + t(c) + ', base ' + t(v) + ', exponent ' + t(1) + ' (not written).', 'cbe ' + c + v); } },
        { id: 'e1d', level: 'EMG', make: function (r) { var v = r.pick(LET), e = r.int(2, 9);
          return cbePart('-' + pw(v, e), '-1', v, String(e), [v], { coef: [['1', 'coef-sign', 'The minus sign in front means the coefficient is ' + t('-1') + '.']], base: [['-' + v, 'fence', 'No brackets: the minus sign is outside, so the base is just ' + t(v) + '.']] },
            t('-' + pw(v, e) + '=-1\\times ' + pw(v, e)) + ': coefficient ' + t('-1') + ', base ' + t(v) + ', exponent ' + t(e) + '.', 'cbe -' + v + '^' + e); } }] },
      { num: '2', stem: function (sh) { return 'Evaluate ' + t(sh.c + pw('x', 2)) + ' and ' + t(pw(par(sh.c + 'x'), 2)) + ' when ' + t('x=' + sh.x) + '. Then explain why the two expressions are not the same thing.'; },
        shared: function (r) { var c = r.int(2, 6), x = r.int(2, 6); if (r.chance(0.2)) { c = 3; x = 2; } return { c: c, x: x }; },
        parts: [
          { id: 'e2a', level: 'BEG', make: function (r, s) { var c = s.c, x = s.x, A = c * x * x, B = c * c * x * x, fl = [fld('First', t(c + pw('x', 2) + '=')), fld('Second', t(pw(par(c + 'x'), 2) + '='))];
            return P.fields('Evaluate both.', fl, [numCk(A, [[B, 'u2l1-coef-squared', 'No brackets: only ' + t('x') + ' is squared. Square ' + t(x) + ', then multiply by ' + t(c) + '.'], [Math.pow(2 * c * x, 1), 'times-exp', 'Squaring ' + t(x) + ' means ' + t(x + '\\times ' + x) + '.']]),
              numCk(B, [[A, 'u2l1-coef-not-squared', 'The brackets hold ' + t(c + 'x') + ': work out ' + t(c + '\\times ' + x + '=' + c * x) + ' first, then square it.'], [2 * c * x, 'times-exp', 'Squaring means multiplying by itself.']])],
              [String(A), String(B)], t(A) + ' and ' + t(B), t(c + pw('(' + x + ')', 2) + '=' + c + '\\times ' + x * x + '=' + A) + ', but ' + t(pw('(' + c + '\\times ' + x + ')', 2) + '=' + pw(c * x, 2) + '=' + B) + '.', ['Brackets first: in the second one, multiply inside the brackets, then square.'], c + 'x^2 vs (' + c + 'x)^2, x=' + x); } },
          { id: 'e2b', level: 'EMG', make: function (r, s) { var c = s.c;
            return mc(r, 'Why are they different?', [
              { html: 'In ' + t(c + pw('x', 2)) + ' only ' + t('x') + ' is squared. The brackets in ' + t(pw(par(c + 'x'), 2)) + ' make the whole product ' + t(c + 'x') + ' the base, so the ' + t(c) + ' is squared too.', right: true },
              { html: 'In ' + t(pw(par(c + 'x'), 2)) + ' the brackets mean multiply by ' + t(2) + '.', why: 'An exponent ' + t(2) + ' means multiply the base by itself, not by ' + t(2) + '.' },
              { html: 'They are the same; the brackets don’t change anything.', why: 'Your two values in part (a) are different, so the expressions are not the same.' },
              { html: 'In ' + t(c + pw('x', 2)) + ' the ' + t(c) + ' is squared but the ' + t('x') + ' is not.', why: 'The exponent sits on ' + t('x') + ', so ' + t('x') + ' is squared and the ' + t(c) + ' is not.' }],
              t(c + pw('x', 2) + '=' + c + '\\times x\\times x') + ' but ' + t(pw(par(c + 'x'), 2) + '=(' + c + 'x)(' + c + 'x)=' + c * c + pw('x', 2)) + '. Only what is inside the brackets is raised to the power.', ['Write each one as a repeated multiplication.'], 'why ' + c + 'x^2 differs');
          } }] },
      { num: '3', stem: 'Evaluate each product without a calculator. Expand first if it helps.',
        shared: function (r) { var k = r.pick([2, 2, 2, 3, 3, 4, 5, 10]), mx = { 2: 8, 3: 6, 4: 4, 5: 4, 10: 5 }[k];
          function ab(odd) { return pickWhere(function () { return [r.int(1, mx - 2), r.int(2, mx - 1)]; }, function (x) { return x[0] + x[1] <= mx && (x[0] + x[1]) % 2 === (odd ? 1 : 0); }); }
          var A = ab(true), C = ab(false), j = r.int(2, 10), jb = j <= 4 ? r.pick([[1, 2], [2, 1], [1, 4], [2, 3]]) : r.pick([[1, 2], [2, 1]]);
          if (r.chance(0.15)) { k = 2; A = [3, 4]; C = [2, 4]; j = 5; jb = [1, 2]; }
          return { k: k, a: A[0], b: A[1], c: C[0], d: C[1], j: j, ja: jb[0], jb: jb[1] }; },
        parts: [
          { id: 'e3a', level: 'EMG', make: function (r, s) { return negProd(s.k, s.a, s.b, true); } },
          { id: 'e3b', level: 'EMG', make: function (r, s) { return negProd(s.k, s.a, s.b, false); } },
          { id: 'e3c', level: 'EMG', make: function (r, s) { return negProd(s.k, s.c, s.d, true); } },
          { id: 'e3d', level: 'EMG', make: function (r, s) { return negProd(s.k, s.c, s.d, false); } },
          { id: 'e3e', level: 'EMG', make: function (r, s) { return negProd(s.j, s.ja, s.jb, true); } },
          { id: 'e3f', level: 'EMG', make: function (r, s) { return negProd(s.j, s.ja, s.jb, false); } }] },
      { num: '4', stem: 'In question 3, some pairs gave the same answer and some did not.', parts: [
        { id: 'e4', level: 'PRG', make: function (r) {
          var k = r.pick([2, 3, 4, 5]), a = r.pick([2, 4, 6]);
          return mc(r, 'Compare ' + t(pw('(-' + k + ')', a) + '\\times ' + pw('(-' + k + ')', 2)) + ' with ' + t('-' + pw(k, a) + '\\times ' + pw(k, 2)) + ', and ' + t(pw('(-' + k + ')', a + 1) + '\\times ' + pw('(-' + k + ')', 2)) + ' with ' + t('-' + pw(k, a + 1) + '\\times ' + pw(k, 2)) + '. What does the number of negative factors have to do with it?', [
            { html: 'Each bracketed ' + t('(-' + k + ')') + ' is one negative factor. An <b>odd</b> number of negative factors makes the product negative, an <b>even</b> number makes it positive. The single minus sign out front always gives a negative answer, so the pairs match only when the bracketed version has an odd number of negative factors.', right: true },
            { html: 'Brackets never change the answer; the differences were arithmetic mistakes.', why: 'Work out ' + t(pw('(-' + k + ')', 2)) + ' and ' + t('-' + pw(k, 2)) + ': they are different.' },
            { html: 'The answer is negative whenever there is a negative base, no matter how many factors.', why: t('(-' + k + ')(-' + k + ')=' + k * k) + ' is positive: two negative factors make a positive.' },
            { html: 'An even number of negative factors makes the product negative.', why: 'Negative × negative = positive, so the negatives cancel in pairs: an even number of them gives a positive product.' }],
            'Count the negative factors. ' + t(pw('(-' + k + ')', a) + '\\times ' + pw('(-' + k + ')', 2)) + ' has ' + (a + 2) + ' (even): positive, ' + t(F(Math.pow(k, a + 2))) + '. ' + t('-' + pw(k, a) + '\\times ' + pw(k, 2)) + ' has one minus sign: ' + t(F(-Math.pow(k, a + 2))) + '. With ' + (a + 3) + ' negative factors (odd) the bracketed product is negative too, so that pair matches.',
            ['Negative × negative = positive. What happens with 3 negative factors? 4?'], 'negative factors parity');
        } }] },
      { num: '5', stem: function (sh) { return 'Amrit wants to use the Product Law on ' + t(pw(par('-' + sh.k), sh.a) + '\\times ' + vt(sh.k, sh.b)) + ' and writes ' + t(pw(par('-' + sh.k), sh.a + sh.b) + '=' + F(Math.pow(-sh.k, sh.a + sh.b))) + '.'; },
        shared: function (r) { var x = pickWhere(function () { return [r.pick([2, 2, 3, 3, 4, 5, 10]), r.pick([2, 4]), r.pick([1, 3, 5])]; }, function (x) { return Math.pow(x[0], x[1] + x[2]) <= 3200 || (x[0] === 10 && x[1] + x[2] <= 5); }); if (r.chance(0.2)) x = [2, 2, 3]; return { k: x[0], a: x[1], b: x[2] }; },
        parts: [
          { id: 'e5a', level: 'EMG', make: function (r, s) { var k = s.k, a = s.a, b = s.b, V = Math.pow(k, a + b);
            return numPart('Evaluate the original expression ' + t(pw(par('-' + k), a) + '\\times ' + vt(k, b)) + ' yourself.', V, [[-V, 'u2l1-mixed-base', 'That’s Amrit’s answer. Work out each power separately: ' + t(pw('(-' + k + ')', a) + '=' + Math.pow(k, a)) + ' (even exponent) and ' + t(pw(k, b) + '=' + Math.pow(k, b)) + '.']],
              t(pw('(-' + k + ')', a) + '\\times ' + vt(k, b) + '=' + Math.pow(k, a) + '\\times ' + Math.pow(k, b) + '=' + F(V)) + ', not ' + t(F(-V)) + '.', ['Evaluate each power first, then multiply.'], 'Amrit value'); } },
          { id: 'e5b', level: 'PRG', make: function (r, s) { var k = s.k;
            return mc(r, 'Why doesn’t the Product Law apply as written?', [
              { html: 'The bases are ' + t('-' + k) + ' and ' + t(k) + ' — not identical — so the exponents can’t simply be added.', right: true },
              { html: 'The Product Law only works with positive numbers.', why: 'It works with any base, even ' + t('-' + k) + ' — as long as both bases are the same.' },
              { html: 'The exponents should have been multiplied.', why: 'Multiplying powers adds the exponents. The real problem is the bases.' },
              { html: 'It does apply; Amrit just made an arithmetic mistake.', why: 'Check his answer against your value in (a): his sign is wrong because the two bases are different.' }],
              'The Product Law needs the <b>same</b> base. Here one base is ' + t('-' + k) + ' and the other is ' + t(k) + '.', ['Compare the two bases.'], 'Amrit why'); } },
          { id: 'e5c', level: 'PRG', make: function (r, s) { var k = s.k, a = s.a, b = s.b, e = a + b;
            return P.math('Since the exponent ' + t(a) + ' is even, ' + t(pw(par('-' + k), a) + '=' + pw(k, a)) + '. Rewrite the expression with the base ' + t(k) + ' and finish it as a <b>single power</b>.', singlePow(k, e, [[a * b, 'mult-exp', 'Product Law: <b>add</b> the exponents.']], 'The even exponent makes ' + t(pw('(-' + k + ')', a)) + ' positive, so the answer is positive.'), pw(k, e),
              t(pw(par('-' + k), a) + '\\times ' + vt(k, b) + '=' + pw(k, a) + '\\times ' + vt(k, b) + '=' + pw(k, e) + '=' + F(Math.pow(k, e))) + '.', ['Now both bases are ' + t(k) + ': add the exponents.'], 'Amrit fix', { keys: 'expo', vars: [] }); } }] },

      /* ===================== Part B ===================== */
      { num: '6', section: 'Part B — The Product Law with Coefficients and Several Variables', stem: 'Simplify. Multiply the coefficients, then add the exponents of <b>each</b> variable separately.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) { var vw = lets(r, 2).sort(), x = vw[0], y = vw[1], c = [r.int(2, 5), r.int(2, 5), r.int(2, 4)];
          return prodPart([[c[0], [[x, r.int(2, 4)], [y, 1]]], [c[1], [[x, 1], [y, r.int(2, 6)]]], [c[2], [[x, r.int(2, 4)]]]], { br: true }); } },
        { id: 'e6b', level: 'EMG', make: function (r) { var vw = lets(r, 2).sort(), x = vw[0], y = vw[1], c = [r.int(2, 5), r.int(2, 6)];
          return prodPart([[c[0], [[x, r.int(2, 4)], [y, 1]]], [c[1], [[x, r.int(2, 4)], [y, r.int(2, 5)]]], [1, [[x, 1], [y, r.int(2, 3)]]]], { br: true }); } },
        { id: 'e6c', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), x = vw[0], y = vw[1];
          return prodPart([[-r.int(2, 5), [[x, r.int(2, 4)], [y, 1]]], [r.int(2, 5), [[x, r.int(2, 6)]]], [r.int(2, 4), [[y, r.int(2, 4)]]]], { br: true }); } }] },
      { num: '7', stem: 'Simplify. Watch the signs.', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) { var vw = lets(r, 2).sort(), x = vw[0], y = vw[1];
          return prodPart([[r.int(2, 6), [[x, r.int(2, 4)], [y, r.int(2, 3)]]], [-r.int(2, 5), [[x, 1], [y, r.int(2, 4)]]]], { br: true }); } },
        { id: 'e7b', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), x = vw[0], y = vw[1];
          return prodPart([[-1, [[x, r.int(2, 5)], [y, 1]]], [-r.int(2, 7), [[x, r.int(2, 4)], [y, r.int(2, 5)]]]], { br: true }); } },
        { id: 'e7c', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), x = vw[0], y = vw[1];
          return prodPart([[r.int(2, 5), [[x, r.int(2, 3)], [y, r.int(2, 4)]]], [r.int(2, 4), [[x, r.int(2, 5)]]], [-1, [[y, r.int(2, 3)]]]], { br: true }); } }] },
      { num: '8', stem: 'Simplify each expression as far as the Product Law allows, and decide whether the result can be written as a single power.', parts: [
        { id: 'e8a', level: 'EMG', make: function (r) { var vw = lets(r, 2).sort(), x = vw[0], y = vw[1], a = r.int(2, 5), b = r.int(2, 5), c = r.int(2, 4);
          return prodPart([[1, [[x, a], [y, b]]], [1, [[x, c]]]], null, ['Only powers of the <b>same</b> letter combine. Add the exponents of ' + t(x) + '; ' + t(pw(y, b)) + ' stays as it is.']); } },
        { id: 'e8b', level: 'EMG', make: function (r) { var p = r.pick([[3, 2, 3, 2, 2], [3, 2, 2, 2, 3], [2, 2, 3, 3, 2], [2, 3, 2, 5, 1], [5, 1, 2, 2, 2], [2, 1, 4, 3, 2], [3, 1, 3, 2, 2], [2, 2, 2, 5, 2], [3, 2, 1, 5, 1], [2, 4, 1, 3, 1], [3, 1, 1, 2, 3], [2, 1, 3, 7, 1], [5, 1, 1, 2, 4], [2, 3, 3, 3, 1], [3, 2, 2, 10, 1], [2, 2, 2, 3, 3], [5, 1, 2, 3, 2], [2, 3, 1, 3, 1], [3, 3, 1, 2, 1], [2, 2, 1, 7, 1]]);
            var b = p[0], m = p[1], n = p[2], c = p[3], q = p[4], e = m + n, V = Math.pow(b, e) * Math.pow(c, q), fl = [fld('Single power', t(pw(b, m) + '\\times ' + pw(b, n) + '=')), fld('Value', 'value of the whole product:', true)];
            fl[0].mode = 'math'; fl[0].keys = 'expo'; fl[0].vars = [];
            return P.fields(t(pw(b, m) + '\\times ' + pw(b, n) + '\\times ' + vt(c, q)), fl, [singlePow(b, e, [[m * n, 'mult-exp', 'Product Law: <b>add</b> the exponents.']]), K.value(V, { only: 'integer', diag: function (v) { return v === Math.pow(b * c, e + q) || v === Math.pow(b * c, e) ? { code: 'u2l1-mult-base', hint: 'The ' + t(vt(c, q)) + ' has a different base, so it can’t join the powers of ' + t(b) + '. Multiply its value in at the end.' } : null; } })],
              [pw(b, e), String(V)], t(pw(b, e)) + '; ' + t(F(V)), 'The powers of ' + t(b) + ' combine: ' + t(pw(b, m + '+' + n) + '=' + pw(b, e)) + '. The ' + t(vt(c, q)) + ' has a different base, so it stays separate: ' + t(pw(b, e) + '\\times ' + vt(c, q) + '=' + F(Math.pow(b, e)) + '\\times ' + Math.pow(c, q) + '=' + F(V)) + '. It can’t be one single power.',
              ['Only the powers with the same base combine.'], b + '^' + m + b + '^' + n + c + '^' + q); } },
        { id: 'e8c', level: 'PRG', make: function (r) {
          var vw = lets(r, 2).sort(), x = vw[0], y = vw[1], b1 = r.pick([2, 3]), c1 = r.pick([5, 7]), m = r.int(2, 4), n = r.int(2, 3), k = r.int(2, 5), j = r.int(2, 5);
          var rows = r.shuffle([{ id: 'r1', html: t(pw(b1, m) + '\\times ' + pw(c1, n)), w: 'no' }, { id: 'r2', html: t(pw(x, m) + pw(y, n) + '\\times ' + pw(x, k)), w: 'no' }, { id: 'r3', html: t(pw(b1, k) + '\\times ' + pw(b1, j) + '\\times ' + b1), w: 'yes' }, { id: 'r4', html: t(pw(y, k) + '\\times ' + y + '\\times ' + pw(y, j)), w: 'yes' }]);
          var want = {}; rows.forEach(function (rw) { want[rw.id] = rw.w; });
          return P.grid('Which of these products can be written as a <b>single power</b>?', rows.map(function (rw) { return { id: rw.id, html: rw.html }; }), [{ id: 'yes', html: 'single power' }, { id: 'no', html: 'not a single power' }], want, {},
            'A product is a single power only when every factor has the <b>same base</b>. ' + t(pw(b1, k) + '\\times ' + pw(b1, j) + '\\times ' + b1 + '=' + pw(b1, k + j + 1)) + ' and ' + t(pw(y, k) + '\\times ' + y + '\\times ' + pw(y, j) + '=' + pw(y, k + j + 1)) + ' are single powers. ' + t(pw(b1, m) + '\\times ' + pw(c1, n)) + ' has two bases, and ' + t(pw(x, m) + pw(y, n) + '\\times ' + pw(x, k) + '=' + pw(x, m + k) + pw(y, n)) + ' still has two letters.',
            ['Look at the bases: are they all the same?'], 'single power? table');
        } }] },
      { num: '9', stem: '<b>Error analysis.</b> Each student below made one mistake. Name the mistake, then give the correct answer.',
        shared: function (r) { var v = r.pick(['x', 'x', 'y', 'a', 'm']), ab = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; }), cd = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; }), ef = pickWhere(function () { return [r.int(2, 5), r.int(2, 5)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; }), b = r.pick([2, 2, 3, 5]);
          var mn = b === 2 ? [r.int(2, 4), r.int(2, 5)] : [r.int(1, 3), r.int(1, 3)];
          if (r.chance(0.15)) { ab = [3, 4]; cd = [3, 4]; ef = [2, 5]; b = 2; mn = [3, 4]; } return { v: v, a: ab[0], b: ab[1], c1: cd[0], c2: cd[1], e1: ef[0], e2: ef[1], B: b, m: mn[0], n: mn[1] }; },
        parts: [
          { id: 'e9a', sub: 'a i', level: 'EMG', make: function (r, s) { var v = s.v, a = s.a, b = s.b;
            return mc(r, 'Jo writes ' + t(pw(v, a) + '\\cdot ' + pw(v, b) + '=' + pw(v, a * b)) + '. What is the mistake?', [
              { html: 'She multiplied the exponents instead of adding them.', right: true },
              { html: 'She should have multiplied the bases.', why: 'The base stays the same in the Product Law.' },
              { html: 'She should have subtracted the exponents.', why: 'Subtracting is for dividing powers. Multiplying powers adds the exponents.' },
              { html: 'There is no mistake.', why: 'Count the factors: ' + a + ' and then ' + b + ' more.' }],
              'Multiplying powers with the same base <b>adds</b> the exponents. Jo multiplied them.', ['How many factors of ' + t(v) + ' are there altogether?'], 'error Jo'); } },
          { id: 'e9b', sub: 'a ii', level: 'BEG', make: function (r, s) { var v = s.v, a = s.a, b = s.b;
            return expoPart('Give the correct answer for ' + t(pw(v, a) + '\\cdot ' + pw(v, b)) + '.', pw(v, a + b), [[eIs(v, a * b), 'mult-exp', 'That’s Jo’s answer. Add the exponents.']], LAW.prod + ': ' + t(pw(v, a + '+' + b) + '=' + pw(v, a + b)) + '.', ['Add the exponents.'], 'Jo fix'); } },
          { id: 'e9c', sub: 'b i', level: 'EMG', make: function (r, s) { var v = s.v, c1 = s.c1, c2 = s.c2, e1 = s.e1, e2 = s.e2;
            return mc(r, 'Lena writes ' + t(c1 + pw(v, e1) + '\\cdot ' + c2 + pw(v, e2) + '=' + c1 * c2 + pw(v, e1 * e2)) + '. What is the mistake?', [
              { html: 'The coefficients ' + t(c1 + '\\times ' + c2 + '=' + c1 * c2) + ' are right, but she multiplied the exponents instead of adding them.', right: true },
              { html: 'She should have added the coefficients.', why: 'Coefficients multiply: ' + t(c1 + '\\times ' + c2) + '. Her coefficient is right.' },
              { html: 'Both the coefficient and the exponent are wrong.', why: 'Check the coefficient: ' + t(c1 + '\\times ' + c2 + '=' + c1 * c2) + ' is right.' },
              { html: 'There is no mistake.', why: 'Count the factors of ' + t(v) + ': ' + e1 + ' and ' + e2 + ' more.' }],
              'Coefficients multiply (' + t(c1 * c2) + ', correct), but the exponents should be <b>added</b>: ' + t(e1 + '+' + e2 + '=' + (e1 + e2)) + '.', ['Check the coefficient and the exponent separately.'], 'error Lena'); } },
          { id: 'e9d', sub: 'b ii', level: 'BEG', make: function (r, s) { var v = s.v, c1 = s.c1, c2 = s.c2, e1 = s.e1, e2 = s.e2, p = prodMono([[c1, [[v, e1]]], [c2, [[v, e2]]]], { sep: '\\cdot ' });
            return expoPart('Give the correct answer for ' + t(p.tex) + '.', p.res, p.rows, p.sol, ['Multiply the coefficients; add the exponents.'], 'Lena fix'); } },
          { id: 'e9e', sub: 'c i', level: 'EMG', make: function (r, s) { var B = s.B, m = s.m, n = s.n;
            return mc(r, 'Devin writes ' + t(pw(B, m) + '\\cdot ' + pw(B, n) + '=' + pw(B * B, m + n)) + '. What is the mistake?', [
              { html: 'He multiplied the bases as well as adding the exponents. The base should stay ' + t(B) + '.', right: true },
              { html: 'He added the exponents; he should have multiplied them.', why: 'Adding the exponents is right. Look at the base.' },
              { html: 'He should have added the bases: ' + t(pw(B + B, m + n)) + '.', why: 'The base never changes in the Product Law.' },
              { html: 'There is no mistake.', why: 'Check with small numbers: is ' + t(pw(B, 1) + '\\cdot ' + pw(B, 1)) + ' equal to ' + t(pw(B * B, 2)) + '?' }],
              'The Product Law keeps the base: ' + t(pw(B, m) + '\\cdot ' + pw(B, n) + '=' + pw(B, m + n)) + '. Devin multiplied the bases (' + t(B + '\\times ' + B + '=' + B * B) + ').', ['What happens to the base in the Product Law?'], 'error Devin'); } },
          { id: 'e9f', sub: 'c ii', level: 'BEG', make: function (r, s) { var B = s.B, m = s.m, n = s.n, e = m + n;
            return P.math('Give the correct answer for ' + t(pw(B, m) + '\\cdot ' + pw(B, n)) + ' as a single power.', singlePow(B, e, [[m * n, 'mult-exp', 'Add the exponents.']]), pw(B, e), LAW.prod + ': ' + t(pw(B, m + '+' + n) + '=' + pw(B, e) + '=' + F(Math.pow(B, e))) + '.', ['Keep the base, add the exponents.'], 'Devin fix', { keys: 'expo', vars: [] }); } }] },
      { num: '10', stem: 'Simplify first, <b>then</b> substitute and evaluate. Substituting before simplifying is far more work.', parts: [
        { id: 'e10a', level: 'PRG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 4), r.int(2, 4), r.int(2, 3), r.int(1, 3), r.pick([-2, -2, -1, 2, 3])]; }, function (x) { return Math.abs(x[0] * x[1] * Math.pow(x[4], x[2] + x[3])) <= 2000; });
          return simpSub([[x[0], [['x', x[2]]]], [x[1], [['x', x[3]]]]], 'x', x[4], { sep: '\\cdot ' }); } },
        { id: 'e10b', level: 'PRG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 6), r.int(2, 3), r.int(1, 3), r.pick([2, 2, -2, 3, -1])]; }, function (x) { return Math.abs(x[0] * Math.pow(x[3], x[1] + x[2])) <= 2000; });
          return simpSub([[-x[0], [['a', x[1]]]], [1, [['a', x[2]]]]], 'a', x[3], { br: true }); } },
        { id: 'e10c', level: 'PRG', make: function (r) { var x = [r.int(2, 4), r.int(2, 4), r.int(2, 3), r.int(2, 4)];
          return simpSub([[x[0], [['m', 1]]], [x[1], [['m', x[2]]]], [1, [['m', x[3]]]]], 'm', r.pick([-1, -1, 1, -2].filter(function (z) { return Math.abs(x[0] * x[1] * Math.pow(z, 1 + x[2] + x[3])) <= 3000; })), { br: true }); } }] },

      /* ===================== Part C ===================== */
      { num: '11', section: 'Part C — Working Backwards and Rewriting Powers', stem: 'Find the missing exponent ' + t('n') + ' in each statement.', parts: [
        { id: 'e11a', level: 'PRG', make: function (r) { var a = r.int(2, 9), n = r.int(2, 9); return missExp('x', ['n', String(a)], a + n, n, a, 'n'); } },
        { id: 'e11b', level: 'PRG', make: function (r) { var a = r.int(3, 12), n = r.int(5, 15); return missExp('y', [String(a), 'n'], a + n, n, a, 'n'); } },
        { id: 'e11c', level: 'PRG', make: function (r) { var a = r.int(2, 6), b = r.int(2, 8), n = r.int(2, 8); return missExp('m', [String(a), 'n', String(b)], a + b + n, n, a + b, 'n'); } },
        { id: 'e11d', level: 'PRG', make: function (r) { var b = r.pick([2, 3, 5]), a = r.int(2, 6), n = r.int(2, 7); return missExp(String(b), [String(a), 'n'], a + n, n, a, 'n'); } }] },
      { num: '12', stem: 'These questions have more than one right answer.',
        shared: function (r) { var c = pickWhere(function () { return [r.int(2, 5), r.int(2, 5)]; }, function (c) { return c[0] !== c[1]; }), S = r.int(6, 12), c2 = r.int(2, 6), k = r.int(2, 9), S2 = r.int(6, 12);
          if (r.chance(0.2)) { c = [3, 2]; S = 9; c2 = 4; k = 7; S2 = 10; } return { c: c, S: S, c2: c2, k: k, S2: S2 }; },
        parts: [
        { id: 'e12a', sub: 'a i', level: 'PRG', make: function (r, s) { var c = s.c, S = s.S;
          return twoPairs(t(par(c[0] + pw('x', 'a')) + par(c[1] + pw('x', 'b')) + '=' + c[0] * c[1] + pw('x', S)) + '. Give <b>two</b> different pairs of whole numbers ' + t('(a,b)') + ' that work.', S, 'a', 'b', 'x', c[0] * c[1]); } },
        { id: 'e12b', sub: 'a ii', level: 'EMG', make: function (r, s) { var S = s.S, c = s.c, C = c[0] * c[1], L = t(par(c[0] + pw('x', 'a')) + par(c[1] + pw('x', 'b')) + '=' + C + pw('x', S));
          return mc(r, 'What rule must every correct pair ' + t('(a,b)') + ' in ' + L + ' follow?', [
            { html: t('a+b=' + S) + ' (the coefficients already give ' + t(c[0] + '\\times ' + c[1] + '=' + C) + ').', right: true },
            { html: t('a\\times b=' + S), why: 'Multiplying powers <b>adds</b> the exponents: the left side is ' + t(C + pw('x', 'a+b')) + '.' },
            { html: t('a+b=' + S) + ' and ' + t('a=b'), why: 'The exponents don’t have to be equal. Try ' + t('a=1, b=' + (S - 1)) + '.' },
            { html: t('a=' + c[0] + ', b=' + c[1]), why: 'Those are the coefficients. The exponents only have to add to ' + t(S) + '.' }],
            t(par(c[0] + pw('x', 'a')) + par(c[1] + pw('x', 'b')) + '=' + C + pw('x', 'a+b')) + ', so the only rule is ' + t('a+b=' + S) + '.', ['Simplify the left side with the Product Law.'], 'rule a+b'); } },
        { id: 'e12c', sub: 'b i', level: 'PRG', make: function (r, s) { var c = s.c2, k = s.k, S = s.S2;
          return numPart(t(par(c + pw('y', 'm')) + par('k' + pw('y', 'n')) + '=' + c * k + pw('y', S)) + '. Determine the value of ' + t('k') + '.', k, [[c * k - c, 'u2l1-k-coef', 'Coefficients multiply: ' + t(c + 'k=' + c * k) + ', so divide by ' + t(c) + '.'], [c * k * c, 'u2l1-k-coef', t(c + 'k=' + c * k) + ': divide, don’t multiply.']],
            'The coefficients multiply: ' + t(c + 'k=' + c * k) + ', so ' + t('k=' + k) + '.', ['Coefficients multiply. What times ' + t(c) + ' gives ' + t(c * k) + '?'], c + 'y^m * ky^n', { input: { before: t('k=') } }); } },
        { id: 'e12d', sub: 'b ii', level: 'PRG', make: function (r, s) { var c = s.c2, k = s.k, S = s.S2;
          return twoPairs(t(par(c + pw('y', 'm')) + par(k + pw('y', 'n')) + '=' + c * k + pw('y', S)) + '. Give <b>two</b> different pairs of whole numbers ' + t('(m,n)') + ' that work.', S, 'm', 'n', 'y', c * k); } }] },
      { num: '13', stem: 'Determine the missing coefficient ' + t('k') + ' and the missing exponent ' + t('n') + ' in each statement.', parts: [
        { id: 'e13a', level: 'ADV', make: function (r) { var k = r.int(2, 9), c = r.int(2, 6), a = r.int(2, 5), n = r.int(2, 8); if (r.chance(0.2)) { k = 8; c = 5; a = 3; n = 8; }
          return kn(par('k' + pw('x', a)) + par(c + pw('x', 'n')) + '=' + k * c + pw('x', a + n), k, n, c, a, k * c, a + n, 'x'); } },
        { id: 'e13b', level: 'ADV', make: function (r) { var k = r.int(2, 9), c = r.int(2, 5), a = r.int(2, 4), b = r.int(1, 3), n = r.int(2, 6);
          return kn(par('k' + pw('a', a) + 'b') + par(c + 'a' + pw('b', 'n')) + '=' + k * c + pw('a', a + 1) + pw('b', 1 + n), k, n, c, 1, k * c, 1 + n, 'b', 'The ' + t('a') + '’s check out: ' + t(pw('a', a) + '\\cdot a=' + pw('a', a + 1)) + '.'); } },
        { id: 'e13c', level: 'ADV', make: function (r) { var k = -r.int(2, 9), c = -r.int(2, 4), a = r.int(2, 6), n = r.int(2, 7);
          return kn(par(c + pw('m', a)) + par('k' + pw('m', 'n')) + '=' + k * c + pw('m', a + n), k, n, c, a, k * c, a + n, 'm'); } }] },
      { num: '14', stem: 'A number can often be written as a power in more than one way — for example, ' + t('64=2^{6}=4^{3}=8^{2}') + '.', parts: [
        { id: 'e14a', level: 'EMG', make: function (r) { return everyWay(r, r.pick([81, 16, 625, 512, 1296, 2401, 10000, 49, 36, 121, 144, 125, 343, 32, 27])); } },
        { id: 'e14b', level: 'PRG', make: function (r) { return everyWay(r, r.pick([256, 1024, 6561, 15625, 4096, 729, 64])); } },
        { id: 'e14c', level: 'PRG', make: function (r) { return everyWay(r, r.pick([729, 6561, 256, 15625, 46656, 1024, 64])); } },
        { id: 'e14d', level: 'EMG', make: function (r) { return everyWay(r, r.pick([100, 1000, 36, 49, 196, 225, 400, 900, 8, 216, 1728, 10000, 169, 289, 361, 128, 243, 3125])); } }] },
      { num: '15', stem: 'The Product Law needs <b>matching</b> bases. Rewrite both powers with the same base first (for example ' + t('4^{3}=4\\times 4\\times 4=(2\\times 2)(2\\times 2)(2\\times 2)=2^{6}') + '), then apply the Product Law and give a single power.', parts: [
        { id: 'e15a', level: 'ADV', make: function (r) { var o = r.pick([[2, 2, 4], [2, 3, 8], [3, 2, 9], [2, 4, 16], [5, 2, 25]]), a = r.int(2, 4), b = r.int(2, 6); if (r.chance(0.2)) { o = [2, 2, 4]; a = 3; b = 5; } return sameBase(o[0], [[o[2], a, o[1]], [o[0], b, 1]]); } },
        { id: 'e15b', level: 'ADV', make: function (r) { var o = r.pick([[3, 2, 3, 9, 27], [2, 2, 3, 4, 8], [2, 3, 2, 8, 4], [5, 2, 3, 25, 125], [2, 4, 3, 16, 8], [2, 2, 4, 4, 16]]), b = o[0] === 5 ? 2 : r.int(2, 4); if (r.chance(0.2)) { o = [3, 2, 3, 9, 27]; b = 2; } return sameBase(o[0], [[o[3], 1, o[1]], [o[4], b, o[2]]]); } },
        { id: 'e15c', level: 'ADV', make: function (r) { var o = r.pick([[2, 3, 2, 8, 4], [2, 2, 3, 4, 8], [3, 2, 3, 9, 27], [2, 4, 2, 16, 4], [2, 3, 4, 8, 16]]), a = r.int(2, 3), b = r.int(2, 3); if (r.chance(0.2)) { o = [2, 3, 2, 8, 4]; a = 2; b = 3; } return sameBase(o[0], [[o[3], a, o[1]], [o[4], b, o[2]]]); } },
        { id: 'e15d', level: 'ADV', make: function (r) { var o = r.pick([[5, 2, 25], [3, 2, 9], [2, 3, 8], [7, 2, 49], [10, 2, 100], [2, 2, 4], [3, 3, 27]]), b = r.int(2, 5); if (r.chance(0.2)) { o = [5, 2, 25]; b = 3; } return sameBase(o[0], [[o[2], 1, o[1]], [o[0], b, 1]]); } }] },

      /* ===================== Part D ===================== */
      { num: '16', section: 'Part D — Verifying, Applying and Stretching', stem: '<b>Does the law really work?</b>',
        shared: function (r) { var x = pickWhere(function () { return [r.pick([2, 2, 3, 4, 5, 10]), r.int(1, 4), r.int(2, 4)]; }, function (x) { return Math.pow(x[0], x[1] + x[2]) <= 5000 || x[0] === 10; }), ab = r.pick([[2, 1], [1, 2], [2, 2], [3, 1], [1, 3], [2, 3], [3, 2]]), q = r.pick([3, 3, 5]);
          if (r.chance(0.2)) { x = [2, 3, 4]; q = 3; } return { b: x[0], m: x[1], n: x[2], p: ab[0], q: ab[1], c: q }; },
        parts: [
          { id: 'e16a', level: 'BEG', make: function (r, s) { var b = s.b, m = s.m, n = s.n, V = Math.pow(b, m + n), fl = [fld('Left', t(pw(b, m) + '\\times ' + pw(b, n) + '=')), fld('Right', t(pw(b, m + n) + '='))];
            return P.fields('Evaluate each side of ' + t(pw(b, m) + '\\times ' + pw(b, n) + '=' + pw(b, m + n)) + ' separately.', fl, [numCk(V, [[Math.pow(b, m * n), 'mult-exp', 'Work out each power, then multiply: ' + t(Math.pow(b, m) + '\\times ' + Math.pow(b, n)) + '.']]), numCk(V, [[b * (m + n), 'times-exp', t(pw(b, m + n)) + ' means ' + t(b) + ' multiplied by itself ' + (m + n) + ' times.']])],
              [String(V), String(V)], t(F(V)) + ' and ' + t(F(V)), t(pw(b, m) + '\\times ' + pw(b, n) + '=' + Math.pow(b, m) + '\\times ' + Math.pow(b, n) + '=' + F(V)) + ' and ' + t(pw(b, m + n) + '=' + F(V)) + '. They match.', ['Evaluate each power first.'], 'verify product law'); } },
          { id: 'e16b', level: 'EMG', make: function (r, s) { var p = s.p, q = s.q, c = s.c, D = 2 * c, L = Math.pow(2, p) * Math.pow(c, q), R = Math.pow(D, p + q), fl = [fld('Left', t(vt(2, p) + '\\times ' + vt(c, q) + '=')), fld('Right', t(pw(D, p + q) + '='))];
            return P.fields('Now test whether ' + t(vt(2, p) + '\\times ' + vt(c, q) + '=' + pw(D, p + q)) + ' by evaluating both sides.', fl, [numCk(L, [[R, 'u2l1-mult-base', 'Evaluate the left side as it is written: ' + t(Math.pow(2, p) + '\\times ' + Math.pow(c, q)) + '.']]), numCk(R, [[L, 'u2l1-mult-base', 'Evaluate ' + t(pw(D, p + q)) + ' itself: ' + t(rep(D, p + q)) + '.'], [D * (p + q), 'times-exp', t(pw(D, p + q)) + ' means ' + t(D) + ' multiplied by itself.']])],
              [String(L), String(R)], t(L) + ' and ' + t(F(R)), t(vt(2, p) + '\\times ' + vt(c, q) + '=' + Math.pow(2, p) + '\\times ' + Math.pow(c, q) + '=' + L) + ' but ' + t(pw(D, p + q) + '=' + F(R)) + '. They don’t match.', ['Evaluate each power first.'], 'test 2^' + p + c + '^' + q + '=' + D + '^' + (p + q)); } },
          { id: 'e16c', level: 'EMG', make: function (r) {
            return mc(r, 'What does your result in (b) say about the Product Law?', [
              { html: 'The Product Law applies only when the bases are identical — you may never multiply the bases together.', right: true },
              { html: 'The Product Law is wrong.', why: 'Part (a) shows it works when the bases match. Part (b) used it on different bases.' },
              { html: 'You must multiply the exponents when the bases are different.', why: 'With different bases no law combines the powers — evaluate each one separately.' },
              { html: 'It works for different bases if you add the bases instead.', why: t('2+3=5') + ', and ' + t(pw(5, 2)) + ' doesn’t match either. Different bases can’t be combined.' }],
              'When the bases match the law works (part a). When they don’t (part b), adding the exponents and multiplying the bases gives the wrong value. The Product Law needs identical bases.', ['Compare (a) and (b): what is different about the bases?'], 'what product law needs'); } }] },
      { num: '17', stem: function (sh) { return 'A rectangle has width ' + t(sh.c1 + pw('x', sh.a)) + ' and length ' + t(sh.c2 + pw('x', sh.b)) + '.'; },
        shared: function (r) { var c1 = r.int(2, 5), c2 = r.int(2, 6), a = r.int(1, 3), b = r.int(2, 4); if (r.chance(0.2)) { c1 = 3; c2 = 5; a = 2; b = 4; } return { c1: c1, c2: c2, a: a, b: b }; },
        parts: [
          { id: 'e17', level: 'PRG', make: function (r, s) { var C = s.c1 * s.c2, E = s.a + s.b, V = C * Math.pow(2, E), fl = [fld('Area', 'area as a single term:', true, ['x']), fld('Value', 'area when ' + t('x=2') + ':')];
            var p = prodMono([[s.c1, [['x', s.a]]], [s.c2, [['x', s.b]]]], { br: true });
            return P.fields('Write an expression for its area as a single term, then determine the area when ' + t('x=2') + '.', fl, [K.expo(p.res, { diag: dg(p.rows) }), numCk(V, [[C * 2 * E, 'times-exp', t(pw(2, E)) + ' means ' + t(2) + ' multiplied by itself ' + E + ' times.'], [Math.pow(C * 2, E), 'u2l1-coef-squared', 'Only ' + t('x') + ' is raised to the power ' + t(E) + '. Work out ' + t(pw(2, E) + '=' + Math.pow(2, E)) + ', then multiply by ' + t(C) + '.']])],
              [p.res, String(V)], t('A=' + p.res) + '; ' + t(F(V)) + ' square units', 'Area = width × length = ' + t(p.tex + '=' + p.res) + '. When ' + t('x=2') + ': ' + t(C + '\\times ' + pw(2, E) + '=' + C + '\\times ' + Math.pow(2, E) + '=' + F(V)) + ' square units.',
              ['Area of a rectangle = width × length. Simplify first, then substitute.'], 'rectangle area'); } }] },
      { num: '18', stem: function (sh) { return 'A cube has edge length ' + t(sh.c + vt('m', sh.a)) + '.'; },
        shared: function (r) { var o = r.pick([[2, 2, 3], [2, 1, 3], [3, 1, 2], [2, 2, 2], [3, 2, 2], [2, 3, 2], [4, 1, 2], [2, 1, 4], [5, 1, 2], [3, 1, 3], [4, 2, 2], [2, 1, 5], [3, 1, 4], [5, 2, 1], [2, 4, 1], [4, 1, 3], [6, 1, 2], [3, 3, 1]]); if (r.chance(0.2)) o = [2, 2, 3]; return { c: o[0], a: o[1], m: o[2] }; },
        parts: [
          { id: 'e18a', level: 'ADV', make: function (r, s) { var c = s.c, a = s.a, fa = c * c + pw('m', 2 * a), vo = c * c * c + pw('m', 3 * a), fl = [fld('Face area', 'area of one face:', true, ['m']), fld('Volume', 'volume:', true, ['m'])];
            return P.fields('Write an expression for the area of one face and one for the volume.', fl, [K.expo(fa, { diag: dg([[eIs('m', a * a), 'mult-exp', 'Face area = edge × edge: <b>add</b> the exponents.'], [cIs(2 * c), 'coef-added', 'Coefficients multiply: ' + t(c + '\\times ' + c) + '.'], [both(cIs(c), eIs('m', 2 * a)), 'u2l1-coef-not-squared', 'Multiply the whole edge by itself: ' + t(par(c + vt('m', a)) + par(c + vt('m', a))) + '. The ' + t(c) + ' is used twice.']]) }),
              K.expo(vo, { diag: dg([[both(cIs(c * c), eIs('m', 2 * a)), 'u2l1-face', 'That is the face area. Volume = edge × edge × edge.'], [cIs(3 * c), 'coef-added', 'Coefficients multiply: ' + t(c + '\\times ' + c + '\\times ' + c) + '.'], [both(cIs(c), eIs('m', 3 * a)), 'u2l1-coef-not-squared', 'The ' + t(c) + ' is part of every edge, so it is multiplied three times.']]) })],
              [fa, vo], t(fa) + ' and ' + t(vo), 'Face area = ' + t(par(c + vt('m', a)) + par(c + vt('m', a)) + '=' + fa) + '. Volume = ' + t(par(c + vt('m', a)) + par(c + vt('m', a)) + par(c + vt('m', a)) + '=' + vo) + '.', ['A face is a square (edge × edge); the volume is edge × edge × edge.'], 'cube ' + c + 'm^' + a); } },
          { id: 'e18b', level: 'ADV', make: function (r, s) { var c = s.c, a = s.a, m = s.m, E = c * Math.pow(m, a), FA = E * E, VO = E * E * E, fl = [fld('Face area', 'face area when ' + t('m=' + m) + ':'), fld('Volume', 'volume when ' + t('m=' + m) + ':')];
            return P.fields('Evaluate both when ' + t('m=' + m) + '.', fl, [numCk(FA, [[c * Math.pow(m, 2 * a), 'u2l1-coef-not-squared', 'The coefficient is ' + t(c * c) + ', not ' + t(c) + '.']]), numCk(VO, [[FA, 'u2l1-face', 'That is the face area.'], [c * Math.pow(m, 3 * a), 'u2l1-coef-not-squared', 'The coefficient is ' + t(c * c * c) + '.']])],
              [String(FA), String(VO)], t(F(FA)) + ' square units and ' + t(F(VO)) + ' cubic units', 'Face area ' + t(c * c + pw('(' + m + ')', 2 * a) + '=' + c * c + '\\times ' + F(Math.pow(m, 2 * a)) + '=' + F(FA)) + ' square units. Volume ' + t(c * c * c + pw('(' + m + ')', 3 * a) + '=' + c * c * c + '\\times ' + F(Math.pow(m, 3 * a)) + '=' + F(VO)) + ' cubic units. (Check: the edge is ' + t(E) + ', and ' + t(pw(E, 3) + '=' + F(VO)) + '.)',
              ['Substitute into your simplified expressions from (a).'], 'cube values'); } }] },
      { num: '19', stem: '<b>Stretch.</b>', parts: [
        { id: 'e19a', level: 'PRG', make: function (r) { var b = r.pick([2, 2, 3]), x = pickWhere(function () { return [r.int(5, 15), r.int(5, 15), r.int(10, 25)]; }, function (x) { var e = x[0] + x[1] - x[2]; return x[2] > x[0] && x[2] > x[1] && e >= 2 && e <= (b === 2 ? 6 : 4); }); if (r.chance(0.2)) { b = 2; x = [10, 15, 20]; }
          var e = x[0] + x[1] - x[2], V = Math.pow(b, e);
          return lawEval(pw(b, x[0]) + '\\times ' + pw(b, x[1]) + '\\div ' + pw(b, x[2]), b, String(b), e, V, [[x[0] + x[1] + x[2], 'law-added', 'Dividing powers <b>subtracts</b> the exponents.'], [x[0] + x[1], 'count', 'Now divide by ' + t(pw(b, x[2])) + ': subtract ' + t(x[2]) + '.']],
            'Multiplying adds and dividing subtracts the exponents: ' + t(pw(b, x[0] + '+' + x[1] + '-' + x[2]) + '=' + pw(b, e) + '=' + V) + '.', ['Multiplying adds the exponents; dividing (the preview law: ' + t('a^{m}\\div a^{n}=a^{m-n}') + ') subtracts them.'], 'stretch ' + b + '^' + x.join(',')); } },
        { id: 'e19b', level: 'MAS', make: function (r) { return compareBlocks(r); } }] }
    ]
  });

  /* ---------- part makers that use the lesson data ---------- */
  function withDiag(p, tgt, extraRows) { // add rows in front of an expo part's diagnosis
    var base = p.check, T = px(tgt);
    p.check = function (resp) { var a = ex.parse(resp); if (a.ok && !same(a.ast, T)) { var an = ex.analyze(a.ast); for (var i = 0; i < extraRows.length; i++) if (extraRows[i][0](an)) return wrong(extraRows[i][1], extraRows[i][2]); } return base(resp); };
    return p;
  }
  function subPart(v, n, a) {
    var val = Math.pow(a, n), rows = [[a * n, 'times-exp', 'The exponent isn’t a multiplier: ' + t(pw(v, n)) + ' means ' + t(v) + ' multiplied by itself ' + n + ' times.']];
    if (a < 0) rows.push([-val, 'fence', 'Substitute the whole value, sign included, in brackets: ' + t(pw('(' + a + ')', n)) + '. ' + (n % 2 ? 'An odd number of negative factors gives a negative.' : 'An even number of negative factors gives a positive.')]);
    return numPart(t(pw(v, n) + ',\\quad ' + v + '=' + a), val, rows, t(pw(v, n) + '=' + pw('(' + a + ')', n) + '=' + rep(a < 0 ? '(' + a + ')' : a, n, a < 0 ? '' : '\\times ') + '=' + F(val)) + '.',
      ['Replace ' + t(v) + ' with ' + t(a < 0 ? '(' + a + ')' : a) + ' — in brackets if it is negative — then multiply.'], v + '^' + n + ', ' + v + '=' + a);
  }
  function prodEval(bs, es, opt) {
    var b = bs[0], e = es.reduce(function (x, y) { return x + y; }, 0), V = Math.pow(b, e), tex = es.map(function (x) { return opt && opt.bare1 && x === 1 ? String(b) : pw(b, x); }).join('\\times ');
    var prod = es.reduce(function (x, y) { return x * y; }, 1), rows = []; if (prod !== e) rows.push([prod, 'mult-exp', 'Product Law: when you multiply powers with the same base, <b>add</b> the exponents.']);
    if (es.indexOf(1) >= 0) rows.push([e - 1, 'no-one', (opt && opt.bare1 ? 'A base written with no exponent has the exponent 1: ' + t(b + '=' + pw(b, 1)) + '. It' : t(pw(b, 1)) + ' still') + ' counts: it is one factor of ' + t(b) + '.']);
    return lawEval(tex, b, String(b), e, V, rows, LAW.prod + ': ' + t(tex + '=' + pw(b, es.join('+')) + '=' + pw(b, e) + '=' + F(V)) + '.', ['Write out the factors: how many ' + t(b) + 's are multiplied altogether?'], plain(tex));
  }
  function missExp(v, exps, total, ans, known, unk) {
    unk = unk || 'x';
    var tex = exps.map(function (e) { return pw(v, e); }).join('\\times ') + '=' + pw(v, total);
    return numPart(t(tex), ans, [[total + known, 'u2l1-sum-wrong', 'The exponents on the left must <b>add</b> to ' + t(total) + '. What do you add to ' + t(known) + ' to get ' + t(total) + '?'], [total, 'count', 'That is the total. Take away the exponents you already have.'], [total / known, 'u2l1-sum-wrong', 'Multiplying powers adds the exponents: ' + t(known + '+' + unk + '=' + total) + '.']],
      LAW.prod + ': the left side is ' + t(pw(v, exps.join('+'))) + ', so ' + t(exps.join('+') + '=' + total) + ' and ' + t(unk + '=' + ans) + '.', ['Use the Product Law on the left side, then match the exponents.'], tex.replace(/\\times/g, '*'), { input: { before: t(unk + '=') } });
  }
  function negProd(k, a, b, inside) {
    var tex, val, other;
    if (inside) { tex = (a === 1 ? '(-' + k + ')' : pw(par('-' + k), a)) + '\\times ' + pw(par('-' + k), b); val = Math.pow(-k, a + b); other = -Math.pow(k, a + b); }
    else { tex = (a === 1 ? '-' + k : '-' + pw(k, a)) + '\\times ' + pw(k, b); val = -Math.pow(k, a + b); other = Math.pow(-k, a + b); }
    var sol = inside ? 'Both bases are ' + t('-' + k) + ': ' + t(pw('(-' + k + ')', a + '+' + b) + '=' + pw('(-' + k + ')', a + b) + '=' + F(val)) + ' (' + (a + b) + ' negative factors: ' + ((a + b) % 2 ? 'odd, so negative' : 'even, so positive') + ').'
      : 'Only the first power has a minus sign in front: ' + t('-(' + (a === 1 ? k : pw(k, a)) + ')\\times ' + pw(k, b) + '=-(' + Math.pow(k, a) + '\\times ' + Math.pow(k, b) + ')=' + F(val)) + '.';
    var rows = []; if (other !== val) rows.push([other, 'fence', inside ? 'Every factor is ' + t('(-' + k + ')') + '. Count the negative factors: ' + (a + b) + ' of them.' : 'The minus sign is outside the first power, so it is never raised to the power. Work out ' + t((a === 1 ? k : pw(k, a)) + '\\times ' + pw(k, b)) + ', then make it negative.']);
    rows.push([Math.pow(k, a * b) * (val < 0 ? -1 : 1), 'mult-exp', 'Multiplying powers <b>adds</b> the exponents.']);
    return numPart(t(tex), val, rows, sol, ['Count the negative factors: an even number gives a positive answer, an odd number a negative one.'], plain(tex));
  }
  function simpSub(facs, v, x, opt) {
    var m = prodMono(facs, opt), C = m.C, E = m.E[v], V = C * Math.pow(x, E), xs = x < 0 ? '(' + x + ')' : String(x);
    var fl = [fld('Simplified', 'simplified:', true, [v]), fld('Value', 'value when ' + t(v + '=' + x) + ':')];
    return P.fields(t(m.tex) + ', ' + t(v + '=' + x), fl, [K.expo(m.res, { diag: dg(m.rows) }), numCk(V, [[-V, 'sign', 'Substitute ' + t(xs) + ' in brackets: ' + (E % 2 ? 'an odd power of a negative is negative.' : 'an even power of a negative is positive.')], [C * x * E, 'times-exp', t(pw(xs, E)) + ' means ' + t(xs) + ' multiplied by itself ' + E + ' times.'], [Math.pow(C * x, E), 'u2l1-coef-squared', 'Only ' + t(v) + ' is raised to the power ' + t(E) + ', not the coefficient.']])],
      [m.res, String(V)], t(m.res) + '; ' + t(F(V)), m.sol + ' Then ' + t(cT(C, pw(xs, E)) + '=' + (C === 1 ? '' : C === -1 ? '-' : C + '\\times ') + (Math.pow(x, E) < 0 ? '(' + F(Math.pow(x, E)) + ')' : F(Math.pow(x, E))) + '=' + F(V)) + '.',
      ['Simplify to a single term first. Then substitute ' + t(xs) + ', in brackets.'], plain(m.tex) + ', ' + v + '=' + x);
  }
  function twoPairs(prompt, S, a, b, v, C) {
    var keyP = [[1, S - 1], [2, S - 2]];
    return { prompt: prompt, input: { type: 'pairs', start: 2 }, key: keyP.map(function (p) { return [String(p[0]), String(p[1])]; }), answer: 'any two pairs with ' + t(a + '+' + b + '=' + S) + ', e.g. ' + keyP.map(function (p) { return t('(' + p[0] + ',' + p[1] + ')'); }).join(' and '), text: 'pairs ' + a + '+' + b + '=' + S,
      check: function (resp) {
        if (!resp || !resp.length) return form('empty', 'Write your first pair in the boxes.');
        var got = [];
        for (var i = 0; i < resp.length; i++) {
          if (resp[i][0] === '' || resp[i][1] === '') return form('blank', 'Each pair needs two numbers.');
          var x = Number(String(resp[i][0]).replace(/\s/g, '')), y = Number(String(resp[i][1]).replace(/\s/g, ''));
          if (!isFinite(x) || !isFinite(y)) return form('blank', 'Each pair needs two whole numbers.');
          if (x < 0 || y < 0 || x % 1 || y % 1) return wrong('not-whole', t(a) + ' and ' + t(b) + ' must be whole numbers: ' + t('0, 1, 2, \\ldots'));
          got.push([x, y]);
        }
        var keys = got.map(function (p) { return p.join(','); });
        for (i = 0; i < keys.length; i++) if (keys.indexOf(keys[i]) !== i) return form('dup', 'You listed ' + t('(' + keys[i] + ')') + ' twice — the pairs must be different.');
        for (i = 0; i < got.length; i++) if (got[i][0] + got[i][1] !== S) return wrong(got[i][0] * got[i][1] === S ? 'mult-exp' : 'pair-fails', 'Test ' + t('(' + got[i][0] + ',' + got[i][1] + ')') + ': the left side becomes ' + t(C + pw(v, got[i][0] + '+' + got[i][1]) + '=' + C + pw(v, got[i][0] + got[i][1])) + ', not ' + t(C + pw(v, S)) + '.');
        if (got.length < 2) return wrong('one-pair', 'That pair works! The question asks for <b>two</b> different pairs.');
        return ok();
      },
      solution: 'The coefficients already multiply to ' + t(C) + '. The Product Law makes the left side ' + t(C + pw(v, a + '+' + b)) + ', so any whole numbers with ' + t(a + '+' + b + '=' + S) + ' work, for example ' + t('(1,' + (S - 1) + ')') + ', ' + t('(4,' + (S - 4) + ')') + ' or ' + t('(' + Math.floor(S / 2) + ',' + (S - Math.floor(S / 2)) + ')') + '.',
      hints: ['Simplify the left side: the exponents add. Which pairs add to ' + t(S) + '?'], good: [[['1', String(S - 1)], [String(S - 1), '1']]], bad: [[['2', '2'], ['3', '3']], [['1', String(S - 1)]]] };
  }
  function kn(lhs, k, n, c, a, C, E, v, note) {
    var fl = [fld('k', t('k=')), fld('n', t('n='))];
    return P.fields(t(lhs), fl, [numCk(k, [[C - c, 'u2l1-k-coef', 'Coefficients multiply: ' + t(signed(c) + '\\times k=' + C) + '. Divide.'], [C * c, 'u2l1-k-coef', t(signed(c) + '\\times k=' + C) + ': divide, don’t multiply.'], [-k, 'sign', 'Check the sign: ' + t(signed(c) + '\\times(' + (-k) + ')') + ' is ' + t(-k * c) + '.']]),
      numCk(n, [[E + a, 'u2l1-sum-wrong', 'The exponents of ' + t(v) + ' add to ' + t(E) + ': subtract the one you know.'], [E, 'count', 'That is the total exponent. Subtract ' + t(a) + '.']])],
      [String(k), String(n)], t('k=' + k) + ', ' + t('n=' + n), 'Coefficients multiply: ' + t(signed(c) + 'k=' + C) + ', so ' + t('k=' + k) + '. Exponents of ' + t(v) + ' add: ' + t(a + '+n=' + E) + ', so ' + t('n=' + n) + '.' + (note ? ' ' + note : ''),
      ['Match the coefficients (they multiply) and the exponents (they add) separately.'], lhs.replace(/\\left|\\right/g, ''));
  }
  /* rewrite each power with base B, then one power. items: [[shownBase, shownExp, powerOfB]] */
  function sameBase(B, items) {
    var tex = items.map(function (it) { return it[1] === 1 ? String(it[0]) : pw(it[0], it[1]); }).join('\\times '), E = 0, steps = [], wrongE = 0;
    items.forEach(function (it) { E += it[1] * it[2]; wrongE += it[1] + (it[2] > 1 ? 0 : 0); steps.push(pw(B, it[1] * it[2])); });
    var naive = items.reduce(function (s, it) { return s + it[1]; }, 0), rows = []; if (naive !== E) rows.push([naive, 'u2l1-not-rewritten', 'First rewrite every power with base ' + t(B) + ': ' + items.filter(function (it) { return it[2] > 1; }).map(function (it) { return t(it[0] + '=' + pw(B, it[2])) + ', so ' + t((it[1] === 1 ? String(it[0]) : pw(it[0], it[1])) + '=' + pw(B, it[1] * it[2])); }).join('; ') + '.']);
    var expl = items.filter(function (it) { return it[2] > 1; }).map(function (it) { return t((it[1] === 1 ? String(it[0]) : pw(it[0], it[1])) + '=' + (it[1] === 1 ? rep(B, it[2]) : rep('(' + rep(B, it[2], '\\times ') + ')', it[1], '')) + '=' + pw(B, it[1] * it[2])); }).join('; ');
    return P.math(t(tex), singlePow(B, E, rows), pw(B, E), expl + '. So ' + t(tex + '=' + steps.join('\\times ') + '=' + pw(B, E)) + '.', ['Write each number as a power of ' + t(B) + ' first — expanding into repeated multiplication is the safest way.'], plain(tex), { keys: 'expo', vars: [] });
  }
  function compareBlocks(r) {
    var o = r.pick([[2, 3, 3, 2], [2, 3, 3, 2], [2, 5, 3, 3], [2, 7, 5, 3], [3, 5, 4, 4], [2, 4, 5, 2], [3, 2, 2, 3], [5, 2, 2, 5], [3, 3, 5, 2], [2, 4, 3, 3]]), k = r.int(4, 12);
    if (o[0] === 2 && o[1] === 3 && r.chance(0.4)) k = 10;
    var a = o[0], p = o[1], b = o[2], q = o[3], A = Math.pow(a, p), B = Math.pow(b, q), L = pw(a, p * k), R = pw(b, q * k), big = A > B ? L : R;
    var fl = [fld('First', t(L + '=\\left(\\square\\right)^{' + k + '}') + ' with ' + t('\\square=')), fld('Second', t(R + '=\\left(\\square\\right)^{' + k + '}') + ' with ' + t('\\square=')), fld('Larger', 'the larger number is', true)];
    return P.fields('Without a calculator, decide which is larger: ' + t(L) + ' or ' + t(R) + '. First regroup each one into ' + t(k) + ' equal blocks.', fl,
      [numCk(A, [[a * p, 'times-exp', 'Each block is ' + t(pw(a, p)) + ' — ' + t(a) + ' multiplied by itself ' + p + ' times.'], [p, 'swapped', 'Each block holds ' + p + ' factors of ' + t(a) + ': what is their product?']]), numCk(B, [[b * q, 'times-exp', 'Each block is ' + t(pw(b, q)) + '.'], [q, 'swapped', 'Each block holds ' + q + ' factors of ' + t(b) + ': what is their product?']]),
        function (resp) { var x = K.read(resp); if (x.res) return x.res; if (same(x.ast, px(big))) return ok(); if (same(x.ast, px(A > B ? R : L))) return wrong('value', 'Compare the blocks: ' + t(pw(A, k)) + ' versus ' + t(pw(B, k)) + '. Both have ' + k + ' factors — which factor is bigger?'); return wrong('value', 'Type one of the two powers, e.g. ' + t(L) + '.'); }],
      [String(A), String(B), big], t(L + '=' + pw(A, k)) + ', ' + t(R + '=' + pw(B, k)) + '; ' + t(big) + ' is larger',
      t(L) + ' is ' + k + ' blocks of ' + t(pw(a, p) + '=' + A) + ', so ' + t(L + '=' + pw(A, k)) + '. ' + t(R) + ' is ' + k + ' blocks of ' + t(pw(b, q) + '=' + B) + ', so ' + t(R + '=' + pw(B, k)) + '. Both are products of ' + k + ' factors, and every factor of ' + t(big) + ' is bigger (' + t(Math.max(A, B) + '>' + Math.min(A, B)) + '), so ' + t(big) + ' is larger — even though ' + (big === L ? (p * k < q * k ? 'its exponent is smaller' : 'its base is smaller') : (q * k < p * k ? 'its exponent is smaller' : 'its base is smaller')) + '.',
      ['Split ' + t(L) + ' into ' + k + ' equal groups: each group is ' + t(pw(a, p)) + '. Do the same for ' + t(R) + '.', 'Two products with the same number of factors: the one with the bigger factors is bigger.'], 'compare ' + L + ' vs ' + R);
  }
})(window);
