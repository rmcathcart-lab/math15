/* Math 15 · Unit 2 · Lesson 3 — Power of a Product and Power of a Quotient (AN3)
 * Assignment 3 (u2_L03.tex, Questions 1–12) and the Lesson 3 Extra Practice (u2_EP03.tex, Questions 1–22).
 * Every part is a generator that keeps the booklet question's idea and difficulty and changes the numbers and letters
 * (the booklet's own numbers are among the possible values where practical). Keys come from a small monomial algebra:
 * an expression is a list of bracket factors (coefficient, letters, an optional denominator, an outside power) over
 * another list, so every key is the simplified question and the "coefficient not raised" / "added the exponents"
 * diagnoses are computed the same way.
 * Conversions: "state which law applies" → a table of choices; "explain" → multiple choice whose options are reasons (or
 * the values that show it); "name the error and correct it" → a multiple-choice verdict plus the corrected answer.
 * Changed from the booklet: Assignment 2(d) uses n⁶ × n × n² instead of n⁶ × n⁰ × n² (zero exponents are Lesson 5).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Mastery: Extra 9 (reduce first and cube, or cube first and reduce). */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, ex = HW.ex, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'mult-exp': 'Multiplied exponents (should add)', 'add-exp': 'Added exponents (should multiply)', 'div-exp': 'Divided exponents (should subtract)', 'law-added': 'Added exponents where the law multiplies or subtracts',
    'no-one': 'Forgot the invisible exponent 1', 'coef-not-raised': 'Didn’t raise the coefficient', 'coef-times': 'Multiplied coefficient by the exponent', 'num-only': 'Raised only the numerator',
    'part-base': 'Took only part of the base', 'times-exp': 'Multiplied base by exponent', 'fence': 'Applied the exponent to the wrong base (−aⁿ vs (−a)ⁿ)', 'pos-only': 'Missed the negative answer',
    'u2l3-law-form': 'Law stated with the bracket still in it (not distributed)', 'u2l3-sum': 'Distributed an exponent over a sum or difference', 'u2l3-den-only': 'Raised only the denominator',
    'u2l3-swap-unk': 'Missing value: used the exponent where the coefficient belongs (or the reverse)', 'u2l3-k-sq': 'Missing value: took the square instead of the square root',
    'u2l3-sign-lost': 'Lost the negative sign (odd exponent)', 'u2l3-times-k': 'Scaling: multiplied by the factor instead of raising it to the power', 'u2l3-perim': 'Perimeter: squared instead of multiplying by 4',
    'u2l3-sa': 'Surface area: used one face only (or cubed)'
  });
  HW.addPartial({ 'u2l3-law-form': 'n', 'u2l3-sum': 'n', 'u2l3-den-only': 'b', 'u2l3-swap-unk': 'b', 'u2l3-k-sq': 'b', 'u2l3-sign-lost': 's', 'u2l3-times-k': 'n', 'u2l3-perim': 'b', 'u2l3-sa': 'b' });

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
  function pickWhere(gen, test) { for (var i = 0; i < 3000; i++) { var v = gen(); if (test(v)) return v; } throw new Error('u2l3: pickWhere failed'); }
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
  function vsx(m, sgn) { return Object.keys(m.e).sort().filter(function (v) { return sgn * m.e[v] > 0; }).map(function (v) { return vt(v, sgn * m.e[v]); }).join(''); }
  function mTex(m) {
    var p = m.c[0], q = m.c[1], top = vsx(m, 1), bot = vsx(m, -1), neg = p < 0; p = Math.abs(p);
    if (q === 1 && !bot) return (neg ? '-' : '') + cT(p, top);
    return (neg ? '-' : '') + fr((p === 1 && top ? '' : String(p)) + top || '1', (q === 1 && bot ? '' : String(q)) + bot);
  }
  function mT(c, ps) { return cT(c, ps.map(function (p) { return vt(p[0], p[1]); }).join('')); }

  /* ---------- expressions: lists of bracket factors ---------- */
  /* f = { c, ps, n (outside power), q: [c, ps] denominator inside the bracket, neg: minus sign outside the bracket } */
  function Fc(c, ps, n, q, neg) { return { c: c, ps: ps, n: n || 1, q: q || null, neg: !!neg }; }
  function fInner(f) { var B = M(f.c, f.ps); return f.q ? mDiv(B, M(f.q[0], f.q[1])) : B; }
  function fMono(f, mode) {
    var B = fInner(f), R;
    if (f.n === 1) R = B;
    else if (mode === 'nocoef') { var L = mPow({ c: [1, 1], e: B.e }, f.n); R = { c: B.c, e: L.e }; }
    else if (mode === 'add') { var e = {}; Object.keys(B.e).forEach(function (v) { e[v] = B.e[v] + (B.e[v] > 0 ? f.n : -f.n); }); R = { c: mPow(B, f.n).c, e: e }; }
    else if (mode === 'numonly' && f.q) { R = mDiv(mPow(M(f.c, f.ps), f.n), M(f.q[0], f.q[1])); }
    else R = mPow(B, f.n);
    return f.neg ? mMul(M(-1, []), R) : R;
  }
  function fTex(f) { var inner = f.q ? dfr(mT(f.c, f.ps), mT(f.q[0], f.q[1])) : mT(f.c, f.ps); return (f.neg ? '-' : '') + (f.n === 1 ? inner : pw(par(inner), f.n)); }
  function prodOf(list, mode) { return list.reduce(function (m, f) { return mMul(m, fMono(f, mode)); }, M(1, [])); }
  function evalX(num, den, mode) { var T = prodOf(num, mode); return den && den.length ? mDiv(T, prodOf(den, mode)) : T; }
  function sameM(a, b) { if (a.c[0] * b.c[1] !== b.c[0] * a.c[1]) return false; var ks = Object.keys(a.e).concat(Object.keys(b.e)); return ks.every(function (v) { return (a.e[v] || 0) === (b.e[v] || 0); }); }
  /* opt: sep (between factors), div (use ÷ for the denominator list) */
  function X(num, den, opt) {
    opt = opt || {}; den = den || [];
    var sep = opt.sep == null ? '\\times ' : opt.sep, nT = num.map(fTex).join(sep), dT = den.map(fTex).join(sep);
    var tex = !den.length ? nT : opt.div ? nT + '\\div ' + (den.length > 1 || den[0].n === 1 && !den[0].q && den[0].ps.length ? par(dT) : dT) : dfr(nT, dT);
    var R = evalX(num, den), res = mTex(R), rows = [];
    var nc = evalX(num, den, 'nocoef'); if (!sameM(nc, R) && (nc.c[0] !== R.c[0] || nc.c[1] !== R.c[1])) rows.push([cFr(nc.c[0], nc.c[1]), 'coef-not-raised', 'The number inside each bracket is raised to that bracket’s outside power too' + (num.concat(den).filter(function (f) { return f.n > 1 && Math.abs(f.c) !== 1; }).map(function (f) { return ': ' + t(pw(signed(f.c), f.n) + '=' + Math.pow(f.c, f.n)); })[0] || '') + '.']);
    var ad = evalX(num, den, 'add'); Object.keys(R.e).forEach(function (v) { if ((ad.e[v] || 0) !== R.e[v] && Math.abs(ad.e[v] || 0) > 0) rows.push([eIs(v, ad.e[v]), 'add-exp', 'A power inside a bracket raised to an outside power: <b>multiply</b> the exponents of ' + t(v) + '.']); });
    var no = evalX(num, den, 'numonly'); if (!sameM(no, R)) rows.push([function (an) { var x = analyzeMono(an); return !!x && sameM(x, no); }, 'num-only', 'Raise the <b>denominator</b> inside the bracket to the power too.']);
    var steps = num.map(function (f) { return f.n === 1 ? fTex(f) : par(mTex(fMono(f))); }), dsteps = den.map(function (f) { return f.n === 1 ? fTex(f) : par(mTex(fMono(f))); });
    var mid = den.length ? (opt.div ? steps.join(sep) + '\\div ' + dsteps.join(sep) : dfr(steps.join(sep), dsteps.join(sep))) : steps.join(sep);
    var oneStep = num.length === 1 && !den.length;
    var sol = oneStep ? 'Raise every factor inside the bracket to the outside power (the number' + (num[0].q ? ' on top and the number on the bottom' : '') + ' too): ' + t(tex + '=' + res) + '.'
      : 'Clear the brackets first — every factor inside a bracket gets its outside power: ' + t(tex + '=' + mid.replace(/\\left\(([^()]*)\\right\)/g, function (m0, a) { return /[+\-]/.test(a.slice(1)) || /\\frac/.test(a) || a.charAt(0) === '-' ? m0 : a; })) + '. Then multiply/divide the coefficients and add/subtract the exponents: ' + t('=' + res) + '.';
    return { tex: tex, res: res, R: R, rows: rows, sol: sol };
  }
  function analyzeMono(an) { if (!an || !an.coef || !an.vars) return null; var e = {}, okk = true; Object.keys(an.vars).forEach(function (v) { var x = an.vars[v]; if (x[1] !== 1) okk = false; e[v] = x[0]; }); return okk ? { c: nrm(an.coef.slice()), e: e } : null; }
  function xPart(num, den, opt, hints, prompt) {
    var x = X(num, den, opt);
    return expoPart(prompt ? prompt + ' ' + t(x.tex) : t(x.tex), x.res, x.rows, x.sol, hints || ['Every factor inside a bracket — the number, each letter, top and bottom — is raised to the outside power. Then combine powers of the same letter.'], plain(x.tex));
  }

  /* ---------- checkers ---------- */
  function dg(rows) { return function (an) { for (var i = 0; i < rows.length; i++) if (rows[i][0](an)) return { code: rows[i][1], hint: rows[i][2] }; return null; }; }
  function eIs(v, n) { return function (an) { var e = an.vars && an.vars[v]; return !!e && e[1] === 1 && e[0] === n; }; }
  function cIs(n) { return function (an) { return !!an.coef && an.coef[0] === n * an.coef[1]; }; }
  function cFr(p, q) { return function (an) { return !!an.coef && an.coef[0] * q === p * an.coef[1]; }; }

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
  /* (c · letters)^n  and  (top / bottom)^n */
  function pp(c, ps, n) { return xPart([Fc(c, ps, n)], []); }
  function pq(nc, nps, dc, dps, n) { return xPart([Fc(nc, nps, n, [dc, dps])], []); }
  /* the law statements: an expression equal to tgt with no bracket raised to a power */
  function lawCk(tgt, diags) {
    var T = px(tgt);
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var raisedBracket = false;
      (function w(x) { if (!x || typeof x !== 'object') return; if (x.t === 'pow') { var b = strip(x.a); if (b.t === 'mul' || b.t === 'div') raisedBracket = true; } ['a', 'b'].forEach(function (k) { if (x[k]) w(x[k]); }); })(a.ast);
      if (same(a.ast, T)) return raisedBracket ? wrong('u2l3-law-form', 'That is the left side again. Write it with the exponent applied to each part separately.') : ok();
      for (var i = 0; i < diags.length; i++) if (same(a.ast, px(diags[i][0]))) return wrong(diags[i][1], diags[i][2]);
      return wrong('value', null);
    };
  }

  HW.defineLesson({
    id: 'u2l3', unit: 2, num: '3', title: 'Power of a Product and Power of a Quotient', outcome: 'AN3',
    blurb: 'An outside exponent goes onto every factor inside the brackets — the coefficient, each letter, the top and the bottom of a fraction — then the laws combine.',
    questions: [
      /* ===================== Part A ===================== */
      { num: '1', section: 'Part A — The Two New Laws', stem: 'Complete each exponent law statement.', parts: [
        { id: '1a', level: 'LIM', make: function () {
          return P.math(t('(ab)^{n}='), lawCk('a^{n}b^{n}', [['a^{n}b', 'part-base', 'Both ' + t('a') + ' and ' + t('b') + ' are inside the brackets, so both get the exponent.'], ['ab^{n}', 'part-base', 'Both ' + t('a') + ' and ' + t('b') + ' get the exponent.'], ['a^{n}+b^{n}', 'u2l3-sum', 'The bracket holds a <b>product</b>, so the answer is a product too.'], ['nab', 'times-exp', 'An exponent isn’t a multiplier.']]), 'a^{n}b^{n}',
            'Power of a Product Law: ' + t('(ab)^{n}=a^{n}b^{n}') + ' — each factor gets its own copy of the exponent. (For example ' + t('(ab)^{3}=(ab)(ab)(ab)=(aaa)(bbb)=a^{3}b^{3}') + '.)', ['Write ' + t('(ab)^{3}') + ' as ' + t('(ab)(ab)(ab)') + ' and regroup.'], '(ab)^n law', { keys: 'expo', vars: ['a', 'b', 'n'], bad: ['(ab)^{n}', 'a^{n}b'] }); } },
        { id: '1b', level: 'LIM', make: function () {
          return P.math(t('\\left(\\dfrac{a}{b}\\right)^{n}=') + ' (' + t('b\\neq 0') + ')', lawCk('\\frac{a^{n}}{b^{n}}', [['\\frac{a^{n}}{b}', 'num-only', 'Raise the denominator to the power too.'], ['\\frac{a}{b^{n}}', 'u2l3-den-only', 'Raise the numerator to the power too.'], ['\\frac{na}{nb}', 'times-exp', 'An exponent isn’t a multiplier.']]), '\\frac{a^{n}}{b^{n}}',
            'Power of a Quotient Law: ' + t('\\left(\\frac{a}{b}\\right)^{n}=\\frac{a^{n}}{b^{n}}') + ' — raise the numerator and the denominator to the power separately.', ['Write ' + t('\\left(\\frac{a}{b}\\right)^{3}') + ' as ' + t('\\frac{a}{b}\\cdot\\frac{a}{b}\\cdot\\frac{a}{b}') + '.'], '(a/b)^n law', { keys: 'expo', vars: ['a', 'b', 'n'], bad: ['\\frac{a^{n}}{b}'] }); } }] },
      { num: '2', stem: 'Simplify using the Product Law, the Quotient Law, or the Power of a Power Law.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var v = r.pick(LET), x = pickWhere(function () { return [r.int(2, 9), r.int(2, 9)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; });
          return expoPart(t(pw(v, x[0]) + '\\times ' + pw(v, x[1])), pw(v, x[0] + x[1]), [[eIs(v, x[0] * x[1]), 'mult-exp', 'Product Law: <b>add</b> the exponents.']], 'Product Law: ' + t(pw(v, x[0] + '+' + x[1]) + '=' + pw(v, x[0] + x[1])) + '.', ['Multiplying powers of the same base: add the exponents.'], v + '^' + x.join('*')); } },
        { id: '2b', level: 'BEG', make: function (r) { var v = r.pick(LET), n = r.int(2, 5), m = n + r.int(2, 8), rows = [[eIs(v, m + n), 'law-added', 'Quotient Law: <b>subtract</b> the exponents.']]; if (m % n === 0 && m / n !== m - n) rows.push([eIs(v, m / n), 'div-exp', 'Subtract the exponents — don’t divide them.']);
          return expoPart(t(pw(v, m) + '\\div ' + pw(v, n)), pw(v, m - n), rows, 'Quotient Law: ' + t(pw(v, m + '-' + n) + '=' + pw(v, m - n)) + '.', ['Dividing powers of the same base: subtract the exponents.'], v + '^' + m + '/' + v + '^' + n); } },
        { id: '2c', level: 'BEG', make: function (r) { var v = r.pick(LET), x = pickWhere(function () { return [r.int(2, 6), r.int(2, 5)]; }, function (x) { return x[0] * x[1] !== x[0] + x[1]; });
          return expoPart(t(pw(par(pw(v, x[0])), x[1])), pw(v, x[0] * x[1]), [[eIs(v, x[0] + x[1]), 'add-exp', 'Power of a Power: <b>multiply</b> the exponents.']], 'Power of a Power Law: ' + t(pw(v, x[0] + '\\times ' + x[1]) + '=' + pw(v, x[0] * x[1])) + '.', ['A power raised to a power: multiply the exponents.'], '(' + v + '^' + x[0] + ')^' + x[1]); } },
        { id: '2d', level: 'EMG', make: function (r) { var v = r.pick(LET), a = r.int(2, 8), b = r.int(2, 6), e = a + 1 + b;
          return expoPart(t(pw(v, a) + '\\times ' + v + '\\times ' + pw(v, b)), pw(v, e), [[eIs(v, a + b), 'no-one', 'The middle factor ' + t(v) + ' has the invisible exponent ' + t(1) + '. Count it too.'], [eIs(v, a * b), 'mult-exp', 'Product Law: <b>add</b> the exponents.']], 'Product Law (' + t(v + '=' + pw(v, 1)) + '): ' + t(pw(v, a + '+1+' + b) + '=' + pw(v, e)) + '.', ['A letter with no exponent has the exponent ' + t(1) + '.'], v + '^' + a + '*' + v + '*' + v + '^' + b); } }] },
      { num: '3', stem: 'State whether the Power of a Product Law or the Power of a Quotient Law applies, then simplify.',
        shared: function (r) { var vw = lets(r, 2).sort(), c = r.int(2, 5), n = c <= 3 ? r.pick([2, 3, 4]) : r.pick([2, 3]), d = r.int(2, 9), c2 = r.int(2, 9), n4 = r.int(3, 9); if (r.chance(0.15)) { c = 2; n = 3; d = 4; c2 = 5; n4 = 6; } return { v: vw[0], w: vw[1], c: c, n: n, d: d, c2: c2, n4: n4, m: r.pick(LET), y: r.pick(LET) }; },
        parts: [
          { id: '3a', level: 'BEG', make: function (r, s) { return pp(s.c, [[s.y, 1]], s.n); } },
          { id: '3b', level: 'BEG', make: function (r, s) { return pq(1, [[s.m, 1]], s.d, [], 2); } },
          { id: '3c', level: 'BEG', make: function (r, s) { return pp(s.c2, [[s.v, 1], [s.w, 1]], 2); } },
          { id: '3d', level: 'BEG', make: function (r, s) { return pq(1, [[s.v, 1]], 1, [[s.w, 1]], s.n4); } },
          { id: '3e', sub: 'law', level: 'BEG', make: function (r, s) {
            var items = [{ id: 'a', html: t(pw(par(s.c + s.y), s.n)), w: 'prod' }, { id: 'b', html: t(pw(par(dfr(s.m, s.d)), 2)), w: 'quot' }, { id: 'c', html: t(pw(par(s.c2 + s.v + s.w), 2)), w: 'prod' }, { id: 'd', html: t(pw(par(dfr(s.v, s.w)), s.n4)), w: 'quot' }], want = {};
            items.forEach(function (x) { want[x.id] = x.w; });
            return P.grid('Which law applies to each expression in parts (a)–(d)?', items.map(function (x) { return { id: x.id, html: '(' + x.id + ') ' + x.html }; }), [{ id: 'prod', html: 'Power of a Product' }, { id: 'quot', html: 'Power of a Quotient' }], want, {},
              'A bracket holding a <b>product</b> (things multiplied, like ' + t(s.c + s.y) + ') uses the Power of a Product Law; a bracket holding a <b>fraction</b> uses the Power of a Quotient Law.', ['Is the thing inside the brackets multiplied or divided?'], 'which law');
          } }] },
      { num: '4', stem: 'Use the Power of a Product Law to simplify.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { var c = r.int(2, 5); return pp(c, [[r.pick(LET), 1]], c <= 3 ? r.pick([3, 4]) : 3); } },
        { id: '4b', level: 'BEG', make: function (r) { return pp(r.int(2, 12), [[r.pick(LET), 1]], 2); } },
        { id: '4c', level: 'EMG', make: function (r) { return pp(-r.int(2, 9), [[r.pick(LET), 1]], 2); } },
        { id: '4d', level: 'BEG', make: function (r) { var vw = lets(r, 2).sort(); return pp(r.int(2, 9), [[vw[0], 1], [vw[1], 1]], 2); } },
        { id: '4e', level: 'BEG', make: function (r) { var o = r.pick([[10, 3], [10, 2], [10, 4], [20, 2], [20, 3], [30, 2], [100, 2], [10, 5], [40, 2], [50, 2], [100, 3], [11, 2]]); return pp(o[0], [[r.pick(LET), 1]], o[1]); } },
        { id: '4f', level: 'EMG', make: function (r) { var vw = lets(r, 2).sort(), c = r.pick([2, 2, 3, 4, 5]); return pp(-c, [[vw[0], 1], [vw[1], 1]], 3); } }] },
      { num: '5', stem: 'Use the Power of a Quotient Law to simplify.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var f = pickWhere(function () { return [r.int(1, 9), r.int(2, 10)]; }, function (f) { return f[0] < f[1] && gcd(f[0], f[1]) === 1; }), n = f[1] <= 5 ? r.pick([2, 2, 3]) : 2;
          var A = Math.pow(f[0], n), B = Math.pow(f[1], n);
          return P.fraction(t(pw(par(dfr(f[0], f[1])), n)), [A, B], { diag: function (v) { return Math.abs(v - Math.pow(f[0], n) / f[1]) < 1e-12 && n > 1 ? { code: 'num-only', hint: 'Raise the denominator to the power too: ' + t(pw(f[1], n) + '=' + B) + '.' } : Math.abs(v - f[0] * n / (f[1] * n)) < 1e-12 ? { code: 'times-exp', hint: 'Squaring isn’t multiplying by ' + t(n) + ': ' + t(pw(f[0], n) + '=' + rep(f[0], n)) + '.' } : null; } },
            'Power of a Quotient Law: ' + t(pw(par(fr(f[0], f[1])), n) + '=' + fr(pw(f[0], n), pw(f[1], n)) + '=' + fr(A, B)) + '.', ['Raise the numerator and the denominator to the power.'], '(' + f[0] + '/' + f[1] + ')^' + n); } },
        { id: '5b', level: 'BEG', make: function (r) { return pq(1, [[r.pick(LET), 1]], r.int(2, 9), [], 2); } },
        { id: '5c', level: 'BEG', make: function (r) { return pq(r.int(2, 9), [], 1, [[r.pick(LET), 1]], 2); } },
        { id: '5d', level: 'BEG', make: function (r) { var vw = lets(r, 2).sort(); return pq(1, [[vw[0], 1]], 1, [[vw[1], 1]], r.int(3, 9)); } },
        { id: '5e', level: 'BEG', make: function (r) { var d = r.int(2, 5); return pq(1, [[r.pick(LET), 1]], d, [], d <= 3 ? r.pick([3, 4]) : 3); } },
        { id: '5f', level: 'EMG', make: function (r) { var c = r.int(2, 5); return pq(c, [], 1, [[r.pick(LET), 1]], c <= 3 ? 4 : 3); } }] },
      { num: '6', stem: 'Evaluate completely (numeric bases only), and use the Power of a Product or Power of a Quotient Law to check your work.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 5), r.int(2, 5), r.pick([2, 3])]; }, function (x) { return x[0] !== x[1] && Math.pow(x[0] * x[1], x[2]) <= 3000; }); return numCheck('prod', x[0], x[1], x[2]); } },
        { id: '6b', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 6), r.int(2, 5), r.pick([2, 2, 3])]; }, function (x) { return Math.pow(x[0], x[2]) <= 300; }); return numCheck('quot', x[0] * x[1], x[1], x[2]); } },
        { id: '6c', level: 'EMG', make: function (r) { var x = pickWhere(function () { return [-r.int(2, 5), r.int(2, 6), r.pick([2, 2, 3])]; }, function (x) { return Math.abs(Math.pow(x[0] * x[1], x[2])) <= 3000; }); return numCheck('prod', x[0], x[1], x[2]); } },
        { id: '6d', level: 'BEG', make: function (r) { var x = pickWhere(function () { return [r.int(2, 9), r.int(2, 6), 2]; }, function (x) { return x[0] * x[1] <= 40; }); return numCheck('quot', x[0] * x[1], x[1], x[2]); } }] },

      /* ===================== Part B ===================== */
      { num: '7', section: 'Part B — Combining Laws', stem: 'Simplify each expression using two exponent laws.', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var v = r.pick(LET), c = r.int(2, 6); return xPart([Fc(c, [[v, 1]], 2), Fc(1, [[v, r.int(2, 6)]])], []); } },
        { id: '7b', level: 'EMG', make: function (r) { var v = r.pick(LET), a = r.int(2, 4), n = r.int(2, 4), d = r.int(1, a * n - 1); return xPart([Fc(1, [[v, a]], n)], [Fc(1, [[v, d]])], { div: true }); } },
        { id: '7c', level: 'EMG', make: function (r) { var v = r.pick(LET), c = r.pick([2, 2, 3, 4, 5]); return xPart([Fc(c, [[v, 1]], 3), Fc(1, [[v, r.int(2, 6)]])], []); } },
        { id: '7d', level: 'EMG', make: function (r) { var v = r.pick(LET), a = r.int(2, 4), n = r.int(2, 4), d = r.int(1, a * n - 1); return xPart([Fc(1, [[v, a]], n)], [Fc(1, [[v, d]])], { div: true }); } },
        { id: '7e', level: 'EMG', make: function (r) { var v = r.pick(LET), c = r.int(2, 9); return xPart([Fc(c, [[v, r.int(2, 5)]], 2)], []); } },
        { id: '7f', level: 'PRG', make: function (r) { var v = r.pick(LET), d = r.int(2, 5); return xPart([Fc(1, [[v, 1]], 2, [d, []]), Fc(1, [[v, r.int(2, 6)]])], []); } }] },
      { num: '8', stem: 'These combine three or more exponent laws. Simplify each expression completely.', parts: [
        { id: '8a', level: 'PRG', make: function (r) { var v = r.pick(LET), c = r.int(2, 5), a = r.int(2, 4), n = r.int(2, 3); return xPart([Fc(c, [[v, 1]], 2), Fc(1, [[v, a]], n)], [], { sep: '' }); } },
        { id: '8b', level: 'PRG', make: function (r) { var v = r.pick(LET), c = r.int(2, 6), a = r.int(2, 4), d = r.int(1, 2 * a - 1); return xPart([Fc(c, [[v, a]], 2)], [Fc(1, [[v, d]])]); } },
        { id: '8c', level: 'ADV', make: function (r) { var vw = lets(r, 2).sort(), c = r.pick([2, 2, 3, 4, 5]), a = r.int(2, 4); return xPart([Fc(c, [[vw[0], a]], c <= 3 ? r.pick([2, 3]) : 2, [1, [[vw[1], r.int(1, 2)]]])], []); } },
        { id: '8d', level: 'PRG', make: function (r) { var v = r.pick(LET), c = r.pick([2, 2, 3]), a = r.int(2, 3), d = r.int(1, 3 * a - 1); return xPart([Fc(c, [[v, a]], 3)], [Fc(1, [[v, d]])]); } }] },
      { num: '9', stem: 'State the value of the unknown.', parts: [
        { id: '9a', level: 'PRG', make: function (r) { var c = r.pick([2, 2, 3, 4, 5, 10]), n = c === 2 ? r.int(2, 5) : r.int(2, 3), v = r.pick(['x', 'x', 'y', 'a']), C = Math.pow(c, n);
          return numPart(t(pw(par(c + v), 'n') + '=' + C + pw(v, n)) + ', find ' + t('n') + '.', n, [[C, 'u2l3-swap-unk', 'Match the exponent of ' + t(v) + ': ' + t(pw(v, 'n') + '=' + pw(v, n)) + '.'], [C / c, 'times-exp', t(pw(c, 'n')) + ' means ' + t(c) + ' multiplied by itself ' + t('n') + ' times.']],
            t(pw(par(c + v), 'n') + '=' + pw(c, 'n') + pw(v, 'n')) + '. The exponent of ' + t(v) + ' says ' + t('n=' + n) + ' (check: ' + t(pw(c, n) + '=' + C) + ').', ['Expand the left side with the Power of a Product Law, then match.'], '(' + c + v + ')^n', t('n=')); } },
        { id: '9b', level: 'PRG', make: function (r) { var a = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'm']), A = a * a;
          return numPart(t(pw(par('a' + v), 2) + '=' + A + pw(v, 2)) + ', find the positive value of ' + t('a') + '.', a, [[A, 'u2l3-k-sq', t('a^{2}=' + A) + ': which positive number squared is ' + t(A) + '?'], [A / 2, 'times-exp', t('a^{2}') + ' means ' + t('a\\times a') + ', not ' + t('2a') + '.'], [-a, 'sign', 'The question asks for the positive value.']],
            t(pw(par('a' + v), 2) + '=a^{2}' + pw(v, 2)) + ', so ' + t('a^{2}=' + A) + ' and ' + t('a=' + a) + ' (positive).', ['Expand the left side: the coefficient becomes ' + t('a^{2}') + '.'], '(a' + v + ')^2=' + A + v + '^2', t('a=')); } },
        { id: '9c', level: 'PRG', make: function (r) { var k = r.int(2, 12), v = r.pick(['x', 'x', 'y', 'm']), K2 = k * k;
          return numPart(t(pw(par(dfr(v, 'k')), 2) + '=' + dfr(pw(v, 2), K2)) + ', find the positive value of ' + t('k') + '.', k, [[K2, 'u2l3-k-sq', t('k^{2}=' + K2) + ': which positive number squared is ' + t(K2) + '?'], [K2 / 2, 'times-exp', t('k^{2}') + ' means ' + t('k\\times k') + '.']],
            t(pw(par(fr(v, 'k')), 2) + '=' + fr(pw(v, 2), 'k^{2}')) + ', so ' + t('k^{2}=' + K2) + ' and ' + t('k=' + k) + ' (positive).', ['Use the Power of a Quotient Law on the left side.'], '(' + v + '/k)^2=' + v + '^2/' + K2, t('k=')); } }] },
      { num: '10', stem: function (sh) { return '(a) In your own words, explain the difference between ' + t(sh.c + pw('x', 2)) + ' and ' + t(pw(par(sh.c + 'x'), 2)) + '. Then evaluate both expressions when ' + t('x=' + sh.x) + '. (b) Explain why the Power of a Quotient Law, ' + t('\\left(\\frac{a}{b}\\right)^{n}=\\frac{a^{n}}{b^{n}}') + ', requires ' + t('b\\neq 0') + '.'; },
        shared: function (r) { var c = r.int(2, 9), x = r.int(2, 5); if (r.chance(0.2)) { c = 3; x = 2; } return { c: c, x: x }; },
        parts: [
          { id: '10a', sub: 'a', level: 'BEG', make: function (r, s) { var c = s.c, x = s.x, A = c * x * x, B = c * c * x * x, fl = [fld('First', t(c + pw('x', 2) + '=')), fld('Second', t(pw(par(c + 'x'), 2) + '='))];
            return P.fields('Evaluate both when ' + t('x=' + x) + '.', fl, [numCk(A, [[B, 'coef-not-raised', 'No brackets: only ' + t('x') + ' is squared. Square ' + t(x) + ', then multiply by ' + t(c) + '.']]), numCk(B, [[A, 'coef-not-raised', 'The brackets hold ' + t(c + 'x') + ': work out ' + t(c + '\\times ' + x + '=' + c * x) + ' first, then square it.']])],
              [String(A), String(B)], t(A) + ' and ' + t(B), t(c + pw('(' + x + ')', 2) + '=' + c + '\\times ' + x * x + '=' + A) + ', but ' + t(pw('(' + c + '\\times ' + x + ')', 2) + '=' + pw(c * x, 2) + '=' + B) + '.', ['Brackets first.'], 'evaluate at x=' + x); } },
          { id: '10b', sub: 'a why', level: 'EMG', make: function (r, s) { var c = s.c;
            return mc(r, 'Which explains the difference between ' + t(c + pw('x', 2)) + ' and ' + t(pw(par(c + 'x'), 2)) + '?', [
              { html: 'In ' + t(c + pw('x', 2)) + ' only ' + t('x') + ' is squared; in ' + t(pw(par(c + 'x'), 2)) + ' the whole quantity ' + t(c + 'x') + ' is squared, so it equals ' + t(c * c + pw('x', 2)) + '.', right: true },
              { html: 'They are equal, because both have a ' + t(c) + ' and an ' + t(pw('x', 2)) + '.', why: 'Your values in (a) are different.' },
              { html: 'In ' + t(pw(par(c + 'x'), 2)) + ' the brackets mean multiply by ' + t(2) + ': ' + t(2 * c + 'x') + '.', why: 'An exponent ' + t(2) + ' means multiply the base by itself.' },
              { html: 'In ' + t(c + pw('x', 2)) + ' the ' + t(c) + ' is squared but the ' + t('x') + ' is not.', why: 'The exponent sits on ' + t('x') + '.' }],
              t(c + pw('x', 2) + '=' + c + '\\times x\\times x') + ' but ' + t(pw(par(c + 'x'), 2) + '=(' + c + 'x)(' + c + 'x)=' + c * c + pw('x', 2)) + '.', ['Write each one as repeated multiplication.'], 'difference ' + c + 'x^2'); } },
          { id: '10c', sub: 'b', level: 'EMG', make: function (r) {
            return mc(r, 'Why does the Power of a Quotient Law require ' + t('b\\neq 0') + '?', [
              { html: 'If ' + t('b=0') + ' the fraction ' + t('\\frac{a}{b}') + ' has a zero denominator, so it is undefined — there is nothing to raise to a power.', right: true },
              { html: 'Because ' + t('0^{n}') + ' is always ' + t(1) + '.', why: t('0^{n}=0') + ' for positive ' + t('n') + '. The problem is dividing by zero.' },
              { html: 'Because the exponent ' + t('n') + ' can’t be zero.', why: 'The restriction is on ' + t('b') + ', the denominator.' },
              { html: 'It doesn’t really need it; the law works for every ' + t('b') + '.', why: 'Try ' + t('b=0') + ': ' + t('\\frac{a}{0}') + ' can’t be calculated.' }],
              'Division by zero is undefined: with ' + t('b=0') + ', ' + t('\\frac{a}{b}') + ' (and ' + t('\\frac{a^{n}}{b^{n}}') + ', whose denominator would be ' + t('0^{n}=0') + ') make no sense.', ['What happens to a fraction whose denominator is zero?'], 'why b≠0'); } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'BEG', make: function (r) { var c = r.pick([4, 4, 3, 5, 6, 7, 8, 9]), v = r.pick(['y', 'y', 'x', 'a', 'm']), C = c * c;
          return mc(r, 'Which of the following is equivalent to ' + t(pw(par(c + v), 2)) + '?', [
            { html: t(2 * c + pw(v, 2)), why: 'Squaring ' + t(c) + ' means ' + t(c + '\\times ' + c) + ', not ' + t('2\\times ' + c) + '.' },
            { html: t(C + pw(v, 2)), right: true },
            { html: t(c + pw(v, 2)), why: 'The ' + t(c) + ' is inside the brackets, so it is squared too.' },
            { html: t(C + v), why: 'The ' + t(v) + ' is inside the brackets, so it is squared too.' }],
            'Power of a Product Law: ' + t(pw(par(c + v), 2) + '=' + pw(c, 2) + pw(v, 2) + '=' + C + pw(v, 2)) + '.', ['Square every factor inside the brackets.'], '(' + c + v + ')^2 MC', true); } }] },
      { num: '12', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '12', level: 'EMG', make: function (r) { var c = r.int(2, 9), e = r.int(2, 5), n = c <= 4 ? r.pick([2, 2, 3]) : 2, C = Math.pow(c, n), v = r.pick(['m', 'm', 'x', 'a']);
          return P.nr('If ' + t(pw(par(c + pw(v, e)), n) + '=k' + pw(v, e * n)) + ', the value of ' + t('k') + ' is ________.', C, function (x) { return x === c ? { code: 'coef-not-raised', hint: 'The ' + t(c) + ' is inside the brackets, so it is raised to the power ' + t(n) + '.' } : x === c * n ? { code: 'coef-times', hint: t(pw(c, n)) + ' means ' + t(c) + ' multiplied by itself ' + n + ' times.' } : null; },
            t(pw(par(c + pw(v, e)), n) + '=' + pw(c, n) + pw(v, e * n) + '=' + C + pw(v, e * n)) + ', so ' + t('k=' + C) + '.', ['Raise the coefficient to the power too.'], '(' + c + v + '^' + e + ')^' + n + '=k'); } }] }
    ],

    /* =============================== EXTRA PRACTICE =============================== */
    extra: [
      { num: '1', section: 'Part A — Every Factor Takes the Exponent', stem: 'Each bracket holds <b>three or more factors</b>. Distribute the outer exponent onto every one of them — the coefficient included.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { var L = lets(r, 3).sort(), c = r.pick([2, 2, 3]); return pp(c, [[L[0], r.int(2, 3)], [L[1], r.int(2, 4)], [L[2], 1]], c === 2 ? 4 : 3); } },
        { id: 'e1b', level: 'EMG', make: function (r) { var L = lets(r, 3).sort(), c = r.pick([2, 3, 4, 5]); return pp(c, [[L[0], 1], [L[1], r.int(2, 4)], [L[2], r.int(2, 3)]], 3); } },
        { id: 'e1c', level: 'EMG', make: function (r) { var L = lets(r, 3).sort(); return pp(r.int(2, 9), [[L[0], r.int(2, 4)], [L[1], 1], [L[2], r.int(2, 3)]], 2); } }] },
      { num: '2', stem: 'Simplify. Watch the sign: an even outside exponent makes the answer positive, an odd one keeps it negative.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { var v = r.pick(LET), c = r.int(2, 4); return pp(-c, [[v, r.int(2, 4)]], 3); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var v = r.pick(LET), c = r.int(2, 3); return pp(-c, [[v, r.int(2, 4)]], 4); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(); return pp(-2, [[vw[0], 1], [vw[1], r.int(2, 4)]], 5); } },
        { id: 'e2d', level: 'EMG', make: function (r) { var vw = lets(r, 2).sort(); return pp(-r.int(2, 9), [[vw[0], r.int(2, 4)], [vw[1], 1]], 2); } }] },
      { num: '3', stem: function (sh) { return 'These three expressions look almost the same but are not equal. Simplify each one, then evaluate it at ' + t(sh.v + '=' + sh.x) + '.'; },
        shared: function (r) { var c = r.pick([2, 2, 3, 4, 5]), n = c === 2 ? r.pick([4, 4, 2]) : c === 3 ? r.pick([2, 4]) : 2, x = r.pick([2, 2, 3]), v = r.pick(['x', 'x', 'x', 'a', 'y', 'm', 'k']); if (c >= 3 && n === 4) x = 2; if (r.chance(0.15)) { c = 2; n = 4; x = 2; v = 'x'; } return { c: c, n: n, x: x, v: v }; },
        parts: [
          { id: 'e3a', level: 'EMG', make: function (r, s) { return simpEval(Fc(-s.c, [[s.v, 1]], s.n), s.x, s.v); } },
          { id: 'e3b', level: 'EMG', make: function (r, s) { return simpEval(Fc(s.c, [[s.v, 1]], s.n, null, true), s.x, s.v); } },
          { id: 'e3c', level: 'EMG', make: function (r, s) { return simpEval(Fc(-s.c, [[s.v, s.n]]), s.x, s.v); } }] },
      { num: '4', stem: 'Power of a quotient with a coefficient <b>top and bottom</b>. Raise every part of the numerator and every part of the denominator to the outer power.', parts: [
        { id: 'e4a', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), a = r.pick([2, 3]), b = r.pick([3, 5, 4].filter(function (x) { return gcd(x, a) === 1; })); return pq(a, [[vw[0], r.int(2, 4)]], b, [[vw[1], 1]], 3); } },
        { id: 'e4b', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), o = r.pick([[4, 3], [2, 5], [3, 4], [5, 2], [5, 3], [7, 2], [2, 3], [3, 7]]); return pq(-o[0], [[vw[0], r.int(2, 4)]], o[1], [[vw[1], r.int(2, 4)]], 2); } },
        { id: 'e4c', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), o = r.pick([[3, 2], [2, 3], [3, 4], [4, 3]]); return pq(o[0], [[vw[0], r.int(2, 4)]], o[1], [[vw[1], 1]], 4); } }] },
      { num: '5', stem: 'Simplify each quotient. Watch the sign in part (a).', parts: [
        { id: 'e5a', level: 'PRG', make: function (r) { var vw = lets(r, 2).sort(), c = r.pick([2, 2, 3]); return pq(-c, [[vw[0], r.int(2, 4)]], 1, [[vw[1], r.int(2, 3)]], 3); } },
        { id: 'e5b', level: 'PRG', make: function (r) { var L = lets(r, 3).sort(), o = r.pick([[5, 4], [3, 2], [2, 3], [4, 5], [5, 2], [3, 4], [7, 3]]); return pq(o[0], [[L[0], r.int(2, 3)], [L[1], 1]], o[1], [[L[2], r.int(2, 4)]], 2); } },
        { id: 'e5c', level: 'PRG', make: function (r) { var L = lets(r, 3).sort(), d = r.pick([2, 3]); return pq(1, [[L[0], r.int(2, 4)], [L[1], 1]], d, [[L[2], r.int(2, 3)]], 3); } }] },

      /* ===================== Part B ===================== */
      { num: '6', section: 'Part B — Nested Brackets and Mixed Laws', stem: '<b>Nested brackets.</b> Work from the inside out: simplify what is inside the round brackets first, then apply the outer exponent to that result.', parts: [
        { id: 'e6a', level: 'ADV', make: function (r) { var v = r.pick(LET), c = r.pick([2, 2, 3]), a = r.int(2, 3), n = 3, m = 2; if (c === 3) n = 2; return nested(c, [[v, a]], null, n, m); } },
        { id: 'e6b', level: 'ADV', make: function (r) { var v = r.pick(LET), c = -r.pick([3, 3, 2, 4, 5]); return nested(c, [[v, 1]], null, 2, c === -2 || c === -3 ? 3 : 2); } },
        { id: 'e6c', level: 'ADV', make: function (r) { var v = r.pick(LET), d = r.pick([2, 2, 3]); return nested(1, [[v, r.int(2, 3)]], d, 2, d === 2 ? 3 : 2); } }] },
      { num: '7', stem: 'Distribute each outer exponent first, then combine like bases with the Product or Quotient Law. Leave every answer with <b>positive exponents</b>. If a letter’s bigger exponent is on the bottom, the leftover factors stay on the bottom: ' + t('\\dfrac{x^{2}}{x^{5}}=\\dfrac{1}{x^{3}}') + '.', parts: [
        { id: 'e7a', level: 'ADV', make: function (r) { var vw = lets(r, 2).sort(), a = r.int(2, 3), n = r.int(2, 3); return xPart([Fc(1, [[vw[0], a]], n, [1, [[vw[1], 1]]]), Fc(1, [[vw[0], 1], [vw[1], 1]], 2)], [], { sep: '\\cdot ' }, ['Clear each bracket, then combine the powers of each letter. If more of a letter is on the bottom, the leftover stays on the bottom: ' + t('\\frac{y^{2}}{y^{3}}=\\frac{1}{y}') + '.']); } },
        { id: 'e7b', level: 'PRG', make: function (r) { var v = r.pick(LET), c1 = r.int(2, 5), c2 = r.int(2, 5); return xPart([Fc(c1, [[v, r.int(2, 4)]], 2), Fc(c2, [[v, 1]], 2)], [], { sep: '\\cdot ' }); } },
        { id: 'e7c', level: 'ADV', make: function (r) { var vw = lets(r, 2).sort(), c = r.int(2, 5), a = r.int(2, 3); return xPart([Fc(c, [[vw[0], a], [vw[1], 1]], 2)], [Fc(1, [[vw[0], 1], [vw[1], 1]], 3)], {}, ['Clear both brackets, then subtract exponents letter by letter. If a letter has the bigger exponent on the bottom, its leftover stays on the bottom.']); } }] },
      { num: '8', stem: 'Simplify completely.', parts: [
        { id: 'e8a', level: 'PRG', make: function (r) { var v = r.pick(LET), o = r.pick([[4, 2, 2, 3], [2, 3, 2, 2], [6, 2, 3, 3], [8, 2, 4, 3], [3, 3, 3, 2], [9, 2, 3, 3], [4, 3, 2, 4], [10, 2, 5, 2]]), a = r.int(2, 4); return xPart([Fc(o[0], [[v, a]], o[1])], [Fc(o[2], [[v, 1]], o[3])]); } },
        { id: 'e8b', level: 'ADV', make: function (r) { var vw = lets(r, 2).sort(), c = r.pick([2, 2, 3]); return xPart([Fc(c, [[vw[0], 1], [vw[1], r.int(2, 3)]], 3), Fc(1, [[vw[0], 1]], 2, [1, [[vw[1], 1]]])], [], { sep: '\\cdot ' }); } },
        { id: 'e8c', level: 'ADV', make: function (r) { var vw = lets(r, 2).sort(), a = r.int(3, 5), b = r.int(2, 3), n = 2; return xPart([Fc(1, [[vw[0], a + r.int(1, 2)]], n, [1, [[vw[1], b]]])], [Fc(1, [[vw[0], a]], n, [1, [[vw[1], b - 1]]])], { div: true }, ['Dividing by a fraction is multiplying by its reciprocal. Clear the brackets first, then subtract exponents letter by letter.']); } }] },
      { num: '9', stem: '<b>Stretch.</b> Simplify completely, two ways: first reduce the fraction inside the bracket and then raise it to the power; second, raise everything to the power first and reduce afterwards. Your two answers must match.', parts: [
        { id: 'e9', level: 'MAS', make: function (r) { var vw = lets(r, 2).sort(), x = vw[0], y = vw[1], o = r.pick([[2, 4], [2, 4], [3, 6], [2, 6], [3, 9], [4, 8], [5, 10], [2, 8]]), a = r.int(2, 3), b = r.int(2, 4), n = o[0] === 2 && o[1] === 4 ? 3 : 2;
          if (r.chance(0.2)) { o = [2, 4]; a = 2; b = 3; n = 3; x = 'x'; y = 'y'; }
          var top = M(o[0], [[x, a], [y, 1]]), bot = M(o[1], [[x, 1], [y, b]]), inside = mDiv(top, bot), R = mPow(inside, n), insT = mTex(inside), res = mTex(R);
          var big = dfr(mTex(mPow(top, n)), mTex(mPow(bot, n))), tex = pw(par(dfr(mT(o[0], [[x, a], [y, 1]]), mT(o[1], [[x, 1], [y, b]]))), n);
          var fl = [fld('Inside', 'the fraction inside, reduced:', true, [x, y]), fld('Answer', 'the answer:', true, [x, y])];
          return P.fields(t(tex), fl, [expoCk(insT, []), expoCk(res, [[cFr(1, o[1] / o[0]), 'coef-not-raised', 'Raise the number part to the power too: ' + t(pw(par(fr(1, o[1] / o[0])), n) + '=' + fr(1, Math.pow(o[1] / o[0], n))) + '.'], [eIs(y, -(b - 1) - n), 'add-exp', 'Multiply the exponents by ' + t(n) + '.']])],
            [insT, res], t(insT) + '; ' + t(res),
            '<b>Way 1:</b> reduce inside first: ' + t(dfr(mT(o[0], [[x, a], [y, 1]]), mT(o[1], [[x, 1], [y, b]])) + '=' + insT) + ' (the ' + t(y) + '’s leave ' + t(vt(y, b - 1)) + ' on the bottom), then ' + t(pw(par(insT), n) + '=' + res) + '. <b>Way 2:</b> raise first: ' + t(tex + '=' + big) + ', then reduce: ' + t('=' + res) + '. The answers match.',
            ['Reduce the numbers and cancel matching letters inside the bracket first.', 'Then raise everything that is left — top and bottom — to the power.'], plain(tex)); } }] },

      /* ===================== Part C ===================== */
      { num: '10', section: 'Part C — Finding the Mistake, Finding the Missing Piece', stem: 'Each student below made the <b>same kind of error</b>.',
        shared: function (r) { return { c: r.int(2, 9), v: r.pick(['x', 'x', 'y', 'm']), d: r.int(2, 5), n: r.pick([2, 3, 3]) }; },
        parts: [
          { id: 'e10a', level: 'EMG', make: function (r, s) { var p = pp(s.c, [[s.v, 1]], 2); p.prompt = 'Jaya wrote ' + t(pw(par(s.c + s.v), 2) + '=' + s.c + pw(s.v, 2)) + '. Give the correct answer.'; p.bad = [s.c + pw(s.v, 2)]; return p; } },
          { id: 'e10b', level: 'EMG', make: function (r, s) { var d = s.d, n = d <= 3 ? s.n : 2, p = pq(1, [[s.v, 1]], d, [], n); p.prompt = 'Omar wrote ' + t(pw(par(dfr(s.v, d)), n) + '=' + dfr(pw(s.v, n), d)) + '. Give the correct answer.'; p.bad = [fr(pw(s.v, n), d)]; return p; } },
          { id: 'e10c', level: 'EMG', make: function (r, s) {
            return mc(r, 'What error did both students make?', [
              { html: 'They raised only the variable; the number in the bracket (the coefficient, or the denominator) has to be raised to the power too.', right: true },
              { html: 'They multiplied the exponents when they should have added them.', why: 'There is only one exponent on each letter here. Look at the numbers.' },
              { html: 'They should have multiplied the number by the exponent.', why: 'Raising to a power is repeated multiplication of the number by itself.' },
              { html: 'There is no error; numbers in brackets are never raised.', why: 'Everything inside the brackets is raised to the power.' }],
              'Both forgot that the number inside the brackets also takes the exponent: ' + t(pw(par(s.c + s.v), 2) + '=' + s.c * s.c + pw(s.v, 2)) + '.', ['What else is inside the brackets besides the letter?'], 'same error'); } }] },
      { num: '11', stem: 'Two more pieces of student work. Decide whether each is correct; if not, fix it.',
        shared: function (r) { return { c: r.int(2, 9), v: r.pick(['m', 'm', 'x', 'p']), e: r.int(2, 4), c2: r.pick([2, 2, 3]), w: r.pick(['a', 'a', 'b', 'k']), e2: r.int(2, 4), n2: r.pick([3, 4, 4]) }; },
        parts: [
          { id: 'e11a', sub: 'a i', level: 'EMG', make: function (r, s) { var c = s.c, v = s.v, e = s.e, C = c * c;
            return mc(r, 'Priya wrote ' + t(pw(par('-' + c + pw(v, e)), 2) + '=-' + C + pw(v, 2 * e)) + '. Is it correct?', [
              { html: '<b>Incorrect.</b> Squaring ' + t('-' + c) + ' gives ' + t('+' + C) + ': an even power of a negative is positive.', right: true },
              { html: '<b>Correct.</b>', why: t('(-' + c + ')(-' + c + ')') + ' is positive.' },
              { html: '<b>Incorrect.</b> The exponent of ' + t(v) + ' should be ' + t(e + 2) + '.', why: 'Power of a Power multiplies: ' + t(e + '\\times 2=' + 2 * e) + ' is right.' },
              { html: '<b>Incorrect.</b> The ' + t(c) + ' should not be squared.', why: 'It is inside the brackets, so it is squared.' }],
              t(pw(par('-' + c + pw(v, e)), 2) + '=' + pw('(-' + c + ')', 2) + pw(v, 2 * e) + '=' + C + pw(v, 2 * e)) + '. Priya lost track of the sign: negative × negative is positive.', ['What is ' + t('(-' + c + ')\\times(-' + c + ')') + '?'], 'Priya sign'); } },
          { id: 'e11b', sub: 'a ii', level: 'EMG', make: function (r, s) { var p = pp(-s.c, [[s.v, s.e]], 2); p.prompt = 'Give the correct simplified form of ' + p.prompt + '.'; return p; } },
          { id: 'e11c', sub: 'b i', level: 'EMG', make: function (r, s) { var c = s.c2, w = s.w, e = s.e2, n = s.n2;
            return mc(r, 'Devon wrote ' + t(pw(par(c + pw(w, e)), n) + '=' + c + pw(w, e * n)) + '. Is it correct?', [
              { html: '<b>Incorrect.</b> The coefficient ' + t(c) + ' takes the exponent too: ' + t(pw(c, n) + '=' + Math.pow(c, n)) + '.', right: true },
              { html: '<b>Correct.</b>', why: 'Expand ' + n + ' copies of ' + t(c + pw(w, e)) + ': how many ' + t(c) + 's are multiplied?' },
              { html: '<b>Incorrect.</b> The exponent should be ' + t(e + n) + '.', why: 'Power of a Power multiplies the exponents: ' + t(e * n) + ' is right.' },
              { html: '<b>Incorrect.</b> The coefficient should be ' + t(c * n) + '.', why: t(pw(c, n)) + ' is repeated multiplication, not ' + t(c + '\\times ' + n) + '.' }],
              t(pw(par(c + pw(w, e)), n) + '=' + pw(c, n) + pw(w, e * n) + '=' + Math.pow(c, n) + pw(w, e * n)) + '. Devon forgot to raise the coefficient.', ['Is the ' + t(c) + ' inside the brackets?'], 'Devon coef'); } },
          { id: 'e11d', sub: 'b ii', level: 'EMG', make: function (r, s) { var p = pp(s.c2, [[s.w, s.e2]], s.n2); p.prompt = 'Give the correct simplified form of ' + p.prompt + '.'; return p; } }] },
      { num: '12', stem: '<b>Work backwards.</b> Find the value of each unknown. Assume every unknown letter stands for a number.', parts: [
        { id: 'e12a', level: 'ADV', make: function (r) { var a = r.pick([2, 3, 3, 4, 5, 10]), b = r.int(2, 8), A = Math.pow(a, 3); if (r.chance(0.15)) { a = 3; b = 4; }
          var fl = [fld('a', t('a=')), fld('b', t('b='))];
          return P.fields(t(pw(par('a' + pw('x', 'b')), 3) + '=' + Math.pow(a, 3) + pw('x', 3 * b)) + '; find ' + t('a') + ' and ' + t('b') + '.', fl, [numCk(a, [[A / 3, 'times-exp', t('a^{3}') + ' means ' + t('a\\times a\\times a') + ', not ' + t('3a') + '.'], [A, 'u2l3-k-sq', t('a^{3}=' + A) + ': which number cubed is ' + t(A) + '?']]), numCk(b, [[3 * b - 3, 'add-exp', 'Power of a Power: ' + t('3b=' + 3 * b) + ' (multiply).'], [3 * b, 'u2l3-swap-unk', t('3b=' + 3 * b) + ': divide by ' + t(3) + '.']])],
            [String(a), String(b)], t('a=' + a) + ', ' + t('b=' + b), t(pw(par('a' + pw('x', 'b')), 3) + '=a^{3}' + pw('x', '3b')) + '. So ' + t('a^{3}=' + A) + ', ' + t('a=' + a) + '; and ' + t('3b=' + 3 * b) + ', ' + t('b=' + b) + '.', ['Expand the left side, then match the coefficient and the exponent.'], '(ax^b)^3=' + A + 'x^' + 3 * b); } },
        { id: 'e12b', level: 'PRG', make: function (r) { var d = r.int(2, 6), a = r.int(2, 7), D = d * d;
          return numPart(t(pw(par(dfr(pw('x', 'a'), d)), 2) + '=' + dfr(pw('x', 2 * a), D)) + '; find ' + t('a') + '.', a, [[2 * a - 2, 'add-exp', 'Power of a Power: ' + t('2a=' + 2 * a) + '.'], [2 * a, 'u2l3-swap-unk', t('2a=' + 2 * a) + ': divide by ' + t(2) + '.']], t(pw(par(fr(pw('x', 'a'), d)), 2) + '=' + fr(pw('x', '2a'), D)) + ', so ' + t('2a=' + 2 * a) + ' and ' + t('a=' + a) + '.', ['Raise the top and the bottom to the power, then match the exponents.'], '(x^a/' + d + ')^2', t('a=')); } },
        { id: 'e12c', level: 'PRG', make: function (r) { var c = r.pick([2, 2, 3]), p = c === 2 ? r.pick([3, 4, 5]) : r.pick([2, 3, 4]), n = r.int(2, 7), C = Math.pow(c, p);
          return numPart(t(pw(par(c + pw('x', 'n')), p) + '=' + C + pw('x', p * n)) + '; find ' + t('n') + '.', n, [[p * n - p, 'add-exp', 'Power of a Power: ' + t(p + 'n=' + p * n) + '.'], [p * n, 'u2l3-swap-unk', t(p + 'n=' + p * n) + ': divide by ' + t(p) + '.']], t(pw(par(c + pw('x', 'n')), p) + '=' + C + pw('x', p + 'n')) + ', so ' + t(p + 'n=' + p * n) + ' and ' + t('n=' + n) + '.', ['Expand the left side, then match the exponents of ' + t('x') + '.'], '(' + c + 'x^n)^' + p, t('n=')); } }] },
      { num: '13', stem: 'Work backwards again.', parts: [
        { id: 'e13a', level: 'ADV', make: function (r) { var o = r.pick([[2, 4], [2, 4], [2, 2], [3, 2], [3, 4], [2, 6], [5, 2]]), c = o[0], n = o[1], a = r.int(2, 4), C = Math.pow(c, n);
          return numPart(t(pw(par('-' + c + pw('x', a)), 'n') + '=' + C + pw('x', a * n)) + '; find ' + t('n') + '.', n, [[a * n, 'u2l3-swap-unk', 'Match the exponents of ' + t('x') + ': ' + t(a + 'n=' + a * n) + '.'], [a * n - a, 'add-exp', 'Power of a Power: ' + t(a + 'n=' + a * n) + ' (multiply).']], t(pw(par('-' + c + pw('x', a)), 'n') + '=' + pw('(-' + c + ')', 'n') + pw('x', a + 'n')) + '. Exponents: ' + t(a + 'n=' + a * n) + ', so ' + t('n=' + n) + '. Check: ' + t(pw('(-' + c + ')', n) + '=' + C) + ' (positive, because ' + n + ' is even).', ['Use the exponent of ' + t('x') + ' to find ' + t('n') + ', then check the coefficient.'], '(-' + c + 'x^' + a + ')^n', t('n=')); } },
        { id: 'e13b', level: 'ADV', make: function (r) { var a = r.int(2, 9), d = r.pick([5, 2, 3, 4, 6, 7]), A = a * a, D = d * d, v = r.pick(['y', 'y', 'x', 'm']); if (a === d) a++; A = a * a;
          return numPart(t(pw(par(dfr('a' + pw(v, 2), d)), 2) + '=' + dfr(A + pw(v, 4), D)) + '; find the <b>positive</b> value of ' + t('a') + '.', a, [[A, 'u2l3-k-sq', t('a^{2}=' + A) + ': which positive number squared is ' + t(A) + '?'], [A / 2, 'times-exp', t('a^{2}') + ' means ' + t('a\\times a') + '.'], [-a, 'sign', 'The question asks for the positive value.']],
            t(pw(par(fr('a' + pw(v, 2), d)), 2) + '=' + fr('a^{2}' + pw(v, 4), D)) + ', so ' + t('a^{2}=' + A) + ' and ' + t('a=' + a) + ' (positive).', ['Raise the top and the bottom to the power, then match the numerators.'], '(a' + v + '^2/' + d + ')^2', t('a=')); } },
        { id: 'e13c', level: 'ADV', make: function (r) { var c = -r.pick([2, 2, 3, 4, 5]), C = c * c * c, a = r.int(2, 4), b = r.int(1, 2);
          return numPart(t(pw(par('c' + pw('x', a) + vt('y', b)), 3) + '=' + C + pw('x', 3 * a) + pw('y', 3 * b)) + '; find ' + t('c') + '.', c, [[-c, 'u2l3-sign-lost', 'Cube your answer: ' + t(pw(-c, 3) + '=' + -C) + ', which is positive. You need ' + t(C) + '.'], [C / 3, 'times-exp', t('c^{3}') + ' means ' + t('c\\times c\\times c') + '.']],
            t(pw(par('c' + pw('x', a) + vt('y', b)), 3) + '=c^{3}' + pw('x', 3 * a) + pw('y', 3 * b)) + ', so ' + t('c^{3}=' + C) + '. An odd power keeps the sign, so ' + t('c') + ' is negative: ' + t('c=' + c) + ' (check: ' + t(pw('(' + c + ')', 3) + '=' + C) + ').', ['Which number cubed is ' + t(C) + '? Watch the sign.'], '(cx^' + a + 'y)^3', t('c=')); } }] },

      /* ===================== Part D ===================== */
      { num: '14', section: 'Part D — Numerical Checks, Geometry, and Reasoning', stem: 'A law is only trustworthy if the numbers agree.',
        shared: function (r) { var ab = pickWhere(function () { return [r.int(2, 5), r.int(2, 5)]; }, function (x) { return x[0] !== x[1]; }), n = r.pick([2, 3, 3]); if (r.chance(0.2)) { ab = [2, 3]; n = 3; } return { a: ab[0], b: ab[1], n: n }; },
        parts: [
          { id: 'e14a', level: 'BEG', make: function (r, s) { var a = s.a, b = s.b, n = s.n, V = Math.pow(a * b, n), fl = [fld('L', t(pw('(' + a + '\\times ' + b + ')', n) + '=')), fld('R', t(pw(a, n) + '\\times ' + pw(b, n) + '='))];
            return P.fields('Evaluate ' + t(pw('(' + a + '\\times ' + b + ')', n)) + ' and ' + t(pw(a, n) + '\\times ' + pw(b, n)) + ' separately.', fl, [numCk(V, [[a * b * n, 'times-exp', t(pw(a * b, n)) + ' means ' + t(a * b) + ' multiplied by itself ' + n + ' times.']]), numCk(V, [[Math.pow(a, n) + Math.pow(b, n), 'u2l3-sum', 'Multiply the two powers, don’t add them.']])],
              [String(V), String(V)], t(F(V)) + ' and ' + t(F(V)), t(pw('(' + a + '\\times ' + b + ')', n) + '=' + pw(a * b, n) + '=' + F(V)) + ' and ' + t(pw(a, n) + '\\times ' + pw(b, n) + '=' + Math.pow(a, n) + '\\times ' + Math.pow(b, n) + '=' + F(V)) + '. They agree: this confirms the Power of a Product Law.', ['Brackets first on the left.'], 'check power of product'); } },
          { id: 'e14b', level: 'BEG', make: function (r, s) { var a = s.a, b = s.b, n = s.n, L = Math.pow(a + b, n), R = Math.pow(a, n) + Math.pow(b, n), fl = [fld('L', t(pw('(' + a + '+' + b + ')', n) + '=')), fld('R', t(pw(a, n) + '+' + pw(b, n) + '='))];
            return P.fields('Now evaluate ' + t(pw('(' + a + '+' + b + ')', n)) + ' and ' + t(pw(a, n) + '+' + pw(b, n)) + ' separately.', fl, [numCk(L, [[R, 'u2l3-sum', 'Brackets first: ' + t(a + '+' + b + '=' + (a + b)) + ', then raise it to the power.']]), numCk(R, [[L, 'u2l3-sum', 'Evaluate each power separately, then add.']])],
              [String(L), String(R)], t(L) + ' and ' + t(R), t(pw('(' + a + '+' + b + ')', n) + '=' + pw(a + b, n) + '=' + L) + ' but ' + t(pw(a, n) + '+' + pw(b, n) + '=' + Math.pow(a, n) + '+' + Math.pow(b, n) + '=' + R) + '. They do <b>not</b> agree.', ['Brackets first on the left.'], 'check sum'); } },
          { id: 'e14c', level: 'EMG', make: function (r, s) {
            return mc(r, 'What do (a) and (b) tell you?', [
              { html: 'An exponent can be distributed over a <b>product</b> (the Power of a Product Law) but <b>not</b> over a sum.', right: true },
              { html: 'An exponent can be distributed over both products and sums.', why: 'Part (b) gave two different values.' },
              { html: 'The Power of a Product Law is false.', why: 'Part (a) gave equal values: the law held.' },
              { html: 'An exponent can be distributed over a sum but not a product.', why: 'That is backwards: look at which pair agreed.' }],
              'The product pair agreed and the sum pair did not: ' + t('(ab)^{n}=a^{n}b^{n}') + ', but ' + t('(a+b)^{n}\\neq a^{n}+b^{n}') + '.', ['Which pair of values matched?'], 'distribute over product only'); } }] },
      { num: '15', stem: 'Repeat the same two tests with division and subtraction.',
        shared: function (r) { var o = r.pick([[10, 5], [10, 5], [12, 4], [6, 3], [8, 2], [12, 3], [15, 5], [10, 2], [20, 10], [9, 3], [12, 6], [14, 7], [16, 8], [18, 6], [20, 5], [8, 4], [6, 2], [15, 3], [21, 7], [30, 10]]), n = o[0] <= 12 ? r.pick([2, 3, 3]) : 2; if (o[0] >= 20) n = 2; return { a: o[0], b: o[1], n: n }; },
        parts: [
          { id: 'e15a', level: 'BEG', make: function (r, s) { var a = s.a, b = s.b, n = s.n, V = Math.pow(a / b, n), fl = [fld('L', t(pw(par(dfr(a, b)), n) + '=')), fld('R', t(dfr(pw(a, n), pw(b, n)) + '='))];
            return P.fields('Evaluate ' + t(pw(par(dfr(a, b)), n)) + ' and ' + t(dfr(pw(a, n), pw(b, n))) + '.', fl, [numCk(V, [[a / b * n, 'times-exp', t(pw(a / b, n)) + ' means ' + t(a / b) + ' multiplied by itself ' + n + ' times.']]), numCk(V, [[Math.pow(a, n) - Math.pow(b, n), 'u2l3-sum', 'Divide the two powers.']])],
              [String(V), String(V)], t(V) + ' and ' + t(V), t(pw(par(fr(a, b)), n) + '=' + pw(a / b, n) + '=' + V) + ' and ' + t(fr(pw(a, n), pw(b, n)) + '=' + fr(F(Math.pow(a, n)), F(Math.pow(b, n))) + '=' + V) + '. They agree.', ['Simplify inside the brackets first.'], 'check quotient'); } },
          { id: 'e15b', level: 'BEG', make: function (r, s) { var a = s.a, b = s.b, n = s.n, L = Math.pow(a - b, n), R = Math.pow(a, n) - Math.pow(b, n), fl = [fld('L', t(pw('(' + a + '-' + b + ')', n) + '=')), fld('R', t(pw(a, n) + '-' + pw(b, n) + '='))];
            return P.fields('Evaluate ' + t(pw('(' + a + '-' + b + ')', n)) + ' and ' + t(pw(a, n) + '-' + pw(b, n)) + '.', fl, [numCk(L, [[R, 'u2l3-sum', 'Brackets first: ' + t(a + '-' + b + '=' + (a - b)) + '.']]), numCk(R, [[L, 'u2l3-sum', 'Evaluate each power separately, then subtract.']])],
              [String(L), String(R)], t(F(L)) + ' and ' + t(F(R)), t(pw('(' + a + '-' + b + ')', n) + '=' + pw(a - b, n) + '=' + F(L)) + ' but ' + t(pw(a, n) + '-' + pw(b, n) + '=' + F(Math.pow(a, n)) + '-' + F(Math.pow(b, n)) + '=' + F(R)) + '. They do not agree.', ['Brackets first.'], 'check difference'); } },
          { id: 'e15c', level: 'EMG', make: function (r) {
            return mc(r, 'Over which two operations may an exponent be distributed?', [
              { html: 'Multiplication and division only.', right: true },
              { html: 'Addition and subtraction only.', why: 'Those were the pairs that did <b>not</b> agree.' },
              { html: 'All four operations.', why: 'Questions 14(b) and 15(b) gave different values.' },
              { html: 'Multiplication and addition only.', why: 'Check 14(b): the sum did not agree.' }],
              'The product and quotient checks agreed; the sum and difference checks did not. An exponent may be distributed over multiplication and division only, never over addition or subtraction.', ['Which checks agreed?'], 'which operations'); } }] },
      { num: '16', stem: function (sh) { return 'A square has side length ' + t(sh.c + pw('x', sh.a)) + ' centimetres.'; },
        shared: function (r) { var c = r.int(2, 6), a = r.int(1, 3), x = r.pick([2, 2, 3]); if (r.chance(0.2)) { c = 3; a = 2; x = 2; } if (a === 1) a = 2; return { c: c, a: a, x: x }; },
        parts: [
          { id: 'e16a', level: 'EMG', make: function (r, s) { var c = s.c, a = s.a, A = c * c + pw('x', 2 * a), Pm = 4 * c + pw('x', a), fl = [fld('Area', 'area:', true, ['x']), fld('Perimeter', 'perimeter:', true, ['x'])];
            return P.fields('Write an expression for its area, and one for its perimeter.', fl, [expoCk(A, [[cIs(c), 'coef-not-raised', 'Area = ' + t(pw(par(c + pw('x', a)), 2)) + ': square the ' + t(c) + ' too.'], [eIs('x', a + 2), 'add-exp', 'Power of a Power: multiply the exponents.'], [both2(cIs(4 * c), eIs('x', a)), 'u2l3-perim', 'That is the perimeter. Area = side × side.']]), expoCk(Pm, [[both2(cIs(c * c), eIs('x', 2 * a)), 'u2l3-perim', 'That is the area. The perimeter adds the four sides: ' + t('4\\times ' + c + pw('x', a)) + '.'], [eIs('x', 4 * a), 'u2l3-perim', 'Perimeter = 4 × side; the four sides are added, so the exponent doesn’t change.']])],
              [A, Pm], t('A=' + A) + ', ' + t('P=' + Pm), 'Area: ' + t(pw(par(c + pw('x', a)), 2) + '=' + A) + ' cm². Perimeter: ' + t('4\\times ' + c + pw('x', a) + '=' + Pm) + ' cm (four equal sides added).', ['Area = side²; perimeter = 4 × side.'], 'square ' + c + 'x^' + a); } },
          { id: 'e16b', level: 'EMG', make: function (r, s) { var c = s.c, a = s.a, x = s.x, A = c * c * Math.pow(x, 2 * a), Pm = 4 * c * Math.pow(x, a), fl = [fld('Area', 'area when ' + t('x=' + x) + ':'), fld('Perimeter', 'perimeter when ' + t('x=' + x) + ':')];
            return P.fields('Evaluate both expressions when ' + t('x=' + x) + '.', fl, [numCk(A, [[c * Math.pow(x, 2 * a), 'coef-not-raised', 'The coefficient of the area is ' + t(c * c) + '.']]), numCk(Pm, [[A, 'u2l3-perim', 'That is the area.']])],
              [String(A), String(Pm)], t(F(A)) + ' cm² and ' + t(Pm) + ' cm', 'Area ' + t(c * c + pw('(' + x + ')', 2 * a) + '=' + c * c + '\\times ' + F(Math.pow(x, 2 * a)) + '=' + F(A)) + ' cm². Perimeter ' + t(4 * c + pw('(' + x + ')', a) + '=' + 4 * c + '\\times ' + Math.pow(x, a) + '=' + Pm) + ' cm.', ['Substitute into your expressions from (a).'], 'square values'); } }] },
      { num: '17', stem: function (sh) { return 'A cube has edge length ' + t(sh.c + sh.v + sh.w) + ' metres.'; },
        shared: function (r) { var c = r.pick([2, 2, 3, 4, 5]), vw = r.pick([['x', 'y'], ['x', 'y'], ['a', 'b'], ['m', 'n'], ['p', 'q']]), X = 1, Y = r.pick([2, 2, 3]); if (r.chance(0.2)) { c = 2; vw = ['x', 'y']; Y = 2; } return { c: c, v: vw[0], w: vw[1], X: X, Y: Y }; },
        parts: [
          { id: 'e17a', level: 'PRG', make: function (r, s) { var c = s.c, v = s.v, w = s.w, Vo = c * c * c + pw(v, 3) + pw(w, 3), SA = 6 * c * c + pw(v, 2) + pw(w, 2), fl = [fld('Volume', 'volume:', true, [v, w]), fld('SA', 'total surface area:', true, [v, w])];
            return P.fields('Write an expression for its volume and one for its total surface area (six square faces).', fl, [expoCk(Vo, [[cIs(c), 'coef-not-raised', 'Cube the ' + t(c) + ' too: ' + t(pw(c, 3) + '=' + c * c * c) + '.'], [cIs(3 * c), 'coef-times', t(pw(c, 3)) + ' means ' + t(c + '\\times ' + c + '\\times ' + c) + '.']]), expoCk(SA, [[cIs(c * c), 'u2l3-sa', 'That is one face. There are six faces.'], [cIs(6 * c), 'coef-not-raised', 'Each face is ' + t(pw(par(c + v + w), 2) + '=' + c * c + pw(v, 2) + pw(w, 2)) + '.'], [eIs(v, 3), 'u2l3-sa', 'A face is a square: use (edge)², not (edge)³.']])],
              [Vo, SA], t('V=' + Vo) + ', ' + t('SA=' + SA), 'Volume: ' + t(pw(par(c + v + w), 3) + '=' + Vo) + ' m³. Each face: ' + t(pw(par(c + v + w), 2) + '=' + c * c + pw(v, 2) + pw(w, 2)) + ', so the surface area is ' + t('6\\times ' + c * c + pw(v, 2) + pw(w, 2) + '=' + SA) + ' m².', ['Volume = (edge)³. Surface area = 6 × (edge)².'], 'cube ' + c + v + w); } },
          { id: 'e17b', level: 'EMG', make: function (r, s) { var c = s.c, v = s.v, w = s.w, X = s.X, Y = s.Y, E = c * X * Y, V = E * E * E, fl = [fld('Edge', 'edge length:'), fld('Cubed', 'edge cubed:'), fld('Expr', 'your volume expression gives:')];
            return P.fields('Check your volume expression by letting ' + t(v + '=' + X) + ' and ' + t(w + '=' + Y) + ': find the edge length, cube it, and compare with what your expression gives.', fl, [numCk(E, []), numCk(V, [[3 * E, 'times-exp', 'Cubing means ' + t(E + '\\times ' + E + '\\times ' + E) + '.']]), numCk(V, [[c * Math.pow(X * Y, 3), 'coef-not-raised', 'Your expression should have ' + t(c * c * c) + ' in front.']])],
              [String(E), String(V), String(V)], t(E) + ', ' + t(V) + ', ' + t(V), 'Edge: ' + t(c + '(' + X + ')(' + Y + ')=' + E) + '; ' + t(pw(E, 3) + '=' + V) + '. Expression: ' + t(c * c * c + pw('(' + X + ')', 3) + pw('(' + Y + ')', 3) + '=' + c * c * c + '\\times ' + Math.pow(X, 3) + '\\times ' + Math.pow(Y, 3) + '=' + V) + '. They match.', ['Substitute into the edge first, then into your expression.'], 'cube check'); } }] },
      { num: '18', stem: function (sh) { return 'A cube has edge length ' + t('e') + '. A square has side ' + t('s') + '.'; },
        shared: function (r) { return { k: r.pick([2, 2, 3, 4, 5, 6, 7, 8, 9, 10]), j: r.pick([3, 3, 2, 4, 5, 6, 7, 8, 9, 10]) }; },
        parts: [
          { id: 'e18a', level: 'EMG', make: function (r, s) { var k = s.k, K3 = k * k * k, fl = [fld('Vol', 'volume of the cube with edge ' + t(k + 'e') + ':', true, ['e']), fld('Times', 'how many times larger than ' + t('e^{3}') + ':')];
            return P.fields('Write the volume of a cube whose edge is ' + t(k + 'e') + ', and state how many times larger it is than the volume ' + t('e^{3}') + ' of the original cube.', fl, [expoCk(K3 + 'e^{3}', [[cIs(k), 'coef-not-raised', 'Cube the ' + t(k) + ' too: ' + t(pw(k, 3) + '=' + K3) + '.'], [cIs(3 * k), 'coef-times', t(pw(k, 3)) + ' means ' + t(k + '\\times ' + k + '\\times ' + k) + '.']]), numCk(K3, [[k, 'u2l3-times-k', 'The volume has three dimensions, each ' + k + ' times as long: ' + t(pw(k, 3)) + ' times.'], [3 * k, 'coef-times', t(pw(k, 3)) + ' means ' + t(k + '\\times ' + k + '\\times ' + k) + '.']])],
              [K3 + 'e^{3}', String(K3)], t(pw('(' + k + 'e)', 3) + '=' + K3 + 'e^{3}') + '; ' + K3 + ' times', t(pw(par(k + 'e'), 3) + '=' + pw(k, 3) + 'e^{3}=' + K3 + 'e^{3}') + ', so the volume is ' + t(K3) + ' times larger.', ['Power of a Product: the ' + t(k) + ' is cubed too.'], 'cube scale ' + k); } },
          { id: 'e18b', level: 'EMG', make: function (r, s) { var j = s.j, J = j * j;
            return numPart('If the side of the square is multiplied by ' + t(j) + ' to ' + t(j + 's') + ', how many times larger is the area?', J, [[j, 'u2l3-times-k', 'Area uses two dimensions: ' + t(pw(par(j + 's'), 2) + '=' + J + 's^{2}') + '.'], [2 * j, 'coef-times', t(pw(j, 2)) + ' means ' + t(j + '\\times ' + j) + '.']], t(pw(par(j + 's'), 2) + '=' + pw(j, 2) + 's^{2}=' + J + 's^{2}') + ', so the area is ' + t(J) + ' times larger.', ['Square the new side: the ' + t(j) + ' is squared too.'], 'square scale ' + j); } },
          { id: 'e18c', level: 'EMG', make: function (r, s) { var j = s.j;
            return mc(r, 'Why is the area multiplier not ' + t(j) + '?', [
              { html: 'The ' + t(j) + ' is inside the bracket ' + t(pw(par(j + 's'), 2)) + ', so it is squared along with the side: both the length and the width grow ' + j + ' times.', right: true },
              { html: 'Because area is measured in different units.', why: 'The units are the same; the multiplier itself gets squared.' },
              { html: 'It is ' + t(j) + ' — only the side changes.', why: 'Work it out: ' + t(pw(par(j + 's'), 2)) + '.' },
              { html: 'Because you add ' + t(j) + ' to each side.', why: 'The side is multiplied by ' + t(j) + ', not increased by ' + t(j) + '.' }],
              'Area = side × side. Both factors are ' + j + ' times larger, so the area is ' + t(j + '\\times ' + j + '=' + j * j) + ' times larger: the multiplier is squared along with the side.', ['Area uses the side twice.'], 'why not ' + j); } }] },
      { num: '19', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e19', level: 'EMG', make: function (r) { var c = r.pick([2, 2, 3]), a = r.pick([3, 3, 2, 4]), v = r.pick(['x', 'x', 'a', 'm']), w = r.pick(['y', 'y', 'b', 'n']), C = c * c * c;
          return mc(r, 'Which expression is equivalent to ' + t(pw(par(dfr('-' + c + pw(v, a), w)), 3)) + '?', [
            { html: t(dfr('-' + 3 * c + pw(v, 3 * a), pw(w, 3))), why: 'Cubing ' + t(c) + ' means ' + t(c + '\\times ' + c + '\\times ' + c) + ', not ' + t('3\\times ' + c) + '.' },
            { html: t(dfr('-' + C + pw(v, 3 * a), pw(w, 3))), right: true },
            { html: t(dfr(C + pw(v, a + 3), pw(w, 3))), why: 'An odd power keeps the negative sign, and the exponents multiply.' },
            { html: t(dfr('-' + C + pw(v, Math.pow(a, 3)), pw(w, 3))), why: 'Multiply the exponents: ' + t(a + '\\times 3') + ', not ' + t(pw(a, 3)) + '.' }],
            t(pw(par(fr('-' + c + pw(v, a), w)), 3) + '=' + fr(pw('(-' + c + ')', 3) + pw(v, a + '\\times 3'), pw(w, 3)) + '=-' + fr(C + pw(v, 3 * a), pw(w, 3))) + '.', ['Raise every part — the ' + t('-' + c) + ', the ' + t(pw(v, a)) + ' and the ' + t(w) + ' — to the power ' + t(3) + '.'], 'MC quotient cubed', true); } }] },
      { num: '20', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e20', level: 'EMG', make: function (r) { var c = r.pick([2, 2, 3, 5]), n = c === 2 ? r.pick([4, 3, 5]) : r.pick([2, 3, 4]), a = r.int(2, 3), b = r.int(2, 3), C = Math.pow(c, n);
          return P.nr('If ' + t(pw(par(c + pw('x', a) + pw('y', b)), n) + '=k' + pw('x', a * n) + pw('y', b * n)) + ', the value of ' + t('k') + ' is ________.', C, function (x) { return x === c ? { code: 'coef-not-raised', hint: 'Raise the ' + t(c) + ' to the power ' + t(n) + ' too.' } : x === c * n ? { code: 'coef-times', hint: t(pw(c, n)) + ' means ' + t(c) + ' multiplied by itself ' + n + ' times.' } : null; },
            t(pw(par(c + pw('x', a) + pw('y', b)), n) + '=' + pw(c, n) + pw('x', a * n) + pw('y', b * n)) + ', so ' + t('k=' + pw(c, n) + '=' + C) + '.', ['Only the coefficient matters for ' + t('k') + ': raise it to the power.'], '(' + c + 'x^' + a + 'y^' + b + ')^' + n); } }] },
      { num: '21', stem: function (sh) { return 'Ravi says “an exponent spreads onto everything inside the brackets.” Test his claim on ' + t('(x+y)^{2}') + ' and on ' + t('(xy)^{2}') + ' using ' + t('x=' + sh.x) + ' and ' + t('y=' + sh.y) + '.'; },
        shared: function (r) { var xy = pickWhere(function () { return [r.int(2, 7), r.int(2, 7)]; }, function (x) { return x[0] !== x[1]; }); if (r.chance(0.2)) xy = [3, 4]; return { x: xy[0], y: xy[1] }; },
        parts: [
          { id: 'e21a', level: 'BEG', make: function (r, s) { var x = s.x, y = s.y, A = (x + y) * (x + y), B = x * x + y * y, C = x * x * y * y, fl = [fld('A', t('(x+y)^{2}=')), fld('B', t('x^{2}+y^{2}=')), fld('C', t('(xy)^{2}=')), fld('D', t('x^{2}y^{2}='))];
            return P.fields('Show all four values.', fl, [numCk(A, [[B, 'u2l3-sum', 'Brackets first: ' + t(x + '+' + y + '=' + (x + y)) + ', then square.']]), numCk(B, [[A, 'u2l3-sum', 'Square each one, then add.']]), numCk(C, [[2 * x * y, 'times-exp', 'Square ' + t(x * y) + ': ' + t(x * y + '\\times ' + x * y) + '.']]), numCk(C, [])],
              [String(A), String(B), String(C), String(C)], t(A) + ', ' + t(B) + ', ' + t(C) + ', ' + t(C), t(pw('(' + x + '+' + y + ')', 2) + '=' + pw(x + y, 2) + '=' + A) + ' but ' + t(pw(x, 2) + '+' + pw(y, 2) + '=' + B) + '; ' + t(pw('(' + x + '\\times ' + y + ')', 2) + '=' + pw(x * y, 2) + '=' + C) + ' and ' + t(pw(x, 2) + '\\times ' + pw(y, 2) + '=' + x * x + '\\times ' + y * y + '=' + C) + '.', ['Brackets first.'], 'Ravi values'); } },
          { id: 'e21b', level: 'EMG', make: function (r) {
            return mc(r, 'Which rewrite of Ravi’s statement is true?', [
              { html: 'An exponent spreads onto every <b>factor</b> inside the brackets — over multiplication and division only.', right: true },
              { html: 'An exponent spreads onto every <b>term</b> inside the brackets, including sums.', why: 'The sum test failed: ' + t('(x+y)^{2}\\neq x^{2}+y^{2}') + '.' },
              { html: 'An exponent never spreads onto anything inside brackets.', why: 'The product test worked: ' + t('(xy)^{2}=x^{2}y^{2}') + '.' },
              { html: 'An exponent spreads only onto the first thing inside the brackets.', why: 'In ' + t('(xy)^{2}') + ' both factors are squared.' }],
              'The product test agreed and the sum test did not. True version: an exponent spreads onto every <b>factor</b> inside the brackets (multiplication and division), never over addition or subtraction.', ['Which of your two tests agreed?'], 'Ravi rewrite'); } }] },
      { num: '22', stem: '<b>Stretch.</b> Without a calculator, decide which is largest. Show the single power of a number each one reduces to before you compare.', parts: [
        { id: 'e22', level: 'ADV', make: function (r) { var o = r.pick([[2, 3, 2, 3, 12, 2], [2, 3, 2, 3, 12, 2], [3, 2, 2, 4, 16, 2], [2, 3, 2, 5, 30, 6], [2, 2, 2, 3, 15, 3], [3, 2, 2, 5, 20, 4], [2, 3, 3, 3, 18, 3], [2, 4, 3, 5, 30, 2], [2, 2, 2, 2, 10, 2], [2, 3, 3, 2, 14, 2]]), n = r.pick([3, 4, 4, 5]); if (r.chance(0.2)) { o = [2, 3, 2, 3, 12, 2]; n = 4; }
          var p = o[0], q = o[1], a = o[2], b = o[3], t1 = o[4], t2 = o[5], A = Math.pow(p, q), B = a * b, C = t1 / t2, vals = [A, B, C], mx = Math.max(A, B, C);
          var E = [pw(par(pw(p, q)), n), pw(par(a + '\\times ' + b), n), pw(par(dfr(t1, t2)), n)], keys = [pw(A, n), pw(B, n), pw(C, n)];
          var fl = E.map(function (e, i) { return fld('E' + i, t(e + '='), true); }).concat([fld('Largest', 'the largest is', true)]);
          var largest = vals.filter(function (v) { return v === mx; }).length > 1 ? null : E[vals.indexOf(mx)];
          return P.fields('Which is largest: ' + t(E.join(',\\ ')) + '? Write each as a single power of a whole number, then type the largest expression.', fl,
            vals.map(function (v, i) { return function (resp) { var x = K.read(resp); if (x.res) return x.res; var top = strip(x.ast); if (!ex.eq(x.val, Math.pow(v, n))) return wrong(i === 0 && ex.eq(x.val, Math.pow(p, q + n)) ? 'add-exp' : 'value', i === 0 ? 'Power of a Power: ' + t(pw(par(pw(p, q)), n) + '=' + pw(p, q * n) + '=' + pw(A, n)) + '.' : 'Simplify inside the brackets first.'); return top.t === 'pow' ? ok() : form('single-power', 'Right value — write it as a single power, like ' + t(pw(A, n)) + '.'); }; })
              .concat([function (resp) { var x = K.read(resp); if (x.res) return x.res; if (ex.eq(x.val, Math.pow(mx, n))) return ok(); return wrong('value', 'Compare the bases once all three have the same exponent ' + t(n) + '.'); }]),
            keys.concat([E[vals.indexOf(mx)]]), keys.map(function (k, i) { return t(E[i] + '=' + k); }).join(', ') + '; the largest is ' + t(E[vals.indexOf(mx)]),
            t(E[0] + '=' + pw(par(A), n) + '=' + pw(A, n)) + ' (since ' + t(pw(p, q) + '=' + A) + '), ' + t(E[1] + '=' + pw(B, n)) + ', ' + t(E[2] + '=' + pw(C, n)) + '. All three have the exponent ' + t(n) + ', so compare the bases ' + t(A) + ', ' + t(B) + ', ' + t(C) + ': the largest is ' + t(E[vals.indexOf(mx)]) + (B === C ? ', and the other two are equal.' : '.'),
            ['Simplify inside each bracket: ' + t(pw(p, q)) + ', ' + t(a + '\\times ' + b) + ', ' + t(fr(t1, t2)) + '.', 'With the same exponent, the bigger base gives the bigger power.'], 'largest of three'); } }] }
    ]
  });

  /* ---------- part makers that use the lesson data ---------- */
  function both2(f, g) { return function (an) { return f(an) && g(an); }; }
  function numCheck(kind, a, b, n) {
    var inside = kind === 'prod' ? a * b : a / b, V = Math.pow(inside, n), A = Math.pow(a, n), B = Math.pow(b, n);
    var tex = kind === 'prod' ? pw(par(a + '\\times ' + b), n) : pw(par(dfr(a, b)), n), law = kind === 'prod' ? pw(signed(a), n) + '\\times ' + pw(b, n) : dfr(pw(a, n), pw(b, n));
    var fl = [fld('Inside', 'inside first: ' + t(pw(signed(inside), n) + '=')), fld('Law', 'by the law: ' + t(law + '='))];
    return P.fields(t(tex), fl, [numCk(V, [[inside * n, 'times-exp', t(pw(signed(inside), n)) + ' means ' + t(signed(inside)) + ' multiplied by itself ' + n + ' times.'], [-V, 'sign', n % 2 ? 'An odd power of a negative is negative.' : 'An even power of a negative is positive.']]), numCk(V, [[kind === 'prod' ? A + B : A - B, 'u2l3-sum', kind === 'prod' ? 'Multiply the two powers.' : 'Divide the two powers.'], [-V, 'sign', 'Check the sign.']])],
      [String(V), String(V)], t(tex + '=' + F(V)),
      'Inside first: ' + t(tex + '=' + pw(signed(inside), n) + '=' + F(V)) + '. By the ' + (kind === 'prod' ? 'Power of a Product' : 'Power of a Quotient') + ' Law: ' + t(law + '=' + (kind === 'prod' ? signed(A) + '\\times ' + B : fr(F(A), F(B))) + '=' + F(V)) + '. They agree.', ['Simplify inside the brackets first, then raise to the power. Then check with the law.'], plain(tex));
  }
  /* simplify one expression (with its outside minus sign / bracket), then evaluate at v = x */
  function simpEval(f, x, v) {
    var R = fMono(f), res = mTex(R), tex = fTex(f), C = R.c[0], E = R.e[v], V = C * Math.pow(x, E), fl = [fld('Simplified', 'simplified:', true, [v]), fld('Value', 'value at ' + t(v + '=' + x) + ':')];
    var rows = []; if (f.n > 1) { rows.push([cIs(-C), f.neg ? 'fence' : 'sign', f.neg ? 'The minus sign is outside the brackets, so it is never raised to the power: it stays.' : 'The ' + t('-' + Math.abs(f.c)) + ' is inside the brackets: an even power makes it positive.']); rows.push([cIs(f.neg ? -f.c : f.c), 'coef-not-raised', 'Raise the number inside the brackets to the power too.']); }
    else rows.push([cIs(Math.pow(Math.abs(f.c), f.ps[0][1]) * (f.c < 0 ? -1 : 1)), 'fence', 'No brackets: only ' + t(v) + ' carries the exponent; the ' + t(f.c) + ' is not raised.'], [cIs(Math.pow(-f.c, f.ps[0][1])), 'fence', 'No brackets: only ' + t(v) + ' carries the exponent, and the minus sign stays in front.']);
    return P.fields(t(tex), fl, [expoCk(res, rows), numCk(V, [[-V, 'sign', 'Check the sign: is the minus sign inside or outside the brackets?']])], [res, String(V)], t(res) + '; ' + t(F(V)),
      (f.n > 1 ? (f.neg ? 'The minus sign is outside the brackets: ' + t(tex + '=-(' + pw(Math.abs(f.c), f.n) + pw(v, f.n) + ')=' + res) : 'The ' + t(signed(f.c)) + ' is inside the brackets: ' + t(tex + '=' + pw(signed(f.c), f.n) + pw(v, f.n) + '=' + res)) : 'No brackets: only ' + t(v) + ' is raised to the power, so ' + t(tex) + ' is already simplified') + '. At ' + t(v + '=' + x) + ': ' + t(cT(C, pw('(' + x + ')', E)) + '=' + F(V)) + '.',
      ['Is the minus sign inside the brackets or outside? Only what is inside is raised to the power.'], plain(tex) + ' at ' + v + '=' + x);
  }
  /* [(c·letters / d)^n]^m */
  function nested(c, ps, d, n, m) {
    var f = Fc(c, ps, n, d ? [d, []] : null), I = fMono(f), R = mPow(I, m), res = mTex(R), inTex = fTex(f), tex = '\\left[' + inTex + '\\right]^{' + m + '}';
    var rows = [], addE = {}; Object.keys(I.e).forEach(function (v) { var e0 = ps.filter(function (p) { return p[0] === v; })[0][1]; rows.push([eIs(v, e0 * n + m), 'add-exp', 'Multiply by the outer exponent too: ' + t(e0 + '\\times ' + n + '\\times ' + m) + '.']); rows.push([eIs(v, e0 + n + m), 'add-exp', 'Each Power of a Power step <b>multiplies</b> the exponents.']); });
    if (Math.abs(c) !== 1) rows.push([cIs(Math.pow(c, n)), 'coef-not-raised', 'The coefficient ' + t(mTex({ c: I.c, e: {} })) + ' (from the inside) is raised to the outer power ' + t(m) + ' too.']);
    if (d) rows.push([cFr(1, Math.pow(d, n)), 'coef-not-raised', 'The ' + t(fr(1, Math.pow(d, n))) + ' from the inside is raised to the outer power ' + t(m) + ' too.']);
    return expoPart(t(tex), res, rows, 'Inside first: ' + t(inTex + '=' + mTex(I)) + '. Then the outer exponent: ' + t(pw(par(mTex(I)), m) + '=' + res) + '.', ['Simplify the round brackets first, then raise every factor of that result to the outer exponent.'], plain(tex));
  }
})(window);
