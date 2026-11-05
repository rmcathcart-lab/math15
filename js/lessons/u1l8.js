/* Math 15 · Unit 1 · Lesson 8 — Unit Review: Number Sense
 * Assignment 8 (u1_L08.tex, Questions 1–25) and the Lesson 8 Extra Practice (u1_EP08.tex, Questions 1–19).
 * Every part is a generator: it keeps the booklet question's structure and difficulty (the booklet's own numbers are
 * among the possible values) and changes the numbers. Helpers are copied from the Math 10C Unit 1 files (GCF/LCM
 * diagnoses from u1l2, radical checkers from u1l8, the number-set table from u1l9).
 * Outcome per part, by topic: REV (Grade 9 review — never counts toward a level) for integer and fraction work,
 * AN1 for factors, multiples, perfect powers and roots of perfect powers, AN2 for irrational numbers and radicals.
 * Conversions: "explain" / "always, sometimes or never" / "find the error" → multiple choice whose options are reasons;
 * "list every set it belongs to" → a table of check boxes; "estimate" → number boxes (smaller and larger whole number,
 * the closer one, a one-decimal estimate, accepted within 0.1); two-step word problems → labelled boxes.
 * Fractions: "evaluate" accepts any equal fraction, mixed number or exact decimal (the booklet only asks for lowest
 * terms in 6(b) and Extra 3, where a correct but unreduced answer gets a "reduce it" nudge without using a try).
 * Calculator: only 15 (nearest hundredth). Levels (Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, nt = HW.nt, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, P = K.P;

  HW.addCodes({
    'neg-root': 'Lost the sign of an odd root of a negative', 'coef-lost': 'Forgot to multiply by the coefficient in front',
    'wrong-power': 'Took out a perfect square (or wrong power) instead of the index’s power', 'even-neg': 'Put a negative under an even root', 'rad-decimal': 'Decimal under the radical',
    'gcf-lcm': 'Gave the LCM instead of the GCF', 'gcf-product': 'Multiplied the numbers (GCF)', 'gcf-one': 'Said the GCF is 1', 'gcf-not-greatest': 'Common factor, but not the greatest',
    'gcf-high-power': 'GCF: used the highest power of a shared prime', 'gcf-extra-prime': 'GCF: included a prime not in every number', 'gcf-not-common': 'Not a common factor',
    'lcm-gcf': 'Gave the GCF instead of the LCM', 'lcm-product': 'Multiplied the numbers (LCM too big)', 'lcm-not-least': 'Common multiple, but not the least',
    'lcm-low-power': 'LCM: used a lower power of a prime', 'lcm-missing-prime': 'LCM: left out a prime', 'lcm-not-multiple': 'Not a common multiple',
    'not-factored': 'Didn’t write the prime factorization', 'decimal-hours': 'Read decimal hours as minutes', 'area-by-side': 'Divided area by side length (not tile area)',
    'perimeter': 'Used the perimeter', 'added': 'Added instead of multiplied', 'said-yes': 'Said yes (it’s no)', 'said-no': 'Said no (it’s yes)', 'yes-no': 'Didn’t answer yes or no',
    'times-itself': 'Multiplied by the number itself (not smallest)', 'made-square': 'Made a square instead of a cube', 'made-cube': 'Made a cube instead of a square', 'k-all': 'Multiplied by every prime',
    'sets-nonreal': 'Put a non-real number in a set', 'sets-real': 'Called a real number non-real', 'sets-both': 'Ticked both rational and irrational',
    'sets-irr': 'Missed that a number is irrational', 'sets-rat': 'Called a rational number irrational', 'sets-R': 'Left out R',
    'sets-irr-int': 'Put an irrational number in N, W or I', 'sets-zero-N': 'Called 0 a natural number', 'sets-neg': 'Put a negative number in N or W',
    'sets-frac': 'Put a non-integer in N, W or I', 'sets-Q': 'Left out Q', 'sets-nat': 'Missed W or I for a natural number', 'sets-zero': 'Missed W or I for 0', 'sets-negint': 'Missed I for a negative integer',
    'between-extra': 'Listed a value outside the range', 'between-missing': 'Missed some of the values', 'swapped-bounds': 'Smaller and larger swapped', 'power-not-root': 'Gave the perfect power instead of its root', 'bracket': 'Wrong consecutive integers',
    'u1l8-int-add': 'Added the sizes when the signs were different', 'u1l8-sub-neg': 'Subtracting a negative: didn’t add the opposite', 'u1l8-left-right': 'Worked left to right, ignoring the order of operations',
    'u1l8-neg-square': '−n²: squared the minus sign too (or not, for (−n)²)', 'u1l8-times-2': 'Multiplied by 2 instead of squaring', 'u1l8-add-across': 'Added (or subtracted) tops and bottoms of fractions',
    'u1l8-den-only': 'Common denominator, numerators not changed', 'u1l8-no-flip': 'Divided fractions without the reciprocal', 'u1l8-cross': 'Cross-multiplied when multiplying fractions',
    'u1l8-dec-digits': 'Wrote the fraction’s digits as a decimal', 'u1l8-place': 'Wrong place value converting a decimal', 'u1l8-hm': 'Minutes not converted to hours and minutes correctly',
    'u1l8-closer': 'Chose the wrong closer whole number', 'u1l8-estimate': 'Estimate too far off', 'u1l8-not-root': 'Gave the area or volume instead of the root', 'u1l8-em': 'Mixed up entire and mixed radicals',
    'u1l8-bracket-sign': 'Sign slip inside the brackets', 'u1l8-pow-frac': 'Squared a fraction wrongly', 'u1l8-root-half': 'Halved the number instead of taking the root',
    'u1l8-ratio-flip': 'Ratio upside down', 'square-root': 'Used the square root instead of cube root', 'gave-gcf': 'Used the GCF (should be LCM)', 'mc-said-entire': 'Called a mixed radical entire', 'mc-said-mixed': 'Called an entire radical mixed', 'not-smallest': 'Works, but not the smallest', 'u1l8-squared': 'Squared the coefficient instead of cubing it', 'u1l8-whole-plot': 'Gave the side length instead of the count', 'u1l8-radicand-sum': 'Added the radicands'
  });
  HW.addPartial({ 'u1l8-int-add': 'b', 'u1l8-sub-neg': 'b', 'u1l8-left-right': 'b', 'u1l8-neg-square': 'b', 'u1l8-times-2': 'n', 'u1l8-add-across': 'n', 'u1l8-den-only': 'b',
    'u1l8-no-flip': 'b', 'u1l8-cross': 'n', 'u1l8-dec-digits': 'n', 'u1l8-place': 'b', 'u1l8-hm': 's', 'u1l8-closer': 's', 'u1l8-estimate': 'b', 'u1l8-not-root': 'b', 'u1l8-em': 'n',
    'u1l8-bracket-sign': 's', 'u1l8-pow-frac': 'b', 'u1l8-root-half': 'n', 'u1l8-ratio-flip': 's', 'u1l8-squared': 'b', 'u1l8-whole-plot': 'b', 'u1l8-radicand-sum': 'n' });

  /* ---------- number helpers ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var x = a % b; a = b; b = x; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function gcfA(a) { return a.reduce(gcd); }
  function lcmA(a) { return a.reduce(lcm); }
  function prodOf(a) { return a.reduce(function (m, x) { return m * x; }, 1); }
  function pw(a, n) { return Math.pow(a, n); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function expOf(n, p) { var e = 0; while (n > 0 && n % p === 0) { n /= p; e++; } return e; }
  function isSq(n) { var s = Math.round(Math.sqrt(n)); return s * s === n; }
  function rt(n, inner) { return ex.texRoot(n, inner); }
  function fr(p, q) { return ex.texRat(ex.norm(p, q)); }
  function frT(T) { return ex.texRat(T); }
  function nlist(nums) { var s = nums.map(function (n) { return t(F(n)); }); return s.length === 1 ? s[0] : s.length === 2 ? s[0] + ' and ' + s[1] : s.slice(0, -1).join(', ') + ', and ' + s[s.length - 1]; }
  function facEq(n) { return nt.isPrime(n) ? t(F(n)) + ' (prime)' : t(F(n) + '=' + K.fac(n)); }
  function facLines(nums) { return nums.map(facEq).join(', '); }
  function eqv(n) { var f = K.fac(n); return f === String(n) ? F(n) : f + '=' + F(n); }
  function pickB(r, arr, book) { return book != null && arr.some(function (x) { return JSON.stringify(x) === JSON.stringify(book); }) && r.chance(0.12) ? book : r.pick(arr); }
  function paren(n) { return n < 0 ? '(' + n + ')' : String(n); }

  /* ---------- GCF / LCM (from Math 10C u1l2) ---------- */
  function gcfHigh(nums) { return nt.factor(gcfA(nums)).reduce(function (m, pe) { return m * Math.pow(pe[0], Math.max.apply(null, nums.map(function (n) { return expOf(n, pe[0]); }))); }, 1); }
  function lcmLow(nums) { return nt.factor(lcmA(nums)).reduce(function (m, pe) { return m * Math.pow(pe[0], Math.min.apply(null, nums.map(function (n) { return expOf(n, pe[0]); }).filter(function (e) { return e > 0; }))); }, 1); }
  function gcfDiag(nums) {
    var g = gcfA(nums), L = lcmA(nums), pr = prodOf(nums), hi = gcfHigh(nums), rep = nt.factor(g).some(function (pe) { return pe[1] > 1; });
    return function (v) {
      if (v === L && L !== g) return { code: 'gcf-lcm', hint: 'That’s the <b>least common multiple</b> — every number divides <b>into</b> it. The GCF is the largest number that divides into every one of them, so it can’t be bigger than ' + t(F(Math.min.apply(null, nums))) + '.' };
      if (v === pr && pr !== g) return { code: 'gcf-product', hint: 'Multiplying the numbers gives a common <b>multiple</b>, not a common factor. The GCF has to divide into each number.' };
      if (!(v > 0) || v % 1) return null;
      var miss = nums.filter(function (n) { return n % v; });
      if (!miss.length) {
        if (v === 1) return { code: 'gcf-one', hint: 'The numbers do share a factor bigger than ' + t('1') + '. Compare their prime factorizations.' };
        return { code: 'gcf-not-greatest', hint: t(F(v)) + ' divides into every number, but it isn’t the <b>greatest</b> common factor. Some shared prime factors are missing' + (rep ? ' — watch for a prime that is shared more than once' : '') + '.' };
      }
      if (v === hi && hi !== g) return { code: 'gcf-high-power', hint: 'Right primes, but the GCF takes each shared prime to its <b>lowest</b> power: ' + t(F(v)) + ' doesn’t divide into ' + t(F(miss[0])) + '.' };
      if (v % g === 0 && nt.isPrime(v / g)) {
        var q = v / g;
        if (g % q === 0) return { code: 'gcf-high-power', hint: 'Check the power of ' + t(q) + ': ' + t(F(v)) + ' doesn’t divide into ' + t(F(miss[0])) + '. The GCF takes each shared prime to its <b>lowest</b> power.' };
        return { code: 'gcf-extra-prime', hint: 'Your answer has a factor of ' + t(q) + ', but ' + t(q) + ' isn’t a factor of ' + t(F(miss[0])) + '. Only use primes that appear in <b>every</b> factorization.' };
      }
      return { code: 'gcf-not-common', hint: t(F(v)) + ' doesn’t divide evenly into ' + t(F(miss[0])) + ', so it isn’t a common factor.' };
    };
  }
  function lcmDiag(nums) {
    var g = gcfA(nums), L = lcmA(nums), pr = prodOf(nums), lo = lcmLow(nums), mx = Math.max.apply(null, nums);
    return function (v) {
      if (v === g && g !== L) return { code: 'lcm-gcf', hint: 'That’s the <b>greatest common factor</b>. The LCM is a common <b>multiple</b>: every number must divide into it, so it is at least as big as ' + t(F(mx)) + '.' };
      if (v === pr && pr !== L) return { code: 'lcm-product', hint: 'Multiplying the numbers gives <i>a</i> common multiple, but not the <b>least</b> one: the shared prime factors got counted twice. Use each prime only once, at its highest power.' };
      if (!(v > 0) || v % 1) return null;
      var miss = nums.filter(function (n) { return v % n; });
      if (!miss.length) return { code: 'lcm-not-least', hint: t(F(v)) + ' is a common multiple, but not the <b>least</b> one. Use each prime only once, at its <b>highest</b> power.' };
      if (v === lo && lo !== L) return { code: 'lcm-low-power', hint: 'Right primes, but the LCM needs each prime to its <b>highest</b> power: ' + t(F(miss[0])) + ' doesn’t divide into ' + t(F(v)) + '.' };
      if (L % v === 0 && nt.isPrime(L / v)) {
        var q = L / v;
        if (v % q === 0) return { code: 'lcm-low-power', hint: 'Check the power of ' + t(q) + ': ' + t(F(miss[0])) + ' doesn’t divide into ' + t(F(v)) + '. The LCM takes each prime to its <b>highest</b> power.' };
        return { code: 'lcm-missing-prime', hint: 'A prime is missing: ' + t(F(miss[0])) + ' doesn’t divide into ' + t(F(v)) + '. Every prime that appears in <b>either</b> number belongs in the LCM.' };
      }
      return { code: 'lcm-not-multiple', hint: t(F(miss[0])) + ' doesn’t divide evenly into ' + t(F(v)) + ', so it isn’t a common multiple.' };
    };
  }
  function gcfSol(nums) {
    var g = gcfA(nums), sh = nt.factor(g);
    return facLines(nums) + '.<br>Use only the primes in <b>both</b> factorizations, each to its <b>lowest</b> power: ' + t(sh.map(function (pe) { return pe[1] > 1 ? pe[0] + '^{' + pe[1] + '}' : String(pe[0]); }).join(',\\ ')) + '.<br>GCF ' + t('=' + eqv(g)) + '.';
  }
  function lcmSol(nums) {
    var L = lcmA(nums), sh = nt.factor(L);
    return facLines(nums) + '.<br>Use <b>every</b> prime that appears, each to its <b>highest</b> power: ' + t(sh.map(function (pe) { return pe[1] > 1 ? pe[0] + '^{' + pe[1] + '}' : String(pe[0]); }).join(',\\ ')) + '.<br>LCM ' + t('=' + eqv(L)) + '.';
  }
  function normX(s) { return String(s == null ? '' : s).replace(/(\d)\s*[xX]\s*(?=\d)/g, '$1*'); }
  function plainFac(n) { return nt.factor(n).map(function (pe) { return pe[1] > 1 ? pe[0] + '^' + pe[1] : String(pe[0]); }).join(' × '); }
  function prodChk(n) {
    var c = K.product(n, 'either');
    return function (resp) {
      var s = normX(resp), pn = HW.parse.number(s);
      if (pn.ok && pn.value === n && !nt.isPrime(n)) return form('not-factored', 'Write ' + t(F(n)) + ' as a product of primes, like ' + t('2^{3}\\times 3') + '.');
      return c(s);
    };
  }
  /* "use prime factorization": a box for each factorization, then the GCF / LCM */
  function factFieldsPart(nums, kind) {
    var isG = kind === 'gcf', ans = isG ? gcfA(nums) : lcmA(nums), other = isG ? lcmA(nums) : gcfA(nums), lab = isG ? 'GCF' : 'LCM';
    var fields = nums.map(function (n) { return { name: t(F(n)), before: t(F(n) + '='), mode: 'math', wide: true }; }).concat([{ name: lab, before: t('\\text{' + lab + '}=') }]);
    var checks = nums.map(function (n) { return prodChk(n); }).concat([K.number(ans, isG ? gcfDiag(nums) : lcmDiag(nums))]);
    var keys = nums.map(plainFac).concat([String(ans)]);
    var p = P.fields('Use prime factorization to find the ' + lab + ' of ' + nlist(nums) + '. Write each number as a product of primes, then give the ' + lab + '.', fields, checks, keys,
      nums.map(function (n) { return t(F(n) + '=' + K.fac(n)); }).join('<br>') + '<br>' + lab + ' ' + t('=' + eqv(ans)),
      isG ? gcfSol(nums) : lcmSol(nums),
      ['Divide each number by the smallest prime that fits, again and again, until only primes are left.', isG ? 'The GCF uses only the primes in <b>both</b> numbers, each to its <b>lowest</b> power.' : 'The LCM uses <b>every</b> prime that appears, each to its <b>highest</b> power.'],
      lab + ' by primes: ' + nums.join(', '));
    p.good = [nums.map(function (n) { return nt.primeList(n).join('x'); }).concat([String(ans)])];
    p.bad = [keys.slice(0, -1).concat([String(other)]), keys.slice(0, -1).concat([String(prodOf(nums))])].filter(function (b) { return b[b.length - 1] !== String(ans); });
    return p;
  }

  /* ---------- fractions ---------- */
  /* any single number equal to T: a fraction (reduced or not), a mixed number, a whole number or an exact decimal */
  function fracChk(T, opt) {
    opt = opt || {}; T = ex.norm(T[0], T[1]); var V = T[0] / T[1];
    return function (resp) {
      var a = K.read(resp); if (a.res) return a.res;
      var mv = ex.mixedValue(a.ast), val = mv != null ? mv : a.val;
      if (ex.eq(val, V) || (V === 0 && Math.abs(val) < 1e-12)) {
        if (mv != null) return ok();
        var pf = ex.plainFraction(a.ast), sh = ex.shape(a.ast);
        if (pf || sh.bare) return ok();
        return form('simplify', 'Right value — now write it as a single fraction or whole number.');
      }
      if (!isFinite(val)) return wrong('undefined', null);
      var h = opt.diag ? opt.diag(val, a.ast) : null; if (h) return wrong(h.code || 'diag', h.hint);
      if (V !== 0 && ex.eq(val, 1 / V)) return wrong('flip', 'Your fraction is upside down — check which number goes on top.');
      if (V !== 0 && ex.eq(val, -V)) return wrong('sign', 'Check the sign of your answer.');
      if (ex.shape(a.ast).decimals && Math.abs(val - V) < 0.01) return form('decimal-rounded', 'That decimal is close but not exact. Give the exact answer as a fraction.');
      return wrong('value', null);
    };
  }
  function fracPart(prompt, T, diag, sol, hints, text, lowest) {
    T = ex.norm(T[0], T[1]);
    var p = P.math(prompt, lowest ? K.fraction(T, { diag: diag }) : fracChk(T, { diag: diag }), frT(T), sol, hints, text, { keys: 'fraction' });
    if (!lowest && T[1] > 1) p.good = ['\\frac{' + 2 * T[0] + '}{' + 2 * T[1] + '}'];
    if (lowest && T[1] > 1) p.bad = ['\\frac{' + (T[0] + 1) + '}{' + T[1] + '}'];
    return p;
  }
  function eqF(v, p, q) { return ex.eq(v, p / q); }
  function properPair(r, qs) { var q = r.pick(qs), ps = range(1, q - 1).filter(function (p) { return gcd(p, q) === 1; }); return [r.pick(ps), q]; }

  /* ---------- radicals (from Math 10C u1l8) ---------- */
  function Rq(c) { return typeof c === 'number' ? [c, 1] : c; }
  function rq(c) { c = Rq(c); return c[0] / c[1]; }
  var POW = { 2: 'square', 3: 'cube', 4: 'fourth power', 5: 'fifth power' }, ROOT = { 2: 'square root', 3: 'cube root', 4: 'fourth root', 5: 'fifth root' };
  var LIST = { 2: '4,\\ 9,\\ 16,\\ 25,\\ 36,\\ 49,\\ 64,\\ 81,\\ 100,\\ 121,\\ 144', 3: '8,\\ 27,\\ 64,\\ 125,\\ 216,\\ 343,\\ 512,\\ 729,\\ 1\\,000', 4: '16,\\ 81,\\ 256,\\ 625', 5: '32,\\ 243,\\ 1\\,024' };
  function coefTex(k) { k = Rq(k); if (k[1] === 1) return k[0] === 1 ? '' : k[0] === -1 ? '-' : String(k[0]); return (k[0] < 0 ? '-' : '') + '\\frac{' + Math.abs(k[0]) + '}{' + k[1] + '}'; }
  function given(c, n, R) { return coefTex(c) + rt(n, F(R)); }
  function mixTex(k, n, m) { return m === 1 ? ex.texRat(Rq(k)) : coefTex(k) + rt(n, F(m)); }
  function ratTex(r) { return ex.texRat(Rq(r)); }
  function pool(n, fs, lo, hi, cap) {
    var o = [];
    fs.forEach(function (f) { for (var tt = Math.max(2, lo); tt <= hi; tt++) { var R = pw(f, n) * tt; if ((!cap || R <= cap) && ex.nthFactor(R, n) === f && o.indexOf(R) < 0) o.push(R); } });
    return o;
  }
  function free(n, lo, hi) { return range(Math.max(2, lo), hi).filter(function (m) { return ex.simplest(m, n); }); }
  function hintsFor(n, A) {
    return ['Find the largest perfect ' + POW[n] + ' that divides ' + t(F(A)) + '. Perfect ' + POW[n] + 's: ' + t(LIST[n] + ',\\ \\ldots'),
      'Write ' + t(F(A)) + ' as (perfect ' + POW[n] + ') ' + t('\\times') + ' (what’s left). The ' + ROOT[n] + ' of the perfect ' + POW[n] + ' comes out in front.'];
  }
  function mixDiag(c, n, R, f, m, k) {
    var A = Math.abs(R), cA = Math.abs(rq(c)), V = rq(k) * pw(m, 1 / n), hasC = !(c[0] === 1 && c[1] === 1);
    return function (val, r) {
      if (R < 0 && ex.eq(val, -V)) return { code: 'neg-root', hint: 'Watch the sign: an odd root of a negative number is negative.' };
      if (hasC && cA === 1 && ex.eq(val, -V)) return { code: 'sign', hint: 'Don’t lose the minus sign in front of the root.' };
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
    if (R < 0) sol += 'The index is odd, so the negative sign comes out of the root.<br>';
    sol += t(rt(n, F(R)) + '=' + (sg < 0 ? '-' : '') + rt(n, F(pw(f, n)) + '\\times ' + F(m)) + '=' + (sg < 0 ? '-' : '') + rt(n, F(pw(f, n))) + '\\times ' + rt(n, F(m)) + '=' + inner) + '.';
    if (hasC && c[1] === 1 && Math.abs(c[0]) === 1) sol += '<br>Keep the minus sign in front: ' + t(given(c, n, R) + '=' + key) + '.';
    else if (hasC) sol += '<br>Multiply by the number in front: ' + t(ratTex(c) + '\\times ' + (sg < 0 ? '(-' + f + ')' : f) + '=' + ratTex(k)) + ', so ' + t(given(c, n, R) + '=' + key) + '.';
    var good = [], bad = [];
    if (n % 2 && k[0] < 0 && k[1] === 1) good.push((Math.abs(k[0]) === 1 ? '' : String(Math.abs(k[0]))) + rt(n, '-' + m));
    if (f > 1) bad.push(coefTex(ex.norm(c[0] * sg * pw(f, n), c[1])) + rt(n, F(m)));
    var p = P.math(o.prompt || t(given(c, n, R)), K.radical({ k: k, n: n, m: m }, 'mixed', { diag: mixDiag(c, n, R, f, m, k) }), key, sol, o.hints || hintsFor(n, A), o.text || 'mixed: ' + given(c, n, R), { keys: 'radical' });
    p.good = good; p.bad = bad; p.spec = { k: k, n: n, m: m, f: f };
    return p;
  }
  function entirePart(c, n, m, o) {
    o = o || {};
    var N = pw(c, n) * m, key = rt(n, F(N));
    var p = P.math(o.prompt || t(c + rt(n, m)), K.radical({ k: c, n: n, m: m }, 'entire', { diag: function (val, r) {
      if (r && r.n === n && Math.abs(rq(r.k)) === 1 && c > 2 && r.m === c * c * m && n === 3) return { code: 'u1l8-squared', hint: 'For a cube root, the ' + t(c) + ' is <b>cubed</b> when it moves inside: ' + t(c + '^{3}=' + pw(c, 3)) + '.' };
      return null;
    } }), key,
      'Raise the number in front to the power ' + t(n) + ': ' + t(c + '^{' + n + '}=' + pw(c, n)) + '.<br>' + t(c + rt(n, m) + '=' + rt(n, c + '^{' + n + '}') + '\\times ' + rt(n, m) + '=' + rt(n, pw(c, n) + '\\times ' + m) + '=' + key) + '.',
      o.hints || ['Write the number in front as a ' + ROOT[n] + ': ' + t(c + '=' + rt(n, c + '^{' + n + '}')) + '.', 'Then multiply the two numbers under the root.'], o.text || 'entire: ' + c + 'root' + n + ' ' + m, { keys: 'radical' });
    p.bad = [c + rt(n, m), rt(n, c * m)];
    return p;
  }
  function factMixPart(n, R, o) {
    o = o || {};
    var A = Math.abs(R), mp = mixPart(1, n, R), fac = K.fac(A);
    var groups = nt.factor(A).map(function (pe) { var Q = Math.floor(pe[1] / n), Rm = pe[1] % n; return Q ? t(pe[0] + (pe[1] > 1 ? '^{' + pe[1] + '}' : '')) + ': ' + t(pe[0] + (Q > 1 ? '^{' + Q + '}' : '')) + ' comes out' + (Rm ? ', ' + t(pe[0] + (Rm > 1 ? '^{' + Rm + '}' : '')) + ' stays inside' : '') : t(pe[0] + (pe[1] > 1 ? '^{' + pe[1] + '}' : '')) + ' stays inside'; });
    var sol = t(F(A) + '=' + fac) + '. With index ' + t(n) + ', every group of ' + t(n) + ' equal primes comes out as one copy:<br>' + groups.join('<br>') + '<br>' + mp.solution;
    var p = P.fields(o.prompt || t(rt(n, F(R))), [{ name: 'Prime factorization', label: 'Primes', before: t(F(A) + '='), mode: 'math', keys: 'expr', wide: true },
      { name: 'Simplest form', label: 'Simplest', before: t(rt(n, F(R)) + '='), mode: 'math', keys: 'expr', wide: true }],
      [prodChk(A), mp.check], [fac, mp.key], t(F(A) + '=' + fac) + '<br>' + t(rt(n, F(R)) + '=' + mp.key), sol,
      ['Divide ' + t(F(A)) + ' by small primes (2, 3, 5, 7, …) until only primes are left.', n === 2 ? 'Every <b>pair</b> of equal primes comes out as one copy. Multiply what comes out; multiply what stays inside.' : 'Index ' + t(n) + ': every group of ' + t(n) + ' equal primes comes out as one copy.'],
      o.text || 'primes then simplest: ' + rt(n, R));
    p.bad = [[fac, mp.bad[0] || '1']];
    return p;
  }
  /* "rational or irrational?" with reasons */
  function ratMC(r, valTex, mixed, isRat, extra) {
    var right = isRat ? 'Rational: it equals ' + t(mixed) + ', which can be written as a fraction of integers.' : 'Irrational: ' + t(mixed) + ' still has a root of a number that is not a perfect ' + (extra && extra.pw || 'square') + ', so its decimal never ends and never repeats.';
    var opts = [{ html: right, right: true },
      { html: isRat ? 'Irrational: it has a radical sign in it.' : 'Rational: it can be written exactly as ' + t(mixed) + '.', why: isRat ? 'A radical can still be rational: it simplifies to ' + t(mixed) + '.' : 'Being exact isn’t the same as being rational. ' + t(mixed) + ' is a whole number times an irrational root.' },
      { html: isRat ? 'Irrational: its decimal goes on forever.' : 'Rational: the number under the root is a whole number.', why: isRat ? 'It equals ' + t(mixed) + ' exactly, so its decimal doesn’t go on forever.' : 'Most roots of whole numbers are irrational; only perfect powers give rational roots.' },
      { html: isRat ? 'You can’t tell without a calculator.' : 'Rational: every number you can simplify is rational.', why: isRat ? 'Simplify it: ' + t(valTex + '=' + mixed) + '.' : 'Simplifying doesn’t change the number. The root left over is irrational.' }];
    return opts;
  }

  /* ---------- number sets table (from Math 10C u1l9) ---------- */
  var SET_COLS = [{ id: 'N', html: t('N'), label: 'N' }, { id: 'W', html: t('W'), label: 'W' }, { id: 'I', html: t('I'), label: 'I' }, { id: 'Q', html: t('Q'), label: 'Q' }, { id: 'Qb', html: t('\\overline{Q}'), label: 'Q-bar' }, { id: 'R', html: t('R'), label: 'R' }];
  var SETS = { nat: ['N', 'W', 'I', 'Q'], zero: ['W', 'I', 'Q'], negint: ['I', 'Q'], frac: ['Q'], irr: ['Qb'] };
  var SET_TEX = { N: 'N', W: 'W', I: 'I', Q: 'Q', Qb: '\\overline{Q}', R: 'R' };
  function setsOf(cls) { return SETS[cls].concat(['R']); }
  function setList(s) { return t(s.map(function (x) { return SET_TEX[x]; }).join(',\\ ')); }
  function setHint(c, got) {
    got = got || []; var has = function (x) { return got.indexOf(x) >= 0; }, X = t(c.tex), why = c.note ? ' (' + t(c.note) + ')' : '';
    if (has('Q') && has('Qb')) return { code: 'sets-both', hint: 'A number is rational <b>or</b> irrational, never both. Decide which one ' + X + ' is.' };
    if (c.cls === 'irr' && !has('Qb')) return { code: 'sets-irr', hint: X + ' is irrational' + why + ': its decimal never ends and never repeats.' };
    if (c.cls !== 'irr' && has('Qb')) return { code: 'sets-rat', hint: X + ' is rational' + why + ': it can be written as a fraction of integers.' };
    if (!has('R')) return { code: 'sets-R', hint: 'Every real number — rational or irrational — also belongs to ' + t('R') + '.' };
    if (c.cls === 'irr' && (has('N') || has('W') || has('I'))) return { code: 'sets-irr-int', hint: 'An irrational number isn’t in ' + t('N') + ', ' + t('W') + ' or ' + t('I') + ' — those hold only integers.' };
    if (c.cls === 'zero' && has('N')) return { code: 'sets-zero-N', hint: t('0') + ' is a whole number, but the natural numbers start at ' + t('1') + '.' };
    if (c.cls === 'negint' && (has('N') || has('W'))) return { code: 'sets-neg', hint: X + why + ' is negative. Natural and whole numbers are never negative.' };
    if (c.cls === 'frac' && (has('N') || has('W') || has('I'))) return { code: 'sets-frac', hint: X + why + ' is not an integer, so it isn’t in ' + t('N') + ', ' + t('W') + ' or ' + t('I') + '.' };
    if (c.cls !== 'irr' && !has('Q')) return { code: 'sets-Q', hint: X + why + ' can be written as a fraction of integers' + (c.cls !== 'frac' ? ' (every integer can: ' + t('n=\\frac{n}{1}') + ')' : '') + ', so it is rational.' };
    if (c.cls === 'nat' && !(has('N') && has('W') && has('I'))) return { code: 'sets-nat', hint: X + why + ' is a natural (counting) number, so it is also a whole number and an integer.' };
    if (c.cls === 'zero' && !(has('W') && has('I'))) return { code: 'sets-zero', hint: t('0') + ' is a whole number and an integer.' };
    if (c.cls === 'negint' && !has('I')) return { code: 'sets-negint', hint: X + why + ' is a negative integer.' };
    return null;
  }
  var SET_HINTS = ['Simplify each number first. Then work up the chain ' + t('N\\subset W\\subset I\\subset Q\\subset R') + '; an irrational number is in ' + t('\\overline{Q}') + ' and ' + t('R') + ' only.'];
  function setsPart(prompt, items, text) {
    var want = {}, by = {};
    items.forEach(function (c) { want[c.id] = setsOf(c.cls); by[c.id] = c; });
    var rows = items.map(function (c) { return { id: c.id, html: t(c.tex), label: c.label || c.id }; });
    var sol = items.map(function (c) { return t(c.tex) + (c.note ? ': ' + t(c.note) : '') + ' → ' + setList(want[c.id]); }).join('<br>');
    var p = P.grid(prompt, rows, SET_COLS, want, { why: function (id, got) { return setHint(by[id], got); }, rowHead: 'Number' }, sol, SET_HINTS, text);
    var noR = {}; items.forEach(function (c) { noR[c.id] = SETS[c.cls].slice(); }); p.bad = [noR];
    return p;
  }

  /* ---------- estimating a square or cube root ---------- */
  /* one-decimal estimate: right when within 0.1 of the true value (the booklet's "how far past the lower square" method lands there) */
  function estChk(x, lo, hi) {
    return function (resp) {
      var p = HW.parse.number(resp);
      if (!p.ok) return form(p.code === 'empty' ? 'empty' : 'notnumber', p.code === 'empty' ? 'Type your estimate.' : 'Enter a single decimal number, like ' + t((lo + 0.3).toFixed(1)) + '.');
      var v = p.value, dec = (String(HW.parse.plain(resp)).split('.')[1] || '').replace(/\s/g, '').length;
      if (dec > 1) return form('round', 'Give a one-decimal estimate (one digit after the decimal point).');
      if (Math.abs(v - x) <= 0.1 + 1e-9) return ok();
      if (v < lo || v > hi) return wrong('bracket', 'Your estimate should be between ' + t(lo) + ' and ' + t(hi) + '.');
      return wrong('u1l8-estimate', 'Close the gap: is the number nearer ' + t(lo + '^{2}') + ' or ' + t(hi + '^{2}') + '? Use how far it is past ' + t(lo * lo) + ' compared with the whole gap ' + t(hi * hi - lo * lo) + '.');
    };
  }
  function sideChk(want, other, isLo, n, m) {
    return K.number(want, function (v) {
      if (!Number.isInteger(v)) return { code: 'bracket', hint: 'Give a whole number.' };
      if (v === pw(want, n)) return { code: 'power-not-root', hint: t(pw(want, n)) + ' is the perfect ' + POW[n] + '. Give the whole number it comes from.' };
      if (v === other) return { code: 'swapped-bounds', hint: isLo ? 'That’s the larger one. The first box is the smaller whole number.' : 'That’s the smaller one. The second box is the larger whole number.' };
      return { code: 'bracket', hint: 'Check: ' + t(v + '^{' + n + '}=' + F(pw(v, n))) + '. You need consecutive whole numbers whose ' + nth(n) + ' powers are on either side of ' + t(F(m)) + '.' };
    });
  }
  function nth(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n + 'th'; }
  /* fields: smaller, larger, closer to, estimate (and optionally the exact mixed radical) */
  function estimateFields(N, withExact) {
    var x = Math.sqrt(N), lo = Math.floor(x), hi = lo + 1, near = N - lo * lo < hi * hi - N ? lo : hi, est = K.roundTo(lo + (N - lo * lo) / (hi * hi - lo * lo), 1);
    var fields = [{ name: 'Smaller', label: 'Between', after: t('<\\sqrt{' + N + '}') }, { name: 'Larger', label: 'and', before: t('\\sqrt{' + N + '}<') }, { name: 'Closer to', label: 'Closer to' }, { name: 'Estimate', label: 'Estimate', before: t('\\sqrt{' + N + '}\\approx') }];
    var checks = [sideChk(lo, hi, true, 2, N), sideChk(hi, lo, false, 2, N), K.number(near, function (v) { if (v === (near === lo ? hi : lo)) return { code: 'u1l8-closer', hint: t(N) + ' is ' + t(N - lo * lo) + ' past ' + t(lo * lo) + ' and ' + t(hi * hi - N) + ' short of ' + t(hi * hi) + '. Which is nearer?' }; return null; }), estChk(x, lo, hi)];
    var keys = [String(lo), String(hi), String(near), est.toFixed(1)];
    var sol = t(lo * lo + '<' + N + '<' + hi * hi) + ', so ' + t(lo + '<\\sqrt{' + N + '}<' + hi) + '.<br>' + t(N) + ' is ' + t(N - lo * lo) + ' past ' + t(lo * lo) + ' but ' + t(hi * hi - N) + ' short of ' + t(hi * hi) + ', so ' + t('\\sqrt{' + N + '}') + ' is closer to ' + t(near) + '.<br>About ' + t(N - lo * lo) + ' out of the gap of ' + t(hi * hi - lo * lo) + ': ' + t('\\sqrt{' + N + '}\\approx ' + est.toFixed(1)) + ' (calculator: ' + t(x.toFixed(3)) + ').';
    if (withExact) {
      var mp = mixPart(1, 2, N);
      fields.push({ name: 'Exact', label: 'Exact', before: t('\\sqrt{' + N + '}='), mode: 'math', keys: 'radical' }); checks.push(mp.check); keys.push(mp.key); sol += '<br>Exact: ' + mp.solution;
    }
    return { fields: fields, checks: checks, keys: keys, sol: sol, answer: t(lo + '<\\sqrt{' + N + '}<' + hi) + ', closer to ' + t(near) + ', ' + t('\\approx ' + est.toFixed(1)) + (withExact ? ', exactly ' + t(keys[4]) : ''), lo: lo, hi: hi, near: near };
  }
  /* list every n that fits */
  function listPart(prompt, want, sol, hints, text, inRange, cond) {
    var sameSet = function (A, B) { return A.length === B.length && A.every(function (x) { return B.indexOf(x) >= 0; }); };
    return { prompt: prompt, input: { type: 'list' }, key: want, answer: t(K.listTex(want)), solution: sol, hints: hints, text: text,
      check: function (resp) {
        if (!resp || !resp.length) return form('empty', 'Add the values one at a time (press Enter or comma after each).');
        var seen = {}; for (var i = 0; i < resp.length; i++) { if (seen[resp[i]]) return form('duplicate', 'You listed ' + t(resp[i]) + ' more than once.'); seen[resp[i]] = 1; }
        if (sameSet(resp, want)) return ok();
        var extra = resp.filter(function (x) { return want.indexOf(x) < 0; });
        if (extra.length) { var e = extra[0]; return wrong('between-extra', !inRange(e) ? t(e) + ' isn’t in the range: ' + inRange.why(e) : t(e) + ' is in the range, but ' + cond.why(e)); }
        return wrong('between-missing', 'Every number you listed works, but you have ' + resp.length + ' of the ' + want.length + ' values.');
      },
      bad: [want.slice(1), want.concat([want[want.length - 1] + 1])] };
  }

  /* ---------- small part makers ---------- */
  /* calculator answer: the correctly rounded value, or one hundredth either side of it (calculators and rounding differ) */
  function calcChk(x, dp, opt) {
    var base = K.approx(x, dp, opt), tol = Math.pow(10, -dp) * 1.01;
    return function (resp) {
      var r = base(resp); if (r.v === 'correct') return r;
      var p = HW.parse.number(resp); if (!p.ok) return r;
      var dec = (String(HW.parse.plain(resp)).replace(/\s/g, '').split('.')[1] || '').length;
      return dec <= dp && Math.abs(p.value - x) <= tol ? ok() : r;
    };
  }
  function intPart(tex, ans, diag, sol, hints, text) { var p = P.number(t(tex), ans, diag, sol, hints, text || tex); return p; }
  function emPart(r, tex, isEntire) {
    var p = P.mc(r, 'Is ' + t(tex) + ' an entire radical or a mixed radical?', [{ html: '<b>Entire</b>', right: isEntire, why: isEntire ? null : t(tex) + ' has a number multiplying the root from outside, so it is <b>mixed</b>.', code: 'said-entire' }, { html: '<b>Mixed</b>', right: !isEntire, why: isEntire ? t(tex) + ' has only a number under the root and nothing in front, so it is <b>entire</b>.' : null, code: 'said-mixed' }],
      t(tex) + (isEntire ? ' has nothing in front of the root: <b>entire</b>.' : ' has a coefficient in front of the root: <b>mixed</b>.'), ['Entire: just a root of a number. Mixed: a number times a root.'], 'entire or mixed ' + tex, true);
    p.tries = 1; p.input.columns = 2;
    return p;
  }
  function yesNoChk(want, yesWhy, noWhy) {
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim().toLowerCase().replace(/^\\text\{(.*)\}$/, '$1');
      if (!s) return form('empty', 'Type <b>yes</b> or <b>no</b>.');
      var y = /^(yes|y|yep|true)\b/.test(s), n = /^(no|n|nope|not|false)\b/.test(s);
      if (y === n) return form('yes-no', 'Type <b>yes</b> or <b>no</b>.');
      return y === want ? ok() : wrong(y ? 'said-yes' : 'said-no', y ? yesWhy : noWhy);
    };
  }

  /* ---------- pools ---------- */
  var BUS = [[15, 40], [12, 20], [20, 30], [18, 24], [15, 25], [12, 15], [20, 25], [25, 30], [18, 30], [24, 36], [30, 45], [20, 35], [15, 35], [12, 40], [25, 40], [30, 40], [45, 60], [24, 40], [36, 48], [15, 20], [40, 60], [16, 24], [10, 25], [14, 21], [12, 18], [35, 50], [20, 45], [18, 45]].filter(function (ab) { var L = lcm(ab[0], ab[1]); return L >= 60 && L <= 300 && L < ab[0] * ab[1]; });

  HW.defineLesson({
    id: 'u1l8', unit: 1, num: '8', title: 'Unit Review: Number Sense', outcome: 'AN2',
    blurb: 'Mixed practice for the Unit 1 test: integers and fractions, primes, GCF and LCM, the real-number sets, perfect powers and estimating roots, and simplifying radicals.',
    questions: [
      { num: '1', section: 'Part A — Integer Operations and Order of Operations', stem: 'Evaluate each expression.', outcome: 'REV', parts: [
        { id: '1a', level: 'BEG', make: function (r) {
          var ab = pickB(r, range(3, 20).reduce(function (o, a) { range(a + 1, a + 15).forEach(function (b) { o.push([a, b]); }); return o; }, []), [9, 14]), a = ab[0], b = ab[1], ans = b - a;
          return intPart('-' + a + '+' + b, ans, function (v) { if (v === -ans) return { code: 'sign', hint: 'Different signs: subtract the sizes and keep the sign of the larger one. ' + t(b) + ' is larger and positive.' }; if (v === a + b || v === -(a + b)) return { code: 'u1l8-int-add', hint: 'The signs are different, so <b>subtract</b> the sizes: ' + t(b + '-' + a) + '.' }; return null; },
            'Different signs: subtract the sizes, ' + t(b + '-' + a + '=' + ans) + ', and keep the sign of the larger (' + t('+' + b) + '). So ' + t('-' + a + '+' + b + '=' + ans) + '.', ['Start at ' + t('-' + a) + ' on a number line and move ' + t(b) + ' to the right.']);
        } },
        { id: '1b', level: 'BEG', make: function (r) {
          var a = r.int(2, 20), b = r.int(2, 15); if (r.chance(0.1)) { a = 8; b = 6; } var ans = -(a + b);
          return intPart('-' + a + '-' + b, ans, function (v) { if (v === -ans) return { code: 'sign', hint: 'Starting at ' + t('-' + a) + ' and going ' + t(b) + ' further left can’t give a positive number.' }; if (v === b - a || v === a - b) return { code: 'u1l8-int-add', hint: 'Both are going the same way (negative), so <b>add</b> the sizes and keep the negative sign.' }; return null; },
            'Subtracting ' + t(b) + ' is adding ' + t('-' + b) + ': ' + t('-' + a + '+(-' + b + ')') + '. Same signs: add the sizes and keep the sign. ' + t('-' + a + '-' + b + '=' + ans) + '.', ['Start at ' + t('-' + a) + ' and move ' + t(b) + ' to the <b>left</b>.']);
        } },
        { id: '1c', level: 'BEG', make: function (r) {
          var a = r.int(2, 20), b = r.int(2, 15); if (r.chance(0.1)) { a = 5; b = 11; } var ans = a + b;
          return intPart(a + '-(-' + b + ')', ans, function (v) { if (v === a - b) return { code: 'u1l8-sub-neg', hint: 'Subtracting a negative is <b>adding the opposite</b>: ' + t(a + '-(-' + b + ')=' + a + '+' + b) + '.' }; if (v === -ans) return { code: 'sign', hint: 'Check the sign.' }; return null; },
            'Subtracting a negative is adding the opposite: ' + t(a + '-(-' + b + ')=' + a + '+' + b + '=' + ans) + '.', ['Subtracting ' + t('-' + b) + ' is the same as adding ' + t('+' + b) + '.']);
        } },
        { id: '1d', level: 'BEG', make: function (r) {
          var a = r.int(2, 25), b = r.int(2, 15); if (r.chance(0.1)) { a = 20; b = 7; } var ans = -(a + b);
          return intPart('-' + a + '+(-' + b + ')', ans, function (v) { if (v === -ans) return { code: 'sign', hint: 'Both numbers are negative, so the sum is negative.' }; if (v === b - a || v === a - b) return { code: 'u1l8-int-add', hint: 'Same signs: <b>add</b> the sizes and keep the sign.' }; return null; },
            'Same signs: add the sizes and keep the sign. ' + t('-' + a + '+(-' + b + ')=-' + (a + b)) + '.', ['Adding a negative moves you left on the number line.']);
        } }] },
      { num: '2', stem: 'Evaluate each expression.', outcome: 'REV', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var a = r.int(2, 12), b = r.int(2, 12); if (r.chance(0.1)) { a = 7; b = 4; } return intPart('(-' + a + ')(' + b + ')', -a * b, function (v) { return v === a * b ? { code: 'sign', hint: 'Unlike signs (one negative, one positive) multiply to a <b>negative</b>.' } : null; }, 'Unlike signs give a negative: ' + t('(-' + a + ')(' + b + ')=-' + a * b) + '.', ['Multiply the sizes, then decide the sign: unlike signs give a negative.']); } },
        { id: '2b', level: 'BEG', make: function (r) { var a = r.int(2, 12), b = r.int(2, 12); if (r.chance(0.1)) { a = 9; b = 5; } return intPart('(-' + a * b + ')\\div(-' + a + ')', b, function (v) { return v === -b ? { code: 'sign', hint: 'Like signs (both negative) divide to a <b>positive</b>.' } : null; }, 'Like signs give a positive: ' + t('(-' + a * b + ')\\div(-' + a + ')=' + b) + '.', ['Divide the sizes, then decide the sign: like signs give a positive.']); } },
        { id: '2c', level: 'BEG', make: function (r) { var a = r.int(2, 12), b = r.int(2, 12); if (r.chance(0.1)) { a = 6; b = 8; } return intPart(a + '\\times(-' + b + ')', -a * b, function (v) { return v === a * b ? { code: 'sign', hint: 'Unlike signs multiply to a <b>negative</b>.' } : null; }, t(a + '\\times(-' + b + ')=-' + a * b) + ' (unlike signs).', ['Unlike signs give a negative.']); } },
        { id: '2d', level: 'BEG', make: function (r) { var a = r.int(2, 12), b = r.int(2, 12); if (r.chance(0.1)) { a = 4; b = 8; } return intPart('-' + a * b + '\\div' + a, -b, function (v) { return v === b ? { code: 'sign', hint: 'Unlike signs divide to a <b>negative</b>.' } : null; }, t('-' + a * b + '\\div ' + a + '=-' + b) + ' (unlike signs).', ['Unlike signs give a negative.']); } }] },
      { num: '3', stem: 'Evaluate each expression using the correct order of operations.', outcome: 'REV', parts: [
        { id: '3a', level: 'EMG', make: function (r) {
          var a = r.int(2, 15), b = r.int(2, 6), c = r.int(2, 6); if (r.chance(0.1)) { a = 9; b = 4; c = 2; } var ans = a + b * c;
          return intPart(a + '-' + b + '\\times(-' + c + ')', ans, function (v) { if (v === (a - b) * -c) return { code: 'u1l8-left-right', hint: 'Multiply before you subtract: work out ' + t(b + '\\times(-' + c + ')') + ' first.' }; if (v === a - b * c) return { code: 'u1l8-sub-neg', hint: t(b + '\\times(-' + c + ')=-' + b * c) + ', and subtracting a negative is adding: ' + t(a + '-(-' + b * c + ')=' + a + '+' + b * c) + '.' }; return null; },
            'Multiply first: ' + t(b + '\\times(-' + c + ')=-' + b * c) + '. Then ' + t(a + '-(-' + b * c + ')=' + a + '+' + b * c + '=' + ans) + '.', ['Multiplication comes before subtraction.', 'Subtracting a negative is adding the opposite.']);
        } },
        { id: '3b', level: 'EMG', make: function (r) {
          var a = r.int(1, 9), b = r.int(2, 9), c = r.int(2, 4), d = r.int(2, 12); if (r.chance(0.1)) { a = 3; b = 5; c = 2; d = 7; } var s = -a - b, ans = s * c + d;
          return intPart('(-' + a + '-' + b + ')\\times' + c + '+' + d, ans, function (v) { if (v === s * (c + d)) return { code: 'u1l8-left-right', hint: 'Multiply before you add: ' + t('(' + s + ')\\times ' + c) + ' first, then add ' + t(d) + '.' }; if (v === (b - a) * c + d || v === (a - b) * c + d || v === (a + b) * c + d) return { code: 'u1l8-bracket-sign', hint: 'Inside the brackets: ' + t('-' + a + '-' + b + '=' + s) + ' (both going left).' }; return null; },
            'Brackets: ' + t('-' + a + '-' + b + '=' + s) + '. Multiply: ' + t('(' + s + ')\\times ' + c + '=' + s * c) + '. Add: ' + t(s * c + '+' + d + '=' + ans) + '.', ['Brackets first, then multiply, then add.']);
        } },
        { id: '3c', level: 'EMG', make: function (r) {
          var a = r.int(2, 15); if (r.chance(0.1)) a = 8;
          return intPart('-' + a + '^{2}', -a * a, function (v) { if (v === a * a) return { code: 'u1l8-neg-square', hint: 'Without brackets the exponent belongs to ' + t(a) + ' only: ' + t('-' + a + '^{2}=-(' + a + '\\times ' + a + ')') + '.' }; if (v === -2 * a || v === 2 * a) return { code: 'u1l8-times-2', hint: 'Squaring means multiplying the number by itself, not by ' + t(2) + '.' }; return null; },
            'The exponent applies only to ' + t(a) + ': ' + t('-' + a + '^{2}=-(' + a + '\\times ' + a + ')=-' + a * a) + '.', ['Is the minus sign inside brackets? If not, the exponent doesn’t touch it.']);
        } },
        { id: '3d', level: 'EMG', make: function (r) {
          var a = r.int(2, 15); if (r.chance(0.1)) a = 8;
          return intPart('(-' + a + ')^{2}', a * a, function (v) { if (v === -a * a) return { code: 'u1l8-neg-square', hint: 'The brackets put the negative inside the square: ' + t('(-' + a + ')\\times(-' + a + ')') + ' is positive.' }; if (v === -2 * a || v === 2 * a) return { code: 'u1l8-times-2', hint: 'Squaring means multiplying the number by itself.' }; return null; },
            t('(-' + a + ')^{2}=(-' + a + ')\\times(-' + a + ')=' + a * a) + ' — two negatives multiply to a positive.', ['The base is ' + t('-' + a) + ', in brackets. Multiply it by itself.']);
        } }] },
      { num: '4', section: 'Part B — Fraction and Decimal Operations', stem: 'Evaluate each expression.', outcome: 'REV', parts: [
        { id: '4a', level: 'EMG', make: function (r) {
          var A, B;
          for (var g = 0; g < 100; g++) { A = properPair(r, [2, 3, 4, 5, 6, 8, 9, 10]); B = properPair(r, [3, 4, 5, 6, 8, 9, 10, 12]); if (A[1] !== B[1] && gcd(A[1], B[1]) < Math.min(A[1], B[1])) break; }
          if (r.chance(0.1)) { A = [1, 3]; B = [3, 8]; }
          var D = lcm(A[1], B[1]), n1 = A[0] * D / A[1], n2 = B[0] * D / B[1], T = ex.norm(n1 + n2, D);
          return fracPart(t(fr(A[0], A[1]) + '+' + fr(B[0], B[1])), T, function (v) { if (eqF(v, A[0] + B[0], A[1] + B[1])) return { code: 'u1l8-add-across', hint: 'Don’t add the denominators. Rewrite both fractions with a common denominator (' + t(D) + ') first, then add the numerators.' }; if (eqF(v, A[0] + B[0], D)) return { code: 'u1l8-den-only', hint: 'When you change a denominator to ' + t(D) + ', multiply the numerator by the same number.' }; return null; },
            'Common denominator ' + t(D) + ': ' + t(fr(A[0], A[1]) + '+' + fr(B[0], B[1]) + '=\\frac{' + n1 + '}{' + D + '}+\\frac{' + n2 + '}{' + D + '}=\\frac{' + (n1 + n2) + '}{' + D + '}' + (T[1] !== D ? '=' + frT(T) : '')) + '.', ['Find the lowest common denominator of ' + t(A[1]) + ' and ' + t(B[1]) + '.', 'Rewrite both fractions over it, then add the numerators.'], 'add fractions');
        } },
        { id: '4b', level: 'EMG', make: function (r) {
          var A, B;
          for (var g = 0; g < 200; g++) { A = properPair(r, [3, 4, 5, 6, 8, 9, 10, 12]); B = properPair(r, [2, 3, 4, 6, 8, 9, 12]); if (A[1] !== B[1] && A[0] / A[1] > B[0] / B[1] + 0.05 && gcd(A[1], B[1]) > 1) break; }
          if (r.chance(0.1)) { A = [7, 9]; B = [1, 6]; }
          var D = lcm(A[1], B[1]), n1 = A[0] * D / A[1], n2 = B[0] * D / B[1], T = ex.norm(n1 - n2, D);
          return fracPart(t(fr(A[0], A[1]) + '-' + fr(B[0], B[1])), T, function (v) { if (A[1] !== B[1] && eqF(v, A[0] - B[0], A[1] - B[1])) return { code: 'u1l8-add-across', hint: 'Don’t subtract the denominators. Use a common denominator (' + t(D) + ') first.' }; if (eqF(v, A[0] - B[0], D)) return { code: 'u1l8-den-only', hint: 'When you change a denominator to ' + t(D) + ', multiply the numerator by the same number.' }; return null; },
            'Common denominator ' + t(D) + ': ' + t('\\frac{' + n1 + '}{' + D + '}-\\frac{' + n2 + '}{' + D + '}=\\frac{' + (n1 - n2) + '}{' + D + '}' + (T[1] !== D ? '=' + frT(T) : '')) + '.', ['Find the lowest common denominator of ' + t(A[1]) + ' and ' + t(B[1]) + '.', 'Rewrite both fractions over it, then subtract the numerators.'], 'subtract fractions');
        } }] },
      { num: '5', stem: 'Evaluate each expression. Try cancelling common factors first in (a).', outcome: 'REV', parts: [
        { id: '5a', level: 'EMG', make: function (r) {
          var A, B;
          for (var g = 0; g < 200; g++) { A = properPair(r, [3, 4, 5, 6, 7, 8, 9, 10, 12]); B = properPair(r, [3, 4, 5, 6, 7, 8, 9, 10, 12]); if (gcd(A[0], B[1]) > 1 && gcd(B[0], A[1]) > 1) break; }
          if (r.chance(0.1)) { A = [5, 12]; B = [3, 10]; }
          var T = ex.norm(A[0] * B[0], A[1] * B[1]);
          var p = fracPart(t(fr(A[0], A[1]) + '\\times' + fr(B[0], B[1])), T, function (v) { if (eqF(v, A[0] * B[1], A[1] * B[0])) return { code: 'u1l8-cross', hint: 'To multiply fractions, multiply top × top and bottom × bottom — no flipping, no cross-multiplying.' }; return null; },
            'Cancel common factors first: ' + t(A[0]) + ' with ' + t(B[1]) + ' (÷' + gcd(A[0], B[1]) + ') and ' + t(B[0]) + ' with ' + t(A[1]) + ' (÷' + gcd(B[0], A[1]) + ').<br>' + t(fr(A[0], A[1]) + '\\times' + fr(B[0], B[1]) + '=\\frac{' + A[0] / gcd(A[0], B[1]) + '\\times ' + B[0] / gcd(B[0], A[1]) + '}{' + A[1] / gcd(B[0], A[1]) + '\\times ' + B[1] / gcd(A[0], B[1]) + '}=' + frT(T)) + '.', ['Try cancelling common factors first: a top number with a bottom number.', 'Then multiply top × top and bottom × bottom.'], 'multiply fractions');
          return p;
        } },
        { id: '5b', level: 'EMG', make: function (r) {
          var A, B;
          for (var g = 0; g < 200; g++) { A = properPair(r, [2, 3, 4, 5, 6, 7, 8, 9]); B = properPair(r, [2, 3, 4, 5, 6, 7, 8, 9]); if (A[0] * B[1] !== A[1] * B[0] && A[1] !== B[1]) break; }
          if (r.chance(0.1)) { A = [2, 5]; B = [3, 4]; }
          var T = ex.norm(A[0] * B[1], A[1] * B[0]);
          return fracPart(t(fr(A[0], A[1]) + '\\div' + fr(B[0], B[1])), T, function (v) { if (eqF(v, A[0] * B[0], A[1] * B[1])) return { code: 'u1l8-no-flip', hint: 'Dividing means multiplying by the <b>reciprocal</b>: flip ' + t(fr(B[0], B[1])) + ' to ' + t('\\frac{' + B[1] + '}{' + B[0] + '}') + ' first.' }; return null; },
            'Multiply by the reciprocal: ' + t(fr(A[0], A[1]) + '\\div' + fr(B[0], B[1]) + '=' + fr(A[0], A[1]) + '\\times\\frac{' + B[1] + '}{' + B[0] + '}=' + frT(T)) + '.', ['Keep the first fraction, change ÷ to ×, flip the second fraction.'], 'divide fractions');
        } }] },
      { num: '6', stem: 'Convert and evaluate as directed.', outcome: 'REV', parts: [
        { id: '6a', level: 'BEG', make: function (r) {
          var A = r.chance(0.1) ? [5, 8] : r.pick([[1, 8], [3, 8], [5, 8], [7, 8], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [1, 20], [3, 20], [7, 20], [9, 20], [11, 20], [3, 25], [7, 25], [9, 25], [3, 40], [7, 40], [9, 40], [1, 16], [3, 16], [5, 16], [3, 50], [7, 50]]);
          var v = A[0] / A[1], key = String(K.roundTo(v, 6));
          var p = P.number('Convert ' + t('\\frac{' + A[0] + '}{' + A[1] + '}') + ' to a decimal.', v, function (x) { if (ex.eq(x, A[1] / A[0])) return { code: 'flip', hint: 'Divide the top by the bottom: ' + t(A[0] + '\\div ' + A[1]) + '.' }; if (ex.eq(x, Number(A[0] + '.' + A[1])) || ex.eq(x, Number('0.' + A[0] + A[1]))) return { code: 'u1l8-dec-digits', hint: 'A fraction bar means divide: ' + t(A[0] + '\\div ' + A[1]) + '.' }; return null; },
            t('\\frac{' + A[0] + '}{' + A[1] + '}=' + A[0] + '\\div ' + A[1] + '=' + key) + '. (Or make the denominator a power of 10: ' + t('\\frac{' + A[0] + '}{' + A[1] + '}=\\frac{' + Math.round(v * pw(10, key.split('.')[1].length)) + '}{' + pw(10, key.split('.')[1].length) + '}') + '.)', ['Divide the numerator by the denominator.', 'Or multiply top and bottom to make the denominator 10, 100 or 1000.'], 'fraction to decimal');
          p.key = key; return p;
        } },
        { id: '6b', level: 'EMG', make: function (r) {
          var opts = range(2, 98).filter(function (k) { return k % 10 && gcd(k, 100) > 1; }), k = r.chance(0.1) ? 24 : r.pick(opts), T = ex.norm(k, 100), ds = (k < 10 ? '0.0' : '0.') + k;
          return fracPart('Convert ' + t(ds) + ' to a fraction in lowest terms.', T, function (v) { if (eqF(v, k, 10) || eqF(v, k, 1000)) return { code: 'u1l8-place', hint: 'The last digit is in the <b>hundredths</b> place, so the denominator is ' + t(100) + '.' }; return null; },
            'Two decimal places → hundredths: ' + t(ds + '=\\frac{' + k + '}{100}') + '. Divide top and bottom by ' + t(gcd(k, 100)) + ': ' + t('\\frac{' + k + '}{100}=' + frT(T)) + '.', ['What place value is the last digit in? That gives the denominator.', 'Then reduce: divide top and bottom by their GCF.'], 'decimal to fraction', true);
        } },
        { id: '6c', level: 'PRG', make: function (r) {
          var A, B, C, prod, T;
          for (var g = 0; g < 300; g++) { A = properPair(r, [2, 3, 4, 5, 6]); B = properPair(r, [2, 3, 4, 5]); C = properPair(r, [3, 4, 5, 6]); prod = ex.norm(B[0] * C[0], B[1] * C[1]); T = ex.norm(A[0] * prod[1] - prod[0] * A[1], A[1] * prod[1]); if (T[0] > 0 && T[1] <= 60 && (gcd(B[0], C[1]) > 1 || gcd(C[0], B[1]) > 1)) break; }
          if (r.chance(0.1)) { A = [3, 4]; B = [1, 3]; C = [3, 5]; prod = [1, 5]; T = [11, 20]; }
          var lr = ex.norm((A[0] * B[1] - B[0] * A[1]) * C[0], A[1] * B[1] * C[1]);
          return fracPart('Evaluate ' + t(fr(A[0], A[1]) + '-' + fr(B[0], B[1]) + '\\times' + fr(C[0], C[1])) + ' in the correct order.', T, function (v) { if (ex.eq(v, lr[0] / lr[1])) return { code: 'u1l8-left-right', hint: 'Multiply before you subtract: work out ' + t(fr(B[0], B[1]) + '\\times' + fr(C[0], C[1])) + ' first.' }; return null; },
            'Multiply first: ' + t(fr(B[0], B[1]) + '\\times' + fr(C[0], C[1]) + '=' + frT(prod)) + '.<br>Then subtract: ' + t(fr(A[0], A[1]) + '-' + frT(prod) + '=' + frT(T)) + '.', ['Multiplication comes before subtraction.', 'Then use a common denominator to subtract.'], 'fraction order of ops');
        } }] },
      { num: '7', section: 'Part C — Prime Factorization, GCF, and LCM', stem: '', outcome: 'AN1', parts: [
        { id: '7', level: 'BEG', make: function (r) {
          var o = [], PR = [2, 3, 5, 7, 11, 13];
          PR.forEach(function (p) { PR.forEach(function (q) { PR.forEach(function (s) { if (p === q || q === s || p === s || p > s) return; var n = p * q * q * s; if (n >= 60 && n <= 500 && o.indexOf(n) < 0) o.push(n); n = pw(q, 3) * p * s; if (n >= 60 && n <= 500 && o.indexOf(n) < 0) o.push(n); }); }); });
          var n = pickB(r, o, 126);
          return { prompt: 'Find the prime factorization of ' + t(F(n)) + '.', input: { type: 'math', keys: 'expr', before: t(F(n) + '=') }, check: prodChk(n), key: K.fac(n), answer: t(F(n) + '=' + K.fac(n)), text: 'prime factorization ' + n,
            solution: 'Divide by the smallest prime each time:' + K.ladderSolution(n) + t(F(n) + '=' + K.exp(n) + '=' + K.fac(n)), hints: ['Start with the smallest prime that divides ' + t(F(n)) + ' and keep dividing until you reach ' + t('1') + '.', 'Check: multiply your primes back together.'] };
        } }] },
      { num: '8', stem: '', outcome: 'AN1', parts: [
        { id: '8', level: 'EMG', make: function (r) {
          var o = []; [6, 8, 9, 10, 12, 14, 15, 18, 20, 24].forEach(function (g) { [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [4, 7], [3, 7]].forEach(function (xy) { if (g * xy[1] <= 150) o.push([g * xy[0], g * xy[1]]); }); });
          var ab = pickB(r, o, [54, 72]); return factFieldsPart(ab, 'gcf');
        } }] },
      { num: '9', stem: '', outcome: 'AN1', parts: [
        { id: '9', level: 'EMG', make: function (r) {
          var o = []; range(4, 30).forEach(function (a) { range(a + 1, 40).forEach(function (b) { var g = gcd(a, b); if (g > 1 && g < a && lcm(a, b) <= 150 && b % a) o.push([a, b]); }); });
          var ab = pickB(r, o, [6, 16]); return factFieldsPart(ab, 'lcm');
        } }] },
      { num: '10', stem: '', outcome: 'AN1', parts: [
        { id: '10', level: 'PRG', make: function (r) {
          var ab = pickB(r, BUS, [15, 40]), a = ab[0], b = ab[1], L = lcm(a, b), g = gcd(a, b), h = Math.floor(L / 60), mn = L % 60;
          var p = P.fields('Bus Route A leaves the station every ' + t(a) + ' minutes. Bus Route B leaves every ' + t(b) + ' minutes. Both buses leave the station together at 8:00 a.m. How long will it be before both buses leave together again? Give your answer in minutes, and then in hours and minutes.',
            [{ name: 'Minutes', label: 'In minutes', after: 'min' }, { name: 'Hours', label: 'Hours and minutes', after: 'h' }, { name: 'and minutes', label: '', after: 'min' }],
            [K.number(L, function (v) { if (v === a * b) return { code: 'lcm-product', hint: t(a + '\\times ' + b + '=' + a * b) + ' minutes is <i>a</i> time they meet, but not the <b>first</b>. Find the <b>least</b> common multiple.' }; if (v === g) return { code: 'gave-gcf', hint: 'Neither bus is back after only ' + t(g) + ' minutes. They meet at a common <b>multiple</b> of ' + t(a) + ' and ' + t(b) + '.' }; return lcmDiag([a, b])(v); }),
              K.number(h, function (v) { if (v === Math.round(L / 60 * 100) / 100 || v === L / 60) return { code: 'decimal-hours', hint: 'Give whole hours here, and the leftover minutes in the last box.' }; if (v === L) return { code: 'u1l8-hm', hint: 'How many <b>whole hours</b> is ' + t(L) + ' minutes? (60 minutes = 1 hour.)' }; return { code: 'u1l8-hm', hint: t('60') + ' minutes make an hour: ' + t(L + '\\div 60') + ' gives the whole hours.' }; }),
              K.number(mn, function (v) { return { code: 'u1l8-hm', hint: 'The minutes left over: ' + t(L + '-' + h + '\\times 60') + '.' }; })],
            [String(L), String(h), String(mn)], t(L) + ' minutes ' + t('=') + ' ' + t(h) + ' h ' + t(mn) + ' min',
            'The buses leave together at the common multiples of ' + t(a) + ' and ' + t(b) + ' minutes; the first one is the LCM.<br>' + facLines([a, b]) + ', so ' + t('\\text{LCM}=' + eqv(L)) + ' minutes.<br>' + t(L + '\\text{ min}=' + h + '\\times 60+' + mn + '=' + h + '\\text{ h }' + mn + '\\text{ min}') + '.',
            ['When are both buses back together? Look for a common multiple of ' + t(a) + ' and ' + t(b) + '.', 'Find the LCM in minutes, then divide by 60 for hours; the remainder is minutes.'], 'buses LCM ' + a + ', ' + b);
          p.bad = [[String(a * b), String(Math.floor(a * b / 60)), String(a * b % 60)], [String(g), '0', String(g)]];
          return p;
        } }] },
      { num: '11', section: 'Part D — Classifying and Ordering Real Numbers', stem: 'For each number, tick every set it belongs to: natural ' + t('(N)') + ', whole ' + t('(W)') + ', integer ' + t('(I)') + ', rational ' + t('(Q)') + ', irrational ' + t('(\\overline{Q})') + ' and real ' + t('(R)') + '.', outcome: 'AN2', parts: [
        { id: '11', level: 'EMG', make: function (r) {
          var k = r.int(2, 25), pq = properPair(r, [3, 6, 7, 9, 11, 12, 13]), n = r.pick(range(8, 99).filter(function (x) { return !isSq(x); })), s = r.int(4, 12), u = r.int(2, 9);
          var d1 = r.int(1, 9), blk = String(r.int(10, 98)); if (blk[0] === blk[1]) blk = blk[0] + String((Number(blk[1]) + 1) % 10);
          if (r.chance(0.1)) { k = 14; pq = [7, 11]; n = 45; s = 7; u = 5; d1 = 4; blk = '18'; }
          var items = [{ id: 'a', tex: '-' + k, cls: 'negint' }, { id: 'b', tex: '\\frac{' + pq[0] + '}{' + pq[1] + '}', cls: 'frac' }, { id: 'c', tex: '\\sqrt{' + n + '}', cls: 'irr', note: n + '\\text{ is not a perfect square}' },
            { id: 'd', tex: String(s * s), cls: 'nat' }, { id: 'e', tex: '-\\sqrt{' + u * u + '}', cls: 'negint', note: '-\\sqrt{' + u * u + '}=-' + u }, { id: 'f', tex: '0.' + d1 + '\\overline{' + blk + '}', cls: 'frac', note: '\\text{it repeats, so it is a fraction}' }];
          return setsPart('Tick every set each number belongs to.', items, 'classify six numbers');
        } }] },
      { num: '12', stem: '', outcome: 'AN2', parts: [
        { id: '12', level: 'EMG', make: function (r) {
          var items;
          for (var g = 0; g < 300; g++) {
            var k = r.int(1, 3), p = r.pick([2, 3, 5, 6, 7, 8]), s = r.int(1, 4), fq = properPair(r, [2, 3, 4, 5]), m = r.int(1, 3);
            items = [{ id: 'dec', tex: '-' + k + '.5', v: -(k + 0.5) }, { id: 'sq', tex: '\\sqrt{' + p + '}', v: Math.sqrt(p) }, { id: 'ns', tex: '-\\sqrt{' + s * s + '}', v: -s }, { id: 'fr', tex: '\\frac{' + fq[0] + '}{' + fq[1] + '}', v: fq[0] / fq[1] }, { id: 'int', tex: String(m), v: m }];
            if (r.chance(0.1)) items = [{ id: 'dec', tex: '-2.5', v: -2.5 }, { id: 'sq', tex: '\\sqrt{3}', v: Math.sqrt(3) }, { id: 'ns', tex: '-\\sqrt{9}', v: -3 }, { id: 'fr', tex: '\\frac{1}{2}', v: 0.5 }, { id: 'int', tex: '2', v: 2 }];
            var vs = items.map(function (x) { return x.v; }).sort(function (a, b) { return a - b; });
            if (vs.every(function (v, i) { return !i || v - vs[i - 1] >= 0.15; })) break;
          }
          var sorted = items.slice().sort(function (a, b) { return a.v - b.v; }), by = {}; items.forEach(function (x) { by[x.id] = x; });
          function ap(x) { return Number.isInteger(x.v) ? '' : '\\approx ' + K.roundTo(x.v, 2); }
          return P.order(r, 'Write the numbers in order from least to greatest.', sorted, { why: function (a, b) { return t(by[a].tex + (Number.isInteger(by[a].v) && /sqrt/.test(by[a].tex) ? '=' + by[a].v : ap(by[a]))) + ' and ' + t(by[b].tex + (Number.isInteger(by[b].v) && /sqrt/.test(by[b].tex) ? '=' + by[b].v : ap(by[b]))) + ' are in the wrong order. Which one is further left on a number line?'; } },
            'Write each as a decimal: ' + items.map(function (x) { return t(x.tex + (Number.isInteger(x.v) ? (/sqrt/.test(x.tex) ? '=' + x.v : '') : (/sqrt/.test(x.tex) ? '\\approx ' : '=') + K.roundTo(x.v, 2))); }).join(', ') + '.<br>' + t(sorted.map(function (x) { return x.tex; }).join('<')) + '.',
            ['Change each number to a decimal (estimate the square root between two whole numbers).', 'Negatives go first: the larger the size, the further left.'], 'order five reals');
        } }] },
      { num: '13', section: 'Part E — Perfect Squares, Perfect Cubes, and Estimating Roots', stem: 'Evaluate each root mentally.', outcome: 'AN1', parts: [
        { id: '13a', level: 'BEG', make: function (r) { var s = r.chance(0.1) ? 11 : r.int(6, 15); return P.number(t('\\sqrt{' + s * s + '}'), s, function (v) { if (v === s * s / 2) return { code: 'u1l8-root-half', hint: 'A square root is the number that multiplies by <b>itself</b> to give ' + t(s * s) + ' — not half of it.' }; return null; }, t(s + '\\times ' + s + '=' + s * s) + ', so ' + t('\\sqrt{' + s * s + '}=' + s) + '.', ['Which number times itself gives ' + t(s * s) + '?'], 'sqrt ' + s * s); } },
        { id: '13b', level: 'BEG', make: function (r) { var c = r.chance(0.1) ? 7 : r.int(2, 10); return P.number(t('\\sqrt[3]{' + F(c * c * c) + '}'), c, function (v) { if (v === c * c * c / 3) return { code: 'u1l8-root-half', hint: 'A cube root is the number used as a factor <b>three times</b> — not the number divided by 3.' }; return null; }, t(c + '\\times ' + c + '\\times ' + c + '=' + F(c * c * c)) + ', so ' + t('\\sqrt[3]{' + F(c * c * c) + '}=' + c) + '.', ['Which number, used as a factor three times, gives ' + t(F(c * c * c)) + '?'], 'cbrt ' + c * c * c); } }] },
      { num: '14', stem: '', outcome: 'AN2', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var N = r.chance(0.1) ? 55 : r.pick(range(20, 140).filter(function (x) { return !isSq(x); })), E = estimateFields(N);
          var p = P.fields('Estimate ' + t('\\sqrt{' + N + '}') + ': state the two consecutive whole numbers it lies between, state which one it is closer to, and give a one-decimal estimate.', E.fields, E.checks, E.keys, E.answer, E.sol,
            ['List the perfect squares near ' + t(N) + '.', 'Compare how far ' + t(N) + ' is from each of those perfect squares.'], 'estimate sqrt ' + N);
          p.bad = [[String(E.hi), String(E.lo), String(E.near), E.keys[3]], [String(E.lo), String(E.hi), String(E.near === E.lo ? E.hi : E.lo), E.keys[3]]];
          return p;
        } }] },
      { num: '15', stem: '', outcome: 'AN2', parts: [
        { id: '15', level: 'PRG', make: function (r) {
          var A = r.chance(0.1) ? 130 : r.pick(range(30, 400).filter(function (x) { return !isSq(x) && Math.abs(Math.sqrt(x) - Math.round(Math.sqrt(x))) < 0.42; })), x = Math.sqrt(A), w = Math.round(x);
          var p = P.fields('A square patio has an area of ' + t(A + '\\text{ ft}^{2}') + '. Estimate the side length to the nearest whole number, then <b>use a calculator</b> to find it to the nearest hundredth of a foot.',
            [{ name: 'Estimate', label: 'Estimate', before: t('s\\approx'), after: 'ft' }, { name: 'Calculator', label: 'Calculator', before: t('s\\approx'), after: 'ft' }],
            [K.number(w, function (v) { if (v === Math.floor(A / 4) || v === Math.round(A / 4)) return { code: 'perimeter', hint: 'The side of a square is the <b>square root</b> of its area, not the area divided by 4.' }; if (v === Math.round(A / 2)) return { code: 'u1l8-root-half', hint: 'The side is the square root of the area, not half of it.' }; if (v === w + 1 || v === w - 1) return { code: 'u1l8-closer', hint: 'Which perfect square is ' + t(A) + ' closer to?' }; return null; }),
              calcChk(x, 2, { diag: function (v) { if (Math.abs(v - A / 4) < 0.01) return { code: 'perimeter', hint: 'Use the square root key: the side is ' + t('\\sqrt{' + A + '}') + '.' }; return null; } })],
            [String(w), K.roundTo(x, 2).toFixed(2)], t('s\\approx ' + w) + ' ft; ' + t('s\\approx ' + K.roundTo(x, 2).toFixed(2)) + ' ft',
            'Side ' + t('=\\sqrt{' + A + '}') + '. ' + t(Math.floor(x) * Math.floor(x) + '<' + A + '<' + Math.ceil(x) * Math.ceil(x)) + ', and ' + t(A) + ' is closer to ' + t(w * w) + ', so the side is about ' + t(w) + ' ft.<br>Calculator: ' + t('\\sqrt{' + A + '}=' + x.toFixed(5) + '\\ldots\\approx ' + K.roundTo(x, 2).toFixed(2)) + ' ft.',
            ['The side of a square is the square root of its area. Which perfect square is ' + t(A) + ' closest to?', 'On the calculator: ' + t('\\sqrt{\\ }') + ', ' + t(A) + ', =, then round to two decimal places. Answers within 0.01 are accepted.'], 'patio side ' + A);
          p.bad = [[String(Math.round(A / 4)), (A / 4).toFixed(2)]];
          return p;
        } }] },
      { num: '16', section: 'Part F — Simplifying Square-Root Radicals', stem: '', outcome: 'AN2', parts: [
        { id: '16', level: 'EMG', make: function (r) { var R = r.chance(0.1) ? 98 : r.pick(pool(2, [3, 4, 5, 6, 7, 8, 9], 2, 7, 400)); var p = mixPart(1, 2, R); p.prompt = 'Convert ' + t('\\sqrt{' + R + '}') + ' to a mixed radical in simplest form.'; return p; } }] },
      { num: '17', stem: '', outcome: 'AN2', parts: [
        { id: '17', level: 'EMG', make: function (r) { var R = r.chance(0.1) ? 180 : r.pick(pool(2, [4, 6, 10, 12], 2, 7, 800).concat(pool(2, [6], 10, 14))); return factMixPart(2, R, { prompt: 'Use prime factorization to convert ' + t('\\sqrt{' + R + '}') + ' to a mixed radical in simplest form.' }); } }] },
      { num: '18', stem: '', outcome: 'AN2', parts: [
        { id: '18', level: 'EMG', make: function (r) { var c = r.int(2, 9), m = r.pick([2, 3, 5, 6, 7, 10, 11]); if (r.chance(0.1)) { c = 5; m = 6; } var p = entirePart(c, 2, m); p.prompt = 'Convert ' + t(c + '\\sqrt{' + m + '}') + ' to an entire radical.'; return p; } }] },
      { num: '19', stem: '', outcome: 'AN2', parts: [
        { id: '19', level: 'PRG', make: function (r) {
          var items;
          for (var g = 0; g < 400; g++) {
            var used = {}; items = [];
            while (items.length < 3) { var c = r.int(2, 5), m = r.pick([2, 3, 5, 6, 7, 10, 11]), N = c * c * m; if (N <= 110 && !used[N] && !items.some(function (x) { return x.c === c; })) { used[N] = 1; items.push({ c: c, m: m, N: N }); } }
            var e = r.pick(range(18, 110).filter(function (x) { return !isSq(x) && !used[x]; }));
            items.push({ c: 1, m: e, N: e });
            var Ns = items.map(function (x) { return x.N; }).sort(function (a, b) { return a - b; });
            var byC = items.slice().sort(function (a, b) { return a.c - b.c; }).map(function (x) { return x.N; }).join();
            if (Ns.every(function (v, i) { return !i || v - Ns[i - 1] >= 2; }) && byC !== Ns.join()) break;
          }
          if (r.chance(0.1)) items = [{ c: 4, m: 3, N: 48 }, { c: 2, m: 10, N: 40 }, { c: 1, m: 50, N: 50 }, { c: 3, m: 5, N: 45 }];
          items.forEach(function (x, i) { x.id = 'r' + i; x.tex = (x.c > 1 ? x.c : '') + '\\sqrt{' + x.m + '}'; });
          var sorted = items.slice().sort(function (a, b) { return a.N - b.N; }), by = {}; items.forEach(function (x) { by[x.id] = x; });
          return P.order(r, 'Without using a calculator, arrange the radicals in order from least to greatest.', sorted, { why: function (a, b) { return t(by[a].tex + (by[a].c > 1 ? '=\\sqrt{' + by[a].N + '}' : '')) + ' and ' + t(by[b].tex + (by[b].c > 1 ? '=\\sqrt{' + by[b].N + '}' : '')) + '. Compare the numbers under the roots.'; } },
            items.map(function (x) { return x.c > 1 ? t(x.tex + '=\\sqrt{' + x.c + '^{2}\\times ' + x.m + '}=\\sqrt{' + x.N + '}') : t(x.tex); }).join('<br>') + '<br>' + t(sorted.map(function (x) { return x.N; }).join('<')) + ', so ' + t(sorted.map(function (x) { return x.tex; }).join('<')) + '.',
            ['Write each one as an entire radical: square the number in front and multiply it in.', 'Then compare the numbers under the roots.'], 'order four square-root radicals');
        } }] },
      { num: '20', section: 'Part G — Simplifying Higher-Index Radicals', stem: 'State whether each radical is entire or mixed.', outcome: 'AN2', parts: [
        { id: '20a', level: 'BEG', make: function (r) { var m = r.chance(0.1) ? 12 : r.pick(range(2, 60).filter(function (x) { return pw(Math.round(Math.cbrt(x)), 3) !== x; })); return emPart(r, '\\sqrt[3]{' + m + '}', true); } },
        { id: '20b', level: 'BEG', make: function (r) { var c = r.int(2, 7), m = r.pick(free(3, 2, 15)); if (r.chance(0.1)) { c = 3; m = 5; } return emPart(r, c + '\\sqrt[3]{' + m + '}', false); } }] },
      { num: '21', stem: '', outcome: 'AN2', parts: [
        { id: '21', level: 'EMG', make: function (r) { var R = r.chance(0.1) ? 250 : r.pick(pool(3, [2, 3, 4, 5], 2, 7, 900)); var p = mixPart(1, 3, R); p.prompt = 'Convert ' + t('\\sqrt[3]{' + R + '}') + ' to a mixed radical in simplest form.'; return p; } }] },
      { num: '22', stem: '', outcome: 'AN2', parts: [
        { id: '22', level: 'EMG', make: function (r) { var c = r.int(2, 5), m = r.pick(free(3, 2, 13)); if (r.chance(0.1)) { c = 2; m = 7; } var p = entirePart(c, 3, m); p.prompt = 'Convert ' + t(c + '\\sqrt[3]{' + m + '}') + ' to an entire radical.'; return p; } }] },
      { num: '23', stem: '', outcome: 'AN2', parts: [
        { id: '23', level: 'PRG', make: function (r) { var R = r.chance(0.1) ? 48 : r.pick(pool(4, [2], 2, 22).concat(pool(4, [3], 2, 6))); var p = mixPart(1, 4, R); p.prompt = 'Convert ' + t('\\sqrt[4]{' + R + '}') + ' to a mixed radical in simplest form.'; return p; } }] },
      { num: '24', section: 'Part H — Mixed Challenge', stem: function (sh) { return 'Simplify ' + t('\\sqrt{' + sh.R + '}') + ' to a mixed radical. Then state whether the simplified value is rational or irrational, and explain how you know.'; }, outcome: 'AN2',
        shared: function (r) { return { R: r.chance(0.12) ? 288 : r.pick(pool(2, [6, 7, 8, 9, 10, 11, 12], 2, 7, 900)) }; },
        parts: [
          { id: '24a', level: 'PRG', make: function (r, sh) { var p = mixPart(1, 2, sh.R); p.prompt = 'Simplify ' + t('\\sqrt{' + sh.R + '}') + ' to a mixed radical in simplest form.'; return p; } },
          { id: '24b', level: 'EMG', make: function (r, sh) {
            var f = ex.nthFactor(sh.R, 2), m = sh.R / (f * f), mx = f + '\\sqrt{' + m + '}';
            return P.mc(r, 'Is the simplified value rational or irrational?', ratMC(r, '\\sqrt{' + sh.R + '}', mx, false),
              t('\\sqrt{' + sh.R + '}=' + mx) + '. ' + t(m) + ' is not a perfect square, so ' + t('\\sqrt{' + m + '}') + ' is irrational (its decimal never ends or repeats), and a whole number times it is still irrational.', ['Is the number left under the root a perfect square?'], 'rational? sqrt ' + sh.R);
          } }] },
      { num: '25', stem: function (sh) { return 'A community garden measuring ' + t(sh.a + '\\text{ m}') + ' by ' + t(sh.b + '\\text{ m}') + ' will be divided into the largest possible identical square plots, with no leftover strip along either side.'; }, outcome: 'AN1',
        shared: function (r) {
          if (r.chance(0.12)) return { a: 84, b: 126, g: 42 };
          var o = []; [12, 14, 15, 16, 18, 20, 21, 24, 25, 28, 30, 35, 36, 40, 42, 45].forEach(function (g) { [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [1, 3], [1, 4]].forEach(function (xy) { if (g * xy[1] <= 200) o.push({ a: g * xy[0], b: g * xy[1], g: g }); }); });
          return r.pick(o);
        },
        parts: [
          { id: '25a', level: 'PRG', make: function (r, sh) {
            var p = P.number('Use the GCF of ' + t(sh.a) + ' and ' + t(sh.b) + ' to find the side length of each square plot.', sh.g, gcfDiag([sh.a, sh.b]), 'The side must divide evenly into both ' + t(sh.a) + ' and ' + t(sh.b) + ', and be as large as possible: the GCF.<br>' + gcfSol([sh.a, sh.b]) + ' So each plot is ' + t(sh.g) + ' m on a side.',
              ['The side length has to fit evenly into both lengths: a common <b>factor</b>.', 'Write both numbers as products of primes.'], 'garden GCF ' + sh.a + ',' + sh.b, { after: 'm' });
            return p;
          } },
          { id: '25b', level: 'PRG', make: function (r, sh) {
            var x = sh.a / sh.g, y = sh.b / sh.g, n = x * y;
            return P.number('How many square plots will there be in total?', n, function (v) {
              if (v === sh.a * sh.b / sh.g) return { code: 'area-by-side', hint: 'You divided the area by the plot’s <b>side length</b>. Divide by the plot’s <b>area</b> — or count plots along each side and multiply.' };
              if (v === x + y) return { code: 'added', hint: 'You found the plots along each side. The garden is a grid of plots, so <b>multiply</b> them.' };
              if (v === sh.g) return { code: 'u1l8-whole-plot', hint: 'That’s the side length of one plot. How many plots fit along each side?' };
              return null;
            }, t(sh.a + '\\div ' + sh.g + '=' + x) + ' plots along one side and ' + t(sh.b + '\\div ' + sh.g + '=' + y) + ' along the other, so ' + t(x + '\\times ' + y + '=' + n) + ' plots.', ['How many plots fit along each side of the garden?'], 'plots ' + sh.a + 'x' + sh.b, { after: 'plots' });
          } }] }
    ],

    extra: [
      { num: '1', section: 'Extra practice A — Multi-Step Evaluation', stem: 'Evaluate each expression. Watch the order of operations, and remember that ' + t('-n^{2}\\neq(-n)^{2}') + '.', outcome: 'REV', parts: [
        { id: 'e1a', level: 'PRG', make: function (r) {
          var s = r.int(2, 9), pq = properPair(r, [2, 3, 4, 5]), k = r.int(1, 3), a = r.int(1, 3); if (r.chance(0.1)) { s = 4; pq = [2, 3]; k = 3; a = 2; }
          var M = pq[1] * k, ans = s + pq[0] * k + a * a * a;
          return intPart('\\sqrt{' + s * s + '}+\\frac{' + pq[0] + '}{' + pq[1] + '}\\times ' + M + '-(-' + a + ')^{3}', ans, function (v) { if (v === s + pq[0] * k - a * a * a) return { code: 'sign', hint: t('(-' + a + ')^{3}=-' + a * a * a) + ', and subtracting a negative is adding.' }; if (ex.eq(v, (s + pq[0] / pq[1]) * M + a * a * a)) return { code: 'u1l8-left-right', hint: 'Multiply before you add: ' + t('\\frac{' + pq[0] + '}{' + pq[1] + '}\\times ' + M) + ' first.' }; return null; },
            t('\\sqrt{' + s * s + '}=' + s) + ', ' + t('\\frac{' + pq[0] + '}{' + pq[1] + '}\\times ' + M + '=' + pq[0] * k) + ', ' + t('(-' + a + ')^{3}=-' + a * a * a) + '.<br>' + t(s + '+' + pq[0] * k + '-(-' + a * a * a + ')=' + ans) + '.', ['Work out the root, the power and the product first.', 'Subtracting a negative is adding.']);
        } },
        { id: 'e1b', level: 'EMG', make: function (r) {
          var a = r.int(2, 5), s = r.int(3, 9), b = r.int(2, 4); if (r.chance(0.1)) { a = 3; s = 7; b = 2; } var ans = a * a - s * b;
          return intPart('(-' + a + ')^{2}-\\sqrt{' + s * s + '}\\times ' + b, ans, function (v) { if (v === (a * a - s) * b) return { code: 'u1l8-left-right', hint: 'Multiply before you subtract.' }; if (v === -a * a - s * b) return { code: 'u1l8-neg-square', hint: 'The brackets make the base negative: ' + t('(-' + a + ')^{2}=+' + a * a) + '.' }; return null; },
            t('(-' + a + ')^{2}=' + a * a) + ', ' + t('\\sqrt{' + s * s + '}\\times ' + b + '=' + s + '\\times ' + b + '=' + s * b) + '. So ' + t(a * a + '-' + s * b + '=' + ans) + '.', ['Powers and roots first, then multiply, then subtract.']);
        } },
        { id: 'e1c', level: 'EMG', make: function (r) {
          var c = r.int(2, 5), d = r.int(2, 6), e = r.int(2, 6); if (r.chance(0.1)) { c = 4; d = 5; e = 3; } var ans = -c + d * e;
          return intPart('\\sqrt[3]{-' + c * c * c + '}+(-' + d + ')(-' + e + ')', ans, function (v) { if (v === c + d * e) return { code: 'neg-root', hint: 'An odd root of a negative is negative: ' + t('\\sqrt[3]{-' + c * c * c + '}=-' + c) + '.' }; if (v === -c - d * e) return { code: 'sign', hint: t('(-' + d + ')(-' + e + ')') + ': like signs multiply to a positive.' }; return null; },
            t('\\sqrt[3]{-' + c * c * c + '}=-' + c) + ' and ' + t('(-' + d + ')(-' + e + ')=' + d * e) + ', so ' + t('-' + c + '+' + d * e + '=' + ans) + '.', ['What number cubed gives ' + t('-' + c * c * c) + '?']);
        } },
        { id: 'e1d', level: 'EMG', make: function (r) {
          var a = r.int(2, 6), b = r.int(2, 4), q = r.int(2, 4), s = b * q; if (r.chance(0.1)) { a = 4; b = 3; s = 9; q = 3; } var ans = -a * a - q;
          return intPart('-' + a + '^{2}+\\sqrt{' + s * s + '}\\div(-' + b + ')', ans, function (v) { if (v === a * a - q) return { code: 'u1l8-neg-square', hint: 'No brackets: ' + t('-' + a + '^{2}=-' + a * a) + '.' }; if (v === -a * a + q) return { code: 'sign', hint: t(s + '\\div(-' + b + ')') + ' is negative.' }; return null; },
            t('-' + a + '^{2}=-' + a * a) + ', ' + t('\\sqrt{' + s * s + '}\\div(-' + b + ')=' + s + '\\div(-' + b + ')=-' + q) + '. So ' + t('-' + a * a + '+(-' + q + ')=' + ans) + '.', ['Without brackets, the exponent doesn’t touch the minus sign.']);
        } }] },
      { num: '2', stem: 'Evaluate each expression. Give every answer as an exact fraction or whole number.', outcome: 'REV', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) {
          var A, B, tt, T;
          for (var g = 0; g < 100; g++) { A = properPair(r, [2, 3, 4, 5, 8]); B = properPair(r, [2, 3, 4, 6]); tt = B[1] * r.int(1, 3); if (tt >= 4 && tt <= 12) break; }
          if (r.chance(0.1)) { A = [3, 4]; B = [1, 6]; tt = 6; }
          var mid = B[0] * tt / B[1]; T = ex.norm(A[0] + mid * A[1], A[1]);
          return fracPart(t('\\frac{' + A[0] + '}{' + A[1] + '}+\\frac{' + B[0] + '}{' + B[1] + '}\\times\\sqrt{' + tt * tt + '}'), T, function (v) { var lr = (A[0] / A[1] + B[0] / B[1]) * tt; if (ex.eq(v, lr)) return { code: 'u1l8-left-right', hint: 'Multiply before you add.' }; return null; },
            t('\\sqrt{' + tt * tt + '}=' + tt) + ', ' + t('\\frac{' + B[0] + '}{' + B[1] + '}\\times ' + tt + '=' + mid) + '. ' + t('\\frac{' + A[0] + '}{' + A[1] + '}+' + mid + '=' + frT(T)) + '.', ['Root first, then multiply, then add.'], 'fraction + product');
        } },
        { id: 'e2b', level: 'PRG', make: function (r) {
          var A, B, D, N, T;
          for (var g = 0; g < 200; g++) { A = properPair(r, [2, 3, 4, 5, 6]); B = properPair(r, [2, 3, 4, 6, 8]); D = lcm(A[1], B[1]); N = D * r.int(1, 2); if (A[0] / A[1] > B[0] / B[1] && N <= 15 && A[1] !== B[1]) break; }
          if (r.chance(0.1)) { A = [2, 3]; B = [1, 4]; N = 12; }
          T = ex.norm((A[0] * B[1] - B[0] * A[1]) * N, A[1] * B[1]);
          return fracPart(t('\\left(\\frac{' + A[0] + '}{' + A[1] + '}-\\frac{' + B[0] + '}{' + B[1] + '}\\right)\\times\\sqrt{' + N * N + '}'), T, function (v) { if (ex.eq(v, A[0] / A[1] - B[0] / B[1] * N)) return { code: 'u1l8-left-right', hint: 'The brackets come first: subtract inside them, then multiply.' }; return null; },
            'Brackets: ' + t('\\frac{' + A[0] + '}{' + A[1] + '}-\\frac{' + B[0] + '}{' + B[1] + '}=' + fr(A[0] * B[1] - B[0] * A[1], A[1] * B[1])) + '. ' + t('\\sqrt{' + N * N + '}=' + N) + '. ' + t(fr(A[0] * B[1] - B[0] * A[1], A[1] * B[1]) + '\\times ' + N + '=' + frT(T)) + '.', ['Brackets first.'], 'bracket fraction times root');
        } },
        { id: 'e2c', level: 'PRG', make: function (r) {
          var pq = properPair(r, [3, 4, 5, 6]), s = pq[1] * r.int(1, 2), u = r.pick([2, 2, 3]); if (r.chance(0.1)) { pq = [3, 5]; s = 5; u = 2; }
          var mid = s * pq[0] / pq[1], T = ex.norm(mid * u * u - 1, u * u);
          return fracPart(t('\\sqrt{' + s * s + '}\\times\\frac{' + pq[0] + '}{' + pq[1] + '}-\\left(\\frac{1}{' + u + '}\\right)^{2}'), T, function (v) { if (ex.eq(v, mid - 1 / u)) return { code: 'u1l8-pow-frac', hint: t('\\left(\\frac{1}{' + u + '}\\right)^{2}=\\frac{1}{' + u + '}\\times\\frac{1}{' + u + '}=\\frac{1}{' + u * u + '}') + '.' }; if (ex.eq(v, mid - 2 / u)) return { code: 'u1l8-times-2', hint: 'Squaring means multiplying by itself, not by 2.' }; return null; },
            t('\\sqrt{' + s * s + '}=' + s) + ', ' + t(s + '\\times\\frac{' + pq[0] + '}{' + pq[1] + '}=' + mid) + ', ' + t('\\left(\\frac{1}{' + u + '}\\right)^{2}=\\frac{1}{' + u * u + '}') + '. ' + t(mid + '-\\frac{1}{' + u * u + '}=' + frT(T)) + '.', ['Square both the top and the bottom of the fraction.'], 'root times fraction minus square');
        } }] },
      { num: '3', stem: 'Each sum needs a three-way common denominator. Use the <b>LCM</b> of the three denominators as the LCD, state it, then evaluate. Give each answer in lowest terms.', outcome: 'AN1', parts: [0, 1, 2].map(function (i) {
        return { id: 'e3' + 'abc'[i], level: 'PRG', make: function (r) {
          var dens, nums, signs, D, sum;
          var book = [[[1, 6], [3, 8], [5, 12], [1, 1]], [[5, 9], [1, 6], [2, 15], [-1, 1]], [[7, 10], [2, 15], [1, 4], [1, -1]]][i];
          for (var g = 0; g < 400; g++) {
            dens = r.sample([2, 3, 4, 5, 6, 8, 9, 10, 12, 15], 3); D = lcmA(dens);
            if (D > 60 || D === prodOf(dens) || dens.some(function (d) { return D === d; })) continue;
            nums = dens.map(function (d) { var ps = range(1, d - 1).filter(function (p) { return gcd(p, d) === 1; }); return r.pick(ps); });
            signs = i === 0 ? [1, 1] : i === 1 ? [-1, 1] : [1, -1];
            sum = nums[0] * D / dens[0] + signs[0] * nums[1] * D / dens[1] + signs[1] * nums[2] * D / dens[2];
            if (sum > 0) break;
          }
          if (r.chance(0.1)) { dens = [book[0][1], book[1][1], book[2][1]]; nums = [book[0][0], book[1][0], book[2][0]]; signs = book[3]; D = lcmA(dens); sum = nums[0] * D / dens[0] + signs[0] * nums[1] * D / dens[1] + signs[1] * nums[2] * D / dens[2]; }
          var T = ex.norm(sum, D), sg = function (s) { return s > 0 ? '+' : '-'; };
          var expr = '\\frac{' + nums[0] + '}{' + dens[0] + '}' + sg(signs[0]) + '\\frac{' + nums[1] + '}{' + dens[1] + '}' + sg(signs[1]) + '\\frac{' + nums[2] + '}{' + dens[2] + '}';
          var conv = nums.map(function (n, j) { return '\\frac{' + n * D / dens[j] + '}{' + D + '}'; });
          var p = P.fields(t(expr), [{ name: 'LCD', label: 'LCD', before: t('\\text{LCD}=') }, { name: 'Answer', label: 'Answer', before: t('='), mode: 'math', keys: 'fraction' }],
            [K.number(D, function (v) { if (v === prodOf(dens)) return { code: 'lcm-not-least', hint: t(F(v)) + ' is <i>a</i> common denominator, but not the <b>lowest</b>. Find the LCM of ' + t(dens.join(',\\ ')) + '.' }; return lcmDiag(dens)(v); }),
              K.fraction(T, { diag: function (v) { if (ex.eq(v, (nums[0] + signs[0] * nums[1] + signs[1] * nums[2]) / (dens[0] + dens[1] + dens[2]))) return { code: 'u1l8-add-across', hint: 'Don’t add the denominators. Rewrite each fraction over ' + t(D) + ' first.' }; return null; } })],
            [String(D), frT(T)], 'LCD ' + t('=' + D) + '; ' + t(expr + '=' + frT(T)),
            facLines(dens) + ', so LCD ' + t('=' + eqv(D)) + '.<br>' + t(expr + '=' + conv[0] + sg(signs[0]) + conv[1] + sg(signs[1]) + conv[2] + '=\\frac{' + sum + '}{' + D + '}' + (T[1] !== D ? '=' + frT(T) : '')) + '.',
            ['The LCD is the LCM of the denominators: every prime that appears, at its highest power.', 'Rewrite each fraction over the LCD, combine the numerators, then reduce.'], 'three fractions LCD');
          p.bad = [[String(prodOf(dens)), frT(T)], [String(D), '\\frac{' + (T[0] + 1) + '}{' + T[1] + '}']];
          return p;
        } };
      }) },
      { num: '4', stem: 'Reduce each fraction to lowest terms in <i>one</i> step by first finding the <b>GCF</b> of the numerator and denominator from their prime factorizations.', outcome: 'AN1', parts: [0, 1].map(function (i) {
        return { id: 'e4' + 'ab'[i], level: 'PRG', make: function (r) {
          var o = []; [24, 28, 30, 36, 40, 42, 45, 48, 54, 56, 60, 63, 72, 84, 90].forEach(function (g) { [[2, 5], [3, 5], [2, 7], [3, 7], [5, 14], [4, 9], [5, 9], [3, 8], [5, 8], [2, 3], [3, 4], [4, 5]].forEach(function (xy) { if (g * xy[1] <= 800 && g * xy[1] >= 150) o.push([g * xy[0], g * xy[1]]); }); });
          var ab = pickB(r, o, i ? [270, 756] : [168, 420]), a = ab[0], b = ab[1], g = gcd(a, b), T = [a / g, b / g];
          var p = P.fields(t('\\frac{' + a + '}{' + b + '}'), [{ name: 'GCF', label: 'GCF', before: t('\\text{GCF}=') }, { name: 'Lowest terms', label: 'Lowest terms', before: t('\\frac{' + a + '}{' + b + '}='), mode: 'math', keys: 'fraction' }],
            [K.number(g, gcfDiag([a, b])), K.fraction(T)], [String(g), frT(T)], 'GCF ' + t('=' + g) + '; ' + t('\\frac{' + a + '}{' + b + '}=' + frT(T)),
            gcfSol([a, b]) + '<br>Divide top and bottom by ' + t(g) + ': ' + t('\\frac{' + a + '\\div ' + g + '}{' + b + '\\div ' + g + '}=' + frT(T)) + '.',
            ['Write ' + t(a) + ' and ' + t(b) + ' as products of primes. The GCF uses the shared primes at their lowest powers.', 'Dividing the top and bottom by the GCF reduces the fraction in one step.'], 'reduce by GCF ' + a + '/' + b);
          p.bad = [[String(g / 2), frT(T)]].filter(function (x) { return g % 2 === 0; });
          return p;
        } };
      }) },
      { num: '5', section: 'Extra practice B — Combining Skills', stem: 'These radicands are too large to factor by inspection. Write the prime factorization of each radicand first, then simplify to a mixed radical in simplest form.', outcome: 'AN2', parts: [
        { id: 'e5a', level: 'PRG', make: function (r) { return factMixPart(2, r.chance(0.12) ? 1512 : r.pick(pool(2, [6, 10, 12, 14], 6, 42, 3000).filter(function (R) { var m = R / pw(ex.nthFactor(R, 2), 2); return m > 5 && !nt.isPrime(m); }))); } },
        { id: 'e5b', level: 'PRG', make: function (r) { return factMixPart(2, r.chance(0.12) ? 2352 : r.pick(pool(2, [12, 14, 15, 18, 20, 21, 24, 28], 2, 7, 3200))); } },
        { id: 'e5c', level: 'PRG', make: function (r) { return factMixPart(3, r.chance(0.12) ? 1080 : r.pick(pool(3, [4, 5, 6, 10], 2, 9, 2200))); } },
        { id: 'e5d', level: 'PRG', make: function (r) { return factMixPart(4, r.chance(0.12) ? 1250 : r.pick(pool(4, [2, 3, 5], 2, 15, 4000).filter(function (R) { return R >= 150; }))); } }] },
      { num: '6', stem: 'Work backwards from a prime factorization. In each case, state the number, decide whether it is a perfect square or a perfect cube, and then give the exact root asked for.', outcome: 'AN1', parts: [
        { id: 'e6a', level: 'PRG', make: function (r) {
          var o = []; [[2, 3], [2, 5], [3, 5], [2, 7]].forEach(function (pq) { [2, 4, 6].forEach(function (a) { [2, 4].forEach(function (b) { var N = pw(pq[0], a) * pw(pq[1], b); if (N <= 3600) o.push([pq[0], a, pq[1], b]); }); }); });
          var f = pickB(r, o, [2, 4, 3, 2]), N = pw(f[0], f[1]) * pw(f[2], f[3]), root = Math.sqrt(N), ft = f[0] + '^{' + f[1] + '}\\times ' + f[2] + '^{' + f[3] + '}';
          var p = P.fields('A number’s prime factorization is ' + t(ft) + '. Is it a perfect square? Give its square root.', [{ name: 'Number', label: 'Number', before: t('N=') }, { name: 'Perfect square?', label: 'Perfect square?', mode: 'text', placeholder: 'yes/no', wide: true }, { name: 'Square root', label: 'Square root', before: t('\\sqrt{N}=') }],
            [K.number(N, function (v) { if (v === f[0] * f[1] * f[2] * f[3] || v === f[0] * f[1] + f[2] * f[3]) return { code: 'value', hint: 'An exponent means repeated multiplication: ' + t(f[0] + '^{' + f[1] + '}=' + pw(f[0], f[1])) + '.' }; return null; }),
              yesNoChk(true, '', 'Every exponent is even, so the primes split into two equal groups — it <b>is</b> a perfect square.'),
              K.number(root, function (v) { if (v === N / 2) return { code: 'u1l8-root-half', hint: 'Halve the <b>exponents</b>, not the number: ' + t('\\sqrt{N}=' + f[0] + '^{' + f[1] / 2 + '}\\times ' + f[2] + '^{' + f[3] / 2 + '}') + '.' }; return null; })],
            [String(N), 'yes', String(root)], t('N=' + F(N)) + '; yes; ' + t('\\sqrt{N}=' + root),
            t('N=' + ft + '=' + pw(f[0], f[1]) + '\\times ' + pw(f[2], f[3]) + '=' + F(N)) + '. Both exponents are even, so ' + t('N') + ' is a perfect square.<br>Halve each exponent: ' + t('\\sqrt{N}=' + f[0] + '^{' + f[1] / 2 + '}\\times ' + f[2] + '^{' + f[3] / 2 + '}=' + root) + '.',
            ['A perfect square has an <b>even</b> exponent on every prime.', 'The square root halves each exponent.'], 'perfect square from primes');
          p.bad = [[String(N), 'no', String(root)], [String(N), 'yes', String(N / 2)]];
          return p;
        } },
        { id: 'e6b', level: 'PRG', make: function (r) {
          var o = [[2, 3, 5, 3], [2, 3, 3, 3], [2, 6, 3, 3], [3, 3, 5, 3], [2, 3, 7, 3], [2, 6, 5, 3], [3, 6, 2, 3], [2, 9, 3, 3], [5, 3, 2, 6], [2, 3, 11, 3]];
          var f = pickB(r, o, [2, 3, 5, 3]), N = pw(f[0], f[1]) * pw(f[2], f[3]), root = Math.round(Math.cbrt(N)), ft = f[0] + '^{' + f[1] + '}\\times ' + f[2] + '^{' + f[3] + '}';
          var p = P.fields('A number’s prime factorization is ' + t(ft) + '. Is it a perfect cube? Give its cube root.', [{ name: 'Number', label: 'Number', before: t('N=') }, { name: 'Perfect cube?', label: 'Perfect cube?', mode: 'text', placeholder: 'yes/no', wide: true }, { name: 'Cube root', label: 'Cube root', before: t('\\sqrt[3]{N}=') }],
            [K.number(N), yesNoChk(true, '', 'Every exponent is a multiple of 3, so the primes split into three equal groups — it <b>is</b> a perfect cube.'),
              K.number(root, function (v) { if (v === N / 3) return { code: 'u1l8-root-half', hint: 'Divide the <b>exponents</b> by 3, not the number.' }; if (v === Math.round(Math.sqrt(N))) return { code: 'square-root', hint: 'That’s the square root. For the cube root, divide each exponent by 3.' }; return null; })],
            [String(N), 'yes', String(root)], t('N=' + F(N)) + '; yes; ' + t('\\sqrt[3]{N}=' + root),
            t('N=' + ft + '=' + F(N)) + '. Every exponent is a multiple of ' + t(3) + ', so ' + t('N') + ' is a perfect cube.<br>Divide each exponent by ' + t(3) + ': ' + t('\\sqrt[3]{N}=' + f[0] + (f[1] / 3 > 1 ? '^{' + f[1] / 3 + '}' : '') + '\\times ' + f[2] + (f[3] / 3 > 1 ? '^{' + f[3] / 3 + '}' : '') + '=' + root) + '.',
            ['A perfect cube has an exponent that is a multiple of 3 on every prime.', 'The cube root divides each exponent by 3.'], 'perfect cube from primes');
          p.bad = [[String(N), 'no', String(root)]];
          return p;
        } },
        { id: 'e6c', level: 'PRG', outcome: 'AN2', make: function (r) {
          var o = [[2, 3, 3, 4], [2, 3, 3, 2], [2, 5, 3, 2], [2, 2, 3, 3], [2, 4, 3, 3], [2, 2, 5, 3], [2, 3, 5, 2], [2, 5, 5, 2], [3, 3, 5, 2], [2, 4, 5, 3], [2, 1, 3, 4], [2, 3, 7, 2], [3, 2, 2, 5]];
          var f = pickB(r, o, [2, 3, 3, 4]), N = pw(f[0], f[1]) * pw(f[2], f[3]), mp = mixPart(1, 2, N), ft = f[0] + (f[1] > 1 ? '^{' + f[1] + '}' : '') + '\\times ' + f[2] + '^{' + f[3] + '}';
          var odd = f[1] % 2 ? f[0] : f[2];
          var p = P.fields('A number’s prime factorization is ' + t(ft) + '. Is it a perfect square? Simplify its square root anyway.', [{ name: 'Number', label: 'Number', before: t('N=') }, { name: 'Perfect square?', label: 'Perfect square?', mode: 'text', placeholder: 'yes/no', wide: true }, { name: 'Square root', label: 'Square root', before: t('\\sqrt{N}='), mode: 'math', keys: 'radical' }],
            [K.number(N), yesNoChk(false, 'Look at the exponent on ' + t(odd) + ': it is odd, so the ' + t(odd) + 's can’t split into two equal groups. It is <b>not</b> a perfect square.', ''), mp.check],
            [String(N), 'no', mp.key], t('N=' + F(N)) + '; no; ' + t('\\sqrt{N}=' + mp.key),
            t('N=' + ft + '=' + F(N)) + '. The exponent on ' + t(odd) + ' is odd, so ' + t('N') + ' is <b>not</b> a perfect square.<br>Every pair of equal primes comes out as one copy: ' + mp.solution,
            ['A perfect square needs an <b>even</b> exponent on every prime.', 'For the root: each pair of equal primes comes out as one copy; a leftover prime stays inside.'], 'not a square from primes');
          p.bad = [[String(N), 'yes', mp.key]];
          return p;
        } }] },
      { num: '7', stem: function (sh) { return 'Simplify each expression to its exact value first. Then state whether the <i>result</i> is rational or irrational by ticking every set it belongs to.'; }, outcome: 'AN2',
        shared: function (r) {
          var a = r.pick([2, 3, 5]), k = r.int(2, 4), m = r.pick([2, 3, 5, 6, 7]), j = r.int(2, 5), c = r.int(2, 5), cm = r.pick([2, 3, 5, 6, 7]), d = r.int(2, 4), pq = properPair(r, [3, 4, 5, 6]);
          if (r.chance(0.12)) { a = 2; k = 3; m = 3; j = 2; c = 2; cm = 2; d = 2; pq = [3, 4]; }
          var swap = r.chance(0.5);
          return { A: { tex: swap ? '\\sqrt{' + a + '}\\times\\sqrt{' + a * k * k + '}' : '\\sqrt{' + a * k * k + '}\\times\\sqrt{' + a + '}', v: a * k, cls: 'nat' },
            B: { tex: '\\frac{\\sqrt{' + m * j * j + '}}{\\sqrt{' + m + '}}', v: j, cls: 'nat' },
            C: { tex: '\\sqrt{' + c * c * cm + '}+\\sqrt{' + cm + '}', k: c + 1, m: cm, cls: 'irr', c: c },
            D: { tex: '\\sqrt[3]{-' + d * d * d + '}\\times\\frac{' + pq[0] + '}{' + pq[1] + '}', T: ex.norm(-d * pq[0], pq[1]), cls: null, d: d, pq: pq }, a: a, k: k, m: m, j: j };
        },
        parts: [
          { id: 'e7a', level: 'EMG', make: function (r, sh) { var A = sh.A; return P.number(t(A.tex) + ' = ?', A.v, function (v) { if (v === A.v * A.v) return { code: 'u1l8-not-root', hint: 'Multiply under one root: ' + t('\\sqrt{' + A.v * A.v + '}') + ' — then take the square root.' }; return null; }, t(A.tex + '=\\sqrt{' + sh.a + '\\times ' + sh.a * sh.k * sh.k + '}=\\sqrt{' + A.v * A.v + '}=' + A.v) + '.', ['Multiply the two numbers under one square root: ' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + '.'], 'sqrt product'); } },
          { id: 'e7b', level: 'EMG', make: function (r, sh) { var B = sh.B; return P.number(t(B.tex) + ' = ?', B.v, function (v) { if (v === B.v * B.v) return { code: 'u1l8-not-root', hint: 'Divide under one root: ' + t('\\sqrt{' + B.v * B.v + '}') + ' — then take the square root.' }; return null; }, t(B.tex + '=\\sqrt{\\frac{' + sh.m * sh.j * sh.j + '}{' + sh.m + '}}=\\sqrt{' + sh.j * sh.j + '}=' + sh.j) + '.', ['Divide the two numbers under one square root: ' + t('\\frac{\\sqrt{a}}{\\sqrt{b}}=\\sqrt{\\frac{a}{b}}') + '.'], 'sqrt quotient'); } },
          { id: 'e7c', level: 'PRG', make: function (r, sh) {
            var C = sh.C, key = C.k + '\\sqrt{' + C.m + '}';
            var p = P.math(t(C.tex) + ' = ?', K.radical({ k: C.k, n: 2, m: C.m }, 'mixed', { diag: function (val, rr) { if (rr && rr.n === 2 && rr.m === C.c * C.c * C.m + C.m) return { code: 'u1l8-radicand-sum', hint: 'Radicands can’t be added: ' + t('\\sqrt{a}+\\sqrt{b}\\neq\\sqrt{a+b}') + '. Simplify ' + t('\\sqrt{' + C.c * C.c * C.m + '}') + ' first.' }; if (rr && rr.n === 2 && rr.m === C.m && Math.abs(rq(rr.k)) === C.c) return { code: 'coef-lost', hint: 'You simplified the first root to ' + t(C.c + '\\sqrt{' + C.m + '}') + '. Now add the ' + t('\\sqrt{' + C.m + '}') + ' (one more of them).' }; return null; } }), key,
              t('\\sqrt{' + C.c * C.c * C.m + '}=\\sqrt{' + C.c * C.c + '}\\times\\sqrt{' + C.m + '}=' + C.c + '\\sqrt{' + C.m + '}') + '. These are like radicals: ' + t(C.c + '\\sqrt{' + C.m + '}+1\\sqrt{' + C.m + '}=' + key) + '.',
              ['Simplify ' + t('\\sqrt{' + C.c * C.c * C.m + '}') + ' first.', 'Then ' + t('\\sqrt{' + C.m + '}') + 's add like ' + t('x') + 's: ' + t('2x+x=3x') + '.'], 'add like radicals', { keys: 'radical' });
            p.bad = ['\\sqrt{' + (C.c * C.c * C.m + C.m) + '}'];
            return p;
          } },
          { id: 'e7d', level: 'EMG', make: function (r, sh) { var D = sh.D; return fracPart(t(D.tex) + ' = ?', D.T, function (v) { if (ex.eq(v, D.d * D.pq[0] / D.pq[1])) return { code: 'neg-root', hint: 'An odd root of a negative is negative: ' + t('\\sqrt[3]{-' + D.d * D.d * D.d + '}=-' + D.d) + '.' }; return null; }, t('\\sqrt[3]{-' + D.d * D.d * D.d + '}=-' + D.d) + ', so ' + t(D.tex + '=-' + D.d + '\\times\\frac{' + D.pq[0] + '}{' + D.pq[1] + '}=' + frT(D.T)) + '.', ['What number cubed gives ' + t('-' + D.d * D.d * D.d) + '?'], 'cbrt times fraction'); } },
          { id: 'e7e', level: 'EMG', make: function (r, sh) {
            var Dc = sh.D.T[1] === 1 ? 'negint' : 'frac';
            var items = [{ id: 'a', tex: sh.A.tex, cls: 'nat', note: '=' + sh.A.v, label: 'a' }, { id: 'b', tex: sh.B.tex, cls: 'nat', note: '=' + sh.B.v, label: 'b' }, { id: 'c', tex: sh.C.tex, cls: 'irr', note: '=' + sh.C.k + '\\sqrt{' + sh.C.m + '}', label: 'c' }, { id: 'd', tex: sh.D.tex, cls: Dc, note: '=' + frT(sh.D.T), label: 'd' }];
            items.forEach(function (x) { x.note = x.tex + x.note; });
            return setsPart('Tick every set that each <b>result</b> belongs to.', items, 'classify results');
          } }] },
      { num: '8', stem: '<b>Estimate, then give the exact form.</b> For each root: state the two consecutive whole numbers it lies between, which one it is closer to, a one-decimal estimate, and then the root exactly as a mixed radical in simplest form.', outcome: 'AN2', parts: [0, 1, 2].map(function (i) {
        return { id: 'e8' + 'abc'[i], level: 'PRG', make: function (r) {
          var opts = [pool(2, [2, 3], 3, 25, 100), pool(2, [3, 4, 5], 2, 10, 200), pool(2, [4, 5, 6, 7, 10], 2, 7, 260)][i].filter(function (N) { return N >= 20 && !isSq(N); });
          var N = r.chance(0.12) ? [90, 147, 200][i] : r.pick(opts), E = estimateFields(N, true);
          var p = P.fields(t('\\sqrt{' + N + '}'), E.fields, E.checks, E.keys, E.answer, E.sol, ['List the perfect squares on either side of ' + t(N) + '.', 'For the exact form, find the largest perfect square that divides ' + t(N) + '.'], 'estimate + exact sqrt ' + N);
          p.bad = [[E.keys[0], E.keys[1], E.keys[2], E.keys[3], '\\sqrt{' + N + '}']];
          return p;
        } };
      }) },
      { num: '9', stem: '', outcome: 'AN2', parts: [
        { id: 'e9', level: 'ADV', make: function (r) {
          var items;
          for (var g = 0; g < 500; g++) {
            var a = r.pick([2, 3]), b = r.pick([2, 3, 5, 6, 7]), v = a * Math.sqrt(b);
            if (v < 2.6 || v > 6.4) continue;
            var d = Math.floor(v * 10) / 10, e = (Math.floor(2 * v) + 1) / 2;
            if (Math.abs(d - v) < 0.02 || e - v < 0.02 || e === d || Number.isInteger(e)) continue;
            var cn = r.pick([2, 3]), nf = r.pick([3, 5, 7].filter(function (x) { return Math.abs(x / 2 - cn) > 0.2; })), p = r.pick(range(2, Math.floor(d * d) - 1).filter(function (x) { return !isSq(x) && Math.sqrt(x) < d - 0.2; }));
            var cp = Math.ceil(e) + (Number.isInteger(e) ? 1 : 0); if (cp === Math.ceil(v)) cp++;
            if (p == null || cp > 6) continue;
            items = [{ id: 'nf', tex: '-\\frac{' + nf + '}{2}', v: -nf / 2 }, { id: 'cn', tex: '\\sqrt[3]{-' + cn * cn * cn + '}', v: -cn }, { id: 'rad', tex: a + '\\sqrt{' + b + '}', v: v }, { id: 'dec', tex: String(d), v: d },
              { id: 'sq', tex: '\\sqrt{' + p + '}', v: Math.sqrt(p) }, { id: 'fr', tex: '\\frac{' + (2 * e) + '}{2}', v: e }, { id: 'cp', tex: '\\sqrt[3]{' + cp * cp * cp + '}', v: cp }];
            var vs = items.map(function (x) { return x.v; }).sort(function (x, y) { return x - y; });
            if (vs.every(function (x, i) { return !i || x - vs[i - 1] >= 0.03; })) break;
            items = null;
          }
          if (!items || r.chance(0.1)) items = [{ id: 'nf', tex: '-\\frac{5}{2}', v: -2.5 }, { id: 'cn', tex: '\\sqrt[3]{-27}', v: -3 }, { id: 'rad', tex: '2\\sqrt{3}', v: 2 * Math.sqrt(3) }, { id: 'dec', tex: '3.4', v: 3.4 }, { id: 'sq', tex: '\\sqrt{8}', v: Math.sqrt(8) }, { id: 'fr', tex: '\\frac{7}{2}', v: 3.5 }, { id: 'cp', tex: '\\sqrt[3]{64}', v: 4 }];
          var by = {}; items.forEach(function (x) { by[x.id] = x; });
          var rad = by.rad, dec = by.dec, frc = by.fr, a2b = Math.round(rad.v * rad.v);
          var sorted = items.slice().sort(function (x, y) { return x.v - y.v; });
          return P.order(r, 'Without a calculator, arrange these seven numbers from <b>least to greatest</b>.', sorted, { why: function (x, y) { return t(by[x].tex) + ' and ' + t(by[y].tex) + ' are in the wrong order. ' + (/rad|dec|fr/.test(x) && /rad|dec|fr/.test(y) ? 'Compare their squares: ' + t('(' + rad.tex + ')^{2}=' + a2b) + ', ' + t(dec.tex + '^{2}=' + K.roundTo(dec.v * dec.v, 2)) + ', ' + t('\\left(' + frc.tex + '\\right)^{2}=' + K.roundTo(frc.v * frc.v, 2)) + '.' : 'Write each as a decimal.'); } },
            'Values: ' + items.map(function (x) { return t(x.tex + (Number.isInteger(x.v) ? '=' + x.v : '\\approx ' + K.roundTo(x.v, 2))); }).join(', ') + '.<br>To settle ' + t(dec.tex) + ', ' + t(rad.tex) + ' and ' + t(frc.tex) + ', compare squares: ' + t(rad.tex + '=\\sqrt{' + a2b + '}') + ', ' + t(dec.tex + '^{2}=' + K.roundTo(dec.v * dec.v, 2) + '<' + a2b) + ' and ' + t('\\left(' + frc.tex + '\\right)^{2}=' + K.roundTo(frc.v * frc.v, 2) + '>' + a2b) + ', so ' + t(dec.tex + '<' + rad.tex + '<' + frc.tex) + '.<br>' + t(sorted.map(function (x) { return x.tex; }).join('<')) + '.',
            ['Work out the roots you can exactly (' + t('\\sqrt[3]{-27}=-3') + ' type). Estimate the others.', 'For three numbers that are very close, compare their squares: ' + t('(a\\sqrt{b})^{2}=a^{2}b') + '.'], 'order seven numbers');
        } }] },
      { num: '10', section: 'Extra practice C — Reasoning and Proof-Style', stem: '<b>Error analysis.</b> Each solution has exactly <i>one</i> wrong step.',
        shared: function (r) { return { a: e10a(r), b: e10b(r), c: e10c(r) }; }, parts: [
        { id: 'e10a1', sub: 'a(i)', level: 'PRG', outcome: 'REV', make: function (r, sh) {
          var S = sh.a;
          return P.mc(r, S.show + '<br>Which step is wrong, and why?', [
            { html: '<b>Step 1</b>: ' + t('(-' + S.c + ')^{2}=+' + S.c * S.c) + ', not ' + t('-' + S.c * S.c) + '. The brackets put the negative inside the square.', right: true },
            { html: '<b>Step 1</b>: ' + t('\\sqrt{' + S.s * S.s + '}') + ' should be ' + t('\\pm ' + S.s) + '.', why: t('\\sqrt{' + S.s * S.s + '}') + ' means the positive root, ' + t(S.s) + '. Look at the power in Step 1.' },
            { html: '<b>Step 2</b>: ' + t('\\frac{1}{2}\\times(-' + S.c * S.c + ')') + ' should be ' + t('-' + S.c * S.c * 2) + '.', why: 'Half of ' + t('-' + S.c * S.c) + ' is ' + t('-' + S.c * S.c / 2) + ', so Step 2 follows from Step 1. The mistake is earlier.' },
            { html: '<b>Step 3</b>: the subtraction is wrong.', why: 'Check: ' + t(S.Ftex + '-' + S.c * S.c / 2 + '-' + S.s + '=' + frT(S.wrongT)) + ' is right for that line. The mistake is earlier.' }],
            'Step 1 is wrong: ' + t('(-' + S.c + ')^{2}=(-' + S.c + ')(-' + S.c + ')=+' + S.c * S.c) + '.', ['Check each step one at a time. Is ' + t('(-' + S.c + ')^{2}') + ' positive or negative?'], 'error BEDMAS step', true);
        } },
        { id: 'e10a2', sub: 'a(ii)', level: 'PRG', outcome: 'REV', make: function (r, sh) { var S = sh.a; return fracPart('Evaluate ' + t(S.expr) + ' correctly.', S.T, function (v) { if (ex.eq(v, S.wrongT[0] / S.wrongT[1])) return { code: 'u1l8-neg-square', hint: 'That’s the student’s answer. Redo it with ' + t('(-' + S.c + ')^{2}=+' + S.c * S.c) + '.' }; return null; }, t(S.Ftex + '+\\frac{1}{2}\\times ' + S.c * S.c + '-' + S.s + '=' + S.Ftex + '+' + S.c * S.c / 2 + '-' + S.s + '=' + frT(S.T)) + '.', ['Fix Step 1, then carry on.'], 'error BEDMAS answer'); } },
        { id: 'e10b1', sub: 'b(i)', level: 'PRG', outcome: 'AN2', make: function (r, sh) {
          var S = sh.b;
          return P.mc(r, S.show + '<br>Which step is wrong, and why?', [
            { html: '<b>Step 2</b>: taking a square root <b>halves</b> each exponent, so ' + t(S.p + '^{2}') + ' comes out as ' + t(S.p) + ', not ' + t(S.p + '^{2}') + '.', right: true },
            { html: '<b>Step 1</b>: the prime factorization is wrong.', why: 'Check: ' + t(S.fac + '=' + F(S.N)) + '. Step 1 is right.' },
            { html: '<b>Step 2</b>: ' + t(S.t2) + ' should come out as ' + t(S.t2) + ', not ' + t(S.t1) + '.', why: t('\\sqrt{' + S.t2 + '}=' + S.t1) + ' — halving the exponent is right for that prime.' },
            { html: '<b>Step 3</b>: ' + t(S.o1 + '\\times ' + S.p * S.p) + ' is multiplied wrong.', why: 'The arithmetic in Step 3 is fine; the mistake is in what came out of the root.' }],
            'Step 2: ' + t('\\sqrt{' + S.p + '^{2}}=' + S.p) + '. Correct: ' + t('\\sqrt{' + F(S.N) + '}=' + S.t1 + '\\times ' + S.p + '\\times\\sqrt{' + S.q + '}=' + S.o1 * S.p + '\\sqrt{' + S.q + '}') + '.', ['When a prime comes out of a square root, what happens to its exponent?'], 'error radical step', true);
        } },
        { id: 'e10b2', sub: 'b(ii)', level: 'PRG', outcome: 'AN2', make: function (r, sh) { var S = sh.b; var p = mixPart(1, 2, S.N); p.prompt = 'Give the correct simplest form of ' + t('\\sqrt{' + F(S.N) + '}') + '.'; return p; } },
        { id: 'e10c1', sub: 'c(i)', level: 'PRG', outcome: 'AN1', make: function (r, sh) {
          var S = sh.c;
          return P.mc(r, S.show + '<br>Which step is wrong, and why?', [
            { html: '<b>Step 2</b>: that is the GCF rule (lowest powers). The LCM takes every prime at its <b>highest</b> power.', right: true },
            { html: '<b>Step 1</b>: the prime factorizations are wrong.', why: 'Check by multiplying: both factorizations are right.' },
            { html: '<b>Step 2</b>: the LCM should be ' + t(S.a + '\\times ' + S.b) + '.', why: 'That’s <i>a</i> common multiple, but not the least one.' },
            { html: '<b>Step 3</b>: ' + t(S.gTex) + ' doesn’t equal ' + t(S.g) + '.', why: t(S.gTex + '=' + S.g) + ' is right; the problem is which powers were used.' }],
            'Step 2 used the lowest powers (that gives the GCF, ' + t(S.g) + '). LCM ' + t('=' + S.lTex + '=' + S.L) + '.', ['Which rule uses the lowest powers, and which uses the highest?'], 'error LCM step', true);
        } },
        { id: 'e10c2', sub: 'c(ii)', level: 'PRG', outcome: 'AN1', make: function (r, sh) { var S = sh.c; return P.number('Give the correct LCM of ' + t(S.a) + ' and ' + t(S.b) + '.', S.L, lcmDiag([S.a, S.b]), lcmSol([S.a, S.b]), ['Every prime, highest power.'], 'error LCM answer', { before: t('\\text{LCM}=') }); } }] },
      { num: '11', stem: '<b>Always, sometimes, or never?</b> Choose the verdict with a correct reason or counterexample.', parts: [
        { id: 'e11a', level: 'PRG', outcome: 'AN2', make: function (r) { var a = r.pick([2, 3, 5, 7]), b = r.pick([2, 3, 5, 7].filter(function (x) { return x !== a; })); return asn(r, 'The product of two irrational numbers is irrational.', 'S',
          { A: ['Always — multiplying can’t get rid of a decimal that never ends.', 'Counterexample: ' + t('\\sqrt{' + a + '}\\times\\sqrt{' + a + '}=' + a) + ', which is rational.'], S: ['Sometimes — ' + t('\\sqrt{' + a + '}\\times\\sqrt{' + a + '}=' + a) + ' is rational, but ' + t('\\sqrt{' + a + '}\\times\\sqrt{' + b + '}=\\sqrt{' + a * b + '}') + ' is irrational.'], N: ['Never — two irrational numbers always multiply to a whole number.', t('\\sqrt{' + a + '}\\times\\sqrt{' + b + '}=\\sqrt{' + a * b + '}') + ' is irrational.'] }); } },
        { id: 'e11b', level: 'EMG', outcome: 'AN2', make: function (r) { var n = r.int(2, 9), pq = properPair(r, [3, 4, 5, 7]); return asn(r, 'The sum of an integer and a rational number is rational.', 'A',
          { A: ['Always — every integer is rational (' + t('n=\\frac{n}{1}') + '), and adding two fractions gives a fraction.'], S: ['Sometimes — ' + t(n + '+\\frac{' + pq[0] + '}{' + pq[1] + '}') + ' isn’t an integer, so it isn’t rational.', t(n + '+\\frac{' + pq[0] + '}{' + pq[1] + '}=\\frac{' + (n * pq[1] + pq[0]) + '}{' + pq[1] + '}') + ' is a fraction, so it <b>is</b> rational — not being an integer doesn’t matter.'], N: ['Never — integers and fractions can’t be added.', 'They can: ' + t(n + '+\\frac{' + pq[0] + '}{' + pq[1] + '}=\\frac{' + (n * pq[1] + pq[0]) + '}{' + pq[1] + '}') + '.'] }); } },
        { id: 'e11c', level: 'EMG', outcome: 'AN2', make: function (r) { var s = r.int(2, 9), n = r.pick([2, 3, 5, 6, 7, 10, 11]); return asn(r, 'If ' + t('n') + ' is a whole number, then ' + t('\\sqrt{n}') + ' is irrational.', 'S',
          { A: ['Always — square roots never come out evenly.', 'Counterexample: ' + t('\\sqrt{' + s * s + '}=' + s) + '.'], S: ['Sometimes — ' + t('\\sqrt{' + n + '}') + ' is irrational, but ' + t('\\sqrt{' + s * s + '}=' + s) + ' is rational.'], N: ['Never — the square root of a whole number is always a whole number.', t('\\sqrt{' + n + '}') + ' is not a whole number; it is irrational.'] }); } },
        { id: 'e11d', level: 'PRG', outcome: 'AN1', make: function (r) { var x = r.int(4, 12), ab = r.pick([[4, 6], [6, 8], [9, 12], [10, 15], [8, 12]]); return asn(r, 'The LCM of two whole numbers is greater than their GCF.', 'S',
          { A: ['Always — a multiple is always bigger than a factor.', 'Counterexample: ' + t(x) + ' and ' + t(x) + ' have LCM ' + t('=' + x) + ' and GCF ' + t('=' + x) + '.'], S: ['Sometimes — usually (' + t(ab[0]) + ' and ' + t(ab[1]) + ': LCM ' + t(lcm(ab[0], ab[1])) + ', GCF ' + t(gcd(ab[0], ab[1])) + '), but for two equal numbers like ' + t(x) + ' and ' + t(x) + ' both are ' + t(x) + '.'], N: ['Never — the LCM is always smaller.', 'For ' + t(ab[0]) + ' and ' + t(ab[1]) + ', LCM ' + t('=' + lcm(ab[0], ab[1])) + ' is bigger than GCF ' + t('=' + gcd(ab[0], ab[1])) + '.'] }); } },
        { id: 'e11e', level: 'EMG', outcome: 'AN2', make: function (r) { var c = r.int(2, 5); return asn(r, 'If ' + t('n') + ' is negative, then ' + t('\\sqrt[3]{n}') + ' is a real number.', 'A',
          { A: ['Always — an odd index allows a negative radicand, e.g. ' + t('\\sqrt[3]{-' + c * c * c + '}=-' + c) + '.'], S: ['Sometimes — only when ' + t('n') + ' is a perfect cube.', t('\\sqrt[3]{-2}') + ' isn’t a whole number, but it is still a real (irrational) number.'], N: ['Never — you can’t take a root of a negative number.', 'With an odd index you can: ' + t('(-' + c + ')^{3}=-' + c * c * c) + '.'] }); } },
        { id: 'e11f', level: 'EMG', outcome: 'AN2', make: function (r) { var c = r.int(2, 9); return asn(r, 'If ' + t('n') + ' is negative, then ' + t('\\sqrt{n}') + ' is a real number.', 'N',
          { A: ['Always — ' + t('\\sqrt{-' + c * c + '}=-' + c) + '.', t('(-' + c + ')^{2}=+' + c * c) + ', not ' + t('-' + c * c) + '.'], S: ['Sometimes — when ' + t('n') + ' is a negative perfect square, like ' + t('-' + c * c) + '.', 'No real number squared is negative, not even for ' + t('-' + c * c) + '.'], N: ['Never — no real number squared is negative.'] }); } }] },
      { num: '12', stem: 'Choose the best explanation.', parts: [
        { id: 'e12a', level: 'PRG', outcome: 'AN2', make: function (r) {
          var a = r.pick([2, 3, 5, 6, 7]), k = r.int(2, 5), b = a * k * k, c = r.pick([2, 3, 5, 6, 7, 10, 11].filter(function (x) { return x !== a && !isSq(a * x); })); if (r.chance(0.12)) { a = 2; k = 5; b = 50; c = 5; }
          return P.mc(r, 'Explain why ' + t('\\sqrt{' + a + '}\\times\\sqrt{' + b + '}') + ' is a whole number but ' + t('\\sqrt{' + a + '}\\times\\sqrt{' + c + '}') + ' is not.', [
            { html: t('\\sqrt{' + a + '}\\times\\sqrt{' + b + '}=\\sqrt{' + a * b + '}') + ' and ' + t(a * b + '=' + a * k + '^{2}') + ' is a perfect square, so it equals ' + t(a * k) + '. But ' + t('\\sqrt{' + a + '}\\times\\sqrt{' + c + '}=\\sqrt{' + a * c + '}') + ', and ' + t(a * c) + ' is not a perfect square.', right: true },
            { html: 'Because ' + t(b) + ' is larger than ' + t(c) + '.', why: 'Size doesn’t decide it: multiply under one root and ask whether the result is a perfect square.' },
            { html: 'Because ' + t('\\sqrt{' + b + '}') + ' is a whole number.', why: t(b) + ' is not a perfect square, so ' + t('\\sqrt{' + b + '}') + ' is irrational on its own.' },
            { html: 'Multiplying two square roots always gives a whole number when one radicand is a multiple of the other.', why: 'Try ' + t('\\sqrt{2}\\times\\sqrt{6}=\\sqrt{12}=2\\sqrt{3}') + ': 6 is a multiple of 2, but the result isn’t whole.' }],
            t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + '. The product is whole exactly when ' + t('ab') + ' is a perfect square: ' + t(a * b + '=' + a * k + '^{2}') + ' is, ' + t(a * c) + ' is not.', ['Multiply under one root first. Is the result a perfect square?'], 'why product of roots whole');
        } },
        { id: 'e12b', level: 'PRG', outcome: 'AN1', make: function (r) {
          var xy = r.chance(0.12) ? [6, 8] : r.pick([[6, 8], [4, 6], [6, 9], [10, 15], [6, 10], [4, 10], [9, 12], [8, 12], [6, 15], [12, 18], [10, 4]]), x = xy[0], y = xy[1], L = lcm(x, y), M = x * y;
          return P.mc(r, 'A whole number is divisible by both ' + t(x) + ' and ' + t(y) + '. Explain why it must also be divisible by ' + t(L) + ', but need not be divisible by ' + t(M) + '.', [
            { html: 'Its prime factorization must contain all the primes of ' + t(x + '=' + K.fac(x)) + ' and of ' + t(y + '=' + K.fac(y)) + ' — at least the LCM, ' + t(L + '=' + K.fac(L)) + '. But ' + t(M + '=' + K.fac(M)) + ' needs extra factors; ' + t(L) + ' itself is divisible by ' + t(x) + ' and ' + t(y) + ' but not by ' + t(M) + '.', right: true },
            { html: 'It must be divisible by ' + t(M) + ' too, because ' + t(x + '\\times ' + y + '=' + M) + '.', why: t(L) + ' is divisible by ' + t(x) + ' and by ' + t(y) + ', but not by ' + t(M) + '.' },
            { html: 'Because ' + t(L) + ' is the GCF of ' + t(x) + ' and ' + t(y) + '.', why: 'The GCF is ' + t(gcd(x, y)) + '. ' + t(L) + ' is the <b>LCM</b>.' },
            { html: 'Because ' + t(L) + ' is the sum of ' + t(x) + ' and ' + t(y) + ', doubled.', why: 'It’s the least common multiple, found from the prime factorizations.' }].filter(function (o, i) { return i !== 3 || 2 * (x + y) !== L; }),
            'Any number divisible by ' + t(x) + ' and ' + t(y) + ' is a common multiple of them, so it is a multiple of their LCM, ' + t(L) + '. It need not be divisible by ' + t(M) + ': ' + t(L) + ' itself works for ' + t(x) + ' and ' + t(y) + ', but ' + t(L + '\\div ' + M) + ' isn’t a whole number.', ['Think prime factorizations: what must the number contain?'], 'divisible by LCM not product');
        } }] },
      { num: '13', section: 'Extra practice D — Applications', stem: function (sh) { return 'A square tabletop has an area of ' + t(sh.A + '\\text{ cm}^{2}') + '.'; }, outcome: 'AN2',
        shared: function (r) { var o = pool(2, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2, 5, 700).filter(function (A) { return A >= 40; }); return { A: r.chance(0.12) ? 288 : r.pick(o) }; },
        parts: [
          { id: 'e13a', level: 'EMG', make: function (r, sh) { var p = mixPart(1, 2, sh.A); p.prompt = 'Give the exact side length in simplest mixed radical form.'; p.input.after = t('\\text{cm}'); return p; } },
          { id: 'e13b', level: 'PRG', make: function (r, sh) {
            var x = Math.sqrt(sh.A), lo = Math.floor(x), hi = lo + 1;
            var p = P.fields('Between which two consecutive whole numbers does the side length lie, and what is it to the nearest tenth of a centimetre?', [{ name: 'Smaller', label: 'Between', after: t('<s') }, { name: 'Larger', label: 'and', before: t('s<') }, { name: 'Nearest tenth', label: 'Nearest tenth', before: t('s\\approx'), after: 'cm' }],
              [sideChk(lo, hi, true, 2, sh.A), sideChk(hi, lo, false, 2, sh.A), estChk(x, lo, hi)], [String(lo), String(hi), K.roundTo(x, 1).toFixed(1)], t(lo + '<s<' + hi) + ', ' + t('s\\approx ' + K.roundTo(x, 1).toFixed(1)) + ' cm',
              t(lo + '^{2}=' + lo * lo + '<' + sh.A + '<' + hi * hi + '=' + hi + '^{2}') + ', so ' + t(lo + '<s<' + hi) + '. ' + t(sh.A) + ' is ' + t(sh.A - lo * lo) + ' past ' + t(lo * lo) + ' out of a gap of ' + t(hi * hi - lo * lo) + ', so ' + t('s\\approx ' + K.roundTo(x, 1).toFixed(1)) + ' cm (' + t('\\sqrt{' + sh.A + '}=' + x.toFixed(3) + '\\ldots') + ').',
              ['Find the perfect squares on either side of ' + t(sh.A) + '.', 'How far is ' + t(sh.A) + ' past the lower perfect square, compared with the whole gap? (Answers within 0.1 cm are accepted.)'], 'tabletop bracket ' + sh.A);
            p.bad = [[String(hi), String(lo), K.roundTo(x, 1).toFixed(1)]];
            return p;
          } },
          { id: 'e13c', level: 'PRG', make: function (r, sh) {
            var f = ex.nthFactor(sh.A, 2), m = sh.A / (f * f), key = 4 * f + '\\sqrt{' + m + '}';
            var p = P.math('Give the exact perimeter in simplest mixed radical form.', K.radical({ k: 4 * f, n: 2, m: m }, 'mixed', { diag: function (val, rr) { if (rr && rr.n === 2 && rr.m === m && Math.abs(rq(rr.k)) === f) return { code: 'u1l8-whole-plot', hint: 'That’s one side. The perimeter is all four sides.' }; if (rr && rr.n === 2 && rr.m === m && Math.abs(rq(rr.k)) === 2 * f) return { code: 'perimeter', hint: 'A square has <b>four</b> equal sides.' }; return null; } }), key,
              'Side ' + t('=\\sqrt{' + sh.A + '}=' + f + '\\sqrt{' + m + '}') + '. Perimeter ' + t('=4\\times ' + f + '\\sqrt{' + m + '}=' + key) + ' cm.', ['A square has four equal sides. Multiply the coefficient by 4.'], 'perimeter ' + sh.A, { keys: 'radical', after: t('\\text{cm}') });
            p.bad = [f + '\\sqrt{' + m + '}', 2 * f + '\\sqrt{' + m + '}'];
            return p;
          } }] },
      { num: '14', stem: function (sh) { return 'A cube has a volume of ' + t(sh.V + '\\text{ cm}^{3}') + '.'; }, outcome: 'AN2',
        shared: function (r) { return { V: r.chance(0.12) ? 375 : r.pick(pool(3, [2, 3, 4, 5], 2, 7, 900)) }; },
        parts: [
          { id: 'e14a', level: 'EMG', make: function (r, sh) { var p = mixPart(1, 3, sh.V); p.prompt = 'Give the exact edge length as a mixed radical in simplest form.'; p.input.after = t('\\text{cm}'); return p; } },
          { id: 'e14b', level: 'EMG', make: function (r, sh) {
            var f = ex.nthFactor(sh.V, 3), m = sh.V / (f * f * f);
            return P.mc(r, 'Is that edge length rational or irrational?', ratMC(r, '\\sqrt[3]{' + sh.V + '}', f + '\\sqrt[3]{' + m + '}', false, { pw: 'cube' }),
              t(sh.V + '=' + f + '^{3}\\times ' + m) + ' is not a perfect cube, so ' + t('\\sqrt[3]{' + m + '}') + ' never ends or repeats: the edge ' + t(f + '\\sqrt[3]{' + m + '}') + ' is irrational.', ['Is ' + t(sh.V) + ' a perfect cube?'], 'cube edge rational?');
          } },
          { id: 'e14c', level: 'EMG', make: function (r, sh) {
            var x = Math.cbrt(sh.V), lo = Math.floor(x), hi = lo + 1;
            var p = P.fields('Between which two consecutive whole numbers does the edge length lie?', [{ name: 'Smaller', label: 'Between', after: t('<\\sqrt[3]{' + sh.V + '}') }, { name: 'Larger', label: 'and', before: t('\\sqrt[3]{' + sh.V + '}<') }],
              [sideChk(lo, hi, true, 3, sh.V), sideChk(hi, lo, false, 3, sh.V)], [String(lo), String(hi)], t(lo + '<\\sqrt[3]{' + sh.V + '}<' + hi),
              t(lo + '^{3}=' + pw(lo, 3) + '<' + sh.V + '<' + pw(hi, 3) + '=' + hi + '^{3}') + ', so the edge is between ' + t(lo) + ' and ' + t(hi) + ' cm.', ['List the perfect cubes near ' + t(sh.V) + ': ' + t(LIST[3]) + '.'], 'bracket cbrt ' + sh.V);
            p.bad = [[String(hi), String(lo)]];
            return p;
          } }] },
      { num: '15', stem: function (sh) { return 'A rectangular wall measuring ' + t(sh.a + '\\text{ cm}') + ' by ' + t(sh.b + '\\text{ cm}') + ' is covered with the largest possible identical square tiles, with no leftover strip along either edge.'; },
        shared: function (r) {
          if (r.chance(0.12)) return { a: 96, b: 144, g: 48, u: 3, v: 2 };
          var fr2 = r.pick([[3, 2], [4, 2], [3, 4], [5, 2], [6, 3], [6, 2], [4, 3]]), L = lcm(fr2[0], fr2[1]), o = [];
          [[2, 3], [3, 4], [1, 6], [2, 5], [3, 5], [4, 5], [1, 4], [3, 8], [2, 9], [4, 9], [1, 12], [5, 6], [1, 10]].forEach(function (xy) { if ((xy[0] * xy[1]) % L === 0) [12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 48].forEach(function (g) { if (g * xy[1] <= 400) o.push({ a: g * xy[0], b: g * xy[1], g: g, u: fr2[0], v: fr2[1] }); }); });
          return o.length ? r.pick(o) : { a: 96, b: 144, g: 48, u: 3, v: 2 };
        },
        parts: [
          { id: 'e15a', level: 'PRG', outcome: 'AN1', make: function (r, sh) { return P.number('Use the GCF to find the side length of each tile.', sh.g, gcfDiag([sh.a, sh.b]), gcfSol([sh.a, sh.b]) + ' Each tile is ' + t(sh.g) + ' cm on a side.', ['The tile’s side must divide evenly into both ' + t(sh.a) + ' and ' + t(sh.b) + '.'], 'wall GCF', { after: 'cm' }); } },
          { id: 'e15b', level: 'PRG', outcome: 'AN1', make: function (r, sh) { var x = sh.a / sh.g, y = sh.b / sh.g, n = x * y; return P.number('How many tiles are used in total?', n, function (v) { if (v === x + y) return { code: 'added', hint: 'Multiply the tiles along each side.' }; if (v === sh.a * sh.b / sh.g) return { code: 'area-by-side', hint: 'Divide by a tile’s <b>area</b>, not its side length.' }; return null; }, t(sh.a + '\\div ' + sh.g + '=' + x) + ' and ' + t(sh.b + '\\div ' + sh.g + '=' + y) + ', so ' + t(x + '\\times ' + y + '=' + n) + ' tiles.', ['How many tiles fit along each edge?'], 'tile count', { after: 'tiles' }); } },
          { id: 'e15c', level: 'PRG', outcome: 'REV', make: function (r, sh) {
            var n = sh.a / sh.g * (sh.b / sh.g), u = sh.u, v = sh.v, T = ex.norm(u * v - v - u, u * v), cnt = n * T[0] / T[1];
            var p = P.fields('If ' + t('\\frac{1}{' + u + '}') + ' of the tiles are blue and ' + t('\\frac{1}{' + v + '}') + ' are white, what fraction of the tiles are neither colour — and how many tiles is that?', [{ name: 'Fraction', label: 'Fraction', mode: 'math', keys: 'fraction' }, { name: 'Tiles', label: 'Tiles', after: 'tiles' }],
              [fracChk(T, { diag: function (x) { if (ex.eq(x, 1 / u + 1 / v)) return { code: 'value', hint: 'That’s the fraction that <b>are</b> blue or white. Subtract it from ' + t(1) + '.' }; if (ex.eq(x, 2 / (u + v)) || ex.eq(x, 1 - 2 / (u + v))) return { code: 'u1l8-add-across', hint: 'Use a common denominator to add ' + t('\\frac{1}{' + u + '}+\\frac{1}{' + v + '}') + '.' }; return null; } }),
                K.number(cnt, function (x) { if (x === n * (1 / u + 1 / v)) return { code: 'value', hint: 'That’s how many <b>are</b> coloured. How many are left?' }; return null; })],
              [frT(T), String(cnt)], t(frT(T)) + ' of the tiles, ' + t(cnt) + ' tile' + (cnt === 1 ? '' : 's'),
              t('1-\\frac{1}{' + u + '}-\\frac{1}{' + v + '}=\\frac{' + u * v + '}{' + u * v + '}-\\frac{' + v + '}{' + u * v + '}-\\frac{' + u + '}{' + u * v + '}=' + fr(u * v - u - v, u * v)) + '.<br>' + t(fr(u * v - u - v, u * v) + '\\times ' + n + '=' + cnt) + ' tile' + (cnt === 1 ? '' : 's') + '.',
              ['All the tiles make ' + t(1) + '. Subtract the two coloured fractions (common denominator!).', 'Then take that fraction of the total number of tiles.'], 'neither colour');
            return p;
          } }] },
      { num: '16', stem: function (sh) { return 'One square garden plot has an area of ' + t(sh.A1 + '\\text{ m}^{2}') + '; a second has an area of ' + t(sh.A2 + '\\text{ m}^{2}') + '.'; }, outcome: 'AN2',
        shared: function (r) { if (r.chance(0.12)) return { A1: 200, A2: 50, a: 5, k: 2, m: 2 }; var m = r.pick([2, 3, 5, 6, 7]), a = r.int(2, 5), k = r.pick([2, 3]); for (var g = 0; g < 50 && (k * a) * (k * a) * m > 700; g++) { a = r.int(2, 5); k = r.pick([2, 3]); } return { A1: k * k * a * a * m, A2: a * a * m, a: a, k: k, m: m }; },
        parts: [
          { id: 'e16a', level: 'PRG', make: function (r, sh) {
            var k1 = sh.k * sh.a, k2 = sh.a, m = sh.m, s1 = k1 + '\\sqrt{' + m + '}', s2 = k2 + '\\sqrt{' + m + '}';
            var p = P.fields('Give both side lengths exactly, in simplest mixed radical form.', [{ name: 'First side', label: 'First', before: t('s_{1}='), after: 'm', mode: 'math', keys: 'radical' }, { name: 'Second side', label: 'Second', before: t('s_{2}='), after: 'm', mode: 'math', keys: 'radical' }],
              [mixPart(1, 2, sh.A1).check, mixPart(1, 2, sh.A2).check], [s1, s2], t('s_{1}=' + s1) + ' m, ' + t('s_{2}=' + s2) + ' m',
              t('\\sqrt{' + sh.A1 + '}=\\sqrt{' + k1 * k1 + '\\times ' + m + '}=' + s1) + ' and ' + t('\\sqrt{' + sh.A2 + '}=\\sqrt{' + k2 * k2 + '\\times ' + m + '}=' + s2) + '.', ['Each side is the square root of the area. Take out the largest perfect square.'], 'two plot sides');
            p.bad = [[s2, s1]];
            return p;
          } },
          { id: 'e16b', level: 'PRG', make: function (r, sh) { return P.number('How many times longer is the first side than the second?', sh.k, function (v) { if (v === sh.k * sh.k) return { code: 'u1l8-not-root', hint: 'That compares the <b>areas</b>. Compare the side lengths: ' + t(sh.k * sh.a + '\\sqrt{' + sh.m + '}\\div ' + sh.a + '\\sqrt{' + sh.m + '}') + '.' }; if (ex.eq(v, 1 / sh.k)) return { code: 'u1l8-ratio-flip', hint: 'First ÷ second, not the other way round.' }; return null; }, t('\\frac{' + sh.k * sh.a + '\\sqrt{' + sh.m + '}}{' + sh.a + '\\sqrt{' + sh.m + '}}=\\frac{' + sh.k * sh.a + '}{' + sh.a + '}=' + sh.k) + '.', ['Divide the first side by the second. The ' + t('\\sqrt{' + sh.m + '}') + 's cancel.'], 'side ratio', { after: 'times' }); } },
          { id: 'e16c', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'Is that ratio rational or irrational? How can two irrational lengths have a rational ratio?', [
              { html: 'Rational: both sides are whole numbers times the same ' + t('\\sqrt{' + sh.m + '}') + ', so the ' + t('\\sqrt{' + sh.m + '}') + ' divides out and leaves ' + t(sh.k) + '.', right: true },
              { html: 'Irrational: dividing two irrational numbers always gives an irrational number.', why: 'Not always: ' + t('\\frac{' + sh.k * sh.a + '\\sqrt{' + sh.m + '}}{' + sh.a + '\\sqrt{' + sh.m + '}}=' + sh.k) + '.' },
              { html: 'Rational: the areas are whole numbers.', why: 'Whole-number areas can still give irrational sides. The reason is that the irrational parts are the same and cancel.' },
              { html: 'Irrational: each side has a square root in it.', why: 'The square roots are the same, so they cancel in the ratio.' }],
              t('\\frac{' + sh.k * sh.a + '\\sqrt{' + sh.m + '}}{' + sh.a + '\\sqrt{' + sh.m + '}}=' + sh.k) + ', a rational number. The irrational factor ' + t('\\sqrt{' + sh.m + '}') + ' is in both and cancels.', ['Look at what the two sides have in common.'], 'ratio rational?');
          } }] },
      { num: '17', section: 'Extra practice E — Challenge', stem: '<b>Use prime factorization.</b> A perfect square needs <i>even</i> exponents on every prime; a perfect cube needs exponents that are multiples of ' + t('3') + '.', outcome: 'AN1', parts: [
        { id: 'e17a', level: 'ADV', make: function (r) { var N = r.chance(0.12) ? 72 : r.pick(kNums(2)); return kPart(N, 2); } },
        { id: 'e17b', level: 'MAS', make: function (r) { var N = r.chance(0.12) ? 72 : r.pick(kNums(3)); return kPart(N, 3); } },
        { id: 'e17c', level: 'ADV', make: function (r) { var N = r.chance(0.12) ? 40 : r.pick(kNums(2, true)); return kPart(N, 2); } }] },
      { num: '18', stem: 'Find every whole number ' + t('n') + ' that fits both conditions.', outcome: 'AN1', parts: [
        { id: 'e18a', level: 'ADV', make: function (r) {
          var o = []; range(4, 11).forEach(function (a) { [3, 4, 5, 6, 7].forEach(function (d) { var w = range(a * a + 1, (a + 1) * (a + 1) - 1).filter(function (n) { return n % d === 0; }); if (w.length >= 2 && w.length <= 4) o.push({ a: a, d: d, w: w }); }); });
          var c = r.chance(0.12) ? { a: 7, d: 5, w: [50, 55, 60] } : r.pick(o), a = c.a, d = c.d, w = c.w;
          var inR = function (x) { return x > a * a && x < (a + 1) * (a + 1); }; inR.why = function (x) { return t('\\sqrt{' + x + '}') + ' is not between ' + t(a) + ' and ' + t(a + 1) + ' (' + t(n2(x)) + ').'; };
          function n2(x) { return x <= a * a ? x + '\\le ' + a * a : x + '\\ge ' + (a + 1) * (a + 1); }
          return listPart(t('\\sqrt{n}') + ' is between ' + t(a) + ' and ' + t(a + 1) + ', and ' + t('n') + ' is a multiple of ' + t(d) + '. List every such ' + t('n') + '.', w,
            t(a + '<\\sqrt{n}<' + (a + 1)) + ' means ' + t(a * a + '<n<' + (a + 1) * (a + 1)) + '. The multiples of ' + t(d) + ' in that range: ' + t(K.listTex(w)) + '.', ['Square the two whole numbers: ' + t('n') + ' must be between ' + t(a + '^{2}') + ' and ' + t((a + 1) + '^{2}') + '.', 'Then list the multiples of ' + t(d) + ' strictly between those.'], 'sqrt n between ' + a + ' multiple ' + d, inR, { why: function (x) { return 'it isn’t a multiple of ' + t(d) + '.'; } });
        } },
        { id: 'e18b', level: 'MAS', make: function (r) {
          var o = []; range(2, 5).forEach(function (c) { [5, 6, 7, 8, 9, 10, 11, 12, 15].forEach(function (d) { var w = range(c * c * c + 1, pw(c + 1, 3) - 1).filter(function (n) { return n % d === 0; }); if (w.length >= 3 && w.length <= 7) o.push({ c: c, d: d, w: w }); }); });
          var cc = r.chance(0.12) ? { c: 4, d: 9, w: [72, 81, 90, 99, 108, 117] } : r.pick(o), c = cc.c, d = cc.d, w = cc.w;
          var inR = function (x) { return x > c * c * c && x < pw(c + 1, 3); }; inR.why = function (x) { return t('\\sqrt[3]{' + x + '}') + ' is not between ' + t(c) + ' and ' + t(c + 1) + '.'; };
          return listPart(t('\\sqrt[3]{n}') + ' is between ' + t(c) + ' and ' + t(c + 1) + ', and ' + t('n') + ' is a multiple of ' + t(d) + '. List every such ' + t('n') + '.', w,
            t(c + '<\\sqrt[3]{n}<' + (c + 1)) + ' means ' + t(pw(c, 3) + '<n<' + pw(c + 1, 3)) + '. The multiples of ' + t(d) + ' in that range: ' + t(K.listTex(w)) + '.', ['Cube the two whole numbers: ' + t('n') + ' must be between ' + t(c + '^{3}') + ' and ' + t((c + 1) + '^{3}') + '.', 'Then list the multiples of ' + t(d) + ' strictly between those.'], 'cbrt n between ' + c + ' multiple ' + d, inR, { why: function (x) { return 'it isn’t a multiple of ' + t(d) + '.'; } });
        } }] },
      { num: '19', stem: 'Work backwards from the simplified form.', shared: function (r) { return e19c(r); }, parts: [
        { id: 'e19a', level: 'ADV', outcome: 'AN2', make: function (r) { var k = r.int(2, 9), m = r.pick([2, 3, 5, 6, 7]); if (r.chance(0.12)) { k = 6; m = 2; } var a = k * k * m; return P.number(t('\\sqrt{a}=' + k + '\\sqrt{' + m + '}') + '. Find ' + t('a') + '.', a, function (v) { if (v === k * m) return { code: 'no-power', hint: 'Square the ' + t(k) + ' before it moves inside: ' + t(k + '=\\sqrt{' + k * k + '}') + '.' }; if (v === k * k + m) return { code: 'added', hint: 'Multiply ' + t(k * k) + ' by ' + t(m) + '.' }; return null; }, t(k + '\\sqrt{' + m + '}=\\sqrt{' + k + '^{2}\\times ' + m + '}=\\sqrt{' + a + '}') + ', so ' + t('a=' + a) + '.', ['Write ' + t(k) + ' as a square root, then multiply under one root.'], 'work back sqrt'); } },
        { id: 'e19b', level: 'ADV', outcome: 'AN2', make: function (r) { var k = r.int(2, 5), m = r.pick(free(3, 2, 11)); if (r.chance(0.12)) { k = 2; m = 5; } var b = k * k * k * m; return P.number(t('\\sqrt[3]{b}=' + k + '\\sqrt[3]{' + m + '}') + '. Find ' + t('b') + '.', b, function (v) { if (v === k * m) return { code: 'no-power', hint: 'Cube the ' + t(k) + ' before it moves inside.' }; if (v === k * k * m) return { code: 'u1l8-squared', hint: 'For a cube root, <b>cube</b> the ' + t(k) + ': ' + t(k + '^{3}=' + k * k * k) + '.' }; return null; }, t(k + '\\sqrt[3]{' + m + '}=\\sqrt[3]{' + k + '^{3}\\times ' + m + '}=\\sqrt[3]{' + b + '}') + ', so ' + t('b=' + b) + '.', ['Write ' + t(k) + ' as a cube root, then multiply under one root.'], 'work back cbrt'); } },
        { id: 'e19c1', sub: 'c(i)', level: 'PRG', outcome: 'AN1', make: function (r, sh) {
          var S = sh;
          return P.mc(r, 'A number’s prime factorization is ' + t(S.tex) + '. Explain why it is a perfect square without multiplying it out.', [
            { html: 'Every exponent (' + t(S.e.join(',\\ ')) + ') is even, so each prime splits into two equal groups: the number is ' + t('(' + S.half + ')^{2}') + '.', right: true },
            { html: 'The exponents add up to an even number.', why: 'That isn’t enough: ' + t('2^{3}\\times 3') + ' has exponents adding to 4, but ' + t('24') + ' is not a perfect square. <b>Each</b> exponent must be even.' },
            { html: 'All its factors are prime numbers.', why: 'Every whole number has a prime factorization; that doesn’t make it a perfect square.' },
            { html: 'The largest exponent is even.', why: '<b>Every</b> exponent must be even — one odd exponent spoils it.' }],
            'A perfect square needs an even exponent on every prime, so the primes can be shared equally between two identical factors.', ['What must be true of the exponents in a perfect square?'], 'why perfect square');
        } },
        { id: 'e19c2', sub: 'c(ii)', level: 'ADV', outcome: 'AN1', make: function (r, sh) {
          var S = sh;
          var c = prodChk(S.root);
          return { prompt: 'Give its square root as a product of primes.', input: { type: 'math', keys: 'expr', before: t('\\sqrt{' + S.tex + '}=') }, key: S.half, answer: t(S.half + '=' + F(S.root)), text: 'sqrt as product of primes',
            check: function (resp) { var p = HW.parse.product(normX(resp)); if (p.ok && p.value === S.N) return wrong('u1l8-not-root', 'That’s the number itself. Halve each exponent to get its square root.'); var pn = HW.parse.number(normX(resp)); if (pn.ok && pn.value === S.root) return form('not-factored', 'Right value — now write it as a product of primes, like ' + t(S.half) + '.'); return c(resp); },
            solution: 'Halve each exponent: ' + t('\\sqrt{' + S.tex + '}=' + S.half + '=' + F(S.root)) + '. (Check: ' + t('(' + S.half + ')^{2}=' + S.tex) + '.)', hints: ['Taking a square root halves every exponent.'], bad: [S.tex] };
        } }] }
    ]
  });

  /* ---------- shared generators for the error-analysis and challenge items ---------- */
  function e10a(r) {
    var pq = properPair(r, [3, 4, 5, 6]), c = r.pick([2, 2, 4]), s = r.int(2, 5); if (r.chance(0.12)) { pq = [3, 4]; c = 2; s = 3; }
    var F0 = ex.norm(pq[0], pq[1]), Ftex = frT(F0), half = c * c / 2, T = ex.norm(pq[0] + (half - s) * pq[1], pq[1]), wrongT = ex.norm(pq[0] + (-half - s) * pq[1], pq[1]);
    var expr = Ftex + '+\\frac{1}{2}\\times(-' + c + ')^{2}-\\sqrt{' + s * s + '}';
    var show = 'Evaluate ' + t(expr) + '.<br>Step 1: ' + t('=' + Ftex + '+\\frac{1}{2}\\times(-' + c * c + ')-' + s) + '<br>Step 2: ' + t('=' + Ftex + '-' + half + '-' + s) + '<br>Step 3: ' + t('=' + frT(wrongT));
    return { c: c, s: s, Ftex: Ftex, T: T, wrongT: wrongT, show: show, expr: expr };
  }
  function e10b(r) {
    var o = []; [2, 4].forEach(function (e2) { [3, 5, 7].forEach(function (p) { [3, 5, 7, 11, 13].forEach(function (q) { if (q === p) return; var N = pw(2, e2) * p * p * q; if (N <= 2500) o.push({ e2: e2, p: p, q: q, N: N }); }); }); });
    var c = r.chance(0.12) ? { e2: 4, p: 3, q: 5, N: 720 } : r.pick(o), o1 = pw(2, c.e2 / 2), t1 = '2' + (c.e2 / 2 > 1 ? '^{' + c.e2 / 2 + '}' : ''), t2 = '2^{' + c.e2 + '}';
    var fac = t2 + '\\times ' + c.p + '^{2}\\times ' + c.q;
    var show = 'Simplify ' + t('\\sqrt{' + F(c.N) + '}') + '.<br>Step 1: ' + t(F(c.N) + '=' + fac) + '<br>Step 2: ' + t('\\sqrt{' + F(c.N) + '}=' + t1 + '\\times ' + c.p + '^{2}\\times\\sqrt{' + c.q + '}') + '<br>Step 3: ' + t('=' + o1 + '\\times ' + c.p * c.p + '\\sqrt{' + c.q + '}=' + o1 * c.p * c.p + '\\sqrt{' + c.q + '}');
    return { N: c.N, p: c.p, q: c.q, o1: o1, t1: t1, t2: t2, fac: fac, show: show };
  }
  function e10c(r) {
    var o = []; [[2, 3], [2, 5], [3, 5], [2, 7]].forEach(function (pq) { for (var al = 1; al <= 3; al++) for (var be = 1; be <= 3; be++) for (var ga = 1; ga <= 3; ga++) for (var de = 1; de <= 3; de++) { if (!(al < ga && be > de)) continue; var a = pw(pq[0], al) * pw(pq[1], be), b = pw(pq[0], ga) * pw(pq[1], de); if (a <= 100 && b <= 100) o.push({ p: pq[0], q: pq[1], al: al, be: be, ga: ga, de: de, a: a, b: b }); } });
    var c = r.chance(0.12) ? { p: 2, q: 3, al: 1, be: 2, ga: 3, de: 1, a: 18, b: 24 } : r.pick(o);
    function ft(p, e) { return e > 1 ? p + '^{' + e + '}' : String(p); }
    var gTex = ft(c.p, c.al) + '\\times ' + ft(c.q, c.de), lTex = ft(c.p, c.ga) + '\\times ' + ft(c.q, c.be), g = gcd(c.a, c.b), L = lcm(c.a, c.b);
    var show = 'Find the LCM of ' + t(c.a) + ' and ' + t(c.b) + '.<br>Step 1: ' + t(c.a + '=' + ft(c.p, c.al) + '\\times ' + ft(c.q, c.be)) + ', ' + t(c.b + '=' + ft(c.p, c.ga) + '\\times ' + ft(c.q, c.de)) + '<br>Step 2: LCM ' + t('=' + gTex) + '<br>Step 3: LCM ' + t('=' + g);
    return { a: c.a, b: c.b, g: g, L: L, gTex: gTex, lTex: lTex, show: show };
  }
  function e19c(r) {
    var o = []; [2, 4, 6].forEach(function (a) { [2, 4].forEach(function (b) { [0, 2].forEach(function (c) { var N = pw(2, a) * pw(3, b) * pw(5, c); if (N <= 400000 && N >= 100) o.push([a, b, c]); }); }); });
    var e = r.chance(0.12) ? [6, 4, 2] : r.pick(o), ps = [2, 3, 5];
    var parts = [], half = [], ee = [];
    e.forEach(function (x, i) { if (x) { parts.push(ps[i] + '^{' + x + '}'); half.push(ps[i] + (x / 2 > 1 ? '^{' + x / 2 + '}' : '')); ee.push(x); } });
    var N = pw(2, e[0]) * pw(3, e[1]) * pw(5, e[2]), root = Math.sqrt(N);
    return { tex: parts.join('\\times '), half: half.join('\\times '), e: ee, N: N, root: root };
  }
  /* always / sometimes / never: opts = { A: [claim, why-if-wrong], S: [...], N: [...] } */
  function asn(r, stmt, right, opts) {
    var list = ['A', 'S', 'N'].map(function (k) { return { html: opts[k][0], right: k === right, why: k === right ? null : opts[k][1], code: k }; });
    var words = { A: 'Always', S: 'Sometimes', N: 'Never' };
    return P.mc(r, '<i>' + stmt + '</i>', list, '<b>' + words[right] + '.</b> ' + opts[right][0].replace(/^[A-Za-z]+ — /, ''), ['Try a few examples — including special ones like perfect squares, equal numbers or negatives.'], 'always/sometimes/never: ' + stmt.replace(/<[^>]+>|\\\(|\\\)/g, ''), true);
  }
  /* smallest k so that N·k is a perfect square (n = 2) or cube (n = 3) */
  function kOf(N, n) { return nt.factor(N).reduce(function (m, pe) { return m * pw(pe[0], (n - pe[1] % n) % n); }, 1); }
  function kNums(n, alt) {
    return range(12, 300).filter(function (N) { var f = nt.factor(N); if (f.length < 2 || f.some(function (pe) { return pe[0] > (alt ? 7 : 5); })) return false; if (alt && !f.some(function (pe) { return pe[0] === 5 || pe[0] === 7; })) return false; var k2 = kOf(N, 2), k3 = kOf(N, 3); return k2 > 1 && k3 > 1 && k2 !== k3 && kOf(N, n) <= 30 && kOf(N, n) < N; });
  }
  function kPart(N, n) {
    var k = kOf(N, n), other = kOf(N, n === 2 ? 3 : 2), all = nt.factor(N).reduce(function (m, pe) { return m * pe[0]; }, 1), f = nt.factor(N), up = f.map(function (pe) { return [pe[0], pe[1] + (n - pe[1] % n) % n]; });
    var root = up.reduce(function (m, pe) { return m * pw(pe[0], pe[1] / n); }, 1), W = n === 2 ? 'perfect square' : 'perfect cube';
    return P.nr('What is the smallest whole number you can multiply ' + t(N) + ' by to make a ' + W + '?', k, function (v) {
      if (v === N && N !== k) return { code: 'times-itself', hint: 'Multiplying by ' + t(N) + ' itself isn’t the smallest choice. Look at the exponents in ' + t(N + '=' + K.fac(N)) + ': which primes need topping up?' };
      if (v === other && other !== k) return { code: n === 2 ? 'made-cube' : 'made-square', hint: 'That makes a perfect ' + (n === 2 ? 'cube' : 'square') + '. A ' + W + ' needs exponents that are ' + (n === 2 ? 'even' : 'multiples of 3') + '.' };
      if (v === all && all !== k) return { code: 'k-all', hint: 'You only need the primes whose exponents aren’t ' + (n === 2 ? 'even' : 'multiples of 3') + ' yet — and only as many as it takes.' };
      if (v === root) return { code: 'u1l8-not-root', hint: 'That’s the ' + (n === 2 ? 'square' : 'cube') + ' root of the new number. The question asks what you <b>multiply by</b>.' };
      if (v > k && v % k === 0 && Number.isInteger(Math.round(Math.pow(N * v, 1 / n) * 1e6) / 1e6)) return { code: 'not-smallest', hint: 'That works, but it isn’t the smallest.' };
      return null;
    }, t(N + '=' + K.fac(N)) + '. A ' + W + ' needs every exponent ' + (n === 2 ? 'even' : 'a multiple of 3') + ': ' + f.filter(function (pe) { return pe[1] % n; }).map(function (pe) { return t(pe[0] + (pe[1] > 1 ? '^{' + pe[1] + '}' : '') + '\\to ' + pe[0] + '^{' + (pe[1] + (n - pe[1] % n) % n) + '}'); }).join(', ') + '.<br>So multiply by ' + t('k=' + K.fac(k) + (nt.factor(k).length > 1 || nt.factor(k)[0][1] > 1 ? '=' + k : '')) + ': ' + t(N + '\\times ' + k + '=' + F(N * k) + '=' + HW.texFactors(up)) + ' ' + (n === 2 ? '= ' + t(root + '^{2}') : '= ' + t(root + '^{3}')) + '.',
    ['Write ' + t(N) + ' as a product of primes.', n === 2 ? 'Which primes have an odd exponent? Each needs one more factor.' : 'Which primes have an exponent that isn’t a multiple of 3? Top each one up to the next multiple of 3.'], 'smallest multiplier ' + W + ' ' + N);
  }
})(window);
