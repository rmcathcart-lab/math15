/* Math 15 · Unit 1 (Number) — exit slips for Lessons 1–8 (u1l1x … u1l8x), written in test mode at the end of class.
 * No calculator on any slip (Ryan's Math 15 Unit 1 paper test says "No calculator"), so every number stays friendly.
 * Each slip is Ryan's own Math 15 exit slip for that lesson (his older exit-slip app, Versions A and B), turned into
 * generators: the same questions, skills, outcomes and levels (his tags), with his Version A and B numbers among the
 * possible values. Lessons 1–2 and L8 Q1 are Grade 9 review: outcome 'REV' (never counts toward a level, badge or unit
 * grade; the slip still gets a score). The rest are AN1 / AN2. Every part has a key built from the generated values, a
 * worked solution, hints, and `bad` answers with u1x- codes (labels and partial-credit decisions below).
 * Changes from his slips:
 *  - One short Mastery question added where his slip had none, at Math 15 difficulty, from the lesson's hardest items:
 *    L1 a longer BEDMAS expression (Example 5b); L2 order of operations with fractions (Example 5a, Q11); L3 a GCF
 *    sharing problem, number of bags and items in each (Q10); L4 find a number that fits each description (Q6);
 *    L5 a root used backwards in a formula, then a second step (Example 5); L7 a cube root of a negative, or a fourth or
 *    fifth root, as a mixed radical (Q7, Q12); L8 a large radicand by prime factorization (Q17, Q24). L6 already had one.
 *  - L4 Q1 (which region of the diagram, MC) became the set diagram (setsort): place two numbers, his −√16 and 0/7 kinds.
 *  - L4 Q3 and L6 Q3 (MC "which list is in order" / "which is greatest") became orderings (no calculator): they are
 *    reasoning, not recognition. L6 Q3 stays Mastery (his tag); no MC above Progressing anywhere.
 *  - L5 Q2 (MC "which point shows √55") became the number line: place √n (within 0.2), with his distractors diagnosed.
 *  - L5 Q3 (cube edge with a calculator, to one decimal) became no-calculator: the two whole numbers the edge is between,
 *    and the nearest whole number (Lesson 5 Example 5's estimate), so the whole slip stays calc: false.
 *  - Multiple choice kept where it tests recognition: L4 which number is irrational, L5 perfect square / cube,
 *    L7 which is not a real number, L8 integer but not whole.
 *  - L3 Q1 keeps his half-finished factor tree as a picture; the answer is typed (the tree widget can't be used in tests). */
(function (root) {
  'use strict';
  var HW = root.HW, nt = HW.nt, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    // Lessons 1 and 8 — integers
    'u1x-sub-neg': 'Subtracted instead of adding the opposite', 'u1x-sign-near': 'Kept the sign of the number closer to zero',
    'u1x-neg-sq': 'Treated −a² as (−a)²', 'u1x-sq-neg': 'Squared a negative and got a negative', 'u1x-sq-double': 'Multiplied by 2 instead of squaring',
    'u1x-left-right': 'Worked left to right instead of following BEDMAS', 'u1x-sub-sign': 'Sign slip subtracting a negative product',
    'u1x-mult-first': 'Multiplied before doing the exponent', 'u1x-div-sign': 'Sign slip in the division',
    // Lesson 2 — fractions
    'u1x-fr-across': 'Subtracted tops and bottoms straight across', 'u1x-fr-numer': 'Changed the denominators but not the numerators',
    'u1x-fr-mult': 'Multiplied instead of subtracting', 'u1x-fr-add': 'Added instead of subtracting (or the reverse)',
    'u1x-div-noflip': 'Multiplied without flipping the second fraction', 'u1x-div-flip1': 'Flipped the first fraction instead of the second',
    'u1x-div-flipboth': 'Flipped both fractions', 'u1x-dec-tenths': 'Used tenths instead of hundredths', 'u1x-red-top': 'Divided only the numerator',
    'u1x-fr-lr': 'Worked left to right instead of multiplying first',
    // Lesson 3 — primes, GCF, LCM
    'u1x-composite': 'Left a composite number in a product of primes', 'u1x-prime-missing': 'Product of primes is missing a factor',
    'u1x-prime-extra': 'Product of primes has an extra factor', 'u1x-lead': 'Product of primes for a different number', 'u1x-self': 'Wrote a composite number as its own factorization',
    'u1x-nothing': 'No prime factors given', 'u1x-gcf-lcm': 'Gave the LCM instead of the GCF', 'u1x-gcf-product': 'Multiplied the numbers for the GCF',
    'u1x-gcf-small': 'A common factor, but not the greatest', 'u1x-gcf-notcommon': 'Not a common factor', 'u1x-lcm-gcf': 'Gave the GCF instead of the LCM',
    'u1x-lcm-product': 'Multiplied the numbers for the LCM', 'u1x-lcm-big': 'A common multiple, but not the least', 'u1x-lcm-notmult': 'Not a common multiple',
    'u1x-lcm-sum': 'Added the two numbers', 'u1x-group-total': 'Gave a total instead of the amount in each group', 'u1x-count-swap': 'Swapped the two amounts',
    // Lesson 4 — the real numbers
    'u1x-cond': 'Number doesn’t meet the description', 'u1x-cond-range': 'Right kind of number, outside the range',
    // Lesson 5 — roots and estimating
    'u1x-est-div': 'Divided by 10 instead of taking the square root', 'u1x-est-trap': 'Root placed between the wrong whole numbers',
    'u1x-est-near': 'Right whole numbers, but closer to the wrong one', 'u1x-cube-sq': 'Used the square root instead of the cube root',
    'u1x-root-div': 'Divided by the index instead of taking the root', 'u1x-est-power': 'Gave the perfect cube instead of its root',
    'u1x-bracket': 'Not the two whole numbers around the root', 'u1x-face-surface': 'Gave the area of all six faces', 'u1x-face-perim': 'Gave the perimeter of a face, not its area',
    'u1x-face-double': 'Doubled the edge instead of squaring it', 'u1x-sq-half': 'Halved the area instead of taking its square root', 'u1x-sq-perim': 'Perimeter: not four sides',
    'u1x-rect-sum': 'Added the rectangle’s sides instead of multiplying',
    // Lessons 6–8 — radicals
    'u1x-given': 'Gave back the number or expression from the question (no work)', 'u1x-power-index': 'Squared the number in front instead of raising it to the index',
    'u1x-sq-both': 'Squared the radicand as well as the number in front', 'u1x-swap-km': 'Swapped the number in front and the radicand',
    'u1x-sq-not-cube': 'Pulled out a perfect square instead of a perfect cube'
  });
  HW.addPartial({
    'u1x-sub-neg': 'n', 'u1x-sign-near': 's', 'u1x-neg-sq': 'b', 'u1x-sq-neg': 'b', 'u1x-sq-double': 'n', 'u1x-left-right': 'n', 'u1x-sub-sign': 's',
    'u1x-mult-first': 'b', 'u1x-div-sign': 's',
    'u1x-fr-across': 'n', 'u1x-fr-numer': 'b', 'u1x-fr-mult': 'n', 'u1x-fr-add': 's', 'u1x-div-noflip': 'n', 'u1x-div-flip1': 'b', 'u1x-div-flipboth': 'n',
    'u1x-dec-tenths': 'b', 'u1x-red-top': 'b', 'u1x-fr-lr': 'n',
    'u1x-composite': 'b', 'u1x-prime-missing': 's', 'u1x-prime-extra': 's', 'u1x-lead': 'n', 'u1x-self': 'n', 'u1x-nothing': 'n', 'u1x-gcf-lcm': 'n', 'u1x-gcf-product': 'n',
    'u1x-gcf-small': 'b', 'u1x-gcf-notcommon': 'n', 'u1x-lcm-gcf': 'n', 'u1x-lcm-product': 'b', 'u1x-lcm-big': 'b', 'u1x-lcm-notmult': 'n', 'u1x-lcm-sum': 'n',
    'u1x-group-total': 'n', 'u1x-count-swap': 's',
    'u1x-cond': 'n', 'u1x-cond-range': 'b',
    'u1x-est-div': 'n', 'u1x-est-trap': 'b', 'u1x-est-near': 's', 'u1x-cube-sq': 'n', 'u1x-root-div': 'n', 'u1x-est-power': 'n', 'u1x-bracket': 'n',
    'u1x-face-surface': 'b', 'u1x-face-perim': 'n', 'u1x-face-double': 'n', 'u1x-sq-half': 'n', 'u1x-sq-perim': 'b', 'u1x-rect-sum': 'n',
    'u1x-given': 'n', 'u1x-power-index': 'b', 'u1x-sq-both': 'b', 'u1x-swap-km': 'b', 'u1x-sq-not-cube': 'n'
  });

  /* ---------- number helpers ---------- */
  function gcd(a, b) { return ex.gcd(Math.abs(a), Math.abs(b)); }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function prodOf(a) { return a.reduce(function (m, x) { return m * x; }, 1); }
  function sortN(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function plainFac(n) { return nt.factor(n).map(function (pe) { return pe[1] > 1 ? pe[0] + '^' + pe[1] : String(pe[0]); }).join(' × '); }
  function facEq(n) { return nt.isPrime(n) ? t(F(n)) + ' (prime)' : t(F(n) + '=' + K.fac(n)); }
  function find(gen, test, fallback) { for (var i = 0; i < 1500; i++) { var v = gen(); if (v != null && test(v)) return v; } return fallback; }
  function isPow(v, n) { if (v < 0) return false; var c = Math.round(Math.pow(v, 1 / n)); for (var d = Math.max(0, c - 1); d <= c + 1; d++) if (Math.pow(d, n) === v) return true; return false; }
  function rad(k, n, m) { return ex.texRadical([k, 1], n, m); }
  function rt(n, inner) { return ex.texRoot(n, inner); }
  function rootWord(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n === 4 ? 'fourth' : n === 5 ? 'fifth' : n + 'th'; }
  function powWord(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n === 4 ? 'fourth power' : n === 5 ? 'fifth power' : n + 'th power'; }
  function powList(n) { return n === 2 ? '4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, …' : n === 3 ? '8, 27, 64, 125, 216, …' : n === 4 ? '16, 81, 256, …' : '32, 243, …'; }
  function normX(s) { return String(s == null ? '' : s).replace(/(\d)\s*[xX]\s*(?=\d)/g, '$1*'); }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function frT(p, q) { return ex.texRat(ex.norm(p, q)); }
  function fr(p, q) { return ex.norm(p, q); }
  function sameV(a, b) { return Math.abs(a - b) < 1e-9; }
  var NAMES = ['Mia', 'Sam', 'Ava', 'Noah', 'Leah', 'Omar', 'Priya', 'Ethan', 'Jordan', 'Zoe'];

  /* ---------- checkers ---------- */
  /* rename a checker's wrong-answer codes (shared codes → this file's labelled ones) */
  function rc(check, map) { return function (resp) { var res = check(resp); if (res && res.v === 'wrong' && map[res.code]) return { v: 'wrong', code: map[res.code], hint: res.hint }; return res; }; }
  var PROD_MAP = { composite: 'u1x-composite', missing: 'u1x-prime-missing', extra: 'u1x-prime-extra', lead: 'u1x-lead', self: 'u1x-self', nothing: 'u1x-nothing' };
  /* n as a product of primes (exp: 'either' | 'required'); the bare number n is "no work" */
  function prodChk(n, exp) {
    var c = rc(K.product(n, exp || 'either'), PROD_MAP);
    return function (resp) {
      var s = normX(resp), pn = HW.parse.number(s);
      if (pn.ok && pn.value === n && !nt.isPrime(n)) return wrong('u1x-given', 'That’s the number you were given. Write it as a product of prime factors' + (exp === 'required' ? ' in exponent form' : '') + ', like ' + t('2^{3}\\times 3^{2}') + '.');
      return c(s);
    };
  }
  /* one whole number; alts = [{ v, code, hint }] for known wrong values (checked before extra(v)) */
  function numChk(n, alts, extra) {
    return K.number(n, function (v) {
      for (var i = 0; i < (alts || []).length; i++) if (sameV(v, alts[i].v) && !sameV(v, n)) return { code: alts[i].code, hint: alts[i].hint };
      return extra ? extra(v) : null;
    });
  }
  /* a whole number, typed as a number or as a product equal to it */
  function numProd(target, diag) {
    var base = K.number(target, diag);
    return function (resp) {
      var s = normX(resp), pn = HW.parse.number(s);
      if (!pn.ok) { var pp = HW.parse.product(s); if (pp.ok) { if (pp.value === target) return ok(); var h = diag ? diag(pp.value) : null; return h ? wrong(h.code, h.hint) : wrong('value', null); } }
      return base(resp);
    };
  }
  function gcfDiag(nums) {
    var g = nums.reduce(gcd), L = nums.reduce(lcm), pr = prodOf(nums), mn = Math.min.apply(null, nums);
    return function (v) {
      if (v === L && L !== g) return { code: 'u1x-gcf-lcm', hint: 'That’s the <b>least common multiple</b>. The GCF divides <b>into</b> every number, so it can’t be bigger than ' + t(F(mn)) + '.' };
      if (v === pr && pr !== g) return { code: 'u1x-gcf-product', hint: 'Multiplying the numbers gives a common <b>multiple</b>, not a common factor.' };
      if (!(v > 0) || v % 1) return null;
      var miss = nums.filter(function (n) { return n % v; });
      if (!miss.length) return { code: 'u1x-gcf-small', hint: t(F(v)) + ' divides into every number, but it isn’t the <b>greatest</b> common factor. Use every shared prime, to its lowest power.' };
      return { code: 'u1x-gcf-notcommon', hint: t(F(v)) + ' doesn’t divide evenly into ' + t(F(miss[0])) + ', so it isn’t a common factor.' };
    };
  }
  function lcmDiag(nums) {
    var g = nums.reduce(gcd), L = nums.reduce(lcm), pr = prodOf(nums), mx = Math.max.apply(null, nums), sm = nums.reduce(function (a, b) { return a + b; }, 0);
    return function (v) {
      if (v === g && g !== L) return { code: 'u1x-lcm-gcf', hint: 'That’s the <b>greatest common factor</b>. Things that repeat line up again at a common <b>multiple</b>: every number divides into it, so it is at least ' + t(F(mx)) + '.' };
      if (v === sm && sm !== L) return { code: 'u1x-lcm-sum', hint: 'Adding the two numbers doesn’t give a common multiple. List the multiples of ' + t(F(mx)) + ' until you reach one that ' + t(F(Math.min.apply(null, nums))) + ' also divides into.' };
      if (v === pr && pr !== L) return { code: 'u1x-lcm-product', hint: 'Multiplying the numbers gives <i>a</i> common multiple, but not the <b>lowest</b> one. Use each prime once, at its highest power.' };
      if (!(v > 0) || v % 1) return null;
      var miss = nums.filter(function (n) { return v % n; });
      if (!miss.length) return { code: 'u1x-lcm-big', hint: t(F(v)) + ' is a common multiple, but not the <b>lowest</b> one. Use each prime once, at its highest power.' };
      return { code: 'u1x-lcm-notmult', hint: t(F(miss[0])) + ' doesn’t divide evenly into ' + t(F(v)) + ', so it isn’t a common multiple.' };
    };
  }
  /* fraction answer: known wrong values [[p, q, code, hint]] */
  function fracDiag(list) {
    return function (v) { for (var i = 0; i < list.length; i++) if (list[i][1] !== 0 && ex.eq(v, list[i][0] / list[i][1])) return { code: list[i][2], hint: list[i][3] }; return null; };
  }
  /* the question's own number or expression typed back is "right value, wrong form" to a checker: no work was done, so
     mark it wrong (no credit). Compared by structure, ignoring brackets and \frac vs / */
  function nast(a) { if (!a || typeof a !== 'object') return a; if (a.t === 'paren') return nast(a.a); var o = {}; Object.keys(a).sort().forEach(function (k) { if (k !== 'frac' && k !== 'imp' && k !== 's' && k !== 'dec') o[k] = nast(a[k]); }); return o; }
  function sig(tex) { var p = ex.parse(String(tex == null ? '' : tex)); return p.ok ? JSON.stringify(nast(p.ast)) : null; }
  function guard(chk, givens, hint) {
    var gs = givens.map(sig).filter(Boolean);
    return function (resp) {
      var res = chk(resp);
      if (res && res.v === 'form' && typeof resp === 'string') { var s = sig(resp); if (s && gs.indexOf(s) >= 0) return wrong('u1x-given', hint || 'That is what the question gave you. Work it out and write it in the form asked for.'); }
      return res;
    };
  }
  /* multiple choice without duplicate options */
  function mc(r, prompt, opts, sol, hints, text, keep) {
    var seen = {}, o2 = opts.filter(function (o) { if (seen[o.html]) return false; seen[o.html] = 1; return true; });
    return P.mc(r, prompt, o2, sol, hints, text, keep);
  }

  /* ---------- radicals ---------- */
  function radPool(n, kr, lo, hi, mMax) { var o = []; for (var k = kr[0]; k <= kr[1]; k++) for (var m = 2; m <= (mMax || 15); m++) { var N = Math.pow(k, n) * m; if (ex.simplest(m, n) && N >= lo && N <= hi) o.push([k, m]); } return o; }
  /* k·ⁿ√m (k may be negative for an odd index: the radicand is then negative) → mixed radical */
  function mixedSol(k, n, m) {
    var a = Math.abs(k), big = Math.pow(a, n), s = k < 0 ? '-' : '';
    return t(rt(n, s + F(big * m)) + '=' + rt(n, s + big + '\\times ' + m) + '=' + rt(n, s + big) + '\\times ' + rt(n, m) + '=' + rad(k, n, m)) +
      (n > 2 ? ' (' + t((k < 0 ? '(' + k + ')' : a) + '^{' + n + '}=' + s + big) + ')' : '') + '. ' + t(m) + ' has no perfect ' + powWord(n) + ' factor left, so this is simplest form.';
  }
  function mixedPart(k, n, m, prompt, text) {
    var a = Math.abs(k), N = Math.pow(a, n) * m, s = k < 0 ? '-' : '', given = rt(n, s + F(N));
    var p = P.radical(prompt || 'Write ' + t(given) + ' as a mixed radical in simplest form.', { k: k, n: n, m: m }, 'mixed', mixedSol(k, n, m),
      ['Find the <b>largest</b> perfect ' + powWord(n) + ' that divides ' + t(F(N)) + ' (' + powList(n) + ').', 'Its ' + rootWord(n) + ' root comes out in front of the radical' + (k < 0 ? '; an odd root of a negative is negative.' : '; what is left stays inside.')], text || 'mixed radical: ' + rootWord(n) + ' root of ' + s + N,
      { diag: function (val, rr) {
        if (!rr || rr.k[1] !== 1) return null;
        var rk = Math.abs(rr.k[0]);
        if (rr.n === n && rk === m && rr.m === a && m !== a) return { code: 'u1x-swap-km', hint: 'The ' + rootWord(n) + ' root of ' + t(F(Math.pow(a, n))) + ' (that is ' + t(a) + ') comes out in front, and the ' + t(m) + ' stays inside the radical.' };
        if (n === 3 && rr.n === 3 && rk >= 2 && N % (rk * rk) === 0 && rr.m === N / (rk * rk) && rr.m !== m) return { code: 'u1x-sq-not-cube', hint: 'A cube root needs a perfect <b>cube</b> factor. ' + t(rk * rk) + ' is a perfect square, not a cube. Look for 8, 27, 64, 125, … in ' + t(F(N)) + '.' };
        return null;
      } });
    p.check = guard(p.check, [given, rt(n, s + String(N))]);
    var sm = []; for (var d = 2; d < a; d++) if (a % d === 0) sm.push(d); // a smaller perfect power that also divides
    p.bad = [s + Math.pow(a, n) + rt(n, String(m)), given];
    if (sm.length) p.bad.push(s + sm[0] + rt(n, String(N / Math.pow(sm[0], n))));
    if (m !== a) p.bad.push(s + m + rt(n, String(a)));
    return p;
  }
  function entireSol(k, n, m) {
    var a = Math.abs(k), neg = k < 0;
    return t(rad(k, n, m) + '=' + rt(n, (neg ? '(-' + a + ')' : a) + '^{' + n + '}\\times ' + m) + '=' + rt(n, (neg ? '-' : '') + Math.pow(a, n) + '\\times ' + m) + '=' + rt(n, (neg ? '-' : '') + F(Math.pow(a, n) * m))) + '.' +
      (n === 3 ? ' With index ' + t('3') + ', the number in front is <b>cubed</b>' + (neg ? ', and a negative cubed stays negative.' : '.') : n === 2 ? ' The number in front is <b>squared</b> as it moves inside; the ' + t(m) + ' is already inside.' : '');
  }
  function entirePart(k, n, m, prompt) {
    var a = Math.abs(k), s = k < 0 ? '-' : '';
    var p = P.radical(prompt || 'Write ' + t(rad(k, n, m)) + ' as an entire radical.', { k: k, n: n, m: m }, 'entire', entireSol(k, n, m),
      ['Write the number in front as a ' + rootWord(n) + ' root: ' + t(a + '=' + rt(n, Math.pow(a, n))) + (k < 0 ? ', and ' + t('-' + a + '=' + rt(n, '-' + Math.pow(a, n))) : '') + '.', 'Then multiply the numbers under one radical.'], 'entire radical: ' + k + ' root' + n + ' of ' + m,
      { diag: function (val, rr) {
        if (!rr || rr.n !== n || Math.abs(rr.k[0]) !== 1 || rr.k[1] !== 1) return null;
        if (n > 2 && rr.m === a * a * m) return { code: 'u1x-power-index', hint: 'With index ' + t(n) + ', the number in front must be <b>cubed</b> (not squared) before it moves inside: ' + t(a + '=' + rt(n, Math.pow(a, n))) + '.' };
        if (n === 2 && rr.m === a * a * m * m) return { code: 'u1x-sq-both', hint: 'Only the number in front gets squared; the ' + t(m) + ' is already under the root. ' + t(a + '^{2}\\times ' + m + '=' + a * a * m) + '.' };
        return null;
      } });
    if (k < 0 && n % 2) { // an odd index takes the negative inside: −ⁿ√(…) still has something outside the root
      var c0 = p.check, inside = rt(n, '-' + F(Math.pow(a, n) * m));
      p.check = function (resp) {
        var res = c0(resp); if (!res || res.v !== 'correct') return res;
        if (/^\s*(-|−|\\left\(\s*-|\(\s*-)/.test(String(resp == null ? '' : resp)) && !/^\s*-?\s*\\sqrt\[\d+\]\{\s*-/.test(String(resp))) return form('not-entire', 'Your value is right, but an entire radical has nothing outside the root. The index ' + t(n) + ' is odd, so the negative can go inside: ' + t(inside) + '.');
        return res;
      };
    }
    p.check = guard(p.check, [rad(k, n, m)]);
    p.bad = [rt(n, s + String(a * m)), rt(n, s + String(Math.pow(a, n) + m))];
    if (n > 2) p.bad.push(rt(n, String(a * a * m)));
    if (n === 2) p.bad.push(rt(n, String(a * a * m * m)));
    if (k < 0 && n % 2) p.bad.push(rt(n, String(Math.pow(a, n) * m)), '-' + rt(n, String(Math.pow(a, n) * m)));
    return p;
  }

  /* ---------- figures ---------- */
  var FONT = 'font-family="KaTeX_Main,\'Times New Roman\',serif"', INK = '#1e2d46';
  /* Ryan's half-finished factor tree: root N, left leaf L (composite), right node R = p × C with leaves p (prime) and C (composite) */
  function treeSvg(N, L, R, p, C) {
    function ln(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + INK + '" stroke-width="1.6"/>'; }
    function tx(x, y, s) { return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="19" text-anchor="middle" fill="' + INK + '">' + s + '</text>'; }
    var s = ln(118, 30, 88, 58) + ln(142, 30, 172, 58) + ln(172, 82, 150, 108) + ln(188, 82, 210, 108) +
      tx(130, 24, N) + tx(80, 76, L) + tx(180, 76, R) + tx(145, 128, p) + tx(215, 128, C);
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 260 140" style="max-width:260px" role="img" aria-label="an unfinished factor tree: ' + N + ' splits into ' + L + ' and ' + R + ', and ' + R + ' splits into ' + p + ' and ' + C + '">' + s + '</svg></div>';
  }
  /* a square with its area written inside and its side marked s */
  function squareSvg(A, unit) {
    var s = '<rect x="40" y="14" width="120" height="120" fill="#e3ecf8" stroke="' + INK + '" stroke-width="2"/>' +
      '<text x="100" y="80" ' + FONT + ' font-size="17" text-anchor="middle" fill="' + INK + '">A = ' + A + ' ' + unit + '²</text>' +
      '<text x="100" y="154" ' + FONT + ' font-size="18" font-style="italic" text-anchor="middle" fill="#c0392b">s</text>' +
      '<text x="26" y="80" ' + FONT + ' font-size="18" font-style="italic" text-anchor="middle" fill="#c0392b">s</text>';
    return '<div class="fig"><svg class="fig-svg" viewBox="0 0 200 162" style="max-width:200px" role="img" aria-label="a square with area ' + A + ' square ' + unit + ' and side length s">' + s + '</svg></div>';
  }
  /* numbers on a number line (worked solutions) */
  function lineFig(items, lo, hi) {
    var D = HW.draw, vals = {}; items.forEach(function (x) { vals[x.id] = Math.round(x.v * 100) / 100; });
    return '<div class="fig">' + D.numplaceSvg({ min: lo, max: hi, step: 1, labels: 1, items: items.map(function (x) { return { id: x.id, tex: x.tex }; }) }, vals).svg + '</div>';
  }

  /* ---------- reading a typed real number exactly (Lesson 4 Mastery) ---------- */
  function swapPi(a) {
    if (!a || typeof a !== 'object') return a;
    if (a.t === 'pi') return { t: 'var', n: '#pi' };
    var o = {}; Object.keys(a).forEach(function (k) { o[k] = (k === 'a' || k === 'b' || k === 'n') ? swapPi(a[k]) : a[k]; }); return o;
  }
  function readReal(resp) {
    var a = K.read(resp); if (a.res) return a;
    var sh = ex.shape(a.ast), vars = Object.keys(sh.vars);
    if (vars.some(function (v) { return v !== 'e'; })) return { res: form('variable', 'Give a number — no letters other than ' + t('\\pi') + '.') };
    if (sh.ell) return { res: form('dots-exact', 'A decimal ending in “…” could be anything. Give an exact number, like ' + t('\\frac{3}{7}') + ' or ' + t('\\sqrt{2}') + '.') };
    var b = swapPi(a.ast), v1 = ex.value(b, { '#pi': Math.PI, e: Math.E }), v2 = ex.value(b, { '#pi': 3.3, e: 2.9 });
    if (!isFinite(v1)) return { res: wrong('u1x-cond', 'That isn’t a real number (for example, the square root of a negative number).') };
    if ((vars.length || sh.pi) && Math.abs(v1 - v2) > 1e-9) return { v: v1, rational: false, roots: !!sh.roots };
    var r = ex.rat(a.ast); if (r) return { v: r[0] / r[1], rational: true, p: r[0], q: r[1], roots: !!sh.roots };
    for (var q = 1; q <= 1000; q++) { var p = Math.round(v1 * q); if (Math.abs(v1 * q - p) < 1e-13 * q * Math.max(1, Math.abs(v1))) { var g = gcd(Math.abs(p), q) || 1; return { v: p / q, rational: true, p: p / g, q: q / g, roots: !!sh.roots }; } }
    return { v: v1, rational: false, roots: !!sh.roots };
  }
  function findChk(c) { return function (resp) { var o = readReal(resp); if (o.res) return o.res; var h = c.test(o); return h ? wrong(h.code, h.hint) : ok(); }; }

  /* ===================================================================================================================
   * Lesson 1 — Review: Integer Operations and Order of Operations (REV: Grade 9 review)
   * =================================================================================================================== */
  HW.defineExit({
    lesson: 'u1l1', calc: false, outcome: 'REV',
    blurb: 'Grade 9 review: subtracting a negative, −a² compared with (−a)², and the order of operations with integers.',
    questions: [
      { num: '1', outcome: 'REV', stem: '', parts: [
        { id: '1', outcome: 'REV', level: 'BEG', make: function (r) {
          var v = find(function () { var a = r.int(3, 12), b = r.chance(0.75) ? r.int(a + 2, 20) : r.int(2, a - 2); return b >= 2 ? { a: a, b: b } : null; }, function (v) { return v.a !== v.b; }, { a: 8, b: 12 });
          var a = v.a, b = v.b, ans = b - a, far = b > a ? b : -a;
          var p = P.number('Evaluate ' + t('-' + a + '-(-' + b + ')') + '.', ans, function (x) {
            if (x === -a - b) return { code: 'u1x-sub-neg', hint: 'Subtracting a negative means <b>adding the opposite</b>: ' + t('-' + a + '-(-' + b + ')=-' + a + '+' + b) + '.' };
            if (x === -ans && ans !== 0) return { code: 'u1x-sign-near', hint: 'You rewrote it as ' + t('-' + a + '+' + b) + '? With different signs, keep the sign of the number <b>farther from zero</b>: that is ' + t(far) + '.' };
            return null;
          },
            'Subtracting a negative is adding the opposite: ' + t('-' + a + '-(-' + b + ')=-' + a + '+' + b) + '.<br>The signs differ, so subtract the sizes: ' + t(Math.max(a, b) + '-' + Math.min(a, b) + '=' + Math.abs(ans)) + ', and keep the sign of ' + t(far) + ' (farther from zero): ' + t(ans) + '.',
            ['Subtracting a negative is the same as adding its opposite: rewrite ' + t('-(-' + b + ')') + ' as ' + t('+' + b) + '.', 'With different signs, subtract the sizes and keep the sign of the number farther from zero.'], 'integers: -' + a + '-(-' + b + ')');
          p.bad = [String(-a - b), String(-ans)].filter(function (x) { return x !== String(ans); });
          return p;
        } }] },
      { num: '2', outcome: 'REV', stem: '', parts: [
        { id: '2', outcome: 'REV', level: 'PRG', make: function (r) {
          var a = r.int(2, 9), b = r.chance(0.3) ? a : r.int(2, 9), ans = -a * a + b * b;
          var p = P.number('Evaluate ' + t('-' + a + '^{2}+(-' + b + ')^{2}') + '.', ans, function (x) {
            if (x === a * a + b * b) return { code: 'u1x-neg-sq', hint: 'With no brackets, the exponent is only on the ' + t(a) + ': ' + t('-' + a + '^{2}=-(' + a + '\\times ' + a + ')=-' + a * a) + '.' };
            if (x === -a * a - b * b) return { code: 'u1x-sq-neg', hint: 'Brackets put the negative inside the power: ' + t('(-' + b + ')^{2}=(-' + b + ')\\times(-' + b + ')=' + b * b) + ' — two negatives make a positive.' };
            if (x === -2 * a - 2 * b || x === -2 * a + 2 * b) return { code: 'u1x-sq-double', hint: 'The exponent ' + t('2') + ' means multiply the number by <b>itself</b>, not by 2: ' + t(a + '^{2}=' + a + '\\times ' + a) + '.' };
            return null;
          },
            'No brackets: ' + t('-' + a + '^{2}=-(' + a + '\\times ' + a + ')=-' + a * a) + '.<br>Brackets: ' + t('(-' + b + ')^{2}=(-' + b + ')\\times(-' + b + ')=' + b * b) + '.<br>So ' + t('-' + a * a + '+' + b * b + '=' + ans) + '.',
            ['Without brackets the exponent belongs only to the number: ' + t('-3^{2}=-9') + '. With brackets the negative is squared too: ' + t('(-3)^{2}=9') + '.'], 'integers: -a^2+(-b)^2');
          p.bad = [String(a * a + b * b), String(-a * a - b * b), String(-2 * a - 2 * b)].filter(function (x) { return x !== String(ans); });
          return p;
        } }] },
      { num: '3', outcome: 'REV', stem: '', parts: [
        { id: '3', outcome: 'REV', level: 'PRG', make: function (r) {
          var a = -r.int(3, 12), b = r.int(2, 5), c = r.int(2, 6), ans = a + b * c, lr = (a - b) * -c;
          var p = P.number('Evaluate ' + t(a + '-' + b + '\\times(-' + c + ')') + '.', ans, function (x) {
            if (x === lr) return { code: 'u1x-left-right', hint: 'Follow BEDMAS: <b>multiply first</b>, even though the subtraction is read first. ' + t(b + '\\times(-' + c + ')=-' + b * c) + '.' };
            if (x === a - b * c) return { code: 'u1x-sub-sign', hint: 'Good — you multiplied first: ' + t(b + '\\times(-' + c + ')=-' + b * c) + '. Now subtracting ' + t('-' + b * c) + ' means adding ' + t(b * c) + '.' };
            return null;
          },
            'Multiply first: ' + t(b + '\\times(-' + c + ')=-' + b * c) + '.<br>Then ' + t(a + '-(-' + b * c + ')=' + a + '+' + b * c + '=' + ans) + '.',
            ['BEDMAS: multiplication comes before subtraction.', 'Subtracting a negative is adding the opposite.'], 'BEDMAS: a - b(-c)');
          p.bad = [String(lr), String(a - b * c)].filter(function (x) { return x !== String(ans); });
          return p;
        } }] },
      // added Mastery question (Example 5b): brackets, exponent, multiply and divide, then add
      { num: '4', outcome: 'REV', stem: '', parts: [
        { id: '4', outcome: 'REV', level: 'MAS', make: function (r) {
          var v = find(function () { var p = r.pick([-4, -3, -2, 2, 3]), d = -r.int(2, 4), q = r.int(1, 8), qt = -r.int(2, 6), dv = r.int(2, 5); return { p: p, d: d, q: q, s: q - d, qt: qt, dv: dv, u: qt * dv }; },
            function (v) { var ans = v.p * v.d * v.d + v.qt; return ans !== 0 && [v.p * -v.d * v.d + v.qt, v.p * v.p * v.d * v.d + v.qt, v.p * 2 * v.d + v.qt, v.p * v.d * v.d - v.qt].every(function (x) { return x !== ans; }); }, { p: -2, d: -3, q: 5, s: 8, qt: -2, dv: 3, u: -6 });
          var ans = v.p * v.d * v.d + v.qt, ex1 = v.p + '\\times(' + v.q + '-' + v.s + ')^{2}+(' + v.u + ')\\div ' + v.dv;
          var B = { sq: v.p * -v.d * v.d + v.qt, mf: v.p * v.p * v.d * v.d + v.qt, dbl: v.p * 2 * v.d + v.qt, ds: v.p * v.d * v.d - v.qt };
          var p = P.number('Evaluate ' + t(ex1) + '. Show each step in order on paper.', ans, function (x) {
            if (x === B.sq) return { code: 'u1x-sq-neg', hint: t('(' + v.d + ')^{2}=(' + v.d + ')\\times(' + v.d + ')=+' + v.d * v.d) + ': a negative times a negative is positive.' };
            if (x === B.mf) return { code: 'u1x-mult-first', hint: 'The exponent belongs only to the bracket, so square ' + t('(' + v.d + ')') + ' <b>before</b> you multiply by ' + t(v.p) + '.' };
            if (x === B.dbl) return { code: 'u1x-sq-double', hint: t('(' + v.d + ')^{2}') + ' means ' + t('(' + v.d + ')\\times(' + v.d + ')') + ', not ' + t('(' + v.d + ')\\times 2') + '.' };
            if (x === B.ds) return { code: 'u1x-div-sign', hint: 'Check the division: ' + t('(' + v.u + ')\\div ' + v.dv + '=' + v.qt) + ' (different signs give a negative).' };
            return null;
          },
            'Brackets: ' + t(v.q + '-' + v.s + '=' + v.d) + '.<br>Exponent: ' + t('(' + v.d + ')^{2}=' + v.d * v.d) + '.<br>Multiply and divide, left to right: ' + t(v.p + '\\times ' + v.d * v.d + '=' + v.p * v.d * v.d) + ' and ' + t('(' + v.u + ')\\div ' + v.dv + '=' + v.qt) + '.<br>Add: ' + t(v.p * v.d * v.d + '+(' + v.qt + ')=' + ans) + '.',
            ['BEDMAS: brackets, then the exponent, then multiply and divide, then add.', 'A negative number squared is positive.'], 'BEDMAS: p(q-s)^2 + u/v');
          p.bad = [String(B.sq), String(B.mf), String(B.dbl), String(B.ds)];
          return p;
        } }] }
    ]
  });

  /* ===================================================================================================================
   * Lesson 2 — Review: Operations with Fractions and Decimals (REV)
   * =================================================================================================================== */
  HW.defineExit({
    lesson: 'u1l2', calc: false, outcome: 'REV',
    blurb: 'Grade 9 review: subtracting and dividing fractions, a decimal as a fraction, and the order of operations with fractions.',
    questions: [
      { num: '1', outcome: 'REV', stem: '', parts: [
        { id: '1', outcome: 'REV', level: 'PRG', make: function (r) {
          var v = find(function () { var b = r.pick([3, 4, 5, 6, 8, 10]), d = r.pick([2, 3, 4, 5, 6, 8]); if (b === d) return null; return { a: r.int(1, b - 1), b: b, c: r.int(1, d - 1), d: d }; }, function (v) {
            if (gcd(v.a, v.b) !== 1 || gcd(v.c, v.d) !== 1 || v.a * v.d <= v.c * v.b || lcm(v.b, v.d) > 24) return false;
            var L = lcm(v.b, v.d), ans = (v.a * L / v.b - v.c * L / v.d) / L, bads = [(v.a - v.c) / (v.b - v.d), (v.a - v.c) / L, v.a * v.c / (v.b * v.d), (v.a * L / v.b + v.c * L / v.d) / L];
            return bads.every(function (x, i) { return !sameV(x, ans) && bads.every(function (y, j) { return i === j || !sameV(x, y); }); });
          }, { a: 3, b: 5, c: 1, d: 4 });
          var a = v.a, b = v.b, c = v.c, d = v.d, L = lcm(b, d), A = a * L / b, C = c * L / d, ans = fr(A - C, L);
          var q = '\\frac{' + a + '}{' + b + '}-\\frac{' + c + '}{' + d + '}';
          var p = P.fraction('Evaluate ' + t(q.replace(/\\frac/g, '\\dfrac')) + '. Give your answer as a fraction in lowest terms.', ans, { diag: fracDiag([
            [a - c, b - d, 'u1x-fr-across', 'Fractions need a <b>common denominator</b> before you subtract. The LCD of ' + t(b) + ' and ' + t(d) + ' is ' + t(L) + '. Then subtract only the numerators.'],
            [a - c, L, 'u1x-fr-numer', 'When ' + t(b) + ' becomes ' + t(L) + ' you multiply by ' + t(L / b) + ', so the numerator ' + t(a) + ' must be multiplied by ' + t(L / b) + ' too: ' + t('\\frac{' + a + '}{' + b + '}=\\frac{' + A + '}{' + L + '}') + '.'],
            [a * c, b * d, 'u1x-fr-mult', 'That is the product ' + t('\\frac{' + a + '}{' + b + '}\\times\\frac{' + c + '}{' + d + '}') + '. To subtract, rewrite both fractions over the LCD ' + t(L) + '.'],
            [A + C, L, 'u1x-fr-add', 'Your common denominator is right, but this is a <b>subtraction</b>: ' + t(A + '-' + C) + '.']]) },
            'The LCD of ' + t(b) + ' and ' + t(d) + ' is ' + t(L) + ': ' + [[a, b, A], [c, d, C]].filter(function (x) { return x[1] !== L; }).map(function (x) { return t('\\frac{' + x[0] + '}{' + x[1] + '}=\\frac{' + x[2] + '}{' + L + '}'); }).join(' and ') + '.<br>' +
              t('\\frac{' + A + '}{' + L + '}-\\frac{' + C + '}{' + L + '}=\\frac{' + (A - C) + '}{' + L + '}' + (gcd(A - C, L) > 1 ? '=' + ex.texRat(ans) : '')) + (gcd(A - C, L) > 1 ? ' (divide the top and bottom by ' + t(gcd(A - C, L)) + ').' : '.'),
            ['Find the lowest common denominator, and rewrite <b>both</b> fractions with it (multiply the top and bottom by the same number).', 'Subtract the numerators only, then reduce.'], 'fractions: a/b - c/d');
          p.check = guard(p.check, [q]);
          p.bad = [frT(a - c, b - d), frT(a - c, L), frT(a * c, b * d), frT(A + C, L)].concat(gcd(A - C, L) > 1 ? [(A - C) + '/' + L] : []).filter(function (x) { return x !== ex.texRat(ans) && x !== '0'; });
          return p;
        } }] },
      { num: '2', outcome: 'REV', stem: '', parts: [
        { id: '2', outcome: 'REV', level: 'PRG', make: function (r) {
          var v = find(function () { var b = r.int(3, 10), d = r.int(2, 9); return { a: r.int(1, b - 1), b: b, c: r.int(1, 9), d: d }; }, function (v) {
            if (gcd(v.a, v.b) !== 1 || gcd(v.c, v.d) !== 1 || v.c === v.d) return false;
            var N = v.a * v.d, D = v.b * v.c; if (N >= D || gcd(N, D) === 1) return false;
            var ans = N / D, bads = [v.a * v.c / (v.b * v.d), v.b * v.c / (v.a * v.d), v.b * v.d / (v.a * v.c)];
            return bads.every(function (x, i) { return !sameV(x, ans) && bads.every(function (y, j) { return i === j || !sameV(x, y); }); });
          }, { a: 3, b: 10, c: 4, d: 5 });
          var a = v.a, b = v.b, c = v.c, d = v.d, ans = fr(a * d, b * c), q = '\\frac{' + a + '}{' + b + '}\\div\\frac{' + c + '}{' + d + '}';
          var p = P.fraction('Evaluate ' + t(q.replace(/\\frac/g, '\\dfrac')) + '. Give your answer as a fraction in lowest terms.', ans, { diag: fracDiag([
            [a * c, b * d, 'u1x-div-noflip', 'To divide, multiply by the <b>reciprocal</b> of the second fraction: ' + t('\\frac{' + a + '}{' + b + '}\\times\\frac{' + d + '}{' + c + '}') + '.'],
            [b * c, a * d, 'u1x-div-flip1', 'Keep the first fraction and flip only the <b>second</b> one: ' + t('\\frac{' + a + '}{' + b + '}\\times\\frac{' + d + '}{' + c + '}') + '.'],
            [b * d, a * c, 'u1x-div-flipboth', 'Only the second fraction gets flipped. Keep ' + t('\\frac{' + a + '}{' + b + '}') + ' as it is.']]) },
            'Multiply by the reciprocal of the second fraction: ' + t(q + '=\\frac{' + a + '}{' + b + '}\\times\\frac{' + d + '}{' + c + '}=\\frac{' + a * d + '}{' + b * c + '}=' + ex.texRat(ans)) + ' (divide the top and bottom by ' + t(gcd(a * d, b * c)) + ').',
            ['Dividing by a fraction is the same as multiplying by its reciprocal (flip the second fraction).', 'Multiply straight across, then reduce.'], 'fractions: a/b ÷ c/d');
          p.check = guard(p.check, [q]);
          p.bad = [frT(a * c, b * d), frT(b * c, a * d), frT(b * d, a * c), (a * d) + '/' + (b * c)];
          return p;
        } }] },
      { num: '3', outcome: 'REV', stem: '', parts: [
        { id: '3', outcome: 'REV', level: 'BEG', make: function (r) {
          var n = find(function () { return r.int(11, 99); }, function (n) { return n % 10 !== 0 && gcd(n, 100) > 1; }, 45);
          var g = gcd(n, 100), ans = fr(n, 100), ds = '0.' + n;
          var p = P.fraction('Write ' + t(ds) + ' as a fraction in lowest terms.', ans, { diag: fracDiag([
            [n, 10, 'u1x-dec-tenths', 'The last digit is in the <b>hundredths</b> place, so the denominator is ' + t('100') + ': ' + t(ds + '=\\frac{' + n + '}{100}') + '.'],
            [n / g, 100, 'u1x-red-top', 'To reduce, divide the top <b>and</b> the bottom by the same number: ' + t('\\frac{' + n + '\\div ' + g + '}{100\\div ' + g + '}') + '.']]) },
            'The last digit is in the hundredths place: ' + t(ds + '=\\frac{' + n + '}{100}') + '. Divide the top and bottom by ' + t(g) + ': ' + t('\\frac{' + n + '}{100}=' + ex.texRat(ans)) + '.',
            ['The place value of the last digit is the denominator: hundredths → ' + t('100') + '.', 'Then divide the top and bottom by their greatest common factor.'], 'decimal to fraction 0.' + n);
          p.check = guard(p.check, [ds], 'That is the decimal you were given. Write it as a fraction in lowest terms.');
          p.bad = [n + '/10', frT(n / g, 100), n + '/100'];
          return p;
        } }] },
      // added Mastery question (Example 5a, assignment Q11): order of operations with fractions
      { num: '4', outcome: 'REV', stem: '', parts: [
        { id: '4', outcome: 'REV', level: 'MAS', make: function (r) {
          var v = find(function () {
            var x = [r.int(1, 5), r.pick([2, 3, 4, 5, 6])], y = [r.int(1, 4), r.pick([2, 3, 4, 5, 6])], z = [r.int(1, 5), r.pick([2, 3, 4, 5, 6])];
            return { x: x, y: y, z: z, plus: r.chance(0.3) };
          }, function (v) {
            if ([v.x, v.y, v.z].some(function (f) { return f[0] >= f[1] || gcd(f[0], f[1]) !== 1; })) return false;
            var X = v.x[0] / v.x[1], Y = v.y[0] / v.y[1], Z = v.z[0] / v.z[1], yz = fr(v.y[0] * v.z[0], v.y[1] * v.z[1]);
            var ans = v.plus ? X + Y * Z : X - Y * Z, lr = v.plus ? (X + Y) * Z : (X - Y) * Z, sw = v.plus ? X - Y * Z : X + Y * Z;
            if (!(ans > 0 && ans < 1) || lcm(v.x[1], yz[1]) > 30 || yz[1] === 1) return false;
            if (v.x[1] === v.y[1] && v.y[1] === v.z[1]) return false;
            return !sameV(lr, ans) && !sameV(sw, ans) && !sameV(lr, sw) && sw > 0;
          }, { x: [3, 4], y: [1, 3], z: [3, 5], plus: false });
          var x = v.x, y = v.y, z = v.z, op = v.plus ? '+' : '-', yz = fr(y[0] * z[0], y[1] * z[1]), L = lcm(x[1], yz[1]);
          var X1 = x[0] * L / x[1], Y1 = yz[0] * L / yz[1], num = v.plus ? X1 + Y1 : X1 - Y1, ans = fr(num, L);
          var fx = function (f) { return '\\frac{' + f[0] + '}{' + f[1] + '}'; }, q = fx(x) + op + fx(y) + '\\times' + fx(z);
          var xy = v.plus ? fr(x[0] * y[1] + y[0] * x[1], x[1] * y[1]) : fr(x[0] * y[1] - y[0] * x[1], x[1] * y[1]), lr = fr(xy[0] * z[0], xy[1] * z[1]);
          var sw = v.plus ? fr(X1 - Y1, L) : fr(X1 + Y1, L);
          var p = P.fraction('Evaluate ' + t(q.replace(/\\frac/g, '\\dfrac')) + ' using the correct order of operations. Give your answer as a fraction in lowest terms.', ans, { diag: fracDiag([
            [lr[0], lr[1], 'u1x-fr-lr', 'Follow BEDMAS: <b>multiply first</b>, ' + t(fx(y) + '\\times' + fx(z)) + ', and ' + (v.plus ? 'add' : 'subtract') + ' last.'],
            [sw[0], sw[1], 'u1x-fr-add', 'You multiplied first — good. Check the last step: this is ' + (v.plus ? 'an <b>addition</b>' : 'a <b>subtraction</b>') + '.']]) },
            'Multiply first: ' + t(fx(y) + '\\times' + fx(z) + '=\\frac{' + y[0] * z[0] + '}{' + y[1] * z[1] + '}' + (gcd(y[0] * z[0], y[1] * z[1]) > 1 ? '=' + ex.texRat(yz) : '')) + '.<br>' +
              'Then ' + (v.plus ? 'add' : 'subtract') + ' with the LCD ' + t(L) + ': ' + t(fx(x) + op + ex.texRat(yz) + '=\\frac{' + X1 + '}{' + L + '}' + op + '\\frac{' + Y1 + '}{' + L + '}=\\frac{' + num + '}{' + L + '}' + (gcd(num, L) > 1 ? '=' + ex.texRat(ans) : '')) + '.',
            ['BEDMAS: the multiplication comes before the ' + (v.plus ? 'addition' : 'subtraction') + '.', 'Multiply straight across; then use a common denominator to ' + (v.plus ? 'add' : 'subtract') + '.'], 'fractions: order of operations');
          p.check = guard(p.check, [q]);
          p.bad = [ex.texRat(lr), ex.texRat(sw)].concat(gcd(num, L) > 1 ? [num + '/' + L] : []).filter(function (s) { return s !== ex.texRat(ans); });
          return p;
        } }] }
    ]
  });

  /* ===================================================================================================================
   * Lesson 3 — Prime Factorization, GCF, and LCM (AN1)
   * =================================================================================================================== */
  var LCM_CTX = [
    { text: function (a, b) { return 'Two lighthouse lights just flashed together. Light A flashes every ' + t(a) + ' seconds and Light B every ' + t(b) + ' seconds. How many seconds until they next flash together?'; }, unit: 'seconds' },
    { text: function (a, b) { return 'Two buses just left the station together. Bus A leaves every ' + t(a) + ' minutes and Bus B every ' + t(b) + ' minutes. How many minutes until they next leave together?'; }, unit: 'minutes' },
    { text: function (a, b) { return 'Two spotlights at a school dance just swept past the DJ booth together. Light A sweeps past every ' + t(a) + ' seconds and Light B every ' + t(b) + ' seconds. How many seconds until they next sweep past together?'; }, unit: 'seconds' },
    { text: function (a, b) { return 'Two kitchen timers just beeped together. One beeps every ' + t(a) + ' minutes and the other every ' + t(b) + ' minutes. How many minutes until they next beep together?'; }, unit: 'minutes' }];
  var GCF_CTX = [
    { text: function (a, b) { return 'A coach has ' + t(a) + ' water bottles and ' + t(b) + ' granola bars to pack into identical team bags. Every item is used, every bag gets the same, and she makes the <b>greatest number of bags</b> possible.'; }, g: 'Number of bags:', x: 'Water bottles in each bag:', y: 'Granola bars in each bag:', what: 'bags', who: 'she' },
    { text: function (a, b) { return 'A teacher has ' + t(a) + ' pencils and ' + t(b) + ' erasers to pack into identical supply kits. Every item is used, every kit gets the same, and he makes the <b>greatest number of kits</b> possible.'; }, g: 'Number of kits:', x: 'Pencils in each kit:', y: 'Erasers in each kit:', what: 'kits', who: 'he' },
    { text: function (a, b) { return 'A florist has ' + t(a) + ' roses and ' + t(b) + ' tulips to make identical bouquets. Every flower is used, every bouquet is the same, and she makes the <b>greatest number of bouquets</b> possible.'; }, g: 'Number of bouquets:', x: 'Roses in each bouquet:', y: 'Tulips in each bouquet:', what: 'bouquets', who: 'she' },
    { text: function (a, b) { return 'A camp leader has ' + t(a) + ' apples and ' + t(b) + ' oranges to share into identical snack bags. Every fruit is used, every bag is the same, and he makes the <b>greatest number of bags</b> possible.'; }, g: 'Number of bags:', x: 'Apples in each bag:', y: 'Oranges in each bag:', what: 'bags', who: 'he' }];
  HW.defineExit({
    lesson: 'u1l3', calc: false, outcome: 'AN1',
    blurb: 'Prime factorization in exponent form, the GCF from prime factors, and GCF and LCM word problems.',
    questions: [
      { num: '1', outcome: 'AN1', stem: '', parts: [
        { id: '1', outcome: 'AN1', level: 'BEG', make: function (r) {
          var v = find(function () { return { L: r.pick([4, 6, 9, 10]), p: r.pick([2, 3, 5]), C: r.pick([4, 6, 9, 10, 15]) }; }, function (v) {
            var N = v.L * v.p * v.C, f = nt.factor(N); return N >= 48 && N <= 300 && f.length >= 2 && f.some(function (pe) { return pe[1] >= 2; });
          }, { L: 4, p: 2, C: 9 });
          var N = v.L * v.p * v.C, R = v.p * v.C, who = r.pick(NAMES), f = nt.factor(N);
          var fewer = f.map(function (pe) { return pe[0] === v.p ? [pe[0], pe[1] - 1] : pe; }).filter(function (pe) { return pe[1] > 0; });
          var cf = nt.factor(v.L * v.p).map(function (pe) { return pe[1] > 1 ? pe[0] + '^{' + pe[1] + '}' : String(pe[0]); }).join('\\times ') + '\\times ' + v.C;
          var leaves = [v.L, v.C].map(function (c) { return t(c + '=' + nt.primeList(c).join('\\times ')); }).join(' and ');
          var p = { prompt: who + ' started this factor tree for ' + t(N) + ' but stopped early.' + treeSvg(N, v.L, R, v.p, v.C) + 'Finish it on paper, then write ' + t(N) + ' as a product of primes in <b>exponent form</b>.',
            input: { type: 'math', keys: 'expr', before: t(N + '=') }, check: prodChk(N, 'required'), key: K.fac(N), answer: t(N + '=' + K.fac(N)), text: 'finish a factor tree: ' + N,
            solution: 'Split the composite leaves: ' + leaves + '.<br>The prime leaves are ' + t(nt.primeList(N).join(',\\ ')) + ', so ' + t(N + '=' + K.fac(N)) + '.<br>Check: ' + t(f.map(function (pe) { return Math.pow(pe[0], pe[1]); }).join('\\times ') + '=' + N) + '.',
            hints: ['Every branch ends in a prime. ' + t(v.L) + ' and ' + t(v.C) + ' are not prime yet.', 'Count each prime leaf, then write repeats with an exponent: ' + t('2\\times 2\\times 2=2^{3}') + '.'] };
          p.bad = [HW.texFactors(fewer), cf, String(N)];
          return p;
        } }] },
      { num: '2', outcome: 'AN1', stem: '', parts: [
        { id: '2', outcome: 'AN1', level: 'BEG', make: function (r) {
          var v = find(function () { var g = r.pick([6, 10, 12, 14, 15, 18, 20, 21, 30]), x = r.int(2, 9), y = r.int(2, 9); return { g: g, x: x, y: y }; }, function (v) {
            var a = v.g * v.x, b = v.g * v.y; return v.x !== v.y && gcd(v.x, v.y) === 1 && a <= 160 && b <= 160 && a >= 30 && b >= 30;
          }, { g: 12, x: 5, y: 7 });
          var a = v.g * v.x, b = v.g * v.y, g = v.g, gp = nt.factor(g);
          var p = P.number(t(a + '=' + K.fac(a)) + ' and ' + t(b + '=' + K.fac(b)) + '.<br>What is the greatest common factor (GCF) of ' + t(a) + ' and ' + t(b) + '?', g, gcfDiag([a, b]),
            'The primes in <b>both</b> lists, each to its <b>lowest</b> power: ' + t(K.fac(g) + '=' + g) + '.<br>(Using every prime at its highest power would give the LCM, ' + t(F(lcm(a, b))) + '.)',
            ['Circle the primes that appear in both factorizations.', 'Use each shared prime once, at the lower of its two powers, and multiply.'], 'GCF from prime factors ' + a + ', ' + b, { before: t('\\text{GCF}=') });
          p.check = numProd(g, gcfDiag([a, b]));
          p.bad = [String(lcm(a, b)), String(g / gp[0][0])].concat(gp.length > 1 ? [String(g / gp[gp.length - 1][0])] : []);
          return p;
        } }] },
      { num: '3', outcome: 'AN1', stem: '', parts: [
        { id: '3', outcome: 'AN1', level: 'PRG', make: function (r) {
          var w = find(function () { return r.sample([6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 25, 30], 2); }, function (w) { return gcd(w[0], w[1]) > 1 && w[0] % w[1] && w[1] % w[0] && lcm(w[0], w[1]) <= 120 && lcm(w[0], w[1]) !== w[0] + w[1]; }, [12, 18]);
          var A = w[0], B = w[1], L = lcm(A, B), c = r.pick(LCM_CTX), M = Math.max(A, B), m = Math.min(A, B), ms = [];
          for (var i = 1; i <= L / M; i++) ms.push(M * i);
          var p = P.number(c.text(A, B), L, lcmDiag([A, B]),
            'They line up again at a common <b>multiple</b> of both times, and the first one is the LCM.<br>' + facEq(A) + ' and ' + facEq(B) + '; every prime at its highest power: ' + t('\\text{LCM}=' + K.fac(L) + '=' + L) + ' ' + c.unit + '.<br>(Or list the multiples of ' + t(M) + ': ' + t(ms.join(',\\ ')) + ' — the first one that ' + t(m) + ' divides is ' + t(L) + '.)',
            ['Repeating events line up again at a common <b>multiple</b>: use the LCM.', 'List the multiples of the larger number until the smaller one divides in.'], 'LCM word problem ' + A + ', ' + B, { after: c.unit });
          p.bad = [String(gcd(A, B)), String(A * B), String(A + B)];
          return p;
        } }] },
      // added Mastery question (assignment Q10): GCF sharing problem, number of groups and items in each
      { num: '4', outcome: 'AN1', stem: '', parts: [
        { id: '4', outcome: 'AN1', level: 'MAS', make: function (r) {
          var v = find(function () { var g = r.int(4, 12), xy = r.sample([2, 3, 4, 5, 6, 7], 2); return { g: g, x: xy[0], y: xy[1] }; }, function (v) { return gcd(v.x, v.y) === 1 && v.g * Math.max(v.x, v.y) <= 90; }, { g: 8, x: 5, y: 4 });
          var c = r.pick(GCF_CTX), g = v.g, a = g * v.x, b = g * v.y, L = lcm(a, b);
          var p = P.fields(c.text(a, b) + ' How many ' + c.what + ' does ' + c.who + ' make, and what goes in each one?',
            [{ name: 'Groups', label: c.g }, { name: 'First', label: c.x }, { name: 'Second', label: c.y }],
            [numChk(g, [{ v: L, code: 'u1x-gcf-lcm', hint: 'That’s the LCM — more ' + c.what + ' than items! The number of ' + c.what + ' must divide <b>into</b> both ' + t(a) + ' and ' + t(b) + '.' }, { v: a, code: 'u1x-group-total', hint: 'That’s a total, not the number of ' + c.what + '.' }, { v: b, code: 'u1x-group-total', hint: 'That’s a total, not the number of ' + c.what + '.' }], gcfDiag([a, b])),
              numChk(v.x, [{ v: v.y, code: 'u1x-count-swap', hint: 'Those two amounts are swapped: divide ' + t(a) + ' by the number of ' + c.what + ' for this one.' }, { v: g, code: 'u1x-count-swap', hint: 'That’s the number of ' + c.what + '. How many of the ' + t(a) + ' items go in each one?' }, { v: a, code: 'u1x-group-total', hint: 'Divide the total ' + t(a) + ' by the number of ' + c.what + '.' }]),
              numChk(v.y, [{ v: v.x, code: 'u1x-count-swap', hint: 'Those two amounts are swapped: divide ' + t(b) + ' by the number of ' + c.what + ' for this one.' }, { v: g, code: 'u1x-count-swap', hint: 'That’s the number of ' + c.what + '. How many of the ' + t(b) + ' items go in each one?' }, { v: b, code: 'u1x-group-total', hint: 'Divide the total ' + t(b) + ' by the number of ' + c.what + '.' }])],
            [String(g), String(v.x), String(v.y)], t(g) + ' ' + c.what + '; ' + t(v.x) + ' and ' + t(v.y) + ' in each',
            'Every item is shared out evenly, so the number of ' + c.what + ' divides into both totals: it is a common <b>factor</b>, and the greatest number uses the GCF.<br>' + facEq(a) + ', ' + facEq(b) + ', so ' + t('\\text{GCF}=' + g) + ' ' + c.what + '.<br>Each gets ' + t(a + '\\div ' + g + '=' + v.x) + ' and ' + t(b + '\\div ' + g + '=' + v.y) + '.',
            ['Must the number of ' + c.what + ' divide <b>into</b> the totals, or must the totals divide into it?', 'Then divide each total by the number of ' + c.what + '.'], 'GCF sharing problem ' + a + ', ' + b);
          p.bad = [[String(L), String(v.x), String(v.y)], [String(g), String(v.y), String(v.x)], [String(g / nt.smallestPrimeFactor(g)), String(v.x * nt.smallestPrimeFactor(g)), String(v.y * nt.smallestPrimeFactor(g))]];
          return p;
        } }] }
    ]
  });

  /* ===================================================================================================================
   * Lesson 4 — Classifying Numbers in the Real Number System (AN2)
   * =================================================================================================================== */
  var SETNAME = { N: 'natural', W: 'whole', I: 'integer', Q: 'rational', Qbar: 'irrational' };
  function negIntItem(r) { var k = r.int(2, 10), m = r.int(2, 6); return r.pick([{ tex: '-\\sqrt{' + k * k + '}', note: '-\\sqrt{' + k * k + '}=-' + k, val: -k }, { tex: '\\frac{-' + m * k + '}{' + m + '}', note: '\\frac{-' + m * k + '}{' + m + '}=-' + k, val: -k }]); }
  HW.defineExit({
    lesson: 'u1l4', calc: false, outcome: 'AN2',
    blurb: 'The sets of the real number system, rational or irrational, and ordering real numbers without a calculator.',
    questions: [
      { num: '1', outcome: 'AN2', stem: '', parts: [
        { id: '1', outcome: 'AN2', level: 'PRG', make: function (r) {
          var A = negIntItem(r), k = r.int(2, 10), m = r.int(2, 9);
          var B = r.pick([{ tex: '\\frac{0}{' + m + '}', note: '\\frac{0}{' + m + '}=0', zone: 'W' }, { tex: '\\sqrt{0}', note: '\\sqrt{0}=0', zone: 'W' }, { tex: '\\sqrt{' + k * k + '}', note: '\\sqrt{' + k * k + '}=' + k, zone: 'N' }, { tex: '\\frac{' + m * k + '}{' + m + '}', note: '\\frac{' + m * k + '}{' + m + '}=' + k, zone: 'N' }]);
          var items = r.shuffle([{ id: 'a', tex: A.tex, note: A.note, zone: 'I' }, { id: 'b', tex: B.tex, note: B.note, zone: B.zone }]), want = {};
          items.forEach(function (x) { want[x.id] = x.zone; });
          var why = { I: 'an integer, but negative, so it is not whole or natural', W: 'the first whole number, but the natural (counting) numbers start at 1', N: 'a natural (counting) number' };
          return P.setsort('Place each number in the <b>innermost</b> set it belongs to: ' + items.map(function (x) { return t(x.tex); }).join(' and ') + '.', { items: items.map(function (x) { return { id: x.id, tex: x.tex }; }) }, want,
            items.map(function (x) { return t(x.note) + ': ' + why[x.zone] + ' → ' + t(x.zone) + ' (so it is also in the sets around it, up to ' + t('Q') + ' and ' + t('R') + ').'; }).join('<br>'),
            ['Simplify each number first: is it a counting number, zero, a negative integer, a fraction, or a never-ending, never-repeating decimal?', 'Natural numbers start at 1; whole numbers add 0; integers add the negatives.'], 'set diagram: ' + items.map(function (x) { return x.tex; }).join(', '));
        } }] },
      { num: '2', outcome: 'AN2', stem: '', parts: [
        { id: '2', outcome: 'AN2', level: 'BEG', make: function (r) {
          var k = r.int(4, 12), n = find(function () { return r.int(10, 99); }, function (n) { return !isPow(n, 2); }, 50), d1 = r.int(1, 9), d2 = r.int(0, 9);
          var blk = r.chance(0.5) ? String(d1) : String(d1) + String(d2 === d1 ? (d1 + 1) % 10 : d2), dec = '0.' + blk + blk + (blk.length === 1 ? blk + blk : '') + '\\ldots';
          var fq = find(function () { return [r.int(2, 9), r.int(2, 5)]; }, function (f) { return gcd(f[0], f[1]) === 1 && f[0] > f[1]; }, [5, 2]);
          var opts = [
            { html: t('\\sqrt{' + k * k + '}'), why: t(k * k) + ' is a perfect square, so ' + t('\\sqrt{' + k * k + '}=' + k) + ', which is rational. ' + t('\\sqrt{' + n + '}') + ' is irrational because ' + t(n) + ' is not a perfect square.' },
            { html: t(dec) + ' (the ' + blk + ' repeats)', why: 'A decimal that repeats is rational. Irrational decimals never end <b>and</b> never repeat, like ' + t('\\sqrt{' + n + '}=' + Math.sqrt(n).toFixed(4) + '\\ldots') + '.' },
            { html: t('-\\frac{' + fq[0] + '}{' + fq[1] + '}'), why: t('-\\frac{' + fq[0] + '}{' + fq[1] + '}') + ' is a fraction of two integers, so it is rational. ' + t('\\sqrt{' + n + '}') + ' is irrational since ' + t(n) + ' is not a perfect square.' },
            { html: t('\\sqrt{' + n + '}'), right: true }];
          return mc(r, 'Which number is <b>irrational</b>?', opts,
            t(n) + ' is not a perfect square, so ' + t('\\sqrt{' + n + '}=' + Math.sqrt(n).toFixed(4) + '\\ldots') + ' never ends and never repeats: irrational.<br>The others are rational: ' + t('\\sqrt{' + k * k + '}=' + k) + ', a repeating decimal, and a fraction of integers.',
            ['A rational number can be written as a fraction of integers: its decimal ends or repeats.', 'A square root is irrational only when the number under it is <b>not</b> a perfect square.'], 'which is irrational');
        } }] },
      { num: '3', outcome: 'AN2', stem: '', parts: [
        { id: '3', outcome: 'AN2', level: 'PRG', make: function (r) {
          var v = find(function () { var k = r.int(2, 4), f = r.pick([0.5, 0.5, 0.2, 0.8, 0.3, 0.7]), n = r.int(2, 30), up = r.chance(0.5); return { k: k, f: f, n: n, up: up }; }, function (v) {
            if (isPow(v.n, 2)) return false; var s = Math.floor(Math.sqrt(v.n)), m = v.up ? s + 1 : s; return m >= 1 && m <= 5;
          }, { k: 2, f: 0.5, n: 5, up: true });
          var s = Math.floor(Math.sqrt(v.n)), m = v.up ? s + 1 : s, dv = -(v.k - 1) - v.f, dvT = String(Number(dv.toFixed(1)));
          var items = [{ id: 'r', tex: '-\\sqrt{' + v.k * v.k + '}', v: -v.k }, { id: 'd', tex: dvT, v: dv }, { id: 's', tex: '\\sqrt{' + v.n + '}', v: Math.sqrt(v.n) }, { id: 'm', tex: String(m), v: m }];
          var sorted = items.slice().sort(function (a, b) { return a.v - b.v; }), by = {}; items.forEach(function (x) { by[x.id] = x; });
          var rootWhy = t(s * s + '<' + v.n + '<' + (s + 1) * (s + 1)) + ', so ' + t('\\sqrt{' + v.n + '}') + ' is between ' + t(s) + ' and ' + t(s + 1) + ' (about ' + t(Math.sqrt(v.n).toFixed(1)) + ')';
          var po = P.order(r, '<b>Without a calculator</b>, put these numbers in order from least to greatest: ' + t(r.shuffle(items).map(function (x) { return x.tex; }).join(',\\ \\ ')) + '.', sorted,
            { why: function (a, b) {
              var ids = [a, b].sort().join('');
              if (ids === 'dr') return t('-\\sqrt{' + v.k * v.k + '}=-' + v.k) + ', and ' + t('-' + v.k) + ' is farther left on the number line than ' + t(dvT) + ', so it is smaller.';
              if (ids === 'ms') return 'Estimate the root: ' + rootWhy + '.';
              return t(by[a].tex) + ' and ' + t(by[b].tex) + ' are in the wrong order: negatives come before positives.';
            } },
            t('-\\sqrt{' + v.k * v.k + '}=-' + v.k) + ', which is less than ' + t(dvT) + '. ' + rootWhy + '.' + lineFig(items, -v.k - 1, Math.max(m, s + 1) + 1) + t(sorted.map(function (x) { return x.tex; }).join(',\\ ')),
            ['Simplify the roots you can, and estimate the others between two whole numbers.', 'On a number line, the negative number farther from zero is the smaller one.'], 'order 4 real numbers');
          var ids = sorted.map(function (x) { return x.id; });
          po.bad = [[ids[1], ids[0], ids[2], ids[3]], [ids[0], ids[1], ids[3], ids[2]], ids.slice().reverse()];
          return po;
        } }] },
      // added Mastery question (assignment Q6): find a number that fits each description
      { num: '4', outcome: 'AN2', stem: 'Find one number that fits each description. (Use the keypad for fractions and roots.)', parts: [
        { id: '4', outcome: 'AN2', level: 'MAS', make: function (r) {
          var a = r.int(2, 9), b = r.int(1, 6), neg = r.chance(0.4);
          var lo = neg ? -a - 1 : a, hi = neg ? -a : a + 1;
          var one = { text: 'An <b>irrational</b> number between ' + t(lo) + ' and ' + t(hi) + '.', key: (neg ? '-' : '') + '\\sqrt{' + (a * a + 2) + '}', bad: (neg ? '-' : '') + '\\sqrt{' + (a * a) + '}',
            sol: (neg ? t('-\\sqrt{' + (a * a + 1) + '}') + ', …, ' + t('-\\sqrt{' + (a * a + 2 * a) + '}') : t('\\sqrt{' + (a * a + 1) + '}') + ', …, ' + t('\\sqrt{' + (a * a + 2 * a) + '}')) + ' all work: ' + t(a * a) + ' and ' + t((a + 1) * (a + 1)) + ' are perfect squares, so the square root of any whole number between them is irrational and between ' + t(a) + ' and ' + t(a + 1) + (neg ? ' (with a negative sign in front)' : '') + '.',
            test: function (o) { if (o.rational) return { code: 'u1x-cond', hint: 'Your number is rational (it is an integer, a fraction, or its decimal ends or repeats). Try the square root of a whole number that is not a perfect square.' }; if (!(o.v > lo && o.v < hi)) return { code: 'u1x-cond-range', hint: 'It is irrational, but not between ' + t(lo) + ' and ' + t(hi) + '. Square ' + t(a) + ' and ' + t(a + 1) + ': the number under the root must be between them.' }; return null; } };
          var two = r.pick([
            { text: 'A number written with a ' + t('\\sqrt{\\ }') + ' sign that is an <b>integer</b> but <b>not a whole number</b>.', key: '-\\sqrt{' + (b + 2) * (b + 2) + '}', bad: '\\sqrt{' + (b + 2) * (b + 2) + '}',
              sol: 'the negative of the square root of a perfect square, like ' + t('-\\sqrt{9}=-3') + ', is a negative integer: an integer, but not a whole number',
              test: function (o) { if (!o.roots) return { code: 'u1x-cond', hint: 'Write your number with a square root sign, like ' + t('-\\sqrt{25}') + '.' }; if (!o.rational || o.q !== 1) return { code: 'u1x-cond', hint: 'Your number isn’t an integer. Take the square root of a <b>perfect square</b>.' }; if (o.p >= 0) return { code: 'u1x-cond-range', hint: 'That is an integer, but it is also a whole number (0, 1, 2, …). Make it negative.' }; return null; } },
            { text: 'A <b>rational</b> number between ' + t(-b - 1) + ' and ' + t(-b) + ' that is <b>not an integer</b>.', key: String(-b - 0.5), bad: String(-b - 1),
              sol: 'any fraction or decimal between them works, like ' + t(String(-b - 0.5)) + ' or ' + t('-' + b + '\\frac{1}{4}'),
              test: function (o) { if (!o.rational) return { code: 'u1x-cond', hint: 'Your number is irrational. Use a fraction or a decimal that ends.' }; if (o.q === 1) return { code: 'u1x-cond', hint: 'That is an integer. You need a number <b>between</b> two integers.' }; if (!(o.v > -b - 1 && o.v < -b)) return { code: 'u1x-cond-range', hint: 'It is rational, but not between ' + t(-b - 1) + ' and ' + t(-b) + '. Mark both on a number line first.' }; return null; } }]);
          var p = P.fields('(i) ' + one.text + '<br>(ii) ' + two.text,
            [{ name: '(i)', label: '(i)', mode: 'math', keys: 'expr', wide: true }, { name: '(ii)', label: '(ii)', mode: 'math', keys: 'expr', wide: true }], [findChk(one), findChk(two)], [one.key, two.key],
            '(answers vary) e.g. (i) ' + t(one.key) + ', (ii) ' + t(two.key),
            '(i) ' + one.sol + '<br>(ii) ' + two.sol + '.',
            ['Decide which set your number must be in first, then make it fit the rest of the description.', 'Check: square a root to see where it lands, or picture the number line.'], 'find numbers: irrational between, ' + (two.key.indexOf('sqrt') >= 0 ? 'root integer not whole' : 'rational between negatives'));
          p.bad = [[one.bad, two.key], [one.key, two.bad]];
          return p;
        } }] }
    ]
  });

  /* ===================================================================================================================
   * Lesson 5 — Perfect Squares, Perfect Cubes, and Estimating Roots (AN1, AN2)
   * =================================================================================================================== */
  var SQ_ONLY = [4, 9, 16, 25, 36, 49, 81, 100, 121, 144], CU_ONLY = [8, 27, 125, 216, 343, 1000];
  function sqcube(n) { return { sq: isPow(n, 2), cu: isPow(n, 3) }; }
  function sqcubeWhy(n) {
    var k = sqcube(n), s = Math.round(Math.sqrt(n)), c = Math.round(Math.cbrt(n));
    if (k.sq && k.cu) return t(n + '=' + s + '^{2}') + ' and ' + t(n + '=' + c + '^{3}') + ': it is <b>both</b> a perfect square and a perfect cube.';
    if (k.sq) { var c0 = Math.floor(Math.cbrt(n) + 1e-9); return t(n + '=' + s + '^{2}') + ' is a perfect square, but not a cube (' + t(c0 + '^{3}=' + Math.pow(c0, 3)) + ', ' + t((c0 + 1) + '^{3}=' + Math.pow(c0 + 1, 3)) + ').'; }
    if (k.cu) { var s0 = Math.floor(Math.sqrt(n) + 1e-9); return t(n + '=' + c + '^{3}') + ' is a perfect cube, but not a square (' + t(s0 + '^{2}=' + s0 * s0) + ', ' + t((s0 + 1) + '^{2}=' + (s0 + 1) * (s0 + 1)) + ').'; }
    return t(n) + ' is neither.';
  }
  HW.defineExit({
    lesson: 'u1l5', calc: false, outcome: 'AN1',
    blurb: 'Perfect squares and cubes, placing a square root on a number line, estimating a cube root, and roots in area and volume.',
    questions: [
      { num: '1', outcome: 'AN1', stem: '', parts: [
        { id: '1', outcome: 'AN1', level: 'BEG', make: function (r) {
          var kind = r.pick(['both', 'cube', 'square']), opts, ask;
          if (kind === 'both') { ask = 'Which number is both a perfect square <b>and</b> a perfect cube?'; opts = [64].concat(r.sample(SQ_ONLY.filter(function (x) { return x > 9; }), 2), r.sample(CU_ONLY, 1)); }
          else if (kind === 'cube') { ask = 'Which number is a perfect cube but <b>not</b> a perfect square?'; opts = [r.pick(CU_ONLY), 64, r.pick(SQ_ONLY.filter(function (x) { return x > 9; })), r.pick([1, 4, 9])]; }
          else { ask = 'Which number is a perfect square but <b>not</b> a perfect cube?'; opts = [r.pick(SQ_ONLY.filter(function (x) { return x > 9; })), 64, r.pick(CU_ONLY), 1]; }
          var right = opts[0];
          return mc(r, ask, opts.map(function (n) { return { html: t(F(n)), right: n === right, why: n === right ? null : sqcubeWhy(n) }; }),
            sqcubeWhy(right) + '<br>Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, … Perfect cubes: 1, 8, 27, 64, 125, 216, 343, …',
            ['Check each number against the lists: ' + t('n^{2}') + ': 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, … and ' + t('n^{3}') + ': 1, 8, 27, 64, 125, 216, …'], 'perfect square / cube: ' + kind);
        } }] },
      { num: '2', outcome: 'AN2', stem: '', parts: [
        { id: '2', outcome: 'AN2', level: 'PRG', make: function (r) {
          var n = find(function () { return r.int(10, 140); }, function (n) { if (isPow(n, 2)) return false; var x = Math.sqrt(n), f = x - Math.floor(x); return f > 0.12 && f < 0.88 && (f < 0.4 || f > 0.6); }, 55);
          var x = Math.sqrt(n), s = Math.floor(x), lo = s - 2, hi = s + 1, close = n - s * s < (s + 1) * (s + 1) - n, nt10 = n / 10;
          var p = P.numplace('<b>Without a calculator</b>, mark ' + t('\\sqrt{' + n + '}') + ' on the number line.', { min: lo, max: hi, step: 0.1, labels: 1, snap: 0.05, items: [{ id: 's', tex: '\\sqrt{' + n + '}' }] }, { s: x },
            'Trap ' + t(n) + ' between perfect squares: ' + t(s * s + '<' + n + '<' + (s + 1) * (s + 1)) + ', so ' + t(s + '<\\sqrt{' + n + '}<' + (s + 1)) + '.<br>' + t(n) + ' is ' + t(n - s * s) + ' past ' + t(s * s) + ' but ' + t((s + 1) * (s + 1) - n) + ' short of ' + t((s + 1) * (s + 1)) + ', so it is closer to ' + t(close ? s : s + 1) + ': ' + t('\\sqrt{' + n + '}\\approx ' + x.toFixed(1)) + '.',
            ['Find the perfect squares just below and just above ' + t(n) + '.', 'Is ' + t(n) + ' nearer the lower perfect square or the upper one?'], 'mark sqrt ' + n + ' on a number line',
            { tol: 0.2, hints: { s: t('\\sqrt{' + n + '}') + ' is between ' + t(s) + ' and ' + t(s + 1) + ', closer to ' + t(close ? s : s + 1) + '.' } });
          var base = p.check;
          p.check = function (resp) {
            var res = base(resp); if (!res || res.v !== 'wrong' || !resp || resp.s == null) return res;
            var y = +resp.s;
            if (nt10 >= lo && nt10 <= hi && Math.abs(y - nt10) <= 0.15 && Math.abs(nt10 - x) > 0.3) return wrong('u1x-est-div', 'A square root is not ' + t(n + '\\div 10') + '. Trap ' + t(n) + ' between perfect squares: ' + t(s * s + '<' + n + '<' + (s + 1) * (s + 1)) + '.');
            if (y < s || y > s + 1) return wrong('u1x-est-trap', 'Check the trap: ' + t(s * s + '<' + n + '<' + (s + 1) * (s + 1)) + ', so ' + t('\\sqrt{' + n + '}') + ' is between ' + t(s) + ' and ' + t(s + 1) + '.');
            if ((y - s < 0.5) !== close) return wrong('u1x-est-near', 'Right whole numbers! But ' + t(n) + ' is nearer to ' + t(close ? s * s : (s + 1) * (s + 1)) + ', so ' + t('\\sqrt{' + n + '}') + ' is closer to ' + t(close ? s : s + 1) + '.');
            return res;
          };
          p.bad = [{ s: close ? s + 0.8 : s + 0.2 }, { s: s - 0.5 }];
          if (nt10 >= lo && nt10 <= hi && Math.abs(nt10 - x) > 0.3) p.bad.push({ s: nt10 });
          return p;
        } }] },
      { num: '3', outcome: 'AN1', stem: '', parts: [
        { id: '3', outcome: 'AN1', level: 'PRG', make: function (r) {
          var V = find(function () { return r.int(20, 500); }, function (V) {
            if (isPow(V, 3)) return false; var x = Math.cbrt(V), c = Math.floor(x + 1e-9), f = x - c;
            if ((f >= 0.4 && f <= 0.6) || f < 0.1 || f > 0.9) return false;
            return (V - c * c * c < Math.pow(c + 1, 3) - V) === (f < 0.5) && !isPow(V, 2) && Math.floor(Math.sqrt(V)) !== c;
          }, 200);
          var x = Math.cbrt(V), c = Math.floor(x), near = Math.round(x), s = Math.floor(Math.sqrt(V)), what = r.pick(['box', 'storage crate', 'water tank', 'block of wood']), u = r.pick(['cm', 'cm', 'm']);
          function side(want, isLo) {
            return K.number(want, function (v) {
              if (!Number.isInteger(v)) return { code: 'u1x-bracket', hint: 'Give a whole number.' };
              if (v === Math.pow(want, 3)) return { code: 'u1x-est-power', hint: t(F(v)) + ' is the perfect cube. Give the whole number it comes from: ' + t('\\sqrt[3]{' + v + '}=' + want) + '.' };
              if (v === (isLo ? s : s + 1)) return { code: 'u1x-cube-sq', hint: 'That comes from the <b>square</b> root. A cube’s edge uses the <b>cube</b> root: ' + t('e^{3}=' + V) + '.' };
              if (Math.abs(v - V / 3) < 1) return { code: 'u1x-root-div', hint: 'A cube root is not the same as dividing by 3. Find the whole numbers whose <b>cubes</b> are just below and just above ' + t(V) + '.' };
              return { code: 'u1x-bracket', hint: 'Check: ' + t(v + '^{3}=' + F(v * v * v)) + '. You need the whole numbers whose cubes are just ' + (isLo ? 'below' : 'above') + ' ' + t(V) + '.' };
            });
          }
          var nearChk = K.number(near, function (v) {
            if (v === (near === c ? c + 1 : c)) return { code: 'u1x-est-near', hint: t(V) + ' is nearer to ' + t(Math.pow(near, 3)) + ' than to ' + t(Math.pow(near === c ? c + 1 : c, 3)) + ', so the edge is closer to ' + t(near) + '.' };
            if (v === Math.round(Math.sqrt(V))) return { code: 'u1x-cube-sq', hint: 'That’s about the <b>square</b> root. A cube’s edge uses the <b>cube</b> root.' };
            return null;
          });
          var p = P.fields('A cube-shaped ' + what + ' has a volume of ' + t(V + '\\text{ ' + u + '}^{3}') + '. <b>Without a calculator</b>, find the two consecutive whole numbers its edge length ' + t('e') + ' is between, then ' + t('e') + ' to the nearest whole ' + (u === 'cm' ? 'centimetre' : 'metre') + '.',
            [{ name: 'Smaller', label: 'Smaller whole number:', after: t('<e') }, { name: 'Larger', label: 'Larger whole number:', before: t('e<') }, { name: 'Nearest', label: 'To the nearest whole number:', before: t('e\\approx'), after: u }],
            [side(c, true), side(c + 1, false), nearChk], [String(c), String(c + 1), String(near)], t(c + '<e<' + (c + 1)) + '; ' + t('e\\approx ' + near) + ' ' + u,
            'The edge of a cube is the <b>cube root</b> of its volume: ' + t('e=\\sqrt[3]{' + V + '}') + '.<br>' + t(c + '^{3}=' + Math.pow(c, 3)) + ' and ' + t((c + 1) + '^{3}=' + Math.pow(c + 1, 3)) + ', and ' + t(Math.pow(c, 3) + '<' + V + '<' + Math.pow(c + 1, 3)) + ', so ' + t(c + '<e<' + (c + 1)) + '.<br>' +
              t(V) + ' is ' + t(V - Math.pow(c, 3)) + ' past ' + t(Math.pow(c, 3)) + ' and ' + t(Math.pow(c + 1, 3) - V) + ' short of ' + t(Math.pow(c + 1, 3)) + ', so ' + t('e\\approx ' + near) + ' ' + u + ' (a calculator gives ' + t(x.toFixed(2)) + ').',
            ['A cube’s edge is the <b>cube root</b> of its volume. List the perfect cubes: 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000.', 'Which two perfect cubes is ' + t(V) + ' between, and which one is it nearer?'], 'cube edge estimate: volume ' + V);
          p.bad = [[String(s), String(s + 1), String(Math.round(Math.sqrt(V)))], [String(c), String(c + 1), String(near === c ? c + 1 : c)], [String(Math.pow(c, 3)), String(Math.pow(c + 1, 3)), String(near)]];
          return p;
        } }] },
      // added Mastery question (Example 5): a root runs a formula backwards, then a second step
      { num: '4', outcome: 'AN1', stem: '', parts: [
        { id: '4', outcome: 'AN1', level: 'MAS', make: function (r) {
          if (r.chance(0.5)) {
            var k = r.int(2, 10), V = k * k * k, what = r.pick(['storage crate', 'gift box', 'water tank', 'block of ice']), u = r.pick(['cm', 'm']);
            var p = P.fields('A cube-shaped ' + what + ' has a volume of ' + t(F(V) + '\\text{ ' + u + '}^{3}') + '. Find the length of one edge, and the area of one face.',
              [{ name: 'Edge', label: 'Edge:', after: u }, { name: 'Face', label: 'Area of one face:', after: u + '²' }],
              [numChk(k, [{ v: Math.sqrt(V), code: 'u1x-cube-sq', hint: 'A cube uses the <b>cube</b> root: ' + t('e^{3}=' + F(V)) + '.' }], function (x) { return Math.abs(x - V / 3) < 1 ? { code: 'u1x-root-div', hint: 'A cube root is not dividing by 3: find the number that, used as a factor <b>three</b> times, makes ' + t(F(V)) + '.' } : null; }),
                numChk(k * k, [{ v: 6 * k * k, code: 'u1x-face-surface', hint: 'That is all six faces. One face is a square: ' + t('e\\times e') + '.' }, { v: 4 * k, code: 'u1x-face-perim', hint: 'That is the distance around one face. Its <b>area</b> is ' + t('e\\times e') + '.' }, { v: 2 * k, code: 'u1x-face-double', hint: 'The area of a square face is ' + t('e\\times e') + ', not ' + t('2\\times e') + '.' }, { v: V, code: 'u1x-face-surface', hint: 'That is the volume. One face is a square with area ' + t('e\\times e') + '.' }])],
              [String(k), String(k * k)], 'edge ' + t(k) + ' ' + u + ', face ' + t(k * k) + ' ' + u + '²',
              'The edge is the cube root of the volume: ' + t('e=\\sqrt[3]{' + F(V) + '}=' + k) + ' ' + u + ', because ' + t(k + '^{3}=' + F(V)) + '.<br>Each face is a square: ' + t(k + '\\times ' + k + '=' + k * k) + ' ' + u + '².',
              ['Volume of a cube: ' + t('V=e^{3}') + ', so the edge is ' + t('\\sqrt[3]{V}') + '.', 'Each face of a cube is a square with side ' + t('e') + '.'], 'cube volume ' + V + ': edge and face');
            p.bad = [[String(Math.round(V / 3)), String(k * k)], [String(k), String(6 * k * k)], [String(k), String(4 * k)]].filter(function (b) { return b[0] !== String(k) || b[1] !== String(k * k); });
            return p;
          }
          var v = find(function () { var a = r.int(2, 9), b = r.int(a + 1, 30); return { a: a, b: b }; }, function (v) { return isPow(v.a * v.b, 2) && v.a * v.b <= 225 && v.a * v.b >= 16; }, { a: 4, b: 9 });
          var A = v.a * v.b, s = Math.round(Math.sqrt(A)), thing = r.pick(['garden', 'patio', 'play area', 'rug']), u2 = r.pick(['m', 'ft']);
          var q = P.fields('A rectangular ' + thing + ' is ' + t(v.a) + ' ' + u2 + ' by ' + t(v.b) + ' ' + u2 + '. A <b>square</b> ' + thing + ' has the same area. Find the side length of the square, and its perimeter.',
            [{ name: 'Side', label: 'Side of the square:', after: u2 }, { name: 'Perimeter', label: 'Perimeter of the square:', after: u2 }],
            [numChk(s, [{ v: A / 2, code: 'u1x-sq-half', hint: 'The side of a square isn’t half its area: side × side = area, so the side is ' + t('\\sqrt{' + A + '}') + '.' }, { v: A, code: 'u1x-sq-half', hint: 'That is the area. The side is its square root: ' + t('s\\times s=' + A) + '.' }, { v: (v.a + v.b) / 2, code: 'u1x-rect-sum', hint: 'Find the area first (' + t(v.a + '\\times ' + v.b) + '), then its square root.' }]),
              numChk(4 * s, [{ v: 2 * s, code: 'u1x-sq-perim', hint: 'A square has <b>four</b> equal sides.' }, { v: 2 * (v.a + v.b), code: 'u1x-sq-perim', hint: 'That is the rectangle’s perimeter. Use the side of the <b>square</b>, four times.' }, { v: A, code: 'u1x-sq-half', hint: 'That is the area. The perimeter is the distance around: ' + t('4s') + '.' }])],
            [String(s), String(4 * s)], 'side ' + t(s) + ' ' + u2 + ', perimeter ' + t(4 * s) + ' ' + u2,
            'Area of the rectangle: ' + t(v.a + '\\times ' + v.b + '=' + A) + ' ' + u2 + '². The square has the same area, so its side is ' + t('\\sqrt{' + A + '}=' + s) + ' ' + u2 + ' (because ' + t(s + '^{2}=' + A) + ').<br>Perimeter: ' + t('4\\times ' + s + '=' + 4 * s) + ' ' + u2 + '.',
            ['Find the area of the rectangle first.', 'A square’s side is the square root of its area; its perimeter is 4 sides.'], 'square with area ' + v.a + '×' + v.b + ': side and perimeter');
          q.bad = [[String(A / 2), String(2 * A)], [String(s), String(2 * s)], [String(s), String(2 * (v.a + v.b))]];
          return q;
        } }] }
    ]
  });

  /* ===================================================================================================================
   * Lesson 6 — Simplifying Square Roots: Entire and Mixed Radicals (AN2)
   * =================================================================================================================== */
  var L6_POOL = radPool(2, [3, 7], 18, 200, 11);
  HW.defineExit({
    lesson: 'u1l6', calc: false, outcome: 'AN2',
    blurb: 'Entire radicals to mixed radicals and back, and comparing mixed radicals without a calculator.',
    questions: [
      { num: '1', outcome: 'AN2', stem: '', parts: [
        { id: '1', outcome: 'AN2', level: 'PRG', make: function (r) {
          var km = r.pick(L6_POOL), N = km[0] * km[0] * km[1], u = r.pick(['cm', 'm']);
          return mixedPart(km[0], 2, km[1], 'This square has an area of ' + t(N + '\\text{ ' + u + '}^{2}') + ', so its side length is ' + t('\\sqrt{' + N + '}') + ' ' + u + '.' + squareSvg(N, u) + 'Write ' + t('\\sqrt{' + N + '}') + ' as a mixed radical in simplest form.', 'square side: sqrt ' + N);
        } }] },
      { num: '2', outcome: 'AN2', stem: '', parts: [
        { id: '2', outcome: 'AN2', level: 'PRG', make: function (r) {
          var km = r.pick(radPool(2, [2, 6], 8, 200, 11)); return entirePart(km[0], 2, km[1]);
        } }] },
      { num: '3', outcome: 'AN2', stem: '', parts: [
        { id: '3', outcome: 'AN2', level: 'MAS', make: function (r) {
          var fb = [{ id: 'a', tex: '5\\sqrt{2}', v: 50, a: 5, b: 2 }, { id: 'b', tex: '2\\sqrt{11}', v: 44, a: 2, b: 11 }, { id: 'c', tex: '\\sqrt{48}', v: 48 }, { id: 'd', tex: '3\\sqrt{6}', v: 54, a: 3, b: 6 }];
          var items = find(function () {
            var T = r.int(30, 80), mixed = [];
            [2, 3, 4, 5, 6].forEach(function (a) { [2, 3, 5, 6, 7, 10, 11, 13].forEach(function (b) { var v = a * a * b; if (v >= T - 6 && v <= T + 6) mixed.push({ a: a, b: b, v: v }); }); });
            if (mixed.length < 3) return null;
            var three = r.sample(mixed, 3); if (three[0].v === three[1].v || three[1].v === three[2].v || three[0].v === three[2].v) return null;
            var ents = []; for (var N = T - 6; N <= T + 6; N++) if (!isPow(N, 2) && three.every(function (x) { return x.v !== N; })) ents.push(N);
            var N0 = r.pick(ents);
            return r.shuffle(three.map(function (x, i) { return { id: 'abd'[i], tex: x.a + '\\sqrt{' + x.b + '}', v: x.v, a: x.a, b: x.b }; }).concat([{ id: 'c', tex: '\\sqrt{' + N0 + '}', v: N0 }]));
          }, function (its) {
            var mx = its.filter(function (x) { return x.a; }).sort(function (p, q) { return q.a - p.a; }), top = its.slice().sort(function (p, q) { return q.v - p.v; })[0];
            return mx[0].a !== mx[1].a && mx[0] !== top; // the biggest number in front is not the greatest
          }, fb);
          var sorted = items.slice().sort(function (a, b) { return a.v - b.v; }), by = {}; items.forEach(function (x) { by[x.id] = x; });
          var ent = function (x) { return x.a ? x.tex + '=\\sqrt{' + x.a + '^{2}\\times ' + x.b + '}=\\sqrt{' + x.v + '}' : x.tex; };
          var po = P.order(r, '<b>Without a calculator</b>, put these numbers in order from least to greatest: ' + t(items.map(function (x) { return x.tex; }).join(',\\ \\ ')) + '.', sorted,
            { why: function (a, b) { return t(by[a].tex) + ' and ' + t(by[b].tex) + ' are in the wrong order. Write each as an entire radical and compare the numbers under the roots: ' + t(ent(by[a])) + ', ' + t(ent(by[b])) + '.'; } },
            'Write each one as an entire radical (square the number in front and multiply it in):<br>' + items.map(function (x) { return t(ent(x)); }).join('<br>') + '<br>Compare the radicands: ' + t(sorted.map(function (x) { return x.v; }).join('<')) + ', so<br>' + t(sorted.map(function (x) { return x.tex; }).join('\\ <\\ ')),
            ['A bigger number in front doesn’t always mean a bigger radical. Write each one as an entire radical: ' + t('a\\sqrt{b}=\\sqrt{a^{2}b}') + '.', 'Then compare the numbers under the roots.'], 'order 3 mixed and 1 entire radical');
          var byA = items.filter(function (x) { return x.a; }).sort(function (p, q) { return p.a - q.a || p.v - q.v; }).concat(items.filter(function (x) { return !x.a; }));
          po.bad = [byA.map(function (x) { return x.id; }), items.slice().sort(function (p, q) { return (p.a ? p.b : p.v) - (q.a ? q.b : q.v); }).map(function (x) { return x.id; })].filter(function (b) { return b.join() !== sorted.map(function (x) { return x.id; }).join(); });
          return po;
        } }] }
    ]
  });

  /* ===================================================================================================================
   * Lesson 7 — Simplifying Higher-Index Radicals (AN2)
   * =================================================================================================================== */
  HW.defineExit({
    lesson: 'u1l7', calc: false, outcome: 'AN2',
    blurb: 'Cube roots as mixed and entire radicals (with negatives), which roots are real, and fourth and fifth roots.',
    questions: [
      { num: '1', outcome: 'AN2', stem: '', parts: [
        { id: '1', outcome: 'AN2', level: 'PRG', make: function (r) { var km = r.pick(radPool(3, [2, 4], 16, 450, 13)); return mixedPart(km[0], 3, km[1]); } }] },
      { num: '2', outcome: 'AN2', stem: '', parts: [
        { id: '2', outcome: 'AN2', level: 'PRG', make: function (r) { var km = r.pick(radPool(3, [2, 4], 10, 450, 9)); return entirePart(-km[0], 3, km[1]); } }] },
      { num: '3', outcome: 'AN2', stem: '', parts: [
        { id: '3', outcome: 'AN2', level: 'BEG', make: function (r) {
          var odd = r.sample([[3, 2], [3, 3], [3, 4], [3, 5], [5, 1], [5, 2]], 2).map(function (nc) { var n = nc[0], c = nc[1], v = Math.pow(c, n);
            return { html: t(rt(n, '-' + v)), why: 'An <b>odd</b> index accepts a negative: ' + t('(-' + c + ')^{' + n + '}=-' + v) + ', so ' + t(rt(n, '-' + v) + '=-' + c) + '. It’s an even index with a negative radicand that has no real root.' }; });
          var nc2 = r.pick([[2, 4], [2, 5], [2, 6], [2, 7], [2, 9], [4, 2], [4, 3]]), vo = Math.pow(nc2[1], nc2[0]);
          var out = { html: t('-' + rt(nc2[0], vo)), why: 'In ' + t('-' + rt(nc2[0], vo)) + ' the negative is <b>outside</b> the root: ' + t('-' + rt(nc2[0], vo) + '=-' + nc2[1]) + ', a real number.' };
          var ev = r.pick([[4, 2], [4, 3], [6, 2], [2, 3], [2, 5], [2, 4]]), ve = Math.pow(ev[1], ev[0]), right = rt(ev[0], '-' + ve);
          return mc(r, 'Which of these is <b>not</b> a real number?', odd.concat([out, { html: t(right), right: true }]),
            'An even index can’t take a negative radicand: any real number raised to the power ' + t(ev[0]) + ' is positive or zero, never ' + t('-' + ve) + '. So ' + t(right) + ' is not a real number.<br>An odd index is fine with a negative radicand, and in ' + t('-' + rt(nc2[0], vo)) + ' the negative sits outside the root.',
            ['Look at the index: is it odd or even?', 'An even power of any real number is never negative.'], 'which is not real');
        } }] },
      // added Mastery question (assignment Q7 and Q12): a negative radicand or a fourth/fifth root, as a mixed radical
      { num: '4', outcome: 'AN2', stem: '', parts: [
        { id: '4', outcome: 'AN2', level: 'MAS', make: function (r) {
          if (r.chance(0.5)) { var km = r.pick(radPool(3, [2, 4], 16, 400, 11)); return mixedPart(-km[0], 3, km[1], null, 'mixed radical: cube root of a negative'); }
          var n = r.pick([4, 4, 5]), k4 = r.pick(n === 4 ? radPool(4, [2, 3], 32, 250, 7) : radPool(5, [2, 2], 64, 230, 7));
          return mixedPart(k4[0], n, k4[1]);
        } }] }
    ]
  });

  /* ===================================================================================================================
   * Lesson 8 — Unit Review: Number Sense (REV, AN2)
   * =================================================================================================================== */
  HW.defineExit({
    lesson: 'u1l8', calc: false, outcome: 'AN2',
    blurb: 'A short mix of the unit: the order of operations, mixed radicals, and the sets of numbers.',
    questions: [
      { num: '1', outcome: 'REV', stem: '', parts: [
        { id: '1', outcome: 'REV', level: 'PRG', make: function (r) {
          var v = find(function () { var a = r.pick([-4, -3, -2, 2, 3]), b = r.int(1, 8), d = -r.int(2, 5), e = r.int(5, 40); return { a: a, b: b, c: b - d, d: d, e: e }; }, function (v) {
            var ans = v.a * v.d * v.d + v.e; return [v.a * -v.d * v.d + v.e, v.a * v.a * v.d * v.d + v.e, v.a * 2 * v.d + v.e].every(function (x) { return x !== ans; });
          }, { a: -3, b: 2, c: 6, d: -4, e: 20 });
          var ans = v.a * v.d * v.d + v.e, B = { sq: v.a * -v.d * v.d + v.e, mf: v.a * v.a * v.d * v.d + v.e, dbl: v.a * 2 * v.d + v.e };
          var p = P.number('Evaluate ' + t(v.a + '\\times(' + v.b + '-' + v.c + ')^{2}+' + v.e) + '.', ans, function (x) {
            if (x === B.sq) return { code: 'u1x-sq-neg', hint: t('(' + v.d + ')^{2}=(' + v.d + ')\\times(' + v.d + ')=+' + v.d * v.d) + ': two negatives make a positive.' };
            if (x === B.mf) return { code: 'u1x-mult-first', hint: 'The exponent is only on the bracket, so square it <b>first</b>: ' + t('(' + v.d + ')^{2}=' + v.d * v.d) + '. Then multiply by ' + t(v.a) + '.' };
            if (x === B.dbl) return { code: 'u1x-sq-double', hint: t('(' + v.d + ')^{2}') + ' means ' + t('(' + v.d + ')\\times(' + v.d + ')') + ', not ' + t('(' + v.d + ')\\times 2') + '.' };
            return null;
          },
            'Brackets: ' + t(v.b + '-' + v.c + '=' + v.d) + '. Exponent: ' + t('(' + v.d + ')^{2}=' + v.d * v.d) + '. Multiply: ' + t(v.a + '\\times ' + v.d * v.d + '=' + v.a * v.d * v.d) + '. Add: ' + t(par(v.a * v.d * v.d) + '+' + v.e + '=' + ans) + '.',
            ['BEDMAS: brackets, then the exponent, then multiply, then add.', 'A negative number squared is positive.'], 'BEDMAS: a(b-c)^2 + e');
          p.bad = [String(B.sq), String(B.mf), String(B.dbl)];
          return p;
        } }] },
      { num: '2', outcome: 'AN2', stem: '', parts: [
        { id: '2', outcome: 'AN2', level: 'PRG', make: function (r) { var km = r.pick(radPool(2, [4, 7], 48, 250, 15)); return mixedPart(km[0], 2, km[1]); } }] },
      { num: '3', outcome: 'AN2', stem: '', parts: [
        { id: '3', outcome: 'AN2', level: 'BEG', make: function (r) {
          var k = r.int(2, 9), m = r.int(2, 6), k2 = r.int(2, 9), fq = find(function () { return [r.int(3, 15), r.pick([2, 4])]; }, function (f) { return gcd(f[0], f[1]) === 1; }, [7, 2]);
          var right = r.pick([{ tex: '-\\sqrt{' + k * k + '}', note: '-\\sqrt{' + k * k + '}=-' + k }, { tex: '-\\frac{' + m * k + '}{' + m + '}', note: '-\\frac{' + m * k + '}{' + m + '}=-' + k }]);
          var frac = r.pick([{ tex: '-\\frac{' + fq[0] + '}{' + fq[1] + '}', why: t('-\\frac{' + fq[0] + '}{' + fq[1] + '}=' + String(-fq[0] / fq[1])) + ' is rational, but not an integer.' }, { tex: String(-r.int(1, 9) - 0.5), why: 'A decimal between two integers is rational, but not an integer.' }]);
          var opts = [{ html: t('0'), why: 'The whole numbers are 0, 1, 2, 3, …, so 0 <b>is</b> a whole number.' },
            { html: t('\\sqrt{' + k2 * k2 + '}'), why: t('\\sqrt{' + k2 * k2 + '}=' + k2) + ' is an integer, but it is also a whole number.' },
            { html: t(frac.tex), why: frac.why }, { html: t(right.tex), right: true }];
          return mc(r, 'Which number is an integer but <b>not</b> a whole number?', opts,
            t(right.note) + '. It is an integer, but whole numbers (0, 1, 2, …) are never negative.',
            ['Simplify each number first.', 'Whole numbers are 0, 1, 2, 3, …; integers add the negatives.'], 'integer but not whole');
        } }] },
      // added Mastery question (assignment Q17, Q24): a large radicand, by prime factorization
      { num: '4', outcome: 'AN2', stem: 'Use prime factorization (a division ladder or factor tree on paper).', parts: [
        { id: '4', outcome: 'AN2', level: 'MAS', make: function (r) {
          var km = r.pick(radPool(2, [7, 12], 196, 700, 10)), N = km[0] * km[0] * km[1];
          var p = mixedPart(km[0], 2, km[1], 'Write ' + t('\\sqrt{' + N + '}') + ' as a mixed radical in simplest form.', 'large mixed radical: sqrt ' + N);
          p.solution = t(N + '=' + K.fac(N)) + '. Pair up equal primes: each pair comes out of the root as one factor.<br>' + p.solution;
          return p;
        } }] }
    ]
  });
})(window);
