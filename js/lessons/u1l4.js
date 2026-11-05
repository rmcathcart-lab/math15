/* Math 15 · Unit 1 · Lesson 4 — Classifying Numbers in the Real Number System (AN2)
 * Assignment 4 (u1_L04.tex, Questions 1–14) and the Lesson 4 Extra Practice (u1_EP04.tex, Questions 1–16).
 * Every part is a generator: it keeps the idea and difficulty of the booklet question (the booklet's numbers are among
 * the possible values where practical) and changes the numbers. Set names follow the booklet: N, W, I, Q, \overline{Q}, R.
 * Built from the Math 10C Unit 1 Lessons 4–5 practice (same checkers, diagnoses and codes), at Math 15 pitch: no
 * calculator, friendly numbers.
 * Conversions: "write as a decimal, terminates or repeats, rational?" → a decimal box per number plus one table for
 * terminates / repeats / rational; 2(d) (already a decimal) asks for the fraction instead, which is what shows it is
 * rational. "Classify and explain" → multiple choice whose options are reasons. "Explain the difference" (Q10) →
 * multiple choice plus one example of each kind. Venn diagram (Q14) → the nesting order, then one example typed for
 * each region. "Order, then plot" → an ordering part and a number-line part on the same numbers.
 * Open "find a number" parts accept any correct number, so they have few distinct prompts by design. */
(function (root) {
  'use strict';
  var HW = root.HW, ex = HW.ex, F = HW.fmt, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'q-and-qbar': 'Checked both Q and Q̄', 'irr-as-rat': 'Called an irrational number rational', 'rat-as-irr': 'Called a rational number irrational',
    'missing-r': 'Left out R', 'missed-qbar': 'Left out Q̄', 'zero-natural': 'Put 0 in N', 'neg-whole': 'Put a negative number in W or N',
    'not-integer': 'Put a non-integer in I, W or N', 'missed-q': 'Forgot that integers are rational', nest: 'Missed a set the number is nested in',
    'not-real': 'Not a real number', variable: 'Used a letter', 'dots-exact': 'Used … instead of an exact number',
    'not-in-set': 'Number not in the required set', 'in-excluded-set': 'Number is in the excluded set', range: 'Number outside the given range',
    'mc-said-always': 'Said “always”', 'mc-said-sometimes': 'Said “sometimes”', 'mc-said-never': 'Said “never”',
    'mc-said-rational': 'Chose “rational” (wrong reason or wrong verdict)', 'mc-said-irrational': 'Chose “irrational” (wrong reason or wrong verdict)',
    'mc-said-NT': 'Said non-repeating & terminating', 'mc-said-RN': 'Said repeating & non-terminating', 'mc-said-NN': 'Said non-repeating & non-terminating', 'mc-said-RT': 'Said repeating & terminating (impossible)',
    'mc-closed': 'Said closed (it isn’t)', 'mc-not-closed': 'Said not closed (it is)', 'mc-bad-counter': 'Gave a “counterexample” that stays in the set',
    'u1l4-missed-zero': 'Left 0 out of W (or I)', 'u1l4-missed-neg': 'Left the negative integers out of I', 'u1l4-missing-member': 'Missed a member of the set',
    'u1l4-not-member': 'Chose a number that isn’t in the set', 'no-bar': 'Repeating decimal written without a bar', 'bar-block': 'Bar over the wrong block',
    'as-terminating': 'Treated a repeating decimal as terminating', 'irrational-answer': 'Gave an irrational number', endpoint: 'Gave an endpoint', 'not-between': 'Number not between',
    'np-order': 'Number line: two numbers in the wrong order', 'np-place': 'Number line: a number too far from its value', order: 'Two numbers in the wrong order',
    'ss-rational': 'Set sort: rational/irrational mix-up', 'ss-inner': 'Set sort: not the innermost set', 'ss-subset': 'Set sort: too small a set',
    'u1l4-not-irr-base': 'Base is not irrational', 'u1l4-power-irr': 'The power is still irrational', 'u1l4-power-value': 'Power worked out wrong', 'u1l4-not-whole-exp': 'Exponent not a whole number',
    'u1l4-region': 'Example not in the innermost region', 'u1l4-term-rep': 'Mixed up terminating and repeating'
  });
  HW.addPartial({ 'irr-as-rat': 'n', 'rat-as-irr': 'n', 'as-terminating': 'n', 'in-excluded-set': 'n', 'not-in-set': 'n', range: 'b', 'not-real': 'n', 'irrational-answer': 'n', endpoint: 'b', 'not-between': 'n' });
  HW.addPartial({ 'u1l4-missed-zero': 'b', 'u1l4-missed-neg': 'n', 'u1l4-missing-member': 'b', 'u1l4-not-member': 'n', 'u1l4-not-irr-base': 'n', 'u1l4-power-irr': 'n', 'u1l4-power-value': 's', 'u1l4-not-whole-exp': 'n', 'u1l4-region': 'n', 'u1l4-term-rep': 'n' });

  /* ---------- the number sets ---------- */
  var SETS = ['N', 'W', 'I', 'Q', 'Qb', 'R'];
  var SYM = { N: 'N', W: 'W', I: 'I', Q: 'Q', Qb: '\\overline{Q}', R: 'R' };
  var NAME = { N: 'natural numbers', W: 'whole numbers', I: 'integers', Q: 'rational numbers', Qb: 'irrational numbers', R: 'real numbers' };
  var NOUN = { N: 'natural number', W: 'whole number', I: 'integer', Q: 'rational number', Qb: 'irrational number', R: 'real number' };
  var ONE = { N: 'a natural number', W: 'a whole number', I: 'an integer', Q: 'a rational number', Qb: 'an irrational number', R: 'a real number' };
  var RANK = { N: 0, W: 1, I: 2, Q: 3, R: 5 };
  var SETS_OF = { nat: ['N', 'W', 'I', 'Q', 'R'], zero: ['W', 'I', 'Q', 'R'], negint: ['I', 'Q', 'R'], rat: ['Q', 'R'], irr: ['Qb', 'R'] };
  var SMALLEST = { nat: 'N', zero: 'W', negint: 'I', rat: 'Q', irr: 'Qb' };
  var COLS = SETS.map(function (x) { return { id: x, html: t(SYM[x]), label: NAME[x] }; });
  function S(x) { return t(SYM[x]); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function sub(x, y) { if (x === y) return true; if (x === 'Qb') return y === 'R'; if (y === 'Qb') return false; return RANK[x] <= RANK[y]; }
  function bigToSmall(kind) { return ['R', 'Q', 'Qb', 'I', 'W', 'N'].filter(function (x) { return SETS_OF[kind].indexOf(x) >= 0; }); }
  function setsTex(arr) { return t(arr.map(function (x) { return SYM[x]; }).join(',\\ ')); }
  var CAND = [{ tex: '5', s: SETS_OF.nat }, { tex: '0', s: SETS_OF.zero }, { tex: '-3', s: SETS_OF.negint }, { tex: '\\frac{1}{2}', s: SETS_OF.rat }, { tex: '\\sqrt{2}', s: SETS_OF.irr }];
  function exIn(x, notY) { for (var i = 0; i < CAND.length; i++) { var c = CAND[i]; if (c.s.indexOf(x) >= 0 && (!notY || c.s.indexOf(notY) < 0)) return c.tex; } return null; }
  function exBoth(x, y) { for (var i = 0; i < CAND.length; i++) { var c = CAND[i]; if (c.s.indexOf(x) >= 0 && c.s.indexOf(y) >= 0) return c.tex; } return null; }
  function relation(x, y) { return sub(x, y) ? 'always' : exBoth(x, y) ? 'sometimes' : 'never'; }
  var PAIRS = []; SETS.forEach(function (x) { SETS.forEach(function (y) { if (x !== y) PAIRS.push([x, y]); }); });
  var TRUE_PAIRS = PAIRS.filter(function (p) { return sub(p[0], p[1]); });
  var REV_PAIRS = PAIRS.filter(function (p) { return sub(p[1], p[0]); });

  /* ---------- small helpers ---------- */
  function gen(r, make, okf, n) { var v; for (var i = 0; i < (n || 600); i++) { v = make(); if (okf(v)) return v; } return v; }
  function isSq(n) { var q = Math.round(Math.sqrt(n)); return q * q === n; }
  function nonSq(n) { return !isSq(n); }
  function gcd(a, b) { return ex.gcd(a, b); }
  function blank() { return '<span style="display:inline-block;min-width:4.5em;border-bottom:1.5px solid currentColor">&nbsp;</span>'; }
  function dec(x) { return String(Math.round(x * 1e6) / 1e6); }
  /* 0.d c d cc d ccc d cccc d… (the booklet's 0.808008000800008…) */
  function growTex(d, c) { var s = '0.' + d; for (var k = 1; k <= 4; k++) s += new Array(k + 1).join(c) + d; return s + '\\ldots'; }
  function randGrow(r) { var d = String(r.int(1, 9)), c = gen(r, function () { return String(r.int(0, 9)); }, function (x) { return x !== d; }); return { d: d, c: c, tex: growTex(d, c) }; }
  function plainTex(s) {
    s = String(s).replace(/\\pi/g, 'π').replace(/\\times/g, '×').replace(/\\ldots/g, '…').replace(/\\,/g, '').replace(/\\overline\{(\d+)\}/g, '($1) repeating');
    s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2').replace(/\\sqrt\[3\]\{([^{}]*)\}/g, '∛$1');
    return s.replace(/\\sqrt\{([^{}]*)\}/g, function (m, a) { return /^[\d.]+$/.test(a) ? '√' + a : '√(' + a + ')'; });
  }

  /* ---------- numbers to classify: { tex, kind, note, whyRat / whyIrr } ---------- */
  function item(tex, kind, note, extra) { var o = { tex: tex, kind: kind, note: note }; Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; }); return o; }
  function natInt(k) { return item(F(k), 'nat', t(F(k)) + ' is a counting number.'); }
  function sqrtPerfect(k) { return item('\\sqrt{' + k * k + '}', 'nat', t('\\sqrt{' + k * k + '}=' + k) + ', a counting number.', { val: k, whyRat: t('\\sqrt{' + k * k + '}=' + k) + ' because ' + t(k + '\\times ' + k + '=' + k * k) + '. The square root of a perfect square is rational.' }); }
  function negInt(k) { return item('-' + k, 'negint', t('-' + k) + ' is a negative integer.'); }
  function negSqrt(k) { return item('-\\sqrt{' + k * k + '}', 'negint', t('-\\sqrt{' + k * k + '}=-' + k) + ', a negative integer.', { val: -k, whyRat: t('-\\sqrt{' + k * k + '}=-' + k) + ': ' + t(k * k) + ' is a perfect square, so the root is rational.' }); }
  function cbrtNeg(k) { return item('\\sqrt[3]{-' + F(k * k * k) + '}', 'negint', t('\\sqrt[3]{-' + F(k * k * k) + '}=-' + k) + ' because ' + t('(-' + k + ')(-' + k + ')(-' + k + ')=-' + F(k * k * k)) + ' — a negative integer.', { val: -k, whyRat: t('\\sqrt[3]{-' + F(k * k * k) + '}=-' + k) + ', an integer, so it is rational.' }); }
  function zeroItem() { return item('0', 'zero', t('0') + ' is whole and an integer, but ' + S('N') + ' starts at ' + t('1') + '.', { whyRat: t('0=\\frac{0}{1}') + ' is rational.' }); }
  function fracItem(p, q, neg) {
    var tx = (neg ? '-' : '') + '\\frac{' + p + '}{' + q + '}', close = p === 22 && q === 7;
    return item(tx, 'rat', t(tx) + ' is a ratio of integers, but not an integer.', { neg: neg, whyRat: t(tx) + ' is a ratio of two integers, so it is rational by definition.' + (close ? ' (It is close to ' + t('\\pi') + ', but it is <b>not</b> equal to it.)' : '') });
  }
  function sqrtIrr(n) { return item('\\sqrt{' + n + '}', 'irr', t(n) + ' is not a perfect square, so ' + t('\\sqrt{' + n + '}') + ' never ends and never repeats.', { whyIrr: t(n) + ' is not a perfect square, so ' + t('\\sqrt{' + n + '}') + ' is irrational: its decimal never ends and never repeats.' }); }
  function negSqrtIrr(n) { return item('-\\sqrt{' + n + '}', 'irr', t(n) + ' is not a perfect square, so ' + t('-\\sqrt{' + n + '}') + ' never ends and never repeats.', { neg: true, whyIrr: t(n) + ' is not a perfect square, so ' + t('-\\sqrt{' + n + '}') + ' is irrational (the negative sign doesn’t change that).' }); }
  function termItem(a, d) { var tx = a + '.' + d; return item(tx, 'rat', t(tx) + ' terminates, so it is rational, but it isn’t an integer.', { whyRat: t(tx) + ' terminates, so it is rational: ' + t(tx + '=\\frac{' + (10 * a + d) + '}{10}') + '.' }); }
  function repItem(ab) { var tx = '0.\\overline{' + ab + '}'; return item(tx, 'rat', 'The bar means ' + t(ab) + ' repeats forever, so ' + t(tx) + ' is rational (but not an integer).', { whyRat: 'The bar over ' + t(ab) + ' means that block repeats forever. A repeating decimal is rational.' }); }
  function piItem(tx) { return item(tx, 'irr', t('\\pi=3.141\\,59\\ldots') + ' never ends or repeats' + (tx === '\\pi' ? '.' : ', and neither does ' + t(tx) + '.'), { whyIrr: t('\\pi') + ' never ends and never repeats, so it is irrational' + (tx === '\\pi' ? '.' : ' — and so is ' + t(tx) + '.') }); }
  function decSqItem(k) { var sq = (k * k / 100).toFixed(2), rt = String(k / 10); return item('\\sqrt{' + sq + '}', 'rat', t('\\sqrt{' + sq + '}=' + rt) + ' because ' + t(rt + '\\times ' + rt + '=' + sq) + ' — a terminating decimal, not an integer.', { whyRat: t('\\sqrt{' + sq + '}=' + rt) + ' because ' + t(rt + '\\times ' + rt + '=' + sq) + '. That terminates, so it is rational.' }); }
  function rep2(r) { return gen(r, function () { return String(r.int(1, 9)) + String(r.int(0, 9)); }, function (s) { return s.charAt(0) !== s.charAt(1); }); }

  /* hint for a wrong row in a "check every set" table */
  function memberWhy(it, got) {
    got = got || []; var has = function (x) { return got.indexOf(x) >= 0; }, want = SETS_OF[it.kind];
    if (has('Q') && has('Qb')) return { code: 'q-and-qbar', hint: t(it.tex) + ': a number can’t be in both ' + S('Q') + ' and ' + S('Qb') + ' — its decimal either ends or repeats (rational), or it doesn’t (irrational).' };
    if (it.kind === 'irr' && (has('Q') || has('I') || has('W') || has('N'))) return { code: 'irr-as-rat', hint: it.whyIrr };
    if (it.kind !== 'irr' && has('Qb')) return { code: 'rat-as-irr', hint: it.whyRat || t(it.tex) + ' is rational.' };
    if (!has('R')) return { code: 'missing-r', hint: t(it.tex) + ': every number in this lesson is a real number, so ' + S('R') + ' always gets a check.' };
    if (it.kind === 'irr' && !has('Qb')) return { code: 'missed-qbar', hint: it.whyIrr + ' Which set holds the irrational numbers?' };
    if (it.kind === 'zero' && has('N')) return { code: 'zero-natural', hint: t(it.tex) + ': ' + S('N') + ' starts at ' + t('1') + ' — ' + t('0') + ' is whole, but not natural.' };
    if ((it.kind === 'negint' || it.neg) && (has('N') || has('W'))) return { code: 'neg-whole', hint: t(it.tex) + ' is negative. ' + S('W') + ' and ' + S('N') + ' contain no negative numbers.' };
    if (it.kind === 'rat' && (has('I') || has('W') || has('N'))) return { code: 'not-integer', hint: t(it.tex) + ' isn’t an integer (it falls between two integers), so it isn’t in ' + S('I') + ', ' + S('W') + ' or ' + S('N') + '.' };
    var miss = want.filter(function (x) { return !has(x); });
    if (miss.length && miss.indexOf('Q') >= 0) return { code: 'missed-q', hint: t(it.tex) + ': every integer is rational too (' + t('n=\\frac{n}{1}') + '), so ' + S('Q') + ' needs a check.' };
    if (miss.length) return { code: 'nest', hint: t(it.tex) + ': the sets are nested, so a number belongs to its smallest set <b>and every set around it</b>. Check them all.' };
    return null;
  }
  var MEMBER_HINTS = ['Simplify first. Is the number rational (it ends or repeats) or irrational? Every number here is in ' + S('R') + '.', 'If it is rational: is it an integer? Is it ' + t('\\ge 0') + ' (then it is whole)? Is it ' + t('\\ge 1') + ' (then it is natural)?'];
  function wantSets(it) { return SETS.filter(function (x) { return SETS_OF[it.kind].indexOf(x) >= 0; }); }
  function memberPart(it, prompt) {
    var p = P.grid(prompt || 'Check every set that ' + t(it.tex) + ' belongs to.', [{ id: 'x', html: t(it.tex.replace(/\\frac/g, '\\dfrac')), label: plainTex(it.tex) }], COLS, { x: wantSets(it) },
      { count: false, why: function (rid, got) { return memberWhy(it, got); } }, it.note + ' Sets: ' + setsTex(bigToSmall(it.kind)) + '.', MEMBER_HINTS, 'sets of ' + plainTex(it.tex));
    p.bad = [{ x: it.kind === 'irr' ? ['Q', 'R'] : ['Qb', 'R'] }, { x: wantSets(it).filter(function (x) { return x !== 'R'; }) }];
    return p;
  }
  function memberTable(items, prompt, text) {
    var rows = [], want = {}, byId = {}, L = 'abcdefgh';
    items.forEach(function (it, i) { var id = L.charAt(i); rows.push({ id: id, html: t(it.tex.replace(/\\frac/g, '\\dfrac')), label: plainTex(it.tex) }); want[id] = wantSets(it); byId[id] = it; });
    var p = P.grid(prompt, rows, COLS, want, { why: function (rid, got) { return memberWhy(byId[rid], got); } },
      items.map(function (it) { return t(it.tex) + ': ' + setsTex(bigToSmall(it.kind)) + ' — ' + it.note; }).join('<br>'), MEMBER_HINTS, text);
    var b1 = {}; rows.forEach(function (rw) { b1[rw.id] = want[rw.id].filter(function (x) { return x !== 'R'; }); });
    p.bad = [b1];
    return p;
  }

  /* ---------- the Venn diagram ---------- */
  function vennSvg() {
    return '<svg viewBox="0 0 304 184" width="100%" style="max-width:420px;display:block;margin:6px auto" role="img" aria-label="The real number system: rectangle R; on the left nested ellipses Q, I, W, N; on the right Q-bar">' +
      '<g fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="2" width="300" height="180" rx="3"/><line x1="222" y1="2" x2="222" y2="182"/>' +
      '<ellipse cx="107" cy="94" rx="98" ry="80"/><ellipse cx="107" cy="102" rx="78" ry="64"/><ellipse cx="107" cy="110" rx="58" ry="48"/><ellipse cx="107" cy="124" rx="34" ry="28"/></g>' +
      '<g fill="currentColor" font-size="15" font-style="italic" font-family="KaTeX_Math, Times New Roman, serif" text-anchor="middle"><text x="14" y="21">R</text><text x="107" y="31">Q</text><text x="107" y="55">I</text><text x="107" y="80">W</text><text x="107" y="129">N</text><text x="262" y="99">Q</text></g>' +
      '<line x1="255" y1="85" x2="269" y2="85" stroke="currentColor" stroke-width="1.3"/></svg>';
  }

  /* ---------- reading a typed real number exactly (from 10C u1l5) ---------- */
  function swapPi(a) {
    if (!a || typeof a !== 'object') return a;
    if (a.t === 'pi') return { t: 'var', n: '#pi' };
    var o = {}; Object.keys(a).forEach(function (k) { o[k] = (k === 'a' || k === 'b' || k === 'n') ? swapPi(a[k]) : a[k]; }); return o;
  }
  function readReal(resp) {
    var a = K.read(resp); if (a.res) return a;
    var sh = ex.shape(a.ast), vars = Object.keys(sh.vars);
    if (vars.some(function (v) { return v !== 'e'; })) return { res: form('variable', 'Give a number — no letters other than ' + t('\\pi') + '.') };
    if (sh.ell) return { res: form('dots-exact', 'A decimal ending in “…” could be anything. Give an exact number instead, like ' + t('-4') + ', ' + t('\\frac{3}{7}') + ', ' + t('\\sqrt{2}') + ' or ' + t('\\pi') + '.') };
    var b = swapPi(a.ast), v1 = ex.value(b, { '#pi': Math.PI, e: Math.E }), v2 = ex.value(b, { '#pi': 3.3, e: 2.9 });
    if (!isFinite(v1)) return { res: wrong('not-real', 'That doesn’t have a real value (for example, the square root of a negative number, or dividing by ' + t('0') + ').') };
    if ((vars.length || sh.pi) && Math.abs(v1 - v2) > 1e-9) return { v: v1, rational: false };
    var rr = ex.rat(a.ast); if (rr) return { v: rr[0] / rr[1], rational: true, p: rr[0], q: rr[1], dec: sh.decimals > 0 && !sh.rep };
    for (var q = 1; q <= 1000; q++) { var p = Math.round(v1 * q); if (Math.abs(v1 * q - p) < 1e-13 * q * Math.max(1, Math.abs(v1))) { var g = gcd(p, q) || 1; return { v: p / q, rational: true, p: p / g, q: q / g }; } }
    return { v: v1, rational: false };
  }
  function kindOf(o) { if (!o.rational) return 'irr'; if (o.q !== 1) return 'rat'; return o.p > 0 ? 'nat' : o.p === 0 ? 'zero' : 'negint'; }
  function describe(o) {
    var k = kindOf(o), tx = o.rational ? ex.texRat([o.p, o.q]) : null;
    return k === 'irr' ? 'Your number is irrational (in ' + S('Qb') + ').' : k === 'rat' ? (o.q > 100 ? 'Your number' : t(tx)) + ' is rational, but not an integer.' : k === 'nat' ? t(tx) + ' is a natural number (so it is also whole, an integer and rational).' :
      k === 'zero' ? 'Your number is ' + t('0') + ': whole, an integer and rational, but not natural.' : t(tx) + ' is a negative integer (so it is also rational).';
  }
  var TIP = { N: 'one of the counting numbers ' + t('1, 2, 3, \\ldots'), W: 'one of ' + t('0, 1, 2, 3, \\ldots'), I: 'one of ' + t('\\ldots, -2, -1, 0, 1, 2, \\ldots'), Q: 'a fraction, or a decimal that ends or repeats', Qb: 'a decimal that never ends and never repeats, like ' + t('\\sqrt{2}') + ' or ' + t('\\pi'), R: 'any number on the number line' };
  var NOT_TIP = { N: 'Every whole number except 0 is natural.', W: 'Whole numbers are 0, 1, 2, … — so think negative.', I: 'Think of a fraction or decimal that falls between two integers.', Q: 'You need a decimal that never ends and never repeats, e.g. the square root of a number that isn’t a perfect square.' };
  /* checker for "a number that is in inS but not in notS" (optional between [lo, hi]) */
  function findCheck(cond) {
    return function (resp) {
      var o = readReal(resp); if (o.res) return o.res;
      var sets = SETS_OF[kindOf(o)];
      if (sets.indexOf(cond.inS) < 0) return wrong('not-in-set', describe(o) + ' You need ' + ONE[cond.inS] + ': ' + TIP[cond.inS] + '.');
      if (cond.notS === 'Q' && o.rational && o.dec && o.q >= 100) return wrong('in-excluded-set', 'A decimal that stops is rational — even if it is a rounded value of an irrational number like ' + t('\\sqrt{2}') + '. Type the exact number instead (use the ' + t('\\sqrt{\\ }') + ' or ' + t('\\pi') + ' key).');
      if (cond.notS && sets.indexOf(cond.notS) >= 0) return wrong('in-excluded-set', describe(o) + ' So it <b>is</b> ' + ONE[cond.notS] + '. ' + (NOT_TIP[cond.notS] || ''));
      if (cond.between && !(o.v > cond.between[0] + 1e-12 && o.v < cond.between[1] - 1e-12)) return wrong('range', 'Your number is ' + ONE[cond.inS] + (cond.notS ? ' and not ' + ONE[cond.notS] : '') + ', but it isn’t between ' + t(cond.btex ? cond.btex[0] : cond.between[0]) + ' and ' + t(cond.btex ? cond.btex[1] : cond.between[1]) + '.' + (cond.rangeTip || ''));
      return ok();
    };
  }
  function findPart(prompt, cond, keyTex, good, bad, sol, hints, text) {
    return { prompt: prompt, input: { type: 'math', keys: 'expr' }, check: findCheck(cond), key: keyTex, answer: cond.only ? t(keyTex) : '(answers vary) e.g. ' + t(keyTex), good: good, bad: bad,
      solution: sol, hints: hints, text: text };
  }

  /* ---------- always / sometimes / never; true / false ---------- */
  function asnPart(r, stmt, d, text) {
    var why = function (w) {
      if (w === 'always') return d.ans === 'sometimes' ? 'Not always. Counterexample: ' + d.no : 'Can you find even one example? ' + d.reason;
      if (w === 'never') return d.ans === 'sometimes' ? 'It can happen: ' + d.yes : d.reason;
      return d.ans === 'always' ? 'Look for a counterexample — there isn’t one. ' + d.reason : 'Look for an example that works — there isn’t one. ' + d.reason;
    };
    var opts = ['always', 'sometimes', 'never'].map(function (w) { return { html: '<b>' + w + '</b>', right: w === d.ans, why: w === d.ans ? null : why(w), code: 'said-' + w }; });
    var p = P.mc(r, stmt.replace('___', blank()), opts, d.ans === 'sometimes' ? '<b>Sometimes.</b> It works: ' + d.yes + '<br>It fails: ' + d.no : '<b>' + cap(d.ans) + '.</b> ' + d.reason,
      ['Try a few examples. If you can find one that works and one that fails, the answer is <i>sometimes</i>.'], text, true);
    p.input.columns = 3;
    return p;
  }
  function setASN(x, y) {
    var ans = relation(x, y), yes = exBoth(x, y), no = exIn(x, y);
    return { ans: ans, yes: yes ? t(yes) + ' is ' + ONE[x] + ' and ' + ONE[y] + '.' : '', no: no ? t(no) + ' is ' + ONE[x] + ' but not ' + ONE[y] + '.' : '',
      reason: ans === 'always' ? S(x) + ' is nested inside ' + S(y) + ': every ' + NOUN[x] + ' is ' + ONE[y] + '.' : S(x) + ' and ' + S(y) + ' don’t overlap: no number is in both.' };
  }
  function setStmt(r, x, y) { return r.pick([cap(ONE[x]) + ' is ___ ' + ONE[y] + '.', 'A number in ' + S(x) + ' is ___ in ' + S(y) + '.', cap(ONE[x]) + ' is ___ also ' + ONE[y] + '.']); }
  function asnD(ans, yes, no, reason) { return { ans: ans, yes: yes, no: no, reason: reason }; }
  var TF_HINTS = ['Picture the diagram: ' + S('N') + ' inside ' + S('W') + ' inside ' + S('I') + ' inside ' + S('Q') + ', with ' + S('Qb') + ' beside ' + S('Q') + ', all inside ' + S('R') + '.'];
  function tfPart(r, stmt, truth, why, text, hints) { return P.tf(r, stmt, truth, why, '<b>' + (truth ? 'True' : 'False') + '.</b> ' + why, hints || TF_HINTS, text); }
  function subsetWhy(x, y, truth) { return truth ? 'Every ' + NOUN[x] + ' is also ' + ONE[y] + ': ' + S(x) + ' sits inside ' + S(y) + ' on the diagram.' : t(exIn(x, y)) + ' is ' + ONE[x] + ' but not ' + ONE[y] + '.'; }
  function allPart(r, x, y, text) {
    var truth = sub(x, y), st = r.pick(['Every ' + NOUN[x] + ' is ' + ONE[y] + '.', 'Every ' + NOUN[x] + ' is also ' + ONE[y] + '.', 'All ' + NAME[x] + ' are ' + NAME[y] + '.', 'Each ' + NOUN[x] + ' belongs to the set of ' + NAME[y] + '.']);
    return tfPart(r, st, truth, subsetWhy(x, y, truth), text);
  }
  function nestedPart(r, x, y, text) {
    var truth = sub(x, y), why = truth ? subsetWhy(x, y, true) : (sub(y, x) ? 'It’s the other way round: ' + S(y) + ' is nested inside ' + S(x) + '. ' : relation(x, y) === 'never' ? S(x) + ' and ' + S(y) + ' have no members in common. ' : '') + subsetWhy(x, y, false);
    return tfPart(r, r.pick(['The set of ' + NAME[x] + ' is nested inside the set of ' + NAME[y] + '.', 'The set of ' + NAME[x] + ' ' + S(x) + ' is nested inside the set of ' + NAME[y] + ' ' + S(y) + '.', 'The set ' + S(x) + ' is nested inside the set ' + S(y) + '.']), truth, why, text);
  }
  function poolTF(r, pool, text, hints) { var s = r.pick(pool); return tfPart(r, s[0], s[1], s[2], text || 'T/F: ' + s[0].replace(/\\\(|\\\)|<[^>]*>/g, ''), hints); }

  /* ---------- closure ---------- */
  var CLOSE = { '+': 'addition', '−': 'subtraction', '×': 'multiplication', '÷': 'division' };
  /* [closed?, reason, counterexample tex (when not closed), fake counterexample tex] */
  function closeInfo(r, s, op) {
    var a = r.int(2, 9), b = gen(r, function () { return r.int(2, 9); }, function (b) { return b !== a && a % b !== 0 && b % a !== 0; });
    var lo = Math.min(a, b), hi = Math.max(a, b);
    switch (s + op) {
      case 'I÷': return [false, '', t(lo + '\\div ' + hi + '=' + (lo % hi ? '\\frac{' + lo + '}{' + hi + '}' : lo / hi)) + ', which is not an integer.', t((lo * hi) + '\\div ' + lo + '=' + hi) + ', which is an integer.'];
      case 'N÷': return [false, '', t(lo + '\\div ' + hi + '=\\frac{' + lo + '}{' + hi + '}') + ', which is not a natural number.', t((lo * hi) + '\\div ' + hi + '=' + lo) + ', which is a natural number.'];
      case 'W−': return [false, '', t(lo + '-' + hi + '=-' + (hi - lo)) + ', which is not a whole number.', t(hi + '-' + lo + '=' + (hi - lo)) + ', which is a whole number.'];
      case 'N−': return [false, '', t(lo + '-' + hi + '=-' + (hi - lo)) + ', which is not a natural number.', t(hi + '-' + lo + '=' + (hi - lo)) + ', which is a natural number.'];
      case 'Q×': return [true, 'A fraction of integers times a fraction of integers is again a fraction of integers: ' + t('\\frac{a}{b}\\times\\frac{c}{d}=\\frac{ac}{bd}') + '.'];
      case 'Q+': return [true, 'Adding two fractions of integers gives a fraction of integers: ' + t('\\frac{a}{b}+\\frac{c}{d}=\\frac{ad+bc}{bd}') + '.'];
      case 'Q−': return [true, 'Subtracting two fractions of integers gives a fraction of integers: ' + t('\\frac{a}{b}-\\frac{c}{d}=\\frac{ad-bc}{bd}') + '.'];
      case 'I+': return [true, 'Adding two integers always gives an integer, e.g. ' + t('-' + a + '+' + b + '=' + (b - a)) + '.'];
      case 'I−': return [true, 'Subtracting two integers always gives an integer, e.g. ' + t(a + '-' + (a + b) + '=-' + b) + '.'];
      case 'I×': return [true, 'An integer times an integer is always an integer, e.g. ' + t('(-' + a + ')(' + b + ')=-' + a * b) + '.'];
      case 'Qb+': return [false, '', t('\\sqrt{' + a + '}+(-\\sqrt{' + a + '})=0') + ', which is rational.', t('\\sqrt{2}+\\sqrt{3}') + ', which is irrational.'];
      case 'Qb×': return [false, '', t('\\sqrt{' + a + '}\\times\\sqrt{' + a + '}=' + a) + ', which is rational.', t('\\sqrt{2}\\times\\sqrt{3}=\\sqrt{6}') + ', which is irrational.'];
    }
    return null;
  }
  function closedPart(r, s, op) {
    var e = closeInfo(r, s, op), closed = e[0], prompt = 'Is the set of ' + NAME[s] + ' ' + S(s) + ' closed under ' + CLOSE[op] + '?';
    var opts = closed ? [
      { html: '<b>Closed:</b> ' + e[1], right: true },
      { html: '<b>Not closed:</b> some ' + CLOSE[op] + ' answers fall outside ' + S(s) + '.', why: 'Try to find a pair whose answer leaves ' + S(s) + '. You can’t: ' + e[1], code: 'not-closed' },
      { html: '<b>Not closed:</b> ' + (op === '×' ? t('\\frac{1}{2}\\times\\frac{1}{3}=\\frac{1}{6}') + ' is smaller than both' : t('\\frac{1}{2}+\\frac{1}{2}=1') + ' is an integer') + '.', why: 'That answer is still in ' + S(s) + ', so it isn’t a counterexample.', code: 'bad-counter' }]
      : [
      { html: '<b>Not closed:</b> ' + e[2], right: true },
      { html: '<b>Not closed:</b> ' + e[3], why: 'That answer is still in ' + S(s) + ', so it doesn’t show anything. A counterexample has to land <b>outside</b> the set.', code: 'bad-counter' },
      { html: '<b>Closed:</b> ' + e[3].replace(/, which.*$/, '') + ' stays in ' + S(s) + '.', why: 'One example that works isn’t enough. Look for a pair whose answer leaves ' + S(s) + '.', code: 'closed' }];
    return P.mc(r, prompt, opts, closed ? '<b>Closed.</b> ' + e[1] : '<b>Not closed.</b> Counterexample: ' + e[2], ['Try a few pairs. One pair whose answer lands outside the set is enough to show it is <b>not</b> closed.'], s + ' closed under ' + CLOSE[op]);
  }

  /* ---------- ordering and plotting ---------- */
  function orderWhy(byId) { return function (a, b) { var x = byId[a], y = byId[b]; return t(x.tex) + (x.note ? ' ' + x.note : '') + ' and ' + t(y.tex) + (y.note ? ' ' + y.note : '') + ' are in the wrong order. On the number line, the smaller number is further left.'; }; }
  function orderPart(r, its, text) {
    var sorted = its.slice().sort(function (a, b) { return a.v - b.v; }), byId = {}; its.forEach(function (x) { byId[x.id] = x; });
    return P.order(r, 'Arrange the numbers from <b>least to greatest</b>.', sorted, { why: orderWhy(byId) },
      'Decimal values: ' + sorted.map(function (x) { return t(x.tex + (x.approx ? '\\approx ' : '=') + x.vs); }).join(', ') + '.<br>Least to greatest: ' + t(sorted.map(function (x) { return x.tex; }).join('<')) + '.',
      ['Write each number as a decimal first. For a square root, find the perfect squares on either side (e.g. ' + t('\\sqrt{5}') + ' is between ' + t('\\sqrt{4}=2') + ' and ' + t('\\sqrt{9}=3') + ').', 'Negative numbers: the bigger the distance from 0, the smaller the number.'], text);
  }
  function plotPart(its, lo, hi, text, orderGap) {
    var sorted = its.slice().sort(function (a, b) { return a.v - b.v; }), targets = {}, hints = {};
    its.forEach(function (x) { targets[x.id] = x.v; hints[x.id] = t(x.tex + (x.approx ? '\\approx ' : '=') + x.vs) + '.'; });
    return P.numplace('Plot each number on the number line.', { min: lo, max: hi, step: 1, labels: 1, items: its.map(function (x) { return { id: x.id, tex: x.tex }; }) }, targets,
      sorted.map(function (x) { return t(x.tex + (x.approx ? '\\approx ' : '=') + x.vs); }).join(', ') + '.',
      ['Write each number as a decimal, then place it between the right whole numbers.', 'Tap a number, then tap where it goes on the line.'], text, { hints: hints, orderGap: orderGap || 0 });
  }

  /* ---------- lesson ---------- */
  HW.defineLesson({
    id: 'u1l4', unit: 1, num: '4', title: 'Classifying Numbers in the Real Number System', outcome: 'AN2',
    blurb: 'Natural, whole, integer, rational, irrational, real: sorting any number into every set it belongs to, then ordering real numbers on a number line.',
    questions: [
      /* ================= Part A — Naming the Sets ================= */
      { num: '1', section: 'Part A — Naming the Sets',
        stem: function (sh) { return 'Given the set ' + t('\\{' + sh.list.join(',\\ ') + '\\}') + ', select the members that are:'; },
        shared: function (r) {
          var negs = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 18, 22, 25], 2).map(function (x) { return -x; }), pos = r.sample([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 24, 27, 33, 40], 3);
          var list = r.shuffle(negs.concat(pos).concat([0]));
          return { list: list, negs: negs, pos: pos };
        },
        parts: ['N', 'W', 'I'].map(function (s, i) {
          return { id: '1' + 'abc'.charAt(i), level: i === 0 ? 'LIM' : 'BEG', make: function (r, sh) {
            var want = sh.list.filter(function (x) { return s === 'N' ? x > 0 : s === 'W' ? x >= 0 : true; });
            var check = K.selectSet(want, function (extra, missing) {
              if (extra.indexOf(0) >= 0 && s === 'N') return { code: 'zero-natural', hint: t('0') + ' isn’t a natural number: the natural (counting) numbers start at ' + t('1') + '.' };
              if (extra.some(function (x) { return x < 0; })) return { code: 'neg-whole', hint: 'Negative numbers aren’t ' + NAME[s] + ': ' + S(s) + ' is ' + t(s === 'N' ? '\\{1, 2, 3, \\ldots\\}' : '\\{0, 1, 2, 3, \\ldots\\}') + '.' };
              if (missing.indexOf(0) >= 0) return { code: 'u1l4-missed-zero', hint: t('0') + ' belongs here: ' + (s === 'W' ? 'the whole numbers are the natural numbers together with ' + t('0') + '.' : 'every whole number, including ' + t('0') + ', is an integer.') };
              if (s === 'I' && missing.some(function (x) { return x < 0; })) return { code: 'u1l4-missed-neg', hint: 'The integers include the negatives: ' + t('I=\\{\\ldots,-2,-1,0,1,2,\\ldots\\}') + '.' };
              if (missing.length) return { code: 'u1l4-missing-member', hint: 'You missed ' + (missing.length === 1 ? 'one' : missing.length) + '. Check every number in the set.' };
              return { code: 'u1l4-not-member', hint: null };
            });
            var setDesc = { N: t('N=\\{1, 2, 3, \\ldots\\}') + ', the counting numbers', W: t('W=\\{0, 1, 2, 3, \\ldots\\}') + ', the natural numbers together with ' + t('0'), I: t('I=\\{\\ldots,-2,-1,0,1,2,\\ldots\\}') + ', the whole numbers and their opposites' }[s];
            var p = { prompt: 'the <b>' + NAME[s] + '</b> ' + S(s), input: { type: 'select', options: sh.list.slice() }, check: check, key: want,
              answer: t(want.slice().sort(function (a, b) { return a - b; }).join(',\\ ')), solution: setDesc + ': ' + t(want.slice().sort(function (a, b) { return a - b; }).join(',\\ ')) + (s === 'I' ? ' — all six.' : '.'),
              hints: [s === 'N' ? 'Natural numbers are the counting numbers: no ' + t('0') + ', no negatives.' : s === 'W' ? 'Whole numbers: the counting numbers and ' + t('0') + '. No negatives.' : 'Integers: the whole numbers and their opposites.'], text: NAME[s] + ' in {' + sh.list.join(', ') + '}' };
            p.bad = s === 'N' ? [sh.pos.concat([0])] : s === 'W' ? [sh.pos.slice()] : [sh.pos.concat([0])];
            return p;
          } };
        }) },
      { num: '2', stem: 'Write each number as a decimal, decide whether the decimal terminates or repeats, and decide whether the number is rational.',
        shared: function (r) {
          var qa = r.pick([8, 8, 4, 5, 16, 20, 25, 40]), pa = gen(r, function () { return r.int(1, qa - 1); }, function (p) { return gcd(p, qa) === 1; });
          var qb = r.pick([3, 3, 9, 11, 6]), pb = gen(r, function () { return r.int(1, qb - 1); }, function (p) { return gcd(p, qb) === 1; });
          var c = r.int(2, 20), d = gen(r, function () { return r.int(11, 99); }, function (x) { return x % 10 !== 0; });
          return { pa: pa, qa: qa, pb: pb, qb: qb, c: c, d: d };
        },
        parts: [
          { id: '2a', level: 'BEG', make: function (r, sh) {
            return P.repeating('Write ' + t('\\dfrac{' + sh.pa + '}{' + sh.qa + '}') + ' as a decimal.', [sh.pa, sh.qa], { before: t('\\dfrac{' + sh.pa + '}{' + sh.qa + '}=') },
              t(sh.pa + '\\div ' + sh.qa + '=' + K.decTex([sh.pa, sh.qa])) + '. The division stops, so the decimal <b>terminates</b>.', ['Divide the top by the bottom: ' + t(sh.pa + '\\div ' + sh.qa) + '.'], 'decimal of ' + sh.pa + '/' + sh.qa);
          } },
          { id: '2b', level: 'BEG', make: function (r, sh) {
            var p = P.repeating('Write ' + t('\\dfrac{' + sh.pb + '}{' + sh.qb + '}') + ' as a decimal. Put a bar over the digits that repeat.', [sh.pb, sh.qb], { before: t('\\dfrac{' + sh.pb + '}{' + sh.qb + '}=') },
              t(sh.pb + '\\div ' + sh.qb + '=' + (sh.pb / sh.qb).toFixed(6) + '\\ldots=' + K.decTex([sh.pb, sh.qb])) + '. The division never stops, but the same digits come back again and again: it <b>repeats</b>.',
              ['Divide ' + t(sh.pb + '\\div ' + sh.qb) + '. Does it stop? If not, which digits keep coming back?', 'Use the ' + t('\\overline{x}') + ' key to put a bar over the repeating digits.'], 'decimal of ' + sh.pb + '/' + sh.qb);
            p.bad = [(sh.pb / sh.qb).toFixed(2)];
            return p;
          } },
          { id: '2c', level: 'LIM', make: function (r, sh) {
            var p = P.repeating('Write ' + t('-' + sh.c) + ' as a decimal.', [-sh.c, 1], { before: t('-' + sh.c + '=') }, t('-' + sh.c + '=-' + sh.c + '.0') + ' (or just ' + t('-' + sh.c) + '): it <b>terminates</b> right away. It is ' + t('\\frac{-' + sh.c + '}{1}') + ', so it is rational.',
              ['An integer is already a decimal with nothing after the point.'], 'decimal of -' + sh.c);
            p.good = ['-' + sh.c + '.0']; p.bad = [String(sh.c)];
            return p;
          } },
          { id: '2d', level: 'BEG', make: function (r, sh) {
            var ds = '0.' + sh.d, fr = ex.norm(sh.d, 100);
            var p = P.fraction(t(ds) + ' is already a decimal. To show it is rational, write it as a fraction in lowest terms.', fr, { before: t(ds + '=') },
              t(ds + '=\\frac{' + sh.d + '}{100}' + (fr[1] !== 100 ? '=' + ex.texRat(fr) : '')) + (fr[1] !== 100 ? ' (divide the top and bottom by ' + t(100 / fr[1]) + ')' : '') + '. It <b>terminates</b>, and it is a fraction of integers, so it is <b>rational</b>.',
              ['Two decimal places means hundredths: ' + t(ds + '=\\frac{' + sh.d + '}{100}') + '.', 'Then reduce the fraction.'], 'fraction of ' + ds);
            p.bad = [String(sh.d) + '/10'];
            return p;
          } },
          { id: '2e', sub: 'a–d', level: 'BEG', make: function (r, sh) {
            var rows = [{ id: 'a', html: t('\\dfrac{' + sh.pa + '}{' + sh.qa + '}'), label: sh.pa + '/' + sh.qa }, { id: 'b', html: t('\\dfrac{' + sh.pb + '}{' + sh.qb + '}'), label: sh.pb + '/' + sh.qb }, { id: 'c', html: t('-' + sh.c), label: '-' + sh.c }, { id: 'd', html: t('0.' + sh.d), label: '0.' + sh.d }];
            var cols = [{ id: 'T', html: 'Terminates — rational', label: 'Terminates (rational)' }, { id: 'R', html: 'Repeats — rational', label: 'Repeats (rational)' }, { id: 'X', html: 'Neither — irrational', label: 'Neither (irrational)' }];
            var want = { a: 'T', b: 'R', c: 'T', d: 'T' };
            var p = P.grid('For each number, does its decimal terminate or repeat? Is it rational?', rows, cols, want, {
              why: function (rid, g) {
                if (g === 'X') return { code: 'rat-as-irr', hint: 'Every one of these is a fraction of integers (an integer ' + t('n=\\frac{n}{1}') + ' too), so every one is rational: its decimal terminates or repeats.' };
                if (rid === 'b') return { code: 'as-terminating', hint: t('\\frac{' + sh.pb + '}{' + sh.qb + '}=' + K.decTex([sh.pb, sh.qb])) + ' never stops — the same digits keep coming back.' };
                return { code: 'u1l4-term-rep', hint: 'Look at your decimal for (' + rid + '): does it stop, or do the same digits keep coming back?' };
              } },
              t('\\frac{' + sh.pa + '}{' + sh.qa + '}=' + K.decTex([sh.pa, sh.qa])) + ' terminates; ' + t('\\frac{' + sh.pb + '}{' + sh.qb + '}=' + K.decTex([sh.pb, sh.qb])) + ' repeats; ' + t('-' + sh.c + '=-' + sh.c + '.0') + ' terminates; ' + t('0.' + sh.d) + ' terminates.<br>A decimal that terminates or repeats is a fraction of integers, so all four are <b>rational</b>.',
              ['Use your decimals from (a)–(d). A decimal that stops terminates; a block of digits that keeps coming back repeats.', 'Terminating and repeating decimals are always rational.'], 'terminates/repeats table');
            p.bad = [{ a: 'T', b: 'T', c: 'T', d: 'T' }, { a: 'T', b: 'R', c: 'T', d: 'X' }];
            return p;
          } }] },
      { num: '3', stem: 'Decide whether each statement is true or false.', parts: [
        { id: '3a', level: 'LIM', make: function (r) { var p = r.chance(0.5) ? ['I', 'Q'] : r.pick([['W', 'Q'], ['N', 'Q'], ['I', 'R'], ['W', 'I'], ['N', 'W']]); return allPart(r, p[0], p[1], 'every ' + p[0] + ' is ' + p[1]); } },
        { id: '3b', level: 'BEG', make: function (r) { var p = r.chance(0.5) ? ['Q', 'I'] : r.pick([['I', 'W'], ['W', 'N'], ['R', 'Q'], ['Q', 'W'], ['I', 'N']]); return allPart(r, p[0], p[1], 'every ' + p[0] + ' is ' + p[1]); } },
        { id: '3c', level: 'BEG', make: function (r) {
          var d = gen(r, function () { return r.int(11, 99); }, function (x) { return x % 10 !== 0; }), d1 = r.int(1, 9), fr = ex.norm(d, 100);
          return poolTF(r, [['A terminating decimal cannot be written as a fraction.', false, 'It always can: ' + t('0.' + d + '=\\frac{' + d + '}{100}') + '.'],
            ['The terminating decimal ' + t('0.' + d) + ' cannot be written as a fraction.', false, t('0.' + d + '=\\frac{' + d + '}{100}' + (fr[1] !== 100 ? '=' + ex.texRat(fr) : '')) + '.'],
            ['Every terminating decimal can be written as a fraction.', true, 'Count the decimal places: e.g. ' + t('0.' + d + '=\\frac{' + d + '}{100}') + ', ' + t('0.' + d1 + '=\\frac{' + d1 + '}{10}') + '.'],
            ['The terminating decimal ' + t('0.' + d1) + ' is rational.', true, t('0.' + d1 + '=\\frac{' + d1 + '}{10}') + ', a fraction of integers.']], 'terminating decimal as fraction');
        } },
        { id: '3d', level: 'LIM', make: function (r) {
          var k = r.int(2, 30);
          return poolTF(r, [[t('0') + ' is a whole number but not a natural number.', true, 'The natural numbers start at ' + t('1') + '; the whole numbers start at ' + t('0') + '.'],
            [t('0') + ' is a natural number.', false, 'The natural (counting) numbers start at ' + t('1') + '.'],
            [t('0') + ' is a whole number and an integer.', true, t('W=\\{0,1,2,\\ldots\\}') + ', and every whole number is an integer.'],
            [t(k) + ' is a whole number but not a natural number.', false, t(k) + ' is a counting number, so it is natural (and also whole). Only ' + t('0') + ' is whole but not natural.'],
            [t('-' + k) + ' is a whole number.', false, 'Whole numbers are never negative.']], 'zero whole/natural');
        } },
        { id: '3e', level: 'BEG', make: function (r) {
          var b = rep2(r), d = r.int(1, 9);
          return poolTF(r, [['A repeating decimal is irrational.', false, 'Repeating decimals are rational, e.g. ' + t('0.\\overline{3}=\\frac{1}{3}') + '.'],
            [t('0.\\overline{' + b + '}') + ' is irrational because its decimal goes on forever.', false, 'It goes on forever, but it <b>repeats</b> — and every repeating decimal is rational: ' + t('0.\\overline{' + b + '}=' + ex.texRat(ex.norm(Number(b), 99))) + '.'],
            [t('0.\\overline{' + d + '}') + ' is rational.', true, 'It repeats, so it is a fraction: ' + t('0.\\overline{' + d + '}=' + ex.texRat(ex.norm(d, 9))) + '.'],
            ['Every repeating decimal is rational.', true, 'A decimal that repeats can always be written as a fraction of integers, e.g. ' + t('0.\\overline{' + b + '}=' + ex.texRat(ex.norm(Number(b), 99))) + '.']], 'repeating decimal rational?');
        } },
        { id: '3f', level: 'LIM', make: function (r) { var p = r.chance(0.5) ? ['W', 'I'] : r.pick([['N', 'I'], ['W', 'R'], ['N', 'Q'], ['Qb', 'R'], ['Qb', 'Q']]); return allPart(r, p[0], p[1], 'every ' + p[0] + ' is ' + p[1]); } }] },
      { num: '4', stem: 'Classify each number as rational or irrational. Choose the answer with the correct reason.', parts: [
        { id: '4a', level: 'BEG', make: function (r) {
          var n = gen(r, function () { return r.int(2, 30); }, nonSq), lo = Math.floor(Math.sqrt(n));
          return P.mc(r, t('\\sqrt{' + n + '}'), [
            { html: '<b>Irrational:</b> ' + t(n) + ' is not a perfect square, so ' + t('\\sqrt{' + n + '}') + ' never ends and never repeats.', right: true },
            { html: '<b>Rational:</b> it is between ' + t(lo) + ' and ' + t(lo + 1) + ', and every number between two integers is rational.', why: 'Lots of irrational numbers are between two integers. Is ' + t(n) + ' a perfect square?', code: 'said-rational' },
            { html: '<b>Irrational:</b> every square root is irrational.', why: 'Right verdict, wrong reason: ' + t('\\sqrt{' + (lo * lo) + '}=' + lo) + ' is a square root, and it is rational.', code: 'said-irrational' },
            { html: '<b>Rational:</b> a calculator shows its decimal stopping after a few digits.', why: 'The calculator runs out of room — the digits really go on forever without repeating.', code: 'said-rational' }],
            t(lo * lo + '<' + n + '<' + (lo + 1) * (lo + 1)) + ', so ' + t(n) + ' is not a perfect square and ' + t('\\sqrt{' + n + '}=' + Math.sqrt(n).toFixed(4) + '\\ldots') + ' never ends and never repeats. <b>Irrational.</b>',
            ['A square root is rational only when the number under it is a perfect square.'], 'classify sqrt ' + n);
        } },
        { id: '4b', level: 'BEG', make: function (r) {
          var k = r.int(2, 15);
          return P.mc(r, t('\\sqrt{' + k * k + '}'), [
            { html: '<b>Rational:</b> ' + t(k * k + '=' + k + '\\times ' + k) + ', so ' + t('\\sqrt{' + k * k + '}=' + k + '=\\frac{' + k + '}{1}') + '.', right: true },
            { html: '<b>Irrational:</b> it has a square root sign.', why: 'A root sign doesn’t decide anything by itself. Work it out: which number times itself is ' + t(k * k) + '?', code: 'said-irrational' },
            { html: '<b>Irrational:</b> its decimal never ends.', why: 'Work it out first: ' + t('\\sqrt{' + k * k + '}') + ' is a whole number.', code: 'said-irrational' },
            { html: '<b>Rational:</b> ' + t(k * k) + ' is ' + (k * k % 2 ? 'odd' : 'even') + '.', why: 'Right verdict, wrong reason: being even or odd doesn’t matter (' + t('\\sqrt{' + (k * k % 2 ? 7 : 8) + '}') + ' is irrational). What matters is that ' + t(k * k) + ' is a perfect square.', code: 'said-rational' }],
            t(k + '\\times ' + k + '=' + k * k) + ', so ' + t('\\sqrt{' + k * k + '}=' + k) + ', which is ' + t('\\frac{' + k + '}{1}') + '. <b>Rational.</b>', ['Is ' + t(k * k) + ' a perfect square?'], 'classify sqrt ' + k * k);
        } },
        { id: '4c', level: 'LIM', make: function (r) {
          var tx = r.pick(['\\pi', '\\pi', '2\\pi', '\\frac{\\pi}{2}', '\\pi+1', '3\\pi']);
          return P.mc(r, t(tx), [
            { html: '<b>Irrational:</b> ' + t('\\pi=3.141\\,59\\ldots') + ' never ends and never repeats' + (tx === '\\pi' ? '.' : ', and neither does ' + t(tx) + '.'), right: true },
            { html: '<b>Rational:</b> ' + t('\\pi=\\frac{22}{7}') + '.', why: t('\\frac{22}{7}=3.142\\,857\\ldots') + ' is only close to ' + t('\\pi=3.141\\,592\\ldots') + ' — they aren’t equal.', code: 'said-rational' },
            { html: '<b>Rational:</b> ' + t('\\pi=3.14') + ', a terminating decimal.', why: t('3.14') + ' is a rounded value. The real ' + t('\\pi') + ' never ends.', code: 'said-rational' },
            { html: '<b>Irrational:</b> it is a letter, not a number.', why: 'Right verdict, wrong reason: ' + t('\\pi') + ' is a number (about ' + t('3.14') + '). It is irrational because its decimal never ends or repeats.', code: 'said-irrational' }],
            t('\\pi=3.141\\,592\\,65\\ldots') + ' never ends and never repeats' + (tx === '\\pi' ? '' : ' (and ' + t(tx) + ' doesn’t either)') + '. <b>Irrational.</b>', ['What does the decimal of ' + t('\\pi') + ' do?'], 'classify ' + plainTex(tx));
        } },
        { id: '4d', level: 'EMG', make: function (r) {
          var g = randGrow(r);
          return P.mc(r, t(g.tex), [
            { html: '<b>Irrational:</b> the run of ' + t(g.c) + '’s gets longer each time, so no block repeats — and it never ends.', right: true },
            { html: '<b>Rational:</b> it has a pattern, so it repeats.', why: 'A pattern isn’t the same as repeating. Repeating means the <b>same block</b> of digits comes back again and again. Here the blocks keep growing.', code: 'said-rational' },
            { html: '<b>Rational:</b> every decimal is rational.', why: 'Only decimals that end or repeat are rational.', code: 'said-rational' },
            { html: '<b>Irrational:</b> it has more than ten digits.', why: 'Right verdict, wrong reason: ' + t('0.\\overline{3}') + ' has endless digits and is rational. The key is that no block repeats.', code: 'said-irrational' }],
            'Between the ' + t(g.d) + '’s the run of ' + t(g.c) + '’s gets one longer each time, so no fixed block ever repeats, and the digits never stop. <b>Irrational.</b>', ['Look closely: is there one block of digits that copies itself forever?'], 'classify growing decimal');
        } }] },
      { num: '5', stem: 'Complete the table.', parts: [
        { id: '5a', sub: 'left column', level: 'BEG', make: function (r) {
          var q = r.pick([4, 5, 8, 3, 7]), p = gen(r, function () { return r.int(1, q - 1); }, function (p) { return gcd(p, q) === 1; });
          return memberTable([natInt(r.int(10, 40)), negInt(r.int(2, 15)), fracItem(p, q, false), sqrtIrr(gen(r, function () { return r.int(2, 30); }, nonSq))], 'Check <b>every</b> set that each number belongs to.', 'set table 1');
        } },
        { id: '5b', sub: 'right column', level: 'EMG', make: function (r) {
          return memberTable([zeroItem(), termItem(r.int(1, 9), r.int(1, 9)), negSqrt(r.int(2, 10)), repItem(rep2(r))], 'Check <b>every</b> set that each number belongs to.', 'set table 2');
        } }] },

      /* ================= Part B — Reasoning About the Sets ================= */
      { num: '6', section: 'Part B — Reasoning About the Sets', stem: 'Find one number that fits each description. (Use the keypad for fractions, roots and ' + t('\\pi') + '.)', parts: [
        { id: '6a', level: 'BEG', make: function (r) {
          var k = r.int(2, 9);
          return findPart(r.pick(['an integer, but not a whole number', 'a number in ' + S('I') + ' but not in ' + S('W')]), { inS: 'I', notS: 'W' }, '-' + k, ['-1', '-17'], [String(k), '0', '-\\frac{1}{2}'],
            'Any negative integer, e.g. ' + t('-' + k) + ': the whole numbers have no negatives.', ['The integers are ' + t('\\ldots,-2,-1,0,1,2,\\ldots') + '. Which of them are not whole numbers?'], 'integer not whole');
        } },
        { id: '6b', level: 'BEG', make: function (r) {
          var q = r.int(2, 9), p = gen(r, function () { return r.int(1, 2 * q); }, function (p) { return gcd(p, q) === 1 && p % q; });
          return findPart(r.pick(['a rational number, but not an integer', 'a number in ' + S('Q') + ' but not in ' + S('I')]), { inS: 'Q', notS: 'I' }, '\\frac{' + p + '}{' + q + '}', ['0.5', '-\\frac{7}{3}', '2.75'], ['3', '\\sqrt{2}', '\\frac{8}{4}'],
            'Any fraction (or decimal) that isn’t an integer, e.g. ' + t('\\frac{' + p + '}{' + q + '}') + '.', ['A rational number is a fraction of integers ' + t('\\frac{a}{b}') + '. Pick one that doesn’t simplify to an integer.'], 'rational not integer');
        } },
        { id: '6c', level: 'BEG', make: function (r) {
          var n = r.pick([2, 3, 5, 6, 7]);
          return findPart(r.pick(['a real number, but not a rational number', 'a number in ' + S('R') + ' but not in ' + S('Q')]), { inS: 'R', notS: 'Q' }, '\\sqrt{' + n + '}', ['\\pi', '\\sqrt{3}', '-\\sqrt{10}'], ['\\sqrt{9}', '0.5', '1.414'],
            'Any irrational number, e.g. ' + t('\\sqrt{' + n + '}') + ' or ' + t('\\pi') + '.', ['A real number that isn’t rational is irrational: its decimal never ends and never repeats.', 'The square root of a number that isn’t a perfect square works.'], 'real not rational');
        } },
        { id: '6d', level: 'BEG', make: function (r) {
          var p = findPart(r.pick(['a whole number, but not a natural number', 'a number in ' + S('W') + ' but not in ' + S('N')]), { inS: 'W', notS: 'N', only: true }, '0', ['\\frac{0}{5}'], ['1', '-1', '\\frac{1}{2}'],
            'Only one number works: ' + t('0') + '. ' + t('W=\\{0,1,2,\\ldots\\}') + ' and ' + t('N=\\{1,2,3,\\ldots\\}') + ' differ only by ' + t('0') + '.', ['Compare ' + t('W=\\{0,1,2,3,\\ldots\\}') + ' with ' + t('N=\\{1,2,3,\\ldots\\}') + '.'], 'whole not natural');
          return p;
        } }] },
      { num: '7', stem: 'Complete each statement with <i>always</i>, <i>sometimes</i> or <i>never</i>.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var pr = r.chance(0.5) ? ['N', 'W'] : r.pick([['N', 'I'], ['W', 'I'], ['I', 'Q'], ['N', 'Q'], ['Q', 'R']]); return asnPart(r, setStmt(r, pr[0], pr[1]), setASN(pr[0], pr[1]), 'ASN ' + pr[0] + ' is ' + pr[1]); } },
        { id: '7b', level: 'EMG', make: function (r) { var pr = r.chance(0.5) ? ['Q', 'I'] : r.pick([['Q', 'W'], ['I', 'W'], ['R', 'Q'], ['I', 'N'], ['Q', 'N']]); return asnPart(r, setStmt(r, pr[0], pr[1]), setASN(pr[0], pr[1]), 'ASN ' + pr[0] + ' is ' + pr[1]); } },
        { id: '7c', level: 'BEG', make: function (r) {
          var a = r.int(2, 9), b = r.int(2, 9);
          var V = [['The sum of two integers is ___ an integer.', asnD('always', '', '', 'Adding integers always lands on an integer, e.g. ' + t('-' + a + '+' + b + '=' + (b - a)) + '.')],
            ['The product of two integers is ___ an integer.', asnD('always', '', '', 'Multiplying integers always gives an integer, e.g. ' + t('(-' + a + ')(' + b + ')=-' + a * b) + '.')],
            ['The difference of two integers is ___ an integer.', asnD('always', '', '', 'Subtracting integers always lands on an integer, e.g. ' + t(a + '-' + (a + b) + '=-' + b) + '.')],
            ['The sum of two whole numbers is ___ a whole number.', asnD('always', '', '', 'Adding whole numbers always gives a whole number, e.g. ' + t(a + '+' + b + '=' + (a + b)) + '.')]];
          var v = r.chance(0.5) ? V[0] : r.pick(V); return asnPart(r, v[0], v[1], 'ASN ' + v[0]);
        } },
        { id: '7d', level: 'EMG', make: function (r) {
          var k = r.int(2, 12), n = gen(r, function () { return r.int(2, 50); }, nonSq);
          var V = [['The square root of a whole number is ___ irrational.', asnD('sometimes', t('\\sqrt{' + n + '}') + ' is irrational.', t('\\sqrt{' + k * k + '}=' + k) + ' is rational.')],
            ['The square root of a natural number is ___ a natural number.', asnD('sometimes', t('\\sqrt{' + k * k + '}=' + k) + ' is natural.', t('\\sqrt{' + n + '}') + ' is irrational.')],
            ['The square root of a whole number is ___ rational.', asnD('sometimes', t('\\sqrt{' + k * k + '}=' + k) + ' is rational.', t('\\sqrt{' + n + '}') + ' is irrational.')]];
          var v = r.chance(0.5) ? V[0] : r.pick(V); return asnPart(r, v[0], v[1], 'ASN ' + v[0]);
        } },
        { id: '7e', level: 'BEG', make: function (r) { var pr = r.chance(0.5) ? ['W', 'N'] : r.pick([['I', 'W'], ['R', 'Qb'], ['I', 'N'], ['W', 'Qb'], ['N', 'Qb']]); return asnPart(r, setStmt(r, pr[0], pr[1]), setASN(pr[0], pr[1]), 'ASN ' + pr[0] + ' is ' + pr[1]); } }] },
      { num: '8', stem: 'Decide whether each statement is true or false.', parts: [
        { id: '8a', level: 'LIM', make: function (r) { var p = r.chance(0.5) ? ['N', 'W'] : r.pick(TRUE_PAIRS); return nestedPart(r, p[0], p[1], 'nested ' + p[0] + ' in ' + p[1]); } },
        { id: '8b', level: 'BEG', make: function (r) { var p = r.chance(0.5) ? ['Q', 'I'] : r.pick(REV_PAIRS); return nestedPart(r, p[0], p[1], 'nested ' + p[0] + ' in ' + p[1]); } },
        { id: '8c', level: 'LIM', make: function (r) { var p = r.chance(0.5) ? ['I', 'Q'] : r.pick(TRUE_PAIRS); return nestedPart(r, p[0], p[1], 'nested ' + p[0] + ' in ' + p[1]); } },
        { id: '8d', level: 'BEG', make: function (r) { var p = r.chance(0.5) ? ['Qb', 'Q'] : r.pick([['Q', 'Qb'], ['Qb', 'I'], ['Qb', 'W'], ['N', 'Qb'], ['I', 'Qb']]); return nestedPart(r, p[0], p[1], 'nested ' + p[0] + ' in ' + p[1]); } }] },

      /* ================= Part C — Ordering, Explaining, and Multiple Choice ================= */
      { num: '9', section: 'Part C — Ordering, Explaining, and Multiple Choice',
        stem: function (sh) { return 'Consider the numbers ' + sh.its.map(function (x) { return t(x.tex); }).join(',  ') + '.'; },
        shared: function (r) {
          for (var tries = 0; tries < 400; tries++) {
            var k = r.int(1, 3), a = r.int(1, 3), n = r.pick([2, 3, 5, 6, 7, 8, 10, 11]), d1 = r.int(1, 2), d2 = r.int(1, 9);
            var its = [
              { id: 'nd', tex: '-' + a + '.5', v: -(a + 0.5), vs: '-' + a + '.5' },
              { id: 'rt', tex: '\\sqrt{' + n + '}', v: Math.sqrt(n), vs: Math.sqrt(n).toFixed(2), approx: true, note: '(about ' + Math.sqrt(n).toFixed(1) + ')' },
              { id: 'z', tex: '0', v: 0, vs: '0' },
              { id: 'ns', tex: '-\\sqrt{' + k * k + '}', v: -k, vs: '-' + k, note: '(' + t('=-' + k) + ')' },
              { id: 'pd', tex: d1 + '.5', v: d1 + 0.5, vs: d1 + '.5' },
              { id: 'sd', tex: '0.' + d2, v: d2 / 10, vs: '0.' + d2 }];
            var vs = its.map(function (x) { return x.v; }).sort(function (x, y) { return x - y; }), okg = true;
            for (var i = 1; i < vs.length; i++) if (vs[i] - vs[i - 1] < 0.3) okg = false;
            if (okg && vs[5] < 3.6 && vs[0] > -3.6) return { its: r.shuffle(its) };
          }
          return { its: [{ id: 'nd', tex: '-2.5', v: -2.5, vs: '-2.5' }, { id: 'rt', tex: '\\sqrt{5}', v: Math.sqrt(5), vs: '2.24', approx: true }, { id: 'z', tex: '0', v: 0, vs: '0' }, { id: 'ns', tex: '-\\sqrt{9}', v: -3, vs: '-3' }, { id: 'pd', tex: '1.5', v: 1.5, vs: '1.5' }, { id: 'sd', tex: '0.3', v: 0.3, vs: '0.3' }] };
        },
        parts: [
          { id: '9a', level: 'PRG', make: function (r, sh) { return orderPart(r, sh.its, 'order 6 reals'); } },
          { id: '9b', level: 'EMG', make: function (r, sh) { return plotPart(sh.its, -4, 4, 'plot 6 reals'); } }] },
      { num: '10', stem: 'The difference between a rational number and an irrational number.', parts: [
        { id: '10a', level: 'BEG', make: function (r) {
          return P.mc(r, 'Which statement correctly describes the difference?', [
            { html: 'A rational number can be written as a fraction ' + t('\\frac{a}{b}') + ' of integers (' + t('b\\ne 0') + '); its decimal terminates or repeats. An irrational number can’t: its decimal never ends and never repeats.', right: true },
            { html: 'A rational number is positive; an irrational number is negative.', why: 'Sign has nothing to do with it: ' + t('-\\frac{1}{2}') + ' is rational and ' + t('\\sqrt{2}') + ' is irrational.' },
            { html: 'A rational number is a whole number; an irrational number is a fraction or a decimal.', why: t('\\frac{3}{4}') + ' and ' + t('0.75') + ' are rational too. The question is whether the decimal ends or repeats.' },
            { html: 'A rational number has no square root sign; an irrational number has one.', why: t('\\sqrt{16}=4') + ' has a root sign and is rational. Work out the number first.' }],
            'Rational: can be written ' + t('\\frac{a}{b}') + ' with ' + t('a, b') + ' integers, ' + t('b\\ne 0') + '; its decimal terminates or repeats (e.g. ' + t('\\frac{3}{4}=0.75') + ').<br>Irrational: its decimal never ends and never repeats (e.g. ' + t('\\sqrt{2}=1.414\\,21\\ldots') + ').', ['Think about what the decimal does in each case.'], 'rational vs irrational');
        } },
        { id: '10b', level: 'BEG', make: function (r) {
          var cR = findCheck({ inS: 'Q' }), cI = findCheck({ inS: 'Qb' });
          return P.fields('Give one example of each.', [{ name: 'Rational', label: 'A rational number:', mode: 'math', keys: 'expr', wide: true }, { name: 'Irrational', label: 'An irrational number:', mode: 'math', keys: 'expr', wide: true }],
            [cR, cI], ['\\frac{3}{4}', '\\sqrt{2}'], 'e.g. rational ' + t('\\frac{3}{4}') + '; irrational ' + t('\\sqrt{2}'),
            'Rational: any fraction of integers, integer, or terminating/repeating decimal, e.g. ' + t('\\frac{3}{4}') + ', ' + t('-5') + ', ' + t('0.\\overline{3}') + '.<br>Irrational: e.g. ' + t('\\sqrt{2}') + ', ' + t('\\sqrt{7}') + ', ' + t('\\pi') + '.', ['For the irrational one, use the ' + t('\\sqrt{\\ }') + ' key with a number that isn’t a perfect square, or ' + t('\\pi') + '.'], 'examples rational / irrational');
        } }] },
      { num: '11', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '11', level: 'BEG', make: function (r) {
          var k = r.int(3, 12), d = r.int(1, 9), n = gen(r, function () { return r.int(5, 60); }, nonSq), q = r.pick([4, 5, 8, 3, 7]), p = gen(r, function () { return r.int(1, q - 1); }, function (p) { return gcd(p, q) === 1; });
          return P.mc(r, 'Which of the following is an <b>irrational</b> number?', [
            { html: t('\\sqrt{' + k * k + '}'), why: t('\\sqrt{' + k * k + '}=' + k) + ', which is rational.' },
            { html: t('0.\\overline{' + d + '}'), why: 'It repeats, so it is rational: ' + t('0.\\overline{' + d + '}=' + ex.texRat(ex.norm(d, 9))) + '.' },
            { html: t('\\sqrt{' + n + '}'), right: true },
            { html: t('\\frac{' + p + '}{' + q + '}'), why: 'A fraction of integers is rational by definition.' }],
            t(n) + ' is not a perfect square, so ' + t('\\sqrt{' + n + '}') + ' is irrational. (' + t('\\sqrt{' + k * k + '}=' + k) + ', ' + t('0.\\overline{' + d + '}') + ' and ' + t('\\frac{' + p + '}{' + q + '}') + ' are all rational.)', ['Simplify each one. Which can’t be written as a fraction?'], 'MC which irrational', true);
        } }] },
      { num: '12', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '12', level: 'BEG', make: function (r) {
          var rep = r.chance(0.7), q = rep ? r.pick([12, 12, 6, 15, 3, 9, 11]) : r.pick([8, 16, 20, 25, 40]), p = gen(r, function () { return r.int(1, q - 1); }, function (p) { return gcd(p, q) === 1; });
          var dt = K.decTex([p, q]);
          var opts = [{ html: 'terminating and repeating', code: 'said-RT', why: 'That combination never happens: a decimal that stops can’t also repeat forever.' },
            { html: 'terminating and non-repeating', right: !rep, code: 'said-NT', why: rep ? 'Divide it out: ' + t(dt) + ' never stops.' : null },
            { html: 'non-terminating and repeating', right: rep, code: 'said-RN', why: rep ? null : 'Divide it out: ' + t(p + '\\div ' + q + '=' + dt) + ' stops.' },
            { html: 'non-terminating and non-repeating', code: 'said-NN', why: 'A fraction of integers is rational, so its decimal can’t be non-terminating <b>and</b> non-repeating.' }];
          return P.mc(r, 'The decimal form of ' + t('\\dfrac{' + p + '}{' + q + '}') + ' is', opts,
            t('\\frac{' + p + '}{' + q + '}=' + (rep ? (p / q).toFixed(5) + '\\ldots=' : '') + dt) + (rep ? ': it never stops, and the same digits keep repeating.' : ': it stops.'), ['Divide the top by the bottom. Does it stop? If not, does a block of digits repeat?'], 'decimal type of ' + p + '/' + q, true);
        } }] },
      { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '13', level: 'BEG', make: function (r) {
          var k = r.int(4, 9), n = gen(r, function () { return r.int(k * k + 1, (k + 1) * (k + 1) - 1); }, nonSq), m = r.int(2, 12), d = gen(r, function () { return r.int(11, 99); }, function (x) { return x % 10; });
          return P.mc(r, 'Which of the following is <b>not</b> rational?', [
            { html: t('\\sqrt{' + k * k + '}'), why: t('\\sqrt{' + k * k + '}=' + k) + ' — rational.' },
            { html: t('\\sqrt{' + n + '}'), right: true },
            { html: t('-' + m), why: 'Every integer is rational: ' + t('-' + m + '=\\frac{-' + m + '}{1}') + '.' },
            { html: t('0.' + d), why: 'It terminates: ' + t('0.' + d + '=\\frac{' + d + '}{100}') + ' — rational.' }],
            t(k * k + '<' + n + '<' + (k + 1) * (k + 1)) + ', so ' + t(n) + ' is not a perfect square and ' + t('\\sqrt{' + n + '}') + ' is irrational (not rational).', ['Which square root is of a number that isn’t a perfect square?'], 'MC not rational', true);
        } }] },
      { num: '14', stem: 'A Venn diagram of the real number system: the rectangle is ' + S('R') + ', split by a vertical line; nested ellipses on the left, ' + S('Qb') + ' on the right.' + vennSvg(), parts: [
        { id: '14a', level: 'BEG', make: function (r) {
          var inward = r.chance(0.5), chain = ['N', 'W', 'I', 'Q', 'R'], items = chain.map(function (x) { return { id: x, tex: SYM[x] }; });
          if (inward) items.reverse();
          return P.order(r, 'Label the left side: put the sets in order from the ' + (inward ? '<b>outermost</b> (the rectangle) to the <b>innermost</b> ellipse' : '<b>innermost</b> ellipse to the <b>outermost</b> (the rectangle)') + '.', items,
            { first: inward ? 'outermost' : 'innermost', last: inward ? 'innermost' : 'outermost', why: function (a, b) { var big = inward ? a : b, small = inward ? b : a; if (!sub(small, big)) { big = inward ? b : a; small = inward ? a : b; } return 'Every ' + NOUN[small] + ' is also ' + ONE[big] + ', so ' + S(small) + ' sits <b>inside</b> ' + S(big) + '.'; } },
            'From the inside out: ' + t('N\\subset W\\subset I\\subset Q\\subset R') + '. ' + S('W') + ' adds ' + t('0') + ' to ' + S('N') + ', ' + S('I') + ' adds the negatives, ' + S('Q') + ' adds the fractions, and ' + S('R') + ' adds the irrationals ' + S('Qb') + ' (the right side).',
            ['Start with the counting numbers ' + t('1, 2, 3, \\ldots') + ' — which set is that?', 'Each set contains everything in the one before it, plus more.'], 'Venn nesting order');
        } },
        { id: '14b', level: 'EMG', make: function (r) {
          var regs = ['N', 'W', 'I', 'Q', 'Qb'], lab = { N: 'In ' + S('N'), W: 'In ' + S('W') + ' but not ' + S('N'), I: 'In ' + S('I') + ' but not ' + S('W'), Q: 'In ' + S('Q') + ' but not ' + S('I'), Qb: 'In ' + S('Qb') };
          var checks = regs.map(function (g) {
            return function (resp) {
              var o = readReal(resp); if (o.res) return o.res;
              var k = SMALLEST[kindOf(o)];
              if (k === g) return ok();
              return wrong('u1l4-region', describe(o) + ' Its innermost region is ' + S(k) + ', not ' + S(g) + '. You need ' + (g === 'W' ? t('0') + ' (the only whole number that isn’t natural)' : g === 'I' ? 'a negative integer' : g === 'Q' ? 'a fraction or decimal that isn’t an integer' : TIP[g]) + '.');
            };
          });
          var p = P.fields('Write one example number for each region of the diagram. Each number must sit in that region and <b>not</b> in a smaller ellipse inside it.', regs.map(function (g) { return { name: lab[g].replace(/\\\(|\\\)/g, ''), label: lab[g] + ':', mode: 'math', keys: 'expr', wide: true }; }),
            checks, ['5', '0', '-3', '\\frac{1}{2}', '\\sqrt{2}'], t('N') + ': e.g. ' + t('5') + '; ' + t('W') + ' only: ' + t('0') + '; ' + t('I') + ' only: e.g. ' + t('-3') + '; ' + t('Q') + ' only: e.g. ' + t('\\frac{1}{2}') + '; ' + S('Qb') + ': e.g. ' + t('\\sqrt{2}'),
            'Innermost ellipse ' + S('N') + ': a counting number such as ' + t('5') + '. ' + S('W') + ' but not ' + S('N') + ': only ' + t('0') + '. ' + S('I') + ' but not ' + S('W') + ': a negative integer such as ' + t('-3') + '. ' + S('Q') + ' but not ' + S('I') + ': a fraction such as ' + t('\\frac{1}{2}') + ' or ' + t('0.75') + '. ' + S('Qb') + ': ' + t('\\sqrt{2}') + ', ' + t('\\pi') + ', … Every one of them is also in ' + S('R') + '.',
            ['Work from the inside out: counting number; then the one extra whole number; then a negative; then a fraction; then a number whose decimal never ends or repeats.'], 'example in each Venn region');
          p.good = [['12', '\\frac{0}{3}', '-1', '-2.5', '\\pi']];
          p.bad = [['0', '0', '-3', '\\frac{1}{2}', '\\sqrt{2}'], ['5', '0', '-3', '2', '\\sqrt{2}'], ['5', '0', '3', '\\frac{1}{2}', '\\sqrt{4}']];
          return p;
        } }] }
    ],

    extra: [
      /* ================= Extra practice A — Evaluate first, then classify ================= */
      { num: '1', section: 'Extra practice A — Evaluate First, Then Classify', stem: 'Evaluate each expression <b>first</b>, then check every set the result belongs to.', parts: [
        { id: 'e1a', level: 'BEG', make: function (r) { return memberPart(sqrtPerfect(r.int(2, 15))); } },
        { id: 'e1b', level: 'BEG', make: function (r) { return memberPart(negSqrt(r.int(2, 15))); } },
        { id: 'e1c', level: 'BEG', make: function (r) { var q = r.int(2, 9), k = r.int(2, 9), tx = '\\frac{' + k * q + '}{' + q + '}'; return memberPart(item(tx, 'nat', t(tx + '=' + k) + ', a counting number.', { whyRat: t(tx + '=' + k) + ', an integer — rational.' })); } },
        { id: 'e1d', level: 'EMG', make: function (r) { return memberPart(decSqItem(gen(r, function () { return r.int(1, 19); }, function (k) { return k % 10 !== 0; }))); } }] },
      { num: '2', stem: 'Evaluate or simplify each one as far as you can, then check every set it belongs to. (' + t('\\sqrt[3]{-27}') + ' means the number that multiplies by itself <i>three</i> times to give ' + t('-27') + '.)', parts: [
        { id: 'e2a', level: 'EMG', make: function (r) { return memberPart(cbrtNeg(r.int(2, 5))); } },
        { id: 'e2b', level: 'EMG', make: function (r) { var k = r.int(1, 5), tx = '\\frac{' + (k > 1 ? k : '') + '\\pi}{\\pi}'; return memberPart(item(tx, 'nat', 'The ' + t('\\pi') + '’s cancel: ' + t(tx + '=' + k) + ', a counting number.', { whyRat: 'Simplify first: the ' + t('\\pi') + '’s cancel and leave ' + t(k) + ' — rational.' })); } },
        { id: 'e2c', level: 'BEG', make: function (r) { return memberPart(repItem(rep2(r))); } },
        { id: 'e2d', level: 'BEG', make: function (r) { var n = r.pick([2, 3, 5, 6, 7, 10, 11]) * r.pick([4, 9, 16]); return memberPart(sqrtIrr(n)); } },
        { id: 'e2e', level: 'BEG', make: function (r) { var q = r.int(2, 9), k = r.int(2, 9), tx = '-\\frac{' + k * q + '}{' + q + '}'; return memberPart(item(tx, 'negint', t(tx + '=-' + k) + ', a negative integer.', { neg: true, whyRat: t(tx + '=-' + k) + ', an integer — rational.' })); } }] },
      { num: '3', stem: 'Complete the table.', parts: [
        { id: 'e3a', sub: 'left column', level: 'EMG', make: function (r) {
          var k = r.int(6, 12), q = r.int(2, 9), m = r.int(2, 9), a = r.pick([2, 3, 5, 7]), x = r.pick(['\\pi', '\\sqrt{2}', '\\sqrt{5}']);
          return memberTable([sqrtPerfect(k), item('-\\frac{' + m * q + '}{' + q + '}', 'negint', t('-\\frac{' + m * q + '}{' + q + '}=-' + m) + ', a negative integer.', { neg: true, whyRat: t('-\\frac{' + m * q + '}{' + q + '}=-' + m) + ' — rational.' }),
            item('\\sqrt{' + a + '}\\times\\sqrt{' + a + '}', 'nat', t('\\sqrt{' + a + '}\\times\\sqrt{' + a + '}=' + a) + ', a counting number.', { whyRat: t('\\sqrt{' + a + '}\\times\\sqrt{' + a + '}=' + a) + ' — rational, even though each factor is irrational.' }),
            item(x + '-' + x, 'zero', t(x + '-' + x + '=0') + ': whole, but not natural.', { whyRat: t(x + '-' + x + '=0') + ' — rational.' })], 'Evaluate each expression <b>first</b>, then check every set the result belongs to.', 'evaluate-first table 1');
        } },
        { id: 'e3b', sub: 'right column', level: 'PRG', make: function (r) {
          var c = r.int(2, 5), n = gen(r, function () { return r.int(2, 20); }, nonSq);
          return memberTable([piItem(c + '\\pi'), decSqItem(r.int(1, 9)), negSqrtIrr(n), fracItem(22, 7, false)], 'Evaluate each expression <b>first</b>, then check every set the result belongs to.', 'evaluate-first table 2');
        } }] },
      { num: '4', stem: function (sh) { return 'Consider ' + sh.list.map(function (n) { return t('\\sqrt{' + n + '}'); }).join(',  ') + '.'; },
        shared: function (r) {
          var sq = r.sample([7, 8, 9, 10, 11, 12, 13, 14, 15], 3).map(function (k) { return k * k; });
          var non = []; while (non.length < 3) { var n = r.pick([40, 45, 50, 60, 72, 80, 90, 120, 125, 150, 160, 200, 180, 250]); if (non.indexOf(n) < 0) non.push(n); }
          return { list: sq.concat(non).sort(function (a, b) { return a - b; }), sq: sq };
        },
        parts: [
          { id: 'e4a', level: 'BEG', make: function (r, sh) {
            var check = K.selectSet(sh.sq, function (extra, missing) {
              if (extra.length) return { code: 'irr-as-rat', hint: t(extra[0]) + ' is not a perfect square (' + t(Math.floor(Math.sqrt(extra[0])) + '^{2}=' + Math.pow(Math.floor(Math.sqrt(extra[0])), 2)) + ', ' + t(Math.ceil(Math.sqrt(extra[0])) + '^{2}=' + Math.pow(Math.ceil(Math.sqrt(extra[0])), 2)) + '), so ' + t('\\sqrt{' + extra[0] + '}') + ' is irrational.' };
              return { code: 'rat-as-irr', hint: t(missing[0] + '=' + Math.sqrt(missing[0]) + '\\times ' + Math.sqrt(missing[0])) + ', so ' + t('\\sqrt{' + missing[0] + '}=' + Math.sqrt(missing[0])) + ' is rational.' };
            });
            return { prompt: 'Select the square roots that are <b>rational</b>.', input: { type: 'select', options: sh.list.map(function (n) { return { value: n, html: t('\\sqrt{' + n + '}') }; }) }, check: check, key: sh.sq,
              answer: sh.sq.map(function (n) { return t('\\sqrt{' + n + '}=' + Math.sqrt(n)); }).join(', '), solution: 'Rational: ' + sh.sq.map(function (n) { return t('\\sqrt{' + n + '}=' + Math.sqrt(n)); }).join(', ') + '. The others are irrational: their radicands aren’t perfect squares.',
              hints: ['Which of the numbers under the roots are perfect squares (' + t('49, 64, 81, 100, 121, 144, 169, \\ldots') + ')?'], text: 'rational roots among ' + sh.list.join(', '), bad: [sh.list.filter(function (n) { return sh.sq.indexOf(n) < 0; })] };
          } },
          { id: 'e4b', level: 'BEG', make: function (r) {
            return P.mc(r, 'Which test did you use?', [
              { html: t('\\sqrt{a}') + ' is rational exactly when ' + t('a') + ' is a perfect square.', right: true },
              { html: t('\\sqrt{a}') + ' is rational exactly when ' + t('a') + ' is even.', why: t('\\sqrt{8}') + ' is irrational and ' + t('\\sqrt{9}=3') + ' is rational. Even/odd isn’t the test.' },
              { html: t('\\sqrt{a}') + ' is rational exactly when ' + t('a') + ' is less than ' + t('100') + '.', why: t('\\sqrt{121}=11') + ' is rational and ' + t('\\sqrt{50}') + ' isn’t. Size isn’t the test.' },
              { html: t('\\sqrt{a}') + ' is rational exactly when ' + t('a') + ' ends in ' + t('0') + ' or ' + t('5') + '.', why: t('\\sqrt{45}') + ' is irrational and ' + t('\\sqrt{64}=8') + ' is rational.' }],
              'A square root is rational exactly when the radicand is a perfect square: then the root is a whole number.', ['What do ' + t('64') + ', ' + t('121') + ' and ' + t('169') + ' have in common?'], 'test for rational root');
          } }] },

      /* ================= Extra practice B — Always, Sometimes, Never ================= */
      { num: '5', section: 'Extra practice B — Always, Sometimes, Never', stem: 'Complete each statement with <i>always</i>, <i>sometimes</i> or <i>never</i>. (For <i>sometimes</i>, think of one example that works and one that doesn’t.)', parts: [
        { id: 'e5a', level: 'PRG', make: function (r) {
          var a = r.pick([2, 3, 5, 7]), b = r.pick([2, 3, 5, 7].filter(function (x) { return x !== a; }));
          var V = [['The sum of two irrational numbers is ___ irrational.', asnD('sometimes', t('\\sqrt{' + a + '}+\\sqrt{' + b + '}') + ' is irrational.', t('\\sqrt{' + a + '}+(-\\sqrt{' + a + '})=0') + ' is rational.')],
            ['The product of two irrational numbers is ___ irrational.', asnD('sometimes', t('\\sqrt{' + a + '}\\times\\sqrt{' + b + '}=\\sqrt{' + a * b + '}') + ' is irrational.', t('\\sqrt{' + a + '}\\times\\sqrt{' + a + '}=' + a) + ' is rational.')]];
          var v = r.chance(0.6) ? V[0] : V[1]; return asnPart(r, v[0], v[1], 'ASN ' + v[0]);
        } },
        { id: 'e5b', level: 'EMG', make: function (r) {
          var V = [['The product of two rational numbers is ___ rational.', asnD('always', '', '', t('\\frac{a}{b}\\times\\frac{c}{d}=\\frac{ac}{bd}') + ' is still a fraction of integers.')],
            ['The sum of two rational numbers is ___ rational.', asnD('always', '', '', t('\\frac{a}{b}+\\frac{c}{d}=\\frac{ad+bc}{bd}') + ' is still a fraction of integers.')],
            ['The difference of two rational numbers is ___ rational.', asnD('always', '', '', t('\\frac{a}{b}-\\frac{c}{d}=\\frac{ad-bc}{bd}') + ' is still a fraction of integers.')]];
          var v = r.chance(0.5) ? V[0] : r.pick(V); return asnPart(r, v[0], v[1], 'ASN ' + v[0]);
        } },
        { id: 'e5c', level: 'BEG', make: function (r) { var pr = r.chance(0.5) ? ['I', 'N'] : r.pick([['I', 'W'], ['Q', 'I'], ['R', 'Qb'], ['W', 'N'], ['R', 'I']]); return asnPart(r, setStmt(r, pr[0], pr[1]), setASN(pr[0], pr[1]), 'ASN ' + pr[0] + ' is ' + pr[1]); } },
        { id: 'e5d', level: 'BEG', make: function (r) {
          var b = rep2(r), d = r.int(1, 8);
          var V = [['A repeating decimal is ___ rational.', asnD('always', '', '', 'Every repeating decimal can be written as a fraction, e.g. ' + t('0.\\overline{' + b + '}=' + ex.texRat(ex.norm(Number(b), 99))) + '.')],
            ['A terminating decimal is ___ rational.', asnD('always', '', '', 'Every terminating decimal is a fraction over ' + t('10, 100, \\ldots') + ', e.g. ' + t('0.' + d + '=\\frac{' + d + '}{10}') + '.')],
            ['A repeating decimal is ___ irrational.', asnD('never', '', '', 'Every repeating decimal is rational, e.g. ' + t('0.\\overline{' + b + '}=' + ex.texRat(ex.norm(Number(b), 99))) + '.')]];
          var v = r.chance(0.5) ? V[0] : r.pick(V); return asnPart(r, v[0], v[1], 'ASN ' + v[0]);
        } },
        { id: 'e5e', level: 'BEG', make: function (r) {
          var k = r.int(2, 12), n = gen(r, function () { return r.int(2, 50); }, nonSq);
          return asnPart(r, 'The square root of a natural number is ___ irrational.', asnD('sometimes', t('\\sqrt{' + n + '}') + ' is irrational.', t('\\sqrt{' + k * k + '}=' + k) + ' is rational.'), 'ASN sqrt natural irrational');
        } },
        { id: 'e5f', level: 'EMG', make: function (r) {
          var a = r.int(2, 9), b = r.int(a + 1, 15);
          var V = [['The difference of two integers is ___ a whole number.', asnD('sometimes', t(b + '-' + a + '=' + (b - a)) + ' is whole.', t(a + '-' + b + '=-' + (b - a)) + ' is not.')],
            ['The difference of two whole numbers is ___ a whole number.', asnD('sometimes', t(b + '-' + a + '=' + (b - a)) + ' is whole.', t(a + '-' + b + '=-' + (b - a)) + ' is not.')],
            ['The difference of two natural numbers is ___ a natural number.', asnD('sometimes', t(b + '-' + a + '=' + (b - a)) + ' is natural.', t(a + '-' + a + '=0') + ' is not.')]];
          var v = r.chance(0.5) ? V[0] : r.pick(V); return asnPart(r, v[0], v[1], 'ASN ' + v[0]);
        } }] },
      { num: '6', stem: 'Complete each statement with <i>always</i>, <i>sometimes</i> or <i>never</i>. Read (b) and (c) very carefully.', parts: [
        { id: 'e6a', level: 'EMG', make: function (r) {
          var V = [['A real number that is not rational is ___ irrational.', asnD('always', '', '', S('R') + ' is made up of ' + S('Q') + ' and ' + S('Qb') + ' only, so a real number that isn’t rational must be irrational.')],
            ['A real number that is not irrational is ___ rational.', asnD('always', '', '', S('R') + ' is made up of ' + S('Q') + ' and ' + S('Qb') + ' only.')],
            ['A real number is ___ both rational and irrational.', asnD('never', '', '', S('Q') + ' and ' + S('Qb') + ' have no members in common.')]];
          var v = r.chance(0.5) ? V[0] : r.pick(V); return asnPart(r, v[0], v[1], 'ASN ' + v[0]);
        } },
        { id: 'e6b', level: 'PRG', make: function (r) {
          var k = r.int(2, 9), n = r.pick([2, 3, 5, 7]);
          return asnPart(r, 'The product of a rational number and an irrational number is ___ irrational.', asnD('sometimes', t(k + '\\times\\sqrt{' + n + '}=' + k + '\\sqrt{' + n + '}') + ' is irrational.', t('0\\times\\sqrt{' + n + '}=0') + ' is rational (zero is the catch).'), 'ASN rational times irrational');
        } },
        { id: 'e6c', level: 'PRG', make: function (r) {
          var d = r.int(1, 8);
          return asnPart(r, 'A number whose decimal never ends is ___ irrational.', asnD('sometimes', t('\\pi=3.141\\,59\\ldots') + ' never ends and is irrational.', t(ex.texRat(ex.norm(d, 9)) + '=0.\\overline{' + d + '}') + ' never ends, but it repeats — rational.'), 'ASN never-ending decimal irrational');
        } },
        { id: 'e6d', level: 'EMG', make: function (r) {
          var a = r.int(2, 6), b = r.int(2, 6), c = gen(r, function () { return r.int(2, 9); }, function (c) { return c > a && c % a; });
          return asnPart(r, 'The quotient of two natural numbers is ___ a natural number.', asnD('sometimes', t(a * b + '\\div ' + b + '=' + a) + ' is natural.', t(a + '\\div ' + c + '=\\frac{' + a + '}{' + c + '}') + ' is not.'), 'ASN quotient of naturals');
        } }] },
      { num: '7', stem: 'A set is <b>closed</b> under an operation if combining any two members of the set always gives an answer that is still in the set. One counterexample is enough to show a set is <b>not</b> closed.', parts: [
        { id: 'e7a', level: 'EMG', make: function (r) { return closedPart(r, r.chance(0.6) ? 'I' : 'N', '÷'); } },
        { id: 'e7b', level: 'EMG', make: function (r) { return closedPart(r, r.chance(0.6) ? 'W' : 'N', '−'); } },
        { id: 'e7c', level: 'PRG', make: function (r) { return closedPart(r, r.chance(0.5) ? 'Q' : r.pick(['Q', 'I']), r.pick(['×', '×', '+', '−'])); } },
        { id: 'e7d', level: 'PRG', make: function (r) { return closedPart(r, 'Qb', r.chance(0.6) ? '+' : '×'); } }] },
      { num: '8', stem: '<b>Error analysis.</b> Devon says, “Every decimal number is rational, because a decimal is just a fraction written a different way.”', parts: [
        { id: 'e8a', level: 'EMG', make: function (r) {
          return P.mc(r, 'What is true about Devon’s statement, and what is false?', [
            { html: 'True for decimals that terminate or repeat — they can be written as fractions. False for decimals that never end and never repeat, like ' + t('\\pi') + '.', right: true },
            { html: 'It is completely true: every decimal can be written as a fraction.', why: 'Can ' + t('\\pi=3.141\\,59\\ldots') + ' be written as a fraction of integers?' },
            { html: 'It is completely false: no decimal is rational.', why: t('0.75=\\frac{3}{4}') + ' is rational.' },
            { html: 'True for repeating decimals only; terminating decimals are irrational.', why: t('0.75=\\frac{3}{4}') + ' terminates and is rational.' }],
            '<b>True part:</b> a decimal that terminates or repeats can be written as a fraction, so it is rational.<br><b>False part:</b> a decimal that never ends and never repeats (like ' + t('\\pi') + ' or ' + t('0.101\\,001\\,000\\,1\\ldots') + ') is irrational.', ['Which kinds of decimals can be written as fractions?'], 'Devon every decimal rational');
        } },
        { id: 'e8b', level: 'BEG', make: function (r) {
          return findPart('Give a counterexample to Devon’s statement: a real number whose decimal is <b>not</b> rational. (Type the exact number, using ' + t('\\sqrt{\\ }') + ' or ' + t('\\pi') + '.)', { inS: 'R', notS: 'Q' }, '\\pi', ['\\sqrt{2}', '-\\sqrt{7}'], ['3.14', '\\frac{22}{7}', '0.\\overline{3}'],
            t('\\pi=3.141\\,59\\ldots') + ' (or ' + t('\\sqrt{2}=1.414\\,21\\ldots') + '): its decimal never ends and never repeats, so it can’t be written as a fraction.', ['Think of a number whose decimal goes on forever without repeating.'], 'counterexample to Devon');
        } }] },
      { num: '9', stem: function (sh) { return 'Maya notices that ' + t('\\sqrt{' + sh.a + '}') + ' is irrational, so she expects ' + t('\\sqrt{' + sh.a + '}\\times\\sqrt{' + sh.a + '}') + ' to be irrational too.'; },
        shared: function (r) { return { a: r.pick([5, 2, 3, 6, 7, 10, 11, 13, 14, 15]) }; },
        parts: [
          { id: 'e9a', level: 'BEG', make: function (r, sh) {
            return P.number('Evaluate ' + t('\\sqrt{' + sh.a + '}\\times\\sqrt{' + sh.a + '}') + '.', sh.a, function (v) { return v === sh.a * sh.a ? { code: 'value', hint: 'The square root of a number times itself gives back the number: which number has ' + t('\\sqrt{' + sh.a + '}') + ' as its square root?' } : null; },
              t('\\sqrt{' + sh.a + '}\\times\\sqrt{' + sh.a + '}=' + sh.a) + ': ' + t('\\sqrt{' + sh.a + '}') + ' is the number that multiplies by itself to give ' + t(sh.a) + '. That is rational.', ['What does ' + t('\\sqrt{' + sh.a + '}') + ' times itself give, by the definition of a square root?'], 'sqrt' + sh.a + ' times itself', { before: t('\\sqrt{' + sh.a + '}\\times\\sqrt{' + sh.a + '}=') });
          } },
          { id: 'e9b', level: 'EMG', make: function (r) {
            return P.mc(r, 'Is ' + t('\\sqrt{a}\\times\\sqrt{a}') + ' rational for <b>every</b> whole number ' + t('a') + '?', [
              { html: 'Yes: ' + t('\\sqrt{a}\\times\\sqrt{a}=a') + ', and every whole number is rational.', right: true },
              { html: 'No: it is rational only when ' + t('a') + ' is a perfect square.', why: 'Try ' + t('a=5') + ': ' + t('\\sqrt{5}\\times\\sqrt{5}=5') + ', which is rational — and ' + t('5') + ' isn’t a perfect square.' },
              { html: 'No: an irrational number times an irrational number is always irrational.', why: t('\\sqrt{5}\\times\\sqrt{5}=5') + ' is a counterexample.' },
              { html: 'Yes, but only when ' + t('a') + ' is even.', why: t('\\sqrt{5}\\times\\sqrt{5}=5') + ' works and ' + t('5') + ' is odd.' }],
              t('\\sqrt{a}\\times\\sqrt{a}=a') + ' for every whole number ' + t('a') + ' (that is what a square root means), and every whole number is rational. So the product is <b>always</b> rational.', ['What is ' + t('\\sqrt{a}\\times\\sqrt{a}') + ' for any ' + t('a') + '?'], 'sqrt a times sqrt a always rational');
          } }] },
      { num: '10', stem: '<b>Stretch.</b> Can an irrational number be raised to a whole-number power and give a <b>rational</b> answer?', parts: [
        { id: 'e10', level: 'MAS', make: function (r) {
          var hint0 = r.pick([2, 3, 5]);
          var cBase = function (resp) {
            var o = readReal(resp); if (o.res) return o.res;
            if (o.rational) return wrong('u1l4-not-irr-base', describe(o) + ' The base has to be <b>irrational</b>.');
            return ok();
          };
          var cExp = function (resp) {
            var p = HW.parse.number(resp); if (!p.ok) return form('empty', 'Type a whole number for the power.');
            if (!(p.value >= 1) || p.value % 1) return wrong('u1l4-not-whole-exp', 'The power has to be a whole number like ' + t('2') + ' or ' + t('3') + '.');
            return ok();
          };
          var check = function (resp) {
            resp = resp || [];
            var b = cBase(resp[0] == null ? '' : resp[0]); if (b.v !== 'correct') return { v: b.v, code: b.code, hint: '<b>Irrational number:</b> ' + b.hint };
            var e = cExp(resp[1] == null ? '' : resp[1]); if (e.v !== 'correct') return { v: e.v, code: e.code, hint: '<b>Power:</b> ' + e.hint };
            var o = readReal(resp[0]), n = HW.parse.number(resp[1]).value, pw = Math.pow(o.v, n);
            if (n > 12 || !isFinite(pw)) return wrong('u1l4-power-irr', 'Keep the power small (2, 3, 4, …).');
            var rat = null; for (var q = 1; q <= 1000 && rat == null; q++) { var p = Math.round(pw * q); if (Math.abs(pw * q - p) < 1e-8 * q * Math.max(1, Math.abs(pw))) rat = [p, q]; }
            var a3 = readReal(resp[2] == null ? '' : resp[2]);
            if (!rat) return wrong('u1l4-power-irr', 'Your power works out to about ' + t(pw.toFixed(4)) + '…, which is still irrational. Try a square root raised to the power ' + t('2') + ', or a cube root raised to the power ' + t('3') + '.');
            if (a3.res) return { v: a3.res.v, code: a3.res.code, hint: '<b>Result:</b> ' + (a3.res.hint || 'type the value of the power.') };
            if (Math.abs(a3.v - rat[0] / rat[1]) > 1e-9) return wrong('u1l4-power-value', '<b>Result:</b> work out the power again. Remember ' + t('\\left(\\sqrt{a}\\right)^{2}=\\sqrt{a}\\times\\sqrt{a}=a') + '.');
            return ok();
          };
          return { prompt: 'Show that it can: give an irrational number, a whole-number power, and the (rational) result.', input: { type: 'fields', fields: [{ name: 'Irrational number', label: 'Irrational number:', mode: 'math', keys: 'expr', wide: true }, { name: 'Power', label: 'Whole-number power:' }, { name: 'Result', label: 'Result (rational):', mode: 'math', keys: 'expr', wide: true }] },
            check: check, key: ['\\sqrt{' + hint0 + '}', '2', String(hint0)], good: [['\\sqrt[3]{5}', '3', '5'], ['-\\sqrt{7}', '2', '7'], ['\\sqrt{2}', '4', '4']], bad: [['\\pi', '2', '9.87'], ['\\sqrt{2}', '3', '2'], ['\\sqrt{4}', '2', '4'], ['\\sqrt{2}', '2', '4']],
            answer: 'Yes, e.g. ' + t('\\left(\\sqrt{' + hint0 + '}\\right)^{2}=' + hint0), solution: '<b>Yes.</b> For example ' + t('\\left(\\sqrt{' + hint0 + '}\\right)^{2}=\\sqrt{' + hint0 + '}\\times\\sqrt{' + hint0 + '}=' + hint0) + ': the base ' + t('\\sqrt{' + hint0 + '}') + ' is irrational, but the answer ' + t(hint0) + ' is rational. (Also ' + t('\\left(\\sqrt[3]{5}\\right)^{3}=5') + '.) Not every power works: ' + t('\\pi^{2}') + ' is still irrational.',
            hints: ['Think about what a square root does: ' + t('\\sqrt{a}\\times\\sqrt{a}=?'), 'Pick a square root of a number that isn’t a perfect square.'], text: 'irrational to a power, rational result' };
        } }] },

      /* ================= Extra practice C — Between-ness, ordering, MC ================= */
      { num: '11', section: 'Extra practice C — Between-ness, Ordering, and Multiple Choice', stem: 'Answer each. For (a) and (b), evaluate the endpoints first.',
        shared: function (r) { return { k: r.int(2, 9), a: r.pick([2, 3, 5, 6, 7, 10, 11, 12, 13]) }; },
        parts: [
          { id: 'e11a', level: 'EMG', make: function (r, sh) {
            var k = sh.k, key = k + '.5';
            return findPart('Name one <b>rational</b> number between ' + t('\\sqrt{' + k * k + '}') + ' and ' + t('\\sqrt{' + (k + 1) * (k + 1) + '}') + '.', { inS: 'Q', between: [k, k + 1], btex: ['\\sqrt{' + k * k + '}=' + k, '\\sqrt{' + (k + 1) * (k + 1) + '}=' + (k + 1)], rangeTip: ' Evaluate the endpoints first.' }, key, ['\\frac{' + (2 * k + 1) + '}{2}', k + '.25'], [String(k), String(k + 1), '\\sqrt{' + (k * k + 1) + '}'],
              t('\\sqrt{' + k * k + '}=' + k) + ' and ' + t('\\sqrt{' + (k + 1) * (k + 1) + '}=' + (k + 1)) + ', so any terminating decimal between them works, e.g. ' + t(key) + ' or ' + t('\\frac{' + (2 * k + 1) + '}{2}') + '.', ['Work out both square roots first. They are whole numbers.', 'A terminating decimal between them is rational.'], 'rational between sqrt k^2 and sqrt (k+1)^2');
          } },
          { id: 'e11b', level: 'PRG', make: function (r, sh) {
            var k = sh.k, n = k * k + r.int(1, 2 * k), key = '\\sqrt{' + n + '}';
            return findPart('Name one <b>irrational</b> number between ' + t('\\sqrt{' + k * k + '}') + ' and ' + t('\\sqrt{' + (k + 1) * (k + 1) + '}') + '.', { inS: 'Qb', between: [k, k + 1], btex: ['\\sqrt{' + k * k + '}=' + k, '\\sqrt{' + (k + 1) * (k + 1) + '}=' + (k + 1)], rangeTip: ' Use the square root of a number between ' + t(k * k) + ' and ' + t((k + 1) * (k + 1)) + '.' }, key, ['\\sqrt{' + (k * k + 1) + '}', k + '+\\frac{\\pi}{10}'], [k + '.5', '\\sqrt{' + (k + 2) * (k + 2) + '}', '\\sqrt{' + (k - 1) * (k - 1) + '}'],
              t('\\sqrt{' + k * k + '}=' + k) + ' and ' + t('\\sqrt{' + (k + 1) * (k + 1) + '}=' + (k + 1)) + '. The square root of any number between ' + t(k * k) + ' and ' + t((k + 1) * (k + 1)) + ' is irrational and lies between them, e.g. ' + t(key + '\\approx ' + Math.sqrt(n).toFixed(2)) + '.', ['The square root of a number between ' + t(k * k) + ' and ' + t((k + 1) * (k + 1)) + ' is between ' + t(k) + ' and ' + t(k + 1) + '.'], 'irrational between sqrt k^2 and sqrt (k+1)^2');
          } },
          { id: 'e11c', level: 'PRG', make: function (r, sh) {
            var a = sh.a, lo = Math.sqrt(a), hi = Math.sqrt(a + 1), key = null;
            for (var dp = 1; dp < 4 && key == null; dp++) { var f = Math.pow(10, dp), c = Math.floor(lo * f) + 1; if (c / f < hi) key = (c / f).toFixed(dp); }
            if (isSq(a + 1)) { hi = Math.sqrt(a + 1); }
            return findPart('Name one <b>rational</b> number between ' + t('\\sqrt{' + a + '}') + ' and ' + t('\\sqrt{' + (a + 1) + '}') + '.', { inS: 'Q', between: [lo, hi], btex: ['\\sqrt{' + a + '}\\approx ' + lo.toFixed(2), '\\sqrt{' + (a + 1) + '}' + (isSq(a + 1) ? '=' + hi : '\\approx ' + hi.toFixed(2))], rangeTip: ' Square your number: the result must be between ' + t(a) + ' and ' + t(a + 1) + '.' }, key, [], [lo.toFixed(1) === key ? String(Math.floor(lo)) : lo.toFixed(1), '\\sqrt{' + a + '}'],
              t('\\sqrt{' + a + '}\\approx ' + lo.toFixed(3)) + ' and ' + t('\\sqrt{' + (a + 1) + '}' + (isSq(a + 1) ? '=' + hi : '\\approx ' + hi.toFixed(3))) + ', so e.g. ' + t(key) + ' works (check: ' + t(key + '^{2}=' + dec(Number(key) * Number(key))) + ', which is between ' + t(a) + ' and ' + t(a + 1) + ').',
              ['Square a decimal to test it: ' + t('x') + ' is between ' + t('\\sqrt{' + a + '}') + ' and ' + t('\\sqrt{' + (a + 1) + '}') + ' when ' + t('x^{2}') + ' is between ' + t(a) + ' and ' + t(a + 1) + '.'], 'rational between sqrt' + a + ' and sqrt' + (a + 1));
          } }] },
      { num: '12', stem: function (sh) { return 'Consider ' + sh.its.map(function (x) { return t(x.tex); }).join(',  ') + '.'; },
        shared: function (r) {
          for (var tries = 0; tries < 600; tries++) {
            var hf = r.pick([5, 7, 3]), k = r.int(1, 3), n = r.pick([10, 11, 12, 13, 14, 15]), d = r.int(21, 29), f = r.pick([14, 16, 17, 18, 19]), rd = r.int(1, 8);
            if (d % 10 === 0) continue;
            var its = [
              { id: 'h', tex: '-\\dfrac{' + hf + '}{2}', v: -hf / 2, vs: '-' + (hf / 2) },
              { id: 'r', tex: '\\sqrt{' + n + '}', v: Math.sqrt(n), vs: Math.sqrt(n).toFixed(3), approx: true },
              { id: 'p', tex: '\\pi', v: Math.PI, vs: '3.142', approx: true },
              { id: 's', tex: '-\\sqrt{' + k * k + '}', v: -k, vs: '-' + k },
              { id: 'd', tex: (d / 10).toFixed(1), v: d / 10, vs: (d / 10).toFixed(1) },
              { id: 'f', tex: '\\dfrac{' + f + '}{5}', v: f / 5, vs: String(f / 5) },
              { id: 'q', tex: '0.\\overline{' + rd + '}', v: rd / 9, vs: (rd / 9).toFixed(3), approx: true }];
            var vs = its.map(function (x) { return x.v; }).sort(function (x, y) { return x - y; }), okg = true;
            for (var i = 1; i < vs.length; i++) if (vs[i] - vs[i - 1] < 0.015) okg = false;
            if (okg && vs[6] < 3.95) return { its: r.shuffle(its) };
          }
          return null;
        },
        parts: [
          { id: 'e12a', level: 'PRG', make: function (r, sh) { return orderPart(r, sh.its, 'order 7 reals'); } },
          { id: 'e12b', level: 'PRG', make: function (r, sh) { return plotPart(sh.its, -4, 4, 'plot 7 reals', 0.3); } }] },
      { num: '13', stem: 'For each description, give one number that fits, <b>or</b> choose the reason it is impossible.', parts: [
        { id: 'e13a', level: 'EMG', make: function (r) {
          return P.mc(r, 'An irrational number that is also an integer.', [
            { html: '<b>Impossible:</b> every integer is rational, so no integer is irrational.', right: true },
            { html: t('\\sqrt{4}') + ' — it has a root sign and it is an integer.', why: t('\\sqrt{4}=2') + ' is rational. A root sign doesn’t make a number irrational.' },
            { html: t('-\\sqrt{2}') + ' — it is negative, like many integers.', why: t('-\\sqrt{2}\\approx -1.414') + ' is not an integer.' },
            { html: t('\\pi') + ' — it is about ' + t('3') + '.', why: t('\\pi') + ' is about ' + t('3.14') + ', which is not an integer.' }],
            '<b>Impossible.</b> Every integer ' + t('n') + ' can be written ' + t('\\frac{n}{1}') + ', so every integer is rational, and ' + S('Q') + ' and ' + S('Qb') + ' have no members in common.', ['Is every integer rational?'], 'irrational integer impossible');
        } },
        { id: 'e13b', level: 'BEG', make: function (r) {
          return findPart('A whole number that is not a natural number.', { inS: 'W', notS: 'N', only: true }, '0', ['\\frac{0}{7}'], ['1', '-1'], t('0') + ' — the only one.', ['Compare ' + t('W=\\{0,1,2,\\ldots\\}') + ' and ' + t('N=\\{1,2,3,\\ldots\\}') + '.'], 'whole not natural (EP)');
        } },
        { id: 'e13c', level: 'EMG', make: function (r) {
          return P.mc(r, 'A real number that is neither rational nor irrational.', [
            { html: '<b>Impossible:</b> every real number is either rational or irrational.', right: true },
            { html: t('0') + ' — it is neither positive nor negative.', why: t('0=\\frac{0}{1}') + ' is rational.' },
            { html: t('\\sqrt{-4}') + '.', why: t('\\sqrt{-4}') + ' isn’t a real number at all (no real number squares to ' + t('-4') + ').' },
            { html: t('0.\\overline{9}') + ' — it never ends.', why: 'It repeats, so it is rational (it equals ' + t('1') + ').' }],
            '<b>Impossible.</b> ' + S('R') + ' is made up of ' + S('Q') + ' and ' + S('Qb') + ' only: a real number’s decimal either terminates/repeats (rational) or it doesn’t (irrational).', ['What two sets make up ' + S('R') + '?'], 'neither rational nor irrational impossible');
        } },
        { id: 'e13d', level: 'ADV', make: function (r) {
          var a = r.pick([2, 3, 5]);
          return P.mc(r, 'A rational number whose square is irrational.', [
            { html: '<b>Impossible:</b> a rational number times a rational number is always rational.', right: true },
            { html: t('\\sqrt{' + a + '}') + ', because ' + t('\\left(\\sqrt{' + a + '}\\right)^{2}=' + a) + '.', why: t('\\sqrt{' + a + '}') + ' is irrational, and its square ' + t(a) + ' is rational — the opposite of what is asked.' },
            { html: t('\\frac{1}{3}') + ', because its decimal never ends.', why: t('\\left(\\frac{1}{3}\\right)^{2}=\\frac{1}{9}=0.\\overline{1}') + ' — it repeats, so it is rational.' },
            { html: t('\\frac{' + a + '}{2}') + ', because ' + t('\\left(\\frac{' + a + '}{2}\\right)^{2}') + ' is a fraction.', why: 'A fraction of integers is rational, not irrational.' }],
            '<b>Impossible.</b> If ' + t('x=\\frac{a}{b}') + ' is rational, then ' + t('x^{2}=\\frac{a}{b}\\times\\frac{a}{b}=\\frac{a^{2}}{b^{2}}') + ' is again a fraction of integers — rational.', ['What do you get when you multiply two fractions of integers?'], 'rational with irrational square impossible');
        } }] },
      { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e14', level: 'EMG', make: function (r) {
          var n = gen(r, function () { return r.int(10, 50); }, nonSq), k = r.int(2, 9), g = randGrow(r), pv = r.pick(['\\frac{\\pi}{2}', '2\\pi', '\\frac{\\pi}{3}']);
          var sq = (k * k / 100).toFixed(2);
          return P.mc(r, 'Which of the following is <b>rational</b>?', [
            { html: t('\\sqrt{' + n + '}'), why: t(n) + ' is not a perfect square, so its root is irrational.', code: 'said-irrational' },
            { html: t(pv), why: 'Dividing or multiplying ' + t('\\pi') + ' by a whole number can’t make its digits end or repeat.', code: 'said-irrational' },
            { html: t('\\sqrt{' + sq + '}'), right: true },
            { html: t(g.tex), why: 'The runs of ' + t(g.c) + '’s keep growing, so no block repeats — irrational.', code: 'said-irrational' }],
            t('0.' + k + '\\times 0.' + k + '=' + sq) + ', so ' + t('\\sqrt{' + sq + '}=0.' + k) + ', a terminating decimal — rational.', ['Check each one: can it be written as a fraction? Try squaring a short decimal.'], 'MC which rational', true);
        } }] },
      { num: '15', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e15', level: 'PRG', make: function (r) {
          var pr = r.pick([[2, 8], [3, 12], [2, 18], [5, 20], [3, 27], [2, 32], [6, 24]]), v = Math.round(Math.sqrt(pr[0] * pr[1]));
          return P.mc(r, 'The number ' + t('\\sqrt{' + pr[0] + '}\\times\\sqrt{' + pr[1] + '}') + ' belongs to exactly the sets', [
            { html: t('\\overline{Q},\\ R'), why: 'Multiply first: ' + t('\\sqrt{' + pr[0] + '}\\times\\sqrt{' + pr[1] + '}=\\sqrt{' + pr[0] * pr[1] + '}=' + v) + '.', code: 'said-irrational' },
            { html: t('Q,\\ R') + ' only', why: t(v) + ' is a whole counting number, so it is in more sets than that.', code: 'said-rational' },
            { html: t('N,\\ W,\\ I,\\ Q,\\ R'), right: true },
            { html: t('I,\\ Q,\\ R') + ' only', why: t(v) + ' is positive, so it is also whole and natural.', code: 'said-rational' }],
            t('\\sqrt{' + pr[0] + '}\\times\\sqrt{' + pr[1] + '}=\\sqrt{' + pr[0] * pr[1] + '}=' + v) + ', a natural number, so it belongs to ' + t('N,\\ W,\\ I,\\ Q,\\ R') + '.', ['Multiply first: ' + t('\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}') + '.'], 'sets of sqrt' + pr[0] + ' x sqrt' + pr[1], true);
        } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: 'e16', level: 'BEG', make: function (r) {
          var falseP = r.chance(0.5) ? ['R', 'Q'] : r.pick([['Q', 'I'], ['I', 'W'], ['R', 'I'], ['W', 'N'], ['Qb', 'Q']]);
          var trues = r.sample([['N', 'Q'], ['Qb', 'R'], ['I', 'R'], ['W', 'I'], ['N', 'R'], ['I', 'Q'], ['W', 'Q']], 3);
          var opts = trues.map(function (p) { return { html: 'Every ' + NOUN[p[0]] + ' is ' + ONE[p[1]] + '.', why: 'That one is true: ' + S(p[0]) + ' sits inside ' + S(p[1]) + '.' }; });
          opts.push({ html: 'Every ' + NOUN[falseP[0]] + ' is ' + ONE[falseP[1]] + '.', right: true });
          return P.mc(r, 'Which statement is <b>false</b>?', opts, '<b>False:</b> every ' + NOUN[falseP[0]] + ' is ' + ONE[falseP[1]] + ' — ' + t(exIn(falseP[0], falseP[1])) + ' is ' + ONE[falseP[0]] + ' but not ' + ONE[falseP[1]] + '. The other three follow the nesting ' + t('N\\subset W\\subset I\\subset Q\\subset R') + ' and ' + t('\\overline{Q}\\subset R') + '.', TF_HINTS, 'which statement false (nesting)');
        } }] }
    ]
  });
})(window);
