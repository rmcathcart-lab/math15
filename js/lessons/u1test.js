/* Math 15 · Unit 1 Test (AN1, AN2) — Number: prime factorization, GCF and LCM, perfect squares and cubes, the real number
 * system, estimating roots, entire and mixed radicals. Built the way the Math 10C Unit 1 Test was built (Beginning /
 * Progressing / Mastery boxes per outcome, mostly typed answers, keys built from the generated numbers, `bad` answers with
 * u1t- codes, worked solutions and hints) but pitched at Math 15 and NOT based on the Math 15 multiple-choice paper tests.
 * One 75-minute class, NO calculator (friendly numbers: the Lesson 5 tables of squares to 15² and cubes to 10³, radicands
 * a Math 15 student can factor by hand). The Grade 9 review (Lessons 1–2, outcome REV) is not on the test: it would not count
 * toward the unit grade. 18 questions / 37 parts:
 *   AN1 — Beginning 3 questions / 6 parts, Progressing 3 / 6, Mastery 3 / 5;
 *   AN2 — Beginning 2 / 5, Progressing 4 / 9, Mastery 3 / 5.   (Beginning 12 parts ≥ Mastery 10 parts.)
 *
 * How each box is pitched (numbers come from Ryan's Math 15 Lessons 3–8, assignments, extra practice and exit slips — those
 * numbers are possible values):
 *   Beginning  — each lesson's core skill as first taught: finish a factor tree and write the number in exponent form (L3
 *                Ex 2, Ryan's L3 slip); GCF and LCM of two numbers (L3 Ex 3–4, #5–8) and both from given prime
 *                factorizations (Ryan's L3 slip, the L8 toolkit); √ and ∛ of a table number, and square / cube / both /
 *                neither for table numbers (L5 Ex 1–2, #1–3, Ryan's L5 slip); rational or irrational (L4 Ex 3, #4, Ryan's
 *                L4 slip); real or not a real number (L7 §4, Ryan's L7 slip); √n → mixed radical with a small perfect square
 *                (L6 Ex 1, #3, L8 #16).
 *   Progressing — the typical assignment question: GCF of three numbers and LCM of three numbers (L3 Ex 3c, 4c, #6c, #8c,
 *                EP03 #6–7); a GCF sharing problem and an LCM "together again" problem with the time in h/min or min/s
 *                (L3 Ex 5–6, #10–11, L8 #10, EP03 #18); side and perimeter of a square from its area, edge and surface area of
 *                a cube from its volume (L5 §5, EP05 #11); tick every set (N, W, I, Q, Q̄, R) and order a mix of roots,
 *                fractions and decimals (L4 #5, #9, L8 #11–12); trap √n between consecutive whole numbers, say which it is
 *                closer to and mark it on a number line (L5 #4, L8 #14, Ryan's L5 slip); cube, fourth and fifth roots to
 *                mixed form (L7 #2–3, #7, L8 #21, #23); mixed → entire for square roots and cube roots, with a negative
 *                coefficient (L6 #6–7, L7 #5–6, Ryan's L6 and L7 slips).
 *   Mastery    — Math 15's hardest assignment / extra-practice items, clearly easier than the 10C Mastery boxes: the perfect
 *                square / cube test from the prime factorization for numbers past the tables and the smallest multiplier
 *                that makes a perfect square or cube (EP05 #1–4); working backwards with GCF × LCM = a × b (EP03 #10–11);
 *                the largest square plots for a rectangle and how many (L8 Challenge 2, #25, EP03 #17); ordering mixed
 *                radicals without a calculator (L6 Ex 4, #8, L8 #19, EP06 #16, Ryan's L6 slip — he tags it Mastery); find
 *                the error in a worked radical and correct it (L6 Ex 5a, #9, EP06 #6, #8–9, L7 §5); exact side and
 *                perimeter of a square from its area (L6 #11, EP06 #18, #20).
 * Coverage: L3 Q1, Q2, Q6, Q7, Q14, Q15 · L4 Q4a, Q9 · L5 Q3, Q8, Q10, Q13 · L6 Q5, Q12a, Q16, Q17, Q18 · L7 Q4b, Q11,
 *           Q12b, Q17 · L8 review numbers throughout.
 * Not used: a radical with a variable (the Math 15 booklet never puts a variable under a root); the calculator items of L5
 * (nearest hundredth) — replaced by trapping / estimating; GCF-vs-LCM multiple choice (the word problems show the choice).
 * Conversions to online: factor-tree blanks → labelled boxes (the ladder / tree widgets can't be used in a test);
 * "explain the error" → the checkable step the student missed (the perfect-square factor left inside, the coefficient
 * written as a root) plus the corrected answer; tick tables → grids; "plot on a number line" → numplace; ordering → the order
 * widget. Partial credit: one recognized mistake keeps 2/3 or 1/3 (js/partial.js rule); a later box worked correctly from a
 * wrong earlier box isn't counted twice; two different mistakes in one part (u1t-several), two wrong rows of a table
 * (u1t-two-rows: 1/3) or more (u1t-rows: none). */
(function (root) {
  'use strict';
  var HW = root.HW, nt = HW.nt, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'u1t-several': 'Two different mistakes in one question', 'u1t-two-rows': 'Two rows of the table wrong', 'u1t-rows': 'Three or more rows of the table wrong',
    'u1t-tree-box': 'Factor tree: a box doesn’t multiply out',
    'u1t-gcf-lcm': 'Gave the LCM instead of the GCF', 'u1t-gcf-product': 'GCF: multiplied the numbers', 'u1t-gcf-not-greatest': 'A common factor, but not the greatest',
    'u1t-gcf-not-common': 'GCF doesn’t divide every number', 'u1t-gcf-high-power': 'GCF used the higher power of a shared prime',
    'u1t-lcm-gcf': 'Gave the GCF instead of the LCM', 'u1t-lcm-product': 'LCM: multiplied the numbers (not the least)', 'u1t-lcm-not-least': 'A common multiple, but not the least',
    'u1t-lcm-not-multiple': 'LCM isn’t a multiple of every number', 'u1t-lcm-missing-prime': 'LCM left out a prime only one number has', 'u1t-lcm-low-power': 'LCM used the lower power of a prime',
    'u1t-root-half': 'Halved the number instead of taking the square root', 'u1t-root-third': 'Divided by 3 instead of taking the cube root', 'u1t-root-swap': 'Square root and cube root mixed up',
    'u1t-kits-total': 'Gave a total instead of the amount in each group', 'u1t-time-convert': 'Changed to hours/minutes (or minutes/seconds) wrongly',
    'u1t-half-not-root': 'Divided the area by 2 instead of taking the square root', 'u1t-quarter-not-root': 'Divided the area by 4 instead of taking the square root',
    'u1t-perim-two': 'Perimeter: two sides instead of four', 'u1t-perim-area': 'Perimeter worked from the area, not the side',
    'u1t-third-not-root': 'Divided the volume by 3 instead of taking the cube root', 'u1t-sa-one-face': 'Surface area: one face only', 'u1t-sa-faces': 'Surface area: wrong number of faces',
    'u1t-sa-no-square': 'Surface area: edge not squared', 'u1t-sa-volume': 'Gave the volume, not the surface area',
    'u1t-used-cube-root': 'Gave the cube root for the square root', 'u1t-used-square-root': 'Gave the square root for the cube root', 'u1t-root-value': 'Wrong root (exponents not divided correctly)',
    'u1t-said-not-perfect': 'Said “none” for a perfect square/cube', 'u1t-said-perfect': 'Gave a root for a number that isn’t a perfect square/cube',
    'u1t-k-other-power': 'Multiplier makes the other kind of perfect power', 'u1t-k-once': 'Multiplied by each missing prime only once', 'u1t-k-extra': 'Multiplier is the leftover factors, not the missing ones',
    'u1t-k-all': 'Multiplied by one more of every prime', 'u1t-root-of-k': 'Gave the product instead of its root',
    'u1t-other-ratio': 'Divided the LCM by the given number (forgot the GCF)', 'u1t-gl-wrong-pair': 'Multiplied the wrong pair (not GCF × LCM)', 'u1t-other-gcf': 'Other number has the wrong GCF', 'u1t-other-lcm': 'Other number has the wrong LCM',
    'u1t-tile-lcm': 'Used the LCM for the side of the plots', 'u1t-tile-add': 'Added the plots along each side instead of multiplying', 'u1t-tile-area': 'Number of plots: divided the area by the side, not the side squared',
    'u1t-sets-both': 'Ticked both Q and Q-bar', 'u1t-sets-irr': 'Irrational number not put in Q-bar', 'u1t-sets-rat': 'Rational number put in Q-bar', 'u1t-sets-irr-int': 'Irrational number ticked in N, W, I or Q',
    'u1t-sets-zero-N': 'Put 0 in the natural numbers', 'u1t-sets-neg': 'Negative number in N or W', 'u1t-sets-frac': 'Non-integer in N, W or I', 'u1t-sets-Q': 'Rational number not ticked in Q',
    'u1t-sets-nat': 'Natural number missing W or I', 'u1t-sets-zero': '0 missing W or I', 'u1t-sets-negint': 'Negative integer missing I', 'u1t-sets-R': 'A real number not ticked in R',
    'u1t-rat-irr': 'Rational / irrational wrong for one number', 'u1t-real': 'Real / not real wrong for one root', 'u1t-sqcube': 'Square / cube / both / neither wrong for one number',
    'u1t-order-swap': 'Two neighbours swapped in an ordering', 'u1t-order': 'Ordering wrong',
    'u1t-bracket': 'Whole numbers that don’t trap the root', 'u1t-power-not-root': 'Gave a perfect square instead of its root', 'u1t-swapped-bounds': 'Smaller and larger bounds swapped', 'u1t-closer': 'Wrong whole number for “closer to”',
    'u1t-coef-forgot': 'Lost the coefficient in front of the radical', 'u1t-coef-added': 'Added the numbers in front instead of multiplying',
    'u1t-rsq-coef': 'Entire radical: coefficient not squared', 'u1t-err-factor': 'Error: wrong perfect-square factor named', 'u1t-err-power': 'Error: coefficient raised to the wrong power',
    'u1t-err-repeat': 'Repeated the student’s error'
  });
  HW.addPartial({
    'u1t-several': 'n', 'u1t-two-rows': 'b', 'u1t-rows': 'n', 'u1t-tree-box': 's',
    'u1t-gcf-lcm': 'n', 'u1t-gcf-product': 'n', 'u1t-gcf-not-greatest': 'b', 'u1t-gcf-not-common': 'n', 'u1t-gcf-high-power': 'b',
    'u1t-lcm-gcf': 'n', 'u1t-lcm-product': 'b', 'u1t-lcm-not-least': 'b', 'u1t-lcm-not-multiple': 'n', 'u1t-lcm-missing-prime': 'b', 'u1t-lcm-low-power': 'b',
    'u1t-root-half': 'n', 'u1t-root-third': 'n', 'u1t-root-swap': 'b',
    'u1t-kits-total': 'b', 'u1t-time-convert': 's',
    'u1t-half-not-root': 'n', 'u1t-quarter-not-root': 'n', 'u1t-perim-two': 's', 'u1t-perim-area': 'n',
    'u1t-third-not-root': 'n', 'u1t-sa-one-face': 'b', 'u1t-sa-faces': 's', 'u1t-sa-no-square': 'b', 'u1t-sa-volume': 'n',
    'u1t-used-cube-root': 'b', 'u1t-used-square-root': 'b', 'u1t-root-value': 'b', 'u1t-said-not-perfect': 'n', 'u1t-said-perfect': 'n',
    'u1t-k-other-power': 'b', 'u1t-k-once': 'b', 'u1t-k-extra': 'n', 'u1t-k-all': 'b', 'u1t-root-of-k': 'b',
    'u1t-other-ratio': 'n', 'u1t-gl-wrong-pair': 'n', 'u1t-other-gcf': 'n', 'u1t-other-lcm': 'n',
    'u1t-tile-lcm': 'n', 'u1t-tile-add': 'b', 'u1t-tile-area': 'b',
    // one wrong row of a table is one wrong entry (small); two rows: u1t-two-rows; more: u1t-rows
    'u1t-sets-both': 's', 'u1t-sets-irr': 's', 'u1t-sets-rat': 's', 'u1t-sets-irr-int': 's', 'u1t-sets-zero-N': 's', 'u1t-sets-neg': 's', 'u1t-sets-frac': 's',
    'u1t-sets-Q': 's', 'u1t-sets-nat': 's', 'u1t-sets-zero': 's', 'u1t-sets-negint': 's', 'u1t-sets-R': 's', 'u1t-rat-irr': 's', 'u1t-real': 's', 'u1t-sqcube': 's',
    'u1t-order-swap': 's', 'u1t-order': 'n',
    'u1t-bracket': 'n', 'u1t-power-not-root': 'b', 'u1t-swapped-bounds': 's', 'u1t-closer': 'b',
    'u1t-coef-forgot': 'b', 'u1t-coef-added': 'b', 'u1t-rsq-coef': 'b', 'u1t-err-factor': 'b', 'u1t-err-power': 'n', 'u1t-err-repeat': 'n'
  });

  /* ---------- number helpers ---------- */
  function gcd(a, b) { return ex.gcd(a, b); }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function gcfA(a) { return a.reduce(gcd); }
  function lcmA(a) { return a.reduce(lcm); }
  function prodOf(a) { return a.reduce(function (m, x) { return m * x; }, 1); }
  function sortN(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function fVal(f) { return f.reduce(function (m, pe) { return m * Math.pow(pe[0], pe[1]); }, 1); }
  function fTex(f) { var g = f.filter(function (pe) { return pe[1] > 0; }); return g.length ? HW.texFactors(g) : '1'; }
  function fSort(f) { return f.slice().sort(function (a, b) { return a[0] - b[0]; }); }
  function plainFac(n) { return nt.factor(n).map(function (pe) { return pe[1] > 1 ? pe[0] + '^' + pe[1] : String(pe[0]); }).join(' × '); }
  function plainF(f) { return f.filter(function (pe) { return pe[1] > 0; }).map(function (pe) { return pe[1] > 1 ? pe[0] + '^' + pe[1] : String(pe[0]); }).join(' × '); }
  function facEq(n) { return nt.isPrime(n) ? t(F(n)) + ' (prime)' : t(F(n) + '=' + K.fac(n)); }
  function find(gen, test, fallback) { for (var i = 0; i < 800; i++) { var v = gen(); if (v != null && test(v)) return v; } return fallback; }
  function isPow(v, n) { if (v < 0) return false; var c = Math.round(Math.pow(v, 1 / n)); for (var d = Math.max(0, c - 1); d <= c + 1; d++) if (Math.pow(d, n) === v) return true; return false; }
  function intRoot(v, n) { if (v == null || v < 0) return null; var c = Math.round(Math.pow(v, 1 / n)); for (var d = Math.max(0, c - 1); d <= c + 1; d++) if (Math.pow(d, n) === v) return d; return null; }
  function nlist(nums) { var s = nums.map(function (n) { return t(F(n)); }); return s.length === 2 ? s[0] + ' and ' + s[1] : s.slice(0, -1).join(', ') + ' and ' + s[s.length - 1]; }
  function rad(k, n, m) { return ex.texRadical([k, 1], n, m); }
  function rt(n, inner) { return ex.texRoot(n, inner); }
  function rootWord(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n === 4 ? 'fourth' : n === 5 ? 'fifth' : n + 'th'; }
  function powWord(n) { return n === 2 ? 'square' : n === 3 ? 'cube' : n === 4 ? 'fourth power' : n === 5 ? 'fifth power' : n + 'th power'; }
  function normX(s) { return String(s == null ? '' : s).replace(/(\d)\s*[xX]\s*(?=\d)/g, '$1*'); }
  function numOf(s) { var x = normX(s), pn = HW.parse.number(x); if (pn.ok) return pn.value; var pp = HW.parse.product(x); return pp.ok ? pp.value : null; }
  function dec1(v) { return (Math.round(v * 10) / 10).toFixed(1); }

  /* ---------- part wrappers (partial credit) ---------- */
  /* boxes: a later box worked correctly from a wrong earlier one is not a second mistake (follow(i, values) = the value box i
     should have from the student's earlier numbers); two different mistakes in one part → u1t-several (no credit) */
  function fieldsP(prompt, fields, checkers, keys, answer, sol, hints, text, follow) {
    var p = P.fields(prompt, fields, checkers, keys, answer, sol, hints, text), base = p.check;
    p.check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      resp = resp || [];
      var vals = checkers.map(function (c, i) { return numOf(resp[i]); }), codes = [];
      for (var i = 0; i < checkers.length; i++) {
        var ri = checkers[i](resp[i] == null ? '' : resp[i]);
        if (ri.v !== 'wrong') continue;
        if (follow && i > 0) { var e = follow(i, vals); if (e != null && vals[i] != null && Math.abs(vals[i] - e) < 1e-9) continue; }
        var c = ri.code || 'value'; if (c === 'value' || codes.indexOf(c) < 0) codes.push(c);
      }
      return codes.length > 1 ? wrong('u1t-several', res.hint) : res;
    };
    return p;
  }
  /* one wrong row keeps its own code (a small mistake); two rows → u1t-two-rows; three or more → u1t-rows */
  function gridP(prompt, rows, cols, want, why, sol, hints, text, rowHead) {
    var p = P.grid(prompt, rows, cols, want, { why: why, rowHead: rowHead || 'Number' }, sol, hints, text), base = p.check;
    p.check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      resp = resp || {};
      var bad = rows.filter(function (row) { var g = resp[row.id], w = want[row.id]; return Array.isArray(w) ? (g || []).slice().sort().join('|') !== w.slice().sort().join('|') : g !== w; }).length;
      if (bad === 2) return wrong('u1t-two-rows', res.hint + ' (Two rows aren’t right yet.)');
      if (bad > 2) return wrong('u1t-rows', res.hint + ' (' + bad + ' rows aren’t right yet.)');
      return res;
    };
    return p;
  }
  /* ordering: one pair of neighbours swapped is a small mistake; anything else is no credit */
  function orderP(r, prompt, items, why, sol, hints, text) {
    var p = P.order(r, prompt, items, { why: why }, sol, hints, text), base = p.check, ids = items.map(function (x) { return x.id; });
    p.check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      var diff = []; for (var i = 0; i < ids.length; i++) if (resp[i] !== ids[i]) diff.push(i);
      return wrong(diff.length === 2 && diff[1] === diff[0] + 1 ? 'u1t-order-swap' : 'u1t-order', res.hint);
    };
    var sw = ids.slice(); sw[1] = ids[2]; sw[2] = ids[1];
    p.bad = [ids.slice().reverse(), sw];
    return p;
  }

  /* ---------- checkers ---------- */
  /* n as a product of primes (exp: 'either' or 'required'); a bare number equal to n is a format slip */
  function prodChk(n, exp) {
    var c = K.product(n, exp || 'either');
    return function (resp) {
      var s = normX(resp), pn = HW.parse.number(s);
      if (pn.ok && pn.value === n && !nt.isPrime(n)) return form('as-number', 'Right value — now write it as a product of prime factors' + (exp === 'required' ? ' in exponent form' : '') + ', like ' + t('2^{3}\\times 3') + '.');
      return c(s);
    };
  }
  function numChk(n, alts, extra) {
    return K.number(n, function (v) {
      for (var i = 0; i < (alts || []).length; i++) if (v === alts[i].v && v !== n) return { code: alts[i].code, hint: alts[i].hint };
      return extra ? extra(v) : null;
    });
  }
  /* a whole number, or a product of primes with that value */
  function valChk(target, diag) {
    return function (resp) {
      var s = normX(resp), pn = HW.parse.number(s), v = null;
      if (pn.ok) v = pn.value; else { var p = HW.parse.product(s); if (p.ok) v = p.value; else return form(pn.code === 'empty' ? 'empty' : 'notnumber', pn.code === 'empty' ? 'Type your answer first.' : 'Type a whole number (or a product such as ' + t('2^{2}\\times 3') + ').'); }
      if (v === target) return ok();
      var h = diag ? diag(v) : null;
      return h ? wrong(h.code, h.hint) : wrong('value', null);
    };
  }
  function gcfDiag(nums) {
    var g = gcfA(nums), L = lcmA(nums), pr = prodOf(nums), mn = Math.min.apply(null, nums);
    return function (v) {
      if (v === L && L !== g) return { code: 'u1t-gcf-lcm', hint: 'That’s the <b>lowest common multiple</b>. The GCF is the largest number that divides <b>into</b> every one of them, so it can’t be bigger than ' + t(F(mn)) + '.' };
      if (v === pr && pr !== g) return { code: 'u1t-gcf-product', hint: 'Multiplying the numbers gives a common <b>multiple</b>, not a common factor. The GCF has to divide into each number.' };
      if (!(v > 0) || v % 1) return null;
      var miss = nums.filter(function (n) { return n % v; });
      if (!miss.length) return { code: 'u1t-gcf-not-greatest', hint: t(F(v)) + ' divides into every number, but it isn’t the <b>greatest</b> common factor. Use every shared prime, at its lowest power.' };
      return { code: 'u1t-gcf-not-common', hint: t(F(v)) + ' doesn’t divide evenly into ' + t(F(miss[0])) + ', so it isn’t a common factor.' };
    };
  }
  function lcmDiag(nums) {
    var g = gcfA(nums), L = lcmA(nums), pr = prodOf(nums), mx = Math.max.apply(null, nums);
    return function (v) {
      if (v === g && g !== L) return { code: 'u1t-lcm-gcf', hint: 'That’s the <b>greatest common factor</b>. The LCM is a common <b>multiple</b>: every number divides into it, so it is at least ' + t(F(mx)) + '.' };
      if (v === pr && pr !== L) return { code: 'u1t-lcm-product', hint: 'Multiplying the numbers gives <i>a</i> common multiple, but not the <b>lowest</b> one: shared primes got counted twice. Use each prime once, at its highest power.' };
      if (!(v > 0) || v % 1) return null;
      var miss = nums.filter(function (n) { return v % n; });
      if (!miss.length) return { code: 'u1t-lcm-not-least', hint: t(F(v)) + ' is a common multiple, but not the <b>lowest</b> one. Use each prime once, at its highest power.' };
      return { code: 'u1t-lcm-not-multiple', hint: t(F(miss[0])) + ' doesn’t divide evenly into ' + t(F(v)) + ', so it isn’t a common multiple.' };
    };
  }
  /* the k-th root as a whole number, or "none" when the number isn't a perfect k-th power */
  function isNo(s) { return /^(no|none|nope|not|neither|n\/a|-+|—)(\s.*|\.)?$/.test(s); }
  function isYes(s) { return /^(yes|y|yep)\b/.test(s); }
  function rootOrNone(root, k, nTex, diag) {
    var word = rootWord(k), vc = root != null ? valChk(root, diag) : null, test = k === 2 ? 'even' : 'a multiple of ' + t('3');
    return function (resp) {
      var s = String(resp == null ? '' : resp).trim().toLowerCase().replace(/\\text\{\s*([^{}]*)\}/g, '$1').trim();
      if (!s) return form('empty', 'Type the ' + word + ' root, or <b>none</b> if it is not a perfect ' + word + '.');
      if (isNo(s)) return root == null ? ok() : wrong('u1t-said-not-perfect', 'Look at the exponents in the prime factorization: are they all ' + test + '? Then ' + t(nTex) + ' <b>is</b> a perfect ' + word + '.');
      if (isYes(s)) return root != null ? form('yes-root', 'Right, it is a perfect ' + word + ' — now type the ' + word + ' root itself.') : wrong('u1t-said-perfect', 'Check the exponents in the prime factorization: are they <b>all</b> ' + test + '?');
      if (root == null) {
        var s2 = normX(s), pn = HW.parse.number(s2), pp = HW.parse.product(s2);
        if (!pn.ok && !pp.ok) return form('notnumber', 'Type a number, or <b>none</b>.');
        var v = pn.ok ? pn.value : pp.value, big = Math.pow(v, k);
        return wrong('u1t-said-perfect', (v % 1 ? '' : (big < 1e12 ? t(F(v) + '^{' + k + '}=' + F(big)) + ', not ' + t(nTex) + '. ' : '')) + 'Look at the exponents in the prime factorization: are they all ' + test + '? If not, there is no whole-number ' + word + ' root — type <b>none</b>.');
      }
      return vc(s);
    };
  }

  /* ---------- figures ---------- */
  function svgBox(w, h, body, label) {
    return '<div style="margin:.4em 0 .2em"><svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" style="max-width:' + w + 'px;display:block" role="img" aria-label="' + HW.esc(label) + '" fill="none" stroke="currentColor" stroke-width="1.5" font-size="16" font-family="KaTeX_Main,\'Times New Roman\',serif">' + body + '</svg></div>';
  }
  function txt(x, y, s, o) { o = o || {}; return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" fill="' + (o.fill || 'currentColor') + '" stroke="none" text-anchor="middle" dominant-baseline="central"' + (o.size ? ' font-size="' + o.size + '"' : '') + (o.it ? ' font-style="italic"' : '') + '>' + s + '</text>'; }
  var TREE_POS = { r: [0, 0], a: [-1.9, -1.25], b: [1.6, -1.25], a1: [-2.75, -2.6], a2: [-1.05, -2.6], b1: [0.75, -2.6], b2: [2.45, -2.6], c1: [0, -3.95], c2: [1.25, -3.95], e1: [2.1, -3.95], e2: [2.95, -3.95] };
  var TREE_EDGES = [['r', 'a'], ['r', 'b'], ['a', 'a1'], ['a', 'a2'], ['b', 'b1'], ['b', 'b2'], ['b1', 'c1'], ['b1', 'c2'], ['b2', 'e1'], ['b2', 'e2']];
  function treeSvg(lab) {
    var S = 62, X = function (x) { return (x + 3.35) * S; }, Y = function (y) { return 20 - y * S; }, body = '';
    TREE_EDGES.forEach(function (e) { var p = TREE_POS[e[0]], q = TREE_POS[e[1]]; body += '<line x1="' + X(p[0]).toFixed(1) + '" y1="' + (Y(p[1]) + 13).toFixed(1) + '" x2="' + X(q[0]).toFixed(1) + '" y2="' + (Y(q[1]) - 15).toFixed(1) + '"/>'; });
    Object.keys(TREE_POS).forEach(function (id) {
      var p = TREE_POS[id], L = lab[id], x = X(p[0]), y = Y(p[1]);
      if (L.box) body += '<rect x="' + (x - 21).toFixed(1) + '" y="' + (y - 14).toFixed(1) + '" width="42" height="28" rx="3" stroke-width="1.4"/>' + txt(x, y, L.box, { size: 13, fill: '#8a91a0', it: true });
      else body += txt(x, y, F(L.v, true));
    });
    return svgBox(Math.round(6.7 * S), Math.round(3.95 * S + 40), body, 'factor tree with four blank boxes A, B, C and D');
  }

  /* ---------- radicals ---------- */
  /* [k, m] for k·ⁿ√m with k in kr, m from 2–15 with no perfect n-th power factor, and kⁿ·m between lo and hi */
  function radPool(n, kr, lo, hi) { var o = []; for (var k = kr[0]; k <= kr[1]; k++) for (var m = 2; m <= 15; m++) { var N = Math.pow(k, n) * m; if (ex.simplest(m, n) && N >= lo && N <= hi) o.push([k, m]); } return o; }
  var BEG_RAD = radPool(2, [2, 7], 8, 100); // √8 … √99: the Lesson 6 Example 1 / #3 radicals
  function pick3(r, pool) { return r.sample(pool, 3).sort(function (a, b) { return a[0] * a[0] * a[1] - b[0] * b[0] * b[1]; }); }
  function mixedSol(k, n, m) { var big = Math.pow(k, n); return t(rt(n, F(big * m)) + '=' + rt(n, big + '\\times ' + m) + '=' + rt(n, big) + '\\times ' + rt(n, m) + '=' + rad(k, n, m)) + (n > 2 ? ' (' + t(k + '^{' + n + '}=' + big) + ')' : '') + '. ' + t(m) + ' has no perfect ' + powWord(n) + ' factor left, so this is simplest form.'; }
  function mixedPart(k, n, m) {
    return P.radical('Write ' + t(rt(n, F(Math.pow(k, n) * m))) + ' as a mixed radical in simplest form.', { k: k, n: n, m: m }, 'mixed', mixedSol(k, n, m),
      ['Find the <b>largest</b> perfect ' + powWord(n) + ' that divides ' + t(F(Math.pow(k, n) * m)) + (n === 2 ? ' (4, 9, 16, 25, 36, 49, …)' : n === 3 ? ' (8, 27, 64, 125, …)' : n === 4 ? ' (16, 81, 256, …)' : ' (32, 243, …)') + '.', 'Its ' + rootWord(n) + ' root comes out in front of the radical.'], 'mixed radical of ' + rootWord(n) + ' root ' + Math.pow(k, n) * m);
  }
  function entireSol(k, n, m) { var a = Math.abs(k), neg = k < 0; return t(rad(k, n, m) + '=' + rt(n, (neg ? '(-' + a + ')' : a) + '^{' + n + '}\\times ' + m) + '=' + rt(n, (neg ? '-' : '') + Math.pow(a, n) + '\\times ' + m) + '=' + rt(n, (neg ? '-' : '') + F(Math.pow(a, n) * m))) + '.' + (n === 3 ? ' With index ' + t('3') + ', the coefficient is <b>cubed</b>' + (neg ? ', and a negative cubed stays negative.' : '.') : ' With a square root, the coefficient is <b>squared</b>.'); }
  function entirePart(k, n, m) {
    var p = P.radical('Write ' + t(rad(k, n, m)) + ' as an entire radical.', { k: k, n: n, m: m }, 'entire', entireSol(k, n, m),
      ['Write the coefficient as a ' + rootWord(n) + ' root: ' + t(Math.abs(k) + '=' + rt(n, Math.pow(Math.abs(k), n))) + '.', 'Then multiply the numbers under one radical' + (k < 0 ? ' — a negative cubed stays negative.' : '.')], 'entire radical of ' + k + ' root' + n + ' ' + m);
    var a = Math.abs(k), sg = k < 0 ? '-' : '';
    p.bad = [rt(n, sg + (a * m)), rt(n, sg + (a * a * m))].filter(function (b) { return b !== p.key; });
    return p;
  }

  /* ---------- Q2c / Q14: exponent-form GCF and LCM ---------- */
  function exOf(f, p) { var q = f.filter(function (x) { return x[0] === p; })[0]; return q ? q[1] : 0; }

  /* ---------- Q3b: square / cube / both / neither (table numbers) ---------- */
  var SQ_ONLY = [4, 9, 16, 25, 36, 49, 81, 100, 121, 144, 169, 196, 225], CU_ONLY = [8, 27, 125, 216, 343, 512, 1000], BOTH = [1, 64, 729], NEITHER = [12, 18, 20, 32, 48, 50, 60, 72, 90, 120, 150, 200, 300];

  /* ---------- Q13: perfect square / cube test past the tables ---------- */
  var BIG_SQ = [256, 324, 400, 441, 576, 784, 900, 1225, 1296, 1764, 2025, 3600], NEI_A = [540, 600, 720, 864, 972, 980, 1080, 1176, 1620],
    BIG_CU = [729, 1331, 1728, 2197, 2744, 3375, 4096, 5832, 8000], NEI_B = [1125, 1200, 1350, 1440, 1500, 1800, 2000, 2160, 2400, 2700, 3000, 4000];
  function testPart(n) {
    var f = nt.factor(n), e = f.map(function (pe) { return pe[1]; }), sq = e.every(function (x) { return x % 2 === 0; }), cu = e.every(function (x) { return x % 3 === 0; });
    var sr = sq ? intRoot(n, 2) : null, cr = cu ? intRoot(n, 3) : null, srF = f.map(function (pe) { return [pe[0], pe[1] / 2]; }), crF = f.map(function (pe) { return [pe[0], pe[1] / 3]; });
    var label = sq && cu ? 'both' : sq ? 'a perfect square (not a cube)' : cu ? 'a perfect cube (not a square)' : 'neither';
    var odd = e.filter(function (x) { return x % 2; })[0], non3 = e.filter(function (x) { return x % 3; })[0];
    var d2 = function (v) {
      if (cr != null && v === cr) return { code: 'u1t-used-cube-root', hint: 'That’s the <b>cube</b> root. For the square root, divide each exponent by ' + t('2') + '.' };
      if (v === n / 2) return { code: 'u1t-root-half', hint: 'A square root isn’t half the number. Halve each <b>exponent</b> in the prime factorization.' };
      if (v > 0 && v % 1 === 0 && v * v < 1e12) return { code: 'u1t-root-value', hint: t(F(v) + '^{2}=' + F(v * v)) + ', not ' + t(F(n)) + '. Halve each exponent in the prime factorization.' };
      return null;
    };
    var d3 = function (v) {
      if (sr != null && v === sr) return { code: 'u1t-used-square-root', hint: 'That’s the <b>square</b> root. For the cube root, divide each exponent by ' + t('3') + '.' };
      if (v === n / 3) return { code: 'u1t-root-third', hint: 'A cube root isn’t a third of the number. Divide each <b>exponent</b> by ' + t('3') + '.' };
      if (v > 0 && v % 1 === 0 && v * v * v < 1e12) return { code: 'u1t-root-value', hint: t(F(v) + '^{3}=' + F(v * v * v)) + ', not ' + t(F(n)) + '. Divide each exponent in the prime factorization by ' + t('3') + '.' };
      return null;
    };
    var sol = t(F(n) + '=' + K.fac(n)) + '.<br><b>Square?</b> ' + (sq ? 'Every exponent is even, so it <b>is</b> a perfect square: ' + t('\\sqrt{' + F(n) + '}=' + fTex(srF) + '=' + F(sr)) + '.' : 'The exponent ' + t(odd) + ' is odd, so it is <b>not</b> a perfect square.') +
      '<br><b>Cube?</b> ' + (cu ? 'Every exponent is a multiple of ' + t('3') + ', so it <b>is</b> a perfect cube: ' + t('\\sqrt[3]{' + F(n) + '}=' + fTex(crF) + '=' + F(cr)) + '.' : 'The exponent ' + t(non3) + ' is not a multiple of ' + t('3') + ', so it is <b>not</b> a perfect cube.') +
      '<br>So ' + t(F(n)) + ' is <b>' + label + '</b>.';
    var p = fieldsP('Is ' + t(F(n)) + ' a perfect square, a perfect cube, both, or neither? Write its prime factorization, then give each root that is a whole number. Type <b>none</b> for a root that is not a whole number.',
      [{ name: 'Prime factorization', before: t(F(n) + '='), mode: 'math', wide: true }, { name: 'Square root', before: t('\\sqrt{' + F(n) + '}='), mode: 'math', none: true }, { name: 'Cube root', before: t('\\sqrt[3]{' + F(n) + '}='), mode: 'math', none: true }],
      [prodChk(n, 'either'), rootOrNone(sr, 2, F(n), d2), rootOrNone(cr, 3, F(n), d3)], [plainFac(n), sq ? String(sr) : 'none', cu ? String(cr) : 'none'],
      t(F(n) + '=' + K.fac(n)) + ' — ' + label + (sq ? '; ' + t('\\sqrt{' + F(n) + '}=' + F(sr)) : '') + (cu ? '; ' + t('\\sqrt[3]{' + F(n) + '}=' + F(cr)) : ''), sol,
      ['Factor ' + t(F(n)) + ' into primes and look at the exponents.', 'A perfect square has every exponent even; a perfect cube has every exponent a multiple of ' + t('3') + '. Divide the exponents by ' + t('2') + ' or ' + t('3') + ' to get the root.'],
      'square/cube test: ' + n);
    p.bad = [[plainFac(n), sq ? 'none' : '2', cu ? 'none' : '2'], [plainFac(n), sq ? String(sr + 1) : 'none', cu ? String(cr + 1) : 'none'], [plainFac(n), cu ? String(cr) : 'none', sq ? String(sr) : 'none']].filter(function (b) { return b.join('|') !== p.key.join('|'); });
    return p;
  }
  function powerUp(f, k) {
    var kf = f.map(function (pe) { return [pe[0], (k - pe[1] % k) % k]; }), up = f.map(function (pe) { return [pe[0], pe[1] + (k - pe[1] % k) % k]; });
    return { kf: kf, k: fVal(kf), up: up, rootF: up.map(function (pe) { return [pe[0], pe[1] / k]; }), root: fVal(up.map(function (pe) { return [pe[0], pe[1] / k]; })) };
  }

  /* ---------- Q4a: rational or irrational ---------- */
  var RAT_COLS = [{ id: 'Q', html: t('Q') + ' rational', label: 'Q' }, { id: 'Qb', html: t('\\overline{Q}') + ' irrational', label: 'Q-bar' }];
  /* ---------- Q4b: real or not ---------- */
  var REAL_COLS = [{ id: 'R', html: 'Real number', label: 'real' }, { id: 'X', html: 'Not a real number', label: 'not real' }];

  /* ---------- Q9: real-number sets (the booklet's six columns) ---------- */
  var SET_COLS = [{ id: 'N', html: t('N'), label: 'N' }, { id: 'W', html: t('W'), label: 'W' }, { id: 'I', html: t('I'), label: 'I' }, { id: 'Q', html: t('Q'), label: 'Q' }, { id: 'Qb', html: t('\\overline{Q}'), label: 'Q-bar' }, { id: 'R', html: t('R'), label: 'R' }];
  var SETS = { nat: ['N', 'W', 'I', 'Q', 'R'], zero: ['W', 'I', 'Q', 'R'], negint: ['I', 'Q', 'R'], frac: ['Q', 'R'], irr: ['Qb', 'R'] };
  var SET_TEX = { N: 'N', W: 'W', I: 'I', Q: 'Q', Qb: '\\overline{Q}', R: 'R' };
  function setHint(c, got) {
    got = got || []; var has = function (x) { return got.indexOf(x) >= 0; }, X = t(c.tex), why = c.note ? ' (' + t(c.note) + ')' : '';
    if (has('Q') && has('Qb')) return { code: 'u1t-sets-both', hint: 'A number is rational <b>or</b> irrational, never both. Decide which one ' + X + ' is.' };
    if (c.cls === 'irr' && !has('Qb')) return { code: 'u1t-sets-irr', hint: X + ' is irrational' + why + ': its decimal never ends and never repeats.' };
    if (c.cls !== 'irr' && has('Qb')) return { code: 'u1t-sets-rat', hint: X + ' is rational' + why + ': it can be written as a fraction of integers.' };
    if (c.cls === 'irr' && (has('N') || has('W') || has('I') || has('Q'))) return { code: 'u1t-sets-irr-int', hint: 'An irrational number belongs only to ' + t('\\overline{Q}') + ' and ' + t('R') + ': ' + t('N') + ', ' + t('W') + ', ' + t('I') + ' and ' + t('Q') + ' hold only rational numbers.' };
    if (c.cls === 'zero' && has('N')) return { code: 'u1t-sets-zero-N', hint: t('0') + ' is a whole number, but the natural numbers start at ' + t('1') + '.' };
    if (c.cls === 'negint' && (has('N') || has('W'))) return { code: 'u1t-sets-neg', hint: X + why + ' is negative. Natural and whole numbers are never negative.' };
    if (c.cls === 'frac' && (has('N') || has('W') || has('I'))) return { code: 'u1t-sets-frac', hint: X + why + ' is not an integer, so it isn’t in ' + t('N') + ', ' + t('W') + ' or ' + t('I') + '.' };
    if (c.cls !== 'irr' && !has('Q')) return { code: 'u1t-sets-Q', hint: X + why + ' can be written as a fraction of integers' + (c.cls !== 'frac' ? ' (every integer can: ' + t('n=\\frac{n}{1}') + ')' : '') + ', so it is rational.' };
    if (c.cls === 'nat' && !(has('N') && has('W') && has('I'))) return { code: 'u1t-sets-nat', hint: X + why + ' is a natural (counting) number, so it is also a whole number and an integer.' };
    if (c.cls === 'zero' && !(has('W') && has('I'))) return { code: 'u1t-sets-zero', hint: t('0') + ' is a whole number and an integer.' };
    if (c.cls === 'negint' && !has('I')) return { code: 'u1t-sets-negint', hint: X + why + ' is a negative integer.' };
    if (!has('R')) return { code: 'u1t-sets-R', hint: 'Every number in this table is a <b>real</b> number: tick ' + t('R') + ' too.' };
    return null;
  }
  function setList(s) { return t(s.map(function (x) { return SET_TEX[x]; }).join(',\\ ')); }

  /* ---------- Q9b: order a mix of numbers ---------- */
  function mixShared(r) {
    var fb = [{ id: 'ns', tex: '-\\sqrt{9}', v: -3, why: '-\\sqrt{9}=-3' }, { id: 'nd', tex: '-2.5', v: -2.5 }, { id: 'fr', tex: '\\dfrac{1}{2}', v: 0.5, why: '\\frac{1}{2}=0.5' }, { id: 'pd', tex: '0.8', v: 0.8 }, { id: 'rt', tex: '\\sqrt{3}', v: Math.sqrt(3), why: '1<\\sqrt{3}<2', n: 3 }, { id: 'w', tex: '2', v: 2 }];
    return find(function () {
      var k = r.int(2, 4), n = r.pick([2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15]), fr = r.pick([[1, 2], [3, 4], [1, 4], [2, 5], [3, 2], [5, 4], [2, 3], [1, 3], [5, 2]]);
      var d = r.pick([-3.5, -2.5, -1.5, -0.5, -1.2, -2.8, -0.7, -1.8]), dd = r.pick([0.3, 0.6, 0.8, 1.5, 2.5, 1.2, 2.2, 3.5, 2.8]), w = r.pick([0, 1, 2, 3, -1, 4]);
      var lo = Math.floor(Math.sqrt(n)), frd = fr[0] / fr[1];
      return r.shuffle([{ id: 'ns', tex: '-\\sqrt{' + k * k + '}', v: -k, why: '-\\sqrt{' + k * k + '}=-' + k },
        { id: 'nd', tex: String(d), v: d }, { id: 'rt', tex: '\\sqrt{' + n + '}', v: Math.sqrt(n), why: lo + '<\\sqrt{' + n + '}<' + (lo + 1), n: n },
        { id: 'fr', tex: '\\dfrac{' + fr[0] + '}{' + fr[1] + '}', v: frd, why: '\\frac{' + fr[0] + '}{' + fr[1] + '}=' + (fr[1] === 3 ? (fr[0] === 1 ? '0.\\overline{3}' : '0.\\overline{6}') : String(frd)) },
        { id: 'pd', tex: String(dd), v: dd }, { id: 'w', tex: String(w), v: w }]);
    }, function (its) { var vs = its.map(function (x) { return x.v; }).sort(function (a, b) { return a - b; }); for (var i = 0; i + 1 < vs.length; i++) if (vs[i + 1] - vs[i] < 0.2) return false; return true; }, fb);
  }

  /* ---------- Q16: compare radicals ---------- */
  function cmpShared(r) {
    var fb = [{ id: 'm1', tex: '4\\sqrt{3}', v: 48, a: 4, b: 3 }, { id: 'm2', tex: '2\\sqrt{10}', v: 40, a: 2, b: 10 }, { id: 'e', tex: '\\sqrt{50}', v: 50 }, { id: 'm3', tex: '3\\sqrt{6}', v: 54, a: 3, b: 6 }];
    return find(function () {
      var N0 = r.int(28, 90), lo = N0 - 9, hi = N0 + 9, mixed = [];
      [2, 3, 4, 5, 6].forEach(function (a) { [2, 3, 5, 6, 7, 10, 11, 13, 14, 15].forEach(function (b) { var v = a * a * b; if (v >= lo && v <= hi) mixed.push({ a: a, b: b, v: v }); }); });
      if (mixed.length < 3) return null;
      var three = r.sample(mixed, 3), vs = three.map(function (x) { return x.v; });
      if (vs[0] === vs[1] || vs[0] === vs[2] || vs[1] === vs[2]) return null;
      var ents = []; for (var N = lo; N <= hi; N++) if (!isPow(N, 2) && vs.indexOf(N) < 0) ents.push(N);
      if (!ents.length) return null;
      var e = r.pick(ents);
      return r.shuffle(three.map(function (x, i) { return { id: 'm' + (i + 1), tex: x.a + '\\sqrt{' + x.b + '}', v: x.v, a: x.a, b: x.b }; }).concat([{ id: 'e', tex: '\\sqrt{' + e + '}', v: e }]));
    }, function () { return true; }, fb);
  }

  /* ---------- Q17: the student's error ---------- */
  var NAMES = ['Priya', 'Sanjay', 'Nadia', 'Ravi', 'Jonah', 'Maya', 'Liam', 'Ava'];
  function errShared(r) {
    var kind = r.pick(['sq', 'sq', 'ent', 'cube']), who = r.pick(NAMES);
    if (kind === 'sq') return find(function () { var q = r.pick([2, 2, 3, 4]), f = r.pick([2, 3]), m = r.pick([2, 3, 5, 6, 7]); return { kind: kind, who: who, q: q, f: f, m: m, rest: f * f * m, N: q * q * f * f * m }; },
      function (s) { return s.N >= 48 && s.N <= 800; }, { kind: kind, who: who, q: 2, f: 3, m: 3, rest: 27, N: 108 });
    if (kind === 'ent') { var k = r.int(3, 10), m = r.pick([2, 3, 5, 6, 7]); return { kind: kind, who: who, k: k, m: m }; }
    var c = r.int(2, 5), mc = r.pick([2, 3, 4, 5, 6, 7].filter(function (x) { return x !== c; })); return { kind: kind, who: who, k: c, m: mc };
  }
  function errWork(s) {
    if (s.kind === 'sq') return t('\\sqrt{' + s.N + '}=\\sqrt{' + s.q * s.q + '\\times ' + s.rest + '}=' + s.q + '\\sqrt{' + s.rest + '}');
    if (s.kind === 'ent') return t(s.k + '\\sqrt{' + s.m + '}=\\sqrt{' + s.k + '\\times ' + s.m + '}=\\sqrt{' + s.k * s.m + '}');
    return t(s.k + '\\sqrt[3]{' + s.m + '}=\\sqrt[3]{' + s.k + '^{2}\\times ' + s.m + '}=\\sqrt[3]{' + s.k * s.k * s.m + '}');
  }

  HW.defineTest({
    id: 'u1test', unit: 1, title: 'Unit 1 Test', outcome: 'AN1', calc: false,
    blurb: 'The Unit 1 outcomes-based test: AN1 (prime factorization, GCF and LCM, perfect squares and cubes, square and cube roots) and AN2 (the real number system, estimating roots, entire and mixed radicals), each in Beginning, Progressing and Mastery boxes. No calculator.',
    // Short version (~half): every AN1/AN2 box keeps 2+ parts, one question per lesson skill (factor tree, roots, rational/real, mixed radicals, GCF/LCM problems, estimating, higher-root radicals, perfect-power test, ordering radicals); drops the near-duplicate GCF/LCM sets (Q2, Q6, Q14, Q15), the area/volume roots (Q8), the set table (Q9), entire radicals (Q12, covered by Q16a) and the extra Mastery items (Q17, Q18).
    short: ['1', '3', '4', '5', '7', '10', '11', '13', '16'],
    questions: [
      /* ======================= Beginning ======================= */
      { num: '1', outcome: 'AN1',
        shared: function (r) {
          return find(function () {
            var ap = sortN([r.pick([2, 3, 5, 7]), r.pick([2, 3, 5, 7])]), cp = sortN([r.pick([2, 3, 5, 7]), r.pick([2, 3, 5, 7])]), p = r.pick([2, 3, 5]);
            var A = ap[0] * ap[1], C = cp[0] * cp[1], D = p * p, B = C * D;
            return { ap: ap, cp: cp, p: p, A: A, B: B, C: C, D: D, N: A * B };
          }, function (s) { return s.N >= 96 && s.N <= 900 && s.C !== s.D && s.A !== s.B && s.A !== s.C && s.A !== s.D; }, { ap: [2, 3], cp: [2, 5], p: 2, A: 6, B: 40, C: 10, D: 4, N: 240 });
        },
        stem: function (s) { return 'Here is a factor tree for ' + t(F(s.N)) + ' with four blank boxes.' + treeSvg({ r: { v: s.N }, a: { box: 'A' }, b: { v: s.B }, a1: { v: s.ap[0] }, a2: { box: 'B' }, b1: { v: s.C }, b2: { box: 'C' }, c1: { box: 'D' }, c2: { v: s.cp[1] }, e1: { v: s.p }, e2: { v: s.p } }); },
        parts: [
          { id: '1a', outcome: 'AN1', level: 'BEG', make: function (r, s) {
            var box = function (val, sib, parentName) {
              return K.number(val, function (v) { if (!(v > 0) || v % 1) return null; return { code: 'u1t-tree-box', hint: 'Check: ' + t(F(v) + '\\times ' + F(sib) + '=' + F(v * sib)) + ', but the two branches must multiply to ' + parentName + '.' }; });
            };
            var p = fieldsP('Fill in the four blank boxes to complete the factor tree for ' + t(F(s.N)) + '.',
              [{ name: 'Box A', label: 'Box A:' }, { name: 'Box B', label: 'Box B:' }, { name: 'Box C', label: 'Box C:' }, { name: 'Box D', label: 'Box D:' }],
              [box(s.A, s.B, t(F(s.N))), box(s.ap[1], s.ap[0], 'the number in Box A'), box(s.D, s.C, t(F(s.B))), box(s.cp[0], s.cp[1], t(s.C))],
              [String(s.A), String(s.ap[1]), String(s.D), String(s.cp[0])], 'A ' + t('=' + s.A) + ', B ' + t('=' + s.ap[1]) + ', C ' + t('=' + s.D) + ', D ' + t('=' + s.cp[0]),
              'The two branches under a number multiply to give that number.<br>Box A: ' + t(F(s.N) + '\\div ' + s.B + '=' + s.A) + '.<br>Box B: ' + t(s.A + '\\div ' + s.ap[0] + '=' + s.ap[1]) + '.<br>Box C: ' + t(s.B + '\\div ' + s.C + '=' + s.D) + ' (and ' + t(s.p + '\\times ' + s.p + '=' + s.D) + ' ✓).<br>Box D: ' + t(s.C + '\\div ' + s.cp[1] + '=' + s.cp[0]) + '.',
              ['The two numbers under a branch multiply to give the number above them.', 'So each blank is the number above it divided by its partner.'], 'factor tree boxes for ' + s.N,
              function (i, v) { return i === 1 && v[0] ? v[0] / s.ap[0] : null; });
            p.bad = [[String(s.A * 2), String(s.ap[1]), String(s.D), String(s.cp[0])], [String(s.A), String(s.ap[1]), String(s.D + 1), String(s.cp[0])]];
            return p;
          } },
          { id: '1b', outcome: 'AN1', level: 'BEG', make: function (r, s) {
            var N = s.N, leaves = [s.ap[0], s.ap[1], s.cp[0], s.cp[1], s.p, s.p].sort(function (a, b) { return a - b; });
            var swapP = leaves[0] === 2 ? 3 : 2, swapped = [swapP].concat(leaves.slice(1));
            return { prompt: 'Write ' + t(F(N)) + ' as a product of prime factors in <b>exponent form</b>.', input: { type: 'math', before: t(F(N) + '=') }, check: prodChk(N, 'required'), key: K.fac(N), answer: t(F(N) + '=' + K.fac(N)), text: 'tree: exponent form of ' + N,
              bad: [swapped.join(' × ')],
              solution: 'The primes at the ends of the branches are ' + t(leaves.join(',\\ ')) + '.<br>' + t(F(N) + '=' + K.exp(N) + '=' + K.fac(N)),
              hints: ['Collect every prime at the end of a branch (fill in the boxes first).', 'Write a repeated prime with an exponent, e.g. ' + t('2\\times 2\\times 2=2^{3}') + '.'] };
          } }] },
      { num: '2', outcome: 'AN1', stem: 'Greatest common factor (GCF) and lowest common multiple (LCM). Use any method.', parts: [
        { id: '2a', outcome: 'AN1', level: 'BEG', make: function (r) {
          return gcfPart(find(function () { var g = r.pick([4, 6, 8, 9, 12, 14, 15, 18]), xy = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [4, 7], [5, 6], [2, 7]]); return [g * xy[0], g * xy[1]]; }, function (v) { return v[1] <= 110 && v[0] >= 12; }, [24, 42]));
        } },
        { id: '2b', outcome: 'AN1', level: 'BEG', make: function (r) {
          return lcmPart(find(function () { return sortN(r.sample([4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21], 2)); }, function (v) { return gcd(v[0], v[1]) > 1 && v[1] % v[0] !== 0 && lcm(v[0], v[1]) <= 120; }, [12, 18]));
        } },
        { id: '2c', outcome: 'AN1', level: 'BEG', make: function (r) {
          var s = find(function () {
            var mk = function () { return [[2, r.int(0, 3)], [3, r.int(0, 2)], [5, r.int(0, 1)], [7, r.chance(0.3) ? 1 : 0]].filter(function (pe) { return pe[1] > 0; }); };
            return { af: mk(), bf: mk() };
          }, function (s) { var A = fVal(s.af), B = fVal(s.bf), G = gcd(A, B); return A >= 12 && B >= 12 && A <= 200 && B <= 200 && A < B && B % A !== 0 && G > 1 && !nt.isPrime(G) && lcm(A, B) <= 600 && s.af.length > 1 && s.bf.length > 1; }, { af: [[2, 2], [3, 1], [5, 1]], bf: [[2, 2], [3, 1], [7, 1]] });
          var A = fVal(s.af), B = fVal(s.bf), G = gcd(A, B), L = lcm(A, B), primes = nt.factor(L).map(function (pe) { return pe[0]; });
          var hiShared = fVal(nt.factor(G).map(function (pe) { return [pe[0], Math.max(exOf(s.af, pe[0]), exOf(s.bf, pe[0]))]; }));
          var lowAll = fVal(primes.map(function (p) { var es = [exOf(s.af, p), exOf(s.bf, p)].filter(function (x) { return x > 0; }); return [p, Math.min.apply(null, es)]; }));
          var gd = function (v) { if (v === L) return { code: 'u1t-gcf-lcm', hint: 'That’s the LCM. The GCF uses only the primes in <b>both</b> numbers, each at the <b>lower</b> power.' }; if (v === hiShared && hiShared !== G) return { code: 'u1t-gcf-high-power', hint: 'Right primes, but the GCF takes each shared prime at its <b>lower</b> power.' }; return null; };
          var ld = function (v) { if (v === G) return { code: 'u1t-lcm-gcf', hint: 'That’s the GCF. The LCM uses <b>every</b> prime in either number, each at the <b>higher</b> power.' }; if (v === A * B) return { code: 'u1t-lcm-product', hint: t(F(A) + '\\times ' + F(B)) + ' is a common multiple, but not the lowest one: use each prime once, at its higher power.' }; if (v === hiShared) return { code: 'u1t-lcm-missing-prime', hint: 'The LCM needs every prime that appears in <b>either</b> number — including the ones only one of them has.' }; if (v === lowAll && lowAll !== L) return { code: 'u1t-lcm-low-power', hint: 'Right primes, but the LCM takes each prime at its <b>higher</b> power.' }; return null; };
          var p = fieldsP(t(F(A) + '=' + fTex(s.af)) + ' and ' + t(F(B) + '=' + fTex(s.bf)) + '. Use the prime factorizations to find the GCF and the LCM of ' + t(F(A)) + ' and ' + t(F(B)) + '.',
            [{ name: 'GCF', before: t('\\text{GCF}=') }, { name: 'LCM', before: t('\\text{LCM}=') }], [valChk(G, gd), valChk(L, ld)], [String(G), String(L)],
            t('\\text{GCF}=' + F(G)) + ', ' + t('\\text{LCM}=' + F(L)),
            'GCF: only the primes in <b>both</b>, at the <b>lowest</b> power: ' + t(K.fac(G) + (nt.isPrime(G) ? '' : '=' + F(G))) + '.<br>LCM: <b>every</b> prime, at the <b>highest</b> power: ' + t(K.fac(L) + '=' + F(L)) + '.',
            ['GCF: the primes the two lists share, each at its lower power.', 'LCM: every prime in either list, each at its higher power.'], 'GCF & LCM from factorizations ' + A + ', ' + B);
          p.bad = [[String(L), String(G)], [String(G), String(A * B)]].filter(function (b) { return b.join('|') !== p.key.join('|'); });
          return p;
        } }] },
      { num: '3', outcome: 'AN1', stem: 'Perfect squares and perfect cubes. <b>No calculator</b>: use the tables you memorized.', parts: [
        { id: '3a', outcome: 'AN1', level: 'BEG', make: function (r) {
          var a = r.int(4, 15), b = r.int(2, 10), A = a * a, B = b * b * b;
          var sq = numChk(a, A % 2 ? [] : [{ v: A / 2, code: 'u1t-root-half', hint: 'A square root isn’t half the number. Which number times itself makes ' + t(F(A)) + '?' }]);
          var cu = numChk(b, (B % 3 ? [] : [{ v: B / 3, code: 'u1t-root-third', hint: 'A cube root isn’t a third of the number. Which number times itself three times makes ' + t(F(B)) + '?' }]).concat(isPow(B, 2) ? [{ v: intRoot(B, 2), code: 'u1t-root-swap', hint: 'That’s the <b>square</b> root of ' + t(F(B)) + '. The cube root times itself <b>three</b> times makes ' + t(F(B)) + '.' }] : []));
          var p = fieldsP('Evaluate each root mentally.', [{ name: 'Square root', before: t('\\sqrt{' + F(A) + '}=') }, { name: 'Cube root', before: t('\\sqrt[3]{' + F(B) + '}=') }], [sq, cu], [String(a), String(b)],
            t('\\sqrt{' + F(A) + '}=' + a) + ', ' + t('\\sqrt[3]{' + F(B) + '}=' + b),
            t(a + '\\times ' + a + '=' + F(A)) + ', so ' + t('\\sqrt{' + F(A) + '}=' + a) + '.<br>' + t(b + '\\times ' + b + '\\times ' + b + '=' + F(B)) + ', so ' + t('\\sqrt[3]{' + F(B) + '}=' + b) + '.',
            ['Which whole number times itself gives ' + t(F(A)) + '?', 'Which whole number times itself three times gives ' + t(F(B)) + '?'], 'sqrt ' + A + ', cbrt ' + B);
          p.bad = [[String(a + 1), String(b)]].concat(A % 2 ? [] : [[String(A / 2), String(b)]]);
          return p;
        } },
        { id: '3b', outcome: 'AN1', level: 'BEG', make: function (r) {
          var rows = r.shuffle([{ id: 's', n: r.pick(SQ_ONLY), cls: 'S' }, { id: 'c', n: r.pick(CU_ONLY), cls: 'C' }, { id: 'b', n: r.pick(BOTH), cls: 'B' }, { id: 'x', n: r.pick(NEITHER), cls: 'X' }]);
          var cols = [{ id: 'S', html: 'Perfect square', label: 'square' }, { id: 'C', html: 'Perfect cube', label: 'cube' }, { id: 'B', html: 'Both', label: 'both' }, { id: 'X', html: 'Neither', label: 'neither' }];
          var want = {}, by = {}; rows.forEach(function (x) { want[x.id] = x.cls; by[x.id] = x; });
          var why = function (x) {
            var sr = intRoot(x.n, 2), cr = intRoot(x.n, 3);
            return (sr != null ? t(sr + '^{2}=' + F(x.n)) : 'no whole number squared is ' + t(F(x.n))) + '; ' + (cr != null ? t(cr + '^{3}=' + F(x.n)) : 'no whole number cubed is ' + t(F(x.n)));
          };
          var name = { S: 'a perfect square only', C: 'a perfect cube only', B: 'both', X: 'neither' };
          var p = gridP('Is each number a perfect square, a perfect cube, both, or neither?', rows.map(function (x) { return { id: x.id, html: t(F(x.n)), label: String(x.n) }; }), cols, want,
            function (id) { var x = by[id]; return { code: 'u1t-sqcube', hint: t(F(x.n)) + ' is ' + name[x.cls] + ': ' + why(x) + '.' }; },
            rows.map(function (x) { return t(F(x.n)) + ': <b>' + name[x.cls] + '</b> — ' + why(x) + '.'; }).join('<br>'),
            ['Use the tables: perfect squares ' + t('1, 4, 9, 16, \\ldots, 225') + '; perfect cubes ' + t('1, 8, 27, 64, \\ldots, 1000') + '.', 'A number can be on both lists.'], 'square/cube/both/neither ' + rows.map(function (x) { return x.n; }).join(','));
          var b1 = {}, b2 = {}; rows.forEach(function (x) { b1[x.id] = x.cls; b2[x.id] = x.cls; });
          b1[rows[0].id] = rows[0].cls === 'X' ? 'S' : 'X'; b2.b = 'S'; b2.c = 'X';
          p.bad = [b1, b2];
          return p;
        } }] },
      { num: '4', outcome: 'AN2', stem: 'Rational, irrational, real?', parts: [
        { id: '4a', outcome: 'AN2', level: 'BEG', make: function (r) {
          var k = r.int(2, 12), n = find(function () { return r.int(2, 99); }, function (x) { return !isPow(x, 2); }, 20), d = r.int(1, 8), ip = r.pick([0, 0, 1, 2]);
          var p = r.int(1, 9), q = r.pick([3, 7, 9, 11, 13].filter(function (x) { return gcd(x, p) === 1 && x !== p; }));
          var pi = r.pick([['\\pi', 0, t('\\pi=3.14159\\ldots') + ' never ends and never repeats'], ['3.14', 1, 'it is a terminating decimal, ' + t('\\frac{314}{100}') + ' (only close to ' + t('\\pi') + ')'], ['2\\pi', 0, t('2\\pi') + ' is a multiple of ' + t('\\pi') + ', which is irrational'], ['\\dfrac{22}{7}', 1, 'it is a fraction of integers (only close to ' + t('\\pi') + ')']]);
          var dd = r.int(1, 9), ip2 = r.int(0, 5), pat = ip2 + '.' + dd + '0' + dd + '00' + dd + '000' + dd + '\\ldots';
          var tm = r.pick([['0.' + r.pick([25, 75, 45, 35, 65]), 'a terminating decimal'], ['-' + r.int(1, 9) + '.' + r.int(1, 9), 'a terminating decimal'], ['-\\dfrac{' + p + '}{' + q + '}', 'a fraction of integers']]);
          var rows = r.shuffle([
            { id: 's', tex: '\\sqrt{' + k * k + '}', rat: 1, why: t('\\sqrt{' + k * k + '}=' + k) + ', a whole number' },
            { id: 'n', tex: '\\sqrt{' + n + '}', rat: 0, why: t(n) + ' is not a perfect square, so the decimal never ends and never repeats' },
            { id: 'r', tex: ip + '.\\overline{' + d + '}', rat: 1, why: 'it is a repeating decimal (' + t(ip + '.' + d + d + d + d + '\\ldots') + ')' },
            { id: 'p', tex: pi[0], rat: pi[1], why: pi[2] },
            { id: 'f', tex: tm[0], rat: 1, why: 'it is ' + tm[1] },
            { id: 'd', tex: pat, rat: 0, why: 'the pattern keeps changing, so the decimal never ends and never repeats' }]);
          var want = {}, by = {}; rows.forEach(function (x) { want[x.id] = x.rat ? 'Q' : 'Qb'; by[x.id] = x; });
          var g = gridP('Choose ' + t('Q') + ' (rational) or ' + t('\\overline{Q}') + ' (irrational) for each number.', rows.map(function (x) { return { id: x.id, html: t(x.tex), label: x.id }; }), RAT_COLS, want,
            function (id) { var x = by[id]; return { code: 'u1t-rat-irr', hint: t(x.tex) + ' is ' + (x.rat ? 'rational' : 'irrational') + ': ' + x.why + '.' }; },
            rows.map(function (x) { return t(x.tex) + ': ' + (x.rat ? t('Q') : t('\\overline{Q}')) + ' — ' + x.why + '.'; }).join('<br>'),
            ['A rational number can be written as a fraction of integers: its decimal ends or repeats.', 'A square root is rational only when the number under it is a perfect square.'], 'rational or irrational: 6 numbers');
          var b1 = Object.assign({}, want); b1.n = 'Q'; var b2 = Object.assign({}, want); b2.r = 'Qb';
          g.bad = [b1, b2];
          return g;
        } },
        { id: '4b', outcome: 'AN2', level: 'BEG', make: function (r) {
          var c = r.int(2, 5), s = r.int(2, 10), m = r.pick([10, 20, 30, 12, 15]);
          var pool = [
            { id: 'q4', tex: '\\sqrt[4]{-' + r.pick([16, 81]) + '}', real: 0, why: 'the index ' + t('4') + ' is even, and no real number to an even power is negative' },
            { id: 'f5', tex: '\\sqrt[5]{-' + r.pick([32, 243]) + '}', real: 1, why: 'the index ' + t('5') + ' is odd, so a negative radicand is fine (the root is negative)' },
            { id: 'p4', tex: '\\sqrt[4]{' + r.pick([16, 81, 625]) + '}', real: 1, why: 'the radicand is positive' },
            { id: 'nb', tex: '\\sqrt{-' + m + '}', real: 0, why: 'no real number squared is negative' },
            { id: 'cb', tex: '\\sqrt[3]{-' + m + '}', real: 1, why: 'the index ' + t('3') + ' is odd, so a negative radicand is fine (it is irrational, but real)' }];
          var rows = r.shuffle([{ id: 'c3', tex: '\\sqrt[3]{-' + c * c * c + '}', real: 1, why: t('(-' + c + ')^{3}=-' + c * c * c) + ', so ' + t('\\sqrt[3]{-' + c * c * c + '}=-' + c) }, { id: 's2', tex: '\\sqrt{-' + s * s + '}', real: 0, why: t(s + '^{2}') + ' and ' + t('(-' + s + ')^{2}') + ' are both ' + t('+' + s * s) + ': no real number squared is negative' }].concat(r.sample(pool, 2)));
          var want = {}, by = {}; rows.forEach(function (x) { want[x.id] = x.real ? 'R' : 'X'; by[x.id] = x; });
          var g = gridP('Is each root a real number?', rows.map(function (x) { return { id: x.id, html: t(x.tex), label: x.id }; }), REAL_COLS, want,
            function (id) { var x = by[id]; return { code: 'u1t-real', hint: t(x.tex) + (x.real ? ' <b>is</b> a real number: ' : ' is <b>not</b> a real number: ') + x.why + '.' }; },
            rows.map(function (x) { return t(x.tex) + ': ' + (x.real ? 'real' : '<b>not</b> a real number') + ' — ' + x.why + '.'; }).join('<br>'),
            ['Check the index first. An <b>odd</b> index (3, 5, …) accepts a negative radicand; an <b>even</b> index (2, 4, …) does not.'], 'real or not: 4 roots');
          var b1 = Object.assign({}, want); b1.c3 = 'X';
          g.bad = [b1];
          return g;
        } }] },
      { num: '5', outcome: 'AN2', stem: 'Write each as a <b>mixed radical</b> in simplest form.', shared: function (r) { return { km: pick3(r, BEG_RAD) }; }, parts: [0, 1, 2].map(function (j) {
        return { id: '5' + 'abc'[j], outcome: 'AN2', level: 'BEG', make: function (r, s) { var k = s.km[j][0], m = s.km[j][1], p = mixedPart(k, 2, s.km[j][1]); p.bad = [k * k + '\\sqrt{' + m + '}', m + '\\sqrt{' + k * k + '}'].filter(function (b) { return b !== p.key; }); return p; } }; }) },

      /* ======================= Progressing ======================= */
      { num: '6', outcome: 'AN1', stem: 'Use prime factorization (or any method).', parts: [
        { id: '6a', outcome: 'AN1', level: 'PRG', make: function (r) {
          return gcfPart(find(function () { var g = r.pick([6, 8, 9, 12, 14, 15, 16, 17, 18, 21]), m = r.pick([[2, 3, 5], [1, 2, 3], [2, 3, 4], [3, 4, 5], [2, 3, 7], [2, 5, 7], [3, 5, 7]]); return m.map(function (x) { return g * x; }); }, function (v) { return v[2] <= 150; }, [12, 18, 30]));
        } },
        { id: '6b', outcome: 'AN1', level: 'PRG', make: function (r) {
          return lcmPart(find(function () { return sortN(r.sample([4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 25, 30], 3)); }, function (v) {
            var L = lcmA(v); if (v[1] % v[0] === 0 && v[2] % v[1] === 0) return false; if (v[2] % v[0] === 0 && v[2] % v[1] === 0) return false;
            return L <= 240 && L !== prodOf(v) && L > v[2];
          }, [8, 15, 20]));
        } }] },
      { num: '7', outcome: 'AN1', stem: 'Decide whether each problem needs the GCF or the LCM, then solve it.', parts: [
        { id: '7a', outcome: 'AN1', level: 'PRG', make: function (r) {
          var C = r.pick([{ who: 'Maya has', unit: 'bracelets', each: 'bracelet', items: ['blue beads', 'red beads'], verb: 'to make identical bracelets' }, { who: 'A coach has', unit: 'team bags', each: 'bag', items: ['water bottles', 'granola bars'], verb: 'to pack into identical team bags' },
            { who: 'A teacher has', unit: 'supply kits', each: 'kit', items: ['pencils', 'erasers'], verb: 'to sort into identical supply kits' }, { who: 'A florist has', unit: 'bouquets', each: 'bouquet', items: ['roses', 'tulips'], verb: 'to make identical bouquets' },
            { who: 'A baker has', unit: 'gift boxes', each: 'box', items: ['cookies', 'muffins'], verb: 'to pack into identical gift boxes' }]);
          var v = find(function () { var g = r.pick([4, 6, 8, 9, 12, 14, 16, 18, 21]), xy = r.shuffle(r.pick([[2, 3], [3, 4], [3, 5], [4, 5], [5, 6], [2, 5], [3, 7], [4, 7], [5, 7]])); return { g: g, x: xy[0], y: xy[1] }; }, function (v) { return v.g * Math.max(v.x, v.y) <= 130; }, { g: 12, x: 3, y: 4 });
          var a = v.g * v.x, b = v.g * v.y, g = v.g, L = lcm(a, b);
          var each = function (tot, it) { return numChk(tot / g, [{ v: tot, code: 'u1t-kits-total', hint: 'That’s the total number of ' + it + '. Share it equally among the ' + C.unit + ': divide by the number of ' + C.unit + '.' }, { v: g, code: 'u1t-kits-total', hint: 'That’s the number of ' + C.unit + '. How many ' + it + ' go in each one?' }]); };
          var p = fieldsP(C.who + ' ' + t(a) + ' ' + C.items[0] + ' and ' + t(b) + ' ' + C.items[1] + ' ' + C.verb + ', using every item, with the <b>greatest</b> number of ' + C.unit + ' possible. How many ' + C.unit + ' can there be, and what goes in each ' + C.each + '?',
            [{ name: C.unit, label: 'Number of ' + C.unit + ':' }, { name: C.items[0], label: 'Each ' + C.each + ':', after: C.items[0] }, { name: C.items[1], label: 'Each ' + C.each + ':', after: C.items[1] }],
            [K.number(g, gcfDiag([a, b])), each(a, C.items[0]), each(b, C.items[1])], [String(g), String(v.x), String(v.y)],
            t(g) + ' ' + C.unit + ', each with ' + t(v.x) + ' ' + C.items[0] + ' and ' + t(v.y) + ' ' + C.items[1],
            '<b>GCF</b>: the items are split into the greatest number of equal groups.<br>' + facEq(a) + ', ' + facEq(b) + '.<br>Shared primes, lowest powers: ' + t('\\text{GCF}=' + K.fac(g) + (nt.isPrime(g) ? '' : '=' + g)) + ' ' + C.unit + '.<br>Each ' + C.each + ': ' + t(a + '\\div ' + g + '=' + v.x) + ' ' + C.items[0] + ' and ' + t(b + '\\div ' + g + '=' + v.y) + ' ' + C.items[1] + '.',
            ['Splitting into the greatest number of equal groups is a GCF problem.', 'Then divide each total by the GCF.'], 'GCF word problem ' + a + ',' + b,
            function (i, vals) { return vals[0] > 0 ? (i === 1 ? a : b) / vals[0] : null; });
          p.bad = [[String(L), String(L / a), String(L / b)], [String(g), String(a), String(b)]];
          return p;
        } },
        { id: '7b', outcome: 'AN1', level: 'PRG', make: function (r) {
          var C = r.pick([{ kind: 'buses', u: 'min' }, { kind: 'ferries', u: 'min' }, { kind: 'lights', u: 's' }, { kind: 'spotlights', u: 's' }]), min = C.u === 'min';
          var v = find(function () { return sortN(r.sample(min ? [12, 15, 18, 20, 24, 30, 36, 40, 45] : [12, 15, 16, 18, 20, 24, 25, 30, 36, 40, 45], 2)); }, function (v) {
            var L = lcm(v[0], v[1]); return v[1] % v[0] !== 0 && L > 60 && L % 60 !== 0 && L <= (min ? 300 : 300) && (min || L % 60 !== 0);
          }, min ? [15, 40] : [18, 24]);
          var L = lcm(v[0], v[1]), g = gcd(v[0], v[1]), big = min ? 'h' : 'min', bw = min ? 'hours' : 'minutes', sw = min ? 'minutes' : 'seconds', uw = min ? 'minutes' : 'seconds';
          var text = C.kind === 'buses' ? 'Bus Route A leaves the station every ' + t(v[0]) + ' minutes and Route B every ' + t(v[1]) + ' minutes. They just left together.'
            : C.kind === 'ferries' ? 'Ferry A leaves the dock every ' + t(v[0]) + ' minutes and Ferry B every ' + t(v[1]) + ' minutes. They just left together.'
              : C.kind === 'lights' ? 'Light A flashes every ' + t(v[0]) + ' seconds and Light B every ' + t(v[1]) + ' seconds. They just flashed together.'
                : 'Spotlight A returns to its start every ' + t(v[0]) + ' seconds and Spotlight B every ' + t(v[1]) + ' seconds. They just started together.';
          var conv = function (want, alt) { return numChk(want, alt != null && alt !== want ? [{ v: alt, code: 'u1t-time-convert', hint: 'There are ' + t('60') + ' ' + sw + ' in ' + (min ? 'an hour' : 'a minute') + ', not ' + t('100') + '.' }] : []); };
          var p = fieldsP(text + ' How long until they are together again? Give the answer in ' + uw + ', then in ' + bw + ' and ' + sw + '.',
            [{ name: 'Wait', label: 'Together again after', after: C.u }, { name: bw, label: 'That is', after: big }, { name: sw, label: 'and', after: C.u }],
            [K.number(L, lcmDiag(v)), conv(Math.floor(L / 60), Math.floor(L / 100)), conv(L % 60, L % 100)], [String(L), String(Math.floor(L / 60)), String(L % 60)],
            t(L) + ' ' + C.u + ' = ' + t(Math.floor(L / 60)) + ' ' + big + ' ' + t(L % 60) + ' ' + C.u,
            '<b>LCM</b>: each one repeats at multiples of its own time, so they line up at a common multiple — the first one is the LCM.<br>' + facEq(v[0]) + ', ' + facEq(v[1]) + '.<br>Every prime, highest power: ' + t('\\text{LCM}=' + K.fac(L) + '=' + L) + ' ' + C.u + '.<br>' + t(L + '=' + Math.floor(L / 60) + '\\times 60+' + L % 60) + ', so ' + t(Math.floor(L / 60)) + ' ' + big + ' ' + t(L % 60) + ' ' + C.u + '.',
            ['They line up again at a common <b>multiple</b> of the two times: find the LCM.', 'Then take out groups of ' + t('60') + '.'], 'LCM word problem ' + v.join(','),
            function (i, vals) { return vals[0] > 0 ? (i === 1 ? Math.floor(vals[0] / 60) : vals[0] % 60) : null; });
          p.bad = [[String(g), '0', String(g)], [String(v[0] * v[1]), String(Math.floor(v[0] * v[1] / 60)), String(v[0] * v[1] % 60)], [String(L), String(Math.floor(L / 100)), String(L % 100)]].filter(function (b) { return b.join('|') !== p.key.join('|'); });
          return p;
        } }] },
      { num: '8', outcome: 'AN1', stem: 'Square roots and cube roots run the area and volume formulas backwards. <b>No calculator</b>.', parts: [
        { id: '8a', outcome: 'AN1', level: 'PRG', make: function (r) {
          var C = r.pick([['school garden', 'm'], ['patio', 'm'], ['rug', 'm'], ['floor tile', 'cm'], ['photo', 'cm'], ['poster', 'cm']]), s = r.int(6, 15), A = s * s, u = C[1];
          var sideC = numChk(s, [{ v: A / 2, code: 'u1t-half-not-root', hint: 'The side isn’t half the area. Which number times itself gives ' + t(A) + '?' }, { v: A / 4, code: 'u1t-quarter-not-root', hint: 'Dividing the area by ' + t('4') + ' doesn’t give the side. Which number times itself gives ' + t(A) + '?' }]);
          var perC = numChk(4 * s, [{ v: 2 * s, code: 'u1t-perim-two', hint: 'A square has <b>four</b> equal sides: perimeter ' + t('=4s') + '.' }, { v: 4 * A, code: 'u1t-perim-area', hint: 'Use the side length, not the area: perimeter ' + t('=4\\times') + ' side.' }, { v: A, code: 'u1t-perim-area', hint: 'That’s the area. The perimeter is the distance around: ' + t('4\\times') + ' side.' }]);
          var p = fieldsP('A square ' + C[0] + ' has an area of ' + t(A + '\\text{ ' + u + '}^{2}') + '. Find its side length and its perimeter.',
            [{ name: 'Side', label: 'Side length:', after: u }, { name: 'Perimeter', label: 'Perimeter:', after: u }], [sideC, perC], [String(s), String(4 * s)],
            'side ' + t(s) + ' ' + u + ', perimeter ' + t(4 * s) + ' ' + u,
            'Side ' + t('=\\sqrt{' + A + '}=' + s) + ' ' + u + ' (because ' + t(s + '\\times ' + s + '=' + A) + ').<br>Perimeter ' + t('=4\\times ' + s + '=' + 4 * s) + ' ' + u + '.',
            ['A square of area ' + t('A') + ' has side ' + t('\\sqrt{A}') + '.', 'Perimeter: add up the four sides.'], 'square area ' + A + ' ' + C[0],
            function (i, vals) { return vals[0] != null ? 4 * vals[0] : null; });
          p.bad = [[String(A / 2), String(2 * A)], [String(s), String(2 * s)]];
          return p;
        } },
        { id: '8b', outcome: 'AN1', level: 'PRG', make: function (r) {
          var C = r.pick([['storage crate', 'cm'], ['gift box', 'cm'], ['water tank', 'm'], ['shipping container', 'm'], ['toy block', 'cm']]), e = r.int(2, 10), V = e * e * e, u = C[1];
          var edgeC = numChk(e, V % 3 ? [] : [{ v: V / 3, code: 'u1t-third-not-root', hint: 'The edge isn’t a third of the volume. Which number times itself three times gives ' + t(F(V)) + '?' }]);
          var saC = numChk(6 * e * e, [{ v: e * e, code: 'u1t-sa-one-face', hint: 'That’s one face. A cube has <b>six</b> identical square faces.' }, { v: 4 * e * e, code: 'u1t-sa-faces', hint: 'A cube has <b>six</b> faces, not four.' }, { v: 6 * e, code: 'u1t-sa-no-square', hint: 'Each face is a square: its area is edge × edge, not the edge.' }, { v: V, code: 'u1t-sa-volume', hint: 'That’s the volume. Surface area adds up the areas of the six faces.' }]);
          var p = fieldsP('A cube-shaped ' + C[0] + ' has a volume of ' + t(F(V) + '\\text{ ' + u + '}^{3}') + '. Find its edge length and its total surface area. (A cube has ' + t('6') + ' identical square faces.)',
            [{ name: 'Edge', label: 'Edge length:', after: u }, { name: 'Surface area', label: 'Surface area:', after: t('\\text{' + u + '}^{2}') }], [edgeC, saC], [String(e), String(6 * e * e)],
            'edge ' + t(e) + ' ' + u + ', surface area ' + t(6 * e * e + '\\text{ ' + u + '}^{2}'),
            'Edge ' + t('=\\sqrt[3]{' + F(V) + '}=' + e) + ' ' + u + ' (because ' + t(e + '\\times ' + e + '\\times ' + e + '=' + F(V)) + ').<br>One face: ' + t(e + '\\times ' + e + '=' + e * e + '\\text{ ' + u + '}^{2}') + '. Six faces: ' + t('6\\times ' + e * e + '=' + 6 * e * e + '\\text{ ' + u + '}^{2}') + '.',
            ['A cube of volume ' + t('V') + ' has edge ' + t('\\sqrt[3]{V}') + '.', 'Surface area ' + t('=6\\times') + ' (edge × edge).'], 'cube volume ' + V + ' ' + C[0],
            function (i, vals) { return vals[0] != null ? 6 * vals[0] * vals[0] : null; });
          p.bad = [[String(e), String(e * e)], [String(e), String(4 * e * e)]];
          return p;
        } }] },
      { num: '9', outcome: 'AN2', stem: 'The real number system.', parts: [
        { id: '9a', outcome: 'AN2', level: 'PRG', make: function (r) {
          var k1 = r.int(3, 9), n1 = r.pick([[String(r.int(11, 40)), null], ['\\sqrt{' + k1 * k1 + '}', '\\sqrt{' + k1 * k1 + '}=' + k1], ['\\dfrac{' + 4 * k1 + '}{4}', '\\frac{' + 4 * k1 + '}{4}=' + k1]]);
          var k2 = r.int(2, 9), n2 = r.pick([['-' + r.int(2, 22), null], ['-\\sqrt{' + k2 * k2 + '}', '-\\sqrt{' + k2 * k2 + '}=-' + k2], ['-\\dfrac{' + 3 * k2 + '}{3}', '-\\frac{' + 3 * k2 + '}{3}=-' + k2]]);
          var z = r.pick([['0', null], ['\\sqrt{0}', '\\sqrt{0}=0']]);
          var fa = r.int(1, 8), fb = r.pick([3, 4, 5, 7, 8, 9].filter(function (x) { return x > fa && gcd(x, fa) === 1; })), fr = r.pick([['\\dfrac{' + fa + '}{' + fb + '}', null], [r.int(1, 9) + '.' + r.int(1, 9), null], ['-' + r.int(1, 5) + '.' + r.pick([25, 5, 75]), null]]);
          var ra = r.int(1, 9), rb = r.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return x !== ra; })), rp = ['0.\\overline{' + ra + rb + '}', null];
          var ni = find(function () { return r.int(2, 60); }, function (x) { return !isPow(x, 2); }, 13), ir = r.pick([['\\sqrt{' + ni + '}', ni + '\\text{ is not a perfect square}'], ['-\\sqrt{' + ni + '}', ni + '\\text{ is not a perfect square}']]);
          var items = r.shuffle([{ id: 'na', tex: n1[0], cls: 'nat', note: n1[1] }, { id: 'ni', tex: n2[0], cls: 'negint', note: n2[1] }, { id: 'z', tex: z[0], cls: 'zero', note: z[1] },
            { id: 'fr', tex: fr[0], cls: 'frac', note: null }, { id: 'rp', tex: rp[0], cls: 'frac', note: null }, { id: 'ir', tex: ir[0], cls: 'irr', note: ir[1] }]);
          var want = {}, by = {}; items.forEach(function (x) { want[x.id] = SETS[x.cls].slice(); by[x.id] = x; });
          var g = gridP('Tick <b>every</b> set each number belongs to.', items.map(function (x) { return { id: x.id, html: t(x.tex), label: x.id }; }), SET_COLS, want,
            function (id, got) { return setHint(by[id], got); },
            items.map(function (x) { return t(x.tex) + (x.note ? ': ' + t(x.note) : '') + ' → ' + setList(want[x.id]); }).join('<br>'),
            ['Simplify each number first. Then work up the chain ' + t('N\\subset W\\subset I\\subset Q\\subset R') + '; an irrational number is in ' + t('\\overline{Q}') + ' and ' + t('R') + ' only.'], 'number sets: 6 numbers');
          var b1 = {}; items.forEach(function (x) { b1[x.id] = want[x.id].slice(); }); b1.z = ['N', 'W', 'I', 'Q', 'R'];
          var b2 = {}; items.forEach(function (x) { b2[x.id] = want[x.id].filter(function (c) { return c !== 'R'; }); });
          g.bad = [b1, b2];
          return g;
        } },
        { id: '9b', outcome: 'AN2', level: 'PRG', make: function (r) {
          var its = mixShared(r), sorted = its.slice().sort(function (a, b) { return a.v - b.v; }), by = {}; its.forEach(function (x) { by[x.id] = x; });
          var val = function (x) { return x.id === 'rt' ? t(x.why) + ', about ' + t(dec1(x.v)) : x.why ? t(x.why) : t(x.tex); };
          return orderP(r, 'Without a calculator, order these numbers from least to greatest: ' + its.map(function (x) { return t(x.tex); }).join(', ') + '.', sorted,
            function (a, b) { return t(by[a].tex) + ' and ' + t(by[b].tex) + ' are in the wrong order. ' + [by[a], by[b]].map(val).join('; ') + '.'; },
            'Write each one as a decimal (estimate the root between two whole numbers):<br>' + sorted.map(val).join(', ') + '.<br>' + t(sorted.map(function (x) { return x.tex; }).join('\\ <\\ ')),
            ['Simplify the roots you can (' + t('-\\sqrt{9}=-3') + ') and estimate the others between two whole numbers.', 'Write fractions as decimals, then place every number on a number line in your head.'], 'order 6 real numbers');
        } }] },
      { num: '10', outcome: 'AN2',
        shared: function (r) { return { n: find(function () { return r.int(10, 150); }, function (n) { var lo = Math.floor(Math.sqrt(n)); return !isPow(n, 2) && Math.abs((n - lo * lo) - ((lo + 1) * (lo + 1) - n)) >= 3; }, 55) }; },
        stem: function (s) { return 'Estimate ' + t('\\sqrt{' + s.n + '}') + ' <b>without a calculator</b>.'; },
        parts: [
          { id: '10a', outcome: 'AN2', level: 'PRG', make: function (r, s) {
            var n = s.n, lo = Math.floor(Math.sqrt(n)), hi = lo + 1, e = '\\sqrt{' + n + '}', close = n - lo * lo < hi * hi - n ? lo : hi;
            function side(isLo) {
              var want = isLo ? lo : hi;
              return K.number(want, function (v) {
                if (!Number.isInteger(v)) return { code: 'u1t-bracket', hint: 'Give a whole number.' };
                if (v === want * want) return { code: 'u1t-power-not-root', hint: t(want * want) + ' is the perfect square. Give the whole number it comes from: ' + t('\\sqrt{' + want * want + '}=' + want) + '.' };
                if (isLo && v === hi) return { code: 'u1t-swapped-bounds', hint: 'That’s the larger whole number. The first box is the smaller one.' };
                if (!isLo && v === lo) return { code: 'u1t-swapped-bounds', hint: 'That’s the smaller whole number. The second box is the larger one.' };
                if (isLo) return v * v > n ? { code: 'u1t-bracket', hint: 'Check: ' + t(v + '^{2}=' + v * v) + ', which is more than ' + t(n) + '.' } : { code: 'u1t-bracket', hint: 'Get closer: ' + t((v + 1) + '^{2}=' + (v + 1) * (v + 1)) + ' is still less than ' + t(n) + '.' };
                return v * v < n ? { code: 'u1t-bracket', hint: 'Check: ' + t(v + '^{2}=' + v * v) + ', which is less than ' + t(n) + '.' } : { code: 'u1t-bracket', hint: 'Get closer: ' + t((v - 1) + '^{2}=' + (v - 1) * (v - 1)) + ' is still more than ' + t(n) + '.' };
              });
            }
            var closeC = K.number(close, function (v) {
              if (v === (close === lo ? hi : lo)) return { code: 'u1t-closer', hint: 'Compare the distances: ' + t(n) + ' is ' + t(n - lo * lo) + ' above ' + t(lo * lo) + ' and ' + t(hi * hi - n) + ' below ' + t(hi * hi) + '.' };
              if (v === close * close) return { code: 'u1t-power-not-root', hint: 'Give the whole number, not its square.' };
              return null;
            });
            var p = fieldsP('Between which two consecutive whole numbers is ' + t(e) + '? Which of the two is it closer to?',
              [{ name: 'Smaller', label: '', after: t('<' + e) }, { name: 'Larger', label: '', before: t(e + '<') }, { name: 'Closer to', label: 'Closer to' }], [side(true), side(false), closeC], [String(lo), String(hi), String(close)],
              t(lo + '<' + e + '<' + hi) + ', closer to ' + t(close),
              t(lo + '^{2}=' + lo * lo) + ' and ' + t(hi + '^{2}=' + hi * hi) + ', and ' + t(lo * lo + '<' + n + '<' + hi * hi) + ', so ' + t(lo + '<' + e + '<' + hi) + '.<br>' + t(n) + ' is ' + t(n - lo * lo) + ' above ' + t(lo * lo) + ' but ' + t(hi * hi - n) + ' below ' + t(hi * hi) + ', so ' + t(e) + ' is closer to <b>' + t(close) + '</b>.',
              ['List the perfect squares just below and just above ' + t(n) + '.', 'Which of those two perfect squares is ' + t(n) + ' nearer to?'], 'bracket sqrt ' + n);
            p.bad = [[String(lo * lo), String(hi * hi), String(close)], [String(lo), String(hi), String(close === lo ? hi : lo)], [String(hi), String(lo), String(close)]];
            return p;
          } },
          { id: '10b', outcome: 'AN2', level: 'PRG', make: function (r, s) {
            var n = s.n, x = Math.sqrt(n), lo = Math.floor(x), hi = lo + 1, close = n - lo * lo < hi * hi - n;
            return P.numplace('Mark ' + t('\\sqrt{' + n + '}') + ' on the number line.', { min: lo - 1, max: hi + 1, step: 0.5, labels: 1, items: [{ id: 's', tex: '\\sqrt{' + n + '}' }] }, { s: x },
              t(lo * lo + '<' + n + '<' + hi * hi) + ', so ' + t('\\sqrt{' + n + '}') + ' is between ' + t(lo) + ' and ' + t(hi) + '. ' + t(n) + ' is ' + t(n - lo * lo) + ' above ' + t(lo * lo) + ' and ' + t(hi * hi - n) + ' below ' + t(hi * hi) + ', so it is closer to ' + t(close ? lo : hi) + ': about ' + t(dec1(x)) + '.',
              ['First find the two whole numbers it is between.', 'Is ' + t(n) + ' closer to ' + t(lo * lo) + ' or to ' + t(hi * hi) + '?'], 'mark sqrt ' + n + ' on a number line',
              { tol: 0.25, hints: { s: t('\\sqrt{' + n + '}') + ' is between ' + t(lo) + ' and ' + t(hi) + ', closer to ' + t(close ? lo : hi) + '.' } });
          } }] },
      { num: '11', outcome: 'AN2', stem: 'Write each as a <b>mixed radical</b> in simplest form.', parts: [
        { id: '11a', outcome: 'AN2', level: 'PRG', make: function (r) { var km = r.pick(radPool(3, [2, 5], 16, 500)), p = mixedPart(km[0], 3, km[1]); p.bad = [km[0] * km[0] * km[0] + '\\sqrt[3]{' + km[1] + '}', km[0] + '\\sqrt{' + km[1] + '}']; return p; } },
        { id: '11b', outcome: 'AN2', level: 'PRG', make: function (r) { var n = r.pick([4, 4, 5]), km = r.pick(n === 4 ? radPool(4, [2, 3], 32, 500) : radPool(5, [2, 2], 64, 500)), p = mixedPart(km[0], n, km[1]); p.bad = [Math.pow(km[0], n) + '\\sqrt[' + n + ']{' + km[1] + '}']; return p; } },
        { id: '11c', outcome: 'AN2', level: 'PRG', make: function (r) {
          var km = r.pick(radPool(3, [2, 4], 16, 300)), k = km[0], m = km[1], N = k * k * k * m;
          var p = P.radical('Write ' + t('\\sqrt[3]{-' + F(N) + '}') + ' as a mixed radical in simplest form.', { k: -k, n: 3, m: m }, 'mixed',
            t('\\sqrt[3]{-' + F(N) + '}=\\sqrt[3]{-' + k * k * k + '\\times ' + m + '}=\\sqrt[3]{-' + k * k * k + '}\\times\\sqrt[3]{' + m + '}=' + rad(-k, 3, m)) + '. The index ' + t('3') + ' is odd, so a negative radicand is fine: ' + t('(-' + k + ')^{3}=-' + k * k * k) + '.',
            ['The index is odd, so take out the largest perfect cube with its negative sign: ' + t('-' + k * k * k + '=(-' + k + ')^{3}') + ' (8, 27, 64, …).'], 'mixed radical of cbrt -' + N);
          p.bad = [rad(k, 3, m)];
          return p;
        } }] },
      { num: '12', outcome: 'AN2', stem: 'Write each as an <b>entire radical</b>.', parts: [
        { id: '12a', outcome: 'AN2', level: 'PRG', make: function (r) { var km = find(function () { return [r.int(2, 9), r.pick([2, 3, 5, 6, 7, 10])]; }, function (v) { return v[0] * v[0] * v[1] <= 400 && v[0] * v[0] * v[1] >= 18; }, [4, 5]); return entirePart(km[0], 2, km[1]); } },
        { id: '12b', outcome: 'AN2', level: 'PRG', make: function (r) { var k = r.int(2, 5), m = r.pick([2, 3, 4, 5, 6, 7, 9, 10].filter(function (x) { return x !== k && ex.simplest(x, 3); })); return entirePart(r.chance(0.65) ? -k : k, 3, m); } }] },

      /* ======================= Mastery ======================= */
      { num: '13', outcome: 'AN1',
        shared: function (r) { return { a: r.chance(0.6) ? r.pick(BIG_SQ) : r.pick(NEI_A), b: r.chance(0.6) ? r.pick(BIG_CU) : r.pick(NEI_B) }; },
        stem: 'These numbers are past the tables: use <b>prime factorization</b>.', parts: [
          { id: '13a', outcome: 'AN1', level: 'MAS', make: function (r, s) { return testPart(s.a); } },
          { id: '13b', outcome: 'AN1', level: 'MAS', make: function (r, s) { return testPart(s.b); } },
          { id: '13c', outcome: 'AN1', level: 'MAS', make: function (r) {
            var k = r.pick([2, 3]), M = r.pick((k === 2 ? [8, 12, 18, 20, 24, 27, 28, 32, 40, 45, 48, 50, 54, 63, 72, 75, 80, 90, 98, 108, 125, 147, 150, 175, 200, 245, 300, 500] : [4, 9, 16, 18, 24, 25, 32, 36, 40, 48, 50, 54, 72, 75, 81, 96, 100, 108, 135, 144, 200, 250, 375, 500])
              .filter(function (x) { var n0 = powerUp(nt.factor(x), k).k; return n0 <= 20 && x * n0 <= (k === 2 ? 2500 : 1728); })); // EP05 #3–4 sizes: products to 2500 (squares) and 1728 (cubes)
            var f = nt.factor(M), u = powerUp(f, k), n = u.k, MN = M * n, root = u.root, word = k === 2 ? 'square' : 'cube', test = k === 2 ? 'even' : 'a multiple of ' + t('3');
            var other = powerUp(f, k === 2 ? 3 : 2).k, once = prodOf(f.filter(function (pe) { return pe[1] % k; }).map(function (pe) { return pe[0]; })), extra = fVal(f.map(function (pe) { return [pe[0], pe[1] % k]; })), all = prodOf(f.map(function (pe) { return pe[0]; }));
            var nAlts = [{ v: other, code: 'u1t-k-other-power', hint: 'That makes ' + t(F(M) + 'n') + ' a perfect <b>' + (k === 2 ? 'cube' : 'square') + '</b>. A perfect ' + word + ' needs every exponent ' + test + '.' },
              { v: once, code: 'u1t-k-once', hint: 'Multiplying by each missing prime once isn’t enough here: an exponent of ' + t('1') + ' needs <b>two</b> more copies to reach ' + t('3') + '.' },
              { v: extra, code: 'u1t-k-extra', hint: 'Those are the factors left <i>over</i>. ' + t('n') + ' must supply what each exponent is <i>missing</i> to become ' + test + '.' },
              { v: all, code: 'u1t-k-all', hint: 'You only need more of the primes whose exponents aren’t ' + test + ' yet.' }];
            var need = f.filter(function (pe) { return pe[1] % k; });
            var p = fieldsP('What is the <b>smallest</b> whole number ' + t('n') + ' that makes ' + t(F(M) + '\\times n') + ' a perfect ' + word + '? Write ' + t(F(M)) + ' as a product of primes, then find ' + t('n') + ', the product, and its ' + word + ' root.',
              [{ name: 'Prime factorization', before: t(F(M) + '='), mode: 'math', wide: true }, { name: 'n', before: t('n=') }, { name: 'Product', before: t(F(M) + '\\times n=') }, { name: 'Root', before: t(rt(k, F(M) + '\\times n') + '=') }],
              [prodChk(M, 'either'), numChk(n, nAlts), K.number(MN), numChk(root, [{ v: MN, code: 'u1t-root-of-k', hint: 'That’s the product itself. Now take its ' + word + ' root: divide each exponent by ' + t(k) + '.' }, { v: n, code: 'u1t-root-of-k', hint: 'That’s ' + t('n') + '. The question asks for the ' + word + ' root of the product.' }])],
              [plainF(f), String(n), String(MN), String(root)], t(F(M) + '=' + fTex(f)) + ', ' + t('n=' + F(n)) + ', product ' + t(F(MN)) + ', ' + t(rt(k, F(MN)) + '=' + root),
              t(F(M) + '=' + fTex(f)) + '.<br>For a perfect ' + word + ', every exponent must be ' + test + '. ' +
                need.map(function (pe) { var miss = (k - pe[1] % k) % k; return t(pe[0] + (pe[1] > 1 ? '^{' + pe[1] + '}' : '')) + ' needs ' + (miss === 1 ? 'one more ' + t(pe[0]) : 'two more ' + t(pe[0]) + 's'); }).join('; ') + '.<br>' +
                t('n=' + fTex(u.kf) + '=' + F(n)) + '<br>' + t(F(M) + '\\times ' + F(n) + '=' + F(MN) + '=' + fTex(u.up)) + '<br>' + t(rt(k, F(MN)) + '=' + fTex(u.rootF) + '=' + root) + (k === 2 ? ' (halve each exponent)' : ' (divide each exponent by 3)'),
              ['Write ' + t(F(M)) + ' as a product of primes and look at each exponent.', 'Raise each exponent to the next ' + (k === 2 ? 'even number' : 'multiple of 3') + ' — and no further.'], 'smallest n: ' + M + 'n a perfect ' + word,
              function (i, v) { return i === 2 && v[1] != null ? M * v[1] : i === 3 && v[2] != null ? intRoot(v[2], k) : null; });
            p.bad = nAlts.filter(function (a) { return a.v !== n; }).slice(0, 2).map(function (a) { return [plainF(f), String(a.v), String(M * a.v), String(intRoot(M * a.v, k) || 1)]; }).concat([[plainF(f), String(n), String(MN), String(MN)]]);
            return p;
          } }] },
      { num: '14', outcome: 'AN1', stem: 'For any two whole numbers, ' + t('\\text{GCF}\\times\\text{LCM}=') + ' the product of the two numbers.', parts: [
        { id: '14', outcome: 'AN1', level: 'MAS', make: function (r) {
          var v = find(function () { var g = r.pick([2, 3, 4, 5, 6, 8, 10, 12]), x = r.int(2, 7), y = r.int(2, 7); return { g: g, x: x, y: y }; }, function (v) { return v.x !== v.y && gcd(v.x, v.y) === 1 && v.g * v.x * v.y <= 300 && v.g * v.x * v.y >= 24; }, { g: 6, x: 3, y: 4 });
          var g = v.g, a = g * v.x, b = g * v.y, L = g * v.x * v.y;
          var other = function (u) {
            if (u === L / a && u !== b) return { code: 'u1t-other-ratio', hint: t(F(L) + '\\div ' + a + '=' + u) + ' leaves out the GCF. Use ' + t('\\text{GCF}\\times\\text{LCM}=' + a + '\\times(\\text{other number})') + '.' };
            if (!(u > 0) || u % 1) return null;
            var gg = gcd(a, u), ll = lcm(a, u);
            if (gg !== g) return { code: 'u1t-other-gcf', hint: 'Check: the GCF of ' + t(a) + ' and ' + t(F(u)) + ' is ' + t(F(gg)) + ', not ' + t(g) + '.' };
            if (ll !== L) return { code: 'u1t-other-lcm', hint: 'Check: the LCM of ' + t(a) + ' and ' + t(F(u)) + ' is ' + t(F(ll)) + ', not ' + t(F(L)) + '.' };
            return null;
          };
          var prodC = numChk(g * L, [{ v: a * L, code: 'u1t-gl-wrong-pair', hint: 'Multiply the GCF by the LCM: ' + t(g + '\\times ' + F(L)) + '.' }, { v: a * g, code: 'u1t-gl-wrong-pair', hint: 'Multiply the GCF by the LCM: ' + t(g + '\\times ' + F(L)) + '.' }]);
          var p = fieldsP('Two numbers have a GCF of ' + t(g) + ' and an LCM of ' + t(F(L)) + '. One of the numbers is ' + t(a) + '. Find ' + t('\\text{GCF}\\times\\text{LCM}') + ', then the other number.',
            [{ name: 'GCF × LCM', before: t('\\text{GCF}\\times\\text{LCM}=') }, { name: 'Other number', label: 'Other number:' }], [prodC, numChk(b, [], other)], [String(g * L), String(b)],
            t(g + '\\times ' + F(L) + '=' + F(g * L)) + '; other number ' + t(b),
            t('\\text{GCF}\\times\\text{LCM}=' + g + '\\times ' + F(L) + '=' + F(g * L)) + '.<br>This equals ' + t(a + '\\times(\\text{other number})') + ', so the other number is ' + t(F(g * L) + '\\div ' + a + '=' + b) + '.<br>Check: ' + facEq(a) + ', ' + facEq(b) + '; the GCF is ' + t(g) + ' and the LCM is ' + t(F(L)) + ' ✓.',
            ['Multiply the GCF by the LCM.', 'That product equals ' + t(a) + ' × (the other number): divide by ' + t(a) + '.'], 'other number: GCF ' + g + ', LCM ' + L + ', one is ' + a,
            function (i, vals) { return vals[0] > 0 && vals[0] % a === 0 ? vals[0] / a : null; });
          p.bad = [[String(a * L), String(L)], [String(g * L), String(L / a)]].filter(function (bd) { return bd[1] !== String(b); });
          return p;
        } }] },
      { num: '15', outcome: 'AN1', stem: 'Use the GCF.', parts: [
        { id: '15', outcome: 'AN1', level: 'MAS', make: function (r) {
          var C = r.pick([['A community garden', 'garden plots', 'plots', 'm'], ['A rectangular field', 'square sections', 'sections', 'm'], ['A hallway floor', 'square tiles', 'tiles', 'cm'], ['A rectangular wall', 'square panels', 'panels', 'cm']]);
          var v = find(function () { var g = r.pick([6, 8, 9, 10, 12, 14, 15, 18, 20, 21, 24]), xy = r.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7], [5, 7], [4, 7]]); return { g: g, x: xy[0], y: xy[1] }; }, function (v) { return v.g * v.y <= 150; }, { g: 42, x: 2, y: 3 });
          var g = v.g, a = g * v.x, b = g * v.y, L = lcm(a, b), cnt = v.x * v.y;
          var sideC = K.number(g, function (u) { if (u === L) return { code: 'u1t-tile-lcm', hint: 'The side of each ' + C[2].replace(/s$/, '') + ' must divide <b>into</b> both ' + t(a) + ' and ' + t(b) + ': that is a common <b>factor</b>, the GCF.' }; return gcfDiag([a, b])(u); });
          var cntC = numChk(cnt, [{ v: v.x + v.y, code: 'u1t-tile-add', hint: 'There are ' + t(v.x) + ' along one side and ' + t(v.y) + ' along the other: the rows and columns <b>multiply</b>.' }, { v: a * b / g, code: 'u1t-tile-area', hint: 'Divide the whole area by the area of <b>one</b> ' + C[2].replace(/s$/, '') + ' (side × side), or multiply the number along each side.' }]);
          var p = fieldsP(C[0] + ' measures ' + t(a) + ' ' + C[3] + ' by ' + t(b) + ' ' + C[3] + '. It will be divided into the largest possible identical ' + C[1] + ', with nothing left over along either side. Find the side length of each one, and how many there will be.',
            [{ name: 'Side', label: 'Side length:', after: C[3] }, { name: 'Number', label: 'Number of ' + C[2] + ':' }], [sideC, cntC], [String(g), String(cnt)],
            'side ' + t(g) + ' ' + C[3] + ', ' + t(cnt) + ' ' + C[2],
            'The side must divide evenly into ' + t(a) + ' and ' + t(b) + ', and be as large as possible: the <b>GCF</b>.<br>' + facEq(a) + ', ' + facEq(b) + ', so ' + t('\\text{GCF}=' + g) + ' ' + C[3] + '.<br>Along one side: ' + t(a + '\\div ' + g + '=' + v.x) + '; along the other: ' + t(b + '\\div ' + g + '=' + v.y) + '.<br>Number: ' + t(v.x + '\\times ' + v.y + '=' + cnt) + ' ' + C[2] + '.',
            ['The side of each square must divide into both lengths: find the GCF.', 'Count how many fit along each side, then multiply.'], 'largest squares ' + a + ' by ' + b,
            function (i, vals) { var s = vals[0]; return s > 0 && a % s === 0 && b % s === 0 ? (a / s) * (b / s) : null; });
          var cf = nt.divisors(g).filter(function (d) { return d > 1 && d < g; }).pop();
          p.bad = [[String(g), String(v.x + v.y)], [String(L), '1']].concat(cf ? [[String(cf), String((a / cf) * (b / cf))]] : []);
          return p;
        } }] },
      { num: '16', outcome: 'AN2', shared: function (r) { return { items: cmpShared(r) }; },
        stem: function (s) { return '<b>Without a calculator</b>, compare ' + s.items.map(function (x) { return t(x.tex); }).join(', ') + '.'; },
        parts: [
          { id: '16a', outcome: 'AN2', level: 'MAS', make: function (r, s) {
            var ms = s.items.filter(function (x) { return x.a; });
            var chk = ms.map(function (x) { return K.radical({ k: x.a, n: 2, m: x.b }, 'entire', { diag: function (val, rr) { if (rr && rr.n === 2 && Math.abs(rr.k[0]) === 1 && rr.k[1] === 1 && rr.m === x.a * x.b) return { code: 'u1t-rsq-coef', hint: 'Square the coefficient before it moves inside: ' + t(x.a + '=\\sqrt{' + x.a * x.a + '}') + '.' }; return null; } }); });
            var p = fieldsP('Write each mixed radical as an entire radical.', ms.map(function (x) { return { name: t(x.tex), before: t(x.tex + '='), mode: 'math', keys: 'radical' }; }), chk,
              ms.map(function (x) { return '\\sqrt{' + x.v + '}'; }), ms.map(function (x) { return t(x.tex + '=\\sqrt{' + x.v + '}'); }).join(', '),
              ms.map(function (x) { return t(x.tex + '=\\sqrt{' + x.a + '^{2}\\times ' + x.b + '}=\\sqrt{' + x.a * x.a + '\\times ' + x.b + '}=\\sqrt{' + x.v + '}'); }).join('<br>'),
              ['Square the coefficient and multiply it by the number under the root: ' + t('a\\sqrt{b}=\\sqrt{a^{2}\\times b}') + '.'], 'entire forms to compare');
            p.bad = [ms.map(function (x) { return '\\sqrt{' + x.a * x.b + '}'; })];
            return p;
          } },
          { id: '16b', outcome: 'AN2', level: 'MAS', make: function (r, s) {
            var sorted = s.items.slice().sort(function (a, b) { return a.v - b.v; }), by = {}; s.items.forEach(function (x) { by[x.id] = x; });
            var en = function (x) { return x.a ? x.tex + '=\\sqrt{' + x.v + '}' : x.tex; };
            return orderP(r, '<b>Without a calculator</b>, order from least to greatest: ' + s.items.map(function (x) { return t(x.tex); }).join(', ') + '.', sorted,
              function (a, b) { return t(by[a].tex) + ' and ' + t(by[b].tex) + ' are in the wrong order. Compare their entire forms: ' + t(en(by[a])) + ', ' + t(en(by[b])) + '.'; },
              'As entire radicals: ' + s.items.map(function (x) { return t(en(x)); }).join(', ') + '.<br>The bigger the number under the root, the bigger the root: ' + t(sorted.map(function (x) { return x.v; }).join('<')) + ', so<br>' + t(sorted.map(function (x) { return x.tex; }).join('\\ <\\ ')),
              ['Write every radical as an entire radical, then compare the numbers under the roots.'], 'order 3 mixed and 1 entire radical');
          } }] },
      { num: '17', outcome: 'AN2', shared: errShared,
        stem: function (s) { return s.who + ' worked out the radical below, but made an error.<br>' + errWork(s); },
        parts: [
          { id: '17a', outcome: 'AN2', level: 'MAS', make: function (r, s) {
            if (s.kind === 'sq') {
              var big = s.f * s.f, pq = P.number(s.who + '’s answer is <b>not in simplest form</b>. What perfect square (greater than ' + t('1') + ') is still a factor of ' + t(s.rest) + ', under the root?', big,
                function (v) { if (v === s.f) return { code: 'u1t-err-factor', hint: 'That’s its square root. The perfect square itself is ' + t(s.f + '^{2}') + '.' }; if (v === s.q * s.q) return { code: 'u1t-err-repeat', hint: 'That one was already taken out. Look at what is <b>left</b> under the root, ' + t(s.rest) + '.' }; if (v > 1 && isPow(v, 2) && s.rest % v) return { code: 'u1t-err-factor', hint: t(v) + ' doesn’t divide ' + t(s.rest) + '.' }; return null; },
                t(s.rest + '=' + big + '\\times ' + s.m) + ', so ' + t(big) + ' (a perfect square) is still under the root. ' + s.who + ' pulled out ' + t(s.q * s.q) + ', but not the <b>largest</b> perfect square factor of ' + t(s.N) + ', so the work isn’t finished.',
                ['Look at the number left under the root, ' + t(s.rest) + '. Does it have a factor of ' + t('4, 9, 16, 25, …') + '?'], 'error: square factor left in ' + s.rest, { before: t(s.rest + '=\\ ') , after: t('\\times\\ \\ldots') });
              pq.bad = [String(s.f)].concat(s.q !== s.f ? [String(s.q * s.q)] : []);
              return pq;
            }
            var n = s.kind === 'ent' ? 2 : 3, kk = Math.pow(s.k, n), wrongPow = s.kind === 'ent' ? s.k : s.k * s.k;
            var pe = P.number('Before ' + t(s.k) + ' moves inside the ' + rootWord(n) + ' root, it must be written as a ' + rootWord(n) + ' root itself: ' + t(s.k + '=' + rt(n, '?')) + '. What number goes under the root?', kk,
              function (v) { if (v === wrongPow) return { code: 'u1t-err-repeat', hint: 'That’s what ' + s.who + ' did. Check: ' + t(rt(n, wrongPow)) + ' is not ' + t(s.k) + '.' }; if (v === Math.pow(s.k, n === 2 ? 3 : 2)) return { code: 'u1t-err-power', hint: 'Raise ' + t(s.k) + ' to the power of the <b>index</b>, ' + t(n) + '.' }; return null; },
              t(s.k + '=' + rt(n, s.k + '^{' + n + '}') + '=' + rt(n, kk)) + '. ' + s.who + (s.kind === 'ent' ? ' multiplied ' + t(s.k) + ' by ' + t(s.m) + ' without squaring it first.' : ' squared ' + t(s.k) + ', but with index ' + t('3') + ' the coefficient must be <b>cubed</b>.'),
              ['Which number has a ' + rootWord(n) + ' root of ' + t(s.k) + '?', 'Raise ' + t(s.k) + ' to the power ' + t(n) + '.'], 'error: coefficient as a root ' + s.kind + ' ' + s.k, { before: 'Under the root:' });
            pe.bad = [String(wrongPow)];
            return pe;
          } },
          { id: '17b', outcome: 'AN2', level: 'MAS', make: function (r, s) {
            if (s.kind === 'sq') {
              var k = s.q * s.f, p = P.radical('Write ' + t('\\sqrt{' + s.N + '}') + ' correctly, as a mixed radical in simplest form.', { k: k, n: 2, m: s.m }, 'mixed',
                t('\\sqrt{' + s.N + '}=' + s.q + '\\sqrt{' + s.rest + '}=' + s.q + '\\sqrt{' + s.f * s.f + '\\times ' + s.m + '}=' + s.q + '\\times ' + s.f + '\\sqrt{' + s.m + '}=' + rad(k, 2, s.m)) + '.<br>(In one step: the largest perfect square factor of ' + t(s.N) + ' is ' + t(k * k) + ', and ' + t('\\sqrt{' + s.N + '}=\\sqrt{' + k * k + '\\times ' + s.m + '}=' + rad(k, 2, s.m)) + '.)',
                ['Simplify ' + t('\\sqrt{' + s.rest + '}') + ', then multiply by the ' + t(s.q) + ' in front.'], 'error fix sqrt ' + s.N,
                { diag: function (val, rr) { if (rr && rr.n === 2 && rr.m === s.m && rr.k[1] === 1 && rr.k[0] === s.f) return { code: 'u1t-coef-forgot', hint: 'You simplified ' + t('\\sqrt{' + s.rest + '}') + ', but the ' + t(s.q) + ' in front still multiplies it: ' + t(s.q + '\\times ' + s.f + '\\sqrt{' + s.m + '}') + '.' }; if (rr && rr.n === 2 && rr.m === s.m && rr.k[1] === 1 && rr.k[0] === s.q + s.f) return { code: 'u1t-coef-added', hint: 'Multiply the numbers in front, don’t add them: ' + t(s.q + '\\times ' + s.f) + '.' }; return null; } });
              p.bad = [rad(s.f, 2, s.m), rad(s.q + s.f, 2, s.m)].filter(function (b) { return b !== p.key; });
              return p;
            }
            var n = s.kind === 'ent' ? 2 : 3, wp = s.kind === 'ent' ? s.k : s.k * s.k, EM = Math.pow(s.k, n) * s.m;
            var q = P.radical('Write the correct entire radical for ' + t(rad(s.k, n, s.m)) + '.', { k: s.k, n: n, m: s.m }, 'entire', entireSol(s.k, n, s.m),
              ['Write ' + t(s.k) + ' as ' + t(rt(n, Math.pow(s.k, n))) + ', then multiply the numbers under one root.'], 'error fix entire ' + s.kind + ' ' + s.k + ',' + s.m,
              { diag: function (val, rr) { if (rr && rr.n === n && Math.abs(rr.k[0]) === 1 && rr.k[1] === 1 && rr.m === wp * s.m) return { code: 'u1t-err-repeat', hint: 'That repeats ' + s.who + '’s error: ' + t(s.k) + ' must be ' + (n === 2 ? 'squared' : '<b>cubed</b>') + ' before it moves inside.' }; return null; } });
            q.bad = [rt(n, wp * s.m), rt(n, EM + s.m)];
            return q;
          } }] },
      { num: '18', outcome: 'AN2', stem: 'Give <b>exact</b> answers in simplest mixed radical form.', parts: [
        { id: '18', outcome: 'AN2', level: 'MAS', make: function (r) {
          var C = r.pick([['rug', 'square feet', 'ft'], ['tarp', 'square feet', 'ft'], ['patio', 'square metres', 'm'], ['garden', 'square metres', 'm'], ['tile', 'square centimetres', 'cm'], ['window', 'square centimetres', 'cm']]);
          var km = find(function () { return [r.int(2, 6), r.pick([2, 3, 5, 6, 7, 10, 11])]; }, function (v) { var A = v[0] * v[0] * v[1]; return A >= 20 && A <= 200; }, [4, 11]), k = km[0], m = km[1], A = k * k * m;
          var side = K.radical({ k: k, n: 2, m: m }, 'mixed', { diag: function (val, rr) { if (Math.abs(val - A / 2) < 1e-9) return { code: 'u1t-half-not-root', hint: 'The side isn’t half the area: side ' + t('=\\sqrt{\\text{area}}') + '.' }; if (Math.abs(val - A / 4) < 1e-9) return { code: 'u1t-quarter-not-root', hint: 'Side ' + t('=\\sqrt{\\text{area}}') + ', not area ' + t('\\div 4') + '.' }; return null; } });
          var per = K.radical({ k: 4 * k, n: 2, m: m }, 'mixed', { diag: function (val, rr) { if (rr && rr.n === 2 && rr.m === m && rr.k[1] === 1 && rr.k[0] === 2 * k) return { code: 'u1t-perim-two', hint: 'A square has <b>four</b> sides: perimeter ' + t('=4\\times') + ' side.' }; if (rr && rr.n === 2 && rr.m === m && rr.k[1] === 1 && rr.k[0] === k + 4) return { code: 'u1t-coef-added', hint: 'Multiply: ' + t('4\\times ' + k + '\\sqrt{' + m + '}=' + 4 * k + '\\sqrt{' + m + '}') + '.' }; return null; } });
          var p = fieldsP('A square ' + C[0] + ' has an area of ' + t(A) + ' ' + C[1] + '. Find its exact side length and its exact perimeter.',
            [{ name: 'Side', label: 'Side length:', mode: 'math', keys: 'radical', after: C[2] }, { name: 'Perimeter', label: 'Perimeter:', mode: 'math', keys: 'radical', after: C[2] }], [side, per],
            [rad(k, 2, m), rad(4 * k, 2, m)], 'side ' + t(rad(k, 2, m)) + ' ' + C[2] + ', perimeter ' + t(rad(4 * k, 2, m)) + ' ' + C[2],
            'Side ' + t('=\\sqrt{' + A + '}=\\sqrt{' + k * k + '\\times ' + m + '}=' + rad(k, 2, m)) + ' ' + C[2] + '.<br>Perimeter ' + t('=4\\times ' + rad(k, 2, m) + '=' + rad(4 * k, 2, m)) + ' ' + C[2] + '.',
            ['Side ' + t('=\\sqrt{\\text{area}}') + ': take out the largest perfect square factor of ' + t(A) + '.', 'Perimeter ' + t('=4\\times') + ' side: multiply the coefficient by ' + t('4') + '.'], 'square area ' + A + ' exact side');
          p.bad = [[rad(k, 2, m), rad(2 * k, 2, m)], [String(A / 2), String(2 * A)]];
          return p;
        } }] }
    ]
  });

  /* ---------- part makers used above (function declarations are hoisted) ---------- */
  function gcfPart(nums) {
    var g = gcfA(nums), L = lcmA(nums), s = sortN(nums), m = s[0], ds = nt.divisors(m).reverse(), shown = [];
    for (var i = 0; i < ds.length; i++) { shown.push(ds[i]); if (ds[i] === g) break; }
    var p = P.number('Find the GCF of ' + nlist(nums) + '.', g, gcfDiag(nums),
      nums.map(facEq).join(', ') + '.<br>Shared primes, lowest power: ' + t('\\text{GCF}=' + K.fac(g) + (nt.isPrime(g) ? '' : '=' + g)) + '.<br>(Or: the factors of ' + t(m) + ', largest first, are ' + t(shown.join(',\\ ')) + '; the first that divides ' + (nums.length === 2 ? t(s[1]) : 'every number') + ' is ' + t(g) + '.)',
      ['Factor each number into primes.', 'GCF: the primes they all share, each at its lowest power.'], 'GCF of ' + nums.join(', '), { before: t('\\text{GCF}=') });
    var cf = nt.divisors(g).filter(function (d) { return d > 1 && d < g; }).pop();
    p.bad = [L, prodOf(nums)].concat(cf ? [cf] : []).filter(function (x) { return x !== g; }).map(String);
    return p;
  }
  function lcmPart(nums) {
    var g = gcfA(nums), L = lcmA(nums), M = Math.max.apply(null, nums), ms = [];
    for (var i = 1; i <= L / M; i++) ms.push(M * i);
    var p = P.number('Find the LCM of ' + nlist(nums) + '.', L, lcmDiag(nums),
      nums.map(facEq).join(', ') + '.<br>Every prime, highest power: ' + t('\\text{LCM}=' + K.fac(L) + '=' + F(L)) + '.' + (ms.length <= 8 ? '<br>(Or: multiples of ' + t(M) + ': ' + t(ms.join(',\\ ')) + '. The first one that every number divides is ' + t(F(L)) + '.)' : ''),
      ['Factor each number into primes.', 'LCM: every prime that appears, each at its highest power.'], 'LCM of ' + nums.join(', '), { before: t('\\text{LCM}=') });
    p.bad = [g, prodOf(nums), 2 * L].filter(function (x) { return x !== L; }).map(String);
    return p;
  }
})(window);
