/* Math 15 · Unit 1 · Lesson 7 — Simplifying Higher-Index Radicals (AN2)
 * Assignment 7 (u1_L07.tex, Questions 1–12) and the Lesson 7 Extra Practice (u1_EP07.tex, Questions 1–20), plus a
 * Mastery challenge at the end of the extra practice.
 * Every part is a generator: it keeps the booklet question's structure and difficulty (the booklet's own numbers are
 * among the possible values) and changes the numbers. Most helpers are copied from the Math 10C Unit 1 Lesson 8 file.
 * Conversions: "entire or mixed?" → a table of choices; "explain" → multiple choice whose options are reasons;
 * "write the prime factorization first, then simplify" → two boxes (product of primes, then the mixed radical);
 * "sort into two columns, then give the exact value" → a table, then number boxes.
 * Calculator: only where the booklet says so (Extra 7) or asks for a decimal edge length (Extra 16) — those hints say so.
 * Outcome AN2, except the parts that only evaluate a perfect power (a root of a whole number, Extra 4, 11(a), 12(b),
 * 13(a), 18): AN1. Levels (Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, nt = HW.nt, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = K.P;

  HW.addCodes({
    'neg-root': 'Lost the sign of an odd root of a negative', 'coef-lost': 'Forgot to multiply by the coefficient in front',
    'wrong-power': 'Took out a perfect square (or wrong power) instead of the index’s power', 'even-neg': 'Put a negative under an even root',
    'den-power': 'Raised only part of a fraction coefficient', 'rad-decimal': 'Decimal under the radical',
    'not-smallest': 'Works, but not the smallest', 'whole-number': 'Gave a perfect power (no radical left)', 'square-thinking': 'Used squares instead of cubes',
    'between-extra': 'Listed a value outside the range', 'between-missing': 'Missed some of the values',
    'u1l7-em': 'Mixed up entire and mixed radicals', 'u1l7-squared': 'Squared the coefficient instead of cubing it', 'u1l7-times-index': 'Multiplied by the index instead of raising to it',
    'u1l7-dec-place': 'Decimal point in the wrong place', 'u1l7-div-index': 'Divided by the index instead of taking the root', 'u1l7-real': 'Called a non-real root real (or the reverse)',
    'u1l7-pow': 'Raised to the wrong power when comparing', 'u1l7-lcm-index': 'Used the product of the indices, not the smallest common one',
    'u1l7-not-root': 'Gave the power instead of the root'
  });
  HW.addPartial({ 'u1l7-em': 'n', 'u1l7-squared': 'b', 'u1l7-times-index': 'n', 'u1l7-dec-place': 's', 'u1l7-div-index': 'n', 'u1l7-real': 'n', 'u1l7-pow': 'b',
    'u1l7-lcm-index': 'b', 'u1l7-not-root': 's' });

  /* ---------- small helpers ---------- */
  function Rq(c) { return typeof c === 'number' ? [c, 1] : c; }
  function rq(c) { c = Rq(c); return c[0] / c[1]; }
  function pw(a, n) { return Math.pow(a, n); }
  function rt(n, inner) { return ex.texRoot(n, inner); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  var POW = { 2: 'square', 3: 'cube', 4: 'fourth power', 5: 'fifth power', 6: 'sixth power', 7: 'seventh power' };
  var ROOT = { 2: 'square root', 3: 'cube root', 4: 'fourth root', 5: 'fifth root', 6: 'sixth root', 7: 'seventh root' };
  /* the booklet's "keep these handy" lists */
  var LIST = { 2: '4,\\ 9,\\ 16,\\ 25,\\ 36,\\ 49,\\ 64,\\ 81,\\ 100,\\ 121,\\ 144', 3: '8,\\ 27,\\ 64,\\ 125,\\ 216,\\ 343,\\ 512,\\ 729,\\ 1\\,000',
    4: '16,\\ 81,\\ 256,\\ 625', 5: '32,\\ 243,\\ 1\\,024' };
  function nth(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n + 'th'; }
  function coefTex(k) { k = Rq(k); if (k[1] === 1) return k[0] === 1 ? '' : k[0] === -1 ? '-' : String(k[0]); return (k[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(k[0]) + '}{' + k[1] + '}'; }
  function given(c, n, R) { return coefTex(c) + rt(n, F(R)); }
  function mixTex(k, n, m) { return m === 1 ? ex.texRat(Rq(k)) : coefTex(k) + rt(n, F(m)); }
  function ratTex(r) { return ex.texRat(Rq(r)); }
  function d2(x) { return K.roundTo(x, 2).toFixed(2); }
  /* every radicand f^n·t (f from fs, lo ≤ t ≤ hi, R ≤ cap) whose largest perfect nth-power factor is exactly f^n */
  function pool(n, fs, lo, hi, cap) {
    var o = [];
    fs.forEach(function (f) { for (var tt = Math.max(2, lo); tt <= hi; tt++) { var R = pw(f, n) * tt; if ((!cap || R <= cap) && ex.nthFactor(R, n) === f && o.indexOf(R) < 0) o.push(R); } });
    return o;
  }
  /* numbers lo..hi with no perfect nth-power factor (the "m" left under a simplest radical) */
  function free(n, lo, hi) { return range(Math.max(2, lo), hi).filter(function (m) { return ex.simplest(m, n); }); }
  /* pick, but sometimes the booklet's own value */
  function pickB(r, arr, book) { return book != null && arr.indexOf(book) >= 0 && r.chance(0.12) ? book : r.pick(arr); }
  function hintsFor(n, A) {
    return ['Find the largest perfect ' + POW[n] + ' that divides ' + t(F(A)) + '. Perfect ' + POW[n] + 's: ' + t(LIST[n] + ',\\ \\ldots'),
      'Write ' + t(F(A)) + ' as (perfect ' + POW[n] + ') ' + t('\\times') + ' (what’s left). The ' + ROOT[n] + ' of the perfect ' + POW[n] + ' comes out in front.'];
  }

  /* ---------- "convert to a mixed radical" (from Math 10C u1l8) ----------
   * question c·ⁿ√R, answer k·ⁿ√m with |R| = f^n·m. The diagnoses run before K.radical's own checks. */
  function mixDiag(c, n, R, f, m, k) {
    var A = Math.abs(R), cA = Math.abs(rq(c)), V = rq(k) * pw(m, 1 / n), hasC = !(c[0] === 1 && c[1] === 1);
    return function (val, r) {
      if (R < 0 && ex.eq(val, -V)) return { code: 'neg-root', hint: 'Watch the sign: an odd root of a negative number is negative, e.g. ' + t(rt(n, '-' + pw(f, n)) + '=-' + f) + '.' };
      if (hasC && ex.eq(val, V / rq(c))) return { code: 'coef-lost', hint: 'You simplified ' + t(rt(n, F(R))) + ' correctly — now multiply by the ' + t(ratTex(c)) + ' in front.' };
      if (!r || r.n !== n) return null;
      var g = Math.abs(rq(r.k)) / cA;
      if (r.m === m && f > 1 && ex.eq(g, pw(f, n))) return { code: 'coef-power', hint: 'You found the right factor, but ' + t(F(pw(f, n))) + ' comes out of the ' + ROOT[n] + ' as ' + t(rt(n, F(pw(f, n))) + '=' + f) + ', not as ' + t(F(pw(f, n))) + '.' };
      if (Number.isInteger(Math.round(g * 1e9) / 1e9) && g > 1) {
        g = Math.round(g);
        for (var j = 2; j <= 5; j++) if (j !== n && pw(g, j) * r.m === A)
          return { code: 'wrong-power', hint: t(F(pw(g, j)) + '=' + g + '^{' + j + '}') + ' is a perfect ' + POW[j] + ', but this is a ' + ROOT[n] + ': ' + t(rt(n, F(pw(g, j))) + '\\neq ' + g) + '. Look for a perfect <b>' + POW[n] + '</b> factor instead.' };
        if (g * r.m === A) return { code: 'divided', hint: 'Check: ' + t(g + '\\times ' + F(r.m) + '=' + F(A)) + ', but a number in front of a ' + ROOT[n] + ' stands for its ' + POW[n] + ' inside. Look for a perfect ' + POW[n] + ' factor of ' + t(F(A)) + '.' };
      }
      return null;
    };
  }
  function mixPart(c, n, R, o) {
    o = o || {}; c = Rq(c);
    var A = Math.abs(R), f = ex.nthFactor(A, n), m = A / pw(f, n), sg = R < 0 ? -1 : 1, k = ex.norm(c[0] * sg * f, c[1]);
    var hasC = !(c[0] === 1 && c[1] === 1), inner = mixTex([sg * f, 1], n, m), key = mixTex(k, n, m);
    var sol = 'The largest perfect ' + POW[n] + ' that divides ' + t(F(A)) + ' is ' + t(F(pw(f, n)) + '=' + f + '^{' + n + '}') + ', because ' + t(F(A) + '=' + F(pw(f, n)) + '\\times ' + F(m)) + '.<br>';
    if (R < 0) sol += 'The index is odd, so the negative sign comes out of the root: ' + t(rt(n, F(R)) + '=-' + rt(n, F(A))) + '.<br>';
    sol += t(rt(n, F(R)) + '=' + (sg < 0 ? '-' : '') + rt(n, F(pw(f, n)) + '\\times ' + F(m)) + '=' + (sg < 0 ? '-' : '') + rt(n, F(pw(f, n))) + '\\times ' + rt(n, F(m)) + '=' + inner) + '.';
    if (hasC) sol += '<br>Multiply by the number in front: ' + t(ratTex(c) + '\\times ' + (sg < 0 ? '(-' + f + ')' : f) + '=' + ratTex(k)) + ', so ' + t(given(c, n, R) + '=' + key) + '.';
    var good = [], bad = [];
    if (n % 2 && k[0] < 0 && k[1] === 1) good.push((Math.abs(k[0]) === 1 ? '' : String(Math.abs(k[0]))) + rt(n, '-' + m));
    if (f > 1) bad.push(coefTex(ex.norm(c[0] * sg * pw(f, n), c[1])) + rt(n, F(m)));
    bad.push(mixTex(k, 2, m === 1 ? 2 : m));
    var p = P.math(o.prompt || t(given(c, n, R)), K.radical({ k: k, n: n, m: m }, 'mixed', { diag: mixDiag(c, n, R, f, m, k) }), key, sol, o.hints || hintsFor(n, A), o.text || 'mixed: ' + given(c, n, R), { keys: 'radical' });
    p.good = good; p.bad = bad; p.spec = { k: k, n: n, m: m, f: f };
    return p;
  }

  /* ---------- "convert to an entire radical" (from Math 10C u1l8) ---------- */
  function entireInfo(c, n, m) {
    c = Rq(c);
    var neg = c[0] < 0, A = ex.norm(pw(Math.abs(c[0]), n) * m, pw(c[1], n));
    var radT = ratTex(A), key = neg ? (n % 2 ? rt(n, '-' + (A[1] === 1 ? F(A[0]) : radT)) : '-' + rt(n, A[1] === 1 ? F(A[0]) : radT)) : rt(n, A[1] === 1 ? F(A[0]) : radT);
    return { c: c, n: n, m: m, neg: neg, A: A, key: key, radT: A[1] === 1 ? F(A[0]) : radT, V: (neg ? -1 : 1) * pw(A[0] / A[1], 1 / n) };
  }
  function entireCheck(c, n, m) {
    var I = entireInfo(c, n, m), cA = Math.abs(rq(I.c)), V = I.V, pAbs = Math.abs(I.c[0]), q = I.c[1];
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var node = a.ast; while (node.t === 'neg' || node.t === 'paren') node = node.a;
      var isRoot = node.t === 'root', idx = isRoot ? ex.rat(node.n) : null, rad = isRoot ? ex.rat(node.a) : null, ni = idx && idx[1] === 1 ? idx[0] : null;
      if (ex.eq(a.val, V)) {
        if (!isRoot || !rad) return form('not-entire', 'Right value, but an entire radical has nothing in front of the root. Move ' + t(ratTex(I.c[0] < 0 && n % 2 === 0 ? [pAbs, q] : I.c)) + ' inside: raise it to the power ' + t(n) + ' first.');
        if (ni !== n) return form('index', 'Right value, but keep the index ' + t(n) + ' (a ' + ROOT[n] + ').');
        if (ex.shape(node.a).decimals) return form('rad-decimal', 'Right value — write the number under the root as a whole number.');
        var pf = ex.plainFraction(node.a);
        if (!pf) return form('simplify', 'Right value — now multiply out what’s under the root so it is a single number.');
        if (pf[1] !== 1 && ex.gcd(pf[0], pf[1]) > 1) return form('lowest', 'Right value — reduce the fraction under the root to lowest terms.');
        return ok();
      }
      if (isRoot && ni && ni % 2 === 0 && rad && rad[0] < 0) return wrong('even-neg', 'With an even index the radicand can’t be negative: ' + t(rt(ni, '-' + Math.abs(rad[0]))) + ' is not a real number. A negative coefficient has to stay <b>outside</b> the root.');
      if (isRoot && ni === n && rad) {
        var rv = Math.abs(rad[0] / rad[1]);
        if (ex.eq(Math.abs(a.val), Math.abs(V))) return wrong('sign', I.neg ? (n % 2 ? 'Check the sign. The index is odd, so the negative goes inside with the coefficient: ' + t('(' + ratTex(I.c) + ')^{' + n + '}') + ' is negative' : 'Check the sign. The index is even, so the negative must stay outside: ' + t('-' + rt(n, '\\ldots'))) + '.' : 'Check the sign of your answer.');
        if (cA !== 1 && ex.eq(rv, cA * m)) return wrong('no-power', 'Before ' + t(ratTex([pAbs, q])) + ' moves inside, raise it to the power ' + t(n) + ': ' + t(ratTex([pAbs, q]) + '=' + rt(n, ratTex(ex.norm(pw(pAbs, n), pw(q, n))))) + '.');
        if (ex.eq(rv, pw(cA, n) + m)) return wrong('added', 'Multiply ' + t(ratTex(ex.norm(pw(pAbs, n), pw(q, n)))) + ' by ' + t(m) + ' — don’t add them.');
        if (q === 1 && cA > 1 && ex.eq(rv, cA * n * m)) return wrong('u1l7-times-index', t(pAbs + '^{' + n + '}') + ' means ' + t(Array(n + 1).join(pAbs + '\\times ').slice(0, -7)) + ', not ' + t(pAbs + '\\times ' + n) + '.');
        for (var j = 2; j <= 5; j++) if (j !== n && cA > 1 && ex.eq(rv, pw(cA, j) * m)) return wrong(j === 2 ? 'u1l7-squared' : 'wrong-power', 'The index is ' + t(n) + ', so the coefficient is raised to the power ' + t(n) + ' (not ' + t(j) + ') when it moves inside.');
      }
      if (isRoot && ni && ni !== n) return wrong('index', 'Keep the index: this is a ' + ROOT[n] + '.');
      return wrong('value', null);
    };
  }
  function entirePart(c, n, m, o) {
    o = o || {};
    var I = entireInfo(c, n, m), pAbs = Math.abs(I.c[0]), q = I.c[1], cAt = ratTex([pAbs, q]), powT = ratTex(ex.norm(pw(pAbs, n), pw(q, n)));
    var sol = '';
    if (I.neg && n % 2 === 0) sol += 'The index is even, so the negative sign must stay <b>outside</b> (an even root of a negative isn’t real). Move only ' + t(cAt) + ' inside.<br>' + t(cAt + '=' + rt(n, powT)) + ', so ' + t(given([pAbs, q], n, m) + '=' + rt(n, powT + '\\times ' + m) + '=' + rt(n, I.radT)) + '.<br>So ' + t(given(I.c, n, m) + '=' + I.key) + '.';
    else if (I.neg) sol += 'The index is odd, so the negative sign can go inside: ' + t('(' + ratTex(I.c) + ')^{' + n + '}=-' + powT) + '.<br>' + t(given(I.c, n, m) + '=' + rt(n, '(' + ratTex(I.c) + ')^{' + n + '}') + '\\times ' + rt(n, m) + '=' + rt(n, '-' + powT + '\\times ' + m) + '=' + I.key) + ' (or ' + t('-' + rt(n, I.radT)) + ').';
    else sol += 'Raise the number in front to the power ' + t(n) + ': ' + t(cAt + '^{' + n + '}=' + powT) + '.<br>' + t(given(I.c, n, m) + '=' + rt(n, cAt + '^{' + n + '}') + '\\times ' + rt(n, m) + '=' + rt(n, powT + '\\times ' + m) + '=' + I.key) + '.';
    var good = []; if (I.neg && n % 2) good.push('-' + rt(n, I.radT));
    var bad = [given(I.c, n, m), rt(n, String(Math.max(2, Math.round(pAbs * m / q))))];
    if (I.neg && n % 2 === 0) bad.push(rt(n, '-' + I.radT));
    var p = P.math(o.prompt || t(given(I.c, n, m)), entireCheck(I.c, n, m), I.key, sol,
      o.hints || ['Write the number in front as a ' + ROOT[n] + ': raise it to the power ' + t(n) + ' (the index). Then multiply the two numbers under the root.', n % 2 === 0 ? 'With an even index, a negative sign stays in front of the root.' : 'With an odd index, a negative sign can move inside the root: ' + t('(-2)^{' + n + '}=' + pw(-2, n)) + '.'],
      o.text || 'entire: ' + given(I.c, n, m), { keys: 'radical' });
    p.good = good; p.bad = bad; p.info = I;
    return p;
  }
  /* a product of primes typed in a box ("2^3 × 3" or "2x2x2x3") */
  function normX(s) { return String(s == null ? '' : s).replace(/(\d)\s*[xX]\s*(?=\d)/g, '$1*'); }
  function prodChk(n) {
    var c = K.product(n, 'either');
    return function (resp) {
      var s = normX(resp), pn = HW.parse.number(s);
      if (pn.ok && pn.value === n && !nt.isPrime(n)) return form('not-factored', 'Write ' + t(F(n)) + ' as a product of primes, like ' + t('2^{3}\\times 3') + '.');
      return c(s);
    };
  }
  /* "write the radicand as a product of primes, then simplify": two boxes */
  function factMixPart(n, R, o) {
    o = o || {};
    var A = Math.abs(R), mp = mixPart(1, n, R), fac = K.fac(A);
    var groups = nt.factor(A).map(function (pe) { var Q = Math.floor(pe[1] / n), Rm = pe[1] % n; return Q ? t(pe[0] + (pe[1] > 1 ? '^{' + pe[1] + '}' : '')) + ': ' + (Q === 1 ? 'one group of ' + n : Q + ' groups of ' + n) + ' → ' + t(pe[0] + (Q > 1 ? '^{' + Q + '}' : '')) + ' comes out' + (Rm ? ', ' + t(pe[0] + (Rm > 1 ? '^{' + Rm + '}' : '')) + ' stays inside' : '') : t(pe[0] + (pe[1] > 1 ? '^{' + pe[1] + '}' : '')) + ': fewer than ' + n + ', stays inside'; });
    var sol = t(F(A) + '=' + fac) + '.<br>With index ' + t(n) + ', a prime must appear ' + t(n) + ' times before one copy comes out:<br>' + groups.join('<br>') + '<br>' + mp.solution;
    var p = P.fields(o.prompt || t(rt(n, F(R))), [{ name: 'Prime factorization', label: 'Primes', before: t(F(A) + '='), mode: 'math', keys: 'expr', wide: true },
      { name: 'Simplest form', label: 'Simplest', before: t(rt(n, F(R)) + '='), mode: 'math', keys: 'expr', wide: true }],
      [prodChk(A), mp.check], [fac, mp.key], t(F(A) + '=' + fac) + '<br>' + t(rt(n, F(R)) + '=' + mp.key), sol,
      ['Divide ' + t(F(A)) + ' by small primes (2, 3, 5, 7, …) until only primes are left.', 'Index ' + t(n) + ': every group of ' + t(n) + ' equal primes comes out as <b>one</b> copy of that prime. Multiply what comes out; multiply what stays inside.'],
      o.text || 'primes then simplest: ' + rt(n, R));
    p.bad = [[fac, mp.bad[0]]];
    return p;
  }
  /* evaluate ⁿ√(±value) where the answer is a whole number or a decimal */
  function evalPart(n, ans, radTex, o) {
    o = o || {};
    var e = (o.outer || '') + rt(n, radTex), A = Math.abs(ans), radV = pw(A, n);
    return P.number(t(e), ans, function (v) {
      if (ex.eq(v, -ans) && ans !== 0) return { code: ans < 0 ? 'neg-root' : 'sign', hint: ans < 0 ? 'An odd root of a negative number is negative: check ' + t('(' + (-A) + ')^{' + n + '}') + '.' : 'Check the sign.' };
      if (!Number.isInteger(A) && (ex.eq(Math.abs(v), A * 10) || ex.eq(Math.abs(v), A / 10))) return { code: 'u1l7-dec-place', hint: 'Check the decimal point: ' + t(String(A) + '^{' + n + '}=' + String(K.roundTo(radV, 6))) + '. Count the decimal places.' };
      if (ex.eq(Math.abs(v), radV / n)) return { code: 'u1l7-div-index', hint: 'The ' + ROOT[n] + ' isn’t the number divided by ' + t(n) + '. Which number, multiplied by itself ' + t(n) + ' times, gives the radicand?' };
      return null;
    }, o.sol || ('Find the number whose ' + nth(n) + ' power is the radicand: ' + t('(' + ans + ')^{' + n + '}=' + String(K.roundTo(pw(ans, n), 6))) + ', so ' + t(e + '=' + ans) + '.'),
    o.hints || ['Which number, used as a factor ' + t(n) + ' times, gives the number under the root?', n % 2 ? 'The index is odd, so a negative radicand gives a negative root.' : 'Try the perfect ' + POW[n] + 's: ' + t(LIST[n] || '') + '.'], 'evaluate ' + e);
  }
  /* a number box whose answer may be calculator-rounded */
  function calcChk(x, dp) { return K.approx(x, dp); }

  /* ---------- Mastery: every whole number a with L < a·∛m < U (compare a³m with L³ and U³) — from Math 10C u1l8 ---------- */
  function betweenPart(r) {
    var o = null;
    for (var i = 0; i < 800 && !o; i++) {
      var m = r.pick([2, 3, 4, 5, 6, 7, 9, 10]), L = r.int(2, 6), U = r.int(L + 2, Math.min(L + 5, 9));
      var want = [], sqw = [];
      for (var a = 1; a * a * a * m < U * U * U; a++) if (a * a * a * m > L * L * L) want.push(a);
      for (var b = 1; b * b * m < U * U; b++) if (b * b * m > L * L) sqw.push(b);
      if (want.length < 2 || want.length > 4) continue;
      o = { m: m, L: L, U: U, want: want, sqw: sqw };
    }
    if (!o) o = { m: 2, L: 5, U: 9, want: [4, 5, 6, 7], sqw: [4, 5, 6] };
    var m = o.m, L = o.L, U = o.U, want = o.want, L3 = L * L * L, U3 = U * U * U, cr = function (x) { return '\\sqrt[3]{' + F(x) + '}'; };
    var expr = 'a\\sqrt[3]{' + m + '}';
    var lo = Math.max(1, want[0] - 1), hi = want[want.length - 1] + 1, rows = [];
    for (var k = lo; k <= hi; k++) {
      var v = k * k * k * m, inside = v > L3 && v < U3;
      rows.push(t(k + '\\sqrt[3]{' + m + '}=\\sqrt[3]{' + k + '^{3}\\times ' + m + '}=' + cr(v)) + (inside ? ' ✓' : v <= L3 ? ' — too small (' + t(F(v) + '\\le ' + F(L3)) + ')' : ' — too big (' + t(F(v) + '\\ge ' + F(U3)) + ')'));
    }
    var sameSet = function (A, B) { return A.length === B.length && A.every(function (x) { return B.indexOf(x) >= 0; }); };
    return { prompt: 'List <b>every</b> whole number ' + t('a') + ' for which ' + t(L + '<' + expr + '<' + U) + '.', input: { type: 'list' }, key: want, answer: t(K.listTex(want)),
      check: function (resp) {
        if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
        var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + t(resp[i]) + ' more than once.'); seen[resp[i]] = 1; }
        if (resp.some(function (x) { return x < 0 || x % 1; })) return form('whole', t('a') + ' is a whole number: ' + t('0, 1, 2, 3, \\ldots') + '.');
        if (sameSet(resp, want)) return ok();
        if (!sameSet(want, o.sqw) && sameSet(resp, o.sqw)) return wrong('square-thinking', 'Those would be right for a <b>square</b> root. This is a cube root: write ' + t('a\\sqrt[3]{' + m + '}=\\sqrt[3]{a^{3}\\times ' + m + '}') + ' and compare with ' + t(L + '=' + cr(L3)) + ' and ' + t(U + '=' + cr(U3)) + '.');
        var extra = resp.filter(function (x) { return want.indexOf(x) < 0; });
        if (extra.length) {
          var e = extra[0], v = e * e * e * m;
          return wrong('between-extra', t(e + '\\sqrt[3]{' + m + '}=' + cr(v)) + ', and ' + (v <= L3 ? t(F(v) + '\\le ' + F(L3)) + ', so it is <b>not more</b> than ' + t(L + '=' + cr(L3)) : t(F(v) + '\\ge ' + F(U3)) + ', so it is <b>not less</b> than ' + t(U + '=' + cr(U3))) + '.');
        }
        return wrong('between-missing', 'Every number you listed works, but you have ' + resp.length + ' of the ' + want.length + ' values. Test the whole numbers one at a time: ' + t('1, 2, 3, \\ldots') + '.');
      },
      solution: 'Write every number as an entire cube root: ' + t(L + '=\\sqrt[3]{' + L + '^{3}}=' + cr(L3)) + ', ' + t(U + '=\\sqrt[3]{' + U + '^{3}}=' + cr(U3)) + ' and ' + t(expr + '=\\sqrt[3]{a^{3}\\times ' + m + '}') + '.<br>So the radicand ' + t('a^{3}\\times ' + m) + ' must be between ' + t(F(L3)) + ' and ' + t(F(U3)) + '.<br>' + rows.join('<br>') + '<br>So ' + t('a=' + K.listTex(want)) + '.',
      hints: ['Write all three numbers as entire cube roots: ' + t(L + '=\\sqrt[3]{' + L + '^{3}}') + ' and ' + t(expr + '=\\sqrt[3]{a^{3}\\times ' + m + '}') + '.', 'Then compare the numbers under the roots: test ' + t('a=1, 2, 3, \\ldots') + ' until ' + t('a^{3}\\times ' + m) + ' passes ' + t(F(U3)) + '.'],
      text: 'whole a with ' + L + ' < a cbrt' + m + ' < ' + U, bad: [want.slice(1), want.concat([want[want.length - 1] + 1]), want[0] > 1 ? [want[0] - 1].concat(want) : want.slice(0, -1)] };
  }

  /* ---------- pools (computed once) ---------- */
  var P2 = pool(3, [2], 2, 31), P3 = pool(3, [3], 2, 25), P4a = pool(3, [2], 32, 63), P4b = pool(3, [4, 5, 6], 2, 15, 1000), P4d = pool(3, [3, 4, 5, 6, 7], 2, 6, 1100);
  var P7a = pool(4, [2], 2, 25), P7c = pool(5, [2], 2, 25), P9a = pool(3, [2], 11, 40), P9b = pool(3, [3], 5, 30);
  var CF = free(3, 2, 25), CF13 = free(3, 2, 13), F4 = free(4, 2, 20), F5 = free(5, 2, 20);
  function pairs(cs, ms, cap, n) { var o = []; cs.forEach(function (c) { ms.forEach(function (m) { if (!cap || pw(Math.abs(c), n || 3) * m <= cap) o.push([c, m]); }); }); return o; }

  HW.defineLesson({
    id: 'u1l7', unit: 1, num: '7', title: 'Simplifying Higher-Index Radicals', outcome: 'AN2',
    blurb: 'The Lesson 6 idea for cube roots and beyond: pull out the largest perfect cube (or 4th or 5th power), push a coefficient back inside by raising it to the index, and watch the sign.',
    questions: [
      { num: '1', section: 'Part A — Entire Cube Radicals to Mixed', stem: 'State whether each radical is an <b>entire</b> radical or a <b>mixed</b> radical.', parts: [
        { id: '1', level: 'BEG', make: function (r) {
          var kinds = r.pick([['E', 'M', 'E', 'M'], ['E', 'M', 'E', 'M'], ['M', 'E', 'M', 'E'], ['E', 'E', 'M', 'M'], ['M', 'E', 'E', 'M'], ['E', 'M', 'M', 'E']]), used = {}, rows = [], want = {}, by = {};
          var negAt = kinds.lastIndexOf('M');
          kinds.forEach(function (kd, i) {
            var tex, id = 'abcd'[i];
            for (var g = 0; g < 50; g++) {
              if (kd === 'E') tex = '\\sqrt[3]{' + r.pick(range(2, 60).filter(function (x) { return pw(Math.round(Math.cbrt(x)), 3) !== x; })) + '}';
              else tex = (i === negAt && r.chance(0.7) ? '-' : '') + r.int(2, 6) + '\\sqrt[3]{' + r.pick(CF13) + '}';
              if (!used[tex]) break;
            }
            used[tex] = 1; rows.push({ id: id, html: '(' + id + ') ' + t(tex), label: id }); want[id] = kd; by[id] = tex;
          });
          var p = P.grid('Is each radical entire or mixed?', rows, [{ id: 'E', html: 'Entire' }, { id: 'M', html: 'Mixed' }], want, { rowHead: 'Radical',
            why: function (id) { return { code: 'u1l7-em', hint: t(by[id]) + (want[id] === 'E' ? ' has only a number under the root sign and nothing in front of it, so it is <b>entire</b>.' : ' has a number multiplying the root from <b>outside</b>, so it is <b>mixed</b>.') }; } },
            rows.map(function (x) { return x.html + ': ' + (want[x.id] === 'E' ? 'entire — nothing in front of the root' : 'mixed — a coefficient in front of the root'); }).join('<br>'),
            ['<b>Entire</b>: the whole number sits under the root sign, e.g. ' + t('\\sqrt[3]{24}') + '. <b>Mixed</b>: a number multiplies the root from outside, e.g. ' + t('2\\sqrt[3]{3}') + '.'], 'entire or mixed (cube roots)');
          p.tries = 2;
          return p;
        } }] },
      { num: '2', stem: 'Convert each radical to a mixed radical in simplest form.', parts: ['a', 'b', 'c', 'd'].map(function (s, i) {
        return { id: '2' + s, level: 'BEG', make: function (r) { return mixPart(1, 3, pickB(r, P2, [16, 32, 104, 56][i])); } };
      }) },
      { num: '3', stem: 'Convert each radical to a mixed radical in simplest form.', parts: ['a', 'b', 'c', 'd'].map(function (s, i) {
        return { id: '3' + s, level: 'BEG', make: function (r) { return mixPart(1, 3, pickB(r, P3, [54, 81, 108, 297][i])); } };
      }) },
      { num: '4', stem: 'Convert each radical to a mixed radical in simplest form.', parts: [
        { id: '4a', level: 'EMG', make: function (r) { return mixPart(1, 3, pickB(r, P4a, 248)); } },
        { id: '4b', level: 'EMG', make: function (r) { return mixPart(1, 3, pickB(r, P4b, 448)); } },
        { id: '4c', level: 'EMG', make: function (r) { var R = r.chance(0.35) ? r.pick([81, 256, 625]) : pickB(r, P4b, 625); return mixPart(1, 3, R); } },
        { id: '4d', level: 'EMG', make: function (r) { return mixPart(-1, 3, pickB(r, P4d, 686)); } }] },
      { num: '5', section: 'Part B — Mixed Cube Radicals to Entire', stem: 'Convert each mixed radical to an entire radical.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { var cm = r.pick(pairs([2], CF)); if (r.chance(0.1)) cm = [2, 7]; return entirePart(cm[0], 3, cm[1]); } },
        { id: '5b', level: 'BEG', make: function (r) { var cm = r.pick(pairs([3], CF)); if (r.chance(0.1)) cm = [3, 4]; return entirePart(cm[0], 3, cm[1]); } },
        { id: '5c', level: 'BEG', make: function (r) { var cm = r.pick(pairs([4], CF)); if (r.chance(0.1)) cm = [4, 6]; return entirePart(cm[0], 3, cm[1]); } },
        { id: '5d', level: 'EMG', make: function (r) { var cm = r.pick(pairs([5], CF13).concat(pairs([4], free(3, 13, 25)))); if (r.chance(0.1)) cm = [5, 6]; return entirePart(cm[0], 3, cm[1]); } }] },
      { num: '6', stem: 'Convert each mixed radical to an entire radical. <i>Watch the sign carefully.</i>', parts: [
        { id: '6a', level: 'EMG', make: function (r) { var m = pickB(r, CF, 5); return entirePart(-2, 3, m); } },
        { id: '6b', level: 'EMG', make: function (r) { var m = pickB(r, CF, 9); return entirePart(-2, 3, m); } },
        { id: '6c', level: 'EMG', make: function (r) { var m = pickB(r, CF, 3); return entirePart(-3, 3, m); } },
        { id: '6d', level: 'EMG', make: function (r) { var cm = r.pick(pairs([-3], free(3, 5, 25)).concat(pairs([-4], CF13))); if (r.chance(0.1)) cm = [-3, 7]; return entirePart(cm[0], 3, cm[1]); } }] },
      { num: '7', section: 'Part C — Fourth and Fifth Roots', stem: 'Convert each radical to a mixed radical in simplest form.', parts: [
        { id: '7a', level: 'EMG', make: function (r) { var p = mixPart(1, 4, pickB(r, P7a, 48)); return p; } },
        { id: '7b', level: 'EMG', make: function (r) { return mixPart(1, 4, pickB(r, P7a.concat(pool(4, [3], 2, 4)), 80)); } },
        { id: '7c', level: 'EMG', make: function (r) { return mixPart(1, 5, pickB(r, P7c, 64)); } },
        { id: '7d', level: 'EMG', make: function (r) { return mixPart(1, 5, pickB(r, P7c.concat(pool(5, [3], 2, 4)), 160)); } }] },
      { num: '8', stem: 'Convert each mixed radical to an entire radical.', parts: [
        { id: '8a', level: 'EMG', make: function (r) { var cm = r.pick(pairs([2], F4).concat(pairs([3], [2, 3, 4, 5, 6]))); if (r.chance(0.1)) cm = [2, 4]; return entirePart(cm[0], 4, cm[1]); } },
        { id: '8b', level: 'EMG', make: function (r) { var cm = r.pick(pairs([2], F4).concat(pairs([3], [2, 3, 4, 5, 6]))); if (r.chance(0.1)) cm = [2, 6]; return entirePart(cm[0], 4, cm[1]); } },
        { id: '8c', level: 'EMG', make: function (r) { var cm = r.pick(pairs([2], F5).concat(pairs([3], [2, 3, 4]))); if (r.chance(0.1)) cm = [2, 4]; return entirePart(cm[0], 5, cm[1]); } },
        { id: '8d', level: 'EMG', make: function (r) { var cm = r.pick(pairs([2], F5).concat(pairs([3], [2, 3, 4]))); if (r.chance(0.1)) cm = [3, 2]; return entirePart(cm[0], 5, cm[1]); } }] },
      { num: '9', section: 'Part D — Both Directions and Review', stem: 'Convert each radical to the requested form, in simplest form.', parts: [
        { id: '9a', level: 'EMG', make: function (r) { var R = pickB(r, P9a, 152), p = mixPart(1, 3, R); p.prompt = t(rt(3, F(R))) + ' &nbsp;(mixed)'; return p; } },
        { id: '9b', level: 'EMG', make: function (r) { var R = pickB(r, P9b, 405), p = mixPart(1, 3, R); p.prompt = t(rt(3, F(R))) + ' &nbsp;(mixed)'; return p; } },
        { id: '9c', level: 'EMG', make: function (r) { var cm = r.pick(pairs([3, 4], free(3, 2, 12))); if (r.chance(0.1)) cm = [4, 4]; var p = entirePart(cm[0], 3, cm[1]); p.prompt = t(given(cm[0], 3, cm[1])) + ' &nbsp;(entire)'; return p; } },
        { id: '9d', level: 'PRG', make: function (r) { var cm = r.pick(pairs([-3, -4], free(3, 2, 12))); if (r.chance(0.1)) cm = [-4, 9]; var p = entirePart(cm[0], 3, cm[1]); p.prompt = t(given(cm[0], 3, cm[1])) + ' &nbsp;(entire)'; return p; } }] },
      { num: '10', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var c, m, opts;
          for (var g = 0; g < 100; g++) {
            c = r.pick([2, 3, 4, 5]); m = r.pick(free(3, 2, 25)); if (r.chance(0.08)) { c = 4; m = 20; }
            var vals = [pw(c, 3) * m, c * m, c * c * m, pw(c, 4) * m];
            if (vals.every(function (v, i) { return vals.indexOf(v) === i; }) && vals[3] < 20000) break;
          }
          var N = pw(c, 3) * m;
          opts = [{ html: t(rt(3, F(N))), right: true },
            { html: t(rt(3, F(c * m))), why: 'That multiplies ' + t(c + '\\times ' + m) + '. The ' + t(c) + ' has to be <b>cubed</b> before it moves inside: ' + t(c + '=' + rt(3, pw(c, 3))) + '.' },
            { html: t(rt(3, F(c * c * m))), why: 'That squares the ' + t(c) + ' (' + t(c + '^{2}=' + c * c) + '). For a cube root, <b>cube</b> it: ' + t(c + '^{3}=' + pw(c, 3)) + '.' },
            { html: t(rt(3, F(pw(c, 4) * m))), why: 'That uses ' + t(c + '^{4}=' + pw(c, 4)) + '. The index is ' + t(3) + ', so use ' + t(c + '^{3}=' + pw(c, 3)) + '.' }];
          return P.mc(r, t(c + '\\sqrt[3]{' + m + '}') + ' is equivalent to which entire radical?', opts,
            'Cube the number in front: ' + t(c + '^{3}=' + pw(c, 3)) + '.<br>' + t(c + '\\sqrt[3]{' + m + '}=\\sqrt[3]{' + pw(c, 3) + '}\\times\\sqrt[3]{' + m + '}=\\sqrt[3]{' + pw(c, 3) + '\\times ' + m + '}=' + rt(3, F(N))) + '.',
            ['Write ' + t(c) + ' as a cube root first: ' + t(c + '=\\sqrt[3]{?}') + '.'], 'MC entire of ' + c + 'cbrt' + m);
        } }] },
      { num: '11', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '11', level: 'PRG', make: function (r) {
          var c = r.pick([2, 2, 3, 4, 5]), m = r.pick(free(3, 2, c === 2 ? 60 : c === 3 ? 40 : 30)); if (r.chance(0.08)) { c = 2; m = 34; }
          var n = pw(c, 3) * m;
          return P.nr('The mixed radical ' + t(c + '\\sqrt[3]{' + m + '}') + ' can be written as the entire radical ' + t('\\sqrt[3]{n}') + '. The value of ' + t('n') + ' is ________.', n, function (v) {
            if (v === c * m) return { code: 'no-power', hint: 'Cube the ' + t(c) + ' before it moves inside: ' + t(c + '^{3}=' + pw(c, 3)) + '.' };
            if (v === c * c * m) return { code: 'u1l7-squared', hint: 'That squares the ' + t(c) + '. For a cube root, cube it: ' + t(c + '^{3}=' + pw(c, 3)) + '.' };
            if (v === pw(c, 3) + m) return { code: 'added', hint: 'Multiply ' + t(pw(c, 3)) + ' by ' + t(m) + ' — don’t add.' };
            if (v === 3 * c * m) return { code: 'u1l7-times-index', hint: t(c + '^{3}') + ' means ' + t(c + '\\times ' + c + '\\times ' + c) + ', not ' + t(c + '\\times 3') + '.' };
            return null;
          }, t(c + '\\sqrt[3]{' + m + '}=\\sqrt[3]{' + c + '^{3}}\\times\\sqrt[3]{' + m + '}=\\sqrt[3]{' + pw(c, 3) + '\\times ' + m + '}=\\sqrt[3]{' + n + '}') + ', so ' + t('n=' + n) + '.',
          ['Cube the number in front, then multiply by the number under the root.'], 'NR entire of ' + c + 'cbrt' + m);
        } }] },
      { num: '12', stem: function (sh) { return 'Consider ' + t(rt(sh.e, '-' + sh.R)) + ' and ' + t(rt(3, '-' + sh.R)) + '.'; },
        shared: function (r) {
          var R = r.chance(0.2) ? 16 : r.pick(pool(3, [2], 2, 13).concat(pool(3, [3], 2, 7), pool(3, [4], 2, 3)));
          return { R: R, e: r.pick([4, 4, 2, 6]) };
        },
        parts: [
          { id: '12a', level: 'EMG', make: function (r, sh) {
            var e = sh.e, R = sh.R, E = rt(e, '-' + R), C = rt(3, '-' + R);
            return P.mc(r, 'Why is ' + t(E) + ' <b>not</b> a real number, while ' + t(C) + ' can still be simplified?', [
              { html: 'The index ' + t(e) + ' is even, and no real number raised to an even power is negative. The index ' + t(3) + ' is odd, and a negative number cubed stays negative.', right: true },
              { html: t(E) + ' is a real number too: it equals ' + t('-' + rt(e, R)) + '.', why: 'Check: ' + t('(-' + rt(e, R) + ')^{' + e + '}') + ' is <b>positive</b> (an even power), not ' + t('-' + R) + '.' },
              { html: 'A negative number can never go under a root sign.', why: 'It can when the index is odd: ' + t('(-2)^{3}=-8') + ', so ' + t('\\sqrt[3]{-8}=-2') + '.' },
              { html: 'Neither one is a real number; ' + t(C) + ' is only simplified by dropping the negative sign.', why: t(C) + ' is real: an odd root of a negative number is negative. Dropping the sign changes its value.' }],
              'An <b>even</b> index needs a radicand that is not negative: any real number to an even power is positive or zero, so nothing real gives ' + t('-' + R) + '. An <b>odd</b> index allows a negative radicand: ' + t('(-2)^{3}=-8') + '.',
              ['Try it: what is ' + t('(-2)^{' + e + '}') + '? What is ' + t('(-2)^{3}') + '?'], 'why even root of negative is not real');
          } },
          { id: '12b', sub: 'b', level: 'EMG', make: function (r, sh) { var p = mixPart(1, 3, -sh.R); p.prompt = 'Write ' + t(rt(3, '-' + F(sh.R))) + ' as a mixed radical in simplest form.'; return p; } }] }
    ],
    extra: [
      { num: '1', section: 'Extra practice A — Hunting for the Perfect Power', stem: 'The radicands below are too large to guess at. Write each one as a product of primes first, then convert it to a mixed radical in simplest form.', parts: [
        { id: 'e1a', level: 'PRG', make: function (r) { return factMixPart(3, pickB(r, pool(3, [6, 10, 12], 2, 7, 2000).concat(pool(3, [4, 5], 8, 15, 2000)), 1080)); } },
        { id: 'e1b', level: 'PRG', make: function (r) { return factMixPart(3, -pickB(r, pool(3, [6, 10], 2, 5, 2500).concat(pool(3, [5, 8, 9], 2, 4, 3000), pool(3, [4], 10, 30), pool(3, [7], 2, 5)), 2000)); } },
        { id: 'e1c', level: 'PRG', make: function (r) { return factMixPart(3, pickB(r, pool(3, [7, 8, 9], 2, 5, 3700).concat(pool(3, [6], 4, 9), pool(3, [5], 8, 20)), 1372)); } }] },
      { num: '2', stem: 'Use prime factorization again, this time hunting for a perfect <b>fourth</b> power. With index ' + t('4') + ', a prime must appear <b>four</b> times before one copy may leave the root sign.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) { return factMixPart(4, pickB(r, pool(4, [3, 5], 2, 6, 3800).concat(pool(4, [4], 2, 12)), 1250)); } },
        { id: 'e2b', level: 'PRG', make: function (r) { return factMixPart(4, pickB(r, pool(4, [2, 3], 3, 250, 4000).filter(function (R) { return nt.factor(R).some(function (pe) { return pe[1] === 3; }); }), 2000)); } },
        { id: 'e2c', level: 'PRG', make: function (r) { return factMixPart(4, pickB(r, pool(4, [6], 2, 3).concat(pool(4, [3, 4, 5], 2, 7, 4000), pool(4, [10], 2, 2)), 3888)); } }] },
      { num: '3', stem: function (sh) { return 'Now index ' + t('5') + ' — a prime must appear <b>five</b> times to escape. One of ' + sh.items.map(function (x, i) { return '(' + 'abc'[i] + ') ' + t(rt(5, F(x.R))); }).join(', ') + ' is already in simplest form.'; },
        shared: function (r) {
          var simp = [];
          [2, 3, 5, 7].forEach(function (p) { [2, 3, 5, 7].forEach(function (q) { if (q <= p) return; for (var a = 1; a <= 4; a++) for (var b = 1; b <= 4; b++) { var v = pw(p, a) * pw(q, b); if (v >= 300 && v <= 4000 && (a >= 3 || b >= 3)) simp.push(v); } }); });
          var s1 = pool(5, [3], 2, 16), s2 = pool(5, [2], 3, 60).filter(function (R) { return R >= 200; });
          var A = r.chance(0.15) ? 486 : r.pick(s1.concat(s2)), B, S = r.chance(0.15) ? 2500 : r.pick(simp);
          for (var g = 0; g < 50; g++) { B = r.chance(0.15) ? 1944 : r.pick(s1.concat(s2)); if (B !== A) break; }
          var items = [{ R: A, simp: false }, { R: -B, simp: false }, { R: S, simp: true }];
          var pos = r.int(0, 2), tmp = items[2]; items[2] = items[pos]; items[pos] = tmp;
          return { items: items, pos: pos };
        },
        parts: [0, 1, 2].map(function (i) {
          return { id: 'e3' + 'abc'[i], level: 'PRG', make: function (r, sh) {
            var it = sh.items[i], p = factMixPart(5, it.R, { prompt: t(rt(5, F(it.R))) + (it.simp ? '' : '') });
            if (it.simp) p.hints = ['Divide ' + t(F(Math.abs(it.R))) + ' by small primes until only primes are left.', 'If no prime appears five or more times, nothing comes out — the radical is already in simplest form, so write it unchanged.'];
            return p;
          } };
        }).concat([{ id: 'e3d', sub: 'd', level: 'EMG', make: function (r, sh) {
          var opts = sh.items.map(function (it, i) {
            var fac = K.fac(Math.abs(it.R)), lab = '(' + 'abc'[i] + ') ' + t(rt(5, F(it.R)));
            return it.simp ? { html: lab + ': ' + t(F(Math.abs(it.R)) + '=' + fac) + ', and no prime appears five or more times.', right: true }
              : { html: lab + ': ' + t(F(Math.abs(it.R)) + '=' + fac) + ', and no prime appears five or more times.', why: 'Look again: ' + t(fac) + ' has a prime appearing five times, so one copy comes out.' };
          }).concat([{ html: 'None of them: each one has a perfect fifth-power factor.', why: 'One of them has no prime appearing five or more times.' }]);
          return P.mc(r, 'Which one was already in simplest form, and how does its prime factorization show it?', opts,
            sh.items.map(function (it, i) { return '(' + 'abc'[i] + ') ' + t(F(Math.abs(it.R)) + '=' + K.fac(Math.abs(it.R))) + (it.simp ? ' — no prime appears five times: <b>already simplest</b>.' : ' — a prime appears five times, so it simplifies.'); }).join('<br>'),
            ['With index 5, a prime has to appear <b>five</b> times before it can come out.'], 'which fifth root is simplest', true);
        } }]) },
      { num: '4', stem: 'Each of these is a perfect power, so no radical sign should be left in your answer.', parts: [
        { id: 'e4a', level: 'BEG', outcome: 'AN1', make: function (r) { var s = pickB(r, range(2, 10), 5); return evalPart(4, s, F(pw(s, 4))); } },
        { id: 'e4b', level: 'BEG', outcome: 'AN1', make: function (r) { var ns = r.pick([[5, 2], [5, 3], [5, 4], [6, 2], [6, 3], [5, 3]]); return evalPart(ns[0], ns[1], F(pw(ns[1], ns[0]))); } },
        { id: 'e4c', level: 'EMG', outcome: 'AN1', make: function (r) { var d = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]), v = d / 10; return evalPart(3, v, (K.roundTo(v * v * v, 3)).toFixed(3)); } },
        { id: 'e4d', level: 'EMG', outcome: 'AN1', make: function (r) { var ns = r.pick([[4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [3, 11], [3, 12], [3, 13], [3, 14], [3, 15], [4, 8]]); return evalPart(ns[0], ns[1], F(pw(ns[1], ns[0]))); } },
        { id: 'e4e', level: 'EMG', outcome: 'AN1', make: function (r) { var d = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12]), v = d / 10; return evalPart(3, -v, '-' + (K.roundTo(v * v * v, 3)).toFixed(3)); } }] },
      { num: '5', section: 'Extra practice B — Mixed and Entire at Higher Indices', stem: 'Convert each mixed radical to an entire radical. Raise the coefficient to the power of the <i>index</i>, not always to the power ' + t('3') + '.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { var cm = r.pick(pairs([2, 3], CF13)); if (r.chance(0.1)) cm = [2, 5]; return entirePart(cm[0], 3, cm[1]); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var cm = r.pick(pairs([2], F4).concat(pairs([3], [2, 3, 4, 5, 6]))); if (r.chance(0.1)) cm = [3, 2]; return entirePart(cm[0], 4, cm[1]); } },
        { id: 'e5c', level: 'EMG', make: function (r) { var cm = r.pick(pairs([2], F5).concat(pairs([3], [2, 3]))); if (r.chance(0.1)) cm = [2, 3]; return entirePart(cm[0], 5, cm[1]); } },
        { id: 'e5d', level: 'EMG', make: function (r) { var cm = r.pick(pairs([4, 5], CF13)); if (r.chance(0.1)) cm = [5, 4]; return entirePart(cm[0], 3, cm[1]); } }] },
      { num: '6', stem: 'Convert each mixed radical to an entire radical. Every index here is <b>odd</b>, so the negative coefficient may be absorbed — but track the sign of the radicand carefully.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) { var cm = r.pick(pairs([-2], CF)); if (r.chance(0.1)) cm = [-2, 3]; return entirePart(cm[0], 3, cm[1]); } },
        { id: 'e6b', level: 'EMG', make: function (r) { var cm = r.pick(pairs([-3], CF)); if (r.chance(0.1)) cm = [-3, 2]; return entirePart(cm[0], 3, cm[1]); } },
        { id: 'e6c', level: 'EMG', make: function (r) { var cm = r.pick(pairs([-2], F5).concat(pairs([-3], [2, 3]))); if (r.chance(0.1)) cm = [-2, 2]; return entirePart(cm[0], 5, cm[1]); } },
        { id: 'e6d', level: 'EMG', make: function (r) { var cm = r.pick(pairs([-4, -5], CF13)); if (r.chance(0.1)) cm = [-4, 2]; return entirePart(cm[0], 3, cm[1]); } }] },
      { num: '7', stem: function (sh) { return '<b>Jonah</b> tries to write ' + t('-' + sh.c + '\\sqrt[4]{' + sh.m + '}') + ' as a single entire radical. He computes ' + t('(-' + sh.c + ')^{4}=' + pw(sh.c, 4)) + ' and writes ' + t('-' + sh.c + '\\sqrt[4]{' + sh.m + '}=\\sqrt[4]{' + pw(sh.c, 4) * sh.m + '}') + '.'; },
        shared: function (r) { var cm = r.chance(0.15) ? [2, 3] : r.pick(pairs([2], F4.filter(function (m) { return m <= 15; })).concat(pairs([3], [2, 3, 5, 6, 7]))); return { c: cm[0], m: cm[1] }; },
        parts: [
          { id: 'e7a', level: 'EMG', make: function (r, sh) {
            var c = sh.c, m = sh.m, M = pw(c, 4) * m, v1 = -c * Math.pow(m, 0.25), v2 = Math.pow(M, 0.25);
            var p = P.fields('<b>Use a calculator.</b> Evaluate both expressions to the nearest hundredth.', [{ name: t('-' + c + '\\sqrt[4]{' + m + '}'), before: t('-' + c + '\\sqrt[4]{' + m + '}\\approx') }, { name: t('\\sqrt[4]{' + M + '}'), before: t('\\sqrt[4]{' + M + '}\\approx') }],
              [calcChk(v1, 2), calcChk(v2, 2)], [d2(v1), d2(v2)], t('-' + c + '\\sqrt[4]{' + m + '}\\approx ' + d2(v1)) + ' and ' + t('\\sqrt[4]{' + M + '}\\approx ' + d2(v2)),
              t('\\sqrt[4]{' + m + '}\\approx ' + Math.pow(m, 0.25).toFixed(4)) + ', so ' + t('-' + c + '\\sqrt[4]{' + m + '}\\approx ' + d2(v1)) + '. But ' + t('\\sqrt[4]{' + M + '}\\approx ' + d2(v2)) + ' is <b>positive</b>. Same size, opposite signs — so Jonah is wrong.',
              ['On the calculator, a fourth root is ' + t('x^{1/4}') + ' or the ' + t('\\sqrt[x]{\\ }') + ' key with ' + t('x=4') + '. Answers within the last digit are fine.', 'Multiply the fourth root of ' + t(m) + ' by ' + t('-' + c) + '.'], 'Jonah calc');
            p.bad = [[d2(-v1), d2(v2)]];
            return p;
          } },
          { id: 'e7b', level: 'PRG', make: function (r, sh) {
            var c = sh.c;
            return P.mc(r, 'What did raising the negative coefficient to an <b>even</b> power do?', [
              { html: t('(-' + c + ')^{4}') + ' is positive, so the negative sign disappeared. With an even index the negative has to stay <b>outside</b> the root.', right: true },
              { html: 'Nothing went wrong — the two expressions are equal.', why: 'Your calculator values have opposite signs, so they can’t be equal.' },
              { html: 'He should have cubed the coefficient instead: ' + t('(-' + c + ')^{3}') + '.', why: 'The index is ' + t(4) + ', so the coefficient is raised to the 4th power — the trouble is the sign, not the power.' },
              { html: 'He should have put ' + t('-' + pw(c, 4)) + ' under the root.', why: 'An even root of a negative number isn’t real, so the negative can’t go inside.' }],
              t('(-' + c + ')^{4}=+' + pw(c, 4)) + ': an even power of a negative number is positive, so the sign was lost. A fourth root is never negative, so the minus sign must stay in front: ' + t('-' + c + '\\sqrt[4]{' + sh.m + '}=-\\sqrt[4]{' + pw(c, 4) * sh.m + '}') + '.',
              ['Is ' + t('\\sqrt[4]{' + pw(c, 4) * sh.m + '}') + ' positive or negative? Is ' + t('-' + c + '\\sqrt[4]{' + sh.m + '}') + '?'], 'Jonah reason');
          } },
          { id: 'e7c', level: 'PRG', make: function (r, sh) { var p = entirePart(-sh.c, 4, sh.m); p.prompt = 'Write the correct entire form of ' + t('-' + sh.c + '\\sqrt[4]{' + sh.m + '}') + '.'; return p; } }] },
      { num: '8', stem: function (sh) { return 'Consider ' + t(sh.A.c + '\\sqrt[3]{' + sh.A.m + '}') + ' and ' + t(sh.B.c + '\\sqrt[3]{' + sh.B.m + '}') + '.'; },
        shared: function (r) {
          if (r.chance(0.15)) return { A: { c: 2, m: 5 }, B: { c: 3, m: 2 } };
          for (var g = 0; g < 200; g++) {
            var A = { c: r.int(2, 4), m: r.pick(CF13) }, B = { c: r.int(2, 4), m: r.pick(CF13) };
            var NA = pw(A.c, 3) * A.m, NB = pw(B.c, 3) * B.m;
            if (A.c !== B.c && A.m !== B.m && NA !== NB && (A.c - B.c) * (A.m - B.m) < 0 && Math.abs(NA - NB) >= 4) return { A: A, B: B };
          }
          return { A: { c: 2, m: 5 }, B: { c: 3, m: 2 } };
        },
        parts: [
          { id: 'e8a1', sub: 'a(i)', level: 'EMG', make: function (r, sh) { return entirePart(sh.A.c, 3, sh.A.m); } },
          { id: 'e8a2', sub: 'a(ii)', level: 'EMG', make: function (r, sh) { return entirePart(sh.B.c, 3, sh.B.m); } },
          { id: 'e8b', sub: 'b', level: 'EMG', make: function (r, sh) {
            var A = sh.A, B = sh.B, NA = pw(A.c, 3) * A.m, NB = pw(B.c, 3) * B.m, big = NA > NB ? A : B, sml = NA > NB ? B : A, Nb = Math.max(NA, NB), Ns = Math.min(NA, NB);
            var bt = big.c + '\\sqrt[3]{' + big.m + '}', st = sml.c + '\\sqrt[3]{' + sml.m + '}';
            var opts = [{ html: t(bt) + ' is larger: ' + t(bt + '=\\sqrt[3]{' + Nb + '}') + ' and ' + t(st + '=\\sqrt[3]{' + Ns + '}') + '. With the same index, the larger number under the root gives the larger radical.', right: true },
              { html: t(st) + ' is larger, because ' + (sml.c > big.c ? 'its number in front is larger.' : 'the number under its root is larger.'), why: 'Compare the whole value: ' + t(st + '=\\sqrt[3]{' + Ns + '}') + ' and ' + t(bt + '=\\sqrt[3]{' + Nb + '}') + '. One part alone doesn’t decide it.' },
              { html: 'They are equal, because ' + t(A.c + '\\times ' + A.m) + ' and ' + t(B.c + '\\times ' + B.m) + ' are close.', why: 'The number in front is <b>cubed</b> when it moves inside: the entire radicals are ' + t('\\sqrt[3]{' + NA + '}') + ' and ' + t('\\sqrt[3]{' + NB + '}') + '.' },
              { html: 'You can’t tell without a calculator.', why: 'Write both as entire cube roots — then just compare the numbers under the roots.' }];
            return P.mc(r, 'Which of the original mixed radicals is larger, and why does writing them as entire radicals help?', opts,
              t(A.c + '\\sqrt[3]{' + A.m + '}=\\sqrt[3]{' + NA + '}') + ' and ' + t(B.c + '\\sqrt[3]{' + B.m + '}=\\sqrt[3]{' + NB + '}') + '. Both are cube roots now, so the larger number under the root is the larger radical: ' + t(bt) + ' is larger.',
              ['Use your answers to (a): both are cube roots of a single number.'], 'compare two mixed cube roots');
          } }] },
      { num: '9', stem: function (sh) { return 'Convert ' + t(rt(3, '-' + F(sh.R))) + ' to a mixed radical in simplest form, then convert your answer back to an entire radical.'; },
        shared: function (r) { return { R: r.chance(0.15) ? 1024 : r.pick(pool(3, [5, 6, 7, 8], 2, 4, 2100).concat(pool(3, [4], 2, 13))) }; },
        parts: [
          { id: 'e9a', level: 'PRG', make: function (r, sh) { var p = mixPart(1, 3, -sh.R); p.prompt = 'Mixed radical in simplest form: ' + t(rt(3, '-' + F(sh.R))) + ' = ?'; return p; } },
          { id: 'e9b', level: 'EMG', make: function (r, sh) { var f = ex.nthFactor(sh.R, 3), m = sh.R / pw(f, 3), p = entirePart(-f, 3, m); p.prompt = 'Now convert your answer to (a) back to an entire radical. (You should get the radicand you started with — show that you do.)'; p.text = 'back to entire: ' + -f + 'cbrt' + m; return p; } }] },
      { num: '10', section: 'Extra practice C — Odd Index, Even Index', stem: function (sh) { return 'Consider the eight radicals ' + sh.items.map(function (x) { return t(x.tex); }).join(', &nbsp;') + '.'; },
        shared: function (r) {
          var items = [], used = {};
          function add(n, s, neg, real) { var tex = rt(n, (neg ? '-' : '') + F(pw(s, n))); if (used[tex]) return false; used[tex] = 1; items.push({ tex: tex, real: real, v: real ? (neg ? -s : s) : null, n: n, s: s, neg: neg }); return true; }
          var oddSpec = [[3, [2, 3, 4, 5, 6]], [5, [1, 2, 3]], [7, [1, 2]], [3, [2, 3, 4, 5]]], evenSpec = [[2, [2, 3, 4, 5, 6, 7, 8, 9]], [4, [1, 2, 3]], [6, [1, 2]]];
          var g = 0;
          while (items.length < 4 && g++ < 200) { var o = r.pick(oddSpec); add(o[0], r.pick(o[1]), true, true); }
          g = 0; var es = r.shuffle(evenSpec);
          for (var i = 0; i < 3; i++) { g = 0; while (!add(es[i][0], r.pick(es[i][1]), true, false) && g++ < 20); }
          g = 0; while (items.length < 8 && g++ < 50) add(r.pick([2, 4]), r.pick([2, 3]), false, true);
          items = r.shuffle(items).map(function (x, j) { x.id = 'x' + j; return x; });
          return { items: items };
        },
        parts: [
          { id: 'e10a', level: 'EMG', make: function (r, sh) {
            var want = {}, by = {}; sh.items.forEach(function (x) { want[x.id] = x.real ? 'R' : 'N'; by[x.id] = x; });
            return P.grid('Sort each radical: is it a real number?', sh.items.map(function (x) { return { id: x.id, html: t(x.tex), label: x.tex }; }), [{ id: 'R', html: 'Real' }, { id: 'N', html: 'Not a real number' }], want,
              { rowHead: 'Radical', why: function (id) { var x = by[id]; return { code: 'u1l7-real', hint: t(x.tex) + ': the index ' + t(x.n) + ' is ' + (x.n % 2 ? 'odd' : 'even') + (x.neg ? ' and the radicand is negative' : ' and the radicand is positive') + (x.real ? ', so it <b>is</b> a real number.' : ' — no real number raised to an even power is negative, so it is <b>not</b> a real number.') }; } },
              sh.items.map(function (x) { return t(x.tex) + ': ' + (x.real ? 'real' : 'not real (even index, negative radicand)'); }).join('<br>'),
              ['Check the index first. An <b>even</b> index with a negative radicand is not a real number; an odd index is fine with a negative radicand.'], 'sort real / not real roots');
          } },
          { id: 'e10b', level: 'EMG', outcome: 'AN1', make: function (r, sh) {
            var reals = sh.items.filter(function (x) { return x.real; });
            var p = P.fields('Give the exact value of each radical that <b>is</b> a real number.', reals.map(function (x) { return { name: t(x.tex), before: t(x.tex + '=') }; }),
              reals.map(function (x) { return K.number(x.v, function (v) { if (v === -x.v) return { code: x.neg ? 'neg-root' : 'sign', hint: x.neg ? 'An odd root of a negative number is negative.' : 'Check the sign.' }; if (v === pw(x.s, x.n) * (x.neg ? -1 : 1) / x.n || Math.abs(v) === Math.abs(pw(x.s, x.n) / x.n)) return { code: 'u1l7-div-index', hint: 'The root isn’t the number divided by the index. Which number, used ' + t(x.n) + ' times as a factor, gives it?' }; return null; }); }),
              reals.map(function (x) { return String(x.v); }), reals.map(function (x) { return t(x.tex + '=' + x.v); }).join(', '),
              reals.map(function (x) { return t(x.tex + '=' + x.v) + ' because ' + t('(' + x.v + ')^{' + x.n + '}=' + pw(x.v, x.n)) + '.'; }).join('<br>'),
              ['Which number, used as a factor as many times as the index says, gives the radicand?'], 'exact values of real roots');
            p.bad = [reals.map(function (x) { return String(-x.v); })];
            return p;
          } }] },
      { num: '11', stem: function (sh) { return '<b>Marcus</b> says the index only affects <i>how</i> you find a root, never <i>whether</i> a root exists. Use ' + t('\\sqrt[3]{-' + pw(sh.a, 3) + '}') + ' and ' + t('\\sqrt[4]{-' + pw(sh.b, 4) + '}') + ' to show he is wrong.'; },
        shared: function (r) { var a = r.pick([2, 2, 3, 4, 5]), b = r.pick([2, 2, 3]); return { a: a, b: b }; },
        parts: [
          { id: 'e11a', level: 'BEG', outcome: 'AN1', make: function (r, sh) { var a = sh.a, p = evalPart(3, -a, '-' + pw(a, 3)); p.solution = 'Check: ' + t('(-' + a + ')\\times(-' + a + ')\\times(-' + a + ')=-' + pw(a, 3)) + ' — an odd number of negative factors gives a negative product. So ' + t('\\sqrt[3]{-' + pw(a, 3) + '}=-' + a) + '.'; return p; } },
          { id: 'e11b', level: 'EMG', make: function (r, sh) {
            var b = sh.b, B = pw(b, 4);
            return P.mc(r, 'What does the multiplication check ' + t('\\underline{\\ \\ }\\times\\underline{\\ \\ }\\times\\underline{\\ \\ }\\times\\underline{\\ \\ }=-' + B) + ' (four equal factors) reveal about ' + t('\\sqrt[4]{-' + B + '}') + '?', [
              { html: 'No real number works: four equal factors always give a product that isn’t negative (' + t(b + '^{4}=' + B) + ' and ' + t('(-' + b + ')^{4}=' + B) + '). So ' + t('\\sqrt[4]{-' + B + '}') + ' is not a real number.', right: true },
              { html: t('\\sqrt[4]{-' + B + '}=-' + b) + ', because ' + t('(-' + b + ')^{4}=-' + B) + '.', why: 'Count the negatives: four negative factors make a <b>positive</b> product, ' + t('(-' + b + ')^{4}=+' + B) + '.' },
              { html: t('\\sqrt[4]{-' + B + '}=' + b) + ', because ' + t(b + '^{4}=' + B) + '.', why: t(b + '^{4}=' + B) + ', not ' + t('-' + B) + '.' },
              { html: t('\\sqrt[4]{-' + B + '}=-' + B / 4) + ', because the fourth root means divide by 4.', why: 'A fourth root is the number used as a factor four times — not the number divided by 4.' }],
              'Any real number used as a factor four times gives a positive product (or 0): ' + t(b + '^{4}=' + B) + ' and ' + t('(-' + b + ')^{4}=' + B) + '. Nothing gives ' + t('-' + B) + ', so ' + t('\\sqrt[4]{-' + B + '}') + ' is not real — while ' + t('\\sqrt[3]{-' + pw(sh.a, 3) + '}=-' + sh.a) + ' is. The index decides <b>whether</b> a root exists, so Marcus is wrong.',
              ['Try ' + t('(-' + b + ')\\times(-' + b + ')\\times(-' + b + ')\\times(-' + b + ')') + '. Is it negative?'], 'fourth root of negative');
          } }] },
      { num: '12', stem: function (sh) { return 'Consider the radicals ' + t('\\sqrt[n]{-' + F(sh.R) + '}') + ' for whole-number indices ' + t('n') + '.'; },
        shared: function (r) { var o = r.pick([[2, 5], [2, 5], [3, 5], [4, 5], [2, 7]]); return { b: o[0], k: o[1], R: pw(o[0], o[1]) }; },
        parts: [
          { id: 'e12a', level: 'EMG', make: function (r, sh) {
            var R = sh.R;
            return P.mc(r, 'For which whole-number indices ' + t('n') + ' is ' + t('\\sqrt[n]{-' + F(R) + '}') + ' a real number?', [
              { html: 'For every <b>odd</b> index ' + t('n') + ': an odd power of a negative number is negative.', right: true },
              { html: 'For every <b>even</b> index ' + t('n') + '.', why: 'An even power of any real number is positive or zero, so an even root of a negative number isn’t real.' },
              { html: 'Only for ' + t('n=' + sh.k) + ', because ' + t(F(R) + '=' + sh.b + '^{' + sh.k + '}') + '.', why: 'The root doesn’t have to be a whole number: ' + t('\\sqrt[3]{-' + F(R) + '}') + ' is real too (it’s negative).' },
              { html: 'For every index: any number has a root of every index.', why: 'Try ' + t('n=2') + ': no real number squared is negative.' }],
              'An odd power of a negative number is negative, so every <b>odd</b> index gives a real root of ' + t('-' + F(R)) + '. An even power is never negative, so no even index does.',
              ['Is ' + t('(-2)^{n}') + ' negative when ' + t('n') + ' is odd? When ' + t('n') + ' is even?'], 'which indices give a real root');
          } },
          { id: 'e12b', sub: 'b(i)', level: 'BEG', outcome: 'AN1', make: function (r, sh) { return evalPart(sh.k, -sh.b, '-' + F(sh.R)); } },
          { id: 'e12c', sub: 'b(ii)', level: 'PRG', make: function (r, sh) { var p = mixPart(1, 3, -sh.R); p.prompt = 'Write ' + t(rt(3, '-' + F(sh.R))) + ' as a mixed radical in simplest form.'; return p; } }] },
      { num: '13', stem: function (sh) { return 'Evaluate ' + [2, 3, 4, 5].map(function (n) { return t(rt(n, '(-' + sh.a + ')^{' + n + '}')); }).join(', ') + '.'; },
        shared: function (r) { return { a: r.chance(0.15) ? 6 : r.int(2, 9) }; },
        parts: [
          { id: 'e13a', level: 'EMG', outcome: 'AN1', make: function (r, sh) {
            var a = sh.a;
            var p = P.fields('Evaluate each one. (Work out the power inside first.)', [2, 3, 4, 5].map(function (n) { return { name: t(rt(n, '(-' + a + ')^{' + n + '}')), before: t(rt(n, '(-' + a + ')^{' + n + '}') + '=') }; }),
              [2, 3, 4, 5].map(function (n) { var want = n % 2 ? -a : a; return K.number(want, function (v) { if (v === -want) return { code: n % 2 ? 'neg-root' : 'sign', hint: n % 2 ? 'Odd power: ' + t('(-' + a + ')^{' + n + '}') + ' is negative, so its ' + nth(n) + ' root is negative.' : 'Even power: ' + t('(-' + a + ')^{' + n + '}=' + F(pw(a, n))) + ' is positive, and a ' + ROOT[n] + ' of a positive number is positive.' }; if (Math.abs(v) === pw(a, n)) return { code: 'u1l7-not-root', hint: 'That’s the power. Now take the ' + ROOT[n] + '.' }; return null; }); }),
              [String(a), String(-a), String(a), String(-a)], [2, 3, 4, 5].map(function (n) { return t(rt(n, '(-' + a + ')^{' + n + '}') + '=' + (n % 2 ? -a : a)); }).join(', '),
              [2, 3, 4, 5].map(function (n) { return t(rt(n, '(-' + a + ')^{' + n + '}') + '=' + rt(n, F(pw(-a, n))) + '=' + (n % 2 ? -a : a)); }).join('<br>'),
              ['Work out the power first. An even power of a negative number is positive; an odd power stays negative.'], 'nth root of (-a)^n');
            p.bad = [[String(-a), String(-a), String(-a), String(-a)], [String(a), String(a), String(a), String(a)]];
            return p;
          } },
          { id: 'e13b', level: 'EMG', make: function (r, sh) {
            return P.mc(r, 'Complete: ' + t('\\sqrt[n]{a^{n}}=a') + ' when the index is ____, but equals the <i>positive</i> version of ' + t('a') + ' when the index is ____.', [
              { html: '<b>odd</b>; <b>even</b>', right: true }, { html: '<b>even</b>; <b>odd</b>', why: 'Look at your answers: ' + t('\\sqrt{(-' + sh.a + ')^{2}}=' + sh.a) + ' (positive) has an even index.' },
              { html: '<b>odd</b>; <b>odd</b>', why: 'The index decides it: odd keeps the sign, even makes it positive.' }, { html: 'any index; never', why: t('\\sqrt{(-' + sh.a + ')^{2}}=' + sh.a) + ', not ' + t(-sh.a) + '.' }],
              'Odd index: ' + t('\\sqrt[3]{(-' + sh.a + ')^{3}}=-' + sh.a) + ', the sign comes back. Even index: ' + t('\\sqrt{(-' + sh.a + ')^{2}}=' + sh.a) + ', the result is the positive version.', ['Look at the pattern in your four answers.'], 'nth root of a^n rule', true);
          } }] },
      { num: '14', section: 'Extra practice D — Comparing, Geometry, and a Stretch', stem: function (sh) { return 'Which is larger, ' + t('\\sqrt[3]{' + sh.a + '}') + ' or ' + t('\\sqrt{' + sh.b + '}') + '? You cannot compare radicands directly when the indices differ. Instead raise <b>both</b> radicals to the power ' + t('6') + ' — the smallest power that clears an index of ' + t('3') + ' and an index of ' + t('2') + ' — and compare the whole numbers you get.'; },
        shared: function (r) {
          if (r.chance(0.15)) return { a: 20, b: 8 };
          for (var g = 0; g < 300; g++) { var a = r.int(6, 40), b = r.int(3, 15); if (ex.nthFactor(a, 3) === 1 && Math.round(Math.sqrt(b)) ** 2 !== b && a * a !== b * b * b && a * a / (b * b * b) > 0.6 && a * a / (b * b * b) < 1.6) return { a: a, b: b }; }
          return { a: 20, b: 8 };
        },
        parts: [
          { id: 'e14a', level: 'ADV', make: function (r, sh) {
            var a = sh.a, b = sh.b;
            var p = P.fields('Raise each radical to the power ' + t('6') + '.', [{ name: t('(\\sqrt[3]{' + a + '})^{6}'), before: t('\\left(\\sqrt[3]{' + a + '}\\right)^{6}=') }, { name: t('(\\sqrt{' + b + '})^{6}'), before: t('\\left(\\sqrt{' + b + '}\\right)^{6}=') }],
              [K.number(a * a, function (v) { if (v === pw(a, 3)) return { code: 'u1l7-pow', hint: t('\\left(\\sqrt[3]{' + a + '}\\right)^{3}=' + a) + ', so ' + t('\\left(\\sqrt[3]{' + a + '}\\right)^{6}=' + a + '^{2}') + '.' }; if (v === 6 * a || v === 2 * a) return { code: 'u1l7-pow', hint: t(a + '^{2}') + ' means ' + t(a + '\\times ' + a) + '.' }; return null; }),
                K.number(b * b * b, function (v) { if (v === b * b) return { code: 'u1l7-pow', hint: t('\\left(\\sqrt{' + b + '}\\right)^{2}=' + b) + ', so ' + t('\\left(\\sqrt{' + b + '}\\right)^{6}=' + b + '^{3}') + '.' }; if (v === 3 * b || v === 6 * b) return { code: 'u1l7-pow', hint: t(b + '^{3}') + ' means ' + t(b + '\\times ' + b + '\\times ' + b) + '.' }; return null; })],
              [String(a * a), String(b * b * b)], t('\\left(\\sqrt[3]{' + a + '}\\right)^{6}=' + a * a) + ', ' + t('\\left(\\sqrt{' + b + '}\\right)^{6}=' + F(b * b * b)),
              t('\\left(\\sqrt[3]{' + a + '}\\right)^{6}=\\left(\\left(\\sqrt[3]{' + a + '}\\right)^{3}\\right)^{2}=' + a + '^{2}=' + a * a) + '<br>' + t('\\left(\\sqrt{' + b + '}\\right)^{6}=\\left(\\left(\\sqrt{' + b + '}\\right)^{2}\\right)^{3}=' + b + '^{3}=' + F(b * b * b)),
              ['Cubing a cube root gives back the radicand: ' + t('\\left(\\sqrt[3]{' + a + '}\\right)^{3}=' + a) + '. The 6th power is that, squared.', 'Squaring a square root gives back the radicand; the 6th power is that, cubed.'], 'sixth powers of cbrt/sqrt');
            p.bad = [[String(pw(a, 3)), String(b * b)]];
            return p;
          } },
          { id: 'e14b', level: 'PRG', make: function (r, sh) {
            var a = sh.a, b = sh.b, A = a * a, B = b * b * b, cb = A > B;
            return P.mc(r, 'Which is larger?', [
              { html: t(cb ? '\\sqrt[3]{' + a + '}' : '\\sqrt{' + b + '}') + ', because ' + t(cb ? F(A) + '>' + F(B) : F(B) + '>' + F(A)) + '.', right: true },
              { html: t(cb ? '\\sqrt{' + b + '}' : '\\sqrt[3]{' + a + '}') + ', because ' + t(cb ? F(B) + '<' + F(A) : F(A) + '<' + F(B)) + '.', why: 'The larger 6th power belongs to the larger number.' },
              { html: t('\\sqrt[3]{' + a + '}') + ', because ' + t(a + '>' + b) + '.', why: 'You can’t compare the radicands directly — the indices are different.', code: 'radicands' },
              { html: 'They are equal.', why: 'Their 6th powers are different, so the numbers are different.' }].filter(function (o, i) { return !(i === 2 && (cb || a <= b)); }),
              t('\\left(\\sqrt[3]{' + a + '}\\right)^{6}=' + F(A)) + ' and ' + t('\\left(\\sqrt{' + b + '}\\right)^{6}=' + F(B)) + '. Both numbers are positive, so the one with the larger 6th power is larger: ' + t(cb ? '\\sqrt[3]{' + a + '}' : '\\sqrt{' + b + '}') + ' (' + t('\\approx ' + (cb ? Math.cbrt(a) : Math.sqrt(b)).toFixed(3)) + ' vs ' + t('\\approx ' + (cb ? Math.sqrt(b) : Math.cbrt(a)).toFixed(3)) + ').',
              ['Use your two 6th powers from (a).'], 'compare cbrt vs sqrt');
          } }] },
      { num: '15', stem: function (sh) { return 'Arrange ' + t('\\sqrt{' + sh.a + '}') + ', ' + t('\\sqrt[3]{' + sh.b + '}') + ' and ' + t('\\sqrt[4]{' + sh.a * sh.a + '}') + ' from least to greatest by raising all three to the power ' + t('12') + '.'; },
        shared: function (r) {
          var o = [];
          [2, 3, 5, 10].forEach(function (a) { var c = Math.pow(a, 1.5); for (var b = Math.max(2, Math.floor(c) - 2); b <= Math.ceil(c) + 2; b++) if (ex.nthFactor(b, 3) === 1 && pw(b, 4) !== pw(a, 6) && (a !== 10 || (b >= 28 && b <= 33))) o.push({ a: a, b: b }); });
          return r.chance(0.2) ? { a: 10, b: 30 } : r.pick(o);
        },
        parts: [
          { id: 'e15a', level: 'ADV', make: function (r, sh) {
            var a = sh.a, b = sh.b, A = pw(a, 6), B = pw(b, 4);
            var labs = [t('\\left(\\sqrt{' + a + '}\\right)^{12}'), t('\\left(\\sqrt[3]{' + b + '}\\right)^{12}'), t('\\left(\\sqrt[4]{' + a * a + '}\\right)^{12}')];
            var p = P.fields('Raise each one to the power ' + t('12') + '.', labs.map(function (l) { return { name: l, before: l + t('='), wide: true }; }),
              [K.number(A, function (v) { if (v === a * a || v === pw(a, 12)) return { code: 'u1l7-pow', hint: t('\\left(\\sqrt{' + a + '}\\right)^{2}=' + a) + ', and ' + t('12=2\\times 6') + ', so the answer is ' + t(a + '^{6}') + '.' }; return null; }),
                K.number(B, function (v) { if (v === pw(b, 3) || v === pw(b, 12)) return { code: 'u1l7-pow', hint: t('\\left(\\sqrt[3]{' + b + '}\\right)^{3}=' + b) + ', and ' + t('12=3\\times 4') + ', so the answer is ' + t(b + '^{4}') + '.' }; return null; }),
                K.number(A, function (v) { if (v === pw(a * a, 4) || v === pw(a * a, 12)) return { code: 'u1l7-pow', hint: t('\\left(\\sqrt[4]{' + a * a + '}\\right)^{4}=' + a * a) + ', and ' + t('12=4\\times 3') + ', so the answer is ' + t(a * a + '^{3}') + '.' }; return null; })],
              [String(A), String(B), String(A)], labs[0] + t('=' + F(A)) + ', ' + labs[1] + t('=' + F(B)) + ', ' + labs[2] + t('=' + F(A)),
              labs[0] + t('=' + a + '^{6}=' + F(A)) + '<br>' + labs[1] + t('=' + b + '^{4}=' + F(B)) + '<br>' + labs[2] + t('=' + a * a + '^{3}=' + F(A)),
              ['Raising an index-' + t('n') + ' root to the power ' + t('n') + ' gives back the radicand. Split 12: ' + t('12=2\\times 6=3\\times 4=4\\times 3') + '.', 'So the answers are ' + t(a + '^{6}') + ', ' + t(b + '^{4}') + ' and ' + t(a * a + '^{3}') + '.'], '12th powers');
            p.bad = [[String(a * a), String(pw(b, 3)), String(pw(a * a, 4))]];
            return p;
          } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) {
            var a = sh.a, b = sh.b, A = pw(a, 6), B = pw(b, 4), s = '\\sqrt{' + a + '}', c = '\\sqrt[3]{' + b + '}', f = '\\sqrt[4]{' + a * a + '}', cLess = B < A;
            var right = cLess ? c + '<' + s + '=' + f : s + '=' + f + '<' + c;
            return P.mc(r, 'Which order is correct, and what is the surprise?', [
              { html: t(right) + ' — the surprise: ' + t(s) + ' and ' + t(f) + ' are the same number.', right: true },
              { html: t(cLess ? c + '<' + s + '<' + f : s + '<' + f + '<' + c) + ', with no ties.', why: t(s) + ' and ' + t(f) + ' have the same 12th power, so they are equal: ' + t(f + '=\\sqrt{\\sqrt{' + a * a + '}}=' + s) + '.' },
              { html: t(cLess ? f + '<' + s + '<' + c : c + '<' + f + '<' + s) + '.', why: 'Compare the 12th powers: ' + t(F(A)) + ' and ' + t(F(B)) + '.' },
              { html: t(cLess ? s + '=' + f + '<' + c : c + '<' + s + '=' + f) + '.', why: 'Check which 12th power is larger: ' + t(F(B) + (cLess ? '<' : '>') + F(A)) + '.' }],
              '12th powers: ' + t(s + '\\to ' + F(A)) + ', ' + t(c + '\\to ' + F(B)) + ', ' + t(f + '\\to ' + F(A)) + '. So ' + t(right) + '.<br>The surprise: ' + t(f + '=\\sqrt{\\sqrt{' + a * a + '}}=\\sqrt{' + a + '}') + ' — the same number written two ways.',
              ['Use your three answers to (a). Two of them are equal.'], 'order sqrt, cbrt, 4th root');
          } }] },
      { num: '16', stem: function (sh) { return 'A cube has a volume of ' + t(F(sh.V) + '\\text{ cm}^{3}') + '.'; },
        shared: function (r) { return { V: r.chance(0.15) ? 250 : r.pick(pool(3, [2, 3, 4, 5], 2, 7, 900)) }; },
        parts: [
          { id: 'e16a', level: 'EMG', make: function (r, sh) { var p = mixPart(1, 3, sh.V); p.prompt = 'Determine its exact edge length in simplest mixed radical form.'; p.input.after = t('\\text{cm}'); p.solution = 'Edge ' + t('=\\sqrt[3]{V}=\\sqrt[3]{' + F(sh.V) + '}') + '.<br>' + p.solution; return p; } },
          { id: 'e16b', level: 'EMG', make: function (r, sh) {
            var e = Math.cbrt(sh.V), f = ex.nthFactor(sh.V, 3), m = sh.V / pw(f, 3), lo = Math.floor(e);
            return P.approx('State the edge length to the nearest tenth of a centimetre.', e, 1, { after: t('\\text{cm}'), diag: function (v) { if (Math.abs(v - sh.V / 3) < 0.06) return { code: 'u1l7-div-index', hint: 'The edge is the <b>cube root</b> of the volume, not the volume divided by 3.' }; if (Math.abs(v - Math.sqrt(sh.V)) < 0.06) return { code: 'square-thinking', hint: 'A cube’s edge is the <b>cube</b> root of its volume, not the square root.' }; return null; } },
              t('\\sqrt[3]{' + F(sh.V) + '}=' + f + '\\sqrt[3]{' + m + '}\\approx ' + f + '\\times ' + Math.cbrt(m).toFixed(3) + '\\approx ' + e.toFixed(1)) + ' cm. (Check: ' + t(lo + '^{3}=' + pw(lo, 3)) + ' and ' + t((lo + 1) + '^{3}=' + pw(lo + 1, 3)) + ', so the edge is between ' + t(lo) + ' and ' + t(lo + 1) + ' cm.)',
              ['Use a calculator for this part: ' + t('\\sqrt[3]{' + F(sh.V) + '}') + ', then round to one decimal place.', 'Check it’s sensible: ' + t(lo + '^{3}=' + pw(lo, 3)) + ' and ' + t((lo + 1) + '^{3}=' + pw(lo + 1, 3)) + '.'], 'cube edge to tenth ' + sh.V);
          } }] },
      { num: '17', stem: function (sh) { return 'One cube has a volume of ' + t(F(sh.V1) + '\\text{ cm}^{3}') + '. A second cube has a volume of ' + t(F(sh.V2) + '\\text{ cm}^{3}') + '.'; },
        shared: function (r) { if (r.chance(0.15)) return { V1: 250, V2: 375 }; var P5 = pool(3, [2, 3, 4, 5], 2, 7, 900), a = r.pick(P5), b; for (var g = 0; g < 50; g++) { b = r.pick(P5); if (b !== a) break; } return { V1: a, V2: b === a ? a + 1 : b }; },
        parts: [
          { id: 'e17a', level: 'EMG', make: function (r, sh) { var p = mixPart(1, 3, sh.V2); p.prompt = 'Find the exact edge length of the <b>second</b> cube in simplest mixed radical form.'; p.input.after = t('\\text{cm}'); return p; } },
          { id: 'e17b', level: 'BEG', make: function (r, sh) {
            var big = sh.V2 > sh.V1 ? 'second' : 'first';
            return P.mc(r, 'Which of the two cubes has the longer edge?', [
              { html: 'The ' + big + ' cube: its volume is larger, and a larger cube root goes with a larger radicand.', right: true },
              { html: 'The ' + (big === 'first' ? 'second' : 'first') + ' cube.', why: 'Compare the volumes: the cube with more volume has the longer edge, because ' + t('\\sqrt[3]{\\ }') + ' of a larger number is larger.' },
              { html: 'They have the same edge length.', why: 'Different volumes mean different edge lengths.' }],
              t('\\sqrt[3]{' + F(sh.V1) + '}') + ' and ' + t('\\sqrt[3]{' + F(sh.V2) + '}') + ' have the same index, so the larger radicand gives the larger edge: the ' + big + ' cube.', ['Both edges are cube roots. Compare what is under the roots.'], 'which cube longer', true);
          } }] },
      { num: '18', stem: '<b>Stretch.</b> Answer each part, and show the reasoning that got you there rather than guessing and checking forever.', parts: [
        { id: 'e18a', level: 'EMG', outcome: 'AN1', make: function (r) {
          var n = r.pick([3, 3, 4, 5, 6]), ans = pw(2, n);
          return P.nr('Find the smallest whole number ' + t('k>1') + ' for which ' + t(rt(n, 'k')) + ' is a whole number.', ans, function (v) { if (v === n) return { code: 'u1l7-not-root', hint: t(rt(n, n)) + ' isn’t a whole number. You want ' + t('k') + ' to be a perfect ' + POW[n] + '.' }; if (v === 2 * n) return { code: 'u1l7-times-index', hint: t('2^{' + n + '}') + ' means ' + t(n) + ' twos multiplied, not ' + t('2\\times ' + n) + '.' }; return null; },
            t('k') + ' must be a perfect ' + POW[n] + '. ' + t('1^{' + n + '}=1') + ' is not allowed (' + t('k>1') + '), so the smallest is ' + t('2^{' + n + '}=' + ans) + '.', ['Which perfect ' + POW[n] + 's are there? List ' + t('1^{' + n + '}, 2^{' + n + '}, \\ldots') + '.'], 'smallest perfect ' + n + 'th power');
        } },
        { id: 'e18b', level: 'ADV', outcome: 'AN1', make: function (r) {
          var pq = r.pick([[2, 3], [2, 3], [2, 5], [3, 4], [4, 6]]), L = pq[0] * pq[1] / ex.gcd(pq[0], pq[1]), ans = pw(2, L);
          var W = { 2: 'square', 3: 'cube', 4: 'fourth power', 5: 'fifth power', 6: 'sixth power' };
          return P.nr('Find the smallest whole number ' + t('k>1') + ' that is a perfect ' + W[pq[0]] + ' <b>and</b> a perfect ' + W[pq[1]] + '.', ans, function (v) {
            if (v === pw(2, pq[0] * pq[1]) && pq[0] * pq[1] !== L) return { code: 'u1l7-lcm-index', hint: t(F(v)) + ' works, but it isn’t the smallest. The exponent only has to be a multiple of both ' + t(pq[0]) + ' and ' + t(pq[1]) + ': use their <b>LCM</b>.' };
            if (v === pq[0] * pq[1] || v === L) return { code: 'u1l7-not-root', hint: 'That’s the exponent you need. Now raise ' + t(2) + ' to it.' };
            return null;
          }, 'Write ' + t('k=2^{e}') + '. A perfect ' + W[pq[0]] + ' needs ' + t('e') + ' to be a multiple of ' + t(pq[0]) + '; a perfect ' + W[pq[1]] + ' needs a multiple of ' + t(pq[1]) + '. The smallest such ' + t('e') + ' is LCM' + t('(' + pq[0] + ',' + pq[1] + ')=' + L) + ', so ' + t('k=2^{' + L + '}=' + F(ans)) + '. (Check: ' + t(F(ans) + '=' + (pw(2, L / pq[0])) + '^{' + pq[0] + '}=' + pw(2, L / pq[1]) + '^{' + pq[1] + '}') + '.)',
            ['Try powers of ' + t(2) + ': ' + t('2^{e}') + ' is a perfect ' + W[pq[0]] + ' when ' + t('e') + ' is a multiple of ' + t(pq[0]) + '.', 'You need ' + t('e') + ' to be a multiple of ' + t(pq[0]) + ' <b>and</b> of ' + t(pq[1]) + '.'], 'perfect ' + pq.join(' and '));
        } },
        { id: 'e18c', level: 'MAS', outcome: 'AN1', make: function (r) {
          var tr = r.pick([[2, 3, 4], [2, 3, 4], [2, 4, 6], [3, 4, 6], [2, 5, 10], [2, 3, 6]]), L = tr.reduce(function (x, y) { return x * y / ex.gcd(x, y); }), ans = pw(2, L);
          var W = { 2: 'square', 3: 'cube', 4: 'fourth power', 5: 'fifth power', 6: 'sixth power', 10: 'tenth power' };
          return P.nr('Find the smallest whole number ' + t('k>1') + ' that is a perfect ' + W[tr[0]] + ', a perfect ' + W[tr[1]] + ' <b>and</b> a perfect ' + W[tr[2]] + '.', ans, function (v) {
            var prod = tr[0] * tr[1] * tr[2];
            if (v === pw(2, prod) || (prod <= 30 && v === pw(2, prod))) return { code: 'u1l7-lcm-index', hint: 'That works, but it isn’t the smallest: the exponent only has to be a multiple of ' + t(tr.join(',\\ ')) + ' — use their LCM.' };
            for (var i = 0; i < 3; i++) for (var j = i + 1; j < 3; j++) { var l2 = tr[i] * tr[j] / ex.gcd(tr[i], tr[j]); if (l2 !== L && v === pw(2, l2)) return { code: 'u1l7-lcm-index', hint: t(F(v) + '=2^{' + l2 + '}') + ' is a perfect ' + W[tr[i]] + ' and a perfect ' + W[tr[j]] + ', but ' + t(l2) + ' isn’t a multiple of ' + t(tr[3 - i - j]) + '.' }; }
            if (v === L) return { code: 'u1l7-not-root', hint: t(L) + ' is the exponent you need. Now raise ' + t(2) + ' to it.' };
            return null;
          }, 'Write ' + t('k=2^{e}') + '. ' + t('e') + ' must be a multiple of ' + t(tr.join(',\\ ')) + '. The smallest is their LCM, ' + t(L) + ', so ' + t('k=2^{' + L + '}=' + F(ans)) + '.<br>Check: ' + tr.map(function (n) { return t(F(ans) + '=' + pw(2, L / n) + '^{' + n + '}'); }).join(', ') + '.',
            ['Use powers of ' + t('2') + '. For which exponents is ' + t('2^{e}') + ' a perfect ' + W[tr[0]] + '? A perfect ' + W[tr[1]] + '?', 'The exponent has to be a multiple of all three indices at once — the LCM.'], 'perfect ' + tr.join(', '));
        } }] },
      { num: '19', stem: function (sh) { return '<i>(Multiple Choice)</i> Exactly one of ' + sh.opts.map(function (o) { return t(o.tex); }).join(', ') + ' is <b>not</b> in simplest form.'; },
        shared: function (r) {
          var opts = [], used = {};
          function add(o) { if (used[o.tex]) return false; used[o.tex] = 1; opts.push(o); return true; }
          var g = 0;
          while (opts.length < 3 && g++ < 100) { var n = r.pick([3, 3, 4, 5]), c = r.int(2, 5), m = r.pick(n === 3 ? free(3, 2, 15) : n === 4 ? [2, 3, 5, 6, 7, 10, 12] : [2, 3, 4, 6, 7, 9]); add({ tex: c + rt(n, m), simp: true }); }
          var c2 = r.pick([2, 3]), f = 2, m2 = r.pick([3, 5, 6, 7]), N = pw(f, 3) * m2; if (r.chance(0.2)) { c2 = 2; m2 = 3; N = 24; }
          var bad = { tex: c2 + '\\sqrt[3]{' + N + '}', simp: false, c: c2, N: N };
          var pos = r.int(0, 3); opts.splice(pos, 0, bad);
          return { opts: opts, bad: bad };
        },
        parts: [
          { id: 'e19a', level: 'EMG', make: function (r, sh) {
            var b = sh.bad, f = ex.nthFactor(b.N, 3);
            return P.mc(r, 'Which one is <b>not</b> in simplest form?', sh.opts.map(function (o) { return o.simp ? { html: t(o.tex), why: 'The number under that root has no perfect ' + (/\[4\]/.test(o.tex) ? 'fourth power' : /\[5\]/.test(o.tex) ? 'fifth power' : 'cube') + ' factor, so it is already simplest.' } : { html: t(o.tex), right: true }; }),
              t(b.tex) + ': ' + t(F(b.N) + '=' + pw(f, 3) + '\\times ' + b.N / pw(f, 3)) + ' has the perfect cube ' + t(pw(f, 3)) + ', so it can be simplified. The others have no perfect-power factor (for their index) under the root.', ['Check each radicand for a perfect power of its <b>own</b> index.'], 'not simplest of 4', true);
          } },
          { id: 'e19b', level: 'PRG', make: function (r, sh) { var p = mixPart(sh.bad.c, 3, sh.bad.N); p.prompt = 'Write the one that is not in simplest form, ' + t(sh.bad.tex) + ', in simplest form.'; return p; } }] },
      { num: '20', stem: '<i>(Numerical Response)</i>', parts: [
        { id: 'e20', level: 'PRG', make: function (r) {
          var o = r.chance(0.15) ? [5, 2, 7] : r.pick(pairs([2], [3, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15]).map(function (x) { return [5, 2, x[1]]; }).concat([[5, 3, 2], [5, 3, 4], [4, 2, 5], [4, 2, 7], [4, 3, 2], [4, 3, 5], [4, 2, 11], [4, 2, 13], [4, 2, 3], [4, 2, 6], [4, 3, 7], [4, 2, 15], [5, 2, 17], [5, 2, 19]]));
          var n = o[0], c = o[1], m = o[2], N = pw(c, n) * m;
          return P.nr('The mixed radical ' + t(c + rt(n, m)) + ' can be written as the entire radical ' + t(rt(n, 'n')) + '. The value of ' + t('n') + ' is ________.', N, function (v) {
            if (v === c * m) return { code: 'no-power', hint: 'Raise ' + t(c) + ' to the power ' + t(n) + ' (the index) before it moves inside.' };
            if (v === pw(c, 3) * m) return { code: 'wrong-power', hint: 'The index is ' + t(n) + ', not ' + t(3) + ': use ' + t(c + '^{' + n + '}=' + pw(c, n)) + '.' };
            if (v === c * c * m) return { code: 'u1l7-squared', hint: 'Raise ' + t(c) + ' to the power ' + t(n) + ', not ' + t(2) + '.' };
            if (v === c * n * m) return { code: 'u1l7-times-index', hint: t(c + '^{' + n + '}') + ' means ' + t(n) + ' factors of ' + t(c) + ', not ' + t(c + '\\times ' + n) + '.' };
            return null;
          }, t(c + rt(n, m) + '=' + rt(n, c + '^{' + n + '}\\times ' + m) + '=' + rt(n, pw(c, n) + '\\times ' + m) + '=' + rt(n, N)) + ', so ' + t('n=' + N) + '.', ['Raise the number in front to the power of the index, ' + t(n) + '.'], 'NR entire ' + c + ' root' + n + ' ' + m);
        } }] },
      { num: '21', section: 'Mastery challenge', stem: '<b>No calculator.</b> Compare by writing every number as an entire cube root.', parts: [
        { id: 'e21', level: 'MAS', make: function (r) { return betweenPart(r); } }] }
    ]
  });
})(window);
