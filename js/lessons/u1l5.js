/* Math 15 · Unit 1 · Lesson 5 — Perfect Squares, Perfect Cubes, and Estimating Roots (AN1; AN2 for estimating or
 * approximating an irrational root)
 * Assignment 5 (u1_L05.tex, Questions 1–14) and the Lesson 5 Extra Practice (u1_EP05.tex, Questions 1–19).
 * Every part is a generator: it keeps the idea and difficulty of the booklet question (the booklet's numbers are among
 * the possible values where practical) and changes the numbers. Built from the Math 10C Unit 1 Lessons 3 and 6 practice
 * (perfect-power tests by prime factorization, bracketing roots, smallest multipliers), at Math 15 pitch.
 * Calculator: only §4-type items (to the nearest tenth / hundredth, Q6, Q7, Q9, Q10, Q13, EP 14) expect calculator
 * values; they accept answers within one unit of the last place asked for (a chopped instead of rounded value is
 * accepted) and say so in a hint. Everything else uses the perfect-square and perfect-cube tables (no calculator).
 * Conversions: "between which two whole numbers, and which is it closer to" → three boxes; "justify your estimate in a
 * sentence" → the sentence's boxes (between __ and __, nearer to __, so about __); "explain" → multiple choice whose
 * options are reasons; "show the two squares you used" → boxes for each tenth and its square. */
(function (root) {
  'use strict';
  var HW = root.HW, nt = HW.nt, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'sqrt-halved': 'Halved instead of taking the square root', 'no-root': 'Didn’t take the root', 'divided-by-index': 'Halved / divided by 3 instead of taking the root',
    'used-square-root': 'Gave the square root instead of the cube root', 'used-cube-root': 'Gave the cube root instead of the square root', 'coef-forgot': 'Simplified the root but dropped the coefficient in front',
    'not-factored': 'Didn’t write the prime factorization', 'said-not-perfect': 'Said not a perfect square/cube (it is)', 'said-perfect': 'Said it is a perfect square/cube (it isn’t)',
    'yes-root': 'Said yes without giving the root', 'each-prime-once': 'Root: used each prime once (didn’t divide the exponents)', 'root-value': 'Wrong root',
    'times-itself': 'Multiplied by the number itself (not smallest)', 'not-smallest': 'Works, but not the smallest', 'made-square': 'Made a square instead of a cube', 'made-cube': 'Made a cube instead of a square',
    'missed-prime': 'Missed a prime with the wrong exponent', 'bracket': 'Bounds don’t bracket the root', 'swapped-bounds': 'Smaller and larger integer swapped', 'power-not-root': 'Gave the power, not the root',
    'estimate-off': 'Estimate not close enough', 'estimate-far': 'Estimate far off', truncate: 'Chopped instead of rounding',
    'mc-sq': 'Said perfect square', 'mc-cu': 'Said perfect cube', 'mc-both': 'Said both', 'mc-neither': 'Said neither',
    'u1l5-closer': 'Chose the wrong whole number as the closer one', 'u1l5-not-bound': 'The closer number isn’t one of the two bounds', 'u1l5-tenth': 'Tenths don’t trap the root',
    'u1l5-tenth-square': 'Squared (or cubed) a tenth wrong', 'u1l5-perimeter': 'Perimeter worked out wrong', 'u1l5-sa': 'Surface area worked out wrong', 'u1l5-face': 'Area of one face wrong',
    'u1l5-volume': 'Volume worked out wrong', 'u1l5-times': 'Wrong number of times larger', 'u1l5-doubled-vol': 'Doubled the volume instead of cubing the scale factor',
    'u1l5-side-from-perim': 'Took a square root of the perimeter', 'u1l5-product': 'Product after multiplying wrong', 'u1l5-count': 'Miscounted', 'u1l5-list': 'Wrong list of numbers',
    'u1l5-sum-roots': 'Added the roots instead of rooting the sum', 'u1l5-sqrt-neg': 'Gave a real value for the square root of a negative', 'u1l5-cube-sign': 'Cube root of a negative given as positive',
    'mc-neg-root': 'Gave a real value for the square root of a negative', 'mc-sq-reason': 'Blamed the perfect square (not the negative sign)', 'mc-root': 'Said the root is larger', 'mc-dec': 'Said the decimal is larger', 'mc-equal': 'Said they are equal',
    'u1l5-est-whole': 'Whole-number estimate off', 'u1l5-both-next': 'Not the next number that is both a square and a cube', 'u1l5-four-sides': 'Perimeter: didn’t use four sides', 'u1l5-six-faces': 'Surface area: didn’t use six faces'
  });
  HW.addPartial({ 'sqrt-halved': 'n', 'no-root': 'n', 'divided-by-index': 'n', 'said-not-perfect': 'n', 'said-perfect': 'n', 'root-value': 'n', 'bracket': 'n', 'estimate-far': 'n',
    'u1l5-closer': 'b', 'u1l5-not-bound': 'n', 'u1l5-tenth': 'n', 'u1l5-tenth-square': 's', 'u1l5-perimeter': 'b', 'u1l5-sa': 'b', 'u1l5-face': 'b', 'u1l5-volume': 'b', 'u1l5-times': 'b', 'u1l5-doubled-vol': 'n',
    'u1l5-side-from-perim': 'n', 'u1l5-product': 's', 'u1l5-count': 's', 'u1l5-list': 'b', 'u1l5-sum-roots': 'n', 'u1l5-sqrt-neg': 'n', 'u1l5-cube-sign': 's', 'u1l5-est-whole': 'b', 'u1l5-both-next': 'n',
    'u1l5-four-sides': 'b', 'u1l5-six-faces': 'b' });

  /* ---------- number helpers ---------- */
  function gen(r, make, okf, n) { var v; for (var i = 0; i < (n || 800); i++) { v = make(); if (okf(v)) return v; } return v; }
  function isSq(n) { var q = Math.round(Math.sqrt(n)); return q * q === n; }
  function isCu(n) { var q = Math.round(Math.cbrt(n)); return q * q * q === n; }
  function intRoot(n, k) { var r = Math.round(Math.pow(Math.abs(n), 1 / k)); for (var d = -1; d <= 1; d++) if (r + d >= 0 && Math.pow(r + d, k) === Math.abs(n)) return (n < 0 ? -1 : 1) * (r + d); return null; }
  function rad(n) { return nt.distinctPrimes(n).reduce(function (m, p) { return m * p; }, 1); }
  function plainFac(n) { return nt.factor(n).map(function (pe) { return pe[1] > 1 ? pe[0] + '^' + pe[1] : String(pe[0]); }).join(' × '); }
  function normX(s) { return String(s == null ? '' : s).replace(/(\d)\s*[xX]\s*(?=\d)/g, '$1*'); }
  function pw(k) { return k === 2 ? 'square' : 'cube'; }
  function rootTex(k, inner) { return (k === 2 ? '\\sqrt{' : '\\sqrt[3]{') + inner + '}'; }
  function powTex(b, k) { return (b < 0 || String(b).indexOf('.') >= 0 ? '(' + b + ')' : b) + '^{' + k + '}'; }
  function eqv(n) { var f = K.fac(n); return f === String(n) ? F(n) : f + '=' + F(n); }
  function fx(v, dp) { return K.roundTo(v, dp).toFixed(dp); }
  function cut(x, n) { var f = Math.pow(10, n); return (Math.floor(x * f) / f).toFixed(n); }
  function num(resp) { var p = HW.parse.number(resp == null ? '' : resp); return p.ok ? p.value : null; }
  var SQ_LIST = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225], CU_LIST = [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000];

  /* ---------- small checkers ---------- */
  function prodChk(n) {
    var c = K.product(n, 'either');
    return function (resp) { var s = normX(resp), pn = HW.parse.number(s); if (pn.ok && pn.value === n && !nt.isPrime(n)) return form('not-factored', 'Write ' + t(F(n)) + ' as a product of primes, like ' + t('2^{3}\\times 3') + '.'); return c(s); };
  }
  function valChk(target, diag) {
    return function (resp) {
      var s = normX(resp), pn = HW.parse.number(s), v = null;
      if (pn.ok) v = pn.value; else { var p = HW.parse.product(s); if (p.ok) v = p.value; else return form(pn.code === 'empty' ? 'empty' : 'notnumber', pn.code === 'empty' ? 'Type your answer first.' : 'Type a whole number.'); }
      if (v === target) return ok();
      var h = diag ? diag(v) : null;
      return h ? wrong(h.code, h.hint) : wrong('value', null);
    };
  }
  function isNo(s) { return /^(no|none|nope|not|neither|n\/a|n|-+|—|x)(\s.*|\.)?$/.test(s); }
  function isYes(s) { return /^(yes|y|yep)\b/.test(s); }
  function rootOrNone(root, k, nTex, diag) {
    var word = pw(k), vc = root != null ? valChk(root, diag) : null;
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim().toLowerCase();
      if (!s) return form('empty', 'Type the ' + word + ' root, or <b>none</b> if it is not a perfect ' + word + '.');
      if (isNo(s)) return root == null ? ok() : wrong('said-not-perfect', 'Look at the exponents in the prime factorization: are they all ' + (k === 2 ? 'even' : 'multiples of ' + t('3')) + '? Then ' + t(nTex) + ' <b>is</b> a perfect ' + word + '.');
      if (isYes(s)) return root != null ? form('yes-root', 'Right, it is a perfect ' + word + ' — now type the ' + word + ' root itself.') : wrong('said-perfect', 'Check the exponents in the prime factorization: are they <b>all</b> ' + (k === 2 ? 'even' : 'multiples of ' + t('3')) + '?');
      if (root == null) {
        var s2 = normX(s), pn = HW.parse.number(s2), pp = HW.parse.product(s2);
        if (!pn.ok && !pp.ok) return form('notnumber', 'Type a number, or <b>none</b>.');
        var v = pn.ok ? pn.value : pp.value, big = Math.pow(v, k);
        return wrong('said-perfect', (v % 1 ? 'A decimal root means the number is <b>not</b> a perfect ' + word + '. ' : (big < 1e12 ? t(F(v) + '^{' + k + '}=' + F(big)) + ', not ' + t(nTex) + '. ' : '')) + 'Look at the exponents in the prime factorization: are they all ' + (k === 2 ? 'even' : 'multiples of ' + t('3')) + '? If not, type <b>none</b>.');
      }
      return vc(s);
    };
  }
  function rootDiag(n, k) {
    var word = pw(k);
    return function (v) {
      if (v === n / k) return { code: 'divided-by-index', hint: 'A ' + word + ' root isn’t ' + (k === 2 ? 'half' : 'a third') + ' of the number. Which number times itself' + (k === 3 ? ' three times' : '') + ' gives ' + t(F(n)) + '?' };
      if (v === n) return { code: 'no-root', hint: 'That’s the number itself. Take its ' + word + ' root.' };
      if (n > 1 && v === rad(n) && v !== intRoot(n, k)) return { code: 'each-prime-once', hint: 'You used each prime once. Divide each <b>exponent</b> by ' + t(k) + ' instead.' };
      if (k === 3 && intRoot(n, 2) != null && v === intRoot(n, 2) && v !== intRoot(n, 3)) return { code: 'used-square-root', hint: 'That’s the <b>square</b> root. The cube root multiplies by itself <b>three</b> times to give ' + t(F(n)) + '.' };
      if (k === 2 && intRoot(n, 3) != null && v === intRoot(n, 3) && v !== intRoot(n, 2)) return { code: 'used-cube-root', hint: 'That’s the <b>cube</b> root. The square root multiplies by itself (twice) to give ' + t(F(n)) + '.' };
      if (v > 0 && v % 1 === 0 && Math.pow(v, k) < 1e12) return { code: 'root-value', hint: t(F(v) + '^{' + k + '}=' + F(Math.pow(v, k))) + ', not ' + t(F(n)) + '.' };
      return null;
    };
  }
  /* rounded calculator value, accepting one unit in the last place (a chopped value) */
  function calcCheck(x, dp, opt) {
    opt = opt || {};
    var base = K.approx(x, dp, opt), tol = Math.pow(10, -dp);
    return function (resp) {
      var r1 = base(resp); if (r1.v !== 'wrong') return r1;
      var p = HW.parse.number(resp == null ? '' : resp);
      if (p.ok) { var s = HW.parse.plain(String(resp)).replace(/\s/g, ''), d = (s.split('.')[1] || '').length; if (d === dp && Math.abs(p.value - x) <= tol + 1e-9) return ok(); }
      return r1;
    };
  }
  var TOL_HINT = { 1: 'Answers within ' + t('0.1') + ' of the calculator value are accepted.', 2: 'Answers within ' + t('0.01') + ' of the calculator value are accepted.' };
  /* "between L and L+1" boxes for a root */
  function boundChk(k, n, isLo) {
    var x = Math.pow(n, 1 / k), lo = Math.floor(x + 1e-9), hi = lo + 1, want = isLo ? lo : hi;
    return K.number(want, function (v) {
      if (!Number.isInteger(v)) return { code: 'bracket', hint: 'Give a whole number.' };
      if (v === Math.pow(want, k)) return { code: 'power-not-root', hint: t(Math.pow(want, k)) + ' is the perfect ' + pw(k) + '. Give the whole number it comes from: ' + t(rootTex(k, Math.pow(want, k)) + '=' + want) + '.' };
      if (isLo && v === hi) return { code: 'swapped-bounds', hint: 'That’s the larger whole number. The first box is the smaller one.' };
      if (!isLo && v === lo) return { code: 'swapped-bounds', hint: 'That’s the smaller whole number. The second box is the larger one.' };
      var vp = Math.pow(v, k);
      if (isLo) return vp > n ? { code: 'bracket', hint: 'Check: ' + t(powTex(v, k) + '=' + vp) + ', which is more than ' + t(n) + '.' } : { code: 'bracket', hint: 'Get closer: ' + t(powTex(v + 1, k) + '=' + Math.pow(v + 1, k)) + ' is still less than ' + t(n) + '.' };
      return vp < n ? { code: 'bracket', hint: 'Check: ' + t(powTex(v, k) + '=' + vp) + ', which is less than ' + t(n) + '.' } : { code: 'bracket', hint: 'Get closer: ' + t(powTex(v - 1, k) + '=' + Math.pow(v - 1, k)) + ' is still more than ' + t(n) + '.' };
    });
  }
  function closerInfo(k, n) {
    var lo = Math.floor(Math.pow(n, 1 / k) + 1e-9), hi = lo + 1, Lp = Math.pow(lo, k), Hp = Math.pow(hi, k), dLo = n - Lp, dHi = Hp - n;
    return { lo: lo, hi: hi, Lp: Lp, Hp: Hp, dLo: dLo, dHi: dHi, near: dLo < dHi ? lo : hi, nearP: dLo < dHi ? Lp : Hp,
      why: t(F(Lp) + '<' + F(n) + '<' + F(Hp)) + ': ' + t(F(n)) + ' is ' + t(dLo) + ' past ' + t(F(Lp)) + ' and ' + t(dHi) + ' short of ' + t(F(Hp)) + '.' };
  }
  function closerChk(k, n) {
    var c = closerInfo(k, n);
    return K.number(c.near, function (v) {
      if (v === c.lo || v === c.hi) return { code: 'u1l5-closer', hint: 'Compare the distances: ' + c.why + ' Which perfect ' + pw(k) + ' is ' + t(F(n)) + ' nearer to?' };
      if (v === c.nearP) return { code: 'power-not-root', hint: 'Give the whole number, not its ' + pw(k) + ': ' + t(rootTex(k, F(c.nearP)) + '=' + c.near) + '.' };
      return { code: 'u1l5-not-bound', hint: 'The closer whole number is one of the two numbers the root lies between.' };
    });
  }
  function bracketPart(k, n, text, extra) {
    var c = closerInfo(k, n), e = rootTex(k, F(n));
    return P.fields(t(e), [{ name: 'Smaller whole number', label: 'Between', after: '' }, { name: 'Larger whole number', label: 'and' }, { name: 'Closer to', label: 'Closer to' }],
      [boundChk(k, n, true), boundChk(k, n, false), closerChk(k, n)], [String(c.lo), String(c.hi), String(c.near)],
      t(c.lo + '<' + e + '<' + c.hi) + ', closer to ' + t(c.near),
      t(powTex(c.lo, k) + '=' + F(c.Lp)) + ' and ' + t(powTex(c.hi, k) + '=' + F(c.Hp)) + ', so ' + t(c.lo + '<' + e + '<' + c.hi) + '.<br>' + c.why + ' It is nearer to ' + t(F(c.nearP)) + ', so ' + t(e) + ' is closer to <b>' + t(c.near) + '</b>.' + (extra || ''),
      ['List the perfect ' + pw(k) + 's near ' + t(F(n)) + ' (' + (k === 2 ? t('1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, \\ldots') : t('1, 8, 27, 64, 125, 216, 343, 512, 729, 1000')) + ').', 'Subtract to see which perfect ' + pw(k) + ' ' + t(F(n)) + ' is nearer to.'], text || 'between ' + e);
  }
  /* one-decimal estimate without a calculator: the calculator value or the "distance" estimate, ±0.1 */
  function estChk(n, k) {
    k = k || 2;
    var x = Math.pow(n, 1 / k), c = closerInfo(k, n), lin = c.lo + c.dLo / (c.Hp - c.Lp), keyV = K.roundTo(x, 1);
    return function (resp) {
      var p = HW.parse.number(resp == null ? '' : resp);
      if (!p.ok) return form(p.code === 'empty' ? 'empty' : 'notnumber', p.code === 'empty' ? 'Type your estimate first.' : 'Give your estimate as one number with one decimal place.');
      var v = p.value, s = HW.parse.plain(String(resp)).replace(/\s/g, ''), d = (s.split('.')[1] || '').length;
      if (Math.abs(v - x) <= 0.1 + 1e-9 || Math.abs(v - K.roundTo(lin, 1)) < 1e-9) return d === 1 ? ok() : form('places', 'Good estimate — give it to one decimal place (tenths).');
      if (k === 2 && Math.abs(v - n / 2) < 0.6 && n > 6) return wrong('sqrt-halved', 'A square root isn’t half the number. ' + t(c.lo + '<' + rootTex(k, n) + '<' + c.hi) + '.');
      if (v < c.lo || v > c.hi) return wrong('bracket', 'Trap it first: ' + c.why + ' So ' + t(rootTex(k, n)) + ' is between ' + t(c.lo) + ' and ' + t(c.hi) + '.');
      return wrong('estimate-off', 'Between the right whole numbers, but not close enough. ' + c.why + ' ' + (c.dLo < c.dHi ? 'It sits ' + (c.dLo * 3 < c.dHi ? 'just above ' : 'a bit above ') + t(c.lo) + '.' : 'It sits ' + (c.dHi * 3 < c.dLo ? 'just below ' : 'a bit below ') + t(c.hi) + '.'));
    };
  }
  function estSol(n, k) {
    k = k || 2; var x = Math.pow(n, 1 / k), c = closerInfo(k, n), lin = c.lo + c.dLo / (c.Hp - c.Lp);
    return c.why + ' So ' + t(rootTex(k, F(n))) + ' is between ' + t(c.lo) + ' and ' + t(c.hi) + ', ' + (c.dLo < c.dHi ? 'closer to ' + t(c.lo) : 'closer to ' + t(c.hi)) + ': about ' + t(c.dLo + '/' + (c.Hp - c.Lp)) + ' of the way, so ' + t(rootTex(k, F(n)) + '\\approx ' + fx(lin, 1)) + '.<br>(Calculator check: ' + t(cut(x, 3) + '\\ldots\\approx ' + fx(x, 1)) + '.)';
  }
  function estimatePart(n, text) {
    var x = Math.sqrt(n);
    return { prompt: t('\\sqrt{' + F(n) + '}'), input: { type: 'number', before: t('\\sqrt{' + F(n) + '}\\approx') }, check: estChk(n), key: fx(x, 1), answer: t('\\sqrt{' + F(n) + '}\\approx ' + fx(x, 1)), solution: estSol(n),
      hints: ['Trap ' + t(F(n)) + ' between two perfect squares, then see which one it is nearer to.', 'Use the distances: e.g. ' + t('18') + ' is ' + t('2') + ' past ' + t('16') + ' out of the ' + t('9') + ' steps to ' + t('25') + ', so ' + t('\\sqrt{18}\\approx 4.2') + '.'], text: text || 'estimate sqrt ' + n,
      bad: [String(Math.floor(x) + 0.5 > x + 0.15 ? Math.floor(x) + 0.5 : Math.floor(x) + 0.9), String(n / 2)] };
  }
  function nonSqIn(r, lo, hi, test) { return gen(r, function () { return r.int(lo, hi); }, function (n) { return !isSq(n) && (!test || test(n)); }); }
  function nonCuIn(r, lo, hi, test) { return gen(r, function () { return r.int(lo, hi); }, function (n) { return !isCu(n) && (!test || test(n)); }); }
  /* clear-cut "closer": the two distances differ by at least 2 */
  function clear(k) { return function (n) { var c = closerInfo(k, n); return Math.abs(c.dLo - c.dHi) >= 2; }; }

  /* ---------- perfect-power test by prime factorization (from 10C u1l3) ---------- */
  function powerTestPart(n, k) {
    var word = pw(k), root = intRoot(n, k), f = nt.factor(n), rt = rootTex(k, F(n)), test = k === 2 ? 'even' : 'a multiple of ' + t('3');
    var bad = f.filter(function (pe) { return pe[1] % k; })[0];
    var fields = [{ name: 'Prime factorization', before: t(F(n) + '='), mode: 'math', wide: true }, { name: word === 'square' ? 'Square root' : 'Cube root', before: t(rt + '='), mode: 'text', placeholder: 'number, or none' }];
    var sol = t(F(n) + '=' + K.fac(n)) + '.<br>' + (root != null
      ? 'Every exponent is ' + test + ', so ' + t(F(n)) + ' <b>is</b> a perfect ' + word + '. ' + (k === 2 ? 'Halve' : 'Divide') + ' each exponent' + (k === 3 ? ' by ' + t('3') : '') + ': ' + t(rt + '=' + HW.texFactors(f.map(function (pe) { return [pe[0], pe[1] / k]; })) + '=' + F(root)) + '.'
      : 'The exponent of ' + t(bad[0]) + ' is ' + t(bad[1]) + ', which is not ' + test + ', so ' + t(F(n)) + ' is <b>not</b> a perfect ' + word + '.');
    var p = P.fields('Is ' + t(F(n)) + ' a perfect ' + word + '? Write its prime factorization, then give ' + t(rt) + ' — or type <b>none</b> if it is not a perfect ' + word + '.', fields,
      [prodChk(n), rootOrNone(root, k, F(n), rootDiag(n, k))], [plainFac(n), root != null ? String(root) : 'none'],
      t(F(n) + '=' + K.fac(n)) + '<br>' + (root != null ? 'Perfect ' + word + ': ' + t(rt + '=' + F(root)) : 'Not a perfect ' + word + '.'), sol,
      ['Factor ' + t(F(n)) + ' into primes (a division ladder helps) and look at the exponents.', 'A perfect ' + word + ' has every exponent ' + test + '. ' + (k === 2 ? 'Halve' : 'Divide') + ' each exponent' + (k === 3 ? ' by 3' : '') + ' to get the root.'],
      'perfect ' + word + '? ' + n);
    p.good = root != null ? [[nt.primeList(n).join('x'), String(root)]] : [[plainFac(n), 'no']];
    p.bad = root != null ? [[plainFac(n), 'no'], [plainFac(n), String(root + 1)]] : [[plainFac(n), String(Math.round(Math.pow(n, 1 / k)))], [plainFac(n), 'yes']];
    return p;
  }
  function multFor(n, k) { return nt.factor(n).reduce(function (m, pe) { return m * Math.pow(pe[0], (k - pe[1] % k) % k); }, 1); }
  function multPart(n, k) {
    var word = pw(k), m = multFor(n, k), N = n * m, rt = intRoot(N, k), test = k === 2 ? 'even' : 'a multiple of ' + t('3');
    var mdiag = function (v) {
      if (!(v >= 1) || v % 1) return null;
      var w = n * v;
      if (intRoot(w, k) != null) return v === n ? { code: 'times-itself', hint: 'Multiplying by the number itself does give a perfect ' + word + ', but not with the <b>smallest</b> multiplier. Raise each exponent only as far as the next ' + (k === 2 ? 'even number' : 'multiple of ' + t('3')) + '.' } : { code: 'not-smallest', hint: t(F(n) + '\\times ' + F(v)) + ' is a perfect ' + word + ', but a smaller multiplier works.' };
      if (k === 3 && intRoot(w, 2) != null) return { code: 'made-square', hint: 'That makes a perfect <b>square</b>, but you need a perfect <b>cube</b>: every exponent must reach a multiple of ' + t('3') + '.' };
      if (k === 2 && intRoot(w, 3) != null) return { code: 'made-cube', hint: 'That makes a perfect <b>cube</b>, but you need a perfect <b>square</b>: every exponent must be even.' };
      if (m % v === 0) return { code: 'missed-prime', hint: 'Not quite: after multiplying by ' + t(F(v)) + ', some exponent is still not ' + test + '. Check every prime.' };
      return null;
    };
    var fN = nt.factor(n), fNN = nt.factor(N);
    var p = P.fields('Find the <b>smallest</b> whole number ' + t(F(n)) + ' can be multiplied by so that the product is a perfect ' + word + '. Give the product and its ' + word + ' root.',
      [{ name: 'Multiplier', label: 'Multiply by' }, { name: 'Product', label: 'Product' }, { name: (k === 2 ? 'Square' : 'Cube') + ' root', label: (k === 2 ? 'Square' : 'Cube') + ' root' }],
      [K.number(m, mdiag), K.number(N, function (v) { return v === n * n && m !== n ? { code: 'u1l5-product', hint: 'That’s ' + t(F(n)) + ' times itself. Use your multiplier: ' + t(F(n) + '\\times\\square') + '.' } : { code: 'u1l5-product', hint: 'Multiply: ' + t(F(n)) + ' times your multiplier.' }; }),
        valChk(rt, function (v) { if (v === N / k) return { code: 'divided-by-index', hint: 'A ' + word + ' root isn’t ' + (k === 2 ? 'half' : 'a third') + ' of the number.' }; if (v === intRoot(n, k)) return { code: 'root-value', hint: 'Take the root of the <b>product</b>.' }; return { code: 'root-value', hint: 'Which number ' + (k === 2 ? 'squared' : 'cubed') + ' gives ' + t(F(N)) + '?' }; })],
      [String(m), String(N), String(rt)],
      'Multiply by ' + t(F(m)) + ': ' + t(F(n) + '\\times ' + F(m) + '=' + F(N)) + ', and ' + t(rootTex(k, F(N)) + '=' + F(rt)),
      t(F(n) + '=' + K.fac(n)) + '. Raise each exponent that isn’t ' + test + ' to the next ' + (k === 2 ? 'even number' : 'multiple of ' + t('3')) + ': ' +
        fN.filter(function (pe) { return pe[1] % k; }).map(function (pe) { return t(pe[0] + '^{' + pe[1] + '}\\to ' + pe[0] + '^{' + (pe[1] + (k - pe[1] % k)) + '}'); }).join(', ') + '.<br>Multiply by ' + t(eqv(m)) + '. Product: ' + t(F(n) + '\\times ' + F(m) + '=' + F(N) + '=' + HW.texFactors(fNN)) + '.<br>' + (k === 2 ? 'Square' : 'Cube') + ' root: ' + t(rootTex(k, F(N)) + '=' + HW.texFactors(fNN.map(function (pe) { return [pe[0], pe[1] / k]; })) + '=' + F(rt)) + '.',
      ['Write the prime factorization. Which exponents are not ' + test + '?', 'Bring each of those up to the next ' + (k === 2 ? 'even number' : 'multiple of ' + t('3')) + ' — and no further.'],
      'multiply to perfect ' + word + ': ' + n);
    p.bad = [[String(n), String(n * n), String(n)], [String(m * 2 === n ? m * 3 : m * 2), String(N * (m * 2 === n ? 3 : 2)), String(rt)]];
    return p;
  }
  /* a square or cube root typed as a number */
  function rootNum(k, n, coef, text) {
    var rt = intRoot(n, k), c = coef || 1, ans = c * rt, e = (c > 1 ? c : '') + rootTex(k, F(n));
    var d0 = rootDiag(n, k);
    return P.number(t(e), ans, function (v) {
      if (c > 1 && v === rt) return { code: 'coef-forgot', hint: t(rootTex(k, F(n)) + '=' + rt) + ' — now multiply by the ' + t(c) + ' in front.' };
      if (c > 1 && v === c * n) return { code: 'no-root', hint: 'Take the cube root of ' + t(n) + ' first, then multiply by ' + t(c) + '.' };
      if (c > 1 && v === intRoot(c * n, k)) return { code: 'coef-forgot', hint: 'The ' + t(c) + ' is outside the root: find ' + t(rootTex(k, F(n))) + ' first, then multiply.' };
      return d0(c > 1 ? v / c : v);
    }, (c > 1 ? t(rootTex(k, F(n)) + '=' + rt) + ' because ' + t(powTex(rt, k) + '=' + F(n)) + ', so ' + t(e + '=' + c + '(' + rt + ')=' + ans) : t(e + '=' + F(rt)) + ' because ' + t(k === 2 ? rt + '\\times ' + rt + '=' + F(n) : rt + '\\times ' + rt + '\\times ' + rt + '=' + F(n))) + '.',
      [k === 2 ? 'Which number times itself gives ' + t(F(n)) + '? Use the table of perfect squares.' : 'Which number times itself three times gives ' + t(F(n)) + '? Use the table of perfect cubes.'], text || 'evaluate ' + e.replace(/\\sqrt\[3\]\{([^}]*)\}/, '∛$1').replace(/\\sqrt\{([^}]*)\}/, '√$1'), { before: t(e + '=') });
  }
  function kindOfN(n) { var s = isSq(n), c = isCu(n); return s && c ? 'both' : s ? 'sq' : c ? 'cu' : 'neither'; }
  function kindPick(r, kind) {
    if (kind === 'sq') return r.pick([4, 9, 16, 25, 36, 49, 81, 100, 121, 144, 169, 196, 225]);
    if (kind === 'cu') return r.pick([8, 27, 125, 216, 343, 512, 1000]);
    if (kind === 'both') return r.pick([1, 64, 64]);
    return gen(r, function () { return r.int(2, 250); }, function (n) { return !isSq(n) && !isCu(n); });
  }
  function kindMC(r, n) {
    var k = kindOfN(n), sr = intRoot(n, 2), cr = intRoot(n, 3), lo2 = Math.floor(Math.sqrt(n)), lo3 = Math.floor(Math.cbrt(n) + 1e-9);
    var sqTxt = sr != null ? t(F(n) + '=' + sr + '^{2}') : t(lo2 + '^{2}=' + lo2 * lo2) + ' and ' + t((lo2 + 1) + '^{2}=' + (lo2 + 1) * (lo2 + 1)) + ', so it is not a perfect square';
    var cuTxt = cr != null ? t(F(n) + '=' + cr + '^{3}') : t(lo3 + '^{3}=' + Math.pow(lo3, 3)) + ' and ' + t((lo3 + 1) + '^{3}=' + Math.pow(lo3 + 1, 3)) + ', so it is not a perfect cube';
    var name = { sq: 'a perfect square', cu: 'a perfect cube', both: 'both', neither: 'neither' };
    var p = P.mc(r, t(F(n)), ['sq', 'cu', 'both', 'neither'].map(function (c) {
      return { html: cap(name[c]), right: c === k, code: c, why: c === k ? null : 'Check both tables: ' + sqTxt + '; ' + cuTxt + '.' };
    }), sqTxt + '.<br>' + cuTxt + '.<br><b>' + cap(name[k]) + '.</b>', ['Look for ' + t(F(n)) + ' in the table of perfect squares and in the table of perfect cubes.'], 'square/cube/both/neither ' + n, true);
    p.input.columns = 2;
    return p;
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------- figures ---------- */
  function squareFig(lab) {
    return '<svg viewBox="0 0 150 120" width="100%" style="max-width:170px;display:block;margin:6px 0" role="img" aria-label="a square"><rect x="35" y="15" width="85" height="85" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
      '<text x="77" y="62" font-size="13" text-anchor="middle" fill="currentColor">' + lab + '</text><text x="77" y="115" font-size="13" text-anchor="middle" fill="currentColor" font-style="italic">s</text></svg>';
  }
  function cubeFig(lab) {
    return '<svg viewBox="0 0 160 130" width="100%" style="max-width:180px;display:block;margin:6px 0" role="img" aria-label="a cube"><g fill="none" stroke="currentColor" stroke-width="1.6"><rect x="20" y="40" width="75" height="75"/><path d="M20 40 L50 12 L125 12 L95 40 M125 12 L125 87 L95 115"/></g>' +
      '<text x="57" y="82" font-size="13" text-anchor="middle" fill="currentColor">' + lab + '</text><text x="57" y="128" font-size="13" text-anchor="middle" fill="currentColor" font-style="italic">e</text></svg>';
  }

  /* ---------- the lesson ---------- */
  HW.defineLesson({
    id: 'u1l5', unit: 1, num: '5', title: 'Perfect Squares, Perfect Cubes, and Estimating Roots', outcome: 'AN1',
    blurb: 'Perfect squares and cubes from memory, square and cube roots, trapping a root between two whole numbers, estimating it, and finding it with a calculator.',
    questions: [
      /* ================= Part A — Perfect Squares and Perfect Cubes ================= */
      { num: '1', section: 'Part A — Perfect Squares and Perfect Cubes', stem: 'Evaluate each square root mentally.', parts: ['a', 'b', 'c', 'd', 'e', 'f'].map(function (L, i) {
        var big = i === 2 || i === 4 || i === 5;
        return { id: '1' + L, level: big ? 'BEG' : 'LIM', make: function (r) { var k = big ? r.int(10, 15) : r.int(2, 9); return rootNum(2, k * k); } };
      }) },
      { num: '2', stem: 'Evaluate each cube root mentally.', parts: [
        { id: '2a', level: 'LIM', make: function (r) { return rootNum(3, Math.pow(r.int(1, 4), 3)); } },
        { id: '2b', level: 'LIM', make: function (r) { return rootNum(3, Math.pow(r.int(2, 6), 3)); } },
        { id: '2c', level: 'LIM', make: function (r) { return rootNum(3, Math.pow(r.int(4, 10), 3)); } },
        { id: '2d', level: 'BEG', make: function (r) { var c = r.int(2, 5), s = r.int(2, 5); return rootNum(3, s * s * s, c); } },
        { id: '2e', level: 'LIM', make: function (r) { return rootNum(3, Math.pow(r.int(2, 10), 3)); } }] },
      { num: '3', stem: 'Is each number a <i>perfect square</i>, a <i>perfect cube</i>, <i>both</i>, or <i>neither</i>?', parts: [['a', 'sq'], ['b', 'both'], ['c', 'neither'], ['d', 'both'], ['e', 'neither'], ['f', 'cu']].map(function (x, i) {
        return { id: '3' + x[0], level: x[1] === 'both' ? 'BEG' : i < 3 ? 'LIM' : 'BEG', make: function (r) {
          var kind = x[1] === 'both' ? (r.chance(0.5) ? 'both' : r.pick(['sq', 'cu', 'neither'])) : r.chance(0.6) ? x[1] : r.pick(['sq', 'cu', 'neither', 'both']);
          return kindMC(r, kindPick(r, kind));
        } };
      }) },

      /* ================= Part B — Estimating Square Roots ================= */
      { num: '4', section: 'Part B — Estimating Square Roots', outcome: 'AN2', stem: 'State the two consecutive whole numbers each root lies between, and which one it is closer to.', parts: [
        { id: '4a', level: 'BEG', make: function (r) { return bracketPart(2, nonSqIn(r, 10, 48, clear(2))); } },
        { id: '4b', level: 'BEG', make: function (r) { return bracketPart(2, nonSqIn(r, 50, 99, clear(2))); } },
        { id: '4c', level: 'EMG', make: function (r) { return bracketPart(2, nonSqIn(r, 101, 224, clear(2))); } },
        { id: '4d', level: 'BEG', make: function (r) { return bracketPart(2, nonSqIn(r, 26, 99, clear(2))); } }] },
      { num: '5', outcome: 'AN2', stem: 'Using the whole-number method (no calculator), estimate each square root to one decimal place.', parts: [
        { id: '5a', level: 'BEG', make: function (r) { return estimatePart(nonSqIn(r, 5, 48)); } },
        { id: '5b', level: 'EMG', make: function (r) { return estimatePart(nonSqIn(r, 50, 120)); } }] },
      { num: '6', outcome: 'AN2', stem: 'Use a calculator to evaluate each square root to the nearest hundredth.', parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: '6' + L, level: i ? 'BEG' : 'LIM', make: function (r) {
          var n = nonSqIn(r, [10, 50, 100][i], [49, 99, 200][i]), x = Math.sqrt(n), d3 = Number(cut(x, 3).slice(-1));
          var p = P.approx(t('\\sqrt{' + n + '}'), x, 2, { before: t('\\sqrt{' + n + '}\\approx') }, t('\\sqrt{' + n + '}=' + cut(x, 5) + '\\ldots\\approx ' + fx(x, 2)) + '. (The digit after the hundredths is ' + t(d3) + ', so ' + (d3 >= 5 ? 'round up' : 'the hundredths digit stays') + '.)',
            ['Press ' + t('\\sqrt{\\ }') + ', enter ' + t(n) + ', press =, then round to two decimal places. ' + TOL_HINT[2]], 'calc sqrt ' + n + ' to 0.01');
          p.check = calcCheck(x, 2); p.bad = [fx(x + 0.05, 2), fx(n / 2, 2)];
          return p;
        } };
      }) },
      { num: '7', outcome: 'AN2', stem: 'Use a calculator to evaluate each square root to the nearest tenth.', parts: ['a', 'b'].map(function (L, i) {
        return { id: '7' + L, level: 'BEG', make: function (r) {
          var n = nonSqIn(r, i ? 50 : 5, i ? 120 : 48), x = Math.sqrt(n);
          var p = P.approx(t('\\sqrt{' + n + '}'), x, 1, { before: t('\\sqrt{' + n + '}\\approx') }, t('\\sqrt{' + n + '}=' + cut(x, 4) + '\\ldots\\approx ' + fx(x, 1)) + '.', ['Calculator: ' + t('\\sqrt{' + n + '}') + ', then round to one decimal place. ' + TOL_HINT[1]], 'calc sqrt ' + n + ' to 0.1');
          p.check = calcCheck(x, 1); p.bad = [fx(x + 0.25, 1), String(Math.round(x))];
          return p;
        } };
      }) },
      { num: '8', outcome: 'AN2', stem: 'Decide whether each statement is true or false.',
        shared: function (r) { var n = nonSqIn(r, 20, 140, function (n) { var c = closerInfo(2, n); return Math.abs(c.dLo - c.dHi) >= 3; }); return { n: n, c: closerInfo(2, n) }; },
        parts: [
          { id: '8a', level: 'BEG', make: function (r, sh) {
            var c = sh.c, tr = r.chance(0.6), a = tr ? c.lo : r.pick([c.lo - 1, c.hi]);
            return P.tf(r, t('\\sqrt{' + sh.n + '}') + ' is between ' + t(a) + ' and ' + t(a + 1) + '.', tr, tr ? null : t(c.lo * c.lo + '<' + sh.n + '<' + c.hi * c.hi) + ', so ' + t('\\sqrt{' + sh.n + '}') + ' is between ' + t(c.lo) + ' and ' + t(c.hi) + '.',
              '<b>' + (tr ? 'True' : 'False') + '.</b> ' + t(c.lo + '^{2}=' + c.lo * c.lo) + ' and ' + t(c.hi + '^{2}=' + c.hi * c.hi) + ', and ' + t(c.lo * c.lo + '<' + sh.n + '<' + c.hi * c.hi) + ', so ' + t(c.lo + '<\\sqrt{' + sh.n + '}<' + c.hi) + '.', ['Square both whole numbers. Is ' + t(sh.n) + ' between the squares?'], 'sqrt between');
          } },
          { id: '8b', level: 'BEG', make: function (r, sh) {
            var c = sh.c, aim = r.chance(0.5) ? c.hi : c.lo, other = aim === c.hi ? c.lo : c.hi, tr = aim === c.near;
            return P.tf(r, t('\\sqrt{' + sh.n + '}') + ' is closer to ' + t(aim) + ' than to ' + t(other) + '.', tr, c.why,
              '<b>' + (tr ? 'True' : 'False') + '.</b> ' + c.why + ' So it is closer to ' + t(c.near) + '.', ['Compare ' + t(sh.n) + ' with the two perfect squares around it. Which is nearer?'], 'sqrt closer');
          } },
          { id: '8c', level: 'LIM', outcome: 'AN1', make: function (r) {
            var tr = r.chance(0.6), n = tr ? Math.pow(r.int(4, 15), 2) : nonSqIn(r, 20, 220, function (n) { return n % 10 === 0 || n % 5 === 0; });
            return P.tf(r, t(n) + ' is a perfect square.', tr, tr ? t(n + '=' + Math.sqrt(n) + '\\times ' + Math.sqrt(n)) + '.' : t(Math.floor(Math.sqrt(n)) + '^{2}=' + Math.pow(Math.floor(Math.sqrt(n)), 2)) + ' and ' + t(Math.ceil(Math.sqrt(n)) + '^{2}=' + Math.pow(Math.ceil(Math.sqrt(n)), 2)) + ' — nothing in between squares to ' + t(n) + '.',
              '<b>' + (tr ? 'True' : 'False') + '.</b> ' + (tr ? t(n + '=' + Math.sqrt(n) + '\\times ' + Math.sqrt(n)) : t(Math.floor(Math.sqrt(n)) + '^{2}=' + Math.pow(Math.floor(Math.sqrt(n)), 2)) + ' and ' + t(Math.ceil(Math.sqrt(n)) + '^{2}=' + Math.pow(Math.ceil(Math.sqrt(n)), 2))) + '.', ['Check the table of perfect squares.'], 'perfect square? ' + n);
          } },
          { id: '8d', level: 'LIM', outcome: 'AN1', make: function (r, sh) {
            var n = sh.n;
            return P.tf(r, t(n) + ' is a perfect square.', false, t(sh.c.lo + '^{2}=' + sh.c.lo * sh.c.lo) + ' and ' + t(sh.c.hi + '^{2}=' + sh.c.hi * sh.c.hi) + ' — no whole number squares to ' + t(n) + '.',
              '<b>False.</b> ' + t(sh.c.lo + '^{2}=' + sh.c.lo * sh.c.lo) + ' and ' + t(sh.c.hi + '^{2}=' + sh.c.hi * sh.c.hi) + ': nothing squares to ' + t(n) + ' (that is why ' + t('\\sqrt{' + n + '}') + ' isn’t a whole number).', ['Check the table of perfect squares.'], 'perfect square? ' + n);
          } }] },

      /* ================= Part C — Applications and Review ================= */
      { num: '9', section: 'Part C — Applications and Review', outcome: 'AN2', stem: '', parts: [
        { id: '9', level: 'BEG', make: function (r) {
          var A = nonSqIn(r, 20, 150, function (n) { var x = Math.sqrt(n); return Math.abs(x - Math.floor(x) - 0.5) > 0.12; }), x = Math.sqrt(A), unit = r.pick([['rug', 'ft'], ['rug', 'm'], ['garden', 'm'], ['tile', 'cm']]);
          var p = P.fields(squareFig('A = ' + A + ' ' + unit[1] + '²') + 'A square ' + unit[0] + ' covers an area of ' + t(A + '\\text{ ' + unit[1] + '}^{2}') + '. Estimate its side length to the nearest whole number, then use a calculator to find it to the nearest hundredth of a ' + (unit[1] === 'ft' ? 'foot' : unit[1] === 'm' ? 'metre' : 'centimetre') + '.',
            [{ name: 'Estimate', label: 'Estimate: ' + t('s\\approx'), after: unit[1] }, { name: 'Calculator', label: 'Calculator: ' + t('s\\approx'), after: unit[1] }],
            [K.number(Math.round(x), function (v) { if (v === A / 2 || v === A / 4) return { code: 'sqrt-halved', hint: 'The side of a square is the <b>square root</b> of its area: ' + t('s=\\sqrt{A}') + '.' }; return { code: 'u1l5-est-whole', hint: closerInfo(2, A).why + ' Which whole number is ' + t('\\sqrt{' + A + '}') + ' closest to?' }; }), calcCheck(x, 2, { diag: function (v) { return Math.abs(v - A / 4) < 0.01 ? { code: 'sqrt-halved', hint: 'Area isn’t four times the side. Use ' + t('s=\\sqrt{A}') + '.' } : null; } })],
            [String(Math.round(x)), fx(x, 2)], t('s\\approx ' + Math.round(x)) + ' ' + unit[1] + '; ' + t('s=\\sqrt{' + A + '}\\approx ' + fx(x, 2)) + ' ' + unit[1],
            t('s=\\sqrt{A}=\\sqrt{' + A + '}') + '. ' + closerInfo(2, A).why + ' So ' + t('s\\approx ' + Math.round(x)) + ' ' + unit[1] + '.<br>Calculator: ' + t('\\sqrt{' + A + '}=' + cut(x, 4) + '\\ldots\\approx ' + fx(x, 2)) + ' ' + unit[1] + '.',
            ['The side of a square is the square root of its area: ' + t('s=\\sqrt{A}') + '.', 'For the estimate, find the nearest perfect square. ' + TOL_HINT[2]], 'square side from area ' + A);
          p.bad = [[String(Math.round(A / 4)), fx(A / 4, 2)]];
          return p;
        } }] },
      { num: '10', outcome: 'AN2', stem: '', parts: [
        { id: '10', level: 'EMG', make: function (r) {
          var V = nonCuIn(r, 10, 900, function (n) { var x = Math.cbrt(n); return Math.abs(x - Math.floor(x) - 0.5) > 0.12; }), x = Math.cbrt(V), unit = r.pick([['water tank', 'm'], ['storage crate', 'cm'], ['box', 'cm'], ['water tank', 'm']]);
          var p = P.fields(cubeFig('V = ' + V + ' ' + unit[1] + '³') + 'A cube-shaped ' + unit[0] + ' has a volume of ' + t(V + '\\text{ ' + unit[1] + '}^{3}') + '. Estimate its edge length to the nearest whole number, then use a calculator to find it to the nearest hundredth of a ' + (unit[1] === 'm' ? 'metre' : 'centimetre') + '.',
            [{ name: 'Estimate', label: 'Estimate: ' + t('e\\approx'), after: unit[1] }, { name: 'Calculator', label: 'Calculator: ' + t('e\\approx'), after: unit[1] }],
            [K.number(Math.round(x), function (v) { if (Math.abs(v - V / 3) < 1) return { code: 'divided-by-index', hint: 'The edge is the <b>cube root</b> of the volume, not a third of it: ' + t('e=\\sqrt[3]{V}') + '.' }; if (v === Math.round(Math.sqrt(V))) return { code: 'used-square-root', hint: 'That’s about the <b>square</b> root. A cube uses the cube root: ' + t('e=\\sqrt[3]{V}') + '.' }; return { code: 'u1l5-est-whole', hint: closerInfo(3, V).why + ' Which whole number is ' + t('\\sqrt[3]{' + V + '}') + ' closest to?' }; }),
              calcCheck(x, 2, { diag: function (v) { return Math.abs(v - Math.sqrt(V)) < 0.011 ? { code: 'used-square-root', hint: 'That’s the <b>square</b> root. Use the cube root key (' + t('\\sqrt[3]{\\ }') + ', or ' + t('\\sqrt[x]{\\ }') + ' with ' + t('x=3') + ').' } : null; } })],
            [String(Math.round(x)), fx(x, 2)], t('e\\approx ' + Math.round(x)) + ' ' + unit[1] + '; ' + t('e=\\sqrt[3]{' + V + '}\\approx ' + fx(x, 2)) + ' ' + unit[1],
            t('e=\\sqrt[3]{V}=\\sqrt[3]{' + V + '}') + '. ' + closerInfo(3, V).why + ' So ' + t('e\\approx ' + Math.round(x)) + ' ' + unit[1] + '.<br>Calculator: ' + t('\\sqrt[3]{' + V + '}=' + cut(x, 4) + '\\ldots\\approx ' + fx(x, 2)) + ' ' + unit[1] + '.',
            ['The edge of a cube is the cube root of its volume: ' + t('e=\\sqrt[3]{V}') + '.', 'For the estimate, find the nearest perfect cube (' + t('8, 27, 64, 125, 216, 343, 512, 729, 1000') + '). ' + TOL_HINT[2]], 'cube edge from volume ' + V);
          p.bad = [[String(Math.round(Math.sqrt(V))), fx(Math.sqrt(V), 2)]].filter(function (b) { return b[0] !== String(Math.round(x)); });
          if (!p.bad.length) p.bad = [[String(Math.round(x) + 1), fx(Math.sqrt(V), 2)]];
          return p;
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'LIM', make: function (r) {
          var k = r.int(6, 14), sq = k * k, others = r.shuffle([k * k - r.int(1, 3), (k - 1) * (k - 1) + r.int(2, 2 * k - 4), (k + 1) * (k + 1) + r.int(1, 2 * k), k * 10 === sq ? sq + 10 : k * 10]).filter(function (v, i, a) { return !isSq(v) && a.indexOf(v) === i && v !== sq; }).slice(0, 3);
          while (others.length < 3) others.push(sq + 1 + others.length);
          var opts = [{ html: t(sq), right: true }].concat(others.map(function (v) { var lo = Math.floor(Math.sqrt(v)); return { html: t(v), why: t(lo + '^{2}=' + lo * lo) + ' and ' + t((lo + 1) + '^{2}=' + (lo + 1) * (lo + 1)) + ', so ' + t(v) + ' is not a perfect square.' }; }));
          opts.sort(function (a, b) { return Number(a.html.replace(/[^0-9]/g, '')) - Number(b.html.replace(/[^0-9]/g, '')); });
          return P.mc(r, 'Which of the following is a perfect square?', opts, t(sq + '=' + k + '\\times ' + k) + '. The others fall between consecutive perfect squares.', ['Check each number against the table of perfect squares.'], 'MC perfect square', true);
        } }] },
      { num: '12', outcome: 'AN2', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var n = nonSqIn(r, 10, 150), lo = Math.floor(Math.sqrt(n)), start = Math.max(1, lo - r.int(1, 2));
          var opts = [0, 1, 2, 3].map(function (i) { var a = start + i; return { html: t(a) + ' and ' + t(a + 1), right: a === lo, why: a === lo ? null : t(a + '^{2}=' + a * a) + ' and ' + t((a + 1) + '^{2}=' + (a + 1) * (a + 1)) + (a > lo ? ': both are more than ' + t(n) + '.' : ': both are less than ' + t(n) + '.') }; });
          return P.mc(r, t('\\sqrt{' + n + '}') + ' lies between which two whole numbers?', r.shuffle(opts), t(lo + '^{2}=' + lo * lo) + ' and ' + t((lo + 1) + '^{2}=' + (lo + 1) * (lo + 1)) + ', and ' + t(lo * lo + '<' + n + '<' + (lo + 1) * (lo + 1)) + ', so ' + t(lo + '<\\sqrt{' + n + '}<' + (lo + 1)) + '.', ['Which two perfect squares is ' + t(n) + ' between?'], 'MC sqrt' + n + ' between', true);
        } }] },
      { num: '13', outcome: 'AN2', stem: '<i>(Numerical Response)</i>', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          var n = nonSqIn(r, 11, 99, function (n) { var x = Math.sqrt(n) * 100; return Math.abs(x - Math.floor(x) - 0.5) > 0.05; }), x = Math.sqrt(n);
          var p = P.approx('To the nearest hundredth, ' + t('\\sqrt{' + n + '}=') + ' ________.', x, 2, { nr: true }, t('\\sqrt{' + n + '}=' + cut(x, 5) + '\\ldots\\approx ' + fx(x, 2)) + '. Record ' + t(fx(x, 2)) + '.',
            ['Calculator, then round to two decimal places. ' + TOL_HINT[2], 'Numerical response: record all four characters, e.g. ' + t('6.93') + '.'], 'NR sqrt' + n);
          p.check = calcCheck(x, 2, { nr: true }); p.bad = [fx(x + 0.04, 2)];
          return p;
        } }] },
      { num: '14', outcome: 'AN2', stem: 'You know the two whole numbers a square root lies between.', parts: [
        { id: '14', level: 'BEG', make: function (r) {
          var n = nonSqIn(r, 20, 99, clear(2)), c = closerInfo(2, n);
          return P.mc(r, 'How do you decide which whole number it is closer to? (Example: ' + t('\\sqrt{' + n + '}') + ', which is between ' + t(c.lo) + ' and ' + t(c.hi) + '.)', [
            { html: 'Compare the number under the root with the two perfect squares around it (' + t(c.Lp) + ' and ' + t(c.Hp) + '). The root is closer to the whole number whose perfect square is nearer.', right: true },
            { html: 'It is always closer to the smaller whole number, ' + t(c.lo) + '.', why: 'Not always: if the number is nearer the bigger perfect square, the root is closer to the bigger whole number.' },
            { html: 'Halve the number under the root and see which whole number that is nearer to.', why: 'Halving isn’t square-rooting: half of ' + t(n) + ' is ' + t(n / 2) + ', nowhere near ' + t('\\sqrt{' + n + '}') + '.' },
            { html: 'Look at the last digit of the number: ' + t('0') + '–' + t('4') + ' means the smaller, ' + t('5') + '–' + t('9') + ' means the bigger.', why: 'Rounding rules for digits don’t apply here. Compare the distances to the perfect squares.' }],
            c.why + ' ' + t(n) + ' is nearer to ' + t(c.nearP) + ', so ' + t('\\sqrt{' + n + '}') + ' is closer to ' + t(c.near) + '.', ['Think about the perfect squares on either side.'], 'how to decide closer');
        } }] }
    ],

    extra: [
      /* ================= Extra practice A — Testing big numbers with prime factorization ================= */
      { num: '1', section: 'Extra practice A — Testing Big Numbers with Prime Factorization', stem: 'A number is a <b>perfect square</b> exactly when <b>every</b> exponent in its prime factorization is even.', parts: [
        { id: 'e1a', level: 'EMG', make: function (r) { return powerTestPart(Math.pow(r.pick([42, 36, 24, 30, 28, 44, 48, 40, 45, 32, 26, 34, 38, 46, 22, 33, 39, 35, 27, 50]), 2), 2); } },
        { id: 'e1b', level: 'EMG', make: function (r) { return powerTestPart(Math.pow(r.pick([35, 25, 45, 55, 65, 15, 75, 21, 33, 39, 51, 57, 63, 69, 77, 85, 49, 91, 95, 99]), 2), 2); } },
        { id: 'e1c', level: 'EMG', make: function (r) { return powerTestPart(r.pick([600, 720, 540, 1000, 1200, 800, 360, 1500, 2000, 450, 500, 980, 1350, 1250, 2400, 1800, 288, 392, 3000, 1440].filter(function (n) { return !isSq(n); })), 2); } },
        { id: 'e1d', level: 'BEG', make: function (r) { return powerTestPart(Math.pow(r.pick([21, 14, 18, 15, 22, 26, 12, 24, 16, 20, 28, 30, 17, 19, 23, 25, 27, 13, 11, 29]), 2), 2); } }] },
      { num: '2', stem: 'A number is a <b>perfect cube</b> exactly when every exponent in its prime factorization is a multiple of ' + t('3') + '.', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { return powerTestPart(Math.pow(r.pick([12, 15, 14, 18, 20, 21, 24, 10, 16, 30, 22, 28, 11, 13, 25, 26, 33, 35, 36, 40]), 3), 3); } },
        { id: 'e2b', level: 'EMG', make: function (r) { return powerTestPart(r.pick([2000, 1080, 500, 1500, 864, 4000, 2400, 6000, 1350, 720, 3000, 1600, 2500, 5000, 1200, 900, 1800, 4500, 7200, 640].filter(function (n) { return !isCu(n); })), 3); } },
        { id: 'e2c', level: 'EMG', make: function (r) { return powerTestPart(Math.pow(r.pick([15, 12, 14, 18, 21, 24, 20, 30, 10, 16, 22, 28, 35, 36, 45, 42, 11, 13, 17, 19]), 3), 3); } },
        { id: 'e2d', level: 'EMG', make: function (r) { return powerTestPart(r.pick([1080, 2000, 540, 1350, 3600, 1440, 2160, 1200, 4320, 6480, 7000, 3375 * 2, 1728 * 5, 250, 432, 1125, 2700, 8100, 1000 * 3, 5400].filter(function (n) { return !isCu(n); })), 3); } }] },
      { num: '3', stem: 'Find the <b>smallest</b> whole number each value could be multiplied by so that the product is a perfect square. State the product and its square root.', parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
        return { id: 'e3' + L, level: i === 3 ? 'PRG' : 'EMG', make: function (r) {
          var n = gen(r, function () { var s = i === 3 ? r.int(4, 10) : r.int(2, 5), m = r.pick([2, 3, 5, 6, 7, 10]); return s * s * m; }, function (n) { return !isSq(n) && n <= (i === 3 ? 700 : 200) && (i < 3 || multFor(n, 2) > 2); });
          return multPart(n, 2);
        } };
      }) },
      { num: '4', stem: 'Find the <b>smallest</b> whole number each value could be multiplied by so that the product is a perfect cube. State the product and its cube root.', parts: ['a', 'b', 'c'].map(function (L, i) {
        return { id: 'e4' + L, level: i === 2 ? 'PRG' : 'EMG', make: function (r) {
          var n = gen(r, function () { var ps = r.sample([2, 3, 5], 2), e1 = r.int(1, 3), e2 = r.int(1, 2); return Math.pow(ps[0], e1) * Math.pow(ps[1], e2); }, function (n) { var m = multFor(n, 3); return !isCu(n) && m <= 50 && n * m <= 1000 && (i === 2 ? nt.factor(n).filter(function (pe) { return pe[1] % 3; }).length === 2 : true); });
          return multPart(n, 3);
        } };
      }) },
      { num: '5', stem: 'Some numbers are a perfect square <b>and</b> a perfect cube at the same time.',
        shared: function (r) { var ks = r.sample([2, 3, 4], 2).sort(); return { k1: ks[0], k2: ks[1] }; },
        parts: [
          { id: 'e5a', level: 'BEG', make: function (r, sh) { return bothPart(sh.k1); } },
          { id: 'e5b', level: 'EMG', make: function (r, sh) { return bothPart(sh.k2); } },
          { id: 'e5c', level: 'PRG', make: function (r, sh) {
            var a = Math.pow(sh.k1, 6), b = Math.pow(sh.k2, 6);
            return P.mc(r, 'Look at the exponents in your two prime factorizations (' + t(F(a) + '=' + K.fac(a)) + ' and ' + t(F(b) + '=' + K.fac(b)) + '). What makes a number both a perfect square and a perfect cube?', [
              { html: 'Every exponent is a multiple of ' + t('6') + ': even (so a perfect square) and a multiple of ' + t('3') + ' (so a perfect cube).', right: true },
              { html: 'Every exponent is even.', why: 'Even exponents make a perfect square, but ' + t('2^{2}=4') + ' isn’t a perfect cube.' },
              { html: 'Every exponent is a multiple of ' + t('3') + '.', why: 'That makes a perfect cube, but ' + t('2^{3}=8') + ' isn’t a perfect square.' },
              { html: 'The number has exactly one prime factor.', why: t('2^{3}=8') + ' has one prime factor and isn’t a perfect square; ' + t('6^{6}') + ' has two and is both.' }],
              t(F(a) + '=' + K.fac(a)) + ' and ' + t(F(b) + '=' + K.fac(b)) + ': every exponent is ' + t('6') + '. For a perfect square every exponent must be even; for a perfect cube, a multiple of ' + t('3') + '. Both at once means a multiple of ' + t('6') + '.', ['What must the exponents be for a square? For a cube? What numbers are both?'], 'both square and cube: exponents');
          } },
          { id: 'e5d', level: 'MAS', make: function (r, sh) {
            var k = sh.k2, nxt = Math.pow(k + 1, 6), big = Math.pow(k, 6);
            return P.number('Using your rule from (c), find the next whole number after ' + t(F(big)) + ' that is both a perfect square and a perfect cube.', nxt, function (v) {
              if (isSq(v) && isCu(v) && v > big) return { code: 'u1l5-both-next', hint: t(F(v)) + ' is both, but it isn’t the <b>next</b> one after ' + t(F(big)) + '. Try the next whole number to the power ' + t('6') + '.' };
              if (isSq(v) && !isCu(v)) return { code: 'u1l5-both-next', hint: t(F(v)) + ' is a perfect square but not a perfect cube.' };
              if (isCu(v) && !isSq(v)) return { code: 'u1l5-both-next', hint: t(F(v)) + ' is a perfect cube but not a perfect square.' };
              return { code: 'u1l5-both-next', hint: 'The numbers that are both are sixth powers: ' + t('1^{6}, 2^{6}, 3^{6}, \\ldots') + '. Which comes after ' + t(k + '^{6}=' + F(big)) + '?' };
            }, 'Numbers that are both are sixth powers: ' + t('1, 64, 729, 4096, 15\\,625, \\ldots') + ' (' + t('1^{6}, 2^{6}, 3^{6}, 4^{6}, 5^{6}') + '). After ' + t(k + '^{6}=' + F(big)) + ' comes ' + t((k + 1) + '^{6}=' + F(nxt)) + ': ' + t('\\sqrt{' + F(nxt) + '}=' + Math.pow(k + 1, 3)) + ' and ' + t('\\sqrt[3]{' + F(nxt) + '}=' + Math.pow(k + 1, 2)) + '.',
              ['Every exponent must be a multiple of 6. The smallest such numbers are ' + t('1^{6}, 2^{6}, 3^{6}, \\ldots'), 'Check your answer: find its square root and its cube root.'], 'next square-and-cube after ' + big);
          } }] },

      /* ================= Extra practice B — Trapping and estimating ================= */
      { num: '6', section: 'Extra practice B — Trapping and Estimating Roots', outcome: 'AN2', stem: 'State the two consecutive whole numbers each root lies between, and which one it is closer to. Justify it by comparing the two distances.', parts: [
        { id: 'e6a', level: 'BEG', make: function (r) { return bracketPart(2, nonSqIn(r, 20, 99, clear(2))); } },
        { id: 'e6b', level: 'BEG', make: function (r) { return bracketPart(2, nonSqIn(r, 101, 224, clear(2))); } },
        { id: 'e6c', level: 'EMG', make: function (r) { return bracketPart(2, nonSqIn(r, 300, 1100, clear(2))); } },
        { id: 'e6d', level: 'EMG', make: function (r) { return bracketPart(3, nonCuIn(r, 30, 990, clear(3))); } }] },
      { num: '7', outcome: 'AN2', stem: 'Without a calculator, estimate each square root to one decimal place, and justify it: “' + t('\\sqrt{60}') + ' is between ' + t('7') + ' and ' + t('8') + ', and nearer to ' + t('8') + ', because ' + t('60') + ' is closer to ' + t('64') + ' than to ' + t('49') + '.”', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) { return justifyPart(nonSqIn(r, 20, 99, clear(2))); } },
        { id: 'e7b', level: 'EMG', make: function (r) { return justifyPart(nonSqIn(r, 101, 224, clear(2))); } },
        { id: 'e7c', level: 'EMG', make: function (r) { return justifyPart(nonSqIn(r, 3, 15, clear(2))); } }] },
      { num: '8', outcome: 'AN2', stem: 'Squeeze each root between two consecutive <b>tenths</b> (for example ' + t('4.7<\\sqrt{23}<4.8') + '). Do it by squaring tenths, not with the square-root key, and show the two squares you used.', parts: [
        { id: 'e8a', level: 'EMG', make: function (r) { return tenthsPart(nonSqIn(r, 60, 99, tenthsOK)); } },
        { id: 'e8b', level: 'EMG', make: function (r) { return tenthsPart(nonSqIn(r, 20, 60, tenthsOK)); } },
        { id: 'e8c', level: 'PRG', make: function (r) { return tenthsPart(nonSqIn(r, 5, 30, tenthsOK)); } }] },
      { num: '9', outcome: 'AN2', stem: 'Decide which value in each pair is larger, <b>without a calculator</b>: square (or cube) the decimal and compare.', parts: [
        { id: 'e9a', level: 'EMG', make: function (r) { return comparePart(r, 2, 30, 99); } },
        { id: 'e9b', level: 'PRG', make: function (r) { return comparePart(r, 3, 10, 120); } },
        { id: 'e9c', level: 'EMG', make: function (r) { return comparePart(r, 2, 5, 30); } },
        { id: 'e9d', level: 'EMG', make: function (r) { return comparePart(r, 2, 50, 99); } }] },
      { num: '10', outcome: 'AN2', stem: 'Estimate each number first, then arrange them.', parts: [
        { id: 'e10', level: 'PRG', make: function (r) {
          var its = gen(r, function () {
            var a = nonSqIn(r, 30, 60), b = nonCuIn(r, 70, 200), c = nonSqIn(r, 30, 60), d = r.int(51, 79) / 10, f = r.int(26, 39);
            return [{ id: 'a', tex: '\\sqrt{' + a + '}', v: Math.sqrt(a), how: t('\\sqrt{' + a + '}\\approx ' + fx(Math.sqrt(a), 2)) }, { id: 'b', tex: '\\sqrt[3]{' + b + '}', v: Math.cbrt(b), how: t('\\sqrt[3]{' + b + '}\\approx ' + fx(Math.cbrt(b), 2)) },
              { id: 'd', tex: String(d), v: d, how: t(String(d)) }, { id: 'c', tex: '\\sqrt{' + c + '}', v: Math.sqrt(c), how: t('\\sqrt{' + c + '}\\approx ' + fx(Math.sqrt(c), 2)) }, { id: 'f', tex: '\\dfrac{' + f + '}{5}', v: f / 5, how: t('\\frac{' + f + '}{5}=' + f / 5) }];
          }, function (its) { var vs = its.map(function (x) { return x.v; }).sort(function (a, b) { return a - b; }); for (var i = 1; i < vs.length; i++) if (vs[i] - vs[i - 1] < 0.03) return false; return Math.abs(its[0].v - its[3].v) > 0.03 && vs[4] - vs[1] < 1.6 && its[2].v * 10 % 10 !== 0 && its[4].v % 1 !== 0; });
          var sorted = its.slice().sort(function (a, b) { return a.v - b.v; }), byId = {}; its.forEach(function (x) { byId[x.id] = x; });
          return P.order(r, 'Arrange from <b>least to greatest</b>: ' + its.map(function (x) { return t(x.tex); }).join(',  ') + '.', sorted, { why: function (a, b) { return t(byId[a].tex) + ' and ' + t(byId[b].tex) + ' are in the wrong order. For a close pair, square (or cube) the decimal and compare it with the number under the root.'; } },
            'Estimates: ' + sorted.map(function (x) { return x.how; }).join(', ') + '.<br>' + t(sorted.map(function (x) { return x.tex; }).join('<')) + '.',
            ['Estimate each root from the perfect squares or cubes around it.', 'For two numbers that are close, square the decimal: e.g. ' + t('6.2^{2}=38.44') + ', so ' + t('6.2>\\sqrt{38}') + '.'], 'order roots and decimals');
        } }] },

      /* ================= Extra practice C — Working backwards ================= */
      { num: '11', section: 'Extra practice C — Working Backwards: Area, Volume, and Surface Area', stem: 'Every side length here comes out to a whole number.', parts: [
        { id: 'e11a', level: 'BEG', make: function (r) {
          var s = r.int(6, 15), A = s * s;
          return P.fields(squareFig('A = ' + A + ' cm²') + 'A square has an area of ' + t(A + '\\text{ cm}^{2}') + '. Find its side length, then its perimeter.', [{ name: 'Side', label: 'Side:', after: 'cm' }, { name: 'Perimeter', label: 'Perimeter:', after: 'cm' }],
            [K.number(s, function (v) { return v === A / 2 || v === A / 4 ? { code: 'sqrt-halved', hint: 'The side is the <b>square root</b> of the area: ' + t('s=\\sqrt{' + A + '}') + '.' } : null; }), K.number(4 * s, function (v) { if (v === 2 * s) return { code: 'u1l5-four-sides', hint: 'A square has <b>four</b> equal sides.' }; if (v === 4 * A) return { code: 'u1l5-perimeter', hint: 'Use the side length, not the area: ' + t('P=4s') + '.' }; return null; })],
            [String(s), String(4 * s)], 'side ' + t(s) + ' cm; perimeter ' + t(4 * s) + ' cm', t('s=\\sqrt{' + A + '}=' + s) + ' cm; ' + t('P=4\\times ' + s + '=' + 4 * s) + ' cm.', ['Side ' + t('=\\sqrt{\\text{area}}') + '.', 'Perimeter ' + t('=4\\times') + ' side.'], 'square area ' + A + ' -> side, perimeter');
        } },
        { id: 'e11b', level: 'EMG', make: function (r) {
          var e = r.int(3, 10), V = e * e * e;
          return P.fields(cubeFig('V = ' + V + ' cm³') + 'A cube has a volume of ' + t(V + '\\text{ cm}^{3}') + '. Find its edge length, then its total surface area. (A cube has ' + t('6') + ' identical square faces.)', [{ name: 'Edge', label: 'Edge:', after: 'cm' }, { name: 'Surface area', label: 'Surface area:', after: t('\\text{cm}^{2}') }],
            [K.number(e, function (v) { return Math.abs(v - V / 3) < 1 ? { code: 'divided-by-index', hint: 'The edge is the <b>cube root</b> of the volume.' } : null; }), K.number(6 * e * e, function (v) { if (v === e * e) return { code: 'u1l5-six-faces', hint: 'That’s one face. A cube has ' + t('6') + ' faces.' }; if (v === 6 * e) return { code: 'u1l5-sa', hint: 'Each face is a square: its area is ' + t('e^{2}') + ', not ' + t('e') + '.' }; return null; })],
            [String(e), String(6 * e * e)], 'edge ' + t(e) + ' cm; surface area ' + t(6 * e * e + '\\text{ cm}^{2}'), t('e=\\sqrt[3]{' + V + '}=' + e) + ' cm. One face: ' + t(e + '^{2}=' + e * e) + ' cm²; six faces: ' + t('6\\times ' + e * e + '=' + 6 * e * e) + ' cm².', ['Edge ' + t('=\\sqrt[3]{\\text{volume}}') + '.', 'Surface area ' + t('=6\\times') + ' (edge)².'], 'cube volume ' + V + ' -> edge, SA');
        } }] },
      { num: '12', stem: 'Each part runs a formula backwards. Take it one step at a time.', parts: [
        { id: 'e12a', level: 'ADV', make: function (r) {
          var e = r.int(2, 10), A = e * e, SA = 6 * A, V = e * e * e;
          return P.fields(cubeFig('SA = ' + SA + ' m²') + 'A cube has a total surface area of ' + t(SA + '\\text{ m}^{2}') + '. Find the area of one face, then the edge length, then the volume.', [{ name: 'One face', label: 'One face:', after: t('\\text{m}^{2}') }, { name: 'Edge', label: 'Edge:', after: 'm' }, { name: 'Volume', label: 'Volume:', after: t('\\text{m}^{3}') }],
            [K.number(A, function (v) { return v === SA / 4 ? { code: 'u1l5-face', hint: 'A cube has <b>six</b> faces, not four.' } : v === SA / 2 ? { code: 'u1l5-face', hint: 'Divide by the number of faces: ' + t('6') + '.' } : null; }), K.number(e, function (v) { return v === A / 2 ? { code: 'sqrt-halved', hint: 'Each face is a square: edge ' + t('=\\sqrt{\\text{face area}}') + '.' } : v === Math.round(Math.cbrt(A)) && v !== e ? { code: 'used-cube-root', hint: 'A face is a square, so use the <b>square</b> root.' } : null; }), K.number(V, function (v) { return v === SA ? { code: 'u1l5-volume', hint: 'Volume ' + t('=e^{3}') + ', not the surface area.' } : v === 3 * e ? { code: 'u1l5-volume', hint: t('e^{3}=e\\times e\\times e') + ', not ' + t('3e') + '.' } : null; })],
            [String(A), String(e), String(V)], 'face ' + t(A) + ' m²; edge ' + t(e) + ' m; volume ' + t(V) + ' m³', 'One face: ' + t(SA + '\\div 6=' + A) + ' m². Edge: ' + t('\\sqrt{' + A + '}=' + e) + ' m. Volume: ' + t(e + '^{3}=' + V) + ' m³.', ['A cube has 6 identical faces.', 'Each face is a square: edge ' + t('=\\sqrt{\\text{face}}') + '; volume ' + t('=e^{3}') + '.'], 'cube SA ' + SA + ' -> face, edge, V');
        } },
        { id: 'e12b', level: 'BEG', make: function (r) {
          var s = r.pick([5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 25, 30]), Pm = 4 * s;
          return P.fields(squareFig('P = ' + Pm + ' m') + 'A square has a perimeter of ' + t(Pm + '\\text{ m}') + '. Find its side length, then its area.', [{ name: 'Side', label: 'Side:', after: 'm' }, { name: 'Area', label: 'Area:', after: t('\\text{m}^{2}') }],
            [K.number(s, function (v) { return Math.abs(v - Math.sqrt(Pm)) < 0.5 ? { code: 'u1l5-side-from-perim', hint: 'The perimeter is four sides added, so <b>divide</b> by ' + t('4') + ' — no square root.' } : null; }), K.number(s * s, function (v) { return v === 2 * s ? { code: 'u1l5-perimeter', hint: 'Area ' + t('=s^{2}=s\\times s') + '.' } : null; })],
            [String(s), String(s * s)], 'side ' + t(s) + ' m; area ' + t(s * s) + ' m²', 'Side: ' + t(Pm + '\\div 4=' + s) + ' m. Area: ' + t(s + '^{2}=' + s * s) + ' m².', ['Perimeter ' + t('=4s') + ', so divide by 4.', 'Area ' + t('=s^{2}') + '.'], 'square perimeter ' + Pm + ' -> side, area');
        } },
        { id: 'e12c', sub: 'b (why)', level: 'EMG', make: function (r) {
          return P.mc(r, 'Why didn’t you need a square root to find the side from the perimeter?', [
            { html: 'The perimeter is the four sides <b>added</b>, so dividing by ' + t('4') + ' undoes it. A square root undoes <b>squaring</b>, which is how area is made.', right: true },
            { html: 'Square roots are only for cubes.', why: 'Cubes use cube roots. Square roots undo squaring — for example, area ' + t('=s^{2}') + '.' },
            { html: 'The perimeter was a perfect square.', why: 'Even when it is, the side is still the perimeter divided by 4.' },
            { html: 'You did need one: ' + t('s=\\sqrt{P}') + '.', why: 'Try it: a square with side ' + t('5') + ' has perimeter ' + t('20') + ', and ' + t('\\sqrt{20}\\ne 5') + '.' }],
            'Perimeter ' + t('P=4s') + ' is built by <b>adding</b> four sides, so you undo it by dividing by ' + t('4') + '. Area ' + t('A=s^{2}') + ' is built by <b>squaring</b>, so you undo it with a square root.', ['How is the perimeter built from the side? How is the area built?'], 'why no square root for perimeter');
        } }] },
      { num: '13', stem: function (sh) { return cubeFig('V = ' + F(sh.V) + ' cm³') + 'A cube-shaped shipping crate has a volume of ' + t(F(sh.V) + '\\text{ cm}^{3}') + '.'; },
        shared: function (r) { var e = r.pick([12, 10, 11, 13, 14, 15, 16, 20, 9, 8]); return { e: e, V: e * e * e }; },
        parts: [
          { id: 'e13a', level: 'BEG', make: function (r, sh) {
            return P.number('Find the edge length of the crate.', sh.e, function (v) { return Math.abs(v - sh.V / 3) < 1 ? { code: 'divided-by-index', hint: 'The edge is the <b>cube root</b> of the volume, not a third of it.' } : null; },
              t('e=\\sqrt[3]{' + F(sh.V) + '}=' + sh.e) + ' cm, because ' + t(sh.e + '\\times ' + sh.e + '\\times ' + sh.e + '=' + F(sh.V)) + '.', ['Edge ' + t('=\\sqrt[3]{V}') + '. Check the table of cubes (or use prime factorization).'], 'crate edge from V ' + sh.V, { after: 'cm' });
          } },
          { id: 'e13b', level: 'EMG', make: function (r, sh) {
            var e = sh.e;
            return P.number('Find the total surface area of the crate.', 6 * e * e, function (v) { if (v === e * e) return { code: 'u1l5-six-faces', hint: 'That’s one face. A cube has ' + t('6') + ' faces.' }; if (v === 4 * e * e) return { code: 'u1l5-six-faces', hint: 'A cube has ' + t('6') + ' faces, not ' + t('4') + '.' }; return null; },
              'One face: ' + t(e + '^{2}=' + e * e) + ' cm². Six faces: ' + t('6\\times ' + e * e + '=' + F(6 * e * e)) + ' cm².', ['Surface area ' + t('=6e^{2}') + '.'], 'crate SA', { after: t('\\text{cm}^{2}') });
          } },
          { id: 'e13c', level: 'ADV', make: function (r, sh) {
            var e = sh.e, k = r.chance(0.7) ? 2 : 3, V2 = Math.pow(k * e, 3), word = k === 2 ? 'double' : 'triple';
            return P.fields('A second crate has ' + word + ' the edge length. Find its volume, and how many times larger it is than the first crate.', [{ name: 'Volume', label: 'Volume:', after: t('\\text{cm}^{3}') }, { name: 'Times larger', label: 'Times larger:' }],
              [K.number(V2, function (v) { return v === k * sh.V ? { code: 'u1l5-doubled-vol', hint: 'The edge is ' + word + 'd, not the volume. Find the new edge first: ' + t(k + '\\times ' + e + '=' + k * e) + ' cm, then cube it.' } : null; }), K.number(k * k * k, function (v) { return v === k ? { code: 'u1l5-doubled-vol', hint: 'Compare the volumes: ' + t(F(V2) + '\\div ' + F(sh.V)) + '.' } : { code: 'u1l5-times', hint: 'Divide the new volume by the old one.' }; })],
              [String(V2), String(k * k * k)], t(F(V2)) + ' cm³; ' + t(k * k * k) + ' times larger', 'New edge: ' + t(k + '\\times ' + e + '=' + k * e) + ' cm. Volume: ' + t((k * e) + '^{3}=' + F(V2)) + ' cm³.<br>' + t(F(V2) + '\\div ' + F(sh.V) + '=' + k * k * k) + ': it is ' + t(k * k * k) + ' times larger (' + t(k + '^{3}=' + k * k * k) + ', because all three dimensions are ' + word + 'd).', ['Find the new edge, then cube it.', 'Divide the new volume by the old volume.'], 'crate edge x' + k);
          } }] },
      { num: '14', outcome: 'AN2', stem: function (sh) { return squareFig('A = ' + sh.A + ' m²') + 'A square patio has an area of ' + t(sh.A + '\\text{ m}^{2}') + '.'; },
        shared: function (r) { return { A: nonSqIn(r, 101, 250, clear(2)) }; },
        parts: [
          { id: 'e14a', level: 'EMG', make: function (r, sh) { var p = estimatePart(sh.A, 'patio side estimate'); p.prompt = 'Estimate the side length to one decimal place <b>without</b> a calculator.'; p.input.after = 'm'; return p; } },
          { id: 'e14b', level: 'BEG', make: function (r, sh) {
            var x = Math.sqrt(sh.A), p = P.approx('Use a calculator to find the side length to the nearest hundredth of a metre.', x, 2, { before: t('s\\approx'), after: 'm' }, t('s=\\sqrt{' + sh.A + '}=' + cut(x, 5) + '\\ldots\\approx ' + fx(x, 2)) + ' m.', ['Side ' + t('=\\sqrt{\\text{area}}') + '. ' + TOL_HINT[2]], 'patio side calc');
            p.check = calcCheck(x, 2); p.bad = [fx(sh.A / 4, 2)]; return p;
          } },
          { id: 'e14c', level: 'PRG', make: function (r, sh) {
            var x = Math.sqrt(sh.A), Pm = 4 * x, early = 4 * K.roundTo(x, 2);
            var p = P.approx('Find the perimeter of the patio, to the nearest hundredth of a metre.', Pm, 2, { before: t('P\\approx'), after: 'm', diag: function (v) { return Math.abs(v - 2 * x) < 0.011 ? { code: 'u1l5-four-sides', hint: 'A square has <b>four</b> sides.' } : Math.abs(v - sh.A) < 0.5 ? { code: 'u1l5-perimeter', hint: 'That’s the area. Perimeter ' + t('=4s') + '.' } : null; } },
              t('P=4s=4\\times ' + cut(x, 4) + '\\ldots=' + cut(Pm, 4) + '\\ldots\\approx ' + fx(Pm, 2)) + ' m.' + (Math.abs(early - K.roundTo(Pm, 2)) > 1e-9 ? ' (Using the rounded side ' + t(fx(x, 2)) + ' gives ' + t(early.toFixed(2)) + ', which is also accepted.)' : ''),
              ['Perimeter ' + t('=4\\times') + ' side. Use the unrounded side from your calculator, and round only at the end. ' + TOL_HINT[2]], 'patio perimeter');
            p.check = calcCheck(Pm, 2, { diag: function (v) { return Math.abs(v - 2 * x) < 0.011 ? { code: 'u1l5-four-sides', hint: 'A square has <b>four</b> sides.' } : null; } });
            var c0 = p.check; p.check = function (resp) { var v = num(resp); if (v != null && Math.abs(v - early) < 1e-9) return ok(); return c0(resp); };
            p.bad = [fx(2 * x, 2)]; return p;
          } }] },

      /* ================= Extra practice D — Reasoning and stretch ================= */
      { num: '15', section: 'Extra practice D — Reasoning and Stretch', stem: function (sh) { return 'Jordan claims that ' + t('\\sqrt{a+b}=\\sqrt{a}+\\sqrt{b}') + ' for all whole numbers ' + t('a') + ' and ' + t('b') + '.'; },
        shared: function (r) { return r.pick([{ a: 9, b: 16 }, { a: 36, b: 64 }, { a: 81, b: 144 }, { a: 25, b: 144 }, { a: 64, b: 225 }, { a: 144, b: 256 }, { a: 49, b: 576 }, { a: 16, b: 9 }, { a: 64, b: 36 }, { a: 225, b: 400 }]); },
        parts: [
          { id: 'e15a', level: 'BEG', make: function (r, sh) {
            var a = sh.a, b = sh.b, s = Math.sqrt(a + b), sa = Math.sqrt(a) + Math.sqrt(b);
            return P.fields('Test the claim with ' + t('a=' + a) + ' and ' + t('b=' + b) + '. Evaluate both sides.', [{ name: 'Left side', label: t('\\sqrt{' + a + '+' + b + '}=') }, { name: 'Right side', label: t('\\sqrt{' + a + '}+\\sqrt{' + b + '}=') }],
              [K.number(s, function (v) { return v === sa ? { code: 'u1l5-sum-roots', hint: 'Add under the root first: ' + t(a + '+' + b + '=' + (a + b)) + ', then take the square root.' } : v === a + b ? { code: 'no-root', hint: 'Now take the square root of ' + t(a + b) + '.' } : null; }), K.number(sa, function (v) { return v === s ? { code: 'u1l5-sum-roots', hint: 'Take each square root separately, then add: ' + t('\\sqrt{' + a + '}=' + Math.sqrt(a)) + '.' } : null; })],
              [String(s), String(sa)], t('\\sqrt{' + (a + b) + '}=' + s) + ' but ' + t(Math.sqrt(a) + '+' + Math.sqrt(b) + '=' + sa) + ': not equal', t('\\sqrt{' + a + '+' + b + '}=\\sqrt{' + (a + b) + '}=' + s) + ', but ' + t('\\sqrt{' + a + '}+\\sqrt{' + b + '}=' + Math.sqrt(a) + '+' + Math.sqrt(b) + '=' + sa) + '. ' + t(s + '\\ne ' + sa) + ', so the two sides are <b>not equal</b>.', ['Left side: add first, then take the root. Right side: take each root, then add.'], 'test sqrt(a+b) claim');
          } },
          { id: 'e15b', level: 'EMG', make: function (r) {
            return P.mc(r, 'Is Jordan’s claim true? What does one counterexample prove about a claim that says “for all”?', [
              { html: 'The claim is false. “For all” means it must work every time, so one case where it fails is enough to disprove it.', right: true },
              { html: 'The claim could still be true: one example isn’t enough to decide.', why: 'For a “for all” claim, one failure is enough. It would take one example to <b>disprove</b> it, but every case to prove it.' },
              { html: 'The claim is true for most numbers, so it is true.', why: '“For all” means every single case. One failure breaks it.' },
              { html: 'The claim is false only for perfect squares.', why: 'Try ' + t('a=2') + ', ' + t('b=2') + ': ' + t('\\sqrt{4}=2') + ' but ' + t('\\sqrt{2}+\\sqrt{2}\\approx 2.83') + '. It fails for other numbers too.' }],
              'The claim is <b>false</b>. A “for all” claim must work every time, so a single counterexample (like the one in (a)) disproves it. (The rule that does work is ' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + ' — for multiplication, not addition.)', ['What does “for all” promise?'], 'what a counterexample proves');
          } }] },
      { num: '16', stem: 'Square roots and cube roots behave differently with negative numbers.',
        shared: function (r) { return { k: r.int(2, 9), c: r.int(2, 6), c2: r.int(2, 5), c3: r.pick([6, 7, 8, 9, 10]) }; },
        parts: [
          { id: 'e16a', level: 'BEG', make: function (r, sh) {
            var k = sh.k;
            return P.mc(r, 'Why is there no real number equal to ' + t('\\sqrt{-' + k * k + '}') + '?', [
              { html: 'Any real number times itself is positive or zero: positive × positive and negative × negative are both positive. So nothing squares to ' + t('-' + k * k) + '.', right: true, code: 'right' },
              { html: 'Because ' + t('\\sqrt{-' + k * k + '}=-' + k) + '.', why: 'Check: ' + t('(-' + k + ')\\times(-' + k + ')=+' + k * k) + ', not ' + t('-' + k * k) + '.', code: 'neg-root' },
              { html: 'Because ' + t(k * k) + ' is a perfect square.', why: t(k * k) + ' being a perfect square is why ' + t('\\sqrt{' + k * k + '}=' + k) + '. The problem is the negative sign.', code: 'sq-reason' },
              { html: 'There is one: ' + t('\\sqrt{-' + k * k + '}=' + k) + '.', why: t(k + '\\times ' + k + '=' + k * k) + ', not ' + t('-' + k * k) + '.', code: 'neg-root' }],
              t(k + '\\times ' + k + '=' + k * k) + ' and ' + t('(-' + k + ')\\times(-' + k + ')=' + k * k) + ' — both positive. No real number times itself gives a negative, so ' + t('\\sqrt{-' + k * k + '}') + ' is <b>not a real number</b>.', ['Try squaring a positive number and a negative number.'], 'why no sqrt of negative');
          } },
          { id: 'e16b', level: 'BEG', make: function (r, sh) {
            var c = sh.c, n = c * c * c;
            return P.number(t('\\sqrt[3]{-' + n + '}') + ' <b>does</b> have a real value. State it.', -c, function (v) { if (v === c) return { code: 'u1l5-cube-sign', hint: 'Check: ' + t(c + '\\times ' + c + '\\times ' + c + '=+' + n) + '. Three negatives multiply to a negative.' }; if (v === -n / 3) return { code: 'divided-by-index', hint: 'A cube root isn’t a third of the number.' }; return null; },
              t('(-' + c + ')\\times(-' + c + ')\\times(-' + c + ')=-' + n) + ' (three negatives multiply to a negative), so ' + t('\\sqrt[3]{-' + n + '}=-' + c) + '.', ['Which number, multiplied by itself three times, gives ' + t('-' + n) + '?'], 'cbrt -' + n, { before: t('\\sqrt[3]{-' + n + '}=') });
          } },
          { id: 'e16c', level: 'BEG', make: function (r, sh) {
            var a = sh.c2, b = sh.c3, A = a * a * a, B = b * b * b;
            var dg = function (s, S) { return function (v) { return v === s ? { code: 'u1l5-cube-sign', hint: 'The cube root of a negative number is negative.' } : null; }; };
            return P.fields('Evaluate.', [{ name: 'First', label: t('\\sqrt[3]{-' + F(A) + '}=') }, { name: 'Second', label: t('\\sqrt[3]{-' + F(B) + '}=') }], [K.number(-a, dg(a, A)), K.number(-b, dg(b, B))], [String(-a), String(-b)],
              t('\\sqrt[3]{-' + F(A) + '}=-' + a) + '; ' + t('\\sqrt[3]{-' + F(B) + '}=-' + b), t('(-' + a + ')^{3}=-' + F(A)) + ' and ' + t('(-' + b + ')^{3}=-' + F(B)) + '.', ['Find the cube root of the number without the sign, then make it negative.'], 'two negative cube roots');
          } },
          { id: 'e16d', level: 'BEG', make: function (r) {
            return P.mc(r, 'Complete the rule: the cube root of a negative number is ____, but the square root of a negative number is ____.', [
              { html: '<b>negative</b> (a real number); <b>not a real number</b>', right: true },
              { html: '<b>not a real number</b>; <b>negative</b>', why: 'It’s the other way round: ' + t('\\sqrt[3]{-8}=-2') + ', but nothing squares to ' + t('-4') + '.' },
              { html: '<b>positive</b>; <b>negative</b>', why: t('(-2)^{3}=-8') + ', so ' + t('\\sqrt[3]{-8}=-2') + ' — negative.' },
              { html: '<b>negative</b>; <b>negative</b>', why: t('(-2)\\times(-2)=+4') + ', so no real number squares to a negative.' }],
              'Three negatives multiply to a negative, so the cube root of a negative number is <b>negative</b>. Two equal numbers multiply to a positive (or zero), so the square root of a negative number is <b>not a real number</b>.', ['Test with ' + t('\\sqrt[3]{-8}') + ' and ' + t('\\sqrt{-4}') + '.'], 'rule for roots of negatives');
          } }] },
      { num: '17', stem: function (sh) { return '<b>Stretch.</b> Consider all the whole numbers from ' + t('1') + ' to ' + t(sh.N) + ' inclusive.'; },
        shared: function (r) { return { N: r.pick([100, 150, 200, 200, 250, 300, 400, 120, 180, 220, 260, 320, 350, 500, 600, 700, 130, 170, 240, 280]) }; },
        parts: [
          { id: 'e17a', level: 'BEG', make: function (r, sh) {
            var c = Math.floor(Math.sqrt(sh.N) + 1e-9);
            return P.number('How many of them are perfect squares?', c, function (v) { return v === c - 1 ? { code: 'u1l5-count', hint: 'Don’t forget ' + t('1=1^{2}') + ' (or the last one, ' + t(c + '^{2}=' + c * c) + ').' } : { code: 'u1l5-count', hint: 'List them: ' + t('1^{2}, 2^{2}, 3^{2}, \\ldots') + ' up to the last one that is at most ' + t(sh.N) + '.' }; },
              t(c) + ' of them: ' + t('1, 4, 9, \\ldots, ' + c * c) + ' (' + t('1^{2}') + ' to ' + t(c + '^{2}') + '; ' + t((c + 1) + '^{2}=' + (c + 1) * (c + 1)) + ' is past ' + t(sh.N) + ').', ['Square ' + t('1, 2, 3, \\ldots') + ' until you pass ' + t(sh.N) + '.'], 'count squares to ' + sh.N);
          } },
          { id: 'e17b', level: 'EMG', make: function (r, sh) {
            var c = Math.floor(Math.cbrt(sh.N) + 1e-9);
            return P.number('How many of them are perfect cubes?', c, function (v) { return v === c - 1 ? { code: 'u1l5-count', hint: 'Don’t forget ' + t('1=1^{3}') + ' (or the last one, ' + t(c + '^{3}=' + c * c * c) + ').' } : { code: 'u1l5-count', hint: 'List them: ' + t('1^{3}, 2^{3}, 3^{3}, \\ldots') + ' up to the last one that is at most ' + t(sh.N) + '.' }; },
              t(c) + ' of them: ' + t(Array.apply(null, Array(c)).map(function (x, i) { return Math.pow(i + 1, 3); }).join(', ')) + ' (' + t((c + 1) + '^{3}=' + Math.pow(c + 1, 3)) + ' is past ' + t(sh.N) + ').', ['Cube ' + t('1, 2, 3, \\ldots') + ' until you pass ' + t(sh.N) + '.'], 'count cubes to ' + sh.N);
          } },
          { id: 'e17c', level: 'PRG', make: function (r, sh) {
            var want = [1, 64, 729].filter(function (v) { return v <= sh.N; });
            return { prompt: 'List the numbers from ' + t('1') + ' to ' + t(sh.N) + ' that are <b>both</b> a perfect square and a perfect cube.', input: { type: 'list' }, key: want.map(String),
              check: function (resp) {
                if (!resp || !resp.length) return form('empty', 'Add the numbers one at a time (press Enter or comma after each).');
                var vals = resp.map(Number);
                var bad = vals.filter(function (v) { return want.indexOf(v) < 0; });
                if (bad.length) { var b = bad[0]; return wrong('u1l5-list', t(b) + (isSq(b) ? ' is a perfect square but not a perfect cube.' : isCu(b) ? ' is a perfect cube but not a perfect square.' : b > sh.N ? ' is bigger than ' + t(sh.N) + '.' : ' is neither.')); }
                var miss = want.filter(function (v) { return vals.indexOf(v) < 0; });
                if (miss.length) return wrong('u1l5-list', miss[0] === 1 ? 'Don’t forget ' + t('1') + ': ' + t('1=1^{2}=1^{3}') + '.' : 'You’re missing one. Look for a number in both lists from (a) and (b).');
                return ok();
              },
              answer: t(want.join(',\\ ')), solution: 'Both lists contain ' + t(want.join(' and ')) + ': ' + t('1=1^{2}=1^{3}') + (want.length > 1 ? ', ' + t('64=8^{2}=4^{3}') : '') + (want.length > 2 ? ', ' + t('729=27^{2}=9^{3}') : '') + '. Only ' + t(want.length) + ' — to be both, every prime exponent must be a multiple of ' + t('6') + ', so these numbers are sixth powers (' + t('1, 64, 729, \\ldots') + ') and grow very fast.',
              hints: ['Which numbers appear in both your list of squares and your list of cubes?'], text: 'both squares and cubes to ' + sh.N, bad: [['1'], ['64'], ['1', '64', '8']] };
          } }] },
      { num: '18', stem: '<i>(Multiple Choice)</i> and <i>(Numerical Response)</i>', parts: [
        { id: 'e18a', level: 'EMG', make: function (r) {
          var k = r.pick([11, 12, 13, 14, 15, 16]), cube = k * k * k, sqs = r.sample([196, 1764, 900, 1600, 2500, 1225, 1444, 2025, 2304, 3600, 4900, 576].filter(function (v) { return !isCu(v); }), 3);
          var opts = [{ html: t(F(cube)), right: true }].concat(sqs.map(function (v) { return { html: t(F(v)), why: t(F(v) + '=' + Math.sqrt(v) + '^{2}') + ' is a perfect <b>square</b>; its prime exponents aren’t all multiples of ' + t('3') + '.' }; }));
          opts.sort(function (a, b) { return Number(a.html.replace(/[^0-9]/g, '')) - Number(b.html.replace(/[^0-9]/g, '')); });
          return P.mc(r, 'Which of the following is a perfect cube?', opts, t(F(cube) + '=' + K.fac(cube) + '=' + k + '^{3}') + ': every exponent is a multiple of ' + t('3') + '.', ['Use prime factorization: every exponent must be a multiple of 3.'], 'MC perfect cube', true);
        } },
        { id: 'e18b', level: 'BEG', make: function (r) {
          var k = r.int(11, 19), V = k * k * k;
          return P.nr('A cube has a volume of ' + t(F(V) + '\\text{ mm}^{3}') + '. Its edge length, in millimetres, is ________.', k, function (v) { return Math.abs(v - V / 3) < 1 ? { code: 'divided-by-index', hint: 'The edge is the <b>cube root</b> of the volume.' } : Math.abs(v - Math.sqrt(V)) < 1 ? { code: 'used-square-root', hint: 'That’s about the <b>square</b> root. Use the cube root.' } : null; },
            t('\\sqrt[3]{' + F(V) + '}=' + k) + ', since ' + t(k + '\\times ' + k + '\\times ' + k + '=' + F(V)) + '.', ['Edge ' + t('=\\sqrt[3]{V}') + '. Use prime factorization or a calculator.'], 'NR cube edge ' + V);
        } }] },
      { num: '19', outcome: 'AN2', stem: function (sh) { return 'A classmate says: “' + t('\\sqrt{' + F(sh.n) + '}') + ' must be about ' + t(sh.L + '.5') + ', because ' + t(F(sh.n)) + ' is halfway between ' + t(F(sh.L * sh.L)) + ' and ' + t(F((sh.L + 1) * (sh.L + 1))) + '.”'; },
        shared: function (r) { var L = r.int(12, 35), span = 2 * L + 1, j = Math.round(span * (r.chance(0.5) ? r.pick([0.62, 0.66, 0.7, 0.75]) : r.pick([0.25, 0.3, 0.34, 0.38]))); return { L: L, n: L * L + j }; },
        parts: [
          { id: 'e19a', level: 'ADV', make: function (r, sh) {
            var L = sh.L, n = sh.n, d1 = n - L * L, d2 = (L + 1) * (L + 1) - n, above = d1 > d2;
            return P.mc(r, 'Is the reasoning sound?', [
              { html: 'No: ' + t(F(n)) + ' is ' + t(d1) + ' above ' + t(F(L * L)) + ' and ' + t(d2) + ' below ' + t(F((L + 1) * (L + 1))) + ', so it isn’t halfway. ' + t('\\sqrt{' + F(n) + '}') + ' is ' + (above ? 'more' : 'less') + ' than ' + t(L + '.5') + '.', right: true },
              { html: 'Yes: halfway between the perfect squares means halfway between the roots.', why: 'Check the premise first: is ' + t(F(n)) + ' really halfway between ' + t(F(L * L)) + ' and ' + t(F((L + 1) * (L + 1))) + '? Subtract.' },
              { html: 'No: the square root of a number near ' + t(F(n)) + ' is about ' + t(Math.round(n / 2)) + '.', why: 'A square root isn’t half the number.' },
              { html: 'Yes: every square root ends in ' + t('.5') + ' when it is between two whole numbers.', why: t('\\sqrt{2}=1.414\\ldots') + ' doesn’t end in ' + t('.5') + '.' }],
              t(F(n) + '-' + F(L * L) + '=' + d1) + ' and ' + t(F((L + 1) * (L + 1)) + '-' + F(n) + '=' + d2) + '. The midpoint of the squares is ' + t(F(L * L + L) + '.5') + ', so ' + t(F(n)) + ' is <b>not</b> halfway: it is ' + (above ? 'closer to ' + t(F((L + 1) * (L + 1))) : 'closer to ' + t(F(L * L))) + ', so ' + t('\\sqrt{' + F(n) + '}') + ' is ' + (above ? 'more' : 'less') + ' than ' + t(L + '.5') + '.', ['Subtract to see how far ' + t(F(n)) + ' is from each perfect square.'], 'classmate halfway claim');
          } },
          { id: 'e19b', level: 'PRG', make: function (r, sh) { var p = estimatePart(sh.n, 'better estimate sqrt ' + sh.n); p.prompt = 'Give a better one-decimal estimate of ' + t('\\sqrt{' + F(sh.n) + '}') + ' (no calculator).'; p.bad = [sh.L + '.5']; return p; } }] }
    ]
  });

  /* ---------- part makers used above ---------- */
  function bothPart(k) {
    var N = Math.pow(k, 6), s = Math.pow(k, 3), c = k * k;
    var p = P.fields('Show that ' + t(F(N)) + ' is both a perfect square and a perfect cube: give ' + t('\\sqrt{' + F(N) + '}') + ', ' + t('\\sqrt[3]{' + F(N) + '}') + ' and the prime factorization.',
      [{ name: 'Square root', label: t('\\sqrt{' + F(N) + '}=') }, { name: 'Cube root', label: t('\\sqrt[3]{' + F(N) + '}=') }, { name: 'Prime factorization', label: t(F(N) + '='), mode: 'math', wide: true }],
      [valChk(s, rootDiag(N, 2)), valChk(c, rootDiag(N, 3)), K.product(N, 'either')], [String(s), String(c), k + '^6'],
      t('\\sqrt{' + F(N) + '}=' + s) + ', ' + t('\\sqrt[3]{' + F(N) + '}=' + c) + ', ' + t(F(N) + '=' + K.fac(N)),
      t(s + '\\times ' + s + '=' + F(N)) + ', so ' + t('\\sqrt{' + F(N) + '}=' + s) + '. ' + t(c + '\\times ' + c + '\\times ' + c + '=' + F(N)) + ', so ' + t('\\sqrt[3]{' + F(N) + '}=' + c) + '.<br>' + t(F(N) + '=' + K.fac(N)) + '.',
      ['Use prime factorization: halve the exponents for the square root, divide them by 3 for the cube root.'], 'both square and cube: ' + N);
    p.bad = [[String(c), String(s), k + '^6']];
    return p;
  }
  function justifyPart(n) {
    var c = closerInfo(2, n), x = Math.sqrt(n);
    return P.fields(t('\\sqrt{' + F(n) + '}') + ' is between ___ and ___, and nearer to ___, so ' + t('\\sqrt{' + F(n) + '}\\approx') + ' ___ .', [{ name: 'Smaller', label: 'Between' }, { name: 'Larger', label: 'and' }, { name: 'Nearer to', label: 'nearer to' }, { name: 'Estimate', label: 'so ' + t('\\sqrt{' + F(n) + '}\\approx') }],
      [boundChk(2, n, true), boundChk(2, n, false), closerChk(2, n), estChk(n)], [String(c.lo), String(c.hi), String(c.near), fx(x, 1)],
      t('\\sqrt{' + F(n) + '}') + ' is between ' + t(c.lo) + ' and ' + t(c.hi) + ', nearer to ' + t(c.near) + ' (because ' + t(F(n)) + ' is closer to ' + t(c.nearP) + '), so ' + t('\\approx ' + fx(x, 1)),
      estSol(n), ['Trap ' + t(F(n)) + ' between two perfect squares and compare the distances.', 'Then decide how far along it is: just past, about a third, about halfway, …'], 'justify estimate sqrt ' + n);
  }
  function tenthsOK(n) { var x = Math.sqrt(n), f = x * 10 - Math.floor(x * 10); return f > 0.12 && f < 0.88 && Math.abs(x - Math.round(x)) > 0.12; }
  function tenthsPart(n) {
    var x = Math.sqrt(n), a = Math.floor(x * 10) / 10, b = Math.round((a + 0.1) * 10) / 10, a2 = Math.round(a * a * 100) / 100, b2 = Math.round(b * b * 100) / 100;
    var tenChk = function (want, isLo) {
      return K.number(want, function (v) {
        if (Math.abs(v * 10 - Math.round(v * 10)) > 1e-9) return { code: 'u1l5-tenth', hint: 'Give a tenth: one decimal place, like ' + t('4.7') + '.' };
        if (isLo && v * v > n) return { code: 'u1l5-tenth', hint: t(powTex(v, 2) + '=' + dec2(v * v)) + ', which is more than ' + t(n) + ' — too big for the lower tenth.' };
        if (!isLo && v * v < n) return { code: 'u1l5-tenth', hint: t(powTex(v, 2) + '=' + dec2(v * v)) + ', which is less than ' + t(n) + ' — too small for the upper tenth.' };
        return { code: 'u1l5-tenth', hint: 'Get closer: the two tenths should be next to each other (' + t('0.1') + ' apart), with ' + t(n) + ' between their squares.' };
      });
    };
    var sqChk = function (idx) {
      return function (resp) {
        var v = num(resp), t0 = num(lastResp[idx]);
        if (v == null) return form('empty', 'Square the tenth and write the result.');
        if (t0 != null && Math.abs(v - t0 * t0) < 1e-6) return ok();
        if (t0 != null) return wrong('u1l5-tenth-square', 'Check: ' + t(powTex(t0, 2) + '=' + t0 + '\\times ' + t0 + '=' + dec2(t0 * t0)) + '.');
        return form('empty', 'Fill in the tenth first.');
      };
    };
    var lastResp = [];
    var base = K.fields([tenChk(a, true), sqChk(0), tenChk(b, false), sqChk(2)], { labels: ['Lower tenth', 'Its square', 'Upper tenth', 'Its square'] });
    var p = P.fields(t('\\sqrt{' + n + '}'), [{ name: 'Lower tenth', label: 'Lower tenth:' }, { name: 'Its square', label: 'squared ' + t('=') }, { name: 'Upper tenth', label: 'Upper tenth:' }, { name: 'Its square', label: 'squared ' + t('=') }],
      [function () { return ok(); }], [String(a), dec2(a2), String(b), dec2(b2)], t(a + '^{2}=' + dec2(a2)) + ' and ' + t(b + '^{2}=' + dec2(b2)) + ', so ' + t(a + '<\\sqrt{' + n + '}<' + b),
      'Trap it first: ' + t(Math.floor(x) + '<\\sqrt{' + n + '}<' + (Math.floor(x) + 1)) + '. Then square tenths: ' + t(a + '^{2}=' + dec2(a2)) + ' (less than ' + t(n) + ') and ' + t(b + '^{2}=' + dec2(b2)) + ' (more than ' + t(n) + '), so ' + t(a + '<\\sqrt{' + n + '}<' + b) + '.',
      ['Find the two whole numbers first, then square tenths between them until you pass ' + t(n) + '.', 'Example: ' + t('4.7^{2}=22.09') + ' and ' + t('4.8^{2}=23.04') + ', so ' + t('4.7<\\sqrt{23}<4.8') + '.'], 'tenths around sqrt ' + n);
    p.check = function (resp) { lastResp = resp || []; return base(resp); };
    p.bad = [[String(a - 0.1), dec2((a - 0.1) * (a - 0.1)), String(a), dec2(a2)], [String(a), String(a * 2), String(b), dec2(b2)]].map(function (b0) { return b0.map(function (s) { return String(Math.round(Number(s) * 100) / 100); }); });
    return p;
  }
  function dec2(v) { return String(Math.round(v * 1000) / 1000); }
  function comparePart(r, k, lo, hi) {
    var n, d, dk;
    for (var i = 0; i < 500; i++) {
      n = k === 2 ? nonSqIn(r, lo, hi) : nonCuIn(r, lo, hi); var x = Math.pow(n, 1 / k); d = Math.round(x * 10) / 10 + r.pick([-0.1, 0, 0, 0.1]); d = Math.round(d * 10) / 10; dk = Math.pow(d, k);
      if (Math.abs(dk - n) > 1e-9 && d * 10 % 10 !== 0 && Math.abs(x - d) < 0.12) break;
    }
    var e = rootTex(k, n), dkS = dec2(dk), rootBig = n > dk;
    return P.mc(r, 'Which is larger: ' + t(e) + ' or ' + t(d) + '?', [
      { html: t(e) + ' is larger', right: rootBig, why: rootBig ? null : t(powTex(d, k) + '=' + dkS) + ', which is more than ' + t(n) + ', so ' + t(d) + ' is larger.', code: 'root' },
      { html: t(d) + ' is larger', right: !rootBig, why: rootBig ? t(powTex(d, k) + '=' + dkS) + ', which is less than ' + t(n) + ', so ' + t(e) + ' is larger.' : null, code: 'dec' },
      { html: 'They are equal', why: t(powTex(d, k) + '=' + dkS) + ', not ' + t(n) + '.', code: 'equal' }],
      (k === 2 ? 'Square' : 'Cube') + ' the decimal: ' + t(powTex(d, k) + '=' + dkS) + (rootBig ? '<' : '>') + t(n) + '. So ' + (rootBig ? t(d + '<' + e) + ': ' + t(e) + ' is larger.' : t(d + '>' + e) + ': ' + t(d) + ' is larger.'),
      [(k === 2 ? 'Square' : 'Cube') + ' ' + t(d) + ' and compare the result with ' + t(n) + '.'], 'compare ' + (k === 2 ? 'sqrt' : 'cbrt') + n + ' with ' + d, true);
  }
})(window);
