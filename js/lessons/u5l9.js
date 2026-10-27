/* Math 15 · Unit 5 · Lesson 9 — Function Notation: Evaluating and Interpreting f(x) (RF8)
 * Assignment 9 (u5_L09.tex, questions 1–16) and the Lesson 9 Extra Practice (u5_EP09.tex, questions 1–19).
 * Twin of Math 10C u5l6 ("Function Notation"): its part makers (numPart, polyPart, solPart, PL) and diagnosis codes
 * (fn-neg-sub, fn-neg-square, fn-times, fn-binom-sq, fn-plus-out …) are reused with the same meanings.
 * Every part is a generator keeping the booklet's structure (which input is negative or a fraction, a square, an
 * expression input, two functions at once, the context) with the booklet's own numbers among the values.
 * Integer answers use the number box; fraction answers the fraction keypad (K.value: 7/2 or 3.5 both accepted);
 * expressions the poly keypad (K.P.poly: any equivalent simplified form, expanded); "solve f(x) = b" the solutions box
 * (K.P.valueSet: x = 5, or ±3). A statement in function notation ("M(5) = 95") is typed with its own small keypad and
 * checked for the name, the input and the output (swapped input/output gets a hint). Explain/interpret questions are
 * multiple choice whose options are interpretations, or a grid (dollars vs tickets).
 * Levels (Math 15): LIM notation vocabulary; BEG evaluating at a positive input or a letter; EMG negatives, zero,
 * squares, contexts; PRG fractions, expression inputs, solving f(x) = b, two functions; ADV f(x + 2) with a square,
 * f(x) = g(x), the rule from f(0) and one value; MAS the rule from two values with neither input 0 (EP 15b). */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form, B = K.P, P = HW.poly;

  HW.addCodes({
    'fn-times': 'Read f(a) as f × a', 'fn-add-coef': 'Added the coefficient instead of multiplying', 'fn-solved': 'Solved f(x) = a instead of evaluating f(a)',
    'fn-evaluated': 'Evaluated f(b) instead of solving f(x) = b', 'fn-neg-sub': 'Sign slip substituting a negative', 'fn-neg-square': 'Squared a negative and got a negative',
    'fn-square-2x': 'Squared by doubling (x² as 2x)', 'fn-const': 'Left out the constant term', 'fn-const-sign': 'Wrong sign on the constant',
    'fn-zero-coef': 'Treated m·0 as m', 'fn-zero-all': 'Gave f(0) = 0', 'fn-order': 'Subtracted before multiplying', 'fn-sign': 'Sign slip',
    'fn-dist': 'Didn’t multiply every term of the bracket', 'fn-dist-sign': 'Didn’t change the sign of the second term in the bracket',
    'fn-solve-inverse': 'Inverse-operation slip (added instead of subtracted)', 'fn-solve-divide': 'Didn’t divide by the coefficient', 'fn-solve-sign': 'Sign slip solving',
    'fn-sqrt-not': 'Didn’t take the square root', 'fn-input-sum': 'Added the inputs first (g(6)+g(−3) as g(3))', 'fn-fee': 'Left out the fixed fee',
    'fn-binom-sq': 'Squared a binomial as (a+b)² = a² + b²', 'fn-plus-out': 'Confused f(a + 1) with f(a) + 1', 'fn-sq-coef': 'Squared only the letter: (2a)² as 2a²',
    'fn-reverse': 'Subtracted in the wrong order', 'fn-add-fns': 'Added instead of subtracting', 'fn-eq-flip': 'Swapped input and output in f(a) = b', 'fn-one-root': 'Used only one solution',
    'fn-unchanged': 'Didn’t substitute', 'fn-frac-mult': 'Multiplied a fraction input wrongly', 'fn-frac-sq': 'Squared a fraction wrongly', 'fn-half-num': 'Divided only one term by 2',
    'u5l9-stmt-name': 'Statement uses the wrong function name', 'u5l9-stmt-values': 'Statement with the wrong values', 'u5l9-m-flip': 'Rate of change upside down',
    'u5l9-m-sign': 'Rate of change with the wrong sign', 'u5l9-b': 'Wrong constant term in the rule', 'u5l9-table': 'Wrong table entry', 'u5l9-pick': 'Wrong choices in the grid'
  });
  HW.addPartial({ 'fn-frac-mult': 's', 'fn-frac-sq': 's', 'fn-half-num': 's', 'u5l9-stmt-name': 's', 'u5l9-stmt-values': 'n', 'u5l9-m-flip': 'b', 'u5l9-m-sign': 's', 'u5l9-b': 'b', 'u5l9-table': 's', 'u5l9-pick': 'n' });

  /* ---------------- numbers and LaTeX (10C u5l6) ---------------- */
  function cl(x) { return Math.round(x * 1e6) / 1e6; }
  function same(a, b) { return Math.abs(a - b) < 1e-9; }
  function nT(x) { return F(cl(x)); }
  function vt(x) { if (Math.abs(x - Math.round(x)) < 1e-9) return F(Math.round(x)); for (var q = 2; q <= 24; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-6) return ex.texRat(ex.norm(Math.round(x * q), q)); return nT(x); }
  function sgp(x) { x = cl(x); return x < 0 ? '(' + vt(x) + ')' : vt(x); }
  function ip(x) { return x < 0 || !Number.isInteger(x) ? '\\left(' + vt(x) + '\\right)' : vt(x); }   // an input written in brackets when needed
  function sg(c) { c = cl(c); return c < 0 ? vt(c) : '+' + vt(c); }
  function range(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o; }
  function nz(a, b) { return range(a, b).filter(function (x) { return x !== 0; }); }
  function term(c, v, first) { c = cl(c); if (!c) return ''; var neg = c < 0, mag = vt(Math.abs(c)); if (v && mag === '1') mag = ''; return (neg ? '-' : first ? '' : '+') + mag + v; }
  function lin(list) { var s = ''; list.forEach(function (p) { s += term(p[0], p[1], s === ''); }); return s || '0'; }
  function sortU(a) { var s = a.slice().sort(function (x, y) { return x - y; }); return s.filter(function (x, i) { return i === 0 || !same(x, s[i - 1]); }); }
  function setSame(A, Bs) { A = sortU(A); Bs = sortU(Bs); return A.length === Bs.length && A.every(function (x, i) { return Math.abs(x - Bs[i]) < 1e-6; }); }
  function pickWhere(gen, okf) { for (var i = 0; i < 3000; i++) { var o = gen(); if (okf(o)) return o; } throw new Error('u5l9: no valid numbers'); }
  function PL(list) { var p = P.num(0); list.forEach(function (q) { var v = {}; if (q[1]) v[q[1]] = q[2] || 1; p = P.add(p, q[1] ? P.mono(q[0], v) : P.num(q[0])); }); return p; }

  /* ---------------- part makers (10C u5l6) ---------------- */
  function numPart(prompt, ans, dl, sol, hints, text, inp) {
    ans = cl(ans);
    var L = (dl || []).filter(function (d) { return d && isFinite(d[0]) && !same(cl(d[0]), ans); });
    var p = B.number(prompt, ans, function (v) { for (var i = 0; i < L.length; i++) if (Math.abs(v - L[i][0]) < 1e-6) return { code: L[i][1], hint: L[i][2] }; return null; }, sol, hints, text, inp);
    p.bad = L.map(function (d) { return String(cl(d[0])); }).filter(function (s, i, a) { return a.indexOf(s) === i; });
    return p;
  }
  /* a value that may be a fraction (fraction keypad; 7/2 or 3.5) */
  function valPart(prompt, ans, dl, sol, hints, text, before) {
    var L = (dl || []).filter(function (d) { return d && isFinite(d[0]) && !same(d[0], ans); });
    var p = B.math(prompt, K.value(ans, { diag: function (v) { for (var i = 0; i < L.length; i++) if (Math.abs(v - L[i][0]) < 1e-6) return { code: L[i][1], hint: L[i][2] }; return null; } }), vt(ans), sol, hints, text, { keys: 'fraction', before: before });
    p.bad = L.map(function (d) { return vt(d[0]); }).filter(function (s, i, a) { return a.indexOf(s) === i; });
    if (!Number.isInteger(ans) && Number.isInteger(+(ans * 1000).toFixed(6))) p.good = [String(cl(ans))];
    return p;
  }
  function polyPart(prompt, before, T, keyTex, wl, sol, hints, text, vars) {
    var W = (wl || []).filter(function (w) { return !P.eq(w.is, T); });
    var p = B.poly(prompt, T, { before: before, keyTex: keyTex, wrong: W, vars: vars }, sol, hints, text);
    p.bad = W.map(function (w) { return P.tex(w.is); });
    return p;
  }
  function solPart(prompt, vals, v, dl, sol, hints, text, keyTex) {
    var L = (dl || []).filter(function (d) { return d[0].length && d[0].every(isFinite) && !setSame(d[0], vals); });
    var p = B.valueSet(prompt, vals, { v: v, keyTex: keyTex, diag: function (A) { for (var i = 0; i < L.length; i++) if (setSame(A, L[i][0])) return { code: L[i][1], hint: L[i][2] }; return null; } }, sol, hints, text);
    p.bad = L.map(function (d) { return d[0].map(function (x) { return v + '=' + vt(x); }).join(', '); });
    var s = sortU(vals);
    p.good = [s.slice().reverse().map(function (x) { return v + '=' + vt(x); }).join(', '), s.map(vt).join(', ')];
    if (s.length === 2 && same(s[0], -s[1])) p.good.push('\\pm ' + vt(s[1]));
    return p;
  }
  function mc(r, prompt, opts, sol, hints, text, keepOrder) { return B.mc(r, prompt, opts, sol, hints, text, keepOrder); }
  function mc2(r, prompt, opts, sol, hints, text) { var p = B.mc(r, prompt, opts, sol, hints, text, true); p.tries = 1; p.input.columns = 2; return p; }

  var HE = ['To evaluate ' + t('f(a)') + ', replace <b>every</b> ' + t('x') + ' in the formula with ' + t('a') + ' (in brackets), then simplify.', 'The brackets in ' + t('f(a)') + ' mark the input — they do not mean “times”.'];
  var HN = ['Put a negative input in brackets — for example, if ' + t('f(x)=4x-9') + ', then ' + t('f(-2)=4(-2)-9') + '. Then use the sign rules carefully.', 'Do powers first, then multiplication, then addition and subtraction.'];
  var HS = ['To solve ' + t('f(x)=b') + ', you are given the <b>output</b>. Set the formula equal to ' + t('b') + ' and solve for the input ' + t('x') + '.', 'Check: substitute your answer back into the formula — do you get ' + t('b') + '?'];
  var HX = ['Replace every ' + t('x') + ' with the whole expression, in brackets, then expand and collect like terms.', 'A number in front of the bracket multiplies <b>every</b> term inside it, signs included.'];
  var HF = ['Put the fraction in brackets and multiply: e.g. ' + t('6\\left(\\frac{1}{2}\\right)=3') + '.', 'Leave a fractional answer as an exact fraction (or a terminating decimal).'];

  /* ---- f(a) for a linear f(x) = m x + b (written as m x + b, or as b − m x when cf) ---- */
  function linEval(name, m, b, a, cf, text) {
    var ftex = cf ? lin([[b, ''], [m, 'x']]) : lin([[m, 'x'], [b, '']]), ans = m * a + b;
    var steps = cf ? vt(b) + (m < 0 ? '-' + vt(-m) : '+' + vt(m)) + ip(a) : (m === 1 ? '' : m === -1 ? '-' : vt(m)) + ip(a) + sg(b);
    var dl = [[a < 0 ? -m * a + b : NaN, 'fn-neg-sub', 'Check the sign of ' + t(vt(m) + '\\times ' + sgp(a)) + ': a negative times a negative is positive; a positive times a negative is negative.'],
      [m + a + b, 'fn-add-coef', t(term(m, 'x', true)) + ' means ' + t(vt(m) + '\\times x') + ': multiply the input by ' + t(vt(m)) + '.'], [m * a, 'fn-const', 'Don’t forget the constant ' + t(sg(b)) + '.'], [m * a - b, 'fn-const-sign', 'Check the sign of the constant: the rule has ' + t(sg(b)) + '.'],
      [(a - b) / m, 'fn-solved', 'You solved ' + t(name + '(x)=' + vt(a)) + '. Here ' + t(vt(a)) + ' is the <b>input</b>: substitute it for ' + t('x') + '.']];
    if (a === 0) dl.push([m + b, 'fn-zero-coef', t(vt(m) + '\\times 0=0') + ', so only the constant is left.'], [0, 'fn-zero-all', 'At ' + t('x=0') + ' the ' + t('x') + '-term is ' + t('0') + ', but the constant ' + t(sg(b)) + ' remains.']);
    if (cf) dl.push([(b + m) * a, 'fn-order', 'Multiply before you add or subtract: ' + t(vt(m) + '\\times ' + sgp(a)) + ' first.']);
    var mk = Number.isInteger(ans) ? numPart : valPart;
    return mk(t(name + '(' + vt(a) + ')'), ans, dl, t(name + '(' + vt(a) + ')=' + steps + '=' + vt(ans)) + '.', !Number.isInteger(a) ? HF : a < 0 ? HN : HE, text);
  }
  /* ---- f(a) for f(x) = x² + p x + c ---- */
  function quadEval(name, pc, c, a, text) {
    var c0 = c ? sg(c) : '', ans = a * a + pc * a + c, steps = (a < 0 || !Number.isInteger(a) ? '\\left(' + vt(a) + '\\right)' : vt(a)) + '^{2}' + (pc ? term(pc, ip(a)) : '') + c0, mid = vt(a * a) + (pc ? sg(pc * a) : '') + c0;
    var dl = [[-a * a + pc * a + c, 'fn-neg-square', t(sgp(a) + '^{2}=' + vt(a * a)) + ': a negative times a negative is positive.'], [2 * a + pc * a + c, 'fn-square-2x', t('x^{2}') + ' means ' + t('x\\times x') + ', not ' + t('2\\times x') + '.'],
      [a * a - pc * a + c, 'fn-neg-sub', 'Check the sign of ' + t(vt(pc) + '\\times ' + sgp(a)) + '.'], [a * a + pc * a, 'fn-const', 'Don’t forget the constant ' + t(sg(c)) + '.'], [a * a + pc * a - c, 'fn-const-sign', 'Check the sign of the constant.']];
    if (!Number.isInteger(a)) dl.push([2 * a * a + pc * a + c, 'fn-frac-sq', t('\\left(' + vt(a) + '\\right)^{2}=' + vt(a) + '\\times ' + vt(a) + '=' + vt(a * a)) + '.']);
    var mk = Number.isInteger(ans) ? numPart : valPart;
    return mk(t(name + '(' + vt(a) + ')'), ans, dl, t(name + '(' + vt(a) + ')=' + steps + '=' + mid + '=' + vt(ans)) + '.', !Number.isInteger(a) ? HF : a < 0 ? HN : HE, text);
  }
  /* ---- solve m x + b = k ---- */
  function linSolve(name, m, b, k, cf, text, v) {
    v = v || 'x'; var x = (k - b) / m, ftex = cf ? lin([[b, ''], [m, v]]) : lin([[m, v], [b, '']]);
    var dl = [[[(k + b) / m], 'fn-solve-inverse', 'To undo ' + t(sg(b)) + ', do the opposite: ' + (b > 0 ? 'subtract' : 'add') + ' ' + t(vt(Math.abs(b))) + ' on both sides.'], [[k - b], 'fn-solve-divide', 'You have ' + t(term(m, v, true) + '=' + vt(k - b)) + ' — now divide both sides by ' + t(vt(m)) + '.'],
      [[-(k - b) / m], 'fn-solve-sign', 'Check the sign when you divide by ' + t(vt(m)) + '.'], [[m * k + b], 'fn-evaluated', 'You worked out ' + t(name + '(' + vt(k) + ')') + '. Here ' + t(vt(k)) + ' is the <b>output</b>: set the rule equal to ' + t(vt(k)) + ' and solve.']];
    return solPart(t(name + '(' + v + ')=' + vt(k)), [x], v, dl, t(ftex + '=' + vt(k)) + ' → ' + t(term(m, v, true) + '=' + vt(k - b)) + ' → ' + t(v + '=' + vt(x)) + '.<br>Check: ' + t(name + '(' + vt(x) + ')=' + vt(k)) + ' ✓', HS, text);
  }

  /* ---- a statement in function notation, e.g. M(5) = 95 ---- */
  var SK = 'u5l9stmt';
  if (HW.widgets && HW.widgets.KEYSETS && !HW.widgets.KEYSETS[SK]) {
    HW.widgets.KEYSETS[SK] = function (opt) {
      var d = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; }, L = ((opt && opt.vars) || ['f'])[0];
      return [[d(7), d(8), d(9), { label: '<i>' + L + '</i>', tex: L, plain: L }, { label: '⌫', fn: 'del', title: 'Delete' }], [d(4), d(5), d(6), { label: '( )', tex: '\\left(#0\\right)', plain: '(' }, { label: 'clear', fn: 'clear' }],
        [d(1), d(2), d(3), { label: '=', tex: '=', plain: '=' }, { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of the brackets)' }], [d(0), { label: '.', tex: '.', plain: '.' }, { label: '−', tex: '-', plain: '-' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    };
    if (HW.widgets.KEYHELP) HW.widgets.KEYHELP[SK] = ['Type the name, the input in brackets, then = and the output, e.g. ' + HW.k('C(8)=63') + '. Press <b>▶</b> to step out of the brackets.', 'Type e.g. <code>C(8) = 63</code>.'];
  }
  function stmtPart(prompt, name, a, b, sol, hints, text) {
    var check = function (resp) {
      var s = String(resp == null ? '' : resp).replace(/\\left|\\right/g, '').replace(/\\[,;! ]|\s/g, '').replace(/\\lparen/g, '(').replace(/\\rparen/g, ')');
      if (!s) return form('empty', 'Type the statement, e.g. ' + t(name + '(8)=63') + '.');
      var m = /^([A-Za-z])\((-?[\d.]+)\)=(-?[\d.]+)$/.exec(s), m2 = /^(-?[\d.]+)=([A-Za-z])\((-?[\d.]+)\)$/.exec(s);
      if (m2) m = [m2[0], m2[2], m2[3], m2[1]];
      if (!m) return form('unreadable', 'Write it as the name, the input in brackets, then the output: e.g. ' + t(name + '(8)=63') + '.');
      var A = +m[2], Bv = +m[3];
      if (same(A, b) && same(Bv, a) && !same(a, b)) return wrong('fn-eq-flip', 'Input and output are swapped: inside the brackets goes the <b>input</b> (' + t(vt(a)) + '); after the ' + t('=') + ' sign goes the <b>output</b> (' + t(vt(b)) + ').');
      if (!same(A, a) || !same(Bv, b)) return wrong('u5l9-stmt-values', 'Check the numbers: which one is the input and which is the output?');
      if (m[1] !== name) return form('u5l9-stmt-name', 'Right numbers — but this function is called ' + t(name) + '.');
      return ok();
    };
    return { prompt: prompt, input: { type: 'math', keys: SK, vars: [name], placeholder: 'e.g. ' + name + '(8) = 63' }, check: check, key: name + '(' + vt(a) + ')=' + vt(b), answer: t(name + '(' + vt(a) + ')=' + vt(b)), solution: sol, hints: hints || ['The input goes inside the brackets; the output goes after the equals sign.'], text: text,
      good: [name + '\\left(' + vt(a) + '\\right)=' + vt(b), vt(b) + '=' + name + '(' + vt(a) + ')'], bad: [name + '(' + vt(b) + ')=' + vt(a), name + '(' + vt(a) + ')=' + vt(b + 1)] };
  }

  /* ---- contexts ---- */
  var CTX9 = [
    { n: 'P', v: 'h', what: 'parking for', unit: 'hours', fee: 'entry fee', stem: function (F0, R0) { return 'A parking garage charges a flat $' + F0 + ' entry fee plus $' + R0 + ' for every hour parked. The total cost, in dollars, of parking for ' + t('h') + ' hours is ' + t('P(h)=' + R0 + 'h+' + F0) + '.'; }, F: [2, 3, 4, 5], R: [3, 4, 5, 6], says: function (a, c) { return 'Parking for ' + a + ' hours costs $' + c + '.'; } },
    { n: 'C', v: 'n', what: 'ordering', unit: 'tacos', fee: 'setup fee', stem: function (F0, R0) { return 'A food truck charges a $' + F0 + ' setup fee plus $' + R0 + ' per taco. The total cost, in dollars, of ordering ' + t('n') + ' tacos is ' + t('C(n)=' + R0 + 'n+' + F0) + '.'; }, F: [5, 6, 8, 10], R: [2, 3, 4], says: function (a, c) { return 'Ordering ' + a + ' tacos costs $' + c + '.'; } },
    { n: 'B', v: 'g', what: 'bowling', unit: 'games', fee: 'shoe rental', stem: function (F0, R0) { return 'A bowling alley charges $' + F0 + ' for shoe rental plus $' + R0 + ' per game. The total cost, in dollars, of bowling ' + t('g') + ' games is ' + t('B(g)=' + R0 + 'g+' + F0) + '.'; }, F: [3, 4, 5], R: [6, 7, 8, 9], says: function (a, c) { return 'Bowling ' + a + ' games costs $' + c + '.'; } }];
  function ctxMeaning(r, c, F0, R0, a, ask, text) { // MC: what does name(a) = value mean?
    var val = R0 * a + F0, n = c.n;
    return mc(r, ask, [{ html: c.says(a, val), right: true },
      { html: c.says(val, a), why: 'In ' + t(n + '(' + a + ')=' + val) + ' the input ' + t(a) + ' (inside the brackets) is the number of ' + c.unit + '; the output ' + t(val) + ' is the cost.', code: 'flip' },
      { html: 'Each of the ' + c.unit + ' costs $' + val + '.', why: 'The rate per ' + c.unit.replace(/s$/, '') + ' is $' + R0 + '. ' + t(val) + ' is the <b>total</b> for ' + a + ' ' + c.unit + '.', code: 'rate' },
      { html: 'The cost is $' + val + ' times ' + a + '.', why: 'The brackets show the input, not multiplication.', code: 'times' }],
      t(n + '(' + a + ')=' + R0 + '(' + a + ')+' + F0 + '=' + val) + ': ' + c.says(a, val), ['In ' + t(n + '(a)=b') + ', ' + t('a') + ' is the input (the number of ' + c.unit + ') and ' + t('b') + ' is the output (the cost).'], text);
  }

  /* ================= assignment ================= */
  var QUESTIONS = [
    { num: '1', section: 'Part A — Notation and Vocabulary', parts: [{ id: '1', level: 'LIM', make: function (r) {
      var n = r.pick(['f', 'f', 'g', 'h']);
      return mc(r, 'Fill in the blanks: ' + t(n + '(x)') + ' means the ______ of function ______ when the input is ______.', [{ html: 'output; ' + t(n) + '; ' + t('x'), right: true }, { html: 'input; ' + t(n) + '; ' + t('x'), why: t(n + '(x)') + ' is what comes <b>out</b> of the function.', code: 'input' },
        { html: 'output; ' + t('x') + '; ' + t(n), why: 'The letter outside the brackets names the function; the one inside is the input.', code: 'swap' }, { html: 'product; ' + t(n) + '; ' + t('x'), why: t(n + '(x)') + ' is not ' + t(n) + ' times ' + t('x') + '.', code: 'times' }],
        t(n + '(x)') + ' means the <b>output</b> of function <b>' + t(n) + '</b> when the input is <b>' + t('x') + '</b>.', ['Read ' + t(n + '(x)') + ' as “' + n + ' of x”.'], 'notation meaning');
    } }] },
    { num: '2', stem: 'Choose the correct word in each case.', parts: [
      { id: '2a', sub: 'a', level: 'LIM', make: function (r) { var n = r.pick(['f', 'g', 'h']); return mc2(r, '(a) ' + t(n + '(x)') + ' means', [{ html: '“' + t(n) + ' times ' + t('x') + '”', why: 'The brackets mark the input; ' + t(n) + ' is a name, not a number.', code: 'times' }, { html: '“the output of ' + t(n) + ' at input ' + t('x') + '”', right: true }], t(n + '(x)') + ' is the output of ' + t(n) + ' at the input ' + t('x') + '.', [], 'f(x) meaning'); } },
      { id: '2b', sub: 'b', level: 'LIM', make: function (r) { var n = r.pick(['f', 'g', 'h']); return mc2(r, '(b) In ' + t(n + '(x)') + ', the letter ' + t('x') + ' represents the', [{ html: 'input', right: true }, { html: 'output', why: t('x') + ' goes <b>into</b> the function.', code: 'out' }], t('x') + ' is the input.', [], 'x is input'); } },
      { id: '2c', sub: 'c', level: 'LIM', make: function (r) { var n = r.pick(['f', 'g', 'h']); return mc2(r, '(c) In ' + t(n + '(x)') + ', the whole symbol ' + t(n + '(x)') + ' represents the', [{ html: 'input', why: 'The whole symbol is the result — what comes out.', code: 'in' }, { html: 'output', right: true }], t(n + '(x)') + ' is the output.', [], 'f(x) is output'); } }] },
    { num: '3', stem: 'Rewrite each equation using function notation, with the function named ' + t('f') + '.', parts: [
      { id: '3a', sub: 'a', level: 'LIM', make: function (r) { var m = r.pick(nz(-6, 6)), b = r.pick(nz(-9, 9)); if (r.chance(0.15)) { m = 3; b = -2; } var e = lin([[m, 'x'], [b, '']]);
        return mc(r, '(a) ' + t('y=' + e), [{ html: t('f(x)=' + e), right: true }, { html: t('f=' + e), why: 'Name the function <b>and</b> its input: ' + t('f(x)') + '.', code: 'f' }, { html: t('y(f)=' + e), why: 'The function’s name is ' + t('f') + ' and its input is ' + t('x') + ': ' + t('f(x)') + '.', code: 'yf' }, { html: t('f(' + e + ')=y'), why: t('f(x)') + ' replaces ' + t('y') + ', and the rule goes on the right.', code: 'in' }],
          'Replace ' + t('y') + ' with ' + t('f(x)') + ': ' + t('f(x)=' + e) + '.', ['' + t('f(x)') + ' takes the place of ' + t('y') + '.'], 'rewrite linear'); } },
      { id: '3b', sub: 'b', level: 'LIM', make: function (r) { var c = r.pick(nz(-9, 9)), a = r.pick([1, 1, 2, -1]); if (r.chance(0.15)) { c = 1; a = 1; } var e = lin([[a, 'x^{2}'], [c, '']]);
        return mc(r, '(b) ' + t('y=' + e), [{ html: t('f(x)=' + e), right: true }, { html: t('f(x^{2})=' + e), why: 'The input is ' + t('x') + ': write ' + t('f(x)') + '.', code: 'sq' }, { html: t('f=' + e), why: 'Name the function <b>and</b> its input: ' + t('f(x)') + '.', code: 'f' }, { html: t('f(x)\\cdot y=' + e), why: t('f(x)') + ' replaces ' + t('y') + '.', code: 'times' }],
          t('f(x)=' + e) + '.', ['' + t('f(x)') + ' takes the place of ' + t('y') + '.'], 'rewrite quadratic'); } }] },

    { num: '4', section: 'Part B — Evaluating for a Numerical Input', stem: function (sh) { return 'If ' + t('f(x)=' + lin([[1, 'x'], [sh.b, '']])) + ', determine:'; }, shared: function (r) { return { b: r.chance(0.15) ? 8 : r.pick(nz(-9, 12)), a: r.chance(0.15) ? [3, -6] : [r.int(2, 9), -r.int(2, 9)] }; },
      parts: [{ id: '4a', sub: 'a', level: 'BEG', make: function (r, sh) { return linEval('f', 1, sh.b, sh.a[0], false, 'f(a) x+b'); } }, { id: '4b', sub: 'b', level: 'BEG', make: function (r, sh) { return linEval('f', 1, sh.b, sh.a[1], false, 'f(neg) x+b'); } }, { id: '4c', sub: 'c', level: 'BEG', make: function (r, sh) { return linEval('f', 1, sh.b, 0, false, 'f(0) x+b'); } }] },
    { num: '5', stem: function (sh) { return 'If ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + ', determine:'; }, shared: function (r) { return r.chance(0.15) ? { m: 4, b: -3, a: [2, -5] } : { m: r.int(2, 7), b: r.pick(nz(-9, 9)), a: [r.int(2, 6), -r.int(2, 7)] }; },
      parts: [{ id: '5a', sub: 'a', level: 'BEG', make: function (r, sh) { return linEval('f', sh.m, sh.b, sh.a[0], false, 'f(a) mx+b'); } }, { id: '5b', sub: 'b', level: 'EMG', make: function (r, sh) { return linEval('f', sh.m, sh.b, sh.a[1], false, 'f(neg) mx+b'); } }, { id: '5c', sub: 'c', level: 'BEG', make: function (r, sh) { return linEval('f', sh.m, sh.b, 0, false, 'f(0) mx+b'); } }] },
    { num: '6', stem: function (sh) { return 'Function ' + t('g') + ' is defined by ' + t('g(x)=' + lin([[sh.b, ''], [-sh.m, 'x']])) + '. Evaluate:'; }, shared: function (r) { return r.chance(0.15) ? { m: 2, b: 7, a: [1, -3, 4] } : { m: r.int(2, 5), b: r.int(3, 12), a: [r.int(1, 2), -r.int(2, 5), r.int(3, 6)] }; },
      parts: [0, 1, 2].map(function (i) { return { id: '6' + 'abc'.charAt(i), sub: 'abc'.charAt(i), level: i === 1 ? 'EMG' : 'BEG', make: function (r, sh) { return linEval('g', -sh.m, sh.b, sh.a[i], true, 'g(a) b-mx'); } }; }) },
    { num: '7', stem: function (sh) { return 'Function ' + t('h') + ' is defined by ' + t('h(x)=x^{2}' + sg(sh.c)) + '. Evaluate:'; }, shared: function (r) { return r.chance(0.15) ? { c: -5, a: [3, -4] } : { c: r.pick(nz(-9, 9)), a: [r.int(2, 6), -r.int(2, 6)] }; },
      parts: [{ id: '7a', sub: 'a', level: 'BEG', make: function (r, sh) { return quadEval('h', 0, sh.c, sh.a[0], 'h(a) x^2+c'); } }, { id: '7b', sub: 'b', level: 'EMG', make: function (r, sh) { return quadEval('h', 0, sh.c, sh.a[1], 'h(neg) x^2+c'); } }, { id: '7c', sub: 'c', level: 'BEG', make: function (r, sh) { return quadEval('h', 0, sh.c, 0, 'h(0) x^2+c'); } }] },
    { num: '8', stem: function (sh) { return 'A function ' + t('f') + ' is defined by ' + t('f(x)=x^{2}' + term(sh.p, 'x')) + '. Find:'; }, shared: function (r) { return r.chance(0.15) ? { p: 2, a: [2, -3] } : { p: r.pick([2, 3, 4, -2, -3]), a: [r.int(1, 4), -r.int(2, 5)] }; },
      parts: [{ id: '8a', sub: 'a', level: 'EMG', make: function (r, sh) { return quadEval('f', sh.p, 0, sh.a[0], 'f(a) x^2+px'); } }, { id: '8b', sub: 'b', level: 'PRG', make: function (r, sh) { return quadEval('f', sh.p, 0, sh.a[1], 'f(neg) x^2+px'); } }] },
    { num: '9', stem: function (sh) { return 'Consider the functions ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + ' and ' + t('g(x)=x^{2}' + sg(sh.c)) + '. Evaluate:'; },
      shared: function (r) { return r.chance(0.15) ? { m: 4, b: 1, c: -3, a: 5, k: 2 } : { m: r.int(2, 6), b: r.pick(nz(-5, 6)), c: r.pick(nz(-6, 6)), a: r.int(3, 7), k: r.int(1, 4) }; },
      parts: [
        { id: '9a', sub: 'a', level: 'BEG', make: function (r, sh) { return linEval('f', sh.m, sh.b, sh.a, false, 'f(a) two fns'); } },
        { id: '9b', sub: 'b', level: 'BEG', make: function (r, sh) { return quadEval('g', 0, sh.c, sh.a, 'g(a) two fns'); } },
        { id: '9c', sub: 'c', level: 'PRG', make: function (r, sh) {
          var k = sh.k, fk = sh.m * k + sh.b, gk = k * k + sh.c, ans = fk + gk;
          return numPart(t('f(' + k + ')+g(' + k + ')'), ans, [[sh.m * 2 * k + sh.b, 'fn-input-sum', 'Find each value separately: ' + t('f(' + k + ')') + ' and ' + t('g(' + k + ')') + ', then add the two outputs.'], [fk, 'fn-const', 'Now add ' + t('g(' + k + ')') + ' too.'], [gk, 'fn-const', 'Now add ' + t('f(' + k + ')') + ' too.'], [fk - gk, 'fn-add-fns', 'The question asks for the <b>sum</b>.']],
            t('f(' + k + ')=' + sh.m + '(' + k + ')' + sg(sh.b) + '=' + fk) + ', ' + t('g(' + k + ')=' + k + '^{2}' + sg(sh.c) + '=' + gk) + '; ' + t('f(' + k + ')+g(' + k + ')=' + fk + sg(gk) + '=' + ans) + '.', ['Evaluate each function at ' + t(k) + ' first, then add the two outputs.'], 'f(k)+g(k)');
        } }] },

    { num: '10', section: 'Part C — Variable and Expression Inputs', stem: function (sh) { return 'If ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + ', determine:'; }, shared: function (r) { return r.chance(0.15) ? { m: 3, b: 5, L: ['a', 'k'] } : { m: r.pick(nz(-6, 7)), b: r.pick(nz(-9, 9)), L: r.sample(['a', 'k', 'b', 'p', 't', 'n'], 2) }; },
      parts: [0, 1].map(function (i) { return { id: '10' + 'ab'.charAt(i), sub: 'ab'.charAt(i), level: 'BEG', make: function (r, sh) {
        var L = sh.L[i], T = PL([[sh.m, L], [sh.b]]);
        return polyPart(t('f(' + L + ')'), t('f(' + L + ')='), T, null, [{ is: PL([[sh.m, 'x'], [sh.b]]), code: 'fn-unchanged', hint: 'Replace every ' + t('x') + ' with ' + t(L) + '.' }, { is: PL([[1, L], [sh.m + sh.b]]), code: 'fn-add-coef', hint: t(term(sh.m, 'x', true)) + ' becomes ' + t(term(sh.m, L, true)) + ' — the ' + t(vt(sh.m)) + ' multiplies.' }],
          'Replace ' + t('x') + ' with ' + t(L) + ': ' + t('f(' + L + ')=' + P.tex(T)) + '.', HE, 'f(letter)', [L]);
      } }; }) },
    { num: '11', parts: [{ id: '11', level: 'PRG', make: function (r) {
      var m = r.chance(0.15) ? 5 : r.pick(pmz(2, 7)), b = r.chance(0.15) ? -2 : r.pick(nz(-9, 9)), h = r.pick([1, 1, 2, 3]), T = PL([[m, 'x'], [m * h + b]]);
      return polyPart('If ' + t('f(x)=' + lin([[m, 'x'], [b, '']])) + ', determine an expression for ' + t('f(x+' + h + ')') + '.', t('f(x+' + h + ')='), T, null, [
        { is: PL([[m, 'x'], [h + b]]), code: 'fn-dist', hint: t(vt(m) + '(x+' + h + ')=' + vt(m) + 'x' + sg(m * h)) + ': multiply <b>both</b> terms in the bracket.' },
        { is: PL([[m, 'x'], [b + h]]), code: 'fn-plus-out', hint: 'That is ' + t('f(x)+' + h) + '. Put the whole input ' + t('(x+' + h + ')') + ' in place of ' + t('x') + '.' }],
        t('f(x+' + h + ')=' + vt(m) + '(x+' + h + ')' + sg(b) + '=' + vt(m) + 'x' + sg(m * h) + sg(b) + '=' + P.tex(T)) + '.', HX, 'f(x+h) linear');
    } }] },
    { num: '12', stem: function (sh) { return 'If ' + t('f(x)=x^{2}' + sg(sh.c)) + ', determine:'; }, shared: function (r) { return r.chance(0.15) ? { c: 6, k: 3 } : { c: r.pick(nz(-9, 9)), k: r.pick([2, 3, 4, 5]) }; },
      parts: [
        { id: '12a', sub: 'a', level: 'BEG', make: function (r, sh) { var T = PL([[1, 'a', 2], [sh.c]]); return polyPart(t('f(a)'), t('f(a)='), T, null, [{ is: PL([[2, 'a'], [sh.c]]), code: 'fn-square-2x', hint: 'Keep the exponent: ' + t('x^{2}') + ' becomes ' + t('a^{2}') + '.' }], t('f(a)=a^{2}' + sg(sh.c)) + '.', HE, 'f(a) quad', ['a']); } },
        { id: '12b', sub: 'b', level: 'PRG', make: function (r, sh) { var k = sh.k, T = PL([[k * k, 'a', 2], [sh.c]]); return polyPart(t('f(' + k + 'a)'), t('f(' + k + 'a)='), T, null, [{ is: PL([[k, 'a', 2], [sh.c]]), code: 'fn-sq-coef', hint: t('(' + k + 'a)^{2}=' + k + 'a\\cdot ' + k + 'a=' + k * k + 'a^{2}') + ': the ' + t(k) + ' is squared too.' }, { is: PL([[2 * k, 'a'], [sh.c]]), code: 'fn-square-2x', hint: 'Squaring is not doubling: ' + t('(' + k + 'a)^{2}=(' + k + 'a)(' + k + 'a)') + '.' }],
          t('f(' + k + 'a)=(' + k + 'a)^{2}' + sg(sh.c) + '=' + k * k + 'a^{2}' + sg(sh.c)) + '.', HX, 'f(ka) quad', ['a']); } }] },
    { num: '13', parts: [{ id: '13', level: 'ADV', make: function (r) {
      var c = r.chance(0.15) ? 1 : r.pick(nz(-6, 9)), h = r.chance(0.15) ? 2 : r.pick([1, 2, 3, 4]), xp = PL([[1, 'x'], [h]]), T = P.add(P.pow(xp, 2), P.num(c));
      return polyPart('If ' + t('f(x)=x^{2}' + sg(c)) + ', determine a simplified expression for ' + t('f(x+' + h + ')') + '.', t('f(x+' + h + ')='), T, null, [
        { is: PL([[1, 'x', 2], [h * h + c]]), code: 'fn-binom-sq', hint: t('(x+' + h + ')^{2}=(x+' + h + ')(x+' + h + ')=x^{2}+' + 2 * h + 'x+' + h * h) + ' — don’t forget the middle term.' },
        { is: PL([[1, 'x', 2], [c + h]]), code: 'fn-plus-out', hint: 'That is ' + t('f(x)+' + h) + '. Put the whole input ' + t('(x+' + h + ')') + ' in place of ' + t('x') + ', then square it.' },
        { is: PL([[1, 'x', 2], [h, 'x'], [h * h + c]]), code: 'fn-binom-sq', hint: 'The middle term of ' + t('(x+' + h + ')^{2}') + ' is ' + t('2\\times ' + h + 'x=' + 2 * h + 'x') + '.' }],
        t('f(x+' + h + ')=(x+' + h + ')^{2}' + sg(c) + '=x^{2}+' + 2 * h + 'x+' + h * h + sg(c) + '=' + P.tex(T)) + '.', ['Replace ' + t('x') + ' with ' + t('(x+' + h + ')') + ': ' + t('f(x+' + h + ')=(x+' + h + ')^{2}' + sg(c)) + '.', 'Expand ' + t('(x+' + h + ')(x+' + h + ')') + ' first — there are three terms.'], 'f(x+h) quad');
    } }] },

    { num: '14', section: 'Part D — Applications', stem: function (sh) { return sh.c.stem(sh.F, sh.R); }, shared: function (r) { var c = r.chance(0.2) ? CTX9[0] : r.pick(CTX9), bk = c === CTX9[0] && r.chance(0.5); return { c: c, F: bk ? 2 : r.pick(c.F), R: bk ? 4 : r.pick(c.R), a: bk ? 3 : r.int(2, 5), b: bk ? 6 : r.int(6, 10) }; },
      parts: [
        { id: '14a', sub: 'a', level: 'BEG', make: function (r, sh) { var n = sh.c.n, val = sh.R * sh.a + sh.F; return numPart('(a) Evaluate ' + t(n + '(' + sh.a + ')') + '.', val, [[sh.R * sh.a, 'fn-fee', 'Include the $' + sh.F + ' ' + sh.c.fee + '.'], [sh.R + sh.a + sh.F, 'fn-add-coef', t(sh.R + sh.c.v) + ' means ' + t(sh.R + '\\times ' + sh.c.v) + '.'], [(sh.a - sh.F) / sh.R, 'fn-solved', 'Substitute ' + t(sh.c.v + '=' + sh.a) + '; don’t solve.']], t(n + '(' + sh.a + ')=' + sh.R + '(' + sh.a + ')+' + sh.F + '=' + val) + '.', HE, 'context eval', { before: '$' }); } },
        { id: '14a2', sub: 'a, meaning', level: 'BEG', make: function (r, sh) { return ctxMeaning(r, sh.c, sh.F, sh.R, sh.a, '(a) What does the value of ' + t(sh.c.n + '(' + sh.a + ')') + ' represent?', 'context meaning a'); } },
        { id: '14b', sub: 'b', level: 'EMG', make: function (r, sh) { return ctxMeaning(r, sh.c, sh.F, sh.R, sh.b, '(b) The statement ' + t(sh.c.n + '(' + sh.b + ')=' + (sh.R * sh.b + sh.F)) + ' is true for this function. What does it mean?', 'context meaning b'); } }] },
    { num: '15', stem: function (sh) { return 'A gym membership costs a $' + sh.F + ' sign-up fee plus $' + sh.R + ' per month. The total cost, in dollars, after ' + t('t') + ' months is ' + t('M(t)=' + sh.R + 't+' + sh.F) + '.'; },
      shared: function (r) { var bk = r.chance(0.15); return { F: bk ? 20 : r.pick([10, 15, 20, 25, 30, 40, 50]), R: bk ? 15 : r.pick([12, 15, 18, 20, 25, 30, 35]), a: bk ? 5 : r.int(2, 8), b: bk ? 10 : r.pick([6, 9, 10, 12, 24]), off: !bk && r.chance(0.3) ? r.pick([5, 10, -5]) : 0 }; },
      parts: [
        { id: '15a', sub: 'a', level: 'EMG', make: function (r, sh) { var c = sh.R * sh.a + sh.F + sh.off; return stmtPart('(a) Translate into function notation: <i>“The total cost after ' + sh.a + ' months is $' + c + '.”</i>', 'M', sh.a, c, 'The input (months) goes in the brackets and the output (dollars) after the equals sign: ' + t('M(' + sh.a + ')=' + c) + '.', null, 'translate sentence'); } },
        { id: '15a2', sub: 'a, check', level: 'EMG', make: function (r, sh) { var c = sh.R * sh.a + sh.F + sh.off, real = sh.R * sh.a + sh.F;
          return B.tf(r, '(a) Check: is the statement ' + t('M(' + sh.a + ')=' + c) + ' correct for this function?', !sh.off, sh.off ? 'Substitute: ' + t('M(' + sh.a + ')=' + sh.R + '(' + sh.a + ')+' + sh.F + '=' + real) + ', not ' + t(c) + '.' : 'Substitute: ' + t(sh.R + '(' + sh.a + ')+' + sh.F + '=' + real) + '. It matches.',
            t('M(' + sh.a + ')=' + sh.R + '(' + sh.a + ')+' + sh.F + '=' + real) + (sh.off ? ' ≠ ' + t(c) + ', so the statement is <b>false</b>.' : ' ✓ — the statement is <b>true</b>.'), ['Substitute the input into the rule and compare with the stated output.'], 'check statement'); } },
        { id: '15b', sub: 'b', level: 'BEG', make: function (r, sh) { var val = sh.R * sh.b + sh.F; return numPart('(b) Evaluate ' + t('M(' + sh.b + ')') + '.', val, [[sh.R * sh.b, 'fn-fee', 'Include the $' + sh.F + ' sign-up fee.'], [(sh.R + sh.F) * sh.b, 'fn-order', 'The sign-up fee is paid once: multiply first, then add.']], t('M(' + sh.b + ')=' + sh.R + '(' + sh.b + ')+' + sh.F + '=' + val) + ': the total cost after ' + sh.b + ' months of membership is $' + val + '.', HE, 'gym eval', { before: '$' }); } }] },
    { num: '16', stem: '<i>(Multiple choice)</i>', parts: [{ id: '16', level: 'BEG', make: function (r) {
      var items = r.pick([['candies', 'C', 'n'], ['pens', 'P', 'n'], ['tickets', 'T', 'n'], ['muffins', 'M', 'm']]), a = r.int(3, 12), c = a * r.pick([2, 3, 4]) - r.int(0, 3); if (r.chance(0.15)) { items = ['candies', 'C', 'n']; a = 6; c = 15; }
      return mc(r, 'A function ' + t(items[1] + '(' + items[2] + ')') + ' gives the cost, in dollars, of buying ' + t(items[2]) + ' ' + items[0] + '. Which statement matches ' + t(items[1] + '(' + a + ')=' + c) + '?', [
        { html: t(a) + ' ' + items[0] + ' cost $' + c + '.', right: true }, { html: t(c) + ' ' + items[0] + ' cost $' + a + '.', why: 'The input (inside the brackets) is the number of ' + items[0] + '.', code: 'flip' },
        { html: 'Each of the ' + items[0] + ' costs $' + a + '.', why: t(a) + ' is how many are bought, not a price.', code: 'rate' }, { html: '$' + c + ' buys ' + t(1) + ' of the ' + items[0] + ', with $' + a + ' left over.', why: 'Read ' + t(items[1] + '(' + a + ')=' + c) + ' as “the cost of ' + a + ' ' + items[0] + ' is $' + c + '”.', code: 'other' }],
        t(items[1] + '(' + a + ')=' + c) + ': the input ' + t(a) + ' is the number of ' + items[0] + ' and the output ' + t(c) + ' is the cost in dollars.', ['Input inside the brackets, output after the equals sign.'], 'MC C(a)=b');
    } }] }
  ];
  function pmz(a, b) { return range(a, b).concat(range(a, b).map(function (x) { return -x; })); }

  /* ================= extra practice ================= */
  function evalQ(num, name, kind, coef, inputs, levels, section, intro) {
    // kind: 'lin' (m, b), 'linr' (b − m x), 'quad' (p, c), 'half' ((x + k)/2)
    var ft = kind === 'lin' ? lin([[coef[0], 'x'], [coef[1], '']]) : kind === 'linr' ? lin([[coef[1], ''], [coef[0], 'x']]) : kind === 'quad' ? lin([[1, 'x^{2}'], [coef[0], 'x'], [coef[1], '']]) : '\\dfrac{x' + sg(coef[0]) + '}{2}';
    return { num: num, section: section, stem: function (sh) { return (intro || '') + 'If ' + t(name + '(x)=' + sh.ft) + ', determine each value.'; }, shared: function (r) { return coef.shared(r); },
      parts: inputs.map(function (inp, i) { return { id: 'e' + num + 'abcd'.charAt(i), sub: 'abcd'.charAt(i), level: levels[i], make: function (r, sh) {
        var a = sh.ins[i];
        if (sh.kind === 'lin' || sh.kind === 'linr') return linEval(name, sh.m, sh.b, a, sh.kind === 'linr', 'EP eval ' + sh.kind);
        if (sh.kind === 'quad') return quadEval(name, sh.p, sh.c, a, 'EP eval quad');
        var d = sh.d, ans = (a + sh.k) / d;
        return valPart(t(name + '(' + vt(a) + ')'), ans, [[a + sh.k / d, 'fn-half-num', 'The fraction bar divides the <b>whole</b> top ' + t('(x' + sg(sh.k) + ')') + ' by ' + t(d) + '.'], [(-a + sh.k) / d, 'fn-neg-sub', 'Check the sign of the input you substituted.'], [a + sh.k, 'fn-const', 'Don’t forget to divide by ' + t(d) + '.']],
          t(name + '(' + vt(a) + ')=\\dfrac{' + ip(a) + sg(sh.k) + '}{' + d + '}=\\dfrac{' + vt(a + sh.k) + '}{' + d + '}=' + vt(ans)) + '.', !Number.isInteger(a) ? HF : HN, 'EP eval half');
      } }; }) };
  }
  var EXTRA = [
    evalQ('1', 'f', 'lin', { shared: function (r) { var bk = r.chance(0.15), m = bk ? 6 : r.pick([2, 4, 6, 8]), b = bk ? -4 : r.pick(nz(-9, 9)); return { kind: 'lin', m: m, b: b, ft: lin([[m, 'x'], [b, '']]), ins: [bk ? -3 : -r.int(2, 5), 0, 0.5, -0.5] }; } }, ['a', 'b', 'c', 'd'], ['EMG', 'BEG', 'PRG', 'PRG'], 'Extra Practice A — Evaluating at Negatives, Zero, and Fractions',
      'Substitute the number exactly as given — brackets around every negative and every fraction. Leave fractional answers as exact fractions. '),
    evalQ('2', 'g', 'linr', { shared: function (r) { var bk = r.chance(0.15), m = bk ? 4 : r.pick([4, 8, 12]), b = bk ? 8 : r.int(3, 12); return { kind: 'linr', m: -m, b: b, ft: lin([[b, ''], [-m, 'x']]), ins: [bk ? -2 : -r.int(1, 4), 0, r.pick([0.75, 0.25, 0.5]), r.pick([-0.25, -0.75, -0.5])] }; } }, ['a', 'b', 'c', 'd'], ['EMG', 'BEG', 'PRG', 'PRG']),
    evalQ('3', 'h', 'quad', { shared: function (r) { var bk = r.chance(0.15), p = bk ? -2 : r.pick([-2, -3, -4, -5, -6, 2, 3, 4, 5, 6]), c = bk ? 0 : r.pick([0, 0, 1, -1, 2, -2, 3, -3]); return { kind: 'quad', p: p, c: c, ft: lin([[1, 'x^{2}'], [p, 'x'], [c, '']]), ins: [bk ? -3 : -r.int(1, 4), 0, 0.5, -0.5] }; } }, ['a', 'b', 'c', 'd'], ['EMG', 'BEG', 'PRG', 'PRG']),
    evalQ('4', 'p', 'half', { shared: function (r) { var bk = r.chance(0.15), k = bk ? 7 : r.pick([3, 5, 7, 9, 11, 1, -3, -5]), d = bk ? 2 : r.pick([2, 2, 4]); return { kind: 'half', k: k, d: d, ft: '\\dfrac{x' + sg(k) + '}{' + d + '}', ins: [bk ? -3 : r.pick([-1, -3, -5, -7].filter(function (x) { return x !== -k; })), 0, 0.5, -k] }; } }, ['a', 'b', 'c', 'd'], ['EMG', 'EMG', 'PRG', 'EMG']),

    { num: '5', section: 'Extra Practice B — Running the Machine Backwards', stem: function (sh) { return 'Let ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + '. Solve each equation for ' + t('x') + ' (check by evaluating).'; },
      shared: function (r) { var bk = r.chance(0.15), m = bk ? 3 : r.pick([2, 3, 4, 5]), b = bk ? -7 : r.pick(nz(-9, 9)); var xs = bk ? [5, 2, null, -2] : [r.int(3, 7), r.int(1, 2), null, -r.int(1, 4)]; if (Number.isInteger(-b / m)) b += b > 0 ? -1 : 1; if (b === 0) b = 1; return { m: m, b: b, ks: xs.map(function (x) { return x == null ? 0 : m * x + b; }) }; },
      parts: [0, 1, 2, 3].map(function (i) { return { id: 'e5' + 'abcd'.charAt(i), sub: 'abcd'.charAt(i), level: i === 2 ? 'ADV' : i === 3 ? 'PRG' : 'EMG', make: function (r, sh) { return linSolve('f', sh.m, sh.b, sh.ks[i], false, 'solve f(x)=k'); } }; }) },
    { num: '6', stem: function (sh) { return 'Let ' + t('g(x)=' + lin([[sh.b, ''], [-sh.m, 'x']])) + '. Solve each equation for ' + t('x') + '.'; },
      shared: function (r) { var bk = r.chance(0.15), m = bk ? 5 : r.pick([2, 3, 5, 4]), b = bk ? 12 : r.int(7, 15); if (Number.isInteger(b / m)) b++; return { m: m, b: b, ks: [b - m * (bk ? 2 : r.int(1, 2)), b + m * (bk ? 3 : r.int(2, 4)), 0, b] }; },
      parts: [0, 1, 2, 3].map(function (i) { return { id: 'e6' + 'abcd'.charAt(i), sub: 'abcd'.charAt(i), level: ['EMG', 'PRG', 'PRG', 'EMG'][i], make: function (r, sh) { var p = linSolve('g', -sh.m, sh.b, sh.ks[i], true, 'solve g(x)=k'); if (i === 3) p.solution += '<br>The output ' + t(sh.b) + ' comes from the input ' + t('0') + ': the graph crosses the vertical axis at ' + t('(0,\\ ' + sh.b + ')') + '.'; return p; } }; }) },
    { num: '7', stem: function (sh) { return 'Let ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + '. The number ' + t(sh.k) + ' appears in both parts, but in different roles.'; },
      shared: function (r) { if (r.chance(0.15)) return { m: 4, b: 9, k: -2 }; return pickWhere(function () { return { m: r.pick([3, 4, 5, 2]), b: r.pick(nz(-9, 9)), k: r.pick(nz(-6, 6)) }; }, function (o) { return !Number.isInteger((o.k - o.b) / o.m) && o.m * o.k + o.b !== o.k; }); },
      parts: [
        { id: 'e7a', sub: 'a', level: 'EMG', make: function (r, sh) { return linEval('f', sh.m, sh.b, sh.k, false, 'f(k) roles'); } },
        { id: 'e7b', sub: 'b', level: 'PRG', make: function (r, sh) { var p = linSolve('f', sh.m, sh.b, sh.k, false, 'solve f(x)=k roles'); p.prompt = 'Solve ' + p.prompt + '.'; return p; } },
        { id: 'e7c', sub: 'c', level: 'EMG', make: function (r, sh) { return mc(r, '(c) What job does the ' + t(sh.k) + ' do in each part?', [{ html: 'In (a) it is the <b>input</b> (substituted for ' + t('x') + '); in (b) it is the <b>output</b> (the answer the machine gave), so the input must be solved for.', right: true },
          { html: 'It is the input in both parts.', why: 'In ' + t('f(x)=' + sh.k) + ' the ' + t(sh.k) + ' is what ' + t('f') + ' gives out.', code: 'both-in' }, { html: 'In (a) it is the output; in (b) it is the input.', why: 'The other way round: inside the brackets is the input.', code: 'rev' }, { html: 'It is the same job; that’s why the answers match.', why: 'The answers are different numbers — the jobs differ.', code: 'same' }],
          'In ' + t('f(' + sh.k + ')') + ' the ' + t(sh.k) + ' is the input. In ' + t('f(x)=' + sh.k) + ' it is the output, and the unknown input must be solved for.', HS, 'input vs output roles'); } }] },
    { num: '8', stem: function (sh) { return '<b>Stretch.</b> Let ' + t('h(x)=x^{2}' + sg(-sh.c)) + '. An output can come from two inputs, one, or none. Solve each.'; },
      shared: function (r) { var c = r.chance(0.15) ? 9 : r.pick([1, 4, 9, 16, 25, 36, 49, 64, 81, 100]); var q = pickWhere(function () { return r.pick([1, 2, 3, 4, 5, 6, 7]); }, function (v) { return v * v !== c; }); return { c: c, q: q, n: r.int(2, 9) }; },
      parts: [
        { id: 'e8a', sub: 'a', level: 'PRG', make: function (r, sh) { var s = Math.sqrt(sh.c); return solPart(t('h(x)=0'), [s, -s], 'x', [[[s], 'fn-one-root', 'There is another input: ' + t('(-' + s + ')^{2}=' + sh.c) + ' too.'], [[sh.c], 'fn-sqrt-not', 'From ' + t('x^{2}=' + sh.c) + ', take the square root.']], t('x^{2}-' + sh.c + '=0') + ' → ' + t('x^{2}=' + sh.c) + ' → ' + t('x=\\pm ' + s) + ': two inputs.', HS, 'h(x)=0 two roots'); } },
        { id: 'e8b', sub: 'b', level: 'PRG', make: function (r, sh) { var k = sh.q * sh.q - sh.c; return solPart(t('h(x)=' + k), [sh.q, -sh.q], 'x', [[[sh.q], 'fn-one-root', 'There is another input: ' + t('(-' + sh.q + ')^{2}=' + sh.q * sh.q) + ' too.'], [[sh.q * sh.q], 'fn-sqrt-not', 'Take the square root of ' + t(sh.q * sh.q) + '.'], [[Math.sqrt(Math.abs(k))].filter(isFinite), 'fn-solve-inverse', 'First add ' + t(sh.c) + ' to both sides, then take the square root.']], t('x^{2}-' + sh.c + '=' + k) + ' → ' + t('x^{2}=' + sh.q * sh.q) + ' → ' + t('x=\\pm ' + sh.q) + ': two inputs.', HS, 'h(x)=k two roots'); } },
        { id: 'e8c', sub: 'c', level: 'PRG', make: function (r, sh) { return solPart(t('h(x)=' + (-sh.c)), [0], 'x', [[[sh.c], 'fn-solve-inverse', 'Add ' + t(sh.c) + ' to both sides: ' + t('x^{2}=0') + '.']], t('x^{2}-' + sh.c + '=-' + sh.c) + ' → ' + t('x^{2}=0') + ' → ' + t('x=0') + ': one input.', HS, 'h(x)=-c one root'); } },
        { id: 'e8d', sub: 'd', level: 'PRG', make: function (r, sh) { var k = -sh.c - sh.n * sh.n; return mc(r, '(d) Solve ' + t('h(x)=' + k) + '. How many inputs work?', [{ html: 'None — it gives ' + t('x^{2}=-' + sh.n * sh.n) + ', and a square is never negative.', right: true },
          { html: 'Two: ' + t('x=\\pm ' + sh.n) + '.', why: 'Check: ' + t(sh.n + '^{2}-' + sh.c + '=' + (sh.n * sh.n - sh.c)) + ', not ' + t(k) + '.', code: 'two' }, { html: 'One: ' + t('x=-' + sh.n) + '.', why: t('(-' + sh.n + ')^{2}=+' + sh.n * sh.n) + ', so ' + t('h(-' + sh.n + ')=' + (sh.n * sh.n - sh.c)) + '.', code: 'one' }, { html: 'One: ' + t('x=0') + '.', why: t('h(0)=-' + sh.c) + ', not ' + t(k) + '.', code: 'zero' }],
          t('x^{2}-' + sh.c + '=' + k) + ' → ' + t('x^{2}=-' + sh.n * sh.n) + ', impossible: a square is never negative. <b>No input works.</b>', ['Add ' + t(sh.c) + ' to both sides. Can ' + t('x^{2}') + ' be negative?'], 'no root'); } }] },

    { num: '9', section: 'Extra Practice C — Expressions, Variable Inputs, and Two Functions at Once', stem: function (sh) { return 'Let ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + '. Find each function value first, then combine.'; },
      shared: function (r) { return r.chance(0.15) ? { m: 2, b: 3, a: 2, c: 3, k: 2, u: 1 } : { m: r.int(2, 5), b: r.pick(nz(-6, 9)), a: r.int(1, 4), c: r.int(2, 5), k: r.pick([2, 3]), u: r.int(1, 4) }; },
      parts: [
        { id: 'e9a', sub: 'a', level: 'EMG', make: function (r, sh) { var f = function (x) { return sh.m * x + sh.b; }, ans = f(sh.a) + f(sh.c); return numPart(t('f(' + sh.a + ')+f(' + sh.c + ')'), ans, [[f(sh.a + sh.c), 'fn-input-sum', 'Find ' + t('f(' + sh.a + ')') + ' and ' + t('f(' + sh.c + ')') + ' separately, then add the outputs.']], t('f(' + sh.a + ')=' + f(sh.a)) + ', ' + t('f(' + sh.c + ')=' + f(sh.c)) + '; sum ' + t('=' + ans) + '.', HE, 'f(a)+f(c)'); } },
        { id: 'e9b', sub: 'b', level: 'EMG', make: function (r, sh) { var f = function (x) { return sh.m * x + sh.b; }, ans = sh.k * f(sh.u); return numPart(t(sh.k + 'f(' + sh.u + ')'), ans, [[f(sh.k * sh.u), 'fn-times', t(sh.k + 'f(' + sh.u + ')') + ' means ' + t(sh.k + '\\times f(' + sh.u + ')') + ': find the output first, then multiply.'], [sh.k * sh.m * sh.u + sh.b, 'fn-dist', 'Multiply the <b>whole</b> output ' + t('f(' + sh.u + ')=' + f(sh.u)) + ' by ' + t(sh.k) + '.']], t('f(' + sh.u + ')=' + f(sh.u)) + ', so ' + t(sh.k + 'f(' + sh.u + ')=' + sh.k + '\\times ' + f(sh.u) + '=' + ans) + '.', HE, 'k f(u)'); } },
        { id: 'e9c', sub: 'c', level: 'PRG', make: function (r, sh) { var f = function (x) { return sh.m * x + sh.b; }, s = sh.a + sh.c; return mc(r, '(c) Evaluate ' + t('f(' + s + ')') + '. Is ' + t('f(' + sh.a + ')+f(' + sh.c + ')=f(' + s + ')') + '?', [
          { html: 'No: ' + t('f(' + s + ')=' + f(s)) + ', but ' + t('f(' + sh.a + ')+f(' + sh.c + ')=' + (f(sh.a) + f(sh.c))) + '.', right: true }, { html: 'Yes, because ' + t(sh.a + '+' + sh.c + '=' + s) + '.', why: 'Work them out: ' + t(f(sh.a) + f(sh.c)) + ' and ' + t(f(s)) + ' are different.', code: 'yes' },
          { html: 'Yes: both equal ' + t(f(s)) + '.', why: t('f(' + sh.a + ')+f(' + sh.c + ')=' + f(sh.a) + '+' + f(sh.c) + '=' + (f(sh.a) + f(sh.c))) + '.', code: 'yes2' }, { html: 'No: ' + t('f(' + s + ')=' + (f(s) + 1)) + '.', why: 'Recompute ' + t('f(' + s + ')=' + sh.m + '(' + s + ')' + sg(sh.b)) + '.', code: 'calc' }],
          t('f(' + s + ')=' + sh.m + '(' + s + ')' + sg(sh.b) + '=' + f(s)) + ' but ' + t('f(' + sh.a + ')+f(' + sh.c + ')=' + (f(sh.a) + f(sh.c))) + ' (the constant ' + t(sh.b) + ' is counted twice). <b>No.</b>', HE, 'f(a)+f(c) vs f(a+c)'); } }] },
    { num: '10', stem: function (sh) { return 'Let ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + '. Determine each expression, simplified.'; }, shared: function (r) { return r.chance(0.15) ? { m: 5, b: -1, h: 2 } : { m: r.int(2, 7), b: r.pick(nz(-9, 9)), h: r.pick([2, 3, 4]) }; },
      parts: [
        { id: 'e10a', sub: 'a', level: 'BEG', make: function (r, sh) { var T = PL([[sh.m, 'a'], [sh.b]]); return polyPart(t('f(a)'), t('f(a)='), T, null, [{ is: PL([[sh.m, 'x'], [sh.b]]), code: 'fn-unchanged', hint: 'Replace every ' + t('x') + ' with ' + t('a') + '.' }], t('f(a)=' + P.tex(T)) + '.', HE, 'f(a) lin', ['a']); } },
        { id: 'e10b', sub: 'b', level: 'PRG', make: function (r, sh) { var T = PL([[sh.m, 'a'], [sh.m * sh.h + sh.b]]); return polyPart(t('f(a+' + sh.h + ')'), t('f(a+' + sh.h + ')='), T, null, [{ is: PL([[sh.m, 'a'], [sh.h + sh.b]]), code: 'fn-dist', hint: t(sh.m + '(a+' + sh.h + ')=' + sh.m + 'a+' + sh.m * sh.h) + ': multiply both terms.' }], t('f(a+' + sh.h + ')=' + sh.m + '(a+' + sh.h + ')' + sg(sh.b) + '=' + sh.m + 'a+' + sh.m * sh.h + sg(sh.b) + '=' + P.tex(T)) + '.', HX, 'f(a+h) lin', ['a']); } },
        { id: 'e10c', sub: 'c', level: 'PRG', make: function (r, sh) { var T = PL([[sh.m, 'x'], [sh.m + sh.b]]); return polyPart(t('f(x+1)'), t('f(x+1)='), T, null, [{ is: PL([[sh.m, 'x'], [1 + sh.b]]), code: 'fn-dist', hint: t(sh.m + '(x+1)=' + sh.m + 'x+' + sh.m) + ': multiply both terms.' }], t('f(x+1)=' + sh.m + '(x+1)' + sg(sh.b) + '=' + P.tex(T)) + '.', HX, 'f(x+1) lin'); } }] },
    { num: '11', stem: function (sh) { return 'Let ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + ' and ' + t('g(x)=x^{2}' + sg(sh.c)) + '. Evaluate each, showing the two function values first.'; },
      shared: function (r) { return r.chance(0.15) ? { m: 3, b: 4, c: -1, a: 2, n: -3 } : { m: r.int(2, 5), b: r.pick(nz(-6, 8)), c: r.pick(nz(-5, 5)), a: r.int(1, 4), n: -r.int(2, 4) }; },
      parts: [
        { id: 'e11a', sub: 'a', level: 'EMG', make: function (r, sh) { var F0 = sh.m * sh.a + sh.b, G0 = sh.a * sh.a + sh.c; return numPart(t('f(' + sh.a + ')-g(' + sh.a + ')'), F0 - G0, [[G0 - F0, 'fn-reverse', 'Subtract in the order given: ' + t('f(' + sh.a + ')-g(' + sh.a + ')') + '.'], [F0 + G0, 'fn-add-fns', 'Subtract, don’t add.']], t('f(' + sh.a + ')=' + F0) + ', ' + t('g(' + sh.a + ')=' + G0) + '; ' + t(F0 + '-' + sgp(G0) + '=' + (F0 - G0)) + '.', HE, 'f-g'); } },
        { id: 'e11b', sub: 'b', level: 'PRG', make: function (r, sh) { var a = sh.n, F0 = sh.m * a + sh.b, G0 = a * a + sh.c; return numPart(t('g(' + a + ')-f(' + a + ')'), G0 - F0, [[G0 + F0, 'fn-dist-sign', 'Subtracting a negative: ' + t(G0 + '-' + sgp(F0) + '=' + G0 + '+' + (-F0)) + '.'], [-a * a + sh.c - F0, 'fn-neg-square', t('(' + a + ')^{2}=' + a * a) + '.'], [F0 - G0, 'fn-reverse', 'Subtract in the order given.']], t('g(' + a + ')=' + G0) + ', ' + t('f(' + a + ')=' + F0) + '; ' + t(G0 + '-' + sgp(F0) + '=' + (G0 - F0)) + '.', HN, 'g-f neg'); } },
        { id: 'e11c', sub: 'c', level: 'EMG', make: function (r, sh) { return numPart(t('f(0)+g(0)'), sh.b + sh.c, [[0, 'fn-zero-all', 'At ' + t('x=0') + ' the constants remain: ' + t('f(0)=' + sh.b) + ', ' + t('g(0)=' + sh.c) + '.'], [sh.m + sh.b + sh.c + 1, 'fn-zero-coef', t(sh.m + '\\times 0=0') + '.']], t('f(0)=' + sh.b) + ', ' + t('g(0)=' + sh.c) + '; sum ' + t('=' + (sh.b + sh.c)) + '.', HE, 'f(0)+g(0)'); } }] },
    { num: '12', stem: function (sh) { return 'Let ' + t('f(x)=' + lin([[sh.m1, 'x'], [sh.b1, '']])) + ' and ' + t('g(x)=' + lin([[sh.m2, 'x'], [sh.b2, '']])) + '. The equation ' + t('f(x)=g(x)') + ' asks: is there an input that both machines send to the same output?'; },
      shared: function (r) { if (r.chance(0.15)) return { m1: 2, b1: 1, m2: 5, b2: -8, h: 3, k0: 2 }; return pickWhere(function () { var m1 = r.int(1, 3), m2 = m1 + r.int(2, 4), h = r.int(1, 5), b1 = r.int(-4, 6); return { m1: m1, m2: m2, b1: b1, b2: b1 + (m1 - m2) * h, h: h, k0: r.pick([0, 1, 2].filter(function (z) { return z !== h; })) }; }, function (o) { return o.b2 !== 0 && Math.abs(o.b2) <= 20; }); },
      parts: [
        { id: 'e12a', sub: 'a', level: 'BEG', make: function (r, sh) { var k = sh.k0, F0 = sh.m1 * k + sh.b1, G0 = sh.m2 * k + sh.b2;
          var p = B.fields('(a) Evaluate ' + t('f(' + k + ')') + ' and ' + t('g(' + k + ')') + ' to show they are different.', [{ label: t('f(' + k + ')='), name: 'f(' + k + ')' }, { label: t('g(' + k + ')='), name: 'g(' + k + ')' }], [K.number(F0, function (v) { return same(v, G0) ? { code: 'fn-sign', hint: 'That is ' + t('g(' + k + ')') + '.' } : null; }), K.number(G0, function (v) { return same(v, F0) ? { code: 'fn-sign', hint: 'That is ' + t('f(' + k + ')') + '.' } : null; })], [String(F0), String(G0)],
            t('f(' + k + ')=' + F0) + ', ' + t('g(' + k + ')=' + G0), t('f(' + k + ')=' + F0) + ' and ' + t('g(' + k + ')=' + G0) + ' — different, so ' + t(k) + ' is not the input they share.', HE, 'f(k), g(k)');
          p.bad = [[String(G0), String(F0)]]; return p; } },
        { id: 'e12b', sub: 'b', level: 'ADV', make: function (r, sh) { return solPart('(b) Solve ' + t('f(x)=g(x)') + '.', [sh.h], 'x', [[[-sh.h], 'fn-solve-sign', 'Check the signs when you move terms across.']], t(lin([[sh.m1, 'x'], [sh.b1, '']]) + '=' + lin([[sh.m2, 'x'], [sh.b2, '']])) + ' → ' + t(vt(sh.b1 - sh.b2) + '=' + vt(sh.m2 - sh.m1) + 'x') + ' → ' + t('x=' + sh.h) + '.', ['Set the two rules equal, then collect the ' + t('x') + '-terms on one side.'], 'f(x)=g(x)'); } },
        { id: 'e12c', sub: 'c', level: 'EMG', make: function (r, sh) { var k = sh.m1 * sh.h + sh.b1; return numPart('(c) Substitute ' + t('x=' + sh.h) + ' into both rules. What output do they share?', k, [[sh.h, 'fn-eq-flip', 'That is the input. Substitute it to get the output.']], t('f(' + sh.h + ')=' + k) + ' and ' + t('g(' + sh.h + ')=' + (sh.m2 * sh.h + sh.b2)) + ' — both ' + t(k) + '.', HE, 'shared output'); } },
        { id: 'e12d', sub: 'd', level: 'PRG', make: function (r, sh) { var k = sh.m1 * sh.h + sh.b1; return mc(r, '(d) If the graphs of ' + t('f') + ' and ' + t('g') + ' were drawn on one grid, what would (b) and (c) tell you?', [{ html: 'The two lines cross at the single point ' + t('(' + sh.h + ',\\ ' + k + ')') + '.', right: true },
          { html: 'The lines are parallel.', why: 'Parallel lines never share an output. These share one at ' + t('x=' + sh.h) + '.', code: 'par' }, { html: 'The lines cross at ' + t('(' + k + ',\\ ' + sh.h + ')') + '.', why: 'Input first: ' + t('(x,\\ y)') + '.', code: 'flip' }, { html: 'Both lines pass through the origin.', why: 'That would need both constants to be ' + t('0') + '.', code: 'origin' }],
          'Same input, same output: the point ' + t('(' + sh.h + ',\\ ' + k + ')') + ' is on both lines — that is where they cross.', HE, 'crossing point'); } }] },

    { num: '13', section: 'Extra Practice D — Interpreting, Error Analysis, and Working Backwards', stem: function (sh) { return '<b>Error analysis.</b> Dmitri believes ' + t('f(x)') + ' means “' + t('f') + ' times ' + t('x') + '”. Given ' + t('f(x)=' + lin([[sh.m, 'x'], [sh.b, '']])) + ', he writes ' + t('f(' + sh.a + ')=f\\times ' + sh.a + '=(' + lin([[sh.m, 'x'], [sh.b, '']]) + ')(' + sh.a + ')=' + lin([[sh.m * sh.a, 'x'], [sh.b * sh.a, '']])) + '.'; },
      shared: function (r) { return r.chance(0.15) ? { m: 2, b: 6, a: 3, c: 2 } : { m: r.int(2, 5), b: r.int(2, 9), a: r.int(2, 5), c: r.int(1, 4) }; },
      parts: [
        { id: 'e13a', sub: 'a', level: 'EMG', make: function (r, sh) { var v = sh.m * sh.a + sh.b; return mc(r, '(a) What do the brackets in ' + t('f(' + sh.a + ')') + ' actually mean, and what is ' + t('f(' + sh.a + ')') + '?', [
          { html: 'They hold the input: substitute ' + t(sh.a) + ' for ' + t('x') + ', so ' + t('f(' + sh.a + ')=' + v) + '.', right: true }, { html: 'They mean multiply, so ' + t('f(' + sh.a + ')=' + lin([[sh.m * sh.a, 'x'], [sh.b * sh.a, '']])) + '.', why: t('f') + ' is the name of the function, not a number to multiply.', code: 'times' },
          { html: 'They hold the input, so ' + t('f(' + sh.a + ')=' + (sh.m + sh.a + sh.b)) + '.', why: t(sh.m + 'x') + ' means ' + t(sh.m + '\\times x') + '.', code: 'add' }, { html: 'They hold the output, so ' + t('f(x)=' + sh.a) + '.', why: 'Inside the brackets is the input.', code: 'out' }],
          'The brackets hold an <b>input</b>, not a multiplication: ' + t('f(' + sh.a + ')=' + sh.m + '(' + sh.a + ')+' + sh.b + '=' + v) + '.', HE, 'Dmitri brackets'); } },
        { id: 'e13b', sub: 'b', level: 'PRG', make: function (r, sh) { var f = function (x) { return sh.m * x + sh.b; }, s = sh.a + sh.c;
          var p = B.fields('(b) Dmitri argues that ' + t('f(' + sh.c + ')+f(' + sh.a + ')') + ' must equal ' + t('f(' + s + ')') + ' “because ' + t(sh.c + '+' + sh.a + '=' + s) + '”. Evaluate both sides.', [{ label: t('f(' + sh.c + ')+f(' + sh.a + ')='), name: 'sum' }, { label: t('f(' + s + ')='), name: 'f(' + s + ')' }],
            [K.number(f(sh.c) + f(sh.a), function (v) { return same(v, f(s)) ? { code: 'fn-input-sum', hint: 'Evaluate each value separately, then add.' } : null; }), K.number(f(s))], [String(f(sh.c) + f(sh.a)), String(f(s))], t(f(sh.c) + f(sh.a)) + ' and ' + t(f(s)),
            t('f(' + sh.c + ')=' + f(sh.c)) + ', ' + t('f(' + sh.a + ')=' + f(sh.a)) + ', sum ' + t(f(sh.c) + f(sh.a)) + '; but ' + t('f(' + s + ')=' + f(s)) + '. They differ, so the claim is false (the constant ' + t(sh.b) + ' is counted twice in the sum).', HE, 'Dmitri sum');
          p.bad = [[String(f(s)), String(f(s))]]; return p; } }] },
    { num: '14', stem: function (sh) { return '<b>Working backwards to the rule.</b> A linear function ' + t('f(x)=mx+b') + ' has ' + t('f(0)=' + sh.b) + ' and ' + t('f(' + sh.p + ')=' + (sh.m * sh.p + sh.b)) + '.'; },
      shared: function (r) { return r.chance(0.15) ? { m: 3, b: 4, p: 3, q: -2, k: 7 } : { m: r.pick([2, 3, 4, 5, -2, -3]), b: r.pick(nz(-6, 9)), p: r.int(2, 5), q: -r.int(1, 4), k: r.int(4, 9) }; },
      parts: [
        { id: 'e14a', sub: 'a', level: 'EMG', make: function (r, sh) { return mc(r, '(a) Why does ' + t('f(0)=' + sh.b) + ' immediately give the value of ' + t('b') + '?', [{ html: t('f(0)=m(0)+b=b') + ', so ' + t('b=' + sh.b) + '.', right: true }, { html: 'Because ' + t('b') + ' is always the first value in a table.', why: 'Substitute ' + t('x=0') + ' into ' + t('mx+b') + ' and see what is left.', code: 'table' }, { html: 'Because ' + t('m=0') + '.', why: t('m') + ' isn’t ' + t('0') + '; the ' + t('x') + ' is.', code: 'm0' }, { html: 'It gives ' + t('m') + ', not ' + t('b') + '.', why: 'At ' + t('x=0') + ' the ' + t('mx') + ' term vanishes.', code: 'm' }],
          'Substituting ' + t('x=0') + ': ' + t('f(0)=m(0)+b=b') + ', so ' + t('b=' + sh.b) + '.', ['What is left of ' + t('mx+b') + ' when ' + t('x=0') + '?'], 'b from f(0)'); } },
        { id: 'e14b', sub: 'b', level: 'ADV', make: function (r, sh) { var T = PL([[sh.m, 'x'], [sh.b]]), v = sh.m * sh.p + sh.b; return polyPart('(b) Use ' + t('f(' + sh.p + ')=' + v) + ' and your value of ' + t('b') + ' to find ' + t('m') + '. Write the complete rule.', t('f(x)='), T, null, [
          { is: PL([[(v + sh.b) / sh.p, 'x'], [sh.b]]), code: 'fn-solve-inverse', hint: 'From ' + t(sh.p + 'm' + sg(sh.b) + '=' + v) + ', undo the ' + t(sg(sh.b)) + ' first.' }, { is: PL([[v - sh.b, 'x'], [sh.b]]), code: 'fn-solve-divide', hint: t(sh.p + 'm=' + (v - sh.b)) + ' — now divide by ' + t(sh.p) + '.' }, { is: PL([[v / sh.p, 'x'], [sh.b]]), code: 'u5l9-b', hint: 'Use ' + t('f(' + sh.p + ')=' + sh.p + 'm' + sg(sh.b)) + ' — include the ' + t('b') + '.' }].filter(function (w) { return P.terms(w.is).every(function (tm) { return tm.c[1] === 1; }); }),
          t(sh.p + 'm' + sg(sh.b) + '=' + v) + ' → ' + t(sh.p + 'm=' + (v - sh.b)) + ' → ' + t('m=' + sh.m) + '. So ' + t('f(x)=' + P.tex(T)) + '.', ['Substitute ' + t('x=' + sh.p) + ' into ' + t('mx+' + sgp(sh.b)) + ' and set it equal to ' + t(v) + '.'], 'rule from f(0) and f(p)'); } },
        { id: 'e14c', sub: 'c', level: 'EMG', make: function (r, sh) { return linEval('f', sh.m, sh.b, sh.q, false, 'eval found rule'); } },
        { id: 'e14d', sub: 'd', level: 'PRG', make: function (r, sh) { return linSolve('f', sh.m, sh.b, sh.m * sh.k + sh.b, false, 'solve found rule'); } }] },
    { num: '15', stem: function (sh) { return 'A linear function ' + t('g') + ' satisfies ' + t('g(' + sh.x1 + ')=' + (sh.m * sh.x1 + sh.b)) + ' and ' + t('g(' + sh.x2 + ')=' + (sh.m * sh.x2 + sh.b)) + '. Neither input is ' + t('0') + ', so find ' + t('m') + ' first.'; },
      shared: function (r) { if (r.chance(0.15)) return { m: -3, b: 6, x1: -1, x2: 3, z: 2, e: 5 }; return pickWhere(function () { var m = r.pick([-3, -2, 2, 3, 4, -4]), z = r.int(-3, 4), x1 = -r.int(1, 3), x2 = r.int(1, 4); return { m: m, b: -m * z, x1: x1, x2: x2, z: z, e: r.int(4, 6) }; }, function (o) { return o.b !== 0 && o.z !== 0; }); },
      parts: [
        { id: 'e15a', sub: 'a', level: 'ADV', make: function (r, sh) { var dy = sh.m * (sh.x2 - sh.x1), dx = sh.x2 - sh.x1; return numPart('(a) Find ' + t('m') + ' by comparing how much the output changed with how much the input changed.', sh.m, [[dx / dy, 'u5l9-m-flip', 'Output change ÷ input change: ' + t('\\frac{' + dy + '}{' + dx + '}') + '.'], [-sh.m, 'u5l9-m-sign', 'Check the sign: did the output go up or down as the input went up?'], [dy, 'fn-solve-divide', 'Divide the output change by the input change (' + t(dx) + ').']],
          'Input: ' + t(sh.x1 + '\\to ' + sh.x2) + ' (change ' + t(dx) + '). Output: ' + t((sh.m * sh.x1 + sh.b) + '\\to ' + (sh.m * sh.x2 + sh.b)) + ' (change ' + t(dy) + '). ' + t('m=\\frac{' + dy + '}{' + dx + '}=' + sh.m) + '.', ['Find how much the output changes and divide by how much the input changes.'], 'm from two values', { before: t('m=') }); } },
        { id: 'e15b', sub: 'b', level: 'MAS', make: function (r, sh) { var T = PL([[sh.m, 'x'], [sh.b]]), y1 = sh.m * sh.x1 + sh.b; return polyPart('(b) Substitute one known pair into ' + t('g(x)=mx+b') + ' to find ' + t('b') + ', then write the rule.', t('g(x)='), T, null, [
          { is: PL([[sh.m, 'x'], [y1]]), code: 'u5l9-b', hint: t('b') + ' is the output at ' + t('x=0') + ', not at ' + t('x=' + sh.x1) + '. Solve ' + t(y1 + '=' + sh.m + '(' + sh.x1 + ')+b') + '.' }, { is: PL([[sh.m, 'x'], [y1 + sh.m * sh.x1]]), code: 'fn-neg-sub', hint: 'Check the sign of ' + t(sh.m + '\\times ' + sgp(sh.x1)) + '.' }, { is: PL([[-sh.m, 'x'], [sh.b]]), code: 'u5l9-m-sign', hint: 'Use the ' + t('m') + ' from part (a), sign included.' }],
          t(y1 + '=' + sh.m + sgp(sh.x1) + '+b') + ' → ' + t(y1 + '=' + (sh.m * sh.x1) + '+b') + ' → ' + t('b=' + sh.b) + '. So ' + t('g(x)=' + P.tex(T)) + '.', ['Substitute ' + t('x=' + sh.x1) + ' and ' + t('g=' + y1) + ' into ' + t('g(x)=' + sh.m + 'x+b') + ' and solve for ' + t('b') + '.'], 'rule from two values'); } },
        { id: 'e15c', sub: 'c', level: 'PRG', make: function (r, sh) { return linSolve('g', sh.m, sh.b, 0, false, 'g(x)=0'); } },
        { id: 'e15d', sub: 'c, value', level: 'EMG', make: function (r, sh) { return linEval('g', sh.m, sh.b, sh.e, false, 'g(e)'); } }] },
    { num: '16', stem: function (sh) { return '<b>From a table.</b> The table shows values of a linear function ' + t('f') + '. Three entries are missing.' + HW.valueTable([[t('x')].concat(sh.xs.map(function (x) { return t(x); })), [t('f(x)')].concat(sh.xs.map(function (x, i) { return sh.miss.indexOf(i) >= 0 ? '?' : t(sh.m * x + sh.b); }))]); },
      shared: function (r) { if (r.chance(0.15)) return { m: 3, b: -2, xs: [-2, -1, 0, 1, 2, 3, 4], miss: [1, 4, 6] }; return { m: r.pick([2, 3, 4, -2, -3, 5]), b: r.pick(nz(-6, 6)), xs: [-2, -1, 0, 1, 2, 3, 4], miss: r.pick([[1, 4, 6], [1, 3, 6], [0, 4, 6], [1, 5, 6]]) }; },
      parts: [
        { id: 'e16a', sub: 'a', level: 'EMG', make: function (r, sh) { var f = function (x) { return sh.m * x + sh.b; }, mx = sh.miss.map(function (i) { return sh.xs[i]; });
          var p = B.fields('(a) The outputs change by the same amount each time the input goes up by ' + t('1') + '. Complete the table.', mx.map(function (x) { return { label: t('f(' + x + ')='), name: 'f(' + x + ')' }; }), mx.map(function (x) { return K.number(f(x), function (v) { return same(v, f(x) - 2 * sh.m) || same(v, f(x) + 2 * sh.m) ? { code: 'u5l9-table', hint: 'Step one input at a time: each step adds ' + t(sh.m) + '.' } : { code: 'u5l9-table', hint: 'Find the constant change between neighbouring outputs first.' }; }); }), mx.map(function (x) { return String(f(x)); }),
            mx.map(function (x) { return t('f(' + x + ')=' + f(x)); }).join(', '), 'The outputs go up by ' + t(sh.m) + ' each step: ' + sh.xs.map(function (x) { return t(f(x)); }).join(', ') + '.', ['Find the change between two neighbouring known outputs.'], 'table missing');
          p.bad = [mx.map(function (x) { return String(f(x) + 1); })]; return p; } },
        { id: 'e16b', sub: 'b', level: 'BEG', make: function (r, sh) { return numPart('(b) State the value of ' + t('f(4)') + '.', 4 * sh.m + sh.b, [[4, 'fn-eq-flip', t('f(4)') + ' is the output in the column under ' + t('x=4') + '.']], t('f(4)=' + (4 * sh.m + sh.b)) + ' (the entry under ' + t('x=4') + ').', HE, 'read f(4)'); } },
        { id: 'e16c', sub: 'c', level: 'EMG', make: function (r, sh) { var k = 3 * sh.m + sh.b; return solPart('(c) Solve ' + t('f(x)=' + k) + '.', [3], 'x', [[[k], 'fn-eq-flip', 'Find ' + t(k) + ' among the <b>outputs</b>, and read the input above it.'], [[sh.m * k + sh.b], 'fn-evaluated', 'Here ' + t(k) + ' is the output, not the input.']], 'The output ' + t(k) + ' is under the input ' + t('3') + ': ' + t('x=3') + '.', HS, 'solve from table'); } },
        { id: 'e16d', sub: 'd', level: 'ADV', make: function (r, sh) { var T = PL([[sh.m, 'x'], [sh.b]]); return polyPart('(d) Write the rule for ' + t('f') + ' in the form ' + t('f(x)=mx+b') + '.', t('f(x)='), T, null, [{ is: PL([[sh.b, 'x'], [sh.m]]), code: 'u5l9-b', hint: t('b') + ' is the output at ' + t('x=0') + '; ' + t('m') + ' is the change per step.' }],
          t('m') + ' = the change per step = ' + t(sh.m) + '; ' + t('b=f(0)=' + sh.b) + '. So ' + t('f(x)=' + P.tex(T)) + '. Check: ' + t('f(4)=' + sh.m + '(4)' + sg(sh.b) + '=' + (4 * sh.m + sh.b)) + ' ✓', ['m: the change per step. b: the output at ' + t('x=0') + '.'], 'rule from table'); } }] },
    { num: '17', stem: function (sh) { return '<b>Reading the notation in context.</b> At a theatre, ' + t('C(n)') + ' is the total cost, in dollars, of buying ' + t('n') + ' tickets.'; },
      shared: function (r) { return r.chance(0.15) ? { a: 5, c: 42, d: 100, e: 8, f: 63, g: 3 } : { a: r.int(2, 6), c: r.int(30, 60), d: r.pick([100, 120, 150, 200]), e: r.int(7, 10), f: r.int(55, 90), g: r.int(2, 4) }; },
      parts: [
        { id: 'e17a', sub: 'a', level: 'BEG', make: function (r, sh) { return mc(r, '(a) What does ' + t('C(' + sh.a + ')=' + sh.c) + ' mean?', [{ html: 'Buying ' + sh.a + ' tickets costs $' + sh.c + '.', right: true }, { html: 'Buying ' + sh.c + ' tickets costs $' + sh.a + '.', why: 'Inside the brackets is the number of tickets.', code: 'flip' }, { html: 'Each ticket costs $' + sh.c + '.', why: t(sh.c) + ' is the total for ' + sh.a + ' tickets.', code: 'rate' }, { html: 'The cost is $' + sh.c + ' times ' + sh.a + '.', why: 'The brackets show the input, not multiplication.', code: 'times' }], 'Buying ' + sh.a + ' tickets costs $' + sh.c + '.', ['Input inside the brackets, output after the equals sign.'], 'C(a)=c meaning'); } },
        { id: 'e17b', sub: 'b', level: 'EMG', make: function (r, sh) { return mc(r, '(b) What is the question “solve ' + t('C(n)=' + sh.d) + '” asking for?', [{ html: 'How many tickets can be bought for a total of $' + sh.d + '.', right: true }, { html: 'The cost of ' + sh.d + ' tickets.', why: 'That would be ' + t('C(' + sh.d + ')') + '. Here ' + t(sh.d) + ' is the output (dollars).', code: 'eval' }, { html: 'The price of one ticket.', why: 'Solving gives the input ' + t('n') + ', a number of tickets.', code: 'rate' }, { html: 'How much ' + t('n') + ' tickets cost.', why: 'The cost is already given: $' + sh.d + '.', code: 'cost' }], 'It asks for the input ' + t('n') + ': the number of tickets whose total cost is $' + sh.d + '.', HS, 'solve C(n)=d meaning'); } },
        { id: 'e17c', sub: 'c', level: 'EMG', make: function (r, sh) { return stmtPart('(c) Write “' + sh.e + ' tickets cost $' + sh.f + '” as a statement in function notation.', 'C', sh.e, sh.f, t('C(' + sh.e + ')=' + sh.f) + ': the input (tickets) in the brackets, the output (dollars) after the equals sign.', null, 'write C(e)=f'); } },
        { id: 'e17d', sub: 'd', level: 'PRG', make: function (r, sh) { return B.grid('(d) What kind of number does each one ask for?', [{ id: 'a', html: t('C(' + sh.g + ')') }, { id: 'b', html: 'solve ' + t('C(n)=' + sh.g) }], [{ id: 'd', html: 'a number of dollars' }, { id: 't', html: 'a number of tickets' }], { a: 'd', b: 't' },
          { why: function (rw) { return { code: 'u5l9-pick', hint: rw === 'a' ? 'In ' + t('C(' + sh.g + ')') + ' the ' + t(sh.g) + ' is the input (tickets); the answer is the output — dollars.' : 'In ' + t('C(n)=' + sh.g) + ' the ' + t(sh.g) + ' is the output (dollars); the unknown ' + t('n') + ' is tickets.' }; } },
          t('C(' + sh.g + ')') + ' asks for dollars: ' + t(sh.g) + ' sits in the input position (tickets) and the answer is the output (cost). “Solve ' + t('C(n)=' + sh.g) + '” asks for tickets: ' + t(sh.g) + ' is the output (cost) and the unknown ' + t('n') + ' is the input.', HS, 'dollars vs tickets'); } }] },
    { num: '18', stem: function (sh) { return 'A veterinarian records a puppy’s mass with the function ' + t('W(t)') + ', the mass in kilograms ' + t('t') + ' weeks after birth.'; },
      shared: function (r) { return r.chance(0.15) ? { a: 6, w: 4.2, k: 10, n: 2 } : { a: r.int(3, 12), w: r.pick([2.5, 3.1, 4.2, 5.6, 6.8, 7.4]), k: r.pick([8, 10, 12, 15]), n: r.int(1, 4) }; },
      parts: [
        { id: 'e18a', sub: 'a', level: 'BEG', make: function (r, sh) { return mc(r, '(a) Interpret ' + t('W(' + sh.a + ')=' + sh.w) + '.', [{ html: sh.a + ' weeks after birth, the puppy has a mass of ' + sh.w + ' kg.', right: true }, { html: sh.w + ' weeks after birth, the puppy has a mass of ' + sh.a + ' kg.', why: 'The input (weeks) is inside the brackets.', code: 'flip' }, { html: 'The puppy gains ' + sh.w + ' kg every ' + sh.a + ' weeks.', why: 'It is a single measurement, not a rate.', code: 'rate' }, { html: 'The puppy’s mass is ' + sh.w + ' × ' + sh.a + ' kg.', why: 'The brackets show the input.', code: 'times' }], sh.a + ' weeks after birth the puppy has a mass of ' + sh.w + ' kg.', [], 'W(a)=w'); } },
        { id: 'e18b', sub: 'b', level: 'EMG', make: function (r, sh) { return mc(r, '(b) The vet solves ' + t('W(t)=' + sh.k) + '. What is she trying to find out?', [{ html: 'How many weeks after birth the puppy’s mass reaches ' + sh.k + ' kg.', right: true }, { html: 'The puppy’s mass ' + sh.k + ' weeks after birth.', why: 'That would be ' + t('W(' + sh.k + ')') + '. Here ' + t(sh.k) + ' is the mass (output).', code: 'eval' }, { html: 'How much the puppy grows each week.', why: 'Solving gives an input: a time.', code: 'rate' }, { html: 'The puppy’s mass at birth.', why: 'That is ' + t('W(0)') + '.', code: 'birth' }], 'She wants the time (number of weeks) at which the mass reaches ' + sh.k + ' kg.', HS, 'solve W(t)=k'); } },
        { id: 'e18c', sub: 'c', level: 'EMG', make: function (r, sh) { return mc(r, '(c) ' + t('W(0)') + ' has a sensible meaning here, but ' + t('W(-' + sh.n + ')') + ' does not. Why?', [{ html: t('W(0)') + ' is the mass at birth; ' + t('W(-' + sh.n + ')') + ' would be the mass ' + sh.n + ' weeks before the puppy was born.', right: true }, { html: t('W(0)=0') + ' and masses can’t be negative.', why: 'At birth the puppy already has a mass.', code: 'zero' }, { html: 'Function notation never allows negative inputs.', why: 'Negative inputs are fine in general — here time before birth makes no sense.', code: 'never' }, { html: t('W(-' + sh.n + ')') + ' is a negative mass.', why: 'The input ' + t('-' + sh.n) + ' is a time, not a mass.', code: 'mass' }], t('W(0)') + ' is the puppy’s mass at birth. ' + t('W(-' + sh.n + ')') + ' would be its mass ' + sh.n + ' weeks before it was born, which has no meaning.', [], 'W(0) vs W(-n)'); } }] },
    { num: '19', stem: '<b>Stretch: when input equals output.</b> To find an input that the machine leaves unchanged, set the rule equal to ' + t('x') + ' and solve.', parts: [
      { id: 'e19a', sub: 'a', level: 'PRG', make: function (r) { var m = r.pick([2, 3, 4]), z = r.pick(nz(-5, 6)), b = z - m * z; if (r.chance(0.15)) { m = 2; b = -5; z = 5; } return solPart('(a) If ' + t('f(x)=' + lin([[m, 'x'], [b, '']])) + ', find the value of ' + t('x') + ' for which ' + t('f(x)=x') + '.', [z], 'x', [[[-z], 'fn-solve-sign', 'Check the signs when you move the ' + t('x') + '-terms together.'], [[-b / m], 'fn-evaluated', 'Set the rule equal to ' + t('x') + ' (not to ' + t('0') + ').']], t(lin([[m, 'x'], [b, '']]) + '=x') + ' → ' + t(term(m - 1, 'x', true) + '=' + vt(-b)) + ' → ' + t('x=' + z) + '. Check: ' + t('f(' + z + ')=' + z) + ' ✓', ['Set ' + t(lin([[m, 'x'], [b, '']]) + '=x') + ' and collect the ' + t('x') + '-terms.'], 'fixed point a'); } },
      { id: 'e19b', sub: 'b', level: 'ADV', make: function (r) { var m = r.pick([3, 4, 5, -1, -2]), z = r.pick(nz(-5, 5)), b = z - m * z; if (r.chance(0.15)) { m = 4; b = 9; z = -3; } return solPart('(b) If ' + t('g(x)=' + lin([[m, 'x'], [b, '']])) + ', find the value of ' + t('x') + ' for which ' + t('g(x)=x') + '.', [z], 'x', [[[-z], 'fn-solve-sign', 'Check the signs.']], t(lin([[m, 'x'], [b, '']]) + '=x') + ' → ' + t(term(m - 1, 'x', true) + '=' + vt(-b)) + ' → ' + t('x=' + z) + '.', ['Set the rule equal to ' + t('x') + '.'], 'fixed point b'); } },
      { id: 'e19c', sub: 'c', level: 'PRG', make: function (r) { var k = r.pick(nz(-9, 9)); return mc(r, '(c) Try the same thing with ' + t('h(x)=x' + sg(k)) + '. What happens?', [{ html: t('x' + sg(k) + '=x') + ' simplifies to ' + t('0=' + (-k)) + ', never true: no input is left unchanged — ' + t('h') + ' shifts every input by ' + t(k) + '.', right: true },
        { html: 'Every input is left unchanged.', why: t('h(1)=' + (1 + k)) + ', not ' + t('1') + '.', code: 'all' }, { html: t('x=' + (-k)) + ' is left unchanged.', why: 'Check: ' + t('h(' + (-k) + ')=0') + ', not ' + t(-k) + '.', code: 'neg' }, { html: t('x=0') + ' is left unchanged.', why: t('h(0)=' + k) + '.', code: 'zero' }],
        t('x' + sg(k) + '=x') + ' gives ' + t('0=' + (-k)) + ', which is never true, so no input works: ' + t('h') + ' moves every input by ' + t(k) + '.', ['Subtract ' + t('x') + ' from both sides.'], 'no fixed point'); } }] }
  ];

  HW.defineLesson({
    id: 'u5l9', unit: 5, num: '9', title: 'Function Notation: Evaluating and Interpreting f(x)', outcome: 'RF8',
    blurb: 'Reading f(x) as “the output of f at x”: evaluating at numbers, negatives, fractions and expressions, solving f(x) = k, and interpreting function notation in context.',
    questions: QUESTIONS, extra: EXTRA
  });
})(window);
