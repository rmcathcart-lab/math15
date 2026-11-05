/* Math 15 · Unit 2 · Lesson 8 — Scientific Notation (AN3)
 * Assignment 8 (u2_L08.tex, Questions 1–15) and the Lesson 8 Extra Practice (u2_EP08.tex, Questions 1–20).
 * Every part is a generator: same structure, idea and difficulty as the booklet question, new numbers from the seed (the
 * booklet's own numbers are among the possible values). All arithmetic is exact on decimals { m: integer, e: integer }
 * (value m × 10^e), so keys never show float noise; answers are checked with relative tolerance (K.sci / local checkers)
 * because an absolute tolerance would accept wrong answers for very small numbers.
 * Scientific notation is a × 10ⁿ with 1 ≤ a < 10 (the sci keypad); standard notation is digits only (a number box).
 * Conversions: the table (Q1) → labelled boxes; "direction and number of places" (Q8) and "is it correct? explain"
 * (Q9, Q12, EP Q19) → multiple choice whose options are reasons, plus the corrected number where the booklet asks for it;
 * "what is wrong with the coefficient" (EP Q3) → a two-column table; ordering → the ordering input.
 * The Extra Practice also multiplies, divides, raises to powers, adds and subtracts in scientific notation (its own
 * introductions teach the rule); EP Q15(b), Q16(b), Q17 and Q20(a) are marked (calculator), and
 * EP Parts B, C, E, F and Q14 are marked (Preview of Lesson 10), as in the booklet.
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. Every part is AN3. */
(function (root) {
  'use strict';
  var HW = root.HW, F = HW.fmt, K = HW.kit, ex = HW.ex, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  HW.addCodes({
    'exp-sign': 'Exponent has the wrong sign (scientific notation)', 'counted-digits': 'Counted digits instead of places moved', direction: 'Moved the decimal point the wrong way', places: 'Decimal point moved the wrong number of places',
    'not-standard': 'Not written in standard notation', 'renorm-dir': 'Fixed the coefficient but moved the exponent the wrong way', 'add-coef': 'Added the coefficients instead of multiplying',
    'sub-exp': 'Subtracted exponents when multiplying', 'div-add-exp': 'Added exponents when dividing', 'mult-coef': 'Multiplied the coefficients when dividing', 'flip-ratio': 'Divided the wrong way round',
    'letter-x': 'Typed the letter x for times', 'mult-exp': 'Multiplied exponents instead of adding (product law)', 'coef-not-raised': 'Didn’t raise the coefficient to the power',
    'add-exp': 'Added exponents instead of multiplying (power of a power)', 'coef-times': 'Multiplied the coefficient by the exponent', 'repeat-error': 'Repeated the error in the worked line',
    'u2l8-add-exp': 'Added the exponents when adding numbers in scientific notation', 'u2l8-no-match': 'Added or subtracted coefficients without matching the powers of 10',
    'u2l8-match-dir': 'Matched the powers of 10 but moved the coefficient’s decimal point the wrong way', 'u2l8-sum-op': 'Added instead of subtracting (or the reverse)',
    'u2l8-doublings': 'Wrong number of doublings', 'u2l8-unit': 'Unit conversion slip (wrong power of 10 for the unit)'
  });
  HW.addPartial({ 'div-add-exp': 'b', 'repeat-error': 'n', 'u2l8-add-exp': 'b', 'u2l8-no-match': 'b', 'u2l8-match-dir': 'b', 'u2l8-sum-op': 's', 'u2l8-doublings': 'b', 'u2l8-unit': 's' });

  /* ---------- exact decimals ---------- */
  function P10(k) { return Math.pow(10, k); }
  function D(m, e) { if (m === 0) return { m: 0, e: 0 }; while (m % 10 === 0) { m /= 10; e++; } return { m: m, e: e }; }
  function dec(s) { s = String(s).replace(/\s|\\,/g, ''); var sg = s[0] === '-'; if (sg) s = s.slice(1); var p = s.split('.'), fr = p[1] || ''; var m = Number((p[0] || '0') + fr); return D(sg ? -m : m, -fr.length); }
  function val(d) { return Number(d.m + 'e' + d.e); }
  function nd(d) { return String(Math.abs(d.m)).length; }
  function sN(d) { return d.m === 0 ? 0 : d.e + nd(d) - 1; }
  function mul(a, b) { return D(a.m * b.m, a.e + b.e); }
  function div(a, b) { for (var k = 0; k <= 12; k++) { var n = a.m * P10(k); if (!Number.isSafeInteger(n)) return null; if (n % b.m === 0) return D(n / b.m, a.e - b.e - k); } return null; }
  function add(a, b) { var e = Math.min(a.e, b.e); return D(a.m * P10(a.e - e) + b.m * P10(b.e - e), e); }
  function neg(a) { return { m: -a.m, e: a.e }; }
  function sh(a, k) { return { m: a.m, e: a.e + k }; }
  function dpow(a, n) { var r = D(1, 0); for (var i = 0; i < n; i++) r = mul(r, a); return r; }
  function coef(d) { return D(d.m, -(nd(d) - 1)); }
  function inRange(c) { var v = Math.abs(val(c)); return v >= 1 && v < 10; }
  function std(d) {
    if (d.m === 0) return '0';
    var s = String(Math.abs(d.m)), sg = d.m < 0 ? '-' : '';
    if (d.e >= 0) return sg + s + '0'.repeat(d.e);
    var pos = s.length + d.e;
    return pos > 0 ? sg + s.slice(0, pos) + '.' + s.slice(pos) : sg + '0.' + '0'.repeat(-pos) + s;
  }
  function stdTex(d) {
    var s = std(d), sg = ''; if (s[0] === '-') { sg = '-'; s = s.slice(1); }
    var p = s.split('.'), i = p[0], out = '';
    if (i.length >= 4) while (i.length > 3) { out = '\\,' + i.slice(-3) + out; i = i.slice(0, -3); }
    return sg + i + out + (p[1] ? '.' + p[1] : '');
  }
  function stdPlain(d) { return stdTex(d).replace(/\\,/g, ' '); }
  function sciT(d) { return std(coef(d)) + '\\times 10^{' + sN(d) + '}'; }
  function sciPlain(d) { return std(coef(d)) + ' × 10^' + sN(d); }
  function pt(c, p) { return stdTex(c) + '\\times 10^{' + p + '}'; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function S(m, n) { return D(m, n - (String(m).length - 1)); }        // digits m with the point after the first digit, × 10^n
  function relEq(a, b, tol) { return isFinite(a) && isFinite(b) && Math.abs(a - b) <= (tol || 1e-9) * Math.max(Math.abs(a), Math.abs(b)); }
  function mant(r, sig) { if (sig === 1) return r.int(1, 9); var s = String(r.int(1, 9)); for (var i = 1; i < sig - 1; i++) s += r.int(0, 9); return Number(s + r.int(1, 9)); }
  function find(r, gen, okf, fallback, pf) { if (fallback && r.chance(pf == null ? 0.12 : pf)) return fallback; for (var i = 0; i < 2000; i++) { var v = gen(); if (v && okf(v)) return v; } return fallback; }
  function pl(n, w) { return t(n) + ' ' + w + (Math.abs(n) === 1 ? '' : 's'); }

  /* ---------- checkers ---------- */
  function cands(list) {
    return function (v) {
      for (var i = 0; i < list.length; i++) { var c = list[i]; if (c && c[0] != null && relEq(v, typeof c[0] === 'number' ? c[0] : val(c[0]))) return { code: c[1], hint: c[2] }; }
      return null;
    };
  }
  var LETTER_X = /\d\s*[xX]\s*\d/;
  function letterX(resp) { return LETTER_X.test(String(resp || '')) ? form('letter-x', 'For “times”, use the ' + t('\\times') + ' key (or type <code>*</code>) — the letter x reads as a variable.') : null; }
  /* a number in scientific notation equal to x (D or number). diag(value) -> {code, hint} */
  function sciChk(x, diag) {
    var X = typeof x === 'number' ? x : val(x), base = K.sci(X, {});
    return function (resp) {
      var lx = letterX(resp); if (lx) return lx;
      var a = K.read(resp); if (a.res) return a.res;
      if (relEq(a.val, X)) return base(resp);
      var h = diag ? diag(a.val, a.ast) : null;
      if (h) return wrong(h.code || 'diag', h.hint);
      if (relEq(-a.val, X)) return wrong('sign', 'Check the sign.');
      var q = a.val / X, lg = Math.log10(Math.abs(q));
      if (q > 0 && Math.abs(lg - Math.round(lg)) < 1e-9 && Math.round(lg) !== 0) return wrong('power-off', 'The digits are right, but the power of ' + t('10') + ' is off by ' + t(Math.abs(Math.round(lg))) + '. Count how many places the decimal point moves, and in which direction.');
      return wrong('value', null);
    };
  }
  /* a number in standard notation equal to d */
  function stdChk(d, diag) {
    var n = sN(d), X = val(d);
    return function (resp) {
      var raw = String(resp == null ? '' : resp), p = HW.parse.number(raw);
      if (!p.ok) {
        if (p.code === 'empty') return form('empty', 'Type your answer first.');
        var a = K.read(raw);
        if (!a.res && relEq(a.val, X)) return form('not-standard', 'Right value — now write it in <b>standard notation</b>: all the digits, with no power of ' + t('10') + '.');
        return form('notnumber', 'Write the number in standard notation: digits and a decimal point only, no power of ' + t('10') + '.');
      }
      var g = dec(HW.parse.plain(raw).replace(/\s+/g, '').replace(/,(?=\d{3}(\D|$))/g, '').replace(/[()]/g, ''));
      if (g.m === d.m && g.e === d.e) return ok();
      var h = diag ? diag(val(g)) : null; if (h) return wrong(h.code || 'diag', h.hint);
      if (g.m === -d.m && g.e === d.e) return wrong('sign', 'Check the sign.');
      if (g.m === d.m) {
        var gn = sN(g);
        if (n !== 0 && (gn === -n || (n < 0) !== (gn < 0))) return wrong('direction', n < 0 ? 'A <b>negative</b> exponent makes the number small: move the decimal point to the <b>left</b> (the answer is less than ' + t('1') + ').' : 'A <b>positive</b> exponent makes the number big: move the decimal point to the <b>right</b>.');
        return wrong('places', 'The digits are right, but the decimal point is ' + Math.abs(gn - n) + ' place' + (Math.abs(gn - n) === 1 ? '' : 's') + ' off. Move it exactly ' + pl(Math.abs(n), 'place') + ' — count the hops one at a time.');
      }
      return wrong('value', null);
    };
  }
  function sciPart(prompt, d, diag, sol, hints, text, inp) {
    var key = sciT(d), chk = sciChk(d, diag);
    var p = P.math(prompt, chk, key, sol, hints, text, Object.assign({ keys: 'sci' }, inp || {}));
    p.good = [key.replace(/\\times 10\^\{(-?\d+)\}/, ' × 10^$1'), key.replace(/\\times 10\^\{(-?\d+)\}/, '*10^{$1}')];
    p.bad = [];
    return p;
  }
  var SCI_HINTS = ['Move the decimal point until exactly one non-zero digit is in front of it. That gives the coefficient ' + t('a') + ', with ' + t('1\\le a<10') + '.',
    'Count the places you moved: that is the exponent. A number 10 or bigger gives a positive exponent; a number less than 1 gives a negative one.'];
  var STD_HINTS = ['The exponent tells you how many places to move the decimal point.',
    'Positive exponent: move it to the <b>right</b> (a big number). Negative exponent: move it to the <b>left</b> (a number less than ' + t('1') + '). Fill the empty places with zeros.'];
  function moveWords(d) { var n = sN(d); return pl(Math.abs(n), 'place') + ' ' + (n >= 0 ? 'left' : 'right'); }
  function expSign(d) {
    var n = sN(d); if (!n) return null;
    return [sh(d, -2 * n), 'exp-sign', n > 0 ? 'Your exponent is negative, but ' + t(stdTex(d)) + ' is <b>bigger</b> than ' + t('1') + ', so its exponent is positive.' : 'Your exponent is positive, but ' + t(stdTex(d)) + ' is <b>less</b> than ' + t('1') + ', so its exponent is negative.'];
  }
  function sciDiag(d) { var n = sN(d); return cands([expSign(d), n !== 0 ? [sh(d, n >= 0 ? 1 : -1), 'counted-digits', 'Count the <b>hops</b> the decimal point makes to sit just after the first non-zero digit (' + t(std(coef(d))) + ') — not the number of digits or zeros.'] : null]); }
  function sciSol(d) { var n = sN(d); return n === 0 ? t(stdTex(d)) + ' is already between ' + t('1') + ' and ' + t('10') + ', so the decimal point doesn’t move: the exponent is ' + t('0') + '.<br>' + t(stdTex(d) + '=' + sciT(d)) + '.' : 'Move the decimal point ' + moveWords(d) + ' to get ' + t(std(coef(d))) + ', so the exponent is ' + t(n) + ':<br>' + t(stdTex(d) + '=' + sciT(d)) + '.'; }
  function stdSol(d) { var n = sN(d); return (n === 0 ? 'The exponent is ' + t('0') + ': the decimal point doesn’t move.' : n > 0 ? 'The exponent is positive: move the decimal point ' + pl(n, 'place') + ' <b>right</b>.' : 'The exponent is negative: move the decimal point ' + pl(-n, 'place') + ' <b>left</b>.') + '<br>' + t(sciT(d) + '=' + stdTex(d)) + '.'; }
  /* standard -> scientific */
  function toSci(d, prompt, inp) { return sciPart(prompt || t(stdTex(d)), d, sciDiag(d), sciSol(d), SCI_HINTS, 'to scientific notation: ' + std(d), inp); }
  /* scientific -> standard */
  function toStd(d, prompt, after) {
    var n = sN(d);
    var p = { prompt: prompt || t(sciT(d)), input: { type: 'number', after: after }, check: stdChk(d), key: std(d), answer: t(stdTex(d)) + (after ? ' ' + after : ''),
      solution: stdSol(d), hints: STD_HINTS, text: 'to standard notation: ' + sciPlain(d) };
    p.good = [stdPlain(d)];
    p.bad = [std(sh(d, 1)), std(sh(d, -1))];
    if (n !== 0) p.bad.push(std(sh(d, -2 * n)));
    return p;
  }

  /* ---------- operations: A, B = { c: D (coefficient), p: int (power of 10) } ---------- */
  function A_(c, p) { return { c: typeof c === 'string' ? dec(c) : typeof c === 'number' ? D(c, 0) : c, p: p }; }
  function full(A) { return sh(A.c, A.p); }
  function cTex(A) { return pt(A.c, A.p); }
  function opTex(A, B, op) { return op === 'mul' ? '(' + cTex(A) + ')(' + cTex(B) + ')' : '\\dfrac{' + cTex(A) + '}{' + cTex(B) + '}'; }
  function opRes(A, B, op) { var m = op === 'mul'; var C = m ? mul(A.c, B.c) : div(A.c, B.c); var E = m ? A.p + B.p : A.p - B.p; return { C: C, E: E, R: sh(C, E) }; }
  function renormText(C, E, R) {
    return inRange(C) ? t(pt(C, E)) + ' — the coefficient is already between ' + t('1') + ' and ' + t('10') + ': <b>' + t(sciT(R)) + '</b>.'
      : t(pt(C, E)) + ', but ' + t(stdTex(C)) + ' is not between ' + t('1') + ' and ' + t('10') + '. ' + t(stdTex(C) + '=' + sciT(C)) + ', so the result is <b>' + t(sciT(R)) + '</b>.';
  }
  function opSol(A, B, op) {
    var o = opRes(A, B, op), m = op === 'mul';
    return 'Coefficients: ' + t(stdTex(A.c) + (m ? '\\times ' : '\\div ') + stdTex(B.c) + '=' + stdTex(o.C)) + '. Exponents: ' + t(m ? A.p + '+' + par(B.p) + '=' + o.E : A.p + '-' + par(B.p) + '=' + o.E) + '.<br>' + renormText(o.C, o.E, o.R);
  }
  function renormItem(C, E, R) {
    if (inRange(C)) return null; var k = sN(C);
    return [sh(R, -2 * k), 'renorm-dir', k > 0 ? 'Fixing the coefficient: ' + t(stdTex(C) + '\\to ' + std(coef(C))) + ' makes it smaller, so the exponent must go <b>up</b> by ' + t(k) + ', not down.' : 'Fixing the coefficient: ' + t(stdTex(C) + '\\to ' + std(coef(C))) + ' makes it bigger, so the exponent must go <b>down</b> by ' + t(-k) + ', not up.'];
  }
  function opDiag(A, B, op) {
    var o = opRes(A, B, op), m = op === 'mul', list = [renormItem(o.C, o.E, o.R)];
    if (m) {
      list.push([sh(add(A.c, B.c), o.E), 'add-coef', 'The coefficients are <b>multiplied</b>, not added: ' + t(stdTex(A.c) + '\\times ' + stdTex(B.c)) + '.']);
      list.push([sh(o.C, A.p * B.p), 'mult-exp', 'Product law: <b>add</b> the exponents (' + t('10^{m}\\times 10^{n}=10^{m+n}') + '), don’t multiply them.']);
      list.push([sh(o.C, A.p - B.p), 'sub-exp', 'When you multiply, <b>add</b> the exponents: ' + t(A.p + '+' + par(B.p)) + '.']);
    } else {
      list.push([sh(o.C, A.p + B.p), 'div-add-exp', 'Quotient law: <b>subtract</b> the exponents (top minus bottom): ' + t(A.p + '-' + par(B.p)) + '.' + (B.p < 0 ? ' Subtracting a negative is adding.' : '')]);
      var fl = div(B.c, A.c); if (fl) list.push([sh(fl, B.p - A.p), 'flip-ratio', 'Divide in the right order — the first number by the second: ' + t(stdTex(A.c) + '\\div ' + stdTex(B.c)) + ' and ' + t(A.p + '-' + par(B.p)) + '.']);
      list.push([sh(mul(A.c, B.c), o.E), 'mult-coef', 'This is a division — divide the coefficients: ' + t(stdTex(A.c) + '\\div ' + stdTex(B.c)) + '.']);
    }
    return cands(list.filter(function (c) { return c && c[0] && !relEq(val(c[0]), val(o.R)); }));
  }
  var OP_HINTS = ['Work with the coefficients and the powers of ' + t('10') + ' separately: multiply (or divide) the coefficients, add (or subtract) the exponents.',
    'Finish by checking the coefficient: if it isn’t at least ' + t('1') + ' and less than ' + t('10') + ', move the decimal point and adjust the exponent.'];
  function opPart(A, B, op, prompt) {
    var o = opRes(A, B, op);
    var p = sciPart(prompt || t(opTex(A, B, op)), o.R, opDiag(A, B, op), opSol(A, B, op), OP_HINTS, (op === 'mul' ? 'multiply ' : 'divide ') + sciPlain(full(A)) + ', ' + sciPlain(full(B)));
    if (!inRange(o.C)) p.bad.push(stdTex(o.C) + '\\times10^{' + o.E + '}');
    var rd = renormItem(o.C, o.E, o.R); if (rd) p.bad.push(sciT(rd[0]));
    return p;
  }
  /* (a × 10^p)^n */
  function powPart(A, n) {
    var C = dpow(A.c, n), E = A.p * n, Rr = sh(C, E), tex = '(' + cTex(A) + ')^{' + n + '}';
    var list = [renormItem(C, E, Rr), [sh(A.c, E), 'coef-not-raised', 'The power applies to the coefficient too: ' + t('(' + stdTex(A.c) + ')^{' + n + '}=' + stdTex(C)) + '.'],
      [sh(C, A.p + n), 'add-exp', 'Power of a power: <b>multiply</b> the exponents, ' + t(par(A.p) + '\\times ' + n) + '.'], [sh(mul(A.c, D(n, 0)), E), 'coef-times', t('(' + stdTex(A.c) + ')^{' + n + '}') + ' means ' + t(Array(n + 1).join(stdTex(A.c) + '\\times ').slice(0, -7)) + ', not ' + t(stdTex(A.c) + '\\times ' + n) + '.']];
    var p = sciPart(t(tex), Rr, cands(list.filter(function (c) { return c && !relEq(val(c[0]), val(Rr)); })),
      'Raise both parts to the power ' + t(n) + ': ' + t('(' + stdTex(A.c) + ')^{' + n + '}=' + stdTex(C)) + ' and ' + t('(10^{' + A.p + '})^{' + n + '}=10^{' + E + '}') + '.<br>' + renormText(C, E, Rr),
      ['Apply the exponent to <b>both</b> the coefficient and the power of ' + t('10') + '.', 'Power of a power: multiply the exponents. Then fix the coefficient if it is 10 or more.'], 'power ' + sciPlain(full(A)) + '^' + n);
    if (!inRange(C)) p.bad.push(stdTex(C) + '\\times10^{' + E + '}');
    p.bad.push(sciT(sh(A.c, E)));
    return p;
  }
  /* sum of terms [{A, s: +1|-1}] */
  function sumPart(terms, prompt) {
    var top = Math.max.apply(null, terms.map(function (x) { return x.A.p; })), R0 = D(0, 0);
    terms.forEach(function (x) { R0 = add(R0, x.s > 0 ? full(x.A) : neg(full(x.A))); });
    var tex = terms.map(function (x, i) { return (i ? (x.s > 0 ? '+' : '-') : '') + cTex(x.A); }).join('');
    var rew = terms.map(function (x, i) { var c = sh(x.A.c, x.A.p - top); return (i ? (x.s > 0 ? '+' : '-') : '') + stdTex(c) + '\\times 10^{' + top + '}'; }).join('');
    var csum = coef(R0), Csum = sh(R0, -top);
    var same = terms.every(function (x) { return x.A.p === top; });
    var sol = (same ? 'The powers of ' + t('10') + ' already match, so ' + (terms.some(function (x) { return x.s < 0; }) ? 'subtract' : 'add') + ' the coefficients: ' : 'Rewrite ' + (terms.length > 2 ? 'every number' : 'the smaller-exponent number') + ' with ' + t('10^{' + top + '}') + ': ' + t(rew) + '.<br>Then combine the coefficients: ')
      + t(terms.map(function (x, i) { var c = sh(x.A.c, x.A.p - top); return (i ? (x.s > 0 ? '+' : '-') : '') + stdTex(c); }).join('') + '=' + stdTex(Csum)) + ', so the sum is ' + t(stdTex(Csum) + '\\times 10^{' + top + '}') + '.<br>'
      + (inRange(Csum) ? 'That is already in scientific notation: <b>' + t(sciT(R0)) + '</b>.' : t(stdTex(Csum)) + ' is not between ' + t('1') + ' and ' + t('10') + ': ' + t(stdTex(Csum) + '=' + sciT(Csum)) + ', so the answer is <b>' + t(sciT(R0)) + '</b>.');
    var list = [];
    if (!inRange(Csum)) list.push(renormItem(Csum, top, R0));
    if (terms.length === 2) {
      var A = terms[0].A, B = terms[1].A, s = terms[1].s;
      var cc = add(A.c, s > 0 ? B.c : neg(B.c));
      if (A.p !== B.p || true) list.push([sh(cc, A.p + B.p), 'u2l8-add-exp', 'Exponents are added only when you <b>multiply</b>. To ' + (s > 0 ? 'add' : 'subtract') + ', rewrite both numbers with the same power of ' + t('10') + ', then combine the coefficients.']);
      if (A.p !== B.p) {
        list.push([sh(cc, top), 'u2l8-no-match', 'The powers of ' + t('10') + ' are different, so the coefficients can’t be combined yet. Rewrite the smaller one first: ' + t(cTex(A.p < B.p ? A : B) + '=' + stdTex(sh((A.p < B.p ? A : B).c, (A.p < B.p ? A : B).p - top)) + '\\times 10^{' + top + '}') + '.']);
        var lo = A.p < B.p ? A : B, wrongC = sh(lo.c, top - lo.p), Aw = A.p < B.p ? wrongC : A.c, Bw = A.p < B.p ? B.c : wrongC;
        list.push([sh(add(Aw, s > 0 ? Bw : neg(Bw)), top), 'u2l8-match-dir', 'When ' + t(cTex(lo)) + ' is rewritten with the bigger power ' + t('10^{' + top + '}') + ', its coefficient must get <b>smaller</b>: ' + t(stdTex(sh(lo.c, lo.p - top)) + '\\times 10^{' + top + '}') + '.']);
      }
      list.push([add(full(A), s > 0 ? neg(full(B)) : full(B)), 'u2l8-sum-op', 'Check the operation: this one ' + (s > 0 ? '<b>adds</b>' : '<b>subtracts</b>') + '.']);
    }
    var p = sciPart(prompt || t(tex), R0, cands(list.filter(function (c) { return c && c[0] && val(c[0]) !== 0 && !relEq(val(c[0]), val(R0)); })), sol,
      ['You can only add or subtract coefficients when the powers of ' + t('10') + ' are the <b>same</b>. Rewrite the smaller-exponent number to match the bigger one.', 'Then combine the coefficients and check: is the coefficient at least ' + t('1') + ' and less than ' + t('10') + '?'], 'sum ' + tex.replace(/\\times 10\^\{(-?\d+)\}/g, 'e$1'));
    if (!inRange(Csum)) p.bad.push(stdTex(Csum) + '\\times10^{' + top + '}');
    list.forEach(function (c) { if (c && c[0] && val(c[0]) > 0 && !relEq(val(c[0]), val(R0))) p.bad.push(sciT(c[0])); });
    return p;
  }

  /* ---------- small builders ---------- */
  function c1(r) { return D(r.int(2, 9), 0); }
  function c2(r) { var v; do { v = r.int(11, 99); } while (v % 10 === 0); return D(v, -1); }
  function dirMC(r, d) {
    var n = sN(d), k = Math.abs(n), dirW = n >= 0 ? 'left' : 'right', oth = n >= 0 ? 'right' : 'left';
    var other = k > 1 ? k - 1 : k + 2;
    return P.mc(r, 'To write ' + t(stdTex(d)) + ' in scientific notation, the decimal point moves', [
      { html: pl(k, 'place') + ' ' + dirW, right: true },
      { html: pl(k, 'place') + ' ' + oth, why: t(stdTex(d)) + ' is ' + (n >= 0 ? 'bigger than ' + t('10') + ', so the decimal point moves <b>left</b> to make the coefficient smaller.' : 'less than ' + t('1') + ', so the decimal point moves <b>right</b> to make the coefficient bigger.') },
      { html: pl(k + 1, 'place') + ' ' + dirW, why: 'Stop when exactly one non-zero digit is in front of the decimal point: ' + t(std(coef(d))) + '. Count the hops, not the digits.' },
      { html: pl(other, 'place') + ' ' + (n >= 0 ? oth : dirW), why: 'Count the hops from where the decimal point is now to just after the first non-zero digit (' + t(std(coef(d))) + ').' }],
      'The decimal point moves ' + pl(k, 'place') + ' <b>' + dirW + '</b> to give ' + t(std(coef(d))) + ': ' + t(stdTex(d) + '=' + sciT(d)) + '.', SCI_HINTS, 'direction ' + std(d));
  }
  /* order a list of D values, smallest first */
  function orderPart(r, ds, prompt, o) {
    o = o || {};
    var items = ds.map(function (d, i) { return { id: 'n' + i, tex: sciT(d), v: val(d), d: d }; }).sort(function (a, b) { return a.v - b.v; });
    var p = P.order(r, prompt, items.map(function (x) { return { id: x.id, tex: x.tex }; }), { first: 'smallest', last: 'largest' },
      'Compare the exponents first; only when two exponents are equal compare the coefficients.<br>' + t(items.map(function (x) { return x.tex; }).join('<')) + '.',
      ['The smaller the exponent, the smaller the number — whatever the coefficient.', 'Remember ' + t('-7<-5') + ': a more negative exponent means a smaller number.'], 'order sci');
    var byId = {}; items.forEach(function (x) { byId[x.id] = x; });
    var base = p.check;
    p.check = function (resp) {
      var res = base(resp); if (res.v !== 'wrong') return res;
      for (var j = 0; j + 1 < resp.length; j++) {
        var a = byId[resp[j]], b = byId[resp[j + 1]];
        if (a && b && a.v > b.v) {
          var ea = sN(a.d), eb = sN(b.d);
          if (ea !== eb && val(coef(a.d)) < val(coef(b.d)) && ea > eb) return wrong('order', t(a.tex) + ' comes after ' + t(b.tex) + ': compare the <b>exponents</b> first (' + t(ea + '>' + eb) + '), not the coefficients.');
          if (ea < 0 && eb < 0 && Math.abs(ea) < Math.abs(eb)) return wrong('order', 'Careful with negative exponents: ' + t(eb + '<' + ea) + ', so ' + t(b.tex) + ' is the smaller number.');
          if (ea === eb) return wrong('order', 'Same power of ' + t('10') + ': compare the coefficients, ' + t(std(coef(a.d)) + '>' + std(coef(b.d))) + '.');
          return wrong('order', t(a.tex) + ' is bigger than ' + t(b.tex) + '.');
        }
      }
      return res;
    };
    return p;
  }

  /* ---------- context lists ---------- */
  var BIG_CTX = [
    function (d) { return 'A space probe is about ' + t(stdTex(d)) + ' km from Earth.'; },
    function (d) { return 'A country’s annual budget was about ' + t(stdTex(d)) + ' dollars.'; },
    function (d) { return 'A large city’s water system delivers about ' + t(stdTex(d)) + ' litres in a year.'; },
    function (d) { return 'A video was viewed about ' + t(stdTex(d)) + ' times.'; },
    function (d) { return 'A company sold about ' + t(stdTex(d)) + ' phones last year.'; }
  ];
  var SMALL_CTX = [
    function (d) { return 'A single grain of table salt has a mass of about ' + t(stdTex(d)) + ' g.'; },
    function (d) { return 'A speck of dust has a mass of about ' + t(stdTex(d)) + ' g.'; },
    function (d) { return 'A sheet of plastic wrap is about ' + t(stdTex(d)) + ' m thick.'; },
    function (d) { return 'A single snowflake has a mass of about ' + t(stdTex(d)) + ' kg.'; }
  ];

  /* ---------- Assignment 8 ---------- */
  var questions = [
    { num: '1', section: 'Part A — Converting between forms', stem: 'Complete the table, converting each number to the missing form.', parts: [
      { id: '1a', level: 'BEG', make: function (r) {
        var ds = r.chance(0.12) ? [D(91, 3), D(27, -5), D(59, -1)] : [S(mant(r, 2), r.int(3, 6)), S(mant(r, 2), -r.int(3, 6)), S(mant(r, r.pick([2, 2, 3])), 0)];
        var p = P.fields('Write ' + ds.map(function (d) { return t(stdTex(d)); }).join(', ') + ' in scientific notation.', ds.map(function (d) { return { name: std(d), before: t(stdTex(d) + '='), mode: 'math', keys: 'sci' }; }),
          ds.map(function (d) { return sciChk(d, sciDiag(d)); }), ds.map(sciT), ds.map(function (d) { return t(stdTex(d) + '=' + sciT(d)); }).join('<br>'),
          ds.map(sciSol).join('<br><br>'), SCI_HINTS, 'table: to scientific');
        p.bad = [ds.map(function (d) { return sciT(sh(d, -2 * sN(d) || 1)); })];
        return p;
      } },
      { id: '1b', level: 'BEG', make: function (r) {
        var ds = r.chance(0.12) ? [D(63, 4), D(4, -3), D(815, 0)] : [S(mant(r, 2), r.int(3, 6)), S(mant(r, 1), -r.int(2, 5)), S(mant(r, 3), 2)];
        var p = P.fields('Write ' + ds.map(function (d) { return t(sciT(d)); }).join(', ') + ' in standard notation.', ds.map(function (d) { return { name: sciPlain(d), before: t(sciT(d) + '='), wide: true }; }),
          ds.map(function (d) { return stdChk(d); }), ds.map(std), ds.map(function (d) { return t(sciT(d) + '=' + stdTex(d)); }).join('<br>'),
          ds.map(stdSol).join('<br><br>'), STD_HINTS, 'table: to standard');
        p.good = [ds.map(stdPlain)];
        p.bad = [ds.map(function (d) { return std(sh(d, 1)); })];
        return p;
      } }] },
    { num: '2', stem: 'Write each number in scientific notation.', parts: [
      { id: '2a', level: 'LIM', make: function (r) { return toSci(r.chance(0.12) ? D(8, 3) : S(r.int(1, 9), r.int(3, 5))); } },
      { id: '2b', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(43, 3) : S(mant(r, 2), r.int(3, 5))); } },
      { id: '2c', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(61, 4) : S(mant(r, 2), r.int(5, 6))); } },
      { id: '2d', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(725, 4) : S(mant(r, 3), r.int(6, 7))); } },
      { id: '2e', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(96, 0) : S(mant(r, 2), 1)); } }] },
    { num: '3', stem: 'Write each number in scientific notation.', parts: [
      { id: '3a', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(5, -3) : S(r.int(1, 9), -r.int(2, 5))); } },
      { id: '3b', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(61, -5) : S(mant(r, 2), -r.int(3, 5))); } },
      { id: '3c', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(34, -7) : S(mant(r, 2), -r.int(5, 7))); } },
      { id: '3d', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(8, -2) : S(r.int(1, 9), -r.int(1, 3))); } },
      { id: '3e', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(9, -6) : S(r.int(1, 9), -r.int(5, 7))); } }] },
    { num: '4', stem: 'Express each quantity in scientific notation.', parts: [
      { id: '4a', level: 'BEG', make: function (r) {
        if (r.chance(0.12)) { var d0 = D(41, 6); return toSci(d0, 'At its closest, Venus comes within about ' + t(stdTex(d0)) + ' km of Earth.', { after: 'km' }); }
        var d = S(mant(r, 2), r.int(6, 9)); return toSci(d, BIG_CTX[0](d), { after: 'km' });
      } },
      { id: '4b', level: 'BEG', make: function (r) {
        var d = r.chance(0.12) ? D(65, -6) : S(mant(r, 2), -r.int(4, 7)), i = r.int(0, SMALL_CTX.length - 1);
        return toSci(d, SMALL_CTX[i](d), { after: ['g', 'g', 'm', 'kg'][i] });
      } },
      { id: '4c', level: 'BEG', make: function (r) {
        var d = r.chance(0.12) ? D(56, 8) : S(mant(r, 2), r.int(7, 10)), i = r.int(1, BIG_CTX.length - 1);
        return toSci(d, BIG_CTX[i](d), { after: ['', 'dollars', 'L', 'views', 'phones'][i] });
      } }] },
    { num: '5', stem: 'Write each number in standard notation.', parts: [
      { id: '5a', level: 'LIM', make: function (r) { return toStd(r.chance(0.12) ? D(4, 3) : S(r.int(1, 9), r.int(2, 5))); } },
      { id: '5b', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(67, 3) : S(mant(r, 2), r.int(3, 5))); } },
      { id: '5c', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(902, 4) : S(Number(r.int(1, 9) + '0' + r.int(1, 9)), r.int(5, 7))); } },
      { id: '5d', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(3, 8) : S(r.int(1, 9), r.int(6, 9))); } }] },
    { num: '6', stem: 'Write each number in standard notation.', parts: [
      { id: '6a', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(5, -2) : S(r.int(1, 9), -r.int(1, 3))); } },
      { id: '6b', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(23, -5) : S(mant(r, 2), -r.int(3, 5))); } },
      { id: '6c', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(8, -6) : S(r.int(1, 9), -r.int(4, 7))); } },
      { id: '6d', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(19, -4) : S(mant(r, 2), -r.int(2, 4))); } }] },
    { num: '7', stem: 'Express each quantity in standard notation.', parts: [
      { id: '7a', level: 'BEG', make: function (r) {
        var d = r.chance(0.12) ? D(4, -6) : S(r.pick([r.int(1, 9), mant(r, 2)]), -r.int(5, 7)), w = r.pick(['The diameter of a certain bacterium', 'The width of a certain bacterium', 'The thickness of a soap bubble’s wall', 'The diameter of a fine strand of spider silk']);
        return toStd(d, w + ' is about ' + t(sciT(d) + '\\text{ m}') + '.', 'm');
      } },
      { id: '7b', level: 'BEG', make: function (r) {
        var d = r.chance(0.12) ? D(215, 4) : S(mant(r, 3), r.int(5, 7)), w = r.pick(['A city’s population is about', 'A province’s population is about', 'The crowd at a summer festival over one week was about', 'A region’s population is about']);
        return toStd(d, w + ' ' + t(sciT(d)) + ' people.', 'people');
      } }] },
    { num: '8', section: 'Part B — Reasoning, comparing and ordering', stem: 'Determine the direction, and how many places the decimal point should be moved, to write each number in scientific notation.', parts: [
      { id: '8a', level: 'BEG', make: function (r) { return dirMC(r, r.chance(0.12) ? D(52, 0) : S(mant(r, 2), 1)); } },
      { id: '8b', level: 'BEG', make: function (r) { return dirMC(r, r.chance(0.12) ? D(306, 3) : S(Number(r.int(1, 9) + '0' + r.int(1, 9)), r.int(4, 6))); } },
      { id: '8c', level: 'BEG', make: function (r) { return dirMC(r, r.chance(0.12) ? D(41, -5) : S(mant(r, 2), -r.int(3, 5))); } },
      { id: '8d', level: 'BEG', make: function (r) { return dirMC(r, r.chance(0.12) ? D(7, -1) : S(r.pick([r.int(1, 9), mant(r, 2)]), -1)); } }] },
    { num: '9', stem: 'Determine whether each number is correctly written in scientific notation. If it is not, rewrite it correctly.', parts: [
      { id: '9a', level: 'BEG', make: function (r) {
        var a = r.chance(0.12) ? '6.2' : std(D(mant(r, 2), -1)), n = r.chance(0.3) ? -r.int(2, 7) : r.int(2, 8);
        return verdictMC(r, a, n, 'ok');
      } },
      { id: '9b', sub: 'b i', level: 'EMG', make: function (r, sh0) { return verdictMC(r, sh0.b.a, sh0.b.n, 'big'); } },
      { id: '9b2', sub: 'b ii', level: 'EMG', make: function (r, sh0) { return fixPart(sh0.b.a, sh0.b.n); } },
      { id: '9c', sub: 'c i', level: 'EMG', make: function (r, sh0) { return verdictMC(r, sh0.c.a, sh0.c.n, 'small'); } },
      { id: '9c2', sub: 'c ii', level: 'EMG', make: function (r, sh0) { return fixPart(sh0.c.a, sh0.c.n); } },
      { id: '9d', sub: 'd', level: 'EMG', make: function (r) { var a = r.chance(0.25) ? '1' : std(D(mant(r, r.pick([1, 2])), r.chance(0.5) ? -1 : 0)); return verdictMC(r, a, 0, 'ok'); } }],
      shared: function (r) {
        var b = r.chance(0.12) ? { a: '47', n: 3 } : { a: String(r.int(11, 99)).replace(/0$/, '5'), n: r.int(2, 7) };
        var c = r.chance(0.12) ? { a: '0.8', n: -2 } : { a: '0.' + r.int(1, 9), n: -r.int(2, 6) };
        return { b: b, c: c };
      } },
    { num: '10', stem: 'Order each set of numbers from smallest to largest.', parts: [
      { id: '10a', level: 'EMG', make: function (r) {
        var ds = r.chance(0.12) ? [D(6, -5), D(3, -3), D(9, -7)] : (function () { var es = r.sample([-2, -3, -4, -5, -6, -7, -8], 3).sort(function (a, b) { return b - a; }), cs = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3).sort(function (a, b) { return a - b; }); return es.map(function (e, i) { return D(cs[i], e); }); })();
        return orderPart(r, ds, 'Order from <b>smallest</b> to <b>largest</b>: ' + ds.map(function (d) { return t(sciT(d)); }).join(', ') + '.');
      } },
      { id: '10b', level: 'PRG', make: function (r) {
        var ds = r.chance(0.12) ? [D(21, 3), D(5, 3), D(86, 3)] : (function () { var e = r.int(2, 6), c1v, c2v; do { c1v = r.int(11, 49); c2v = r.int(51, 99); } while (c1v % 10 === 0 || c2v % 10 === 0); return [D(c1v, e - 1), D(r.int(c2v > 60 ? 5 : 6, 9), e - 1), D(c2v, e - 1)]; })();
        return orderPart(r, ds, 'Order from <b>smallest</b> to <b>largest</b>: ' + ds.map(function (d) { return t(sciT(d)); }).join(', ') + '.');
      } }] },
    { num: '11', stem: 'Convert each number to the other form (scientific notation ↔ standard notation).', parts: [
      { id: '11a', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(27, 3) : S(mant(r, 2), r.int(3, 6))); } },
      { id: '11b', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(33, -5) : S(mant(r, 2), -r.int(3, 6))); } },
      { id: '11c', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(48, 4) : S(mant(r, 2), r.int(3, 7))); } },
      { id: '11d', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(9, -4) : S(r.int(1, 9), -r.int(2, 6))); } },
      { id: '11e', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(5, 8) : S(r.int(1, 9), r.int(6, 9))); } },
      { id: '11f', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(12, -7) : S(mant(r, 2), -r.int(5, 8))); } }] },
    { num: '12', stem: '', parts: [
      { id: '12', level: 'EMG', make: function (r) {
        var pairs = [['A virus', 'a bacterium', -7, [3, 9], [1, 4]], ['A red blood cell', 'a human hair', -6, [6, 9], [2, 5]], ['A grain of pollen', 'a grain of sand', -5, [6, 9], [1, 5]], ['A bacterium', 'a dust mite', -6, [5, 9], [1, 3]]];
        var pr = r.chance(0.12) ? [pairs[0], 5, 3] : (function () { var q = r.pick(pairs); return [q, r.int(q[3][0], q[3][1]), r.int(q[4][0], q[4][1])]; })();
        var q = pr[0], small = D(pr[1], q[2]), big = D(pr[2], q[2] + 1), sN1 = q[2], sN2 = q[2] + 1, swap = r.chance(0.5);
        var bigName = q[1].replace(/^a /, 'the '), smallName = q[0].replace(/^A /, 'the ');
        var stem = (swap ? cap(q[1]) + ' is measured at ' + t(sciT(big)) + ' m across, while ' + q[0].toLowerCase() + ' is measured at ' + t(sciT(small)) + ' m across.' : q[0] + ' is measured at ' + t(sciT(small)) + ' m across, while ' + q[1] + ' is measured at ' + t(sciT(big)) + ' m across.');
        return P.mc(r, stem + ' Which is larger? Justify your answer by comparing the exponents.', [
          { html: cap(bigName) + ', because ' + t(sN2 + '>' + sN1) + ', so ' + t(sciT(big)) + ' is the larger number.', right: true },
          { html: cap(smallName) + ', because ' + t(pr[1] + '>' + pr[2]) + '.', why: 'Compare the <b>exponents</b> first. The coefficients only matter when the exponents are equal.' },
          { html: cap(smallName) + ', because ' + t(Math.abs(sN1) + '>' + Math.abs(sN2)) + '.', why: 'The exponents are negative: ' + t(sN1 + '<' + sN2) + '. The more negative the exponent, the smaller the number.' },
          { html: 'They are the same size, because the bigger coefficient makes up for the smaller exponent.', why: 'Write both in standard notation: ' + t(stdTex(small)) + ' and ' + t(stdTex(big)) + ' are not equal.' }],
          'Compare exponents: ' + t(sN2 + '>' + sN1) + ', so ' + t(sciT(big)) + ' is larger — ' + t(stdTex(big)) + ' m against ' + t(stdTex(small)) + ' m. ' + cap(bigName) + ' is larger.', ['Compare the exponents first. Which is bigger, ' + t(sN1) + ' or ' + t(sN2) + '?'], 'which larger');
      } }] },
    { num: '13', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '13', level: 'BEG', make: function (r) {
        var d = r.chance(0.12) ? D(38, -8) : S(mant(r, 2), -r.int(4, 8)), n = sN(d), k = -n;
        return P.mc(r, 'The distance across a certain crystal lattice is approximately ' + t(stdTex(d)) + ' m. Written in scientific notation as ' + t('a\\times 10^{n}') + ', the value of ' + t('n') + ' is', [
          { html: t(k), why: 'The number is less than ' + t('1') + ', so the exponent is <b>negative</b>.' },
          { html: t(-k), right: true },
          { html: t(k - 1), why: 'Count the hops to just after the first non-zero digit — and the number is less than ' + t('1') + ', so the exponent is negative.' },
          { html: t(-(k - 1)), why: 'Count the hops to just after the first non-zero digit (' + t(std(coef(d))) + '): there are ' + t(k) + ', not ' + t(k - 1) + '.' }],
          t(stdTex(d) + '=' + sciT(d)) + ': the decimal point moves ' + pl(k, 'place') + ' right, and the number is less than ' + t('1') + ', so ' + t('n=' + n) + '.', SCI_HINTS, 'MC n for ' + std(d), true);
      } }] },
    { num: '14', stem: '<i>(Multiple Choice)</i>', parts: [
      { id: '14', level: 'EMG', make: function (r) {
        var units = [['thousand', 3], ['million', 6], ['million', 6], ['billion', 9]], u = r.chance(0.12) ? units[1] : r.pick(units), m = r.chance(0.12) ? 75 : mant(r, 2), lead = r.pick([1, 2, 2, 3]);
        if (r.chance(0.12) && u[1] === 6) { m = 75; lead = 3; }
        var amount = D(m, lead - 2), d = sh(amount, u[1]), n = sN(d), what = r.pick(['a company’s total sales were approximately', 'a city’s yearly budget was approximately', 'a charity raised approximately', 'a government spent approximately']);
        var c = std(coef(d)), ex2 = function (k) { return t(c + '\\times 10^{' + k + '}'); };
        return P.mc(r, 'In 2024, ' + what + ' ' + t(stdTex(amount)) + ' ' + u[0] + ' dollars. In scientific notation, the number of dollars is', [
          { html: ex2(n - 6), why: 'One ' + u[0] + ' is ' + t('10^{' + u[1] + '}') + '. Write the whole amount out in standard notation first.' },
          { html: ex2(n - 3), why: 'Write the amount out in full: ' + t(stdTex(amount)) + ' ' + u[0] + ' = ' + t(stdTex(d)) + '. Then count the places.' },
          { html: ex2(n), right: true },
          { html: ex2(n + 3), why: 'Count again: ' + t(stdTex(d)) + ' has the decimal point ' + pl(n, 'place') + ' after the first digit.' }],
          t(stdTex(amount)) + ' ' + u[0] + ' ' + t('=' + stdTex(amount) + '\\times 10^{' + u[1] + '}=' + stdTex(d)) + ', and the decimal point moves ' + pl(n, 'place') + ' left: ' + t(sciT(d)) + '.', ['Write the amount in standard notation first: one ' + u[0] + ' is ' + t(stdTex(D(1, u[1]))) + '.'], 'MC ' + std(amount) + ' ' + u[0], true);
      } }] },
    { num: '15', stem: '<i>(Numerical Response)</i>', parts: [
      { id: '15', level: 'EMG', make: function (r) {
        var d = r.chance(0.12) ? D(64, 4) : S(mant(r, 2), r.int(3, 8)), n = sN(d), a = std(coef(d));
        return P.nr('A number written in scientific notation is ' + t('a\\times 10^{n}') + ', where ' + t('a=' + a) + '. If the number in standard form is ' + t(stdTex(d)) + ', the value of ' + t('n') + ' is ________.', n, function (v) {
          if (v === n + 1) return { code: 'counted-digits', hint: 'Count the hops of the decimal point from ' + t(a) + ' to ' + t(stdTex(d)) + ' — not the number of digits.' };
          if (v === -n) return { code: 'exp-sign', hint: t(stdTex(d)) + ' is bigger than ' + t('10') + ', so the exponent is positive.' };
          return null;
        }, 'From ' + t(a) + ' to ' + t(stdTex(d)) + ' the decimal point moves ' + pl(n, 'place') + ' right, so ' + t('n=' + n) + ': ' + t(sciT(d)) + '.', SCI_HINTS, 'NR n for ' + std(d));
      } }] }
  ];
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* "is a × 10^n correct?" kind: 'ok' | 'big' (coefficient ≥ 10) | 'small' (coefficient < 1) */
  function verdictMC(r, a, n, kind) {
    var tex = a + '\\times 10^{' + n + '}', av = Number(a);
    var opts = [
      { html: 'Correct — the coefficient is at least ' + t('1') + ' and less than ' + t('10') + '.', right: kind === 'ok', why: kind === 'big' ? 'Look at the coefficient: ' + t(a + '\\ge 10') + '.' : kind === 'small' ? 'Look at the coefficient: ' + t(a + '<1') + '.' : null },
      { html: 'Not correct — the coefficient is ' + t('10') + ' or more.', right: kind === 'big', why: kind === 'big' ? null : t(a) + ' is less than ' + t('10') + '.' },
      { html: 'Not correct — the coefficient is less than ' + t('1') + '.', right: kind === 'small', why: kind === 'small' ? null : t(a) + ' is not less than ' + t('1') + '.' },
      n === 0 ? { html: 'Not correct — the exponent can’t be ' + t('0') + '.', why: 'The exponent can be any integer, ' + t('0') + ' included: ' + t('10^{0}=1') + ', so ' + t(tex + '=' + a) + '.' }
        : n < 0 ? { html: 'Not correct — the exponent can’t be negative.', why: 'Negative exponents are fine: they give numbers less than ' + t('1') + ', like ' + t('3.2\\times 10^{-4}=0.00032') + '.' }
          : { html: 'Not correct — the coefficient must be a whole number.', why: 'Decimals are fine in the coefficient, like ' + t('6.2\\times 10^{4}') + ' — it just has to be at least ' + t('1') + ' and less than ' + t('10') + '.' }];
    var sol = kind === 'ok' ? t('1\\le ' + a + '<10') + ', so ' + t(tex) + ' <b>is</b> correctly written' + (n === 0 ? ' (an exponent of ' + t('0') + ' is allowed: ' + t('10^{0}=1') + ', so it is just ' + t(a) + ').' : '.')
      : 'Not correct: ' + (kind === 'big' ? t(a + '\\ge 10') : t(a + '<1')) + '. Correctly: ' + t(tex + '=' + sciT(sh(dec(a), n))) + '.';
    return P.mc(r, 'Is ' + t(tex) + ' correctly written in scientific notation?', opts, sol, ['In scientific notation the coefficient ' + t('a') + ' must satisfy ' + t('1\\le a<10') + ', and the exponent can be any integer.'], 'verdict ' + a + 'e' + n, true);
  }
  function fixPart(a, n) {
    var d = sh(dec(a), n), tex = a + '\\times 10^{' + n + '}', c = dec(a), k = sN(c);
    var p = sciPart('Rewrite ' + t(tex) + ' correctly in scientific notation.', d, cands([[sh(d, -2 * k), 'renorm-dir', k > 0 ? 'The coefficient got <b>smaller</b> (' + t(a + '\\to ' + std(coef(c))) + '), so the exponent must get <b>bigger</b> to keep the value the same.' : 'The coefficient got <b>bigger</b> (' + t(a + '\\to ' + std(coef(c))) + '), so the exponent must get <b>smaller</b> to keep the value the same.']]),
      t(a + '=' + sciT(c)) + ', so ' + t(tex + '=' + sciT(c) + '\\times 10^{' + n + '}=' + sciT(d)) + '.', ['Write the coefficient itself in scientific notation first: ' + t(a + '=' + sciT(c)) + '.', 'The value must not change: if the coefficient shrinks, the exponent must grow (and the reverse).'], 'fix ' + a + 'e' + n);
    p.bad = [sciT(sh(d, -2 * k)), tex];
    return p;
  }

  /* ---------- Extra practice 8 ---------- */
  var extra = [
    { num: '1', section: 'Extra practice A — Conversions, and answers that are not finished', stem: 'An answer is only in scientific notation when it has the form ' + t('a\\times 10^{n}') + ' with ' + t('n') + ' an integer and ' + t('1\\le a<10') + '. Write each number in scientific notation.', parts: [
      { id: 'e1a', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(705, -9) : S(Number(r.int(1, 9) + '0' + r.int(1, 9)), -r.int(6, 8))); } },
      { id: 'e1b', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(1234, 4) : S(mant(r, 4), r.int(6, 8))); } },
      { id: 'e1c', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(602, 7) : S(Number(r.int(1, 9) + '0' + r.int(1, 9)), r.int(8, 10))); } },
      { id: 'e1d', level: 'BEG', make: function (r) { return toSci(r.chance(0.12) ? D(9, -10) : S(r.int(1, 9), -r.int(8, 10))); } },
      { id: 'e1e', level: 'EMG', make: function (r) { return toSci(r.chance(0.12) ? D(805, -1) : S(Number(r.int(1, 9) + '0' + r.int(1, 9)), 1)); } }] },
    { num: '2', stem: 'Write each number in standard notation. Watch the placeholder zeros in (c).', parts: [
      { id: 'e2a', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(306, -7) : S(Number(r.int(1, 9) + '0' + r.int(1, 9)), -r.int(4, 6))); } },
      { id: 'e2b', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(72, 6) : S(mant(r, 2), r.int(6, 8))); } },
      { id: 'e2c', level: 'EMG', make: function (r) { return toStd(r.chance(0.12) ? D(5004, -6) : S(Number(r.int(1, 9) + '00' + r.int(1, 9)), -r.int(2, 4))); } },
      { id: 'e2d', level: 'BEG', make: function (r) { return toStd(r.chance(0.12) ? D(11, -7) : S(mant(r, 2), -r.int(5, 7))); } }] },
    { num: '3', stem: function (sh0) { return 'None of these numbers is written correctly in scientific notation: (a) ' + t(sh0.v[0].tex) + ' &nbsp; (b) ' + t(sh0.v[1].tex) + ' &nbsp; (c) ' + t(sh0.v[2].tex) + ' &nbsp; (d) ' + t(sh0.v[3].tex) + '. The value must not change — if you shrink the coefficient, the exponent must grow.'; },
      shared: function (r) {
        if (r.chance(0.12)) return { v: [{ a: '45', n: 6 }, { a: '0.62', n: -3 }, { a: '18.4', n: -5 }, { a: '0.05', n: 8 }].map(function (x) { x.tex = x.a + '\\times 10^{' + x.n + '}'; return x; }) };
        var v = [{ a: String(r.int(11, 99)).replace(/0$/, '5'), n: r.int(3, 8) }, { a: '0.' + mant(r, 2), n: -r.int(2, 6) }, { a: std(D(r.int(101, 999), -1)).replace(/\.0$/, '.5'), n: -r.int(2, 7) }, { a: '0.0' + r.int(1, 9), n: r.int(4, 9) }];
        v.forEach(function (x) { x.tex = x.a + '\\times 10^{' + x.n + '}'; });
        return { v: v };
      },
      parts: [
        { id: 'e3a', level: 'EMG', make: function (r, sh0) { return fixPart(sh0.v[0].a, sh0.v[0].n, '(a)'); } },
        { id: 'e3b', level: 'EMG', make: function (r, sh0) { return fixPart(sh0.v[1].a, sh0.v[1].n); } },
        { id: 'e3c', level: 'EMG', make: function (r, sh0) { return fixPart(sh0.v[2].a, sh0.v[2].n); } },
        { id: 'e3d', level: 'PRG', make: function (r, sh0) { return fixPart(sh0.v[3].a, sh0.v[3].n); } },
        { id: 'e3e', level: 'EMG', make: function (r, sh0) {
          var rows = sh0.v.map(function (x, i) { return { id: 'r' + i, html: '(' + 'abcd'[i] + ') ' + t(x.tex) }; }), want = {};
          sh0.v.forEach(function (x, i) { want['r' + i] = Number(x.a) >= 10 ? 'big' : 'small'; });
          return P.grid('For each number in (a)–(d), what is wrong with the coefficient?', rows, [{ id: 'big', html: 'It is ' + t('10') + ' or more' }, { id: 'small', html: 'It is less than ' + t('1') }], want, { colHead: 'The coefficient…' },
            sh0.v.map(function (x, i) { return '(' + 'abcd'[i] + ') ' + t(x.a + (Number(x.a) >= 10 ? '\\ge 10' : '<1')) + ', so ' + t(x.tex + '=' + sciT(sh(dec(x.a), x.n))); }).join('<br>'),
            ['In scientific notation the coefficient must be at least ' + t('1') + ' and less than ' + t('10') + '. Which side does each coefficient miss on?'], 'what is wrong');
        } }] },
    { num: '4', section: 'Extra practice B — Multiplying and dividing (Preview of Lesson 10)', stem: 'Multiply the coefficients and add the exponents. The result is often <b>not yet</b> in scientific notation, e.g. ' + t('(6\\times 10^{4})(5\\times 10^{7})=30\\times 10^{11}=3\\times 10^{12}') + '. Multiply, and write each answer in scientific notation.', parts: [
      { id: 'e4a', level: 'EMG', make: function (r) { var v = find(r, function () { return [A_(c1(r), r.int(2, 9)), A_(c1(r), r.int(2, 9))]; }, function (v) { return v[0].c.m * v[1].c.m < 10; }, [A_(2, 5), A_(3, 8)]); return opPart(v[0], v[1], 'mul'); } },
      { id: 'e4b', level: 'PRG', make: function (r) { var v = find(r, function () { var x = r.pick([[4, '2.5'], [2, '5'], [8, '1.25'], [5, '2'], [2.5, '4'], [5, '4'], [8, '2.5'], [4, '5']]); return [A_(dec(String(x[0])), r.int(3, 8)), A_(x[1], r.int(2, 6))]; }, function () { return true; }, [A_(4, 6), A_('2.5', 3)]); return opPart(v[0], v[1], 'mul'); } },
      { id: 'e4c', level: 'EMG', make: function (r) { var v = find(r, function () { return [A_(c1(r), -r.int(2, 6)), A_(c1(r), -r.int(2, 8))]; }, function (v) { return v[0].c.m * v[1].c.m < 10; }, [A_(3, -4), A_(2, -7)]); return opPart(v[0], v[1], 'mul'); } },
      { id: 'e4d', level: 'PRG', make: function (r) { var v = find(r, function () { return [A_(c1(r), r.int(5, 10)), A_(c1(r), -r.int(2, 6))]; }, function (v) { return (v[0].c.m * v[1].c.m) % 10 === 0; }, [A_(5, 9), A_(8, -4)]); return opPart(v[0], v[1], 'mul'); } }] },
    { num: '5', stem: 'Multiply. <b>Every part here needs renormalising</b> — the first coefficient you get will be ' + t('10') + ' or larger.', parts: [
      { id: 'e5a', level: 'PRG', make: function (r) { var v = find(r, function () { return [A_(c1(r), r.int(2, 6)), A_(c1(r), r.int(2, 7))]; }, function (v) { var p = v[0].c.m * v[1].c.m; return p >= 10 && p % 10 !== 0; }, [A_(7, 3), A_(8, 5)]); return opPart(v[0], v[1], 'mul'); } },
      { id: 'e5b', level: 'PRG', make: function (r) { var v = find(r, function () { return [A_(c1(r), -r.int(3, 8)), A_(c1(r), -r.int(1, 4))]; }, function (v) { var p = v[0].c.m * v[1].c.m; return p >= 10 && p % 10 !== 0; }, [A_(9, -6), A_(4, -2)]); return opPart(v[0], v[1], 'mul'); } },
      { id: 'e5c', level: 'PRG', make: function (r) { var v = find(r, function () { return [A_(c2(r), r.int(5, 9)), A_(c1(r), -r.int(2, 4))]; }, function (v) { var C = mul(v[0].c, v[1].c); return !inRange(C) && nd(C) <= 3; }, [A_('2.5', 7), A_(6, -3)]); return opPart(v[0], v[1], 'mul'); } },
      { id: 'e5d', level: 'PRG', make: function (r) { var v = find(r, function () { return [A_(c2(r), -r.int(3, 7)), A_(c1(r), r.int(6, 10))]; }, function (v) { var C = mul(v[0].c, v[1].c); return !inRange(C) && nd(C) <= 3; }, [A_('8.4', -5), A_(5, 9)]); return opPart(v[0], v[1], 'mul'); } }] },
    { num: '6', stem: 'Divide: divide the coefficients and subtract the exponents. In parts (b) and (c) the coefficient comes out <b>less</b> than ' + t('1') + ', so the exponent must go <b>down</b> by one.', parts: [
      { id: 'e6a', level: 'EMG', make: function (r) { var v = find(r, function () { var q = r.int(2, 4), b = r.int(2, 3); return [A_(q * b, r.int(6, 10)), A_(b, r.int(2, 5))]; }, function (v) { return v[0].c.m < 10; }, [A_(8, 9), A_(2, 4)]); return opPart(v[0], v[1], 'frac'); } },
      { id: 'e6b', level: 'PRG', make: function (r) { var v = find(r, function () { var b = r.int(2, 9), q = D(r.int(1, 9), -1), a = mul(q, D(b, 0)); return [A_(a, r.int(4, 8)), A_(b, -r.int(1, 3))]; }, function (v) { return inRange(v[0].c) && nd(v[0].c) <= 2; }, [A_(3, 6), A_(6, -2)]); return opPart(v[0], v[1], 'frac'); } },
      { id: 'e6c', level: 'PRG', make: function (r) { var v = find(r, function () { var b = r.int(2, 9), q = D(r.int(1, 9), -1), a = mul(q, D(b, 0)); return [A_(a, -r.int(2, 5)), A_(b, r.int(3, 6))]; }, function (v) { return inRange(v[0].c) && nd(v[0].c) <= 2; }, [A_('1.2', -3), A_(4, 5)]); return opPart(v[0], v[1], 'frac'); } },
      { id: 'e6d', level: 'EMG', make: function (r) { var v = find(r, function () { var b = c2(r), q = D(r.int(2, 6), 0), a = mul(q, b); return [A_(a, r.int(6, 9)), A_(b, -r.int(2, 4))]; }, function (v) { return inRange(v[0].c) && nd(v[0].c) <= 2; }, [A_('9.6', 8), A_('1.6', -3)]); return opPart(v[0], v[1], 'frac'); } }] },
    { num: '7', stem: 'Evaluate each power. Apply the exponent to <b>both</b> the coefficient and the power of ten, then renormalise.', parts: [
      { id: 'e7a', level: 'PRG', make: function (r) { return r.chance(0.12) ? powPart(A_(3, -4), 3) : powPart(A_(r.pick([2, 3, 4, 5]), -r.int(1, 6)), 3); } },
      { id: 'e7b', level: 'PRG', make: function (r) { return r.chance(0.12) ? powPart(A_(2, 5), 4) : powPart(A_(r.pick([2, 3, 4, 5]), r.int(1, 7)), 4); } },
      { id: 'e7c', level: 'PRG', make: function (r) { return r.chance(0.12) ? powPart(A_(5, -3), 2) : powPart(A_(r.int(4, 9), r.pick([1, -1]) * r.int(2, 6)), 2); } }] },
    { num: '8', stem: '<b>Comparing magnitudes.</b> “How many times larger?” is a division question. Divide the larger number by the smaller one and leave the answer in scientific notation.', parts: [
      { id: 'e8a', level: 'EMG', make: function (r) { var v = find(r, function () { var q = r.int(2, 4), b = r.int(2, 3); return [A_(q * b, r.int(6, 10)), A_(b, r.int(2, 5))]; }, function (v) { return v[0].c.m < 10; }, [A_(6, 8), A_(2, 5)]); return timesPart(v[0], v[1]); } },
      { id: 'e8b', level: 'EMG', make: function (r) { var v = find(r, function () { var q = r.int(2, 3), b = r.int(2, 4); return [A_(q * b, -r.int(1, 3)), A_(b, -r.int(5, 8))]; }, function (v) { return v[0].c.m < 10; }, [A_(9, -2), A_(3, -7)]); return timesPart(v[0], v[1]); } },
      { id: 'e8c', level: 'PRG', make: function (r) { var v = find(r, function () { var b = r.int(2, 9), q = D(r.int(1, 9), -1), a = mul(q, D(b, 0)); return [A_(a, r.int(9, 12)), A_(b, r.int(4, 7))]; }, function (v) { return inRange(v[0].c) && nd(v[0].c) <= 2; }, [A_('1.5', 11), A_(5, 6)]); return timesPart(v[0], v[1]); } }] },
    { num: '9', section: 'Extra practice C — Adding and subtracting (Preview of Lesson 10)', stem: 'You can’t add the exponents here: the two numbers must have the <b>same</b> power of ten. Then add or subtract the coefficients and renormalise if needed, e.g. ' + t('3.2\\times 10^{5}+4\\times 10^{4}=3.2\\times 10^{5}+0.4\\times 10^{5}=3.6\\times 10^{5}') + '. Add or subtract — the exponents already match, but check your final coefficient in (c).', parts: [
      { id: 'e9a', level: 'EMG', make: function (r) { var v = find(r, function () { var e = r.int(3, 8); return [A_(c2(r), e), A_(c2(r), e)]; }, function (v) { return inRange(add(v[0].c, v[1].c)); }, [A_('4.2', 6), A_('3.5', 6)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: 1 }]); } },
      { id: 'e9b', level: 'EMG', make: function (r) { var v = find(r, function () { var e = -r.int(2, 7); return [A_(c2(r), e), A_(c2(r), e)]; }, function (v) { var d = add(v[0].c, neg(v[1].c)); return d.m > 0 && inRange(d); }, [A_('8.1', -4), A_('2.6', -4)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: -1 }]); } },
      { id: 'e9c', level: 'PRG', make: function (r) { var v = find(r, function () { var e = r.int(2, 7); return [A_(c2(r), e), A_(c2(r), e)]; }, function (v) { return !inRange(add(v[0].c, v[1].c)); }, [A_('6.5', 3), A_('5.8', 3)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: 1 }]); } }] },
    { num: '10', stem: 'Add or subtract. Match the exponents first.', parts: [
      { id: 'e10a', level: 'PRG', make: function (r) { var v = find(r, function () { var e = r.int(4, 8); return [A_(c1(r), e), A_(c1(r), e - 1)]; }, function () { return true; }, [A_(5, 7), A_(3, 6)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: 1 }]); } },
      { id: 'e10b', level: 'PRG', make: function (r) { var v = find(r, function () { var e = -r.int(2, 5); return [A_(c2(r), e), A_(c1(r), e - 1)]; }, function (v) { var d = add(full(v[0]), neg(full(v[1]))); return d.m > 0 && sN(d) === v[0].p; }, [A_('7.2', -3), A_(4, -4)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: -1 }]); } },
      { id: 'e10c', level: 'PRG', make: function (r) { var v = find(r, function () { var e = r.int(3, 7); return [A_(c1(r), e), A_(c2(r), e - 1)]; }, function (v) { return sN(add(full(v[0]), full(v[1]))) === v[0].p; }, [A_(9, 5), A_('2.5', 4)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: 1 }]); } },
      { id: 'e10d', level: 'PRG', make: function (r) { var v = find(r, function () { var e = -r.int(2, 5); return [A_(c2(r), e), A_(c1(r), e - 1)]; }, function (v) { return sN(add(full(v[0]), full(v[1]))) === v[0].p; }, [A_('1.4', -2), A_(6, -3)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: 1 }]); } }] },
    { num: '11', stem: 'Add or subtract. In part (b) the subtraction leaves a coefficient smaller than ' + t('1') + ', so the exponent must drop.', parts: [
      { id: 'e11a', level: 'PRG', make: function (r) { var v = find(r, function () { var e = r.int(4, 9); return [A_(c1(r), e), A_(c1(r), e - 1)]; }, function (v) { return v[0].c.m * 10 > v[1].c.m && sN(add(full(v[0]), neg(full(v[1])))) === v[0].p; }, [A_(3, 8), A_(4, 7)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: -1 }]); } },
      { id: 'e11b', level: 'ADV', make: function (r) { var v = find(r, function () { var e = -r.int(3, 7), a = D(100 + r.int(1, 9), -2), b = D(r.int(5, 9), 0); return [A_(a, e), A_(b, e - 1)]; }, function (v) { var d = add(full(v[0]), neg(full(v[1]))); return d.m > 0 && sN(d) === v[0].p - 1; }, [A_('1.02', -5), A_(9, -6)]); return sumPart([{ A: v[0], s: 1 }, { A: v[1], s: -1 }]); } },
      { id: 'e11c', level: 'PRG', make: function (r) { var e = r.int(3, 6), v = r.chance(0.12) ? [A_(2, 4), A_(7, 3), A_(5, 2)] : [A_(r.int(1, 8), e), A_(r.int(1, 9), e - 1), A_(r.int(1, 9), e - 2)]; return sumPart(v.map(function (A) { return { A: A, s: 1 }; })); } }] },
    { num: '12', section: 'Extra practice D — Ordering and working backwards', stem: 'Order each list from <b>smallest to largest</b>. Compare exponents first; compare coefficients only when the exponents are equal.', parts: [
      { id: 'e12a', level: 'PRG', make: function (r) {
        var ds = r.chance(0.12) ? [D(5, -3), D(2, 4), D(8, -5), D(15, -4), D(9, 3), D(4, -4)] : (function () {
          var e1 = -r.int(2, 4), e2 = r.int(3, 5), es = [e1, e1, e1 - 2, e1 - 1, e2, e2 + 1], cs = r.sample([2, 3, 4, 5, 6, 7, 8, 9], 6);
          var a = Math.min(cs[0], cs[1]), b = Math.max(cs[0], cs[1]);
          return [D(b, e1), D(cs[4], e2 + 1), D(cs[2], e1 - 2), D(a * 10 + 5, e1 - 1), D(cs[5], e2), D(cs[3], e1 - 1)];
        })();
        return orderPart(r, ds, 'Order from <b>smallest</b> to <b>largest</b>: ' + ds.map(function (d) { return t(sciT(d)); }).join(', ') + '.');
      } },
      { id: 'e12b', level: 'PRG', make: function (r) {
        var ds = r.chance(0.12) ? [D(62, -7), D(62, -6), D(59, -6), D(7, -6)] : (function () {
          var e = -r.int(3, 7), a, b; do { a = c2(r); } while (a.m < 15); do { b = c2(r); } while (b.m >= a.m || a.m - b.m > 30);
          var c = D(r.int(Math.ceil(a.m / 10) + 1, 9), 0);
          if (val(c) <= val(a)) c = D(9, 0);
          return [sh(a, e), sh(a, e + 1), sh(b, e + 1), sh(c, e)];
        })();
        return orderPart(r, ds, 'Order from <b>smallest</b> to <b>largest</b>: ' + ds.map(function (d) { return t(sciT(d)); }).join(', ') + '.');
      } }] },
    { num: '13', stem: 'Determine the missing value in each statement.', parts: [
      { id: 'e13a', level: 'EMG', make: function (r) { var d = r.chance(0.12) ? D(34, 4) : S(mant(r, 2), r.int(3, 7)), n = sN(d), a = std(coef(d)); return P.number(t('n\\times 10^{' + n + '}=' + stdTex(d)), Number(a), function (v) { if (relEq(v, val(d))) return { code: 'value', hint: t('n') + ' is the coefficient: the number in front of ' + t('10^{' + n + '}') + '.' }; if (relEq(v, Number(a) * 10) || relEq(v, Number(a) / 10)) return { code: 'places', hint: 'Check the decimal point: moving it ' + pl(n, 'place') + ' right from ' + t('n') + ' must give ' + t(stdTex(d)) + '.' }; return null; }, t(stdTex(d) + '=' + sciT(d)) + ', so ' + t('n=' + a) + '.', SCI_HINTS, 'missing coef ' + std(d), { before: t('n=') }); } },
      { id: 'e13b', level: 'EMG', make: function (r) { var d = r.chance(0.12) ? D(71, -5) : S(mant(r, 2), -r.int(2, 6)), n = sN(d), a = std(coef(d)); return P.number(t(a + '\\times 10^{n}=' + stdTex(d)), n, function (v) { if (v === -n) return { code: 'exp-sign', hint: t(stdTex(d)) + ' is less than ' + t('1') + ', so the exponent is negative.' }; if (v === n - 1 || v === n + 1) return { code: 'counted-digits', hint: 'Count the hops from ' + t(a) + ' to ' + t(stdTex(d)) + ', one at a time.' }; return null; }, t(stdTex(d) + '=' + sciT(d)) + ': the decimal point moves ' + pl(-n, 'place') + ' right, so ' + t('n=' + n) + '.', SCI_HINTS, 'missing exp ' + std(d), { before: t('n=') }); } },
      { id: 'e13c', level: 'EMG', make: function (r) { var d = r.chance(0.12) ? D(92, -4) : S(mant(r, 2), -r.int(2, 5)), n = sN(d), a = std(coef(d)); return P.number(t('n\\times 10^{' + n + '}=' + stdTex(d)), Number(a), function (v) { if (relEq(v, val(d))) return { code: 'value', hint: t('n') + ' is the coefficient: the number in front of ' + t('10^{' + n + '}') + '.' }; if (relEq(v, Number(a) * 10) || relEq(v, Number(a) / 10)) return { code: 'places', hint: 'Check the decimal point: ' + t('n\\times 10^{' + n + '}') + ' moves it ' + pl(-n, 'place') + ' left.' }; return null; }, t(stdTex(d) + '=' + sciT(d)) + ', so ' + t('n=' + a) + '.', SCI_HINTS, 'missing coef ' + std(d), { before: t('n=') }); } },
      { id: 'e13d', level: 'EMG', make: function (r) { var d = r.chance(0.12) ? D(25, 5) : S(mant(r, 2), r.int(4, 8)), n = sN(d), a = std(coef(d)); return P.number(t(a + '\\times 10^{n}=' + stdTex(d)), n, function (v) { if (v === -n) return { code: 'exp-sign', hint: t(stdTex(d)) + ' is bigger than ' + t('10') + ', so the exponent is positive.' }; if (v === n + 1) return { code: 'counted-digits', hint: 'Count the hops of the decimal point, not the digits.' }; return null; }, t(stdTex(d) + '=' + sciT(d)) + ', so ' + t('n=' + n) + '.', SCI_HINTS, 'missing exp ' + std(d), { before: t('n=') }); } }] },
    { num: '14', stem: function (sh0) { return '<i>(Preview of Lesson 10)</i> <b>What happens when you double?</b> Suppose a number is written as ' + t('a\\times 10^{b}') + ' in proper scientific notation.'; },
      shared: function (r) { return r.chance(0.12) ? { lo: D(3, 0), hi: D(6, 0), p: 7 } : { lo: D(r.pick([r.int(1, 4), mant(r, 2) % 50 < 10 ? r.int(1, 4) : Number(std(D(r.int(11, 49), -1)))]), 0), hi: D(r.pick([r.int(5, 9), Number(std(D(r.int(51, 99), -1)))]), 0), p: r.int(3, 9) }; },
      parts: [
        { id: 'e14a', level: 'EMG', make: function (r, sh0) { var A = A_(sh0.lo.m < 10 && sh0.lo.e === 0 ? sh0.lo : coef(sh0.lo), sh0.p); A = A_(dec(std(sh0.lo)), sh0.p); var Rr = sh(mul(A.c, D(2, 0)), A.p); return sciPart('Double ' + t(cTex(A)) + ' and write the result in scientific notation.', Rr, cands([[sh(A.c, A.p + 1), 'u2l8-doublings', 'Doubling multiplies the number by ' + t('2') + ', not by ' + t('10') + ': double the coefficient.'], [sh(A.c, 2 * A.p), 'mult-exp', 'Doubling doesn’t touch the exponent unless the coefficient reaches ' + t('10') + '.']]), t('2\\times ' + cTex(A) + '=' + pt(mul(A.c, D(2, 0)), A.p)) + '. The coefficient doubled and is still less than ' + t('10') + ', so the exponent is unchanged.', ['Doubling means multiplying by ' + t('2') + ': double the coefficient.'], 'double ' + sciPlain(full(A))); } },
        { id: 'e14b', level: 'PRG', make: function (r, sh0) { var A = A_(dec(std(sh0.hi)), sh0.p), C = mul(A.c, D(2, 0)), Rr = sh(C, A.p); var p = sciPart('Double ' + t(cTex(A)) + ' and write the result in scientific notation.', Rr, cands([renormItem(C, A.p, Rr)]), t('2\\times ' + cTex(A) + '=' + pt(C, A.p)) + '. ' + renormText(C, A.p, Rr) + ' This time the coefficient doubled past ' + t('10') + ', so renormalising raised the exponent by ' + t('1') + '.', ['Double the coefficient, then check: is it still less than ' + t('10') + '?'], 'double ' + sciPlain(full(A))); p.bad.push(stdTex(C) + '\\times10^{' + A.p + '}'); return p; } },
        { id: 'e14c', level: 'MAS', make: function (r, sh0) {
          var lo2 = std(sh0.lo), hi2 = std(sh0.hi);
          return P.number('Doubling ' + t(lo2 + '\\times 10^{' + sh0.p + '}') + ' kept the exponent, but doubling ' + t(hi2 + '\\times 10^{' + sh0.p + '}') + ' raised it. In general, doubling ' + t('a\\times 10^{b}') + ' raises the exponent exactly when ' + t('a\\ge') + ' some value. What is that value?', 5, function (v) {
            if (v === 10) return { code: 'value', hint: 'It is the <b>doubled</b> coefficient that has to reach ' + t('10') + ': ' + t('2a\\ge 10') + '.' };
            if (v > 5 && v < 10) return { code: 'value', hint: 'Try ' + t('a=5') + ': ' + t('2\\times 5=10') + ', which already needs renormalising. Solve ' + t('2a\\ge 10') + '.' };
            if (v < 5 && v >= 1) return { code: 'value', hint: 'Try ' + t('a=' + v) + ': ' + t('2\\times ' + v + '=' + 2 * v) + ' is still less than ' + t('10') + ', so the exponent doesn’t change.' };
            return null;
          }, 'Doubling gives ' + t('2a\\times 10^{b}') + '. The exponent changes only if ' + t('2a') + ' is no longer less than ' + t('10') + ', i.e. ' + t('2a\\ge 10') + ', so ' + t('a\\ge 5') + '. For ' + t('1\\le a<5') + ' the doubled coefficient stays below ' + t('10') + ' (like ' + t(std(sh0.lo) + '\\to ' + std(mul(dec(std(sh0.lo)), D(2, 0)))) + '); for ' + t('5\\le a<10') + ' it reaches ' + t('10') + ' or more (like ' + t(std(sh0.hi) + '\\to ' + std(mul(dec(std(sh0.hi)), D(2, 0)))) + '), so the exponent goes up by ' + t('1') + '.',
            ['After doubling, the coefficient is ' + t('2a') + '. When does ' + t('2a') + ' stop being less than ' + t('10') + '?'], 'doubling threshold', { before: t('a\\ge') });
        } }] },
    { num: '15', section: 'Extra practice E — Real-world data (Preview of Lesson 10)', stem: function (sh0) { return sh0.what + ' Light (and radio) travels at about ' + t('3\\times 10^{5}') + ' km/s.'; },
      shared: function (r) {
        var opts = [['The Sun is about ' + t('1.5\\times 10^{8}') + ' km from Earth.', '1.5', 8, 'sunlight to reach Earth'], ['Mars is about ' + t('2.25\\times 10^{8}') + ' km from the Sun.', '2.25', 8, 'sunlight to reach Mars'], ['Jupiter is about ' + t('7.8\\times 10^{8}') + ' km from the Sun.', '7.8', 8, 'sunlight to reach Jupiter'], ['Saturn is about ' + t('1.44\\times 10^{9}') + ' km from the Sun.', '1.44', 9, 'sunlight to reach Saturn'], ['Venus is about ' + t('1.08\\times 10^{8}') + ' km from the Sun.', '1.08', 8, 'sunlight to reach Venus'], ['Mercury is about ' + t('5.7\\times 10^{7}') + ' km from the Sun.', '5.7', 7, 'sunlight to reach Mercury']];
        if (r.chance(0.35)) return { what: opts[0][0], c: dec(opts[0][1]), p: opts[0][2], q: opts[0][3] };
        var o = r.chance(0.4) ? r.pick(opts) : (function () { var c = std(D(3 * r.int(2, 30), -1)), p = r.int(7, 10); while (Number(c) >= 10) c = std(D(3 * r.int(2, 30), -1)); return ['A space probe is about ' + t(c + '\\times 10^{' + p + '}') + ' km from Earth.', c, p, 'a radio signal from the probe to reach Earth']; })();
        return { what: o[0], c: dec(o[1]), p: o[2], q: o[3] };
      },
      parts: [
        { id: 'e15a', level: 'PRG', make: function (r, sh0) { var A = A_(sh0.c, sh0.p), B = A_(3, 5); return opPart(A, B, 'frac', 'How many seconds does it take for ' + sh0.q + '? Give the answer in scientific notation.'); } },
        { id: 'e15b', level: 'EMG', make: function (r, sh0) {
          var secs = val(sh(div(sh0.c, D(3, 0)), sh0.p - 5)), mins = secs / 60;
          return P.approx('<i>(calculator)</i> Convert your answer to (a) into minutes, rounded to one decimal place.', mins, 1, { after: 'min', diag: function (v) { if (Math.abs(v - secs / 100) < 0.051) return { code: 'value', hint: 'There are ' + t('60') + ' seconds in a minute, not ' + t('100') + '.' }; if (Math.abs(v - secs * 60) < 1) return { code: 'value', hint: 'Seconds to minutes: <b>divide</b> by ' + t('60') + '.' }; return null; } },
            t(sciT(D(Math.round(secs), 0)) + '\\text{ s}=' + F(Math.round(secs)) + '\\text{ s}') + ', and ' + t(F(Math.round(secs)) + '\\div 60\\approx ' + K.roundTo(mins, 1).toFixed(1)) + ' minutes.', ['Write the answer to (a) in standard notation, then divide by ' + t('60') + '.'], 'light time minutes');
        } }] },
    { num: '16', stem: function (sh0) { return 'A ' + sh0.a[0] + ' has a mass of about ' + t(sh0.a[1] + '\\times 10^{' + sh0.a[2] + '}') + ' kg and ' + (/^[aeiou]/.test(sh0.b[0]) ? 'an ' : 'a ') + sh0.b[0] + ' has a mass of about ' + t(sh0.b[1] + '\\times 10^{' + sh0.b[2] + '}') + ' kg.'; },
      shared: function (r) {
        var list = [['proton', '1.67', -27], ['electron', '9.1', -31], ['alpha particle', '6.64', -27], ['muon', '1.88', -28], ['water molecule', '2.99', -26], ['carbon atom', '1.99', -26], ['oxygen molecule', '5.31', -26], ['gold atom', '3.27', -25], ['glucose molecule', '2.99', -25]];
        if (r.chance(0.2)) return { a: list[0], b: list[1] };
        var pair = find(r, function () { return r.sample(list, 2); }, function (p) { var ra = Number(p[0][1]) * Math.pow(10, p[0][2]) / (Number(p[1][1]) * Math.pow(10, p[1][2])); return ra > 1.5 && p[0][1] !== p[1][1] || ra > 1.5 && p[0][2] !== p[1][2]; });
        return { a: pair[0], b: pair[1] };
      },
      parts: [
        { id: 'e16a', level: 'PRG', make: function (r, sh0) { var k = r.chance(0.2) ? 3 : r.int(2, 9), e = r.int(5, 12), A = A_(sh0.a[1], sh0.a[2]), B = A_(k, e); return opPart(A, B, 'mul', 'Determine the total mass of ' + t(k + '\\times 10^{' + e + '}') + ' ' + sh0.a[0] + 's, in scientific notation.'); } },
        { id: 'e16b', level: 'ADV', make: function (r, sh0) {
          var A = val(A_(sh0.a[1], sh0.a[2]).c) * Math.pow(10, sh0.a[2]), B = Number(sh0.b[1]) * Math.pow(10, sh0.b[2]), x = A / B, wrongWay = B / A;
          var parts = K.sciParts(x), a1 = Number(parts.a.toPrecision(2)), key = K.sciTex(x, 2);
          var p = P.sci('<i>(calculator)</i> How many times more massive is the ' + sh0.a[0] + ' than the ' + sh0.b[0] + '? Round your coefficient to one decimal place.', x, { sig: 2, diag: function (v) { if (relEq(v, Number(wrongWay.toPrecision(2)), 1e-6) || relEq(v, wrongWay, 1e-3)) return { code: 'flip-ratio', hint: 'Divide the <b>larger</b> mass by the smaller one: ' + t(sh0.a[1] + '\\times 10^{' + sh0.a[2] + '}\\div ' + sh0.b[1] + '\\times 10^{' + sh0.b[2] + '}') + '.' }; return null; } },
            t('\\dfrac{' + sh0.a[1] + '\\times 10^{' + sh0.a[2] + '}}{' + sh0.b[1] + '\\times 10^{' + sh0.b[2] + '}}') + ': coefficients ' + t(sh0.a[1] + '\\div ' + sh0.b[1] + '\\approx ' + Number((Number(sh0.a[1]) / Number(sh0.b[1])).toPrecision(3))) + ', exponents ' + t(sh0.a[2] + '-(' + sh0.b[2] + ')=' + (sh0.a[2] - sh0.b[2])) + '.<br>So the ratio is about ' + t(key) + ' (rounded to one decimal place in the coefficient).',
            ['“How many times more massive” means divide the larger mass by the smaller one.', 'Divide the coefficients, subtract the exponents, then renormalise and round the coefficient.'], 'mass ratio');
          p.bad = [K.sciTex(wrongWay, 2)];
          return p;
        } }] },
    { num: '17', stem: '', parts: [
      { id: 'e17', level: 'MAS', make: function (r) {
        var g = r.chance(0.15) ? { c: 5, T: 20, n: 10 } : { c: r.int(1, 9), T: r.pick([10, 15, 20, 30]), n: r.int(4, 10) };
        var start = D(g.c, 3), tot = g.T * g.n, two = Math.pow(2, g.n), Rr = mul(start, D(two, 0));
        var p = sciPart('<i>(calculator)</i> A bacterial culture starts with ' + t(g.c + '\\times 10^{3}') + ' cells, and the number of cells doubles once every ' + t(g.T) + ' minutes. Determine the number of cells after ' + t(tot) + ' minutes, and write it in scientific notation. <i>(Hint: first work out how many doublings occur.)</i>', Rr,
          cands([[mul(start, D(2 * g.n, 0)), 'u2l8-doublings', 'Doubling ' + t(g.n) + ' times multiplies by ' + t('2^{' + g.n + '}') + ', not by ' + t('2\\times ' + g.n) + '.'], [mul(start, D(Math.pow(2, g.n - 1), 0)), 'u2l8-doublings', 'Count the doublings: ' + t(tot + '\\div ' + g.T + '=' + g.n) + '.'], [mul(start, D(Math.pow(2, g.n + 1), 0)), 'u2l8-doublings', 'Count the doublings: ' + t(tot + '\\div ' + g.T + '=' + g.n) + '.'], [mul(start, D(Math.pow(2, tot), 0)), 'u2l8-doublings', 'The cells double once every ' + t(g.T) + ' minutes, so there are ' + t(tot + '\\div ' + g.T) + ' doublings, not ' + t(tot) + '.']].filter(function (c) { return Number.isFinite(val(c[0])) && val(c[0]) < 1e30; })),
          'Number of doublings: ' + t(tot + '\\div ' + g.T + '=' + g.n) + '. Each doubling multiplies by ' + t('2') + ', so the culture is multiplied by ' + t('2^{' + g.n + '}=' + F(two)) + '.<br>' + t('(' + g.c + '\\times 10^{3})(' + F(two) + ')=' + stdTex(Rr) + '=' + sciT(Rr)) + ' cells.',
          ['How many 20-minute (or ' + g.T + '-minute) blocks fit into the time? That is the number of doublings.', 'Doubling ' + t('n') + ' times multiplies by ' + t('2^{n}') + '.'], 'bacteria doubling');
        return p;
      } }] },
    { num: '18', stem: '<b>Unit conversion required.</b> Answer each question in scientific notation.', shared: function (r) { if (r.chance(0.15)) return { debt: ['1.2', 12, 4, 7] };
        var b = r.int(2, 9), q, c; do { q = D(r.int(1, 9), -r.int(0, 1)); c = mul(q, D(b, 0)); } while (!inRange(c) || nd(c) > 2);
        return { debt: [std(c), 12, b, r.int(6, 8)] }; },
      parts: [
        { id: 'e18a', level: 'EMG', make: function (r) {
          var c = r.chance(0.15) ? ['Red light', 700] : r.pick([['Red light', 10 * r.int(64, 74)], ['Green light', 10 * r.int(50, 56)], ['Blue light', 10 * r.int(45, 49)], ['Violet light', 10 * r.int(39, 44)], ['Orange light', 10 * r.int(59, 62)], ['Yellow light', 10 * r.int(57, 59)]]);
          var d = D(c[1], -9);
          return sciPart(c[0] + ' has a wavelength of about ' + t(c[1]) + ' nanometres. Given that ' + t('1\\text{ nm}=1\\times 10^{-9}') + ' m, express this wavelength in metres.', d, cands([[D(c[1], -6), 'u2l8-unit', 'A nanometre is ' + t('10^{-9}') + ' m.'], [D(c[1], 9), 'exp-sign', 'A nanometre is tiny: ' + t('1\\text{ nm}=10^{-9}') + ' m, so the answer is much less than ' + t('1') + ' m.'], [D(c[1] / Math.pow(10, String(c[1]).length - 1), -9), 'renorm-dir', 'Write ' + t(c[1]) + ' itself in scientific notation first: ' + t(c[1] + '=' + sciT(D(c[1], 0))) + '. Then add the exponents.']]),
            t(c[1] + '\\times(1\\times 10^{-9})=' + sciT(D(c[1], 0)) + '\\times 10^{-9}=' + sciT(d)) + ' m.', ['Multiply the number of nanometres by ' + t('10^{-9}') + '.', 'Write ' + t(c[1]) + ' in scientific notation first, then add the exponents.'], 'nm to m', { after: 'm' });
        } },
        { id: 'e18b', level: 'EMG', make: function (r, sh0) {
          var c = sh0.debt[0], d = sh(dec(c), 12);
          return sciPart('A country’s national debt is about ' + t(c) + ' trillion dollars. Write this amount in dollars, in scientific notation. <i>(One trillion is ' + t('10^{12}') + '.)</i>', d, cands([[sh(dec(c), 9), 'u2l8-unit', 'One trillion is ' + t('10^{12}') + ' (a billion is ' + t('10^{9}') + ').']]), t(c + '\\text{ trillion}=' + c + '\\times 10^{12}') + ' dollars' + (Number(c) >= 10 ? ' = ' + t(sciT(d)) : '') + '.', ['One trillion is ' + t('10^{12}') + '. Then check the coefficient.'], 'trillion', { after: 'dollars' });
        } },
        { id: 'e18c', level: 'PRG', make: function (r, sh0) {
          var A = A_(dec(sh0.debt[0]), 12), B = A_(sh0.debt[2], sh0.debt[3]);
          var p = opPart(A, B, 'frac', 'If that country has a population of ' + t(sh0.debt[2] + '\\times 10^{' + sh0.debt[3] + '}') + ' people, what is the debt per person?');
          p.input.after = 'dollars';
          return p;
        } }] },
    { num: '19', section: 'Extra practice F — Error analysis and stretch (Preview of Lesson 10)', stem: 'Each student below made a different mistake. Identify the error, then give the correct answer.', parts: [
      { id: 'e19a', sub: 'a i', level: 'EMG', make: function (r, sh0) { var s = sh0.a; return P.mc(r, 'Devon computed ' + t(opTex(s.A, s.B, 'mul')) + ' and wrote ' + t(pt(s.C, s.E)) + ' as his final answer in scientific notation. What is the error?', [
          { html: 'The exponents were added correctly, but ' + t(stdTex(s.C) + '\\ge 10') + ', so the answer isn’t in scientific notation yet.', right: true },
          { html: 'He should have multiplied the exponents: ' + t(s.A.p + '\\times ' + s.B.p) + '.', why: 'Product law: when you multiply, you <b>add</b> the exponents. That part was right.' },
          { html: 'He should have added the coefficients: ' + t(stdTex(s.A.c) + '+' + stdTex(s.B.c)) + '.', why: 'When you multiply, the coefficients are multiplied. That part was right.' },
          { html: 'There is no error.', why: 'Check the coefficient: in scientific notation it must be less than ' + t('10') + '.' }],
          'Multiplying was done correctly, but ' + t(stdTex(s.C)) + ' is not less than ' + t('10') + '. ' + t(pt(s.C, s.E) + '=' + sciT(s.R)) + '.', ['Check his answer against the definition: ' + t('1\\le a<10') + '.'], 'Devon error'); } },
      { id: 'e19b', sub: 'a ii', level: 'EMG', make: function (r, sh0) { var s = sh0.a; var p = opPart(s.A, s.B, 'mul', 'Give the correct answer to ' + t(opTex(s.A, s.B, 'mul')) + '.'); return p; } },
      { id: 'e19c', sub: 'b i', level: 'EMG', make: function (r, sh0) { var s = sh0.b; return P.mc(r, 'Priya wrote ' + t(sciT(s.d)) + ' in standard notation as ' + t(stdTex(s.w)) + ', saying she moved the decimal ' + pl(-sN(s.d), 'place') + '. What is the error?', [
          { html: 'A <b>negative</b> exponent moves the decimal point <b>left</b> (a number less than ' + t('1') + '), not right.', right: true },
          { html: 'She moved the decimal point the wrong number of places.', why: 'The number of places (' + t(-sN(s.d)) + ') is right — check the <b>direction</b>.' },
          { html: 'She should have kept the ' + t('\\times 10^{' + sN(s.d) + '}') + ' in her answer.', why: 'Standard notation has no power of ' + t('10') + '. The problem is which way the decimal point moved.' },
          { html: 'There is no error.', why: 'A negative exponent gives a number less than ' + t('1') + ', but ' + t(stdTex(s.w)) + ' is huge.' }],
          'A negative exponent makes a small number, so the decimal point moves <b>left</b>: ' + t(sciT(s.d) + '=' + stdTex(s.d)) + '.', STD_HINTS, 'Priya error'); } },
      { id: 'e19d', sub: 'b ii', level: 'EMG', make: function (r, sh0) { var s = sh0.b; var p = toStd(s.d, 'Write ' + t(sciT(s.d)) + ' correctly in standard notation.'); p.check = (function (base) { return function (resp) { var pn = HW.parse.number(String(resp)); if (pn.ok && relEq(pn.value, val(s.w))) return wrong('repeat-error', 'That’s Priya’s answer. A negative exponent moves the decimal point <b>left</b>.'); return base(resp); }; })(p.check); return p; } },
      { id: 'e19e', sub: 'c i', level: 'EMG', make: function (r, sh0) { var s = sh0.c; return P.mc(r, 'Malik computed ' + t(cTex(s.A) + '+' + cTex(s.B)) + ' by adding the coefficients and the exponents, getting ' + t(pt(add(s.A.c, s.B.c), s.A.p + s.B.p)) + '. What is the error?', [
          { html: 'Exponents are added only when <b>multiplying</b>. To add, first rewrite the numbers with the same power of ' + t('10') + ', then add the coefficients.', right: true },
          { html: 'He should have multiplied the coefficients instead of adding them.', why: 'This is an addition, so the coefficients are added — but only once the powers of ' + t('10') + ' match.' },
          { html: 'He should have subtracted the exponents.', why: 'Neither adding nor subtracting the exponents is right for a sum: match the powers of ' + t('10') + ' first.' },
          { html: 'There is no error.', why: 'Check with standard notation: ' + t(stdTex(full(s.A)) + '+' + stdTex(full(s.B)) + '=' + stdTex(add(full(s.A), full(s.B)))) + '.' }],
          'Match the exponents first: ' + t(cTex(s.A) + '+' + stdTex(sh(s.B.c, s.B.p - s.A.p)) + '\\times 10^{' + s.A.p + '}=' + sciT(add(full(s.A), full(s.B)))) + '.', ['Write both numbers in standard notation and add them to check.'], 'Malik error'); } },
      { id: 'e19f', sub: 'c ii', level: 'PRG', make: function (r, sh0) { var s = sh0.c; return sumPart([{ A: s.A, s: 1 }, { A: s.B, s: 1 }], 'Give the correct answer to ' + t(cTex(s.A) + '+' + cTex(s.B)) + ', in scientific notation.'); } },
      { id: 'e19g', sub: 'd i', level: 'EMG', make: function (r, sh0) { var s = sh0.d; return P.mc(r, 'Sara simplified ' + t('(' + cTex(s.A) + ')^{2}') + ' to ' + t(pt(s.A.c, 2 * s.A.p)) + ', squaring the power of ten but leaving the coefficient alone. What is the error?', [
          { html: 'The exponent ' + t('2') + ' applies to the coefficient as well: ' + t(stdTex(s.A.c) + '^{2}=' + stdTex(dpow(s.A.c, 2))) + '.', right: true },
          { html: 'She should have added the exponents: ' + t(s.A.p + '+2') + '.', why: 'Power of a power: <b>multiply</b> the exponents. That part was right.' },
          { html: 'She should have doubled the coefficient: ' + t('2\\times ' + stdTex(s.A.c)) + '.', why: 'Squaring means multiplying by itself: ' + t(stdTex(s.A.c) + '\\times ' + stdTex(s.A.c)) + ', not by ' + t('2') + '.' },
          { html: 'There is no error.', why: t('(' + cTex(s.A) + ')^{2}=(' + cTex(s.A) + ')(' + cTex(s.A) + ')') + ': the coefficients multiply too.' }],
          t('(' + cTex(s.A) + ')^{2}=' + stdTex(s.A.c) + '^{2}\\times 10^{' + 2 * s.A.p + '}=' + pt(dpow(s.A.c, 2), 2 * s.A.p)) + (inRange(dpow(s.A.c, 2)) ? '' : t('=' + sciT(sh(dpow(s.A.c, 2), 2 * s.A.p)))) + '.', ['A power applies to every factor inside the bracket.'], 'Sara error'); } },
      { id: 'e19h', sub: 'd ii', level: 'PRG', make: function (r, sh0) { return powPart(sh0.d.A, 2); } }],
      shared: function (r) {
        var a = r.chance(0.15) ? { A: A_(4, 5), B: A_(3, 6) } : find(r, function () { return { A: A_(c1(r), r.int(2, 7)), B: A_(c1(r), r.int(2, 7)) }; }, function (o) { var p = o.A.c.m * o.B.c.m; return p >= 10 && p % 10 !== 0; });
        a.C = mul(a.A.c, a.B.c); a.E = a.A.p + a.B.p; a.R = sh(a.C, a.E);
        var bd = r.chance(0.15) ? D(26, -5) : S(mant(r, 2), -r.int(3, 6)), b = { d: bd, w: sh(bd, -2 * sN(bd)) };
        var c = r.chance(0.15) ? { A: A_(5, 3), B: A_(3, 2) } : (function () { var e = r.int(3, 6); return { A: A_(r.int(2, 8), e), B: A_(r.int(1, 9), e - 1) }; })();
        var d = r.chance(0.15) ? { A: A_(2, -3) } : { A: A_(r.int(2, 9), r.pick([1, -1]) * r.int(2, 6)) };
        return { a: a, b: b, c: c, d: d };
      } },
    { num: '20', stem: '<b>Stretch.</b> Astronomers measure time in enormous units, so scientific notation is the only practical way to write it.', parts: [
      { id: 'e20a', level: 'ADV', make: function (r) {
        var per = r.chance(0.3) ? ['a 365-day year', 365] : r.pick([['a 366-day leap year', 366], ['a 30-day month', 30], ['a 31-day month', 31], ['a 28-day February', 28], ['one week', 7], ['two weeks', 14], ['a 90-day term', 90], ['100 days', 100], ['a 180-day school year', 180], ['1000 days', 1000], ['a 60-day summer', 60], ['four weeks', 28], ['10 days', 10], ['a 120-day semester', 120], ['a 200-day trip', 200], ['500 days', 500], ['three weeks', 21], ['a 45-day project', 45], ['a 75-day season', 75], ['a 270-day mission', 270]]);
        var n = per[1] * 86400, d = D(n, 0);
        var p = P.fields('<i>(calculator)</i> Determine the number of seconds in ' + per[0] + '. Write the exact value in standard notation and then in scientific notation.', [{ name: 'Standard', label: 'Standard notation:', wide: true, after: 's' }, { name: 'Scientific', label: 'Scientific notation:', mode: 'math', keys: 'sci', after: 's' }],
          [stdChk(d, function (v) { if (relEq(v, per[1] * 24 * 60)) return { code: 'u2l8-unit', hint: 'That’s the number of <b>minutes</b>. Multiply by ' + t('60') + ' once more for seconds.' }; if (relEq(v, per[1] * 24 * 3600 / 60)) return { code: 'u2l8-unit', hint: 'Multiply by ' + t('60') + ' twice (minutes, then seconds).' }; return null; }), sciChk(d, sciDiag(d))],
          [std(d), sciT(d)], t(stdTex(d)) + ' s ' + t('=' + sciT(d)) + ' s',
          t(per[1] + '\\times 24\\times 60\\times 60=' + stdTex(d)) + ' s. In scientific notation: ' + t(sciT(d)) + ' s.', ['Days → hours (×24) → minutes (×60) → seconds (×60).', 'For scientific notation, move the decimal point to just after the first digit and count the places.'], 'seconds in ' + per[0]);
        p.good = [[stdPlain(d), sciT(d)]]; p.bad = [[std(D(per[1] * 1440, 0)), sciT(D(per[1] * 1440, 0))]];
        return p;
      } },
      { id: 'e20b', level: 'PRG', make: function (r) {
        var ctx = r.chance(0.2) ? ['The universe is about', '1.4', 10] : r.pick([['The universe is about', '1.4', 10], ['Earth is about', '4.5', 9], ['The Sun is about', '4.6', 9], ['The Moon is about', '4.5', 9], ['The Milky Way galaxy is about', '1.3', 10], ['The oldest rocks on Earth are about', '4', 9], ['The first dinosaurs lived about', '2.3', 8], ['The Atlantic Ocean is about', '1.8', 8], ['The Rocky Mountains are about', '8', 7], ['The Grand Canyon is about', '6', 6], ['Our species is about', '3', 5], ['The Himalayas are about', '5', 7]]);
        var spy = r.pick(['3.15', '3.15', '3.2']);
        var p = opPart(A_(ctx[1], ctx[2]), A_(spy, 7), 'mul', ctx[0] + ' ' + t(ctx[1] + '\\times 10^{' + ctx[2] + '}') + ' years old' + (/dinosaurs/.test(ctx[0]) ? ' (that many years ago)' : '') + '. Using the rounded value ' + t(spy + '\\times 10^{7}') + ' seconds per year, estimate this age in seconds, in scientific notation.');
        p.input.after = 's';
        return p;
      } }] }
  ];
  /* "how many times larger": A ÷ B */
  function timesPart(A, B) {
    var p = opPart(A, B, 'frac', 'How many times larger is ' + t(cTex(A)) + ' than ' + t(cTex(B)) + '?');
    p.hints = ['“How many times larger” means divide the larger number by the smaller one.', OP_HINTS[1]];
    return p;
  }

  HW.defineLesson({
    id: 'u2l8', unit: 2, num: '8', title: 'Scientific Notation', outcome: 'AN3',
    blurb: 'Writing very large and very small numbers compactly with powers of ten: converting both ways, checking the coefficient is at least 1 and less than 10, and comparing by the exponents first.',
    questions: questions, extra: extra
  });
})(window);
