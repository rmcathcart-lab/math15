/* Math 15 · Unit 2 Test (AN3) — Exponents, built the way the Math 10C Unit 2 Test was built (BEG / PRG / MAS boxes,
 * mostly typed answers checked for value and form, keys built from the generated numbers, `bad` answers with u2t- codes,
 * worked solutions and hints) but pitched at Math 15 and NOT based on the Math 15 multiple-choice paper tests.
 * One outcome (AN3, Ryan's tags for every Unit 2 slip question). 75 minutes, no calculator; 16 questions / 36 parts
 * (Beginning 7 questions / 16 parts, Progressing 5 / 13, Mastery 4 / 7).
 *
 * How each box is pitched (numbers come from Ryan's Math 15 Lessons 1–10, assignments and extra practice — those numbers
 * are possible values):
 *   Beginning  — each lesson's core skill as first taught, one law at a time: (−7)² vs −7² and base/exponent vocabulary
 *                (L1), 3x⁴·5x², 15x⁷÷3x², (x³)⁵ (L1–L2), (2y)³ / (−3m)² and (m/4)² (L3), 9g⁰ vs (9g)⁰ and −7⁰ vs (−7)⁰
 *                (L5), 6⁻² and 4x⁻³ or 6/y⁻² (L6), standard ↔ scientific notation (L8), 49^{1/2} … 32^{1/5} and
 *                x^{1/5} → ⁵√x (L9).
 *   Progressing — the typical assignment question: two laws with coefficients ((3a³)²·2a², (4x³)²/(2x⁴), two bases or
 *                a bracket with a division inside, L4); negative exponents in a quotient / bracket / two bases, answer
 *                with positive exponents (L6–L7); (2/3)⁻², 2⁻³ + 2⁰ or 5⁻²·5⁴/5⁰ (L6–L7); scientific notation with
 *                simple numbers as the L10 review does it — a product like (2×10⁵)(4.5×10⁶) (L10 Example 8a) and the
 *                “how many fit” division (L10 Example 8b / #20); L8 itself teaches only converting and ordering;
 *                8^{2/3}, x^{3/4} → ⁴√x³, ⁴√x³ → x^{3/4} (L9).
 *   Mastery    — Math 15's hardest assignment/extra-practice items, clearly easier than the 10C Mastery box: a
 *                three-step simplification mixing all the laws with zero and negative exponents (L7 #9, #12–14), a
 *                missing exponent (L1 #11, L2 #10–11, EP7 #14), find-the-error in a worked solution and correct it
 *                (EP7 #12–13, L6 #11), a rational exponent of a fraction or a negative base ((9/4)^{−1/2}, L9 #12;
 *                (−125)^{−2/3}, L10 #22).
 * Coverage (paper numbers; defineTest keeps this order): L1 Q1, Q2 · L2 Q2, Q14 · L3 Q3, Q8 · L4 Q8 · L5 Q4, Q10b, Q13a ·
 *           L6 Q5, Q9a, Q10, Q15 · L7 Q9, Q13, Q15 · L8 Q6 · L9 Q7, Q12, Q16 · L10 (review) Q11.
 * Conversions to online: “state the base and exponent” → two boxes; “identify the incorrect step and explain” → select
 * the statement that describes the error (the decoys describe steps that are fine, with why), then type the correct
 * answer; “find x” → a box after n =; “how many fit” → a whole number (scientific notation also accepted). No multiple
 * choice anywhere (the error question is a select of reasoned statements, as in the 10C test).
 * Helpers (rationals, monomials, the exponent/radical checkers, evaluating b^{m/n}, converting powers ↔ radicals) are
 * copied from the Math 10C u2test.js. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'u2t-opposite': 'Treated a negative exponent as a negative sign', 'u2t-times-exp': 'Multiplied the base by the exponent',
    'u2t-square-root': 'Used a square root instead of the index in the exponent', 'u2t-no-root': 'Forgot the root (used only the numerator of the exponent)',
    'u2t-root-power': 'Raised to the power instead of taking the root', 'u2t-zero-base': 'Took a⁰ to be a',
    'u2t-zero-all': 'Applied a zero exponent to a coefficient that has none (k·g⁰ = 1)', 'u2t-zero-coef': 'Bracket to the power 0 taken as the number in front',
    'u2t-base-sign': 'Base wrong: the minus sign and brackets', 'u2t-base-exp-swap': 'Base and exponent swapped',
    'u2t-sci-sign': 'Power of 10 with the wrong sign', 'u2t-sci-place': 'Power of 10 off by one place', 'u2t-sci-dir': 'Moved the decimal point the wrong way',
    'u2t-sci-mult': 'Multiplied the powers of 10 instead of adding their exponents', 'u2t-sci-coef-add': 'Added the numbers in front instead of multiplying',
    'u2t-sci-adjust': 'Power of 10 not adjusted after fixing the number in front', 'u2t-multiplied': 'Multiplied instead of dividing',
    'u2t-n-sign': 'Missing exponent: sign slip (added instead of subtracting, or the reverse)', 'u2t-n-nodiv': 'Missing exponent: forgot to divide by the outside power',
    'u2t-err-decoy': 'Picked a correct step as the error', 'u2t-repeat': 'Repeated the error in the worked example', 'u2t-y-left': 'Kept a factor that is to the power 0'
  });
  HW.addPartial({
    'u2t-opposite': 'n', 'u2t-times-exp': 'n', 'u2t-square-root': 'b', 'u2t-no-root': 'b', 'u2t-root-power': 'n', 'u2t-zero-base': 'n',
    'u2t-zero-all': 'b', 'u2t-zero-coef': 'b', 'u2t-base-sign': 'n', 'u2t-base-exp-swap': 'n',
    'u2t-sci-sign': 'b', 'u2t-sci-place': 's', 'u2t-sci-dir': 'b', 'u2t-sci-mult': 'b', 'u2t-sci-coef-add': 'b',
    'u2t-sci-adjust': 's', 'u2t-multiplied': 'n', 'u2t-n-sign': 'b', 'u2t-n-nodiv': 'b', 'u2t-err-decoy': 'n', 'u2t-repeat': 'n', 'u2t-y-left': 's'
  });
  /* labels for shared codes this file uses (their partial-credit decisions are already in js/partial.js); kept if a lesson file set them */
  (function (o) { Object.keys(o).forEach(function (k) { if (!HW.CODES[k]) { var x = {}; x[k] = o[k]; HW.addCodes(x); } }); })({
    'mult-exp': 'Multiplied exponents (should add)', 'add-exp': 'Added exponents (should multiply)', 'law-added': 'Added exponents where the law multiplies or subtracts',
    'div-exp': 'Divided exponents (should subtract)', 'coef-not-raised': 'Didn’t raise the coefficient', 'coef-times': 'Multiplied coefficient by the exponent',
    'coef-added': 'Added coefficients instead of multiplying', 'sub-coef': 'Subtracted the coefficients instead of dividing', 'neg-base': 'Sign of a negative base / outside minus',
    'even-neg': 'Kept a negative sign under an even power', 'odd-neg': 'Dropped the negative sign under an odd power', 'sign-exp': 'Sign slip when combining exponents',
    'coef-pos-power': 'Raised the coefficient to the positive power instead of the negative one', 'no-flip': 'Raised the fraction to the power without flipping it',
    'no-recip': 'Forgot the reciprocal (negative exponent)', 'flip-back': 'Didn’t move the negative power up from the denominator',
    'coef-side': 'Number on the wrong side of the fraction bar (moved one with no negative exponent, or left one that has one)', 'zero-power': 'Took a zero exponent to give 0',
    'neg-zero': 'Read −w⁰ as (−w)⁰', 'index-power': 'Swapped the index and the power', 'root-only': 'Took the root but not the power',
    'recip': 'Reciprocal taken wrongly (negative exponent)', 'coef-recip': 'Coefficient upside down (negative exponent)', 'no-power': 'Flipped the fraction but didn’t raise it to the power',
    'top-only': 'Applied the outside exponent to only part of the bracket', 'hidden-one': 'Forgot a hidden exponent of 1', 'missed-factor': 'Didn’t apply the power to every factor'
  });

  /* ---------- rationals [p, q] ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function Q(p, q) { if (Array.isArray(p)) { q = p[1]; p = p[0]; } q = q == null ? 1 : q; if (q < 0) { p = -p; q = -q; } var g = gcd(p, q) || 1; return [p / g, q / g]; }
  function qadd(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
  function qsub(a, b) { b = Q(b); return qadd(a, [-b[0], b[1]]); }
  function qmul(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[0], a[1] * b[1]); }
  function qdiv(a, b) { a = Q(a); b = Q(b); return Q(a[0] * b[1], a[1] * b[0]); }
  function qeq(a, b) { a = Q(a); b = Q(b); return a[0] === b[0] && a[1] === b[1]; }
  function qv(a) { a = Q(a); return a[0] / a[1]; }
  function iroot(x, n) {
    if (x < 0) { if (n % 2 === 0) return null; var r0 = iroot(-x, n); return r0 == null ? null : -r0; }
    var r = Math.round(Math.pow(x, 1 / n)); for (var d = -1; d <= 1; d++) if (r + d >= 0 && Math.pow(r + d, n) === x) return r + d; return null;
  }
  function qpow(c, e) { // exact c^e
    c = Q(c); e = Q(e); var a = iroot(c[0], e[1]), b = iroot(c[1], e[1]);
    if (a == null || b == null) throw new Error('u2test: no exact root ' + c + '^' + e);
    var m = Math.abs(e[0]), res = Q(Math.pow(a, m), Math.pow(b, m)); return e[0] < 0 ? Q(res[1], res[0]) : res;
  }
  function near(a, b) { return isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b)); }
  function find(gen, test, fallback) { for (var i = 0; i < 800; i++) { var v = gen(); if (v != null && test(v)) return v; } if (fallback === undefined) throw new Error('u2test: no values found'); return fallback; }
  function cop(a, b) { return gcd(a, b) === 1; }

  /* ---------- TeX ---------- */
  function nT(fr) { fr = Q(fr); return fr[1] === 1 ? F(fr[0]) : (fr[0] < 0 ? '-' : '') + '\\frac{' + F(Math.abs(fr[0])) + '}{' + F(fr[1]) + '}'; }  // a value
  function eT(e) { e = Q(e); return e[1] === 1 ? String(e[0]) : (e[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(e[0]) + '}{' + e[1] + '}'; }      // an exponent
  function pT(e) { e = Q(e); return e[0] < 0 ? '\\left(' + eT(e) + '\\right)' : eT(e); }                                                   // exponent in a working sum
  function pw(v, e) { e = Q(e); if (e[0] === 0) return ''; if (e[0] === 1 && e[1] === 1) return v; return v + '^{' + eT(e) + '}'; }
  function pwx(v, e) { return v + '^{' + eT(e) + '}'; } // always shows the exponent
  function rootT(n, inner) { return n === 2 ? '\\sqrt{' + inner + '}' : '\\sqrt[' + n + ']{' + inner + '}'; }
  function br(s) { return '\\left(' + s + '\\right)'; }
  function rootName(n) { return K.rootName(n); }
  var LET = 'abcdhkmnpqrstuvwxyz'.split('');
  var PAIRS = [['a', 'b'], ['x', 'y'], ['c', 'd'], ['m', 'n'], ['p', 'q'], ['r', 's'], ['u', 'v'], ['h', 'k']];

  /* ---------- monomials: { c: [p,q], v: [[letter, [p,q]], …] } (display order kept) ---------- */
  function M(c, pairs) { return { c: Q(c), v: (pairs || []).map(function (p) { return [p[0], Q(p[1])]; }) }; }
  function mmul(A, B) {
    var v = A.v.map(function (p) { return [p[0], p[1]]; });
    B.v.forEach(function (p) { var f = null; v.forEach(function (q) { if (q[0] === p[0]) f = q; }); if (f) f[1] = qadd(f[1], p[1]); else v.push([p[0], p[1]]); });
    return { c: qmul(A.c, B.c), v: v };
  }
  function minv(A) { return { c: qdiv(1, A.c), v: A.v.map(function (p) { return [p[0], qmul(p[1], -1)]; }) }; }
  function mdiv(A, B) { return mmul(A, minv(B)); }
  function mpow(A, r) { return { c: qpow(A.c, r), v: A.v.map(function (p) { return [p[0], qmul(p[1], r)]; }) }; }
  function cK(c, hasVars) { c = Q(c); if (c[1] === 1) return hasVars && c[0] === 1 ? '' : hasVars && c[0] === -1 ? '-' : F(c[0]); return (c[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(c[0]) + '}{' + c[1] + '}'; }
  /* as written in a working line (any exponents) */
  function rawTex(A) { var vs = A.v.filter(function (p) { return p[1][0] !== 0; }).map(function (p) { return pw(p[0], p[1]); }).join(''); return cK(A.c, !!vs) + vs; }
  /* final answer: positive exponents, one fraction bar */
  function posTex(A) {
    var c = Q(A.c), neg = c[0] < 0, cn = Math.abs(c[0]), cd = c[1];
    var nv = A.v.filter(function (p) { return p[1][0] > 0; }).map(function (p) { return pw(p[0], p[1]); }).join('');
    var dv = A.v.filter(function (p) { return p[1][0] < 0; }).map(function (p) { return pw(p[0], qmul(p[1], -1)); }).join('');
    var num = (cn !== 1 || !nv ? F(cn) : '') + nv, den = (cd !== 1 ? String(cd) : '') + dv;
    return (neg ? '-' : '') + (den ? '\\frac{' + num + '}{' + den + '}' : num);
  }
  function radSide(list) {
    var ints = '', g = {}, order = [];
    list.forEach(function (f) { var e = Q(f[1]); if (e[1] === 1) ints += pw(f[0], e); else { if (g[e[1]] == null) { g[e[1]] = ''; order.push(e[1]); } g[e[1]] += pw(f[0], [e[0], 1]); } });
    return ints + order.map(function (q) { return rootT(q, g[q]); }).join('');
  }
  /* radical form of a monomial (fractional exponents → roots, negative exponents → denominator) */
  function radTex(A) {
    var c = Q(A.c), num = A.v.filter(function (p) { return p[1][0] > 0; }), den = A.v.filter(function (p) { return p[1][0] < 0; }).map(function (p) { return [p[0], qmul(p[1], -1)]; });
    var s = c[0] < 0 ? '-' : '', cp = Math.abs(c[0]), N = radSide(num), D = radSide(den);
    N = (cp === 1 && N ? '' : F(cp)) + N; D = (c[1] === 1 ? '' : String(c[1])) + D;
    return s + (D ? '\\frac{' + N + '}{' + D + '}' : N);
  }
  function hasFracExp(A) { return A.v.some(function (p) { return p[1][1] !== 1 && p[1][0] !== 0; }); }
  function lettersOf(A) { return A.v.map(function (p) { return p[0]; }); }

  /* ---------- reading typed answers ---------- */
  function strip(x) { while (x && x.t === 'paren') x = x.a; return x; }
  function kids(x) { return ['a', 'b', 'n'].filter(function (k) { return x[k] && typeof x[k] === 'object'; }).map(function (k) { return x[k]; }); }
  function walk(x, fn) { if (!x || typeof x !== 'object') return; fn(x); kids(x).forEach(function (c) { walk(c, fn); }); }
  function varsOf(ast) { var acc = {}; walk(ast, function (x) { if (x.t === 'var') acc[x.n] = 1; }); return Object.keys(acc); }
  function union(a, b) { return a.concat(b.filter(function (v) { return a.indexOf(v) < 0; })); }
  function same(a, b, vs) { return vs.length ? ex.equiv(a, b, vs, 6) : ex.eq(ex.value(a), ex.value(b)); }
  function hasDiv(x) { var f = false; walk(x, function (y) { if (y.t === 'div' || (y.t === 'num' && y.dec)) f = true; }); return f; }
  function hasNum(x) { x = strip(x); if (!x) return false; if (x.t === 'num') return true; if (x.t === 'mul' || x.t === 'neg') return kids(x).some(hasNum); return false; }
  function shapeOf(ast) {
    var f = { roots: 0, ratExp: false, negExp: false, powOfRoot: false, unexpanded: false, idx: [] };
    (function w(x, inRoot) {
      if (!x || typeof x !== 'object') return;
      if (x.t === 'root') { f.roots++; var ir = ex.rat(x.n); f.idx.push(ir && ir[1] === 1 ? ir[0] : null); }
      if (x.t === 'pow') {
        if (hasDiv(x.b)) f.ratExp = true;
        var e = strip(x.b), er = ex.rat(x.b);
        if (e.t === 'neg' || (er && er[0] < 0)) f.negExp = true;
        if (strip(x.a).t === 'root') f.powOfRoot = true;
        var bs = strip(x.a); if (inRoot && (bs.t === 'num' || (bs.t === 'mul' && hasNum(bs)))) f.unexpanded = true;
      }
      kids(x).forEach(function (c) { w(c, inRoot || x.t === 'root'); });
    })(ast, false);
    return f;
  }
  function sampleEnv(vars, i) { var env = {}; vars.forEach(function (v, j) { env[v] = 0.37 + 1.13 * ((i * 7 + j * 3) % 11) / 5 + j * 0.21; }); return env; }
  function equivAt(a, b, vars) { for (var i = 0; i < 5; i++) { var env = sampleEnv(vars, i); if (!near(ex.value(a, env), ex.value(b, env))) return false; } return true; }

  /* an exponent written as a single integer or a fraction in lowest terms (from Lesson 5) */
  function expIssue(e) {
    e = strip(e); if (e.t === 'neg') e = strip(e.a);
    if (e.t === 'num') return e.dec ? form('exp-form', 'Right value — write the exponent as a fraction (for example ' + t('x^{\\frac{3}{2}}') + ' rather than ' + t('x^{1.5}') + ').') : null;
    if (e.t === 'div') {
      var n = strip(e.a), d = strip(e.b); if (n.t === 'neg') n = strip(n.a); if (d.t === 'neg') d = strip(d.a);
      if (n.t === 'num' && d.t === 'num' && !n.dec && !d.dec) {
        if (d.v === 1 || gcd(n.v, d.v) > 1) return form('exp-form', 'Right value — now reduce the exponent ' + t('\\frac{' + n.v + '}{' + d.v + '}') + ' to lowest terms.');
        return null;
      }
    }
    return form('exp-form', 'Right value — now work each exponent out to a single number or fraction.');
  }
  var POS = 'Right value — now write it with <b>positive exponents</b> only (a power with a negative exponent moves to the other side of the fraction bar).';
  function fmtIssue(ast, opt) {
    opt = opt || {}; var res = null, rad = opt.form === 'radical';
    walk(ast, function (x) {
      if (res) return;
      if (x.t === 'pow') { res = expIssue(x.b); if (!res && rad) { var e = ex.rat(x.b); if (e && e[0] < 0) res = form('neg-exp', POS); } }
      else if (x.t === 'root' && rad) {
        var nested = false; walk(x.a, function (y) { if (y.t === 'root') nested = true; });
        if (nested) { res = form('not-simplest', 'Right value — now write it with a <b>single</b> radical: a root of a root is one root (multiply the indices).'); return; }
        var n = ex.rat(x.n), an = ex.analyze(x.a); if (!n || n[1] !== 1 || !an.coef || an.flags.complex || an.flags.nested) return;
        var vs = Object.keys(an.vars), g = n[0];
        if (!vs.length || vs.some(function (v) { return an.vars[v][1] !== 1; })) return;
        vs.forEach(function (v) { g = gcd(g, an.vars[v][0]); });
        if (g > 1 && Math.abs(an.coef[0]) === 1 && an.coef[1] === 1) res = form('not-simplest', 'Right value — but the index and the exponent share a factor of ' + t(g) + ', so the radical simplifies (for example ' + t('\\sqrt[6]{x^{4}}=\\sqrt[3]{x^{2}}') + ').');
      }
    });
    return res;
  }
  /* K.expo plus: exponents in lowest terms, radical form simplified */
  function EX(target, opt) {
    opt = opt || {}; var c = K.expo(target, opt);
    return function (resp) { var r = c(resp); if (r.v !== 'correct') return r; var p = ex.parse(resp); return (p.ok && fmtIssue(p.ast, opt)) || r; };
  }
  /* diagnoses by equivalence with known wrong answers: [[tex, code, hint]] (entries equal to the target are dropped) */
  function known(list, target) {
    var tp = target ? ex.parse(target).ast : null, tv = tp ? varsOf(tp) : [], L = [];
    list.forEach(function (k) {
      if (!k) return; var p = ex.parse(k[0]); if (!p.ok) throw new Error('u2test: bad known tex ' + k[0]);
      var vs = union(varsOf(p.ast), tv); if (tp && same(p.ast, tp, vs)) return;
      if (L.some(function (y) { return same(p.ast, y.ast, union(vs, y.vars)); })) return;
      L.push({ tex: k[0], ast: p.ast, vars: vs, code: k[1], hint: k[2] });
    });
    var f = function (an, ast) { var sv = varsOf(ast); for (var i = 0; i < L.length; i++) if (same(ast, L[i].ast, union(L[i].vars, sv))) return { code: L[i].code, hint: L[i].hint }; return null; };
    f.texs = L.map(function (x) { return x.tex; });
    return f;
  }
  /* one exponent-law answer box */
  function XP(prompt, target, opt, sol, hints, text, kn) {
    opt = opt || {}; if (kn) opt.diag = kn;
    var p = P.expo(prompt, target, opt, sol, hints, text); p.check = EX(target, opt);
    p.bad = kn ? kn.texs.slice() : [];
    return p;
  }
  /* known wrong answers given as monomials: [[A, code, hint]] → known() list */
  function kmono(list, target) { return known(list.filter(Boolean).map(function (k) { return [posTex(k[0]), k[1], k[2]]; }), target); }
  /* value answers (a fraction in lowest terms) with known wrong values [[v, code, hint]] */
  function numKnown(list, T) {
    var L = []; (list || []).forEach(function (c) { if (c && isFinite(c[0]) && !near(c[0], T) && !L.some(function (y) { return near(y[0], c[0]); })) L.push(c); });
    var f = function (v) { for (var i = 0; i < L.length; i++) if (near(v, L[i][0])) return { code: L[i][1], hint: L[i][2] }; return null; };
    f.list = L; return f;
  }
  function valTex(v) { var fr = toFrac(v); return fr ? nT(fr) : String(v); }
  function toFrac(v) { for (var q = 1; q <= 5000; q++) { var p = Math.round(v * q); if (Math.abs(p / q - v) < 1e-9 * Math.max(1, Math.abs(v))) return Q(p, q); } return null; }
  function VAL(prompt, fr, cands, sol, hints, text, inp) {
    fr = Q(fr); var T = qv(fr), kn = numKnown(cands, T);
    var p = P.math(prompt, K.fraction(fr, { diag: kn }), nT(fr).replace(/\\,/g, ''), sol, hints, text, Object.assign({ keys: 'fraction' }, inp || {}));
    p.answer = t(nT(fr)); p.bad = kn.list.map(function (c) { return valTex(c[0]).replace(/\\,/g, ''); });
    return p;
  }
  function T(s) { return HW.tex(s); }
  /* select every real error / reason: items [{ value, html, right, why }] */
  function selectPart(r, prompt, items, sol, hints, text, codes) {
    codes = codes || { decoy: 'u2t-err-decoy', one: 'u2t-err-missed', more: 'u2t-err-missed2' };
    var want = items.filter(function (o) { return o.right; }).map(function (o) { return o.value; }), by = {};
    items.forEach(function (o) { by[o.value] = o; });
    var shown = r.shuffle(items);
    var p = { prompt: prompt, input: { type: 'select', options: shown.map(function (o) { return { value: o.value, html: T(o.html) }; }) }, key: want,
      answer: items.filter(function (o) { return o.right; }).map(function (o) { return T(o.html); }).join('<br>'), solution: sol, hints: hints || [], text: text,
      check: K.selectSet(want, function (extra, missing) {
        if (extra.length) return { code: codes.decoy, hint: by[extra[0]].why };
        return { code: missing.length === 1 ? codes.one : codes.more, hint: 'You found ' + (want.length - missing.length) + ' of the ' + want.length + '. Look again at every step.' };
      }) };
    var dec = items.filter(function (o) { return !o.right; });
    p.bad = [want.slice(0, want.length - 1), want.concat([dec[0].value])];
    return p;
  }

  /* ---------- evaluating b^(m/n) exactly (from Lesson 4) ---------- */
  function ratRoot(fr, n) { var a = iroot(fr[0], n), b = iroot(fr[1], n); return a == null || b == null ? null : [a, b]; }
  function ratPow(fr, k) { var pp = Math.pow(fr[0], Math.abs(k)), qq = Math.pow(fr[1], Math.abs(k)); return k < 0 ? Q(qq, pp) : Q(pp, qq); }
  function rpow(b, m, n) { var g = gcd(m, n) || 1; m /= g; n /= g; if (n < 0) { m = -m; n = -n; } if (b < 0) { if (n % 2 === 0) return NaN; return Math.pow(-Math.pow(-b, 1 / n), m); } return Math.pow(b, m / n); }
  function sgn(x) { return x < 0 ? -1 : 1; }
  function expS(m, n) { var g = gcd(m, n) || 1; m /= g; n /= g; if (n < 0) { m = -m; n = -n; } return n === 1 ? String(m) : (m < 0 ? '-' : '') + '\\frac{' + Math.abs(m) + '}{' + n + '}'; }
  function baseTex(fr) { var s = nT(fr); return fr[0] < 0 || fr[1] !== 1 ? br(s) : s; }
  function dedupe(arr) { return arr.filter(function (x, i) { return i === 0 || x !== arr[i - 1]; }); }
  /* o: { base:[p,q], m, n, btex (base TeX in the prompt), sbtex (base TeX in the solution), pre (first solution line), text } */
  function EV(o) {
    var n = o.n, m = o.m, rt = ratRoot(o.base, n);
    if (!rt) throw new Error('u2test: no exact root ' + o.base + ' index ' + n);
    var val = ratPow(rt, m), bt = o.btex || baseTex(o.base), expr = bt + '^{' + expS(m, n) + '}';
    var cands = evalCands(o, rt, qv(val));
    var hints = ['The denominator ' + t(n) + ' is the index of the root and the numerator ' + t(Math.abs(m)) + ' is the power. Take the root first to keep the numbers small.'];
    if (m < 0) hints.push('A negative exponent means <b>reciprocal</b>: ' + t('a^{-k}=\\frac{1}{a^{k}}') + '. It doesn’t make the answer negative.');
    else if (o.base[0] < 0) hints.push('An odd root of a negative number is negative, e.g. ' + t('\\sqrt[3]{-8}=-2') + '.');
    var p = VAL(t(expr), val, cands, evalSol(o, rt, val), hints, o.text || 'evaluate ' + expr.replace(/\\left|\\right/g, ''));
    p.expr = expr;
    return p;
  }
  function evalSol(o, rt, val) {
    var n = o.n, k = Math.abs(o.m), B = o.sbtex || o.btex || baseTex(o.base), E = expS(o.m, n);
    var inner = nT(o.base), rad = rootT(n, inner), radk = k === 1 ? rad : br(rad) + '^{' + k + '}';
    var Rk = k === 1 ? nT(rt) : baseTex(rt) + '^{' + k + '}', PK = nT(ratPow(rt, k));
    var chain = [B + '^{' + E + '}'];
    if (o.m > 0) chain.push(radk, Rk, PK); else chain.push('\\frac{1}{' + radk + '}', '\\frac{1}{' + Rk + '}', '\\frac{1}{' + PK + '}', nT(val));
    var lines = [];
    if (o.pre) lines.push(o.pre);
    lines.push('The denominator ' + t(n) + ' is the index: take the ' + rootName(n) + ' root' + (k > 1 ? ', then raise it to the power ' + t(k) : '') + (o.m < 0 ? '. The negative exponent means reciprocal.' : '.')
      + (o.base[0] < 0 ? ' The index ' + t(n) + ' is odd, so the root of the negative base exists' + (k > 1 ? (k % 2 ? ' (and an odd power keeps it negative)' : ' (and the even power makes it positive)') : '') + '.' : ''));
    lines.push(t(dedupe(chain).join('=')));
    return lines.join('<br>');
  }
  function evalCands(o, rt, Tv) {
    var b = qv(o.base), m = o.m, n = o.n, k = Math.abs(m), out = [], B = o.sbtex || o.btex || baseTex(o.base), inner = nT(o.base);
    function add(v, code, hint) { out.push([v, code, hint]); }
    if (m < 0) add(-rpow(b, k, n), 'u2t-opposite', 'A negative exponent means <b>reciprocal</b>, not a negative answer: ' + t('a^{-k}=\\frac{1}{a^{k}}') + '.');
    if (m < 0) add(rpow(b, k, n), 'no-recip', 'You found ' + t(B + '^{' + expS(k, n) + '}') + '. The exponent is negative, so take the <b>reciprocal</b>' + (o.base[1] !== 1 ? ' (flip the fraction)' : '') + '.');
    if (b < 0) add(-Tv, 'sign', k % 2 === 0 ? 'The ' + rootName(n) + ' root of a negative number is negative, but the even power ' + t(k) + ' makes the result positive.' : 'The ' + rootName(n) + ' root of ' + t(inner) + ' is negative, and an odd power keeps it negative.');
    if (k > 1) add(rpow(b, sgn(m) * n, k), 'index-power', 'It looks like the root and the power are swapped. The <b>denominator</b> ' + t(n) + ' is the index of the root; the <b>numerator</b> ' + t(k) + ' is the power.');
    if (k > 1) add(rpow(b, sgn(m), n), 'root-only', 'You took the ' + rootName(n) + ' root. Now raise it to the power ' + t(k) + ' — that’s what the numerator says.');
    add(Math.pow(b, m), 'u2t-no-root', 'Don’t forget the root: the denominator ' + t(n) + ' means take the ' + rootName(n) + ' root.');
    if (n !== 2) add(rpow(b, m, 2), 'u2t-square-root', 'The denominator is ' + t(n) + ', so this is a <b>' + rootName(n) + '</b> root, not a square root.');
    add(b * m / n, 'u2t-times-exp', 'The exponent isn’t a multiplier: denominator = index of the root, numerator = power.');
    return out;
  }

  /* ---------- converting between powers and radicals (from Lesson 4) ---------- */
  function convCheck(target, opt) {
    opt = opt || {};
    var tp = ex.parse(target); if (!tp.ok) throw new Error('u2test: bad target ' + target);
    var tv = varsOf(tp.ast), cands = (opt.cands || []).map(function (c) { var q = ex.parse(c[0]); if (!q.ok) throw new Error('u2test: bad cand ' + c[0]); return { ast: q.ast, code: c[1], hint: c[2] }; });
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var sv = varsOf(a.ast), extra = sv.filter(function (v) { return tv.indexOf(v) < 0; });
      if (extra.length) return wrong('var', 'Your answer has a letter ' + t(extra[0]) + ' that isn’t in the question.');
      var f = shapeOf(a.ast);
      if (equivAt(a.ast, tp.ast, tv)) {
        if (opt.form === 'radical') {
          if (f.ratExp) return form('not-radical', 'Right value — now write it in <b>radical form</b> (use the root key; no fractional exponents).');
          if (!f.roots) return form('not-radical', 'Right value — but write it with a radical sign, as the question asks.');
          if (opt.index && f.idx.some(function (i) { return i !== opt.index; })) return form('index', 'Right value, but use a ' + rootName(opt.index) + ' root (index ' + t(opt.index) + '), as the exponent says.');
          if (f.negExp) return form('neg-exp', 'Right value — now write it without a negative exponent: a negative exponent puts the radical in the <b>denominator</b>.');
          return ok();
        }
        if (opt.form === 'power') {
          if (f.roots) return form('not-power', 'Right value — now write it as a <b>power</b> with a rational exponent (no radical sign).');
          if (opt.single && strip(a.ast).t !== 'pow') return form('single-power', 'Right value — now write it as a <b>single power</b> ' + t(opt.single) + ' (one base, one exponent).');
          var bad = null; walk(a.ast, function (x) { if (!bad && x.t === 'pow') bad = expIssue(x.b); }); if (bad) return bad;
          return ok();
        }
        return ok();
      }
      for (var i = 0; i < cands.length; i++) if (equivAt(a.ast, cands[i].ast, tv)) return wrong(cands[i].code, cands[i].hint);
      return wrong('value', null);
    };
  }
  function convPart(promptHtml, target, opt, sol, hints, text) {
    var vs = varsOf(ex.parse(target).ast).sort(), tp = ex.parse(target).ast;
    opt.cands = (opt.cands || []).filter(function (c, i, arr) { var q = ex.parse(c[0]).ast; return !equivAt(q, tp, vs) && !arr.slice(0, i).some(function (d) { return equivAt(ex.parse(d[0]).ast, q, vs); }); });
    var p = P.math(promptHtml, convCheck(target, opt), target, sol, hints, text, { keys: 'expo', vars: vs.length ? vs : ['x'] });
    p.bad = opt.cands.map(function (c) { return c[0]; });
    return p;
  }
  function radOf(v, m, n, c) { var k = Math.abs(m), r = rootT(n, k === 1 ? v : v + '^{' + k + '}'), cc = c && c !== 1 ? String(c) : ''; return m < 0 ? '\\frac{' + (cc || '1') + '}{' + r + '}' : cc + r; }
  function radCands(v, m, n, c) {
    var k = Math.abs(m), s = sgn(m), out = [];
    if (k > 1) out.push([radOf(v, s * n, k, c), 'index-power', 'The <b>denominator</b> ' + t(n) + ' is the index of the root and the <b>numerator</b> ' + t(k) + ' is the power — you have them the other way round.']);
    if (m < 0) out.push(['-' + radOf(v, k, n, c), 'u2t-opposite', 'A negative exponent doesn’t make the expression negative — it means <b>reciprocal</b>: the radical goes in the denominator.']);
    if (m < 0) out.push([radOf(v, k, n, c), 'no-recip', 'The exponent is negative, so the radical belongs in the <b>denominator</b>: ' + t('x^{-a}=\\frac{1}{x^{a}}') + '.']);
    if (k > 1) out.push([radOf(v, s, n, c), 'root-only', 'You have the root, but the numerator ' + t(k) + ' is a power that still has to appear.']);
    if (n !== 2) out.push([radOf(v, m, 2, c), 'u2t-square-root', 'The denominator is ' + t(n) + ', so use a <b>' + rootName(n) + '</b> root (index ' + t(n) + '), not a square root.']);
    return out;
  }
  var CONV_HINTS = ['The denominator of the exponent is the index of the root; the numerator is the power: ' + t('x^{\\frac{m}{n}}=\\sqrt[n]{x^{m}}=\\left(\\sqrt[n]{x}\\right)^{m}') + '.',
    'A negative exponent puts the power in the denominator: ' + t('x^{-\\frac{m}{n}}=\\frac{1}{\\sqrt[n]{x^{m}}}') + '.'];
  /* power box + radical box (from Lesson 5) */
  function twoForms(prompt, A, o) {
    var powT = posTex(A), rT = radTex(A), vars = lettersOf(A);
    var pd = o.pd || known([], powT), rd = o.rd || known([], rT);
    var fields = [{ name: 'Power', label: 'Power:', mode: 'math', keys: 'expo', vars: vars }, { name: 'Radical form', label: 'Radical form:', mode: 'math', keys: 'expo', vars: vars }];
    var p = P.fields(prompt, fields, [EX(powT, { form: 'power', diag: pd }), EX(rT, { form: 'radical', diag: rd })], [powT, rT],
      t(powT) + ' ' + '\\(=\\)' + ' ' + t(rT), o.sol, o.hints || HINT_TWO, o.text);
    p.bad = pd.texs.map(function (x) { return [x, rT]; }).concat(rd.texs.map(function (x) { return [powT, x]; }));
    return p;
  }
  var HINT_TWO = ['Use the exponent law first, working with the fractions exactly. Then convert: in ' + t('x^{\\frac{m}{n}}') + ' the denominator ' + t('n') + ' is the index and ' + t('m') + ' is the power.',
    'If the exponent comes out negative, write the power in the denominator: ' + t('x^{-\\frac{m}{n}}=\\frac{1}{x^{\\frac{m}{n}}}') + '.'];
  var LAWS = 'Product law: add the exponents. Quotient law: subtract. Power of a power: multiply.';

  /* a single power of base B (a number) with an integer exponent equal to B^e; cands [[e, code, hint]] */
  function powOfChk(B, e, cands) {
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      if (varsOf(a.ast).length) return wrong('var', 'Use numbers only.');
      var top = strip(a.ast), base = top && top.t === 'pow' ? ex.rat(strip(top.a)) : null, er = top && top.t === 'pow' ? ex.rat(top.b) : null;
      var val = Math.pow(B, e);
      if (base && er && base[1] === 1 && base[0] === B && er[1] === 1) {
        if (er[0] === e) return ok();
        for (var i = 0; i < cands.length; i++) if (cands[i][0] === er[0]) return wrong(cands[i][1], cands[i][2]);
        return wrong('exp', 'Check the exponent on ' + t(B) + '.');
      }
      if (near(a.val, val)) return form('single-power', 'Right value — now write it as a single power of ' + t(B) + ', like ' + t(B + '^{n}') + '.');
      for (var j = 0; j < cands.length; j++) if (near(a.val, Math.pow(B, cands[j][0]))) return wrong(cands[j][1], cands[j][2]);
      return wrong('value', null);
    };
  }

  /* ====================================================================================
   * Math 15 helpers
   * ==================================================================================== */
  /* integer value answers with known wrong values */
  function INT(prompt, T0, cands, sol, hints, text, inp) {
    var kn = numKnown(cands, T0);
    var p = P.math(prompt, K.value(T0, { only: 'integer', diag: kn }), String(T0), sol, hints, text, Object.assign({ keys: 'fraction' }, inp || {}));
    p.answer = t(F(T0)); p.bad = kn.list.map(function (c) { return String(c[0]); });
    return p;
  }
  /* a monomial for a prompt: coefficient (1 and −1 hidden) and [letter, exponent] pairs (exponent 1 hidden) */
  function term(c, list) { return (c === 1 ? '' : c === -1 ? '-' : String(c)) + list.map(function (p) { return pw(p[0], p[1]); }).join(''); }
  /* like term, but negative and zero exponents are always shown */
  function termx(c, list) { return (c === 1 ? '' : c === -1 ? '-' : String(c)) + list.map(function (p) { return p[1] === 1 ? p[0] : pwx(p[0], p[1]); }).join(''); }
  function rnd(r, lo, hi, not) { return find(function () { return r.int(lo, hi); }, function (v) { return v !== 0 && (not == null || v !== not); }); }

  /* ---------- standard and scientific notation, built from an integer mantissa M (no trailing zeros) and M × 10^e ---------- */
  function zeros(k) { return new Array(k + 1).join('0'); }
  function decStr(M, e) { var s = String(M); if (e >= 0) return s + zeros(e); var k = s.length + e; return k > 0 ? s.slice(0, k) + '.' + s.slice(k) : '0.' + zeros(-k) + s; }
  function sciExp(M, e) { return e + String(M).length - 1; }
  function sciCoef(M) { var s = String(M); return s[0] + (s.length > 1 ? '.' + s.slice(1) : ''); }
  function sciT(M, e) { return sciCoef(M) + '\\times 10^{' + sciExp(M, e) + '}'; }
  function stdT(M, e) { return F(Number(decStr(M, e))); }
  function mant(r) { var len = r.pick([1, 2, 2, 3]); return find(function () { return len === 1 ? r.int(2, 9) : len === 2 ? r.int(11, 99) : r.int(101, 999); }, function (M) { return M % 10 !== 0; }); }
  function pow10Of(v, x) { var q = v / x; if (!(q > 0) || !isFinite(q)) return null; var lg = Math.round(Math.log10(q)); return Math.abs(q / Math.pow(10, lg) - 1) < 1e-9 ? lg : null; }
  /* K.sci plus a look at a power of 10 that is off: off(lg) -> [code, hint] (lg = how many powers of 10 too big) */
  function SCI(x, opt) {
    opt = opt || {}; var c = K.sci(x);
    return function (resp) {
      var res = c(resp); if (res.v !== 'wrong' || (res.code !== 'power-off' && res.code !== 'value')) return res;
      var a = K.read(resp); if (a.res) return res;
      if (opt.diag) { var h = opt.diag(a.val); if (h) return wrong(h.code, h.hint); }
      if (res.code === 'power-off' && opt.off) { var lg = pow10Of(Math.abs(a.val), Math.abs(x)), h2 = lg == null ? null : opt.off(lg); if (h2) return wrong(h2[0], h2[1]); }
      return res;
    };
  }
  function sciPart(prompt, x, opt, sol, hints, text, bad) {
    var p = P.math(prompt, SCI(x, opt), K.sciTex(x), sol, hints, text, { keys: 'sci' });
    p.bad = bad || []; return p;
  }
  /* a number written exactly: [coefficient as a string with a decimal point, power of 10] → JS number and TeX */
  function sciNum(cs, n) { return Number(cs + 'e' + n); }
  function sciTx(cs, n) { return cs + '\\times 10^{' + n + '}'; }
  function decimalOf(v) { return String(Number(v.toPrecision(12))); }

  /* '=answer' unless the working line already is the answer */
  function fin(A) { return rawTex(A) === posTex(A) ? '' : '=' + posTex(A); }
  function step3(A) { return rawTex(A) === posTex(A) ? '3. Every exponent is already positive: ' + t(posTex(A)) + '.' : '3. Positive exponents: ' + t(rawTex(A) + '=' + posTex(A)) + '.'; }
  var LAWS15 = 'Product law: add the exponents. Quotient law: subtract. Power of a power: multiply. A bracket to a power: every factor inside gets the power.';
  var NEGHINT = 'A negative exponent means <b>reciprocal</b>: ' + t('a^{-n}=\\frac{1}{a^{n}}') + '. Move the power to the other side of the fraction bar and make the exponent positive.';

  /* ====================================================================================
   * Beginning
   * ==================================================================================== */
  /* Q1: (−b)^n and −b^n (n even), then base and exponent */
  var Q1PAIRS = [[2, 2], [2, 4], [2, 6], [2, 8], [3, 2], [3, 4], [4, 2], [4, 4], [5, 2], [5, 4], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [10, 4], [11, 2], [12, 2], [20, 2], [30, 2], [10, 6]];
  function q1Pair(s, which) {
    var b = s.b, n = s.n, V = Math.pow(b, n);
    if (which === 'minus') {
      var pr = '-' + b + '^{' + n + '}';
      return INT(t(pr), -V, [[V, 'neg-base', 'Without brackets the exponent belongs to ' + t(b) + ' only: ' + t(pr + '=-\\left(' + b + '^{' + n + '}\\right)') + '. The minus sign is not part of the base.'], [-b * n, 'u2t-times-exp', t(b + '^{' + n + '}') + ' means ' + n + ' factors of ' + t(b) + ', not ' + t(b + '\\times ' + n) + '.'], [b * n, 'u2t-times-exp', t(b + '^{' + n + '}') + ' means ' + n + ' factors of ' + t(b) + '.']],
        'No brackets, so the base is ' + t(b) + ' and the minus sign is applied after: ' + t(pr + '=-\\left(' + b + '^{' + n + '}\\right)=-' + F(V)) + '.', ['Is the minus sign inside the base? Without brackets, it isn’t.'], 'evaluate ' + pr);
    }
    var pb = '(-' + b + ')^{' + n + '}';
    return INT(t(pb), V, [[-V, 'even-neg', 'The brackets make ' + t('-' + b) + ' the base: ' + n + ' negative factors multiply to a <b>positive</b>.'], [-b * n, 'u2t-times-exp', 'The exponent says how many factors of ' + t('-' + b) + ' to multiply.'], [b * n, 'u2t-times-exp', 'The exponent says how many factors of ' + t('-' + b) + ' to multiply, not ' + t(b + '\\times ' + n) + '.']],
      'The brackets make ' + t('-' + b) + ' the base. ' + t(n) + ' is even, so the product is positive: ' + t(pb + '=' + F(V)) + '.', ['With brackets, the base is ' + t('-' + b) + '. An even number of negative factors is positive.'], 'evaluate ' + pb);
  }
  function q1Vocab(r) {
    var kind = r.pick(['brk', 'minus', 'letexp', 'neglet']), b = r.int(2, 9), e = rnd(r, 2, 9, b), L = r.pick(['p', 'q', 'w', 'y', 'k', 'm']), N = r.pick(['n', 'x', 'k', 'a']);
    if (kind === 'letexp' && N === L) N = 'n';
    var pr, base, expo, why, vars = [];
    if (kind === 'brk') { pr = '(-' + b + ')^{' + e + '}'; base = '-' + b; expo = String(e); why = 'The brackets make ' + t('-' + b) + ' the base.'; }
    else if (kind === 'minus') { pr = '-' + b + '^{' + e + '}'; base = String(b); expo = String(e); why = 'There are no brackets, so the base is ' + t(b) + ' only; the minus sign is applied after the power: ' + t(pr + '=-\\left(' + b + '^{' + e + '}\\right)') + '.'; }
    else if (kind === 'letexp') { pr = b + '^{' + N + '}'; base = String(b); expo = N; vars = [N]; why = 'The exponent can be a letter: it is the small raised part.'; }
    else { pr = '(-' + L + ')^{' + e + '}'; base = '-' + L; expo = String(e); vars = [L]; why = 'The brackets make ' + t('-' + L) + ' the base.'; }
    function chk(target, other, isBase) {
      var tp = ex.parse(target).ast, op = ex.parse(other).ast, vs = union(varsOf(tp), varsOf(op));
      return function (resp) {
        var a = K.read(resp); if (a.res) return a.res;
        var v2 = union(vs, varsOf(a.ast));
        if (same(a.ast, tp, v2)) return ok();
        if (same(a.ast, op, v2)) return wrong('u2t-base-exp-swap', 'The <b>base</b> is the number or letter being multiplied; the <b>exponent</b> is the small raised number that counts the factors.');
        if (isBase && same(a.ast, ex.parse('-(' + target + ')').ast, v2)) return wrong('u2t-base-sign', kind === 'minus' ? 'Without brackets the minus sign is not part of the base.' : 'The brackets put the minus sign inside the base.');
        return wrong('value', null);
      };
    }
    var p = P.fields('State the base and the exponent of ' + t(pr) + '.', [{ name: 'Base', label: 'Base:', mode: 'math', keys: 'expo', vars: vars.length ? vars : ['x'] }, { name: 'Exponent', label: 'Exponent:', mode: 'math', keys: 'expo', vars: vars.length ? vars : ['x'] }],
      [chk(base, expo, true), chk(expo, base, false)], [base, expo], 'base ' + t(base) + ', exponent ' + t(expo),
      'In ' + t(pr) + ' the base is ' + t(base) + ' and the exponent is ' + t(expo) + '. ' + why, ['The base is what is being multiplied; the exponent counts how many factors.', 'Look for brackets: they decide whether a minus sign belongs to the base.'], 'base and exponent of ' + pr);
    p.bad = [[expo, base]]; if (kind === 'brk' || kind === 'neglet') p.bad.push([base.slice(1), expo]); if (kind === 'minus') p.bad.push(['-' + base, expo]);
    return p;
  }

  /* Q2: one law at a time (Lessons 1–2) */
  function q2Part(r, kind, x) {
    var tg, prompt, sol, kn, hints;
    if (kind === 'prodc') {
      var a = r.int(2, 8), b = r.pick([1, 2, 3, 4, 5, 6, 7]), m = r.int(1, 6), n = r.int(2, 6); if (m === n) n = n === 6 ? 5 : n + 1;
      tg = (a * b) + pw(x, m + n); prompt = term(a, [[x, m]]) + '\\times ' + term(b, [[x, n]]);
      kn = known([b > 1 ? [(a + b) + pw(x, m + n), 'coef-added', 'Multiply the numbers in front, don’t add them: ' + t(a + '\\times ' + b) + '.'] : null, [(a * b) + pw(x, m * n), 'mult-exp', 'Same base, multiplying: <b>add</b> the exponents (product law).'], m === 1 ? [(a * b) + pw(x, n), 'hidden-one', t(x) + ' on its own is ' + t(x + '^{1}') + ': count that exponent too.'] : null], tg);
      sol = 'Multiply the numbers, add the exponents (product law): ' + t(prompt + '=(' + a + '\\times ' + b + ')' + x + '^{' + m + '+' + n + '}=' + tg);
      hints = ['Multiply the numbers in front. Same base: keep it and <b>add</b> the exponents.'];
      return XP(t(prompt), tg, {}, sol, hints, 'product law ' + prompt, kn);
    }
    if (kind === 'quotc') {
      var k = r.int(2, 7), q = r.int(2, 6), mm = r.int(6, 12), nn = r.int(2, 5); if (mm - nn < 2) mm = nn + 2 + r.int(0, 3);
      var frac = r.chance(0.5);
      tg = q + pw(x, mm - nn); prompt = frac ? '\\dfrac{' + q * k + pw(x, mm) + '}{' + k + pw(x, nn) + '}' : q * k + pw(x, mm) + '\\div ' + k + pw(x, nn);
      kn = known([[(q * k - k) + pw(x, mm - nn), 'sub-coef', 'Divide the numbers, don’t subtract them: ' + t(q * k + '\\div ' + k) + '.'], mm % nn === 0 ? [q + pw(x, mm / nn), 'div-exp', 'Subtract the exponents, don’t divide them.'] : null, [q + pw(x, mm + nn), 'law-added', 'Dividing: <b>subtract</b> the exponents (quotient law).']], tg);
      sol = 'Divide the numbers, subtract the exponents (quotient law): ' + t(prompt + '=(' + q * k + '\\div ' + k + ')' + x + '^{' + mm + '-' + nn + '}=' + tg);
      hints = ['Divide the numbers in front. Same base: keep it and <b>subtract</b> the exponents.'];
      return XP(t(prompt), tg, {}, sol, hints, 'quotient law ' + prompt, kn);
    }
    var p = r.int(2, 6), qq = r.int(2, 5); if (p === qq) qq = qq === 5 ? 4 : qq + 1;
    tg = pw(x, p * qq); prompt = br(pw(x, p)) + '^{' + qq + '}';
    kn = known([[pw(x, p + qq), 'add-exp', 'A power of a power: <b>multiply</b> the exponents. ' + t(prompt) + ' means ' + qq + ' factors of ' + t(pw(x, p)) + '.']], tg);
    sol = 'Power of a power (multiply the exponents): ' + t(prompt + '=' + x + '^{' + p + '\\times ' + qq + '}=' + tg);
    return XP(t(prompt), tg, {}, sol, ['A power raised to a power: keep the base and <b>multiply</b> the exponents.'], 'power of a power ' + prompt, kn);
  }

  /* Q3: power of a product / of a quotient (Lesson 3) */
  function q3Prod(r) {
    var g = find(function () { var k = r.pick([2, 3, 4, 5, 10]), n = r.pick([2, 2, 3]); return { k: k, n: n, neg: r.chance(0.35), two: r.chance(0.35), L: r.pick(PAIRS) }; },
      function (g) { return Math.pow(g.k, g.n) <= (g.k === 10 ? 1000 : 125); });
    var k = g.neg ? -g.k : g.k, n = g.n, vs = g.two ? [g.L[0], g.L[1]] : [g.L[0]], V = Math.pow(k, n);
    var inner = k + vs.join(''), prompt = br(inner) + '^{' + n + '}', A = M(V, vs.map(function (v) { return [v, n]; })), tg = posTex(A);
    var kn = kmono([[M(k, A.v), 'coef-not-raised', 'The power of a product applies to <b>every</b> factor in the bracket: the ' + t(k) + ' is raised to the power ' + t(n) + ' too.'],
      [M(k * n, A.v), 'coef-times', t('(' + k + ')^{' + n + '}') + ' means ' + n + ' factors of ' + t(k) + ', not ' + t(k + '\\times ' + n) + '.'],
      g.neg && n % 2 === 0 ? [M(-V, A.v), 'even-neg', 'An even power of a negative is <b>positive</b>: ' + t('(' + k + ')^{' + n + '}=' + V) + '.'] : null,
      g.two ? [M(V, [[vs[0], n], [vs[1], 1]]), 'missed-factor', 'Every factor in the bracket gets the exponent, ' + t(vs[1]) + ' too.'] : null], tg);
    var sol = 'Power of a product: every factor in the bracket gets the exponent ' + t(n) + ':<br>' + t(prompt + '=' + (k < 0 ? br(k) : k) + '^{' + n + '}' + vs.map(function (v) { return pw(v, n); }).join('') + '=' + tg) + (g.neg && n % 2 === 0 ? ' (an even power of a negative is positive).' : g.neg ? ' (an odd power of a negative stays negative).' : '.');
    return XP(t(prompt), tg, {}, sol, ['Raise <b>each</b> factor inside the bracket to the power ' + t(n) + ', the number too.', 'Watch the sign: an even power of a negative number is positive.'], 'power of a product ' + prompt, kn);
  }
  function q3Quot(r) {
    var g = find(function () { var k = r.int(2, 9), n = r.pick([2, 2, 3, 4]); return { k: k, n: n, top: r.chance(0.5), v: r.pick(LET) }; }, function (g) { return Math.pow(g.k, g.n) <= (g.n === 2 ? 81 : 125) && !(g.n === 4 && g.k > 3); });
    var k = g.k, n = g.n, v = g.v, V = Math.pow(k, n), prompt, tg, kn;
    if (g.top) { prompt = '\\left(\\dfrac{' + v + '}{' + k + '}\\right)^{' + n + '}'; tg = '\\frac{' + pw(v, n) + '}{' + V + '}';
      kn = known([['\\frac{' + pw(v, n) + '}{' + k + '}', 'top-only', 'Raise the top <b>and</b> the bottom to the power: ' + t(k + '^{' + n + '}=' + V) + '.'], ['\\frac{' + pw(v, n) + '}{' + k * n + '}', 'coef-times', t(k + '^{' + n + '}') + ' is ' + t(V) + ', not ' + t(k + '\\times ' + n) + '.']], tg); }
    else { prompt = '\\left(\\dfrac{' + k + '}{' + v + '}\\right)^{' + n + '}'; tg = '\\frac{' + V + '}{' + pw(v, n) + '}';
      kn = known([['\\frac{' + k + '}{' + pw(v, n) + '}', 'top-only', 'Raise the top <b>and</b> the bottom to the power: ' + t(k + '^{' + n + '}=' + V) + '.'], ['\\frac{' + k * n + '}{' + pw(v, n) + '}', 'coef-times', t(k + '^{' + n + '}') + ' is ' + t(V) + ', not ' + t(k + '\\times ' + n) + '.']], tg); }
    var sol = 'Power of a quotient: the top and the bottom each get the exponent ' + t(n) + ':<br>' + t(prompt + '=' + (g.top ? '\\dfrac{' + pw(v, n) + '}{' + k + '^{' + n + '}}' : '\\dfrac{' + k + '^{' + n + '}}{' + pw(v, n) + '}') + '=' + tg) + '.';
    return XP(t(prompt), tg, {}, sol, ['Raise the numerator and the denominator to the power ' + t(n) + '.', 'Work out the number power: ' + t(k + '^{' + n + '}') + ' means ' + n + ' factors of ' + t(k) + '.'], 'power of a quotient ' + prompt, kn);
  }

  /* Q4: zero exponents (Lesson 5) */
  function q4Part(s, which) {
    var c = s.c, g = s.g;
    if (s.kind === 'coef') {
      if (which === 0) {
        var pr = c + pwx(g, 0);
        return INT(t(pr), c, [[1, 'u2t-zero-all', 'The exponent ' + t(0) + ' belongs to ' + t(g) + ' only: ' + t(pr + '=' + c + '\\times 1') + '.'], [0, 'zero-power', 'A power with exponent ' + t(0) + ' is ' + t(1) + ', not ' + t(0) + ': ' + t(g + '^{0}=1') + '.']],
          'Only ' + t(g) + ' has the exponent ' + t(0) + ', and ' + t(g + '^{0}=1') + ': ' + t(pr + '=' + c + '\\times 1=' + c) + '.', ['What does the exponent ' + t(0) + ' belong to? Without brackets, only ' + t(g) + '.'], 'simplify ' + pr);
      }
      var pb = '(' + c + g + ')^{0}';
      return INT(t(pb), 1, [[c, 'u2t-zero-coef', 'The brackets make the whole product ' + t(c + g) + ' the base, and any nonzero base to the power ' + t(0) + ' is ' + t(1) + '.'], [0, 'zero-power', 'A power with exponent ' + t(0) + ' is ' + t(1) + ', not ' + t(0) + '.']],
        'The brackets make ' + t(c + g) + ' the base, and any nonzero base to the power ' + t(0) + ' is ' + t(1) + ': ' + t(pb + '=1') + '.', ['What is the base here? The brackets decide.'], 'simplify ' + pb);
    }
    if (which === 1) {
      var pb2 = '(-' + c + ')^{0}';
      return INT(t(pb2), 1, [[-1, 'neg-zero', 'With brackets, the base is ' + t('-' + c) + ', and any nonzero base to the power ' + t(0) + ' is ' + t(1) + '.'], [0, 'zero-power', 'A power with exponent ' + t(0) + ' is ' + t(1) + ', not ' + t(0) + '.'], [-c, 'u2t-zero-base', 'The exponent ' + t(0) + ' doesn’t leave the base unchanged: ' + t('a^{0}=1') + '.']],
        'The brackets make ' + t('-' + c) + ' the base, and any nonzero base to the power ' + t(0) + ' is ' + t(1) + ': ' + t(pb2 + '=1') + '.', ['Any nonzero base to the power ' + t(0) + ' is ' + t(1) + '. What is the base here?'], 'evaluate ' + pb2);
    }
    var pm = '-' + c + '^{0}';
    return INT(t(pm), -1, [[1, 'neg-zero', 'Without brackets the exponent applies only to ' + t(c) + ': ' + t(pm + '=-\\left(' + c + '^{0}\\right)=-1') + '.'], [0, 'zero-power', 'A power with exponent ' + t(0) + ' is ' + t(1) + ', not ' + t(0) + '.'], [-c, 'u2t-zero-base', t(c + '^{0}=1') + ', not ' + t(c) + '.']],
      'The exponent belongs to ' + t(c) + ' only, and the minus sign stays: ' + t(pm + '=-\\left(' + c + '^{0}\\right)=-1') + '.', ['Is the minus sign part of the base? Without brackets, it isn’t.'], 'evaluate ' + pm);
  }

  /* Q5: negative exponents (Lesson 6) */
  var Q5BN = [[2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2], [10, 3], [10, 4], [6, 1], [7, 1], [9, 1], [11, 2], [12, 2]];
  function q5Eval(r) {
    var bn = r.pick(Q5BN), b = bn[0], n = bn[1], V = Math.pow(b, n), pr = b + '^{-' + n + '}';
    return VAL(t(pr), [1, V], [[-V, 'u2t-opposite', 'A negative exponent means <b>reciprocal</b>, not negative: ' + t(pr + '=\\frac{1}{' + b + '^{' + n + '}}') + '.'], [-1 / V, 'u2t-opposite', 'A negative exponent doesn’t make the value negative.'], [V, 'no-recip', 'A negative exponent means take the <b>reciprocal</b>: ' + t('\\frac{1}{' + b + '^{' + n + '}}') + '.'], [-b * n, 'u2t-times-exp', 'The exponent isn’t a multiplier: ' + t(pr) + ' is not ' + t(b + '\\times(-' + n + ')') + '.'], n > 1 ? [1 / (b * n), 'u2t-times-exp', t(b + '^{' + n + '}') + ' means ' + n + ' factors of ' + t(b) + ', not ' + t(b + '\\times ' + n) + '.'] : null].filter(Boolean),
      t(pr + '=\\dfrac{1}{' + b + '^{' + n + '}}=\\dfrac{1}{' + F(V) + '}'), [NEGHINT], 'evaluate ' + pr);
  }
  function q5Pos(r) {
    var y = r.pick(LET), k = r.int(2, 12), n = r.int(1, 8), kind = r.pick(['num', 'num', 'den']), pr, tg, kn, sol;
    if (kind === 'num') {
      pr = k + pwx(y, -n); tg = '\\frac{' + k + '}{' + pw(y, n) + '}';
      kn = known([['\\frac{1}{' + k + pw(y, n) + '}', 'coef-side', 'The ' + t(k) + ' has no negative exponent, so it stays in the numerator: only ' + t(y) + ' is the base.'], [k + pw(y, n), 'no-recip', 'The power moves to the <b>denominator</b> when its exponent becomes positive.'], ['-' + k + pw(y, n), 'u2t-opposite', 'A negative exponent means reciprocal, not negative.']], tg);
      sol = 'Only ' + t(y) + ' has the negative exponent, so only ' + t(pw(y, n)) + ' moves to the denominator: ' + t(pr + '=' + k + '\\times\\dfrac{1}{' + pw(y, n) + '}=' + tg);
    } else {
      pr = '\\dfrac{' + k + '}{' + pwx(y, -n) + '}'; tg = k + pw(y, n);
      kn = known([['\\frac{' + k + '}{' + pw(y, n) + '}', 'flip-back', 'A power with a negative exponent in the denominator moves <b>up</b> to the numerator: ' + t('\\frac{1}{' + pwx(y, -n) + '}=' + pw(y, n)) + '.'], ['\\frac{' + pw(y, n) + '}{' + k + '}', 'coef-side', 'Only ' + t(pwx(y, -n)) + ' changes sides; the ' + t(k) + ' has no negative exponent and stays on top.'], ['-' + k + pw(y, n), 'u2t-opposite', 'A negative exponent means reciprocal, not negative.']], tg);
      sol = 'The power with the negative exponent moves up to the numerator, and its exponent becomes positive: ' + t(pr + '=' + tg);
    }
    return XP(t(pr), tg, {}, sol, [NEGHINT, 'Only the part with the negative exponent moves; a number with no exponent stays where it is.'], 'positive exponents ' + pr, kn);
  }

  /* Q6: standard ↔ scientific notation (Lesson 8) */
  function q6ToSci(r, big) {
    var M0 = mant(r), len = String(M0).length, n = big ? r.int(3, 9) : -r.int(2, 7), e = n - (len - 1), x = Number(decStr(M0, e)), std = stdT(M0, e), sci = sciT(M0, e);
    var dir = big ? 'left' : 'right';
    var p = sciPart('Write ' + t(std) + ' in scientific notation.', x, {
      off: function (lg) { if (lg === -2 * n) return ['u2t-sci-sign', big ? 'The number is bigger than ' + t(10) + ', so the power of ' + t(10) + ' is <b>positive</b>.' : 'The number is less than ' + t(1) + ', so the power of ' + t(10) + ' is <b>negative</b>.']; if (Math.abs(lg) === 1) return ['u2t-sci-place', 'Count again: how many places does the decimal point move to sit just after the first nonzero digit?']; return null; } },
      'Put the decimal point just after the first nonzero digit: ' + t(sciCoef(M0)) + '. It moves ' + t(Math.abs(n)) + ' place' + (Math.abs(n) === 1 ? '' : 's') + ' ' + dir + ', so the exponent is ' + t(n) + (big ? ' (positive: the number is 10 or more)' : ' (negative: the number is less than 1)') + '.<br>' + t(std + '=' + sci),
      ['The number in front must be at least ' + t(1) + ' and less than ' + t(10) + ': put the decimal point after the first nonzero digit.', 'Count the places the decimal point moves. Big numbers get a positive exponent; numbers less than ' + t(1) + ' get a negative one.'], 'scientific notation of ' + decStr(M0, e),
      [sciTx(sciCoef(M0), -n), sciTx(sciCoef(M0), n + 1), sciTx(sciCoef(M0), n - 1)].concat(len > 1 ? [M0 + '\\times 10^{' + e + '}'] : []));
    return p;
  }
  function q6ToStd(r, big) {
    var M0 = mant(r), len = String(M0).length, n = big ? r.int(3, 6) : -r.int(2, 5), e = n - (len - 1), x = Number(decStr(M0, e)), std = stdT(M0, e), sci = sciT(M0, e);
    var diag = function (v) { var lg = pow10Of(v, x); if (lg == null) return null; if (lg === -2 * n) return { code: 'u2t-sci-dir', hint: 'The exponent is ' + t(n) + ', so move the decimal point to the <b>' + (big ? 'right' : 'left') + '</b> (' + (big ? 'a big number' : 'a number less than 1') + ').' }; if (Math.abs(lg) === 1) return { code: 'u2t-sci-place', hint: 'Count the places again: move the decimal point exactly ' + t(Math.abs(n)) + ' places.' }; return null; };
    var p = P.number('Write ' + t(sci) + ' in standard notation.', x, diag,
      'The exponent is ' + t(n) + ', so move the decimal point ' + t(Math.abs(n)) + ' places to the <b>' + (big ? 'right' : 'left') + '</b>, filling in zeros as placeholders:<br>' + t(sci + '=' + std),
      ['A positive exponent moves the decimal point right (a big number); a negative exponent moves it left (a small number).', 'Move it exactly as many places as the exponent says, and fill the gaps with zeros.'], 'standard notation of ' + sciCoef(M0) + 'e' + n);
    p.key = decStr(M0, e); p.answer = t(std);
    p.bad = [decStr(M0, e - 2 * n), decStr(M0, e + 1), decStr(M0, e - 1)];
    return p;
  }

  /* Q7: unit-fraction exponents (Lesson 9) */
  var Q7ROOT = [[16, 2], [25, 2], [36, 2], [49, 2], [64, 2], [81, 2], [100, 2], [121, 2], [144, 2], [8, 3], [27, 3], [64, 3], [125, 3], [1000, 3], [16, 4], [81, 4], [625, 4], [10000, 4], [32, 5], [243, 5], [100000, 5]];
  function q7Rad(r) {
    var v = r.pick(['x', 'y', 'm', 'k', 'a', 'b', 'p', 't', 'w', 'z']), n = r.int(2, 7), pr = v + '^{\\frac{1}{' + n + '}}', tg = radOf(v, 1, n);
    var cands = radCands(v, 1, n).concat([[pw(v, n), 'u2t-root-power', 'The denominator ' + t(n) + ' names a <b>root</b>, not a power: ' + t(v + '^{\\frac{1}{' + n + '}}=' + rootT(n, v)) + '.']]);
    return convPart(t(pr), tg, { form: 'radical', cands: cands }, 'The denominator of the exponent names the root (the index): ' + t(pr + '=' + tg) + '.' + (n === 2 ? ' (Index ' + t(2) + ' is the square root, written without the small 2.)' : ''),
      ['The denominator of the exponent is the index of the root: ' + t('a^{\\frac{1}{n}}=\\sqrt[n]{a}') + '.'], 'power to radical ' + pr);
  }

  /* ====================================================================================
   * Progressing
   * ==================================================================================== */
  /* Q8: two or three laws with coefficients (Lesson 4) */
  function q8a(r) {
    var x = r.pick(LET);
    var g = find(function () { var kn = r.pick([[2, 2], [2, 3], [3, 2], [3, 3], [4, 2], [5, 2]]); return { k: kn[0], n: kn[1], p: r.int(1, 4), c: r.int(1, 5), q: r.int(1, 4) }; },
      function (g) { return g.p * g.n + g.q <= 16 && Math.pow(g.k, g.n) * g.c <= 100; });
    var KN = Math.pow(g.k, g.n), pn = g.p * g.n, A = M(KN * g.c, [[x, pn + g.q]]), tg = posTex(A), rest = term(g.c, [[x, g.q]]);
    var prompt = br(g.k + pw(x, g.p)) + '^{' + g.n + '}\\times ' + rest;
    var kn = kmono([[M(g.k * g.c, A.v), 'coef-not-raised', 'The power applies to the number in the bracket too: ' + t(g.k + '^{' + g.n + '}=' + KN) + '.'],
      [M(g.k * g.n * g.c, A.v), 'coef-times', t(g.k + '^{' + g.n + '}') + ' means ' + g.n + ' factors of ' + t(g.k) + ', not ' + t(g.k + '\\times ' + g.n) + '.'],
      [M(KN * g.c, [[x, g.p + g.n + g.q]]), 'add-exp', 'A power of a power: <b>multiply</b> the exponent in the bracket by ' + t(g.n) + '.'],
      [M(KN * g.c, [[x, pn * g.q]]), 'mult-exp', 'Multiplying the two terms: <b>add</b> the exponents.'],
      g.c > 1 ? [M(KN + g.c, A.v), 'coef-added', 'Multiply the numbers in front, don’t add them.'] : null], tg);
    var sol = 'Power law first (every factor in the bracket gets the exponent ' + t(g.n) + '): ' + t(br(g.k + pw(x, g.p)) + '^{' + g.n + '}=' + g.k + '^{' + g.n + '}' + x + '^{' + g.p + '\\times ' + g.n + '}=' + KN + pw(x, pn)) + '.<br>Then the product law (multiply the numbers, add the exponents): ' + t(KN + pw(x, pn) + '\\times ' + rest + '=' + tg) + '.';
    return XP(t(prompt), tg, {}, sol, ['Clear the bracket first: raise the number <b>and</b> the power of ' + t(x) + ' to the power ' + t(g.n) + '.', 'Then multiply the numbers and add the exponents.'], 'simplify ' + prompt, kn);
  }
  function q8b(r) {
    var x = r.pick(LET);
    var g = find(function () { var kn = r.pick([[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [4, 2], [5, 2], [6, 2]]), KN = Math.pow(kn[0], kn[1]); return { k: kn[0], n: kn[1], KN: KN, m: r.pick([2, 3, 4, 5, 6, 8, 9]), p: r.int(1, 4), a: r.int(1, 8) }; },
      function (g) { return g.KN % g.m === 0 && g.KN / g.m >= 2 && g.p * g.n - g.a >= 1 && g.p * g.n >= 2; });
    var pn = g.p * g.n, C = g.KN / g.m, A = M(C, [[x, pn - g.a]]), tg = posTex(A);
    var prompt = '\\dfrac{' + br(g.k + pw(x, g.p)) + '^{' + g.n + '}}{' + term(g.m, [[x, g.a]]) + '}';
    var kn = kmono([[M(qdiv(g.k, g.m), A.v), 'coef-not-raised', 'Raise the ' + t(g.k) + ' to the power ' + t(g.n) + ' too: ' + t(g.k + '^{' + g.n + '}=' + g.KN) + '.'],
      [M(qdiv(g.k * g.n, g.m), A.v), 'coef-times', t(g.k + '^{' + g.n + '}') + ' is ' + t(g.KN) + ', not ' + t(g.k + '\\times ' + g.n) + '.'],
      g.p + g.n - g.a !== 0 ? [M(C, [[x, g.p + g.n - g.a]]), 'add-exp', 'A power of a power: <b>multiply</b> the exponents, don’t add them.'] : null,
      [M(C, [[x, pn + g.a]]), 'law-added', 'Dividing: <b>subtract</b> the exponent of the denominator.'],
      [M(g.KN - g.m, A.v), 'sub-coef', 'Divide the numbers, don’t subtract them: ' + t(g.KN + '\\div ' + g.m) + '.']], tg);
    var sol = 'Power law first: ' + t(br(g.k + pw(x, g.p)) + '^{' + g.n + '}=' + g.KN + pw(x, pn)) + '.<br>Then the quotient law (divide the numbers, subtract the exponents): ' + t('\\dfrac{' + g.KN + pw(x, pn) + '}{' + term(g.m, [[x, g.a]]) + '}=' + g.KN / g.m + x + '^{' + pn + '-' + g.a + '}=' + tg) + '.';
    return XP(t(prompt), tg, {}, sol, ['Simplify the bracket in the numerator first: every factor gets the exponent ' + t(g.n) + '.', 'Then divide the numbers and subtract the exponents.'], 'simplify ' + prompt, kn);
  }
  function q8c(r) {
    var L = r.pick(PAIRS), u = L[0], v = L[1], kind = r.pick(['powquot', 'inside']), A, tg, prompt, sol, kn, hints;
    if (kind === 'powquot') {
      var g = find(function () { var k = r.int(2, 5), m = r.pick([1, 2, 3, 4, 5]); return { k: k, m: m, p: r.int(1, 3), q: r.int(1, 3), a: r.int(1, 5), b: r.int(1, 4) }; },
        function (g) { return (g.k * g.k) % g.m === 0 && g.k * g.k / g.m >= 2 && 2 * g.p - g.a >= 1 && 2 * g.q - g.b >= 1 && !(g.p === 1 && g.q === 1); });
      var Pw = M(g.k * g.k, [[u, 2 * g.p], [v, 2 * g.q]]), den = M(g.m, [[u, g.a], [v, g.b]]); A = mdiv(Pw, den); tg = posTex(A);
      prompt = '\\dfrac{' + br(term(g.k, [[u, g.p], [v, g.q]])) + '^{2}}{' + term(g.m, [[u, g.a], [v, g.b]]) + '}';
      kn = kmono([[M(qdiv(g.k, g.m), A.v), 'coef-not-raised', 'Square the ' + t(g.k) + ' in the bracket too: ' + t(g.k + '^{2}=' + g.k * g.k) + '.'],
        [M(qdiv(2 * g.k, g.m), A.v), 'coef-times', t(g.k + '^{2}') + ' is ' + t(g.k * g.k) + ', not ' + t(g.k + '\\times 2') + '.'],
        [M(Q(g.k * g.k, g.m), [[u, g.p + 2 - g.a], [v, g.q + 2 - g.b]]), 'add-exp', 'A power of a power: <b>multiply</b> each exponent in the bracket by ' + t(2) + '.'],
        [M(Q(g.k * g.k, g.m), [[u, 2 * g.p], [v, 2 * g.q]]), 'top-only', 'Now divide by the denominator: subtract its exponents too.'],
        [M(Q(g.k * g.k, g.m), [[u, 2 * g.p - g.a], [v, g.q - g.b]]), 'missed-factor', 'The outside exponent applies to <b>every</b> factor in the bracket, ' + t(v) + ' too.']], tg);
      sol = 'Power law first: ' + t(br(term(g.k, [[u, g.p], [v, g.q]])) + '^{2}=' + rawTex(Pw)) + '.<br>Then the quotient law for each base (divide the numbers, subtract the exponents):<br>' + t('\\dfrac{' + rawTex(Pw) + '}{' + term(g.m, [[u, g.a], [v, g.b]]) + '}=' + tg);
      hints = ['Clear the bracket first: square every factor, the number too.', 'Then divide the numbers and subtract the exponents of each letter.'];
    } else {
      var h = find(function () { return { C: r.int(2, 4), m: r.int(2, 4), e1: r.int(1, 3), e2: r.int(1, 2), a: r.int(1, 3), b: r.int(0, 2), n: r.pick([2, 2, 3]) }; }, function (h) { return Math.pow(h.C, h.n) <= 64; });
      var In = M(h.C, [[u, h.e1], [v, h.e2]]); A = mpow(In, h.n); tg = posTex(A);
      var numT = term(h.C * h.m, [[u, h.e1 + h.a], [v, h.e2 + h.b]]), denT = term(h.m, h.b ? [[u, h.a], [v, h.b]] : [[u, h.a]]);
      prompt = '\\left(\\dfrac{' + numT + '}{' + denT + '}\\right)^{' + h.n + '}';
      kn = kmono([[M(h.C, A.v), 'coef-not-raised', 'Raise the number to the power ' + t(h.n) + ' too: ' + t(h.C + '^{' + h.n + '}=' + Math.pow(h.C, h.n)) + '.'],
        [M(h.C * h.n, A.v), 'coef-times', t(h.C + '^{' + h.n + '}') + ' is ' + t(Math.pow(h.C, h.n)) + ', not ' + t(h.C + '\\times ' + h.n) + '.'],
        [M(Math.pow(h.C, h.n), [[u, h.e1 + h.n], [v, h.e2 + h.n]]), 'add-exp', 'A power of a power: <b>multiply</b> each exponent by ' + t(h.n) + '.'],
        [M(Math.pow(h.C, h.n), [[u, h.e1], [v, h.e2]]), 'top-only', 'You simplified the inside; now raise it to the power ' + t(h.n) + '.'],
        [M(Math.pow(h.C, h.n), [[u, h.n * (h.e1 + 2 * h.a)], [v, h.n * (h.e2 + 2 * h.b)]]), 'law-added', 'Dividing: <b>subtract</b> the exponents of the denominator.']], tg);
      sol = 'Simplify inside the bracket first (divide the numbers, subtract the exponents): ' + t('\\dfrac{' + numT + '}{' + denT + '}=' + rawTex(In)) + '.<br>Then every factor gets the exponent ' + t(h.n) + ': ' + t(br(rawTex(In)) + '^{' + h.n + '}=' + tg) + '.';
      hints = ['Simplify inside the brackets first: divide the numbers and subtract the exponents.', 'Then raise every factor of the result to the power ' + t(h.n) + ', the number too.'];
    }
    return XP(t(prompt), tg, {}, sol, hints, 'simplify ' + prompt, kn);
  }

  /* Q9: negative exponents, answers with positive exponents (Lessons 6–7) */
  function q9a(r) {
    var x = r.pick(LET), kind = r.pick(['pp', 'pp', 'np']);
    var g = find(function () { return { q: r.int(2, 6), k: r.int(2, 6), m: r.int(1, 5), n: r.int(3, 9), a: r.int(1, 4), b: r.int(1, 5) }; },
      function (g) { return kind === 'pp' ? g.n - g.m >= 2 : g.a !== g.b; });
    var E = kind === 'pp' ? g.n - g.m : g.a + g.b, top = kind === 'pp' ? g.m : -g.a, bot = kind === 'pp' ? g.n : g.b;
    var A = M(g.q, [[x, -E]]), tg = posTex(A), numT = termx(g.q * g.k, [[x, top]]), denT = term(g.k, [[x, bot]]);
    var prompt = r.chance(0.5) ? '\\dfrac{' + numT + '}{' + denT + '}' : numT + '\\div ' + denT;
    var kn = kmono([top + bot !== 0 ? [M(g.q, [[x, top + bot]]), 'law-added', 'Dividing: <b>subtract</b> the exponents (top minus bottom).'] : null,
      kind === 'np' && bot - g.a !== 0 ? [M(g.q, [[x, -(bot - g.a)]]), 'sign-exp', 'Watch the signs: ' + t('-' + g.a + '-' + bot + '=' + (-g.a - bot)) + '.'] : null,
      [M([1, g.q], [[x, -E]]), 'coef-side', 'Only the power of ' + t(x) + ' has the negative exponent, so only it moves to the denominator; the ' + t(g.q) + ' stays on top.'],
      [M(g.q * g.k - g.k, A.v), 'sub-coef', 'Divide the numbers, don’t subtract them.']], tg);
    var sol = 'Divide the numbers, subtract the exponents: ' + t(prompt + '=' + g.q + x + '^{' + top + '-' + bot + '}=' + g.q + pwx(x, -E)) + '.<br>Then make the exponent positive (the power moves to the denominator; the ' + t(g.q) + ' stays on top): ' + t(g.q + pwx(x, -E) + '=' + tg) + '.';
    return XP(t(prompt), tg, {}, sol, ['Divide the numbers, then subtract the exponents: top minus bottom.', 'A negative result means the power goes in the denominator. The number in front has no negative exponent, so it stays on top.'], 'simplify ' + prompt, kn);
  }
  function q9b(r) {
    var x = r.pick(LET), kind = r.pick(['a', 'b', 'c']), A, prompt, sol, kn, hints, tg;
    if (kind === 'a') { // (k x^{-p})^2 · x^q
      var g = find(function () { return { k: r.int(2, 5), p: r.int(1, 3), q: r.int(1, 8) }; }, function (g) { return g.q - 2 * g.p !== 0; });
      var Pw = M(g.k * g.k, [[x, -2 * g.p]]); A = mmul(Pw, M(1, [[x, g.q]])); tg = posTex(A);
      prompt = br(g.k + pwx(x, -g.p)) + '^{2}\\times ' + pw(x, g.q);
      kn = kmono([[M(g.k, A.v), 'coef-not-raised', 'Square the number in the bracket too: ' + t(g.k + '^{2}=' + g.k * g.k) + '.'], [M(2 * g.k, A.v), 'coef-times', t(g.k + '^{2}') + ' is ' + t(g.k * g.k) + ', not ' + t(g.k + '\\times 2') + '.'],
        g.q - g.p + 2 !== 0 ? [M(g.k * g.k, [[x, -g.p + 2 + g.q]]), 'add-exp', 'A power of a power: <b>multiply</b> the exponents, ' + t('(-' + g.p + ')\\times 2') + '.'] : null, [M(g.k * g.k, [[x, 2 * g.p + g.q]]), 'sign-exp', 'Check the sign: ' + t('(-' + g.p + ')\\times 2=-' + 2 * g.p) + '.']], tg);
      sol = 'Power law first: ' + t(br(g.k + pwx(x, -g.p)) + '^{2}=' + g.k * g.k + pwx(x, -2 * g.p)) + '.<br>Then the product law: ' + t(g.k * g.k + pwx(x, -2 * g.p) + '\\times ' + pw(x, g.q) + '=' + g.k * g.k + pwx(x, g.q - 2 * g.p) + (g.q - 2 * g.p < 0 ? '=' + tg : '')) + '.';
      hints = ['Clear the bracket first: square the number and multiply the exponent by ' + t(2) + '.', 'Then add the exponents. Finish with positive exponents.'];
    } else if (kind === 'b') { // (k x^p)^n · x^{-q}
      var h = find(function () { var kn = r.pick([[2, 2], [2, 3], [3, 2], [4, 2], [5, 2], [3, 3]]); return { k: kn[0], n: kn[1], p: r.int(1, 3), q: r.int(2, 9) }; }, function (h) { return h.p * h.n - h.q !== 0 && h.p * h.n >= 2; });
      var KN = Math.pow(h.k, h.n), pn = h.p * h.n; A = M(KN, [[x, pn - h.q]]); tg = posTex(A);
      prompt = br(h.k + pw(x, h.p)) + '^{' + h.n + '}\\times ' + pwx(x, -h.q);
      kn = kmono([[M(h.k, A.v), 'coef-not-raised', 'Raise the number in the bracket too: ' + t(h.k + '^{' + h.n + '}=' + KN) + '.'], [M(h.k * h.n, A.v), 'coef-times', t(h.k + '^{' + h.n + '}') + ' is ' + t(KN) + ', not ' + t(h.k + '\\times ' + h.n) + '.'],
        h.p + h.n - h.q !== 0 ? [M(KN, [[x, h.p + h.n - h.q]]), 'add-exp', 'A power of a power: <b>multiply</b> the exponents.'] : null, [M(KN, [[x, pn + h.q]]), 'sign-exp', 'Adding a negative exponent: ' + t(pn + '+(-' + h.q + ')=' + (pn - h.q)) + '.']], tg);
      sol = 'Power law first: ' + t(br(h.k + pw(x, h.p)) + '^{' + h.n + '}=' + KN + pw(x, pn)) + '.<br>Then the product law: ' + t(KN + pw(x, pn) + '\\times ' + pwx(x, -h.q) + '=' + KN + x + '^{' + pn + '+(-' + h.q + ')}=' + KN + pwx(x, pn - h.q) + (pn - h.q < 0 ? '=' + tg : '')) + '.';
      hints = ['Clear the bracket first: raise the number and multiply the exponent by ' + t(h.n) + '.', 'Then add the exponents (one is negative). Finish with positive exponents.'];
    } else { // (k y^{-p})^2 / (m y^q)
      var c = find(function () { return { k: r.int(2, 6), m: r.pick([2, 3, 4]), p: r.int(1, 3), q: r.int(1, 5) }; }, function (c) { return (c.k * c.k) % c.m === 0 && c.k * c.k / c.m >= 2; });
      var KK = c.k * c.k, C2 = KK / c.m, E2 = -2 * c.p - c.q; A = M(C2, [[x, E2]]); tg = posTex(A);
      prompt = '\\dfrac{' + br(c.k + pwx(x, -c.p)) + '^{2}}{' + term(c.m, [[x, c.q]]) + '}';
      kn = kmono([[M(qdiv(c.k, c.m), A.v), 'coef-not-raised', 'Square the number in the bracket too: ' + t(c.k + '^{2}=' + KK) + '.'], [M(qdiv(2 * c.k, c.m), A.v), 'coef-times', t(c.k + '^{2}') + ' is ' + t(KK) + ', not ' + t(c.k + '\\times 2') + '.'],
        -2 * c.p + c.q !== 0 ? [M(C2, [[x, -2 * c.p + c.q]]), 'law-added', 'Dividing: <b>subtract</b> the exponent of the denominator.'] : null, 2 * c.p - c.q !== 0 ? [M(C2, [[x, 2 * c.p - c.q]]), 'sign-exp', 'Check the sign: ' + t('(-' + c.p + ')\\times 2=-' + 2 * c.p) + '.'] : null, [M([1, C2], [[x, E2]]), 'coef-side', 'The number has no negative exponent: it stays in the numerator.']], tg);
      sol = 'Power law first: ' + t(br(c.k + pwx(x, -c.p)) + '^{2}=' + KK + pwx(x, -2 * c.p)) + '.<br>Then the quotient law: ' + t('\\dfrac{' + KK + pwx(x, -2 * c.p) + '}{' + term(c.m, [[x, c.q]]) + '}=' + C2 + x + '^{-' + 2 * c.p + '-' + c.q + '}=' + C2 + pwx(x, E2) + '=' + tg) + '.';
      hints = ['Clear the bracket first: square the number and multiply the exponent by ' + t(2) + '.', 'Then divide the numbers and subtract the exponents. Finish with positive exponents.'];
    }
    return XP(t(prompt), tg, {}, sol, hints, 'simplify ' + prompt, kn);
  }
  function q9c(r) {
    var L = r.pick(PAIRS), a = L[0], b = L[1], kind = r.pick(['quot', 'prod']), A, prompt, kn, sol;
    var g = find(function () { return { p1: r.int(1, 6), q1: r.int(1, 5), p2: r.int(1, 5), q2: r.int(1, 6) }; }, function (g) { return kind === 'quot' || (g.p2 !== g.p1 && g.q1 !== g.q2); });
    if (kind === 'quot') {
      A = M(1, [[a, g.p1 + g.p2], [b, -(g.q1 + g.q2)]]);
      prompt = '\\dfrac{' + termx(1, [[a, g.p1], [b, -g.q1]]) + '}{' + termx(1, [[a, -g.p2], [b, g.q2]]) + '}';
      kn = kmono([g.p1 !== g.p2 && g.q1 !== g.q2 ? [M(1, [[a, g.p1 - g.p2], [b, g.q2 - g.q1]]), 'law-added', 'Dividing: <b>subtract</b> each exponent of the denominator, top minus bottom.'] : null,
        g.p1 !== g.p2 ? [M(1, [[a, g.p1 - g.p2], [b, -(g.q1 + g.q2)]]), 'sign-exp', 'Subtracting a negative exponent <b>adds</b> it: ' + t(g.p1 + '-(-' + g.p2 + ')=' + (g.p1 + g.p2)) + '.'] : null,
        g.q2 !== g.q1 ? [M(1, [[a, g.p1 + g.p2], [b, g.q2 - g.q1]]), 'sign-exp', 'Check the exponent of ' + t(b) + ': ' + t('-' + g.q1 + '-' + g.q2 + '=' + (-g.q1 - g.q2)) + '.'] : null], posTex(A));
      sol = 'Quotient law for each base (top minus bottom): ' + t(prompt + '=' + a + '^{' + g.p1 + '-(-' + g.p2 + ')}' + b + '^{-' + g.q1 + '-' + g.q2 + '}=' + rawTex(A) + fin(A)) + '.';
    } else {
      A = M(1, [[a, g.p2 - g.p1], [b, g.q1 - g.q2]]);
      prompt = termx(1, [[a, -g.p1], [b, g.q1]]) + '\\times ' + termx(1, [[a, g.p2], [b, -g.q2]]);
      kn = kmono([[M(1, [[a, -g.p1 * g.p2], [b, -g.q1 * g.q2]]), 'mult-exp', 'Multiplying powers of the same base: <b>add</b> the exponents.'],
        g.p1 + g.p2 !== 0 ? [M(1, [[a, g.p1 + g.p2], [b, g.q1 - g.q2]]), 'sign-exp', 'Watch the sign: ' + t('-' + g.p1 + '+' + g.p2 + '=' + (g.p2 - g.p1)) + '.'] : null], posTex(A));
      sol = 'Product law for each base (add the exponents): ' + t(prompt + '=' + a + '^{-' + g.p1 + '+' + g.p2 + '}' + b + '^{' + g.q1 + '+(-' + g.q2 + ')}=' + rawTex(A) + fin(A)) + '.';
    }
    var tg = posTex(A);
    return XP(t(prompt), tg, {}, sol, ['Work with one base at a time: ' + (kind === 'quot' ? 'subtract the exponents, top minus bottom (subtracting a negative adds).' : 'add the exponents.'), 'Finish with positive exponents: a power with a negative exponent goes in the denominator.'], 'simplify ' + prompt, kn);
  }

  /* Q10: evaluate with zero and negative exponents (Lessons 6–7) */
  function q10a(r) {
    var g = find(function () { return [r.int(2, 5), r.int(2, 7), r.pick([1, 2, 2, 3])]; }, function (g) { return g[0] !== g[1] && cop(g[0], g[1]) && Math.pow(Math.max(g[0], g[1]), g[2]) <= 125 && !(g[2] === 1 && g[1] < g[0]); }), p = g[0], q = g[1], n = g[2];
    var pr = '\\left(\\dfrac{' + p + '}{' + q + '}\\right)^{-' + n + '}', V = Q(Math.pow(q, n), Math.pow(p, n));
    return VAL(t(pr), V, [[Math.pow(p, n) / Math.pow(q, n), 'no-flip', 'A negative exponent on a fraction <b>flips</b> it: ' + t(pr + '=\\left(\\dfrac{' + q + '}{' + p + '}\\right)^{' + n + '}') + '.'], [q / p, 'no-power', 'You flipped the fraction — now raise it to the power ' + t(n) + '.'], [-qv(V), 'u2t-opposite', 'A negative exponent flips the fraction; it doesn’t make it negative.'], [Math.pow(q, n) / p, 'top-only', 'Raise the top <b>and</b> the bottom to the power.']],
      'Flip the fraction to make the exponent positive: ' + t(pr + '=\\left(\\dfrac{' + q + '}{' + p + '}\\right)^{' + n + '}' + (n > 1 ? '=\\dfrac{' + q + '^{' + n + '}}{' + p + '^{' + n + '}}=' + nT(V) : '=' + nT(V))), ['A negative exponent on a fraction flips it: ' + t('\\left(\\frac{a}{b}\\right)^{-n}=\\left(\\frac{b}{a}\\right)^{n}') + '.', 'Then raise the top and the bottom to the power.'], 'evaluate ' + pr);
  }
  function q10b(r) {
    if (r.chance(0.5)) {
      var bn = r.pick([[2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [3, 1], [3, 2], [3, 3], [4, 1], [4, 2], [5, 1], [5, 2], [6, 1], [6, 2], [7, 1], [8, 1], [9, 1], [10, 1], [10, 2], [10, 3]]), b = bn[0], n = bn[1], V = Math.pow(b, n), first = r.chance(0.5);
      var pr = first ? b + '^{-' + n + '}+' + b + '^{0}' : b + '^{0}+' + b + '^{-' + n + '}';
      return VAL(t(pr), [V + 1, V], [[1 / V, 'zero-power', t(b + '^{0}=1') + ', not ' + t(0) + '.'], [V + 1, 'no-recip', t(b + '^{-' + n + '}') + ' is the <b>reciprocal</b> ' + t('\\frac{1}{' + V + '}') + '.'], [1 - V, 'u2t-opposite', 'A negative exponent means reciprocal, not negative.'], [1 / V + b, 'u2t-zero-base', t(b + '^{0}=1') + ', not ' + t(b) + '.'], [1 - 1 / V, 'u2t-opposite', t(b + '^{-' + n + '}=\\frac{1}{' + V + '}') + ' is positive.']],
        t(b + '^{-' + n + '}=\\dfrac{1}{' + V + '}') + ' and ' + t(b + '^{0}=1') + ', so ' + t(pr + '=' + (first ? '\\dfrac{1}{' + V + '}+1' : '1+\\dfrac{1}{' + V + '}') + '=\\dfrac{' + (V + 1) + '}{' + V + '}') + '.', ['Work out each power first: ' + t('a^{0}=1') + ' and ' + t('a^{-n}=\\frac{1}{a^{n}}') + '.', 'Then add the fractions: ' + t('1=\\frac{' + V + '}{' + V + '}') + '.'], 'evaluate ' + pr);
    }
    var g = find(function () { return { b: r.pick([2, 2, 3, 3, 4, 5, 10]), a: r.int(1, 6), c: r.int(2, 8) }; }, function (g) { var e = g.c - g.a; return e !== 0 && e !== 1 && Math.abs(e) <= 3 && Math.pow(g.b, Math.abs(e)) <= 125 && g.a !== g.c; });
    var b = g.b, e = g.c - g.a, Vf = e > 0 ? Q(Math.pow(b, e), 1) : Q(1, Math.pow(b, -e)), pr2 = '\\dfrac{' + b + '^{-' + g.a + '}\\times ' + b + '^{' + g.c + '}}{' + b + '^{0}}';
    return VAL(t(pr2), Vf, [[Math.pow(b, g.c + g.a), 'sign-exp', 'Watch the sign: ' + t('-' + g.a + '+' + g.c + '=' + e) + '.'], [-qv(Vf), 'u2t-opposite', 'A negative exponent never makes the value negative.'], [b * e, 'u2t-times-exp', t(b + '^{' + e + '}') + ' is not ' + t(b + '\\times ' + e) + '.'], [Math.pow(b, g.a * g.c) <= 5000 ? Math.pow(b, -g.a * g.c) : NaN, 'mult-exp', 'Multiplying powers: <b>add</b> the exponents.'], [e < 0 ? Math.pow(b, -e) : Math.pow(b, -e), 'no-recip', e < 0 ? 'The exponent is negative, so the answer is a <b>reciprocal</b>.' : 'Check the sign of the final exponent.']],
      'Product law on top, and ' + t(b + '^{0}=1') + ': ' + t(pr2 + '=\\dfrac{' + b + '^{-' + g.a + '+' + g.c + '}}{1}=' + b + '^{' + e + '}=' + nT(Vf)) + '.', ['Add the exponents in the numerator. The denominator ' + t(b + '^{0}') + ' is just ' + t(1) + '.', 'Then evaluate the single power' + (e < 0 ? ' (a negative exponent means reciprocal)' : '') + '.'], 'evaluate ' + pr2);
  }

  /* Q11a: multiply in scientific notation (Lesson 10 review, Example 8a; Lesson 8 extra practice) */
  var Q11MUL = [['2', '3'], ['2', '4'], ['3', '3'], ['4', '2'], ['3', '2'], ['2', '2'], ['1.5', '2'], ['2.5', '2'], ['2.5', '4'], ['5', '8'], ['6', '5'], ['4', '5'], ['8', '4'], ['5', '5'], ['3', '5'], ['9', '4'], ['6', '4'], ['7', '3'], ['2', '4.5'], ['1.2', '3'], ['5', '6']];
  function cMul(a, b) { return decimalOf(Number(a) * Number(b)); }
  function q11Mul(r) {
    var ab = r.pick(Q11MUL), sw = r.chance(0.5), a = sw ? ab[1] : ab[0], b = sw ? ab[0] : ab[1];
    var g = find(function () { return { m: rnd(r, -6, 9), n: rnd(r, -8, 8) }; }, function (g) { return g.m !== g.n && g.m + g.n !== 0 && Math.abs(g.m + g.n) <= 14 && Math.abs(g.m * g.n) !== Math.abs(g.m + g.n); });
    var cp = cMul(a, b), x = sciNum(cp, g.m + g.n), key = K.sciTex(x), big = Number(cp) >= 10;
    var prompt = br(sciTx(a, g.m)) + br(sciTx(b, g.n));
    var p = sciPart('Evaluate ' + t(prompt) + '. Write the answer in scientific notation.', x, {
      diag: function (v) { if (near(v, sciNum(cp, g.m * g.n))) return { code: 'u2t-sci-mult', hint: 'Multiplying powers of ' + t(10) + ': <b>add</b> the exponents (product law).' }; if (near(v, sciNum(decimalOf(Number(a) + Number(b)), g.m + g.n))) return { code: 'u2t-sci-coef-add', hint: 'Multiply the numbers in front: ' + t(a + '\\times ' + b) + '.' }; return null; },
      off: function (lg) { if (big && lg === -1) return ['u2t-sci-adjust', 'Right digits — but ' + t(cp) + ' is ' + t(K.sciTex(Number(cp))) + ', so the power of ' + t(10) + ' goes up by ' + t(1) + '.']; return null; } },
      'Multiply the numbers and add the exponents of ' + t(10) + ' (product law):<br>' + t(prompt + '=(' + a + '\\times ' + b + ')\\times 10^{' + g.m + '+' + pT(g.n) + '}=' + sciTx(cp, g.m + g.n) + (big ? '=' + key : '')) + (big ? '<br>(' + t(cp) + ' is not between ' + t(1) + ' and ' + t(10) + ', so write it as ' + t(K.sciTex(Number(cp))) + ' and add ' + t(1) + ' to the exponent.)' : ''),
      ['Group the numbers and the powers of ' + t(10) + ': multiply the numbers, <b>add</b> the exponents.', 'The number in front must be at least ' + t(1) + ' and less than ' + t(10) + '; adjust the power of ' + t(10) + ' if it isn’t.'], 'scientific notation product',
      [sciTx(cp, g.m * g.n), big ? sciTx(cp, g.m + g.n) : Number(a) + Number(b) !== Number(cp) ? sciTx(decimalOf(Number(a) + Number(b)), g.m + g.n) : sciTx(cp, -(g.m + g.n))]);
    return p;
  }
  /* Q12: rational exponents (Lesson 9) */
  function q12Eval(r) {
    var g = find(function () { var n = r.pick([2, 2, 3, 3, 4, 5]), c = r.int(2, n === 2 ? 10 : n === 3 ? 5 : 3), m = r.int(2, n === 2 ? 7 : 5); return { n: n, c: c, m: m }; },
      function (g) { return cop(g.m, g.n) && Math.pow(g.c, g.m) <= 1000 && Math.pow(g.c, g.n) <= 1000 && !(g.n === 2 && g.m > 3 && g.c > 4); });
    return EV({ base: [Math.pow(g.c, g.n), 1], m: g.m, n: g.n });
  }
  function q12ToRad(r) {
    var v = r.pick(['p', 'q', 'r', 's', 't', 'u', 'x', 'y', 'w', 'z']), neg = r.chance(0.3);
    var g = find(function () { var n = r.pick([3, 4, 5, 6, 7, 8]); return [r.int(2, n + 2), n]; }, function (g) { return cop(g[0], g[1]) && g[0] !== g[1]; });
    var m = neg ? -g[0] : g[0], n = g[1], prompt = v + '^{' + expS(m, n) + '}', tg = radOf(v, m, n);
    return convPart(t(prompt), tg, { form: 'radical', cands: radCands(v, m, n) }, 'Denominator of the exponent → index of the root; numerator → the power' + (neg ? '; the negative sign → reciprocal (the radical goes in the denominator)' : '') + '.<br>' + t(prompt + '=' + tg), CONV_HINTS, 'power to radical ' + prompt);
  }
  function q12ToPow(r) {
    var v = r.pick(['p', 'q', 'r', 's', 't', 'u', 'x', 'y', 'w', 'z']), kind = r.pick(['pos', 'pos', 'sqrt', 'recip']), m, n, prompt;
    if (kind === 'pos') { var g = find(function () { var nn = r.pick([3, 4, 5, 6, 8]); return [r.int(2, nn + 2), nn]; }, function (g) { return cop(g[0], g[1]) && g[0] !== g[1]; }); m = g[0]; n = g[1]; prompt = rootT(n, pw(v, m)); }
    else if (kind === 'sqrt') { m = r.pick([3, 5, 7, 9]); n = 2; prompt = rootT(2, pw(v, m)); }
    else { var g2 = find(function () { var nn = r.pick([2, 3, 4, 5, 6]); return [r.int(1, nn + 1), nn]; }, function (g) { return cop(g[0], g[1]) && g[0] !== g[1] && !(g[0] === 1 && g[1] === 2); }); m = -g2[0]; n = g2[1]; prompt = '\\dfrac{1}{' + rootT(n, pw(v, -m)) + '}'; }
    var tg = v + '^{' + expS(m, n) + '}', k = Math.abs(m), s = sgn(m), cands = [];
    cands.push([v + '^{' + expS(s * n, k) + '}', 'index-power', 'The <b>index</b> of the root becomes the <b>denominator</b> of the exponent, and the power inside becomes the numerator.']);
    cands.push([v + '^{' + expS(-m, n) + '}', m < 0 ? 'no-recip' : 'flip-exp', m < 0 ? 'The radical is in the <b>denominator</b>, so the exponent is <b>negative</b>.' : 'Check the sign of the exponent: the radical is in the numerator, so the exponent is positive.']);
    cands.push([v + '^{' + m * n + '}', 'u2t-times-exp', 'A root divides the exponent: the index ' + t(n) + ' goes in the <b>denominator</b>.']);
    return convPart(t(prompt), tg, { form: 'power', single: v + '^{n}', cands: cands }, 'Index ' + t(n) + ' → denominator; power ' + t(k) + ' → numerator' + (m < 0 ? '; in the denominator → negative exponent' : '') + '.<br>' + t(prompt + '=' + tg), CONV_HINTS, 'radical to power ' + prompt);
  }

  /* ====================================================================================
   * Mastery
   * ==================================================================================== */
  /* Q13a: one base, every law (Lesson 7 #9a, #12) */
  function q13a(r) {
    var x = r.pick(['x', 'a', 'm', 'k', 'n', 'p', 't', 'w']), y = x === 'y' ? 'b' : 'y', A, prompt, sol, kn, hints;
    if (r.chance(0.5)) { // ((k x^p)^n · x^{-q}) / (m x^s)
      var g = find(function () { var kn2 = r.pick([[2, 2], [2, 3], [3, 2], [3, 3], [4, 2], [5, 2]]); return { k: kn2[0], n: kn2[1], p: r.int(1, 3), q: r.int(1, 4), m: r.pick([2, 3, 4, 8, 9]), s: r.int(1, 6) }; },
        function (g) { var KN = Math.pow(g.k, g.n), e = g.p * g.n - g.q - g.s; return KN % g.m === 0 && KN / g.m >= 1 && e !== 0 && Math.abs(e) <= 6; });
      var KN = Math.pow(g.k, g.n), pn = g.p * g.n, C = KN / g.m, e = pn - g.q - g.s; A = M(C, [[x, e]]);
      prompt = '\\dfrac{' + br(g.k + pw(x, g.p)) + '^{' + g.n + '}\\times ' + pwx(x, -g.q) + '}{' + term(g.m, [[x, g.s]]) + '}';
      kn = kmono([[M(qdiv(g.k, g.m), A.v), 'coef-not-raised', 'Raise the number in the bracket to the power ' + t(g.n) + ' too: ' + t(g.k + '^{' + g.n + '}=' + KN) + '.'],
        g.p + g.n - g.q - g.s !== 0 ? [M(C, [[x, g.p + g.n - g.q - g.s]]), 'add-exp', 'A power of a power: <b>multiply</b> the exponents in the bracket.'] : null,
        pn + g.q - g.s !== 0 ? [M(C, [[x, pn + g.q - g.s]]), 'sign-exp', 'The exponent ' + t(-g.q) + ' is negative: ' + t(pn + '+(-' + g.q + ')=' + (pn - g.q)) + '.'] : null,
        [M(C, [[x, pn - g.q + g.s]]), 'law-added', 'Dividing: <b>subtract</b> the exponent of the denominator.'],
        e < 0 ? [M(C, [[x, -e]]), 'flip-exp', 'The exponent comes out negative, so the power goes in the <b>denominator</b>.'] : null], posTex(A));
      sol = '1. Brackets: ' + t(br(g.k + pw(x, g.p)) + '^{' + g.n + '}=' + KN + pw(x, pn)) + '.<br>2. Combine the powers of ' + t(x) + ': ' + t('\\dfrac{' + KN + pw(x, pn) + '\\times ' + pwx(x, -g.q) + '}{' + term(g.m, [[x, g.s]]) + '}=\\dfrac{' + KN + '}{' + g.m + '}' + x + '^{' + pn + '+(-' + g.q + ')-' + g.s + '}=' + rawTex(A)) + '.<br>' + step3(A);
      hints = ['Three steps: clear the bracket, combine the powers of ' + t(x) + ', then make every exponent positive.', LAWS15];
    } else { // (k x^p y^0)^{-1} · c x^q / (d x^{-s})
      var h = find(function () { return { k: r.int(2, 5), d: r.pick([2, 3]), C: r.pick([1, 1, 2, 3, [1, 2]]), p: r.int(1, 3), q: r.int(1, 6), s: r.int(1, 4) }; },
        function (h) { var c = qmul(qmul(h.k, h.d), h.C); return c[1] === 1 && c[0] <= 36 && h.q - h.p + h.s !== 0 && Math.abs(h.q - h.p + h.s) <= 9 && h.q !== h.p; });
      var cc = qmul(qmul(h.k, h.d), h.C)[0], e2 = h.q - h.p + h.s; A = M(h.C, [[x, e2]]);
      var brk = br(h.k + pw(x, h.p) + pwx(y, 0)) + '^{-1}';
      prompt = '\\dfrac{' + brk + '\\times ' + term(cc, [[x, h.q]]) + '}{' + termx(h.d, [[x, -h.s]]) + '}';
      kn = kmono([[M(qdiv(cc * h.k, h.d), A.v), 'coef-pos-power', t(h.k + '^{-1}=\\frac{1}{' + h.k + '}') + ': the ' + t(h.k) + ' ends up in the <b>denominator</b>.'],
        h.q + h.p + h.s !== 0 ? [M(h.C, [[x, h.q + h.p + h.s]]), 'sign-exp', t(br(pw(x, h.p)) + '^{-1}=' + pwx(x, -h.p)) + ': the exponent becomes <b>negative</b>.'] : null,
        h.q - h.p - h.s !== 0 ? [M(h.C, [[x, h.q - h.p - h.s]]), 'sign-exp', 'Dividing by ' + t(pwx(x, -h.s)) + ' <b>subtracts</b> a negative exponent, which adds it.'] : null,
        [M(Q(cc, h.k * h.d), [[x, e2], [y, 1]]), 'u2t-y-left', t(y + '^{0}=1') + ', so ' + t(y) + ' disappears from the answer.']], posTex(A));
      sol = '1. Brackets: ' + t(brk + '=' + h.k + '^{-1}' + pwx(x, -h.p) + '\\times 1=\\dfrac{1}{' + h.k + pw(x, h.p) + '}') + ' (' + t(y + '^{0}=1') + ').<br>2. Combine: ' + t('\\dfrac{' + cc + '}{' + h.k + '\\times ' + h.d + '}' + x + '^{-' + h.p + '+' + h.q + '-(-' + h.s + ')}=' + rawTex(A)) + '.<br>' + step3(A);
      hints = ['Clear the bracket first: every factor gets the exponent ' + t(-1) + ', and ' + t(y + '^{0}=1') + '.', 'Then combine the numbers and the powers of ' + t(x) + ' (subtracting a negative adds). Finish with positive exponents.'];
    }
    return XP(t(prompt), posTex(A), {}, sol, hints, 'simplify ' + prompt, kn);
  }
  /* Q13b: two bases, a negative outside power (Lesson 7 #11, #13, #14) */
  function q13b(r) {
    var L = r.pick(PAIRS), a = L[0], b = L[1], A, prompt, sol, kn, hints;
    if (r.chance(0.5)) { // (k a^p b^{-q})^2 / (m a^{-s} b^u)
      var g = find(function () { return { k: r.int(2, 4), m: r.pick([1, 2, 4]), p: r.int(1, 4), q: r.int(1, 3), s: r.int(1, 3), u: r.int(1, 4) }; }, function (g) { return (g.k * g.k) % g.m === 0; });
      var Pw = M(g.k * g.k, [[a, 2 * g.p], [b, -2 * g.q]]), den = M(g.m, [[a, -g.s], [b, g.u]]); A = mdiv(Pw, den);
      prompt = '\\dfrac{' + br(termx(g.k, [[a, g.p], [b, -g.q]])) + '^{2}}{' + termx(g.m, [[a, -g.s], [b, g.u]]) + '}';
      kn = kmono([[M(Q(g.k, g.m), A.v), 'coef-not-raised', 'Square the ' + t(g.k) + ' too: ' + t(g.k + '^{2}=' + g.k * g.k) + '.'],
        [M(Q(g.k * g.k, g.m), [[a, 2 * g.p - g.s], [b, -2 * g.q - g.u]]), 'sign-exp', 'Subtracting a negative exponent <b>adds</b> it: ' + t(2 * g.p + '-(-' + g.s + ')=' + (2 * g.p + g.s)) + '.'],
        [M(Q(g.k * g.k, g.m), [[a, g.p + 2 + g.s], [b, -g.q + 2 - g.u]]), 'add-exp', 'A power of a power: <b>multiply</b> each exponent by ' + t(2) + '.'],
        -2 * g.q + g.u !== 0 ? [M(Q(g.k * g.k, g.m), [[a, 2 * g.p + g.s], [b, -2 * g.q + g.u]]), 'law-added', 'Dividing: <b>subtract</b> the exponent of ' + t(b) + ' in the denominator.'] : null], posTex(A));
      sol = '1. Brackets: ' + t(br(termx(g.k, [[a, g.p], [b, -g.q]])) + '^{2}=' + rawTex(Pw)) + '.<br>2. Quotient law for each base: ' + t('\\dfrac{' + rawTex(Pw) + '}{' + termx(g.m, [[a, -g.s], [b, g.u]]) + '}=' + nT(Q(g.k * g.k, g.m)) + a + '^{' + 2 * g.p + '-(-' + g.s + ')}' + b + '^{-' + 2 * g.q + '-' + g.u + '}=' + rawTex(A)) + '.<br>' + step3(A);
      hints = ['Clear the bracket first: square the number and double each exponent (keep the signs).', 'Then subtract the exponents of each base (subtracting a negative adds). Finish with positive exponents.'];
    } else { // (k a^{-p} b^q)^{-2} · a^s / b^u
      var h = find(function () { return { k: r.pick([1, 1, 2, 3]), p: r.int(1, 3), q: r.int(1, 3), s: r.int(1, 4), u: r.int(1, 5) }; }, function (h) { return -2 * h.q - h.u !== 0; });
      var In = M(h.k, [[a, -h.p], [b, h.q]]), Pw2 = mpow(In, -2); A = mmul(Pw2, M(1, [[a, h.s], [b, -h.u]]));
      prompt = br(termx(h.k, [[a, -h.p], [b, h.q]])) + '^{-2}\\times\\dfrac{' + pw(a, h.s) + '}{' + pw(b, h.u) + '}';
      kn = kmono([h.k > 1 ? [M(h.k * h.k, A.v), 'coef-pos-power', t(h.k + '^{-2}=\\frac{1}{' + h.k * h.k + '}') + ': the ' + t(h.k * h.k) + ' goes in the <b>denominator</b>.'] : null,
        h.k > 1 ? [M(Q(1, h.k), A.v), 'coef-not-raised', 'The outside exponent applies to the ' + t(h.k) + ' too: ' + t(h.k + '^{-2}=\\frac{1}{' + h.k * h.k + '}') + '.'] : null,
        [M(Q(1, h.k * h.k), [[a, -2 * h.p + h.s], [b, 2 * h.q - h.u]]), 'sign-exp', 'Multiply each exponent by ' + t(-2) + ': ' + t('(-' + h.p + ')\\times(-2)=' + 2 * h.p) + ' and ' + t(h.q + '\\times(-2)=-' + 2 * h.q) + '.'],
        [M(Q(1, h.k * h.k), [[a, -h.p - 2 + h.s], [b, h.q - 2 - h.u]]), 'add-exp', 'A power of a power: <b>multiply</b> the exponents by ' + t(-2) + ', don’t add.'],
        [minv(A), 'recip', 'The outside exponent is <b>negative</b>: multiply every exponent in the bracket by ' + t(-2) + '.']], posTex(A));
      sol = '1. Brackets: every factor gets the exponent ' + t(-2) + ': ' + t(br(termx(h.k, [[a, -h.p], [b, h.q]])) + '^{-2}=' + (h.k > 1 ? h.k + '^{-2}' : '') + a + '^{' + 2 * h.p + '}' + b + '^{-' + 2 * h.q + '}') + '.<br>2. Combine with ' + t('\\dfrac{' + pw(a, h.s) + '}{' + pw(b, h.u) + '}=' + pw(a, h.s) + pwx(b, -h.u)) + ': ' + t((h.k > 1 ? h.k + '^{-2}' : '') + a + '^{' + 2 * h.p + '+' + h.s + '}' + b + '^{-' + 2 * h.q + '+(-' + h.u + ')}=' + rawTex(A)) + '.<br>' + step3(A);
      hints = ['Clear the bracket first: multiply every exponent by ' + t(-2) + (h.k > 1 ? ', and ' + t(h.k + '^{-2}=\\frac{1}{' + h.k * h.k + '}') : '') + '.', 'Then add the exponents of each base. Finish with positive exponents.'];
    }
    return XP(t(prompt), posTex(A), {}, sol, hints, 'simplify ' + prompt, kn);
  }

  /* Q14: a missing exponent (Lesson 1 #11, Lesson 2 #10–11, Extra Practice 7 #14) */
  function q14(r) {
    var x = r.pick(['x', 'a', 'b', 'c', 'm', 'p', 'y', 'w']), kind = r.pick(['quotneg', 'powprod', 'powquot']), n0, pr, sol, cands, hints;
    if (kind === 'quotneg') {
      n0 = r.int(2, 9); var c = r.int(2, 6), d = n0 + c;
      pr = '\\dfrac{' + x + '^{n}}{' + pwx(x, -c) + '}=' + pw(x, d);
      cands = [[d + c, 'u2t-n-sign', 'Dividing by ' + t(pwx(x, -c)) + ' <b>adds</b> ' + t(c) + ' to the exponent: ' + t('n-(-' + c + ')=n+' + c) + '.'], [-(d - c), 'sign', 'Check the sign of your answer.'], [d, 'value', null]];
      sol = 'Quotient law: ' + t('\\dfrac{' + x + '^{n}}{' + pwx(x, -c) + '}=' + x + '^{n-(-' + c + ')}=' + x + '^{n+' + c + '}') + '. So ' + t('n+' + c + '=' + d) + ' and ' + t('n=' + n0) + '.<br>Check: ' + t(n0 + '-(-' + c + ')=' + d) + '.';
      hints = ['Dividing powers of the same base subtracts the exponents: ' + t('n-(-' + c + ')') + '.', 'Subtracting a negative adds. Then ask: what plus ' + t(c) + ' makes ' + t(d) + '?'];
    } else if (kind === 'powprod') {
      n0 = r.int(2, 6); var k = r.int(2, 4), c2 = r.int(1, 5), d2 = k * n0 + c2;
      pr = '\\left(' + x + '^{n}\\right)^{' + k + '}\\times ' + pw(x, c2) + '=' + pw(x, d2);
      cands = [[d2 - c2, 'u2t-n-nodiv', 'You found ' + t(k + 'n=' + (d2 - c2)) + '. Now divide by ' + t(k) + ' to find ' + t('n') + '.'], (d2 + c2) % k === 0 ? [(d2 + c2) / k, 'u2t-n-sign', 'Multiplying adds ' + t(c2) + ' to the exponent, so <b>subtract</b> ' + t(c2) + ' from ' + t(d2) + ' first.'] : null, d2 - c2 - k > 0 ? [d2 - c2 - k, 'add-exp', 'A power of a power <b>multiplies</b> the exponents: ' + t('\\left(' + x + '^{n}\\right)^{' + k + '}=' + x + '^{' + k + 'n}') + '.'] : null].filter(Boolean);
      sol = 'Power of a power, then the product law: ' + t('\\left(' + x + '^{n}\\right)^{' + k + '}\\times ' + pw(x, c2) + '=' + x + '^{' + k + 'n+' + c2 + '}') + '. So ' + t(k + 'n+' + c2 + '=' + d2) + ', ' + t(k + 'n=' + (d2 - c2)) + ' and ' + t('n=' + n0) + '.<br>Check: ' + t(k + '\\times ' + n0 + '+' + c2 + '=' + d2) + '.';
      hints = ['Write the left side as a single power of ' + t(x) + ': the bracket multiplies the exponent by ' + t(k) + ', then add ' + t(c2) + '.', 'Set the exponents equal and work backwards: undo the ' + t('+' + c2) + ', then undo the ' + t('\\times ' + k) + '.'];
    } else {
      n0 = r.int(2, 6); var k3 = r.int(2, 4), c3 = r.int(1, 6), d3 = k3 * n0 - c3;
      if (d3 < 2) { c3 = 1; d3 = k3 * n0 - 1; }
      pr = '\\dfrac{\\left(' + x + '^{' + k3 + '}\\right)^{n}}{' + pw(x, c3) + '}=' + pw(x, d3);
      cands = [[d3 + c3, 'u2t-n-nodiv', 'You found ' + t(k3 + 'n=' + (d3 + c3)) + '. Now divide by ' + t(k3) + ' to find ' + t('n') + '.'], (d3 - c3) % k3 === 0 && d3 - c3 > 0 ? [(d3 - c3) / k3, 'u2t-n-sign', 'Dividing subtracts ' + t(c3) + ', so to work backwards <b>add</b> ' + t(c3) + ' to ' + t(d3) + '.'] : null, d3 + c3 - k3 > 0 ? [d3 + c3 - k3, 'add-exp', 'A power of a power <b>multiplies</b> the exponents: ' + t('\\left(' + x + '^{' + k3 + '}\\right)^{n}=' + x + '^{' + k3 + 'n}') + '.'] : null].filter(Boolean);
      sol = 'Power of a power, then the quotient law: ' + t('\\dfrac{\\left(' + x + '^{' + k3 + '}\\right)^{n}}{' + pw(x, c3) + '}=' + x + '^{' + k3 + 'n-' + c3 + '}') + '. So ' + t(k3 + 'n-' + c3 + '=' + d3) + ', ' + t(k3 + 'n=' + (d3 + c3)) + ' and ' + t('n=' + n0) + '.<br>Check: ' + t(k3 + '\\times ' + n0 + '-' + c3 + '=' + d3) + '.';
      hints = ['Write the left side as a single power of ' + t(x) + ': the bracket multiplies the exponent, ' + t(k3 + 'n') + ', then subtract ' + t(c3) + '.', 'Set the exponents equal and work backwards: undo the ' + t('-' + c3) + ', then undo the ' + t('\\times ' + k3) + '.'];
    }
    return INT('Find the value of ' + t('n') + ' that makes the statement true: ' + t(pr), n0, cands.filter(function (c) { return c[1] !== 'value'; }), sol, hints, 'missing exponent ' + pr, { before: t('n=') });
  }

  /* Q15: find the error (Extra Practice 7 #12–13, Lesson 6 #11) */
  function q15Shared(r) {
    return find(function () { return { who: r.pick(['Deven', 'Priya', 'Kalvin', 'Maya', 'Jamal', 'Ava', 'Leo', 'Sana']), x: r.pick(['x', 'a', 'm', 'y', 'k', 'n']), k: r.int(2, 5), p: r.int(1, 3), q: r.int(2, 6), c: r.int(2, 9), err: r.pick(['coef', 'signexp', 'mult', 'recip']) }; },
      function (g) { return cop(g.c, g.k) && 2 * g.p * g.q !== 2 * g.p + g.q && g.q !== 2 * g.p && g.c * g.k * g.k <= 150; });
  }
  function q15Lines(g) {
    var x = g.x, k = g.k, p = g.p, q = g.q, c = g.c, K2 = k * k, E = 2 * p + q, L = {};
    L.orig = br(k + pwx(x, -p)) + '^{-2}\\times ' + c + pw(x, q);
    L.right = M(Q(c, K2), [[x, E]]);
    if (g.err === 'coef') { L.l1 = k + pw(x, 2 * p); L.l2 = c + '\\times ' + k + pw(x, E); L.final = M(c * k, [[x, E]]); }
    else if (g.err === 'signexp') { L.l1 = k + '^{-2}' + pwx(x, -2 * p); L.l2 = c + '\\times ' + k + '^{-2}' + (q - 2 * p < 0 ? pwx : pw)(x, q - 2 * p); L.final = M(Q(c, K2), [[x, q - 2 * p]]); }
    else if (g.err === 'mult') { L.l1 = k + '^{-2}' + pw(x, 2 * p); L.l2 = c + '\\times ' + k + '^{-2}' + pw(x, 2 * p * q); L.final = M(Q(c, K2), [[x, 2 * p * q]]); }
    else { L.l1 = k + '^{-2}' + pw(x, 2 * p); L.l2 = c + '\\times ' + k + '^{-2}' + pw(x, E); L.final = M(c * K2, [[x, E]]); }
    L.l3 = posTex(L.final);
    return L;
  }
  function q15Stem(g) {
    var L = q15Lines(g);
    return g.who + ' simplified ' + t(L.orig) + ' like this. Exactly <b>one</b> step is wrong.\\[\\begin{array}{ll}\\text{Step 1:} & ' + br(g.k + pwx(g.x, -g.p)) + '^{-2}=' + L.l1 + '\\\\[4pt]\\text{Step 2:} & ' + L.l1 + '\\times ' + g.c + pw(g.x, g.q) + '=' + L.l2 + '\\\\[4pt]\\text{Step 3:} & =' + L.l3 + '\\end{array}\\]';
  }

  /* Q11b: “how many fit” in scientific notation (Lesson 10 Example 8b and #20) */
  var Q17CTX = [
    { what: 'A dust mite is about', unit: 'm long', obj: 'dust mites', act: 'laid end to end', span: 'span', aa: [2, 3, 4], kk: [4] },
    { what: 'A grain of pollen is about', unit: 'm across', obj: 'grains of pollen', act: 'lined up side by side', span: 'stretch across', aa: [2, 4, 5], kk: [5] },
    { what: 'A red blood cell is about', unit: 'm wide', obj: 'red blood cells', act: 'lined up side by side', span: 'stretch across', aa: [7, 8], kk: [6] },
    { what: 'A bacterium is about', unit: 'm long', obj: 'bacteria', act: 'laid end to end', span: 'span', aa: [2, 4, 5], kk: [6] },
    { what: 'A human hair is about', unit: 'm wide', obj: 'hairs', act: 'lined up side by side', span: 'cover', aa: [6, 8], kk: [5] },
    { what: 'A grain of fine sand is about', unit: 'm across', obj: 'grains of sand', act: 'lined up in a row', span: 'stretch across', aa: [2, 4, 5], kk: [4] }];
  function q17Shared(r) {
    var c = r.pick(Q17CTX);
    return find(function () { var a = r.pick(c.aa), k = r.pick(c.kk), m = r.int(1, 9), j = r.int(2, 4); return { c: c, a: a, k: k, m: m, j: j, N: m * Math.pow(10, j), Lm: a * m, Le: j - k }; },
      function (g) { var L = g.Lm * Math.pow(10, g.Le); return L >= 0.01 && L <= 5 && g.Lm % 10 !== 0; });
  }

  function q11Fit(r, g) {
          var Lstr = decStr(g.Lm, g.Le), Ls = sciT(g.Lm, g.Le), Lcoef = sciCoef(g.Lm), Lexp = sciExp(g.Lm, g.Le), N = g.N, s = sciTx(String(g.a), -g.k);
          var Nsci = K.sciTex(N), size = g.a * Math.pow(10, -g.k), L = Number(Lstr);
          var chk = K.value(N, { diag: function (v) {
            if (near(v, L * size)) return { code: 'u2t-multiplied', hint: '“How many fit” means <b>divide</b> the total length by the length of one.' };
            if (near(v, size / L)) return { code: 'u2t-multiplied', hint: 'Divide the total length by the length of <b>one</b>: total ÷ one.' };
            var lg = pow10Of(v, N); if (lg != null && lg !== 0) return { code: Math.abs(lg) === 1 ? 'u2t-sci-place' : 'u2t-sci-sign', hint: 'The digits are right, but the power of ' + t(10) + ' is off. Subtracting a negative exponent <b>adds</b> it.' };
            return null; } });
          var p = P.math(g.c.what + ' ' + t(sciTx(String(g.a), -g.k)) + ' ' + g.c.unit + '. About how many ' + g.c.obj + ', ' + g.c.act + ', would ' + g.c.span + ' ' + t(F(L)) + ' m? Give a whole number (or scientific notation).', chk, String(N),
            'Divide the total length by the length of one. Write ' + t(F(L) + '=' + Ls) + ':<br>' + t('\\dfrac{' + Ls + '}{' + s + '}=\\left(' + Lcoef + '\\div ' + g.a + '\\right)\\times 10^{' + Lexp + '-(-' + g.k + ')}=' + sciTx(decimalOf(Number(Lcoef) / g.a), Lexp + g.k) + (Number(Lcoef) / g.a < 1 ? '=' + Nsci : '') + '=' + F(N)) + ' ' + g.c.obj + '.',
            ['How many fit: divide the total length by the length of one.', 'Write ' + t(F(L)) + ' in scientific notation first, then divide the numbers and subtract the exponents (subtracting a negative adds).'], 'how many ' + g.c.obj + ' in ' + Lstr + ' m', { keys: 'sci' });
          p.answer = t(F(N)) + ' (' + t(Nsci) + ')';
          p.bad = [String(N * 10), String(N / 10), K.sciTex(L * size)];
          return p;
  }

  HW.defineTest({
    id: 'u2test', unit: 2, title: 'Unit 2 Test', outcome: 'AN3', calc: false,
    blurb: 'The Unit 2 outcomes-based test on AN3 (exponents): powers and the exponent laws, zero and negative exponents, scientific notation, and rational exponents and radicals — in Beginning, Progressing and Mastery boxes. No calculator.',
    // Short version (~half): one item per law at Beginning (laws, zero, negative, scientific notation), negative and rational exponents at Progressing, the find-the-error and rational-exponent Mastery items; drops the bracket powers (Q1, Q4 covers the sign), (ab)^n / rational Beginning items (Q3, Q7: Q9b and Q12 test them), the near-duplicate laws set (Q8), evaluating (Q10), scientific-notation products (Q11), Q13 and the missing exponent (Q14).
    short: ['2', '4', '5', '6', '9', '12', '15', '16'],
    questions: [
      /* ======================= Beginning ======================= */
      { num: '1', outcome: 'AN3', stem: 'Powers. Pay close attention to the brackets.',
        shared: function (r) { var bn = r.pick(Q1PAIRS); return { b: bn[0], n: bn[1], minusFirst: r.chance(0.5) }; },
        parts: [
          { id: '1a', outcome: 'AN3', level: 'BEG', make: function (r, s) { var p = q1Pair(s, s.minusFirst ? 'minus' : 'brk'); p.prompt = 'Evaluate without a calculator: ' + p.prompt; return p; } },
          { id: '1b', outcome: 'AN3', level: 'BEG', make: function (r, s) { var p = q1Pair(s, s.minusFirst ? 'brk' : 'minus'); p.prompt = 'Evaluate without a calculator: ' + p.prompt; return p; } },
          { id: '1c', outcome: 'AN3', level: 'BEG', make: function (r) { return q1Vocab(r); } }] },
      { num: '2', outcome: 'AN3', stem: 'Use the exponent laws to simplify.', shared: function (r) { return { kinds: r.shuffle(['prodc', 'quotc', 'pow']), vs: r.sample(LET, 3) }; },
        parts: [0, 1, 2].map(function (i) { return { id: '2' + 'abc'[i], outcome: 'AN3', level: 'BEG', make: function (r, s) { return q2Part(r, s.kinds[i], s.vs[i]); } }; }) },
      { num: '3', outcome: 'AN3', stem: 'Simplify.', parts: [
        { id: '3a', outcome: 'AN3', level: 'BEG', make: function (r) { return q3Prod(r); } },
        { id: '3b', outcome: 'AN3', level: 'BEG', make: function (r) { return q3Quot(r); } }] },
      { num: '4', outcome: 'AN3', shared: function (r) { return { kind: r.pick(['coef', 'neg']), c: r.int(2, 12), g: r.pick(['g', 'x', 'y', 'm', 'k', 'w']), flip: r.chance(0.5) }; },
        stem: function (s) { return 'Evaluate without a calculator.' + (s.kind === 'coef' ? ' Assume ' + t(s.g + '\\neq 0') + '.' : ''); },
        parts: [
          { id: '4a', outcome: 'AN3', level: 'BEG', make: function (r, s) { return q4Part(s, s.flip ? 1 : 0); } },
          { id: '4b', outcome: 'AN3', level: 'BEG', make: function (r, s) { return q4Part(s, s.flip ? 0 : 1); } }] },
      { num: '5', outcome: 'AN3', stem: 'Negative exponents.', parts: [
        { id: '5a', outcome: 'AN3', level: 'BEG', make: function (r) { var p = q5Eval(r); p.prompt = 'Evaluate without a calculator: ' + p.prompt; return p; } },
        { id: '5b', outcome: 'AN3', level: 'BEG', make: function (r) { var p = q5Pos(r); p.prompt = 'Write with a positive exponent: ' + p.prompt; return p; } }] },
      { num: '6', outcome: 'AN3', stem: 'Scientific notation.', shared: function (r) { return { big: r.chance(0.5) }; }, parts: [
        { id: '6a', outcome: 'AN3', level: 'BEG', make: function (r, s) { return q6ToSci(r, s.big); } },
        { id: '6b', outcome: 'AN3', level: 'BEG', make: function (r, s) { return q6ToStd(r, !s.big); } }] },
      { num: '7', outcome: 'AN3', stem: 'Rational exponents.', parts: [
        { id: '7a', outcome: 'AN3', level: 'BEG', make: function (r) { var g = r.pick(Q7ROOT), p = EV({ base: [g[0], 1], m: 1, n: g[1] }); p.prompt = 'Evaluate without a calculator: ' + p.prompt; return p; } },
        { id: '7b', outcome: 'AN3', level: 'BEG', make: function (r) { var p = q7Rad(r); p.prompt = 'Write in radical form: ' + p.prompt; return p; } }] },

      /* ======================= Progressing ======================= */
      { num: '8', outcome: 'AN3', stem: 'Simplify fully.', parts: [
        { id: '8a', outcome: 'AN3', level: 'PRG', make: function (r) { return q8a(r); } },
        { id: '8b', outcome: 'AN3', level: 'PRG', make: function (r) { return q8b(r); } },
        { id: '8c', outcome: 'AN3', level: 'PRG', make: function (r) { return q8c(r); } }] },
      { num: '9', outcome: 'AN3', stem: 'Simplify. Write each answer with positive exponents.', parts: [
        { id: '9a', outcome: 'AN3', level: 'PRG', make: function (r) { return q9a(r); } },
        { id: '9b', outcome: 'AN3', level: 'PRG', make: function (r) { return q9b(r); } },
        { id: '9c', outcome: 'AN3', level: 'PRG', make: function (r) { return q9c(r); } }] },
      { num: '10', outcome: 'AN3', stem: 'Evaluate without a calculator. Give each answer as a whole number or a fraction.', parts: [
        { id: '10a', outcome: 'AN3', level: 'PRG', make: function (r) { return q10a(r); } },
        { id: '10b', outcome: 'AN3', level: 'PRG', make: function (r) { return q10b(r); } }] },
      { num: '11', outcome: 'AN3', stem: 'Scientific notation.', parts: [
        { id: '11a', outcome: 'AN3', level: 'PRG', make: function (r) { return q11Mul(r); } },
        { id: '11b', outcome: 'AN3', level: 'PRG', make: function (r) { return q11Fit(r, q17Shared(r)); } }] },
      { num: '12', outcome: 'AN3', stem: 'Rational exponents and radicals.', parts: [
        { id: '12a', outcome: 'AN3', level: 'PRG', make: function (r) { var p = q12Eval(r); p.prompt = 'Evaluate without a calculator: ' + p.prompt; return p; } },
        { id: '12b', outcome: 'AN3', level: 'PRG', make: function (r) { var p = q12ToRad(r); p.prompt = 'Write in radical form: ' + p.prompt; return p; } },
        { id: '12c', outcome: 'AN3', level: 'PRG', make: function (r) { var p = q12ToPow(r); p.prompt = 'Write as a power with a rational exponent: ' + p.prompt; return p; } }] },

      /* ======================= Mastery ======================= */
      { num: '13', outcome: 'AN3', stem: 'Simplify fully. Write each answer with positive exponents. Assume no variable is 0.', parts: [
        { id: '13a', outcome: 'AN3', level: 'MAS', make: function (r) { return q13a(r); } },
        { id: '13b', outcome: 'AN3', level: 'MAS', make: function (r) { return q13b(r); } }] },
      { num: '14', outcome: 'AN3', parts: [
        { id: '14', outcome: 'AN3', level: 'MAS', make: function (r) { return q14(r); } }] },
      { num: '15', outcome: 'AN3', shared: q15Shared, stem: q15Stem, parts: [
        { id: '15a', outcome: 'AN3', level: 'MAS', make: function (r, g) {
          var x = g.x, k = g.k, p = g.p, q = g.q, c = g.c, K2 = k * k, E = 2 * p + q;
          var all = {
            coef: { value: 'coef', html: 'Step 1: the ' + t(k) + ' in the bracket was not raised to the power ' + t(-2) + '. The outside exponent applies to <b>every</b> factor.', why: 'Step 1 does raise the ' + t(k) + ' to the power ' + t(-2) + ': ' + t(k + '^{-2}') + ' is there.' },
            signexp: { value: 'signexp', html: 'Step 1: the exponent of ' + t(x) + ' has the wrong sign. ' + t('(-' + p + ')\\times(-2)') + ' is <b>positive</b>.', why: 'Step 1 is right about ' + t(x) + ': ' + t('(-' + p + ')\\times(-2)=' + 2 * p) + ', so ' + t(pw(x, 2 * p)) + ' is correct.' },
            mult: { value: 'mult', html: 'Step 2: the exponents of ' + t(x) + ' were <b>multiplied</b>; when you multiply powers you add the exponents.', why: 'Step 2 adds the exponents of ' + t(x) + ', which is right when multiplying powers.' },
            recip: { value: 'recip', html: 'Step 3: ' + t(k + '^{-2}') + ' is ' + t('\\frac{1}{' + K2 + '}') + ', so the ' + t(K2) + ' belongs in the <b>denominator</b>.', why: 'Step 3 does put ' + t(K2) + ' in the denominator, which is right: ' + t(k + '^{-2}=\\frac{1}{' + K2 + '}') + '.' },
            coefadd: { value: 'coefadd', html: 'Step 3: the numbers ' + t(c) + ' and ' + t(k) + ' should have been <b>added</b>.', why: 'Numbers in front <b>multiply</b> when you multiply terms, so ' + t(c + '\\times ' + k + '=' + c * k) + ' is right.' } };
          var keys = ['coef', 'signexp', 'mult', g.err === 'coef' ? 'coefadd' : 'recip'];
          if (keys.indexOf(g.err) < 0) keys[3] = g.err;
          var items = keys.map(function (kk) { var o = all[kk]; return { value: o.value, html: o.html, why: o.why, right: kk === g.err }; });
          var L = q15Lines(g);
          var fix = g.err === 'coef' ? 'Step 1: the ' + t(k) + ' must be raised to the power ' + t(-2) + ': ' + t(br(k + pwx(x, -p)) + '^{-2}=' + k + '^{-2}' + pw(x, 2 * p)) + '.'
            : g.err === 'signexp' ? 'Step 1: ' + t('(-' + p + ')\\times(-2)=+' + 2 * p) + ', so the bracket gives ' + t(k + '^{-2}' + pw(x, 2 * p)) + ', not ' + t(pwx(x, -2 * p)) + '.'
            : g.err === 'mult' ? 'Step 2: multiplying powers adds the exponents: ' + t(pw(x, 2 * p) + '\\times ' + pw(x, q) + '=' + pw(x, E)) + ', not ' + t(pw(x, 2 * p * q)) + '.'
            : 'Step 3: ' + t(k + '^{-2}=\\frac{1}{' + K2 + '}') + ', so ' + t(c + '\\times ' + k + '^{-2}' + pw(x, E) + '=\\frac{' + c + pw(x, E) + '}{' + K2 + '}') + ', not ' + t(L.l3) + '.';
          return selectPart(r, 'Select the statement that describes the error (only one of them is true).', items, fix + '<br>Correct answer: ' + t(L.orig + '=' + k + '^{-2}' + pw(x, 2 * p) + '\\times ' + c + pw(x, q) + '=' + posTex(L.right)),
            ['Redo each step yourself and compare: bracket first (every factor gets the exponent ' + t(-2) + '), then add the exponents, then positive exponents.', 'A negative exponent means reciprocal, and ' + t('(-a)\\times(-2)') + ' is positive.'], 'error in ' + L.orig);
        } },
        { id: '15b', outcome: 'AN3', level: 'MAS', make: function (r, g) {
          var x = g.x, k = g.k, p = g.p, q = g.q, c = g.c, K2 = k * k, E = 2 * p + q, L = q15Lines(g), tg = posTex(L.right);
          var kn = kmono([[L.final, 'u2t-repeat', 'That is ' + g.who + '’s answer. Fix the step that is wrong.'],
            g.err !== 'coef' ? [M(c * k, [[x, E]]), 'coef-not-raised', 'The ' + t(k) + ' in the bracket is raised to the power ' + t(-2) + ' too.'] : null,
            g.err !== 'recip' ? [M(c * K2, [[x, E]]), 'coef-pos-power', t(k + '^{-2}=\\frac{1}{' + K2 + '}') + ': the ' + t(K2) + ' goes in the <b>denominator</b>.'] : null,
            g.err !== 'mult' ? [M(Q(c, K2), [[x, 2 * p * q]]), 'mult-exp', 'Multiplying powers: <b>add</b> the exponents.'] : null,
            g.err !== 'signexp' ? [M(Q(c, K2), [[x, q - 2 * p]]), 'sign-exp', t('(-' + p + ')\\times(-2)') + ' is <b>positive</b>.'] : null], tg);
          return XP('Write the correct simplified answer for ' + t(L.orig) + ', with positive exponents.', tg, {}, t(L.orig + '=' + k + '^{-2}' + pw(x, 2 * p) + '\\times ' + c + pw(x, q) + '=' + c + '\\times ' + k + '^{-2}' + pw(x, E) + '=' + tg),
            ['Every factor in the bracket gets the exponent ' + t(-2) + ': ' + t(k + '^{-2}=\\frac{1}{' + K2 + '}') + ' and ' + t('(-' + p + ')\\times(-2)=' + 2 * p) + '.', 'Then add the exponents of ' + t(x) + ' and put the ' + t(K2) + ' in the denominator.'], 'correct ' + L.orig, kn);
        } }] },
      { num: '16', outcome: 'AN3', stem: 'Evaluate without a calculator. Give each answer as a whole number or a fraction.', parts: [
        { id: '16a', outcome: 'AN3', level: 'MAS', make: function (r) {
          var g = find(function () { var n = r.pick([2, 2, 3, 4]), a = r.int(1, n === 2 ? 9 : n === 3 ? 5 : 3), b = r.int(2, n === 2 ? 9 : n === 3 ? 5 : 3), m = r.pick([1, 1, 2, 3]); return { n: n, a: a, b: b, m: m, neg: r.chance(0.6) }; },
            function (g) { return g.a !== g.b && cop(g.a, g.b) && cop(g.m, g.n) && g.m !== g.n && Math.pow(Math.max(g.a, g.b), g.m) <= 125 && !(g.a === 1 && !g.neg); });
          var A = Math.pow(g.a, g.n), B = Math.pow(g.b, g.n), mm = g.neg ? -g.m : g.m, bt = '\\left(\\dfrac{' + A + '}{' + B + '}\\right)';
          var pre = g.neg ? 'A negative exponent flips the fraction: ' + t(bt + '^{' + expS(mm, g.n) + '}=\\left(\\dfrac{' + B + '}{' + A + '}\\right)^{' + expS(g.m, g.n) + '}=\\left(\\dfrac{' + rootT(g.n, B) + '}{' + rootT(g.n, A) + '}\\right)' + (g.m > 1 ? '^{' + g.m + '}' : '') + '=\\left(\\dfrac{' + g.b + '}{' + g.a + '}\\right)' + (g.m > 1 ? '^{' + g.m + '}' : '') + '=' + nT(Q(Math.pow(g.b, g.m), Math.pow(g.a, g.m)))) + '.'
            : null;
          return EV({ base: [A, B], m: mm, n: g.n, btex: bt, pre: pre || undefined });
        } },
        { id: '16b', outcome: 'AN3', level: 'MAS', make: function (r) {
          var g = find(function () { var n = r.pick([3, 3, 3, 5]), c = r.int(2, n === 3 ? 5 : 3), m = r.pick([1, 2, 2, -1, -2, -2, 4]); return { n: n, c: c, m: m }; },
            function (g) { return cop(Math.abs(g.m), g.n) && Math.pow(g.c, Math.abs(g.m)) <= 125 && !(g.m === 1 && g.c < 3); });
          return EV({ base: [-Math.pow(g.c, g.n), 1], m: g.m, n: g.n });
        } }] }
    ]
  });
})(window);
