/* Math 15 · Unit 2 · Lesson 2 — The Quotient Law & Power of a Power (AN3)
 * Assignment 2 (u2_L02.tex, Questions 1–14) and the Lesson 2 Extra Practice (u2_EP02.tex, Questions 1–22).
 * Every part is a generator that keeps the booklet question's idea and difficulty and changes the numbers and letters
 * (the booklet's own numbers are among the possible values where practical). Keys come from a small monomial algebra
 * (mMul / mDiv / mPow), so a key is always the simplified question. Helpers and diagnoses follow Math 10C Unit 2.
 * Conversions: "fill in the blanks" → number boxes; "explain" → counting boxes plus a multiple choice whose options are
 * reasons; "name the mistake and correct it" → a multiple-choice diagnosis plus the corrected answer; "verify" → the
 * values in boxes. No calculator: small bases.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 21 (a three-law quotient with a coefficient, two letters). */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, ex = HW.ex, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'mult-exp': 'Multiplied exponents (should add)', 'add-exp': 'Added exponents (should multiply)', 'div-exp': 'Divided exponents (should subtract)', 'law-added': 'Added exponents where the law multiplies or subtracts',
    'no-one': 'Forgot the invisible exponent 1', 'coef-not-raised': 'Didn’t raise the coefficient', 'coef-times': 'Multiplied coefficient by the exponent', 'coef-sub': 'Subtracted coefficients instead of dividing',
    'coef-added': 'Added coefficients instead of multiplying', 'times-exp': 'Multiplied base by exponent', 'single-power': 'Not written as a single power', 'as-power': 'Not written as a power',
    'part-base': 'Took only part of the base', 'swapped': 'Swapped base and exponent', count: 'Wrong number of factors', subtracted: 'Subtracted instead of dividing', multiplied: 'Multiplied instead of dividing',
    'divided-total': 'Divided by the wrong number', 'zero-is-0': 'Thought a⁰ = 0', 'zero-is-base': 'Thought a⁰ = a',
    'u2l2-pow-exp': 'Power of a power: raised an exponent to a power instead of multiplying', 'u2l2-sub-x': 'Missing exponent: subtracted the wrong way',
    'u2l2-no-pp': 'Didn’t clear the bracket (power of a power) first', 'u2l2-flip': 'Quotient upside down (bottom exponent minus top)', 'u2l2-coef-unreduced': 'Fraction coefficient not reduced / divided the wrong way',
    'u2l2-sa-cube': 'Surface area: used the volume (cubed) instead of the area (squared)', 'u2l2-ratio-flip': 'Ratio written the wrong way round', 'u2l2-larger-by': 'Gave the difference of the values instead of a power of 2',
    'u2l2-ab-swap': 'Two unknowns: swapped the inner and outer exponents', 'u2l2-wrong-law': 'Used the wrong exponent law (mixed up product, quotient, power of a power)'
  });
  HW.addPartial({ 'u2l2-pow-exp': 'b', 'u2l2-sub-x': 'b', 'u2l2-no-pp': 'b', 'u2l2-flip': 'b', 'u2l2-coef-unreduced': 's', 'u2l2-sa-cube': 'b', 'u2l2-ratio-flip': 's', 'u2l2-larger-by': 'b', 'u2l2-ab-swap': 'b', 'u2l2-wrong-law': 'b' });

  /* ---------- small helpers ---------- */
  var LET = 'abcdhkmnpqrstuvwxyz'.split('');
  function lets(r, k) { return r.sample(LET, k); }
  function pw(b, e) { return b + '^{' + e + '}'; }
  function par(s) { return '\\left(' + s + '\\right)'; }
  function fr(p, q) { return '\\frac{' + p + '}{' + q + '}'; }
  function dfr(p, q) { return '\\dfrac{' + p + '}{' + q + '}'; }
  function rep(f, n, sep) { var a = []; for (var i = 0; i < n; i++) a.push(f); return a.join(sep == null ? '\\times ' : sep); }
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function px(s) { var p = ex.parse(s); if (!p.ok) throw new Error('bad TeX ' + s + ' (' + p.code + ')'); return p.ast; }
  function varsOf(a, acc) { (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'var') acc[x.n] = 1; ['a', 'b', 'n'].forEach(function (k) { if (x[k]) w(x[k]); }); })(a); return acc; }
  function same(a, b) { var vs = Object.keys(varsOf(b, varsOf(a, {}))); if (!vs.length) return ex.eq(ex.value(a), ex.value(b)); return ex.equiv(a, b, vs, 6); }
  function strip(a) { while (a && a.t === 'paren') a = a.a; return a; }
  function pickWhere(gen, test) { for (var i = 0; i < 3000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u2l2: pickWhere failed'); }
  function signed(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function vt(v, e) { return e === 1 ? v : pw(v, e); }
  function cT(c, s) { return s ? (c === 1 ? '' : c === -1 ? '-' : String(c)) + s : String(c); }
  function plain(s) { return String(s).replace(/\\left|\\right/g, '').replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)').replace(/\\times/g, '×').replace(/\\div/g, '÷').replace(/\\cdot/g, '·').replace(/\\[a-z]+/g, '').replace(/[{}]/g, '').replace(/\s+/g, ''); }

  /* ---------- monomials: { c: [p, q], e: { letter: exponent } } (negative exponent = in the denominator) ---------- */
  function M(c, ps) { var e = {}; (ps || []).forEach(function (p) { e[p[0]] = (e[p[0]] || 0) + p[1]; }); return { c: Array.isArray(c) ? c : [c, 1], e: e }; }
  function nrm(c) { var g = gcd(c[0], c[1]) || 1, s = c[1] < 0 ? -1 : 1; return [s * c[0] / g, s * c[1] / g]; }
  function mMul(a, b) { var e = {}; [a, b].forEach(function (m) { Object.keys(m.e).forEach(function (v) { e[v] = (e[v] || 0) + m.e[v]; }); }); return { c: nrm([a.c[0] * b.c[0], a.c[1] * b.c[1]]), e: e }; }
  function mInv(a) { var e = {}; Object.keys(a.e).forEach(function (v) { e[v] = -a.e[v]; }); return { c: nrm([a.c[1], a.c[0]]), e: e }; }
  function mDiv(a, b) { return mMul(a, mInv(b)); }
  function mPow(a, n) { var e = {}; Object.keys(a.e).forEach(function (v) { e[v] = a.e[v] * n; }); return { c: nrm([Math.pow(a.c[0], n), Math.pow(a.c[1], n)]), e: e }; }
  function vs(m, sgn) { return Object.keys(m.e).sort().filter(function (v) { return sgn * m.e[v] > 0; }).map(function (v) { return vt(v, sgn * m.e[v]); }).join(''); }
  /* simplified TeX of a monomial (positive exponents, sign in front of a fraction) */
  function mTex(m) {
    var p = m.c[0], q = m.c[1], top = vs(m, 1), bot = vs(m, -1), neg = p < 0; p = Math.abs(p);
    if (q === 1 && !bot) return (neg ? '-' : '') + cT(p, top);
    var num = (p === 1 && top ? '' : String(p)) + top, den = (q === 1 && bot ? '' : String(q)) + bot;
    return (neg ? '-' : '') + fr(num || '1', den);
  }
  /* a monomial as written in a question: c and [[letter, exp]] in order */
  function mT(c, ps) { return cT(c, ps.map(function (p) { return vt(p[0], p[1]); }).join('')); }

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
        if (ex.eq(b, bv)) { for (var i = 0; i < (rows || []).length; i++) if (ex.eq(x, rows[i][0])) return wrong(rows[i][1], rows[i][2]); return wrong('exp', 'Keep the base ' + t(signed(bv)) + ' and check the exponent. Product Law: add. Quotient Law: subtract. Power of a Power: multiply.'); }
        if (!ex.eq(Math.abs(b), Math.abs(bv)) && ex.eq(x, e)) return wrong('base', 'The exponent laws change only the exponent — keep the base the same.');
      }
      if (ex.eq(a.val, -V)) return wrong('sign', signHint || 'Check the sign.');
      return wrong('value', null);
    };
  }
  /* the power itself: base and exponent compared part by part */
  function powerEq(baseTex, expTex) {
    var B = px(baseTex), E = px(expTex);
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var top = strip(a.ast);
      if (top.t !== 'pow') { if (same(a.ast, px(pw(baseTex, expTex)))) return form('as-power', 'Right value — but write what the Quotient Law gives: a base with an exponent.'); return wrong('value', 'Keep the base and subtract the exponents.'); }
      if (same(top.a, B) && same(top.b, E)) return ok();
      return wrong('value', 'Keep the base ' + t(baseTex) + ' and subtract the exponents.');
    };
  }
  function dg(rows) { return function (an) { for (var i = 0; i < rows.length; i++) if (rows[i][0](an)) return { code: rows[i][1], hint: rows[i][2] }; return null; }; }
  function eIs(v, n) { return function (an) { var e = an.vars && an.vars[v]; return !!e && e[1] === 1 && e[0] === n; }; }
  function cIs(n) { return function (an) { return !!an.coef && an.coef[0] === n * an.coef[1]; }; }
  function cFr(p, q) { return function (an) { return !!an.coef && an.coef[0] * q === p * an.coef[1]; }; }
  function both(f, g) { return function (an) { return f(an) && g(an); }; }

  /* ---------- part makers ---------- */
  function fld(name, label, math, vars) { var f = { name: name, label: label }; if (math) { f.mode = 'math'; f.keys = 'expo'; f.vars = vars || []; } return f; }
  function expoPart(prompt, tgt, diagRows, sol, hints, text, extra) {
    var p = P.expo(prompt, tgt, diagRows && diagRows.length ? { diag: dg(diagRows) } : {}, sol, hints, text);
    if (extra) Object.keys(extra).forEach(function (k) { p[k] = extra[k]; });
    return p;
  }
  function numPart(prompt, ans, rows, sol, hints, text, before) {
    var p = P.number(prompt, ans, function (v) { for (var i = 0; i < (rows || []).length; i++) if (rows[i][0] !== ans && Math.abs(v - rows[i][0]) < 1e-9) return { code: rows[i][1], hint: rows[i][2] }; return null; }, sol, hints, text);
    if (before) p.input.before = before;
    return p;
  }
  function numCk(ans, rows) { return K.number(ans, function (v) { for (var i = 0; i < (rows || []).length; i++) if (rows[i][0] !== ans && Math.abs(v - rows[i][0]) < 1e-9) return { code: rows[i][1], hint: rows[i][2] }; return null; }); }
  function mc(r, prompt, opts, sol, hints, text, keep) { return P.mc(r, prompt, opts, sol, hints, text, keep); }
  function expoCk(tgt, rows) { return K.expo(tgt, rows && rows.length ? { diag: dg(rows) } : {}); }

  var LAW = { prod: 'Product Law: add the exponents', quot: 'Quotient Law: keep the base, subtract the exponents', pp: 'Power of a Power Law: keep the base, multiply the exponents' };

  /* simplify with one law, then evaluate (numeric) */
  function lawEval(promptTex, bv, bTex, e, rows, sol, hints, text) {
    var val = Math.pow(bv, e), fl = [fld('Single power', 'single power:', true), fld('Value', 'value:', true)];
    var vd = rows.map(function (rw) { return [Math.pow(bv, rw[0]), rw[1], rw[2]]; });
    var vchk = K.value(val, { only: 'integer', diag: function (v) { for (var i = 0; i < vd.length; i++) if (!ex.eq(vd[i][0], val) && ex.eq(v, vd[i][0])) return { code: vd[i][1], hint: vd[i][2] }; return null; } });
    return P.fields(t(promptTex), fl, [singlePow(bv, e, rows), vchk], [pw(bTex, e), String(val)], t(pw(bTex, e) + '=' + F(val)), sol, hints, text);
  }
  /* blanks: b^m ÷ b^n = b^□ = □  (or (b^m)^n) */
  function blanks(kind, b, m, n) {
    var e = kind === 'q' ? m - n : m * n, V = Math.pow(b, e), tex = kind === 'q' ? pw(b, m) + '\\div ' + pw(b, n) : pw(par(pw(b, m)), n);
    var wrongE = kind === 'q' ? [[m + n, 'law-added', 'Dividing powers <b>subtracts</b> the exponents.'], [m / n, 'div-exp', 'Subtract the exponents — don’t divide them.']] : [[m + n, 'add-exp', 'A power raised to a power: <b>multiply</b> the exponents.'], [Math.pow(m, n), 'u2l2-pow-exp', 'Multiply the exponents: ' + t(m + '\\times ' + n) + ', not ' + t(pw(m, n)) + '.']];
    var fl = [fld('Exponent', 'exponent ' + t('\\square=')), fld('Value', 'value ' + t('\\square='))];
    var sol = (kind === 'q' ? LAW.quot + ': ' + t(tex + '=' + pw(b, m + '-' + n)) : LAW.pp + ': ' + t(tex + '=' + pw(b, m + '\\times ' + n))) + t('=' + pw(b, e) + '=' + F(V)) + '.';
    return P.fields(t(tex + '=' + pw(b, '\\square') + '=\\square'), fl, [numCk(e, wrongE), numCk(V, wrongE.map(function (w) { return [Math.pow(b, w[0]), w[1], w[2]]; }).concat([[b * e, 'times-exp', t(pw(b, e)) + ' means ' + t(b) + ' multiplied by itself ' + e + ' times.']]))],
      [String(e), String(V)], t(tex + '=' + pw(b, e) + '=' + F(V)), sol, [kind === 'q' ? 'The bases are the same, so subtract the exponents.' : 'A power is raised to another power, so multiply the exponents.'], plain(tex));
  }
  function qEval(b, m, n, style) { // b^m ÷ b^n, evaluate
    var e = m - n, bt = b < 0 ? '(' + b + ')' : String(b), bT = b < 0 ? par(String(b)) : String(b), tex = style === 'frac' ? dfr(pw(bT, m), pw(bT, n)) : pw(bT, m) + '\\div ' + pw(bT, n);
    var rows = [[m + n, 'law-added', 'Quotient Law: when you divide powers with the same base, <b>subtract</b> the exponents.']]; if (m % n === 0 && m / n !== e) rows.push([m / n, 'div-exp', 'Subtract the exponents — don’t divide them.']);
    return lawEval(tex, b, bt, e, rows, LAW.quot + ': ' + t(tex + '=' + pw(bt, m + '-' + n) + '=' + pw(bt, e) + '=' + F(Math.pow(b, e))) + (b < 0 ? ' (an even number of negative factors: positive).' : '.'), ['Cancel the common factors: how many ' + t(bt) + 's are left on top?'], plain(tex));
  }
  function ppEval(b, m, n) {
    var e = m * n, tex = pw(par(pw(b, m)), n), rows = []; if (m + n !== e) rows.push([m + n, 'add-exp', 'Power of a Power: the block ' + t(pw(b, m)) + ' is used ' + n + ' times, so <b>multiply</b> the exponents.']); if (Math.pow(m, n) !== e) rows.push([Math.pow(m, n), 'u2l2-pow-exp', 'Multiply the exponents: ' + t(m + '\\times ' + n) + '.']);
    return lawEval(tex, b, String(b), e, rows, LAW.pp + ': ' + t(tex + '=' + pw(b, m + '\\times ' + n) + '=' + pw(b, e) + '=' + F(Math.pow(b, e))) + '. (Check: ' + t(pw(b, m) + '=' + Math.pow(b, m)) + ' and ' + t(pw(Math.pow(b, m), n) + '=' + F(Math.pow(b, e))) + '.)', ['How many factors of ' + t(b) + ' are in ' + n + ' copies of ' + t(pw(b, m)) + '?'], plain(tex));
  }
  function quotLaw(v, m, n, style) {
    var e = m - n, tex = style === 'frac' ? dfr(pw(v, m), vt(v, n)) : pw(v, m) + '\\div ' + vt(v, n), rows = [];
    if (m % n === 0 && m / n !== e) rows.push([eIs(v, m / n), 'div-exp', 'Quotient Law: <b>subtract</b> the exponents — don’t divide them.']);
    rows.push([eIs(v, m + n), 'law-added', 'Quotient Law: when you divide powers with the same base, <b>subtract</b> the exponents.']);
    if (n === 1) rows.unshift([eIs(v, m), 'no-one', t(v) + ' has an invisible exponent ' + t(1) + ': ' + t(v + '=' + pw(v, 1)) + '.']);
    return expoPart(t(tex), vt(v, e), rows, LAW.quot + ': ' + t(tex + '=' + pw(v, m + '-' + n) + '=' + vt(v, e)) + '.', ['Cancel the common factors: how many ' + t(v) + 's are left on top?'], plain(tex), { bad: [pw(v, m + n)] });
  }
  function ppLaw(v, m, n) {
    var e = m * n, rows = []; if (m + n !== e) rows.push([eIs(v, m + n), 'add-exp', 'Power of a Power: the block ' + t(pw(v, m)) + ' is used ' + n + ' times, so <b>multiply</b> the exponents.']);
    if (Math.pow(m, n) !== e) rows.push([eIs(v, Math.pow(m, n)), 'u2l2-pow-exp', 'Multiply the exponents: ' + t(m + '\\times ' + n) + ', not ' + t(pw(m, n)) + '.']);
    return expoPart(t(pw(par(pw(v, m)), n)), pw(v, e), rows, LAW.pp + ': ' + t(pw(par(pw(v, m)), n) + '=' + pw(v, m + '\\times ' + n) + '=' + pw(v, e)) + '.', ['How many factors of ' + t(v) + ' are in ' + n + ' copies of ' + t(pw(v, m)) + '?'], '(' + v + '^' + m + ')^' + n, { bad: m + n !== e ? [pw(v, m + n)] : [] });
  }
  /* quotient of two monomials (exponents on top ≥ bottom), with diagnosis rows */
  function quotMono(nc, nps, dc, dps, style) {
    var N = M(nc, nps), D = M(dc, dps), R = mDiv(N, D), res = mTex(R), top = mT(nc, nps), bot = mT(dc, dps);
    var tex = style === 'frac' ? dfr(top, bot) : top + '\\div ' + bot, rows = [];
    if (nc % dc === 0 && dc !== 1 && nc - dc !== nc / dc) rows.push([cIs(nc - dc), 'coef-sub', 'Coefficients <b>divide</b>: ' + t(nc + '\\div ' + dc + '=' + nc / dc) + '. Only the exponents are subtracted.']);
    if (nc % dc !== 0) { rows.push([cFr(dc, nc), 'u2l2-coef-unreduced', 'The fraction part is upside down: the coefficient is ' + t(fr(nc, dc)) + ' reduced.']); }
    var steps = [];
    Object.keys(N.e).sort().forEach(function (v) { var a = N.e[v], b = D.e[v] || 0; if (b) { steps.push(pw(v, a + '-' + b)); if (a % b === 0 && a / b !== a - b) rows.push([eIs(v, a / b), 'div-exp', 'Quotient Law: <b>subtract</b> the exponents of ' + t(v) + ' — don’t divide them.']); rows.push([eIs(v, a + b), 'law-added', 'Dividing powers of ' + t(v) + ' <b>subtracts</b> the exponents.']); } else steps.push(vt(v, a)); });
    var cpart = nc === 1 && dc === 1 ? '' : nc % dc === 0 ? '(' + nc + '\\div ' + dc + ')' : fr(nc, dc);
    var sol = (cpart ? 'Divide the coefficients, then subtract the exponents of each letter: ' : LAW.quot + ': ') + t(tex + '=' + cpart + steps.join('') + '=' + res) + '.';
    return { tex: tex, res: res, rows: rows, sol: sol, R: R };
  }
  function quotPart(nc, nps, dc, dps, style, hints) {
    var q = quotMono(nc, nps, dc, dps, style);
    return expoPart(t(q.tex), q.res, q.rows, q.sol, hints || ['Divide the numbers; for each letter, subtract the exponent on the bottom from the exponent on top.'], plain(q.tex));
  }
  /* (c · letters)^n */
  function powMono(c, ps, n) {
    var B = M(c, ps), R = mPow(B, n), res = mTex(R), inner = mT(c, ps), tex = pw(par(inner), n), rows = [], C = Math.pow(c, n);
    if (Math.abs(c) !== 1 && C !== c) rows.push([cIs(c), 'coef-not-raised', 'The ' + t(c) + ' is inside the brackets, so it is raised to the power ' + t(n) + ' too: ' + t(pw(signed(c), n) + '=' + C) + '.']);
    if (Math.abs(c) !== 1 && c * n !== C) rows.push([cIs(c * n), 'coef-times', t(pw(signed(c), n)) + ' means ' + t(signed(c)) + ' multiplied by itself ' + n + ' times, not ' + t(signed(c) + '\\times ' + n) + '.']);
    ps.forEach(function (p) { if (p[1] + n !== p[1] * n) rows.push([eIs(p[0], p[1] + n), 'add-exp', 'Power of a Power: <b>multiply</b> the exponents of ' + t(p[0]) + ': ' + t(p[1] + '\\times ' + n) + '.']); if (p[1] === 1) rows.push([eIs(p[0], 1), 'part-base', 'Every factor inside the brackets gets the exponent — ' + t(p[0]) + ' too.']); });
    var step = (Math.abs(c) !== 1 ? pw(signed(c), n) : c === -1 ? pw('(-1)', n) : '') + ps.map(function (p) { return p[1] === 1 ? pw(p[0], n) : pw(par(pw(p[0], p[1])), n); }).join('');
    var sol = 'The outside exponent applies to <b>every</b> factor inside the brackets' + (Math.abs(c) !== 1 ? ' — the coefficient too' : '') + ': ' + t(tex + '=' + step + '=' + res) + (c < 0 ? (n % 2 ? ' (odd exponent: negative).' : ' (even exponent: positive).') : '.');
    return { tex: tex, res: res, rows: rows, sol: sol, R: R };
  }
  function powPart(c, ps, n, hints) {
    var m = powMono(c, ps, n);
    return expoPart(t(m.tex), m.res, m.rows, m.sol, hints || ['Raise every factor inside the brackets to the power: the number (sign included) and each letter (multiply its exponent).'], plain(m.tex));
  }
  /* missing whole-number exponent: equation TeX, answer, diagnosis rows */
  function missPart(eqTex, ans, unk, rows, sol, hint, text) { return numPart(t(eqTex), ans, rows, sol, [hint], text || plain(eqTex), t(unk + '=')); }

  HW.defineLesson({
    id: 'u2l2', unit: 2, num: '2', title: 'The Quotient Law & Power of a Power', outcome: 'AN3',
    blurb: 'Dividing powers with the same base subtracts the exponents; raising a power to a power multiplies them — with coefficients, and both laws together.',
    questions: [
      /* ===================== Part A ===================== */
      { num: '1', section: 'Part A — The Quotient Law', stem: 'Fill in each blank, then evaluate. (The bases are the same, so subtract the exponents.)', parts: [
        { id: '1a', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 10), r.int(4, 12), r.pick([2, 3])]; }, function (x) { return Math.pow(x[0], x[2]) <= 1000 && x[1] - x[2] >= 2; }); if (r.chance(0.15)) x = [6, 4, 3]; return blanks('q', x[0], x[1] + x[2], x[1]); } },
        { id: '1b', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 10), r.int(3, 10), r.pick([2, 3])]; }, function (x) { return Math.pow(x[0], x[2]) <= 1000 && x[1] - x[2] >= 1; }); if (r.chance(0.15)) x = [9, 3, 2]; return blanks('q', x[0], x[1] + x[2], x[1]); } }] },
      { num: '2', stem: 'Evaluate each expression using the Quotient Law.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 6), r.int(3, 9), r.int(2, 3)]; }, function (x) { return Math.pow(x[0], x[2]) <= 250; }); return qEval(x[0], x[1] + x[2], x[1], 'div'); } },
        { id: '2b', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 9), r.int(2, 8), r.int(2, 3)]; }, function (x) { return Math.pow(x[0], x[2]) <= 750; }); if (r.chance(0.15)) x = [8, 2, 3]; return qEval(x[0], x[1] + x[2], x[1], 'frac'); } },
        { id: '2c', level: 'EMG', make: function (r) { var b = -r.int(2, 9), n = r.int(3, 8); return qEval(b, n + 2, n, 'frac'); } },
        { id: '2d', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.pick([2, 2, 3, 10]), r.int(3, 9), r.int(3, 6)]; }, function (x) { return Math.pow(x[0], x[2]) <= 1000 || x[0] === 10; }); return qEval(x[0], x[1] + x[2], x[1], 'div'); } }] },
      { num: '3', stem: 'Simplify each expression using the Quotient Law.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var n = r.int(2, 6); return quotLaw(r.pick(LET), n + r.int(3, 9), n, 'div'); } },
        { id: '3b', level: 'BEG', make: function (r) { var n = r.int(3, 8); return quotLaw(r.pick(LET), n + r.int(3, 8), n, 'frac'); } },
        { id: '3c', level: 'BEG', make: function (r) { var n = r.int(2, 4); return quotLaw(r.pick(LET), n * r.int(2, 4), n, 'div'); } },
        { id: '3d', level: 'BEG', make: function (r) { var n = r.int(2, 6); return quotLaw(r.pick(LET), n + r.int(2, 9), n, 'frac'); } }] },
      { num: '4', stem: 'Simplify. Divide the coefficients, then use the Quotient Law on the variable part.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { return coefQuot(r, 'div'); } },
        { id: '4b', level: 'BEG', make: function (r) { return coefQuot(r, 'frac'); } },
        { id: '4c', level: 'BEG', make: function (r) { return coefQuot(r, 'div'); } },
        { id: '4d', level: 'EMG', make: function (r) { var v = r.pick(LET), d = r.int(2, 5), q = d, n = r.int(2, 4), m = n * r.int(2, 3); return quotPart(d * q, [[v, m]], d, [[v, n]], 'frac'); } }] },

      /* ===================== Part B ===================== */
      { num: '5', section: 'Part B — Power of a Power', stem: 'Fill in each blank, then evaluate. (A power is raised to another power, so multiply the exponents.)', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 10), r.int(2, 3), r.int(2, 3)]; }, function (x) { return Math.pow(x[0], x[1] * x[2]) <= 10000 || x[0] === 10; }); if (r.chance(0.15)) x = [4, 2, 3]; return blanks('p', x[0], x[1], x[2]); } },
        { id: '5b', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.pick([2, 2, 3, 4, 5, 10]), r.int(2, 5), r.int(2, 4)]; }, function (x) { return (Math.pow(x[0], x[1] * x[2]) <= 10000 || x[0] === 10 && x[1] * x[2] <= 9) && x[1] * x[2] >= 6; }); if (r.chance(0.15)) x = [2, 3, 3]; return blanks('p', x[0], x[1], x[2]); } }] },
      { num: '6', stem: 'Evaluate each expression using the Power of a Power Law.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 10), 2, r.int(2, 3)]; }, function (x) { return Math.pow(x[0], x[1] * x[2]) <= 10000 || x[0] === 10; }); return ppEval(x[0], x[1], x[2]); } },
        { id: '6b', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.pick([2, 2, 3, 3, 4, 5, 10]), r.int(2, 4), r.int(2, 5)]; }, function (x) { return (Math.pow(x[0], x[1] * x[2]) <= 10000 || x[0] === 10 && x[1] * x[2] <= 8) && x[1] !== x[2] || x[0] === 2 && x[1] === 2 && x[2] === 4; }); return ppEval(x[0], x[1], x[2]); } },
        { id: '6c', level: 'BEG', make: function (r) { var o = r.pick([[2, 2, 2], [3, 2, 2], [4, 2, 2], [5, 2, 2], [6, 2, 2], [7, 2, 2], [8, 2, 2], [9, 2, 2], [10, 2, 2], [2, 3, 2], [3, 3, 2], [4, 3, 2], [2, 2, 3], [3, 2, 3], [4, 2, 3], [10, 3, 2], [10, 2, 3], [2, 4, 2], [2, 2, 4], [5, 2, 2]]); return ppEval(o[0], o[1], o[2]); } },
        { id: '6d', level: 'EMG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 10), r.int(1, 4), r.int(2, 4)]; }, function (x) { var v = Math.pow(x[0], x[1] * x[2]); return x[1] * x[2] >= 4 && (v >= 1000 && v <= 10000 || x[0] === 10 && x[1] * x[2] <= 8); }); return ppEval(x[0], x[1], x[2]); } }] },
      { num: '7', stem: 'Simplify each expression using the Power of a Power Law.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { return ppLaw(r.pick(LET), r.int(2, 6), r.int(3, 6)); } },
        { id: '7b', level: 'BEG', make: function (r) { return ppLaw(r.pick(LET), r.int(4, 9), 2); } },
        { id: '7c', level: 'BEG', make: function (r) { var n = r.int(3, 6); return ppLaw(r.pick(LET), n, n); } },
        { id: '7d', level: 'BEG', make: function (r) { return ppLaw(r.pick(LET), 2, r.int(5, 12)); } }] },

      /* ===================== Part C ===================== */
      { num: '8', section: 'Part C — Mixing the Laws', stem: 'Decide which exponent law applies, then simplify.', parts: [
        { id: '8a', level: 'BEG', make: function (r) { var v = r.pick(LET), x = pickWhere(function () { return [r.int(2, 8), r.int(2, 8)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; });
          return expoPart(t(pw(v, x[0]) + '\\times ' + pw(v, x[1])), pw(v, x[0] + x[1]), [[eIs(v, x[0] * x[1]), 'mult-exp', 'This is a <b>product</b> of powers: add the exponents (Product Law).'], [eIs(v, Math.abs(x[0] - x[1])), 'u2l2-wrong-law', 'This is a product, not a quotient: add the exponents.']],
            'Two powers of ' + t(v) + ' are <b>multiplied</b>, so use the ' + LAW.prod + ': ' + t(pw(v, x[0] + '+' + x[1]) + '=' + pw(v, x[0] + x[1])) + '.', ['Is it a product, a quotient, or a power of a power?'], v + '^' + x[0] + ' x ' + v + '^' + x[1]); } },
        { id: '8b', level: 'BEG', make: function (r) { var v = r.pick(LET), n = r.int(2, 6), m = n + r.int(2, 8);
          return expoPart(t(dfr(pw(v, m), pw(v, n))), pw(v, m - n), [[eIs(v, m + n), 'law-added', 'This is a <b>quotient</b>: subtract the exponents (Quotient Law).'], [eIs(v, m * n), 'u2l2-wrong-law', 'This is a quotient: subtract the exponents.']].concat(m % n === 0 && m / n !== m - n ? [[eIs(v, m / n), 'div-exp', 'Subtract the exponents — don’t divide them.']] : []),
            'A power of ' + t(v) + ' is <b>divided</b> by another, so use the ' + LAW.quot + ': ' + t(pw(v, m + '-' + n) + '=' + pw(v, m - n)) + '.', ['Is it a product, a quotient, or a power of a power?'], v + '^' + m + '/' + v + '^' + n); } },
        { id: '8c', level: 'BEG', make: function (r) { var v = r.pick(LET), x = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; });
          return expoPart(t(pw(par(pw(v, x[0])), x[1])), pw(v, x[0] * x[1]), [[eIs(v, x[0] + x[1]), 'add-exp', 'This is a <b>power of a power</b>: multiply the exponents.']],
            'A power is raised to a power, so use the ' + LAW.pp + ': ' + t(pw(v, x[0] + '\\times ' + x[1]) + '=' + pw(v, x[0] * x[1])) + '.', ['Is it a product, a quotient, or a power of a power?'], '(' + v + '^' + x[0] + ')^' + x[1]); } },
        { id: '8d', level: 'EMG', make: function (r) { var v = r.pick(LET), x = pickWhere(function () { return [r.int(3, 8), r.int(2, 5), r.int(2, 6)]; }, function (x) { return x[0] + x[1] - x[2] >= 2; }), e = x[0] + x[1] - x[2];
          return expoPart(t(pw(v, x[0]) + '\\times ' + pw(v, x[1]) + '\\div ' + pw(v, x[2])), pw(v, e), [[eIs(v, x[0] + x[1] + x[2]), 'law-added', 'Dividing by ' + t(pw(v, x[2])) + ' <b>subtracts</b> its exponent.'], [eIs(v, x[0] * x[1] - x[2]), 'mult-exp', 'Multiplying adds the exponents: ' + t(x[0] + '+' + x[1]) + '.'], [eIs(v, x[0] + x[1]), 'count', 'Now divide by ' + t(pw(v, x[2])) + ' too.']],
            'Product Law, then Quotient Law: ' + t(pw(v, x[0] + '+' + x[1] + '-' + x[2]) + '=' + pw(v, e)) + '.', ['Work left to right: multiply (add exponents), then divide (subtract).'], v + '^' + x.join(',')); } }] },
      { num: '9', stem: 'Use both the Quotient Law and the Power of a Power Law to simplify.', parts: [
        { id: '9a', level: 'EMG', make: function (r) { var v = r.pick(LET), x = pickWhere(function () { return [r.int(2, 4), r.int(2, 4), r.int(2, 9)]; }, function (x) { return x[0] * x[1] - x[2] >= 2; }), e = x[0] * x[1] - x[2];
          return expoPart(t(dfr(pw(par(pw(v, x[0])), x[1]), pw(v, x[2]))), pw(v, e), [[eIs(v, x[0] + x[1] - x[2]), 'u2l2-no-pp', 'First clear the bracket: ' + t(pw(par(pw(v, x[0])), x[1]) + '=' + pw(v, x[0] * x[1])) + ' (multiply).'], [eIs(v, x[0] * x[1] + x[2]), 'law-added', 'Then divide: <b>subtract</b> ' + t(x[2]) + '.']],
            LAW.pp + ' first: ' + t(pw(par(pw(v, x[0])), x[1]) + '=' + pw(v, x[0] * x[1])) + '. Then ' + LAW.quot + ': ' + t(fr(pw(v, x[0] * x[1]), pw(v, x[2])) + '=' + pw(v, e)) + '.', ['Simplify inside the brackets first by multiplying the exponents, then subtract.'], '(' + v + '^' + x[0] + ')^' + x[1] + '/' + v + '^' + x[2]); } },
        { id: '9b', level: 'EMG', make: function (r) { var x = pickWhere(function () { return [r.pick([2, 2, 3, 3, 5]), r.int(2, 4), r.int(2, 3), r.int(2, 9)]; }, function (x) { var e = x[1] * x[2] - x[3]; return e >= 1 && Math.pow(x[0], e) <= 250; }); if (r.chance(0.15)) x = [3, 3, 2, 4];
          var b = x[0], m = x[1], n = x[2], d = x[3], e = m * n - d, tex = pw(par(pw(b, m)), n) + '\\div ' + pw(b, d);
          return lawEval(tex, b, String(b), e, [[m + n - d, 'u2l2-no-pp', 'Clear the bracket first: ' + t(pw(par(pw(b, m)), n) + '=' + pw(b, m * n)) + '.'], [m * n + d, 'law-added', 'Dividing subtracts the exponents.']],
            LAW.pp + ': ' + t(pw(par(pw(b, m)), n) + '=' + pw(b, m * n)) + '. ' + LAW.quot + ': ' + t(pw(b, m * n) + '\\div ' + pw(b, d) + '=' + pw(b, e) + '=' + F(Math.pow(b, e))) + '.', ['Bracket first (multiply), then divide (subtract).'], plain(tex)); } },
        { id: '9c', level: 'PRG', make: function (r) { var v = r.pick(LET), x = pickWhere(function () { return [r.int(2, 5), r.int(2, 4), r.int(2, 4), r.int(2, 3)]; }, function (x) { return x[0] * x[1] - x[2] * x[3] >= 2 && x[0] * x[1] - x[2] * x[3] <= 12; }), e = x[0] * x[1] - x[2] * x[3];
          return expoPart(t(dfr(pw(par(pw(v, x[0])), x[1]), pw(par(pw(v, x[2])), x[3]))), pw(v, e), [[eIs(v, x[0] + x[1] - x[2] - x[3]), 'u2l2-no-pp', 'Clear both brackets first by multiplying: ' + t(pw(v, x[0] * x[1])) + ' on top, ' + t(pw(v, x[2] * x[3])) + ' on the bottom.']],
            LAW.pp + ' on top and bottom: ' + t(fr(pw(v, x[0] * x[1]), pw(v, x[2] * x[3]))) + '. Then ' + LAW.quot + ': ' + t(pw(v, x[0] * x[1] + '-' + x[2] * x[3]) + '=' + pw(v, e)) + '.', ['Simplify the top and the bottom first, then use the Quotient Law.'], '(' + v + '^' + x[0] + ')^' + x[1] + '/(' + v + '^' + x[2] + ')^' + x[3]); } }] },
      { num: '10', stem: 'Use the Quotient Law to state the value of ' + t('x') + ' in each equation.', parts: [
        { id: '10a', level: 'PRG', make: function (r) { var a = r.int(2, 8), y = r.int(3, 12), x = a + y;
          return missPart(pw('c', 'x') + '\\div ' + pw('c', a) + '=' + pw('c', y), x, 'x', [[y - a, 'u2l2-sub-x', 'Dividing subtracts ' + t(a) + ' from ' + t('x') + ': ' + t('x-' + a + '=' + y) + '. So ' + t('x') + ' is bigger than ' + t(y) + '.'], [y * a, 'multiplied', 'Quotient Law: subtract, so ' + t('x-' + a + '=' + y) + '.']],
            LAW.quot + ': ' + t('x-' + a + '=' + y) + ', so ' + t('x=' + x) + '.', 'Use the Quotient Law, then match the exponents.'); } },
        { id: '10b', level: 'PRG', make: function (r) { var y = r.int(2, 8), x = r.int(3, 10), m = x + y;
          return missPart(dfr(pw('d', m), pw('d', 'x')) + '=' + pw('d', y), x, 'x', [[m + y, 'u2l2-sub-x', t(m + '-x=' + y) + ': ' + t('x') + ' is subtracted from ' + t(m) + ', so it is less than ' + t(m) + '.'], [m / y, 'div-exp', 'Quotient Law: subtract the exponents, don’t divide.']],
            LAW.quot + ': ' + t(m + '-x=' + y) + ', so ' + t('x=' + x) + '.', 'Use the Quotient Law, then match the exponents.'); } },
        { id: '10c', level: 'PRG', make: function (r) { var a = r.int(3, 9), y = r.int(5, 14), x = a + y;
          return missPart(pw('g', 'x') + '\\div ' + pw('g', a) + '=' + pw('g', y), x, 'x', [[y - a, 'u2l2-sub-x', t('x-' + a + '=' + y) + ': add ' + t(a) + ' back.'], [y * a, 'multiplied', 'Quotient Law: subtract.']],
            LAW.quot + ': ' + t('x-' + a + '=' + y) + ', so ' + t('x=' + x) + '.', 'Use the Quotient Law, then match the exponents.'); } }] },
      { num: '11', stem: 'Use the Power of a Power Law to state the value of ' + t('x') + ' in each equation.', parts: [
        { id: '11a', level: 'PRG', make: function (r) { var p = r.int(2, 6), x = r.int(2, 9), s = p * x;
          return missPart(pw(par(pw('a', 'x')), p) + '=' + pw('a', s), x, 'x', [[s - p, 'add-exp', 'Power of a Power: multiply, so ' + t(p + 'x=' + s) + '.'], [s * p, 'multiplied', t(p + 'x=' + s) + ': divide by ' + t(p) + '.']],
            LAW.pp + ': ' + t(pw('a', p + 'x') + '=' + pw('a', s)) + ', so ' + t(p + 'x=' + s) + ' and ' + t('x=' + x) + '.', 'Multiply the exponents, then match.'); } },
        { id: '11b', level: 'PRG', make: function (r) { var p = r.int(2, 9), x = r.int(2, 8), s = p * x;
          return missPart(pw(par(pw('b', p)), 'x') + '=' + pw('b', s), x, 'x', [[s - p, 'add-exp', 'Power of a Power: multiply, so ' + t(p + 'x=' + s) + '.'], [s * p, 'multiplied', t(p + 'x=' + s) + ': divide.']],
            LAW.pp + ': ' + t(pw('b', p + 'x') + '=' + pw('b', s)) + ', so ' + t(p + 'x=' + s) + ' and ' + t('x=' + x) + '.', 'Multiply the exponents, then match.'); } }] },
      { num: '12', stem: function (sh) { return 'Explain, using factors, why ' + t(pw(par(pw(sh.v, sh.a)), sh.b) + '\\neq ' + pw(sh.v, sh.a) + '\\times ' + pw(sh.v, sh.b)) + '.'; },
        shared: function (r) { var ab = pickWhere(function () { return [r.int(2, 5), r.int(2, 5)]; }, function (x) { return x[0] + x[1] !== x[0] * x[1]; }); if (r.chance(0.2)) ab = [2, 3]; return { v: r.pick(['k', 'k', 'x', 'm', 'p', 'y', 'a', 'n']), a: ab[0], b: ab[1] }; },
        parts: [
          { id: '12a', level: 'BEG', make: function (r, s) {
            var R = s.a * s.b, L = s.a + s.b, fl = [fld('Left', 'factors of ' + t(s.v) + ' in ' + t(pw(par(pw(s.v, s.a)), s.b)) + ':'), fld('Right', 'factors of ' + t(s.v) + ' in ' + t(pw(s.v, s.a) + '\\times ' + pw(s.v, s.b)) + ':')];
            return P.fields('Write both as repeated multiplication. How many factors of ' + t(s.v) + ' does each have?', fl,
              [numCk(R, [[L, 'add-exp', t(pw(par(pw(s.v, s.a)), s.b)) + ' means ' + s.b + ' copies of the block ' + t(pw(s.v, s.a)) + ': ' + s.b + ' groups of ' + s.a + '.']]), numCk(L, [[R, 'mult-exp', 'Two blocks side by side: ' + s.a + ' factors, then ' + s.b + ' more.']])],
              [String(R), String(L)], t(R) + ' and ' + t(L),
              t(pw(par(pw(s.v, s.a)), s.b)) + ' is ' + s.b + ' copies of ' + t(pw(s.v, s.a) + '=' + rep(s.v, s.a, '')) + ': ' + t(s.b + '\\times ' + s.a + '=' + R) + ' factors, ' + t(pw(s.v, R)) + '. But ' + t(pw(s.v, s.a) + '\\times ' + pw(s.v, s.b)) + ' is ' + t(s.a + '+' + s.b + '=' + L) + ' factors, ' + t(pw(s.v, L)) + '.',
              ['Write each power out as ' + t(s.v + '\\times ' + s.v + '\\times\\cdots') + ' and count.'], 'count factors ' + s.a + ',' + s.b);
          } },
          { id: '12b', level: 'EMG', make: function (r, s) {
            var R = s.a * s.b, L = s.a + s.b;
            return mc(r, 'Which explanation is correct?', [
              { html: t(pw(par(pw(s.v, s.a)), s.b)) + ' is ' + s.b + ' groups of ' + s.a + ' factors of ' + t(s.v) + ', which is ' + t(R) + ' factors; ' + t(pw(s.v, s.a) + '\\times ' + pw(s.v, s.b)) + ' has ' + t(L) + ' factors. ' + t(pw(s.v, R) + '\\neq ' + pw(s.v, L)) + '.', right: true },
              { html: 'Both sides have ' + t(L) + ' factors of ' + t(s.v) + '; only the brackets make them look different.', why: 'Count the factors in ' + t(pw(par(pw(s.v, s.a)), s.b)) + ': it is ' + s.b + ' copies of ' + t(pw(s.v, s.a)) + '.' },
              { html: t(pw(par(pw(s.v, s.a)), s.b)) + ' has ' + t(L) + ' factors and ' + t(pw(s.v, s.a) + '\\times ' + pw(s.v, s.b)) + ' has ' + t(R) + '.', why: 'That has the two laws backwards: a power of a power <b>multiplies</b> the exponents; a product <b>adds</b> them.' },
              { html: t(pw(par(pw(s.v, s.a)), s.b) + '=' + pw(s.v, Math.pow(s.a, s.b))) + ', which is much bigger.', why: 'The exponents multiply: ' + t(s.a + '\\times ' + s.b) + ', not ' + t(pw(s.a, s.b)) + '.' }],
              'Power of a Power: ' + t(pw(par(pw(s.v, s.a)), s.b) + '=' + pw(s.v, s.a + '\\times ' + s.b) + '=' + pw(s.v, R)) + '. Product: ' + t(pw(s.v, s.a) + '\\times ' + pw(s.v, s.b) + '=' + pw(s.v, s.a + '+' + s.b) + '=' + pw(s.v, L)) + '. ' + R + ' factors is not the same as ' + L + '.',
              ['Count the factors of ' + t(s.v) + ' on each side.'], 'explain power of power vs product');
          } }] },
      { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          var mn = pickWhere(function () { return [r.int(2, 5), r.int(2, 5)]; }, function (x) { var s = x[0] + x[1], p = x[0] * x[1], a = Math.pow(x[0], x[1]), b = Math.pow(x[1], x[0]); return s !== p && a !== p && b !== p && a !== b && a !== s && b !== s; }), m = mn[0], n = mn[1], v = r.pick(['x', 'x', 'y', 'b', 'a']);
          if (r.chance(0.2)) { m = 3; n = 5; }
          var opts = [{ e: m + n, why: 'That adds the exponents (the Product Law). Here a power is raised to a power, so multiply.' }, { e: m * n, right: true }, { e: Math.pow(m, n), why: 'That works out ' + t(pw(m, n)) + '. The exponents should be multiplied: ' + t(m + '\\times ' + n) + '.' }, { e: Math.pow(n, m), why: 'That works out ' + t(pw(n, m)) + '. Multiply the exponents: ' + t(m + '\\times ' + n) + '.' }]
            .sort(function (a, b) { return a.e - b.e; }).map(function (o) { return { html: t(pw(v, o.e)), right: !!o.right, why: o.why }; });
          return mc(r, 'Which of the following is equivalent to ' + t(pw(par(pw(v, m)), n)) + '?', opts, LAW.pp + ': ' + t(pw(par(pw(v, m)), n) + '=' + pw(v, m + '\\times ' + n) + '=' + pw(v, m * n)) + '.', ['Write it out: ' + n + ' copies of ' + t(pw(v, m)) + '.'], '(' + v + '^' + m + ')^' + n + ' MC', true);
        } }] },
      { num: '14', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '14', level: 'PRG', make: function (r) {
          var y = r.int(2, 9), n = r.int(3, 15), T = n + y; if (r.chance(0.2)) { T = 18; y = 6; n = 12; }
          return P.nr('If ' + t(dfr(pw('p', T), pw('p', 'n')) + '=' + pw('p', y)) + ', where ' + t('n') + ' is a whole number, then the value of ' + t('n') + ' is ________.', n, function (v) {
            if (v === T + y) return { code: 'u2l2-sub-x', hint: t(T + '-n=' + y) + ': ' + t('n') + ' is subtracted from ' + t(T) + ', so it is smaller than ' + t(T) + '.' };
            if (v === T / y) return { code: 'div-exp', hint: 'The Quotient Law subtracts the exponents: ' + t(T + '-n=' + y) + '.' };
            return null;
          }, LAW.quot + ': ' + t(fr(pw('p', T), pw('p', 'n')) + '=' + pw('p', T + '-n')) + '. So ' + t(T + '-n=' + y) + ' and ' + t('n=' + n) + '.', ['Write the left side as a single power of ' + t('p') + ', then match the exponents.'], 'p^' + T + '/p^n=p^' + y);
        } }] }
    ],

    /* =============================== EXTRA PRACTICE =============================== */
    extra: [
      { num: '1', section: 'Part A — The Quotient Law with Coefficients and Two Variables', stem: 'Simplify each expression. Keep all exponents positive.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { return twoVarQuot(r, 'frac'); } },
        { id: 'e1b', level: 'EMG', make: function (r) { return twoVarQuot(r, 'div'); } },
        { id: 'e1c', level: 'EMG', make: function (r) { return twoVarQuot(r, 'frac', true); } },
        { id: 'e1d', level: 'EMG', make: function (r) { return twoVarQuot(r, 'div'); } }] },
      { num: '2', stem: 'Simplify. In each of these the coefficients do <b>not</b> divide evenly, so leave the number part as a reduced fraction.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) { var v = r.pick(LET), fc = fracCoef(r), n = r.int(1, 4), m = n + r.int(2, 6); return quotPart(fc[0], [[v, m]], fc[1], [[v, n]], 'frac', ['Divide the numbers as a fraction and reduce it; subtract the exponents.']); } },
        { id: 'e2b', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), fc = fracCoef(r), a = r.int(1, 4), b = r.int(1, 3); return quotPart(fc[0], [[vw[0], a + r.int(2, 5)], [vw[1], b + r.int(1, 4)]], fc[1], [[vw[0], a], [vw[1], b]], 'frac', ['Divide the numbers as a fraction and reduce it; subtract the exponents of each letter.']); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), fc = fracCoef(r), a = r.int(2, 5), b = r.int(1, 3); return quotPart(fc[0], [[vw[0], a + r.int(2, 5)], [vw[1], b + r.int(1, 4)]], fc[1], [[vw[0], a], [vw[1], b]], 'div', ['Divide the numbers as a fraction and reduce it; subtract the exponents of each letter.']); } },
        { id: 'e2d', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), fc = fracCoef(r), a = r.int(2, 5), b = r.int(2, 4); return quotPart(fc[0], [[vw[0], a + r.int(2, 5)], [vw[1], b + r.int(1, 3)]], fc[1], [[vw[0], a], [vw[1], b]], 'frac', ['Divide the numbers as a fraction and reduce it; subtract the exponents of each letter.']); } }] },
      { num: '3', stem: 'Simplify. Watch for three different bases, and for a variable that appears in only one part of the fraction.', parts: [
        { id: 'e3a', level: 'EMG', make: function (r) { var L = lets(r, 3).sort(), d = r.int(2, 9), q = r.int(2, 6), a = [r.int(1, 4), r.int(1, 4), 1];
          return quotPart(d * q, [[L[0], a[0] + r.int(2, 4)], [L[1], a[1] + r.int(2, 5)], [L[2], a[2] + r.int(1, 3)]], d, [[L[0], a[0]], [L[1], a[1]], [L[2], a[2]]], 'frac'); } },
        { id: 'e3b', level: 'EMG', make: function (r) { var L = lets(r, 2).sort(), d = r.int(2, 9), q = r.int(2, 9), a = r.int(1, 4);
          return quotPart(d * q, [[L[0], a + r.int(2, 6)], [L[1], r.int(2, 7)]], d, [[L[0], a]], 'frac', ['Divide the numbers; subtract the exponents of each letter. A letter that is only on top has nothing to cancel with.']); } },
        { id: 'e3c', level: 'PRG', make: function (r) { var L = lets(r, 3).sort(), d = r.int(2, 9), q = r.int(2, 5), a = r.int(2, 5), c = r.int(2, 6);
          return quotPart(d * q, [[L[0], a + r.int(1, 4)], [L[1], r.int(2, 6)], [L[2], c + r.int(2, 5)]], d, [[L[0], a], [L[2], c]], 'frac', ['Divide the numbers; subtract the exponents of each letter. A letter that is only on top has nothing to cancel with.']); } }] },

      /* ===================== Part B ===================== */
      { num: '4', section: 'Part B — Power of a Power When a Coefficient Is Inside', stem: 'An outer exponent applies to <b>everything</b> inside the brackets — the coefficient as well as each variable: ' + t('\\left(2x^{3}\\right)^{4}=2^{4}x^{12}=16x^{12}') + '. Simplify each expression. Raise the coefficient too.', parts: [
        { id: 'e4a', level: 'EMG', make: function (r) { var c = r.int(2, 9), v = r.pick(LET); return powPart(c, [[v, r.int(2, 6)]], 2); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var c = -r.int(2, 4), vw = lets(r, 2).sort(); return powPart(c, [[vw[0], r.int(2, 4)], [vw[1], 1]], 3); } },
        { id: 'e4c', level: 'EMG', make: function (r) { var c = -r.int(2, 4), v = r.pick(LET); return powPart(c, [[v, r.int(2, 6)]], 3); } },
        { id: 'e4d', level: 'EMG', make: function (r) { var c = r.int(2, 9), vw = lets(r, 2).sort(); return powPart(c, [[vw[0], r.int(2, 4)], [vw[1], r.int(2, 5)]], 2); } }] },
      { num: '5', stem: 'Simplify. Pay close attention to the sign of each answer.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { var v = r.pick(LET); return powPart(-1, [[v, r.int(2, 6)]], r.pick([3, 5, 7])); } },
        { id: 'e5b', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(); return powPart(-r.pick([2, 2, 3]), [[vw[0], r.int(2, 5)], [vw[1], 1]], 4); } },
        { id: 'e5c', level: 'EMG', make: function (r) { var vw = lets(r, 2).sort(); return powPart(r.int(2, 4), [[vw[0], r.int(2, 4)], [vw[1], r.int(2, 6)]], 3); } },
        { id: 'e5d', level: 'EMG', make: function (r) { var v = r.pick(LET); return powPart(-1, [[v, r.int(2, 8)]], r.pick([2, 4, 6])); } }] },
      { num: '6', stem: function (sh) { return 'The expressions ' + t(pw(par(sh.c + sh.v), sh.n)) + ' and ' + t(sh.c + pw(sh.v, sh.n)) + ' look almost the same but are not equal.'; },
        shared: function (r) { var c = r.int(2, 9), n = c <= 4 ? r.pick([2, 2, 3]) : 2, x = n === 3 ? r.int(2, 3) : r.int(2, 5), v = r.pick(['x', 'x', 'x', 'y', 'a', 'm', 'k', 'p']); if (r.chance(0.2)) { c = 3; x = 2; n = 2; v = 'x'; } return { c: c, x: x, n: n, v: v }; },
        parts: [
          { id: 'e6a', level: 'EMG', make: function (r, s) { var m = powMono(s.c, [[s.v, 1]], s.n); return expoPart('Simplify ' + t(m.tex) + '.', m.res, m.rows, m.sol, ['Every factor inside the brackets is raised to the power — the ' + t(s.c) + ' too.'], '(' + s.c + s.v + ')^' + s.n); } },
          { id: 'e6b', level: 'BEG', make: function (r, s) { var c = s.c, x = s.x, v = s.v, n = s.n, A = Math.pow(c * x, n), B = c * Math.pow(x, n), fl = [fld('First', t(pw(par(c + v), n) + '=')), fld('Second', t(c + pw(v, n) + '='))];
            return P.fields('Evaluate both expressions when ' + t(v + '=' + x) + '.', fl, [numCk(A, [[B, 'coef-not-raised', 'The brackets hold ' + t(c + v) + ': work out ' + t(c + '\\times ' + x + '=' + c * x) + ' first, then raise it to the power.']]), numCk(B, [[A, 'coef-not-raised', 'No brackets: only ' + t(v) + ' is raised to the power. Work out ' + t(pw(x, n)) + ', then multiply by ' + t(c) + '.']])],
              [String(A), String(B)], t(F(A)) + ' and ' + t(B), t(pw(par(c + '\\times ' + x), n) + '=' + pw(c * x, n) + '=' + F(A)) + ', but ' + t(c + '\\times ' + pw(x, n) + '=' + c + '\\times ' + Math.pow(x, n) + '=' + B) + '.', ['Brackets first.'], 'evaluate at ' + v + '=' + x); } },
          { id: 'e6c', level: 'EMG', make: function (r, s) { var c = s.c, v = s.v, n = s.n;
            return mc(r, 'What do the brackets change?', [
              { html: 'With brackets the exponent applies to the ' + t(c) + ' as well as the ' + t(v) + '; without them only the ' + t(v) + ' is raised to the power.', right: true },
              { html: 'The brackets tell you to multiply by ' + t(n) + '.', why: 'An exponent of ' + t(n) + ' means multiply the base by itself, not by ' + t(n) + '.' },
              { html: 'Nothing — brackets never change the value.', why: 'Your two values in (b) are different.' },
              { html: 'Without brackets the ' + t(c) + ' is raised to the power and the ' + t(v) + ' is not.', why: 'The exponent sits on ' + t(v) + ', so in ' + t(c + pw(v, n)) + ' only ' + t(v) + ' is raised to the power.' }],
              t(pw(par(c + v), n) + '=' + rep('(' + c + v + ')', n, '') + '=' + Math.pow(c, n) + pw(v, n)) + ', but ' + t(c + pw(v, n) + '=' + c + '\\times ' + rep(v, n)) + '. The brackets make the exponent apply to the ' + t(c) + ' too.', ['Write each one as repeated multiplication.'], 'what brackets change'); } }] },

      /* ===================== Part C ===================== */
      { num: '7', section: 'Part C — Chains: Both Laws in One Expression', stem: 'Work from the inside out. Clear every bracket first with the Power of a Power Law, then finish with the Quotient Law. Simplify each expression.', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) { return ppOverPp(r); } },
        { id: 'e7b', level: 'EMG', make: function (r) { return ppOverPp(r); } },
        { id: 'e7c', level: 'EMG', make: function (r) { return ppOverPp(r); } },
        { id: 'e7d', level: 'EMG', make: function (r) { return ppOverPp(r); } }] },
      { num: '8', stem: 'Simplify. Remember that the outer exponent hits the coefficient as well.', parts: [
        { id: 'e8a', level: 'PRG', make: function (r) { var c = r.int(2, 5), v = r.pick(LET), a = r.int(2, 5), d = r.int(1, 2 * a - 1); return chain([[c, [[v, a]], 2]], [[c * c, [[v, d]], 1]]); } },
        { id: 'e8b', level: 'PRG', make: function (r) { var c = r.pick([4, 5, 6, 3]), v = r.pick(LET), a = r.int(2, 4), d = r.int(1, 2 * a - 1), dd = r.pick([c * 2, c * 2, c * 3].filter(function (x) { return (c * c) % x !== 0; }).concat([2 * c])); return chain([[c, [[v, a]], 2]], [[dd, [[v, d]], 1]]); } },
        { id: 'e8c', level: 'PRG', make: function (r) { var c = -r.int(2, 3), v = r.pick(LET), a = r.int(2, 4), d = r.int(1, 3 * a - 1), C = Math.pow(c, 3), dd = r.pick([Math.abs(C) / Math.abs(c), Math.abs(C) / Math.abs(c) / (Math.abs(c) === 2 ? 2 : 3)].filter(function (x) { return x > 1; })); return chain([[c, [[v, a]], 3]], [[dd, [[v, d]], 1]]); } }] },
      { num: '9', stem: 'Simplify. Both the numerator and the denominator need a bracket cleared first.', parts: [
        { id: 'e9a', level: 'ADV', make: function (r) { var x = pickWhere(function () { return [r.pick([[2, 4, 4, 2], [2, 4, 4, 2], [2, 2, 4, 1], [3, 2, 9, 1], [2, 3, 8, 1], [2, 4, 16, 1], [3, 4, 9, 2], [2, 6, 8, 2], [5, 2, 25, 1]]), r.int(2, 4), r.int(2, 8)]; }, function (x) { var e = x[1] * x[0][1] - x[2] * x[0][3]; return e >= 1 && e <= 8; }), o = x[0];
          return chain([[o[0], [['x', x[1]]], o[1]]], [[o[2], [['x', x[2]]], o[3]]]); } },
        { id: 'e9b', level: 'ADV', make: function (r) { var vw = lets(r, 2).sort(), x = pickWhere(function () { return [r.int(2, 4), r.int(2, 4), r.int(2, 3), r.int(2, 5), r.int(2, 6), r.int(2, 3)]; }, function (x) { var e1 = x[0] * x[2] - x[3] * x[5], e2 = x[1] * x[2] - x[4] * x[5]; return x[2] > x[5] && e1 >= 1 && e2 >= 1 && e1 <= 8 && e2 <= 8; });
          return chain([[1, [[vw[0], x[0]], [vw[1], x[1]]], x[2]]], [[1, [[vw[0], x[3]], [vw[1], x[4]]], x[5]]]); } },
        { id: 'e9c', level: 'ADV', make: function (r) { var vw = lets(r, 2).sort(), c = r.pick([2, 2, 3]), a = r.int(3, 5), b = r.int(1, 2); return chain([[c, [[vw[0], a], [vw[1], b]], 3]], [[c, [[vw[0], r.int(1, a)], [vw[1], b]], 2]]); } }] },

      /* ===================== Part D ===================== */
      { num: '10', section: 'Part D — Error Analysis', stem: 'In each part, a student has made one mistake. Name the mistake, then give the correct simplified answer.',
        shared: function (r) { var ab = pickWhere(function () { return [r.int(2, 6), r.int(2, 6)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; }), c = r.pick([2, 2, 3]), q = r.int(2, 6), d = r.int(2, 6), mn = pickWhere(function () { return [r.int(6, 12), r.int(2, 4)]; }, function (x) { return x[0] % x[1] === 0 && x[0] / x[1] !== x[0] - x[1] && x[0] > x[1]; });
          return { v: r.pick(['x', 'x', 'y', 'a', 'm']), a: ab[0], b: ab[1], c: c, n: r.int(2, 5), p: r.int(3, 5), Q: q, D: d, m1: r.int(5, 9), m2: r.int(2, 4), M: mn[0], N: mn[1], q2: r.int(2, 6), d2: r.int(2, 6) }; },
        parts: [
          { id: 'e10a', sub: 'a i', level: 'EMG', make: function (r, s) { var v = s.v;
            return mc(r, 'Devon wrote ' + t(pw(par(pw(v, s.a)), s.b) + '=' + pw(v, s.a + s.b)) + '. What is the mistake?', [
              { html: 'He added the exponents instead of multiplying them.', right: true },
              { html: 'He should have subtracted the exponents.', why: 'Subtracting is for dividing powers.' },
              { html: 'He should have raised ' + t(s.a) + ' to the power ' + t(s.b) + '.', why: 'The exponents multiply: ' + t(s.a + '\\times ' + s.b) + ', not ' + t(pw(s.a, s.b)) + '.' },
              { html: 'There is no mistake.', why: 'Count the factors: ' + s.b + ' copies of ' + t(pw(v, s.a)) + '.' }],
              'A power of a power <b>multiplies</b> the exponents; Devon added them.', ['How many factors of ' + t(v) + ' are in ' + s.b + ' copies of ' + t(pw(v, s.a)) + '?'], 'error Devon'); } },
          { id: 'e10b', sub: 'a ii', level: 'BEG', make: function (r, s) { var p = ppLaw(s.v, s.a, s.b); p.prompt = 'Give the correct answer for ' + p.prompt + '.'; return p; } },
          { id: 'e10c', sub: 'b i', level: 'EMG', make: function (r, s) { var v = s.v, c = s.c, n = s.n, p = s.p;
            return mc(r, 'Priya wrote ' + t(pw(par(c + pw(v, n)), p) + '=' + c + pw(v, n * p)) + '. What is the mistake?', [
              { html: 'She raised only the variable; the ' + t(c) + ' must be raised to the power ' + t(p) + ' too.', right: true },
              { html: 'She should have added the exponents of ' + t(v) + '.', why: 'Multiplying ' + t(n + '\\times ' + p) + ' is right for a power of a power.' },
              { html: 'She should have multiplied the ' + t(c) + ' by ' + t(p) + '.', why: t(pw(c, p)) + ' means ' + t(c) + ' multiplied by itself ' + p + ' times, not ' + t(c + '\\times ' + p) + '.' },
              { html: 'There is no mistake.', why: 'Expand ' + t(par(c + pw(v, n))) + ' ' + p + ' times: how many ' + t(c) + 's are multiplied?' }],
              'The outer exponent applies to everything inside the brackets: ' + t(pw(c, p) + '=' + Math.pow(c, p)) + '. Priya forgot to raise the coefficient.', ['What is inside the brackets?'], 'error Priya'); } },
          { id: 'e10d', sub: 'b ii', level: 'EMG', make: function (r, s) { var p = powPart(s.c, [[s.v, s.n]], s.p); p.prompt = 'Give the correct answer for ' + p.prompt + '.'; return p; } },
          { id: 'e10e', sub: 'c i', level: 'EMG', make: function (r, s) { var v = s.v, q = s.Q, d = s.D, A = q * d, m = s.m1 + s.m2, n = s.m2;
            return mc(r, 'Malik wrote ' + t(dfr(A + pw(v, m), d + pw(v, n)) + '=' + (A - d) + pw(v, m - n)) + '. What is the mistake?', [
              { html: 'He subtracted the coefficients instead of dividing them: ' + t(A + '\\div ' + d + '=' + q) + '.', right: true },
              { html: 'He should have divided the exponents.', why: 'Subtracting the exponents is right (Quotient Law). Look at the numbers in front.' },
              { html: 'He should have added the exponents.', why: 'Dividing powers subtracts the exponents — his exponent is right.' },
              { html: 'There is no mistake.', why: 'Check the coefficient: ' + t(A + '\\div ' + d) + '.' }],
              'Coefficients <b>divide</b>: ' + t(A + '\\div ' + d + '=' + q) + '. The exponents subtract (that part was right).', ['Check the coefficient and the exponent separately.'], 'error Malik'); } },
          { id: 'e10f', sub: 'c ii', level: 'BEG', make: function (r, s) { var q = s.Q, d = s.D, m = s.m1 + s.m2, n = s.m2, p = quotPart(q * d, [[s.v, m]], d, [[s.v, n]], 'frac'); p.prompt = 'Give the correct answer for ' + p.prompt + '.'; return p; } },
          { id: 'e10g', sub: 'd i', level: 'EMG', make: function (r, s) { var v = s.v, q = s.q2, d = s.d2, A = q * d, m = s.M, n = s.N;
            return mc(r, 'Jenna wrote ' + t(dfr(A + pw(v, m), d + pw(v, n)) + '=' + q + pw(v, m / n)) + '. What is the mistake?', [
              { html: 'She divided the exponents instead of subtracting them: ' + t(m + '-' + n + '=' + (m - n)) + '.', right: true },
              { html: 'She should have subtracted the coefficients.', why: 'Coefficients divide: ' + t(A + '\\div ' + d + '=' + q) + ' is right.' },
              { html: 'She should have multiplied the exponents.', why: 'Multiplying exponents is the Power of a Power Law. Here powers are divided.' },
              { html: 'There is no mistake.', why: 'Cancel ' + n + ' factors of ' + t(v) + ' from the top: how many are left?' }],
              'The Quotient Law <b>subtracts</b> the exponents: ' + t(m + '-' + n + '=' + (m - n)) + '. Jenna divided them.', ['Cancel the common factors of ' + t(v) + '.'], 'error Jenna'); } },
          { id: 'e10h', sub: 'd ii', level: 'BEG', make: function (r, s) { var p = quotPart(s.q2 * s.d2, [[s.v, s.M]], s.d2, [[s.v, s.N]], 'frac'); p.prompt = 'Give the correct answer for ' + p.prompt + '.'; return p; } }] },
      { num: '11', stem: function (sh) { return 'Sam claims that ' + t(dfr(pw(sh.v, sh.m), pw(sh.v, sh.n)) + '=' + pw(sh.v, sh.m / sh.n)) + ' “because ' + t(sh.m + '\\div ' + sh.n + '=' + sh.m / sh.n) + '.”'; },
        shared: function (r) { var o = r.pick([[10, 2], [10, 2], [8, 2], [6, 2], [9, 3], [12, 3], [8, 4], [12, 4], [12, 6], [6, 3], [10, 5], [12, 2]]); return { m: o[0], n: o[1], b: 2, v: r.pick(['x', 'x', 'y', 'a', 'm', 'k', 'n', 't']) }; },
        parts: [
          { id: 'e11a', level: 'EMG', make: function (r, s) { var m = s.m, n = s.n, v = s.v;
            return mc(r, 'Why is Sam wrong?', [
              { html: 'The Quotient Law <b>subtracts</b> exponents: ' + t(n) + ' factors of ' + t(v) + ' cancel, leaving ' + t(m + '-' + n + '=' + (m - n)) + '.', right: true },
              { html: 'He should have multiplied the exponents.', why: 'Multiplying exponents is for a power of a power.' },
              { html: 'He is right: you divide the powers, so you divide the exponents.', why: 'Write it out: ' + m + ' factors on top, ' + n + ' on the bottom. How many are left after cancelling?' },
              { html: 'He should have added the exponents.', why: 'Adding is for multiplying powers.' }],
              t(fr(pw(v, m), pw(v, n)) + '=' + pw(v, m + '-' + n) + '=' + pw(v, m - n)) + ': cancelling removes ' + n + ' factors, it doesn’t divide the number of factors by ' + n + '.', ['Cancel the common factors.'], 'why Sam wrong'); } },
          { id: 'e11b', level: 'BEG', make: function (r, s) { var m = s.m, n = s.n, b = s.b, e = m - n, V = Math.pow(b, e), S = Math.pow(b, m / n), fl = [fld('Single power', t(dfr(pw(b, m), pw(b, n))) + ' as a single power:', true), fld('Value', 'its value:'), fld('Sam', 'the value of Sam’s ' + t(pw(b, m / n)) + ':')];
            return P.fields('Check with numbers: write ' + t(dfr(pw(b, m), pw(b, n))) + ' as a single power and evaluate it, then evaluate Sam’s version.', fl,
              [singlePow(b, e, [[m / n, 'div-exp', 'That is Sam’s mistake — subtract the exponents.'], [m + n, 'law-added', 'Dividing subtracts the exponents.']]), numCk(V, [[S, 'div-exp', 'Subtract the exponents: ' + t(m + '-' + n) + '.']]), numCk(S, [[V, 'div-exp', 'Evaluate Sam’s power ' + t(pw(b, m / n)) + ' itself.']])],
              [pw(b, e), String(V), String(S)], t(pw(b, e) + '=' + F(V)) + '; Sam’s ' + t(pw(b, m / n) + '=' + S),
              t(fr(pw(b, m), pw(b, n)) + '=' + fr(F(Math.pow(b, m)), Math.pow(b, n)) + '=' + F(V) + '=' + pw(b, e)) + ', while ' + t(pw(b, m / n) + '=' + S) + '. The values differ, so Sam’s rule fails.', ['Evaluate the top and the bottom, then divide.'], 'Sam check'); } }] },

      /* ===================== Part E ===================== */
      { num: '12', section: 'Part E — Working Backwards', stem: 'Determine the missing whole-number exponent in each equation.', parts: [
        { id: 'e12a', level: 'PRG', make: function (r) { var p = r.int(2, 6), a = r.int(2, 9), s = p * a;
          return missPart(pw(par(pw('x', 'a')), p) + '=' + pw('x', s), a, 'a', [[s - p, 'add-exp', 'Power of a Power: ' + t(p + 'a=' + s) + '.'], [s * p, 'multiplied', t(p + 'a=' + s) + ': divide.']], LAW.pp + ': ' + t(p + 'a=' + s) + ', so ' + t('a=' + a) + '.', 'Multiply the exponents, then match.'); } },
        { id: 'e12b', level: 'PRG', make: function (r) { var y = r.int(2, 9), q = r.int(2, 9), T = y + q;
          return missPart(dfr(pw('x', T), pw('x', 'q')) + '=' + pw('x', y), q, 'q', [[T + y, 'u2l2-sub-x', t(T + '-q=' + y) + ': ' + t('q') + ' is less than ' + t(T) + '.'], [T / y, 'div-exp', 'Subtract the exponents: ' + t(T + '-q=' + y) + '.']], LAW.quot + ': ' + t(T + '-q=' + y) + ', so ' + t('q=' + q) + '.', 'Use the Quotient Law, then match.'); } },
        { id: 'e12c', level: 'PRG', make: function (r) { var p = r.int(2, 9), n = r.int(2, 9), s = p * n;
          return missPart(pw(par(pw('m', p)), 'n') + '=' + pw('m', s), n, 'n', [[s - p, 'add-exp', 'Power of a Power: ' + t(p + 'n=' + s) + '.'], [s * p, 'multiplied', t(p + 'n=' + s) + ': divide.']], LAW.pp + ': ' + t(p + 'n=' + s) + ', so ' + t('n=' + n) + '.', 'Multiply the exponents, then match.'); } },
        { id: 'e12d', level: 'ADV', make: function (r) { var p = r.int(2, 4), a = r.int(2, 7), d = r.int(2, 6), R = p * a - d; if (R < 2) { a += 2; R = p * a - d; }
          return missPart(dfr(pw(par(pw('y', p)), 'a'), pw('y', d)) + '=' + pw('y', R), a, 'a', [[(R - d) / p, 'law-added', 'The ' + t(d) + ' is subtracted on the left, so add it back: ' + t(p + 'a=' + R + '+' + d) + '.'], [R + d, 'divided-total', 'You found ' + t(p + 'a') + '. Divide by ' + t(p) + '.'], [R + d - p, 'add-exp', 'Power of a Power: ' + t(pw(par(pw('y', p)), 'a') + '=' + pw('y', p + 'a')) + '.']],
            'Simplify: ' + t(pw('y', p + 'a-' + d) + '=' + pw('y', R)) + '. So ' + t(p + 'a-' + d + '=' + R) + ', ' + t(p + 'a=' + (R + d)) + ', and ' + t('a=' + a) + '.', 'Write the left side as one power of ' + t('y') + ' with ' + t('a') + ' in its exponent.'); } }] },
      { num: '13', stem: 'Determine <b>both</b> missing values in each equation. <i>Hint:</i> start with the coefficient — it pins down the outer exponent first.', parts: [
        { id: 'e13a', level: 'ADV', make: function (r) { var c = r.pick([3, 3, 2, 5, 4]), b = c === 2 ? r.int(3, 5) : c === 3 ? r.int(2, 4) : r.pick([2, 3]), a = r.int(2, 6); if (r.chance(0.15)) { c = 3; b = 3; a = 4; } return twoUnk(c, 'x', a, b, [], ['a', 'b']); } },
        { id: 'e13b', level: 'ADV', make: function (r) { var c = r.pick([2, 2, 3, 10]), b = c === 2 ? r.int(3, 6) : r.int(2, 4), a = r.int(2, 6); if (r.chance(0.15)) { c = 2; b = 4; a = 5; } return twoUnk(c, 'x', a, b, [], ['a', 'b']); } },
        { id: 'e13c', level: 'ADV', make: function (r) { var c = r.pick([5, 2, 3, 4]), n = c === 2 ? r.int(3, 5) : r.pick([2, 3]), m = r.int(2, 5), k = r.int(1, 3); if (r.chance(0.15)) { c = 5; n = 3; m = 3; k = 2; } return twoUnk(c, 'a', m, n, [['b', k]], ['m', 'n']); } }] },
      { num: '14', stem: 'Fill in the missing expression so that each statement is true.', parts: [
        { id: 'e14a', level: 'ADV', make: function (r) { var v = r.pick(['x', 'x', 'y', 'a']), q = r.int(2, 6), d = r.int(2, 6), n = r.int(2, 5), m = n + r.int(2, 6), A = q * d;
          return expoPart(t(A + pw(v, m) + '\\div\\square=' + q + pw(v, m - n)) + '. What goes in the box?', d + vt(v, n), [[both(cIs(A - q), eIs(v, n)), 'coef-sub', 'Coefficients divide: ' + t(A + '\\div\\square=' + q) + '.'], [both(cIs(q), eIs(v, 2 * m - n)), 'u2l2-flip', 'The box is the divisor: what do you divide ' + t(A + pw(v, m)) + ' by to get ' + t(q + pw(v, m - n)) + '?'], [eIs(v, 2 * m - n), 'law-added', 'Exponents subtract: ' + t(m + '-\\square=' + (m - n)) + '.'], [both(cIs(A * q), eIs(v, 2 * m - n)), 'multiplied', 'Divide, don’t multiply.']],
            'Dividing by the box gives ' + t(q + pw(v, m - n)) + ', so the box is ' + t(A + pw(v, m) + '\\div ' + q + pw(v, m - n) + '=' + d + vt(v, n)) + '. Check: ' + t(A + '\\div ' + d + '=' + q) + ' and ' + t(m + '-' + n + '=' + (m - n)) + '.', ['Coefficients: ' + t(A + '\\div ?=' + q) + '. Exponents: ' + t(m + '-?=' + (m - n)) + '.'], A + v + '^' + m + ' / ? = ' + q + v + '^' + (m - n)); } },
        { id: 'e14b', level: 'PRG', make: function (r) { var v = r.pick(['a', 'a', 'b', 'm']), d = r.int(2, 9), q = r.int(2, 9), n = r.int(2, 6), k = r.int(2, 6), A = q * d, m = n + k;
          return expoPart(t('\\square\\div ' + d + pw(v, n) + '=' + q + pw(v, k)) + '. What goes in the box?', A + pw(v, m), [[cIs(d + q), 'coef-added', 'Coefficients: the box divided by ' + t(d) + ' gives ' + t(q) + ', so multiply.'], [eIs(v, k - n), 'u2l2-sub-x', 'Exponents: ' + t('\\square-' + n + '=' + k) + ', so add.'], [eIs(v, n * k), 'mult-exp', 'Exponents: ' + t('\\square-' + n + '=' + k) + ', so add.']],
            'Undo the division by multiplying: ' + t(par(q + pw(v, k)) + par(d + pw(v, n)) + '=' + A + pw(v, m)) + '. Check: ' + t(A + '\\div ' + d + '=' + q) + ' and ' + t(m + '-' + n + '=' + k) + '.', ['Multiply the answer by the divisor.'], '? / ' + d + v + '^' + n + ' = ' + q + v + '^' + k); } },
        { id: 'e14c', level: 'ADV', make: function (r) { var vw = r.pick([['m', 'n'], ['x', 'y'], ['a', 'b'], ['p', 'q']]), c = r.pick([2, 2, 3, 4, 5]), p = r.pick([2, 3, 3]), a = r.int(1, 4), b = r.int(2, 4), C = Math.pow(c, p), inner = c + vt(vw[0], a) + vt(vw[1], b), out = C + pw(vw[0], a * p) + pw(vw[1], b * p);
          return expoPart(t(pw(par('\\square'), p) + '=' + out) + '. What goes in the box?', inner, [[cIs(C), 'coef-not-raised', 'The box is raised to the power ' + t(p) + ', its coefficient too: which number to the power ' + t(p) + ' is ' + t(C) + '?'], [cIs(C / p), 'coef-times', 'The coefficient is raised to the power ' + t(p) + ', not multiplied by it.'], [eIs(vw[0], a * p - p), 'add-exp', 'Exponents multiply: ' + t('\\square\\times ' + p + '=' + a * p) + '.']],
            'Work backwards: ' + t(pw(par(inner), p) + '=' + pw(c, p) + pw(vw[0], a + '\\times ' + p) + pw(vw[1], b + '\\times ' + p) + '=' + out) + '. So the box is ' + t(inner) + '.', ['Which number to the power ' + t(p) + ' gives ' + t(C) + '? Which exponent times ' + t(p) + ' gives each exponent?'], '(?)^' + p + ' = ' + plain(out)); } }] },

      /* ===================== Part F ===================== */
      { num: '15', section: 'Part F — Numerical Checks, Reasoning, and Applications', stem: function (sh) { return 'Verify the Quotient Law numerically: show that ' + t(dfr(pw(sh.b, sh.m), pw(sh.b, sh.n)) + '=' + pw(sh.b, sh.m - sh.n)) + '.'; },
        shared: function (r) { var o = r.pick([[3, 7, 4], [3, 7, 4], [3, 6, 2], [3, 5, 2], [3, 6, 4], [2, 10, 6], [2, 11, 7], [2, 9, 4], [2, 10, 3], [2, 8, 5], [2, 11, 8], [5, 5, 3], [5, 4, 1], [4, 5, 2], [4, 6, 3], [3, 7, 5], [2, 12, 9], [10, 6, 2], [10, 7, 4], [6, 4, 2]]); return { b: o[0], m: o[1], n: o[2] }; },
        parts: [
          { id: 'e15', level: 'EMG', make: function (r, s) { var b = s.b, m = s.m, n = s.n, T = Math.pow(b, m), B = Math.pow(b, n), Q = T / B, fl = [fld('Top', 'numerator ' + t(pw(b, m) + '=')), fld('Bottom', 'denominator ' + t(pw(b, n) + '=')), fld('Quotient', 'quotient:'), fld('Right', 'right side ' + t(pw(b, m - n) + '='))];
            return P.fields('Evaluate the numerator, the denominator and the quotient on the left side, and evaluate the right side.', fl, [numCk(T, [[b * m, 'times-exp', t(pw(b, m)) + ' means ' + t(b) + ' multiplied by itself ' + m + ' times.']]), numCk(B, [[b * n, 'times-exp', t(pw(b, n)) + ' means ' + t(b) + ' multiplied by itself ' + n + ' times.']]), numCk(Q, [[T - B, 'subtracted', 'Divide the numerator by the denominator.']]), numCk(Q, [[b * (m - n), 'times-exp', 'Multiply ' + t(b) + ' by itself ' + (m - n) + ' times.']])],
              [String(T), String(B), String(Q), String(Q)], t(F(T) + '\\div ' + F(B) + '=' + F(Q)) + ' and ' + t(pw(b, m - n) + '=' + F(Q)), t(pw(b, m) + '=' + F(T)) + ', ' + t(pw(b, n) + '=' + F(B)) + ', ' + t(F(T) + '\\div ' + F(B) + '=' + F(Q)) + '; ' + t(pw(b, m - n) + '=' + F(Q)) + '. The two sides agree.', ['Evaluate each power by repeated multiplication.'], 'verify quotient law'); } }] },
      { num: '16', stem: function (sh) { return 'Verify the Power of a Power Law numerically: show that ' + t(pw(par(pw(sh.b, sh.m)), sh.n) + '=' + pw(sh.b, sh.m * sh.n)) + ' by evaluating each side.'; },
        shared: function (r) { var o = r.pick([[2, 3, 4], [2, 3, 4], [2, 2, 5], [2, 5, 2], [2, 4, 3], [2, 2, 3], [3, 2, 3], [3, 3, 2], [3, 2, 2], [2, 2, 4], [2, 4, 2], [5, 2, 2], [4, 2, 3], [4, 3, 2], [10, 2, 3], [10, 3, 2], [6, 2, 2], [7, 2, 2], [2, 6, 2], [2, 2, 6]]); return { b: o[0], m: o[1], n: o[2] }; },
        parts: [
          { id: 'e16a', level: 'EMG', make: function (r, s) { var b = s.b, m = s.m, n = s.n, I = Math.pow(b, m), V = Math.pow(b, m * n), fl = [fld('Inside', t(pw(b, m) + '=')), fld('Left', 'left side ' + t(pw(par(pw(b, m)), n) + '=' + pw(I, n) + '=')), fld('Right', 'right side ' + t(pw(b, m * n) + '='))];
            return P.fields('Evaluate each side.', fl, [numCk(I, [[b * m, 'times-exp', t(pw(b, m)) + ' means ' + t(b) + ' multiplied by itself ' + m + ' times.']]), numCk(V, [[I * n, 'times-exp', t(pw(I, n)) + ' means ' + t(I) + ' multiplied by itself ' + n + ' times.'], [Math.pow(b, m + n), 'add-exp', 'Work out ' + t(pw(I, n)) + ' itself.']]), numCk(V, [[Math.pow(b, m + n), 'add-exp', 'Multiply ' + t(b) + ' by itself ' + m * n + ' times.']])],
              [String(I), String(V), String(V)], t(pw(b, m) + '=' + I) + ', ' + t(pw(I, n) + '=' + F(V)) + ' and ' + t(pw(b, m * n) + '=' + F(V)), t(pw(b, m) + '=' + I) + ' and ' + t(pw(I, n) + '=' + F(V)) + '; ' + t(pw(b, m * n) + '=' + F(V)) + '. The sides agree.', ['Work out the inside power first.'], 'verify power of power'); } },
          { id: 'e16b', level: 'EMG', make: function (r, s) { var m = s.m, n = s.n, b = s.b;
            return mc(r, 'Using the meaning of an exponent, why do the exponents get <b>multiplied</b> rather than added?', [
              { html: 'The outer exponent says to write ' + t(n) + ' copies of ' + t(pw(b, m)) + ' — that is ' + t(n) + ' groups of ' + t(m) + ' factors of ' + t(b) + ', so ' + t(n + '\\times ' + m + '=' + m * n) + ' factors.', right: true },
              { html: 'Because there are brackets, and brackets always mean multiply.', why: 'The reason is about counting factors: how many copies of ' + t(pw(b, m)) + ', each with how many factors?' },
              { html: 'The two exponents are ' + t(m) + ' and ' + t(n) + ', so there are ' + t(m + '+' + n) + ' factors.', why: 'That counts one group of ' + m + ' and one group of ' + n + '. Here there are ' + n + ' groups of ' + m + '.' },
              { html: 'Because ' + t(pw(b, m)) + ' is multiplied by ' + t(n) + '.', why: 'An exponent means repeated multiplication of the base, not multiplying by ' + t(n) + '.' }],
              t(pw(par(pw(b, m)), n)) + ' is ' + n + ' copies of the block ' + t(pw(b, m)) + ', and each block holds ' + m + ' factors of ' + t(b) + '. Counting equal groups is multiplication: ' + t(n + '\\times ' + m + '=' + m * n) + ' factors.', ['What does the outer exponent ' + t(n) + ' tell you to do?'], 'why multiply'); } }] },
      { num: '17', stem: function (sh) { return '<b>A preview of Lesson 5.</b> Consider ' + t(dfr(pw(sh.v, sh.k), pw(sh.v, sh.k))) + ', where ' + t(sh.v + '\\neq 0') + '.'; },
        shared: function (r) { return { v: r.pick(['x', 'x', 'y', 'a', 'm', 'n']), k: r.int(2, 9), b: r.pick([3, 2, 4, 5]) }; },
        parts: [
          { id: 'e17a', level: 'EMG', make: function (r, s) { var v = s.v, k = s.k;
            return P.math('Simplify it using the Quotient Law (write the power it gives).', powerEq(v, '0'), pw(v, 0), LAW.quot + ': ' + t(fr(pw(v, k), pw(v, k)) + '=' + pw(v, k + '-' + k) + '=' + pw(v, 0)) + '.', ['Subtract the exponents.'], v + '^' + k + '/' + v + '^' + k + ' quotient law', { keys: 'expo', vars: [v] }); } },
          { id: 'e17b', level: 'BEG', make: function (r, s) { var v = s.v, k = s.k;
            return numPart('Simplify it by cancelling the ' + k + ' matching factors instead.', 1, [[0, 'zero-is-0', 'When every factor cancels, ' + t(fr(v + '\\cdots', v + '\\cdots')) + ' is ' + t(1) + ' — a number divided by itself — not ' + t(0) + '.'], [k, 'count', 'Every factor cancels: what is a number divided by itself?']], 'Every factor on top cancels with one on the bottom: ' + t(fr(pw(v, k), pw(v, k)) + '=1') + ' (any nonzero number divided by itself is ' + t(1) + ').', ['What is any nonzero number divided by itself?'], 'cancel all factors'); } },
          { id: 'e17c', level: 'EMG', make: function (r, s) { var v = s.v, k = s.k, b = s.b, B = Math.pow(b, k), fl = [fld('Zero', 'so ' + t(pw(v, 0) + '=')), fld('Test', 'test: ' + t(pw(b, k) + '=')), fld('Quotient', t(dfr(pw(b, k), pw(b, k)) + '='))];
            return P.fields('What must ' + t(pw(v, 0)) + ' equal? Test it with ' + t(dfr(pw(b, k), pw(b, k))) + '.', fl, [numCk(1, [[0, 'zero-is-0', 'Both ways of simplifying must agree: part (b) gave ' + t(1) + '.']]), numCk(B, [[b * k, 'times-exp', t(pw(b, k)) + ' means ' + t(b) + ' multiplied by itself ' + k + ' times.']]), numCk(1, [[0, 'zero-is-0', 'A number divided by itself is ' + t(1) + '.']])],
              ['1', String(B), '1'], t(pw(v, 0) + '=1') + '; ' + t(fr(F(B), F(B)) + '=1'), 'Both ways describe the same quotient, so ' + t(pw(v, 0) + '=1') + '. Check: ' + t(fr(pw(b, k), pw(b, k)) + '=' + fr(F(B), F(B)) + '=1') + ' and the Quotient Law gives ' + t(pw(b, 0)) + '.', ['Parts (a) and (b) simplified the same thing.'], 'x^0 = 1'); } }] },
      { num: '18', stem: function (sh) { return 'A large cube has an edge length of ' + t(pw(sh.v, sh.k)) + ' centimetres. A small cube has an edge length of ' + t(sh.v) + ' centimetres.'; },
        shared: function (r) { var k = r.pick([3, 3, 2, 4, 5]), x = k >= 4 ? 2 : r.pick([2, 2, 3]), v = r.pick(['x', 'x', 'x', 'a', 's', 'k', 'n', 'p']); if (r.chance(0.2)) { k = 3; x = 2; v = 'x'; } return { k: k, x: x, v: v }; },
        parts: [
          { id: 'e18a', level: 'EMG', make: function (r, s) { var k = s.k, X = s.v, fl = [fld('Large', 'large cube volume:', true, [X]), fld('Small', 'small cube volume:', true, [X])];
            return P.fields('Write the volume of each cube as a power.', fl, [expoCk(pw(X, 3 * k), [[eIs(X, k + 3), 'add-exp', 'Volume = edge × edge × edge = ' + t(pw(par(pw(X, k)), 3)) + ': multiply the exponents.'], [eIs(X, 2 * k), 'u2l2-sa-cube', 'Volume uses three edges: ' + t(pw(par(pw(X, k)), 3)) + '.']]), expoCk(pw(X, 3), [[eIs(X, 1), 'count', 'Volume = edge × edge × edge.']])],
              [pw(X, 3 * k), pw(X, 3)], t(pw(X, 3 * k)) + ' and ' + t(pw(X, 3)), 'Large: ' + t(pw(par(pw(X, k)), 3) + '=' + pw(X, 3 * k)) + ' cm³. Small: ' + t(pw(X, 3)) + ' cm³.', ['The volume of a cube is (edge)³.'], 'cube volumes'); } },
          { id: 'e18b', level: 'EMG', make: function (r, s) { var k = s.k, X = s.v;
            return expoPart('Write the ratio of the large volume to the small volume, simplified.', pw(X, 3 * k - 3), [[eIs(X, k), 'div-exp', 'Subtract the exponents: ' + t(3 * k + '-3') + '.'], [eIs(X, 3 * k + 3), 'law-added', 'A ratio is a quotient: subtract the exponents.'], [eIs(X, 3 - 3 * k), 'u2l2-ratio-flip', 'Large to small: the large volume goes on top.']],
              t(fr(pw(X, 3 * k), pw(X, 3)) + '=' + pw(X, 3 * k + '-3') + '=' + pw(X, 3 * k - 3)) + '.', ['Divide the large volume by the small volume.'], 'volume ratio'); } },
          { id: 'e18c', level: 'PRG', make: function (r, s) { var k = s.k, X = s.v, x = s.x, N = Math.pow(x, 3 * k - 3);
            return numPart('How many small cubes fit in the large one when ' + t(X + '=' + x) + '?', N, [[Math.pow(x, k), 'div-exp', 'Use the volume ratio ' + t(pw(X, 3 * k - 3)) + '.'], [Math.pow(x, 3 * k), 'count', 'That is the large volume. Divide by the small cube’s volume ' + t(pw(x, 3) + '=' + Math.pow(x, 3)) + '.']],
              'The number of small cubes is the volume ratio: ' + t(pw(X, 3 * k - 3) + '=' + pw(x, 3 * k - 3) + '=' + F(N)) + '. (Check: ' + t(F(Math.pow(x, 3 * k)) + '\\div ' + Math.pow(x, 3) + '=' + F(N)) + '.)', ['Substitute into the ratio from (b).'], 'how many cubes x=' + x); } },
          { id: 'e18d', level: 'ADV', make: function (r, s) { var k = s.k, X = s.v;
            return expoPart('Write the ratio of their surface areas (large to small), simplified.', pw(X, 2 * k - 2), [[eIs(X, 3 * k - 3), 'u2l2-sa-cube', 'Surface area uses squares (6 faces of edge × edge), not cubes: ' + t('6' + pw(par(pw(X, k)), 2)) + '.'], [eIs(X, 2 - 2 * k), 'u2l2-ratio-flip', 'Large to small: the large area goes on top.'], [eIs(X, 2 * k + 2), 'law-added', 'A ratio is a quotient: subtract.']],
              'Surface area = 6 × (edge)². Large: ' + t('6' + pw(par(pw(X, k)), 2) + '=6' + pw(X, 2 * k)) + '. Small: ' + t('6' + pw(X, 2)) + '. Ratio: ' + t(fr('6' + pw(X, 2 * k), '6' + pw(X, 2)) + '=' + pw(X, 2 * k - 2)) + '.', ['A cube has 6 square faces, each edge × edge.'], 'surface area ratio'); } }] },
      { num: '19', stem: function (sh) { return 'A square has a side length of ' + t(sh.c + pw('x', sh.a)) + ' metres and a rectangle has dimensions ' + t(cT(sh.c1, vt('x', sh.b))) + ' metres by ' + t(cT(sh.c2, vt('x', sh.d))) + ' metres.'; },
        shared: function (r) { var o = r.pick([[4, 2, 8], [4, 2, 8], [4, 1, 16], [6, 4, 9], [6, 3, 12], [6, 2, 18], [3, 1, 9], [2, 1, 4], [5, 1, 25], [8, 4, 16], [8, 2, 32], [10, 4, 25], [10, 5, 20], [9, 3, 27]]), a = r.int(2, 4), bd = pickWhere(function () { return [r.int(1, 4), r.int(1, 4)]; }, function (x) { return x[0] + x[1] < 2 * a; });
          if (r.chance(0.15)) { o = [4, 2, 8]; a = 3; bd = [2, 3]; } return { c: o[0], c1: o[1], c2: o[2], a: a, b: bd[0], d: bd[1] }; },
        parts: [
          { id: 'e19a', level: 'EMG', make: function (r, s) { var m = powMono(s.c, [['x', s.a]], 2); return expoPart('Write the area of the square as a simplified monomial.', m.res, m.rows, 'Area = side² = ' + m.sol.replace(/^The outside exponent[^:]*: /, ''), ['Area of a square = side × side = (side)². Square the coefficient too.'], 'square area'); } },
          { id: 'e19b', level: 'EMG', make: function (r, s) { var C = s.c1 * s.c2, E = s.b + s.d, res = cT(C, vt('x', E));
            return expoPart('Write the area of the rectangle as a simplified monomial.', res, [[cIs(s.c1 + s.c2), 'coef-added', 'Coefficients multiply: ' + t(s.c1 + '\\times ' + s.c2) + '.'], [eIs('x', s.b * s.d), 'mult-exp', 'Product Law: add the exponents.']],
              'Area = length × width = ' + t(par(cT(s.c1, vt('x', s.b))) + par(cT(s.c2, vt('x', s.d))) + '=' + res) + '.', ['Multiply the coefficients; add the exponents.'], 'rectangle area'); } },
          { id: 'e19c', level: 'PRG', make: function (r, s) { var e = 2 * s.a - s.b - s.d, res = vt('x', e);
            return expoPart('Simplify the ratio of the square’s area to the rectangle’s area.', res, [[eIs('x', -e), 'u2l2-ratio-flip', 'Square to rectangle: the square’s area goes on top.'], [eIs('x', 2 * s.a + s.b + s.d), 'law-added', 'A ratio is a quotient: subtract the exponents.']],
              t(fr(s.c * s.c + pw('x', 2 * s.a), s.c1 * s.c2 + vt('x', s.b + s.d)) + '=' + res) + ' (the coefficients ' + t(s.c * s.c) + ' and ' + t(s.c1 * s.c2) + ' are equal and cancel). The square’s area is ' + t(res) + ' times as large.', ['Divide your answer to (a) by your answer to (b).'], 'area ratio'); } }] },
      { num: '20', stem: '<b>Stretch.</b> Show every step: clear the bracket, use the Product Law on the numerator, then use the Quotient Law.', parts: [
        { id: 'e20', level: 'ADV', make: function (r) { var x = pickWhere(function () { return [r.pick([2, 2, 3]), r.int(2, 4), r.int(2, 4), r.int(2, 6), r.int(6, 14)]; }, function (x) { var e = x[1] * x[2] + x[3] - x[4]; return e >= 2 && e <= (x[0] === 2 ? 6 : 4) && x[4] > x[3]; }); if (r.chance(0.2)) x = [2, 3, 4, 5, 12];
          var b = x[0], m = x[1], n = x[2], p = x[3], d = x[4], e = m * n + p - d, tex = dfr(pw(par(pw(b, m)), n) + '\\times ' + pw(b, p), pw(b, d));
          return lawEval(tex, b, String(b), e, [[m + n + p - d, 'u2l2-no-pp', 'Clear the bracket first: ' + t(pw(par(pw(b, m)), n) + '=' + pw(b, m * n)) + '.'], [m * n + p + d, 'law-added', 'Dividing subtracts the exponents.'], [m * n * p - d, 'mult-exp', 'Product Law on the numerator: <b>add</b> the exponents.']],
            'Bracket: ' + t(pw(par(pw(b, m)), n) + '=' + pw(b, m * n)) + '. Numerator: ' + t(pw(b, m * n) + '\\times ' + pw(b, p) + '=' + pw(b, m * n + p)) + '. Quotient: ' + t(fr(pw(b, m * n + p), pw(b, d)) + '=' + pw(b, e) + '=' + Math.pow(b, e)) + '.', ['Bracket first (multiply), then the top (add), then divide (subtract).'], plain(tex)); } }] },
      { num: '21', stem: '<b>Stretch.</b> Simplify completely. Work out the numerator and the denominator separately before dividing.', parts: [
        { id: 'e21', level: 'MAS', make: function (r) { var x = pickWhere(function () { return [r.pick([2, 3, 3]), r.int(2, 3), r.int(2, 5), r.int(2, 3), r.pick([2, 3, 4])]; }, function (x) { return 3 * x[1] + x[2] - 2 * x[3] >= 1 && 3 * x[1] + x[2] - 2 * x[3] <= 8; });
          var c = x[0], a = x[1], f = x[2], g = x[3], k = x[4]; if (r.chance(0.2)) { c = 3; a = 2; f = 4; g = 3; k = 2; }
          var top = mMul(mPow(M(c, [['x', a], ['y', 1]]), 3), M(k, [['x', f]])), bot = mMul(mPow(M(c, [['x', g]]), 2), M(1, [['y', 1]])), R = mDiv(top, bot), res = mTex(R);
          var tex = dfr(pw(par(c + pw('x', a) + 'y'), 3) + '\\times ' + k + pw('x', f), pw(par(c + pw('x', g)), 2) + '\\times y');
          return expoPart(t(tex), res, [[cIs(k), 'coef-not-raised', 'Raise the ' + t(c) + ' inside each bracket to that bracket’s power: ' + t(pw(c, 3) + '=' + c * c * c) + ' on top and ' + t(pw(c, 2) + '=' + c * c) + ' on the bottom.'], [eIs('y', 3), 'count', 'Divide the ' + t('y') + 's too: ' + t(fr(pw('y', 3), 'y') + '=' + pw('y', 2)) + '.'], [eIs('x', a + 3 + f - g - 2), 'add-exp', 'Power of a Power: <b>multiply</b> the exponents inside each bracket by its outer exponent.']],
            'Numerator: ' + t(pw(par(c + pw('x', a) + 'y'), 3) + '\\times ' + k + pw('x', f) + '=' + mTex(mPow(M(c, [['x', a], ['y', 1]]), 3)) + '\\times ' + k + pw('x', f) + '=' + mTex(top)) + '. Denominator: ' + t(pw(par(c + pw('x', g)), 2) + '\\times y=' + mTex(bot)) + '. Quotient: ' + t(fr(mTex(top), mTex(bot)) + '=' + res) + '.',
            ['Numerator first: clear the bracket (raise every factor), then multiply by ' + t(k + pw('x', f)) + '.', 'Then the denominator, then divide: coefficients divide, exponents subtract.'], 'stretch quotient'); } }] },
      { num: '22', stem: function (sh) { return '<b>Stretch.</b> Without a calculator, decide which is larger: ' + t(pw(par(pw(2, sh.a)), sh.b)) + ' or ' + t(pw(par(pw(2, sh.c)), sh.d)) + '. Justify your choice by rewriting each as a single power of ' + t(2) + '.'; },
        shared: function (r) { var x = pickWhere(function () { return [r.int(2, 6), r.int(2, 6), r.int(2, 6), r.int(2, 6)]; }, function (x) { var A = x[0] * x[1], B = x[2] * x[3]; return A !== B && Math.abs(A - B) <= 6 && !(x[0] === x[3] && x[1] === x[2]); }); if (r.chance(0.2)) x = [4, 3, 3, 5]; return { a: x[0], b: x[1], c: x[2], d: x[3] }; },
        parts: [
          { id: 'e22', level: 'ADV', make: function (r, s) { var A = s.a * s.b, B = s.c * s.d, big = A > B ? pw(par(pw(2, s.c)), s.d) : pw(par(pw(2, s.a)), s.b), D = Math.abs(A - B);
            var fl = [fld('First', t(pw(par(pw(2, s.a)), s.b) + '='), true), fld('Second', t(pw(par(pw(2, s.c)), s.d) + '='), true), fld('By', 'the larger one is larger by a factor of', true)];
            fl[0].vars = fl[1].vars = fl[2].vars = [];
            var bigTex = A > B ? pw(par(pw(2, s.a)), s.b) : pw(par(pw(2, s.c)), s.d);
            return P.fields('Write each as a single power of ' + t(2) + ', then say how much larger the larger one is, as a power of ' + t(2) + '.', fl,
              [singlePow(2, A, [[s.a + s.b, 'add-exp', 'Power of a Power: multiply the exponents.']]), singlePow(2, B, [[s.c + s.d, 'add-exp', 'Power of a Power: multiply the exponents.']]),
                function (resp) { var x = K.read(resp); if (x.res) return x.res; if (ex.eq(x.val, Math.pow(2, D))) return strip(x.ast).t === 'pow' || D === 1 ? ok() : form('single-power', 'Right value — write it as a power of ' + t(2) + ', as the question asks.'); if (ex.eq(x.val, Math.abs(Math.pow(2, A) - Math.pow(2, B)))) return wrong('u2l2-larger-by', '“How much larger” here means how many times as large: divide the two powers (Quotient Law).'); return wrong('value', 'Divide the larger power by the smaller one: subtract the exponents.'); }],
              [pw(2, A), pw(2, B), pw(2, D)], t(pw(par(pw(2, s.a)), s.b) + '=' + pw(2, A)) + ', ' + t(pw(par(pw(2, s.c)), s.d) + '=' + pw(2, B)) + '; ' + t(bigTex) + ' is larger by a factor of ' + t(pw(2, D) + '=' + Math.pow(2, D)),
              t(pw(par(pw(2, s.a)), s.b) + '=' + pw(2, A)) + ' and ' + t(pw(par(pw(2, s.c)), s.d) + '=' + pw(2, B)) + '. Same base, so the bigger exponent wins: ' + t(bigTex) + ' is larger, by a factor of ' + t(fr(pw(2, Math.max(A, B)), pw(2, Math.min(A, B))) + '=' + pw(2, D) + '=' + Math.pow(2, D)) + ' (' + F(Math.pow(2, Math.max(A, B))) + ' versus ' + F(Math.pow(2, Math.min(A, B))) + ').',
              ['Power of a Power: multiply the exponents. Then compare the exponents.'], 'compare powers of 2'); } }] }
    ]
  });

  /* ---------- part makers that use the lesson data ---------- */
  function coefQuot(r, style) {
    var v = r.pick(LET), d = r.int(2, 9), q = pickWhere(function () { return r.int(2, 9); }, function (q) { return q * d - d !== q; }), n = r.int(2, 6), m = n + r.int(2, 7);
    return quotPart(q * d, [[v, m]], d, [[v, n]], style);
  }
  function twoVarQuot(r, style, oneOnBottom) {
    var vw = lets(r, 2).sort(), d = r.int(2, 9), q = r.int(2, 9), a = r.int(2, 6), b = oneOnBottom ? 1 : r.int(2, 4);
    return quotPart(d * q, [[vw[0], a + r.int(2, 6)], [vw[1], b + r.int(1, 6)]], d, [[vw[0], a], [vw[1], b]], style);
  }
  function fracCoef(r) { var o = pickWhere(function () { var p = r.int(2, 9), q = r.int(2, 6), k = r.int(2, 7); return [p * k, q * k, p, q]; }, function (o) { return gcd(o[2], o[3]) === 1 && o[3] > 1 && o[2] > o[3] && o[0] <= 72 && o[1] <= 48; }); return [o[0], o[1]]; }
  function ppOverPp(r) {
    var v = r.pick(LET), x = pickWhere(function () { return [r.int(2, 5), r.int(2, 5), r.int(2, 5), r.int(2, 5)]; }, function (x) { var e = x[0] * x[1] - x[2] * x[3]; return e >= 1 && e <= 9 && x[0] !== x[2]; });
    var e = x[0] * x[1] - x[2] * x[3];
    return expoPart(t(dfr(pw(par(pw(v, x[0])), x[1]), pw(par(pw(v, x[2])), x[3]))), vt(v, e), [[eIs(v, x[0] + x[1] - x[2] - x[3]), 'u2l2-no-pp', 'Clear both brackets first by <b>multiplying</b>: ' + t(pw(v, x[0] * x[1])) + ' on top, ' + t(pw(v, x[2] * x[3])) + ' on the bottom.'], [eIs(v, x[0] * x[1] + x[2] * x[3]), 'law-added', 'Then divide: subtract the exponents.']],
      LAW.pp + ': ' + t(fr(pw(v, x[0] * x[1]), pw(v, x[2] * x[3]))) + '. ' + LAW.quot + ': ' + t(pw(v, x[0] * x[1] + '-' + x[2] * x[3]) + '=' + vt(v, e)) + '.', ['Inside out: multiply the exponents in each bracket, then subtract.'], '(' + v + '^' + x[0] + ')^' + x[1] + '/(' + v + '^' + x[2] + ')^' + x[3]);
  }
  /* (c·letters)^n over (d·letters)^k : arrays [[c, ps, n]] for top and bottom */
  function chain(topL, botL) {
    function side(L) { var m = M(1, []), tex = [], step = []; L.forEach(function (f) { var B = M(f[0], f[1]); var Pm = mPow(B, f[2]); m = mMul(m, Pm); tex.push(f[2] === 1 ? mT(f[0], f[1]) : pw(par(mT(f[0], f[1])), f[2])); step.push(mTex(Pm)); }); return { m: m, tex: tex.join('\\times '), step: step.join('\\times ') }; }
    var T = side(topL), B = side(botL), R = mDiv(T.m, B.m), res = mTex(R), tex = dfr(T.tex, B.tex), rows = [];
    var c0 = topL[0][0], n0 = topL[0][2];
    if (Math.abs(c0) !== 1 && n0 > 1) { var noRaise = mDiv(mMul(M(c0, []), mPow(M(1, topL[0][1]), n0)), B.m); rows.push([cFr(noRaise.c[0], noRaise.c[1]), 'coef-not-raised', 'The ' + t(c0) + ' is inside the bracket on top, so it is raised to the power ' + t(n0) + ' too: ' + t(pw(signed(c0), n0) + '=' + Math.pow(c0, n0)) + '.']); }
    var lv = Object.keys(R.e)[0];
    if (lv) { var noPP = 0; topL.forEach(function (f) { f[1].forEach(function (p) { if (p[0] === lv) noPP += p[1] + (f[2] > 1 ? f[2] : 0); }); }); botL.forEach(function (f) { f[1].forEach(function (p) { if (p[0] === lv) noPP -= p[1] + (f[2] > 1 ? f[2] : 0); }); }); if (noPP !== R.e[lv]) rows.push([eIs(lv, noPP), 'u2l2-no-pp', 'Clear each bracket by <b>multiplying</b> the exponents inside by the outer exponent.']); }
    var sol = 'Clear the brackets first: ' + t(tex + '=' + dfr(T.step, B.step)) + '. Then divide the coefficients and subtract the exponents: ' + t('=' + res) + '.';
    return expoPart(t(tex), res, rows, sol, ['Inside out: raise everything in each bracket to its outer exponent (coefficients too), then divide.'], plain(tex));
  }
  /* (c v^U ·extra)^W = C v^E ·extra^W : find U (inner) and W (outer) */
  function twoUnk(c, v, u, w, extra, names) {
    var U = names[0], W = names[1], C = Math.pow(c, w), E = u * w, inner = c + pw(v, U) + extra.map(function (p) { return pw(p[0], p[1]); }).join(''), rhs = C + pw(v, E) + extra.map(function (p) { return pw(p[0], p[1] * w); }).join('');
    var fl = [fld(W, t(W + '=')), fld(U, t(U + '='))];
    return P.fields(t(pw(par(inner), W) + '=' + rhs), fl,
      [numCk(w, [[u, 'u2l2-ab-swap', 'Which unknown does the coefficient pin down? ' + t(pw(c, W) + '=' + C) + '.'], [C / c, 'times-exp', t(pw(c, W)) + ' means ' + t(c) + ' multiplied by itself ' + t(W) + ' times.']]),
        numCk(u, [[w, 'u2l2-ab-swap', 'Use the exponent of ' + t(v) + ': ' + t(U + '\\times ' + w + '=' + E) + '.'], [E - w, 'add-exp', 'Power of a Power: ' + t(U + '\\times ' + W + '=' + E) + ' (multiply).']])],
      [String(w), String(u)], t(W + '=' + w) + ', ' + t(U + '=' + u),
      t(pw(par(inner), W) + '=' + pw(c, W) + pw(v, U + W) + extra.map(function (p) { return pw(p[0], p[1] + W); }).join('')) + '. Coefficient: ' + t(pw(c, W) + '=' + C + '=' + pw(c, w)) + ', so ' + t(W + '=' + w) + '.' + (extra.length ? ' (Check: ' + t(pw(extra[0][0], extra[0][1] + '\\times ' + w) + '=' + pw(extra[0][0], extra[0][1] * w)) + '.)' : '') + ' Exponent of ' + t(v) + ': ' + t(U + '\\times ' + w + '=' + E) + ', so ' + t(U + '=' + u) + '.',
      ['Expand the left side: the coefficient becomes ' + t(pw(c, W)) + '. Which power of ' + t(c) + ' is ' + t(C) + '?'], plain(pw(par(inner), W) + '=' + rhs));
  }
})(window);
