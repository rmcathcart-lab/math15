/* Math 15 · Unit 1 · Lesson 1 — Review: Integer Operations and Order of Operations (REV: Grade 9 review)
 * Assignment 1 (u1_L01.tex, Questions 1–16) and the Lesson 1 Extra Practice (u1_EP01.tex, Questions 1–19).
 * Every part is a generator: the same expression shape, signs and bracket placement as the booklet item, new numbers
 * (the booklet's own numbers are among the possible values). No calculator.
 * Integer expressions are read by a small parser (below) that also writes the worked solution one BEDMAS step per line
 * and works out the typical wrong values (left to right instead of BEDMAS, −a² read as (−a)², (−a)² read as −a²,
 * a − (−b) read as a − b, an exponent multiplied instead of repeated) so each one gets its own hint.
 * Conversions: "write an expression, then evaluate" → an expression box (any expression with the right value that uses
 * the numbers from the question) plus the value; "insert one pair of brackets" → type the expression with the brackets;
 * "identify the error / explain / true or false with a counterexample" → multiple choice whose options are reasons;
 * "list all the integers" → least, greatest and how many. Outcome REV (Grade 9 review: never counts toward a level).
 * Levels (Math 15): LIM BEG EMG PRG ADV MAS. */
(function (root) {
  'use strict';
  var HW = root.HW, K = HW.kit, P = K.P, t = K.t, ok = K.ok, wrong = K.wrong, form = K.form;

  /* ---------- an operations keypad for the expression boxes (+ − × ÷ and brackets) ---------- */
  var W = HW.widgets;
  if (W && W.KEYSETS && !W.KEYSETS.intops) {
    var dk = function (n) { return { label: String(n), tex: String(n), plain: String(n) }; };
    W.KEYSETS.intops = [
      [dk(7), dk(8), dk(9), { label: '+', tex: '+', plain: '+' }, { label: '−', tex: '-', plain: '-' }, { label: '⌫', fn: 'del', title: 'Delete' }],
      [dk(4), dk(5), dk(6), { label: '×', tex: '\\times', plain: ' × ', title: 'Multiply' }, { label: '÷', tex: '\\div', plain: ' ÷ ', title: 'Divide' }, { label: 'clear', fn: 'clear' }],
      [dk(1), dk(2), dk(3), { label: '(', tex: '(', plain: '(' }, { label: ')', tex: ')', plain: ')' }, { label: 'x<sup>n</sup>', tex: '#@^{#?}', plain: '^', title: 'Exponent' }],
      [dk(0), { label: '◀', fn: 'left', title: 'Move left' }, { label: '▶', fn: 'right', title: 'Move right (out of an exponent)' }, { label: 'Check ↵', fn: 'enter', wide: true }]];
    W.KEYHELP = W.KEYHELP || {};
    W.KEYHELP.intops = ['Use the keypad for <b>+ − × ÷</b> and brackets. For an exponent press <b>x<sup>n</sup></b>, then <b>▶</b> to step out of it.',
      'Type <code>*</code> or <code>×</code> for times, <code>/</code> or <code>÷</code> for divide and <code>^</code> for an exponent, e.g. <code>-6 + 11 - 9</code>.'];
  }

  /* ================= integer expressions =================
   * Source strings use + - * / ^ ( ) [ ] and juxtaposition before a bracket: "-2[3-(4-7)^2]+5", "(-7)(5)", "20-4*(-3)^2".
   * A minus in front of a plain number makes a negative number; in front of a power it applies after the power (−5² = −25). */
  function lex(s) {
    var out = [], i = 0;
    while (i < s.length) {
      var c = s.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      if (/\d/.test(c)) { var m = /^\d+(\.\d+)?/.exec(s.slice(i)); out.push({ t: 'num', v: Number(m[0]) }); i += m[0].length; continue; }
      if ('+-*/^()[]'.indexOf(c) >= 0) { out.push({ t: c }); i++; continue; }
      return null;
    }
    return out;
  }
  /* ltr = true reads + − × ÷ strictly left to right (the "no BEDMAS" mistake) */
  function parseE(src, ltr) {
    var T = lex(String(src)); if (!T || !T.length) return null;
    var p = 0, OPS = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div' };
    function pk() { return T[p] ? T[p].t : null; }
    function bad() { throw new Error('parse'); }
    function atom() {
      var x = T[p]; if (!x) bad();
      if (x.t === 'num') { p++; return { t: 'num', v: x.v }; }
      if (x.t === '(' || x.t === '[') { p++; var close = x.t === '(' ? ')' : ']', e = EXPR(); if (pk() !== close) bad(); p++; return { t: 'par', a: e, br: x.t }; }
      bad();
    }
    function power() {
      var a = atom();
      if (pk() === '^') { p++; var b; if (pk() === '-') { p++; var q = atom(); b = q.t === 'num' ? { t: 'num', v: -q.v } : { t: 'neg', a: q }; } else b = atom(); return { t: 'pow', a: a, b: b }; }
      return a;
    }
    function unary() {
      if (pk() === '-') { p++; var u = unary(); return u.t === 'num' ? { t: 'num', v: -u.v } : { t: 'neg', a: u }; }
      if (pk() === '+') { p++; return unary(); }
      return power();
    }
    function bracketNext() { return pk() === '(' || pk() === '['; }
    function term() {
      var a = unary();
      for (;;) {
        var k = pk();
        if (k === '*' || k === '/') { p++; a = { t: OPS[k], a: a, b: unary() }; }
        else if (bracketNext()) a = { t: 'mul', a: a, b: power(), imp: true };
        else return a;
      }
    }
    function exprN() { var a = term(); while (pk() === '+' || pk() === '-') { var k = T[p++].t; a = { t: OPS[k], a: a, b: term() }; } return a; }
    function exprL() {
      var a = unary();
      for (;;) {
        var k = pk();
        if (k && OPS[k]) { p++; a = { t: OPS[k], a: a, b: unary() }; }
        else if (bracketNext()) a = { t: 'mul', a: a, b: power(), imp: true };
        else return a;
      }
    }
    var EXPR = ltr ? exprL : exprN;
    try { var tree = EXPR(); if (p < T.length) return null; return tree; } catch (e) { return null; }
  }
  function isNegLit(n) { return n.t === 'par' && n.a.t === 'num' && n.a.v < 0; }
  /* m: mistakes to make on purpose — negpow (−a² as (−a)²), powsign ((−a)ⁿ as −aⁿ), powmul (aⁿ as a·n), subneg (a − (−b) as a − b) */
  function evalE(n, m) {
    m = m || {};
    switch (n.t) {
      case 'num': return n.v;
      case 'par': return evalE(n.a, m);
      case 'neg': if (m.negpow && n.a.t === 'pow') return Math.pow(-evalE(n.a.a, m), evalE(n.a.b, m)); return -evalE(n.a, m);
      case 'pow': var b = evalE(n.a, m), e = evalE(n.b, m); if (m.powmul) return b * e; if (m.powsign && b < 0) return -Math.pow(-b, e); return Math.pow(b, e);
      case 'add': return evalE(n.a, m) + evalE(n.b, m);
      case 'sub': var y = evalE(n.b, m); return m.subneg && isNegLit(n.b) ? evalE(n.a, m) + y : evalE(n.a, m) - y;
      case 'mul': return evalE(n.a, m) * evalE(n.b, m);
      case 'div': return evalE(n.a, m) / evalE(n.b, m);
    }
    return NaN;
  }
  function val(src) { return evalE(parseE(src)); }
  function texE(n, first) {
    switch (n.t) {
      case 'num': return n.v < 0 && !first ? '(' + n.v + ')' : String(n.v);
      case 'par': return (n.br === '[' ? '[' : '(') + texE(n.a, true) + (n.br === '[' ? ']' : ')');
      case 'neg': return '-' + (n.a.t === 'num' && n.a.v < 0 ? '(' + n.a.v + ')' : texE(n.a, true));
      case 'pow': return (n.a.t === 'num' && n.a.v < 0 ? '(' + n.a.v + ')' : texE(n.a, true)) + '^{' + texE(n.b, true) + '}';
      case 'add': return texE(n.a, first) + '+' + texE(n.b, false);
      case 'sub': return texE(n.a, first) + '-' + texE(n.b, false);
      case 'mul': if (n.imp) return texE(n.a, first) + (n.b.t === 'num' ? '(' + n.b.v + ')' : texE(n.b, false)); return texE(n.a, first) + '\\times ' + texE(n.b, false);
      case 'div': return texE(n.a, first) + '\\div ' + texE(n.b, false);
    }
    return '?';
  }
  function tx(src) { return texE(parseE(src), true); }
  /* ---- one BEDMAS step at a time ---- */
  function isN(n) { return n.t === 'num' || (n.t === 'par' && n.a.t === 'num'); }
  function nv(n) { return n.t === 'num' ? n.v : n.a.v; }
  function num(v) { return { t: 'num', v: v }; }
  function withKid(n, k, c) { var o = {}; Object.keys(n).forEach(function (x) { o[x] = n[x]; }); o[k] = c; return o; }
  function apply(n) {
    var a = nv(n.a), b = n.b ? nv(n.b) : null;
    switch (n.t) { case 'neg': return -a; case 'pow': return Math.pow(a, b); case 'mul': return a * b; case 'div': return a / b; case 'add': return a + b; case 'sub': return a - b; }
  }
  function stepPar(n) {
    if (n.t === 'num') return null;
    if (n.t === 'par') { if (isN(n)) return null; var inner = stepE(n.a); return inner.t === 'num' ? inner : { t: 'par', a: inner, br: n.br }; }
    var ka = n.a ? stepPar(n.a) : null; if (ka) return withKid(n, 'a', ka);
    var kb = n.b ? stepPar(n.b) : null; if (kb) return withKid(n, 'b', kb);
    return null;
  }
  function stepOp(n, ops) {
    if (n.t === 'num' || isN(n)) return null;
    if (n.t === 'par') { var c = stepOp(n.a, ops); return c ? { t: 'par', a: c, br: n.br } : null; }
    var ka = n.a ? stepOp(n.a, ops) : null; if (ka) return withKid(n, 'a', ka);
    if (ops.indexOf(n.t) >= 0 && isN(n.a) && (!n.b || isN(n.b))) return num(apply(n));
    var kb = n.b ? stepOp(n.b, ops) : null; if (kb) return withKid(n, 'b', kb);
    return null;
  }
  function stepE(n) { return stepPar(n) || stepOp(n, ['pow', 'neg']) || stepOp(n, ['mul', 'div']) || stepOp(n, ['add', 'sub']) || n; }
  function stepLines(src) {
    var n = parseE(src), lines = [texE(n, true)];
    for (var g = 0; g < 30 && n.t !== 'num'; g++) { n = stepE(n); var s = texE(n, true); if (s !== lines[lines.length - 1]) lines.push(s); }
    return lines;
  }
  function stepsTex(src) {
    var L = stepLines(src);
    if (L.length === 1) return '\\[' + L[0] + '\\]';
    return '\\[\\begin{aligned}' + L[0] + '&=' + L.slice(1).join('\\\\&=') + '\\end{aligned}\\]';
  }
  function feats(src) { var s = String(src); return { br: /[(\[]/.test(s.replace(/\(-\d+\)/g, '')), pow: /\^/.test(s), md: /[*\/]|\)\(|\d\(|\d\[|\)\[|\]\(/.test(s), as: /\d\s*[+-]/.test(s) }; }

  /* ---- typical mistakes ---- */
  var LTR = 'It looks like you worked from left to right. Follow BEDMAS: brackets, then exponents, then × and ÷ (left to right), and only then + and − (left to right).';
  function mistakes(src, ans) {
    var tr = parseE(src), out = [], seen = {};
    seen[ans] = 1;
    function add(code, v, hint) { if (isFinite(v) && v % 1 === 0 && !seen[v]) { seen[v] = 1; out.push({ code: code, v: v, hint: hint }); } }
    add('u1l1-neg-pow', evalE(tr, { negpow: true }), 'Look at each power with a negative sign in front and no brackets, like ' + t('-4^{2}') + ': the exponent belongs to the ' + t('4') + ' only, so ' + t('-4^{2}=-(4\\times 4)=-16') + '. Only ' + t('(-4)^{2}') + ' is ' + t('16') + '.');
    add('u1l1-pow-sign', evalE(tr, { powsign: true }), 'A negative number to an <b>even</b> power is positive: ' + t('(-3)^{2}=(-3)\\times(-3)=9') + '. Check each power of a negative number in brackets.');
    add('u1l1-ltr', evalE(parseE(src, true)), LTR);
    add('u1l1-pow-mul', evalE(tr, { powmul: true }), 'An exponent means repeated multiplication: ' + t('3^{2}=3\\times 3=9') + ', not ' + t('3\\times 2') + '.');
    add('u1l1-sub-neg', evalE(tr, { subneg: true }), 'Subtracting a negative is the same as adding: ' + t('a-(-b)=a+b') + '. Check each “' + t('-(') + '”.');
    if (ans !== 0) add('sign', -ans, 'Right size, wrong sign. Go back through the signs one step at a time.');
    return out;
  }
  function diagE(src, ans, extra) {
    var ms = mistakes(src, ans);
    return function (v) {
      if (extra) { var h = extra(v); if (h) return h; }
      for (var i = 0; i < ms.length; i++) if (v === ms[i].v) return { code: ms[i].code, hint: ms[i].hint };
      return null;
    };
  }
  function hintsFor(src) {
    var f = feats(src), h = [];
    if (f.br) h.push('Work inside the brackets first' + (/\[/.test(src) ? ', starting with the innermost ones.' : '.'));
    if (f.pow) h.push('Exponents next. Watch the brackets: ' + t('(-3)^{2}=9') + ' but ' + t('-3^{2}=-9') + '.');
    if (f.md && f.as) h.push('Do × and ÷ (left to right) before + and −.');
    if (!h.length) h.push('Use the sign rules: same signs give a positive product or quotient; different signs give a negative one.');
    if (h.length < 2) h.push('Rewrite each subtraction as adding the opposite: ' + t('a-b=a+(-b)') + '.');
    return h.slice(0, 2);
  }
  /* evaluate an integer expression */
  function evalPart(src, o) {
    o = o || {};
    var ans = val(src), ms = mistakes(src, ans);
    var p = P.number(o.prompt || t(tx(src)), ans, diagE(src, ans, o.diag), o.sol || (o.pre || '') + stepsTex(src) + (o.post || ''), o.hints || hintsFor(src), o.text || 'evaluate ' + src, o.inp || { before: o.prompt ? t(tx(src) + '=') : t('=') });
    p.bad = ms.map(function (m) { return String(m.v); });
    return p;
  }

  /* ---- adding and subtracting two integers: the sign rules ---- */
  function addSubPart(x, op, y, o) {
    o = o || {};
    var src = (x < 0 ? '-' + (-x) : String(x)) + op + (y < 0 ? '(' + y + ')' : String(y)), ans = op === '+' ? x + y : x - y;
    var a = x, b = op === '+' ? y : -y; // a + b
    var why;
    if (op === '-') why = t(tx(src) + '=' + texE(num(a), true) + '+' + texE(num(b), false)) + ' (add the opposite). ';
    else why = '';
    if (a === -b) why += 'Opposites add to zero.';
    else if ((a < 0) === (b < 0)) why += 'Same signs: add ' + t(Math.abs(a) + '+' + Math.abs(b) + '=' + (Math.abs(a) + Math.abs(b))) + ' and keep the ' + (a < 0 ? 'negative' : 'positive') + ' sign.';
    else why += 'Different signs: subtract ' + t(Math.max(Math.abs(a), Math.abs(b)) + '-' + Math.min(Math.abs(a), Math.abs(b)) + '=' + Math.abs(a + b)) + ' and keep the sign of ' + t(String(Math.abs(a) > Math.abs(b) ? a : b)) + ', the number farther from zero.';
    var diag = function (v) {
      if (op === '-' && y < 0 && v === x + y) return { code: 'u1l1-sub-neg', hint: 'Subtracting a negative is the same as adding: ' + t(tx(src) + '=' + texE(num(x), true) + '+' + (-y)) + '.' };
      if (op === '-' && y > 0 && v === x + y) return { code: 'u1l1-sub-pos', hint: 'Subtracting ' + t(y) + ' moves ' + t(y) + ' units <b>left</b> on the number line: ' + t(tx(src) + '=' + texE(num(x), true) + '+(' + (-y) + ')') + '.' };
      if (a !== -b && (a < 0) !== (b < 0) && Math.abs(v) === Math.abs(a) + Math.abs(b)) return { code: 'u1l1-diff-sign', hint: 'The signs are different, so <b>subtract</b> the sizes (larger minus smaller) and keep the sign of the number farther from zero.' };
      if (a !== -b && (a < 0) === (b < 0) && Math.abs(v) === Math.abs(Math.abs(a) - Math.abs(b)) && v !== ans) return { code: 'u1l1-same-sign', hint: 'Both numbers have the same sign' + (op === '-' ? ' once you add the opposite' : '') + ', so <b>add</b> their sizes and keep the sign.' };
      if (ans !== 0 && v === -ans) return { code: 'sign', hint: 'Right size, wrong sign. ' + ((a < 0) === (b < 0) ? 'Both numbers are ' + (a < 0 ? 'negative' : 'positive') + ', so the answer is too.' : 'Keep the sign of the number farther from zero.') };
      return null;
    };
    var p = P.number(o.prompt || t(tx(src)), ans, diag, (o.pre || '') + why + '<br>' + t(tx(src) + '=' + ans), o.hints || ['Picture a number line: adding a positive moves right; adding a negative (or subtracting a positive) moves left.', op === '-' ? 'Rewrite it as adding the opposite: ' + t('a-b=a+(-b)') + '.' : ((a < 0) === (b < 0) ? 'Same signs: add the sizes and keep the sign.' : 'Different signs: subtract the sizes and keep the sign of the number farther from zero.')],
      'evaluate ' + src, { before: o.prompt ? t(tx(src) + '=') : t('=') });
    p.bad = [String(-ans), String(op === '+' ? x - y : x + y)].filter(function (s) { return Number(s) !== ans; });
    return p;
  }
  /* ---- multiplying or dividing two integers ---- */
  function mdPart(src, o) {
    var tr = parseE(src), ans = evalE(tr), a = evalE(tr.a), b = evalE(tr.b), same = (a < 0) === (b < 0);
    var sol = (same ? 'Same signs, so the answer is <b>positive</b>. ' : 'Different signs, so the answer is <b>negative</b>. ') + t(Math.abs(a) + (tr.t === 'div' ? '\\div ' : '\\times ') + Math.abs(b) + '=' + Math.abs(ans)) + '.<br>' + t(tx(src) + '=' + ans);
    return evalPart(src, Object.assign({ pre: '', post: '', hints: ['First decide the sign: same signs give a positive answer, different signs give a negative answer.', 'Then ' + (tr.t === 'div' ? 'divide' : 'multiply') + ' the sizes.'],
      diag: function (v) { return ans !== 0 && v === -ans ? { code: 'sign', hint: 'Check the sign: ' + (same ? 'the signs are the same, so the answer is positive.' : 'the signs are different, so the answer is negative.') } : null; } }, o || {}, { sol: sol }));
  }
  function evalPartS(src, o) { var p = evalPart(src, o); if (o && o.sol) p.solution = o.sol; return p; }

  /* ---- an expression box: any expression with the right value that uses the numbers from the question ---- */
  function normExpr(resp) {
    var s = HW.parse.plain(String(resp == null ? '' : resp)).replace(/\\lbrack|\\\[/g, '[').replace(/\\rbrack|\\\]/g, ']').replace(/\\left|\\right/g, '').replace(/\\cdot/g, '*').replace(/\{|\}/g, function (c) { return c === '{' ? '(' : ')'; });
    s = s.replace(/[xX](?=\s*[\d(\[])/g, '*').replace(/\$/g, '').replace(/°|\\circ|\^\(\\circ\)|C\b/g, '');
    return s.replace(/\s+/g, '');
  }
  function literals(n, acc) { if (!n) return acc; if (n.t === 'num') acc.push(Math.abs(n.v)); else { literals(n.a, acc); literals(n.b, acc); } return acc; }
  function hasMul(n) { if (!n || n.t === 'num') return false; if (n.t === 'mul') return true; return hasMul(n.a) || hasMul(n.b); }
  function exprChk(ans, nums, o) {
    o = o || {};
    return function (resp) {
      var s = normExpr(resp);
      if (!s) return form('empty', 'Write the expression first.');
      var tr = parseE(s);
      if (!tr) return form('u1l1-expr-read', 'I can’t read that expression. Use numbers with + − × ÷ and brackets, like ' + t(o.example || '-6+11-9') + '.');
      if (tr.t === 'num') return form('u1l1-expr-only', 'Write the <b>expression</b> (the numbers and operations), not just the answer — the answer goes in the next box.');
      var v = evalE(tr);
      if (v !== ans) {
        var h = o.diag ? o.diag(v, tr) : null; if (h) return wrong(h.code, h.hint);
        return wrong('u1l1-expr', 'Your expression works out to ' + t(String(Math.round(v * 1000) / 1000)) + '. ' + (o.why || 'Check the sign of each change: up, right, rising and deposits are +; down, left, falling and withdrawals are −.'));
      }
      var have = literals(tr, []), need = nums.map(Math.abs).slice();
      for (var i = 0; i < need.length; i++) { var j = have.indexOf(need[i]); if (j < 0) return form('u1l1-expr-nums', 'Right value — but build the expression from the numbers in the question (' + nums.map(function (x) { return t(String(Math.abs(x))); }).join(', ') + ').'); have.splice(j, 1); }
      if (o.mul && !hasMul(tr)) return form('u1l1-expr-mul', 'Right value — now use <b>multiplication</b> for the repeated changes, e.g. ' + t('5(-4)') + ' for “' + t('-4') + ' five times”.');
      return ok();
    };
  }
  function exprField(label) { return { name: 'Expression', label: label || 'Expression', mode: 'math', keys: 'intops', wide: true }; }

  HW.addCodes({
    'u1l1-ltr': 'Worked left to right instead of BEDMAS', 'u1l1-neg-pow': 'Read −a² as (−a)²', 'u1l1-pow-sign': 'Negative base to an even power left negative',
    'u1l1-pow-mul': 'Multiplied the base by the exponent', 'u1l1-sub-neg': 'Subtracting a negative: didn’t change it to adding', 'u1l1-sub-pos': 'Subtracting: moved the wrong way',
    'u1l1-diff-sign': 'Different signs: added the sizes', 'u1l1-same-sign': 'Same signs: subtracted the sizes', 'u1l1-expr': 'Expression has the wrong value',
    'u1l1-expr-read': 'Expression not readable', 'u1l1-expr-only': 'Gave a number instead of an expression', 'u1l1-expr-nums': 'Expression doesn’t use the question’s numbers',
    'u1l1-expr-mul': 'Expression doesn’t use multiplication', 'u1l1-brackets': 'Brackets in the wrong place', 'u1l1-brackets-count': 'Not exactly one pair of brackets',
    'u1l1-brackets-moved': 'Changed the numbers or operations', 'u1l1-one-root': 'Gave only one of the two answers', 'u1l1-root-repeat': 'Gave the same answer twice',
    'u1l1-not-root': 'A value that doesn’t make the statement true', 'u1l1-endpoint': 'Included an endpoint (the inequality is strict)', 'u1l1-count': 'Miscounted the integers',
    'u1l1-arrange': 'Arrangement doesn’t give the value', 'u1l1-arrange-nums': 'Arrangement doesn’t use the three integers', 'u1l1-not-greatest': 'Not the greatest value',
    'u1l1-not-least': 'Not the least value', 'u1l1-no-mul': 'Repeated change counted once (no multiplication)', 'u1l1-tip-once': 'Added the tip only once', 'u1l1-sub-brackets': 'Substituted without brackets'
  });
  HW.addPartial({
    'u1l1-ltr': 'n', 'u1l1-neg-pow': 'b', 'u1l1-pow-sign': 'b', 'u1l1-pow-mul': 'n', 'u1l1-sub-neg': 'b', 'u1l1-sub-pos': 'n', 'u1l1-diff-sign': 'b', 'u1l1-same-sign': 'b',
    'u1l1-expr': 'n', 'u1l1-brackets': 'n', 'u1l1-brackets-count': 'n', 'u1l1-brackets-moved': 'n', 'u1l1-one-root': 's', 'u1l1-root-repeat': 's', 'u1l1-not-root': 'n',
    'u1l1-endpoint': 's', 'u1l1-count': 's', 'u1l1-arrange': 'n', 'u1l1-arrange-nums': 'n', 'u1l1-not-greatest': 'b', 'u1l1-not-least': 'b', 'u1l1-no-mul': 'b', 'u1l1-sub-brackets': 'b'
  });

  /* ---------- small helpers ---------- */
  function neg(v) { return '(' + v + ')'; }          // a negative literal in brackets for a source string: neg(-4) → "(-4)"
  function lead(v) { return String(v); }               // a leading number (no brackets)
  function find(gen, test, fallback) { for (var i = 0; i < 500; i++) { var v = gen(); if (test(v)) return v; } return fallback; }
  function signWord(v) { return v > 0 ? 'positive' : 'negative'; }

  HW.defineLesson({
    id: 'u1l1', unit: 1, num: '1', title: 'Review: Integer Operations and Order of Operations', outcome: 'REV',
    blurb: 'The Grade 9 integer sign rules, then BEDMAS — the building blocks for everything ahead.',
    questions: [
      { num: '1', section: 'Part A — Adding and Subtracting Integers', stem: 'Fill in the blank: evaluate each sum.', parts: [
        { id: '1a', level: 'LIM', make: function (r) {
          var a = r.int(2, 12), b = r.int(2, 12);
          return addSubPart(-a, '+', -b, { prompt: t('-' + a + '+(-' + b + ')') + ': both numbers are negative (same sign), so add their values and keep the negative sign.' });
        } },
        { id: '1b', level: 'LIM', make: function (r) {
          var a = r.int(6, 15), b = r.int(2, a - 2);
          return addSubPart(a, '+', -b, { prompt: t(a + '+(-' + b + ')') + ': the signs differ, so subtract the smaller absolute value from the larger and keep the sign of the number farther from zero.' });
        } }] },
      { num: '2', stem: 'Evaluate each expression.', parts: [
        { id: '2a', level: 'BEG', make: function (r) { var a = r.int(5, 15), b = r.int(2, a - 1); return addSubPart(-a, '+', b); } },
        { id: '2b', level: 'BEG', make: function (r) { var a = r.int(2, 10), b = r.int(a + 2, 18); return addSubPart(a, '-', b); } },
        { id: '2c', level: 'BEG', make: function (r) { var a = r.int(5, 15), b = r.int(2, a - 1); return addSubPart(-a, '-', -b); } },
        { id: '2d', level: 'BEG', make: function (r) { var a = r.int(6, 25); return r.chance(0.5) ? addSubPart(-a, '+', a) : addSubPart(a, '+', -a); } }] },
      { num: '3', stem: 'Evaluate each expression.', parts: [
        { id: '3a', level: 'BEG', make: function (r) { var a = r.int(4, 15), b = r.int(a + 3, 25); return addSubPart(a, '-', b); } },
        { id: '3b', level: 'BEG', make: function (r) { return addSubPart(-r.int(6, 19), '+', -r.int(3, 12)); } },
        { id: '3c', level: 'BEG', make: function (r) { return addSubPart(r.int(3, 15), '-', -r.int(3, 15)); } },
        { id: '3d', level: 'BEG', make: function (r) { return addSubPart(-r.int(2, 12), '-', r.int(3, 12)); } }] },
      { num: '4', stem: '', parts: [
        { id: '4', level: 'BEG', make: function (r) {
          var s = -r.int(2, 9), a = r.int(4, 12), b = r.int(2, 9); if (b === a) b = a - 1; var ans = s + a - b;
          var key = s + '+' + a + '-' + b;
          var p = P.fields('A number starts at ' + t(s) + ' on a number line. First it moves ' + t(a) + ' units <b>right</b>, then ' + t(b) + ' units <b>left</b>. Write an addition/subtraction expression for its final position, then evaluate it.',
            [exprField(), { name: 'Final position', label: 'Final position' }],
            [exprChk(ans, [s, a, b], { why: 'Moving right is adding; moving left is subtracting.', example: s + '+' + a + '-' + b }), K.number(ans, function (v) {
              if (v === s - a + b) return { code: 'u1l1-sub-pos', hint: 'Right is the positive direction (add), left is the negative direction (subtract).' };
              if (v === s + a + b) return { code: 'u1l1-sub-pos', hint: 'Moving left means subtracting.' };
              if (v === -ans && ans) return { code: 'sign', hint: 'Check the sign of your final position.' };
              return null;
            })],
            [key, String(ans)], t(tx(key) + '=' + ans),
            'Right is ' + t('+') + ', left is ' + t('-') + ': ' + stepsTex(key) + 'The number ends at ' + t(ans) + '.',
            ['Start at ' + t(s) + '. Moving right adds; moving left subtracts.', 'Write ' + t(s + '+\\square-\\square') + ', then work from left to right.'], 'number line ' + key);
          p.bad = [[key, String(s - a + b)], [String(ans), String(ans)]];
          return p;
        } }] },
      { num: '5', section: 'Part B — Multiplying and Dividing Integers', stem: function (sh) { return 'Fill in the blanks for ' + t(tx(sh.src)) + '.'; },
        shared: function (r) {
          var a = r.int(2, 9), b = r.int(2, 9), k = r.pick(['nn', 'nn', 'np', 'pn']);
          var src = k === 'nn' ? neg(-a) + neg(-b) : k === 'np' ? neg(-a) + '(' + b + ')' : '(' + a + ')' + neg(-b);
          return { src: src, k: k, ans: val(src) };
        },
        parts: [
          { id: '5a', level: 'LIM', make: function (r, sh) {
            var pos = sh.ans > 0, desc = sh.k === 'nn' ? 'both numbers are negative (same sign)' : 'one number is negative and one is positive (different signs)';
            var p = P.mc(r, t(tx(sh.src)) + ': ' + desc + ', so the product is', [
              { html: '<b>positive</b>', right: pos, why: pos ? null : 'Different signs give a <b>negative</b> product.', code: 'said-pos' },
              { html: '<b>negative</b>', right: !pos, why: pos ? 'Two negatives make a positive: each negative sign flips the answer, and two flips bring you back to positive.' : null, code: 'said-neg' }],
              (sh.k === 'nn' ? 'Same signs give a positive product.' : 'Different signs give a negative product.') + ' The product is <b>' + signWord(sh.ans) + '</b>.', ['Count the negative signs: two flips make a positive; one flip makes a negative.'], 'sign of ' + sh.src, true);
            p.input.columns = 2; p.tries = 1;
            return p;
          } },
          { id: '5b', level: 'LIM', make: function (r, sh) { return mdPart(sh.src); } }] },
      { num: '6', stem: 'Evaluate each expression.', parts: [
        { id: '6a', level: 'BEG', make: function (r) { return mdPart(neg(-r.int(2, 12)) + '(' + r.int(2, 9) + ')'); } },
        { id: '6b', level: 'BEG', make: function (r) { return mdPart('(' + r.int(2, 9) + ')' + neg(-r.int(2, 12))); } },
        { id: '6c', level: 'BEG', make: function (r) { return mdPart(neg(-r.int(2, 9)) + neg(-r.int(2, 12))); } },
        { id: '6d', level: 'BEG', make: function (r) { return mdPart('(' + r.int(2, 9) + ')(' + r.int(2, 12) + ')'); } }] },
      { num: '7', stem: 'Evaluate each expression.', parts: [
        { id: '7a', level: 'BEG', make: function (r) { var b = r.int(2, 9), q = r.int(2, 9); return mdPart(b * q + '/' + neg(-b)); } },
        { id: '7b', level: 'BEG', make: function (r) { var b = r.int(2, 9), q = r.int(2, 9); return mdPart('-' + b * q + '/' + neg(-b)); } },
        { id: '7c', level: 'BEG', make: function (r) { var b = r.int(2, 9), q = r.int(2, 9); return mdPart('-' + b * q + '/' + b); } },
        { id: '7d', level: 'BEG', make: function (r) { var b = r.int(2, 9), q = r.int(2, 9); return mdPart(b * q + '/' + b); } }] },
      { num: '8', section: 'Part C — Order of Operations', stem: 'Evaluate each expression using the correct order of operations.', parts: [
        { id: '8a', level: 'EMG', make: function (r) { return evalPart(r.int(2, 9) + '+' + r.int(2, 6) + '*' + neg(-r.int(2, 6))); } },
        { id: '8b', level: 'EMG', make: function (r) { return evalPart('-' + r.int(2, 9) + '-' + r.int(2, 6) + '*' + neg(-r.int(2, 6))); } }] },
      { num: '9', stem: 'Evaluate each expression using the correct order of operations.', parts: [
        { id: '9a', level: 'EMG', make: function (r) { var a = r.int(1, 6), b = r.int(a + 2, 12); return evalPart('(' + a + '-' + b + ')*' + neg(-r.int(2, 5))); } },
        { id: '9b', level: 'EMG', make: function (r) { var b = r.int(2, 6), c = r.int(b + 2, 11); return evalPart('-' + r.int(2, 6) + '*(' + b + '+' + neg(-c) + ')'); } }] },
      { num: '10', stem: 'Evaluate each expression using the correct order of operations.', parts: [
        { id: '10a', level: 'EMG', make: function (r) { var b = r.int(2, 6), q = r.int(2, 9); return evalPart(b * q + '/' + neg(-b) + '+' + r.int(2, 9)); } },
        { id: '10b', level: 'PRG', make: function (r) { return evalPart('-' + r.int(2, 12) + '+' + r.int(2, 6) + '*' + neg(-r.int(2, 5)) + '-' + neg(-r.int(2, 9))); } }] },
      { num: '11', section: 'Part D — Exponents with Integers', stem: function (sh) { return 'Evaluate each expression, and notice how the placement of the brackets changes the answer.'; },
        shared: function (r) { var a = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 25, 30, 50, 2, 3]), e = a <= 3 && r.chance(0.35) ? 4 : 2; return { a: a, e: e }; },
        parts: [
          { id: '11a', level: 'EMG', make: function (r, sh) {
            var src = '-' + sh.a + '^' + sh.e, ans = val(src);
            return evalPart(src, { pre: 'No brackets, so the exponent applies only to the ' + t(sh.a) + '; the negative is applied afterwards.', hints: ['Without brackets, the exponent belongs to the ' + t(sh.a) + ' only.', t('-' + sh.a + '^{' + sh.e + '}=-(' + Array(sh.e + 1).join(sh.a + '\\times ').slice(0, -7) + ')') + '.'] });
          } },
          { id: '11b', level: 'BEG', make: function (r, sh) {
            var src = neg(-sh.a) + '^' + sh.e;
            return evalPart(src, { pre: 'The brackets put the negative inside the power: ' + t(neg(-sh.a) + '^{' + sh.e + '}=' + Array(sh.e + 1).join(neg(-sh.a) + '\\times ').slice(0, -7)) + '. An even number of negatives gives a positive answer.', hints: ['The brackets put the negative <b>inside</b> the power.', 'Multiply ' + t(neg(-sh.a)) + ' by itself ' + sh.e + ' times.'] });
          } }] },
      { num: '12', stem: 'Evaluate each expression using the correct order of operations.', parts: [
        { id: '12a', level: 'EMG', make: function (r) { return evalPart(r.int(1, 9) + '+' + neg(-r.int(2, 6)) + '^2'); } },
        { id: '12b', level: 'PRG', make: function (r) { var b = r.int(2, 5), c = r.int(2, 4), a = r.int(b * c * c - 10, b * c * c + 15); return evalPart(Math.max(a, 1) + '-' + b + '*' + neg(-c) + '^2'); } }] },
      { num: '13', stem: 'Evaluate each expression, showing every step in order.', parts: [
        { id: '13a', level: 'PRG', make: function (r) { var b = r.int(1, 6), c = r.int(b + 2, b + 5); return evalPart('-' + r.int(2, 5) + '*(' + b + '-' + c + ')^2+' + r.int(1, 9)); } },
        { id: '13b', level: 'PRG', make: function (r) { var b = r.int(2, 4), q = r.int(3, 12); return evalPart(neg(-b * q) + '/' + neg(-b) + '-' + r.int(2, 4) + '^2'); } }] },
      { num: '14', section: 'Part E — Applications', stem: 'Write an integer expression first, then evaluate it.', parts: [
        { id: '14', level: 'EMG', make: function (r) {
          var T0 = -r.int(2, 12), up = r.int(5, 15), down = r.int(3, 12); if (down === up) down = up - 2; var ans = T0 + up - down, key = T0 + '+' + up + '-' + down;
          var h1 = r.pick(['7 a.m.', '6 a.m.', '8 a.m.']), h2 = r.pick(['1 p.m.', 'noon', '2 p.m.']), h3 = r.pick(['9 p.m.', '10 p.m.', '8 p.m.']);
          var p = P.fields('The temperature was ' + t(T0 + '^{\\circ}\\text{C}') + ' at ' + h1 + '. By ' + h2 + ' it had risen ' + t(up + '^{\\circ}\\text{C}') + '. By ' + h3 + ' it had dropped ' + t(down + '^{\\circ}\\text{C}') + ' from the ' + h2 + ' temperature. Write an integer expression for the ' + h3 + ' temperature, then evaluate it.',
            [exprField(), { name: 'Temperature', label: 'Temperature at ' + h3, after: '°C' }],
            [exprChk(ans, [T0, up, down], { why: 'Rising is +, dropping is −.' }), K.number(ans, function (v) { if (v === T0 - up + down) return { code: 'u1l1-sub-pos', hint: 'Rising adds; dropping subtracts.' }; if (ans && v === -ans) return { code: 'sign', hint: 'Check the sign of your final temperature.' }; return null; })],
            [key, String(ans)], t(tx(key) + '=' + ans + '^{\\circ}\\text{C}'),
            'Start at ' + t(T0) + ', rise ' + t('+' + up) + ', drop ' + t('-' + down) + ':' + stepsTex(key) + 'The temperature at ' + h3 + ' is ' + t(ans + '^{\\circ}\\text{C}') + '.',
            ['Start with ' + t(T0) + '. Rising is adding; dropping is subtracting.'], 'temperature ' + key);
          p.bad = [[key, String(T0 - up + down)]];
          return p;
        } }] },
      { num: '15', stem: 'Write an integer expression first, then evaluate it.', parts: [
        { id: '15', level: 'EMG', make: function (r) {
          var name = r.pick(['Malik', 'Priya', 'Jordan', 'Aiden', 'Sofia', 'Noah']), b0 = -r.pick([10, 15, 20, 25, 30, 35, 40, 45]), dep = r.pick([30, 40, 50, 60, 70, 80]), wd = r.int(8, 45), ans = b0 + dep - wd, key = b0 + '+' + dep + '-' + wd;
          var p = P.fields(name + '’s bank account balance was ' + t('-\\$' + (-b0)) + ' (overdrawn by ' + t('\\$' + (-b0)) + '). ' + (name === 'Priya' || name === 'Sofia' ? 'She' : 'He') + ' deposited ' + t('\\$' + dep) + ', then withdrew ' + t('\\$' + wd) + '. Write an integer expression for the new balance, then evaluate it.',
            [exprField(), { name: 'Balance', label: 'New balance', before: '$' }],
            [exprChk(ans, [b0, dep, wd], { why: 'A deposit adds money; a withdrawal subtracts it.' }), K.number(ans, function (v) { if (v === b0 - dep + wd) return { code: 'u1l1-sub-pos', hint: 'A deposit adds; a withdrawal subtracts.' }; if (v === -b0 + dep - wd) return { code: 'sign', hint: 'The starting balance is <b>negative</b> (overdrawn).' }; if (ans && v === -ans) return { code: 'sign', hint: 'Check the sign of the new balance.' }; return null; })],
            [key, String(ans)], t(tx(key) + '=' + ans) + ' dollars',
            'Start at ' + t(b0) + ', deposit ' + t('+' + dep) + ', withdraw ' + t('-' + wd) + ':' + stepsTex(key) + 'The new balance is ' + (ans < 0 ? t('-\\$' + (-ans)) + ' (still overdrawn)' : t('\\$' + ans)) + '.',
            ['An overdrawn balance is negative. Deposits add; withdrawals subtract.'], 'bank ' + key);
          p.bad = [[key, String(-b0 + dep - wd)]];
          return p;
        } }] },
      { num: '16', stem: '<i>(Multiple Choice)</i>', parts: [
        { id: '16', level: 'EMG', make: function (r) {
          var a = r.int(2, 15), sq = a * a;
          if (r.chance(0.5)) return P.mc(r, 'Which of the following expressions is equal to ' + t(sq) + '?', [
            { html: t('-' + a + '^{2}'), why: 'Without brackets, the exponent applies only to the ' + t(a) + ': ' + t('-' + a + '^{2}=-' + sq) + '.' },
            { html: t('(-' + a + ')^{2}'), right: true },
            { html: t('-(' + a + '^{2})'), why: t('-(' + a + '^{2})=-(' + sq + ')=-' + sq) + '.' },
            { html: t('-2\\times(-' + a + ')^{2}'), why: t('(-' + a + ')^{2}=' + sq) + ', then ' + t('-2\\times ' + sq + '=-' + (2 * sq)) + '.' }],
            t('(-' + a + ')^{2}=(-' + a + ')(-' + a + ')=' + sq) + '. The others: ' + t('-' + a + '^{2}=-' + sq) + ', ' + t('-(' + a + '^{2})=-' + sq) + ', ' + t('-2\\times(-' + a + ')^{2}=-' + (2 * sq)) + '.',
            ['Which one puts the negative sign <b>inside</b> the power?'], 'MC equals ' + sq, true);
          return P.mc(r, 'Which of the following expressions is equal to ' + t(-2 * sq) + '?', [
            { html: t('-' + a + '^{2}'), why: t('-' + a + '^{2}=-' + sq) + '.' },
            { html: t('2\\times(-' + a + ')^{2}'), why: t('(-' + a + ')^{2}=' + sq) + ' is positive, so ' + t('2\\times ' + sq + '=' + 2 * sq) + ' is positive too.' },
            { html: t('(-2\\times ' + a + ')^{2}'), why: 'The whole bracket is squared: ' + t('(-' + 2 * a + ')^{2}=' + 4 * sq) + '.' },
            { html: t('-2\\times(-' + a + ')^{2}'), right: true }],
            'Exponents first: ' + t('(-' + a + ')^{2}=' + sq) + ', then ' + t('-2\\times ' + sq + '=' + (-2 * sq)) + '. The others: ' + t('-' + a + '^{2}=-' + sq) + ', ' + t('2\\times(-' + a + ')^{2}=' + 2 * sq) + ', ' + t('(-2\\times ' + a + ')^{2}=' + 4 * sq) + '.',
            ['Do the exponent first, then multiply. Which option is negative and twice ' + t(sq) + '?'], 'MC equals ' + (-2 * sq), true);
        } }] }
    ],
    extra: [
      { num: '1', section: 'Extra practice A — Nested brackets and multi-step BEDMAS', stem: 'Evaluate each expression. Work from the <b>innermost</b> bracket outwards, and show every step.', parts: [
        { id: 'e1a', level: 'PRG', make: function (r) { var c = r.int(1, 6), d = c + r.int(2, 4); return evalPart('-' + r.int(2, 4) + '[' + r.int(1, 9) + '-(' + c + '-' + d + ')^2]+' + r.int(1, 9)); } },
        { id: 'e1b', level: 'PRG', make: function (r) { var a = r.int(3, 9), b = r.int(1, 8); while (b === a) b = r.int(1, 8); return evalPart('[' + neg(-a) + '+' + b + ']^2-[' + neg(-r.int(2, 6)) + '(' + r.int(2, 5) + ')+' + r.int(1, 9) + ']'); } },
        { id: 'e1c', level: 'ADV', make: function (r) {
          var v = find(function () { var a = r.int(2, 6), b = r.pick([2, 3]), c = r.int(1, 20), d = r.int(2, 9); return { a: a, b: b, c: c, d: d, inner: -Math.pow(b, 3) + c }; },
            function (v) { return v.inner !== 0 && (v.a * v.inner) % v.d === 0 && v.a * v.inner / v.d !== 0 && Math.abs(v.inner) <= 15; }, { a: 3, b: 2, c: 10, d: 6, inner: 2 });
          return evalPart('-' + v.a + '[' + neg(-v.b) + '^3+' + v.c + ']/' + neg(-v.d));
        } }] },
      { num: '2', stem: 'Evaluate each expression, showing every step.', parts: [
        { id: 'e2a', level: 'PRG', make: function (r) {
          var v = find(function () { var a = r.int(2, 5), b = r.pick([1, 2, 3]), c = r.int(2, 9), d = r.int(1, 8); return { a: a, b: b, c: c, d: d, top: a * a + b * b * b, bot: -c + d }; },
            function (v) { return v.bot !== 0 && v.top % v.bot === 0 && v.c !== v.d; }, { a: 4, b: 2, c: 6, d: 2, top: 24, bot: -4 });
          return evalPart('[' + neg(-v.a) + '^2-' + neg(-v.b) + '^3]/(-' + v.c + '+' + v.d + ')');
        } },
        { id: 'e2b', level: 'PRG', make: function (r) { var b = r.pick([2, 3]), q = r.int(2, 9), d = r.int(1, 5), e = r.int(d + 2, d + 7); return evalPart(b * b * q + '/' + neg(-b) + '^2-' + r.int(2, 5) + '(' + d + '-' + e + ')'); } },
        { id: 'e2c', level: 'PRG', make: function (r) { var c = r.int(1, 6), d = c + r.int(2, 6); return evalPart('-[' + r.int(1, 9) + '-' + r.int(2, 4) + '(' + c + '-' + d + ')]'); } }] },
      { num: '3', stem: 'Evaluate each expression.', parts: [
        { id: 'e3a', level: 'PRG', make: function (r) {
          var a = r.pick([2, 2, 3, 1]), es = r.sample(a === 3 ? [2, 3, 4] : [2, 3, 4, 5], 3).sort(function (x, y) { return y - x; }), ops = [r.pick(['+', '-']), r.pick(['+', '-'])];
          return evalPart(neg(-a) + '^' + es[0] + ops[0] + neg(-a) + '^' + es[1] + ops[1] + neg(-a) + '^' + es[2]);
        } },
        { id: 'e3b', level: 'PRG', make: function (r) { return evalPart('-1^' + r.int(5, 12) + '+' + neg(-1) + '^' + r.int(5, 12) + '-' + neg(-1) + '^' + r.int(5, 12)); } },
        { id: 'e3c', level: 'PRG', make: function (r) {
          var v = find(function () { var sw = r.chance(0.5), a = r.int(2, 6), b = r.int(1, 3), c = r.int(2, 9), k = r.pick([1, 2, 2]); var p1 = sw ? 3 : 2, p2 = sw ? 2 : 3; return { a: a, b: b, c: c, k: k, p1: p1, p2: p2, n: Math.pow(-a, p1) * Math.pow(-b, p2), d: Math.pow(-c, k) }; },
            function (v) { return v.n % v.d === 0 && Math.abs(v.n / v.d) <= 40 && v.c !== v.a && Math.abs(v.n / v.d) !== 1; }, { a: 3, b: 2, c: 6, k: 2, p1: 2, p2: 3 });
          return evalPart(neg(-v.a) + '^' + v.p1 + neg(-v.b) + '^' + v.p2 + '/' + neg(-v.c) + (v.k === 2 ? '^2' : ''));
        } }] },
      { num: '4', section: 'Extra practice B — Where the brackets sit: −aⁿ versus (−a)ⁿ', stem: function (sh) { return 'Evaluate each expression: (a) ' + t(tx(sh.forms[0])) + ', (b) ' + t(tx(sh.forms[1])) + ', (c) ' + t(tx(sh.forms[2])) + ', (d) ' + t(tx(sh.forms[3])) + '. Two of the four have the same value.'; },
        shared: function (r) {
          var a = r.pick([2, 3, 2, 4, 5]), n = a <= 3 ? r.pick([2, 4]) : 2;
          var forms = r.shuffle(['-' + a + '^' + n, neg(-a) + '^' + n, '-' + neg(-a) + '^' + n, '-' + neg(-a) + '^' + (n + 1)]);
          return { a: a, n: n, forms: forms };
        },
        parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
          return { id: 'e4' + L, level: 'EMG', make: function (r, sh) { return evalPart(sh.forms[i]); } };
        }).concat([{ id: 'e4e', level: 'EMG', make: function (r, sh) {
          var vals = sh.forms.map(val), want = [], opts = ['a', 'b', 'c', 'd'].map(function (L, i) { return { value: L, html: '(' + L + ')&nbsp;' + t(tx(sh.forms[i])) }; });
          for (var i = 0; i < 4; i++) for (var j = 0; j < 4; j++) if (i !== j && vals[i] === vals[j] && want.indexOf('abcd'[i]) < 0) want.push('abcd'[i]);
          want.sort();
          return { prompt: 'Which two have the same value?', input: { type: 'select', options: opts }, key: want, answer: want.map(function (L) { return '(' + L + ')'; }).join(' and '), text: 'same value among ' + sh.forms.join(', '),
            check: K.selectSet(want, function (extra, missing) { return { code: 'u1l1-neg-pow', hint: extra.length ? '(' + extra[0] + ') has a different value from the others you chose. Work out all four values first.' : 'Pick exactly two.' }; }),
            solution: sh.forms.map(function (f, i) { return '(' + 'abcd'[i] + ') ' + t(tx(f) + '=' + vals[i]); }).join('<br>') + '<br>So ' + want.map(function (L) { return '(' + L + ')'; }).join(' and ') + ' are equal.',
            hints: ['Evaluate all four first.', 'A minus sign outside the brackets (or with no brackets) is applied after the power.'] };
        } }]) },
      { num: '5', stem: 'Evaluate each expression.', parts: [
        { id: 'e5a', level: 'EMG', make: function (r) { return evalPart('-' + r.int(2, 6) + '^2*' + neg(-r.int(2, 5)) + '^2'); } },
        { id: 'e5b', level: 'EMG', make: function (r) { var a = r.int(2, 9); return evalPart(neg(-a) + '^2-' + (r.chance(0.7) ? a : r.int(2, 9)) + '^2'); } },
        { id: 'e5c', level: 'PRG', make: function (r) {
          var v = find(function () { var y = r.int(2, 5), e = r.pick([2, 2, 3, 4]), x = y * r.int(1, 4) * (r.chance(0.3) ? 2 : 1); return [x, y, e]; },
            function (v) { var top = v[0] * v[0], bot = Math.pow(v[1], v[2]); return bot <= 256 && top % bot === 0 && top / bot <= 20 && v[0] <= 16; }, [4, 2, 4]);
          return evalPart(neg(-v[0]) + '^2/' + neg(-v[1]) + '^' + v[2]);
        } },
        { id: 'e5d', level: 'EMG', make: function (r) { return evalPart(neg(-1) + '^' + r.pick([3, 5, 7, 9, 11]) + '*' + neg(-r.int(2, 5)) + '^3'); } }] },
      { num: '6', stem: '<b>Without</b> evaluating, decide whether each expression is positive or negative, and choose the reason that decides it.', parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
        return { id: 'e6' + L, level: 'EMG', make: function (r) {
          var a = r.int(2, 9), odd = 2 * r.int(3, 7) + 1, even = 2 * r.int(3, 7);
          var expr = [neg(-a) + '^{' + odd + '}', '-' + a + '^{' + even + '}', neg(-a) + '^{' + even + '}', '-' + neg(-a) + '^{' + odd + '}'][i];
          var right = ['odd', 'outside', 'even', 'flip'][i];
          var O = [{ id: 'even', html: '<b>Positive</b>: the exponent is even, so the negative factors pair up.' }, { id: 'odd', html: '<b>Negative</b>: the exponent is odd, so one negative factor is left over.' },
            { id: 'outside', html: '<b>Negative</b>: the minus sign isn’t inside the power, so it is applied after the (positive) power is found.' }, { id: 'flip', html: '<b>Positive</b>: the power is negative, and the minus sign outside the brackets flips it to positive.' }];
          var WHY = { even: 'Check whether the negative sign is really inside the power, and whether the exponent is even.', odd: 'Is the exponent odd? And is there a minus sign outside the brackets that flips the answer?',
            outside: 'Is there a negative <b>inside</b> brackets? If the negative is in the brackets, the exponent applies to it.', flip: 'Is there a minus sign outside the brackets? Is the power inside negative?' };
          return P.mc(r, t(expr), O.map(function (o) { return { html: o.html, right: o.id === right, why: o.id === right ? null : WHY[o.id], code: o.id }; }),
            [t(neg(-a) + '^{' + odd + '}') + ': odd exponent, so one negative is left over — <b>negative</b>.', t('-' + a + '^{' + even + '}') + ': the exponent belongs to ' + t(a) + ' only; ' + t(a + '^{' + even + '}') + ' is positive and the minus makes it <b>negative</b>.',
              t(neg(-a) + '^{' + even + '}') + ': even exponent, the negatives pair up — <b>positive</b>.', t('-' + neg(-a) + '^{' + odd + '}') + ': ' + t(neg(-a) + '^{' + odd + '}') + ' is negative (odd), and the outside minus flips it — <b>positive</b>.'][i],
            ['Is the negative inside the brackets? Is the exponent even or odd? Is there a minus sign outside?'], 'sign of ' + expr, true);
        } };
      }) },
      { num: '7', section: 'Extra practice C — Working backwards', stem: 'Insert <b>one</b> pair of brackets into the expression so that it has the value shown. Type the whole expression with your brackets.', parts: [
        { id: 'e7a', level: 'ADV', make: function (r) { return bracketPart(r, 0); } },
        { id: 'e7b', level: 'ADV', make: function (r) { return bracketPart(r, 1); } }] },
      { num: '8', stem: 'Replace each ' + t('\\square') + ' with one of ' + t('+') + ', ' + t('-') + ', ' + t('\\times') + ' or ' + t('\\div') + ' to make the statement true. Each operation is used exactly once.', parts: [
        { id: 'e8', level: 'EMG', make: function (r) {
          var v = find(function () { var y = r.int(2, 6), x = -y * r.int(2, 6); return [x, y]; }, function (v) { var a = [v[0] + v[1], v[0] - v[1], v[0] * v[1], v[0] / v[1]]; return a.every(function (q, i) { return a.indexOf(q) === i; }); }, [-12, 4]);
          var x = v[0], y = v[1], res = { add: x + y, sub: x - y, mul: x * y, div: x / y };
          var ids = r.shuffle(['div', 'add', 'sub', 'mul']), cols = [{ id: 'add', html: t('+') }, { id: 'sub', html: t('-') }, { id: 'mul', html: t('\\times') }, { id: 'div', html: t('\\div') }];
          var rows = ids.map(function (k, i) { return { id: 'r' + i, label: '(' + 'abcd'[i] + ')', html: '(' + 'abcd'[i] + ') ' + t(x + '\\ \\square\\ ' + y + '=' + res[k]) }; }), want = {};
          ids.forEach(function (k, i) { want['r' + i] = k; });
          var sym = { add: '+', sub: '-', mul: '\\times ', div: '\\div ' };
          return P.grid('Choose the operation for each statement about ' + t(x) + ' and ' + t(y) + '.', rows, cols, want, { colHead: 'Operation', why: function (row, got) { if (!got) return null; var gv = res[got]; return { code: 'value', hint: t(x + sym[got] + y + '=' + gv) + ', not ' + t(res[want[row]]) + '. Try another operation in that row.' }; } },
            ids.map(function (k, i) { return '(' + 'abcd'[i] + ') ' + t(x + sym[k] + (y) + '=' + res[k]); }).join('<br>'),
            ['Work out all four: ' + t(x + '+' + y) + ', ' + t(x + '-' + y) + ', ' + t(x + '\\times ' + y) + ', ' + t(x + '\\div ' + y) + '.'], 'operations ' + x + ', ' + y);
        } }] },
      { num: '9', stem: 'Find the missing integer in each statement.', parts: [
        { id: 'e9a', level: 'BEG', make: function (r) { var a = r.int(2, 12), b = r.int(2, 20); while (b === a) b = r.int(2, 20); var ans = -b + a; return missingPart('-' + a + '+\\square=' + (-b), ans, t('\\square=' + (-b) + '-(' + (-a) + ')=' + (-b) + '+' + a + '=' + ans), ['What do you add to ' + t(-a) + ' to get to ' + t(-b) + '? Think of a number line.'], function (v) { return v === -b - a ? { code: 'u1l1-sub-neg', hint: 'Undo “' + t('+(-' + a + ')') + '” by adding ' + t(a) + ': ' + t('\\square=' + (-b) + '+' + a) + '.' } : null; }); } },
        { id: 'e9b', level: 'EMG', make: function (r) { var a = r.int(2, 9), b = r.int(2, 9) * r.pick([1, -1]), ans = -a * b; return missingPart('\\square\\div(-' + a + ')=' + b, ans, t('\\square=' + b + '\\times(-' + a + ')=' + ans), ['Undo the division by multiplying: ' + t('\\square=' + b + '\\times(-' + a + ')') + '.'], function (v) { return v === -ans ? { code: 'sign', hint: 'Check the sign: ' + t(v + '\\div(-' + a + ')=' + (v / -a)) + '.' } : null; }); } },
        { id: 'e9c', level: 'PRG', make: function (r) { var a = r.int(2, 6), x = r.int(2, 9) * r.pick([1, -1]), c = r.int(1, 12), rhs = -a * x + c; return missingPart('(-' + a + ')\\times\\square+' + c + '=' + rhs, x, 'Undo the ' + t('+' + c) + ': ' + t('(-' + a + ')\\times\\square=' + rhs + '-' + c + '=' + (rhs - c)) + '. Then undo the ' + t('\\times(-' + a + ')') + ': ' + t('\\square=' + (rhs - c) + '\\div(-' + a + ')=' + x) + '.', ['First undo the ' + t('+' + c) + '.', 'Then divide by ' + t(-a) + '.'], function (v) { return v === -x ? { code: 'sign', hint: 'Check the sign: try your number in the statement.' } : v === (rhs + c) / -a ? { code: 'u1l1-sub-pos', hint: 'To undo ' + t('+' + c) + ', <b>subtract</b> ' + t(c) + '.' } : null; }); } },
        { id: 'e9d', level: 'PRG', make: function (r) {
          var x = r.int(2, 12), c = r.int(1, 30), rhs = x * x - c;
          var chk = function (resp) {
            var a = HW.parse.number(resp[0] || ''), b = HW.parse.number(resp[1] || '');
            if (!a.ok || !b.ok) return form('blank', 'There are two answers: put one in each box.');
            var A = a.value, B = b.value, good = function (v) { return v * v - c === rhs; };
            if (good(A) && good(B)) return A === B ? wrong('u1l1-root-repeat', t(A) + ' works, but you gave it twice. Which other integer has the same square?') : ok();
            if (good(A) || good(B)) { var g = good(A) ? A : B, o = good(A) ? B : A; return wrong(o === g ? 'u1l1-root-repeat' : 'u1l1-one-root', t(g) + ' works. ' + (o * o === x * x ? '' : t(o) + ' doesn’t: ' + t(o + '^{2}-' + c + '=' + (o * o - c)) + '. ') + 'A negative number squared is positive too — which other integer has the same square?'); }
            return wrong('u1l1-not-root', 'Neither value works. Undo the ' + t('-' + c) + ' first: ' + t('\\square^{2}=' + rhs + '+' + c + '=' + (rhs + c)) + '.');
          };
          var p = { prompt: t('\\square^{2}-' + c + '=' + rhs) + ' &nbsp; (list <b>all</b> answers — there are two)', input: { type: 'fields', fields: [{ name: 'First answer', label: 'One answer', before: t('\\square=') }, { name: 'Second answer', label: 'The other answer', before: t('\\square=') }] },
            check: chk, key: [String(x), String(-x)], answer: t('\\square=' + x) + ' or ' + t('\\square=' + (-x)), text: 'square missing ' + rhs,
            solution: t('\\square^{2}=' + rhs + '+' + c + '=' + (x * x)) + '. Both ' + t(x + '^{2}') + ' and ' + t('(-' + x + ')^{2}') + ' equal ' + t(x * x) + ', so ' + t('\\square=' + x) + ' or ' + t('\\square=' + (-x)) + '.',
            hints: ['Undo the ' + t('-' + c) + ' first.', 'Which integers square to ' + t(x * x) + '? (There are two.)'] };
          p.bad = [[String(x), String(x)], [String(x), '']];
          p.good = [[String(-x), String(x)]];
          return p;
        } }] },
      { num: '10', section: 'Extra practice D — Error analysis', stem: function (sh) { return sh.name + ' evaluated ' + t(tx(sh.src)) + ' as shown below. Exactly one step is the <b>first</b> incorrect step.<br>' + sh.steps.map(function (s, i) { return 'Step ' + (i + 1) + ': ' + t(s); }).join(' &nbsp; '); },
        shared: function (r) { return nadia(r); },
        parts: [
          { id: 'e10a', level: 'PRG', make: function (r, sh) {
            return P.mc(r, 'Which step is the first incorrect one, and what went wrong?', sh.opts, sh.why, ['Check each step against the one before it.', 'Watch the sign of a negative number squared, and the sign rules for × and ÷.'], 'Nadia error ' + sh.src, true);
          } },
          { id: 'e10b', level: 'PRG', make: function (r, sh) { var p = evalPart(sh.src, { prompt: 'What is the correct value of ' + t(tx(sh.src)) + '?' }); p.bad.push(String(sh.wrongAns)); return p; } }] },
      { num: '11', stem: 'Each solution below contains exactly one error.', parts: [
        { id: 'e11a', level: 'PRG', make: function (r) {
          var b = r.pick([2, 3, 4]), c = r.int(2, 5), a = b * c * r.int(1, 4), src = a + '/' + neg(-b) + '*' + c, ans = val(src), bad = a / (-b * c);
          return P.mc(r, 'Evaluate ' + t(tx(src)) + '. &nbsp; Step 1: ' + t(a + '\\div(' + (-b * c) + ')') + ' &nbsp; Step 2: ' + t(bad) + '<br>Where is the error, and what is the correct value?', [
            { html: 'Step 1: × and ÷ are done together, left to right, so ' + t(a + '\\div(-' + b + ')') + ' comes first. The value is ' + t(ans) + '.', right: true },
            { html: 'Step 2: ' + t(a + '\\div(' + (-b * c) + ')') + ' should be ' + t(-bad) + '. The value is ' + t(-bad) + '.', why: 'Step 2 follows correctly from Step 1. Look at the order in Step 1: is multiplication really done before division?' },
            { html: 'Step 1: multiplication always comes before division (the M before the D in BEDMAS). The value is ' + t(bad) + '.', why: 'In BEDMAS, D and M are done <b>together, from left to right</b> — the order of the letters doesn’t matter.' },
            { html: 'There is no error. The value is ' + t(bad) + '.', why: 'Work from left to right: ' + t(a + '\\div(-' + b + ')=' + (-a / b)) + ' first.' }],
            'Division and multiplication are done together from left to right: ' + stepsTex(src) + 'The error is in Step 1.', ['In BEDMAS, are × and ÷ done in a fixed order, or left to right?'], 'error 11a ' + src);
        } },
        { id: 'e11b', level: 'PRG', make: function (r) {
          var a = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 25, 30]), sq = a * a, src = '-' + a + '^2+' + neg(-a) + '^2';
          return P.mc(r, 'Evaluate ' + t(tx(src)) + '. &nbsp; Step 1: ' + t(sq + '+' + sq) + ' &nbsp; Step 2: ' + t(2 * sq) + '<br>Where is the error, and what is the correct value?', [
            { html: 'Step 1: ' + t('-' + a + '^{2}=-' + sq) + ' (the exponent applies only to the ' + t(a) + '), not ' + t(sq) + '. The value is ' + t('0') + '.', right: true },
            { html: 'Step 1: ' + t('(-' + a + ')^{2}=-' + sq) + ', not ' + t(sq) + '. The value is ' + t('0') + '.', why: t('(-' + a + ')^{2}=(-' + a + ')(-' + a + ')=' + sq) + ' — that part is right. Look at the other term.' },
            { html: 'Step 2: ' + t(sq + '+' + sq) + ' should be ' + t(sq) + '. The value is ' + t(sq) + '.', why: 'Step 2 is correct arithmetic. Check how Step 1 was found.' },
            { html: 'Step 1: both terms should be ' + t('-' + sq) + '. The value is ' + t(-2 * sq) + '.', why: 'The brackets in ' + t('(-' + a + ')^{2}') + ' put the negative inside the power, so it is positive.' }],
            t('-' + a + '^{2}=-(' + a + '\\times ' + a + ')=-' + sq) + ' and ' + t('(-' + a + ')^{2}=' + sq) + ', so ' + t(tx(src) + '=-' + sq + '+' + sq + '=0') + '. The error is in Step 1.', ['Without brackets, does the exponent apply to the negative sign?'], 'error 11b ' + a);
        } }] },
      { num: '12', section: 'Extra practice E — Substitution and integer reasoning', stem: function (sh) { return 'Evaluate each expression when ' + t('a=' + sh.a) + ', ' + t('b=' + sh.b) + ' and ' + t('c=' + sh.c) + '. Substitute using brackets, then apply the order of operations.'; },
        shared: function (r) { return { a: -r.int(2, 6), b: r.int(2, 6), c: -r.int(2, 6) }; },
        parts: [
          { id: 'e12a', level: 'EMG', make: function (r, sh) { return subPart('a^{2}-2ab', neg(sh.a) + '^2-2' + neg(sh.a) + '(' + sh.b + ')', '-' + (-sh.a) + '^2-2' + neg(sh.a) + '(' + sh.b + ')'); } },
          { id: 'e12b', level: 'EMG', make: function (r, sh) { return subPart('b^{2}-4ac', '(' + sh.b + ')^2-4' + neg(sh.a) + neg(sh.c), null); } },
          { id: 'e12c', level: 'EMG', make: function (r, sh) { return subPart('(a+c)^{2}', '(' + sh.a + '+' + neg(sh.c) + ')^2', null); } },
          { id: 'e12d', level: 'EMG', make: function (r, sh) { return subPart('a^{2}+c^{2}', neg(sh.a) + '^2+' + neg(sh.c) + '^2', '-' + (-sh.a) + '^2-' + (-sh.c) + '^2'); } },
          { id: 'e12e', level: 'PRG', make: function (r, sh) {
            var s = Math.pow(sh.a + sh.c, 2), q = sh.a * sh.a + sh.c * sh.c;
            return P.mc(r, 'Compare your answers to (c) and (d): ' + t('(a+c)^{2}=' + s) + ' and ' + t('a^{2}+c^{2}=' + q) + '. What does this tell you?', [
              { html: t('(a+c)^{2}') + ' is <b>not</b> the same as ' + t('a^{2}+c^{2}') + ': you must add first, then square (brackets first).', right: true },
              { html: 'Squaring a sum is the same as adding the squares; one answer must have an arithmetic slip.', why: 'Both answers are right — and they are different. So the two expressions aren’t equal.' },
              { html: 'They are only different because ' + t('a') + ' and ' + t('c') + ' are negative.', why: 'Try ' + t('a=1') + ', ' + t('c=2') + ': ' + t('(1+2)^{2}=9') + ' but ' + t('1^{2}+2^{2}=5') + '.' },
              { html: t('(a+c)^{2}') + ' is always smaller than ' + t('a^{2}+c^{2}') + '.', why: 'Here ' + t(s) + ' is ' + (s > q ? 'bigger' : 'not smaller') + '. Think about what the brackets mean.' }],
              t('(a+c)^{2}=' + s) + ' but ' + t('a^{2}+c^{2}=' + q) + '. Brackets first: add, then square. In general ' + t('(a+c)^{2}\\ne a^{2}+c^{2}') + '.', ['Were your two answers equal?'], 'square of a sum');
          } }] },
      { num: '13', stem: function (sh) { return 'Evaluate each expression when ' + t('x=' + sh.x) + ' and ' + t('y=' + sh.y) + '.'; },
        shared: function (r) { var x = -r.int(2, 6), y = -r.int(2, 7); while (y === x) y = -r.int(2, 7); return { x: x, y: y }; },
        parts: [
          { id: 'e13a', level: 'PRG', make: function (r, sh) { return subPart('x^{2}y', neg(sh.x) + '^2' + neg(sh.y), null); } },
          { id: 'e13b', level: 'PRG', make: function (r, sh) { return subPart('xy^{2}', neg(sh.x) + neg(sh.y) + '^2', null); } },
          { id: 'e13c', level: 'PRG', make: function (r, sh) { return subPart('-x^{2}-y', '-' + neg(sh.x) + '^2-' + neg(sh.y), null); } },
          { id: 'e13d', level: 'PRG', make: function (r, sh) { return subPart('(xy)^{2}', '[' + neg(sh.x) + neg(sh.y) + ']^2', null); } }] },
      { num: '14', stem: 'Decide whether each statement is true or false. If it is false, choose a counterexample (one specific case that breaks it).', parts: ['a', 'b', 'c', 'd'].map(function (L, i) {
        return { id: 'e14' + L, level: 'PRG', make: function (r) { return tfPart(r, i); } };
      }) },
      { num: '15', stem: function (sh) { return 'The product of ' + sh.k + ' nonzero integers is <b>' + (sh.want === 'neg' ? 'negative' : 'positive') + '</b>.'; },
        shared: function (r) { return { k: r.pick([3, 3, 4, 5, 6]), want: r.pick(['neg', 'neg', 'pos']) }; },
        parts: [
          { id: 'e15a', level: 'PRG', make: function (r, sh) {
            var rows = [], want = {};
            for (var n = 0; n <= sh.k; n++) { rows.push({ id: 'n' + n, label: n + ' negative', html: n + ' negative, ' + (sh.k - n) + ' positive' }); want['n' + n] = n % 2 ? 'neg' : 'pos'; }
            var p = P.grid('For each combination of signs, is the product positive or negative?', rows, [{ id: 'pos', html: 'positive' }, { id: 'neg', html: 'negative' }], want, { rowHead: 'Factors', why: function (row) { var n = Number(row.slice(1)); return { code: 'sign', hint: 'With ' + n + ' negative factor' + (n === 1 ? '' : 's') + ', pair the negatives up: ' + (n % 2 ? 'one is left over, so the product is negative.' : 'they all pair up, so the product is positive.') }; } },
              rows.map(function (rw, n) { return rw.html + ': ' + (n % 2 ? 'negative' : 'positive'); }).join('<br>') + '<br>So the combinations that give a <b>' + (sh.want === 'neg' ? 'negative' : 'positive') + '</b> product are the ones with ' + (sh.want === 'neg' ? 'an odd' : 'an even') + ' number of negative factors.',
              ['Each negative factor flips the sign of the product once.'], 'sign table k=' + sh.k);
            return p;
          } },
          { id: 'e15b', level: 'PRG', make: function (r, sh) {
            var isNeg = sh.want === 'neg';
            var p = P.mc(r, 'Complete the sentence: “A product of nonzero integers is ' + (isNeg ? 'negative' : 'positive') + ' exactly when the number of negative factors is ____.”', [
              { html: '<b>odd</b>', right: isNeg, why: isNeg ? null : 'An odd number of negatives leaves one unpaired, which makes the product negative.', code: 'odd' },
              { html: '<b>even</b> (including zero)', right: !isNeg, why: isNeg ? 'With an even number of negatives they all pair up and the product is positive.' : null, code: 'even' }],
              'Negatives pair up to make positives. ' + (isNeg ? 'The product is negative exactly when one negative is left over: an <b>odd</b> number of negative factors.' : 'The product is positive exactly when every negative is paired: an <b>even</b> number of negative factors (zero counts as even).'), ['Look at your table from part (a).'], 'odd/even rule', true);
            p.input.columns = 2; p.tries = 1;
            return p;
          } }] },
      { num: '16', section: 'Extra practice F — Applications and challenge', stem: 'Write <b>one</b> integer expression that uses multiplication for the repeated changes, then evaluate it.', parts: [
        { id: 'e16', level: 'PRG', make: function (r) {
          var T0 = -r.int(1, 6), f = r.int(2, 5), h1 = r.int(3, 6), u = r.int(1, 4), h2 = r.int(2, 5), ans = T0 - f * h1 + u * h2, key = T0 + '+' + h1 + '(' + (-f) + ')+' + h2 + '(' + u + ')';
          var p = P.fields('At midnight a weather station recorded ' + t(T0 + '^{\\circ}\\text{C}') + '. The temperature then fell ' + t(f + '^{\\circ}\\text{C}') + ' each hour for the next ' + t(h1) + ' hours, and after that rose ' + t(u + '^{\\circ}\\text{C}') + ' each hour for ' + t(h2) + ' hours. Determine the temperature ' + t(h1 + h2) + ' hours after midnight.',
            [exprField(), { name: 'Temperature', label: 'Temperature', after: '°C' }],
            [exprChk(ans, [T0, f, h1, u, h2], { mul: true, why: 'Falling ' + f + '° each hour for ' + h1 + ' hours is ' + t(h1 + '(-' + f + ')') + '; rising ' + u + '° each hour for ' + h2 + ' hours is ' + t(h2 + '(' + u + ')') + '.', example: key }),
              K.number(ans, function (v) { if (v === T0 - f + u) return { code: 'u1l1-no-mul', hint: 'The temperature falls ' + t(f + '^{\\circ}') + ' <b>each hour</b> for ' + t(h1) + ' hours — multiply.' }; if (v === T0 + f * h1 - u * h2) return { code: 'sign', hint: 'Falling is negative; rising is positive.' }; return null; })],
            [key, String(ans)], t(tx(key) + '=' + ans + '^{\\circ}\\text{C}'),
            'Falling is negative, rising is positive, and repeated changes are multiplied:' + stepsTex(key) + 'The temperature is ' + t(ans + '^{\\circ}\\text{C}') + '.',
            ['A fall of ' + t(f + '^{\\circ}') + ' for ' + t(h1) + ' hours is ' + t(h1 + '\\times(-' + f + ')') + '.', 'Start with ' + t(T0) + ', then add both changes.'], 'weather ' + key);
          if (T0 - f + u !== ans) p.bad = [[key, String(T0 - f + u)]];
          return p;
        } }] },
      { num: '17', stem: 'Write <b>one</b> integer expression that uses multiplication for the repeated changes, then evaluate it.', parts: [
        { id: 'e17', level: 'PRG', make: function (r) {
          var name = r.pick(['Dana', 'Mia', 'Leah', 'Ava', 'Zoe']), b0 = -r.pick([25, 30, 35, 40, 45, 50, 55, 60]), d = r.pick([20, 25, 30, 35, 40]), w = r.int(3, 4), fee = r.pick([8, 10, 12, 15]), nf = r.int(1, w - 1), ans = b0 + w * d - nf * fee;
          var key = b0 + '+' + w + '(' + d + ')-' + nf + '(' + fee + ')';
          var p = P.fields(name + '’s account balance is ' + t('-\\$' + (-b0)) + ' (overdrawn). She deposits ' + t('\\$' + d) + ' each week for ' + t(w) + ' weeks, and the bank charges a ' + t('\\$' + fee) + ' overdraft fee on ' + (nf === 1 ? 'one' : nf === 2 ? 'two' : 'three') + ' of those weeks. Determine her balance after the ' + t(w) + ' weeks.',
            [exprField(), { name: 'Balance', label: 'Balance', before: '$' }],
            [exprChk(ans, [b0, w, d, nf, fee], { mul: true, why: 'Deposits add, fees subtract, and repeated amounts are multiplied.', example: key }),
              K.number(ans, function (v) { if (v === b0 + d - fee) return { code: 'u1l1-no-mul', hint: 'She deposits ' + t('\\$' + d) + ' <b>each week</b> for ' + t(w) + ' weeks, and pays the fee ' + nf + ' time' + (nf > 1 ? 's' : '') + ' — multiply.' }; if (v === b0 + w * d - w * fee) return { code: 'u1l1-no-mul', hint: 'The fee is charged on only ' + nf + ' of the weeks.' }; return null; })],
            [key, String(ans)], t(tx(key) + '=' + ans) + ' dollars',
            'Deposits are positive, fees negative:' + stepsTex(key) + 'Her balance is ' + (ans < 0 ? t('-\\$' + (-ans)) : t('\\$' + ans)) + '.', ['Deposits: ' + t(w + '\\times ' + d) + '. Fees: ' + t(nf + '\\times ' + fee) + '.'], 'account ' + key);
          if (b0 + d - fee !== ans) p.bad = [[key, String(b0 + d - fee)]];
          return p;
        } }] },
      { num: '18', stem: 'Recall that ' + t('|x|') + ' means the distance of ' + t('x') + ' from zero on a number line, so ' + t('|-7|=7') + ' and ' + t('|5|=5') + '.', parts: [
        { id: 'e18', level: 'ADV', make: function (r) {
          var a = r.int(-3, 4), b = r.int(2, 5), lo = a - b + 1, hi = a + b - 1, n = hi - lo + 1, ex = a === 0 ? 'n' : a > 0 ? 'n-' + a : 'n+' + (-a);
          var chkLo = K.number(lo, function (v) { return v === lo - 1 ? { code: 'u1l1-endpoint', hint: 'At ' + t('n=' + v) + ' the distance is exactly ' + t(b) + ', and the inequality says <b>less than</b> ' + t(b) + '.' } : null; });
          var chkHi = K.number(hi, function (v) { return v === hi + 1 ? { code: 'u1l1-endpoint', hint: 'At ' + t('n=' + v) + ' the distance is exactly ' + t(b) + ', and the inequality says <b>less than</b> ' + t(b) + '.' } : null; });
          var chkN = K.number(n, function (v) { return v === n + 2 || v === n + 1 ? { code: 'u1l1-endpoint', hint: 'Leave out the two integers at distance exactly ' + t(b) + '.' } : v === n - 1 ? { code: 'u1l1-count', hint: 'Count again: from ' + t(lo) + ' to ' + t(hi) + ' there are ' + t(hi + '-(' + lo + ')+1') + ' integers.' } : null; });
          var p = P.fields('Find <b>all</b> integer values of ' + t('n') + ' for which ' + t('|' + ex + '|<' + b) + '. Give the least and the greatest, and how many there are.',
            [{ name: 'Least', label: 'Least value', before: t('n=') }, { name: 'Greatest', label: 'Greatest value', before: t('n=') }, { name: 'How many', label: 'How many values' }],
            [chkLo, chkHi, chkN], [String(lo), String(hi), String(n)], t('n=' + listInts(lo, hi)) + ' — ' + n + ' values',
            t('|' + ex + '|<' + b) + ' means ' + t('n') + ' is less than ' + t(b) + ' units from ' + t(a) + ' on the number line: ' + t((a - b) + '<n<' + (a + b)) + '.<br>So ' + t('n=' + listInts(lo, hi)) + ': <b>' + n + ' values</b>.',
            [t('|' + ex + '|') + ' is the distance between ' + t('n') + ' and ' + t(a) + '.', 'The distance must be <b>less than</b> ' + t(b) + ', so the endpoints ' + t(a - b) + ' and ' + t(a + b) + ' don’t count.'], 'abs ' + ex + '<' + b);
          p.bad = [[String(lo - 1), String(hi + 1), String(n + 2)]];
          return p;
        } }] },
      { num: '19', stem: function (sh) { return 'The integers ' + t(sh.v.join(',\\ ')) + ' are placed into the three boxes of ' + t('\\square\\times\\square+\\square') + ', using each integer exactly once.'; },
        shared: function (r) {
          return find(function () { var v = r.shuffle([-r.int(2, 8), r.int(2, 6), -r.int(2, 6)]); return { v: v }; }, function (s) {
            var u = s.v.map(Math.abs); if (u[0] === u[1] || u[1] === u[2] || u[0] === u[2]) return false;
            var vs = arrangements(s.v).map(function (q) { return q.val; }), mx = Math.max.apply(null, vs), mn = Math.min.apply(null, vs);
            return vs.filter(function (x) { return x === mx; }).length <= 2 && vs.filter(function (x) { return x === mn; }).length <= 2 && mx !== mn;
          }, { v: [-6, 3, -2] });
        },
        parts: [
          { id: 'e19a', level: 'ADV', make: function (r, sh) { return extremePart(sh.v, true); } },
          { id: 'e19b', level: 'MAS', make: function (r, sh) { return extremePart(sh.v, false); } }] }
    ]
  });

  /* ---------- part makers that need the helpers above ---------- */
  function listInts(a, b) { var o = []; for (var i = a; i <= b; i++) o.push(i); return o.join(',\\ '); }
  function missingPart(eq, ans, sol, hints, diag) {
    var p = P.number(t(eq), ans, diag, sol, hints, 'missing ' + eq, { before: t('\\square=') });
    p.bad = [String(-ans)].filter(function (s) { return Number(s) !== ans; });
    return p;
  }
  /* substitution: src = the expression with the values in brackets; noBr = the same without brackets (the classic slip) */
  function subPart(exprTex, src, noBr) {
    var ans = val(src), wrongV = noBr ? val(noBr) : null;
    var p = evalPart(src, { prompt: t(exprTex), inp: { before: t(exprTex + '=') }, pre: 'Substitute, keeping each value in brackets:',
      diag: function (v) { return wrongV != null && v === wrongV && v !== ans ? { code: 'u1l1-sub-brackets', hint: 'Put each negative value in <b>brackets</b> when you substitute, so the exponent applies to the whole number: ' + t('(-3)^{2}=9') + ', not ' + t('-3^{2}=-9') + '.' } : null; },
      hints: ['Replace each letter with its value <b>in brackets</b>.', 'Then follow BEDMAS: exponents before multiplication.'], text: 'substitute ' + exprTex });
    if (wrongV != null && wrongV !== ans) p.bad.push(String(wrongV));
    return p;
  }
  /* EP 7: insert one pair of brackets */
  function placements(nums, ops) {
    var out = [];
    for (var i = 0; i < nums.length; i++) for (var j = i + 1; j < nums.length; j++) {
      if (i === 0 && j === nums.length - 1) continue;
      var s = '';
      for (var k = 0; k < nums.length; k++) { if (k === i) s += '('; s += nums[k]; if (k === j) s += ')'; if (k < ops.length) s += ops[k]; }
      out.push(s);
    }
    return out;
  }
  function plainSeq(nums, ops) { var s = ''; for (var k = 0; k < nums.length; k++) { s += nums[k]; if (k < ops.length) s += ops[k]; } return s; }
  function bracketPart(r, kind) {
    var v = find(function () {
      var nums, ops;
      if (kind === 0) { nums = [r.int(1, 9), r.int(2, 9), r.int(2, 5), 0, r.int(2, 5)]; nums[3] = nums[4] * r.int(1, 6); ops = ['+', '*', '-', '/']; }
      else { nums = [r.int(5, 20), r.int(2, 6), r.int(2, 6), r.int(1, 5)]; ops = ['-', '*', '+']; }
      var pl = placements(nums, ops), base = val(plainSeq(nums, ops)), vals = pl.map(val);
      var good = pl.filter(function (s, i) { var x = vals[i]; return x % 1 === 0 && x !== base && vals.filter(function (y) { return y === x; }).length === 1; });
      if (!good.length) return null;
      var pick = kind === 0 ? good.filter(function (s) { return /^\(/.test(s); })[0] || r.pick(good) : good.filter(function (s) { return /\)$/.test(s); })[0] || r.pick(good);
      return { nums: nums, ops: ops, pick: pick, target: val(pick), base: base, others: pl.filter(function (s) { return s !== pick; }) };
    }, function (v) { return !!v; }, null) || { nums: [3, 5, 2, 8, 4], ops: ['+', '*', '-', '/'], pick: '(3+5)*2-8/4', target: 14, base: 11, others: [] };
    var seq = plainSeq(v.nums, v.ops), seqTex = tx(seq);
    var check = function (resp) {
      var s = normExpr(resp).replace(/\[/g, '(').replace(/\]/g, ')');
      if (!s) return form('empty', 'Type the expression with your brackets.');
      var opens = (s.match(/\(/g) || []).length, closes = (s.match(/\)/g) || []).length;
      var stripped = s.replace(/[()]/g, '');
      if (stripped !== seq) return form('u1l1-brackets-moved', 'Keep the numbers and operations exactly as they are (' + t(seqTex) + ') — only add one pair of brackets.');
      if (opens !== 1 || closes !== 1) return form('u1l1-brackets-count', 'Use exactly <b>one</b> pair of brackets.');
      var tr = parseE(s); if (!tr) return form('u1l1-expr-read', 'I can’t read that. Put the brackets around numbers and operations, like ' + t('(3+5)\\times 2') + '.');
      var x = evalE(tr);
      if (x === v.target) return ok();
      return wrong('u1l1-brackets', 'With your brackets the value is ' + t(String(Math.round(x * 100) / 100)) + ', not ' + t(v.target) + '. Try another place.');
    };
    var key = v.pick;
    return { prompt: t(seqTex) + ' &nbsp; so that the value is ' + t(v.target) + '. <span class="muted">(Check: without brackets the value is ' + t(v.base) + '.)</span>', input: { type: 'math', keys: 'intops', placeholder: 'e.g. (3 + 5) × 2 − 8 ÷ 4' },
      check: check, key: key, answer: t(tx(key) + '=' + v.target), text: 'brackets ' + seq + ' = ' + v.target,
      solution: 'Try a pair of brackets around each group and evaluate. Only one placement gives ' + t(v.target) + ':' + stepsTex(key),
      hints: ['Brackets make the operation inside happen first. Which operation would have to happen first to reach ' + t(v.target) + '?', 'Try brackets around an addition or a subtraction.'], bad: [seq, v.others[0] || '(' + seq + ')'] };
  }
  /* EP 10: a worked solution with one wrong step */
  function nadia(r) {
    var name = r.pick(['Nadia', 'Liam', 'Ella', 'Omar', 'Grace']);
    return find(function () {
      var a = r.int(2, 4), b = r.int(1, 5), c = b + r.int(2, 4), e = r.int(2, 4), d = e * r.int(1, 4), kind = r.pick(['sq', 'sq', 'mul', 'div']);
      var src = '-' + a + '(' + b + '-' + c + ')^2+' + d + '/' + neg(-e), m = b - c, sq = m * m, prod = -a * sq, quo = -d / e, ans = prod + quo;
      var s1 = '-' + a + '(' + m + ')^{2}+' + d + '\\div(-' + e + ')', steps, wrongAns, opts, why;
      var O1 = { html: 'Step 1: ' + t(b + '-' + c) + ' should be ' + t(-m) + '.', why: t(b + '-' + c + '=' + m) + ' — Step 1 is right.', code: 's1' };
      if (kind === 'sq') {
        steps = [s1, '-' + a + '(' + (-sq) + ')+' + d + '\\div(-' + e + ')', (a * sq) + '+(' + quo + ')', String(a * sq + quo)]; wrongAns = a * sq + quo;
        opts = [O1, { html: 'Step 2: ' + t('(' + m + ')^{2}') + ' was written as ' + t(-sq) + '; a negative number squared is positive, ' + t(sq) + '.', right: true },
          { html: 'Step 3: ' + t('-' + a + '(' + (-sq) + ')') + ' should be ' + t(-a * sq) + '.', why: 'Step 3 follows correctly from Step 2 (two negatives make a positive). The error is earlier.', code: 's3' },
          { html: 'Step 4: ' + t((a * sq) + '+(' + quo + ')') + ' should be ' + t(a * sq - quo) + '.', why: 'Step 4 follows correctly from Step 3. The error is earlier.', code: 's4' }];
        why = 'Step 2 is the first error: ' + t('(' + m + ')^{2}=(' + m + ')(' + m + ')=' + sq) + ', not ' + t(-sq) + '.';
      } else if (kind === 'mul') {
        steps = [s1, '-' + a + '(' + sq + ')+' + d + '\\div(-' + e + ')', (a * sq) + '+(' + quo + ')', String(a * sq + quo)]; wrongAns = a * sq + quo;
        opts = [O1, { html: 'Step 2: ' + t('(' + m + ')^{2}') + ' should be ' + t(-sq) + '.', why: t('(' + m + ')^{2}=' + sq) + ' — a negative squared is positive, so Step 2 is right.', code: 's2' },
          { html: 'Step 3: ' + t('-' + a + '(' + sq + ')') + ' was written as ' + t(a * sq) + '; different signs give a negative product, ' + t(-a * sq) + '.', right: true },
          { html: 'Step 4: ' + t((a * sq) + '+(' + quo + ')') + ' should be ' + t(a * sq - quo) + '.', why: 'Step 4 follows correctly from Step 3. The error is earlier.', code: 's4' }];
        why = 'Step 3 is the first error: ' + t('-' + a + '(' + sq + ')=' + (-a * sq)) + ' (different signs give a negative product).';
      } else {
        steps = [s1, '-' + a + '(' + sq + ')+' + d + '\\div(-' + e + ')', (-a * sq) + '+' + (-quo), String(-a * sq - quo)]; wrongAns = -a * sq - quo;
        opts = [O1, { html: 'Step 2: ' + t('(' + m + ')^{2}') + ' should be ' + t(-sq) + '.', why: t('(' + m + ')^{2}=' + sq) + ' — a negative squared is positive, so Step 2 is right.', code: 's2' },
          { html: 'Step 3: ' + t(d + '\\div(-' + e + ')') + ' was written as ' + t(-quo) + '; different signs give a negative quotient, ' + t(quo) + '.', right: true },
          { html: 'Step 4: ' + t((-a * sq) + '+' + (-quo)) + ' should be ' + t(-a * sq - quo - 1) + '.', why: 'Step 4 follows correctly from Step 3. The error is earlier.', code: 's4' }];
        why = 'Step 3 is the first error: ' + t(d + '\\div(-' + e + ')=' + quo) + ' (different signs give a negative quotient).';
      }
      return { name: name, src: src, steps: steps, opts: opts, why: why + ' Correct work:' + stepsTex(src) + 'The correct value is ' + t(ans) + '.', wrongAns: wrongAns, ans: ans };
    }, function (v) { return v.wrongAns !== v.ans && v.ans !== 0; }, null);
  }
  /* EP 14: true or false, with a counterexample */
  function tfPart(r, i) {
    var S;
    if (i === 0) {
      var k = r.int(2, 7), claim = r.pick(['neg', 'pos']), isT = (k % 2 === 1) === (claim === 'neg'), xs = []; for (var j = 0; j < k; j++) xs.push(-r.int(1, 4));
      var pr = xs.reduce(function (m, x) { return m * x; }, 1), xt = xs.map(function (x) { return '(' + x + ')'; }).join('');
      var ys = xs.slice(); ys[0] = -ys[0]; var pr2 = ys.reduce(function (m, x) { return m * x; }, 1);
      S = { text: 'The product of ' + ['', '', 'two', 'three', 'four', 'five', 'six', 'seven'][k] + ' negative integers is always ' + (claim === 'neg' ? 'negative' : 'positive') + '.', truth: isT,
        good: isT ? null : t(xt + '=' + pr), bad: [t(ys.map(function (x) { return '(' + x + ')'; }).join('') + '=' + pr2) + ' (not all negative)', t('(' + xs[0] + ')+(' + (xs[1] || -2) + ')=' + (xs[0] + (xs[1] || -2))) + ' (a sum, not a product)'],
        why: 'With ' + k + ' negative factors, they ' + (k % 2 ? 'pair up except one, so the product is always negative' : 'all pair up, so the product is always positive') + '.' };
    } else if (i === 1) {
      var v = r.pick(['prodneg', 'sumneg', 'prodpos', 'quoneg', 'sumzero', 'diffneg', 'prodzero', 'prod3']), a = r.int(2, 9), b = r.int(2, 9); if (b === a) b = a === 9 ? 2 : a + 1;
      if (v === 'prodneg') S = { text: 'If the product of two integers is negative, then exactly one of the two integers is negative.', truth: true, bad: [t('(' + (-a) + ')(' + (-b) + ')=' + a * b), t('(' + a + ')(0)=0')], why: 'A negative product needs different signs: one negative and one positive.' };
      else if (v === 'quoneg') S = { text: 'If the quotient of two integers is negative, then exactly one of the two integers is negative.', truth: true, bad: [t('(' + (-a * b) + ')\\div(' + (-b) + ')=' + a), t((a * b) + '\\div ' + b + '=' + a)], why: 'A negative quotient needs different signs: one negative and one positive.' };
      else if (v === 'sumzero') S = { text: 'If the sum of two integers is zero, then the two integers are opposites (like ' + t(a) + ' and ' + t(-a) + ').', truth: true, bad: [t(a + '+' + b + '=' + (a + b)), t('(' + (-a) + ')+(' + (-b) + ')=' + (-a - b))], why: 'If ' + t('x+y=0') + ' then ' + t('y=-x') + ': the numbers are opposites.' };
      else if (v === 'sumneg') { var big = a + b; S = { text: 'If the sum of two integers is negative, then both integers are negative.', truth: false, good: t('(' + (-big) + ')+' + a + '=' + (a - big)) + ' (only one is negative)', bad: [t('(' + (-a) + ')+(' + (-b) + ')=' + (-a - b)), t(a + '+' + b + '=' + (a + b))], why: 'A sum can be negative when only one number is negative, as long as it is the one farther from zero.' }; }
      else if (v === 'diffneg') { var lo2 = Math.min(a, b), hi2 = Math.max(a, b); S = { text: 'If the difference of two integers ' + t('x-y') + ' is negative, then both integers are negative.', truth: false, good: t('x=' + lo2 + ',\\ y=' + hi2) + ': ' + t(lo2 + '-' + hi2 + '=' + (lo2 - hi2)) + ' (both positive)', bad: [t('x=' + (-hi2) + ',\\ y=' + (-lo2)) + ': ' + t('-' + hi2 + '-(-' + lo2 + ')=' + (lo2 - hi2)), t('x=' + hi2 + ',\\ y=' + lo2) + ': ' + t(hi2 + '-' + lo2 + '=' + (hi2 - lo2))], why: 'A difference is negative whenever ' + t('x') + ' is less than ' + t('y') + ', even if both are positive.' }; }
      else if (v === 'prodzero') S = { text: 'If the product of two integers is zero, then both integers are zero.', truth: false, good: t('(0)(' + a + ')=0') + ' (only one is zero)', bad: [t('(0)(0)=0'), t('(' + a + ')(' + b + ')=' + a * b)], why: 'Only one factor needs to be zero.' };
      else if (v === 'prod3') S = { text: 'If the product of three integers is negative, then all three integers are negative.', truth: false, good: t('(' + (-a) + ')(' + b + ')(' + 2 + ')=' + (-2 * a * b)) + ' (only one is negative)', bad: [t('(' + (-a) + ')(' + (-b) + ')(-1)=' + (-a * b)), t('(' + (-a) + ')(' + (-b) + ')(1)=' + (a * b))], why: 'One negative factor (or three) makes the product negative.' };
      else S = { text: 'If the product of two integers is positive, then both integers are positive.', truth: false, good: t('(' + (-a) + ')(' + (-b) + ')=' + a * b) + ' (both negative)', bad: [t('(' + a + ')(' + b + ')=' + a * b), t('(' + (-a) + ')(' + b + ')=' + (-a * b))], why: 'Two negatives also give a positive product.' };
    } else if (i === 2) {
      var e = r.int(2, 7), kind = r.pick(['neg', 'pos']), n = r.int(2, 6), isT2 = kind === 'neg' ? e % 2 === 1 : e % 2 === 0, pw = Math.pow(n, e);
      S = { text: kind === 'neg' ? t('(-n)^{' + e + '}=-n^{' + e + '}') + ' for every integer ' + t('n') + '.' : t('(-n)^{' + e + '}=n^{' + e + '}') + ' for every integer ' + t('n') + '.', truth: isT2,
        good: isT2 ? null : t('n=' + n) + ': ' + t('(-' + n + ')^{' + e + '}=' + (e % 2 ? -pw : pw)) + ' but ' + (kind === 'neg' ? t('-' + n + '^{' + e + '}=' + (-pw)) : t(n + '^{' + e + '}=' + pw)),
        bad: [t('n=0') + ': both sides are ' + t('0'), t('n=1') + ': ' + t('1^{' + e + '}=1')],
        why: (e % 2 ? 'An odd power of ' + t('-n') + ' keeps the negative: ' + t('(-n)^{' + e + '}=-n^{' + e + '}') + ' always.' : 'An even power of ' + t('-n') + ' is positive: ' + t('(-n)^{' + e + '}=n^{' + e + '}') + ' always.') };
    } else {
      var w = r.pick(['negn', 'square', 'less', 'double', 'subneg', 'divneg', 'opp', 'timesneg']), m = r.int(2, 9), q = r.int(2, 9);
      if (w === 'negn') S = { text: t('-n') + ' is a negative integer for every integer ' + t('n') + '.', truth: false, good: t('n=-' + m) + ' gives ' + t('-n=' + m) + ', which is positive', bad: [t('n=' + m) + ' gives ' + t('-n=-' + m), t('n=' + (m + 1)) + ' gives ' + t('-n=-' + (m + 1))], why: 'If ' + t('n') + ' is already negative, ' + t('-n') + ' is positive (and ' + t('n=0') + ' gives ' + t('0') + ').' };
      else if (w === 'square') S = { text: t('n^{2}') + ' is greater than ' + t('n') + ' for every integer ' + t('n') + '.', truth: false, good: t('n=1') + ': ' + t('1^{2}=1') + ', which is not greater than ' + t('1'), bad: [t('n=-' + m) + ': ' + t('(-' + m + ')^{2}=' + m * m + '>-' + m), t('n=' + m) + ': ' + t(m + '^{2}=' + m * m + '>' + m)], why: 'For ' + t('n=0') + ' or ' + t('n=1') + ', ' + t('n^{2}=n') + '.' };
      else if (w === 'less') S = { text: t('-n') + ' is less than ' + t('n') + ' for every integer ' + t('n') + '.', truth: false, good: t('n=-' + m) + ': ' + t('-n=' + m) + ', which is greater than ' + t('-' + m), bad: [t('n=' + m) + ': ' + t('-' + m + '<' + m), t('n=' + (m + 2)) + ': ' + t('-' + (m + 2) + '<' + (m + 2))], why: 'For a negative ' + t('n') + ', ' + t('-n') + ' is positive and so greater than ' + t('n') + '.' };
      else if (w === 'subneg') S = { text: 'Subtracting a negative integer from a number always makes the result smaller than the number.', truth: false, good: t(m + '-(-' + q + ')=' + (m + q)) + ', which is bigger than ' + t(m), bad: [t(m + '-' + q + '=' + (m - q)) + ' (subtracting a positive)', t('-' + m + '-' + q + '=' + (-m - q)) + ' (subtracting a positive)'], why: 'Subtracting a negative is adding a positive, so the result is always <b>bigger</b>.' };
      else if (w === 'divneg') S = { text: t('n\\div(-1)=-n') + ' for every integer ' + t('n') + '.', truth: true, bad: [t('n=' + m) + ': ' + t(m + '\\div(-1)=-' + m), t('n=-' + m) + ': ' + t('-' + m + '\\div(-1)=' + m)], why: 'Dividing by ' + t('-1') + ' only changes the sign.' };
      else if (w === 'opp') S = { text: t('n+(-n)=0') + ' for every integer ' + t('n') + '.', truth: true, bad: [t('n=' + m) + ': ' + t(m + '+(-' + m + ')=0'), t('n=-' + m) + ': ' + t('-' + m + '+' + m + '=0')], why: 'A number and its opposite always add to zero.' };
      else if (w === 'timesneg') S = { text: t('(-1)\\times n') + ' is negative for every integer ' + t('n') + '.', truth: false, good: t('n=-' + m) + ': ' + t('(-1)\\times(-' + m + ')=' + m), bad: [t('n=' + m) + ': ' + t('(-1)\\times ' + m + '=-' + m), t('n=' + (m + 1)) + ': ' + t('(-1)\\times ' + (m + 1) + '=-' + (m + 1))], why: 'If ' + t('n') + ' is negative, ' + t('(-1)\\times n') + ' is positive.' };
      else S = { text: t('n-(-n)=2n') + ' for every integer ' + t('n') + '.', truth: true, bad: [t('n=' + m) + ': ' + t(m + '-(-' + m + ')=' + 2 * m), t('n=-' + m) + ': ' + t('-' + m + '-' + m + '=-' + 2 * m)], why: 'Subtracting ' + t('-n') + ' is adding ' + t('n') + ': ' + t('n-(-n)=n+n=2n') + '.' };
    }
    var opts = [{ html: '<b>True</b>', right: S.truth, why: S.truth ? null : 'It is false — try some numbers, including negatives, ' + t('0') + ' and ' + t('1') + '.', code: 'said-true' }];
    if (!S.truth) opts.push({ html: '<b>False</b> — counterexample: ' + S.good, right: true });
    var nb = S.truth ? 2 : 1;
    S.bad.slice(0, nb).forEach(function (b) { opts.push({ html: '<b>False</b> — counterexample: ' + b, why: S.truth ? 'That example doesn’t break the statement. ' + S.why : 'That example doesn’t break the statement — the statement holds there.', code: 'bad-cx' }); });
    return P.mc(r, S.text, opts, (S.truth ? '<b>True.</b> ' : '<b>False.</b> Counterexample: ' + S.good + '. ') + S.why, ['Test the statement with a few numbers: positive, negative, ' + t('0') + ' and ' + t('1') + '.', 'A counterexample has to make the statement <b>false</b>.'], 'T/F ' + S.text.replace(/<[^>]+>|\\\(|\\\)/g, ''), true);
  }
  /* EP 19: greatest and least value of □×□+□ */
  function arrangements(v) {
    var out = [], P3 = [[0, 1, 2], [1, 0, 2], [0, 2, 1], [2, 0, 1], [1, 2, 0], [2, 1, 0]];
    P3.forEach(function (p) { out.push({ a: v[p[0]], b: v[p[1]], c: v[p[2]], val: v[p[0]] * v[p[1]] + v[p[2]] }); });
    return out;
  }
  function arrTex(q) { return texE(num(q.a), true) + '\\times ' + texE(num(q.b), false) + '+' + texE(num(q.c), false); }
  function arrSrc(q) { return (q.a < 0 ? '(' + q.a + ')' : q.a) + '*' + (q.b < 0 ? '(' + q.b + ')' : q.b) + '+' + (q.c < 0 ? '(' + q.c + ')' : q.c); }
  function extremePart(v, great) {
    var A = arrangements(v), vals = A.map(function (q) { return q.val; }), target = great ? Math.max.apply(null, vals) : Math.min.apply(null, vals), best = A.filter(function (q) { return q.val === target; })[0];
    var other = great ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
    var valChk = K.number(target, function (x) {
      if (vals.indexOf(x) >= 0) return { code: great ? 'u1l1-not-greatest' : 'u1l1-not-least', hint: t(x) + ' is one of the possible values, but not the ' + (great ? 'greatest' : 'least') + '. Try every arrangement — there are only six.' };
      return null;
    });
    var arrChk = function (resp) {
      var s = normExpr(resp); if (!s) return form('empty', 'Write the arrangement, like ' + t(arrTex(best)) + '.');
      var tr = parseE(s); if (!tr) return form('u1l1-expr-read', 'I can’t read that. Write it like ' + t(arrTex(A[0])) + '.');
      var lits = []; (function w(n) { if (n.t === 'num') lits.push(n.v); else { if (n.a) w(n.a); if (n.b) w(n.b); } })(tr);
      var sorted = lits.slice().sort(function (x, y) { return x - y; }).join(','), want = v.slice().sort(function (x, y) { return x - y; }).join(',');
      if (sorted !== want || !(tr.t === 'add' && tr.b && (tr.a.t === 'mul'))) return form('u1l1-arrange-nums', 'Write the arrangement in the form ' + t('\\square\\times\\square+\\square') + ', using each of ' + t(v.join(',\\ ')) + ' exactly once.');
      var x = evalE(tr); if (x === target) return ok();
      return wrong('u1l1-arrange', 'That arrangement gives ' + t(x) + '. ' + (great ? 'Look for a product that is as large as possible.' : 'Look for a product that is as negative as possible.'));
    };
    var p = P.fields('Determine the <b>' + (great ? 'greatest' : 'least') + '</b> value that can be produced, and an arrangement that gives it.',
      [{ name: 'Value', label: great ? 'Greatest value' : 'Least value' }, { name: 'Arrangement', label: 'Arrangement', mode: 'math', keys: 'intops', wide: true }],
      [valChk, arrChk], [String(target), arrSrc(best)], t(target) + ', from ' + t(arrTex(best) + '=' + target),
      'Try all six arrangements:<br>' + A.map(function (q) { return t(arrTex(q) + '=' + q.val); }).join('<br>') + '<br>The ' + (great ? 'greatest' : 'least') + ' value is <b>' + target + '</b>, from ' + t(arrTex(best)) + '.',
      [great ? 'To make it large, multiply the two numbers whose product is the biggest positive number.' : 'To make it small, multiply the two numbers whose product is the most negative.', 'There are only six arrangements — you can try them all.'], (great ? 'greatest ' : 'least ') + v.join(','));
    p.bad = [[String(other), arrSrc(A.filter(function (q) { return q.val === other; })[0])]];
    return p;
  }
})(window);
